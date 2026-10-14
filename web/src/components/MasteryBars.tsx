import { SECTION_NAME, SKILLS, type Section, type SkillId } from "@/data/skills";

type Props = {
  mastery: Record<SkillId, number>;
  baseline?: Record<string, number> | null;
  weakest?: SkillId[];
};

const pct = (v: number) => Math.round(v * 100);

export function MasteryBars({ mastery, baseline, weakest = [] }: Props) {
  const focus = new Set(weakest.slice(0, 3));
  return (
    <div className="grid gap-8 md:grid-cols-2">
      {(["math", "rw"] as Section[]).map((sec) => (
        <section key={sec}>
          <h3 className="mb-3 text-lg font-bold">{SECTION_NAME[sec]}</h3>
          <ul className="space-y-3">
            {(Object.keys(SKILLS) as SkillId[])
              .filter((s) => SKILLS[s].section === sec)
              .map((s) => {
                const m = mastery[s] ?? 0;
                const b = baseline?.[s];
                return (
                  <li key={s}>
                    <div className="mb-1 flex items-baseline justify-between gap-2 text-[15px]">
                      <span className={focus.has(s) ? "font-bold" : ""}>
                        {SKILLS[s].name}
                        {focus.has(s) && <span className="ml-2 rounded bg-pencil px-1.5 py-0.5 text-xs font-bold">Focus</span>}
                      </span>
                      <span className="tabular text-graphite">
                        {b !== undefined && Math.abs(b - m) > 0.005 ? `${pct(b)}% → ` : ""}
                        <span className="font-bold text-ink">{pct(m)}%</span>
                      </span>
                    </div>
                    <div
                      className="relative h-3 overflow-hidden rounded-full bg-rule"
                      role="meter"
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={pct(m)}
                      aria-label={`${SKILLS[s].name} mastery`}
                    >
                      {b !== undefined && (
                        <div className="absolute inset-y-0 left-0 bg-graphite/30" style={{ width: `${pct(b)}%` }} />
                      )}
                      <div
                        className={`absolute inset-y-0 left-0 rounded-full transition-[width] duration-500 ${focus.has(s) ? "bg-pencil-deep" : "bg-ink"}`}
                        style={{ width: `${pct(m)}%` }}
                      />
                    </div>
                  </li>
                );
              })}
          </ul>
        </section>
      ))}
    </div>
  );
}
