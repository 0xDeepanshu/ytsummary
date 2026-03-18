"use client";

import { useState } from "react";

interface KeyMoment {
  timestamp: number;
  label: string;
  description: string;
  isMostViewed: boolean;
}

interface SummaryResult {
  videoId: string;
  title: string;
  summary: string;
  keyMoments: KeyMoment[];
  highlights: string[];
  mostViewedReason: string;
  thumbnails: {
    maxres: string;
    hq: string;
    auto: string[];
  };
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<SummaryResult | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsLoading(true);
    setResult(null);
    setError("");

    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setResult(data);
      }
    } catch {
      setError("Failed to connect to the server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const mostViewed = result?.keyMoments?.find((k) => k.isMostViewed);

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-[var(--font-geist-sans)]">
      {/* Ambient gradient blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-red-600/8 blur-[120px]" />
        <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] rounded-full bg-rose-600/6 blur-[100px]" />
      </div>

      <main className="max-w-5xl mx-auto px-6 py-16 flex flex-col gap-10">
        {/* ───── Header ───── */}
        <header className="space-y-3 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/60 text-xs font-medium text-zinc-400 mx-auto">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <title>AI</title>
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            Powered by Gemini
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-b from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent leading-tight">
            YouTube Summarizer
          </h1>
          <p className="text-zinc-500 text-lg max-w-lg mx-auto">
            Paste a YouTube link. Get an instant AI-powered summary with key moments and screenshots.
          </p>
        </header>

        {/* ───── URL Input ───── */}
        <section className="relative group max-w-2xl mx-auto w-full">
          <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-red-500/40 via-rose-500/30 to-orange-500/40 opacity-0 group-focus-within:opacity-100 blur transition-opacity duration-700" />
          <form
            onSubmit={handleSubmit}
            className="relative flex items-center gap-3 bg-zinc-900/80 border border-zinc-800 rounded-2xl px-5 py-3 backdrop-blur-sm"
          >
            {/* YouTube icon */}
            <svg className="shrink-0 text-red-500" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <title>YouTube</title>
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              aria-label="YouTube video URL"
              className="flex-1 bg-transparent outline-none text-base placeholder:text-zinc-600"
            />
            <button
              type="submit"
              disabled={isLoading || !url.trim()}
              className="shrink-0 px-5 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold rounded-xl transition-all active:scale-95 disabled:opacity-40 disabled:pointer-events-none shadow-lg shadow-red-600/20"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <title>Loading</title>
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Analyzing…
                </span>
              ) : (
                "Summarize"
              )}
            </button>
          </form>
        </section>

        {/* ───── Error ───── */}
        {error && (
          <div className="max-w-2xl mx-auto w-full text-center bg-red-950/40 border border-red-900/60 text-red-400 rounded-xl p-4 text-sm fade-in">
            {error}
          </div>
        )}

        {/* ───── Loading skeleton ───── */}
        {isLoading && (
          <div className="max-w-3xl mx-auto w-full space-y-6 fade-in">
            <div className="h-48 rounded-2xl bg-zinc-800/50 shimmer" />
            <div className="space-y-3">
              <div className="h-6 w-3/4 rounded-lg bg-zinc-800/50 shimmer" />
              <div className="h-4 w-full rounded-lg bg-zinc-800/50 shimmer" />
              <div className="h-4 w-5/6 rounded-lg bg-zinc-800/50 shimmer" />
            </div>
          </div>
        )}

        {/* ───── Results ───── */}
        {result && !isLoading && (
          <div className="space-y-8 fade-in">
            {/* Video Preview + Summary */}
            <section className="grid md:grid-cols-[1fr_1.2fr] gap-6">
              {/* Video embed */}
              <div className="rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900/60 aspect-video">
                <iframe
                  src={`https://www.youtube.com/embed/${result.videoId}`}
                  title={result.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>

              {/* Summary card */}
              <div className="bg-zinc-900/60 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6 flex flex-col gap-4">
                <h2 className="text-xl font-bold tracking-tight leading-snug">
                  {result.title}
                </h2>
                <p className="text-zinc-400 leading-relaxed text-[15px]">
                  {result.summary}
                </p>

                {/* Highlights */}
                <div className="mt-auto pt-4 border-t border-zinc-800 space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Key Takeaways</span>
                  <ul className="space-y-1.5">
                    {result.highlights?.map((h) => (
                      <li key={h} className="flex items-start gap-2 text-sm text-zinc-300">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Key Moments */}
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 rounded-full bg-red-500" />
                <h3 className="text-lg font-semibold tracking-tight">Key Moments</h3>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {result.keyMoments?.map((moment) => (
                  <a
                    key={moment.timestamp}
                    href={`https://youtube.com/watch?v=${result.videoId}&t=${moment.timestamp}s`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group/card relative p-4 rounded-xl border transition-all duration-300 hover:-translate-y-0.5 ${
                      moment.isMostViewed
                        ? "bg-red-950/30 border-red-800/60 hover:border-red-600/60 shadow-lg shadow-red-900/10"
                        : "bg-zinc-900/60 border-zinc-800 hover:border-zinc-700"
                    }`}
                  >
                    {moment.isMostViewed && (
                      <span className="absolute -top-2.5 right-3 px-2 py-0.5 bg-red-600 text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg shadow-red-600/30">
                        🔥 Most Viewed
                      </span>
                    )}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300">
                        {formatTime(moment.timestamp)}
                      </span>
                      <span className="text-sm font-medium text-zinc-200 group-hover/card:text-white transition-colors">
                        {moment.label}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      {moment.description}
                    </p>
                  </a>
                ))}
              </div>

              {/* Most-viewed reason */}
              {mostViewed && result.mostViewedReason && (
                <div className="flex items-start gap-3 bg-zinc-900/40 border border-zinc-800 rounded-xl p-4 text-sm text-zinc-400">
                  <span className="text-lg mt-0.5">💡</span>
                  <div>
                    <span className="font-medium text-zinc-300">Why "{mostViewed.label}" is likely the most replayed:</span>{" "}
                    {result.mostViewedReason}
                  </div>
                </div>
              )}
            </section>

            {/* Screenshots */}
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 rounded-full bg-rose-500" />
                <h3 className="text-lg font-semibold tracking-tight">Video Snapshots</h3>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {result.thumbnails.auto.map((src, i) => (
                  <div
                    key={src}
                    className="rounded-xl overflow-hidden border border-zinc-800 hover:border-zinc-600 transition-all duration-300 hover:-translate-y-0.5 group/thumb"
                  >
                    <img
                      src={src}
                      alt={`Video snapshot ${i + 1}`}
                      className="w-full aspect-video object-cover group-hover/thumb:scale-105 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-xs text-zinc-600 border-t border-zinc-900">
        Built with Gemini AI &amp; Next.js
      </footer>
    </div>
  );
}
