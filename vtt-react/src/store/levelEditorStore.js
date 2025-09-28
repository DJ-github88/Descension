import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PROFESSIONAL_TERRAIN_TYPES } from '../components/level-editor/terrain/TerrainSystem';

// Terrain categories for organization
export const TERRAIN_CATEGORIES = {
    BASIC: 'Basic Terrain',
    WATER: 'Water & Wetlands',
    DIFFICULT: 'Difficult Terrain',
    HAZARDOUS: 'Hazardous Terrain',
    SPECIAL: 'Special Terrain'
};

// Terrain types with visual and gameplay properties
export const TERRAIN_TYPES = {
    // BASIC TERRAIN
    grass: {
        id: 'grass',
        name: 'Grass',
        category: TERRAIN_CATEGORIES.BASIC,
        color: '#4a7c59',
        texture: 'grass',
        imageUrl: '/assets/terrain/grass.png',
        movementCost: 1,
        description: 'Normal grassland terrain',
        mechanics: 'Standard movement. Provides no special benefits or penalties.',
        tacticalNotes: 'Good for positioning and maneuvering.'
    },
    stone: {
        id: 'stone',
        name: 'Stone Floor',
        category: TERRAIN_CATEGORIES.BASIC,
        color: '#6b7280',
        texture: 'stone',
        imageUrl: '/assets/terrain/stone.png',
        movementCost: 1,
        description: 'Solid stone flooring',
        mechanics: 'Standard movement. Echoes footsteps.',
        tacticalNotes: 'Reliable footing, but may make stealth difficult.'
    },
    dirt: {
        id: 'dirt',
        name: 'Dirt Path',
        category: TERRAIN_CATEGORIES.BASIC,
        color: '#8b5a3c',
        texture: 'dirt',
        imageUrl: '/assets/terrain/dirt.png',
        movementCost: 1,
        description: 'Packed earth pathway',
        mechanics: 'Standard movement. May become muddy when wet.',
        tacticalNotes: 'Leaves tracks easily.'
    },
    cobblestone: {
        id: 'cobblestone',
        name: 'Cobblestone',
        category: TERRAIN_CATEGORIES.BASIC,
        color: '#9ca3af',
        texture: 'cobblestone',
        movementCost: 1,
        description: 'Well-maintained stone road',
        mechanics: 'Standard movement. Excellent footing.',
        tacticalNotes: 'Ideal for mounted combat and formations.'
    },

    // WATER & WETLANDS
    shallowWater: {
        id: 'shallowWater',
        name: 'Shallow Water',
        category: TERRAIN_CATEGORIES.WATER,
        color: '#60a5fa',
        texture: 'water',
        movementCost: 2,
        description: 'Ankle to knee-deep water',
        mechanics: 'Difficult terrain. Disadvantage on Dexterity (Stealth) checks.',
        tacticalNotes: 'Slows movement but provides some concealment.'
    },
    deepWater: {
        id: 'deepWater',
        name: 'Deep Water',
        category: TERRAIN_CATEGORIES.WATER,
        color: '#1e40af',
        texture: 'water',
        movementCost: 999,
        description: 'Deep water requiring swimming',
        mechanics: 'Requires swimming. Speed becomes swim speed.',
        tacticalNotes: 'Impassable without swimming ability. Provides total cover when submerged.'
    },
    swamp: {
        id: 'swamp',
        name: 'Swampland',
        category: TERRAIN_CATEGORIES.WATER,
        color: '#365314',
        texture: 'swamp',
        movementCost: 3,
        description: 'Murky wetland with thick vegetation',
        mechanics: 'Difficult terrain. Risk of disease. Obscures vision.',
        tacticalNotes: 'Excellent for ambushes but dangerous to traverse.'
    },
    ice: {
        id: 'ice',
        name: 'Ice',
        category: TERRAIN_CATEGORIES.WATER,
        color: '#bfdbfe',
        texture: 'ice',
        movementCost: 1,
        description: 'Frozen water surface',
        mechanics: 'DC 10 Acrobatics check or fall prone when moving more than half speed.',
        tacticalNotes: 'Treacherous footing. May break under heavy weight.'
    },

    // DIFFICULT TERRAIN
    sand: {
        id: 'sand',
        name: 'Deep Sand',
        category: TERRAIN_CATEGORIES.DIFFICULT,
        color: '#fbbf24',
        texture: 'sand',
        movementCost: 2,
        description: 'Loose, shifting sand',
        mechanics: 'Difficult terrain. Tires creatures quickly.',
        tacticalNotes: 'Slows pursuit but leaves clear tracks.'
    },
    mud: {
        id: 'mud',
        name: 'Thick Mud',
        category: TERRAIN_CATEGORIES.DIFFICULT,
        color: '#78350f',
        texture: 'mud',
        movementCost: 2,
        description: 'Sticky, clinging mud',
        mechanics: 'Difficult terrain. May trap feet (DC 12 Strength to escape).',
        tacticalNotes: 'Can immobilize enemies but affects allies too.'
    },
    rubble: {
        id: 'rubble',
        name: 'Rubble',
        category: TERRAIN_CATEGORIES.DIFFICULT,
        color: '#a3a3a3',
        texture: 'rubble',
        movementCost: 2,
        description: 'Broken stone and debris',
        mechanics: 'Difficult terrain. DC 15 Acrobatics check or take 1 damage.',
        tacticalNotes: 'Provides partial cover but slows movement.'
    },
    thickVegetation: {
        id: 'thickVegetation',
        name: 'Thick Vegetation',
        category: TERRAIN_CATEGORIES.DIFFICULT,
        color: '#166534',
        texture: 'vegetation',
        movementCost: 2,
        description: 'Dense undergrowth and brambles',
        mechanics: 'Difficult terrain. Provides half cover.',
        tacticalNotes: 'Excellent for concealment and guerrilla tactics.'
    },
    snow: {
        id: 'snow',
        name: 'Deep Snow',
        category: TERRAIN_CATEGORIES.DIFFICULT,
        color: '#f3f4f6',
        texture: 'snow',
        movementCost: 2,
        description: 'Deep, powdery snow',
        mechanics: 'Difficult terrain. Leaves obvious tracks.',
        tacticalNotes: 'Slows movement significantly. Muffles sound.'
    },

    // HAZARDOUS TERRAIN
    lava: {
        id: 'lava',
        name: 'Lava',
        category: TERRAIN_CATEGORIES.HAZARDOUS,
        color: '#dc2626',
        texture: 'lava',
        movementCost: 999,
        description: 'Molten rock - deadly to touch',
        mechanics: 'Impassable. 3d6 fire damage to creatures within 5 feet.',
        tacticalNotes: 'Creates natural barriers. Provides light and heat.'
    },
    acid: {
        id: 'acid',
        name: 'Acid Pool',
        category: TERRAIN_CATEGORIES.HAZARDOUS,
        color: '#84cc16',
        texture: 'acid',
        movementCost: 999,
        description: 'Corrosive acid that dissolves organic matter',
        mechanics: 'Impassable. 2d6 acid damage per turn in contact.',
        tacticalNotes: 'Destroys equipment. Creates dangerous chokepoints.'
    },

    poisonGas: {
        id: 'poisonGas',
        name: 'Poison Gas',
        category: TERRAIN_CATEGORIES.HAZARDOUS,
        color: '#a3a3a3',
        texture: 'gas',
        movementCost: 1,
        description: 'Toxic vapors that harm living creatures',
        mechanics: 'DC 13 Constitution save or take 1d4 poison damage per turn.',
        tacticalNotes: 'Affects all creatures. Undead and constructs immune.'
    },

    // SPECIAL TERRAIN
    magicCircle: {
        id: 'magicCircle',
        name: 'Magic Circle',
        category: TERRAIN_CATEGORIES.SPECIAL,
        color: '#8b5cf6',
        texture: 'magic',
        movementCost: 1,
        description: 'Enchanted area with magical properties',
        mechanics: 'Advantage on spell attack rolls. Spells deal +1 damage.',
        tacticalNotes: 'Highly valuable tactical position for spellcasters.'
    },
    holyGround: {
        id: 'holyGround',
        name: 'Holy Ground',
        category: TERRAIN_CATEGORIES.SPECIAL,
        color: '#fbbf24',
        texture: 'holy',
        movementCost: 1,
        description: 'Consecrated ground blessed by divine power',
        mechanics: 'Undead have disadvantage on attacks. Healing spells +2 HP.',
        tacticalNotes: 'Sanctuary against undead. Enhances divine magic.'
    },
    teleportPad: {
        id: 'teleportPad',
        name: 'Teleport Pad',
        category: TERRAIN_CATEGORIES.SPECIAL,
        color: '#06b6d4',
        texture: 'teleport',
        movementCost: 1,
        description: 'Magical platform that teleports creatures',
        mechanics: 'Creatures ending turn here teleport to linked pad.',
        tacticalNotes: 'Rapid repositioning. Can be used tactically or as escape.'
    },
    antiMagic: {
        id: 'antiMagic',
        name: 'Anti-Magic Zone',
        category: TERRAIN_CATEGORIES.SPECIAL,
        color: '#374151',
        texture: 'antimagic',
        movementCost: 1,
        description: 'Area where magic is suppressed',
        mechanics: 'Spells fail. Magic items become mundane. Dispels effects.',
        tacticalNotes: 'Neutralizes magical advantages. Favors martial combat.'
    },
    fogOfWar: {
        id: 'fogOfWar',
        name: 'Fog of War',
        category: TERRAIN_CATEGORIES.SPECIAL,
        color: '#404040',
        texture: 'fog',
        movementCost: 1,
        description: 'Hidden areas that block player vision',
        mechanics: 'GM can see through fog (semi-transparent), players cannot see through fog (opaque).',
        tacticalNotes: 'Use to hide areas from players and create exploration opportunities.'
    }
};

// Wall types - placed on grid edges rather than tile centers
export const WALL_TYPES = {
    stone_wall: {
        id: 'stone_wall',
        name: 'Stone Wall',
        category: 'basic',
        color: '#8B7355',
        blocksMovement: true,
        blocksLineOfSight: true,
        imageUrl: '/assets/walls/stone_wall.png',
        icon: '🧱',
        description: 'A solid stone wall that blocks movement and sight'
    },
    wooden_wall: {
        id: 'wooden_wall',
        name: 'Wooden Wall',
        category: 'basic',
        color: '#8B4513',
        blocksMovement: true,
        blocksLineOfSight: true,
        imageUrl: '/assets/walls/wooden_wall.png',
        icon: '🪵',
        description: 'A wooden wall that blocks movement and sight'
    },
    brick_wall: {
        id: 'brick_wall',
        name: 'Brick Wall',
        category: 'basic',
        color: '#B22222',
        blocksMovement: true,
        blocksLineOfSight: true,
        imageUrl: '/assets/walls/brick_wall.png',
        icon: '🧱',
        description: 'A brick wall that blocks movement and sight'
    },
    metal_wall: {
        id: 'metal_wall',
        name: 'Metal Wall',
        category: 'advanced',
        color: '#708090',
        blocksMovement: true,
        blocksLineOfSight: true,
        imageUrl: '/assets/walls/metal_wall.png',
        icon: '⚙️',
        description: 'A reinforced metal wall'
    },
    magical_barrier: {
        id: 'magical_barrier',
        name: 'Magical Barrier',
        category: 'magical',
        color: '#8A2BE2',
        blocksMovement: true,
        blocksLineOfSight: false,
        imageUrl: '/assets/walls/magical_barrier.png',
        icon: '✨',
        description: 'A magical barrier that blocks movement but not sight'
    },
    force_wall: {
        id: 'force_wall',
        name: 'Force Wall',
        category: 'magical',
        color: '#00BFFF',
        blocksMovement: true,
        blocksLineOfSight: false,
        imageUrl: '/assets/walls/force_wall.png',
        icon: '🔮',
        description: 'A translucent force wall'
    },
    wooden_door: {
        id: 'wooden_door',
        name: 'Wooden Door',
        category: 'interactive',
        color: '#8B4513',
        blocksMovement: true,
        blocksLineOfSight: true,
        imageUrl: '/assets/walls/wooden_door.png',
        icon: '🚪',
        description: 'A wooden door that can be opened or closed',
        states: ['closed', 'open'],
        interactive: true
    },
    stone_door: {
        id: 'stone_door',
        name: 'Stone Door',
        category: 'interactive',
        color: '#8B7355',
        blocksMovement: true,
        blocksLineOfSight: true,
        imageUrl: '/assets/walls/stone_door.png',
        icon: '🚪',
        description: 'A heavy stone door that can be opened or closed',
        states: ['closed', 'open'],
        interactive: true
    }
};

// Wall categories for organization
export const WALL_CATEGORIES = {
    BASIC: 'Basic Walls',
    ADVANCED: 'Advanced Materials',
    MAGICAL: 'Magical Barriers',
    INTERACTIVE: 'Interactive Elements'
};

// Environmental object types
export const OBJECT_TYPES = {
    tree: {
        id: 'tree',
        name: 'Tree',
        category: 'nature',
        blocksMovement: true,
        blocksLineOfSight: true,
        size: { width: 1, height: 1 },
        icon: 'inv_misc_tree_01',
        imageUrl: '/assets/objects/tree.png',
        description: 'A tall tree that blocks movement and sight'
    },
    rock: {
        id: 'rock',
        name: 'Rock',
        category: 'nature',
        blocksMovement: true,
        blocksLineOfSight: false,
        size: { width: 1, height: 1 },
        icon: 'inv_stone_01',
        imageUrl: '/assets/objects/rock.png',
        description: 'A large rock that blocks movement but allows sight'
    },

    bush: {
        id: 'bush',
        name: 'Bush',
        category: 'nature',
        blocksMovement: false,
        blocksLineOfSight: true,
        size: { width: 1, height: 1 },
        icon: 'inv_misc_herb_01',
        imageUrl: '/assets/objects/bush.png',
        description: 'A dense bush that blocks sight but allows movement'
    },

    lantern: {
        id: 'lantern',
        name: 'Lantern',
        category: 'lighting',
        blocksMovement: false,
        blocksLineOfSight: false,
        size: { width: 1, height: 1 },
        icon: 'inv_misc_lantern_01',
        image: '/assets/objects/lantern.png',
        imageUrl: '/assets/objects/lantern.png',
        lightRadius: 4,
        lightColor: '#ffffcc',
        lightIntensity: 1.0,
        description: 'Portable lantern with steady light'
    },

};

// D&D specific elements (removed trap and difficult terrain as requested)
export const DND_ELEMENTS = {
    // Portal element removed - use "Create New Portal" button instead
};

// Brush types and sizes
export const BRUSH_TYPES = {
    paint: { id: 'paint', name: 'Paint', icon: 'spell_nature_acid_01' },
    erase: { id: 'erase', name: 'Erase', icon: 'spell_holy_dispelmagic' },
    fill: { id: 'fill', name: 'Fill', icon: 'spell_frost_frostbolt02' },
    select: { id: 'select', name: 'Select', icon: 'ability_hunter_markedfordeath' }
};

export const BRUSH_SIZES = {
    small: { id: 'small', name: '1x1', size: 1 },
    medium: { id: 'medium', name: '3x3', size: 3 },
    large: { id: 'large', name: '5x5', size: 5 }
};

// Tool types
export const TOOL_TYPES = {
    PAINT: 'paint',
    ERASE: 'erase',
    FILL: 'fill',
    PLACE: 'place',
    SELECT: 'select',
    AREA_WALL: 'area-wall',
    FOG_CLEAR: 'fog-clear' // New fog clearing tool - GM only
};

const initialState = {
    // Editor state
    isEditorMode: false,
    activeTab: 'drawing',
    activeTool: 'select',
    activeTerrainType: 'grass',
    activeObjectType: null,
    activeDndElement: null,
    activeWallType: null,
    brushType: 'paint',
    brushSize: 'medium',

    // Professional VTT features
    selectedTool: 'select',
    toolSettings: {
        brushSize: 'medium',
        brushOpacity: 100,
        snapToGrid: true,
        showPreview: true,
        strokeWidth: 2,
        fillOpacity: 50
    },

    // Drawing tools data
    drawingPaths: [], // [{ id, tool, points, style, layer }]
    selectedDrawings: [],
    drawingLayers: [
        { id: 'background', name: 'Background', visible: true, locked: false },
        { id: 'terrain', name: 'Terrain', visible: true, locked: false },
        { id: 'drawings', name: 'Drawings', visible: true, locked: false },
        { id: 'walls', name: 'Walls', visible: true, locked: false },
        { id: 'objects', name: 'Objects', visible: true, locked: false },
        { id: 'lighting', name: 'Lighting', visible: true, locked: false },
        { id: 'fog', name: 'Fog of War', visible: true, locked: false },
        { id: 'grid', name: 'Grid', visible: true, locked: false },
        { id: 'overlay', name: 'Overlay', visible: true, locked: false }
    ],
    activeLayer: 'drawings',

    // Current drawing state for real-time preview
    currentDrawingPath: [],
    isCurrentlyDrawing: false,
    currentDrawingTool: '',

    // Camera and zoom state moved to gameStore for unified system

    // Layer visibility (legacy support)
    showTerrainLayer: true,
    showObjectLayer: true,
    showDndLayer: true,
    showWallLayer: true,
    showGridLines: true,

    // Terrain data - stores terrain type for each grid position
    terrainData: {}, // { "x,y": terrainType }

    // Environmental objects
    environmentalObjects: [], // [{ id, type, position: {x, y}, rotation, state }]

    // Wall data - stores walls placed on grid edges
    wallData: {}, // { "x1,y1,x2,y2": { type: wallType, state: 'closed'|'open', id: string } }

    // D&D elements
    dndElements: [], // [{ id, type, position: {x, y}, properties }]

    // Fog of war data - Enhanced for dynamic visibility
    fogOfWarData: {}, // { "x,y": boolean } - Static fog placement
    revealedAreas: {}, // { "x,y": boolean } - Areas revealed by token vision
    tokenVisionRanges: {}, // { tokenId: { range: number, type: 'normal'|'darkvision'|'blindsight' } }

    // Dynamic fog settings
    dynamicFogEnabled: true,
    respectLineOfSight: true,
    fogRevealMode: 'permanent', // 'permanent' | 'temporary'

    // Lighting modes
    fogMode: 'paint', // 'paint' | 'erase' | 'clear' | 'reveal'

    // Fog system toggles
    fogOfWarEnabled: true,
    lineOfSightEnabled: true,
    tokenVisionEnabled: true,

    // Dynamic lighting system
    lightSources: {}, // { lightId: { x, y, type, radius, color, intensity, flickering, enabled } }
    lightingEnabled: true,
    ambientLightLevel: 0.2, // 0.0 = complete darkness, 1.0 = full daylight
    lightInteractsWithFog: true,
    selectedLightType: 'torch', // Currently selected light type for placement

    // Advanced lighting features
    shadowQuality: 'medium', // 'low' | 'medium' | 'high'
    atmosphericEffects: true,
    lightAnimations: true,
    performanceMode: false, // Reduces quality for better performance

    // Atmospheric effects
    weatherEffects: {
        type: 'none', // 'none' | 'rain' | 'snow' | 'fog' | 'storm'
        intensity: 0.5,
        enabled: false
    },

    // Advanced shadow system
    shadowCasting: true,
    shadowSoftness: 0.5, // 0.0 = hard shadows, 1.0 = very soft shadows
    shadowDistance: 10, // Maximum shadow casting distance in tiles

    // Selection state
    selectedTiles: [],
    selectedObjects: [],

    // Isometric view settings
    isometricView: false,
    isometricAngle: 30,

    // Undo/Redo system
    history: [],
    historyIndex: -1,
    maxHistorySize: 50
};

const useLevelEditorStore = create(
    persist(
        (set, get) => ({
            ...initialState,

            // Editor mode toggle
            setEditorMode: (isEditorMode) => {
                set({ isEditorMode });
            },

            // Tool selection
            setActiveTool: (tool) => {
                set({ activeTool: tool });
            },

            setActiveTab: (tab) => {
                set({ activeTab: tab });
            },

            setActiveTerrainType: (terrainType) => {
                set({ activeTerrainType: terrainType });
            },

            setActiveObjectType: (objectType) => {
                set({ activeObjectType: objectType });
            },

            setActiveDndElement: (element) => {
                set({ activeDndElement: element });
            },

            setActiveWallType: (wallType) => {
                set({ activeWallType: wallType });
            },

            setBrushType: (brushType) => {
                set({ brushType });
            },

            setBrushSize: (brushSize) => {
                set({ brushSize });
            },

            // Layer visibility
            toggleLayer: (layer) => {
                const state = get();
                switch (layer) {
                    case 'terrain':
                        set({ showTerrainLayer: !state.showTerrainLayer });
                        break;
                    case 'objects':
                        set({ showObjectLayer: !state.showObjectLayer });
                        break;
                    case 'walls':
                        set({ showWallLayer: !state.showWallLayer });
                        break;
                    case 'dnd':
                        set({ showDndLayer: !state.showDndLayer });
                        break;
                    case 'grid':
                        set({ showGridLines: !state.showGridLines });
                        break;
                }
            },

            // Clear terrain layer (removes all terrain data)
            clearTerrainLayer: () => {
                set({ terrainData: {} });
            },

            // Terrain operations
            setTerrain: (x, y, terrainType) => {
                const state = get();
                const key = `${x},${y}`;
                set({
                    terrainData: {
                        ...state.terrainData,
                        [key]: terrainType
                    }
                });
            },

            getTerrain: (x, y) => {
                const state = get();
                const key = `${x},${y}`;
                return state.terrainData[key] || null; // Return null for unset tiles instead of default grass
            },

            clearTerrain: (x, y) => {
                const state = get();
                const key = `${x},${y}`;
                const newTerrainData = { ...state.terrainData };
                delete newTerrainData[key];
                set({ terrainData: newTerrainData });
            },

            // Environmental object operations - removed duplicate, using professional version below

            removeEnvironmentalObject: (objectId) => {
                const state = get();
                set({
                    environmentalObjects: state.environmentalObjects.filter(obj => obj.id !== objectId)
                });
            },

            updateEnvironmentalObject: (objectId, updates) => {
                const state = get();
                set({
                    environmentalObjects: state.environmentalObjects.map(obj =>
                        obj.id === objectId ? { ...obj, ...updates } : obj
                    )
                });
            },

            // Wall operations - walls are placed on grid edges
            setWall: (x1, y1, x2, y2, wallType) => {
                console.log('🧱 SET WALL CALLED:', { x1, y1, x2, y2, wallType });

                const state = get();
                const wallTypeData = WALL_TYPES[wallType];
                const defaultState = wallTypeData?.states?.[0] || 'default';

                // Create a consistent key for the wall edge (smaller coordinates first)
                const key = x1 < x2 || (x1 === x2 && y1 < y2)
                    ? `${x1},${y1},${x2},${y2}`
                    : `${x2},${y2},${x1},${y1}`;

                const wallData = {
                    type: wallType,
                    state: defaultState,
                    id: Date.now().toString()
                };

                console.log('🧱 Setting wall with key:', key, 'data:', wallData);

                set({
                    wallData: {
                        ...state.wallData,
                        [key]: wallData
                    }
                });

                // Log after setting
                const newState = get();
                console.log('🧱 Wall data after setting:', Object.keys(newState.wallData).length, 'walls total');
            },

            getWall: (x1, y1, x2, y2) => {
                const state = get();
                // Create a consistent key for the wall edge
                const key = x1 < x2 || (x1 === x2 && y1 < y2)
                    ? `${x1},${y1},${x2},${y2}`
                    : `${x2},${y2},${x1},${y1}`;
                return state.wallData[key] || null;
            },

            updateWall: (x1, y1, x2, y2, updates) => {
                const state = get();
                // Create a consistent key for the wall edge
                const key = x1 < x2 || (x1 === x2 && y1 < y2)
                    ? `${x1},${y1},${x2},${y2}`
                    : `${x2},${y2},${x1},${y1}`;

                const existingWall = state.wallData[key];
                if (existingWall) {
                    set({
                        wallData: {
                            ...state.wallData,
                            [key]: { ...existingWall, ...updates }
                        }
                    });
                }
            },

            removeWall: (x1, y1, x2, y2) => {
                const state = get();
                // Create a consistent key for the wall edge
                const key = x1 < x2 || (x1 === x2 && y1 < y2)
                    ? `${x1},${y1},${x2},${y2}`
                    : `${x2},${y2},${x1},${y1}`;
                const newWallData = { ...state.wallData };
                delete newWallData[key];
                set({ wallData: newWallData });
            },

            // D&D element operations
            addDndElement: (elementData) => {
                const state = get();
                const newElement = {
                    id: Date.now().toString(),
                    ...elementData
                };
                set({
                    dndElements: [...state.dndElements, newElement]
                });
                return newElement.id;
            },

            removeDndElement: (elementId) => {
                const state = get();
                set({
                    dndElements: state.dndElements.filter(elem => elem.id !== elementId)
                });
            },

            updateDndElement: (elementId, updates) => {
                const state = get();
                set({
                    dndElements: state.dndElements.map(elem =>
                        elem.id === elementId ? { ...elem, ...updates } : elem
                    )
                });
            },

            // Fog of war operations
            setFogOfWar: (x, y, hasFog) => {
                const state = get();
                const key = `${x},${y}`;
                if (hasFog) {
                    set({
                        fogOfWarData: {
                            ...state.fogOfWarData,
                            [key]: true
                        }
                    });
                } else {
                    const newFogData = { ...state.fogOfWarData };
                    delete newFogData[key];
                    set({ fogOfWarData: newFogData });
                }
            },

            getFogOfWar: (x, y) => {
                const state = get();
                const key = `${x},${y}`;
                return state.fogOfWarData[key] || false;
            },

            setFogMode: (mode) => set({ fogMode: mode }),

            // Clear fog of war from specific tiles (GM only)
            clearFogOfWar: (x, y) => {
                const state = get();
                const key = `${x},${y}`;
                const newFogData = { ...state.fogOfWarData };
                delete newFogData[key];
                set({ fogOfWarData: newFogData });
            },

            // Clear fog of war from multiple tiles (for brush/area clearing)
            clearFogOfWarArea: (tiles) => {
                const state = get();
                const newFogData = { ...state.fogOfWarData };
                tiles.forEach(({ x, y }) => {
                    const key = `${x},${y}`;
                    delete newFogData[key];
                });
                set({ fogOfWarData: newFogData });
            },

            // Enhanced fog of war operations for dynamic visibility
            setRevealedArea: (x, y, revealed) => {
                const state = get();
                const key = `${x},${y}`;
                if (revealed) {
                    set({
                        revealedAreas: {
                            ...state.revealedAreas,
                            [key]: true
                        }
                    });
                } else {
                    const newRevealedAreas = { ...state.revealedAreas };
                    delete newRevealedAreas[key];
                    set({ revealedAreas: newRevealedAreas });
                }
            },

            getRevealedArea: (x, y) => {
                const state = get();
                const key = `${x},${y}`;
                return state.revealedAreas[key] || false;
            },

            // Token vision management
            setTokenVision: (tokenId, range, type = 'normal') => {
                const state = get();
                set({
                    tokenVisionRanges: {
                        ...state.tokenVisionRanges,
                        [tokenId]: { range, type }
                    }
                });
            },

            removeTokenVision: (tokenId) => {
                const state = get();
                const newVisionRanges = { ...state.tokenVisionRanges };
                delete newVisionRanges[tokenId];
                set({ tokenVisionRanges: newVisionRanges });
            },

            // Dynamic fog settings
            setDynamicFogEnabled: (enabled) => {
                set({ dynamicFogEnabled: enabled });
            },

            setRespectLineOfSight: (respect) => {
                set({ respectLineOfSight: respect });
            },

            setFogRevealMode: (mode) => {
                set({ fogRevealMode: mode });
            },

            // Fog system toggles
            setFogOfWarEnabled: (enabled) => {
                set({ fogOfWarEnabled: enabled });
            },

            setLineOfSightEnabled: (enabled) => {
                set({ lineOfSightEnabled: enabled });
            },

            setTokenVisionEnabled: (enabled) => {
                set({ tokenVisionEnabled: enabled });
            },

            // Clear all fog of war
            clearFogOfWar: () => {
                set({ fogOfWarData: {} });
            },

            // Calculate all revealed areas based on current tokens and settings
            updateAllRevealedAreas: () => {
                const state = get();
                // This will be called by DynamicFogManager
                // Implementation handled in DynamicFogManager component
            },

            // Clear all revealed areas
            clearAllRevealedAreas: () => {
                set({ revealedAreas: {} });
            },

            // Light source management
            addLightSource: (x, y, lightType) => {
                const state = get();
                const lightId = `light_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

                // Default light properties based on type
                const lightDefaults = {
                    torch: { radius: 4, color: '#ff6b35', intensity: 0.8, flickering: true },
                    lantern: { radius: 6, color: '#ffeb3b', intensity: 1.0, flickering: false },
                    candle: { radius: 1, color: '#fff3e0', intensity: 0.4, flickering: true },
                    magical: { radius: 8, color: '#9c27b0', intensity: 1.2, flickering: false },
                    campfire: { radius: 5, color: '#ff5722', intensity: 1.0, flickering: true },
                    sunlight: { radius: 12, color: '#fff59d', intensity: 1.5, flickering: false }
                };

                const lightData = {
                    id: lightId,
                    x,
                    y,
                    type: lightType,
                    enabled: true,
                    ...lightDefaults[lightType]
                };

                set({
                    lightSources: {
                        ...state.lightSources,
                        [lightId]: lightData
                    }
                });

                return lightId;
            },

            updateLightSource: (lightId, updates) => {
                const state = get();
                if (state.lightSources[lightId]) {
                    set({
                        lightSources: {
                            ...state.lightSources,
                            [lightId]: {
                                ...state.lightSources[lightId],
                                ...updates
                            }
                        }
                    });
                }
            },

            removeLightSource: (lightId) => {
                const state = get();
                const newLightSources = { ...state.lightSources };
                delete newLightSources[lightId];
                set({ lightSources: newLightSources });
            },

            toggleLightSource: (lightId) => {
                const state = get();
                if (state.lightSources[lightId]) {
                    set({
                        lightSources: {
                            ...state.lightSources,
                            [lightId]: {
                                ...state.lightSources[lightId],
                                enabled: !state.lightSources[lightId].enabled
                            }
                        }
                    });
                }
            },

            clearAllLightSources: () => {
                set({ lightSources: {} });
            },

            // Lighting settings
            setLightingEnabled: (enabled) => {
                set({ lightingEnabled: enabled });
            },

            setAmbientLightLevel: (level) => {
                set({ ambientLightLevel: Math.max(0, Math.min(1, level)) });
            },

            setSelectedLightType: (lightType) => {
                set({ selectedLightType: lightType });
            },

            setLightInteractsWithFog: (interacts) => {
                set({ lightInteractsWithFog: interacts });
            },

            // Advanced lighting settings
            setShadowQuality: (quality) => {
                set({ shadowQuality: quality });
            },

            setAtmosphericEffects: (enabled) => {
                set({ atmosphericEffects: enabled });
            },

            setLightAnimations: (enabled) => {
                set({ lightAnimations: enabled });
            },

            setPerformanceMode: (enabled) => {
                set({ performanceMode: enabled });
            },

            setShadowCasting: (enabled) => {
                set({ shadowCasting: enabled });
            },

            setShadowSoftness: (softness) => {
                set({ shadowSoftness: Math.max(0, Math.min(1, softness)) });
            },

            setShadowDistance: (distance) => {
                set({ shadowDistance: Math.max(1, Math.min(20, distance)) });
            },

            // Weather effects
            setWeatherEffect: (type, intensity = 0.5, enabled = true) => {
                set({
                    weatherEffects: {
                        type,
                        intensity: Math.max(0, Math.min(1, intensity)),
                        enabled
                    }
                });
            },

            clearWeatherEffects: () => {
                set({
                    weatherEffects: {
                        type: 'none',
                        intensity: 0.5,
                        enabled: false
                    }
                });
            },

            // Selection operations
            setSelectedTiles: (tiles) => {
                set({ selectedTiles: tiles });
            },

            addSelectedTile: (x, y) => {
                const state = get();
                const tileKey = `${x},${y}`;
                if (!state.selectedTiles.includes(tileKey)) {
                    set({ selectedTiles: [...state.selectedTiles, tileKey] });
                }
            },

            removeSelectedTile: (x, y) => {
                const state = get();
                const tileKey = `${x},${y}`;
                set({ selectedTiles: state.selectedTiles.filter(tile => tile !== tileKey) });
            },

            clearSelection: () => {
                set({ selectedTiles: [], selectedObjects: [] });
            },

            // Camera and zoom controls moved to gameStore for unified system

            // Isometric view
            toggleIsometricView: () => {
                const state = get();
                set({ isometricView: !state.isometricView });
            },

            setIsometricAngle: (angle) => {
                set({ isometricAngle: angle });
            },

            // Clear all editor data
            clearAllData: () => {
                set({
                    terrainData: {},
                    environmentalObjects: [],
                    wallData: {},
                    dndElements: [],
                    fogOfWarData: {},
                    selectedTiles: [],
                    selectedObjects: []
                });
            },

            // Bulk data setters for map switching
            setTerrainData: (terrainData) => {
                set({ terrainData: terrainData || {} });
            },

            setEnvironmentalObjects: (environmentalObjects) => {
                set({ environmentalObjects: environmentalObjects || [] });
            },

            setWallData: (wallData) => {
                set({ wallData: wallData || {} });
            },

            setDndElements: (dndElements) => {
                set({ dndElements: dndElements || [] });
            },

            setFogOfWarData: (fogOfWarData) => {
                set({ fogOfWarData: fogOfWarData || {} });
            },

            setDrawingPaths: (drawingPaths) => {
                set({ drawingPaths: drawingPaths || [] });
            },

            setDrawingLayers: (drawingLayers) => {
                set({ drawingLayers: drawingLayers || initialState.drawingLayers });
            },

            setLightSources: (lightSources) => {
                set({ lightSources: lightSources || {} });
            },

            // Professional VTT Methods
            setSelectedTool: (tool) => {
                set({ selectedTool: tool, activeTool: tool });
            },

            setToolSettings: (settings) => {
                const state = get();
                set({
                    toolSettings: { ...state.toolSettings, ...settings }
                });
            },

            // Drawing tools
            addDrawingPath: (path) => {
                const state = get();
                const newPath = {
                    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                    ...path,
                    layer: state.activeLayer,
                    timestamp: Date.now()
                };
                set({
                    drawingPaths: [...state.drawingPaths, newPath]
                });
                return newPath.id;
            },

            updateDrawingPath: (pathId, updates) => {
                const state = get();
                set({
                    drawingPaths: state.drawingPaths.map(path =>
                        path.id === pathId ? { ...path, ...updates } : path
                    )
                });
            },

            removeDrawingPath: (pathId) => {
                const state = get();
                set({
                    drawingPaths: state.drawingPaths.filter(path => path.id !== pathId),
                    selectedDrawings: state.selectedDrawings.filter(id => id !== pathId)
                });
            },

            selectDrawing: (pathId) => {
                const state = get();
                if (!state.selectedDrawings.includes(pathId)) {
                    set({ selectedDrawings: [...state.selectedDrawings, pathId] });
                }
            },

            deselectDrawing: (pathId) => {
                const state = get();
                set({ selectedDrawings: state.selectedDrawings.filter(id => id !== pathId) });
            },

            clearDrawingSelection: () => {
                set({ selectedDrawings: [] });
            },

            // Current drawing state management for real-time preview
            setCurrentDrawingPath: (path) => {
                set({ currentDrawingPath: path });
            },

            setIsCurrentlyDrawing: (isDrawing) => {
                set({ isCurrentlyDrawing: isDrawing });
            },

            setCurrentDrawingTool: (tool) => {
                set({ currentDrawingTool: tool });
            },

            clearCurrentDrawing: () => {
                set({
                    currentDrawingPath: [],
                    isCurrentlyDrawing: false,
                    currentDrawingTool: ''
                });
            },

            // Layer management
            setActiveLayer: (layerId) => {
                set({ activeLayer: layerId });
            },

            toggleLayerVisibility: (layerId) => {
                const state = get();
                set({
                    drawingLayers: state.drawingLayers.map(layer =>
                        layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
                    )
                });
            },

            toggleLayerLock: (layerId) => {
                const state = get();
                set({
                    drawingLayers: state.drawingLayers.map(layer =>
                        layer.id === layerId ? { ...layer, locked: !layer.locked } : layer
                    )
                });
            },

            addLayer: (layer) => {
                const state = get();
                const newLayer = {
                    id: Date.now().toString(),
                    visible: true,
                    locked: false,
                    ...layer
                };
                set({
                    drawingLayers: [...state.drawingLayers, newLayer]
                });
                return newLayer.id;
            },

            removeLayer: (layerId) => {
                const state = get();
                // Don't remove if it's the last layer
                if (state.drawingLayers.length <= 1) return;

                // Remove layer and all drawings on it
                set({
                    drawingLayers: state.drawingLayers.filter(layer => layer.id !== layerId),
                    drawingPaths: state.drawingPaths.filter(path => path.layer !== layerId),
                    activeLayer: state.activeLayer === layerId ? state.drawingLayers[0].id : state.activeLayer
                });
            },

            // Map management
            saveMapState: () => {
                const state = get();
                const mapData = {
                    terrainData: state.terrainData,
                    environmentalObjects: state.environmentalObjects,
                    wallData: state.wallData,
                    dndElements: state.dndElements,
                    fogOfWarData: state.fogOfWarData,
                    drawingPaths: state.drawingPaths,
                    drawingLayers: state.drawingLayers,
                    lightSources: state.lightSources,
                    timestamp: Date.now()
                };

                // Save to localStorage with timestamp
                const savedMaps = JSON.parse(localStorage.getItem('vtt-saved-maps') || '[]');
                const mapName = `Map_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}`;
                savedMaps.push({ name: mapName, data: mapData });
                localStorage.setItem('vtt-saved-maps', JSON.stringify(savedMaps));

                return mapName;
            },

            loadMapState: (mapData) => {
                set({
                    terrainData: mapData.terrainData || {},
                    environmentalObjects: mapData.environmentalObjects || [],
                    wallData: mapData.wallData || {},
                    dndElements: mapData.dndElements || [],
                    fogOfWarData: mapData.fogOfWarData || {},
                    drawingPaths: mapData.drawingPaths || [],
                    drawingLayers: mapData.drawingLayers || initialState.drawingLayers,
                    lightSources: mapData.lightSources || {}
                });
            },

            // Enhanced clear all with layer support
            clearAllProfessionalData: () => {
                set({
                    terrainData: {},
                    environmentalObjects: [],
                    wallData: {},
                    dndElements: [],
                    fogOfWarData: {},
                    drawingPaths: [],
                    selectedDrawings: [],
                    selectedTiles: [],
                    selectedObjects: [],
                    lightSources: {}
                });
            },

            // Professional terrain interaction methods
            setTerrainAtPosition: (gridX, gridY, terrainType) => {
                const state = get();
                const tileKey = `${gridX},${gridY}`;

                const terrain = PROFESSIONAL_TERRAIN_TYPES[terrainType];

                let terrainData_value;
                // For terrain types with tile variations, randomly select one
                if (terrain && terrain.tileVariations && terrain.tileVariations.length > 0) {
                    const randomVariationIndex = Math.floor(Math.random() * terrain.tileVariations.length);
                    terrainData_value = {
                        type: terrainType,
                        variation: randomVariationIndex
                    };
                } else {
                    // Standard terrain without variations
                    terrainData_value = terrainType;
                }

                set({
                    terrainData: {
                        ...state.terrainData,
                        [tileKey]: terrainData_value
                    }
                });
            },

            removeTerrainAtPosition: (gridX, gridY, brushSize = 1) => {
                const state = get();
                const newTerrainData = { ...state.terrainData };

                // Calculate brush pattern based on size (same as paintTerrainBrush)
                const startOffset = Math.floor(brushSize / 2);

                for (let dx = 0; dx < brushSize; dx++) {
                    for (let dy = 0; dy < brushSize; dy++) {
                        const tileX = gridX - startOffset + dx;
                        const tileY = gridY - startOffset + dy;
                        const tileKey = `${tileX},${tileY}`;
                        delete newTerrainData[tileKey];
                    }
                }

                set({ terrainData: newTerrainData });
            },

            // Fog of War functions
            paintFogBrush: (gridX, gridY, brushSize = 1) => {
                const state = get();
                const newFogData = { ...state.fogOfWarData };

                // Calculate brush pattern based on size
                const startOffset = Math.floor(brushSize / 2);
                const tilesAdded = [];

                for (let dx = 0; dx < brushSize; dx++) {
                    for (let dy = 0; dy < brushSize; dy++) {
                        const tileX = gridX - startOffset + dx;
                        const tileY = gridY - startOffset + dy;
                        const tileKey = `${tileX},${tileY}`;
                        newFogData[tileKey] = true; // Simple fog - just mark as fogged
                        tilesAdded.push(tileKey);
                    }
                }

                console.log('Painting fog at', gridX, gridY, 'brush size', brushSize, 'tiles added:', tilesAdded);
                console.log('Total fog tiles:', Object.keys(newFogData).length);
                set({ fogOfWarData: newFogData });
            },

            removeFogAtPosition: (gridX, gridY, brushSize = 1) => {
                const state = get();
                const newFogData = { ...state.fogOfWarData };

                // Calculate brush pattern based on size
                const startOffset = Math.floor(brushSize / 2);

                for (let dx = 0; dx < brushSize; dx++) {
                    for (let dy = 0; dy < brushSize; dy++) {
                        const tileX = gridX - startOffset + dx;
                        const tileY = gridY - startOffset + dy;
                        const tileKey = `${tileX},${tileY}`;
                        delete newFogData[tileKey];
                    }
                }

                set({ fogOfWarData: newFogData });
            },

            clearAllFog: () => {
                set({ fogOfWarData: {} });
            },

            // Deterministic pseudo-random function based on tile coordinates
            // This ensures the same tile position always gets the same variation
            getTileVariation: (tileX, tileY, numVariations) => {
                // Simple hash function using tile coordinates
                let hash = 0;
                const str = `${tileX},${tileY}`;
                for (let i = 0; i < str.length; i++) {
                    const char = str.charCodeAt(i);
                    hash = ((hash << 5) - hash) + char;
                    hash = hash & hash; // Convert to 32-bit integer
                }
                // Ensure positive result and map to variation range
                return Math.abs(hash) % numVariations;
            },

            // Brush terrain painting with size support
            paintTerrainBrush: (gridX, gridY, terrainType, brushSize = 1) => {
                console.log('🎨 paintTerrainBrush called:', { gridX, gridY, terrainType, brushSize });
                console.trace('🎨 Call stack for paintTerrainBrush');

                const state = get();
                const newTerrainData = { ...state.terrainData };

                const terrain = PROFESSIONAL_TERRAIN_TYPES[terrainType];

                // Calculate brush pattern based on size
                // Size 1 = 1x1, Size 2 = 2x2, Size 3 = 3x3, Size 4 = 4x4, Size 5 = 5x5
                const startOffset = Math.floor(brushSize / 2);

                for (let dx = 0; dx < brushSize; dx++) {
                    for (let dy = 0; dy < brushSize; dy++) {
                        const tileX = gridX - startOffset + dx;
                        const tileY = gridY - startOffset + dy;
                        const tileKey = `${tileX},${tileY}`;

                        // For terrain types with tile variations, use precalculated variation
                        if (terrain && terrain.tileVariations && terrain.tileVariations.length > 0) {
                            const variationIndex = get().getTileVariation(tileX, tileY, terrain.tileVariations.length);
                            newTerrainData[tileKey] = {
                                type: terrainType,
                                variation: variationIndex
                            };
                        } else {
                            // Standard terrain without variations
                            newTerrainData[tileKey] = terrainType;
                        }

                        console.log('🎨 Setting terrain at', tileKey, 'to', newTerrainData[tileKey]);
                    }
                }

                set({ terrainData: newTerrainData });
            },

            // Flood fill terrain
            floodFillTerrain: (startX, startY, newTerrainType) => {
                const state = get();
                const startKey = `${startX},${startY}`;
                const originalTerrain = state.terrainData[startKey];

                if (originalTerrain === newTerrainType) return;

                const newTerrainData = { ...state.terrainData };
                const visited = new Set();
                const queue = [[startX, startY]];
                const terrain = PROFESSIONAL_TERRAIN_TYPES[newTerrainType];

                while (queue.length > 0) {
                    const [x, y] = queue.shift();
                    const key = `${x},${y}`;

                    if (visited.has(key)) continue;
                    visited.add(key);

                    const currentTerrain = newTerrainData[key];
                    if (currentTerrain !== originalTerrain && currentTerrain !== undefined) continue;

                    // For terrain types with tile variations, use precalculated variation
                    if (terrain && terrain.tileVariations && terrain.tileVariations.length > 0) {
                        const variationIndex = get().getTileVariation(x, y, terrain.tileVariations.length);
                        newTerrainData[key] = {
                            type: newTerrainType,
                            variation: variationIndex
                        };
                    } else {
                        // Standard terrain without variations
                        newTerrainData[key] = newTerrainType;
                    }

                    // Add adjacent tiles to queue
                    queue.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
                }

                set({ terrainData: newTerrainData });
            },

            // Get terrain type at position
            getTerrainAtPosition: (gridX, gridY) => {
                const state = get();
                const tileKey = `${gridX},${gridY}`;
                return state.terrainData[tileKey] || null;
            },

            // Professional object placement methods
            addEnvironmentalObject: (objectData) => {
                console.log('🏮 addEnvironmentalObject called with:', objectData);
                console.trace('🏮 Call stack for addEnvironmentalObject');

                const state = get();
                const newObject = {
                    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                    gridX: objectData.gridX,
                    gridY: objectData.gridY,
                    type: objectData.type,
                    rotation: objectData.rotation || 0,
                    scale: objectData.scale || 1,
                    layer: objectData.layer || 'objects',
                    selected: false,
                    showLight: objectData.showLight || false,
                    timestamp: Date.now(),
                    ...objectData
                };

                console.log('🏮 Adding environmental object:', newObject);
                set({
                    environmentalObjects: [...state.environmentalObjects, newObject]
                });

                return newObject.id;
            },

            removeEnvironmentalObject: (objectId) => {
                const state = get();
                set({
                    environmentalObjects: state.environmentalObjects.filter(obj => obj.id !== objectId)
                });
            },

            updateEnvironmentalObject: (objectId, updates) => {
                const state = get();
                set({
                    environmentalObjects: state.environmentalObjects.map(obj =>
                        obj.id === objectId ? { ...obj, ...updates } : obj
                    )
                });
            },

            selectEnvironmentalObject: (objectId) => {
                const state = get();
                set({
                    environmentalObjects: state.environmentalObjects.map(obj =>
                        obj.id === objectId ? { ...obj, selected: true } : { ...obj, selected: false }
                    )
                });
            },

            clearObjectSelection: () => {
                const state = get();
                set({
                    environmentalObjects: state.environmentalObjects.map(obj => ({ ...obj, selected: false }))
                });
            },

            getObjectAtPosition: (gridX, gridY) => {
                const state = get();
                return state.environmentalObjects.find(obj =>
                    obj.gridX === gridX && obj.gridY === gridY
                ) || null;
            },

            // Light source management
            addLightSource: (lightData) => {
                const state = get();
                const lightId = Date.now().toString() + Math.random().toString(36).substr(2, 9);

                set({
                    lightSources: {
                        ...state.lightSources,
                        [lightId]: {
                            id: lightId,
                            gridX: lightData.gridX,
                            gridY: lightData.gridY,
                            type: lightData.type || 'torch',
                            radius: lightData.radius || 3,
                            intensity: lightData.intensity || 1.0,
                            color: lightData.color || '#ffaa00',
                            flickering: lightData.flickering || false,
                            timestamp: Date.now(),
                            ...lightData
                        }
                    }
                });

                return lightId;
            },

            removeLightSource: (lightId) => {
                const state = get();
                const newLightSources = { ...state.lightSources };
                delete newLightSources[lightId];
                set({ lightSources: newLightSources });
            },

            updateLightSource: (lightId, updates) => {
                const state = get();
                if (state.lightSources[lightId]) {
                    set({
                        lightSources: {
                            ...state.lightSources,
                            [lightId]: { ...state.lightSources[lightId], ...updates }
                        }
                    });
                }
            }
        }),
        {
            name: 'level-editor-storage',
            partialize: (state) => ({
                terrainData: state.terrainData,
                environmentalObjects: state.environmentalObjects,
                wallData: state.wallData,
                dndElements: state.dndElements,
                fogOfWarData: state.fogOfWarData,
                isometricView: state.isometricView,
                isometricAngle: state.isometricAngle
            })
        }
    )
);

export default useLevelEditorStore;
