# Multiplayer Fixes - Testing Checklist

## 🎯 Critical Fixes to Test

### 1. GM Character Data Sync ✅
**What to test:**
- GM creates/updates character with custom image, class, race, stats
- Player joins room and sees GM's character data correctly
- GM's HUD shows correct image, class, race, resource bar
- Player's HUD shows GM's character data (not defaults)

**Console logs to check:**
- `👑 Updated GM character data in room:` - Should show health, mana, actionPoints, tokenSettings, lore
- `👥 Updated player character data in room:` - Should show player stats
- `📦 Loaded character from Firebase with inventory:` - Should show items count and currency

**Expected behavior:**
- Both GM and players see each other's correct stats, images, and character data
- No default values (100 HP, 50 Mana, 3 AP) unless that's actually the character's stats

---

### 2. Whisper Tab Naming ✅
**What to test:**
- Player whispers to GM → GM's tab should show player's name
- GM whispers back to player → Player's tab should show GM's name
- Both parties see correct recipient/sender names in tabs
- Messages appear on recipient's window

**Console logs to check:**
- `whisper_sent` event - Should include correct recipientName
- `whisper_received` event - Should include correct senderName
- No "to unknown" messages

**Expected behavior:**
- Tabs correctly named with character/player names
- Messages appear on both sender and recipient windows
- No "unknown" labels

---

### 3. Token Movement Sync ✅
**What to test:**
- Player tries to move another player's token → Should be blocked
- Player moves their own token → Should work and sync to others
- GM moves any token → Should work and sync to players
- Visual sync: When GM moves player token, player sees their token move (not GM's)

**Console logs to check:**
- `Cannot move character token - not your token` - Should appear when player tries to move wrong token
- `Cannot move creature token - not your token` - Should appear for creature tokens
- Token movement events should include correct playerId and tokenId

**Expected behavior:**
- Players can only move their own tokens
- GM can move any token
- Visual sync matches actual token ownership
- No "ghost" token movements

---

### 4. Terrain Tiles Sync ✅
**What to test:**
- GM draws terrain tiles in editor
- Player sees terrain tiles appear
- Tiles persist when player rejoins

**Console logs to check:**
- `📤 Emitted terrain data update to server` - Should appear when GM draws tiles
- `🚫 Skipped terrain data update (receiving from server)` - Should appear when receiving from server
- `map_updated` event - Should include terrainData

**Expected behavior:**
- Terrain tiles sync in real-time
- No duplicate tiles
- Tiles persist across sessions

---

### 5. Fog of War Sync ✅
**What to test:**
- GM covers entire map in fog → Player sees fog
- GM paints fog → Player sees fog appear
- Player explores area → Fog memory persists
- GM and player see consistent fog appearance (density/opacity)

**Console logs to check:**
- `📤 Emitted fog of war update to server` - Should appear when fog is painted
- `📤 Emitted explored areas update to server` - Should appear when area is explored
- `map_updated` event - Should include fogOfWarPaths and exploredAreas

**Expected behavior:**
- Fog syncs in real-time
- Explored areas persist (memory of seen areas)
- Fog appearance is consistent between GM and players
- No disappearing fog or incorrect opacity

---

### 6. Drawing Paths Sync ✅
**What to test:**
- GM draws on map → Player sees drawing
- Drawing persists when player rejoins

**Console logs to check:**
- `📤 Emitted drawing paths update to server` - Should appear when drawing
- `🚫 Skipped drawing paths update (receiving from server)` - Should prevent echo loops

**Expected behavior:**
- Drawings sync in real-time
- No duplicate lines
- Drawings persist

---

### 7. Starting Equipment (Inventory) ✅
**What to test:**
- Create new character with starting equipment and currency
- Join multiplayer room immediately after creation
- Check inventory tab - should show items and currency

**Console logs to check:**
- `📦 Loaded character from Firebase with inventory:` - Should show items count and currency
- `📦 Using character from store with inventory:` - Fallback if Firebase not available
- `⚠️ Character does not have inventory saved` - Warning if inventory missing

**Expected behavior:**
- Inventory appears when joining room
- Items and currency are correct
- No empty inventory for newly created characters

---

### 8. Escape Key Navigation ✅
**What to test:**
- Press Escape in multiplayer → Should return to landing page
- GM clicks "Leave Game" → Should return to landing page
- Player clicks "Leave Game" → Should return to landing page
- No stuck states or broken navigation

**Console logs to check:**
- `handleLeaveRoom` - Should be called
- Navigation should complete without errors
- Socket should disconnect cleanly

**Expected behavior:**
- Clean exit from multiplayer
- Returns to landing page (`/`)
- No broken states or stuck screens

---

### 9. Room Code URL Routing ✅
**What to test:**
- Create room → URL should update to `/multiplayer/{roomCode}`
- Join room → URL should update to `/multiplayer/{roomCode}`
- Share room URL → Other player can use URL to join
- Leave room → URL should return to `/multiplayer` or `/`

**Console logs to check:**
- `🔗 Room code detected in URL:` - Should appear if room code in URL
- Navigation should update URL correctly

**Expected behavior:**
- Room codes in URLs
- Shareable links work
- URL updates correctly on join/leave

---

### 10. Available Rooms CSS ✅
**What to test:**
- View available rooms list
- Check styling: cards, headers, stats, buttons
- Responsive design on different screen sizes

**Expected behavior:**
- Clean, polished appearance
- Good visual hierarchy
- Readable text and proper spacing
- Hover effects work

---

## 🔍 General Console Monitoring

### Key Console Logs to Watch:

**Character Sync:**
- `👑 Updated GM character data in room:`
- `👥 Updated player character data in room:`
- `📦 Loaded character from Firebase with inventory:`

**Whisper Messages:**
- `whisper_sent` events
- `whisper_received` events
- Check for correct senderName and recipientName

**Map Sync:**
- `📤 Emitted [terrain/fog/drawing] update to server`
- `🚫 Skipped [terrain/fog/drawing] update (receiving from server)`
- `map_updated` events

**Token Movement:**
- `Cannot move character token - not your token`
- `Cannot move creature token - not your token`
- Token movement events with correct playerId

**Navigation:**
- `handleLeaveRoom` calls
- Navigation errors
- Socket disconnect messages

**Firebase:**
- `✅ Character saved:`
- `✅ Spell saved to Firebase:`
- `✅ Room created:`
- Any Firebase errors or warnings

---

## 🐛 Common Issues to Watch For

1. **Echo Loops:** If you see the same update being sent multiple times, check `window._isReceivingMapUpdate` flag
2. **Missing Data:** If character data is missing, check Firebase console logs
3. **Sync Delays:** If updates don't appear immediately, check socket connection status
4. **Permission Errors:** If Firebase operations fail, check authentication status

---

## 📝 Testing Steps

1. **Setup:**
   - Open browser console (F12)
   - Clear console logs
   - Have two browser windows/tabs ready (one for GM, one for player)

2. **Test Each Feature:**
   - Follow the checklist above
   - Monitor console logs for each action
   - Verify expected behavior matches actual behavior

3. **Report Issues:**
   - Note which feature failed
   - Copy relevant console logs
   - Describe expected vs actual behavior
   - Include screenshots if helpful

---

## ✅ Success Criteria

All fixes are working if:
- ✅ GM and players see each other's correct character data
- ✅ Whisper tabs show correct names (no "unknown")
- ✅ Players can only move their own tokens, GM can move any
- ✅ Terrain, fog, and drawings sync in real-time
- ✅ Inventory appears when joining room
- ✅ Escape key returns to landing page
- ✅ Room codes appear in URLs
- ✅ Available rooms look polished
- ✅ No console errors or warnings (except expected ones)

---

## 🚀 Deployment Notes

- Changes committed to GitHub
- Railway will auto-deploy backend
- Netlify will auto-deploy frontend
- Wait for deployment to complete before testing
- Clear browser cache if issues persist

