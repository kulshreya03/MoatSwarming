from fastapi import APIRouter
from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from database.database import SessionLocal, engine
import database.models as models

models.Base.metadata.create_all(bind=engine)

#Coonect to DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

router = APIRouter(prefix="/tasks", tags=["Tasks"])

@router.post("/update-status")
async def update_task_status(task_id: int, db: Session = Depends(get_db)):


    print(task_id)
    # 1️⃣ Fetch task by ID
    task = db.query(models.ProjectTasks).filter(
        models.ProjectTasks.task_id == task_id
    ).first()


    # 2️⃣ If task not found
    if not task:
        raise HTTPException(
            status_code=404,
            detail=f"Task with id {task_id} not found"
        )

    # 3️⃣ Update status
    task.status = "assigned"

    # 4️⃣ Commit changes
    db.commit()
    db.refresh(task)

    # 5️⃣ Response
    return {
        "message": "Task status updated successfully",
        "task_id": task.task_id,
        "new_status": task.status
    }

