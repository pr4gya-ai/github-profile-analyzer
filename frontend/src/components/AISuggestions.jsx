import React from 'react'
import { Sparkles, Loader2 } from 'lucide-react'

export default function AISuggestions({ insights, loading }) {
  const sections = insights
    ? [
        insights.strongestLanguage,
        insights.technologiesToLearn,
        insights.projectIdeas,
        insights.profileImprovements,
        insights.recruiterTips,
      ].filter(Boolean)
    : []

  return (
    <div className="glass rounded-2xl p-6 sm:p-7 animate-slide-up">
      <div className="flex items-center gap-2">
        <Sparkles size={15} className="text-blue-400" />
        <h3 className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
          AI Insights &amp; Career Recommendations
        </h3>
      </div>

      {loading || !insights ? (
        <div className="mt-6 flex items-center gap-2 text-sm text-slate-500">
          <Loader2 size={15} className="animate-spin" /> Generating career insights…
        </div>
      ) : (
        <>
          <blockquote className="mt-4 border-l-2 border-blue-500/40 pl-4 text-sm italic text-slate-300 leading-relaxed">
            {insights.summary}
          </blockquote>

          <div className="mt-5 space-y-4">
            {sections.map((s) => (
              <div key={s.title}>
                <p className="text-xs font-semibold text-blue-400">{s.title}</p>
                <p className="mt-1 text-sm text-slate-300 leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
