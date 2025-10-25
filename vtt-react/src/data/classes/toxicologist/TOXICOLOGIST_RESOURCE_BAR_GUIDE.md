# Toxicologist Resource Bar Implementation Guide

## Overview
The Toxicologist resource bar is a **dual-resource system** that displays **Toxin Vials** (for crafting poisons and concoctions) and **Contraption Parts** (for deploying mechanical devices). This implementation follows the established pattern of dedicated class resource bars.

## File Structure

### Component Files
- **Component**: `vtt-react/src/data/classes/toxicologist/components/ToxicologistResourceBar.jsx`
- **Styles**: `vtt-react/src/data/classes/toxicologist/styles/ToxicologistResourceBar.css`

### Integration Points
1. **ClassResourceBar.jsx**: Added import and case for 'alchemical-arsenal' type (lines 10, 422-423)
2. **classResources.js**: Updated visual type to 'alchemical-arsenal' (line 1677)
3. **toxicologistData.js**: Already contains complete class data with specializations
4. **RulesPage.jsx**: Toxicologist already in CLASS_DATA_MAP (line 65)

## Resource System: Alchemical Arsenal

### Dual Resource Display

#### Toxin Vials (Top Section)
- **Maximum**: INT modifier + 3 (minimum 4)
- **Gadgeteer Spec**: Uses 8 vials instead of 10
- **Display**: 5x2 grid of vials with liquid fill effect
- **Generation**: 
  - +1d4 per short rest
  - All vials per long rest
- **Usage**:
  - 1-2 vials for poisons
  - 2-3 vials for concoctions
  - 3 vials for explosives
- **Visual**: Green liquid fill with pulsing effect when poisons are active

#### Contraption Parts (Bottom Section)
- **Maximum**: 5 parts (6 for Gadgeteer spec)
- **Display**: Horizontal row of gear icons
- **Generation**:
  - +1 per short rest
  - All parts per long rest
- **Usage**:
  - 1-2 parts per contraption
  - Traps, devices, mechanisms
- **Visual**: Mechanical gears with glowing effect when devices deployed

## Specialization Visual Effects

### Venomancer (Poison Master)
- **Color Scheme**: Green (#2D5016 → #4CAF50 → #76FF03)
- **Visual Effect**: Toxin vials pulse with greenish glow when poisons are active
- **Passive**: Potent Toxins
  - All poison damage +1d6
  - Poison effects last 2 additional rounds
  - Enemies have disadvantage on saves against poisons
- **Trigger**: `activePoisonsCount > 0` causes vials to pulse

### Gadgeteer (Contraption Specialist)
- **Color Scheme**: Gray/Gold (#4A4A4A → #9E9E9E → #FFD700)
- **Visual Effect**: Contraption parts glow and rotate when devices are deployed
- **Passive**: Mechanical Mastery
  - Deploy contraptions as bonus action
  - +1 contraption part max (total 6)
  - Contraptions harder to detect (DC +3)
- **Trigger**: `deployedContraptionsCount > 0` causes gears to glow and rotate

### Saboteur (Battlefield Disruptor)
- **Color Scheme**: Purple (#1A237E → #5C6BC0 → #7C4DFF)
- **Visual Effect**: Cross-linked purple glow between toxin and contraption sections
- **Passive**: Debilitating Expertise
  - All debuffs last 2 additional rounds
  - Debuffs require coin flip (heads) to dispel
  - Enemies affected by poisons/contraptions have -2 to all saves
- **Trigger**: `comboActive === true` shows linking effect between bars

## Shared Passive
**Alchemical Expertise** (All Toxicologists):
- Craft poisons/concoctions as bonus action
- Deploy contraptions as action
- Immune to own poisons
- Resistance to all poison damage

## Dev Controls

### Main Control Panel
Accessible via flask icon button in top-right corner of resource bar.

#### Toxin Vials Controls
- **+1 Vial**: Add single vial
- **-1 Craft Poison**: Spend 1 vial
- **-2 Craft Concoction**: Spend 2 vials
- **-3 Craft Explosive**: Spend 3 vials
- **Reset to Max**: Restore all vials

#### Contraption Parts Controls
- **+1 Part**: Add single part
- **-1 Deploy Contraption**: Spend 1 part
- **-2 Deploy Complex Device**: Spend 2 parts
- **Reset to Max**: Restore all parts

#### Specialization Selector
- **Venomancer**: Activate poison-focused spec
- **Gadgeteer**: Activate contraption-focused spec
- **Saboteur**: Activate debuff-focused spec

#### Specialization Effects Testing
- **Venomancer**: Slider for active poisons count (0-5)
- **Gadgeteer**: Slider for deployed contraptions count (0-5)
- **Saboteur**: Checkbox for poison-contraption combo active state

#### Quick Actions
- **Full Resources**: Set both to maximum
- **Empty Resources**: Set both to 0
- **Half Resources**: Set both to 50%

### Inline Adjustment Menus
Click on either section to open contextual adjustment menu:
- **Toxin Menu**: Shows generation info (+1d4 per short rest) and crafting costs
- **Contraption Menu**: Shows generation info (+1 per short rest) and deployment costs

## Tooltip System

### Auto-Adjusting Tooltips
Tooltips automatically reposition to stay within viewport boundaries:
- Check top/bottom boundaries
- Check left/right boundaries
- Add padding to prevent edge clipping
- Switch to below-bar placement if needed

### Tooltip Content

#### Toxin Vials Tooltip
- **Resource Count**: Current/Max vials
- **Generation**: How vials are gained
- **Usage**: Vial costs for different recipes
- **Shared Passive**: Alchemical Expertise description
- **Spec Passive**: Current specialization passive ability

#### Contraption Parts Tooltip
- **Resource Count**: Current/Max parts
- **Generation**: How parts are gained
- **Usage**: Part costs for different devices
- **Shared Passive**: Alchemical Expertise description
- **Spec Passive**: Current specialization passive ability

## Usage Locations

### 1. Rules Section
- **Location**: `/rules → Classes → Toxicologist`
- **Display**: Resource bar in class header
- **Purpose**: Demonstrate class mechanics with full dev controls
- **Size**: Normal

### 2. HUD (In-Game)
- **Location**: Player HUD during gameplay
- **Display**: Compact resource bar
- **Purpose**: Real-time resource tracking during combat
- **Size**: Normal or Small

### 3. Account Page
- **Location**: `/account → Characters → View Character`
- **Display**: Full-page character sheet resource bar
- **Purpose**: Character management and resource visualization
- **Size**: Normal or Large

## Technical Implementation

### Component Props
```javascript
{
  classResource: {}, // Resource data (not used in local dev mode)
  size: 'normal',    // 'small' | 'normal' | 'large'
  config: {}         // Resource configuration (not used in local dev mode)
}
```

### Local State Management
- `localToxinVials`: Current toxin vial count (default: 6)
- `localContraptionParts`: Current contraption part count (default: 3)
- `selectedSpec`: Current specialization (default: 'venomancer')
- `activePoisonsCount`: Number of active poisons (Venomancer effect)
- `deployedContraptionsCount`: Number of deployed contraptions (Gadgeteer effect)
- `comboActive`: Poison-contraption combo state (Saboteur effect)

### CSS Architecture
- **Scoped Styles**: All styles prefixed with `toxicologist-`
- **Pathfinder Theme**: Beige/brown color scheme matching game aesthetic
- **Responsive Design**: Adapts to small/normal/large sizes
- **Animation Effects**: Pulsing, glowing, and linking animations for spec effects

## Key Features

### 1. Dual Resource Management
- Independent tracking of toxin vials and contraption parts
- Visual separation with distinct sections
- Contextual tooltips for each resource type

### 2. Specialization-Specific Visuals
- Dynamic color schemes based on selected spec
- Animated effects that reflect active abilities
- Visual feedback for resource usage patterns

### 3. Interactive Dev Controls
- Comprehensive testing interface
- Live specialization switching
- Effect state manipulation
- Quick resource adjustment

### 4. Tooltip Auto-Adjustment
- Viewport-aware positioning
- Never clips off screen
- Smooth transitions
- Contextual information display

### 5. Clean Scientific Aesthetic
- Measured, precise design
- Chemical/mechanical theme
- Liquid fill effects for toxins
- Gear mechanics for contraptions

## Testing Checklist

- [ ] Resource bar displays in Rules section (Toxicologist class page)
- [ ] Toxin vials render correctly (grid layout, liquid fill)
- [ ] Contraption parts render correctly (horizontal gears)
- [ ] Tooltips appear on hover and auto-adjust position
- [ ] Dev controls open/close properly
- [ ] Specialization switching updates visuals
- [ ] Venomancer: Vials pulse when active poisons > 0
- [ ] Gadgeteer: Gears glow when deployed contraptions > 0
- [ ] Saboteur: Link effect appears when combo active
- [ ] Inline menus show correct generation/usage info
- [ ] Quick actions work (Full/Empty/Half resources)
- [ ] Size variations work (small/normal/large)
- [ ] No console errors or warnings

## Future Enhancements

### Potential Additions
1. **Poison Type Tracking**: Show which specific poisons are active
2. **Contraption Map**: Visual representation of deployed device locations
3. **Crafting Queue**: Show queued recipes and their vial costs
4. **Synergy Indicators**: Highlight poison-contraption combinations
5. **Resource History**: Track vial/part usage over time
6. **Specialization Recommendations**: Suggest optimal spec based on playstyle

### Integration Opportunities
1. **Spell Library**: Link to toxin/contraption recipes
2. **Character Sheet**: Full resource management interface
3. **Combat Log**: Track poison applications and contraption triggers
4. **Inventory System**: Manage crafted items and components

## Notes

- The resource bar is fully self-contained with local state for testing
- Production implementation would connect to character resource state
- All animations are CSS-based for performance
- Tooltip positioning uses viewport detection for reliability
- Specialization effects are purely visual in this implementation
- Dev controls are always visible for testing purposes

