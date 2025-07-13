from fastapi import APIRouter, Depends
from fastapi.responses import FileResponse
from app.auth.auth_guard import verify_token
from app.gemini.report_generator import generate_ai_report
from app.pdf.generator import generate_pdf

router = APIRouter(prefix="/report", tags=["Report"])

@router.post("/generate")
def generate_report(user=Depends(verify_token)):
    insights = generate_ai_report(user)
    pdf_path = generate_pdf(insights)
    return FileResponse(path=pdf_path, filename="performance_report.pdf", media_type="application/pdf")
