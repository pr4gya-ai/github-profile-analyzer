import React, { useMemo } from 'react'

const LANGUAGE_COLORS = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  'C#': '#178600',
  Go: '#00ADD8',
  Rust: '#dea584',
  Ruby: '#701516',
  PHP: '#4F5D95',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Shell: '#89e051',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  Vue: '#41b883',
  Jupyter: '#DA5B0B',
  'Jupyter Notebook': '#DA5B0B',
}

function colorFor(lang) {
  return LANGUAGE_COLORS[lang] || '#64748b'
}

export default function TopLanguages({ repos }) {
  const languages = useMemo(() => {
    const counts = {}
    repos.forEach((r) => {
      if (r.language) counts[r.language] = (counts[r.language] || 0) + 1
    })
    const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count, pct: Math.round((count / total) * 100) }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6)
  }, [repos])

  return (
    <div className="glass rounded-2xl p-6 sm:p-7 animate-slide-up">
      <h3 className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Top Languages</h3>

      {languages.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">No language data available.</p>
      ) : (
        <div className="mt-5 space-y-4">
          {languages.map((l) => (
            <div key={l.name}>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="flex items-center gap-2 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colorFor(l.name) }} />
                  {l.name}
                </span>
                <span className="text-slate-500 font-mono">{l.pct}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${l.pct}%`,
                    backgroundColor: colorFor(l.name),
                    transition: 'width 0.6s ease-out',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
