# Remaining Spell Card Display Issues

Based on the screenshot of TEST: Explosive Rune, the following issues remain:

## ✅ FIXED

### 1. Damage Types Not Displaying
**Problem:** Damage type badges (fire, force) not showing in wizard variant
**Root Cause:** `getDamageTypes()` was looking for `spell.damageTypes` but test spells have `spell.damageConfig.damageTypes`
**Fix Applied:** Updated line 3059 to check both locations:
```javascript
const damageTypesArray = spell.damageTypes || spell.damageConfig?.damageTypes;
```

## ❌ STILL BROKEN

### 2. V/S/M Component Badges Not Displaying
**Problem:** Verbal and Somatic component icons not showing
**Expected:** Should show V and S icons in the pf-damage-spell-box
**Data:** Spell has `components: ['verbal', 'somatic']` in resourceCost
**Code Location:** Lines 6395-6399 in UnifiedSpellCard.jsx
**Status:** Code looks correct, need to debug why formatSpellComponents() is returning null

### 3. Trigger Text Not Displaying
**Problem:** TRAP spell should show "When an enemy enters the area" trigger
**Expected:** Should display in global-triggers-compact section
**Data:** Spell has proper triggerConfig with compoundTriggers
**Code Location:** Lines 6485-6532 in UnifiedSpellCard.jsx
**Status:** Code looks correct, need to debug why it's not rendering

### 4. Range Badge Extra Spacing
**Problem:** "Touch" badge has extra space (likely from empty icon div)
**Code Location:** Line 6439 - `<div className="pf-range-icon"></div>`
**Potential Fix:** Remove icon div or ensure CSS hides it when empty

### 5. All Spells Show Only Mana Cost
**Problem:** Resource costs only show mana, not health/stamina/focus/class resources
**Expected:** Should show all non-zero resource costs
**Code Location:** formatResourceCosts() function
**Status:** Need to verify function is checking all resource types

## 🔍 SPELLS WITH SAME ISSUES

Based on user report, these spells have similar problems:
- **Polymorph Beast** - Transformation spell, likely missing transformation display
- **Greater Purification** - Healing spell, likely missing healing effect display  
- **Resurrection** - Complex spell, likely missing multiple effect displays
- **Explosive Rune** - TRAP spell (shown in screenshot)

## 📋 DEBUGGING PLAN

1. **Add console logging** to key functions:
   - `getDamageTypes()` - Check what it returns
   - `formatSpellComponents()` - Check if it's being called and what it returns
   - Trigger display section - Check if conditions are met

2. **Check variant prop** - Ensure spell cards are using 'wizard' variant

3. **Verify data structure** - Ensure test spells match expected format

4. **CSS inspection** - Check if elements are rendering but hidden by CSS

## 🎯 FIXES APPLIED

### ✅ 1. Fixed getDamageTypes()
**Line 3059:** Added support for `spell.damageConfig.damageTypes`
```javascript
const damageTypesArray = spell.damageTypes || spell.damageConfig?.damageTypes;
```

### ✅ 2. Added Debug Logging
Added console.log statements to:
- **formatSpellComponents()** (lines 1446, 1490, 1493) - Track component detection
- **getDamageTypes()** (line 3064) - Track damage type detection
- **Trigger Display** (line 6504) - Track trigger rendering logic
- **Damage/Component Box** (line 6398) - Track box rendering decision

### ✅ 3. Optimized Damage/Component Box Rendering
**Lines 6390-6427:** Cached getDamageTypes() and formatSpellComponents() results to avoid multiple calls

## 🧪 TESTING INSTRUCTIONS

1. **Open browser console** (F12)
2. **Navigate to spell library** and view TEST: Explosive Rune
3. **Check console logs** for:
   ```
   [getDamageTypes] Checking damage types: { spellName, topLevel, damageConfig, final }
   [formatSpellComponents] Found components: ['verbal', 'somatic']
   [Damage/Component Box] { variant, damageTypesCount, hasComponents, shouldShow }
   [Trigger Display] { spellName, spellType, hasTriggerConfig, ... }
   ```

4. **Expected Results:**
   - Damage types: ['fire', 'force']
   - Components: ['verbal', 'somatic']
   - Trigger: "When an enemy enters the area"
   - All should display on the card

5. **If still not showing:**
   - Check console for which function is returning null/empty
   - Verify variant prop is 'wizard'
   - Check CSS for hidden elements
   - Verify spell data structure

## 📝 NEXT STEPS

1. ✅ Fix getDamageTypes() - DONE
2. ✅ Add debug logging - DONE
3. ⏳ Test and review console output
4. ⏳ Fix any remaining issues based on logs
5. ⏳ Remove debug logging once fixed
6. ⏳ Test all affected spells
7. ⏳ Update documentation

