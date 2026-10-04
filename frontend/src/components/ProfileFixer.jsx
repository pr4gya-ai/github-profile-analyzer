import React, { useState } from 'react'
import { Wrench, Loader2, ExternalLink, CheckCircle2, Circle } from 'lucide-react'

const PRIORITY_STYLES = {
  high: 'bg-red-500/10 text-red-400 border-red-500/20',
  medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  low: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
}

const STORAGE_PREFIX = 'gpa:fixes-done:'

export default function ProfileFixer({ login, fixes, loading }) {
  const [done, setDone] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_PREFIX + login) || '{}')
    } catch {
      return {}
    }
  })

  function toggle(id) {
    setDone((prev) => {
      const next = { ...prev, [id]: !prev[id] }
      localStorage.setItem(STORAGE_PREFIX + login, JSON.stringify(next))
      return next
    })
  }

  return (
    <div className="glass rounded-2xl p-6 sm:p-7 animate-slide-up">
      <div className="flex items-center gap-2">
        <Wrench size={15} className="text-emerald-400" />
        <h3 className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
          Fix Your GitHub Profile
        </h3>
      </div>

      {loading || !fixes ? (
        <div className="mt-6 flex items-center gap-2 text-sm text-slate-500">
          <Loader2 size={15} className="animate-spin" /> Generating actionable fixes…
        </div>
      ) : fixes.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">
          Nice work — no high-impact fixes found for this profile right now.
        </p>
      ) : (
        <>
          <p className="mt-1.5 text-xs text-slate-500">
            {fixes.length} actionable fix{fixes.length === 1 ? '' : 'es'} found. Check them off as you go.
          </p>

          <div className="mt-4 space-y-3">
            {fixes.map((f) => (
              <div
                key={f.id}
                className={`rounded-xl border p-4 transition-all ${
                  done[f.id] ? 'border-white/5 bg-white/[0.01] opacity-50' : 'border-white/5 bg-white/[0.02]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggle(f.id)}
                    className="mt-0.5 shrink-0 text-slate-500 hover:text-emerald-400 transition-colors"
                    aria-label={done[f.id] ? 'Mark as not done' : 'Mark as done'}
                  >
                    {done[f.id] ? (
                      <CheckCircle2 size={18} className="text-emerald-400" />
                    ) : (
                      <Circle size={18} />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-sm font-semibold text-slate-100 ${done[f.id] ? 'line-through' : ''}`}
                      >
                        {f.title}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border uppercase tracking-wide ${PRIORITY_STYLES[f.priority] || PRIORITY_STYLES.low}`}
                      >
                        {f.priority} priority
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-400 leading-relaxed">{f.detail}</p>
                    <a
                      href={f.link}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors"
                    >
                      Fix it now <ExternalLink size={11} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
