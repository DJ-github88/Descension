/**
 * Points of Interest (POIs) and Sub-Zone Database
 *
 * Houses TTRPG-styled points of interest for all seven regions of Mythrill,
 * complete with danger levels, factions, connections, and Wyrd-creature listings.
 * Written in the immersive Mythrill voice.
 *
 * CONVENTION: Zone IDs use hyphens (e.g., 'greymark-keep').
 * The loreDictionary uses marks for location termIds (e.g., 'greymark_keep').
 * Cross-referencing code must convert between these formats.
 */

export const ZONE_DATA = [
 {
  "id": "greymark-keep",
  "regionId": "frostwood-reach",
  "name": "Greymark Keep",
  "type": "town",
 "description": "The ancient, towering stronghold of House Thalreth, constructed from wet grey peat-stone and massive petrified ironwood logs. It stands as the primary sanctuary in the Reach, its massive fireplaces fueled by resinous heartwood to ward off both the biting cold and the encroaching memory-eating fog. Founded just after the Binding with the Fog Compact. The Scribe-Sentinels codified the Sovereign Ledger here in the first centuries of the Dimming.",
 "dangerLevel": "low",
 "factions": [
  "house-thalreth",
  "scribe-sentinels"
 ],
   "connections": [
   "the-shallows",
   "scribes-tower",
   "mirror-mere",
   "meadowglen-crossing"
  ],
  "wyrdCreatures": []
  },
  {
   "id": "the-shallows",
 "regionId": "frostwood-reach",
 "name": "The Shallows",
 "type": "wilderness",
 "description": "A labyrinth of mist-veiled, shallow ravines and marshy pine stands surrounding Greymark Keep. Silt-roads are marked by rusted lantern-posts, but travelers must keep their eyes on the ironwood roots, which seem to drift when the mists thicken.",
 "dangerLevel": "medium",
 "factions": [
  "Mist-Sentinels",
  "Thalren Trappers"
 ],
  "connections": [
   "greymark-keep",
   "ironwood-heart",
   "thornwood-grove",
   "wraithfen"
  ],
  "wyrdCreatures": [
   "Gambrel",
   "Gref"
  ]
  },
  {
   "id": "scribes-tower",
 "regionId": "frostwood-reach",
 "name": "Scribes' Tower",
 "type": "settlement",
 "description": "A vertical cathedral of parchment and ink, built into the hollow shell of a dead, petrified ironwood. Here, archivists work in silent shifts, copying maps and genealogies onto heavy calfskin vellum to preserve their history before the mists erase their minds.",
 "dangerLevel": "low",
 "factions": [
  "scribe-sentinels",
  "house-thalreth"
 ],
 "connections": [
  "greymark-keep",
  "ledger-halls"
 ],
 "wyrdCreatures": []
 },
 {
 "id": "ledger-halls",
 "regionId": "frostwood-reach",
 "name": "Ledger Halls",
 "type": "ruin",
 "description": "An ancient, partially collapsed underground archive dating back to the first century of the sun's death. Chained heavy books of records lie scattered among the petrified roots, guarded by the silent echoes of clerks who forgot their own names.",
 "dangerLevel": "high",
 "factions": [
  "Forgotten Archivists"
 ],
 "connections": [
  "scribes-tower",
  "ironwood-heart"
 ],
 "wyrdCreatures": [
  "Gref"
 ]
 },
 {
 "id": "ironwood-heart",
 "regionId": "frostwood-reach",
 "name": "Ironwood Heart",
 "type": "wilderness",
 "description": "The deepest, darkest grove in the Frostwood Reach, where the ironwoods grow so dense that the mist forms a heavy, stagnant lake on the forest floor. At its center stands a titanic, glowing white tree whose sap remains warm, attracting both desperate survivalists and horrific predators.",
 "dangerLevel": "extreme",
 "factions": [
  "trueborn-florae"
 ],
 "connections": [
  "the-shallows",
  "ledger-halls"
 ],
 "wyrdCreatures": [
  "Gambrel",
  "Gref"
 ]
 },
 {
 "id": "wraithfen",
 "regionId": "frostwood-reach",
 "name": "Wraithfen",
 "type": "wilderness",
 "description": "A fog-drowned fen on the eastern border where the ground breathes and the water is warm to the touch. Fractured Mimir outcasts wander here with salvaged masks, their forms dissolving and reforming in the mist. Thalren trappers avoid it, those who enter too deep return speaking languages no one recognizes.",
 "dangerLevel": "high",
 "factions": [
  "Tethered Mimir"
 ],
  "connections": [
   "the-shallows",
   "the-shifting-fen"
  ],
  "wyrdCreatures": [
   "Gref",
   "Revel"
  ]
  },
  {
   "id": "greythorn-copse",
 "regionId": "frostwood-reach",
 "name": "Greythorn Copse",
 "type": "settlement",
 "description": "A fortified copse of ironwood trees on the trade route between Greymark and the eastern fens, maintained jointly by Thalren timber-wardens and Florae thorn-tenders. The trees here grow deliberately tangled, a living wall of iron-hard thorns that funnels all traffic through a single, watched gate.",
 "dangerLevel": "low",
 "factions": [
  "Thalren Trappers",
  "Trueborn Florae"
 ],
 "connections": [
  "wraithfen",
  "bramble-heath"
 ],
 "wyrdCreatures": []
 },
 {
 "id": "bramble-heath",
 "regionId": "frostwood-reach",
 "name": "Bramble Heath",
 "type": "wilderness",
 "description": "An open stretch of thorn-covered heathland at the forest edge where the ironwood canopy breaks and the fog thins for the first time. Florae rangers patrol here, tending the thorn-barriers that mark the boundary between the Reach and the lowland approaches. The heath is beautiful in a savage way, crimson thorn-flowers bloom year-round in soil nourished by centuries of blood.",
 "dangerLevel": "medium",
 "factions": [
  "Trueborn Florae"
 ],
 "connections": [
  "greythorn-copse",
  "skalds-landing"
 ],
 "wyrdCreatures": [
  "Pooka",
  "Gallows-Wood"
 ]
 },
 {
 "id": "skalds-landing",
 "regionId": "frostwood-reach",
 "name": "Skald's Landing",
 "type": "settlement",
 "description": "A small trading post on the northern river where Nordhalla longships dock after navigating the frozen waterways. The settlement is overwhelmingly Skald, timber longhouses with carved dragon-prows sit incongruously among the peat-stone Thalren architecture. The Skald traders exchange cold-iron, whale oil, and glacier ice for ironwood timber and resin.",
 "dangerLevel": "low",
 "factions": [
  "Skald Traders",
  "Thalren Trappers"
 ],
 "connections": [
  "bramble-heath",
  "the-shallows"
 ],
 "wyrdCreatures": []
 },
 {
 "id": "mirror-mere",
 "regionId": "frostwood-reach",
 "name": "Mirror Mere",
 "type": "settlement",
 "description": "A perfectly still lake settlement where Masked Mimir test their reflections against their masks to ensure their identity holds. The mere never ripples, even in storm weather, the surface remains glass-still. Mimir scholars use the lake as a divination tool, reading the reflections of possible futures in its depths.",
 "dangerLevel": "low",
 "factions": [
  "Masked Mimir"
 ],
  "connections": [
   "greymark-keep",
   "the-shifting-fen"
  ],
  "wyrdCreatures": []
  },
  {
   "id": "frozen-archive",
 "regionId": "nordhalla",
 "name": "The Frozen Archive",
 "type": "tomb",
 "description": "A subterranean cathedral of blue ice and basalt, carved deep beneath the Nordhalla glaciers. It serves as the ultimate resting place for the Skald clans, who chisel their ancestors' histories into glacier walls so they will be preserved forever in stasis. The Archive predates the Dimming, a dead civilization's flash-frozen capital discovered and repurposed after the Glacier Bargain, just after the Binding. The Augurs have recorded every pulse from this site for nearly eight centuries.",
 "dangerLevel": "medium",
 "factions": [
  "house-skalvyr",
  "Skald Keepers"
 ],
  "connections": [
   "fjord-gate",
   "rimors-hearth",
   "vargtor"
  ],
  "wyrdCreatures": [
   "Stel"
  ]
  },
  {
   "id": "bloodhammer-sump",
 "regionId": "nordhalla",
 "name": "Bloodhammer Sump",
 "type": "settlement",
 "description": "A deep, steam-venting volcanic crater that serves as the industrial heart of Nordhalla. Surrounded by towering walls of ice, the geothermal heat is channeled into massive iron smelters where the Berserkers forge their runic cold-iron axes.",
 "dangerLevel": "medium",
 "factions": [
  "Bloodhammer Clan",
  "house-skalvyr"
 ],
 "connections": [
  "fjord-gate",
  "hunger-glaciers"
 ],
 "wyrdCreatures": []
 },
 {
 "id": "fjord-gate",
 "regionId": "nordhalla",
 "name": "Fjord-Gate",
 "type": "settlement",
 "description": "A massive coastal harbor nestled inside a deep black fjord, guarded by towering stone doors that slide shut to block sea-storms. It is the primary trade hub of the north, linking Nordhalla to the Iceheart Sea.",
 "dangerLevel": "low",
 "factions": [
  "house-skalvyr",
  "Sea-Guard"
 ],
  "connections": [
   "frozen-archive",
   "bloodhammer-sump",
   "vargtor",
   "rooks-promontory"
  ],
  "wyrdCreatures": []
  },
  {
   "id": "hunger-glaciers",
 "regionId": "nordhalla",
 "name": "Hunger Glaciers",
 "type": "wilderness",
 "description": "A vast, shifting expanse of pure whiteout and deadly crevasses. The wind here carries a predatory howl, and travelers swear the ice moves intentionally, seeking to trap caravans and freeze them into permanent monuments.",
 "dangerLevel": "extreme",
 "factions": [
  "Endurance Purists"
 ],
 "connections": [
  "bloodhammer-sump",
  "rimors-hearth"
 ],
 "wyrdCreatures": [
  "Stel",
  "Glacier Wyrm"
 ]
 },
 {
 "id": "rimors-hearth",
 "regionId": "nordhalla",
 "name": "Rimor's Hearth",
 "type": "ruin",
 "description": "The volcanic ruins of a great mountain keep that was buried by a sudden glacier advance during the first century. A few steam vents still keep the black basalt ruins warm, attracting smugglers and freezing travelers seeking temporary shelter.",
 "dangerLevel": "high",
 "factions": [
  "Fjords-Riders"
 ],
 "connections": [
  "frozen-archive",
  "hunger-glaciers"
 ],
 "wyrdCreatures": [
  "Stel"
 ]
 },
 {
 "id": "skadis-col",
 "regionId": "nordhalla",
 "name": "Skadi's Col",
 "type": "wilderness",
 "description": "A treacherous mountain pass between two glacier-capped peaks, named for the frost giant of Skald legend. The wind through the col is so violent it can strip flesh from bone in minutes. Cairns of frozen corpses mark the safest path, their expressions preserved in perfect, screaming clarity.",
 "dangerLevel": "extreme",
 "factions": [
  "Skald Ice-Trackers"
 ],
  "connections": [
   "hunger-glaciers",
   "vargtor",
   "frosthold-citadel"
  ],
 "wyrdCreatures": [
  "Stel",
  "Skrei"
 ]
 },
 {
 "id": "vargtor",
 "regionId": "nordhalla",
 "name": "Vargtor",
 "type": "settlement",
 "description": "A watchtower settlement built atop a rocky tor that rises above the glacier line. The Skald garrison here watches for Corvani movements and glacier wyrms. Wolves gather at the tor's base in winter, the Skald believe they are the spirits of dead trackers returning to the watch.",
 "dangerLevel": "medium",
 "factions": [
  "Skald Keepers",
  "Fjords-Riders"
 ],
  "connections": [
   "skadis-col",
   "the-still-crag",
   "frozen-archive",
   "fjord-gate"
  ],
 "wyrdCreatures": [
  "Kjarn"
 ]
 },
 {
 "id": "the-still-crag",
 "regionId": "nordhalla",
 "name": "Þögn",
 "type": "wilderness",
  "description": "A cliff face perpetually frozen in rime where no wind blows and no sound carries. The Rime-Born claim the cliff is where Keth-Amar's breath touched the mountain during the Glacier Bargain. Ice sculptures of unknown figures stand frozen in attitudes of supplication along the cliff face, no one knows who carved them or who they depict.",
 "dangerLevel": "high",
 "factions": [
  "Rime-Born Rune Keepers"
 ],
  "connections": [
   "rooks-promontory",
   "frosthold-citadel"
  ],
 "wyrdCreatures": [
  "Huld",
  "Skrei"
 ]
 },
 {
 "id": "rooks-promontory",
 "regionId": "nordhalla",
 "name": "Rook's Promontory",
 "type": "wilderness",
 "description": "A high cliff jutting over the frozen sea where the Corvani gather in vast, dark congregations. Ravens circle the promontory at all hours, and the Corvani interpret their flight patterns as prophecies. The cliff stone is black and glassy, obsidian formed by ancient volcanic activity, now sheathed in centuries of rime.",
 "dangerLevel": "high",
 "factions": [
  "Corvani Flock"
 ],
 "connections": [
  "the-still-crag",
  "fjord-gate"
 ],
 "wyrdCreatures": [
  "Jawl"
 ]
 },
 {
 "id": "vesperas-perch",
 "regionId": "nordhalla",
 "name": "Vespera's Perch",
 "type": "settlement",
 "description": "A Corvani cliff-settlement built into the high caves of the eastern mountains, named for the Corvani matriarch Vespera. The dwellings are inaccessible from the ground, reachable only by rope-ladders and gliding on fixed lines. The Corvani here trade raven-feather cloaks and storm-predictions with the Skald.",
 "dangerLevel": "medium",
 "factions": [
  "Corvani Flock"
 ],
 "connections": [
  "rooks-promontory",
  "bloodhammer-sump"
 ],
 "wyrdCreatures": []
 },
 {
 "id": "frostmaw-holdfast",
 "regionId": "cragjaw-peaks",
 "name": "Frostmaw Holdfast",
 "type": "city",
 "description": "The primary fortress of House Tesshan, built into a titanic cavern high on the mountain peaks. Protected from the eternal blizzards by heavy iron blast-gates, the city is a vertical network of stone arches, smelting galleries, and steam-ducts. The oldest Fexric holdfast in the Cragjaw, operating for millennia before the Dimming. The Vat-Breakers' Revolt, in the early generations of the Dimming, birthed the Groven civilization here. The War of Thousand Screams, centuries into the Dimming, was fought across its vertical tunnels.",
 "dangerLevel": "low",
 "factions": [
  "house-tesshan",
  "Sump-Miners"
 ],
  "connections": [
   "the-spans",
   "sump-galleries",
   "gearworks-gulch",
   "the-stone-cog"
  ],
  "wyrdCreatures": []
  },
  {
   "id": "the-spans",
 "regionId": "cragjaw-peaks",
 "name": "The Spans",
 "type": "wilderness",
 "description": "A terrifying network of arching stone and bone bridges that link the jagged peaks above the blizzard-clouds. Many of the bridges are grown from the calcified skeletons of the Groven's willing ancestors, carrying travelers over bottomless, whiteout chasms.",
 "dangerLevel": "high",
 "factions": [
  "The Groven",
  "Tessen Scouts"
 ],
 "connections": [
  "frostmaw-holdfast",
  "ancestor-gaps"
 ],
 "wyrdCreatures": [
  "Chasm-Stalker"
 ]
 },
 {
 "id": "ancestor-gaps",
 "regionId": "cragjaw-peaks",
 "name": "The Ancestor-Gaps",
 "type": "tomb",
 "description": "An ancient, vertical burial valley where the Groven grow their bone-spans. The rock walls are honeycombed with thousands of burial niches, and the air hums with the soft, deep vibration of ancestral bones reacting to the mountain winds.",
 "dangerLevel": "medium",
 "factions": [
  "The Groven",
  "Bone-Weavers"
 ],
 "connections": [
  "the-spans",
  "sump-galleries"
 ],
 "wyrdCreatures": []
 },
 {
 "id": "sump-galleries",
 "regionId": "cragjaw-peaks",
 "name": "Sump Galleries",
 "type": "wilderness",
 "description": "The lower, toxic mining shafts beneath the mountain peaks, where Tessen miners wearing leather respirators extract sulfur and coal-iron. The air is warm but heavy with volcanic gases, and the shadows are home to scurrying, multi-legged horrors.",
 "dangerLevel": "high",
 "factions": [
  "Sump-Miners",
  "Caustic Fexric"
 ],
  "connections": [
   "frostmaw-holdfast",
   "gearworks-gulch",
   "driknell-foundry"
  ],
 "wyrdCreatures": [
  "Scrab",
  "Toxic Spore-Horror"
 ]
 },
 {
 "id": "deepchasm-keep",
 "regionId": "cragjaw-peaks",
 "name": "Deepchasm Keep",
 "type": "settlement",
 "description": "A Tessen fortress built spanning a massive fissure in the mountain, its foundations anchored into both walls of the chasm with iron stakes driven into living rock. The keep controls the only reliable passage between the upper peaks and the lower mining galleries. Travelers cross on a bridge of Groven-calcified bone that groans underfoot.",
 "dangerLevel": "medium",
 "factions": [
  "house-tesshan",
  "Tessen Scouts"
 ],
 "connections": [
  "frostmaw-holdfast",
  "the-spans"
 ],
 "wyrdCreatures": []
 },
 {
 "id": "iron-ravine",
 "regionId": "cragjaw-peaks",
 "name": "Iron Ravine",
 "type": "wilderness",
 "description": "A narrow, ore-rich gorge where Tessen miners extract cold-iron from seams of volcanic magnetite. The ravine walls are streaked red and black, and the air is thick with metallic dust. Mine-shafts honeycomb the cliff faces, connected by precarious wooden platforms and rope-bridges.",
 "dangerLevel": "high",
 "factions": [
  "Sump-Miners",
  "Tessen Scouts"
 ],
 "connections": [
  "deepchasm-keep",
  "sump-galleries"
 ],
 "wyrdCreatures": [
  "Scrab",
  "Qalpa"
 ]
 },
 {
 "id": "the-great-gorge",
 "regionId": "cragjaw-peaks",
 "name": "The Great Gorge",
 "type": "wilderness",
 "description": "The primary Groven-spanned canyon, a mile-wide, bottomless tear in the mountain range bridged by seven calcified bone-spans, each grown from the skeleton of a willing Groven ancestor. The gorge is the main thoroughfare between the eastern and western peaks, and toll-collection is the Groven's primary source of exploit.",
 "dangerLevel": "high",
 "factions": [
  "The Groven",
  "Bone-Weavers"
 ],
 "connections": [
  "the-spans",
  "stags-rest-moraine"
 ],
 "wyrdCreatures": [
  "Chasm-Stalker",
  "Tarn"
 ]
 },
 {
 "id": "stags-rest-moraine",
 "regionId": "cragjaw-peaks",
 "name": "Stag's Rest Moraine",
 "type": "ruin",
 "description": "A massive glacial deposit of shattered rock and ancient ice where the Groven hold their ancestral gatherings. The moraine is shaped like a sleeping stag, a natural formation that the Groven consider sacred. Petroglyphs of Groven lineage are carved into every exposed surface of stone.",
 "dangerLevel": "medium",
 "factions": [
  "The Groven",
  "Bone-Weavers"
 ],
 "connections": [
  "the-great-gorge",
  "ancestor-gaps"
 ],
 "wyrdCreatures": [
  "Kintsu"
 ]
 },
 {
 "id": "gearworks-gulch",
 "regionId": "cragjaw-peaks",
 "name": "Gearworks Gulch",
 "type": "settlement",
 "description": "A Fexric industrial settlement built into a narrow ravine where steam-powered machinery grinds day and night. The gulch is heated by geothermal vents channeled through iron pipes, and the air is thick with sulfur and the constant clatter of industry. Fexric artisans here produce the finest clockwork mechanisms in the known world.",
 "dangerLevel": "medium",
 "factions": [
   "Caustic Fexric",
  "Clockwork Fexric"
 ],
  "connections": [
   "sump-galleries",
   "frostmaw-holdfast",
   "driknell-foundry",
   "lost-brood-vats"
  ],
 "wyrdCreatures": []
 },
 {
 "id": "frostmaw-massif",
 "regionId": "cragjaw-peaks",
 "name": "Frostmaw Massif",
 "type": "wilderness",
 "description": "The compact mountain group surrounding Frostmaw Holdfast, a cluster of peaks so dense they form a single, nearly impregnable fortress of natural stone. The massif is perpetually shrouded in the blizzard that House Tesshan traded for, and navigation requires either Groven bone-compasses or intimate knowledge of the ice-tunnels.",
 "dangerLevel": "extreme",
 "factions": [
  "house-tesshan"
 ],
 "connections": [
  "deepchasm-keep",
  "iron-ravine"
 ],
 "wyrdCreatures": [
  "Chasm-Stalker",
  "Thrumm"
 ]
 },
 {
 "id": "harath-vault",
 "regionId": "sundale",
 "name": "The Harath-Vault",
 "type": "city",
 "description": "The massive subterranean capital of the Solari forge-clans in Sundale, carved radially into the volcanic throat of a dormant secondary caldera by the Sun-Speakers centuries before the sun's death. It serves as both sacred temple to Sol's Breath and industrial forge-caldera where the Hollow-Solari tend the eternal ember in sacred silence. The Solari vault-capital beneath Emberspire. The Hollow-Solari tending-clan has protected Sol's Breath here since before the Binding. The Forge of Grum, the first Berserker training ground, was established here in the first centuries of the Dimming.",
 "dangerLevel": "extreme",
 "factions": [
  "Solari Martyrs",
  "Solari Watchers"
 ],
  "connections": [
   "great-forge",
   "emberspire-caldera",
   "ember-lagoon",
   "sun-keep"
  ],
 "wyrdCreatures": [
  "Sun-Husk",
  "Cinder-Fiend"
 ]
 },
 {
 "id": "great-forge",
 "regionId": "sundale",
 "name": "The Great Forge",
 "type": "city",
 "description": "A sprawling city of black iron and basalt built inside a volcanic cavern. Warmed by a branch of the world's magma-core, the Solari forge-masters maintain the massive, geothermal bellows that power the world's largest smelting operations, producing refined cold-iron for all seven continents.",
 "dangerLevel": "low",
 "factions": [
  "Solari Forge-Clans",
  "house-solvan"
 ],
  "connections": [
   "harath-vault",
   "basalt-shyr",
   "ember-lagoon"
  ],
 "wyrdCreatures": []
 },
 {
 "id": "emberspire-caldera",
 "regionId": "sundale",
 "name": "Emberspire Caldera",
 "type": "wilderness",
 "description": "The active, soot-choked volcanic mouth of Emberspire, where the world's heart volcano continuously vents ash and molten glass into the sky. The heat is oppressive, and the volcanic vents are home to ancient, fire-weaving elemental entities. Emberspire erupted just after the Breach when Keth-Amar cracked the binding seal. It has burned without interruption for eight centuries, fed by Sol's fading radiance.",
 "dangerLevel": "extreme",
 "factions": [
  "Pyrofiend Cults"
 ],
  "connections": [
   "harath-vault",
   "cinder-badlands",
   "synod-hold",
   "sun-keep",
   "warmheath",
   "spinstones-columns"
  ],
  "wyrdCreatures": [
   "Cinder-Fiend"
  ]
  },
  {
   "id": "basalt-shyr",
 "regionId": "sundale",
 "name": "Basalt Shyr",
 "type": "settlement",
 "description": "A trade outpost built atop a series of cooling basalt columns on the border between Sundale and the Bryngloom Forest. It serves as the primary trade gateway, exchanging refined metal and volcanic coal for Bryngloom fungal-lights and timber.",
 "dangerLevel": "medium",
 "factions": [
  "house-solvan",
  "Kessen Merchants"
 ],
 "connections": [
  "great-forge",
  "cinder-badlands"
 ],
 "wyrdCreatures": []
 },
 {
 "id": "cinder-badlands",
 "regionId": "sundale",
 "name": "Cinder Badlands",
 "type": "wilderness",
 "description": "A vast, windswept desert of black obsidian sands and jagged glass spires. The wind here carries a toxic soot, and travelers must wear heavy leather wraps to protect their eyes from flying glass-shards and sudden volcanic fire-hazards.",
 "dangerLevel": "high",
 "factions": [
  "Waste-Solari Badland Rangers"
 ],
 "connections": [
  "emberspire-caldera",
  "basalt-shyr"
 ],
 "wyrdCreatures": [
  "Sun-Husk"
 ]
 },
 {
 "id": "sols-anvil-mesa",
 "regionId": "sundale",
 "name": "Sol's Anvil Mesa",
 "type": "wilderness",
 "description": "A massive flat-topped mountain of black basalt where Solari sun-priests hold outdoor ceremonies during the rare moments when volcanic haze clears enough to glimpse the buried sun's residual glow. The mesa surface is carved with solar calendars and prophecy charts stretching back centuries. Heat-shimmer makes the mesa appear to float above the ashlands.",
 "dangerLevel": "medium",
 "factions": [
  "Solari Martyrs",
  "Dawn Vigil"
 ],
 "connections": [
  "emberspire-caldera",
  "the-ashen-escarpment"
 ],
 "wyrdCreatures": [
  "Ba-Spirit"
 ]
 },
 {
 "id": "the-ashen-escarpment",
 "regionId": "sundale",
 "name": "The Ashen Escarpment",
 "type": "wilderness",
 "description": "A long, steep slope of compacted volcanic ash that forms the natural border between Sundale and the lowland approaches. The ash is packed hard as stone in places, but a wrong step can send a traveler sliding hundreds of feet into glass-scarred gullies. Solari watchtowers dot the escarpment rim, their eternal signal-fires burning with heartwood resin.",
 "dangerLevel": "high",
 "factions": [
  "Dawn Vigil"
 ],
  "connections": [
   "sols-anvil-mesa",
   "basalt-shyr",
   "solvans-stand",
   "thornshire-colony",
   "sun-keep"
  ],
 "wyrdCreatures": [
  "Sun-Husk",
  "Croon"
 ]
 },
 {
 "id": "vulkars-karst",
 "regionId": "sundale",
 "name": "Vulkar's Karst",
 "type": "wilderness",
 "description": "A honeycombed landscape of limestone terrain riddled with underground rivers and sinkholes, named for the Solari forge-master who first mapped its depths. Geothermal vents heat the underground streams to boiling, and the mineral-rich water deposits vivid orange and red crystals along every cave wall. The karst connects to the Harath-Vault through miles of submerged passages.",
 "dangerLevel": "high",
 "factions": [
  "Solari Watchers",
  "Hollow-Solari"
 ],
 "connections": [
  "harath-vault",
  "cinder-badlands"
 ],
 "wyrdCreatures": [
  "Cinder-Fiend",
  "Udu"
 ]
 },
 {
 "id": "slag-gulch",
 "regionId": "sundale",
 "name": "Slag Gulch",
 "type": "settlement",
 "description": "A narrow ravine settlement filled with forge waste and industrial debris, where Solari and Groven workers process slag for salvageable metals. The gulch is hot, loud, and acrid, a permanent foundry town built on the principle that nothing useful should be wasted. The inhabitants have developed a unique patois mixing Sundari and Terran.",
 "dangerLevel": "medium",
 "factions": [
  "Solari Forge-Clans",
  "Groven Workers"
 ],
 "connections": [
  "great-forge",
  "cinder-badlands"
 ],
 "wyrdCreatures": []
 },
 {
 "id": "ember-lagoon",
 "regionId": "sundale",
 "name": "Ember Lagoon",
 "type": "settlement",
 "description": "A warm saltwater lagoon heated by volcanic vents on Sundale's southern coast, where Solari divers harvest fire-coral and thermal crystals. The lagoon glows orange-red at night from the volcanic activity below. It serves as Sundale's primary port, the only harbor where the water does not freeze.",
 "dangerLevel": "low",
 "factions": [
  "Solari Forge-Clans",
  "Merryn Traders"
 ],
  "connections": [
   "basalt-shyr",
   "great-forge",
   "merrowport",
   "harath-vault",
   "konjaw-port"
  ],
 "wyrdCreatures": []
 },
 {
 "id": "merrowport",
 "regionId": "iceheart-sea",
 "name": "Merrowport",
 "type": "city",
 "description": "A magnificent, floating city of wood and iron, anchored to a massive, warm subterranean volcanic seamount that keeps the surrounding waters perpetually unfrozen. Merrowport is the primary maritime trade hub, filled with Merryn captains, Neth brokers, and northern sailors. Established as a permanent port in the first centuries of the Dimming, Merrowport grew into the Iceheart's primary trade hub over seven centuries. The Brine-Bond Syndicate formalized the Luck-Ledger here centuries into the Dimming.",
 "dangerLevel": "low",
 "factions": [
  "house-mereval",
  "Merryn Cartographers"
 ],
  "connections": [
   "ironjaw-port",
   "gale-storm-shallows",
   "ember-lagoon",
   "spindrift-lagoon",
   "blackteeth-isle",
   "synod-hold"
  ],
 "wyrdCreatures": []
 },
 {
 "id": "ironjaw-port",
 "regionId": "iceheart-sea",
 "name": "Ironjaw Port",
 "type": "settlement",
 "description": "A rough, cliffside harbor carved from black basalt walls on the southern shore. Walled in cold-iron blocks to withstand the crushing force of drifting icebergs, it is a haven for whalers, deep-sea miners, and smugglers. Established during the First Thermal War, in the first centuries of the Dimming, as the Groven toll-negotiation seat. The Ironjaw Port Toll-Treaties, the first formal recognition of Groven bridge-rights, were signed here during the Toll Wars, centuries into the Dimming.",
 "dangerLevel": "medium",
 "factions": [
  "Merryn Whalers",
  "Myrathil Scavengers"
 ],
  "connections": [
   "merrowport",
   "treakous-rift",
   "blackteeth-isle"
  ],
 "wyrdCreatures": []
 },
 {
 "id": "treakous-rift",
 "regionId": "iceheart-sea",
 "name": "Treakous Oceanic Rift",
 "type": "wilderness",
 "description": "A bottomless, freezing ocean rift where the water runs black and silent beneath city-sized glaciers. The currents are violent and unpredictable, and deep-sea divers speak of ancient, multi-tentacled horrors sleeping in the sub-zero depths.",
 "dangerLevel": "extreme",
 "factions": [
  "Myrathil Deep-Stalkers"
 ],
 "connections": [
  "ironjaw-port",
  "first-shore"
 ],
 "wyrdCreatures": [
  "Abyssal Leviathan",
  "Drowned Spume"
 ]
 },
 {
 "id": "first-shore",
 "regionId": "iceheart-sea",
 "name": "First Shore",
 "type": "ruin",
 "description": "The ancient coastal ruins where the human ancestors of House Mereval first landed eight centuries ago. The stone watchtowers are now encrusted with heavy ice and barnacles, their skeletal archers still standing guard over a frozen, silent harbor.",
 "dangerLevel": "high",
 "factions": [
  "Drowned Revenants"
 ],
 "connections": [
  "treakous-rift",
  "gale-storm-shallows"
 ],
 "wyrdCreatures": [
  "Drowned Spume"
 ]
 },
 {
 "id": "gale-storm-shallows",
 "regionId": "iceheart-sea",
 "name": "Gale-Storm Shallows",
 "type": "wilderness",
 "description": "A treacherous expanse of shallow reefs, jagged ice-crags, and perpetual storm-cycles. The winds here can tear sails to ribbons, and sailors must navigate by the soft glow of bioluminescent ocean moss and the ink-charts on their skin.",
 "dangerLevel": "high",
 "factions": [
  "Merryn Pirates"
 ],
  "connections": [
   "merrowport",
   "first-shore",
   "the-shivering-bight",
   "shard-window"
  ],
 "wyrdCreatures": [
  "Drowned Spume"
 ]
 },
 {
 "id": "brinehorse-cove",
 "regionId": "iceheart-sea",
 "name": "Brinehorse Cove",
 "type": "settlement",
 "description": "A sheltered inlet used by smugglers and black-market traders, hidden behind a wall of grinding ice-shoals that only the most skilled Merryn pilots can navigate. The cove is named for the phantom sea-horse said to lure ships onto the rocks. Lanterns of captured bioluminescence mark the safe channel.",
 "dangerLevel": "medium",
 "factions": [
  "Merryn Pirates",
  "Drun Outcasts"
 ],
 "connections": [
  "merrowport",
  "the-saltmaw-estuary"
 ],
 "wyrdCreatures": []
 },
 {
 "id": "the-saltmaw-estuary",
 "regionId": "iceheart-sea",
 "name": "The Saltmaw Estuary",
 "type": "wilderness",
 "description": "Where a glacial river from Nordhalla meets the frozen sea, creating a treacherous mix of fresh and salt water choked with ice-floes. The estuary is rich with seal-hunting grounds and rare thermal minerals washed down from the mountains. Merryn whalers and Myrathil divers compete violently for territory.",
 "dangerLevel": "high",
 "factions": [
  "Merryn Whalers",
  "Myrathil Brook"
 ],
 "connections": [
  "brinehorse-cove",
  "ironjaw-port"
 ],
 "wyrdCreatures": [
  "Orun",
  "Brine"
 ]
 },
 {
 "id": "wraithsound",
 "regionId": "iceheart-sea",
 "name": "Wraithsound",
 "type": "wilderness",
 "description": "A wide, deep inlet perpetually shrouded in sea-mist, where the echoes of drowned sailors carry for miles. Myrathil Deep claim the sound is a living thing, that it listens and remembers every voice that crosses its water. Ships that enter the sound without a Myrathil guide often emerge with crews who refuse to speak of what they heard.",
 "dangerLevel": "extreme",
 "factions": [
  "Myrathil Deep-Stalkers"
 ],
 "connections": [
  "first-shore",
  "deepwell-archipelago"
 ],
 "wyrdCreatures": [
  "Drowned Spume",
  "Pelagos"
 ]
 },
 {
 "id": "deepwell-archipelago",
 "regionId": "iceheart-sea",
 "name": "Deepwell Archipelago",
 "type": "wilderness",
 "description": "A chain of ice-islands where Deep Myrathil congregate in underwater cave-cities beneath the frozen surface. The archipelago stretches for forty miles, each island connected by submerged tunnels. The Deep maintain a culture entirely separate from the surface, they emerge only to trade and to conduct their mysterious Drowning Rites.",
 "dangerLevel": "extreme",
 "factions": [
  "Myrathil Deep"
 ],
 "connections": [
  "wraithsound",
  "the-shivering-bight"
 ],
 "wyrdCreatures": [
  "Thalass",
  "Pelagos"
 ]
 },
 {
 "id": "the-shivering-bight",
 "regionId": "iceheart-sea",
 "name": "The Shivering Bight",
 "type": "wilderness",
 "description": "A wide, shallow bay with constant tremors caused by unstable volcanic activity beneath the seabed. The bight is rich in thermal vents and the exotic organisms that feed on them, but the constant quakes make anchoring impossible. Ships must drift through, engines running, hoping the tremors do not worsen.",
 "dangerLevel": "high",
 "factions": [
  "Merryn Cartographers"
 ],
 "connections": [
  "gale-storm-shallows",
  "ironjaw-port"
 ],
 "wyrdCreatures": [
  "Spume",
  "Writ"
 ]
 },
 {
 "id": "synod-hold",
 "regionId": "sundrift-vale",
 "name": "The Synod Hold",
 "type": "city",
 "description": "The vertical fortress of House Ordavan, built atop a series of sheer cliffs. The city serves as the administrative heart of the steppe, where the nomadic clans gather every summer to balance trade accounts and resolve border disputes. The Astril cathedral was formally established in the early centuries of the Dimming, built over the stone circles where the first Lumian echo-vessels arrived before the Binding.",
 "dangerLevel": "low",
  "factions": [
   "house-ordavan",
   "unlit-veil"
  ],
  "connections": [
   "mound-camps",
   "ancestor-mounds",
   "emberspire-caldera",
   "merrowport",
   "starfall-vale"
  ],
 "wyrdCreatures": []
 },
 {
 "id": "mound-camps",
 "regionId": "sundrift-vale",
 "name": "Mound-Camps",
 "type": "settlement",
 "description": "A sprawling, seasonal settlement of heavy wooly-yurts built around the base of the great grass mounds. Here, nomadic throat-singers trade wool, dried meat, and memory-beads for cold-iron tools and salt.",
 "dangerLevel": "medium",
 "factions": [
  "Ordan Nomads",
  "Astril Outcast Guilds"
 ],
  "connections": [
   "ancestor-mounds",
   "grass-tundra",
   "synod-hold"
  ],
 "wyrdCreatures": []
 },
 {
 "id": "ancestor-mounds",
 "regionId": "sundrift-vale",
 "name": "Ancestor Mounds",
 "type": "tomb",
 "description": "A vast network of grass-covered earthen barrows containing the preserved remains of twenty generations of Ordan chieftains. The mounds emit a low, continuous hum that guides lost travelers through the starless steppe.",
 "dangerLevel": "medium",
 "factions": [
  "Mound-Keepers",
  "Earthen Astril"
 ],
  "connections": [
   "synod-hold",
   "lien-stalked-grazes",
   "starfall-vale",
   "novas-heath",
   "the-moundwatch"
  ],
 "wyrdCreatures": []
 },
 {
 "id": "grass-tundra",
 "regionId": "sundrift-vale",
 "name": "Grass Tundra Steppe",
 "type": "wilderness",
 "description": "An endless, wind-swept plain of grey-green grass that stretches beneath a permanently dark sky. The steppe is home to massive, woolly herds of tundra beasts, but travelers must watch for the sudden, hunting shadows of the Hungry Child.",
 "dangerLevel": "high",
 "factions": [
  "Ordan Hunters"
 ],
 "connections": [
  "mound-camps",
  "lien-stalked-grazes"
 ],
 "wyrdCreatures": [
  "Hungry Child"
 ]
 },
 {
 "id": "lien-stalked-grazes",
 "regionId": "sundrift-vale",
 "name": "Lien-Stalked Grazes",
 "type": "wilderness",
 "description": "A unique region of the steppe where the grass is replaced by glowing, crystal-infused Lien-stalks. The soil here is highly fertile, but the crystalline grass makes grazing dangerous, attracting mutated beasts and crystal-skinned scavengers.",
 "dangerLevel": "extreme",
 "factions": [
  "Stellar Astril"
 ],
 "connections": [
  "ancestor-mounds",
  "grass-tundra"
 ],
 "wyrdCreatures": [
  "Hungry Child"
 ]
 },
 {
 "id": "kumis-downs",
 "regionId": "sundrift-vale",
 "name": "Kumis Downs",
 "type": "wilderness",
 "description": "Rolling hills of pale grass where Ordan mares graze in vast herds, producing the fermented mare's milk that is the steppe's primary trade good and sacred drink. The downs are peaceful by steppe standards, the herds are guarded by Ordan riders who know every hillock by heart. Throat-singing carries for miles across the open ground.",
 "dangerLevel": "low",
 "factions": [
  "Ordan Nomads",
  "Ordan Hunters"
 ],
 "connections": [
  "grass-tundra",
  "the-long-steppe"
 ],
 "wyrdCreatures": [
  "Nokhor"
 ]
 },
 {
 "id": "the-long-steppe",
 "regionId": "sundrift-vale",
 "name": "The Long Steppe",
 "type": "wilderness",
 "description": "The vast central grasslands stretching from horizon to horizon, featureless except for the occasional burial mound or standing stone. The grass here is grey-green and tough as rope, growing waist-high even in the starless dark. Caravans navigate by the hum of the ancestral mounds, each mound produces a unique tone that carries through the earth.",
 "dangerLevel": "medium",
 "factions": [
  "Ordan Nomads"
 ],
  "connections": [
   "kumis-downs",
   "ancestor-mounds",
   "blizzard-bluff"
  ],
 "wyrdCreatures": [
  "Zud",
  "Unzag"
 ]
 },
 {
 "id": "starfall-vale",
 "regionId": "sundrift-vale",
 "name": "Starfall Vale",
 "type": "wilderness",
 "description": "A deep valley in the otherwise flat steppe where crystalline shards from Lumia's destruction first struck Mythrill's surface. The valley floor is littered with fragments that glow faintly with trapped starlight, the physical residue of a world that no longer has a sun. Earthen Astril make pilgrimages here to commune with Lumia's echo.",
 "dangerLevel": "high",
 "factions": [
  "Earthen Astril"
 ],
 "connections": [
  "ancestor-mounds",
  "grass-tundra"
 ],
 "wyrdCreatures": [
  "Lien",
  "Qilin"
 ]
 },
 {
 "id": "the-unlit-knoll",
 "regionId": "sundrift-vale",
 "name": "The Unlit Knoll",
 "type": "ruin",
 "description": "A small, rounded hill where the Unlit Veil hold their secret judgments, the trials of those whose Lumian echo has gone dark. The knoll is devoid of all light by Unlit design; even fire refuses to burn here. Unlit Veil operatives use the knoll as a dead-drop and meeting point, knowing no Astril with active crystalline resonance can approach.",
 "dangerLevel": "high",
 "factions": [
  "Unlit Veil"
 ],
 "connections": [
  "grass-tundra",
  "synod-hold"
 ],
 "wyrdCreatures": [
  "Lien"
 ]
 },
 {
 "id": "morrens-bogpost",
 "regionId": "sundrift-vale",
 "name": "Morren's Bogpost",
 "type": "settlement",
 "description": "A Vreken trading outpost at the forest-steppe edge where Bryngloom goods, fungal lights, memory-glass, bog-mushroom reagents, are exchanged for Ordan wool and hide. The outpost is a cluster of squat, peat-stone buildings that smell perpetually of bog-water. The Vreken traders here are debt-brokers, always willing to extend credit at terms that seem generous until the interest compounds. Established in the early generations of the Dimming as the Bryngloom-Sundrift trade border-post. The Bogpost marks the forest-steppe border where the Bryngloom Bog-Route meets the Steppe Migration Circuit.",
 "dangerLevel": "medium",
 "factions": [
  "Vreken Traders",
  "Kessen Merchants"
 ],
 "connections": [
  "mound-camps",
  "lien-stalked-grazes"
 ],
  "wyrdCreatures": []
  },
  {
  "id": "thaw-run-river",
  "regionId": "sundrift-vale",
  "name": "The Thaw-Run",
  "type": "waterway",
  "description": "The longest continuous river on Mythrill, born from the Cragjaw melt-lakes where the eternal blizzard's runoff collects against the volcanic heat of the lower peaks. The river flows south through the Sundrift Vale, providing the Ordan their primary water source and the Brook Myrathil their inland route from the Iceheart Sea. Near Ironjaw Port, the Thaw-Run empties into the ocean — this estuary was the first waterway to go silent when the ocean's frequency stopped.",
  "dangerLevel": "low",
  "factions": [
   "house-ordavan"
  ],
  "connections": [
   "ironjaw-port"
  ],
  "wyrdCreatures": []
  },
  {
  "id": "atropolis",
  "regionId": "bryngloom-forest",
 "name": "Atropolis",
 "type": "city",
 "description": "The magnificent, suspended canopy city of the Neth, constructed inside a cathedral-grove of living ironwoods coaxed into shape over a thousand years. A quiet city of branch-walkways, lawyers, pact-mages, and merchants who view survival as a binding agreement and write their records on glowing memory-glass. Founded in the early generations of the Dimming, built around the Heart-Vault where the First Contract is preserved. The city has grown downward and outward for nearly eight centuries.",
 "dangerLevel": "low",
 "factions": [
  "Velun Pact-Lords",
  "Neth Merchants"
 ],
  "connections": [
   "the-sunken-spire",
   "aran-glen",
   "over-shanty",
   "merryns-drift",
   "the-great-mere",
   "root-veil-scriptorium",
   "fangmere-grove"
  ],
  "wyrdCreatures": []
  },
  {
   "id": "the-sunken-spire",
 "regionId": "bryngloom-forest",
 "name": "The Sunken Spire",
 "type": "city",
 "description": "The inverted subterranean capital of the Vreken, a colossal cathedral and crypt carved four hundred feet down into a peat-stone sinkhole. Lit solely by the phosphorescence of entombed ancestors wrapped in fungal shrouds, it is a place of deep ancestor veneration and silent, glowing graves. The oldest Vreken crypt-cathedral in the Bryngloom, predating the Dimming. Aedris, the first recorded Over-Lit, served as Veil-Speaker here for forty years before her condition was documented, in the mid-Dimming centuries.",
 "dangerLevel": "low",
 "factions": [
  "Clean Vreken",
  "Crypt-Council"
 ],
  "connections": [
   "atropolis",
   "peat-bog-sinks",
   "the-crypt-of-aedris",
   "merryns-drift"
  ],
 "wyrdCreatures": []
 },
 {
 "id": "peat-bog-sinks",
 "regionId": "bryngloom-forest",
 "name": "Peat-Bog Sinks",
 "type": "wilderness",
 "description": "A treacherous swamp of bottomless, preserving black peat and sinking moss. The water is thick and acidic, and the bogs are filled with the preserved, aware corpses of ancient debtors who rose when their contracts were broken by death.",
 "dangerLevel": "high",
 "factions": [
  "Vreken Peat-Cutters",
  "Drun Outcasts"
 ],
 "connections": [
  "the-sunken-spire",
  "over-shanty"
 ],
 "wyrdCreatures": [
  "Debt-Revenant",
  "Cycle-Eater"
 ]
 },
 {
 "id": "over-shanty",
 "regionId": "bryngloom-forest",
 "name": "Over-Shanty",
 "type": "settlement",
 "description": "A chaotic, hanging slum of rope-bridges and ramshackle wooden cabins built under Atropolis's main platforms. It is populated by sallow-skinned Vreken peat-cutters and the leaden-skinned Drun outcasts who chose to burn their names from the First Contract. Established in the mid-Dimming centuries at the edge of the peat-bogs. The Cult of Forgotten Shadow made first contact with the deep dark from the crypts beneath here in the most recent centuries.",
 "dangerLevel": "high",
 "factions": [
  "Drun Outcasts",
  "Vreken Peat-Cutters"
 ],
 "connections": [
  "peat-bog-sinks",
  "atropolis"
 ],
 "wyrdCreatures": [
  "Cycle-Eater"
 ]
 },
 {
 "id": "widows-quagmire",
 "regionId": "bryngloom-forest",
 "name": "Widow's Quagmire",
 "type": "wilderness",
 "description": "A treacherous bog area where the ground liquefies without warning, swallowing travelers whole. The quagmire earned its name from the Morren widows who, according to legend, walked into the bog willingly to join their debt-dead husbands, and now preserve forever in the peat, their hands still clutching unsigned contract-fragments.",
 "dangerLevel": "extreme",
 "factions": [
  "Vreken Peat-Cutters"
 ],
 "connections": [
  "peat-bog-sinks",
  "black-fen"
 ],
 "wyrdCreatures": [
  "Debt-Revenant",
  "Canker"
 ]
 },
 {
 "id": "black-fen",
 "regionId": "bryngloom-forest",
 "name": "Black Fen",
 "type": "wilderness",
 "description": "An acidic fen where nothing grows and the water is black as ink. The fen is the dumping ground of the Neth contract courts, failed contracts, dissolved agreements, and legally-voided individuals are cast into its depths. The acidity is so extreme that bone dissolves within hours. Nothing preserved here. Nothing remembered. The Neth call it the Final Clause.",
 "dangerLevel": "extreme",
 "factions": [
  "Velun Pact-Lords"
 ],
 "connections": [
  "widows-quagmire",
  "vel-keth-bayou"
 ],
 "wyrdCreatures": [
  "Cycle-Eater",
  "Edict"
 ]
 },
 {
 "id": "vel-keth-bayou",
 "regionId": "bryngloom-forest",
 "name": "Vel-Keth Bayou",
 "type": "wilderness",
 "description": "A marshy channel in the deep forest named in the Neth tongue, Vel-Keth translates roughly to \"the water that remembers.\" The bayou flows against the natural gradient, defying physics in ways the Neth insist are perfectly legal under the First Contract. Memory-glass deposits line the banks, glowing faintly with recorded thoughts of the long-dead.",
 "dangerLevel": "high",
 "factions": [
  "Kessen Weavers",
  "Velun Pact-Lords"
 ],
 "connections": [
  "black-fen",
  "aran-glen"
 ],
 "wyrdCreatures": [
  "Vatra",
  "Leshy"
 ]
 },
 {
 "id": "aran-glen",
 "regionId": "bryngloom-forest",
 "name": "Aran-Glen",
 "type": "settlement",
 "description": "A narrow valley in the forest's heart where Kessen Neth weavers tend the living ironwood groves that supply Atropolis with building material. The glen is peaceful by Bryngloom standards, the Neth legal presence here is strong enough to enforce the Contract's non-aggression clauses. The buildings are grown, not built, coaxed from living wood over decades.",
 "dangerLevel": "low",
 "factions": [
  "Kessen Weavers",
  "Velun Pact-Lords"
 ],
 "connections": [
  "vel-keth-bayou",
  "atropolis"
 ],
 "wyrdCreatures": []
 },
 {
 "id": "fangmere-grove",
 "regionId": "bryngloom-forest",
 "name": "Fangmere Grove",
 "type": "ruin",
 "description": "A small, sacred wood where Vreken hold blood-rites and ancestral communion ceremonies. The trees here grow in a perfect circle, their roots intertwined with the bones of Vreken dead. The grove is quiet, preternaturally so. Even the ambient bioluminescence dims here, as if the light itself shows respect.",
 "dangerLevel": "medium",
 "factions": [
  "Clean Vreken",
  "Crypt-Council"
 ],
 "connections": [
  "atropolis"
 ],
 "wyrdCreatures": [
  "Wist"
 ]
 },
 {
 "id": "merryns-drift",
 "regionId": "bryngloom-forest",
 "name": "Merryn's Drift",
 "type": "settlement",
 "description": "A Merryn river-trading camp on the forest's western waterways, where flat-bottomed barges carry goods between Bryngloom and the Iceheart Sea. The camp is a cluster of houseboats lashed together, perpetually bobbing in the slow-moving bog water. The Merryn here have adapted to fresh water, their salt-scars fade within a generation.",
 "dangerLevel": "low",
 "factions": [
  "Merryn River-Traders"
 ],
 "connections": [
  "atropolis",
  "the-sunken-spire"
 ],
 "wyrdCreatures": []
 },

 // ========================================================================
 // NEW ZONES, MAP ENRICHMENT (Frostwood Reach)
 // ========================================================================
 {
 "id": "frostfang-wastes",
 "regionId": "frostwood-reach",
 "name": "The Frostfang Wastes",
 "type": "wilderness",
 "description": "The cold, stony northern half of the Frostwood Reach, far from the volcanic warmth of Sundale. The ironwoods grow short and twisted here, then fail entirely into granite tundra. Carved runic monoliths and stone watch-posts mark the few roads. Frozen lakes surface for eight weeks in summer; the rest of the year, only their names are remembered. Travelers who go too far into the deep wastes sometimes do not return; whether from cold, from giants, or from things stranger than giants, no one will say.",
 "dangerLevel": "extreme",
 "factions": [
  "Greymark Northwatch",
  "The Stone-Speakers"
 ],
 "connections": [
  "grevtholm",
  "iron-lake",
  "the-stone-circles"
 ],
 "wyrdCreatures": [
  "Stel",
  "Jutul-raider"
 ]
 },
 {
 "id": "grevtholm",
 "regionId": "frostwood-reach",
 "name": "Grevtholm",
 "type": "settlement",
 "description": "A fortified stone keep at the edge of the Frostfang Wastes, the northernmost Thalren outpost, manned by the Greymark Northwatch. The keep is built into a granite outcrop and ringed with carved warning-runes. The Grevtholm garrison is the only thing keeping the Jutul warbands from ranging freely into the southern Reach.",
 "dangerLevel": "medium",
 "factions": [
  "Greymark Northwatch"
 ],
 "connections": [
  "frostfang-wastes",
  "iron-lake"
 ],
 "wyrdCreatures": []
 },
 {
 "id": "iron-lake",
 "regionId": "frostwood-reach",
 "name": "Iron Lake",
 "type": "wilderness",
 "description": "A frozen lake in the Frostfang Wastes, its name for the iron-grey color of its winter ice. In summer the surface melts into mirror-still water that reflects nothing, not the sky, not the cliffs, not the traveler standing at its edge. The Mimir say this is a wound in the world where the Reach's memory-fog cannot reach; locals say it is where drowned Jutul-maidens wait for the unwary.",
 "dangerLevel": "high",
 "factions": [],
 "connections": [
  "frostfang-wastes",
  "grevtholm"
 ],
 "wyrdCreatures": [
  "Drowned-Memory"
 ]
 },
 {
 "id": "the-stone-circles",
 "regionId": "frostwood-reach",
 "name": "The Stone Circles",
 "type": "ruin",
 "description": "A field of carved runic monoliths in the Frostfang Wastes, older than the Reach's memory. The circles hum at certain hours. The Stone-Speakers, an obscure order of Skald expatriates, maintain them in the belief that they predate even the binding of Sol. Whether they do anything at all, or whether the Stone-Speakers are simply mad, the Greymark Northwatch has never been able to determine.",
 "dangerLevel": "medium",
 "factions": [
  "The Stone-Speakers"
 ],
 "connections": [
  "frostfang-wastes"
 ],
 "wyrdCreatures": []
 },
 {
 "id": "bearsback-summit",
 "regionId": "frostwood-reach",
 "name": "Bearsback Summit",
 "type": "wilderness",
 "description": "A double-peaked granite mountain at the northernmost tip of the Reach, said by Skalds to be the place where the great bear of the ancient world broke its spine and died, freezing into two peaks. The summit is past the Stone-Speakers' circles; few climb it. Those who do speak of finding a cairn at the top, already ancient when they arrive.",
 "dangerLevel": "extreme",
 "factions": [],
 "connections": [
  "the-stone-circles"
 ],
 "wyrdCreatures": []
 },
 {
 "id": "meadowglen-crossing",
 "regionId": "frostwood-reach",
 "name": "Meadowglen Crossing",
 "type": "settlement",
 "description": "A waystation on the wide grass valley between the Frostwood Reach and Sundale, the only place where the ironwood thins enough to graze cattle. A market-town of mixed Thalren and Solari, the Crossing is officially under Greymark's writ but in practice answers to whichever side of the valley sent the last patrol. Trades: peat-iron, Solvan sulfur-lamps, Mist-Sentinel fish.",
 "dangerLevel": "low",
 "factions": [
  "House Thalreth (nominally)",
  "Solari exiles",
  "Merryn caravan-captains"
 ],
 "connections": [
  "warmheath",
  "breezebough",
  "greymark-keep"
 ],
 "wyrdCreatures": []
 },
 {
 "id": "velling-pass",
 "regionId": "frostwood-reach",
 "name": "The Velling Pass",
 "type": "wilderness",
 "description": "The long, narrow valley connecting the Frostwood Reach to Sundale's Meadowglen. The pass is watched by both Greymark and the Dawn Vigil; treaties, broken and remade, govern who passes. The narrowest stretch is called the Velling-Throat, where the cliffs close in and a single cart blocks the road.",
 "dangerLevel": "medium",
 "factions": [
  "House Thalreth (West gate)",
  "Dawn Vigil (East gate)"
 ],
 "connections": [
  "meadowglen-crossing",
  "meadowglen"
 ],
 "wyrdCreatures": [
  "Mist-Shark"
 ]
 },

 // ========================================================================
 // NEW ZONES, MAP ENRICHMENT (Nordhalla)
 // ========================================================================
 {
 "id": "frosthold-citadel",
 "regionId": "nordhalla",
 "name": "Frosthold Citadel",
 "type": "city",
 "description": "The royal seat of House Skalvyr, carved into the side of Bearsbeard's Beak itself. The citadel's great hall is a single ice-cavern, the throne a slab of stone older than the Skald clans. King-Jarl Halvar Jarn-Tand rules from here, surrounded by the Icechamber Syndicate, the Skald Keepers, and the blood-guard of the Bloodhammer Clan.",
 "dangerLevel": "low",
 "factions": [
  "House Skalvyr",
  "Icechamber Syndicate",
  "Skald Keepers",
  "Bloodhammer Clan"
 ],
 "connections": [
  "bearsbeards-beak",
  "skadis-col",
  "the-still-crag"
 ],
 "wyrdCreatures": []
 },
 {
 "id": "bearsbeards-beak",
 "regionId": "nordhalla",
 "name": "Bearsbeard's Beak",
 "type": "wilderness",
 "description": "The highest peak in Nordhalla, a granite tooth that splits the sky above Frosthold Citadel. The Skald say the mountain is the petrified corpse of a great bear that challenged the sun before Sol was bound. The climb is sacred; only the most pure-tested may attempt it. Avalanches are common; the bodies of those who fail are never recovered.",
 "dangerLevel": "extreme",
 "factions": [],
 "connections": [
  "frosthold-citadel",
  "skadis-col"
 ],
 "wyrdCreatures": [
  "Jutul-king"
 ]
 },
 {
 "id": "xardins-hearth",
 "regionId": "nordhalla",
 "name": "Xardin's Hearth",
 "type": "settlement",
 "description": "The southernmost major port of Nordhalla, built around a volcanic vent that keeps the harbor ice-free year-round. The hot-springs that bubble up around the vent are the only place in the world where Skald, Merryn, and even the occasional Frostbound can sit in the same water. Xardin's Trading Company runs the southern smuggling-lanes; the Icechamber Syndicate tolerates them only because the navy cannot survive the long southern coast without their fuel.",
 "dangerLevel": "low",
 "factions": [
  "Xardin's Trading Company",
  "Skald Navy (visiting)",
  "Fredl�se smugglers"
 ],
 "connections": [
  "southern-shore-smugglers-cove",
  "eldonholm"
 ],
 "wyrdCreatures": []
 },
 {
 "id": "eldonholm",
 "regionId": "nordhalla",
 "name": "Eldonholm",
 "type": "settlement",
 "description": "A Skald fishing-town on the eastern coast, where the black fjords meet the open sea. Eldonholm is the only Nordhalla town that has never had a Sundale or Frostwood immigrant, the locals are pure-blooded Skald and proud of it. The town's hall holds the Eldon-Stone, an ancient runic slab that names every chieftain who has ruled here since the binding.",
 "dangerLevel": "low",
 "factions": [
  "Eldonholm Council",
  "Skald Keepers"
 ],
 "connections": [
  "xardins-hearth",
  "fjord-gate"
 ],
 "wyrdCreatures": []
 },
 {
 "id": "spars-folly",
 "regionId": "nordhalla",
 "name": "The Spar's Folly",
 "type": "ruin",
 "description": "The half-built bones of a great sea-wall on the southern coast, abandoned when the Icechamber Syndicate ran out of stone and the ice-flows returned. The Skald say a syndicate-master wagered his daughter that the wall would tame the sea. He lost. The wall stands unfinished, a black-granite skeleton pointing at the open water, the names of its dead stonemasons still carved into the foundation stones.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "xardins-hearth"
 ],
 "wyrdCreatures": []
 },
 {
 "id": "southern-shore-smugglers-cove",
 "regionId": "nordhalla",
 "name": "Smuggler's Cove",
 "type": "settlement",
 "description": "A hidden inlet on the southern shore, just south of Xardin's Hearth. The Fredl�se clans use it to slip past the Icechamber Syndicate's patrol-ships. There is no permanent town, only shacks built into the cliff, rebuilt each year after the winter storms wash them away. The captain who runs it changes names every season.",
 "dangerLevel": "medium",
 "factions": [
  "Fredl�se clans"
 ],
 "connections": [
  "xardins-hearth"
 ],
 "wyrdCreatures": []
 },

 // ========================================================================
 // NEW ZONES, MAP ENRICHMENT (Sundale)
 // ========================================================================
 {
 "id": "konjaw-port",
 "regionId": "sundale",
 "name": "Konjaw Port",
 "type": "settlement",
 "description": "A fishing port on Sundale's southern coast, the most cosmopolitan town in the region. Merryn captains, Frostwood Thalren exiles, and Solari forge-clans all dock here. The Dawn Vigil holds the citadel at the harbor-mouth, but the back-alleys are the Risen's, and the cult of the old sun-veneration has its public shrines in plain view. Konjaw is the only Sundale port where the Sea-Charter is honored without the Board of Trade's registration.",
 "dangerLevel": "low",
 "factions": [
  "Dawn Vigil (harbor)",
  "The Risen",
  "Merryn captains",
  "Free Konjaw Council"
 ],
 "connections": [
  "ironjaw-village",
  "ember-lagoon",
  "the-glittering-forest"
 ],
 "wyrdCreatures": []
 },
 {
 "id": "ironjaw-village",
 "regionId": "sundale",
 "name": "Ironjaw Village",
 "type": "settlement",
 "description": "A small Solari fishing-and-smelting hamlet south of Konjaw Port, named for the iron-rimmed volcanic crater that the villagers use as a forge. The Dawn Vigil's patrols are infrequent; the villagers prefer it that way. A handful of Shorn exiles from the old Solvan nobility live here in disguise.",
 "dangerLevel": "low",
 "factions": [
  "Ironjaw Council",
  "Solari forgemen"
 ],
 "connections": [
  "konjaw-port"
 ],
 "wyrdCreatures": []
 },
 {
 "id": "thornshire-colony",
 "regionId": "sundale",
 "name": "Thornshire Colony",
 "type": "settlement",
 "description": "A penal colony of thorn-vines and black basalt huts on the Ashen Fringe, where the Dawn Vigil sends the incorrigible, conscripted Martyrs who refused, heretics who recanted, debt-defaulters from the Solari nobility. The colony is surrounded by a hedge of bramble-thorns that grows inward by an inch every season; no one knows what lies outside it now.",
 "dangerLevel": "medium",
 "factions": [
  "Dawn Vigil (overlord)",
  "The Thorned (prisoners)"
 ],
 "connections": [
  "the-ashen-escarpment"
 ],
 "wyrdCreatures": []
 },
 {
 "id": "meadowglen",
 "regionId": "sundale",
 "name": "Meadowglen",
 "type": "wilderness",
 "description": "A wide grass valley in Sundale's northern Green Rim, sheltered by ridges and warmed by a hot-spring network that never freezes. Meadowglen is the breadbasket of Sundale, the only place in the region where the soil is rich enough to grow grain year-round. The Dawn Vigil maintains a fortress-monastery at the glen's mouth, but the high meadows are the Risen's, and they hold their old-sun ceremonies at dawn when the citadel is still asleep.",
 "dangerLevel": "low",
 "factions": [
  "Dawn Vigil (fortress)",
  "The Risen",
  "Free Meadowglen Council"
 ],
 "connections": [
  "warmheath",
  "breezebough",
  "velling-pass"
 ],
 "wyrdCreatures": []
 },
 {
 "id": "warmheath",
 "regionId": "sundale",
 "name": "Warmheath",
 "type": "wilderness",
 "description": "A rolling stretch of warm moor in Sundale's north, where the volcanic heat rising through fissures keeps the grass green even in the cold months. The Heath is grazing-land for the few cattle the Dawn Vigil has permitted; it is also the hiding-place of the Risen's wandering preachers, who move from cairn to cairn speaking the old names of the sun.",
 "dangerLevel": "low",
 "factions": [
  "The Risen",
  "Free Heath herders"
 ],
 "connections": [
  "meadowglen",
  "emberspire-caldera"
 ],
 "wyrdCreatures": []
 },
 {
 "id": "breezebough",
 "regionId": "sundale",
 "name": "Breezebough",
 "type": "settlement",
 "description": "A market-town at the western edge of the Green Rim, where the warm sea-breezes meet the ashen plain. Breezebough is the trading-hub between the Dawn Vigil's territory and the Frostwood Reach, Thalren ink, Solvan obsidian, Merryn salt-fish, and Solari sulfur change hands in the open square. The town is technically under Hierophant Aethelgard's writ; in practice, the council of merchants governs.",
 "dangerLevel": "low",
 "factions": [
  "Dawn Vigil (nominally)",
  "Merchant Council",
  "Thalren trading-posts"
 ],
 "connections": [
  "meadowglen",
  "basalt-shyr"
 ],
 "wyrdCreatures": []
 },
 {
 "id": "the-glittering-forest",
 "regionId": "sundale",
 "name": "The Glittering Forest",
 "type": "wilderness",
 "description": "A peninsula connected to Sundale's main landmass by a narrow isthmus, a half-island, the greenest land in the region. Crystal-rich volcanic soil supports ancient broadleaf forest; the leaves catch the volcanic light and throw it back in shards. Long thought cursed, the Glitterwood is now the home of the Risen, the Shorn exiles of the old Solvan nobility, and hermits who fled the Dawn Vigil's conscription. The Dawn Vigil pretends the isthmus does not exist.",
 "dangerLevel": "low",
 "factions": [
  "The Risen",
  "Free Glitterwood Council",
  "Shorn exiles"
 ],
 "connections": [
  "glitterwood-heart",
  "old-sun-shrine",
  "konjaw-port"
 ],
 "wyrdCreatures": [
  "Crystal-Stag"
 ]
 },
 {
 "id": "glitterwood-heart",
 "regionId": "sundale",
 "name": "Glitterwood Heart",
 "type": "settlement",
 "description": "The unofficial capital of the Glitterwood, a village of longhouses built into the living trees, where the Risen's council meets. The village has no walls; the forest itself is the defense. The Risen's forbidden library of pre-binding texts is rumored to be hidden in the heart-tree, but no outsider has ever seen it.",
 "dangerLevel": "low",
 "factions": [
  "The Risen",
  "Free Glitterwood Council"
 ],
 "connections": [
  "the-glittering-forest"
 ],
 "wyrdCreatures": []
 },
 {
 "id": "old-sun-shrine",
 "regionId": "sundale",
 "name": "The Old Sun Shrine",
 "type": "ruin",
 "description": "A pre-binding temple at the southern tip of the Glitterwood, where the original Solvan sun-priests performed their rites before the binding. The shrine is a circular basalt plaza open to the sky; the central altar-stone still bears the names of the first dawn and the last. The Dawn Vigil has tried to destroy it three times; each time, the forest has regrown around the ruins faster than the soldiers can burn it.",
 "dangerLevel": "medium",
 "factions": [
  "The Risen (pilgrims)"
 ],
 "connections": [
  "the-glittering-forest"
 ],
 "wyrdCreatures": []
 },
 {
 "id": "spinstones-columns",
 "regionId": "sundale",
 "name": "The Spinstones Columns",
 "type": "wilderness",
 "description": "A ring of basalt columns surrounding Emberspire at a distance of two leagues, natural formations that the Solari have carved with binding-runes. The columns mark the boundary of the inner Ash-Heart; only the Solari Watchers and the Dawn Vigil's senior priests are permitted past them. The Wyrd here is thick enough to taste.",
 "dangerLevel": "extreme",
 "factions": [
  "Solari Watchers",
  "Dawn Vigil senior priests"
 ],
 "connections": [
  "emberspire-caldera",
  "cinderbloom-crater"
 ],
 "wyrdCreatures": [
  "Cinder-Fiend"
 ]
 },
 {
 "id": "cinderbloom-crater",
 "regionId": "sundale",
 "name": "Cinderbloom Crater",
 "type": "wilderness",
 "description": "A secondary volcanic vent north of Emberspire, named for the red-bloomed lichen that grows in its caldera. The Solari use the crater as a place of purification, Martyrs are sent here to cleanse before the final Vow. The Dawn Vigil claims the lichens have healing properties; the Solari say the crater simply burns the unworthy.",
 "dangerLevel": "high",
 "factions": [
  "Solari Watchers",
  "Dawn Vigil"
 ],
 "connections": [
  "spinstones-columns",
  "sols-anvil-mesa"
 ],
 "wyrdCreatures": [
  "Ash-Woven Oracle"
 ]
 },
 {
 "id": "the-star-caves",
 "regionId": "sundale",
 "name": "The Star Caves",
 "type": "ruin",
 "description": "A network of lava-tubes beneath the Spinstones Columns, where the Solvan priests once communed with what they believed were the spirits of Sol's ministers. The binding broke that communion; the caves are now silent and haunted by the Husque, mobile reality-fissures that walk the tunnels. The Solari seal the entrances, but the seals do not always hold.",
 "dangerLevel": "extreme",
 "factions": [],
 "connections": [
  "spinstones-columns"
 ],
 "wyrdCreatures": [
  "Husque",
  "The Cinder"
 ]
 },

 // ========================================================================
 // NEW ZONES, MAP ENRICHMENT (Cragjaw Peaks)
 // ========================================================================
 {
 "id": "skirmours-crag",
 "regionId": "cragjaw-peaks",
 "name": "Skirmour's Crag",
 "type": "wilderness",
 "description": "The southernmost great peak of the Cragjaw, named for the legendary Jutul-king Skirmour who ruled the high ice before House Tesshan climbed. The Crag is sacred to the Jutul, they gather at the summit at midwinter to hear the wind that, they say, is the breath of their dead ancestors. No human has reached the summit and returned whole.",
 "dangerLevel": "extreme",
 "factions": [
  "Jutul warbands"
 ],
 "connections": [
  "frostmaw-massif",
  "the-great-gorge"
 ],
 "wyrdCreatures": [
  "Thrumm"
 ]
 },
 {
 "id": "alley-of-knor",
 "regionId": "cragjaw-peaks",
 "name": "Alley of Knor",
 "type": "wilderness",
 "description": "A narrow pass through the Cragjaw's central spine, the only east-west route through the peaks that does not require Groven bone-bridges. The alley is named for the ancient Fexric runemaster Knor, who carved the warning-runes on the cliff walls when the Tesshan first came. Avalanches are common; the Alley is closed in winter.",
 "dangerLevel": "high",
 "factions": [
  "Tessen patrols",
  "Fexric engineer-corps"
 ],
 "connections": [
  "the-great-gorge",
  "deepchasm-keep"
 ],
 "wyrdCreatures": [
  "Chasm-Stalker"
 ]
 },
 {
 "id": "the-stone-cog",
 "regionId": "cragjaw-peaks",
 "name": "The Stone Cog",
 "type": "settlement",
 "description": "A Tesshan fortress-monastery on the upper Frostmaw Massif, its walls carved into the living rock to resemble the teeth of a great gear. The Cog is the seat of the Jarl-Tesshan's political power, the Frostmaw Holdfast is the ceremonial seat, but the Cog is where the Knotted Decree is administered. The steam-pipes that run from the Iron Sumps to the Cog are the only reason the fortress is habitable.",
 "dangerLevel": "low",
 "factions": [
  "House Tesshan",
  "Steam-Line Cartel",
  "Clockwork Fexric"
 ],
 "connections": [
  "frostmaw-holdfast",
  "frostmaw-massif"
 ],
 "wyrdCreatures": []
 },
 {
 "id": "driknell-foundry",
 "regionId": "cragjaw-peaks",
 "name": "Driknell Foundry",
 "type": "settlement",
 "description": "A Fexric industrial complex in the deep Iron Sumps, the largest forge-works in the Cragjaw, fed by geothermal pipes from below. Driknell stamps the Tesshan sigil onto every Ironclad plate that comes off the line. The Caustic Fexric Clan-Free workers in the lower foundries are the most numerous Fexric caste; the Clockwork Fexric overseers in the upper halls are the most despised.",
 "dangerLevel": "medium",
 "factions": [
  "Clockwork Fexric",
  "Caustic Fexric",
  "Steam-Line Cartel"
 ],
 "connections": [
  "gearworks-gulch",
  "iron-ravine",
  "sump-galleries"
 ],
 "wyrdCreatures": [
  "Scrab"
 ]
 },

 // ========================================================================
 // NEW ZONES, MAP ENRICHMENT (Sundrift Vale)
 // ========================================================================
 {
 "id": "blizzard-bluff",
 "regionId": "sundrift-vale",
 "name": "Blizzard Bluff",
 "type": "wilderness",
 "description": "A high cold bluff on the northern edge of the Sundrift Vale, separating the warmer steppe from the deep ice of the Frostwood Reach. The Ordan call this the Snow-Tooth, the wind here never stops, and the cairns along the bluff are half-buried in the worst winters. Ordan sentry-posts watch the passes; the few who cross into the Frostwood rarely come back.",
 "dangerLevel": "high",
 "factions": [
  "Ordan March Wardens",
  "Frostwood Palisade patrols (visiting)"
 ],
 "connections": [
  "the-long-steppe"
 ],
 "wyrdCreatures": [
  "Zud"
 ]
 },
 {
 "id": "novas-heath",
 "regionId": "sundrift-vale",
 "name": "Nova's Heath",
 "type": "wilderness",
 "description": "A stretch of the eastern Ancestor Wolds where a single celestial impact scorched the earth centuries ago, leaving a perfect circle of crystallized soil. The Astril come here to meditate; the Ordan avoid it, saying the ground is unlucky. The Unlit Veil is rumored to hold a hidden judgment-hill within the Heath's heart.",
 "dangerLevel": "medium",
 "factions": [
  "Astril Synod (visiting)",
  "Unlit Veil (rumored)"
 ],
 "connections": [
  "ancestor-mounds"
 ],
 "wyrdCreatures": [
  "Lien"
 ]
 },
 {
 "id": "the-moundwatch",
 "regionId": "sundrift-vale",
 "name": "The Moundwatch",
 "type": "settlement",
 "description": "A cairn-checkpoint in the eastern Wolds, manned by Ordan March Wardens who enforce the Herd-Tithe. Every migrating clan must stop here to register their herds, their people, and the names of the dead carried for burial at the Ancestor Mounds. The Moundwatch's records are the only continuous chronicle of the Ordan people.",
 "dangerLevel": "low",
 "factions": [
  "House Ordavan",
  "Ordan March Wardens"
 ],
 "connections": [
  "ancestor-mounds"
 ],
 "wyrdCreatures": []
 },

 // ========================================================================
 // NEW ZONES, MAP ENRICHMENT (Iceheart Sea)
 // ========================================================================
 {
 "id": "saryreach-castle",
 "regionId": "iceheart-sea",
 "name": "Saryreach Castle",
 "type": "city",
 "description": "A Mereval naval fortress on the largest of the Western Isles, abandoned by the Board of Trade a century ago and now the seat of the Pirate-Queen of Saryreach. The castle's black-granite walls rise from a sea-stack; the harbor below is a forest of captured masts. The Pirate-Queen keeps the Sea-Charter's letter of marque, a relic, as proof of her legitimacy; the Board of Trade calls it piracy.",
 "dangerLevel": "medium",
 "factions": [
  "Pirate-Queen of Saryreach",
  "Tide-Speakers (animist holdouts)",
  "Mer-Court emissaries"
 ],
 "connections": [
  "blackteeth-skerry",
  "tide-court-cove"
 ],
 "wyrdCreatures": [
  "Draugr Helmsman"
 ]
 },
 {
 "id": "blackteeth-skerry",
 "regionId": "iceheart-sea",
 "name": "Blackteeth Skerry",
 "type": "wilderness",
 "description": "A jagged reef of black volcanic rock on the western edge of the Iceheart Sea, named for the way the basalt teeth tear any hull that comes too close. The Blackteeth are the traditional boundary between the Merryn charted-waters and the deep ocean; beyond them, the Sea-Charter does not hold. The Skrei (drowned Skald warriors) are said to swim here at midwinter.",
 "dangerLevel": "high",
 "factions": [],
 "connections": [
  "saryreach-castle"
 ],
 "wyrdCreatures": [
  "Skrei"
 ]
 },
 {
 "id": "tide-court-cove",
 "regionId": "iceheart-sea",
 "name": "Tide-Court Cove",
 "type": "settlement",
 "description": "A hidden tidal harbor on a Western Isle, the meeting-place of the Mer-Court, a council of Tide-Speakers, Myrathil Brook, and animist holdouts who refuse the Sea-Charter. The Cove fills twice a day with the tide; the rest of the time, it is a ring of black-sand beach around a tidal pool full of singing fish. The Mer-Court is older than the Mereval House; the Board of Trade has never been able to suppress it.",
 "dangerLevel": "low",
 "factions": [
  "Mer-Court",
  "Tide-Speakers"
 ],
 "connections": [
  "saryreach-castle"
 ],
 "wyrdCreatures": [
  "Nereid"
 ]
 },
 {
 "id": "shard-window",
 "regionId": "iceheart-sea",
 "name": "The Shard-Window",
 "type": "wilderness",
 "description": "A three-mile-wide circular storm-vortex above a Sundered Monolith in the Storm-Belt. The storm never rests; it is the binding-storm of the Shard, the leash Keth-Amar holds on the buried star. The vortex pulls ships into its eye; those that survive the descent say they can see, in the lightning-flashes, the shape of a star being eaten. The Storm-Speakers tend a shrine on the rim.",
 "dangerLevel": "extreme",
 "factions": [
  "Stormspeakers"
 ],
 "connections": [
  "gale-storm-shallows"
 ],
 "wyrdCreatures": [
  "Storm-Wraith"
 ]
 },
 {
 "id": "berg-of-the-frozen-flame",
 "regionId": "iceheart-sea",
 "name": "Berg of the Frozen Flame",
 "type": "wilderness",
 "description": "A city-sized iceberg in the Northern Ice-Flows, named for the orange flame that burns in its heart, a natural gas-vent that has burned since before the binding. The Berg-Witches make their home in caves carved into the ice around the flame; their Fire-Pacts allow them to walk barefoot on the ice and to call the Boreal Huldra from the floes.",
 "dangerLevel": "high",
 "factions": [
  "Icewhisper Coven"
 ],
 "connections": [
  "first-shore"
 ],
 "wyrdCreatures": [
  "Boreal Huldra"
 ]
 },
 {
 "id": "whaleroot-floe",
 "regionId": "iceheart-sea",
 "name": "Whaleroot Floe",
 "type": "wilderness",
 "description": "A flat pan of sea-ice in the Northern Ice-Flows, named for the whalebone pillars the Icewhisper Coven raised around its edge. The Coven performs the Bone-Reading here, they crack a frozen whale's ribs to read the future in the splinters. The floe drifts; only the Berg-Witches know where it will be in a season.",
 "dangerLevel": "medium",
 "factions": [
  "Icewhisper Coven"
 ],
 "connections": [
  "berg-of-the-frozen-flame"
 ],
 "wyrdCreatures": []
 },
 {
 "id": "blackteeth-isle",
 "regionId": "iceheart-sea",
 "name": "Blackteeth Isle",
 "type": "settlement",
 "description": "A volcanic island in the Merrow Archipelago, home to a Drift-Council representatives' house and a Brine-Bond Syndicate warehouse. The island's black-granite cliffs make a natural breakwater; the harbor is the second-busiest in the archipelago after Merrowport. The locals are fiercely loyal to the Drift-Council and despise Ironjaw Port's Neth administrators.",
 "dangerLevel": "low",
 "factions": [
  "Drift-Council",
  "Brine-Bond Syndicate"
 ],
 "connections": [
  "merrowport",
  "ironjaw-port"
 ],
 "wyrdCreatures": []
 },
 {
 "id": "the-lucky-anchor",
 "regionId": "iceheart-sea",
 "name": "The Lucky Anchor",
 "type": "settlement",
 "description": "A floating gambling-and-dock built on the hulls of three lashed Merryn warships, anchored in the lee of Blackteeth Isle. The Lucky Anchor is the most famous den of the Gambit tradition, Jax the Pirate is said to have wagered his lifeline here, against a storm-spirit, and won the first dice-weight of bog-iron filings that became the Gambit's signature. The current proprietor keeps the original dice under glass.",
 "dangerLevel": "low",
 "factions": [
  "Gambit (the gambling house)",
  "Merryn Gamblers' Guild"
 ],
 "connections": [
  "blackteeth-isle"
 ],
 "wyrdCreatures": []
 },
 {
 "id": "spindrift-lagoon",
 "regionId": "iceheart-sea",
 "name": "Spindrift Lagoon",
 "type": "settlement",
 "description": "A warm bioluminescent coral inlet on a volcanic island in the Merrow Archipelago, the only place in the Iceheart Sea where the water is warm enough to swim. The lagoon glows at night with light from the coral; the Shore Myrathil come here to spawn, and the lagoon is closed to surface traffic during the spawning season.",
 "dangerLevel": "low",
 "factions": [
  "Myrathil Shore",
  "Spindrift Spa-Cult (visiting)"
 ],
  "connections": [
   "merrowport",
   "deepwell-archipelago"
  ],
 "wyrdCreatures": [
  "Nereid"
 ]
 },

 // ========================================================================
 // NEW ZONES, MAP ENRICHMENT (Bryngloom Forest)
 // ========================================================================
 {
 "id": "the-great-mere",
 "regionId": "bryngloom-forest",
 "name": "The Great Mere",
 "type": "wilderness",
 "description": "The vast central lake of the Bryngloom Forest, dotted with small wooded islands. The Mere is the trade-hub of the forest, Merryn barges tie up at the lake-ports, Vreken shrines hide on the western islands, and an old Velun monastery stands on the largest. The lake level rises and falls with the moon; the islands that are above-water one season may be underwater the next.",
 "dangerLevel": "low",
 "factions": [
  "Lake-Council (joint Neth/Merryn)",
  "Monks of the Sunken Stone"
 ],
 "connections": [
  "monks-of-the-sunken-stone",
  "atropolis"
 ],
 "wyrdCreatures": [
  "Vatra"
 ]
 },
 {
 "id": "monks-of-the-sunken-stone",
 "regionId": "bryngloom-forest",
 "name": "Monks of the Sunken Stone",
 "type": "settlement",
 "description": "A Velun monastery on the largest island in the Great Mere, founded before the First Contract. The monks keep the lake's old record-stones, basalt slabs on which the original Neth clans carved their genealogies. The monastery is half-submerged in the high-water season; the monks live on platforms above the water-line and dive to read the stones in the low-water season.",
 "dangerLevel": "low",
 "factions": [
  "Monks of the Sunken Stone",
  "Velun Pact-Lords (visiting)"
 ],
 "connections": [
  "the-great-mere"
 ],
 "wyrdCreatures": []
 },
 {
 "id": "covenbane-stronghold",
 "regionId": "bryngloom-forest",
 "name": "Covenbane Stronghold",
 "type": "settlement",
 "description": "The Inquisition's seat in the western bayous, a grim fortress of black ironwood and cold-iron bars, built on the bones of a witch-trial gallows that once held three hundred accused. The hanging-cages are preserved as heritage. The Covenbane trains Inquisitors in cold-iron combat; the swamp outside the walls is mined with cold-iron stakes to keep the Coven's spirits out.",
 "dangerLevel": "medium",
 "factions": [
  "Covenbane Inquisition"
 ],
 "connections": [
  "hunters-gully",
  "drowned-dingle"
 ],
 "wyrdCreatures": []
 },
 {
 "id": "the-crypt-of-aedris",
 "regionId": "bryngloom-forest",
 "name": "The Crypt of Aedris",
 "type": "tomb",
 "description": "The deepest chamber of the Sunken Spire, where Aedris the First-Lit is interred in a basalt sarcophagus that glows with an eternal pale-moonlight. The Vault-Breath, a six-hour meditative technique, is taught to Veil-Speakers here; the eternal light is tended in shifts by silent priests. The Chamber of Records, where every Vreken who has ever lived has their name sung, lies below.",
 "dangerLevel": "high",
 "factions": [
  "Veil-Speakers",
  "Crypt-Council"
 ],
 "connections": [
  "the-sunken-spire"
 ],
 "wyrdCreatures": [
  "Lichborne Aedris"
 ]
 },
 {
 "id": "drowned-dingle",
 "regionId": "bryngloom-forest",
 "name": "Drowned Dingle",
 "type": "wilderness",
 "description": "A drowned forest in the western bayous, where the ironwood trunks stand black in a shallow lake of tannin-stained water. The Drowned Dingle is a smuggler's route, the Vreken peat-cutters use it to move un-registered peat past the Covenbane's checkpoints. The drowned wood is sacred to the Neth Kessen; they believe each submerged trunk is a sealed contract.",
 "dangerLevel": "medium",
 "factions": [
  "Vreken smugglers",
  "Neth Kessen (pilgrims)"
 ],
 "connections": [
  "hunters-gully",
  "covenbane-stronghold"
 ],
 "wyrdCreatures": [
  "Drowned-Wraith"
 ]
 },
 {
 "id": "hunters-gully",
 "regionId": "bryngloom-forest",
 "name": "Hunter's Gully",
 "type": "wilderness",
 "description": "A deep, narrow ravine in the western bayous, the only safe (if not exactly safe) path from the Bryngloom interior to the Covenbane Stronghold. The Covenbane patrols the Gully; the swamp-singers they purged once held their rites in the limestone caves along its walls. The gully still echoes with the old songs, when the wind is right.",
 "dangerLevel": "medium",
 "factions": [
  "Covenbane Inquisition (patrols)"
 ],
 "connections": [
  "covenbane-stronghold",
  "drowned-dingle"
 ],
 "wyrdCreatures": []
 },

 // ========================================================================
 // LEGACY ZONES, referenced in subregions.js but only had locationCoordinates
 // (restored to zoneData.js for full data integrity)
 // ========================================================================
 {
 "id": "the-shifting-fen",
 "regionId": "frostwood-reach",
 "name": "The Shifting Fen",
 "type": "wilderness",
 "description": "A peat-bog in the eastern Fens whose geography rearranges itself overnight, paths taken at dawn are not there at dusk, islands become pools, pools become solid ground. The Tethered Mimir say the Fen is a wound where the Reach's memory-fog has eaten a hole in the world; the Forgotten who shelter here say it is a place where Keth-Amar's tendrils cannot reach, because nothing here stays the same long enough to be remembered.",
 "dangerLevel": "high",
 "factions": [
  "Tethered Mimir",
  "The Forgotten"
 ],
 "connections": [
  "wraithfen",
  "mistbarrow"
 ],
 "wyrdCreatures": [
  "Drudehaunt"
 ]
 },
 {
 "id": "mistbarrow",
 "regionId": "frostwood-reach",
 "name": "Mistbarrow",
 "type": "ruin",
 "description": "A pre-Thalreth burial mound on the eastern edge of the Reach, untouched by the memory-fog for reasons no Scribe-Sentinel has ever been able to explain. The barrow predates House Thalreth; the original inhabitants are unknown. The Mist-Sentinels are forbidden to enter; the Florae come here to grieve for the Forgotten who have no other grave.",
 "dangerLevel": "medium",
 "factions": [
  "Trueborn Florae (pilgrims)"
 ],
 "connections": [
  "the-shifting-fen"
 ],
 "wyrdCreatures": []
 },
 {
 "id": "solvans-stand",
 "regionId": "sundale",
 "name": "Solvan's Stand",
 "type": "city",
 "description": "The dying capital of House Solvan, once thirty thousand strong, now under four thousand. The outer wall has lost forty feet to ashfall in the last century alone. The remaining Solvan families refuse to leave; the day the last Solvan leaves the ashfields is the day the house ceases to exist. The Stand is a city of ghosts and stubbornness, its basalt avenues half-buried, its fountains choked with ash.",
 "dangerLevel": "medium",
 "factions": [
  "House Solvan (Stewards)",
  "Solari Martyrs (veterans)"
 ],
 "connections": [
  "the-ashen-escarpment",
  "thornshire-colony"
 ],
 "wyrdCreatures": [
  "Sun-Husk"
  ]
  },
  {
  "id": "sun-keep",
  "regionId": "sundale",
  "name": "Sun-Keep",
  "type": "fortification",
  "description": "The headquarters of the Order of Solbrand, a fortress carved into the caldera wall of Emberspire. Its obsidian ramparts catch the thermal glow from the caldera below, making it appear perpetually lit from within. The Grandmaster of the Order commands the defense of Sundale's volcanic frontier from this keep, directing Solbrand knights across the Ashen Escarpment.",
  "dangerLevel": "high",
  "factions": [
   "order-of-solbrand"
  ],
  "connections": [
   "harath-vault",
   "the-ashen-escarpment",
   "emberspire-caldera"
  ],
  "wyrdCreatures": []
  },
  {
  "id": "lost-brood-vats",
 "regionId": "cragjaw-peaks",
 "name": "Lost Brood Vats",
 "type": "ruin",
 "description": "The abandoned chambers of the Deep Alchemists, sealed after the Lost Brood rebellion in the early generations of the Dimming. The vats are deep below Gearworks Gulch, accessible only through a Fexric service-shaft that was supposed to have been collapsed. Something survived the sealing. The Fexric refuse to speak of what.",
 "dangerLevel": "extreme",
 "factions": [],
 "connections": [
  "gearworks-gulch"
 ],
 "wyrdCreatures": [
  "Lost-Brood Remnant"
 ]
 },
 {
 "id": "root-veil-scriptorium",
 "regionId": "bryngloom-forest",
 "name": "The Root-Veil Scriptorium",
 "type": "settlement",
 "description": "The library of unbreakable memory at the heart of the Root-Veil, the deepest archive in the Bryngloom, where every Neth contract ever written is held in ironwood-root crystals. Morvane guards the entrance. Few have entered and returned; fewer still have entered and emerged unchanged.",
 "dangerLevel": "extreme",
 "factions": [
  "Morvane",
  "Root-Veil Coven"
 ],
  "connections": [
   "atropolis"
  ],
   "wyrdCreatures": [
    "Kessen-Wraith"
   ]
   },
   {
   "id": "thornwood-grove",
  "regionId": "frostwood-reach",
  "name": "Thornwood Grove",
  "type": "wilderness",
  "description": "A quiet grove of ironwood and thorn-vine three leagues east of the Shallows, known locally as the site of the Third Harvest massacre. The trees bear axe-marks from executions and the ground is saturated with alchemical residue. The grove is avoided by locals; the fog here tastes faintly of copper.",
  "dangerLevel": "moderate",
  "factions": [
   "scribe-cartel"
  ],
  "connections": [
   "the-shallows"
  ],
  "wyrdCreatures": []
  },
  // ───────────── ✦ MICRO-POI TEXTURE (auto-generated from the Seven Continents gazetteer) ─────────────
  {
   "id": "pebble-scribe-hamlet",
   "regionId": "frostwood-reach",
   "name": "Pebble-Scribe Hamlet",
   "type": "settlement",
   "description": "A clutch of peat-stone huts where junior scribes practice genealogies on slate before they earn real parchment. Tallow-candle smoke hangs in the fog.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "greymark-keep"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "hollow-stump-camp",
   "regionId": "frostwood-reach",
   "name": "Hollow-Stump Camp",
   "type": "wilderness",
   "description": "A woodcutters' camp inside a fallen petrified ironwood whose hollow trunk sleeps a dozen. Sap-smugglers work the deep groves from here.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "ironwood-heart"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "bog-cranberry-stands",
   "regionId": "frostwood-reach",
   "name": "Bog-Cranberry Stands",
   "type": "wilderness",
   "description": "Mist-bed gardens of tart cranberry used for pemmican. Fog-hares breed thick here; Mist-Sentinels collect a pelt-tithe.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "the-shallows"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "quillgate-toll-village",
   "regionId": "frostwood-reach",
   "name": "Quillgate Toll-Village",
   "type": "settlement",
   "description": "A Palisade checkpoint-village grown around the eastern toll-gate. Every traveler's journal is verified; the undocumented are turned back into the fog.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "greymark-keep"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "moss-wax-chandlers",
   "regionId": "frostwood-reach",
   "name": "Moss-Wax Chandlers' Cluster",
   "type": "settlement",
   "description": "A craft-hamlet of candle-makers who render fog-moss into Moss-Wax candles that burn blue-green and resist the damp. Their wares are the Reach's only reliable light.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "scribes-tower"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "heartwood-sap-camp",
   "regionId": "frostwood-reach",
   "name": "Heartwood Sap-Camp",
   "type": "wilderness",
   "description": "A black-market camp where smugglers tap the warm sap of the glowing white tree. Cartel enforcers and Briaran watchers both patrol the approaches.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "ironwood-heart"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "quillgate-crossroads",
   "regionId": "frostwood-reach",
   "name": "The Quillgate Crossroads",
   "type": "wilderness",
   "description": "A lantern-posted fork where the Greymark silt-road meets the Ironwood Palisade track. Mist-Sentinel lanterns mark the turns.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "greymark-keep"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "hollow-peat-pond",
   "regionId": "frostwood-reach",
   "name": "Hollow-Peat Pond",
   "type": "wilderness",
   "description": "A still black pond ringed by peat; locals say it has no bottom and that the fog here is thicker than anywhere in the Vales.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "the-shallows"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "amber-lamp-mile",
   "regionId": "frostwood-reach",
   "name": "The Amber-Lamp Mile",
   "type": "wilderness",
   "description": "A stretch of northern-river trade road lit by amber Moss-Wax lamps a mile apart. Skald river-barges tie up at each.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "skalds-landing"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "briar-thorn-tangle",
   "regionId": "frostwood-reach",
   "name": "Briar-Thorn Tangle",
   "type": "wilderness",
   "description": "A dense thorn-thicket masking a hidden Smooth-Skinned Briaran enclave. The thorns lie flat for those who know the old oaths.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "greythorn-copse"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "floating-stilt-hamlet",
   "regionId": "frostwood-reach",
   "name": "The Floating-Stilt Hamlet",
   "type": "settlement",
   "description": "A Forgotten camp built on stilt-rafts that drift with the fen's overnight shifts. No journal, no ledger, no law.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "wraithfen"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "wisp-willow-camp",
   "regionId": "frostwood-reach",
   "name": "Wisp-Willow Camp",
   "type": "settlement",
   "description": "An outcast camp under bioluminescent willows; Mote-carrying Fractured Mimir trade salvaged masks here.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "the-shifting-fen"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "thorn-refuge-copse",
   "regionId": "frostwood-reach",
   "name": "Thorn-Refuge Copse",
   "type": "wilderness",
   "description": "A hidden Unshorn Briaran refuge among thorn-trees, grown over a pre-Thalreth cairn.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "mistbarrow"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "lanternfen-pools",
   "regionId": "frostwood-reach",
   "name": "Lanternfen Pools",
   "type": "wilderness",
   "description": "Warm pools lit by floating Moss-Wax lanterns the Forgotten tend; their light keeps the Gambrel at bay.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "wraithfen"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "lost-name-pond",
   "regionId": "frostwood-reach",
   "name": "The Lost-Name Pond",
   "type": "wilderness",
   "description": "A pond no local can name; everyone who learns the name forgets it within a day. The water is perfectly still.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "the-shifting-fen"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "frost-tithe-cradle-camp",
   "regionId": "nordhalla",
   "name": "Frost-Tithe Cradle-Camp",
   "type": "settlement",
   "description": "A grief-camp of Ice-Cradles where Rime-Born mothers birth under the open sky, paying warmth to Keth-Amar's debt.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "frozen-archive"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "ravencall-eyrie",
   "regionId": "nordhalla",
   "name": "Ravencall Eyrie",
   "type": "settlement",
   "description": "A Corvani cliff-settlement of rope-ladders and murmuring ravens; messengers depart reading fate in flight.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "the-still-crag"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "glacier-song-hermitage",
   "regionId": "nordhalla",
   "name": "Glacier-Song Hermitage",
   "type": "settlement",
   "description": "A lone Rune Keeper outpost where the audible moan of the glacier is transcribed as augury.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "hunger-glaciers"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "mute-hearth-ruin",
   "regionId": "nordhalla",
   "name": "The Mute-Hearth",
   "type": "ruin",
   "description": "A ruined keep stubbornly warm from a single surviving steam vent; trappers shelter here but never speak its name.",
   "dangerLevel": "medium",
   "factions": [],
   "connections": [
    "rimors-hearth"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "cracked-cyst",
   "regionId": "nordhalla",
   "name": "The Cracked-Cyst",
   "type": "wilderness",
   "description": "A glacier split where blue light pulses beneath the ice — the Ice-Crown Monolith's distant glow.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "skadis-col"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "breathless-stair",
   "regionId": "nordhalla",
   "name": "The Breathless Stair",
   "type": "wilderness",
   "description": "A wind-scoured stair cut into the cliff to Þögn; Rime-Born climb it for memory-freezing rites.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "the-still-crag"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "hearth-glow-tavern-cluster",
   "regionId": "nordhalla",
   "name": "Hearth-Glow Tavern-Cluster",
   "type": "settlement",
   "description": "Taverns built over steaming vents where patrons grip frozen iron bars to prove lineage. Frost-mead flows freely.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "fjord-gate"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "whale-oil-row",
   "regionId": "nordhalla",
   "name": "Whale-Oil Row",
   "type": "settlement",
   "description": "Syndicate warehouse-row stacked with whale-oil casks; ironclads load harpoon-ammunition here.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "bloodhammer-sump"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "frost-mead-cellars",
   "regionId": "nordhalla",
   "name": "Frost-Mead Cellars",
   "type": "settlement",
   "description": "A geothermal cave-village brewing frost-mead; copper chits and coal-receipts trade hands.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "bloodhammer-sump"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "iron-ore-quay",
   "regionId": "nordhalla",
   "name": "Iron-Ore Quay",
   "type": "settlement",
   "description": "The Syndicate quay where iron-ore barges and whale-oil tankers load for the Iceheart run.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "fjord-gate"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "black-firth",
   "regionId": "nordhalla",
   "name": "The Black Firth",
   "type": "wilderness",
   "description": "An obsidian-cliffed inlet — the naval route for iron and oil, soot-streaked from ironclad funnels.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "fjord-gate"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "vargtower-beacon",
   "regionId": "nordhalla",
   "name": "Vargtower Beacon",
   "type": "wilderness",
   "description": "The signal-fire atop Vargtor's basalt tor; wolves gather at its base each dusk.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "vargtor"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "sulfur-prospect-camp",
   "regionId": "sundale",
   "name": "Sulfur-Prospect Camp",
   "type": "settlement",
   "description": "A Sulfur Cartel outpost where prospectors chip raw sulfur and pray between shifts.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "emberspire-caldera"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "cinderhoodoo-spires",
   "regionId": "sundale",
   "name": "Cinderhoodoo Spires",
   "type": "wilderness",
   "description": "Fire-scorched rock spires melted into face-shapes; they moan when the wind shifts.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "cinder-badlands"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "glassed-dunes",
   "regionId": "sundale",
   "name": "The Glassed Dunes",
   "type": "wilderness",
   "description": "Black volcanic glass dunes; footing is razor-sharp and the Wyrd bleeds thickest here.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "emberspire-caldera"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "ash-dweller-shanty",
   "regionId": "sundale",
   "name": "Ash-Dweller Shanty",
   "type": "settlement",
   "description": "Toxic surface shanties of Thrask miners and Solari refugees; 'Ashen Throat' lung-rot is universal.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "harath-vault"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "cinder-brew-distillery",
   "regionId": "sundale",
   "name": "Cinder-Brew Distillery Cluster",
   "type": "settlement",
   "description": "Stills brewing cinder-brew from soot-tolerant tubers; the only cheap drink in the fringe.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "great-forge"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "martyr-brigade-work-camp",
   "regionId": "sundale",
   "name": "Martyr-Brigade Work-Camp",
   "type": "settlement",
   "description": "A conscripted-youth labor camp mining obsidian in active rifts; casualties are routine.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "the-ashen-escarpment"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "obsidian-citadel-tollgate",
   "regionId": "sundale",
   "name": "Obsidian Citadel Tollgate",
   "type": "fortification",
   "description": "One of the Dawn Vigil fortress-chain blocking refugees; signal-fires burn atop each.",
   "dangerLevel": "medium",
   "factions": [],
   "connections": [
    "the-ashen-escarpment"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "sulfur-sump-pits",
   "regionId": "sundale",
   "name": "Sulfur-Sump Pits",
   "type": "wilderness",
   "description": "Steaming acidic pits where the Cartel extracts sulfur; the fumes etch bronze.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "vulkars-karst"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "salt-pans-fishing-camp",
   "regionId": "sundale",
   "name": "Salt-Pans Fishing Camp",
   "type": "settlement",
   "description": "Salt-panners and fishers working the cooling basalt shore; trade-outpost traffic is constant.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "basalt-shyr"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "wharf-dealers-row",
   "regionId": "sundale",
   "name": "Wharf-Dealer's Row",
   "type": "settlement",
   "description": "The boardwalk market of Ember Lagoon where Merryn captains and Dawn Vigil factors bargain.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "ember-lagoon"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "cinder-strait",
   "regionId": "sundale",
   "name": "The Cinder Strait",
   "type": "wilderness",
   "description": "The warm sea-route from Ember Lagoon to the Iceheart; the only safe water passage to Sundale.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "ember-lagoon"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "upper-deck-quarter",
   "regionId": "iceheart-sea",
   "name": "Upper-Deck Quarter",
   "type": "settlement",
   "description": "The wealthy topside district of lashed galleons; heated cabins, merchants, pact-clerks.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "merrowport"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "bilge-berths",
   "regionId": "iceheart-sea",
   "name": "The Bilge-Berths",
   "type": "settlement",
   "description": "The water-logged lower decks where pressed labor and coal-shovelers sleep in coal-dust.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "merrowport"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "ink-tattoo-chart-makers",
   "regionId": "iceheart-sea",
   "name": "Ink-Tattoo Chart-Makers' Hut",
   "type": "settlement",
   "description": "Where Merryn tattoo their voyage-contracts onto skin — the only documents the Drift-Council enforces.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "merrowport"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "coral-fishing-hamlet",
   "regionId": "iceheart-sea",
   "name": "Coral-Grown Fishing Hamlet",
   "type": "settlement",
   "description": "A bioluminescent hamlet of Breakers-Born Myrathil fishing the warm coral inlet.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "spindrift-lagoon"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "wave-kept-mooring",
   "regionId": "iceheart-sea",
   "name": "The Wave-Kept Mooring",
   "type": "wilderness",
   "description": "The Admiral's flagship's perpetual-station mooring; it never docks, only signals.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "merrowport"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "drowned-fleet-graveyard",
   "regionId": "iceheart-sea",
   "name": "The Drowned-Fleet Graveyard",
   "type": "wilderness",
   "description": "A shallows of wrecked hulls; Draugr Helmsman crew the half-sunken ships.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "gale-storm-shallows"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "eye-crossing",
   "regionId": "iceheart-sea",
   "name": "The Eye-Crossing",
   "type": "wilderness",
   "description": "A briefly-calm route through the storm-belt used by smugglers between windows of clearing.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "gale-storm-shallows"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "pressure-forge-caverns",
   "regionId": "iceheart-sea",
   "name": "Pressure-Forge Caverns",
   "type": "wilderness",
   "description": "Deep-Born Myrathil abyssal forge-cities carved into basalt; surface-folk cannot reach them.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "deepwell-archipelago"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "biolum-reef-mile",
   "regionId": "iceheart-sea",
   "name": "Biolum Reef-Mile",
   "type": "wilderness",
   "description": "A mile of glowing bioluminescent coral-reef under the ice-islands; the Deep-Born herd here.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "deepwell-archipelago"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "leviathan-coil",
   "regionId": "iceheart-sea",
   "name": "The Leviathan Coil",
   "type": "wilderness",
   "description": "The Treakous Rift site where the Abyssal Leviathan wraps the Depth-Breath Monolith.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "treakous-rift"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "breakers-born-liaison-dock",
   "regionId": "iceheart-sea",
   "name": "Breakers-Born Liaison Dock",
   "type": "settlement",
   "description": "The only surface-deep interface; Shore Myrathil ferry goods to the Deep-Born below.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "the-shivering-bight"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "icewhisper-huts",
   "regionId": "iceheart-sea",
   "name": "Icewhisper Coven Huts",
   "type": "settlement",
   "description": "A circle of Berg-Witch huts on the pilgrimage ice; they read fate in the floe-cracks.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "first-shore"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "frozen-rune-ruins",
   "regionId": "iceheart-sea",
   "name": "The Frozen-Rune Ruins",
   "type": "ruin",
   "description": "Pre-Mereval ruins protruding from First Shore's ice; the runes predate the Binding.",
   "dangerLevel": "medium",
   "factions": [],
   "connections": [
    "first-shore"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "free-port-stilt-wharves",
   "regionId": "iceheart-sea",
   "name": "Free-Port Stilt-Wharves",
   "type": "settlement",
   "description": "A lawless stilt-village of smugglers and exiles where no Sea-Pass is checked.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "the-saltmaw-estuary"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "half-salt-bog-hamlet",
   "regionId": "iceheart-sea",
   "name": "Half-Salt Bog Hamlet",
   "type": "settlement",
   "description": "A brackish-water hamlet of Vreken peat-cutters and pool-dwellers.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "the-saltmaw-estuary"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "mawed-sea-shrine",
   "regionId": "iceheart-sea",
   "name": "The Mawed-Sea Shrine",
   "type": "ruin",
   "description": "A shrine to a Forgotten-Cult of the Mawed Sea; offerings vanish into the brackish mud.",
   "dangerLevel": "medium",
   "factions": [],
   "connections": [
    "the-saltmaw-estuary"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "forge-of-alaric",
   "regionId": "cragjaw-peaks",
   "name": "The Forge of Alaric",
   "type": "settlement",
   "description": "The Warden order's first anvil where new Wardens drive their first chain-hook, supervised by Drall smiths.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "frostmaw-holdfast"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "frostmaw-chimney-galleries",
   "regionId": "cragjaw-peaks",
   "name": "Frostmaw Chimney-Galleries",
   "type": "settlement",
   "description": "Industrial high-pressure siphon-dwellings clinging to the volcanic plug's vents.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "frostmaw-holdfast"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "mita-terrace-camp",
   "regionId": "cragjaw-peaks",
   "name": "The Mit'a Terrace-Camp",
   "type": "settlement",
   "description": "Conscript labor-camp working the cliff-hanging andenes (terraces) that feed the keeps.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "frostmaw-massif"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "subterranean-vault-mouth",
   "regionId": "cragjaw-peaks",
   "name": "The Subterranean Vault-Mouth",
   "type": "wilderness",
   "description": "A sealed descent beneath Frostmaw to the chamber where snow has never fallen — a Monolith rests there.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "frostmaw-holdfast"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "ithran-toll-post-village",
   "regionId": "cragjaw-peaks",
   "name": "Ithran Toll-Post Village",
   "type": "settlement",
   "description": "A bridge-top toll-village of fine-scaled Groven diplomats; every crossing pays in kind or coin.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "the-spans"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "cliff-andene-terrace",
   "regionId": "cragjaw-peaks",
   "name": "Cliff-Andene Hanging-Terrace",
   "type": "settlement",
   "description": "A mid-altitude terrace-camp of Tessen soldiers and Murmur-Blooded bridge-tenders.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "deepchasm-keep"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "murmur-blood-hut",
   "regionId": "cragjaw-peaks",
   "name": "Murmur-Blood Bridge-Tender Hut",
   "type": "settlement",
   "description": "A mixed-caste outcast outpost tending the bone-spans; they are legally invisible.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "the-spans"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "the-broken-span",
   "regionId": "cragjaw-peaks",
   "name": "The Broken-Span",
   "type": "ruin",
   "description": "A ruined bone-bridge over the Great Gorge; its collapse isolated two keeps for a generation.",
   "dangerLevel": "medium",
   "factions": [],
   "connections": [
    "the-great-gorge"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "scrap-sump",
   "regionId": "cragjaw-peaks",
   "name": "The Scrap-Sump",
   "type": "settlement",
   "description": "The Drall clan-free capital beneath the holdfast floor; salvage, ingenuity, and spite.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "gearworks-gulch"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "blue-bite-tunnels",
   "regionId": "cragjaw-peaks",
   "name": "Blue-Bite Tunnels",
   "type": "settlement",
   "description": "An unheated chasm-ward of frostbite-rot ('Blue Bite') sufferers; Chasm-Dwellers sift runic waste.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "sump-galleries"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "reticulation-vault-camp",
   "regionId": "cragjaw-peaks",
   "name": "Reticulation Vault-Camp",
   "type": "settlement",
   "description": "A scrap-camp at unmapped pipe-junctions; Drall tinkerers salvage clockwork here.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "iron-ravine"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "deep-alchemist-shaft",
   "regionId": "cragjaw-peaks",
   "name": "The Deep-Alchemist Shaft",
   "type": "ruin",
   "description": "A sealed service-shaft to the Lost Brood Vats; the 800-yr Feral Brood may stir below.",
   "dangerLevel": "medium",
   "factions": [],
   "connections": [
    "lost-brood-vats"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "toxic-spore-hollow",
   "regionId": "cragjaw-peaks",
   "name": "Toxic-Spore Hollow",
   "type": "wilderness",
   "description": "A fungal pocket in the lower sumps; the Spore-Horror nests in the warm dark.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "sump-galleries"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "steam-pipe-grid",
   "regionId": "cragjaw-peaks",
   "name": "The Steam-Pipe Grid",
   "type": "wilderness",
   "description": "The labyrinth of geothermal pipes that heat the high keeps; the Steam-Line Cartel bleeds them.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "gearworks-gulch"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "wool-yurt-circle",
   "regionId": "sundrift-vale",
   "name": "Wool-Yurt Circle",
   "type": "settlement",
   "description": "A seasonal following-camp of the mare-herds; felt-and-bone yurts strike and raise with the migration.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "mound-camps"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "mare-herd-camp",
   "regionId": "sundrift-vale",
   "name": "Mare-Herd Following-Camp",
   "type": "settlement",
   "description": "A Mounted-clan camp tracking the Ordan mares across the Downs; Steppe-Staves record pasture-rights.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "kumis-downs"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "kumis-ferment-camp",
   "regionId": "sundrift-vale",
   "name": "Kumis-Ferment Camp",
   "type": "settlement",
   "description": "A camp of mares'-milk fermenters; the kumis-vats never stop.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "kumis-downs"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "unmounted-baggage-camp",
   "regionId": "sundrift-vale",
   "name": "Unmounted Baggage-Camp",
   "type": "settlement",
   "description": "The walking underclass's camp; they carry the yurts of the Mounted and are regarded as property.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "mound-camps"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "throat-song-hermit-hut",
   "regionId": "sundrift-vale",
   "name": "Throat-Song Hermit-Hut",
   "type": "settlement",
   "description": "A lone Sky-Singer's hut where outlawed constellation-singing is still practiced in secret.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "the-long-steppe"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "steppe-stave-cairn",
   "regionId": "sundrift-vale",
   "name": "Steppe-Stave Cairn",
   "type": "wilderness",
   "description": "A bone tally-stick cairn marking a migration waypoint; the notches encode clan and count.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "grass-tundra"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "dry-aquifer-beds",
   "regionId": "sundrift-vale",
   "name": "The Dry-Aquifer Beds",
   "type": "wilderness",
   "description": "Cracked beds where Thermal Bores drained the water table; sulfur-sinkholes open without warning.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "lien-stalked-grazes"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "mound-keepers-village",
   "regionId": "sundrift-vale",
   "name": "Mound-Keepers' Village",
   "type": "settlement",
   "description": "A solemn village tending the humming barrows; each keeper memorizes one mound's song.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "ancestor-mounds"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "pilgrim-knoll",
   "regionId": "sundrift-vale",
   "name": "Pilgrim-Knoll",
   "type": "wilderness",
   "description": "A barrow pilgrimage site where Astril come to hear Lumia's echo in the hum.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "ancestor-mounds"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "mound-eater-scar",
   "regionId": "sundrift-vale",
   "name": "The Mound-Eater Scar",
   "type": "ruin",
   "description": "A barrow silenced permanently by the Mound-Eater; no hum, no echo — a wound in the Wolds.",
   "dangerLevel": "medium",
   "factions": [],
   "connections": [
    "ancestor-mounds"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "crystal-lattice-spire-dwelling",
   "regionId": "sundrift-vale",
   "name": "Crystal-Lattice Spire-Dwelling",
   "type": "settlement",
   "description": "An Astril spire-residence in the Synod Hold where constellation-patterns glow on the walls.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "synod-hold"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "qilin-grazing-ground",
   "regionId": "sundrift-vale",
   "name": "Qilin Grazing-Ground",
   "type": "wilderness",
   "description": "A crystal-shard meadow where the single-horned Qilin are sighted at the crater's edge.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "starfall-vale"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "lien-crystal-beacon",
   "regionId": "sundrift-vale",
   "name": "Lien-Crystal Beacon",
   "type": "wilderness",
   "description": "A standing shard of trapped starlight used as a navigation beacon across the starless steppe.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "starfall-vale"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "unlit-veil-judgment-seat",
   "regionId": "sundrift-vale",
   "name": "The Unlit-Veil Judgment-Seat",
   "type": "ruin",
   "description": "A hidden chamber beneath Synod Hold where the Unlit Veil's shadow-council actually rules.",
   "dangerLevel": "medium",
   "factions": [],
   "connections": [
    "synod-hold"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "peat-edge-ford-hamlet",
   "regionId": "sundrift-vale",
   "name": "Peat-Edge Ford Hamlet",
   "type": "settlement",
   "description": "A hamlet at the marshy ford where Ordan horse-traders and Vreken peat-cutters meet and intermarry.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "morrens-bogpost"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "thermal-bore-sinkhole",
   "regionId": "sundrift-vale",
   "name": "Thermal-Bore Sinkhole",
   "type": "wilderness",
   "description": "A toxic sulfur-sinkhole opened by forced Fexric boring; it swallows migrating beasts.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "morrens-bogpost"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "neth-scribe-outpost",
   "regionId": "sundrift-vale",
   "name": "Neth-Scribe Outpost",
   "type": "settlement",
   "description": "A small Bryngloom Neth trade-annex recording the Bogpost's cross-border debts.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "morrens-bogpost"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "heart-vault-archive-hamlet",
   "regionId": "bryngloom-forest",
   "name": "Heart-Vault Archive-Hamlet",
   "type": "settlement",
   "description": "A pact-clerk hamlet around the tree holding the First Contract; memory-glass tablets are inscribed here.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "atropolis"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "memory-glass-workshop",
   "regionId": "bryngloom-forest",
   "name": "Memory-Glass Tablet-Workshop",
   "type": "settlement",
   "description": "Where artisans render memory into glass tablets; the smoke of it drifts through the canopy.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "atropolis"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "branch-walkway-dwelling",
   "regionId": "bryngloom-forest",
   "name": "Branch-Walkway Dwelling",
   "type": "settlement",
   "description": "A suspended neighborhood of living-branch walkways and ghost-silk bridges high above the bog.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "atropolis"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "peat-press-engine-camp",
   "regionId": "bryngloom-forest",
   "name": "Peat-Press Engine-Camp",
   "type": "settlement",
   "description": "A hated industrial camp running the steam presses that drain the swamp and rot the ironwood roots.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "peat-bog-sinks"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "tapestry-ward-boarding-house",
   "regionId": "bryngloom-forest",
   "name": "Tapestry-Ward Boarding-House",
   "type": "settlement",
   "description": "A state house where Mimir and frontier children are stripped of animism and trained in written logic.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "over-shanty"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "dangling-keel-tavern",
   "regionId": "bryngloom-forest",
   "name": "The Dangling Keel Tavern",
   "type": "settlement",
   "description": "A rope-bridge tavern hanging over the deepest bog; the Cult of Forgotten Shadow was founded in its cellars.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "over-shanty"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "lantern-eye-way",
   "regionId": "bryngloom-forest",
   "name": "Lantern-Eye Way",
   "type": "settlement",
   "description": "A lane down into the Spire lit by the rust-amber lantern-eyes of Clean Vreken residents.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "the-sunken-spire"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "marked-vrekin-rim-slum",
   "regionId": "bryngloom-forest",
   "name": "The Marked-Vreken Rim-Slum",
   "type": "settlement",
   "description": "The segregated silver-eyed Marked Vreken slum around the sinkhole's upper rim.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "the-sunken-spire"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "veil-speaker-chant-hall",
   "regionId": "bryngloom-forest",
   "name": "Veil-Speaker Chant-Hall",
   "type": "settlement",
   "description": "A fungal-shroud hall where Vreken chant to the ancestors wrapped in living mycelium.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "the-sunken-spire"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "pale-moonlight-floor",
   "regionId": "bryngloom-forest",
   "name": "The Pale-Moonlight Floor",
   "type": "wilderness",
   "description": "The sinkhole floor glowing with Aedris's eternal pale light; pilgrims descend in silence.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "the-sunken-spire"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "peat-press-forge-camp",
   "regionId": "bryngloom-forest",
   "name": "Peat-Press Forge-Camp",
   "type": "settlement",
   "description": "A Debt-Revenant chain-gang camp squeezing oil from the bog under Morrath Marshal whips.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "widows-quagmire"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "rot-fume-hut",
   "regionId": "bryngloom-forest",
   "name": "Rot-Fume Hut",
   "type": "settlement",
   "description": "A Vreken peat-cutter's hut breathing toxic rot-fumes; the Defaulted underclass lives here.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "black-fen"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "final-clause-marker",
   "regionId": "bryngloom-forest",
   "name": "The Final-Clause Marker",
   "type": "wilderness",
   "description": "The boundary stone of Black Fen, beyond which Morvane's contract-law has no jurisdiction.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "black-fen"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "contract-dumping-grounds",
   "regionId": "bryngloom-forest",
   "name": "The Contract-Dumping Grounds",
   "type": "wilderness",
   "description": "Where broken contracts — and those who broke them — are disposed of into the acid mud.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "widows-quagmire"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "probability-loom-house",
   "regionId": "bryngloom-forest",
   "name": "Probability-Loom House",
   "type": "settlement",
   "description": "A Kessen Neth village-house of living-wood looms where weavers read the forest's probability-web.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "aran-glen"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "fae-contract-bark-grove",
   "regionId": "bryngloom-forest",
   "name": "Fae-Contract Bark-Grove",
   "type": "wilderness",
   "description": "A grove of ironwoods carved with pre-Neth fae-contracts in their bark; older than the Registry.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "vel-keth-bayou"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "memory-glass-banks",
   "regionId": "bryngloom-forest",
   "name": "The Memory-Glass Banks",
   "type": "wilderness",
   "description": "Memory-glass deposits lining the uphill-flowing bayou; smugglers mine them without permit.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "vel-keth-bayou"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "toll-dike-gate",
   "regionId": "bryngloom-forest",
   "name": "Toll-Dike Gate",
   "type": "fortification",
   "description": "A living-ironwood toll-gate charging peat-debt for passage through the bayou channels.",
   "dangerLevel": "medium",
   "factions": [],
   "connections": [
    "vel-keth-bayou"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "first-contract-signing-hollow",
   "regionId": "bryngloom-forest",
   "name": "The First-Contract Signing-Hollow",
   "type": "ruin",
   "description": "The deep hollow where the Neth ancestors signed the First Contract with Morvane; still radiates authority.",
   "dangerLevel": "medium",
   "factions": [],
   "connections": [
    "root-veil-scriptorium"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "threshold-shrine-hermitage",
   "regionId": "bryngloom-forest",
   "name": "Threshold-Shrine Hermitage",
   "type": "settlement",
   "description": "A monastic hermitage of Hallowed Neth bound as Morvane's spirit-conduits over a deep sinkhole.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "root-veil-scriptorium"
   ],
   "wyrdCreatures": []
  },
  {
   "id": "hush-quiet-zone",
   "regionId": "bryngloom-forest",
   "name": "The Hush-Quiet Zone",
   "type": "wilderness",
   "description": "A stretch of root-tunnel where no birds, no wind, no sound persists; the Root-Veil breathes here.",
   "dangerLevel": "low",
   "factions": [],
   "connections": [
    "root-veil-scriptorium"
   ],
   "wyrdCreatures": []
  }
,
  // ───────────── ✦ MICRO-POI TEXTURE (auto-generated) ─────────────
  {
 "id": "pebble-scribe-hamlet",
 "regionId": "frostwood-reach",
 "name": "Pebble-Scribe Hamlet",
 "type": "settlement",
 "description": "A clutch of peat-stone huts where junior scribes practice genealogies on slate before they earn real parchment. Tallow-candle smoke hangs in the fog.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "greymark-keep"
 ],
 "wyrdCreatures": []
},
  {
 "id": "tallow-candle-wayhouse",
 "regionId": "frostwood-reach",
 "name": "Tallow-Candle Wayhouse",
 "type": "settlement",
 "description": "A coaching inn on the silt-road to Sundale. Travelers barter diary-keys for a warm bunk and a chained journal to record the day before the fog takes it.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "meadowglen-crossing"
 ],
 "wyrdCreatures": []
},
  {
 "id": "hollow-stump-camp",
 "regionId": "frostwood-reach",
 "name": "Hollow-Stump Camp",
 "type": "wilderness",
 "description": "A woodcutters' camp inside a fallen petrified ironwood whose hollow trunk sleeps a dozen. Sap-smugglers work the deep groves from here.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "ironwood-heart"
 ],
 "wyrdCreatures": []
},
  {
 "id": "bog-cranberry-stands",
 "regionId": "frostwood-reach",
 "name": "Bog-Cranberry Stands",
 "type": "wilderness",
 "description": "Mist-bed gardens of tart cranberry used for pemmican. Fog-hares breed thick here; Mist-Sentinels collect a pelt-tithe.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "the-shallows"
 ],
 "wyrdCreatures": []
},
  {
 "id": "quillgate-toll-village",
 "regionId": "frostwood-reach",
 "name": "Quillgate Toll-Village",
 "type": "settlement",
 "description": "A Palisade checkpoint-village grown around the eastern toll-gate. Every traveler's journal is verified; the undocumented are turned back into the fog.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "greymark-keep"
 ],
 "wyrdCreatures": []
},
  {
 "id": "moss-wax-chandlers",
 "regionId": "frostwood-reach",
 "name": "Moss-Wax Chandlers' Cluster",
 "type": "settlement",
 "description": "A craft-hamlet of candle-makers who render fog-moss into Moss-Wax candles that burn blue-green and resist the damp. Their wares are the Reach's only reliable light.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "scribes-tower"
 ],
 "wyrdCreatures": []
},
  {
 "id": "heartwood-sap-camp",
 "regionId": "frostwood-reach",
 "name": "Heartwood Sap-Camp",
 "type": "wilderness",
 "description": "A black-market camp where smugglers tap the warm sap of the glowing white tree. Cartel enforcers and Briaran watchers both patrol the approaches.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "ironwood-heart"
 ],
 "wyrdCreatures": []
},
  {
 "id": "chained-journal-inn",
 "regionId": "frostwood-reach",
 "name": "The Chained-Journal Coaching-Inn",
 "type": "settlement",
 "description": "Inn where every table bears a chained journal; patrons must log their lineage nightly. Diary-key chits serve as currency.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "meadowglen-crossing"
 ],
 "wyrdCreatures": []
},
  {
 "id": "quillgate-crossroads",
 "regionId": "frostwood-reach",
 "name": "The Quillgate Crossroads",
 "type": "wilderness",
 "description": "A lantern-posted fork where the Greymark silt-road meets the Ironwood Palisade track. Mist-Sentinel lanterns mark the turns.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "greymark-keep"
 ],
 "wyrdCreatures": []
},
  {
 "id": "hollow-peat-pond",
 "regionId": "frostwood-reach",
 "name": "Hollow-Peat Pond",
 "type": "wilderness",
 "description": "A still black pond ringed by peat; locals say it has no bottom and that the fog here is thicker than anywhere in the Vales.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "the-shallows"
 ],
 "wyrdCreatures": []
},
  {
 "id": "amber-lamp-mile",
 "regionId": "frostwood-reach",
 "name": "The Amber-Lamp Mile",
 "type": "wilderness",
 "description": "A stretch of northern-river trade road lit by amber Moss-Wax lamps a mile apart. Skald river-barges tie up at each.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "skalds-landing"
 ],
 "wyrdCreatures": []
},
  {
 "id": "briar-thorn-tangle",
 "regionId": "frostwood-reach",
 "name": "Briar-Thorn Tangle",
 "type": "wilderness",
 "description": "A dense thorn-thicket masking a hidden Smooth-Skinned Briaran enclave. The thorns lie flat for those who know the old oaths.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "greythorn-copse"
 ],
 "wyrdCreatures": []
},
  {
 "id": "frostwatch-ruin",
 "regionId": "frostwood-reach",
 "name": "Frostwatch Hold",
 "type": "ruin",
 "description": "A ruined Northwatch post on the tundra edge, partly re-manned. Signal-fires burn here when Jutul are sighted in the whiteout.",
 "dangerLevel": "medium",
 "factions": [],
 "connections": [
  "grevtholm"
 ],
 "wyrdCreatures": []
},
  {
 "id": "stonespeakers-camp",
 "regionId": "frostwood-reach",
 "name": "Stonespeakers' Camp",
 "type": "settlement",
 "description": "A ring of hide-tents around the secondary monolith-circle, tended by Skald expatriates preserving pre-Binding rune-lore the Thalreth deny.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "the-stone-circles"
 ],
 "wyrdCreatures": []
},
  {
 "id": "eight-week-melt-huts",
 "regionId": "frostwood-reach",
 "name": "Eight-Week-Melt Huts",
 "type": "settlement",
 "description": "Fishing huts usable only during Iron Lake's brief summer melt. Locals say drowned Jutul-maidens surface then.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "iron-lake"
 ],
 "wyrdCreatures": []
},
  {
 "id": "mammoth-bone-camp",
 "regionId": "frostwood-reach",
 "name": "Mammoth-Bone Trappers' Camp",
 "type": "settlement",
 "description": "A frontier camp built from mammoth rib-cages; Stone-Tribal trappers work the deep wastes from here.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "frostfang-wastes"
 ],
 "wyrdCreatures": []
},
  {
 "id": "cold-iron-waystation",
 "regionId": "frostwood-reach",
 "name": "Cold-Iron Waystation",
 "type": "settlement",
 "description": "The last warmed outpost before the deep Frostfang; an iron-stove kept lit by a single hermit-garrison.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "grevtholm"
 ],
 "wyrdCreatures": []
},
  {
 "id": "wind-teeth",
 "regionId": "frostwood-reach",
 "name": "The Wind-Teeth",
 "type": "wilderness",
 "description": "A line of granite spires sculpted by wind into jagged teeth. The gale through them can strip hide.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "frostfang-wastes"
 ],
 "wyrdCreatures": []
},
  {
 "id": "jutulstone",
 "regionId": "frostwood-reach",
 "name": "The Jutulstone",
 "type": "wilderness",
 "description": "A lone carved boulder, too high for human hands, bearing marks no Stone-Speaker will translate. Jutul raiders supposedly gather here.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "frostfang-wastes"
 ],
 "wyrdCreatures": []
},
  {
 "id": "eight-week-melt-ponds",
 "regionId": "frostwood-reach",
 "name": "Eight-Week Melt-Ponds",
 "type": "wilderness",
 "description": "Shallow pools that exist only in high summer, mirror-still, reflecting a sky the fog usually hides.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "iron-lake"
 ],
 "wyrdCreatures": []
},
  {
 "id": "floating-stilt-hamlet",
 "regionId": "frostwood-reach",
 "name": "The Floating-Stilt Hamlet",
 "type": "settlement",
 "description": "A Forgotten camp built on stilt-rafts that drift with the fen's overnight shifts. No journal, no ledger, no law.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "wraithfen"
 ],
 "wyrdCreatures": []
},
  {
 "id": "wisp-willow-camp",
 "regionId": "frostwood-reach",
 "name": "Wisp-Willow Camp",
 "type": "settlement",
 "description": "An outcast camp under bioluminescent willows; Mote-carrying Fractured Mimir trade salvaged masks here.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "the-shifting-fen"
 ],
 "wyrdCreatures": []
},
  {
 "id": "thorn-refuge-copse",
 "regionId": "frostwood-reach",
 "name": "Thorn-Refuge Copse",
 "type": "wilderness",
 "description": "A hidden Unshorn Briaran refuge among thorn-trees, grown over a pre-Thalreth cairn.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "mistbarrow"
 ],
 "wyrdCreatures": []
},
  {
 "id": "lanternfen-pools",
 "regionId": "frostwood-reach",
 "name": "Lanternfen Pools",
 "type": "wilderness",
 "description": "Warm pools lit by floating Moss-Wax lanterns the Forgotten tend; their light keeps the Gambrel at bay.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "wraithfen"
 ],
 "wyrdCreatures": []
},
  {
 "id": "lost-name-pond",
 "regionId": "frostwood-reach",
 "name": "The Lost-Name Pond",
 "type": "wilderness",
 "description": "A pond no local can name; everyone who learns the name forgets it within a day. The water is perfectly still.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "the-shifting-fen"
 ],
 "wyrdCreatures": []
},
  {
 "id": "frost-tithe-cradle-camp",
 "regionId": "nordhalla",
 "name": "Frost-Tithe Cradle-Camp",
 "type": "settlement",
 "description": "A grief-camp of Ice-Cradles where Rime-Born mothers birth under the open sky, paying warmth to Keth-Amar's debt.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "frozen-archive"
 ],
 "wyrdCreatures": []
},
  {
 "id": "ravencall-eyrie",
 "regionId": "nordhalla",
 "name": "Ravencall Eyrie",
 "type": "settlement",
 "description": "A Corvani cliff-settlement of rope-ladders and murmuring ravens; messengers depart reading fate in flight.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "the-still-crag"
 ],
 "wyrdCreatures": []
},
  {
 "id": "glacier-song-hermitage",
 "regionId": "nordhalla",
 "name": "Glacier-Song Hermitage",
 "type": "settlement",
 "description": "A lone Rune Keeper outpost where the audible moan of the glacier is transcribed as augury.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "hunger-glaciers"
 ],
 "wyrdCreatures": []
},
  {
 "id": "mute-hearth-ruin",
 "regionId": "nordhalla",
 "name": "The Mute-Hearth",
 "type": "ruin",
 "description": "A ruined keep stubbornly warm from a single surviving steam vent; trappers shelter here but never speak its name.",
 "dangerLevel": "medium",
 "factions": [],
 "connections": [
  "rimors-hearth"
 ],
 "wyrdCreatures": []
},
  {
 "id": "cracked-cyst",
 "regionId": "nordhalla",
 "name": "The Cracked-Cyst",
 "type": "wilderness",
 "description": "A glacier split where blue light pulses beneath the ice — the Ice-Crown Monolith's distant glow.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "skadis-col"
 ],
 "wyrdCreatures": []
},
  {
 "id": "breathless-stair",
 "regionId": "nordhalla",
 "name": "The Breathless Stair",
 "type": "wilderness",
 "description": "A wind-scoured stair cut into the cliff to Þögn; Rime-Born climb it for memory-freezing rites.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "the-still-crag"
 ],
 "wyrdCreatures": []
},
  {
 "id": "jaarn-tand-cairn-line",
 "regionId": "nordhalla",
 "name": "Járn-Tand's Cairn-Line",
 "type": "wilderness",
 "description": "A line of royal cairns marking the Sunder-Wall's taxed passage; wardens check passage-rights here.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "frosthold-citadel"
 ],
 "wyrdCreatures": []
},
  {
 "id": "hearth-glow-tavern-cluster",
 "regionId": "nordhalla",
 "name": "Hearth-Glow Tavern-Cluster",
 "type": "settlement",
 "description": "Taverns built over steaming vents where patrons grip frozen iron bars to prove lineage. Frost-mead flows freely.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "fjord-gate"
 ],
 "wyrdCreatures": []
},
  {
 "id": "whale-oil-row",
 "regionId": "nordhalla",
 "name": "Whale-Oil Row",
 "type": "settlement",
 "description": "Syndicate warehouse-row stacked with whale-oil casks; ironclads load harpoon-ammunition here.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "bloodhammer-sump"
 ],
 "wyrdCreatures": []
},
  {
 "id": "cod-drying-racks",
 "regionId": "nordhalla",
 "name": "Cod-Drying Racks of Eldonholm",
 "type": "settlement",
 "description": "The fish-curing heart of pure-blood Skald Eldonholm; racks line every cliff.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "eldonholm"
 ],
 "wyrdCreatures": []
},
  {
 "id": "frost-mead-cellars",
 "regionId": "nordhalla",
 "name": "Frost-Mead Cellars",
 "type": "settlement",
 "description": "A geothermal cave-village brewing frost-mead; copper chits and coal-receipts trade hands.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "bloodhammer-sump"
 ],
 "wyrdCreatures": []
},
  {
 "id": "iron-ore-quay",
 "regionId": "nordhalla",
 "name": "Iron-Ore Quay",
 "type": "settlement",
 "description": "The Syndicate quay where iron-ore barges and whale-oil tankers load for the Iceheart run.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "fjord-gate"
 ],
 "wyrdCreatures": []
},
  {
 "id": "black-firth",
 "regionId": "nordhalla",
 "name": "The Black Firth",
 "type": "wilderness",
 "description": "An obsidian-cliffed inlet — the naval route for iron and oil, soot-streaked from ironclad funnels.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "fjord-gate"
 ],
 "wyrdCreatures": []
},
  {
 "id": "vargtower-beacon",
 "regionId": "nordhalla",
 "name": "Vargtower Beacon",
 "type": "wilderness",
 "description": "The signal-fire atop Vargtor's basalt tor; wolves gather at its base each dusk.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "vargtor"
 ],
 "wyrdCreatures": []
},
  {
 "id": "three-hot-springs",
 "regionId": "nordhalla",
 "name": "The Three-Hot-Springs",
 "type": "settlement",
 "description": "Neutral geothermal pools where Skald, Merryn, and Frostbound share water and an uneasy truce.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "xardins-hearth"
 ],
 "wyrdCreatures": []
},
  {
 "id": "ash-tide-fishing-village",
 "regionId": "nordhalla",
 "name": "Ash-Tide Fishing Village",
 "type": "settlement",
 "description": "A black-sand hamlet living off the warm current; boats launch through ash-surf.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "xardins-hearth"
 ],
 "wyrdCreatures": []
},
  {
 "id": "outlaws-freshet",
 "regionId": "nordhalla",
 "name": "Outlaw's Freshet",
 "type": "settlement",
 "description": "A Fredløse camp at a freshwater spring behind the smuggler's cove.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "southern-shore-smugglers-cove"
 ],
 "wyrdCreatures": []
},
  {
 "id": "drowned-longship-reef",
 "regionId": "nordhalla",
 "name": "The Drowned-Longship Reef",
 "type": "wilderness",
 "description": "A reef of wrecked Skald longships; Skrei are said to drag divers down here.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "southern-shore-smugglers-cove"
 ],
 "wyrdCreatures": []
},
  {
 "id": "ember-tide-way",
 "regionId": "nordhalla",
 "name": "Ember-Tide Way",
 "type": "wilderness",
 "description": "The volcanic coast-road linking the southern ports to the coves; steam-vents warm the path.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "xardins-hearth"
 ],
 "wyrdCreatures": []
},
  {
 "id": "cinderbloom-purification-camp",
 "regionId": "sundale",
 "name": "Cinderbloom Purification Camp",
 "type": "settlement",
 "description": "Martyr pilgrims undergo the Vow at the red-lichen crater; many do not walk back.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "cinderbloom-crater"
 ],
 "wyrdCreatures": []
},
  {
 "id": "sulfur-prospect-camp",
 "regionId": "sundale",
 "name": "Sulfur-Prospect Camp",
 "type": "settlement",
 "description": "A Sulfur Cartel outpost where prospectors chip raw sulfur and pray between shifts.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "emberspire-caldera"
 ],
 "wyrdCreatures": []
},
  {
 "id": "pyrofiend-conventicle",
 "regionId": "sundale",
 "name": "Pyrofiend Conventicle",
 "type": "ruin",
 "description": "A hidden obsidian shrine in the lava-tubes where Scathrach's kindling is swallowed.",
 "dangerLevel": "medium",
 "factions": [],
 "connections": [
  "the-star-caves"
 ],
 "wyrdCreatures": []
},
  {
 "id": "cinderhoodoo-spires",
 "regionId": "sundale",
 "name": "Cinderhoodoo Spires",
 "type": "wilderness",
 "description": "Fire-scorched rock spires melted into face-shapes; they moan when the wind shifts.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "cinder-badlands"
 ],
 "wyrdCreatures": []
},
  {
 "id": "glassed-dunes",
 "regionId": "sundale",
 "name": "The Glassed Dunes",
 "type": "wilderness",
 "description": "Black volcanic glass dunes; footing is razor-sharp and the Wyrd bleeds thickest here.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "emberspire-caldera"
 ],
 "wyrdCreatures": []
},
  {
 "id": "spinstones-boundary",
 "regionId": "sundale",
 "name": "The Spinstones Boundary",
 "type": "wilderness",
 "description": "The ring of basalt columns carved with binding-runes marking the Ash-Heart's edge.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "spinstones-columns"
 ],
 "wyrdCreatures": []
},
  {
 "id": "ash-dweller-shanty",
 "regionId": "sundale",
 "name": "Ash-Dweller Shanty",
 "type": "settlement",
 "description": "Toxic surface shanties of Thrask miners and Solari refugees; 'Ashen Throat' lung-rot is universal.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "harath-vault"
 ],
 "wyrdCreatures": []
},
  {
 "id": "cinder-brew-distillery",
 "regionId": "sundale",
 "name": "Cinder-Brew Distillery Cluster",
 "type": "settlement",
 "description": "Stills brewing cinder-brew from soot-tolerant tubers; the only cheap drink in the fringe.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "great-forge"
 ],
 "wyrdCreatures": []
},
  {
 "id": "martyr-brigade-work-camp",
 "regionId": "sundale",
 "name": "Martyr-Brigade Work-Camp",
 "type": "settlement",
 "description": "A conscripted-youth labor camp mining obsidian in active rifts; casualties are routine.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "the-ashen-escarpment"
 ],
 "wyrdCreatures": []
},
  {
 "id": "obsidian-citadel-tollgate",
 "regionId": "sundale",
 "name": "Obsidian Citadel Tollgate",
 "type": "fortification",
 "description": "One of the Dawn Vigil fortress-chain blocking refugees; signal-fires burn atop each.",
 "dangerLevel": "medium",
 "factions": [],
 "connections": [
  "the-ashen-escarpment"
 ],
 "wyrdCreatures": []
},
  {
 "id": "sulfur-sump-pits",
 "regionId": "sundale",
 "name": "Sulfur-Sump Pits",
 "type": "wilderness",
 "description": "Steaming acidic pits where the Cartel extracts sulfur; the fumes etch bronze.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "vulkars-karst"
 ],
 "wyrdCreatures": []
},
  {
 "id": "solvan-sepulchre",
 "regionId": "sundale",
 "name": "The Solvan-Sepulchre",
 "type": "ruin",
 "description": "A royal ruin on the edge of the dying capital; Solvan heirs are quietly interred here.",
 "dangerLevel": "medium",
 "factions": [],
 "connections": [
  "solvans-stand"
 ],
 "wyrdCreatures": []
},
  {
 "id": "hot-spring-terrace-village",
 "regionId": "sundale",
 "name": "Hot-Spring Terrace Village",
 "type": "settlement",
 "description": "A stepped farm-village warmed by the meadow's geothermal network; the breadbasket of Sundale.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "meadowglen"
 ],
 "wyrdCreatures": []
},
  {
 "id": "oasis-grove-farmstead",
 "regionId": "sundale",
 "name": "Oasis-Grove Farmstead",
 "type": "settlement",
 "description": "A sheltered-valley hamlet growing fern-bulbs and vine-fern in volcanic soil.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "breezebough"
 ],
 "wyrdCreatures": []
},
  {
 "id": "salt-pans-fishing-camp",
 "regionId": "sundale",
 "name": "Salt-Pans Fishing Camp",
 "type": "settlement",
 "description": "Salt-panners and fishers working the cooling basalt shore; trade-outpost traffic is constant.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "basalt-shyr"
 ],
 "wyrdCreatures": []
},
  {
 "id": "wharf-dealers-row",
 "regionId": "sundale",
 "name": "Wharf-Dealer's Row",
 "type": "settlement",
 "description": "The boardwalk market of Ember Lagoon where Merryn captains and Dawn Vigil factors bargain.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "ember-lagoon"
 ],
 "wyrdCreatures": []
},
  {
 "id": "sun-shrine-mile",
 "regionId": "sundale",
 "name": "The Sun-Shrine Mile",
 "type": "wilderness",
 "description": "A line of small disc-altars along the meadow road where Solari still pray at dawn.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "meadowglen"
 ],
 "wyrdCreatures": []
},
  {
 "id": "cinder-strait",
 "regionId": "sundale",
 "name": "The Cinder Strait",
 "type": "wilderness",
 "description": "The warm sea-route from Ember Lagoon to the Iceheart; the only safe water passage to Sundale.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "ember-lagoon"
 ],
 "wyrdCreatures": []
},
  {
 "id": "hermits-hidden-valley",
 "regionId": "sundale",
 "name": "Hermit's Hidden Valley",
 "type": "settlement",
 "description": "A concealed valley camp of Dawn-Vigil defectors; they tend a crown-of-thorns shrine.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "the-glittering-forest"
 ],
 "wyrdCreatures": []
},
  {
 "id": "smooth-skinned-enclave",
 "regionId": "sundale",
 "name": "The Smooth-Skinned Enclave",
 "type": "settlement",
 "description": "A village of old Solari noble exiles living in longhouses grown into living trees.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "glitterwood-heart"
 ],
 "wyrdCreatures": []
},
  {
 "id": "crystal-stag-glade",
 "regionId": "sundale",
 "name": "Crystal-Stag Glade",
 "type": "wilderness",
 "description": "A clearing where the radiant Crystal-Stag is seen at dusk; the Risen consider it sacred.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "the-glittering-forest"
 ],
 "wyrdCreatures": []
},
  {
 "id": "isthmus-neck",
 "regionId": "sundale",
 "name": "The Isthmus Neck",
 "type": "wilderness",
 "description": "The narrow land-bridge connecting the Glitterwood peninsula to the mainland; the Dawn Vigil once blockaded it.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "the-glittering-forest"
 ],
 "wyrdCreatures": []
},
  {
 "id": "star-crystal-pond",
 "regionId": "sundale",
 "name": "Star-Crystal Pond",
 "type": "wilderness",
 "description": "A pond of crystal-clear water over crystal-soil; hermits bathe here to feel Sol's warmth.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "glitterwood-heart"
 ],
 "wyrdCreatures": []
},
  {
 "id": "upper-deck-quarter",
 "regionId": "iceheart-sea",
 "name": "Upper-Deck Quarter",
 "type": "settlement",
 "description": "The wealthy topside district of lashed galleons; heated cabins, merchants, pact-clerks.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "merrowport"
 ],
 "wyrdCreatures": []
},
  {
 "id": "bilge-berths",
 "regionId": "iceheart-sea",
 "name": "The Bilge-Berths",
 "type": "settlement",
 "description": "The water-logged lower decks where pressed labor and coal-shovelers sleep in coal-dust.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "merrowport"
 ],
 "wyrdCreatures": []
},
  {
 "id": "ink-tattoo-chart-makers",
 "regionId": "iceheart-sea",
 "name": "Ink-Tattoo Chart-Makers' Hut",
 "type": "settlement",
 "description": "Where Merryn tattoo their voyage-contracts onto skin — the only documents the Drift-Council enforces.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "merrowport"
 ],
 "wyrdCreatures": []
},
  {
 "id": "whale-oil-derrick-camp",
 "regionId": "iceheart-sea",
 "name": "Whale-Oil Derrick Camp",
 "type": "settlement",
 "description": "A volcanic-island camp rendering blubber; explosive harpoons are forged here.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "blackteeth-isle"
 ],
 "wyrdCreatures": []
},
  {
 "id": "coral-fishing-hamlet",
 "regionId": "iceheart-sea",
 "name": "Coral-Grown Fishing Hamlet",
 "type": "settlement",
 "description": "A bioluminescent hamlet of Breakers-Born Myrathil fishing the warm coral inlet.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "spindrift-lagoon"
 ],
 "wyrdCreatures": []
},
  {
 "id": "press-warrant-tavern",
 "regionId": "iceheart-sea",
 "name": "Press-Warrant Tavern-Cluster",
 "type": "settlement",
 "description": "Floating taverns on lashed hulls where Press-Warrants sweep the undocumented into naval servitude.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "the-lucky-anchor"
 ],
 "wyrdCreatures": []
},
  {
 "id": "wave-kept-mooring",
 "regionId": "iceheart-sea",
 "name": "The Wave-Kept Mooring",
 "type": "wilderness",
 "description": "The Admiral's flagship's perpetual-station mooring; it never docks, only signals.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "merrowport"
 ],
 "wyrdCreatures": []
},
  {
 "id": "stormspeakers-rim-shrine",
 "regionId": "iceheart-sea",
 "name": "Stormspeaker's Rim-Shrine",
 "type": "settlement",
 "description": "An animist camp on the vortex rim tending a shrine to the binding-storm.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "shard-window"
 ],
 "wyrdCreatures": []
},
  {
 "id": "drowned-fleet-graveyard",
 "regionId": "iceheart-sea",
 "name": "The Drowned-Fleet Graveyard",
 "type": "wilderness",
 "description": "A shallows of wrecked hulls; Draugr Helmsman crew the half-sunken ships.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "gale-storm-shallows"
 ],
 "wyrdCreatures": []
},
  {
 "id": "myriad-haunt",
 "regionId": "iceheart-sea",
 "name": "Myriad-Haunt",
 "type": "wilderness",
 "description": "A cluster of wraith-storm-spirits circling the Shard-Window; the Myriad scream in chorus.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "shard-window"
 ],
 "wyrdCreatures": []
},
  {
 "id": "eye-crossing",
 "regionId": "iceheart-sea",
 "name": "The Eye-Crossing",
 "type": "wilderness",
 "description": "A briefly-calm route through the storm-belt used by smugglers between windows of clearing.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "gale-storm-shallows"
 ],
 "wyrdCreatures": []
},
  {
 "id": "pressure-forge-caverns",
 "regionId": "iceheart-sea",
 "name": "Pressure-Forge Caverns",
 "type": "wilderness",
 "description": "Deep-Born Myrathil abyssal forge-cities carved into basalt; surface-folk cannot reach them.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "deepwell-archipelago"
 ],
 "wyrdCreatures": []
},
  {
 "id": "biolum-reef-mile",
 "regionId": "iceheart-sea",
 "name": "Biolum Reef-Mile",
 "type": "wilderness",
 "description": "A mile of glowing bioluminescent coral-reef under the ice-islands; the Deep-Born herd here.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "deepwell-archipelago"
 ],
 "wyrdCreatures": []
},
  {
 "id": "leviathan-coil",
 "regionId": "iceheart-sea",
 "name": "The Leviathan Coil",
 "type": "wilderness",
 "description": "The Treakous Rift site where the Abyssal Leviathan wraps the Depth-Breath Monolith.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "treakous-rift"
 ],
 "wyrdCreatures": []
},
  {
 "id": "breakers-born-liaison-dock",
 "regionId": "iceheart-sea",
 "name": "Breakers-Born Liaison Dock",
 "type": "settlement",
 "description": "The only surface-deep interface; Shore Myrathil ferry goods to the Deep-Born below.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "the-shivering-bight"
 ],
 "wyrdCreatures": []
},
  {
 "id": "icewhisper-huts",
 "regionId": "iceheart-sea",
 "name": "Icewhisper Coven Huts",
 "type": "settlement",
 "description": "A circle of Berg-Witch huts on the pilgrimage ice; they read fate in the floe-cracks.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "first-shore"
 ],
 "wyrdCreatures": []
},
  {
 "id": "whaler-oil-camp",
 "regionId": "iceheart-sea",
 "name": "Whaler-Oil Camp",
 "type": "settlement",
 "description": "A seasonal whalers' camp at the burning iceberg; oil-rendering fires never go out.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "berg-of-the-frozen-flame"
 ],
 "wyrdCreatures": []
},
  {
 "id": "frozen-rune-ruins",
 "regionId": "iceheart-sea",
 "name": "The Frozen-Rune Ruins",
 "type": "ruin",
 "description": "Pre-Mereval ruins protruding from First Shore's ice; the runes predate the Binding.",
 "dangerLevel": "medium",
 "factions": [],
 "connections": [
  "first-shore"
 ],
 "wyrdCreatures": []
},
  {
 "id": "crack-lane",
 "regionId": "iceheart-sea",
 "name": "The Crack-Lane",
 "type": "wilderness",
 "description": "A navigable fissure through the floes; the only lane deep enough for shallow-hulled boats.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "whaleroot-floe"
 ],
 "wyrdCreatures": []
},
  {
 "id": "letter-of-marque-anchorage",
 "regionId": "iceheart-sea",
 "name": "Letter-of-Marque Anchorage",
 "type": "settlement",
 "description": "The Pirate-Queen's licensed privateer anchorage beneath the abandoned fortress.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "saryreach-castle"
 ],
 "wyrdCreatures": []
},
  {
 "id": "smugglers-hidden-cove",
 "regionId": "iceheart-sea",
 "name": "Smuggler's Hidden Cove",
 "type": "settlement",
 "description": "A black-market cove behind the sea-stacks; goods move without Board of Trade seals.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "saryreach-castle"
 ],
 "wyrdCreatures": []
},
  {
 "id": "exile-colony-stack",
 "regionId": "iceheart-sea",
 "name": "Exile-Colony Stack",
 "type": "settlement",
 "description": "A skerry colony of exiled Neth and Tide-Speakers; they farm kelp and avoid oaths.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "blackteeth-skerry"
 ],
 "wyrdCreatures": []
},
  {
 "id": "mer-court-grotto",
 "regionId": "iceheart-sea",
 "name": "The Mer-Court Grotto",
 "type": "wilderness",
 "description": "A tidal grotto court of the Mer-Court emissaries; it floods twice daily on schedule.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "tide-court-cove"
 ],
 "wyrdCreatures": []
},
  {
 "id": "free-port-stilt-wharves",
 "regionId": "iceheart-sea",
 "name": "Free-Port Stilt-Wharves",
 "type": "settlement",
 "description": "A lawless stilt-village of smugglers and exiles where no Sea-Pass is checked.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "the-saltmaw-estuary"
 ],
 "wyrdCreatures": []
},
  {
 "id": "half-salt-bog-hamlet",
 "regionId": "iceheart-sea",
 "name": "Half-Salt Bog Hamlet",
 "type": "settlement",
 "description": "A brackish-water hamlet of Vreken peat-cutters and pool-dwellers.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "the-saltmaw-estuary"
 ],
 "wyrdCreatures": []
},
  {
 "id": "mawed-sea-shrine",
 "regionId": "iceheart-sea",
 "name": "The Mawed-Sea Shrine",
 "type": "ruin",
 "description": "A shrine to a Forgotten-Cult of the Mawed Sea; offerings vanish into the brackish mud.",
 "dangerLevel": "medium",
 "factions": [],
 "connections": [
  "the-saltmaw-estuary"
 ],
 "wyrdCreatures": []
},
  {
 "id": "forge-of-alaric",
 "regionId": "cragjaw-peaks",
 "name": "The Forge of Alaric",
 "type": "settlement",
 "description": "The Warden order's first anvil where new Wardens drive their first chain-hook, supervised by Drall smiths.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "frostmaw-holdfast"
 ],
 "wyrdCreatures": []
},
  {
 "id": "frostmaw-chimney-galleries",
 "regionId": "cragjaw-peaks",
 "name": "Frostmaw Chimney-Galleries",
 "type": "settlement",
 "description": "Industrial high-pressure siphon-dwellings clinging to the volcanic plug's vents.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "frostmaw-holdfast"
 ],
 "wyrdCreatures": []
},
  {
 "id": "mita-terrace-camp",
 "regionId": "cragjaw-peaks",
 "name": "The Mit'a Terrace-Camp",
 "type": "settlement",
 "description": "Conscript labor-camp working the cliff-hanging andenes (terraces) that feed the keeps.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "frostmaw-massif"
 ],
 "wyrdCreatures": []
},
  {
 "id": "skirmours-bone-heap",
 "regionId": "cragjaw-peaks",
 "name": "Skirmour's Bone-Heap",
 "type": "wilderness",
 "description": "A moraine of Jutul and Groven dead at the Jutul-king's sacred peak; none pass unchallenged.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "skirmours-crag"
 ],
 "wyrdCreatures": []
},
  {
 "id": "subterranean-vault-mouth",
 "regionId": "cragjaw-peaks",
 "name": "The Subterranean Vault-Mouth",
 "type": "wilderness",
 "description": "A sealed descent beneath Frostmaw to the chamber where snow has never fallen — a Monolith rests there.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "frostmaw-holdfast"
 ],
 "wyrdCreatures": []
},
  {
 "id": "ithran-toll-post-village",
 "regionId": "cragjaw-peaks",
 "name": "Ithran Toll-Post Village",
 "type": "settlement",
 "description": "A bridge-top toll-village of fine-scaled Groven diplomats; every crossing pays in kind or coin.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "the-spans"
 ],
 "wyrdCreatures": []
},
  {
 "id": "cliff-andene-terrace",
 "regionId": "cragjaw-peaks",
 "name": "Cliff-Andene Hanging-Terrace",
 "type": "settlement",
 "description": "A mid-altitude terrace-camp of Tessen soldiers and Murmur-Blooded bridge-tenders.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "deepchasm-keep"
 ],
 "wyrdCreatures": []
},
  {
 "id": "murmur-blood-hut",
 "regionId": "cragjaw-peaks",
 "name": "Murmur-Blood Bridge-Tender Hut",
 "type": "settlement",
 "description": "A mixed-caste outcast outpost tending the bone-spans; they are legally invisible.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "the-spans"
 ],
 "wyrdCreatures": []
},
  {
 "id": "the-broken-span",
 "regionId": "cragjaw-peaks",
 "name": "The Broken-Span",
 "type": "ruin",
 "description": "A ruined bone-bridge over the Great Gorge; its collapse isolated two keeps for a generation.",
 "dangerLevel": "medium",
 "factions": [],
 "connections": [
  "the-great-gorge"
 ],
 "wyrdCreatures": []
},
  {
 "id": "knors-wind-throat",
 "regionId": "cragjaw-peaks",
 "name": "Knor's Wind-Throat",
 "type": "wilderness",
 "description": "A howling wind-narrow in the Alley of Knor; the blow can lift a Groven from their feet.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "alley-of-knor"
 ],
 "wyrdCreatures": []
},
  {
 "id": "scrap-sump",
 "regionId": "cragjaw-peaks",
 "name": "The Scrap-Sump",
 "type": "settlement",
 "description": "The Drall clan-free capital beneath the holdfast floor; salvage, ingenuity, and spite.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "gearworks-gulch"
 ],
 "wyrdCreatures": []
},
  {
 "id": "blue-bite-tunnels",
 "regionId": "cragjaw-peaks",
 "name": "Blue-Bite Tunnels",
 "type": "settlement",
 "description": "An unheated chasm-ward of frostbite-rot ('Blue Bite') sufferers; Chasm-Dwellers sift runic waste.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "sump-galleries"
 ],
 "wyrdCreatures": []
},
  {
 "id": "reticulation-vault-camp",
 "regionId": "cragjaw-peaks",
 "name": "Reticulation Vault-Camp",
 "type": "settlement",
 "description": "A scrap-camp at unmapped pipe-junctions; Drall tinkerers salvage clockwork here.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "iron-ravine"
 ],
 "wyrdCreatures": []
},
  {
 "id": "deep-alchemist-shaft",
 "regionId": "cragjaw-peaks",
 "name": "The Deep-Alchemist Shaft",
 "type": "ruin",
 "description": "A sealed service-shaft to the Lost Brood Vats; the 800-yr Feral Brood may stir below.",
 "dangerLevel": "medium",
 "factions": [],
 "connections": [
  "lost-brood-vats"
 ],
 "wyrdCreatures": []
},
  {
 "id": "toxic-spore-hollow",
 "regionId": "cragjaw-peaks",
 "name": "Toxic-Spore Hollow",
 "type": "wilderness",
 "description": "A fungal pocket in the lower sumps; the Spore-Horror nests in the warm dark.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "sump-galleries"
 ],
 "wyrdCreatures": []
},
  {
 "id": "steam-pipe-grid",
 "regionId": "cragjaw-peaks",
 "name": "The Steam-Pipe Grid",
 "type": "wilderness",
 "description": "The labyrinth of geothermal pipes that heat the high keeps; the Steam-Line Cartel bleeds them.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "gearworks-gulch"
 ],
 "wyrdCreatures": []
},
  {
 "id": "wool-yurt-circle",
 "regionId": "sundrift-vale",
 "name": "Wool-Yurt Circle",
 "type": "settlement",
 "description": "A seasonal following-camp of the mare-herds; felt-and-bone yurts strike and raise with the migration.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "mound-camps"
 ],
 "wyrdCreatures": []
},
  {
 "id": "mare-herd-camp",
 "regionId": "sundrift-vale",
 "name": "Mare-Herd Following-Camp",
 "type": "settlement",
 "description": "A Mounted-clan camp tracking the Ordan mares across the Downs; Steppe-Staves record pasture-rights.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "kumis-downs"
 ],
 "wyrdCreatures": []
},
  {
 "id": "kumis-ferment-camp",
 "regionId": "sundrift-vale",
 "name": "Kumis-Ferment Camp",
 "type": "settlement",
 "description": "A camp of mares'-milk fermenters; the kumis-vats never stop.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "kumis-downs"
 ],
 "wyrdCreatures": []
},
  {
 "id": "unmounted-baggage-camp",
 "regionId": "sundrift-vale",
 "name": "Unmounted Baggage-Camp",
 "type": "settlement",
 "description": "The walking underclass's camp; they carry the yurts of the Mounted and are regarded as property.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "mound-camps"
 ],
 "wyrdCreatures": []
},
  {
 "id": "throat-song-hermit-hut",
 "regionId": "sundrift-vale",
 "name": "Throat-Song Hermit-Hut",
 "type": "settlement",
 "description": "A lone Sky-Singer's hut where outlawed constellation-singing is still practiced in secret.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "the-long-steppe"
 ],
 "wyrdCreatures": []
},
  {
 "id": "steppe-stave-cairn",
 "regionId": "sundrift-vale",
 "name": "Steppe-Stave Cairn",
 "type": "wilderness",
 "description": "A bone tally-stick cairn marking a migration waypoint; the notches encode clan and count.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "grass-tundra"
 ],
 "wyrdCreatures": []
},
  {
 "id": "dry-aquifer-beds",
 "regionId": "sundrift-vale",
 "name": "The Dry-Aquifer Beds",
 "type": "wilderness",
 "description": "Cracked beds where Thermal Bores drained the water table; sulfur-sinkholes open without warning.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "lien-stalked-grazes"
 ],
 "wyrdCreatures": []
},
  {
 "id": "mound-keepers-village",
 "regionId": "sundrift-vale",
 "name": "Mound-Keepers' Village",
 "type": "settlement",
 "description": "A solemn village tending the humming barrows; each keeper memorizes one mound's song.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "ancestor-mounds"
 ],
 "wyrdCreatures": []
},
  {
 "id": "echo-singer-death-camp",
 "regionId": "sundrift-vale",
 "name": "Echo-Singer Death-Camp",
 "type": "settlement",
 "description": "Where old Sky-Singers come to die at the crystallized-impact circle; their last songs are recorded.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "novas-heath"
 ],
 "wyrdCreatures": []
},
  {
 "id": "cairn-checkpoint-garrison",
 "regionId": "sundrift-vale",
 "name": "Cairn-Checkpoint Garrison",
 "type": "settlement",
 "description": "An Ordan March-Warden post enforcing the Herd-Tithe at the cairn-line.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "the-moundwatch"
 ],
 "wyrdCreatures": []
},
  {
 "id": "pilgrim-knoll",
 "regionId": "sundrift-vale",
 "name": "Pilgrim-Knoll",
 "type": "wilderness",
 "description": "A barrow pilgrimage site where Astril come to hear Lumia's echo in the hum.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "ancestor-mounds"
 ],
 "wyrdCreatures": []
},
  {
 "id": "mound-eater-scar",
 "regionId": "sundrift-vale",
 "name": "The Mound-Eater Scar",
 "type": "ruin",
 "description": "A barrow silenced permanently by the Mound-Eater; no hum, no echo — a wound in the Wolds.",
 "dangerLevel": "medium",
 "factions": [],
 "connections": [
  "ancestor-mounds"
 ],
 "wyrdCreatures": []
},
  {
 "id": "crystal-lattice-spire-dwelling",
 "regionId": "sundrift-vale",
 "name": "Crystal-Lattice Spire-Dwelling",
 "type": "settlement",
 "description": "An Astril spire-residence in the Synod Hold where constellation-patterns glow on the walls.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "synod-hold"
 ],
 "wyrdCreatures": []
},
  {
 "id": "qilin-grazing-ground",
 "regionId": "sundrift-vale",
 "name": "Qilin Grazing-Ground",
 "type": "wilderness",
 "description": "A crystal-shard meadow where the single-horned Qilin are sighted at the crater's edge.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "starfall-vale"
 ],
 "wyrdCreatures": []
},
  {
 "id": "lien-crystal-beacon",
 "regionId": "sundrift-vale",
 "name": "Lien-Crystal Beacon",
 "type": "wilderness",
 "description": "A standing shard of trapped starlight used as a navigation beacon across the starless steppe.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "starfall-vale"
 ],
 "wyrdCreatures": []
},
  {
 "id": "unlit-veil-judgment-seat",
 "regionId": "sundrift-vale",
 "name": "The Unlit-Veil Judgment-Seat",
 "type": "ruin",
 "description": "A hidden chamber beneath Synod Hold where the Unlit Veil's shadow-council actually rules.",
 "dangerLevel": "medium",
 "factions": [],
 "connections": [
  "synod-hold"
 ],
 "wyrdCreatures": []
},
  {
 "id": "peat-edge-ford-hamlet",
 "regionId": "sundrift-vale",
 "name": "Peat-Edge Ford Hamlet",
 "type": "settlement",
 "description": "A hamlet at the marshy ford where Ordan horse-traders and Vreken peat-cutters meet and intermarry.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "morrens-bogpost"
 ],
 "wyrdCreatures": []
},
  {
 "id": "thermal-bore-sinkhole",
 "regionId": "sundrift-vale",
 "name": "Thermal-Bore Sinkhole",
 "type": "wilderness",
 "description": "A toxic sulfur-sinkhole opened by forced Fexric boring; it swallows migrating beasts.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "morrens-bogpost"
 ],
 "wyrdCreatures": []
},
  {
 "id": "neth-scribe-outpost",
 "regionId": "sundrift-vale",
 "name": "Neth-Scribe Outpost",
 "type": "settlement",
 "description": "A small Bryngloom Neth trade-annex recording the Bogpost's cross-border debts.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "morrens-bogpost"
 ],
 "wyrdCreatures": []
},
  {
 "id": "sentry-yurt-post",
 "regionId": "sundrift-vale",
 "name": "Sentry-Yurt Post",
 "type": "settlement",
 "description": "A wind-blasted Ordan frontier post watching the Snow-Tooth passes for Frostwood patrols.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "blizzard-bluff"
 ],
 "wyrdCreatures": []
},
  {
 "id": "wind-neck-pass",
 "regionId": "sundrift-vale",
 "name": "The Wind-Neck",
 "type": "wilderness",
 "description": "The lowest pass through Blizzard Bluff; the only route foot-traffic can cross in winter.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "blizzard-bluff"
 ],
 "wyrdCreatures": []
},
  {
 "id": "frostwood-meeting-stones",
 "regionId": "sundrift-vale",
 "name": "Frostwood-Thalren Meeting-Stones",
 "type": "wilderness",
 "description": "Cairns where Frostwood and Sundrift patrols meet to exchange weather-reports and warnings.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "blizzard-bluff"
 ],
 "wyrdCreatures": []
},
  {
 "id": "heart-vault-archive-hamlet",
 "regionId": "bryngloom-forest",
 "name": "Heart-Vault Archive-Hamlet",
 "type": "settlement",
 "description": "A pact-clerk hamlet around the tree holding the First Contract; memory-glass tablets are inscribed here.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "atropolis"
 ],
 "wyrdCreatures": []
},
  {
 "id": "memory-glass-workshop",
 "regionId": "bryngloom-forest",
 "name": "Memory-Glass Tablet-Workshop",
 "type": "settlement",
 "description": "Where artisans render memory into glass tablets; the smoke of it drifts through the canopy.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "atropolis"
 ],
 "wyrdCreatures": []
},
  {
 "id": "branch-walkway-dwelling",
 "regionId": "bryngloom-forest",
 "name": "Branch-Walkway Dwelling",
 "type": "settlement",
 "description": "A suspended neighborhood of living-branch walkways and ghost-silk bridges high above the bog.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "atropolis"
 ],
 "wyrdCreatures": []
},
  {
 "id": "peat-press-engine-camp",
 "regionId": "bryngloom-forest",
 "name": "Peat-Press Engine-Camp",
 "type": "settlement",
 "description": "A hated industrial camp running the steam presses that drain the swamp and rot the ironwood roots.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "peat-bog-sinks"
 ],
 "wyrdCreatures": []
},
  {
 "id": "tapestry-ward-boarding-house",
 "regionId": "bryngloom-forest",
 "name": "Tapestry-Ward Boarding-House",
 "type": "settlement",
 "description": "A state house where Mimir and frontier children are stripped of animism and trained in written logic.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "over-shanty"
 ],
 "wyrdCreatures": []
},
  {
 "id": "dangling-keel-tavern",
 "regionId": "bryngloom-forest",
 "name": "The Dangling Keel Tavern",
 "type": "settlement",
 "description": "A rope-bridge tavern hanging over the deepest bog; the Cult of Forgotten Shadow was founded in its cellars.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "over-shanty"
 ],
 "wyrdCreatures": []
},
  {
 "id": "lantern-eye-way",
 "regionId": "bryngloom-forest",
 "name": "Lantern-Eye Way",
 "type": "settlement",
 "description": "A lane down into the Spire lit by the rust-amber lantern-eyes of Clean Vreken residents.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "the-sunken-spire"
 ],
 "wyrdCreatures": []
},
  {
 "id": "marked-vrekin-rim-slum",
 "regionId": "bryngloom-forest",
 "name": "The Marked-Vrekin Rim-Slum",
 "type": "settlement",
 "description": "The segregated silver-eyed Marked Vreken slum around the sinkhole upper rim.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "the-sunken-spire"
 ],
 "wyrdCreatures": []
},
  {
 "id": "veil-speaker-chant-hall",
 "regionId": "bryngloom-forest",
 "name": "Veil-Speaker Chant-Hall",
 "type": "settlement",
 "description": "A fungal-shroud hall where Vreken chant to the ancestors wrapped in living mycelium.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "the-sunken-spire"
 ],
 "wyrdCreatures": []
},
  {
 "id": "pale-moonlight-floor",
 "regionId": "bryngloom-forest",
 "name": "The Pale-Moonlight Floor",
 "type": "wilderness",
 "description": "The sinkhole floor glowing with Aedris's eternal pale light; pilgrims descend in silence.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "the-sunken-spire"
 ],
 "wyrdCreatures": []
},
  {
 "id": "peat-press-forge-camp",
 "regionId": "bryngloom-forest",
 "name": "Peat-Press Forge-Camp",
 "type": "settlement",
 "description": "A Debt-Revenant chain-gang camp squeezing oil from the bog under Morrath Marshal whips.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "widows-quagmire"
 ],
 "wyrdCreatures": []
},
  {
 "id": "rot-fume-hut",
 "regionId": "bryngloom-forest",
 "name": "Rot-Fume Hut",
 "type": "settlement",
 "description": "A Vreken peat-cutter's hut breathing toxic rot-fumes; the Defaulted underclass lives here.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "black-fen"
 ],
 "wyrdCreatures": []
},
  {
 "id": "final-clause-marker",
 "regionId": "bryngloom-forest",
 "name": "The Final-Clause Marker",
 "type": "wilderness",
 "description": "The boundary stone of Black Fen, beyond which Morvane's contract-law has no jurisdiction.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "black-fen"
 ],
 "wyrdCreatures": []
},
  {
 "id": "contract-dumping-grounds",
 "regionId": "bryngloom-forest",
 "name": "The Contract-Dumping Grounds",
 "type": "wilderness",
 "description": "Where broken contracts — and those who broke them — are disposed of into the acid mud.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "widows-quagmire"
 ],
 "wyrdCreatures": []
},
  {
 "id": "probability-loom-house",
 "regionId": "bryngloom-forest",
 "name": "Probability-Loom House",
 "type": "settlement",
 "description": "A Kessen Neth village-house of living-wood looms where weavers read the forest's probability-web.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "aran-glen"
 ],
 "wyrdCreatures": []
},
  {
 "id": "fae-contract-bark-grove",
 "regionId": "bryngloom-forest",
 "name": "Fae-Contract Bark-Grove",
 "type": "wilderness",
 "description": "A grove of ironwoods carved with pre-Neth fae-contracts in their bark; older than the Registry.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "vel-keth-bayou"
 ],
 "wyrdCreatures": []
},
  {
 "id": "memory-glass-banks",
 "regionId": "bryngloom-forest",
 "name": "The Memory-Glass Banks",
 "type": "wilderness",
 "description": "Memory-glass deposits lining the uphill-flowing bayou; smugglers mine them without permit.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "vel-keth-bayou"
 ],
 "wyrdCreatures": []
},
  {
 "id": "swamp-singer-purge-site",
 "regionId": "bryngloom-forest",
 "name": "Swamp-Singer Purge-Site",
 "type": "ruin",
 "description": "A ruin where the Inquisition rooted out Swamp-Song animists; the molds here are silent.",
 "dangerLevel": "medium",
 "factions": [],
 "connections": [
  "covenbane-stronghold"
 ],
 "wyrdCreatures": []
},
  {
 "id": "toll-dike-gate",
 "regionId": "bryngloom-forest",
 "name": "Toll-Dike Gate",
 "type": "fortification",
 "description": "A living-ironwood toll-gate charging peat-debt for passage through the bayou channels.",
 "dangerLevel": "medium",
 "factions": [],
 "connections": [
  "vel-keth-bayou"
 ],
 "wyrdCreatures": []
},
  {
 "id": "merryn-barge-port",
 "regionId": "bryngloom-forest",
 "name": "Merryn Barge-Port",
 "type": "settlement",
 "description": "A lashed-houseboat port on the Mere's shore; Merryn lake-traders moor here by season.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "the-great-mere"
 ],
 "wyrdCreatures": []
},
  {
 "id": "vreken-shrine-islet",
 "regionId": "bryngloom-forest",
 "name": "Vreken Shrine-Islet",
 "type": "settlement",
 "description": "A forbidden islet holding a Vreken fungal shrine; only the moon-tide reveals the path.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "monks-of-the-sunken-stone"
 ],
 "wyrdCreatures": []
},
  {
 "id": "forbidden-isle",
 "regionId": "bryngloom-forest",
 "name": "The Forbidden Isle",
 "type": "wilderness",
 "description": "An unmapped Mere island where the most binding oaths are sealed — and broken.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "the-great-mere"
 ],
 "wyrdCreatures": []
},
  {
 "id": "moon-tide-shore",
 "regionId": "bryngloom-forest",
 "name": "Moon-Tide Shore",
 "type": "wilderness",
 "description": "The shore that shifts with the moon-tide; what is dry land at dawn may be lakebed by dusk.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "the-great-mere"
 ],
 "wyrdCreatures": []
},
  {
 "id": "first-contract-signing-hollow",
 "regionId": "bryngloom-forest",
 "name": "The First-Contract Signing-Hollow",
 "type": "ruin",
 "description": "The deep hollow where the Neth ancestors signed the First Contract with Morvane; still radiates authority.",
 "dangerLevel": "medium",
 "factions": [],
 "connections": [
  "root-veil-scriptorium"
 ],
 "wyrdCreatures": []
},
  {
 "id": "threshold-shrine-hermitage",
 "regionId": "bryngloom-forest",
 "name": "Threshold-Shrine Hermitage",
 "type": "settlement",
 "description": "A monastic hermitage of Hallowed Neth bound as Morvane's spirit-conduits over a deep sinkhole.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "root-veil-scriptorium"
 ],
 "wyrdCreatures": []
},
  {
 "id": "hush-quiet-zone",
 "regionId": "bryngloom-forest",
 "name": "The Hush-Quiet Zone",
 "type": "wilderness",
 "description": "A stretch of root-tunnel where no birds, no wind, no sound persists; the Root-Veil breathes here.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "root-veil-scriptorium"
 ],
 "wyrdCreatures": []
}
,
  // ───────────── ✦ MICRO-POI TEXTURE (auto-generated) ─────────────
  {
 "id": "pebble-scribe-hamlet",
 "regionId": "frostwood-reach",
 "name": "Pebble-Scribe Hamlet",
 "type": "settlement",
 "description": "A clutch of peat-stone huts where junior scribes practice genealogies on slate before they earn real parchment. Tallow-candle smoke hangs in the fog.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "greymark-keep"
 ],
 "wyrdCreatures": []
},
  {
 "id": "tallow-candle-wayhouse",
 "regionId": "frostwood-reach",
 "name": "Tallow-Candle Wayhouse",
 "type": "settlement",
 "description": "A coaching inn on the silt-road to Sundale. Travelers barter diary-keys for a warm bunk and a chained journal to record the day before the fog takes it.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "meadowglen-crossing"
 ],
 "wyrdCreatures": []
},
  {
 "id": "hollow-stump-camp",
 "regionId": "frostwood-reach",
 "name": "Hollow-Stump Camp",
 "type": "wilderness",
 "description": "A woodcutters' camp inside a fallen petrified ironwood whose hollow trunk sleeps a dozen. Sap-smugglers work the deep groves from here.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "ironwood-heart"
 ],
 "wyrdCreatures": []
},
  {
 "id": "bog-cranberry-stands",
 "regionId": "frostwood-reach",
 "name": "Bog-Cranberry Stands",
 "type": "wilderness",
 "description": "Mist-bed gardens of tart cranberry used for pemmican. Fog-hares breed thick here; Mist-Sentinels collect a pelt-tithe.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "the-shallows"
 ],
 "wyrdCreatures": []
},
  {
 "id": "quillgate-toll-village",
 "regionId": "frostwood-reach",
 "name": "Quillgate Toll-Village",
 "type": "settlement",
 "description": "A Palisade checkpoint-village grown around the eastern toll-gate. Every traveler's journal is verified; the undocumented are turned back into the fog.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "greymark-keep"
 ],
 "wyrdCreatures": []
},
  {
 "id": "moss-wax-chandlers",
 "regionId": "frostwood-reach",
 "name": "Moss-Wax Chandlers' Cluster",
 "type": "settlement",
 "description": "A craft-hamlet of candle-makers who render fog-moss into Moss-Wax candles that burn blue-green and resist the damp. Their wares are the Reach's only reliable light.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "scribes-tower"
 ],
 "wyrdCreatures": []
},
  {
 "id": "heartwood-sap-camp",
 "regionId": "frostwood-reach",
 "name": "Heartwood Sap-Camp",
 "type": "wilderness",
 "description": "A black-market camp where smugglers tap the warm sap of the glowing white tree. Cartel enforcers and Briaran watchers both patrol the approaches.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "ironwood-heart"
 ],
 "wyrdCreatures": []
},
  {
 "id": "chained-journal-inn",
 "regionId": "frostwood-reach",
 "name": "The Chained-Journal Coaching-Inn",
 "type": "settlement",
 "description": "Inn where every table bears a chained journal; patrons must log their lineage nightly. Diary-key chits serve as currency.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "meadowglen-crossing"
 ],
 "wyrdCreatures": []
},
  {
 "id": "quillgate-crossroads",
 "regionId": "frostwood-reach",
 "name": "The Quillgate Crossroads",
 "type": "wilderness",
 "description": "A lantern-posted fork where the Greymark silt-road meets the Ironwood Palisade track. Mist-Sentinel lanterns mark the turns.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "greymark-keep"
 ],
 "wyrdCreatures": []
},
  {
 "id": "hollow-peat-pond",
 "regionId": "frostwood-reach",
 "name": "Hollow-Peat Pond",
 "type": "wilderness",
 "description": "A still black pond ringed by peat; locals say it has no bottom and that the fog here is thicker than anywhere in the Vales.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "the-shallows"
 ],
 "wyrdCreatures": []
},
  {
 "id": "amber-lamp-mile",
 "regionId": "frostwood-reach",
 "name": "The Amber-Lamp Mile",
 "type": "wilderness",
 "description": "A stretch of northern-river trade road lit by amber Moss-Wax lamps a mile apart. Skald river-barges tie up at each.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "skalds-landing"
 ],
 "wyrdCreatures": []
},
  {
 "id": "briar-thorn-tangle",
 "regionId": "frostwood-reach",
 "name": "Briar-Thorn Tangle",
 "type": "wilderness",
 "description": "A dense thorn-thicket masking a hidden Smooth-Skinned Briaran enclave. The thorns lie flat for those who know the old oaths.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "greythorn-copse"
 ],
 "wyrdCreatures": []
},
  {
 "id": "frostwatch-ruin",
 "regionId": "frostwood-reach",
 "name": "Frostwatch Hold",
 "type": "ruin",
 "description": "A ruined Northwatch post on the tundra edge, partly re-manned. Signal-fires burn here when Jutul are sighted in the whiteout.",
 "dangerLevel": "medium",
 "factions": [],
 "connections": [
  "grevtholm"
 ],
 "wyrdCreatures": []
},
  {
 "id": "stonespeakers-camp",
 "regionId": "frostwood-reach",
 "name": "Stonespeakers' Camp",
 "type": "settlement",
 "description": "A ring of hide-tents around the secondary monolith-circle, tended by Skald expatriates preserving pre-Binding rune-lore the Thalreth deny.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "the-stone-circles"
 ],
 "wyrdCreatures": []
},
  {
 "id": "eight-week-melt-huts",
 "regionId": "frostwood-reach",
 "name": "Eight-Week-Melt Huts",
 "type": "settlement",
 "description": "Fishing huts usable only during Iron Lake's brief summer melt. Locals say drowned Jutul-maidens surface then.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "iron-lake"
 ],
 "wyrdCreatures": []
},
  {
 "id": "mammoth-bone-camp",
 "regionId": "frostwood-reach",
 "name": "Mammoth-Bone Trappers' Camp",
 "type": "settlement",
 "description": "A frontier camp built from mammoth rib-cages; Stone-Tribal trappers work the deep wastes from here.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "frostfang-wastes"
 ],
 "wyrdCreatures": []
},
  {
 "id": "cold-iron-waystation",
 "regionId": "frostwood-reach",
 "name": "Cold-Iron Waystation",
 "type": "settlement",
 "description": "The last warmed outpost before the deep Frostfang; an iron-stove kept lit by a single hermit-garrison.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "grevtholm"
 ],
 "wyrdCreatures": []
},
  {
 "id": "wind-teeth",
 "regionId": "frostwood-reach",
 "name": "The Wind-Teeth",
 "type": "wilderness",
 "description": "A line of granite spires sculpted by wind into jagged teeth. The gale through them can strip hide.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "frostfang-wastes"
 ],
 "wyrdCreatures": []
},
  {
 "id": "jutulstone",
 "regionId": "frostwood-reach",
 "name": "The Jutulstone",
 "type": "wilderness",
 "description": "A lone carved boulder, too high for human hands, bearing marks no Stone-Speaker will translate. Jutul raiders supposedly gather here.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "frostfang-wastes"
 ],
 "wyrdCreatures": []
},
  {
 "id": "eight-week-melt-ponds",
 "regionId": "frostwood-reach",
 "name": "Eight-Week Melt-Ponds",
 "type": "wilderness",
 "description": "Shallow pools that exist only in high summer, mirror-still, reflecting a sky the fog usually hides.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "iron-lake"
 ],
 "wyrdCreatures": []
},
  {
 "id": "floating-stilt-hamlet",
 "regionId": "frostwood-reach",
 "name": "The Floating-Stilt Hamlet",
 "type": "settlement",
 "description": "A Forgotten camp built on stilt-rafts that drift with the fen's overnight shifts. No journal, no ledger, no law.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "wraithfen"
 ],
 "wyrdCreatures": []
},
  {
 "id": "wisp-willow-camp",
 "regionId": "frostwood-reach",
 "name": "Wisp-Willow Camp",
 "type": "settlement",
 "description": "An outcast camp under bioluminescent willows; Mote-carrying Fractured Mimir trade salvaged masks here.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "the-shifting-fen"
 ],
 "wyrdCreatures": []
},
  {
 "id": "thorn-refuge-copse",
 "regionId": "frostwood-reach",
 "name": "Thorn-Refuge Copse",
 "type": "wilderness",
 "description": "A hidden Unshorn Briaran refuge among thorn-trees, grown over a pre-Thalreth cairn.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "mistbarrow"
 ],
 "wyrdCreatures": []
},
  {
 "id": "lanternfen-pools",
 "regionId": "frostwood-reach",
 "name": "Lanternfen Pools",
 "type": "wilderness",
 "description": "Warm pools lit by floating Moss-Wax lanterns the Forgotten tend; their light keeps the Gambrel at bay.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "wraithfen"
 ],
 "wyrdCreatures": []
},
  {
 "id": "lost-name-pond",
 "regionId": "frostwood-reach",
 "name": "The Lost-Name Pond",
 "type": "wilderness",
 "description": "A pond no local can name; everyone who learns the name forgets it within a day. The water is perfectly still.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "the-shifting-fen"
 ],
 "wyrdCreatures": []
},
  {
 "id": "frost-tithe-cradle-camp",
 "regionId": "nordhalla",
 "name": "Frost-Tithe Cradle-Camp",
 "type": "settlement",
 "description": "A grief-camp of Ice-Cradles where Rime-Born mothers birth under the open sky, paying warmth to Keth-Amar's debt.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "frozen-archive"
 ],
 "wyrdCreatures": []
},
  {
 "id": "ravencall-eyrie",
 "regionId": "nordhalla",
 "name": "Ravencall Eyrie",
 "type": "settlement",
 "description": "A Corvani cliff-settlement of rope-ladders and murmuring ravens; messengers depart reading fate in flight.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "the-still-crag"
 ],
 "wyrdCreatures": []
},
  {
 "id": "glacier-song-hermitage",
 "regionId": "nordhalla",
 "name": "Glacier-Song Hermitage",
 "type": "settlement",
 "description": "A lone Rune Keeper outpost where the audible moan of the glacier is transcribed as augury.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "hunger-glaciers"
 ],
 "wyrdCreatures": []
},
  {
 "id": "mute-hearth-ruin",
 "regionId": "nordhalla",
 "name": "The Mute-Hearth",
 "type": "ruin",
 "description": "A ruined keep stubbornly warm from a single surviving steam vent; trappers shelter here but never speak its name.",
 "dangerLevel": "medium",
 "factions": [],
 "connections": [
  "rimors-hearth"
 ],
 "wyrdCreatures": []
},
  {
 "id": "cracked-cyst",
 "regionId": "nordhalla",
 "name": "The Cracked-Cyst",
 "type": "wilderness",
 "description": "A glacier split where blue light pulses beneath the ice — the Ice-Crown Monolith's distant glow.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "skadis-col"
 ],
 "wyrdCreatures": []
},
  {
 "id": "breathless-stair",
 "regionId": "nordhalla",
 "name": "The Breathless Stair",
 "type": "wilderness",
 "description": "A wind-scoured stair cut into the cliff to Þögn; Rime-Born climb it for memory-freezing rites.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "the-still-crag"
 ],
 "wyrdCreatures": []
},
  {
 "id": "jaarn-tand-cairn-line",
 "regionId": "nordhalla",
 "name": "Járn-Tand's Cairn-Line",
 "type": "wilderness",
 "description": "A line of royal cairns marking the Sunder-Wall's taxed passage; wardens check passage-rights here.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "frosthold-citadel"
 ],
 "wyrdCreatures": []
},
  {
 "id": "hearth-glow-tavern-cluster",
 "regionId": "nordhalla",
 "name": "Hearth-Glow Tavern-Cluster",
 "type": "settlement",
 "description": "Taverns built over steaming vents where patrons grip frozen iron bars to prove lineage. Frost-mead flows freely.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "fjord-gate"
 ],
 "wyrdCreatures": []
},
  {
 "id": "whale-oil-row",
 "regionId": "nordhalla",
 "name": "Whale-Oil Row",
 "type": "settlement",
 "description": "Syndicate warehouse-row stacked with whale-oil casks; ironclads load harpoon-ammunition here.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "bloodhammer-sump"
 ],
 "wyrdCreatures": []
},
  {
 "id": "cod-drying-racks",
 "regionId": "nordhalla",
 "name": "Cod-Drying Racks of Eldonholm",
 "type": "settlement",
 "description": "The fish-curing heart of pure-blood Skald Eldonholm; racks line every cliff.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "eldonholm"
 ],
 "wyrdCreatures": []
},
  {
 "id": "frost-mead-cellars",
 "regionId": "nordhalla",
 "name": "Frost-Mead Cellars",
 "type": "settlement",
 "description": "A geothermal cave-village brewing frost-mead; copper chits and coal-receipts trade hands.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "bloodhammer-sump"
 ],
 "wyrdCreatures": []
},
  {
 "id": "iron-ore-quay",
 "regionId": "nordhalla",
 "name": "Iron-Ore Quay",
 "type": "settlement",
 "description": "The Syndicate quay where iron-ore barges and whale-oil tankers load for the Iceheart run.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "fjord-gate"
 ],
 "wyrdCreatures": []
},
  {
 "id": "black-firth",
 "regionId": "nordhalla",
 "name": "The Black Firth",
 "type": "wilderness",
 "description": "An obsidian-cliffed inlet — the naval route for iron and oil, soot-streaked from ironclad funnels.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "fjord-gate"
 ],
 "wyrdCreatures": []
},
  {
 "id": "vargtower-beacon",
 "regionId": "nordhalla",
 "name": "Vargtower Beacon",
 "type": "wilderness",
 "description": "The signal-fire atop Vargtor's basalt tor; wolves gather at its base each dusk.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "vargtor"
 ],
 "wyrdCreatures": []
},
  {
 "id": "three-hot-springs",
 "regionId": "nordhalla",
 "name": "The Three-Hot-Springs",
 "type": "settlement",
 "description": "Neutral geothermal pools where Skald, Merryn, and Frostbound share water and an uneasy truce.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "xardins-hearth"
 ],
 "wyrdCreatures": []
},
  {
 "id": "ash-tide-fishing-village",
 "regionId": "nordhalla",
 "name": "Ash-Tide Fishing Village",
 "type": "settlement",
 "description": "A black-sand hamlet living off the warm current; boats launch through ash-surf.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "xardins-hearth"
 ],
 "wyrdCreatures": []
},
  {
 "id": "outlaws-freshet",
 "regionId": "nordhalla",
 "name": "Outlaw's Freshet",
 "type": "settlement",
 "description": "A Fredløse camp at a freshwater spring behind the smuggler's cove.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "southern-shore-smugglers-cove"
 ],
 "wyrdCreatures": []
},
  {
 "id": "drowned-longship-reef",
 "regionId": "nordhalla",
 "name": "The Drowned-Longship Reef",
 "type": "wilderness",
 "description": "A reef of wrecked Skald longships; Skrei are said to drag divers down here.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "southern-shore-smugglers-cove"
 ],
 "wyrdCreatures": []
},
  {
 "id": "ember-tide-way",
 "regionId": "nordhalla",
 "name": "Ember-Tide Way",
 "type": "wilderness",
 "description": "The volcanic coast-road linking the southern ports to the coves; steam-vents warm the path.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "xardins-hearth"
 ],
 "wyrdCreatures": []
},
  {
 "id": "cinderbloom-purification-camp",
 "regionId": "sundale",
 "name": "Cinderbloom Purification Camp",
 "type": "settlement",
 "description": "Martyr pilgrims undergo the Vow at the red-lichen crater; many do not walk back.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "cinderbloom-crater"
 ],
 "wyrdCreatures": []
},
  {
 "id": "sulfur-prospect-camp",
 "regionId": "sundale",
 "name": "Sulfur-Prospect Camp",
 "type": "settlement",
 "description": "A Sulfur Cartel outpost where prospectors chip raw sulfur and pray between shifts.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "emberspire-caldera"
 ],
 "wyrdCreatures": []
},
  {
 "id": "pyrofiend-conventicle",
 "regionId": "sundale",
 "name": "Pyrofiend Conventicle",
 "type": "ruin",
 "description": "A hidden obsidian shrine in the lava-tubes where Scathrach's kindling is swallowed.",
 "dangerLevel": "medium",
 "factions": [],
 "connections": [
  "the-star-caves"
 ],
 "wyrdCreatures": []
},
  {
 "id": "cinderhoodoo-spires",
 "regionId": "sundale",
 "name": "Cinderhoodoo Spires",
 "type": "wilderness",
 "description": "Fire-scorched rock spires melted into face-shapes; they moan when the wind shifts.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "cinder-badlands"
 ],
 "wyrdCreatures": []
},
  {
 "id": "glassed-dunes",
 "regionId": "sundale",
 "name": "The Glassed Dunes",
 "type": "wilderness",
 "description": "Black volcanic glass dunes; footing is razor-sharp and the Wyrd bleeds thickest here.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "emberspire-caldera"
 ],
 "wyrdCreatures": []
},
  {
 "id": "spinstones-boundary",
 "regionId": "sundale",
 "name": "The Spinstones Boundary",
 "type": "wilderness",
 "description": "The ring of basalt columns carved with binding-runes marking the Ash-Heart's edge.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "spinstones-columns"
 ],
 "wyrdCreatures": []
},
  {
 "id": "ash-dweller-shanty",
 "regionId": "sundale",
 "name": "Ash-Dweller Shanty",
 "type": "settlement",
 "description": "Toxic surface shanties of Thrask miners and Solari refugees; 'Ashen Throat' lung-rot is universal.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "harath-vault"
 ],
 "wyrdCreatures": []
},
  {
 "id": "cinder-brew-distillery",
 "regionId": "sundale",
 "name": "Cinder-Brew Distillery Cluster",
 "type": "settlement",
 "description": "Stills brewing cinder-brew from soot-tolerant tubers; the only cheap drink in the fringe.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "great-forge"
 ],
 "wyrdCreatures": []
},
  {
 "id": "martyr-brigade-work-camp",
 "regionId": "sundale",
 "name": "Martyr-Brigade Work-Camp",
 "type": "settlement",
 "description": "A conscripted-youth labor camp mining obsidian in active rifts; casualties are routine.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "the-ashen-escarpment"
 ],
 "wyrdCreatures": []
},
  {
 "id": "obsidian-citadel-tollgate",
 "regionId": "sundale",
 "name": "Obsidian Citadel Tollgate",
 "type": "fortification",
 "description": "One of the Dawn Vigil fortress-chain blocking refugees; signal-fires burn atop each.",
 "dangerLevel": "medium",
 "factions": [],
 "connections": [
  "the-ashen-escarpment"
 ],
 "wyrdCreatures": []
},
  {
 "id": "sulfur-sump-pits",
 "regionId": "sundale",
 "name": "Sulfur-Sump Pits",
 "type": "wilderness",
 "description": "Steaming acidic pits where the Cartel extracts sulfur; the fumes etch bronze.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "vulkars-karst"
 ],
 "wyrdCreatures": []
},
  {
 "id": "solvan-sepulchre",
 "regionId": "sundale",
 "name": "The Solvan-Sepulchre",
 "type": "ruin",
 "description": "A royal ruin on the edge of the dying capital; Solvan heirs are quietly interred here.",
 "dangerLevel": "medium",
 "factions": [],
 "connections": [
  "solvans-stand"
 ],
 "wyrdCreatures": []
},
  {
 "id": "hot-spring-terrace-village",
 "regionId": "sundale",
 "name": "Hot-Spring Terrace Village",
 "type": "settlement",
 "description": "A stepped farm-village warmed by the meadow's geothermal network; the breadbasket of Sundale.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "meadowglen"
 ],
 "wyrdCreatures": []
},
  {
 "id": "oasis-grove-farmstead",
 "regionId": "sundale",
 "name": "Oasis-Grove Farmstead",
 "type": "settlement",
 "description": "A sheltered-valley hamlet growing fern-bulbs and vine-fern in volcanic soil.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "breezebough"
 ],
 "wyrdCreatures": []
},
  {
 "id": "salt-pans-fishing-camp",
 "regionId": "sundale",
 "name": "Salt-Pans Fishing Camp",
 "type": "settlement",
 "description": "Salt-panners and fishers working the cooling basalt shore; trade-outpost traffic is constant.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "basalt-shyr"
 ],
 "wyrdCreatures": []
},
  {
 "id": "wharf-dealers-row",
 "regionId": "sundale",
 "name": "Wharf-Dealer's Row",
 "type": "settlement",
 "description": "The boardwalk market of Ember Lagoon where Merryn captains and Dawn Vigil factors bargain.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "ember-lagoon"
 ],
 "wyrdCreatures": []
},
  {
 "id": "sun-shrine-mile",
 "regionId": "sundale",
 "name": "The Sun-Shrine Mile",
 "type": "wilderness",
 "description": "A line of small disc-altars along the meadow road where Solari still pray at dawn.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "meadowglen"
 ],
 "wyrdCreatures": []
},
  {
 "id": "cinder-strait",
 "regionId": "sundale",
 "name": "The Cinder Strait",
 "type": "wilderness",
 "description": "The warm sea-route from Ember Lagoon to the Iceheart; the only safe water passage to Sundale.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "ember-lagoon"
 ],
 "wyrdCreatures": []
},
  {
 "id": "hermits-hidden-valley",
 "regionId": "sundale",
 "name": "Hermit's Hidden Valley",
 "type": "settlement",
 "description": "A concealed valley camp of Dawn-Vigil defectors; they tend a crown-of-thorns shrine.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "the-glittering-forest"
 ],
 "wyrdCreatures": []
},
  {
 "id": "smooth-skinned-enclave",
 "regionId": "sundale",
 "name": "The Smooth-Skinned Enclave",
 "type": "settlement",
 "description": "A village of old Solari noble exiles living in longhouses grown into living trees.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "glitterwood-heart"
 ],
 "wyrdCreatures": []
},
  {
 "id": "crystal-stag-glade",
 "regionId": "sundale",
 "name": "Crystal-Stag Glade",
 "type": "wilderness",
 "description": "A clearing where the radiant Crystal-Stag is seen at dusk; the Risen consider it sacred.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "the-glittering-forest"
 ],
 "wyrdCreatures": []
},
  {
 "id": "isthmus-neck",
 "regionId": "sundale",
 "name": "The Isthmus Neck",
 "type": "wilderness",
 "description": "The narrow land-bridge connecting the Glitterwood peninsula to the mainland; the Dawn Vigil once blockaded it.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "the-glittering-forest"
 ],
 "wyrdCreatures": []
},
  {
 "id": "star-crystal-pond",
 "regionId": "sundale",
 "name": "Star-Crystal Pond",
 "type": "wilderness",
 "description": "A pond of crystal-clear water over crystal-soil; hermits bathe here to feel Sol's warmth.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "glitterwood-heart"
 ],
 "wyrdCreatures": []
},
  {
 "id": "upper-deck-quarter",
 "regionId": "iceheart-sea",
 "name": "Upper-Deck Quarter",
 "type": "settlement",
 "description": "The wealthy topside district of lashed galleons; heated cabins, merchants, pact-clerks.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "merrowport"
 ],
 "wyrdCreatures": []
},
  {
 "id": "bilge-berths",
 "regionId": "iceheart-sea",
 "name": "The Bilge-Berths",
 "type": "settlement",
 "description": "The water-logged lower decks where pressed labor and coal-shovelers sleep in coal-dust.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "merrowport"
 ],
 "wyrdCreatures": []
},
  {
 "id": "ink-tattoo-chart-makers",
 "regionId": "iceheart-sea",
 "name": "Ink-Tattoo Chart-Makers' Hut",
 "type": "settlement",
 "description": "Where Merryn tattoo their voyage-contracts onto skin — the only documents the Drift-Council enforces.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "merrowport"
 ],
 "wyrdCreatures": []
},
  {
 "id": "whale-oil-derrick-camp",
 "regionId": "iceheart-sea",
 "name": "Whale-Oil Derrick Camp",
 "type": "settlement",
 "description": "A volcanic-island camp rendering blubber; explosive harpoons are forged here.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "blackteeth-isle"
 ],
 "wyrdCreatures": []
},
  {
 "id": "coral-fishing-hamlet",
 "regionId": "iceheart-sea",
 "name": "Coral-Grown Fishing Hamlet",
 "type": "settlement",
 "description": "A bioluminescent hamlet of Breakers-Born Myrathil fishing the warm coral inlet.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "spindrift-lagoon"
 ],
 "wyrdCreatures": []
},
  {
 "id": "press-warrant-tavern",
 "regionId": "iceheart-sea",
 "name": "Press-Warrant Tavern-Cluster",
 "type": "settlement",
 "description": "Floating taverns on lashed hulls where Press-Warrants sweep the undocumented into naval servitude.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "the-lucky-anchor"
 ],
 "wyrdCreatures": []
},
  {
 "id": "wave-kept-mooring",
 "regionId": "iceheart-sea",
 "name": "The Wave-Kept Mooring",
 "type": "wilderness",
 "description": "The Admiral's flagship's perpetual-station mooring; it never docks, only signals.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "merrowport"
 ],
 "wyrdCreatures": []
},
  {
 "id": "stormspeakers-rim-shrine",
 "regionId": "iceheart-sea",
 "name": "Stormspeaker's Rim-Shrine",
 "type": "settlement",
 "description": "An animist camp on the vortex rim tending a shrine to the binding-storm.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "shard-window"
 ],
 "wyrdCreatures": []
},
  {
 "id": "drowned-fleet-graveyard",
 "regionId": "iceheart-sea",
 "name": "The Drowned-Fleet Graveyard",
 "type": "wilderness",
 "description": "A shallows of wrecked hulls; Draugr Helmsman crew the half-sunken ships.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "gale-storm-shallows"
 ],
 "wyrdCreatures": []
},
  {
 "id": "myriad-haunt",
 "regionId": "iceheart-sea",
 "name": "Myriad-Haunt",
 "type": "wilderness",
 "description": "A cluster of wraith-storm-spirits circling the Shard-Window; the Myriad scream in chorus.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "shard-window"
 ],
 "wyrdCreatures": []
},
  {
 "id": "eye-crossing",
 "regionId": "iceheart-sea",
 "name": "The Eye-Crossing",
 "type": "wilderness",
 "description": "A briefly-calm route through the storm-belt used by smugglers between windows of clearing.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "gale-storm-shallows"
 ],
 "wyrdCreatures": []
},
  {
 "id": "pressure-forge-caverns",
 "regionId": "iceheart-sea",
 "name": "Pressure-Forge Caverns",
 "type": "wilderness",
 "description": "Deep-Born Myrathil abyssal forge-cities carved into basalt; surface-folk cannot reach them.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "deepwell-archipelago"
 ],
 "wyrdCreatures": []
},
  {
 "id": "biolum-reef-mile",
 "regionId": "iceheart-sea",
 "name": "Biolum Reef-Mile",
 "type": "wilderness",
 "description": "A mile of glowing bioluminescent coral-reef under the ice-islands; the Deep-Born herd here.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "deepwell-archipelago"
 ],
 "wyrdCreatures": []
},
  {
 "id": "leviathan-coil",
 "regionId": "iceheart-sea",
 "name": "The Leviathan Coil",
 "type": "wilderness",
 "description": "The Treakous Rift site where the Abyssal Leviathan wraps the Depth-Breath Monolith.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "treakous-rift"
 ],
 "wyrdCreatures": []
},
  {
 "id": "breakers-born-liaison-dock",
 "regionId": "iceheart-sea",
 "name": "Breakers-Born Liaison Dock",
 "type": "settlement",
 "description": "The only surface-deep interface; Shore Myrathil ferry goods to the Deep-Born below.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "the-shivering-bight"
 ],
 "wyrdCreatures": []
},
  {
 "id": "icewhisper-huts",
 "regionId": "iceheart-sea",
 "name": "Icewhisper Coven Huts",
 "type": "settlement",
 "description": "A circle of Berg-Witch huts on the pilgrimage ice; they read fate in the floe-cracks.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "first-shore"
 ],
 "wyrdCreatures": []
},
  {
 "id": "whaler-oil-camp",
 "regionId": "iceheart-sea",
 "name": "Whaler-Oil Camp",
 "type": "settlement",
 "description": "A seasonal whalers' camp at the burning iceberg; oil-rendering fires never go out.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "berg-of-the-frozen-flame"
 ],
 "wyrdCreatures": []
},
  {
 "id": "frozen-rune-ruins",
 "regionId": "iceheart-sea",
 "name": "The Frozen-Rune Ruins",
 "type": "ruin",
 "description": "Pre-Mereval ruins protruding from First Shore's ice; the runes predate the Binding.",
 "dangerLevel": "medium",
 "factions": [],
 "connections": [
  "first-shore"
 ],
 "wyrdCreatures": []
},
  {
 "id": "crack-lane",
 "regionId": "iceheart-sea",
 "name": "The Crack-Lane",
 "type": "wilderness",
 "description": "A navigable fissure through the floes; the only lane deep enough for shallow-hulled boats.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "whaleroot-floe"
 ],
 "wyrdCreatures": []
},
  {
 "id": "letter-of-marque-anchorage",
 "regionId": "iceheart-sea",
 "name": "Letter-of-Marque Anchorage",
 "type": "settlement",
 "description": "The Pirate-Queen's licensed privateer anchorage beneath the abandoned fortress.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "saryreach-castle"
 ],
 "wyrdCreatures": []
},
  {
 "id": "smugglers-hidden-cove",
 "regionId": "iceheart-sea",
 "name": "Smuggler's Hidden Cove",
 "type": "settlement",
 "description": "A black-market cove behind the sea-stacks; goods move without Board of Trade seals.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "saryreach-castle"
 ],
 "wyrdCreatures": []
},
  {
 "id": "exile-colony-stack",
 "regionId": "iceheart-sea",
 "name": "Exile-Colony Stack",
 "type": "settlement",
 "description": "A skerry colony of exiled Neth and Tide-Speakers; they farm kelp and avoid oaths.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "blackteeth-skerry"
 ],
 "wyrdCreatures": []
},
  {
 "id": "mer-court-grotto",
 "regionId": "iceheart-sea",
 "name": "The Mer-Court Grotto",
 "type": "wilderness",
 "description": "A tidal grotto court of the Mer-Court emissaries; it floods twice daily on schedule.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "tide-court-cove"
 ],
 "wyrdCreatures": []
},
  {
 "id": "free-port-stilt-wharves",
 "regionId": "iceheart-sea",
 "name": "Free-Port Stilt-Wharves",
 "type": "settlement",
 "description": "A lawless stilt-village of smugglers and exiles where no Sea-Pass is checked.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "the-saltmaw-estuary"
 ],
 "wyrdCreatures": []
},
  {
 "id": "half-salt-bog-hamlet",
 "regionId": "iceheart-sea",
 "name": "Half-Salt Bog Hamlet",
 "type": "settlement",
 "description": "A brackish-water hamlet of Vreken peat-cutters and pool-dwellers.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "the-saltmaw-estuary"
 ],
 "wyrdCreatures": []
},
  {
 "id": "mawed-sea-shrine",
 "regionId": "iceheart-sea",
 "name": "The Mawed-Sea Shrine",
 "type": "ruin",
 "description": "A shrine to a Forgotten-Cult of the Mawed Sea; offerings vanish into the brackish mud.",
 "dangerLevel": "medium",
 "factions": [],
 "connections": [
  "the-saltmaw-estuary"
 ],
 "wyrdCreatures": []
},
  {
 "id": "forge-of-alaric",
 "regionId": "cragjaw-peaks",
 "name": "The Forge of Alaric",
 "type": "settlement",
 "description": "The Warden order's first anvil where new Wardens drive their first chain-hook, supervised by Drall smiths.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "frostmaw-holdfast"
 ],
 "wyrdCreatures": []
},
  {
 "id": "frostmaw-chimney-galleries",
 "regionId": "cragjaw-peaks",
 "name": "Frostmaw Chimney-Galleries",
 "type": "settlement",
 "description": "Industrial high-pressure siphon-dwellings clinging to the volcanic plug's vents.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "frostmaw-holdfast"
 ],
 "wyrdCreatures": []
},
  {
 "id": "mita-terrace-camp",
 "regionId": "cragjaw-peaks",
 "name": "The Mit'a Terrace-Camp",
 "type": "settlement",
 "description": "Conscript labor-camp working the cliff-hanging andenes (terraces) that feed the keeps.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "frostmaw-massif"
 ],
 "wyrdCreatures": []
},
  {
 "id": "skirmours-bone-heap",
 "regionId": "cragjaw-peaks",
 "name": "Skirmour's Bone-Heap",
 "type": "wilderness",
 "description": "A moraine of Jutul and Groven dead at the Jutul-king's sacred peak; none pass unchallenged.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "skirmours-crag"
 ],
 "wyrdCreatures": []
},
  {
 "id": "subterranean-vault-mouth",
 "regionId": "cragjaw-peaks",
 "name": "The Subterranean Vault-Mouth",
 "type": "wilderness",
 "description": "A sealed descent beneath Frostmaw to the chamber where snow has never fallen — a Monolith rests there.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "frostmaw-holdfast"
 ],
 "wyrdCreatures": []
},
  {
 "id": "ithran-toll-post-village",
 "regionId": "cragjaw-peaks",
 "name": "Ithran Toll-Post Village",
 "type": "settlement",
 "description": "A bridge-top toll-village of fine-scaled Groven diplomats; every crossing pays in kind or coin.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "the-spans"
 ],
 "wyrdCreatures": []
},
  {
 "id": "cliff-andene-terrace",
 "regionId": "cragjaw-peaks",
 "name": "Cliff-Andene Hanging-Terrace",
 "type": "settlement",
 "description": "A mid-altitude terrace-camp of Tessen soldiers and Murmur-Blooded bridge-tenders.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "deepchasm-keep"
 ],
 "wyrdCreatures": []
},
  {
 "id": "murmur-blood-hut",
 "regionId": "cragjaw-peaks",
 "name": "Murmur-Blood Bridge-Tender Hut",
 "type": "settlement",
 "description": "A mixed-caste outcast outpost tending the bone-spans; they are legally invisible.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "the-spans"
 ],
 "wyrdCreatures": []
},
  {
 "id": "the-broken-span",
 "regionId": "cragjaw-peaks",
 "name": "The Broken-Span",
 "type": "ruin",
 "description": "A ruined bone-bridge over the Great Gorge; its collapse isolated two keeps for a generation.",
 "dangerLevel": "medium",
 "factions": [],
 "connections": [
  "the-great-gorge"
 ],
 "wyrdCreatures": []
},
  {
 "id": "knors-wind-throat",
 "regionId": "cragjaw-peaks",
 "name": "Knor's Wind-Throat",
 "type": "wilderness",
 "description": "A howling wind-narrow in the Alley of Knor; the blow can lift a Groven from their feet.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "alley-of-knor"
 ],
 "wyrdCreatures": []
},
  {
 "id": "scrap-sump",
 "regionId": "cragjaw-peaks",
 "name": "The Scrap-Sump",
 "type": "settlement",
 "description": "The Drall clan-free capital beneath the holdfast floor; salvage, ingenuity, and spite.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "gearworks-gulch"
 ],
 "wyrdCreatures": []
},
  {
 "id": "blue-bite-tunnels",
 "regionId": "cragjaw-peaks",
 "name": "Blue-Bite Tunnels",
 "type": "settlement",
 "description": "An unheated chasm-ward of frostbite-rot ('Blue Bite') sufferers; Chasm-Dwellers sift runic waste.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "sump-galleries"
 ],
 "wyrdCreatures": []
},
  {
 "id": "reticulation-vault-camp",
 "regionId": "cragjaw-peaks",
 "name": "Reticulation Vault-Camp",
 "type": "settlement",
 "description": "A scrap-camp at unmapped pipe-junctions; Drall tinkerers salvage clockwork here.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "iron-ravine"
 ],
 "wyrdCreatures": []
},
  {
 "id": "deep-alchemist-shaft",
 "regionId": "cragjaw-peaks",
 "name": "The Deep-Alchemist Shaft",
 "type": "ruin",
 "description": "A sealed service-shaft to the Lost Brood Vats; the 800-yr Feral Brood may stir below.",
 "dangerLevel": "medium",
 "factions": [],
 "connections": [
  "lost-brood-vats"
 ],
 "wyrdCreatures": []
},
  {
 "id": "toxic-spore-hollow",
 "regionId": "cragjaw-peaks",
 "name": "Toxic-Spore Hollow",
 "type": "wilderness",
 "description": "A fungal pocket in the lower sumps; the Spore-Horror nests in the warm dark.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "sump-galleries"
 ],
 "wyrdCreatures": []
},
  {
 "id": "steam-pipe-grid",
 "regionId": "cragjaw-peaks",
 "name": "The Steam-Pipe Grid",
 "type": "wilderness",
 "description": "The labyrinth of geothermal pipes that heat the high keeps; the Steam-Line Cartel bleeds them.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "gearworks-gulch"
 ],
 "wyrdCreatures": []
},
  {
 "id": "wool-yurt-circle",
 "regionId": "sundrift-vale",
 "name": "Wool-Yurt Circle",
 "type": "settlement",
 "description": "A seasonal following-camp of the mare-herds; felt-and-bone yurts strike and raise with the migration.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "mound-camps"
 ],
 "wyrdCreatures": []
},
  {
 "id": "mare-herd-camp",
 "regionId": "sundrift-vale",
 "name": "Mare-Herd Following-Camp",
 "type": "settlement",
 "description": "A Mounted-clan camp tracking the Ordan mares across the Downs; Steppe-Staves record pasture-rights.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "kumis-downs"
 ],
 "wyrdCreatures": []
},
  {
 "id": "kumis-ferment-camp",
 "regionId": "sundrift-vale",
 "name": "Kumis-Ferment Camp",
 "type": "settlement",
 "description": "A camp of mares'-milk fermenters; the kumis-vats never stop.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "kumis-downs"
 ],
 "wyrdCreatures": []
},
  {
 "id": "unmounted-baggage-camp",
 "regionId": "sundrift-vale",
 "name": "Unmounted Baggage-Camp",
 "type": "settlement",
 "description": "The walking underclass's camp; they carry the yurts of the Mounted and are regarded as property.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "mound-camps"
 ],
 "wyrdCreatures": []
},
  {
 "id": "throat-song-hermit-hut",
 "regionId": "sundrift-vale",
 "name": "Throat-Song Hermit-Hut",
 "type": "settlement",
 "description": "A lone Sky-Singer's hut where outlawed constellation-singing is still practiced in secret.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "the-long-steppe"
 ],
 "wyrdCreatures": []
},
  {
 "id": "steppe-stave-cairn",
 "regionId": "sundrift-vale",
 "name": "Steppe-Stave Cairn",
 "type": "wilderness",
 "description": "A bone tally-stick cairn marking a migration waypoint; the notches encode clan and count.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "grass-tundra"
 ],
 "wyrdCreatures": []
},
  {
 "id": "dry-aquifer-beds",
 "regionId": "sundrift-vale",
 "name": "The Dry-Aquifer Beds",
 "type": "wilderness",
 "description": "Cracked beds where Thermal Bores drained the water table; sulfur-sinkholes open without warning.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "lien-stalked-grazes"
 ],
 "wyrdCreatures": []
},
  {
 "id": "mound-keepers-village",
 "regionId": "sundrift-vale",
 "name": "Mound-Keepers' Village",
 "type": "settlement",
 "description": "A solemn village tending the humming barrows; each keeper memorizes one mound's song.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "ancestor-mounds"
 ],
 "wyrdCreatures": []
},
  {
 "id": "echo-singer-death-camp",
 "regionId": "sundrift-vale",
 "name": "Echo-Singer Death-Camp",
 "type": "settlement",
 "description": "Where old Sky-Singers come to die at the crystallized-impact circle; their last songs are recorded.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "novas-heath"
 ],
 "wyrdCreatures": []
},
  {
 "id": "cairn-checkpoint-garrison",
 "regionId": "sundrift-vale",
 "name": "Cairn-Checkpoint Garrison",
 "type": "settlement",
 "description": "An Ordan March-Warden post enforcing the Herd-Tithe at the cairn-line.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "the-moundwatch"
 ],
 "wyrdCreatures": []
},
  {
 "id": "pilgrim-knoll",
 "regionId": "sundrift-vale",
 "name": "Pilgrim-Knoll",
 "type": "wilderness",
 "description": "A barrow pilgrimage site where Astril come to hear Lumia's echo in the hum.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "ancestor-mounds"
 ],
 "wyrdCreatures": []
},
  {
 "id": "mound-eater-scar",
 "regionId": "sundrift-vale",
 "name": "The Mound-Eater Scar",
 "type": "ruin",
 "description": "A barrow silenced permanently by the Mound-Eater; no hum, no echo — a wound in the Wolds.",
 "dangerLevel": "medium",
 "factions": [],
 "connections": [
  "ancestor-mounds"
 ],
 "wyrdCreatures": []
},
  {
 "id": "crystal-lattice-spire-dwelling",
 "regionId": "sundrift-vale",
 "name": "Crystal-Lattice Spire-Dwelling",
 "type": "settlement",
 "description": "An Astril spire-residence in the Synod Hold where constellation-patterns glow on the walls.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "synod-hold"
 ],
 "wyrdCreatures": []
},
  {
 "id": "qilin-grazing-ground",
 "regionId": "sundrift-vale",
 "name": "Qilin Grazing-Ground",
 "type": "wilderness",
 "description": "A crystal-shard meadow where the single-horned Qilin are sighted at the crater's edge.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "starfall-vale"
 ],
 "wyrdCreatures": []
},
  {
 "id": "lien-crystal-beacon",
 "regionId": "sundrift-vale",
 "name": "Lien-Crystal Beacon",
 "type": "wilderness",
 "description": "A standing shard of trapped starlight used as a navigation beacon across the starless steppe.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "starfall-vale"
 ],
 "wyrdCreatures": []
},
  {
 "id": "unlit-veil-judgment-seat",
 "regionId": "sundrift-vale",
 "name": "The Unlit-Veil Judgment-Seat",
 "type": "ruin",
 "description": "A hidden chamber beneath Synod Hold where the Unlit Veil's shadow-council actually rules.",
 "dangerLevel": "medium",
 "factions": [],
 "connections": [
  "synod-hold"
 ],
 "wyrdCreatures": []
},
  {
 "id": "peat-edge-ford-hamlet",
 "regionId": "sundrift-vale",
 "name": "Peat-Edge Ford Hamlet",
 "type": "settlement",
 "description": "A hamlet at the marshy ford where Ordan horse-traders and Vreken peat-cutters meet and intermarry.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "morrens-bogpost"
 ],
 "wyrdCreatures": []
},
  {
 "id": "thermal-bore-sinkhole",
 "regionId": "sundrift-vale",
 "name": "Thermal-Bore Sinkhole",
 "type": "wilderness",
 "description": "A toxic sulfur-sinkhole opened by forced Fexric boring; it swallows migrating beasts.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "morrens-bogpost"
 ],
 "wyrdCreatures": []
},
  {
 "id": "neth-scribe-outpost",
 "regionId": "sundrift-vale",
 "name": "Neth-Scribe Outpost",
 "type": "settlement",
 "description": "A small Bryngloom Neth trade-annex recording the Bogpost's cross-border debts.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "morrens-bogpost"
 ],
 "wyrdCreatures": []
},
  {
 "id": "sentry-yurt-post",
 "regionId": "sundrift-vale",
 "name": "Sentry-Yurt Post",
 "type": "settlement",
 "description": "A wind-blasted Ordan frontier post watching the Snow-Tooth passes for Frostwood patrols.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "blizzard-bluff"
 ],
 "wyrdCreatures": []
},
  {
 "id": "wind-neck-pass",
 "regionId": "sundrift-vale",
 "name": "The Wind-Neck",
 "type": "wilderness",
 "description": "The lowest pass through Blizzard Bluff; the only route foot-traffic can cross in winter.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "blizzard-bluff"
 ],
 "wyrdCreatures": []
},
  {
 "id": "frostwood-meeting-stones",
 "regionId": "sundrift-vale",
 "name": "Frostwood-Thalren Meeting-Stones",
 "type": "wilderness",
 "description": "Cairns where Frostwood and Sundrift patrols meet to exchange weather-reports and warnings.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "blizzard-bluff"
 ],
 "wyrdCreatures": []
},
  {
 "id": "heart-vault-archive-hamlet",
 "regionId": "bryngloom-forest",
 "name": "Heart-Vault Archive-Hamlet",
 "type": "settlement",
 "description": "A pact-clerk hamlet around the tree holding the First Contract; memory-glass tablets are inscribed here.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "atropolis"
 ],
 "wyrdCreatures": []
},
  {
 "id": "memory-glass-workshop",
 "regionId": "bryngloom-forest",
 "name": "Memory-Glass Tablet-Workshop",
 "type": "settlement",
 "description": "Where artisans render memory into glass tablets; the smoke of it drifts through the canopy.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "atropolis"
 ],
 "wyrdCreatures": []
},
  {
 "id": "branch-walkway-dwelling",
 "regionId": "bryngloom-forest",
 "name": "Branch-Walkway Dwelling",
 "type": "settlement",
 "description": "A suspended neighborhood of living-branch walkways and ghost-silk bridges high above the bog.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "atropolis"
 ],
 "wyrdCreatures": []
},
  {
 "id": "peat-press-engine-camp",
 "regionId": "bryngloom-forest",
 "name": "Peat-Press Engine-Camp",
 "type": "settlement",
 "description": "A hated industrial camp running the steam presses that drain the swamp and rot the ironwood roots.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "peat-bog-sinks"
 ],
 "wyrdCreatures": []
},
  {
 "id": "tapestry-ward-boarding-house",
 "regionId": "bryngloom-forest",
 "name": "Tapestry-Ward Boarding-House",
 "type": "settlement",
 "description": "A state house where Mimir and frontier children are stripped of animism and trained in written logic.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "over-shanty"
 ],
 "wyrdCreatures": []
},
  {
 "id": "dangling-keel-tavern",
 "regionId": "bryngloom-forest",
 "name": "The Dangling Keel Tavern",
 "type": "settlement",
 "description": "A rope-bridge tavern hanging over the deepest bog; the Cult of Forgotten Shadow was founded in its cellars.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "over-shanty"
 ],
 "wyrdCreatures": []
},
  {
 "id": "lantern-eye-way",
 "regionId": "bryngloom-forest",
 "name": "Lantern-Eye Way",
 "type": "settlement",
 "description": "A lane down into the Spire lit by the rust-amber lantern-eyes of Clean Vreken residents.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "the-sunken-spire"
 ],
 "wyrdCreatures": []
},
  {
 "id": "marked-vrekin-rim-slum",
 "regionId": "bryngloom-forest",
 "name": "The Marked-Vrekin Rim-Slum",
 "type": "settlement",
 "description": "The segregated silver-eyed Marked Vreken slum around the sinkhole upper rim.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "the-sunken-spire"
 ],
 "wyrdCreatures": []
},
  {
 "id": "veil-speaker-chant-hall",
 "regionId": "bryngloom-forest",
 "name": "Veil-Speaker Chant-Hall",
 "type": "settlement",
 "description": "A fungal-shroud hall where Vreken chant to the ancestors wrapped in living mycelium.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "the-sunken-spire"
 ],
 "wyrdCreatures": []
},
  {
 "id": "pale-moonlight-floor",
 "regionId": "bryngloom-forest",
 "name": "The Pale-Moonlight Floor",
 "type": "wilderness",
 "description": "The sinkhole floor glowing with Aedris's eternal pale light; pilgrims descend in silence.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "the-sunken-spire"
 ],
 "wyrdCreatures": []
},
  {
 "id": "peat-press-forge-camp",
 "regionId": "bryngloom-forest",
 "name": "Peat-Press Forge-Camp",
 "type": "settlement",
 "description": "A Debt-Revenant chain-gang camp squeezing oil from the bog under Morrath Marshal whips.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "widows-quagmire"
 ],
 "wyrdCreatures": []
},
  {
 "id": "rot-fume-hut",
 "regionId": "bryngloom-forest",
 "name": "Rot-Fume Hut",
 "type": "settlement",
 "description": "A Vreken peat-cutter's hut breathing toxic rot-fumes; the Defaulted underclass lives here.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "black-fen"
 ],
 "wyrdCreatures": []
},
  {
 "id": "final-clause-marker",
 "regionId": "bryngloom-forest",
 "name": "The Final-Clause Marker",
 "type": "wilderness",
 "description": "The boundary stone of Black Fen, beyond which Morvane's contract-law has no jurisdiction.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "black-fen"
 ],
 "wyrdCreatures": []
},
  {
 "id": "contract-dumping-grounds",
 "regionId": "bryngloom-forest",
 "name": "The Contract-Dumping Grounds",
 "type": "wilderness",
 "description": "Where broken contracts — and those who broke them — are disposed of into the acid mud.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "widows-quagmire"
 ],
 "wyrdCreatures": []
},
  {
 "id": "probability-loom-house",
 "regionId": "bryngloom-forest",
 "name": "Probability-Loom House",
 "type": "settlement",
 "description": "A Kessen Neth village-house of living-wood looms where weavers read the forest's probability-web.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "aran-glen"
 ],
 "wyrdCreatures": []
},
  {
 "id": "fae-contract-bark-grove",
 "regionId": "bryngloom-forest",
 "name": "Fae-Contract Bark-Grove",
 "type": "wilderness",
 "description": "A grove of ironwoods carved with pre-Neth fae-contracts in their bark; older than the Registry.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "vel-keth-bayou"
 ],
 "wyrdCreatures": []
},
  {
 "id": "memory-glass-banks",
 "regionId": "bryngloom-forest",
 "name": "The Memory-Glass Banks",
 "type": "wilderness",
 "description": "Memory-glass deposits lining the uphill-flowing bayou; smugglers mine them without permit.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "vel-keth-bayou"
 ],
 "wyrdCreatures": []
},
  {
 "id": "swamp-singer-purge-site",
 "regionId": "bryngloom-forest",
 "name": "Swamp-Singer Purge-Site",
 "type": "ruin",
 "description": "A ruin where the Inquisition rooted out Swamp-Song animists; the molds here are silent.",
 "dangerLevel": "medium",
 "factions": [],
 "connections": [
  "covenbane-stronghold"
 ],
 "wyrdCreatures": []
},
  {
 "id": "toll-dike-gate",
 "regionId": "bryngloom-forest",
 "name": "Toll-Dike Gate",
 "type": "fortification",
 "description": "A living-ironwood toll-gate charging peat-debt for passage through the bayou channels.",
 "dangerLevel": "medium",
 "factions": [],
 "connections": [
  "vel-keth-bayou"
 ],
 "wyrdCreatures": []
},
  {
 "id": "merryn-barge-port",
 "regionId": "bryngloom-forest",
 "name": "Merryn Barge-Port",
 "type": "settlement",
 "description": "A lashed-houseboat port on the Mere's shore; Merryn lake-traders moor here by season.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "the-great-mere"
 ],
 "wyrdCreatures": []
},
  {
 "id": "vreken-shrine-islet",
 "regionId": "bryngloom-forest",
 "name": "Vreken Shrine-Islet",
 "type": "settlement",
 "description": "A forbidden islet holding a Vreken fungal shrine; only the moon-tide reveals the path.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "monks-of-the-sunken-stone"
 ],
 "wyrdCreatures": []
},
  {
 "id": "forbidden-isle",
 "regionId": "bryngloom-forest",
 "name": "The Forbidden Isle",
 "type": "wilderness",
 "description": "An unmapped Mere island where the most binding oaths are sealed — and broken.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "the-great-mere"
 ],
 "wyrdCreatures": []
},
  {
 "id": "moon-tide-shore",
 "regionId": "bryngloom-forest",
 "name": "Moon-Tide Shore",
 "type": "wilderness",
 "description": "The shore that shifts with the moon-tide; what is dry land at dawn may be lakebed by dusk.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "the-great-mere"
 ],
 "wyrdCreatures": []
},
  {
 "id": "first-contract-signing-hollow",
 "regionId": "bryngloom-forest",
 "name": "The First-Contract Signing-Hollow",
 "type": "ruin",
 "description": "The deep hollow where the Neth ancestors signed the First Contract with Morvane; still radiates authority.",
 "dangerLevel": "medium",
 "factions": [],
 "connections": [
  "root-veil-scriptorium"
 ],
 "wyrdCreatures": []
},
  {
 "id": "threshold-shrine-hermitage",
 "regionId": "bryngloom-forest",
 "name": "Threshold-Shrine Hermitage",
 "type": "settlement",
 "description": "A monastic hermitage of Hallowed Neth bound as Morvane's spirit-conduits over a deep sinkhole.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "root-veil-scriptorium"
 ],
 "wyrdCreatures": []
},
  {
 "id": "hush-quiet-zone",
 "regionId": "bryngloom-forest",
 "name": "The Hush-Quiet Zone",
 "type": "wilderness",
 "description": "A stretch of root-tunnel where no birds, no wind, no sound persists; the Root-Veil breathes here.",
 "dangerLevel": "low",
 "factions": [],
 "connections": [
  "root-veil-scriptorium"
 ],
 "wyrdCreatures": []
}

];



export const getZonesByRegion = (regionId) => {
 return ZONE_DATA.filter(zone => zone.regionId === regionId);
};

export const getZoneData = (zoneId) => {
 return ZONE_DATA.find(zone => zone.id === zoneId) || null;
};
