const axios = require('axios')
const cache = require('../config/cache')

const BASE = 'https://www.hackerrank.com/rest'
const headers = { 'User-Agent': 'Mozilla/5.0 DevPulse/1.0', 'Accept': 'application/json' }

const getProfile = async (username) => {
  const cached = cache.get('hackerrank', username)
  if (cached) return cached

  try {
    // Profile
    const { data: profileData } = await axios.get(
      `${BASE}/contests/master/hackers/${username}/profile`, { headers }
    )
    const model = profileData?.model || {}
    const hackerScore  = model.score || 0
    const totalSolved  = model.solved_challenges || 0
    const stars        = model.stars || 0

    // Badges
    let badgeList = [], domainStars = [], badgeCount = 0
    try {
      const { data: badgesData } = await axios.get(`${BASE}/hackers/${username}/badges`, { headers })
      ;(badgesData?.models || []).forEach(b => {
        const level = b.stars >= 5 ? 'Gold' : b.stars >= 3 ? 'Silver' : 'Bronze'
        badgeList.push({ name: b.badge_name, stars: b.stars, level, domain: b.domain })
        domainStars.push({ domain: b.badge_name, stars: b.stars })
      })
      badgeCount = badgeList.length
    } catch { /* badges endpoint may fail, continue */ }

    // Certificates
    let certificates = 0
    try {
      const { data: certData } = await axios.get(`${BASE}/hackers/${username}/certificates`, { headers })
      certificates = (certData?.models || []).length
    } catch { /* continue */ }

    const rank = hackerScore >= 5000 ? 'Top 1%'
               : hackerScore >= 3000 ? 'Top 5%'
               : hackerScore >= 2000 ? 'Top 10%'
               : hackerScore >= 1000 ? 'Top 25%'
               : 'Top 50%'

    const result = {
      username, hackerScore, totalSolved,
      badges: badgeCount, stars, certificates, rank,
      badgeList, domainStars, skillScores: {},
    }

    cache.set('hackerrank', username, result)
    return result
  } catch (err) {
    if (err.response?.status === 404) {
      const e = new Error(`HackerRank user not found: ${username}`)
      e.status = 404
      throw e
    }
    const e = new Error(`Failed to fetch HackerRank data: ${err.message}`)
    e.isPlatformError = true
    throw e
  }
}

module.exports = { getProfile }
