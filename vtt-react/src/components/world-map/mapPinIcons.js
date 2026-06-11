const PIN_ICONS = {
  fortress: {
    viewBox: '0 0 24 24',
    path: 'M4 22V12l4-3v2h2V8l2-1 2 1v3h2V9l4 3v10h-5v-4H9v4H4zM10 22v-3M14 22v-3'
  },
  house: {
    viewBox: '0 0 24 24',
    path: 'M4 21V12l8-8 8 8v9h-6v-6h-4v6H4zM8 21v-6M16 21v-6'
  },
  mountain: {
    viewBox: '0 0 24 24',
    path: 'M1 21l8-16 3 6 5-10 6 20H1zM6 14h12'
  },
  tree: {
    viewBox: '0 0 24 24',
    path: 'M12 2a5 5 0 00-5 6c0 2 1 3 2 4H7c-2 0-4 2-4 4h18c0-2-2-4-4-4h-2c1-1 2-2 2-4a5 5 0 00-5-6zM12 23V18'
  },
  cave: {
    viewBox: '0 0 24 24',
    path: 'M3 21h18M3 21C5 12 8 8 12 8s7 4 9 13M6 17c2-3 5-6 6-6s4 3 6 6'
  },
  door: {
    viewBox: '0 0 24 24',
    path: 'M5 22V6l7-4 7 4v16h-5v-7h-4v7H5zM14 14a1.5 1.5 0 100-3'
  },
  port: {
    viewBox: '0 0 24 24',
    path: 'M12 2v16M7 8l5-4 5 4M7 12l5 4 5-4M4 22h16a1 1 0 001-1'
  },
  ruin: {
    viewBox: '0 0 24 24',
    path: 'M7 22V7l5-4 5 4v6M7 7h10M12 3v5M14 22v-8M10 18v4'
  },
  tomb: {
    viewBox: '0 0 24 24',
    path: 'M12 3a4 4 0 00-4 4c0 4 4 6 4 9 0 0 4-5 4-9a4 4 0 00-4-4zM10 9h4M11 12h2'
  },
  camp: {
    viewBox: '0 0 24 24',
    path: 'M12 3L2 22h20L12 3zM12 3v19M9 15h6'
  },
  shrine: {
    viewBox: '0 0 24 24',
    path: 'M5 22h14M7 22v-8H5l2-2 2 2 3-3 3 3 2-2 2 2v8M12 12v2M9 17h6'
  },
  tower: {
    viewBox: '0 0 24 24',
    path: 'M19 22H5V11l2-2V4.5A1.5 1.5 0 018.5 3h7a1.5 1.5 0 011.5 1.5V9l2 2v11zM9 9h6m-7 5h8m-7 4h6m-5-14v3m4-3v3'
  },
  magic: {
    viewBox: '0 0 24 24',
    path: 'M12 2l3 7 7 3-7 3-3 7-3-7-7-3 7-3 3-7zm0 6.5l-1.5 3.5 1.5 1.5 1.5-1.5-1.5-3.5z'
  },
  beast: {
    viewBox: '0 0 24 24',
    path: 'M12 2a6 6 0 00-6 6v4a6 6 0 002 4.5V20a2 2 0 002 2h8a2 2 0 002-2v-3.5a6 6 0 002-4.5V8a6 6 0 00-6-6zm-3 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm6 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm-5 6h4v1.5h-4V14z'
  },
  water: {
    viewBox: '0 0 24 24',
    path: 'M12 2a3 3 0 00-3 3v8H5v-2H3v6h2v-2h4v3a3 3 0 006 0v-3h4v2h2v-6h-2v2h-4V5a3 3 0 00-3-3z'
  },
  custom: {
    viewBox: '0 0 24 24',
    path: 'M12 2l2 9 9 2-9 2-2 9-2-9L1 13l9-2z'
  }
};

export const PIN_TYPE_OPTIONS = [
  { id: 'fortress', label: 'Fortress / City' },
  { id: 'house', label: 'Settlement' },
  { id: 'tower', label: 'Tower' },
  { id: 'mountain', label: 'Mountain' },
  { id: 'tree', label: 'Forest / Grove' },
  { id: 'cave', label: 'Cave / Dungeon' },
  { id: 'door', label: 'Point of Interest' },
  { id: 'port', label: 'Harbor / Port' },
  { id: 'ruin', label: 'Ruin' },
  { id: 'tomb', label: 'Tomb' },
  { id: 'camp', label: 'Camp' },
  { id: 'shrine', label: 'Shrine' },
  { id: 'magic', label: 'Magical Anomaly' },
  { id: 'beast', label: 'Monster / Beast Lair' },
  { id: 'water', label: 'Shipwreck / Water POI' },
  { id: 'custom', label: 'Custom Marker' }
];

export default PIN_ICONS;
