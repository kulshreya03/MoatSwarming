from llm import llm
import json
import re
from langchain_core.messages import HumanMessage
from state import state


def normalize_skill(skill: str) -> str:
    """Normalize skill names for matching"""
    
    skill = skill.lower().strip()

    synonym_map = {
        "node": "node.js",
        "nodejs": "node.js",
        "express": "express.js",
        "mongo": "mongodb",
        "aws ec2": "aws",
        "js": "javascript",
        "reactjs": "react",
        "postgres": "postgresql"
    }

    return synonym_map.get(skill, skill)


def python_skill_matcher(skills_dict):
    """
    Fast Python skill processing layer before LLM matching
    """

    flat_skills = []

    for category in skills_dict.values():
        for skill in category:
            normalized = normalize_skill(skill)
            flat_skills.append(normalized)

    # remove duplicates
    flat_skills = list(set(flat_skills))

    # create lookup set (fast matching)
    skill_set = set(flat_skills)

    return flat_skills, skill_set


def extract_skills_from_text(resume_text: str):

    prompt = f"""
You are an expert resume parsing and skill extraction AI.

STRICT OUTPUT RULES:

* Return ONLY valid raw JSON
* No markdown
* No explanations
* No trailing commas
* All fields must exist
* Skills must be normalized and deduplicated
* Do NOT include soft skills

Resume Text:
{resume_text}

Return EXACT JSON:

{{
"skills": {{
"languages": [],
"frameworks": [],
"libraries": [],
"databases": [],
"cloud": [],
"devops": [],
"tools": [],
"concepts": []
}},
"domain": ""
}}
"""

    response = llm.invoke([HumanMessage(content=prompt)])

    content = re.sub(r"```json|```", "", response.content).strip()

    try:
        data = json.loads(content)

        skills_dict = data["skills"]

        # ---------- Python Skill Matcher Layer ----------
        flat_skills, skill_set = python_skill_matcher(skills_dict)

        # store in state
        state["resume_skills"] = skills_dict
        state["flat_skills"] = flat_skills
        state["skill_lookup"] = skill_set

        print("Categorized Skills:", skills_dict)
        print("Flat Skills:", flat_skills)

        return skills_dict

    except json.JSONDecodeError:
        raise ValueError("Failed to parse JSON from LLM response")
