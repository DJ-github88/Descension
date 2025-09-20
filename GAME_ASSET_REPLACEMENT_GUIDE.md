# 🎮 Game Asset Replacement Guide

This guide explains how to replace WoW icons and add custom game assets to your D&D platform.

## 📁 Asset Directory Structure

Your assets are organized in `vtt-react/public/assets/`:

```
assets/
├── icons/
│   ├── spells/          # Magic and spell icons
│   ├── items/           # Weapons, armor, consumables
│   ├── creatures/       # Monsters and NPCs
│   ├── abilities/       # Skills and abilities
│   └── ui/              # User interface icons
├── images/
│   ├── characters/      # Character portraits
│   ├── backgrounds/     # Scene backgrounds
│   └── textures/        # Material textures
├── objects/             # 3D objects for maps
└── tiles/               # Map terrain tiles
```

## 🖼️ Asset Requirements

### Icons (64x64px recommended)
- **Format**: PNG with alpha transparency
- **Size**: 64x64 pixels for main icons, 32x32 for small UI
- **Style**: Consistent art style across all icons
- **Naming**: `category_subcategory_name.png`

### Images (Variable sizes)
- **Format**: PNG or JPG
- **Character Portraits**: 256x256px or 512x512px
- **Backgrounds**: 1920x1080px or higher
- **Textures**: Power of 2 sizes (256x256, 512x512, etc.)

## 🔄 Replacement Process

### Step 1: Identify Current WoW Icons

Current WoW icon usage locations:
- **Spells**: `vtt-react/src/components/spellcrafting-wizard/`
- **Items**: `vtt-react/src/components/item-generation/`
- **Creatures**: `vtt-react/src/components/creature-wizard/`
- **UI Elements**: Various components

### Step 2: Create Custom Icons

1. **Design Guidelines**:
   - Use consistent color palette
   - Maintain clear silhouettes
   - Ensure readability at small sizes
   - Use appropriate contrast

2. **Recommended Tools**:
   - **Pixel Art**: Aseprite, Piskel, Photoshop
   - **Vector**: Illustrator, Inkscape, Figma
   - **AI Generation**: Midjourney, DALL-E, Stable Diffusion

3. **Icon Categories to Replace**:

#### Spell Icons (`/assets/icons/spells/`)
```
spell_fire_fireball.png
spell_ice_frostbolt.png
spell_healing_cure.png
spell_lightning_bolt.png
spell_earth_stone.png
spell_arcane_missile.png
```

#### Item Icons (`/assets/icons/items/`)
```
item_weapon_sword.png
item_weapon_bow.png
item_armor_helmet.png
item_armor_chestplate.png
item_consumable_potion.png
item_accessory_ring.png
```

#### Creature Icons (`/assets/icons/creatures/`)
```
creature_dragon_red.png
creature_goblin_warrior.png
creature_skeleton_archer.png
creature_orc_shaman.png
```

### Step 3: Implement Asset Manager

The new `assetManager.js` utility handles the transition:

```javascript
import { getIconUrl } from '../utils/assetManager';

// Old way (WoW icons)
const iconUrl = `https://wow.zamimg.com/images/wow/icons/large/${iconId}.jpg`;

// New way (custom icons with fallback)
const iconUrl = getIconUrl(iconId, 'spell', true);
```

### Step 4: Update Components Gradually

Replace WoW icon references in these files:

1. **Spell Icons**:
   - `vtt-react/src/components/spellcrafting-wizard/utils/iconUtils.js`
   - `vtt-react/src/components/spellcrafting-wizard/components/common/IconSelector.jsx`

2. **Item Icons**:
   - `vtt-react/src/components/item-generation/wowIcons.js`
   - `vtt-react/src/components/item-generation/ItemIconSelector.jsx`

3. **Creature Icons**:
   - `vtt-react/src/components/creature-wizard/components/common/CreatureIconSelector.jsx`

## 🎨 Asset Sources

### Free Resources
- **OpenGameArt.org**: Free game assets
- **Kenney.nl**: High-quality game assets
- **Itch.io**: Indie game asset packs
- **Freepik**: Icons and illustrations (attribution required)

### Paid Resources
- **Unity Asset Store**: Professional game assets
- **GameDev Market**: Curated game assets
- **Shutterstock**: Stock images and icons
- **Adobe Stock**: Professional assets

### AI Generation
- **Midjourney**: High-quality AI art
- **DALL-E 3**: OpenAI's image generator
- **Stable Diffusion**: Open-source AI art
- **Leonardo.ai**: Game-focused AI generation

## 🔧 Implementation Example

Here's how to replace a spell icon:

1. **Create the icon**: `spell_fire_fireball.png` (64x64px)
2. **Place in directory**: `vtt-react/public/assets/icons/spells/`
3. **Update component**:

```javascript
// Before
const iconUrl = `https://wow.zamimg.com/images/wow/icons/large/spell_fire_fireball.jpg`;

// After
import { getIconUrl } from '../utils/assetManager';
const iconUrl = getIconUrl('spell_fire_fireball', 'spell');
```

## 📋 Migration Checklist

- [ ] Create asset directory structure
- [ ] Design consistent art style guide
- [ ] Create fallback/placeholder icons
- [ ] Replace spell icons (highest priority)
- [ ] Replace item icons
- [ ] Replace creature icons
- [ ] Replace UI icons
- [ ] Add character portraits
- [ ] Add background images
- [ ] Test all icon loading
- [ ] Optimize asset file sizes
- [ ] Update documentation

## 🚀 Quick Start

1. **Add a few test icons** to `/assets/icons/spells/`
2. **Update one component** to use the new asset manager
3. **Test the fallback system** works properly
4. **Gradually replace more icons** as you create them

The system is designed to gracefully fall back to WoW icons if custom ones aren't available yet, so you can migrate gradually!
