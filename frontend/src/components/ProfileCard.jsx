import React from 'react'
import { Users, GitFork, BookMarked, MapPin, Link2, Calendar, ExternalLink, Building2 } from 'lucide-react'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

export default function ProfileCard({ user, repoCount }) {
  return (
    <div className="glass rounded-2xl p-6 sm:p-7 animate-slide-up">
      <div className="flex flex-col sm:flex-row gap-5">
        <img
          src={user.avatar_url}
          alt={user.login}
          className="w-24 h-24 rounded-2xl object-cover border border-white/10 shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
            <h2 className="font-display font-bold text-xl sm:text-2xl text-white">
              {user.name || user.login}
            </h2>
            <span className="text-slate-500 text-sm">@{user.login}</span>
          </div>

          {user.bio && (
            <p className="mt-2 text-sm text-slate-300 leading-relaxed max-w-2xl">{user.bio}</p>
          )}

          <div className="mt-3.5 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-slate-400">
            <span className="flex items-center gap-1.5">
              <Users size={14} /> {user.followers.toLocaleString()} followers
            </span>
            <span className="flex items-center gap-1.5">
              <GitFork size={14} /> {user.following.toLocaleString()} following
            </span>
            <span className="flex items-center gap-1.5">
              <BookMarked size={14} /> {repoCount.toLocaleString()} repos
            </span>
          </div>

          <div className="mt-2.5 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-slate-500">
            {user.company && (
              <span className="flex items-center gap-1.5">
                <Building2 size={12} /> {user.company}
              </span>
            )}
            {user.location && (
              <span className="flex items-center gap-1.5">
                <MapPin size={12} /> {user.location}
              </span>
            )}
            {user.blog && (
              <a
                href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 transition-colors truncate max-w-[240px]"
              >
                <Link2 size={12} /> {user.blog}
              </a>
            )}
            <span className="flex items-center gap-1.5">
              <Calendar size={12} /> Joined {formatDate(user.created_at)}
            </span>
          </div>

          <a
            href={user.html_url}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors"
          >
            View on GitHub <ExternalLink size={13} />
          </a>
        </div>
      </div>
    </div>
  )
}
