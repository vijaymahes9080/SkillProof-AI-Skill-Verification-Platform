from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db import models
from app.core.security import get_current_active_user

router = APIRouter()

@router.get("/college")
async def college_analytics(current_user: models.User = Depends(get_current_active_user), db: Session = Depends(get_db)):
    students = db.query(models.StudentProfile).count()
    verified = db.query(models.StudentProfile).filter(models.StudentProfile.skillproof_score > 0).count()
    assessments = db.query(models.AssessmentAttempt).filter(models.AssessmentAttempt.status == models.AssessmentStatus.completed).count()
    industry_ready = db.query(models.StudentProfile).filter(models.StudentProfile.skillproof_score >= 70).count()

    # Top skills
    all_skills = db.query(models.StudentSkill).all()
    skill_counts: dict = {}
    for ss in all_skills:
        if ss.skill:
            skill_counts[ss.skill.name] = skill_counts.get(ss.skill.name, 0) + 1
    top_skills = sorted([{"skill": k, "count": v} for k, v in skill_counts.items()], key=lambda x: -x["count"])[:6]

    return {
        "total_students": students,
        "verified_profiles": verified,
        "assessments_completed": assessments,
        "industry_ready": industry_ready,
        "top_skills": top_skills,
    }

@router.get("/dashboard")
async def global_stats(db: Session = Depends(get_db)):
    return {
        "total_students": db.query(models.StudentProfile).count(),
        "total_skills_verified": db.query(models.StudentSkill).filter(
            models.StudentSkill.verification_status == models.VerificationStatus.verified
        ).count(),
        "total_assessments": db.query(models.AssessmentAttempt).filter(
            models.AssessmentAttempt.status == models.AssessmentStatus.completed
        ).count(),
        "total_projects": db.query(models.Project).filter(models.Project.analysis_status == "completed").count(),
    }
