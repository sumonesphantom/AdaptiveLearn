// AI tutor backed by a small local model served by Ollama.
const OLLAMA_URL = process.env.OLLAMA_URL ?? "http://127.0.0.1:11434";
const MODEL = process.env.OLLAMA_MODEL ?? "qwen2.5:7b-instruct";

const SYSTEM = `You are a patient SAT tutor for high school students.
Rules:
- The correct answer is given to you. Never contradict it.
- Write math as plain text the way a student types it, e.g. 500 × 2^(t/3). Never use LaTeX, backslashes, dollar signs or markdown. Use short numbered steps for math.
- Keep it under 120 words unless the student asks for more.
- If the student chose a wrong answer, name the likely mistake behind that choice.
- End with one quick tip they can reuse on similar questions.`;

type TutorRequest = {
  passage?: string;
  prompt: string;
  choices: string[];
  answer: number;
  chosen?: number;
  followup?: string;
};

const L = ["A", "B", "C", "D"];

export async function GET() {
  try {
    const res = await fetch(`${OLLAMA_URL}/api/tags`, { signal: AbortSignal.timeout(1500) });
    const data = (await res.json()) as { models: { name: string }[] };
    const available = data.models.some((m) => m.name === MODEL);
    return Response.json({ online: true, model: MODEL, available });
  } catch {
    return Response.json({ online: false, model: MODEL, available: false });
  }
}

export async function POST(req: Request) {
  const q = (await req.json()) as TutorRequest;
  const lines = [
    q.passage ? `Passage:\n${q.passage}` : null,
    `Question: ${q.prompt}`,
    `Choices: ${q.choices.map((c, i) => `${L[i]}) ${c}`).join("  ")}`,
    `Correct answer: ${L[q.answer]}) ${q.choices[q.answer]}`,
    q.chosen !== undefined && q.chosen !== q.answer
      ? `The student chose ${L[q.chosen]}) ${q.choices[q.chosen]}.`
      : q.chosen !== undefined
        ? "The student answered correctly."
        : null,
    q.followup ? `Student asks: ${q.followup}` : "Explain how to get the correct answer.",
  ].filter(Boolean);

  let upstream: Response;
  try {
    upstream = await fetch(`${OLLAMA_URL}/api/chat`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        model: MODEL,
        stream: true,
        options: { temperature: 0.2, num_predict: 320 },
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: lines.join("\n\n") },
        ],
      }),
    });
  } catch {
    return new Response("The local tutor model isn't running. Start it with: ollama serve", { status: 503 });
  }
  if (!upstream.ok || !upstream.body) {
    return new Response(`Ollama returned ${upstream.status}. Pull the model with: ollama pull ${MODEL}`, { status: 502 });
  }

  // Ollama streams NDJSON; forward only the text.
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";
  const stream = upstream.body.pipeThrough(
    new TransformStream<Uint8Array, Uint8Array>({
      transform(chunk, controller) {
        buffer += decoder.decode(chunk, { stream: true });
        const parts = buffer.split("\n");
        buffer = parts.pop() ?? "";
        for (const line of parts) {
          if (!line.trim()) continue;
          const msg = JSON.parse(line) as { message?: { content?: string } };
          if (msg.message?.content) controller.enqueue(encoder.encode(msg.message.content));
        }
      },
    }),
  );
  return new Response(stream, { headers: { "content-type": "text/plain; charset=utf-8", "x-model": MODEL } });
}
