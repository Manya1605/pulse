import { useState, useEffect, useRef } from 'react'

// ── TOAST ─────────────────────────────────────────────────────
export function ToastContainer({ toasts }) {
  return (
    <div className="toast">
      {toasts.map(t => (
        <div key={t.id} className="toast-item">
          <span>{t.icon || '✓'}</span>
          <span>{t.msg}</span>
        </div>
      ))}
    </div>
  )
}

// ── COUNT UP HOOK ─────────────────────────────────────────────
export function useCountUp(target, duration = 1600) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!target) return
    const start = Date.now()
    const step = () => {
      const p = Math.min((Date.now() - start) / duration, 1)
      const e = 1 - Math.pow(1 - p, 3)
      setVal(Math.floor(e * target))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration])
  return val
}

// ── BAR CHART ─────────────────────────────────────────────────
export function BarChartComponent({ data, labels, colors, height = 180 }) {
  const ref = useRef(null)
  const chartRef = useRef(null)
  useEffect(() => {
    if (!ref.current || !window.Chart) return
    if (chartRef.current) chartRef.current.destroy()
    chartRef.current = new window.Chart(ref.current, {
      type: 'bar',
      data: {
        labels,
        datasets: Array.isArray(data[0])
          ? data.map((d, i) => ({
              label: colors[i]?.label || '',
              data: d,
              backgroundColor: colors[i]?.color || colors[i] || '#58a6ff',
              borderRadius: 4,
              borderSkipped: false,
            }))
          : [{ data, backgroundColor: typeof colors === 'string' ? colors : '#58a6ff', borderRadius: 4, borderSkipped: false }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: Array.isArray(data[0]), labels: { color: '#7d8590', boxWidth: 10, font: { family: "'JetBrains Mono'" } } } },
        scales: {
          x: { ticks: { color: '#7d8590', font: { size: 10, family: "'JetBrains Mono'" } }, grid: { color: 'rgba(255,255,255,0.04)' }, border: { display: false } },
          y: { ticks: { color: '#7d8590', font: { size: 10, family: "'JetBrains Mono'" } }, grid: { color: 'rgba(255,255,255,0.04)' }, border: { display: false } },
        },
      },
    })
    return () => { if (chartRef.current) chartRef.current.destroy() }
  }, [])
  return <div style={{ height }}><canvas ref={ref} /></div>
}

// ── LINE CHART ────────────────────────────────────────────────
export function LineChartComponent({ datasets, labels, height = 180 }) {
  const ref = useRef(null)
  const chartRef = useRef(null)
  useEffect(() => {
    if (!ref.current || !window.Chart) return
    if (chartRef.current) chartRef.current.destroy()
    chartRef.current = new window.Chart(ref.current, {
      type: 'line',
      data: {
        labels,
        datasets: datasets.map(d => ({
          label: d.label, data: d.data,
          borderColor: d.color, backgroundColor: d.color + '18',
          borderWidth: 2, pointRadius: 3, tension: 0.4, fill: true,
        })),
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { labels: { color: '#7d8590', boxWidth: 10, font: { family: "'JetBrains Mono'" } } } },
        scales: {
          x: { ticks: { color: '#7d8590', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.04)' }, border: { display: false } },
          y: { ticks: { color: '#7d8590', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.04)' }, border: { display: false } },
        },
      },
    })
    return () => { if (chartRef.current) chartRef.current.destroy() }
  }, [])
  return <div style={{ height }}><canvas ref={ref} /></div>
}

// ── DONUT CHART ───────────────────────────────────────────────
export function DonutChart({ data, labels, colors, height = 200 }) {
  const ref = useRef(null)
  const chartRef = useRef(null)
  useEffect(() => {
    if (!ref.current || !window.Chart) return
    if (chartRef.current) chartRef.current.destroy()
    chartRef.current = new window.Chart(ref.current, {
      type: 'doughnut',
      data: { labels, datasets: [{ data, backgroundColor: colors, borderWidth: 0, hoverOffset: 6 }] },
      options: {
        responsive: true, maintainAspectRatio: false, cutout: '62%',
        plugins: { legend: { position: 'right', labels: { color: '#7d8590', boxWidth: 10, font: { family: "'JetBrains Mono'", size: 11 }, padding: 10 } } },
      },
    })
    return () => { if (chartRef.current) chartRef.current.destroy() }
  }, [])
  return <div style={{ height }}><canvas ref={ref} /></div>
}

// ── RADAR CHART ───────────────────────────────────────────────
export function RadarChart({ data, labels, height = 200 }) {
  const ref = useRef(null)
  const chartRef = useRef(null)
  useEffect(() => {
    if (!ref.current || !window.Chart) return
    if (chartRef.current) chartRef.current.destroy()
    chartRef.current = new window.Chart(ref.current, {
      type: 'radar',
      data: {
        labels,
        datasets: [{ label: 'Score', data, borderColor: '#58a6ff', backgroundColor: 'rgba(88,166,255,0.12)', pointBackgroundColor: '#58a6ff', borderWidth: 2 }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        scales: { r: { grid: { color: 'rgba(255,255,255,0.07)' }, pointLabels: { font: { size: 11 }, color: '#7d8590' }, ticks: { display: false }, beginAtZero: true, max: 100 } },
        plugins: { legend: { display: false } },
      },
    })
    return () => { if (chartRef.current) chartRef.current.destroy() }
  }, [])
  return <div style={{ height }}><canvas ref={ref} /></div>
}

// ── SCORE RING ────────────────────────────────────────────────
export function ScoreRing({ score, max = 1000, size = 150 }) {
  const r = size * 0.375
  const circ = 2 * Math.PI * r
  const offset = circ - (score / max) * circ
  const val = useCountUp(score)
  return (
    <div className="score-wrap" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--bg4)" strokeWidth={size * 0.09} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="url(#sg)" strokeWidth={size * 0.09}
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
          transform={`rotate(-90 ${size/2} ${size/2})`}
          style={{ transition: 'stroke-dashoffset 2s cubic-bezier(0.16,1,0.3,1)' }} />
        <defs>
          <linearGradient id="sg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#58a6ff" />
            <stop offset="100%" stopColor="#bc8cff" />
          </linearGradient>
        </defs>
      </svg>
      <div className="score-label">
        <span className="score-num">{val.toLocaleString()}</span>
        <span className="score-sub-lbl">/ {max}</span>
      </div>
    </div>
  )
}

// ── CONTRIB GRID ──────────────────────────────────────────────
export function ContribGrid() {
  const weeks = Array.from({ length: 52 }, () =>
    Array.from({ length: 7 }, () => {
      const r = Math.random()
      if (r > 0.95) return 4
      if (r > 0.87) return 3
      if (r > 0.75) return 2
      if (r > 0.6) return 1
      return 0
    }))
  return (
    <div className="contrib-grid">
      {weeks.map((week, wi) => (
        <div key={wi} className="contrib-col">
          {week.map((lvl, di) => <div key={di} className={`contrib-cell contrib-${lvl}`} />)}
        </div>
      ))}
    </div>
  )
}

// ── ANIMATED BAR ──────────────────────────────────────────────
export function AnimBar({ value, max, color, className }) {
  const [w, setW] = useState(0)
  useEffect(() => { setTimeout(() => setW((value / max) * 100), 200) }, [value, max])
  return (
    <div
      className={className || 'lang-fill'}
      style={{ width: `${w}%`, background: color, transition: 'width 1.4s cubic-bezier(0.16,1,0.3,1)' }}
    />
  )
}

// ── USER MENU ─────────────────────────────────────────────────
export function UserMenu({ user, onLogout, onSettings }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])
  const initials = (user.displayName || user.username || 'U').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
  return (
    <div className="sidebar-footer">
      <div className="user-chip" onClick={() => setOpen(p => !p)} ref={ref}>
        <div className="avatar">{initials}</div>
        <div className="user-info">
          <div className="user-name">{user.displayName || user.username}</div>
          <div className="user-handle">@{user.username}</div>
        </div>
        <span className="status-dot" />
        {open && (
          <div className="user-menu">
            <div className="user-menu-item" onClick={e => { e.stopPropagation(); onSettings(); setOpen(false) }}>
              <span>⚙️</span> Settings & Platforms
            </div>
            <div className="user-menu-item" onClick={e => { e.stopPropagation(); setOpen(false) }}>
              <span>👤</span> View Profile
            </div>
            <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }} />
            <div className="user-menu-item danger" onClick={e => { e.stopPropagation(); onLogout(); setOpen(false) }}>
              <span>🚪</span> Log Out
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── SIDEBAR ───────────────────────────────────────────────────
export function Sidebar({ page, setPage, user, onLogout }) {
  const navGroups = [
    { label: 'Overview', items: [
      { id: 'dashboard', icon: '⚡', label: 'Dashboard' },
    ]},
    { label: 'Platforms', items: [
      { id: 'github',     icon: '🐙', label: 'GitHub',     cls: 'gh',      badge: '1.4k' },
      { id: 'leetcode',   icon: '🔥', label: 'LeetCode',   cls: 'lc',      badge: '847' },
      { id: 'codeforces', icon: '⚔️', label: 'Codeforces', cls: 'cf',      badge: '1842' },
      { id: 'hackerrank', icon: '🏆', label: 'HackerRank', cls: 'hr',      badge: '★5' },
    ]},
    { label: 'Features', items: [
      { id: 'devcard',   icon: '🪪', label: 'Dev Card',      cls: 'special', badge: 'NEW' },
      { id: 'wrapped',   icon: '🎁', label: 'Wrapped 2024',  cls: 'special', badge: 'NEW' },
      { id: 'ai',        icon: '🤖', label: 'AI Analysis',   cls: 'special', badge: 'AI' },
      { id: 'portfolio', icon: '📄', label: 'Portfolio',     cls: 'special', badge: 'NEW' },
    ]},
    { label: 'Account', items: [
      { id: 'settings',  icon: '⚙️', label: 'Settings' },
      { id: 'analytics', icon: '📊', label: 'Analytics' },
    ]},
  ]

  return (
    <aside className="sidebar">
      <div className="logo">
        <div className="logo-mark"><div className="logo-dot" />DevPulse</div>
        <div className="logo-sub">v2.5.0 · live</div>
      </div>
      <nav className="nav">
        {navGroups.map(group => (
          <div key={group.label}>
            <div className="nav-section">{group.label}</div>
            {group.items.map(item => (
              <div key={item.id}
                className={`nav-item${item.cls ? ' ' + item.cls : ''}${page === item.id ? ' active' : ''}`}
                onClick={() => setPage(item.id)}>
                <span className="nav-icon">{item.icon}</span>
                {item.label}
                {item.badge === 'NEW' && <span className="nav-new">NEW</span>}
                {item.badge === 'AI'  && <span className="nav-new" style={{ background: 'rgba(88,166,255,0.15)', color: 'var(--gh)' }}>AI</span>}
                {item.badge && item.badge !== 'NEW' && item.badge !== 'AI' && <span className="nav-badge">{item.badge}</span>}
              </div>
            ))}
          </div>
        ))}
      </nav>
      <UserMenu user={user} onLogout={onLogout} onSettings={() => setPage('settings')} />
    </aside>
  )
}
