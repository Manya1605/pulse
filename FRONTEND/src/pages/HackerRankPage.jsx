import { MOCK } from '../store/AppContext'
import { BarChartComponent, LineChartComponent } from '../components/shared'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export default function HackerRankPage() {
  return (
    <div>
      <div className="topbar">
        <div>
          <div className="page-title" style={{ color: 'var(--hr)' }}>🏆 HackerRank Profile</div>
          <div className="page-sub">@arjun_hr · hackerrank.com/arjun_hr</div>
        </div>
        <div className="topbar-actions">
          <button className="btn" style={{ color: 'var(--hr)', borderColor: 'var(--hr)' }} onClick={() => window.open('https://hackerrank.com')}>Open HackerRank ↗</button>
        </div>
      </div>

      <div className="content">
        <div className="detail-stats">
          {[
            { v: '3,240', l: 'Hacker Score', c: 'var(--hr)' },
            { v: '14',    l: 'Badges',        c: 'var(--lc)' },
            { v: '★ 5',  l: 'Stars',          c: 'var(--gh)' },
            { v: '3',     l: 'Certificates',  c: 'var(--cf)' },
            { v: 'Top 5%',l: 'Global Rank',   c: 'var(--hr)' },
          ].map(s => (
            <div key={s.l} className="d-stat">
              <div className="d-stat-val" style={{ color: s.c }}>{s.v}</div>
              <div className="d-stat-lbl">{s.l}</div>
            </div>
          ))}
        </div>

        <div className="grid-2">
          <div className="card">
            <div className="card-header"><div><div className="card-title">Domain Stars</div><div className="card-sub">performance per track</div></div></div>
            <BarChartComponent
              data={MOCK.hackerrank.domains.map(d => d.stars)}
              labels={MOCK.hackerrank.domains.map(d => d.domain)}
              colors="rgba(0,234,100,0.8)"
              height={220}
            />
          </div>
          <div className="card">
            <div className="card-header"><div><div className="card-title">Badges Earned</div></div></div>
            <div className="badge-grid">
              {MOCK.hackerrank.badges_list.map((b, i) => (
                <div key={i} className="badge-item">
                  <span className="badge-icon">{b.stars >= 5 ? '🥇' : b.stars >= 3 ? '🥈' : '🥉'}</span>
                  <div>
                    <div className="badge-name">{b.name}</div>
                    <div className="badge-stars">{'★'.repeat(b.stars)}{'☆'.repeat(5 - b.stars)} {b.level}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><div><div className="card-title">Score History</div><div className="card-sub">hacker score growth 2024</div></div></div>
          <LineChartComponent
            datasets={[{ label: 'Hacker Score', data: [1200,1450,1680,1820,1980,2150,2340,2520,2700,2880,3050,3240], color: '#00ea64' }]}
            labels={MONTHS}
            height={180}
          />
        </div>
      </div>
    </div>
  )
}
