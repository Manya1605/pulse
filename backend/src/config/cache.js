const NodeCache = require('node-cache')

// One cache instance per platform, TTL from env vars
const caches = {
  github:      new NodeCache({ stdTTL: parseInt(process.env.CACHE_GITHUB_TTL)     || 900  }),
  leetcode:    new NodeCache({ stdTTL: parseInt(process.env.CACHE_LEETCODE_TTL)   || 900  }),
  codeforces:  new NodeCache({ stdTTL: parseInt(process.env.CACHE_CODEFORCES_TTL) || 600  }),
  hackerrank:  new NodeCache({ stdTTL: parseInt(process.env.CACHE_HACKERRANK_TTL) || 1800 }),
  profile:     new NodeCache({ stdTTL: parseInt(process.env.CACHE_PROFILE_TTL)    || 300  }),
}

// get(platform, key) → cached value or undefined
const get = (platform, key) => caches[platform]?.get(key)

// set(platform, key, value) → stores in cache
const set = (platform, key, value) => caches[platform]?.set(key, value)

module.exports = { get, set }
