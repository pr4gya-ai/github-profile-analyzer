# GitHub Profile Analyzer

A dark-themed, glassmorphism dashboard that analyzes any public GitHub profile:
resume scoring, contribution insights, and AI-powered career recommendations.

## Structure

```
github-profile-analyzer/
├── frontend/   React (Vite) + Tailwind CSS dashboard
└── backend/    Express API for AI-generated profile fixes & career insights
```

## Quick start

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
npm start
```

Runs on `http://localhost:5000` by default.

The `/api/ai/*` routes work out of the box with no configuration — they use a
rule-based heuristic engine. To get real AI-generated insights instead, add
an Anthropic API key to `backend/.env`:

```
ANTHROPIC_API_KEY=sk-ant-...
```

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Runs on `http://localhost:5173`. Open it in your browser and search any
GitHub username.

Optional: add a GitHub personal access token to `frontend/.env` to raise the
GitHub API rate limit from 60 requests/hour to 5,000/hour:

```
VITE_GITHUB_TOKEN=ghp_...
```

(No scopes are required — it's only used for public read requests.)

## Features

- Profile search with recent-search history (LocalStorage)
- Profile card — avatar, bio, followers/following, company, location, links
- Resume score — weighted circular gauge with category breakdown
- Contribution heatmap — 20-week activity grid
- Monthly contribution trend — 12-month area chart with consistency metrics
  (consistency %, active months, longest streak, peak month)
- Top languages — color-coded progress bars
- Recent activity feed — mapped GitHub event types with icons
- Repository list — searchable, sortable by stars/forks/recency
- Compare Profiles — side-by-side comparison with per-metric winners highlighted
- ProfileFixer — AI-generated, prioritized actionable fixes with completion tracking
- AISuggestions — AI-powered career advice based on repo quality & language mix
- Share — copyable link with `?u=` param, auto-loads the profile on visit
- PDF export — full profile report download (jsPDF)

## Tech stack

- **Frontend:** React (Vite), Tailwind CSS, lucide-react, recharts, jsPDF
- **Backend:** Node.js, Express, optional Anthropic API integration
- **Data source:** GitHub REST API (public, unauthenticated by default)

## Notes

- All GitHub data comes directly from the public REST API on the client —
  no GitHub credentials ever touch the backend.
- The backend's only job is generating the AI insights server-side, so any
  API key stays off the client.
- If the backend isn't running, the frontend automatically falls back to a
  local heuristic version of the same insights so the app still works.
