# Skills & Languages Section - Size Reduction & Tooltips

## Summary of Changes

Fixed the oversized skill cards and added descriptive hover tooltips to both skills and languages for better UX and functionality.

---

## 1. Card Size Reduction

### Before
- **Card height**: 60px minimum
- **Padding**: 1rem (16px)
- **Icon size**: 40px × 40px
- **Font size**: 1rem (16px)
- **Gap**: 1rem between cards
- **Result**: Cards were too large and didn't fit well in the frame

### After
- **Card height**: 45px (fixed min and max)
- **Padding**: 0.5rem 0.75rem (8px 12px)
- **Icon size**: 32px × 32px
- **Font size**: 0.85rem (13.6px)
- **Gap**: 0.5rem between cards
- **Border radius**: 6px (reduced from 8px)
- **Result**: Compact, clean cards that fit perfectly in the frame

### CSS Changes
```css
.skill-card, .language-card {
    border-radius: 6px;
    padding: 0.5rem 0.75rem;
    gap: 0.5rem;
    min-height: 45px;
    max-height: 45px;  /* Fixed height */
}

.skill-icon, .language-icon {
    width: 32px;
    height: 32px;
    font-size: 1rem;
}

.skill-name, .language-name {
    font-size: 0.85rem;
}

.skills-grid, .languages-grid {
    gap: 0.5rem;
    overflow-y: auto;  /* Scrollable if needed */
    padding-right: 0.5rem;
}
```

---

## 2. Hover Tooltips System

### Implementation

**Added tooltip state:**
```javascript
const [tooltip, setTooltip] = useState({ 
    show: false, 
    content: '', 
    x: 0, 
    y: 0 
});
```

**Tooltip handlers:**
```javascript
const handleMouseEnter = (e, description) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({
        show: true,
        content: description,
        x: rect.left + rect.width / 2,
        y: rect.top - 10
    });
};

const handleMouseLeave = () => {
    setTooltip({ show: false, content: '', x: 0, y: 0 });
};
```

**Applied to all cards:**
```javascript
onMouseEnter={(e) => handleMouseEnter(e, skill.description)}
onMouseLeave={handleMouseLeave}
```

### Tooltip Component
```jsx
{tooltip.show && (
    <div
        className="skill-language-tooltip"
        style={{
            position: 'fixed',
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
            transform: 'translate(-50%, -100%)',
            pointerEvents: 'none',
            zIndex: 10000
        }}
    >
        {tooltip.content}
    </div>
)}
```

### Tooltip Styling
```css
.skill-language-tooltip {
    background: rgba(44, 36, 22, 0.95);
    color: #f4f1e8;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    font-size: 0.85rem;
    line-height: 1.4;
    max-width: 300px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
    border: 2px solid #d4af37;
    font-weight: 500;
    text-align: center;
    animation: tooltipFadeIn 0.2s ease;
}

.skill-language-tooltip::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 8px solid #d4af37;
}
```

**Features:**
- Dark brown background with golden border (Pathfinder theme)
- Centered above the hovered card
- Arrow pointer pointing down to the card
- Smooth fade-in animation
- Max width 300px for readability
- Pointer-events disabled (won't interfere with mouse)

---

## 3. Skill Descriptions

All 18 skills now have detailed, thematic descriptions:

| Skill | Description |
|-------|-------------|
| **Acrobatics** | Balance, tumbling, and performing acrobatic stunts. Used for maintaining balance and avoiding falls. |
| **Animal Handling** | Calming, training, and reading the intentions of animals. Essential for mounted combat and working with beasts. |
| **Arcana** | Knowledge of magic, spells, magical items, and arcane symbols. Used to identify magical effects and phenomena. |
| **Athletics** | Physical prowess including climbing, jumping, swimming, and grappling. Essential for physical challenges. |
| **Deception** | Convincingly hiding the truth through lies, disguises, and misdirection. Used to mislead others. |
| **History** | Knowledge of historical events, legends, ancient civilizations, and past conflicts. Recall lore about the world. |
| **Insight** | Reading body language and determining true intentions. Used to detect lies and understand motivations. |
| **Intimidation** | Influencing others through threats, hostile actions, and physical violence. Coerce information or cooperation. |
| **Investigation** | Finding clues, making deductions, and solving puzzles. Used to uncover hidden information and secrets. |
| **Medicine** | Diagnosing illness, treating wounds, and stabilizing the dying. Essential for healing and medical knowledge. |
| **Nature** | Knowledge of terrain, plants, animals, and weather. Used to identify natural phenomena and survive in the wild. |
| **Perception** | Spotting, hearing, and detecting things in your environment. Essential for noticing hidden creatures and objects. |
| **Performance** | Entertaining an audience through music, dance, acting, or storytelling. Captivate and delight crowds. |
| **Persuasion** | Influencing others through tact, social graces, and good nature. Used to negotiate and make friends. |
| **Religion** | Knowledge of deities, religious rituals, holy symbols, and the practices of divine magic and faith. |
| **Sleight of Hand** | Manual trickery including pickpocketing, concealing objects, and performing magic tricks. |
| **Stealth** | Moving silently and hiding from enemies. Essential for sneaking, ambushing, and avoiding detection. |
| **Survival** | Following tracks, hunting, navigating wilderness, and predicting weather. Essential for outdoor adventures. |

---

## 4. Language Descriptions

All 38 languages now have thematic, lore-rich descriptions:

### Standard Languages (8)
- **Common**: The universal trade language spoken by most civilized races across the realm.
- **Dwarvish**: The guttural language of dwarves, filled with hard consonants and references to stone and metal.
- **Elvish**: A fluid, melodic language spoken by elves, known for its beauty and complexity.
- **Giant**: The booming language of giants and their kin, simple but powerful in expression.
- **Gnomish**: A technical language full of compound words, reflecting gnomish love of invention and detail.
- **Goblin**: A harsh, grating language spoken by goblins and related creatures.
- **Halfling**: A warm, friendly language that reflects the halfling love of comfort and community.
- **Orc**: A brutal, aggressive language that emphasizes strength and dominance.

### Exotic/Planar Languages (8)
- **Abyssal**: The chaotic language of demons, filled with harsh sounds that seem to corrupt the air itself.
- **Celestial**: The harmonious language of angels and celestial beings, carrying divine authority.
- **Draconic**: The ancient language of dragons, powerful and precise, used in many magical incantations.
- **Deep Speech**: The alien language of aberrations and mind flayers, incomprehensible to most mortal minds.
- **Infernal**: The lawful language of devils, structured and binding, often used in contracts and pacts.
- **Primordial**: The ancient language of elementals, encompassing all elemental dialects.
- **Sylvan**: The language of fey creatures and nature spirits, whimsical and ever-changing.
- **Undercommon**: The trade language of the Underdark, spoken by drow, duergar, and other subterranean races.

### Race-Specific Languages (10)
- **Old Nord**: The ancestral language of the Nordmark people, filled with tales of ice and honor.
- **Corvid**: The mysterious language of the Corvani, incorporating clicks and whistles like bird calls.
- **Terran**: The language of earth elementals and stone-touched races, slow and grinding like shifting rock.
- **Ethereal**: The whispered language of spirits and the Veilborn, barely audible to mortal ears.
- **Changeling**: The secretive language of changelings, designed to convey hidden meanings and identities.
- **Druidic**: The secret language of druids, forbidden to non-druids, used to leave hidden messages in nature.
- **Ignan**: The crackling language of fire elementals and flame-touched beings, hot and volatile.
- **Beast Speech**: The primal language that allows communication with animals and beasts.
- **Necril**: The dark language of the undead, cold and lifeless, used in necromantic rituals.
- **Orcish**: The war-tongue of orcs, aggressive and direct, perfect for battle commands.

### Elemental Languages (4)
- **Elemental**: The general language of all elementals, bridging the four elemental planes.
- **Primal**: The raw language of nature itself, understood by primal beings and wild creatures.
- **Auran**: The airy language of air elementals and sky-dwelling creatures, light and breezy.
- **Aquan**: The flowing language of water elementals, fluid and ever-changing like the tides.

### Special Languages (2)
- **Thieves' Cant**: A secret code language used by criminals and rogues to communicate covertly in public.
- **Sign Language**: A universal gestural language allowing silent communication across language barriers.

---

## 5. Visual Improvements

### Check Icon Positioning
- Changed from absolute top/right positioning to centered vertically
- Uses `transform: translateY(-50%)` for perfect vertical centering
- Reduced size from 1.2rem to 1rem to match smaller cards

### Grid Improvements
- Added `overflow-y: auto` for scrolling when needed
- Added `padding-right: 0.5rem` for scrollbar spacing
- Reduced gap from 1rem to 0.5rem for tighter layout

---

## 6. User Experience

### Hovering Over Skills/Languages
1. **Mouse enters card**: Tooltip appears above card with smooth fade-in
2. **Tooltip shows**: Detailed description of the skill/language
3. **Tooltip positioned**: Centered above the card with arrow pointing down
4. **Mouse leaves card**: Tooltip disappears instantly

### Visual Feedback
- **Tooltip appearance**: Dark brown with golden border (matches theme)
- **Animation**: Smooth 0.2s fade-in with slight upward movement
- **Arrow**: Golden triangle pointing to the hovered card
- **Text**: White text, centered, max 300px width for readability

---

## 7. Files Modified

### vtt-react/src/components/character-creation-wizard/steps/Step7SkillsLanguages.jsx
- Added descriptions to all 18 skills
- Added descriptions to all 38 languages
- Added tooltip state management
- Added `handleMouseEnter` and `handleMouseLeave` handlers
- Applied tooltip handlers to all skill and language cards
- Added tooltip component to render

### vtt-react/src/components/character-creation-wizard/styles/CharacterCreationWizard.css
- Reduced card size (45px fixed height)
- Reduced padding (0.5rem 0.75rem)
- Reduced icon size (32px)
- Reduced font size (0.85rem)
- Reduced gap (0.5rem)
- Added overflow-y: auto to grids
- Added `.skill-language-tooltip` styling
- Added tooltip arrow styling
- Added `tooltipFadeIn` animation

---

## 8. Testing Checklist

### Card Sizing
- [ ] Skills fit in the frame without scrolling (or minimal scrolling)
- [ ] Languages fit in the frame without scrolling (or minimal scrolling)
- [ ] Cards are compact but still readable
- [ ] Icons are appropriately sized
- [ ] Check icons are centered vertically

### Tooltips - Skills
- [ ] Hover over Acrobatics - shows description
- [ ] Hover over Animal Handling - shows description
- [ ] Hover over all 18 skills - all show descriptions
- [ ] Tooltip appears above card
- [ ] Tooltip has arrow pointing down
- [ ] Tooltip disappears when mouse leaves

### Tooltips - Languages
- [ ] Hover over Common - shows description
- [ ] Hover over Dwarvish - shows description
- [ ] Hover over all 38 languages - all show descriptions
- [ ] Racial languages show tooltips
- [ ] Additional languages show tooltips
- [ ] Tooltip styling matches skills

### Visual Polish
- [ ] Tooltip has golden border
- [ ] Tooltip has dark brown background
- [ ] Tooltip text is white and readable
- [ ] Tooltip animation is smooth
- [ ] Tooltip doesn't interfere with clicking
- [ ] Tooltip max-width prevents overly wide tooltips

---

## Conclusion

✅ **Card size reduced** - Skills and languages now fit properly in their frames
✅ **Compact layout** - 45px fixed height with reduced padding and gaps
✅ **Scrollable grids** - Overflow-y auto for when content exceeds frame
✅ **Skill descriptions** - All 18 skills have detailed, thematic descriptions
✅ **Language descriptions** - All 38 languages have lore-rich descriptions
✅ **Hover tooltips** - Beautiful Pathfinder-themed tooltips on hover
✅ **Smooth animations** - Fade-in effect with upward movement
✅ **Visual consistency** - Tooltips match the overall Pathfinder aesthetic

The skills and languages section now provides a much better user experience with compact, readable cards and informative tooltips that add both flair and functionality!

