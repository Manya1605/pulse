const axios = require('axios')
const cache = require('../config/cache')

const BASE = 'https://codeforces.com/api'

const getProfile = async (handle) => {
  const cached = cache.get('codeforces', handle)
  if (cached) return cached

  try {
    // 1. User info
    const { data: userResp } = await axios.get(`${BASE}/user.info?handles=${handle}`)
    if (userResp.status !== 'OK' || !userResp.result?.length) {
      const e = new Error(`Codeforces user not found: ${handle}`)
      e.status = 404
      throw e
    }
    const user = userResp.result[0]

    // 2. Rating history
    const { data: ratingResp } = await axios.get(`${BASE}/user.rating?handle=${handle}`)
    const ratingHistory = (ratingResp.result || []).map(r => ({
      date:        new Date(r.ratingUpdateTimeSeconds * 1000).toISOString().slice(0, 10),
      rating:      r.newRating,
      contestName: r.contestName,
    }))
    const contestHistory = [...ratingHistory]
      .reverse().slice(0, 10)
      .map(r => ({
        contestName:  r.contestName,
        rank:         r.rank || 0,
        ratingChange: r.ratingChange || 0,
        newRating:    r.rating,
        date:         new Date(r.date).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
      }))

    // 3. Submissions for solved count, rating buckets, tags
    const { data: subsResp } = await axios.get(`${BASE}/user.status?handle=${handle}&from=1&count=1000`)
    const solved = new Set()
    const byRating = {}
    const tagCounts = {}
    ;(subsResp.result || []).forEach(sub => {
      if (sub.verdict !== 'OK') return
      const key = `${sub.problem.contestId}-${sub.problem.index}`
      if (solved.has(key)) return
      solved.add(key)
      if (sub.problem.rating) {
        const bucket = ratingBucket(sub.problem.rating)
        byRating[bucket] = (byRating[bucket] || 0) + 1
      }
      ;(sub.problem.tags || []).forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1
      })
    })

    const sortedTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1]).slice(0, 10)
      .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {})

    const orderedByRating = {}
    ;['800-1000','1100-1300','1400-1600','1700-1900','2000+'].forEach(k => {
      if (byRating[k]) orderedByRating[k] = byRating[k]
    })

    const result = {
      handle, rating: user.rating || 0, maxRating: user.maxRating || 0,
      rank: user.rank || '', maxRank: user.maxRank || '',
      totalSolved: solved.size, contestsAttended: ratingHistory.length,
      ratingHistory, contestHistory,
      problemsByRating: orderedByRating,
      tagCounts: sortedTags,
    }

    cache.set('codeforces', handle, result)
    return result
  } catch (err) {
    if (err.status === 404) throw err
    const e = new Error(`Failed to fetch Codeforces data: ${err.message}`)
    e.isPlatformError = true
    throw e
  }
}

const ratingBucket = (r) => {
  if (r <= 1000) return '800-1000'
  if (r <= 1300) return '1100-1300'
  if (r <= 1600) return '1400-1600'
  if (r <= 1900) return '1700-1900'
  return '2000+'
}

module.exports = { getProfile }
