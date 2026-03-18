import { NextResponse } from "next/server";
import ai from "@/lib/gemini";
import {
  extractVideoId,
  getTranscript,
  formatTranscriptForPrompt,
  getThumbnails,
} from "@/lib/youtube";

const SYSTEM_PROMPT = `You are an expert YouTube video analyst. You will receive a transcript of a YouTube video with timestamps.

Your job is to produce a JSON response with EXACTLY this structure (no markdown, no code fences, just raw JSON):

{
  "title": "A concise, descriptive title for the video based on its content",
  "summary": "A clear, concise summary of the video in 3-5 sentences. Focus on the core message and main takeaways.",
  "keyMoments": [
    {
      "timestamp": 120,
      "label": "Short label for this moment (3-6 words)",
      "description": "One sentence describing what happens at this moment",
      "isMostViewed": false
    }
  ],
  "highlights": [
    "Key takeaway 1",
    "Key takeaway 2",
    "Key takeaway 3"
  ],
  "mostViewedReason": "A brief explanation of why the most-viewed section is likely the most popular part of the video"
}

Rules:
- Return between 3 and 5 keyMoments.
- Mark exactly ONE keyMoment as "isMostViewed": true — the section that is most likely to be the most replayed/popular based on content engagement patterns (surprising reveals, tutorials, key demonstrations, dramatic moments, etc.).
- Timestamps must be integers (seconds).
- highlights should contain exactly 3 short bullet-point takeaways.
- Keep the summary SHORT and PUNCHY — no fluff.
- Do NOT wrap the JSON in markdown code fences.`;

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "YouTube URL is required" }, { status: 400 });
    }

    const videoId = extractVideoId(url);
    if (!videoId) {
      return NextResponse.json({ error: "Invalid YouTube URL" }, { status: 400 });
    }

    // 1. Get transcript
    let transcript;
    try {
      transcript = await getTranscript(videoId);
    } catch {
      return NextResponse.json(
        { error: "Could not fetch transcript. The video may not have captions enabled." },
        { status: 422 },
      );
    }

    if (!transcript.length) {
      return NextResponse.json(
        { error: "No transcript available for this video." },
        { status: 422 },
      );
    }

    // 2. Format transcript for the prompt
    const formattedTranscript = formatTranscriptForPrompt(transcript);

    // 3. Send to Gemini
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Here is the transcript of a YouTube video:\n\n${formattedTranscript}`,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.3,
      },
    });

    const rawText = response.text ?? "";

    // 4. Parse the JSON response
    let parsed;
    try {
      // Strip potential markdown fences
      const cleaned = rawText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      return NextResponse.json(
        { error: "Failed to parse AI response. Please try again." },
        { status: 500 },
      );
    }

    // 5. Attach thumbnails
    const thumbnails = getThumbnails(videoId);

    return NextResponse.json({
      videoId,
      thumbnails,
      ...parsed,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
