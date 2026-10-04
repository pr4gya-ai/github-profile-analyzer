import React, { useCallback, useEffect, useState } from 'react'
import { AlertTriangle, Loader2, GitCompareArrows } from 'lucide-react'

import Header from './components/Header'
import SearchHero from './components/SearchHero'
import ProfileCard from './components/ProfileCard'
import ResumeScore from './components/ResumeScore'
import ContributionHeatmap from './components/ContributionHeatmap'
import TopLanguages from './components/TopLanguages'
import ContributionTrend from './components/ContributionTrend'
import ActivityFeed from './components/ActivityFeed'
import RepoList from './components/RepoList'
import ProfileFixer from './components/ProfileFixer'
import AISuggestions from './components/AISuggestions'
import CompareModal from './components/CompareModal'
import { ToastProvider, useToast } from './hooks/useToast'

import { fetchAllProfileData } from './lib/github'
import { getRecentSearches, pushRecentSearch, clearRecentSearches } from './lib/storage'
import { computeResumeScore } from './lib/score'
import { getProfileFixes, getCareerInsights } from './lib/api'
import { buildProfileFixesFallback, buildCareerInsightsFallback } from './lib/fixHeuristics'
import { exportProfilePdf } from './lib/pdfExport'

function AppInner() {
  const [data, setData] = useState(null) // { user, repos, events }
  const [scoreResult, setScoreResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [recent, setRecent] = useState(getRecentSearches())
  const [showCompare, setShowCompare] = useState(false)
  const [exporting, setExporting] = useState(false)

  const [fixes, setFixes] = useState(null)
  const [fixesLoading, setFixesLoading] = useState(false)
  const [insights, setInsights] = useState(null)
  const [insightsLoading, setInsightsLoading] = useState(false)

  const { toast } = useToast()

  const runSearch = useCallback(
    async (username) => {
      setLoading(true)
      setError(null)
      setFixes(null)
      setInsights(null)
      try {
        const result = await fetchAllProfileData(username)
        setData(result)
        setScoreResult(computeResumeScore(result))
        setRecent(pushRecentSearch({ login: result.user.login, avatar_url: result.user.avatar_url }))

        const params = new URLSearchParams(window.location.search)
        params.set('u', result.user.login)
        window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`)

        setFixesLoading(true)
        getProfileFixes({ user: result.user, repos: result.repos })
          .then((d) => setFixes(d.fixes))
          .catch(() => setFixes(buildProfileFixesFallback(result)))
          .finally(() => setFixesLoading(false))

        setInsightsLoading(true)
        getCareerInsights({ user: result.user, repos: result.repos })
          .then((d) => setInsights(d.insights))
          .catch(() => setInsights(buildCareerInsightsFallback(result)))
          .finally(() => setInsightsLoading(false))
      } catch (err) {
        setData(null)
        setScoreResult(null)
        if (err.message === 'NOT_FOUND') {
          setError(`We couldn't find a GitHub user called "${username}".`)
        } else if (err.message === 'RATE_LIMITED') {
          setError('GitHub API rate limit reached. Add a token in .env (VITE_GITHUB_TOKEN) or try again shortly.')
        } else {
          setError('Something went wrong while fetching this profile. Please try again.')
        }
      } finally {
        setLoading(false)
      }
    },
    []
  )

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const u = params.get('u')
    if (u) runSearch(u)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleLogoClick() {
    setData(null)
    setScoreResult(null)
    setError(null)
    window.history.replaceState({}, '', window.location.pathname)
  }

  function handleShare() {
    const url = window.location.href
    navigator.clipboard
      ?.writeText(url)
      .then(() => toast({ variant: 'success', title: 'Link copied', description: 'Shareable profile link copied to clipboard.' }))
      .catch(() => toast({ variant: 'error', title: 'Could not copy link' }))
  }

  async function handleExportPdf() {
    if (!data || !scoreResult) return
    setExporting(true)
    try {
      exportProfilePdf({
        user: data.user,
        repos: data.repos,
        scoreResult,
        fixes,
        insights,
      })
      toast({ variant: 'success', title: 'PDF downloaded', description: 'Your profile report has been saved.' })
    } catch (e) {
      toast({ variant: 'error', title: 'Export failed', description: 'Could not generate the PDF report.' })
    } finally {
      setExporting(false)
    }
  }

  const hasProfile = Boolean(data && scoreResult)

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        onLogoClick={handleLogoClick}
        showActions={hasProfile}
        onCompare={() => setShowCompare(true)}
        onShare={handleShare}
        onExportPdf={handleExportPdf}
        exporting={exporting}
      />

      {!hasProfile && (
        <SearchHero
          onSearch={runSearch}
          loading={loading}
          recentSearches={recent}
          onClearRecent={() => {
            clearRecentSearches()
            setRecent([])
          }}
        />
      )}

      {loading && !hasProfile && (
        <div className="flex-1 flex items-center justify-center pb-24">
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <Loader2 size={16} className="animate-spin" />
            Fetching profile data from GitHub…
          </div>
        </div>
      )}

      {error && !loading && (
        <div className="max-w-lg mx-auto px-4 -mt-4 pb-24 animate-fade-in">
          <div className="glass rounded-xl p-5 flex items-start gap-3 border-red-500/20">
            <AlertTriangle size={18} className="text-red-400 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-300">{error}</p>
          </div>
        </div>
      )}

      {hasProfile && (
        <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 space-y-6">
          <ProfileCard user={data.user} repoCount={data.repos.length} />

          <div className="grid lg:grid-cols-2 gap-6">
            <ResumeScore result={scoreResult} />
            <ContributionHeatmap events={data.events} />
          </div>

          <ContributionTrend events={data.events} />

          <div className="grid lg:grid-cols-2 gap-6">
            <TopLanguages repos={data.repos} />
            <ActivityFeed events={data.events} />
          </div>

          <RepoList repos={data.repos} />

          <ProfileFixer login={data.user.login} fixes={fixes} loading={fixesLoading} />

          <AISuggestions insights={insights} loading={insightsLoading} />

          <div className="sm:hidden flex gap-2 pb-4">
            <button
              onClick={() => setShowCompare(true)}
              className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium px-3 py-2.5 rounded-lg border border-white/10 text-slate-300"
            >
              <GitCompareArrows size={14} />
              Compare
            </button>
          </div>
        </main>
      )}

      {!hasProfile && !loading && (
        <footer className="mt-auto py-8 text-center text-xs text-slate-600">
          Built with the GitHub REST API · Not affiliated with GitHub, Inc.
        </footer>
      )}

      {showCompare && hasProfile && (
        <CompareModal baseData={data} onClose={() => setShowCompare(false)} />
      )}
    </div>
  )
}

export default function App() {
  return (
    <ToastProvider>
      <AppInner />
    </ToastProvider>
  )
}
