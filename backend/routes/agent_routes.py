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


router = APIRouter(prefix="/agent", tags=["Agent Management"])

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

@router.get("/view-tasks", response_model=List[TaskResponse])
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

