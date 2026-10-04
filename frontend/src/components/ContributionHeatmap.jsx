import React from 'react'
import { buildWeeklyHeatmap } from '../lib/activity'

function levelFor(count, max) {
  if (count === 0) return 0
  if (max <= 1) return 2
  const ratio = count / max
  if (ratio > 0.75) return 4
  if (ratio > 0.5) return 3
  if (ratio > 0.2) return 2
  return 1
}

const LEVEL_COLORS = ['#161b24', '#0e4429', '#186636', '#2ea043', '#4ade80']

export default function ContributionHeatmap({ events }) {
  const weeks = buildWeeklyHeatmap(events, 20)
  const max = Math.max(1, ...weeks.map((w) => w.count))

  // Lay out as a 4-column x 5-row grid (20 weeks), matching the compact
  // reference layout rather than a full year grid.
  const cols = 4
  const rows = Math.ceil(weeks.length / cols)
  const grid = Array.from({ length: rows }, (_, r) =>
    weeks.slice(r * cols, r * cols + cols)
  )

  return (
    <div className="glass rounded-2xl p-6 sm:p-7 animate-slide-up">
      <h3 className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
        Contribution Activity
      </h3>

      <div className="mt-6 flex justify-center">
        <div className="flex flex-col gap-1.5">
          {grid.map((row, ri) => (
            <div key={ri} className="flex gap-1.5">
              {row.map((w, ci) => (
                <div
                  key={ci}
                  title={`${w.count} contribution${w.count === 1 ? '' : 's'}`}
                  className="w-3.5 h-3.5 rounded-sm"
                  style={{ backgroundColor: LEVEL_COLORS[levelFor(w.count, max)] }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-1.5 text-[11px] text-slate-500">
        <span>Less</span>
        {LEVEL_COLORS.map((c) => (
          <span key={c} className="w-3 h-3 rounded-sm" style={{ backgroundColor: c }} />
        ))}
        <span>More</span>
      </div>

      <p className="mt-4 text-xs text-slate-500">
        Based on recent public GitHub events (approximate, 20-week window)
      </p>
    </div>
  )
}
