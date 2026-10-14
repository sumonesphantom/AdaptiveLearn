# AdaptiveLearn

Digital SAT prep (Math + Reading & Writing) where the content is free and personalization is paid.

Full build plan, ML approach and research: [docs/BUILD_PLAN.md](docs/BUILD_PLAN.md)

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
