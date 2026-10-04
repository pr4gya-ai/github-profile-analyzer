import React from 'react'
import { Github, GitCompareArrows, Share2, Download, Loader2 } from 'lucide-react'

export default function Header({ onLogoClick, showActions, onCompare, onShare, onExportPdf, exporting }) {
  return (
    <header className="sticky top-0 z-40 glass-strong border-b border-white/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <button
          onClick={onLogoClick}
          className="flex items-center gap-2.5 group"
        >
          <Github size={22} className="text-white group-hover:text-blue-400 transition-colors" />
          <span className="font-display font-bold text-[15px] sm:text-base tracking-tight text-white">
            Profile Analyzer
          </span>
        </button>

        {showActions && (
          <div className="flex items-center gap-2">
            <button
              onClick={onCompare}
              className="hidden sm:flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg border border-white/10 text-slate-300 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all"
            >
              <GitCompareArrows size={14} />
              Compare
            </button>
            <button
              onClick={onShare}
              className="hidden sm:flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg border border-white/10 text-slate-300 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all"
            >
              <Share2 size={14} />
              Share
            </button>
            <button
              onClick={onExportPdf}
              disabled={exporting}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white transition-all"
            >
              {exporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
              PDF
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
