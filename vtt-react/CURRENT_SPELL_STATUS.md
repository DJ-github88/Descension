# Current Spell System Status

## 🎯 Current State

### ✅ What's Working

#### Class Spells (81 total)
- **Status:** ✅ FIXED - Now properly organized by class
- **Format:** Object with class names as keys
- **Example:** `ALL_CLASS_SPELLS['Pyrofiend']` returns array of 3 spells
- **Spells per class:** 3 (one per specialization)
- **Total classes:** 27
- **Total spells:** 81

**Spell Types:**
1. **Cone AOE Damage** - Proper targeting, saving throws, crits
2. **Healing Over Time** - Complete HOT config with overheal
3. **Reaction Damage** - Full trigger system

**All spells have:**
- ✅ Complete effect configurations
- ✅ Proper targeting (no "Touch" on AOE)
- ✅ Element types (fire, cold, shadow, etc.)
- ✅ Material components
- ✅ Saving throws
- ✅ Critical hits
- ✅ No empty boxes

---

### ⚠️ What Needs Fixing

#### General Spells (Baseline Actions)
- **Status:** ⚠️ NEEDS FIXING
- **Location:** `generalSpellsData.js`
- **Issue:** Using `mechanicsConfig` instead of proper effect configs

**Problems:**

1. **Shove** (Line 213-242)
   - ❌ Uses `mechanicsConfig.contestedCheck`
   - ✅ Should use `controlConfig` with:
     - `controlType: 'push'`
     - `distance: 5`
     - `savingThrow` with strength DC
     - `effects: ['pushed_5ft']`

2. **Tackle** (Line 244-273)
   - ❌ Uses `mechanicsConfig.contestedCheck`
   - ✅ Should use `controlConfig` with:
     - `controlType: 'prone'`
     - `savingThrow` with strength DC
     - `effects: ['prone']`
     - `requirements: ['10ft_movement']`

3. **Hide** (Line 188-211)
   - ❌ Uses `mechanicsConfig.skillCheck`
   - ✅ Should use `utilityConfig` with:
     - `utilityType: 'stealth'`
     - `skillCheck` configuration
     - Proper stealth mechanics

4. **Attack** (Line 54-100)
   - ⚠️ Uses `mechanicsConfig.attackRoll`
   - ⚠️ Has `damageConfig` but incomplete
   - ✅ Should have complete `damageConfig` with:
     - Weapon damage formulas
     - Critical hit config
     - Attribute scaling

**Total General Spells:** ~30+ actions
**Spells Needing Fixes:** ~15-20

---

## 📊 Spell Library Display

### What You See in Spell Library

**Current Display:**
- ✅ General Actions (30+ spells)
- ❌ Class Spells (NOT showing - but now fixed in code!)

**Why Class Spells Weren't Showing:**
- ❌ Generator was returning flat array
- ✅ **FIXED:** Now returns object organized by class name
- ✅ Hook expects `ALL_CLASS_SPELLS[className]`
- ✅ Now properly structured

**After Refresh:**
- ✅ Should see class spells for your character's class
- ✅ Organized by specialization
- ✅ 3 spells per class

---

## 🔧 Next Steps

### Priority 1: Test Class Spell Loading
1. **Clear cache:**
   ```javascript
   localStorage.clear();
   ```

2. **Reload app**

3. **Select a character with a class** (e.g., Pyrofiend)

4. **Open Spell Library**

5. **Verify you see:**
   - ✅ General Actions tab
   - ✅ Class-specific tabs (Fire Mastery, Infernal Power, Combustion)
   - ✅ 3 spells total for your class

### Priority 2: Fix General Spells
Convert `mechanicsConfig` to proper effect configs:

1. **Shove** → `controlConfig`
2. **Tackle** → `controlConfig`
3. **Hide** → `utilityConfig`
4. **Grapple** → `controlConfig`
5. **Disarm** → `controlConfig`
6. **Help** → `buffConfig`
7. **Ready** → `triggerConfig`

### Priority 3: Add More Class Spell Archetypes
1. Control Stun
2. Explosive Trap
3. Summoning
4. Transformation
5. Wild Magic
6. Line/Cube/Wall AOE
7. Proc Effects
8. PASSIVE spells
9. STATE spells

---

## 📝 Files Status

### ✅ Clean and Ready
- `classSpellGenerator.js` - Properly formatted, organized by class
- `customSpellLibraryData.js` - Empty, ready for showcase spells
- `enhancedSpellLibrary.js` - Empty, ready for showcase spells
- `additionalSpells.js` - Empty, ready for showcase spells
- `additionalEnhancedSpells.js` - Empty, ready for showcase spells

### ⚠️ Needs Fixing
- `generalSpellsData.js` - Has `mechanicsConfig` instead of proper configs

### ✅ Hooks Working
- `useClassSpellLibrary.js` - Expects object by class name ✅ FIXED

---

## 🎯 Expected Behavior

### When You Open Spell Library

**General Tab:**
- Shows ~30 baseline actions
- Available to all characters
- Currently has formatting issues

**Class Tabs:**
- Shows 3 spells for your class
- Organized by specialization
- Properly formatted with complete configs

**Example for Pyrofiend:**
1. **Fire Mastery Tab:**
   - "Fire Breath" (Cone AOE)

2. **Infernal Power Tab:**
   - "Infernal Regeneration" (HOT)

3. **Combustion Tab:**
   - "Combustion Retaliation" (Reaction)

---

## 🐛 Known Issues

### Issue 1: Class Spells Not Showing
- **Status:** ✅ FIXED
- **Cause:** Generator returned array instead of object
- **Fix:** Changed to return `{ [className]: [spells] }`

### Issue 2: General Spells Have Wrong Configs
- **Status:** ⚠️ NEEDS FIXING
- **Cause:** Using `mechanicsConfig` instead of proper effect configs
- **Fix:** Convert to `controlConfig`, `utilityConfig`, etc.

### Issue 3: "Touch" Display on AOE
- **Status:** ✅ FIXED (for class spells)
- **Cause:** Missing proper `targetingConfig`
- **Fix:** Added complete `targetingConfig` with AOE type

---

## 🎉 Summary

**What's Working:**
- ✅ 81 class spells properly formatted
- ✅ Organized by class name
- ✅ Complete effect configurations
- ✅ No "Touch" on AOE spells
- ✅ Element types on all spells

**What Needs Work:**
- ⚠️ General spells need proper effect configs
- ⚠️ Need to test class spell loading in UI
- ⚠️ Need more spell archetypes for variety

**Next Action:**
1. Test if class spells now show in spell library
2. Fix general spells (Shove, Tackle, etc.)
3. Add more class spell archetypes

