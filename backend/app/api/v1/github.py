from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import httpx
from datetime import datetime

from app.db.session import get_db
from app.db import models
from app.schemas import RepositoryOut
from app.core.security import get_current_active_user
from app.services.github_analyzer import analyze_repository

router = APIRouter()

@router.post("/connect")
async def connect_github(
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Trigger GitHub repository import for the current student."""
    if not current_user.github_access_token:
        raise HTTPException(status_code=400, detail="GitHub not connected. Use /api/auth/github first.")

    profile = db.query(models.StudentProfile).filter(models.StudentProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Student profile not found")

    # Fetch repos from GitHub API
    async with httpx.AsyncClient() as client:
        repos_resp = await client.get(
            "https://api.github.com/user/repos",
            headers={"Authorization": f"Bearer {current_user.github_access_token}"},
            params={"per_page": 50, "sort": "updated"},
        )
    if repos_resp.status_code != 200:
        raise HTTPException(status_code=400, detail="Failed to fetch GitHub repositories")

    gh_repos = repos_resp.json()
    imported = 0

    for gh_repo in gh_repos:
        existing = db.query(models.Repository).filter(
            models.Repository.student_id == profile.id,
            models.Repository.github_repo_id == str(gh_repo["id"])
        ).first()
        if existing:
            continue

        repo = models.Repository(
            student_id=profile.id,
            github_repo_id=str(gh_repo["id"]),
            name=gh_repo["name"],
            full_name=gh_repo["full_name"],
            description=gh_repo.get("description"),
            url=gh_repo["html_url"],
            primary_language=gh_repo.get("language"),
            stars=gh_repo.get("stargazers_count", 0),
            forks=gh_repo.get("forks_count", 0),
            last_commit_at=datetime.fromisoformat(gh_repo["updated_at"].replace("Z", "+00:00")) if gh_repo.get("updated_at") else None,
        )
        db.add(repo)
        imported += 1

    profile.github_connected = True
    db.commit()

    return {"message": f"Imported {imported} new repositories", "total_repos": len(gh_repos)}


@router.get("/repositories", response_model=List[RepositoryOut])
async def get_my_repositories(
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    profile = db.query(models.StudentProfile).filter(models.StudentProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Student profile not found")
    repos = db.query(models.Repository).filter(models.Repository.student_id == profile.id).all()
    return repos


@router.post("/repositories/{repo_id}/analyze")
async def analyze_repo(
    repo_id: str,
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Run AI analysis on a repository."""
    repo = db.query(models.Repository).filter(models.Repository.id == repo_id).first()
    if not repo:
        raise HTTPException(status_code=404, detail="Repository not found")

    result = await analyze_repository(repo, current_user.github_access_token)
    repo.analysis_score = result.get("overall_score")
    repo.analysis_data = result
    repo.has_tests = result.get("has_tests", False)
    repo.has_documentation = result.get("has_documentation", False)
    repo.has_ci_cd = result.get("has_ci_cd", False)
    repo.commit_count = result.get("commit_count", 0)
    repo.lines_of_code = result.get("lines_of_code", 0)
    repo.languages = result.get("languages", {})
    repo.analyzed_at = datetime.utcnow()
    db.commit()
    db.refresh(repo)

    return {"message": "Analysis complete", "repo_id": repo_id, "score": repo.analysis_score, "data": result}
