from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from app.db.models import UserRole

# ── Auth ──────────────────────────────────────────────────

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: UserRole = UserRole.student

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    role: str
    full_name: str

class GitHubOAuthRequest(BaseModel):
    code: str

# ── User ─────────────────────────────────────────────────

class UserOut(BaseModel):
    id: str
    email: str
    full_name: str
    role: str
    github_username: Optional[str]
    avatar_url: Optional[str]
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

# ── Student ───────────────────────────────────────────────

class StudentProfileCreate(BaseModel):
    username: str
    bio: Optional[str] = None
    college: Optional[str] = None
    degree: Optional[str] = None
    graduation_year: Optional[int] = None
    location: Optional[str] = None

class StudentProfileOut(BaseModel):
    id: str
    user_id: str
    username: str
    bio: Optional[str]
    college: Optional[str]
    degree: Optional[str]
    skillproof_score: float
    verification_id: str
    github_connected: bool
    github_evidence_count: int
    is_public: bool
    created_at: datetime

    class Config:
        from_attributes = True

# ── Skills ────────────────────────────────────────────────

class SkillCreate(BaseModel):
    name: str
    category: Optional[str] = None
    description: Optional[str] = None

class SkillOut(BaseModel):
    id: str
    name: str
    category: Optional[str]
    description: Optional[str]

    class Config:
        from_attributes = True

class StudentSkillOut(BaseModel):
    id: str
    skill_id: str
    skill_name: Optional[str]
    claimed_level: Optional[str]
    confidence_score: float
    evidence_strength: str
    verification_status: str
    assessment_score: Optional[float]
    github_score: Optional[float]
    project_score: Optional[float]
    interview_score: Optional[float]
    recency_score: Optional[float]
    github_repos_count: int
    github_loc: int
    last_verified_at: Optional[datetime]

    class Config:
        from_attributes = True

# ── GitHub ────────────────────────────────────────────────

class GitHubConnectRequest(BaseModel):
    access_token: str  # GitHub OAuth token

class RepositoryOut(BaseModel):
    id: str
    name: str
    full_name: Optional[str]
    description: Optional[str]
    primary_language: Optional[str]
    languages: Optional[dict]
    stars: int
    forks: int
    commit_count: int
    lines_of_code: int
    has_tests: bool
    has_documentation: bool
    has_ci_cd: bool
    analysis_score: Optional[float]
    last_commit_at: Optional[datetime]

    class Config:
        from_attributes = True

# ── Projects ─────────────────────────────────────────────

class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None
    github_url: Optional[str] = None
    demo_url: Optional[str] = None
    technologies: Optional[list] = None

class ProjectOut(BaseModel):
    id: str
    name: str
    description: Optional[str]
    github_url: Optional[str]
    technologies: Optional[list]
    overall_score: Optional[float]
    architecture_score: Optional[float]
    code_quality_score: Optional[float]
    database_design_score: Optional[float]
    api_design_score: Optional[float]
    testing_score: Optional[float]
    documentation_score: Optional[float]
    security_score: Optional[float]
    scalability_score: Optional[float]
    analysis_status: str
    analyzed_at: Optional[datetime]

    class Config:
        from_attributes = True

# ── Assessments ───────────────────────────────────────────

class AssessmentAttemptCreate(BaseModel):
    template_id: str

class SubmitAnswer(BaseModel):
    question_id: str
    answer: str

class AssessmentAttemptOut(BaseModel):
    id: str
    template_id: str
    status: str
    score: Optional[float]
    max_level_reached: int
    time_taken_seconds: Optional[int]
    started_at: Optional[datetime]
    completed_at: Optional[datetime]

    class Config:
        from_attributes = True

# ── Interview ─────────────────────────────────────────────

class InterviewStart(BaseModel):
    skill_focus: str
    difficulty: str = "Mid-level"

class InterviewMessage(BaseModel):
    content: str

class InterviewSessionOut(BaseModel):
    id: str
    skill_focus: str
    difficulty: str
    overall_score: Optional[float]
    technical_correctness: Optional[float]
    conceptual_understanding: Optional[float]
    communication_score: Optional[float]
    depth_score: Optional[float]
    practical_reasoning: Optional[float]
    started_at: datetime
    completed_at: Optional[datetime]

    class Config:
        from_attributes = True

# ── Verification ─────────────────────────────────────────

class VerificationOut(BaseModel):
    verification_id: str
    student_name: str
    college: Optional[str]
    skills_verified: list
    overall_score: float
    issued_at: datetime
    is_valid: bool

# ── Analytics ────────────────────────────────────────────

class CollegeAnalytics(BaseModel):
    total_students: int
    verified_profiles: int
    assessments_completed: int
    industry_ready: int
    top_skills: list
    skill_gaps: list

# ── Jobs ─────────────────────────────────────────────────

class JobCreate(BaseModel):
    title: str
    description: Optional[str] = None
    required_skills: Optional[list] = None
    preferred_skills: Optional[list] = None
    experience_level: Optional[str] = None
    location: Optional[str] = None
    remote: bool = False
    salary_range: Optional[str] = None

class JobOut(BaseModel):
    id: str
    title: str
    description: Optional[str]
    required_skills: Optional[list]
    preferred_skills: Optional[list]
    experience_level: Optional[str]
    location: Optional[str]
    remote: bool
    salary_range: Optional[str]
    company_name: Optional[str] = None

    class Config:
        from_attributes = True
