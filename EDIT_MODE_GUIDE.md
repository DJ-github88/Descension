# Character Edit Mode - Complete Guide

## Overview

When you click "Edit" on a character in your /account page, the character creation wizard now opens in **Edit Mode** with all 10 steps pre-filled with your existing character data.

## How to Access Edit Mode

### From Account Dashboard
1. Navigate to `/account`
2. Go to the "Characters" tab
3. Find the character you want to edit
4. Click the **"Edit"** button (pencil icon)
5. Wizard opens with all character data loaded

### From Character Management Page
1. Navigate to `/account/characters`
2. Find your character in the list
3. Click the **"Edit"** button
4. Wizard opens in edit mode

## What Gets Pre-Filled

### Step 1: Basic Information
- ✓ Character Name
- ✓ Gender Selection (Male/Female)
- ✓ Character Image (if uploaded)
- ✓ Image Transformations (scale, rotation, position)

### Step 2: Race Selection
- ✓ Selected Race (e.g., "Human", "Elf", "Dwarf")
- ✓ Selected Subrace (e.g., "High Elf", "Mountain Dwarf")
- ✓ Racial bonuses displayed

### Step 3: Class Selection
- ✓ Selected Class (e.g., "Fighter", "Wizard", "Rogue")
- ✓ Class description and features shown

### Step 4: Background Selection
- ✓ Selected Background (e.g., "Soldier", "Scholar", "Criminal")
- ✓ Background skills and features displayed

### Step 5: Path Selection
- ✓ Selected Path (e.g., "Mystic", "Zealot", "Warden")
- ✓ Path bonuses and starting points shown

### Step 6: Stat Allocation
- ✓ All 6 ability scores (Strength, Agility, Constitution, Intelligence, Spirit, Charisma)
- ✓ Point buy allocation preserved
- ✓ Racial modifiers applied
- ✓ Final stats calculated

### Step 7: Skills & Languages
- ✓ Selected Skills (e.g., "Athletics", "Perception")
- ✓ Selected Languages (e.g., "Common", "Elvish", "Draconic")
- ✓ Background-granted skills shown
- ✓ Racial languages displayed
- ✓ **NEW**: Quest and rollable table previews for selected skills

### Step 8: Lore & Details
- ✓ Backstory
- ✓ Personality Traits
- ✓ Ideals
- ✓ Bonds
- ✓ Flaws
- ✓ Appearance
- ✓ Goals
- ✓ Fears
- ✓ Allies
- ✓ Enemies
- ✓ Organizations
- ✓ Notes

### Step 9: Equipment Selection
- ✓ Starting Currency (Gold, Silver, Copper)
- ✓ Selected Equipment Items
- ✓ Remaining Currency
- ⚠️ Note: Inventory items from gameplay may not appear here (only starting equipment)

### Step 10: Character Summary
- ✓ Complete character overview
- ✓ All selections summarized
- ✓ Ready to update

## Visual Indicators

### Header Changes
```
┌─────────────────────────────────────────────────────────┐
│ ← [Exit]  Edit Character                                │
│           Allocate your character's stats                │
│                                                          │
│  [Progress Bar with all steps]                          │
│                                                          │
│                              Editing Character 👤        │
└─────────────────────────────────────────────────────────┘
```

### Footer Changes
```
┌─────────────────────────────────────────────────────────┐
│  [← Previous]     [Cancel]     [Update Character ✓]     │
└─────────────────────────────────────────────────────────┘
```

### Step Completion
- All steps show as "completed" (green checkmarks)
- You can navigate to any step freely
- No validation errors on load

## Making Changes

### Modifying Any Field
1. Navigate to the step you want to change
2. Make your modifications
3. Changes are tracked automatically
4. Navigate to other steps as needed
5. Click "Update Character" when done

### What You Can Change
- ✓ Character name
- ✓ Gender
- ✓ Character image and transformations
- ✓ Race and subrace
- ✓ Class
- ✓ Background
- ✓ Path
- ✓ Ability scores (stats)
- ✓ Skills and languages
- ✓ All lore fields
- ⚠️ Equipment (limited - see notes below)

### What You Cannot Change
- Character ID (internal identifier)
- Creation date
- Level (managed through gameplay)
- Experience (managed through gameplay)
- Actual inventory items (managed in-game)

## Important Notes

### Equipment Limitations
The equipment step shows **starting equipment** only. Items you've acquired during gameplay are managed through the in-game inventory system, not the character wizard.

**Starting Equipment** (shown in wizard):
- Items selected during character creation
- Starting currency allocation

**Gameplay Inventory** (not shown in wizard):
- Items looted from enemies
- Items purchased from shops
- Quest rewards
- Crafted items

To manage gameplay inventory, use the in-game character sheet.

### Stat Changes
When you change ability scores:
- Health and mana are recalculated based on Constitution and Spirit
- Skill modifiers update automatically
- Racial bonuses are reapplied
- Final stats are recalculated

### Skill Changes
If you change selected skills:
- ⚠️ Any quest progress on removed skills is preserved in the character data
- ⚠️ But you won't see it in the wizard
- Consider the impact before removing skills with progress

### Validation
- All validation rules still apply
- You must have valid selections in each step
- Point buy limits are enforced for stats
- Skill and language limits are enforced

## Saving Changes

### Update Process
1. Review all your changes across the 10 steps
2. Navigate to Step 10 (Character Summary)
3. Verify everything looks correct
4. Click **"Update Character"** button
5. Wait for confirmation message
6. Redirected to /account page

### What Happens on Save
```javascript
{
  // Existing character data is merged with changes
  ...existingCharacter,
  ...newCharacterData,
  updatedAt: new Date().toISOString()
}
```

### Success Message
```
┌─────────────────────────────────────────────────────────┐
│ ✓ [Character Name] has been updated successfully!       │
└─────────────────────────────────────────────────────────┘
```

### Error Handling
If save fails:
- Error message displayed at top of wizard
- Your changes are NOT lost
- You can try saving again
- Or cancel and return to account page

## Canceling Changes

### Cancel Button
- Available in footer on all steps
- Also available via "Exit" button in header
- Prompts for confirmation (future enhancement)

### What Happens on Cancel
1. All changes are discarded
2. Character data remains unchanged
3. Redirected to /account page
4. No confirmation message

## Comparison: Create vs Edit

| Feature | Create Mode | Edit Mode |
|---------|------------|-----------|
| Header Title | "Character Creation" | "Edit Character" |
| Header Status | "Creating Character" | "Editing Character" |
| Initial State | Empty fields | Pre-filled fields |
| Step Completion | None | All steps completed |
| Final Button | "Create Character" | "Update Character" |
| On Success | "created successfully" | "updated successfully" |
| Character ID | Generated new | Uses existing |
| Creation Date | Set to now | Preserved |
| Updated Date | Set to now | Set to now |

## Best Practices

### Before Editing
1. **Review Current Character**: Check your character in the View page first
2. **Note Important Details**: Remember what you want to change
3. **Consider Impact**: Think about how changes affect your character

### During Editing
1. **One Step at a Time**: Focus on one aspect of your character
2. **Use Preview Features**: Check skill previews in Step 7
3. **Verify Stats**: Ensure stat changes don't break your build
4. **Review Summary**: Always check Step 10 before saving

### After Editing
1. **Verify Changes**: Check the View page to confirm updates
2. **Test In-Game**: Make sure character works as expected
3. **Backup Important Characters**: Consider the backup system

## Troubleshooting

### Character Not Loading
**Problem**: Edit button opens wizard but fields are empty

**Solutions**:
- Refresh the /account page
- Try logging out and back in
- Check browser console for errors
- Verify character exists in Firebase

### Changes Not Saving
**Problem**: Click "Update Character" but changes don't persist

**Solutions**:
- Check for validation errors (red text)
- Ensure all required fields are filled
- Verify internet connection
- Check Firebase permissions
- Try again after a few seconds

### Lost Progress
**Problem**: Accidentally clicked Cancel

**Solutions**:
- Unfortunately, changes are lost
- Need to edit again
- Future: Add "Are you sure?" confirmation

### Stat Calculation Issues
**Problem**: Stats don't match expected values

**Solutions**:
- Remember racial bonuses are applied automatically
- Path bonuses are also applied
- Check point buy limits
- Verify you're within allowed ranges

## Future Enhancements

Planned improvements for edit mode:

1. **Change Tracking**
   - Highlight modified fields
   - Show "Unsaved changes" indicator
   - Confirm before canceling with changes

2. **Comparison View**
   - Side-by-side before/after
   - Highlight differences
   - Revert individual changes

3. **Skill Progress Preservation**
   - Show completed quests in Step 7
   - Warn before removing skills with progress
   - Option to keep progress even if skill removed

4. **Equipment Sync**
   - Better integration with gameplay inventory
   - Option to reset to starting equipment
   - Preview current equipped items

5. **Validation Improvements**
   - Real-time validation feedback
   - Detailed error messages
   - Suggestions for fixing issues

## Technical Details

### Data Flow
```
/account → Edit Button → CharacterCreationPage
  ↓
Load character from Firebase
  ↓
Pass to CharacterCreationWizard
  ↓
useEffect detects isEditing=true
  ↓
Dispatch loadCharacter action
  ↓
Reducer populates all wizard fields
  ↓
User makes changes
  ↓
Click "Update Character"
  ↓
Merge with existing data
  ↓
Save to Firebase
  ↓
Redirect to /account
```

### State Management
- Uses same wizard context as create mode
- LOAD_CHARACTER action populates state
- All subsequent changes use normal actions
- No special handling needed for updates

### Backward Compatibility
- Existing characters work perfectly
- No migration needed
- Old character data structure supported
- New fields added gracefully

