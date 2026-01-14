from llm import llm
import json
import re
from langchain_core.messages import HumanMessage

def extract_skills_from_text(resume_text: str) -> list[str]:
    prompt = f"""
    You are an expert resume parsing AI.

    STRICT RULES:
    - Return ONLY valid raw JSON
    - No markdown
    - No explanations
    - All fields must exist
    - Skill names must be concise and normalized

    Extract:
    1. Categorized technical skills
    2. Primary professional domain (specific role/domain)

    Resume Text:
    {resume_text}

    Return EXACT JSON:
    {{
    "skills": {{
        "languages": [],
        "frameworks": [],
        "databases": [],
        "cloud": [],
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
        return data["skills"]
    except json.JSONDecodeError:
        raise ValueError("Failed to parse JSON from LLM response")
    