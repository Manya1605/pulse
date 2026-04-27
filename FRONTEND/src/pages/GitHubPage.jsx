import { useState, useEffect } from 'react'
import { useApp, MOCK } from '../store/AppContext'
import { apiCall } from '../config/api'
import { BarChartComponent, DonutChart, ContribGrid, LineChartComponent } from '../components/shared'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export default function GitHubPage() {
  const { currentUser } = useApp()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedYear, setSelectedYear] = useState(null)
  const [selectedMonth, setSelectedMonth] = useState(null)

  useEffect(() => {
    const fetchGitHub = async () => {
      try {
        setLoading(true)
        const response = await apiCall('/github/me')
        if (response) {
          console.log('GitHub response:', response)
          console.log('Yearly contributions:', response.yearlyContributions)
          setData(response)
          setError(null)
          // Set default year to latest year available
          if (response.yearlyContributions && Object.keys(response.yearlyContributions).length > 0) {
            const years = Object.keys(response.yearlyContributions).sort((a, b) => b - a)
            console.log('Available years:', years)
            setSelectedYear(years[0])
            // Set default month to current month (or Dec if future)
            const now = new Date()
            const currentMonth = now.getMonth() // 0-11
            setSelectedMonth(currentMonth.toString())
          } else {
            // No yearly data, set to current year as fallback
            setSelectedYear(new Date().getFullYear().toString())
            setSelectedMonth(new Date().getMonth().toString())
          }
        }
      } catch (err) {
        console.error('GitHub fetch error:', err)
        setError(err.message)
        // Fall back to mock data
        setData(MOCK.github)
        // Set default year for mock data
        if (MOCK.github.yearlyContributions) {
          const years = Object.keys(MOCK.github.yearlyContributions).sort((a, b) => b - a)
          setSelectedYear(years[0])
          const now = new Date()
          setSelectedMonth(now.getMonth().toString())
        }
      } finally {
        setLoading(false)
      }
    }

    if (currentUser?.githubUsername) {
      fetchGitHub()
    } else {
      // No GitHub username linked, show mock
      setData(MOCK.github)
      if (MOCK.github.yearlyContributions) {
        const years = Object.keys(MOCK.github.yearlyContributions).sort((a, b) => b - a)
        setSelectedYear(years[0])
        const now = new Date()
        setSelectedMonth(now.getMonth().toString())
      }
      setLoading(false)
    }
  }, [currentUser])

  const github = data || MOCK.github
  // Get available years with proper fallback chain
  let availableYears = []
  if (data?.yearlyContributions && Object.keys(data.yearlyContributions).length > 0) {
    availableYears = Object.keys(data.yearlyContributions).sort((a, b) => b - a)
  } else if (MOCK.github.yearlyContributions && Object.keys(MOCK.github.yearlyContributions).length > 0) {
    availableYears = Object.keys(MOCK.github.yearlyContributions).sort((a, b) => b - a)
  } else {
    // Fallback: create array with current year
    availableYears = [new Date().getFullYear().toString()]
  }
  
  const displayYear = selectedYear || availableYears[0]
  const yearlyData = (data?.yearlyContributions?.[displayYear] || MOCK.github.yearlyContributions?.[displayYear] || github.monthlyContributions || MOCK.github.monthlyContributions)
  
  // Month selector
  const displayMonth = selectedMonth ? parseInt(selectedMonth) : 0
  const monthName = MONTHS[displayMonth]
  const monthCommits = yearlyData ? yearlyData[displayMonth]?.count || 0 : 0
  
  // Transform yearlyData for LineChartComponent
  const monthlyChartData = yearlyData ? [{
    label: 'Commits',
    data: yearlyData.map(m => m.count),
    color: 'rgba(88,166,255,0.8)'
  }] : []
  
  console.log('Available years:', availableYears, 'Selected year:', displayYear)

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
          <select 
            value={displayYear} 
            onChange={(e) => setSelectedYear(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid var(--border)',
              background: 'var(--bg2)',
              color: 'var(--text)',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            {availableYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
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
            {v: github.totalCommitContributions || '0', l: 'Total Commits'},
            {v: github.publicRepos || '0', l: 'Repositories'},
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
            <div className="card-header">
              <div><div className="card-title">Monthly Contributions</div><div className="card-sub">{displayYear}</div></div>
              <select 
                value={selectedMonth || '0'} 
                onChange={(e) => setSelectedMonth(e.target.value)}
                style={{
                  padding: '6px 10px',
                  borderRadius: '4px',
                  border: '1px solid var(--border)',
                  background: 'var(--bg2)',
                  color: 'var(--text)',
                  cursor: 'pointer',
                  fontSize: '13px',
                }}
              >
                {MONTHS.map((month, idx) => (
                  <option key={idx} value={idx}>{month}</option>
                ))}
              </select>
            </div>
            <div style={{ padding: '20px', textAlign: 'center', borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontSize: '24px', fontWeight: '600', color: 'var(--gh)' }}>{monthCommits}</div>
              <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '4px' }}>commits in {monthName} {displayYear}</div>
            </div>
            <LineChartComponent datasets={monthlyChartData} labels={MONTHS} height={250} />
          </div>
          <div className="card">
            <div className="card-header"><div><div className="card-title">Language Distribution</div></div></div>
            <DonutChart
              data={Object.values(github.languagePercent || MOCK.github.languagePercent || {})}
              labels={Object.keys(github.languagePercent || MOCK.github.languagePercent || {})}
              colors={['#3572A5','#f34b7d','#2b7489','#b07219','#00ADD8','#dea584','#484f58']}
              height={200}
            />
          </div>
        </div>

        <div className="card" style={{ marginBottom: 14 }}>
          <div className="card-header">
            <div><div className="card-title">Contribution Heatmap</div><div className="card-sub">{yearlyData?.reduce((sum, m) => sum + m.count, 0) || '0'} contributions · {displayYear}</div></div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <select 
                value={displayYear} 
                onChange={(e) => setSelectedYear(e.target.value)}
                style={{
                  padding: '6px 10px',
                  borderRadius: '4px',
                  border: '1px solid var(--border)',
                  background: 'var(--bg2)',
                  color: 'var(--text)',
                  cursor: 'pointer',
                  fontSize: '13px',
                }}
              >
                {availableYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <span className="card-badge" style={{ color:'var(--hr)' }}>🔥 {github.currentStreak || '0'} day streak</span>
            </div>
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
