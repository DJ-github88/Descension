# Character View Page - Synchronized Full-Page Character Sheet

## Overview

The Character View Page provides a full-page, synchronized view of any character that reuses all existing character sheet components. Changes made in this view automatically sync with the in-game character sheet and persist to Firebase.

## Features

### ✅ Full Character View
- **Character Info**: Equipment, resources, character details
- **Stats**: All ability scores, derived stats, resistances
- **Skills**: Skill progression, rollable tables, quests
- **Inventory**: Full inventory grid with drag-and-drop
- **Lore**: Character background and story

### ✅ Real-Time Synchronization
- **Same Tab Sync**: Changes instantly reflect in both view page and in-game windows (same Zustand store instance)
- **Firebase Persistence**: All changes auto-save to Firebase via characterSyncService
- **Cross-Session Sync**: Changes persist across browser sessions

### ✅ Code Reuse
- Reuses existing components:
  - `CharacterPanel` (Equipment.jsx)
  - `CharacterStats`
  - `Skills`
  - `Lore`
  - `InventoryWindow`
- Uses existing CSS: `character-sheet.css`
- Minimal new code: Only page layout and navigation

## How to Use

### Accessing the View Page

1. Navigate to `/account` page
2. Go to the "Characters" tab
3. Click the **View** button on any character card
4. You'll be taken to `/account/characters/view/{characterId}`

### Making Changes

All changes work exactly like the in-game character sheet:

- **Equip/Unequip Items**: Drag items to/from equipment slots
- **Edit Character Info**: Update name, alignment, etc.
- **Manage Inventory**: Organize items, use containers
- **View Stats**: See all calculated stats and bonuses

### Synchronization Behavior

#### Within Same Browser Tab
```
View Page ←→ Character Store ←→ In-Game Windows
     ↓              ↓                  ↓
         All use same Zustand instance
         Changes are INSTANT
```

#### Across Browser Sessions
```
View Page → Character Store → characterSyncService → Firebase
                                                         ↓
Next Session: Firebase → loadCharacter() → Character Store → View Page
```

#### Cross-Tab Sync (Limitation)
⚠️ **Note**: Changes do NOT automatically sync across different browser tabs in real-time.

**Why?** Each browser tab has its own Zustand store instance. There's no Firebase real-time listener for character data (unlike global chat which uses `onSnapshot`).

**Workaround**: Refresh the page to load latest data from Firebase.

**Future Enhancement**: Add Firebase real-time listeners for cross-tab sync (similar to `globalChatService.subscribeToMessages`).

## Technical Implementation

### Component Structure

```jsx
CharacterViewPage
├── Header (character name, level, resources)
├── Tab Navigation (character, stats, skills, inventory, lore)
├── Content Area
│   └── Renders active tab component
└── Sync Indicator (shows auto-save status)
```

### Data Flow

1. **Load Character**
   ```javascript
   useEffect(() => {
     loadCharacters();  // Ensure characters list is loaded
     loadCharacter(characterId);  // Load specific character into store
   }, [characterId]);
   ```

2. **Display Data**
   - Components read from `useCharacterStore()`
   - Same store used by in-game windows
   - Changes automatically trigger re-renders

3. **Save Changes**
   - Components call store actions (e.g., `unequipItem`, `updateStat`)
   - Store updates state
   - characterSyncService auto-saves to Firebase
   - Changes persist across sessions

### Key Files

- **Component**: `vtt-react/src/components/account/CharacterViewPage.jsx`
- **Styles**: `vtt-react/src/styles/character-view-page.css`
- **Route**: `vtt-react/src/App.jsx` (line ~752)
- **Store**: `vtt-react/src/store/characterStore.js`
- **Sync Service**: `vtt-react/src/services/firebase/characterSyncService.js`

## Styling

The view page uses:
- **Pathfinder beige theme**: Consistent with the rest of the app
- **Responsive design**: Works on desktop, tablet, and mobile
- **Full-page layout**: No window chrome, maximizes content area
- **Existing component styles**: Reuses `character-sheet.css`

### Color Scheme
- Background: Dark brown gradient (`#2c1810` to `#1a0f0a`)
- Primary text: Beige (`#d5cbb0`)
- Accents: Brown (`#7a3b2e`)
- Highlights: Gold (`#f4e4c1`)

## Future Enhancements

### Cross-Tab Real-Time Sync
Add Firebase real-time listeners to sync changes across tabs:

```javascript
// In characterStore.js
subscribeToCharacter: (characterId) => {
  const characterRef = doc(db, 'characters', characterId);
  return onSnapshot(characterRef, (doc) => {
    if (doc.exists()) {
      const character = doc.data();
      // Update store with latest data
      set({ ...character });
    }
  });
}
```

### Multiplayer Sync
For multiplayer sessions, character updates could broadcast via Socket.io:

```javascript
// Already exists in server.js (line 1077)
socket.on('character_updated', async (data) => {
  // Broadcast to all players in room
  io.to(player.roomId).emit('character_sync', data);
});
```

### Offline Support
The characterSyncService already has offline queue support:
- Changes queue when offline
- Auto-sync when connection restored
- Conflict resolution for concurrent edits

## Testing

### Test Scenarios

1. **Basic View**
   - Navigate to view page
   - Verify all tabs load correctly
   - Check character data displays

2. **Equipment Changes**
   - Unequip an item
   - Verify it moves to inventory
   - Check it persists after page refresh

3. **Stat Changes** (GM mode)
   - Modify a stat
   - Verify derived stats recalculate
   - Check persistence

4. **Same-Tab Sync**
   - Open view page
   - Open in-game character sheet (press C)
   - Make change in one
   - Verify it appears in the other

5. **Cross-Session Persistence**
   - Make changes in view page
   - Close browser
   - Reopen and navigate to view page
   - Verify changes persisted

## Troubleshooting

### Character Not Loading
- Check browser console for errors
- Verify character exists in `/account` characters list
- Ensure Firebase is configured correctly

### Changes Not Saving
- Check network tab for Firebase requests
- Verify user is authenticated
- Check characterSyncService logs in console

### Sync Not Working
- Ensure both view page and in-game window are in same browser tab
- Different tabs won't sync in real-time (by design)
- Refresh page to load latest from Firebase

## Related Documentation

- [Character Persistence Service](../vtt-react/src/services/firebase/characterPersistenceService.js)
- [Character Sync Service](../vtt-react/src/services/firebase/characterSyncService.js)
- [Character Store](../vtt-react/src/store/characterStore.js)
- [Account Dashboard](../vtt-react/src/components/account/AccountDashboard.jsx)

