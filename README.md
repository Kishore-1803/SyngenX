# 📊 Developer Performance Analytics System

An AI-powered analytics platform that aggregates and analyzes data from GitHub, Linear, and Zoho Projects to generate comprehensive individual and team performance reports.

## 🚀 Features

- 🔗 OAuth Integration with GitHub (working), Linear (WIP), and Zoho
- 📊 Metrics Dashboard: Commits, Issues, PRs, Repos, Contributions
- 🧠 AI-Generated Insights using Gemini API
- 📄 Developer Report: Strengths, Weaknesses, Criticality Handling, Behavioral Analytics
- 🖼️ Visuals: Radar Charts, Burnup/Burndown Graphs, Timelines
- 🧩 Modular Architecture (FastAPI + Next.js + Supabase)

## 🛠️ Tech Stack

| Layer         | Tech                             |
|---------------|----------------------------------|
| Frontend      | Next.js (TypeScript + CSS Modules) |
| Backend       | FastAPI (Python)                 |
| Database      | Supabase (PostgreSQL)            |
| AI Engine     | Gemini API (Google AI Studio)    |
| OAuth Support | GitHub (working), Linear, Zoho   |

## 📂 Project Structure

```
📦 backend
 ┣ 📂 app
 ┃ ┣ 📂 integrations
 ┃ ┃ ┗ 📜 github.py
 ┃ ┣ 📂 routes
 ┃ ┃ ┣ 📜 generate_report.py
 ┃ ┃ ┗ 📜 fetch_data.py
 ┃ ┣ 📂 gemini
 ┃ ┃ ┗ 📜 report_generator.py
 ┃ ┗ 📜 config.py
 ┣ 📜 main.py

📦 frontend (coming soon)
 ┣ 📂 pages
 ┣ 📂 components
 ┗ 📜 next.config.js
```

## 🔐 OAuth Setup

### GitHub

1. Go to: [https://github.com/settings/developers](https://github.com/settings/developers)
2. Register your OAuth App
   - Homepage: `http://localhost:3000`
   - Callback: `http://localhost:8000/callback/github`
3. Add `.env`:

```env
SUPABASE_URL=<your_supabase_url>
SUPABASE_KEY=<your_service_key>

GITHUB_CLIENT_ID=<your_github_client_id>
GITHUB_CLIENT_SECRET=<your_github_client_secret>
GITHUB_APP_CALLBACK_URL=http://localhost:8000/callback/github
```

## 🧪 Local Development

```bash
# Backend
cd backend
uvicorn app.main:app --reload

# Frontend (coming soon)
cd frontend
npm install
npm run dev
```

## 🧠 AI-Powered Reports Include

- 👨‍💻 Productivity, Efficiency, Expertise Scores
- 📈 Commits, Issues, PRs, Files per Repo
- ⚡ Criticality & Response Time Patterns
- 🌐 Language Usage + File Structure Insights

## 📌 TODOs

- [x] GitHub Integration
- [ ] Linear OAuth Integration
- [ ] Zoho API Integration
- [ ] AI Scoring Model
- [ ] Full Frontend Dashboard

## 🤝 Contributing

Contributions welcome! Please open issues and submit pull requests for suggestions, bug fixes, or new features.

## 📄 License

MIT License © 2025 Kishore B