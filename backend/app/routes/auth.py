from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from supabase import create_client
from app.config import SUPABASE_URL, SUPABASE_KEY

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
router = APIRouter(prefix="/auth", tags=["Auth"])

class SignupRequest(BaseModel):
    name: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/signup")
def signup(data: SignupRequest):
    try:
        response = supabase.auth.sign_up({
            "email": data.email,
            "password": data.password
        })

        if not response.user:
            raise HTTPException(status_code=400, detail="Signup failed: No user object returned.")

        user_id = response.user.id

        # Insert user profile data into 'profiles' table
        insert_response = supabase.table("profiles").insert({
            "id": user_id,
            "name": data.name,
            "email": data.email
        }).execute()

        return {
            "message": "Signup successful",
            "user": {
                "id": user_id,
                "email": data.email,
                "name": data.name
            },
            "session": {
                "access_token": response.session.access_token if response.session else None
            }
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during signup: {str(e)}")


@router.post("/login")
def login(data: LoginRequest):
    try:
        response = supabase.auth.sign_in_with_password({
            "email": data.email,
            "password": data.password
        })

        # Check for failure by inspecting session and user
        if response.session is None or response.user is None:
            raise HTTPException(status_code=401, detail="Invalid email or password.")

        return {
            "access_token": response.session.access_token,
            "user": {
                "id": response.user.id,
                "email": response.user.email
            }
        }

    except Exception as e:
        print("Login error:", str(e))
        raise HTTPException(status_code=500, detail="Internal Server Error")


