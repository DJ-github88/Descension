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
  {
    id: 'wraithfen',
    regionId: 'frostwood-reach',
    name: 'Wraithfen',
    type: 'wilderness',
    description: 'A fog-drowned fen on the eastern border where the ground breathes and the water is warm to the touch. Mimir Unwoven wander here without masks, their forms dissolving and reforming in the mist. Thalren trappers avoid it — those who enter too deep return speaking languages no one recognizes.',
    dangerLevel: 'high',
    factions: ['Mimir Unwoven'],
    connections: ['the-shallows', 'mistbarrow'],
    wyrdCreatures: ['Gref', 'Revel']
  },
  {
    id: 'mistbarrow',
    regionId: 'frostwood-reach',
    name: 'Mistbarrow',
    type: 'ruin',
    description: 'An ancient burial mound shrouded in fog so dense it has its own weather. The barrow predates House Thalreth — its builders are unknown, and the stone chambers inside are carved with symbols that match no recorded language. Expeditions have recovered amber tablets and corroded bronze masks of unsettling workmanship.',
    dangerLevel: 'high',
    factions: ['Forgotten Archivists'],
    connections: ['wraithfen', 'greythorn-copse'],
    wyrdCreatures: ['Gallows-Wood', 'Gref']
  },
  {
    id: 'greythorn-copse',
    regionId: 'frostwood-reach',
    name: 'Greythorn Copse',
    type: 'settlement',
    description: 'A fortified copse of ironwood trees on the trade route between Greymark and the eastern fens, maintained jointly by Thalren timber-wardens and Briaran thorn-tenders. The trees here grow deliberately tangled — a living wall of iron-hard thorns that funnels all traffic through a single, watched gate.',
    dangerLevel: 'low',
    factions: ['Thalren Trappers', 'Unshorn Briaran'],
    connections: ['mistbarrow', 'bramble-heath'],
    wyrdCreatures: []
  },
  {
    id: 'bramble-heath',
    regionId: 'frostwood-reach',
    name: 'Bramble Heath',
    type: 'wilderness',
    description: 'An open stretch of thorn-covered heathland at the forest edge where the ironwood canopy breaks and the fog thins for the first time. Briaran rangers patrol here, tending the thorn-barriers that mark the boundary between the Reach and the lowland approaches. The heath is beautiful in a savage way — crimson thorn-flowers bloom year-round in soil nourished by centuries of blood.',
    dangerLevel: 'medium',
    factions: ['Unshorn Briaran'],
    connections: ['greythorn-copse', 'skalds-landing'],
    wyrdCreatures: ['Pooka', 'Gallows-Wood']
  },
  {
    id: 'skalds-landing',
    regionId: 'frostwood-reach',
    name: "Skald's Landing",
    type: 'settlement',
    description: 'A small trading post on the northern river where Nordhalla longships dock after navigating the frozen waterways. The settlement is overwhelmingly Skald — timber longhouses with carved dragon-prows sit incongruously among the peat-stone Thalren architecture. The Skald traders exchange cold-iron, whale oil, and glacier ice for ironwood timber and resin.',
    dangerLevel: 'low',
    factions: ['Skald Traders', 'Thalren Trappers'],
    connections: ['bramble-heath', 'the-shallows'],
    wyrdCreatures: []
  },
  {
    id: 'the-shifting-fen',
    regionId: 'frostwood-reach',
    name: 'The Shifting Fen',
    type: 'wilderness',
    description: 'A Mimir-held fen that literally changes position with the seasons — paths that existed last month are now impassable bog, and new clearings open where solid ground once stood. The Mist-Woven Mimir who tend it claim the fen is alive, a living test of perception that rewards those who do not rely on memory.',
    dangerLevel: 'high',
    factions: ['Mist-Woven Mimir'],
    connections: ['wraithfen', 'scribes-tower'],
    wyrdCreatures: ['Gref', 'Moot']
  },
  {
    id: 'mirror-mere',
    regionId: 'frostwood-reach',
    name: 'Mirror Mere',
    type: 'settlement',
    description: 'A perfectly still lake settlement where Mask-Borne Mimir test their reflections against their masks to ensure their identity holds. The mere never ripples — even in storm weather, the surface remains glass-still. Mimir scholars use the lake as a divination tool, reading the reflections of possible futures in its depths.',
    dangerLevel: 'low',
    factions: ['Mask-Borne Mimir'],
    connections: ['the-shifting-fen', 'greymark-keep'],
    wyrdCreatures: []
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
  {
    id: 'ymirs-col',
    regionId: 'nordhalla',
    name: "Ymir's Col",
    type: 'wilderness',
    description: 'A treacherous mountain pass between two glacier-capped peaks, named for the frost giant of Skald legend. The wind through the col is so violent it can strip flesh from bone in minutes. Cairns of frozen corpses mark the safest path — their expressions preserved in perfect, screaming clarity.',
    dangerLevel: 'extreme',
    factions: ['Skald Ice-Trackers'],
    connections: ['hunger-glaciers', 'vargtor'],
    wyrdCreatures: ['Stel', 'Skrei']
  },
  {
    id: 'vargtor',
    regionId: 'nordhalla',
    name: 'Vargtor',
    type: 'settlement',
    description: 'A watchtower settlement built atop a rocky tor that rises above the glacier line. The Skald garrison here watches for Corvani movements and glacier wyrms. Wolves gather at the tor\'s base in winter — the Skald believe they are the spirits of dead trackers returning to the watch.',
    dangerLevel: 'medium',
    factions: ['Skald Keepers', 'Fjords-Riders'],
    connections: ['ymirs-col', 'frostcirque'],
    wyrdCreatures: ['Kjarn']
  },
  {
    id: 'frostcirque',
    regionId: 'nordhalla',
    name: 'Frostcirque',
    type: 'ruin',
    description: 'A glacial hollow high in the mountains where the Rime-Born perform their oldest rituals — the freezing of memory into ice. The cirque walls are covered in runic script so old that even the Skald Keepers cannot read it. The air here is absolutely still, as if time itself has frozen.',
    dangerLevel: 'high',
    factions: ['Rime-Born Frostbound'],
    connections: ['vargtor', 'the-still-crag'],
    wyrdCreatures: ['Stel', 'Tatzelwurm']
  },
  {
    id: 'the-still-crag',
    regionId: 'nordhalla',
    name: 'The Still Crag',
    type: 'wilderness',
    description: 'A cliff face perpetually frozen in rime where no wind blows and no sound carries. The Rime-Born claim the crag is where the Warden\'s breath touched the mountain during the Glacier Bargain. Ice sculptures of unknown figures stand frozen in attitudes of supplication along the cliff face — no one knows who carved them or who they depict.',
    dangerLevel: 'high',
    factions: ['Rime-Born Rune Keepers'],
    connections: ['frostcirque', 'rooks-promontory'],
    wyrdCreatures: ['Huld', 'Skrei']
  },
  {
    id: 'rooks-promontory',
    regionId: 'nordhalla',
    name: "Rook's Promontory",
    type: 'wilderness',
    description: 'A high cliff jutting over the frozen sea where the Corvani gather in vast, dark congregations. Ravens circle the promontory at all hours, and the Corvani interpret their flight patterns as prophecies. The cliff stone is black and glassy — obsidian formed by ancient volcanic activity, now sheathed in centuries of rime.',
    dangerLevel: 'high',
    factions: ['Corvani Flock'],
    connections: ['the-still-crag', 'fjord-gate'],
    wyrdCreatures: ['Jawl']
  },
  {
    id: 'the-black-firth',
    regionId: 'nordhalla',
    name: 'The Black Firth',
    type: 'wilderness',
    description: 'A long, narrow inlet of the frozen sea flanked by obsidian cliffs that rise hundreds of feet on either side. The water here is black and still, reflecting the cliffs like a dark mirror. Skald longships navigate the firth by starlight — the only reliable light source in a passage where the sun has not shone in eight centuries.',
    dangerLevel: 'high',
    factions: ['Sea-Guard'],
    connections: ['fjord-gate', 'bloodhammer-sump'],
    wyrdCreatures: ['Skerry', 'Skrei']
  },
  {
    id: 'vesperas-perch',
    regionId: 'nordhalla',
    name: "Vespera's Perch",
    type: 'settlement',
    description: 'A Corvani cliff-settlement built into the high caves of the eastern mountains, named for the Corvani matriarch Vespera. The dwellings are inaccessible from the ground — reachable only by rope-ladders and gliding on fixed lines. The Corvani here trade raven-feather cloaks and storm-predictions with the Skald.',
    dangerLevel: 'medium',
    factions: ['Corvani Flock'],
    connections: ['rooks-promontory', 'bloodhammer-sump'],
    wyrdCreatures: []
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
  {
    id: 'deepchasm-keep',
    regionId: 'cragjaw-peaks',
    name: 'Deepchasm Keep',
    type: 'settlement',
    description: 'A Tessen fortress built spanning a massive fissure in the mountain, its foundations anchored into both walls of the chasm with iron stakes driven into living rock. The keep controls the only reliable passage between the upper peaks and the lower mining galleries. Travelers cross on a bridge of Groven-calcified bone that groans underfoot.',
    dangerLevel: 'medium',
    factions: ['house-tesshan', 'Tessen Scouts'],
    connections: ['frostmaw-holdfast', 'the-spans'],
    wyrdCreatures: []
  },
  {
    id: 'iron-ravine',
    regionId: 'cragjaw-peaks',
    name: 'Iron Ravine',
    type: 'wilderness',
    description: 'A narrow, ore-rich gorge where Tessen miners extract cold-iron from seams of volcanic magnetite. The ravine walls are streaked red and black, and the air is thick with metallic dust. Mine-shafts honeycomb the cliff faces, connected by precarious wooden platforms and rope-bridges.',
    dangerLevel: 'high',
    factions: ['Sump-Miners', 'Tessen Scouts'],
    connections: ['deepchasm-keep', 'sump-galleries'],
    wyrdCreatures: ['Scrab', 'Qalpa']
  },
  {
    id: 'the-great-gorge',
    regionId: 'cragjaw-peaks',
    name: 'The Great Gorge',
    type: 'wilderness',
    description: 'The primary Groven-spanned canyon — a mile-wide, bottomless tear in the mountain range bridged by seven calcified bone-spans, each grown from the skeleton of a willing Groven ancestor. The gorge is the main thoroughfare between the eastern and western peaks, and toll-collection is the Groven\'s primary source of leverage.',
    dangerLevel: 'high',
    factions: ['The Groven', 'Bone-Weavers'],
    connections: ['the-spans', 'stags-rest-moraine'],
    wyrdCreatures: ['Chasm-Stalker', 'Tarn']
  },
  {
    id: 'stags-rest-moraine',
    regionId: 'cragjaw-peaks',
    name: "Stag's Rest Moraine",
    type: 'ruin',
    description: 'A massive glacial deposit of shattered rock and ancient ice where the Groven hold their ancestral gatherings. The moraine is shaped like a sleeping stag — a natural formation that the Groven consider sacred. Petroglyphs of Groven lineage are carved into every exposed surface of stone.',
    dangerLevel: 'medium',
    factions: ['The Groven', 'Bone-Weavers'],
    connections: ['the-great-gorge', 'ancestor-gaps'],
    wyrdCreatures: ['Kintsu']
  },
  {
    id: 'sump-rift',
    regionId: 'cragjaw-peaks',
    name: 'Sump Rift',
    type: 'wilderness',
    description: 'An underground fissure used by the Fexrick for waste disposal and mechanical salvage. The rift descends for thousands of feet, its walls slick with chemical runoff and industrial residue. Strange things grow in the depths — fungal colonies that feed on forge-slag and mechanical parts.',
    dangerLevel: 'extreme',
    factions: ['Fexrick Scavengers'],
    connections: ['sump-galleries', 'gearworks-gulch'],
    wyrdCreatures: ['Scrab', 'Yawn']
  },
  {
    id: 'gearworks-gulch',
    regionId: 'cragjaw-peaks',
    name: 'Gearworks Gulch',
    type: 'settlement',
    description: 'A Fexrick industrial settlement built into a narrow ravine where steam-powered machinery grinds day and night. The gulch is heated by geothermal vents channeled through iron pipes, and the air is thick with sulfur and the constant clatter of industry. Fexrick artisans here produce the finest clockwork mechanisms in the known world.',
    dangerLevel: 'medium',
    factions: ['Fexrick Scavengers', 'Kethrin Guild-Bound'],
    connections: ['sump-rift', 'frostmaw-holdfast'],
    wyrdCreatures: []
  },
  {
    id: 'frostmaw-massif',
    regionId: 'cragjaw-peaks',
    name: 'Frostmaw Massif',
    type: 'wilderness',
    description: 'The compact mountain group surrounding Frostmaw Holdfast — a cluster of peaks so dense they form a single, nearly impregnable fortress of natural stone. The massif is perpetually shrouded in the blizzard that House Tesshan traded for, and navigation requires either Groven bone-compasses or intimate knowledge of the ice-tunnels.',
    dangerLevel: 'extreme',
    factions: ['house-tesshan'],
    connections: ['deepchasm-keep', 'iron-ravine'],
    wyrdCreatures: ['Chasm-Stalker', 'Thrum']
  },

  // =========================================================================
  // SUNDALE
  // =========================================================================
  {
    id: 'harath-vault',
    regionId: 'sundale',
    name: 'The Harath-Vault',
    type: 'city',
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
  {
    id: 'sols-anvil-mesa',
    regionId: 'sundale',
    name: "Sol's Anvil Mesa",
    type: 'wilderness',
    description: 'A massive flat-topped mountain of black basalt where Solvarn sun-priests hold outdoor ceremonies during the rare moments when volcanic haze clears enough to glimpse the buried sun\'s residual glow. The mesa surface is carved with solar calendars and prophecy charts stretching back centuries. Heat-shimmer makes the mesa appear to float above the ashlands.',
    dangerLevel: 'medium',
    factions: ['Solvarn Martyrs', 'Dawn Vigil'],
    connections: ['emberspire-caldera', 'the-ashen-escarpment'],
    wyrdCreatures: ['Ba-Spirit']
  },
  {
    id: 'the-ashen-escarpment',
    regionId: 'sundale',
    name: 'The Ashen Escarpment',
    type: 'wilderness',
    description: 'A long, steep slope of compacted volcanic ash that forms the natural border between Sundale and the lowland approaches. The ash is packed hard as stone in places, but a wrong step can send a traveler sliding hundreds of feet into glass-scarred gullies. Solvarn watchtowers dot the escarpment rim, their eternal signal-fires burning with heartwood resin.',
    dangerLevel: 'high',
    factions: ['Dawn Vigil'],
    connections: ['sols-anvil-mesa', 'basalt-shyr'],
    wyrdCreatures: ['Sun-Husk', 'Croon']
  },
  {
    id: 'vulkars-karst',
    regionId: 'sundale',
    name: "Vulkar's Karst",
    type: 'wilderness',
    description: 'A honeycombed landscape of limestone terrain riddled with underground rivers and sinkholes, named for the Emberth forge-master who first mapped its depths. Geothermal vents heat the underground streams to boiling, and the mineral-rich water deposits vivid orange and red crystals along every cave wall. The karst connects to the Harath-Vault through miles of submerged passages.',
    dangerLevel: 'high',
    factions: ['Emberth Watchers', 'Korr Emberth'],
    connections: ['harath-vault', 'cinderhoodoo'],
    wyrdCreatures: ['Cinder-Fiend', 'Udu']
  },
  {
    id: 'cinderhoodoo',
    regionId: 'sundale',
    name: 'Cinderhoodoo',
    type: 'wilderness',
    description: 'A cluster of fire-scorched rock spires rising from the ash plain like grasping fingers. Each hoodoo is crowned with a cap of harder stone that protects the softer pillar beneath — some of the caps have melted and re-fused into grotesque, face-like shapes. Thrask Emberth use the hoodoos as navigational landmarks and shelter from the soot-storms.',
    dangerLevel: 'medium',
    factions: ['Thrask Badland Rangers'],
    connections: ['vulkars-karst', 'cinder-badlands'],
    wyrdCreatures: ['Ashwen', 'Husque']
  },
  {
    id: 'slag-gulch',
    regionId: 'sundale',
    name: 'Slag Gulch',
    type: 'settlement',
    description: 'A narrow ravine settlement filled with forge waste and industrial debris, where Emberth and Groven workers process slag for salvageable metals. The gulch is hot, loud, and acrid — a permanent foundry town built on the principle that nothing useful should be wasted. The inhabitants have developed a unique patois mixing Sundari and Terran.',
    dangerLevel: 'medium',
    factions: ['Emberth Forge-Clans', 'Groven Workers'],
    connections: ['great-forge', 'cinderhoodoo'],
    wyrdCreatures: []
  },
  {
    id: 'the-cinder-strait',
    regionId: 'sundale',
    name: 'The Cinder Strait',
    type: 'wilderness',
    description: 'A narrow water passage between two volcanic islands in the boiling sea off Sundale\'s coast. The water steams perpetually, and the cliffs on either side weep molten rock during peak volcanic cycles. Merryn sailors navigate the strait at great risk — the passage halves the journey to Merrowport but has claimed more ships than any other route.',
    dangerLevel: 'extreme',
    factions: ['Merryn Smugglers'],
    connections: ['emberspire-caldera', 'slag-gulch'],
    wyrdCreatures: ['Cinder-Fiend', 'Nekh']
  },
  {
    id: 'ember-lagoon',
    regionId: 'sundale',
    name: 'Ember Lagoon',
    type: 'settlement',
    description: 'A warm saltwater lagoon heated by volcanic vents on Sundale\'s southern coast, where Emberth divers harvest fire-coral and thermal crystals. The lagoon glows orange-red at night from the volcanic activity below. It serves as Sundale\'s primary port — the only harbor where the water does not freeze.',
    dangerLevel: 'low',
    factions: ['Emberth Forge-Clans', 'Merryn Traders'],
    connections: ['the-cinder-strait', 'basalt-shyr'],
    wyrdCreatures: []
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
  {
    id: 'kelpies-cove',
    regionId: 'iceheart-sea',
    name: "Kelpie's Cove",
    type: 'settlement',
    description: 'A sheltered inlet used by smugglers and black-market traders, hidden behind a wall of grinding ice-shoals that only the most skilled Merryn pilots can navigate. The cove is named for the phantom sea-horse said to lure ships onto the rocks. Lanterns of captured bioluminescence mark the safe channel.',
    dangerLevel: 'medium',
    factions: ['Merryn Pirates', 'Drun Outcasts'],
    connections: ['merrowport', 'the-saltmaw-estuary'],
    wyrdCreatures: []
  },
  {
    id: 'the-saltmaw-estuary',
    regionId: 'iceheart-sea',
    name: 'The Saltmaw Estuary',
    type: 'wilderness',
    description: 'Where a glacial river from Nordhalla meets the frozen sea, creating a treacherous mix of fresh and salt water choked with ice-floes. The estuary is rich with seal-hunting grounds and rare thermal minerals washed down from the mountains. Merryn whalers and Myrathil divers compete violently for territory.',
    dangerLevel: 'high',
    factions: ['Merryn Whalers', 'Myrathil River-Fed'],
    connections: ['kelpies-cove', 'ironjaw-port'],
    wyrdCreatures: ['Orun', 'Brine']
  },
  {
    id: 'wraithsound',
    regionId: 'iceheart-sea',
    name: 'Wraithsound',
    type: 'wilderness',
    description: 'A wide, deep inlet perpetually shrouded in sea-mist, where the echoes of drowned sailors carry for miles. Myrathil Deep-Born claim the sound is a living thing — that it listens and remembers every voice that crosses its water. Ships that enter the sound without a Myrathil guide often emerge with crews who refuse to speak of what they heard.',
    dangerLevel: 'extreme',
    factions: ['Myrathil Deep-Stalkers'],
    connections: ['first-shore', 'deepwell-archipelago'],
    wyrdCreatures: ['Drowned Spume', 'Pelagos']
  },
  {
    id: 'deepwell-archipelago',
    regionId: 'iceheart-sea',
    name: 'Deepwell Archipelago',
    type: 'wilderness',
    description: 'A chain of ice-islands where Deep-Born Myrathil congregate in underwater cave-cities beneath the frozen surface. The archipelago stretches for forty miles, each island connected by submerged tunnels. The Deep-Born maintain a culture entirely separate from the surface — they emerge only to trade and to conduct their mysterious Drowning Rites.',
    dangerLevel: 'extreme',
    factions: ['Myrathil Deep-Born'],
    connections: ['wraithsound', 'spindrift-lagoon'],
    wyrdCreatures: ['Thalass', 'Pelagos']
  },
  {
    id: 'spindrift-lagoon',
    regionId: 'iceheart-sea',
    name: 'Spindrift Lagoon',
    type: 'settlement',
    description: 'A coral-reef lagoon warmed by volcanic currents, one of the few places in the Iceheart Sea where the water is tropical. Myrathil Breakers-Born tend living coral-gardens here, harvesting bioluminescent organisms for trade. The lagoon glows blue-green at night — visible for miles, a beacon in the frozen darkness.',
    dangerLevel: 'low',
    factions: ['Myrathil Breakers-Born'],
    connections: ['deepwell-archipelago', 'merrowport'],
    wyrdCreatures: []
  },
  {
    id: 'the-shivering-bight',
    regionId: 'iceheart-sea',
    name: 'The Shivering Bight',
    type: 'wilderness',
    description: 'A wide, shallow bay with constant tremors caused by unstable volcanic activity beneath the seabed. The bight is rich in thermal vents and the exotic organisms that feed on them, but the constant quakes make anchoring impossible. Ships must drift through, engines running, hoping the tremors do not worsen.',
    dangerLevel: 'high',
    factions: ['Merryn Cartographers'],
    connections: ['gale-storm-shallows', 'ironjaw-port'],
    wyrdCreatures: ['Spume', 'Writ']
  },
  {
    id: 'skalds-longport',
    regionId: 'iceheart-sea',
    name: "Skald's Longport",
    type: 'settlement',
    description: 'A Norse-style harbor on the northern coast where Skald longships dock to trade Nordhalla goods — cold-iron, glacier ice, whale products — for Merryn salt-fish and Myrathil coral. The port is built from black basalt in the Skald style, with dragon-prow longhouses that terrify the local Merryn.',
    dangerLevel: 'low',
    factions: ['Skald Traders', 'Merryn Whalers'],
    connections: ['ironjaw-port', 'the-saltmaw-estuary'],
    wyrdCreatures: []
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
  {
    id: 'kumis-downs',
    regionId: 'sundrift-vale',
    name: 'Kumis Downs',
    type: 'wilderness',
    description: 'Rolling hills of pale grass where Ordan mares graze in vast herds, producing the fermented mare\'s milk that is the steppe\'s primary trade good and sacred drink. The downs are peaceful by steppe standards — the herds are guarded by Ordan riders who know every hillock by heart. Throat-singing carries for miles across the open ground.',
    dangerLevel: 'low',
    factions: ['Ordan Nomads', 'Ordan Hunters'],
    connections: ['grass-tundra', 'the-long-steppe'],
    wyrdCreatures: ['Nokhor']
  },
  {
    id: 'the-long-steppe',
    regionId: 'sundrift-vale',
    name: 'The Long Steppe',
    type: 'wilderness',
    description: 'The vast central grasslands stretching from horizon to horizon, featureless except for the occasional burial mound or standing stone. The grass here is grey-green and tough as rope, growing waist-high even in the starless dark. Caravans navigate by the hum of the ancestral mounds — each mound produces a unique tone that carries through the earth.',
    dangerLevel: 'medium',
    factions: ['Ordan Nomads'],
    connections: ['kumis-downs', 'ancestor-wold'],
    wyrdCreatures: ['Zud', 'Unzag']
  },
  {
    id: 'ancestor-wold',
    regionId: 'sundrift-vale',
    name: 'Ancestor Wold',
    type: 'ruin',
    description: 'High, open ground where the Ordan dead are honored in vast earthen barrows marked by standing stones. The wold is the most sacred place in the Vale — to speak above a whisper here is to invite the wrath of twenty generations. The hum of the barrows is constant and resonant, a deep bass tone that Ordan herders claim guides their migration.',
    dangerLevel: 'medium',
    factions: ['Mound-Keepers', 'Ordan Nomads'],
    connections: ['the-long-steppe', 'starfall-vale'],
    wyrdCreatures: ['Lorn']
  },
  {
    id: 'starfall-vale',
    regionId: 'sundrift-vale',
    name: 'Starfall Vale',
    type: 'wilderness',
    description: 'A deep valley in the otherwise flat steppe where Astril claim constellation-spirits fell to earth during the Breach. The valley floor is littered with crystalline shards that glow faintly with trapped starlight — the physical residue of Sol\'s shattered celestial court. Sylen Astril make pilgrimages here to commune with their nesting spirits.',
    dangerLevel: 'high',
    factions: ['Astril Sylen'],
    connections: ['ancestor-wold', 'nova-heath'],
    wyrdCreatures: ['Lien', 'Qilin']
  },
  {
    id: 'nova-heath',
    regionId: 'sundrift-vale',
    name: 'Nova Heath',
    type: 'wilderness',
    description: 'Open heathland lit by Astril beacon-fires — great pyres of crystalline Lien-wood that burn with pale, cold light visible for miles. The heath is a gathering ground for Astril of all castes during the solstice observances. Muren Astril maintain the beacons and use them to transmit coded messages across the steppe.',
    dangerLevel: 'medium',
    factions: ['Astril Muren', 'Astril Sylen'],
    connections: ['starfall-vale', 'the-unlit-knoll'],
    wyrdCreatures: ['Sere']
  },
  {
    id: 'the-unlit-knoll',
    regionId: 'sundrift-vale',
    name: 'The Unlit Knoll',
    type: 'ruin',
    description: 'A small, rounded hill where Unlit Astril hold their secret judgments — the trials of those whose constellation-spirits have gone dark. The knoll is devoid of all light by Unlit design; even fire refuses to burn here. Unlit Veil operatives use the knoll as a dead-drop and meeting point, knowing no Astril with star-glow in their blood can approach.',
    dangerLevel: 'high',
    factions: ['Unlit Veil'],
    connections: ['nova-heath', 'synod-hold'],
    wyrdCreatures: ['Lien']
  },
  {
    id: 'morrens-bogpost',
    regionId: 'sundrift-vale',
    name: "Morren's Bogpost",
    type: 'settlement',
    description: 'A Morren trading outpost at the forest-steppe edge where Bryngloom goods — fungal lights, memory-glass, bog-mushroom reagents — are exchanged for Ordan wool and hide. The outpost is a cluster of squat, peat-stone buildings that smell perpetually of bog-water. The Morren traders here are debt-brokers, always willing to extend credit at terms that seem generous until the interest compounds.',
    dangerLevel: 'medium',
    factions: ['Morren Traders', 'Kessen Merchants'],
    connections: ['mound-camps', 'lien-stalked-grazes'],
    wyrdCreatures: []
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
  },
  {
    id: 'widows-quagmire',
    regionId: 'bryngloom-forest',
    name: "Widow's Quagmire",
    type: 'wilderness',
    description: 'A treacherous bog area where the ground liquefies without warning, swallowing travelers whole. The quagmire earned its name from the Morren widows who, according to legend, walked into the bog willingly to join their debt-dead husbands — and now preserve forever in the peat, their hands still clutching unsigned contract-fragments.',
    dangerLevel: 'extreme',
    factions: ['Morren Peat-Cutters'],
    connections: ['peat-bog-sinks', 'black-fen'],
    wyrdCreatures: ['Debt-Revenant', 'Canker']
  },
  {
    id: 'black-fen',
    regionId: 'bryngloom-forest',
    name: 'Black Fen',
    type: 'wilderness',
    description: 'An acidic fen where nothing grows and the water is black as ink. The fen is the dumping ground of the Neth contract courts — failed contracts, dissolved agreements, and legally-voided individuals are cast into its depths. The acidity is so extreme that bone dissolves within hours. Nothing preserved here. Nothing remembered. The Neth call it the Final Clause.',
    dangerLevel: 'extreme',
    factions: ['Velun Pact-Lords'],
    connections: ['widows-quagmire', 'vel-keth-bayou'],
    wyrdCreatures: ['Cycle-Eater', 'Edict']
  },
  {
    id: 'drowned-dingle',
    regionId: 'bryngloom-forest',
    name: 'Drowned Dingle',
    type: 'wilderness',
    description: 'A wooded valley permanently flooded by bog water, where dead ironwood trees stand like skeletal fingers above the dark surface. Morren peat-cutters navigate the dingle in flat-bottomed boats, harvesting peat and the occasional preserved corpse. The trees here are petrified — their branches chime like bells when the wind blows.',
    dangerLevel: 'high',
    factions: ['Morren Peat-Cutters'],
    connections: ['black-fen', 'over-shanty'],
    wyrdCreatures: ['Morok', 'Wist']
  },
  {
    id: 'vel-keth-bayou',
    regionId: 'bryngloom-forest',
    name: 'Vel-Keth Bayou',
    type: 'wilderness',
    description: 'A marshy channel in the deep forest named in the Neth tongue — Vel-Keth translates roughly to "the water that remembers." The bayou flows against the natural gradient, defying physics in ways the Neth insist are perfectly legal under the First Contract. Memory-glass deposits line the banks, glowing faintly with recorded thoughts of the long-dead.',
    dangerLevel: 'high',
    factions: ['Kessen Weavers', 'Velun Pact-Lords'],
    connections: ['black-fen', 'aran-glen'],
    wyrdCreatures: ['Vatra', 'Leshy']
  },
  {
    id: 'aran-glen',
    regionId: 'bryngloom-forest',
    name: 'Aran-Glen',
    type: 'settlement',
    description: 'A narrow valley in the forest\'s heart where Kessen Neth weavers tend the living ironwood groves that supply Atropolis with building material. The glen is peaceful by Bryngloom standards — the Neth legal presence here is strong enough to enforce the Contract\'s non-aggression clauses. The buildings are grown, not built, coaxed from living wood over decades.',
    dangerLevel: 'low',
    factions: ['Kessen Weavers', 'Velun Pact-Lords'],
    connections: ['vel-keth-bayou', 'atropolis'],
    wyrdCreatures: []
  },
  {
    id: 'hunters-gully',
    regionId: 'bryngloom-forest',
    name: "Hunter's Gully",
    type: 'wilderness',
    description: 'A water-worn ravine used by Vreken for ambush hunts — the narrow walls force prey into single-file, and the Vreken drop from above in coordinated strikes. The gully floor is carpeted with bioluminescent moss that illuminates the kill-zones in eerie green light. Marked Vreken claim this territory; trespassers are considered sport.',
    dangerLevel: 'high',
    factions: ['Marked Vreken'],
    connections: ['the-sunken-spire', 'fangmere-grove'],
    wyrdCreatures: ['Vyraj', 'Morok']
  },
  {
    id: 'fangmere-grove',
    regionId: 'bryngloom-forest',
    name: 'Fangmere Grove',
    type: 'ruin',
    description: 'A small, sacred wood where Vreken hold blood-rites and ancestral communion ceremonies. The trees here grow in a perfect circle, their roots intertwined with the bones of Vreken dead. The grove is quiet — preternaturally so. Even the ambient bioluminescence dims here, as if the light itself shows respect.',
    dangerLevel: 'medium',
    factions: ['Clean Vreken', 'Crypt-Council'],
    connections: ['hunters-gully', 'root-veil-scriptorium'],
    wyrdCreatures: ['Wist']
  },
  {
    id: 'thalrens-ledger-post',
    regionId: 'bryngloom-forest',
    name: "Thalren's Ledger-Post",
    type: 'settlement',
    description: 'A shared Thalren-Morren archive outpost on the forest edge, where Thalren scribes copy Neth contract records onto vellum as insurance against the fog\'s memory-erasure. The outpost is built of peat-stone and ironwood — a hybrid of Thalren and Morren construction styles. It serves as a neutral ground where the two cultures exchange archival techniques.',
    dangerLevel: 'low',
    factions: ['Thalren Scribes', 'Morren Peat-Cutters'],
    connections: ['root-veil-scriptorium', 'morrens-bogpost'],
    wyrdCreatures: []
  },
  {
    id: 'merryns-drift',
    regionId: 'bryngloom-forest',
    name: "Merryn's Drift",
    type: 'settlement',
    description: 'A Merryn river-trading camp on the forest\'s western waterways, where flat-bottomed barges carry goods between Bryngloom and the Iceheart Sea. The camp is a cluster of houseboats lashed together, perpetually bobbing in the slow-moving bog water. The Merryn here have adapted to fresh water — their salt-scars fade within a generation.',
    dangerLevel: 'low',
    factions: ['Merryn River-Traders'],
    connections: ['thalrens-ledger-post', 'the-sunken-spire'],
    wyrdCreatures: []
  }
];

export const getZonesByRegion = (regionId) => {
  return ZONE_DATA.filter(zone => zone.regionId === regionId);
};

export const getZoneData = (zoneId) => {
  return ZONE_DATA.find(zone => zone.id === zoneId) || null;
};
