# Quick Start: Local Development

## 🚀 Start Local Testing in 3 Steps

### 1. Navigate to Frontend
```bash
cd vtt-react
```

### 2. Start Development Server
```bash
npm start
```

### 3. Open Browser
The app will automatically open at `http://localhost:3000`

**✅ That's it!** Your local frontend is now connected to the production Railway backend.

## 🎮 Testing Multiplayer

### Two Local Browsers
1. Window 1: Create a room
2. Window 2/Incognito: Join the room
3. Test real-time sync

### Local + Production Mix
1. Developer: `http://localhost:3000`
2. Tester: `https://mythrill.netlify.app`
3. Both join the same room
4. Test without redeploying!

## 🔧 What Was Changed

### Frontend Configuration
- ✅ `.env.development` created → Points to Railway backend
- ✅ `.env.production` already configured → Points to Railway backend
- ✅ Socket connections always use `https://descension-mythrill.up.railway.app`

### Backend Configuration
- ✅ Production CORS updated → Now allows `localhost:3000`
- ✅ No downtime → Backend stays online
- ✅ Safe for production → Both prod and local domains work

## 📊 Architecture

```
Local Dev (localhost:3000)  ──┐
                              │
Production (netlify.app)   ───┼──► Railway Backend (Always Online)
                              │
Local Test (localhost:3001)───┘
```

## 🐛 Quick Troubleshooting

**❌ Can't connect?**
```bash
# Check if backend is up
curl https://descension-mythrill.up.railway.app/health
```

**❌ CORS error?**
- Clear browser cache
- Restart dev server: `npm start`

**❌ Socket not connecting?**
- Check browser console for errors
- Ensure you're signed in
- Verify `.env.development` exists

## 📝 Environment Variables

Your `.env.development` file:
```bash
REACT_APP_SOCKET_URL=https://descension-mythrill.up.railway.app
REACT_APP_FIREBASE_API_KEY=AIzaSyDs9SSWy1J_aSX3LvHUBbI9fwi68cuaX7A
# ... other Firebase config
```

## 🎯 Benefits

✅ **No Backend Routing** - Frontend initiates all connections  
✅ **Production Stays Online** - Test without affecting live users  
✅ **Fast Iteration** - No deployment wait times  
✅ **Real Multiplayer** - Test with actual multiple clients  
✅ **Safe Testing** - Production environment unchanged  

## 📖 Full Documentation

See `LOCAL_DEVELOPMENT.md` for complete details, testing scenarios, and troubleshooting guide.

## 🚢 Deployment

### Backend Changes
1. Commit to GitHub → Railway auto-deploys
2. Both local and prod frontends use updated backend

### Frontend Changes
1. Test locally first
2. Commit when ready → Netlify auto-deploys
3. Production site updates automatically

---

**Need help?** Check the full documentation in `LOCAL_DEVELOPMENT.md`
