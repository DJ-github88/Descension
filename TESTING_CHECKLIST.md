# Testing Checklist - Character Edit & Skills Preview

## Pre-Testing Setup

- [ ] Start development server (`npm start`)
- [ ] Navigate to `/account` page
- [ ] Ensure you have at least one existing character
- [ ] If no characters exist, create one first

## Test 1: Edit Mode - Basic Functionality

### 1.1 Opening Edit Mode
- [ ] Click "Edit" button on a character
- [ ] Wizard opens in new page
- [ ] Header shows "Edit Character" (not "Character Creation")
- [ ] Header status shows "Editing Character"
- [ ] All progress steps show as completed (green checkmarks)

### 1.2 Step 1 - Basic Info
- [ ] Character name is pre-filled
- [ ] Gender is pre-selected
- [ ] Character image appears (if one was set)
- [ ] Image transformations are applied correctly

### 1.3 Step 2 - Race Selection
- [ ] Race is pre-selected
- [ ] Subrace is pre-selected
- [ ] Racial bonuses are displayed
- [ ] Can change race and subrace

### 1.4 Step 3 - Class Selection
- [ ] Class is pre-selected
- [ ] Class description appears
- [ ] Can change class

### 1.5 Step 4 - Background Selection
- [ ] Background is pre-selected
- [ ] Background skills shown
- [ ] Can change background

### 1.6 Step 5 - Path Selection
- [ ] Path is pre-selected
- [ ] Path bonuses displayed
- [ ] Can change path

### 1.7 Step 6 - Stat Allocation
- [ ] All 6 stats show correct values
- [ ] Point buy allocation matches character
- [ ] Racial modifiers applied
- [ ] Final stats calculated correctly
- [ ] Can modify stats within point buy limits

### 1.8 Step 7 - Skills & Languages
- [ ] Selected skills are pre-checked
- [ ] Selected languages are pre-checked
- [ ] Background skills shown as granted
- [ ] Racial languages shown as granted
- [ ] Can change skill selections
- [ ] Can change language selections

### 1.9 Step 8 - Lore & Details
- [ ] Backstory is pre-filled
- [ ] Personality Traits pre-filled
- [ ] Ideals pre-filled
- [ ] Bonds pre-filled
- [ ] Flaws pre-filled
- [ ] Appearance pre-filled
- [ ] Goals pre-filled
- [ ] Fears pre-filled
- [ ] Allies pre-filled
- [ ] Enemies pre-filled
- [ ] Organizations pre-filled
- [ ] Notes pre-filled
- [ ] Can modify all fields

### 1.10 Step 9 - Equipment Selection
- [ ] Starting currency displayed
- [ ] Selected equipment shown (if any)
- [ ] Can modify equipment selections

### 1.11 Step 10 - Character Summary
- [ ] All character data summarized correctly
- [ ] Button shows "Update Character" (not "Create Character")

## Test 2: Skills Preview - Display

### 2.1 No Skills Selected
- [ ] Navigate to Step 7
- [ ] Deselect all skills
- [ ] No preview section appears
- [ ] Only skill selection grid visible

### 2.2 One Skill Selected
- [ ] Select "Weapon Mastery"
- [ ] Preview section appears below
- [ ] Skill card shows:
  - [ ] Skill icon (64x64)
  - [ ] Skill name "Weapon Mastery"
  - [ ] Skill description
  - [ ] Rank badge showing "Untrained" in gray

### 2.3 Quest Display
- [ ] "Starting Quests" section appears
- [ ] Shows 3 quests (or fewer if skill has less)
- [ ] Each quest shows:
  - [ ] Quest icon
  - [ ] Quest name
  - [ ] Quest description
  - [ ] Unlock rewards with icon

### 2.4 Rollable Table Display
- [ ] "Rollable Table" section appears
- [ ] Table name displayed
- [ ] Table description shown
- [ ] First 4 outcomes displayed
- [ ] Each outcome shows:
  - [ ] Roll range (e.g., "1-8")
  - [ ] Outcome description
  - [ ] Color-coded border (red/yellow/green/gold)
- [ ] If more than 4 outcomes, shows "... and X more outcomes"

### 2.5 Multiple Skills Selected
- [ ] Select a second skill (e.g., "Tactical Combat")
- [ ] Second skill card appears
- [ ] Both skills show their own quests
- [ ] Both skills show their own rollable tables
- [ ] Cards are stacked vertically

### 2.6 Skill Deselection
- [ ] Deselect one skill
- [ ] Its preview card disappears immediately
- [ ] Other skill's card remains
- [ ] No errors in console

## Test 3: Skills Preview - Styling

### 3.1 Skill Card Styling
- [ ] Pathfinder beige gradient background
- [ ] Gold border (2px solid #d4af37)
- [ ] Rounded corners (8px)
- [ ] Drop shadow visible
- [ ] Proper padding and spacing

### 3.2 Quest Item Styling
- [ ] Quest items have white/transparent background
- [ ] Gold border
- [ ] Hover effect: slides right slightly
- [ ] Hover effect: background lightens
- [ ] Quest icons have borders
- [ ] Unlock icon is gold colored

### 3.3 Rollable Table Styling
- [ ] Table entries have proper spacing
- [ ] Roll ranges have gold background badges
- [ ] Outcome types color-coded:
  - [ ] Failure: Red left border
  - [ ] Normal: Yellow left border
  - [ ] Success: Green left border
  - [ ] Critical: Gold left border
- [ ] Text is readable and properly sized

### 3.4 Responsive Design
- [ ] Resize browser window to mobile size
- [ ] Skill cards stack properly
- [ ] Icons scale appropriately
- [ ] Text remains readable
- [ ] No horizontal scrolling
- [ ] Touch-friendly spacing

## Test 4: Edit Mode - Saving Changes

### 4.1 Make Simple Change
- [ ] Change character name in Step 1
- [ ] Navigate to Step 10
- [ ] Click "Update Character"
- [ ] Loading spinner appears
- [ ] Success message shows
- [ ] Redirected to /account page
- [ ] Character name updated in list

### 4.2 Make Multiple Changes
- [ ] Edit character again
- [ ] Change name in Step 1
- [ ] Change a stat in Step 6
- [ ] Change a skill in Step 7
- [ ] Add lore text in Step 8
- [ ] Navigate to Step 10
- [ ] Click "Update Character"
- [ ] All changes saved correctly

### 4.3 Verify Persistence
- [ ] Close browser
- [ ] Reopen and navigate to /account
- [ ] Edit the same character
- [ ] All previous changes are still there
- [ ] No data loss

## Test 5: Edit Mode - Validation

### 5.1 Invalid Name
- [ ] Edit character
- [ ] Clear character name in Step 1
- [ ] Try to proceed to Step 2
- [ ] Validation error appears
- [ ] Cannot save character

### 5.2 Invalid Stats
- [ ] Navigate to Step 6
- [ ] Try to exceed point buy limit
- [ ] Validation prevents invalid allocation
- [ ] Error message shown

### 5.3 Missing Required Fields
- [ ] Try to save with missing required data
- [ ] Validation prevents save
- [ ] Error messages indicate what's missing

## Test 6: Edit Mode - Cancel/Exit

### 6.1 Cancel Button
- [ ] Make some changes
- [ ] Click "Cancel" button in footer
- [ ] Redirected to /account
- [ ] Changes are NOT saved
- [ ] Character data unchanged

### 6.2 Exit Button
- [ ] Edit character again
- [ ] Make some changes
- [ ] Click "Exit" button (← arrow) in header
- [ ] Redirected to /account
- [ ] Changes are NOT saved

## Test 7: Skills Preview - Different Skills

### 7.1 Combat Skills
- [ ] Select "Weapon Mastery"
- [ ] Verify combat-related quests appear
- [ ] Verify weapon-related rollable table
- [ ] Select "Tactical Combat"
- [ ] Verify different quests and table

### 7.2 Exploration Skills
- [ ] Select "Survival"
- [ ] Verify exploration quests
- [ ] Verify wilderness-themed table
- [ ] Select "Perception"
- [ ] Verify different content

### 7.3 Crafting Skills
- [ ] Select "Smithing"
- [ ] Verify crafting quests
- [ ] Verify smithing outcomes table
- [ ] Select "Alchemy"
- [ ] Verify potion-related content

### 7.4 Social Skills
- [ ] Select "Persuasion"
- [ ] Verify social interaction quests
- [ ] Verify diplomacy outcomes
- [ ] Select "Deception"
- [ ] Verify different social content

## Test 8: Edge Cases

### 8.1 Character with No Skills
- [ ] Create character without selecting skills
- [ ] Edit that character
- [ ] Step 7 shows no selected skills
- [ ] No preview section appears
- [ ] Can add skills normally

### 8.2 Character with Maximum Skills
- [ ] Edit character with 2 skills selected
- [ ] Try to select a third skill
- [ ] Selection is prevented (limit enforced)
- [ ] Preview shows only 2 skills

### 8.3 Character with No Lore
- [ ] Create character without filling lore
- [ ] Edit that character
- [ ] Step 8 shows empty lore fields
- [ ] Can add lore normally

### 8.4 Very Long Character Name
- [ ] Edit character
- [ ] Enter very long name (50+ characters)
- [ ] Validation limits to 50 characters
- [ ] Or truncates display appropriately

## Test 9: Browser Compatibility

### 9.1 Chrome
- [ ] All features work
- [ ] Styling correct
- [ ] No console errors

### 9.2 Firefox
- [ ] All features work
- [ ] Styling correct
- [ ] No console errors

### 9.3 Safari
- [ ] All features work
- [ ] Styling correct
- [ ] No console errors

### 9.4 Edge
- [ ] All features work
- [ ] Styling correct
- [ ] No console errors

## Test 10: Performance

### 10.1 Load Time
- [ ] Edit mode opens quickly (< 1 second)
- [ ] No noticeable lag when loading character data
- [ ] Step navigation is smooth

### 10.2 Skills Preview Rendering
- [ ] Preview appears instantly when skill selected
- [ ] No lag when selecting multiple skills
- [ ] Smooth animations and transitions

### 10.3 Save Performance
- [ ] Update saves quickly (< 2 seconds)
- [ ] No freezing or hanging
- [ ] Success message appears promptly

## Test 11: Console Checks

### 11.1 No Errors
- [ ] Open browser console (F12)
- [ ] Navigate through all wizard steps
- [ ] No red error messages
- [ ] No warnings about missing data

### 11.2 Logging
- [ ] Console shows "Loading existing character into wizard"
- [ ] Character data logged when loading
- [ ] No sensitive data exposed

## Test 12: Integration with Existing Features

### 12.1 View Character Page
- [ ] Edit and save character
- [ ] Navigate to View page for that character
- [ ] All changes reflected in View page
- [ ] Skills tab shows selected skills
- [ ] Stats tab shows updated stats

### 12.2 Character Selection
- [ ] Edit character
- [ ] Save changes
- [ ] Select character as active
- [ ] Join game session
- [ ] Character data correct in-game

## Bug Report Template

If you find issues, report them with:

```
**Issue**: [Brief description]
**Steps to Reproduce**:
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected**: [What should happen]
**Actual**: [What actually happened]
**Browser**: [Chrome/Firefox/Safari/Edge]
**Console Errors**: [Any error messages]
**Screenshots**: [If applicable]
```

## Success Criteria

All tests should pass with:
- ✓ No console errors
- ✓ All data loads correctly
- ✓ All changes save properly
- ✓ Skills preview displays correctly
- ✓ Styling matches Pathfinder theme
- ✓ Smooth user experience
- ✓ No data loss
- ✓ Backward compatibility maintained

