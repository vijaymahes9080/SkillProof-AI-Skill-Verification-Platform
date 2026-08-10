# SkillProof — AI Skill Verification Platform

<div align="center">
  <img src="https://img.shields.io/badge/SkillProof-AI%20Skill%20Verification-6366f1?style=for-the-badge" />
  <img src="https://img.shields.io/badge/FastAPI-0.109-009688?style=for-the-badge&logo=fastapi" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" />
</div>

<br/>

> **Don't just claim your skills. Prove them.**

SkillProof converts a traditional resume into an **evidence-backed skill profile** using GitHub analysis, live coding assessments, AI technical interviews, and project evaluation.

---

## 🚀 Features

| Feature | Description |
|---------|-------------|
| 🔍 **GitHub Intelligence** | Deep analysis of repositories, commits, code quality, architecture |
| 📊 **Evidence Engine** | Every skill score backed by concrete, clickable evidence |
| 🎯 **Adaptive Assessments** | 7-level coding assessments that adjust to your performance |
| 🤖 **AI Technical Interview** | Evaluates technical depth, reasoning, and communication |
| 🗂️ **Project Analyzer** | 8-dimension AI scoring (Architecture, Testing, Security, etc.) |
| 🏆 **Skill Verification** | Weighted confidence scores from 5 evidence sources |
| 🛡️ **Anti-Cheating** | Integrity signals for code similarity and suspicious patterns |
| 📜 **Verification Certificate** | Cryptographically-signed, QR-scannable certificates |
| 🏫 **College Dashboard** | Skill gap analysis, batch analytics, placement readiness |
| 💼 **Job Matching** | Match verified skills against employer requirements |

---

## 🏗️ Architecture

```
Frontend (React + Vite + TypeScript + Tailwind)
        │
        ▼ (HTTP + API proxy)
Backend API (FastAPI + Python)
        │
   ┌────┼────┐
   ▼    ▼    ▼
PostgreSQL  Redis  GitHub API
   DB    Cache    Analysis
```

---

## 📁 Project Structure

```
skillproof/
├── src/                    # React frontend
│   ├── pages/              # 10 pages (Landing, Auth, Dashboard, ...)
│   ├── components/         # Reusable UI components
│   └── data/               # Mock data for demo
├── backend/                # FastAPI backend
│   ├── main.py             # App entrypoint
│   ├── app/
│   │   ├── api/v1/         # All API routers
│   │   ├── core/           # Config + JWT security
│   │   ├── db/             # SQLAlchemy models + session
│   │   ├── services/       # GitHub analyzer, skill verifier, project analyzer
│   │   └── schemas.py      # Pydantic schemas
│   └── requirements.txt
├── docker-compose.yml      # Full stack with PostgreSQL + Redis
└── package.json
```

---

## ⚡ Quick Start

### Frontend (React)

```bash
npm install
npm run dev
# → http://localhost:5173
```

### Backend (FastAPI)

```bash
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate    # Linux/Mac

# Install dependencies
pip install -r requirements.txt

# Copy environment config
cp .env.example .env
# Edit .env with your DB and API keys

# Start server
uvicorn main:app --reload
# → http://localhost:8000
# → Docs: http://localhost:8000/api/docs
```

### Full Stack with Docker

```bash
docker-compose up --build
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login (JWT) |
| POST | `/api/auth/github` | GitHub OAuth |
| GET | `/api/students/me` | My profile |
| GET | `/api/students/{id}/skills` | Student skills with evidence |
| POST | `/api/github/connect` | Connect + import GitHub repos |
| POST | `/api/repositories/{id}/analyze` | Analyze a repo |
| POST | `/api/projects/` | Add project |
| POST | `/api/projects/{id}/analyze` | AI project analysis |
| POST | `/api/assessments/start` | Start assessment |
| POST | `/api/assessments/{id}/submit` | Submit answers |
| POST | `/api/interviews/start` | Start AI interview |
| POST | `/api/interviews/{id}/message` | Send interview message |
| GET | `/api/verification/{id}` | Verify certificate |
| POST | `/api/jobs/match` | Match skills to jobs |
| GET | `/api/analytics/college` | College dashboard stats |

Full interactive docs: **http://localhost:8000/api/docs**

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, TypeScript, Tailwind CSS |
| Components | shadcn/ui, Framer Motion, Recharts |
| Backend | Python 3.11, FastAPI |
| Database | PostgreSQL 16, SQLAlchemy, Alembic |
| Cache | Redis |
| Auth | JWT (python-jose), bcrypt, GitHub OAuth |
| AI | OpenAI / Groq / LangChain |
| Deploy | Docker, Docker Compose |

---

## 👨‍💻 Author

**Vijay Mahes** — MCA Final Year Project  
📧 Vijaypradhap2004@gmail.com  
🐙 [@vijaymahes9080](https://github.com/vijaymahes9080)

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.
