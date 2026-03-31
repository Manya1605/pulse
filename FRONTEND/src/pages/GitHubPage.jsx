import { useState, useEffect } from 'react'
import { useApp, MOCK } from '../store/AppContext'
import { apiCall } from '../config/api'
import { BarChartComponent, DonutChart, ContribGrid } from '../components/shared'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export default function GitHubPage() {
  const { currentUser } = useApp()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchGitHub = async () => {
      try {
        setLoading(true)
        const response = await apiCall('/github/me')
        if (response) {
          setData(response)
          setError(null)
        }
      } catch (err) {
        console.error('GitHub fetch error:', err)
        setError(err.message)
        // Fall back to mock data
        setData(MOCK.github)
      } finally {
        setLoading(false)
      }
    }

    if (currentUser?.githubUsername) {
      fetchGitHub()
    } else {
      // No GitHub username linked, show mock
      setData(MOCK.github)
      setLoading(false)
    }
  }, [currentUser])

  const github = data || MOCK.github
  return (
    <div>
      <div className="topbar">
        <div>
          <div className="page-title" style={{ color:'var(--gh)' }}>🐙 GitHub Profile</div>
          <div className="page-sub">
            {currentUser?.githubUsername ? `@${currentUser.githubUsername} · github.com/${currentUser.githubUsername}` : '@arjunkumar · github.com/arjunkumar'}
          </div>
        </div>
        <div className="topbar-actions">
          <button className="btn" style={{ color:'var(--gh)', borderColor:'var(--gh)' }} onClick={() => window.open('https://github.com')}>Open GitHub ↗</button>
        </div>
      </div>

      <div className="content">
        {loading && <div className="page-sub">Loading GitHub data...</div>}
        {error && <div className="page-sub" style={{ color: 'var(--danger)' }}>⚠️ {error}</div>}
        {!currentUser?.githubUsername && !loading && (
          <div className="page-sub" style={{ color: 'var(--muted)', marginBottom: '20px' }}>
            💡 Tip: Go to Settings (⚙️) and link your GitHub username to see real data!
          </div>
        )}

        <div className="detail-stats">
          {[
            {v: github.totalContributions || '0', l: 'Contributions'},
            {v: github.totalRepos || '0', l: 'Repositories'},
            {v: github.totalStars || '0', l: 'Total Stars'},
            {v: github.totalForks || '0', l: 'Forks'},
            {v: github.currentStreak || '0', l: 'Streak'}
          ].map(s => (
            <div key={s.l} className="d-stat">
              <div className="d-stat-val" style={{ color:'var(--gh)' }}>{s.v}</div>
              <div className="d-stat-lbl">{s.l}</div>
            </div>
          ))}
        </div>

        <div className="grid-2">
          <div className="card">
            <div className="card-header"><div><div className="card-title">Monthly Contributions</div></div></div>
            <BarChartComponent data={github.monthlyContributions || MOCK.github.monthlyContributions} labels={MONTHS} colors="rgba(88,166,255,0.8)" height={200} />
          </div>
          <div className="card">
            <div className="card-header"><div><div className="card-title">Language Distribution</div></div></div>
            <DonutChart
              data={Object.values(github.languages || MOCK.github.languages)}
              labels={Object.keys(github.languages || MOCK.github.languages)}
              colors={['#3572A5','#f34b7d','#2b7489','#b07219','#00ADD8','#dea584','#484f58']}
              height={200}
            />
          </div>
        </div>

        <div className="card" style={{ marginBottom: 14 }}>
          <div className="card-header">
            <div><div className="card-title">Contribution Heatmap</div><div className="card-sub">{github.totalContributions || '0'} contributions · 2024</div></div>
            <span className="card-badge" style={{ color:'var(--hr)' }}>🔥 {github.currentStreak || '0'} day streak</span>
          </div>
          <ContribGrid />
        </div>

        <div className="card">
          <div className="card-header"><div><div className="card-title">Top Repositories</div></div></div>
          {(github.topRepos || MOCK.github.topRepos).map(r => (
            <div key={r.name} className="activity-item" style={{ cursor:'pointer' }} onClick={() => window.open('https://github.com')}>
              <div className="act-dot" style={{ background:'var(--gh)' }} />
              <div style={{ flex: 1 }}>
                <div className="act-text" style={{ fontWeight: 600 }}>{r.name}</div>
                <div className="act-meta">{r.language} · ⭐ {r.stars} · 🍴 {r.forks} · {r.description || r.desc}</div>
              </div>
              <span style={{ color:'var(--muted2)', fontSize:12 }}>↗</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
