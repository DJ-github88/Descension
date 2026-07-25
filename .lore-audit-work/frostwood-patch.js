/**
 * Frostwood cartography patch:
 *  1. Adds pins for the 8 major zones that lacked coordinates.
 *  2. Re-positions the Frostfang micro-POIs that piled onto the region centroid
 *     (their parents had no coords) into a proper geographic spread across the
 *     northern Frostfang Wastes.
 * Idempotent: re-running detects existing entries and skips them.
 */
const fs = require('fs');
const COORD_FILE = 'vtt-react/src/data/locationCoordinates.js';
let src = fs.readFileSync(COORD_FILE, 'utf8');
const LE = src.includes('\r\n') ? '\r\n' : '\n';

// 1. Major zones to ADD (id -> [x, y, pinType])
const ADD = {
  'frostfang-wastes':  [2700, 120, 'mountain'],
  'grevtholm':         [2500,  80, 'house'],
  'iron-lake':         [2950,  90, 'custom'],
  'the-stone-circles': [2600, 200, 'ruin'],
  'bearsback-summit':  [2800,  50, 'mountain'],
  'meadowglen-crossing':[3150, 680, 'house'],
  'velling-pass':      [3000, 760, 'mountain'],
  'thornwood-grove':   [3300, 460, 'tree'],
};
// 2. Frostfang micro-POIs to REPOSITION (id -> [x, y])
const MOVE = {
  'frostwatch-ruin':      [2560, 130],
  'stonespeakers-camp':   [2680, 230],
  'eight-week-melt-huts': [2900, 130],
  'mammoth-bone-camp':    [2760, 170],
  'cold-iron-waystation': [2470, 160],
  'wind-teeth':           [2640,  80],
  'jutulstone':           [2740, 220],
  'eight-week-melt-ponds':[3000, 140],
};

let moves = 0;
for (const [id, [x, y]] of Object.entries(MOVE)) {
  const re = new RegExp(`('${id}': \\{ x: )-?\\d+(, y: )-?\\d+(,)`);
  if (re.test(src)) { src = src.replace(re, `$1${x}$2${y}$3`); moves++; }
  else console.log('  (move) not found:', id);
}

const toAdd = Object.entries(ADD).filter(([id]) => !src.includes(`'${id}':`));
let addedBlock = '';
if (toAdd.length) {
  const lines = toAdd.map(([id,[x,y,pin]]) => `  '${id}': { x: ${x}, y: ${y}, pinType: '${pin}', regionId: 'frostwood-reach', source: 'world' },`);
  addedBlock = ',' + LE + '  // ───────────── ◆ FROSTWOOD MISSING MAJOR ZONES (cartography patch) ─────────────' + LE + lines.join(LE) + LE;
  const anchor = LE + '};' + LE + LE + '// Pristine snapshot';
  if (!src.includes(anchor)) { console.error('anchor not found after moves'); process.exit(1); }
  // also strip any prior patch block for idempotency
  src = src.replace(new RegExp(',?\\s*// [^\\n\\r]*◆ FROSTWOOD MISSING MAJOR ZONES[\\s\\S]*?(?=\\r?\\n};\\r?\\n\\r?\\n// Pristine snapshot)'), '');
  src = src.replace(anchor, addedBlock + anchor);
}

fs.writeFileSync(COORD_FILE, src);
console.log('Repositioned micro-POIs :', moves);
console.log('Added major-zone pins   :', toAdd.length, '(' + toAdd.map(([id])=>id).join(', ') + ')');
