const router = require('express').Router()
const { protect } = require('../middleware/auth')
const User = require('../models/User')

// All user routes require JWT
router.use(protect)

// GET /api/user/profile
router.get('/profile', async (req, res) => {
  res.json(profileResponse(req.user))
})

// PUT /api/user/profile — update profile fields
router.put('/profile', async (req, res, next) => {
  try {
    const allowedFields = ['displayName', 'phone', 'bio', 'location', 'website']
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        req.user[field] = req.body[field]
      }
    })
    await req.user.save()
    res.json(profileResponse(req.user))
  } catch (err) { next(err) }
})

// PUT /api/user/platforms — save platform usernames from SettingsPage
router.put('/platforms', async (req, res, next) => {
  try {
    const fields = ['githubUsername', 'leetcodeUsername', 'codeforcesHandle', 'hackerrankUsername']
    fields.forEach(f => {
      if (req.body[f] !== undefined) req.user[f] = req.body[f]
    })
    await req.user.save()
    res.json(profileResponse(req.user))
  } catch (err) { next(err) }
})

// DELETE /api/user/account
router.delete('/account', async (req, res, next) => {
  try {
    await req.user.deleteOne()
    res.status(204).end()
  } catch (err) { next(err) }
})

// Helper: build UserProfileResponse shape frontend expects
const profileResponse = (user) => ({
  id:                 user._id,
  username:           user.username,
  email:              user.email,
  displayName:        user.displayName || user.username,
  initials:           (user.displayName || user.username).slice(0, 2).toUpperCase(),
  phone:              user.phone || '',
  bio:                user.bio || '',
  location:           user.location || '',
  website:            user.website || '',
  githubUsername:     user.githubUsername || '',
  leetcodeUsername:   user.leetcodeUsername || '',
  codeforcesHandle:   user.codeforcesHandle || '',
  hackerrankUsername: user.hackerrankUsername || '',
  createdAt:          user.createdAt,
  lastSyncAt:         user.updatedAt,
})

module.exports = router
