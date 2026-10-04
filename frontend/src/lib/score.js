// Resume-score engine: turns raw GitHub data into a weighted 0-100 score
// broken into categories, mirroring what a recruiter skims for in 30 seconds.

const WEIGHTS = {
  repoQuality: 25,
  contributionActivity: 20,
  readmeDescriptions: 15,
  profileCompleteness: 15,
  languageDiversity: 10,
  communityEngagement: 15,
}

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n))
}

function scoreRepoQuality(repos) {
  if (repos.length === 0) return 0
  const withStars = repos.filter((r) => r.stargazers_count > 0).length
  const withDescription = repos.filter((r) => r.description && r.description.trim()).length
  const withTopics = repos.filter((r) => r.topics && r.topics.length > 0).length
  const recentlyActive = repos.filter((r) => {
    const months = (Date.now() - new Date(r.pushed_at).getTime()) / (1000 * 60 * 60 * 24 * 30)
    return months <= 6
  }).length

  const ratio =
    (withStars / repos.length) * 0.35 +
    (withDescription / repos.length) * 0.3 +
    (withTopics / repos.length) * 0.15 +
    (recentlyActive / repos.length) * 0.2

  return clamp(Math.round(ratio * WEIGHTS.repoQuality), 0, WEIGHTS.repoQuality)
}

function scoreContributionActivity(events) {
  if (events.length === 0) return 0
  const weeks = new Set()
  const now = Date.now()
  events.forEach((e) => {
    const d = new Date(e.created_at).getTime()
    const weeksAgo = Math.floor((now - d) / (1000 * 60 * 60 * 24 * 7))
    if (weeksAgo <= 20) weeks.add(weeksAgo)
  })
  const pushEvents = events.filter((e) => e.type === 'PushEvent').length
  const activeRatio = weeks.size / 20
  const volumeRatio = clamp(pushEvents / 30, 0, 1)
  const combined = activeRatio * 0.65 + volumeRatio * 0.35
  return clamp(Math.round(combined * WEIGHTS.contributionActivity), 0, WEIGHTS.contributionActivity)
}

function scoreReadmeDescriptions(repos, user) {
  if (repos.length === 0) return 0
  const withDescription = repos.filter((r) => r.description && r.description.trim()).length
  const descRatio = withDescription / repos.length
  const hasProfileReadme = repos.some(
    (r) => r.name.toLowerCase() === user.login.toLowerCase()
  )
  const readmeScore = hasProfileReadme ? 1 : 0
  const combined = descRatio * 0.7 + readmeScore * 0.3
  return clamp(Math.round(combined * WEIGHTS.readmeDescriptions), 0, WEIGHTS.readmeDescriptions)
}

function scoreProfileCompleteness(user) {
  const fields = [user.bio, user.company, user.location, user.blog, user.twitter_username]
  const filled = fields.filter((f) => f && String(f).trim()).length
  const ratio = filled / fields.length
  return clamp(Math.round(ratio * WEIGHTS.profileCompleteness), 0, WEIGHTS.profileCompleteness)
}

function scoreLanguageDiversity(repos) {
  const langs = new Set(repos.map((r) => r.language).filter(Boolean))
  const ratio = clamp(langs.size / 6, 0, 1)
  return clamp(Math.round(ratio * WEIGHTS.languageDiversity), 0, WEIGHTS.languageDiversity)
}

function scoreCommunityEngagement(user, repos) {
  const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0)
  const followerRatio = clamp(user.followers / 50, 0, 1)
  const starRatio = clamp(totalStars / 50, 0, 1)
  const combined = followerRatio * 0.5 + starRatio * 0.5
  return clamp(Math.round(combined * WEIGHTS.communityEngagement), 0, WEIGHTS.communityEngagement)
}

export function computeResumeScore({ user, repos, events }) {
  const categories = [
    {
      key: 'repoQuality',
      label: 'Repository Quality',
      score: scoreRepoQuality(repos),
      max: WEIGHTS.repoQuality,
    },
    {
      key: 'contributionActivity',
      label: 'Contribution Activity',
      score: scoreContributionActivity(events),
      max: WEIGHTS.contributionActivity,
    },
    {
      key: 'readmeDescriptions',
      label: 'README & Descriptions',
      score: scoreReadmeDescriptions(repos, user),
      max: WEIGHTS.readmeDescriptions,
    },
    {
      key: 'profileCompleteness',
      label: 'Profile Completeness',
      score: scoreProfileCompleteness(user),
      max: WEIGHTS.profileCompleteness,
    },
    {
      key: 'languageDiversity',
      label: 'Language Diversity',
      score: scoreLanguageDiversity(repos),
      max: WEIGHTS.languageDiversity,
    },
    {
      key: 'communityEngagement',
      label: 'Community Engagement',
      score: scoreCommunityEngagement(user, repos),
      max: WEIGHTS.communityEngagement,
    },
  ]

  const total = categories.reduce((sum, c) => sum + c.score, 0)
  return { total: clamp(total, 0, 100), categories }
}

export function scoreLabel(total) {
  if (total >= 85) return { label: 'Excellent', color: '#22c55e' }
  if (total >= 70) return { label: 'Strong', color: '#4ade80' }
  if (total >= 50) return { label: 'Developing', color: '#eab308' }
  if (total >= 30) return { label: 'Needs Work', color: '#f97316' }
  return { label: 'Getting Started', color: '#ef4444' }
}
