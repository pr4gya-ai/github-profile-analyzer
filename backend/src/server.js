import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import aiRoutes from './routes/ai.js'
 
const app = express()
const PORT = process.env.PORT || 5000
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim())
 
app.use(
  cors({
    origin: allowedOrigins,
  })
)
app.use(express.json({ limit: '1mb' }))
 
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    aiEnabled: Boolean(process.env.GEMINI_API_KEY),
  })
})
 
app.use('/api/ai', aiRoutes)
 
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' })
})
 
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
})
 
app.listen(PORT, () => {
  console.log(`Profile Analyzer backend listening on http://localhost:${PORT}`)
  console.log(`AI insights: ${process.env.GEMINI_API_KEY ? 'enabled (Gemini API)' : 'heuristic fallback (no GEMINI_API_KEY set)'}`)
})