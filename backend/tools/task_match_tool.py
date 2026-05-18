from langchain.tools import tool
from sqlalchemy.orm import Session
from database.database import SessionLocal
import database.models as models
import re
import json


@tool
def fetch_matching_tasks(user_id: int) -> str:
    """
    Fetch pending tasks and filter them based on user resume skills.
    Returns filtered task list as JSON string.
    """

    db: Session = SessionLocal()

    try:
        
        #Fetch pending tasks
        tasks = db.query(models.ProjectTasks).filter(
            models.ProjectTasks.status == "pending"
        ).all()

        task_list = []

        for task in tasks:
            task_list.append({
                "task_id": task.task_id,
                "project_id": task.project_id,
                "task_description": task.task_description,
                "github_repo": task.github_repo,
                "status": task.status
            })

        #Fetch user skills
        user_skills = db.query(models.UserSkills).filter(
            models.UserSkills.user_id == user_id
        ).first()

        if not user_skills:
            return json.dumps([])

        resume_skills = user_skills.skills

        if not resume_skills:
            return json.dumps([])

        #flat skills
        flat_skills = []

        for category in resume_skills.values():
            flat_skills.extend([s.lower() for s in category])

        skill_lookup = set(flat_skills)

        #filter tasks
        filtered_tasks = []

        for task in task_list:

            text = task["task_description"].lower()

            tokens = re.findall(r"[a-zA-Z0-9\.\-]+", text)

            if any(skill in tokens for skill in skill_lookup):

                filtered_tasks.append(task)

        # fallback
        if not filtered_tasks:
            filtered_tasks = task_list

        result = {
            "resume_skills": flat_skills,
            "filtered_tasks": filtered_tasks
        }

        return json.dumps(result)

    finally:
        db.close()