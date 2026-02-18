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
    tasks = db.query(models.ProjectTasks).all()
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
    #print(task_list)

    resume_skills = state["resume_skills"]
    #print(resume_skills)
    if not resume_skills:
        return []

    # Flatten categorized skills → single list
    flat_skills = []
    for category in resume_skills.values():
        flat_skills.extend(category)
    #print(flat_skills)

    prompt = f"""
You are an expert skill-task matching agent.

GOAL:
Match resume skills with project tasks and Return ONLY relevant tasks.

MATCHING RULES:

1. Direct keyword match  
   Example:
   - React → React task
   - Node.js → Backend API task

2. Fuzzy semantic mapping:

   FRONTEND → React, Angular, Vue, HTML, CSS, JavaScript  
   BACKEND → Node.js, Python, Java, Express.js, Spring  
   DATABASE → MongoDB, MySQL, PostgreSQL  
   CLOUD → AWS, Azure, GCP  
   DEVOPS → Docker, Kubernetes, CI/CD, Jenkins  

3. If task mentions a domain (e.g., "frontend dashboard"),
   map it to related skills.

4. Return task if ≥1 skill matches.

EXAMPLE:

Resume Skills:
["Python", "FastAPI", "JWT"]

Task:
"Backend API Module (FastAPI) - REST endpoints"

Output:
[
  {{
    "task_id": 1,
    "project_id": 1,
    "task_description": "Backend API Module (FastAPI) - REST endpoints",
    "github_repo": "...",
    "status": "pending",
    "matched_skills": ["FastAPI", "Python"]
  }}
]

Resume Skills:
{flat_skills}

Project Tasks:
{json.dumps(task_list, indent=2)}

STRICT OUTPUT JSON:
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
"""

    response = llm.invoke([HumanMessage(content=prompt)])
    try:
        matched_tasks = json.loads(response.content)
    except Exception:
        matched_tasks = []

    return matched_tasks
