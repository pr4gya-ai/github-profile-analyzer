const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models'
 
function summarizeRepos(repos) {
  return repos.slice(0, 30).map((r) => ({
    name: r.name,
    description: r.description,
    language: r.language,
    stars: r.stargazers_count,
    forks: r.forks_count,
    topics: r.topics,
    updated_at: r.pushed_at,
  }))
}
 
async function callGemini({ system, prompt }) {
  const apiKey = process.env.GEMINI_API_KEY
  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash'
 
  const url = `${GEMINI_API_BASE}/${model}:generateContent?key=${apiKey}`
 
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: system }],
      },
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1500,
        responseMimeType: 'application/json',
      },
    }),
  })
 
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Gemini API error ${res.status}: ${text}`)
  }
 
  const data = await res.json()
  const textBlock = data.candidates?.[0]?.content?.parts?.find((p) => p.text)
  if (!textBlock) throw new Error('No text content returned by Gemini API')
 
  const cleaned = textBlock.text.replace(/```json\s*|```/g, '').trim()
  return JSON.parse(cleaned)
}
 
export async function generateProfileFixesAI({ user, repos }) {
  const system =
    'You are a senior technical recruiter reviewing a GitHub profile. ' +
    'Respond ONLY with valid JSON (no markdown fences, no preamble) matching exactly: ' +
    '{"fixes": [{"id": string, "title": string, "priority": "high"|"medium"|"low", "detail": string, "link": string}]}. ' +
    'Return between 3 and 6 fixes, ordered by priority (high first). Detail should be 1-2 concrete sentences. ' +
    `Use "https://github.com/${user.login}" style links where relevant.`
 
  const prompt = `GitHub profile data:\n${JSON.stringify(
    {
      login: user.login,
      bio: user.bio,
      company: user.company,
      location: user.location,
      blog: user.blog,
      twitter_username: user.twitter_username,
      followers: user.followers,
      public_repos: user.public_repos,
      repos: summarizeRepos(repos),
    },
    null,
    2
  )}`
 
  const result = await callGemini({ system, prompt })
  if (!Array.isArray(result.fixes)) throw new Error('Malformed AI response: fixes missing')
  return result.fixes
}
 
export async function generateCareerInsightsAI({ user, repos }) {
  const system =
    'You are an experienced engineering manager giving a junior developer career advice based on their GitHub profile. ' +
    'Respond ONLY with valid JSON (no markdown fences, no preamble) matching exactly: ' +
    '{"summary": string, "strongestLanguage": {"title": string, "body": string}, ' +
    '"technologiesToLearn": {"title": string, "body": string}, "projectIdeas": {"title": string, "body": string}, ' +
    '"profileImprovements": {"title": string, "body": string}, "recruiterTips": {"title": string, "body": string}}. ' +
    'Keep each "body" to 1-3 sentences, specific and encouraging but honest.'
 
  const prompt = `GitHub profile data:\n${JSON.stringify(
    {
      login: user.login,
      bio: user.bio,
      followers: user.followers,
      public_repos: user.public_repos,
      repos: summarizeRepos(repos),
    },
    null,
    2
  )}`
 
  return callGemini({ system, prompt })
}
 