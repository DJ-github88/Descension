# Pre-Launch Stability Checklist

Use this checklist to validate your application is ready for users before launch.

## ✅ Observability (Can You Debug Issues?)

### Test Logging
- [ ] Start your server: `cd server && npm start`
- [ ] Make a request: `curl http://localhost:3001/health`
- [ ] Check logs exist: `ls server/logs/` (should see `app-YYYY-MM-DD.log`)
- [ ] View recent logs: `curl http://localhost:3001/debug/logs?limit=10`
- [ ] Check error logs: `curl http://localhost:3001/debug/logs?level=error`

**What to look for**: Logs should be in JSON format, readable, and include timestamps.

### Test Error Tracking
- [ ] Check metrics endpoint: `curl http://localhost:3001/metrics`
- [ ] Should see error stats, room counts, player counts
- [ ] Trigger an error (try invalid endpoint)
- [ ] Check error appears in logs

**What to look for**: Errors should be categorized and traceable.

---

## ✅ Data Model (Can You Understand Your Data?)

### Review Documentation
- [ ] Read `docs/DATA_MODEL.md`
- [ ] Can you explain your main collections to someone?
- [ ] Identify at least 3 data model issues you want to fix

**What to look for**: You should understand where data lives and how it relates.

### Test Database Access
- [ ] Verify Firebase connection works
- [ ] Test creating a user
- [ ] Test creating a character
- [ ] Test creating a room

**What to look for**: No errors, data persists correctly.

---

## ✅ Happy Path Logic (Does It Work When Users Misbehave?)

### Test Edge Cases
- [ ] **Double-click protection**: Click "Create Room" twice quickly - should only create one room
- [ ] **Refresh mid-action**: Start creating character, refresh page - should handle gracefully
- [ ] **Concurrent actions**: Open two browser tabs, try same action in both
- [ ] **Network interruption**: Disconnect internet mid-action, reconnect - should recover
- [ ] **Invalid input**: Try submitting forms with empty/malformed data

**What to look for**: No crashes, errors logged, user sees helpful messages.

### Test Multiplayer Edge Cases
- [ ] **GM disconnects**: GM leaves room - players should be notified
- [ ] **Player reconnects**: Player leaves and rejoins - should see current state
- [ ] **Room full**: Try joining room at max capacity
- [ ] **Wrong password**: Try joining with incorrect password
- [ ] **Multiple rooms**: Create multiple rooms, join different ones

**What to look for**: All scenarios handled gracefully, no data loss.

---

## ✅ Unit Economics (Do You Know Your Costs?)

### Track API Usage
- [ ] **OpenAI calls**: Use item generation feature, check if costs are logged
- [ ] **Firebase operations**: Monitor read/write counts in Firebase console
- [ ] **Socket connections**: Check how many concurrent connections you can handle

**What to look for**: You should know approximate cost per user action.

### Estimate Costs
- [ ] Calculate: Cost per user per session
- [ ] Calculate: Cost per 100 users
- [ ] Set budget alerts (if using cloud provider)

**What to look for**: Costs should be predictable and acceptable.

---

## ✅ Experiment vs Production (Is Production Safe?)

### Check Feature Flags
- [ ] Identify experimental features (currently disabled services)
- [ ] Document which features are experimental
- [ ] Ensure experimental features can't accidentally enable in production

**What to look for**: Production should only have stable features.

### Test Production Build
- [ ] Build production version: `cd vtt-react && npm run build`
- [ ] Test production build locally
- [ ] Verify no development-only code runs in production
- [ ] Check environment variables are set correctly

**What to look for**: Production build works, no dev tools/logging in production.

---

## 🚀 Load Testing (Can It Handle Users?)

### Basic Load Test
- [ ] **Single user**: Use app normally for 30 minutes - no crashes?
- [ ] **Multiple tabs**: Open 5 tabs, use simultaneously - performance OK?
- [ ] **Multiple users**: Have 2-3 friends test together - multiplayer works?
- [ ] **Extended session**: Leave app running for 2+ hours - memory stable?

**What to look for**: No memory leaks, performance stays consistent.

### Stress Test (Optional but Recommended)
- [ ] Use provided load test script (see `scripts/load-test.js`)
- [ ] Test with 10, 50, 100 concurrent connections
- [ ] Monitor server resources (CPU, memory)
- [ ] Check error rates don't spike

**What to look for**: Server handles load gracefully, errors are logged.

---

## 📊 Health Monitoring

### Health Check Endpoints
- [ ] `GET /health` - Should return `{"status": "OK"}`
- [ ] `GET /metrics` - Should return stats
- [ ] `GET /debug/logs` - Should return recent logs

**What to look for**: All endpoints respond quickly (< 100ms).

### Set Up Monitoring (Before Launch)
- [ ] Configure uptime monitoring (UptimeRobot, Pingdom, etc.)
- [ ] Set up error alerts (Sentry, Rollbar, etc.)
- [ ] Monitor server resources (CPU, memory, disk)
- [ ] Set up log aggregation (if using cloud provider)

**What to look for**: You'll be notified if something breaks.

---

## 🐛 Known Issues to Fix Before Launch

Document issues you find during testing:

1. **Issue**: 
   - **Severity**: (Critical/High/Medium/Low)
   - **Steps to reproduce**:
   - **Expected behavior**:
   - **Actual behavior**:

2. **Issue**: 
   - **Severity**: 
   - **Steps to reproduce**:
   - **Expected behavior**:
   - **Actual behavior**:

---

## ✅ Final Pre-Launch Steps

- [ ] All critical issues fixed
- [ ] All high-priority issues documented
- [ ] Load testing completed
- [ ] Monitoring set up
- [ ] Backup/restore procedure tested
- [ ] Rollback plan documented
- [ ] Team knows how to check logs/debug issues
- [ ] Launch announcement ready

---

## 🆘 If Something Breaks After Launch

1. **Check logs**: `GET /debug/logs?level=error&limit=50`
2. **Check metrics**: `GET /metrics` - look for error spikes
3. **Check server**: CPU, memory, disk usage
4. **Check database**: Firebase console for errors
5. **Rollback if needed**: Have rollback procedure ready

---

**Remember**: It's better to launch with fewer features that work well than many features that break. Focus on core functionality first.

