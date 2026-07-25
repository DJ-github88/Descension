import { ZONE_DATA } from '../vtt-react/src/data/zoneData.js';
import LOC, { BASELINE_LOCATION_COORDINATES } from '../vtt-react/src/data/locationCoordinates.js';

const microZones = ZONE_DATA.filter(z => z.connections && z.connections.length === 1 && z.factions && z.factions.length === 0 && z.dangerLevel !== 'extreme' && z.wyrdCreatures.length === 0 && /-/.test(z.id) && (z.type==='settlement'||z.type==='wilderness'||z.type==='ruin'||z.type==='fortification'));
console.log('ZONE_DATA total        :', ZONE_DATA.length);
console.log('coord pins (LOCATION)  :', Object.keys(LOC).length);
console.log('coord pins (BASELINE)  :', Object.keys(BASELINE_LOCATION_COORDINATES).length);

// cross-check: every zone has a pin? every pin has a zone?
const zoneIds = new Set(ZONE_DATA.map(z => z.id));
const pinIds = new Set(Object.keys(LOC));
const zonesWithoutPins = [...zoneIds].filter(id => !pinIds.has(id));
const pinsWithoutZones = [...pinIds].filter(id => !zoneIds.has(id));
console.log('zones w/o pins         :', zonesWithoutPins.length, zonesWithoutPins.slice(0,8));
console.log('pins w/o zones         :', pinsWithoutZones.length, pinsWithoutZones.slice(0,8));

// region coverage sanity
const byRegion = {};
ZONE_DATA.forEach(z => byRegion[z.regionId] = (byRegion[z.regionId]||0)+1);
console.log('zones per region       :', JSON.stringify(byRegion));
console.log('\nVALIDATION: both ES modules imported without syntax errors.');
