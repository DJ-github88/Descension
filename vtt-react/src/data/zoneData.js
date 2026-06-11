/**
 * Points of Interest (POIs) and Sub-Zone Database
 *
 * Houses TTRPG-styled points of interest for all seven regions of Mythrill,
 * complete with danger levels, factions, connections, and Wyrd-creature listings.
 * Written in the immersive Mythrill voice.
 *
 * CONVENTION: Zone IDs use hyphens (e.g., 'greymark-keep').
 * The loreDictionary uses underscores for location termIds (e.g., 'greymark_keep').
 * Cross-referencing code must convert between these formats.
 */

export const ZONE_DATA = [
  // =========================================================================
  // FROSTWOOD REACH (Starting Zone)
  // =========================================================================
  {
    id: 'greymark-keep',
    regionId: 'frostwood-reach',
    name: 'Greymark Keep',
    type: 'city',
    description: 'The ancient, towering stronghold of House Thalreth, constructed from wet grey peat-stone and massive petrified ironwood logs. It stands as the primary sanctuary in the Reach, its massive fireplaces fueled by resinous heartwood to ward off both the biting cold and the encroaching memory-eating fog.',
    dangerLevel: 'low',
    factions: ['house-thalreth', 'scribe-sentinels'],
    connections: ['the-shallows', 'scribes-tower'],
    wyrdCreatures: []
  },
  {
    id: 'the-shallows',
    regionId: 'frostwood-reach',
    name: 'The Shallows',
    type: 'wilderness',
    description: 'A labyrinth of mist-veiled, shallow ravines and marshy pine stands surrounding Greymark Keep. Silt-roads are marked by rusted lantern-posts, but travelers must keep their eyes on the ironwood roots, which seem to drift when the mists thicken.',
    dangerLevel: 'medium',
    factions: ['Mist-Sentinels', 'Thalren Trappers'],
    connections: ['greymark-keep', 'ironwood-heart'],
    wyrdCreatures: ['Gambrel', 'Gref']
  },
  {
    id: 'scribes-tower',
    regionId: 'frostwood-reach',
    name: "Scribes' Tower",
    type: 'settlement',
    description: 'A vertical cathedral of parchment and ink, built into the hollow shell of a dead, petrified ironwood. Here, archivists work in silent shifts, copying maps and genealogies onto heavy calfskin vellum to preserve their history before the mists erase their minds.',
    dangerLevel: 'low',
    factions: ['scribe-sentinels', 'house-thalreth'],
    connections: ['greymark-keep', 'ledger-halls'],
    wyrdCreatures: []
  },
  {
    id: 'ledger-halls',
    regionId: 'frostwood-reach',
    name: 'Ledger Halls',
    type: 'ruin',
    description: 'An ancient, partially collapsed underground archive dating back to the first century of the sun\'s death. Chained heavy books of records lie scattered among the petrified roots, guarded by the silent echoes of clerks who forgot their own names.',
    dangerLevel: 'high',
    factions: ['Forgotten Archivists'],
    connections: ['scribes-tower', 'ironwood-heart'],
    wyrdCreatures: ['Gref']
  },
  {
    id: 'ironwood-heart',
    regionId: 'frostwood-reach',
    name: 'Ironwood Heart',
    type: 'wilderness',
    description: 'The deepest, darkest grove in the Frostwood Reach, where the ironwoods grow so dense that the mist forms a heavy, stagnant lake on the forest floor. At its center stands a titanic, glowing white tree whose sap remains warm, attracting both desperate survivalists and horrific predators.',
    dangerLevel: 'extreme',
    factions: ['unshorn-briaran'],
    connections: ['the-shallows', 'ledger-halls'],
    wyrdCreatures: ['Gambrel', 'Gref']
  },

  // =========================================================================
  // NORDHALLA
  // =========================================================================
  {
    id: 'frozen-archive',
    regionId: 'nordhalla',
    name: 'The Frozen Archive',
    type: 'tomb',
    description: 'A subterranean cathedral of blue ice and basalt, carved deep beneath the Nordhalla glaciers. It serves as the ultimate resting place for the Skald clans, who chisel their ancestors\' histories into glacier walls so they will be preserved forever in stasis.',
    dangerLevel: 'medium',
    factions: ['house-skalvyr', 'Skald Keepers'],
    connections: ['fjord-gate', 'rimors-hearth'],
    wyrdCreatures: ['Stel']
  },
  {
    id: 'bloodhammer-sump',
    regionId: 'nordhalla',
    name: 'Bloodhammer Sump',
    type: 'settlement',
    description: 'A deep, steam-venting volcanic crater that serves as the industrial heart of Nordhalla. Surrounded by towering walls of ice, the geothermal heat is channeled into massive iron smelters where the Berserkers forge their runic cold-iron axes.',
    dangerLevel: 'medium',
    factions: ['Bloodhammer Clan', 'house-skalvyr'],
    connections: ['fjord-gate', 'hunger-glaciers'],
    wyrdCreatures: []
  },
  {
    id: 'fjord-gate',
    regionId: 'nordhalla',
    name: 'Fjord-Gate',
    type: 'settlement',
    description: 'A massive coastal harbor nestled inside a deep black fjord, guarded by towering stone doors that slide shut to block sea-storms. It is the primary trade hub of the north, linking Nordhalla to the Iceheart Sea.',
    dangerLevel: 'low',
    factions: ['house-skalvyr', 'Sea-Guard'],
    connections: ['frozen-archive', 'bloodhammer-sump'],
    wyrdCreatures: []
  },
  {
    id: 'hunger-glaciers',
    regionId: 'nordhalla',
    name: 'Hunger Glaciers',
    type: 'wilderness',
    description: 'A vast, shifting expanse of pure whiteout and deadly crevasses. The wind here carries a predatory howl, and travelers swear the ice moves intentionally, seeking to trap caravans and freeze them into permanent monuments.',
    dangerLevel: 'extreme',
    factions: ['Endurance Purists'],
    connections: ['bloodhammer-sump', 'rimors-hearth'],
    wyrdCreatures: ['Stel', 'Glacier Wyrm']
  },
  {
    id: 'rimors-hearth',
    regionId: 'nordhalla',
    name: "Rimor's Hearth",
    type: 'ruin',
    description: 'The volcanic ruins of a great mountain keep that was buried by a sudden glacier advance during the first century. A few steam vents still keep the black basalt ruins warm, attracting smugglers and freezing travelers seeking temporary shelter.',
    dangerLevel: 'high',
    factions: ['Fjords-Riders'],
    connections: ['frozen-archive', 'hunger-glaciers'],
    wyrdCreatures: ['Stel']
  },

  // =========================================================================
  // CRAGJAW PEAKS
  // =========================================================================
  {
    id: 'frostmaw-holdfast',
    regionId: 'cragjaw-peaks',
    name: 'Frostmaw Holdfast',
    type: 'city',
    description: 'The primary fortress of House Tesshan, built into a titanic cavern high on the mountain peaks. Protected from the eternal blizzards by heavy iron blast-gates, the city is a vertical network of stone arches, smelting galleries, and steam-ducts.',
    dangerLevel: 'low',
    factions: ['house-tesshan', 'Sump-Miners'],
    connections: ['the-spans', 'sump-galleries'],
    wyrdCreatures: []
  },
  {
    id: 'the-spans',
    regionId: 'cragjaw-peaks',
    name: 'The Spans',
    type: 'wilderness',
    description: 'A terrifying network of arching stone and bone bridges that link the jagged peaks above the blizzard-clouds. Many of the bridges are grown from the calcified skeletons of the Groven\'s willing ancestors, carrying travelers over bottomless, whiteout chasms.',
    dangerLevel: 'high',
    factions: ['The Groven', 'Tessen Scouts'],
    connections: ['frostmaw-holdfast', 'ancestor-gaps'],
    wyrdCreatures: ['Chasm-Stalker']
  },
  {
    id: 'ancestor-gaps',
    regionId: 'cragjaw-peaks',
    name: 'The Ancestor-Gaps',
    type: 'tomb',
    description: 'An ancient, vertical burial valley where the Groven grow their bone-spans. The rock walls are honeycombed with thousands of burial niches, and the air hums with the soft, deep vibration of ancestral bones reacting to the mountain winds.',
    dangerLevel: 'medium',
    factions: ['The Groven', 'Bone-Weavers'],
    connections: ['the-spans', 'lost-brood-vats'],
    wyrdCreatures: []
  },
  {
    id: 'sump-galleries',
    regionId: 'cragjaw-peaks',
    name: 'Sump Galleries',
    type: 'wilderness',
    description: 'The lower, toxic mining shafts beneath the mountain peaks, where Tessen miners wearing leather respirators extract sulfur and coal-iron. The air is warm but heavy with volcanic gases, and the shadows are home to scurrying, multi-legged horrors.',
    dangerLevel: 'high',
    factions: ['Sump-Miners', 'Fexrick Scavengers'],
    connections: ['frostmaw-holdfast', 'lost-brood-vats'],
    wyrdCreatures: ['Scrab', 'Toxic Spore-Horror']
  },
  {
    id: 'lost-brood-vats',
    regionId: 'cragjaw-peaks',
    name: 'Lost Brood Vats',
    type: 'ruin',
    description: 'A deep, subterranean vault containing ancient, cracked stone chambers once used by a forgotten race to cultivate biological life. The walls are covered in petrified egg-casings and strange, runic tubing, now guarded by highly aggressive, feral Wyrd-horrors.',
    dangerLevel: 'extreme',
    factions: ['Feral Fexrick'],
    connections: ['ancestor-gaps', 'sump-galleries'],
    wyrdCreatures: ['Scrab', 'Chasm-Stalker']
  },

  // =========================================================================
  // SUNDALE
  // =========================================================================
  {
    id: 'harath-vault',
    regionId: 'sundale',
    name: 'The Harath-Vault',
    type: 'ruin',
    description: 'The massive subterranean capital of the Emberth forge-clans in Sundale, carved radially into the volcanic throat of a dormant secondary caldera by the Sun-Speakers centuries before the sun\'s death. It serves as both sacred temple to the Solbrand and industrial forge-caldera where the Korr Emberth tend the eternal ember in holy silence.',
    dangerLevel: 'extreme',
    factions: ['Solvarn Martyrs', 'Emberth Watchers'],
    connections: ['great-forge', 'emberspire-caldera'],
    wyrdCreatures: ['Sun-Husk', 'Cinder-Fiend']
  },
  {
    id: 'great-forge',
    regionId: 'sundale',
    name: 'The Great Forge',
    type: 'city',
    description: 'A sprawling city of black iron and basalt built inside a volcanic cavern. Warmed by a branch of the world\'s magma-core, the Emberth forge-masters maintain the massive, geothermal bellows that power the world\'s largest smelting operations, producing refined cold-iron for all seven continents.',
    dangerLevel: 'low',
    factions: ['Emberth Forge-Clans', 'house-solvan'],
    connections: ['harath-vault', 'basalt-shyr'],
    wyrdCreatures: []
  },
  {
    id: 'emberspire-caldera',
    regionId: 'sundale',
    name: 'Emberspire Caldera',
    type: 'wilderness',
    description: 'The active, soot-choked volcanic mouth of Emberspire, where the world\'s heart volcano continuously vents ash and molten glass into the sky. The heat is oppressive, and the volcanic vents are home to ancient, fire-weaving elemental entities.',
    dangerLevel: 'extreme',
    factions: ['Pyrofiend Cults'],
    connections: ['harath-vault', 'cinder-badlands'],
    wyrdCreatures: ['Cinder-Fiend']
  },
  {
    id: 'basalt-shyr',
    regionId: 'sundale',
    name: 'Basalt Shyr',
    type: 'settlement',
    description: 'A trade outpost built atop a series of cooling basalt columns on the border between Sundale and the Gloom Forest. It serves as the primary trade gateway, exchanging refined metal and volcanic coal for Bryngloom fungal-lights and timber.',
    dangerLevel: 'medium',
    factions: ['house-solvan', 'Kessen Merchants'],
    connections: ['great-forge', 'cinder-badlands'],
    wyrdCreatures: []
  },
  {
    id: 'cinder-badlands',
    regionId: 'sundale',
    name: 'Cinder Badlands',
    type: 'wilderness',
    description: 'A vast, windswept desert of black obsidian sands and jagged glass spires. The wind here carries a toxic soot, and travelers must wear heavy leather wraps to protect their eyes from flying glass-shards and sudden volcanic fire-hazards.',
    dangerLevel: 'high',
    factions: ['Thrask Badland Rangers'],
    connections: ['emberspire-caldera', 'basalt-shyr'],
    wyrdCreatures: ['Sun-Husk']
  },

  // =========================================================================
  // ICEHEART SEA
  // =========================================================================
  {
    id: 'merrowport',
    regionId: 'iceheart-sea',
    name: 'Merrowport',
    type: 'city',
    description: 'A magnificent, floating city of wood and iron, anchored to a massive, warm subterranean volcanic seamount that keeps the surrounding waters perpetually unfrozen. Merrowport is the primary maritime trade hub, filled with Merryn captains, Neth brokers, and northern sailors.',
    dangerLevel: 'low',
    factions: ['house-mereval', 'Merryn Cartographers'],
    connections: ['ironjaw-port', 'gale-storm-shallows'],
    wyrdCreatures: []
  },
  {
    id: 'ironjaw-port',
    regionId: 'iceheart-sea',
    name: 'Ironjaw Port',
    type: 'settlement',
    description: 'A rough, cliffside harbor carved from black basalt walls on the southern shore. Walled in cold-iron blocks to withstand the crushing force of drifting icebergs, it is a haven for whalers, deep-sea miners, and smugglers.',
    dangerLevel: 'medium',
    factions: ['Merryn Whalers', 'Myrathil Scavengers'],
    connections: ['merrowport', 'treakous-rift'],
    wyrdCreatures: []
  },
  {
    id: 'treakous-rift',
    regionId: 'iceheart-sea',
    name: 'Treakous Oceanic Rift',
    type: 'wilderness',
    description: 'A bottomless, freezing ocean rift where the water runs black and silent beneath city-sized glaciers. The currents are violent and unpredictable, and deep-sea divers speak of ancient, multi-tentacled horrors sleeping in the sub-zero depths.',
    dangerLevel: 'extreme',
    factions: ['Myrathil Deep-Stalkers'],
    connections: ['ironjaw-port', 'first-shore'],
    wyrdCreatures: ['Abyssal Leviathan', 'Drowned Spume']
  },
  {
    id: 'first-shore',
    regionId: 'iceheart-sea',
    name: 'First Shore',
    type: 'ruin',
    description: 'The ancient coastal ruins where the human ancestors of House Mereval first landed eight centuries ago. The stone watchtowers are now encrusted with heavy ice and barnacles, their skeletal archers still standing guard over a frozen, silent harbor.',
    dangerLevel: 'high',
    factions: ['Drowned Revenants'],
    connections: ['treakous-rift', 'gale-storm-shallows'],
    wyrdCreatures: ['Drowned Spume']
  },
  {
    id: 'gale-storm-shallows',
    regionId: 'iceheart-sea',
    name: 'Gale-Storm Shallows',
    type: 'wilderness',
    description: 'A treacherous expanse of shallow reefs, jagged ice-crags, and perpetual storm-cycles. The winds here can tear sails to ribbons, and sailors must navigate by the soft glow of bioluminescent ocean moss and the ink-charts on their skin.',
    dangerLevel: 'high',
    factions: ['Merryn Pirates'],
    connections: ['merrowport', 'first-shore'],
    wyrdCreatures: ['Drowned Spume']
  },

  // =========================================================================
  // SUNDRIFT VALE
  // =========================================================================
  {
    id: 'synod-hold',
    regionId: 'sundrift-vale',
    name: 'The Synod-Hold',
    type: 'city',
    description: 'The vertical fortress of House Ordavan, built atop a series of sheer cliffs. The city serves as the administrative heart of the steppe, where the nomadic clans gather every summer to balance trade accounts and resolve border disputes.',
    dangerLevel: 'low',
    factions: ['house-ordavan', 'Synod Scribes'],
    connections: ['mound-camps', 'ancestor-mounds'],
    wyrdCreatures: []
  },
  {
    id: 'mound-camps',
    regionId: 'sundrift-vale',
    name: 'Mound-Camps',
    type: 'settlement',
    description: 'A sprawling, seasonal settlement of heavy wooly-yurts built around the base of the great grass mounds. Here, nomadic throat-singers trade wool, dried meat, and memory-beads for cold-iron tools and salt.',
    dangerLevel: 'medium',
    factions: ['Ordan Nomads', 'Astril Outcast Guilds'],
    connections: ['synod-hold', 'grass-tundra'],
    wyrdCreatures: []
  },
  {
    id: 'ancestor-mounds',
    regionId: 'sundrift-vale',
    name: 'Ancestor Mounds',
    type: 'tomb',
    description: 'A vast network of grass-covered earthen barrows containing the preserved remains of twenty generations of Ordan chieftains. The mounds emit a low, continuous hum that guides lost travelers through the starless steppe.',
    dangerLevel: 'medium',
    factions: ['Mound-Keepers', 'Astril Sylen'],
    connections: ['synod-hold', 'lien-stalked-grazes'],
    wyrdCreatures: []
  },
  {
    id: 'grass-tundra',
    regionId: 'sundrift-vale',
    name: 'Grass Tundra Steppe',
    type: 'wilderness',
    description: 'An endless, wind-swept plain of grey-green grass that stretches beneath a permanently dark sky. The steppe is home to massive, woolly herds of tundra beasts, but travelers must watch for the sudden, hunting shadows of the Hungry Child.',
    dangerLevel: 'high',
    factions: ['Ordan Hunters'],
    connections: ['mound-camps', 'lien-stalked-grazes'],
    wyrdCreatures: ['Hungry Child']
  },
  {
    id: 'lien-stalked-grazes',
    regionId: 'sundrift-vale',
    name: 'Lien-Stalked Grazes',
    type: 'wilderness',
    description: 'A unique region of the steppe where the grass is replaced by glowing, crystal-infused Lien-stalks. The soil here is highly fertile, but the crystalline grass makes grazing dangerous, attracting mutated beasts and crystal-skinned scavengers.',
    dangerLevel: 'extreme',
    factions: ['Astril Muren'],
    connections: ['ancestor-mounds', 'grass-tundra'],
    wyrdCreatures: ['Hungry Child']
  },

  // =========================================================================
  // BRYNGLOOM FOREST
  // =========================================================================
  {
    id: 'atropolis',
    regionId: 'bryngloom-forest',
    name: 'Atropolis',
    type: 'city',
    description: 'The magnificent, suspended canopy city of the Neth, constructed inside a cathedral-grove of living ironwoods coaxed into shape over a thousand years. A quiet city of branch-walkways, lawyers, pact-mages, and merchants who view survival as a binding agreement and write their records on glowing memory-glass.',
    dangerLevel: 'low',
    factions: ['Velun Pact-Lords', 'Neth Merchants'],
    connections: ['the-sunken-spire', 'root-veil-scriptorium'],
    wyrdCreatures: []
  },
  {
    id: 'the-sunken-spire',
    regionId: 'bryngloom-forest',
    name: 'The Sunken Spire',
    type: 'city',
    description: 'The inverted subterranean capital of the Vreken — a colossal cathedral and crypt carved four hundred feet down into a peat-stone sinkhole. Lit solely by the phosphorescence of entombed ancestors wrapped in fungal shrouds, it is a place of deep ancestor worship and silent, glowing graves.',
    dangerLevel: 'low',
    factions: ['Clean Vreken', 'Crypt-Council'],
    connections: ['atropolis', 'peat-bog-sinks'],
    wyrdCreatures: []
  },
  {
    id: 'peat-bog-sinks',
    regionId: 'bryngloom-forest',
    name: 'Peat-Bog Sinks',
    type: 'wilderness',
    description: 'A treacherous swamp of bottomless, preserving black peat and sinking moss. The water is thick and acidic, and the bogs are filled with the preserved, aware corpses of ancient debtors who rose when their contracts were broken by death.',
    dangerLevel: 'high',
    factions: ['Morren Peat-Cutters', 'Drun Outcasts'],
    connections: ['the-sunken-spire', 'over-shanty'],
    wyrdCreatures: ['Debt-Revenant', 'Cycle-Eater']
  },
  {
    id: 'root-veil-scriptorium',
    regionId: 'bryngloom-forest',
    name: 'Root-Veil Scriptorium',
    type: 'settlement',
    description: 'A quiet, hollow-root complex built where the ironwood roots descend into the deep bogs. Here, Velun Inscriptors carve historical genealogies onto compressed memory-glass tablets, directly under the watch of the Keeper of the Last Threshold.',
    dangerLevel: 'medium',
    factions: ['Velun Pact-Lords', 'Root-Veil Scholars'],
    connections: ['atropolis', 'over-shanty'],
    wyrdCreatures: []
  },
  {
    id: 'over-shanty',
    regionId: 'bryngloom-forest',
    name: 'Over-Shanty',
    type: 'settlement',
    description: 'A chaotic, hanging slum of rope-bridges and ramshackle wooden cabins built under Atropolis\'s main platforms. It is populated by sallow-skinned Morren peat-cutters and the leaden-skinned Drun outcasts who chose to burn their names from the First Contract.',
    dangerLevel: 'high',
    factions: ['Drun Outcasts', 'Morren Peat-Cutters'],
    connections: ['peat-bog-sinks', 'root-veil-scriptorium'],
    wyrdCreatures: ['Cycle-Eater']
  }
];

export const getZonesByRegion = (regionId) => {
  return ZONE_DATA.filter(zone => zone.regionId === regionId);
};

export const getZoneData = (zoneId) => {
  return ZONE_DATA.find(zone => zone.id === zoneId) || null;
};
