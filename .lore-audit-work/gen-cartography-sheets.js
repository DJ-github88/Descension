/**
 * Generates CONTINENT_CARTOGRAPHY_SHEETS.md — per-continent pin coordinate
 * tables grouped by subregion, for the 6 non-Frostwood continents.
 * (Frostwood has its own hand-crafted sheet in the chat / master reference.)
 */
const fs = require('fs');
const COORD_FILE = 'vtt-react/src/data/locationCoordinates.js';
const ZONE_FILE  = 'vtt-react/src/data/zoneData.js';
const SUB_FILE   = 'vtt-react/src/data/subregions.js';

const csrc = fs.readFileSync(COORD_FILE, 'utf8');
const zsrc = fs.readFileSync(ZONE_FILE, 'utf8');
const ssrc = fs.readFileSync(SUB_FILE, 'utf8');

// pins
const pins = {};
let m; const reP = /'([^']+)':\s*\{\s*x:\s*(-?\d+),\s*y:\s*(-?\d+),\s*pinType:\s*'([^']+)',\s*regionId:\s*'([^']+)'/g;
while ((m = reP.exec(csrc))) pins[m[1]] = { x: +m[2], y: +m[3], pin: m[4], region: m[5] };

// zones (name + type)
const zones = {};
const reZ = /"id":\s*"([^"]+)"[^}]*?"name":\s*"([^"]+)"[^}]*?"type":\s*"([^"]+)"/g;
let mz;
while ((mz = reZ.exec(zsrc))) zones[mz[1]] = { name: mz[2], type: mz[3] };

// subregions
const subs = [];
const reS = /'([^']+)':\s*\{[\s\S]*?name:\s*'([^']{2,80})'[\s\S]*?regionId:\s*'([^']+)'[\s\S]*?zoneIds:\s*\[([^\]]*)\]/g;
let ms;
while ((ms = reS.exec(ssrc))) {
  const zoneIds = ms[4].split(',').map(s => s.replace(/['\s]/g, '')).filter(Boolean);
  subs.push({ id: ms[1], name: ms[2], region: ms[3], zoneIds });
}

const REGION_ORDER = ['nordhalla','sundale','iceheart-sea','cragjaw-peaks','sundrift-vale','bryngloom-forest'];
const REGION_TITLE = {
  'nordhalla':'2 · NORDHALLA', 'sundale':'3 · SUNDALE', 'iceheart-sea':'4 · ICEHEART SEA',
  'cragjaw-peaks':'5 · CRAGJAW PEAKS', 'sundrift-vale':'6 · SUNDRIFT VALE', 'bryngloom-forest':'7 · BRYNGLOOM FOREST',
};
const ICON = (pin) => ({
  city:'🏰', town:'🏰', house:'🏠', settlement:'🏠', ruin:'🏚', tomb:'⚰', fortification:'🛡', fortress:'🛡',
  tree:'🌲', mountain:'🏔', cave:'🕳', custom:'⭐', port:'⚓'
}[pin] || '📍');

let out = [];
out.push('# CONTINENT CARTOGRAPHY SHEETS');
out.push('### Pixel-coordinate reference for the world map (4096×3072) — companion to SEVEN_CONTINENTS_MASTER_REFERENCE.md');
out.push('');
out.push('> Frostwood Reach (Continent 1) has its own hand-crafted sheet — see the master reference. Below are the other six, grouped by subregion. Coordinates are auto-spread within each continent; drag in the DevEditor to refine.');
out.push('');

for (const region of REGION_ORDER) {
  out.push('---');
  out.push('');
  out.push(`# ${REGION_TITLE[region]}`);
  out.push('');
  const regionSubs = subs.filter(s => s.region === region);
  const regionPinIds = Object.keys(pins).filter(id => pins[id].region === region);
  const assigned = new Set();
  for (const s of regionSubs) {
    out.push(`### ▌ ${s.name} *(subregion)*`);
    out.push('');
    out.push('| Pin | x | y | Type | Name |');
    out.push('|---|---|---|---|---|');
    const rows = s.zoneIds.filter(id => pins[id]).map(id => {
      assigned.add(id);
      const p = pins[id], z = zones[id] || { name: id, type: '?' };
      return `${ICON(p.pin)} | ${p.x} | ${p.y} | ${z.type} | ${z.name}`;
    });
    if (rows.length) rows.forEach(r => out.push('| ' + r + ' |'));
    else out.push('| — | — | — | — | *(no pinned zones in subregion list)* |');
    out.push('');
  }
  // minor POIs not in any subregion zoneIds list
  const leftover = regionPinIds.filter(id => !assigned.has(id));
  if (leftover.length) {
    out.push(`### ▌ Additional minor POIs in ${REGION_TITLE[region].split('· ')[1]} *(not in a subregion zoneIds list)*`);
    out.push('');
    out.push('| Pin | x | y | Type | Name |');
    out.push('|---|---|---|---|---|');
    leftover.sort((a,b) => pins[a].y - pins[b].y || pins[a].x - pins[b].x)
      .forEach(id => {
        const p = pins[id], z = zones[id] || { name: id, type: '?' };
        out.push(`| ${ICON(p.pin)} | ${p.x} | ${p.y} | ${z.type} | ${z.name} |`);
      });
    out.push('');
  }
}

fs.writeFileSync('CONTINENT_CARTOGRAPHY_SHEETS.md', out.join('\n'));
console.log('Wrote CONTINENT_CARTOGRAPHY_SHEETS.md');
console.log('Subregions parsed:', subs.length, '| pins:', Object.keys(pins).length);
