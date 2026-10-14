"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { QUESTIONS } from "@/data/questions";
import { QuestionView } from "./QuestionView";
import { setState, useAppState } from "@/lib/store";

const SAMPLE = QUESTIONS.find((q) => q.id === "psda-2")!;

export function HeroSample() {
  const [chosen, setChosen] = useState<number | null>(null);
  return (
    <div className="rounded-2xl border-2 border-ink bg-sheet p-5 shadow-[6px_6px_0_var(--ink)] sm:p-6">
      <p className="mb-4 text-sm font-bold text-graphite">Try one. No sign-up.</p>
      <QuestionView q={SAMPLE} chosen={chosen} onChoose={setChosen} reveal={chosen !== null} compact />
      {chosen !== null && (
        <div className="mt-4 text-[15px]">
          <p className={chosen === SAMPLE.answer ? "font-bold text-correct" : "font-bold text-wrong"}>
            {chosen === SAMPLE.answer ? "Correct." : "Not quite."}
          </p>
          <p className="mt-1">{SAMPLE.explanation}</p>
          <p className="mt-3 text-graphite">
            That&apos;s one data point. The <Link href="/diagnostic" className="font-bold text-ink underline underline-offset-4">diagnostic</Link> uses 16 like it to map all 8 SAT skill areas.
          </p>
        </div>
      )}
    </div>
  );
}

const CHANNELS: Record<string, string> = { skool: "Skool", youtube: "YouTube", instagram: "Instagram", tiktok: "TikTok" };

export function RefWelcome() {
  const [s, hydrated] = useAppState();
  useEffect(() => {
    const ref = new URLSearchParams(window.location.search).get("ref");
    if (ref) setState({ ref: ref.toLowerCase() });
  }, []);
  if (!hydrated || !s.ref) return null;
  return <p className="mb-4 text-[15px] text-graphite">Welcome from {CHANNELS[s.ref] ?? s.ref}. Everything here is free to start.</p>;
}
