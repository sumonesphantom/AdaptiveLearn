"use client";

import { useEffect, useRef, useState } from "react";
import type { Question } from "@/data/questions";

// Small local models sometimes emit LaTeX despite the prompt. Turn it into plain text.
function plain(t: string) {
  return t
    .replace(/\\[()[\]]/g, "")
    .replace(/\$+/g, "")
    .replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, "($1)/($2)")
    .replace(/\\sqrt\{([^}]*)\}/g, "√($1)")
    .replace(/\\times/g, "×")
    .replace(/\\cdot/g, "·")
    .replace(/\\div/g, "÷")
    .replace(/\\(le|leq)\b/g, "≤")
    .replace(/\\(ge|geq)\b/g, "≥")
    .replace(/\\neq\b/g, "≠")
    .replace(/\\pi\b/g, "π")
    .replace(/\\text\{([^}]*)\}/g, "$1")
    .replace(/\^\{([^}]*)\}/g, "^($1)")
    .replace(/_\{([^}]*)\}/g, "$1")
    .replace(/_(\w)/g, "$1")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\\([a-zA-Z]+)/g, "$1");
}

type Status = { online: boolean; model: string; available: boolean } | null;

export function ModelStatus() {
  const [status, setStatus] = useState<Status>(null);
  useEffect(() => {
    fetch("/api/tutor").then((r) => r.json()).then(setStatus).catch(() => setStatus({ online: false, model: "?", available: false }));
  }, []);
  if (!status) return null;
  return (
    <span className="inline-flex items-center gap-2 text-sm text-graphite">
      <span aria-hidden className={`size-2 rounded-full ${status.online && status.available ? "bg-correct" : "bg-wrong"}`} />
      {status.online && status.available
        ? `Tutor: ${status.model}, running locally`
        : status.online
          ? `Tutor model ${status.model} not pulled`
          : "Tutor offline (start Ollama)"}
    </span>
  );
}

export function Tutor({ q, chosen }: { q: Question; chosen: number | null }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [followup, setFollowup] = useState("");
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  async function ask(question?: string) {
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;
    setLoading(true);
    setError(null);
    setText("");
    try {
      const res = await fetch("/api/tutor", {
        method: "POST",
        signal: ac.signal,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          passage: q.passage,
          prompt: q.prompt,
          choices: q.choices,
          answer: q.answer,
          chosen: chosen ?? undefined,
          followup: question,
        }),
      });
      if (!res.ok || !res.body) throw new Error(await res.text());
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        setText((t) => t + dec.decode(value, { stream: true }));
      }
    } catch (e) {
      if ((e as Error).name !== "AbortError") setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-rule bg-sheet p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg font-bold">Ask the tutor</h3>
        <ModelStatus />
      </div>
      {!text && !loading && !error && (
        <button
          onClick={() => ask()}
          className="mt-3 cursor-pointer rounded-lg bg-ink px-4 py-2 font-bold text-sheet hover:bg-ink-soft"
        >
          {chosen !== null && chosen !== q.answer ? "Explain my mistake" : "Walk me through it"}
        </button>
      )}
      {(text || loading) && (
        <p aria-live="polite" className="mt-3 whitespace-pre-line leading-relaxed">
          {plain(text)}
          {loading && <span className="ml-0.5 inline-block h-4 w-2 animate-pulse bg-ink align-middle" />}
        </p>
      )}
      {error && <p className="mt-3 text-wrong">{error}</p>}
      {text && !loading && (
        <form
          className="mt-4 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (followup.trim()) ask(followup.trim());
            setFollowup("");
          }}
        >
          <label htmlFor={`fu-${q.id}`} className="sr-only">Follow-up question</label>
          <input
            id={`fu-${q.id}`}
            value={followup}
            onChange={(e) => setFollowup(e.target.value)}
            placeholder="Still stuck? Ask a follow-up"
            className="flex-1 rounded-lg border border-rule px-3 py-2"
          />
          <button className="cursor-pointer rounded-lg border border-ink px-4 py-2 font-bold hover:bg-ink hover:text-sheet">Ask</button>
        </form>
      )}
    </div>
  );
}
