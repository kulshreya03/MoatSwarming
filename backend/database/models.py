from database.database import Base
from sqlalchemy import UUID, Column, ForeignKey, Integer, String

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
    
    task_id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey('projects.project_id'))
    task_description = Column(String)
    github_repo = Column(String)
    status = Column(String, default="pending")


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