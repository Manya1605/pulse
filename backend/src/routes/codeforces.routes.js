const router = require('express').Router()
const { protect } = require('../middleware/auth')
const { getProfile } = require('../services/codeforces.service')

router.use(protect)

router.get('/me', async (req, res, next) => {
  try {
    if (!req.user.codeforcesHandle)
      return res.status(404).json({ message: 'Codeforces handle not linked. Go to Settings.' })
    res.json(await getProfile(req.user.codeforcesHandle))
  } catch (err) { next(err) }
})

router.get('/:handle', async (req, res, next) => {
  try {
    res.json(await getProfile(req.params.handle))
  } catch (err) { next(err) }
})

module.exports = router
