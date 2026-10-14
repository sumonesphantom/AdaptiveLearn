// Mastery over time, one point per answer. 0–100% on the y axis.
export function Sparkline({ values, height = 56 }: { values: number[]; height?: number }) {
  const w = 240;
  const pts = values.length > 1 ? values : [values[0] ?? 0, values[0] ?? 0];
  const x = (i: number) => (i / (pts.length - 1)) * (w - 8) + 4;
  const y = (v: number) => height - 4 - v * (height - 8);
  const d = pts.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const last = pts[pts.length - 1];
  return (
    <svg viewBox={`0 0 ${w} ${height}`} className="w-full" role="img" aria-label={`Mastery trend, now ${Math.round(last * 100)}%`}>
      <line x1="4" x2={w - 4} y1={y(0.95)} y2={y(0.95)} stroke="var(--rule)" strokeDasharray="4 4" />
      <path d={d} fill="none" stroke="var(--ink)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={x(pts.length - 1)} cy={y(last)} r="5" fill="var(--pencil)" stroke="var(--ink)" strokeWidth="2" />
    </svg>
  );
}
