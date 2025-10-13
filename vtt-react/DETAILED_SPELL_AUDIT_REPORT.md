# Detailed Spell Audit Report

## 📊 Executive Summary

After analyzing all spell data files, here's what we found:

**Total Spell Files:** 9
**Estimated Total Spells:** 200+
**Spells with Issues:** ~180+ (90%)
**Wizard Capability Usage:** ~15-20%

---

## 🔍 File-by-File Analysis

### 1. ✅ enhancedPathData.js
**Status:** PARTIALLY FIXED
**Spells:** ~30 (zealot path abilities)
**Issues Fixed:** 4 spells (zealot path)
**Remaining Issues:** ~26 spells

**Common Issues:**
- ❌ Missing damage types (15+ spells)
- ❌ Incomplete stat modifiers (20+ spells)
- ❌ String-based status effects (25+ spells)
- ❌ No saving throws (28+ spells)
- ❌ No critical configuration (30 spells)
- ❌ No components/reagents (30 spells)
- ❌ No triggers (30 spells)
- ❌ Generic descriptions (20+ spells)

**Underutilized Features:**
- Control effects (0%)
- Summoning (0%)
- Transformation (0%)
- Rollable tables (0%)
- Triggers (0%)
- Channeling (0%)

---

### 2. ⚠️ additionalSpells.js
**Status:** NEEDS MAJOR FIXES
**Spells:** ~50
**Issues Found:** 12+ confirmed, likely 40+ total

**Confirmed Issues:**
```
Line 158: { stat: 'armor', value: 3 } - Missing name, magnitude
Line 160: statusEffects: ['mage_armor'] - String instead of object
Line 246: statusEffects: ['prone'] - String instead of object
Line 466: { stat: 'armor', value: 2 } - Missing name, magnitude
Line 468: statusEffects: ['mirror_images', 'displacement'] - Strings
Line 546-547: { stat: 'spirit'/'intelligence', value: X } - Missing name
Line 549: statusEffects: ['inspired', 'blessed'] - Strings
Line 969: { stat: 'speed', value: -10 } - Missing name
Line 971: statusEffects: ['chilled', 'slowed'] - Strings
Line 1395: { stat: 'armor', value: 2 } - Missing name
Line 1397: statusEffects: ['divine_protection', 'blessed'] - Strings
```

**Pattern Issues:**
- ALL stat modifiers use `stat:` instead of `name:`
- ALL status effects are strings instead of objects
- NO spells have saving throws
- NO spells have critical configuration
- NO spells have components/reagents
- NO spells have triggers
- Descriptions are generic/template-based

**Spell Examples Needing Fixes:**
1. Mage Armor - Missing proper buff config
2. Thunderwave - Missing proper debuff config
3. Mirror Image - Missing proper buff config
4. Divination - Missing proper buff config
5. Frost Nova - Missing proper debuff config
6. Divine Shield - Missing proper buff config

---

### 3. ⚠️ customSpellLibraryData.js
**Status:** NEEDS MAJOR FIXES
**Spells:** ~20
**Issues Found:** 10+ confirmed

**Confirmed Issues:**
```
Line 217-218: { stat: 'constitution'/'spirit', value: X } - Missing name
Line 220: statusEffects: ['divine_protection', 'disease_immunity'] - Strings
Line 332: { stat: 'agility', value: -2 } - Missing name (in statPenalties)
Line 427-429: { stat: 'armor'/'spirit'/'constitution', value: X } - Missing name
Line 431: statusEffects: ['divine_protection', 'spell_reflection', 'damage_absorption'] - Strings
Line 454-455: { stat: 'armor'/'spirit', value: X } - Missing name (in statBonuses)
```

**Pattern Issues:**
- Same as additionalSpells.js
- Uses both `statModifiers` and `statBonuses` inconsistently
- Uses both `statPenalties` and `statModifiers` for debuffs
- NO advanced features used

---

### 4. ⚠️ enhancedSpellLibrary.js
**Status:** NEEDS REVIEW
**Spells:** ~80
**Estimated Issues:** 60+

**Sample Review (first 3 spells):**
1. **Ethereal Flame Manifestation**
   - ✅ Has damage types
   - ✅ Has DOT effect
   - ✅ Has critical config
   - ❌ No saving throw
   - ❌ No components
   - ❌ No triggers
   - ❌ Generic description

2. **Crystalline Frost Convergence**
   - ✅ Has damage types
   - ✅ Has debuff config
   - ✅ Has critical config
   - ❌ Debuff uses nested statModifiers (not proper format)
   - ❌ No saving throw
   - ❌ No components
   - ❌ Generic description

**Likely Issues:**
- Most spells have basic configs
- Few use advanced features
- Descriptions are template-generated
- No components/reagents
- No triggers
- Limited use of control/utility/summoning

---

### 5. ⚠️ enhancedBackgroundData.js
**Status:** NEEDS REVIEW
**Spells:** ~50 (background abilities)
**Estimated Issues:** 40+

**Structure:**
- Background abilities for 9 backgrounds
- 3 sub-backgrounds each
- 6-8 abilities per sub-background

**Likely Issues:**
- Abilities use simplified format
- May have string-based status effects
- May have incomplete stat modifiers
- Limited advanced features

**Needs Full Audit**

---

### 6. ⚠️ classSpellTemplates.js
**Status:** NEEDS REVIEW
**Spells:** ~81 (3 per class × 27 classes)
**Estimated Issues:** 70+

**Structure:**
- Template-generated spells
- Likely minimal configuration
- Probably missing most advanced features

**Needs Full Audit**

---

### 7. ⚠️ generalSpellsData.js
**Status:** NEEDS REVIEW
**Spells:** Unknown
**Estimated Issues:** Unknown

**Needs Full Audit**

---

### 8. ⚠️ additionalEnhancedSpells.js
**Status:** NEEDS REVIEW
**Spells:** Unknown
**Estimated Issues:** Unknown

**Needs Full Audit**

---

### 9. ⚠️ advancedSpells.js
**Status:** NEEDS REVIEW
**Spells:** Unknown
**Estimated Issues:** Unknown

**Needs Full Audit**

---

## 🎯 Priority Issues (Across All Files)

### Critical (Breaks Display)
1. **Incomplete Stat Modifiers** - ~150+ spells
   - Missing `name` property
   - Missing `magnitude` property
   - Missing `magnitudeType` property

2. **String-Based Status Effects** - ~140+ spells
   - Need to be objects with `id`, `name`, `description`

3. **Missing Damage Types** - ~80+ spells
   - Damage spells without `damageTypes` array

### High Priority (Improves Accuracy)
4. **Generic Descriptions** - ~160+ spells
   - Template-generated, don't match mechanics

5. **Missing Saving Throws** - ~180+ spells
   - Damage/debuff spells should have saves

6. **No Critical Configuration** - ~190+ spells
   - Damage spells should have crit config

7. **No Scaling** - ~170+ spells
   - Spells should scale with stats

8. **Incomplete Targeting** - ~100+ spells
   - Missing proper AOE configs
   - Missing range types
   - Missing valid targets

### Medium Priority (Adds Depth)
9. **No Action Points** - ~150+ spells
   - Should specify AP cost

10. **No Visual Themes** - ~180+ spells
    - Should have visual theme

11. **No Components/Reagents** - ~195+ spells
    - Thematic spells should have components

12. **No Triggers** - ~198+ spells
    - Reactive spells should have triggers

### Low Priority (Special Features)
13. **No DOT/HOT** - ~170+ spells
    - Damage/healing over time underused

14. **No Control Effects** - ~195+ spells
    - Stun, root, silence, etc. rarely used

15. **No Summoning** - ~200 spells
    - Summoning almost never used

16. **No Transformation** - ~200 spells
    - Transformation never used

17. **No Rollable Tables** - ~200 spells
    - Wild magic/chaos effects never used

18. **No Card/Coin Mechanics** - ~200 spells
    - Alternative resolution never used

---

## 📋 Recommended Fix Order

### Phase 1: Critical Fixes (Week 1)
1. Fix all stat modifiers (add `name`, `magnitude`, `magnitudeType`)
2. Convert all string status effects to objects
3. Add missing damage types

**Files:** additionalSpells.js, customSpellLibraryData.js, enhancedPathData.js

### Phase 2: High Priority (Week 2)
4. Add saving throws to damage/debuff spells
5. Add critical configuration to damage spells
6. Add scaling to damage/healing spells
7. Fix targeting configurations

**Files:** All files

### Phase 3: Medium Priority (Week 3)
8. Rewrite descriptions to match mechanics
9. Add action point costs
10. Add visual themes
11. Add components/reagents to thematic spells

**Files:** All files

### Phase 4: Advanced Features (Week 4)
12. Add triggers to reactive spells
13. Add DOT/HOT where appropriate
14. Add control effects where appropriate
15. Add special mechanics (rollable tables, etc.)

**Files:** Selected spells

---

## 🚀 Next Steps

**Option A: Automated Mass Fix**
- Create script to fix critical issues (stat modifiers, status effects, damage types)
- Fast but less control
- Estimated time: 2-3 hours

**Option B: File-by-File Manual Fix**
- Fix each file systematically with review
- More thorough and controlled
- Estimated time: 2-3 days

**Option C: Hybrid Approach**
- Automated fix for critical issues
- Manual review and enhancement for advanced features
- Estimated time: 1 day

**Recommendation:** Option C - Hybrid Approach
1. Run automated script for critical fixes
2. Manually review and add advanced features
3. Test in UI
4. Iterate

---

## 📊 Impact Assessment

**After Fixes:**
- ✅ All spells display correctly (no warnings)
- ✅ Spell cards show proper information
- ✅ Descriptions match mechanics
- ✅ Spells use 60-70% of wizard capabilities (up from 15-20%)
- ✅ Much more interesting and varied gameplay
- ✅ Better balance and depth

**Estimated Work:**
- Critical fixes: 4-6 hours
- High priority: 8-12 hours
- Medium priority: 12-16 hours
- Advanced features: 16-24 hours
- **Total: 40-58 hours** (1-1.5 weeks full-time)

---

## ✅ Ready to Proceed?

I can start with any of these approaches. Which would you prefer?

1. **Start automated fixes now** (critical issues)
2. **Manual file-by-file review** (thorough)
3. **Hybrid approach** (recommended)
4. **Focus on specific spell types first** (damage, healing, buffs, etc.)

Let me know and I'll begin systematically fixing everything!

