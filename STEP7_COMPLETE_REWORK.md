# Step 7 Skills & Languages - Complete Rework

## Summary

Completely redesigned the Skills & Languages step with a cleaner button-based layout and integrated the existing UnifiedTooltip system from the character sheet.

---

## Major Changes

### 1. **Replaced Custom Tooltip with UnifiedTooltip**
- Removed custom tooltip state and handlers
- Integrated `UnifiedTooltip` component from `vtt-react/src/components/common/UnifiedTooltip.jsx`
- Uses `useUnifiedTooltip` hook for consistent tooltip behavior across the app
- Tooltips now use the same parchment-themed styling as the character sheet

### 2. **Completely Reworked Layout**
- **Before**: Card-based layout with icons, names, and check marks in complex positioning
- **After**: Clean button-based grid layout with simple, readable buttons

### 3. **Removed Ugly Card CSS**
- Deleted all `.skill-card`, `.language-card`, `.skill-icon`, `.language-icon` CSS
- Removed complex positioning, gradients, and animations
- Simplified to clean button-based design

### 4. **New Button-Based Design**
- Simple rectangular buttons with icon, text, and check mark
- Auto-fill grid layout that adapts to container width
- Minimum button width of 180px
- Clean hover states and transitions
- Disabled state for unavailable options

---

## New Component Structure

### Skills Section
```jsx
<div className="selection-section">
    <div className="section-header">
        <h3><i className="fas fa-cogs"></i> Skill Proficiencies</h3>
        <div className="selection-info">
            <span className="complete/incomplete">X / Y Selected</span>
        </div>
    </div>
    
    {/* Background skills info banner */}
    <div className="granted-info">
        <i className="fas fa-gift"></i> From Background: Skill1, Skill2
    </div>

    {/* Button grid */}
    <div className="button-grid">
        <button className="selection-button [selected|granted|disabled]">
            <i className="fas fa-icon"></i>
            <span>Skill Name</span>
            <i className="fas fa-check check-icon"></i>
        </button>
    </div>
</div>
```

### Languages Section
```jsx
<div className="selection-section">
    <div className="section-header">
        <h3><i className="fas fa-language"></i> Languages</h3>
        <div className="selection-info">
            <span className="complete/incomplete">X / Y Selected</span>
        </div>
    </div>

    {/* Racial languages subsection */}
    <div className="granted-section">
        <div className="granted-header">
            <i className="fas fa-star"></i> Racial Languages
        </div>
        <div className="button-grid">
            {/* Granted language buttons */}
        </div>
    </div>

    {/* Additional languages subsection */}
    <div className="selectable-section">
        <div className="selectable-header">
            <i className="fas fa-book"></i> Additional Languages
            <span className="source-info">(X from background, Y from path)</span>
        </div>
        <div className="button-grid">
            {/* Selectable language buttons */}
        </div>
    </div>
</div>
```

---

## New CSS Classes

### Layout Classes
- `.skills-languages-container` - Main grid container (2 columns)
- `.selection-section` - Individual section wrapper
- `.section-header` - Header with title and selection count
- `.button-grid` - Auto-fill grid for buttons

### Header Classes
- `.section-header h3` - Section title with icon
- `.selection-info` - Selection counter display
- `.complete` / `.incomplete` - Color states for counter

### Info Banners
- `.granted-info` - Background skills info banner
- `.granted-header` - Subsection header for granted items
- `.selectable-header` - Subsection header for selectable items
- `.source-info` - Small text showing source of languages
- `.no-selection-info` - Message when no options available

### Button Classes
- `.selection-button` - Base button style
- `.selection-button.selected` - Selected state (golden background)
- `.selection-button.granted` - Granted/automatic state (brown background)
- `.selection-button:disabled` - Disabled state (faded)
- `.check-icon` - Check mark icon on selected/granted buttons

---

## Button Styling

### Base Button
```css
.selection-button {
    background: rgba(255, 255, 255, 0.95);
    border: 2px solid #d4af37;
    border-radius: 6px;
    padding: 0.75rem 1rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    min-height: 48px;
}
```

### States
- **Hover**: Light golden background, slight lift, shadow
- **Selected**: Golden background (#d4af37), darker border
- **Granted**: Brown background (#8b4513), brown border
- **Disabled**: 50% opacity, no hover effects

### Grid Layout
```css
.button-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 0.5rem;
}
```

---

## Tooltip Integration

### Using UnifiedTooltip Hook
```javascript
const {
    tooltipState,
    handleMouseEnter,
    handleMouseLeave,
    handleMouseMove
} = useUnifiedTooltip();
```

### Applying to Buttons
```jsx
<button
    onMouseEnter={handleMouseEnter(skill.description)}
    onMouseLeave={handleMouseLeave}
    onMouseMove={handleMouseMove}
>
    ...
</button>
```

### Rendering Tooltip
```jsx
<UnifiedTooltip
    content={tooltipState.content}
    title={tooltipState.title}
    icon={tooltipState.icon}
    isVisible={tooltipState.isVisible}
    position={tooltipState.position}
    variant={tooltipState.variant}
    delay={200}
/>
```

---

## Visual Improvements

### Before
- Large card-based layout with circular icons
- Complex positioning for check marks and labels
- "FROM BACKGROUND" text labels
- Cards didn't fit well in frame
- Inconsistent tooltip styling

### After
- Clean button-based grid layout
- Simple left-to-right flow: icon → text → check
- No text labels, just visual states
- Buttons auto-size to fit container
- Consistent parchment-themed tooltips

---

## Behavior

### Skills
1. **Background Skills**: Shown with brown styling, disabled, check icon
2. **Selectable Skills**: White background, clickable, shows check when selected
3. **Disabled Skills**: Faded, not clickable (when selection limit reached)

### Languages
1. **Racial Languages**: Separate section, brown styling, star icon, disabled
2. **Additional Languages**: Separate section, selectable, check icon when selected
3. **Racial languages excluded** from additional languages section (no duplicates)

### Tooltips
- Appear on hover with 200ms delay
- Follow mouse cursor
- Auto-position to stay on screen
- Parchment background with brown border
- Show detailed descriptions for all skills and languages

---

## Files Modified

### vtt-react/src/components/character-creation-wizard/steps/Step7SkillsLanguages.jsx
- Added `UnifiedTooltip` and `useUnifiedTooltip` imports
- Replaced custom tooltip state with `useUnifiedTooltip` hook
- Removed custom `handleMouseEnter` and `handleMouseLeave` functions
- Completely rewrote JSX with button-based layout
- Added `<UnifiedTooltip>` component at end of return
- Separated racial languages from selectable languages (no duplicates)

### vtt-react/src/components/character-creation-wizard/styles/CharacterCreationWizard.css
- Renamed `.skills-languages-layout` to `.skills-languages-container`
- Deleted all card-based CSS (200+ lines removed)
- Added new section header CSS
- Added new button grid CSS
- Added new selection button CSS with all states
- Removed custom tooltip CSS (using UnifiedTooltip instead)

---

## Testing Checklist

### Layout
- [ ] Skills and languages sections side-by-side
- [ ] Buttons auto-size to fill container width
- [ ] Grid adapts to different screen sizes
- [ ] Scrolling works if content exceeds container

### Skills
- [ ] Background skills show with brown styling
- [ ] Background skills are disabled (not clickable)
- [ ] Background skills show check icon
- [ ] Selectable skills are clickable
- [ ] Selected skills show golden background
- [ ] Selected skills show check icon
- [ ] Disabled skills are faded when limit reached
- [ ] Selection counter updates correctly
- [ ] Counter turns green when complete

### Languages
- [ ] Racial languages in separate section
- [ ] Racial languages show with brown styling
- [ ] Racial languages show star icon
- [ ] Racial languages are disabled
- [ ] Additional languages section shows selectable languages
- [ ] Racial languages NOT duplicated in additional section
- [ ] Selected languages show golden background
- [ ] Selected languages show check icon
- [ ] Selection counter updates correctly
- [ ] Source info shows correctly (background + path)

### Tooltips
- [ ] Hover over skill shows tooltip
- [ ] Hover over language shows tooltip
- [ ] Tooltip has parchment background
- [ ] Tooltip follows mouse cursor
- [ ] Tooltip stays on screen (auto-positioning)
- [ ] Tooltip shows after 200ms delay
- [ ] Tooltip disappears when mouse leaves
- [ ] Tooltip shows correct description for each skill/language

### Visual Polish
- [ ] Buttons have clean, readable design
- [ ] Hover effects are smooth
- [ ] Selected state is clearly visible
- [ ] Granted state is clearly different from selected
- [ ] Icons are properly aligned
- [ ] Text is readable and well-spaced
- [ ] Check icons appear on right side
- [ ] No layout shifts or jumps

---

## Conclusion

✅ **Removed ugly card-based layout**
✅ **Implemented clean button-based design**
✅ **Integrated UnifiedTooltip system**
✅ **Simplified CSS (removed 200+ lines)**
✅ **Improved readability and usability**
✅ **Consistent with app-wide tooltip styling**
✅ **Better responsive layout**
✅ **Cleaner visual hierarchy**

The Skills & Languages step now has a much cleaner, more professional appearance with a simple button-based layout and consistent tooltip behavior!

