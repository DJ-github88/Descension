# Party Management & Session Features - Implementation Summary

## Completed Features

### 1. Leave Party via Context Menu ✅
- Right-click your own name in the party HUD
- Select "Leave Party" option
- Automatically calls `partyStore.leaveParty()`
- Server handles `leave_party` event

### 2. Notification When Invitee Already in Party ✅
- Server checks `userToParty.get(toUserId)` before creating invitation
- If user already in party, emits `party_invite_failed` event
- Client shows chat notification: "User is already in a party"

### 3. Join Session via Party Leader (Request-Approval Flow) ✅
- Right-click party leader (when they're in a session)
- Select "Join Session" option
- Sends join request to leader
- Leader receives modal notification with Accept/Decline buttons
- If accepted: Member receives room invitation and joins session
- If declined: Member receives notification

### 4. Party Leader Invites Member to Session ✅
- Leader (in session) right-clicks party member
- Select "Invite to Session" option
- Sends `gm_session_invitation` to member
- Member receives standard GM session invitation modal
- Accept/Decline flow follows existing pattern

## File Changes

### Backend (server/handlers/socketHandlers.js)
- Added `roomJoinRequests` Map for tracking join requests
- Added `request_to_join_session` handler
- Added `respond_to_join_request` handler
- Added `invite_member_to_session` handler
- Modified `invite_to_party` to check if user already in party

### Frontend State Management (vtt-react/src/store/presenceStore.js)
- Added state: `sessionJoinRequests`, `sentJoinRequests`
- Added methods:
  - `requestToJoinSession(leaderId, roomId, requesterId, requesterName)`
  - `respondToJoinRequest(requestId, accepted)`
  - `sendSessionInvitation(memberId, roomId)`
  - `dismissSessionJoinRequest(requestId)`
- Added socket listeners:
  - `session_join_request`
  - `join_request_accepted`
  - `join_request_declined`
  - `party_invite_failed`
  - `session_invitation_sent`
  - `invite_error`

### Frontend Components

#### vtt-react/src/components/hud/PartyHUD.jsx
- Added party management options to context menu:
  - "Leave Party" (for self)
  - "Join Session" (when leader in session)
  - "Invite to Session" (when leader in session)
  - "Whisper" (for all members)
- Options hide when not applicable (no grayed out options)
- Uses `multiplayerRoom` from gameStore to check session status

#### vtt-react/src/components/social/SessionJoinRequest.jsx (NEW)
- Modal component for join requests
- Shows requester name and room ID
- Countdown timer (60 seconds)
- Accept/Decline buttons
- Auto-expires when timer runs out
- Styled similar to GM session invitation

#### vtt-react/src/components/social/SocialNotificationLayer.jsx
- Added `SessionJoinRequestContainer` import
- Renders session join requests in center-screen overlay
- Added `sessionJoinRequests` to state subscription

## Testing Checklist

### Backend Tests
- [x] `request_to_join_session` validates room and leader
- [x] `respond_to_join_request` handles accept/decline correctly
- [x] `invite_member_to_session` validates inviter is in room
- [x] `invite_to_party` rejects if user already in party
- [x] All requests expire after timeout
- [x] Socket cleanup on disconnect

### Frontend Tests
- [x] Right-click own name shows "Leave Party"
- [x] Clicking "Leave Party" removes self from party
- [x] Right-click leader (in session) shows "Join Session"
- [x] "Join Session" sends request to leader
- [x] Right-click member (as leader in session) shows "Invite to Session"
- [x] "Invite to Session" sends invitation to member
- [x] Inviting user already in party shows chat notification
- [x] Context menu hides unavailable options
- [x] Whisper option works for all members

## Socket Events Reference

### New Events

#### Client → Server
```javascript
// Member requests to join leader's session
socket.emit('request_to_join_session', {
  leaderId: string,
  roomId: string,
  requesterId: string,
  requesterName: string
})

// Leader responds to join request
socket.emit('respond_to_join_request', {
  requestId: string,
  accepted: boolean
})

// Leader invites member to session
socket.emit('invite_member_to_session', {
  memberId: string,
  roomId: string
})
```

#### Server → Client
```javascript
// Leader receives join request
socket.on('session_join_request', (request) => {
  // request: { id, roomId, requesterId, requesterName, leaderId, createdAt, expiresAt }
})

// Member receives acceptance
socket.on('join_request_accepted', (data) => {
  // data: { invitation, roomId }
})

// Member receives declination
socket.on('join_request_declined', (data) => {
  // data: { requestId, leaderId }
})

// Inviter receives failure notification
socket.on('party_invite_failed', (data) => {
  // data: { error, toUserId }
})

// Leader receives confirmation
socket.on('session_invitation_sent', (data) => {
  // data: { memberId, invitationId }
})
```

## Architecture Notes

### Design Decisions
1. **Request-Approval Flow**: Join requests require leader approval for better control
2. **Hide Unavailable Options**: Context menu only shows relevant actions
3. **Chat Notifications**: "Already in party" errors shown in chat (non-intrusive)
4. **Reuse Existing Systems**: Session invitations reuse `gm_session_invitation` event
5. **60-Second Timeout**: Join requests auto-expire after 60 seconds

### State Flow
```
Member → request_to_join_session → Server
Server → session_join_request → Leader
Leader → respond_to_join_request → Server
Server → join_request_accepted/declined → Member
```

### Invitation Flow
```
Leader → invite_member_to_session → Server
Server → gm_session_invitation → Member
Member → respond_to_room_invitation → Server
Server → room_joined → Member
```

## Future Enhancements
- [ ] Add "Promote to Leader" option in context menu
- [ ] Add "Kick from Party" option for leaders
- [ ] Add party member status indicators (in session, offline, etc.)
- [ ] Add party chat history
- [ ] Add party settings (max members, invite permissions, etc.)
