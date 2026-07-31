/**
 * Subregions Database
 *
 * Named geographical subregions within each continent. This is the
 * intermediate layer between the continent and individual POIs in zoneData.
 * Each subregion has its own climate, dominant terrain, races/factions,
 * and a list of the zones it contains.
 *
 * Subregion IDs use hyphens (e.g., 'frostwood-south-reach').
 */

export const SUBREGIONS = {
  // ========================================================================
  // FROSTWOOD REACH
  // ========================================================================
  'frostwood-south-reach': {
    id: 'frostwood-south-reach',
    name: 'The Ironheart Vales',
    regionId: 'frostwood-reach',
    description: 'The warmer, denser southern half of the Frostwood Reach, closest to the world-heart and the volcanic warmth bleeding out of Sundale. The ironwood here is the oldest and tallest in the region, and the fog is at its thickest. This is Thalreth country: the Sovereign Ledger is enforced at every check-post, the Scribe-Cartel holds its monopoly on ink, and the Mist-Sentinels patrol the Ironwood Palisade.',
    climate: 'Cool-temperate, damp, fog-bound year-round',
    dominantTerrain: 'Petrified ironwood forest, peat-bog hollows, silt-roads',
    primaryRaces: ['Thalren humans', 'Masked Mimir', 'Shorn Florae'],
    primaryFactions: ['House Thalreth', 'Scribe-Cartel', 'Mist-Sentinels'],
    zoneIds: ['greymark-keep', 'scribes-tower', 'ledger-halls', 'the-shallows', 'greythorn-copse', 'skalds-landing', 'mirror-mere', 'bramble-heath', 'meadowglen-crossing', 'velling-pass', 'ironwood-heart']
  },
  'frostwood-north-reach': {
    id: 'frostwood-north-reach',
    name: 'The Frostfang Wastes',
    regionId: 'frostwood-reach',
    description: 'The cold, stony northern half of the Frostwood Reach, far from the volcanic warmth. The forests thin into tundra and bare granite, and the ironwoods grow short and twisted. Stone structures replace living timber; carved runic monoliths and watch-posts built into cliff faces mark the few roads. Frozen lakes surface in summer; the rest of the year, only their location is remembered. Rumors persist of giant Jutul-like beings in the deep wastes, but the few who travel that far rarely return to confirm.',
    climate: 'Sub-arctic, biting wind, summer lasts eight weeks',
    dominantTerrain: 'Granite tundra, frozen lakes, sparse twisted ironwood, glacial moraine',
    primaryRaces: ['Frostfang Skalds (Skald expatriates)', 'Stone-Tribal humans', 'occasional Mimir Mountain-Sent'],
    primaryFactions: ['Greymark Northwatch', 'The Stone-Speakers', 'Jutul reavers (rumored)'],
    zoneIds: ['frostfang-wastes', 'grevtholm', 'iron-lake', 'the-stone-circles', 'bearsback-summit']
  },
  'frostwood-eastern-fens': {
    id: 'frostwood-eastern-fens',
    name: 'The Drowned Fens',
    regionId: 'frostwood-reach',
    description: 'A lawless stretch of peat-bog and brackish marsh on the eastern fringe of the Reach, where the fog thins into a low, clinging haze. The Forgotten, undocumented people stripped of their rights by the Sovereign Ledger, hide here, alongside the Mimir outcasts and the most desperate Florae exiles.',
    climate: 'Damp, hazier than the rest of the Reach, mild',
    dominantTerrain: 'Peat-bog, marsh, drowned ironwood groves',
    primaryRaces: ['Tethered Mimir', 'Forgotten (Thalren outcasts)', 'Trueborn Florae refugees'],
    primaryFactions: ['The Forgotten', 'Tethered Mimir clans', 'Root-Veil spillover'],
    zoneIds: ['wraithfen', 'the-shifting-fen', 'mistbarrow']
  },

  // ========================================================================
  // NORDHALLA
  // ========================================================================
  'nordhalla-glacier-heart': {
    id: 'nordhalla-glacier-heart',
    name: 'Frosthold Pass & Rime-Spire Peaks',
    regionId: 'nordhalla',
    description: 'The cold, sparsely populated interior of Nordhalla, endless whiteout glaciers, shifting crevasses, and the brooding peaks that mark the spine of the continent. The Frost-Tithe mothers and the Hunger Pact consumptions happen here. The Rime-Born, the Frostbound, and the Stel (glacier-memories given form) stalk these wastes.',
    climate: 'Polar, perpetual blizzard in winter, brief white summer',
    dominantTerrain: 'Glaciers, ice fields, frozen chasms, granite peaks',
    primaryRaces: ['Rime-Born', 'Frostbound', 'Corvani (clan flocks)'],
    primaryFactions: ['House Skalvyr (royal seat)', 'Skald Keepers'],
    zoneIds: ['frozen-archive', 'rimors-hearth', 'hunger-glaciers', 'skadis-col', 'the-still-crag', 'frosthold-citadel', 'bearsbeards-beak']
  },
  'nordhalla-fjord-coast': {
    id: 'nordhalla-fjord-coast',
    name: 'Stormveil Fjords',
    regionId: 'nordhalla',
    description: 'The long eastern seaboard of Nordhalla, where the black fjords cut deep into the cliff walls. This is the warmest, most populated face of the continent. The only place where agriculture is possible, where trade ships can dock, and where the Icechamber Syndicate runs its monopoly. The Fastboende (settled loyalists) cluster here; the Fredl�se (outlaw clans) try to survive on the edges.',
    climate: 'Cold-temperate maritime, moderated by sea',
    dominantTerrain: 'Black granite fjords, sea-cliffs, harbor towns, fish-farms',
    primaryRaces: ['Skald humans', 'Merryn expatriates', 'occasional Corvani'],
    primaryFactions: ['Icechamber Syndicate', 'Fastboende clan confederations', 'Skald Keepers'],
    zoneIds: ['fjord-gate', 'bloodhammer-sump', 'eldonholm', 'vesperas-perch', 'rooks-promontory', 'vargtor', 'spars-folly']
  },
  'nordhalla-southern-shore': {
    id: 'nordhalla-southern-shore',
    name: 'Brimstone Shore',
    regionId: 'nordhalla',
    description: 'The southern coast of Nordhalla, facing the open sea toward Sundale. Less defended than the Fjord-Coast; the Skald navy patrols, but smugglers and Fredl�se raiders use the long, broken shoreline to slip past the Icechamber Syndicate. Xardin\'s Hearth, the southernmost major settlement, sits on a volcanic vent that keeps the harbor ice-free year-round.',
    climate: 'Cold but milder, sea-moderated',
    dominantTerrain: 'Volcanic black-sand beaches, sea-cliffs, geothermal hot-springs',
    primaryRaces: ['Skald humans', 'Smuggler crews', 'Fredl�se outlaws'],
    primaryFactions: ['Skald navy', 'Fredl�se clans', 'Xardin\'s Trading Company'],
    zoneIds: ['xardins-hearth', 'southern-shore-smugglers-cove']
  },

  // ========================================================================
  // SUNDALE
  // ========================================================================
  'sundale-ash-heart': {
    id: 'sundale-ash-heart',
    name: 'Emberspire Caldera & Cinder Badlands',
    regionId: 'sundale',
    description: 'The dead volcanic core of Sundale, a ring of obsidian and basalt around Emberspire that no one lives in and few cross. The Spinstones Columns, the Cinderbloom Crater, the Sunstone Mesa, the Emberspire Caldera itself, all volcanic features, all lethal without preparation. The Wyrd bleeds thickest here.',
    climate: 'Uninhabitable, ash-fall, sulfuric fumes',
    dominantTerrain: 'Obsidian sand, basalt columns, active lava fields',
    primaryRaces: ['None permanent, Emberspire pilgrims and Solari Watchers only'],
    primaryFactions: ['Dawn Vigil foragers', 'Solari Watchers', 'Sulfur Cartel prospectors'],
    zoneIds: ['emberspire-caldera', 'sols-anvil-mesa', 'cinder-badlands', 'spinstones-columns', 'cinderbloom-crater', 'the-star-caves']
  },
  'sundale-ashen-fringe': {
    id: 'sundale-ashen-fringe',
    name: 'Sootstone Escarpment',
    regionId: 'sundale',
     description: 'The wide ring of ashen flatland and volcanic rock that surrounds the Ash-Heart. The bulk of Sundale\'s population lives here, the Ash-Dwellers who work the sulfur mines, the Solari refugees clinging to their ancient capital, the Solari forge-clans whose forges burn on the residual heat. The Dawn Vigil\'s Obsidian Citadels ring the Ashen Escarpment that separates the fringe from the green lands beyond.',
    climate: 'Hot, dry, ash-fall, cool at night',
    dominantTerrain: 'Volcanic ash plains, geothermal vents, sulfur sumps, basalt formations',
     primaryRaces: ['Solari (Hollow-Solari and Waste-Solari)', 'conscripted Martyrs'],
    primaryFactions: ['Dawn Vigil', 'House Solvan', 'Sulfur Cartel', 'Martyr Brigades'],
    zoneIds: ['harath-vault', 'great-forge', 'the-ashen-escarpment', 'vulkars-karst', 'slag-gulch', 'solvans-stand', 'thornshire-colony']
  },
  'sundale-green-rim': {
    id: 'sundale-green-rim',
    name: 'Warmhearth Valley & Meadowglen Shallows',
    regionId: 'sundale',
    description: 'The coastal ring of Sundale, green because the volcanic heat meets the sea and the resulting microclimate supports life. Fishing villages, port towns, oasis-like sheltered valleys, and the famous meadow-lands that the Dawn Vigil struggles to control. This is where the rest of the world trades with Sundale. Meadowglen in the north is the most fertile valley in the region.',
    climate: 'Warm, mild winters, sea-breezes',
    dominantTerrain: 'Coastal plains, sheltered valleys, geothermal hot-springs, oasis groves',
     primaryRaces: ['Solari (wealthy)', 'Merryn traders', 'Solari exiles'],
    primaryFactions: ['Dawn Vigil (nominal)', 'Smuggler captains', 'Sun-veneration revival cults'],
    zoneIds: ['konjaw-port', 'ironjaw-village', 'ember-lagoon', 'meadowglen', 'warmheath', 'breezebough', 'basalt-shyr']
  },
  'sundale-glitterwood': {
    id: 'sundale-glitterwood',
    name: 'Glitterwood Ridge & Glimmering Forest',
    regionId: 'sundale',
    description: 'A peninsula connected to the main Sundale landmass by a narrow isthmus, a half-island, lush and forested, the greenest land in the region. Crystal-rich volcanic soil supports ancient growth; the trees here drink the heat bleeding from Emberspire. Long thought uninhabitable, the Dawn Vigil\'s collapse has seen it recolonized by hermits, the Risen (old Solari faith), and the Shorn descendants of the old Solvarn nobility who fled the capital.',
    climate: 'Warm, humid, sheltered by mountain spine',
    dominantTerrain: 'Crystal-rich soil, ancient broadleaf forest, geothermal hot-springs, hidden valleys',
    primaryRaces: ['The Risen (old Solari faith)', 'Shorn exiles', 'Solari hermits'],
    primaryFactions: ['The Risen', 'Free Glitterwood Council', 'Old-Sun reverence revival'],
    zoneIds: ['the-glittering-forest', 'glitterwood-heart', 'old-sun-shrine']
  },

  // ========================================================================
  // ICEHEART SEA
  // ========================================================================
  'iceheart-merrow-archipelago': {
    id: 'iceheart-merrow-archipelago',
    name: 'The Merrow Archipelago',
    regionId: 'iceheart-sea',
    description: 'The central cluster of inhabited islands in the Iceheart Sea, the heart of Merryn seafaring, the seat of the Sea-Charter, and the only place the Board of Trade fully controls. Merrowport floats at the center. Ironjaw Port anchors the eastern reach. Dozens of smaller islands host fishing camps, salt-works, and the Drift-Council representatives.',
    climate: 'Storm-belt, sea-cold, gales year-round',
    dominantTerrain: 'Volcanic seamounts lashed into floating cities, black-sand beaches, sea-cliffs',
    primaryRaces: ['Merryn humans', 'Neth Velun (at Ironjaw Port)', 'Smugglers and pirates'],
    primaryFactions: ['House Mereval', 'Brine-Bond Syndicate', 'Board of Trade', 'Drift-Council'],
    zoneIds: ['merrowport', 'ironjaw-port', 'brinehorse-cove', 'spindrift-lagoon', 'blackteeth-isle', 'the-lucky-anchor']
  },
  'iceheart-storm-belt': {
    id: 'iceheart-storm-belt',
    name: 'The Storm-Belt',
    regionId: 'iceheart-sea',
    description: 'The western stretch of the Iceheart Sea, dominated by the Shard-Window, a three-mile-wide circular storm-vortex hovering over a Sundered Monolith. The waters here never rest. Pirate fleets use the storm-veins to escape Board of Trade patrols; the Myriad wraiths and storm-spirits stalk the lanes.',
    climate: 'Perpetual cyclone-belt, lightning, salt-rain',
    dominantTerrain: 'Open sea, storm-vortexes, sea-stacks, drowned shipwrecks',
    primaryRaces: ['Merryn pirates', 'Stormspeakers (animist cult)', 'bound elementals'],
    primaryFactions: ['Merryn Pirate Confederacy', 'Stormspeakers', 'The Board\'s "lost fleet"'],
    zoneIds: ['shard-window', 'gale-storm-shallows', 'wraithsound']
  },
  'iceheart-deepwell-trench': {
    id: 'iceheart-deepwell-trench',
    name: 'The Deepwell Trench',
    regionId: 'iceheart-sea',
    description: 'The eastern reach of the Iceheart Sea, where the continental shelf drops away into the Treakous Oceanic Rift, a bottomless abyss. The Myrathil rule this depth; their Deep dwell in pressurized cave-cities carved into underwater basalt columns. Surface access is by Breathers-Born (merfolk-blooded) liaisons only.',
    climate: 'Frigid deep-sea, no surface weather',
    dominantTerrain: 'Abyssal rift, underwater basalt cave-cities, bioluminescent reefs',
    primaryRaces: ['Myrathil (Shore, Deep, Brook)'],
    primaryFactions: ['Myrathil Trench-Council', 'Abyssal Cartel', 'Surface diplomatic missions'],
    zoneIds: ['deepwell-archipelago', 'treakous-rift', 'the-shivering-bight']
  },
  'iceheart-northern-iceflows': {
    id: 'iceheart-northern-iceflows',
    name: 'The Frozen-Flows',
    regionId: 'iceheart-sea',
    description: 'The northern edge of the Iceheart Sea, where the waters freeze into icebergs the size of cities. Ancient ruins protrude from the bergs. First Shore is the largest, the original Mereval landing site, now preserved as a pilgrimage. Few venture here. The Berg-Witches and the Boreal Huldra live in the floes.',
    climate: 'Polar marine, ice-floe year-round',
    dominantTerrain: 'City-sized icebergs, frozen sea, ancient ruins on bergs',
    primaryRaces: ['Berg-Witches', 'Boreal Huldra', 'occasional Merryn whalers'],
    primaryFactions: ['Icewhisper Coven', 'Frozen Archive expedition (seasonal)'],
    zoneIds: ['first-shore', 'berg-of-the-frozen-flame', 'whaleroot-floe']
  },
  'iceheart-western-isles': {
    id: 'iceheart-western-isles',
    name: 'The Saryreach Isles',
    regionId: 'iceheart-sea',
    description: 'The chain of broken islands along the western edge of the Iceheart Sea, the boundary between the Merryn and the continental coasts. Saryreach Castle, the largest, was once a Mereval naval fortress and is now a pirate-queen\'s seat. Smaller islands host smuggler-coves, exile colonies, and the Mer-Court of the Tides.',
    climate: 'Cold maritime, fog-belt, salt-spray',
    dominantTerrain: 'Black-granite sea-stacks, sea-cliffs, hidden coves',
    primaryRaces: ['Merryn pirates', 'Exiled Velun', 'Tide-Speakers (animist holdouts)'],
    primaryFactions: ['Pirate-Queen of Saryreach', 'Tide-Speakers', 'Mer-Court'],
    zoneIds: ['saryreach-castle', 'blackteeth-skerry', 'tide-court-cove']
  },
  'iceheart-saltmaw': {
    id: 'iceheart-saltmaw',
    name: 'The Saltmaw Estuary Marshes',
    regionId: 'iceheart-sea',
    description: 'The southernmost reach of the Iceheart Sea, where a glacial river from the Bryngloom meets the salt water. The estuary is a vast marshland of half-fresh, half-salt water; the Saltmaw Bog is a place of smugglers, exiled Neth, and forgotten spirits.',
    climate: 'Damp, foggy, sea-tidal',
    dominantTerrain: 'Salt-marsh, glacial melt, tidal flats',
    primaryRaces: ['Merryn smugglers', 'Neth Velun (exiles)', 'Vreken (in the deeper pools)'],
    primaryFactions: ['Saltmaw Free-Port', 'Neth exile community', 'Forgotten-Cult of the Mawed Sea'],
    zoneIds: ['the-saltmaw-estuary']
  },
  'iceheart-waters-of-eziara': {
    id: 'iceheart-waters-of-eziara',
    name: 'The Waters of Eziara',
    regionId: 'iceheart-sea',
    description: 'The vast central ocean basin separating Sundale, Cragjaw, and Sundrift Vale. The primary shipping lane of the known world, patrolled by Merryn merchant fleets and targeted by Leviathan Empire Siren raids.',
    climate: 'Maritime, brisk sea gales, mist-veils',
    dominantTerrain: 'Open deep ocean, merchant shipping lanes, abyssal thermal vents',
    primaryRaces: ['Merryn traders', 'High Neth diplomats', 'Siren Queens'],
    primaryFactions: ['Merryn Trade Guild', 'Leviathan Empire', 'Crown Coalition Patrols'],
    zoneIds: ['waters-of-eziara']
  },
  'iceheart-three-dukes': {
    id: 'iceheart-three-dukes',
    name: 'The Three Dukes Spire Chain',
    regionId: 'iceheart-sea',
    description: 'Three towering basalt sea-spires standing between southern Nordhalla and northern Sundale, named after rebel Skald dukes who fled the Glacier Bargain.',
    climate: 'Cold maritime, sea-foam spray',
    dominantTerrain: 'Basalt sea-spires, sea-caves, sunken ruins',
    primaryRaces: ['Skald Exiles', 'Spectral Dukedom shades'],
    primaryFactions: ['Three Dukes Confederacy', 'Fredløse pirates'],
    zoneIds: ['the-three-dukes']
  },
  'iceheart-twin-gates': {
    id: 'iceheart-twin-gates',
    name: 'The Twin Gates Strait',
    regionId: 'iceheart-sea',
    description: 'A narrow, cliff-flanked sea strait at the mouth of the East Sea. The primary naval choke-point where Crown Coalition warships demand trade tolls.',
    climate: 'Windy sea strait, high cliffs',
    dominantTerrain: 'Granite sea-pillars, narrow channel, toll-towers',
     primaryRaces: ['Crown Coalition naval officers', 'Solari island guards'],
    primaryFactions: ['Crown Coalition Navy', 'Board of Trade'],
    zoneIds: ['the-twin-gates']
  },
  'sundale-flooded-hills': {
    id: 'sundale-flooded-hills',
    name: 'The Flooded Hills',
    regionId: 'sundale',
    description: 'A marshy, island-dotted archipelago of semi-submerged hills connecting southern Sundale to northern Sundrift Vale, formed when Mereval sea-bargains flooded the lowland valleys.',
    climate: 'Warm, humid marsh mist',
    dominantTerrain: 'Flooded hilltops, shallow reed-bogs, stilt-passages',
    primaryRaces: ['Clean & Marked Vreken', 'Myrathil amphibious traders'],
    primaryFactions: ['Flooded Hills Free-Port', 'Scoured Syndicate smugglers'],
    zoneIds: ['the-flooded-hills']
  },
  'sundale-heathens-gate': {
    id: 'sundale-heathens-gate',
    name: 'Heathens Gate',
    regionId: 'sundale',
    description: 'A volcanic sea-chasm surrounded by black obsidian reefs north of Sundale, used by Scoured Syndicate cultists to perform dark solar rituals.',
    climate: 'Sulfuric heat, ocean sea-spray',
    dominantTerrain: 'Obsidian sea-chasm, volcanic reefs, sacrificial altars',
    primaryRaces: ['Scoured Syndicate cultists', 'False Prophets'],
    primaryFactions: ['Scoured Syndicate', 'Coven of the Unbound'],
    zoneIds: ['heathens-gate']
  },
  'frostwood-frostdeep-gloom': {
    id: 'frostwood-frostdeep-gloom',
    name: 'Frostdeep Gloom',
    regionId: 'frostwood-reach',
    description: 'An ominous, fog-choked rift valley where petrified ironwoods meet the granite cliffs of Cragjaw Peaks, serving as a strategic mountain-pass battleground.',
    climate: 'Sub-arctic, dense freezing fog',
    dominantTerrain: 'Glacial valley, petrified ironwoods, granite precipices',
    primaryRaces: ['Skald Expatriates', 'Stone-Tribal Humans', 'Frostbound colossi'],
    primaryFactions: ['Crown Coalition Vanguard', 'Blood-Hammer Highlands Wardens'],
    zoneIds: ['frostdeep-gloom']
  },
  'frostwood-deep-of-ilisha': {
    id: 'frostwood-deep-of-ilisha',
    name: 'The Deep of Ilisha',
    regionId: 'frostwood-reach',
    description: 'A sheltered, deep-water gulf between Sundale and Frostwood Reach, filled with pre-Binding sunken shipwrecks and submerged archives.',
    climate: 'Cool-temperate marine, mist-shrouded',
    dominantTerrain: 'Deep-water gulf, coastal coves, underwater ruins',
    primaryRaces: ['Thalren mariners', 'Sea-Scribes'],
    primaryFactions: ['Scribe-Cartel Fleet', 'Thalreth Naval Wardens'],
    zoneIds: ['the-deep-of-ilisha']
  },

  // ========================================================================
  // CRAGJAW PEAKS
  // ========================================================================
  'cragjaw-massif': {
    id: 'cragjaw-massif',
    name: 'The Frostmaw Massif Range',
    regionId: 'cragjaw-peaks',
    description: 'The central spine of the Cragjaw Peaks, the highest, coldest, and most impassable. Frostmaw Holdfast, seat of House Tesshan, sits in a volcanic crater near the center. The peaks here are taller than any tree grows. Jutul, the great trolls, and the primordial Thrumm stalk the high ice. Few humans have climbed above the Terraced level and returned.',
    climate: 'Alpine, year-round blizzard above the mid-line',
    dominantTerrain: 'Granite peaks, glacial cirques, ice fields, volcanic crater-keeps',
    primaryRaces: ['Tessen humans (in the holds)', 'Jutul giants (high peaks)', 'Thrumm (primordial)'],
    primaryFactions: ['House Tesshan', 'Steam-Line Cartel', 'Jutul warbands'],
    zoneIds: ['frostmaw-holdfast', 'frostmaw-massif', 'skirmours-crag', 'the-stone-cog']
  },
  'cragjaw-gorge-web': {
    id: 'cragjaw-gorge-web',
    name: 'The Gorge-Web',
    regionId: 'cragjaw-peaks',
    description: 'The mid-altitude network of chasms, gorges, and bone-bridges that connect the keeps to the deep industrial sumps. The Groven rule here, their calcified Ancestor-Spans are the only safe routes through the chasms. Deepchasm Keep is the military hub. Tessen patrols, Groven toll-posts, and the Mist-Cobblers watch the high passes.',
    climate: 'Sub-alpine, wind-blasted, snow-veiled',
    dominantTerrain: 'Chasms, hanging-bridges, mid-altitude valleys, whiteouts',
    primaryRaces: ['Tessen humans', 'Groven (Morgh, Ithran)', 'Fexric (some)'],
    primaryFactions: ['Tessen military', 'The Groven bridge-clans', 'Rope-Garrisons'],
    zoneIds: ['the-spans', 'ancestor-gaps', 'deepchasm-keep', 'the-great-gorge', 'alley-of-knor']
  },
  'cragjaw-iron-sumps': {
    id: 'cragjaw-iron-sumps',
    name: 'The Iron Sumps',
    regionId: 'cragjaw-peaks',
    description: 'The deep industrial heart of the Cragjaw Peaks, the toxic mining shafts, geothermal plants, and Fexric workshops that keep the high keeps alive. The Sump Galleries, Gearworks Gulch, and Iron Ravine are all here. Chasm-Dwellers work the mines; Deep Alchemists run the vats; the Lost Brood Vats are the abandoned ruins of a guild that went too deep.',
    climate: 'Hot, toxic, sulfuric at the deepest',
    dominantTerrain: 'Toxic mining shafts, geothermal pipes, basalt vats, lava-fed forges',
    primaryRaces: ['Fexric (Clockwork Fexric, Caustic Fexric)', 'Chasm-Dweller humans', 'Sump-Scrab'],
    primaryFactions: ['Steam-Line Cartel', 'Clockwork Fexric Guilds', 'Deep Alchemist (secret)', 'Vat-Breakers Guild'],
    zoneIds: ['gearworks-gulch', 'sump-galleries', 'iron-ravine', 'lost-brood-vats', 'stags-rest-moraine', 'driknell-foundry']
  },

  // ========================================================================
  // SUNDRIFT VALE
  // ========================================================================
  'sundrift-long-steppe': {
    id: 'sundrift-long-steppe',
    name: 'The Endless Steppe',
    regionId: 'sundrift-vale',
    description: 'The vast central plain of the Sundrift Vale, endless grass, endless wind, endless migration. The Mounted clans roam here, following the mare-herds across The Long Steppe and the Grass Tundra. Few landmarks. The Unlit Knoll rises in the distance. The Lien-Stalked Grazes glow faintly at night.',
    climate: 'Cold-temperate steppe, perpetual wind, mild summers',
    dominantTerrain: 'Endless grass plains, low rolling hills, the occasional ancestor mound',
    primaryRaces: ['Ordan humans (Mounted and Unmounted)', 'Sky-Singer hermits'],
    primaryFactions: ['House Ordavan', 'Mounted clan confederations', 'Sky-Singers (persecuted)'],
    zoneIds: ['the-long-steppe', 'grass-tundra', 'kumis-downs', 'lien-stalked-grazes', 'mound-camps', 'the-unlit-knoll']
  },
  'sundrift-ancestor-wolds': {
    id: 'sundrift-ancestor-wolds',
    name: 'The Ancestor Wolds',
    regionId: 'sundrift-vale',
    description: 'The eastern uplands of the Vale, rolling hills covered with thousands of burial barrows. The Mound-Camps gather here for in summer; the Astril pilgrimage to the deepest mounds to hear Lumia\'s echo. The Ordavan Herd-Tithe is enforced at cairn-checkpoints; the Echo-Singers come here to die.',
    climate: 'Cool upland, fog in the burial hollows',
    dominantTerrain: 'Burial barrows, hallowed ground, cairn-checkpoints',
    primaryRaces: ['Ordan humans', 'Astril (Stellar Astril and Earthen Astril)', 'Sky-Singer hermits'],
    primaryFactions: ['House Ordavan', 'Astril Synod', 'Mound-Keepers'],
    zoneIds: ['ancestor-mounds', 'mound-camps', 'novas-heath', 'the-moundwatch']
  },
  'sundrift-starfall-basin': {
    id: 'sundrift-starfall-basin',
    name: 'The Starfall Basin',
    regionId: 'sundrift-vale',
    description: 'The western basin of the Vale, dominated by the great crater of Starfall Vale, where the crystalline remnants of Lumia\'s destruction struck Mythrill during the Breach. The Synod Hold, the Astril crystal-lattice fortress, rises at the basin\'s center. The most spiritually significant site in the Vale, and the most contested.',
    climate: 'Cold, the basin is sheltered by ridges',
    dominantTerrain: 'Meteor crater, crystal-fields, crystal-lattice spires',
    primaryRaces: ['Astril (all castes)', 'Ordan Unmounted (servants)', 'Earthen Astril pilgrims'],
    primaryFactions: ['Astril Synod', 'Earthen Astril Pilgrim-Orders', 'Lumia-Memory cult'],
    zoneIds: ['synod-hold', 'starfall-vale']
  },
  'sundrift-bogpost-march': {
    id: 'sundrift-bogpost-march',
    name: 'The Bogpost March',
    regionId: 'sundrift-vale',
     description: 'The southern march of the Vale, the transition zone where the steppe meets the Bryngloom Forest. Morren\'s Bogpost is the only major settlement, a trade outpost where Ordan horse-traders meet Vreken peat-cutters and Bryngloom Neth scribes. The cultural mixing here is intense; many Marred folk live in the bogpost.',
    climate: 'Damp, foggy, the edge of the swamp',
    dominantTerrain: 'Marshy steppe, peat-edges, river-crossings',
     primaryRaces: ['Ordan humans', 'Vreken', 'Bryngloom Neth (travelers)'],
    primaryFactions: ['Bogpost Trade-Council', 'Ordan March Wardens', 'Bryngloom Frontier Posts'],
    zoneIds: ['morrens-bogpost']
  },
  'sundrift-blizzard-bluff': {
    id: 'sundrift-blizzard-bluff',
    name: 'Blizzard Bluff',
    regionId: 'sundrift-vale',
    description: 'The northern edge of the Vale, where a high cold bluff separates the warmer steppe from the deep ice of the Frostwood Reach. The Ordavan call this the Snow-Tooth, the wind here never stops. Small Ordan sentry-posts watch the passes; Frostwood Thalren patrols meet them at the cairns.',
    climate: 'Sub-arctic, perpetual wind, deep snow in winter',
    dominantTerrain: 'High bluffs, cairn-marked passes, cold grassland',
    primaryRaces: ['Ordan humans (frontier clans)', 'Thalren patrols (visiting)'],
    primaryFactions: ['Ordan March Wardens', 'Frostwood Palisade patrols (visiting)'],
    zoneIds: ['blizzard-bluff']
  },

  // ========================================================================
  // BRYNGLOOM FOREST
  // ========================================================================
  'bryngloom-canopy-heart': {
    id: 'bryngloom-canopy-heart',
    name: 'The Canopy-Heart',
    regionId: 'bryngloom-forest',
     description: 'The political heart of the Bryngloom, the ironwood cathedral-grove of Atropolis, the Great Mere (the central lake), the Over-Shanty hanging slum. The Neth Velun rule here; the Great Registry is enforced; the Vreken are bound to debt-covenants beneath the towering ironwood. The Peat-Bog Sinks surround the capital.',
    climate: 'Damp, mild, foggy under the canopy',
    dominantTerrain: 'Living ironwood cathedral-grove, central lake, peat-bog, hanging slums',
     primaryRaces: ['Neth (Velun, Kessen, Drun)', 'Vreken', 'Vreken (in the deep)'],
    primaryFactions: ['House Morrath', 'Velun Pact-Lords', 'Over-Shanty syndicates'],
    zoneIds: ['atropolis', 'over-shanty', 'peat-bog-sinks', 'merryns-drift', 'the-great-mere']
  },
  'bryngloom-sunken-basin': {
    id: 'bryngloom-sunken-basin',
    name: 'The Sunken Basin',
    regionId: 'bryngloom-forest',
    description: 'The south-eastern depression of the Bryngloom, where the Vreken have carved their inverted gothic cathedral into a four-hundred-foot sinkhole. The Sunken Spire, the crypt of Aedris the First-Lit, the fungal shroud-shrines, all here. The basin floor glows faintly with the eternal pale-moonlight of Aedris.',
    climate: 'Damp, the spire-pointed fungal air is thick',
    dominantTerrain: 'Sinkhole, inverted gothic architecture, fungal forests, shallow pools',
    primaryRaces: ['Vreken (Clean, Marked, Over-Lit)', 'Neth (rare visitors)'],
    primaryFactions: ['Crypt-Council', 'Veil-Speakers', 'Cult of the First-Lit'],
    zoneIds: ['the-sunken-spire', 'fangmere-grove', 'the-crypt-of-aedris']
  },
  'bryngloom-peat-wastes': {
    id: 'bryngloom-peat-wastes',
    name: 'The Peat-Wastes',
    regionId: 'bryngloom-forest',
    description: 'The northern reaches of the forest, vast stretches of acidic peat-bog where the ironwood roots rot and the water is poison. The Widow\'s Quagmire is the worst, a stretch that liquefies underfoot. Debt-Revenants are conscripted to work the peat-presses here; the Black Fen is where broken contracts are dumped.',
    climate: 'Damp, sulfuric, foggy',
    dominantTerrain: 'Acid peat-bog, liquefying mud, dead ironwood stumps',
     primaryRaces: ['Vreken (peat-cutters)', 'Debt-Revenants (undead)', 'Over-Lit Vreken'],
    primaryFactions: ['Peat-Press Cartel', 'Debt-Revenant foremen', 'Morrath Marshals'],
    zoneIds: ['widows-quagmire', 'black-fen', 'drowned-dingle']
  },
  'bryngloom-western-bayous': {
    id: 'bryngloom-western-bayous',
    name: 'The Western Bayous',
    regionId: 'bryngloom-forest',
    description: 'The western edge of the forest, where Vel-Keth Bayou (the water-that-remembers) winds through the oldest ironwood groves. The Kessen weavers of Aran-Glen live here, reading probability in their living-ironwood looms. The Inquisition keeps the Covenbane Stronghold in the eastern bayous; the swamp-singers were purged from these waters.',
    climate: 'Damp, mild, the bayou is always misty',
    dominantTerrain: 'Ironwood bayous, river-cliffs, ancient fae-contracts carved into bark',
     primaryRaces: ['Neth Kessen (weavers)', 'Vreken fishermen', 'Covenbane inquisitors'],
    primaryFactions: ['Kessen Loom-Council', 'Covenbane Inquisition', 'Drowned-Dingle smugglers'],
    zoneIds: ['vel-keth-bayou', 'aran-glen', 'hunters-gully', 'drowned-dingle', 'covenbane-stronghold']
  },
  'bryngloom-great-mere': {
    id: 'bryngloom-great-mere',
    name: 'The Great Mere',
    regionId: 'bryngloom-forest',
    description: 'The vast central lake of the Bryngloom, dotted with small wooded islands, some inhabited, some forbidden, some not even on any map. Merryn barges tie up at the lake-ports; Vreken shrines hide on the western islands; an old Velun monastery stands on the largest. The lake level rises and falls with the moon.',
    climate: 'Damp, mild, the islands have their own microclimates',
    dominantTerrain: 'Open lake, forested islands, peat-bog shore',
    primaryRaces: ['Neth (lake-dwelling)', 'Merryn (lake-traders)', 'Vreken (island hermits)'],
    primaryFactions: ['Lake-Council (joint Neth/Merryn)', 'Monks of the Sunken Stone'],
    zoneIds: ['the-great-mere', 'monks-of-the-sunken-stone']
  },
  'bryngloom-root-veil': {
    id: 'bryngloom-root-veil',
    name: 'The Root-Veil (Subterranean)',
    regionId: 'bryngloom-forest',
    description: 'Beneath the entire forest, the mycelial network the Neth call the Root-Veil connects every ironwood root. Morvane rules here, in the deepest dark, where the First Contract was signed. The Root-Veil Scriptorium, the fabled archive of unbreakable memory, sits at the network\'s heart.',
    climate: 'Always dark, always damp, the air is thick with spores',
    dominantTerrain: 'Mycelial network, ironwood root-tunnels, fungal groves',
    primaryRaces: ['Morvane (entity)', 'Kessen Weavers (deep)'],
    primaryFactions: ['Morvane\'s Archive', 'Root-Veil Coven'],
    zoneIds: ['root-veil-scriptorium']
  }
};

export const getSubregionsByRegion = (regionId) => {
  return Object.values(SUBREGIONS).filter(sub => sub.regionId === regionId);
};

export const getSubregion = (subregionId) => {
  return SUBREGIONS[subregionId] || null;
};

export default SUBREGIONS;
