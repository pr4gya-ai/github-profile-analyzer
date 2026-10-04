// Local, rule-based fallback used when the backend AI service is
// unreachable — keeps the dashboard useful offline / without an API key.

export function buildProfileFixesFallback({ user, repos }) {
  const fixes = []
  const noDescription = repos.filter((r) => !r.description || !r.description.trim())
  const noTopics = repos.filter((r) => !r.topics || r.topics.length === 0)
  const hasReadme = repos.some((r) => r.name.toLowerCase() === user.login.toLowerCase())
  const topStarred = [...repos].sort((a, b) => b.stargazers_count - a.stargazers_count)[0]

  if (noDescription.length > 0) {
    fixes.push({
      id: 'descriptions',
      title: 'Add descriptions to your repositories',
      priority: 'high',
      detail: `You have ${noDescription.length} repositories without descriptions; update them to help recruiters understand the purpose and tech stack of your projects immediately.`,
      link: `https://github.com/${user.login}?tab=repositories`,
    })
  }

  if (noTopics.length === repos.length && repos.length > 0) {
    fixes.push({
      id: 'topics',
      title: 'Add topics to your repositories',
      priority: 'high',
      detail: `None of your repositories have topics assigned. Adding keywords relevant to your stack will significantly improve your profile's discoverability in search results.`,
      link: `https://github.com/${user.login}?tab=repositories`,
    })
  }

  if (topStarred) {
    fixes.push({
      id: 'pin',
      title: 'Pin your best projects',
      priority: 'medium',
      detail: `You have relevant work like ${topStarred.name} — pinning your top projects ensures they're the first thing visitors see on your profile.`,
      link: `https://github.com/${user.login}`,
    })
  }

  if (!user.company || !user.twitter_username) {
    fixes.push({
      id: 'profile-info',
      title: 'Complete your profile information',
      priority: 'medium',
      detail: `Your profile is missing a company${!user.twitter_username ? ' and Twitter link' : ''}. Adding these details makes you appear more professional and provides recruiters with more ways to connect.`,
      link: `https://github.com/settings/profile`,
    })
  }

  if (!hasReadme) {
    fixes.push({
      id: 'profile-readme',
      title: 'Create a GitHub Profile README',
      priority: 'low',
      detail: `You currently lack a profile README. Create a file named '${user.login}' in a repository of the same name to showcase your skills, experience, and contact information effectively.`,
      link: `https://github.com/new?name=${user.login}`,
    })
  }

  return fixes
}

export function buildCareerInsightsFallback({ user, repos }) {
  const langCount = {}
  repos.forEach((r) => {
    if (r.language) langCount[r.language] = (langCount[r.language] || 0) + 1
  })
  const sortedLangs = Object.entries(langCount).sort((a, b) => b[1] - a[1])
  const strongest = sortedLangs[0]?.[0] || 'JavaScript'

  return {
    summary: `You have a solid foundation across ${sortedLangs.length || 1} language${sortedLangs.length === 1 ? '' : 's'}, but your profile could use more polish to stand out to hiring managers. Focusing on production-grade features, live deployments, and better documentation can significantly improve your chances of landing a developer role.`,
    strongestLanguage: {
      title: 'Strongest Language',
      body: `${strongest} is clearly your strongest language — your proficiency is evidenced by consistent usage across your repositories and your focus on real projects.`,
    },
    technologiesToLearn: {
      title: 'Technologies to Learn Next',
      body: `Consider a metaframework for server-side rendering, Docker for containerization, and a cloud platform like AWS or Vercel for deployment — these are consistently requested in job listings.`,
    },
    projectIdeas: {
      title: 'Project Ideas',
      body: `Build a real-time collaborative tool using WebSockets, a SaaS application featuring an integrated payment gateway, or a scalable dashboard that utilizes a third-party API with data visualization.`,
    },
    profileImprovements: {
      title: 'Profile Improvements',
      body: `Add a professional README file to your primary repositories with installation instructions and screenshots, use descriptive project descriptions in your bio, and pin your three most impressive projects to your profile page.`,
    },
    recruiterTips: {
      title: 'Recruiter Tips',
      body: `Ensure your READMEs highlight the specific problem your code solves, include a link to your live-deployed applications rather than just the source code, and add a clear link to your resume in your GitHub profile header.`,
    },
  }
}
