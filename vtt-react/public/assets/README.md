# Level Editor Assets

This directory contains PNG assets for the level editor's terrain, objects, and walls.

## Directory Structure

### `/terrain/`
Contains 8-16 bit pixel art style terrain tiles:
- `grass.png` - Grass terrain
- `stone.png` - Stone floor
- `dirt.png` - Dirt path
- `cobblestone.png` - Cobblestone road
- `sand.png` - Sand terrain
- `water.png` - Water tiles
- `mud.png` - Mud terrain
- `snow.png` - Snow terrain
- `lava.png` - Lava terrain
- `ice.png` - Ice terrain

### `/objects/`
Contains environmental objects and furniture:
- `tree.png` - Tree object
- `rock.png` - Rock object
- `chest.png` - Treasure chest
- `door.png` - Door object
- `table.png` - Table furniture
- `bed.png` - Bed furniture
- `pillar.png` - Stone pillar
- `barrel.png` - Barrel object
- `bookshelf.png` - Bookshelf furniture

### `/walls/`
Contains wall and barrier elements:
- `stone_wall.png` - Stone wall
- `wooden_wall.png` - Wooden wall
- `brick_wall.png` - Brick wall
- `metal_wall.png` - Metal wall
- `magical_barrier.png` - Magical barrier
- `force_wall.png` - Force wall

## Asset Requirements

- **Format**: PNG with transparency support
- **Style**: 8-16 bit pixel art aesthetic
- **Size**: Recommended 32x32 or 64x64 pixels
- **Transparency**: Use alpha channel for proper blending
- **Naming**: Use snake_case naming convention

## Usage

Assets are automatically loaded by the level editor when:
1. The `imageUrl` property is set in terrain/object/wall type definitions
2. The PNG file exists in the corresponding directory
3. The file follows the naming convention

If an asset fails to load, the system will fall back to:
- Color-based rendering for terrain
- Icon-based rendering for objects and walls

## Adding New Assets

1. Place PNG files in the appropriate directory
2. Update the corresponding type definitions in `levelEditorStore.js`
3. Add the `imageUrl` property pointing to `/assets/[category]/[filename].png`
4. Test in the level editor to ensure proper loading and rendering

## Performance Notes

- Keep file sizes reasonable (under 50KB per asset)
- Use appropriate compression for pixel art
- Consider using sprite sheets for related assets in future updates
