# Talent Tree System Guide

## Overview

The talent tree system is a WoW-inspired character progression system with a Pathfinder beige aesthetic. Each class has 3 specialization trees with unique talents that can be learned by spending talent points.

## Features

### Visual Design
- **WoW-Inspired Layout**: Flexible positioning system with absolute coordinates
- **Pathfinder Beige Theme**: Warm parchment colors with brown/gold accents
- **Dynamic Arrows**: Visual connections between talents showing prerequisites
- **Class-Specific Backdrops**: Each specialization can have a unique background image
- **Animated Effects**: Glowing borders, pulsing animations for available talents

### Talent System
- **Flexible Positioning**: Talents use x/y coordinates (not rigid grid)
- **Multiple Prerequisites**: Talents can require one or more previous talents
- **AND/OR Logic**: Prerequisites can use AND (all required) or OR (any required) logic
- **Point Requirements**: Talents unlock at specific point investment thresholds
- **Multi-Rank Talents**: Some talents can be learned multiple times

## Data Structure

### Talent Object
```javascript
{
  id: string,              // Unique identifier (e.g., 'fire_t1_ignite')
  name: string,            // Display name
  description: string,     // Tooltip description
  icon: string,            // WoW icon name (from wow.zamimg.com)
  maxRanks: number,        // How many points can be invested (1-5)
  position: {              // Grid position
    x: number,             // Column (0-3, can use decimals for centering)
    y: number              // Row (0-6)
  },
  requires: string | string[] | null,  // Prerequisite talent ID(s)
  requiresAll: boolean,    // If true, ALL prerequisites must be met (AND logic)
  requiresPoints: number   // Minimum points in tree to unlock
}
```

### Example Talent
```javascript
{
  id: 'fire_t5_combustion_mastery',
  name: 'Combustion Mastery',
  description: 'Unlocks Combustion - consumes DoTs for massive instant damage.',
  icon: 'spell_fire_soulburn',
  maxRanks: 1,
  position: { x: 1, y: 4 },
  requires: ['fire_t4_hot_streak', 'fire_t4_living_bomb'],
  requiresAll: true,  // Both prerequisites required
  requiresPoints: 20
}
```

## Adding New Talent Trees

### Step 1: Define Talents
Create a new array in `talentTreeData.js`:

```javascript
export const WARRIOR_ARMS = [
  // Tier 1 - Foundation
  {
    id: 'arms_t1_strength',
    name: 'Improved Strength',
    description: 'Increases strength by 2% per rank.',
    icon: 'ability_warrior_savageblow',
    maxRanks: 5,
    position: { x: 1, y: 0 },
    requires: null,
    requiresPoints: 0
  },
  // ... more talents
];
```

### Step 2: Add to TALENT_TREES Object
```javascript
export const TALENT_TREES = {
  'Warrior': {
    'arms': WARRIOR_ARMS,
    'fury': WARRIOR_FURY,
    'protection': WARRIOR_PROTECTION
  },
  // ... other classes
};
```

### Step 3: Add Backdrop (Optional)
In `getTreeBackdrop()` function:

```javascript
const backdropMap = {
  'Warrior': {
    'arms': 'url(/assets/backdrops/warrior-arms.jpg)',
    'fury': 'url(/assets/backdrops/warrior-fury.jpg)',
    'protection': 'url(/assets/backdrops/warrior-protection.jpg)'
  },
  // ... other classes
};
```

## Talent Positioning Guide

### Grid Layout
- **Columns**: 0-3 (4 columns total)
- **Rows**: 0-6 (7 tiers total)
- **Cell Size**: 120x120 pixels

### Positioning Tips
1. **Standard Talents**: Use integer positions (0, 1, 2, 3)
2. **Centered Talents**: Use decimals (e.g., 1.5 for center between columns 1 and 2)
3. **Capstone Talents**: Often placed at x: 1.5, y: 6 (bottom center)

### Example Layout
```
Tier 1:  [0,0]  [1,0]  [2,0]  [3,0]
Tier 2:  [0,1]  [1,1]         [3,1]
Tier 3:         [1,2]  [2,2]
Tier 4:  [0,3]  [1,3]  [2,3]  [3,3]
Tier 5:         [1,4]         [3,4]
Tier 6:         [1,5]  [2,5]
Tier 7:        [1.5,6]  (capstone)
```

## Arrow System

### Automatic Arrow Rendering
Arrows are automatically drawn between talents and their prerequisites.

### Arrow Types
1. **Vertical**: Straight down (same column)
2. **Diagonal**: L-shaped path (different columns)
3. **Multiple**: When talent has multiple prerequisites

### Arrow States
- **Inactive**: Gray, semi-transparent (prerequisite not learned)
- **Active**: Gold, glowing (prerequisite learned)

## Talent States

### Visual States
1. **Locked**: Grayscale, dark (requirements not met)
2. **Learnable**: Gold border, glowing (can be learned)
3. **Learned**: Green border, full color (already learned)
4. **Maxed**: Green border, full ranks (cannot learn more)

### Interaction
- **Left Click**: Learn talent (add 1 rank)
- **Right Click**: Unlearn talent (remove 1 rank)
- **Hover**: Show detailed tooltip

## Tooltip Information

Tooltips display:
- Talent name
- Current ranks / max ranks
- Description
- Point requirements
- Prerequisite requirements
- Interaction hints

## Best Practices

### Talent Design
1. **Foundation Talents**: Tier 1 should have no prerequisites
2. **Progressive Unlocking**: Each tier requires more points
3. **Meaningful Choices**: Not all talents should be mandatory
4. **Capstone Talents**: Powerful abilities at the end of trees

### Prerequisite Logic
- Use **AND logic** (`requiresAll: true`) for powerful talents
- Use **OR logic** (`requiresAll: false`) for flexible choices
- Avoid circular dependencies

### Balancing
- **Tier 1**: 0 points required
- **Tier 2**: 5 points required
- **Tier 3**: 10 points required
- **Tier 4**: 15 points required
- **Tier 5**: 20 points required
- **Tier 6**: 25 points required
- **Tier 7**: 30 points required

## Customization

### Colors
Edit CSS variables in `TalentTreeWindow.css`:
- `--pf-gold`: Learnable talent border
- `--pf-brown-medium`: Default borders
- Green (#4CAF50): Learned talents

### Sizing
Adjust constants in `TalentTreeWindow.jsx`:
```javascript
const CELL_WIDTH = 120;
const CELL_HEIGHT = 120;
const GRID_COLUMNS = 4;
const GRID_ROWS = 7;
```

### Icons
Icons are loaded from WoW's icon database:
```
https://wow.zamimg.com/images/wow/icons/large/{icon_name}.jpg
```

Browse icons at: https://www.wowhead.com/icons

## Troubleshooting

### Arrows Not Showing
- Check that `requires` field matches prerequisite talent ID exactly
- Verify prerequisite talent exists in the same tree

### Talent Not Unlocking
- Check `requiresPoints` value
- Verify all prerequisites are learned (if `requiresAll: true`)
- Ensure at least one prerequisite is learned (if `requiresAll: false`)

### Positioning Issues
- Ensure x is between 0-3
- Ensure y is between 0-6
- Use decimals for precise positioning

## Future Enhancements

Potential improvements:
- Talent point respec cost
- Talent loadout saving/loading
- Talent calculator/planner
- Import/export talent builds
- Talent tree comparison
- Animated talent learning effects

