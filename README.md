# DevPulse 🚀

**A Full-Stack Developer Dashboard** - Connect all your coding platforms in one place and visualize your development journey.

![Version](https://img.shields.io/badge/version-2.5.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Node](https://img.shields.io/badge/node-%3E%3D14-brightgreen)
![React](https://img.shields.io/badge/react-18.2.0-61DAFB?logo=react)

---

## 🎯 Overview

DevPulse is a comprehensive developer dashboard that aggregates data from multiple coding platforms including GitHub, LeetCode, Codeforces, and HackerRank. View all your coding achievements in one beautiful, unified interface.

### ✨ Key Features

- 🔐 **Secure Authentication** - Register, login, and manage accounts with JWT tokens
- 📊 **Real-Time Data** - Fetch live stats from GitHub, LeetCode, Codeforces, HackerRank
- 🎨 **Beautiful UI** - Modern, responsive dashboard with dark mode support
- 📈 **Analytics** - View contribution graphs, language distribution, rating trends
- 💾 **Persistent Storage** - All data saved to MongoDB Atlas
- 🔗 **Platform Integration** - Link your platform usernames in Settings
- ⚡ **Fast & Secure** - Express backend with JWT authentication & password hashing
- 🚀 **Production Ready** - Deployed with scalability in mind

---

## 📁 Project Structure

```
NEW PROJECT 1/
├── backend/                          # Express.js REST API
│   ├── src/
│   │   ├── app.js                   # Express app configuration
│   │   ├── server.js                # Server entry point
│   │   ├── config/
│   │   │   ├── db.js                # MongoDB connection
│   │   │   └── cache.js             # Caching configuration
│   │   ├── middleware/
│   │   │   ├── auth.js              # JWT authentication
│   │   │   └── errorHandler.js      # Error handling middleware
│   │   ├── models/
│   │   │   └── User.js              # MongoDB User schema
│   │   ├── routes/
│   │   │   ├── auth.routes.js       # Authentication endpoints
│   │   │   ├── user.routes.js       # User profile endpoints
│   │   │   ├── github.routes.js     # GitHub data endpoints
│   │   │   ├── leetcode.routes.js   # LeetCode data endpoints
│   │   │   ├── codeforces.routes.js # Codeforces data endpoints
│   │   │   └── hackerrank.routes.js # HackerRank data endpoints
│   │   └── services/
│   │       ├── auth.service.js      # Auth business logic
│   │       ├── github.service.js    # GitHub API integration
│   │       ├── leetcode.service.js  # LeetCode API integration
│   │       ├── codeforces.service.js# Codeforces API integration
│   │       └── hackerrank.service.js# HackerRank API integration
│   ├── package.json
│   └── .env
│
├── FRONTEND/                         # React + Vite SPA
│   ├── src/
│   │   ├── App.jsx                  # Main app component
│   │   ├── main.jsx                 # Entry point
│   │   ├── config/
│   │   │   └── api.js               # API helper with JWT
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx        # Authentication
│   │   │   ├── RegisterPage.jsx     # User registration
│   │   │   ├── WelcomePage.jsx      # Dashboard welcome
│   │   │   ├── SettingsPage.jsx     # Link platform usernames
│   │   │   ├── GitHubPage.jsx       # GitHub stats
│   │   │   ├── LeetCodePage.jsx     # LeetCode stats
│   │   │   ├── CodeforcesPage.jsx   # Codeforces stats
│   │   │   ├── HackerRankPage.jsx   # HackerRank stats
│   │   │   └── ... (other pages)
│   │   ├── components/
│   │   │   └── shared.jsx           # Reusable components
│   │   ├── store/
│   │   │   └── AppContext.jsx       # Global state management
│   │   └── styles/
│   │       └── globals.css          # Styling
│   ├── vite.config.js
│   ├── package.json
│   └── index.html
│
└── README.md                         # This file
```

---

## 🛠️ Tech Stack

### Frontend
- **React 18.2.0** - UI library
- **Vite 5.1.0** - Build tool & dev server
- **JavaScript** - Programming language
- **CSS3** - Styling with CSS variables

### Backend
- **Node.js** - Runtime
- **Express.js 4.18.2** - Web framework
- **Mongoose 8.0.0** - MongoDB ODM
- **JWT** - Authentication (jsonwebtoken)
- **bcryptjs 2.4.3** - Password hashing

### Database
- **MongoDB Atlas** - Cloud database
- **Collections**: Users

### APIs Integrated
- **GitHub API** - User stats, repos, languages
- **LeetCode** - Problem counts, ratings
- **Codeforces** - Rating, contests
- **HackerRank** - Badges, scores

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 14.x
- npm or yarn
- MongoDB Atlas account (for cloud database)
- GitHub account

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/MONAAL24/pulse.git
cd pulse
```

#### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
PORT=8001
MONGO_URL=your_mongodb_connection_string
DB_NAME=PLUSE
JWT_ACCESS_SECRET=your_secret_key_here
JWT_REFRESH_SECRET=your_refresh_secret_key_here
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASS=your_password
GITHUB_TOKEN=your_github_token_optional
EOF

# Start backend server
npm run dev
```

Backend will run on: **http://localhost:8001**

#### 3. Frontend Setup
```bash
cd FRONTEND

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend will run on: **http://localhost:5173**

### ✅ Verify Installation

1. **Backend**: http://localhost:8001/api/health
   - Should return: `{"status":"ok","message":"DevPulse API — OK"}`

2. **Frontend**: http://localhost:5173
   - Should show the login page

3. **MongoDB**: Check MongoDB Atlas for PLUSE database connection

---

## 📝 Usage

### 1. Register/Login
```
1. Go to http://localhost:5173
2. Click "Create one" to register
3. Fill in your details:
   - Display Name
   - Username (3-50 characters)
   - Email (valid format)
   - Password (8+ characters)
4. Data is saved to MongoDB automatically ✅
```

### 2. Link Platform Usernames
```
1. Login to your account
2. Click ⚙️ "Settings" in sidebar
3. Scroll to "Platform Connections"
4. Enter your platform usernames:
   - GitHub username
   - LeetCode username
   - Codeforces handle
   - HackerRank username
5. Click "💾 Save Connections"
```

### 3. View Platform Stats
```
1. Click on any platform page:
   - 🐙 GitHub
   - 🔥 LeetCode
   - ⚔️ Codeforces
   - 🏆 HackerRank
2. See REAL stats from your profile
3. View trends, contributions, repos, etc.
```

### 4. Demo Account
```
Click "🎭 Continue with Demo Account" to see mock data
(Uses in-memory state, data not saved)
```

---

## 🔐 Authentication Flow

```
User Registration
├─ Fill form with credentials
├─ Password hashed with bcryptjs (12 rounds)
├─ User saved to MongoDB
├─ JWT tokens generated (access + refresh)
└─ User logged in automatically

User Login
├─ Username/Email + Password
├─ Password verified against hash
├─ JWT tokens generated
├─ Tokens stored in localStorage
└─ User context populated

Protected Routes
├─ Middleware checks Authorization header
├─ JWT token verified
├─ User fetched from database
└─ Request proceeds or returns 401
```

---

## 📊 API Endpoints

### Authentication
```
POST   /api/auth/register     - Register new user
POST   /api/auth/login        - Login user
POST   /api/auth/refresh      - Refresh access token
GET    /api/auth/verify-email - Verify email
```

### User Profile
```
GET    /api/user/profile      - Get current user
PUT    /api/user/profile      - Update profile
PUT    /api/user/platforms    - Save platform usernames
DELETE /api/user/account      - Delete account
```

### Platform Data
```
GET    /api/github/me         - Get GitHub stats
GET    /api/github/:username  - Get any GitHub user
GET    /api/leetcode/me       - Get LeetCode stats
GET    /api/codeforces/me     - Get Codeforces stats
GET    /api/hackerrank/me     - Get HackerRank stats
```

---

## 💾 Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  username: String (unique, 3-50 chars),
  email: String (unique, valid format),
  password: String (bcrypt hashed),
  displayName: String,
  bio: String,
  location: String,
  website: String,
  githubUsername: String,
  leetcodeUsername: String,
  codeforcesHandle: String,
  hackerrankUsername: String,
  isEmailVerified: Boolean,
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  enabled: Boolean,
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

---

## 🔄 Data Flow

```
Frontend Registration
        ↓
POST /api/auth/register
        ↓
Backend Validation
        ↓
Password Hashing (bcrypt)
        ↓
MongoDB Save
        ↓
JWT Token Generation
        ↓
Response to Frontend
        ↓
Tokens stored in localStorage
        ↓
User logged in ✅
```

---

## 🧪 Testing

### Test Registration
```bash
curl -X POST http://localhost:8001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "displayName": "Test User"
  }'
```

### Test Login
```bash
curl -X POST http://localhost:8001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "testuser",
    "password": "password123"
  }'
```

### Test GitHub Data
```bash
curl -X GET http://localhost:8001/api/github/torvalds
```

---

## 🌍 Environment Variables

### Backend (.env)
```
PORT=8001                              # Server port
MONGO_URL=mongodb+srv://...            # MongoDB connection
DB_NAME=PLUSE                          # Database name
JWT_ACCESS_SECRET=your_secret          # Access token secret
JWT_REFRESH_SECRET=your_refresh        # Refresh token secret
JWT_ACCESS_EXPIRY=15m                  # Access token expiry
JWT_REFRESH_EXPIRY=7d                  # Refresh token expiry
CORS_ORIGINS=http://localhost:5173     # Allowed origins
GITHUB_TOKEN=optional                  # GitHub API token
SMTP_HOST=smtp.example.com             # Email service
```

### Frontend (vite.config.js)
```
VITE_API_URL=http://localhost:8001/api # Backend API URL
```

---

## 🚀 Deployment

### Deploy Backend (Heroku/Railway)
```bash
# Set environment variables
heroku config:set PORT=8001
heroku config:set MONGO_URL=your_mongo_url
# Push to Heroku
git push heroku main
```

### Deploy Frontend (Vercel/Netlify)
```bash
# Build
npm run build
# Deploy to Vercel
vercel deploy --prod
```

---

## 📈 Features Roadmap

- [ ] Email verification
- [ ] OAuth (GitHub, Google login)
- [ ] AI Analysis (Gemini API integration)
- [ ] Portfolio generation
- [ ] Dev card export
- [ ] Analytics graphs
- [ ] Dark mode toggle
- [ ] Mobile app
- [ ] Real-time notifications
- [ ] Team dashboards

---

## 🐛 Troubleshooting

### Backend not connecting to MongoDB
```
- Check MongoDB Atlas connection string
- Verify IP whitelist includes your IP
- Check MONGO_URL in .env
```

### Frontend showing mock data
```
- Go to Settings (⚙️)
- Link your platform username
- Save connections
- Refresh the page
```

### CORS error
```
- Check CORS_ORIGINS in backend .env
- Should include http://localhost:5173
- Restart backend server
```

### JWT token expired
```
- Frontend automatically uses refresh token
- If still fails, logout and login again
- Check token expiry in .env
```

---

## 🔒 Security Features

✅ **Password Hashing** - bcryptjs with 12 rounds
✅ **JWT Tokens** - Secure authentication
✅ **CORS** - Restricted to allowed origins
✅ **Helmet** - Security headers
✅ **Rate Limiting** - Prevent brute force
✅ **Email Verification** - Optional email confirmation
✅ **Input Validation** - All inputs validated
✅ **Error Handling** - Secure error messages

---

## 📄 License

MIT License - see LICENSE file for details

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

```bash
# Fork the repository
# Create your feature branch
git checkout -b feature/AmazingFeature
# Commit your changes
git commit -m 'Add some AmazingFeature'
# Push to the branch
git push origin feature/AmazingFeature
# Open a Pull Request
```

---

## 📞 Support

- 📧 Email: monalsehrawat20@gmail.com
- 🐙 GitHub: [@MONAAL24](https://github.com/MONAAL24)
- 🐛 Issues: [Report a bug](https://github.com/MONAAL24/pulse/issues)

---

## 🙏 Acknowledgments

- React & Vite for amazing tools
- MongoDB for scalable database
- Express.js for robust backend
- GitHub, LeetCode, Codeforces, HackerRank APIs

---

## 📊 Statistics

| Metric | Value |
|--------|-------|
| Frontend Files | 25+ |
| Backend Files | 20+ |
| API Endpoints | 15+ |
| Database Collections | 1 |
| Lines of Code | 5000+ |
| Git Commits | 70+ |

---

## 🎉 Ready to Use!

Your DevPulse dashboard is ready to go! Follow the [Getting Started](#-getting-started) section and start connecting your platforms.

**Happy Coding!** 🚀

---

**Last Updated**: April 1, 2026  
**Version**: 2.5.0  
**Maintainer**: [@MONAAL24](https://github.com/MONAAL24)
