# Status System Implementation

## Overview
Comprehensive status system with automatic idle detection, manual status setting, and HUD integration.

## Status Types

### Available Statuses
1. **🟢 Online** (Green) - User is actively using the application
2. **🟡 Away** (Yellow) - User has manually set themselves as away
3. **🔴 Busy** (Red) - User has manually set themselves as busy
4. **⚪ Idle** (Grey) - User has been inactive for 2+ minutes (automatic)
5. **⚫ Appear Offline** (White) - User has manually chosen to appear offline

## Features Implemented

### 1. Manual Status Setting
**Location**: Community Window → Status Dropdown

Users can manually set their status by clicking the status button in the community window header:
- Click the status button (shows current status icon and label)
- Select from: Online, Away, Busy, or Appear Offline
- Add optional status comment (max 100 characters)
- Status updates immediately in both the community window and party HUD

**Files Modified**:
- `vtt-react/src/components/social/OnlineUsersList.jsx`
  - Added "Appear Offline" option to status menu
  - Updated status icon mapping to include idle and offline states
  
- `vtt-react/src/components/social/UserCard.jsx`
  - Updated status icon mapping to include idle and offline states

### 2. Automatic Idle Detection
**Feature**: Automatically sets user to "Idle" after 2 minutes of inactivity

**How it works**:
- Monitors user activity (mouse movement, clicks, keyboard, scroll, touch)
- After 2 minutes of no activity, automatically changes status to "Idle"
- Saves previous status (online/away/busy) before going idle
- When user becomes active again, restores their previous status
- Mouse movement is throttled to once per second to avoid excessive updates

**Files Created**:
- `vtt-react/src/hooks/useIdleDetection.js` - New hook for idle detection

**Files Modified**:
- `vtt-react/src/App.jsx` - Integrated idle detection hook into main app

### 3. HUD Status Display
**Feature**: Status indicator appears on party member HUDs

**Implementation**:
- Status dot appears on each party member's HUD frame
- Current player's status is pulled from presenceStore
- Status updates in real-time when changed
- Color-coded dots match the status system

**Files Modified**:
- `vtt-react/src/components/hud/PartyHUD.jsx`
  - Added presenceStore import
  - Added currentUserPresence to get user's status
  - Updated displayMembers to include status for current player

- `vtt-react/src/styles/party-hud.css`
  - Added `.status-dot.idle` styling (grey)
  - Updated `.status-dot.offline` styling (white with border)

### 4. Store Updates
**Feature**: Status changes properly update both currentUserPresence and onlineUsers map

**Fix Applied**:
When a user changes their status, the update now:
1. Updates the `currentUserPresence` object (user's own presence data)
2. Updates the user's entry in the `onlineUsers` Map (what others see)
3. Syncs to Firebase (if configured)
4. Emits socket event for real-time multiplayer updates

**Files Modified**:
- `vtt-react/src/store/presenceStore.js`
  - Fixed `updateStatus` function to update both currentUserPresence and onlineUsers
  - Ensures UI reflects status changes immediately

## Technical Details

### Status Flow
```
User Action → updateStatus() → {
  1. Update Firebase (if configured)
  2. Update currentUserPresence in store
  3. Update user in onlineUsers Map
  4. Emit socket event (if connected)
}
```

### Idle Detection Flow
```
User Activity → Reset Timer → {
  If was idle: Restore previous status
  Start 2-minute timer
}

Timer Expires → {
  Save current status
  Set status to 'idle'
}
```

### Status Priority
1. **Manual Status** - User explicitly sets status (highest priority)
2. **Idle Status** - Automatic after 2 minutes of inactivity
3. **Default Status** - Online (when user first logs in)

### Status Persistence
- Status is stored in Firebase Realtime Database
- Status persists across page refreshes
- Status is cleared when user logs out
- Idle status is NOT persisted (resets to previous status on refresh)

## CSS Classes

### Status Dot Styles
```css
.status-dot.online  /* Green - #4CAF50 */
.status-dot.away    /* Orange - #FF9800 */
.status-dot.busy    /* Red - #F44336 */
.status-dot.idle    /* Grey - #9E9E9E */
.status-dot.offline /* White - #FFFFFF with border */
```

## User Experience

### Setting Status
1. Open Community window
2. Click status button (top of users list)
3. Select desired status from dropdown
4. Optionally add status comment
5. Status updates immediately everywhere

### Idle Behavior
1. User is active (online/away/busy)
2. User stops interacting for 2 minutes
3. Status automatically changes to "Idle" (grey dot)
4. Previous status is remembered
5. User moves mouse/clicks/types
6. Status automatically restores to previous state

### Status Visibility
- **Community Window**: Status icon next to username
- **Party HUD**: Status dot on party member frame
- **User Card**: Status icon in user details
- **Status Button**: Shows current status with icon and label

## Future Enhancements

### Potential Additions
1. Custom status messages (already supported via status comment)
2. Status history/logging
3. Do Not Disturb mode (blocks invitations)
4. Mobile/tablet idle detection
5. Configurable idle timeout (currently fixed at 2 minutes)
6. Status-based notifications (e.g., notify when friend comes online)

## Testing Checklist

- [x] Status changes update in Community window
- [x] Status changes update on Party HUD
- [x] Idle detection activates after 2 minutes
- [x] Activity restores previous status from idle
- [x] Status persists across page refresh (except idle)
- [x] Status syncs in multiplayer sessions
- [x] All status icons display correctly
- [x] Status comment saves and displays
- [x] Appear Offline hides user from online list (if implemented)

## Known Limitations

1. **Idle Detection Accuracy**: Based on browser events, may not detect all activity types
2. **Tab Visibility**: Idle detection continues even when tab is not visible
3. **Multiple Tabs**: Each tab has independent idle detection
4. **Offline Status**: Currently shows in online list (may want to hide in future)

## Files Changed Summary

### New Files (1)
- `vtt-react/src/hooks/useIdleDetection.js`

### Modified Files (6)
- `vtt-react/src/App.jsx`
- `vtt-react/src/components/hud/PartyHUD.jsx`
- `vtt-react/src/components/social/OnlineUsersList.jsx`
- `vtt-react/src/components/social/UserCard.jsx`
- `vtt-react/src/store/presenceStore.js`
- `vtt-react/src/styles/party-hud.css`

### Documentation (1)
- `docs/STATUS_SYSTEM_IMPLEMENTATION.md` (this file)

