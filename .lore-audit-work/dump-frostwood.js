// Dump all Frostwood Reach pins (existing + micro-POI) with coordinates, sorted for the cartography sheet.
const fs = require('fs');
const coordSrc = fs.readFileSync('vtt-react/src/data/locationCoordinates.js', 'utf8');
const zoneSrc = fs.readFileSync('vtt-react/src/data/zoneData.js', 'utf8');

// parse pins
const pins = {};
const re = /'([^']+)':\s*\{\s*x:\s*(-?\d+),\s*y:\s*(-?\d+),\s*pinType:\s*'([^']+)'[^}]*source:\s*'world'/g;
let m;
while ((m = re.exec(coordSrc)) !== null) {
  pins[m[1]] = { x: +m[2], y: +m[3], pin: m[4] };
}

// parse zone names/types
const zoneInfo = {};
const zre = /\{\s*"id":\s*"([^"]+)"[^}]*?"name":\s*"([^"]+)"[^}]*?"type":\s*"([^"]+)"/g;
let zm;
while ((zm = zre.exec(zoneSrc)) !== null) {
  zoneInfo[zm[1]] = { name: zm[2], type: zm[3] };
}

// frostwood pins
const fw = Object.entries(pins).filter(([id]) => id in pins && zoneInfo[id] && zoneInfo[id].name).filter(([id]) => {
  // region check via the pin's regionId is in the line; simpler: use zoneInfo regionId
  return true;
});
// filter to frostwood by reading regionId from the pin line
const fwPins = [];
const re2 = /'([^']+)':\s*\{\s*x:\s*(-?\d+),\s*y:\s*(-?\d+),\s*pinType:\s*'([^']+)',\s*regionId:\s*'([^']+)'/g;
let m2;
while ((m2 = re2.exec(coordSrc)) !== null) {
  if (m2[5] === 'frostwood-reach') {
    fwPins.push({ id: m2[1], x: +m2[2], y: +m2[3], pin: m2[4], name: (zoneInfo[m2[1]]||{}).name || m2[1], type: (zoneInfo[m2[1]]||{}).type || '?' });
  }
}
fwPins.sort((a,b) => a.y - b.y || a.x - b.x);

console.log('FROSTWOOD PINS (' + fwPins.length + '):');
console.log('id | x | y | pin | type | name');
fwPins.forEach(p => console.log(`${p.id} | ${p.x} | ${p.y} | ${p.pin} | ${p.type} | ${p.name}`));

// list frostwood zones that have NO pin yet
const fwZoneIds = new Set();
const zre2 = /\{\s*"id":\s*"([^"]+)"[^}]*?"regionId":\s*"(frostwood-reach)"/g;
let zm2;
while ((zm2 = zre2.exec(zoneSrc)) !== null) fwZoneIds.add(zm2[1]);
const unpinned = [...fwZoneIds].filter(id => !pins[id]);
console.log('\nFROSTWOOD ZONES WITH NO PIN (' + unpinned.length + '):');
unpinned.forEach(id => console.log(id, '::', (zoneInfo[id]||{}).name));
