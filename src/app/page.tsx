"use client";

import { useState } from "react";
import type { SummaryResult } from "@/types/youtube";
import {
  SparkIcon,
  YouTubeIcon,
  PlayIcon,
  ChevronRight,
  InfoIcon,
  FireIcon,
} from "@/components/Icons";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";

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
    const trimmed = url.trim();
    if (!trimmed) return;

    setIsLoading(true);
    setResult(null);
    setError("");

    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmed }),
      });
      const data = await res.json();
      if (data.error) setError(data.error);
      else setResult(data);
    } catch {
      setError("Failed to connect to the server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const mostViewed = result?.keyMoments?.find((k) => k.isMostViewed);

  return (
    <div className="min-h-dvh bg-[#07070a] text-zinc-100 font-[var(--font-geist-sans)] selection:bg-red-500/25">
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-64 -left-64 w-[700px] h-[700px] rounded-full bg-red-700/6 blur-[140px]" />
        <div className="absolute top-1/3 -right-48 w-[550px] h-[550px] rounded-full bg-red-900/5 blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full bg-rose-800/4 blur-[100px]" />
        {/* Subtle noise grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:72px_72px]" />
      </div>

      {/* ── Nav ── */}
      <nav className="sticky top-0 z-40 border-b border-white/5 bg-[#07070a]/80 backdrop-blur-xl backdrop-saturate-150">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-red-600/90 shadow-lg shadow-red-600/30">
              <YouTubeIcon className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-sm tracking-tight text-white">YT&nbsp;Summarizer</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-white/8 bg-white/4 text-[11px] font-medium text-zinc-400">
            <SparkIcon />
            Gemini AI
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20 flex flex-col gap-12 sm:gap-16">
        {/* ══ Hero ══ */}
        <section className="text-center space-y-6 fade-in">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-red-500/20 bg-red-500/8 text-xs font-semibold text-red-400 tracking-wide uppercase">
            <SparkIcon />
            AI-Powered Video Intelligence
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08]">
            <span className="text-white">Understand any</span>
            <br />
            <span className="bg-gradient-to-r from-red-400 via-rose-400 to-orange-400 bg-clip-text text-transparent">
              YouTube video
            </span>
            <br />
            <span className="text-white">in seconds</span>
          </h1>

          <p className="text-zinc-500 text-base sm:text-lg max-w-md mx-auto leading-relaxed">
            Get precise summaries, key moments with timestamps, and the most-watched sections — no scrubbing required.
          </p>

          {/* ── URL Input ── */}
          <div className="relative max-w-2xl mx-auto w-full group/form mt-2">
            {/* Glowing border on focus */}
            <div className="" aria-hidden="true" />

            <form
              onSubmit={handleSubmit}
              className="relative flex flex-col sm:flex-row items-stretch sm:items-center gap-3 glass-card rounded-2xl px-4 sm:px-5 py-3.5 sm:py-3"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <YouTubeIcon className="shrink-0 w-5 h-5 text-red-500" />
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Paste YouTube URL here…"
                  aria-label="YouTube video URL"
                  className="flex-1 min-w-0 bg-transparent outline-none text-sm sm:text-base placeholder:text-zinc-600 text-zinc-100 touch-manipulation "
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSubmit(e);
                  }}
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || !url.trim()}
                className="shrink-0 inline-flex items-center justify-center gap-2 px-6 py-2.5 sm:py-2 text-sm font-semibold rounded-xl bg-red-600 hover:bg-red-500 active:scale-95 text-white transition-all duration-150 disabled:opacity-40 disabled:pointer-events-none shadow-lg shadow-red-600/25 cursor-pointer min-h-[44px]"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Analyzing…</span>
                  </>
                ) : (
                  <>
                    <SparkIcon />
                    <span>Summarize</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Feature badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-zinc-500">
            {["Key Moments", "Most-Viewed Sections", "Video Snapshots", "Instant Highlights"].map((f) => (
              <span key={f} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-white/6 bg-white/3">
                <span className="w-1 h-1 rounded-full bg-red-500/70 shrink-0" aria-hidden="true" />
                {f}
              </span>
            ))}
          </div>
        </section>

        {/* ══ Error ══ */}
        {error && (
          <div
            role="alert"
            className="max-w-2xl mx-auto w-full flex items-start gap-3 bg-red-950/30 border border-red-800/50 text-red-400 rounded-xl p-4 text-sm fade-in"
          >
            <InfoIcon />
            <p>{error}</p>
          </div>
        )}

        {/* ══ Loading ══ */}
        {isLoading && <LoadingSkeleton />}

        {/* ══ Results ══ */}
        {result && !isLoading && (
          <div className="space-y-8 fade-in">

            {/* ── Video + Summary ── */}
            <section aria-labelledby="summary-heading" className="grid md:grid-cols-[1.05fr_1fr] gap-5">
              {/* Embedded player */}
              <div className="rounded-2xl overflow-hidden border border-white/8 bg-black aspect-video shadow-2xl shadow-black/50">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${result.videoId}?rel=0`}
                  title={result.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full"
                  loading="lazy"
                />
              </div>

              {/* Summary card */}
              <div className="glass-card rounded-2xl p-5 sm:p-6 flex flex-col gap-4">
                <div>
                  <h2 id="summary-heading" className="text-lg sm:text-xl font-bold tracking-tight leading-snug text-white">
                    {result.title}
                  </h2>
                </div>

                <p className="text-zinc-400 leading-relaxed text-sm sm:text-[15px] flex-1">
                  {result.summary}
                </p>

                {/* Key Takeaways */}
                {result.highlights?.length > 0 && (
                  <div className="pt-4 border-t border-white/6 space-y-2.5">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-600">
                      Key Takeaways
                    </p>
                    <ul className="space-y-2" aria-label="Key takeaways">
                      {result.highlights.map((h) => (
                        <li key={h} className="flex items-start gap-2.5 text-sm text-zinc-300">
                          <ChevronRight />
                          <span className="leading-relaxed">{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>

            {/* ── Key Moments ── */}
            {result.keyMoments?.length > 0 && (
              <section aria-labelledby="moments-heading" className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="block w-0.5 h-5 rounded-full bg-gradient-to-b from-red-400 to-rose-600" aria-hidden="true" />
                  <h3 id="moments-heading" className="text-base sm:text-lg font-semibold tracking-tight">Key Moments</h3>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {result.keyMoments.map((moment) => (
                    <a
                      key={moment.timestamp}
                      href={`https://youtube.com/watch?v=${result.videoId}&t=${moment.timestamp}s`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Jump to ${moment.label} at ${formatTime(moment.timestamp)}`}
                      className={[
                        "group/card relative flex flex-col gap-2.5 p-4 rounded-xl border transition-all duration-200 hover:-translate-y-0.5 cursor-pointer",
                        moment.isMostViewed
                          ? "bg-gradient-to-br from-red-950/40 to-rose-950/20 border-red-700/40 hover:border-red-500/60 shadow-lg shadow-red-950/20"
                          : "glass-card hover:border-white/15",
                      ].join(" ")}
                    >
                      {/* Most viewed badge */}
                      {moment.isMostViewed && (
                        <span className="absolute -top-2.5 right-3 inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-red-600 to-rose-500 text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg shadow-red-600/30 text-white">
                          <FireIcon />
                          Most Viewed
                        </span>
                      )}

                      <div className="flex items-center gap-2">
                        {/* Timestamp pill */}
                        <span className="inline-flex items-center gap-1 font-mono text-[11px] px-2 py-0.5 rounded-md bg-zinc-800/80 text-zinc-400 border border-white/6 tabular-nums">
                          <PlayIcon />
                          {formatTime(moment.timestamp)}
                        </span>
                        <span className="text-sm font-semibold text-zinc-200 group-hover/card:text-white transition-colors leading-tight">
                          {moment.label}
                        </span>
                      </div>

                      <p className="text-xs text-zinc-500 leading-relaxed">
                        {moment.description}
                      </p>
                    </a>
                  ))}
                </div>

                {/* Most-viewed insight */}
                {mostViewed && result.mostViewedReason && (
                  <div className="flex items-start gap-3 glass-card rounded-xl p-4 text-sm text-zinc-400 border-l-2 border-l-red-600/60">
                    <InfoIcon />
                    <p>
                      <span className="font-semibold text-zinc-200">Why "{mostViewed.label}" gets the most replays: </span>
                      {result.mostViewedReason}
                    </p>
                  </div>
                )}
              </section>
            )}

            {/* ── Video Snapshots ── */}
            {result.thumbnails?.auto?.length > 0 && (
              <section aria-labelledby="snapshots-heading" className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="block w-0.5 h-5 rounded-full bg-gradient-to-b from-rose-400 to-orange-500" aria-hidden="true" />
                  <h3 id="snapshots-heading" className="text-base sm:text-lg font-semibold tracking-tight">Video Snapshots</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {result.thumbnails.auto.map((src, i) => (
                    <div
                      key={src}
                      className="group/snap relative overflow-hidden rounded-xl border border-white/8 bg-zinc-900 hover:border-white/20 transition-all duration-300 hover:-translate-y-0.5 shadow-lg shadow-black/30"
                    >
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={src}
                          alt={`Video snapshot ${i + 1} of 3`}
                          width={480}
                          height={270}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover/snap:scale-105"
                        />
                      </div>
                      <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover/snap:opacity-100 transition-opacity duration-300 pointer-events-none flex items-end px-3 pb-2">
                        <span className="text-[10px] font-medium text-zinc-300">Snapshot {i + 1}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ── Try another ── */}
            <div className="text-center pt-4">
              <button
                type="button"
                onClick={() => {
                  setResult(null);
                  setUrl("");
                  setError("");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-zinc-400 hover:text-white border border-white/8 hover:border-white/20 rounded-xl transition-all duration-150 cursor-pointer hover:bg-white/4 min-h-[44px]"
              >
                <SparkIcon />
                Summarize another video
              </button>
            </div>
          </div>
        )}
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-600">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-5 h-5 rounded-md bg-red-600/80">
              <YouTubeIcon className="w-3 h-3 text-white" />
            </div>
            <span className="font-medium text-zinc-500">YT Summarizer</span>
          </div>
          <span>Built with Gemini AI &amp; Next.js — summaries powered by transcript analysis</span>
        </div>
      </footer>
    </div>
  );
}
