# Browser Disconnect Fix - Testing Guide

## Overview
This document provides testing instructions for the browser disconnect fix implemented in Phase 1 and Phase 2.

## What Was Fixed

### Phase 1 - Server-Side (Critical Fix)
**File**: `server/handlers/socketHandlers.js`

1. **New Function**: `handlePartyLeave(userId, userName, socketId)` (lines 253-331)
   - Extracted reusable party leave logic
   - Handles party member removal
   - Notifies remaining party members
   - Auto-disbands party when leader leaves
   - **Edge Case**: Detects multiple tabs/windows and only removes if no other connections exist

2. **Updated Event**: `leave_party` (lines 3007-3040)
   - Now uses the extracted `handlePartyLeave` function
   - Cleaner, more maintainable code

3. **Updated Event**: `disconnect` (lines 712-786)
   - **CRITICAL FIX**: Now calls `handlePartyLeave` when socket disconnects
   - Properly cleans up party membership on browser close
   - Notifies party members of departure
   - Enhanced GM disconnect notifications

### Phase 2 - Client-Side (Enhancement)
**File**: `vtt-react/src/components/multiplayer/MultiplayerApp.jsx`

1. **New Feature**: `beforeunload` handler (lines 5830-5868)
   - Attempts to send `leave_room` and `leave_party` events when browser closes
   - Best-effort cleanup (server-side is authoritative)
   - Handles rapid browser close scenarios

2. **New Feature**: `visibilitychange` handler
   - Tracks tab visibility changes
   - Could be extended to show "away" status

## Testing Scenarios

### Test 1: Player Browser Close (Primary Use Case)
**Objective**: Verify player leaves party when browser closes

**Steps**:
1. Start the server:
   ```bash
   cd server
   npm start
   ```

2. Open two different browsers (e.g., Chrome + Firefox) or incognito windows

3. **Player A** (First browser):
   - Create a party
   - Note the party ID or invite link

4. **Player B** (Second browser):
   - Join the party using invite/link
   - Verify both players see each other in Party HUD

5. **Player B**: Close the browser completely (not just the tab)

6. **Expected Results**:
   - ✅ Player A sees "Player B left party" notification immediately
   - ✅ Party HUD updates, Player B removed from member list
   - ✅ Server logs show: `[handlePartyLeave] Member left party, notifying others`
   - ✅ Server logs show: `[disconnect] Player disconnected`

**Server Logs to Monitor**:
```
[disconnect] Social presence removed { socketId: '...', userId: '...' }
[handlePartyLeave] Member left party, notifying others {
  userId: 'player-b-id',
  userName: 'Player B',
  partyId: 'party-123',
  remainingMembers: 1
}
[disconnect] Player disconnected { socketId: '...', playerId: '...', userId: '...' }
```

### Test 2: GM Browser Close (Party Disband)
**Objective**: Verify party disbands when GM (leader) closes browser

**Steps**:
1. GM creates a room and party
2. 2-3 players join the party
3. Verify all players see each other in Party HUD
4. GM closes browser completely

**Expected Results**:
- ✅ All players see "Party disbanded" notification
- ✅ Party HUD clears
- ✅ Server logs show: `[handlePartyLeave] Disbanding party { reason: 'leader_left' }`

**Server Logs to Monitor**:
```
[handlePartyLeave] Disbanding party {
  partyId: 'party-123',
  partyName: 'Adventure Party',
  reason: 'leader_left',
  leaderId: 'gm-user-id',
  leavingUserId: 'gm-user-id'
}
```

### Test 3: Multiple Tabs/Windows (Edge Case)
**Objective**: Verify user stays in party if other tabs are still open

**Steps**:
1. User opens two browser tabs
2. Both tabs connect to the same party (same user account)
3. Close ONE tab (not the browser)
4. Wait 5 seconds

**Expected Results**:
- ✅ User stays in party (other tab still connected)
- ✅ Server logs show: `[handlePartyLeave] User has other active connections, keeping in party`
- ✅ Other party members see no change

**Server Logs to Monitor**:
```
[handlePartyLeave] User has other active connections, keeping in party {
  userId: 'user-id',
  socketId: 'socket-1',
  otherSocketCount: 1
}
```

5. Now close the browser completely (all tabs)

**Expected Results**:
- ✅ User leaves party
- ✅ Party members notified

### Test 4: Network Disconnect
**Objective**: Verify cleanup when network drops (simulates connection loss)

**Steps**:
1. Two players in a party
2. Player B disables network connection (turn off WiFi or unplug ethernet)
3. Wait 10-20 seconds (socket timeout)

**Expected Results**:
- ✅ Player A sees "Player B left party" notification
- ✅ Party HUD updates
- ✅ Server logs show disconnect and party leave events

### Test 5: Tab Switching (Visibility Change)
**Objective**: Verify visibility tracking works

**Steps**:
1. Player in party
2. Switch to different browser tab
3. Check browser console

**Expected Results**:
- ✅ Console shows: `📱 [VisibilityChange] Tab hidden`
- ✅ When switching back: `📱 [VisibilityChange] Tab visible`

### Test 6: Browser Refresh (F5)
**Objective**: Verify disconnect/reconnect cycle

**Steps**:
1. Player in party
2. Refresh browser (F5 or Ctrl+R)

**Expected Results**:
- ✅ Socket disconnects briefly
- ✅ Socket reconnects
- ✅ Player should rejoin party (if auto-join logic exists)
- ✅ Or player sees "Reconnected" notification

## Manual Verification Checklist

Run through this checklist after implementing the fix:

### Server-Side Verification
- [ ] Server starts without errors
- [ ] No syntax errors in `socketHandlers.js`
- [ ] `handlePartyLeave` function exists and is callable
- [ ] Disconnect handler calls `handlePartyLeave`
- [ ] Logs appear when players disconnect

### Client-Side Verification
- [ ] React app compiles without errors
- [ ] `beforeunload` event listener added
- [ ] `visibilitychange` event listener added
- [ ] No console errors on page load

### Functional Verification
- [ ] Player browser close → leaves party
- [ ] GM browser close → disbands party
- [ ] Multiple tabs → only leaves when all close
- [ ] Party HUD updates immediately
- [ ] Notifications appear for other players
- [ ] Server logs are clear and informative

## Debugging Tips

### If Players Don't Leave Party on Disconnect

1. **Check Server Logs**:
   ```
   # Should see these logs when player disconnects:
   [disconnect] Social presence removed
   [handlePartyLeave] Member left party
   [disconnect] Player disconnected
   ```

2. **Verify Socket Events**:
   - Open browser DevTools → Network → WS (WebSocket)
   - Close browser
   - Should see WebSocket close event

3. **Check User ID Resolution**:
   - Ensure `socket.data.userId` is set correctly
   - Check `players` map has correct player data
   - Verify `onlineSocialUsers` has the user

### If Multiple Tabs Issue Occurs

1. **Check `getSocketsByUserId` Function**:
   - Ensure it returns all sockets for a given userId
   - Verify socket.connected status is accurate

2. **Test Multi-Tab Detection**:
   ```javascript
   // In server logs, should see:
   [handlePartyLeave] User has other active connections, keeping in party
   ```

### If Party Doesn't Disband When Leader Leaves

1. **Verify Leader ID**:
   - Check `party.leaderId` is set correctly
   - Ensure it matches the leaving user's ID

2. **Check Disband Logic**:
   ```javascript
   // Should trigger when:
   remainingMemberIds.length === 0 || party.leaderId === userId
   ```

## Known Limitations

1. **beforeunload Unreliability**:
   - Modern browsers may not send events from `beforeunload`
   - This is why server-side cleanup is critical
   - Server is the authoritative source of truth

2. **Grace Period Not Implemented**:
   - Current implementation removes immediately on disconnect
   - Could add 5-10 second delay for reconnection
   - Trade-off: slower cleanup vs. better UX for brief disconnects

3. **Permanent Rooms**:
   - GM disconnect marks room as inactive
   - Players are notified but room persists in database
   - Future enhancement: players could stay in room with GM offline

## Performance Considerations

- `getSocketsByUserId` iterates through all sockets (O(n))
- Could optimize with userId → socketId mapping
- Current implementation is fine for < 100 concurrent users

## Next Steps

After verifying all tests pass:

1. **Deploy to Staging**: Test in staging environment
2. **Monitor Logs**: Watch for any edge cases in production
3. **User Feedback**: Gather feedback on disconnect notifications
4. **Consider Enhancements**:
   - Add grace period for reconnection
   - Show "Player reconnecting..." status
   - Implement permanent room GM offline behavior

## Rollback Plan

If issues arise in production:

1. **Revert Server Changes**:
   ```bash
   cd server
   git checkout HEAD~1 handlers/socketHandlers.js
   npm start
   ```

2. **Revert Client Changes**:
   ```bash
   cd vtt-react
   git checkout HEAD~1 src/components/multiplayer/MultiplayerApp.jsx
   npm run build
   ```

3. **Monitor**: Check for party-related bugs after rollback

## Support

If you encounter issues:
1. Check server logs for errors
2. Verify socket connection status
3. Test with browser DevTools open
4. Review this testing guide
5. Check GitHub issues for known problems
