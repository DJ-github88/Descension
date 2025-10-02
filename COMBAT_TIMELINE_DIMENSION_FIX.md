# Combat Timeline Dimension Fix

## Problem
The combat timeline was appearing too wide and too short:
- Width was calculating to fit all tokens in one row (up to 1200px)
- Height was only 120px, not enough for token portraits + initiative + AP + timer
- Tokens couldn't wrap to multiple rows

## Root Causes Found

### 1. **combatStore.js** - Hardcoded Initial Values (Line 18)
```javascript
timelineSize: { width: 800, height: 120 }
```
This value is **persisted in localStorage**, so even changing component defaults wouldn't help existing users.

### 2. **CombatTimeline.jsx** - Aggressive Width Calculation (Lines 34-64)
```javascript
const calculatedWidth = Math.max(
    400,
    Math.min(
        1200, // Too wide!
        (turnOrder.length * (tokenWidth + tokenGap)) + padding + controlsWidth
    )
);
```
This tried to fit ALL tokens in one row, making the timeline extremely wide.

### 3. **CombatTimeline.jsx** - Default Height Too Small (Line 199)
```javascript
const effectiveHeight = timelineSize.height || 120; // Not enough!
```

### 4. **CombatTimeline.jsx** - Resize Constraints Too Permissive (Line 224)
```javascript
minConstraints={[300, 100]}
maxConstraints={[1200, 200]}
```
Allowed timeline to be too wide and too short.

### 5. **combat-system.css** - No Wrapping Allowed (Line 708)
```css
.timeline-combatants {
    flex-wrap: nowrap; /* Prevented wrapping! */
    min-height: 60px; /* Too short! */
}
```

## Solutions Implemented

### 1. **combatStore.js** - Updated Initial Values
```javascript
// Line 18
timelineSize: { width: 700, height: 180 }
```

### 2. **combatStore.js** - Added Migration for Existing Users
```javascript
// Lines 845-848 in initializeStore()
// Migrate old timeline size to new dimensions
if (state.timelineSize && state.timelineSize.height === 120) {
    updates.timelineSize = { width: 700, height: 180 };
}
```
This automatically updates existing users' stored timeline size.

### 3. **CombatTimeline.jsx** - Smarter Width Calculation
```javascript
// Lines 34-65
const maxVisibleTokens = 6; // Show 6 tokens before scrolling
const calculatedWidth = Math.max(
    500, // Minimum width
    Math.min(
        800, // Maximum width - more reasonable
        (Math.min(turnOrder.length, maxVisibleTokens) * (tokenWidth + tokenGap)) + padding
    )
);

updateTimelineSize({
    width: calculatedWidth,
    height: timelineSize.height || 180 // Taller default
});
```

### 4. **CombatTimeline.jsx** - Better Default Height
```javascript
// Line 200
const effectiveHeight = timelineSize.height || 180;
```

### 5. **CombatTimeline.jsx** - Improved Resize Constraints
```javascript
// Lines 224-225
minConstraints={[400, 150]}  // Taller minimum
maxConstraints={[1000, 300]} // Narrower max, taller max height
```

### 6. **combat-system.css** - Enable Wrapping & Increase Height
```css
/* Lines 702-723 */
.timeline-combatants {
    display: flex;
    align-items: flex-start; /* Changed from center */
    gap: 10px;
    padding: 12px 16px;
    overflow-x: auto;
    overflow-y: auto; /* Added vertical scrolling */
    flex-wrap: wrap; /* Allow wrapping to multiple rows */
    min-height: 120px; /* Taller to accommodate token content */
    /* ... rest of styles ... */
}
```

## Results

### Before:
- Width: Up to 1200px (stretched across screen)
- Height: 120px (tokens cut off)
- Tokens: Single row only, horizontal scrolling required

### After:
- Width: 500-800px (reasonable, based on ~6 tokens)
- Height: 180px (fits all token content comfortably)
- Tokens: Can wrap to multiple rows
- Resizable: 400x150 minimum, 1000x300 maximum

## Token Content Breakdown
Each token needs vertical space for:
1. Portrait: 44px (40px + 4px border)
2. Initiative badge: ~18px
3. AP badge: ~18px
4. Timer: ~18px
5. Padding/gaps: ~16px
**Total: ~114px minimum**

With 12px top/bottom padding in `.timeline-combatants`, we need at least 138px.
The new 180px default provides comfortable spacing.

## Testing Checklist
- [ ] Start new combat with 3 tokens - should be ~700px wide, 180px tall
- [ ] Start combat with 8+ tokens - should wrap to multiple rows
- [ ] Resize timeline - should respect new min/max constraints
- [ ] Existing users - timeline should auto-migrate to new size on next load
- [ ] All token content visible (portrait, init, AP, timer)

