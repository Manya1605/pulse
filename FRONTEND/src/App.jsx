import { AppProvider, useApp } from './store/AppContext'
import { ToastContainer, Sidebar } from './components/shared'

import LoginPage      from './pages/LoginPage'
import RegisterPage   from './pages/RegisterPage'
import WelcomePage    from './pages/WelcomePage'
import DashboardPage  from './pages/DashboardPage'
import GitHubPage     from './pages/GitHubPage'
import LeetCodePage   from './pages/LeetCodePage'
import CodeforcesPage from './pages/CodeforcesPage'
import HackerRankPage from './pages/HackerRankPage'
import DevCardPage    from './pages/DevCardPage'
import AIAnalysisPage from './pages/AIAnalysisPage'
import WrappedPage    from './pages/WrappedPage'
import PortfolioPage  from './pages/PortfolioPage'
import SettingsPage   from './pages/SettingsPage'
import AnalyticsPage  from './pages/AnalyticsPage'

const PAGES = {
  dashboard:  DashboardPage,
  github:     GitHubPage,
  leetcode:   LeetCodePage,
  codeforces: CodeforcesPage,
  hackerrank: HackerRankPage,
  devcard:    DevCardPage,
  ai:         AIAnalysisPage,
  wrapped:    WrappedPage,
  portfolio:  PortfolioPage,
  settings:   SettingsPage,
  analytics:  AnalyticsPage,
}

function AppShell() {
  const { page, setPage, currentUser, handleLogout, toasts } = useApp()

  // ── Auth: not logged in ───────────────────────────────────
  if (!currentUser) {
    // Show register page if requested
    if (page === 'register') {
      return (
        <>
          <RegisterPage />
          <ToastContainer toasts={toasts} />
        </>
      )
    }
    
    // Default to login page
    return (
      <>
        <LoginPage />
        <ToastContainer toasts={toasts} />
      </>
    )
  }

  // ── Welcome: full-screen, no sidebar ─────────────────────
  if (page === 'welcome') {
    return (
      <>
        <WelcomePage />
        <ToastContainer toasts={toasts} />
      </>
    )
  }

  // ── Dashboard shell with sidebar ─────────────────────────
  const PageComponent = PAGES[page] || DashboardPage

  return (
    <div className="app">
      <Sidebar
        page={page}
        setPage={setPage}
        user={currentUser}
        onLogout={handleLogout}
      />
      <main className="main">
        <PageComponent />
      </main>
      <ToastContainer toasts={toasts} />
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  )
}
