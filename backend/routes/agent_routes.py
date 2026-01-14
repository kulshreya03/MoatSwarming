from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Annotated
from fastapi import UploadFile, File
import PyPDF2
from agents.skill_extract import extract_skills_from_text

router = APIRouter(prefix="/agent", tags=["Agent Management"])

@router.post("/extract-skills")
async def extract_skills(resume:UploadFile = File(...)):
    
    reader = PyPDF2.PdfReader(resume.file)
    text = ""
    for page in reader.pages:
        text += page.extract_text()

    #calling agent
    skills = extract_skills_from_text(text)
    return {"skills": skills}