"""SAT skill taxonomy used by the POC (domain level).

exam_weight = section share (0.5 each) x domain share within the section.
"""

SKILLS = {
    # Math
    "algebra": {"section": "math", "name": "Algebra", "domain_weight": 0.35},
    "advanced_math": {"section": "math", "name": "Advanced Math", "domain_weight": 0.35},
    "psda": {"section": "math", "name": "Problem-Solving & Data Analysis", "domain_weight": 0.15},
    "geometry_trig": {"section": "math", "name": "Geometry & Trigonometry", "domain_weight": 0.15},
    # Reading & Writing
    "craft_structure": {"section": "rw", "name": "Craft & Structure", "domain_weight": 0.28},
    "info_ideas": {"section": "rw", "name": "Information & Ideas", "domain_weight": 0.26},
    "conventions": {"section": "rw", "name": "Standard English Conventions", "domain_weight": 0.26},
    "expression": {"section": "rw", "name": "Expression of Ideas", "domain_weight": 0.20},
}

for s in SKILLS.values():
    s["exam_weight"] = 0.5 * s["domain_weight"]
