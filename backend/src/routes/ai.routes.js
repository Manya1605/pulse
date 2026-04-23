const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { analyzeDeveloperProfile, analyzeByUsernames, getSkillRecommendations } = require('../services/ai.service');

router.use(protect);

// POST /api/ai/analyze-username — search any usernames and get live AI analysis
router.post('/analyze-username', async (req, res, next) => {
  try {
    const { github, leetcode, codeforces, hackerrank } = req.body;
    if (!github && !leetcode && !codeforces && !hackerrank) {
      return res.status(400).json({ message: 'Provide at least one platform username.' });
    }
    const result = await analyzeByUsernames({ github, leetcode, codeforces, hackerrank });
    res.json(result);
  } catch (err) {
    next(err);
  }
});


// POST /api/ai/analyze - Get AI analysis of developer profile
router.post('/analyze', async (req, res, next) => {
  try {
    // Fetch all platform data
    const userData = {
      username: req.user.username,
      github: null,
      leetcode: null,
      codeforces: null,
      hackerrank: null,
    };

    // Try to fetch data from each platform
    try {
      if (req.user.githubUsername) {
        const githubService = require('../services/github.service');
        userData.github = await githubService.getProfile(req.user.githubUsername);
      }
    } catch (e) { /* ignore */ }

    try {
      if (req.user.leetcodeUsername) {
        const leetcodeService = require('../services/leetcode.service');
        userData.leetcode = await leetcodeService.getProfile(req.user.leetcodeUsername);
      }
    } catch (e) { /* ignore */ }

    try {
      if (req.user.codeforcesHandle) {
        const codeforcesService = require('../services/codeforces.service');
        userData.codeforces = await codeforcesService.getProfile(req.user.codeforcesHandle);
      }
    } catch (e) { /* ignore */ }

    try {
      if (req.user.hackerrankUsername) {
        const hackerrankService = require('../services/hackerrank.service');
        userData.hackerrank = await hackerrankService.getProfile(req.user.hackerrankUsername);
      }
    } catch (e) { /* ignore */ }

    const analysis = await analyzeDeveloperProfile(userData);
    res.json(analysis);
  } catch (err) {
    next(err);
  }
});

// POST /api/ai/skills - Get skill recommendations
router.post('/skills', async (req, res, next) => {
  try {
    const userData = {
      username: req.user.username,
      github: null,
      leetcode: null,
      codeforces: null,
    };

    // Fetch platform data
    try {
      if (req.user.githubUsername) {
        const githubService = require('../services/github.service');
        userData.github = await githubService.getProfile(req.user.githubUsername);
      }
    } catch (e) { /* ignore */ }

    try {
      if (req.user.leetcodeUsername) {
        const leetcodeService = require('../services/leetcode.service');
        userData.leetcode = await leetcodeService.getProfile(req.user.leetcodeUsername);
      }
    } catch (e) { /* ignore */ }

    try {
      if (req.user.codeforcesHandle) {
        const codeforcesService = require('../services/codeforces.service');
        userData.codeforces = await codeforcesService.getProfile(req.user.codeforcesHandle);
      }
    } catch (e) { /* ignore */ }

    const recommendations = await getSkillRecommendations(userData);
    res.json(recommendations);
  } catch (err) {
    next(err);
  }
});

module.exports = router;