import React, { useState } from 'react'
import { X, Search, Loader2, Trophy } from 'lucide-react'
import { fetchAllProfileData } from '../lib/github'
import { computeResumeScore } from '../lib/score'
import { useToast } from '../hooks/useToast'

function yearsOnGitHub(createdAt) {
  const years = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24 * 365)
  return Math.round(years * 10) / 10
}

function topLanguage(repos) {
  const counts = {}
  repos.forEach((r) => {
    if (r.language) counts[r.language] = (counts[r.language] || 0) + 1
  })
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1])
  return sorted[0]?.[0] || '—'
}

function buildMetrics({ user, repos, events }) {
  const score = computeResumeScore({ user, repos, events })
  const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0)
  return {
    login: user.login,
    avatar: user.avatar_url,
    name: user.name || user.login,
    score: score.total,
    followers: user.followers,
    repos: repos.length,
    stars: totalStars,
    years: yearsOnGitHub(user.created_at),
    language: topLanguage(repos),
  }
}

const ROWS = [
  { key: 'score', label: 'Resume Score', suffix: '/100' },
  { key: 'followers', label: 'Followers' },
  { key: 'repos', label: 'Repositories' },
  { key: 'stars', label: 'Total Stars' },
  { key: 'years', label: 'Years on GitHub', suffix: 'y' },
  { key: 'language', label: 'Top Language', isText: true },
]

export default function CompareModal({ baseData, onClose }) {
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [otherMetrics, setOtherMetrics] = useState(null)
  const { toast } = useToast()

  const baseMetrics = buildMetrics(baseData)

  async function handleCompare(e) {
    e.preventDefault()
    const trimmed = username.trim()
    if (!trimmed) return
    setLoading(true)
    try {
      const data = await fetchAllProfileData(trimmed)
      setOtherMetrics(buildMetrics(data))
    } catch (err) {
      toast({
        variant: 'error',
        title: 'Could not load profile',
        description: err.message === 'NOT_FOUND' ? `"${trimmed}" doesn't exist on GitHub.` : 'Please try again.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="glass-strong rounded-2xl w-full max-w-2xl my-8 p-6 sm:p-7 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-lg text-white">Compare Profiles</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {!otherMetrics ? (
          <form onSubmit={handleCompare} className="mt-5 flex items-center gap-2">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={`Compare @${baseMetrics.login} with...`}
                className="w-full glass rounded-lg pl-9 pr-3 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none focus:border-blue-500/50 transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !username.trim()}
              className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-semibold transition-all flex items-center gap-2"
            >
              {loading && <Loader2 size={14} className="animate-spin" />}
              Compare
            </button>
          </form>
        ) : (
          <>
            <div className="mt-6 grid grid-cols-2 gap-4">
              {[baseMetrics, otherMetrics].map((m) => (
                <div key={m.login} className="flex flex-col items-center text-center">
                  <img src={m.avatar} alt={m.login} className="w-14 h-14 rounded-xl border border-white/10" />
                  <p className="mt-2 text-sm font-semibold text-white truncate max-w-full">{m.name}</p>
                  <p className="text-xs text-slate-500">@{m.login}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-1">
              {ROWS.map((row) => {
                const a = baseMetrics[row.key]
                const b = otherMetrics[row.key]
                const aWins = !row.isText && a > b
                const bWins = !row.isText && b > a
                return (
                  <div key={row.key} className="grid grid-cols-[1fr,auto,1fr] items-center gap-3 py-2.5 border-b border-white/5 last:border-0">
                    <div
                      className={`text-right text-sm font-medium flex items-center justify-end gap-1.5 ${
                        aWins ? 'text-emerald-400' : 'text-slate-300'
                      }`}
                    >
                      {aWins && <Trophy size={12} />}
                      {a}
                      {row.suffix || ''}
                    </div>
                    <div className="text-[11px] text-slate-600 text-center px-2 whitespace-nowrap">{row.label}</div>
                    <div
                      className={`text-left text-sm font-medium flex items-center gap-1.5 ${
                        bWins ? 'text-emerald-400' : 'text-slate-300'
                      }`}
                    >
                      {b}
                      {row.suffix || ''}
                      {bWins && <Trophy size={12} />}
                    </div>
                  </div>
                )
              })}
            </div>

            <button
              onClick={() => setOtherMetrics(null)}
              className="mt-5 w-full py-2.5 rounded-lg border border-white/10 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-all"
            >
              Compare with someone else
            </button>
          </>
        )}
      </div>
    </div>
  )
}
