"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SKILLS, SKILL_IDS } from "@/data/skills";
import { getPlan, type PlanDay, type PlanResult } from "@/lib/ml";
import { setState, useAppState } from "@/lib/store";
import { useMastery } from "@/lib/useMastery";

const KIND_STYLE: Record<PlanDay["kind"], string> = {
  study: "bg-ink",
  mock: "bg-pencil border-2 border-ink",
  taper: "bg-ink-soft/50",
  rest: "bg-sheet border-2 border-ink",
};
const KIND_LABEL: Record<PlanDay["kind"], string> = {
  study: "Study day",
  mock: "Full practice test",
  taper: "Lighter final week",
  rest: "Rest before test day",
};

const fmt = (iso: string, opts: Intl.DateTimeFormatOptions) => new Date(`${iso}T12:00:00`).toLocaleDateString(undefined, opts);

export default function PlanPage() {
  const [s, hydrated] = useAppState();
  const ready = hydrated && s.diagnosticDone && s.pro;
  const { data: mastery, error: mErr } = useMastery(s.attempts, ready);
  const [plan, setPlan] = useState<PlanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState(0);
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    if (!mastery) return;
    getPlan(mastery.mastery, s.days, s.minutesPerDay).then(setPlan).catch((e) => setError((e as Error).message));
  }, [mastery, s.days, s.minutesPerDay]);

  if (!hydrated) return null;
  if (!s.diagnosticDone || !s.pro) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-14">
        <h1 className="text-3xl font-bold">Your plan isn&apos;t set up yet</h1>
        <p className="mt-3 text-ink-soft">
          {!s.diagnosticDone
            ? "Take the diagnostic first. Your plan is built from it."
            : "Personalized plans are part of the paid tier."}
        </p>
        <div className="mt-6 flex gap-3">
          {!s.diagnosticDone ? (
            <Link href="/diagnostic" className="rounded-xl bg-ink px-6 py-3 font-bold text-sheet">Take the diagnostic</Link>
          ) : (
            <button onClick={() => setState({ pro: true })} className="cursor-pointer rounded-xl bg-ink px-6 py-3 font-bold text-sheet">Unlock personalization</button>
          )}
        </div>
      </div>
    );
  }

  const err = error ?? mErr;
  if (err) return <p className="mx-auto max-w-2xl px-4 py-14 text-wrong">{err}</p>;
  if (!plan || !mastery) return <p className="mx-auto max-w-2xl px-4 py-14 text-graphite">Building your plan…</p>;

  const today = plan.days[0];
  const day = plan.days[selected];
  const testDay = plan.days[plan.days.length - 1];
  const share = SKILL_IDS.map((k) => ({ k, v: plan.summary.share[k] ?? 0 })).sort((a, b) => b.v - a.v);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold">Your {plan.summary.total_days}-day plan</h1>
          <p className="mt-2 text-ink-soft">
            {s.minutesPerDay} minutes a day, {plan.summary.mock_tests} full practice tests, test day around{" "}
            {fmt(testDay.date, { month: "long", day: "numeric" })}.
          </p>
        </div>
        <Link href="/results" className="font-bold underline underline-offset-4">Change days or reminders</Link>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_1fr]">
        {/* Today */}
        <section className="rounded-2xl border-2 border-ink bg-sheet p-6">
          <p className="text-graphite">Today, {fmt(today.date, { weekday: "long", month: "short", day: "numeric" })}</p>
          <h2 className="mt-1 text-2xl font-bold">Day 1</h2>
          <ul className="mt-5 space-y-3">
            {today.blocks.map((b, i) => (
              <li key={i} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-rule px-4 py-3">
                <div>
                  <p className="font-bold">{b.title}</p>
                  <p className="text-sm text-graphite">
                    {b.minutes} min{b.questions ? `, ${b.questions} questions` : ""}
                  </p>
                </div>
                {b.skill && (
                  <Link href={`/practice/${b.skill}`} className="rounded-lg bg-ink px-4 py-2 font-bold text-sheet hover:bg-ink-soft">
                    Start
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </section>

        {/* Where the time goes */}
        <section>
          <h2 className="text-xl font-bold">Where your time goes</h2>
          <p className="mt-1 text-sm text-graphite">More time goes to skills with low mastery and a big share of the test.</p>
          <ul className="mt-4 space-y-2.5">
            {share.map(({ k, v }) => (
              <li key={k} className="grid grid-cols-[10rem_1fr_3rem] items-center gap-3 text-[15px]">
                <span className="truncate">{SKILLS[k].name}</span>
                <span className="h-2.5 rounded-full bg-rule">
                  <span className="block h-full rounded-full bg-ink" style={{ width: `${Math.round(v * 100 / share[0].v)}%` }} />
                </span>
                <span className="text-right tabular text-graphite">{Math.round(v * 100)}%</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Calendar */}
      <section className="mt-12">
        <h2 className="text-xl font-bold">Every day until the test</h2>
        <div className="mt-3 flex flex-wrap gap-4 text-sm text-graphite">
          {(Object.keys(KIND_LABEL) as PlanDay["kind"][]).map((k) => (
            <span key={k} className="inline-flex items-center gap-2">
              <span className={`inline-block size-3.5 rounded ${KIND_STYLE[k]}`} />
              {KIND_LABEL[k]}
            </span>
          ))}
        </div>
        <ol className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(2.25rem,1fr))] gap-1.5">
          {plan.days.map((d, i) => (
            <li key={d.day}>
              <button
                onClick={() => setSelected(i)}
                aria-label={`Day ${d.day}, ${fmt(d.date, { month: "short", day: "numeric" })}: ${KIND_LABEL[d.kind]}`}
                aria-pressed={selected === i}
                className={`grid aspect-square w-full cursor-pointer place-items-center rounded-md text-[11px] font-bold tabular ${KIND_STYLE[d.kind]} ${
                  d.kind === "study" || d.kind === "taper" ? "text-sheet" : "text-ink"
                } ${selected === i ? "ring-2 ring-pencil-deep ring-offset-2 ring-offset-paper" : ""}`}
              >
                {d.day}
              </button>
            </li>
          ))}
        </ol>
        <div className="mt-5 rounded-xl border border-rule bg-sheet p-4" aria-live="polite">
          <p className="font-bold">
            Day {day.day}, {fmt(day.date, { weekday: "long", month: "long", day: "numeric" })}: {KIND_LABEL[day.kind]}
          </p>
          <ul className="mt-2 list-disc pl-5 text-ink-soft">
            {day.blocks.map((b, i) => (
              <li key={i}>
                {b.title}, {b.minutes} min{b.questions ? ` (${b.questions} questions)` : ""}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Reminders */}
      <section className="mt-12 grid gap-6 md:grid-cols-[1fr_1.2fr]">
        <div>
          <h2 className="text-xl font-bold">Reminders</h2>
          <p className="mt-2 text-ink-soft">
            Every study day at <strong>{s.reminder.time}</strong>
            {s.reminder.email && " by email"}
            {s.reminder.email && s.reminder.push && " and"}
            {s.reminder.push && " as a browser notification"}.
            {s.reminder.exam && " Countdown reminders start 7 days before the test."}
          </p>
          <button onClick={() => setPreview((v) => !v)} className="mt-4 cursor-pointer rounded-xl border-2 border-ink px-5 py-2.5 font-bold hover:bg-sheet">
            {preview ? "Hide preview" : "Preview today's reminder"}
          </button>
        </div>
        {preview && (
          <div className="rounded-2xl border border-rule bg-sheet p-5 text-[15px] shadow-sm">
            <p className="text-sm text-graphite">From: AdaptiveLearn &lt;plan@adaptivelearn.app&gt;</p>
            <p className="font-bold">Day 1 of {plan.summary.total_days}: {today.blocks.map((b) => b.title).join(" + ")}</p>
            <hr className="my-3 border-rule" />
            <p>Hi! Today&apos;s session takes about {today.blocks.reduce((t, b) => t + b.minutes, 0)} minutes:</p>
            <ul className="my-2 list-disc pl-5">
              {today.blocks.map((b, i) => (
                <li key={i}>{b.title}: {b.questions} questions</li>
              ))}
            </ul>
            <p>{plan.summary.total_days - 1} days to go. Small steps every day add up.</p>
          </div>
        )}
      </section>
    </div>
  );
}
