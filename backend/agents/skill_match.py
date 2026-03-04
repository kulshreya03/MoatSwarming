from llm import llm
from database.database import SessionLocal, engine
import database.models as models
from sqlalchemy.orm import Session
from state import state
from langchain_core.messages import HumanMessage
import json

models.Base.metadata.create_all(bind=engine)

#Coonect to DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()



def match_skills_to_tasks(db:Session):

    #Check if status is pending, display task only if status:pending
    tasks = db.query(models.ProjectTasks).filter(models.ProjectTasks.status == "pending").all()
    #print(tasks)

    # Convert tasks to list
    task_list = []
    for task in tasks:
            task_list.append({
                "task_id": task.task_id,
                "project_id": task.project_id,
                "task_description": task.task_description,
                "github_repo": task.github_repo,
                "status": task.status
            })    


    print(task_list)

    resume_skills = state["resume_skills"]
    #print(resume_skills)
    if not resume_skills:
        return []

    # Flatten categorized skills → single list
    flat_skills = []
    for category in resume_skills.values():
        flat_skills.extend(category)
    #print(flat_skills)

    prompt = fprompt = f"""
You are an expert Skill-Task Matching Agent.

OBJECTIVE:
Match resume skills with project tasks and return ONLY relevant tasks.

You must behave like a deterministic matching engine, not a chatbot.

--------------------------------------------------
MATCHING PIPELINE (Follow STRICTLY)
--------------------------------------------------

Step 1 — Normalize Resume Skills
- Convert all skills to lowercase
- Expand abbreviations
- Merge duplicates

Example:
"Node", "NodeJS" → "node.js"

--------------------------------------------------

Step 2 — Expand Skills Semantically

Use the mapping below:

FRONTEND →
react, angular, vue, html, css, javascript, typescript, next.js

BACKEND →
node.js, express, python, fastapi, django, java, spring, .net

DATABASE →
mongodb, mysql, postgresql, redis, firebase

CLOUD →
aws, azure, gcp, vercel, netlify

DEVOPS →
docker, kubernetes, ci/cd, github actions, jenkins, terraform

AUTHENTICATION →
jwt, oauth, session auth, web3 auth

BLOCKCHAIN →
ethereum, solidity, web3, metamask, smart contracts

--------------------------------------------------

Step 3 — Task Skill Extraction

From each task description:

Extract:

• Tech stack names  
• Frameworks  
• Domain words (frontend, backend, cloud, devops, database)

Example:

"Build Frontend Dashboard using React"

Extract →
frontend, react

--------------------------------------------------

Step 4 — Matching Logic

A task is MATCHED if ANY of these are true:

1. Direct keyword match  
2. Semantic category match  
3. Synonym match  
4. Domain match

Examples:

Resume: AWS  
Task: Deploy backend to cloud → MATCH

Resume: React  
Task: Frontend dashboard → MATCH

Resume: Docker  
Task: CI/CD pipeline → MATCH

--------------------------------------------------

Step 5 — Matched Skills Output

Return ONLY skills that contributed to the match.

Example:

matched_skills: ["React", "JavaScript"]

--------------------------------------------------

FILTERING RULE

• If NO skills match → DO NOT return task  
• If ≥1 skill matches → RETURN task  

--------------------------------------------------

INPUT DATA
--------------------------------------------------

Resume Skills:
{flat_skills}

Project Tasks:
{json.dumps(task_list, indent=2)}

--------------------------------------------------

STRICT OUTPUT FORMAT (JSON ONLY)
--------------------------------------------------

[
  {{
    "task_id": int,
    "project_id": int,
    "task_description": string,
    "github_repo": string,
    "status": string,
    "matched_skills": [string]
  }}
]

IMPORTANT:

• Do NOT explain  
• Do NOT add text  
• Do NOT hallucinate skills  
• Do NOT return unmatched tasks  
• Output MUST be valid JSON
"""

    response = llm.invoke([HumanMessage(content=prompt)])
    try:
        matched_tasks = json.loads(response.content)
    except Exception:
        matched_tasks = []

    return matched_tasks
