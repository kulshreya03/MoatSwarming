from fastapi import APIRouter, HTTPException, Depends
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

from services.github_mcp_service import get_commit_count


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
async def extract_skills(resume:UploadFile = File(...)):
    
    reader = PyPDF2.PdfReader(resume.file)
    text = ""
    for page in reader.pages:
        text += page.extract_text()

    #calling agent
    skills = extract_skills_from_text(text)
    state["resume_text"] = skills
    return {"skills": skills}

@router.get("/view-tasks")
async def view_tasks():
    """Fetch all tasks from the database"""
    db = SessionLocal()
    try:
        tasks = match_skills_to_tasks(db)
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

