import Link from "next/link";
import { HeroSample, RefWelcome } from "@/components/HeroSample";

const STEPS = [
  {
    title: "Take the diagnostic, or skip it",
    body: "16 questions, about 20 minutes, across Math and Reading & Writing. Skip it and you still get the full structured curriculum.",
  },
  {
    title: "See which skills cost you points",
    body: "A knowledge-tracing model estimates your mastery of each SAT skill and ranks them by how much they're worth on test day.",
  },
  {
    title: "Pick your timeline",
    body: "Tell us how many days you have (90 by default). We size each day's work and schedule full practice tests every two weeks.",
  },
  {
    title: "Practice a little every day",
    body: "Reminders arrive at the time you choose. When you miss a question, the tutor explains what went wrong and your plan adjusts.",
  },
];

const TIERS: { feature: string; free: boolean; paid: boolean }[] = [
  { feature: "Full Math and Reading & Writing curriculum", free: true, paid: true },
  { feature: "Practice questions with written explanations", free: true, paid: true },
  { feature: "Diagnostic score estimate", free: true, paid: true },
  { feature: "Weak skills ranked by points at stake", free: false, paid: true },
  { feature: "Day-by-day plan sized to your test date", free: false, paid: true },
  { feature: "Daily study and exam reminders", free: false, paid: true },
  { feature: "Targeted drills with live mastery tracking", free: false, paid: true },
  { feature: "Weekly office hours", free: false, paid: true },
];

export default function Home() {
  return (
    <>
      <section className="graph-paper border-b border-rule">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-[1.05fr_1fr] md:py-20">
          <div>
            <RefWelcome />
            <h1 className="max-w-[16ch] text-5xl font-extrabold sm:text-6xl">
              Find the SAT skills costing you points. Then fix them.
            </h1>
            <p className="mt-6 max-w-[52ch] text-lg text-ink-soft">
              Free Math and Reading &amp; Writing practice for everyone. Take an optional diagnostic and get a
              day-by-day plan built around your weakest skills.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/diagnostic" className="rounded-xl bg-ink px-6 py-3 text-lg font-bold text-sheet hover:bg-ink-soft">
                Take the free diagnostic
              </Link>
              <Link href="/curriculum" className="rounded-xl border-2 border-ink bg-sheet px-6 py-3 text-lg font-bold hover:bg-paper">
                Browse the curriculum
              </Link>
            </div>
          </div>
          <HeroSample />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-3xl font-bold sm:text-4xl">How it works</h2>
        <ol className="mt-10 grid gap-x-10 gap-y-8 md:grid-cols-2">
          {STEPS.map((s, i) => (
            <li key={s.title} className="flex gap-4">
              <span aria-hidden className="grid size-10 shrink-0 place-items-center rounded-full border-2 border-ink font-display text-lg font-bold">
                {i + 1}
              </span>
              <div>
                <h3 className="text-xl font-bold">{s.title}</h3>
                <p className="mt-1 max-w-[56ch] text-ink-soft">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-t border-rule bg-sheet">
        <div className="mx-auto max-w-4xl px-4 py-16">
          <h2 className="text-3xl font-bold sm:text-4xl">The content is free. The plan is personal.</h2>
          <p className="mt-3 max-w-[60ch] text-ink-soft">
            Every lesson and practice question is free. Personalization is the paid part: the diagnostic-driven plan,
            reminders, targeted drills and office hours.
          </p>
          <div className="mt-8">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b-2 border-ink">
                  <th className="py-3 pr-4 font-display text-base sm:text-lg">What you get</th>
                  <th className="w-16 py-3 text-center font-display text-base sm:w-28 sm:text-lg">Free</th>
                  <th className="w-24 py-3 text-center font-display text-base sm:w-36 sm:text-lg">Personalized</th>
                </tr>
              </thead>
              <tbody>
                {TIERS.map((t) => (
                  <tr key={t.feature} className="border-b border-rule">
                    <td className="py-3 pr-4">{t.feature}</td>
                    {[t.free, t.paid].map((on, i) => (
                      <td key={i} className="py-3 text-center">
                        <span
                          aria-label={on ? "Included" : "Not included"}
                          className={`inline-block size-5 rounded-full border-2 ${on ? "border-ink bg-pencil" : "border-rule"}`}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}
