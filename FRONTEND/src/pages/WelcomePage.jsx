import { useState, useEffect } from 'react'
import { useApp } from '../store/AppContext'

export default function WelcomePage() {
  const { setPage, currentUser } = useApp()
  const [time, setTime] = useState('')

  useEffect(() => {
    const tick = () => {
      setTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  const hour      = new Date().getHours()
  const greeting  = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const greetEmoji = hour < 12 ? '☀️' : hour < 17 ? '⚡' : '🌙'
  const name      = currentUser?.displayName || currentUser?.username || 'Developer'
  const firstName = name.split(' ')[0]

  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i, size: 2 + Math.random() * 4,
    left: Math.random() * 100,
    dur: 8 + Math.random() * 12,
    delay: -Math.random() * 14,
    color: ['#58a6ff','#bc8cff','#ff7eb6','#00ea64','#ffa116'][Math.floor(Math.random() * 5)],
  }))

  const features = [
    { icon: '📊', title: 'All-In-One Dashboard',   desc: 'GitHub, LeetCode, Codeforces, and HackerRank in one unified live view.',      page: 'dashboard', color: 'rgba(88,166,255,0.08)',   border: 'rgba(88,166,255,0.2)' },
    { icon: '🤖', title: 'AI Developer Analysis',   desc: 'Gemini-powered deep dive into your coding patterns and career opportunities.', page: 'ai',        color: 'rgba(188,140,255,0.08)',  border: 'rgba(188,140,255,0.2)' },
    { icon: '🎁', title: '2024 Wrapped',            desc: 'Your year in code. Spotify-style slides revealing your biggest milestones.',   page: 'wrapped',   color: 'rgba(255,126,182,0.08)',  border: 'rgba(255,126,182,0.2)' },
    { icon: '🪪', title: 'Shareable Dev Card',      desc: 'A beautiful card with your stats. Share on Twitter, LinkedIn, or embed anywhere.', page: 'devcard', color: 'rgba(0,234,100,0.06)',   border: 'rgba(0,234,100,0.2)' },
    { icon: '📄', title: 'Portfolio Generator',     desc: 'Auto-build a resume and GitHub README from your activity — download as PDF.', page: 'portfolio', color: 'rgba(255,161,22,0.06)',   border: 'rgba(255,161,22,0.2)' },
    { icon: '⚔️', title: 'Contest Tracker',         desc: 'Full contest history, rating progressions, and rank breakdowns.',             page: 'codeforces', color: 'rgba(24,144,255,0.08)',  border: 'rgba(24,144,255,0.2)' },
  ]

  const tips = [
    { icon: '💡', title: 'Pro tip: Streak Protection',  text: "Your LeetCode streak resets at midnight UTC. Set a daily reminder for 11 PM to solve at least one easy problem." },
    { icon: '🎯', title: 'Next milestone',               text: "You're 58 rating points away from Candidate Master on Codeforces. Focus on 1800–2000 rated DP problems this week." },
    { icon: '📈', title: 'Your best time to code',       text: "Your commit history shows your highest quality pushes happen between 9–11 PM. Block that time." },
    { icon: '🔥', title: 'Streak at risk',               text: "Keep your 62-day streak alive! You haven't submitted to LeetCode today. Solve a quick easy now." },
  ]

  const platforms = [
    { icon: '🐙', name: 'GitHub',     val: '1,482', lbl: 'Contributions', page: 'github',     color: 'var(--gh)' },
    { icon: '🔥', name: 'LeetCode',   val: '847',   lbl: 'Problems',      page: 'leetcode',   color: 'var(--lc)' },
    { icon: '⚔️', name: 'Codeforces', val: '1,842', lbl: 'Rating',        page: 'codeforces', color: 'var(--cf)' },
    { icon: '🏆', name: 'HackerRank', val: '3,240', lbl: 'Score',         page: 'hackerrank', color: 'var(--hr)' },
  ]

  const achievements = [
    { icon: '🔥', label: '62-Day Streak', sub: 'LeetCode',      c: 'rgba(255,161,22,0.12)',  bc: 'rgba(255,161,22,0.3)',   tc: 'var(--lc)' },
    { icon: '⚔️', label: 'Expert Rank',   sub: 'Codeforces',    c: 'rgba(24,144,255,0.12)',  bc: 'rgba(24,144,255,0.3)',   tc: 'var(--cf)' },
    { icon: '🥇', label: 'Gold Badge',    sub: 'HackerRank PS', c: 'rgba(0,234,100,0.08)',   bc: 'rgba(0,234,100,0.25)',   tc: 'var(--hr)' },
    { icon: '⭐', label: '312 Stars',     sub: 'GitHub repos',  c: 'rgba(88,166,255,0.08)',  bc: 'rgba(88,166,255,0.25)',  tc: 'var(--gh)' },
    { icon: '🏆', label: 'Hard Solver',   sub: '108 Hard LC',   c: 'rgba(248,81,73,0.08)',   bc: 'rgba(248,81,73,0.25)',   tc: '#f85149' },
    { icon: '💎', label: 'Top 5% Global', sub: 'HackerRank',    c: 'rgba(188,140,255,0.08)', bc: 'rgba(188,140,255,0.25)', tc: 'var(--purple)' },
  ]

  return (
    <div className="welcome-page" style={{ overflowY: 'auto', height: '100vh' }}>
      <div className="welcome-progress-bar" />

      {/* Top nav */}
      <nav className="welcome-nav">
        <div className="welcome-nav-logo">
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--gh)', boxShadow: '0 0 10px rgba(88,166,255,0.6)' }} />
          DevPulse
        </div>
        <div className="welcome-time">{greetEmoji} &nbsp;{time}</div>
        <div className="welcome-nav-actions">
          <button className="btn" onClick={() => setPage('settings')}>⚙️ Settings</button>
          <button className="welcome-btn-primary" style={{ padding: '8px 20px', fontSize: 13 }} onClick={() => setPage('dashboard')}>
            Open Dashboard →
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div className="welcome-hero" style={{ paddingTop: 100 }}>
        <div className="welcome-grid-bg" />
        <div className="welcome-orb" style={{ width: 600, height: 600, background: 'radial-gradient(circle,rgba(88,166,255,0.06),transparent 70%)', top: '10%', left: '10%', animationDuration: '8s' }} />
        <div className="welcome-orb" style={{ width: 500, height: 500, background: 'radial-gradient(circle,rgba(188,140,255,0.05),transparent 70%)', top: '20%', right: '5%', animationDuration: '11s', animationDelay: '-4s' }} />
        <div className="welcome-orb" style={{ width: 300, height: 300, background: 'radial-gradient(circle,rgba(255,126,182,0.04),transparent 70%)', bottom: '20%', left: '30%', animationDuration: '9s', animationDelay: '-2s' }} />

        <div className="welcome-particles">
          {particles.map(p => (
            <div key={p.id} className="welcome-particle" style={{ width: p.size, height: p.size, left: `${p.left}%`, background: p.color, opacity: 0.4, animationDuration: `${p.dur}s`, animationDelay: `${p.delay}s` }} />
          ))}
        </div>

        <div className="welcome-badge">
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--gh)', display: 'inline-block' }} />
          All systems live · Last synced just now
        </div>

        <h1 className="welcome-greeting">
          <span className="hi">{greeting}, </span>
          <span className="name-gradient">{firstName}</span>
          <span className="hi">.</span>
        </h1>

        <p className="welcome-sub">
          Your developer command center is ready.{' '}
          <strong style={{ color: 'var(--text)' }}>1,482 contributions</strong>,{' '}
          <strong style={{ color: 'var(--text)' }}>847 problems solved</strong>, and a{' '}
          <strong style={{ color: 'var(--hr)' }}>62-day streak</strong> — here's everything at a glance.
        </p>

        <div className="welcome-actions">
          <button className="welcome-btn-primary" onClick={() => setPage('dashboard')}>⚡ Open Dashboard</button>
          <button className="welcome-btn-secondary" onClick={() => setPage('ai')}>🤖 Run AI Analysis</button>
          <button className="welcome-btn-secondary" onClick={() => setPage('wrapped')}>🎁 View 2024 Wrapped</button>
        </div>

        <div className="welcome-stats-bar">
          {platforms.map(p => (
            <div key={p.name} className={`welcome-stat-pill s-${p.page.slice(0,2)}`} onClick={() => setPage(p.page)}>
              <div style={{ fontSize: 11, marginBottom: 4 }}>
                {p.icon} <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1 }}>{p.name}</span>
              </div>
              <div className="welcome-pill-val" style={{ color: p.color }}>{p.val}</div>
              <div className="welcome-pill-lbl">{p.lbl}</div>
            </div>
          ))}
        </div>

        <div className="welcome-scroll-hint">↓ scroll to explore</div>
      </div>

      {/* Features */}
      <div className="welcome-section">
        <div className="welcome-section-label">What's inside</div>
        <div className="welcome-section-title">Everything you need, in one place</div>
        <div className="welcome-section-sub">Seven powerful tools built around your coding identity — from live stats to AI-powered insights.</div>
        <div className="welcome-feature-grid">
          {features.map(f => (
            <div key={f.title} className="welcome-feature-card" onClick={() => setPage(f.page)}
              onMouseEnter={e => { e.currentTarget.style.borderColor = f.border; e.currentTarget.querySelector('.wfc-after').style.opacity = 1 }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.querySelector('.wfc-after').style.opacity = 0 }}>
              <div className="wfc-after" style={{ position: 'absolute', inset: 0, background: f.color, opacity: 0, transition: 'opacity 0.25s', pointerEvents: 'none', borderRadius: 14 }} />
              <span className="wfc-icon">{f.icon}</span>
              <div className="wfc-title">{f.title}</div>
              <div className="wfc-desc">{f.desc}</div>
              <span className="wfc-arrow">↗</span>
            </div>
          ))}
        </div>
      </div>

      {/* Platforms */}
      <div style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'var(--bg2)', padding: '48px 40px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="welcome-section-label">Platforms</div>
          <div className="welcome-section-title" style={{ marginBottom: 28 }}>Your linked accounts</div>
          <div className="welcome-platform-row">
            {platforms.map(p => (
              <div key={p.name} className="welcome-platform-mini" onClick={() => setPage(p.page)}>
                <div className="wpm-icon">{p.icon}</div>
                <div className="wpm-name">{p.name}</div>
                <div className="wpm-val" style={{ color: p.color }}>{p.val}</div>
                <div className="wpm-lbl">{p.lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="welcome-section">
        <div className="welcome-section-label">Personalized for you</div>
        <div className="welcome-section-title">Today's insights</div>
        <div className="welcome-section-sub">Smart nudges based on your coding patterns and goals.</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 14 }}>
          {tips.map((tip, i) => (
            <div key={i} className="welcome-tip-card">
              <div className="welcome-tip-icon">{tip.icon}</div>
              <div className="welcome-tip-title">{tip.title}</div>
              <div className="welcome-tip-text">{tip.text}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border)', padding: '40px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="welcome-section-label" style={{ textAlign: 'center', marginBottom: 24 }}>Recent achievements</div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            {achievements.map((a, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 18px', background: a.c, border: `1px solid ${a.bc}`, borderRadius: 30, transition: 'transform 0.2s', cursor: 'default' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                <span style={{ fontSize: 18 }}>{a.icon}</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: a.tc }}>{a.label}</div>
                  <div style={{ fontSize: 10, color: 'var(--muted)', fontFamily: "'JetBrains Mono',monospace" }}>{a.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="welcome-cta-section">
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ fontSize: 14, color: 'var(--gh)', fontFamily: "'JetBrains Mono',monospace", textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>Ready to dive in?</div>
          <div className="welcome-cta-title">
            Your code tells a story.{' '}
            <span style={{ background: 'linear-gradient(90deg,#58a6ff,#bc8cff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Let's read it.</span>
          </div>
          <div className="welcome-cta-sub">Every commit, every problem, every contest — all woven into a single picture of who you are as a developer.</div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="welcome-btn-primary" style={{ fontSize: 15, padding: '14px 36px' }} onClick={() => setPage('dashboard')}>⚡ Open Dashboard</button>
            <button className="welcome-btn-secondary" style={{ fontSize: 15, padding: '14px 36px' }} onClick={() => setPage('devcard')}>🪪 Generate Dev Card</button>
            <button className="welcome-btn-secondary" style={{ fontSize: 15, padding: '14px 36px' }} onClick={() => setPage('portfolio')}>📄 Build Portfolio</button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border)', padding: '24px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: 'var(--muted2)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--gh)' }} />
          DevPulse v2.5.0 · All systems operational
        </div>
        <div style={{ fontSize: 11, color: 'var(--muted2)', fontFamily: "'JetBrains Mono',monospace" }}>
          Logged in as @{currentUser?.username} · {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </div>
      </div>
    </div>
  )
}
