import React, { useRef, useEffect, useCallback, useState } from 'react';
import ReactDOM from 'react-dom';
import useLevelEditorStore from '../../../store/levelEditorStore';
import useGameStore from '../../../store/gameStore';
import useMapStore from '../../../store/mapStore';
import { getGridSystem } from '../../../utils/InfiniteGridSystem';
import UnifiedContextMenu from '../UnifiedContextMenu';
import { drawObject, hasObjectArt } from './ObjectCanvasRenderer';
import { drawObjectArt } from './PixelArtRenderer';

const snapRotationForHitTest = (type, rotation) => {
    // Snap rotation to the nearest 90� for any object that has a sprite.
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
    // ===== Furniture =====
    misc_box: {
        id: 'misc_box',
        name: 'Treasure Chest',
        image: SPRITE('misc_box'),
        category: 'furniture',
        size: { width: 1, height: 1 },
        description: 'A wooden chest for treasures',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: true
    },
    shop_potions: {
        id: 'shop_potions',
        name: 'Shop Counter',
        image: SPRITE('shop_potions'),
        category: 'furniture',
        size: { width: 2, height: 1 },
        description: 'A merchant counter',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: true
    },
    statue_base: {
        id: 'statue_base',
        name: 'Stone Statue',
        image: SPRITE('statue_base'),
        category: 'furniture',
        size: { width: 1, height: 1 },
        description: 'A carved stone statue',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: true
    },
    silver_statue: {
        id: 'silver_statue',
        name: 'Silver Statue',
        image: SPRITE('silver_statue'),
        category: 'furniture',
        size: { width: 1, height: 1 },
        description: 'A gleaming silver statue',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: true
    },
    dark_vine_statue_base: {
        id: 'dark_vine_statue_base',
        name: 'Dark Statue',
        image: SPRITE('dark_vine_statue_base'),
        category: 'furniture',
        size: { width: 1, height: 1 },
        description: 'A dark vine-wrapped statue',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: true
    },
    light_vine_statue_base: {
        id: 'light_vine_statue_base',
        name: 'Light Statue',
        image: SPRITE('light_vine_statue_base'),
        category: 'furniture',
        size: { width: 1, height: 1 },
        description: 'A light vine-wrapped statue',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: true
    },
    orange_crystal_statue: {
        id: 'orange_crystal_statue',
        name: 'Crystal Statue',
        image: SPRITE('orange_crystal_statue'),
        category: 'furniture',
        size: { width: 1, height: 1 },
        description: 'A statue carved from orange crystal',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: true
    },
    ice_statue: {
        id: 'ice_statue',
        name: 'Ice Statue',
        image: SPRITE('ice_statue'),
        category: 'furniture',
        size: { width: 1, height: 1 },
        description: 'A frozen ice statue',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: true
    },
    firespitter_statue: {
        id: 'firespitter_statue',
        name: 'Fire Statue',
        image: SPRITE('firespitter_statue'),
        category: 'furniture',
        size: { width: 1, height: 1 },
        description: 'A statue breathing fire',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: true
    },
    elephant_statue: {
        id: 'elephant_statue',
        name: 'Elephant Statue',
        image: SPRITE('elephant_statue'),
        category: 'furniture',
        size: { width: 2, height: 2 },
        description: 'A massive stone elephant',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: true
    },
    bone: {
        id: 'bone',
        name: 'Bone',
        image: SPRITE('bone'),
        category: 'furniture',
        size: { width: 0.5, height: 0.5 },
        description: 'A scattered bone',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: true
    },
    flying_skull: {
        id: 'flying_skull',
        name: 'Skull',
        image: SPRITE('flying_skull'),
        category: 'furniture',
        size: { width: 0.5, height: 0.5 },
        description: 'A floating skull',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: true
    },
    curse_skull: {
        id: 'curse_skull',
        name: 'Cursed Skull',
        image: SPRITE('curse_skull'),
        category: 'furniture',
        size: { width: 0.5, height: 0.5 },
        description: 'A cursed floating skull',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: true
    },

    // ===== Props =====
    gold_pile: {
        id: 'gold_pile',
        name: 'Treasure Pile',
        image: SPRITE('gold_pile'),
        category: 'props',
        size: { width: 1, height: 1 },
        description: 'A pile of gold',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: true
    },
    misc_lamp: {
        id: 'misc_lamp',
        name: 'Brass Lamp',
        image: SPRITE('misc_lamp'),
        category: 'props',
        size: { width: 0.5, height: 0.5 },
        description: 'A small brass lamp',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: true
    },
    misc_lantern: {
        id: 'misc_lantern',
        name: 'Lantern',
        image: SPRITE('misc_lantern'),
        category: 'props',
        size: { width: 0.5, height: 0.5 },
        description: 'A handheld lantern',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: true
    },
    misc_orb: {
        id: 'misc_orb',
        name: 'Crystal Orb',
        image: SPRITE('misc_orb'),
        category: 'props',
        size: { width: 0.5, height: 0.5 },
        description: 'A glowing crystal orb',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: true
    },
    misc_bottle: {
        id: 'misc_bottle',
        name: 'Bottle',
        image: SPRITE('misc_bottle'),
        category: 'props',
        size: { width: 0.4, height: 0.4 },
        description: 'A glass bottle',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: true
    },
    misc_stone: {
        id: 'misc_stone',
        name: 'Rune Stone',
        image: SPRITE('misc_stone'),
        category: 'props',
        size: { width: 0.5, height: 0.5 },
        description: 'A stone with carved runes',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: true
    },
    misc_crystal: {
        id: 'misc_crystal',
        name: 'Mystic Crystal',
        image: SPRITE('misc_crystal'),
        category: 'props',
        size: { width: 0.5, height: 0.5 },
        description: 'A glowing mystic crystal',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: true
    },
    dngn_sparkling_fountain: {
        id: 'dngn_sparkling_fountain',
        name: 'Sparkling Fountain',
        image: SPRITE('dngn_sparkling_fountain'),
        category: 'props',
        size: { width: 2, height: 2 },
        description: 'A fountain of sparkling water',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: true
    },
    dngn_blue_fountain: {
        id: 'dngn_blue_fountain',
        name: 'Blue Fountain',
        image: SPRITE('dngn_blue_fountain'),
        category: 'props',
        size: { width: 2, height: 2 },
        description: 'A blue-water fountain',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: true
    },
    dngn_blood_fountain: {
        id: 'dngn_blood_fountain',
        name: 'Blood Fountain',
        image: SPRITE('dngn_blood_fountain'),
        category: 'props',
        size: { width: 2, height: 2 },
        description: 'A gruesome blood fountain',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: true
    },
    cherub: {
        id: 'cherub',
        name: 'Cherub Statue',
        image: SPRITE('cherub'),
        category: 'props',
        size: { width: 1, height: 1 },
        description: 'A cherub statue',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: true
    },
    paladin: {
        id: 'paladin',
        name: 'Paladin Statue',
        image: SPRITE('paladin'),
        category: 'props',
        size: { width: 1, height: 1 },
        description: 'A holy paladin statue',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: true
    },
    eastern_dragon: {
        id: 'eastern_dragon',
        name: 'Dragon Statue',
        image: SPRITE('eastern_dragon'),
        category: 'props',
        size: { width: 2, height: 2 },
        description: 'An eastern dragon statue',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: true
    },
    shedu: {
        id: 'shedu',
        name: 'Shedu Statue',
        image: SPRITE('shedu'),
        category: 'props',
        size: { width: 1, height: 1 },
        description: 'A lamassu guardian statue',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: true
    },
    ophan: {
        id: 'ophan',
        name: 'Ophan Statue',
        image: SPRITE('ophan'),
        category: 'props',
        size: { width: 1, height: 1 },
        description: 'A wheeled ophan statue',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: true
    },
    apis: {
        id: 'apis',
        name: 'Apis Statue',
        image: SPRITE('apis'),
        category: 'props',
        size: { width: 1, height: 1 },
        description: 'A sacred bull statue',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: true
    },
    demon_wings_bones: {
        id: 'demon_wings_bones',
        name: 'Demon Remains',
        image: SPRITE('demon_wings_bones'),
        category: 'props',
        size: { width: 1, height: 1 },
        description: 'The skeletal remains of a demon',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: true
    },

    // ===== Structures =====
    dngn_altar: {
        id: 'dngn_altar',
        name: 'Stone Altar',
        image: SPRITE('dngn_altar'),
        category: 'structures',
        size: { width: 2, height: 1 },
        description: 'A ritual stone altar',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: true
    },
    dngn_granite_statue: {
        id: 'dngn_granite_statue',
        name: 'Granite Statue',
        image: SPRITE('dngn_granite_statue'),
        category: 'structures',
        size: { width: 1, height: 1 },
        description: 'A weathered granite statue',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: true
    },
    crumbled_column: {
        id: 'crumbled_column',
        name: 'Crumbling Column',
        image: SPRITE('crumbled_column'),
        category: 'structures',
        size: { width: 1, height: 1 },
        description: 'A crumbling stone column',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: true
    },
    zot_pillar: {
        id: 'zot_pillar',
        name: 'Ornate Pillar',
        image: SPRITE('zot_pillar'),
        category: 'structures',
        size: { width: 1, height: 1 },
        description: 'An ornate magical pillar',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: true
    },
    granite_stump: {
        id: 'granite_stump',
        name: 'Granite Stump',
        image: SPRITE('granite_stump'),
        category: 'structures',
        size: { width: 1, height: 1 },
        description: 'A flat-topped granite pillar',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: true
    },
    dngn_closed_door: {
        id: 'dngn_closed_door',
        name: 'Stone Door',
        image: SPRITE('dngn_closed_door'),
        category: 'structures',
        size: { width: 1, height: 1 },
        description: 'A closed stone door',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: true
    },
    dngn_open_door: {
        id: 'dngn_open_door',
        name: 'Open Doorway',
        image: SPRITE('dngn_open_door'),
        category: 'structures',
        size: { width: 1, height: 1 },
        description: 'An open stone doorway',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: true
    },
    dngn_trap_spear: {
        id: 'dngn_trap_spear',
        name: 'Spear Trap',
        image: SPRITE('dngn_trap_spear'),
        category: 'structures',
        size: { width: 1, height: 1 },
        description: 'A floor-mounted spear trap',
        freePosition: true, draggable: true, resizable: false, clickable: true, interactive: true
    },
    dngn_trap_blade: {
        id: 'dngn_trap_blade',
        name: 'Blade Trap',
        image: SPRITE('dngn_trap_blade'),
        category: 'structures',
        size: { width: 1, height: 1 },
        description: 'A spinning blade trap',
        freePosition: true, draggable: true, resizable: false, clickable: true, interactive: true
    },
    dngn_trap_axe: {
        id: 'dngn_trap_axe',
        name: 'Axe Trap',
        image: SPRITE('dngn_trap_axe'),
        category: 'structures',
        size: { width: 1, height: 1 },
        description: 'A swinging axe trap',
        freePosition: true, draggable: true, resizable: false, clickable: true, interactive: true
    },
    dngn_trap_arrow: {
        id: 'dngn_trap_arrow',
        name: 'Arrow Trap',
        image: SPRITE('dngn_trap_arrow'),
        category: 'structures',
        size: { width: 1, height: 1 },
        description: 'A wall-mounted arrow trap',
        freePosition: true, draggable: true, resizable: false, clickable: true, interactive: true
    },
    dngn_trap_bolt: {
        id: 'dngn_trap_bolt',
        name: 'Bolt Trap',
        image: SPRITE('dngn_trap_bolt'),
        category: 'structures',
        size: { width: 1, height: 1 },
        description: 'A heavy crossbow bolt trap',
        freePosition: true, draggable: true, resizable: false, clickable: true, interactive: true
    },
    dngn_trap_dart: {
        id: 'dngn_trap_dart',
        name: 'Dart Trap',
        image: SPRITE('dngn_trap_dart'),
        category: 'structures',
        size: { width: 1, height: 1 },
        description: 'A poisoned dart trap',
        freePosition: true, draggable: true, resizable: false, clickable: true, interactive: true
    },
    dngn_trap_needle: {
        id: 'dngn_trap_needle',
        name: 'Needle Trap',
        image: SPRITE('dngn_trap_needle'),
        category: 'structures',
        size: { width: 1, height: 1 },
        description: 'A tiny poisoned needle trap',
        freePosition: true, draggable: true, resizable: false, clickable: true, interactive: true
    },
    dngn_trap_net: {
        id: 'dngn_trap_net',
        name: 'Net Trap',
        image: SPRITE('dngn_trap_net'),
        category: 'structures',
        size: { width: 1, height: 1 },
        description: 'A falling net trap',
        freePosition: true, draggable: true, resizable: false, clickable: true, interactive: true
    },
    dngn_trap_teleport: {
        id: 'dngn_trap_teleport',
        name: 'Teleport Trap',
        image: SPRITE('dngn_trap_teleport'),
        category: 'structures',
        size: { width: 1, height: 1 },
        description: 'A teleportation trap',
        freePosition: true, draggable: true, resizable: false, clickable: true, interactive: true
    },
    dngn_trap_zot: {
        id: 'dngn_trap_zot',
        name: 'Zot Trap',
        image: SPRITE('dngn_trap_zot'),
        category: 'structures',
        size: { width: 1, height: 1 },
        description: 'A magical Zot trap',
        freePosition: true, draggable: true, resizable: false, clickable: true, interactive: true
    },
    dngn_trap_alarm: {
        id: 'dngn_trap_alarm',
        name: 'Alarm Trap',
        image: SPRITE('dngn_trap_alarm'),
        category: 'structures',
        size: { width: 1, height: 1 },
        description: 'A noise-making alarm trap',
        freePosition: true, draggable: true, resizable: false, clickable: true, interactive: true
    },

    // ===== Nature =====
    tree1_red: {
        id: 'tree1_red',
        name: 'Broadleaf Tree',
        image: SPRITE('tree1_red'),
        category: 'nature',
        size: { width: 1, height: 1 },
        description: 'A broadleaf tree with deep-red autumn foliage',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: true
    },
    tree1_lightred: {
        id: 'tree1_lightred',
        name: 'Broadleaf Tree (Autumn)',
        image: SPRITE('tree1_lightred'),
        category: 'nature',
        size: { width: 1, height: 1 },
        description: 'A broadleaf tree with light autumn foliage',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: true
    },
    tree1_yellow: {
        id: 'tree1_yellow',
        name: 'Broadleaf Tree (Golden)',
        image: SPRITE('tree1_yellow'),
        category: 'nature',
        size: { width: 1, height: 1 },
        description: 'A broadleaf tree with golden autumn leaves',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: true
    },
    tree2_red: {
        id: 'tree2_red',
        name: 'Canopy Tree',
        image: SPRITE('tree2_red'),
        category: 'nature',
        size: { width: 1, height: 1 },
        description: 'A wide-canopied tree with deep-red foliage',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: true
    },
    tree2_lightred: {
        id: 'tree2_lightred',
        name: 'Canopy Tree (Autumn)',
        image: SPRITE('tree2_lightred'),
        category: 'nature',
        size: { width: 1, height: 1 },
        description: 'A wide-canopied tree with light autumn foliage',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: true
    },
    tree2_yellow: {
        id: 'tree2_yellow',
        name: 'Canopy Tree (Golden)',
        image: SPRITE('tree2_yellow'),
        category: 'nature',
        size: { width: 1, height: 1 },
        description: 'A wide-canopied tree with golden leaves',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: true
    },
    plant: {
        id: 'plant',
        name: 'Shrub',
        image: SPRITE('plant'),
        category: 'nature',
        size: { width: 0.5, height: 0.5 },
        description: 'A leafy green shrub',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: true
    },
    plant_crypt: {
        id: 'plant_crypt',
        name: 'Crypt Plant',
        image: SPRITE('plant_crypt'),
        category: 'nature',
        size: { width: 0.5, height: 0.5 },
        description: 'A pale, withered crypt plant',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: true
    },
    fire_drake: {
        id: 'fire_drake',
        name: 'Fire Drake',
        image: SPRITE('fire_drake'),
        category: 'nature',
        size: { width: 1, height: 1 },
        description: 'A small red fire drake',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: true,
        lightRadius: 2, lightColor: '#ff6622', showLight: true
    },
    fire_giant: {
        id: 'fire_giant',
        name: 'Fire Giant',
        image: SPRITE('fire_giant'),
        category: 'nature',
        size: { width: 2, height: 2 },
        description: 'A towering fire giant',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: true,
        lightRadius: 3, lightColor: '#ff4400', showLight: true
    },
    fire_elemental: {
        id: 'fire_elemental',
        name: 'Fire Elemental',
        image: SPRITE('fire_elemental'),
        category: 'nature',
        size: { width: 1, height: 1 },
        description: 'A living ball of elemental fire',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: true,
        lightRadius: 3, lightColor: '#ff6622', showLight: true
    },
    flame: {
        id: 'flame',
        name: 'Flame',
        image: SPRITE('flame'),
        category: 'nature',
        size: { width: 0.5, height: 0.5 },
        description: 'A small fire flame',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: true
    },

    // ===== Lighting =====
    torch0: {
        id: 'torch0',
        name: 'Wall Torch',
        image: SPRITE('torch0'),
        category: 'lighting',
        size: { width: 0.4, height: 0.4 },
        description: 'A wall-mounted torch',
        freePosition: true, draggable: true, resizable: false, clickable: true, interactive: true,
        lightRadius: 2, lightColor: '#ffcc55', showLight: true
    },
    torch1: {
        id: 'torch1',
        name: 'Brazier',
        image: SPRITE('torch1'),
        category: 'lighting',
        size: { width: 0.4, height: 0.4 },
        description: 'A standing brazier with flame',
        freePosition: true, draggable: true, resizable: false, clickable: true, interactive: true,
        lightRadius: 2, lightColor: '#ffcc55', showLight: true
    },
    torch2: {
        id: 'torch2',
        name: 'Torch Stand',
        image: SPRITE('torch2'),
        category: 'lighting',
        size: { width: 0.4, height: 0.4 },
        description: 'A standing torch on a pedestal',
        freePosition: true, draggable: true, resizable: false, clickable: true, interactive: true,
        lightRadius: 2, lightColor: '#ffcc55', showLight: true
    },
    torch3: {
        id: 'torch3',
        name: 'Brass Torch',
        image: SPRITE('torch3'),
        category: 'lighting',
        size: { width: 0.4, height: 0.4 },
        description: 'A brass-mounted torch',
        freePosition: true, draggable: true, resizable: false, clickable: true, interactive: true,
        lightRadius: 2.5, lightColor: '#ffdd55', showLight: true
    },
    torch4: {
        id: 'torch4',
        name: 'Smoldering Torch',
        image: SPRITE('torch4'),
        category: 'lighting',
        size: { width: 0.4, height: 0.4 },
        description: 'A smoldering torch with low flame',
        freePosition: true, draggable: true, resizable: false, clickable: true, interactive: true,
        lightRadius: 1.5, lightColor: '#ffaa33', showLight: true
    },
    banner1: {
        id: 'banner1',
        name: 'Wall Banner',
        image: SPRITE('banner1'),
        category: 'lighting',
        size: { width: 0.5, height: 1 },
        description: 'A decorative wall banner',
        freePosition: true, draggable: true, resizable: true, clickable: true, interactive: true
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
        gmOnly: true, interactive: true
    },
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
    const [isOverConnection, setIsOverConnection] = useState(false);
    const connectionElementRef = useRef(null);

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

    const environmentalObjects = useLevelEditorStore(state => state.environmentalObjects);
    const isEditorMode = useLevelEditorStore(state => state.isEditorMode);
    const activeLayer = useLevelEditorStore(state => state.activeLayer);
    const drawingLayers = useLevelEditorStore(state => state.drawingLayers);
    const removeEnvironmentalObject = useLevelEditorStore(state => state.removeEnvironmentalObject);
    const updateEnvironmentalObject = useLevelEditorStore(state => state.updateEnvironmentalObject);
    const selectEnvironmentalObject = useLevelEditorStore(state => state.selectEnvironmentalObject);
    const reorderEnvironmentalObject = useLevelEditorStore(state => state.reorderEnvironmentalObject);
    const attachChildToParent = useLevelEditorStore(state => state.attachChildToParent);
    const detachFromParent = useLevelEditorStore(state => state.detachFromParent);
    const getChildrenOfParent = useLevelEditorStore(state => state.getChildrenOfParent);
    const objectManipulationEnabled = useLevelEditorStore(state => state.objectManipulationEnabled);

    const gridSize = useGameStore(state => state.gridSize);
    const gridOffsetX = useGameStore(state => state.gridOffsetX);
    const gridOffsetY = useGameStore(state => state.gridOffsetY);
    const cameraX = useGameStore(state => state.cameraX);
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

    // Helper to get current map ID explicitly (prevents stale reads during rapid updates)
    const getExplicitCurrentMapId = () => {
        const mapStoreState = useMapStore.getState();
        return mapStoreState.currentMapId || 'default';
    };

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

        // Render objects
        environmentalObjects.forEach(obj => {
            const objectDef = PROFESSIONAL_OBJECTS[obj.type];
            if (!objectDef) return;

            // Skip GM-only objects for players
            if (objectDef.gmOnly && !isGMMode) return;

            let screenPos;

            // Handle free positioning vs grid-aligned positioning
            if (obj.freePosition && obj.worldX !== undefined && obj.worldY !== undefined) {
                // Use world coordinates for free positioning - place exactly where clicked
                // Use the same coordinate system as the grid system for consistency
                try {
                    const gridSystem = getGridSystem();
                    const viewport = gridSystem.getViewportDimensions();
                    screenPos = gridSystem.worldToScreen(obj.worldX, obj.worldY, viewport.width, viewport.height);
                } catch (error) {
                    // Fallback to manual calculation
                    const canvasWidth = canvas?.width || window.innerWidth;
                    const canvasHeight = canvas?.height || window.innerHeight;
                    const screenX = (obj.worldX - cameraX) * effectiveZoom + canvasWidth / 2;
                    const screenY = (obj.worldY - cameraY) * effectiveZoom + canvasHeight / 2;
                    screenPos = { x: screenX, y: screenY };
                }

                // For free-positioned objects, check if they're visible on screen instead of grid bounds
                const objWidth = objectDef.size.width * gridSize * effectiveZoom * (obj.scale || 1);
                const objHeight = objectDef.size.height * gridSize * effectiveZoom * (obj.scale || 1);

                // Skip if object is completely outside the visible canvas area
                // Use more generous bounds to ensure objects are visible
                if (screenPos.x + objWidth < -100 || screenPos.x - objWidth > canvas.width + 100 ||
                    screenPos.y + objHeight < -100 || screenPos.y - objHeight > canvas.height + 100) {
                    return;
                }
            } else {
                // Check if object is in visible area for grid-aligned objects
                if (obj.gridX < startX || obj.gridX > endX || obj.gridY < startY || obj.gridY > endY) {
                    return;
                }
                screenPos = gridToScreen(obj.gridX, obj.gridY);
            }

            const tileSize = gridSize * effectiveZoom;

            // Calculate object size with custom scaling
            const scale = obj.scale || 1;
            const objWidth = objectDef.size.width * tileSize * scale;
            const objHeight = objectDef.size.height * tileSize * scale;

            // Render object based on category
            renderObjectByCategory(ctx, obj, objectDef, screenPos, objWidth, objHeight);

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

            // Render selection highlight if selected
            if (obj.selected) {
                renderSelectionHighlight(ctx, screenPos, objWidth, objHeight, rotRad);
            }

            // Render drag handles if selected and draggable
            if (obj.selected && objectDef.draggable && (isEditorMode || isGMMode)) {
                renderDragHandles(ctx, screenPos, objWidth, objHeight, rotRad);
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
    }, [environmentalObjects, effectiveZoom, gridToScreen, isEditorMode, gridSize, cameraX, cameraY, isGMMode, drawingLayers, pickParentMode, pendingChildId]);

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

        // Snap rotation to the nearest 90� for pixel-perfect rotation.
        // Most sprites are top-down so this is rarely visible, but for
        // wall-mounted objects (torches, banners) it keeps the visual
        // rotation in sync with the bounding box rotation.
        const rotationDeg = snapRotationForHitTest(objectDef.id, obj.rotation || 0);
        if (rotationDeg !== 0) {
            ctx.translate(screenPos.x, screenPos.y);
            ctx.rotate(rotationDeg * Math.PI / 180);
            ctx.translate(-screenPos.x, -screenPos.y);
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

    const renderSelectionHighlight = (ctx, screenPos, width, height, rotation) => {
        ctx.save();

        if (rotation) {
            ctx.translate(screenPos.x, screenPos.y);
            ctx.rotate(rotation);
            ctx.translate(-screenPos.x, -screenPos.y);
        }
        
        // Draw glow
        ctx.shadowColor = '#d4af37';
        ctx.shadowBlur = 15;
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 3;
        ctx.setLineDash([]);
        
        // Pulsing effect
        const pulse = Math.sin(Date.now() / 200) * 2;
        ctx.strokeRect(
            screenPos.x - width / 2 - 4 - pulse, 
            screenPos.y - height / 2 - 4 - pulse, 
            width + 8 + pulse * 2, 
            height + 8 + pulse * 2
        );
        
        // Inner sharp box
        ctx.shadowBlur = 0;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.strokeRect(screenPos.x - width / 2 - 2, screenPos.y - height / 2 - 2, width + 4, height + 4);
        
        ctx.restore();
    };

    const renderDragHandles = (ctx, screenPos, width, height, rotation) => {
        ctx.save();
        const handleSize = 14;
        const halfWidth = width / 2;
        const halfHeight = height / 2;

        if (rotation) {
            ctx.translate(screenPos.x, screenPos.y);
            ctx.rotate(rotation);
            ctx.translate(-screenPos.x, -screenPos.y);
        }

        const handles = [
            { x: screenPos.x - halfWidth, y: screenPos.y - halfHeight },
            { x: screenPos.x + halfWidth, y: screenPos.y - halfHeight },
            { x: screenPos.x - halfWidth, y: screenPos.y + halfHeight },
            { x: screenPos.x + halfWidth, y: screenPos.y + halfHeight },
        ];
        handles.forEach(handle => {
            ctx.fillStyle = 'rgba(0,0,0,0.5)';
            ctx.fillRect(handle.x - handleSize/2 + 2, handle.y - handleSize/2 + 2, handleSize, handleSize);
            ctx.fillStyle = '#d4af37';
            ctx.fillRect(handle.x - handleSize/2, handle.y - handleSize/2, handleSize, handleSize);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.strokeRect(handle.x - handleSize/2, handle.y - handleSize/2, handleSize, handleSize);
        });

        // Delete handle
        const dx = screenPos.x;
        const dy = screenPos.y - halfHeight - 25;
        ctx.fillStyle = '#ff4444';
        ctx.beginPath(); ctx.arc(dx, dy, 12, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2; ctx.stroke();
        ctx.fillStyle = '#ffffff'; ctx.font = 'bold 14px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('\u00d7', dx, dy + 1);
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
    }, [effectiveZoom, cameraX, cameraY]);

    // Find object at screen position
    const getObjectAtScreenPosition = useCallback((screenX, screenY) => {
        for (const obj of environmentalObjects) {
            const objectDef = PROFESSIONAL_OBJECTS[obj.type];
            if (!objectDef) continue;

            let screenPos;
            if (obj.freePosition && obj.worldX !== undefined && obj.worldY !== undefined) {
                try {
                    const gridSystem = getGridSystem();
                    const viewport = gridSystem.getViewportDimensions();
                    screenPos = gridSystem.worldToScreen(obj.worldX, obj.worldY, viewport.width, viewport.height);
                } catch (error) {
                    const canvasWidth = canvasRef.current?.width || window.innerWidth;
                    const canvasHeight = canvasRef.current?.height || window.innerHeight;
                    const screenObjX = (obj.worldX - cameraX) * effectiveZoom + canvasWidth / 2;
                    const screenObjY = (obj.worldY - cameraY) * effectiveZoom + canvasHeight / 2;
                    screenPos = { x: screenObjX, y: screenObjY };
                }
            } else if (obj.gridX !== undefined && obj.gridY !== undefined) {
                screenPos = gridToScreen(obj.gridX, obj.gridY);
            } else {
                continue;
            }

            const tileSize = gridSize * effectiveZoom;
            const scale = obj.scale || 1;
            const objWidth = objectDef.size.width * tileSize * scale;
            const objHeight = objectDef.size.height * tileSize * scale;

            const padding = Math.max(10, tileSize * 0.1);

            let testX = screenX;
            let testY = screenY;
            // Hit-test against the same snapped rotation the visual uses, so a
            // user can click where the pixel art actually appears instead of
            // missing because the bounding box is rotated to a different angle.
            const snappedDeg = snapRotationForHitTest(obj.type, obj.rotation || 0);
            const rotation = (snappedDeg || 0) * Math.PI / 180;
            if (rotation !== 0) {
                const dx = screenX - screenPos.x;
                const dy = screenY - screenPos.y;
                testX = screenPos.x + dx * Math.cos(-rotation) - dy * Math.sin(-rotation);
                testY = screenPos.y + dx * Math.sin(-rotation) + dy * Math.cos(-rotation);
            }

            const left = screenPos.x - objWidth / 2 - padding;
            const right = screenPos.x + objWidth / 2 + padding;
            const top = screenPos.y - objHeight / 2 - padding;
            const bottom = screenPos.y + objHeight / 2 + padding;

            if (testX >= left && testX <= right && testY >= top && testY <= bottom) {
                return obj;
            }
        }
        return null;
    }, [environmentalObjects, cameraX, cameraY, effectiveZoom, gridSize]);

    // Check if click is on a resize handle
    const getResizeHandle = useCallback((screenX, screenY, obj) => {
        if (!obj || (!isEditorMode && !isGMMode)) return null;

        const objectDef = PROFESSIONAL_OBJECTS[obj.type];
        if (!objectDef || !objectDef.resizable) return null;

        const gridSystem = getGridSystem();
        const viewport = gridSystem.getViewportDimensions();
        const gridSize = useGameStore.getState().gridSize;
        const currentZoom = useGameStore.getState().zoomLevel * useGameStore.getState().playerZoom;

        let screenPos;
        if (obj.freePosition && obj.worldX !== undefined && obj.worldY !== undefined) {
            screenPos = gridSystem.worldToScreen(obj.worldX, obj.worldY, viewport.width, viewport.height);
        } else if (obj.gridX !== undefined && obj.gridY !== undefined) {
            const worldCorner = gridSystem.gridToWorldCorner(obj.gridX, obj.gridY);
            screenPos = gridSystem.worldToScreen(worldCorner.x + gridSize / 2, worldCorner.y + gridSize / 2, viewport.width, viewport.height);
        } else return null;

        const tileSize = gridSize * currentZoom;
        const scale = obj.scale || 1;
        const objW = (objectDef.size.width || 1) * tileSize * scale;
        const objH = (objectDef.size.height || 1) * tileSize * scale;

        const handles = [
            { id: 'tl', lx: -objW / 2, ly: -objH / 2 },
            { id: 'tr', lx: objW / 2, ly: -objH / 2 },
            { id: 'bl', lx: -objW / 2, ly: objH / 2 },
            { id: 'br', lx: objW / 2, ly: objH / 2 }
        ];

        const rotation = (snapRotationForHitTest(obj.type, obj.rotation || 0)) * Math.PI / 180;

        for (const handle of handles) {
            let hx = screenPos.x + handle.lx;
            let hy = screenPos.y + handle.ly;
            if (rotation !== 0) {
                const rx = handle.lx * Math.cos(rotation) - handle.ly * Math.sin(rotation);
                const ry = handle.lx * Math.sin(rotation) + handle.ly * Math.cos(rotation);
                hx = screenPos.x + rx;
                hy = screenPos.y + ry;
            }
            const dist = Math.sqrt(Math.pow(screenX - hx, 2) + Math.pow(screenY - hy, 2));
            if (dist < 40) return handle.id;
        }

        return null;
    }, [isEditorMode, isGMMode]);

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

        const clickedObject = getObjectAtScreenPosition(screenX, screenY);

        if (clickedObject) {
            // In editor mode, allow all interactions
            // In GM mode (but not editor mode), only allow interactions with GM notes
            if (isEditorMode || (isGMMode && clickedObject.type === 'gmNotes')) {
                // Select the object
                selectEnvironmentalObject(clickedObject.id);

                const objectDef = PROFESSIONAL_OBJECTS[clickedObject.type];
                if (objectDef && objectDef.draggable) {
                    // Check for delete handle click
                    const tileSize = gridSize * effectiveZoom;
                    const halfHeight = (objectDef.size.height * tileSize * (clickedObject.scale || 1)) / 2;
                    const gridSystem = getGridSystem();
                    const viewport = gridSystem.getViewportDimensions();
                    const objScreenPos = gridSystem.worldToScreen(clickedObject.worldX, clickedObject.worldY, viewport.width, viewport.height);
                    const hx = objScreenPos.x;
                    const hy = objScreenPos.y - halfHeight - 25;
                    const distToDelete = Math.sqrt(Math.pow(screenX - hx, 2) + Math.pow(screenY - hy, 2));

                    if (distToDelete < 15) {
                        removeEnvironmentalObject(clickedObject.id, getExplicitCurrentMapId());
                        return;
                    }

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
                            const mapId = useMapStore.getState().currentMapId || 'default';
                            const currentObjects = useLevelEditorStore.getState().environmentalObjects;
                            const targetObj = currentObjects.find(o => o.id === dragStateRef.current.dragObjectId);
                            if (targetObj) {
                                useLevelEditorStore.getState().updateEnvironmentalObject(
                                    dragStateRef.current.dragObjectId,
                                    { ...targetObj, worldX: newWorldX, worldY: newWorldY },
                                    mapId
                                );
                                updateAttachmentOffset(dragStateRef.current.dragObjectId, newWorldX, newWorldY, mapId);
                                moveChildrenWithParent(dragStateRef.current.dragObjectId, newWorldX, newWorldY, mapId);
                            }
                        };

                        const handleDocMouseUp = () => {
                            document.removeEventListener('mousemove', handleDocMouseMove);
                            document.removeEventListener('mouseup', handleDocMouseUp);
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
    }, [isEditorMode, isGMMode, getObjectAtScreenPosition, getResizeHandle, selectEnvironmentalObject, screenToWorld, environmentalObjects, updateEnvironmentalObject, pickParentMode, pendingChildId, attachChildToParent, moveChildrenWithParent]);

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
            console.log('🔗 ObjectSystem: detected connection element, triggering its context menu', {
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
        if (selectedObject) {
            removeEnvironmentalObject(selectedObject.id, getExplicitCurrentMapId());
            setShowContextMenu(false);
            setSelectedObject(null);
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
                if (selectedObject) {
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
            if (e.target.closest('.unified-context-menu')) return;
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
                    const { initialScale, initialMousePos, objScreenPos } = dragStateRef.current;
                    const initialDist = Math.sqrt(Math.pow(initialMousePos.x - objScreenPos.x, 2) + Math.pow(initialMousePos.y - objScreenPos.y, 2));
                    const currentDist = Math.sqrt(Math.pow(mx - objScreenPos.x, 2) + Math.pow(my - objScreenPos.y, 2));
                    
                    if (initialDist > 0) {
                        const scaleFactor = currentDist / initialDist;
                        const newScale = Math.max(0.2, Math.min(10, initialScale * scaleFactor));
                        updateEnvironmentalObject(targetObj.id, { ...targetObj, scale: newScale }, mapId);
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
                    updateEnvironmentalObject(targetObj.id, { ...targetObj, worldX: newWorldX, worldY: newWorldY }, mapId);
                    updateAttachmentOffset(targetObj.id, newWorldX, newWorldY, mapId);
                    moveChildrenWithParent(targetObj.id, newWorldX, newWorldY, mapId);
                }
            };

            const handleDocMouseUp = () => {
                document.removeEventListener('mousemove', handleDocMouseMove);
                document.removeEventListener('mouseup', handleDocMouseUp);
                setIsDragging(false);
                setIsResizing(false);
                setResizeHandle(null);
                dragStateRef.current.isDragging = false;
                dragStateRef.current.isResizing = false;
                dragStateRef.current.dragObjectId = null;
            };

            // Attach listeners before potentially returning
            document.addEventListener('mousemove', handleDocMouseMove);
            document.addEventListener('mouseup', handleDocMouseUp);

            // 1. HANDLE CHECK (Priority #1)
            const selObj = objects.find(o => o.selected);
            if (selObj && (isEditorMode || isGMMode)) {
                const handleId = getResizeHandle(screenX, screenY, selObj);
                if (handleId) {
                    setIsResizing(true);
                    setResizeHandle(handleId);
                    
                    const selDef = PROFESSIONAL_OBJECTS[selObj.type];
                    const curScale = selObj.scale || 1;
                    
                    let selScreenPos;
                    if (selObj.freePosition) {
                        selScreenPos = gridSystem.worldToScreen(selObj.worldX, selObj.worldY, viewport.width, viewport.height);
                    } else {
                        const worldCorner = gridSystem.gridToWorldCorner(selObj.gridX, selObj.gridY);
                        selScreenPos = gridSystem.worldToScreen(worldCorner.x + gridSize / 2, worldCorner.y + gridSize / 2, viewport.width, viewport.height);
                    }

                    dragStateRef.current = {
                        isDragging: false, isResizing: true,
                        resizeHandle: handleId, dragObjectId: selObj.id,
                        initialScale: curScale, 
                        initialMousePos: { x: screenX, y: screenY },
                        objScreenPos: selScreenPos
                    };
                    
                    e.preventDefault(); e.stopPropagation();
                    return;
                }

                // Delete Handle
                const selDef = PROFESSIONAL_OBJECTS[selObj.type];
                if (selDef) {
                    const tileSize = gridSize * currentZoom;
                    const curScale = selObj.scale || 1;
                    const objH = (selDef.size.height || 1) * tileSize * curScale;
                    
                    let selScreenPos;
                    if (selObj.freePosition) {
                        selScreenPos = gridSystem.worldToScreen(selObj.worldX, selObj.worldY, viewport.width, viewport.height);
                    } else {
                        const worldCorner = gridSystem.gridToWorldCorner(selObj.gridX, selObj.gridY);
                        selScreenPos = gridSystem.worldToScreen(worldCorner.x + gridSize / 2, worldCorner.y + gridSize / 2, viewport.width, viewport.height);
                    }

                    const hx = selScreenPos.x;
                    const hy = selScreenPos.y - (objH / 2) - 25;
                    const distToDelete = Math.sqrt(Math.pow(screenX - hx, 2) + Math.pow(screenY - hy, 2));
                    if (distToDelete < 30) {
                        removeEnvironmentalObject(selObj.id, getExplicitCurrentMapId());
                        e.preventDefault(); e.stopPropagation(); return;
                    }
                }
            }

            // 2. Find if we clicked a NEW object
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
                document.removeEventListener('mousemove', handleDocMouseMove);
                document.removeEventListener('mouseup', handleDocMouseUp);
                const anySelected = objects.find(o => o.selected);
                if (anySelected) useLevelEditorStore.getState().clearObjectSelection();
                return;
            }

            const objectDef = PROFESSIONAL_OBJECTS[clickedObject.type];
            if (!objectDef) return;

            e.preventDefault(); e.stopPropagation();
            useLevelEditorStore.getState().selectEnvironmentalObject(clickedObject.id);
            if (!objectDef.draggable) return;

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
        };

        document.addEventListener('mousedown', handleDocMouseDown, true);
        return () => {
            document.removeEventListener('mousedown', handleDocMouseDown, true);
        };
    }, [isGMMode, isEditorMode]);

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
                                    onClick: () => handleRotateObject(-45)
                                },
                                {
                                    icon: <i className="fas fa-redo"></i>,
                                    label: 'Rotate Right 45\u00B0',
                                    onClick: () => handleRotateObject(45)
                                },
                                {
                                    icon: <i className="fas fa-undo"></i>,
                                    label: 'Rotate Left 90\u00B0',
                                    onClick: () => handleRotateObject(-90)
                                },
                                {
                                    icon: <i className="fas fa-redo"></i>,
                                    label: 'Rotate Right 90\u00B0',
                                    onClick: () => handleRotateObject(90)
                                },
                                { type: 'separator' },
                                {
                                    icon: <i className="fas fa-arrow-up"></i>,
                                    label: '0\u00B0',
                                    onClick: () => handleSetRotation(0)
                                },
                                {
                                    icon: <i className="fas fa-arrow-right"></i>,
                                    label: '90\u00B0',
                                    onClick: () => handleSetRotation(90)
                                },
                                {
                                    icon: <i className="fas fa-arrow-down"></i>,
                                    label: '180\u00B0',
                                    onClick: () => handleSetRotation(180)
                                },
                                {
                                    icon: <i className="fas fa-arrow-left"></i>,
                                    label: '270\u00B0',
                                    onClick: () => handleSetRotation(270)
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
                            className: 'danger-action'
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
        </>
    );
};

export default ObjectSystem;
