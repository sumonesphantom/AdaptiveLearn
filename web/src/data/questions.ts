// Original SAT-style questions written for this demo. Not College Board items.
import type { SkillId } from "./skills";

export type Question = {
  id: string;
  skill: SkillId;
  subskill: string;
  difficulty: 1 | 2 | 3;
  diagnostic?: boolean;
  passage?: string;
  prompt: string;
  choices: [string, string, string, string];
  answer: 0 | 1 | 2 | 3;
  explanation: string;
};

export const QUESTIONS: Question[] = [
  // ---------- Algebra ----------
  {
    id: "alg-1", skill: "algebra", subskill: "Linear equations in one variable", difficulty: 1, diagnostic: true,
    prompt: "If 3x − 7 = 11, what is the value of 6x − 7?",
    choices: ["22", "29", "36", "43"], answer: 1,
    explanation: "3x − 7 = 11 gives 3x = 18, so x = 6. Then 6x − 7 = 36 − 7 = 29.",
  },
  {
    id: "alg-2", skill: "algebra", subskill: "Systems of linear equations", difficulty: 2, diagnostic: true,
    prompt: "x + y = 10 and x − y = 4. What is the value of xy?",
    choices: ["16", "21", "24", "40"], answer: 1,
    explanation: "Add the equations: 2x = 14, so x = 7. Then y = 3, and xy = 21.",
  },
  {
    id: "alg-3", skill: "algebra", subskill: "Linear functions", difficulty: 1,
    prompt: "A gym charges a one-time fee of $45 plus $30 per month. Which function gives the total cost C, in dollars, after m months?",
    choices: ["C(m) = 45m + 30", "C(m) = 30m + 45", "C(m) = 75m", "C(m) = 30(m + 45)"], answer: 1,
    explanation: "The $30 is charged every month, so it multiplies m. The $45 is charged once, so it is the constant: C(m) = 30m + 45.",
  },
  {
    id: "alg-4", skill: "algebra", subskill: "Linear equations in two variables", difficulty: 2,
    prompt: "The line y = mx + 4 passes through the point (2, 10). What is the value of m?",
    choices: ["2", "3", "5", "7"], answer: 1,
    explanation: "Substitute x = 2 and y = 10: 10 = 2m + 4, so 2m = 6 and m = 3.",
  },
  {
    id: "alg-5", skill: "algebra", subskill: "Linear inequalities", difficulty: 2,
    prompt: "Which value of x satisfies 5 − 2x > 11?",
    choices: ["−4", "−3", "0", "3"], answer: 0,
    explanation: "Subtract 5: −2x > 6. Dividing by −2 flips the sign: x < −3. Only −4 is less than −3.",
  },

  // ---------- Advanced Math ----------
  {
    id: "adv-1", skill: "advanced_math", subskill: "Nonlinear equations", difficulty: 1, diagnostic: true,
    prompt: "What are the solutions to x² − 5x + 6 = 0?",
    choices: ["x = −2 and x = −3", "x = 2 and x = 3", "x = 1 and x = 6", "x = −1 and x = 6"], answer: 1,
    explanation: "Factor: (x − 2)(x − 3) = 0, so x = 2 or x = 3.",
  },
  {
    id: "adv-2", skill: "advanced_math", subskill: "Equivalent expressions", difficulty: 2, diagnostic: true,
    prompt: "Which expression is equivalent to (x + 3)² − 9?",
    choices: ["x²", "x² + 6x", "x² + 6x + 18", "x² − 9"], answer: 1,
    explanation: "(x + 3)² = x² + 6x + 9. Subtract 9 to get x² + 6x.",
  },
  {
    id: "adv-3", skill: "advanced_math", subskill: "Exponential functions", difficulty: 2,
    prompt: "A colony of 500 bacteria doubles every 3 hours. Which function gives the number of bacteria P after t hours?",
    choices: ["P(t) = 500 · 2^(3t)", "P(t) = 500 · 2^(t/3)", "P(t) = 500 · 3^(t/2)", "P(t) = 1000t / 3"], answer: 1,
    explanation: "The population doubles once per 3 hours, so after t hours it has doubled t/3 times: P(t) = 500 · 2^(t/3).",
  },
  {
    id: "adv-4", skill: "advanced_math", subskill: "Nonlinear functions", difficulty: 1,
    prompt: "If f(x) = 2x² − 3, what is the value of f(−2)?",
    choices: ["−11", "−5", "5", "13"], answer: 2,
    explanation: "(−2)² = 4, so f(−2) = 2(4) − 3 = 5.",
  },
  {
    id: "adv-5", skill: "advanced_math", subskill: "Nonlinear functions", difficulty: 2,
    prompt: "What is the vertex of the graph of y = (x − 4)² + 1?",
    choices: ["(−4, 1)", "(4, 1)", "(4, −1)", "(1, 4)"], answer: 1,
    explanation: "In vertex form y = (x − h)² + k, the vertex is (h, k). Here h = 4 and k = 1.",
  },

  // ---------- Problem-Solving & Data Analysis ----------
  {
    id: "psda-1", skill: "psda", subskill: "Percentages", difficulty: 1, diagnostic: true,
    prompt: "A jacket's price is reduced from $80 to $60. By what percent was the price reduced?",
    choices: ["20%", "25%", "33⅓%", "75%"], answer: 1,
    explanation: "The drop is $20. As a share of the original $80, that is 20 ÷ 80 = 0.25, or 25%.",
  },
  {
    id: "psda-2", skill: "psda", subskill: "One-variable data", difficulty: 2, diagnostic: true,
    prompt: "The mean of 5 numbers is 12. When a sixth number is added, the mean becomes 13. What is the sixth number?",
    choices: ["13", "15", "18", "25"], answer: 2,
    explanation: "The first 5 numbers sum to 5 × 12 = 60. All 6 sum to 6 × 13 = 78. The sixth number is 78 − 60 = 18.",
  },
  {
    id: "psda-3", skill: "psda", subskill: "Probability", difficulty: 1,
    prompt: "A bag holds 4 red marbles and 6 blue marbles. One marble is drawn at random. What is the probability that it is blue?",
    choices: ["1/6", "2/5", "3/5", "2/3"], answer: 2,
    explanation: "6 of the 10 marbles are blue: 6/10 = 3/5.",
  },
  {
    id: "psda-4", skill: "psda", subskill: "Ratios, rates and units", difficulty: 1,
    prompt: "A car travels 150 miles in 2.5 hours. At this rate, how many miles will it travel in 4 hours?",
    choices: ["200", "220", "240", "375"], answer: 2,
    explanation: "The rate is 150 ÷ 2.5 = 60 miles per hour. In 4 hours: 60 × 4 = 240 miles.",
  },
  {
    id: "psda-5", skill: "psda", subskill: "Inference from samples", difficulty: 2,
    prompt: "In a random sample of 200 students at a school, 120 prefer online classes. Based on the sample, about how many of the school's 1,500 students prefer online classes?",
    choices: ["600", "750", "900", "1,200"], answer: 2,
    explanation: "120 out of 200 is 60%. 60% of 1,500 is 900.",
  },

  // ---------- Geometry & Trigonometry ----------
  {
    id: "geo-1", skill: "geometry_trig", subskill: "Right triangles", difficulty: 1, diagnostic: true,
    prompt: "A right triangle has legs of length 6 and 8. What is the length of the hypotenuse?",
    choices: ["7", "10", "12", "14"], answer: 1,
    explanation: "Pythagorean theorem: 6² + 8² = 36 + 64 = 100, and √100 = 10.",
  },
  {
    id: "geo-2", skill: "geometry_trig", subskill: "Trigonometry", difficulty: 2, diagnostic: true,
    prompt: "In right triangle ABC, angle C is the right angle and sin A = 3/5. What is cos A?",
    choices: ["3/4", "4/5", "5/4", "5/3"], answer: 1,
    explanation: "sin A = opposite/hypotenuse = 3/5, so the sides are 3, 4, 5. cos A = adjacent/hypotenuse = 4/5.",
  },
  {
    id: "geo-3", skill: "geometry_trig", subskill: "Circles", difficulty: 2,
    prompt: "A circle has an area of 49π square units. What is its circumference?",
    choices: ["7π", "14π", "49π", "98π"], answer: 1,
    explanation: "πr² = 49π gives r = 7. Circumference = 2πr = 14π.",
  },
  {
    id: "geo-4", skill: "geometry_trig", subskill: "Lines, angles and triangles", difficulty: 1,
    prompt: "Two angles of a triangle measure 47° and 68°. What is the measure of the third angle?",
    choices: ["55°", "65°", "75°", "115°"], answer: 1,
    explanation: "The angles of a triangle add to 180°: 180 − 47 − 68 = 65°.",
  },
  {
    id: "geo-5", skill: "geometry_trig", subskill: "Area and volume", difficulty: 1,
    prompt: "A rectangular box measures 3 cm by 4 cm by 5 cm. What is its volume, in cubic centimeters?",
    choices: ["12", "47", "60", "94"], answer: 2,
    explanation: "Volume = length × width × height = 3 × 4 × 5 = 60. (94 is the surface area, a common mix-up.)",
  },

  // ---------- Craft & Structure ----------
  {
    id: "cs-1", skill: "craft_structure", subskill: "Words in context", difficulty: 2, diagnostic: true,
    passage: "Marine biologist Ayana Brooks found that coral recovery after the heat wave was far from ______: some reefs rebounded within a year, while others showed no regrowth after a decade.",
    prompt: "Which choice completes the text with the most logical and precise word?",
    choices: ["uniform", "rapid", "visible", "permanent"], answer: 0,
    explanation: "The colon introduces reefs that recovered at very different speeds. That contrast shows recovery was not uniform.",
  },
  {
    id: "cs-2", skill: "craft_structure", subskill: "Text structure and purpose", difficulty: 2, diagnostic: true,
    passage: "Many people assume that bees find flowers mainly by sight and smell. Researchers have found, however, that bumblebees can also detect the weak electric fields that surround flowers. The finding suggests that the senses bees use while foraging are more varied than once believed.",
    prompt: "Which choice best describes the function of the first sentence in the overall structure of the text?",
    choices: [
      "It presents a common belief that the rest of the text complicates.",
      "It states the main finding of the research.",
      "It describes the method the researchers used.",
      "It offers a conclusion drawn from the evidence.",
    ], answer: 0,
    explanation: "The first sentence gives what \"many people assume.\" The word \"however\" then introduces research that adds to that belief.",
  },
  {
    id: "cs-3", skill: "craft_structure", subskill: "Words in context", difficulty: 1,
    passage: "The novelist's early drafts were so ______ that her editor often had to cut entire chapters to keep the story moving.",
    prompt: "Which choice completes the text with the most logical and precise word?",
    choices: ["concise", "sprawling", "fragile", "ordinary"], answer: 1,
    explanation: "Cutting whole chapters means the drafts were too long and spread out: sprawling.",
  },
  {
    id: "cs-4", skill: "craft_structure", subskill: "Cross-text connections", difficulty: 3,
    passage: "Text 1: Some economists argue that raising the minimum wage reduces the number of jobs available, since employers facing higher labor costs will hire fewer workers.\n\nText 2: A study comparing neighboring counties found that counties that raised their minimum wage saw no significant drop in employment compared with counties that did not.",
    prompt: "Based on the texts, how would the author of Text 2 most likely respond to the argument in Text 1?",
    choices: [
      "By agreeing that higher wages always lead to fewer jobs",
      "By pointing to evidence that the predicted job losses did not appear in one comparison",
      "By arguing that the minimum wage should be eliminated",
      "By claiming that employers never respond to labor costs",
    ], answer: 1,
    explanation: "Text 2 reports a study where employment did not drop, which directly challenges Text 1's prediction without claiming more than the study shows.",
  },
  {
    id: "cs-5", skill: "craft_structure", subskill: "Words in context", difficulty: 2,
    passage: "Although the committee's report was brief, its recommendations were ______, touching nearly every department in the company.",
    prompt: "Which choice completes the text with the most logical and precise word?",
    choices: ["narrow", "sweeping", "tentative", "outdated"], answer: 1,
    explanation: "\"Although … brief\" sets up a contrast, and \"touching nearly every department\" means broad in reach: sweeping.",
  },

  // ---------- Information & Ideas ----------
  {
    id: "ii-1", skill: "info_ideas", subskill: "Central ideas and details", difficulty: 1, diagnostic: true,
    passage: "In the 1800s, many cities drew drinking water from the same rivers that carried their waste. After physician John Snow traced an 1854 cholera outbreak in London to a single contaminated water pump, officials began to take water quality more seriously. Over the following decades, investments in sewers and filtration sharply reduced deaths from waterborne disease.",
    prompt: "Which choice best states the main idea of the text?",
    choices: [
      "Snow's investigation helped prompt changes that improved public health.",
      "Cities in the 1800s refused to build sewers.",
      "Cholera was the most common disease in 1800s London.",
      "John Snow designed London's first water filtration system.",
    ], answer: 0,
    explanation: "The text moves from Snow's discovery to officials acting on water quality to fewer deaths. Only the first choice covers that whole arc.",
  },
  {
    id: "ii-2", skill: "info_ideas", subskill: "Command of evidence (quantitative)", difficulty: 2, diagnostic: true,
    passage: "A student surveyed four groups about their habits. Average daily screen time and sleep: Group A: 2 hours screen, 8.5 hours sleep. Group B: 4 hours screen, 7.9 hours sleep. Group C: 6 hours screen, 7.2 hours sleep. Group D: 8 hours screen, 6.6 hours sleep. The student concludes that groups with more screen time tended to sleep less.",
    prompt: "Which choice best describes data from the survey that support the student's conclusion?",
    choices: [
      "Group D had the most screen time and the least sleep.",
      "Group A and Group B slept the same amount.",
      "Group C slept more than Group B.",
      "Every group slept more than 8 hours.",
    ], answer: 0,
    explanation: "Group D sits at both extremes, matching the pattern. The other three choices misread the data.",
  },
  {
    id: "ii-3", skill: "info_ideas", subskill: "Inferences", difficulty: 2,
    passage: "Lichens grow on rocks and tree bark and absorb water and nutrients directly from the air. Because they have no roots to filter what they take in, lichens also absorb pollutants. Scientists have observed that lichens are scarce near busy highways, which suggests that ______",
    prompt: "Which choice most logically completes the text?",
    choices: [
      "lichens can serve as indicators of local air quality.",
      "lichens need roots to survive near highways.",
      "highways are usually built where lichens cannot grow.",
      "pollutants have no effect on most plants.",
    ], answer: 0,
    explanation: "Lichens soak up pollutants and are scarce where pollution is high, so their presence or absence signals air quality.",
  },
  {
    id: "ii-4", skill: "info_ideas", subskill: "Command of evidence (textual)", difficulty: 2,
    passage: "A historian claims that a small town's newspaper played a major role in local politics during the 1920s.",
    prompt: "Which finding, if true, would most directly support the historian's claim?",
    choices: [
      "Candidates the newspaper endorsed won most local elections that decade.",
      "The newspaper was printed on a press bought in 1919.",
      "Several of its reporters later moved to larger cities.",
      "The newspaper's office was located near the town hall.",
    ], answer: 0,
    explanation: "Only the first choice links the paper to political outcomes. The others describe the paper without showing influence.",
  },
  {
    id: "ii-5", skill: "info_ideas", subskill: "Central ideas and details", difficulty: 1,
    passage: "Octopuses can change the color and texture of their skin in a fraction of a second. Unlike many animals that change color slowly through hormones, octopuses control tiny pigment sacs called chromatophores directly with their nervous system. This direct control lets them react almost instantly to threats or prey.",
    prompt: "Which choice best states the main idea of the text?",
    choices: [
      "Octopuses change appearance quickly because their nerves directly control their pigment sacs.",
      "Most animals cannot change color at all.",
      "Octopuses change color mainly to attract mates.",
      "Hormones are the fastest way for animals to change color.",
    ], answer: 0,
    explanation: "The text explains why octopuses change so fast: direct nervous control of chromatophores.",
  },

  // ---------- Standard English Conventions ----------
  {
    id: "sec-1", skill: "conventions", subskill: "Boundaries", difficulty: 2, diagnostic: true,
    passage: "The museum's newest exhibit features more than 200 ______ of them dates to the twelfth century.",
    prompt: "Which choice completes the text so that it conforms to the conventions of Standard English?",
    choices: ["maps, the oldest", "maps; the oldest", "maps the oldest", "maps, and, the oldest"], answer: 1,
    explanation: "Both sides are complete sentences. A semicolon can join them; a comma alone creates a comma splice.",
  },
  {
    id: "sec-2", skill: "conventions", subskill: "Subject-verb agreement", difficulty: 2, diagnostic: true,
    passage: "The collection of rare insects that the scientists gathered over three summers ______ now on display at the science center.",
    prompt: "Which choice completes the text so that it conforms to the conventions of Standard English?",
    choices: ["are", "is", "were", "have been"], answer: 1,
    explanation: "The subject is \"collection\" (singular), not \"insects\" or \"scientists.\" Singular subject, singular verb: is.",
  },
  {
    id: "sec-3", skill: "conventions", subskill: "Verb tense", difficulty: 2,
    passage: "By the time the rescue team arrived, the hikers ______ for nearly two days.",
    prompt: "Which choice completes the text so that it conforms to the conventions of Standard English?",
    choices: ["wait", "will wait", "had been waiting", "are waiting"], answer: 2,
    explanation: "The waiting happened before another past event (the team arrived), so it needs the past perfect progressive: had been waiting.",
  },
  {
    id: "sec-4", skill: "conventions", subskill: "Possessives", difficulty: 1,
    passage: "The two ______ findings surprised everyone: the plant grew faster in shade than in sunlight.",
    prompt: "Which choice completes the text so that it conforms to the conventions of Standard English?",
    choices: ["researchers", "researchers'", "researcher's", "researchers's"], answer: 1,
    explanation: "\"Two\" makes it plural, and the findings belong to them, so use the plural possessive: researchers'.",
  },
  {
    id: "sec-5", skill: "conventions", subskill: "Modifiers", difficulty: 2,
    passage: "Walking through the forest at dawn, ______",
    prompt: "Which choice completes the text so that it conforms to the conventions of Standard English?",
    choices: [
      "the birds' songs filled Maya's ears.",
      "Maya heard the birds singing.",
      "the sound of birds was heard by Maya.",
      "birdsong surrounded Maya.",
    ], answer: 1,
    explanation: "The opening phrase describes whoever is walking. That person, Maya, has to come right after the comma.",
  },

  // ---------- Expression of Ideas ----------
  {
    id: "eoi-1", skill: "expression", subskill: "Transitions", difficulty: 1, diagnostic: true,
    passage: "Solar panels have become much cheaper over the past decade. ______ many homeowners who once considered them too expensive are now installing them.",
    prompt: "Which choice completes the text with the most logical transition?",
    choices: ["However,", "As a result,", "For example,", "In contrast,"], answer: 1,
    explanation: "Lower prices cause more people to install panels. That is cause and effect: As a result.",
  },
  {
    id: "eoi-2", skill: "expression", subskill: "Rhetorical synthesis", difficulty: 2, diagnostic: true,
    passage: "While researching a topic, a student took these notes:\n• The Great Wall of China is a series of fortifications.\n• Construction began as early as the 7th century BCE.\n• The best-known sections were built during the Ming dynasty (1368–1644).",
    prompt: "The student wants to emphasize when the best-known sections were built. Which choice most effectively uses relevant information from the notes?",
    choices: [
      "The best-known sections of the Great Wall were built during the Ming dynasty, between 1368 and 1644.",
      "Construction on the Great Wall began as early as the 7th century BCE.",
      "The Great Wall of China is a series of fortifications.",
      "The Great Wall was built over many centuries.",
    ], answer: 0,
    explanation: "The goal is specific: when the best-known sections were built. Only the first choice gives that.",
  },
  {
    id: "eoi-3", skill: "expression", subskill: "Transitions", difficulty: 2,
    passage: "Most desert plants store water in thick stems or leaves. The creosote bush, ______ survives by spreading its roots deep and wide to collect what little rain falls.",
    prompt: "Which choice completes the text with the most logical transition?",
    choices: ["similarly,", "however,", "therefore,", "for instance,"], answer: 1,
    explanation: "The creosote bush does something different from most desert plants, so the transition must show contrast: however.",
  },
  {
    id: "eoi-4", skill: "expression", subskill: "Transitions", difficulty: 1,
    passage: "The city added protected bike lanes on Main Street in 2021. ______ the number of cyclists using the street doubled within a year.",
    prompt: "Which choice completes the text with the most logical transition?",
    choices: ["Afterward,", "Nevertheless,", "Instead,", "On the other hand,"], answer: 0,
    explanation: "The second event follows the first in time, with no contrast: Afterward.",
  },
  {
    id: "eoi-5", skill: "expression", subskill: "Rhetorical synthesis", difficulty: 2,
    passage: "While researching a topic, a student took these notes:\n• Mae Jemison was a NASA astronaut.\n• In 1992, she flew aboard the space shuttle Endeavour.\n• She was the first African American woman to travel to space.",
    prompt: "The student wants to emphasize Jemison's historic achievement. Which choice most effectively uses relevant information from the notes?",
    choices: [
      "In 1992, Mae Jemison became the first African American woman to travel to space.",
      "Mae Jemison was a NASA astronaut.",
      "The space shuttle Endeavour flew in 1992.",
      "Mae Jemison flew aboard a space shuttle.",
    ], answer: 0,
    explanation: "\"Historic achievement\" points to being first. Only the first choice states it.",
  },
];

export const DIAGNOSTIC = QUESTIONS.filter((q) => q.diagnostic);
export const bySkill = (skill: SkillId) => QUESTIONS.filter((q) => q.skill === skill);
