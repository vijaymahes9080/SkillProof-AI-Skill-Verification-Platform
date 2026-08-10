import uuid
from datetime import datetime
from sqlalchemy import (
    Column, String, Integer, Float, Boolean, DateTime, Text,
    ForeignKey, Enum, JSON, UniqueConstraint
)
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
import enum

from app.db.session import Base


def gen_uuid():
    return str(uuid.uuid4())


# ──────────────────────────────────────────
# Enums
# ──────────────────────────────────────────

class UserRole(str, enum.Enum):
    student = "student"
    college_admin = "college_admin"
    recruiter = "recruiter"
    faculty = "faculty"
    admin = "admin"

class EvidenceStrength(str, enum.Enum):
    high = "HIGH"
    medium = "MEDIUM"
    low = "LOW"

class VerificationStatus(str, enum.Enum):
    pending = "pending"
    verified = "verified"
    rejected = "rejected"
    requires_more_evidence = "requires_more_evidence"

class AssessmentStatus(str, enum.Enum):
    not_started = "not_started"
    in_progress = "in_progress"
    completed = "completed"
    expired = "expired"

class IntegrityFlag(str, enum.Enum):
    none = "none"
    low = "low"
    medium = "medium"
    high = "high"


# ──────────────────────────────────────────
# User & Auth
# ──────────────────────────────────────────

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=gen_uuid)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=True)  # null if GitHub OAuth only
    full_name = Column(String, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.student, nullable=False)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    github_id = Column(String, unique=True, nullable=True)
    github_username = Column(String, nullable=True)
    github_access_token = Column(String, nullable=True)
    avatar_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    student_profile = relationship("StudentProfile", back_populates="user", uselist=False)
    college_profile = relationship("CollegeProfile", back_populates="user", uselist=False)

    def __repr__(self):
        return f"<User {self.email}>"


# ──────────────────────────────────────────
# Student
# ──────────────────────────────────────────

class StudentProfile(Base):
    __tablename__ = "student_profiles"

    id = Column(String, primary_key=True, default=gen_uuid)
    user_id = Column(String, ForeignKey("users.id"), unique=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    bio = Column(Text, nullable=True)
    college = Column(String, nullable=True)
    degree = Column(String, nullable=True)
    graduation_year = Column(Integer, nullable=True)
    location = Column(String, nullable=True)
    linkedin_url = Column(String, nullable=True)
    portfolio_url = Column(String, nullable=True)
    skillproof_score = Column(Float, default=0.0)
    verification_id = Column(String, unique=True, default=lambda: f"SP-{uuid.uuid4().hex[:8].upper()}")
    github_connected = Column(Boolean, default=False)
    github_evidence_count = Column(Integer, default=0)
    is_public = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="student_profile")
    skills = relationship("StudentSkill", back_populates="student", cascade="all, delete-orphan")
    repositories = relationship("Repository", back_populates="student", cascade="all, delete-orphan")
    projects = relationship("Project", back_populates="student", cascade="all, delete-orphan")
    assessment_attempts = relationship("AssessmentAttempt", back_populates="student", cascade="all, delete-orphan")
    interview_sessions = relationship("InterviewSession", back_populates="student", cascade="all, delete-orphan")
    certifications = relationship("Certification", back_populates="student", cascade="all, delete-orphan")


# ──────────────────────────────────────────
# College
# ──────────────────────────────────────────

class CollegeProfile(Base):
    __tablename__ = "college_profiles"

    id = Column(String, primary_key=True, default=gen_uuid)
    user_id = Column(String, ForeignKey("users.id"), unique=True, nullable=False)
    college_name = Column(String, nullable=False)
    location = Column(String, nullable=True)
    website = Column(String, nullable=True)
    accreditation = Column(String, nullable=True)
    total_students = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="college_profile")


# ──────────────────────────────────────────
# Skills
# ──────────────────────────────────────────

class Skill(Base):
    __tablename__ = "skills"

    id = Column(String, primary_key=True, default=gen_uuid)
    name = Column(String, unique=True, nullable=False, index=True)
    category = Column(String, nullable=True)  # Backend, Frontend, Database, AI/ML, DevOps
    description = Column(Text, nullable=True)
    icon = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    student_skills = relationship("StudentSkill", back_populates="skill")
    assessment_templates = relationship("AssessmentTemplate", back_populates="skill")


class StudentSkill(Base):
    __tablename__ = "student_skills"

    id = Column(String, primary_key=True, default=gen_uuid)
    student_id = Column(String, ForeignKey("student_profiles.id"), nullable=False)
    skill_id = Column(String, ForeignKey("skills.id"), nullable=False)
    claimed_level = Column(String, nullable=True)  # Beginner, Intermediate, Advanced, Expert
    confidence_score = Column(Float, default=0.0)
    evidence_strength = Column(Enum(EvidenceStrength), default=EvidenceStrength.low)
    verification_status = Column(Enum(VerificationStatus), default=VerificationStatus.pending)
    assessment_score = Column(Float, nullable=True)
    github_score = Column(Float, nullable=True)
    project_score = Column(Float, nullable=True)
    interview_score = Column(Float, nullable=True)
    recency_score = Column(Float, nullable=True)
    github_repos_count = Column(Integer, default=0)
    github_loc = Column(Integer, default=0)
    last_verified_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    student = relationship("StudentProfile", back_populates="skills")
    skill = relationship("Skill", back_populates="student_skills")
    evidence_items = relationship("SkillEvidence", back_populates="student_skill", cascade="all, delete-orphan")

    __table_args__ = (UniqueConstraint("student_id", "skill_id"),)


class SkillEvidence(Base):
    __tablename__ = "skill_evidence"

    id = Column(String, primary_key=True, default=gen_uuid)
    student_skill_id = Column(String, ForeignKey("student_skills.id"), nullable=False)
    evidence_type = Column(String, nullable=False)  # github_repo, assessment, project, interview
    evidence_data = Column(JSON, nullable=True)
    score_contribution = Column(Float, default=0.0)
    description = Column(Text, nullable=True)
    source_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    student_skill = relationship("StudentSkill", back_populates="evidence_items")


# ──────────────────────────────────────────
# GitHub / Repositories
# ──────────────────────────────────────────

class Repository(Base):
    __tablename__ = "repositories"

    id = Column(String, primary_key=True, default=gen_uuid)
    student_id = Column(String, ForeignKey("student_profiles.id"), nullable=False)
    github_repo_id = Column(String, nullable=True)
    name = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    url = Column(String, nullable=True)
    primary_language = Column(String, nullable=True)
    languages = Column(JSON, nullable=True)  # {"Java": 68, "Python": 22}
    stars = Column(Integer, default=0)
    forks = Column(Integer, default=0)
    commit_count = Column(Integer, default=0)
    lines_of_code = Column(Integer, default=0)
    has_tests = Column(Boolean, default=False)
    has_documentation = Column(Boolean, default=False)
    has_ci_cd = Column(Boolean, default=False)
    analysis_score = Column(Float, nullable=True)
    analysis_data = Column(JSON, nullable=True)
    last_commit_at = Column(DateTime, nullable=True)
    analyzed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    student = relationship("StudentProfile", back_populates="repositories")


# ──────────────────────────────────────────
# Projects
# ──────────────────────────────────────────

class Project(Base):
    __tablename__ = "projects"

    id = Column(String, primary_key=True, default=gen_uuid)
    student_id = Column(String, ForeignKey("student_profiles.id"), nullable=False)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    github_url = Column(String, nullable=True)
    demo_url = Column(String, nullable=True)
    technologies = Column(JSON, nullable=True)  # list of strings
    overall_score = Column(Float, nullable=True)
    architecture_score = Column(Float, nullable=True)
    code_quality_score = Column(Float, nullable=True)
    database_design_score = Column(Float, nullable=True)
    api_design_score = Column(Float, nullable=True)
    testing_score = Column(Float, nullable=True)
    documentation_score = Column(Float, nullable=True)
    security_score = Column(Float, nullable=True)
    scalability_score = Column(Float, nullable=True)
    analysis_status = Column(String, default="pending")  # pending, analyzing, completed
    analysis_data = Column(JSON, nullable=True)
    analyzed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    student = relationship("StudentProfile", back_populates="projects")


# ──────────────────────────────────────────
# Assessments
# ──────────────────────────────────────────

class AssessmentTemplate(Base):
    __tablename__ = "assessment_templates"

    id = Column(String, primary_key=True, default=gen_uuid)
    skill_id = Column(String, ForeignKey("skills.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    total_levels = Column(Integer, default=7)
    duration_minutes = Column(Integer, default=45)
    passing_score = Column(Float, default=60.0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    skill = relationship("Skill", back_populates="assessment_templates")
    questions = relationship("Question", back_populates="template", cascade="all, delete-orphan")
    attempts = relationship("AssessmentAttempt", back_populates="template")


class Question(Base):
    __tablename__ = "questions"

    id = Column(String, primary_key=True, default=gen_uuid)
    template_id = Column(String, ForeignKey("assessment_templates.id"), nullable=False)
    level = Column(Integer, nullable=False)
    question_text = Column(Text, nullable=False)
    question_type = Column(String, default="mcq")  # mcq, code, short_answer
    options = Column(JSON, nullable=True)  # list of option strings for MCQ
    correct_answer = Column(String, nullable=True)
    explanation = Column(Text, nullable=True)
    points = Column(Float, default=1.0)
    time_limit_seconds = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    template = relationship("AssessmentTemplate", back_populates="questions")


class AssessmentAttempt(Base):
    __tablename__ = "assessment_attempts"

    id = Column(String, primary_key=True, default=gen_uuid)
    student_id = Column(String, ForeignKey("student_profiles.id"), nullable=False)
    template_id = Column(String, ForeignKey("assessment_templates.id"), nullable=False)
    status = Column(Enum(AssessmentStatus), default=AssessmentStatus.not_started)
    score = Column(Float, nullable=True)
    max_level_reached = Column(Integer, default=0)
    time_taken_seconds = Column(Integer, nullable=True)
    answers = Column(JSON, nullable=True)  # {question_id: answer}
    integrity_flag = Column(Enum(IntegrityFlag), default=IntegrityFlag.none)
    integrity_signals = Column(JSON, nullable=True)
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    student = relationship("StudentProfile", back_populates="assessment_attempts")
    template = relationship("AssessmentTemplate", back_populates="attempts")


# ──────────────────────────────────────────
# AI Interview
# ──────────────────────────────────────────

class InterviewSession(Base):
    __tablename__ = "interview_sessions"

    id = Column(String, primary_key=True, default=gen_uuid)
    student_id = Column(String, ForeignKey("student_profiles.id"), nullable=False)
    skill_focus = Column(String, nullable=False)
    difficulty = Column(String, default="Mid-level")
    overall_score = Column(Float, nullable=True)
    technical_correctness = Column(Float, nullable=True)
    conceptual_understanding = Column(Float, nullable=True)
    communication_score = Column(Float, nullable=True)
    depth_score = Column(Float, nullable=True)
    practical_reasoning = Column(Float, nullable=True)
    transcript = Column(JSON, nullable=True)  # list of {role, content, scores}
    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

    student = relationship("StudentProfile", back_populates="interview_sessions")


# ──────────────────────────────────────────
# Verification & Certifications
# ──────────────────────────────────────────

class Certification(Base):
    __tablename__ = "certifications"

    id = Column(String, primary_key=True, default=gen_uuid)
    student_id = Column(String, ForeignKey("student_profiles.id"), nullable=False)
    verification_id = Column(String, unique=True, nullable=False)
    skills_verified = Column(JSON, nullable=True)  # list of skill names
    overall_score = Column(Float, nullable=True)
    issued_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime, nullable=True)
    is_valid = Column(Boolean, default=True)
    certificate_data = Column(JSON, nullable=True)

    student = relationship("StudentProfile", back_populates="certifications")


# ──────────────────────────────────────────
# Jobs & Matching
# ──────────────────────────────────────────

class Company(Base):
    __tablename__ = "companies"

    id = Column(String, primary_key=True, default=gen_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=True)
    name = Column(String, nullable=False)
    industry = Column(String, nullable=True)
    location = Column(String, nullable=True)
    website = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    logo_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    jobs = relationship("Job", back_populates="company", cascade="all, delete-orphan")


class Job(Base):
    __tablename__ = "jobs"

    id = Column(String, primary_key=True, default=gen_uuid)
    company_id = Column(String, ForeignKey("companies.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    required_skills = Column(JSON, nullable=True)   # [{"skill": "Java", "min_score": 80}]
    preferred_skills = Column(JSON, nullable=True)
    experience_level = Column(String, nullable=True)
    location = Column(String, nullable=True)
    remote = Column(Boolean, default=False)
    salary_range = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    company = relationship("Company", back_populates="jobs")
