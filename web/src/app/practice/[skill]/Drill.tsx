"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { bySkill } from "@/data/questions";
import { SKILLS, type SkillId } from "@/data/skills";
import { QuestionView } from "@/components/QuestionView";
import { Tutor } from "@/components/Tutor";
import { Sparkline } from "@/components/Sparkline";
import { setState, useAppState } from "@/lib/store";
import { useMastery } from "@/lib/useMastery";

export function Drill({ skill }: { skill: SkillId }) {
  const [s, hydrated] = useAppState();
  // Questions not seen in the diagnostic come first.
  const questions = useMemo(() => {
    const qs = bySkill(skill);
    return [...qs.filter((q) => !q.diagnostic), ...qs.filter((q) => q.diagnostic)];
  }, [skill]);
  const subskills = [...new Set(questions.map((q) => q.subskill))];

  const [i, setI] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [results, setResults] = useState<boolean[]>([]);

  const tracked = hydrated && s.pro && s.diagnosticDone;
  const { data } = useMastery(s.attempts, tracked);
  const startMastery = s.baseline?.[skill];

  const q = questions[i];
  const done = i >= questions.length;

  function check() {
    if (chosen === null) return;
    setChecked(true);
    setResults((r) => [...r, chosen === q.answer]);
    setState((st) => ({
      attempts: [
        ...st.attempts,
        { qid: q.id, skill, chosen, correct: chosen === q.answer, context: "practice", at: Date.now() },
      ],
    }));
  }

  function next() {
    setI((v) => v + 1);
    setChosen(null);
    setChecked(false);
  }

  const m = data?.mastery[skill];

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 lg:grid-cols-[1fr_20rem]">
      <div>
        <p className="text-graphite">{SKILLS[skill].section === "math" ? "Math" : "Reading & Writing"} practice</p>
        <h1 className="text-3xl font-extrabold">{SKILLS[skill].name}</h1>
        <p className="mt-2 text-[15px] text-graphite">Covers: {subskills.join(", ")}</p>

        {!done ? (
          <>
            <div className="mt-6 rounded-2xl border border-rule bg-sheet p-5 sm:p-8">
              <p className="mb-2 text-sm text-graphite tabular">Question {i + 1} of {questions.length}</p>
              <QuestionView key={q.id} q={q} chosen={chosen} onChoose={(c) => !checked && setChosen(c)} reveal={checked} />
              {checked && (
                <div className="mt-5">
                  <p className={chosen === q.answer ? "text-lg font-bold text-correct" : "text-lg font-bold text-wrong"}>
                    {chosen === q.answer ? "Correct." : "Not this time."}
                  </p>
                  <p className="mt-1">{q.explanation}</p>
                </div>
              )}
            </div>
            <div className="mt-5 flex gap-3">
              {!checked ? (
                <button
                  onClick={check}
                  disabled={chosen === null}
                  className="cursor-pointer rounded-xl bg-ink px-6 py-3 font-bold text-sheet hover:bg-ink-soft disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Check answer
                </button>
              ) : (
                <button onClick={next} className="cursor-pointer rounded-xl bg-ink px-6 py-3 font-bold text-sheet hover:bg-ink-soft">
                  {i < questions.length - 1 ? "Next question" : "Finish drill"}
                </button>
              )}
            </div>
            {checked && (
              <div className="mt-6">
                <Tutor key={q.id} q={q} chosen={chosen} />
              </div>
            )}
          </>
        ) : (
          <div className="mt-6 rounded-2xl border-2 border-ink bg-sheet p-6">
            <h2 className="text-2xl font-bold">Drill complete</h2>
            <p className="mt-2 text-ink-soft">
              {results.filter(Boolean).length} of {results.length} correct.
              {tracked && m !== undefined && startMastery !== undefined &&
                ` Mastery went from ${Math.round(startMastery * 100)}% at your diagnostic to ${Math.round(m * 100)}%.`}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href={tracked ? "/plan" : "/curriculum"} className="rounded-xl bg-ink px-5 py-2.5 font-bold text-sheet">
                {tracked ? "Back to my plan" : "Back to the curriculum"}
              </Link>
              <Link href="/progress" className="rounded-xl border-2 border-ink px-5 py-2.5 font-bold">See progress</Link>
            </div>
          </div>
        )}
      </div>

      {/* Live mastery from the BKT model */}
      <aside className="lg:pt-16">
        <div className="rounded-2xl border border-rule bg-sheet p-5 lg:sticky lg:top-6">
          <h2 className="font-bold">Your mastery</h2>
          {tracked && m !== undefined ? (
            <>
              <p className="mt-2 font-display text-5xl font-extrabold tabular">{Math.round(m * 100)}%</p>
              {startMastery !== undefined && (
                <p className="text-sm text-graphite tabular">
                  {Math.round(startMastery * 100)}% at diagnostic
                  {m - startMastery >= 0.005 ? `, up ${Math.round((m - startMastery) * 100)} points` : ""}
                </p>
              )}
              <div className="mt-4">
                <Sparkline values={data!.history[skill]} />
              </div>
              <p className="mt-3 text-sm text-graphite">
                Updated after every answer by a Bayesian Knowledge Tracing model. Getting a hard skill right moves it more than a lucky guess would.
              </p>
            </>
          ) : (
            <p className="mt-2 text-[15px] text-ink-soft">
              {!s.diagnosticDone
                ? "Take the diagnostic to track mastery as you practice."
                : "Live mastery tracking is part of personalization."}
            </p>
          )}
        </div>
      </aside>
    </div>
  );
}
