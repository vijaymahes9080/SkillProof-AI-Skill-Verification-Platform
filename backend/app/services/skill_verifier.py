"""
AI Skill Verifier Service
Computes skill confidence score from multiple evidence sources.
"""
from typing import Optional
from app.db import models
from sqlalchemy.orm import Session
from datetime import datetime, timedelta


def compute_skill_confidence(student_skill: models.StudentSkill) -> float:
    """
    Skill Confidence = weighted average of evidence sources.
    Assessment  30%
    Projects    25%
    GitHub      20%
    Interview   15%
    Recency     10%
    """
    weights = {
        "assessment": 0.30,
        "projects":   0.25,
        "github":     0.20,
        "interview":  0.15,
        "recency":    0.10,
    }

    scores = {
        "assessment": student_skill.assessment_score or 0,
        "projects":   student_skill.project_score or 0,
        "github":     student_skill.github_score or 0,
        "interview":  student_skill.interview_score or 0,
        "recency":    student_skill.recency_score or 0,
    }

    # Only include dimensions that have data
    active = {k: v for k, v in scores.items() if v > 0}
    if not active:
        return 0.0

    # Redistribute weights for missing dimensions
    total_weight = sum(weights[k] for k in active)
    if total_weight == 0:
        return 0.0

    weighted_sum = sum(scores[k] * weights[k] for k in active)
    return round(weighted_sum / total_weight, 1)


def compute_evidence_strength(student_skill: models.StudentSkill) -> models.EvidenceStrength:
    """Determine evidence strength based on how many sources have data."""
    score = student_skill.confidence_score
    sources_with_data = sum([
        1 if student_skill.assessment_score else 0,
        1 if student_skill.github_score else 0,
        1 if student_skill.project_score else 0,
        1 if student_skill.interview_score else 0,
    ])

    if sources_with_data >= 3 and score >= 75:
        return models.EvidenceStrength.high
    elif sources_with_data >= 2 and score >= 55:
        return models.EvidenceStrength.medium
    else:
        return models.EvidenceStrength.low


def compute_recency_score(student_skill: models.StudentSkill, last_activity_days: int) -> float:
    """Score based on how recent the skill activity is."""
    if last_activity_days <= 30:
        return 95.0
    elif last_activity_days <= 90:
        return 85.0
    elif last_activity_days <= 180:
        return 70.0
    elif last_activity_days <= 365:
        return 55.0
    else:
        return 30.0


def compute_github_score(repos: list, skill_name: str) -> float:
    """Score based on GitHub evidence for a specific skill."""
    relevant_repos = [r for r in repos if
                      (r.primary_language or "").lower() == skill_name.lower() or
                      skill_name.lower() in str(r.languages or {}).lower()]

    if not relevant_repos:
        return 0.0

    total_score = 0.0
    for repo in relevant_repos:
        repo_score = 50.0
        if repo.has_tests:
            repo_score += 15
        if repo.has_documentation:
            repo_score += 10
        if repo.has_ci_cd:
            repo_score += 10
        if repo.commit_count > 50:
            repo_score += 10
        if repo.stars > 10:
            repo_score += 5
        total_score += min(repo_score, 100)

    return round(min(total_score / len(relevant_repos), 100), 1)


def compute_project_score(projects: list, skill_name: str) -> float:
    """Score based on project evidence for a specific skill."""
    relevant = [p for p in projects if skill_name.lower() in [t.lower() for t in (p.technologies or [])]]
    if not relevant:
        return 0.0
    avg = sum(p.overall_score or 0 for p in relevant) / len(relevant)
    return round(avg, 1)


def update_student_skill(
    student_skill: models.StudentSkill,
    repos: list,
    projects: list,
    db: Session
) -> models.StudentSkill:
    """Recompute all skill scores and update in DB."""
    skill_name = student_skill.skill.name if student_skill.skill else ""

    # Update component scores
    github_sc = compute_github_score(repos, skill_name)
    project_sc = compute_project_score(projects, skill_name)

    if github_sc > 0:
        student_skill.github_score = github_sc
    if project_sc > 0:
        student_skill.project_score = project_sc

    # Recalculate confidence
    student_skill.confidence_score = compute_skill_confidence(student_skill)
    student_skill.evidence_strength = compute_evidence_strength(student_skill)

    if student_skill.confidence_score >= 60:
        student_skill.verification_status = models.VerificationStatus.verified
        student_skill.last_verified_at = datetime.utcnow()

    db.commit()
    db.refresh(student_skill)
    return student_skill


def compute_skillproof_score(student_id: str, db: Session) -> float:
    """Compute overall SkillProof score for a student."""
    skills = db.query(models.StudentSkill).filter(
        models.StudentSkill.student_id == student_id,
        models.StudentSkill.confidence_score > 0
    ).all()

    if not skills:
        return 0.0

    avg = sum(s.confidence_score for s in skills) / len(skills)
    return round(min(avg, 100), 1)
