from llm import llm
from database.database import SessionLocal, engine
import database.models as models
from sqlalchemy.orm import Session
from state import state
from langchain_core.messages import HumanMessage
import json
import re

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


    print("Task List:", task_list)

    resume_skills = state["resume_skills"]
    #print(resume_skills)
    if not resume_skills:
        return []

    # Flatten categorized skills → single list
    flat_skills = state["flat_skills"]
    print("Resume skills:", flat_skills)


    #New Additions
    skill_lookup = state["skill_lookup"]

    filtered_tasks = []

    for task in task_list:
        text = task["task_description"].lower()

        tokens = re.findall(r"[a-zA-Z0-9\.\-]+", text)

        if any(skill in tokens for skill in skill_lookup):
            filtered_tasks.append(task)

    # if nothing matched, fallback to all tasks
    if not filtered_tasks:
        filtered_tasks = task_list

    prompt = f"""
You are a Skill-Task Matching Engine.

Match resume skills with project tasks.

Return ONLY tasks that match the resume skills.

------------------------
RESUME SKILLS
------------------------
{flat_skills}

------------------------
PROJECT TASKS
------------------------
{json.dumps(filtered_tasks, indent=2)}

------------------------
MATCHING RULES
------------------------

A task matches if:

1. A resume skill appears in the task description
2. A framework matches its language
   example: react → frontend
3. A cloud skill matches cloud tasks
   example: aws → deployment
4. A database skill matches database tasks
5. DevOps skills match CI/CD or deployment tasks

------------------------
OUTPUT FORMAT
------------------------

Return ONLY JSON.

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

Do NOT return tasks with no matching skills.
"""


    response = llm.invoke([HumanMessage(content=prompt)])
    try:
        content = re.sub(r"```json|```", "", response.content).strip()
        matched_tasks = json.loads(content)
        print(response.content)
    except Exception:
        matched_tasks = []

    return matched_tasks
