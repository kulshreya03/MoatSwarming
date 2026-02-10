from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Annotated, List
from fastapi import UploadFile, File
import PyPDF2
from agents.skill_extract import extract_skills_from_text
from database.database import SessionLocal
import database.models as models
from sqlalchemy.orm import Session

router = APIRouter(prefix="/agent", tags=["Agent Management"])

# Pydantic model for task response
class TaskResponse(BaseModel):
    task_id: int
    project_id: int
    task_description: str
    github_repo: str
    status: str

    class Config:
        from_attributes = True

# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

@router.post("/extract-skills")
async def extract_skills(resume:UploadFile = File(...)):
    
    reader = PyPDF2.PdfReader(resume.file)
    text = ""
    for page in reader.pages:
        text += page.extract_text()

    #calling agent
    skills = extract_skills_from_text(text)
    return {"skills": skills}

@router.get("/view-tasks", response_model=List[TaskResponse])
async def view_tasks(db: db_dependency):
    """Fetch all tasks from the database"""
    tasks = db.query(models.ProjectTasks).all()
    if not tasks:
        return []
    return tasks

