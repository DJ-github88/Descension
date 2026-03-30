# Deployment Checklist

## Pre-Deployment

- [ ] Review all changes in git diff
- [ ] Verify `.env.development` has correct backend URL
- [ ] Verify `.env.production` has correct backend URL
- [ ] Check `.gitignore` doesn't exclude environment files
- [ ] Read IMPLEMENTATION_SUMMARY.md

## Backend Deployment (Railway)

### 1. Commit Backend Changes
```bash
cd server
git add server.js
git add .env.example
git commit -m "feat: add localhost CORS support for local development"
```

### 2. Push to GitHub
```bash
git push origin main
```

### 3. Verify Railway Deployment
- [ ] Check Railway dashboard for new deployment
- [ ] Wait for deployment to complete
- [ ] Check deployment logs for errors
- [ ] Verify health endpoint: `https://descension-mythrill.up.railway.app/health`

### 4. Test Backend CORS
```bash
# Test from command line
curl -H "Origin: http://localhost:3000" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://descension-mythrill.up.railway.app/health
```

Expected: CORS headers in response allowing localhost:3000

## Frontend Setup (Local)

### 1. Commit Environment Files
```bash
cd vtt-react
git add .env.development
git add .env.production
git add .gitignore
git add LOCAL_DEVELOPMENT.md
git add QUICK_START.md
git commit -m "feat: configure environment for local dev with production backend"
```

### 2. Install Dependencies (if needed)
```bash
npm install
```

### 3. Verify Environment
```bash
# Should show Railway backend URL
grep REACT_APP_SOCKET_URL .env.development
```

### 4. Start Local Development
```bash
npm start
```

Expected: App opens at localhost:3000

## Testing

### Test 1: Local Connection
- [ ] Open localhost:3000
- [ ] Check browser console for WebSocket connection
- [ ] Verify no CORS errors
- [ ] Sign in with test account
- [ ] Create a test room
- [ ] Verify room created successfully

### Test 2: Local Multiplayer
- [ ] Keep first browser window open
- [ ] Open incognito/second browser to localhost:3000
- [ ] Sign in with different account
- [ ] Join the room created in Test 1
- [ ] Verify real-time sync (chat message, token movement)

### Test 3: Local + Production Mix
- [ ] Keep localhost:3000 open
- [ ] Open mythrill.netlify.app in another browser
- [ ] Sign in on production site
- [ ] Join the same room
- [ ] Verify cross-environment real-time sync

### Test 4: Production Site Stability
- [ ] Open mythrill.netlify.app
- [ ] Verify site loads normally
- [ ] Create a room from production
- [ ] Verify multiplayer works as before
- [ ] Confirm no regressions

## Post-Deployment Verification

### Backend
- [ ] Railway deployment successful
- [ ] Health endpoint responding
- [ ] CORS headers include localhost
- [ ] No errors in Railway logs
- [ ] WebSocket connections working

### Frontend (Local)
- [ ] npm start works without errors
- [ ] Connects to Railway backend
- [ ] No CORS errors in console
- [ ] WebSocket connected
- [ ] Multiplayer features working

### Frontend (Production)
- [ ] mythrill.netlify.app loads
- [ ] Connects to Railway backend
- [ ] No CORS errors
- [ ] WebSocket connected
- [ ] Multiplayer features working

## Rollback Procedure

### If Backend Issues Occur

1. **Revert Server Changes**
```bash
cd server
git revert HEAD
git push origin main
```

2. **Verify Railway Redeploys**
- Check Railway dashboard
- Wait for rollback deployment
- Test production site

### If Frontend Issues Occur

1. **Local Only (No Production Impact)**
```bash
cd vtt-react
git checkout HEAD -- .env.development
npm start
```

2. **Production Impact**
```bash
git revert HEAD
git push origin main
# Wait for Netlify to rebuild
```

## Monitoring

### First 24 Hours
- [ ] Monitor Railway logs for CORS errors
- [ ] Check for increased error rates
- [ ] Monitor WebSocket connection success rate
- [ ] Watch for user-reported issues

### First Week
- [ ] Collect feedback from testers
- [ ] Monitor backend performance
- [ ] Check for memory leaks
- [ ] Verify no proxy/routing issues

## Success Criteria

All checkboxes below should be checked:

### Backend
- [ ] Railway deployment successful
- [ ] CORS allows localhost:3000
- [ ] CORS allows production domains
- [ ] No errors in server logs
- [ ] Health endpoint returns 200

### Local Development
- [ ] npm start works
- [ ] localhost:3000 opens
- [ ] Connects to Railway backend
- [ ] Real-time features work
- [ ] Can test multiplayer locally

### Production
- [ ] mythrill.netlify.app works
- [ ] No regressions
- [ ] Multiplayer still functions
- [ ] Users not impacted
- [ ] Performance unchanged

### Documentation
- [ ] LOCAL_DEVELOPMENT.md created
- [ ] QUICK_START.md created
- [ ] IMPLEMENTATION_SUMMARY.md created
- [ ] DEPLOYMENT_CHECKLIST.md created
- [ ] README updated (if needed)

## Known Issues / Limitations

Document any known issues discovered during testing:

- [ ] None discovered yet
- [ ] (Add issues here as they're found)

## Support Contacts

- **Backend Issues:** Check Railway logs and deployment status
- **Frontend Issues:** Check Netlify logs and build status
- **CORS Issues:** Verify server/server.js CORS configuration
- **Socket Issues:** Check browser console and Network tab

## Additional Notes

Add any deployment-specific notes here:

---

**Deployment Date:** ___________  
**Deployed By:** ___________  
**Status:** ⬜ Pending / ⬜ In Progress / ⬜ Complete / ⬜ Rolled Back
