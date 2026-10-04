// Thin wrapper around the GitHub REST API.
// Uses an optional token from VITE_GITHUB_TOKEN to raise the rate limit.

const GITHUB_API = 'https://api.github.com'
const token = import.meta.env.VITE_GITHUB_TOKEN

function headers() {
  const h = { Accept: 'application/vnd.github+json' }
  if (token) h.Authorization = `Bearer ${token}`
  return h
}

async function ghFetch(path) {
  const res = await fetch(`${GITHUB_API}${path}`, { headers: headers() })
  if (res.status === 404) {
    throw new Error('NOT_FOUND')
  }
  if (res.status === 403) {
    const remaining = res.headers.get('x-ratelimit-remaining')
    if (remaining === '0') throw new Error('RATE_LIMITED')
    throw new Error('FORBIDDEN')
  }
  if (!res.ok) {
    throw new Error(`GITHUB_ERROR_${res.status}`)
  }
  return res.json()
}

export async function fetchUser(username) {
  return ghFetch(`/users/${encodeURIComponent(username)}`)
}

export async function fetchRepos(username) {
  const repos = await ghFetch(
    `/users/${encodeURIComponent(username)}/repos?per_page=100&sort=pushed&type=owner`
  )
  return repos.filter((r) => !r.fork)
}

export async function fetchEvents(username) {
  try {
    return await ghFetch(`/users/${encodeURIComponent(username)}/events/public?per_page=100`)
  } catch (e) {
    return []
  }
}

export async function fetchAllProfileData(username) {
  const [user, repos, events] = await Promise.all([
    fetchUser(username),
    fetchRepos(username),
    fetchEvents(username),
  ])
  return { user, repos, events }
}
