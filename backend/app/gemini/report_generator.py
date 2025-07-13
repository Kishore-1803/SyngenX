import google.generativeai as genai
import os
from app.routes.fetch_data import fetch_data

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-2.0-flash")

def generate_ai_report(user):
    github_data  = fetch_data(user)
    
    prompt = f"""
    Analyze the following GitHub data to generate a detailed report about the developer as an individual.
    Focus on their strengths, weaknesses, technical skills, areas of expertise, criticality of their contributions,
    the difficulty of tasks they handle, coding practices, and any notable patterns in their work.
    Do not focus on individual projects, but rather on the developer's overall profile and performance.

    Developer GitHub Data:
    {github_data}
    """


    response = model.generate_content(prompt)
    return response.text
