from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.db import models
from app.schemas import JobCreate, JobOut
from app.core.security import get_current_active_user

router = APIRouter()

@router.get("/", response_model=List[JobOut])
async def list_jobs(db: Session = Depends(get_db)):
    jobs = db.query(models.Job).filter(models.Job.is_active == True).all()
    return [{
        "id": j.id, "title": j.title, "description": j.description,
        "required_skills": j.required_skills, "preferred_skills": j.preferred_skills,
        "experience_level": j.experience_level, "location": j.location,
        "remote": j.remote, "salary_range": j.salary_range,
        "company_name": j.company.name if j.company else None,
    } for j in jobs]

@router.post("/match")
async def match_jobs(
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Match student's verified skills against active job requirements."""
    profile = db.query(models.StudentProfile).filter(models.StudentProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    student_skills = {
        ss.skill.name.lower(): ss.confidence_score
        for ss in db.query(models.StudentSkill).filter(models.StudentSkill.student_id == profile.id).all()
        if ss.skill
    }
    jobs = db.query(models.Job).filter(models.Job.is_active == True).all()
    matches = []

    for job in jobs:
        required = job.required_skills or []
        if not required:
            continue

        match_scores = []
        for req in required:
            skill_name = req.get("skill", "").lower()
            min_score = req.get("min_score", 70)
            student_score = student_skills.get(skill_name, 0)
            match_scores.append({"skill": req["skill"], "required": min_score, "student": student_score, "met": student_score >= min_score})

        met_count = sum(1 for m in match_scores if m["met"])
        match_pct = round(met_count / len(match_scores) * 100)

        matches.append({
            "job_id": job.id,
            "title": job.title,
            "company": job.company.name if job.company else None,
            "match_percentage": match_pct,
            "skill_breakdown": match_scores,
        })

    return sorted(matches, key=lambda x: -x["match_percentage"])
