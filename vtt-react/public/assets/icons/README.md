# Game Icons Directory

This directory contains custom game icons to replace WoW icons.

## Directory Structure

### `/spells/`
Contains spell and magic icons:
- Format: PNG with transparency
- Size: 64x64 pixels recommended
- Naming: `spell_[category]_[name].png`
- Examples: `spell_fire_fireball.png`, `spell_healing_cure.png`

### `/items/`
Contains item icons for weapons, armor, consumables:
- Format: PNG with transparency  
- Size: 64x64 pixels recommended
- Naming: `item_[category]_[name].png`
- Examples: `item_weapon_sword.png`, `item_armor_helmet.png`

### `/creatures/`
Contains creature and monster icons:
- Format: PNG with transparency
- Size: 64x64 pixels recommended  
- Naming: `creature_[type]_[name].png`
- Examples: `creature_dragon_red.png`, `creature_goblin_warrior.png`

### `/abilities/`
Contains ability and skill icons:
- Format: PNG with transparency
- Size: 64x64 pixels recommended
- Naming: `ability_[category]_[name].png`
- Examples: `ability_combat_slash.png`, `ability_magic_shield.png`

### `/ui/`
Contains user interface icons:
- Format: PNG with transparency
- Size: 32x32 or 64x64 pixels
- Naming: `ui_[element]_[name].png`
- Examples: `ui_button_close.png`, `ui_icon_settings.png`

## Asset Requirements

- **Format**: PNG with alpha transparency
- **Style**: Consistent art style (pixel art, hand-drawn, etc.)
- **Size**: 64x64 pixels for icons, 32x32 for small UI elements
- **Transparency**: Use alpha channel for proper blending
- **Naming**: Use snake_case naming convention
- **Quality**: High contrast, clear at small sizes

## Implementation

To use custom icons instead of WoW icons:

1. Place PNG files in appropriate directories
2. Update icon references in code from WoW URLs to local paths
3. Use fallback system for missing icons

Example code change:
```javascript
// Old WoW icon
const iconUrl = `https://wow.zamimg.com/images/wow/icons/large/${iconId}.jpg`;

// New custom icon
const iconUrl = `/assets/icons/spells/${iconId}.png`;
```
