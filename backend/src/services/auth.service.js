const jwt  = require('jsonwebtoken')
const User = require('../models/User')
const { generateVerificationToken, sendVerificationEmail } = require('./email.service')

// Generate tokens
const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { sub: userId, type: 'access' },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRY || '15m' }
  )
  const refreshToken = jwt.sign(
    { sub: userId, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d' }
  )
  return { accessToken, refreshToken }
}

// Build the auth response shape the frontend expects
const buildAuthResponse = (user, tokens) => ({
  accessToken:        tokens.accessToken,
  refreshToken:       tokens.refreshToken,
  username:           user.username,
  email:              user.email,
  displayName:        user.displayName || user.username,
  initials:           (user.displayName || user.username).slice(0, 2).toUpperCase(),
  githubUsername:     user.githubUsername || '',
  leetcodeUsername:   user.leetcodeUsername || '',
  codeforcesHandle:   user.codeforcesHandle || '',
  hackerrankUsername: user.hackerrankUsername || '',
})

const register = async ({ username, email, password, displayName }) => {
  // Mongoose unique index handles duplicates → errorHandler catches code 11000
  const user = await User.create({
    username,
    email,
    password,    // pre-save hook hashes it
    displayName: displayName || username,
    isEmailVerified: false,
  })
  
  // Generate verification token
  const verificationToken = generateVerificationToken()
  user.emailVerificationToken = verificationToken
  user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
  await user.save()
  
  // Try to send verification email (don't fail registration if email fails)
  let emailSent = false
  try {
    if (process.env.SMTP_HOST && process.env.SMTP_HOST !== 'smtp.example.com') {
      await sendVerificationEmail(user, verificationToken)
      emailSent = true
    }
  } catch (error) {
    console.error('Failed to send verification email:', error.message)
    // Continue registration even if email fails
  }
  
  const tokens = generateTokens(user._id)
  return {
    ...buildAuthResponse(user, tokens),
    message: emailSent 
      ? 'Registration successful! Please check your email to verify your account.'
      : 'Registration successful! Email verification is disabled. You can login directly.'
  }
}

const login = async ({ identifier, password }) => {
  // identifier is username OR email
  const user = await User.findOne({
    $or: [{ username: identifier }, { email: identifier }]
  }).select('+password')   // password excluded by default in toJSON

  if (!user) throw Object.assign(new Error('Invalid credentials'), { status: 401 })

  const valid = await user.comparePassword(password)
  if (!valid) throw Object.assign(new Error('Invalid credentials'), { status: 401 })

  // Check if email is verified (only if SMTP is configured)
  const smtpConfigured = process.env.SMTP_HOST && process.env.SMTP_HOST !== 'smtp.example.com'
  if (smtpConfigured && !user.isEmailVerified) {
    throw Object.assign(new Error('Please verify your email before logging in. Check your inbox for verification link.'), { status: 403 })
  }

  const tokens = generateTokens(user._id)
  return buildAuthResponse(user, tokens)
}

const refresh = async ({ refreshToken }) => {
  let decoded
  try {
    decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
  } catch {
    throw Object.assign(new Error('Invalid or expired refresh token'), { status: 401 })
  }

  const user = await User.findById(decoded.sub)
  if (!user) throw Object.assign(new Error('User not found'), { status: 401 })

  const tokens = generateTokens(user._id)
  // Return same refreshToken — only issue new accessToken
  return buildAuthResponse(user, { accessToken: tokens.accessToken, refreshToken })
}

module.exports = { register, login, refresh, generateTokens, buildAuthResponse }
