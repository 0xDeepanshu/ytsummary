import React from "react";

export function LoadingSkeleton() {
  return (
    <div className="w-full space-y-6 fade-in" aria-busy="true" aria-label="Loading summary">
      {/* video + summary skeleton */}
      <div className="grid md:grid-cols-2 gap-5">
        <div className="aspect-video rounded-2xl glass-card shimmer" />
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <div className="h-5 w-3/4 rounded-lg shimmer" />
          <div className="h-4 w-full rounded-lg shimmer" />
          <div className="h-4 w-5/6 rounded-lg shimmer" />
          <div className="h-4 w-4/6 rounded-lg shimmer" />
          <div className="pt-4 border-t border-white/5 space-y-2">
            <div className="h-3 w-1/4 rounded shimmer" />
            <div className="h-4 w-full rounded shimmer" />
            <div className="h-4 w-5/6 rounded shimmer" />
            <div className="h-4 w-4/5 rounded shimmer" />
          </div>
        </div>
      </div>
      {/* moments skeleton */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {[...Array(3)].map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
          <div key={i} className="glass-card rounded-xl p-4 space-y-2 h-24 shimmer" />
        ))}
      </div>
    </div>
  );
}
