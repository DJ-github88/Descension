const fs = require('fs');
const COORD_FILE = 'vtt-react/src/data/locationCoordinates.js';
const ZONE_FILE  = 'vtt-react/src/data/zoneData.js';
let csrc = fs.readFileSync(COORD_FILE, 'utf8');
const LE = csrc.includes('\r\n') ? '\r\n' : '\n';

// zones that exist
const zones = new Set();
const zsrc = fs.readFileSync(ZONE_FILE, 'utf8');
let mz; const reZ = /"id":\s*"([^"]+)"/g;
while ((mz = reZ.exec(zsrc))) zones.add(mz[1]);

// parse pins (lenient) -> id list
const pinIds = [];
let m; const reP = /'([^']+)':\s*\{\s*x:\s*-?\d+[^}]*regionId:\s*'([^']+)'/g;
while ((m = reP.exec(csrc))) pinIds.push(m[1]);
const orphans = pinIds.filter(id => !zones.has(id));

// 1. line-based removal of orphan pins
const orphanSet = new Set(orphans);
const lines = csrc.split(/\r?\n/);
const before = lines.length;
const filtered = lines.filter(line => {
  const mm = line.match(/^\s*'([^']+)'\s*:\s*\{/);
  return !(mm && orphanSet.has(mm[1]));
});
csrc = filtered.join(LE);
const removed = before - filtered.length;

// 2. re-parse remaining, nudge collisions
const remaining = {};
const reP2 = /'([^']+)':\s*\{\s*x:\s*(-?\d+),\s*y:\s*(-?\d+)[^}]*regionId:\s*'([^']+)'/g;
let m2;
while ((m2 = reP2.exec(csrc))) remaining[m2[1]] = { x: +m2[2], y: +m2[3] };
const coordMap = {};
Object.keys(remaining).forEach(id => { const k = remaining[id].x + ',' + remaining[id].y; (coordMap[k] = coordMap[k] || []).push(id); });
const occupied = new Set(Object.keys(remaining).map(id => remaining[id].x + ',' + remaining[id].y));
let nudged = 0;
for (const [coord, ids] of Object.entries(coordMap)) {
  if (ids.length < 2) continue;
  for (let i = 1; i < ids.length; i++) {
    const id = ids[i]; let { x, y } = remaining[id];
    let nx = x + 14, ny = y, tries = 0;
    while (occupied.has(nx + ',' + ny) && tries < 80) { nx += 11; if (nx > 4090) { nx = x - 12; ny += 12; } tries++; }
    occupied.add(nx + ',' + ny);
    const re = new RegExp(`('${id}': \\{ x: )-?\\d+(, y: )-?\\d+(,)`);
    if (re.test(csrc)) { csrc = csrc.replace(re, `$1${nx}$2${ny}$3`); nudged++; }
  }
}
csrc = csrc.replace(/,(?:\r?\n\s*,)+/g, ',');
fs.writeFileSync(COORD_FILE, csrc);
console.log('Orphan pins removed :', removed, orphans);
console.log('Collisions nudged   :', nudged);
