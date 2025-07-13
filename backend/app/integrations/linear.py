from supabase import create_client
from app.config import SUPABASE_URL, SUPABASE_KEY
import requests

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def get_linear_data(user):
    token_data = supabase.table("linked_accounts").select("access_token").eq("user_id", user["sub"]).eq("provider", "linear").execute()
    token = token_data.data[0]["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get("https://api.linear.app/graphql", headers=headers)
    return {"status": response.status_code}
