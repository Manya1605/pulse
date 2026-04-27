const axios = require('axios')
const cache = require('../config/cache')

const REST    = 'https://api.github.com'
const GRAPHQL = 'https://api.github.com/graphql'

const getHeaders = () => {
  const h = { Accept: 'application/vnd.github+json' }
  if (process.env.GITHUB_TOKEN) h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  return h
}

const getProfile = async (username) => {
  const cached = cache.get('github', username)
  if (cached) return cached

  try {
    const headers = getHeaders()

    // 1. User info
    const { data: user } = await axios.get(`${REST}/users/${username}`, { headers })

    // 2. Repos for stars, forks, language distribution
    const { data: repos } = await axios.get(
      `${REST}/users/${username}/repos?per_page=100&sort=updated`,
      { headers }
    )

    const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0)
    const totalForks = repos.reduce((sum, r) => sum + r.forks_count, 0)

    const topRepos = repos
      .filter(r => !r.fork)
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 4)
      .map(r => ({
        name: r.name, description: r.description,
        language: r.language, stars: r.stargazers_count,
        forks: r.forks_count, url: r.html_url
      }))

    // Language percent from repo language field
    const langCounts = {}
    repos.forEach(r => { if (r.language) langCounts[r.language] = (langCounts[r.language] || 0) + 1 })
    const total = Object.values(langCounts).reduce((a, b) => a + b, 0)
    const languagePercent = {}
    Object.entries(langCounts)
      .sort((a, b) => b[1] - a[1]).slice(0, 7)
      .forEach(([lang, count]) => {
        languagePercent[lang] = Math.round((count / total) * 1000) / 10
      })

    // 3. Contributions via GraphQL (only if token set)
    let totalContributions = 0, totalCommitContributions = 0, currentStreak = 0, longestStreak = 0
    let monthlyContributions = buildDefaultMonthly()
    let contributionCalendar = []
    let yearlyContributions = {}

    if (process.env.GITHUB_TOKEN) {
      try {
        const query = `query($login:String!){user(login:$login){contributionsCollection{totalCommitContributions contributionCalendar{totalContributions weeks{contributionDays{date contributionCount contributionLevel}}}}}}`
        const { data: gqlData } = await axios.post(GRAPHQL, {
          query,
          variables: { login: username }
        }, {
          headers: { ...headers, 'Content-Type': 'application/json' }
        })
        
        if (gqlData?.errors) {
          console.error('GraphQL errors:', gqlData.errors)
        }
        
        const colln = gqlData?.data?.user?.contributionsCollection
        const cal = colln?.contributionCalendar
        if (colln) {
          totalCommitContributions = colln.totalCommitContributions || 0
        }
        if (cal) {
          totalContributions = cal.totalContributions
          monthlyContributions = buildMonthly(cal.weeks)
          contributionCalendar = cal.weeks.map(w => ({
            days: w.contributionDays.map(d => ({
              date: d.date,
              count: d.contributionCount,
              level: levelFromString(d.contributionLevel)
            }))
          }))
          const streaks = calcStreaks(cal.weeks)
          currentStreak = streaks.current
          longestStreak = streaks.longest
          // Build yearly contributions map
          yearlyContributions = buildYearlyContributions(cal.weeks)
          console.log(`GitHub Data for ${username} - Years found:`, Object.keys(yearlyContributions))
        }
      } catch (e) { 
        console.error('GraphQL fetch error:', e.message)
      }
    } else {
      console.warn('GITHUB_TOKEN not set - contribution data will be limited')
    }

    const result = {
      username: user.login, name: user.name, bio: user.bio,
      avatarUrl: user.avatar_url,
      publicRepos: user.public_repos, totalStars, totalForks,
      followers: user.followers, following: user.following,
      totalContributions, totalCommitContributions, currentStreak, longestStreak,
      monthlyContributions, topRepos, languagePercent, contributionCalendar, yearlyContributions,
    }

    cache.set('github', username, result)
    return result
  } catch (err) {
    if (err.response?.status === 404) {
      const e = new Error(`GitHub user not found: ${username}`)
      e.status = 404
      throw e
    }
    const e = new Error(`Failed to fetch GitHub data: ${err.message}`)
    e.isPlatformError = true
    throw e
  }
}

// helpers
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

const buildDefaultMonthly = () =>
  MONTHS.map(month => ({ month, count: 0 }))

const buildMonthly = (weeks) => {
  const counts = new Array(12).fill(0)
  weeks.forEach(w => w.contributionDays.forEach(d => {
    if (d.date) counts[parseInt(d.date.slice(5, 7)) - 1] += d.contributionCount
  }))
  return MONTHS.map((month, i) => ({ month, count: counts[i] }))
}

const calcStreaks = (weeks) => {
  const days = []
  weeks.forEach(w => w.contributionDays.forEach(d => days.push(d.contributionCount)))
  let current = 0, longest = 0, streak = 0
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i] > 0) { streak++; if (current === 0) current = streak }
    else { longest = Math.max(longest, streak); if (current === 0) current = 0; streak = 0 }
  }
  return { current, longest: Math.max(longest, streak) }
}

const levelFromString = (s) =>
  ({ FIRST_QUARTILE: 1, SECOND_QUARTILE: 2, THIRD_QUARTILE: 3, FOURTH_QUARTILE: 4 }[s] || 0)

const buildYearlyContributions = (weeks) => {
  const yearly = {}
  weeks.forEach(w => {
    w.contributionDays.forEach(d => {
      if (d.date) {
        const year = d.date.slice(0, 4)
        if (!yearly[year]) yearly[year] = new Array(12).fill(0)
        const month = parseInt(d.date.slice(5, 7)) - 1
        yearly[year][month] += d.contributionCount
      }
    })
  })
  // Convert to monthly format for each year
  const result = {}
  Object.entries(yearly).forEach(([year, months]) => {
    result[year] = MONTHS.map((month, i) => ({ month, count: months[i] }))
  })
  return result
}

module.exports = { getProfile }
