"""
AI Project Analyzer Service
Analyzes a GitHub project across 8 technical dimensions using rule-based + AI scoring.
"""
import httpx
from typing import Optional
from app.db import models
from datetime import datetime


async def analyze_project(project: models.Project, github_token: Optional[str]) -> dict:
    """
    Analyze a project repo across 8 dimensions:
    Architecture, Code Quality, Database Design, API Design,
    Testing, Documentation, Security, Scalability
    """
    headers = {"Authorization": f"Bearer {github_token}"} if github_token else {}
    github_url = project.github_url or ""

    # Extract owner/repo from URL
    parts = github_url.rstrip("/").split("/")
    if len(parts) < 2:
        return {"error": "Invalid GitHub URL"}
    full_name = f"{parts[-2]}/{parts[-1]}"

    scores = {
        "architecture": 60.0,
        "code_quality": 60.0,
        "database_design": 55.0,
        "api_design": 55.0,
        "testing": 40.0,
        "documentation": 50.0,
        "security": 55.0,
        "scalability": 55.0,
    }

    signals = {}

    async with httpx.AsyncClient(timeout=20) as client:
        try:
            # Repository metadata
            repo_resp = await client.get(f"https://api.github.com/repos/{full_name}", headers=headers)
            if repo_resp.status_code == 200:
                repo_data = repo_resp.json()
                signals["stars"] = repo_data.get("stargazers_count", 0)
                signals["forks"] = repo_data.get("forks_count", 0)
                signals["open_issues"] = repo_data.get("open_issues_count", 0)

            # File tree analysis
            tree_resp = await client.get(
                f"https://api.github.com/repos/{full_name}/git/trees/HEAD",
                headers=headers, params={"recursive": 1}
            )
            if tree_resp.status_code == 200:
                files = [f["path"].lower() for f in tree_resp.json().get("tree", [])]

                # Architecture signals
                if any("docker" in f for f in files):
                    scores["architecture"] += 10
                    scores["scalability"] += 8
                    signals["docker"] = True
                if any(".github/workflows" in f for f in files):
                    scores["architecture"] += 8
                    signals["ci_cd"] = True
                if any("kubernetes" in f or "k8s" in f for f in files):
                    scores["scalability"] += 12
                    signals["kubernetes"] = True
                if any("design" in f and "pattern" in f for f in files):
                    scores["architecture"] += 5

                # Testing
                test_files = [f for f in files if any(p in f for p in ["test", "spec", "__tests__"])]
                if test_files:
                    scores["testing"] += min(len(test_files) * 3, 30)
                    signals["test_files"] = len(test_files)

                # Documentation
                if any("readme" in f for f in files):
                    scores["documentation"] += 15
                if any("docs/" in f or "documentation/" in f for f in files):
                    scores["documentation"] += 10
                if any("openapi" in f or "swagger" in f for f in files):
                    scores["api_design"] += 10

                # Database
                if any(db in f for db in ["schema.sql", "migration", "alembic", "flyway", "liquibase"] for f in files):
                    scores["database_design"] += 15

                # Security
                if any(".env.example" in f for f in files):
                    scores["security"] += 8
                if not any(".env" == f for f in files):  # no committed .env
                    scores["security"] += 5
                if any("security" in f for f in files):
                    scores["security"] += 5

                # API design
                if any("controller" in f or "router" in f or "route" in f or "api" in f for f in files):
                    scores["api_design"] += 10
                if any("middleware" in f for f in files):
                    scores["api_design"] += 5

                # Code quality
                if any(linter in f for linter in [".eslintrc", ".pylintrc", "checkstyle", "sonar"] for f in files):
                    scores["code_quality"] += 10
                if any("requirements.txt" in f or "package.json" in f or "pom.xml" in f or "build.gradle" in f for f in files):
                    scores["code_quality"] += 5

        except Exception as e:
            signals["analysis_error"] = str(e)

    # Cap all scores at 100
    scores = {k: min(round(v, 1), 100.0) for k, v in scores.items()}
    overall = round(sum(scores.values()) / len(scores), 1)

    return {
        "overall_score": overall,
        "architecture_score": scores["architecture"],
        "code_quality_score": scores["code_quality"],
        "database_design_score": scores["database_design"],
        "api_design_score": scores["api_design"],
        "testing_score": scores["testing"],
        "documentation_score": scores["documentation"],
        "security_score": scores["security"],
        "scalability_score": scores["scalability"],
        "signals": signals,
        "full_name": full_name,
    }
