"use client";

import { useEffect, useState } from "react";
import { getMastery, type MasteryResult } from "./ml";
import type { Attempt } from "./store";

export function useMastery(attempts: Attempt[], enabled = true) {
  const [data, setData] = useState<MasteryResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const key = attempts.map((a) => `${a.qid}${a.correct ? 1 : 0}`).join(",");

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    getMastery(attempts)
      .then((d) => !cancelled && (setData(d), setError(null)))
      .catch((e) => !cancelled && setError((e as Error).message));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, enabled]);

  return { data, error };
}
