# Arcanoneer Specialization System

## Overview
The Arcanoneer class now features a fully interactive specialization system that allows players to test different playstyles based on the three specializations from the class data.

## Specializations

### 1. Prism Mage (Elemental Purity)
**Passive Ability**: "You can reroll up to 2 spheres per turn (costs 1 mana per reroll). Pure element combinations (same element twice) deal 50% bonus damage."

**Implementation**:
- **Reroll Button**: Blue button with sync icon (🔄)
- **Mechanic**: Click to reroll a random sphere from your current pool
- **Limit**: 2 rerolls per turn (counter resets when you roll new spheres)
- **Visual Feedback**: Button shows "Reroll (X/2 used)" in tooltip
- **Disabled State**: Grays out when 2 rerolls used or no spheres available

### 2. Entropy Weaver (Chaos Mastery)
**Passive Ability**: "Roll 5d8 for sphere generation (instead of 4d8). All Chaos element combinations deal double damage."

**Implementation**:
- **Enhanced Rolling**: Automatically rolls 5d8 instead of 4d8
- **Visual Feedback**: Roll button shows "Roll 5d8" instead of "Roll 4d8"
- **Mechanic**: No additional buttons needed - the core rolling mechanic is enhanced
- **Chaos Synergy**: More chances to get Chaos spheres for double damage combos

### 3. Sphere Architect (Runic Precision)
**Passive Ability**: "Once per turn, you can swap any 2 spheres for different element types (costs 3 mana total)."

**Implementation**:
- **Swap Button**: Purple button with exchange icon (⇄)
- **Mechanic**: 
  1. Click the swap button to enter swap mode (button glows gold)
  2. Click first sphere to select it (sphere gets gold border and pulses)
  3. Click second sphere to complete the swap
  4. Spheres exchange positions
- **Visual Feedback**: 
  - Active swap mode: Button pulses with gold glow
  - Selected sphere: Gold border with pulse animation
- **Disabled State**: Grays out when fewer than 2 spheres available

## UI Components

### Specialization Selector (Large Size Only)
- **Location**: Above the sphere count header
- **Style**: Pathfinder-themed dropdown with purple gradient
- **Options**:
  - "Prism Mage (Reroll 2)"
  - "Entropy Weaver (5d8)"
  - "Sphere Architect (Swap 2)"
- **Behavior**: Changing specialization resets reroll counter and clears swap selections

### Control Buttons
All buttons use the existing icon-only style for large displays:
- **Roll Button**: Always present, text changes based on spec (4d8 or 5d8)
- **Clear Button**: Always present, clears all spheres
- **Reroll Button**: Only visible for Prism Mage (blue)
- **Swap Button**: Only visible for Sphere Architect (purple, glows gold when active)

## Visual Styling

### Colors
- **Prism Mage (Reroll)**: Blue gradient (#4169E1 → #1E90FF)
- **Sphere Architect (Swap)**: Purple gradient (#9370DB → #BA55D3)
- **Swap Active State**: Gold gradient (#FFD700 → #FFA500)

### Animations
- **Swap Pulse**: Gold glow that pulses when swap mode is active
- **Selected Sphere**: Gold border with pulse animation
- **Button Hover**: Slight color shift and elevation

### Responsive Design
- **Large Size**: Full specialization selector + all buttons
- **Normal/Small Size**: Specialization persists but selector hidden (would need to be added to settings)

## Technical Implementation

### State Management
```javascript
const [activeSpecialization, setActiveSpecialization] = useState('prism-mage');
const [rerollsUsed, setRerollsUsed] = useState(0);
const [swapMode, setSwapMode] = useState(false);
const [selectedForSwap, setSelectedForSwap] = useState([]);
```

### Key Functions
- `rollSpheres()`: Checks specialization and rolls 4d8 or 5d8
- `rerollSphere(index)`: Rerolls a specific sphere (Prism Mage)
- `handleSphereSwap(elementId)`: Manages two-step swap selection (Sphere Architect)

### CSS Classes
- `.specialization-selector`: Container for dropdown
- `.spec-dropdown`: Styled select element
- `.sphere-icon-btn.reroll-btn`: Blue reroll button
- `.sphere-icon-btn.swap-btn`: Purple swap button
- `.sphere-icon-btn.swap-btn.active`: Gold glowing active state
- `.sphere-slot.selected-for-swap`: Gold border for selected spheres

## Testing the System

1. **Open Rules Page** → Classes → Arcanoneer → Resource System tab
2. **Select Specialization** from dropdown
3. **Test Each Spec**:
   - **Prism Mage**: Roll spheres, then click reroll button (max 2 times)
   - **Entropy Weaver**: Roll and observe 5 spheres generated instead of 4
   - **Sphere Architect**: Click swap button, select 2 spheres to exchange them

## Future Enhancements

### Potential Additions
- **Mana Cost Display**: Show mana costs for rerolls (1 each) and swaps (3 total)
- **Sphere Locking**: Implement Sphere Architect's "lock 1 sphere" mechanic
- **Sphere Limit**: Implement Sphere Architect's 12-sphere storage limit
- **Mana Cost Reduction**: Implement Sphere Architect's 3-sphere spell discount (10→7 mana)
- **Chaos Damage Bonus**: Visual indicator for Entropy Weaver's double Chaos damage
- **Pure Element Bonus**: Visual indicator for Prism Mage's 50% pure element damage bonus
- **Wild Magic Integration**: Entropy Weaver's Wild Magic Surge table trigger

### Integration Points
- **Character Sheet**: Persist specialization selection
- **Combat System**: Apply damage bonuses and mana costs
- **Spell Casting**: Validate sphere combinations and apply spec bonuses
- **Mana System**: Deduct costs for rerolls and swaps

