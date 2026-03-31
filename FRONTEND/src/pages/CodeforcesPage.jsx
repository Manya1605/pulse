import { MOCK } from '../store/AppContext'
import { BarChartComponent, LineChartComponent, AnimBar } from '../components/shared'

export default function CodeforcesPage() {
  const contests = Array.from({ length: 42 }, (_, i) => 1200 + Math.floor(Math.sin(i / 4) * 200 + i * 15))

  return (
    <div>
      <div className="topbar">
        <div>
          <div className="page-title" style={{ color: 'var(--cf)' }}>⚔️ Codeforces Profile</div>
          <div className="page-sub">@arjun_cf · Expert · codeforces.com/profile/arjun_cf</div>
        </div>
        <div className="topbar-actions">
          <button className="btn" style={{ color: 'var(--cf)', borderColor: 'var(--cf)' }} onClick={() => window.open('https://codeforces.com')}>Open Codeforces ↗</button>
        </div>
      </div>

      <div className="content">
        <div className="detail-stats">
          {[
            { v: '1,842', l: 'Current Rating',  c: 'var(--cf)' },
            { v: '1,956', l: 'Max Rating',       c: 'var(--lc)' },
            { v: '234',   l: 'Problems Solved',  c: 'var(--gh)' },
            { v: '42',    l: 'Contests',          c: 'var(--hr)' },
            { v: 'Expert',l: 'Rank',              c: 'var(--cf)' },
          ].map(s => (
            <div key={s.l} className="d-stat">
              <div className="d-stat-val" style={{ color: s.c, fontSize: s.v === 'Expert' ? 16 : undefined }}>{s.v}</div>
              <div className="d-stat-lbl">{s.l}</div>
            </div>
          ))}
        </div>

        <div className="grid-2">
          <div className="card">
            <div className="card-header"><div><div className="card-title">Rating Progression</div><div className="card-sub">all-time contest history</div></div></div>
            <LineChartComponent
              datasets={[{ label: 'Rating', data: contests, color: '#1890ff' }]}
              labels={Array.from({ length: 42 }, (_, i) => `C${i + 1}`)}
              height={220}
            />
          </div>
          <div className="card">
            <div className="card-header"><div><div className="card-title">Problems by Rating Band</div></div></div>
            <BarChartComponent
              data={Object.values(MOCK.codeforces.problemsByRating)}
              labels={Object.keys(MOCK.codeforces.problemsByRating)}
              colors="rgba(24,144,255,0.8)"
              height={220}
            />
          </div>
        </div>

        <div className="card" style={{ marginBottom: 14 }}>
          <div className="card-header"><div><div className="card-title">Contest History</div><div className="card-sub">last 5 contests</div></div></div>
          <div className="contest-row" style={{ color: 'var(--muted2)', fontSize: 10, fontFamily: "'JetBrains Mono',monospace", paddingBottom: 6 }}>
            <span className="contest-name">Contest</span>
            <span className="contest-rank">Rank</span>
            <span className="contest-delta">Δ Rating</span>
            <span className="contest-date">Date</span>
          </div>
          {MOCK.codeforces.contestHistory.map((c, i) => (
            <div key={i} className="contest-row">
              <span className="contest-name" style={{ fontSize: 12 }}>{c.name}</span>
              <span className="contest-rank">{c.rank.toLocaleString()}</span>
              <span className={`contest-delta ${c.change >= 0 ? 'delta-up' : 'delta-down'}`}>{c.change >= 0 ? '+' : ''}{c.change}</span>
              <span className="contest-date">{c.date}</span>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="card-header"><div><div className="card-title">Top Problem Tags</div></div></div>
          {Object.entries(MOCK.codeforces.tags).map(([tag, cnt]) => (
            <div key={tag} className="lang-row">
              <span className="lang-name">{tag}</span>
              <div className="lang-bar"><AnimBar value={cnt} max={48} color="var(--cf)" /></div>
              <span className="lang-pct">{cnt}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
