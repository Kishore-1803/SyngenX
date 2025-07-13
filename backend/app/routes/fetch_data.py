from fastapi import APIRouter, Depends
from app.auth.auth_guard import verify_token
from app.integrations import github, linear, zoho

router = APIRouter(prefix="/data", tags=["Data"])

@router.get("/fetch")
def fetch_data(user=Depends(verify_token)):
    github_profile = github.get_github_profile(user)
    
    # Fetch repo list with metadata and README/languages
    detailed_repos_data = github.get_detailed_repo_data(user)["detailed_repos"]
    
    detailed_code_data = []
    for repo in detailed_repos_data[:3]:  # Limit to 3 for performance
        owner = repo.get("owner", github_profile["login"])  # fallback to user's login
        name = repo["repo_name"]
        try:
            code = github.get_repo_code(user, owner, name)
        except Exception:
            code = []
        detailed_code_data.append({
            "repo": f"{owner}/{name}",
            "code_files": code
        })

    github_data = {
        **github.get_github_data(user),
        **github.get_github_issues(user),
        **github.get_github_pull_requests(user),
        **github.get_github_commits(user),
        **github.get_github_contributors(user),
        "detailed_repos": detailed_repos_data,
        "repo_codes": detailed_code_data,
        "github_username": github_profile["login"]
    }

    return {"github": github_data}
