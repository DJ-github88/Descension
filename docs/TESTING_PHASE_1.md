# Testing Phase 1 - Global Chat & Presence System

## Quick Test Guide

### Prerequisites
1. Firebase Realtime Database must be enabled in Firebase Console
2. Server must be running (`npm start` in `/server`)
3. React app must be running (`npm start` in `/vtt-react`)

---

## Test 1: Firebase Realtime Database Setup

### Check Firebase Console:
1. Go to: https://console.firebase.google.com/project/mythrill-ff7c6
2. Navigate to: **Realtime Database** (in left sidebar)
3. If not created, click **Create Database**
4. Choose location: **europe-west1** (to match config)
5. Start in **test mode** for now (we'll add rules later)

### Verify Database URL:
The database URL should be:
```
https://mythrill-ff7c6-default-rtdb.europe-west1.firebasedatabase.app
```

This matches the URL in `vtt-react/src/config/firebase.js`

---

## Test 2: Console Testing (No UI Required)

### Open Browser Console:
1. Open the React app in browser
2. Open Developer Tools (F12)
3. Go to Console tab

### Test Presence Service:
```javascript
// Import the service (if not already available)
import presenceService from './services/firebase/presenceService';
import usePresenceStore from './store/presenceStore';

// Test 1: Set user online
const testUser = {
  id: 'char_test_123',
  name: 'Test Hero',
  level: 5,
  class: 'Pyrofiend',
  background: 'Mystic',
  race: 'Human',
  subrace: 'Nordmark'
};

const testSession = {
  sessionType: 'local'
};

// Initialize presence
await presenceService.setOnline('user_test_123', testUser, testSession);

// Check Firebase Console - you should see:
// /presence/user_test_123 with all the data
```

### Test Presence Store:
```javascript
// Get the store
const store = usePresenceStore.getState();

// Initialize presence
await store.initializePresence('user_test_123', testUser, testSession);

// Subscribe to online users
store.subscribeToOnlineUsers();

// Check current user presence
console.log('Current user:', store.currentUserPresence);

// Check online users
console.log('Online users:', store.getOnlineUsersArray());
```

### Test Session Updates:
```javascript
// Update to multiplayer session
await store.updateSession({
  sessionType: 'multiplayer',
  roomId: 'room_123',
  roomName: 'Epic Adventure',
  roomParticipants: ['Player1', 'Player2', 'GM']
});

// Check Firebase Console - should see updated session data
```

---

## Test 3: Socket.io Testing

### Test in Browser Console:
```javascript
// Assuming socket is available from gameStore or similar
import useGameStore from './store/gameStore';

const socket = useGameStore.getState().socket;

// Test user online event
socket.emit('user_online', {
  userId: 'user_test_123',
  characterId: 'char_test_123',
  characterName: 'Test Hero',
  level: 5,
  class: 'Pyrofiend',
  background: 'Mystic',
  race: 'Human',
  subrace: 'Nordmark',
  status: 'online',
  sessionType: 'local'
});

// Listen for status changes
socket.on('user_status_changed', (data) => {
  console.log('User status changed:', data);
});

// Test global chat
socket.emit('global_chat_message', {
  id: 'msg_' + Date.now(),
  senderId: 'user_test_123',
  senderName: 'Test Hero',
  senderClass: 'Pyrofiend',
  senderLevel: 5,
  content: 'Hello from the test!',
  timestamp: new Date().toISOString(),
  type: 'message'
});

// Listen for chat messages
socket.on('global_chat_message', (message) => {
  console.log('Chat message received:', message);
});
```

---

## Test 4: Multi-User Testing

### Setup:
1. Open app in **Chrome** (User 1)
2. Open app in **Firefox** or **Incognito Chrome** (User 2)
3. Open Firebase Console in another tab

### Test Scenario:

#### User 1 (Chrome):
```javascript
const store = usePresenceStore.getState();

await store.initializePresence('user_1', {
  id: 'char_1',
  name: 'Hero One',
  level: 5,
  class: 'Pyrofiend',
  background: 'Mystic',
  race: 'Human',
  subrace: 'Nordmark'
}, { sessionType: 'local' });

store.subscribeToOnlineUsers();

// Send a message
store.sendGlobalMessage('Hello from User 1!');
```

#### User 2 (Firefox):
```javascript
const store = usePresenceStore.getState();

await store.initializePresence('user_2', {
  id: 'char_2',
  name: 'Hero Two',
  level: 8,
  class: 'Titan',
  background: 'Zealot',
  race: 'Elf',
  subrace: 'High Elf'
}, { sessionType: 'local' });

store.subscribeToOnlineUsers();

// Check online users
console.log('Online users:', store.getOnlineUsersArray());
// Should see both User 1 and User 2

// Send a message
store.sendGlobalMessage('Hello from User 2!');
```

#### Expected Results:
- Both users should see each other in `onlineUsers`
- Both users should receive each other's chat messages
- Firebase Console should show both users in `/presence/`
- Server console should log all events

---

## Test 5: Disconnect Handling

### Test Auto-Offline:
1. Have User 1 online
2. Close User 1's browser tab
3. Wait 5-10 seconds
4. Check Firebase Console - User 1 should be marked offline
5. User 2 should receive `user_status_changed` event with status: 'offline'

### Test Manual Offline:
```javascript
// User 1
const store = usePresenceStore.getState();
await store.setOffline();

// Check Firebase Console - should be marked offline
// User 2 should receive offline notification
```

---

## Test 6: Room Invitations

### Setup:
- User 1: GM with active multiplayer room
- User 2: Online but not in a room

### Test Invite Flow:

#### User 1 (GM):
```javascript
const store = usePresenceStore.getState();

// Send invite to User 2
store.sendRoomInvite('user_2', 'room_123', 'Epic Adventure');
```

#### User 2:
```javascript
// Listen for invitations
const store = usePresenceStore.getState();

// Should receive invitation in pendingInvitations
console.log('Pending invites:', store.pendingInvitations);

// Accept invitation
store.respondToInvite('invite_id_here', true);

// Decline invitation
store.respondToInvite('invite_id_here', false);
```

---

## Test 7: Firebase Console Verification

### Check Realtime Database:
Navigate to: Firebase Console → Realtime Database

**Expected Structure**:
```
presence/
  ├─ user_1/
  │   ├─ userId: "user_1"
  │   ├─ characterId: "char_1"
  │   ├─ characterName: "Hero One"
  │   ├─ level: 5
  │   ├─ class: "Pyrofiend"
  │   ├─ background: "Mystic"
  │   ├─ race: "Human"
  │   ├─ subrace: "Nordmark"
  │   ├─ status: "online"
  │   ├─ sessionType: "local"
  │   ├─ roomId: null
  │   ├─ roomName: null
  │   ├─ roomParticipants: null
  │   ├─ connectedAt: [timestamp]
  │   └─ lastSeen: [timestamp]
  └─ user_2/
      └─ [similar structure]
```

### Check Firestore (Future):
Navigate to: Firebase Console → Firestore Database

**Expected Collection** (when implemented):
```
globalChat/
  ├─ [messageId1]/
  │   ├─ senderId: "user_1"
  │   ├─ senderName: "Hero One"
  │   ├─ senderClass: "Pyrofiend"
  │   ├─ senderLevel: 5
  │   ├─ content: "Hello from User 1!"
  │   ├─ type: "message"
  │   ├─ timestamp: [serverTimestamp]
  │   └─ createdAt: [ISO string]
  └─ [messageId2]/
      └─ [similar structure]
```

---

## Test 8: Server Console Verification

### Expected Server Logs:

```
👤 User online: Hero One
📍 Session updated: Hero One local
💬 Global chat: Hero One - Hello from User 1!
👤 User online: Hero Two
💬 Global chat: Hero Two - Hello from User 2!
🤫 Whisper: Hero One -> Hero Two
📨 Room invite sent: Hero One -> Hero Two for room: Epic Adventure
✅ Invitation accepted: Hero Two joining room: Epic Adventure
👋 User disconnected and marked offline: Hero One
```

---

## Common Issues & Solutions

### Issue 1: "Firebase Realtime Database not configured"
**Solution**: 
- Check Firebase Console - ensure Realtime Database is created
- Verify `databaseURL` in `firebase.js` matches your database URL
- Check browser console for Firebase initialization errors

### Issue 2: "Cannot read property 'emit' of undefined"
**Solution**:
- Socket not connected yet
- Wait for socket connection before calling presence methods
- Check `store.isConnected` before emitting events

### Issue 3: Users not seeing each other
**Solution**:
- Ensure both users called `subscribeToOnlineUsers()`
- Check server console for broadcast events
- Verify socket connections are active
- Check Firebase Console for presence data

### Issue 4: Messages not broadcasting
**Solution**:
- Check server is running
- Verify socket connection
- Check server console for errors
- Ensure CORS is configured correctly

### Issue 5: Presence not clearing on disconnect
**Solution**:
- Check Firebase Realtime Database rules
- Verify `onDisconnect()` is being called
- May take 5-10 seconds for Firebase to detect disconnect
- Check server disconnect handler is running

---

## Success Criteria

Phase 1 is working correctly if:

- ✅ Users appear in Firebase Realtime Database when online
- ✅ Users auto-marked offline on disconnect
- ✅ Multiple users can see each other in real-time
- ✅ Session updates reflect in Firebase and broadcast to all users
- ✅ Global chat messages broadcast to all connected clients
- ✅ Whisper messages only reach target user
- ✅ Room invitations sent and received correctly
- ✅ Server logs show all events
- ✅ No console errors in browser or server

---

## Next: Phase 2 UI Development

Once all tests pass, proceed to Phase 2:
- Build the UI components
- Add chat button to landing page
- Create the combined chat/online users window
- Wire up all the events to the UI

See `GLOBAL_CHAT_IMPLEMENTATION_PLAN.md` for Phase 2 details.

