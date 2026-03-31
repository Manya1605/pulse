const router = require('express').Router()
const { body, validationResult } = require('express-validator')
const { register, login, refresh } = require('../services/auth.service')
const { generateVerificationToken, sendVerificationEmail } = require('../services/email.service')
const User = require('../models/User')

const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg })
  }
  next()
}

// POST /api/auth/register
router.post('/register',
  [
    body('username').trim().isLength({ min: 3, max: 50 }).withMessage('Username must be 3-50 characters'),
    body('email').isEmail().normalizeEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const result = await register(req.body)
      res.status(201).json(result)
    } catch (err) { next(err) }
  }
)

// POST /api/auth/login
router.post('/login',
  async (req, res, next) => {
    try {
      const result = await login(req.body)
      res.json(result)
    } catch (err) { next(err) }
  }
)

// POST /api/auth/refresh
router.post('/refresh',
  async (req, res, next) => {
    try {
      const result = await refresh(req.body)
      res.json(result)
    } catch (err) { next(err) }
  }
)

// GET /api/auth/verify-email
router.get('/verify-email',
  async (req, res, next) => {
    try {
      const { token } = req.query
      
      if (!token) {
        return res.status(400).json({ message: 'Verification token is required' })
      }

      const user = await User.findOne({
        emailVerificationToken: token,
        emailVerificationExpires: { $gt: Date.now() }
      })

      if (!user) {
        return res.status(400).json({ message: 'Invalid or expired verification token' })
      }

      user.isEmailVerified = true
      user.emailVerificationToken = undefined
      user.emailVerificationExpires = undefined
      await user.save()

      res.json({ 
        message: 'Email verified successfully! You can now login.',
        verified: true 
      })
    } catch (err) { next(err) }
  }
)

// POST /api/auth/resend-verification
router.post('/resend-verification',
  [
    body('email').isEmail().normalizeEmail().withMessage('Invalid email'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { email } = req.body
      
      const user = await User.findOne({ email })
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }

      if (user.isEmailVerified) {
        return res.status(400).json({ message: 'Email is already verified' })
      }

      // Generate new token
      const verificationToken = generateVerificationToken()
      user.emailVerificationToken = verificationToken
      user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000)
      await user.save()

      // Send email
      await sendVerificationEmail(user, verificationToken)

      res.json({ message: 'Verification email sent successfully' })
    } catch (err) { next(err) }
  }
)

module.exports = router
