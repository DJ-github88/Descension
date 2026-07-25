const fs = require('fs');
const csrc = fs.readFileSync('vtt-react/src/data/locationCoordinates.js', 'utf8');
const zsrc = fs.readFileSync('vtt-react/src/data/zoneData.js', 'utf8');

const pins = {};
const reP = /'([^']+)':\s*\{\s*x:\s*(-?\d+),\s*y:\s*(-?\d+)[^}]*regionId:\s*'([^']+)'/g;
let m;
while ((m = reP.exec(csrc))) pins[m[1]] = { x: +m[2], y: +m[3], region: m[4] };

const zones = {};
const reZ = /"id":\s*"([^"]+)"[^}]*?"regionId":\s*"([^"]+)"/g;
let mz;
while ((mz = reZ.exec(zsrc))) zones[mz[1]] = mz[2];

const zoneIds = Object.keys(zones);
const pinIds = Object.keys(pins);
const unpinned = zoneIds.filter(id => !pins[id]);
const pinless = pinIds.filter(id => !zones[id]);

// collisions
const coordMap = {};
pinIds.forEach(id => { const k = pins[id].x + ',' + pins[id].y; (coordMap[k] = coordMap[k] || []).push(id); });
const collisions = Object.entries(coordMap).filter(([k, v]) => v.length > 1);

const byRegion = {};
zoneIds.forEach(id => { const r = zones[id]; byRegion[r] = byRegion[r] || { zones: 0, pinned: 0 }; byRegion[r].zones++; if (pins[id]) byRegion[r].pinned++; });

console.log('=== FINAL WORLD MAP PIN COVERAGE ===');
console.log('Total zones           :', zoneIds.length);
console.log('Total pins            :', pinIds.length);
console.log('Unpinned zones        :', unpinned.length, unpinned.slice(0, 10));
console.log('Pins without zone     :', pinless.length, pinless.slice(0, 10));
console.log('Coordinate collisions :', collisions.length);
console.log('');
console.log('Per-region coverage (pinned/zones):');
Object.entries(byRegion).sort().forEach(([r, c]) => console.log(`  ${r.padEnd(20)} ${c.pinned}/${c.zones}`));
