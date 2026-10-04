# GitHub Profile Analyzer
 
Analyze any public GitHub profile for a resume-style score, contribution insights, and AI-powered career recommendations.
 
## Features
 
- 🔍 **Profile Search** — look up any public GitHub username
- 📊 **Resume Score** — automated scoring based on repos, activity, and profile completeness
- 🗂️ **Repo List & Top Languages** — breakdown of a user's most-used languages and notable repositories
- 🔥 **Contribution Heatmap & Trend** — visualize activity over time
- 📰 **Activity Feed** — recent public GitHub events
- 🤖 **AI Suggestions** — AI-generated profile fixes and career insights (via Google Gemini), with a built-in heuristic fallback when no API key is configured
- ⚖️ **Compare Mode** — compare two GitHub profiles side by side
- 📄 **PDF Export** — export analysis results as a PDF
## Tech Stack
 
**Frontend**
- React 18 + Vite
- Tailwind CSS
- Recharts (charts)
- Lucide React (icons)
- jsPDF (PDF export)
**Backend**
- Node.js + Express
- Google Gemini API (optional, for AI-generated insights)
- CORS + dotenv
## Project Structure
 
```
github-profile-analyzer/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   └── ai.js              # /api/ai/profile-fixes, /api/ai/career-insights
│   │   ├── services/
│   │   │   ├── aiInsights.js      # Gemini API integration
│   │   │   └── heuristics.js      # Rule-based fallback engine
│   │   └── server.js
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── components/            # UI components (ProfileCard, RepoList, charts, etc.)
    │   ├── hooks/
    │   ├── lib/                   # API calls, GitHub data fetching, scoring logic
    │   ├── App.jsx
    │   └── main.jsx
    └── .env.example
```
 
## Getting Started
 
### Prerequisites
- Node.js 18+
- A GitHub account (for API rate limits, optional but recommended)
- A free [Google Gemini API key](https://aistudio.google.com/apikey) (optional — enables AI-generated insights)
### 1. Clone the repository
```bash
git clone <your-repo-url>
cd github-profile-analyzer
```
 
### 2. Backend setup
```bash
cd backend
npm install
cp .env.example .env
```
Edit `.env` and optionally add your `GEMINI_API_KEY`. Without it, the app automatically falls back to a built-in heuristic engine — no AI key is required to run the project.
 
```bash
npm run dev
```
Backend runs at `http://localhost:5000`.
 
### 3. Frontend setup
```bash
cd ../frontend
npm install
cp .env.example .env
npm run dev
```
Frontend runs at `http://localhost:5173`.
 
## Environment Variables
 
**backend/.env**
| Variable | Required | Description |
|---|---|---|
| `PORT` | No | Backend server port (default: `5000`) |
| `GEMINI_API_KEY` | No | Enables AI-generated insights via Google Gemini. Falls back to heuristics if unset. |
| `GEMINI_MODEL` | No | Gemini model to use (default: `gemini-2.5-flash`) |
| `CORS_ORIGIN` | No | Allowed frontend origin (default: `http://localhost:5173`) |
 
**frontend/.env**
See `frontend/.env.example` for frontend-specific variables (e.g., API base URL, GitHub token for higher rate limits).
 
## API Endpoints
 
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Health check, reports whether AI is enabled |
| `POST` | `/api/ai/profile-fixes` | Returns AI or heuristic-generated profile improvement suggestions |
| `POST` | `/api/ai/career-insights` | Returns AI or heuristic-generated career insights |
 
Both AI endpoints expect a JSON body:
```json
{
  "user": { "login": "octocat", "bio": "...", "...": "..." },
  "repos": [ { "name": "...", "language": "...", "...": "..." } ]
}
```
 
## How the AI Fallback Works
 
The app is designed to work fully offline from any AI provider. If `GEMINI_API_KEY` is not set — or the Gemini API call fails for any reason (rate limit, no credits, network issue) — the backend automatically falls back to `heuristics.js`, a rule-based engine that generates comparable suggestions without calling any external AI service.
 
## Scripts
 
**Backend**
```bash
npm run dev     # start with file watching
npm start       # start without watching
```
 
**Frontend**
```bash
npm run dev       # start dev server
npm run build     # production build
npm run preview   # preview production build locally
```
 
## License
 
This project is open source and available for personal and educational use.
 
