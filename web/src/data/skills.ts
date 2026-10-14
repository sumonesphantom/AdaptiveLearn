export type SkillId =
  | "algebra"
  | "advanced_math"
  | "psda"
  | "geometry_trig"
  | "craft_structure"
  | "info_ideas"
  | "conventions"
  | "expression";

export type Section = "math" | "rw";

export const SKILLS: Record<SkillId, { name: string; section: Section; weight: number }> = {
  algebra: { name: "Algebra", section: "math", weight: 0.35 },
  advanced_math: { name: "Advanced Math", section: "math", weight: 0.35 },
  psda: { name: "Problem-Solving & Data", section: "math", weight: 0.15 },
  geometry_trig: { name: "Geometry & Trig", section: "math", weight: 0.15 },
  craft_structure: { name: "Craft & Structure", section: "rw", weight: 0.28 },
  info_ideas: { name: "Information & Ideas", section: "rw", weight: 0.26 },
  conventions: { name: "English Conventions", section: "rw", weight: 0.26 },
  expression: { name: "Expression of Ideas", section: "rw", weight: 0.2 },
};

export const SKILL_IDS = Object.keys(SKILLS) as SkillId[];
export const SECTION_NAME: Record<Section, string> = { math: "Math", rw: "Reading & Writing" };
