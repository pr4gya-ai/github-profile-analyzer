import React from 'react'
import { scoreLabel } from '../lib/score'

export default function ResumeScore({ result }) {
  const { total, categories } = result
  const { label, color } = scoreLabel(total)
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (total / 100) * circumference

  return (
    <div className="glass rounded-2xl p-6 sm:p-7 animate-slide-up">
      <h3 className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Resume Score</h3>

      <div className="mt-5 flex items-center gap-6">
        <div className="relative w-[132px] h-[132px] shrink-0">
          <svg viewBox="0 0 132 132" className="-rotate-90">
            <circle cx="66" cy="66" r={radius} fill="none" stroke="#1c212c" strokeWidth="11" />
            <circle
              cx="66"
              cy="66"
              r={radius}
              fill="none"
              stroke={color}
              strokeWidth="11"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display font-extrabold text-3xl text-white">{total}</span>
            <span className="text-[11px] text-slate-500 -mt-0.5">/ 100</span>
          </div>
        </div>
        <div>
          <span
            className="text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ backgroundColor: `${color}1f`, color }}
          >
            {label}
          </span>
          <p className="mt-2 text-xs text-slate-500 leading-relaxed max-w-[180px]">
            Based on repo quality, activity, docs, and community signals.
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-3.5">
        {categories.map((c) => (
          <div key={c.key}>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-300">{c.label}</span>
              <span className="text-slate-500 font-mono">
                {c.score}/{c.max}
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${(c.score / c.max) * 100}%`,
                  background:
                    c.score / c.max >= 0.7
                      ? 'linear-gradient(90deg,#22c55e,#4ade80)'
                      : c.score / c.max >= 0.4
                      ? 'linear-gradient(90deg,#eab308,#facc15)'
                      : 'linear-gradient(90deg,#ef4444,#f87171)',
                  transition: 'width 0.6s ease-out',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
