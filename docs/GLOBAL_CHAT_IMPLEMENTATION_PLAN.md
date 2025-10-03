# Global Chat & Online Users System - Implementation Plan

## Overview
Implement a combined chat and friend list window accessible from the landing page that shows:
- All currently online users with their character details
- Their current session status (local/multiplayer room)
- Global chat functionality
- GM ability to invite players to multiplayer rooms

## Architecture Breakdown

### Layer 1: Firebase Presence System
**Purpose**: Track user online status and session information in real-time

**Data Structure** (`/presence/{userId}`):
```javascript
{
  userId: string,
  characterId: string,
  characterName: string,
  level: number,
  class: string,
  background: string,
  race: string,
  subrace: string,
  status: 'online' | 'away' | 'busy',
  sessionType: 'local' | 'multiplayer' | null,
  roomId: string | null,
  roomName: string | null,
  roomParticipants: string[] | null,
  lastSeen: timestamp,
  connectedAt: timestamp
}
```

**Global Chat Messages** (`/globalChat/{messageId}`):
```javascript
{
  id: string,
  senderId: string,
  senderName: string,
  senderClass: string,
  senderLevel: number,
  content: string,
  timestamp: timestamp,
  type: 'message' | 'system' | 'whisper'
}
```

### Layer 2: Server-Side Session Tracking
**New Socket Events to Add** (in `server/server.js`):

```javascript
// User presence events
socket.on('user_online', (userData) => { ... })
socket.on('user_offline', (userId) => { ... })
socket.on('update_session', (sessionData) => { ... })

// Global chat events
socket.on('global_chat_message', (message) => { ... })
socket.on('whisper_message', ({ targetUserId, message }) => { ... })

// Room invitation events
socket.on('send_room_invite', ({ targetUserId, roomId }) => { ... })
socket.on('respond_to_invite', ({ inviteId, accepted }) => { ... })

// Broadcast events
io.emit('user_status_changed', userData)
io.emit('global_chat_message', message)
io.to(targetSocketId).emit('room_invitation', inviteData)
```

### Layer 3: Client-Side State Management

**New Store**: `vtt-react/src/store/presenceStore.js`
```javascript
{
  onlineUsers: Map<userId, UserPresenceData>,
  globalChatMessages: Message[],
  pendingInvitations: Invitation[],
  currentUserPresence: UserPresenceData | null,
  
  // Actions
  updateUserPresence(userId, data),
  removeUser(userId),
  addGlobalMessage(message),
  sendGlobalMessage(content),
  sendWhisper(targetUserId, content),
  sendRoomInvite(targetUserId),
  respondToInvite(inviteId, accepted)
}
```

### Layer 4: UI Component Structure

**Main Component**: `GlobalChatWindow.jsx`
```
┌─────────────────────────────────────────────────────┐
│  Global Chat & Online Users          [_] [□] [X]   │
├──────────────────┬──────────────────────────────────┤
│  Online Users    │  Global Chat                     │
│  (30-40% width)  │  (60-70% width)                  │
│                  │                                  │
│  🟢 PlayerName   │  [System] PlayerName joined      │
│  Lvl 5 Pyrofiend │  PlayerName: Hello everyone!     │
│  Mystic, Nordmark│  [You]: Hey there!               │
│  📍 Local Session│                                  │
│                  │                                  │
│  🟢 GMName       │                                  │
│  Lvl 10 Titan    │                                  │
│  Zealot, Elf     │                                  │
│  🎮 Room: Epic   │                                  │
│     (3 players)  │                                  │
│                  │                                  │
│  [Search...]     │  [Type a message...]      [Send] │
└──────────────────┴──────────────────────────────────┘
```

**Component Files**:
1. `GlobalChatWindow.jsx` - Main container with split panes
2. `OnlineUsersList.jsx` - Left pane showing online users
3. `GlobalChat.jsx` - Right pane with chat interface
4. `RoomInvitationNotification.jsx` - Toast notification for invites

### Layer 5: Landing Page Integration

**Modify**: `vtt-react/src/components/landing/LandingPage.jsx`

Add chat button to header-actions:
```jsx
<div className="header-actions">
  {isAuthenticated && (
    <button className="chat-btn" onClick={handleOpenChat}>
      <i className="fas fa-comments"></i>
      Community
      {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
    </button>
  )}
  <button className="dev-bypass-btn" onClick={handleDevelopmentBypass}>
    <i className="fas fa-cog"></i>
    Dev Preview
  </button>
  <button className="login-btn" onClick={onShowLogin}>
    <i className="fas fa-user"></i>
    Login
  </button>
</div>
```

### Layer 6: GM Invite Functionality

**Context Menu Flow**:
1. User right-clicks on online player
2. Check if current user is GM with active multiplayer room
3. Show "Invite to Room" option if:
   - Current user is GM
   - Target user is not in current user's room
   - Target user is online
4. On click → Send invite via socket
5. Target receives notification with Accept/Decline
6. If accepted → Server adds player to room

**Server-Side Validation**:
```javascript
socket.on('send_room_invite', async ({ targetUserId, roomId }) => {
  // Validate sender is GM of the room
  const room = rooms.get(roomId);
  if (!room || room.gm.socketId !== socket.id) {
    return socket.emit('error', { message: 'Not authorized' });
  }
  
  // Find target user's socket
  const targetSocket = findSocketByUserId(targetUserId);
  if (!targetSocket) {
    return socket.emit('error', { message: 'User not online' });
  }
  
  // Send invitation
  const inviteId = uuidv4();
  targetSocket.emit('room_invitation', {
    inviteId,
    roomId,
    roomName: room.name,
    gmName: room.gm.name,
    expiresAt: Date.now() + 60000 // 1 minute
  });
});
```

### Layer 7: Data Flow Diagrams

**User Login Flow**:
```
User Login → Firebase Auth
  ↓
Select Character → characterStore
  ↓
presenceService.setOnline(characterData)
  ↓
Firebase: /presence/{userId} ← Write
  ↓
Socket: emit('user_online', characterData)
  ↓
Server: broadcast('user_status_changed')
  ↓
All Clients: presenceStore.updateUserPresence()
```

**Session Change Flow**:
```
Enter Local Game
  ↓
presenceService.updateSession({ sessionType: 'local' })
  ↓
Firebase + Socket Update
  ↓
All Clients See: "📍 Local Session"

Join Multiplayer Room
  ↓
presenceService.updateSession({
  sessionType: 'multiplayer',
  roomId, roomName, participants
})
  ↓
Firebase + Socket Update
  ↓
All Clients See: "🎮 Room: [Name] (X players)"
```

**Chat Message Flow**:
```
User Types Message
  ↓
presenceStore.sendGlobalMessage(content)
  ↓
Socket: emit('global_chat_message', messageData)
  ↓
Server: Store in Firebase /globalChat
  ↓
Server: broadcast('global_chat_message')
  ↓
All Clients: Append to chat history
```

## Implementation Phases

### Phase 1: Foundation (Priority: CRITICAL)
**Files to Create**:
- [ ] `vtt-react/src/services/firebase/presenceService.js`
- [ ] `vtt-react/src/store/presenceStore.js`

**Files to Modify**:
- [ ] `server/server.js` - Add socket events

**Tasks**:
1. Implement Firebase presence tracking with onDisconnect()
2. Create presenceStore with Zustand
3. Add server socket events for presence and global chat
4. Test with console logs

### Phase 2: UI Components (Priority: HIGH)
**Files to Create**:
- [ ] `vtt-react/src/components/social/GlobalChatWindow.jsx`
- [ ] `vtt-react/src/components/social/OnlineUsersList.jsx`
- [ ] `vtt-react/src/components/social/GlobalChat.jsx`
- [ ] `vtt-react/src/styles/global-chat.css`

**Tasks**:
1. Build split-pane layout with resizable divider
2. Implement online users list with character details
3. Implement chat interface with message history
4. Style with Pathfinder theme (reuse existing CSS)
5. Test UI in isolation

### Phase 3: Integration (Priority: HIGH)
**Files to Modify**:
- [ ] `vtt-react/src/components/landing/LandingPage.jsx`
- [ ] `vtt-react/src/components/landing/styles/LandingPage.css`
- [ ] `vtt-react/src/store/characterStore.js`
- [ ] `vtt-react/src/components/multiplayer/MultiplayerApp.jsx`

**Tasks**:
1. Add chat button to landing page header
2. Wire up presence updates on login/character selection
3. Wire up presence updates on session changes
4. Test end-to-end presence tracking
5. Test global chat functionality

### Phase 4: Advanced Features (Priority: MEDIUM)
**Files to Create**:
- [ ] `vtt-react/src/components/social/RoomInvitationNotification.jsx`

**Files to Modify**:
- [ ] `vtt-react/src/components/social/SocialContextMenu.jsx`
- [ ] `server/server.js` - Add invite handling

**Tasks**:
1. Add "Invite to Room" to context menu
2. Implement invitation notification UI
3. Add server-side invite validation and handling
4. Test invite accept/decline flow
5. Test GM-only permissions

## Existing Code to Reuse

### CSS Styling
- `vtt-react/src/components/multiplayer/styles/ChatWindow.css` - Chat message styling
- `vtt-react/src/styles/social-window.css` - Friend list styling
- `vtt-react/src/styles/chat-window.css` - Window chrome

### Components
- `WowWindow.jsx` - Window container with drag/resize
- `SocialContextMenu.jsx` - Right-click context menu
- `ChatWindow.jsx` - Message rendering logic

### State Management
- `chatStore.js` - Chat notification patterns
- `socialStore.js` - Friend list patterns
- `gameStore.js` - Socket connection

## Technical Considerations

### Performance
- Limit global chat history to last 100 messages in memory
- Use Firebase query limits for initial load
- Implement virtual scrolling for large user lists
- Debounce presence updates (max 1 per second)

### Security
- Validate all socket events on server
- Check GM permissions before allowing invites
- Sanitize chat messages (XSS prevention)
- Rate limit chat messages (max 5 per 10 seconds)

### Offline Handling
- Queue messages when offline
- Show "Connecting..." state
- Retry failed presence updates
- Cache last known online users list

## Next Steps

1. Review this plan and confirm approach
2. Start with Phase 1 (Foundation)
3. Test each phase before moving to next
4. Iterate based on feedback

Would you like me to start implementing Phase 1?

