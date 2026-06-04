import { ZONE_DATA } from './zoneData';

const DEEP_LOCATIONS = {};

// =============================================================================
// FROSTWOOD REACH — Greymark Keep (deep)
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
    title: 'Lord of Greymark',
    leaderId: 'aldren-thalreth',
    description:
      'House Thalreth rules from the High Hearth, a massive ironwood throne-room where the Lord receives petitioners while scribes record every word spoken. The current Lord, Aldren Thalreth, is increasingly absent — his seneschal handles most affairs while Aldren sits in his chambers, re-reading his own journals to remember who he is.'
  },
  defenses: {
    militiaSize: 50,
    fortifications:
      'A palisade of petrified ironwood trunks surrounds the keep — each trunk is harder than steel and resistant to fire. The approach is further protected by the mists, which disorient invaders and erase their sense of direction.',
    watchPresence: 'Scribe-Sentinels patrol the timber keeps in shifts of six, their quills always ready to record any disturbance'
  },
  economy: {
    primary: 'Ironwood timber export',
    secondary: ['Resin harvesting', 'Parchment production', 'Ledger-keeping services'],
    status: 'stable'
  },
  atmosphere: {
    mood: 'Somber determination under perpetual mist. The people of Greymark speak in hushed tones — not out of fear, but because the fog swallows loud words and returns them as echoes hours later, distorted and mocking.',
    architecture:
      'Wet grey peat-stone and massive petrified ironwood logs. Buildings lean slightly inward, as if huddling for warmth. Every exterior wall is carved with genealogical records — family lineages etched directly into the structure so the fog cannot steal them.',
    sounds:
      'Constant scratching of quills from the Scribes\' Tower, distant fog-horns marking the hours, the creak of ironwood beams settling, and the low moan of the wind threading through the canopy bridges.',
    smells:
      'Burning heartwood resin from the public hearths, damp parchment, peat-smoke, and the faint mineral tang of the fog itself — like cold stone after rain.',
    lighting:
      'Dim and diffuse — oil lamps and hearth-fires cast halos that the fog immediately softens. On clear nights (rare), bioluminescent lichen on the ironwood trunks glows pale blue-green.'
  },
  history: {
    founded: 'Year 5 of the Deepening',
    foundedBy: 'House Thalreth',
    foundingStory:
      'Built where three ancient ironwood roots converged above a geothermal vent. The first Thalreth settlers chose this spot because the roots formed a natural shelter, and the vent provided the only unfrozen ground within fifty miles. The original keep was a single hall carved into the largest root — that hall is now the High Hearth.',
    significantEvents: [
      { date: 'Year 5, Deepening', event: 'The Fog Compact was sealed; Greymark established as seat of House Thalreth' },
      { date: 'Year 13, Dimming', event: 'The Church of the Holy Light was founded in the High Hearth' },
      { date: 'Year 89, Dimming', event: 'High Confessor Aldren Thalreth sealed himself in meditative stasis' },
      { date: 'Year 350, Dimming', event: 'Briaran raiders breached the outer palisade; repelled after three days of house-to-house fighting' }
    ]
  },
  subLocations: [
    {
      id: 'high-hearth',
      name: 'The High Hearth',
      type: 'great_hall',
      description:
        'The throne room of House Thalreth, carved into the heart of the largest petrified ironwood root. The root still lives — faintly — and its sap sometimes seeps through the walls, glowing amber in the darkness. The Lord\'s throne is a natural seat formed where three root-branches diverge.',
      proprietor: 'House Thalreth',
      notableFeatures: [
        'The Hearth-Fire: a perpetual flame fed by resinous heartwood that has not gone out in 800 years',
        'The Whispering Gallery: a curved wall where petitioners stand — the acoustics carry their words directly to the Lord\'s ear',
        'The Ledger-Stand: a rotating ironwood pillar displaying the day\'s decrees, updated hourly by Scribe-Sentinels'
      ]
    },
    {
      id: 'mist-gate-market',
      name: 'Mist-Gate Market',
      type: 'market',
      description:
        'The only open-air market in the Frostwood Reach, operating under a canopy of oiled canvas that catches and channels the mist away from the stalls. Merchants sell resin, parchment, ironwood carvings, imported whale oil, and "fog-charms" — small carved tokens that supposedly ward off memory loss.',
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
        'A warm, low-ceilinged tavern built into a hollow where two ironwood roots diverge. The walls sweat amber resin that the proprietor scrapes off and sells as candles. The specialty is "fog-brew" — a hot, spiced ale that supposedly sharpens memory for a few hours.',
      proprietor: 'Old Maren (Thalren human, retired Scribe-Sentinel)',
      notableFeatures: [
        'The Memory Wall: patrons pin notes to the wall — things they want to remember — and other patrons read them aloud to keep the memories alive',
        'Fog-brew on tap; Maren claims the recipe was traded from the Briaran before the uprising'
      ]
    }
  ],
  connectedMaps: [],
  factionPresence: [
    { factionId: 'house-thalreth', influence: 'dominant', description: 'The ruling family — their word is law' },
    { factionId: 'scribe-sentinels', influence: 'strong', description: 'Keep the ledgers, record the decrees, maintain the archives' },
    { factionId: 'church-of-the-holy-light', influence: 'moderate', description: 'The High Hearth serves as the Church\'s founding site; priests are respected but increasingly viewed as relics' }
  ],
  travelConnections: [
    { destinationId: 'the-shallows', distance: '2 miles', travelTime: '1 hour', route: 'Silt-road through the mist, marked by rusted lantern-posts' },
    { destinationId: 'scribes-tower', distance: 'half mile', travelTime: '15 min', route: 'Rope-and-plank bridges through the ironwood canopy' }
  ],
  classPresence: ['martyr', 'inscriptor', 'warden', 'augur'],
  npcs: ['aldren-thalreth', 'elara-thalreth', 'old-maren']
};

// =============================================================================
// NORDHALLA — The Frozen Archive (deep)
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
    title: 'Jarl of Nordhalla',
    leaderId: 'sigurd-skalvyr',
    description:
      'House Skalvyr controls the Archive through a combination of ancestral right and cold pragmatism. Jarl Sigurd Skalvyr is a man carved from glacier ice — he speaks rarely, decides slowly, and never reverses a decision once made.'
  },
  defenses: {
    militiaSize: 80,
    fortifications:
      'The Archive is carved into a living glacier — its walls are fifty feet of solid ice, self-repairing. The only entrance is a narrow defile patrolled by Skald ice-trackers who can read footprints in rime as easily as others read ink.',
    watchPresence: 'Skald Keepers patrol the outer chambers; the deeper vaults are guarded by cold-silence — intruders who venture too far simply freeze where they stand'
  },
  economy: {
    primary: 'Knowledge preservation — genealogy chiseling, rune-keeping, and historical consultation',
    secondary: ['Geothermal energy distribution', 'Ice-quarrying for construction'],
    status: 'stable'
  },
  atmosphere: {
    mood:
      'Profound silence and the weight of centuries. Every sound is swallowed by the ice. The Archive feels less like a building and more like a cathedral of frozen time — the Skald believe the glacier walls listen, and that disrespect echoes forever.',
    architecture:
      'Cathedral-like chambers carved from living glacier ice, their ceilings lost in blue darkness. Rune-inscribed pillars support vaults of compressed snow. The walls are covered floor-to-ceiling with chiseled genealogies — generations of Skald lineages traced in precise, angular script.',
    sounds:
      'The deep groan of settling ice, the distant drip of meltwater, the scratch of chisels from the genealogy halls, and — some say — the faint whispers of ancestors trapped in the walls.',
    smells: 'Cold stone, old ice (which has its own mineral scent — like frozen ozone), whale-oil lamps, and the faint copper tang of blood from the chiseling halls where genealogists cut their palms to mix ink.',
    lighting:
      'Pale blue-green from geothermal vents filtered through ice. Whale-oil lamps in the inhabited chambers. The deepest vaults are completely dark — the Skald navigate them by touch and memory.'
  },
  history: {
    founded: 'Year 7 of the Deepening',
    foundedBy: 'House Skalvyr',
    foundingStory:
      'Carved into the glacier as both a fortress and a tomb. The first chamber was a burial vault for the Skalvyr dead — the family believed that freezing their ancestors in ice would preserve not just their bodies, but their wisdom. Over centuries, the vaults expanded as more knowledge was added: genealogies, star-charts, treaties, and prophecies.',
    significantEvents: [
      { date: 'Year 7, Deepening', event: 'The Glacier Bargain was struck; construction of the Archive began' },
      { date: 'Year 89, Dimming', event: 'Aldren Thalreth\'s self-entombment — his frozen chamber remains in the deepest vault' },
      { date: 'Year 720, Dimming', event: 'Clandestine Void-heat engine construction began beneath the Archive' }
    ]
  },
  subLocations: [
    {
      id: 'genealogy-halls',
      name: 'The Genealogy Halls',
      type: 'archive',
      description:
        'A vast, multi-tiered chamber where Skald chiselers work in silence, carving family lineages into the glacier walls. Each chiseler works with a blood-ink mixture — their own blood mixed with crushed minerals — believing that ancestry can only be recorded by one who shares the blood.',
      proprietor: 'Skald Keepers',
      notableFeatures: [
        'The Wall of First Names: the oldest genealogical record, dating to Year 1 of the Dimming',
        'The Correction Ledger: a small, heated chamber where errors in genealogies are debated and ruled upon by a council of Elders'
      ]
    },
    {
      id: 'still-chamber',
      name: 'The Still Chamber',
      type: 'tomb',
      description:
        'Where Aldren Thalreth sits frozen in meditative stasis, his body preserved in a block of translucent ice. Pilgrims visit to touch the ice and receive "counsel" — though Aldren does not speak, visitors report receiving impressions, fragments of thought, and an overwhelming sense of sorrow.',
      proprietor: 'Church of the Holy Light',
      notableFeatures: [
        'The ice block radiates a faint warmth despite being frozen — pilgrims press their palms against it and claim it eases chronic pain',
        'A Scribe-Sentinel is stationed here at all times to record any "utterances" from the frozen High Confessor'
      ]
    }
  ],
  connectedMaps: [],
  factionPresence: [
    { factionId: 'house-skalvyr', influence: 'dominant', description: 'Absolute rulers of the Archive' },
    { factionId: 'skald-keepers', influence: 'strong', description: 'Maintain the genealogies and guard the vaults' },
    { factionId: 'church-of-the-holy-light', influence: 'moderate', description: 'Pilgrimage site; Aldren Thalreth\'s frozen chamber is a holy destination' },
    { factionId: 'cult-of-forgotten-shadow', influence: 'secret', description: 'Clandestine Void-heat research in sealed lower levels' }
  ],
  travelConnections: [
    { destinationId: 'fjord-gate', distance: '3 miles', travelTime: '2 hours', route: 'Frozen fjord-path, marked by rune-stones' },
    { destinationId: 'rimors-hearth', distance: '5 miles', travelTime: '3 hours', route: 'Geothermal vent-trail through ice tunnels' }
  ],
  classPresence: ['skald', 'doomsayer', 'warden', 'inscriptor'],
  npcs: ['sigurd-skalvyr', 'frigga-skalvyr', 'valeria-the-grim']
};

// =============================================================================
// BRYNGLOOM FOREST — Over-Shanty (deep)
// =============================================================================
DEEP_LOCATIONS['over-shanty'] = {
  heraldry: {
    iconUrl: '/assets/heraldry/over-shanty.png',
    colors: { primary: '#2d004b', secondary: '#6b4c8a' },
    description: 'A crooked rope-bridge spanning a darkness pierced by a single bioluminescent lantern'
  },
  population: 600,
  dominantRaces: ['Drun Neth', 'Morren humans', 'Outcast Vreken'],
  leadership: {
    type: 'none',
    title: 'No formal governance — ruled by a shifting balance of gang influence and survival-of-the-fittest',
    leaderId: null,
    description:
      'The Over-Shanty has no single leader. Power is held by whoever controls the rope-bridges, the peat-harvest, and the black market. Currently, three factions vie for dominance: the Drun Outcasts, the Cult of Forgotten Shadow, and a loose coalition of Morren peat-cutters.'
  },
  defenses: {
    militiaSize: 0,
    fortifications:
      'The Shanty\'s only defense is its location — suspended above bottomless peat-bogs, accessible only by retractable rope-bridges that the residents can cut in seconds. Invaders who fall into the bogs are preserved, aware, in the acidic peat.',
    watchPresence: 'No formal watch — but everyone in the Shanty watches everyone else. Gossip travels faster than arrows.'
  },
  economy: {
    primary: 'Black market trade, peat-harvesting, Void-artifact trafficking',
    secondary: ['Information brokerage', 'Memory extraction services (Cult of Forgotten Shadow)', 'Fugitive harboring'],
    status: 'thriving'
  },
  atmosphere: {
    mood:
      'Desperate, electric, alive. The Over-Shanty hums with the energy of people who have nothing left to lose. It is a place of last chances and first betrayals — everyone here is running from something, and everyone will sell anyone for the right price.',
    architecture:
      'A chaotic hanging slum of rope-bridges, ramshackle wooden cabins, and repurposed ship-hulls suspended from the underside of Atropolis\'s main platforms. Buildings are lashed together with tarred rope and salvaged chain. Everything sways — newcomers get seasick.',
    sounds:
      'Creaking ropes, distant splashes from the bogs below, laughter and arguments from the taverns, the constant murmur of haggling, and — always, somewhere — someone crying.',
    smells:
      'Damp wood, peat-rot, cheap spirits, cooking fires, unwashed bodies, and the faint, sweet undertone of the preserving bogs that swallow the dead.',
    lighting:
      'Bioluminescent lanterns hung from every bridge — pale green and purple light. Fires are dangerous (everything is wood and rope), so most light comes from captive glow-moss cultivated in clay pots.'
  },
  history: {
    founded: 'Unknown — the Shanty grew organically as outcasts accumulated beneath Atropolis',
    foundedBy: 'The first Drun exiles who refused to burn their names from the First Contract',
    foundingStory:
      'When the Velun Neth signed the First Contract, those who could not abide its terms — who refused to surrender their names, their memories, or their autonomy — were cast down. They built platforms beneath Atropolis, then more platforms, then rope-bridges between them. The Shanty has never stopped growing.',
    significantEvents: [
      { date: 'Year 412, Dimming', event: 'Natalie Seline founded the Cult of Forgotten Shadow in a peat-crypt beneath the Shanty' },
      { date: 'Year 598, Dimming', event: 'The Silence Between Stars made first contact with the Cult\'s inner circle' },
      { date: 'Year 650, Dimming', event: 'The Great Fire — a third of the Shanty burned; the Cult used Shadow magic to contain the flames, earning grudging respect' }
    ]
  },
  subLocations: [
    {
      id: 'sunken-confessionals',
      name: 'The Sunken Confessionals',
      type: 'temple',
      description:
        'A network of submerged peat-crypts where the Cult of Forgotten Shadow practices memory extraction and Shadow confession. Clients — some willing, some not — are lowered into peat-filled chambers where Shadow priests enter their minds and extract specific memories, secrets, or traumas.',
      proprietor: 'Cult of Forgotten Shadow',
      notableFeatures: [
        'The Extraction Chambers: peat-filled cells where the priest and subject share consciousness',
        'The Memory Market: extracted memories are stored in crystal vials and sold — a father\'s recollection of his daughter\'s face, a soldier\'s memory of a battle, a lover\'s last kiss before betrayal'
      ]
    },
    {
      id: 'dangling-keel',
      name: 'The Dangling Keel',
      type: 'tavern',
      description:
        'A repurposed ship\'s hull suspended by chains directly over the deepest bog. The floor has a glass portal showing the darkness below. Patrons toss coins through the portal for luck — the coins fall for nearly a minute before they hit the peat. The Keel serves "bog-brew" — a murky, potent spirit distilled from fermented peat-moss.',
      proprietor: 'Captain Gravis (Morren human, former smuggler)',
      notableFeatures: [
        'The Glass Floor: a rare piece of actual glass, showing the endless drop below',
        'The Wanted Board: a wall of fugitive notices and bounty posters — updated daily by the Cult\'s information network'
      ]
    }
  ],
  connectedMaps: [],
  factionPresence: [
    { factionId: 'cult-of-forgotten-shadow', influence: 'strong', description: 'The Cult runs the memory trade and provides "spiritual services"' },
    { factionId: 'drun-outcasts', influence: 'strong', description: 'The original inhabitants — control the rope-bridges and peat-harvesting' },
    { factionId: 'zhentarim-network', influence: 'moderate', description: 'Competing for control of the black market; tense coexistence' }
  ],
  travelConnections: [
    { destinationId: 'atropolis', distance: '200 feet up', travelTime: '10 min', route: 'Cargo elevators and rope-ladders up to Atropolis\'s platforms' },
    { destinationId: 'peat-bog-sinks', distance: 'half mile', travelTime: '30 min', route: 'Treacherous bog-boardwalks marked by glow-moss stakes' }
  ],
  classPresence: ['falseProphet', 'lichborne', 'deathcaller', 'toxicologist'],
  npcs: ['natalie-seline', 'korrin-the-shade']
};

// =============================================================================
// SUNDRIFT VALE — Synod Hold (deep)
// =============================================================================
DEEP_LOCATIONS['synod-hold'] = {
  heraldry: {
    iconUrl: '/assets/heraldry/synod-hold.png',
    colors: { primary: '#8b6914', secondary: '#d4c5a0' },
    description: 'A circle of seven standing stones against a starless sky, each stone inscribed with the crest of a noble house'
  },
  population: 800,
  dominantRaces: ['Solvarn humans', 'Unlit Astril'],
  leadership: {
    type: 'noble_house',
    title: 'Steppe-Lord',
    leaderId: 'loras-ordavan',
    description:
      'House Ordavan nominally rules from Synod Hold, but every trade minister has a Zhentarim "advisor" at their elbow. Lord Loras Ordavan is a well-meaning man who has not yet realized that every decision he makes was suggested to him by someone else.'
  },
  defenses: {
    militiaSize: 30,
    fortifications:
      'Synod Hold is not a fortress — it is a gathering place. Its defenses are political, not military. The Hold\'s only physical protection is the vast, disorienting emptiness of the steppe that surrounds it.',
    watchPresence: 'Nomadic outriders patrol the steppe approaches; their horns can warn of invaders an hour before arrival'
  },
  economy: {
    primary: 'Trade nexus — all steppe trade routes converge at Synod Hold',
    secondary: ['Wool and hide from the great herds', 'Zhentarim caravan services', 'Oracle-readings from the ancestral mounds'],
    status: 'controlled_by_external'
  },
  atmosphere: {
    mood:
      'Anxious prosperity. The Hold\'s markets are busy, its storehouses full — but there is an undercurrent of unease. The ancestral mounds are falling silent. The Zhentarim presence grows bolder by the season. The Steppe-Lord smiles but his eyes flick toward his advisors before answering questions.',
    architecture:
      'Low, circular stone buildings arranged in concentric rings around a central gathering field. The stone is pale limestone, quarried from the single ridge that breaks the monotony of the steppe. Every building entrance faces east — toward where Sol once rose.',
    sounds:
      'Wind — constant, keening, through the grass. The lowing of distant herds. The clink of trade-coins. The hum of an ancestral mound nearby, still faintly audible. Nomadic singers practicing the oral histories.',
    smells: 'Dry grass, animal musk, cooking smoke, and the faint ozone scent that accompanies an active ancestral mound',
    lighting:
      'Darkness broken only by firelight. The starless sky offers nothing. At night, the Hold\'s inhabitants light their homes with whale-oil lamps. On the steppe itself, the only light comes from the bioluminescence of the woolly herds\' antlers.'
  },
  history: {
    founded: 'Year 30 of the Dimming',
    foundedBy: 'House Ordavan',
    foundingStory:
      'Originally a seasonal gathering site for nomadic clans, Synod Hold grew into a permanent settlement when the Ordavan realized that the steppe\'s trade value exceeded its grazing value. The Zhentarim arrived within a generation and never left.',

    significantEvents: [
      { date: 'Year 30, Dimming', event: 'Synod Hold established as a permanent trade post' },
      { date: 'Year 150, Dimming', event: 'The first Zhentarim caravan arrived — offering "trade consultation services"' },
      { date: 'Year 500, Dimming', event: 'Three ancestral mounds fell silent in a single season; cause still unknown' }
    ]
  },
  subLocations: [
    {
      id: 'steppe-market',
      name: 'The Steppe Market',
      type: 'market',
      description:
        'A sprawling open-air market where nomadic herders trade wool, hide, and meat for imported goods. The Zhentarim maintain the largest stalls — they sell iron tools, whale oil, parchment, and "information consultation." Their prices are always fair. Too fair.',
      proprietor: 'Zhentarim Network (unofficially) / House Ordavan (nominally)',
      notableFeatures: [
        'The Notice-Spire: a tall stone pillar where traders post messages; controlled by Zhentarim clerks who "help" people write their notices',
        'The Astril Enclosure: a quiet corner where Unlit Astril sell constellation-readings — fragments of dying stars glimpsed in their crystalline blood'
      ]
    }
  ],
  connectedMaps: [],
  factionPresence: [
    { factionId: 'house-ordavan', influence: 'nominal', description: 'The official rulers — but everyone knows who really runs the Hold' },
    { factionId: 'zhentarim-network', influence: 'dominant', description: 'Control trade policy, information flow, and security contracts' }
  ],
  travelConnections: [
    { destinationId: 'emberspire', distance: '80 miles', travelTime: '3 days', route: 'The Ash-Road — a caravan trail marked by charcoal cairns' }
  ],
  classPresence: ['oracle', 'falseProphet', 'fateWeaver', 'gambler'],
  npcs: ['loras-ordavan', 'the-factotum']
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

export { DEEP_LOCATIONS, getDeepLocation, getEnrichedZone, getEnrichedZonesByRegion };
export default DEEP_LOCATIONS;
