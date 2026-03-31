import { useState } from 'react'
import { useApp } from '../store/AppContext'

const FUN_FACTS = [
  { icon: '📅', label: 'Most Active Day',  value: 'Wednesday',    sub: 'avg 6.2 commits'   },
  { icon: '⏰', label: 'Peak Hour',        value: '10 PM — 2 AM', sub: 'night owl coder'   },
  { icon: '🌍', label: 'Total Code Time',  value: '847 hrs',      sub: 'estimated this year' },
  { icon: '🏆', label: 'Best Month',       value: 'November',     sub: '219 total activity' },
]

export default function WrappedPage() {
  const { showToast } = useApp()
  const [slide, setSlide] = useState(0)

  const slides = [
    {
      bg: 'linear-gradient(160deg,#001428 0%,#080c10 50%,#000d20 100%)',
      content: (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 13, color: 'var(--muted)', fontFamily: "'JetBrains Mono',monospace", letterSpacing: 2, marginBottom: 8 }}>YOUR</div>
          <div className="wrapped-title">Coding Year</div>
          <div className="wrapped-year">2024 Wrapped</div>
          <div style={{ fontSize: 15, color: 'var(--muted)', marginBottom: 28 }}>Another year of grinding. Here's what you built.</div>
          <div className="wrapped-stats">
            {[{v:'1,482',l:'Contributions',c:'#58a6ff'},{v:'847',l:'Problems Solved',c:'#ffa116'},{v:'1,842',l:'Peak CF Rating',c:'#1890ff'}].map(s => (
              <div key={s.l} className="wrapped-stat">
                <div className="wrapped-stat-num" style={{ color: s.c }}>{s.v}</div>
                <div className="wrapped-stat-lbl">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      bg: 'linear-gradient(160deg,#002800 0%,#080c10 50%,#001500 100%)',
      content: (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 10 }}>🔥</div>
          <div style={{ fontSize: 14, color: 'var(--muted)', fontFamily: "'JetBrains Mono',monospace", letterSpacing: 1, marginBottom: 8 }}>YOUR LONGEST STREAK WAS</div>
          <div style={{ fontSize: 72, fontWeight: 800, letterSpacing: '-4px', color: '#00ea64', lineHeight: 1 }}>91</div>
          <div style={{ fontSize: 18, color: 'var(--text)', marginBottom: 16 }}>consecutive days of coding</div>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 24 }}>
            That puts you in the <span style={{ color: '#00ea64', fontWeight: 700 }}>top 3%</span> of all LeetCode users
          </div>
          <div className="wrapped-badge" style={{ background: 'rgba(0,234,100,0.12)', border: '1px solid rgba(0,234,100,0.3)', color: '#00ea64' }}>
            🏅 Consistency Champion
          </div>
        </div>
      ),
    },
    {
      bg: 'linear-gradient(160deg,#280000 0%,#080c10 50%,#1a0000 100%)',
      content: (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 14, color: 'var(--muted)', fontFamily: "'JetBrains Mono',monospace", letterSpacing: 1, marginBottom: 8 }}>YOU WERE ON FIRE WITH</div>
          <div style={{ fontSize: 56, fontWeight: 800, letterSpacing: '-3px', color: '#ffa116', lineHeight: 1 }}>108</div>
          <div style={{ fontSize: 18, color: 'var(--text)', marginBottom: 12 }}>Hard LeetCode problems solved</div>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>
            Your hardest month was <span style={{ color: '#ffa116', fontWeight: 700 }}>November</span> with 13 Hards
          </div>
          <div className="wrapped-stats" style={{ maxWidth: 320, margin: '0 auto' }}>
            {[{v:'361',l:'Easy Solved',c:'#00ea64'},{v:'378',l:'Medium',c:'#ffa116'},{v:'108',l:'Hard',c:'#f85149'}].map(s => (
              <div key={s.l} className="wrapped-stat" style={{ padding: 12 }}>
                <div className="wrapped-stat-num" style={{ color: s.c, fontSize: 22 }}>{s.v}</div>
                <div className="wrapped-stat-lbl">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      bg: 'linear-gradient(160deg,#001428 0%,#080c10 50%,#001428 100%)',
      content: (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 14, color: 'var(--muted)', fontFamily: "'JetBrains Mono',monospace", letterSpacing: 1, marginBottom: 8 }}>YOUR CODEFORCES JOURNEY</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, marginBottom: 16 }}>
            <div><div style={{ fontSize: 13, color: 'var(--muted)' }}>Started at</div><div style={{ fontSize: 36, fontWeight: 800, color: 'var(--muted)' }}>1200</div></div>
            <div style={{ fontSize: 28, color: 'var(--cf)' }}>→</div>
            <div><div style={{ fontSize: 13, color: 'var(--muted)' }}>Peaked at</div><div style={{ fontSize: 36, fontWeight: 800, color: 'var(--cf)' }}>1956</div></div>
          </div>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>
            +756 rating gained in 2024 · <span style={{ color: 'var(--cf)', fontWeight: 700 }}>42 contests</span> participated
          </div>
          <div className="wrapped-badge" style={{ background: 'rgba(24,144,255,0.12)', border: '1px solid rgba(24,144,255,0.3)', color: 'var(--cf)' }}>⚔️ Expert Rank Unlocked</div>
          <div className="wrapped-stars">
            {[0.1,0.2,0.3,0.4,0.5].map((d, i) => <span key={i} className="wrapped-star" style={{ animationDelay: `${d}s`, color: 'var(--cf)' }}>⭐</span>)}
          </div>
        </div>
      ),
    },
    {
      bg: 'linear-gradient(160deg,#0d0028 0%,#080c10 50%,#1a0040 100%)',
      content: (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 14, color: 'var(--muted)', fontFamily: "'JetBrains Mono',monospace", letterSpacing: 1, marginBottom: 14 }}>YOUR DEVELOPER PERSONALITY</div>
          <div style={{ fontSize: 42, marginBottom: 8 }}>🧠</div>
          <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-1px', marginBottom: 8, background: 'linear-gradient(90deg,#58a6ff,#bc8cff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>The Consistent Climber</div>
          <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7, maxWidth: 320, margin: '0 auto 20px' }}>
            You show up every single day. Your streaks, your steady rating climbs, and your breadth across platforms show someone who values growth over flash.
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
            {['Consistent','Multi-Platform','Problem Solver','Open Source','Competitive'].map((tag, i) => (
              <span key={i} style={{ fontSize: 11, padding: '4px 12px', borderRadius: 20, background: 'rgba(188,140,255,0.12)', border: '1px solid rgba(188,140,255,0.25)', color: 'var(--purple)', fontFamily: "'JetBrains Mono',monospace" }}>{tag}</span>
            ))}
          </div>
        </div>
      ),
    },
  ]

  return (
    <div>
      <div className="topbar">
        <div>
          <div className="page-title">🎁 Wrapped 2024</div>
          <div className="page-sub">Your year in code — Spotify Wrapped style</div>
        </div>
        <div className="topbar-actions">
          <button className="btn btn-accent" onClick={() => showToast('Wrapped card shared!', '🎉')}>🔗 Share</button>
        </div>
      </div>

      <div className="content">
        {/* Progress dots */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16, gap: 6 }}>
          {slides.map((_, i) => (
            <div key={i} onClick={() => setSlide(i)}
              style={{ width: slide === i ? 24 : 8, height: 6, borderRadius: 3, background: slide === i ? 'var(--gh)' : 'var(--bg4)', transition: 'all 0.3s', cursor: 'pointer' }} />
          ))}
        </div>

        {/* Slide */}
        <div style={{ background: slides[slide].bg, borderRadius: 20, padding: '48px 32px', minHeight: 400, display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 2px 2px,rgba(255,255,255,0.015) 1px,transparent 0)', backgroundSize: '32px 32px', pointerEvents: 'none' }} />
          {slides[slide].content}
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 16 }}>
          <button className="btn" onClick={() => setSlide(p => Math.max(p - 1, 0))} disabled={slide === 0}>← Previous</button>
          <span style={{ display: 'flex', alignItems: 'center', fontSize: 12, color: 'var(--muted)', fontFamily: "'JetBrains Mono',monospace" }}>{slide + 1} / {slides.length}</span>
          <button className="btn btn-accent" onClick={() => setSlide(p => Math.min(p + 1, slides.length - 1))} disabled={slide === slides.length - 1}>Next →</button>
        </div>

        {/* Fun facts */}
        <div className="grid-4" style={{ marginTop: 16 }}>
          {FUN_FACTS.map((s, i) => (
            <div key={i} className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: "'JetBrains Mono',monospace", marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 15, fontWeight: 700 }}>{s.value}</div>
              <div style={{ fontSize: 10, color: 'var(--muted2)', fontFamily: "'JetBrains Mono',monospace", marginTop: 2 }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
