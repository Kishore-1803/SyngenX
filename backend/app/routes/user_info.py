from fastapi import APIRouter, Depends
from app.auth.auth_guard import verify_token

router = APIRouter(prefix="/user", tags=["User"])

@router.get("/me")
def get_me(user=Depends(verify_token)):
    return {"user_id": user["sub"], "email": user.get("email")}
