from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import RedirectResponse
import os, requests
from supabase import create_client
from datetime import datetime
from dotenv import load_dotenv
load_dotenv()

router = APIRouter()

# Supabase client
supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_KEY")
)

# GitHub App Configuration
GITHUB_CLIENT_ID = os.getenv("GITHUB_CLIENT_ID")
GITHUB_CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET")
GITHUB_APP_CALLBACK_URL = os.getenv("GITHUB_APP_CALLBACK_URL")
print("GITHUB_APP_CLIENT_ID:", GITHUB_CLIENT_ID)
print("GITHUB_APP_CALLBACK_URL:", GITHUB_APP_CALLBACK_URL)

@router.get("/login/github")
def login_github(request: Request):
    user_id = request.query_params.get("user_id")
    if not user_id:
        raise HTTPException(status_code=400, detail="Missing user_id")

    state = f"{user_id}:{os.urandom(8).hex()}"

    github_oauth_url = (
        f"https://github.com/login/oauth/authorize"
        f"?client_id={GITHUB_CLIENT_ID}"
        f"&redirect_uri={GITHUB_APP_CALLBACK_URL}"
        f"&scope=read:user,repo"
        f"&state={state}"
        f"&prompt=consent"
    )

    return {"url": github_oauth_url}


@router.get("/callback/github")
def github_callback(code: str, state: str):
    try:
        user_id = state.split(":")[0]

        # Exchange code for access token
        token_response = requests.post(
            "https://github.com/login/oauth/access_token",
            headers={"Accept": "application/json"},
            data={
                "client_id": GITHUB_CLIENT_ID,
                "client_secret": GITHUB_CLIENT_SECRET,
                "code": code,
                "redirect_uri": GITHUB_APP_CALLBACK_URL,
            },
            timeout=10
        )
        token_data = token_response.json()
        access_token = token_data.get("access_token")

        if not access_token:
            raise HTTPException(status_code=400, detail="GitHub OAuth failed")

        # Get GitHub user details
        user_response = requests.get(
            "https://api.github.com/user",
            headers={"Authorization": f"Bearer {access_token}"},
            timeout=10
        )

        github_user = user_response.json()
        github_id = str(github_user["id"])
        github_username = github_user["login"]

        # Prevent duplicate linking
        existing = supabase.table("linked_accounts") \
            .select("user_id") \
            .eq("provider", "github") \
            .eq("provider_user_id", github_id) \
            .execute()

        if existing.data and existing.data[0]["user_id"] != user_id:
            raise HTTPException(status_code=400, detail="GitHub account already linked to another user")

        # Save GitHub link
        # Save GitHub link
        # Save GitHub link using RPC to avoid on_conflict bug
        supabase.rpc("upsert_linked_account", {
            "p_user_id": user_id,
            "p_provider": "github",
            "p_provider_user_id": github_id,
            "p_username": github_username,
            "p_access_token": access_token,
            "p_linked_at": datetime.utcnow().isoformat()
        }).execute()



        return RedirectResponse("http://localhost:3000/dashboard?linked=github&success=true")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OAuth Error: {str(e)}")