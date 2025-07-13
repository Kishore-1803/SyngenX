from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import link_accounts, fetch_data, generate_report, user_info, auth , github_oauth

app = FastAPI()

# ✅ Enable CORS so frontend (localhost:3000) can talk to backend (localhost:8000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



# ✅ Include API routes
app.include_router(auth.router)
app.include_router(link_accounts.router)
app.include_router(fetch_data.router)
app.include_router(generate_report.router)
app.include_router(user_info.router)
app.include_router(github_oauth.router)



