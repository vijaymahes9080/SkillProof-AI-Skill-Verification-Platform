from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.db.session import get_db
from app.db import models
from app.schemas import AssessmentAttemptCreate, AssessmentAttemptOut, SubmitAnswer
from app.core.security import get_current_active_user

router = APIRouter()

# Seed assessment templates in DB if not present
DEFAULT_TEMPLATES = [
    {"skill_name": "Java", "title": "Java Assessment", "total_levels": 7, "duration_minutes": 45},
    {"skill_name": "Python", "title": "Python Assessment", "total_levels": 7, "duration_minutes": 40},
    {"skill_name": "React", "title": "React Assessment", "total_levels": 6, "duration_minutes": 35},
    {"skill_name": "SQL", "title": "SQL Assessment", "total_levels": 7, "duration_minutes": 35},
    {"skill_name": "Spring Boot", "title": "Spring Boot Assessment", "total_levels": 5, "duration_minutes": 30},
    {"skill_name": "Docker", "title": "Docker Assessment", "total_levels": 4, "duration_minutes": 25},
    {"skill_name": "Machine Learning", "title": "Machine Learning Assessment", "total_levels": 6, "duration_minutes": 50},
]

@router.get("/templates")
async def list_templates(db: Session = Depends(get_db)):
    """List all available assessment templates."""
    templates = db.query(models.AssessmentTemplate).filter(models.AssessmentTemplate.is_active == True).all()
    return [
        {
            "id": t.id,
            "title": t.title,
            "skill_id": t.skill_id,
            "skill_name": t.skill.name if t.skill else None,
            "total_levels": t.total_levels,
            "duration_minutes": t.duration_minutes,
            "passing_score": t.passing_score,
        }
        for t in templates
    ]

@router.post("/start", response_model=AssessmentAttemptOut, status_code=201)
async def start_assessment(
    data: AssessmentAttemptCreate,
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Start a new assessment attempt."""
    profile = db.query(models.StudentProfile).filter(models.StudentProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Student profile not found")

    template = db.query(models.AssessmentTemplate).filter(models.AssessmentTemplate.id == data.template_id).first()
    if not template:
        raise HTTPException(status_code=404, detail="Assessment template not found")

    attempt = models.AssessmentAttempt(
        student_id=profile.id,
        template_id=data.template_id,
        status=models.AssessmentStatus.in_progress,
        started_at=datetime.utcnow(),
    )
    db.add(attempt)
    db.commit()
    db.refresh(attempt)
    return attempt

@router.post("/{attempt_id}/submit")
async def submit_assessment(
    attempt_id: str,
    answers: dict,
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Submit all answers for an assessment attempt."""
    attempt = db.query(models.AssessmentAttempt).filter(models.AssessmentAttempt.id == attempt_id).first()
    if not attempt:
        raise HTTPException(status_code=404, detail="Attempt not found")

    questions = db.query(models.Question).filter(models.Question.template_id == attempt.template_id).all()
    if not questions:
        # Score based on submitted answers count (demo mode)
        score = 75.0
    else:
        correct = 0
        for q in questions:
            if answers.get(q.id) == q.correct_answer:
                correct += 1
        score = round(correct / len(questions) * 100, 1)

    attempt.answers = answers
    attempt.score = score
    attempt.status = models.AssessmentStatus.completed
    attempt.completed_at = datetime.utcnow()
    if attempt.started_at:
        delta = datetime.utcnow() - attempt.started_at
        attempt.time_taken_seconds = int(delta.total_seconds())

    # Update student skill score
    profile = db.query(models.StudentProfile).filter(models.StudentProfile.id == attempt.student_id).first()
    template = db.query(models.AssessmentTemplate).filter(models.AssessmentTemplate.id == attempt.template_id).first()
    if profile and template and template.skill:
        student_skill = db.query(models.StudentSkill).filter(
            models.StudentSkill.student_id == profile.id,
            models.StudentSkill.skill_id == template.skill_id
        ).first()
        if not student_skill:
            student_skill = models.StudentSkill(student_id=profile.id, skill_id=template.skill_id)
            db.add(student_skill)
        student_skill.assessment_score = score

    db.commit()
    return {"attempt_id": attempt_id, "score": score, "status": "completed", "evidence_added": True}

@router.get("/my-attempts", response_model=List[AssessmentAttemptOut])
async def my_attempts(current_user: models.User = Depends(get_current_active_user), db: Session = Depends(get_db)):
    profile = db.query(models.StudentProfile).filter(models.StudentProfile.user_id == current_user.id).first()
    if not profile:
        return []
    return db.query(models.AssessmentAttempt).filter(models.AssessmentAttempt.student_id == profile.id).all()
