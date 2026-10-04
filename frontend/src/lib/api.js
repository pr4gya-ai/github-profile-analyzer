// Client for the backend AI service. Falls back gracefully if the
// backend isn't running — the app should never hard-fail without it.

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

async function post(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`API_ERROR_${res.status}: ${text}`)
  }
  return res.json()
}

export async function getProfileFixes({ user, repos }) {
  return post('/api/ai/profile-fixes', { user, repos })
}

export async function getCareerInsights({ user, repos }) {
  return post('/api/ai/career-insights', { user, repos })
}
