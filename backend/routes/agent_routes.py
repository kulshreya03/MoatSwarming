from fastapi import APIRouter, HTTPException, Depends, Form
from pydantic import BaseModel
from typing import Annotated, List
from fastapi import UploadFile, File
import PyPDF2
from agents.skill_extract import extract_skills_from_text
from database.database import SessionLocal
import database.models as models
from sqlalchemy.orm import Session
from state import state
from agents.skill_match import match_skills_to_tasks

from services.github_mcp_service import get_commit_counts
#from service.github_mcp_service import get_commit_count


router = APIRouter(prefix="/agent", tags=["Agent Management"])

#Coonect to DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Pydantic model for task response
class TaskResponse(BaseModel):
    task_id: int
    project_id: int
    task_description: str
    github_repo: str
    status: str
    matched_skills:List[str]

    class Config:
        from_attributes = True

class OngoingTaskResponse(BaseModel):
    task_id: int
    project_id: int
    task_description: str
    github_repo: str
    commit_count: int
    status: str


@router.post("/extract-skills")
async def extract_skills(
    resume:UploadFile = File(...),
    user_id: int = Form(...),
    db: Session = Depends(get_db)):
    
    reader = PyPDF2.PdfReader(resume.file)
    text = ""
    for page in reader.pages:
        text += page.extract_text()

    #calling agent
    skills = extract_skills_from_text(text)

    #Fetching from db
    existing = db.query(models.UserSkills).filter(
        models.UserSkills.user_id == user_id
    ).first()

    if existing:
        existing.skills = skills

    else:
        new_skills = models.UserSkills(
            user_id=user_id,
            skills=skills
        )
        db.add(new_skills)

    db.commit()

    #state["resume_text"] = skills
    return {"skills": skills}

#Fetch previously saved skills
@router.get("/user/skills/{user_id}")
def get_user_skills(user_id:int, db:Session = Depends(get_db)):

    skills = db.query(models.UserSkills).filter(
        models.UserSkills.user_id == user_id
    ).first()

    if not skills:
        return {"skills": None}

    return {"skills": skills.skills}

#Edit skills
@router.put("/user/skills")
async def update_skills(
    user_id:int,
    skills:dict,
    db:Session = Depends(get_db)
):

    record = db.query(models.UserSkills).filter(
        models.UserSkills.user_id == user_id
    ).first()

    record.skills = skills

    db.commit()

    return {"message":"skills updated"}

@router.get("/view-tasks/{user_id}")
async def view_tasks(user_id:int, db: Session = Depends(get_db)):
    """Fetch all tasks from the database"""
    #db = SessionLocal()
    try:
        tasks = match_skills_to_tasks(db,user_id)
        if not tasks:
            return []
        return tasks
    finally:
        db.close()


#Admin Route
@router.get("/view-ongoing-tasks", response_model=List[OngoingTaskResponse])
async def view_ongoing_tasks(db: Session = Depends(get_db)):

    tasks = db.query(models.ProjectTasks)\
        .filter(models.ProjectTasks.status == 'assigned')\
        .all()

    # 1️⃣ Extract unique repos
    unique_repos = list({
        task.github_repo
        for task in tasks
        if task.github_repo
    })

    # 2️⃣ Call MCP once
    commit_map = await get_commit_counts(unique_repos)

    response = []

    # 3️⃣ Map repo → tasks
    for task in tasks:

        commit_count = commit_map.get(task.github_repo, 0)

        response.append({
            "task_id": task.task_id,
            "project_id": task.project_id,
            "task_description": task.task_description,
            "github_repo": task.github_repo,
            "commit_count": commit_count,
            "status": task.status
        })

    # 4️⃣ Return response
    return response
'''
@router.get("/view-ongoing-tasks", response_model=List[OngoingTaskResponse])
async def view_ongoing_tasks(db: Session = Depends(get_db)):

    tasks = db.query(models.ProjectTasks)\
        .filter(models.ProjectTasks.status == 'assigned')\
        .all()
    
    response = []

    for task in tasks:

        commit_count = await get_commit_count(task.github_repo)
        print(commit_count)

        response.append({
            "task_id": task.task_id,
            "project_id": task.project_id,
            "task_description": task.task_description,
            "github_repo": task.github_repo,
            "commit_count": commit_count,
            "status":task.status
        })  


    return response
'''
