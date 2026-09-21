// Shared GM note type definitions.
//
// One source of truth for the note icon picker in GMNotesWindow, the
// canvas-rendered note on the map (ObjectSystem), and the palette/placement
// preview art. `icon` is the Font Awesome class used by DOM renderers;
// `unicode` is the equivalent glyph used by the canvas renderer.
export const NOTE_ICONS = [
    { id: 'scroll', icon: 'fa-scroll', unicode: '\uf70e', label: 'General Note', color: '#8B4513' },
    { id: 'location', icon: 'fa-map-marker-alt', unicode: '\uf3c5', label: 'Location', color: '#2d6a4f' },
    { id: 'npc', icon: 'fa-users', unicode: '\uf0c0', label: 'NPC', color: '#6a4c93' },
    { id: 'encounter', icon: 'fa-skull-crossbones', unicode: '\uf714', label: 'Encounter', color: '#9b2226' },
    { id: 'trap', icon: 'fa-exclamation-triangle', unicode: '\uf071', label: 'Trap', color: '#e76f51' },
    { id: 'quest', icon: 'fa-flag', unicode: '\uf024', label: 'Quest', color: '#264653' },
    { id: 'puzzle', icon: 'fa-puzzle-piece', unicode: '\uf12e', label: 'Puzzle', color: '#457b9d' },
    { id: 'treasure', icon: 'fa-gem', unicode: '\uf3a5', label: 'Treasure', color: '#b5838d' },
    { id: 'lore', icon: 'fa-book-open', unicode: '\uf518', label: 'Lore', color: '#5a189a' },
    { id: 'shop', icon: 'fa-store', unicode: '\uf54e', label: 'Shop', color: '#606c38' },
    { id: 'secret', icon: 'fa-eye-slash', unicode: '\uf070', label: 'Secret', color: '#4a4e69' },
    { id: 'monster', icon: 'fa-dragon', unicode: '\uf6d1', label: 'Monster', color: '#6b0f1a' },
    { id: 'puzzle-door', icon: 'fa-dungeon', unicode: '\uf6d5', label: 'Dungeon', color: '#343a40' },
    { id: 'event', icon: 'fa-bolt', unicode: '\uf0e7', label: 'Event', color: '#e9c46a' },
    { id: 'read-aloud', icon: 'fa-book-reader', unicode: '\uf5da', label: 'Read Aloud', color: '#d4af37' },
    { id: 'safe-rest', icon: 'fa-campground', unicode: '\uf6bb', label: 'Safe Haven', color: '#2a9d8f' },
];

export const NOTE_ICON_UNICODES = NOTE_ICONS.reduce((acc, icon) => {
    acc[icon.id] = icon.unicode;
    return acc;
}, {});

export const getNoteIconDef = (iconId) => NOTE_ICONS.find(icon => icon.id === iconId) || NOTE_ICONS[0];
