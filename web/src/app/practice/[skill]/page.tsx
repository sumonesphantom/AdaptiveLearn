import { Suspense } from "react";
import { notFound } from "next/navigation";
import { SKILLS, SKILL_IDS, type SkillId } from "@/data/skills";
import { Drill } from "./Drill";

export function generateStaticParams() {
  return SKILL_IDS.map((skill) => ({ skill }));
}

export default function PracticePage({ params }: PageProps<"/practice/[skill]">) {
  return (
    <Suspense fallback={<p className="mx-auto max-w-6xl px-4 py-8 text-graphite">Loading practice…</p>}>
      <PracticeForSkill params={params} />
    </Suspense>
  );
}

async function PracticeForSkill({ params }: { params: PageProps<"/practice/[skill]">["params"] }) {
  const { skill } = await params;
  if (!(skill in SKILLS)) notFound();
  return <Drill skill={skill as SkillId} />;
}
