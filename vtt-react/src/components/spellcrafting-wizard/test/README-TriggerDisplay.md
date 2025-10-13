# Trigger Display Test

## Overview
This test page demonstrates the trigger compact header, labels, and modes on spell cards. The trigger component has been styled to match the Pathfinder theme and other spell card components.

## Accessing the Test Page

Navigate to: **http://localhost:3000/test/triggers**

## What's Being Tested

### 1. Trigger Compact Header
- **Label**: "TRIGGERS" in uppercase with proper styling
- **Mode Badges**: Shows the trigger role mode (Auto-Cast, Reactive, Trap, etc.)
- **Logic Badges**: Shows "ALL" or "ANY" for compound triggers

### 2. Styling Consistency
The trigger component now matches other spell card components:
- Beige Pathfinder theme background
- Proper border and shadow styling
- Consistent spacing and padding
- Matching font families and sizes

### 3. Component Structure
```jsx
<div className="unified-spell-stat global-triggers-compact">
  <div className="trigger-compact-header">
    <span className="trigger-compact-label">TRIGGERS</span>
    <div className="trigger-compact-modes">
      <span className="trigger-compact-mode">Auto-Cast</span>
      <span className="trigger-compact-logic">ALL</span>
    </div>
  </div>
  <div className="trigger-compact-conditions">
    <span className="trigger-compact-condition">
      When an enemy casts a spell
    </span>
  </div>
</div>
```

## CSS Classes

### Main Container
- `.global-triggers-compact` - Main container with Pathfinder styling

### Header Components
- `.trigger-compact-header` - Header container
- `.trigger-compact-label` - "TRIGGERS" label
- `.trigger-compact-modes` - Container for mode badges

### Badges
- `.trigger-compact-mode` - Mode badge (Auto-Cast, Reactive, etc.) with gold gradient
- `.trigger-compact-logic` - Logic badge (ALL/ANY) with brown gradient

### Conditions
- `.trigger-compact-conditions` - Container for trigger conditions
- `.trigger-compact-condition` - Individual trigger condition text
- `.trigger-logic` - Logic connector text (and/or)

## Trigger Configuration Structure

### Basic Structure
```javascript
triggerConfig: {
  global: {
    logicType: 'AND' | 'OR',
    compoundTriggers: [
      {
        id: 'trigger_id',
        name: 'Trigger Name',
        parameters: { ... }
      }
    ]
  },
  triggerRole: {
    mode: 'AUTO_CAST' | 'REACTIVE' | 'TRAP' | 'CONDITIONAL',
    activationDelay: 0,
    requiresLOS: true
  }
}
```

### Example: Counterspell (REACTION)
```javascript
triggerConfig: {
  global: {
    logicType: 'OR',
    compoundTriggers: [
      {
        id: 'spell_cast',
        name: 'When an enemy casts a spell',
        parameters: {
          spell_type: 'any',
          triggerChance: 100,
          range: 60
        }
      }
    ]
  },
  triggerRole: {
    mode: 'REACTIVE',
    activationDelay: 0,
    requiresLOS: true
  }
}
```

### Example: Explosive Rune (TRAP)
```javascript
triggerConfig: {
  global: {
    logicType: 'OR',
    compoundTriggers: [
      {
        id: 'enemy_enters_area',
        name: 'When an enemy enters the area',
        parameters: {
          radius: 5,
          triggerOnce: false,
          triggerChance: 100
        }
      }
    ]
  },
  triggerRole: {
    mode: 'TRAP',
    activationDelay: 0,
    requiresLOS: false
  }
}
```

## Styling Details

### Colors
- **Label**: `var(--pf-text-secondary)` - Muted brown
- **Mode Badge**: Gold gradient background with dark brown text
- **Logic Badge**: Brown gradient background with primary text
- **Conditions**: `var(--pf-text-primary)` - Dark brown

### Spacing
- Container padding: `var(--pf-space-2) var(--pf-space-3)`
- Header margin-bottom: `var(--pf-space-2)`
- Badge padding: `3px 8px`
- Badge gap: `var(--pf-space-1)`

### Borders & Shadows
- Container border: `1px solid var(--pf-brown-light)`
- Container shadow: Subtle inset and drop shadow
- Badge border: `1px solid var(--pf-brown-medium)` or `var(--pf-gold-dark)`
- Badge shadow: `0 1px 2px rgba(139, 69, 19, 0.15)`

## Integration with Spell Wizard

The trigger component is automatically displayed on spell cards when:
1. The spell has `triggerConfig.global.compoundTriggers` with at least one trigger
2. The spell has `triggerConfig.triggerRole.mode` set
3. The spell type is REACTION, PASSIVE, TRAP, or STATE

The component appears at the top of the spell card stats section, before the description.

## Files Modified

1. **CSS**: `vtt-react/src/components/spellcrafting-wizard/styles/pathfinder/components/cards.css`
   - Enhanced `.global-triggers-compact` styling
   - Added proper Pathfinder theme colors and spacing
   - Improved badge styling with gradients and shadows

2. **Test Page**: `vtt-react/src/components/spellcrafting-wizard/test/TestTriggerDisplay.jsx`
   - New test page showing all triggered spells
   - Displays trigger configuration structure
   - Provides visual examples

3. **Routes**: `vtt-react/src/App.jsx`
   - Added `/test/triggers` route
   - Lazy loads test component

## Next Steps

To add triggers to your spells in the spell wizard:
1. Set the spell type to REACTION, PASSIVE, TRAP, or STATE
2. Configure the trigger role mode
3. Add compound triggers with appropriate parameters
4. The trigger display will automatically appear on the spell card

