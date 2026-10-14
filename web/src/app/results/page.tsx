"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { QUESTIONS } from "@/data/questions";
import { SKILLS } from "@/data/skills";
import { MasteryBars } from "@/components/MasteryBars";
import { QuestionView } from "@/components/QuestionView";
import { Tutor } from "@/components/Tutor";
import { setState, useAppState } from "@/lib/store";
import { useMastery } from "@/lib/useMastery";

export default function ResultsPage() {
  const [s, hydrated] = useAppState();
  const diag = s.attempts.filter((a) => a.context === "diagnostic");
  const { data, error } = useMastery(diag, hydrated && diag.length > 0);
  const [open, setOpen] = useState<string | null>(null);

  if (!hydrated) return null;
  if (!s.diagnosticDone) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-14">
        <h1 className="text-3xl font-bold">No results yet</h1>
        <p className="mt-3 text-ink-soft">Take the diagnostic to see your score estimate and the skills to focus on.</p>
        <Link href="/diagnostic" className="mt-6 inline-block rounded-xl bg-ink px-6 py-3 font-bold text-sheet">Take the diagnostic</Link>
      </div>
    );
  }

  const correct = diag.filter((a) => a.correct).length;
  const missed = diag.filter((a) => !a.correct);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-4xl font-extrabold">Your diagnostic results</h1>
      {error && <p className="mt-4 text-wrong">{error}</p>}

      {data && (
        <>
          <section className="mt-8 flex flex-wrap items-end gap-x-12 gap-y-6 border-b border-rule pb-8">
            <div>
              <p className="text-graphite">Estimated SAT score</p>
              <p className="font-display text-7xl font-extrabold tabular">{data.estimate.total}</p>
            </div>
            <dl className="flex gap-10">
              <div>
                <dt className="text-graphite">Math</dt>
                <dd className="font-display text-3xl font-bold tabular">{data.estimate.math}</dd>
              </div>
              <div>
                <dt className="text-graphite">Reading &amp; Writing</dt>
                <dd className="font-display text-3xl font-bold tabular">{data.estimate.rw}</dd>
              </div>
              <div>
                <dt className="text-graphite">Correct</dt>
                <dd className="font-display text-3xl font-bold tabular">{correct}/{diag.length}</dd>
              </div>
            </dl>
            <p className="w-full max-w-[70ch] text-sm text-graphite">
              A rough estimate from 16 questions. It gets sharper as you practice, because the model updates after every answer.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="text-2xl font-bold">Mastery by skill</h2>
            {s.pro ? (
              <p className="mt-2 max-w-[70ch] text-ink-soft">
                Your focus skills combine low mastery with a big share of the test:{" "}
                <strong>{data.weakest.slice(0, 3).map((k) => SKILLS[k].name).join(", ")}</strong>.
              </p>
            ) : (
              <p className="mt-2 max-w-[70ch] text-ink-soft">
                Unlock personalization to see which skills to focus on first and get a day-by-day plan.
              </p>
            )}
            <div className="mt-6">
              <MasteryBars mastery={data.mastery} weakest={s.pro ? data.weakest : []} />
            </div>
          </section>

          {s.pro ? <PlanSetup /> : <Upsell />}
        </>
      )}

      {missed.length > 0 && (
        <section className="mt-14">
          <h2 className="text-2xl font-bold">Review what you missed</h2>
          <ul className="mt-4 divide-y divide-rule rounded-2xl border border-rule bg-sheet">
            {missed.map((a) => {
              const q = QUESTIONS.find((x) => x.id === a.qid)!;
              const isOpen = open === q.id;
              return (
                <li key={q.id}>
                  <button
                    onClick={() => setOpen(isOpen ? null : q.id)}
                    aria-expanded={isOpen}
                    className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left hover:bg-paper"
                  >
                    <span>
                      <span className="text-sm text-graphite">{SKILLS[q.skill].name}</span>
                      <span className="block font-bold">{q.prompt}</span>
                    </span>
                    <span className="text-sm font-bold text-graphite">{isOpen ? "Hide" : "Review"}</span>
                  </button>
                  {isOpen && (
                    <div className="space-y-5 px-5 pb-6">
                      <QuestionView q={q} chosen={a.chosen >= 0 ? a.chosen : null} onChoose={() => {}} reveal compact />
                      <p><strong>Why:</strong> {q.explanation}</p>
                      <Tutor q={q} chosen={a.chosen >= 0 ? a.chosen : null} />
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}

function Upsell() {
  return (
    <section className="mt-12 rounded-2xl border-2 border-ink bg-sheet p-6 sm:p-8">
      <h2 className="text-2xl font-bold">Turn these results into a plan</h2>
      <p className="mt-2 max-w-[60ch] text-ink-soft">
        Personalization ranks your skills by points at stake, builds a day-by-day schedule to your test date, sends
        reminders and tracks mastery as you practice.
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <button onClick={() => setState({ pro: true })} className="cursor-pointer rounded-xl bg-ink px-6 py-3 font-bold text-sheet hover:bg-ink-soft">
          Unlock personalization
        </button>
        <Link href="/curriculum" className="rounded-xl border-2 border-ink px-6 py-3 font-bold">Keep using the free curriculum</Link>
      </div>
      <p className="mt-3 text-sm text-graphite">Demo: payment is mocked. In production this opens Stripe Checkout.</p>
    </section>
  );
}

function PlanSetup() {
  const router = useRouter();
  const [s] = useAppState();
  const [days, setDays] = useState(s.days);
  const [minutes, setMinutes] = useState(s.minutesPerDay);
  const [reminder, setReminder] = useState(s.reminder);

  const testDate = new Date();
  testDate.setDate(testDate.getDate() + days - 1);

  return (
    <section className="mt-12 rounded-2xl border-2 border-ink bg-sheet p-6 sm:p-8">
      <h2 className="text-2xl font-bold">Build your plan</h2>
      <form
        className="mt-6 grid gap-8 md:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault();
          setState({ days, minutesPerDay: minutes, reminder });
          router.push("/plan");
        }}
      >
        <div>
          <label htmlFor="days" className="font-bold">How many days until your test?</label>
          <div className="mt-2 flex items-center gap-4">
            <input id="days" type="range" min={14} max={180} step={1} value={days} onChange={(e) => setDays(+e.target.value)} className="flex-1 accent-[var(--ink)]" />
            <span className="w-20 text-right font-display text-2xl font-bold tabular">{days}</span>
          </div>
          <p className="mt-1 text-sm text-graphite">
            Test day around {testDate.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}.
            {days === 90 && " 90 days is the default."}
          </p>

          <fieldset className="mt-6">
            <legend className="font-bold">Minutes per day</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {[30, 45, 60, 90].map((m) => (
                <label key={m} className={`cursor-pointer rounded-lg border-2 px-4 py-2 font-bold ${minutes === m ? "border-ink bg-pencil" : "border-rule"}`}>
                  <input type="radio" name="minutes" className="sr-only" checked={minutes === m} onChange={() => setMinutes(m)} />
                  {m}
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <fieldset>
          <legend className="font-bold">Daily reminders</legend>
          <label htmlFor="time" className="mt-3 block text-sm text-graphite">Remind me at</label>
          <input
            id="time"
            type="time"
            value={reminder.time}
            onChange={(e) => setReminder({ ...reminder, time: e.target.value })}
            className="mt-1 rounded-lg border border-rule px-3 py-2 text-lg"
          />
          <div className="mt-4 space-y-2">
            {([
              ["email", "Email reminder for each study day"],
              ["push", "Browser notification"],
              ["exam", "Countdown reminders before test day"],
            ] as const).map(([k, label]) => (
              <label key={k} className="flex cursor-pointer items-center gap-3">
                <input type="checkbox" checked={reminder[k]} onChange={(e) => setReminder({ ...reminder, [k]: e.target.checked })} className="size-5 accent-[var(--ink)]" />
                {label}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="md:col-span-2">
          <button className="cursor-pointer rounded-xl bg-ink px-6 py-3 text-lg font-bold text-sheet hover:bg-ink-soft">Build my {days}-day plan</button>
        </div>
      </form>
    </section>
  );
}
