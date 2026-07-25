/**
 * REPAIR PLACEMENT — for every continent EXCEPT Frostwood (already hand-placed):
 *  - detect pins that collide (share identical coords, e.g. centroid-fallback piles)
 *  - detect zones that have no pin at all
 *  - re-spread both onto a grid within each region's existing-pin bounding box
 * Keeps healthy/unique pins in place. Idempotent. Collapses any double-commas.
 */
const fs = require('fs');
const COORD_FILE = 'vtt-react/src/data/locationCoordinates.js';
const ZONE_FILE  = 'vtt-react/src/data/zoneData.js';
let csrc = fs.readFileSync(COORD_FILE, 'utf8');
const LE = csrc.includes('\r\n') ? '\r\n' : '\n';

// ---- parse pins ----
const pins = {};
const reP = /'([^']+)':\s*\{\s*x:\s*(-?\d+),\s*y:\s*(-?\d+),\s*pinType:\s*'([^']+)',\s*regionId:\s*'([^']+)'/g;
let m;
while ((m = reP.exec(csrc))) pins[m[1]] = { x: +m[2], y: +m[3], pin: m[4], region: m[5] };

// ---- parse zones ----
const zones = {};
const zsrc = fs.readFileSync(ZONE_FILE, 'utf8');
const reZ = /"id":\s*"([^"]+)"[^}]*?"regionId":\s*"([^"]+)"[^}]*?"name":\s*"([^"]+)"[^}]*?"type":\s*"([^"]+)"/g;
let mz;
while ((mz = reZ.exec(zsrc))) zones[mz[1]] = { region: mz[2], name: mz[3], type: mz[4] };

const WILD_PIN = { 'frostwood-reach':'tree','nordhalla':'mountain','sundale':'cave','iceheart-sea':'port','cragjaw-peaks':'mountain','sundrift-vale':'custom','bryngloom-forest':'tree' };
const pinFor = (type, region) => ({ settlement:'house', town:'house', ruin:'ruin', tomb:'tomb', fortification:'fortress', wilderness: WILD_PIN[region], city:'city', waterway:'port' }[type] || 'custom');

// ---- group pins by region ----
const byRegion = {};
Object.entries(pins).forEach(([id, p]) => { (byRegion[p.region] = byRegion[p.region] || []).push({ id, ...p }); });

const updates = {};   // id -> {x,y}  (move existing)
const additions = {}; // id -> {x,y,pin,region}  (new)

const stats = {};
for (const region of Object.keys(byRegion)) {
  if (region === 'frostwood-reach') continue; // hand-placed; protect
  const regPins = byRegion[region];
  const xs = regPins.map(p => p.x), ys = regPins.map(p => p.y);
  let minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
  const padX = (maxX - minX) * 0.14 + 25, padY = (maxY - minY) * 0.14 + 25;
  minX = Math.max(10, minX - padX); maxX = Math.min(4086, maxX + padX);
  minY = Math.max(10, minY - padY); maxY = Math.min(3048, maxY + padY);

  // collisions: keep first at a coord, flag the rest
  const coordCount = {};
  regPins.forEach(p => { const k = p.x + ',' + p.y; coordCount[k] = (coordCount[k] || 0) + 1; });
  const collided = new Set(); const seen = {};
  regPins.forEach(p => { const k = p.x + ',' + p.y; if (coordCount[k] > 1) { if (seen[k]) collided.add(p.id); else seen[k] = true; } });

  const missing = Object.keys(zones).filter(id => zones[id].region === region && !pins[id]);
  const problems = [...collided].concat(missing);
  stats[region] = { collided: collided.size, missing: missing.length };
  if (!problems.length) continue;

  const occupied = new Set(regPins.filter(p => !collided.has(p.id)).map(p => p.x + ',' + p.y));
  const n = problems.length;
  const cols = Math.max(1, Math.ceil(Math.sqrt(n * (maxX - minX) / Math.max(1, maxY - minY))));
  const rows = Math.ceil(n / cols);
  const cellW = (maxX - minX) / cols, cellH = (maxY - minY) / rows;
  for (let i = 0; i < n; i++) {
    const r = Math.floor(i / cols), c = i % cols;
    let x = Math.round(minX + cellW * (c + 0.5));
    let y = Math.round(minY + cellH * (r + 0.5));
    let tries = 0;
    while (occupied.has(x + ',' + y) && tries < 50) { x += 16; if (x > maxX) { x = minX + 12; y += 16; } tries++; }
    occupied.add(x + ',' + y);
    const id = problems[i];
    if (missing.includes(id)) additions[id] = { x, y, pin: pinFor(zones[id].type, region), region };
    else updates[id] = { x, y };
  }
}

// ---- apply moves ----
let moveCount = 0;
for (const [id, { x, y }] of Object.entries(updates)) {
  const re = new RegExp(`('${id.replace(/'/g, "\\'")}': \\{ x: )-?\\d+(, y: )-?\\d+(,)`);
  if (re.test(csrc)) { csrc = csrc.replace(re, `$1${x}$2${y}$3`); moveCount++; }
  else console.log('  move target not found:', id);
}

// ---- apply additions (idempotent ◆ REPAIR PLACEMENT block) ----
let addCount = 0;
const addIds = Object.keys(additions);
if (addIds.length) {
  csrc = csrc.replace(/,?\s*\/\/ [^\n\r]*◆ REPAIR PLACEMENT[^\n\r]*[\s\S]*?(?=\r?\n};\r?\n\r?\n\/\/ Pristine snapshot)/, '');
  const lines = addIds.map(id => { const a = additions[id]; return `  '${id}': { x: ${a.x}, y: ${a.y}, pinType: '${a.pin}', regionId: '${a.region}', source: 'world' },`; });
  const block = ',' + LE + '  // ───────────── ◆ REPAIR PLACEMENT (auto-spread missing + collided pins) ─────────────' + LE + lines.join(LE) + LE;
  const anchor = LE + '};' + LE + LE + '// Pristine snapshot';
  if (!csrc.includes(anchor)) { console.error('anchor missing'); process.exit(1); }
  csrc = csrc.replace(anchor, block + anchor);
  addCount = addIds.length;
}

// ---- safety: collapse any double-commas introduced ----
csrc = csrc.replace(/,(?:\r?\n\s*,)+/g, ',');

fs.writeFileSync(COORD_FILE, csrc);
console.log('Moved (de-collided):', moveCount);
console.log('Added (was missing):', addCount);
console.log('Per-region problems found:', JSON.stringify(stats));
