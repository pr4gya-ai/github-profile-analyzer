import React, { useState } from 'react'
import { Search, Loader2, Clock, X } from 'lucide-react'

export default function SearchHero({ onSearch, loading, recentSearches, onClearRecent }) {
  const [value, setValue] = useState('')

  function submit(e) {
    e?.preventDefault()
    const trimmed = value.trim()
    if (!trimmed) return
    onSearch(trimmed)
  }

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-20 sm:pt-28 pb-16 text-center animate-fade-in">
      <h1 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl tracking-tight leading-[1.05]">
        Analyze Any{' '}
        <span className="bg-gradient-to-r from-blue-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent">
          GitHub Profile
        </span>
      </h1>
      <p className="mt-5 text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
        Get instant insights into repository quality, contribution activity, language stats, and
        AI-powered career recommendations.
      </p>

      <form onSubmit={submit} className="mt-9 flex flex-col sm:flex-row items-center gap-3 justify-center">
        <div className="relative w-full sm:w-[420px]">
          <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter GitHub username..."
            className="w-full glass rounded-xl pl-11 pr-4 py-3.5 text-sm text-white placeholder:text-slate-500 outline-none focus:border-blue-500/50 transition-colors"
            autoFocus
          />
        </div>
        <button
          type="submit"
          disabled={loading || !value.trim()}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all shadow-glow flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : null}
          {loading ? 'Analyzing…' : 'Analyze'}
        </button>
      </form>

      {recentSearches.length > 0 && (
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 animate-fade-in">
          <span className="flex items-center gap-1.5 text-xs text-slate-500">
            <Clock size={12} />
            Recent:
          </span>
          {recentSearches.map((s) => (
            <button
              key={s.login}
              onClick={() => onSearch(s.login)}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-white/10 text-slate-300 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all"
            >
              <img src={s.avatar_url} alt="" className="w-4 h-4 rounded-full" />
              {s.login}
            </button>
          ))}
          <button
            onClick={onClearRecent}
            className="flex items-center gap-1 text-xs px-2 py-1.5 text-slate-600 hover:text-slate-400 transition-colors"
            aria-label="Clear recent searches"
          >
            <X size={12} />
          </button>
        </div>
      )}
    </section>
  )
}
