# Party System Troubleshooting Guide

## 🔴 Critical Issue: Socket Server Not Running

### Problem
You're seeing `ERR_CONNECTION_REFUSED` for `http://localhost:3001` because the Socket.IO server is not running.

### Quick Fix

#### Option 1: Start Both Servers (Recommended)
```bash
# From the root directory (D:\Mythrill\Descension)
npm start
```
This will run BOTH the frontend (port 3000) and the Socket.IO backend (port 3001) concurrently.

#### Option 2: Start Servers Separately
```bash
# Terminal 1 - Start Socket.IO Backend
cd server
npm start

# Terminal 2 - Start Frontend
cd vtt-react
npm start
```

### Verify Server is Running
```bash
# Check if port 3001 is listening
netstat -an | findstr :3001
```

You should see `LISTENING` or `ESTABLISHED` for port 3001.

---

## 🟠 Fixed Issues in This Update

### Issue 1: Party Creation Function Signature ✅
**Fixed:** `partyStore.js` now accepts the `leaderData` parameter from `PartyCreationDialog.jsx`.

**Before:** Parties were created with placeholder data (Game Master/Game Leader, Unknown class)
**After:** Parties are created with actual user character data (name, class, level)

### Issue 2: Socket Connection Error Handling ✅
**Added:** Connection error handlers with automatic reconnection logic.

**New Features:**
- Detects when socket connection fails
- Shows error in console: `❌ Socket connection error:`
- Automatically retries (up to 5 attempts)
- 1-second delay between reconnection attempts

### Issue 3: Better Party Invite System ✅
**Note:** Both party invite systems (partyStore and presenceStore) are now functional.
- `partyStore.inviteToParty` - Full validation via server
- `presenceStore.sendPartyInvite` - Legacy simple relay
- UI uses `presenceStore` version ( FriendsList.jsx)

---

## 📋 Testing the Fixes

### Test 1: Create a Party
1. Navigate to Community window
2. Click "+ Create Party" button
3. Enter a party name
4. Click "Create Party"
5. **Expected:** Party is created with your character data as leader

### Test 2: Invite a Friend to Party
1. Right-click on a friend in the Friends tab
2. Select "Invite to Party"
3. **Expected:** Friend receives a popup invitation

### Test 3: Friend Online Status
1. With both servers running, open two browsers with different accounts
2. Add each other as friends (if not already)
3. **Expected:** Both should see each other as online

---

## 🔧 Configuration Options

### Use Local Socket Server (Port 3001)
**File:** `vtt-react\.env.development`
```bash
REACT_APP_SOCKET_URL=http://localhost:3001
```

### Use Railway Production Backend
**File:** `vtt-react\.env.development`
```bash
REACT_APP_SOCKET_URL=https://descension-mythrill.up.railway.app
```

**When to use each:**
- **Local server (port 3001):** Full local testing, can debug both frontend and backend
- **Railway backend:**** Test frontend locally while using production multiplayer backend

---

## 📊 Architecture Notes

### Party System Flow
```
User clicks "Create Party"
  ↓
PartyCreationDialog collects user data
  ↓
partyStore.createParty(name, isGM, leaderData) ✅ Now accepts leaderData
  ↓
socket.emit('create_party', { partyName, leaderData })
  ↓
Server: server.js:5243-5309
  ↓
socket.emit('party_created', partyData) to all clients
  ↓
presenceStore.setSocket() listener (party_created event) ✅
  ↓
partyStore state updated: { currentParty, isInParty, partyMembers }
```

### Invite System Flow
```
User right-clicks friend → "Invite to Party"
  ↓
FriendsList: handleInvite() → presenceStore.sendPartyInvite()
  ↓
socket.emit('send_party_invite', invitation)
  ↓
Server: server.js:5873-5891 (legacy relay)
  ↓
Find target user's socket → emit('party_invite_received', invitation)
  ↓
presenceStore.setSocket() listener (party_invite_received) ✅
  ↓
addPartyInvite(invitation) → SocialNotificationLayer renders popup
```

---

## 🐛 Known Limitations

### Dual Invite Systems
The codebase has two party invite systems:
1. **partyStore.inviteToParty** - Newer, server-validated
2. **presenceStore.sendPartyInvite** - Legacy, simple relay

Current UI uses the **legacy system** (presenceStore). This works but has less validation.

### Friend Online Status
- **Firebase presence:** Always accurate (real-time database)
- **Socket-based status:** Only works when socket server is running
- **UI shows:** Socket-based status (so appears offline without server)

---

## 🎯 Next Steps for Development

1. ✅ Fix party creation function - **DONE**
2. ✅ Add socket error handling - **DONE**
3. ⏳ Resolve dual invite system (pick one system)
4. ⏳ Add UI socket status indicator
5. ⏳ Improve friend online/offline detection fallback
6. ⏳ Add party invite validation (prevent duplicate invites, etc.)
