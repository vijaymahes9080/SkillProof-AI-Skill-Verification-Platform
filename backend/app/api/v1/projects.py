from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.db.session import get_db
from app.db import models
from app.schemas import ProjectCreate, ProjectOut
from app.core.security import get_current_active_user
from app.services.project_analyzer import analyze_project

router = APIRouter()

@router.get("/", response_model=List[ProjectOut])
async def list_projects(current_user: models.User = Depends(get_current_active_user), db: Session = Depends(get_db)):
    profile = db.query(models.StudentProfile).filter(models.StudentProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return db.query(models.Project).filter(models.Project.student_id == profile.id).all()

@router.post("/", response_model=ProjectOut, status_code=201)
async def create_project(
    data: ProjectCreate,
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    profile = db.query(models.StudentProfile).filter(models.StudentProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    project = models.Project(student_id=profile.id, **data.dict())
    db.add(project)
    db.commit()
    db.refresh(project)
    return project

@router.post("/{project_id}/analyze", response_model=ProjectOut)
async def run_analysis(
    project_id: str,
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    project.analysis_status = "analyzing"
    db.commit()

    result = await analyze_project(project, current_user.github_access_token)

    project.overall_score = result.get("overall_score")
    project.architecture_score = result.get("architecture_score")
    project.code_quality_score = result.get("code_quality_score")
    project.database_design_score = result.get("database_design_score")
    project.api_design_score = result.get("api_design_score")
    project.testing_score = result.get("testing_score")
    project.documentation_score = result.get("documentation_score")
    project.security_score = result.get("security_score")
    project.scalability_score = result.get("scalability_score")
    project.analysis_data = result
    project.analysis_status = "completed"
    project.analyzed_at = datetime.utcnow()
    db.commit()
    db.refresh(project)
    return project

@router.get("/{project_id}", response_model=ProjectOut)
async def get_project(project_id: str, db: Session = Depends(get_db)):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.delete("/{project_id}", status_code=204)
async def delete_project(project_id: str, current_user: models.User = Depends(get_current_active_user), db: Session = Depends(get_db)):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    db.delete(project)
    db.commit()
