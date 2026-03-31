from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.database import SessionLocal
import database.models as models
from sqlalchemy.orm import Session
from services.github_mcp_service import get_commit_counts
from typing import List
from collections import defaultdict

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

    # 6️⃣ Total Projects (from Admin table)
    totalProjects = db.query(models.Admin).count()

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