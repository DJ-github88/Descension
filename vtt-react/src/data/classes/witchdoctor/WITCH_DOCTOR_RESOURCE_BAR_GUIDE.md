# Witch Doctor Resource Bar - Implementation Guide

## Overview
The Witch Doctor resource bar is a **single, deeply thematic bar** that visualizes **Voodoo Essence** (0-15), the spiritual power gathered through curses, poisons, totems, and rituals, then spent to invoke powerful loa spirits.

## Core Mechanic: Voodoo Essence

### Resource Range
- **Minimum**: 0
- **Maximum**: 15
- **Visual Stages**:
  - **Dim (0-5)**: Bar appears dim and inert, minimal spiritual energy
  - **Glow (6-10)**: Runic glyphs begin to glow faintly, spiritual power building
  - **Flicker (10-15)**: Bar hums and flickers with voodoo energy, ready for major invocations

### Generation
- **+1** per curse applied
- **+1** per totem placed
- **+2** per ritual completed
- **Specialization bonuses** (see below)

### Consumption (Loa Invocations)
- **Baron Samedi**: 10 essence (8 for Shadow Priest)
- **Erzulie**: 6 essence (4 for Spirit Healer)
- **Ogoun**: 9 essence (7 for War Priest)
- **Simbi**: 6 essence (4 for Spirit Healer)
- **Papa Legba**: 7 essence (5 for War Priest)

## Loa Color Signatures

When a loa is invoked, the bar briefly **flashes** with the loa's signature color:

- **Baron Samedi**: Violet-black (#4B0082)
- **Erzulie**: Rose-gold (#DAA520)
- **Ogoun**: Ember red (#DC143C)
- **Simbi**: Turquoise (#40E0D0)
- **Papa Legba**: Amber (#FFB347)

## Specializations

### Shadow Priest (Necromancy & Death Magic)
**Theme**: Baron Samedi focus, curses and death rituals

**Colors**:
- Base: #2D1B4E (deep purple)
- Active: #8B008B (dark magenta)
- Glow: #9370DB (medium purple)

**Shared Passive - Loa's Favor**:
Generate Voodoo Essence through curses, poisons, totems, and rituals. Spend essence to invoke powerful loa spirits.

**Unique Passive - Shadow's Embrace**:
- Baron Samedi invocations cost **2 less essence** (8 instead of 10)
- Curses generate **+1 additional essence**
- Requires only **2 cursed enemies** for Baron Samedi (instead of 3)

**Visual Effect**:
- Bar **flickers between life and death hues** when curses are active
- Bar briefly **darkens** when invoking Baron Samedi

### Spirit Healer (Totems & Protection)
**Theme**: Erzulie and Simbi focus, healing and protection

**Colors**:
- Base: #1A472A (dark green)
- Active: #32CD32 (lime green)
- Glow: #98FB98 (pale green)

**Shared Passive - Loa's Favor**:
Generate Voodoo Essence through curses, poisons, totems, and rituals. Spend essence to invoke powerful loa spirits.

**Unique Passive - Spirit's Blessing**:
- Erzulie and Simbi invocations cost **2 less essence** (4 instead of 6)
- Totems generate **+1 additional essence**
- Healing totems heal for **+50%**

**Visual Effect**:
- Bar **pulses rhythmically** while totems are active
- Slow **golden heartbeat effect** during Erzulie invocation

### War Priest (Aggressive Channeling)
**Theme**: Ogoun and Papa Legba focus, poison and melee combat

**Colors**:
- Base: #4A1C1C (dark red)
- Active: #DC143C (crimson)
- Glow: #FF6347 (tomato red)

**Shared Passive - Loa's Favor**:
Generate Voodoo Essence through curses, poisons, totems, and rituals. Spend essence to invoke powerful loa spirits.

**Unique Passive - Warrior's Spirit**:
- Ogoun and Papa Legba invocations cost **2 less essence**
- Poisons generate **+1 additional essence** and deal **+2d6 damage**

**Visual Effect**:
- Bar gains a **fiery inner core** that brightens with each poison applied or melee hit
- Core **flares brightly** when invoking Ogoun

## Visual Design

### Bar Structure
1. **Voodoo Background**: Subtle radial gradients suggesting spiritual energy
2. **Spiritual Energy Wisps**: Floating particles that rise through the bar
3. **Essence Segments**: 15 individual segments that fill as essence increases
4. **Runic Glyphs**: Ancient symbols (⚝ ☥ ⚶) that appear and glow at higher essence levels
5. **Essence Count**: Centered overlay showing current/max essence
6. **Specialization Effects**: Unique visual overlays based on active spec

### Animations
- **Wisp Float**: Spiritual energy particles float upward continuously
- **Essence Pulse**: Filled segments pulse gently
- **Glyph Glow**: Runic symbols glow and pulse at glow/flicker stages
- **Bar Flicker**: Entire bar flickers with energy at high essence (10-15)
- **Loa Flash**: Border and glow flash with loa color on invocation
- **Shadow Flicker**: Life/death hue rotation for Shadow Priest with curses
- **Spirit Pulse**: Rhythmic pulsing for Spirit Healer with totems
- **Fiery Core**: Radial gradient core for War Priest with poisons

## Tooltip System

### Beige Interface Styling
- **Background**: Pathfinder parchment gradient (#f8f4e6 to #e8dcc6)
- **Border**: 2px solid #8B4513 (saddle brown)
- **Font**: 'Bookman Old Style', 'Garamond', serif
- **Color**: #2c1810 (dark brown text)
- **No icons or flavor text** - purely functional

### Tooltip Sections
1. **Header**: Voodoo Essence count and specialization name
2. **Generation**: How to gain essence (with spec bonuses)
3. **Loa Invocations**: Cost for each loa (with spec discounts)
4. **Shared Passive**: Loa's Favor description
5. **Specialization Passive**: Unique passive for current spec
6. **Active Effects**: Current state (curses, totems, poisons)

### Auto-Positioning
Tooltip automatically adjusts position to stay within viewport boundaries, preventing cutoff.

## Dev Controls

### Essence Control
- **Slider**: Adjust essence from 0-15
- **Buttons**: -1, Clear, Max, +1

### Loa Invocation Tests
- **5 Buttons**: Test each loa flash effect (Samedi, Erzulie, Ogoun, Simbi, Legba)
- Each button styled with the loa's signature color

### Specialization Passive States
- **Shadow Priest**: Toggle "Curses Active" (enables life/death flicker)
- **Spirit Healer**: Toggle "Totems Active" (enables rhythmic pulse)
- **War Priest**: Slider for "Poisons Applied" (0-5, controls core intensity)

### Specialization Selector
- **Cycle Button**: Click to open specialization selector
- **3 Options**: Shadow Priest, Spirit Healer, War Priest
- Visual preview of each spec's colors and theme

## Integration Points

### 1. /account → Characters Tab
- Resource bar displays in character list
- Size: `normal`
- Fully interactive with dev controls

### 2. HUD (In-Game)
- Resource bar displays in player HUD
- Size: `normal` or `small`
- Real-time updates during gameplay

### 3. Rules Section
- Resource bar displays in Witch Doctor class detail page
- Size: `large`
- Default essence: 8/15 (glow stage)
- Demonstrates all visual stages and effects

## File Structure

```
vtt-react/src/data/classes/witchdoctor/
├── components/
│   └── WitchDoctorResourceBar.jsx    # Main component
├── styles/
│   └── WitchDoctorResourceBar.css    # All styling and animations
└── WITCH_DOCTOR_RESOURCE_BAR_GUIDE.md # This file
```

## Key Features

### React Portals
- Tooltips render in `document.body` portal for proper z-index layering
- Dev controls and spec selector use overlay portals

### CSS Custom Properties
- `--spec-base-color`: Specialization base color
- `--spec-active-color`: Specialization active color
- `--spec-glow-color`: Specialization glow color
- `--war-core-intensity`: War Priest fiery core brightness (0-100%)

### Ref-Based Positioning
- `barRef`: Reference to main bar for tooltip positioning
- `tooltipRef`: Reference to tooltip for auto-adjustment calculations

### State Management
- `localEssence`: Current essence (0-15)
- `selectedSpec`: Current specialization
- `cursesActive`: Shadow Priest curse state
- `totemsActive`: Spirit Healer totem state
- `poisonsApplied`: War Priest poison count (0-5)
- `loaFlash`: Active loa flash effect

### Responsive Sizing
- **Small**: 24px height, compact elements
- **Normal**: 36px height, standard display
- **Large**: 36px height, enhanced visibility

## Design Philosophy

The Witch Doctor resource bar embodies **ritualistic spiritual power** - voodoo essence building through dark practices, straining for release through loa invocations. The visual design emphasizes:

1. **Sacred Mystery**: Dim, glowing, flickering stages suggest growing spiritual power
2. **Loa Presence**: Color flashes represent the loa spirits answering the call
3. **Specialization Identity**: Each spec has distinct visual personality
4. **Functional Clarity**: No flavor text, all information is actionable
5. **Thematic Immersion**: Every animation reinforces the voodoo aesthetic

## Usage Example

```jsx
import WitchDoctorResourceBar from '../../data/classes/witchdoctor/components/WitchDoctorResourceBar';

<WitchDoctorResourceBar
  classResource={{
    current: 8,
    max: 15
  }}
  size="normal"
  config={witchDoctorConfig}
/>
```

## Future Enhancements

Potential additions for future iterations:
- Sound effects for loa invocations
- Particle effects for high essence levels
- Ritual completion animations
- Curse/totem/poison visual indicators
- Loa spirit avatars on invocation

