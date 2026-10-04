import React, { useMemo } from 'react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { TrendingUp, Flame, CalendarCheck, Trophy } from 'lucide-react'
import { buildMonthlyTrend, computeConsistencyMetrics } from '../lib/activity'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="glass-strong rounded-lg px-3 py-2 text-xs">
      <p className="text-slate-400">{label}</p>
      <p className="text-white font-semibold mt-0.5">{payload[0].value} contributions</p>
    </div>
  )
}

export default function ContributionTrend({ events }) {
  const monthly = useMemo(() => buildMonthlyTrend(events, 12), [events])
  const metrics = useMemo(() => computeConsistencyMetrics(monthly), [monthly])

  const stats = [
    { icon: TrendingUp, label: 'Consistency', value: `${metrics.consistency}%` },
    { icon: CalendarCheck, label: 'Active Months', value: `${metrics.activeMonths}/12` },
    { icon: Flame, label: 'Longest Streak', value: `${metrics.longestStreak} mo` },
    { icon: Trophy, label: 'Peak Month', value: metrics.peakMonth },
  ]

  return (
    <div className="glass rounded-2xl p-6 sm:p-7 animate-slide-up">
      <h3 className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
        Monthly Contribution Trend
      </h3>

      <div className="mt-5 h-[220px] -ml-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={monthly} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.45} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1c212c" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: '#64748b', fontSize: 11 }}
              axisLine={{ stroke: '#232733' }}
              tickLine={false}
            />
            <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} width={28} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="contributions"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#trendGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
            <s.icon size={14} className="text-blue-400" />
            <p className="mt-1.5 text-base font-display font-bold text-white">{s.value}</p>
            <p className="text-[11px] text-slate-500">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
