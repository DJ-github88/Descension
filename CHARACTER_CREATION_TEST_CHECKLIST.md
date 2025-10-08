# Character Creation Wizard - Test Checklist

## Overview
This checklist covers all enhancements made to the character creation wizard, focusing on language expansion and equipment preview functionality.

---

## 1. Language System Tests

### 1.1 Racial Languages Display
- [ ] **Test Nordmark (Mountain Dwarf)**: Should show "Common, Old Nord, Giant" as racial languages
- [ ] **Test Corvani (Raven)**: Should show "Common, Corvid, Ethereal" as racial languages
- [ ] **Test Grimheart (Mountain Dwarf)**: Should show "Common, Dwarvish, Terran" as racial languages
- [ ] **Test Veilborn (Celestial)**: Should show "Common, Ethereal, Celestial" as racial languages
- [ ] **Test Mirrorkin (Doppelganger)**: Should show "Common, Changeling, Thieves' Cant" as racial languages
- [ ] **Test Wildkin (Feral)**: Should show "Common, Druidic, Beast Speech" as racial languages
- [ ] **Test Ashmark (War Orc)**: Should show "Common, Orcish, Ignan" as racial languages
- [ ] **Test Skinwalker (Primal)**: Should show "Common, Beast Speech, Primal" as racial languages
- [ ] **Test Graveworn (Lich)**: Should show "Common, Necril, All Ancient Languages" as racial languages

### 1.2 Language Selection Behavior
- [ ] Racial languages appear in separate "Racial Languages (Automatic)" section
- [ ] Racial languages have star icons (⭐)
- [ ] Racial languages cannot be selected again in additional languages dropdown
- [ ] Racial languages are disabled/grayed out in the additional languages list
- [ ] Language count shows correct total from background + path

### 1.3 Background Language Grants
Test each background shows correct language count:
- [ ] **Acolyte**: 2 languages
- [ ] **Criminal**: 1 language (NEW)
- [ ] **Entertainer**: 1 language (NEW)
- [ ] **Guild Artisan**: 1 language
- [ ] **Hermit**: 1 language
- [ ] **Noble**: 1 language
- [ ] **Outlander**: 1 language
- [ ] **Sage**: 2 languages
- [ ] **Sailor**: 1 language (NEW)
- [ ] **Soldier**: 1 language (NEW)
- [ ] **Charlatan**: 1 language (NEW)

### 1.4 Path Language Grants
Test each path shows correct language count:
- [ ] **Mystic**: 2 languages
- [ ] **Zealot**: 1 language
- [ ] **Trickster**: 1 language
- [ ] **Harrow**: 2 languages
- [ ] **Arcanist**: 3 languages
- [ ] **Hexer**: 2 languages
- [ ] **Reaver**: 0 languages
- [ ] **Mercenary**: 1 language
- [ ] **Sentinel**: 1 language

### 1.5 Combined Language Count
Test combinations:
- [ ] **Acolyte + Mystic**: Should show "4 languages (2 from background, 2 from path)"
- [ ] **Criminal + Reaver**: Should show "1 language (1 from background, 0 from path)"
- [ ] **Sage + Arcanist**: Should show "5 languages (2 from background, 3 from path)"
- [ ] **Sailor + Mercenary**: Should show "2 languages (1 from background, 1 from path)"

### 1.6 Language List Completeness
Verify all 30+ languages appear in the dropdown:
- [ ] Standard: Common, Dwarvish, Elvish, Giant, Gnomish, Goblin, Halfling, Orc
- [ ] Exotic: Abyssal, Celestial, Draconic, Deep Speech, Infernal, Primordial, Sylvan, Undercommon
- [ ] Racial: Old Nord, Corvid, Terran, Ethereal, Changeling, Druidic, Ignan, Beast Speech, Necril, Orcish
- [ ] Elemental: Elemental, Primal, Auran, Aquan
- [ ] Special: Thieves' Cant, Sign Language

---

## 2. Equipment Preview Tests

### 2.1 Race/Subrace Equipment Preview (Step 2)
- [ ] **Select Nordmark race**: Equipment preview appears if race-specific items exist
- [ ] **Select Mountain Dwarf subrace**: Combined race + subrace equipment count shown
- [ ] **Equipment count is accurate**: Matches actual items in startingEquipmentData.js
- [ ] **Example items shown**: Up to 3 example items displayed
- [ ] **No equipment case**: If no race-specific items, preview section doesn't appear

Test multiple race/subrace combinations:
- [ ] Nordmark + Mountain Dwarf
- [ ] Corvani + Raven
- [ ] Grimheart + Stone Guardian
- [ ] Wildkin + Lightfoot Halfling

### 2.2 Class Equipment Preview (Step 3)
- [ ] **Select Pyrofiend**: Shows class-specific equipment count
- [ ] **Example items shown**: Up to 3 example items displayed
- [ ] **Category breakdown**: Shows count by category (weapons, armor, accessories, etc.)
- [ ] **Category badges**: Each category with items shows badge with icon and count
- [ ] **No equipment message**: If no class-specific items, shows "No class-specific equipment. Universal items available."

Test multiple classes:
- [ ] Pyrofiend (fire mage)
- [ ] Bladedancer (melee fighter)
- [ ] Chronarch (time mage)
- [ ] Minstrel (bard)
- [ ] Warden (tank)

### 2.3 Background Equipment Preview (Step 4)
- [ ] **Select Acolyte**: Shows background-specific equipment if available
- [ ] **Select Criminal**: Shows background-specific equipment if available
- [ ] **Example items shown**: Up to 3 example items displayed
- [ ] **No equipment case**: If no background-specific items, preview section doesn't appear

Test all backgrounds:
- [ ] Acolyte
- [ ] Criminal
- [ ] Entertainer
- [ ] Guild Artisan
- [ ] Hermit
- [ ] Noble
- [ ] Outlander
- [ ] Sage
- [ ] Sailor
- [ ] Soldier
- [ ] Charlatan

### 2.4 Path Equipment Preview (Step 5)
- [ ] **Select Mystic**: Shows path-specific equipment if available
- [ ] **Select Reaver**: Shows path-specific equipment if available
- [ ] **Example items shown**: Up to 3 example items displayed
- [ ] **No equipment case**: If no path-specific items, preview section doesn't appear

Test all paths:
- [ ] Mystic
- [ ] Zealot
- [ ] Trickster
- [ ] Harrow
- [ ] Arcanist
- [ ] Hexer
- [ ] Reaver
- [ ] Mercenary
- [ ] Sentinel

### 2.5 Equipment Preview Consistency
- [ ] All preview sections use same CSS styling
- [ ] All preview sections use same icon (fa-shopping-bag)
- [ ] All preview sections use same text format
- [ ] Example items are comma-separated
- [ ] Item counts are accurate (match actual filtered items)

---

## 3. Complete Wizard Flow Tests

### 3.1 Step-by-Step Navigation
- [ ] **Step 1 (Basic Info)**: Name, gender, image upload works
- [ ] **Step 2 (Race)**: Race/subrace selection works, equipment preview appears
- [ ] **Step 3 (Class)**: Class selection works, equipment preview appears
- [ ] **Step 4 (Background)**: Background selection works, equipment preview appears
- [ ] **Step 5 (Path)**: Path selection works, equipment preview appears
- [ ] **Step 6 (Stats)**: Stat allocation works with path bonuses
- [ ] **Step 7 (Skills/Languages)**: Skills and languages selection works, racial languages shown
- [ ] **Step 8 (Lore)**: Lore details can be filled out
- [ ] **Step 9 (Equipment)**: Equipment selection shows filtered items based on all selections
- [ ] **Step 10 (Summary)**: Character summary shows all selections correctly

### 3.2 Data Persistence
- [ ] Selections persist when navigating back and forth between steps
- [ ] Changing race updates racial languages in Step 7
- [ ] Changing background updates language count in Step 7
- [ ] Changing path updates language count in Step 7
- [ ] Equipment preview updates when selections change

### 3.3 Validation
- [ ] Cannot proceed without selecting required fields
- [ ] Error messages appear for missing selections
- [ ] Language selection enforces correct count
- [ ] Cannot select more languages than allowed

---

## 4. Edge Cases and Special Scenarios

### 4.1 Language Edge Cases
- [ ] **Graveworn Lich**: "All Ancient Languages" displays correctly as racial language
- [ ] **Mirrorkin Doppelganger**: "Thieves' Cant" appears as racial language and is disabled in selection
- [ ] **Maximum languages**: Sage (2) + Arcanist (3) = 5 languages selectable
- [ ] **Minimum languages**: Reaver path (0) + any background with 1 = 1 language selectable

### 4.2 Equipment Edge Cases
- [ ] **Universal items**: Not counted in equipment preview (correctly excluded)
- [ ] **Multiple availability**: Item available for multiple classes shows in each class preview
- [ ] **No items**: Preview section doesn't appear (not just empty)
- [ ] **Single item**: Correct singular text "1 item" (not "1 items")

### 4.3 UI/UX Edge Cases
- [ ] Long language names don't break layout
- [ ] Many racial languages (3+) display correctly
- [ ] Equipment examples with long names don't overflow
- [ ] Category badges wrap correctly if many categories

---

## 5. Integration Tests

### 5.1 Full Character Creation Flow
Create a complete character and verify:
- [ ] **Character 1**: Nordmark Mountain Dwarf, Pyrofiend, Acolyte, Mystic
  - Should have: Common, Old Nord, Giant (racial) + 4 selectable languages
  - Should see equipment from: race, subrace, class, background, path, universal
  
- [ ] **Character 2**: Corvani Raven, Bladedancer, Criminal, Trickster
  - Should have: Common, Corvid, Ethereal (racial) + 2 selectable languages
  - Should see equipment from: race, subrace, class, background, path, universal

- [ ] **Character 3**: Wildkin Lightfoot Halfling, Minstrel, Entertainer, Arcanist
  - Should have: Common, Halfling, Druidic (racial) + 4 selectable languages
  - Should see equipment from: race, subrace, class, background, path, universal

### 5.2 Equipment Selection Verification
- [ ] Step 9 equipment grid shows all items from previews
- [ ] Items are correctly filtered by all selections
- [ ] Universal items always appear
- [ ] Class-specific items only appear for that class
- [ ] Race/subrace-specific items only appear for that race/subrace

---

## 6. Visual/CSS Tests

### 6.1 Language Section Styling
- [ ] Racial languages section has distinct styling
- [ ] Star icons appear next to racial languages
- [ ] Language badges have correct colors
- [ ] Language dropdown is properly styled
- [ ] Selected languages show checkmarks or selected state

### 6.2 Equipment Preview Styling
- [ ] Equipment preview sections match other preview sections
- [ ] Shopping bag icon appears correctly
- [ ] Example items are readable and properly formatted
- [ ] Category badges have correct icons
- [ ] Text is properly aligned and spaced

### 6.3 Responsive Design
- [ ] Language section works on different screen sizes
- [ ] Equipment preview doesn't overflow on small screens
- [ ] Category badges wrap correctly
- [ ] Long item names don't break layout

---

## 7. Performance Tests

- [ ] Language list loads quickly (30+ languages)
- [ ] Equipment preview calculates quickly (filtering large item library)
- [ ] No lag when switching between races/classes/backgrounds/paths
- [ ] Racial language detection is instant
- [ ] No console errors or warnings

---

## 8. Accessibility Tests

- [ ] Language selection is keyboard navigable
- [ ] Equipment preview is screen reader friendly
- [ ] Icons have appropriate aria-labels
- [ ] Color contrast is sufficient
- [ ] Focus states are visible

---

## Summary

**Total Test Cases**: 150+

**Critical Tests** (Must Pass):
1. Racial languages display correctly for all races
2. Language count combines background + path correctly
3. Equipment preview shows accurate counts for all selections
4. Complete wizard flow works from start to finish
5. No console errors or warnings

**Priority Order**:
1. Language system functionality (racial languages, counts, selection)
2. Equipment preview accuracy (counts, examples, categories)
3. Complete wizard flow (all 10 steps)
4. Edge cases and special scenarios
5. Visual/CSS and accessibility

---

## Bug Reporting Template

If you find issues, report them with:
- **Step**: Which wizard step (1-10)
- **Selection**: What was selected (race, class, background, path)
- **Expected**: What should happen
- **Actual**: What actually happened
- **Console Errors**: Any errors in browser console
- **Screenshots**: If visual issue

---

## Notes

- Test in multiple browsers (Chrome, Firefox, Safari, Edge)
- Test with different character combinations
- Verify data persists across page refreshes (if applicable)
- Check that final character creation saves all data correctly

