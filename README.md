# AdaptiveLearn

Digital SAT prep (Math + Reading & Writing) where the content is free and personalization is paid.

Full build plan, ML approach and research: [docs/BUILD_PLAN.md](docs/BUILD_PLAN.md)

## Run the POC

Needs: Node 20 + pnpm, Python via `uv`, and [Ollama](https://ollama.com).

```bash
./start-demo.sh
# open http://localhost:3000/?ref=skool
```

| Part | Where | What it does |
|---|---|---|
| Web app | `web/` (Next.js 16) | Landing page, diagnostic, results, 90-day plan, practice drills, progress |
| ML service | `ml/` (FastAPI + pyBKT) | Bayesian Knowledge Tracing: mastery per skill after every answer, weak-skill ranking, score estimate, plan generation |
| Tutor | Ollama, `qwen2.5:7b-instruct` | Small local LLM that explains mistakes and answers follow-ups. Set `OLLAMA_MODEL=llama3.2:1b` for a faster, weaker model |

Retrain the BKT model: `cd ml && uv run python train.py`. It currently trains on simulated students and checks that pyBKT recovers the true parameters. Swap in real attempt logs once you have them.

**Demo script:** try the sample question on the landing page, take the diagnostic (miss a few on purpose), click *Unlock personalization*, build the plan, hit *Start* on today's first block, answer a question and ask the tutor, then open *Progress*.

POC shortcuts: state lives in the browser's localStorage, payment is a mock toggle, reminders are a preview only, and there are 40 original questions (5 per skill).

## Business model
- **Content is free.** Anyone can follow the plain structured curriculum.
- **Personalization is charged** (pay fee). It covers the diagnostic-driven path, the study plan and progress tracking.
- **Channels:** Skool (community), YouTube and other platforms. Each one links to this site.
- **This site** is a standalone web app. All personalization happens here. It doesn't integrate with any channel; the channels only hold links to it.

## Student flow
1. **Enroll**, then choose whether to take the **diagnostic test**.
   - Takes the test: the curriculum gets personalized.
   - Skips it: they get the plain structured curriculum.
2. **ML algorithm** shows what the student is weak at.
3. Student works on the **problematic areas** (lowest-scoring topics). We need to show their progress.
4. Student **chooses the number of days** for the plan, and we work out the material per day. Default: **90 days**.
5. **Daily reminder email / notifications**
   - Student can set the reminder time.
   - Separate reminders for study and for exams.
6. **Weak parts have sub-parts.** Students take practice tests on them, and we show their improvement.
   - Whole-curriculum diagnostic test
   - Office hours

## Folder layout
| Folder | Covers |
|---|---|
| `modules/01_enrollment_payments` | Sign-up, free vs paid tier, pay fee |
| `modules/02_diagnostic_test` | Optional initial test + whole-curriculum diagnostic |
| `modules/03_weakness_detection_ml` | ML model that ranks weak topics from scores |
| `modules/04_curriculum` | Plain structured curriculum + personalized variant |
| `modules/05_study_planner` | No. of days → material per day (default 90) |
| `modules/06_reminders_notifications` | Daily email/push, user-set time, study vs exam |
| `modules/07_practice_tests` | Sub-part practice tests for weak areas |
| `modules/08_progress_dashboard` | Showing progress and improvement |
| `modules/09_office_hours` | Scheduling live help sessions |
| `modules/10_landing_and_channels` | Landing page that Skool, YouTube, etc. link to; track which channel each signup came from |
| `docs/` | Build plan, specs, diagrams |
