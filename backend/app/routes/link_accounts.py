import os
from fastapi import APIRouter, Depends, Body, Request, HTTPException, Query
import httpx
from app.auth.auth_guard import verify_token
from supabase import create_client
from app.config import SUPABASE_URL , SUPABASE_KEY
import dotenv
dotenv.load_dotenv()
GITHUB_CLIENT_ID = os.getenv("GITHUB_CLIENT_ID")
GITHUB_CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET")
REDIRECT_URI = os.getenv("GITHUB_REDIRECT_URI")


router = APIRouter(prefix="/link", tags=["Accounts"])
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

@router.post("/{platform}")
def link_account(platform: str, token: dict = Body(...), user=Depends(verify_token)):
    user_id = user["sub"]
    data = {
        "user_id": user_id,
        "platform": platform,
        "access_token": token["access_token"]
    }

    supabase.table("linked_accounts") \
        .upsert(data, on_conflict=["user_id", "platform"]) \
        .execute()

    return {"message": f"{platform} linked successfully"}

@router.get("/auth/github/callback")
async def github_callback(request: Request):
    code = request.query_params.get("code")
    user_id = request.query_params.get("user_id")  # replace later with secure JWT if needed

    if not code or not user_id:
        return {"error": "Missing code or user_id"}

    token_resp = httpx.post(
        url="https://github.com/login/oauth/access_token",
        headers={"Accept": "application/json"},
        data={
            "client_id": GITHUB_CLIENT_ID,
            "client_secret": GITHUB_CLIENT_SECRET,
            "code": code,
            "redirect_uri": REDIRECT_URI,
        }
    )
    token_json = token_resp.json()
    access_token = token_json.get("access_token")

    if not access_token:
        return {"error": "Access token error", "details": token_json}

    user_resp = httpx.get(
        url="https://api.github.com/user",
        headers={"Authorization": f"Bearer {access_token}"}
    )
    user_json = user_resp.json()
    github_id = str(user_json["id"])
    github_username = user_json["login"]

    result = supabase.table("linked_accounts").upsert({
        "user_id": user_id,
        "provider": "github",
        "provider_user_id": github_id,
        "username": github_username
    }, on_conflict=["user_id", "provider"]).execute()

    return {"message": "GitHub linked!", "github": github_username}

# FastAPI
@router.post("/unlink/{provider}")
def unlink_account(provider: str, user_id: str = Query(...)):
    result = supabase.table("linked_accounts")\
        .delete()\
        .eq("user_id", user_id)\
        .eq("provider", provider)\
        .execute()

    if result.error:
        raise HTTPException(status_code=500, detail=f"Unlinking failed: {result.error.message}")

    return {"message": f"{provider} account unlinked successfully."}


@router.get("/status")
def check_linked_accounts(user=Depends(verify_token)):
    user_id = user["sub"]
    result = supabase.table("linked_accounts").select("*").eq("user_id", user_id).execute()
    platforms = {entry["provider"]: True for entry in result.data}
    return platforms
