import React, { useMemo, useState } from 'react'
import { Search, Star, GitFork, ExternalLink, ArrowUpDown } from 'lucide-react'

const LANGUAGE_COLORS = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Java: '#b07219',
  'C++': '#f34b7d',
  Go: '#00ADD8',
  Rust: '#dea584',
  HTML: '#e34c26',
  CSS: '#563d7c',
}

const SORTS = [
  { key: 'stars', label: 'Stars' },
  { key: 'forks', label: 'Forks' },
  { key: 'recent', label: 'Recently updated' },
]

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

export default function RepoList({ repos }) {
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('recent')

  const filtered = useMemo(() => {
    let list = repos.filter((r) => r.name.toLowerCase().includes(query.toLowerCase()))
    if (sort === 'stars') list = [...list].sort((a, b) => b.stargazers_count - a.stargazers_count)
    if (sort === 'forks') list = [...list].sort((a, b) => b.forks_count - a.forks_count)
    if (sort === 'recent') list = [...list].sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))
    return list
  }, [repos, query, sort])

  return (
    <div className="glass rounded-2xl p-6 sm:p-7 animate-slide-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h3 className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
          Repositories ({repos.length})
        </h3>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search repos..."
              className="glass rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-slate-500 outline-none focus:border-blue-500/50 transition-colors w-[160px]"
            />
          </div>
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="appearance-none glass rounded-lg pl-3 pr-7 py-1.5 text-xs text-white outline-none focus:border-blue-500/50 transition-colors cursor-pointer"
            >
              {SORTS.map((s) => (
                <option key={s.key} value={s.key} className="bg-base-800">
                  {s.label}
                </option>
              ))}
            </select>
            <ArrowUpDown size={11} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="mt-5 grid sm:grid-cols-2 gap-3 max-h-[420px] overflow-y-auto pr-1">
        {filtered.length === 0 && (
          <p className="text-sm text-slate-500 col-span-2 py-6 text-center">No repositories match your search.</p>
        )}
        {filtered.map((r) => (
          <a
            key={r.id}
            href={r.html_url}
            target="_blank"
            rel="noreferrer"
            className="group rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10 p-4 transition-all"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="text-sm font-semibold text-slate-100 group-hover:text-blue-400 transition-colors truncate">
                {r.name}
              </span>
              <ExternalLink size={12} className="text-slate-600 shrink-0 mt-0.5" />
            </div>
            <p className="mt-1 text-xs text-slate-500 line-clamp-2 min-h-[2em]">
              {r.description || 'No description provided.'}
            </p>
            <div className="mt-3 flex items-center gap-3.5 text-[11px] text-slate-500">
              {r.language && (
                <span className="flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: LANGUAGE_COLORS[r.language] || '#64748b' }}
                  />
                  {r.language}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Star size={11} /> {r.stargazers_count}
              </span>
              <span className="flex items-center gap-1">
                <GitFork size={11} /> {r.forks_count}
              </span>
              <span className="ml-auto">{formatDate(r.pushed_at)}</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
