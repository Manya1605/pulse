// Build the analysis prompt
const buildPrompt = (userData) => `
You are an expert developer career advisor. Analyze this developer's multi-platform coding profile and give deep, personalized insights.

Developer Profile:
- Name/Handle: ${userData.username || 'Unknown'}
- GitHub (${userData.githubUsername || 'not linked'}): ${userData.github?.totalContributions || 0} contributions, ${userData.github?.publicRepos || 0} repos, ${userData.github?.totalStars || 0} stars, ${userData.github?.followers || 0} followers, streak: ${userData.github?.currentStreak || 0} days
- LeetCode (${userData.leetcodeUsername || 'not linked'}): ${userData.leetcode?.totalSolved || 0} problems solved (Easy: ${userData.leetcode?.easySolved || 0}, Medium: ${userData.leetcode?.mediumSolved || 0}, Hard: ${userData.leetcode?.hardSolved || 0}), Contest Rating: ${userData.leetcode?.contestRating || 'N/A'}
- Codeforces (${userData.codeforcesHandle || 'not linked'}): Rating ${userData.codeforces?.rating || 0}, Rank: ${userData.codeforces?.rank || 'Unrated'}, ${userData.codeforces?.totalSolved || 0} problems solved
- HackerRank (${userData.hackerrankUsername || 'not linked'}): Score ${userData.hackerrank?.hackerScore || 0}, ${userData.hackerrank?.badges || 0} badges

Please provide a comprehensive analysis in this format:

**Overall Assessment**
[2-3 sentence snapshot of their overall developer profile strength]

**Strengths**
- [Strength 1 with specific evidence from the data]
- [Strength 2]
- [Strength 3]

**Areas for Improvement**
- [Area 1 with a concrete action step]
- [Area 2]
- [Area 3]

**Career Recommendations**
- [Specific roles/companies that match their profile based on their stats]

**Next 30-Day Action Plan**
- [3 specific, actionable goals they can hit in 30 days]

**Hidden Pattern**
[One surprising or interesting insight from their combined data across platforms]

Keep the tone encouraging, specific, and actionable. Reference actual numbers from their stats.
`;

// Call Ollama cloud API via direct fetch
const callOllama = async (prompt) => {
  const host = process.env.OLLAMA_HOST || 'http://localhost:11434';
  const apiKey = process.env.OLLAMA_API_KEY || '';
  const model = process.env.OLLAMA_MODEL || 'mistral';

  const headers = {
    'Content-Type': 'application/json',
  };

  // Add API key as Bearer token if provided (for cloud APIs)
  if (apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }

  try {
    const response = await fetch(`${host}/api/chat`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: 'You are an expert developer career advisor who gives specific, data-driven insights.' },
          { role: 'user', content: prompt },
        ],
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Ollama API error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return data.message?.content || 'No analysis generated.';
  } catch (error) {
    console.error('Ollama API call error:', error);
    throw error;
  }
};

// Analyze developer profile from saved user data (used by /api/ai/analyze)
const analyzeDeveloperProfile = async (userData) => {
  try {
    const analysis = await callOllama(buildPrompt(userData));
    return { analysis, generatedAt: new Date().toISOString(), model: process.env.OLLAMA_MODEL || 'mistral' };
  } catch (error) {
    console.error('Ollama analysis error:', error);
    throw new Error(`Failed to generate AI analysis: ${error.message}`);
  }
};

// Analyze by explicit usernames — fetches live platform data (used by search box)
const analyzeByUsernames = async ({ github, leetcode, codeforces, hackerrank }) => {
  const userData = {
    username:           github || leetcode || codeforces || hackerrank || 'Developer',
    githubUsername:     github     || '',
    leetcodeUsername:   leetcode   || '',
    codeforcesHandle:   codeforces || '',
    hackerrankUsername: hackerrank || '',
    github:     null,
    leetcode:   null,
    codeforces: null,
    hackerrank: null,
  };

  // Fetch live data from all platforms in parallel
  const [ghResult, lcResult, cfResult, hrResult] = await Promise.allSettled([
    github     ? require('./github.service').getProfile(github)         : Promise.resolve(null),
    leetcode   ? require('./leetcode.service').getProfile(leetcode)     : Promise.resolve(null),
    codeforces ? require('./codeforces.service').getProfile(codeforces) : Promise.resolve(null),
    hackerrank ? require('./hackerrank.service').getProfile(hackerrank) : Promise.resolve(null),
  ]);

  if (ghResult.status === 'fulfilled') userData.github     = ghResult.value;
  if (lcResult.status === 'fulfilled') userData.leetcode   = lcResult.value;
  if (cfResult.status === 'fulfilled') userData.codeforces = cfResult.value;
  if (hrResult.status === 'fulfilled') userData.hackerrank = hrResult.value;

  try {
    const analysis = await callOllama(buildPrompt(userData));
    return {
      analysis,
      generatedAt: new Date().toISOString(),
      model: process.env.OLLAMA_MODEL || 'mistral',
      platforms: {
        github:     userData.github     ? 'loaded' : (github     ? 'failed' : 'not provided'),
        leetcode:   userData.leetcode   ? 'loaded' : (leetcode   ? 'failed' : 'not provided'),
        codeforces: userData.codeforces ? 'loaded' : (codeforces ? 'failed' : 'not provided'),
        hackerrank: userData.hackerrank ? 'loaded' : (hackerrank ? 'failed' : 'not provided'),
      },
    };
  } catch (error) {
    console.error('Ollama analyzeByUsernames error:', error);
    throw new Error(`Failed to generate AI analysis: ${error.message}`);
  }
};

// Get skill recommendations
const getSkillRecommendations = async (userData) => {
  const languages = userData.github?.languagePercent || {};
  const topLanguages = Object.keys(languages).slice(0, 5).join(', ');

  const prompt = `
Based on this developer's skills:
- Primary Languages: ${topLanguages || 'Not specified'}
- GitHub Activity: ${userData.github?.totalContributions || 0} contributions
- LeetCode Problems: ${userData.leetcode?.totalSolved || 0} solved
- Codeforces Rating: ${userData.codeforces?.rating || 0}

Recommend 5 specific skills or technologies they should learn next to complement their existing skills, stay relevant, and increase market value.

Format each as:
## Skill N: [Name]
**Why:** [Brief explanation]
**Resources:** [1-2 learning resources]
`;

  try {
    const recommendations = await callOllama(prompt);
    return { recommendations, generatedAt: new Date().toISOString() };
  } catch (error) {
    console.error('Skill recommendations error:', error);
    throw new Error(`Failed to generate recommendations: ${error.message}`);
  }
};

module.exports = { analyzeDeveloperProfile, analyzeByUsernames, getSkillRecommendations };