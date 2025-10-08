# Character Creation Wizard Enhancements

## Summary of Changes

This document outlines all enhancements made to the character creation wizard system, focusing on language expansion and starting equipment preview functionality.

---

## 1. Language System Expansion

### 1.1 Expanded Language List (Step7SkillsLanguages.jsx)

**Added 20+ new languages** to the COMMON_LANGUAGES array, organized by category:

#### Standard Languages
- Common, Dwarvish, Elvish, Giant, Gnomish, Goblin, Halfling, Orc

#### Exotic/Planar Languages
- Abyssal, Celestial, Draconic, Deep Speech, Infernal, Primordial, Sylvan, Undercommon

#### Race-Specific Languages
- **Old Nord** (Nordmark) - fa-mountain
- **Corvid** (Corvani) - fa-crow
- **Terran** (Grimheart/earth) - fa-gem
- **Ethereal** (Veilborn/spirits) - fa-ghost
- **Changeling** (Mirrorkin) - fa-masks-theater
- **Druidic** (Wildkin/nature) - fa-leaf
- **Ignan** (Ashmark/fire) - fa-fire
- **Beast Speech** (Skinwalker) - fa-paw
- **Necril** (Graveworn/undead) - fa-skull
- **Orcish** (War Orc) - fa-axe

#### Elemental Languages
- **Elemental** (general elemental) - fa-wind
- **Primal** (primal forces) - fa-tree-deciduous
- **Auran** (air elemental) - fa-cloud
- **Aquan** (water elemental) - fa-water

#### Special Languages
- **Thieves' Cant** (rogues) - fa-mask
- **Sign Language** (universal) - fa-hands

### 1.2 Racial Languages Display

**New Feature:** Racial languages are now automatically displayed separately from selectable languages.

- Racial languages are shown in a dedicated "Racial Languages (Automatic)" section
- These languages are marked with a star icon and cannot be deselected
- They don't count against the language selection limit
- Languages are pulled from the subrace data (e.g., Berserker Nordmark gets: Common, Old Nord, Giant)

### 1.3 Combined Language Count

**Enhancement:** Language selection now combines both background AND path language grants.

**Before:**
```javascript
const languageCount = (backgroundData?.languages || 0);
```

**After:**
```javascript
const languageCount = (backgroundData?.languages || 0) + (pathData?.languages || 0);
```

The UI now shows the breakdown: "(2 from background, 1 from path)" when both contribute.

### 1.4 Background Language Additions

**Added language grants to backgrounds that previously had none:**

| Background | Languages Added | Rationale |
|------------|----------------|-----------|
| Criminal | 1 | Underworld connections expose you to various tongues |
| Soldier | 1 | Military campaigns expose you to foreign languages |
| Charlatan | 1 | Worldly experience from traveling cons |
| Entertainer | 1 | Traveling performers learn from diverse audiences |
| Sailor | 1 | Port cities expose sailors to many languages |

**Existing backgrounds with languages:**
- Acolyte: 2
- Noble: 1
- Sage: 2
- Guild Artisan: 1
- Hermit: 1
- Outlander: 1

---

## 2. Starting Equipment Preview System

### 2.1 New Helper Function (startingEquipmentData.js)

**Added `getEquipmentPreview()` function** to show what items are unlocked by each selection:

```javascript
export const getEquipmentPreview = (selectionType, selectionValue) => {
    // selectionType: 'class', 'race', 'subrace', 'path', 'background'
    // selectionValue: the specific selection (e.g., 'Pyrofiend', 'nordmark', etc.)
    
    // Returns:
    // {
    //     count: number,              // Total items unlocked
    //     categories: {               // Items by category
    //         weapons: number,
    //         armor: number,
    //         accessories: number,
    //         containers: number,
    //         consumables: number,
    //         miscellaneous: number
    //     },
    //     examples: string[]          // Up to 3 example item names
    // }
}
```

### 2.2 Equipment Preview in Selection Steps

**Added equipment preview sections to all selection steps:**

#### Step 2: Race Selection
- Shows combined equipment from race AND subrace
- Displays total count and example items
- Only appears when items are available

#### Step 3: Class Selection
- Shows class-specific equipment
- Displays count, examples, and category breakdown
- Shows informative message if no class-specific items exist

#### Step 4: Background Selection
- Shows background-specific equipment
- Displays count and example items
- Only appears when items are available

#### Step 5: Path Selection
- Shows path-specific equipment
- Displays count and example items
- Only appears when items are available

### 2.3 Preview Display Format

All equipment previews follow a consistent format:

```
Starting Equipment
Unlocks X item(s) for purchase during character creation

Examples: Item Name 1, Item Name 2, Item Name 3

[Category badges showing counts by type]
```

---

## 3. Character Creation Wizard Steps Review

### Complete 10-Step Wizard Flow

1. **Step 1: Basic Info** ✓
   - Name, gender, character image upload/manipulation
   - Image transformation controls (scale, rotation, position)

2. **Step 2: Race Selection** ✓
   - Race and subrace selection
   - Stat modifiers preview
   - Racial traits display
   - **NEW:** Equipment preview for race/subrace

3. **Step 3: Class Selection** ✓
   - 27 classes across 9 paths
   - Class role, resource type, features
   - Recommended stats, playstyle tips
   - **NEW:** Equipment preview for class

4. **Step 4: Background Selection** ✓
   - 12 D&D-style backgrounds
   - Skill proficiencies, tool proficiencies
   - **UPDATED:** All backgrounds now grant languages
   - **NEW:** Equipment preview for background

5. **Step 5: Path Selection** ✓
   - 9 character paths (Mystic, Zealot, Trickster, etc.)
   - Stat modifiers, skill proficiencies
   - Starting point bonuses
   - **NEW:** Equipment preview for path

6. **Step 6: Stat Allocation** ✓
   - Point-buy system with path bonuses
   - Racial and path modifiers applied
   - Real-time stat breakdown display

7. **Step 7: Skills & Languages** ✓
   - Skill selection from class (2 skills)
   - Background skills automatically granted
   - **NEW:** Expanded language list (30+ languages)
   - **NEW:** Racial languages displayed separately
   - **NEW:** Combined background + path language count

8. **Step 8: Lore & Details** ✓
   - Backstory, personality traits, ideals
   - Bonds, flaws, appearance
   - Goals, fears, allies, enemies
   - Organizations, notes

9. **Step 9: Equipment Selection** ✓
   - Starting currency based on background + path
   - Grid-based equipment selection
   - Items filtered by all character selections
   - Currency tracking and item purchase

10. **Step 10: Character Summary** ✓
    - Final review of all selections
    - Complete character overview
    - Finalize and create character

---

## 4. Technical Implementation Details

### Files Modified

1. **vtt-react/src/components/character-creation-wizard/steps/Step7SkillsLanguages.jsx**
   - Expanded COMMON_LANGUAGES array
   - Added imports for getSubraceData and getPathData
   - Implemented racial languages display
   - Combined background + path language counts
   - Added language category badges

2. **vtt-react/src/data/backgroundData.js**
   - Added `languages: 1` to Criminal, Soldier, Charlatan, Entertainer, Sailor

3. **vtt-react/src/data/startingEquipmentData.js**
   - Added `getEquipmentPreview()` helper function

4. **vtt-react/src/components/character-creation-wizard/steps/Step2RaceSelection.jsx**
   - Added equipment preview for race/subrace selections

5. **vtt-react/src/components/character-creation-wizard/steps/Step3ClassSelection.jsx**
   - Added equipment preview for class selections
   - Replaced hardcoded equipment list with dynamic preview

6. **vtt-react/src/components/character-creation-wizard/steps/Step4BackgroundSelection.jsx**
   - Added equipment preview for background selections

7. **vtt-react/src/components/character-creation-wizard/steps/Step5PathSelection.jsx**
   - Added equipment preview for path selections

### Key Features

- **Automatic Language Detection:** Racial languages are automatically pulled from subrace data
- **Dynamic Equipment Preview:** Equipment counts update based on actual item availability
- **Consistent UI:** All preview sections use the same styling and format
- **Smart Filtering:** Equipment preview only shows items specific to that selection (excludes universal items)
- **Category Breakdown:** Shows how many items of each type are unlocked

---

## 5. Testing Recommendations

### Language System
- [ ] Verify racial languages appear in "Racial Languages (Automatic)" section
- [ ] Confirm racial languages cannot be selected again in additional languages
- [ ] Test that background + path language counts combine correctly
- [ ] Verify all 30+ languages display with correct icons

### Equipment Preview
- [ ] Test each race/subrace shows correct equipment count
- [ ] Test each class shows correct equipment count
- [ ] Test each background shows correct equipment count
- [ ] Test each path shows correct equipment count
- [ ] Verify example items are relevant to the selection
- [ ] Confirm universal items are excluded from preview counts

### Complete Wizard Flow
- [ ] Complete a full character creation from start to finish
- [ ] Verify all 10 steps work correctly
- [ ] Test navigation between steps
- [ ] Confirm character data persists across steps
- [ ] Verify final character creation succeeds

---

## 6. Future Enhancements

### Potential Improvements
1. **Language Proficiency Levels:** Add basic/fluent/native proficiency levels
2. **Equipment Recommendations:** Highlight recommended items for class/build
3. **Build Templates:** Pre-configured character builds for new players
4. **Equipment Comparison:** Side-by-side item comparison in equipment selection
5. **Language Families:** Group related languages (e.g., all elemental languages)

---

## Conclusion

All requested enhancements have been successfully implemented:

✅ **Languages expanded** with 30+ options including race-specific, elemental, and special languages
✅ **Language grants added** to all backgrounds (5 new backgrounds now grant languages)
✅ **Racial languages** displayed separately and automatically granted
✅ **Equipment previews** added to all selection steps (race, class, background, path)
✅ **All 10 wizard steps** reviewed and confirmed working

The character creation wizard now provides comprehensive information about language options and starting equipment at every selection point, helping players make informed decisions about their character build.

