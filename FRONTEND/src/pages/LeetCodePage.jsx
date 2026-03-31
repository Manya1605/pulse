import { MOCK } from '../store/AppContext'
import { BarChartComponent, DonutChart, LineChartComponent, AnimBar } from '../components/shared'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export default function LeetCodePage() {
  return (
    <div>
      <div className="topbar">
        <div>
          <div className="page-title" style={{ color: 'var(--lc)' }}>🔥 LeetCode Profile</div>
          <div className="page-sub">@arjun_codes · leetcode.com/arjun_codes</div>
        </div>
        <div className="topbar-actions">
          <button className="btn" style={{ color: 'var(--lc)', borderColor: 'var(--lc)' }} onClick={() => window.open('https://leetcode.com')}>Open LeetCode ↗</button>
        </div>
      </div>

      <div className="content">
        <div className="detail-stats">
          {[
            { v: 847,    l: 'Solved',         c: 'var(--lc)' },
            { v: 361,    l: 'Easy',            c: 'var(--hr)' },
            { v: 378,    l: 'Medium',          c: 'var(--lc)' },
            { v: 108,    l: 'Hard',            c: '#f85149'   },
            { v: 1924,   l: 'Contest Rating',  c: 'var(--cf)' },
          ].map(s => (
            <div key={s.l} className="d-stat">
              <div className="d-stat-val" style={{ color: s.c }}>{s.v}</div>
              <div className="d-stat-lbl">{s.l}</div>
            </div>
          ))}
        </div>

        <div className="grid-2">
          <div className="card">
            <div className="card-header"><div><div className="card-title">Monthly Submissions</div></div></div>
            <BarChartComponent data={MOCK.leetcode.monthlySubmissions} labels={MONTHS} colors="rgba(255,161,22,0.8)" height={200} />
          </div>
          <div className="card">
            <div className="card-header"><div><div className="card-title">Difficulty Split</div></div></div>
            <DonutChart data={[361, 378, 108]} labels={['Easy', 'Medium', 'Hard']} colors={['#00ea64', '#ffa116', '#f85149']} height={200} />
          </div>
        </div>

        <div className="grid-2">
          <div className="card">
            <div className="card-header"><div><div className="card-title">Contest Rating History</div></div></div>
            <LineChartComponent
              datasets={[{ label: 'Rating', data: [1720,1745,1800,1788,1840,1870,1895,1880,1900,1912,1918,1924], color: '#ffa116' }]}
              labels={MONTHS} height={180}
            />
          </div>
          <div className="card">
            <div className="card-header"><div><div className="card-title">Topic Coverage</div></div></div>
            {MOCK.leetcode.topics.map(t => (
              <div key={t.tag} className="lang-row">
                <span className="lang-name">{t.tag}</span>
                <div className="lang-bar"><AnimBar value={t.count} max={182} color="var(--lc)" /></div>
                <span className="lang-pct">{t.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ marginBottom: 14 }}>
          <div className="card-header"><div><div className="card-title">Contest History</div></div></div>
          <div className="contest-row" style={{ color: 'var(--muted2)', fontSize: 10, fontFamily: "'JetBrains Mono',monospace", paddingBottom: 6 }}>
            <span className="contest-name">Contest</span>
            <span className="contest-rank">Rank</span>
            <span className="contest-delta">Δ Rating</span>
            <span className="contest-date">Date</span>
          </div>
          {MOCK.leetcode.contestHistory.map((c, i) => (
            <div key={i} className="contest-row">
              <span className="contest-name">{c.name}</span>
              <span className="contest-rank">{c.rank}</span>
              <span className={`contest-delta ${c.change >= 0 ? 'delta-up' : 'delta-down'}`}>{c.change >= 0 ? '+' : ''}{c.change}</span>
              <span className="contest-date">{c.date}</span>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="card-header"><div><div className="card-title">Recent Submissions</div></div></div>
          {MOCK.leetcode.recentSubmissions.map((s, i) => (
            <div key={i} className="activity-item">
              <div className="act-dot" style={{ background: s.status === 'Accepted' ? 'var(--hr)' : '#f85149' }} />
              <div>
                <div className="act-text">
                  {s.title}
                  <span style={{ fontSize: 10, color: s.diff === 'Hard' ? '#f85149' : s.diff === 'Medium' ? 'var(--lc)' : 'var(--hr)', marginLeft: 6 }}>{s.diff}</span>
                </div>
                <div className="act-meta">{s.status} · {s.lang} · {s.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
