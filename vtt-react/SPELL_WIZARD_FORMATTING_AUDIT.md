# Spell Wizard Formatting & Code Audit

## Overview

This document identifies:
1. **Formatting inconsistencies** between spell wizard, spell library, and rules section
2. **Obsolete code** that can be removed
3. **Duplicate code** that should be consolidated
4. **Unused files and functions**

---

## Part 1: Formatting Issues

### Issue 1: Inconsistent Spell Card Rendering

**Problem:** Spell cards are rendered differently in three contexts:
1. **Spell Wizard Preview** (UnifiedSpellCard.jsx)
2. **Spell Library Display** (SpellLibrary.jsx)
3. **Rules Section** (Rules components)

**Root Cause:**
- `formatSpellEffectsForReview.js` is used by wizard preview
- `formatSpellEffects.js` is used by spell library
- Rules section may use different formatting

**Files Involved:**
- `vtt-react/src/components/spellcrafting-wizard/core/utils/formatSpellEffectsForReview.js`
- `vtt-react/src/components/spellcrafting-wizard/core/utils/formatSpellEffects.js`
- `vtt-react/src/components/spellcrafting-wizard/components/cards/UnifiedSpellCard.jsx`
- `vtt-react/src/components/spellcrafting-wizard/components/library/SpellLibrary.jsx`

**Solution:**
1. **Consolidate formatting functions** - Use ONE formatting utility across all contexts
2. **Create a shared SpellCardRenderer component** that all three contexts use
3. **Ensure CSS styling is consistent** across all contexts

### Issue 2: "General Actions" Spell Formatting

**Problem:** User mentioned "general actions but also other spells" have formatting issues in spell library.

**Likely Issues:**
- General actions may not have proper `effectTypes` array
- May be using legacy spell format
- May not have proper `resolution` field

**Investigation Needed:**
1. Check `SampleSpellsLoader.jsx` for how general actions are loaded
2. Check if general actions use different data structure
3. Verify `formatSpellEffects.js` handles all spell types

**Files to Check:**
- `vtt-react/src/components/spellcrafting-wizard/components/library/SampleSpellsLoader.jsx`
- `vtt-react/src/components/spellcrafting-wizard/data/sampleSpells/` (if exists)

### Issue 3: Formula Formatting Inconsistency

**Problem:** Technical formulas not being converted to plain English consistently.

**Current State:**
- `formatFormulaToPlainEnglish()` exists in `SpellCardUtils.js`
- Used in `formatSpellEffects.js` but may not be used everywhere

**Examples of Inconsistency:**
```javascript
// Should display as:
"2d6 + Intelligence modifier" 
// NOT:
"2d6+INT"

// Should display as:
"8 damage per heads (bonus 15 if all heads)"
// NOT:
"HEADS_COUNT * 8 + (ALL_HEADS ? 15 : 0)"
```

**Solution:**
- Ensure ALL formulas pass through `formatFormulaToPlainEnglish()` before display
- Add missing formula types to the formatter

### Issue 4: Spell Card Effect Borders

**User Preference:** "User wants bordered boxes kept around spell card effect sections (damage, healing, buffs, etc.) to clearly show what belongs to each component"

**Files to Check:**
- CSS files for spell cards
- UnifiedSpellCard.jsx component structure
- Ensure borders are visible in all contexts (wizard, library, rules)

### Issue 5: Spell Library Hover Preview

**User Request:** "User wants spell library abilities to show spell card preview on hover or selection, displayed to the side like in spell wizard."

**Current State:**
- Spell wizard has preview functionality
- Spell library may not have hover preview

**Implementation Needed:**
1. Add hover state to spell library cards
2. Display UnifiedSpellCard preview on hover
3. Position preview to the side (not blocking the list)

---

## Part 2: Obsolete Code Audit

### Potentially Obsolete Files

#### 1. SpellContext.js (271 lines)
**Location:** `vtt-react/src/components/spellcrafting-wizard/contexts/SpellContext.js`

**Analysis:**
- There are THREE context providers:
  - `SpellLibraryContext.js` (522 lines) - Library state
  - `spellWizardContext.js` (1,436 lines) - Wizard state
  - `SpellContext.js` (271 lines) - **LEGACY?**

**Investigation:**
- Search codebase for `SpellContext` imports
- If not used, this is a candidate for removal
- May be from an older version of the system

**Recommendation:** 
```bash
# Search for usage
grep -r "SpellContext" vtt-react/src --exclude-dir=node_modules
# If only found in SpellContext.js itself, it's unused
```

#### 2. SPELL_WIZARD_EFFECTS_GUIDE.md
**Status:** Already deleted in previous conversation

**Reason:** Was a draft/incomplete documentation file

#### 3. Duplicate Formatting Functions

**Files with Similar Functionality:**
- `formatSpellEffects.js` (587 lines)
- `formatSpellEffectsForReview.js` (exists, similar purpose)
- `previewGenerator.js` (2,038 lines) - Has `generateEffectSummary()`

**Analysis:**
These files have overlapping functionality:
- All format spell effects for display
- All convert configurations to readable text
- Should be consolidated into ONE utility

**Recommendation:**
1. Keep `formatSpellEffects.js` as the SINGLE source of truth
2. Migrate any unique functionality from other files
3. Update all imports to use the consolidated file

### Unused Functions

#### In previewGenerator.js

**Potentially Unused:**
- `generateGameText()` - WoW-style color codes (may not be used in React UI)
- `applyWowStyling()` - WoW color formatting (may not be used)
- `formatKeywords()` - Keyword highlighting (may not be used)
- `simulateSpellUse()` - Simulation functions (may be for future feature)
- `calculateAverageDamage()` - May be replaced by balanceCalculator.js
- `calculateHealingEfficiency()` - May be replaced by balanceCalculator.js
- `estimateControlStrength()` - May be replaced by balanceCalculator.js
- `compareWithBaseline()` - May be replaced by balanceCalculator.js

**Investigation Needed:**
```bash
# Search for usage of each function
grep -r "generateGameText" vtt-react/src --exclude-dir=node_modules
grep -r "applyWowStyling" vtt-react/src --exclude-dir=node_modules
grep -r "simulateSpellUse" vtt-react/src --exclude-dir=node_modules
```

**Recommendation:**
- If functions are unused, remove them
- If they're for future features, move to a separate `futureFeatures/` directory
- Document which functions are actively used

#### In spellSerializer.js

**Potentially Unused:**
- `generateGameCode()` - May not be used if game doesn't need code export
- `generateHumanReadable()` - May be duplicate of other formatters
- `createSpellTemplate()` - Template system may not be implemented
- `generateSpellFromTemplate()` - Template system may not be implemented

**Investigation Needed:**
```bash
grep -r "generateGameCode" vtt-react/src --exclude-dir=node_modules
grep -r "createSpellTemplate" vtt-react/src --exclude-dir=node_modules
```

### Duplicate CSS

**User Note:** "The CSS codebase has duplicate code and conflicting class names across multiple files requiring systematic cleanup."

**Files to Audit:**
- All CSS files in `vtt-react/src/components/spellcrafting-wizard/`
- Look for duplicate class definitions
- Look for conflicting styles

**Common Issues:**
1. Same class name defined in multiple files with different styles
2. Duplicate style rules
3. Unused CSS classes
4. Global styles that should be scoped

**Recommendation:**
1. Use CSS Modules or scoped styles
2. Create a shared `spellWizard.css` for common styles
3. Remove duplicate definitions
4. Use CSS variables for consistent theming

---

## Part 3: Code Consolidation Opportunities

### 1. Consolidate Formatting Functions

**Current State:**
- `formatSpellEffects.js` - 587 lines
- `formatSpellEffectsForReview.js` - Similar functionality
- `previewGenerator.js` - Has `generateEffectSummary()`

**Proposed Structure:**
```
core/utils/
  ├── spellFormatting.js (CONSOLIDATED)
  │   ├── formatDamageEffects()
  │   ├── formatHealingEffects()
  │   ├── formatBuffEffects()
  │   ├── formatDebuffEffects()
  │   ├── formatUtilityEffects()
  │   ├── formatAllEffects()
  │   └── formatFormulaToPlainEnglish()
  │
  ├── spellSerialization.js (KEEP)
  │   ├── serializeSpell()
  │   ├── deserializeSpell()
  │   └── extractSpellIcon()
  │
  └── spellCalculations.js (NEW - from previewGenerator.js)
      ├── calculateAverageDamage()
      ├── calculateHealingEfficiency()
      └── estimateControlStrength()
```

### 2. Consolidate Spell Card Components

**Current State:**
- `UnifiedSpellCard.jsx` (8,441 lines) - MASSIVE component
- May have duplicate rendering logic

**Recommendation:**
1. Break down UnifiedSpellCard into smaller components:
   ```
   components/cards/
     ├── SpellCard.jsx (Main container)
     ├── SpellCardHeader.jsx
     ├── SpellCardEffects.jsx
     ├── SpellCardDamage.jsx
     ├── SpellCardHealing.jsx
     ├── SpellCardBuff.jsx
     ├── SpellCardDebuff.jsx
     ├── SpellCardUtility.jsx
     ├── SpellCardFooter.jsx
     └── SpellCardUtils.js
   ```

2. Each sub-component handles one aspect of the spell card
3. Easier to maintain and test
4. Reduces file size

### 3. Consolidate Data Files

**Current State:**
- 17 data configuration files
- Some may have overlapping data

**Check for Duplicates:**
- `buffTypes.js` and `statusEffects.js` may have overlapping buff definitions
- `debuffTypes.js` and `statusEffects.js` may have overlapping debuff definitions

**Recommendation:**
- Ensure each piece of data is defined in ONE place
- Use imports/references for shared data

---

## Part 4: Action Items

### High Priority

1. **Fix Spell Library Formatting**
   - [ ] Consolidate `formatSpellEffects.js` and `formatSpellEffectsForReview.js`
   - [ ] Ensure all spell cards use the same formatting logic
   - [ ] Test "general actions" spells specifically
   - [ ] Verify formula formatting is consistent

2. **Remove Obsolete Code**
   - [ ] Check if `SpellContext.js` is used, remove if not
   - [ ] Search for unused functions in `previewGenerator.js`
   - [ ] Search for unused functions in `spellSerializer.js`
   - [ ] Remove unused functions

3. **Fix CSS Issues**
   - [ ] Ensure spell card effect borders are visible
   - [ ] Consolidate duplicate CSS
   - [ ] Scope CSS to prevent conflicts

### Medium Priority

4. **Add Spell Library Features**
   - [ ] Implement hover preview in spell library
   - [ ] Position preview to the side
   - [ ] Use UnifiedSpellCard for preview

5. **Code Consolidation**
   - [ ] Break down UnifiedSpellCard.jsx into smaller components
   - [ ] Consolidate formatting utilities
   - [ ] Create shared calculation utilities

### Low Priority

6. **Documentation**
   - [ ] Document which functions are actively used
   - [ ] Add JSDoc comments to all public functions
   - [ ] Create component usage examples

---

## Part 5: Search Commands for Investigation

### Find Unused Imports
```bash
# Find all imports of SpellContext
grep -r "import.*SpellContext" vtt-react/src --exclude-dir=node_modules

# Find all imports of formatSpellEffectsForReview
grep -r "import.*formatSpellEffectsForReview" vtt-react/src --exclude-dir=node_modules

# Find all imports of previewGenerator functions
grep -r "import.*generateGameText" vtt-react/src --exclude-dir=node_modules
grep -r "import.*simulateSpellUse" vtt-react/src --exclude-dir=node_modules
```

### Find Duplicate CSS Classes
```bash
# Find all CSS files
find vtt-react/src/components/spellcrafting-wizard -name "*.css"

# Search for specific class names across all CSS files
grep -r "\.spell-card" vtt-react/src/components/spellcrafting-wizard --include="*.css"
grep -r "\.effect-section" vtt-react/src/components/spellcrafting-wizard --include="*.css"
```

### Find Unused Functions
```bash
# Find function definitions in a file
grep -E "^export (function|const)" vtt-react/src/components/spellcrafting-wizard/core/utils/previewGenerator.js

# Then search for each function name in the codebase
# Example:
grep -r "generateGameText" vtt-react/src --exclude-dir=node_modules
```

---

*End of Formatting & Code Audit*

