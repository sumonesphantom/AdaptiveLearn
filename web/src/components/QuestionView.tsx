"use client";

import type { Question } from "@/data/questions";
import { SKILLS } from "@/data/skills";

const LETTERS = ["A", "B", "C", "D"];

type Props = {
  q: Question;
  chosen: number | null;
  onChoose: (i: number) => void;
  // When set, the answer is locked and right/wrong is shown.
  reveal?: boolean;
  compact?: boolean;
};

export function QuestionView({ q, chosen, onChoose, reveal = false, compact = false }: Props) {
  return (
    <div>
      {!compact && (
        <p className="mb-3 text-sm text-graphite">
          {SKILLS[q.skill].section === "math" ? "Math" : "Reading & Writing"} / {SKILLS[q.skill].name} / {q.subskill}
        </p>
      )}
      {q.passage && (
        <div className="mb-4 whitespace-pre-line border-l-4 border-rule pl-4 text-[17px] leading-relaxed">{q.passage}</div>
      )}
      <p className={`${compact ? "text-lg" : "text-xl"} mb-5 font-bold leading-snug`}>{q.prompt}</p>
      <fieldset>
        <legend className="sr-only">Answer choices</legend>
        <ul className="space-y-2">
          {q.choices.map((c, i) => {
            const picked = chosen === i;
            const isAnswer = reveal && i === q.answer;
            const isWrongPick = reveal && picked && i !== q.answer;
            return (
              <li key={i}>
                <label
                  className={[
                    "flex cursor-pointer items-center gap-4 rounded-xl border px-4 py-3 transition-colors",
                    isAnswer ? "border-correct bg-correct-bg" : isWrongPick ? "border-wrong bg-wrong-bg" : picked ? "border-ink bg-sheet" : "border-rule bg-sheet hover:border-ink-soft",
                    reveal ? "cursor-default" : "",
                  ].join(" ")}
                >
                  <input
                    type="radio"
                    name={q.id}
                    className="sr-only"
                    checked={picked}
                    disabled={reveal}
                    onChange={() => onChoose(i)}
                  />
                  {/* Answer-sheet bubble */}
                  <span
                    aria-hidden
                    className="relative grid size-9 shrink-0 place-items-center rounded-full border-2 border-ink font-display text-sm font-bold"
                  >
                    {picked && <span className="bubble-fill absolute inset-0.5 rounded-full bg-pencil" />}
                    <span className="relative">{LETTERS[i]}</span>
                  </span>
                  <span className="flex-1">{c}</span>
                  {isAnswer && <span className="text-sm font-bold text-correct">Correct answer</span>}
                  {isWrongPick && <span className="text-sm font-bold text-wrong">Your answer</span>}
                </label>
              </li>
            );
          })}
        </ul>
      </fieldset>
    </div>
  );
}
