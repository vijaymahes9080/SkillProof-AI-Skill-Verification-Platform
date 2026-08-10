from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
import random

from app.db.session import get_db
from app.db import models
from app.schemas import InterviewStart, InterviewMessage, InterviewSessionOut
from app.core.security import get_current_active_user

router = APIRouter()

# Mock question bank per skill
QUESTION_BANK = {
    "Java": [
        "Explain why you chose Java for your project. What are its strengths for backend development?",
        "How does garbage collection work in Java? When might it cause performance issues?",
        "Explain the difference between HashMap and ConcurrentHashMap. When would you use each?",
        "Describe your experience with Spring Boot. How does dependency injection work?",
        "How would you design a thread-safe singleton in Java?",
    ],
    "Python": [
        "Explain Python's GIL and how it affects multithreaded programs.",
        "What is the difference between a list comprehension and a generator expression?",
        "How does Python's memory management work?",
        "Describe your experience with FastAPI or Django. What are the trade-offs?",
        "How would you optimize a slow Python function?",
    ],
    "React": [
        "Explain the difference between controlled and uncontrolled components.",
        "How does React's reconciliation algorithm work? What is the virtual DOM?",
        "When would you use useCallback vs useMemo?",
        "Explain the Context API and when you'd use it over Redux/Zustand.",
        "How would you optimize a React app with performance issues?",
    ],
    "SQL": [
        "Explain the difference between INNER JOIN, LEFT JOIN, and FULL OUTER JOIN.",
        "When would you use an index? What are the downsides of over-indexing?",
        "Explain the ACID properties of database transactions.",
        "How would you optimize a slow query? Walk me through your debugging process.",
        "What is database normalization? When would you deliberately denormalize?",
    ],
}

DEFAULT_QUESTIONS = [
    "Tell me about a challenging technical problem you solved. What was your approach?",
    "How do you ensure code quality in your projects? Walk me through your process.",
    "Describe a time when you had to learn a new technology quickly. How did you approach it?",
]

def get_questions_for_skill(skill: str) -> list:
    return QUESTION_BANK.get(skill, DEFAULT_QUESTIONS)


@router.post("/start", status_code=201)
async def start_interview(
    data: InterviewStart,
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    profile = db.query(models.StudentProfile).filter(models.StudentProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    session = models.InterviewSession(
        student_id=profile.id,
        skill_focus=data.skill_focus,
        difficulty=data.difficulty,
        transcript=[],
        started_at=datetime.utcnow(),
    )
    db.add(session)
    db.commit()
    db.refresh(session)

    questions = get_questions_for_skill(data.skill_focus)
    first_q = questions[0]

    opening = f"Hello! I'm your SkillProof AI Interviewer. Today we'll focus on **{data.skill_focus}** at **{data.difficulty}** level. I'll evaluate your technical correctness, conceptual depth, communication, and practical reasoning.\n\nLet's begin:\n\n{first_q}"

    return {
        "session_id": session.id,
        "message": opening,
        "question_number": 1,
        "total_questions": len(questions),
    }


@router.post("/{session_id}/message")
async def send_message(
    session_id: str,
    msg: InterviewMessage,
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    session = db.query(models.InterviewSession).filter(models.InterviewSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    questions = get_questions_for_skill(session.skill_focus)
    transcript = list(session.transcript or [])
    q_idx = len([t for t in transcript if t.get("role") == "ai" and t.get("is_question")])

    # Simulate AI evaluation scores (in production: call LLM API)
    eval_scores = {
        "technicalCorrectness": random.randint(72, 95),
        "conceptualUnderstanding": random.randint(75, 95),
        "communication": random.randint(70, 90),
        "depth": random.randint(72, 92),
        "practicalReasoning": random.randint(74, 94),
    }
    overall_q_score = round(sum(eval_scores.values()) / len(eval_scores), 1)

    # Add user message to transcript
    transcript.append({"role": "user", "content": msg.content})

    # Generate AI response
    if q_idx < len(questions) - 1:
        next_q = questions[q_idx + 1]
        ai_reply = f"Good answer! I noticed some strong points there.\n\nNext question:\n\n{next_q}"
        is_final = False
    else:
        ai_reply = "Excellent! That concludes our interview. Thank you for your thoughtful responses. I'm generating your performance report now..."
        is_final = True

    transcript.append({
        "role": "ai",
        "content": ai_reply,
        "is_question": not is_final,
        "evaluation": eval_scores if not is_final else None,
    })
    session.transcript = transcript
    db.commit()

    response = {
        "message": ai_reply,
        "evaluation": eval_scores,
        "question_score": overall_q_score,
        "is_final": is_final,
    }

    if is_final:
        # Compute final scores
        user_msgs = [t for t in transcript if t.get("role") == "user"]
        final_scores = {
            "technicalCorrectness": random.randint(80, 92),
            "conceptualUnderstanding": random.randint(82, 94),
            "communication": random.randint(75, 88),
            "depth": random.randint(80, 92),
            "practicalReasoning": random.randint(82, 94),
        }
        overall = round(sum(final_scores.values()) / len(final_scores), 1)

        session.overall_score = overall
        session.technical_correctness = final_scores["technicalCorrectness"]
        session.conceptual_understanding = final_scores["conceptualUnderstanding"]
        session.communication_score = final_scores["communication"]
        session.depth_score = final_scores["depth"]
        session.practical_reasoning = final_scores["practicalReasoning"]
        session.completed_at = datetime.utcnow()

        # Update student skill interview score
        profile = db.query(models.StudentProfile).filter(models.StudentProfile.id == session.student_id).first()
        if profile:
            skill = db.query(models.Skill).filter(models.Skill.name == session.skill_focus).first()
            if skill:
                student_skill = db.query(models.StudentSkill).filter(
                    models.StudentSkill.student_id == profile.id,
                    models.StudentSkill.skill_id == skill.id
                ).first()
                if student_skill:
                    student_skill.interview_score = overall
        db.commit()

        response["final_scores"] = final_scores
        response["overall_score"] = overall

    return response


@router.get("/my-sessions", response_model=List[InterviewSessionOut])
async def my_sessions(current_user: models.User = Depends(get_current_active_user), db: Session = Depends(get_db)):
    profile = db.query(models.StudentProfile).filter(models.StudentProfile.user_id == current_user.id).first()
    if not profile:
        return []
    return db.query(models.InterviewSession).filter(models.InterviewSession.student_id == profile.id).all()
