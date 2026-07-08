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
 "type": "city",
 "description": "The ancient, towering stronghold of House Thalreth, constructed from wet grey peat-stone and massive petrified ironwood logs. It stands as the primary sanctuary in the Reach, its massive fireplaces fueled by resinous heartwood to ward off both the biting cold and the encroaching memory-eating fog. Founded just after the Binding with the Fog Compact. The Scribe-Sentinels codified the Sovereign Ledger here in the first centuries of the Dimming.",
 "dangerLevel": "low",
 "factions": [
  "house-thalreth",
  "scribe-sentinels"
 ],
 "connections": [
  "the-shallows",
  "scribes-tower"
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
  "ironwood-heart"
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
  "unshorn-briaran"
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
 "description": "A fog-drowned fen on the eastern border where the ground breathes and the water is warm to the touch. Mimir Unwoven wander here without masks, their forms dissolving and reforming in the mist. Thalren trappers avoid it, those who enter too deep return speaking languages no one recognizes.",
 "dangerLevel": "high",
 "factions": [
  "Mimir Unwoven"
 ],
 "connections": [
  "the-shallows"
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
 "description": "A fortified copse of ironwood trees on the trade route between Greymark and the eastern fens, maintained jointly by Thalren timber-wardens and Briaran thorn-tenders. The trees here grow deliberately tangled, a living wall of iron-hard thorns that funnels all traffic through a single, watched gate.",
 "dangerLevel": "low",
 "factions": [
  "Thalren Trappers",
  "Unshorn Briaran"
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
 "description": "An open stretch of thorn-covered heathland at the forest edge where the ironwood canopy breaks and the fog thins for the first time. Briaran rangers patrol here, tending the thorn-barriers that mark the boundary between the Reach and the lowland approaches. The heath is beautiful in a savage way, crimson thorn-flowers bloom year-round in soil nourished by centuries of blood.",
 "dangerLevel": "medium",
 "factions": [
  "Unshorn Briaran"
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
 "description": "A perfectly still lake settlement where Mask-Borne Mimir test their reflections against their masks to ensure their identity holds. The mere never ripples, even in storm weather, the surface remains glass-still. Mimir scholars use the lake as a divination tool, reading the reflections of possible futures in its depths.",
 "dangerLevel": "low",
 "factions": [
  "Mask-Borne Mimir"
 ],
 "connections": [
  "greymark-keep"
 ],
 "wyrdCreatures": []
 },
 {
 "id": "frozen-archive",
 "regionId": "nordhalla",
 "name": "The Frozen Archive",
 "type": "tomb",
 "description": "A subterranean cathedral of blue ice and basalt, carved deep beneath the Nordhalla glaciers. It serves as the ultimate resting place for the Skald clans, who chisel their ancestors' histories into glacier walls so they will be preserved forever in stasis. The Archive predates the Dimming, a dead civilization's flash-frozen capital discovered and repurposed after the Glacier Bargain, just after the Binding. The Augurs have recorded every rebirth cycle from this site for nearly eight centuries.",
 "dangerLevel": "medium",
 "factions": [
  "house-skalvyr",
  "Skald Keepers"
 ],
 "connections": [
  "fjord-gate",
  "rimors-hearth"
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
  "bloodhammer-sump"
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
  "vargtor"
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
  "the-still-crag"
 ],
 "wyrdCreatures": [
  "Kjarn"
 ]
 },
 {
 "id": "the-still-crag",
 "regionId": "nordhalla",
 "name": "The Still Crag",
 "type": "wilderness",
 "description": "A cliff face perpetually frozen in rime where no wind blows and no sound carries. The Rime-Born claim the crag is where the Warden's breath touched the mountain during the Glacier Bargain. Ice sculptures of unknown figures stand frozen in attitudes of supplication along the cliff face, no one knows who carved them or who they depict.",
 "dangerLevel": "high",
 "factions": [
  "Rime-Born Rune Keepers"
 ],
 "connections": [
  "rooks-promontory"
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
  "sump-galleries"
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
  "Fexrick Scavengers"
 ],
 "connections": [
  "frostmaw-holdfast"
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
 "description": "A Fexrick industrial settlement built into a narrow ravine where steam-powered machinery grinds day and night. The gulch is heated by geothermal vents channeled through iron pipes, and the air is thick with sulfur and the constant clatter of industry. Fexrick artisans here produce the finest clockwork mechanisms in the known world.",
 "dangerLevel": "medium",
 "factions": [
  "Fexrick Scavengers",
  "Kethrin Guild-Bound"
 ],
 "connections": [
  "sump-galleries",
  "frostmaw-holdfast"
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
 "description": "The massive subterranean capital of the Emberth forge-clans in Sundale, carved radially into the volcanic throat of a dormant secondary caldera by the Sun-Speakers centuries before the sun's death. It serves as both sacred temple to the Solbrand and industrial forge-caldera where the Korr Emberth tend the eternal ember in sacred silence. The Emberth vault-capital beneath Emberspire. The Korr tending-clan has protected the Solbrand here since before the Binding. The Forge of Grum, the first Berserker training ground, was established here in the first centuries of the Dimming.",
 "dangerLevel": "extreme",
 "factions": [
  "Solvarn Martyrs",
  "Emberth Watchers"
 ],
 "connections": [
  "great-forge",
  "emberspire-caldera"
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
 "description": "A sprawling city of black iron and basalt built inside a volcanic cavern. Warmed by a branch of the world's magma-core, the Emberth forge-masters maintain the massive, geothermal bellows that power the world's largest smelting operations, producing refined cold-iron for all seven continents.",
 "dangerLevel": "low",
 "factions": [
  "Emberth Forge-Clans",
  "house-solvan"
 ],
 "connections": [
  "harath-vault",
  "basalt-shyr"
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
  "cinder-badlands"
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
  "Thrask Badland Rangers"
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
 "description": "A massive flat-topped mountain of black basalt where Solvarn sun-priests hold outdoor ceremonies during the rare moments when volcanic haze clears enough to glimpse the buried sun's residual glow. The mesa surface is carved with solar calendars and prophecy charts stretching back centuries. Heat-shimmer makes the mesa appear to float above the ashlands.",
 "dangerLevel": "medium",
 "factions": [
  "Solvarn Martyrs",
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
 "description": "A long, steep slope of compacted volcanic ash that forms the natural border between Sundale and the lowland approaches. The ash is packed hard as stone in places, but a wrong step can send a traveler sliding hundreds of feet into glass-scarred gullies. Solvarn watchtowers dot the escarpment rim, their eternal signal-fires burning with heartwood resin.",
 "dangerLevel": "high",
 "factions": [
  "Dawn Vigil"
 ],
 "connections": [
  "sols-anvil-mesa",
  "basalt-shyr"
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
 "description": "A honeycombed landscape of limestone terrain riddled with underground rivers and sinkholes, named for the Emberth forge-master who first mapped its depths. Geothermal vents heat the underground streams to boiling, and the mineral-rich water deposits vivid orange and red crystals along every cave wall. The karst connects to the Harath-Vault through miles of submerged passages.",
 "dangerLevel": "high",
 "factions": [
  "Emberth Watchers",
  "Korr Emberth"
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
 "description": "A narrow ravine settlement filled with forge waste and industrial debris, where Emberth and Groven workers process slag for salvageable metals. The gulch is hot, loud, and acrid, a permanent foundry town built on the principle that nothing useful should be wasted. The inhabitants have developed a unique patois mixing Sundari and Terran.",
 "dangerLevel": "medium",
 "factions": [
  "Emberth Forge-Clans",
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
 "description": "A warm saltwater lagoon heated by volcanic vents on Sundale's southern coast, where Emberth divers harvest fire-coral and thermal crystals. The lagoon glows orange-red at night from the volcanic activity below. It serves as Sundale's primary port, the only harbor where the water does not freeze.",
 "dangerLevel": "low",
 "factions": [
  "Emberth Forge-Clans",
  "Merryn Traders"
 ],
 "connections": [
  "basalt-shyr"
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
  "gale-storm-shallows"
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
  "treakous-rift"
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
  "first-shore"
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
  "Myrathil River-Fed"
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
 "description": "A wide, deep inlet perpetually shrouded in sea-mist, where the echoes of drowned sailors carry for miles. Myrathil Deep-Born claim the sound is a living thing, that it listens and remembers every voice that crosses its water. Ships that enter the sound without a Myrathil guide often emerge with crews who refuse to speak of what they heard.",
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
 "description": "A chain of ice-islands where Deep-Born Myrathil congregate in underwater cave-cities beneath the frozen surface. The archipelago stretches for forty miles, each island connected by submerged tunnels. The Deep-Born maintain a culture entirely separate from the surface, they emerge only to trade and to conduct their mysterious Drowning Rites.",
 "dangerLevel": "extreme",
 "factions": [
  "Myrathil Deep-Born"
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
 "name": "The Synod-Hold",
 "type": "city",
 "description": "The vertical fortress of House Ordavan, built atop a series of sheer cliffs. The city serves as the administrative heart of the steppe, where the nomadic clans gather every summer to balance trade accounts and resolve border disputes. The Astril cathedral was formally established in the early centuries of the Dimming, built over the stone circles where the first constellation-spirit vessels were received just after the Breach.",
 "dangerLevel": "low",
 "factions": [
  "house-ordavan",
  "Synod Scribes"
 ],
 "connections": [
  "mound-camps",
  "ancestor-mounds"
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
  "synod-hold",
  "grass-tundra"
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
  "Astril Sylen"
 ],
 "connections": [
  "synod-hold",
  "lien-stalked-grazes"
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
  "Astril Muren"
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
  "ancestor-mounds"
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
 "description": "A deep valley in the otherwise flat steppe where Astril claim constellation-spirits fell to earth during the Breach. The valley floor is littered with crystalline shards that glow faintly with trapped starlight, the physical residue of Sol's shattered celestial court. Sylen Astril make pilgrimages here to commune with their nesting spirits.",
 "dangerLevel": "high",
 "factions": [
  "Astril Sylen"
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
 "description": "A small, rounded hill where Unlit Astril hold their secret judgments, the trials of those whose constellation-spirits have gone dark. The knoll is devoid of all light by Unlit design; even fire refuses to burn here. Unlit Veil operatives use the knoll as a dead-drop and meeting point, knowing no Astril with star-glow in their blood can approach.",
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
 "description": "A Morren trading outpost at the forest-steppe edge where Bryngloom goods, fungal lights, memory-glass, bog-mushroom reagents, are exchanged for Ordan wool and hide. The outpost is a cluster of squat, peat-stone buildings that smell perpetually of bog-water. The Morren traders here are debt-brokers, always willing to extend credit at terms that seem generous until the interest compounds. Established in the early generations of the Dimming as the Bryngloom-Sundrift trade border-post. The Bogpost marks the forest-steppe border where the Bryngloom Bog-Route meets the Steppe Migration Circuit.",
 "dangerLevel": "medium",
 "factions": [
  "Morren Traders",
  "Kessen Merchants"
 ],
 "connections": [
  "mound-camps",
  "lien-stalked-grazes"
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
  "the-sunken-spire"
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
  "peat-bog-sinks"
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
  "Morren Peat-Cutters",
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
 "description": "A chaotic, hanging slum of rope-bridges and ramshackle wooden cabins built under Atropolis's main platforms. It is populated by sallow-skinned Morren peat-cutters and the leaden-skinned Drun outcasts who chose to burn their names from the First Contract. Established in the mid-Dimming centuries at the edge of the peat-bogs. The Cult of Forgotten Shadow made first contact with the deep dark from the crypts beneath here in the most recent centuries.",
 "dangerLevel": "high",
 "factions": [
  "Drun Outcasts",
  "Morren Peat-Cutters"
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
  "Morren Peat-Cutters"
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
 "description": "A waystation on the wide grass valley between the Frostwood Reach and Sundale, the only place where the ironwood thins enough to graze cattle. A market-town of mixed Thalren and Solvarn, the Crossing is officially under Greymark's writ but in practice answers to whichever side of the valley sent the last patrol. Trades: peat-iron, Solvan sulfur-lamps, Mist-Sentinel fish.",
 "dangerLevel": "low",
 "factions": [
  "House Thalreth (nominally)",
  "Solvarn exiles",
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
  "Fredløse smugglers"
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
 "description": "A hidden inlet on the southern shore, just south of Xardin's Hearth. The Fredløse clans use it to slip past the Icechamber Syndicate's patrol-ships. There is no permanent town, only shacks built into the cliff, rebuilt each year after the winter storms wash them away. The captain who runs it changes names every season.",
 "dangerLevel": "medium",
 "factions": [
  "Fredløse clans"
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
 "description": "A fishing port on Sundale's southern coast, the most cosmopolitan town in the region. Merryn captains, Frostwood Thalren exiles, and Emberth forge-clans all dock here. The Dawn Vigil holds the citadel at the harbor-mouth, but the back-alleys are the Risen's, and the cult of the old sun-veneration has its public shrines in plain view. Konjaw is the only Sundale port where the Sea-Charter is honored without the Board of Trade's registration.",
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
 "description": "A small Emberth fishing-and-smelting hamlet south of Konjaw Port, named for the iron-rimmed volcanic crater that the villagers use as a forge. The Dawn Vigil's patrols are infrequent; the villagers prefer it that way. A handful of Smooth-Skinned exiles from the old Solvan nobility live here in disguise.",
 "dangerLevel": "low",
 "factions": [
  "Ironjaw Council",
  "Emberth forgemen"
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
 "description": "A penal colony of thorn-vines and black basalt huts on the Ashen Fringe, where the Dawn Vigil sends the incorrigible, conscripted Martyrs who refused, heretics who recanted, debt-defaulters from the Solvarn nobility. The colony is surrounded by a hedge of bramble-thorns that grows inward by an inch every season; no one knows what lies outside it now.",
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
 "description": "A market-town at the western edge of the Green Rim, where the warm sea-breezes meet the ashen plain. Breezebough is the trading-hub between the Dawn Vigil's territory and the Frostwood Reach, Thalren ink, Solvan obsidian, Merryn salt-fish, and Emberth sulfur change hands in the open square. The town is technically under Hierophant Aethelgard's writ; in practice, the council of merchants governs.",
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
 "description": "A peninsula connected to Sundale's main landmass by a narrow isthmus, a half-island, the greenest land in the region. Crystal-rich volcanic soil supports ancient broadleaf forest; the leaves catch the volcanic light and throw it back in shards. Long thought cursed, the Glitterwood is now the home of the Risen, the Smooth-Skinned exiles of the old Solvan nobility, and hermits who fled the Dawn Vigil's conscription. The Dawn Vigil pretends the isthmus does not exist.",
 "dangerLevel": "low",
 "factions": [
  "The Risen",
  "Free Glitterwood Council",
  "Smooth-Skinned exiles"
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
 "description": "A ring of basalt columns surrounding Emberspire at a distance of two leagues, natural formations that the Emberth have carved with binding-runes. The columns mark the boundary of the inner Ash-Heart; only the Emberth Watchers and the Dawn Vigil's senior priests are permitted past them. The Wyrd here is thick enough to taste.",
 "dangerLevel": "extreme",
 "factions": [
  "Emberth Watchers",
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
 "description": "A secondary volcanic vent north of Emberspire, named for the red-bloomed lichen that grows in its caldera. The Emberth use the crater as a place of purification, Martyrs are sent here to cleanse before the final Vow. The Dawn Vigil claims the lichens have healing properties; the Emberth say the crater simply burns the unworthy.",
 "dangerLevel": "high",
 "factions": [
  "Emberth Watchers",
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
 "description": "A network of lava-tubes beneath the Spinstones Columns, where the Solvan priests once communed with what they believed were the spirits of Sol's ministers. The binding broke that communion; the caves are now silent and haunted by the Husque, mobile reality-fissures that walk the tunnels. The Emberth seal the entrances, but the seals do not always hold.",
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
 "description": "A narrow pass through the Cragjaw's central spine, the only east-west route through the peaks that does not require Groven bone-bridges. The alley is named for the ancient Fexrick runemaster Knor, who carved the warning-runes on the cliff walls when the Tesshan first came. Avalanches are common; the Alley is closed in winter.",
 "dangerLevel": "high",
 "factions": [
  "Tessen patrols",
  "Fexrick engineer-corps"
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
  "Kethrin Guild-Bound"
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
 "description": "A Fexric industrial complex in the deep Iron Sumps, the largest forge-works in the Cragjaw, fed by geothermal pipes from below. Driknell stamps the Tesshan sigil onto every Ironclad plate that comes off the line. The Drall Clan-Free workers in the lower foundries are the most numerous Fexric caste; the Kethrin Guild-Bound overseers in the upper halls are the most despised.",
 "dangerLevel": "medium",
 "factions": [
  "Fexrick Kethrin Guild-Bound",
  "Fexrick Drall Clan-Free",
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
 "description": "A hidden tidal harbor on a Western Isle, the meeting-place of the Mer-Court, a council of Tide-Speakers, Myrathil River-Fed, and animist holdouts who refuse the Sea-Charter. The Cove fills twice a day with the tide; the rest of the time, it is a ring of black-sand beach around a tidal pool full of singing fish. The Mer-Court is older than the Mereval House; the Board of Trade has never been able to suppress it.",
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
 "description": "A warm bioluminescent coral inlet on a volcanic island in the Merrow Archipelago, the only place in the Iceheart Sea where the water is warm enough to swim. The lagoon glows at night with light from the coral; the Breakers-Born Myrathil come here to spawn, and the lagoon is closed to surface traffic during the spawning season.",
 "dangerLevel": "low",
 "factions": [
  "Myrathil Breakers-Born",
  "Spindrift Spa-Cult (visiting)"
 ],
 "connections": [
  "merrowport"
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
 "description": "A drowned forest in the western bayous, where the ironwood trunks stand black in a shallow lake of tannin-stained water. The Drowned Dingle is a smuggler's route, the Morren peat-cutters use it to move un-registered peat past the Covenbane's checkpoints. The drowned wood is sacred to the Neth Kessen; they believe each submerged trunk is a sealed contract.",
 "dangerLevel": "medium",
 "factions": [
  "Morren smugglers",
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
 "description": "A peat-bog in the eastern Fens whose geography rearranges itself overnight, paths taken at dawn are not there at dusk, islands become pools, pools become solid ground. The Mimir Unwoven say the Fen is a wound where the Reach's memory-fog has eaten a hole in the world; the Forgotten who shelter here say it is a place where the Keth-Amar's tendrils cannot reach, because nothing here stays the same long enough to be remembered.",
 "dangerLevel": "high",
 "factions": [
  "Mimir Unwoven",
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
 "description": "A pre-Thalreth burial mound on the eastern edge of the Reach, untouched by the memory-fog for reasons no Scribe-Sentinel has ever been able to explain. The barrow predates House Thalreth; the original inhabitants are unknown. The Mist-Sentinels are forbidden to enter; the Briaran come here to grieve for the Forgotten who have no other grave.",
 "dangerLevel": "medium",
 "factions": [
  "Unshorn Briaran (pilgrims)"
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
  "Solvarn Martyrs (veterans)"
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
 "id": "lost-brood-vats",
 "regionId": "cragjaw-peaks",
 "name": "Lost Brood Vats",
 "type": "ruin",
 "description": "The abandoned chambers of the Deep Alchemists, sealed after the Lost Brood rebellion three centuries ago. The vats are deep below Gearworks Gulch, accessible only through a Fexric service-shaft that was supposed to have been collapsed. Something survived the sealing. The Fexrick refuse to speak of what.",
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
 "description": "The library of unbreakable memory at the heart of the Root-Veil, the deepest archive in the Bryngloom, where every Neth contract ever written is held in ironwood-root crystals. The Keeper of the Last Threshold guards the entrance. Few have entered and returned; fewer still have entered and emerged unchanged.",
 "dangerLevel": "extreme",
 "factions": [
  "Keeper of the Last Threshold",
  "Root-Veil Coven"
 ],
 "connections": [],
 "wyrdCreatures": [
  "Kessen-Wraith"
 ]
 }
];



export const getZonesByRegion = (regionId) => {
 return ZONE_DATA.filter(zone => zone.regionId === regionId);
};

export const getZoneData = (zoneId) => {
 return ZONE_DATA.find(zone => zone.id === zoneId) || null;
};
