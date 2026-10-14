import Link from "next/link";
import { QUESTIONS } from "@/data/questions";
import { SECTION_NAME, SKILLS, SKILL_IDS, type Section } from "@/data/skills";

export const metadata = { title: "Free curriculum – AdaptiveLearn" };

export default function CurriculumPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-4xl font-extrabold">Free curriculum</h1>
      <p className="mt-3 max-w-[62ch] text-lg text-ink-soft">
        Every SAT skill area in the order the test weights them. Work through it top to bottom, or take the{" "}
        <Link href="/diagnostic" className="font-bold text-ink underline underline-offset-4">diagnostic</Link> to get a
        plan that starts with your weakest skills.
      </p>

      {(["math", "rw"] as Section[]).map((sec) => (
        <section key={sec} className="mt-12">
          <h2 className="border-b-2 border-ink pb-2 text-2xl font-bold">{SECTION_NAME[sec]}</h2>
          <ol className="divide-y divide-rule">
            {SKILL_IDS.filter((k) => SKILLS[k].section === sec).map((k) => {
              const qs = QUESTIONS.filter((q) => q.skill === k);
              const subs = [...new Set(qs.map((q) => q.subskill))];
              return (
                <li key={k} className="flex flex-wrap items-center justify-between gap-4 py-5">
                  <div className="max-w-[60ch]">
                    <h3 className="text-xl font-bold">
                      {SKILLS[k].name}
                      <span className="ml-3 align-middle text-sm font-normal text-graphite tabular">
                        about {Math.round(SKILLS[k].weight * 100)}% of the section
                      </span>
                    </h3>
                    <p className="mt-1 text-ink-soft">{subs.join(", ")}</p>
                  </div>
                  <Link href={`/practice/${k}`} className="rounded-lg border-2 border-ink px-4 py-2 font-bold hover:bg-ink hover:text-sheet">
                    Practice {qs.length} questions
                  </Link>
                </li>
              );
            })}
          </ol>
        </section>
      ))}
    </div>
  );
}
