from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.api.v1 import auth, users, students, skills, github, repositories, projects, assessments, interviews, evidence, verification, colleges, companies, jobs, analytics
from app.core.config import settings
from app.db.session import engine
from app.db import models

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create all tables on startup
    models.Base.metadata.create_all(bind=engine)
    yield

app = FastAPI(
    title="SkillProof API",
    description="AI-Powered Skill Verification Platform — Evidence-backed skill profiles for students and employers",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(students.router, prefix="/api/students", tags=["Students"])
app.include_router(skills.router, prefix="/api/skills", tags=["Skills"])
app.include_router(github.router, prefix="/api/github", tags=["GitHub"])
app.include_router(repositories.router, prefix="/api/repositories", tags=["Repositories"])
app.include_router(projects.router, prefix="/api/projects", tags=["Projects"])
app.include_router(assessments.router, prefix="/api/assessments", tags=["Assessments"])
app.include_router(interviews.router, prefix="/api/interviews", tags=["Interviews"])
app.include_router(evidence.router, prefix="/api/evidence", tags=["Evidence"])
app.include_router(verification.router, prefix="/api/verification", tags=["Verification"])
app.include_router(colleges.router, prefix="/api/colleges", tags=["Colleges"])
app.include_router(companies.router, prefix="/api/companies", tags=["Companies"])
app.include_router(jobs.router, prefix="/api/jobs", tags=["Jobs"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])

@app.get("/", tags=["Health"])
async def root():
    return {"message": "SkillProof API v1.0.0", "status": "running", "docs": "/api/docs"}

@app.get("/api/health", tags=["Health"])
async def health():
    return {"status": "healthy", "service": "skillproof-api"}
