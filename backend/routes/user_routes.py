from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.database import SessionLocal
import database.models as models

router = APIRouter(prefix="/user",tags=["User Management"])

#Coonect to DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/equity/{user_id}")
async def get_user_equity(user_id: int, db: Session = Depends(get_db)):
    """
    Returns all projects where user has equity
    """

    equity_records = db.query(models.Equity).filter(
        models.Equity.user_id == user_id
    ).all()

    response = []

    for record in equity_records:

        project = db.query(models.Project).filter(
            models.Project.project_id == record.project_id
        ).first()

        response.append({
            "project_id": record.project_id,
            "project_name": project.project_name if project else "Unknown",
            "units": round(record.total_units, 2),
            "equity": round(record.equity_percentage, 2)
        })

    return response