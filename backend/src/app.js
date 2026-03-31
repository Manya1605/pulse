const express = require('express')
const cors    = require('cors')
const helmet  = require('helmet')
const rateLimit = require('express-rate-limit')
const errorHandler = require('./middleware/errorHandler')

const app = express()

// Trust proxy - required for rate limiting behind reverse proxy
app.set('trust proxy', 1)

// Security
app.use(helmet())
app.use(express.json())

// CORS — allow origins from CORS_ORIGINS env var
const allowedOrigins = process.env.CORS_ORIGINS?.split(',') || [
  'http://localhost:3000',
  'http://localhost:5173', // Vite dev server
  'http://127.0.0.1:5173'
]
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) callback(null, true)
    else callback(new Error('Not allowed by CORS'))
  },
  credentials: true,
}))

// Rate limiting on auth routes only (increased for testing)
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 })

// Routes
app.use('/api/auth',       authLimiter, require('./routes/auth.routes'))
app.use('/api/user',       require('./routes/user.routes'))
app.use('/api/github',     require('./routes/github.routes'))
app.use('/api/leetcode',   require('./routes/leetcode.routes'))
app.use('/api/codeforces', require('./routes/codeforces.routes'))
app.use('/api/hackerrank', require('./routes/hackerrank.routes'))
app.use('/api/ai',         require('./routes/ai.routes'))

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'DevPulse API — OK' }))

// Error handler (must be last)
app.use(errorHandler)

module.exports = app
