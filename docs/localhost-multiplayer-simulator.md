# Localhost Multiplayer Simulator

## Overview

The Localhost Multiplayer Simulator is a development tool that allows you to test multiplayer functionality without needing real players to join your room. It simulates multiple players with realistic character data, chat messages, and dynamic resource changes.

## Features

### 🤖 **Simulated Players**
- **5 Pre-defined Characters**: Thorin Ironbeard (Fighter), Elara Moonwhisper (Wizard), Gareth the Bold (Paladin), Shadowstep (Rogue), and Bramblewood (Druid)
- **Realistic Stats**: Each character has appropriate health, mana, action points, levels, and classes
- **Visual Indicators**: Each player has a unique color and displays their current resources

### 💬 **Auto Chat System**
- **20+ Chat Messages**: Realistic D&D-style messages like "Rolling for initiative!", "Watch out for traps!", etc.
- **Random Timing**: Messages appear every 3-10 seconds with natural variation
- **Character Context**: Messages appear to come from the simulated characters

### ⚡ **Dynamic Activity Simulation**
- **Resource Changes**: Health and mana fluctuate randomly to simulate combat/spellcasting
- **Real-time Updates**: Changes are reflected in the party HUD immediately
- **Realistic Patterns**: Resources decrease and increase naturally

## How to Use

### 1. **Access the Simulator**
- Only available in **development mode** on **localhost**
- Appears automatically when you join a multiplayer room
- Located in the top-right corner of the screen

### 2. **Basic Controls**
```
┌─────────────────────────────────────┐
│ 🤖 Localhost Multiplayer Simulator │
│ Room: Test Room | Players: 0       │
├─────────────────────────────────────┤
│ [Add Player (0/5)] [Add All]       │
│ ☐ Auto Chat    ☐ Simulate Activity │
└─────────────────────────────────────┘
```

### 3. **Adding Players**
- **Add Player**: Adds one random character from the available pool
- **Add All**: Adds all 5 characters with a 500ms delay between each
- **Maximum**: 5 simulated players total

### 4. **Simulation Options**
- **Auto Chat**: Enable automatic chat messages from simulated players
- **Simulate Activity**: Enable random health/mana changes to simulate gameplay

### 5. **Managing Players**
- **Remove Players**: Click the ✕ button next to any player
- **View Resources**: See real-time health/mana for each player
- **Party Integration**: All players appear in the main party HUD

## Testing Scenarios

### **Scenario 1: Basic Multiplayer Testing**
1. Create a room and join as GM
2. Click "Add All" to add all 5 players
3. Enable "Auto Chat" to see chat activity
4. Check that all players appear in the party HUD with crown for GM

### **Scenario 2: Dynamic Resource Testing**
1. Add 2-3 players
2. Enable "Simulate Activity"
3. Watch health/mana change in real-time
4. Verify changes sync to party HUD

### **Scenario 3: Player Join/Leave Testing**
1. Add players one by one
2. Remove players individually
3. Check chat notifications for joins/leaves
4. Verify party count updates correctly

### **Scenario 4: Chat System Testing**
1. Add several players
2. Enable "Auto Chat"
3. Open the social/chat window
4. Verify messages appear from different characters

## Technical Details

### **Character Data Structure**
```javascript
{
  name: "Thorin Ironbeard",
  class: "Fighter",
  race: "Dwarf", 
  level: 5,
  health: { current: 85, max: 120 },
  mana: { current: 20, max: 30 },
  actionPoints: { current: 3, max: 4 },
  color: "#8B4513"
}
```

### **Integration Points**
- **Party Store**: Adds/removes party members
- **Chat Store**: Sends notifications and messages
- **Real-time Updates**: Uses the same update mechanisms as real multiplayer

### **Performance**
- **Lightweight**: Minimal performance impact
- **Isolated**: Only affects localhost development
- **Clean Removal**: All simulated players removed when leaving room

## Troubleshooting

### **Simulator Not Visible**
- Ensure you're running on `localhost` (not 127.0.0.1)
- Verify `NODE_ENV=development`
- Check that you're in a multiplayer room (not lobby)

### **Players Not Appearing in Party HUD**
- Check browser console for errors
- Verify party store is working correctly
- Try refreshing the page and re-adding players

### **Chat Messages Not Working**
- Ensure "Auto Chat" is enabled
- Check that chat store is initialized
- Verify social window is open to see messages

## Development Notes

### **File Locations**
- **Component**: `vtt-react/src/components/multiplayer/LocalhostMultiplayerSimulator.jsx`
- **Styles**: `vtt-react/src/components/multiplayer/LocalhostMultiplayerSimulator.css`
- **Integration**: Added to `MultiplayerApp.jsx`

### **Future Enhancements**
- Add dice rolling simulation
- Implement token movement simulation
- Add combat turn simulation
- Create custom character templates
- Add save/load simulation states

## Security

The simulator is **automatically disabled** in production builds and only works on localhost in development mode. This ensures it never appears for real users.

## Example Usage

```bash
# 1. Start development servers
cd server && npm start
cd vtt-react && npm start

# 2. Open browser to localhost:3000
# 3. Create a room and join
# 4. Use simulator in top-right corner
# 5. Test multiplayer features with simulated players
```

This tool eliminates the need for multiple browser windows or real players when testing multiplayer functionality, making development much more efficient!
