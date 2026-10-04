// LocalStorage-backed recent-search history.

const KEY = 'gpa:recent-searches'
const MAX = 8

export function getRecentSearches() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function pushRecentSearch(entry) {
  try {
    const current = getRecentSearches().filter(
      (s) => s.login.toLowerCase() !== entry.login.toLowerCase()
    )
    const next = [entry, ...current].slice(0, MAX)
    localStorage.setItem(KEY, JSON.stringify(next))
    return next
  } catch {
    return getRecentSearches()
  }
}

export function clearRecentSearches() {
  try {
    localStorage.removeItem(KEY)
  } catch {
    /* no-op */
  }
}
