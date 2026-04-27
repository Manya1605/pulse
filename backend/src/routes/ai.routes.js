const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { analyzeDeveloperProfile, analyzeByUsernames, getSkillRecommendations } = require('../services/ai.service');
const AIAnalysis = require('../models/AIAnalysis');

router.use(protect);

// POST /api/ai/analyze-username — search any usernames and get live AI analysis + save to DB
router.post('/analyze-username', async (req, res, next) => {
  try {
    const { github, leetcode, codeforces, hackerrank } = req.body;
    if (!github && !leetcode && !codeforces && !hackerrank) {
      return res.status(400).json({ message: 'Provide at least one platform username.' });
    }
    const result = await analyzeByUsernames({ github, leetcode, codeforces, hackerrank });
    
    // Save analysis to MongoDB
    const analysisRecord = new AIAnalysis({
      userId: req.user._id,
      username: github || leetcode || codeforces || hackerrank || 'Developer',
      platforms: {
        github: !!github,
        leetcode: !!leetcode,
        codeforces: !!codeforces,
        hackerrank: !!hackerrank,
      },
      platformStats: {
        github: result.platforms?.github || null,
        leetcode: result.platforms?.leetcode || null,
        codeforces: result.platforms?.codeforces || null,
        hackerrank: result.platforms?.hackerrank || null,
      },
      analysis: result.analysis,
      model: result.model,
      tags: [github ? 'github' : null, leetcode ? 'leetcode' : null, codeforces ? 'codeforces' : null, hackerrank ? 'hackerrank' : null].filter(Boolean),
    });
    
    await analysisRecord.save();
    
    res.json({ ...result, analysisId: analysisRecord._id });
  } catch (err) {
    next(err);
  }
});


// POST /api/ai/analyze - Get AI analysis of developer profile + save to DB
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
    
    // Save analysis to MongoDB
    const analysisRecord = new AIAnalysis({
      userId: req.user._id,
      username: req.user.username,
      platforms: {
        github: !!userData.github,
        leetcode: !!userData.leetcode,
        codeforces: !!userData.codeforces,
        hackerrank: !!userData.hackerrank,
      },
      platformStats: {
        github: userData.github,
        leetcode: userData.leetcode,
        codeforces: userData.codeforces,
        hackerrank: userData.hackerrank,
      },
      analysis: analysis.analysis,
      model: analysis.model,
      tags: ['self-analysis'].concat(
        [userData.github ? 'github' : null, userData.leetcode ? 'leetcode' : null, userData.codeforces ? 'codeforces' : null, userData.hackerrank ? 'hackerrank' : null].filter(Boolean)
      ),
    });
    
    await analysisRecord.save();
    
    res.json({ ...analysis, analysisId: analysisRecord._id });
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

// GET /api/ai/history - Get all past analyses for logged-in user
router.get('/history', async (req, res, next) => {
  try {
    const analyses = await AIAnalysis.find({ userId: req.user._id })
      .select('username analysis platforms createdAt tags')
      .sort({ createdAt: -1 })
      .limit(20);
    
    res.json(analyses);
  } catch (err) {
    next(err);
  }
});

// GET /api/ai/analysis/:id - Get specific analysis by ID
router.get('/analysis/:id', async (req, res, next) => {
  try {
    const analysis = await AIAnalysis.findById(req.params.id);
    
    if (!analysis) {
      return res.status(404).json({ message: 'Analysis not found' });
    }
    
    // Check if user owns this analysis
    if (analysis.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this analysis' });
    }
    
    res.json(analysis);
  } catch (err) {
    next(err);
  }
});

// GET /api/ai/history - Get all past analyses for logged-in user
router.get('/history', async (req, res, next) => {
  try {
    const analyses = await AIAnalysis.find({ userId: req.user._id })
      .select('username analysis platforms createdAt tags')
      .sort({ createdAt: -1 })
      .limit(20);
    
    res.json(analyses);
  } catch (err) {
    next(err);
  }
});

// GET /api/ai/analysis/:id - Get specific analysis by ID
router.get('/analysis/:id', async (req, res, next) => {
  try {
    const analysis = await AIAnalysis.findById(req.params.id);
    
    if (!analysis) {
      return res.status(404).json({ message: 'Analysis not found' });
    }
    
    // Check if user owns this analysis
    if (analysis.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this analysis' });
    }
    
    res.json(analysis);
  } catch (err) {
    next(err);
  }
});

module.exports = router;