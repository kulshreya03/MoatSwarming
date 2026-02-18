from llm import llm
import json
import re
from langchain_core.messages import HumanMessage
from state import state

def extract_skills_from_text(resume_text: str) -> list[str]:

    prompt = f"""
    You are an expert resume parsing and skill extraction AI.

STRICT OUTPUT RULES:

* Return ONLY valid raw JSON
* No markdown
* No explanations or text outside JSON
* Do not include trailing commas
* All fields must exist even if empty
* Skill names must be concise, normalized, and deduplicated
* Use commonly accepted industry names (e.g., "Node.js" not "Node", "PostgreSQL" not "Postgres" unless context demands)
* Do NOT include soft skills
* Do NOT include job roles as skills

EXTRACTION RULES:

* Extract ONLY technical skills
* Infer skills even if mentioned in projects/tools context
* Map synonyms → normalized name
  Example:
  "Express" → "Express.js"
  "Mongo" → "MongoDB"
  "AWS EC2" → "AWS"

DOMAIN INFERENCE RULES:

* Domain must be specific and professional
* Examples:

  * "Full Stack Web Development"
  * "Cloud & DevOps Engineering"
  * "Backend Engineering"
  * "Blockchain Development"
  * "Data Engineering"
* Choose the MOST dominant domain based on skills + projects

Resume Text:
{resume_text}

Return EXACT JSON STRUCTURE:
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

    '''prompt = f"""
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

    '''

    response = llm.invoke([HumanMessage(content=prompt)])
    content = re.sub(r"```json|```", "", response.content).strip()
    try:
        data = json.loads(content)
        state["resume_skills"] = data["skills"]
        print(state["resume_skills"])
        return data["skills"]
    except json.JSONDecodeError:
        raise ValueError("Failed to parse JSON from LLM response")
    