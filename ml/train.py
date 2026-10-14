"""Train the Bayesian Knowledge Tracing model with pyBKT.

We have no real students yet, so this simulates students from known
"true" parameters, fits pyBKT on that data, and checks that the fit
recovers them. Swap `simulate()` for real attempt logs once they exist.

Run:  uv run python train.py
Out:  model/bkt_params.json
"""

import json
from pathlib import Path

import numpy as np
import pandas as pd
from pyBKT.models import Model

from skills import SKILLS

RNG = np.random.default_rng(7)
N_STUDENTS = 1000
OPPORTUNITIES = 10

# Plausible "true" parameters per skill (what a real cohort might look like).
TRUE = {
    "algebra":         dict(prior=0.45, learn=0.15, guess=0.22, slip=0.08),
    "advanced_math":   dict(prior=0.30, learn=0.10, guess=0.20, slip=0.10),
    "psda":            dict(prior=0.40, learn=0.14, guess=0.23, slip=0.09),
    "geometry_trig":   dict(prior=0.28, learn=0.11, guess=0.20, slip=0.10),
    "craft_structure": dict(prior=0.38, learn=0.09, guess=0.25, slip=0.12),
    "info_ideas":      dict(prior=0.42, learn=0.10, guess=0.24, slip=0.10),
    "conventions":     dict(prior=0.35, learn=0.16, guess=0.22, slip=0.07),
    "expression":      dict(prior=0.40, learn=0.13, guess=0.25, slip=0.09),
}


def simulate() -> pd.DataFrame:
    rows = []
    order = 0
    for student in range(N_STUDENTS):
        for skill, p in TRUE.items():
            known = RNG.random() < p["prior"]
            for _ in range(OPPORTUNITIES):
                p_correct = (1 - p["slip"]) if known else p["guess"]
                rows.append(
                    {
                        "order_id": order,
                        "user_id": f"s{student}",
                        "skill_name": skill,
                        "correct": int(RNG.random() < p_correct),
                    }
                )
                order += 1
                if not known and RNG.random() < p["learn"]:
                    known = True
    return pd.DataFrame(rows)


def main() -> None:
    df = simulate()
    print(f"Simulated {len(df):,} attempts from {N_STUDENTS:,} students")

    model = Model(seed=42, num_fits=3, parallel=False)
    model.fit(data=df)
    auc = model.evaluate(data=df, metric="auc")
    print(f"Training AUC: {auc:.3f}")

    params = model.params().reset_index()
    out = {}
    for skill in SKILLS:
        sp = params[params["skill"] == skill]

        def get(name: str) -> float:
            return float(sp[sp["param"] == name]["value"].iloc[0])

        out[skill] = {
            "prior": get("prior"),
            "learn": get("learns"),
            "guess": get("guesses"),
            "slip": get("slips"),
        }

    print(f"\n{'skill':<16} {'param':<6} {'true':>6} {'fitted':>7}")
    for skill, fitted in out.items():
        for k, v in fitted.items():
            print(f"{skill:<16} {k:<6} {TRUE[skill][k]:>6.2f} {v:>7.2f}")

    path = Path(__file__).parent / "model" / "bkt_params.json"
    path.parent.mkdir(exist_ok=True)
    path.write_text(json.dumps({"auc": auc, "skills": out}, indent=2))
    print(f"\nSaved {path}")


if __name__ == "__main__":
    main()
