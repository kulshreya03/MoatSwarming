from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.database import SessionLocal
import database.models as models
from sqlalchemy.orm import Session
from services.github_mcp_service import get_commit_counts
from typing import List
from collections import defaultdict
from pydantic import BaseModel
from agents.task_decompose import task_decompose
from agents.equity_distributer import equity_distributer
import json

router = APIRouter(prefix="/admin",tags=["Admin Dashboard Management"])

#Coonect to DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/dashboard")
async def get_admin_dashboard(db: Session = Depends(get_db)):

    # 1️⃣ Get all tasks
    tasks = db.query(models.ProjectTasks).all()

    # 2️⃣ Extract repos
    unique_repos = list({
        task.github_repo
        for task in tasks
        if task.github_repo
    })

    # 3️⃣ Get commit counts (MCP)
    commit_map = await get_commit_counts(unique_repos)

    # 4️⃣ Compute metrics
    totalTasks = len(tasks)

    completedTasks = len([
        t for t in tasks if t.status == "completed"
    ])

    activeTasks = len([
        t for t in tasks if t.status == "assigned"
    ])

    totalCommits = sum([
        commit_map.get(t.github_repo, 0)
        for t in tasks
    ])

    # 5️⃣ Productivity
    productivity = 0
    if totalTasks > 0:
        productivity = round((completedTasks / totalTasks) * 100)

    # 6️⃣ Total Projects (from Projects table)
    totalProjects = db.query(models.Project).count()

    return {
        "totalProjects": totalProjects,
        "totalTasks": totalTasks,
        "activeTasks": activeTasks,
        "completedTasks": completedTasks,
        "totalCommits": totalCommits,
        "productivity": productivity
    }

@router.get("/users-with-tasks")
async def get_users_with_tasks(db: Session = Depends(get_db)):

    users = db.query(models.Users).all()

    # Get all tasks
    tasks = db.query(models.ProjectTasks).all()

    # Map task_id → task
    task_map = {t.task_id: t for t in tasks}

    # Get assignments
    assignments = db.query(models.TaskAssignments).all()

    # Repo list for MCP
    repos = list({
        t.github_repo for t in tasks if t.github_repo
    })

    commit_map = await get_commit_counts(repos)

    result = []

    for user in users:

        user_tasks = []

        for a in assignments:
            if a.user_id == user.id:

                task = task_map.get(a.task_id)

                if task:
                    user_tasks.append({
                        "task_id": task.task_id,
                        "description": task.task_description,
                        "status": task.status,
                        "repo": task.github_repo,
                        "commits": commit_map.get(task.github_repo, 0)
                    })

        result.append({
            "user_id": user.id,
            "name": user.name,
            "email": user.email,
            "tasks": user_tasks
        })

    return result


class ProjectCreateRequest(BaseModel):
    project_name: str
    github_repo: str

@router.post("/create-project")
def create_project(request: ProjectCreateRequest, db: Session = Depends(get_db)):

    try:
        print("📌 Incoming Request:", request)

        # -----------------------------
        # 1️⃣ Create Project
        # -----------------------------
        new_project = models.Project(
            project_name=request.project_name
        )

        db.add(new_project)
        db.commit()
        db.refresh(new_project)

        print("✅ Project Created:", new_project.project_id)

        # -----------------------------
        # 2️⃣ Generate Tasks (AI)
        # -----------------------------
        tasks = task_decompose(request.project_name)

        if not tasks:
            raise Exception("Task generation failed")

        created_tasks = []

        # -----------------------------
        # 3️⃣ Insert Tasks Safely
        # -----------------------------
        for task in tasks:

            if not isinstance(task, dict):
                continue

            description = task.get("task_description")

            if not description:
                continue

            try:
                new_task = models.ProjectTasks(
                    project_id=new_project.project_id,
                    task_description=description,
                    github_repo=request.github_repo,
                    status="pending"
                )

                db.add(new_task)

                created_tasks.append({
                    "task_description": description,
                    "github_repo": request.github_repo,
                    "status": "pending"
                })

            except Exception as task_error:
                print("❌ TASK INSERT ERROR:", str(task_error))
                continue

        # -----------------------------
        # 4️⃣ Final Commit
        # -----------------------------
        db.commit()

        print("✅ Tasks Inserted:", created_tasks)

        # -----------------------------
        # 5️⃣ Response
        # -----------------------------
        return {
            "project_id": new_project.project_id,
            "project_name": new_project.project_name,
            "tasks": created_tasks
        }

    except Exception as e:
        db.rollback()
        print("🔥 FINAL ERROR:", str(e))
        raise HTTPException(status_code=500, detail=str(e))


class TaskUpdateRequest(BaseModel):
    task_id: int

#Complete task and calculate equity
@router.put("/update-task-status")
async def update_task_status(
    request: TaskUpdateRequest,
    db: Session = Depends(get_db)
):

    # 1️⃣ Fetch task
    task = db.query(models.ProjectTasks).filter(
        models.ProjectTasks.task_id == request.task_id
    ).first()

    if not task:
        raise HTTPException(
            status_code=404,
            detail=f"Task with id {request.task_id} not found"
        )

    # 2️⃣ Get assigned user BEFORE deletion
    assignment = db.query(models.TaskAssignments).filter(
        models.TaskAssignments.task_id == task.task_id
    ).first()

    if not assignment:
        raise HTTPException(
            status_code=400,
            detail="No user assigned to this task"
        )

    user_id = assignment.user_id

    # 3️⃣ Mark completed
    task.status = "completed"

    # 4️⃣ Move to completed table
    completed_task = models.TaskCompleted(
        task_id=task.task_id,
        project_id=task.project_id,
        task_description=task.task_description,
        github_repo=task.github_repo
    )
    db.add(completed_task)

    # 5️⃣ ✅ Add contribution entry (SLICING PIE UNIT)
    contribution = models.Contributions(
        user_id=user_id,
        project_id=task.project_id,
        task_id=task.task_id,
        contribution_units=1.0   # each task = 1 slice (can improve later)
    )
    db.add(contribution)

    # 6️⃣ Remove assignment
    db.query(models.TaskAssignments).filter(
        models.TaskAssignments.task_id == task.task_id
    ).delete()

    db.commit()

    # 7️⃣ ✅ Fetch all contributions for project
    contributions = db.query(models.Contributions).filter(
        models.Contributions.project_id == task.project_id
    ).all()

    contribution_data = [
        {
            "user_id": c.user_id,
            "units": c.contribution_units
        }
        for c in contributions
    ]

    # 8️⃣ 🤖 Call AI Agent
    equity_result = equity_distributer(contribution_data)

    # 9️⃣ Parse response
    equity_result = json.loads(equity_result)

    # 🔟 Update Equity Table
    for entry in equity_result:
        existing = db.query(models.Equity).filter(
            models.Equity.user_id == entry["user_id"],
            models.Equity.project_id == task.project_id
        ).first()

        if existing:
            existing.total_units = entry["total_units"]
            existing.equity_percentage = entry["equity"]
        else:
            new_equity = models.Equity(
                user_id=entry["user_id"],
                project_id=task.project_id,
                total_units=entry["total_units"],
                equity_percentage=entry["equity"]
            )
            db.add(new_equity)

    db.commit()

    return {
        "message": "Task completed + equity updated",
        "equity": equity_result
    }


@router.get("/completed-tasks")
async def get_completed_tasks(db: Session = Depends(get_db)):

    tasks = db.query(models.TaskCompleted).all()

    return [
        {
            "completed_id": t.completed_id,
            "task_id": t.task_id,
            "project_id": t.project_id,
            "task_description": t.task_description,
            "github_repo": t.github_repo,
            "completed_at": t.completed_at
        }
        for t in tasks
    ]

@router.get("/equity-distribution")
async def get_equity_distribution(db: Session = Depends(get_db)):
    """
    Equity distribution using Contributions table (Slicing Pie method)
    """

    projects = db.query(models.Project).all()
    response = []

    for project in projects:

        # 1️⃣ Get all contributions for this project
        contributions = db.query(models.Contributions).filter(
            models.Contributions.project_id == project.project_id
        ).all()

        if not contributions:
            continue

        # 2️⃣ Aggregate user units
        user_units = defaultdict(float)

        for c in contributions:
            user_units[c.user_id] += c.contribution_units

        total_units = sum(user_units.values())

        users_data = []

        # 3️⃣ Calculate equity %
        for user_id, units in user_units.items():

            user = db.query(models.Users).filter(
                models.Users.id == user_id
            ).first()

            equity_percentage = (
                (units / total_units) * 100
                if total_units > 0 else 0
            )

            users_data.append({
                "user_id": user_id,
                "name": user.name if user else "Unknown",
                "units": round(units, 2),
                "equity": round(equity_percentage, 2)
            })

        # 4️⃣ Save/update Equity table (optional but recommended)
        for user in users_data:

            existing = db.query(models.Equity).filter(
                models.Equity.user_id == user["user_id"],
                models.Equity.project_id == project.project_id
            ).first()

            if existing:
                existing.total_units = user["units"]
                existing.equity_percentage = user["equity"]
            else:
                new_equity = models.Equity(
                    user_id=user["user_id"],
                    project_id=project.project_id,
                    total_units=user["units"],
                    equity_percentage=user["equity"]
                )
                db.add(new_equity)

        db.commit()

        # 5️⃣ Append response
        response.append({
            "project_id": project.project_id,
            "project_name": project.project_name,
            "total_units": total_units,
            "users": users_data
        })

    return response