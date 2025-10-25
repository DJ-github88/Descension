# Warden Vengeance Points Resource Bar

## Overview
The Warden resource bar visualizes **Vengeance Points (VP)** - a fury-building system that powers devastating glaive abilities and ultimate transformations. The bar captures the essence of contained vengeance straining for release.

## Core Mechanic: Vengeance Points (0-10 VP)

### VP Generation
- **Successful attack**: +1 VP
- **Attack on marked target**: +2 VP (1 base + 1 mark bonus)
- **Evasion**: +1 VP
- **Critical hit**: +1 VP
- **Shadowblade stealth attack**: +3 VP (1 base + 2 from Shadow Strike passive)
- **Vengeance Seeker Avatar attack on marked**: +3 VP (1 base + 1 Avatar + 1 mark)

### VP Spending
- **1 VP**: Vengeful Strike (+1d6 damage)
- **2 VP**: Whirling Glaive (multi-target attack)
- **3 VP**: Hunter's Resolve (heal 2d8 HP, +2 AC for 2 rounds)
- **5 VP**: Cage of Vengeance (trap target for 3 rounds)
  - **Jailer spec**: Only 3 VP (Master Jailer passive)
- **10 VP**: Avatar of Vengeance (ultimate transformation for 4 rounds)
  - **Vengeance Seeker spec**: Lasts 6 rounds (Endless Vengeance passive)

## Visual Design

### Base Appearance
- **Dark spectral energy** with emerald/purple undertones
- **10 segmented VP indicators** that fill progressively
- **Pulsing energy particles** that float upward through the bar
- **Spectral background pattern** with subtle grid lines
- **VP counter** displayed prominently in the center

### At 10 VP (Max)
- **Flaring animation** on the final segment
- **Intensified glow** around the entire bar
- **Pulsing border** indicating readiness for Avatar transformation

## Specializations

### Shadowblade (Deep Purple #2E0854)
**Theme**: Stealth Assassin - Burst damage from the shadows

**Shared Passive**: Relentless Hunter
- Advantage on Survival/Perception to track
- Move at full speed while tracking

**Unique Passives**:
- **Shadow Strike**: Stealth attacks generate +1 VP (total 3 VP), deal +1d8 damage, can hide as bonus action after attacking
- **Umbral Veil**: After spending 3+ VP, become invisible for 1 round

**Visual Effects**:
- **Stealth mode**: Bar flickers and dims (opacity 0.5-0.7)
- **Shadow veil overlay**: Radial gradient effect when in stealth
- **Assassination flash**: Bright flare when generating bonus VP from stealth

### Jailer (Steel Gray #4A5568)
**Theme**: Cage Master - Battlefield control specialist

**Shared Passive**: Relentless Hunter
- Advantage on Survival/Perception to track
- Move at full speed while tracking

**Unique Passives**:
- **Master Jailer**: Cages cost -2 VP (3 instead of 5), can maintain 2 cages simultaneously
- **Condemned**: Caged enemies take +1d6 damage from all sources (+2d6 if marked)

**Visual Effects**:
- **Spectral chains**: Chain rune symbols (⛓) appear when cages are active
- **Floating animation**: Chains bob up and down
- **Multiple chains**: Shows 1-2 chains based on active cage count

### Vengeance Seeker (Dark Red #8B0000)
**Theme**: Relentless Pursuit - Unstoppable hunter

**Shared Passive**: Relentless Hunter
- Advantage on Survival/Perception to track
- Move at full speed while tracking

**Unique Passives**:
- **Inexorable Pursuit**: Marked targets cannot hide/go invisible, free dash to marked targets
- **Endless Vengeance**: Avatar lasts +2 rounds (6 total), Avatar attacks on marked generate +1 VP (total 3 VP)

**Visual Effects**:
- **Avatar aura**: Glowing border around the bar during Avatar form
- **Intensified glow**: Enhanced box-shadow during Avatar
- **Sustained flare**: Continuous pulsing animation while Avatar is active
- **Mark indicator**: Shows if target is marked in tooltip

## Dev Controls

### VP Adjustment
- **-1 / +1**: Fine-tune VP
- **-5 / +5**: Quick adjustments
- **Clear**: Set to 0 VP
- **Max**: Set to 10 VP
- **Visual preview bar**: Shows current VP percentage

### Specialization-Specific Controls

**Shadowblade**:
- Toggle stealth mode (dims bar, shows shadow veil)
- Info: "Stealth: Bar flickers and dims, attacks generate +3 VP"

**Jailer**:
- Adjust active cages (0-2)
- Shows spectral chains when cages > 0
- Info: "Cages: Spectral chains appear, cost 3 VP instead of 5"

**Vengeance Seeker**:
- Toggle Avatar form (shows aura, intensified glow)
- Toggle target marked (affects VP generation)
- Info: "Avatar: Lasts 6 rounds, aura visible, attacks on marked generate +3 VP"

### Quick Actions
- **Attack (+1 VP)**: Simulate basic attack
- **Attack Marked (+2 VP)**: Simulate attack on marked target
- **Cage (-5 VP)**: Simulate cage ability
- **Avatar (-10 VP)**: Activate Avatar form, set VP to 0

## Tooltip Information

### Always Shown
- Current VP / Max VP
- Selected specialization name
- VP generation methods
- VP spending costs (adjusted for Jailer spec)
- Shared passive description
- Unique passive description

### Specialization-Specific
- **Shadowblade**: Stealth status (Active/Inactive)
- **Jailer**: Active cages count (0-2)
- **Vengeance Seeker**: Avatar form status, target marked status

### Auto-Adjustment
- Tooltip automatically repositions to stay within viewport
- Flips to bottom if insufficient space above
- Adjusts horizontally to prevent clipping

## Integration Points

### /account → Characters Tab
- Full-size resource bar with all controls
- Specialization selector button
- Interactive dev controls for testing

### HUD (In-Game)
- Compact resource bar
- Smaller specialization button
- Tooltip on hover
- Click to open controls

### Rules Section
- Large display in class header
- Shows example VP value (7/10)
- Demonstrates visual effects
- Full tooltip information

## Technical Implementation

### Component Structure
```
/warden/
  ├── components/
  │   └── WardenResourceBar.jsx
  └── styles/
      └── WardenResourceBar.css
```

### Key Features
- **React portals** for tooltips and modals
- **CSS custom properties** for spec colors
- **Ref-based positioning** for tooltip auto-adjustment
- **State management** for all interactive elements
- **Responsive sizing** (small, normal, large)

### Color Scheme
- **Shadowblade**: Deep purple (#2E0854, #7B2CBF)
- **Jailer**: Steel gray (#4A5568, #94A3B8)
- **Vengeance Seeker**: Dark red (#8B0000, #DC2626)

## Design Philosophy

The Warden resource bar embodies **contained fury** - vengeance building with each strike, evasion, and critical hit, straining for release through devastating abilities. The visual design emphasizes:

1. **Sharp, fluid energy**: Flowing glaive energy and pulsing vengeance marks
2. **Violent undertones**: Dark spectral colors with emerald/purple hints
3. **Maiev-inspired aesthetic**: Anti-magic armor vibe from Warcraft III
4. **Specialization identity**: Each spec has distinct visual feedback
5. **Functional clarity**: No flavor text, concrete mechanics only

The bar should feel like a **weapon being charged** - each VP segment lighting up as power accumulates, ready to be unleashed in a single devastating strike or sustained through Avatar form.

