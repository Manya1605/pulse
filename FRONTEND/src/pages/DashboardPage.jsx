import { useState, useEffect } from 'react'
import { useApp, LANG_COLORS } from '../store/AppContext'
import { useCountUp, BarChartComponent, LineChartComponent, RadarChart, ScoreRing, ContribGrid, AnimBar } from '../components/shared'
import { apiCall } from '../config/api'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export default function DashboardPage() {
  const { setPage, currentUser, showToast } = useApp()
  const [data, setData] = useState({ github: null, leetcode: null, codeforces: null, hackerrank: null })
  const [loading, setLoading] = useState(true)
  
  // Animated values for stats
  const ghTotal = useCountUp(data.github?.totalCommitContributions || 0)
  const lcTotal = useCountUp(data.leetcode?.totalSolved || 0)
  const cfRating = useCountUp(data.codeforces?.rating || 0)
  const hrScore = useCountUp(data.hackerrank?.hackerScore || 0)

  // Fetch real data on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const newData = { github: null, leetcode: null, codeforces: null, hackerrank: null }
      
      // Fetch GitHub data
      try {
        const gh = await apiCall('/github/me')
        newData.github = gh
      } catch (err) {
        console.error('GitHub fetch error:', err)
      }
      
      // Fetch LeetCode data
      try {
        const lc = await apiCall('/leetcode/me')
        newData.leetcode = lc
      } catch (err) {
        console.error('LeetCode fetch error:', err)
      }
      
      // Fetch Codeforces data
      try {
        const cf = await apiCall('/codeforces/me')
        newData.codeforces = cf
      } catch (err) {
        console.error('Codeforces fetch error:', err)
      }
      
      // Fetch HackerRank data
      try {
        const hr = await apiCall('/hackerrank/me')
        newData.hackerrank = hr
      } catch (err) {
        console.error('HackerRank fetch error:', err)
      }
      
      setData(newData)
      setLoading(false)
    }
    
    fetchData()
  }, [currentUser])

  // Handle connect to platform
  const connectPlatform = (platform) => {
    showToast(`Navigate to Settings to connect ${platform}`, 'ℹ️')
    setPage('settings')
  }

  const activityData = data.github?.monthlyContributions 
    ? [data.github.monthlyContributions, data.leetcode?.monthlySubmissions || [0,0,0,0,0,0,0,0,0,0,0,0]]
    : [[0,0,0,0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0,0,0,0]]

  return (
    <div>
      <div className="topbar">
        <div>
          <div className="page-title">Developer Dashboard</div>
          <div className="page-sub">Last synced · {loading ? 'syncing...' : 'just now'} &nbsp;·&nbsp; <span className="status-dot" /> all systems live</div>
        </div>
        <div className="topbar-actions">
          <button className="btn btn-purple" onClick={() => setPage('ai')}>🤖 AI Analysis</button>
          <button className="btn btn-accent" onClick={() => setPage('devcard')}>🪪 Share Card</button>
        </div>
      </div>

      <div className="content">
        {/* Big stat cards */}
        <div className="stats-row">
          {[
            { cls:'gh', platform:'GitHub', val:ghTotal, label:'Total Commits', connected: !!data.github },
            { cls:'lc', platform:'LeetCode', val:lcTotal, label:'Problems Solved', connected: !!data.leetcode },
            { cls:'cf', platform:'Codeforces', val:cfRating, label:'Current Rating', connected: !!data.codeforces },
            { cls:'hr', platform:'HackerRank', val:hrScore, label:'Hacker Score', connected: !!data.hackerrank },
          ].map(s => (
            <div 
              key={s.cls} 
              className={`stat-card ${s.cls}`}
              onClick={() => !s.connected && connectPlatform(s.platform)}
              style={{ cursor: !s.connected ? 'pointer' : 'default', opacity: !s.connected ? 0.6 : 1 }}
            >
              <div className="stat-glow" />
              <div className="stat-platform">{s.platform}</div>
              {s.connected ? (
                <>
                  <div className="stat-value">{s.val.toLocaleString()}</div>
                  <div className="stat-label">{s.label}</div>
                </>
              ) : (
                <div className="stat-label" style={{ paddingTop: 20 }}>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>Not Connected</div>
                  <div style={{ fontSize: 11, marginTop: 8, color: 'var(--accent)' }}>Click to Connect →</div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Platform quick-cards */}
        <div className="platform-cards">
          {[
            { 
              id:'github', icon:'🐙', name:'GitHub', 
              handle: data.github?.login || 'Not Connected',
              color:'var(--gh)', 
              stats: data.github ? [
                {l:'Repos',v: data.github.publicRepos},
                {l:'Stars',v: data.github.totalStars},
                {l:'Followers',v: data.github.followers}
              ] : [],
              connected: !!data.github
            },
            { 
              id:'leetcode', icon:'🔥', name:'LeetCode',
              handle: data.leetcode?.username || 'Not Connected',
              color:'var(--lc)', 
              stats: data.leetcode ? [
                {l:'Solved',v: data.leetcode.totalSolved},
                {l:'Rating',v: data.leetcode.contestRating || 'N/A'},
                {l:'Streak',v: (data.leetcode.currentStreak || 0) + 'd'}
              ] : [],
              connected: !!data.leetcode
            },
            { 
              id:'codeforces', icon:'⚔️', name:'Codeforces',
              handle: data.codeforces?.handle || 'Not Connected',
              color:'var(--cf)', 
              stats: data.codeforces ? [
                {l:'Rating',v: data.codeforces.rating},
                {l:'Solved',v: data.codeforces.totalSolved},
                {l:'Contests',v: data.codeforces.contestsAttended}
              ] : [],
              connected: !!data.codeforces
            },
            { 
              id:'hackerrank', icon:'🏆', name:'HackerRank',
              handle: data.hackerrank?.username || 'Not Connected',
              color:'var(--hr)', 
              stats: data.hackerrank ? [
                {l:'Score',v: data.hackerrank.hackerScore || 'N/A'},
                {l:'Badges',v: data.hackerrank.badges},
                {l:'Problems',v: data.hackerrank.totalProblems}
              ] : [],
              connected: !!data.hackerrank
            },
          ].map(p => (
            <div 
              key={p.id} 
              className="platform-card" 
              onClick={() => p.connected ? setPage(p.id) : connectPlatform(p.name)}
              style={{ cursor: 'pointer', opacity: p.connected ? 1 : 0.6 }}
            >
              <div className="plat-head">
                <span className="plat-logo">{p.icon}</span>
                <span className="plat-arrow">{p.connected ? '→' : '⚠️'}</span>
              </div>
              <div className="plat-name">{p.name}</div>
              <div className="plat-handle" style={{ fontSize: p.connected ? 12 : 11, color: p.connected ? 'var(--text2)' : 'var(--muted)' }}>
                {p.handle}
              </div>
              {p.connected ? (
                <div className="plat-stats">
                  {p.stats.map(s => (
                    <div key={s.l} className="plat-stat">
                      <div className="plat-stat-val" style={{ color: p.color }}>{s.v}</div>
                      <div className="plat-stat-lbl">{s.l}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: 11, color: 'var(--accent)', padding: '8px 0', textAlign: 'center' }}>
                  Click to connect
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Activity Overview - Only show if data exists */}
        {(data.github || data.leetcode) && (
          <div className="grid-3">
            <div className="card">
              <div className="card-header">
                <div><div className="card-title">Activity Overview</div><div className="card-sub">contributions + problems · 12 months</div></div>
                <span className="card-badge">2024</span>
              </div>
              {data.github || data.leetcode ? (
                <BarChartComponent data={activityData} labels={MONTHS}
                  colors={[
                    {label:'GitHub',color:'rgba(88,166,255,0.8)'},
                    {label:'LeetCode',color:'rgba(255,161,22,0.8)'}
                  ]} height={200} />
              ) : (
                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--muted)' }}>Connect accounts to see activity</div>
              )}
            </div>
            {data.github || data.leetcode || data.codeforces || data.hackerrank ? (
              <div className="card">
                <div className="card-header"><div><div className="card-title">Overall Score</div><div className="card-sub">combined performance</div></div></div>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:12, paddingTop:8 }}>
                  <ScoreRing score={lcTotal} />
                </div>
              </div>
            ) : (
              <div className="card" style={{ padding: '20px', textAlign: 'center', color: 'var(--muted)' }}>
                Connect at least one account to see your overall score
              </div>
            )}
          </div>
        )}

        {/* GitHub heatmap - Only if GitHub connected */}
        {data.github && (
          <div className="grid-2">
            <div className="card">
              <div className="card-header">
                <div><div className="card-title">GitHub Contributions</div><div className="card-sub">{data.github.totalContributions} contributions in 2024</div></div>
                {data.github.currentStreak ? (
                  <span className="card-badge" style={{ color:'var(--hr)' }}>🔥 {data.github.currentStreak} streak</span>
                ) : null}
              </div>
              <ContribGrid />
            </div>
          </div>
        )}

        {/* LeetCode Progress - Only if connected */}
        {data.leetcode && (
          <div className="card">
            <div className="card-header">
              <div><div className="card-title">LeetCode Progress</div><div className="card-sub">{data.leetcode.totalSolved} / {(data.leetcode.totalEasy + data.leetcode.totalMedium + data.leetcode.totalHard)} problems</div></div>
            </div>
            {[
              {l:'Easy', v: Math.round((data.leetcode.easySolved / data.leetcode.totalEasy) * 100), c:'var(--hr)', n: data.leetcode.easySolved},
              {l:'Medium', v: Math.round((data.leetcode.mediumSolved / data.leetcode.totalMedium) * 100), c:'var(--lc)', n: data.leetcode.mediumSolved},
              {l:'Hard', v: Math.round((data.leetcode.hardSolved / data.leetcode.totalHard) * 100), c:'#f85149', n: data.leetcode.hardSolved}
            ].map(p => (
              <div key={p.l} className="prob-row">
                <span className="prob-label" style={{ color:p.c }}>{p.l}</span>
                <div className="prob-bar-bg"><AnimBar value={p.v} max={100} color={p.c} className="prob-bar-fill" /></div>
                <span className="prob-count">{p.n}</span>
              </div>
            ))}
            <div className="glow-line" />
            <div className="streak-display">
              {data.leetcode.currentStreak ? (
                <div style={{textAlign:'center'}}><div className="streak-val" style={{color:'var(--lc)'}}>{data.leetcode.currentStreak}</div><div className="streak-lbl">Streak</div></div>
              ) : null}
              <div className="streak-fire">🔥</div>
              <div className="streak-divider" />
              <div style={{textAlign:'center'}}><div className="streak-val" style={{color:'var(--gh)'}}>{data.leetcode.totalSolved}</div><div className="streak-lbl">Solved</div></div>
              {data.leetcode.contestRating ? (
                <>
                  <div className="streak-divider" />
                  <div style={{textAlign:'center'}}><div className="streak-val" style={{color:'var(--cf)'}}>{data.leetcode.contestRating}</div><div className="streak-lbl">Rating</div></div>
                </>
              ) : null}
            </div>
          </div>
        )}

        {/* Rating History - Only if Codeforces or LeetCode connected */}
        {(data.codeforces || data.leetcode) && (
          <div className="card" style={{ marginTop: 16 }}>
            <div className="card-header">
              <div><div className="card-title">Rating History</div><div className="card-sub">Codeforces + LeetCode</div></div>
            </div>
            {data.codeforces || data.leetcode ? (
              <LineChartComponent 
                datasets={[
                  ...(data.codeforces && data.codeforces.ratingHistory ? [
                    { label:'Codeforces', data: data.codeforces.ratingHistory, color:'#1890ff' }
                  ] : []),
                  ...(data.leetcode && data.leetcode.ratingHistory ? [
                    { label:'LeetCode', data: data.leetcode.ratingHistory, color:'#ffa116' }
                  ] : []),
                ].filter(d => d.data && d.data.length > 0)}
                labels={MONTHS} 
                height={180} 
              />
            ) : (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--muted)' }}>Connect Codeforces or LeetCode to see rating history</div>
            )}
          </div>
        )}

        {/* No data message */}
        {!data.github && !data.leetcode && !data.codeforces && !data.hackerrank && !loading && (
          <div className="card" style={{ padding: '40px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: 24, marginBottom: 16 }}>📌 Connect Your Accounts</div>
            <div style={{ color: 'var(--muted)', marginBottom: 20 }}>
              Connect at least one platform to see your real-time dashboard with live statistics
            </div>
            <button className="btn btn-accent" onClick={() => setPage('settings')}>
              Go to Settings →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
