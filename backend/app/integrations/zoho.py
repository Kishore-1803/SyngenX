from supabase import create_client
from app.config import SUPABASE_URL, SUPABASE_KEY
import requests

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def get_zoho_data(user):
    token_data = supabase.table("linked_accounts").select("access_token").eq("user_id", user["sub"]).eq("provider", "zoho").execute()
    token = token_data.data[0]["access_token"]
    headers = {"Authorization": f"Zoho-oauthtoken {token}"}
    response = requests.get("https://projectsapi.zoho.com/restapi/portals/", headers=headers)
    return {"status": response.status_code}
