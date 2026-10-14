"use client";

import { useSyncExternalStore } from "react";
import type { SkillId } from "@/data/skills";

export type Attempt = {
  qid: string;
  skill: SkillId;
  correct: boolean;
  chosen: number;
  context: "diagnostic" | "practice";
  at: number;
};

export type AppState = {
  attempts: Attempt[];
  diagnosticDone: boolean;
  pro: boolean;
  days: number;
  minutesPerDay: number;
  reminder: { time: string; email: boolean; push: boolean; exam: boolean };
  ref: string | null;
  baseline: Record<string, number> | null;
};

const KEY = "adaptivelearn:v1";

const INITIAL: AppState = {
  attempts: [],
  diagnosticDone: false,
  pro: false,
  days: 90,
  minutesPerDay: 45,
  reminder: { time: "18:30", email: true, push: false, exam: true },
  ref: null,
  baseline: null,
};

let state: AppState = INITIAL;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) state = { ...INITIAL, ...JSON.parse(raw) };
  } catch {
    // Storage blocked: run in memory only.
  }
}

export function setState(patch: Partial<AppState> | ((s: AppState) => Partial<AppState>)) {
  load();
  const next = typeof patch === "function" ? patch(state) : patch;
  state = { ...state, ...next };
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {}
  listeners.forEach((l) => l());
}

export function resetState() {
  state = INITIAL;
  try {
    window.localStorage.removeItem(KEY);
  } catch {}
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

function getSnapshot() {
  load();
  return state;
}

export function useAppState(): [AppState, boolean] {
  const s = useSyncExternalStore(subscribe, getSnapshot, () => INITIAL);
  const hydrated = useSyncExternalStore(subscribe, () => true, () => false);
  return [s, hydrated];
}
