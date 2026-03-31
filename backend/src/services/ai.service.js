const { GoogleGenerativeAI } = require('@google/generative-ai');

let genAI = null;

// Initialize Gemini AI
const initializeGemini = () => {
  if (!process.env.GEMINI_API_KEY) {
    console.warn('GEMINI_API_KEY not set. AI analysis will be disabled.');
    return null;
  }
  try {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    return genAI;
  } catch (error) {
    console.error('Failed to initialize Gemini AI:', error);
    return null;
  }
};

// Analyze developer profile
const analyzeDeveloperProfile = async (userData) => {
  if (!genAI) {
    genAI = initializeGemini();
  }

  if (!genAI) {
    throw new Error('Gemini AI is not configured. Please set GEMINI_API_KEY environment variable.');
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `
You are an expert developer career advisor. Analyze this developer's profile and provide insights.

**Developer Profile:**
- Username: ${userData.username}
- GitHub: ${userData.github?.totalContributions || 0} contributions, ${userData.github?.publicRepos || 0} repos, ${userData.github?.totalStars || 0} stars
- LeetCode: ${userData.leetcode?.totalSolved || 0} problems solved (Easy: ${userData.leetcode?.easySolved || 0}, Medium: ${userData.leetcode?.mediumSolved || 0}, Hard: ${userData.leetcode?.hardSolved || 0}), Contest Rating: ${userData.leetcode?.contestRating || 0}
- Codeforces: Rating ${userData.codeforces?.rating || 0}, ${userData.codeforces?.totalSolved || 0} problems solved, Rank: ${userData.codeforces?.rank || 'Unrated'}
- HackerRank: Score ${userData.hackerrank?.hackerScore || 0}, ${userData.hackerrank?.badges || 0} badges

Provide a comprehensive analysis in the following format:

## Overall Assessment
[Brief overview of their profile strength]

## Strengths
- [List 3-4 key strengths]

## Areas for Improvement
- [List 3-4 areas to work on]

## Career Recommendations
- [Specific roles/companies that match their profile]

## Next Steps
- [Actionable items to improve their profile]

Keep the tone encouraging and professional. Be specific and actionable.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analysis = response.text();

    return {
      analysis,
      generatedAt: new Date().toISOString(),
      model: 'gemini-pro'
    };
  } catch (error) {
    console.error('Gemini AI analysis error:', error);
    throw new Error(`Failed to generate AI analysis: ${error.message}`);
  }
};

// Get skill recommendations
const getSkillRecommendations = async (userData) => {
  if (!genAI) {
    genAI = initializeGemini();
  }

  if (!genAI) {
    throw new Error('Gemini AI is not configured.');
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const languages = userData.github?.languagePercent || {};
    const topLanguages = Object.keys(languages).slice(0, 5).join(', ');

    const prompt = `
Based on this developer's current skills:
- Primary Languages: ${topLanguages || 'Not specified'}
- GitHub Activity: ${userData.github?.totalContributions || 0} contributions
- LeetCode Problems: ${userData.leetcode?.totalSolved || 0} solved
- Codeforces Rating: ${userData.codeforces?.rating || 0}

Recommend 5 specific skills or technologies they should learn next to:
1. Complement their existing skills
2. Stay relevant in 2024
3. Increase their market value

Format:
## Skill 1: [Name]
**Why:** [Brief explanation]
**Resources:** [1-2 learning resources]

[Repeat for 5 skills]
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const recommendations = response.text();

    return {
      recommendations,
      generatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Skill recommendations error:', error);
    throw new Error(`Failed to generate recommendations: ${error.message}`);
  }
};

module.exports = {
  analyzeDeveloperProfile,
  getSkillRecommendations,
};