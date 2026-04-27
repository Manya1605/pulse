import { createContext, useContext, useState, useCallback } from 'react'

// ── MOCK DATA ─────────────────────────────────────────────────
export const MOCK = {
  user: { username: 'arjunkumar', displayName: 'Arjun Kumar', email: 'arjun@dev.com', initials: 'AK' },
  github: {
    totalContributions: 1482, totalCommitContributions: 1482, publicRepos: 48, totalStars: 312, totalForks: 127,
    currentStreak: 62, longestStreak: 91, followers: 234, following: 89,
    monthlyContributions: [{month:'Jan',count:98},{month:'Feb',count:112},{month:'Mar',count:134},{month:'Apr',count:89},{month:'May',count:145},{month:'Jun',count:160},{month:'Jul',count:178},{month:'Aug',count:142},{month:'Sep',count:123},{month:'Oct',count:167},{month:'Nov',count:189},{month:'Dec',count:145}],
    topRepos: [
      {name:'neural-net-viz',language:'Python',stars:128,forks:34,desc:'Neural network visualization tool'},
      {name:'cp-templates',language:'C++',stars:84,forks:21,desc:'Competitive programming templates'},
      {name:'devpulse-api',language:'TypeScript',stars:56,forks:18,desc:'Developer dashboard backend API'},
      {name:'algo-visualizer',language:'JavaScript',stars:44,forks:12,desc:'Algorithm visualization'},
    ],
    languagePercent: {Python:34,'C++':24,TypeScript:16,Java:12,Go:7,Rust:4,Other:3},
    yearlyContributions: {
      '2024': [{month:'Jan',count:98},{month:'Feb',count:112},{month:'Mar',count:134},{month:'Apr',count:89},{month:'May',count:145},{month:'Jun',count:160},{month:'Jul',count:178},{month:'Aug',count:142},{month:'Sep',count:123},{month:'Oct',count:167},{month:'Nov',count:189},{month:'Dec',count:145}],
      '2023': [{month:'Jan',count:78},{month:'Feb',count:92},{month:'Mar',count:114},{month:'Apr',count:69},{month:'May',count:125},{month:'Jun',count:140},{month:'Jul',count:158},{month:'Aug',count:122},{month:'Sep',count:103},{month:'Oct',count:147},{month:'Nov',count:169},{month:'Dec',count:125}],
      '2022': [{month:'Jan',count:58},{month:'Feb',count:72},{month:'Mar',count:94},{month:'Apr',count:49},{month:'May',count:105},{month:'Jun',count:120},{month:'Jul',count:138},{month:'Aug',count:102},{month:'Sep',count:83},{month:'Oct',count:127},{month:'Nov',count:149},{month:'Dec',count:105}],
    },
  },
  leetcode: {
    totalSolved:847, easySolved:361, mediumSolved:378, hardSolved:108,
    totalEasy:873, totalMedium:1834, totalHard:795, acceptanceRate:63.4,
    contestRating:1924, contestsAttended:28, currentStreak:62, longestStreak:91,
    monthlySubmissions:[51,61,74,44,83,95,104,83,67,99,115,89],
    topics:[
      {tag:'Arrays',count:182},{tag:'Dynamic Programming',count:124},
      {tag:'Trees',count:98},{tag:'Graphs',count:87},
      {tag:'Strings',count:76},{tag:'Bit Manipulation',count:45}
    ],
    recentSubmissions:[
      {title:'#2073 Time Needed to Buy Tickets',status:'Accepted',lang:'Python',diff:'Medium',time:'2h ago'},
      {title:'#149 Max Points on a Line',status:'Accepted',lang:'C++',diff:'Hard',time:'3d ago'},
      {title:'#2006 Count Number of Pairs',status:'Accepted',lang:'Python',diff:'Easy',time:'4d ago'},
    ],
    contestHistory:[
      {name:'Weekly 423',rank:612,change:+42,date:'Dec 15'},
      {name:'Biweekly 143',rank:834,change:+28,date:'Dec 7'},
      {name:'Weekly 420',rank:1204,change:-18,date:'Nov 30'},
      {name:'Weekly 418',rank:523,change:+65,date:'Nov 23'},
    ],
  },
  codeforces: {
    handle:'arjun_cf', rating:1842, maxRating:1956, rank:'Expert', totalSolved:234, contestsAttended:42,
    ratingHistory:[1200,1310,1420,1560,1640,1760,1812,1870,1920,1956,1930,1842],
    contestHistory:[
      {name:'Round 980 Div.2',rank:847,change:+58,date:'Dec 12'},
      {name:'Round 974 Div.3',rank:523,change:+42,date:'Nov 28'},
      {name:'Round 968 Div.2',rank:1204,change:-21,date:'Nov 14'},
      {name:'Educational Rd 169',rank:678,change:+31,date:'Oct 30'},
      {name:'Round 960 Div.2',rank:412,change:+67,date:'Oct 16'},
    ],
    problemsByRating:{'800-1000':83,'1100-1300':74,'1400-1600':42,'1700-1900':22,'2000+':13},
    tags:{greedy:48,dp:42,graphs:38,math:35,sorting:28,binary_search:24,trees:18},
  },
  hackerrank: {
    score:3240, badges:14, stars:5, certificates:3, rank:'Top 5%', totalProblems:256,
    badges_list:[
      {name:'Problem Solving',stars:5,level:'Gold'},{name:'Python',stars:5,level:'Gold'},
      {name:'SQL',stars:5,level:'Gold'},{name:'C++',stars:4,level:'Silver'},
      {name:'Mathematics',stars:4,level:'Silver'},{name:'REST API',stars:4,level:'Silver'},
      {name:'Java',stars:3,level:'Bronze'},{name:'AI',stars:3,level:'Bronze'},
    ],
    domains:[
      {domain:'Problem Solving',stars:5},{domain:'Python',stars:5},{domain:'SQL',stars:5},
      {domain:'C++',stars:4},{domain:'Math',stars:4},{domain:'Java',stars:3},
    ],
  },
}

export const LANG_COLORS = {
  Python:'#3572A5','C++':'#f34b7d',TypeScript:'#2b7489',
  Java:'#b07219',Go:'#00ADD8',Rust:'#dea584',Other:'#484f58'
}

// ── CONTEXT ──────────────────────────────────────────────────
const AppContext = createContext(null)
export const useApp = () => useContext(AppContext)

export function AppProvider({ children }) {
  const [page, setPage] = useState('login')
  const [currentUser, setCurrentUser] = useState(null)
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken') || null)
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken') || null)
  const [toasts, setToasts] = useState([])

  // Update localStorage when tokens change
  const updateAccessToken = (token) => {
    setAccessToken(token)
    if (token) localStorage.setItem('accessToken', token)
    else localStorage.removeItem('accessToken')
  }

  const updateRefreshToken = (token) => {
    setRefreshToken(token)
    if (token) localStorage.setItem('refreshToken', token)
    else localStorage.removeItem('refreshToken')
  }

  const showToast = useCallback((msg, icon = '✓') => {
    const id = Date.now()
    setToasts(p => [...p, { id, msg, icon }])
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3000)
  }, [])

  const handleLogout = () => {
    setCurrentUser(null)
    updateAccessToken(null)
    updateRefreshToken(null)
    setPage('login')
    showToast('Logged out successfully', '👋')
  }

  return (
    <AppContext.Provider value={{ 
      page, setPage, 
      currentUser, setCurrentUser, 
      accessToken, setAccessToken: updateAccessToken,
      refreshToken, setRefreshToken: updateRefreshToken,
      showToast, 
      handleLogout, 
      toasts 
    }}>
      {children}
    </AppContext.Provider>
  )
}
