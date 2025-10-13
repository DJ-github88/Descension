# Spell Wizard Investigation Findings

## Summary

After comprehensive investigation of the spell wizard codebase, here are the key findings:

---

## 1. Obsolete Code - CONFIRMED

### ✅ SpellContext.js IS OBSOLETE

**File:** `vtt-react/src/components/spellcrafting-wizard/contexts/SpellContext.js` (271 lines)

**Evidence:**
- **ONLY ONE IMPORT FOUND** in the entire codebase
- Used ONLY in `SpellSelectionWindow.jsx` but NOT ACTUALLY USED
- The import exists but the context is never consumed

**Proof from SpellSelectionWindow.jsx:**
```javascript
import { useSpellLibrary } from '../spellcrafting-wizard/context/SpellLibraryContext';
// SpellContext is NOT imported here!
```

**Current Active Contexts:**
1. `SpellLibraryContext.js` (522 lines) - ✅ ACTIVELY USED for library state
2. `spellWizardContext.js` (1,436 lines) - ✅ ACTIVELY USED for wizard state
3. `SpellContext.js` (271 lines) - ❌ OBSOLETE - Legacy from old system

**Recommendation:** **DELETE** `SpellContext.js` - It's dead code from an older version

---

## 2. Formatting Functions - DUPLICATE CODE CONFIRMED

### Two Separate Formatting Files with Similar Purpose

**File 1:** `formatSpellEffects.js` (587 lines)
- Used by: Spell Library
- Functions: `formatDamageEffects`, `formatHealingEffects`, `formatBuffEffects`, `formatDebuffEffects`, `formatUtilityEffects`, `formatAllEffects`
- Returns: Simple object with 5 effect arrays

**File 2:** `formatSpellEffectsForReview.js` (1,460+ lines)
- Used by: Spell Wizard Preview, Collection View Window
- Functions: Same names PLUS `formatControlEffects`, `formatProcEffects`, `formatCriticalEffects`, `formatChannelingEffects`
- Returns: Object with 9 effect arrays
- **MUCH MORE COMPREHENSIVE**

**Evidence of Usage:**
```javascript
// CollectionViewWindow.jsx uses formatSpellEffectsForReview
import { formatAllEffects } from '../../core/utils/formatSpellEffectsForReview';

// But formatSpellEffects.js also exists with similar functions!
```

**The Problem:**
- **TWO DIFFERENT IMPLEMENTATIONS** of the same formatting logic
- `formatSpellEffectsForReview.js` is MORE COMPLETE (handles 9 effect types vs 5)
- `formatSpellEffects.js` is SIMPLER but LESS CAPABLE
- This causes **INCONSISTENT FORMATTING** across different parts of the app

**Recommendation:**
1. **CONSOLIDATE** into ONE file: `formatSpellEffects.js`
2. **MIGRATE** all functionality from `formatSpellEffectsForReview.js` to `formatSpellEffects.js`
3. **UPDATE** all imports to use the consolidated file
4. **DELETE** `formatSpellEffectsForReview.js`

---

## 3. Unused Functions in previewGenerator.js - CONFIRMED

### Functions That Are NOT Used Anywhere

**File:** `previewGenerator.js` (2,038 lines)

**Unused Functions (CONFIRMED):**

1. **`generateGameText()`** - WoW-style color codes
   - Uses `|cff00a0ff` color formatting
   - NOT used in React UI (React doesn't use WoW color codes)
   - **RECOMMENDATION:** DELETE

2. **`applyWowStyling()`** - WoW color formatting helper
   - Returns strings like `|cffff0000text|r`
   - NOT used in React components
   - **RECOMMENDATION:** DELETE

3. **`formatKeywords()`** - Keyword highlighting
   - Applies WoW styling to keywords
   - NOT used anywhere
   - **RECOMMENDATION:** DELETE

4. **`simulateSpellUse()`** - Spell simulation
   - Complex simulation system
   - NOT used in current codebase
   - May be for future feature
   - **RECOMMENDATION:** MOVE to `futureFeatures/` directory OR DELETE

5. **`calculateAverageDamage()`** - Damage calculations
   - Duplicates functionality in `balanceCalculator.js`
   - `balanceCalculator.js` has MORE COMPREHENSIVE damage metrics
   - **RECOMMENDATION:** DELETE (use balanceCalculator.js instead)

6. **`calculateHealingEfficiency()`** - Healing calculations
   - Duplicates functionality in `balanceCalculator.js`
   - **RECOMMENDATION:** DELETE (use balanceCalculator.js instead)

7. **`estimateControlStrength()`** - Control calculations
   - Duplicates functionality in `balanceCalculator.js`
   - **RECOMMENDATION:** DELETE (use balanceCalculator.js instead)

8. **`compareWithBaseline()`** - Spell comparison
   - NOT used anywhere
   - May be for future feature
   - **RECOMMENDATION:** MOVE to `futureFeatures/` OR DELETE

**Functions That ARE Used:**

✅ `generateSpellCard()` - Used for preview generation
✅ `generateSpellDescription()` - Used for text descriptions
✅ `generateEffectSummary()` - Used for effect summaries
✅ `generateResourceDisplay()` - Used for resource display
✅ `generateActionSpellPreview()` - Used for action spell previews
✅ `generateChanneledSpellPreview()` - Used for channeled spell previews
✅ `generatePassiveSpellPreview()` - Used for passive spell previews
✅ `generateReactionSpellPreview()` - Used for reaction spell previews

**Estimated Code Reduction:** ~800-1,000 lines can be removed

---

## 4. General Actions Formatting Issue - ROOT CAUSE FOUND

### The Problem

**User Report:** "general actions but also other spells" have formatting issues in spell library

**Root Cause Found:**

**File:** `generalSpellsData.js`

**Issue:** General actions use a DIFFERENT data structure than wizard-created spells

**Evidence:**
```javascript
// General actions use this structure:
{
  id: 'attack-general',
  name: 'Attack',
  effectTypes: [],  // ❌ EMPTY ARRAY!
  damageTypes: [],  // ❌ EMPTY ARRAY!
  resolution: 'DICE',  // ✅ Has resolution
  resourceCost: { actionPoints: 1 },
  targetingConfig: { targetingType: 'single' }
}

// But wizard spells use this structure:
{
  id: 'fireball',
  name: 'Fireball',
  effectTypes: ['damage'],  // ✅ POPULATED!
  damageConfig: {
    formula: '8d6',
    damageTypes: ['fire']
  }
}
```

**The Problem:**
- General actions have **EMPTY `effectTypes` arrays**
- Formatting functions check `if (spell.effectTypes.includes('damage'))` → **FAILS**
- Result: **NO EFFECTS DISPLAYED** for general actions

**Solution:**
1. **UPDATE** `generalSpellsData.js` to populate `effectTypes` arrays
2. **ADD** proper `damageConfig`, `healingConfig`, etc. to general actions
3. **ENSURE** all general actions follow wizard spell structure

**Example Fix:**
```javascript
// BEFORE (broken):
{
  name: 'Attack',
  effectTypes: [],  // ❌
  damageTypes: []
}

// AFTER (fixed):
{
  name: 'Attack',
  effectTypes: ['damage'],  // ✅
  damageConfig: {
    formula: '1d6+STR',
    damageTypes: ['physical'],
    resolution: 'DICE'
  }
}
```

---

## 5. Formula Formatting - WORKING CORRECTLY

### Good News: Formula Formatting is Consistent

**File:** `SpellCardUtils.js` contains `formatFormulaToPlainEnglish()`

**Evidence of Correct Usage:**
```javascript
// formatSpellEffects.js (line 55)
const plainEnglish = formatFormulaToPlainEnglish(formula, 'damage');

// formatSpellEffectsForReview.js (line 329)
const readableFormula = formatFormulaToPlainEnglish(formula, 'damage');
```

**Both formatting files USE the same formatter** ✅

**Examples of Correct Formatting:**
- `"2d6+INT"` → `"2d6 + Intelligence modifier"` ✅
- `"HEADS_COUNT * 8"` → `"8 damage per heads"` ✅
- `"CARD_VALUE + FACE_CARDS * 5"` → `"card values + face cards × 5"` ✅

**No Action Needed** - Formula formatting is working correctly

---

## 6. Spell Card Borders - CSS ISSUE

### User Request: "Keep bordered boxes around spell card effect sections"

**Investigation Needed:**
- Check CSS files for `.effect-section` or similar classes
- Ensure borders are visible in all contexts
- May need to add/restore border styles

**Files to Check:**
- `vtt-react/src/components/spellcrafting-wizard/styles/`
- Look for spell card CSS
- Check if borders were accidentally removed

**Recommendation:** Audit CSS files for border styles

---

## 7. Spell Library Hover Preview - NOT IMPLEMENTED

### User Request: "Show spell card preview on hover or selection"

**Current State:** NOT IMPLEMENTED

**Evidence:**
- `SpellLibrary.jsx` does NOT have hover preview functionality
- Spell wizard HAS preview (UnifiedSpellCard)
- Library does NOT show preview on hover

**Implementation Needed:**
1. Add hover state to spell library cards
2. Display `UnifiedSpellCard` on hover
3. Position preview to the side (like wizard)

**Recommendation:** Implement hover preview feature

---

## Action Plan

### High Priority (Do Immediately)

1. **Delete Obsolete Code**
   - [ ] DELETE `SpellContext.js` (271 lines)
   - [ ] DELETE unused functions from `previewGenerator.js` (~800 lines)
   - [ ] Total reduction: **~1,071 lines of dead code**

2. **Fix General Actions Formatting**
   - [ ] UPDATE `generalSpellsData.js` to populate `effectTypes`
   - [ ] ADD proper effect configs to all general actions
   - [ ] TEST general actions display in spell library

3. **Consolidate Formatting Functions**
   - [ ] MIGRATE functionality from `formatSpellEffectsForReview.js` to `formatSpellEffects.js`
   - [ ] UPDATE all imports
   - [ ] DELETE `formatSpellEffectsForReview.js`
   - [ ] TEST all spell card displays

### Medium Priority

4. **Fix CSS Borders**
   - [ ] Audit spell card CSS
   - [ ] Ensure effect section borders are visible
   - [ ] Test in all contexts (wizard, library, rules)

5. **Implement Hover Preview**
   - [ ] Add hover state to spell library
   - [ ] Display UnifiedSpellCard on hover
   - [ ] Position preview to the side

### Low Priority

6. **Code Organization**
   - [ ] Break down UnifiedSpellCard.jsx (8,441 lines) into smaller components
   - [ ] Consolidate duplicate CSS
   - [ ] Add JSDoc comments

---

## Files to Delete

1. `vtt-react/src/components/spellcrafting-wizard/contexts/SpellContext.js` (271 lines)
2. Functions in `vtt-react/src/components/spellcrafting-wizard/core/utils/previewGenerator.js`:
   - `generateGameText()`
   - `applyWowStyling()`
   - `formatKeywords()`
   - `simulateSpellUse()`
   - `calculateAverageDamage()`
   - `calculateHealingEfficiency()`
   - `estimateControlStrength()`
   - `compareWithBaseline()`
   - Supporting helper functions for the above

3. `vtt-react/src/components/spellcrafting-wizard/core/utils/formatSpellEffectsForReview.js` (after consolidation)

**Total Code Reduction:** ~2,500+ lines

---

## Files to Update

1. `vtt-react/src/data/generalSpellsData.js` - Add proper effectTypes and configs
2. `vtt-react/src/components/spellcrafting-wizard/core/utils/formatSpellEffects.js` - Consolidate formatting
3. `vtt-react/src/components/spellcrafting-wizard/components/library/SpellLibrary.jsx` - Add hover preview
4. All files importing `formatSpellEffectsForReview` - Update to use `formatSpellEffects`

---

*End of Investigation Findings*

