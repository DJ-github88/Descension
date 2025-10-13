# Spell Card CSS Architecture

## 🎯 Overview

This document explains the CSS architecture for spell cards and effect boxes to prevent future conflicts and ensure consistent rendering across all contexts (spellbook, library, rules section, character creation).

---

## 📁 File Responsibilities

### `spell-card-enhancements.css` - SINGLE SOURCE OF TRUTH
**Location:** `src/components/spellcrafting-wizard/styles/pathfinder/components/spell-card-enhancements.css`

**Purpose:** Controls ALL spell card effect box styling across ALL contexts

**Responsible for:**
- `.damage-effects`, `.healing-effects`, `.buff-effects`, `.debuff-effects`, etc. (main effect boxes)
- `.damage-effect-item`, `.healing-effect-item` (individual effect items within boxes)
- `.damage-effect-name`, `.damage-effect-description`, `.damage-effect-mechanics` (effect item content)
- `.damage-formula-line`, `.healing-formula-line` (formula display lines)
- All border, background, padding, margin, and sizing for spell card effects

**Key Features:**
- Uses `!important` flags to ensure precedence
- Applies globally to all spell cards (rules, library, spellbook, character creation)
- Imported via `main.css` → loaded early in cascade

**DO NOT:**
- Duplicate these styles in other files
- Override these styles without `!important`
- Create context-specific variations (they should look identical everywhere)

---

### `unified-effects.css` - CONFIGURATION UI ONLY
**Location:** `src/components/spellcrafting-wizard/styles/effects/unified-effects.css`

**Purpose:** Controls effect CONFIGURATION UI styling (wizard popups, effect selection panels)

**Responsible for:**
- `.healing-effects-container`, `.buff-effects-container`, etc. (configuration panel containers)
- `.buff-effects-section`, `.debuff-effects-section` (configuration section layouts)
- `.buff-header`, `.debuff-header` (configuration section headers)
- `.buff-separator`, `.debuff-separator` (visual separators in config UI)
- Configuration-specific formula lines (`.buff-formula-line`, `.debuff-formula-line`)

**Key Features:**
- Only affects wizard/configuration UI, NOT spell cards
- Imported directly by effect components (HealingEffects.jsx, BuffEffects.jsx, etc.)
- Loads AFTER `spell-card-enhancements.css` but doesn't conflict (different selectors)

**DO NOT:**
- Add spell card effect box styling here (`.damage-effects`, `.healing-effects`, etc.)
- Add spell card item styling here (`.damage-effect-item`, `.healing-effect-item`, etc.)
- Add formula line styling for spell cards (`.damage-formula-line`, `.healing-formula-line`)

---

## 🔧 What Was Fixed

### Problem
Multiple CSS files were defining conflicting styles for spell card effect boxes:
1. `spell-card-enhancements.css` - Bordered boxes with backgrounds (correct)
2. `unified-effects.css` - Transparent backgrounds, no borders (incorrect for spell cards)
3. `ChanceOnHitConfig.css` - Unscoped `.damage-formula-line` rules (conflicting with spell cards)

This caused spell cards to render differently in the spellbook vs. rules section, with boxes being too tall, too small, or not flexing properly.

### Solution
1. **Removed from `unified-effects.css`:**
   - `.damage-effects`, `.healing-effects`, `.buff-effects`, etc. border/background/padding rules
   - `.damage-effect-item`, `.healing-effect-item` styling
   - `.damage-effect-name`, `.damage-effect-description`, `.damage-effect-mechanics` styling
   - `.damage-formula-line`, `.healing-formula-line` for spell cards

2. **Scoped in `ChanceOnHitConfig.css`:**
   - Changed `.damage-formula-line` → `.proc-effect-config-popup .damage-formula-line`
   - Changed `.healing-formula-line` → `.proc-effect-config-popup .healing-formula-line`
   - Added `.chance-on-hit-config` scope as well
   - Prevents these config UI styles from affecting spell cards

3. **Kept in `unified-effects.css`:**
   - Configuration UI container styles
   - Configuration UI section layouts
   - Configuration-specific formula lines (`.buff-formula-line`, `.debuff-formula-line`)

4. **Documented:**
   - Added comments explaining file responsibilities
   - Marked `spell-card-enhancements.css` as single source of truth
   - Added warnings not to duplicate styles
   - Added scoping comments to ChanceOnHitConfig.css

---

## ✅ Spell Card Effect Box Styling Rules

### Main Effect Boxes
```css
/* ONLY in spell-card-enhancements.css */
.damage-effects,
.healing-effects,
.buff-effects,
.debuff-effects,
.utility-effects,
.control-effects,
.summoning-effects,
.transformation-effects,
.purification-effects,
.restoration-effects {
    background: linear-gradient(...) !important;
    border: 2px solid var(--pf-brown-medium) !important;
    border-radius: var(--pf-border-radius) !important;
    padding: 8px !important;
    margin-bottom: 12px !important;
    /* ... */
}
```

### Individual Effect Items
```css
/* ONLY in spell-card-enhancements.css */
.damage-effect-item,
.healing-effect-item {
    background: rgba(255, 255, 255, 0.4) !important;
    border: 1px solid rgba(139, 115, 85, 0.3) !important;
    padding: 6px !important;
    /* ... */
}
```

### Formula Lines
```css
/* ONLY in spell-card-enhancements.css */
.damage-formula-line,
.healing-formula-line {
    background: transparent !important;
    border: none !important;
    padding: 0 !important;
    min-height: auto !important;
    height: auto !important;
}
```

---

## 🚫 Common Mistakes to Avoid

### ❌ DON'T: Add spell card styles to unified-effects.css
```css
/* WRONG - Don't do this in unified-effects.css */
.damage-effects {
  background: transparent;
  border: none;
}
```

### ❌ DON'T: Create unscoped formula line styles
```css
/* WRONG - Affects spell cards globally */
.damage-formula-line {
  display: flex;
  align-items: center;
}
```

### ❌ DON'T: Create context-specific overrides
```css
/* WRONG - Spell cards should look identical everywhere */
.spellbook-layout .damage-effects {
  padding: 10px;
}

.rules-page .damage-effects {
  padding: 8px;
}
```

### ❌ DON'T: Override without !important
```css
/* WRONG - Will be overridden by spell-card-enhancements.css */
.damage-effects {
  padding: 12px; /* No !important */
}
```

### ✅ DO: Use spell-card-enhancements.css for all spell card styling
```css
/* CORRECT - Single source of truth */
/* In spell-card-enhancements.css */
.damage-effects {
  padding: 8px !important;
}
```

### ✅ DO: Scope configuration UI styles properly
```css
/* CORRECT - Scoped to config popup only */
.proc-effect-config-popup .damage-formula-line,
.chance-on-hit-config .damage-formula-line {
  display: flex;
  align-items: center;
}
```

---

## 📊 CSS Load Order

1. **`main.css`** (imported early)
   - Imports `spell-card-enhancements.css`
   - Applies globally to all spell cards

2. **Component imports** (loaded when components mount)
   - `unified-effects.css` (configuration UI only)
   - Individual effect CSS files (damage-effects.css, healing-effects.css, etc.)

3. **Result:**
   - `spell-card-enhancements.css` loads first
   - Uses `!important` to ensure precedence
   - Later imports don't conflict (different selectors)

---

## 🔍 How to Verify Consistency

### Check Spell Cards in All Contexts
1. **Spellbook Window** - Open spellbook from navigation
2. **Spell Library Tab** - Switch to library tab
3. **Rules Section** - Navigate to rules → paths → view spell cards
4. **Character Creation** - Create character → select path → view abilities

### All Should Have:
- ✅ Bordered effect boxes with beige gradient background
- ✅ Consistent padding (8px)
- ✅ Consistent margins (12px bottom, 0 top)
- ✅ Box shadows and visual effects
- ✅ Proper height/min-height handling
- ✅ No overflow or clipping issues

---

## 📝 Future Maintenance

### When Adding New Effect Types
1. Add main effect box styling to `spell-card-enhancements.css`
2. Add configuration UI styling to `unified-effects.css`
3. Document the separation clearly
4. Test in all contexts (spellbook, library, rules, character creation)

### When Modifying Existing Styles
1. Check if it's for spell cards or configuration UI
2. Edit the appropriate file only
3. Use `!important` for spell card styles
4. Test in all contexts to ensure consistency

---

## 🎯 Summary

- **`spell-card-enhancements.css`** = Spell cards (everywhere)
- **`unified-effects.css`** = Configuration UI (wizard only)
- **Never duplicate** spell card styles between files
- **Always test** in all contexts after CSS changes
- **Use `!important`** for spell card effect box styles

This architecture ensures spell cards look identical whether viewed in the spellbook, library, rules section, or character creation!

