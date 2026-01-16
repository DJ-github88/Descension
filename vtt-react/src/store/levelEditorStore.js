import { create } from 'zustand';
import { PROFESSIONAL_TERRAIN_TYPES } from '../components/level-editor/terrain/TerrainSystem';
import { getGridSystem } from '../utils/InfiniteGridSystem';

// CRITICAL FIX: Map update batcher to prevent socket flooding during rapid editing (e.g. painting)
// This prevents "Connection Error" and disconnections when painting terrain
// Added batch size limits and sequence numbers for better multiplayer sync
const MAX_BATCH_SIZE = 200; // Increased to 200 to accommodate faster line interpolation
const MAX_BATCH_TIME = 100; // Max 100ms to wait before emitting
let batchSequenceNumber = 0; // Sequence number for ordering

const mapUpdateBatcher = {
    pendingUpdates: {},
    timeout: null,
    lastEmitTime: null, // Track last emit time

    addUpdate: (type, data) => {
        if (!mapUpdateBatcher.pendingUpdates[type]) {
            mapUpdateBatcher.pendingUpdates[type] = {};
        }

        // Merge data (works for objects like terrainData)
        if (type === 'dndElements') {
            // For arrays like dndElements, we replace with the full array
            mapUpdateBatcher.pendingUpdates[type] = data;
        } else if (typeof data === 'object' && !Array.isArray(data)) {
            mapUpdateBatcher.pendingUpdates[type] = {
                ...mapUpdateBatcher.pendingUpdates[type],
                ...data
            };
        } else {
            // Replace for non-mergable data
            mapUpdateBatcher.pendingUpdates[type] = data;
        }

        // CRITICAL FIX: Count actual items in collections (like tiles in terrainData)
        let totalUpdates = 0;
        for (const key in mapUpdateBatcher.pendingUpdates) {
            const val = mapUpdateBatcher.pendingUpdates[key];
            if (typeof val === 'object' && !Array.isArray(val)) {
                totalUpdates += Object.keys(val).length;
            } else {
                totalUpdates += 1;
            }
        }

        const elapsedTime = Date.now() - (mapUpdateBatcher.lastEmitTime || 0);

        // Emit if: batch is full OR enough time has passed
        if (totalUpdates >= MAX_BATCH_SIZE || elapsedTime >= MAX_BATCH_TIME) {
            clearTimeout(mapUpdateBatcher.timeout);
            mapUpdateBatcher.timeout = null;
            mapUpdateBatcher.emit();
        } else if (!mapUpdateBatcher.timeout) {
            // Otherwise schedule normally (100ms)
            mapUpdateBatcher.timeout = setTimeout(() => {
                mapUpdateBatcher.emit();
            }, 100);
        }
    },

    // Emit batched updates to multiplayer server
    emit: () => {
        const updates = { ...mapUpdateBatcher.pendingUpdates };
        const sequence = ++batchSequenceNumber; // Track sequence for ordering

        // Skip if no updates
        const updateKeys = Object.keys(updates);
        if (updateKeys.length === 0) return;

        // Clear pending updates and reset timeout
        mapUpdateBatcher.pendingUpdates = {};
        mapUpdateBatcher.timeout = null;
        mapUpdateBatcher.lastEmitTime = Date.now();

        // Import game store and emit
        import('./gameStore').then(({ default: useGameStore }) => {
            const gameStore = useGameStore.getState();
            if (gameStore.isInMultiplayer && gameStore.multiplayerSocket?.connected && gameStore.isGMMode) {
                if (!window._isReceivingMapUpdate) {
                    gameStore.multiplayerSocket.emit('map_update', {
                        mapUpdates: updates,
                        sequence: sequence
                    });
                }
            }
        }).catch(() => { });
    }
};

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
        description: 'A wooden door that can be opened, closed, or locked',
        states: ['closed', 'open', 'locked'],
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
        description: 'A heavy stone door that can be opened, closed, or locked',
        states: ['closed', 'open', 'locked'],
        interactive: true
    },
    // Window types - block movement but allow vision
    glass_window: {
        id: 'glass_window',
        name: 'Glass Window',
        category: 'window',
        color: '#87CEEB',
        blocksMovement: true,
        blocksLineOfSight: false,
        imageUrl: '/assets/walls/glass_window.png',
        icon: '🪟',
        description: 'A glass window - blocks movement but allows vision through',
        isWindow: true
    },
    barred_window: {
        id: 'barred_window',
        name: 'Barred Window',
        category: 'window',
        color: '#708090',
        blocksMovement: true,
        blocksLineOfSight: false,
        imageUrl: '/assets/walls/barred_window.png',
        icon: '🪟',
        description: 'A barred window - blocks movement but allows vision through',
        isWindow: true
    },
    arrow_slit: {
        id: 'arrow_slit',
        name: 'Arrow Slit',
        category: 'window',
        color: '#4A4A4A',
        blocksMovement: true,
        blocksLineOfSight: false,
        imageUrl: '/assets/walls/arrow_slit.png',
        icon: '🎯',
        description: 'A narrow arrow slit - blocks movement but allows limited vision',
        isWindow: true
    },
    open_window: {
        id: 'open_window',
        name: 'Open Window',
        category: 'window',
        color: '#F5F5DC',
        blocksMovement: false,
        blocksLineOfSight: false,
        imageUrl: '/assets/walls/open_window.png',
        icon: '🪟',
        description: 'An open window frame - allows movement and vision',
        isWindow: true
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
    connection: { id: 'connection', name: 'Connection', icon: 'spell_arcane_portaldalaran' },
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
    selectedWallKey: null, // Currently selected wall key for editing

    // Window overlays - placed on top of walls to create see-through points
    windowOverlays: {}, // { "gridX,gridY": { type: windowType, id: string } }
    selectedWindowKey: null, // Currently selected window key

    // D&D elements
    dndElements: [], // [{ id, type, position: {x, y}, properties }]

    // Fog of war data - Free-form path-based fog
    fogOfWarPaths: [], // Array of fog paths: [{ id, points: [{worldX, worldY, brushRadius}], timestamp }]
    fogErasePaths: [], // Array of fog erase paths: [{ id, points: [{worldX, worldY, brushRadius}], timestamp }]
    fogOfWarData: {}, // { "x,y": boolean } - Legacy tile-based fog (kept for backwards compatibility)
    revealedAreas: {}, // { "x,y": boolean } - Areas revealed by token vision
    tokenVisionRanges: {}, // { tokenId: { range: number, type: 'normal'|'darkvision'|'blindsight' } }
    viewingFromToken: null, // Current token being viewed from (for highlighting and camera locking)
    playerViewFromTokenDisabled: false, // Track if player has explicitly disabled view from token
    visibleArea: null, // Array of visible tile keys for FOV-based visibility (stored as array for React reactivity)
    visibilityPolygon: null, // Array of {x, y} points forming the raycast visibility polygon for accurate point-in-polygon checks

    // Memory/Afterimage system for previously explored areas
    exploredAreas: {}, // { "x,y": boolean } - Legacy tile-based explored areas (kept for backward compatibility)
    exploredCircles: [], // [{ x, y, radius, timestamp }] - Circle-based explored areas (position in world coords, radius in world units)
    exploredPolygons: [], // [{ points: [{x, y}], timestamp }] - Polygon-based explored areas matching vision shape
    memorySnapshots: {}, // { "x,y": { terrain, walls, objects, dndElements, timestamp } } - Snapshots of what was visible when last seen
    tokenAfterimages: {}, // { tokenId: { position: {x, y}, data: tokenData, lastSeenTimestamp } } - Afterimages of tokens that moved out of view
    afterimageEnabled: true, // Enable/disable afterimage system

    // Dynamic fog settings
    dynamicFogEnabled: true,
    respectLineOfSight: true,
    fogRevealMode: 'permanent', // 'permanent' | 'temporary'

    // FOV cone settings
    fovAngle: 360, // Field of view angle in degrees (360 = full view, 100 = directional view)
    tokenFacingDirections: {}, // { tokenId: angleInRadians } - Direction token is facing based on drag direction

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

const useLevelEditorStore = create((set, get) => ({
    ...initialState,

    // Editor mode toggle
    setEditorMode: (isEditorMode) => {
        // Simply toggle editor mode - don't clear anything here
        // Clearing only happens when entering via World Builder from landing page
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

        // Use batcher/direct emit for clear operation
        import('./gameStore').then(({ default: useGameStore }) => {
            const gameStore = useGameStore.getState();
            if (gameStore.isInMultiplayer && gameStore.multiplayerSocket?.connected && gameStore.isGMMode) {
                if (!window._isReceivingMapUpdate) {
                    gameStore.multiplayerSocket.emit('map_update', {
                        mapUpdates: { terrainData: {} } // Empty object indicates clear
                    });
                }
            }
        }).catch(() => { });
    },

    // Terrain operations
    setTerrain: (x, y, terrainType) => {
        const state = get();
        const key = `${x},${y}`;
        const newTerrainData = {
            ...state.terrainData,
            [key]: terrainType
        };
        set({ terrainData: newTerrainData });

        // Use batcher for efficiency
        mapUpdateBatcher.addUpdate('terrainData', { [key]: terrainType });
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

        // Use batcher (send null to indicate removal)
        mapUpdateBatcher.addUpdate('terrainData', { [key]: null });
    },

    // ========== BULK SETTERS FOR MULTIPLAYER SYNC ==========
    // These replace the entire data object (used for initial sync from GM to players)

    setTerrainData: (terrainData) => {
        console.log('🗺️ Setting terrain data bulk:', Object.keys(terrainData || {}).length, 'tiles');
        set({ terrainData: terrainData || {} });
    },

    setWallData: (wallData) => {
        console.log('🧱 Setting wall data bulk:', Object.keys(wallData || {}).length, 'walls');
        set({ wallData: wallData || {} });
    },

    setEnvironmentalObjects: (environmentalObjects) => {
        console.log('🌳 Setting environmental objects:', (environmentalObjects || []).length, 'objects');
        set({ environmentalObjects: environmentalObjects || [] });
    },

    setDrawingPaths: (drawingPaths) => {
        set({ drawingPaths: drawingPaths || [] });
    },

    setDrawingLayers: (drawingLayers) => {
        // Merge with default layers if provided layers are incomplete
        const defaultLayers = [
            { id: 'background', name: 'Background', visible: true, locked: false },
            { id: 'terrain', name: 'Terrain', visible: true, locked: false },
            { id: 'drawings', name: 'Drawings', visible: true, locked: false },
            { id: 'walls', name: 'Walls', visible: true, locked: false },
            { id: 'objects', name: 'Objects', visible: true, locked: false },
            { id: 'fog', name: 'Fog of War', visible: true, locked: false },
            { id: 'grid', name: 'Grid', visible: true, locked: false },
            { id: 'overlay', name: 'Overlay', visible: true, locked: false }
        ];
        set({ drawingLayers: drawingLayers && drawingLayers.length > 0 ? drawingLayers : defaultLayers });
    },

    setFogOfWarData: (fogOfWarData) => {
        set({ fogOfWarData: fogOfWarData || {} });
    },

    setExploredAreas: (exploredAreas) => {
        set({ exploredAreas: exploredAreas || {} });
    },

    setLightSources: (lightSources) => {
        set({ lightSources: lightSources || {} });
    },

    setDynamicFogEnabled: (enabled) => {
        set({ dynamicFogEnabled: !!enabled });
    },

    setRespectLineOfSight: (enabled) => {
        set({ respectLineOfSight: !!enabled });
    },

    setFogOfWarPaths: (paths) => {
        set({ fogOfWarPaths: paths || [] });
    },

    setFogErasePaths: (paths) => {
        set({ fogErasePaths: paths || [] });
    },

    setDndElements: (elements) => {
        set({ dndElements: elements || [] });

        // Sync to other clients if this isn't an incoming sync
        if (!window._isReceivingMapUpdate) {
            mapUpdateBatcher.addUpdate('dndElements', elements || []);
        }
    },

    // ========== END BULK SETTERS ==========

    // Environmental object operations - removed duplicate, using professional version below

    // Wall operations - walls are placed on grid edges
    setWall: (x1, y1, x2, y2, wallType) => {
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

        const newWallData = {
            ...state.wallData,
            [key]: wallData
        };
        set({ wallData: newWallData });

        // Emit wall update to multiplayer server
        import('./gameStore').then(({ default: useGameStore }) => {
            const gameStore = useGameStore.getState();
            if (gameStore.isInMultiplayer && gameStore.multiplayerSocket && gameStore.multiplayerSocket.connected && gameStore.isGMMode) {
                if (!window._isReceivingMapUpdate) {
                    gameStore.multiplayerSocket.emit('map_update', {
                        mapUpdates: {
                            wallData: newWallData
                        }
                    });
                }
            }
        }).catch(() => {
            // Ignore errors if gameStore not available
        });
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
        // Clear selection if the removed wall was selected
        const newSelectedWallKey = state.selectedWallKey === key ? null : state.selectedWallKey;
        set({ wallData: newWallData, selectedWallKey: newSelectedWallKey });

        // Emit wall removal to multiplayer server
        import('./gameStore').then(({ default: useGameStore }) => {
            const gameStore = useGameStore.getState();
            if (gameStore.isInMultiplayer && gameStore.multiplayerSocket && gameStore.multiplayerSocket.connected && gameStore.isGMMode) {
                if (!window._isReceivingMapUpdate) {
                    gameStore.multiplayerSocket.emit('map_update', {
                        mapUpdates: {
                            wallData: newWallData
                        }
                    });
                }
            }
        }).catch(() => {
            // Ignore errors if gameStore not available
        });
    },

    // Wall selection
    setSelectedWallKey: (key) => {
        set({ selectedWallKey: key });
    },

    // Window overlay operations
    setWindowOverlay: (gridX, gridY, windowType, wallKey = null) => {
        const state = get();
        // Use precise key with three decimal places for smooth placement along walls
        const key = `${gridX.toFixed(3)},${gridY.toFixed(3)}`;
        const newWindowOverlays = {
            ...state.windowOverlays,
            [key]: {
                type: windowType,
                id: Date.now().toString(),
                gridX: parseFloat(gridX.toFixed(3)),
                gridY: parseFloat(gridY.toFixed(3)),
                wallKey // Reference to the wall this window is on
            }
        };
        set({ windowOverlays: newWindowOverlays });

        // Emit to multiplayer
        import('./gameStore').then(({ default: useGameStore }) => {
            const gameStore = useGameStore.getState();
            if (gameStore.isInMultiplayer && gameStore.multiplayerSocket && gameStore.multiplayerSocket.connected && gameStore.isGMMode) {
                if (!window._isReceivingMapUpdate) {
                    gameStore.multiplayerSocket.emit('map_update', {
                        mapUpdates: { windowOverlays: newWindowOverlays }
                    });
                }
            }
        }).catch(() => { });
    },

    removeWindowOverlay: (gridX, gridY) => {
        const state = get();
        // Try multiple key formats for compatibility (integer, 1 decimal, 3 decimal)
        const keyInt = `${gridX},${gridY}`;
        const keyFloat1 = `${parseFloat(gridX).toFixed(1)},${parseFloat(gridY).toFixed(1)}`;
        const keyFloat3 = `${parseFloat(gridX).toFixed(3)},${parseFloat(gridY).toFixed(3)}`;
        const newWindowOverlays = { ...state.windowOverlays };
        delete newWindowOverlays[keyInt];
        delete newWindowOverlays[keyFloat1];
        delete newWindowOverlays[keyFloat3];
        set({ windowOverlays: newWindowOverlays });

        // Emit to multiplayer
        import('./gameStore').then(({ default: useGameStore }) => {
            const gameStore = useGameStore.getState();
            if (gameStore.isInMultiplayer && gameStore.multiplayerSocket && gameStore.multiplayerSocket.connected && gameStore.isGMMode) {
                if (!window._isReceivingMapUpdate) {
                    gameStore.multiplayerSocket.emit('map_update', {
                        mapUpdates: { windowOverlays: newWindowOverlays }
                    });
                }
            }
        }).catch(() => { });
    },

    getWindowOverlay: (gridX, gridY) => {
        const state = get();
        return state.windowOverlays[`${gridX},${gridY}`] || null;
    },

    setWindowOverlays: (windowOverlays) => {
        set({ windowOverlays: windowOverlays || {} });
    },

    setSelectedWindowKey: (key) => {
        set({ selectedWindowKey: key });
    },

    // Move a wall to a new position
    moveWall: (oldX1, oldY1, oldX2, oldY2, newX1, newY1, newX2, newY2) => {
        const state = get();
        // Create consistent keys
        const oldKey = oldX1 < oldX2 || (oldX1 === oldX2 && oldY1 < oldY2)
            ? `${oldX1},${oldY1},${oldX2},${oldY2}`
            : `${oldX2},${oldY2},${oldX1},${oldY1}`;
        const newKey = newX1 < newX2 || (newX1 === newX2 && newY1 < newY2)
            ? `${newX1},${newY1},${newX2},${newY2}`
            : `${newX2},${newY2},${newX1},${newY1}`;

        const existingWall = state.wallData[oldKey];
        if (!existingWall) return;

        const newWallData = { ...state.wallData };
        delete newWallData[oldKey];
        newWallData[newKey] = existingWall;

        set({
            wallData: newWallData,
            selectedWallKey: newKey // Update selection to new key
        });

        // Emit wall update to multiplayer server
        import('./gameStore').then(({ default: useGameStore }) => {
            const gameStore = useGameStore.getState();
            if (gameStore.isInMultiplayer && gameStore.multiplayerSocket && gameStore.multiplayerSocket.connected && gameStore.isGMMode) {
                if (!window._isReceivingMapUpdate) {
                    gameStore.multiplayerSocket.emit('map_update', {
                        mapUpdates: {
                            wallData: newWallData
                        }
                    });
                }
            }
        }).catch(() => {
            // Ignore errors if gameStore not available
        });
    },

    // D&D element operations
    addDndElement: (elementData) => {
        const state = get();
        const newElement = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 5), // Added randomness to ID
            ...elementData
        };
        const newElements = [...state.dndElements, newElement];

        set({
            dndElements: newElements
        });

        // Sync to other clients
        if (!window._isReceivingMapUpdate) {
            mapUpdateBatcher.addUpdate('dndElements', newElements);
        }

        return newElement.id;
    },

    removeDndElement: (elementId) => {
        const state = get();
        const newElements = state.dndElements.filter(elem => elem.id !== elementId);

        set({
            dndElements: newElements
        });

        // Sync to other clients
        if (!window._isReceivingMapUpdate) {
            mapUpdateBatcher.addUpdate('dndElements', newElements);
        }
    },

    updateDndElement: (elementId, updates) => {
        const state = get();
        const newElements = state.dndElements.map(elem =>
            elem.id === elementId ? { ...elem, ...updates } : elem
        );

        set({
            dndElements: newElements
        });

        // Sync to other clients
        if (!window._isReceivingMapUpdate) {
            mapUpdateBatcher.addUpdate('dndElements', newElements);
        }
    },

    // Fog of war operations
    setFogOfWar: (x, y, hasFog) => {
        const state = get();
        const key = `${x},${y}`;
        let newFogData;
        if (hasFog) {
            newFogData = {
                ...state.fogOfWarData,
                [key]: true
            };
        } else {
            newFogData = { ...state.fogOfWarData };
            delete newFogData[key];
        }
        set({ fogOfWarData: newFogData });

        // Emit fog of war update to multiplayer server
        import('./gameStore').then(({ default: useGameStore }) => {
            const gameStore = useGameStore.getState();
            if (gameStore.isInMultiplayer && gameStore.multiplayerSocket && gameStore.multiplayerSocket.connected && gameStore.isGMMode) {
                gameStore.multiplayerSocket.emit('map_update', {
                    mapUpdates: {
                        fogOfWar: newFogData
                    }
                });
            }
        }).catch(() => {
            // Ignore errors if gameStore not available
        });
    },

    getFogOfWar: (x, y) => {
        const state = get();
        const key = `${x},${y}`;
        return state.fogOfWarData[key] || false;
    },

    getFogState: (worldX, worldY) => {
        const state = get();
        // Convert world coordinates to grid coordinates
        const gridX = Math.floor((worldX - state.gridOffsetX) / state.gridSize);
        const gridY = Math.floor((worldY - state.gridOffsetY) / state.gridSize);
        const tileKey = `${gridX},${gridY}`;

        // PERFORMANCE FIX: Read revealedAreas/exploredAreas from state
        const revealedAreas = state.revealedAreas || {};
        const exploredAreas = state.exploredAreas || {};

        // Convert visibleArea array back to Set if needed
        const visibleAreaSet = state.visibleArea ?
            (state.visibleArea instanceof Set ? state.visibleArea : new Set(state.visibleArea)) :
            null;

        // Get GM mode from game store
        const gameStore = require('./gameStore').default.getState();
        const isGMMode = gameStore.isGMMode;

        // When viewing from a token, show both current vision AND explored areas
        // This creates proper fog of war where players see explored areas plus current vision
        // BUT: GM mode should NOT be restricted - GM can always see everything
        if (state.viewingFromToken && state.dynamicFogEnabled && visibleAreaSet && visibleAreaSet.size > 0 && !isGMMode) {
            // If tile is in current visible area, it's viewable
            if (visibleAreaSet.has(tileKey)) {
                return 'viewable'; // Currently visible - visibility mask will erase fog
            }
            // Show explored areas - this is the "memory" of what the player has seen before
            if (exploredAreas[tileKey]) {
                return 'explored'; // Previously explored - dimmed but visible (shows terrain/afterimages)
            }
            return 'covered'; // Not explored - fully covered fog
        }

        // Normal mode (not viewing from token): use explored/revealed areas
        // Check if currently visible (only if dynamic fog is enabled)
        if (state.dynamicFogEnabled && visibleAreaSet && visibleAreaSet.size > 0) {
            // If tile is in current visible area, it's viewable
            if (visibleAreaSet.has(tileKey)) {
                return 'viewable'; // Currently visible - very light fog so GM can see through it
            }
            // Also check revealedAreas for areas that were visible but token moved away
            if (revealedAreas[tileKey]) {
                return 'viewable'; // Previously revealed and still in revealed areas
            }
        }

        // Check if previously explored (works in both GM and player mode)
        if (exploredAreas[tileKey]) {
            return 'explored'; // Previously explored but currently fogged
        }

        return 'covered'; // Never explored - fully covered fog
    },

    setFogMode: (mode) => set({ fogMode: mode }),

    // Clear fog of war from specific tiles (GM only)
    clearFogOfWarTile: (x, y) => {
        const state = get();
        const key = `${x},${y}`;
        const newFogData = { ...state.fogOfWarData };
        delete newFogData[key];
        set({ fogOfWarData: newFogData });

        // Emit fog of war update to multiplayer server
        import('./gameStore').then(({ default: useGameStore }) => {
            const gameStore = useGameStore.getState();
            if (gameStore.isInMultiplayer && gameStore.multiplayerSocket && gameStore.multiplayerSocket.connected && gameStore.isGMMode) {
                gameStore.multiplayerSocket.emit('map_update', {
                    mapUpdates: {
                        fogOfWar: newFogData
                    }
                });
            }
        }).catch(() => {
            // Ignore errors if gameStore not available
        });
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

        // Emit fog of war update to multiplayer server
        import('./gameStore').then(({ default: useGameStore }) => {
            const gameStore = useGameStore.getState();
            if (gameStore.isInMultiplayer && gameStore.multiplayerSocket && gameStore.multiplayerSocket.connected && gameStore.isGMMode) {
                gameStore.multiplayerSocket.emit('map_update', {
                    mapUpdates: {
                        fogOfWar: newFogData
                    }
                });
            }
        }).catch(() => {
            // Ignore errors if gameStore not available
        });
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

    // Memory/Afterimage system functions
    setExploredArea: (x, y, explored = true) => {
        const state = get();
        const key = `${x},${y}`;
        let newExploredAreas;
        if (explored) {
            newExploredAreas = {
                ...state.exploredAreas,
                [key]: true
            };
        } else {
            newExploredAreas = { ...state.exploredAreas };
            delete newExploredAreas[key];
        }
        set({ exploredAreas: newExploredAreas });

        // CRITICAL FIX: Emit explored areas update to multiplayer server
        import('./gameStore').then(({ default: useGameStore }) => {
            const gameStore = useGameStore.getState();
            if (gameStore.isInMultiplayer && gameStore.multiplayerSocket && gameStore.multiplayerSocket.connected && gameStore.isGMMode) {
                if (!window._isReceivingMapUpdate) {
                    gameStore.multiplayerSocket.emit('map_update', {
                        mapUpdates: {
                            exploredAreas: newExploredAreas
                        }
                    });
                }
            }
        }).catch(() => {
            // Ignore errors if gameStore not available
        });
    },

    // CRITICAL FIX: Bulk setter for explored areas (for syncing from server)
    setExploredAreas: (exploredAreas) => {
        set({ exploredAreas: exploredAreas || {} });
    },

    // Add explored circle (position in world coords, radius in world units)
    addExploredCircle: (worldX, worldY, radius) => {
        const state = get();
        const newCircle = {
            x: worldX,
            y: worldY,
            radius: radius,
            timestamp: Date.now()
        };
        // Merge with existing circles (remove overlapping/duplicate circles)
        const existingCircles = state.exploredCircles || [];
        // Simple deduplication: remove circles that are very close to this one
        const filtered = existingCircles.filter(circle => {
            const dx = circle.x - worldX;
            const dy = circle.y - worldY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            // Remove if centers are within 10% of radius (likely same exploration)
            return distance > (Math.min(circle.radius, radius) * 0.1);
        });
        set({ exploredCircles: [...filtered, newCircle] });
    },

    // Add explored polygon (matches vision polygon shape exactly)
    addExploredPolygon: (polygon) => {
        if (!polygon || !Array.isArray(polygon) || polygon.length < 3) {
            return; // Invalid polygon
        }
        const state = get();
        const newPolygon = {
            points: polygon.map(p => ({ x: p.x, y: p.y })), // Deep copy
            timestamp: Date.now()
        };
        // Keep recent polygons (last 100 to prevent memory issues)
        const existingPolygons = state.exploredPolygons || [];
        const recentPolygons = existingPolygons.slice(-99); // Keep last 99
        set({ exploredPolygons: [...recentPolygons, newPolygon] });
    },

    // Check if a world position is within any explored circle or polygon
    isPositionExplored: (worldX, worldY) => {
        const state = get();

        // Helper function for point-in-polygon check
        const isPointInPolygon = (x, y, polygon) => {
            if (!polygon || polygon.length < 3) return false;
            let inside = false;
            for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
                const xi = polygon[i].x, yi = polygon[i].y;
                const xj = polygon[j].x, yj = polygon[j].y;
                const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
                if (intersect) inside = !inside;
            }
            return inside;
        };

        // First check polygons (more accurate, matches vision shape)
        const polygons = state.exploredPolygons || [];
        for (const polygon of polygons) {
            if (isPointInPolygon(worldX, worldY, polygon.points)) {
                return true;
            }
        }

        // Then check circles (fallback/simpler exploration)
        const circles = state.exploredCircles || [];
        for (const circle of circles) {
            const dx = worldX - circle.x;
            const dy = worldY - circle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance <= circle.radius) {
                return true;
            }
        }

        // Fallback to tile-based check for backward compatibility
        const gridSystem = require('../utils/InfiniteGridSystem').getGridSystem();
        const gridCoords = gridSystem.worldToGrid(worldX, worldY);
        const key = `${gridCoords.x},${gridCoords.y}`;
        return state.exploredAreas[key] || false;
    },

    getExploredArea: (x, y) => {
        const state = get();
        const key = `${x},${y}`;
        return state.exploredAreas[key] || false;
    },

    // Create a memory snapshot of what's visible at a location
    createMemorySnapshot: (x, y, snapshotData) => {
        const state = get();
        const key = `${x},${y}`;
        set({
            memorySnapshots: {
                ...state.memorySnapshots,
                [key]: {
                    ...snapshotData,
                    timestamp: Date.now()
                }
            },
            exploredAreas: {
                ...state.exploredAreas,
                [key]: true
            }
        });
    },

    getMemorySnapshot: (x, y) => {
        const state = get();
        const key = `${x},${y}`;
        return state.memorySnapshots[key] || null;
    },

    // Update token afterimage when token moves out of view
    updateTokenAfterimage: (tokenId, tokenData, position) => {
        const state = get();
        set({
            tokenAfterimages: {
                ...state.tokenAfterimages,
                [tokenId]: {
                    position: { ...position },
                    data: { ...tokenData },
                    lastSeenTimestamp: Date.now()
                }
            }
        });
    },

    removeTokenAfterimage: (tokenId) => {
        const state = get();
        const newAfterimages = { ...state.tokenAfterimages };
        delete newAfterimages[tokenId];
        set({ tokenAfterimages: newAfterimages });
    },

    getTokenAfterimage: (tokenId) => {
        const state = get();
        return state.tokenAfterimages[tokenId] || null;
    },

    // Capture afterimage and explored area when a player token moves
    captureTokenMovementAfterimage: (tokenId, tokenData, oldPosition, newPosition) => {
        const state = get();

        // Only capture if afterimage is enabled and not in GM mode
        if (!state.afterimageEnabled || state.isGMMode || !state.dynamicFogEnabled) {
            return;
        }

        // Only capture if this is the player's own token (viewing from this token)
        const isViewingFromThisToken = state.viewingFromToken && (
            (state.viewingFromToken.type === 'character' && state.viewingFromToken.characterId === tokenId) ||
            (state.viewingFromToken.type === 'creature' && state.viewingFromToken.creatureId === tokenId) ||
            state.viewingFromToken.id === tokenId
        );

        if (!isViewingFromThisToken) {
            return;
        }

        // Import visibility calculations dynamically to avoid circular dependencies
        Promise.all([
            import('../utils/VisibilityCalculations'),
            import('./gameStore'),
            import('./gridItemStore')
        ]).then(([
            { calculateVisibleTiles },
            gameStoreModule,
            itemStoreModule
        ]) => {
            const gameStore = gameStoreModule.default.getState();
            const { gridSize, gridType, gridOffsetX, gridOffsetY } = gameStore;
            const gridSystem = getGridSystem();

            // Convert old position to grid coordinates
            const oldWorldPos = { x: oldPosition.x, y: oldPosition.y };
            const oldGridCoords = gridSystem.worldToGrid(oldWorldPos.x, oldWorldPos.y);
            const oldGridX = oldGridCoords.x;
            const oldGridY = oldGridCoords.y;

            // Get vision range and type for this token
            let visionRange = 6; // Default vision range
            let visionType = 'normal';
            let fovAngle = state.fovAngle || 360;
            let facingAngle = state.getTokenFacingDirection ? state.getTokenFacingDirection(tokenId) : null;

            if (state.tokenVisionRanges[tokenId]) {
                visionRange = state.tokenVisionRanges[tokenId].range ?? visionRange;
                visionType = state.tokenVisionRanges[tokenId].type || visionType;
            }

            // Calculate what was visible from the old position
            const visibleTiles = calculateVisibleTiles(
                oldGridX,
                oldGridY,
                visionRange,
                visionType,
                state.respectLineOfSight ? state.wallData : {},
                {},
                fovAngle,
                facingAngle,
                gridType || 'square',
                gridSystem
            );

            // Create memory snapshots for all visible tiles
            const itemStore = itemStoreModule.default.getState();
            const { gridItems } = itemStore;

            visibleTiles.forEach(tileKey => {
                const [x, y] = tileKey.split(',').map(Number);

                // Get current state of this tile
                const snapshotData = {
                    terrain: state.terrainData[tileKey] || null,
                    // Get walls that touch this tile
                    walls: Object.entries(state.wallData || {}).filter(([wallKey]) => {
                        const [x1, y1, x2, y2] = wallKey.split(',').map(Number);
                        // Check if wall touches this tile
                        return (x1 === x || x2 === x || y1 === y || y2 === y);
                    }).map(([wallKey, wallData_item]) => ({ key: wallKey, data: wallData_item })),
                    // Get objects at this tile
                    objects: (state.environmentalObjects || []).filter(obj => {
                        if (!obj.position) return false;
                        const objGridX = Math.floor((obj.position.x - gridOffsetX) / gridSize);
                        const objGridY = Math.floor((obj.position.y - gridOffsetY) / gridSize);
                        return objGridX === x && objGridY === y;
                    }),
                    // Get D&D elements at this tile
                    dndElements: (state.dndElements || []).filter(elem => {
                        if (!elem.position) return false;
                        const elemGridX = Math.floor((elem.position.x - gridOffsetX) / gridSize);
                        const elemGridY = Math.floor((elem.position.y - gridOffsetY) / gridSize);
                        return elemGridX === x && elemGridY === y;
                    }),
                    // Get grid items at this tile
                    gridItems: gridItems.filter(item => {
                        if (!item.position) return false;
                        const itemGridX = Math.floor((item.position.x - gridOffsetX) / gridSize);
                        const itemGridY = Math.floor((item.position.y - gridOffsetY) / gridSize);
                        return itemGridX === x && itemGridY === y;
                    })
                };

                // Create memory snapshot and mark as explored
                const currentState = get();
                const key = `${x},${y}`;
                set({
                    memorySnapshots: {
                        ...currentState.memorySnapshots,
                        [key]: {
                            ...snapshotData,
                            timestamp: Date.now()
                        }
                    },
                    exploredAreas: {
                        ...currentState.exploredAreas,
                        [key]: true
                    }
                });
            });

            // Create afterimage at the old position
            const currentState = get();
            set({
                tokenAfterimages: {
                    ...currentState.tokenAfterimages,
                    [tokenId]: {
                        position: { x: oldGridX, y: oldGridY },
                        data: { ...tokenData },
                        lastSeenTimestamp: Date.now()
                    }
                }
            });
        }).catch(error => {
            console.error('Failed to capture token movement afterimage:', error);
        });
    },

    // Clear all memory snapshots and afterimages
    clearMemorySnapshots: () => {
        set({
            exploredAreas: {},
            memorySnapshots: {},
            tokenAfterimages: {}
        });
    },

    setAfterimageEnabled: (enabled) => {
        set({ afterimageEnabled: enabled });
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

    // Viewing from token management
    setViewingFromToken: (token) => {
        const state = get();
        const currentToken = state.viewingFromToken;

        // Determine if this is just a position update of the SAME token
        // or if we're switching to a different token entirely
        const isSameToken = token && currentToken && (
            (token.id && token.id === currentToken.id) ||
            (token.characterId && token.characterId === currentToken.characterId) ||
            (token.creatureId && token.creatureId === currentToken.creatureId) ||
            (token.playerId && token.playerId === currentToken.playerId)
        );

        if (isSameToken) {
            // Just updating position of the same token - DON'T clear afterimages
            // Afterimages should persist as the player moves around
            set({ viewingFromToken: token });
        } else {
            // Switching to a different token or disabling view (token = null)
            // Clear afterimages since we're changing perspective entirely
            // Track if player explicitly disabled view from token (token is null and we had a token before)
            const wasExplicitlyDisabled = !token && currentToken !== null;
            set({
                viewingFromToken: token,
                tokenAfterimages: {},
                // If player explicitly disabled it, mark it so we don't auto-enable again
                playerViewFromTokenDisabled: wasExplicitlyDisabled
            });
        }
    },

    // Update visible area for FOV-based visibility
    setVisibleArea: (visibleArea) => {
        // Convert Set to Array for better React reactivity (Zustand works better with arrays)
        // We'll convert it back to Set when needed for performance
        const visibleAreaArray = visibleArea ? Array.from(visibleArea) : null;
        set({ visibleArea: visibleAreaArray });
    },

    // Update visibility polygon for accurate point-in-polygon checks
    setVisibilityPolygon: (polygon) => {
        set({ visibilityPolygon: polygon });
    },

    // FOV cone settings
    setFovAngle: (angle) => {
        set({ fovAngle: angle });
    },

    setTokenFacingDirection: (tokenId, angle) => {
        const state = get();
        set({
            tokenFacingDirections: {
                ...state.tokenFacingDirections,
                [tokenId]: angle
            }
        });
    },

    getTokenFacingDirection: (tokenId) => {
        const state = get();
        return state.tokenFacingDirections[tokenId] || null;
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

    // Light source management - duplicate functions removed, using professional version below
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

        // Check for duplicate paths (same tool, similar points, recent timestamp)
        const now = Date.now();
        const duplicateThreshold = 1000; // 1 second threshold for duplicate detection
        const pointSimilarityThreshold = 5; // 5 pixels threshold for point similarity

        const isDuplicate = state.drawingPaths.some(existingPath => {
            // Check if same tool and layer
            if (existingPath.tool !== path.tool || existingPath.layer !== state.activeLayer) {
                return false;
            }

            // Check if timestamp is very recent (within threshold)
            const timeDiff = now - (existingPath.timestamp || 0);
            if (timeDiff > duplicateThreshold) {
                return false;
            }

            // Check if points are similar (within threshold)
            if (!path.points || !existingPath.points || path.points.length !== existingPath.points.length) {
                return false;
            }

            // Check if all points are within similarity threshold
            // Support both world coordinates (worldX/worldY) and grid coordinates (x/y)
            const allPointsSimilar = path.points.every((point, index) => {
                const existingPoint = existingPath.points[index];
                if (!existingPoint) return false;

                // Handle world coordinates
                if (point.isWorldCoords && existingPoint.isWorldCoords) {
                    const dx = Math.abs((point.worldX || 0) - (existingPoint.worldX || 0));
                    const dy = Math.abs((point.worldY || 0) - (existingPoint.worldY || 0));
                    return dx <= pointSimilarityThreshold && dy <= pointSimilarityThreshold;
                }
                // Handle grid coordinates
                const dx = Math.abs((point.x || point.worldX || 0) - (existingPoint.x || existingPoint.worldX || 0));
                const dy = Math.abs((point.y || point.worldY || 0) - (existingPoint.y || existingPoint.worldY || 0));
                return dx <= pointSimilarityThreshold && dy <= pointSimilarityThreshold;
            });

            return allPointsSimilar;
        });

        // Skip adding if duplicate
        if (isDuplicate) {
            return null;
        }

        const newPath = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            ...path,
            layer: state.activeLayer,
            timestamp: now
        };
        const newDrawingPaths = [...state.drawingPaths, newPath];
        set({
            drawingPaths: newDrawingPaths
        });

        // Emit drawing update to multiplayer server
        import('./gameStore').then(({ default: useGameStore }) => {
            const gameStore = useGameStore.getState();
            if (gameStore.isInMultiplayer && gameStore.multiplayerSocket && gameStore.multiplayerSocket.connected && gameStore.isGMMode) {
                if (!window._isReceivingMapUpdate) {
                    gameStore.multiplayerSocket.emit('map_update', {
                        mapUpdates: {
                            drawingPaths: newDrawingPaths
                        }
                    });
                }
            }
        }).catch(() => {
            // Ignore errors if gameStore not available
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
            fogOfWarPaths: state.fogOfWarPaths || [], // CRITICAL FIX: Save fog paths (including "cover entire map")
            fogErasePaths: state.fogErasePaths || [], // CRITICAL FIX: Save erase paths
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
            fogOfWarPaths: mapData.fogOfWarPaths || [], // CRITICAL FIX: Load fog paths (including "cover entire map")
            fogErasePaths: mapData.fogErasePaths || [], // CRITICAL FIX: Load erase paths
            exploredAreas: mapData.exploredAreas || {},
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
            fogOfWarPaths: [],
            fogErasePaths: [],
            exploredAreas: {},
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

        // Use batcher
        mapUpdateBatcher.addUpdate('terrainData', { [tileKey]: terrainData_value });
    },

    removeTerrainAtPosition: (gridX, gridY, brushSize = 1) => {
        const state = get();
        const newTerrainData = { ...state.terrainData };
        const removedTiles = {};

        // Calculate brush pattern based on size (same as paintTerrainBrush)
        const startOffset = Math.floor(brushSize / 2);

        for (let dx = 0; dx < brushSize; dx++) {
            for (let dy = 0; dy < brushSize; dy++) {
                const tileX = gridX - startOffset + dx;
                const tileY = gridY - startOffset + dy;
                const tileKey = `${tileX},${tileY}`;
                delete newTerrainData[tileKey];
                removedTiles[tileKey] = null;
            }
        }

        set({ terrainData: newTerrainData });

        // Use batcher
        mapUpdateBatcher.addUpdate('terrainData', removedTiles);
    },

    // Fog of War functions - Free-form path-based painting (NOT grid-bound)
    paintFogBrush: (worldX, worldY, brushRadius, gridSize = 50) => {
        const state = get();
        const fogPaths = [...state.fogOfWarPaths];

        // Keep fog free-form - do NOT snap to grid (fog should be smooth and continuous)

        // Ensure brush radius is valid and positive
        const validBrushRadius = Math.max(0.5, brushRadius || 1);

        // Convert brush size (1-5) to pixel radius in world space
        // Use consistent calculation for all points
        // Increased multiplier for thicker fog (0.5 -> 0.7)
        const actualRadius = validBrushRadius * gridSize * 0.7;

        // Ensure minimum radius to avoid rendering issues
        if (actualRadius <= 0 || !Number.isFinite(actualRadius)) {
            return; // Skip if invalid radius
        }

        // Check if we're continuing an existing path (within 2x brush radius of last point)
        let currentPath = fogPaths.find(path => path.isDrawing);

        if (currentPath && currentPath.points.length > 0) {
            const lastPoint = currentPath.points[currentPath.points.length - 1];
            // Use squared distance for performance (avoid Math.sqrt)
            const dx = worldX - lastPoint.worldX;
            const dy = worldY - lastPoint.worldY;
            const distanceSquared = dx * dx + dy * dy;

            // Use the same radius calculation for continuity check (squared for comparison)
            // Increase continuation radius for smoother drawing (less gaps)
            const continuationRadius = actualRadius * 2.5; // Increased from 2.0 for smoother drawing
            const continuationRadiusSquared = continuationRadius * continuationRadius;

            // If close enough, add to existing path with consistent radius
            if (distanceSquared <= continuationRadiusSquared) {
                // Mutate the path directly for better performance (we'll create new array on set)
                currentPath.points.push({
                    worldX,
                    worldY,
                    brushRadius: actualRadius
                });
                // Create new array reference for React reactivity
                set({ fogOfWarPaths: [...fogPaths] });
                return;
            }
        }

        // Create new path with consistent radius calculation
        const newPath = {
            id: `fog_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            points: [{ worldX, worldY, brushRadius: actualRadius }],
            timestamp: Date.now(),
            isDrawing: true
        };

        fogPaths.push(newPath);

        // Auto-consolidate if too many paths (performance optimization)
        const MAX_PATHS_BEFORE_CONSOLIDATION = 100;
        if (fogPaths.length > MAX_PATHS_BEFORE_CONSOLIDATION) {
            // Consolidate paths automatically
            const state = get();
            if (state.consolidateFogPaths) {
                state.consolidateFogPaths();
                return; // Consolidate will update the paths
            }
        }

        set({ fogOfWarPaths: fogPaths });
    },

    removeFogAtPosition: (worldX, worldY, brushRadius, gridSize = 50) => {
        const state = get();
        const fogErasePaths = [...state.fogErasePaths];

        // Keep fog free-form - do NOT snap to grid (fog should be smooth and continuous)

        // Ensure brush radius is valid and positive
        const validBrushRadius = Math.max(0.5, brushRadius || 1);

        // Convert brush size to pixel radius in world space
        // Use consistent calculation for all points
        const actualRadius = validBrushRadius * gridSize * 0.5;

        // Ensure minimum radius to avoid rendering issues
        if (actualRadius <= 0 || !Number.isFinite(actualRadius)) {
            return; // Skip if invalid radius
        }

        // Check if we're continuing an existing erase path (within 2x brush radius of last point)
        let currentErasePath = fogErasePaths.find(path => path.isDrawing);

        if (currentErasePath && currentErasePath.points.length > 0) {
            const lastPoint = currentErasePath.points[currentErasePath.points.length - 1];
            // Use squared distance for performance (avoid Math.sqrt)
            const dx = worldX - lastPoint.worldX;
            const dy = worldY - lastPoint.worldY;
            const distanceSquared = dx * dx + dy * dy;

            // Use the same radius calculation for continuity check (squared for comparison)
            // Increase continuation radius for smoother erasing (less gaps)
            const continuationRadius = actualRadius * 2.5; // Increased from 2.0 for smoother erasing
            const continuationRadiusSquared = continuationRadius * continuationRadius;

            // If close enough, add to existing erase path with consistent radius
            if (distanceSquared <= continuationRadiusSquared) {
                // Mutate the path directly for better performance (we'll create new array on set)
                currentErasePath.points.push({
                    worldX,
                    worldY,
                    brushRadius: actualRadius
                });
                // Create new array reference for React reactivity
                set({ fogErasePaths: [...fogErasePaths] });
                return;
            }
        }

        // Create new erase path with consistent radius calculation
        const newErasePath = {
            id: `fog_erase_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            points: [{ worldX, worldY, brushRadius: actualRadius }],
            timestamp: Date.now(),
            isDrawing: true
        };

        fogErasePaths.push(newErasePath);
        set({ fogErasePaths: fogErasePaths });
    },

    finishFogPath: () => {
        const state = get();
        const fogPaths = state.fogOfWarPaths.map(path =>
            path.isDrawing ? { ...path, isDrawing: false } : path
        );
        set({ fogOfWarPaths: fogPaths });

        // Emit fog paths update to multiplayer server
        import('./gameStore').then(({ default: useGameStore }) => {
            const gameStore = useGameStore.getState();
            if (gameStore.isInMultiplayer && gameStore.multiplayerSocket && gameStore.multiplayerSocket.connected && gameStore.isGMMode) {
                if (!window._isReceivingMapUpdate) {
                    gameStore.multiplayerSocket.emit('map_update', {
                        mapUpdates: {
                            fogOfWarPaths: fogPaths
                        }
                    });
                }
            }
        }).catch(() => {
            // Ignore errors if gameStore not available
        });
    },

    finishFogErasePath: () => {
        const state = get();
        const fogErasePaths = state.fogErasePaths.map(path =>
            path.isDrawing ? { ...path, isDrawing: false } : path
        );
        set({ fogErasePaths: fogErasePaths });

        // Emit fog erase paths update to multiplayer server
        import('./gameStore').then(({ default: useGameStore }) => {
            const gameStore = useGameStore.getState();
            if (gameStore.isInMultiplayer && gameStore.multiplayerSocket && gameStore.multiplayerSocket.connected && gameStore.isGMMode) {
                if (!window._isReceivingMapUpdate) {
                    gameStore.multiplayerSocket.emit('map_update', {
                        mapUpdates: {
                            fogErasePaths: fogErasePaths
                        }
                    });
                }
            }
        }).catch(() => {
            // Ignore errors if gameStore not available
        });
    },

    clearAllFog: () => {
        const state = get();
        set({ fogOfWarPaths: [], fogErasePaths: [], fogOfWarData: {} });

        // Emit clear all fog update to multiplayer server
        import('./gameStore').then(({ default: useGameStore }) => {
            const gameStore = useGameStore.getState();
            if (gameStore.isInMultiplayer && gameStore.multiplayerSocket && gameStore.multiplayerSocket.connected && gameStore.isGMMode) {
                if (!window._isReceivingMapUpdate) {
                    gameStore.multiplayerSocket.emit('map_update', {
                        mapUpdates: {
                            fogOfWarPaths: [],
                            fogErasePaths: [],
                            fogOfWarData: {}
                        }
                    });
                }
            }
        }).catch(() => {
            // Ignore errors if gameStore not available
        });
    },

    // Helper function to get bounding box of a path
    getPathBounds: (points) => {
        if (!points || points.length === 0) return null;
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        for (const point of points) {
            const radius = point.brushRadius || 0;
            minX = Math.min(minX, point.worldX - radius);
            minY = Math.min(minY, point.worldY - radius);
            maxX = Math.max(maxX, point.worldX + radius);
            maxY = Math.max(maxY, point.worldY + radius);
        }
        return { minX, minY, maxX, maxY };
    },

    // Helper function to check if two path bounds overlap
    pathsOverlap: (bounds1, bounds2) => {
        if (!bounds1 || !bounds2) return false;
        return !(bounds1.maxX < bounds2.minX || bounds1.minX > bounds2.maxX ||
            bounds1.maxY < bounds2.minY || bounds1.minY > bounds2.maxY);
    },

    // Consolidate fog paths to reduce performance issues
    // Merges overlapping paths and limits total path count
    consolidateFogPaths: () => {
        const state = get();
        const MAX_PATHS = 50; // Limit total paths
        const MAX_POINTS_PER_PATH = 2000; // Limit points per path

        let fogPaths = [...state.fogOfWarPaths];
        let erasePaths = [...state.fogErasePaths];

        // Sort by timestamp (oldest first)
        fogPaths.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
        erasePaths.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

        // Keep full-coverage paths (cover entire map) - these are important
        const fullCoveragePaths = fogPaths.filter(path =>
            path.isFullCoverage || (path.id && path.id.startsWith('fog_cover_entire_map_')) || (path.points && path.points.length > 5000)
        );
        const regularPaths = fogPaths.filter(path =>
            !path.isFullCoverage && (!path.id || !path.id.startsWith('fog_cover_entire_map_')) && (!path.points || path.points.length <= 5000)
        );

        // Limit regular paths - keep most recent ones
        const limitedRegularPaths = regularPaths.slice(-MAX_PATHS);

        // Merge small paths that are close together
        const mergedPaths = [];
        const processed = new Set();

        for (let i = 0; i < limitedRegularPaths.length; i++) {
            if (processed.has(i)) continue;

            const path1 = limitedRegularPaths[i];
            if (!path1.points || path1.points.length === 0) continue;

            const mergedPath = {
                ...path1,
                points: [...path1.points]
            };
            processed.add(i);

            // Try to merge with nearby paths
            for (let j = i + 1; j < limitedRegularPaths.length; j++) {
                if (processed.has(j)) continue;

                const path2 = limitedRegularPaths[j];
                if (!path2.points || path2.points.length === 0) continue;

                // Check if paths are close in time (within 5 seconds)
                const timeDiff = Math.abs((path1.timestamp || 0) - (path2.timestamp || 0));
                if (timeDiff < 5000) {
                    // Check if paths overlap spatially
                    const path1Bounds = state.getPathBounds(path1.points);
                    const path2Bounds = state.getPathBounds(path2.points);

                    if (state.pathsOverlap(path1Bounds, path2Bounds)) {
                        // Merge paths
                        mergedPath.points.push(...path2.points);
                        mergedPath.timestamp = Math.max(mergedPath.timestamp || 0, path2.timestamp || 0);
                        processed.add(j);
                    }
                }
            }

            // Limit points per merged path
            if (mergedPath.points.length > MAX_POINTS_PER_PATH) {
                // Sample points evenly
                const step = Math.floor(mergedPath.points.length / MAX_POINTS_PER_PATH);
                mergedPath.points = mergedPath.points.filter((_, idx) => idx % step === 0);
            }

            mergedPaths.push(mergedPath);
        }

        // Combine: full-coverage first, then merged regular paths
        const consolidatedFogPaths = [...fullCoveragePaths, ...mergedPaths];

        // Limit erase paths similarly
        const limitedErasePaths = erasePaths.slice(-MAX_PATHS);

        set({
            fogOfWarPaths: consolidatedFogPaths,
            fogErasePaths: limitedErasePaths
        });
    },

    coverEntireMapWithFog: (gridSize = 50) => {
        // PERFORMANCE FIX: Instead of creating hundreds of thousands of points,
        // just create a minimal marker path with the 'fog_cover_entire_map_' ID prefix.
        // The rendering code detects this ID and renders a full-canvas fill instead.
        try {
            const state = get();
            const existingFogPaths = [...state.fogOfWarPaths];

            // Remove any existing "cover entire map" paths to avoid duplicates
            const filteredPaths = existingFogPaths.filter(path =>
                !path.id || !path.id.startsWith('fog_cover_entire_map_')
            );

            // Create a minimal marker path - the ID prefix tells the renderer to fill the entire canvas
            // We only need a few points to mark this as a valid path
            const newFogPath = {
                id: `fog_cover_entire_map_${Date.now()}`,
                points: [
                    // Just 4 corner markers - the rendering code will fill the whole canvas
                    { worldX: -100000, worldY: -100000, brushRadius: gridSize * 2.5 },
                    { worldX: 100000, worldY: -100000, brushRadius: gridSize * 2.5 },
                    { worldX: 100000, worldY: 100000, brushRadius: gridSize * 2.5 },
                    { worldX: -100000, worldY: 100000, brushRadius: gridSize * 2.5 }
                ],
                timestamp: Date.now(),
                isDrawing: false,
                isFullCoverage: true // Explicit flag for full coverage
            };

            // Add the new path to existing paths (preserving manually painted fog)
            filteredPaths.push(newFogPath);

            // Clear erase paths when covering entire map
            // Old erase paths were meant for old fog paths that no longer exist
            // New erase paths will be created for the new "cover entire map" fog path
            const newState = { fogOfWarPaths: filteredPaths, fogErasePaths: [] };
            set(newState);

            // Emit cover entire map update to multiplayer server
            import('./gameStore').then(({ default: useGameStore }) => {
                const gameStore = useGameStore.getState();
                if (gameStore.isInMultiplayer && gameStore.multiplayerSocket && gameStore.multiplayerSocket.connected && gameStore.isGMMode) {
                    if (!window._isReceivingMapUpdate) {
                        gameStore.multiplayerSocket.emit('map_update', {
                            mapUpdates: {
                                fogOfWarPaths: filteredPaths,
                                fogErasePaths: []
                            }
                        });
                    }
                }
            }).catch(() => {
                // Ignore errors if gameStore not available
            });

        } catch (error) {
            console.error('🌫️ Error in coverEntireMapWithFog:', error);
            // Fallback - create minimal marker path
            const fogPaths = [{
                id: `fog_cover_entire_map_${Date.now()}`,
                points: [
                    { worldX: -100000, worldY: -100000, brushRadius: gridSize * 2.5 },
                    { worldX: 100000, worldY: 100000, brushRadius: gridSize * 2.5 }
                ],
                timestamp: Date.now(),
                isDrawing: false,
                isFullCoverage: true
            }];

            set({ fogOfWarPaths: fogPaths, fogErasePaths: [] });
        }
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

    // CRITICAL FIX: Add tile change detection to prevent redundant updates
    // This prevents unnecessary socket emissions and terrain flickering when painting
    paintTerrainBrush: (gridX, gridY, terrainType, brushSize = 1) => {
        const state = get();
        const newTerrainData = { ...state.terrainData };
        const addedTiles = {};
        let hasChanges = false;

        const terrain = PROFESSIONAL_TERRAIN_TYPES[terrainType];

        // Calculate brush pattern based on size
        const startOffset = Math.floor(brushSize / 2);

        for (let dx = 0; dx < brushSize; dx++) {
            for (let dy = 0; dy < brushSize; dy++) {
                const tileX = gridX - startOffset + dx;
                const tileY = gridY - startOffset + dy;
                const tileKey = `${tileX},${tileY}`;

                // Check if tile has actually changed before updating
                const existingTerrain = state.terrainData[tileKey];

                // Determine variation if applicable
                let variationIndex = undefined;
                if (terrain && terrain.tileVariations && terrain.tileVariations.length > 0) {
                    variationIndex = state.getTileVariation(tileX, tileY, terrain.tileVariations.length);
                }

                const needsUpdate = !existingTerrain || (
                    typeof existingTerrain === 'string' ? existingTerrain !== terrainType : (
                        existingTerrain.type !== terrainType ||
                        (variationIndex !== undefined && existingTerrain.variation !== variationIndex)
                    )
                );

                // Skip if no change needed
                if (!needsUpdate) continue;

                const terrainData_value = variationIndex !== undefined
                    ? { type: terrainType, variation: variationIndex }
                    : terrainType;

                newTerrainData[tileKey] = terrainData_value;
                addedTiles[tileKey] = terrainData_value;
                hasChanges = true;
            }
        }

        if (hasChanges) {
            set({ terrainData: newTerrainData });
            // Use batcher
            mapUpdateBatcher.addUpdate('terrainData', addedTiles);
        }
    },

    // NEW: paintTerrainLine to handle interpolated painting in a single state update
    paintTerrainLine: (x1, y1, x2, y2, terrainType, brushSize = 1) => {
        const state = get();
        const newTerrainData = { ...state.terrainData };
        const addedTiles = {};
        let hasChanges = false;

        const terrain = PROFESSIONAL_TERRAIN_TYPES[terrainType];

        // Bresenham's line algorithm for interpolation
        const dx = Math.abs(x2 - x1);
        const dy = Math.abs(y2 - y1);
        const sx = (x1 < x2) ? 1 : -1;
        const sy = (y1 < y2) ? 1 : -1;
        let err = dx - dy;

        let curX = x1;
        let curY = y1;

        while (true) {
            // Apply brush at current point
            const startOffset = Math.floor(brushSize / 2);
            for (let bdx = 0; bdx < brushSize; bdx++) {
                for (let bdy = 0; bdy < brushSize; bdy++) {
                    const tileX = curX - startOffset + bdx;
                    const tileY = curY - startOffset + bdy;
                    const tileKey = `${tileX},${tileY}`;

                    const existingTerrain = newTerrainData[tileKey]; // Check against current update batch too

                    let variationIndex = undefined;
                    if (terrain && terrain.tileVariations && terrain.tileVariations.length > 0) {
                        variationIndex = state.getTileVariation(tileX, tileY, terrain.tileVariations.length);
                    }

                    const needsUpdate = !existingTerrain || (
                        typeof existingTerrain === 'string' ? existingTerrain !== terrainType : (
                            existingTerrain.type !== terrainType ||
                            (variationIndex !== undefined && existingTerrain.variation !== variationIndex)
                        )
                    );

                    if (needsUpdate) {
                        const terrainData_value = variationIndex !== undefined
                            ? { type: terrainType, variation: variationIndex }
                            : terrainType;

                        newTerrainData[tileKey] = terrainData_value;
                        addedTiles[tileKey] = terrainData_value;
                        hasChanges = true;
                    }
                }
            }

            if (curX === x2 && curY === y2) break;
            const e2 = 2 * err;
            if (e2 > -dy) { err -= dy; curX += sx; }
            if (e2 < dx) { err += dx; curY += sy; }
        }

        if (hasChanges) {
            set({ terrainData: newTerrainData });
            mapUpdateBatcher.addUpdate('terrainData', addedTiles);
        }
    },

    // NEW: removeTerrainLine to handle interpolated erasing in a single state update
    removeTerrainLine: (x1, y1, x2, y2, brushSize = 1) => {
        const state = get();
        const newTerrainData = { ...state.terrainData };
        const removedTiles = {};
        let hasChanges = false;

        // Bresenham's line algorithm for interpolation
        const dx = Math.abs(x2 - x1);
        const dy = Math.abs(y2 - y1);
        const sx = (x1 < x2) ? 1 : -1;
        const sy = (y1 < y2) ? 1 : -1;
        let err = dx - dy;

        let curX = x1;
        let curY = y1;

        while (true) {
            // Apply erase brush at current point
            const startOffset = Math.floor(brushSize / 2);
            for (let bdx = 0; bdx < brushSize; bdx++) {
                for (let bdy = 0; bdy < brushSize; bdy++) {
                    const tileX = curX - startOffset + bdx;
                    const tileY = curY - startOffset + bdy;
                    const tileKey = `${tileX},${tileY}`;

                    if (newTerrainData[tileKey] !== undefined) {
                        delete newTerrainData[tileKey];
                        removedTiles[tileKey] = null;
                        hasChanges = true;
                    }
                }
            }

            if (curX === x2 && curY === y2) break;
            const e2 = 2 * err;
            if (e2 > -dy) { err -= dy; curX += sx; }
            if (e2 < dx) { err += dx; curY += sy; }
        }

        if (hasChanges) {
            set({ terrainData: newTerrainData });
            mapUpdateBatcher.addUpdate('terrainData', removedTiles);
        }
    },

    // Flood fill terrain
    floodFillTerrain: (startX, startY, newTerrainType) => {
        const state = get();
        const startKey = `${startX},${startY}`;
        const originalTerrain = state.terrainData[startKey];

        if (originalTerrain === newTerrainType) return;

        const newTerrainData = { ...state.terrainData };
        const changedTiles = {};
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

            let terrainData_value;
            // For terrain types with tile variations, use precalculated variation
            if (terrain && terrain.tileVariations && terrain.tileVariations.length > 0) {
                const variationIndex = get().getTileVariation(x, y, terrain.tileVariations.length);
                terrainData_value = {
                    type: newTerrainType,
                    variation: variationIndex
                };
            } else {
                // Standard terrain without variations
                terrainData_value = newTerrainType;
            }

            newTerrainData[key] = terrainData_value;
            changedTiles[key] = terrainData_value;

            // Add adjacent tiles to queue
            queue.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
        }

        set({ terrainData: newTerrainData });

        // Use batcher
        mapUpdateBatcher.addUpdate('terrainData', changedTiles);
    },

    // Get terrain type at position
    getTerrainAtPosition: (gridX, gridY) => {
        const state = get();
        const tileKey = `${gridX},${gridY}`;
        return state.terrainData[tileKey] || null;
    },

    // Professional object placement methods
    addEnvironmentalObject: (objectData) => {
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
    },

    // Reset store to initial state
    resetStore: () => {
        set({ ...initialState });
    }
}));

export default useLevelEditorStore;