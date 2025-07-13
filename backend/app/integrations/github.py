import base64
import requests
from supabase import create_client
from app.config import SUPABASE_URL, SUPABASE_KEY

# Create Supabase client
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def get_token(user):
    token_data = supabase.table("linked_accounts") \
        .select("access_token") \
        .eq("user_id", user["sub"]) \
        .eq("provider", "github") \
        .execute()
    return token_data.data[0]["access_token"]

def github_request(url, token):
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(url, headers=headers, timeout=10)
    response.raise_for_status()  # Raise HTTPError for bad responses (e.g., 403, 404)
    return response.json()

def get_github_profile(user):
    token = get_token(user)
    return github_request("https://api.github.com/user", token)

def get_github_data(user):
    token = get_token(user)
    repos = github_request("https://api.github.com/user/repos", token)
    return {"repos": len(repos)}

def get_github_issues(user):
    token = get_token(user)
    issues = github_request("https://api.github.com/issues", token)
    return {"issues": len(issues)}

def get_github_pull_requests(user):
    token = get_token(user)
    repos = github_request("https://api.github.com/user/repos", token)

    pull_summary = []
    for repo in repos[:5]:  # Limit to avoid rate limits
        owner = repo["owner"]["login"]
        repo_name = repo["name"]
        
        try:
            pulls = github_request(f"https://api.github.com/repos/{owner}/{repo_name}/pulls", token)
            pull_summary.append({
                "repo": repo_name,
                "pull_requests": len(pulls)
            })
        except Exception as e:
            pull_summary.append({
                "repo": repo_name,
                "pull_requests": "error",
                "error": str(e)
            })

    return {"pull_requests_by_repo": pull_summary}


def get_github_commits(user):
    token = get_token(user)
    repos = github_request("https://api.github.com/user/repos", token)

    commit_summary = []
    for repo in repos[:5]:  # Limit for rate safety
        owner = repo["owner"]["login"]
        repo_name = repo["name"]

        try:
            commits = github_request(f"https://api.github.com/repos/{owner}/{repo_name}/commits", token)
            commit_summary.append({
                "repo": repo_name,
                "commits": len(commits)
            })
        except Exception as e:
            commit_summary.append({
                "repo": repo_name,
                "commits": "error",
                "error": str(e)
            })

    return {"commits_by_repo": commit_summary}


def get_github_contributors(user):
    token = get_token(user)
    repos = github_request("https://api.github.com/user/repos", token)

    contributor_summary = []
    for repo in repos[:5]:  # Limit to avoid rate limits
        owner = repo["owner"]["login"]
        repo_name = repo["name"]

        try:
            contributors = github_request(f"https://api.github.com/repos/{owner}/{repo_name}/contributors", token)
            contributor_summary.append({
                "repo": repo_name,
                "contributors": len(contributors)
            })
        except Exception as e:
            contributor_summary.append({
                "repo": repo_name,
                "contributors": "error",
                "error": str(e)
            })

    return {"contributors_by_repo": contributor_summary}

def get_detailed_repo_data(user):
    token = get_token(user)
    repos = github_request("https://api.github.com/user/repos", token)
    
    detailed = []

    for repo in repos[:5]:  # Limit to 5 repos
        owner = repo.get("owner", {}).get("login", "")
        repo_name = repo["name"]

        # README
        readme_data = {}
        try:
            readme_data = github_request(
                f"https://api.github.com/repos/{owner}/{repo_name}/readme", token
            )
        except requests.HTTPError:
            pass  # Readme not found

        readme = ""
        if "content" in readme_data:
            try:
                readme = base64.b64decode(readme_data["content"]).decode("utf-8", errors="ignore")
            except Exception:
                readme = ""

        # Languages
        languages = {}
        try:
            languages = github_request(
                f"https://api.github.com/repos/{owner}/{repo_name}/languages", token
            )
        except requests.HTTPError:
            pass

        # Files
        file_names = []
        try:
            files_data = github_request(
                f"https://api.github.com/repos/{owner}/{repo_name}/contents", token
            )
            file_names = [f["name"] for f in files_data if f.get("type") == "file"]
        except requests.HTTPError:
            pass

        detailed.append({
            "repo_name": repo_name,
            "owner": owner,
            "description": repo.get("description", ""),
            "languages": languages,
            "files": file_names,
            "readme": readme[:2000]  # Trim for Gemini
        })

    return {"detailed_repos": detailed}
