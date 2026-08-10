from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db import models
from app.core.security import get_current_active_user

router = APIRouter()

@router.get("/")
async def list_skills(db: Session = Depends(get_db)):
    skills = db.query(models.Skill).all()
    return [{"id": s.id, "name": s.name, "category": s.category} for s in skills]

@router.get("/my")
async def my_skills(current_user: models.User = Depends(get_current_active_user), db: Session = Depends(get_db)):
    profile = db.query(models.StudentProfile).filter(models.StudentProfile.user_id == current_user.id).first()
    if not profile:
        return []
    skills = db.query(models.StudentSkill).filter(models.StudentSkill.student_id == profile.id).all()
    return [{
        "id": s.id, "skill_name": s.skill.name if s.skill else None,
        "confidence_score": s.confidence_score, "evidence_strength": s.evidence_strength.value,
        "verified": s.verification_status == models.VerificationStatus.verified,
        "assessment_score": s.assessment_score, "github_score": s.github_score,
        "project_score": s.project_score, "interview_score": s.interview_score,
        "github_repos_count": s.github_repos_count, "github_loc": s.github_loc,
    } for s in skills]
