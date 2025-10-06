# Status System Debug Guide

## Issue
Status changes (clicking Away, Busy, etc.) don't update the displayed status in the Community window.

## Debugging Steps

### 1. Open Browser Console
Press F12 to open Developer Tools and go to the Console tab.

### 2. Test Status Change
1. Open the Community window
2. Click the status dropdown button
3. Click "Away" (or any other status)
4. Watch the console for these log messages:

#### Expected Console Output:
```
🔄 Changing status to: away
📝 Current status: online
💬 Status comment draft: 
🔍 updateStatus called with: {status: "away", statusComment: null}
👤 currentUserPresence: {userId: "...", status: "online", ...}
👥 onlineUsers size: X
🔥 Firebase update success: true/false
📦 Updates object: {userId: "...", status: "away", lastUpdated: ...}
📦 Old status: online → New status: away
🔍 User exists in onlineUsers: true userId: ...
✅ Updated currentUserPresence and onlineUsers
✅ New currentUserPresence status: away
✅ Status updated to: away
✅ Status update result: true
🔍 OnlineUsersList - currentUserPresence changed: {userId: "...", status: "away", ...}
```

### 3. Check Status Button
After clicking Away, the status button should show:
- Icon: 🟡 (yellow circle)
- Text: "away"

### 4. Common Issues to Check

#### Issue A: currentUserPresence is null
**Symptom**: Console shows `❌ No currentUserPresence found!`

**Solution**: User needs to be logged in and have initialized presence
- Check if you're logged in
- Check if you selected a character
- Try refreshing the page

#### Issue B: User not in onlineUsers map
**Symptom**: Console shows `⚠️ User not found in onlineUsers map`

**Solution**: The user should be added to the map automatically, but if not:
- Check `initializePresence` was called
- Check `subscribeToOnlineUsers` was called
- Try logging out and back in

#### Issue C: Status updates but UI doesn't reflect it
**Symptom**: Console shows status updated successfully, but button still shows old status

**Possible Causes**:
1. **Zustand not detecting change**: Fixed by adding `lastUpdated` timestamp
2. **Component not re-rendering**: Fixed by using Zustand selector
3. **Idle detection interfering**: Fixed by checking current status before restoring

#### Issue D: Idle detection immediately restores status
**Symptom**: Status changes to "away" then immediately back to "online"

**Solution**: This was fixed by:
- Only restoring status if current status is still "idle"
- Clearing idle state if user manually changed status

### 5. Manual Testing Checklist

- [ ] Click status button - dropdown appears
- [ ] Click "Away" - dropdown closes
- [ ] Status button shows 🟡 and "away"
- [ ] Status appears in user list as "away"
- [ ] Status appears on Party HUD (if in a party)
- [ ] Click status button again - still shows "away"
- [ ] Change to "Busy" - shows 🔴 and "busy"
- [ ] Change to "Online" - shows 🟢 and "online"
- [ ] Change to "Appear Offline" - shows ⚫ and "offline"
- [ ] Wait 2 minutes - status changes to ⚪ "idle"
- [ ] Move mouse - status restores to previous status

### 6. Advanced Debugging

#### Check Zustand Store State
In console, run:
```javascript
// Get the store
const store = window.__ZUSTAND_STORES__?.presenceStore || usePresenceStore;

// Check current user presence
console.log('Current User Presence:', store.getState().currentUserPresence);

// Check online users
console.log('Online Users:', Array.from(store.getState().onlineUsers.values()));
```

#### Manually Update Status
In console, run:
```javascript
// Get the updateStatus function
const updateStatus = usePresenceStore.getState().updateStatus;

// Try updating status
await updateStatus('away', null);

// Check if it worked
console.log('New status:', usePresenceStore.getState().currentUserPresence?.status);
```

#### Check for React Re-renders
Add this to OnlineUsersList component:
```javascript
useEffect(() => {
  console.log('🔄 OnlineUsersList re-rendered');
});
```

### 7. Known Fixes Applied

1. **Store Update Fix** (presenceStore.js)
   - Now updates both `currentUserPresence` and `onlineUsers` in single atomic operation
   - Added `lastUpdated` timestamp to ensure Zustand detects change
   - Combined set() calls to prevent race conditions

2. **Idle Detection Fix** (useIdleDetection.js)
   - Only restores status if current status is still "idle"
   - Clears idle state if user manually changed status while idle
   - Prevents interference with manual status changes

3. **Status Comment Fix** (OnlineUsersList.jsx)
   - Changed to pass `null` for statusComment when changing status
   - Prevents empty string from interfering with status update

4. **Debug Logging** (All files)
   - Added comprehensive logging to trace status changes
   - Logs show exact flow of status updates
   - Easy to identify where issues occur

### 8. If Status Still Doesn't Update

#### Check React DevTools
1. Install React DevTools browser extension
2. Open DevTools → Components tab
3. Find OnlineUsersList component
4. Check props and hooks
5. Look for `currentUserPresence` in hooks
6. Verify it updates when you change status

#### Check Network Tab
1. Open DevTools → Network tab
2. Filter for Firebase requests
3. Change status
4. Look for PUT/PATCH requests to Firebase
5. Check if request succeeds

#### Check for Errors
1. Open DevTools → Console tab
2. Look for any red error messages
3. Check for warnings about state updates
4. Look for Firebase errors

### 9. Reporting Issues

If status still doesn't work, provide:
1. Full console output when changing status
2. Screenshot of status button before and after
3. Browser and version
4. Whether you're logged in
5. Whether you have a character selected
6. Any error messages in console

### 10. Quick Fix Attempts

Try these in order:

1. **Refresh Page**
   - Sometimes state gets corrupted
   - Refresh clears everything

2. **Log Out and Back In**
   - Reinitializes presence system
   - Clears any stale state

3. **Clear Browser Cache**
   - Old code might be cached
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

4. **Check Character Selection**
   - Make sure you have an active character
   - Status system requires character data

5. **Disable Idle Detection Temporarily**
   - Comment out `useIdleDetection()` in App.jsx
   - Test if idle detection is interfering

