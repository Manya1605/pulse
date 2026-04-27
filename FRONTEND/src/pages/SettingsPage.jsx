import { useState, useEffect } from 'react'
import { useApp } from '../store/AppContext'
import { apiCall } from '../config/api'

const PLATFORM_FIELDS = [
  { icon: '🐙', name: 'GitHub',     color: 'var(--gh)', field: 'githubUsername'     },
  { icon: '🔥', name: 'LeetCode',   color: 'var(--lc)', field: 'leetcodeUsername'   },
  { icon: '⚔️', name: 'Codeforces', color: 'var(--cf)', field: 'codeforcesHandle' },
  { icon: '🏆', name: 'HackerRank', color: 'var(--hr)', field: 'hackerrankUsername' },
]

export default function SettingsPage() {
  const { currentUser, setCurrentUser, showToast } = useApp()
  const [platforms, setPlatforms] = useState({
    githubUsername: '', leetcodeUsername: '', codeforcesHandle: '', hackerrankUsername: '',
  })
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '')
  const [loading, setLoading] = useState(false)

  // Load current user data on mount
  useEffect(() => {
    if (currentUser) {
      setPlatforms({
        githubUsername: currentUser.githubUsername || '',
        leetcodeUsername: currentUser.leetcodeUsername || '',
        codeforcesHandle: currentUser.codeforcesHandle || '',
        hackerrankUsername: currentUser.hackerrankUsername || '',
      })
      setDisplayName(currentUser.displayName || '')
    }
  }, [currentUser])

  const save = async () => {
    setLoading(true)
    try {
      // Save platform usernames
      const platformResponse = await apiCall('/user/platforms', {
        method: 'PUT',
        body: JSON.stringify(platforms)
      })
      
      if (platformResponse) {
        // Update currentUser in context with new platform data
        setCurrentUser({
          ...currentUser,
          githubUsername: platformResponse.githubUsername || '',
          leetcodeUsername: platformResponse.leetcodeUsername || '',
          codeforcesHandle: platformResponse.codeforcesHandle || '',
          hackerrankUsername: platformResponse.hackerrankUsername || '',
        })
        
        showToast('Platform connections saved! 🎉', '✓')
      }
    } catch (error) {
      console.error('Save error:', error)
      showToast(error.message || 'Failed to save settings', '❌')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="topbar">
        <div>
          <div className="page-title">⚙️ Settings</div>
          <div className="page-sub">Manage your account and platform connections</div>
        </div>
        <div className="topbar-actions">
          <button className="btn btn-accent" onClick={save} disabled={loading}>
            {loading ? '⏳ Saving...' : '💾 Save All'}
          </button>
        </div>
      </div>

      <div className="content">
        <div className="grid-2">
          {/* Left column */}
          <div>
            {/* Account info */}
            <div className="card" style={{ marginBottom: 14 }}>
              <div className="settings-section-title">Account Info</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                {[
                  { l: 'Username',     v: currentUser?.username     },
                  { l: 'Email',        v: currentUser?.email        },
                  { l: 'Member Since', v: 'January 2024'            },
                  { l: 'Plan',         v: 'Free'                    },
                ].map(({ l, v }) => (
                  <div key={l}>
                    <div style={{ fontSize: 10, color: 'var(--muted)', fontFamily: "'JetBrains Mono',monospace", textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 4 }}>{l}</div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{v || '—'}</div>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14 }}>
                <div style={{ fontSize: 10, color: 'var(--muted)', fontFamily: "'JetBrains Mono',monospace", textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 6 }}>Display Name</div>
                <input className="input-field" placeholder="Your display name" value={displayName} onChange={e => setDisplayName(e.target.value)} />
              </div>
            </div>


          </div>

          {/* Right column: Platform connections */}
          <div className="card">
            <div className="settings-section-title">🔗 Platform Connections</div>
            <div style={{ marginBottom: 14, fontSize: 12, color: 'var(--muted)' }}>
              Enter your usernames to fetch live data on your dashboard.
            </div>
            {PLATFORM_FIELDS.map(p => (
              <div key={p.field} className="platform-link-row">
                <span className="platform-link-icon">{p.icon}</span>
                <div className="platform-link-info">
                  <div className="platform-link-name" style={{ color: p.color }}>{p.name}</div>
                  <div className="platform-link-status">
                    {platforms[p.field] ? `✓ Linked as @${platforms[p.field]}` : 'Not linked'}
                  </div>
                </div>
                <input
                  className="input-field"
                  style={{ width: 160, fontSize: 12 }}
                  placeholder="username"
                  value={platforms[p.field] || ''}
                  onChange={e => setPlatforms(prev => ({ ...prev, [p.field]: e.target.value }))}
                />
              </div>
            ))}
            <button className="btn btn-accent" style={{ width: '100%', marginTop: 16 }} onClick={save} disabled={loading}>
              {loading ? '⏳ Saving...' : '💾 Save Connections'}
            </button>

            {/* Danger zone */}
            <div style={{ borderTop: '1px solid var(--border)', marginTop: 20, paddingTop: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#f85149', fontFamily: "'JetBrains Mono',monospace", textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Danger Zone</div>
              <button className="btn btn-danger" style={{ width: '100%', fontSize: 12 }} onClick={() => showToast('Account deletion requires email confirmation', '⚠️')}>
                🗑️ Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
