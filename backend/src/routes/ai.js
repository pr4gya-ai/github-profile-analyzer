import express from 'express'
import { buildProfileFixes, buildCareerInsights } from '../services/heuristics.js'
import { generateProfileFixesAI, generateCareerInsightsAI } from '../services/aiInsights.js'
 
const router = express.Router()
 
function hasAIKey() {
  return Boolean(process.env.GEMINI_API_KEY)
}
 
function validateBody(body) {
  if (!body || !body.user || !Array.isArray(body.repos)) {
    return 'Request body must include "user" and "repos".'
  }
  if (!body.user.login) {
    return '"user.login" is required.'
  }
  return null
}
 
router.post('/profile-fixes', async (req, res) => {
  const validationError = validateBody(req.body)
  if (validationError) return res.status(400).json({ error: validationError })
 
  const { user, repos } = req.body
 
  if (hasAIKey()) {
    try {
      const fixes = await generateProfileFixesAI({ user, repos })
      return res.json({ fixes, source: 'ai' })
    } catch (err) {
      console.error('[ai/profile-fixes] AI generation failed, falling back to heuristics:', err.message)
    }
  }
 
  const fixes = buildProfileFixes({ user, repos })
  res.json({ fixes, source: 'heuristic' })
})
 
router.post('/career-insights', async (req, res) => {
  const validationError = validateBody(req.body)
  if (validationError) return res.status(400).json({ error: validationError })
 
  const { user, repos } = req.body
 
  if (hasAIKey()) {
    try {
      const insights = await generateCareerInsightsAI({ user, repos })
      return res.json({ insights, source: 'ai' })
    } catch (err) {
      console.error('[ai/career-insights] AI generation failed, falling back to heuristics:', err.message)
    }
  }
 
  const insights = buildCareerInsights({ user, repos })
  res.json({ insights, source: 'heuristic' })
})
 
export default router
 