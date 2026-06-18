/**
 * World Map Location Coordinates
 *
 * Pixel coordinates for all 86 canonical zones on the 4096x3072 world map.
 * Each pin is keyed by its zone id (matches ZONE_DATA) and carries:
 *   { x, y, pinType, regionId, source }
 * source:'world' marks canonical pins (vs 'campaignLocation'/'campaignLore'/'custom').
 *
 * Macro region layout is anchored by the centroids in regionPolygons.js:
 *   Nordhalla (top-left), Frostwood Reach (top-right), Sundale (upper-center),
 *   Iceheart Sea (center-left), Cragjaw Peaks (right), Sundrift Vale (bottom-right),
 *   Bryngloom Forest (bottom-left).
 *
 * Within each region, pins follow the zoneData.js connection chains and the
 * geographic clues in each zone's description (border zones on region edges,
 * ports toward the sea, capitals near centroids). GMs can drag pins in the
 * DevEditor to refine; localStorage overrides take precedence at render time.
 */

export const LOCATION_COORDINATES = {
  // =========================================================================
  // FROSTWOOD REACH (centroid 3400,300)
  // =========================================================================
  'greymark-keep':       { x: 3400, y: 320,  pinType: 'city',        regionId: 'frostwood-reach', source: 'world' },
  'the-shallows':        { x: 3150, y: 380,  pinType: 'wilderness',  regionId: 'frostwood-reach', source: 'world' },
  'ironwood-heart':      { x: 2900, y: 300,  pinType: 'wilderness',  regionId: 'frostwood-reach', source: 'world' },
  'ledger-halls':        { x: 3000, y: 180,  pinType: 'ruin',        regionId: 'frostwood-reach', source: 'world' },
  'scribes-tower':       { x: 3250, y: 180,  pinType: 'settlement',  regionId: 'frostwood-reach', source: 'world' },
  'wraithfen':           { x: 3050, y: 540,  pinType: 'wilderness',  regionId: 'frostwood-reach', source: 'world' },
  'mistbarrow':          { x: 3300, y: 600,  pinType: 'ruin',        regionId: 'frostwood-reach', source: 'world' },
  'greythorn-copse':     { x: 3600, y: 540,  pinType: 'settlement',  regionId: 'frostwood-reach', source: 'world' },
  'bramble-heath':       { x: 3800, y: 420,  pinType: 'wilderness',  regionId: 'frostwood-reach', source: 'world' },
  'skalds-landing':      { x: 3750, y: 240,  pinType: 'settlement',  regionId: 'frostwood-reach', source: 'world' },
  'the-shifting-fen':    { x: 3650, y: 300,  pinType: 'wilderness',  regionId: 'frostwood-reach', source: 'world' },
  'mirror-mere':         { x: 3500, y: 200,  pinType: 'settlement',  regionId: 'frostwood-reach', source: 'world' },

  // =========================================================================
  // NORDHALLA (centroid 600,250)
  // =========================================================================
  'frozen-archive':      { x: 480,  y: 280,  pinType: 'tomb',        regionId: 'nordhalla', source: 'world' },
  'bloodhammer-sump':    { x: 820,  y: 300,  pinType: 'settlement',  regionId: 'nordhalla', source: 'world' },
  'fjord-gate':          { x: 650,  y: 420,  pinType: 'settlement',  regionId: 'nordhalla', source: 'world' },
  'hunger-glaciers':     { x: 980,  y: 180,  pinType: 'wilderness',  regionId: 'nordhalla', source: 'world' },
  'rimors-hearth':       { x: 380,  y: 420,  pinType: 'ruin',        regionId: 'nordhalla', source: 'world' },
  'ymirs-col':           { x: 1120, y: 200,  pinType: 'wilderness',  regionId: 'nordhalla', source: 'world' },
  'vargtor':             { x: 1050, y: 320,  pinType: 'settlement',  regionId: 'nordhalla', source: 'world' },
  'frostcirque':         { x: 880,  y: 480,  pinType: 'ruin',        regionId: 'nordhalla', source: 'world' },
  'the-still-crag':      { x: 620,  y: 560,  pinType: 'wilderness',  regionId: 'nordhalla', source: 'world' },
  'rooks-promontory':    { x: 380,  y: 560,  pinType: 'wilderness',  regionId: 'nordhalla', source: 'world' },
  'the-black-firth':     { x: 1120, y: 440,  pinType: 'wilderness',  regionId: 'nordhalla', source: 'world' },
  'vesperas-perch':      { x: 1080, y: 560,  pinType: 'settlement',  regionId: 'nordhalla', source: 'world' },

  // =========================================================================
  // SUNDALE (centroid 1800,1150)
  // =========================================================================
  'harath-vault':         { x: 1850, y: 1150, pinType: 'city',       regionId: 'sundale', source: 'world' },
  'great-forge':          { x: 1500, y: 1050, pinType: 'city',       regionId: 'sundale', source: 'world' },
  'emberspire-caldera':   { x: 2200, y: 1050, pinType: 'wilderness', regionId: 'sundale', source: 'world' },
  'basalt-shyr':          { x: 1300, y: 1400, pinType: 'settlement', regionId: 'sundale', source: 'world' },
  'cinder-badlands':      { x: 2400, y: 1300, pinType: 'wilderness', regionId: 'sundale', source: 'world' },
  'sols-anvil-mesa':      { x: 2550, y: 1000, pinType: 'wilderness', regionId: 'sundale', source: 'world' },
  'the-ashen-escarpment': { x: 2500, y: 1550, pinType: 'wilderness', regionId: 'sundale', source: 'world' },
  'vulkars-karst':        { x: 1650, y: 1500, pinType: 'wilderness', regionId: 'sundale', source: 'world' },
  'cinderhoodoo':         { x: 1950, y: 1550, pinType: 'wilderness', regionId: 'sundale', source: 'world' },
  'slag-gulch':           { x: 1150, y: 1250, pinType: 'settlement', regionId: 'sundale', source: 'world' },
  'the-cinder-strait':    { x: 2250, y: 870,  pinType: 'wilderness', regionId: 'sundale', source: 'world' },
  'ember-lagoon':         { x: 1400, y: 1600, pinType: 'settlement', regionId: 'sundale', source: 'world' },

  // =========================================================================
  // ICEHEART SEA (centroid 800,1500)
  // =========================================================================
  'merrowport':            { x: 800,  y: 1500, pinType: 'city',       regionId: 'iceheart-sea', source: 'world' },
  'ironjaw-port':          { x: 550,  y: 1250, pinType: 'settlement', regionId: 'iceheart-sea', source: 'world' },
  'treakous-rift':         { x: 300,  y: 1100, pinType: 'wilderness', regionId: 'iceheart-sea', source: 'world' },
  'first-shore':           { x: 350,  y: 1750, pinType: 'ruin',       regionId: 'iceheart-sea', source: 'world' },
  'gale-storm-shallows':   { x: 650,  y: 1900, pinType: 'wilderness', regionId: 'iceheart-sea', source: 'world' },
  'kelpies-cove':          { x: 1050, y: 1700, pinType: 'settlement', regionId: 'iceheart-sea', source: 'world' },
  'the-saltmaw-estuary':   { x: 1300, y: 1400, pinType: 'wilderness', regionId: 'iceheart-sea', source: 'world' },
  'wraithsound':           { x: 450,  y: 2100, pinType: 'wilderness', regionId: 'iceheart-sea', source: 'world' },
  'deepwell-archipelago':  { x: 750,  y: 2150, pinType: 'wilderness', regionId: 'iceheart-sea', source: 'world' },
  'spindrift-lagoon':      { x: 1100, y: 2050, pinType: 'settlement', regionId: 'iceheart-sea', source: 'world' },
  'the-shivering-bight':   { x: 1000, y: 1100, pinType: 'wilderness', regionId: 'iceheart-sea', source: 'world' },
  'skalds-longport':       { x: 1280, y: 1150, pinType: 'settlement', regionId: 'iceheart-sea', source: 'world' },

  // =========================================================================
  // CRAGJAW PEAKS (centroid 3600,1500)
  // =========================================================================
  'frostmaw-holdfast':   { x: 3600, y: 1500, pinType: 'city',       regionId: 'cragjaw-peaks', source: 'world' },
  'the-spans':           { x: 3350, y: 1250, pinType: 'wilderness', regionId: 'cragjaw-peaks', source: 'world' },
  'ancestor-gaps':       { x: 3100, y: 1100, pinType: 'tomb',       regionId: 'cragjaw-peaks', source: 'world' },
  'sump-galleries':      { x: 3850, y: 1350, pinType: 'wilderness', regionId: 'cragjaw-peaks', source: 'world' },
  'lost-brood-vats':     { x: 3400, y: 1000, pinType: 'ruin',       regionId: 'cragjaw-peaks', source: 'world' },
  'deepchasm-keep':      { x: 3800, y: 1600, pinType: 'settlement', regionId: 'cragjaw-peaks', source: 'world' },
  'iron-ravine':         { x: 3900, y: 1850, pinType: 'wilderness', regionId: 'cragjaw-peaks', source: 'world' },
  'the-great-gorge':     { x: 3150, y: 1500, pinType: 'wilderness', regionId: 'cragjaw-peaks', source: 'world' },
  'stags-rest-moraine':  { x: 3000, y: 1750, pinType: 'ruin',       regionId: 'cragjaw-peaks', source: 'world' },
  'sump-rift':           { x: 3700, y: 1930, pinType: 'wilderness', regionId: 'cragjaw-peaks', source: 'world' },
  'gearworks-gulch':     { x: 3250, y: 2050, pinType: 'settlement', regionId: 'cragjaw-peaks', source: 'world' },
  'frostmaw-massif':     { x: 3500, y: 1800, pinType: 'wilderness', regionId: 'cragjaw-peaks', source: 'world' },

  // =========================================================================
  // SUNDRIFT VALE (centroid 3300,2800)
  // =========================================================================
  'synod-hold':          { x: 3300, y: 2800, pinType: 'city',       regionId: 'sundrift-vale', source: 'world' },
  'mound-camps':         { x: 3050, y: 2650, pinType: 'settlement', regionId: 'sundrift-vale', source: 'world' },
  'ancestor-mounds':     { x: 3000, y: 2950, pinType: 'tomb',       regionId: 'sundrift-vale', source: 'world' },
  'grass-tundra':        { x: 2800, y: 2500, pinType: 'wilderness', regionId: 'sundrift-vale', source: 'world' },
  'lien-stalked-grazes': { x: 2700, y: 2900, pinType: 'wilderness', regionId: 'sundrift-vale', source: 'world' },
  'kumis-downs':         { x: 2600, y: 2700, pinType: 'wilderness', regionId: 'sundrift-vale', source: 'world' },
  'the-long-steppe':     { x: 3550, y: 2500, pinType: 'wilderness', regionId: 'sundrift-vale', source: 'world' },
  'ancestor-wold':       { x: 3850, y: 2600, pinType: 'ruin',       regionId: 'sundrift-vale', source: 'world' },
  'starfall-vale':       { x: 3900, y: 2850, pinType: 'wilderness', regionId: 'sundrift-vale', source: 'world' },
  'nova-heath':          { x: 3700, y: 2950, pinType: 'wilderness', regionId: 'sundrift-vale', source: 'world' },
  'the-unlit-knoll':     { x: 3400, y: 2950, pinType: 'ruin',       regionId: 'sundrift-vale', source: 'world' },
  'morrens-bogpost':     { x: 2850, y: 2400, pinType: 'settlement', regionId: 'sundrift-vale', source: 'world' },

  // =========================================================================
  // BRYNGLOOM FOREST (centroid 300,2700)
  // =========================================================================
  'atropolis':               { x: 300,  y: 2700, pinType: 'city',       regionId: 'bryngloom-forest', source: 'world' },
  'the-sunken-spire':        { x: 550,  y: 2850, pinType: 'city',       regionId: 'bryngloom-forest', source: 'world' },
  'peat-bog-sinks':          { x: 750,  y: 2950, pinType: 'wilderness', regionId: 'bryngloom-forest', source: 'world' },
  'root-veil-scriptorium':   { x: 150,  y: 2500, pinType: 'settlement', regionId: 'bryngloom-forest', source: 'world' },
  'over-shanty':             { x: 450,  y: 2500, pinType: 'settlement', regionId: 'bryngloom-forest', source: 'world' },
  'widows-quagmire':         { x: 950,  y: 2800, pinType: 'wilderness', regionId: 'bryngloom-forest', source: 'world' },
  'black-fen':               { x: 1150, y: 2950, pinType: 'wilderness', regionId: 'bryngloom-forest', source: 'world' },
  'drowned-dingle':          { x: 1300, y: 2650, pinType: 'wilderness', regionId: 'bryngloom-forest', source: 'world' },
  'vel-keth-bayou':          { x: 1350, y: 2900, pinType: 'wilderness', regionId: 'bryngloom-forest', source: 'world' },
  'aran-glen':               { x: 1200, y: 2300, pinType: 'settlement', regionId: 'bryngloom-forest', source: 'world' },
  'hunters-gully':           { x: 700,  y: 2500, pinType: 'wilderness', regionId: 'bryngloom-forest', source: 'world' },
  'fangmere-grove':          { x: 900,  y: 2300, pinType: 'ruin',       regionId: 'bryngloom-forest', source: 'world' },
  'thalrens-ledger-post':    { x: 1380, y: 2480, pinType: 'settlement', regionId: 'bryngloom-forest', source: 'world' },
  'merryns-drift':           { x: 850,  y: 2900, pinType: 'settlement', regionId: 'bryngloom-forest', source: 'world' }
};

export default LOCATION_COORDINATES;
