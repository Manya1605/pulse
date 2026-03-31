const router  = require('express').Router()
const { protect } = require('../middleware/auth')
const { getProfile } = require('../services/github.service')

router.use(protect)

// GET /api/github/me — frontend useMyGitHub() hook calls this
router.get('/me', async (req, res, next) => {
  try {
    if (!req.user.githubUsername) {
      return res.status(404).json({ message: 'GitHub username not linked. Go to Settings.' })
    }
    const data = await getProfile(req.user.githubUsername)
    res.json(data)
  } catch (err) { next(err) }
})

// GET /api/github/:username
router.get('/:username', async (req, res, next) => {
  try {
    const data = await getProfile(req.params.username)
    res.json(data)
  } catch (err) { next(err) }
})

module.exports = router
