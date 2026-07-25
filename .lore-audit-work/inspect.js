const fs = require('fs');
const { execSync } = require('child_process');

// 1. JS validity of zoneData.js
try { execSync('node --check vtt-react/src/data/zoneData.js', { stdio: 'pipe' }); console.log('zoneData.js: VALID JS'); }
catch (e) { console.log('zoneData.js: INVALID ->', (e.stderr || e.message).toString().slice(0, 200)); }

// 2. locationCoordinates.js line endings + anchor inspection
const s = fs.readFileSync('vtt-react/src/data/locationCoordinates.js', 'utf8');
console.log('has CRLF:', s.includes('\r\n'));
const idx = s.indexOf('Pristine snapshot');
console.log('Pristine idx:', idx);
const closeIdx = s.indexOf('};');
console.log('first }; idx:', closeIdx);
console.log('bytes around first };:', JSON.stringify(s.slice(Math.max(0, closeIdx - 6), closeIdx + 26)));

// 3. count micro-poi entries currently in zoneData.js
const z = fs.readFileSync('vtt-react/src/data/zoneData.js', 'utf8');
const microIdx = z.indexOf('MICRO-POI TEXTURE');
console.log('zoneData has MICRO-POI block:', microIdx >= 0);
const start = z.indexOf('[\n'); // not reliable; instead count entries between marker and the closing ]; before getZonesByRegion
const after = microIdx >= 0 ? z.slice(microIdx) : '';
console.log('rough micro id count in zoneData:', (after.match(/"id":/g) || []).length);
