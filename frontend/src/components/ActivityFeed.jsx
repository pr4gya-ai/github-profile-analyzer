import React from 'react'
import {
  GitCommit,
  GitPullRequest,
  CircleDot,
  MessageSquare,
  FolderPlus,
  Star,
  GitFork,
  Rss,
  UserPlus,
  Activity,
} from 'lucide-react'
import { describeEvent } from '../lib/activity'

const ICONS = {
  PushEvent: { icon: GitCommit, color: 'text-blue-400' },
  PullRequestEvent: { icon: GitPullRequest, color: 'text-purple-400' },
  IssuesEvent: { icon: CircleDot, color: 'text-emerald-400' },
  IssueCommentEvent: { icon: MessageSquare, color: 'text-slate-400' },
  CreateEvent: { icon: FolderPlus, color: 'text-teal-400' },
  WatchEvent: { icon: Star, color: 'text-yellow-400' },
  ForkEvent: { icon: GitFork, color: 'text-orange-400' },
  ReleaseEvent: { icon: Rss, color: 'text-pink-400' },
  PullRequestReviewEvent: { icon: GitPullRequest, color: 'text-purple-400' },
  PullRequestReviewCommentEvent: { icon: MessageSquare, color: 'text-slate-400' },
  CommitCommentEvent: { icon: MessageSquare, color: 'text-slate-400' },
  MemberEvent: { icon: UserPlus, color: 'text-indigo-400' },
}

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  const months = Math.floor(days / 30)
  return `${months}mo ago`
}

export default function ActivityFeed({ events }) {
  const recent = events.slice(0, 12)

  return (
    <div className="glass rounded-2xl p-6 sm:p-7 animate-slide-up">
      <h3 className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Recent Activity</h3>

      {recent.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">No recent public activity found.</p>
      ) : (
        <ul className="mt-5 space-y-4">
          {recent.map((e) => {
            const { icon: Icon, color } = ICONS[e.type] || { icon: Activity, color: 'text-slate-400' }
            const { verb, repo } = describeEvent(e)
            return (
              <li key={e.id} className="flex items-start gap-3 text-sm">
                <span className={`mt-0.5 shrink-0 ${color}`}>
                  <Icon size={15} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-slate-300 leading-snug">
                    {verb}{' '}
                    <a
                      href={`https://github.com/${repo}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-slate-100 font-medium hover:text-blue-400 transition-colors break-all"
                    >
                      {repo}
                    </a>
                  </p>
                  <span className="text-[11px] text-slate-600">{timeAgo(e.created_at)}</span>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
