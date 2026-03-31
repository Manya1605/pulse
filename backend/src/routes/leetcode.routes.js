const router = require('express').Router()
const { protect } = require('../middleware/auth')
const { getProfile } = require('../services/leetcode.service')

router.use(protect)

router.get('/me', async (req, res, next) => {
  try {
    if (!req.user.leetcodeUsername)
      return res.status(404).json({ message: 'LeetCode username not linked. Go to Settings.' })
    res.json(await getProfile(req.user.leetcodeUsername))
  } catch (err) { next(err) }
})

router.get('/:username', async (req, res, next) => {
  try {
    res.json(await getProfile(req.params.username))
  } catch (err) { next(err) }
})

module.exports = router
