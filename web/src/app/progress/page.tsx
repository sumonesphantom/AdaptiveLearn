"use client";

import Link from "next/link";
import { SKILLS, SKILL_IDS } from "@/data/skills";
import { MasteryBars } from "@/components/MasteryBars";
import { Sparkline } from "@/components/Sparkline";
import { resetState, useAppState } from "@/lib/store";
import { useMastery } from "@/lib/useMastery";

export default function ProgressPage() {
  const [s, hydrated] = useAppState();
  const diag = s.attempts.filter((a) => a.context === "diagnostic");
  const ok = hydrated && s.diagnosticDone;
  const { data: now, error } = useMastery(s.attempts, ok);
  const { data: then } = useMastery(diag, ok);

  if (!hydrated) return null;
  if (!s.diagnosticDone) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-14">
        <h1 className="text-3xl font-bold">Nothing to show yet</h1>
        <p className="mt-3 text-ink-soft">Progress starts from your diagnostic. It takes about 20 minutes.</p>
        <Link href="/diagnostic" className="mt-6 inline-block rounded-xl bg-ink px-6 py-3 font-bold text-sheet">Take the diagnostic</Link>
      </div>
    );
  }

  const practice = s.attempts.filter((a) => a.context === "practice");
  const acc = practice.length ? Math.round((practice.filter((a) => a.correct).length / practice.length) * 100) : null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-4xl font-extrabold">Progress</h1>
      {error && <p className="mt-4 text-wrong">{error}</p>}
      {now && then && (
        <>
          <dl className="mt-8 flex flex-wrap gap-x-14 gap-y-6 border-b border-rule pb-8">
            <div>
              <dt className="text-graphite">Estimated score</dt>
              <dd className="font-display text-5xl font-extrabold tabular">
                {now.estimate.total}
                {now.estimate.total > then.estimate.total && (
                  <span className="ml-3 text-2xl text-correct">+{now.estimate.total - then.estimate.total}</span>
                )}
              </dd>
              <dd className="text-sm text-graphite tabular">{then.estimate.total} at diagnostic</dd>
            </div>
            <div>
              <dt className="text-graphite">Practice questions</dt>
              <dd className="font-display text-5xl font-extrabold tabular">{practice.length}</dd>
            </div>
            <div>
              <dt className="text-graphite">Practice accuracy</dt>
              <dd className="font-display text-5xl font-extrabold tabular">{acc === null ? "–" : `${acc}%`}</dd>
            </div>
          </dl>

          <section className="mt-10">
            <h2 className="text-2xl font-bold">Mastery since your diagnostic</h2>
            <p className="mt-1 text-sm text-graphite">Grey shows where you started.</p>
            <div className="mt-6">
              <MasteryBars mastery={now.mastery} baseline={then.mastery} weakest={s.pro ? now.weakest : []} />
            </div>
          </section>

          <section className="mt-12">
            <h2 className="text-2xl font-bold">Trend by skill</h2>
            <ul className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {SKILL_IDS.map((k) => (
                <li key={k}>
                  <Link href={`/practice/${k}`} className="block rounded-xl border border-rule bg-sheet p-4 hover:border-ink">
                    <p className="font-bold">{SKILLS[k].name}</p>
                    <p className="text-sm text-graphite tabular">
                      {now.answered[k].n} answers, {Math.round(now.mastery[k] * 100)}%
                    </p>
                    <div className="mt-2">
                      <Sparkline values={now.history[k]} height={44} />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
      <button
        onClick={() => {
          if (confirm("Clear all demo data?")) resetState();
        }}
        className="mt-14 cursor-pointer text-sm text-graphite underline underline-offset-4"
      >
        Reset demo data
      </button>
    </div>
  );
}
