from database.database import Base
from sqlalchemy import UUID, Column, ForeignKey, Integer, String, DateTime, Float
from sqlalchemy.dialects.postgresql import JSON
from datetime import datetime

class Users(Base):
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)


class Project(Base):
    __tablename__ = 'projects'
    
    project_id = Column(Integer, primary_key=True, index=True)
    project_name = Column(String, index=True)
    
class ProjectTasks(Base):
    __tablename__ = 'project_tasks'
    
    task_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    project_id = Column(Integer, ForeignKey('projects.project_id'))
    task_description = Column(String)
    github_repo = Column(String)
    status = Column(String, default="pending")

class UserSkills(Base):
    __tablename__ = "user_skills"

    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    skills = Column(JSON)
    updated_at = Column(DateTime, default=datetime.utcnow)

class Admin(Base):
    __tablename__ = "admin"

    admin_id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)

    project_id = Column(Integer, ForeignKey("projects.project_id"))

class TaskAssignments(Base):
    __tablename__ = 'task_assignments'
    
    assignment_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    task_id = Column(Integer, ForeignKey('project_tasks.task_id'))
    user_id = Column(Integer, ForeignKey('users.id'))

class TaskCompleted(Base):
    __tablename__ = "task_completed"

    completed_id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer)
    project_id = Column(Integer)
    task_description = Column(String)
    github_repo = Column(String)
    completed_at = Column(DateTime, default=datetime.utcnow)

class Contributions(Base):
    __tablename__ = "contributions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    project_id = Column(Integer, ForeignKey("projects.project_id"))
    task_id = Column(Integer, ForeignKey("project_tasks.task_id"))

    contribution_units = Column(Float, default=1.0)  # slicing pie units
    created_at = Column(DateTime, default=datetime.utcnow)

class Equity(Base):
    __tablename__ = "equity"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    project_id = Column(Integer, ForeignKey("projects.project_id"))

    total_units = Column(Float)
    equity_percentage = Column(Float)

    updated_at = Column(DateTime, default=datetime.utcnow)
'''
class UserSkills(Base):
    __tablename__ = 'user_skills'
    
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id'), primary_key=True)
    skills = Column(String)


class Project(Base):
    __tablename__ = 'projects'
    
    project_id = Column(Integer, primary_key=True, index=True)
    project_name = Column(String, index=True)
    
class ProjectTasks(Base):
    __tablename__ = 'project_tasks'
    
    task_id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey('projects.project_id'))
    task_description = Column(String)
    github_repo = Column(String)
    status = Column(String, default="pending")

class TaskAssignments(Base):
    __tablename__ = 'task_assignments'
    
    assignment_id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer, ForeignKey('project_tasks.task_id'))
    user_id = Column(Integer, ForeignKey('users.id'))


'''