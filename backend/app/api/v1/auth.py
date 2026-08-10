from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
import httpx

from app.db.session import get_db
from app.db import models
from app.schemas import UserCreate, UserLogin, Token, GitHubOAuthRequest
from app.core.security import get_password_hash, verify_password, create_access_token
from app.core.config import settings

router = APIRouter()


@router.post("/register", response_model=Token, status_code=201)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """Register a new user (student / college / company)."""
    existing = db.query(models.User).filter(models.User.email == user_data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = models.User(
        email=user_data.email,
        hashed_password=get_password_hash(user_data.password),
        full_name=user_data.full_name,
        role=user_data.role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Auto-create student profile
    if user_data.role == models.UserRole.student:
        username = user_data.email.split("@")[0].lower().replace(".", "_")
        profile = models.StudentProfile(user_id=user.id, username=username)
        db.add(profile)
        db.commit()

    access_token = create_access_token({"sub": user.id})
    return Token(access_token=access_token, user_id=user.id, role=user.role.value, full_name=user.full_name)


@router.post("/login", response_model=Token)
async def login(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """Login with email + password."""
    user = db.query(models.User).filter(models.User.email == form.username).first()
    if not user or not verify_password(form.password, user.hashed_password or ""):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Account is inactive")

    access_token = create_access_token({"sub": user.id})
    return Token(access_token=access_token, user_id=user.id, role=user.role.value, full_name=user.full_name)


@router.post("/github", response_model=Token)
async def github_oauth(req: GitHubOAuthRequest, db: Session = Depends(get_db)):
    """Exchange GitHub OAuth code for SkillProof access token."""
    # Exchange code for GitHub access token
    async with httpx.AsyncClient() as client:
        token_resp = await client.post(
            "https://github.com/login/oauth/access_token",
            data={
                "client_id": settings.GITHUB_CLIENT_ID,
                "client_secret": settings.GITHUB_CLIENT_SECRET,
                "code": req.code,
            },
            headers={"Accept": "application/json"},
        )
    token_data = token_resp.json()
    github_token = token_data.get("access_token")
    if not github_token:
        raise HTTPException(status_code=400, detail="Failed to get GitHub token")

    # Get GitHub user info
    async with httpx.AsyncClient() as client:
        user_resp = await client.get(
            "https://api.github.com/user",
            headers={"Authorization": f"Bearer {github_token}"},
        )
    gh_user = user_resp.json()

    # Get primary email
    async with httpx.AsyncClient() as client:
        email_resp = await client.get(
            "https://api.github.com/user/emails",
            headers={"Authorization": f"Bearer {github_token}"},
        )
    emails = email_resp.json()
    primary_email = next((e["email"] for e in emails if e.get("primary")), gh_user.get("email", f"{gh_user['login']}@github.com"))

    # Find or create user
    user = db.query(models.User).filter(models.User.github_id == str(gh_user["id"])).first()
    if not user:
        user = db.query(models.User).filter(models.User.email == primary_email).first()
    if not user:
        user = models.User(
            email=primary_email,
            full_name=gh_user.get("name") or gh_user["login"],
            github_id=str(gh_user["id"]),
            github_username=gh_user["login"],
            github_access_token=github_token,
            avatar_url=gh_user.get("avatar_url"),
            role=models.UserRole.student,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        # Create student profile
        profile = models.StudentProfile(user_id=user.id, username=gh_user["login"], github_connected=True)
        db.add(profile)
        db.commit()
    else:
        user.github_id = str(gh_user["id"])
        user.github_username = gh_user["login"]
        user.github_access_token = github_token
        user.avatar_url = gh_user.get("avatar_url")
        db.commit()

    access_token = create_access_token({"sub": user.id})
    return Token(access_token=access_token, user_id=user.id, role=user.role.value, full_name=user.full_name)


@router.get("/me")
async def get_me(db: Session = Depends(get_db), token: str = ""):
    """Get current authenticated user info."""
    return {"message": "Use /api/users/me with Bearer token"}
