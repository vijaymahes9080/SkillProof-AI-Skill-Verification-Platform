from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.db import models
from app.schemas import StudentProfileOut, StudentProfileCreate, StudentSkillOut
from app.core.security import get_current_active_user

router = APIRouter()

@router.get("/me", response_model=StudentProfileOut)
async def get_my_profile(current_user: models.User = Depends(get_current_active_user), db: Session = Depends(get_db)):
    profile = db.query(models.StudentProfile).filter(models.StudentProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Student profile not found")
    return profile

@router.get("/{student_id}", response_model=StudentProfileOut)
async def get_student(student_id: str, db: Session = Depends(get_db)):
    profile = db.query(models.StudentProfile).filter(models.StudentProfile.id == student_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Student not found")
    return profile

@router.get("/username/{username}", response_model=StudentProfileOut)
async def get_student_by_username(username: str, db: Session = Depends(get_db)):
    profile = db.query(models.StudentProfile).filter(models.StudentProfile.username == username).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Student not found")
    if not profile.is_public:
        raise HTTPException(status_code=403, detail="Profile is private")
    return profile

@router.put("/me", response_model=StudentProfileOut)
async def update_my_profile(
    data: StudentProfileCreate,
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    profile = db.query(models.StudentProfile).filter(models.StudentProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Student profile not found")
    for field, value in data.dict(exclude_unset=True).items():
        setattr(profile, field, value)
    db.commit()
    db.refresh(profile)
    return profile

@router.get("/{student_id}/skills", response_model=List[StudentSkillOut])
async def get_student_skills(student_id: str, db: Session = Depends(get_db)):
    skills = db.query(models.StudentSkill).filter(models.StudentSkill.student_id == student_id).all()
    result = []
    for s in skills:
        skill_name = s.skill.name if s.skill else None
        result.append(StudentSkillOut(
            id=s.id, skill_id=s.skill_id, skill_name=skill_name,
            claimed_level=s.claimed_level, confidence_score=s.confidence_score,
            evidence_strength=s.evidence_strength.value, verification_status=s.verification_status.value,
            assessment_score=s.assessment_score, github_score=s.github_score,
            project_score=s.project_score, interview_score=s.interview_score,
            recency_score=s.recency_score, github_repos_count=s.github_repos_count,
            github_loc=s.github_loc, last_verified_at=s.last_verified_at,
        ))
    return result

@router.get("/{student_id}/evidence")
async def get_student_evidence(student_id: str, db: Session = Depends(get_db)):
    """Aggregated evidence summary for a student."""
    profile = db.query(models.StudentProfile).filter(models.StudentProfile.id == student_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Student not found")
    skills = db.query(models.StudentSkill).filter(models.StudentSkill.student_id == student_id).all()
    repos = db.query(models.Repository).filter(models.Repository.student_id == student_id).all()
    projects = db.query(models.Project).filter(models.Project.student_id == student_id).all()
    attempts = db.query(models.AssessmentAttempt).filter(
        models.AssessmentAttempt.student_id == student_id,
        models.AssessmentAttempt.status == models.AssessmentStatus.completed
    ).all()
    return {
        "student_id": student_id,
        "skillproof_score": profile.skillproof_score,
        "total_skills": len(skills),
        "verified_skills": sum(1 for s in skills if s.verification_status == models.VerificationStatus.verified),
        "total_repositories": len(repos),
        "total_projects": len(projects),
        "total_assessments": len(attempts),
        "github_evidence_count": profile.github_evidence_count,
    }
