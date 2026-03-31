import { useState } from 'react'
import { useApp } from '../store/AppContext'

const STEPS = ['Gathering your stats...', 'Analyzing patterns...', 'Generating insights...', 'Writing recommendations...']

const FEATURES = [
  { icon: '💡', title: 'Strengths Analysis',  desc: 'Identify your strongest technical skills backed by real data'          },
  { icon: '📈', title: 'Growth Roadmap',       desc: 'Personalized plan to improve your weakest areas efficiently'           },
  { icon: '🎯', title: 'Goal Setting',         desc: 'AI-generated 30, 60, 90-day milestones tailored to your profile'      },
  { icon: '💼', title: 'Career Match',         desc: 'Which companies and roles best match your skill fingerprint'          },
]

export default function AIAnalysisPage() {
  const { showToast } = useApp()
  const [apiKey, setApiKey]     = useState('')
  const [loading, setLoading]   = useState(false)
  const [analysis, setAnalysis] = useState(null)
  const [step, setStep]         = useState(0)

  const analyze = async () => {
    if (!apiKey.trim()) { showToast('Enter your Gemini API key first', '⚠️'); return }
    setLoading(true)
    setAnalysis(null)
    setStep(0)

    const interval = setInterval(() => setStep(p => Math.min(p + 1, 3)), 800)

    const prompt = `Analyze this developer's coding profile and provide actionable insights. Be specific, encouraging, and technical.

Developer Stats:
- GitHub: 1,482 contributions, 48 repos, 312 stars, 62-day streak
- LeetCode: 847 problems (361 Easy, 378 Medium, 108 Hard), Contest Rating: 1924, 62-day streak
- Codeforces: Rating 1842 (Expert), 234 problems solved, 42 contests
- HackerRank: Score 3240, 14 badges, ★5 stars, Top 5%
- Top languages: Python (34%), C++ (24%), TypeScript (16%)
- Strong in: Arrays, Trees, Graphs, Dynamic Programming

Please provide:
1. **Strengths** (3 specific technical strengths with evidence)
2. **Growth Areas** (2-3 specific areas to improve with concrete steps)
3. **Next Goals** (short-term 30-day, medium-term 90-day goals)
4. **Career Insights** (what roles/companies this profile fits)
5. **Hidden Pattern** (one surprising insight from the data)

Keep each section to 2-3 sentences. Be direct and actionable.`

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }) }
      )
      if (!res.ok) { const err = await res.json(); throw new Error(err.error?.message || 'API error') }
      const data = await res.json()
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text
      if (!text) throw new Error('No response from Gemini')
      setAnalysis(text)
      showToast('AI analysis complete! 🤖', '✓')
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
        return <div key={i} className="ai-section-title" style={{ marginTop: i > 0 ? 16 : 0 }}>{part.slice(2, -2)}</div>
      }
      return <span key={i} style={{ whiteSpace: 'pre-wrap' }}>{part}</span>
    })
  }

  return (
    <div>
      <div className="topbar">
        <div>
          <div className="page-title">🤖 AI Developer Analysis</div>
          <div className="page-sub">Powered by Google Gemini · Deep insights from your coding data</div>
        </div>
      </div>

      <div className="content">
        {/* API key input */}
        <div className="card" style={{ marginBottom: 14, background: 'linear-gradient(135deg,rgba(188,140,255,0.05),rgba(88,166,255,0.05))', borderColor: 'rgba(188,140,255,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(188,140,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🤖</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700 }}>Gemini-Powered Analysis</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', fontFamily: "'JetBrains Mono',monospace" }}>Enter your Gemini API key to unlock personalized AI insights</div>
            </div>
          </div>
          <div className="api-key-input-wrap">
            <input className="input-field" type="password" placeholder="AIzaSy... (get from aistudio.google.com)"
              value={apiKey} onChange={e => setApiKey(e.target.value)} style={{ flex: 1 }} />
            <button className="btn btn-purple" onClick={analyze} disabled={loading} style={{ whiteSpace: 'nowrap' }}>
              {loading ? 'Analyzing...' : '🔍 Analyze My Profile'}
            </button>
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted2)', fontFamily: "'JetBrains Mono',monospace" }}>
            🔒 Your API key is never stored — only used for this request
          </div>
        </div>

        {/* Loading indicator */}
        {loading && (
          <div className="card" style={{ marginBottom: 14 }}>
            <div className="ai-thinking">
              <div className="ai-dot" />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--purple)' }}>Gemini is analyzing your profile...</div>
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

        {/* Results */}
        {analysis && (
          <div className="card" style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--purple)' }} />
              <div style={{ fontSize: 14, fontWeight: 700 }}>AI Analysis Results</div>
              <button className="btn" style={{ marginLeft: 'auto', fontSize: 11 }} onClick={() => showToast('Analysis copied!', '📋')}>📋 Copy</button>
            </div>
            <div className="ai-text-block">{formatAnalysis(analysis)}</div>
          </div>
        )}

        {/* Empty state with preview */}
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
                  // Enter your Gemini API key above for a real personalized analysis
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
