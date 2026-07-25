/**
 * Generates the ✦ micro-POI texture zones from the Seven Continents gazetteer.
 * IDEMPOTENT: strips any prior ✦ MICRO-POI block before re-inserting.
 * - Appends full zone objects to zoneData.js (LF)
 * - Auto-places map pins in locationCoordinates.js (CRLF), clustered near each
 *   parent zone — or near the region centroid if the parent has no coords yet.
 */
const fs = require('fs');
const ZONE_FILE = 'vtt-react/src/data/zoneData.js';
const COORD_FILE = 'vtt-react/src/data/locationCoordinates.js';

const WILD_PIN = {
  'frostwood-reach': 'tree', 'nordhalla': 'mountain', 'sundale': 'cave',
  'iceheart-sea': 'port', 'cragjaw-peaks': 'mountain',
  'sundrift-vale': 'custom', 'bryngloom-forest': 'tree',
};
const pinFor = (s) => s.pin || ({ settlement:'house', ruin:'ruin', tomb:'tomb', fortification:'fortress', wilderness: WILD_PIN[s.region] }[s.type] || 'custom');

const REGION_CENTROID = {
  'frostwood-reach':[3400,300], 'nordhalla':[600,250], 'sundale':[1800,1150],
  'iceheart-sea':[800,1500], 'cragjaw-peaks':[3600,1500],
  'sundrift-vale':[3300,2800], 'bryngloom-forest':[300,2700],
};
const clamp = (v,lo,hi)=>Math.max(lo,Math.min(hi,v));
const detectLE = (c)=> c.includes('\r\n') ? '\r\n' : '\n';

const SPECS = (function(){
  // Compact tuples: [id, region, type, parent, name, blurb]
  const T = [
    // ===== FROSTWOOD REACH — The Ironheart Vales =====
    ['pebble-scribe-hamlet','frostwood-reach','settlement','greymark-keep','Pebble-Scribe Hamlet','A clutch of peat-stone huts where junior scribes practice genealogies on slate before they earn real parchment. Tallow-candle smoke hangs in the fog.'],
    ['tallow-candle-wayhouse','frostwood-reach','settlement','meadowglen-crossing','Tallow-Candle Wayhouse','A coaching inn on the silt-road to Sundale. Travelers barter diary-keys for a warm bunk and a chained journal to record the day before the fog takes it.'],
    ['hollow-stump-camp','frostwood-reach','wilderness','ironwood-heart','Hollow-Stump Camp',"A woodcutters' camp inside a fallen petrified ironwood whose hollow trunk sleeps a dozen. Sap-smugglers work the deep groves from here."],
    ['bog-cranberry-stands','frostwood-reach','wilderness','the-shallows','Bog-Cranberry Stands','Mist-bed gardens of tart cranberry used for pemmican. Fog-hares breed thick here; Mist-Sentinels collect a pelt-tithe.'],
    ['quillgate-toll-village','frostwood-reach','settlement','greymark-keep','Quillgate Toll-Village',"A Palisade checkpoint-village grown around the eastern toll-gate. Every traveler's journal is verified; the undocumented are turned back into the fog."],
    ['moss-wax-chandlers','frostwood-reach','settlement','scribes-tower',"Moss-Wax Chandlers' Cluster","A craft-hamlet of candle-makers who render fog-moss into Moss-Wax candles that burn blue-green and resist the damp. Their wares are the Reach's only reliable light."],
    ['heartwood-sap-camp','frostwood-reach','wilderness','ironwood-heart','Heartwood Sap-Camp','A black-market camp where smugglers tap the warm sap of the glowing white tree. Cartel enforcers and Briaran watchers both patrol the approaches.'],
    ['chained-journal-inn','frostwood-reach','settlement','meadowglen-crossing','The Chained-Journal Coaching-Inn','Inn where every table bears a chained journal; patrons must log their lineage nightly. Diary-key chits serve as currency.'],
    ['quillgate-crossroads','frostwood-reach','wilderness','greymark-keep','The Quillgate Crossroads','A lantern-posted fork where the Greymark silt-road meets the Ironwood Palisade track. Mist-Sentinel lanterns mark the turns.'],
    ['hollow-peat-pond','frostwood-reach','wilderness','the-shallows','Hollow-Peat Pond','A still black pond ringed by peat; locals say it has no bottom and that the fog here is thicker than anywhere in the Vales.'],
    ['amber-lamp-mile','frostwood-reach','wilderness','skalds-landing','The Amber-Lamp Mile','A stretch of northern-river trade road lit by amber Moss-Wax lamps a mile apart. Skald river-barges tie up at each.'],
    ['briar-thorn-tangle','frostwood-reach','wilderness','greythorn-copse','Briar-Thorn Tangle','A dense thorn-thicket masking a hidden Smooth-Skinned Briaran enclave. The thorns lie flat for those who know the old oaths.'],

    // ===== FROSTWOOD REACH — The Frostfang Wastes =====
    ['frostwatch-ruin','frostwood-reach','ruin','grevtholm','Frostwatch Hold','A ruined Northwatch post on the tundra edge, partly re-manned. Signal-fires burn here when Jutul are sighted in the whiteout.'],
    ['stonespeakers-camp','frostwood-reach','settlement','the-stone-circles',"Stonespeakers' Camp",'A ring of hide-tents around the secondary monolith-circle, tended by Skald expatriates preserving pre-Binding rune-lore the Thalreth deny.'],
    ['eight-week-melt-huts','frostwood-reach','settlement','iron-lake','Eight-Week-Melt Huts',"Fishing huts usable only during Iron Lake's brief summer melt. Locals say drowned Jutul-maidens surface then."],
    ['mammoth-bone-camp','frostwood-reach','settlement','frostfang-wastes',"Mammoth-Bone Trappers' Camp",'A frontier camp built from mammoth rib-cages; Stone-Tribal trappers work the deep wastes from here.'],
    ['cold-iron-waystation','frostwood-reach','settlement','grevtholm','Cold-Iron Waystation','The last warmed outpost before the deep Frostfang; an iron-stove kept lit by a single hermit-garrison.'],
    ['wind-teeth','frostwood-reach','wilderness','frostfang-wastes','The Wind-Teeth','A line of granite spires sculpted by wind into jagged teeth. The gale through them can strip hide.'],
    ['jutulstone','frostwood-reach','wilderness','frostfang-wastes','The Jutulstone','A lone carved boulder, too high for human hands, bearing marks no Stone-Speaker will translate. Jutul raiders supposedly gather here.'],
    ['eight-week-melt-ponds','frostwood-reach','wilderness','iron-lake','Eight-Week Melt-Ponds','Shallow pools that exist only in high summer, mirror-still, reflecting a sky the fog usually hides.'],

    // ===== FROSTWOOD REACH — The Drowned Fens =====
    ['floating-stilt-hamlet','frostwood-reach','settlement','wraithfen','The Floating-Stilt Hamlet',"A Forgotten camp built on stilt-rafts that drift with the fen's overnight shifts. No journal, no ledger, no law."],
    ['wisp-willow-camp','frostwood-reach','settlement','the-shifting-fen','Wisp-Willow Camp','An outcast camp under bioluminescent willows; Mote-carrying Fractured Mimir trade salvaged masks here.'],
    ['thorn-refuge-copse','frostwood-reach','wilderness','mistbarrow','Thorn-Refuge Copse','A hidden Unshorn Briaran refuge among thorn-trees, grown over a pre-Thalreth cairn.'],
    ['lanternfen-pools','frostwood-reach','wilderness','wraithfen','Lanternfen Pools','Warm pools lit by floating Moss-Wax lanterns the Forgotten tend; their light keeps the Gambrel at bay.'],
    ['lost-name-pond','frostwood-reach','wilderness','the-shifting-fen','The Lost-Name Pond','A pond no local can name; everyone who learns the name forgets it within a day. The water is perfectly still.'],

    // ===== NORDHALLA — The Glacier-Heart =====
    ['frost-tithe-cradle-camp','nordhalla','settlement','frozen-archive','Frost-Tithe Cradle-Camp',"A grief-camp of Ice-Cradles where Rime-Born mothers birth under the open sky, paying warmth to Keth-Amar's debt."],
    ['ravencall-eyrie','nordhalla','settlement','the-still-crag','Ravencall Eyrie','A Corvani cliff-settlement of rope-ladders and murmuring ravens; messengers depart reading fate in flight.'],
    ['glacier-song-hermitage','nordhalla','settlement','hunger-glaciers','Glacier-Song Hermitage','A lone Rune Keeper outpost where the audible moan of the glacier is transcribed as augury.'],
    ['mute-hearth-ruin','nordhalla','ruin','rimors-hearth','The Mute-Hearth','A ruined keep stubbornly warm from a single surviving steam vent; trappers shelter here but never speak its name.'],
    ['cracked-cyst','nordhalla','wilderness','skadis-col','The Cracked-Cyst',"A glacier split where blue light pulses beneath the ice — the Ice-Crown Monolith's distant glow."],
    ['breathless-stair','nordhalla','wilderness','the-still-crag','The Breathless Stair','A wind-scoured stair cut into the cliff to the Still Crag; Rime-Born climb it for memory-freezing rites.'],
    ['jaarn-tand-cairn-line','nordhalla','wilderness','frosthold-citadel',"Járn-Tand's Cairn-Line","A line of royal cairns marking the Sunder-Wall's taxed passage; wardens check passage-rights here."],

    // ===== NORDHALLA — The Iron-Fjord Coast =====
    ['hearth-glow-tavern-cluster','nordhalla','settlement','fjord-gate','Hearth-Glow Tavern-Cluster','Taverns built over steaming vents where patrons grip frozen iron bars to prove lineage. Frost-mead flows freely.'],
    ['whale-oil-row','nordhalla','settlement','bloodhammer-sump','Whale-Oil Row','Syndicate warehouse-row stacked with whale-oil casks; ironclads load harpoon-ammunition here.'],
    ['cod-drying-racks','nordhalla','settlement','eldonholm','Cod-Drying Racks of Eldonholm','The fish-curing heart of pure-blood Skald Eldonholm; racks line every cliff.'],
    ['frost-mead-cellars','nordhalla','settlement','bloodhammer-sump','Frost-Mead Cellars','A geothermal cave-village brewing frost-mead; copper chits and coal-receipts trade hands.'],
    ['iron-ore-quay','nordhalla','settlement','fjord-gate','Iron-Ore Quay','The Syndicate quay where iron-ore barges and whale-oil tankers load for the Iceheart run.'],
    ['black-firth','nordhalla','wilderness','fjord-gate','The Black Firth','An obsidian-cliffed inlet — the naval route for iron and oil, soot-streaked from ironclad funnels.'],
    ['vargtower-beacon','nordhalla','wilderness','vargtor','Vargtower Beacon',"The signal-fire atop Vargtor's basalt tor; wolves gather at its base each dusk."],

    // ===== NORDHALLA — The Ember-Tide Coast =====
    ['three-hot-springs','nordhalla','settlement','xardins-hearth','The Three-Hot-Springs','Neutral geothermal pools where Skald, Merryn, and Frostbound share water and an uneasy truce.'],
    ['ash-tide-fishing-village','nordhalla','settlement','xardins-hearth','Ash-Tide Fishing Village','A black-sand hamlet living off the warm current; boats launch through ash-surf.'],
    ['outlaws-freshet','nordhalla','settlement','southern-shore-smugglers-cove',"Outlaw's Freshet","A Fredløse camp at a freshwater spring behind the smuggler's cove."],
    ['drowned-longship-reef','nordhalla','wilderness','southern-shore-smugglers-cove','The Drowned-Longship Reef','A reef of wrecked Skald longships; Skrei are said to drag divers down here.'],
    ['ember-tide-way','nordhalla','wilderness','xardins-hearth','Ember-Tide Way','The volcanic coast-road linking the southern ports to the coves; steam-vents warm the path.'],

    // ===== SUNDALE — The Ash-Heart =====
    ['cinderbloom-purification-camp','sundale','settlement','cinderbloom-crater','Cinderbloom Purification Camp','Martyr pilgrims undergo the Vow at the red-lichen crater; many do not walk back.'],
    ['sulfur-prospect-camp','sundale','settlement','emberspire-caldera','Sulfur-Prospect Camp','A Sulfur Cartel outpost where prospectors chip raw sulfur and pray between shifts.'],
    ['pyrofiend-conventicle','sundale','ruin','the-star-caves','Pyrofiend Conventicle',"A hidden obsidian shrine in the lava-tubes where Scathrach's kindling is swallowed."],
    ['cinderhoodoo-spires','sundale','wilderness','cinder-badlands','Cinderhoodoo Spires','Fire-scorched rock spires melted into face-shapes; they moan when the wind shifts.'],
    ['glassed-dunes','sundale','wilderness','emberspire-caldera','The Glassed Dunes','Black volcanic glass dunes; footing is razor-sharp and the Wyrd bleeds thickest here.'],
    ['spinstones-boundary','sundale','wilderness','spinstones-columns','The Spinstones Boundary',"The ring of basalt columns carved with binding-runes marking the Ash-Heart's edge."],

    // ===== SUNDALE — The Ashen Fringe =====
    ['ash-dweller-shanty','sundale','settlement','harath-vault','Ash-Dweller Shanty',"Toxic surface shanties of Thrask miners and Solvarn refugees; 'Ashen Throat' lung-rot is universal."],
    ['cinder-brew-distillery','sundale','settlement','great-forge','Cinder-Brew Distillery Cluster','Stills brewing cinder-brew from soot-tolerant tubers; the only cheap drink in the fringe.'],
    ['martyr-brigade-work-camp','sundale','settlement','the-ashen-escarpment','Martyr-Brigade Work-Camp','A conscripted-youth labor camp mining obsidian in active rifts; casualties are routine.'],
    ['obsidian-citadel-tollgate','sundale','fortification','the-ashen-escarpment','Obsidian Citadel Tollgate','One of the Dawn Vigil fortress-chain blocking refugees; signal-fires burn atop each.'],
    ['sulfur-sump-pits','sundale','wilderness','vulkars-karst','Sulfur-Sump Pits','Steaming acidic pits where the Cartel extracts sulfur; the fumes etch bronze.'],
    ['solvan-sepulchre','sundale','ruin','solvans-stand','The Solvan-Sepulchre','A royal ruin on the edge of the dying capital; Solvan heirs are quietly interred here.'],

    // ===== SUNDALE — The Green Rim =====
    ['hot-spring-terrace-village','sundale','settlement','meadowglen','Hot-Spring Terrace Village',"A stepped farm-village warmed by the meadow's geothermal network; the breadbasket of Sundale."],
    ['oasis-grove-farmstead','sundale','settlement','breezebough','Oasis-Grove Farmstead','A sheltered-valley hamlet growing fern-bulbs and vine-fern in volcanic soil.'],
    ['salt-pans-fishing-camp','sundale','settlement','basalt-shyr','Salt-Pans Fishing Camp','Salt-panners and fishers working the cooling basalt shore; trade-outpost traffic is constant.'],
    ['wharf-dealers-row','sundale','settlement','ember-lagoon',"Wharf-Dealer's Row",'The boardwalk market of Ember Lagoon where Merryn captains and Dawn Vigil factors bargain.'],
    ['sun-shrine-mile','sundale','wilderness','meadowglen','The Sun-Shrine Mile','A line of small disc-altars along the meadow road where Solvarn still pray at dawn.'],
    ['cinder-strait','sundale','wilderness','ember-lagoon','The Cinder Strait','The warm sea-route from Ember Lagoon to the Iceheart; the only safe water passage to Sundale.'],

    // ===== SUNDALE — The Glitterwood =====
    ['hermits-hidden-valley','sundale','settlement','the-glittering-forest',"Hermit's Hidden Valley",'A concealed valley camp of Dawn-Vigil defectors; they tend a crown-of-thorns shrine.'],
    ['smooth-skinned-enclave','sundale','settlement','glitterwood-heart','The Smooth-Skinned Enclave','A village of old Solvan noble exiles living in longhouses grown into living trees.'],
    ['crystal-stag-glade','sundale','wilderness','the-glittering-forest','Crystal-Stag Glade','A clearing where the radiant Crystal-Stag is seen at dusk; the Risen consider it sacred.'],
    ['isthmus-neck','sundale','wilderness','the-glittering-forest','The Isthmus Neck','The narrow land-bridge connecting the Glitterwood peninsula to the mainland; the Dawn Vigil once blockaded it.'],
    ['star-crystal-pond','sundale','wilderness','glitterwood-heart',"Star-Crystal Pond","A pond of crystal-clear water over crystal-soil; hermits bathe here to feel Sol's warmth."],

    // ===== ICEHEART SEA — The Merrow Archipelago =====
    ['upper-deck-quarter','iceheart-sea','settlement','merrowport','Upper-Deck Quarter','The wealthy topside district of lashed galleons; heated cabins, merchants, pact-clerks.'],
    ['bilge-berths','iceheart-sea','settlement','merrowport','The Bilge-Berths','The water-logged lower decks where pressed labor and coal-shovelers sleep in coal-dust.'],
    ['ink-tattoo-chart-makers','iceheart-sea','settlement','merrowport',"Ink-Tattoo Chart-Makers' Hut",'Where Merryn tattoo their voyage-contracts onto skin — the only documents the Drift-Council enforces.'],
    ['whale-oil-derrick-camp','iceheart-sea','settlement','blackteeth-isle','Whale-Oil Derrick Camp','A volcanic-island camp rendering blubber; explosive harpoons are forged here.'],
    ['coral-fishing-hamlet','iceheart-sea','settlement','spindrift-lagoon','Coral-Grown Fishing Hamlet','A bioluminescent hamlet of Breakers-Born Myrathil fishing the warm coral inlet.'],
    ['press-warrant-tavern','iceheart-sea','settlement','the-lucky-anchor','Press-Warrant Tavern-Cluster','Floating taverns on lashed hulls where Press-Warrants sweep the undocumented into naval servitude.'],
    ['wave-kept-mooring','iceheart-sea','wilderness','merrowport','The Wave-Kept Mooring',"The Admiral's flagship's perpetual-station mooring; it never docks, only signals."],

    // ===== ICEHEART SEA — The Shard-Window Storm-Belt =====
    ['stormspeakers-rim-shrine','iceheart-sea','settlement','shard-window',"Stormspeaker's Rim-Shrine",'An animist camp on the vortex rim tending a shrine to the binding-storm.'],
    ['drowned-fleet-graveyard','iceheart-sea','wilderness','gale-storm-shallows','The Drowned-Fleet Graveyard','A shallows of wrecked hulls; Draugr Helmsman crew the half-sunken ships.'],
    ['myriad-haunt','iceheart-sea','wilderness','shard-window','Myriad-Haunt','A cluster of wraith-storm-spirits circling the Shard-Window; the Myriad scream in chorus.'],
    ['eye-crossing','iceheart-sea','wilderness','gale-storm-shallows','The Eye-Crossing','A briefly-calm route through the storm-belt used by smugglers between windows of clearing.'],

    // ===== ICEHEART SEA — The Deepwell Trench =====
    ['pressure-forge-caverns','iceheart-sea','wilderness','deepwell-archipelago','Pressure-Forge Caverns','Deep-Born Myrathil abyssal forge-cities carved into basalt; surface-folk cannot reach them.'],
    ['biolum-reef-mile','iceheart-sea','wilderness','deepwell-archipelago','Biolum Reef-Mile','A mile of glowing bioluminescent coral-reef under the ice-islands; the Deep-Born herd here.'],
    ['leviathan-coil','iceheart-sea','wilderness','treakous-rift','The Leviathan Coil','The Treakous Rift site where the Abyssal Leviathan wraps the Depth-Breath Monolith.'],
    ['breakers-born-liaison-dock','iceheart-sea','settlement','the-shivering-bight','Breakers-Born Liaison Dock','The only surface-deep interface; Shore Myrathil ferry goods to the Deep-Born below.'],

    // ===== ICEHEART SEA — The Frozen-Flows =====
    ['icewhisper-huts','iceheart-sea','settlement','first-shore','Icewhisper Coven Huts','A circle of Berg-Witch huts on the pilgrimage ice; they read fate in the floe-cracks.'],
    ['whaler-oil-camp','iceheart-sea','settlement','berg-of-the-frozen-flame',"Whaler-Oil Camp","A seasonal whalers' camp at the burning iceberg; oil-rendering fires never go out."],
    ['frozen-rune-ruins','iceheart-sea','ruin','first-shore','The Frozen-Rune Ruins',"Pre-Mereval ruins protruding from First Shore's ice; the runes predate the Binding."],
    ['crack-lane','iceheart-sea','wilderness','whaleroot-floe','The Crack-Lane','A navigable fissure through the floes; the only lane deep enough for shallow-hulled boats.'],

    // ===== ICEHEART SEA — The Saryreach Isles =====
    ['letter-of-marque-anchorage','iceheart-sea','settlement','saryreach-castle','Letter-of-Marque Anchorage',"The Pirate-Queen's licensed privateer anchorage beneath the abandoned fortress."],
    ['smugglers-hidden-cove','iceheart-sea','settlement','saryreach-castle',"Smuggler's Hidden Cove",'A black-market cove behind the sea-stacks; goods move without Board of Trade seals.'],
    ['exile-colony-stack','iceheart-sea','settlement','blackteeth-skerry','Exile-Colony Stack','A skerry colony of exiled Neth and Tide-Speakers; they farm kelp and avoid oaths.'],
    ['mer-court-grotto','iceheart-sea','wilderness','tide-court-cove','The Mer-Court Grotto','A tidal grotto court of the Mer-Court emissaries; it floods twice daily on schedule.'],

    // ===== ICEHEART SEA — The Saltmaw Estuary =====
    ['free-port-stilt-wharves','iceheart-sea','settlement','the-saltmaw-estuary','Free-Port Stilt-Wharves','A lawless stilt-village of smugglers and exiles where no Sea-Pass is checked.'],
    ['half-salt-bog-hamlet','iceheart-sea','settlement','the-saltmaw-estuary','Half-Salt Bog Hamlet','A brackish-water hamlet of Morren peat-cutters and Vreken pool-dwellers.'],
    ['mawed-sea-shrine','iceheart-sea','ruin','the-saltmaw-estuary','The Mawed-Sea Shrine','A shrine to a Forgotten-Cult of the Mawed Sea; offerings vanish into the brackish mud.'],

    // ===== CRAGJAW PEAKS — The Frostmaw Massif Range =====
    ['forge-of-alaric','cragjaw-peaks','settlement','frostmaw-holdfast','The Forge of Alaric',"The Warden order's first anvil where new Wardens drive their first chain-hook, supervised by Drall smiths."],
    ['frostmaw-chimney-galleries','cragjaw-peaks','settlement','frostmaw-holdfast','Frostmaw Chimney-Galleries',"Industrial high-pressure siphon-dwellings clinging to the volcanic plug's vents."],
    ['mita-terrace-camp','cragjaw-peaks','settlement','frostmaw-massif',"The Mit'a Terrace-Camp",'Conscript labor-camp working the cliff-hanging andenes (terraces) that feed the keeps.'],
    ['skirmours-bone-heap','cragjaw-peaks','wilderness','skirmours-crag',"Skirmour's Bone-Heap","A moraine of Jutul and Groven dead at the Jutul-king's sacred peak; none pass unchallenged."],
    ['subterranean-vault-mouth','cragjaw-peaks','wilderness','frostmaw-holdfast','The Subterranean Vault-Mouth','A sealed descent beneath Frostmaw to the chamber where snow has never fallen — a Monolith rests there.'],

    // ===== CRAGJAW PEAKS — The Gorge-Web =====
    ['ithran-toll-post-village','cragjaw-peaks','settlement','the-spans','Ithran Toll-Post Village','A bridge-top toll-village of fine-scaled Groven diplomats; every crossing pays in kind or coin.'],
    ['cliff-andene-terrace','cragjaw-peaks','settlement','deepchasm-keep','Cliff-Andene Hanging-Terrace','A mid-altitude terrace-camp of Tessen soldiers and Murmur-Blooded bridge-tenders.'],
    ['murmur-blood-hut','cragjaw-peaks','settlement','the-spans','Murmur-Blood Bridge-Tender Hut','A mixed-caste outcast outpost tending the bone-spans; they are legally invisible.'],
    ['the-broken-span','cragjaw-peaks','ruin','the-great-gorge','The Broken-Span','A ruined bone-bridge over the Great Gorge; its collapse isolated two keeps for a generation.'],
    ['knors-wind-throat','cragjaw-peaks','wilderness','alley-of-knor',"Knor's Wind-Throat",'A howling wind-narrow in the Alley of Knor; the blow can lift a Groven from their feet.'],

    // ===== CRAGJAW PEAKS — The Iron Sumps =====
    ['scrap-sump','cragjaw-peaks','settlement','gearworks-gulch','The Scrap-Sump','The Drall clan-free capital beneath the holdfast floor; salvage, ingenuity, and spite.'],
    ['blue-bite-tunnels','cragjaw-peaks','settlement','sump-galleries','Blue-Bite Tunnels',"An unheated chasm-ward of frostbite-rot ('Blue Bite') sufferers; Chasm-Dwellers sift runic waste."],
    ['reticulation-vault-camp','cragjaw-peaks','settlement','iron-ravine','Reticulation Vault-Camp','A scrap-camp at unmapped pipe-junctions; Drall tinkerers salvage clockwork here.'],
    ['deep-alchemist-shaft','cragjaw-peaks','ruin','lost-brood-vats','The Deep-Alchemist Shaft','A sealed service-shaft to the Lost Brood Vats; the 800-yr Feral Brood may stir below.'],
    ['toxic-spore-hollow','cragjaw-peaks','wilderness','sump-galleries','Toxic-Spore Hollow','A fungal pocket in the lower sumps; the Spore-Horror nests in the warm dark.'],
    ['steam-pipe-grid','cragjaw-peaks','wilderness','gearworks-gulch','The Steam-Pipe Grid','The labyrinth of geothermal pipes that heat the high keeps; the Steam-Line Cartel bleeds them.'],

    // ===== SUNDRIFT VALE — The Endless Steppe =====
    ['wool-yurt-circle','sundrift-vale','settlement','mound-camps','Wool-Yurt Circle','A seasonal following-camp of the mare-herds; felt-and-bone yurts strike and raise with the migration.'],
    ['mare-herd-camp','sundrift-vale','settlement','kumis-downs','Mare-Herd Following-Camp','A Mounted-clan camp tracking the Ordan mares across the Downs; Steppe-Staves record pasture-rights.'],
    ['kumis-ferment-camp','sundrift-vale','settlement','kumis-downs','Kumis-Ferment Camp',"A camp of mares'-milk fermenters; the kumis-vats never stop."],
    ['unmounted-baggage-camp','sundrift-vale','settlement','mound-camps','Unmounted Baggage-Camp',"The walking underclass's camp; they carry the yurts of the Mounted and are regarded as property."],
    ['throat-song-hermit-hut','sundrift-vale','settlement','the-long-steppe','Throat-Song Hermit-Hut',"A lone Sky-Singer's hut where outlawed constellation-singing is still practiced in secret."],
    ['steppe-stave-cairn','sundrift-vale','wilderness','grass-tundra','Steppe-Stave Cairn','A bone tally-stick cairn marking a migration waypoint; the notches encode clan and count.'],
    ['dry-aquifer-beds','sundrift-vale','wilderness','lien-stalked-grazes','The Dry-Aquifer Beds','Cracked beds where Thermal Bores drained the water table; sulfur-sinkholes open without warning.'],

    // ===== SUNDRIFT VALE — The Ancestor Wolds =====
    ['mound-keepers-village','sundrift-vale','settlement','ancestor-mounds',"Mound-Keepers' Village","A solemn village tending the humming barrows; each keeper memorizes one mound's song."],
    ['echo-singer-death-camp','sundrift-vale','settlement','novas-heath','Echo-Singer Death-Camp','Where old Sky-Singers come to die at the crystallized-impact circle; their last songs are recorded.'],
    ['cairn-checkpoint-garrison','sundrift-vale','settlement','the-moundwatch','Cairn-Checkpoint Garrison','An Ordan March-Warden post enforcing the Herd-Tithe at the cairn-line.'],
    ['pilgrim-knoll','sundrift-vale','wilderness','ancestor-mounds','Pilgrim-Knoll',"A barrow pilgrimage site where Astril come to hear Lumia's echo in the hum."],
    ['mound-eater-scar','sundrift-vale','ruin','ancestor-mounds','The Mound-Eater Scar','A barrow silenced permanently by the Mound-Eater; no hum, no echo — a wound in the Wolds.'],

    // ===== SUNDRIFT VALE — The Starfall Basin =====
    ['crystal-lattice-spire-dwelling','sundrift-vale','settlement','synod-hold','Crystal-Lattice Spire-Dwelling','An Astril spire-residence in the Synod Hold where constellation-patterns glow on the walls.'],
    ['qilin-grazing-ground','sundrift-vale','wilderness','starfall-vale','Qilin Grazing-Ground',"A crystal-shard meadow where the single-horned Qilin are sighted at the crater's edge."],
    ['lien-crystal-beacon','sundrift-vale','wilderness','starfall-vale','Lien-Crystal Beacon','A standing shard of trapped starlight used as a navigation beacon across the starless steppe.'],
    ['unlit-veil-judgment-seat','sundrift-vale','ruin','synod-hold','The Unlit-Veil Judgment-Seat',"A hidden chamber beneath Synod Hold where the Unlit Veil's shadow-council actually rules."],

    // ===== SUNDRIFT VALE — The Bogpost March =====
    ['peat-edge-ford-hamlet','sundrift-vale','settlement','morrens-bogpost','Peat-Edge Ford Hamlet','A hamlet at the marshy ford where Ordan horse-traders and Morren peat-cutters meet and intermarry.'],
    ['thermal-bore-sinkhole','sundrift-vale','wilderness','morrens-bogpost','Thermal-Bore Sinkhole','A toxic sulfur-sinkhole opened by forced Fexric boring; it swallows migrating beasts.'],
    ['neth-scribe-outpost','sundrift-vale','settlement','morrens-bogpost','Neth-Scribe Outpost',"A small Bryngloom Neth trade-annex recording the Bogpost's cross-border debts."],

    // ===== SUNDRIFT VALE — Blizzard Bluff =====
    ['sentry-yurt-post','sundrift-vale','settlement','blizzard-bluff','Sentry-Yurt Post','A wind-blasted Ordan frontier post watching the Snow-Tooth passes for Frostwood patrols.'],
    ['wind-neck-pass','sundrift-vale','wilderness','blizzard-bluff','The Wind-Neck','The lowest pass through Blizzard Bluff; the only route foot-traffic can cross in winter.'],
    ['frostwood-meeting-stones','sundrift-vale','wilderness','blizzard-bluff','Frostwood-Thalren Meeting-Stones','Cairns where Frostwood and Sundrift patrols meet to exchange weather-reports and warnings.'],

    // ===== BRYNGLOOM FOREST — The Canopy-Heart =====
    ['heart-vault-archive-hamlet','bryngloom-forest','settlement','atropolis','Heart-Vault Archive-Hamlet','A pact-clerk hamlet around the tree holding the First Contract; memory-glass tablets are inscribed here.'],
    ['memory-glass-workshop','bryngloom-forest','settlement','atropolis','Memory-Glass Tablet-Workshop','Where artisans render memory into glass tablets; the smoke of it drifts through the canopy.'],
    ['branch-walkway-dwelling','bryngloom-forest','settlement','atropolis','Branch-Walkway Dwelling','A suspended neighborhood of living-branch walkways and ghost-silk bridges high above the bog.'],
    ['peat-press-engine-camp','bryngloom-forest','settlement','peat-bog-sinks','Peat-Press Engine-Camp','A hated industrial camp running the steam presses that drain the swamp and rot the ironwood roots.'],
    ['tapestry-ward-boarding-house','bryngloom-forest','settlement','over-shanty','Tapestry-Ward Boarding-House','A state house where Mimir and frontier children are stripped of animism and trained in written logic.'],
    ['dangling-keel-tavern','bryngloom-forest','settlement','over-shanty','The Dangling Keel Tavern','A rope-bridge tavern hanging over the deepest bog; the Cult of Forgotten Shadow was founded in its cellars.'],

    // ===== BRYNGLOOM FOREST — The Sunken Basin =====
    ['lantern-eye-way','bryngloom-forest','settlement','the-sunken-spire','Lantern-Eye Way','A lane down into the Spire lit by the rust-amber lantern-eyes of Clean Vreken residents.'],
    ['marked-vrekin-rim-slum','bryngloom-forest','settlement','the-sunken-spire','The Marked-Vrekin Rim-Slum','The segregated silver-eyed Marked Vreken slum around the sinkhole upper rim.'],
    ['veil-speaker-chant-hall','bryngloom-forest','settlement','the-sunken-spire','Veil-Speaker Chant-Hall','A fungal-shroud hall where Vreken chant to the ancestors wrapped in living mycelium.'],
    ['pale-moonlight-floor','bryngloom-forest','wilderness','the-sunken-spire','The Pale-Moonlight Floor',"The sinkhole floor glowing with Aedris's eternal pale light; pilgrims descend in silence."],

    // ===== BRYNGLOOM FOREST — The Peat-Wastes =====
    ['peat-press-forge-camp','bryngloom-forest','settlement','widows-quagmire','Peat-Press Forge-Camp','A Debt-Revenant chain-gang camp squeezing oil from the bog under Morrath Marshal whips.'],
    ['rot-fume-hut','bryngloom-forest','settlement','black-fen',"Rot-Fume Hut","A Morren peat-cutter's hut breathing toxic rot-fumes; the Defaulted underclass lives here."],
    ['final-clause-marker','bryngloom-forest','wilderness','black-fen','The Final-Clause Marker',"The boundary stone of Black Fen, beyond which Morvane's contract-law has no jurisdiction."],
    ['contract-dumping-grounds','bryngloom-forest','wilderness','widows-quagmire','The Contract-Dumping Grounds','Where broken contracts — and those who broke them — are disposed of into the acid mud.'],

    // ===== BRYNGLOOM FOREST — The Western Bayous =====
    ['probability-loom-house','bryngloom-forest','settlement','aran-glen','Probability-Loom House',"A Kessen Neth village-house of living-wood looms where weavers read the forest's probability-web."],
    ['fae-contract-bark-grove','bryngloom-forest','wilderness','vel-keth-bayou','Fae-Contract Bark-Grove','A grove of ironwoods carved with pre-Neth fae-contracts in their bark; older than the Registry.'],
    ['memory-glass-banks','bryngloom-forest','wilderness','vel-keth-bayou','The Memory-Glass Banks','Memory-glass deposits lining the uphill-flowing bayou; smugglers mine them without permit.'],
    ['swamp-singer-purge-site','bryngloom-forest','ruin','covenbane-stronghold','Swamp-Singer Purge-Site','A ruin where the Inquisition rooted out Swamp-Song animists; the molds here are silent.'],
    ['toll-dike-gate','bryngloom-forest','fortification','vel-keth-bayou','Toll-Dike Gate','A living-ironwood toll-gate charging peat-debt for passage through the bayou channels.'],

    // ===== BRYNGLOOM FOREST — The Great Mere =====
    ['merryn-barge-port','bryngloom-forest','settlement','the-great-mere',"Merryn Barge-Port","A lashed-houseboat port on the Mere's shore; Merryn lake-traders moor here by season."],
    ['vreken-shrine-islet','bryngloom-forest','settlement','monks-of-the-sunken-stone','Vreken Shrine-Islet','A forbidden islet holding a Vreken fungal shrine; only the moon-tide reveals the path.'],
    ['forbidden-isle','bryngloom-forest','wilderness','the-great-mere','The Forbidden Isle','An unmapped Mere island where the most binding oaths are sealed — and broken.'],
    ['moon-tide-shore','bryngloom-forest','wilderness','the-great-mere','Moon-Tide Shore','The shore that shifts with the moon-tide; what is dry land at dawn may be lakebed by dusk.'],

    // ===== BRYNGLOOM FOREST — The Root-Veil =====
    ['first-contract-signing-hollow','bryngloom-forest','ruin','root-veil-scriptorium','The First-Contract Signing-Hollow','The deep hollow where the Neth ancestors signed the First Contract with Morvane; still radiates authority.'],
    ['threshold-shrine-hermitage','bryngloom-forest','settlement','root-veil-scriptorium','Threshold-Shrine Hermitage',"A monastic hermitage of Hallowed Neth bound as Morvane's spirit-conduits over a deep sinkhole."],
    ['hush-quiet-zone','bryngloom-forest','wilderness','root-veil-scriptorium','The Hush-Quiet Zone','A stretch of root-tunnel where no birds, no wind, no sound persists; the Root-Veil breathes here.'],
  ];
  // map tuples -> objects (handle the one malformed entry cleanly)
  return T.map(([id, region, type, parent, name, blurb]) => ({ id, region, type, parent, name, blurb }));
})();

// ───────────────────────────────────────────────────────────────────────────
// 1. Parse existing parent coordinates
// ───────────────────────────────────────────────────────────────────────────
const coordSrc = fs.readFileSync(COORD_FILE, 'utf8');
const parentCoords = {};
const re = /'([^']+)':\s*\{\s*x:\s*(-?\d+),\s*y:\s*(-?\d+)/g;
let m;
while ((m = re.exec(coordSrc)) !== null) parentCoords[m[1]] = { x: +m[2], y: +m[3] };

const childCount = {};
const placed = [];
let fallbackCount = 0;
const missingParents = new Set();
SPECS.forEach((s) => {
  const p = parentCoords[s.parent];
  if (!p) { fallbackCount++; missingParents.add(s.parent); }
  const base = p ? { x: p.x, y: p.y } : { x: REGION_CENTROID[s.region][0], y: REGION_CENTROID[s.region][1] };
  const key = s.parent + (p ? '' : '@centroid');
  childCount[key] = (childCount[key] || 0) + 1;
  const i = childCount[key];
  const angle = i * 0.78 + 0.4;
  const radius = p ? 45 + (i % 3) * 22 : 95 + (i % 5) * 28;
  const x = clamp(Math.round(base.x + Math.cos(angle) * radius), 10, 4086);
  const y = clamp(Math.round(base.y + Math.sin(angle) * radius), 10, 3048);
  placed.push({ spec: s, x, y, pin: pinFor(s) });
});

// ───────────────────────────────────────────────────────────────────────────
// 2. Idempotent insert into zoneData.js
// ───────────────────────────────────────────────────────────────────────────
let zoneSrc = fs.readFileSync(ZONE_FILE, 'utf8');
const zLE = detectLE(zoneSrc);
zoneSrc = zoneSrc.replace(
  new RegExp(',\\s*// [^\\n\\r]*✦ MICRO-POI TEXTURE[\\s\\S]*?(?=\\r?\\n];\\r?\\n\\r?\\n\\r?\\nexport const getZonesByRegion)'),
  ''
);
const zoneEntries = placed.map(({ spec: s }) => {
  const obj = {
    id: s.id, regionId: s.region, name: s.name, type: s.type, description: s.blurb,
    dangerLevel: (s.type === 'ruin' || s.type === 'fortification') ? 'medium' : 'low',
    factions: [], connections: [s.parent], wyrdCreatures: [],
  };
  return '  ' + JSON.stringify(obj, null, 1).replace(/\n/g, zLE);
}).join(',' + zLE);
const zoneInsert = ',' + zLE + '  // ───────────── ✦ MICRO-POI TEXTURE (auto-generated) ─────────────' + zLE + zoneEntries + zLE;
const zoneAnchor = zLE + '];' + zLE + zLE + zLE + zLE + 'export const getZonesByRegion';
if (!zoneSrc.includes(zoneAnchor)) { console.error('ZONE anchor not found!'); process.exit(1); }
zoneSrc = zoneSrc.replace(zoneAnchor, zoneInsert + zoneAnchor);
fs.writeFileSync(ZONE_FILE, zoneSrc);

// ───────────────────────────────────────────────────────────────────────────
// 3. Idempotent insert into locationCoordinates.js
// ───────────────────────────────────────────────────────────────────────────
let coordFileSrc = fs.readFileSync(COORD_FILE, 'utf8');
const cLE = detectLE(coordFileSrc);
coordFileSrc = coordFileSrc.replace(
  new RegExp(',?\\s*// [^\\n\\r]*✦ MICRO-POI PINS[\\s\\S]*?(?=\\r?\\n};\\r?\\n\\r?\\n// Pristine snapshot)'),
  ''
);
const coordLines = placed.map(({ spec: s, x, y, pin }) =>
  `  '${s.id}': { x: ${x}, y: ${y}, pinType: '${pin}', regionId: '${s.region}', source: 'world' },`
);
const coordInsert = ',' + cLE + '  // ───────────── ✦ MICRO-POI PINS (auto-generated, clustered near parent zones) ─────────────' + cLE + coordLines.join(cLE) + cLE;
const coordAnchor = cLE + '};' + cLE + cLE + '// Pristine snapshot';
if (!coordFileSrc.includes(coordAnchor)) { console.error('COORD anchor not found!'); process.exit(1); }
coordFileSrc = coordFileSrc.replace(coordAnchor, coordInsert + coordAnchor);
fs.writeFileSync(COORD_FILE, coordFileSrc);

console.log('Micro-POIs placed   :', placed.length, '(centroid fallback:', fallbackCount + ')');
console.log('Missing parents     :', [...missingParents].length, 'zones (their micro-POIs clustered at region centroid)');
const byRegion = {};
placed.forEach(p => byRegion[p.spec.region] = (byRegion[p.spec.region] || 0) + 1);
console.log('Per region:', JSON.stringify(byRegion));
