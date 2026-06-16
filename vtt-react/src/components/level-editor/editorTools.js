/**
 * Single source of truth for editor tool/tab definitions.
 * Both ProfessionalVTTEditor and individual tool panels import from here.
 */
export const EDITOR_TABS = {
    terrain: {
        name: 'Terrain',
        tools: [
            { id: 'terrain_brush', name: 'Terrain Brush', icon: 'Utility/Utility Tool', cursor: 'crosshair' },
            { id: 'terrain_erase', name: 'Terrain Eraser', icon: 'Utility/Broken', cursor: 'crosshair' },
            { id: 'tile_stamp', name: 'Tile Stamp', icon: 'Utility/Utility', cursor: 'crosshair' },
            { id: 'elevation', name: 'Elevation', icon: 'Nature/World Map', cursor: 'crosshair' },
            { id: 'texture_paint', name: 'Texture Paint', icon: 'Utility/Utility Tool', cursor: 'crosshair' }
        ]
    },
    drawing: {
        name: 'Drawing',
        tools: [
            { id: 'select', name: 'Select', icon: 'Utility/Target Crosshair', cursor: 'default' },
            { id: 'area_remove', name: 'Area Remove', icon: 'Utility/Broken', cursor: 'crosshair' },
            { id: 'freehand', name: 'Freehand', icon: 'Utility/Utility Tool', cursor: 'crosshair' },
            { id: 'line', name: 'Line', icon: 'Piercing/Piercing Shot', cursor: 'crosshair' },
            { id: 'rectangle', name: 'Rectangle', icon: 'Utility/Utility', cursor: 'crosshair' },
            { id: 'circle', name: 'Circle', icon: 'Arcane/Orb Manipulation', cursor: 'crosshair' },
            { id: 'polygon', name: 'Polygon', icon: 'Utility/Utility', cursor: 'crosshair' },
            { id: 'text', name: 'Text', icon: 'Utility/Utility', cursor: 'text' },
            { id: 'eraser', name: 'Eraser', icon: 'Utility/Broken', cursor: 'crosshair' }
        ]
    },
    walls: {
        name: 'Walls',
        tools: [
            { id: 'wall_draw', name: 'Draw Wall', icon: 'Utility/Barred Shield', cursor: 'crosshair' },
            { id: 'door_place', name: 'Place Door', icon: 'Utility/Lockpick', cursor: 'crosshair' },
            { id: 'window_place', name: 'Place Window', icon: 'Utility/All Seeing Eye', cursor: 'crosshair' },
            { id: 'barrier_magic', name: 'Magic Barrier', icon: 'Arcane/Orb Manipulation', cursor: 'crosshair' },
            { id: 'wall_select', name: 'Select', icon: 'Utility/Target Crosshair', cursor: 'pointer' },
            { id: 'wall_erase', name: 'Erase Walls', icon: 'Utility/Broken', cursor: 'crosshair' }
        ]
    },
    fog: {
        name: 'Fog',
        tools: [
            { id: 'fog_draw', name: 'Draw Fog', icon: 'Shadow/Shadow Invisibility', cursor: 'crosshair' },
            { id: 'fog_erase', name: 'Erase Fog', icon: 'Utility/Broken', cursor: 'crosshair' },
            { id: 'fog_clear_all', name: 'Clear All Fog', icon: 'Radiant/Radiant Sunburst', cursor: 'crosshair' },
            { id: 'fog_cover_map', name: 'Cover Entire Map', icon: 'Shadow/Shadow Darkness', cursor: 'crosshair' }
        ]
    },
    objects: {
        name: 'Objects',
        tools: [
            { id: 'object_place', name: 'Place Object', icon: 'Utility/Utility', cursor: 'crosshair' },
            { id: 'token_place', name: 'Place Token', icon: 'Social/Golden Crown', cursor: 'crosshair' },
            { id: 'portal_create', name: 'Create Connection', icon: 'Arcane/Orb Manipulation', cursor: 'crosshair' },
            { id: 'marker_place', name: 'Place Marker', icon: 'Utility/Utility', cursor: 'crosshair' },
            { id: 'object_rotate', name: 'Rotate', icon: 'Utility/Swirling Vortex', cursor: 'move' },
            { id: 'object_scale', name: 'Scale', icon: 'Utility/Resize', cursor: 'nw-resize' }
        ]
    },
    grid: {
        name: 'Grid',
        tools: [
            { id: 'grid_settings', name: 'Grid Settings', icon: 'Utility/Utility Gear', cursor: 'default' },
            { id: 'grid_toggle', name: 'Toggle Grid', icon: 'Utility/Utility Gear', cursor: 'default' },
            { id: 'grid_align', name: 'Align Grid', icon: 'Utility/Utility Gear', cursor: 'default' }
        ]
    },
    lighting: {
        name: 'Lighting',
        tools: [
            { id: 'lighting_settings', name: 'Lighting Settings', icon: 'Arcane/Arcane Brilliance', cursor: 'default' }
        ]
    }
};

/** Helper: find cursor for a given tab+tool combination */
export const getToolCursor = (tabId, toolId) => {
    const tab = EDITOR_TABS[tabId];
    if (!tab) return 'default';
    const tool = tab.tools.find(t => t.id === toolId);
    return tool?.cursor || 'default';
};

/** Helper: get the first tool for a tab (used as default when switching tabs) */
export const getFirstTool = (tabId) => {
    return EDITOR_TABS[tabId]?.tools[0] || null;
};
