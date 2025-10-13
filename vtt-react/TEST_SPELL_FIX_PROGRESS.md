# Test Spell Fix Progress

## Issues Identified

You've identified **12 critical issues** with the test spells that need to be fixed:

1. ❌ **Missing V/S/M components** - None of the 32 spells have verbal/somatic/material flags
2. ❌ **Missing trigger configuration** - REACTION and TRAP spells lack triggerConfig
3. ❌ **Incomplete stat references** - "Dominate Mind" says "-4 stat" instead of specific stat
4. ❌ **Capitalization issues** - "charmed" should be "Charmed", "haste" should be "Haste"
5. ❌ **Confusing component text** - "instant damage - roll dice (???) then draw 5 cards"
6. ❌ **Summoning lacks creature tags** - No creature specifications
7. ❌ **Resource variety** - All spells use mana, need health/stamina/focus/class resources
8. ❌ **Spacing issues** - Extra space before "30 ft" and " self"
9. ❌ **Area effect issues** - "Area Effect - any" should specify sphere/cone/line
10. ❌ **Progressive Might issues** - " self" with space, duplicate tags, lowercase "haste"
11. ❌ **Resurrection incomplete** - Missing restoration effect details
12. ❌ **Targeting variety** - Not enough experimentation with targeting restrictions

---

## Fix Strategy

### Approach 1: Comprehensive Systematic Fix (Recommended)
Fix ALL 32 spells systematically with all corrections:
- **Time:** ~30-45 minutes of editing
- **Result:** Fully corrected test spell library
- **Pros:** Complete, thorough, ready for testing
- **Cons:** Large number of edits

### Approach 2: Priority-Based Fix
Fix only the most critical issues first:
1. Add components to all spells (most visible)
2. Fix trigger configs for REACTION/TRAP
3. Fix stat references and capitalization
- **Time:** ~15-20 minutes
- **Result:** Partially corrected, main issues resolved
- **Pros:** Faster, addresses most visible problems
- **Cons:** Still has minor issues

### Approach 3: Create New Test Spells
Delete current testSpells.js and create brand new spells with all fixes:
- **Time:** ~45-60 minutes
- **Result:** Clean slate, perfect spells
- **Pros:** No legacy issues, clean code
- **Cons:** Longest time, loses current work

---

## Progress So Far

### ✅ Completed
1. Created TEST_SPELL_FIXES_NEEDED.md documenting all issues
2. Added components to TEST: Dice Fireball (1/32 spells)

### ⏳ In Progress
- Systematically adding components to remaining spells

### 📋 Remaining Work

#### Phase 1: Add Components (32 spells)
- [x] TEST: Dice Fireball
- [ ] TEST: Card Arcane Gambit
- [ ] TEST: Coin Fortune Frost
- [ ] TEST: Chain Lightning
- [ ] TEST: Rejuvenation
- [ ] TEST: Progressive Might
- [ ] TEST: Dominate Mind
- [ ] TEST: Dimension Door
- [ ] TEST: Gravity Well
- [ ] TEST: Summon Fire Elemental
- [ ] TEST: Polymorph Beast
- [ ] TEST: Greater Purification
- [ ] TEST: Resurrection
- [ ] TEST: Channeled Beam
- [ ] TEST: Passive Aura
- [ ] TEST: Counterspell
- [ ] TEST: Explosive Rune
- [ ] TEST: Invisibility
- [ ] TEST: Single Target Bolt
- [ ] TEST: Multi Target Missiles
- [ ] TEST: Area Circle Blast
- [ ] TEST: Area Cone Breath
- [ ] TEST: Area Line Lightning
- [ ] TEST: Smart Target Heal
- [ ] TEST: Nearest Enemy Strike
- [ ] TEST: Wild Magic Surge
- [ ] TEST: Charge Fireball
- [ ] TEST: Dice Cooldown Blast
- [ ] TEST: Reagent Ritual
- [ ] TEST: Multi Resource Spell
- [ ] TEST: Multi Effect Combo
- [ ] TEST: Ultimate Spell

#### Phase 2: Fix Trigger Configs (2 spells)
- [ ] TEST: Counterspell - Add "when enemy casts spell" trigger
- [ ] TEST: Explosive Rune - Add "when enemy enters area" trigger

#### Phase 3: Fix Stat References (1 spell)
- [ ] TEST: Dominate Mind - Change "-4 stat" to specific stats (Charisma -4, Wisdom -2)

#### Phase 4: Fix Capitalization (All spells)
- [ ] Change all "charmed" to "Charmed"
- [ ] Change all "haste" to "Haste"
- [ ] Change all "stunned" to "Stunned"
- [ ] Change all condition names to proper case

#### Phase 5: Fix Resource Costs (32 spells)
Distribute resources across:
- [ ] Mana (10 spells)
- [ ] Health (5 spells)
- [ ] Stamina (5 spells)
- [ ] Focus (5 spells)
- [ ] Class Resources (7 spells):
  - combo_points
  - soul_shards
  - holy_power
  - arcane_charges
  - chi
  - runes

#### Phase 6: Fix Summoning (1 spell)
- [ ] TEST: Summon Fire Elemental - Add creature specifications

#### Phase 7: Fix Spacing (All spells)
- [ ] Remove extra spaces before "ft"
- [ ] Remove leading spaces in strings
- [ ] Fix "Area Effect - any" to specific shapes

#### Phase 8: Complete Missing Configs (2 spells)
- [ ] TEST: Resurrection - Add full restoration config
- [ ] TEST: Progressive Might - Fix targeting and conditions

---

## Estimated Time

- **Approach 1 (Comprehensive):** 30-45 minutes
- **Approach 2 (Priority):** 15-20 minutes
- **Approach 3 (New Spells):** 45-60 minutes

---

## Recommendation

I recommend **Approach 1: Comprehensive Systematic Fix** because:

1. The test spells are meant to showcase EVERY feature
2. Incomplete fixes will still show formatting issues
3. Better to do it right once than fix incrementally
4. The fixes are straightforward, just tedious

---

## Next Steps

**Option A:** Proceed with comprehensive fix
- I'll systematically fix all 32 spells
- Add all components, triggers, stat references, etc.
- Ensure complete configurations

**Option B:** Priority fix only
- Fix components, triggers, and stat references
- Leave minor issues for later

**Option C:** Create new test spells
- Start fresh with perfect spells
- Ensure no legacy issues

---

**Your Choice:** Which approach would you like me to take?

**Current Status:** Waiting for direction before proceeding with mass edits.

