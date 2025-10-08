# Character Edit & Skills Preview Implementation

## Overview
This implementation adds two major features to the character creation wizard:

1. **Edit Mode Support**: When clicking "Edit" on a character in the /account page, the wizard now pre-fills all 10 steps with the existing character data
2. **Skills Preview**: Step 7 (Skills & Languages) now displays quests and rollable tables for selected skills, matching the functionality from the in-game character sheet

## Changes Made

### 1. Character Wizard Context (`CharacterWizardContext.js`)

#### Added LOAD_CHARACTER Action
- New action type `LOAD_CHARACTER` to load existing character data
- Reducer case that populates all wizard fields from existing character:
  - Basic info (name, gender, image, transformations)
  - Race and subrace
  - Class and background
  - Skills and languages
  - Path selection
  - Stats (base and final)
  - Lore fields
  - Equipment and currency (if available)
- Marks all steps as completed when loading existing character

#### Added Action Creator
- `loadCharacter(character)` - dispatches LOAD_CHARACTER action with character data

### 2. Character Creation Wizard (`CharacterCreationWizard.jsx`)

#### Edit Mode Integration
- Added `useEffect` hook to load existing character data when `isEditing` is true
- Updated UI text to show "Edit Character" vs "Create Character"
- Changed button text to "Update Character" when editing
- Updated header status to show "Editing Character"

### 3. Step 7 - Skills & Languages (`Step7SkillsLanguages.jsx`)

#### Added Imports
- `SKILL_DEFINITIONS` - skill data with icons, descriptions, rollable tables
- `SKILL_QUESTS` - quest definitions for each skill
- `ROLLABLE_TABLES` - rollable table outcomes

#### New Helper Functions
- `getSkillRank(skillId)` - Returns skill rank (UNTRAINED for new characters)
- `getAvailableQuests(skillId)` - Gets first 3 quests for a skill
- `getCurrentRollableTable(skillId)` - Gets the rollable table for current rank

#### New UI Section: Selected Skills Preview
Displays for each selected skill:

**Skill Header**
- Skill icon (64x64)
- Skill name and description
- Rank badge (colored by rank)

**Starting Quests**
- Shows first 3 quests available for the skill
- Quest icon, name, description
- Unlock rewards listed

**Rollable Table**
- Table name and description
- First 4 outcomes with roll ranges (e.g., "1-8")
- Color-coded by outcome type (failure, normal, success, critical)
- Shows count of additional outcomes if more than 4

### 4. Styling (`CharacterCreationWizard.css`)

Added comprehensive styling for skill details section:

#### Skill Detail Cards
- Pathfinder beige gradient background
- Gold borders and shadows
- Proper spacing and layout

#### Quest Preview Items
- Hover effects with slide animation
- Quest icons with borders
- Unlock information with icons

#### Rollable Table Entries
- Color-coded borders (red=failure, yellow=normal, green=success, gold=critical)
- Roll range badges
- Outcome descriptions

## Data Flow

### Creating New Character
1. User clicks "Create Character" in /account
2. Wizard opens with empty state
3. User fills out all 10 steps
4. Clicks "Create Character" to save

### Editing Existing Character
1. User clicks "Edit" on character in /account
2. `CharacterCreationPage` loads character data
3. Passes `existingCharacter` and `isEditing={true}` to wizard
4. Wizard's `useEffect` dispatches `loadCharacter` action
5. All 10 steps populate with existing data
6. User can modify any step
7. Clicks "Update Character" to save changes

### Skills Preview Display
1. User selects skills in Step 7
2. Component maps over `selectedSkills` array
3. For each skill:
   - Finds matching skill definition
   - Retrieves quests and rollable table
   - Renders preview card with all information
4. Updates dynamically as skills are selected/deselected

## Character Data Mapping

The wizard properly maps character data from storage format to wizard format:

```javascript
{
  // Basic Info (Step 1)
  name: character.name,
  gender: character.gender,
  characterImage: character.lore?.characterImage,
  imageTransformations: character.lore?.imageTransformations,
  
  // Race (Step 2)
  race: character.race,
  subrace: character.subrace,
  
  // Class (Step 3)
  class: character.class,
  
  // Background (Step 4)
  background: character.background,
  
  // Path (Step 5)
  path: character.path,
  
  // Stats (Step 6)
  baseStats: character.stats,
  finalStats: character.stats,
  
  // Skills & Languages (Step 7)
  selectedSkills: character.selectedSkills,
  selectedLanguages: character.selectedLanguages,
  
  // Lore (Step 8)
  lore: character.lore,
  
  // Equipment (Step 9)
  startingCurrency: character.inventory?.currency,
  selectedEquipment: character.inventory?.items,
  remainingCurrency: character.inventory?.currency
}
```

## Testing Recommendations

1. **Edit Existing Character**
   - Create a character with all fields filled
   - Click "Edit" in /account
   - Verify all 10 steps show existing data
   - Modify some fields
   - Save and verify changes persist

2. **Skills Preview**
   - In Step 7, select different skills
   - Verify quests and rollable tables appear
   - Check that different skills show different content
   - Verify styling matches Pathfinder theme

3. **Create New Character**
   - Verify wizard still works for new characters
   - Ensure no pre-filled data appears
   - Complete all steps and create character

## Future Enhancements

Potential improvements for future iterations:

1. **Skill Progress in Edit Mode**
   - Load actual skill progress (completed quests) from character
   - Show which quests are already completed
   - Allow toggling quest completion in wizard

2. **Equipment Preview**
   - Show selected equipment items in Step 9
   - Display equipped items vs inventory items

3. **Validation Improvements**
   - Warn if removing skills that have progress
   - Validate stat changes don't break character

4. **Undo/Redo**
   - Add ability to revert changes while editing
   - Compare with original character data

## Files Modified

1. `vtt-react/src/components/character-creation-wizard/context/CharacterWizardContext.js`
2. `vtt-react/src/components/character-creation-wizard/CharacterCreationWizard.jsx`
3. `vtt-react/src/components/character-creation-wizard/steps/Step7SkillsLanguages.jsx`
4. `vtt-react/src/components/character-creation-wizard/styles/CharacterCreationWizard.css`

## No Breaking Changes

All changes are backward compatible:
- Existing character creation flow unchanged
- New edit mode is opt-in via `isEditing` prop
- Skills preview only shows when skills are selected
- All existing functionality preserved

