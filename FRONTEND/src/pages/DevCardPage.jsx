import { useState, useEffect } from 'react'
import { useApp } from '../store/AppContext'
import { apiCall } from '../config/api'

const THEMES = {
  blue:   { from: '#0d1117', to: '#161b22', acc: '#58a6ff',  glow: 'rgba(88,166,255,0.12)'  },
  purple: { from: '#0d0028', to: '#1a0040', acc: '#bc8cff',  glow: 'rgba(188,140,255,0.12)' },
  green:  { from: '#001a0d', to: '#0d2218', acc: '#00ea64',  glow: 'rgba(0,234,100,0.12)'   },
  orange: { from: '#1a0d00', to: '#281800', acc: '#ffa116',  glow: 'rgba(255,161,22,0.12)'  },
}

export default function DevCardPage() {
  const { showToast, currentUser } = useApp()
  const [copied, setCopied] = useState(false)
  const [theme, setTheme] = useState('blue')
  const [data, setData] = useState({ github: null, leetcode: null, codeforces: null, hackerrank: null })
  const [loading, setLoading] = useState(true)
  const t = THEMES[theme]

  // Fetch real data from all platforms
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const newData = { github: null, leetcode: null, codeforces: null, hackerrank: null }
      
      try {
        const gh = await apiCall('/github/me')
        newData.github = gh
      } catch (err) {
        console.log('GitHub not connected')
      }
      
      try {
        const lc = await apiCall('/leetcode/me')
        newData.leetcode = lc
      } catch (err) {
        console.log('LeetCode not connected')
      }
      
      try {
        const cf = await apiCall('/codeforces/me')
        newData.codeforces = cf
      } catch (err) {
        console.log('Codeforces not connected')
      }
      
      try {
        const hr = await apiCall('/hackerrank/me')
        newData.hackerrank = hr
      } catch (err) {
        console.log('HackerRank not connected')
      }
      
      setData(newData)
      setLoading(false)
    }

    fetchData()
  }, [currentUser])

  const copyLink = () => {
    const username = currentUser?.username || 'arjunkumar'
    navigator.clipboard.writeText(`https://devpulse.dev/card/${username}`).catch(() => {})
    setCopied(true)
    showToast('Link copied to clipboard!', '📋')
    setTimeout(() => setCopied(false), 2000)
  }

  // Build card stats from real data
  const buildCardStats = () => {
    const stats = []
    if (data.github) {
      stats.push({ v: (data.github.totalCommitContributions || 0).toLocaleString(), l: 'Commits', c: 'var(--gh)' })
    }
    if (data.leetcode) {
      stats.push({ v: (data.leetcode.totalSolved || 0).toLocaleString(), l: 'LC Solved', c: 'var(--lc)' })
    }
    if (data.codeforces) {
      stats.push({ v: (data.codeforces.rating || 0).toLocaleString(), l: 'CF Rating', c: 'var(--cf)' })
    }
    if (data.hackerrank) {
      stats.push({ v: `★${data.hackerrank.badges || 0}`, l: 'HR Stars', c: 'var(--hr)' })
    }
    return stats.length > 0 ? stats : [
      { v: '0', l: 'Contributions', c: 'var(--gh)' },
      { v: '0', l: 'LC Solved', c: 'var(--lc)' },
    ]
  }

  // Get top languages from GitHub
  const getTopLanguages = () => {
    if (!data.github?.languagePercent) return ['Python', 'TypeScript', 'JavaScript']
    return Object.keys(data.github.languagePercent).slice(0, 3)
  }

  // Build platform links
  const getPlatformLinks = () => {
    const links = []
    if (data.github) links.push(`🐙 github.com/${data.github.username}`)
    if (data.leetcode) links.push(`🔥 leetcode.com/${data.leetcode.username}`)
    if (data.codeforces) links.push(`⚔️ codeforces.com/profile/${data.codeforces.handle}`)
    if (data.hackerrank) links.push(`🏆 hackerrank.com/${data.hackerrank.username}`)
    return links
  }

  // Calculate initials from user name
  const getInitials = () => {
    if (!currentUser?.displayName) return 'DP'
    const parts = currentUser.displayName.split(' ')
    return parts.map(p => p[0]).join('').toUpperCase().slice(0, 2)
  }

  const cardStats = buildCardStats()
  const topLanguages = getTopLanguages()
  const platformLinks = getPlatformLinks()
  const initials = getInitials()
  const displayName = currentUser?.displayName || 'Developer'
  const displayUsername = currentUser?.username || 'developer'

  const shareOpts = [
    { icon: '🔗', label: 'Copy profile link',  sub: `devpulse.dev/card/${displayUsername}`   },
    { icon: '𝕏',  label: 'Share on Twitter/X', sub: 'Post your stats automatically'   },
    { icon: '💼', label: 'Add to LinkedIn',     sub: 'As a featured section'           },
    { icon: '📧', label: 'Email signature',     sub: 'Embed in your email footer'      },
  ]

  return (
    <div>
      <div className="topbar">
        <div>
          <div className="page-title">🪪 Developer Card</div>
          <div className="page-sub">Your shareable coding identity card {loading ? '(loading...)' : ''}</div>
        </div>
        <div className="topbar-actions">
          <button className="btn" onClick={copyLink}>{copied ? '✓ Copied' : '🔗 Copy Link'}</button>
          <button className="btn btn-accent" onClick={() => showToast('Card downloaded!', '📥')}>📥 Download PNG</button>
        </div>
      </div>

      <div className="content">
        <div className="grid-2">
          {/* Left: Theme picker + Card preview */}
          <div>
            <div className="card" style={{ marginBottom: 14 }}>
              <div className="card-header"><div className="card-title">Card Theme</div></div>
              <div style={{ display: 'flex', gap: 8 }}>
                {Object.keys(THEMES).map(tk => (
                  <button key={tk} onClick={() => setTheme(tk)}
                    style={{ flex: 1, padding: '8px', borderRadius: 8, border: `2px solid ${theme === tk ? THEMES[tk].acc : 'var(--border)'}`, background: THEMES[tk].from, cursor: 'pointer', color: 'var(--text)', fontSize: 11, fontFamily: "'JetBrains Mono',monospace", transition: 'all 0.2s', textTransform: 'capitalize' }}>
                    {tk}
                  </button>
                ))}
              </div>
            </div>

            {/* Live card preview */}
            <div style={{ background: `linear-gradient(135deg,${t.from} 0%,${t.to} 100%)`, border: `1px solid ${t.acc}30`, borderRadius: 16, padding: 28, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: '50%', background: `radial-gradient(circle,${t.glow},transparent 70%)` }} />
              <div style={{ position: 'absolute', bottom: -60, left: -20, width: 140, height: 140, borderRadius: '50%', background: `radial-gradient(circle,${t.glow},transparent 70%)` }} />

              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
                <div style={{ width: 52, height: 52, borderRadius: 12, background: `linear-gradient(135deg,${t.acc},#bc8cff)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 800, color: '#0d1117', flexShrink: 0 }}>{initials}</div>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.5px', color: 'var(--text)' }}>{displayName}</div>
                  <div style={{ fontSize: 11, color: t.acc, fontFamily: "'JetBrains Mono',monospace", marginTop: 2 }}>@{displayUsername} · Full-Stack Dev</div>
                </div>
                <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                  <div style={{ fontSize: 9, color: 'var(--muted)', fontFamily: "'JetBrains Mono',monospace", letterSpacing: 1 }}>DEVPULSE</div>
                  <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-1px', color: t.acc }}>{cardStats[0]?.v || '0'}</div>
                  <div style={{ fontSize: 8, color: 'var(--muted)', fontFamily: "'JetBrains Mono',monospace" }}>SCORE</div>
                </div>
              </div>

              {/* Tags */}
              <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
                {[
                  { bg: `${t.acc}20`, c: t.acc,     txt: topLanguages[0] || 'Python'     },
                  { bg: 'rgba(248,81,73,0.12)',  c: '#f85149',  txt: topLanguages[1] || 'TypeScript' },
                  { bg: 'rgba(188,140,255,0.12)',c: '#bc8cff',  txt: topLanguages[2] || 'JavaScript' },
                  { bg: 'rgba(0,234,100,0.12)',  c: '#00ea64',  txt: 'Expert'     },
                ].map((tag, i) => (
                  <span key={i} style={{ fontSize: 10, padding: '3px 9px', borderRadius: 20, border: `1px solid ${tag.c}40`, background: tag.bg, color: tag.c, fontFamily: "'JetBrains Mono',monospace" }}>{tag.txt}</span>
                ))}
              </div>

              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(cardStats.length, 4)},1fr)`, gap: 10, borderTop: `1px solid ${t.acc}20`, paddingTop: 16 }}>
                {cardStats.map(s => (
                  <div key={s.l} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: s.c, letterSpacing: '-0.5px' }}>{s.v}</div>
                    <div style={{ fontSize: 9, color: 'var(--muted)', fontFamily: "'JetBrains Mono',monospace", textTransform: 'uppercase', letterSpacing: '0.8px', marginTop: 2 }}>{s.l}</div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div style={{ marginTop: 16, paddingTop: 14, borderTop: `1px solid ${t.acc}15`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 14 }}>
                  {platformLinks.length > 0 ? platformLinks.map((l, i) => (
                    <span key={i} style={{ fontSize: 10, color: 'var(--muted)', fontFamily: "'JetBrains Mono',monospace" }}>{l}</span>
                  )) : (
                    <span style={{ fontSize: 10, color: 'var(--muted)', fontFamily: "'JetBrains Mono',monospace" }}>🔗 Connect accounts in Settings</span>
                  )}
                </div>
                <div style={{ fontSize: 9, color: t.acc, fontFamily: "'JetBrains Mono',monospace", opacity: 0.6 }}>devpulse.dev</div>
              </div>
            </div>
          </div>

          {/* Right: Share options + Embed */}
          <div>
            <div className="card" style={{ marginBottom: 14 }}>
              <div className="card-header"><div className="card-title">Share Options</div></div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {shareOpts.map((opt, i) => (
                  <div key={i}
                    onClick={() => showToast(`${opt.label} — coming soon!`, '⚡')}
                    style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, cursor: 'pointer', transition: 'border-color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border2)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                    <span style={{ fontSize: 20, width: 28, textAlign: 'center' }}>{opt.icon}</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{opt.label}</div>
                      <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: "'JetBrains Mono',monospace", marginTop: 2 }}>{opt.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="card">
              <div className="card-header"><div className="card-title">Embed Code</div></div>
              <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, padding: 12, fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: 'var(--muted)', lineHeight: 1.6, overflowX: 'auto' }}>
                {`<iframe src="https://devpulse.dev/embed/${displayUsername}" width="420" height="200" frameborder="0" style="border-radius:12px"></iframe>`}
              </div>
              <button className="btn" style={{ width: '100%', marginTop: 10 }} onClick={() => {
                navigator.clipboard.writeText(`<iframe src="https://devpulse.dev/embed/${displayUsername}" width="420" height="200" frameborder="0" style="border-radius:12px"></iframe>`).catch(() => {})
                showToast('Embed code copied!', '📋')
              }}>Copy Embed Code</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
