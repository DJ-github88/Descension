import React, { useRef, useEffect, useCallback, useState, useMemo } from 'react';
import ReactDOM from 'react-dom';
import useLevelEditorStore from '../../../store/levelEditorStore';
import useGameStore from '../../../store/gameStore';
import useMapStore from '../../../store/mapStore';
import useChatStore from '../../../store/chatStore';
import { getGridSystem } from '../../../utils/InfiniteGridSystem';
import { getTileElevation } from '../../../utils/ElevationUtils';
import { getObjectScreenBounds, getObjectSelectionHandles } from '../../../utils/ObjectSelectionBounds';
import { isWorldPointOccluded } from '../../../utils/WallOcclusion';
import { isPointInPolygon } from '../../../utils/VisibilityCalculations';
import UnifiedContextMenu from '../UnifiedContextMenu';
import UnlockContainerModal from '../../item-generation/UnlockContainerModal';
import LockSettingsModal from '../../item-generation/LockSettingsModal';
import { drawObject, hasObjectArt } from './ObjectCanvasRenderer';
import { drawObjectArt } from './PixelArtRenderer';
import { resolveWallMountDragPatch } from './wallAttachment';

export const snapRotationForHitTest = (type, rotation) => {
    // Snap rotation to the nearest 90- for any object that has a sprite.
    // Pure canvas-only objects (like GM Notes) get free rotation.
    const def = PROFESSIONAL_OBJECTS[type];
    if (!def || !def.image) return rotation || 0;
    const norm = ((rotation % 360) + 360) % 360;
    return Math.round(norm / 90) * 90;
};

// Image cache: URL -> HTMLImageElement. Shared with thumbnails and on-map
// rendering so a single Image is loaded per sprite and reused.
const spriteImageCache = new Map();
// Cache-buster so the dev server / browser doesn't return a stale 404 from
// before the sprite files were copied into public/assets/objects/.
const SPRITE_CACHE_BUST = `?v=${Date.now()}`;
const getSpriteImage = (url) => {
    if (!url) return null;
    if (spriteImageCache.has(url)) return spriteImageCache.get(url);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
        // Trigger a re-render so on-map objects appear the moment they load.
        if (typeof window !== 'undefined' && window.__vttObjectSystemRefresh) {
            window.__vttObjectSystemRefresh();
        }
    };
    img.onerror = () => {
        // If the image fails to load, remove from cache so a future call
        // retries (in case the user copies the file in later).
        spriteImageCache.delete(url);
        if (typeof window !== 'undefined' && window.__vttObjectSystemRefresh) {
            window.__vttObjectSystemRefresh();
        }
    };
    img.src = url + SPRITE_CACHE_BUST;
    spriteImageCache.set(url, img);
    return img;
};

const globalObjectImageCache = new Map();

export const getObjectImageCache = () => globalObjectImageCache;

// Professional object types for VTT
// Sprite names are taken from the Dungeon Crawl 32x32 tileset by
// MedicineStorm (CC0, 3000+ tiles). https://opengameart.org/content/dungeon-crawl-32x32-tiles
// Each entry maps a sprite basename to a category, size, and metadata.
const SPRITE = (name) => `/assets/objects/${name}.png`;

export const PROFESSIONAL_OBJECTS = {
    // ===== 3D Structures & Architecture =====
    wall_doorway: {
        id: 'wall_doorway',
        name: '3D Wooden Door',
        image: null,
        category: 'structures',
        size: { width: 1, height: 1 },
        description: 'Interactive 3D swinging wooden door with stone archway',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: true, is3D: true,
        blocksLineOfSight: true
    },
    pillar_stone: {
        id: 'pillar_stone',
        name: '3D Square Pillar',
        image: null,
        category: 'structures',
        size: { width: 1, height: 1 },
        description: 'Square carved dungeon stone support pillar',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: false, is3D: true,
        blocksLineOfSight: true
    },
    column_stone: {
        id: 'column_stone',
        name: '3D Round Column',
        image: null,
        category: 'structures',
        size: { width: 1, height: 1 },
        description: 'Classical round masonry column pillar',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: false, is3D: true,
        blocksLineOfSight: true
    },
    barrier_wood: {
        id: 'barrier_wood',
        name: '3D Wooden Barrier',
        image: null,
        category: 'structures',
        size: { width: 1, height: 1 },
        description: 'Sturdy wooden palisade barrier fence',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: false, is3D: true,
        blocksLineOfSight: false
    },
    barrier_corner: {
        id: 'barrier_corner',
        name: '3D Barrier Corner',
        image: null,
        category: 'structures',
        size: { width: 1, height: 1 },
        description: 'Corner piece for wooden barrier fence',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: false, is3D: true,
        blocksLineOfSight: false
    },
    barrier_column: {
        id: 'barrier_column',
        name: '3D Fence Post',
        image: null,
        category: 'structures',
        size: { width: 1, height: 1 },
        description: 'Wooden barrier fence post',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: false, is3D: true,
        blocksLineOfSight: false
    },
    barrier_half: {
        id: 'barrier_half',
        name: '3D Low Wooden Barrier',
        image: null,
        category: 'structures',
        size: { width: 1, height: 1 },
        description: 'Low wooden barricade railing',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: false, is3D: true,
        blocksLineOfSight: false
    },
    barrier_post_half: {
        id: 'barrier_post_half',
        name: '3D Low Post',
        image: null,
        category: 'structures',
        size: { width: 1, height: 1 },
        description: 'Half-height wooden barrier post',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: false, is3D: true,
        blocksLineOfSight: false
    },
    pillar_decorated: {
        id: 'pillar_decorated',
        name: '3D Ornate Stone Pillar',
        image: null,
        category: 'structures',
        size: { width: 1, height: 1 },
        description: 'Decorated carved stone support pillar',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: false, is3D: true,
        blocksLineOfSight: true
    },
    wall_doorway_sides: {
        id: 'wall_doorway_sides',
        name: '3D Winged Doorway',
        image: null,
        category: 'structures',
        size: { width: 2, height: 1 },
        description: 'Stone doorway framed by arched masonry side wings',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: true, is3D: true,
        blocksLineOfSight: true
    },
    wall_sloped: {
        id: 'wall_sloped',
        name: '3D Sloped Wall',
        image: null,
        category: 'structures',
        size: { width: 1, height: 1 },
        description: 'Angled sloped stone ramp wall',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: false, is3D: true,
        blocksLineOfSight: true
    },
    wall_half_endcap: {
        id: 'wall_half_endcap',
        name: '3D Half Wall Cap',
        image: null,
        category: 'structures',
        size: { width: 1, height: 1 },
        description: 'Finished end terminal for low stone half-walls',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: false, is3D: true,
        blocksLineOfSight: false
    },
    stairs_stone: {
        id: 'stairs_stone',
        name: '3D Stone Stairs',
        image: null,
        category: 'structures',
        size: { width: 1, height: 1 },
        description: 'Carved dungeon stone steps leading upward',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: false, is3D: true,
        blocksLineOfSight: false
    },
    stairs_narrow: {
        id: 'stairs_narrow',
        name: '3D Narrow Steps',
        image: null,
        category: 'structures',
        size: { width: 1, height: 1 },
        description: 'Narrow stone stairway passage',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: false, is3D: true,
        blocksLineOfSight: false
    },
    stairs_wide: {
        id: 'stairs_wide',
        name: '3D Grand Stairs',
        image: null,
        category: 'structures',
        size: { width: 2, height: 1 },
        description: 'Grand wide stone stairs for throne rooms and courtyards',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: false, is3D: true,
        blocksLineOfSight: false
    },
    stairs_wood: {
        id: 'stairs_wood',
        name: '3D Wooden Stairs',
        image: null,
        category: 'structures',
        size: { width: 1, height: 1 },
        description: 'Timber tavern steps',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: false, is3D: true,
        blocksLineOfSight: false
    },
    stairs_walled: {
        id: 'stairs_walled',
        name: '3D Walled Stairs',
        image: null,
        category: 'structures',
        size: { width: 1, height: 1 },
        description: 'Enclosed stone stairway flanked by protective masonry walls',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: false, is3D: true,
        blocksLineOfSight: true
    },

    // ===== 3D Furniture & Interior =====
    table_long: {
        id: 'table_long',
        name: '3D Long Table',
        image: null,
        category: 'furniture',
        size: { width: 2, height: 1 },
        description: 'Long wooden banquet table',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: false, is3D: true,
        blocksLineOfSight: false
    },
    table_medium: {
        id: 'table_medium',
        name: '3D Dining Table',
        image: null,
        category: 'furniture',
        size: { width: 1, height: 1 },
        description: 'Medium wooden dining table',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: false, is3D: true,
        blocksLineOfSight: false
    },
    table_small: {
        id: 'table_small',
        name: '3D Small Table',
        image: null,
        category: 'furniture',
        size: { width: 1, height: 1 },
        description: 'Small side table',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: false, is3D: true,
        blocksLineOfSight: false
    },
    table_feast: {
        id: 'table_feast',
        name: '3D Feast Table',
        image: null,
        category: 'furniture',
        size: { width: 2, height: 1 },
        description: 'Feast banquet table loaded with food and drink',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: false, is3D: true,
        blocksLineOfSight: false
    },
    table_long_broken: {
        id: 'table_long_broken',
        name: '3D Ruined Banquet Table',
        image: null,
        category: 'furniture',
        size: { width: 2, height: 1 },
        description: 'Broken, splintered long wooden table',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: false, is3D: true,
        blocksLineOfSight: false
    },
    table_long_tablecloth: {
        id: 'table_long_tablecloth',
        name: '3D Tablecloth Banquet Table',
        image: null,
        category: 'furniture',
        size: { width: 2, height: 1 },
        description: 'Long dining table draped in fine tablecloth',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: false, is3D: true,
        blocksLineOfSight: false
    },
    table_medium_tablecloth: {
        id: 'table_medium_tablecloth',
        name: '3D Tablecloth Dining Table',
        image: null,
        category: 'furniture',
        size: { width: 1, height: 1 },
        description: 'Dining table with cloth covering',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: false, is3D: true,
        blocksLineOfSight: false
    },
    table_small_decorated: {
        id: 'table_small_decorated',
        name: '3D Decorated Small Table',
        image: null,
        category: 'furniture',
        size: { width: 1, height: 1 },
        description: 'Small side table with candles and tavern cup',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: false, is3D: true,
        blocksLineOfSight: false
    },
    bed_floor: {
        id: 'bed_floor',
        name: '3D Dungeon Bedroll',
        image: null,
        category: 'furniture',
        size: { width: 1, height: 1.5 },
        description: 'Straw and cloth bedroll on stone floor',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: false, is3D: true,
        blocksLineOfSight: false
    },
    chair: {
        id: 'chair',
        name: '3D Wooden Chair',
        image: null,
        category: 'furniture',
        size: { width: 1, height: 1 },
        description: 'Wooden dining chair',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: false, is3D: true,
        blocksLineOfSight: false
    },
    stool: {
        id: 'stool',
        name: '3D Wooden Stool',
        image: null,
        category: 'furniture',
        size: { width: 1, height: 1 },
        description: 'Simple round wooden stool',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: false, is3D: true,
        blocksLineOfSight: false
    },
    bed_frame: {
        id: 'bed_frame',
        name: '3D Wooden Bed Frame',
        image: null,
        category: 'furniture',
        size: { width: 1, height: 2 },
        description: 'Unmade wooden bed frame',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: false, is3D: true,
        wallSideSnap: true,
        blocksLineOfSight: false
    },
    bed_decorated: {
        id: 'bed_decorated',
        name: '3D Made Bed',
        image: null,
        category: 'furniture',
        size: { width: 1, height: 2 },
        description: 'Wooden bed with blankets and pillow',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: false, is3D: true,
        wallSideSnap: true,
        blocksLineOfSight: false
    },
    bookshelf_large: {
        id: 'bookshelf_large',
        name: '3D Large Bookshelf',
        image: null,
        category: 'furniture',
        size: { width: 1, height: 1 },
        description: 'Large wooden library bookshelf',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: false, is3D: true,
        wallSideSnap: true,
        blocksLineOfSight: true
    },
    shelves: {
        id: 'shelves',
        name: '3D Wall Shelves',
        image: null,
        category: 'furniture',
        size: { width: 1, height: 1 },
        description: 'Wooden wall shelving unit',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: false, is3D: true,
        wallMountable: true, wallMountElevation: 1.0,
        blocksLineOfSight: false
    },
    shelf_candles: {
        id: 'shelf_candles',
        name: '3D Candle Shelf',
        image: null,
        category: 'furniture',
        size: { width: 1, height: 1 },
        description: 'Wall shelf with burning candles',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: false, is3D: true,
        wallMountable: true, wallMountElevation: 1.2,
        blocksLineOfSight: false
    },

    // ===== 3D Nature & Environment =====
    tree_pine: {
        id: 'tree_pine',
        name: '3D Pine Tree',
        image: null,
        category: 'nature',
        size: { width: 1, height: 1 },
        description: 'Stylized 3D pine tree',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: false, is3D: true,
        blocksLineOfSight: true
    },
    tree_oak: {
        id: 'tree_oak',
        name: '3D Oak Tree',
        image: null,
        category: 'nature',
        size: { width: 1, height: 1 },
        description: 'Stylized 3D oak tree',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: false, is3D: true,
        blocksLineOfSight: true
    },
    trees_small_cluster: {
        id: 'trees_small_cluster',
        name: '3D Tree Grove',
        image: null,
        category: 'nature',
        size: { width: 2, height: 2 },
        description: 'Cluster of low-poly deciduous trees and shrubs',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: false, is3D: true,
        blocksLineOfSight: true
    },
    rock_boulder: {
        id: 'rock_boulder',
        name: '3D Boulder',
        image: null,
        category: 'nature',
        size: { width: 1, height: 1 },
        description: 'Stylized 3D rock boulder',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: false, is3D: true,
        blocksLineOfSight: true
    },
    rock_single_B: {
        id: 'rock_single_B',
        name: '3D Mossy Rock',
        image: null,
        category: 'nature',
        size: { width: 1, height: 1 },
        description: 'Weathered mossy rock formation',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: false, is3D: true,
        blocksLineOfSight: false
    },
    rock_single_C: {
        id: 'rock_single_C',
        name: '3D Jagged Rock',
        image: null,
        category: 'nature',
        size: { width: 1, height: 1 },
        description: 'Sharp jagged mountain stone',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: false, is3D: true,
        blocksLineOfSight: false
    },

    // ===== 3D Props, Containers & Traps =====
    chest: {
        id: 'chest',
        name: '3D Treasure Chest',
        image: null,
        category: 'props',
        size: { width: 1, height: 1 },
        description: 'Interactive 3D animated treasure chest (opens on click)',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: true, is3D: true,
        blocksLineOfSight: false
    },
    chest_gold: {
        id: 'chest_gold',
        name: '3D Royal Gold Chest',
        image: null,
        category: 'props',
        size: { width: 1, height: 1 },
        description: 'Interactive 3D ornate gold-trimmed chest (opens on click)',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: true, is3D: true,
        blocksLineOfSight: false
    },
    trunk_large: {
        id: 'trunk_large',
        name: '3D Ironbound Trunk',
        image: null,
        category: 'props',
        size: { width: 1, height: 1 },
        description: 'Large ironbound storage trunk',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: true, is3D: true,
        blocksLineOfSight: false
    },
    barrel: {
        id: 'barrel',
        name: '3D Barrel',
        image: null,
        category: 'props',
        size: { width: 1, height: 1 },
        description: 'Stylized 3D wooden barrel',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: false, is3D: true,
        blocksLineOfSight: false
    },
    barrel_large: {
        id: 'barrel_large',
        name: '3D Large Barrel',
        image: null,
        category: 'props',
        size: { width: 1, height: 1 },
        description: 'Large wooden ale barrel',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: false, is3D: true,
        blocksLineOfSight: true
    },
    barrel_stack: {
        id: 'barrel_stack',
        name: '3D Stacked Barrels',
        image: null,
        category: 'props',
        size: { width: 1, height: 1 },
        description: 'Pyramid stack of wooden tavern barrels',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: false, is3D: true,
        blocksLineOfSight: true
    },
    crates: {
        id: 'crates',
        name: '3D Stacked Crates',
        image: null,
        category: 'props',
        size: { width: 1, height: 1 },
        description: 'Stylized 3D stacked wooden crates',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: false, is3D: true,
        blocksLineOfSight: true
    },
    crates_tall: {
        id: 'crates_tall',
        name: '3D Tall Crates Stack',
        image: null,
        category: 'props',
        size: { width: 1, height: 1 },
        description: 'Stylized 3D tall stack of wooden cargo crates',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: false, is3D: true,
        blocksLineOfSight: true
    },
    keg: {
        id: 'keg',
        name: '3D Ale Keg',
        image: null,
        category: 'props',
        size: { width: 1, height: 1 },
        description: 'Wooden brew keg',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: false, is3D: true,
        blocksLineOfSight: false
    },
    keg_decorated: {
        id: 'keg_decorated',
        name: '3D Tap Keg Stand',
        image: null,
        category: 'props',
        size: { width: 1, height: 1 },
        description: 'Ale keg on wooden dispenser stand with tap',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: false, is3D: true,
        blocksLineOfSight: false
    },
    weapons_rack: {
        id: 'weapons_rack',
        name: '3D Weapon Display',
        image: null,
        category: 'props',
        size: { width: 1, height: 1 },
        description: 'Wall trophy with iron shield and crossed swords',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: false, is3D: true,
        wallMountable: true, wallMountElevation: 0.8, wallSideSnap: true,
        blocksLineOfSight: false
    },
    royal_weapons: {
        id: 'royal_weapons',
        name: '3D Royal Arms',
        image: null,
        category: 'props',
        size: { width: 1, height: 1 },
        description: 'Golden heraldic crest with royal sword and shield',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: false, is3D: true,
        wallMountable: true, wallMountElevation: 0.8,
        blocksLineOfSight: false
    },
    treasure_coins: {
        id: 'treasure_coins',
        name: '3D Gold Coin Pile',
        image: null,
        category: 'props',
        size: { width: 1, height: 1 },
        description: 'Heaping mound of glistening gold coins',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: false, is3D: true,
        blocksLineOfSight: false
    },
    rubble_pile: {
        id: 'rubble_pile',
        name: '3D Stone Rubble',
        image: null,
        category: 'props',
        size: { width: 1, height: 1 },
        description: 'Pile of collapsed masonry stones',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: false, is3D: true,
        blocksLineOfSight: false
    },
    rubble_half: {
        id: 'rubble_half',
        name: '3D Scattered Rubble',
        image: null,
        category: 'props',
        size: { width: 1, height: 1 },
        description: 'Scattered stones and debris',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: false, is3D: true,
        blocksLineOfSight: false
    },
    barrel_decorated: {
        id: 'barrel_decorated',
        name: '3D Ornate Ale Barrel',
        image: null,
        category: 'props',
        size: { width: 1, height: 1 },
        description: 'Carved wooden tavern barrel with brass bands',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: false, is3D: true,
        blocksLineOfSight: false
    },
    barrel_small: {
        id: 'barrel_small',
        name: '3D Small Keg',
        image: null,
        category: 'props',
        size: { width: 0.8, height: 0.8 },
        description: 'Compact wooden keg',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: false, is3D: true,
        blocksLineOfSight: false
    },
    box_large: {
        id: 'box_large',
        name: '3D Large Cargo Box',
        image: null,
        category: 'props',
        size: { width: 1, height: 1 },
        description: 'Reinforced shipping cargo crate',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: false, is3D: true,
        blocksLineOfSight: true
    },
    box_small: {
        id: 'box_small',
        name: '3D Small Wooden Box',
        image: null,
        category: 'props',
        size: { width: 0.8, height: 0.8 },
        description: 'Small wooden storage container',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: false, is3D: true,
        blocksLineOfSight: false
    },
    trunk_medium: {
        id: 'trunk_medium',
        name: '3D Storage Trunk',
        image: null,
        category: 'props',
        size: { width: 1, height: 1 },
        description: 'Medium ironbound footlocker trunk',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: true, is3D: true,
        blocksLineOfSight: false
    },
    trunk_small: {
        id: 'trunk_small',
        name: '3D Small Strongbox',
        image: null,
        category: 'props',
        size: { width: 0.8, height: 0.8 },
        description: 'Small locked wooden strongbox',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: true, is3D: true,
        blocksLineOfSight: false
    },
    coin_stack_medium: {
        id: 'coin_stack_medium',
        name: '3D Medium Coin Pile',
        image: null,
        category: 'props',
        size: { width: 0.8, height: 0.8 },
        description: 'Stack of gleaming silver and gold coins',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: false, is3D: true,
        blocksLineOfSight: false
    },
    weapons_broken: {
        id: 'weapons_broken',
        name: '3D Damaged Weapons',
        image: null,
        category: 'props',
        size: { width: 1, height: 1 },
        description: 'Broken weapons and shattered shields from past battles',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: false, is3D: true,
        blocksLineOfSight: false
    },
    spikes_floor: {
        id: 'spikes_floor',
        name: '3D Floor Spikes Trap',
        image: null,
        category: 'props',
        size: { width: 1, height: 1 },
        description: 'Deadly iron floor spikes trap',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: false, is3D: true,
        blocksLineOfSight: false
    },
    grate_closed: {
        id: 'grate_closed',
        name: '3D Closed Metal Grate',
        image: null,
        category: 'props',
        size: { width: 1, height: 1 },
        description: 'Heavy dungeon drainage iron grate',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: false, is3D: true,
        blocksLineOfSight: false
    },
    grate_open: {
        id: 'grate_open',
        name: '3D Open Metal Grate',
        image: null,
        category: 'props',
        size: { width: 1, height: 1 },
        description: 'Opened dungeon floor iron grate leading down',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: false, is3D: true,
        blocksLineOfSight: false
    },
    potion_bottle_green: {
        id: 'potion_bottle_green',
        name: '3D Healing Potion',
        image: null,
        category: 'props',
        size: { width: 0.5, height: 0.5 },
        description: 'Emerald green glass alchemical potion bottle',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: false, is3D: true,
        blocksLineOfSight: false
    },
    potion_bottle_brown: {
        id: 'potion_bottle_brown',
        name: '3D Elixir Flask',
        image: null,
        category: 'props',
        size: { width: 0.5, height: 0.5 },
        description: 'Amber glass elixir flask',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: false, is3D: true,
        blocksLineOfSight: false
    },

    // ===== 3D Lighting & Banners =====
    torch_wall: {
        id: 'torch_wall',
        name: '3D Wall Torch',
        image: null,
        category: 'lighting',
        size: { width: 0.6, height: 0.6 },
        description: 'Mounted wall sconce torch with flickering flame',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: false, is3D: true,
        wallMountable: true, wallMountElevation: 1.2,
        lightRadius: 3, lightColor: '#ffaa33', showLight: true,
        blocksLineOfSight: false
    },
    torch_standing: {
        id: 'torch_standing',
        name: '3D Standing Torch',
        image: null,
        category: 'lighting',
        size: { width: 0.8, height: 0.8 },
        description: 'Free-standing iron lit dungeon torch brazier',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: false, is3D: true,
        lightRadius: 4, lightColor: '#ff9922', showLight: true,
        blocksLineOfSight: false
    },
    candle: {
        id: 'candle',
        name: '3D Lit Candle',
        image: null,
        category: 'lighting',
        size: { width: 0.4, height: 0.4 },
        description: 'Small burning wax candle',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: false, is3D: true,
        lightRadius: 1.5, lightColor: '#ffcc66', showLight: true,
        blocksLineOfSight: false
    },
    candle_melted: {
        id: 'candle_melted',
        name: '3D Melted Candle',
        image: null,
        category: 'lighting',
        size: { width: 0.4, height: 0.4 },
        description: 'Low melted tallow candle stump',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: false, is3D: true,
        lightRadius: 1.2, lightColor: '#ffb347', showLight: true,
        blocksLineOfSight: false
    },
    candle_thin: {
        id: 'candle_thin',
        name: '3D Taper Candle',
        image: null,
        category: 'lighting',
        size: { width: 0.3, height: 0.3 },
        description: 'Slender lit taper candle',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: false, is3D: true,
        lightRadius: 1.5, lightColor: '#ffcc66', showLight: true,
        blocksLineOfSight: false
    },
    candelabra: {
        id: 'candelabra',
        name: '3D Candelabra',
        image: null,
        category: 'lighting',
        size: { width: 0.8, height: 0.8 },
        description: 'Triple brass candelabra stand',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: false, is3D: true,
        lightRadius: 3, lightColor: '#ffbb44', showLight: true,
        blocksLineOfSight: false
    },
    banner_red: {
        id: 'banner_red',
        name: '3D Crimson Banner',
        image: null,
        category: 'lighting',
        size: { width: 0.8, height: 1.5 },
        description: 'Hanging crimson banner with heraldic emblem',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: false, is3D: true,
        wallMountable: true, wallMountElevation: 0.3,
        blocksLineOfSight: false
    },
    banner_blue: {
        id: 'banner_blue',
        name: '3D Azure Banner',
        image: null,
        category: 'lighting',
        size: { width: 0.8, height: 1.5 },
        description: 'Hanging royal azure cloth banner',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: false, is3D: true,
        wallMountable: true, wallMountElevation: 0.3,
        blocksLineOfSight: false
    },
    banner_green: {
        id: 'banner_green',
        name: '3D Emerald Banner',
        image: null,
        category: 'lighting',
        size: { width: 0.8, height: 1.5 },
        description: 'Hanging forest emerald cloth banner',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: false, is3D: true,
        wallMountable: true, wallMountElevation: 0.3,
        blocksLineOfSight: false
    },
    banner_yellow: {
        id: 'banner_yellow',
        name: '3D Golden Sun Banner',
        image: null,
        category: 'lighting',
        size: { width: 0.8, height: 1.5 },
        description: 'Hanging sunburst gold cloth banner',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: false, is3D: true,
        wallMountable: true, wallMountElevation: 0.3,
        blocksLineOfSight: false
    },
    banner_crest: {
        id: 'banner_crest',
        name: '3D Royal Crest Banner',
        image: null,
        category: 'lighting',
        size: { width: 0.8, height: 1.5 },
        description: 'Shield crest heraldic banner of the realm',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: false, is3D: true,
        wallMountable: true, wallMountElevation: 0.3,
        blocksLineOfSight: false
    },

    // ===== 3D Crypt, Graveyard & Tombs =====
    gravestone: {
        id: 'gravestone',
        name: '3D Weathered Gravestone',
        image: null,
        category: 'crypt',
        size: { width: 1, height: 1 },
        description: 'Weathered stone cemetery headstone',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: false, is3D: true,
        blocksLineOfSight: false
    },
    coffin: {
        id: 'coffin',
        name: '3D Crypt Coffin',
        image: null,
        category: 'crypt',
        size: { width: 1, height: 2 },
        description: 'Ancient stone and iron coffin burial casket',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: true, is3D: true,
        blocksLineOfSight: false
    },
    crypt: {
        id: 'crypt',
        name: '3D Stone Mausoleum Crypt',
        image: null,
        category: 'crypt',
        size: { width: 2, height: 2 },
        description: 'Grand ornate ancestral stone crypt tomb',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: false, is3D: true,
        blocksLineOfSight: true
    },
    skull: {
        id: 'skull',
        name: '3D Human Skull',
        image: null,
        category: 'crypt',
        size: { width: 0.5, height: 0.5 },
        description: 'Bleached human skeleton skull',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: false, is3D: true,
        wallMountable: true, wallMountElevation: 1.2,
        blocksLineOfSight: false
    },
    skull_candle: {
        id: 'skull_candle',
        name: '3D Ritual Skull Candle',
        image: null,
        category: 'crypt',
        size: { width: 0.5, height: 0.5 },
        description: 'Ritual skull topped with flickering melted candle wax',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: false, is3D: true,
        wallMountable: true, wallMountElevation: 1.2,
        lightRadius: 2, lightColor: '#ff9944', showLight: true,
        blocksLineOfSight: false
    },
    ribcage: {
        id: 'ribcage',
        name: '3D Skeletal Ribcage',
        image: null,
        category: 'crypt',
        size: { width: 1, height: 1 },
        description: 'Sunken skeletal ribcage remains',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: false, is3D: true,
        blocksLineOfSight: false
    },
    bone_pile: {
        id: 'bone_pile',
        name: '3D Bone Pile',
        image: null,
        category: 'crypt',
        size: { width: 0.8, height: 0.8 },
        description: 'Scattered human skeletal bones',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: false, is3D: true,
        blocksLineOfSight: false
    },
    tree_dead_large: {
        id: 'tree_dead_large',
        name: '3D Gnarled Dead Tree',
        image: null,
        category: 'crypt',
        size: { width: 2, height: 2 },
        description: 'Towering gnarled leafless dead tree',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: false, is3D: true,
        blocksLineOfSight: true
    },
    tree_dead_medium: {
        id: 'tree_dead_medium',
        name: '3D Twisted Dead Tree',
        image: null,
        category: 'crypt',
        size: { width: 1, height: 1 },
        description: 'Twisted barren spooky tree',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: false, is3D: true,
        blocksLineOfSight: true
    },
    fence_iron: {
        id: 'fence_iron',
        name: '3D Wrought Iron Fence',
        image: null,
        category: 'crypt',
        size: { width: 1, height: 1 },
        description: 'Spiked cemetery iron fence railing',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: false, is3D: true,
        blocksLineOfSight: false
    },
    fence_gate_iron: {
        id: 'fence_gate_iron',
        name: '3D Iron Graveyard Gate',
        image: null,
        category: 'crypt',
        size: { width: 1, height: 1 },
        description: 'Hinged cemetery wrought iron gate',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: true, is3D: true,
        blocksLineOfSight: false
    },
    arch_iron: {
        id: 'arch_iron',
        name: '3D Iron Crypt Arch',
        image: null,
        category: 'crypt',
        size: { width: 1, height: 1 },
        description: 'Gothic wrought iron entrance archway',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: false, is3D: true,
        blocksLineOfSight: false
    },

    // ===== Utility / GM =====
    gmNotes: {
        id: 'gmNotes',
        name: 'GM Notes',
        image: null,
        canvasRender: 'gmNotes',
        category: 'gm',
        size: { width: 1, height: 1 },
        description: 'GM prepared notes with items and creatures',
        freePosition: true, draggable: true, resizable: false, clickable: true,
        gmOnly: true, interactive: true,
        blocksLineOfSight: false
    }
};

// Pre-warm the image cache for all known sprites so the editor
// has them ready the moment it opens.
Object.values(PROFESSIONAL_OBJECTS).forEach(def => {
    if (def.image) getSpriteImage(def.image);
});




const ObjectSystem = () => {
    const canvasRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [resizeHandle, setResizeHandle] = useState(null); // 'tl', 'tr', 'bl', 'br'
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [initialScale, setInitialScale] = useState(1);
    const [initialMousePos, setInitialMousePos] = useState({ x: 0, y: 0 });
    const [hoveredHandle, setHoveredHandle] = useState(null);
    const dragStateRef = useRef({ isDragging: false, dragObjectId: null, dragOffsetX: 0, dragOffsetY: 0 });
    // PERFORMANCE: coalesce drag store writes to one per animation frame. Raw
    // mousemove can fire several times per frame and every write re-renders all
    // whole-store subscribers (grid layers, tiles, fog, persistence).
    const pendingDragApplyRef = useRef(null);
    const dragApplyRafRef = useRef(null);
    const scheduleDragApply = useCallback((applyFn) => {
        window._isDraggingObject = true;
        pendingDragApplyRef.current = applyFn;
        if (dragApplyRafRef.current !== null) return;
        dragApplyRafRef.current = requestAnimationFrame(() => {
            dragApplyRafRef.current = null;
            const fn = pendingDragApplyRef.current;
            pendingDragApplyRef.current = null;
            if (fn) fn();
        });
    }, []);
    const flushDragApply = useCallback(() => {
        if (dragApplyRafRef.current !== null) {
            cancelAnimationFrame(dragApplyRafRef.current);
            dragApplyRafRef.current = null;
        }
        const fn = pendingDragApplyRef.current;
        pendingDragApplyRef.current = null;
        if (fn) fn();
        window._isDraggingObject = false;
    }, []);

    // Safety net: never leave the drag flag set if the component unmounts mid-drag.
    useEffect(() => {
        return () => {
            if (dragApplyRafRef.current !== null) {
                cancelAnimationFrame(dragApplyRafRef.current);
            }
            dragApplyRafRef.current = null;
            pendingDragApplyRef.current = null;
            window._isDraggingObject = false;
        };
    }, []);
    const [isOverConnection, setIsOverConnection] = useState(false);
    const connectionElementRef = useRef(null);

    // Chest Modal state
    const [activeUnlockChest, setActiveUnlockChest] = useState(null);
    const [activeLockSettingsChest, setActiveLockSettingsChest] = useState(null);
    const [isRotating, setIsRotating] = useState(false);

    // Context menu state
    const [showContextMenu, setShowContextMenu] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
    const [selectedObject, setSelectedObject] = useState(null);

    const closeContextMenu = useCallback(() => {
        setShowContextMenu(false);
        setSelectedObject(null);
    }, []);

    // GM Notes hover state
    const [hoveredGMNote, setHoveredGMNote] = useState(null);
    const [gmNoteTooltipPosition, setGmNoteTooltipPosition] = useState({ x: 0, y: 0 });

    // Store connections
    const [pickParentMode, setPickParentMode] = useState(false);
    const [pendingChildId, setPendingChildId] = useState(null);
    const pickParentModeRef = useRef(false);
    const pendingChildIdRef = useRef(null);
    const setPickParent = (val) => { setPickParentMode(val); pickParentModeRef.current = val; };
    const setPendingChild = (val) => { setPendingChildId(val); pendingChildIdRef.current = val; };

    const environmentalObjects = useLevelEditorStore(state => state.environmentalObjects || []);
    const isEditorMode = useLevelEditorStore(state => state.isEditorMode);
    const activeLayer = useLevelEditorStore(state => state.activeLayer);
    const drawingLayers = useLevelEditorStore(state => state.drawingLayers);
    const elevationData = useLevelEditorStore(state => state.elevationData);
    const wallData = useLevelEditorStore(state => state.wallData);
    const removeEnvironmentalObject = useLevelEditorStore(state => state.removeEnvironmentalObject);
    const updateEnvironmentalObject = useLevelEditorStore(state => state.updateEnvironmentalObject);
    const selectEnvironmentalObject = useLevelEditorStore(state => state.selectEnvironmentalObject);
    const setEnvironmentalObjectLocked = useLevelEditorStore(state => state.setEnvironmentalObjectLocked);
    const reorderEnvironmentalObject = useLevelEditorStore(state => state.reorderEnvironmentalObject);
    const attachChildToParent = useLevelEditorStore(state => state.attachChildToParent);
    const detachFromParent = useLevelEditorStore(state => state.detachFromParent);
    const getChildrenOfParent = useLevelEditorStore(state => state.getChildrenOfParent);
    const objectManipulationEnabled = useLevelEditorStore(state => state.objectManipulationEnabled);

    // Fog of War & Vision subscriptions
    const fogOfWarEnabled = useLevelEditorStore(state => state.fogOfWarEnabled);
    const dynamicFogEnabled = useLevelEditorStore(state => state.dynamicFogEnabled);
    const viewingFromToken = useLevelEditorStore(state => state.viewingFromToken);
    const visibleArea = useLevelEditorStore(state => state.visibleArea);
    const controlledVisibleTiles = useLevelEditorStore(state => state.controlledVisibleTiles);
    const visibilityPolygon = useLevelEditorStore(state => state.visibilityPolygon);
    const isPlayerPositionExplored = useLevelEditorStore(state => state.isPlayerPositionExplored);

    const visibleAreaSet = useMemo(() => {
        if (!visibleArea) return null;
        const set = new Set(visibleArea instanceof Set ? visibleArea : visibleArea);
        if (controlledVisibleTiles) controlledVisibleTiles.forEach(t => set.add(t));
        return set;
    }, [visibleArea, controlledVisibleTiles]);

    const gridSize = useGameStore(state => state.gridSize);
    const gridOffsetX = useGameStore(state => state.gridOffsetX);
    const gridOffsetY = useGameStore(state => state.gridOffsetY);
    const cameraX = useGameStore(state => state.cameraX);
    const viewMode = useGameStore(state => state.viewMode);
    const viewRotation = useGameStore(state => state.viewRotation);
    const viewTilt = useGameStore(state => state.viewTilt);
    const cameraY = useGameStore(state => state.cameraY);
    const zoomLevel = useGameStore(state => state.zoomLevel);
    const playerZoom = useGameStore(state => state.playerZoom);
    const isGMMode = useGameStore(state => state.isGMMode);
    const isBackgroundManipulationMode = useGameStore(state => state.isBackgroundManipulationMode);

    const { getCurrentMapId } = useMapStore();

    const processSingleImage = useCallback((img, url) => {
        return new Promise((resolve) => {
            try {
                globalObjectImageCache.set(url, img);
                resolve(true);
            } catch (e) {
                resolve(false);
            }
        });
    }, []);

    const renderObjectsRef = useRef(null);

    const ensureImageCached = useCallback((url) => {
        if (globalObjectImageCache.has(url)) return;
        if (globalObjectImageCache.has(`__loading:${url}`)) return;

        globalObjectImageCache.set(`__loading:${url}`, true);

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = url;
        img.onload = () => {
            processSingleImage(img, url).then((success) => {
                globalObjectImageCache.delete(`__loading:${url}`);
                if (success && renderObjectsRef.current) renderObjectsRef.current();
            });
        };
        img.onerror = () => {
            globalObjectImageCache.delete(`__loading:${url}`);
        };
    }, [processSingleImage]);

    // Helper to get current map ID explicitly (prevents stale reads during rapid updates)
    const getExplicitCurrentMapId = useCallback(() => {
        const mapStoreState = useMapStore.getState();
        return mapStoreState.currentMapId || 'default';
    }, []);

    // Keyboard shortcut to delete selected object with Delete or Backspace
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            if (e.key === 'Delete' || e.key === 'Backspace') {
                const selected = (environmentalObjects || []).find(o => o.selected);
                if (selected && !selected.locked) {
                    removeEnvironmentalObject(selected.id, getExplicitCurrentMapId());
                    e.preventDefault();
                    e.stopPropagation();
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [environmentalObjects, removeEnvironmentalObject, getExplicitCurrentMapId]);

    useEffect(() => {
        if (!environmentalObjects || environmentalObjects.length === 0) return;

        const neededUrls = new Set();
        environmentalObjects.forEach(obj => {
            const objDef = PROFESSIONAL_OBJECTS[obj.type];
            if (!objDef) return;
            if (objDef.image) neededUrls.add(objDef.image);
            if (objDef.multiAngle && objDef.angles) {
                Object.values(objDef.angles).forEach(url => neededUrls.add(url));
            }
        });

        const uncached = [...neededUrls].filter(url => !globalObjectImageCache.has(url) && !globalObjectImageCache.has(`__loading:${url}`));
        if (uncached.length === 0) return;

        let index = 0;
        const processNext = () => {
            if (index >= uncached.length) return;
            const url = uncached[index];
            index++;

            globalObjectImageCache.set(`__loading:${url}`, true);
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.src = url;
            img.onload = () => {
                processSingleImage(img, url).then((success) => {
                    globalObjectImageCache.delete(`__loading:${url}`);
                    if (success && renderObjectsRef.current) renderObjectsRef.current();
                    if (typeof requestIdleCallback === 'function') {
                        requestIdleCallback(processNext, { timeout: 200 });
                    } else {
                        setTimeout(processNext, 50);
                    }
                });
            };
            img.onerror = () => {
                globalObjectImageCache.delete(`__loading:${url}`);
                if (typeof requestIdleCallback === 'function') {
                    requestIdleCallback(processNext, { timeout: 200 });
                } else {
                    setTimeout(processNext, 50);
                }
            };
        };

        if (typeof requestIdleCallback === 'function') {
            requestIdleCallback(processNext, { timeout: 500 });
        } else {
            setTimeout(processNext, 200);
        }
    }, [environmentalObjects, processSingleImage]);

    useEffect(() => {
        let index = 0;
        const allObjects = Object.values(PROFESSIONAL_OBJECTS);
        const preloadNext = () => {
            if (index >= allObjects.length) return;
            const obj = allObjects[index];
            index++;

            const urls = [];
            if (obj.image) urls.push(obj.image);
            if (obj.multiAngle && obj.angles) {
                Object.values(obj.angles).forEach(url => urls.push(url));
            }

            urls.forEach(url => {
                if (globalObjectImageCache.has(url) || globalObjectImageCache.has(`__loading:${url}`)) return;
                globalObjectImageCache.set(`__loading:${url}`, true);
                const img = new Image();
                img.crossOrigin = "anonymous";
                img.src = url;
                img.onload = () => {
                    processSingleImage(img, url).then(() => {
                        globalObjectImageCache.delete(`__loading:${url}`);
                    });
                };
                img.onerror = () => {
                    globalObjectImageCache.delete(`__loading:${url}`);
                };
            });

            if (typeof requestIdleCallback === 'function') {
                requestIdleCallback(preloadNext, { timeout: 2000 });
            } else {
                setTimeout(preloadNext, 1000);
            }
        };

        const timer = setTimeout(() => {
            if (typeof requestIdleCallback === 'function') {
                requestIdleCallback(preloadNext, { timeout: 5000 });
            } else {
                setTimeout(preloadNext, 3000);
            }
        }, 3000);

        return () => clearTimeout(timer);
    }, [processSingleImage]);



    // Listen for 3D chest interaction events (unlock prompt and settings)
    useEffect(() => {
        const handleChestUnlockEvent = (e) => {
            if (e?.detail?.chest) {
                setActiveUnlockChest(e.detail.chest);
            }
        };
        const handleChestSettingsEvent = (e) => {
            if (e?.detail?.chest) {
                setActiveLockSettingsChest(e.detail.chest);
            }
        };
        window.addEventListener('vtt:chest:unlock', handleChestUnlockEvent);
        window.addEventListener('vtt:chest:settings', handleChestSettingsEvent);
        return () => {
            window.removeEventListener('vtt:chest:unlock', handleChestUnlockEvent);
            window.removeEventListener('vtt:chest:settings', handleChestSettingsEvent);
        };
    }, []);

    // Keyboard listener for Delete and Backspace keys on selected object
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
                return;
            }
            if (e.key === 'Delete' || e.key === 'Backspace') {
                const selectedObj = (environmentalObjects || []).find(o => o.selected);
                if (selectedObj && !selectedObj.locked && (isEditorMode || isGMMode)) {
                    e.preventDefault();
                    removeEnvironmentalObject(selectedObj.id, getExplicitCurrentMapId());
                    setSelectedObject(null);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [environmentalObjects, isEditorMode, isGMMode, removeEnvironmentalObject]);

    // Calculate effective zoom and grid positioning
    const effectiveZoom = zoomLevel * playerZoom;

    // Convert grid coordinates to screen coordinates using the same system as InfiniteGridSystem
    const gridToScreen = useCallback((gridX, gridY) => {
        try {
            const gridSystem = getGridSystem();
            const viewport = gridSystem.getViewportDimensions();
            const worldPos = gridSystem.gridToWorldCorner(gridX, gridY);
            // Always pass viewport dimensions for proper coordinate conversion
            return gridSystem.worldToScreen(worldPos.x, worldPos.y, viewport.width, viewport.height);
        } catch (error) {
            // Fallback to original calculation if grid system fails
            const worldX = (gridX * gridSize) + gridOffsetX;
            const worldY = (gridY * gridSize) + gridOffsetY;

            const screenX = (worldX - cameraX) * effectiveZoom + window.innerWidth / 2;
            const screenY = (worldY - cameraY) * effectiveZoom + window.innerHeight / 2;

            return { x: screenX, y: screenY };
        }
    }, [gridSize, gridOffsetX, gridOffsetY, cameraX, cameraY, effectiveZoom]);

    const moveChildrenWithParent = useCallback((parentId, newWorldX, newWorldY, mapId) => {
        const state = useLevelEditorStore.getState();
        const children = state.environmentalObjects.filter(o => o.parentObjectId === parentId);
        children.forEach(child => {
            const offsetX = child.attachOffsetX || 0;
            const offsetY = child.attachOffsetY || 0;
            state.updateEnvironmentalObject(child.id, {
                ...child,
                worldX: newWorldX + offsetX,
                worldY: newWorldY + offsetY
            }, mapId);
        });
    }, []);

    const updateAttachmentOffset = useCallback((objId, newWorldX, newWorldY, mapId) => {
        const state = useLevelEditorStore.getState();
        const obj = state.environmentalObjects.find(o => o.id === objId);
        if (obj && obj.parentObjectId) {
            const parent = state.environmentalObjects.find(o => o.id === obj.parentObjectId);
            if (parent) {
                state.updateEnvironmentalObject(objId, {
                    ...obj,
                    worldX: newWorldX,
                    worldY: newWorldY,
                    attachOffsetX: newWorldX - parent.worldX,
                    attachOffsetY: newWorldY - parent.worldY
                }, mapId);
            }
        }
    }, []);

    // Wall-mountable or wall-side props re-snap to the nearest
    // wall face while dragging and detach when pulled away from every wall.
    const resolveDragWallPatch = useCallback((obj, worldX, worldY, screenX = null, screenY = null) => {
        const objectDef = PROFESSIONAL_OBJECTS[obj?.type];
        const editorState = useLevelEditorStore.getState();
        const snapToWall = editorState?.toolSettings?.snapToWall !== false;
        if ((!objectDef?.wallMountable && !objectDef?.wallSideSnap && !snapToWall) || obj?.parentObjectId) return null;
        let gridSystem = null;
        try {
            gridSystem = getGridSystem();
        } catch (error) {
            gridSystem = null;
        }
        const gameState = useGameStore.getState();
        return resolveWallMountDragPatch({
            objectDef,
            object: obj,
            worldX,
            worldY,
            screenX,
            screenY,
            wallData: editorState.wallData || {},
            elevationData: editorState.elevationData || {},
            gridSize: gameState.gridSize || 50,
            gridOffsetX: gameState.gridOffsetX || 0,
            gridOffsetY: gameState.gridOffsetY || 0,
            gridSystem,
            snapToWall
        });
    }, []);

    // Resolve the world anchor (and base elevation) used to project/occlude an
    // object. Mirrors the coordinates the renderer draws the sprite at.
    const getObjectWorldAnchor = useCallback((obj) => {
        try {
            const gridSystem = getGridSystem();
            if (obj.freePosition && Number.isFinite(obj.worldX) && Number.isFinite(obj.worldY)) {
                const tile = gridSystem.worldToGrid(obj.worldX, obj.worldY);
                return {
                    worldX: obj.worldX,
                    worldY: obj.worldY,
                    worldZ: getTileElevation(elevationData, tile.x, tile.y) * gridSize
                };
            }
            if (Number.isFinite(obj.gridX) && Number.isFinite(obj.gridY)) {
                const corner = gridSystem.gridToWorldCorner(obj.gridX, obj.gridY);
                return {
                    worldX: corner.x,
                    worldY: corner.y,
                    worldZ: getTileElevation(elevationData, obj.gridX, obj.gridY) * gridSize
                };
            }
        } catch (error) {
            return null;
        }
        return null;
    }, [elevationData, gridSize]);

    // 2.5D occlusion: an object covered by a wall or raised terrain must not be
    // drawn in front of the wall. In editor mode, occluded objects are rendered
    // as semi-transparent ghosts so the GM can still see, select, and move them.
    const isObjectOccluded = useCallback((obj, objectDef) => {
        if (!wallData) return false;
        // GM notes are interaction markers, keep them reachable for the GM.
        if (objectDef?.gmOnly) return false;
        const anchor = getObjectWorldAnchor(obj);
        if (!anchor) return false;
        try {
            return isWorldPointOccluded({
                worldX: anchor.worldX,
                worldY: anchor.worldY,
                worldZ: anchor.worldZ,
                wallData,
                elevationData,
                gridSystem: getGridSystem(),
                ignoreEmbeddedWalls: true
            });
        } catch (error) {
            return false;
        }
    }, [wallData, elevationData, getObjectWorldAnchor, viewMode, viewRotation, viewTilt]);

    // Calculate exact screen center position of an object (incorporating 3D/grid anchor, elevation, tilt)
    const getObjectScreenCenter = useCallback((obj, objectDef) => {
        if (!obj) return null;
        let screenPos;
        const gridSystem = getGridSystem();
        const viewport = gridSystem.getViewportDimensions();

        if (obj.freePosition && Number.isFinite(obj.worldX) && Number.isFinite(obj.worldY)) {
            try {
                screenPos = gridSystem.worldToScreen(obj.worldX, obj.worldY, viewport.width, viewport.height);
            } catch (error) {
                const canvasWidth = canvasRef.current?.width || window.innerWidth;
                const canvasHeight = canvasRef.current?.height || window.innerHeight;
                screenPos = {
                    x: (obj.worldX - cameraX) * effectiveZoom + canvasWidth / 2,
                    y: (obj.worldY - cameraY) * effectiveZoom + canvasHeight / 2
                };
            }
        } else if (Number.isFinite(obj.gridX) && Number.isFinite(obj.gridY)) {
            const worldCorner = gridSystem.gridToWorldCorner(obj.gridX, obj.gridY);
            screenPos = gridSystem.worldToScreen(worldCorner.x + gridSize / 2, worldCorner.y + gridSize / 2, viewport.width, viewport.height);
        } else {
            return null;
        }

        let objectLevel = 0;
        try {
            if (obj.freePosition && Number.isFinite(obj.worldX) && Number.isFinite(obj.worldY)) {
                const tileCoords = gridSystem.worldToGrid(obj.worldX, obj.worldY);
                objectLevel = getTileElevation(elevationData, tileCoords.x, tileCoords.y);
            } else if (Number.isFinite(obj.gridX) && Number.isFinite(obj.gridY)) {
                objectLevel = getTileElevation(elevationData, obj.gridX, obj.gridY);
            }
        } catch (error) {
            objectLevel = 0;
        }

        // Wall-mounted fixtures sit at a fraction of a level above the floor.
        // The 3D layer renders elevation levels at half a grid cell, while the
        // 2.5D canvas convention is a full grid cell per level - wall-mounted
        // chrome must follow the 3D height to stay on the rendered model.
        if (obj.wallAttached && Number.isFinite(obj.elevation)) {
            objectLevel = obj.elevation;
        }
        const levelHeight = obj.wallAttached ? gridSize * 0.5 : gridSize;

        if (objectLevel !== 0) {
            let objectCosTilt = 0;
            let objectZoom = effectiveZoom;
            try {
                const projection = gridSystem.getProjectionTransform(viewport.width, viewport.height);
                objectCosTilt = projection.cosTilt;
                objectZoom = projection.effectiveZoom;
            } catch (err) {}
            const elevationScale = objectCosTilt * objectZoom;
            screenPos = {
                x: screenPos.x,
                y: screenPos.y - objectLevel * levelHeight * elevationScale
            };
        }
        return screenPos;
    }, [gridSize, effectiveZoom, cameraX, cameraY, elevationData]);

    // Render objects on canvas
    const renderObjects = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();

        // Set canvas size to match container
        canvas.width = rect.width;
        canvas.height = rect.height;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Pixel-art objects must be drawn without smoothing or they smear.
        ctx.imageSmoothingEnabled = false;

        // Check if objects layer is visible
        const objectsLayer = drawingLayers.find(layer => layer.id === 'objects');
        if (!objectsLayer || !objectsLayer.visible) return;

        // Always render objects if we have them
        if (!environmentalObjects || environmentalObjects.length === 0) return;

        // Calculate visible bounds for performance using grid system (supports both square and hex)
        const gridSystem = getGridSystem();
        const viewportLeft = cameraX - canvas.width / effectiveZoom / 2;
        const viewportRight = cameraX + canvas.width / effectiveZoom / 2;
        const viewportTop = cameraY - canvas.height / effectiveZoom / 2;
        const viewportBottom = cameraY + canvas.height / effectiveZoom / 2;

        const topLeftGrid = gridSystem.worldToGrid(viewportLeft, viewportTop);
        const bottomRightGrid = gridSystem.worldToGrid(viewportRight, viewportBottom);

        const startX = topLeftGrid.x - 5;
        const endX = bottomRightGrid.x + 5;
        const startY = topLeftGrid.y - 5;
        const endY = bottomRightGrid.y + 5;

        // 2.5D projection context: sprite lift + projected contact shadows
        let objectSinTilt = 1;
        let objectCosTilt = 0;
        let objectZoom = effectiveZoom;
        try {
            const projectionSystem = getGridSystem();
            const projectionViewport = projectionSystem.getViewportDimensions();
            const objectProjection = projectionSystem.getProjectionTransform(projectionViewport.width, projectionViewport.height);
            objectSinTilt = objectProjection.sinTilt;
            objectCosTilt = objectProjection.cosTilt;
            objectZoom = objectProjection.effectiveZoom;
        } catch (error) {
            // Fallback to topdown identity
        }
        const objectElevationScale = objectCosTilt * objectZoom;

        // Render objects
        environmentalObjects.forEach(obj => {
            const objectDef = PROFESSIONAL_OBJECTS[obj.type];
            if (!objectDef) return;

            // Skip GM-only objects for players
            if (objectDef.gmOnly && !isGMMode) return;

            // Hide objects covered by walls or raised terrain (2.5D occlusion) in play mode
            const isOccludedByWall = isObjectOccluded(obj, objectDef);
            if (isOccludedByWall && !isEditorMode) return;

            // Fog of War & Memory/Explored check
            const isFogActive = fogOfWarEnabled && !isEditorMode && (!isGMMode || viewingFromToken);
            let isExplored = true;
            let isActiveVision = true;

            const anchor = getObjectWorldAnchor(obj);
            if (isFogActive && anchor) {
                isExplored = isPlayerPositionExplored ? isPlayerPositionExplored(anchor.worldX, anchor.worldY) : true;
                if (!isExplored) return;

                if (visibleAreaSet && visibleAreaSet.size > 0) {
                    const gridCoords = getGridSystem().worldToGrid(anchor.worldX, anchor.worldY);
                    const tileKey = `${gridCoords.x},${gridCoords.y}`;
                    isActiveVision = visibleAreaSet.has(tileKey);
                } else if (viewingFromToken) {
                    isActiveVision = false;
                }
            }

            const screenPos = getObjectScreenCenter(obj, objectDef);
            if (!screenPos) return;

            const tileSize = gridSize * effectiveZoom;
            const scale = obj.scale || 1;
            const objWidth = objectDef.size.width * tileSize * scale;
            const objHeight = objectDef.size.height * tileSize * scale;

            // Skip if completely offscreen
            if (screenPos.x + objWidth < -100 || screenPos.x - objWidth > canvas.width + 100 ||
                screenPos.y + objHeight < -100 || screenPos.y + objHeight > canvas.height + 100) {
                return;
            }

            // Render object based on category
            if (isOccludedByWall && isEditorMode) {
                ctx.save();
                ctx.globalAlpha = 0.35;
                renderObjectByCategory(ctx, obj, objectDef, screenPos, objWidth, objHeight);
                ctx.restore();
            } else if (isFogActive && !isActiveVision) {
                ctx.save();
                ctx.globalAlpha = 0.45;
                renderObjectByCategory(ctx, obj, objectDef, screenPos, objWidth, objHeight);
                ctx.restore();
            } else {
                renderObjectByCategory(ctx, obj, objectDef, screenPos, objWidth, objHeight);
            }

            // Use the snapped rotation for selection chrome so the highlight
            // and handles stay aligned with the pixel art underneath.
            const snappedRotationDeg = snapRotationForHitTest(obj.type, obj.rotation || 0);
            const rotRad = (snappedRotationDeg || 0) * Math.PI / 180;

            // Render light radius if object has lighting - use object properties if available
            const lightRadius = obj.lightRadius || objectDef.lightRadius;
            const lightColor = obj.lightColor || objectDef.lightColor;
            if (lightRadius && (isEditorMode || obj.showLight)) {
                renderLightRadius(ctx, screenPos, lightRadius * tileSize, lightColor);
            }

            // Render selection highlight if selected. 3D props use the projected
            // model bounds so the frame hugs the figure instead of the tile.
            if (obj.selected) {
                const bounds = getObjectScreenBounds(obj, objectDef, screenPos, {
                    gridSize,
                    effectiveZoom,
                    rotationRad: rotRad
                });
                if (bounds) {
                    renderSelectionHighlight(ctx, bounds, bounds.tight3D ? 3 : 6, !!obj.locked);

                    // Locked objects show a padlock instead of drag handles.
                    if (obj.locked) {
                        renderLockBadge(ctx, bounds);
                    } else if (objectDef.draggable && (isEditorMode || isGMMode)) {
                        renderDragHandles(ctx, bounds);
                    }
                }
            } else if (obj.locked && (isEditorMode || isGMMode)) {
                const bounds = getObjectScreenBounds(obj, objectDef, screenPos, {
                    gridSize,
                    effectiveZoom,
                    rotationRad: rotRad
                });
                if (bounds) {
                    renderLockBadge(ctx, bounds);
                }
            }

            // Render attachment line if this object has a parent
            if (obj.parentObjectId && (isEditorMode || isGMMode)) {
                const parentObj = environmentalObjects.find(o => o.id === obj.parentObjectId);
                if (parentObj) {
                    const parentDef = PROFESSIONAL_OBJECTS[parentObj.type];
                    if (parentDef) {
                        let parentScreenPos;
                        try {
                            const gs = getGridSystem();
                            const vp = gs.getViewportDimensions();
                            parentScreenPos = gs.worldToScreen(parentObj.worldX, parentObj.worldY, vp.width, vp.height);
                        } catch (err) {
                            parentScreenPos = null;
                        }
                        if (parentScreenPos) {
                            ctx.save();
                            ctx.strokeStyle = '#44aaff';
                            ctx.lineWidth = 2;
                            ctx.setLineDash([6, 4]);
                            ctx.globalAlpha = 0.7;
                            ctx.beginPath();
                            ctx.moveTo(screenPos.x, screenPos.y);
                            ctx.lineTo(parentScreenPos.x, parentScreenPos.y);
                            ctx.stroke();
                            ctx.setLineDash([]);
                            ctx.restore();
                        }
                    }
                }
            }

            // Render pick-parent highlight on hoverable objects
            if (pickParentMode && obj.id !== pendingChildId) {
                ctx.save();
                ctx.strokeStyle = '#44ff44';
                ctx.lineWidth = 3;
                ctx.setLineDash([4, 4]);
                ctx.globalAlpha = 0.6 + Math.sin(Date.now() / 300) * 0.3;
                ctx.strokeRect(screenPos.x - objWidth / 2 - 6, screenPos.y - objHeight / 2 - 6, objWidth + 12, objHeight + 12);
                ctx.setLineDash([]);
                ctx.restore();
            }
        });
    }, [environmentalObjects, effectiveZoom, gridToScreen, isEditorMode, gridSize, cameraX, cameraY, isGMMode, drawingLayers, pickParentMode, pendingChildId, elevationData, viewMode, viewRotation, viewTilt, wallData, isObjectOccluded]);

    renderObjectsRef.current = renderObjects;

    // Expose a global hook so the sprite image loader can trigger a
    // re-render of the on-map canvas the moment an image finishes
    // loading. Without this, objects placed while their sprite is
    // still loading would be invisible.
    if (typeof window !== 'undefined') {
        window.__vttObjectSystemRefresh = () => {
            if (renderObjectsRef.current) renderObjectsRef.current();
        };
    }

    // Render object based on its category
    const renderObjectByCategory = (ctx, obj, objectDef, screenPos, width, height) => {
        ctx.save();
        ctx.imageSmoothingEnabled = false;

        // Snap rotation to the nearest 90- for pixel-perfect rotation.
        // Most sprites are top-down so this is rarely visible, but for
        // wall-mounted objects (torches, banners) it keeps the visual
        // rotation in sync with the bounding box rotation.
        const rotationDeg = snapRotationForHitTest(objectDef.id, obj.rotation || 0);
        if (rotationDeg !== 0) {
            ctx.translate(screenPos.x, screenPos.y);
            ctx.rotate(rotationDeg * Math.PI / 180);
            ctx.translate(-screenPos.x, -screenPos.y);
        }

        // 3D objects are rendered by ThreeDWorldLayer in true 3D WebGL.
        // Restore before returning: the save() (and any rotation applied above)
        // must not leak into the selection chrome or later objects, or a rotated
        // 3D prop skews every subsequent draw on this canvas.
        if (objectDef.is3D) {
            ctx.restore();
            return;
        }

        // GM Notes is canvas-rendered (paper style). Everything else uses the
        // actual sprite image from the asset pack, blitted at integer pixel
        // coordinates for crisp pixel-art output.
        if (objectDef.canvasRender === 'gmNotes') {
            renderGMObject(ctx, objectDef, screenPos, width, height, obj);
        } else if (objectDef.image) {
            const img = getSpriteImage(objectDef.image);
            if (img && img.complete && img.naturalWidth > 0) {
                const dx = Math.round(screenPos.x - width / 2);
                const dy = Math.round(screenPos.y - height / 2);
                const dw = Math.round(width);
                const dh = Math.round(height);
                ctx.drawImage(img, dx, dy, dw, dh);
            } else {
                // Sprite not yet loaded - show a parchment-coloured placeholder
                // so the user can see the object footprint while it loads.
                const dx = Math.round(screenPos.x - width / 2);
                const dy = Math.round(screenPos.y - height / 2);
                const dw = Math.round(width);
                const dh = Math.round(height);
                ctx.fillStyle = 'rgba(138, 80, 40, 0.5)';
                ctx.fillRect(dx, dy, dw, dh);
                ctx.strokeStyle = 'rgba(0,0,0,0.4)';
                ctx.lineWidth = 1;
                ctx.strokeRect(dx + 0.5, dy + 0.5, dw - 1, dh - 1);
            }
        } else if (hasObjectArt(objectDef.id)) {
            // Fallback: the legacy pixel art canvas renderer (only used if
            // an object has no sprite URL at all).
            drawObjectArt(ctx, objectDef.id, screenPos.x, screenPos.y, width, height, {
                rotation: obj.rotation || 0
            });
        } else {
            renderGenericObject(ctx, objectDef, screenPos, width, height, obj);
        }

        ctx.restore();
    };





    const FA_ICON_UNICODES = {
        'scroll': '\uf70e', 'location': '\uf3c5', 'npc': '\uf0c0',
        'encounter': '\uf714', 'trap': '\uf071', 'quest': '\uf024',
        'puzzle': '\uf12e', 'treasure': '\uf3a5', 'lore': '\uf518',
        'shop': '\uf54e', 'secret': '\uf070', 'monster': '\uf6d1',
        'puzzle-door': '\uf6d5', 'event': '\uf0e7', 'read-aloud': '\uf5da',
        'safe-rest': '\uf6bb',
    };

    const renderGMObject = (ctx, objectDef, screenPos, width, height, obj) => {
        const left = screenPos.x - width / 2;
        const top = screenPos.y - height / 2;

        ctx.fillStyle = '#f8f4e6';
        ctx.fillRect(left, top, width, height);

        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 2;
        ctx.strokeRect(left, top, width, height);

        ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
        ctx.lineWidth = 1;
        const lineSpacing = height / 5;
        for (let i = 1; i < 5; i++) {
            ctx.beginPath();
            ctx.moveTo(left + width * 0.1, top + lineSpacing * i);
            ctx.lineTo(left + width * 0.9, top + lineSpacing * i);
            ctx.stroke();
        }

        const noteIcon = (obj?.gmNotesData?.noteIcon) || 'scroll';
        const unicode = FA_ICON_UNICODES[noteIcon] || FA_ICON_UNICODES['scroll'];
        const iconSize = Math.min(width, height) * 0.45;

        ctx.save();
        ctx.fillStyle = '#5a1e12';
        ctx.font = `900 ${iconSize}px "Font Awesome 6 Free"`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(unicode, screenPos.x, screenPos.y);
        ctx.restore();
    };

    const renderGenericObject = (ctx, objectDef, screenPos, width, height, obj) => {
        // The pixel art renderer handles rotation via pre-baked angle
        // variants, so this legacy path is only used as a fallback for
        // objects without pixel art. We still disable smoothing so the
        // vector fallback looks consistent with the pixel art output.
        ctx.save();
        ctx.imageSmoothingEnabled = false;
        const rotation = (obj?.rotation || 0) * Math.PI / 180;
        if (rotation !== 0) {
            ctx.translate(screenPos.x, screenPos.y);
            ctx.rotate(rotation);
            ctx.translate(-screenPos.x, -screenPos.y);
        }
        drawObject(ctx, objectDef.id, screenPos.x, screenPos.y, width, height);
        ctx.restore();
    };

    const renderLightRadius = (ctx, screenPos, radius, color) => {
        ctx.save();
        ctx.globalAlpha = 0.2;
        ctx.strokeStyle = color || '#ffaa00';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.arc(screenPos.x, screenPos.y, radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.restore();
    };

    const renderSelectionHighlight = (ctx, bounds, pad = 6, locked = false) => {
        const { centerX, centerY, width, height, rotation } = bounds;
        ctx.save();

        if (rotation) {
            ctx.translate(centerX, centerY);
            ctx.rotate(rotation);
            ctx.translate(-centerX, -centerY);
        }

        const boxX = centerX - width / 2 - pad;
        const boxY = centerY - height / 2 - pad;
        const boxW = width + pad * 2;
        const boxH = height + pad * 2;

        // Locked objects use an amber "frozen" accent instead of the cyan edit accent.
        const accentColor = locked ? '#f59e0b' : '#38bdf8';

        // Glowing outer frame
        ctx.shadowColor = accentColor;
        ctx.shadowBlur = 12;
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 2;
        ctx.strokeRect(boxX, boxY, boxW, boxH);

        // Inner crisp white outline
        ctx.shadowBlur = 0;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.lineWidth = 1;
        ctx.strokeRect(boxX + 1.5, boxY + 1.5, boxW - 3, boxH - 3);

        // Tech / fantasy corner accent brackets
        const bracketLen = Math.min(14, Math.max(6, width * 0.25), Math.max(6, height * 0.25));
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 3;
        const x0 = boxX;
        const y0 = boxY;
        const x1 = boxX + boxW;
        const y1 = boxY + boxH;

        // Top-Left
        ctx.beginPath(); ctx.moveTo(x0, y0 + bracketLen); ctx.lineTo(x0, y0); ctx.lineTo(x0 + bracketLen, y0); ctx.stroke();
        // Top-Right
        ctx.beginPath(); ctx.moveTo(x1 - bracketLen, y0); ctx.lineTo(x1, y0); ctx.lineTo(x1, y0 + bracketLen); ctx.stroke();
        // Bottom-Left
        ctx.beginPath(); ctx.moveTo(x0, y1 - bracketLen); ctx.lineTo(x0, y1); ctx.lineTo(x0 + bracketLen, y1); ctx.stroke();
        // Bottom-Right
        ctx.beginPath(); ctx.moveTo(x1 - bracketLen, y1); ctx.lineTo(x1, y1); ctx.lineTo(x1, y1 - bracketLen); ctx.stroke();

        ctx.restore();
    };

    const renderDragHandles = (ctx, bounds) => {
        const { centerX, centerY, width, height, rotation } = bounds;
        ctx.save();
        const halfWidth = width / 2;
        const halfHeight = height / 2;

        if (rotation) {
            ctx.translate(centerX, centerY);
            ctx.rotate(rotation);
            ctx.translate(-centerX, -centerY);
        }

        // 1. Four corner resize handles
        const handleSize = 10;
        const handles = [
            { x: centerX - halfWidth, y: centerY - halfHeight },
            { x: centerX + halfWidth, y: centerY - halfHeight },
            { x: centerX - halfWidth, y: centerY + halfHeight },
            { x: centerX + halfWidth, y: centerY + halfHeight },
        ];
        handles.forEach(handle => {
            ctx.shadowColor = 'rgba(0,0,0,0.5)';
            ctx.shadowBlur = 4;
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(handle.x - handleSize/2, handle.y - handleSize/2, handleSize, handleSize);
            ctx.shadowBlur = 0;
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 2;
            ctx.strokeRect(handle.x - handleSize/2, handle.y - handleSize/2, handleSize, handleSize);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(handle.x - 2, handle.y - 2, 4, 4);
        });

        const { delOffset, rotOffset } = getObjectSelectionHandles(bounds);

        // 2. Delete handle (top center)
        const dx = centerX;
        const dy = centerY - delOffset;
        // Connecting line
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - halfHeight);
        ctx.lineTo(dx, dy);
        ctx.stroke();
        ctx.setLineDash([]);

        // Delete pill button
        ctx.shadowColor = 'rgba(239, 68, 68, 0.4)';
        ctx.shadowBlur = 8;
        ctx.fillStyle = '#ef4444';
        ctx.beginPath(); ctx.arc(dx, dy, 12, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2; ctx.stroke();
        ctx.fillStyle = '#ffffff'; ctx.font = 'bold 15px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('\u00d7', dx, dy);

        // 3. Rotation handle (right center)
        const rx = centerX + rotOffset;
        const ry = centerY;
        // Connecting line
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(centerX + halfWidth, centerY);
        ctx.lineTo(rx, ry);
        ctx.stroke();
        ctx.setLineDash([]);

        // Glassmorphic circular rotate button
        ctx.shadowColor = 'rgba(56, 189, 248, 0.4)';
        ctx.shadowBlur = 8;
        ctx.fillStyle = '#0f172a';
        ctx.beginPath(); ctx.arc(rx, ry, 13, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2; ctx.stroke();

        // Curved rotation arrow icon
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(rx, ry, 6.5, -Math.PI * 0.7, Math.PI * 0.7);
        ctx.stroke();
        // Arrowhead
        const arrowAngle = Math.PI * 0.7;
        const tipX = rx + 6.5 * Math.cos(arrowAngle);
        const tipY = ry + 6.5 * Math.sin(arrowAngle);
        ctx.beginPath();
        ctx.moveTo(tipX - 3.5, tipY - 4);
        ctx.lineTo(tipX, tipY);
        ctx.lineTo(tipX + 4, tipY - 1.5);
        ctx.stroke();

        ctx.restore();
    };

    // Small padlock badge shown on locked objects in editor/GM views.
    const renderLockBadge = (ctx, bounds) => {
        const x = bounds.centerX + bounds.width / 2 + 12;
        const y = bounds.centerY - bounds.height / 2 - 12;

        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
        ctx.shadowBlur = 6;
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(x, y, 11, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#f59e0b';
        ctx.font = '900 11px "Font Awesome 6 Free"';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('\uf023', x, y + 0.5);
        ctx.restore();
    };


    // Convert screen coordinates to world coordinates
    const screenToWorld = useCallback((screenX, screenY) => {
        try {
            const gridSystem = getGridSystem();
            const viewport = gridSystem.getViewportDimensions();
            return gridSystem.screenToWorld(screenX, screenY, viewport.width, viewport.height);
        } catch (error) {
            const canvasWidth = canvasRef.current?.width || window.innerWidth;
            const canvasHeight = canvasRef.current?.height || window.innerHeight;
            return {
                x: ((screenX - canvasWidth / 2) / effectiveZoom) + cameraX,
                y: ((screenY - canvasHeight / 2) / effectiveZoom) + cameraY
            };
        }
    }, [effectiveZoom, cameraX, cameraY, elevationData, viewMode, viewRotation, viewTilt]);

    // Find object at screen position
    const getObjectAtScreenPosition = useCallback((screenX, screenY) => {
        // Several objects can share a tile when they are stacked (a stool on a
        // table, a potion on a chest). Prefer the object that sits highest:
        // stacked children first, then higher elevations. First-match wins on
        // ties to keep the historical behaviour for plain overlaps.
        let bestHit = null;
        let bestRank = -Infinity;

        for (const obj of environmentalObjects) {
            const objectDef = PROFESSIONAL_OBJECTS[obj.type];
            if (!objectDef) continue;

            // Invisible behind a wall/terrain => not clickable either
            if (isObjectOccluded(obj, objectDef)) continue;

            // Fog of War check: If fog is active and object is unexplored, ignore it
            if (fogOfWarEnabled && !isEditorMode && (!isGMMode || viewingFromToken)) {
                const anchor = getObjectWorldAnchor(obj);
                if (anchor && isPlayerPositionExplored && !isPlayerPositionExplored(anchor.worldX, anchor.worldY)) {
                    continue;
                }
            }

            const screenPos = getObjectScreenCenter(obj, objectDef);
            if (!screenPos) continue;

            const tileSize = gridSize * effectiveZoom;
            // Hit-test against the same snapped rotation the visual uses, so a
            // user can click where the pixel art actually appears instead of
            // missing because the bounding box is rotated to a different angle.
            const snappedDeg = snapRotationForHitTest(obj.type, obj.rotation || 0);
            const rotation = (snappedDeg || 0) * Math.PI / 180;

            // 3D props are not drawn on this canvas; click the rendered model
            // silhouette instead of the whole tile footprint so neighbouring
            // objects stay reachable.
            const bounds = getObjectScreenBounds(obj, objectDef, screenPos, {
                gridSize,
                effectiveZoom,
                rotationRad: rotation
            });
            if (!bounds) continue;

            let objWidth = bounds.width;
            let objHeight = bounds.height;
            if (bounds.tight3D) {
                // Keep small props (bottles, plates, torches) comfortably clickable.
                const minHitSize = Math.max(tileSize * 0.4, 24);
                objWidth = Math.max(objWidth, minHitSize);
                objHeight = Math.max(objHeight, minHitSize);
            }

            const padding = Math.max(10, tileSize * 0.1);

            let testX = screenX;
            let testY = screenY;
            if (rotation !== 0) {
                const dx = screenX - bounds.centerX;
                const dy = screenY - bounds.centerY;
                testX = bounds.centerX + dx * Math.cos(-rotation) - dy * Math.sin(-rotation);
                testY = bounds.centerY + dx * Math.sin(-rotation) + dy * Math.cos(-rotation);
            }

            const left = bounds.centerX - objWidth / 2 - padding;
            const right = bounds.centerX + objWidth / 2 + padding;
            const top = bounds.centerY - objHeight / 2 - padding;
            const bottom = bounds.centerY + objHeight / 2 + padding;

            if (testX >= left && testX <= right && testY >= top && testY <= bottom) {
                const rank = (obj.parentObjectId ? 100 : 0) + (obj.elevation || obj.z || 0);
                if (rank > bestRank) {
                    bestRank = rank;
                    bestHit = obj;
                }
            }
        }
        return bestHit;
    }, [environmentalObjects, effectiveZoom, gridSize, isObjectOccluded, fogOfWarEnabled, isEditorMode, isGMMode, viewingFromToken, isPlayerPositionExplored, getObjectWorldAnchor, getObjectScreenCenter]);

    // Check if click is on a resize handle
    const getResizeHandle = useCallback((screenX, screenY, obj) => {
        if (!obj || (!isEditorMode && !isGMMode)) return null;

        const objectDef = PROFESSIONAL_OBJECTS[obj.type];
        if (!objectDef || !objectDef.resizable) return null;

        const screenPos = getObjectScreenCenter(obj, objectDef);
        if (!screenPos) return null;

        const gridSize = useGameStore.getState().gridSize;
        const currentZoom = useGameStore.getState().zoomLevel * useGameStore.getState().playerZoom;

        // Use the same bounds the chrome is drawn with, so the resize handles
        // always sit (and hit) exactly where they are rendered.
        const bounds = getObjectScreenBounds(obj, objectDef, screenPos, {
            gridSize,
            effectiveZoom: currentZoom,
            rotationRad: (snapRotationForHitTest(obj.type, obj.rotation || 0)) * Math.PI / 180
        });
        if (!bounds) return null;

        const objW = bounds.width;
        const objH = bounds.height;

        // Corner handles must stay grabbable without swallowing the whole
        // figure: tight 3D bounds can be smaller than the old fixed 40px
        // radius, which made any click on a chair/table start a resize instead
        // of a move.
        const hitRadius = Math.max(12, Math.min(40, Math.min(objW, objH) * 0.4));

        const handles = [
            { id: 'tl', lx: -objW / 2, ly: -objH / 2 },
            { id: 'tr', lx: objW / 2, ly: -objH / 2 },
            { id: 'bl', lx: -objW / 2, ly: objH / 2 },
            { id: 'br', lx: objW / 2, ly: objH / 2 }
        ];

        const rotation = bounds.rotation;

        for (const handle of handles) {
            let hx = bounds.centerX + handle.lx;
            let hy = bounds.centerY + handle.ly;
            if (rotation !== 0) {
                const rx = handle.lx * Math.cos(rotation) - handle.ly * Math.sin(rotation);
                const ry = handle.lx * Math.sin(rotation) + handle.ly * Math.cos(rotation);
                hx = bounds.centerX + rx;
                hy = bounds.centerY + ry;
            }
            const dist = Math.sqrt(Math.pow(screenX - hx, 2) + Math.pow(screenY - hy, 2));
            if (dist < hitRadius) return handle.id;
        }

        return null;
    }, [isEditorMode, isGMMode, getObjectScreenCenter]);

    // Get cursor style based on resize handle
    const getCursorForHandle = useCallback((handle) => {
        switch (handle) {
            case 'tl': return 'nw-resize';
            case 'tr': return 'ne-resize';
            case 'bl': return 'sw-resize';
            case 'br': return 'se-resize';
            default: return 'pointer';
        }
    }, []);

    // Helper function to check if an element is a connection element
    const isConnectionElement = (el) => {
        if (!el) return false;
        return (
            el.classList?.contains('connection-point') ||
            el.classList?.contains('portal-element') ||
            el.closest?.('.connection-point') ||
            el.closest?.('.portal-element') ||
            el.closest?.('.dnd-element.portal-element')
        );
    };

    // Handle mouse events
    const handleMouseDown = useCallback((e) => {
        // Allow mouse interactions in editor mode OR for GM notes objects when in GM mode
        // BUT respect the objectManipulationEnabled toggle
        if (!isEditorMode && !isGMMode) return;
        if (!objectManipulationEnabled) return;

        // Check if the click is on a connection element - if so, let it handle the event
        const allElementsAtPoint = document.elementsFromPoint(e.clientX, e.clientY);
        const connectionElement = allElementsAtPoint.find(el => isConnectionElement(el));
        if (connectionElement) {
            // Let the connection handle its own mouse events (for hover tooltips and clicks)
            return;
        }

        // Check if the click is on a token, HUD element, or background image - if so, ignore it here
        const elementAtPoint = allElementsAtPoint[0];
        if (elementAtPoint && (
            elementAtPoint.classList.contains('creature-token') ||
            elementAtPoint.classList.contains('character-token') ||
            elementAtPoint.closest('.creature-token') ||
            elementAtPoint.closest('.character-token') ||
            elementAtPoint.closest('.target-hud-frame') ||
            elementAtPoint.closest('.party-hud-frame') ||
            elementAtPoint.closest('.target-frame') ||
            elementAtPoint.closest('.party-member-frame')
        )) {
            console.log('ObjectSystem: ignoring click on token or HUD element');
            return; // Let the token's or HUD's own event handler deal with it
        }

        // Check if the click is on a background image - ignore it here UNLESS we're in background manipulation mode
        // In background manipulation mode, we want to allow clicks on backgrounds for resizing/moving
        if (!isBackgroundManipulationMode) {
            // Background images can be rendered as divs with backgroundImage style or as img elements
            // Also check for images in MapLibraryWindow (map-thumbnail, map-placeholder)
            const isBackgroundImage = allElementsAtPoint.some(el => {
                if (!el) return false;

                // Check if element is within MapLibraryWindow components (map-thumbnail, map-placeholder)
                const isInMapThumbnail = el.closest('.map-thumbnail') || el.closest('.map-placeholder');
                if (isInMapThumbnail) {
                    return true;
                }

                // Check if it's an img element (could be a background image)
                if (el.tagName === 'IMG') {
                    // Check if the img is within a Resizable component or background container
                    let parent = el.parentElement;
                    while (parent) {
                        // Check for Resizable component indicators
                        if (parent.classList && (
                            parent.classList.contains('react-resizable') ||
                            parent.getAttribute('data-resizable') === 'true'
                        )) {
                            return true;
                        }
                        // Check if parent has background image style
                        const parentStyle = window.getComputedStyle(parent);
                        if (parentStyle.backgroundImage && parentStyle.backgroundImage !== 'none') {
                            return true;
                        }
                        // Check if parent is a map thumbnail/placeholder
                        if (parent.classList && (
                            parent.classList.contains('map-thumbnail') ||
                            parent.classList.contains('map-placeholder')
                        )) {
                            return true;
                        }
                        parent = parent.parentElement;
                    }
                }

                const style = window.getComputedStyle(el);
                // Check if element has a background image
                const hasBackgroundImage = style.backgroundImage && style.backgroundImage !== 'none';
                // Check if it's a manipulation handle (resize/rotate handles for backgrounds)
                const isManipulationHandle = el.hasAttribute('data-manipulation-handle');
                // Check if element is within a Resizable component
                const isInResizable = el.closest('.react-resizable') || el.closest('[data-resizable="true"]');
                // Check if element is within a background container (check parent elements)
                let parent = el.parentElement;
                while (parent) {
                    const parentStyle = window.getComputedStyle(parent);
                    if (parentStyle.backgroundImage && parentStyle.backgroundImage !== 'none') {
                        return true;
                    }
                    // Check if parent is a map thumbnail/placeholder
                    if (parent.classList && (
                        parent.classList.contains('map-thumbnail') ||
                        parent.classList.contains('map-placeholder')
                    )) {
                        return true;
                    }
                    parent = parent.parentElement;
                }
                return hasBackgroundImage || isManipulationHandle || isInResizable;
            });

            if (isBackgroundImage) {
                // console.log('ObjectSystem: ignoring click on background image (not in manipulation mode)');
                return; // Let the background image's own event handler deal with it
            }
        }

        // Also check if any token is currently being dragged - if so, ignore all ObjectSystem interactions
        if (window.multiplayerDragState && window.multiplayerDragState.size > 0) {
            console.log('ObjectSystem: ignoring interaction - token is being dragged');
            return;
        }

        // Only handle left clicks for dragging/selection
        if (e.button !== 0) return;

        // Handle pick-parent mode
        if (pickParentModeRef.current) {
            const canvasRect = canvasRef.current.getBoundingClientRect();
            const px = e.clientX - canvasRect.left;
            const py = e.clientY - canvasRect.top;
            const clickedObj = getObjectAtScreenPosition(px, py);
            if (clickedObj && clickedObj.id !== pendingChildId) {
                const mapId = getExplicitCurrentMapId();
                attachChildToParent(pendingChildId, clickedObj.id, mapId);
            }
            setPickParent(false);
            setPendingChild(null);
            return;
        }

        const canvasRect = canvasRef.current.getBoundingClientRect();
        const screenX = e.clientX - canvasRect.left;
        const screenY = e.clientY - canvasRect.top;

        // 1. Check handles (Delete, Rotate, Resize) on the CURRENTLY selected object FIRST!
        const currentlySelected = (environmentalObjects || []).find(o => o.selected);
        if (currentlySelected && !currentlySelected.locked && (isEditorMode || isGMMode)) {
            const objectDef = PROFESSIONAL_OBJECTS[currentlySelected.type];
            if (objectDef && objectDef.draggable) {
                const objScreenPos = getObjectScreenCenter(currentlySelected, objectDef);

                if (objScreenPos) {
                    const snappedDeg = snapRotationForHitTest(currentlySelected.type, currentlySelected.rotation || 0);
                    const rotRad = (snappedDeg || 0) * Math.PI / 180;
                    const bounds = getObjectScreenBounds(currentlySelected, objectDef, objScreenPos, {
                        gridSize,
                        effectiveZoom,
                        rotationRad: rotRad
                    });
                    const { deletePosition, rotatePosition } = getObjectSelectionHandles(bounds);

                    // Delete handle check (top)
                    if (Math.hypot(screenX - deletePosition.x, screenY - deletePosition.y) <= 22) {
                        e.stopPropagation();
                        e.preventDefault();
                        removeEnvironmentalObject(currentlySelected.id, getExplicitCurrentMapId());
                        setSelectedObject(null);
                        return;
                    }

                    // Rotate handle check (right side)
                    if (Math.hypot(screenX - rotatePosition.x, screenY - rotatePosition.y) <= 22) {
                        e.stopPropagation();
                        e.preventDefault();
                        setIsRotating(true);
                        let hasDragged = false;
                        const startX = screenX;
                        const startY = screenY;
                        const startAngle = Math.atan2(screenY - bounds.centerY, screenX - bounds.centerX);
                        const initialRotation = currentlySelected.rotation || 0;
                        const mapId = getExplicitCurrentMapId();

                        const handleDocRotateMove = (moveEvt) => {
                            const cRect = canvasRef.current?.getBoundingClientRect();
                            if (!cRect) return;
                            const mx = moveEvt.clientX - cRect.left;
                            const my = moveEvt.clientY - cRect.top;
                            if (Math.hypot(mx - startX, my - startY) > 3) {
                                hasDragged = true;
                            }
                            if (hasDragged) {
                                const curAngle = Math.atan2(my - bounds.centerY, mx - bounds.centerX);
                                const deltaDeg = ((curAngle - startAngle) * 180) / Math.PI;
                                let newRot = Math.round((initialRotation + deltaDeg) % 360 + 360) % 360;
                                if (moveEvt.shiftKey) {
                                    newRot = Math.round(newRot / 15) * 15;
                                }
                                updateEnvironmentalObject(currentlySelected.id, {
                                    ...currentlySelected,
                                    rotation: newRot
                                }, mapId);
                            }
                        };

                        const handleDocRotateUp = () => {
                            document.removeEventListener('mousemove', handleDocRotateMove);
                            document.removeEventListener('mouseup', handleDocRotateUp);
                            setIsRotating(false);
                            if (!hasDragged) {
                                // Immediate click without drag: rotate by +45 degrees clockwise
                                const newRot = Math.round((initialRotation + 45) % 360);
                                updateEnvironmentalObject(currentlySelected.id, {
                                    ...currentlySelected,
                                    rotation: newRot
                                }, mapId);
                            }
                        };

                        document.addEventListener('mousemove', handleDocRotateMove);
                        document.addEventListener('mouseup', handleDocRotateUp);
                        return;
                    }

                    // Resize handle check
                    const handle = getResizeHandle(screenX, screenY, currentlySelected);
                    if (handle) {
                        setIsResizing(true);
                        setResizeHandle(handle);
                        setInitialScale(currentlySelected.scale || 1);
                        setInitialMousePos({ x: screenX, y: screenY });
                        e.stopPropagation();
                        e.preventDefault();
                        return;
                    }
                }
            }
        }

        const clickedObject = getObjectAtScreenPosition(screenX, screenY);

        if (clickedObject) {
            // Check if chest is clicked and locked
            if (clickedObject.type === 'chest') {
                const isLocked = clickedObject.isLocked || clickedObject.containerProperties?.isLocked;
                if (isLocked && !isEditorMode) {
                    setActiveUnlockChest(clickedObject);
                    const { addChatNotification } = useChatStore.getState();
                    if (addChatNotification) {
                        addChatNotification({
                            type: 'warning',
                            content: 'The Treasure Chest is locked tight.',
                            timestamp: new Date().toISOString()
                        });
                    }
                    return;
                }
            }

            // In editor mode, allow all interactions
            // In GM mode (but not editor mode), only allow interactions with GM notes
            if (isEditorMode || (isGMMode && clickedObject.type === 'gmNotes')) {
                // Select the object
                selectEnvironmentalObject(clickedObject.id);

                const objectDef = PROFESSIONAL_OBJECTS[clickedObject.type];
                // Locked objects remain selectable (so they can be unlocked) but
                // never start a drag or resize gesture.
                if (objectDef && objectDef.draggable && !clickedObject.locked) {
                    const handle = getResizeHandle(screenX, screenY, clickedObject);

                    if (handle) {
                        setIsResizing(true);
                        setResizeHandle(handle);
                        setInitialScale(clickedObject.scale || 1);
                        setInitialMousePos({ x: screenX, y: screenY });
                        e.stopPropagation();
                    } else {
                        setIsDragging(true);
                        const worldPos = screenToWorld(screenX, screenY);
                        const offsetX = worldPos.x - clickedObject.worldX;
                        const offsetY = worldPos.y - clickedObject.worldY;
                        setDragOffset({ x: offsetX, y: offsetY });
                        dragStateRef.current = {
                            isDragging: true,
                            dragObjectId: clickedObject.id,
                            dragOffsetX: offsetX,
                            dragOffsetY: offsetY
                        };
                        e.preventDefault();

                        const handleDocMouseMove = (moveEvent) => {
                            const canvasRect = canvasRef.current?.getBoundingClientRect();
                            if (!canvasRect) return;
                            const mx = moveEvent.clientX - canvasRect.left;
                            const my = moveEvent.clientY - canvasRect.top;

                            let moveWorldPos;
                            try {
                                const gridSystem = getGridSystem();
                                const viewport = gridSystem.getViewportDimensions();
                                moveWorldPos = gridSystem.screenToWorld(mx, my, viewport.width, viewport.height);
                            } catch (error) {
                                const zoom = useGameStore.getState().zoomLevel * useGameStore.getState().playerZoom;
                                const cx = useGameStore.getState().cameraX;
                                const cy = useGameStore.getState().cameraY;
                                const cw = canvasRect.width || window.innerWidth;
                                const ch = canvasRect.height || window.innerHeight;
                                moveWorldPos = {
                                    x: ((mx - cw / 2) / zoom) + cx,
                                    y: ((my - ch / 2) / zoom) + cy
                                };
                            }

                            const newWorldX = moveWorldPos.x - dragStateRef.current.dragOffsetX;
                            const newWorldY = moveWorldPos.y - dragStateRef.current.dragOffsetY;
                            scheduleDragApply(() => {
                                const objectId = dragStateRef.current.dragObjectId;
                                if (!objectId) return;
                                const mapId = useMapStore.getState().currentMapId || 'default';
                                const currentObjects = useLevelEditorStore.getState().environmentalObjects;
                                const targetObj = currentObjects.find(o => o.id === objectId);
                                if (!targetObj) return;
                                const wallPatch = resolveDragWallPatch(targetObj, newWorldX, newWorldY);
                                useLevelEditorStore.getState().updateEnvironmentalObject(
                                    objectId,
                                    { ...targetObj, worldX: newWorldX, worldY: newWorldY, ...(wallPatch || {}) },
                                    mapId
                                );
                                updateAttachmentOffset(objectId, newWorldX, newWorldY, mapId);
                                moveChildrenWithParent(objectId, newWorldX, newWorldY, mapId);
                            });
                        };

                        const handleDocMouseUp = () => {
                            document.removeEventListener('mousemove', handleDocMouseMove);
                            document.removeEventListener('mouseup', handleDocMouseUp);
                            flushDragApply();
                            dragStateRef.current.isDragging = false;
                            dragStateRef.current.dragObjectId = null;
                            setIsDragging(false);
                            setDragOffset({ x: 0, y: 0 });
                        };

                        document.addEventListener('mousemove', handleDocMouseMove);
                        document.addEventListener('mouseup', handleDocMouseUp);
                        e.stopPropagation();
                    }
                }
            }
        } else {
            environmentalObjects.forEach(obj => {
                if (obj.selected) {
                    updateEnvironmentalObject(obj.id, { ...obj, selected: false }, getExplicitCurrentMapId());
                }
            });
        }
    }, [isEditorMode, isGMMode, getObjectAtScreenPosition, getResizeHandle, selectEnvironmentalObject, screenToWorld, environmentalObjects, updateEnvironmentalObject, pickParentMode, pendingChildId, attachChildToParent, moveChildrenWithParent, resolveDragWallPatch]);

    // Handle context menu (right-click)
    const handleContextMenu = useCallback((e) => {
        console.log('🎯 ObjectSystem context menu triggered:', { isEditorMode, isGMMode });

        // Allow context menu in editor mode OR for GM notes objects when in GM mode
        // BUT respect the objectManipulationEnabled toggle
        if (!isEditorMode && !isGMMode) {
            console.log('🎯 Context menu blocked: not in editor or GM mode');
            return;
        }
        if (!objectManipulationEnabled) return;

        // Check if the right-click is on a token, HUD element, or connection - if so, ignore it here
        // Use elementsFromPoint to get ALL elements at the click position (including those under the canvas)
        const target = e.target;
        const allElementsAtPoint = document.elementsFromPoint(e.clientX, e.clientY);
        const elementAtPoint = allElementsAtPoint[0];

        const isTokenOrHUD = (el) => {
            if (!el) return false;
            return (
                el.classList?.contains('creature-token') ||
                el.classList?.contains('character-token') ||
                el.closest?.('.creature-token') ||
                el.closest?.('.character-token') ||
                el.closest?.('.target-hud-frame') ||
                el.closest?.('.party-hud-frame') ||
                el.closest?.('.target-frame') ||
                el.closest?.('.party-member-frame')
            );
        };

        // Check ALL elements at the point (not just the top one) to find connections underneath the canvas
        const connectionElement = allElementsAtPoint.find(el => isConnectionElement(el));
        const hasTokenOrHUD = allElementsAtPoint.some(el => isTokenOrHUD(el));

        if (connectionElement) {
            console.log('� -  ObjectSystem: detected connection element, triggering its context menu', {
                connectionElement: {
                    tag: connectionElement.tagName,
                    classes: connectionElement.classList ? Array.from(connectionElement.classList) : [],
                    dataset: connectionElement.dataset
                },
                allElementsAtPoint: allElementsAtPoint.map(el => ({
                    tag: el.tagName,
                    classes: el.classList ? Array.from(el.classList) : [],
                    dataset: el.dataset
                }))
            });

            // Manually trigger the connection's context menu since the canvas intercepted the event
            // Create a new context menu event and dispatch it to the connection element
            const contextMenuEvent = new MouseEvent('contextmenu', {
                bubbles: true,
                cancelable: true,
                clientX: e.clientX,
                clientY: e.clientY,
                button: 2,
                buttons: 2
            });

            // Dispatch to the connection element so its handler runs
            connectionElement.dispatchEvent(contextMenuEvent);

            // Prevent default to stop our handler from continuing
            e.preventDefault();
            e.stopPropagation();
            return;
        }

        if (hasTokenOrHUD) {
            console.log('ObjectSystem: ignoring right-click on token or HUD element');
            return; // Let the token's or HUD's own event handler deal with it
        }

        e.preventDefault();

        const canvasRect = canvasRef.current.getBoundingClientRect();
        const screenX = e.clientX - canvasRect.left;
        const screenY = e.clientY - canvasRect.top;

        console.log('🎯 Context menu coordinates:', { screenX, screenY });

        const clickedObject = getObjectAtScreenPosition(screenX, screenY);
        console.log('🎯 Clicked object:', clickedObject);

        if (clickedObject) {
            if (isEditorMode || isGMMode) {
                console.log('🎯 Showing context menu for object:', clickedObject.id, clickedObject.type);
                selectEnvironmentalObject(clickedObject.id);
                setSelectedObject(clickedObject);
                setContextMenuPosition({ x: e.clientX, y: e.clientY });
                setShowContextMenu(true);
            } else {
                console.log('🎯 Context menu blocked: not in editor or GM mode', { isEditorMode, isGMMode, type: clickedObject.type });
            }
        } else {
            console.log('🎯 No object found at click position', { screenX, screenY });
        }
    }, [isEditorMode, isGMMode, getObjectAtScreenPosition, selectEnvironmentalObject]);

    // Handle Escape to cancel pick-parent mode
    useEffect(() => {
        if (!pickParentModeRef.current) return;
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                setPickParent(false);
                setPendingChild(null);
            }
        };
        document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, [pickParentMode]);

    // Handle removing selected object
    const handleRemoveObject = () => {
        if (selectedObject && !selectedObject.locked) {
            removeEnvironmentalObject(selectedObject.id, getExplicitCurrentMapId());
            setShowContextMenu(false);
            setSelectedObject(null);
        }
    };

    // Handle locking/unlocking the selected object so it cannot be moved
    const handleToggleObjectLock = () => {
        if (selectedObject) {
            const locked = !selectedObject.locked;
            setEnvironmentalObjectLocked(selectedObject.id, locked, getExplicitCurrentMapId());
            setSelectedObject({ ...selectedObject, locked });
            setShowContextMenu(false);
        }
    };

    // Handle reordering object
    const handleReorderObject = (action) => {
        if (selectedObject) {
            reorderEnvironmentalObject(selectedObject.id, action, getExplicitCurrentMapId());
            setShowContextMenu(false);
            setSelectedObject(null);
        }
    };

    // Handle opening GM Notes
    const handleOpenGMNotes = () => {
        if (selectedObject && selectedObject.type === 'gmNotes') {
            // Trigger the same event that TileOverlay uses to open GM Notes
            const openGMNotesEvent = new CustomEvent('openGMNotes', {
                detail: { object: selectedObject }
            });
            document.dispatchEvent(openGMNotesEvent);
            setShowContextMenu(false);
            setSelectedObject(null);
        }
    };

    const handleRotateObject = (degrees) => {
        if (selectedObject) {
            const currentRotation = selectedObject.rotation || 0;
            const newRotation = (currentRotation + degrees + 360) % 360;
            updateEnvironmentalObject(selectedObject.id, {
                ...selectedObject,
                rotation: newRotation
            }, getExplicitCurrentMapId());
            setSelectedObject({ ...selectedObject, rotation: newRotation });
            setShowContextMenu(false);
        }
    };

    const handleSetRotation = (degrees) => {
        if (selectedObject) {
            updateEnvironmentalObject(selectedObject.id, {
                ...selectedObject,
                rotation: degrees
            }, getExplicitCurrentMapId());
            setSelectedObject({ ...selectedObject, rotation: degrees });
            setShowContextMenu(false);
        }
    };

    const handleStartPickParent = () => {
        if (selectedObject) {
            setPendingChild(selectedObject.id);
            setPickParent(true);
            setShowContextMenu(false);
        }
    };

    const handleDetachFromParent = () => {
        if (selectedObject && selectedObject.parentObjectId) {
            detachFromParent(selectedObject.id, getExplicitCurrentMapId());
            setSelectedObject({ ...selectedObject, parentObjectId: undefined, attachOffsetX: undefined, attachOffsetY: undefined });
            setShowContextMenu(false);
        }
    };

    const handleMouseMove = useCallback((e) => {
        // If we're over a connection, the global listener has already disabled canvas pointer-events
        // So this handler won't even fire. But just in case, check and return early.
        if (isOverConnection) {
            return;
        }

        // Handle mouse move in editor mode OR GM mode (for GM notes hover)
        if (!isEditorMode && !isGMMode) {
            return;
        }

        // Don't handle mouse move if a token is being dragged
        if (window.multiplayerDragState && window.multiplayerDragState.size > 0) {
            return;
        }

        const mouseRect = canvasRef.current.getBoundingClientRect();
        const screenX = e.clientX - mouseRect.left;
        const screenY = e.clientY - mouseRect.top;

        // Check for hover over GM notes (works in both editor and GM mode)
        if (!isDragging && !isResizing) {
            const hoveredObject = getObjectAtScreenPosition(screenX, screenY);

            // Check if hovering over a GM note
            if (hoveredObject && hoveredObject.type === 'gmNotes' && (isEditorMode || isGMMode)) {
                if (hoveredGMNote?.id !== hoveredObject.id) {
                    setHoveredGMNote(hoveredObject);
                    setGmNoteTooltipPosition({ x: e.clientX, y: e.clientY });

                    // Dispatch event for TileOverlay to show tooltip
                    const hoverEvent = new CustomEvent('gmNoteHover', {
                        detail: {
                            gmNote: hoveredObject,
                            position: { x: e.clientX, y: e.clientY }
                        }
                    });
                    document.dispatchEvent(hoverEvent);
                } else {
                    // Update tooltip position
                    setGmNoteTooltipPosition({ x: e.clientX, y: e.clientY });
                    const hoverEvent = new CustomEvent('gmNoteHover', {
                        detail: {
                            gmNote: hoveredObject,
                            position: { x: e.clientX, y: e.clientY }
                        }
                    });
                    document.dispatchEvent(hoverEvent);
                }
            } else if (hoveredGMNote) {
                // No longer hovering over GM note
                setHoveredGMNote(null);
                const leaveEvent = new CustomEvent('gmNoteHoverLeave');
                document.dispatchEvent(leaveEvent);
            }

            // Check for hover over resize handles when not dragging/resizing (editor mode only)
            if (isEditorMode) {
                const selectedObject = environmentalObjects.find(obj => obj.selected);
                if (selectedObject && !selectedObject.locked) {
                    const handle = getResizeHandle(screenX, screenY, selectedObject);
                    setHoveredHandle(handle);
                } else {
                    setHoveredHandle(null);
                }
            }

            if (!isEditorMode && !isDragging) {
                return; // Don't continue with editor-specific logic (but allow dragging in GM mode)
            }
        }



        const selectedObject = environmentalObjects.find(obj => obj.selected);
        if (!selectedObject) return;

        if (isResizing && resizeHandle) {
            // Handle resizing
            const deltaX = screenX - initialMousePos.x;
            const deltaY = screenY - initialMousePos.y;

            // Calculate scale change based on distance from center
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            const scaleChange = distance / 100; // Adjust sensitivity

            let newScale = initialScale;

            // Determine if we're scaling up or down based on handle direction
            switch (resizeHandle) {
                case 'br': // Bottom-right: positive movement = scale up
                    newScale = initialScale + (deltaX + deltaY) / 200;
                    break;
                case 'tl': // Top-left: negative movement = scale up
                    newScale = initialScale - (deltaX + deltaY) / 200;
                    break;
                case 'tr': // Top-right: mixed movement
                    newScale = initialScale + (deltaX - deltaY) / 200;
                    break;
                case 'bl': // Bottom-left: mixed movement
                    newScale = initialScale + (-deltaX + deltaY) / 200;
                    break;
            }

            // Clamp scale between 0.5 and 3.0
            newScale = Math.max(0.5, Math.min(3.0, newScale));

            updateEnvironmentalObject(selectedObject.id, {
                ...selectedObject,
                scale: newScale
            }, getExplicitCurrentMapId());
        } else if (isDragging) {
            // Handle dragging
            e.stopPropagation();
            const worldPos = screenToWorld(screenX, screenY);
            const newWorldX = worldPos.x - dragOffset.x;
            const newWorldY = worldPos.y - dragOffset.y;
            const mapId = getExplicitCurrentMapId();

            updateEnvironmentalObject(selectedObject.id, {
                ...selectedObject,
                worldX: newWorldX,
                worldY: newWorldY
            }, mapId);

            updateAttachmentOffset(selectedObject.id, newWorldX, newWorldY, mapId);
            moveChildrenWithParent(selectedObject.id, newWorldX, newWorldY, mapId);
        }
    }, [isDragging, isResizing, resizeHandle, initialScale, initialMousePos, isEditorMode, isGMMode, isOverConnection, screenToWorld, environmentalObjects, dragOffset, updateEnvironmentalObject, getResizeHandle, getObjectAtScreenPosition, hoveredGMNote, moveChildrenWithParent, updateAttachmentOffset]);

    const handleMouseUp = useCallback(() => {
        // Don't handle mouse up if a token is being dragged
        if (window.multiplayerDragState && window.multiplayerDragState.size > 0) {
            return;
        }

        setIsDragging(false);
        setIsResizing(false);
        setResizeHandle(null);
        setDragOffset({ x: 0, y: 0 });
        setInitialScale(1);
        setInitialMousePos({ x: 0, y: 0 });
        dragStateRef.current.isDragging = false;
        dragStateRef.current.dragObjectId = null;

        // Reset connection tracking
        setIsOverConnection(false);
        connectionElementRef.current = null;
    }, []);

    // Global mouse move listener to detect connections and disable canvas pointer-events
    useEffect(() => {
        const handleGlobalMouseMove = (e) => {
            // Optimization: Skip heavy checks if the mouse isn't even over the canvas area
            // or if we're not in a state where we can interact with objects/connections
            if (!isEditorMode && !isGMMode) return;

            const canvas = canvasRef.current;
            if (!canvas) return;

            const rect = canvas.getBoundingClientRect();
            const isInCanvas = (
                e.clientX >= rect.left && 
                e.clientX <= rect.right && 
                e.clientY >= rect.top && 
                e.clientY <= rect.bottom
            );

            if (!isInCanvas) {
                // If we were over a connection but moved out of the canvas, reset
                if (isOverConnection) {
                    canvas.style.pointerEvents = (isEditorMode || isGMMode) ? 'auto' : 'none';
                    setIsOverConnection(false);
                    connectionElementRef.current = null;
                }
                return;
            }

            const allElementsAtPoint = document.elementsFromPoint(e.clientX, e.clientY);
            const connectionElement = allElementsAtPoint.find(el => isConnectionElement(el));

            if (connectionElement) {
                // Over a connection - disable canvas pointer events so connection can receive events
                if (canvasRef.current && !isOverConnection) {
                    canvasRef.current.style.pointerEvents = 'none';
                    setIsOverConnection(true);
                    connectionElementRef.current = connectionElement;
                }
            } else {
                // Not over a connection - re-enable canvas pointer events
                if (canvasRef.current && isOverConnection) {
                    canvasRef.current.style.pointerEvents = (isEditorMode || isGMMode) ? 'auto' : 'none';
                    setIsOverConnection(false);
                    connectionElementRef.current = null;
                }
            }
        };

        // Use capture phase to check before canvas receives the event
        document.addEventListener('mousemove', handleGlobalMouseMove, true);
        return () => {
            document.removeEventListener('mousemove', handleGlobalMouseMove, true);
        };
    }, [isOverConnection, isEditorMode, isGMMode, isConnectionElement, hoveredGMNote, getObjectAtScreenPosition]);

    // Document-level mouse listeners for GM note dragging in play mode
    // This ensures dragging works even when overlays or z-index issues prevent
    // the canvas from receiving mouse events directly
    useEffect(() => {
        if (!isGMMode) return;

        const handleDocMouseDown = (e) => {
            if (e.button !== 0) return;
            // While a level-editor tool other than 'select' is active (placing
            // objects, erasing, terrain, ...) the editor overlay owns canvas
            // clicks. Hijacking them here selected/dragged whatever sat under
            // the cursor, which made it impossible to place objects on top of
            // an existing object (e.g. a stool on a table).
            if (isEditorMode && useLevelEditorStore.getState().selectedTool !== 'select') return;
            if (e.target.closest('.unified-context-menu')) return;
            if (e.target.closest('.mythrill-window') ||
                e.target.closest('.level-editor-window') ||
                e.target.closest('.action-bar-container') ||
                e.target.closest('.modal-content') ||
                e.target.closest('.party-hud-frame') ||
                e.target.closest('.target-hud-frame')) {
                return;
            }
            if (!objectManipulationEnabled) return; // Respect the interaction lock
            if (window.multiplayerDragState && window.multiplayerDragState.size > 0) return;

            const canvas = canvasRef.current;
            if (!canvas) return;

            // Handle pick-parent mode
            if (pickParentModeRef.current) {
                const canvasRect = canvas.getBoundingClientRect();
                const px = e.clientX - canvasRect.left;
                const py = e.clientY - canvasRect.top;
                const objects = useLevelEditorStore.getState().environmentalObjects;
                const gridSystem = getGridSystem();
                const viewport = gridSystem.getViewportDimensions();
                const currentZoom = useGameStore.getState().zoomLevel * useGameStore.getState().playerZoom;
                let clickedObj = null;
                for (const obj of objects) {
                    const objectDef = PROFESSIONAL_OBJECTS[obj.type];
                    if (!objectDef) continue;
                    let screenPos;
                    if (obj.freePosition && obj.worldX !== undefined && obj.worldY !== undefined) {
                        screenPos = gridSystem.worldToScreen(obj.worldX, obj.worldY, viewport.width, viewport.height);
                    } else { continue; }
                    const tileSize = useGameStore.getState().gridSize * currentZoom;
                    const scale = obj.scale || 1;
                    const objW = (objectDef.size.width || 1) * tileSize * scale;
                    const objH = (objectDef.size.height || 1) * tileSize * scale;
                    const padding = Math.max(10, tileSize * 0.1);
                    if (px >= screenPos.x - objW/2 - padding && px <= screenPos.x + objW/2 + padding &&
                        py >= screenPos.y - objH/2 - padding && py <= screenPos.y + objH/2 + padding) {
                        clickedObj = obj;
                        break;
                    }
                }
                if (clickedObj && clickedObj.id !== pendingChildIdRef.current) {
                    const mapId = useMapStore.getState().currentMapId || 'default';
                    useLevelEditorStore.getState().attachChildToParent(pendingChildIdRef.current, clickedObj.id, mapId);
                }
                setPickParent(false);
                setPendingChild(null);
                e.preventDefault();
                e.stopPropagation();
                return;
            }

            const canvasRect = canvas.getBoundingClientRect();
            const screenX = e.clientX - canvasRect.left;
            const screenY = e.clientY - canvasRect.top;

            const currentZoom = useGameStore.getState().zoomLevel * useGameStore.getState().playerZoom;
            const camX = useGameStore.getState().cameraX;
            const camY = useGameStore.getState().cameraY;
            const objects = useLevelEditorStore.getState().environmentalObjects;

            const gridSystem = getGridSystem();
            const viewport = gridSystem.getViewportDimensions();
            const gridSize = useGameStore.getState().gridSize;

            const handleDocMouseMove = (moveEvent) => {
                if (!dragStateRef.current.isDragging && !dragStateRef.current.isResizing) return;
                moveEvent.preventDefault();

                const cr = canvasRef.current?.getBoundingClientRect();
                if (!cr) return;
                const mx = moveEvent.clientX - cr.left;
                const my = moveEvent.clientY - cr.top;

                const mapId = getExplicitCurrentMapId();
                const currentObjects = useLevelEditorStore.getState().environmentalObjects;
                const targetObj = currentObjects.find(o => o.id === dragStateRef.current.dragObjectId);
                if (!targetObj) return;

                if (dragStateRef.current.isResizing) {
                    const currentMousePos = { x: mx, y: my };
                    const initialMousePos = dragStateRef.current.initialMousePos;
                    const initialScale = dragStateRef.current.initialScale || 1;
                    const objPos = dragStateRef.current.objScreenPos;

                    const initialDistance = Math.hypot(initialMousePos.x - objPos.x, initialMousePos.y - objPos.y);
                    const currentDistance = Math.hypot(currentMousePos.x - objPos.x, currentMousePos.y - objPos.y);

                    if (initialDistance > 0) {
                        let scaleFactor = currentDistance / initialDistance;
                        let newScale = Math.round(initialScale * scaleFactor * 10) / 10;
                        newScale = Math.max(0.2, Math.min(5.0, newScale));
                        scheduleDragApply(() => {
                            const objectId = dragStateRef.current.dragObjectId;
                            if (!objectId) return;
                            const latest = useLevelEditorStore.getState().environmentalObjects.find(o => o.id === objectId);
                            if (!latest) return;
                            updateEnvironmentalObject(objectId, { ...latest, scale: newScale }, mapId);
                        });
                    }
                } else if (dragStateRef.current.isDragging) {
                    let moveWorldPos;
                    try {
                        const gridSystem = getGridSystem();
                        const viewport = gridSystem.getViewportDimensions();
                        moveWorldPos = gridSystem.screenToWorld(mx, my, viewport.width, viewport.height);
                    } catch (error) {
                        const zoom = useGameStore.getState().zoomLevel * useGameStore.getState().playerZoom;
                        const cx = useGameStore.getState().cameraX;
                        const cy = useGameStore.getState().cameraY;
                        moveWorldPos = { x: ((mx - cr.width / 2) / zoom) + cx, y: ((my - cr.height / 2) / zoom) + cy };
                    }

                    const newWorldX = moveWorldPos.x - dragStateRef.current.dragOffsetX;
                    const newWorldY = moveWorldPos.y - dragStateRef.current.dragOffsetY;
                    scheduleDragApply(() => {
                        const objectId = dragStateRef.current.dragObjectId;
                        if (!objectId) return;
                        const latest = useLevelEditorStore.getState().environmentalObjects.find(o => o.id === objectId);
                        if (!latest) return;
                        const wallPatch = resolveDragWallPatch(latest, newWorldX, newWorldY);
                        updateEnvironmentalObject(objectId, { ...latest, worldX: newWorldX, worldY: newWorldY, ...(wallPatch || {}) }, mapId);
                        updateAttachmentOffset(objectId, newWorldX, newWorldY, mapId);
                        moveChildrenWithParent(objectId, newWorldX, newWorldY, mapId);
                    });
                }
            };

            const handleDocMouseUp = () => {
                document.removeEventListener('mousemove', handleDocMouseMove);
                document.removeEventListener('mouseup', handleDocMouseUp);
                flushDragApply();
                setIsDragging(false);
                setIsResizing(false);
                setResizeHandle(null);
                dragStateRef.current.isDragging = false;
                dragStateRef.current.isResizing = false;
                dragStateRef.current.dragObjectId = null;
            };

            // 1. HANDLE CHECK (Priority #1) - Delete, Rotate, Resize on the selected object
            const selObj = objects.find(o => o.selected);
            if (selObj && !selObj.locked && (isEditorMode || isGMMode)) {
                const selDef = PROFESSIONAL_OBJECTS[selObj.type];
                if (selDef && selDef.draggable) {
                    const selScreenPos = getObjectScreenCenter(selObj, selDef);
                    if (selScreenPos) {
                        const curScale = selObj.scale || 1;
                        const snappedDeg = snapRotationForHitTest(selObj.type, selObj.rotation || 0);
                        const rotRad = (snappedDeg || 0) * Math.PI / 180;
                        const selBounds = getObjectScreenBounds(selObj, selDef, selScreenPos, {
                            gridSize,
                            effectiveZoom: currentZoom,
                            rotationRad: rotRad
                        });
                        const { deletePosition, rotatePosition } = getObjectSelectionHandles(selBounds);

                        // Delete Handle (top)
                        if (Math.hypot(screenX - deletePosition.x, screenY - deletePosition.y) <= 22) {
                            e.preventDefault();
                            e.stopPropagation();
                            removeEnvironmentalObject(selObj.id, getExplicitCurrentMapId());
                            useLevelEditorStore.getState().clearObjectSelection();
                            return;
                        }

                        // Rotate Handle (right side)
                        if (Math.hypot(screenX - rotatePosition.x, screenY - rotatePosition.y) <= 22) {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsRotating(true);
                            let hasDragged = false;
                            const startX = screenX;
                            const startY = screenY;
                            const startAngle = Math.atan2(screenY - selBounds.centerY, screenX - selBounds.centerX);
                            const initialRotation = selObj.rotation || 0;
                            const mapId = getExplicitCurrentMapId();

                            const handleDocRotateMove = (moveEvt) => {
                                const cRect = canvas.getBoundingClientRect();
                                if (!cRect) return;
                                const mx = moveEvt.clientX - cRect.left;
                                const my = moveEvt.clientY - cRect.top;
                                if (Math.hypot(mx - startX, my - startY) > 3) {
                                    hasDragged = true;
                                }
                                if (hasDragged) {
                                    const curAngle = Math.atan2(my - selBounds.centerY, mx - selBounds.centerX);
                                    const deltaDeg = ((curAngle - startAngle) * 180) / Math.PI;
                                    let newRot = Math.round((initialRotation + deltaDeg) % 360 + 360) % 360;
                                    if (moveEvt.shiftKey) {
                                        newRot = Math.round(newRot / 15) * 15;
                                    }
                                    updateEnvironmentalObject(selObj.id, {
                                        ...selObj,
                                        rotation: newRot
                                    }, mapId);
                                }
                            };

                            const handleDocRotateUp = () => {
                                document.removeEventListener('mousemove', handleDocRotateMove, true);
                                document.removeEventListener('mouseup', handleDocRotateUp, true);
                                setIsRotating(false);
                                if (!hasDragged) {
                                    const newRot = Math.round((initialRotation + 45) % 360);
                                    updateEnvironmentalObject(selObj.id, {
                                        ...selObj,
                                        rotation: newRot
                                    }, mapId);
                                }
                            };

                            document.addEventListener('mousemove', handleDocRotateMove, true);
                            document.addEventListener('mouseup', handleDocRotateUp, true);
                            return;
                        }

                        // Resize Handles
                        const handleId = getResizeHandle(screenX, screenY, selObj);
                        if (handleId) {
                            setIsResizing(true);
                            setResizeHandle(handleId);
                            dragStateRef.current = {
                                isDragging: false, isResizing: true,
                                resizeHandle: handleId, dragObjectId: selObj.id,
                                initialScale: curScale,
                                initialMousePos: { x: screenX, y: screenY },
                                objScreenPos: { x: selBounds.centerX, y: selBounds.centerY }
                            };
                            document.addEventListener('mousemove', handleDocMouseMove);
                            document.addEventListener('mouseup', handleDocMouseUp);
                            e.preventDefault();
                            e.stopPropagation();
                            return;
                        }
                    }
                }
            }

            // 2. Find if we clicked an object
            let clickedObject = null;
            for (const obj of objects) {
                const objectDef = PROFESSIONAL_OBJECTS[obj.type];
                if (!objectDef || (!isEditorMode && !isGMMode)) continue;

                let screenPos;
                if (obj.freePosition && obj.worldX !== undefined && obj.worldY !== undefined) {
                    screenPos = gridSystem.worldToScreen(obj.worldX, obj.worldY, viewport.width, viewport.height);
                } else if (obj.gridX !== undefined && obj.gridY !== undefined) {
                    const worldCorner = gridSystem.gridToWorldCorner(obj.gridX, obj.gridY);
                    screenPos = gridSystem.worldToScreen(worldCorner.x + gridSize / 2, worldCorner.y + gridSize / 2, viewport.width, viewport.height);
                } else continue;

                const tileSize = gridSize * currentZoom;
                const scale = obj.scale || 1;
                const objWidth = (objectDef.size.width || 1) * tileSize * scale;
                const objHeight = (objectDef.size.height || 1) * tileSize * scale;
                const padding = Math.max(10, tileSize * 0.1);
                
                if (screenX >= screenPos.x - objWidth/2 - padding && screenX <= screenPos.x + objWidth/2 + padding &&
                    screenY >= screenPos.y - objHeight/2 - padding && screenY <= screenPos.y + objHeight/2 + padding) {
                    clickedObject = obj;
                    break; 
                }
            }

            // 3. DESELECT (Priority #3) - Only if clicking the empty grid
            if (!clickedObject) {
                const anySelected = objects.find(o => o.selected);
                if (anySelected) useLevelEditorStore.getState().clearObjectSelection();
                return;
            }

            const objectDef = PROFESSIONAL_OBJECTS[clickedObject.type];
            if (!objectDef) return;

            e.preventDefault(); e.stopPropagation();
            useLevelEditorStore.getState().selectEnvironmentalObject(clickedObject.id);
            // Locked objects stay selectable but cannot be dragged.
            if (!objectDef.draggable || clickedObject.locked) return;

            let worldPos;
            try { worldPos = gridSystem.screenToWorld(screenX, screenY, viewport.width, viewport.height); }
            catch (err) { worldPos = { x: ((screenX-canvasRect.width/2)/currentZoom)+camX, y: ((screenY-canvasRect.height/2)/currentZoom)+camY }; }

            const curWX = clickedObject.freePosition ? clickedObject.worldX : (clickedObject.gridX * gridSize);
            const curWY = clickedObject.freePosition ? clickedObject.worldY : (clickedObject.gridY * gridSize);

            setIsDragging(true);
            setIsResizing(false);
            dragStateRef.current = {
                isDragging: true, isResizing: false,
                dragObjectId: clickedObject.id,
                dragOffsetX: worldPos.x - curWX,
                dragOffsetY: worldPos.y - curWY
            };
            document.addEventListener('mousemove', handleDocMouseMove);
            document.addEventListener('mouseup', handleDocMouseUp);
        };

        document.addEventListener('mousedown', handleDocMouseDown, true);
        return () => {
            document.removeEventListener('mousedown', handleDocMouseDown, true);
        };
    }, [isGMMode, isEditorMode, getObjectScreenCenter, getResizeHandle, removeEnvironmentalObject, updateEnvironmentalObject, resolveDragWallPatch]);

    // FIXED: Use RAF for smooth object rendering - no throttling to prevent floating
    const scheduledRenderRef = useRef(null);

    // Update canvas when dependencies change using RAF (no artificial throttling)
    useEffect(() => {
        // Cancel any pending render
        if (scheduledRenderRef.current) {
            cancelAnimationFrame(scheduledRenderRef.current);
        }

        // Schedule render for next frame - this naturally caps at 60fps
        scheduledRenderRef.current = requestAnimationFrame(() => {
            renderObjects();
            scheduledRenderRef.current = null;
        });

        return () => {
            if (scheduledRenderRef.current) {
                cancelAnimationFrame(scheduledRenderRef.current);
                scheduledRenderRef.current = null;
            }
        };
    }, [renderObjects, cameraX, cameraY, effectiveZoom]);

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            renderObjects();
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [renderObjects]);

    // Context-menu actions that mutate a locked object stay disabled until it is unlocked.
    const lockedActionGuards = selectedObject?.locked
        ? { disabled: true, tooltip: 'Unlock this object first' }
        : {};


    return (
        <>
            <canvas
                ref={canvasRef}
                className="object-system-canvas"
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 20,
                    // Enable interaction in editor mode OR when GM mode is active (for GM notes access)
                    // Connections (z-index 150) will be on top and receive their own events
                    // We check for connections in all event handlers to avoid blocking them
                    pointerEvents: (isEditorMode || isGMMode) ? 'auto' : 'none',
                    cursor: isDragging ? 'grabbing' :
                        isResizing ? getCursorForHandle(resizeHandle) :
                            hoveredHandle ? getCursorForHandle(hoveredHandle) : 'pointer'
                }}
                onMouseLeave={(e) => {
                    // Reset connection tracking when mouse leaves canvas
                    if (isOverConnection && connectionElementRef.current) {
                        const mouseLeaveEvent = new MouseEvent('mouseleave', {
                            bubbles: true,
                            cancelable: true,
                            clientX: e.clientX,
                            clientY: e.clientY,
                            view: window
                        });
                        connectionElementRef.current.dispatchEvent(mouseLeaveEvent);
                        setIsOverConnection(false);
                        connectionElementRef.current = null;
                    }
                    // Clear GM note hover
                    if (hoveredGMNote) {
                        setHoveredGMNote(null);
                        const leaveEvent = new CustomEvent('gmNoteHoverLeave');
                        document.dispatchEvent(leaveEvent);
                    }
                    handleMouseUp();
                }}
                onMouseDown={(e) => {
                    console.log('🎯 Canvas MouseDown');
                    handleMouseDown(e);
                }}
                onContextMenu={(e) => {
                    console.log('🎯 Canvas ContextMenu');
                    handleContextMenu(e);
                }}
            />

            {/* Context Menu - Rendered via Portal to ensure it is always on top of the canvas and other grid layers */}
            {showContextMenu && selectedObject && ReactDOM.createPortal(
                <UnifiedContextMenu
                    visible={showContextMenu}
                    x={contextMenuPosition.x}
                    y={contextMenuPosition.y}
                    onClose={closeContextMenu}
                    title={PROFESSIONAL_OBJECTS[selectedObject.type]?.name || selectedObject.type}
                    items={[
                        {
                            icon: <i className={`fas ${selectedObject.locked ? 'fa-lock-open' : 'fa-lock'}`}></i>,
                            label: selectedObject.locked ? 'Unlock Object' : 'Lock Object',
                            tooltip: selectedObject.locked
                                ? 'Allow this object to be moved again'
                                : 'Prevent this object from being moved, resized, rotated or removed',
                            onClick: handleToggleObjectLock
                        },
                        {
                            type: 'separator'
                        },
                        ...(selectedObject.type === 'gmNotes' ? [
                            {
                                icon: <i className="fas fa-scroll"></i>,
                                label: 'Open GM Notes',
                                onClick: handleOpenGMNotes,
                                className: 'primary-action'
                            },
                            {
                                type: 'separator'
                            }
                        ] : []),
                        ...(selectedObject.type === 'chest' ? [
                            {
                                icon: <i className={`fas ${(selectedObject.isLocked || selectedObject.containerProperties?.isLocked) ? 'fa-lock' : 'fa-lock-open'}`}></i>,
                                label: (selectedObject.isLocked || selectedObject.containerProperties?.isLocked) ? 'Unlock Chest' : 'Lock Chest',
                                onClick: () => {
                                    const nowLocked = !(selectedObject.isLocked || selectedObject.containerProperties?.isLocked);
                                    updateEnvironmentalObject(selectedObject.id, {
                                        ...selectedObject,
                                        isLocked: nowLocked,
                                        containerProperties: {
                                            ...(selectedObject.containerProperties || {}),
                                            isLocked: nowLocked
                                        }
                                    }, getExplicitCurrentMapId());
                                    setShowContextMenu(false);
                                }
                            },
                            {
                                icon: <i className="fas fa-sliders-h"></i>,
                                label: 'Lock & Container Settings',
                                onClick: () => {
                                    setActiveLockSettingsChest(selectedObject);
                                    setShowContextMenu(false);
                                }
                            },
                            {
                                icon: <i className="fas fa-key"></i>,
                                label: 'Attempt Lockpick (Test)',
                                onClick: () => {
                                    setActiveUnlockChest(selectedObject);
                                    setShowContextMenu(false);
                                }
                            },
                            {
                                icon: <i className={`fas ${selectedObject.isOpen ? 'fa-box' : 'fa-box-open'}`}></i>,
                                label: selectedObject.isOpen ? 'Close Lid' : 'Open Lid',
                                onClick: () => {
                                    updateEnvironmentalObject(selectedObject.id, {
                                        ...selectedObject,
                                        isOpen: !selectedObject.isOpen
                                    }, getExplicitCurrentMapId());
                                    setShowContextMenu(false);
                                }
                            },
                            {
                                type: 'separator'
                            }
                        ] : []),
                        {
                            icon: <i className="fas fa-layer-group"></i>,
                            label: 'Layering',
                            submenu: [
                                {
                                    icon: <i className="fas fa-angle-double-up"></i>,
                                    label: 'Move to Front',
                                    onClick: () => handleReorderObject('to_front')
                                },
                                {
                                    icon: <i className="fas fa-angle-up"></i>,
                                    label: 'Bring Forward',
                                    onClick: () => handleReorderObject('forward')
                                },
                                {
                                    icon: <i className="fas fa-angle-down"></i>,
                                    label: 'Send Backward',
                                    onClick: () => handleReorderObject('backward')
                                },
                                {
                                    icon: <i className="fas fa-angle-double-down"></i>,
                                    label: 'Move to Back',
                                    onClick: () => handleReorderObject('to_back')
                                }
                            ]
                        },
                        {
                            icon: <i className="fas fa-sync-alt"></i>,
                            label: 'Rotate',
                            submenu: [
                                {
                                    icon: <i className="fas fa-undo"></i>,
                                    label: 'Rotate Left 45\u00B0',
                                    onClick: () => handleRotateObject(-45),
                                    ...lockedActionGuards
                                },
                                {
                                    icon: <i className="fas fa-redo"></i>,
                                    label: 'Rotate Right 45\u00B0',
                                    onClick: () => handleRotateObject(45),
                                    ...lockedActionGuards
                                },
                                {
                                    icon: <i className="fas fa-undo"></i>,
                                    label: 'Rotate Left 90\u00B0',
                                    onClick: () => handleRotateObject(-90),
                                    ...lockedActionGuards
                                },
                                {
                                    icon: <i className="fas fa-redo"></i>,
                                    label: 'Rotate Right 90\u00B0',
                                    onClick: () => handleRotateObject(90),
                                    ...lockedActionGuards
                                },
                                { type: 'separator' },
                                {
                                    icon: <i className="fas fa-arrow-up"></i>,
                                    label: '0\u00B0',
                                    onClick: () => handleSetRotation(0),
                                    ...lockedActionGuards
                                },
                                {
                                    icon: <i className="fas fa-arrow-right"></i>,
                                    label: '90\u00B0',
                                    onClick: () => handleSetRotation(90),
                                    ...lockedActionGuards
                                },
                                {
                                    icon: <i className="fas fa-arrow-down"></i>,
                                    label: '180\u00B0',
                                    onClick: () => handleSetRotation(180),
                                    ...lockedActionGuards
                                },
                                {
                                    icon: <i className="fas fa-arrow-left"></i>,
                                    label: '270\u00B0',
                                    onClick: () => handleSetRotation(270),
                                    ...lockedActionGuards
                                }
                            ]
                        },
                        {
                            type: 'separator'
                        },
                        ...(selectedObject.parentObjectId ? [
                            {
                                icon: <i className="fas fa-unlink"></i>,
                                label: 'Detach from Parent',
                                onClick: handleDetachFromParent
                            }
                        ] : []),
                        {
                            icon: <i className="fas fa-link"></i>,
                            label: 'Attach to Object...',
                            onClick: handleStartPickParent,
                            tooltip: selectedObject.parentObjectId ? 'Change parent' : 'Click another object to attach'
                        },
                        {
                            type: 'separator'
                        },
                        {
                            icon: <i className="fas fa-trash"></i>,
                            label: 'Remove',
                            onClick: handleRemoveObject,
                            className: 'danger-action',
                            ...lockedActionGuards
                        },
                        {
                            type: 'separator'
                        },
                        {
                            icon: <i className="fas fa-times"></i>,
                            label: 'Cancel',
                            onClick: () => {
                                setShowContextMenu(false);
                                setSelectedObject(null);
                            }
                        }
                    ]}
                />,
                document.body
            )}

            {/* Pick-parent mode overlay hint */}
            {pickParentMode && (
                <div
                    style={{
                        position: 'fixed',
                        top: 60,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: 'rgba(0, 40, 80, 0.92)',
                        color: '#fff',
                        padding: '10px 24px',
                        borderRadius: 8,
                        fontSize: 14,
                        fontWeight: 'bold',
                        zIndex: 999999999,
                        pointerEvents: 'none',
                        border: '2px solid #44aaff',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10
                    }}
                >
                    <i className="fas fa-link" style={{ color: '#44aaff' }}></i>
                    Click an object to attach to (or press Escape to cancel)
                </div>
            )}

            {/* Unlock Chest Modal (Player Lockpick / Password) */}
            {activeUnlockChest && (
                <UnlockContainerModal
                    container={{
                        ...activeUnlockChest,
                        name: activeUnlockChest.name || 'Treasure Chest',
                        containerProperties: {
                            isLocked: activeUnlockChest.isLocked ?? true,
                            lockType: activeUnlockChest.containerProperties?.lockType || activeUnlockChest.lockType || 'thievery',
                            lockDC: activeUnlockChest.containerProperties?.lockDC || activeUnlockChest.lockDC || 15,
                            lockCode: activeUnlockChest.containerProperties?.lockCode || activeUnlockChest.lockCode || '',
                            flavorText: activeUnlockChest.containerProperties?.flavorText || 'A sturdy iron-bound chest.',
                            maxAttempts: activeUnlockChest.containerProperties?.maxAttempts || 3,
                            failureAction: activeUnlockChest.containerProperties?.failureAction || 'none',
                            failureActionDetails: activeUnlockChest.containerProperties?.failureActionDetails || {},
                            ...(activeUnlockChest.containerProperties || {})
                        }
                    }}
                    onSuccess={(unlockedObj) => {
                        const chestId = unlockedObj?.id || activeUnlockChest.id;
                        const current = (environmentalObjects || []).find(o => o.id === chestId);
                        if (current) {
                            const updatedProps = {
                                ...(current.containerProperties || {}),
                                ...(unlockedObj?.containerProperties || {}),
                                isLocked: false
                            };
                            updateEnvironmentalObject(chestId, {
                                ...current,
                                isLocked: false,
                                isOpen: true,
                                containerProperties: updatedProps
                            }, getExplicitCurrentMapId());
                        }
                        setActiveUnlockChest(null);

                        const { addChatNotification } = useChatStore.getState();
                        if (addChatNotification) {
                            addChatNotification({
                                type: 'interaction',
                                content: 'Treasure Chest was successfully picked and opened!',
                                timestamp: new Date().toISOString()
                            });
                        }
                    }}
                    onClose={() => setActiveUnlockChest(null)}
                />
            )}

            {/* Lock & Container Settings Modal (GM Only) */}
            {activeLockSettingsChest && isGMMode && (
                <LockSettingsModal
                    container={{
                        ...activeLockSettingsChest,
                        name: activeLockSettingsChest.name || 'Treasure Chest',
                        containerProperties: {
                            isLocked: activeLockSettingsChest.isLocked || false,
                            lockType: activeLockSettingsChest.containerProperties?.lockType || 'thievery',
                            lockDC: activeLockSettingsChest.containerProperties?.lockDC || 15,
                            lockCode: activeLockSettingsChest.containerProperties?.lockCode || '',
                            flavorText: activeLockSettingsChest.containerProperties?.flavorText || '',
                            maxAttempts: activeLockSettingsChest.containerProperties?.maxAttempts || 3,
                            failureAction: activeLockSettingsChest.containerProperties?.failureAction || 'none',
                            failureActionDetails: activeLockSettingsChest.containerProperties?.failureActionDetails || {},
                            ...(activeLockSettingsChest.containerProperties || {})
                        }
                    }}
                    onSave={(settings) => {
                        const chestId = activeLockSettingsChest.id;
                        const current = (environmentalObjects || []).find(o => o.id === chestId);
                        if (current) {
                            updateEnvironmentalObject(chestId, {
                                ...current,
                                isLocked: settings.isLocked,
                                containerProperties: {
                                    ...(current.containerProperties || {}),
                                    ...settings
                                }
                            }, getExplicitCurrentMapId());
                        }
                        setActiveLockSettingsChest(null);
                    }}
                    onClose={() => setActiveLockSettingsChest(null)}
                />
            )}
        </>
    );
};

export default ObjectSystem;
