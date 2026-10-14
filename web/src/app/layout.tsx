import type { Metadata } from "next";
import { Bricolage_Grotesque, Lexend } from "next/font/google";
import { Nav } from "@/components/Nav";
import "./globals.css";

const bricolage = Bricolage_Grotesque({ variable: "--font-bricolage", subsets: ["latin"] });
const lexend = Lexend({ variable: "--font-body", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AdaptiveLearn – SAT prep that knows what you need next",
  description: "Free SAT Math and Reading & Writing practice, with a personalized day-by-day plan built from your diagnostic.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${bricolage.variable} ${lexend.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Nav />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-rule px-4 py-6 text-sm text-graphite">
          <div className="mx-auto max-w-6xl">
            Demo build. Questions are original and not affiliated with College Board. SAT® is a trademark of College Board.
          </div>
        </footer>
      </body>
    </html>
  );
}
