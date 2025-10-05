# Community Chat Features Implementation Plan

## ✅ Completed Features

### 1. Quick Fixes
- ✅ Fixed mock user data with correct classes, races, and subraces
- ✅ Removed confirmation dialog - Community button opens directly
- ✅ Changed placeholder to "Yad"
- ✅ Fixed context menu positioning (z-index 9,999,999)
- ✅ Fixed mouse move error in split pane

### 2. New Races/Subraces Added
- ✅ **Mountain Dwarf** - Added to Grimheart race
- ✅ **War Orc** - Added to Ashmark race  
- ✅ **Lightfoot Halfling** - Added to Wildkin race

## 🚧 Features To Implement

### 3. Online/Offline Simulation
Mock users should randomly go online and offline to simulate real activity.

**Implementation**:
- Add `simulateOnlineOffline()` method to mockPresenceService
- Random intervals (30-120 seconds) for status changes
- Update user status in presenceStore
- Show system messages when users go online/offline

### 4. Tab System (Global, Whispers, Party)
Replace single chat view with tabbed interface.

**Tabs**:
- **Global**: Public chat for all online users
- **Whispers**: Dynamic tabs created per user when whispering
- **Party**: Group chat for party members

**Implementation**:
- Create `ChatTabs.jsx` component
- Update `GlobalChatWindow.jsx` to use tabs
- Store active tab in presenceStore
- Each tab has its own message history

### 5. Friend List System
Users can add/remove friends and see their status.

**Features**:
- Add friend button in user context menu
- Friend list panel (collapsible)
- Friend status indicators
- Quick whisper/invite from friend list

**Implementation**:
- Add `friendsList` to presenceStore
- Create `FriendsList.jsx` component
- Add friend management methods
- Persist friends in localStorage

### 6. Party System
Create and manage parties for group chat and coordination.

**Features**:
- Create party
- Invite to party from:
  - Community list (right-click)
  - Friend list
  - Whisper conversation
- Party chat tab
- Party member list
- Leave party
- Kick members (party leader only)

**Implementation**:
- Add `currentParty` to presenceStore
- Create `PartyPanel.jsx` component
- Add party invite/accept/decline flow
- Party chat messages separate from global

## Implementation Order

1. **Online/Offline Simulation** (Simple, adds life to the system)
2. **Tab System** (Foundation for other features)
3. **Friend List** (Standalone feature)
4. **Party System** (Most complex, builds on tabs)

## Data Structures

### presenceStore additions:
```javascript
{
  // Existing...
  onlineUsers: Map,
  globalChatMessages: [],
  
  // New additions:
  activeTab: 'global', // 'global', 'whisper_userId', 'party'
  whisperTabs: Map, // userId -> { messages: [], unreadCount: 0 }
  friendsList: Set, // Set of userIds
  currentParty: {
    id: string,
    name: string,
    leaderId: string,
    members: [],
    messages: []
  }
}
```

### Mock User Status Simulation:
```javascript
{
  userId: string,
  status: 'online' | 'away' | 'offline',
  lastStatusChange: timestamp
}
```

## UI Layout

```
┌─────────────────────────────────────────────────────────┐
│ Community                                          [X]  │
├──────────────┬──────────────────────────────────────────┤
│              │ [Global] [Whisper: User1] [Party]       │
│  Online (6)  ├──────────────────────────────────────────┤
│  ▼           │                                          │
│  🟢 User1    │  Chat messages appear here...            │
│  🟢 User2    │                                          │
│  🟡 User3    │                                          │
│              │                                          │
│  Friends (3) │                                          │
│  ▼           │                                          │
│  🟢 Friend1  │                                          │
│  🔴 Friend2  │                                          │
│              │                                          │
│  Party (2)   │                                          │
│  ▼           │                                          │
│  👑 Leader   │                                          │
│  🛡️ Member   │                                          │
│              ├──────────────────────────────────────────┤
│              │ [Yad________________________] [Send]     │
└──────────────┴──────────────────────────────────────────┘
```

## Next Steps

1. Implement online/offline simulation
2. Create tab system
3. Build friend list
4. Implement party system
5. Test all features together
6. Polish UI/UX

