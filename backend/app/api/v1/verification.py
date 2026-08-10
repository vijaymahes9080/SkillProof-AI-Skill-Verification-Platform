from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db import models
from app.schemas import VerificationOut

router = APIRouter()

@router.get("/{verification_id}", response_model=VerificationOut)
async def verify_certificate(verification_id: str, db: Session = Depends(get_db)):
    """Public endpoint to verify a SkillProof certificate by verification ID."""
    cert = db.query(models.Certification).filter(models.Certification.verification_id == verification_id).first()
    if not cert:
        # Also check student profile verification_id
        profile = db.query(models.StudentProfile).filter(models.StudentProfile.verification_id == verification_id).first()
        if not profile:
            raise HTTPException(status_code=404, detail="Verification ID not found")
        skills = db.query(models.StudentSkill).filter(
            models.StudentSkill.student_id == profile.id,
            models.StudentSkill.verification_status == models.VerificationStatus.verified
        ).all()
        return VerificationOut(
            verification_id=verification_id,
            student_name=profile.user.full_name if profile.user else "Unknown",
            college=profile.college,
            skills_verified=[s.skill.name for s in skills if s.skill],
            overall_score=profile.skillproof_score,
            issued_at=profile.created_at,
            is_valid=True,
        )

    profile = cert.student
    return VerificationOut(
        verification_id=cert.verification_id,
        student_name=profile.user.full_name if profile and profile.user else "Unknown",
        college=profile.college if profile else None,
        skills_verified=cert.skills_verified or [],
        overall_score=cert.overall_score or 0,
        issued_at=cert.issued_at,
        is_valid=cert.is_valid,
    )
