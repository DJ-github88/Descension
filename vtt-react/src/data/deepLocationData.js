import { ZONE_DATA } from './zoneData';

const DEEP_LOCATIONS = {};

// =============================================================================
// FROSTWOOD REACH, Greymark Keep (deep)
// =============================================================================
DEEP_LOCATIONS['greymark-keep'] = {
 heraldry: {
  iconUrl: '/assets/heraldry/greymark.png',
  colors: { primary: '#4a3728', secondary: '#8b7355' },
  description: 'A petrified ironwood tree rooted in peat-grey stone, its branches clutching a quill and a flame'
 },
 population: 1200,
 dominantRaces: ['Thalren humans', 'Mimir'],
 leadership: {
  type: 'noble_house',
  title: 'Jarl-Archivist of Greymark',
  leaderId: 'kaelen-thalreth',
  description:
   'House Thalreth rules from the High Hearth, a massive ironwood throne-room. The de facto ruler is Jarl-Archivist Kaelen Thalreth ("The Quill-Lord"), who enforces the Sovereign Ledger. His father, the elder Lord Aldren Thalreth, remains de jure Lord but is increasingly absent, sitting in his chambers re-reading his own journals to remember who he is.'
 },
 defenses: {
  militiaSize: 50,
  fortifications:
   'A palisade of petrified ironwood trunks surrounds the keep. Each trunk is harder than steel and resistant to fire. The approach is further protected by the mists, which disorient invaders and erase their sense of direction.',
  watchPresence: 'Scribe-Sentinels patrol the timber keeps in shifts of six, their quills always ready to record any disturbance'
 },
 economy: {
  primary: 'Ironwood timber export',
  secondary: ['Resin harvesting', 'Parchment production', 'Ledger-keeping services'],
  status: 'stable'
 },
 atmosphere: {
  mood: 'Somber determination under perpetual mist. The people of Greymark speak in hushed tones, not out of fear, but because the fog swallows loud words and returns them as echoes hours later, distorted and mocking.',
  architecture:
   'Wet grey peat-stone and massive petrified ironwood logs. Buildings lean slightly inward, as if huddling for warmth. Every exterior wall is carved with genealogical records, family lineages etched directly into the structure so the fog cannot steal them.',
  sounds:
   'Constant scratching of quills from the Scribes\' Tower, distant fog-horns marking the hours, the creak of ironwood beams settling, and the low moan of the wind threading through the canopy bridges.',
  smells:
   'Burning heartwood resin from the public hearths, damp parchment, peat-smoke, and the faint mineral tang of the fog itself, like cold stone after rain.',
  lighting:
   'Dim and diffuse, oil lamps and hearth-fires cast halos that the fog immediately softens. On clear nights (rare), bioluminescent lichen on the ironwood trunks glows pale blue-green.'
 },
 history: {
  founded: 'early in the Slow Cracks',
  foundedBy: 'House Thalreth',
  foundingStory:
   'Built where three ancient ironwood roots converged above a geothermal vent. The first Thalreth settlers chose this spot because the roots formed a natural shelter, and the vent provided the only unfrozen ground within fifty miles. The original keep was a single hall carved into the largest root, that hall is now the High Hearth.',
  significantEvents: [
   { date: 'early in the Slow Cracks', event: 'The Fog Compact: House Thalreth trades spatial clarity for insulating fog; first Scribe-Sentinels founded' },
    { date: 'just after Blizzard’s End', event: 'The Solbrand Order was founded in the High Hearth; first Scribe-Sentinels formally appointed' },
    { date: 'just after Blizzard’s End', event: 'The Preservation Compact: noble houses seal dark-bargain tablets in the Council Chamber' },
   { date: 'in the first centuries of the Freezing Era', event: 'High Confessor Aldren Thalreth the Elder, ancestor of the present line, departed for Nordhalla\'s Frozen Archive to seal himself in meditative stasis' },
   { date: 'in the first centuries of the Freezing Era', event: 'The Ledger Purge: Lord Aldren Thalreth consolidates all family ledgers into a single sealed vault, entrusting location to no one' },
   { date: 'in the first centuries of the Freezing Era', event: 'The Sovereign Ledger established: the first formal system of documented vs. undocumented citizenship' },
   { date: 'in the early centuries of the Freezing Era', event: 'The Fogwood Schism: Thalren archivists split into Preservationists vs. Adaptationists; the Forgotten underclass emerges' },
   { date: 'around the time of the Mimir Purge', event: 'The Ledger Halls Collapse: original archives buried; the Great Forgetting begins' },
   { date: 'decades into the Freezing Era', event: 'The Memory Wars: Scribe-Cartel vs. the undocumented Forgotten; Mist-Sentinels formed' },
   { date: 'decades into the Freezing Era', event: 'Florae raiders breached the outer palisade; repelled after three days of house-to-house fighting' },
   { date: 'decades into the Freezing Era', event: 'The Florae Uprising: Trueborn Florae raid timber caravans; Thalreth suppression campaign drives them deep into Ironwood Heart' },
   { date: 'decades into the Freezing Era', event: 'The Inquisitor Traditions Merge: Elias the Salt-Scarred establishes the Frostwood chapter at Greymark Keep' },
   { date: 'in the later centuries of the Freezing Era', event: 'The Great Revision: senior Scribe-Sentinels begin systematically editing ledger-libraries' }
  ]
 },
 subLocations: [
  {
   id: 'high-hearth',
   name: 'The High Hearth',
   type: 'great_hall',
   description:
    'The throne room of House Thalreth, carved into the heart of the largest petrified ironwood root. The root still lives, faintly, and its sap sometimes seeps through the walls, glowing amber in the darkness. The Lord\'s throne is a natural seat formed where three root-branches diverge.',
   proprietor: 'House Thalreth',
   notableFeatures: [
    'The Hearth-Fire: a perpetual flame fed by resinous heartwood that has not gone out since before the sun was buried',
    'The Whispering Gallery: a curved wall where petitioners stand, the acoustics carry their words directly to the Lord\'s ear',
    'The Ledger-Stand: a rotating ironwood pillar displaying the day\'s decrees, updated hourly by Scribe-Sentinels'
   ]
  },
  {
   id: 'mist-gate-market',
   name: 'Mist-Gate Market',
   type: 'market',
   description:
    'The only open-air market in the Frostwood Reach, operating under a canopy of oiled canvas that catches and channels the mist away from the stalls. Merchants sell resin, parchment, ironwood carvings, imported whale oil, and "fog-charms", small carved tokens that supposedly ward off memory loss.',
   proprietor: 'Guild of Mist-Merchants',
   notableFeatures: [
    'The Parchment-Seller\'s Stall: run by an ancient Mimir woman who claims her blank parchment was made from trees that grew before the Fog Compact',
    'The Resin-Fountain: a public basin where anyone can fill a flask with liquid heartwood resin for their home hearth'
   ]
  },
  {
   id: 'root-tavern',
   name: 'The Root & Resin',
   type: 'tavern',
   description:
    'A warm, low-ceilinged tavern built into a hollow where two ironwood roots diverge. The walls sweat amber resin that the proprietor scrapes off and sells as candles. The specialty is "fog-brew", a hot, spiced ale that supposedly sharpens memory for a few hours.',
   proprietor: 'Old Maren (Thalren human, retired Scribe-Sentinel)',
   notableFeatures: [
    'The Memory Wall: patrons pin notes to the wall, things they want to remember, and other patrons read them aloud to keep the memories alive',
    'Fog-brew on tap; Maren claims the recipe was traded from the Florae before the uprising'
   ]
  }
 ],
 connectedMaps: [],
 factionPresence: [
  { factionId: 'house-thalreth', influence: 'dominant', description: 'The ruling family, their word is law' },
  { factionId: 'scribe-sentinels', influence: 'strong', description: 'Keep the ledgers, record the decrees, maintain the archives' },
  { factionId: 'order-of-solbrand', influence: 'moderate', description: 'The High Hearth serves as the Church\'s founding site; priests are respected but increasingly viewed as relics' }
 ],
 travelConnections: [
  { destinationId: 'the-shallows', distance: '2 miles', travelTime: '1 hour', route: 'Silt-road through the mist, marked by rusted lantern-posts' },
  { destinationId: 'scribes-tower', distance: 'half mile', travelTime: '15 min', route: 'Rope-and-plank bridges through the ironwood canopy' }
 ],
 classPresence: ['martyr', 'inquisitor', 'warden', 'augur'],
 npcs: ['kaelen-thalreth', 'aldren-thalreth', 'elara-thalreth', 'old-maren']
};

// =============================================================================
// NORDHALLA, The Frozen Archive (deep)
// =============================================================================
DEEP_LOCATIONS['frozen-archive'] = {
 heraldry: {
  iconUrl: '/assets/heraldry/frozen-archive.png',
  colors: { primary: '#1a3a5c', secondary: '#7ec8e3' },
  description: 'A glacier wall inscribed with Skald genealogy, backlit by pale blue geothermal light'
 },
 population: 400,
 dominantRaces: ['Skald humans'],
 leadership: {
  type: 'noble_house',
  title: 'Jarl of the Archive',
  leaderId: 'sigurd-skalvyr',
   description:
    'Jarl Sigurd Skalvyr runs the Archive as regional custodian under High King-Jarl Halvar Skalvyr (Jarn-Tand), who rules the Nordhalla from Frosthold Citadel. Sigurd is a man carved from glacier ice. He speaks rarely, decides slowly, and never reverses a decision once made.'
 },
 defenses: {
  militiaSize: 80,
  fortifications:
   'Skald chiselers carved the Archive into a living glacier. Its walls are fifty feet of solid ice, self-repairing. The only entrance is a narrow defile patrolled by Skald ice-trackers who can read footprints in rime as easily as others read ink.',
  watchPresence: 'Skald Keepers patrol the outer chambers; the deeper vaults are guarded by cold-silence, intruders who venture too far simply freeze where they stand'
 },
 economy: {
  primary: 'Knowledge preservation, genealogy chiseling, rune-keeping, and historical consultation',
  secondary: ['Geothermal energy distribution', 'Ice-quarrying for construction'],
  status: 'stable'
 },
 atmosphere: {
  mood:
   'deep silence and the weight of centuries. Every sound is swallowed by the ice. The Archive feels less like a building and more like a cathedral of frozen time, the Skald believe the glacier walls listen, and that disrespect echoes forever.',
  architecture:
   'Cathedral-like chambers carved from living glacier ice, their ceilings lost in blue darkness. Rune-inscribed pillars support vaults of compressed snow. The walls are covered floor-to-ceiling with chiseled genealogies, generations of Skald lineages traced in precise, angular script.',
  sounds:
   'The deep groan of settling ice, the distant drip of meltwater, the scratch of chisels from the genealogy halls, and, some say, the faint whispers of ancestors trapped in the walls.',
  smells: 'Cold stone, old ice (which has its own mineral scent, like frozen ozone), whale-oil lamps, and the faint copper tang of blood from the chiseling halls where genealogists cut their palms to mix ink.',
  lighting:
   'Pale blue-green from geothermal vents filtered through ice. Whale-oil lamps in the inhabited chambers. The deepest vaults are completely dark, the Skald navigate them by touch and memory.'
 },
 history: {
  founded: 'early in the Slow Cracks',
  foundedBy: 'House Skalvyr',
  foundingStory:
   'The Skald carved the Archive into the glacier as both fortress and tomb. The first chamber held their dead. The family believed that freezing their ancestors in ice would preserve not just their bodies but their wisdom. Over centuries, the vaults grew as chiselers added genealogies, star-charts, treaties, and prophecies.',
  significantEvents: [
   { date: 'at the Great Binding', event: 'First Augur reading: Cassia reads the failing of the warmth\'s hour in glacier-elk entrails' },
    { date: 'early in the Slow Cracks', event: 'The Skalvyr Glacier Bargain: Keth-Amar freezes glaciers through Aethil\'s framework; Frost-Tithe set on Rime-Born' },
   { date: 'just after Blizzard’s End', event: 'First Rebirth Window: Augurs measure 40% output; systematic logging begins' },
   { date: 'in the first centuries of the Freezing Era', event: 'Aldren Thalreth the Elder\'s self-entombment, his frozen chamber remains in the deepest vault' },
   { date: 'in the first centuries of the Freezing Era', event: 'Berserker founding: Grum\'s Blood-Heat occurs in Emberspire\'s caldera, recorded in Archive annals' },
   { date: 'in the later centuries of the Freezing Era', event: 'False Dawn Riots: Archive seals outer gates for the first time as mobs attack Augurs' },
   { date: 'within living memory', event: 'Clandestine Silence-heat engine construction began beneath the Archive' },
   { date: 'within living memory', event: 'Silence-Heat Heresy: construction of the heat-engine beneath the Archive begins in earnest' },
   { date: 'within living memory', event: 'Augur Collapse: accuracy plummets from 93% to 41%; Cassia\'s preserved body weeps frozen tears' }
  ]
 },
 subLocations: [
  {
   id: 'genealogy-halls',
   name: 'The Genealogy Halls',
   type: 'archive',
   description:
    'A vast, multi-tiered chamber where Skald chiselers work in silence, carving family lineages into the glacier walls. Each chiseler works with a blood-ink mixture, their own blood mixed with crushed minerals, believing that ancestry can only be recorded by one who shares the blood.',
   proprietor: 'Skald Keepers',
   notableFeatures: [
    'The Wall of First Names: the oldest genealogical record, dating to at the Great Binding of the Freezing Era',
    'The Correction Ledger: a small, heated chamber where errors in genealogies are debated and ruled upon by a council of Elders'
   ]
  },
  {
   id: 'still-chamber',
   name: 'The Still Chamber',
   type: 'tomb',
   description:
    'Where Aldren Thalreth the Elder sits frozen in meditative stasis, his body preserved in a block of translucent ice. Pilgrims visit to touch the ice and receive "counsel", though the Elder does not speak, visitors report receiving impressions, fragments of thought, and an overwhelming sense of sorrow.',
   proprietor: 'Solbrand Order',
   notableFeatures: [
    'The ice block radiates a faint warmth despite being frozen, pilgrims press their palms against it and claim it eases chronic pain',
    'A Scribe-Sentinel is stationed here at all times to record any "utterances" from the frozen High Confessor'
   ]
  }
 ],
 connectedMaps: [],
 factionPresence: [
  { factionId: 'house-skalvyr', influence: 'dominant', description: 'Absolute rulers of the Archive' },
  { factionId: 'skald-keepers', influence: 'strong', description: 'Maintain the genealogies and guard the vaults' },
  { factionId: 'order-of-solbrand', influence: 'moderate', description: 'Pilgrimage site; Aldren Thalreth the Elder\'s frozen chamber is a sacred destination' },
  { factionId: 'cult-of-forgotten-shadow', influence: 'secret', description: 'Clandestine Silence-heat research in sealed lower levels' }
 ],
 travelConnections: [
  { destinationId: 'fjord-gate', distance: '3 miles', travelTime: '2 hours', route: 'Frozen fjord-path, marked by rune-stones' },
  { destinationId: 'rimors-hearth', distance: '5 miles', travelTime: '3 hours', route: 'Geothermal vent-trail through ice tunnels' }
 ],
 classPresence: ['berserker', 'harbinger', 'warden', 'inquisitor'],
 npcs: ['sigurd-skalvyr', 'halvar-skalvyr', 'frigga-skalvyr', 'valeria-the-grim', 'skadi-glass-eye', 'sera-three-scars', 'malakor']
};

// =============================================================================
// BRYNGLOOM FOREST, Over-Shanty (deep)
// =============================================================================
DEEP_LOCATIONS['over-shanty'] = {
 heraldry: {
  iconUrl: '/assets/heraldry/over-shanty.png',
  colors: { primary: '#2d004b', secondary: '#6b4c8a' },
  description: 'A crooked rope-bridge spanning a darkness pierced by a single bioluminescent lantern'
 },
 population: 600,
 dominantRaces: ['Drun Neth', 'Vreken', 'Outcast Vreken'],
 leadership: {
  type: 'none',
  title: 'No formal governance, ruled by a shifting balance of gang influence and survival-of-the-fittest',
  leaderId: null,
  description:
   'The Over-Shanty has no single leader. Power is held by whoever controls the rope-bridges, the peat-harvest, and the black market. Currently, three factions vie for dominance: the Drun Outcasts, the Cult of Forgotten Shadow, and a loose coalition of Vreken peat-cutters.'
 },
 defenses: {
  militiaSize: 0,
  fortifications:
   'The Shanty\'s only defense is its location, suspended above bottomless peat-bogs, accessible only by retractable rope-bridges that the residents can cut in seconds. Invaders who fall into the bogs are preserved, aware, in the acidic peat.',
  watchPresence: 'No formal watch, but everyone in the Shanty watches everyone else. Gossip travels faster than arrows.'
 },
 economy: {
  primary: 'Black market trade, peat-harvesting, Silence-artifact trafficking',
  secondary: ['Information brokerage', 'Memory extraction services (Cult of Forgotten Shadow)', 'Fugitive harboring'],
  status: 'thriving'
 },
 atmosphere: {
  mood:
   'Desperate, electric, alive. The Over-Shanty hums with the energy of people who have nothing left to lose. It is a place of last chances and first betrayals, everyone here is running from something, and everyone will sell anyone for the right price.',
  architecture:
   'A chaotic hanging slum of rope-bridges, ramshackle wooden cabins, and repurposed ship-hulls suspended from the underside of Atropolis\'s main platforms. Buildings are lashed together with tarred rope and salvaged chain. Everything sways, newcomers get seasick.',
  sounds:
   'Creaking ropes, distant splashes from the bogs below, laughter and arguments from the taverns, the constant murmur of haggling, and, always, somewhere, someone crying.',
  smells:
   'Damp wood, peat-rot, cheap spirits, cooking fires, unwashed bodies, and the faint, sweet undertone of the preserving bogs that swallow the dead.',
  lighting:
   'Bioluminescent lanterns hung from every bridge, pale green and purple light. Fires are dangerous (everything is wood and rope), so most light comes from captive glow-moss cultivated in clay pots.'
 },
 history: {
  founded: 'Unknown, the Shanty grew organically as outcasts accumulated beneath Atropolis',
  foundedBy: 'The first Drun exiles who refused to burn their names from the First Contract',
  foundingStory:
   'When the Velun Neth signed the First Contract, those who could not abide its terms, who refused to surrender their names, their memories, or their autonomy, were cast down. They built platforms beneath Atropolis, then more platforms, then rope-bridges between them. The Shanty has never stopped growing.',
  significantEvents: [
   { date: 'in the middle decades of the Freeze', event: 'Local legend says Natalie Seline founded the Cult of Forgotten Shadow in a peat-crypt beneath the Shanty; whether the cult truly exists — or is merely a name the Shanty assigns to the silence that lives in the deep bogs — remains an open question' },
   { date: 'in the middle decades of the Freeze', event: 'Establishment: the Over-Shanty coalesces as permanent black-market settlement at peat-bog edge' },
    { date: 'in the most recent centuries', event: 'The Silence Between Stars: the Voice makes first two-way contact with the Cult\'s inner circle, answering from the deep dark' },
   { date: 'in the most recent centuries', event: 'The Great Fire, a third of the Shanty burned; the Cult used Shadow magic to contain the flames, earning grudging respect' }
  ]
 },
 subLocations: [
  {
   id: 'sunken-confessionals',
   name: 'The Sunken Confessionals',
   type: 'temple',
   description:
    'A network of submerged peat-crypts where the Cult of Forgotten Shadow practices memory extraction and Shadow confession. Clients, some willing, some not, are lowered into peat-filled chambers where Shadow priests enter their minds and extract specific memories, secrets, or traumas.',
   proprietor: 'Cult of Forgotten Shadow',
   notableFeatures: [
    'The Extraction Chambers: peat-filled cells where the priest and subject share consciousness',
    'The Memory Market: extracted memories are stored in crystal vials and sold, a father\'s recollection of his daughter\'s face, a soldier\'s memory of a battle, a lover\'s last kiss before betrayal'
   ]
  },
  {
   id: 'dangling-keel',
   name: 'The Dangling Keel',
   type: 'tavern',
   description:
    'A repurposed ship\'s hull suspended by chains directly over the deepest bog. The floor has a glass portal showing the darkness below. Patrons toss coins through the portal for luck, the coins fall for nearly a minute before they hit the peat. The Keel serves "bog-brew", a murky, potent spirit distilled from fermented peat-moss.',
   proprietor: 'Captain Gravis (Vreken, former smuggler)',
   notableFeatures: [
    'The Glass Floor: a rare piece of actual glass, showing the endless drop below',
    'The Wanted Board: a wall of fugitive notices and bounty posters, updated daily by the Cult\'s information network'
   ]
  }
 ],
 connectedMaps: [],
 factionPresence: [
  { factionId: 'cult-of-forgotten-shadow', influence: 'strong', description: 'The Cult runs the memory trade and provides "spiritual services"' },
  { factionId: 'drun-outcasts', influence: 'strong', description: 'The original inhabitants, control the rope-bridges and peat-harvesting' },
  { factionId: 'unlit-veil', influence: 'moderate', description: 'Unlit Veil brokers competing for control of the memory-trade; tense coexistence with the Drun' }
 ],
 travelConnections: [
  { destinationId: 'atropolis', distance: '200 feet up', travelTime: '10 min', route: 'Cargo elevators and rope-ladders up to Atropolis\'s platforms' },
  { destinationId: 'peat-bog-sinks', distance: 'half mile', travelTime: '30 min', route: 'Treacherous bog-boardwalks marked by glow-moss stakes' }
 ],
 classPresence: ['false_prophet', 'revenant', 'toxicologist'],
 npcs: ['natalie-seline', 'korrin-the-shade']
};

// =============================================================================
// SUNDRIFT VALE, Synod Hold (deep)
// =============================================================================
DEEP_LOCATIONS['synod-hold'] = {
 heraldry: {
  iconUrl: '/assets/heraldry/synod-hold.png',
  colors: { primary: '#8b6914', secondary: '#d4c5a0' },
  description: 'A circle of seven standing stones against a starless sky, each stone inscribed with the crest of a noble house'
 },
 population: 800,
 dominantRaces: ['Solari', 'Astril (Stellar Astril)'],
 leadership: {
  type: 'noble_house',
  title: 'Steppe-Lord',
  leaderId: 'loras-ordavan',
  description:
   'House Ordavan nominally rules from Synod Hold, but every trade minister has an Unlit Veil "advisor" at their elbow. Lord Loras Ordavan is a well-meaning man who has not yet realized that every decision he makes was suggested to him by someone else.'
 },
 defenses: {
  militiaSize: 30,
  fortifications:
   'Synod Hold is not a fortress. It is a gathering place. Its defenses are political, not military. The Hold\'s only physical protection is the vast, disorienting emptiness of the steppe that surrounds it.',
  watchPresence: 'Nomadic outriders patrol the steppe approaches; their horns can warn of invaders an hour before arrival'
 },
 economy: {
  primary: 'Trade nexus, all steppe trade routes converge at Synod Hold',
  secondary: ['Wool and hide from the great herds', 'Unlit Veil message-routing services', 'Oracle-readings from the ancestral mounds'],
  status: 'controlled_by_external'
 },
 atmosphere: {
  mood:
   'Anxious prosperity. The Hold\'s markets are busy, its storehouses full, but there is an undercurrent of unease. The ancestral mounds are falling silent. The Unlit Veil presence grows bolder by the season. The Steppe-Lord smiles but his eyes flick toward his advisors before answering questions.',
  architecture:
   'Low, circular stone buildings arranged in concentric rings around a central gathering field. The stone is pale limestone, quarried from the single ridge that breaks the monotony of the steppe. Every building entrance faces east, toward where Sol once rose.',
  sounds:
   'Wind, constant, keening, through the grass. The lowing of distant herds. The clink of trade-coins. The hum of an ancestral mound nearby, still faintly audible. Nomadic singers practicing the oral histories.',
  smells: 'Dry grass, animal musk, cooking smoke, and the faint ozone scent that accompanies an active ancestral mound',
  lighting:
   'Darkness broken only by firelight. The starless sky offers nothing. At night, the Hold\'s inhabitants light their homes with whale-oil lamps. On the steppe itself, the only light comes from the bioluminescence of the woolly herds\' antlers.'
 },
 history: {
  founded: 'in the early generations of the Freezing Era',
  foundedBy: 'House Ordavan',
  foundingStory:
   'Originally a seasonal gathering site for nomadic clans, Synod Hold grew into a permanent settlement when the Ordavan realized that the steppe\'s trade value exceeded its grazing value. The Unlit Veil arrived within a generation and never left.',

  significantEvents: [
   { date: 'before the Star-Fall', event: 'Astril First Landing: the refugee vessels from Lumia touch the steppe, carrying warning of Keth-Amar' },
   { date: 'in the early generations of the Freezing Era', event: 'Synod Hold established as a permanent trade post' },
   { date: 'in the early centuries of the Freezing Era', event: 'The first Synod delegates arrived, offering "trade consultation services"' },
   { date: 'in the early centuries of the Freezing Era', event: 'The Synod Organizes: formal ruling council established; first Echo-Submersion case recorded' },
   { date: 'decades into the Freezing Era', event: 'The Earthen Astril-Stellar Astril Schism: Harmonists vs. Silencers split the Astril' },
   { date: 'in the later centuries of the Freezing Era', event: 'False Dawn Riots: Synod authority challenged when the myth of Sol\'s return breaks' },
   { date: 'in the later centuries of the Freezing Era', event: 'Three ancestral mounds fell silent in a single season; cause still unknown' },
   { date: 'in the most recent centuries', event: 'Silence Between Stars: Li Wei witnesses the contact and founds the False Prophet tradition' }
  ]
 },
 subLocations: [
  {
   id: 'steppe-market',
   name: 'The Steppe Market',
   type: 'market',
   description:
    'A sprawling open-air market where nomadic herders trade wool, hide, and meat for imported goods. The Unlit Veil maintain the largest stalls, they sell navigation charts, memory-crystals, and "information consultation." Their prices are always fair. Too fair.',
   proprietor: 'Unlit Veil (unofficially) / House Ordavan (nominally)',
   notableFeatures: [
    'The Notice-Spire: a tall stone pillar where traders post messages; controlled by Unlit Veil clerks who "help" people write their notices',
    'The Astril Enclosure: a quiet corner where Unlit Veil agents sell echo-readings, fragments of Lumia glimpsed in their crystalline blood'
   ]
  }
 ],
 connectedMaps: [],
 factionPresence: [
  { factionId: 'house-ordavan', influence: 'nominal', description: 'The official rulers, but everyone knows who really runs the Hold' },
  { factionId: 'unlit-veil', influence: 'dominant', description: 'Control trade policy, information flow, and consultation contracts' }
 ],
 travelConnections: [
   { destinationId: 'emberspire-caldera', distance: '80 miles', travelTime: '3 days', route: 'The Ash-Road, a caravan trail marked by charcoal cairns' }
 ],
 classPresence: ['augur', 'false_prophet', 'gambit'],
 npcs: ['loras-ordavan', 'the-factotum']
};

// =============================================================================
// FROSTWOOD REACH, Mirror Mere (deep)
// =============================================================================
DEEP_LOCATIONS['mirror-mere'] = {
 heraldry: {
  iconUrl: '/assets/heraldry/mirror-mere.png',
  colors: { primary: '#3a5a6a', secondary: '#8ab4c4' },
  description: 'A perfectly still pool reflecting a featureless white mask, ringed by ironwood branches'
 },
 population: 200,
 dominantRaces: ['Masked Mimir', 'Thalren humans'],
 leadership: {
  type: 'council',
  title: 'Reflection Council',
  leaderId: null,
  description:
   'A rotating council of three Masked Mimir elders governs Mirror Mere, consulting the lake\'s reflections before every decision. The council chamber is the lakeshore itself. Decisions are made standing at the water\'s edge, watching the future-echoes ripple across the surface.'
 },
 defenses: {
  militiaSize: 15,
  fortifications:
   'The mere itself is the primary defense. The water reflects attackers before they arrive, giving the Mimir hours of advance warning. The surrounding ironwood grove has been shaped into a natural labyrinth by generations of Mimir horticulture.',
  watchPresence: 'Masked sentinels stand at cardinal points around the mere, their masks angled toward the water'
 },
 economy: {
  primary: 'Divination services and identity-verification',
  secondary: ['Memory-glass harvesting from the lakebed', 'Mask-carving from storm-glass', 'Fog-navigation consultation'],
  status: 'stable'
 },
 atmosphere: {
  mood:
   'Hushed and reverent, as if inside a cathedral of glass. The Mimir move with deliberate grace around the mere. They believe every action is reflected and remembered by the water. Visitors speak in whispers, not from fear, but because the lake amplifies and returns every sound with a delay that makes conversation unsettling.',
  architecture:
   'Low, curved buildings of pale driftwood and storm-glass, designed to complement rather than compete with the lake. Every structure faces the water. The Mimir homes are mirrored on the inside, reflective surfaces everywhere, so inhabitants can verify their forms constantly.',
  sounds:
   'The lap of perfectly still water (somehow audible despite the calm), the soft click of mask-adjustments, wind chimes made of frozen memory-glass, and the occasional ripple that has no visible cause.',
  smells:
   'Clean, cold water with a faint metallic undertone, like licking a silver spoon. Crushed pine needles from the ironwood canopy. The absence of bog-smell is itself notable.',
  lighting:
   'Reflected light dominates, the mere catches whatever illumination exists and doubles it. On clear nights, bioluminescent lichen and the glow of the lake itself provide a steady, silver-blue radiance. The effect is dreamlike.'
 },
 history: {
  founded: 'in the early generations of the Freezing Era',
  foundedBy: 'Masked Mimir elders',
  foundingStory:
   'When the first Mimir discovered that the fog was dissolving their identities, a small group of Masked sought a place where identity could be verified externally. They found a lake so perfectly still that it reflected not just the present, but rippled with echoes of the near future. They built their settlement around it, and the mere has served as both anchor and oracle ever since.',
  significantEvents: [
   { date: 'in the early generations of the Freezing Era', event: 'The Mirror Compact, Mimir elders swore to maintain the mere as a neutral identity-ground' },
   { date: 'around the time of the Mimir Purge', event: 'A Gref emerged from the mere\'s reflection, stealing the face of an elder mid-council session' },
   { date: 'in the most recent centuries', event: 'Thalren scribes established a memory-glass harvesting operation with Mimir permission' }
  ]
 },
 subLocations: [
  {
   id: 'reflection-council-shore',
   name: 'The Council Shore',
   type: 'great_hall',
   description:
    'The semicircular lakeshore where the Reflection Council meets. Three carved stone seats face the water, positioned so the councilors can read both the reflections and each other simultaneously. The water directly in front of the seats is the clearest, the Mimir believe the mere presents itself deliberately to its leaders.',
   proprietor: 'Reflection Council',
   notableFeatures: [
    'The Depth-Mirror: a section of the lake that reflects not faces but forms, revealing a viewer\'s true shape regardless of mask or disguise',
    'The Warning-Ripple: the council has catalogued dozens of distinct ripple patterns and their associated future-events'
   ]
  },
  {
   id: 'the-glassworks',
   name: 'The Glassworks',
   type: 'market',
   description:
    'A covered workshop where Mimir artisans harvest memory-glass from the lakebed and carve it into masks, lenses, and divination tools. The glass is naturally formed by the mere\'s unique alchemy, volcanic minerals, cold-iron trace elements, and something the Mimir will not discuss. Each piece is unique, and the finest specimens capture and hold a single memory indefinitely.',
   proprietor: 'Masked Artisans\' Guild',
   notableFeatures: [
    'The Memory-Vials: small glass ampoules containing captured reflections, sold to Thalren scribes as archival insurance',
    'The Unmasking Booth: a private chamber where Mimir can safely remove their masks to verify their true forms, heavily guarded, as an unmasked Mimir is profoundly vulnerable'
   ]
  }
 ],
 connectedMaps: [],
 factionPresence: [
  { factionId: 'veiled-mimir', influence: 'dominant', description: 'Founders and custodians of the mere' },
  { factionId: 'scribe-sentinels', influence: 'moderate', description: 'Maintain a small presence for memory-glass procurement and cross-referencing' }
 ],
 travelConnections: [
  { destinationId: 'greymark-keep', distance: '8 miles', travelTime: '3 hours', route: 'Mist-shrouded ironwood path, marked by storm-glass cairns' },
  { destinationId: 'the-shifting-fen', distance: '2 miles', travelTime: '45 min', route: 'Boardwalk through the fen, path changes with the seasons' }
 ],
 classPresence: ['lunarch', 'shaper', 'warden'],
 npcs: []
};

// =============================================================================
// NORDHALLA, Vargtor (deep)
// =============================================================================
DEEP_LOCATIONS['vargtor'] = {
 heraldry: {
  iconUrl: '/assets/heraldry/vargtor.png',
  colors: { primary: '#2a3a4a', secondary: '#7a8a9a' },
  description: 'A rocky tor topped with a signal-fire, wolves circling its base'
 },
 population: 150,
 dominantRaces: ['Skald humans', 'Rime-Born'],
 leadership: {
  type: 'military',
  title: 'Watch-Commander',
  leaderId: null,
  description:
   'A rotating Watch-Commander from the Skald Ice-Trackers commands Vargtor\'s military garrison. The commander holds absolute authority within the tor\'s walls, a necessity given the speed at which glacier wyrms and Corvani raiding parties can strike.'
 },
 defenses: {
  militiaSize: 40,
  fortifications:
   'The tor itself is the fortification, a natural pillar of granite rising two hundred feet above the glacier line. The garrison has reinforced the natural caves with iron-banded doors and cold-iron stakes driven into the stone. A signal-fire at the summit can be seen for thirty miles.',
  watchPresence: 'Ice-Trackers patrol the tor\'s approaches in four-hour shifts, reading the rime for signs of approach'
 },
 economy: {
  primary: 'Military garrison, funded by House Skalvyr',
  secondary: ['Wolf-pelt trading', 'Ice-quarrying', 'Emergency shelter for passing caravans'],
  status: 'stable'
 },
 atmosphere: {
  mood:
   'Disciplined and cold. The garrison operates with the precision of a machine, every torch is lit at the same hour, every patrol follows the same route, every meal is eaten in silence. The Skald here have none of the bardic warmth of Fjord-Gate. They are watchers, and watchers learn to be still.',
  architecture:
   'Spartan stone chambers carved into the tor itself, connected by narrow tunnels and iron ladders. No decoration except weapons racks and genealogy tablets. The commander\'s chamber is at the top, with a window overlooking the glacier approaches.',
  sounds:
   'Wind, constant, keening, at hurricane force on exposed faces. The howl of wolves at the tor\'s base. The crack of ice shifting. The rhythmic clatter of the signal-fire\'s chain-pulley.',
  smells: 'Cold stone, iron, smoke from the signal-fire, and the unmistakable musk of wolves that gather at the base every winter.',
  lighting:
   'Harsh and functional, whale-oil lamps in iron cages. The signal-fire bathes the summit in orange light. On clear nights, the glacier reflects starlight with an intensity that makes the tor glow blue-white.'
 },
 history: {
  founded: 'in the early centuries of the Freezing Era',
  foundedBy: 'House Skalvyr',
  foundingStory:
   'Established as a forward watch-post after a Corvani raiding party descended from the eastern peaks and sacked a Skald fishing village. The tor was chosen for its natural height and the strange affinity wolves show for its base, the garrison has never been taken by surprise.',
  significantEvents: [
   { date: 'in the early centuries of the Freezing Era', event: 'Garrison established after the Corvani Sack of Hvalvik' },
   { date: 'decades into the Freezing Era', event: 'A glacier wyrm attacked the tor and was repelled, its frozen corpse remains at the base as a warning' },
   { date: 'in the most recent centuries', event: 'Rime-Born Rune Keepers arrived to study the ancient runic carvings found in the tor\'s deepest chambers' }
  ]
 },
 subLocations: [
  {
   id: 'the-wolf-gate',
   name: 'The Wolf Gate',
   type: 'fortification',
   description:
    'The only entrance to the tor, a narrow passage at the base, reinforced with cold-iron doors carved with wolf-heads. The wolves that gather outside the gate are not tame, but the garrison feeds them scraps, creating an unofficial first line of defense.',
   proprietor: 'Skald Ice-Trackers',
   notableFeatures: [
    'The Wyrm-Skull: the frozen skull of the glacier wyrm killed in decades into the Freezing Era, mounted above the gate',
    'The Rime-Scratch Board: a wall of ice where the Ice-Trackers record their patrol observations in runic shorthand'
   ]
  },
  {
   id: 'the-deep-carvings',
   name: 'The Deep Carvings',
   type: 'archive',
   description:
    'A chamber in the tor\'s lowest level where ancient runic carvings cover every surface, predating the Skald garrison by centuries. The Rime-Born believe the carvings are a record of the Glacier Bargain itself, written by witnesses who froze solid while inscribing it.',
   proprietor: 'Rime-Born Rune Keepers',
   notableFeatures: [
    'The Bargain Stone: a single, central tablet that the Rime-Born claim describes the exact terms of the Skalvyr compact',
    'The Frozen Scribes: three humanoid shapes visible in the ice of the far wall, bodies preserved mid-carving'
   ]
  }
 ],
 connectedMaps: [],
 factionPresence: [
  { factionId: 'house-skalvyr', influence: 'dominant', description: 'Funds and commands the garrison' },
  { factionId: 'rime-born', influence: 'moderate', description: 'Maintain the Deep Carvings and provide magical support' }
 ],
 travelConnections: [
  { destinationId: 'frozen-archive', distance: '12 miles', travelTime: '6 hours', route: 'Glacier traverse, marked by ice-cairns' },
  { destinationId: 'fjord-gate', distance: '20 miles', travelTime: '10 hours', route: 'Mountain path along the fjord wall' }
 ],
 classPresence: ['berserker', 'harbinger', 'warden', 'augur'],
 npcs: []
};

// =============================================================================
// SUNDALE, Ember Lagoon (deep)
// =============================================================================
DEEP_LOCATIONS['ember-lagoon'] = {
 heraldry: {
  iconUrl: '/assets/heraldry/ember-lagoon.png',
  colors: { primary: '#8b3a00', secondary: '#ff6a00' },
  description: 'A steaming lagoon cradled by black basalt, its waters glowing orange-red'
 },
 population: 350,
 dominantRaces: ['Solari', 'Merryn traders'],
 leadership: {
  type: 'guild',
  title: 'Harbour-Master',
  leaderId: null,
  description:
   'The Harbour-Master, a Solari forge-master elected by the dock guilds every five years, governs Ember Lagoon. The Harbour-Master controls port fees, diving rights, and access to the thermal vents. It is a position of considerable wealth and equally considerable danger. Two of the last five Harbour-Masters died in volcanic eruptions.'
 },
 defenses: {
  militiaSize: 25,
  fortifications:
   'The lagoon\'s natural geography is its primary defense, the entrance is a narrow channel between volcanic cliffs that can be blocked with iron chains. The water temperature deters most aquatic threats, and the constant steam provides cover from aerial observation.',
  watchPresence: 'Solari dock-guards patrol the quays in four-hour shifts, armed with thermal pikes that glow white-hot at the tip'
 },
 economy: {
  primary: 'Port trade, Sundale\'s only harbor',
  secondary: ['Fire-coral harvesting', 'Thermal crystal diving', 'Volcanic glass export'],
  status: 'thriving'
 },
 atmosphere: {
  mood:
   'Busy, humid, and loud. Ember Lagoon is the closest thing Sundale has to a cosmopolitan port. Solari and Merryn all rub shoulders on the docks. The air is thick with steam and the smell of cooking fish. Arguments in three languages echo off the basalt cliffs.',
  architecture:
   'Dock buildings of black basalt and iron, their walls running with condensation. Every structure is built to withstand tremors, low, wide, and anchored with iron stays. The Solari buildings feature open-air forge-hearths instead of fireplaces. The Merryn quarter is built on stilts over the water, swaying gently with the thermal currents.',
  sounds:
   'The constant hiss of steam venting from the lagoon, the clang of Solari forges, the creak of Merryn rigging, merchants haggling in Sundari and Aquan simultaneously, and the low, persistent rumble of volcanic activity beneath the water.',
  smells:
   'Sulfur, salt water, volcanic heat, roasting fish, molten metal, and the sweet, acrid smoke of fire-coral being processed for trade.',
  lighting:
   'Orange-red from the volcanic glow beneath the water\'s surface. The lagoon literally glows at night, the thermal vents illuminate the water from below, casting rippling red light on the basalt cliffs. It is never truly dark here.'
 },
 history: {
  founded: 'in the first centuries of the Freezing Era',
  foundedBy: 'Hollow-Solari and Merryn sailors',
  foundingStory:
   'Discovered by a Merryn trading vessel blown off course during a gale. The captain found warm water in a frozen sea and immediately recognized its value. The Solari, who had known of the thermal vents but considered them sacred, reluctantly agreed to share the site when the Merryn demonstrated that the lagoon could be Sundale\'s lifeline to the outside world.',
  significantEvents: [
   { date: 'in the first centuries of the Freezing Era', event: 'First Merryn-Solari trade agreement signed on the lagoon shore' },
   { date: 'decades into the Freezing Era', event: 'The Great Eruption, a thermal vent exploded, destroying a third of the dock district' },
   { date: 'in the later centuries of the Freezing Era', event: 'Solvarn sun-priests established a shrine to Sol on the eastern cliff, drawing pilgrims' }
  ]
 },
 subLocations: [
  {
   id: 'the-thermal-docks',
   name: 'The Thermal Docks',
   type: 'market',
   description:
    'The main quay of Ember Lagoon, built from volcanic basalt blocks that radiate heat. Ships dock here to load Sundale\'s exports, cold-iron, volcanic glass, fire-coral, and unload imports from every region. The dock is chaotic, loud, and incredibly profitable.',
   proprietor: 'Dock Guilds',
   notableFeatures: [
    'The Ember-Beacon: a tower of volcanic glass at the dock\'s end, lit by a perpetual thermal vent, visible for ten miles out to sea',
    'The Coral Market: an underwater bazaar where Myrathil divers trade fire-coral directly from the lagoon floor'
   ]
  },
  {
   id: 'sols-shrine',
   name: "Sol's Shrine",
   type: 'temple',
   description:
     'A natural cave in the eastern cliff wall where thermal light filters through volcanic crystal, creating a perpetual sunrise effect. Solari pilgrims come here to pray to the buried sun, the cave\'s warmth is considered Sol\'s breath, and the orange light is taken as proof the star still lives.',
   proprietor: 'Dawn Vigil',
   notableFeatures: [
    'The Sun-Crystal: a massive volcanic crystal in the cave ceiling that refracts thermal light into a convincing solar spectrum',
     'The Prayer-Walls: covered in Solari prayers carved in Sundari script, some dating back centuries, worn smooth by the touching of thousands of hands'
   ]
  }
 ],
 connectedMaps: [],
 factionPresence: [
  { factionId: 'solari-forge-clans', influence: 'dominant', description: 'Control the docks, diving rights, and thermal vent access' },
  { factionId: 'house-solvan', influence: 'moderate', description: 'Maintain the shrine and the pilgrimage trade' },
  { factionId: 'merryn-traders', influence: 'moderate', description: 'Control the shipping lanes and import-export pricing' }
 ],
 travelConnections: [
  { destinationId: 'great-forge', distance: '15 miles', travelTime: '6 hours', route: 'The Cinder Road, basalt-paved, maintained by Solari workers' },
  { destinationId: 'merrowport', distance: '200 miles', travelTime: '4 days by sea', route: 'The Cinder Strait, dangerous but fast' }
 ],
 classPresence: ['martyr', 'pyrofiend', 'spellguard', 'warden'],
 npcs: []
};

// =============================================================================
// BRYNGLOOM FOREST, Aran-Glen (deep)
// =============================================================================
DEEP_LOCATIONS['aran-glen'] = {
 heraldry: {
  iconUrl: '/assets/heraldry/aran-glen.png',
  colors: { primary: '#1a4a2a', secondary: '#4a8a5a' },
  description: 'A living ironwood tree shaped into an archway, its roots forming a perfect circle'
 },
 population: 300,
 dominantRaces: ['Kessen Neth', 'Vreken'],
 leadership: {
  type: 'contractual',
  title: 'Grove-Steward',
  leaderId: null,
  description:
   'A Grove-Steward, a Kessen Neth weaver who has legally bound themselves to the grove\'s health through a personal contract with the ironwood root-network, governs Aran-Glen. The Steward\'s authority is absolute within the glen but automatically void if the grove\'s health metrics decline. It is a governance system designed to prevent corruption through self-interest.'
 },
 defenses: {
  militiaSize: 20,
  fortifications:
   'The living ironwood walls that define the glen are its defense. Centuries of Kessen horticulture have produced a barrier of interlocking branches and thorns that is harder than stone and capable of self-repair. The entrance is a single archway grown from two trees that have merged at the crown.',
  watchPresence: 'Kessen root-walkers patrol the perimeter, their bare feet reading vibrations through the root-network'
 },
 economy: {
  primary: 'Ironwood cultivation and living-architecture construction',
  secondary: ['Contract-arbitration services', 'Bioluminescent moss harvesting', 'Medicinal bog-fungi cultivation'],
  status: 'stable'
 },
 atmosphere: {
  mood:
   'Calm, ordered, and alive. Aran-Glen feels less like a settlement and more like a single organism, the buildings breathe, the paths shift subtly with the seasons, and the root-network hums with a constant, low vibration that the Kessen find soothing and visitors find mildly disorienting.',
  architecture:
   'Every structure in Aran-Glen is grown, not built. The Kessen coax ironwood saplings into architectural forms over decades, arches, walls, roofs, and chambers all formed from living wood. The buildings shed leaves in autumn, bloom in spring, and grow slightly larger every year. The effect is organic beauty that no stonemason could replicate.',
  sounds:
   'The creak and rustle of living wood, the hum of the root-network (a constant low drone like a temple bell), the murmur of the bayou, and the gentle clicking of Kessen contract-tablets being annotated.',
  smells:
   'Fresh sap, wet earth, the clean mineral scent of healthy root-systems, and the faint sweetness of ironwood flowers, one of the few pleasant smells in the Bryngloom.',
  lighting:
   'Bioluminescent moss cultivated on every surface provides a steady, warm green-gold light. The Kessen have bred specific strains for different brightness levels, creating a natural lighting system that responds to the settlement\'s needs.'
 },
 history: {
  founded: 'in the first centuries of the Freezing Era',
  foundedBy: 'Kessen Neth Weavers',
  foundingStory:
   'When Atropolis grew crowded and the Velun Pact-Lords became increasingly rigid in their interpretation of the First Contract, a group of Kessen weavers left to establish a community dedicated to the living arts. They found a narrow glen where the ironwood roots formed a natural enclosure and began the slow, patient work of growing a settlement. Three centuries later, Aran-Glen is proof that architecture can be alive.',
  significantEvents: [
   { date: 'in the first centuries of the Freezing Era', event: 'The Glen Compact, Kessen weavers bound themselves to the grove\'s health' },
   { date: 'decades into the Freezing Era', event: 'First successful living-bridge grown across the glen, spanning 100 feet' },
   { date: 'in the later centuries of the Freezing Era', event: 'Morren peat-cutters granted settlement rights in exchange for root-system maintenance' }
  ]
 },
 subLocations: [
  {
   id: 'the-grove-heart',
   name: 'The Grove-Heart',
   type: 'great_hall',
   description:
    'The oldest tree in the glen, a colossal ironwood whose canopy covers half the settlement. The tree serves as the Glen-Steward\'s seat of governance and the community\'s gathering space. Its trunk is carved with three centuries of Kessen contract-law precedents.',
   proprietor: 'Grove-Steward',
   notableFeatures: [
    'The Living Archive: contract-tablets grown directly from the tree\'s bark, containing legal decisions that update as the tree grows',
    'The Root-Chamber: a hollow space inside the trunk where the root-network\'s hum is strongest, used for meditation and deep contract-negotiation'
   ]
  },
  {
   id: 'the-weavers-market',
   name: "The Weavers' Market",
   type: 'market',
   description:
    'A market grown from a double-row of arching ironwood saplings whose branches form a natural colonnade. Kessen artisans sell living-wood furniture (which continues to grow after purchase), bioluminescent moss lamps, contract-tablets, and rare medicinal fungi harvested from the bog-edge.',
   proprietor: 'Kessen Artisans\' Collective',
   notableFeatures: [
    'The Growing-Furniture Row: chairs, tables, and shelving that are still alive, buyers must sign a maintenance contract',
     'The Bog-Apothecary: a stall run by a Vreken herbalist who has learned Kessen root-reading to identify medicinal compounds'
   ]
  }
 ],
 connectedMaps: [],
 factionPresence: [
  { factionId: 'kessen-weavers', influence: 'dominant', description: 'Founders and custodians of the glen' },
  { factionId: 'velun-pact-lords', influence: 'moderate', description: 'Maintain a legal liaison to ensure the Glen Compact remains consistent with the First Contract' },
  { factionId: 'morren-peat-cutters', influence: 'minor', description: 'Provide labor and root-system maintenance in exchange for settlement rights' }
 ],
 travelConnections: [
  { destinationId: 'atropolis', distance: '5 miles', travelTime: '2 hours', route: 'Living-root boardwalk through the forest canopy' },
  { destinationId: 'vel-keth-bayou', distance: '3 miles', travelTime: '1 hour', route: 'Canoe through the bayou channels' }
 ],
 classPresence: ['arcanoneer', 'animist', 'warden', 'toxicologist'],
 npcs: []
};

// =============================================================================
// CRAGJAW PEAKS, Gearworks Gulch (deep)
// =============================================================================
DEEP_LOCATIONS['gearworks-gulch'] = {
 heraldry: {
  iconUrl: '/assets/heraldry/gearworks-gulch.png',
  colors: { primary: '#4a4a3a', secondary: '#8a7a3a' },
  description: 'Interlocking gears framing a geothermal steam-vent'
 },
 population: 400,
 dominantRaces: ['Fexric', 'Groven', 'Tessen humans'],
 leadership: {
  type: 'guild',
  title: 'Chief Artificer',
  leaderId: null,
  description:
   'The Chief Artificer, the most innovative Fexric engineer chosen by competitive exhibition every three years, governs Gearworks Gulch. The Chief Artificer controls resource allocation, patent registration, and industrial safety standards. The position is as much about managing egos as engineering.'
 },
 defenses: {
  militiaSize: 30,
  fortifications:
   'The gulch\'s narrow entrance is sealed each night by a massive iron portcullis powered by geothermal hydraulics. Inside, the industrial infrastructure itself serves as defense, steam vents can be directed at attackers, and the machinery creates a labyrinth of moving parts that outsiders cannot navigate.',
  watchPresence: 'Fexric automaton-sentries patrol the upper galleries, clockwork constructs that respond to unauthorized movement with non-lethal electrical discharge'
 },
 economy: {
  primary: 'Clockwork manufacturing and industrial engineering',
  secondary: ['Geothermal power distribution', 'Scrap-metal recycling', 'Automaton repair and customization'],
  status: 'thriving'
 },
 atmosphere: {
  mood:
   'Feverish, inventive, and loud. Gearworks Gulch never sleeps. The geothermal power runs twenty-four hours, and Fexric engineers work in shifts, each trying to out-invent the previous. The air vibrates with the hum of machinery and the excited shouting of artisans showing off new mechanisms.',
  architecture:
   'Industrial Fexric construction, iron frameworks, riveted plate walls, and geothermal pipe-networks visible on every surface. Buildings are stacked vertically up the ravine walls, connected by iron catwalks, cargo elevators, and steam-powered lifts. Everything is functional, nothing is decorative, and yet the cumulative effect is oddly beautiful, a canyon of interlocking machinery.',
  sounds:
   'The constant clatter and whir of clockwork, the hiss of steam pressure-relief valves, the clang of forge-hammers, the grind of ore-crushers, and the excited babble of Fexric arguing in Scrap-Tongue and Fexric simultaneously.',
  smells:
   'Sulfur from the geothermal vents, hot metal, machine oil, ozone from electrical testing, and the sharp tang of acid-etching solution.',
  lighting:
   'Industrial illumination, gas-lamps, electrical arc-lights, and the orange glow of forge-fires. The geothermal vents cast an eerie red light from below. Steam creates a perpetual haze that diffuses all light sources into soft halos.'
 },
 history: {
  founded: 'in the early centuries of the Freezing Era',
  foundedBy: 'Clockwork Fexric',
  foundingStory:
   'Founded when a Clockwork Fexric expedition discovered a geothermal ravine with naturally occurring steam-pressure that could power machinery without manual bellows. Within a generation, the gulch became the industrial heart of the Cragjaw Peaks, producing clockwork mechanisms, automaton components, and refined metals for all seven regions.',
  significantEvents: [
   { date: 'in the early centuries of the Freezing Era', event: 'Geothermal ravine discovered and first forge-works established' },
   { date: 'decades into the Freezing Era', event: 'The Great Backlash, a pressure explosion killed forty Fexric and led to the Safety Codes' },
   { date: 'in the most recent centuries', event: 'First successful automaton-sentry deployed, revolutionizing gulch security' }
  ]
 },
 subLocations: [
  {
   id: 'the-prototyping-floor',
   name: 'The Prototyping Floor',
   type: 'market',
   description:
    'The largest open space in the gulch, a floor of worked stone where Fexric artisans demonstrate new inventions to potential buyers. The floor is chaotic: automaton prototypes walk, crawl, and occasionally explode; weapon demonstrations draw crowds; and the Chief Artificer holds court from a raised platform at the far end.',
   proprietor: 'Fexric Artisans\' Guild',
   notableFeatures: [
    'The Patent Board: a massive iron wall where Fexric register new inventions by nailing mechanical drawings to its surface',
    'The Testing Range: a reinforced section where weapon and automaton prototypes are demonstrated (protective goggles required)'
   ]
  },
  {
   id: 'the-deep-forge',
   name: 'The Deep Forge',
   type: 'fortification',
   description:
    'The geothermal forge at the ravine\'s lowest point, where the most sensitive and dangerous work is done. The forge is powered directly by volcanic steam at pressures that would kill an unprotected worker. Only Fexric with guild-certified pressure-suit training are permitted below the third catwalk.',
   proprietor: 'Chief Artificer',
   notableFeatures: [
    'The Pressure-Chamber: a sealed room where alloys are forged under extreme geothermal pressure, producing metals found nowhere else',
    'The Core-Tap: a bore-hole reaching into the mountain\'s volcanic heart, capped with Fexric pressure-regulation technology'
   ]
  }
 ],
 connectedMaps: [],
 factionPresence: [
  { factionId: 'kethrin-guild-bound', influence: 'dominant', description: 'Founded and operate the gulch\'s industrial infrastructure' },
  { factionId: 'drall-clan-free', influence: 'moderate', description: 'Provide scrap-metal recycling and salvaged components' },
  { factionId: 'house-tesshan', influence: 'moderate', description: 'Maintain a trade office for cold-iron procurement' }
 ],
 travelConnections: [
  { destinationId: 'frostmaw-holdfast', distance: '8 miles', travelTime: '4 hours', route: 'Mountain ledge-path, maintained by Fexric bridge-engineers' },
  { destinationId: 'sump-galleries', distance: '5 miles', travelTime: '2 hours', route: 'Underground steam-tunnel (dangerous, toxic gas pockets)' }
 ],
 classPresence: ['chronarch', 'gambit', 'spellguard', 'warden'],
 npcs: []
};

// =============================================================================
// ICEHEART SEA, Spindrift Lagoon (deep)
// =============================================================================
DEEP_LOCATIONS['spindrift-lagoon'] = {
 heraldry: {
  iconUrl: '/assets/heraldry/spindrift-lagoon.png',
  colors: { primary: '#0a4a6a', secondary: '#4acaca' },
  description: 'A coral reef glowing blue-green beneath crystalline water'
 },
 population: 250,
 dominantRaces: ['Myrathil Shore', 'Merryn humans'],
 leadership: {
  type: 'council',
  title: 'Reef-Mother',
  leaderId: null,
  description:
   'The Reef-Mother, the eldest Shore Myrathil coral-tender, governs Spindrift Lagoon. Her authority derives from her intimate knowledge of the reef substrate. The Reef-Mother controls harvesting quotas, diving permissions, and settlement boundaries. She communicates primarily through the bioluminescent patterns of her own crystalline skin.'
 },
 defenses: {
  militiaSize: 20,
  fortifications:
   'The coral reef itself is the defense, a living wall of fire-coral and crystalline formations that surrounds the lagoon. The entrance channel is narrow and navigable only by captains who know the bioluminescent marker-patterns. Myrathil divers can collapse sections of the reef in emergencies.',
  watchPresence: 'Shore sentinels swim the reef perimeter in rotating shifts, their bioluminescence pulsing in coded patterns'
 },
 economy: {
  primary: 'Bioluminescent organism harvesting',
  secondary: ['Coral-architecture construction', 'Thermal crystal extraction', 'Underwater navigation consultation'],
  status: 'thriving'
 },
 atmosphere: {
  mood:
   'Serene and otherworldly. Spindrift Lagoon is the most beautiful settlement in the Iceheart Sea, warm water, living light, and coral formations that defy geometry. The Myrathil move through the water with the grace of born swimmers, and the Merryn dock-workers have learned to match their calm.',
  architecture:
   'Half the settlement is underwater, Myrathil coral-grown chambers beneath the lagoon\'s surface, illuminated by cultivated bioluminescence. The surface structures are Merryn-built: wooden platforms and houseboats anchored to the reef. The two halves coexist naturally, connected by diving bells and rope-ladders.',
  sounds:
   'The constant lapping of warm water against coral, the clicking of Myrathil sonar-communication, the creak of Merryn boats, the bubbling of thermal vents, and the distant song of Deep-Born Myrathil during the Drowning Rites.',
  smells:
   'Salt water, warm coral, the faint sweet scent of bioluminescent organisms, and the mineral-rich steam from thermal vents.',
  lighting:
   'Bioluminescent blue-green light from the coral reef provides the primary illumination, the entire lagoon glows at night, visible for miles across the frozen sea. The effect is breathtaking. Surface fires and lanterns provide warm accents. The interplay of blue-green from below and orange-gold from above creates a dual-toned world.'
 },
 history: {
  founded: 'in the first centuries of the Freezing Era',
  foundedBy: 'Myrathil Shore',
  foundingStory:
   'The lagoon was discovered by Shore Myrathil following a thermal current that cut through the frozen sea like a warm scar. They found a volcanic hotspot where coral had survived the failing of the warmth, sheltered by the unique thermal dynamics. The Shore have tended the reef ever since, building a settlement that exists in harmony with the living organisms that power it.',
  significantEvents: [
   { date: 'in the first centuries of the Freezing Era', event: 'First coral-chamber grown; the Shore established the Reef Compact' },
   { date: 'in the early centuries of the Freezing Era', event: 'Merryn traders arrived; negotiated a co-habitation agreement' },
   { date: 'in the middle decades of the Freeze', event: 'A coral blight threatened the reef, the Reef-Mother sacrificed her voice to save it, communicating only through bioluminescence thereafter' }
  ]
 },
 subLocations: [
  {
   id: 'the-coral-gardens',
   name: 'The Coral Gardens',
   type: 'market',
   description:
    'An underwater marketplace grown from living coral, where Myrathil artisans sell bioluminescent organisms, thermal crystals, and coral-sculpted tools. Buyers wear diving helmets or are Myrathil, the market operates entirely beneath the surface. Transactions are conducted through bioluminescent pulse-codes and hand-signals.',
   proprietor: 'Shore Artisans',
   notableFeatures: [
    'The Glow-Vats: sealed coral chambers where the most valuable bioluminescent strains are cultivated',
    'The Crystal-Shelves: natural alcoves in the reef where thermal crystals grow, harvested monthly under strict quota'
   ]
  },
  {
   id: 'the-surface-docks',
   name: 'The Surface Docks',
   type: 'market',
   description:
    'The Merryn-built surface layer of the settlement, wooden docks, houseboats, and trading posts where surface-dwellers conduct business without getting wet. The docks are the primary point of contact between the lagoon and the outside world.',
   proprietor: 'Merryn Dock-Master',
   notableFeatures: [
    'The Diving Bell Station: a mechanical lift that lowers surface-dwellers to the coral-gardens in a sealed brass bell',
    'The Glow-Market: a surface stall selling prepared bioluminescent lanterns and light-sources to visiting ships'
   ]
  }
 ],
 connectedMaps: [],
 factionPresence: [
  { factionId: 'myrathil-shore', influence: 'dominant', description: 'Custodians of the reef and primary producers' },
  { factionId: 'merryn-traders', influence: 'moderate', description: 'Handle all surface trade and shipping logistics' },
  { factionId: 'house-mereval', influence: 'minor', description: 'Maintain a trade representative for luxury bioluminescent goods' }
 ],
 travelConnections: [
  { destinationId: 'merrowport', distance: '150 miles', travelTime: '3 days by sea', route: 'The Warm Current, a reliable thermal lane through the ice' },
  { destinationId: 'deepwell-archipelago', distance: '40 miles', travelTime: '8 hours by ship', route: 'Submerged reef-tunnels connect to the archipelago' }
 ],
 classPresence: ['warden', 'spellguard', 'toxicologist'],
 npcs: []
};

// =============================================================================
// SUNDRIFT VALE, Starfall Vale (deep)
// =============================================================================
DEEP_LOCATIONS['starfall-vale'] = {
 heraldry: {
  iconUrl: '/assets/heraldry/starfall-vale.png',
  colors: { primary: '#2a1a4a', secondary: '#7a5aaa' },
  description: 'A crystalline shard embedded in dark earth, emanating pale starlight'
 },
 population: 150,
 dominantRaces: ['Earthen Astril', 'Ordan humans'],
 leadership: {
  type: 'religious',
  title: 'Star-Oracle',
  leaderId: null,
  description:
   'The Star-Oracle, a Earthen Astril whose Lumian echo has achieved the deepest symbiosis, governs Starfall Vale. The symbiosis grants them prophetic visions tied to the crystalline shards. The Oracle\'s authority is spiritual rather than political, but in a settlement built around pilgrimage, spiritual authority is absolute.'
 },
 defenses: {
  militiaSize: 10,
  fortifications:
   'The vale\'s natural geography provides protection, steep walls of dark stone rise on all sides, broken only by narrow paths. The crystalline shards emit a faint radiation that Wyrd-creatures instinctively avoid, creating an invisible barrier.',
  watchPresence: 'Earthen Astril sentinels meditate at the vale\'s entrances, their crystalline resonance alerting them to approaching threats'
 },
 economy: {
  primary: 'Pilgrimage and spiritual tourism',
  secondary: ['Crystalline shard harvesting (strictly regulated)', 'Oracle-readings and prophecy', 'Starlight-touched crafting materials'],
  status: 'stable'
 },
 atmosphere: {
  mood:
   'Reverent, hushed, and luminous. Starfall Vale is the closest thing the starless world has to a cathedral of light. The crystalline shards glow with trapped starlight, fragments of Lumia\'s shattered biosphere that struck Mythrill during Blizzard’s End. Even the most cynical visitors lower their voices. The light is simply too beautiful to shout over.',
  architecture:
   'Minimal and organic, Ordan yurts and Astril crystal-tents arranged around the vale\'s central shard-field. No permanent stone structures; the Astril believe building in stone would insult the starlight. The Ordan herders maintain the paths and supply the settlement with food.',
  sounds:
   'The harmonic hum of the crystalline shards. Each produces a unique tone, and the cumulative effect is an endless, shifting chord that resonates in the chest. Wind through the vale. The soft chanting of Earthen Astril pilgrims. The distant lowing of Ordan herds on the steppe above.',
  smells:
   'Ozone, the sharp, clean scent of the sky before a storm, present constantly. Crushed herbs from Ordan cooking fires. The faint metallic scent of the crystalline shards, like licking a coin.',
  lighting:
   'The crystalline shards provide all illumination, a soft, silver-white glow that intensifies at night and dims during the day. The effect is starlight made solid. Earthen Astril navigate by reading the glow-patterns, which shift subtly with the season and the state of Lumia\'s echo within them.'
 },
 history: {
  founded: 'at the Great Binding',
  foundedBy: 'Earthen Astril',
  foundingStory:
    'When Keth-Amar devoured Lumia, fragments of that dying world\'s biosphere were carried by fleeing Astril refugees across the void. These crystalline shards, condensed remnants of Lumia\'s essence, impacted the steppe here before the Great Binding, creating a crater that the Earthen Astril found within hours of their arrival. They have never left.',
  significantEvents: [
    { date: 'before the Star-Fall', event: 'The Starfall, crystalline residue from Lumia\'s destruction impacts the steppe; Earthen Astril claim the site within hours' },
   { date: 'in the first centuries of the Freezing Era', event: 'First Oracle-vision recorded, a prophecy of the Sundered Monoliths' },
   { date: 'in the later centuries of the Freezing Era', event: 'Ordan herders granted grazing rights in exchange for provisioning the pilgrimage route' }
  ]
 },
 subLocations: [
  {
   id: 'the-shard-field',
   name: 'The Shard-Field',
   type: 'temple',
   description:
    'The central crater floor, carpeted with thousands of crystalline shards ranging from grain-sized to massive pillars thirty feet tall. The largest shards pulse with trapped starlight, their tones harmonizing in a chord that the Earthen Astril call the Memory of Sol. Pilgrims walk barefoot through the field, believing the starlight heals the spirit.',
   proprietor: 'Earthen Astril',
   notableFeatures: [
    'The First Shard: the largest crystal, at the crater\'s center, it produces a tone that resonates with every Astril\'s Lumian heritage simultaneously',
    'The Oracle\'s Seat: a natural depression in the First Shard where the Star-Oracle sits to receive visions'
   ]
  },
  {
   id: 'the-pilgrims-rest',
   name: "The Pilgrims' Rest",
   type: 'tavern',
   description:
    'An Ordan yurt erected at the vale\'s entrance, providing food, shelter, and fermented mare\'s milk to arriving pilgrims. The yurt is surprisingly comfortable, thick wool walls, warm hearth-fires, and a ceiling painted with a star-chart that depicts the sky as it was before the failing of the warmth.',
   proprietor: 'Ordan Host-Family (rotating)',
   notableFeatures: [
    'The Star-Ceiling: a painted representation of the pre-Breaching sky, the only complete record of how constellations appeared when Sol still shone',
    'The Pilgrim Register: a ledger of every visitor to the vale, dating back centuries, some names have been crossed out, their entries annotated with a single word: "consumed"'
   ]
  }
 ],
 connectedMaps: [],
 factionPresence: [
  { factionId: 'astril-earthen', influence: 'dominant', description: 'Spiritual custodians and primary inhabitants' },
  { factionId: 'ordan-nomads', influence: 'moderate', description: 'Provide provisions and maintain the pilgrimage route' },
  { factionId: 'unlit-veil', influence: 'minor', description: 'Maintain a discrete observation post, monitoring the Oracle\'s prophecies for actionable intelligence' }
 ],
 travelConnections: [
  { destinationId: 'synod-hold', distance: '30 miles', travelTime: '2 days', route: 'The Star-Path, marked by standing stones that hum in harmony with the shards' },
   { destinationId: 'ancestor-mounds', distance: '15 miles', travelTime: '1 day', route: 'Open steppe, guided by the hum of the ancestral mounds' }
 ],
 classPresence: ['augur', 'false_prophet', 'warden'],
 npcs: ['mor-vereth']
};

// =============================================================================
// SUNDALE, Harath-Vault (deep)
// =============================================================================
DEEP_LOCATIONS['harath-vault'] = {
 heraldry: {
  iconUrl: '/assets/heraldry/harath-vault.png',
  colors: { primary: '#5a1a00', secondary: '#cc4400' },
  description: 'A volcanic forge-anvil superimposed on a blood-red sun, crossed by a ceremonial hammer'
 },
 population: 600,
 dominantRaces: ['Solari', 'Groven'],
 leadership: {
  type: 'religious_order',
  title: 'Blood-Priest of the Forge',
  leaderId: 'hark-ash-hammer',
  description:
   'The Blood-Priest, a Berserker elected by the Skald Council from among the most seasoned forge-masters, governs the Harath-Vault. The current Blood-Priest is Hark Ash-Hammer, who countersigned the execution order against the Pact-less Unbound and views the deep-tunnel settlement forming in Emberspire as a heretical sect.'
 },
 defenses: {
  militiaSize: 100,
  fortifications:
   'The vault is a natural volcanic chamber accessible only through a single basalt tunnel that narrows to a chokepoint wide enough for two combatants abreast. The tunnel is lined with geothermal vents that the Blood-Priest can trigger to flood the approach with superheated steam.',
  watchPresence: 'Berserker Blood-Guards patrol the approach tunnel in pairs, their Blood-Heat makes them visible in thermal vision as walking furnaces'
 },
 economy: {
  primary: 'Masterwork forge-metal and ceremonial weapon production',
  secondary: ['Geothermal energy distribution to Sundale surface settlements', 'Blood-Heat ritual training', 'Volcanic alloy refinement'],
  status: 'stable'
 },
 atmosphere: {
   mood: 'Reverent, violent, and incandescent. The Harath-Vault is not a settlement. It is a working temple to the Blood-Heat. The air throbs with the rhythm of forge-hammers and the chanting of Berserkers in meditation. Every surface is hot enough to burn bare skin. The Solari who live here have calloused lungs from the volcanic air.',
  architecture: 'Carved directly into the volcanic basalt, no timber, no cloth, nothing that burns. The chambers are rough-hewn, the corridors narrow, and every major hall opens onto a forge-pit fed by geothermal vents. The deeper chambers date back to the Deep Alchemists, their geometric precision a jarring contrast to the rough Solari work.',
  sounds: 'The rhythmic thunder of forge-hammers, the hiss of quenched metal, the low chanting of Berserkers preparing for the Blood-Heat, the rumble of volcanic activity beneath the floor, and the occasional roar of a successful ignition from the training pits.',
  smells: 'Superheated basalt, molten metal, Solari sweat, volcanic sulfur, and the sharp, metallic tang of Blood-Heat ignition, ozone and hot iron.',
   lighting: 'Orange-red from the forge-pits and geothermal vents. The vault has no windows and no natural light. It is illuminated entirely by fire, metal, and the occasional eruption of volcanic glow from the deeper chambers.'
 },
 history: {
  founded: 'in the first centuries of the Freezing Era',
  foundedBy: 'Grum Bloodhammer',
  foundingStory:
   'When Grum Bloodhammer first ignited the Blood-Heat in Emberspire\'s caldera, the Solvarn Vigil thought the buried star was returning. The eruption of fury he unleashed melted a tunnel through the basalt into this natural vault, where he established the Forge of Grum, the first Berserker training ground. The impression of his hammer is still preserved in the main forge-floor, and every Blood-Priest since has begun their term by pressing their own hammer into the cooling metal beside it.',
  significantEvents: [
   { date: 'in the first centuries of the Freezing Era', event: 'Grum Bloodhammer ignites the first Blood-Heat; the Forge of Grum is established in the newly-formed Harath-Vault' },
   { date: 'in the early centuries of the Freezing Era', event: 'The Skald Council formed to govern the growing Berserker order; the Vault becomes the Council\'s permanent seat' },
   { date: 'within living memory', event: 'The Silence-Heat Heresy reaches Sundale; Hark Ash-Hammer purges the Pact-less Unbound from the Vault' },
   { date: 'within living memory', event: 'Deep-tunnel settlers from Emberspire\'s lower reaches attempt to establish an independent forge-hold; Hark Ash-Hammer condemns it as heretical' }
  ]
 },
 subLocations: [
  {
   id: 'the-forge-floor',
   name: 'The Forge Floor',
   type: 'great_hall',
   description: 'The heart of the Harath-Vault, a massive chamber where the forge-pits glow with captured geothermal fire. The floor is scarred by seven centuries of hammer-strikes, ritual ignitions, and the Blood-Heat testing of every Berserker who has trained here. Grum\'s original hammer-impression is preserved under volcanic glass at the chamber\'s center.',
   proprietor: 'Blood-Priest',
   notableFeatures: [
    'Grum\'s Impression: the volcanic glass seal preserving the founder\'s hammer-strike',
    'The Council Ring: a circle of basalt seats around the central forge where the Skald Council convenes'
   ]
  },
  {
   id: 'the-blood-pits',
   name: 'The Blood-Pits',
   type: 'military',
   description: 'A series of descending training chambers where Berserkers practice the Blood-Heat under increasingly extreme conditions. The lowest pit, the Crucible, is a sealed volcanic chamber where the geothermal temperature exceeds what any un-ignited body can survive. Only those who have mastered the third ignition are permitted below the second catwalk.',
   proprietor: 'Berserker Order',
   notableFeatures: [
    'The Crucible: the lowest pit, where final Blood-Heat mastery is tested in volcanic conditions',
    'The Scar-Wall: a basalt face where Berserkers record their ignitions by carving their names with red-hot metal'
   ]
  }
 ],
 connectedMaps: [],
 factionPresence: [
  { factionId: 'bloodhammer-line', influence: 'dominant', description: 'Hark Ash-Hammer leads both the Vault and the Blood-Priest tradition' },
  { factionId: 'house-solvan', influence: 'moderate', description: 'Maintain a shrine-crypt dedicated to Sera Solvan, the first Martyr' },
  { factionId: 'dawn-vigil', influence: 'minor', description: 'The Vigil maintains a small chapterhouse monitoring Berzerker dreams of the buried star' }
 ],
 travelConnections: [
  { destinationId: 'ember-lagoon', distance: '2 miles', travelTime: '1 hour', route: 'The Cinder Path, a winding tunnel through cooled basalt, lit by Solari glow-lanterns' },
  { destinationId: 'great-forge', distance: '1 mile', travelTime: '30 minutes', route: 'The Forge-Road, a wide volcanic tunnel used for transporting ingots and ore' }
 ],
 classPresence: ['berserker', 'pyrofiend', 'warden'],
 npcs: ['hark-ash-hammer', 'grum-bloodhammer']
};

// =============================================================================
// CRAGJAW PEAKS, Frostmaw Holdfast (deep)
// =============================================================================
DEEP_LOCATIONS['frostmaw-holdfast'] = {
 heraldry: {
  iconUrl: '/assets/heraldry/frostmaw-holdfast.png',
  colors: { primary: '#2a3a4a', secondary: '#7a8a5a' },
  description: 'A massive stone fist gripping a gear, frost riming the iron teeth'
 },
 population: 900,
 dominantRaces: ['Groven', 'Fexric', 'Tessen humans'],
 leadership: {
  type: 'guild',
  title: 'Vat-Breaker Foreman',
  leaderId: 'vat-breaker-foreman',
  description:
   'The Vat-Breakers\' Guild governs Frostmaw Holdfast, led by the First Foreman, the eldest Groven whose calcification has not yet claimed their mobility. The Foreman adjudicates Groven law, manages the Ancestor-Spans, and patrols the lower tunnels for signs of renewed Deep Alchemist experimentation.'
 },
 defenses: {
  militiaSize: 150,
  fortifications:
   'The holdfast is built into a volcanic plug at Cragjaw\'s heart, accessible only through three defended gates, each sealed by an Ancestor-Span (a bridge grown from the calcified bones of willing Groven dead) that can be withdrawn into the walls.',
  watchPresence: 'Vat-Breaker Sentinels patrol the Ancestor-Spans and tunnel approaches, their stone-scale hide making them nearly indistinguishable from the rock they guard'
 },
 economy: {
  primary: 'Ancestor-Span toll collection and Groven labor contracts',
  secondary: ['Deep Alchemist relic recovery', 'Stone-scale harvesting for Fexric alloys', 'Geothermal heat distribution'],
  status: 'stable'
 },
 atmosphere: {
  mood: 'Enduring, somber, and calcified, both literally and emotionally. Frostmaw Holdfast is the oldest continuously inhabited Groven settlement, and it shows. The stone walls are polished smooth by generations beyond counting of Groven hands. The air is warm from geothermal vents but carries the mineral scent of old bone.',
  architecture: 'Groven construction, brutalist, functional, and built to last millennia. Walls are grown from calcified Groven bone, fused with volcanic stone into a composite harder than either material. The Ancestor-Spans are the most visible feature, bridges of interlocking Groven vertebrae that groan and settle like living things.',
  sounds: 'The creak and groan of the Ancestor-Spans settling, the deep echoes of Groven work-chants from the lower tunnels, the hiss of geothermal steam, the clatter of stone-scale against stone, and the occasional bone-deep vibration of Deep Alchemist experiments far below.',
  smells: 'Warm stone, mineral steam, Groven musk, old bone, and the faint chemical tang of alchemical residue that leaks upward from the sealed vat-labs.',
  lighting: 'Dim and amber, Groven bio-luminescent moss cultivated on the ceilings provides most light, supplemented by geothermal glow-tubes in the inhabited chambers. The lower tunnels are dark enough that even Groven darkvision strains.'
 },
 history: {
  founded: 'in the early generations of the Freezing Era',
  foundedBy: 'The First Foreman (Groven Vat-Breakers)',
  foundingStory:
   'Forty years after the Deep Alchemists began their experiments on Thrumm broodlings, the first generation of transformed Groven, engineered for docility but gifted with will by the alchemical serums, shattered their containment vats and rose against their creators. The Vat-Breakers\' Revolt was bloody and total: the Groven drove the Alchemists from the surface tunnels and sealed them in the deeper laboratories. Frostmaw Holdfast was built on the site of the first shattered vat, the Foreman\'s calcified skeleton forming the hall\'s central arch.',
  significantEvents: [
   { date: 'in the early generations of the Freezing Era', event: 'The Vat-Breakers\' Revolt, Groven shatter their containment vats and seize Frostmaw from the Deep Alchemists' },
   { date: 'in the early centuries of the Freezing Era', event: 'First Ancestor-Span grown across the Great Gorge, connecting Frostmaw to the Gearworks Gulch' },
   { date: 'in the most recent centuries', event: 'Deep Alchemist activity detected in the lower tunnels; Frostmaw seals the sub-levels and establishes permanent sentry-rotations' },
   { date: 'within living memory', event: 'The Freezing Era accelerates; the geothermal terraces begin cooling, threatening Frostmaw\'s food supply' }
  ]
 },
 subLocations: [
  {
   id: 'the-sealed-vat-labs',
   name: 'The Sealed Vat-Labs',
   type: 'fortification',
   description: 'The sub-levels beneath Frostmaw Holdfast, sealed by decree of the First Foreman and never reopened. The Deep Alchemists\' original laboratories lie behind three iron doors, each engraved with Groven warning-runes. The seals are inspected annually by the Vat-Breaker Foreman, who listens at the iron for sounds of continued work from below.',
   proprietor: 'Vat-Breakers\' Guild',
   notableFeatures: [
    'The First Vat: a shattered containment vessel displayed in a sealed chamber as a reminder of what was',
    'The Alchemist Archive: a stolen cache of Fexric alchemical formulae, including one that may reverse calcification'
   ]
  },
  {
   id: 'the-span-arch',
   name: 'The Span-Arch',
   type: 'great_hall',
   description: 'The main hall of Frostmaw Holdfast, a soaring chamber whose arched ceiling is formed by the calcified skeleton of the First Foreman, her outstretched hand forming the keystone. The hall serves as throne room, judgment chamber, and gathering space for the Groven community.',
   proprietor: 'Vat-Breakers\' Guild',
   notableFeatures: [
    'The Foreman\'s Keystone: the hand of the First Foreman, calcified in mid-reach, forming the arch\'s final stone',
    'The Memory-Room: a side chamber where the names of every Groven who has died in service to the holdfast are carved into the living rock'
   ]
  }
 ],
 connectedMaps: [],
 factionPresence: [
  { factionId: 'vat-breakers-guild', influence: 'dominant', description: 'The governing body of Groven civilization; holds absolute authority in Frostmaw' },
  { factionId: 'deep-alchemists', influence: 'outcast', description: 'Sealed in the lower tunnels, their influence is felt only through the warnings carved on the iron doors' },
  { factionId: 'house-tesshan', influence: 'moderate', description: 'Maintain a trade office for Groven stone-scale and Fexric alloy imports' }
 ],
 travelConnections: [
  { destinationId: 'gearworks-gulch', distance: '8 miles', travelTime: '4 hours', route: 'The Ancestor-Span passage across the Great Gorge, maintained by Fexric bridge-engineers' },
  { destinationId: 'sump-galleries', distance: '3 miles', travelTime: '1 hour', route: 'Lower tunnels, officially sealed; travel requires Vat-Breaker approval' }
 ],
 classPresence: ['shaper', 'warden', 'berserker'],
 npcs: ['vat-breaker-foreman', 'alaric', 'torin']
};

// =============================================================================
// ICEHEART SEA, Merrowport Deep-Quarter (deep)
// =============================================================================
DEEP_LOCATIONS['merrowport'] = {
 heraldry: {
  iconUrl: '/assets/heraldry/merrowport-deep.png',
  colors: { primary: '#1a3a5a', secondary: '#c4a040' },
  description: 'A golden scale balanced on a coral spire, the tide rising around it'
 },
 population: 500,
 dominantRaces: ['Merryn', 'Myrathil', 'Neth'],
 leadership: {
  type: 'guild',
  title: 'Harbor-Master',
  leaderId: 'merr-cael',
  description:
   'The Harbor-Master governs the Merrowport Deep-Quarter, holding authority over gambling licenses, debt enforcement, and the Storm-Spirit covenant. The current Harbor-Master, Merr-Cael, presides over the Gambit order\'s fracturing between Jax\'s luck-cult and Lyra\'s Deck-Burners, a balancing act that grows harder by the season.'
 },
 defenses: {
  militiaSize: 40,
  fortifications:
   'The Deep-Quarter is built on coral foundations below the tideline, accessible only by descending staircases that flood at high tide. The gambling halls are constructed from Myrathil shell-concrete, reinforced with Neth contract-wards that magically bind anyone who enters uninvited.',
  watchPresence: 'Myrathil Shore patrol the underwater approaches, their bioluminescence marking safe passages'
 },
 economy: {
  primary: 'Gambling, debt-finance, and contract-brokering',
  secondary: ['Storm-spirit covenant maintenance', 'Rune-etched card manufacturing', 'Coral-harvest export'],
  status: 'volatile'
 },
 atmosphere: {
  mood: 'Electric, reckless, and desperate. The Deep-Quarter is where fortunes are made and unmade in a single hand of salt-coral cards. The air is thick with salt spray, Myrathil incense, and the smell of Neth silver-blood contracts drying on coral tables. The patrons laugh too loud and watch each other too closely.',
  architecture: 'Submerged Myrathil construction, shell-concrete domes, coral archways, and floors of polished sea-stone that ripple with trapped bioluminescence. The gambling halls are arranged around a central tide-pool that rises and falls with the lunar cycle, the water level determining which tables are accessible.',
  sounds: 'The constant rattle of dice and cards, the crash of waves against the coral foundations, the hum of Myrathil bioluminescent light-filters, the murmur of Neth contract recitations, and the occasional roar of a storm-spirit covenant being honored or breached.',
  smells: 'Salt, seaweed, Myrathil incense, Neth silver-blood (metallic), spilled Merryn ale, and the deep-ocean mineral scent of the tide-pool.',
  lighting: 'Bioluminescent, Myrathil light-coral in the ceilings casts a cool blue-green glow. Neth contract-lanterns with silver-flame supplement the illumination during high-stakes negotiations. The tide-pool at the center glows faintly from the coral beneath.'
 },
 history: {
  founded: 'in the first centuries of the Freezing Era',
  foundedBy: 'Jax the Wager and Lyra the Clause',
  foundingStory:
   'When Jax the Merryn pirate wagered his lifeline against a storm-spirit and won, he used the favor to establish the first gambling hall in what would become the Deep-Quarter. Lyra the Neth clause-weaver joined him soon after, formalizing chance through rune-etched cards and binding the hall\'s debts with First Contract authority. The two founders disagreed on the soul of their creation, luck versus structure, and their schism is carved into the foundations: Jax\'s wing is open to the sea, Lyra\'s is sealed with contract-wards.',
  significantEvents: [
   { date: 'in the first centuries of the Freezing Era', event: 'Jax and Lyra establish the Gambit tradition in the newly-built Merrowport Deep-Quarter' },
   { date: 'decades into the Freezing Era', event: 'Jax walks into the sea, telling no one why; his followers splinter into the luck-cult' },
   { date: 'in the later centuries of the Freezing Era', event: 'Lyra\'s Deck-Burners radicalize; the Deep-Quarter\'s ruling council is established to mediate between the factions' },
   { date: 'within living memory', event: 'The Freezing Era disrupts Myrathil bioluminescence; the Deep-Quarter\'s coral foundations begin to weaken' }
  ]
 },
 subLocations: [
  {
   id: 'the-luck-hall',
   name: 'The Luck Hall',
   type: 'tavern',
   description: 'Jax\'s original gambling hall, built open to the sea, the waves crash against the coral pillars, and the salt spray keeps the patrons alert. The Luck Hall is where the luck-cult practices its art: weighted dice, salt-coral cards, stakes measured in years rather than coin.',
   proprietor: 'Luck-Cult Elders',
   notableFeatures: [
    'Jax\'s Table: the original coral gaming table where Jax wagered his lifeline, preserved under glass',
    'The Wager-Wall: a coral surface where debtors carve their promises, and where the storm-spirit\'s favor is said to be inscribed in invisible ink'
   ]
  },
  {
   id: 'the-clause-chamber',
   name: 'The Clause Chamber',
   type: 'temple',
   description: 'Lyra\'s wing of the Deep-Quarter, sealed by Neth contract-wards that prevent unauthorized entry. The Clause Chamber is a library of rune-etched cards, stacked to the ceiling in coral shelves, each card a formalized probability that can be read, played, or burned.',
   proprietor: 'Deck-Burners',
   notableFeatures: [
    'The Probability-Index: a complete taxonomy of every possible outcome the Deck-Burners have calculated, filling seventeen coral shelves',
    'The Burning-Altar: a coral brazier where Deck-Burners destroy cards to force the universe to choose between chaos and order'
   ]
  }
 ],
 connectedMaps: [],
 factionPresence: [
  { factionId: 'merrowport-house', influence: 'dominant', description: 'The Gambit order\'s headquarters, Harbor-Master Merr-Cael governs the Deep-Quarter' },
  { factionId: 'house-mereval', influence: 'moderate', description: 'Maintain a customs office at the Deep-Quarter\'s water-level entrance collecting gambling taxes' },
  { factionId: 'tide-choir', influence: 'minor', description: 'Minstrels of the Tide-Choir perform in the Luck Hall for coin and rumors' }
 ],
 travelConnections: [
  { destinationId: 'spindrift-lagoon', distance: '15 miles', travelTime: '3 hours by sea', route: 'The Coral Passage, a Myrathil-maintained underwater route marked by bioluminescent buoys' },
  { destinationId: 'synod-hold', distance: '40 miles', travelTime: '5 hours by sea', route: 'The open-water route across the Iceheart Sea, dangerous in storm season' }
 ],
 classPresence: ['gambit', 'minstrel', 'warden'],
 npcs: ['merr-cael', 'jax', 'lyra']
};

// =============================================================================
// FROSTWOOD REACH, Thornwood Grove (deep)
// =============================================================================
DEEP_LOCATIONS['thornwood-grove'] = {
  name: 'Thornwood Grove',
  region: 'frostwood-reach',
  type: 'wilderness',
  description: 'A quiet grove of ironwood and thorn-vine three leagues east of the Shallows, known locally as the site of the Third Harvest massacre — a Gref-pack that peeled four Thalren scouts and wore their faces into the settlements. The Shallows executed 17 people before the infestation was purged. The trees still bear the axe-marks of the executions, and the ground is saturated with alchemical residue from the Toxicologist Varis\'s first field laboratory, built in the canopy above the massacre site. The grove is avoided by locals; the fog here tastes faintly of copper.',
  dangerLevel: 'moderate',
  factions: ['scribe-cartel'],
  connections: ['the-shallows']
};

// =============================================================================
// BRYNGLOOM FOREST, Atropolis (deep capital)
// =============================================================================
DEEP_LOCATIONS['atropolis'] = {
  heraldry: {
    iconUrl: '/assets/heraldry/morrath.png',
    colors: { primary: '#1c2833', secondary: '#95a5a6' },
    description: 'A silver scroll bound in living ironwood roots, holding a single drop of frozen starlight'
  },
  population: 4500,
  dominantRaces: ['High Neth', 'Pale Neth', 'Vreken'],
  leadership: {
    type: 'noble_house',
    title: 'High Archivist of the First Contract',
    leaderId: 'house-morrath-archivist',
    description: 'House Morrath rules from the Scriptorium of Still Breath. High Archivist Vaelen Morrath enforces Morvane\'s First Contract, holding total legal and contractual authority over the Bryngloom.'
  },
  defenses: {
    militiaSize: 180,
    fortifications: 'Suspended 300 feet above the forest floor within an ancient ironwood canopy. Accessible only by root-elevators and warded bridges. Protected by Morvane\'s root-barrier and Veil-Guards.',
    watchPresence: 'Veil-Guards in ghost-silk armor patrol the upper root-bridges with stilled breath'
  },
  economy: {
    primary: 'Contract arbitration & legal archiving',
    secondary: ['Ghost-silk weaving', 'Memory-glass crafting', 'Peat-debt collection'],
    status: 'wealthy'
  },
  atmosphere: {
    mood: 'Unnerving, frozen elegance. Chests do not rise or fall; speech is whispered with absolute contractual precision.',
    architecture: 'Living ironwood cathedral-halls woven into the upper canopy over a thousand years. Memory-glass windows reflect bioluminescent canopy light.',
    sounds: 'The subtle scratching of quills on parchment, the low hum of the canopy wind, and total silence between words.',
    smells: 'Dry parchment, peat-smoke, cold ironwood resin, and silver-ink.',
    lighting: 'Soft, ambient silver luminescence emitted by canopy lichens and memory-glass lamps.'
  },
  history: {
    founded: '1st century of the Freezing Era',
    foundedBy: 'Scribe-Clan Ancestors & Morvane',
    foundingStory: 'Grown from an ancient elven grove-sanctuary across centuries, Atropolis became the seat of the Neth when the dying scribe-clan presented Morvane with the First Contract to survive the freeze.',
    significantEvents: [
      { date: 'Year 42 of the Freezing Era', event: 'The First Contract signed at the Heartwood Archive' },
      { date: 'Year 310 of the Freezing Era', event: 'House Morrath elevated as substitute 7th signatory after Viridane\'s erasure' }
    ]
  },
  subLocations: [
    {
      id: 'heartwood-archive',
      name: 'The Heartwood Archive',
      type: 'sanctuary',
      description: 'The sacred inner vault where the original First Contract rests encased within living heartwood amber.',
      proprietor: 'High Archivist Vaelen Morrath',
      notableFeatures: [
        'The First Contract Amber: a 12-foot pillar of glowing amber containing the original pact text',
        'The Registry Pillar: where every birth and debt contract in the Bryngloom is indexed'
      ]
    }
  ],
  connections: [
    { destinationId: 'over-shanty', distance: '5 miles', travelTime: '2 hours', route: 'Living-root boardwalk through the canopy' }
  ],
  classPresence: ['arcanoneer', 'animist', 'revenant'],
  npcs: ['vaelen-morrath', 'kora-the-pale']
};

// =============================================================================
// BRYNGLOOM FOREST, The Sunken Spire (deep capital)
// =============================================================================
DEEP_LOCATIONS['the-sunken-spire'] = {
  heraldry: {
    iconUrl: '/assets/heraldry/vreken.png',
    colors: { primary: '#2c3e50', secondary: '#d35400' },
    description: 'An inverted obsidian spire radiating rust-amber spore-rays into a deep sinkhole'
  },
  population: 2800,
  dominantRaces: ['Clean Vreken', 'Marked Vreken'],
  leadership: {
    type: 'monastic_council',
    title: 'High Speaker of the Root-Veil',
    leaderId: 'vreken-crypt-council',
    description: 'Governed by the Crypt-Council of Veil-Speakers who tend Morvane\'s wounded mycelial network.'
  },
  defenses: {
    militiaSize: 120,
    fortifications: 'Carved directly into a 400-foot-deep forest sinkhole. The inverted cathedral is protected by spore-curtains and subterranean mycelial traps.',
    watchPresence: 'Ghost-Mycelium monks stalk the sinkhole ledges silently'
  },
  economy: {
    primary: 'Ghost-mycelium cultivation',
    secondary: ['Crypt-guardianship', 'Spore-lamp crafting', 'Ancestral communion'],
    status: 'subsistence'
  },
  atmosphere: {
    mood: 'Solemn, monastic reverence tinged with fungal mutation. Bioluminescent vein-lines pulse in rhythm with Morvane.',
    architecture: 'Inverted gothic stone architecture descending into peat subterranean hollows. Fungal shroud-shrines line the spiraling stairways.',
    sounds: 'Soft monastic chants echoing from deep crypts, the whisper of spore-drifts, and dripping water.',
    smells: 'Rich peat earth, bioluminescent spores, old incense, and damp stone.',
    lighting: 'Rust-amber and silver-white bioluminescence pulsing from ghost-mycelium veins.'
  },
  history: {
    founded: 'Pre-Binding Era',
    foundedBy: 'Ancient Vreken Monks',
    foundingStory: 'Built as a surface monastery to Morvane before Sol was bound. When Morvane was wounded by the Wyrd during the failing of the warmth, the monastery collapsed into the sinkhole and transformed into the Sunken Spire.',
    significantEvents: [
      { date: 'the Slow Cracks', event: 'The Spore Transformation: Morvane\'s wound mutates the Vreken monastic order' }
    ]
  },
  subLocations: [
    {
      id: 'crypt-of-aedris',
      name: 'Crypt of Aedris the First-Lit',
      type: 'tomb',
      description: 'The lowest vault of the Sunken Spire, housing the glowing remains of the first Marked Vreken.',
      proprietor: 'Crypt-Council',
      notableFeatures: [
        'The First-Lit Pillar: a towering column of fossilized mycelium emitting unquenchable silver-white light'
      ]
    }
  ],
  connections: [
    { destinationId: 'aran-glen', distance: '12 miles', travelTime: '4 hours', route: 'Subterranean root-tunnels' }
  ],
  classPresence: ['animist', 'revenant', 'toxicologist'],
  npcs: ['aedris-first-lit', 'veil-speaker-theron']
};



// =============================================================================
// NORDHALLA, Hvalhavn (deep)
// =============================================================================
DEEP_LOCATIONS['hvalhavn'] = {
  heraldry: {
    iconUrl: '/assets/heraldry/hvalhavn.png',
    colors: { primary: '#1b2a38', secondary: '#90a4ae' },
    description: 'A shattered harpoon crossed over a frozen wolf jaw on a pale slate field'
  },
  population: 80,
  dominantRaces: ['Skald (abandoned)', 'Hungríd Cultists'],
  leadership: {
    type: 'cult_occupation',
    title: 'Hungríd Tooth-Overseer',
    leaderId: 'tooth-enforcer-kol',
    description: 'The village is largely abandoned by its native fishermen. A Hungríd Tooth squad under Overseer Kol occupies the harbor to monitor northern trial traffic and guard the memory of Úlfrekr\'s murder from unearthing.'
  },
  defenses: {
    militiaSize: 25,
    fortifications: 'Decaying timber palisades and stone whale-oil vats converted into barricades by the Hungríd garrison.',
    watchPresence: 'Hungríd Tooth-Enforcers watch the shoreline from the abandoned watch-post atop the fish-drying hill.'
  },
  economy: {
    primary: 'Desolate staging post for northern Hungríd supply runs',
    secondary: ['Abandoned cod-curing', 'Hungríd surveillance'],
    status: 'decaying'
  },
  atmosphere: {
    mood: 'Haunted, desolate, and bone-chilling. The abandoned longhouses creak under the arctic wind, and locals speak in hushed whispers of the day Sylvén walked back alone from the ice.',
    architecture: 'Traditional Skald sea-timber longhouses with turf roofs, now rotting and snow-drifted. Runic markers commemorating Úlfrekr stand in the town square, unaware of the lie.',
    sounds: 'The hollow whistling of arctic wind through empty timber halls, the creak of abandoned salt-racks, and the heavy boots of Hungríd enforcers.',
    smells: 'Rancid cod oil, old sea-salt, wood-rot, and the metallic chill of rime-frost.',
    lighting: 'Pale polar gloom by day, flickering whale-oil torches at the Hungríd guard post by night.'
  },
  history: {
    founded: 'in the early generations of the Freezing Era',
    foundedBy: 'Skald Fisher-Clans',
    foundingStory: 'Founded as a northern whaling and fishing haven. Hvalhavn was the home village of brothers Úlfrekr and Sylvén. During a desperate polar wolf hunt deep in the arctic wastes, Sylvén abandoned/murdered Úlfrekr, returned alone, and lied that his brother died saving him. Sylvén used the village\'s sympathy to rally followers before consuming the Swallow-Heart.',
    significantEvents: [
      { date: 'Generations ago', event: 'Úlfrekr and Sylvén track polar wolves into the whiteout; Úlfrekr is betrayed and left to be consumed' },
      { date: 'Generations ago', event: 'Sylvén returns to Hvalhavn alone, fabricates the hero legend of Úlfrekr, and begins gathering his cult' },
      { date: 'Recent years', event: 'Sylvén\'s Hungríd cult occupies Hvalhavn, driving out most remaining villagers to preserve the founder\'s secret' }
    ]
  },
  subLocations: [
    {
      id: 'ulfreks-cairn',
      name: 'Úlfrekr\'s Memorial Cairn',
      type: 'tomb',
      description: 'A tall stone cairn erected in the village center. The inscription praises Úlfrekr as a hero who died protecting his brother. Behind the stones lies an empty grave.',
      proprietor: 'Village Elders (Historical)',
      notableFeatures: [
        'The False Inscription: runic saga extolling Úlfrekr\'s self-sacrifice',
        'The Hidden Stash: a hollow behind the keystone holding Sylvén\'s original blood-stained hunting knife'
      ]
    }
  ],
  connectedMaps: [],
  factionPresence: [
    { factionId: 'the-hungrid', influence: 'dominant', description: 'Occupies the village to suppress the truth of Sylvén\'s origin' },
    { factionId: 'skald-expatriates', influence: 'minor', description: 'A few elderly villagers who remember the brothers before the ice took Sylvén' }
  ],
  travelConnections: [
    { destinationId: 'kolvard', distance: '12 miles', travelTime: '4 hours', route: 'Mountain trial road monitored by Hungríd posts' },
    { destinationId: 'svalghjartas-keep', distance: '25 miles', travelTime: '1 day', route: 'Glacial trail into the deep northern ice' }
  ],
  classPresence: ['berserker', 'harbinger', 'revenant'],
  npcs: ['sylven', 'ulfrekr-memory']
};

// =============================================================================
// NORDHALLA, Svalghjartas Keep (deep)
// =============================================================================
DEEP_LOCATIONS['svalghjartas-keep'] = {
  heraldry: {
    iconUrl: '/assets/heraldry/svalghjarta.png',
    colors: { primary: '#4a0e17', secondary: '#78909c' },
    description: 'A frozen pulsating heart encased in jagged blue ice spires'
  },
  population: 400,
  dominantRaces: ['Hungríd Cultists', 'The Frostborn', 'The Tooth', 'The Starved'],
  leadership: {
    type: 'cult_theocracy',
    title: 'The Hollow King (Heart-Eater)',
    leaderId: 'sylven-hollow-king',
    description: 'Sylvén, the Hollow King, rules from the central dais over the Swallow-Heart. He is rime-infused and can freeze a heart with a touch to the chest. He commands the Frostborn (his marked inner circle) and the Tooth enforcers.'
  },
  defenses: {
    militiaSize: 150,
    fortifications: 'Constructed directly into the glacier walls around the Swallow-Heart carcass. The keep walls are solid black ice reinforced with rime-wards.',
    watchPresence: 'Frostborn sentinels wielding cold-iron halberds patrol the icy ramparts, their skin glistening with frost.'
  },
  economy: {
    primary: 'Child sacrifice rituals and rime-power extraction',
    secondary: ['Bounty collection across Nordhalla', 'Rime-frost weapon forging'],
    status: 'flourishing_cult'
  },
  atmosphere: {
    mood: 'Malevolent, freezing, and suffocating. The ice walls throb with a faint, sickening heartbeat. The air is so cold that breath turns to crystals before falling to the floor.',
    architecture: 'Monolithic black ice and stone pillars surrounding a colossal frozen ribcage where the Swallow-Heart pulses with blue void-light.',
    sounds: 'The deep, subterranean thump of the Swallow-Heart, the quiet weeping of captives in the lower ice-cages, and Sylvén\'s rasping sermons.',
    smells: 'Rime-frost, copper blood, ozone, and old snow.',
    lighting: 'Pulsing cyan and cobalt illumination emanating from the Swallow-Heart itself.'
  },
  history: {
    founded: 'Generations ago',
    foundedBy: 'Sylvén (The Hollow King)',
    foundingStory: 'After abandoning his brother Úlfrekr in the northern whiteout, Sylvén discovered the buried carcass of the Swallow-Heart in the glacier. Consuming its void-warm blood, he gained the power of rime-touch and founded the Hungríd cult, convincing followers that child sacrifices feed a benevolent deity.',
    significantEvents: [
      { date: 'Generations ago', event: 'Sylvén consumes the Swallow-Heart\'s core and becomes the Hollow King' },
      { date: 'Decades ago', event: 'The Frostborn inner circle is formed; the Tooth enforcers begin kidnapping children across Nordhalla' },
      { date: 'Recent months', event: 'The Heart\'s pulse accelerates; ice walls begin thawing as the void-corruption leaks toward Þögn' }
    ]
  },
  subLocations: [
    {
      id: 'heart-chamber',
      name: 'The Swallow-Heart Chamber',
      type: 'sanctuary',
      description: 'The central vault housing the massive pulsing heart of the Swallow-Heart. Sylvén sits upon the frozen dais above it.',
      proprietor: 'Sylvén',
      notableFeatures: [
        'The Swallow-Heart: a 20-foot pulsing void organ encased in crystal ice',
        'The Sacrifice Chute: a smooth ice tunnel descending into the heart\'s digestive pit'
      ]
    }
  ],
  connectedMaps: [],
  factionPresence: [
    { factionId: 'the-hungrid', influence: 'dominant', description: 'Sylvén\'s cult seat of power' }
  ],
  travelConnections: [
    { destinationId: 'gjaldhringr', distance: '15 miles', travelTime: '6 hours', route: 'Glacial chasm trail' },
    { destinationId: 'hvalhavn', distance: '25 miles', travelTime: '1 day', route: 'Frozen northern trail' }
  ],
  classPresence: ['harbinger', 'berserker', 'pyrofiend', 'warden'],
  npcs: ['sylven-hollow-king']
};

// =============================================================================
// NORDHALLA, Snowcall City (deep)
// =============================================================================
DEEP_LOCATIONS['snowcall-city'] = {
  heraldry: {
    iconUrl: '/assets/heraldry/snowcall.png',
    colors: { primary: '#2c3e50', secondary: '#ecf0f1' },
    description: 'A silver horn emitting frost-flakes over a granite cliff profile'
  },
  population: 3200,
  dominantRaces: ['Skald', 'High Neth', 'Corvani'],
  leadership: {
    type: 'council',
    title: 'Charter-Steward',
    leaderId: 'solvan-steward',
    description: 'Governed by the Snowcall Charter-Council representing House Skalvyr, the High Neth Scriptorium, and the Corvani Roost-Merchants.'
  },
  defenses: {
    militiaSize: 200,
    fortifications: 'Granite curtain walls and steam-heated gatehouses defending the cliff approach.',
    watchPresence: 'Skald Ice-Guard and Corvani cliff-scouts patrol the perimeter.'
  },
  economy: {
    primary: 'Trade hub between Rime-Spire Peaks and Skaldfjord Dal',
    secondary: ['High Neth legal archiving', 'Corvani roost-trinket export', 'Geothermal fur-processing'],
    status: 'prosperous'
  },
  atmosphere: {
    mood: 'Bustling, crisp, and multi-cultural. Snowcall is the warmest and most welcoming urban center in Nordhalla.',
    architecture: 'High Skald longhalls blended with slate-roofed High Neth townhouses and high cliffside Corvani roost-towers.',
    sounds: 'Market calls in three languages, Corvani screech-shouts, and the steady hum of under-street steam pipes.',
    smells: 'Pine smoke, roasting elk meat, parchment ink, and crisp mountain air.',
    lighting: 'Warm amber lantern-light reflected off snow drifts and slate roofs.'
  },
  history: {
    founded: '2nd century of the Freezing Era',
    foundedBy: 'Skald-Neth Trade Coalition',
    foundingStory: 'Established at the junction of the Icetalon passes and the Whispering Pine as a neutral charter city where High Neth immigrants could settle safely alongside Skald clans.',
    significantEvents: [
      { date: '2nd century', event: 'Snowcall Charter signed establishing the High Neth Quarter' }
    ]
  },
  subLocations: [
    {
      id: 'high-neth-quarter',
      name: 'The High Neth Quarter',
      type: 'settlement',
      description: 'A slate-roofed district of legal scribes, ink-refiners, and contract archivists.',
      proprietor: 'High Neth Guild',
      notableFeatures: ['The Slate Scriptorium']
    }
  ],
  connectedMaps: [],
  factionPresence: [
    { factionId: 'house-skalvyr', influence: 'dominant', description: 'Regional seat of authority' },
    { factionId: 'high-neth', influence: 'strong', description: 'Control legal trade and archives' }
  ],
  travelConnections: [
    { destinationId: 'saltgrinn', distance: '4 miles', travelTime: '1 hour', route: 'Winding cliff stairs' },
    { destinationId: 'stonegrip', distance: '10 miles', travelTime: '4 hours', route: 'Icetalon pass road' }
  ],
  classPresence: ['augur', 'minstrel', 'chronarch'],
  npcs: ['solvan-steward']
};


// =============================================================================
// NORDHALLA, The Whispering Pine (deep)
// =============================================================================
DEEP_LOCATIONS['whispering-pine'] = {
  heraldry: {
    iconUrl: '/assets/heraldry/whispering-pine.png',
    colors: { primary: '#1c3822', secondary: '#8b5a1a' },
    description: 'An ancient petrified ironwood pine encircled by three silver ravens in flight'
  },
  population: 850,
  dominantRaces: ['Skald hunters', 'Corvani flock-scouts', 'Animist hermits'],
  leadership: {
    type: 'warden',
    title: 'High Ranger of the Whispering Pine',
    leaderId: 'morvath-pine-warden',
    description: 'Governed by High Ranger Morvath under the joint jurisdiction of House Skalvyr and Matriarch Vespera\'s Corvan Council. Morvath regulates lumber quotas, maintains the beacon-lines, and leads the wolf-sentinels.'
  },
  defenses: {
    militiaSize: 140,
    fortifications: 'Petrified ironwood palisades, concealed treetop sniper perches, and pitfall traps spiked with volcanic basalt shards.',
    watchPresence: 'Skald Pine-Wardens and Corvani tree-scouts patrol the canopy bridges; trained white dire-wolves guard the forest floor.'
  },
  economy: {
    primary: 'Petrified ironwood timber harvest and steam-sawing',
    secondary: ['Alpine wolf-breeding', 'Resin distillation for thermal torches', 'Medicinal needle-oil extraction'],
    status: 'thriving'
  },
  atmosphere: {
    mood: 'Vast, ancient, and hauntingly acoustic. The wind through millions of iron-hard frozen needles creates deep harmonic hums that sound like ancestral voices speaking in ancient dialects.',
    architecture: 'High-timber longhalls constructed from petrified logs, linked by hanging rope-and-plank suspension bridges woven through the high canopy.',
    sounds: 'The constant eerie whistling of wind through quartz-needles, the deep resonant creak of ironwood trunks, distant raven calls, and the baying of sentinel dire-wolves.',
    smells: 'Sharp pine resin, crushed winter needles, woodsmoke from heated turf cabins, and crisp freezing mountain air.',
    lighting: 'Filtered jade-green light filtering through dense snowy boughs by day; glowing amber resin-lanterns hung from tree-bridges by night.'
  },
  subLocations: [
    {
      id: 'grandmother-pine-sanctuary',
      name: 'The Grandmother Pine Sanctuary',
      type: 'sacred',
      description: 'A colossal 400-foot petrified ironwood tree at the forest center whose roots encircle a steaming mineral spring. Animist shamans press their ears to the bark to divine coming storms.',
      proprietor: 'Skald Animist Hermits',
      notableFeatures: ['The Resonant Root-Heart', 'The Steam-Basin of Visions']
    },
    {
      id: 'sawmill-terrace',
      name: 'The Steam-Sawmill Terrace',
      type: 'industrial',
      description: 'A fortified logging mill powered by geothermal steam boilers, cutting iron-dense logs into shipbuilding keels and palace rafters.',
      proprietor: 'Icechamber Timber Cartel',
      notableFeatures: ['The Great Rotary Cold-Saw', 'The Timber Chute to Skaldfjord']
    }
  ],
  connectedMaps: [],
  factionPresence: [
    { factionId: 'house-skalvyr', influence: 'dominant', description: 'Maintains royal lumber concessions and garrison' },
    { factionId: 'Corvani Flocks', influence: 'strong', description: 'Controls canopy aerial routes and roost-groves' },
    { factionId: 'Skald Keepers', influence: 'moderate', description: 'Protects sacred groves from over-logging' }
  ],
  travelConnections: [
    { destinationId: 'snowcall-city', distance: '12 miles', travelTime: '4 hours', route: 'Heated mountain pass road' },
    { destinationId: 'hrafnest', distance: '6 miles', travelTime: '2 hours', route: 'Canopy bridge trail' }
  ],
  classPresence: ['animist', 'warden', 'minstrel'],
  npcs: ['morvath-pine-warden', 'matriarch-vespera']
};

const getDeepLocation = (locationId) => DEEP_LOCATIONS[locationId] || null;

const getEnrichedZone = (zoneId) => {
 const base = ZONE_DATA.find((z) => z.id === zoneId);
 if (!base) return null;
 const deep = DEEP_LOCATIONS[zoneId];
 return deep ? { ...base, ...deep, isDeep: true } : { ...base, isDeep: false };
};

const getEnrichedZonesByRegion = (regionId) =>
 ZONE_DATA.filter((z) => z.regionId === regionId).map((z) => getEnrichedZone(z.id));

const LEGACY_SITES = {
 bladedancer: { site: "The Old Dance-Floor", region: "frostwood-reach", parentLocation: "mirror-mere", note: "A mossed-over ironwood platform in the deep Frostwood where the kinetic forms were once drilled; a pilgrimage site for purist Shapers who practice single-tradition momentum work." },
 deathcaller: { site: "The Veil-Speaker Shrine", region: "bryngloom-forest", parentLocation: "over-shanty", note: "A deep peat-bog shrine marking where Kora first fed the ancestral lights; Revenants of the blood-covenant inclination still make offerings here before major workings." },
 dreadnaught: { site: "The Old Foundry", region: "cragjaw-peaks", parentLocation: "gearworks-gulch", note: "The foundry beneath Frostmaw that still stamps the Dreadnaught sigil (a pipe-crossed fist) onto Ironclad plate as a maker-mark, the only surviving public acknowledgment of the original tradition." },
 exorcist: { site: "The Cleansing Chapels", region: "bryngloom-forest", parentLocation: "aran-glen", note: "The mid-Bryngloom chapels where Exorcist rites were codified; they now serve as Inquisitor chapterhouses, the old purification fonts still in daily use." },
 covenbane: { site: "The Covenbane Stronghold", region: "bryngloom-forest", parentLocation: "over-shanty", note: "The eastern Bryngloom stronghold that is now the regional Inquisitor seat; its hanging-cages, once for bound witches awaiting trial, are preserved as grim heritage." },
 formbender: { site: "The Calcifying Vats", region: "cragjaw-peaks", parentLocation: "gearworks-gulch", note: "The Frostmaw vats re-purposed from the old Deep Alchemist heritage, where Formbender techniques are still taught in isolation to Shaper initiates before they learn the momentum dance." },
 lichborne: { site: "Vesper's Basalt-Phylactery", region: "bryngloom-forest", parentLocation: "aran-glen", note: "The founder's own basalt stone, enshrined in the Cold Hearth, still pulsing once per hour; Revenants of the frost-stasis inclination touch it before long operations." }
};

export { DEEP_LOCATIONS, LEGACY_SITES, getDeepLocation, getEnrichedZone, getEnrichedZonesByRegion };
export default DEEP_LOCATIONS;
