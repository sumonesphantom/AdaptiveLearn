import type { SkillId } from "@/data/skills";
import type { Attempt } from "./store";

export type MasteryResult = {
  mastery: Record<SkillId, number>;
  history: Record<SkillId, number[]>;
  answered: Record<SkillId, { n: number; correct: number }>;
  weakest: SkillId[];
  estimate: { math: number; rw: number; total: number };
};

export type PlanBlock = {
  kind: "practice" | "review" | "mock" | "rest";
  skill?: SkillId;
  title: string;
  minutes: number;
  questions?: number;
};

export type PlanDay = { day: number; date: string; kind: "study" | "mock" | "taper" | "rest"; blocks: PlanBlock[] };

export type PlanResult = {
  days: PlanDay[];
  summary: { total_days: number; mock_tests: number; share: Record<SkillId, number> };
};

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`/ml${path}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`ML service returned ${res.status}. Start it with: cd ml && uv run uvicorn server:app --port 8000`);
  return res.json();
}

export function getMastery(attempts: Attempt[]) {
  return post<MasteryResult>("/mastery", {
    attempts: attempts.map((a) => ({ skill: a.skill, correct: a.correct })),
  });
}

export function getPlan(mastery: Record<string, number>, days: number, minutesPerDay: number) {
  return post<PlanResult>("/plan", { mastery, days, minutes_per_day: minutesPerDay });
}
