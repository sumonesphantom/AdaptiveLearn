"""ML service: mastery (BKT inference) and study-plan generation.

Run:  uv run uvicorn server:app --port 8000 --reload
"""

import json
from datetime import date, timedelta
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from skills import SKILLS

PARAMS_PATH = Path(__file__).parent / "model" / "bkt_params.json"
DEFAULT = {"prior": 0.3, "learn": 0.1, "guess": 0.25, "slip": 0.1}


def load_params() -> tuple[dict, float | None]:
    if PARAMS_PATH.exists():
        data = json.loads(PARAMS_PATH.read_text())
        return data["skills"], data.get("auc")
    return {s: DEFAULT for s in SKILLS}, None


PARAMS, AUC = load_params()

app = FastAPI(title="AdaptiveLearn ML")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])


class Attempt(BaseModel):
    skill: str
    correct: bool


class MasteryRequest(BaseModel):
    attempts: list[Attempt]


class PlanRequest(BaseModel):
    mastery: dict[str, float]
    days: int = Field(90, ge=7, le=365)
    minutes_per_day: int = Field(45, ge=15, le=240)
    start: date | None = None


def bkt_trace(attempts: list[Attempt]) -> dict[str, dict]:
    """Run BKT forward over each skill's attempts in order."""
    state = {s: {"p": PARAMS[s]["prior"], "history": [PARAMS[s]["prior"]], "n": 0, "correct": 0} for s in SKILLS}
    for a in attempts:
        if a.skill not in state:
            continue
        p = PARAMS[a.skill]
        st = state[a.skill]
        k = st["p"]
        if a.correct:
            post = k * (1 - p["slip"]) / (k * (1 - p["slip"]) + (1 - k) * p["guess"])
        else:
            post = k * p["slip"] / (k * p["slip"] + (1 - k) * (1 - p["guess"]))
        st["p"] = post + (1 - post) * p["learn"]
        st["history"].append(round(st["p"], 4))
        st["n"] += 1
        st["correct"] += int(a.correct)
    return state


def score_estimate(mastery: dict[str, float]) -> dict[str, int]:
    """Rough section score (200-800) from weighted mastery. Demo heuristic, not calibrated."""
    out = {}
    for section in ("math", "rw"):
        skills = [s for s, m in SKILLS.items() if m["section"] == section]
        w = sum(SKILLS[s]["domain_weight"] for s in skills)
        m = sum(mastery[s] * SKILLS[s]["domain_weight"] for s in skills) / w
        out[section] = int(round((200 + 600 * m) / 10) * 10)
    out["total"] = out["math"] + out["rw"]
    return out


@app.get("/health")
def health():
    return {"ok": True, "model": "BKT (pyBKT)", "trained": PARAMS_PATH.exists(), "auc": AUC}


@app.get("/skills")
def skills():
    return {"skills": SKILLS, "params": PARAMS}


@app.post("/mastery")
def mastery(req: MasteryRequest):
    state = bkt_trace(req.attempts)
    mastery = {s: round(v["p"], 4) for s, v in state.items()}
    ranked = sorted(
        SKILLS,
        key=lambda s: (1 - mastery[s]) * SKILLS[s]["exam_weight"],
        reverse=True,
    )
    return {
        "mastery": mastery,
        "history": {s: v["history"] for s, v in state.items()},
        "answered": {s: {"n": v["n"], "correct": v["correct"]} for s, v in state.items()},
        "weakest": ranked,
        "estimate": score_estimate(mastery),
    }


@app.post("/plan")
def plan(req: PlanRequest):
    start = req.start or date.today()
    n = req.days
    m = {s: min(max(req.mastery.get(s, DEFAULT["prior"]), 0.0), 1.0) for s in SKILLS}
    # Need = how far from mastery, scaled by how much the skill is worth on the test.
    need = {s: (1 - m[s]) * SKILLS[s]["exam_weight"] + 0.01 for s in SKILLS}
    credit = {s: 0.0 for s in SKILLS}
    by_section = {sec: [s for s in SKILLS if SKILLS[s]["section"] == sec] for sec in ("math", "rw")}
    strongest = sorted(SKILLS, key=lambda s: m[s], reverse=True)

    taper_from = n - 6 if n >= 21 else n + 1
    days, minutes_by_skill = [], {s: 0 for s in SKILLS}

    for i in range(n):
        d = start + timedelta(days=i)
        day_no = i + 1
        if day_no == n:
            days.append({"day": day_no, "date": d.isoformat(), "kind": "rest",
                         "blocks": [{"kind": "rest", "title": "Light review and rest before test day", "minutes": 20}]})
            continue
        if day_no % 14 == 0 or day_no == taper_from:
            days.append({"day": day_no, "date": d.isoformat(), "kind": "mock",
                         "blocks": [{"kind": "mock", "title": "Full-length practice test (2 modules per section)", "minutes": 134}]})
            continue

        blocks = []
        tapering = day_no > taper_from
        practice_min = req.minutes_per_day if not tapering else int(req.minutes_per_day * 0.6)
        review = day_no % 4 == 0 and not tapering
        if review:
            practice_min -= 10
        half = practice_min // 2
        for sec in ("math", "rw"):
            for s in by_section[sec]:
                credit[s] += need[s]
            pick = max(by_section[sec], key=lambda s: credit[s])
            credit[pick] -= sum(need[s] for s in by_section[sec])
            blocks.append({"kind": "practice", "skill": pick, "title": SKILLS[pick]["name"],
                           "minutes": half, "questions": max(4, half // 2)})
            minutes_by_skill[pick] += half
        if review:
            r = strongest[(day_no // 4) % 3]
            blocks.append({"kind": "review", "skill": r, "title": f"Spaced review: {SKILLS[r]['name']}",
                           "minutes": 10, "questions": 5})
            minutes_by_skill[r] += 10
        days.append({"day": day_no, "date": d.isoformat(), "kind": "taper" if tapering else "study", "blocks": blocks})

    total = sum(minutes_by_skill.values()) or 1
    return {
        "days": days,
        "summary": {
            "total_days": n,
            "mock_tests": sum(1 for d in days if d["kind"] == "mock"),
            "share": {s: round(v / total, 3) for s, v in minutes_by_skill.items()},
        },
    }
