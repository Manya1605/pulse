# 🔗 Link Your GitHub Username - Setup Guide

## Current Status
✅ Registration working - users save to MongoDB  
✅ Login working - users authenticated  
✅ GitHub page shows mock data by default  
❌ GitHub data not showing real username  

**Why?** - You need to link your GitHub username in Settings first!

---

## How to Link GitHub Username

### Step 1: Go to Settings Page
1. Login with your account
2. Click ⚙️ "Settings" in the sidebar
3. Scroll down to "Platform Usernames"

### Step 2: Enter Your GitHub Username
1. Find the GitHub field
2. Enter your actual GitHub username (e.g., `torvalds`, `gvanrossum`)
3. Click "💾 Save All"

### Step 3: Go to GitHub Page
1. Click 🐙 "GitHub" in the sidebar
2. Your real GitHub data will load!
3. Shows:
   - Real contribution count
   - Real repositories
   - Real stars and forks
   - Real language distribution

---

## Currently Showing Mock Data Because:

The GitHub page checks:
```javascript
if (currentUser?.githubUsername) {
  // Fetch real GitHub data
  const data = await apiCall('/github/me')
} else {
  // Show mock data
  setData(MOCK.github)
}
```

**Your user's `githubUsername` is empty!** So it shows mock data.

---

## To Make It Work with Real Data:

### Option 1: Update Settings Page (Update Later)
Settings page needs to:
- Read current user's GitHub username from database
- Let user edit and save it
- Store in User model in MongoDB

### Option 2: Quick Test with Command
```bash
# Use any public GitHub username to test:
# Go to GitHub page, it will still show mock because 
# you need to save the username in Settings first
```

---

## What Needs to Happen:

1. **Settings Page** needs to:
   - Load user data from database ✅ (currentUser exists)
   - Save updated username to database ❌ (not implemented)

2. **GitHub Page** will then:
   - Check if user has githubUsername ✅
   - Fetch real GitHub data ✅
   - Display real stats ✅

3. **Update User Route** needs:
   - Endpoint to save settings
   - Update User model in MongoDB

---

## Next Steps:

**Option A: Do it Later**
- For now, mock data is shown
- You can manually test the backend GitHub API with curl

**Option B: Implement Now**
- Create `/api/user/profile` endpoint to update username
- Update SettingsPage to call this endpoint
- Save settings to database
- GitHub page will automatically show real data

---

## Test GitHub API Directly (Backend):

```bash
# Test with real GitHub username (public):
curl http://localhost:8001/api/github/torvalds

# Should return:
{
  "totalContributions": xxx,
  "totalRepos": xxx,
  "totalStars": xxx,
  "languages": {...},
  "topRepos": [...]
}
```

---

## Current User Data Structure:

```javascript
{
  username: "testuser",
  email: "test@example.com",
  displayName: "Test User",
  githubUsername: "",  // ← Empty! Needs to be filled
  leetcodeUsername: "",
  codeforcesHandle: "",
  hackerrankUsername: ""
}
```

**To show real GitHub data:**
1. Update githubUsername in Settings
2. Save to database
3. GitHub page fetches real data automatically

---

## Summary

✅ **Backend GitHub API working**
- Fetches real GitHub data
- Caches results for performance

✅ **Frontend GitHub Page updated**
- Checks for githubUsername
- Fetches real data if linked
- Falls back to mock data

❌ **Settings Page needs update**
- Currently shows hardcoded mock data
- Needs to save to database
- Needs `/api/user/profile` endpoint

---

**Status**: Ready to accept real GitHub username once Settings is complete!

Want me to implement the Settings save functionality? 🚀
