import { YoutubeTranscript } from "youtube-transcript";

/**
 * Extract a YouTube video ID from various URL formats.
 */
export function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) return match[1];
  }
  return null;
}

/**
 * Fetch the transcript for a YouTube video.
 * Returns an array of { text, offset (seconds), duration (seconds) }.
 */
export async function getTranscript(videoId: string) {
  const items = await YoutubeTranscript.fetchTranscript(videoId);
  return items.map((item) => ({
    text: item.text,
    offset: Math.round(item.offset / 1000),   // ms → seconds
    duration: Math.round(item.duration / 1000),
  }));
}

/**
 * Build a plain-text transcript string with timestamps for the LLM prompt.
 */
export function formatTranscriptForPrompt(
  transcript: { text: string; offset: number }[],
): string {
  return transcript
    .map((t) => {
      const mins = Math.floor(t.offset / 60);
      const secs = t.offset % 60;
      return `[${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}] ${t.text}`;
    })
    .join("\n");
}

/**
 * Return thumbnail URLs for a video.
 * YouTube auto-generates thumbnails at ~25%, 50%, 75% of the video.
 */
export function getThumbnails(videoId: string) {
  return {
    maxres: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    hq: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    auto: [
      `https://img.youtube.com/vi/${videoId}/1.jpg`,
      `https://img.youtube.com/vi/${videoId}/2.jpg`,
      `https://img.youtube.com/vi/${videoId}/3.jpg`,
    ],
  };
}

/** Format seconds to MM:SS */
export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
