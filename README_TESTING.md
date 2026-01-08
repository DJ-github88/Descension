# Testing Guide for Pre-Launch

This guide helps you test your application's stability before launching to users.

## Quick Start

### 1. Start Your Server
```bash
cd server
npm start
```

### 2. Run Health Check
```bash
node scripts/health-check.js
```

This will verify:
- ✅ Health endpoint responds
- ✅ Metrics endpoint works
- ✅ Logs endpoint accessible
- ✅ Response times are acceptable

### 3. Test Observability
```bash
# On Windows (PowerShell)
node scripts/test-observability.sh

# Or manually test endpoints:
curl http://localhost:3001/health
curl http://localhost:3001/metrics
curl http://localhost:3001/debug/logs?limit=10
```

### 4. Run Load Test (Optional)
```bash
# Test with 10 concurrent connections for 30 seconds
node scripts/load-test.js --connections=10 --duration=30

# Test with more connections
node scripts/load-test.js --connections=50 --duration=60
```

## What to Look For

### ✅ Good Signs
- Health checks all pass
- Response times < 100ms
- No errors in logs
- Load test success rate > 99%
- Memory usage stable over time

### 🚨 Red Flags
- Health checks fail
- Response times > 500ms
- Errors appearing in logs
- Load test success rate < 95%
- Memory usage growing (memory leak)

## Manual Testing Checklist

### Basic Functionality
- [ ] Create a user account
- [ ] Create a character
- [ ] Create a room
- [ ] Join a room
- [ ] Send a chat message
- [ ] Move a token
- [ ] Use item generation

### Edge Cases
- [ ] Click buttons multiple times quickly
- [ ] Refresh page mid-action
- [ ] Disconnect internet, reconnect
- [ ] Try invalid inputs (empty forms, etc.)
- [ ] Open multiple browser tabs

### Multiplayer
- [ ] Create room with password
- [ ] Join room with correct password
- [ ] Try joining with wrong password
- [ ] GM disconnects - players notified?
- [ ] Player rejoins - sees current state?

## Monitoring After Launch

### Check Logs
```bash
# View today's logs
cat server/logs/app-$(date +%Y-%m-%d).log

# View only errors
curl http://localhost:3001/debug/logs?level=error&limit=50

# View recent activity
curl http://localhost:3001/debug/logs?limit=100
```

### Check Metrics
```bash
curl http://localhost:3001/metrics | jq
```

Look for:
- Error counts (should be low)
- Active rooms/players
- Response times

### Check Server Health
```bash
# CPU and memory usage
# On Linux/Mac:
top
# or
htop

# On Windows:
# Task Manager -> Performance tab
```

## Common Issues and Fixes

### Issue: Health check fails
**Fix**: Check server is running, check port is correct

### Issue: No logs appearing
**Fix**: Check `server/logs/` directory exists and is writable

### Issue: High error rate in load test
**Fix**: Check server logs for specific errors, may need to optimize code

### Issue: Slow response times
**Fix**: Check database queries, optimize slow endpoints

## When You're Ready to Launch

1. ✅ All health checks pass
2. ✅ Load test shows acceptable performance
3. ✅ Manual testing shows no critical bugs
4. ✅ Monitoring is set up
5. ✅ You know how to check logs if issues arise

## Need Help?

If you find issues during testing:
1. Check `server/logs/` for error details
2. Use `/debug/logs` endpoint to query specific errors
3. Check `/metrics` for system stats
4. Review error messages - they should be descriptive

Remember: It's better to find issues now than after users start using your app!

