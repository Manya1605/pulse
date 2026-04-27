import { useState } from 'react'
import { useApp } from '../store/AppContext'
import { apiCall } from '../config/api'

const STEPS = ['Fetching platform data...', 'Analyzing patterns...', 'Generating insights...', 'Writing recommendations...']

const PLATFORMS = [
  { key: 'github',     icon: '🐙', label: 'GitHub',     placeholder: 'e.g. torvalds',       color: 'var(--gh)' },
  { key: 'leetcode',   icon: '🔥', label: 'LeetCode',   placeholder: 'e.g. neal_wu',         color: 'var(--lc)' },
  { key: 'codeforces', icon: '⚔️', label: 'Codeforces', placeholder: 'e.g. tourist',         color: 'var(--cf)' },
  { key: 'hackerrank', icon: '🏆', label: 'HackerRank', placeholder: 'e.g. monalsehrawat20', color: 'var(--hr)' },
]

const FEATURES = [
  { icon: '💡', title: 'Strengths Analysis',  desc: 'Identify your strongest technical skills backed by real live data'     },
  { icon: '📈', title: 'Growth Roadmap',       desc: 'Personalized plan to improve your weakest areas efficiently'           },
  { icon: '🎯', title: '30-Day Action Plan',   desc: 'AI-generated specific goals tailored to your actual profile stats'    },
  { icon: '💼', title: 'Career Match',         desc: 'Which companies and roles best match your skill fingerprint'          },
]

export default function AIAnalysisPage() {
  const { showToast, currentUser } = useApp()
  const [handles, setHandles] = useState({
    github:     currentUser?.githubUsername     || '',
    leetcode:   currentUser?.leetcodeUsername   || '',
    codeforces: currentUser?.codeforcesHandle   || '',
    hackerrank: currentUser?.hackerrankUsername || '',
  })
  const [loading, setLoading]     = useState(false)
  const [analysis, setAnalysis]   = useState(null)
  const [platforms, setPlatforms] = useState(null)
  const [step, setStep]           = useState(0)

  const hasAtLeastOne = Object.values(handles).some(v => v.trim())

  const analyze = async () => {
    if (!hasAtLeastOne) { showToast('Enter at least one platform username', '⚠️'); return }
    setLoading(true)
    setAnalysis(null)
    setPlatforms(null)
    setStep(0)

    const interval = setInterval(() => setStep(p => Math.min(p + 1, 3)), 1200)

    try {
      const data = await apiCall('/ai/analyze-username', {
        method: 'POST',
        body: JSON.stringify({
          github:     handles.github.trim()     || undefined,
          leetcode:   handles.leetcode.trim()   || undefined,
          codeforces: handles.codeforces.trim() || undefined,
          hackerrank: handles.hackerrank.trim() || undefined,
        }),
      })
      setAnalysis(data.analysis)
      setPlatforms(data.platforms)
      showToast('AI analysis complete & saved to database! 🤖✓', '✓')
    } catch (err) {
      showToast(`Error: ${err.message}`, '❌')
    } finally {
      clearInterval(interval)
      setLoading(false)
    }
  }

  const formatAnalysis = (text) => {
    if (!text) return null
    return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <div key={i} className="ai-section-title" style={{ marginTop: i > 0 ? 20 : 0 }}>{part.slice(2, -2)}</div>
      }
      return <span key={i} style={{ whiteSpace: 'pre-wrap' }}>{part}</span>
    })
  }

  const platformColor = { loaded: '#3fb950', failed: '#f85149', 'not provided': 'var(--muted2)' }
  const platformLabel = { loaded: '✅ loaded', failed: '⚠️ failed', 'not provided': '— skipped' }

  return (
    <div>
      <div className="topbar">
        <div>
          <div className="page-title">🤖 AI Developer Analysis</div>
          <div className="page-sub">Powered by Ollama · Enter platform usernames to get live AI insights</div>
        </div>
      </div>

      <div className="content">

        {/* ── Username search card ─────────────────────────────── */}
        <div className="card" style={{ marginBottom: 14, background: 'linear-gradient(135deg,rgba(188,140,255,0.05),rgba(88,166,255,0.05))', borderColor: 'rgba(188,140,255,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(188,140,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🤖</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700 }}>Gemini-Powered Profile Analysis</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', fontFamily: "'JetBrains Mono',monospace" }}>Enter usernames below — fetches live data then generates AI insights via Ollama</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            {PLATFORMS.map(p => (
              <div key={p.key} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg2)', borderRadius: 8, border: `1px solid ${handles[p.key].trim() ? p.color : 'var(--border)'}`, padding: '0 12px', transition: 'border-color 0.2s' }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>{p.icon}</span>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '8px 0' }}>
                  <span style={{ fontSize: 10, color: p.color, fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase' }}>{p.label}</span>
                  <input
                    type="text"
                    placeholder={p.placeholder}
                    value={handles[p.key]}
                    onChange={e => setHandles(h => ({ ...h, [p.key]: e.target.value }))}
                    onKeyDown={e => e.key === 'Enter' && analyze()}
                    style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--fg)', fontSize: 13, padding: 0, fontFamily: "'JetBrains Mono',monospace" }}
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            className="btn btn-purple"
            onClick={analyze}
            disabled={loading || !hasAtLeastOne}
            style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: 14, fontWeight: 700 }}
          >
            {loading ? 'Analyzing...' : '🔍 Analyze Profile'}
          </button>

          <div style={{ fontSize: 11, color: 'var(--muted2)', fontFamily: "'JetBrains Mono',monospace", marginTop: 10, textAlign: 'center' }}>
            🔒 AI runs via your Ollama endpoint — API key never exposed to the browser
          </div>
        </div>

        {/* ── Loading indicator ────────────────────────────────── */}
        {loading && (
          <div className="card" style={{ marginBottom: 14 }}>
            <div className="ai-thinking">
              <div className="ai-dot" />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--purple)' }}>Ollama is analyzing your profile...</div>
                <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: "'JetBrains Mono',monospace", marginTop: 2 }}>{STEPS[step]}</div>
              </div>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
                {STEPS.map((_, i) => (
                  <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: i <= step ? 'var(--purple)' : 'var(--bg4)', transition: 'background 0.3s' }} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Platform status badges ───────────────────────────── */}
        {platforms && !loading && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
            {PLATFORMS.map(p => {
              const status = platforms[p.key] || 'not provided'
              return (
                <div key={p.key} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 20, padding: '4px 12px', fontSize: 11, fontFamily: "'JetBrains Mono',monospace" }}>
                  <span>{p.icon}</span>
                  <span style={{ color: platformColor[status] }}>{p.label} {platformLabel[status]}</span>
                </div>
              )
            })}
          </div>
        )}

        {/* ── Results ──────────────────────────────────────────── */}
        {analysis && (
          <div className="card" style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--purple)' }} />
              <div style={{ fontSize: 14, fontWeight: 700 }}>AI Analysis Results</div>
              <div style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--muted)', fontFamily: "'JetBrains Mono',monospace" }}>ollama</div>
              <button className="btn" style={{ fontSize: 11 }} onClick={() => { navigator.clipboard.writeText(analysis); showToast('Analysis copied!', '📋') }}>📋 Copy</button>
            </div>
            <div className="ai-text-block">{formatAnalysis(analysis)}</div>
          </div>
        )}

        {/* ── Empty state / preview ────────────────────────────── */}
        {!analysis && !loading && (
          <>
            <div className="grid-2">
              {FEATURES.map((f, i) => (
                <div key={i} className="card">
                  <div style={{ fontSize: 28, marginBottom: 10 }}>{f.icon}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>{f.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.6 }}>{f.desc}</div>
                </div>
              ))}
            </div>

            <div className="card" style={{ background: 'rgba(188,140,255,0.03)', borderColor: 'rgba(188,140,255,0.15)' }}>
              <div className="card-header"><div className="card-title">💬 Sample Analysis Preview</div></div>
              <div className="ai-text-block">
                <div className="ai-section-title">Strengths</div>
                <p>Your 62-day streak across both GitHub and LeetCode demonstrates exceptional consistency — a rare trait that top companies value above raw skill. Your Expert-rated Codeforces profile combined with 847 LeetCode solves shows you're equally strong in competitive and practical programming.</p>
                <div className="ai-section-title" style={{ marginTop: 14 }}>Growth Areas</div>
                <p>Your Hard problem ratio (12.7%) is below average for your rating bracket. Spending 20 minutes daily on Hard DP problems would push your LeetCode rating past 2100 within 60 days.</p>
                <div style={{ marginTop: 12, fontSize: 11, color: 'var(--muted2)', fontFamily: "'JetBrains Mono',monospace", fontStyle: 'italic' }}>
                  // Enter your usernames above for a real personalized analysis powered by Ollama
                </div>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  )
}
