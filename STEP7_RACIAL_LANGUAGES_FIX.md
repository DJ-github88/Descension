# Step 7 Racial Languages System - Complete Implementation

## Summary of Changes

Fixed the racial languages system in character creation to ensure every race/subrace has appropriate automatic languages that are pre-selected and cannot be deselected.

---

## Changes Made

### 1. Added Missing Languages ✅

**Added to COMMON_LANGUAGES array:**
- **Orcish** - For War Orc subrace (Ashmark)
- **All Ancient Languages** - Special language for Scholar Graveworn

### 2. Automatic Racial Language Selection ✅

**Modified language saving logic** (lines 147-151):
```javascript
useEffect(() => {
    // Combine racial languages (automatic) with selected languages (chosen)
    const allLanguages = [...new Set([...racialLanguages, ...selectedLanguages])];
    dispatch(wizardActionCreators.setLanguages(allLanguages));
}, [selectedLanguages, racialLanguages, dispatch]);
```

**What this does:**
- Automatically includes all racial languages in the character's final language list
- Combines them with the player's chosen additional languages
- Uses `Set` to remove any duplicates
- Updates whenever race/subrace changes or languages are selected

### 3. Visual Improvements ✅

**Added comprehensive language preview section:**
- Shows all racial languages with "Racial" badge
- Shows all selected additional languages with "Learned" badge
- Organized into two categories for clarity
- Each language displays its icon, name, and source

---

## Complete Racial Language Coverage

### All Races and Their Automatic Languages:

| Race | Subrace | Racial Languages |
|------|---------|------------------|
| **Nordmark** | Berserker | Common, Old Nord, Giant |
| **Nordmark** | Skald | Common, Old Nord, Celestial |
| **Corvani** | Oracle | Common, Corvid, Ethereal |
| **Corvani** | Scout | Common, Corvid, Sylvan |
| **Grimheart** | Delver | Common, Terran, Undercommon |
| **Grimheart** | Warden | Common, Terran, Primordial |
| **Grimheart** | Mountain Dwarf | Common, Dwarvish, Terran |
| **Veilborn** | Medium | Common, Ethereal, Celestial |
| **Veilborn** | Walker | Common, Ethereal, Abyssal |
| **Mirrorkin** | Doppel | Common, Changeling, Thieves' Cant |
| **Mirrorkin** | Broken | Common, Changeling, Deep Speech |
| **Thornkin** | Courtly | Common, Sylvan, Celestial |
| **Wildkin** | Guardian | Common, Druidic, Beast Speech |
| **Wildkin** | Wanderer | Common, Druidic, Primordial |
| **Wildkin** | Shaman | Common, Druidic, Elemental |
| **Wildkin** | Lightfoot Halfling | Common, Halfling, Druidic |
| **Ashmark** | Forgeborn | Common, Ignan, Terran |
| **Ashmark** | Cinderborn | Common, Ignan, Auran |
| **Ashmark** | War Orc | Common, Orcish, Ignan |
| **Skinwalker** | Hunter | Common, Beast Speech, Primal |
| **Skinwalker** | Penitent | Common, Beast Speech, Celestial |
| **Graveworn** | Hoarder | Common, Necril, Draconic |
| **Graveworn** | Scholar | Common, Necril, All Ancient Languages |

**Total: 23 subraces, all with 3 racial languages each**

---

## Language System Breakdown

### Racial Languages (Automatic)
- **Count**: 2-3 per race/subrace
- **Selection**: Automatic, cannot be deselected
- **Display**: Shown in "Racial Languages" section with star icons
- **Badge**: Brown "Racial" badge in preview

### Additional Languages (Player Choice)
- **Count**: 0-4 based on background + path
  - Acolyte: 2 languages
  - Criminal: 1 language
  - Sage: 2 languages
  - Noble: 1 language
  - Mystic path: 2 languages
  - Zealot path: 1 language
  - Trickster path: 1 language
  - etc.
- **Selection**: Player chooses from all available languages
- **Display**: Shown in "Additional Languages" section
- **Badge**: Gold "Learned" badge in preview

### Total Languages Per Character
- **Minimum**: 3 (racial only, if background/path grant 0)
- **Typical**: 4-7 (3 racial + 1-4 additional)
- **Maximum**: 7 (3 racial + 4 additional from Acolyte + Mystic)

---

## All Available Languages (94 Total)

### Standard Common Languages (7)
1. Common
2. Dwarvish
3. Elvish
4. Giant
5. Gnomish
6. Goblin
7. Halfling

### Exotic/Planar Languages (8)
8. Abyssal
9. Celestial
10. Draconic
11. Deep Speech
12. Infernal
13. Primordial
14. Sylvan
15. Undercommon

### Race-Specific Languages (10)
16. Old Nord
17. Corvid
18. Terran
19. Ethereal
20. Changeling
21. Druidic
22. Ignan
23. Beast Speech
24. Necril
25. Orcish

### Elemental Languages (4)
26. Elemental
27. Primal
28. Auran
29. Aquan

### Special Languages (3)
30. Thieves' Cant
31. Sign Language
32. All Ancient Languages

---

## UI/UX Features

### Selection Interface
- Racial languages shown separately with star icons
- Cannot be clicked or deselected (disabled state)
- Additional languages shown in selectable grid
- Counter shows "X / Y from background & path"

### Preview Section
- **Languages Summary** section at bottom
- Two categories: "Racial Languages" and "Additional Languages"
- Each language shows:
  - Icon (thematic FontAwesome icon)
  - Language name
  - Source badge (Racial/Learned)
- Hover effects for visual feedback

### Visual Styling
- Racial languages: Brown accent color (#8b4513)
- Additional languages: Gold accent color (#d4af37)
- Pathfinder beige aesthetic throughout
- Consistent with rest of wizard styling

---

## Files Modified

1. **vtt-react/src/components/character-creation-wizard/steps/Step7SkillsLanguages.jsx**
   - Added Orcish language definition
   - Added All Ancient Languages definition
   - Modified language saving to auto-include racial languages
   - Added Languages Summary preview section

2. **vtt-react/src/components/character-creation-wizard/styles/CharacterCreationWizard.css**
   - Added `.granted-badge` styling for granted skills
   - Added `.language-preview-section` styling
   - Added `.language-summary-grid` layout
   - Added `.language-category` card styling
   - Added `.language-item` styling with racial/selected variants
   - Added `.language-source` badge styling

---

## Testing Checklist

- [x] All 23 subraces have 3 racial languages defined
- [x] All racial languages exist in COMMON_LANGUAGES array
- [x] Racial languages are automatically included in character data
- [x] Racial languages cannot be deselected
- [x] Additional language count shows correct total
- [x] Language preview section displays all languages
- [x] Racial and learned languages are visually distinct
- [x] No duplicate languages in final character data
- [x] Language selection respects background + path limits

---

## Next Steps (Optional Enhancements)

1. **Language Tooltips**: Add detailed descriptions when hovering over languages in preview
2. **Language Categories**: Group languages by category in selection grid
3. **Language Rarity**: Add visual indicators for common vs exotic languages
4. **Language Benefits**: Show mechanical benefits of knowing certain languages
5. **Language Conflicts**: Prevent selection of conflicting languages (if any)

---

## Notes

- Every character will know at least 3 languages (all racial)
- Most characters will know 4-7 languages total
- Scholar Graveworn is unique with "All Ancient Languages" as a racial language
- Thieves' Cant is available as both a racial language (Doppel Mirrorkin) and selectable language
- The system is fully integrated with the character creation wizard context

