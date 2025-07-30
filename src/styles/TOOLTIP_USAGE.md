# Pathfinder Tooltip System Usage Guide

## Overview
This unified tooltip system provides beautiful, medieval fantasy-styled tooltips with parchment backgrounds and Pathfinder theming for the entire application.

## Quick Start

### 1. Import the CSS
```jsx
import '../../../styles/pathfinder-tooltips.css';
```

### 2. Basic Tooltip Structure
```jsx
<div className="tooltip-wrapper">
  <div className="tooltip-content">
    <div className="tooltip-title">Immune to Fire</div>
    <div className="tooltip-description">
      This creature takes no damage from fire attacks. The damage is completely negated.
    </div>
  </div>
</div>
```

## Available Classes

### Container Classes
- `.tooltip-content` - Main tooltip container with Pathfinder styling
- `.tooltip-wrapper` - Positioning wrapper (use for fixed positioning)

### Typography Classes
- `.tooltip-title` - Main heading (uppercase, rustic red, large)
- `.tooltip-description` - Body text (readable dark brown)
- `.tooltip-header` - Secondary heading (smaller than title)
- `.tooltip-value` - Stat displays (brown accent color)
- `.tooltip-label` - Field labels (small caps, uppercase)
- `.tooltip-effects` - Positive effects (dark green)
- `.tooltip-effect` - Individual effect line
- `.tooltip-quote` - Flavor text (italic, centered, bordered)

### Variants
- `.tooltip-content.compact` - Smaller tooltip for tight spaces
- `.tooltip-content.large` - Larger tooltip for detailed information

## Examples

### Basic Damage Resistance Tooltip
```jsx
<div className="tooltip-content">
  <div className="tooltip-title">Resistant to Cold</div>
  <div className="tooltip-description">
    This creature takes half damage from cold attacks. Damage is reduced by 50%.
  </div>
</div>
```

### Item Tooltip with Stats
```jsx
<div className="tooltip-content">
  <div className="tooltip-title">Flaming Sword +2</div>
  <div className="tooltip-label">Weapon (Longsword)</div>
  <div className="tooltip-value">+2 Attack, +2 Damage</div>
  <div className="tooltip-effects">+1d6 Fire Damage</div>
  <div className="tooltip-description">
    A masterwork longsword wreathed in magical flames.
  </div>
  <div className="tooltip-quote">
    "The blade burns with eternal fire."
  </div>
</div>
```

### Spell Tooltip
```jsx
<div className="tooltip-content large">
  <div className="tooltip-title">Fireball</div>
  <div className="tooltip-header">3rd Level Evocation</div>
  <div className="tooltip-label">Casting Time</div>
  <div className="tooltip-value">1 Action</div>
  <div className="tooltip-label">Range</div>
  <div className="tooltip-value">150 feet</div>
  <div className="tooltip-description">
    A bright streak flashes from your pointing finger to a point you choose 
    within range and then blossoms with a low roar into an explosion of flame.
  </div>
  <div className="tooltip-effects">8d6 Fire Damage</div>
</div>
```

### Compact Tooltip
```jsx
<div className="tooltip-content compact">
  <div className="tooltip-title">Quick Info</div>
  <div className="tooltip-description">
    Brief description for smaller spaces.
  </div>
</div>
```

## Positioning

For fixed positioning tooltips (like hover tooltips), use the wrapper:

```jsx
<div 
  className="tooltip-wrapper"
  style={{
    left: tooltipPosition.x,
    top: tooltipPosition.y,
    transform: 'translateX(-50%) translateY(-100%)'
  }}
>
  <div className="tooltip-content">
    {/* tooltip content */}
  </div>
</div>
```

## Features

- **Beautiful Pathfinder Styling** - Parchment backgrounds with medieval borders
- **Responsive Design** - Adapts to different screen sizes
- **Smooth Animations** - Fade-in effects with scaling
- **Rich Typography** - Multiple text styles for different content types
- **Flexible Sizing** - Compact and large variants available
- **Consistent Theming** - Matches your application's medieval fantasy aesthetic

## Migration from Old Tooltips

Replace old tooltip classes:
- `.tooltip-content` → Use new `.tooltip-content` (same class name, new styling)
- `.tooltip-title` → Use new `.tooltip-title` (same class name, new styling)
- `.tooltip-description` → Use new `.tooltip-description` (same class name, new styling)

The class names are the same, so existing HTML structure should work with just the CSS import!
