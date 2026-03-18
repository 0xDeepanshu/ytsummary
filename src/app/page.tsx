"use client";

import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setResponse("");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (data.text) {
        setResponse(data.text);
      } else {
        setResponse(data.error || "Something went wrong");
      }
    } catch (error) {
      setResponse("Failed to connect to the server");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#0a0a0a] text-zinc-900 dark:text-zinc-100 font-sans selection:bg-indigo-500/30">
      <main className="max-w-4xl mx-auto px-6 py-20 flex flex-col gap-12">
        <header className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/20">
              <Image
                src="/next.svg"
                alt="Next.js"
                width={24}
                height={24}
                className="invert"
              />
            </div>
            <h1 className="text-xl font-medium tracking-tight">Gemini Assistant</h1>
          </div>
          <p className="text-4xl sm:text-5xl font-semibold tracking-tight leading-tight max-w-2xl bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-500 dark:from-white dark:via-zinc-200 dark:to-zinc-500 bg-clip-text text-transparent">
            Experience the next generation of AI responses.
          </p>
        </header>

        <section className="relative group">
          <div className="absolute -inset-px bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition-opacity duration-500" />
          <form 
            onSubmit={handleSubmit}
            className="relative bg-white dark:bg-[#111] border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden"
          >
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask anything..."
              aria-label="Ask Gemini anything"
              className="w-full bg-transparent p-6 min-h-[160px] outline-none text-lg resize-none placeholder:text-zinc-400"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <div className="flex items-center justify-between px-6 py-4 bg-zinc-50/50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-800">
              <p className="text-xs text-zinc-500 font-medium">
                Press Enter to send, Shift + Enter for new line
              </p>
              <button
                type="submit"
                disabled={isLoading || !prompt.trim()}
                className="px-6 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-full font-medium transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 shadow-lg shadow-zinc-900/10 dark:shadow-white/10"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <title>Loading</title>
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Generating...
                  </span>
                ) : "Generate Response"}
              </button>
            </div>
          </form>
        </section>

        {response && (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-zinc-100/50 dark:bg-zinc-900/50 rounded-2xl p-8 border border-zinc-200 dark:border-zinc-800 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                <span className="text-sm font-semibold uppercase tracking-wider text-zinc-500">Gemini Response</span>
              </div>
              <div className="max-w-none text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
                {response}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
