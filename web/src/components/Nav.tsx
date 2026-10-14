import Link from "next/link";
import { ProBadge } from "./ProBadge";

const LINKS = [
  { href: "/curriculum", label: "Free curriculum" },
  { href: "/diagnostic", label: "Diagnostic" },
  { href: "/plan", label: "My plan" },
  { href: "/progress", label: "Progress" },
];

export function Nav() {
  return (
    <header className="border-b border-rule bg-sheet">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-display text-xl font-bold">
          <span aria-hidden className="inline-block size-5 rounded-full border-2 border-ink bg-pencil" />
          AdaptiveLearn
        </Link>
        <ul className="flex flex-wrap gap-x-5 gap-y-1 text-[15px]">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="text-ink-soft hover:text-ink hover:underline underline-offset-4">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="ml-auto">
          <ProBadge />
        </div>
      </nav>
    </header>
  );
}
