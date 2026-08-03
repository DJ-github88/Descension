/**
 * Map Pin Icon Registry
 * Detailed TTRPG fantasy cartography SVG paths for all location categories.
 */

const PIN_ICONS = {
  city: {
    viewBox: '0 0 24 24',
    // Capital Keep / Castle with twin towers, battlements, and central arch
    path: 'M2 22h20V9l-3-3v3h-2V5l-3-3-3 3v4H9V5L6 9v3H4V6L1 9v13zm9-8h2v8h-2v-8zm-6 2h2v6H5v-6zm12 0h2v6h-2v-6z'
  },
  fortress: {
    viewBox: '0 0 24 24',
    // Heavy Bastion Fortress with battlements and portcullis
    path: 'M1 22h22V10l-4-3v3h-2V6l-3-3-2 2-2-2-3 3v4H7V7L3 10v12zm8-6h6v6H9v-6zm2 2h2v4h-2v-4z'
  },
  settlement: {
    viewBox: '0 0 24 24',
    // Village Cottages with gabled roofs
    path: 'M3 21h18V11l-9-7-9 7v10zm6-7h6v7H9v-7zm-4 2h2v4H5v-4zm12 0h2v4h-2v-4z'
  },
  house: {
    viewBox: '0 0 24 24',
    path: 'M3 21h18V11l-9-7-9 7v10zm6-7h6v7H9v-7z'
  },
  tower: {
    viewBox: '0 0 24 24',
    // Tall Watchspire with balcony and spire cap
    path: 'M12 1L8 6v2h8V6l-4-5zm-3 8h6v12H9V9zm2 3h2v4h-2v-4zM6 22h12v-1H6v1z'
  },
  mountain: {
    viewBox: '0 0 24 24',
    // Majestic Alpine Peaks with snowy ridges
    path: 'M1 22l8-14 4 6 3-4 7 12H1zm11-6.5l2.5 3.5H7.5L12 15.5z'
  },
  forest: {
    viewBox: '0 0 24 24',
    // Ancient Pine Grove with layered branches
    path: 'M12 2L6 10h2.5L4 16h6.5v6h3v-6H20l-4.5-6H18L12 2z'
  },
  tree: {
    viewBox: '0 0 24 24',
    path: 'M12 2L6 10h2.5L4 16h6.5v6h3v-6H20l-4.5-6H18L12 2z'
  },
  wilderness: {
    viewBox: '0 0 24 24',
    path: 'M12 2a6 6 0 00-6 6c0 2.5 1.5 4.5 3 5.5V18h6v-4.5c1.5-1 3-3 3-5.5a6 6 0 00-6-6zm-1 18h2v3h-2v-3z'
  },
  cave: {
    viewBox: '0 0 24 24',
    // Jagged Cavern Mouth
    path: 'M2 22h20M3 22C4 11 7 5 12 5s8 6 9 17H3zm6-5c1.5-2 3-3 3-3s1.5 1 3 3H9z'
  },
  poi: {
    viewBox: '0 0 24 24',
    // 8-Pointed Star Compass Rose
    path: 'M12 1l2.8 6.2L21 10l-5 4.6L17.5 21 12 17.5 6.5 21 8 14.6 3 10l6.2-2.8L12 1z'
  },
  door: {
    viewBox: '0 0 24 24',
    path: 'M12 1l2.8 6.2L21 10l-5 4.6L17.5 21 12 17.5 6.5 21 8 14.6 3 10l6.2-2.8L12 1z'
  },
  harbor: {
    viewBox: '0 0 24 24',
    // Maritime Sea Anchor
    path: 'M12 2a2.5 2.5 0 100 5 2.5 2.5 0 000-5zm1 6h-2v4H6v2h5v7.8c-3.2-.5-5.8-2.8-6.6-5.8H2.3c.9 4.6 4.7 8.2 9.7 8.9v-3.1h2v3.1c5-.7 8.8-4.3 9.7-8.9h-2.1c-.8 3-3.4 5.3-6.6 5.8V14h5v-2h-5V8z'
  },
  port: {
    viewBox: '0 0 24 24',
    path: 'M12 2a2.5 2.5 0 100 5 2.5 2.5 0 000-5zm1 6h-2v4H6v2h5v7.8c-3.2-.5-5.8-2.8-6.6-5.8H2.3c.9 4.6 4.7 8.2 9.7 8.9v-3.1h2v3.1c5-.7 8.8-4.3 9.7-8.9h-2.1c-.8 3-3.4 5.3-6.6 5.8V14h5v-2h-5V8z'
  },
  ruin: {
    viewBox: '0 0 24 24',
    // Ancient Pillars & Broken Arch
    path: 'M3 22h18v-2H3v2zm2-4h3V8H5v10zm5 0h4v-7h-4v7zm6 0h3V6h-3v12zM3 5h18V3H3v2z'
  },
  tomb: {
    viewBox: '0 0 24 24',
    // Barrow Vault / Crypt Sarcophagus
    path: 'M12 2C7 2 3 6 3 11v11h18V11c0-5-4-9-9-9zm-1 5h2v3h3v2h-3v6h-2v-6H8v-2h3V7z'
  },
  camp: {
    viewBox: '0 0 24 24',
    // A-frame Encampment Tent
    path: 'M12 2L1 21h22L12 2zm0 5.5L18.5 19H5.5L12 7.5z'
  },
  shrine: {
    viewBox: '0 0 24 24',
    // Sacred Torii / Runic Altar
    path: 'M2 22h20v-3H2v3zm2-5h16V9H4v8zm2-6h12v4H6v-4zm-3-5h18V3H3v3z'
  },
  magic: {
    viewBox: '0 0 24 24',
    // Arcane Crystal Shards
    path: 'M12 1l3 7 7 4-6 5 1 6-5-4-5 4 1-6-6-5 7-4 3-7z'
  },
  beast: {
    viewBox: '0 0 24 24',
    // Dragon / Monster Horned Skull
    path: 'M12 2C7 2 3 5 3 10c0 4 2.5 7.5 6 9l-1 3h8l-1-3c3.5-1.5 6-5 6-9 0-5-4-8-9-8zm-3 8a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm6 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3z'
  },
  water: {
    viewBox: '0 0 24 24',
    // Ship / Galleon Vessel
    path: 'M12 2L4 12h7V3l6 9h-4l3 4H2l2 4h16l2-4H12z'
  },
  industrial: {
    viewBox: '0 0 24 24',
    // Mining Shaft & Anvil Forge
    path: 'M20 12h-3V7h2V3H5v4h2v5H4a2 2 0 00-2 2v6h20v-6a2 2 0 00-2-2zM9 7h6v5H9V7zm-3 7h12v4H6v-4z'
  },
  submap: {
    viewBox: '0 0 24 24',
    path: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5'
  },
  custom: {
    viewBox: '0 0 24 24',
    path: 'M12 2l3.1 8.5H24l-7.2 5.3 2.7 8.7L12 19.1l-7.5 5.4 2.7-8.7L0 10.5h8.9z'
  }
};

export const PIN_TYPE_OPTIONS = [
  { id: 'city', label: 'Capital City / Keep' },
  { id: 'fortress', label: 'Fortress / Stronghold' },
  { id: 'settlement', label: 'Village / Settlement' },
  { id: 'tower', label: 'Spire / Watchtower' },
  { id: 'mountain', label: 'Mountain / Peak' },
  { id: 'forest', label: 'Forest / Grove' },
  { id: 'cave', label: 'Cave / Dungeon' },
  { id: 'poi', label: 'Point of Interest' },
  { id: 'harbor', label: 'Harbor / Salt Wharf' },
  { id: 'ruin', label: 'Ancient Ruin' },
  { id: 'tomb', label: 'Barrow / Crypt' },
  { id: 'camp', label: 'Encampment / Outpost' },
  { id: 'shrine', label: 'Runic Altar / Shrine' },
  { id: 'magic', label: 'Magical Anomaly' },
  { id: 'beast', label: 'Monster / Beast Lair' },
  { id: 'water', label: 'Shipwreck / Water POI' },
  { id: 'industrial', label: 'Forge / Mining Station' },
  { id: 'custom', label: 'Custom Star Marker' }
];

export default PIN_ICONS;
