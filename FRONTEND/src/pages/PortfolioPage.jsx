import { useState } from 'react'
import { useApp, MOCK } from '../store/AppContext'

const TABS = [
  { id: 'resume',    label: '📄 Resume'        },
  { id: 'portfolio', label: '🌐 Portfolio Site' },
  { id: 'readme',    label: '📝 GitHub README'  },
]

const EXPORT_FORMATS = [
  { icon: '📄', f: 'PDF',      d: 'Print-ready A4 format'    },
  { icon: '📝', f: 'Markdown', d: 'For GitHub or docs'       },
  { icon: '🌐', f: 'HTML',     d: 'Web-friendly format'      },
  { icon: '📊', f: 'JSON',     d: 'For API integrations'     },
]

const README_WIDGETS = ['GitHub Stats Card','Top Languages Card','Streak Stats','Trophy Case','Contribution Graph','WakaTime Stats','LeetCode Stats']

function ResumePreview() {
  const skills = ['Python','C++','TypeScript','Java','Go','Rust','React','Spring Boot','Dynamic Programming','Graph Algorithms','System Design','REST APIs','PostgreSQL','Redis','Docker']
  return (
    <div className="resume-preview">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div className="resume-name">Arjun Kumar</div>
          <div className="resume-title">Full-Stack Developer · Competitive Programmer</div>
        </div>
        <div style={{ textAlign: 'right', fontSize: 11, color: '#666' }}>
          <div>arjun@dev.com</div>
          <div>github.com/arjunkumar</div>
          <div>leetcode.com/arjun_codes</div>
        </div>
      </div>
      <div className="resume-contact">
        <span>📍 Chandigarh, India</span>
        <span>⭐ 312 GitHub Stars</span>
        <span>🏆 LeetCode Expert (1924)</span>
        <span>⚔️ CF Expert (1842)</span>
      </div>

      <div className="resume-section">
        <div className="resume-section-title">Competitive Programming</div>
        <ul style={{ paddingLeft: 16, fontSize: 12, color: '#333', lineHeight: 1.8 }}>
          <li><strong>LeetCode:</strong> 847 problems solved (361 Easy, 378 Medium, 108 Hard) · Contest Rating: 1924 · 62-day streak</li>
          <li><strong>Codeforces:</strong> Expert (1842) · Max Rating: 1956 · 42 contests · 234 problems solved</li>
          <li><strong>HackerRank:</strong> Score 3240 · 5-Star in Problem Solving, Python, SQL · Top 5% globally</li>
        </ul>
      </div>

      <div className="resume-section">
        <div className="resume-section-title">GitHub Activity</div>
        <ul style={{ paddingLeft: 16, fontSize: 12, color: '#333', lineHeight: 1.8 }}>
          <li>1,482 contributions in 2024 · 62-day active streak · 48 public repositories</li>
          <li>312 total stars · 127 forks · 234 followers</li>
        </ul>
      </div>

      <div className="resume-section">
        <div className="resume-section-title">Open Source Projects</div>
        {MOCK.github.topRepos.slice(0, 3).map(r => (
          <div key={r.name} className="resume-project">
            <div className="resume-project-name">{r.name} <span style={{ fontWeight: 400, color: '#1890ff', fontSize: 11 }}>⭐ {r.stars}</span></div>
            <div className="resume-project-desc">{r.desc} · {r.language}</div>
          </div>
        ))}
      </div>

      <div className="resume-section">
        <div className="resume-section-title">Technical Skills</div>
        <div className="resume-skill-tags">
          {skills.map(s => <span key={s} className="resume-skill">{s}</span>)}
        </div>
      </div>
    </div>
  )
}

function ReadmePreview() {
  return (
    <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 12, padding: 24, fontFamily: "'JetBrains Mono',monospace", fontSize: 12, lineHeight: 1.8, color: 'var(--text)' }}>
      <div style={{ color: 'var(--gh)', fontSize: 14, fontWeight: 700, marginBottom: 4 }}>### Hi there, I'm Arjun Kumar 👋</div>
      <div style={{ color: 'var(--muted)', marginBottom: 12 }}>{'> Full-Stack Developer | Competitive Programmer | Open Source Enthusiast'}</div>
      <div style={{ marginBottom: 12 }}>
        <div style={{ color: 'var(--lc)', fontWeight: 600 }}>#### 📊 Coding Stats</div>
        <pre style={{ marginTop: 6, padding: '8px 12px', background: 'var(--bg4)', borderRadius: 8, fontSize: 11, color: 'var(--muted)', overflowX: 'auto' }}>
{`LeetCode  : 847 solved (1924 rating) 🔥 62-day streak
Codeforces: Expert 1842 | Max: 1956
GitHub    : 1,482 contributions | 48 repos | 312 stars
HackerRank: 3240 score | ★5 | Top 5%`}
        </pre>
      </div>
      <div style={{ marginBottom: 12 }}>
        <div style={{ color: 'var(--cf)', fontWeight: 600 }}>#### 🛠️ Languages & Tools</div>
        <div style={{ marginTop: 6, color: 'var(--muted)' }}>Python · C++ · TypeScript · Java · Go · Rust · React · Spring Boot</div>
      </div>
      <div>
        <div style={{ color: 'var(--hr)', fontWeight: 600 }}>#### 📈 GitHub Stats</div>
        <div style={{ marginTop: 6, color: 'var(--muted)', fontSize: 11 }}>![GitHub stats](https://github-readme-stats.vercel.app/api?username=arjunkumar&theme=dark)</div>
      </div>
    </div>
  )
}

export default function PortfolioPage() {
  const { showToast } = useApp()
  const [activeTab, setActiveTab] = useState('resume')

  return (
    <div>
      <div className="topbar">
        <div>
          <div className="page-title">📄 Portfolio Generator</div>
          <div className="page-sub">Auto-generated from your GitHub activity and platform stats</div>
        </div>
        <div className="topbar-actions">
          <button className="btn" onClick={() => showToast('Downloading PDF...', '📥')}>📥 Download PDF</button>
          <button className="btn btn-accent" onClick={() => showToast('Portfolio deployed!', '🚀')}>🚀 Deploy Portfolio</button>
        </div>
      </div>

      <div className="content">
        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, background: 'var(--bg3)', padding: 4, borderRadius: 10, marginBottom: 16 }}>
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={{ flex: 1, padding: '8px', borderRadius: 8, border: 'none', background: activeTab === tab.id ? 'var(--bg2)' : 'transparent', color: activeTab === tab.id ? 'var(--text)' : 'var(--muted)', cursor: 'pointer', fontSize: 13, fontFamily: "'Syne',sans-serif", fontWeight: 500, transition: 'all 0.2s' }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Resume tab */}
        {activeTab === 'resume' && (
          <div className="grid-3">
            <div>
              <ResumePreview />
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button className="btn" style={{ flex: 1 }} onClick={() => showToast('Copied resume text!', '📋')}>📋 Copy Text</button>
                <button className="btn btn-accent" style={{ flex: 1 }} onClick={() => showToast('Downloading PDF...', '📥')}>📥 PDF</button>
              </div>
            </div>
            <div>
              <div className="card" style={{ marginBottom: 14 }}>
                <div className="card-header"><div className="card-title">Resume Settings</div></div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {['Include GitHub stats','Include LeetCode stats','Include Codeforces stats','Include HackerRank stats','Include project descriptions','Include skill ratings'].map(opt => (
                    <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 13 }}>
                      <input type="checkbox" defaultChecked style={{ accentColor: 'var(--gh)', width: 14, height: 14 }} /> {opt}
                    </label>
                  ))}
                </div>
              </div>
              <div className="card">
                <div className="card-header"><div className="card-title">Export Formats</div></div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {EXPORT_FORMATS.map(opt => (
                    <div key={opt.f} onClick={() => showToast(`Exporting as ${opt.f}...`, '📥')}
                      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 10, background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer' }}>
                      <span style={{ fontSize: 18 }}>{opt.icon}</span>
                      <div><div style={{ fontSize: 13, fontWeight: 600 }}>{opt.f}</div><div style={{ fontSize: 11, color: 'var(--muted)' }}>{opt.d}</div></div>
                      <span style={{ marginLeft: 'auto', color: 'var(--muted2)', fontSize: 12 }}>↓</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Portfolio tab */}
        {activeTab === 'portfolio' && (
          <div className="card" style={{ textAlign: 'center', padding: 48 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🌐</div>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Portfolio Site Generator</div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 24, maxWidth: 400, margin: '0 auto 24px' }}>
              Generate a beautiful portfolio website from your GitHub projects and coding stats. Deploys to Vercel or Netlify in one click.
            </div>
            <button className="btn btn-accent" style={{ padding: '12px 28px', fontSize: 14 }} onClick={() => showToast('Portfolio generation started!', '🚀')}>
              🚀 Generate Portfolio Site
            </button>
          </div>
        )}

        {/* README tab */}
        {activeTab === 'readme' && (
          <div className="grid-3">
            <div>
              <ReadmePreview />
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button className="btn" style={{ flex: 1 }} onClick={() => showToast('README copied!', '📋')}>📋 Copy README</button>
                <button className="btn btn-accent" style={{ flex: 1 }} onClick={() => showToast('Pushed to GitHub!', '🐙')}>🐙 Push to GitHub</button>
              </div>
            </div>
            <div className="card">
              <div className="card-header"><div className="card-title">README Widgets</div></div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {README_WIDGETS.map(w => (
                  <label key={w} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 13, padding: 8, borderRadius: 6 }}>
                    <input type="checkbox" defaultChecked={['GitHub Stats Card','Top Languages Card','Streak Stats'].includes(w)} style={{ accentColor: 'var(--gh)', width: 14, height: 14 }} /> {w}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
