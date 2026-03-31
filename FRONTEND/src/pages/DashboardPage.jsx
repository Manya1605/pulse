import { useApp, MOCK, LANG_COLORS } from '../store/AppContext'
import { useCountUp, BarChartComponent, LineChartComponent, RadarChart, ScoreRing, ContribGrid, AnimBar } from '../components/shared'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export default function DashboardPage() {
  const { setPage } = useApp()
  const ghTotal    = useCountUp(1482)
  const lcTotal    = useCountUp(847)
  const cfRating   = useCountUp(1842)
  const hrScore    = useCountUp(3240)

  const activityData = [
    [98,112,134,89,145,160,178,142,123,167,189,145],
    [51,61,74,44,83,95,104,83,67,99,115,89],
  ]

  return (
    <div>
      <div className="topbar">
        <div>
          <div className="page-title">Developer Dashboard</div>
          <div className="page-sub">Last synced · just now &nbsp;·&nbsp; <span className="status-dot" /> all systems live</div>
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
            { cls:'gh', platform:'GitHub',     val:ghTotal,  label:'Total Contributions', delta:'↑ 62 day streak'    },
            { cls:'lc', platform:'LeetCode',   val:lcTotal,  label:'Problems Solved',      delta:'🔥 62 day streak'   },
            { cls:'cf', platform:'Codeforces', val:cfRating, label:'Current Rating',        delta:'↑ Expert rank'      },
            { cls:'hr', platform:'HackerRank', val:hrScore,  label:'Hacker Score',          delta:'↑ 14 badges earned' },
          ].map(s => (
            <div key={s.cls} className={`stat-card ${s.cls}`}>
              <div className="stat-glow" />
              <div className="stat-platform">{s.platform}</div>
              <div className="stat-value">{s.val.toLocaleString()}</div>
              <div className="stat-label">{s.label}</div>
              <div className="stat-delta">{s.delta}</div>
            </div>
          ))}
        </div>

        {/* Platform quick-cards */}
        <div className="platform-cards">
          {[
            { id:'github',     icon:'🐙', name:'GitHub',     handle:'@arjunkumar', color:'var(--gh)', stats:[{l:'Repos',v:'48'},{l:'Stars',v:'312'},{l:'Forks',v:'127'}] },
            { id:'leetcode',   icon:'🔥', name:'LeetCode',   handle:'@arjun_codes', color:'var(--lc)', stats:[{l:'Solved',v:'847'},{l:'Rating',v:'1924'},{l:'Streak',v:'62d'}] },
            { id:'codeforces', icon:'⚔️', name:'Codeforces', handle:'@arjun_cf',    color:'var(--cf)', stats:[{l:'Rating',v:'1842'},{l:'Solved',v:'234'},{l:'Contests',v:'42'}] },
            { id:'hackerrank', icon:'🏆', name:'HackerRank', handle:'@arjun_hr',    color:'var(--hr)', stats:[{l:'Score',v:'3240'},{l:'Badges',v:'14'},{l:'Certs',v:'3'}] },
          ].map(p => (
            <div key={p.id} className="platform-card" onClick={() => setPage(p.id)}>
              <div className="plat-head"><span className="plat-logo">{p.icon}</span><span className="plat-arrow">→</span></div>
              <div className="plat-name">{p.name}</div>
              <div className="plat-handle">{p.handle}</div>
              <div className="plat-stats">
                {p.stats.map(s => (
                  <div key={s.l} className="plat-stat">
                    <div className="plat-stat-val" style={{ color: p.color }}>{s.v}</div>
                    <div className="plat-stat-lbl">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Activity + Score Ring */}
        <div className="grid-3">
          <div className="card">
            <div className="card-header">
              <div><div className="card-title">Activity Overview</div><div className="card-sub">contributions + problems · 12 months</div></div>
              <span className="card-badge">2024</span>
            </div>
            <BarChartComponent data={activityData} labels={MONTHS}
              colors={[{label:'GitHub',color:'rgba(88,166,255,0.8)'},{label:'LeetCode',color:'rgba(255,161,22,0.8)'}]} height={200} />
          </div>
          <div className="card">
            <div className="card-header"><div><div className="card-title">Overall Score</div><div className="card-sub">combined performance</div></div></div>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:12, paddingTop:8 }}>
              <ScoreRing score={847} />
              <div style={{ display:'flex', gap:18, marginTop:4 }}>
                {[{l:'GITHUB',v:92,c:'var(--gh)'},{l:'LC',v:88,c:'var(--lc)'},{l:'CF',v:76,c:'var(--cf)'},{l:'HR',v:85,c:'var(--hr)'}].map(s => (
                  <div key={s.l} style={{ textAlign:'center' }}>
                    <div style={{ fontSize:10, color:'var(--muted)', fontFamily:"'JetBrains Mono',monospace" }}>{s.l}</div>
                    <div style={{ fontSize:15, fontWeight:700, color:s.c }}>{s.v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* GitHub heatmap + LC problems */}
        <div className="grid-2">
          <div className="card">
            <div className="card-header">
              <div><div className="card-title">GitHub Contributions</div><div className="card-sub">1,482 contributions in 2024</div></div>
              <span className="card-badge" style={{ color:'var(--hr)' }}>🔥 62 streak</span>
            </div>
            <ContribGrid />
          </div>
          <div className="card">
            <div className="card-header"><div><div className="card-title">LeetCode Progress</div><div className="card-sub">847 / 3,502 problems</div></div></div>
            {[{l:'Easy',v:72,c:'var(--hr)',n:361},{l:'Medium',v:55,c:'var(--lc)',n:378},{l:'Hard',v:20,c:'#f85149',n:108}].map(p => (
              <div key={p.l} className="prob-row">
                <span className="prob-label" style={{ color:p.c }}>{p.l}</span>
                <div className="prob-bar-bg"><AnimBar value={p.v} max={100} color={p.c} className="prob-bar-fill" /></div>
                <span className="prob-count">{p.n}</span>
              </div>
            ))}
            <div className="glow-line" />
            <div className="streak-display">
              <div style={{textAlign:'center'}}><div className="streak-val" style={{color:'var(--lc)'}}>62</div><div className="streak-lbl">Streak</div></div>
              <div className="streak-fire">🔥</div>
              <div className="streak-divider" />
              <div style={{textAlign:'center'}}><div className="streak-val" style={{color:'var(--gh)'}}>847</div><div className="streak-lbl">Solved</div></div>
              <div className="streak-divider" />
              <div style={{textAlign:'center'}}><div className="streak-val" style={{color:'var(--cf)'}}>1924</div><div className="streak-lbl">Rating</div></div>
            </div>
          </div>
        </div>

        {/* Rating + Languages */}
        <div className="grid-2">
          <div className="card">
            <div className="card-header"><div><div className="card-title">Rating History</div><div className="card-sub">Codeforces + LeetCode</div></div></div>
            <LineChartComponent datasets={[
              { label:'Codeforces', data: MOCK.codeforces.ratingHistory, color:'#1890ff' },
              { label:'LeetCode',   data:[1720,1745,1800,1788,1840,1870,1895,1880,1900,1912,1918,1924], color:'#ffa116' },
            ]} labels={MONTHS} height={180} />
          </div>
          <div className="card">
            <div className="card-header"><div><div className="card-title">Language Breakdown</div><div className="card-sub">GitHub repositories</div></div></div>
            {Object.entries(MOCK.github.languages).map(([lang, pct]) => (
              <div key={lang} className="lang-row">
                <span className="lang-name">{lang}</span>
                <div className="lang-bar"><AnimBar value={pct} max={34} color={LANG_COLORS[lang] || '#58a6ff'} /></div>
                <span className="lang-pct">{pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity + Radar */}
        <div className="grid-3">
          <div className="card">
            <div className="card-header"><div><div className="card-title">Recent Activity</div><div className="card-sub">across all platforms</div></div></div>
            {[
              { dot:'var(--gh)', p:'GitHub',     pc:'act-gh', text:'Pushed 3 commits to neural-net-viz',             time:'2h ago' },
              { dot:'var(--lc)', p:'LeetCode',   pc:'act-lc', text:'Solved #2073 Time Needed to Buy Tickets',        time:'4h ago' },
              { dot:'var(--cf)', p:'Codeforces', pc:'act-cf', text:'Participated in Round 980 Div.2 — Rank 847',     time:'1d ago' },
              { dot:'var(--hr)', p:'HackerRank', pc:'act-hr', text:'Earned Problem Solving Gold Badge',              time:'2d ago' },
              { dot:'var(--gh)', p:'GitHub',     pc:'act-gh', text:'Opened PR in open-source/react-query',           time:'3d ago' },
              { dot:'var(--lc)', p:'LeetCode',   pc:'act-lc', text:'Solved #149 Max Points on a Line (Hard)',        time:'3d ago' },
            ].map((a, i) => (
              <div key={i} className="activity-item">
                <div className="act-dot" style={{ background: a.dot }} />
                <div>
                  <div className="act-text"><span className={`act-platform ${a.pc}`}>{a.p}</span> — {a.text}</div>
                  <div className="act-meta">{a.time}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="card">
            <div className="card-header"><div><div className="card-title">Skill Radar</div><div className="card-sub">domain performance</div></div></div>
            <RadarChart data={[88,82,75,64,92,78]} labels={['Algorithms','Data Struct','Math','System Design','Open Source','Contests']} height={200} />
          </div>
        </div>
      </div>
    </div>
  )
}
