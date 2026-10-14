"use client";

import { setState, useAppState } from "@/lib/store";

export function ProBadge() {
  const [s, hydrated] = useAppState();
  if (!hydrated) return <span className="inline-block h-8 w-28" />;
  return s.pro ? (
    <button
      onClick={() => setState({ pro: false })}
      title="Demo: switch back to the free tier"
      className="cursor-pointer rounded-full bg-pencil px-3 py-1 text-sm font-bold text-ink"
    >
      Personalized plan
    </button>
  ) : (
    <button
      onClick={() => setState({ pro: true })}
      title="Demo: payments are mocked"
      className="cursor-pointer rounded-full border border-ink px-3 py-1 text-sm font-bold hover:bg-ink hover:text-sheet"
    >
      Unlock personalization
    </button>
  );
}
