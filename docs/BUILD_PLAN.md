# Build Plan: AdaptiveLearn (Digital SAT, Math + Reading & Writing)

Researched 2026-10-14. Prices and rules change. Check the linked sources before you rely on a number.

---

## 1. What we're building

A standalone site for Digital SAT prep. Skool, YouTube and other channels link to it.

- **Free:** the plain structured curriculum (lessons + practice by topic).
- **Paid:** personalization. That covers the diagnostic, weak-skill detection, the day-by-day plan, reminders, targeted practice tests and the progress dashboard.

### Pricing context (competitors, Oct 2026)
| Product | Price | Notes |
|---|---|---|
| Khan Academy / Bluebook | Free | Official practice. Link to these; don't compete on raw question volume |
| LearnQ | ~$200/yr | Cheapest paid AI option |
| Acely | $49/mo (annual), $149/mo monthly | Auto-updating plan |
| UWorld SAT | $69.99/mo | Question bank |
| Princeton Review / Kaplan | $299+ | Courses |

Where you can win: a cheaper, simpler plan, plus office hours and a community (Skool, YouTube) that the big players don't have.

---

## 2. Content model: mirror the official SAT taxonomy

Tag every question and lesson with **section → domain → skill → subskill**. Both the diagnostic and the ML depend on this tagging, so get it right first.

**Reading & Writing** (54 Qs, 64 min, 2 adaptive modules)
| Domain | ~Weight | Skills |
|---|---|---|
| Craft and Structure | 28% | Words in context, text structure & purpose, cross-text connections |
| Information and Ideas | 26% | Central ideas & details, command of evidence (textual / quantitative), inferences |
| Standard English Conventions | 26% | Boundaries (punctuation), form/structure/sense (grammar) |
| Expression of Ideas | 20% | Rhetorical synthesis, transitions |

**Math** (44 Qs, 70 min, 2 adaptive modules, calculator allowed)
| Domain | ~Weight | Skills |
|---|---|---|
| Algebra | 35% | Linear equations (1 & 2 var), linear functions, systems, linear inequalities |
| Advanced Math | 35% | Nonlinear functions, nonlinear equations & systems, equivalent expressions |
| Problem-Solving & Data Analysis | 15% | Ratios/rates/units, percentages, distributions, scatterplots, probability, sample inference, evaluating claims |
| Geometry & Trigonometry | 15% | Area/volume, lines/angles/triangles, right triangles & trig, circles |

Verify the weights against College Board's official test specs before launch.

### Content legality (important)
- **You can't use College Board SAT questions.** College Board doesn't license SAT test material for commercial use, and that explicitly includes test prep.
- Write **original** questions in the SAT style. You can draft them with an LLM, but a person must review each one (§4.3).
- Linking out to Khan Academy and Bluebook is fine. Copying their questions isn't.
- Other publishers (e.g. Ivy Global) license their own practice tests commercially if you want to buy content.

---

## 3. Do you need to train your own model?

**Short answer: no. Don't train an LLM.** Use two different kinds of "model":

| Job | Use | Train it yourself? |
|---|---|---|
| Find weak skills, track mastery, predict "will they get this right" | **Knowledge Tracing**: BKT now, IRT for test difficulty | Yes, but these are tiny classical models. Fitting takes seconds on a laptop with `pyBKT`. Not deep learning |
| Explanations, hints, "why is my answer wrong", tutoring chat, drafting new questions, weekly summary emails | **LLM via API** (Claude, OpenAI, Gemini) | **No.** Just call the API |

Why not use an LLM for weak-skill detection? A 2026 study, "Specialised KT models outperform LLMs", tested exactly this:
- Purpose-built KT models (DKT, SAKT) reached ~72–73% accuracy. GPT-4o-mini got 58.6% and Gemini Flash-Lite 66.5%. Several LLMs failed to beat a dumb baseline that just predicts each question's average correctness.
- For 100k students, KT cost **under $2 a year**, versus **$1,200–$24,000** for the LLMs. KT also answered in under 0.25 s per student.

So: KT does the numbers and the LLM does the words.

### 3.1 Weak-skill detection roadmap (ML module)
1. **Day 1, zero data.** Score the diagnostic per skill: % correct, weighted by difficulty. Weak skill = low score × high exam weight. Simple rules, but this is honestly "personalized".
2. **~1–2k attempts. Bayesian Knowledge Tracing** with [`pyBKT`](https://github.com/CAHLR/pyBKT). It gives one P(mastered) per skill, updated after every answer. Start with textbook default parameters (prior 0.3, learn 0.1, guess 0.25 for 4-choice, slip 0.1), then refit from real data.
3. **~10k+ attempts. IRT difficulty calibration.** Estimate each question's real difficulty (e.g. R `mirt` or Python `py-irt`), then run adaptive diagnostics with [`catsim`](https://github.com/douglasrizzo/catsim) so the test gets harder or easier the way the real SAT does.
4. **100k+ attempts, only if needed.** Deep KT (DKT/SAKT). Gains over BKT are small and need a lot of data, so this is optional.

### 3.2 LLM usage and cost
Cost per call, estimated at ~1,500 input + 500 output tokens (one explanation or hint):

| Model | $/1M in / out | Per call | 90-day student, 20 calls/day |
|---|---|---|---|
| Claude Haiku 5.5 | $0.10 / $0.50 | ~$0.0004 | **~$0.70** |
| Claude Sonnet 5.5 | $2 / $10 | ~$0.008 | ~$14 |
| Claude Opus 5.5 | $4 / $20 | ~$0.016 | ~$29 |

Plan:
- **Haiku 5.5** for live, high-volume work: hints, "explain this answer", tutor chat.
- **Sonnet or Opus 5.5** offline for drafting new questions and explanations, through the **Batch API (50% off)**. Use **prompt caching** for the long, fixed system prompt (style guide + skill definitions).
- **Cache explanations.** Generate one per question, have it reviewed, and store it. Every student then reads the stored copy at $0, and you only pay live for follow-up questions.
- OpenAI (GPT-6 Luna, ~$0.10/$0.50) and Gemini Flash are similar in price. Pick one provider and wrap it behind one `llm.ts` / `llm.py` so you can switch later.

Realistic LLM bill: **under $1 per paid student per 90-day plan** if explanations are cached. That's small next to a ~$20–50/mo price.

### 3.3 Guardrails for LLM-generated questions
LLMs still make arithmetic mistakes and write wrong answer keys, especially in probability and quadratics. Every generated question goes through this pipeline:
1. LLM drafts the question, 4 choices, the correct answer, an explanation and skill tags.
2. **Math:** an automatic check solves the question independently. Use SymPy, or a second LLM pass with code execution, and reject it if the answers disagree.
3. **R&W:** a second model checks that exactly one answer is defensible.
4. **A person reviews it** before it goes live (`review_status = approved`). Keep a "Report a problem" button on every question.

---

## 4. Tech stack (solo developer, low ops)

| Layer | Choice | Why |
|---|---|---|
| Web app | **Next.js (TypeScript)** on Vercel | One codebase for the site, API routes and the dashboard |
| DB + auth | **Supabase** (Postgres + Auth) | Auth, DB and storage in one place, with a free tier |
| ML service | **Python FastAPI** (pyBKT, catsim) on Railway or Fly.io | KT libraries are Python |
| Payments | **Stripe** (subscriptions + Checkout) | Standard |
| Email | **Resend** (or Postmark) + a cron job | Daily reminders at the time each user picks |
| Push | Web Push (service worker) | Free, no app store needed |
| Math rendering | KaTeX | Fast LaTeX |
| Office hours | Cal.com embed + Zoom/Meet link | Don't build scheduling yourself |
| Analytics | PostHog | Funnel + tracks which channel each signup came from (`?ref=skool`, `?ref=youtube`) |

### Core tables
```
skills(id, section, domain, skill, subskill, exam_weight)
items(id, skill_id, type, stem, choices, answer, explanation,
      difficulty, irt_a, irt_b, source, review_status)
attempts(id, user_id, item_id, correct, time_ms, context[diagnostic|practice|mock], created_at)
mastery(user_id, skill_id, p_mastery, updated_at)
plans(id, user_id, start_date, test_date, days, daily_minutes)
plan_days(plan_id, date, tasks jsonb, completed)
reminders(user_id, channel[email|push], kind[study|exam], local_time, timezone)
subscriptions(user_id, stripe_customer_id, status, tier)
signups(user_id, ref_channel, utm)
```

---

## 5. Feature specs mapped to `modules/`

| Module | Spec |
|---|---|
| 01 enrollment_payments | Sign up → free tier by default → Stripe checkout unlocks personalization |
| 02 diagnostic_test | Optional. ~40–50 Qs covering every domain (fixed form at launch, adaptive later). Skipping it gives the plain curriculum. Also a **whole-curriculum re-diagnostic** every ~3–4 weeks |
| 03 weakness_detection_ml | Rules → BKT → IRT roadmap (§3.1). Output: ranked weak skills |
| 04 curriculum | Free: fixed order by domain. Paid: same content, reordered and filtered by weak skills |
| 05 study_planner | Student picks days (default **90**) + minutes/day. Allocate time ∝ (1 − mastery) × exam_weight, add spaced review of mastered skills, a full mock every ~2 weeks, lighter final week. **Re-plan weekly** as mastery changes |
| 06 reminders | Daily email/push at the student's chosen time and timezone. Separate study and exam reminders (countdown to test date) |
| 07 practice_tests | Weak skill → subskill drills (10–15 Qs). Show before/after mastery |
| 08 progress_dashboard | Mastery per skill, estimated score band per section, streak, time studied, plan completion |
| 09 office_hours | Cal.com booking, paid tier only |
| 10 landing_and_channels | Landing page with `?ref=` tracking for Skool / YouTube / others |

---

## 6. Phased roadmap (one developer, part-time-ish)

| Phase | Weeks | Ship |
|---|---|---|
| **0. Foundation** | 1–2 | Skill taxonomy in DB, question schema, LLM drafting + review pipeline, first **300–500 reviewed questions** across all skills |
| **1. MVP** | 3–8 | Auth, free curriculum, fixed diagnostic, rule-based weak skills, 90-day planner, daily email, Stripe, landing page with ref tracking |
| **2. Personalization v1** | 9–12 | pyBKT mastery service, subskill practice tests, progress dashboard, Haiku-powered "explain / hint" |
| **3. Polish** | 13–16 | Full-length mocks (2-module adaptive format), web push, office hours, weekly AI progress summary email |
| **4. Data-driven** | after launch | IRT calibration from real attempts, adaptive diagnostic via catsim, A/B test the planner, refit BKT |

Launch Phase 1 to your Skool community as a beta. Real attempt data is what makes the ML good.

---

## 7. Legal and privacy checklist (not legal advice)
- **COPPA:** most SAT students are 15–18, so it mostly doesn't apply. The amended COPPA Rule's compliance date was 22 Apr 2026, though, and PSAT 8/9 students can be under 13. Add an **age gate** and block under-13 signups, or get parental consent.
- **COPPA 2.0** (would extend protections to ages 13–16) passed the Senate in March 2026 but isn't law yet. Watch it.
- **FERPA** only matters if you later sell to schools.
- No ad tracking on student accounts. Write a clear privacy policy and let students delete their data.
- Use "SAT" only descriptively (e.g. "prep for the SAT®"). It's a College Board trademark, and you shouldn't imply any endorsement.

---

## Sources
- SAT format: [College Test Coach](https://www.collegetestcoach.com/blog/digital-sat-format-explained), [Catalyst Test Prep](https://www.catalysttestprep.com/blog/complete-guide-digital-sat-2026), [Makon AI](https://www.makon.ai/blog/digital-sat-format/)
- KT vs LLMs: [Specialised KT Models Outperform LLMs (arXiv 2603.02830)](https://arxiv.org/html/2603.02830), [KT survey](https://arxiv.org/html/2105.15106v4)
- Libraries: [pyBKT paper](https://arxiv.org/pdf/2105.00385), [pyBKT on PyPI](https://pypi.org/project/pybkt), [catsim](https://github.com/douglasrizzo/catsim/blob/master/README.md)
- LLM pricing: Anthropic model table (Oct 2026), [BenchLM pricing](https://benchlm.ai/llm-pricing), [ActuIA Oct 2026](https://www.actuia.com/en/news/ai-api-pricing-in-october-2026-050-to-50-for-output/)
- LLM math errors: [Springer 2026 study](https://link.springer.com/article/10.1007/s11858-026-01813-4)
- Content licensing: [College Board permissions](https://privacy.collegeboard.org/copyright-trademark/request-instructions), [Ivy Global](https://prep.ivyglobal.com/)
- Competitors: [Acely](https://acely.com/blog/best-sat-prep-options-2026), [LearnQ pricing](https://www.learnq.ai/pricing), [AlphaTest price comparison](https://www.alphatestai.com/blog/378-is-paid-sat-prep-worth-it-real-price-comparison-of-popular-digital-sat-apps)
- Privacy: [Federal Register COPPA rule](https://www.govinfo.gov/content/pkg/FR-2025-04-22/html/2025-05904.htm), [COPPA 2.0 status](https://krdo.com/stacker-cybersecurity-privacy/2026/08/04/childrens-online-privacy-looks-different-this-school-year-even-without-coppa-2-0/)
