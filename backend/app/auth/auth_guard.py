from fastapi import Header, HTTPException
from jose import jwt, JWTError
import os
from dotenv import load_dotenv

load_dotenv()

SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET")
if not SUPABASE_JWT_SECRET:
    raise ValueError("SUPABASE_JWT_SECRET not set in environment variables")

def verify_token(authorization: str = Header(...)) -> dict:
    try:
        scheme, token = authorization.split()
        if scheme.lower() != 'bearer':
            raise HTTPException(status_code=401, detail="Invalid auth scheme")

        # ✅ Disable audience check
        payload = jwt.decode(
            token,
            SUPABASE_JWT_SECRET,
            algorithms=["HS256"],
            options={"verify_aud": False}
        )

        return payload

    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid authorization header format")
    except JWTError as e:
        print("JWT decode error:", str(e))  # Optional debug
        raise HTTPException(status_code=401, detail="Token is invalid or expired")
