"""
GitHub Repository Analyzer Service
Analyzes a GitHub repository for code quality, tests, documentation, CI/CD, etc.
"""
import httpx
import re
from typing import Optional
from app.db import models


async def analyze_repository(repo: models.Repository, github_token: Optional[str]) -> dict:
    """Main analysis entrypoint."""
    headers = {"Authorization": f"Bearer {github_token}"} if github_token else {}
    full_name = repo.full_name or ""

    result = {
        "repo_name": repo.name,
        "overall_score": 0.0,
        "has_tests": False,
        "has_documentation": False,
        "has_ci_cd": False,
        "commit_count": 0,
        "lines_of_code": 0,
        "languages": {},
        "architecture_signals": [],
        "issues": [],
    }

    async with httpx.AsyncClient(timeout=20) as client:
        # 1. Languages
        try:
            lang_resp = await client.get(f"https://api.github.com/repos/{full_name}/languages", headers=headers)
            if lang_resp.status_code == 200:
                langs = lang_resp.json()
                total = sum(langs.values()) or 1
                result["languages"] = {k: round(v / total * 100, 1) for k, v in langs.items()}
                result["lines_of_code"] = sum(langs.values()) // 10  # rough estimate
        except Exception:
            pass

        # 2. Commits count
        try:
            commits_resp = await client.get(
                f"https://api.github.com/repos/{full_name}/commits",
                headers=headers, params={"per_page": 1}
            )
            link = commits_resp.headers.get("Link", "")
            last_page = re.search(r'page=(\d+)>; rel="last"', link)
            result["commit_count"] = int(last_page.group(1)) if last_page else 1
        except Exception:
            pass

        # 3. Check for tests, docs, CI
        try:
            tree_resp = await client.get(
                f"https://api.github.com/repos/{full_name}/git/trees/HEAD",
                headers=headers, params={"recursive": 1}
            )
            if tree_resp.status_code == 200:
                files = [f["path"].lower() for f in tree_resp.json().get("tree", [])]
                test_patterns = ["test", "spec", "__tests__", "tests/", "test/"]
                ci_patterns = [".github/workflows", ".travis.yml", "jenkinsfile", ".gitlab-ci", "circle.ci"]
                doc_patterns = ["readme", "docs/", "documentation", "wiki"]

                result["has_tests"] = any(any(p in f for p in test_patterns) for f in files)
                result["has_ci_cd"] = any(any(p in f for p in ci_patterns) for f in files)
                result["has_documentation"] = any(any(p in f for p in doc_patterns) for f in files)

                # Architecture signals
                if any("docker" in f for f in files):
                    result["architecture_signals"].append("Docker")
                if any("kubernetes" in f or "k8s" in f for f in files):
                    result["architecture_signals"].append("Kubernetes")
                if any("requirements.txt" in f or "pyproject.toml" in f for f in files):
                    result["architecture_signals"].append("Python Dependencies")
                if any("pom.xml" in f or "build.gradle" in f for f in files):
                    result["architecture_signals"].append("Java Build Tool")
        except Exception:
            pass

    # Score calculation
    score = 50.0
    if result["has_tests"]:
        score += 15
    if result["has_documentation"]:
        score += 10
    if result["has_ci_cd"]:
        score += 10
    if result["commit_count"] > 50:
        score += 5
    if result["commit_count"] > 100:
        score += 5
    if len(result["languages"]) > 1:
        score += 5
    score = min(score, 100.0)
    result["overall_score"] = round(score, 1)

    return result
