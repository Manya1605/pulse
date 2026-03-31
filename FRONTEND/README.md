# DevPulse — Developer Dashboard

A full-featured developer dashboard built with React + Vite. Track your GitHub, LeetCode, Codeforces, and HackerRank stats in one place.

## Project Structure

```
devpulse-app/
├── index.html                    ← Entry point (loads Chart.js CDN)
├── vite.config.js
├── package.json
└── src/
    ├── main.jsx                  ← React root mount
    ├── App.jsx                   ← Root router (auth → welcome → dashboard)
    ├── styles/
    │   └── globals.css           ← All CSS variables, components, animations
    ├── store/
    │   └── AppContext.jsx        ← Global state, mock data, context provider
    ├── components/
    │   └── shared.jsx            ← Charts, Sidebar, UserMenu, ContribGrid, etc.
    └── pages/
        ├── LoginPage.jsx         ← Sign in form
        ├── RegisterPage.jsx      ← Create account form
        ├── WelcomePage.jsx       ← Post-login landing (full-screen, no sidebar)
        ├── DashboardPage.jsx     ← Main all-in-one dashboard
        ├── GitHubPage.jsx        ← GitHub deep-dive
        ├── LeetCodePage.jsx      ← LeetCode stats + contest history
        ├── CodeforcesPage.jsx    ← Codeforces rating + tags
        ├── HackerRankPage.jsx    ← Badges + domain stars
        ├── DevCardPage.jsx       ← Shareable developer card (4 themes)
        ├── AIAnalysisPage.jsx    ← Gemini AI analysis
        ├── WrappedPage.jsx       ← Spotify Wrapped-style year review
        ├── PortfolioPage.jsx     ← Resume + README + portfolio generator
        ├── SettingsPage.jsx      ← Platform connections + Gemini key
        └── AnalyticsPage.jsx     ← Combined cross-platform analytics
```

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Open `http://localhost:5173` in your browser.

## App Flow

```
Login / Register
      ↓
  Welcome Page   (full-screen, no sidebar — animated hero with your stats)
      ↓
  Dashboard      (sidebar unlocked — all 11 pages accessible)
```

## Pages

| Page | Route | Description |
|------|-------|-------------|
| Login | `/` | Sign in with username/email |
| Register | — | Create new account |
| Welcome | — | Animated landing after login |
| Dashboard | `dashboard` | All-in-one stats overview |
| GitHub | `github` | Contributions, repos, heatmap |
| LeetCode | `leetcode` | Problems, difficulty, contests |
| Codeforces | `codeforces` | Rating progression, tags |
| HackerRank | `hackerrank` | Badges, domain stars |
| Dev Card | `devcard` | Shareable card with 4 themes |
| AI Analysis | `ai` | Gemini-powered profile insights |
| Wrapped 2024 | `wrapped` | Spotify Wrapped-style year review |
| Portfolio | `portfolio` | Resume + README + site generator |
| Settings | `settings` | Platform usernames + Gemini API key |
| Analytics | `analytics` | Cross-platform performance trends |

## AI Analysis (Gemini)

1. Get a free API key from [aistudio.google.com](https://aistudio.google.com)
2. Go to **Settings** → paste your key
3. Or enter it directly on the **AI Analysis** page
4. Click **Analyze My Profile** — real Gemini analysis of your coding stats

## Connecting to Spring Boot Backend

Replace the mock data in `src/store/AppContext.jsx` with API calls:

```js
// src/services/api.js
import axios from 'axios'

const api = axios.create({ baseURL: 'http://localhost:8080/api' })

api.interceptors.request.use(config => {
  const token = sessionStorage.getItem('dp_access')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const githubService     = { getProfile: (u) => api.get(`/github/${u}`).then(r => r.data) }
export const leetcodeService   = { getProfile: (u) => api.get(`/leetcode/${u}`).then(r => r.data) }
export const codeforcesService = { getProfile: (h) => api.get(`/codeforces/${h}`).then(r => r.data) }
export const hackerrankService = { getProfile: (u) => api.get(`/hackerrank/${u}`).then(r => r.data) }
```

## Build for Production

```bash
npm run build     # Outputs to /dist
npm run preview   # Preview the production build
```
