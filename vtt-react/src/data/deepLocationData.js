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
  classPresence: ['skald', 'harbinger', 'warden', 'inscriptor'],
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
    { factionId: 'unlit-veil', influence: 'moderate', description: 'Unlit Astril brokers competing for control of the memory-trade; tense coexistence with the Drun' }
  ],
  travelConnections: [
    { destinationId: 'atropolis', distance: '200 feet up', travelTime: '10 min', route: 'Cargo elevators and rope-ladders up to Atropolis\'s platforms' },
    { destinationId: 'peat-bog-sinks', distance: 'half mile', travelTime: '30 min', route: 'Treacherous bog-boardwalks marked by glow-moss stakes' }
  ],
  classPresence: ['falseProphet', 'revenant', 'toxicologist'],
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
      'House Ordavan nominally rules from Synod Hold, but every trade minister has an Unlit Veil "advisor" at their elbow. Lord Loras Ordavan is a well-meaning man who has not yet realized that every decision he makes was suggested to him by someone else.'
  },
  defenses: {
    militiaSize: 30,
    fortifications:
      'Synod Hold is not a fortress — it is a gathering place. Its defenses are political, not military. The Hold\'s only physical protection is the vast, disorienting emptiness of the steppe that surrounds it.',
    watchPresence: 'Nomadic outriders patrol the steppe approaches; their horns can warn of invaders an hour before arrival'
  },
  economy: {
    primary: 'Trade nexus — all steppe trade routes converge at Synod Hold',
    secondary: ['Wool and hide from the great herds', 'Unlit Veil message-routing services', 'Oracle-readings from the ancestral mounds'],
    status: 'controlled_by_external'
  },
  atmosphere: {
    mood:
      'Anxious prosperity. The Hold\'s markets are busy, its storehouses full — but there is an undercurrent of unease. The ancestral mounds are falling silent. The Unlit Veil presence grows bolder by the season. The Steppe-Lord smiles but his eyes flick toward his advisors before answering questions.',
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
      'Originally a seasonal gathering site for nomadic clans, Synod Hold grew into a permanent settlement when the Ordavan realized that the steppe\'s trade value exceeded its grazing value. The Unlit Veil arrived within a generation and never left.',

    significantEvents: [
      { date: 'Year 30, Dimming', event: 'Synod Hold established as a permanent trade post' },
      { date: 'Year 150, Dimming', event: 'The first Unlit Veil couriers arrived — offering "trade consultation services"' },
      { date: 'Year 500, Dimming', event: 'Three ancestral mounds fell silent in a single season; cause still unknown' }
    ]
  },
  subLocations: [
    {
      id: 'steppe-market',
      name: 'The Steppe Market',
      type: 'market',
      description:
        'A sprawling open-air market where nomadic herders trade wool, hide, and meat for imported goods. The Unlit Veil maintain the largest stalls — they sell navigation charts, memory-crystals, and "information consultation." Their prices are always fair. Too fair.',
      proprietor: 'Unlit Veil (unofficially) / House Ordavan (nominally)',
      notableFeatures: [
        'The Notice-Spire: a tall stone pillar where traders post messages; controlled by Unlit Veil clerks who "help" people write their notices',
        'The Astril Enclosure: a quiet corner where Unlit Astril sell constellation-readings — fragments of dying stars glimpsed in their crystalline blood'
      ]
    }
  ],
  connectedMaps: [],
  factionPresence: [
    { factionId: 'house-ordavan', influence: 'nominal', description: 'The official rulers — but everyone knows who really runs the Hold' },
    { factionId: 'unlit-veil', influence: 'dominant', description: 'Control trade policy, information flow, and consultation contracts' }
  ],
  travelConnections: [
    { destinationId: 'emberspire', distance: '80 miles', travelTime: '3 days', route: 'The Ash-Road — a caravan trail marked by charcoal cairns' }
  ],
  classPresence: ['augur', 'falseProphet', 'gambit', 'gambit'],
  npcs: ['loras-ordavan', 'the-factotum']
};

// =============================================================================
// FROSTWOOD REACH — Mirror Mere (deep)
// =============================================================================
DEEP_LOCATIONS['mirror-mere'] = {
  heraldry: {
    iconUrl: '/assets/heraldry/mirror-mere.png',
    colors: { primary: '#3a5a6a', secondary: '#8ab4c4' },
    description: 'A perfectly still pool reflecting a featureless white mask, ringed by ironwood branches'
  },
  population: 200,
  dominantRaces: ['Mask-Borne Mimir', 'Thalren humans'],
  leadership: {
    type: 'council',
    title: 'Reflection Council',
    leaderId: null,
    description:
      'Mirror Mere is governed by a rotating council of three Mask-Borne Mimir elders who consult the lake\'s reflections before every decision. The council chamber is the lakeshore itself — decisions are made standing at the water\'s edge, watching the future-echoes ripple across the surface.'
  },
  defenses: {
    militiaSize: 15,
    fortifications:
      'The mere itself is the primary defense — the water reflects attackers before they arrive, giving the Mimir hours of advance warning. The surrounding ironwood grove has been shaped into a natural labyrinth by generations of Mimir horticulture.',
    watchPresence: 'Mask-Borne sentinels stand at cardinal points around the mere, their masks angled toward the water'
  },
  economy: {
    primary: 'Divination services and identity-verification',
    secondary: ['Memory-glass harvesting from the lakebed', 'Mask-carving from storm-glass', 'Fog-navigation consultation'],
    status: 'stable'
  },
  atmosphere: {
    mood:
      'Hushed and reverent, as if inside a cathedral of glass. The Mimir move with deliberate grace around the mere — they believe every action is reflected and remembered by the water. Visitors speak in whispers, not from fear, but because the lake amplifies and returns every sound with a delay that makes conversation unsettling.',
    architecture:
      'Low, curved buildings of pale driftwood and storm-glass, designed to complement rather than compete with the lake. Every structure faces the water. The Mimir homes are mirrored on the inside — reflective surfaces everywhere, so inhabitants can verify their forms constantly.',
    sounds:
      'The lap of perfectly still water (somehow audible despite the calm), the soft click of mask-adjustments, wind chimes made of frozen memory-glass, and the occasional ripple that has no visible cause.',
    smells:
      'Clean, cold water with a faint metallic undertone — like licking a silver spoon. Crushed pine needles from the ironwood canopy. The absence of bog-smell is itself notable.',
    lighting:
      'Reflected light dominates — the mere catches whatever illumination exists and doubles it. On clear nights, bioluminescent lichen and the glow of the lake itself provide a steady, silver-blue radiance. The effect is dreamlike.'
  },
  history: {
    founded: 'Year 45 of the Dimming',
    foundedBy: 'Mask-Borne Mimir elders',
    foundingStory:
      'When the first Mimir discovered that the fog was dissolving their identities, a small group of Mask-Borne sought a place where identity could be verified externally. They found a lake so perfectly still that it reflected not just the present, but rippled with echoes of the near future. They built their settlement around it, and the mere has served as both anchor and oracle ever since.',
    significantEvents: [
      { date: 'Year 45, Dimming', event: 'The Mirror Compact — Mimir elders swore to maintain the mere as a neutral identity-ground' },
      { date: 'Year 230, Dimming', event: 'A Gref emerged from the mere\'s reflection, stealing the face of an elder mid-council session' },
      { date: 'Year 590, Dimming', event: 'Thalren scribes established a memory-glass harvesting operation with Mimir permission' }
    ]
  },
  subLocations: [
    {
      id: 'reflection-council-shore',
      name: 'The Council Shore',
      type: 'great_hall',
      description:
        'The semicircular lakeshore where the Reflection Council meets. Three carved stone seats face the water, positioned so the councilors can read both the reflections and each other simultaneously. The water directly in front of the seats is the clearest — the Mimir believe the mere presents itself deliberately to its leaders.',
      proprietor: 'Reflection Council',
      notableFeatures: [
        'The Depth-Mirror: a section of the lake that reflects not faces but forms — revealing a viewer\'s true shape regardless of mask or disguise',
        'The Warning-Ripple: the council has catalogued dozens of distinct ripple patterns and their associated future-events'
      ]
    },
    {
      id: 'the-glassworks',
      name: 'The Glassworks',
      type: 'market',
      description:
        'A covered workshop where Mimir artisans harvest memory-glass from the lakebed and carve it into masks, lenses, and divination tools. The glass is naturally formed by the mere\'s unique alchemy — volcanic minerals, cold-iron trace elements, and something the Mimir will not discuss. Each piece is unique, and the finest specimens capture and hold a single memory indefinitely.',
      proprietor: 'Mask-Borne Artisans\' Guild',
      notableFeatures: [
        'The Memory-Vials: small glass ampoules containing captured reflections, sold to Thalren scribes as archival insurance',
        'The Unmasking Booth: a private chamber where Mimir can safely remove their masks to verify their true forms — heavily guarded, as an unmasked Mimir is profoundly vulnerable'
      ]
    }
  ],
  connectedMaps: [],
  factionPresence: [
    { factionId: 'mask-borne-mimir', influence: 'dominant', description: 'Founders and custodians of the mere' },
    { factionId: 'scribe-sentinels', influence: 'moderate', description: 'Maintain a small presence for memory-glass procurement and cross-referencing' }
  ],
  travelConnections: [
    { destinationId: 'greymark-keep', distance: '8 miles', travelTime: '3 hours', route: 'Mist-shrouded ironwood path, marked by storm-glass cairns' },
    { destinationId: 'the-shifting-fen', distance: '2 miles', travelTime: '45 min', route: 'Boardwalk through the fen — path changes with the seasons' }
  ],
  classPresence: ['lunarch', 'shaper', 'warden'],
  npcs: []
};

// =============================================================================
// NORDHALLA — Vargtor (deep)
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
      'Vargtor is a military garrison commanded by a rotating Watch-Commander drawn from the Skald Ice-Trackers. The commander holds absolute authority within the tor\'s walls — a necessity given the speed at which glacier wyrms and Corvani raiding parties can strike.'
  },
  defenses: {
    militiaSize: 40,
    fortifications:
      'The tor itself is the fortification — a natural pillar of granite rising two hundred feet above the glacier line. The garrison has reinforced the natural caves with iron-banded doors and cold-iron stakes driven into the stone. A signal-fire at the summit can be seen for thirty miles.',
    watchPresence: 'Ice-Trackers patrol the tor\'s approaches in four-hour shifts, reading the rime for signs of approach'
  },
  economy: {
    primary: 'Military garrison — funded by House Skalvyr',
    secondary: ['Wolf-pelt trading', 'Ice-quarrying', 'Emergency shelter for passing caravans'],
    status: 'stable'
  },
  atmosphere: {
    mood:
      'Disciplined and cold. The garrison operates with the precision of a machine — every torch is lit at the same hour, every patrol follows the same route, every meal is eaten in silence. The Skald here have none of the bardic warmth of Fjord-Gate. They are watchers, and watchers learn to be still.',
    architecture:
      'Spartan stone chambers carved into the tor itself, connected by narrow tunnels and iron ladders. No decoration except weapons racks and genealogy tablets. The commander\'s chamber is at the top, with a window overlooking the glacier approaches.',
    sounds:
      'Wind — constant, keening, at hurricane force on exposed faces. The howl of wolves at the tor\'s base. The crack of ice shifting. The rhythmic clatter of the signal-fire\'s chain-pulley.',
    smells: 'Cold stone, iron, smoke from the signal-fire, and the unmistakable musk of wolves that gather at the base every winter.',
    lighting:
      'Harsh and functional — whale-oil lamps in iron cages. The signal-fire bathes the summit in orange light. On clear nights, the glacier reflects starlight with an intensity that makes the tor glow blue-white.'
  },
  history: {
    founded: 'Year 112 of the Dimming',
    foundedBy: 'House Skalvyr',
    foundingStory:
      'Established as a forward watch-post after a Corvani raiding party descended from the eastern peaks and sacked a Skald fishing village. The tor was chosen for its natural height and the strange affinity wolves show for its base — the garrison has never been taken by surprise.',
    significantEvents: [
      { date: 'Year 112, Dimming', event: 'Garrison established after the Corvani Sack of Hvalvik' },
      { date: 'Year 340, Dimming', event: 'A glacier wyrm attacked the tor and was repelled — its frozen corpse remains at the base as a warning' },
      { date: 'Year 610, Dimming', event: 'Rime-Born Rune Keepers arrived to study the ancient runic carvings found in the tor\'s deepest chambers' }
    ]
  },
  subLocations: [
    {
      id: 'the-wolf-gate',
      name: 'The Wolf Gate',
      type: 'fortification',
      description:
        'The only entrance to the tor — a narrow passage at the base, reinforced with cold-iron doors carved with wolf-heads. The wolves that gather outside the gate are not tame, but the garrison feeds them scraps, creating an unofficial first line of defense.',
      proprietor: 'Skald Ice-Trackers',
      notableFeatures: [
        'The Wyrm-Skull: the frozen skull of the glacier wyrm killed in Year 340, mounted above the gate',
        'The Rime-Scratch Board: a wall of ice where the Ice-Trackers record their patrol observations in runic shorthand'
      ]
    },
    {
      id: 'the-deep-carvings',
      name: 'The Deep Carvings',
      type: 'archive',
      description:
        'A chamber in the tor\'s lowest level where ancient runic carvings cover every surface — predating the Skald garrison by centuries. The Rime-Born believe the carvings are a record of the Glacier Bargain itself, written by witnesses who froze solid while inscribing it.',
      proprietor: 'Rime-Born Rune Keepers',
      notableFeatures: [
        'The Bargain Stone: a single, central tablet that the Rime-Born claim describes the exact terms of the Skalvyr compact',
        'The Frozen Scribes: three humanoid shapes visible in the ice of the far wall — bodies preserved mid-carving'
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
// SUNDALE — Ember Lagoon (deep)
// =============================================================================
DEEP_LOCATIONS['ember-lagoon'] = {
  heraldry: {
    iconUrl: '/assets/heraldry/ember-lagoon.png',
    colors: { primary: '#8b3a00', secondary: '#ff6a00' },
    description: 'A steaming lagoon cradled by black basalt, its waters glowing orange-red'
  },
  population: 350,
  dominantRaces: ['Emberth', 'Solvarn humans', 'Merryn traders'],
  leadership: {
    type: 'guild',
    title: 'Harbour-Master',
    leaderId: null,
    description:
      'Ember Lagoon is governed by the Harbour-Master — an Emberth forge-master elected by the dock guilds every five years. The Harbour-Master controls port fees, diving rights, and access to the thermal vents. It is a position of considerable wealth and equally considerable danger — two of the last five Harbour-Masters died in volcanic eruptions.'
  },
  defenses: {
    militiaSize: 25,
    fortifications:
      'The lagoon\'s natural geography is its primary defense — the entrance is a narrow channel between volcanic cliffs that can be blocked with iron chains. The water temperature deters most aquatic threats, and the constant steam provides cover from aerial observation.',
    watchPresence: 'Emberth dock-guards patrol the quays in four-hour shifts, armed with thermal pikes that glow white-hot at the tip'
  },
  economy: {
    primary: 'Port trade — Sundale\'s only harbor',
    secondary: ['Fire-coral harvesting', 'Thermal crystal diving', 'Volcanic glass export'],
    status: 'thriving'
  },
  atmosphere: {
    mood:
      'Busy, humid, and loud. Ember Lagoon is the closest thing Sundale has to a cosmopolitan port — Emberth, Solvarn, and Merryn all rub shoulders on the docks. The air is thick with steam and the smell of cooking fish. Arguments in three languages echo off the basalt cliffs.',
    architecture:
      'Dock buildings of black basalt and iron, their walls running with condensation. Every structure is built to withstand tremors — low, wide, and anchored with iron stays. The Emberth buildings feature open-air forge-hearths instead of fireplaces. The Merryn quarter is built on stilts over the water, swaying gently with the thermal currents.',
    sounds:
      'The constant hiss of steam venting from the lagoon, the clang of Emberth forges, the creak of Merryn rigging, merchants haggling in Sundari and Aquan simultaneously, and the low, persistent rumble of volcanic activity beneath the water.',
    smells:
      'Sulfur, salt water, volcanic heat, roasting fish, molten metal, and the sweet, acrid smoke of fire-coral being processed for trade.',
    lighting:
      'Orange-red from the volcanic glow beneath the water\'s surface. The lagoon literally glows at night — the thermal vents illuminate the water from below, casting rippling red light on the basalt cliffs. It is never truly dark here.'
  },
  history: {
    founded: 'Year 88 of the Dimming',
    foundedBy: 'Emberth Korr and Merryn sailors',
    foundingStory:
      'Discovered by a Merryn trading vessel blown off course during a gale. The captain found warm water in a frozen sea and immediately recognized its value. The Emberth, who had known of the thermal vents but considered them sacred, reluctantly agreed to share the site when the Merryn demonstrated that the lagoon could be Sundale\'s lifeline to the outside world.',
    significantEvents: [
      { date: 'Year 88, Dimming', event: 'First Merryn-Emberth trade agreement signed on the lagoon shore' },
      { date: 'Year 250, Dimming', event: 'The Great Eruption — a thermal vent exploded, destroying a third of the dock district' },
      { date: 'Year 500, Dimming', event: 'Solvarn sun-priests established a shrine to Sol on the eastern cliff, drawing pilgrims' }
    ]
  },
  subLocations: [
    {
      id: 'the-thermal-docks',
      name: 'The Thermal Docks',
      type: 'market',
      description:
        'The main quay of Ember Lagoon, built from volcanic basalt blocks that radiate heat. Ships dock here to load Sundale\'s exports — cold-iron, volcanic glass, fire-coral — and unload imports from every region. The dock is chaotic, loud, and incredibly profitable.',
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
        'A natural cave in the eastern cliff wall where thermal light filters through volcanic crystal, creating a perpetual sunrise effect. Solvarn pilgrims come here to pray to the buried sun — the cave\'s warmth is considered Sol\'s breath, and the orange light is taken as proof the star still lives.',
      proprietor: 'Dawn Vigil',
      notableFeatures: [
        'The Sun-Crystal: a massive volcanic crystal in the cave ceiling that refracts thermal light into a convincing solar spectrum',
        'The Prayer-Walls: covered in Solvarn prayers carved in Sundari script — some dating back centuries, worn smooth by the touching of thousands of hands'
      ]
    }
  ],
  connectedMaps: [],
  factionPresence: [
    { factionId: 'emberth-forge-clans', influence: 'dominant', description: 'Control the docks, diving rights, and thermal vent access' },
    { factionId: 'house-solvan', influence: 'moderate', description: 'Maintain the shrine and the pilgrimage trade' },
    { factionId: 'merryn-traders', influence: 'moderate', description: 'Control the shipping lanes and import-export pricing' }
  ],
  travelConnections: [
    { destinationId: 'great-forge', distance: '15 miles', travelTime: '6 hours', route: 'The Cinder Road — basalt-paved, maintained by Emberth workers' },
    { destinationId: 'merrowport', distance: '200 miles', travelTime: '4 days by sea', route: 'The Cinder Strait — dangerous but fast' }
  ],
  classPresence: ['martyr', 'pyrofiend', 'spellguard', 'warden'],
  npcs: []
};

// =============================================================================
// BRYNGLOOM FOREST — Aran-Glen (deep)
// =============================================================================
DEEP_LOCATIONS['aran-glen'] = {
  heraldry: {
    iconUrl: '/assets/heraldry/aran-glen.png',
    colors: { primary: '#1a4a2a', secondary: '#4a8a5a' },
    description: 'A living ironwood tree shaped into an archway, its roots forming a perfect circle'
  },
  population: 300,
  dominantRaces: ['Kessen Neth', 'Morren humans'],
  leadership: {
    type: 'contractual',
    title: 'Grove-Steward',
    leaderId: null,
    description:
      'Aran-Glen is governed by a Grove-Steward — a Kessen Neth weaver who has legally bound themselves to the grove\'s health through a personal contract with the ironwood root-network. The Steward\'s authority is absolute within the glen but automatically void if the grove\'s health metrics decline. It is a governance system designed to prevent corruption through self-interest.'
  },
  defenses: {
    militiaSize: 20,
    fortifications:
      'The living ironwood walls that define the glen are its defense — centuries of Kessen horticulture have produced a barrier of interlocking branches and thorns that is harder than stone and capable of self-repair. The entrance is a single archway grown from two trees that have merged at the crown.',
    watchPresence: 'Kessen root-walkers patrol the perimeter, their bare feet reading vibrations through the root-network'
  },
  economy: {
    primary: 'Ironwood cultivation and living-architecture construction',
    secondary: ['Contract-arbitration services', 'Bioluminescent moss harvesting', 'Medicinal bog-fungi cultivation'],
    status: 'stable'
  },
  atmosphere: {
    mood:
      'Calm, ordered, and alive. Aran-Glen feels less like a settlement and more like a single organism — the buildings breathe, the paths shift subtly with the seasons, and the root-network hums with a constant, low vibration that the Kessen find soothing and visitors find mildly disorienting.',
    architecture:
      'Every structure in Aran-Glen is grown, not built. The Kessen coax ironwood saplings into architectural forms over decades — arches, walls, roofs, and chambers all formed from living wood. The buildings shed leaves in autumn, bloom in spring, and grow slightly larger every year. The effect is organic beauty that no stonemason could replicate.',
    sounds:
      'The creak and rustle of living wood, the hum of the root-network (a constant low drone like a temple bell), the murmur of the bayou, and the gentle clicking of Kessen contract-tablets being annotated.',
    smells:
      'Fresh sap, wet earth, the clean mineral scent of healthy root-systems, and the faint sweetness of ironwood flowers — one of the few pleasant smells in the Bryngloom.',
    lighting:
      'Bioluminescent moss cultivated on every surface provides a steady, warm green-gold light. The Kessen have bred specific strains for different brightness levels, creating a natural lighting system that responds to the settlement\'s needs.'
  },
  history: {
    founded: 'Year 60 of the Dimming',
    foundedBy: 'Kessen Neth Weavers',
    foundingStory:
      'When Atropolis grew crowded and the Velun Pact-Lords became increasingly rigid in their interpretation of the First Contract, a group of Kessen weavers left to establish a community dedicated to the living arts. They found a narrow glen where the ironwood roots formed a natural enclosure and began the slow, patient work of growing a settlement. Three centuries later, Aran-Glen is proof that architecture can be alive.',
    significantEvents: [
      { date: 'Year 60, Dimming', event: 'The Glen Compact — Kessen weavers bound themselves to the grove\'s health' },
      { date: 'Year 280, Dimming', event: 'First successful living-bridge grown across the glen, spanning 100 feet' },
      { date: 'Year 550, Dimming', event: 'Morren peat-cutters granted settlement rights in exchange for root-system maintenance' }
    ]
  },
  subLocations: [
    {
      id: 'the-grove-heart',
      name: 'The Grove-Heart',
      type: 'great_hall',
      description:
        'The oldest tree in the glen — a colossal ironwood whose canopy covers half the settlement. The tree serves as the Glen-Steward\'s seat of governance and the community\'s gathering space. Its trunk is carved with three centuries of Kessen contract-law precedents.',
      proprietor: 'Grove-Steward',
      notableFeatures: [
        'The Living Archive: contract-tablets grown directly from the tree\'s bark, containing legal decisions that update as the tree grows',
        'The Root-Chamber: a hollow space inside the trunk where the root-network\'s hum is strongest — used for meditation and deep contract-negotiation'
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
        'The Growing-Furniture Row: chairs, tables, and shelving that are still alive — buyers must sign a maintenance contract',
        'The Bog-Apothecary: a stall run by a Morren herbalist who has learned Kessen root-reading to identify medicinal compounds'
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
// CRAGJAW PEAKS — Gearworks Gulch (deep)
// =============================================================================
DEEP_LOCATIONS['gearworks-gulch'] = {
  heraldry: {
    iconUrl: '/assets/heraldry/gearworks-gulch.png',
    colors: { primary: '#4a4a3a', secondary: '#8a7a3a' },
    description: 'Interlocking gears framing a geothermal steam-vent'
  },
  population: 400,
  dominantRaces: ['Fexrick', 'Groven', 'Tessen humans'],
  leadership: {
    type: 'guild',
    title: 'Chief Artificer',
    leaderId: null,
    description:
      'Gearworks Gulch is governed by the Chief Artificer — the most innovative Fexrick engineer, chosen by competitive exhibition every three years. The Chief Artificer controls resource allocation, patent registration, and industrial safety standards. The position is as much about managing egos as engineering.'
  },
  defenses: {
    militiaSize: 30,
    fortifications:
      'The gulch\'s narrow entrance is sealed each night by a massive iron portcullis powered by geothermal hydraulics. Inside, the industrial infrastructure itself serves as defense — steam vents can be directed at attackers, and the machinery creates a labyrinth of moving parts that outsiders cannot navigate.',
    watchPresence: 'Fexrick automaton-sentries patrol the upper galleries — clockwork constructs that respond to unauthorized movement with non-lethal electrical discharge'
  },
  economy: {
    primary: 'Clockwork manufacturing and industrial engineering',
    secondary: ['Geothermal power distribution', 'Scrap-metal recycling', 'Automaton repair and customization'],
    status: 'thriving'
  },
  atmosphere: {
    mood:
      'Feverish, inventive, and loud. Gearworks Gulch never sleeps — the geothermal power runs twenty-four hours, and Fexrick engineers work in shifts, each trying to out-invent the previous. The air vibrates with the hum of machinery and the excited shouting of artisans showing off new mechanisms.',
    architecture:
      'Industrial Fexrick construction — iron frameworks, riveted plate walls, and geothermal pipe-networks visible on every surface. Buildings are stacked vertically up the ravine walls, connected by iron catwalks, cargo elevators, and steam-powered lifts. Everything is functional, nothing is decorative, and yet the cumulative effect is oddly beautiful — a canyon of interlocking machinery.',
    sounds:
      'The constant clatter and whir of clockwork, the hiss of steam pressure-relief valves, the clang of forge-hammers, the grind of ore-crushers, and the excited babble of Fexrick arguing in Scrap-Tongue and Fexric simultaneously.',
    smells:
      'Sulfur from the geothermal vents, hot metal, machine oil, ozone from electrical testing, and the sharp tang of acid-etching solution.',
    lighting:
      'Industrial illumination — gas-lamps, electrical arc-lights, and the orange glow of forge-fires. The geothermal vents cast an eerie red light from below. Steam creates a perpetual haze that diffuses all light sources into soft halos.'
  },
  history: {
    founded: 'Year 200 of the Dimming',
    foundedBy: 'Kethrin Guild-Bound Fexrick',
    foundingStory:
      'Founded when a Kethrin Fexrick expedition discovered a geothermal ravine with naturally occurring steam-pressure that could power machinery without manual bellows. Within a generation, the gulch became the industrial heart of the Cragjaw Peaks — producing clockwork mechanisms, automaton components, and refined metals for all seven regions.',
    significantEvents: [
      { date: 'Year 200, Dimming', event: 'Geothermal ravine discovered and first forge-works established' },
      { date: 'Year 350, Dimming', event: 'The Great Backlash — a pressure explosion killed forty Fexrick and led to the Safety Codes' },
      { date: 'Year 600, Dimming', event: 'First successful automaton-sentry deployed, revolutionizing gulch security' }
    ]
  },
  subLocations: [
    {
      id: 'the-prototyping-floor',
      name: 'The Prototyping Floor',
      type: 'market',
      description:
        'The largest open space in the gulch — a floor of worked stone where Fexrick artisans demonstrate new inventions to potential buyers. The floor is chaotic: automaton prototypes walk, crawl, and occasionally explode; weapon demonstrations draw crowds; and the Chief Artificer holds court from a raised platform at the far end.',
      proprietor: 'Fexrick Artisans\' Guild',
      notableFeatures: [
        'The Patent Board: a massive iron wall where Fexrick register new inventions by nailing mechanical drawings to its surface',
        'The Testing Range: a reinforced section where weapon and automaton prototypes are demonstrated (protective goggles required)'
      ]
    },
    {
      id: 'the-deep-forge',
      name: 'The Deep Forge',
      type: 'fortification',
      description:
        'The geothermal forge at the ravine\'s lowest point, where the most sensitive and dangerous work is done. The forge is powered directly by volcanic steam at pressures that would kill an unprotected worker. Only Fexrick with guild-certified pressure-suit training are permitted below the third catwalk.',
      proprietor: 'Chief Artificer',
      notableFeatures: [
        'The Pressure-Chamber: a sealed room where alloys are forged under extreme geothermal pressure — producing metals found nowhere else',
        'The Core-Tap: a bore-hole reaching into the mountain\'s volcanic heart, capped with Fexrick pressure-regulation technology'
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
    { destinationId: 'frostmaw-holdfast', distance: '8 miles', travelTime: '4 hours', route: 'Mountain ledge-path, maintained by Fexrick bridge-engineers' },
    { destinationId: 'sump-galleries', distance: '5 miles', travelTime: '2 hours', route: 'Underground steam-tunnel (dangerous — toxic gas pockets)' }
  ],
  classPresence: ['chronarch', 'gambit', 'spellguard', 'warden'],
  npcs: []
};

// =============================================================================
// ICEHEART SEA — Spindrift Lagoon (deep)
// =============================================================================
DEEP_LOCATIONS['spindrift-lagoon'] = {
  heraldry: {
    iconUrl: '/assets/heraldry/spindrift-lagoon.png',
    colors: { primary: '#0a4a6a', secondary: '#4acaca' },
    description: 'A coral reef glowing blue-green beneath crystalline water'
  },
  population: 250,
  dominantRaces: ['Myrathil Breakers-Born', 'Merryn humans'],
  leadership: {
    type: 'council',
    title: 'Reef-Mother',
    leaderId: null,
    description:
      'Spindrift Lagoon is governed by the Reef-Mother — the eldest Breakers-Born Myrathil coral-tender, whose authority derives from her intimate knowledge of the reef ecosystem. The Reef-Mother controls harvesting quotas, diving permissions, and settlement boundaries. She communicates primarily through the bioluminescent patterns of her own crystalline skin.'
  },
  defenses: {
    militiaSize: 20,
    fortifications:
      'The coral reef itself is the defense — a living wall of fire-coral and crystalline formations that surrounds the lagoon. The entrance channel is narrow and navigable only by captains who know the bioluminescent marker-patterns. Myrathil divers can collapse sections of the reef in emergencies.',
    watchPresence: 'Breakers-Born sentinels swim the reef perimeter in rotating shifts, their bioluminescence pulsing in coded patterns'
  },
  economy: {
    primary: 'Bioluminescent organism harvesting',
    secondary: ['Coral-architecture construction', 'Thermal crystal extraction', 'Underwater navigation consultation'],
    status: 'thriving'
  },
  atmosphere: {
    mood:
      'Serene and otherworldly. Spindrift Lagoon is the most beautiful settlement in the Iceheart Sea — warm water, living light, and coral formations that defy geometry. The Myrathil move through the water with the grace of born swimmers, and the Merryn dock-workers have learned to match their calm.',
    architecture:
      'Half the settlement is underwater — Myrathil coral-grown chambers beneath the lagoon\'s surface, illuminated by cultivated bioluminescence. The surface structures are Merryn-built: wooden platforms and houseboats anchored to the reef. The two halves coexist naturally, connected by diving bells and rope-ladders.',
    sounds:
      'The constant lapping of warm water against coral, the clicking of Myrathil sonar-communication, the creak of Merryn boats, the bubbling of thermal vents, and the distant song of Deep-Born Myrathil during the Drowning Rites.',
    smells:
      'Salt water, warm coral, the faint sweet scent of bioluminescent organisms, and the mineral-rich steam from thermal vents.',
    lighting:
      'Bioluminescent blue-green light from the coral reef provides the primary illumination — the entire lagoon glows at night, visible for miles across the frozen sea. The effect is breathtaking. Surface fires and lanterns provide warm accents. The interplay of blue-green from below and orange-gold from above creates a dual-toned world.'
  },
  history: {
    founded: 'Year 55 of the Dimming',
    foundedBy: 'Myrathil Breakers-Born',
    foundingStory:
      'The lagoon was discovered by Breakers-Born Myrathil following a thermal current that cut through the frozen sea like a warm scar. They found a volcanic hotspot where coral had survived the Deepening, sheltered by the unique thermal dynamics. The Breakers-Born have tended the reef ever since, building a settlement that exists in harmony with the living organisms that power it.',
    significantEvents: [
      { date: 'Year 55, Dimming', event: 'First coral-chamber grown; the Breakers-Born established the Reef Compact' },
      { date: 'Year 180, Dimming', event: 'Merryn traders arrived; negotiated a co-habitation agreement' },
      { date: 'Year 440, Dimming', event: 'A coral blight threatened the reef — the Reef-Mother sacrificed her voice to save it, communicating only through bioluminescence thereafter' }
    ]
  },
  subLocations: [
    {
      id: 'the-coral-gardens',
      name: 'The Coral Gardens',
      type: 'market',
      description:
        'An underwater marketplace grown from living coral, where Myrathil artisans sell bioluminescent organisms, thermal crystals, and coral-sculpted tools. Buyers wear diving helmets or are Myrathil — the market operates entirely beneath the surface. Transactions are conducted through bioluminescent pulse-codes and hand-signals.',
      proprietor: 'Breakers-Born Artisans',
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
        'The Merryn-built surface layer of the settlement — wooden docks, houseboats, and trading posts where surface-dwellers conduct business without getting wet. The docks are the primary point of contact between the lagoon and the outside world.',
      proprietor: 'Merryn Dock-Master',
      notableFeatures: [
        'The Diving Bell Station: a mechanical lift that lowers surface-dwellers to the coral-gardens in a sealed brass bell',
        'The Glow-Market: a surface stall selling prepared bioluminescent lanterns and light-sources to visiting ships'
      ]
    }
  ],
  connectedMaps: [],
  factionPresence: [
    { factionId: 'myrathil-breakers-born', influence: 'dominant', description: 'Custodians of the reef and primary producers' },
    { factionId: 'merryn-traders', influence: 'moderate', description: 'Handle all surface trade and shipping logistics' },
    { factionId: 'house-mereval', influence: 'minor', description: 'Maintain a trade representative for luxury bioluminescent goods' }
  ],
  travelConnections: [
    { destinationId: 'merrowport', distance: '150 miles', travelTime: '3 days by sea', route: 'The Warm Current — a reliable thermal lane through the ice' },
    { destinationId: 'deepwell-archipelago', distance: '40 miles', travelTime: '8 hours by ship', route: 'Submerged reef-tunnels connect to the archipelago' }
  ],
  classPresence: ['warden', 'spellguard', 'toxicologist'],
  npcs: []
};

// =============================================================================
// SUNDRIFT VALE — Starfall Vale (deep)
// =============================================================================
DEEP_LOCATIONS['starfall-vale'] = {
  heraldry: {
    iconUrl: '/assets/heraldry/starfall-vale.png',
    colors: { primary: '#2a1a4a', secondary: '#7a5aaa' },
    description: 'A crystalline shard embedded in dark earth, emanating pale starlight'
  },
  population: 150,
  dominantRaces: ['Astril Sylen', 'Ordan humans'],
  leadership: {
    type: 'religious',
    title: 'Star-Oracle',
    leaderId: null,
    description:
      'Starfall Vale is governed by the Star-Oracle — a Sylen Astril whose constellation-spirit has achieved the deepest symbiosis, granting them prophetic visions tied to the crystalline shards. The Oracle\'s authority is spiritual rather than political, but in a settlement built around pilgrimage, spiritual authority is absolute.'
  },
  defenses: {
    militiaSize: 10,
    fortifications:
      'The vale\'s natural geography provides protection — steep walls of dark stone rise on all sides, broken only by narrow paths. The crystalline shards emit a faint radiation that Wyrd-creatures instinctively avoid, creating an invisible barrier.',
    watchPresence: 'Sylen Astril sentinels meditate at the vale\'s entrances, their constellation-spirits alerting them to approaching threats'
  },
  economy: {
    primary: 'Pilgrimage and spiritual tourism',
    secondary: ['Crystalline shard harvesting (strictly regulated)', 'Oracle-readings and prophecy', 'Starlight-touched crafting materials'],
    status: 'stable'
  },
  atmosphere: {
    mood:
      'Reverent, hushed, and luminous. Starfall Vale is the closest thing the starless world has to a cathedral of light. The crystalline shards glow with trapped starlight — fragments of Sol\'s celestial court that fell to earth during the Breach. Even the most cynical visitors lower their voices. The light is simply too beautiful to shout over.',
    architecture:
      'Minimal and organic — Ordan yurts and Astril crystal-tents arranged around the vale\'s central shard-field. No permanent stone structures; the Astril believe building in stone would insult the starlight. The Ordan herders maintain the paths and supply the settlement with food.',
    sounds:
      'The harmonic hum of the crystalline shards — each produces a unique tone, and the cumulative effect is an endless, shifting chord that resonates in the chest. Wind through the vale. The soft chanting of Sylen pilgrims. The distant lowing of Ordan herds on the steppe above.',
    smells:
      'Ozone — the sharp, clean scent of the sky before a storm, present constantly. Crushed herbs from Ordan cooking fires. The faint metallic scent of the crystalline shards, like licking a coin.',
    lighting:
      'The crystalline shards provide all illumination — a soft, silver-white glow that intensifies at night and dims during the day. The effect is starlight made solid. Sylen Astril navigate by reading the glow-patterns, which shift subtly with the season and the state of the Astril\'s constellation-spirits.'
  },
  history: {
    founded: 'Year 1 of the Dimming',
    foundedBy: 'Sylen Astril',
    foundingStory:
      'When Sol was bound and the Breach shattered the celestial court, the constellation-spirits that survived fled downward, seeking refuge in the bloodlines of the steppe peoples. The physical residue of their fall — crystalline shards of condensed starlight — impacted the earth here, creating a crater that the Sylen Astril found within hours of the event. They have never left.',
    significantEvents: [
      { date: 'Year 1, Dimming', event: 'The Starfall — constellation-spirit residue impacts the steppe; Sylen Astril claim the site within hours' },
      { date: 'Year 100, Dimming', event: 'First Oracle-vision recorded — a prophecy of the Sundered Monoliths' },
      { date: 'Year 480, Dimming', event: 'Ordan herders granted grazing rights in exchange for provisioning the pilgrimage route' }
    ]
  },
  subLocations: [
    {
      id: 'the-shard-field',
      name: 'The Shard-Field',
      type: 'temple',
      description:
        'The central crater floor, carpeted with thousands of crystalline shards ranging from grain-sized to massive pillars thirty feet tall. The largest shards pulse with trapped starlight, their tones harmonizing in a chord that the Sylen call the Memory of Sol. Pilgrims walk barefoot through the field, believing the starlight heals the spirit.',
      proprietor: 'Sylen Astril',
      notableFeatures: [
        'The First Shard: the largest crystal, at the crater\'s center — it produces a tone that resonates with every constellation-spirit simultaneously',
        'The Oracle\'s Seat: a natural depression in the First Shard where the Star-Oracle sits to receive visions'
      ]
    },
    {
      id: 'the-pilgrims-rest',
      name: "The Pilgrims' Rest",
      type: 'tavern',
      description:
        'An Ordan yurt erected at the vale\'s entrance, providing food, shelter, and fermented mare\'s milk to arriving pilgrims. The yurt is surprisingly comfortable — thick wool walls, warm hearth-fires, and a ceiling painted with a star-chart that depicts the sky as it was before the Deepening.',
      proprietor: 'Ordan Host-Family (rotating)',
      notableFeatures: [
        'The Star-Ceiling: a painted representation of the pre-Breaching sky — the only complete record of how constellations appeared when Sol still shone',
        'The Pilgrim Register: a ledger of every visitor to the vale, dating back centuries — some names have been crossed out, their entries annotated with a single word: "consumed"'
      ]
    }
  ],
  connectedMaps: [],
  factionPresence: [
    { factionId: 'astril-sylen', influence: 'dominant', description: 'Spiritual custodians and primary inhabitants' },
    { factionId: 'ordan-nomads', influence: 'moderate', description: 'Provide provisions and maintain the pilgrimage route' },
    { factionId: 'unlit-veil', influence: 'minor', description: 'Maintain a discrete observation post — monitoring the Oracle\'s prophecies for actionable intelligence' }
  ],
  travelConnections: [
    { destinationId: 'synod-hold', distance: '30 miles', travelTime: '2 days', route: 'The Star-Path — marked by standing stones that hum in harmony with the shards' },
    { destinationId: 'ancestor-wold', distance: '15 miles', travelTime: '1 day', route: 'Open steppe — guided by the hum of the ancestral mounds' }
  ],
  classPresence: ['augur', 'falseProphet', 'warden'],
  npcs: []
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
