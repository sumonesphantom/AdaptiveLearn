"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DIAGNOSTIC } from "@/data/questions";
import { QuestionView } from "@/components/QuestionView";
import { setState, useAppState, type Attempt } from "@/lib/store";
import { getMastery } from "@/lib/ml";

export default function DiagnosticPage() {
  const router = useRouter();
  const [s, hydrated] = useAppState();
  const [started, setStarted] = useState(false);
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(() => DIAGNOSTIC.map(() => null));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const answered = answers.filter((a) => a !== null).length;
  const q = DIAGNOSTIC[i];

  async function submit() {
    setSubmitting(true);
    setError(null);
    const now = Date.now();
    const attempts: Attempt[] = DIAGNOSTIC.map((dq, k) => ({
      qid: dq.id,
      skill: dq.skill,
      chosen: answers[k] ?? -1,
      correct: answers[k] === dq.answer,
      context: "diagnostic",
      at: now + k,
    }));
    try {
      const m = await getMastery(attempts);
      setState({ attempts, diagnosticDone: true, baseline: m.mastery });
      router.push("/results");
    } catch (e) {
      setError((e as Error).message);
      setSubmitting(false);
    }
  }

  if (!started) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-14">
        <h1 className="text-4xl font-extrabold">Diagnostic test</h1>
        <p className="mt-4 text-lg text-ink-soft">
          {DIAGNOSTIC.length} questions covering every SAT skill area: 8 Math and 8 Reading &amp; Writing. Plan on about 20
          minutes. You won&apos;t see right or wrong until the end, just like the real test.
        </p>
        <p className="mt-3 text-ink-soft">
          Your answers feed a knowledge-tracing model that estimates your mastery of each skill. That&apos;s what your
          personal plan is built from.
        </p>
        {hydrated && s.diagnosticDone && (
          <p className="mt-4 rounded-lg bg-pencil/30 px-3 py-2 text-[15px]">
            You&apos;ve already taken it. Retaking replaces your previous results.{" "}
            <Link href="/results" className="font-bold underline underline-offset-4">See your results</Link>
          </p>
        )}
        <div className="mt-8 flex flex-wrap gap-3">
          <button onClick={() => setStarted(true)} className="cursor-pointer rounded-xl bg-ink px-6 py-3 text-lg font-bold text-sheet hover:bg-ink-soft">
            Start the diagnostic
          </button>
          <Link href="/curriculum" className="rounded-xl border-2 border-ink px-6 py-3 text-lg font-bold hover:bg-sheet">
            Skip and use the plain curriculum
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* Answer-sheet strip: one bubble per question, jump to any of them. */}
      <nav aria-label="Questions" className="mb-6">
        <div className="mb-2 flex justify-between text-sm text-graphite">
          <span>Question {i + 1} of {DIAGNOSTIC.length}</span>
          <span className="tabular">{answered} answered</span>
        </div>
        <ol className="flex flex-wrap gap-1.5">
          {DIAGNOSTIC.map((dq, k) => (
            <li key={dq.id}>
              <button
                onClick={() => setI(k)}
                aria-label={`Question ${k + 1}${answers[k] !== null ? ", answered" : ""}`}
                aria-current={k === i ? "step" : undefined}
                className={[
                  "grid size-8 cursor-pointer place-items-center rounded-full border-2 text-xs font-bold tabular",
                  answers[k] !== null ? "border-ink bg-pencil" : "border-rule bg-sheet",
                  k === i ? "ring-2 ring-ink ring-offset-2 ring-offset-paper" : "",
                ].join(" ")}
              >
                {k + 1}
              </button>
            </li>
          ))}
        </ol>
      </nav>

      <div className="rounded-2xl border border-rule bg-sheet p-5 sm:p-8">
        <QuestionView
          key={q.id}
          q={q}
          chosen={answers[i]}
          onChoose={(c) => setAnswers((a) => a.map((v, k) => (k === i ? c : v)))}
        />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          onClick={() => setI((v) => Math.max(0, v - 1))}
          disabled={i === 0}
          className="cursor-pointer rounded-xl border-2 border-ink px-5 py-2.5 font-bold disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>
        {i < DIAGNOSTIC.length - 1 ? (
          <button onClick={() => setI((v) => v + 1)} className="cursor-pointer rounded-xl bg-ink px-5 py-2.5 font-bold text-sheet hover:bg-ink-soft">
            Next question
          </button>
        ) : (
          <button
            onClick={submit}
            disabled={submitting}
            className="cursor-pointer rounded-xl bg-ink px-5 py-2.5 font-bold text-sheet hover:bg-ink-soft disabled:opacity-60"
          >
            {submitting ? "Scoring…" : answered < DIAGNOSTIC.length ? `Submit with ${DIAGNOSTIC.length - answered} unanswered` : "Submit diagnostic"}
          </button>
        )}
        {error && <p className="w-full text-wrong">{error}</p>}
      </div>
    </div>
  );
}
