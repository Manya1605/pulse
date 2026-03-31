import { BarChartComponent, LineChartComponent } from '../components/shared'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

const TOP_STATS = [
  { v: '1,081', l: 'Total Problems',  sub: 'LC + CF + HR',       c: 'var(--lc)' },
  { v: '247',   l: 'Active Days',     sub: 'coded this year',    c: 'var(--gh)' },
  { v: '3.2',   l: 'Problems/Day',    sub: '30-day average',     c: 'var(--hr)' },
  { v: '8',     l: 'Top 100 Finishes',sub: 'in contests',        c: 'var(--cf)' },
]

export default function AnalyticsPage() {
  return (
    <div>
      <div className="topbar">
        <div>
          <div className="page-title">📊 Analytics</div>
          <div className="page-sub">Combined performance across all platforms</div>
        </div>
      </div>

      <div className="content">
        {/* Top metric cards */}
        <div className="grid-4">
          {TOP_STATS.map(s => (
            <div key={s.l} className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 38, fontWeight: 800, letterSpacing: '-2px', color: s.c }}>{s.v}</div>
              <div style={{ fontSize: 12, fontWeight: 600, marginTop: 4 }}>{s.l}</div>
              <div style={{ fontSize: 10, color: 'var(--muted)', fontFamily: "'JetBrains Mono',monospace", marginTop: 2 }}>{s.sub}</div>
            </div>
          ))}
        </div>

        <div className="grid-2">
          {/* Weekly heatmap */}
          <div className="card">
            <div className="card-header"><div><div className="card-title">Weekly Activity Heatmap</div><div className="card-sub">problems + commits by day of week</div></div></div>
            <BarChartComponent
              data={[
                [12, 8, 15, 6, 14, 20, 18],
                [4,  6,  3, 8,  5,  7,  6],
                [2,  0,  3, 0,  4,  6,  2],
              ]}
              labels={['Mon','Tue','Wed','Thu','Fri','Sat','Sun']}
              colors={[
                { label: 'GitHub',     color: 'rgba(88,166,255,0.7)'  },
                { label: 'LeetCode',   color: 'rgba(255,161,22,0.7)'  },
                { label: 'Codeforces', color: 'rgba(24,144,255,0.7)'  },
              ]}
              height={200}
            />
          </div>

          {/* Score trend */}
          <div className="card">
            <div className="card-header"><div><div className="card-title">Platform Score Trend</div><div className="card-sub">normalized 0–100</div></div></div>
            <LineChartComponent
              datasets={[
                { label: 'GitHub',     data: [72,74,78,76,80,83,86,84,87,90,92,92], color: '#58a6ff' },
                { label: 'LeetCode',   data: [68,70,74,72,76,80,83,82,85,87,88,88], color: '#ffa116' },
                { label: 'Codeforces', data: [58,60,64,62,66,70,73,72,74,76,76,76], color: '#1890ff' },
                { label: 'HackerRank', data: [62,66,70,68,72,75,78,80,82,83,85,85], color: '#00ea64' },
              ]}
              labels={MONTHS}
              height={200}
            />
          </div>
        </div>

        {/* Monthly combined */}
        <div className="card">
          <div className="card-header"><div><div className="card-title">Monthly Combined Activity</div><div className="card-sub">all platforms · 2024</div></div></div>
          <BarChartComponent
            data={[
              [98, 112, 134,  89, 145, 160, 178, 142, 123, 167, 189, 145],
              [51,  61,  74,  44,  83,  95, 104,  83,  67,  99, 115,  89],
              [18,  22,  26,  14,  28,  32,  38,  30,  24,  34,  40,  32],
            ]}
            labels={MONTHS}
            colors={[
              { label: 'GitHub',     color: 'rgba(88,166,255,0.7)'  },
              { label: 'LeetCode',   color: 'rgba(255,161,22,0.7)'  },
              { label: 'Codeforces', color: 'rgba(24,144,255,0.7)'  },
            ]}
            height={220}
          />
        </div>

        {/* Personal bests */}
        <div className="card">
          <div className="card-header"><div><div className="card-title">Personal Records</div><div className="card-sub">all-time bests</div></div></div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
            {[
              { icon: '🔥', label: 'Longest Streak',    value: '91 days',  sub: 'LeetCode 2024',      c: 'var(--lc)' },
              { icon: '⚔️', label: 'Peak CF Rating',    value: '1,956',    sub: 'October 2024',       c: 'var(--cf)' },
              { icon: '📅', label: 'Most Active Month', value: 'November', sub: '219 activities',     c: 'var(--gh)' },
              { icon: '💡', label: 'Most Solved Month', value: 'July',     sub: '152 problems',       c: 'var(--hr)' },
            ].map((r, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '16px 8px', background: 'var(--bg3)', borderRadius: 10, border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>{r.icon}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: "'JetBrains Mono',monospace", marginBottom: 4 }}>{r.label}</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: r.c }}>{r.value}</div>
                <div style={{ fontSize: 10, color: 'var(--muted2)', fontFamily: "'JetBrains Mono',monospace", marginTop: 2 }}>{r.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
