import os
import re
from fpdf import FPDF

def generate_pdf(insights):
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)

    # Regex to match **bold**, *italic*, and normal text
    pattern = r'(\*\*.*?\*\*|\*.*?\*)'
    parts = re.split(pattern, insights)

    for part in parts:
        if part.startswith('**') and part.endswith('**'):
            text = part[2:-2]
            pdf.set_font("Arial", style="B", size=12)
            pdf.write(10, text)
            pdf.set_font("Arial", style="", size=12)
        elif part.startswith('*') and part.endswith('*'):
            text = part[1:-1]
            pdf.set_font("Arial", style="I", size=12)
            pdf.write(10, text)
            pdf.set_font("Arial", style="", size=12)
        else:
            pdf.set_font("Arial", style="", size=12)
            pdf.write(10, part)
    pdf.ln(10)

    os.makedirs("generated_reports", exist_ok=True)
    path = os.path.join("generated_reports", "performance_report.pdf")
    pdf.output(path)
    return path