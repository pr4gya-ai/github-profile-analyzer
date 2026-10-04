// Turns raw GitHub public events into the shapes the heatmap and
// monthly trend chart need.

const CONTRIBUTION_EVENT_TYPES = new Set([
  'PushEvent',
  'PullRequestEvent',
  'IssuesEvent',
  'IssueCommentEvent',
  'CreateEvent',
  'PullRequestReviewEvent',
  'PullRequestReviewCommentEvent',
  'CommitCommentEvent',
])

function eventWeight(event) {
  if (event.type === 'PushEvent') {
    return event.payload?.commits?.length || 1
  }
  return 1
}

export function buildWeeklyHeatmap(events, weekCount = 20) {
  const now = new Date()
  const weeks = Array.from({ length: weekCount }, (_, i) => {
    const weeksAgo = weekCount - 1 - i
    return { weeksAgo, count: 0 }
  })

  events.forEach((e) => {
    if (!CONTRIBUTION_EVENT_TYPES.has(e.type)) return
    const created = new Date(e.created_at)
    const diffMs = now.getTime() - created.getTime()
    const weeksAgo = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7))
    if (weeksAgo >= 0 && weeksAgo < weekCount) {
      const idx = weekCount - 1 - weeksAgo
      weeks[idx].count += eventWeight(e)
    }
  })

  return weeks
}

export function buildMonthlyTrend(events, monthCount = 12) {
  const now = new Date()
  const buckets = []
  for (let i = monthCount - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    buckets.push({
      key: `${d.getFullYear()}-${d.getMonth()}`,
      label: d.toLocaleDateString('en-US', { month: 'short' }),
      year: d.getFullYear(),
      contributions: 0,
    })
  }
  const bucketMap = new Map(buckets.map((b) => [b.key, b]))

  events.forEach((e) => {
    if (!CONTRIBUTION_EVENT_TYPES.has(e.type)) return
    const d = new Date(e.created_at)
    const key = `${d.getFullYear()}-${d.getMonth()}`
    const bucket = bucketMap.get(key)
    if (bucket) bucket.contributions += eventWeight(e)
  })

  return buckets
}

export function computeConsistencyMetrics(monthlyTrend) {
  const activeMonths = monthlyTrend.filter((m) => m.contributions > 0).length
  const consistency = Math.round((activeMonths / monthlyTrend.length) * 100)

  let longestStreak = 0
  let current = 0
  monthlyTrend.forEach((m) => {
    if (m.contributions > 0) {
      current += 1
      longestStreak = Math.max(longestStreak, current)
    } else {
      current = 0
    }
  })

  const peak = monthlyTrend.reduce(
    (max, m) => (m.contributions > max.contributions ? m : max),
    monthlyTrend[0] || { contributions: 0, label: '—' }
  )

  return {
    consistency,
    activeMonths,
    longestStreak,
    peakMonth: peak.contributions > 0 ? `${peak.label} ${peak.year}` : '—',
  }
}

const ACTIVITY_LABELS = {
  PushEvent: (e) => `Pushed ${e.payload?.commits?.length || 1} commit(s) to`,
  PullRequestEvent: (e) => `${e.payload?.action === 'opened' ? 'Opened' : e.payload?.action === 'closed' ? 'Closed' : 'Updated'} a pull request in`,
  IssuesEvent: (e) => `${e.payload?.action === 'opened' ? 'Opened' : 'Updated'} an issue in`,
  IssueCommentEvent: () => 'Commented on an issue in',
  CreateEvent: (e) => `Created ${e.payload?.ref_type || 'a ref'} in`,
  DeleteEvent: (e) => `Deleted ${e.payload?.ref_type || 'a ref'} in`,
  WatchEvent: () => 'Starred',
  ForkEvent: () => 'Forked',
  PublicEvent: () => 'Made public',
  ReleaseEvent: () => 'Published a release in',
  PullRequestReviewEvent: () => 'Reviewed a pull request in',
  PullRequestReviewCommentEvent: () => 'Commented on a pull request in',
  CommitCommentEvent: () => 'Commented on a commit in',
  MemberEvent: () => 'Added a collaborator to',
}

export function describeEvent(event) {
  const fn = ACTIVITY_LABELS[event.type]
  const verb = fn ? fn(event) : `Interacted with (${event.type.replace('Event', '')})`
  return { verb, repo: event.repo?.name || 'a repository' }
}
