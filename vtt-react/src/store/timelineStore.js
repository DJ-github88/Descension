import { create } from 'zustand';

const CHRONOLOGY_ERA_DISPLAY = [
  {
    "id": "before-deepening",
    "name": "The Primordial Dawn",
    "yearRange": "Pre-Year 0",
    "description": "Before celestial pacts or feudal houses, mortals survived on forged cold iron, black powder matchlocks, and folk taboos to appease wild elemental beasts."
  },
  {
    "id": "star-fall-binding",
    "name": "The Star-Fall & Great Binding",
    "yearRange": "Years 0–300",
    "description": "Aex and Aelden conceal the unhatched infant sun inside the volcanic mantle. The noble houses bind their bloodlines to anchor the thermal shell."
  },
  {
    "id": "ingress-breach",
    "name": "The Ingress & Blizzard's End",
    "yearRange": "Years 300–325",
    "description": "Keth Amar infiltrates the houses and strikes at Nordhalla. Aex shatters into glowing crystal shards, and Keth Amar is driven into the sky as the Wyrd."
  },
  {
    "id": "freezing-era",
    "name": "The Freezing Era & Present Day",
    "yearRange": "Years 325–475",
    "description": "Trapped in a 150-year ice age, rival factions wage trench wars over glowing Aex Shards for thermal fuel while masked cultists search for counterfeit monoliths."
  }
];

const MYTHRILL_CALENDAR = {
  "weekLength": 10,
  "weeksPerMonth": 3,
  "monthsPerYear": 12,
  "daysPerMonth": 30,
  "months": [
    {
      "id": 1,
      "name": "First Thaw",
      "season": "false-spring",
      "description": "The month when the ice cracks but does not break: historically, the first sign of the pulse that never came"
    },
    {
      "id": 2,
      "name": "The False Dawn",
      "season": "false-spring",
      "description": "A brief lightening of the sky: the failed pulse. The Mother sang thirteen times. Now she is silent. The Augurs still track the output."
    },
    {
      "id": 3,
      "name": "The Bound Sun",
      "season": "false-spring",
      "description": "The month of Sol's entombment beneath Sundale. Solemn fasts mark the scaffold-month of every dark bargain."
    },
    {
      "id": 4,
      "name": "Ashfall",
      "season": "embers",
      "description": "Volcanic ash drifts north from Sundale, coating the snow grey. The Solari read ash-patterns as prophecy."
    },
    {
      "id": 5,
      "name": "Emberwake",
      "season": "embers",
      "description": "Geothermal vents surge: the warmest month, though still below freezing. Smiths work double shifts."
    },
    {
      "id": 6,
      "name": "Cinderwane",
      "season": "embers",
      "description": "Even the residual volcanic glow begins to fade; the darkest month. The Day of the Shattering falls here: when Keth-Amar consumed the heirs."
    },
    {
      "id": 7,
      "name": "First Frost",
      "season": "deepening-winter",
      "description": "The cold intensifies; livestock must be brought underground. The Freeze-Front advances measurably."
    },
    {
      "id": 8,
      "name": "Hunger Moon",
      "season": "deepening-winter",
      "description": "Food stores run low; the month when most deaths occur. Cultural memory of the Hunger Winter that birthed the Berserkers."
    },
    {
      "id": 9,
      "name": "The Long Dark",
      "season": "deepening-winter",
      "description": "The longest nights; families gather in sump-halls for warmth. The Vreken claim the death-trails burn brightest in this month."
    },
    {
      "id": 10,
      "name": "The Star Count",
      "season": "deepening-winter",
      "description": "Astril heritage-readers gather to count the remaining visible lights in the sky: a census of what Keth-Amar has not yet consumed."
    },
    {
      "id": 11,
      "name": "Midwinter",
      "season": "deepening-winter",
      "description": "The solstice; children born in this month are said to carry the Frostmaiden's blessing. The Frost-Tithe is traditionally paid."
    },
    {
      "id": 12,
      "name": "The Creeping Light",
      "season": "false-dawn",
      "description": "The first subtle sign that another pulse will come: or so the priests claim. For thirteen pulses, the priests have been wrong."
    }
  ],
  "eras": [
    {
      "id": "before-deepening",
      "name": "The Primordial Dawn",
      "startYear": null,
      "endYear": 0,
      "description": "Before celestial pacts, mortals survived on cold iron, matchlocks, and taboos to appease wild elemental beasts."
    },
    {
      "id": "star-fall-binding",
      "name": "The Star-Fall & Great Binding",
      "startYear": 0,
      "endYear": 300,
      "description": "The celestial parents hide the infant sun Sol inside the volcanic mantle. The noble houses bind their bloodlines to anchor the thermal shell."
    },
    {
      "id": "ingress-breach",
      "name": "The Ingress & Blizzard's End",
      "startYear": 300,
      "endYear": 325,
      "description": "Keth Amar infiltrates the houses and slaughters the heirs at Nordhalla. Aex shatters into glowing crystal shards, and Keth Amar is driven into the sky."
    },
    {
      "id": "freezing-era",
      "name": "The Freezing Era & Present Day",
      "startYear": 325,
      "endYear": 475,
      "description": "One hundred and fifty years of ice age. Factions wage territorial wars over glowing Aex Shards for thermal fuel while masked cultists search for counterfeit monoliths."
    }
  ],
  "holidays": [
    {
      "id": "binding-day",
      "name": "Day of Binding",
      "date": {
        "month": 3,
        "day": 15
      },
      "description": "Marks the ritual entombment of Sol. Solemn fasts and candle-lighting ceremonies. The Augurs take their annual pulse readings."
    },
    {
      "id": "midwinter",
      "name": "Midwinter Solstice",
      "date": {
        "month": 11,
        "day": 21
      },
      "description": "The longest night. Sacrifices are offered to appease the cold. Children born today are believed blessed: and the Frost-Tithe claims twice as many."
    },
    {
      "id": "first-thaw-vigil",
      "name": "First Thaw Vigil",
      "date": {
        "month": 1,
        "day": 1
      },
      "description": "Families stay awake all night watching for the first crack in the ice: an omen for the year ahead and a cultural echo of watching for the rebirth that never came."
    },
    {
      "id": "breach-day",
      "name": "Day of the Shattering",
      "date": {
        "month": 6,
        "day": 30
      },
      "description": "Commemorates Keth-Amar consuming the six sacrificed heirs. A day of mourning and whispered fears. In Sundale, parents lock their children indoors."
    }
  ]
};

const AEX_SCREAM_PULSES = [
{
"cycle": 1,
"year": 328,
"outputPercent": 40,
"significance": "The first pulse, three years after the Shattering: the scattered shards of the Mother, trying to sing to one another. Measured at 40% intensity. The \"False Dawn\" month is named. The Augurs begin logging."
},
{
"cycle": 2,
"year": 340,
"outputPercent": 38,
"significance": "The decline becomes undeniable. Cassia's successors begin systematic output-logging of every pulse. The first marginal settlements fail."
},
{
"cycle": 4,
"year": 364,
"outputPercent": 35,
"significance": "The \"False Dawn\" month barely lightens. A faction of Solvan Martyrs begins secretly tracking the decline: precursor to the Dawn Vigil."
},
{
"cycle": 6,
"year": 388,
"outputPercent": 33,
"significance": "Barely perceptible warming. The Dawn Vigil formalizes around the promise of reassembly. The learned classes accept the shards are fading."
},
{
"cycle": 7,
"year": 400,
"outputPercent": 30,
"significance": "Erratic output. Some readings contradictory. First evidence of temporal friction contaminating the Augurs' instruments."
},
{
"cycle": 8,
"year": 412,
"outputPercent": 27,
"significance": "Detectable only by Augur instruments. The common person no longer sees any warming during the False Dawn. The False Dawn Riots erupt as the promise breaks."
},
{
"cycle": 9,
"year": 424,
"outputPercent": 24,
"significance": "Barely a flicker. Detection now requires precision instruments and elk-blood at the Frozen Archive. The Hollow-Solari have stopped publishing reassurances."
},
{
"cycle": 10,
"year": 436,
"outputPercent": 20,
"significance": "The last detectable pulse. The Mother's voice in the shards is exhausted. The Augurs record: \"The song has stopped.\" No cycle since has produced measurable output."
},
{
"cycle": 11,
"year": 448,
"outputPercent": 15,
"significance": "First fully silent window. The Augurs check instruments three times. Nothing. The False Dawn month brings no warming, not even a flicker. A generation is born that has never felt a pulse."
},
{
"cycle": 12,
"year": 460,
"outputPercent": 8,
"significance": "Silent. The Elder Augurs retire; their successors inherit a data set of silence. Monolith activity increases. Scholars begin to suspect the silence and the waking are connected."
},
{
"cycle": 13,
"year": 475,
"outputPercent": 0,
"significance": "The thirteenth window closes with no output. The elder lunar parasites synchronize across Lunarch hosts, Selene stops speaking, and the Watcher's fracturing accelerates. The Monoliths are waking. The silence is not absence — it is attention."
}
];

const WARMTH_PHASES = [
  {
    "id": "before-deepening",
    "name": "Before the Star-Fall",
    "years": "before Year 0",
    "warmth": "Cosmic abundance. The universe is young, stars burn bright, the deep cold has not yet reached this arm of the Silence.",
    "intrusion": "None. Keth-Amar has not yet noticed this system. The Wyrd does not exist. The cosmic balance is undisturbed.",
    "society": "Pre-history. The Fexric carve their first holdfasts. Sol sleeps unborn in the deep dark of the world. Aex coils around the egg, and Selunis hangs cold and quiet in the sky. There is no Freeze and no Bargain; nothing has yet needed one."
  },
  {
    "id": "false-spring",
    "name": "The False Spring",
    "years": "0-100",
    "warmth": "Volcanic abundance. Emberspire's eruption provides strong geothermal output. Vents are hot. Surface is bitterly cold but survivable near geothermal zones.",
    "intrusion": "Keth-Amar is weak, just starting to feed. Influence is ambient: Wyrd bleeding through the shattered shell, the Frost-Tithe on Rime-Born births, subtle whispers in deep vents.",
    "society": "False optimism: \"Sol will rebirth. This is temporary.\" The seven bargains are struck. Classes form from immediate survival needs. Subraces begin differentiating along regional lines."
  },
  {
    "id": "first-ebbing",
    "name": "The First Ebbing",
    "years": "100-325",
    "warmth": "Declining. Secondary geothermal vents weaken. The first marginal settlements fail. Rebirth windows producing declining output. The Freeze-Front advances slowly.",
    "intrusion": "Growing. Wyrd activity increases in the Frostwood and Bryngloom. The first sustained Wyrd incursions. Whispers reach deeper into the surface. Morvane remains watchful.",
    "society": "Adaptation begins. Institutions form around information preservation (Sovereign Ledger, Scribe-Cartel, Synod). Trade routes establish. First regional conflicts over thermal resources. Classes emerge from adaptation needs."
  },
  {
    "id": "contraction",
    "name": "The Contraction",
    "years": "325-420",
    "warmth": "Significant decline. Major geothermal systems failing. The Freeze-Front advances. Rebirth windows below 15%. Habitable zones visibly contract.",
    "intrusion": "Targeted. Keth-Amar can corrupt specific individuals. Wyrd epidemic in multiple regions. The first \"owned\" agents appear. The Mimir Purge happens. The Vreken Over-Lit epidemic begins. Morvane becomes noticeably distracted.",
    "society": "Survival infrastructure solidifies. The Sovereign Ledger becomes a weapon of social control. Wars break out over thermal resources. Subraces split into castes (Mimir Rupture, Earthen Astril/Stellar Astril schism). Classes form from organized responses to Wyrd and scarcity."
  },
  {
    "id": "squeeze",
    "name": "The Squeeze",
    "years": "420-475",
    "warmth": "Accelerating decline. Major geothermal systems failing across all regions. Sol's Breath's output measurably diminishes (concealed by the Hollow-Solari for three generations). Rebirth windows below 8%.",
    "intrusion": "Coordinated. The Cult of Forgotten Shadow makes two-way contact with the deep dark. Keth-Amar can whisper to specific people across vast distances and corrupt institutions. It speaks through the cracks directly. The dead stir.",
    "society": "Institutions fracture under pressure. The Great Revision rewrites history. The False Dawn Riots shatter the myth of Sol's return. The Over-Shanty becomes a permanent shadow-state. Classes form from desperation and the need to weaponize the Wyrd itself."
  },
  {
    "id": "intrusion",
    "name": "The Intrusion",
    "years": "420-475",
    "warmth": "Terminal decline. Sol's Breath visibly failing. The last detectable pulse produces nothing. Emberspire's vents cooling. The Frost-Tithe worsening.",
    "intrusion": "Active assault. The Monoliths wake. Keth-Amar issues specific instructions through the cracks. It can blind Augurs, silence the sea, animate the dead, and corrupt arch-priests directly. The boundary between life and death weakens. Coordinated assault on the seal.",
    "society": "The present crisis. Civil war in Sundale. The Marching Dead in Bryngloom. The Silent Sea. Temporal contamination. Every bargain is coming due at once. The campaign begins here."
  }
];

const TRADE_ROUTES = [
  {
    "id": "trade-velling-pass",
    "name": "Velling Pass",
    "origin": "greymark-keep",
    "destination": "basalt-shyr",
    "via": [
      "the-shallows",
      "cinder-strait"
    ],
    "cargo": "Frostwood timber, memory-ink, ironwood → Sundale sulfur, volcanic coal, forged arms",
    "established": "Year ~40 (Freezing Era)",
    "status": "active",
    "history": "The oldest overland route. Established by Greymark Keep to trade for Sundale's volcanic warmth. The Scribe-Cartel taxes ink shipments. Florae raiders target timber caravans during the Uprising (Year 350). Contested during the Memory Wars."
  },
  {
    "id": "trade-cinder-strait",
    "name": "Cinder Strait",
    "origin": "basalt-shyr",
    "destination": "merrowport",
    "via": [
      "ember-lagoon"
    ],
    "cargo": "Sundale sulfur, volcanic coal, forged arms, obsidian → Iceheart fish, whale-blubber, storm-glass",
    "established": "Year ~80 (Freezing Era)",
    "status": "active",
    "history": "The volcanic sea-lane connecting Sundale to the Iceheart Sea. Merryn sailors navigate at tremendous risk: boiling water and Cinder-Fiends. The Brine-Bond Syndicate controls Merrowport docking rights. The Basalt Shyr outpost was built specifically to service this route."
  },
  {
    "id": "trade-ancestor-spans",
    "name": "The Ancestor-Spans",
    "origin": "frostmaw-holdfast",
    "destination": "ironjaw-port",
    "via": [
      "deepchasm-keep",
      "gearworks-gulch"
    ],
    "cargo": "Cragjaw minerals, clockwork, alchemical compounds → all regions' raw metals and Fexric goods",
    "established": "Year ~50 (Freezing Era)",
    "status": "active (contested)",
    "history": "The only reliable crossing through the Cragjaw Peaks: built from the calcified bodies of willing Groven dead. Groven toll-keepers charge passage fees. The Toll Wars (Year ~280-340) established Groven sovereign toll-rights. The Steam-Line Cartel taxes geothermal pipeline access along the spans."
  },
  {
    "id": "trade-iceheart-lanes",
    "name": "The Iceheart Storm-Lanes",
    "origin": "merrowport",
    "destination": "fjord-gate",
    "via": [
      "spindrift-lagoon",
      "brinehorse-cove"
    ],
    "cargo": "Iceheart fish, whale-blubber, storm-glass, deep-sea curios → Nordhalla mammoth-furs, glacier-crystals, runic artifacts",
    "established": "Year ~120 (Freezing Era)",
    "status": "active (perilous)",
    "history": "The storm-churned trade lanes connecting the Iceheart Sea to Nordhalla. House Mereval's Sea-Charter guarantees navigable (but never calm) waters. The Luck-Ledger tracks and taxes Merryn sailors' storm-luck. The Brine-Bond Syndicate controls docking rights at Merrowport."
  },
  {
    "id": "trade-bog-route",
    "name": "The Bryngloom Bog-Route",
    "origin": "atropolis",
    "destination": "morrens-bogpost",
    "via": [
      "over-shanty",
      "aran-glen",
      "vel-keth-bayou"
    ],
    "cargo": "Peat-oil, memory-glass, fungal-light exports, ironwood crafts → Sundrift steppe-wool, Astril crystal-lattice fragments",
    "established": "Year ~60 (Freezing Era)",
    "status": "active (smuggler-heavy)",
    "history": "The winding bog-route connecting settled Bryngloom to the Sundrift Vale's border. The Neth Great Registry taxes legitimate trade; the Over-Shanty (founded Year 412) routes black-market goods. Drun outcasts control the peat-harvesting bypass channels."
  },
  {
    "id": "trade-north-south",
    "name": "The Hunger Road",
    "origin": "fjord-gate",
    "destination": "emberspire",
    "via": [
      "skalvyrhold",
      "frostmaw-holdfast",
      "basalt-shyr"
    ],
    "cargo": "Nordhalla mammoth-furs, runic artifacts → Sundale volcanic coal, forged arms",
    "established": "Year ~50 (Freezing Era)",
    "status": "contested",
    "history": "The path the Bloodhammer clans marched south during the Hunger Winter migration. Now a contested refugee and trade route. The Sunder-Wall divides settled Nordhalla from the Fredløse outlaws. The Steam-Line Cartel controls key geothermal resupply points along the route."
  },
  {
    "id": "trade-steppe-circuit",
    "name": "The Steppe Migration Circuit",
    "origin": "synod-hold",
    "destination": "morrens-bogpost",
    "via": [
      "starfall-vale",
      "ancestor-wolds"
    ],
    "cargo": "Steppe-wool, shag-ox herds, Astril crystal-lattice → Bryngloom peat-oil, fungal goods",
    "established": "Year ~25 (Freezing Era)",
    "status": "seasonal",
    "history": "Not a fixed road but the Ordan migration circuit: following the grass-line south before frost claims it and north before the thaw rots it. The Astril elders tax heritage-passage along the route. The Herd-Tithe is exacted by House Ordavan. Every Mound-Camp along the route is a seasonal trading post."
  }
];

const SEEDED_EVENTS = [
  {
    "id": "event-sol-deepening",
    "date": {
      "year": 260,
      "eraId": "star-fall-binding"
    },
    "title": "The First Failing",
    "type": "cosmic",
    "phase": "false-spring",
    "description": "The buried star’s warmth began, slowly, to fail. The vents cooled; the priests preached patience and called it a passing cycle. The Augurs of the binding houses were the first to read the signs in the cooling light. For three years, the families debated while the world froze.",
    "locationIds": [
      "sundale"
    ],
    "factionIds": [
      "house-thalreth",
      "house-skalvyr",
      "house-solvan",
      "house-ordavan"
    ],
    "classIds": [
      "augur"
    ],
    "causes": [],
    "effects": [
      "event-entombment"
    ],
    "narrative": "The warmth thins. What the priests preached as a passing cycle was no cycle at all, but the first shadow cast by the thing already tracking them (the slow leak of the buried star. Across the seven continents, the sudden shift in the light is felt not as a shadow, but as a physical coldness that seeps into the bones. Cassia, a Skald star-watcher at the Frozen Archive in Nordhalla, is the first to read the terrifying portents. Her rune-scarred forearms burn with intense, blistering heat, a feedback loop of visions traded from her own personal memories to glimpse the future. The **Astril**, already present on Mythrill as refugees from the devoured star Lumia, scream silent warnings across the Silence: Keth-Amar has tracked them here. The oldest star-singers watch the northern skies slowly gutter and go dark, knowing what comes next. Even the **Marked Vreken**, deep within the damp fungal abbeys of the Bryngloom, report that the phosphorescent trails left by the dead begin to glow with a frantic, silver heat, signaling that the cosmic balance has been violently upset.",
    "dmHook": "A Doomsayer's journal from this period, preserved in the Greymark archive, contains a prophecy that was never fulfilled: \"When the sun-child weeps, the predator will choke.\" The prophecy was dismissed at the time. It has never been revisited. An Astril Oracle who reads the journal today sees something in the words that no one saw four centuries ago.",
    "dateDisplay": "Year 260, Star-Fall Era"
  },
  {
    "id": "event-entombment",
    "date": {
      "year": 0,
      "eraId": "star-fall-binding"
    },
    "title": "The Entombment of Sol",
    "type": "ritual",
    "phase": "false-spring",
    "description": "The seven noble families pooled their bloodlines to entomb the dying sun beneath Sundale. They anchored the Bargain in the living shell of Aex (Sol's own Mother, a being of pure solar fire who had wrapped herself around the egg), who gave herself willingly. House Solvan led the deepest rites. The ritual exhausted the families and the world began to freeze. The families told the world Sol would sleep and rise again. It was the first lie.",
    "locationIds": [
      "sundale",
      "emberspire-caldera"
    ],
    "factionIds": [
      "house-thalreth",
      "house-skalvyr",
      "house-solvan",
      "house-mereval",
      "house-ordavan",
      "house-tesshan",
      "house-viridane"
    ],
    "classIds": [
      "spellguard",
      "augur"
    ],
    "causes": [
      "event-sol-deepening"
    ],
    "effects": [
      "event-fog-compact",
      "event-glacier-bargain",
      "event-keth-amar-corruption"
    ],
    "narrative": "In an act of desperate, terrifying genius, the seven noble houses of Mythrill pool their bloodlines and forbidden rituals to entomb the dying star beneath the volcanic crust of **Sundale**. High **Inscriptors** engrave the mathematical terms of the binding directly into memory-glass and the burning flesh of volunteers, while massive **Hollow-Solari Titans** stand sentinel along the volcanic catwalks to hold the boundaries. But a cosmic star cannot be bound by stone alone; the seal requires a vessel woven from pure, living solar radiance — the hide of **Aex**, Sol's firstborn. Aex volunteered; no coerced binding could hold a being of pure stellar radiance, and Aex knew this and consented. House **Solvan** wielded a blade of crystallized starlight and flayed Aex's living hide in a single unbroken sheet; the firstborn did not scream but sang — Sol's own frequency, a harmonic matched to the star's death-throes — and that singing hide was woven into the seal while Aex bled stellar plasma onto the ritual ground. (The **Spellguards** of later ages trace their blood-oath to this first sacrificial magic: the acts of arcanists who absorbed the solar backdraft to prevent their lords from being vaporized.) The seal was set, a monumental, one-way vault with no key, protecting the slumbering sun from the Silence at the cost of freezing the surface world.",
    "dmHook": "A fragment of Aex's hide (a scrap that was cut away during the ritual and discarded) survives in a hidden reliquary beneath the Harath-Vault. It still burns. The tending-clan has never told anyone it exists. A Solari Titan who discovers it must choose: reveal the evidence of the original sin, or protect the faith that keeps the forge-clans united.",
    "dateDisplay": "Year 0, Star-Fall Era"
  },
  {
    "id": "event-keth-amar-corruption",
    "date": {
      "year": 310,
      "eraId": "ingress-breach",
      "endYear": 318
    },
    "title": "Keth-Amar Weaves the Corruption",
    "type": "cosmic",
    "phase": "false-spring",
    "description": "Denied its prey by the anchoring, Keth-Amar did not rage, it waited. For twenty-five years, wearing the Father’s stolen face through the noble councils while the vents cooled and children froze and whole villages went silent, the Sun-Eater whispered. Not into the grand halls of the noble houses. Into the kitchens, the nurseries, the night-watches. It whispered into the dreams of fathers who had signed the Great Binding. It showed mothers the faces of their starving children. It offered a simple trade: warmth for blood. The whispers did not compel. they corroded. By Year 11, six noble houses had heard the same offer so many times it no longer sounded like a choice.",
    "locationIds": [
      "sundale",
      "frostwood-reach",
      "nordhalla",
      "cragjaw-peaks",
      "sundrift-vale",
      "iceheart-sea",
      "bryngloom-forest"
    ],
    "factionIds": [
      "house-solvan",
      "house-ordavan",
      "house-mereval",
      "house-tesshan",
      "house-thalreth",
      "house-skalvyr"
    ],
    "classIds": [
      "pyrofiend",
      "martyr"
    ],
    "causes": [
      "event-entombment"
    ],
    "effects": [
      "event-keth-amar-breach"
    ]
  },
  {
    "id": "event-keth-amar-breach",
    "date": {
      "year": 325,
      "eraId": "ingress-breach"
    },
    "title": "Keth-Amar Consumes the Heirs",
    "type": "catastrophe",
    "phase": "false-spring",
    "description": "Six of the seven noble families (their resolve worn hollow by eight years of whispered corruption) marched their firstborn heirs into the dark. Keth-Amar consumed the children not as mere sacrifice but as vessel-keys: the heirs' bloodlines were the original signatures on the binding seal, and by devouring them, Keth-Amar cracked the vault from within. The seal cracked into seven Sundered Monoliths, each screaming with the echo of a stolen life. House Viridane (the seventh house) refused. They fled south through the Frostwood Reach. The six surviving houses struck Viridane's name from every record. Viridane's heir made a counter-bargain with fae entities in the moonlit groves. Their descendants are the Florae.",
    "locationIds": [
      "emberspire-caldera",
      "frostwood-reach",
      "sundrift-vale"
    ],
    "factionIds": [
      "house-thalreth",
      "house-skalvyr",
      "house-solvan",
      "house-ordavan",
      "house-mereval",
      "house-tesshan"
    ],
    "classIds": [
      "martyr",
      "apex"
    ],
    "causes": [
      "event-keth-amar-corruption"
    ],
    "effects": [
      "event-emberspire-eruption",
      "event-church-founding",
      "event-preservation-pact",
      "event-viridane-flight"
    ],
    "narrative": "The sacrifice is a trap. **Keth-Amar** devours the six noble heirs not as food, but as biological **vessel-keys**. Because the children's bloodlines were the literal locks on the original binding seal, the predator uses their consumed essence to crack the vault from the inside. The primary seal shatters with a sound that deafens half the globe, breaking into **7 Sundered Monoliths** that scatter across the continents, each fragment screaming with the psychic agony of a sacrificed child. In the south, **Emberspire** erupts in a cataclysmic blast of black ash and volcanic glass, creating the geothermal vents the houses bargained for, but also releasing the **Wyrd**  -  Keth-Amar's corruption, seeded into folklore during the eight years of whispers, now using human fear as a blueprint. The Wyrd bleeds through the tectonic cracks, inhabiting shared terrors and turning nightmares into physical, hunting predators.",
    "dmHook": "The seventh Monolith is the anomaly. Six children were consumed) where did the seventh fragment come from? The truth is it does not exist: the seventh Monolith is a hollow echo, the shape of a signature that was never made. House Viridane's heir never agreed to the sacrifice, so no piece of Aex corresponds to their bloodline. The Watcher hid this false Monolith within its own territory. Keth-Amar cannot find it — and if it ever does, it will learn it was tricked.",
    "dateDisplay": "Year 310, Ingress"
  },
  {
    "id": "event-emberspire-eruption",
    "date": {
      "year": 325,
      "eraId": "ingress-breach"
    },
    "title": "Emberspire Erupts: The False Spring Begins",
    "type": "catastrophe",
    "phase": "false-spring",
    "description": "Through the wound torn by Keth-Amar's consumption of the heirs, the world-heart volcano Emberspire erupted with a violence that reshaped the sky. Volcanic warmth flooded the frozen surface. The Myrathil spawned from the storm-foam where fire met glacial sea. The Solari, who had sheltered in the thermal caverns since before the Great Binding, emerged into the ash-choked light. For the first time since Sol died, the surface was warm: not warm like summer, but warm enough that a person could stand outside and not die within the hour. The False Spring had begun.",
    "locationIds": [
      "sundale",
      "emberspire-caldera",
      "iceheart-sea"
    ],
    "factionIds": [
      "house-solvan"
    ],
    "classIds": [
      "pyrofiend"
    ],
    "causes": [
      "event-keth-amar-breach"
    ],
    "effects": [
      "event-first-rebirth",
      "event-myrathil-spawning"
    ]
  },
  {
    "id": "event-myrathil-spawning",
    "date": {
      "year": 325,
      "eraId": "ingress-breach"
    },
    "title": "The Myrathil Spawn",
    "type": "cosmic",
    "phase": "false-spring",
    "description": "When Emberspire erupted and bled volcanic fury into the frozen oceans, the violent clash of fire and ice churned the seas into living foam. Mareth (the ocean's attempt at personhood) gave that foam the will to stand and walk. The Shore emerged first: shore-spawned from the collision of wave and rock. They would become the ambassadors, the most numerous Myrathil. The Deep and Brook would emerge centuries later as the oceans reached equilibrium and inland exploration began.",
    "locationIds": [
      "iceheart-sea"
    ],
    "factionIds": [],
    "classIds": [],
    "causes": [
      "event-emberspire-eruption"
    ],
    "effects": [
      "event-deep-born-emerge",
      "event-brook-emerge"
    ],
    "narrative": "As the cataclysmic ash-cloud of Emberspire's eruption hits the freezing oceans, it triggers a global ecological event. The violent collision of superheated volcanic lava-flows and melting glacial runoff creates massive, miles-wide fields of warm oceanic foam along every coastline. These are the perfect, fertile conditions for the spawning of the **Myrathil**. In a single season of steam and storm, thousands of foam-born infants wash onto the beaches of the Iceheart Sea. **Mareth**, the vast semi-conscious intelligence of the deep, watches her new children emerge with glowing bioluminescent veins and webbed fingers. She does not speak to them, but she guides the currents to protect them, shaping the **Shore** to navigate the floating ports, the **Deep** to tend the oceanic trenches, and the **Brook** to explore the inland waters as her silent, watery eyes.",
    "dmHook": "The spawning explosion wasn't random. Mareth deliberately created the conditions (a response to the Shattering, an immune reaction of the ocean itself. The Myrathil are her antibodies, grown to fight a spiritual infection. But Mareth cannot tell them this directly. She can only send more storms, more foam, more children) and hope they figure out what they were born to do.",
    "dateDisplay": "Year 325, Blizzard's End"
  },
  {
    "id": "event-viridane-flight",
    "date": {
      "year": 325,
      "eraId": "ingress-breach"
    },
    "title": "The Refusal of House Viridane",
    "type": "political",
    "phase": "false-spring",
    "description": "When the other six houses marched their children north, House Viridane did not. Something had reached them before the Sun-Eater's whispers could take hold, a presence in the mist, watching from the moonlit groves, older than Keth-Amar's hunger and more patient. They fled south through the Frostwood Reach while sacrifice fires still burned, carrying children hidden beneath cloaks woven from the hair of their own dead. The six houses, unable to complete the binding ritual with only six signatures, elevated House Morrath as a substitute seventh and began the centuries-long project of erasing every trace of Viridane. For fourteen years between their elevation and the First Contract, House Morrath administered basic survival. resource distribution, defense, and refugee settlement: while the Neth scribe-clan negotiated the pact that would define the region.",
    "locationIds": [
      "frostwood-reach",
      "ironwood-heart"
    ],
    "factionIds": [
      "house-viridane"
    ],
    "classIds": [
      "lunarch"
    ],
    "causes": [
      "event-keth-amar-breach"
    ],
    "effects": [
      "event-florae-shorn"
    ],
    "narrative": "Not all houses capitulate to the predator's whispers. **House Viridane**, the seventh original signatory, refuses. Declaring the bargain an act of unforgivable cowardice, they flee south through the freezing trails of the Frostwood Reach, pursued relentlessly by the soldiers of the six houses who seek to silence their dissent. The six houses, needing a complete set of signatures to maintain the fiction of the seal, elevate House Morrath as a replacement seventh house and begin the centuries-long project of erasing every trace of Viridane. Cornered in the deepest, oldest groves where the memory-fog thins, the survivors make a desperate counter-bargain with ancient, primordial fae entities of the wildwood. The **Florae** are born from this magical transformation: their human flesh merges with the petrified briars, growing sharp wood-thorns where hair should be. The Florae later call themselves the \"eighth house\" — counting Viridane as the true seventh and themselves as the living proof that one house refused — but from an objective standpoint, only seven houses ever signed the Great Binding.",
    "dmHook": "The original fae contract still exists: a living document grown from thorn-vine and moonlight, buried beneath the oldest Florae grove. It can be read, but only by a Florae Lunarch during a lunar eclipse. The contract contains a clause that the Florae have never invoked: the fae entities owe House Viridane a debt that has never been collected.",
    "dateDisplay": "Year 325, Blizzard's End"
  },
  {
    "id": "event-first-rebirth",
    "date": {
      "year": 328,
      "eraId": "freezing-era"
    },
    "title": "The First Failed Rebirth: 40%",
    "type": "cosmic",
    "phase": "false-spring",
    "description": "Three years after the Shattering, the first pulse arrived: the scattered shards of the Mother, trying to sing to one another. For three days, the sky lightened — the False Dawn, the month named for this event. The Augurs at the Frozen Archive measured: 40% intensity. The first quantifiable data point in what would become a 13-pulse record of decline. The calendar month \"The False Dawn\" and the \"First Thaw Vigil\" holiday are cultural echoes of this moment. People still watch for a pulse that was never a rebirth.",
    "locationIds": [
      "frozen-archive",
      "sundale"
    ],
    "factionIds": [],
    "classIds": [
      "augur"
    ],
    "causes": [
      "event-emberspire-eruption"
    ],
    "effects": [
      "event-augur-collapse"
    ]
  },
  {
    "id": "event-fog-compact",
    "date": {
      "year": 50,
      "eraId": "star-fall-binding"
    },
    "title": "The Fog Compact",
    "type": "pact",
    "phase": "false-spring",
    "description": "House Thalreth sealed the Fog Compact, trading the Frostwood Reach's spatial clarity for an insulating fog that would prevent the ironwood forests and their native beasts from freezing into glass. The fog devours memory over generations: a slow erasure that the Thalren combat with chained journals and the Scribe-Sentinels' ledgers. The first Scribe-Sentinels were founded within the year.",
    "locationIds": [
      "greymark-keep",
      "scribes-tower",
      "frostwood-reach"
    ],
    "factionIds": [
      "house-thalreth",
      "scribe-sentinels"
    ],
    "classIds": [
      "apex"
    ],
    "causes": [
      "event-entombment"
    ],
    "effects": [
      "event-sovereign-ledger",
      "event-ledger-collapse"
    ]
  },
  {
    "id": "event-glacier-bargain",
    "date": {
      "year": 55,
      "eraId": "star-fall-binding"
    },
    "title": "The Skalvyr Glacier Bargain",
    "type": "pact",
    "phase": "false-spring",
    "description": "As titanic glaciers advanced to grind Nordhalla's mountain keeps into dust, House Skalvyr heeded Keth-Amar's whispers and struck the Glacier Bargain to freeze the ice sheets in place. Keth-Amar accepted but decreed that summer would never return to the north as the price for the halted glaciers. Keth-Amar set the Frost-Tithe on Rime-Born births (the bargain's interest, a supernatural birth-curse where every frost-touched child draws the mother's warmth to survive. The Hunger Winter that followed was so absolute that Skald ancestors consumed their own dead) the first seed of the Hunger Pact that would later ignite the Berserker rage.",
    "locationIds": [
      "frozen-archive",
      "fjord-gate",
      "skadis-col"
    ],
    "factionIds": [
      "house-skalvyr"
    ],
    "classIds": [
      "berserker",
      "augur"
    ],
    "causes": [
      "event-entombment"
    ],
    "effects": [
      "event-hunger-winter"
    ],
    "narrative": "As glaciers advance to threaten their mountain keeps, House Skalvyr strikes the **Glacier Bargain** on Keth-Amar's terms to freeze the ice sheets in place. The glacier is halted, but Keth-Amar decrees that summer will never return to Nordhalla. Construction begins on the Frozen Archive, carved into the living glacier to preserve Skald ancestry and history.",
    "dmHook": "The first chisel stroke of the Archive struck a pocket of liquid rime-plasma that has remained active. A character who drinks this plasma gains absolute recall of their ancestors' memories but suffers permanent frostbite in one limb.",
    "dateDisplay": "Year 328, Freezing Era"
  },
  {
    "id": "event-hunger-winter",
    "date": {
      "year": 60,
      "eraId": "star-fall-binding",
      "endYear": 63
    },
    "title": "The Hunger Winter",
    "type": "disaster",
    "phase": "false-spring",
    "description": "The first winter after the Glacier Bargain was so absolute that Nordhalla's Skald ancestors consumed their own dead to survive: a three-year blizzard that burned the practice into cultural memory and genetic inheritance. This act became the Hunger Pact: the cellular residue of ancestral cannibalism that, generations later, would ignite as the Blood-Heat in Grum Bloodhammer's veins. The Rime-Born began evolving from the refugees who survived, carrying the Frost-Tithe curse in their blood.",
    "locationIds": [
      "nordhalla",
      "fjord-gate"
    ],
    "factionIds": [
      "house-skalvyr"
    ],
    "classIds": [
      "berserker"
    ],
    "causes": [
      "event-glacier-bargain"
    ],
    "effects": [
      "event-bloodhammer-migration"
    ],
    "narrative": "The binding of Sol brings no relief; the Long Winter descends, and the surface world enters a state of permanent, agonizing twilight. Crops turn to black iron-hard ash in the fields, and glaciers grind past the northern gates of Nordhalla. Children freeze in their cradles, and the desperate **Skald Humans** measure their survival in body-counts. Within the Over-Shanties at the gates of the Vreken abbeys, the star-starved refugees turn to eating raw ghost-mycelium, triggering the first outbreaks of the mind-consuming \"hush\" addiction. Frustrated by the absolute seal of Aex's hide, **Keth-Amar** turns its attention to the starving rulers. It whispers to the desperate patriarchs of the six houses (not in spoken words, but in overwhelming mental impressions of roaring coal-fires, volcanic vents cracking the frozen earth, and warm soil. The predator's price is absolute and horrific: the **firstborn heirs** of each noble house must be surrendered to Keth-Amar.",
    "dmHook": "The whispers were not heard equally. Some nobles reported hearing nothing at all) only a growing, gnawing certainty that their children would save them. The Doomsayers who recorded this phenomenon called it \"the predator's logic\": a form of psychic manipulation that bypassed language entirely. A character with psychic sensitivity who enters the Frostwood Reach's deep fog may hear residual echoes of these whispers, still reverberating after a century and a half.",
    "dateDisplay": "Year 60, Star-Fall Era"
  },
  {
    "id": "event-remaining-bargains",
    "date": {
      "year": 65,
      "eraId": "star-fall-binding",
      "endYear": 103
    },
    "title": "The Remaining Bargains Struck",
    "type": "pact",
    "phase": "false-spring",
    "description": "House Ordavan traded the Sundrift Vale's fertile soil for endless migration and grass that always returned. The sky went dark (the fragments of Lumia's biosphere fled the slaughter and the Astril ancestors volunteered as living vessels. House Mereval traded the Iceheart's calm for navigable) and perpetually storm-lashed, sea lanes. House Tesshan traded the Cragjaw's visibility for an eternal blizzard-veil. In the Bryngloom, the Neth ancestors, an ancient canopy-dwelling civilization facing extinction from mysterious fertility decline, communed with Morvane through their Augurs. Morvane granted them the Font Vessel for the hidden Well of Youth. The Three Trials at the Well would soon split the Neth into three bloodlines.",
    "locationIds": [
      "sundrift-vale",
      "iceheart-sea",
      "cragjaw-peaks",
      "bryngloom-forest",
      "atropolis"
    ],
    "factionIds": [
      "house-ordavan",
      "house-mereval",
      "house-tesshan"
    ],
    "classIds": [],
    "causes": [
      "event-emberspire-eruption"
    ],
    "effects": [
      "event-astril-first-vessels",
      "event-first-contract"
    ]
  },
  {
    "id": "event-astril-first-vessels",
    "date": {
      "year": 0,
      "eraId": "star-fall-binding"
    },
    "title": "The Astril First Vessels",
    "type": "cultural",
    "phase": null,
    "description": "Refugees from the devoured star Lumia, the Astril fled across the void carrying fragments of their dead world's biosphere in their blood. They reached Mythrill before the Great Binding, carrying a warning: Keth-Amar was on their trail. They settled the Sundrift Vale, where their alien biology — pale skin, reptilian eyes, and unique crystalline markings — set them apart from the native peoples. The Ordan, who sang the old migration routes for centuries, regarded these newcomers with wary curiosity. Every Astril child is born with Lumia's heritage woven into their bloodlines, an inheritance that cannot be chosen or refused. The markings are personal, unique to each Astril, faintly luminous only in complete darkness — a biological echo of a dead star, not a moral compass.",
    "locationIds": [
      "sundrift-vale",
      "starfall-vale"
    ],
    "factionIds": [
      "house-ordavan"
    ],
    "classIds": [
      "augur"
    ],
    "causes": [],
    "effects": [
      "event-synod-founded",
      "event-astril-schism",
      "event-sol-deepening"
    ],
    "narrative": "The fragments of Lumia's biosphere, the living memory of a world that died before Mythrill's sky went dark, descend to Mythrill before the Great Binding, finding sanctuary in willing human herders and throat-singers of the Sundrift Vale. The **Astril** are born: mortals whose skin bears shimmering, luminous patterns that ebb and flow with faith and emotion. They are not passengers; they are refugees carrying the memories of a world that once held light. The Astril elders govern the community as a loose council of the oldest bloodlines, though the singers watch in silent despair as the oldest memories fade one by one. Unknown to most, their flight across the void led Keth-Amar directly to Sol.",
    "dmHook": "One fragment of Lumia refused to enter a vessel. It remains in the Silence above Mythrill (the last light visible in the starless sky. The Astril call it \"the Remnant.\" It has been growing brighter for the past decade. The Astril elders refuse to acknowledge this. An Astril Oracle who looks directly at the Remnant receives visions that no other Oracle can access) but the heritage within them screams the entire time.",
    "dateDisplay": "Year 65, Star-Fall Era"
  },
  {
    "id": "event-first-contract",
    "date": {
      "year": -40,
      "eraId": "before-deepening"
    },
    "title": "The First Contract",
    "type": "pact",
    "phase": "false-spring",
    "description": "The High Neth Augurs of the Bryngloom, watching their civilization's fertility decline, journeyed to the deep wood and communed with Morvane. The forest spirit granted them the Font Vessel: a pristine receptacle to be filled at the hidden Well of Life. During the quest, two rogue factions betrayed the mission: pragmatic conspirators switched the vessel for a corrupt siphoning replica, and power-hungry magi drank raw cosmic magic directly from the Well. When the loyalists restored order and filled the vessel with reverence, Morvane's magic executed absolute judgment within a week, permanently dividing the Neth into High Neth (the loyalists with porcelain lines), Grave Neth (the conspirators made into severed shadow-brokers and cold undead), and Hallowed Neth (the profane bound as spirit conduits).",
    "locationIds": [
      "bryngloom-forest",
      "atropolis"
    ],
    "factionIds": [],
    "classIds": [
      "arcanoneer"
    ],
    "causes": [
      "event-remaining-bargains"
    ],
    "effects": [
      "event-contraction-traditions"
    ],
    "narrative": "The **Neth**, an ancient canopy-dwelling people, face slow extinction as fewer and fewer children are born. Through intense devotion, their **Augurs** commune with Morvane, the death-boundary entity of the Bryngloom, and receive the **Font Vessel**. The Augurs are told to fill it at the hidden **Well of Life**. But three factions trail the Augur: the loyalists (future **High Neth**) who intend to honor the deal; the conspirators (future **Grave Neth**) who secretly switch the vessel with a corrupt siphoning replica; and the profane magi (future **Hallowed Neth**) who bypass the vessels entirely and drink raw cosmic magic directly from the Well. When the loyalists restore order and fill the true vessel with reverence, Morvane's judgment descends within a week, permanently marking every bloodline.",
    "dmHook": "The Font Vessel still exists, preserved in the heartwood of Atropolis. It is a living relic (it remembers who touched it honestly and who came with corruption in their hands. A Neth character who touches it sees echoes of that fateful week: three paths diverging at one Well, and Morvane's judgment descending like a blade.",
    "dateDisplay": "Before the Star-Fall"
  },
  {
    "id": "event-vat-breakers-revolt",
    "date": {
      "year": 75,
      "eraId": "freezing-era"
    },
    "title": "The Vat-Breakers' Revolt",
    "type": "conflict",
    "phase": "false-spring",
    "description": "The Fexric Deep Alchemists' vat-grown servitors (the Groven, shaped from captured Thrumm broodlings) shattered their containment vats at Frostmaw Holdfast and rose. Led by Subject Len-7, the first generation of Groven slaughtered their captors and fled into the upper crags. In the chaos, dozens of broodlings (the Lost Brood) were left behind in deeper vats. The deep alchemists tightened security and moved operations into tunnels the Groven could never find. The debt has never been repaid. Over subsequent generations, the Groven developed the Still-Claiming: the calcification of their dead into permanent stone, which they used to build the Ancestor-Spans: the only bridges across the Cragjaw's chasms.",
    "locationIds": [
      "cragjaw-peaks",
      "frostmaw-holdfast"
    ],
    "factionIds": [
      "deep-alchemists",
      "vat-breakers-guild"
    ],
    "classIds": [
      "warden"
    ],
    "causes": [
      "event-remaining-bargains"
    ],
    "effects": [],
    "narrative": "Driven by the industrial demands of their subterranean galleries, **Fexric Deep Alchemists** capture primitive **Thrumm** broodlings from the lower crags. Seeking to refine their mineral hides into flexible labor frames, they inject them with alchemical serums, triggering the catastrophic *Smoothing Plague*. The experiment goes out of control: the trolls' rigid stone-hide refines into fine, overlapping scales, their thick limbs lengthen to span bottomless chasms, and a higher, desperate cognition awakens in their minds. The first **Groven** (the Vat-Breakers) break their alchemical chains, shatter the spawning vats, and flee upward into the high crags. In their frantic escape, they leave behind the *Lost Brood* (siblings still locked in the lower alchemical tubes, permanently abandoned to Fexric experimentation.",
    "dmHook": "The Deep Alchemists are still operating. Recent Groven expeditions have found fresh alchemical residue in the lower tunnels) and a fragment of stone-scale that is unmistakably Groven. The Lost Brood may still be alive. A rescue expedition into the deep would take the party through Fexric territory, abandoned vat-chambers, and the suffocating dark where something has been breeding for generations.",
    "dateDisplay": "Year 75, Freezing Era"
  },
  {
    "id": "event-church-founding",
    "date": {
      "year": 350,
      "eraId": "freezing-era"
    },
    "title": "Founding of the Solbrand Order",
    "type": "founding",
    "phase": "false-spring",
    "description": "In the first year after Sol's entombment, the surviving noble houses formally reorganized their territories and obligations at Greymark Keep. The first Scribe-Sentinels were appointed: Thalreth family members who volunteered to have their memories erased before taking their vows, ensuring objective record-keeping against the fog. The Church would later splinter as Sol's Breath dimmed and the myth of Sol's return became unsustainable.",
    "locationIds": [
      "greymark-keep"
    ],
    "factionIds": [
      "house-thalreth",
      "scribe-sentinels"
    ],
    "classIds": [
      "martyr"
    ],
    "causes": [
      "event-entombment",
      "event-keth-amar-breach"
    ],
    "effects": [
      "event-northern-schism"
    ],
    "narrative": "Seeking comfort and guidance in the permanent twilight following the Shattering of the Seal, refugees gather in the High Hearth of Greymark Keep to found the **Solbrand Order**. They venerate the memory of Sol's purity, preaching that the star will rise again if mortals remain unified against the creeping dark.",
    "dmHook": "The first High Confessor's ceremonial rod, carved from a living branch of the High Hearth root, was lost during the Florae Uprising. It is rumored to still pulse with warm solar light.",
    "dateDisplay": "Year 350, Freezing Era"
  },
  {
    "id": "event-preservation-pact",
    "date": {
      "year": 345,
      "eraId": "freezing-era"
    },
    "title": "The Preservation Compact",
    "type": "pact",
    "phase": "false-spring",
    "description": "Six houses that had broken to Keth-Amar — Thalreth, Skalvyr, Solvan, Mereval, Ordavan, and Tesshan — formalized the system of hard bargains that would define the Freezing Era. With Viridane fled and erased, they elevated House Morrath as a substitute seventh signatory to complete the binding ritual. Each house carved its sacrifice into a memory-glass tablet and sealed it in the Council Chamber at Greymark Keep. The tablets are still there. Three of them have been altered.",
    "locationIds": [
      "greymark-keep"
    ],
    "factionIds": [
      "house-thalreth",
      "house-skalvyr",
      "house-solvan",
      "house-mereval",
      "house-ordavan",
      "house-tesshan",
      "house-morrath"
    ],
    "classIds": [
      "martyr"
    ],
    "causes": [
      "event-keth-amar-breach"
    ],
    "effects": []
  },
  {
    "id": "event-false-spring-traditions",
    "date": {
      "year": 340,
      "eraId": "freezing-era",
      "endYear": 388
    },
    "title": "The False Spring Traditions: Immediate Survival",
    "type": "founding",
    "phase": "false-spring",
    "description": "Five combat traditions were born from the Great Binding, Blizzard’s End, and the first decades of desperate survival:\n\n• Augur (art predates the Star-Fall): Cassia, a Skald star-watcher at the Frozen Archive, read the First Failing's hour in the steaming entrails of a sacrificed glacier-elk. The temporal-feedback burn incinerated her past to make space for cosmic-doom coordinate chains.\n• Spellguard (Year ~3): Damon, an Solari blacksmith, blocked a solar flare with an alchemical tower shield during Sol's entombment. His hands are preserved frozen in the shielding posture at the Shield-Forge Keeps beneath Emberspire.\n• Martyr (Year ~12) (Sera Solvan, a mother of House Solvan, carved her sacrificed child's name into her forearm with volcanic obsidian when the heirs were marched north at Blizzard’s End. The wound healed into a glowing solar scar) the first Vow, founded in the years after the Shattering.\n• Apex (Year ~10-30): Sylas, a Mimir tracker, formalized the Silent Hunt for Wyrd-creatures emerging through the shell’s cracks. He traded his hearing for vibration-sense in the deep Ironwood Heart.\n• Pyrofiend (Year ~12): When the first pulse failed, seven Solvarn occultists gathered in an obsidian cavern beneath Emberspire, drew a summoning circle in their own blood, and swallowed Wyrd-touched coals of Scathrach, the Ashen Sovereign.",
    "locationIds": [
      "frozen-archive",
      "sundale",
      "emberspire-caldera",
      "ironwood-heart"
    ],
    "factionIds": [
      "house-solvan",
      "house-skalvyr"
    ],
    "classIds": [
      "augur",
      "spellguard",
      "martyr",
      "pyrofiend",
      "apex"
    ],
    "causes": [
      "event-sol-deepening",
      "event-entombment",
      "event-keth-amar-breach"
    ],
    "effects": []
  },
  {
    "id": "event-first-vent-failure",
    "date": {
      "year": 120,
      "eraId": "freezing-era"
    },
    "title": "The First Vent Failure",
    "type": "disaster",
    "phase": "first-ebbing",
    "description": "The first recorded failure of a secondary geothermal vent occurred in the Cragjaw border tunnels. A Fexric holdfast went cold within a month. The inhabitants (those who survived) became the first thermal refugees, migrating toward Emberspire and the surviving Frostmaw Holdfast vents. This began the pattern that defines the Freeze: as vents cool, populations move, and the displaced clash with the entrenched.",
    "locationIds": [
      "cragjaw-peaks",
      "frostmaw-holdfast"
    ],
    "factionIds": [],
    "classIds": [],
    "causes": [
      "event-emberspire-eruption"
    ],
    "effects": [
      "event-first-thermal-war"
    ]
  },
  {
    "id": "event-fifth-rebirth",
    "date": {
      "year": 376,
      "eraId": "freezing-era"
    },
    "title": "The Fifth Rebirth Window: 28%",
    "type": "cosmic",
    "phase": "first-ebbing",
    "description": "The fifth pulse. The Mother's song measured at 28%. The decline was now undeniable. Cassia's successors at the Frozen Archive began systematically logging every pulse window: a record that now shows the descent from 40% to 0% across the Freezing Era.",
    "locationIds": [
      "frozen-archive"
    ],
    "factionIds": [],
    "classIds": [
      "augur"
    ],
    "causes": [
      "event-first-rebirth"
    ],
    "effects": []
  },
  {
    "id": "event-bloodhammer-migration",
    "date": {
      "year": 150,
      "eraId": "freezing-era"
    },
    "title": "The Bloodhammer Migration South",
    "type": "migration",
    "phase": "first-ebbing",
    "description": "With Nordhalla's geothermal sumps failing and the Hunger Pact festering in Skald blood for three generations, the Bloodhammer clans (led by Torra Bloodhammer) marched south toward Emberspire's caldera. The journey took decades, following the Hunger Road through the Ancestor-Spans (paying Groven tolls in blood and salvage) and into Sundale's volcanic warmth. Grum the Iron-Smith, Torra's descendant, would ultimately ignite the first Blood-Heat in the caldera: transforming the Hunger Pact from a cultural wound into a weapon.",
    "locationIds": [
      "nordhalla",
      "cragjaw-peaks",
      "sundale"
    ],
    "factionIds": [
      "house-skalvyr"
    ],
    "classIds": [
      "berserker"
    ],
    "causes": [
      "event-hunger-winter",
      "event-first-vent-failure"
    ],
    "effects": [
      "event-berserker-founding"
    ]
  },
  {
    "id": "event-berserker-founding",
    "date": {
      "year": 155,
      "eraId": "freezing-era"
    },
    "title": "Grum Ignites the Blood-Heat",
    "type": "founding",
    "phase": "first-ebbing",
    "description": "At the end of the Bloodhammer migration, Grum the Iron-Smith (a Skald smith whose ancestors had consumed their own dead during the Hunger Winter) surrendered to forge-heat in Emberspire's caldera. The Hunger Pact that lived in his blood ignited: the Blood-Heat, a self-destructive adrenal meltdown where muscles tear from bone to swing harder. He shattered a glacier-wyrm barehanded. The Berserker tradition was born. The Forge of Grum, beneath Emberspire, still burns: tended by a mute elder who has never spoken Grum's actual name.",
    "locationIds": [
      "sundale",
      "emberspire-caldera"
    ],
    "factionIds": [
      "house-solvan"
    ],
    "classIds": [
      "berserker"
    ],
    "causes": [
      "event-bloodhammer-migration"
    ],
    "effects": []
  },
  {
    "id": "event-florae-shorn",
    "date": {
      "year": 90,
      "eraId": "freezing-era"
    },
    "title": "The Shorn Emerge",
    "type": "cultural",
    "phase": "first-ebbing",
    "description": "Three generations after House Viridane's flight, Aurel Shorn-First walked out of the moonlit groves and built a life under a human name. He was the first Florae to systematically shave his thorns and pass as human. The Shorn subrace was born: the pragmatists, choosing invisibility over defiance. They carry a single piece of ghost-metal hidden against the skin. The Trueborn who remained in the groves considered them deserters.",
    "locationIds": [
      "frostwood-reach",
      "ironwood-heart"
    ],
    "factionIds": [
      "trueborn-florae"
    ],
    "classIds": [],
    "causes": [
      "event-viridane-flight"
    ],
    "effects": []
  },
  {
    "id": "event-northern-schism",
    "date": {
      "year": 170,
      "eraId": "freezing-era"
    },
    "title": "The Ledger Purge",
    "type": "political",
    "phase": "first-ebbing",
    "description": "Lord Aldren Thalreth, overwhelmed by the fog's erosion of House Thalreth's collective memory, ordered the consolidation of all family ledgers into a single sealed vault beneath Greymark Keep. He chose to entrust the location to no one: not even his own heirs. This created a dangerous dependency on his continued survival and set the precedent for the Sovereign Ledger's power: whoever controls the records controls reality.",
    "locationIds": [
      "greymark-keep"
    ],
    "factionIds": [
      "house-thalreth"
    ],
    "classIds": [],
    "causes": [
      "event-church-founding"
    ],
    "effects": [
      "event-sovereign-ledger"
    ]
  },
  {
    "id": "event-sovereign-ledger",
    "date": {
      "year": 180,
      "eraId": "freezing-era"
    },
    "title": "The Sovereign Ledger Established",
    "type": "founding",
    "phase": "first-ebbing",
    "description": "The Sovereign Ledger was formally established at Greymark Keep: a system where only those with registered lineages hold legal rights. The Ledgered (documented citizens) and the Forgotten (outlawed undocumented) became two classes of humanity. The Scribe-Cartel formed simultaneously, monopolizing the Soot-Resin Ink and Peat-Parchment that resist the fog's memory-erosion. Information became currency. Identity became a bureaucratic privilege.",
    "locationIds": [
      "greymark-keep"
    ],
    "factionIds": [
      "house-thalreth",
      "scribe-sentinels",
      "scribe-cartel"
    ],
    "classIds": [],
    "causes": [
      "event-northern-schism"
    ],
    "effects": [
      "event-fogwood-schism",
      "event-ledger-collapse"
    ]
  },
  {
    "id": "event-deep-born-emerge",
    "date": {
      "year": 185,
      "eraId": "freezing-era"
    },
    "title": "The Deep Myrathil Emerge",
    "type": "cultural",
    "phase": "first-ebbing",
    "description": "As the Iceheart Sea reached thermal equilibrium after Emberspire's eruption, Myrathil began spawning from open-ocean foam rather than just shoreline spindrift. The Deep emerged: abyss-adapted mystics who hum into the Treakous Rift and find the surface world unbearably loud. The Listeners established a submerged chamber, recording the Rift's background hum. Centuries later, they would be the first to notice that the hum was changing: that the Sundered Monolith in the Rift was waking.",
    "locationIds": [
      "iceheart-sea"
    ],
    "factionIds": [],
    "classIds": [
      "minstrel"
    ],
    "causes": [
      "event-myrathil-spawning"
    ],
    "effects": []
  },
  {
    "id": "event-first-thermal-war",
    "date": {
      "year": 190,
      "eraId": "freezing-era"
    },
    "title": "The First Thermal War",
    "type": "conflict",
    "phase": "contraction",
    "description": "Groven holdfasts and Fexric deep-tunnel expeditions clashed over control of the geothermal vents beneath Frostmaw Crag. The Groven, still recovering from the Vat-Breakers' revolt, defended the upper crag warrens against Fexric mining incursions. The war ended in stalemate: the Groven retained the upper vents, the Fexric the deep tunnels. It was during this conflict that the Groven miner Torin drank alchemical sulfur-clay to hold a collapsing tunnel — an act that would later become the foundation of the Shaper tradition.",
    "locationIds": [
      "frostmaw-holdfast"
    ],
    "factionIds": [
      "vat-breakers-guild"
    ],
    "classIds": [
      "shaper"
    ],
    "causes": [
      "event-vat-breakers-revolt"
    ],
    "effects": []
  },
  {
    "id": "event-fogwood-schism",
    "date": {
      "year": 230,
      "eraId": "freezing-era"
    },
    "title": "The Fogwood Schism",
    "type": "schism",
    "phase": "first-ebbing",
    "description": "The Thalren archivists of the Frostwood Reach split into two factions: the Preservationists, who fought to maintain the old records against the fog's erosion, and the Adaptationists, who argued the fog was a force to be worked with, not against. The Forgotten (Thalren whose ledgers were lost or never recorded) emerged as a permanent underclass. The Ironwood Palisade checkpoint system was built to control movement between the documented and undocumented zones.",
    "locationIds": [
      "frostwood-reach",
      "greymark-keep",
      "the-shallows"
    ],
    "factionIds": [
      "house-thalreth",
      "scribe-cartel"
    ],
    "classIds": [],
    "causes": [
      "event-sovereign-ledger"
    ],
    "effects": [
      "event-memory-wars"
    ]
  },
  {
    "id": "event-brook-emerge",
    "date": {
      "year": 235,
      "eraId": "freezing-era"
    },
    "title": "The Brook Myrathil Emerge",
    "type": "cultural",
    "phase": "first-ebbing",
    "description": "Venn the Salt-Walker, a Myrathil explorer, followed a seasonal stream inland through the Sundrift Vale and discovered a vast freshwater lake: the Mother's Mirror. She proved Myrathil could survive away from salt water. The Brook emerged: estuary-born wanderers who follow rivers inland, the only Myrathil to have seen the mountains and the inland Monoliths.",
    "locationIds": [
      "sundrift-vale",
      "iceheart-sea"
    ],
    "factionIds": [],
    "classIds": [],
    "causes": [
      "event-myrathil-spawning"
    ],
    "effects": []
  },
  {
    "id": "event-synod-founded",
    "date": {
      "year": 240,
      "eraId": "freezing-era"
    },
    "title": "The Synod Organizes",
    "type": "founding",
    "phase": "first-ebbing",
    "description": "The Astril elders formally organized into the Synod, a ruling council of the oldest heritage-bloodlines governing from the crystal-lattice cathedral of Synod Hold. The Synod's purpose was dual: coordinate the Selunis-ritual across all Astril communities, and maintain the secrecy of their refugee origins. Keth-Amar was already searching for the light it had failed to consume, and discovery meant extinction. The Earthen Astril and Stellar Astril bloodlines established their complementary roles: Earthen Astril as farmers, hunters, and guardians of the physical communities; Stellar Astril as star-readers, ritual-tenders, and keepers of the celestial record.",
    "locationIds": [
      "sundrift-vale",
      "synod-hold"
    ],
    "factionIds": [],
    "classIds": [
      "augur"
    ],
    "causes": [
      "event-astril-first-vessels"
    ],
    "effects": [
      "event-astril-schism"
    ]
  },
  {
    "id": "event-first-ebbing-traditions",
    "date": {
      "year": 80,
      "eraId": "freezing-era",
      "endYear": 220
    },
    "title": "The First Ebbing Traditions: Early Adaptation",
    "type": "founding",
    "phase": "first-ebbing",
    "description": "Five traditions emerged as the warmth declined and civilizations adapted to permanent survival:\n\n• Arcanoneer (Year ~60) (Valerius, a Velun Neth archivist, drafted the First Contract with Morvane, structuring raw Bryngloom magic as strict legal clauses. His blood crystallizes into volatile shards) the cost of weaponizing the pact.\n• Warden (Year ~70): Alaric the Law-Keeper, a Groven mine-guard at Frostmaw Holdfast, drove an ore-hauling chain through his own forearm into a colossal Deep Alchemist specimen during the Vat-Breakers' revolt. He held for three days. The chain rusted into his bone.\n• Lunarch (Year ~80) (Selene, scion of House Viridane, bargained with wildwood fae in the moonlit groves to capture the dead moon's light. She bound a lunar parasite to her bones) an ancient celestial predator feeding on memory, sensation, and sanity.\n• Minstrel (Year ~100) (Lyris the Tide-Singer, a Merryn sailor, sang a sea-symphony to calm the Iceheart gales at Merrowport. The ocean mother accepted but stole her spoken voice) attempting to speak causes her throat to bleed.\n• Animist (Year ~120-200): Three independent ancestral-communion discoveries (Kael the Ordan totemic, Nyssa the Vreken spore-Wyrd, Theron the Skald runic) developed in parallel. They would merge centuries later when the founders' successors recognized each other's scars.",
    "locationIds": [
      "bryngloom-forest",
      "cragjaw-peaks",
      "frostwood-reach",
      "iceheart-sea",
      "sundrift-vale",
      "nordhalla"
    ],
    "factionIds": [],
    "classIds": [
      "arcanoneer",
      "warden",
      "lunarch",
      "minstrel",
      "animist"
    ],
    "causes": [
      "event-first-contract",
      "event-vat-breakers-revolt",
      "event-viridane-flight"
    ],
    "effects": []
  },
  {
    "id": "event-ledger-collapse",
    "date": {
      "year": 250,
      "eraId": "freezing-era"
    },
    "title": "The Ledger Halls Collapse",
    "type": "disaster",
    "phase": "contraction",
    "description": "A catastrophic structural failure buried the original Ledger Halls beneath petrified roots. Hundreds of irreplaceable records were lost: lineages, bargains, founding charters. The Scribe-Sentinels' authority was permanently weakened. The Great Forgetting began: the fog's memory-erosion accelerated because the backup records were gone. The gaps in the Reach's collective memory that appeared long ago have never been fully closed.",
    "locationIds": [
      "ledger-halls",
      "scribes-tower",
      "frostwood-reach"
    ],
    "factionIds": [
      "house-thalreth",
      "scribe-sentinels"
    ],
    "classIds": [
      "animist"
    ],
    "causes": [
      "event-fog-compact",
      "event-sovereign-ledger"
    ],
    "effects": [
      "event-memory-editing"
    ]
  },
  {
    "id": "event-mimir-purge",
    "date": {
      "year": 255,
      "eraId": "freezing-era"
    },
    "title": "The Mimir Purge: The Mask-Mothers Die",
    "type": "catastrophe",
    "phase": "contraction",
    "description": "A Wyrd incursion (a widening of a seal-crack near the deep Ironwood Heart) destroyed the Mimir birthing chambers. The last Mask-Mothers were killed. The art of making new masks (the Rite of Masks passed from mother to child for centuries) was lost forever in a single night. Every Mimir mask in existence became a relic. The population became finite, bounded by the number of surviving masks. This is the catastrophe from which the Mimir have never recovered.",
    "locationIds": [
      "frostwood-reach",
      "ironwood-heart"
    ],
    "factionIds": [],
    "classIds": [
      "apex"
    ],
    "causes": [
      "event-ledger-collapse"
    ],
    "effects": [
      "event-mimir-rupture"
    ],
    "narrative": "Paranoid noble inquisitors, fearing the shape-shifting espionage of the **Mimir**, burn their sacred birthing chambers across the Frostwood Reach. In a single season of fire and steel, the sacred technique of mask-forging (the ritual by which Mimir craft their persona masks from heartwood and storm-glass) is lost to history. The *Rupture* follows, permanently splintering Mimir society: the **Arch Mimir** canopy aristocrats hoard the surviving masks to maintain their lineages, while the siblings and those left without ancestral masks become the **Fractured Mimir**, forging crude storm-glass masks from fulgurite or composite masks from salvaged fragments, and living as outcasts and frontier-guards.",
    "dmHook": "A partially-burned mask-forging manual survived the Purge, hidden in the canopy-hold of a Mimir elder who died protecting it. The manual is incomplete: the final three steps are missing. A Mimir character who finds the manual can attempt to reconstruct the lost steps through trial, error, and communion with the fog itself. Failure means the mask consumes the wearer. Success means the Mimir can forge the first new persona mask in ninety years.",
    "dateDisplay": "Year 345, Freezing Era"
  },
  {
    "id": "event-mimir-rupture",
    "date": {
      "year": 260,
      "eraId": "freezing-era"
    },
    "title": "The Mimir Rupture: The Three Castes",
    "type": "schism",
    "phase": "contraction",
    "description": "With no new masks being made, the Masked elders (the aristocratic inheritors of heartwood masks bearing eleven generations of carved lineage) decreed that only first-born children may receive their mother's mask. Siblings were cast to the forest floor with no inheritance. Within a generation, Mimir society had shattered into two primary groups:\n• Arch Mimir: the shrinking aristocracy holding ancestral heartwood masks, presiding over a majority they refuse to acknowledge.\n• Fractured Mimir: the sentinels and outcasts who forge storm-glass masks from fulgurite or wear composite masks of salvaged fragments, surviving the harsh conditions of the forest floor and borders.",
    "locationIds": [
      "frostwood-reach",
      "ironwood-heart"
    ],
    "factionIds": [],
    "classIds": [
      "apex"
    ],
    "causes": [
      "event-mimir-purge"
    ],
    "effects": []
  },
  {
    "id": "event-twentieth-rebirth",
    "date": {
      "year": 386,
      "eraId": "freezing-era"
    },
    "title": "The Sixth Rebirth Window: 33%",
    "type": "cosmic",
    "phase": "contraction",
    "description": "The sixth pulse. The Mother's song measured at 33%: barely perceptible warming. After decades of tracking, the conclusion was irrefutable: the shards were fading. The myth of Sol's return began to die in the learned classes, while common people still waited for the next False Dawn.",
    "locationIds": [
      "frozen-archive"
    ],
    "factionIds": [],
    "classIds": [
      "augur"
    ],
    "causes": [
      "event-fifth-rebirth"
    ],
    "effects": [
      "event-dawn-vigil-founded"
    ]
  },
  {
    "id": "event-astril-schism",
    "date": {
      "year": 245,
      "eraId": "freezing-era",
      "endYear": 295
    },
    "title": "The Earthen Astril-Stellar Astril Schism",
    "type": "schism",
    "phase": "contraction",
    "description": "The Astril fractured. The Harmonists (future Earthen Astril) argued that the Lumia heritage must be embraced fully: suppression was a betrayal of the sanctuary their ancestors had promised. The Silencers (future Stellar Astril) argued that unchecked embrace led to full consumption and that suppression through scarification, fasting, and binding-chants was survival. Tharun Stellar Astril, the first Silencer, was assassinated by his own Earthen Astril sister who believed his suppression was starving the heritage. The heritage consumed her. She lost herself to full possession within the year. The schism has never healed.",
    "locationIds": [
      "sundrift-vale",
      "synod-hold"
    ],
    "factionIds": [],
    "classIds": [
      "augur"
    ],
    "causes": [
      "event-synod-founded"
    ],
    "effects": []
  },
  {
    "id": "event-drun-severing",
    "date": {
      "year": 410,
      "eraId": "freezing-era"
    },
    "title": "The Drun Severing: Saren-Vel Burns Her Name",
    "type": "cultural",
    "phase": "contraction",
    "description": "Saren-Vel, the most powerful Velun Neth mage of her generation, walked into the deepest Bryngloom bog with a flame that consumed only ink, not paper, not flesh. She burned her name from every active copy of the First Contract. The Drun subrace was born: legally nonexistent, magic-immune, invisible to Morvane's enforcement. They are also legally non-entitled. no property, no marriage, no testimony in a Neth court. Her act was a response to Morvane's growing distraction: as the pact weakened, its cage became unbearable to those who could feel it tightening.",
    "locationIds": [
      "bryngloom-forest",
      "atropolis"
    ],
    "factionIds": [],
    "classIds": [
      "gambit"
    ],
    "causes": [
      "event-contraction-traditions"
    ],
    "effects": []
  },
  {
    "id": "event-dawn-vigil-founded",
    "date": {
      "year": 388,
      "eraId": "freezing-era"
    },
    "title": "The Dawn Vigil Founded",
    "type": "founding",
    "phase": "contraction",
    "description": "Founded three centuries after Blizzard’s End, when the twelfth pulse revealed how much weaker Aex had become. Originally a quietist monastic order of Martyrs who tracked Monolith locations in secret, the Vigil's founding premise was that Sol would not return on its own: only the reassembly of the Sundered Monoliths could restart the star. The Vigil's deepest secret, held by its inner circle: reassembly would summon Keth-Amar, not Sol. In recent decades, under Hierophant Aethelgard, the Vigil has militarized into Sundale's dominant theocracy.",
    "locationIds": [
      "sundale",
      "emberspire-caldera"
    ],
    "factionIds": [
      "dawn-vigil",
      "house-solvan"
    ],
    "classIds": [
      "martyr"
    ],
    "causes": [
      "event-twentieth-rebirth"
    ],
    "effects": []
  },
  {
    "id": "event-war-thousand-screams",
    "date": {
      "year": 265,
      "eraId": "freezing-era",
      "endYear": 290
    },
    "title": "The War of Thousand Screams",
    "type": "conflict",
    "phase": "contraction",
    "description": "The largest conflict of the mid-era, fought against the backdrop of the ongoing Toll Wars above ground. Deep Alchemist experiments overran the lower tunnels of Frostmaw Holdfast at the same moment that resource scarcity from failing geothermal systems drove surface factions to desperation. Groven, Fexric, Tessen, and Deep Alchemist forces clashed in the vertical labyrinth. Nesta, a Clockwork Fexric engineer, built a time-dilation engine of volcanic glass and alchemical gears to halt a collapsing glacier: hooking the temporal loop into her own chest and incinerating her past. The Chronarch tradition was born in this war. The conflict reshaped Cragjaw society: the Steam-Line Cartel consolidated its geothermal monopoly, the Deep Alchemists sealed themselves into the lowest tunnels, and the Groven fortified the Ancestor-Spans as permanent military checkpoints.",
    "locationIds": [
      "cragjaw-peaks",
      "frostmaw-holdfast",
      "gearworks-gulch"
    ],
    "factionIds": [
      "vat-breakers-guild",
      "steam-line-cartel",
      "deep-alchemists"
    ],
    "classIds": [
      "chronarch",
      "warden"
    ],
    "causes": [
      "event-first-thermal-war"
    ],
    "effects": [],
    "narrative": "A brutal northern conflict erupts as the glaciers halt. **Skald warriors** hold the sheer Frostgate Pass alone against an invading army ten times their number, the battle running red for three months. When the spring thaw fails to arrive, the corpses are frozen solid in active positions of combat (a sculpture garden of the dead that still stands in the pass. In the aftermath, the first **Dreadnaughts** are forged: Skald smiths weld their greatest warriors permanently inside massive, Archive-forged iron steam-boilers, utilizing coal, blood, or trapped souls to provide the heat and strength needed to ensure the gates never fall again.",
    "dmHook": "The Frostgate Pass is still there. The frozen dead are still there) eight hundred corpses locked in eternal combat. Some of them are not entirely dead. The Wyrd, drawn to the concentration of violent death, has been nesting in the pass for centuries. Travelers who cross at night report hearing battle cries from the ice. Some report seeing the dead move.",
    "dateDisplay": "Year 260, Freezing Era"
  },
  {
    "id": "event-toll-wars",
    "date": {
      "year": 210,
      "eraId": "freezing-era",
      "endYear": 270
    },
    "title": "The Toll Wars",
    "type": "conflict",
    "phase": "contraction",
    "description": "As thermal refugees increased along the Hunger Road, Groven toll-keepers raised passage rates at the Ancestor-Spans. Nordhalla Skald caravans and Sundale Solari trade delegations clashed with Groven bridge-tenders and each other over transit rights. In the later years, the War of Thousand Screams erupted simultaneously in the lower tunnels beneath Frostmaw Holdfast, forcing Groven defenders to fight a two-front war: one above the spans, one below. The Ithran diplomat Ithra-Mal negotiated the Ironjaw Port Toll-Treaties: the first formal recognition of Groven sovereign bridge-rights by the noble houses. The Morgh/Ithran ideological split solidified during this period: Ithran diplomats negotiated the treaties the Morgh bridge-builders died to enforce, each side certain the other had mistaken freedom for something it was not.",
    "locationIds": [
      "cragjaw-peaks",
      "ironjaw-port",
      "deepchasm-keep"
    ],
    "factionIds": [
      "vat-breakers-guild",
      "house-skalvyr",
      "house-solvan"
    ],
    "classIds": [
      "warden"
    ],
    "causes": [
      "event-first-thermal-war"
    ],
    "effects": []
  },
  {
    "id": "event-memory-wars",
    "date": {
      "year": 215,
      "eraId": "freezing-era",
      "endYear": 315
    },
    "title": "The Memory Wars",
    "type": "conflict",
    "phase": "contraction",
    "description": "The Scribe-Cartel's monopoly on fog-resistant ink and parchment made literacy a privilege, and the Sovereign Ledger made documentation the boundary between citizen and outlaw. The Forgotten (Thalren whose ledgers were lost, never recorded, or deliberately erased) raided archive-towers and ledger-shrines to prove their own existence. The Cartel responded with sanctions, ink-embargoes, and the Mist-Sentinels: a border guard patrolling the Ironwood Palisade. The Florae, whose oral history is immune to fog-erasure, watched from the groves and occasionally sheltered Forgotten fugitives.",
    "locationIds": [
      "frostwood-reach",
      "greymark-keep",
      "ironwood-heart"
    ],
    "factionIds": [
      "scribe-cartel",
      "house-thalreth",
      "mist-sentinels"
    ],
    "classIds": [],
    "causes": [
      "event-fogwood-schism"
    ],
    "effects": [
      "event-florae-uprising"
    ]
  },
  {
    "id": "event-florae-uprising",
    "date": {
      "year": 400,
      "eraId": "freezing-era"
    },
    "title": "The Florae Uprising",
    "type": "conflict",
    "phase": "contraction",
    "description": "The Trueborn Florae, rejecting the Fog Compact and the Sovereign Ledger's authority, launched a series of raids against timber caravans and ledger-shrines in the Frostwood Reach. House Thalreth responded with a brutal suppression campaign that drove the Florae deep into the Ironwood Heart. The conflict has smoldered for generations: the Florae never fully suppressed, the Thalreth never fully secure. The Florae call it the Righteous Refusal. The Thalreth call it the Thorn Insurgency.",
    "locationIds": [
      "ironwood-heart",
      "the-shallows",
      "frostwood-reach"
    ],
    "factionIds": [
      "trueborn-florae",
      "house-thalreth",
      "mist-sentinels"
    ],
    "classIds": [
      "apex",
      "lunarch"
    ],
    "causes": [
      "event-memory-wars"
    ],
    "effects": []
  },
  {
    "id": "event-vreken-overlit-epidemic",
    "date": {
      "year": 420,
      "eraId": "freezing-era",
      "endYear": 470
    },
    "title": "The Over-Lit Epidemic",
    "type": "disaster",
    "phase": "contraction",
    "description": "With the Neth's expanding trade networks making Vreken fungal exports into valuable currency across all seven regions, harvest of Ghost-Mycelium intensified dramatically. Exposure intensified correspondingly. Aedris, a Marked Veil-Speaker at the Sunken Spire, became the first recorded Over-Lit case, pressing raw Ghost-Mycelium pulp to her eyes during a prolonged crypt-vigil and found three days later still glowing, still singing, but no longer able to recognize her own reflection. The epidemic exposed the fatal weakness in Marked biology: the light that makes them extraordinary is the same light that consumes them. The Clean. immune to the hush: began their quiet drift toward the leadership positions the Marked were deemed too volatile to hold.",
    "locationIds": [
      "bryngloom-forest",
      "the-sunken-spire"
    ],
    "factionIds": [],
    "classIds": [
      "inquisitor"
    ],
    "causes": [
      "event-brine-bond-syndicate"
    ],
    "effects": [
      "event-squeeze-traditions"
    ]
  },
  {
    "id": "event-inquisitor-merge",
    "date": {
      "year": 412,
      "eraId": "freezing-era"
    },
    "title": "The Inquisitor Traditions Merge: The Barbed Vow",
    "type": "founding",
    "phase": "contraction",
    "description": "Two parallel Wyrd-hunting traditions merged into the Inquisition. In the Bryngloom, Orven the Still-Handed (a Marked Vreken whose twin sister had gone over-lit) forged the first cold-iron blade and swore the Barbed Vow to hunt his own corrupted kinsmen. In the Frostwood Reach, Elias the Salt-Scarred (a Thalren healer) opened his own veins to draw Wyrd face-stealing horrors into living flesh. When the Sundered Monoliths cracked wider and Wyrd incursions tripled, the two orders merged. The Inquisition established chapters at Greymark Keep (Frostwood) and the Covenbane Stronghold / Sunken Spire (Bryngloom).",
    "locationIds": [
      "bryngloom-forest",
      "frostwood-reach",
      "greymark-keep",
      "the-sunken-spire"
    ],
    "factionIds": [],
    "classIds": [
      "inquisitor"
    ],
    "causes": [
      "event-memory-wars"
    ],
    "effects": []
  },
  {
    "id": "event-brine-bond-syndicate",
    "date": {
      "year": 395,
      "eraId": "freezing-era"
    },
    "title": "The Brine-Bond Syndicate Founded",
    "type": "founding",
    "phase": "contraction",
    "description": "The Mereval Board of Trade, facing escalating storm-violence as the Iceheart Monolith's influence grew, formalized the Brine-Bond Syndicate at Merrowport. The Luck-Ledger was established: a system quantifying, tracking, and taxing Merryn sailors' storm-luck. Luck became a tradeable, inheritable commodity: and the Syndicate became the gatekeeper of who could sail the storm-lanes and who would be pressed into service as Bilge-Dwellers.",
    "locationIds": [
      "iceheart-sea",
      "merrowport"
    ],
    "factionIds": [
      "house-mereval",
      "brine-bond-syndicate"
    ],
    "classIds": [
      "gambit",
      "minstrel"
    ],
    "causes": [
      "event-first-ebbing-traditions"
    ],
    "effects": []
  },
  {
    "id": "event-contraction-traditions",
    "date": {
      "year": 390,
      "eraId": "freezing-era",
      "endYear": 475
    },
    "title": "The Contraction Traditions: Mid-Era Response",
    "type": "founding",
    "phase": "contraction",
    "description": "Six traditions emerged as the Contraction forced organized responses to Wyrd, scarcity, and the undeniable permanent decline:\n\n• Chronarch (Year ~310): During the War of Thousand Screams, Nesta hooked a time-dilation engine into her chest at Frostmaw Holdfast.\n• Gambit (Year ~350): Jax (Merryn pirate, wagered his lifeline against a storm-spirit at Merrowport) and Lyra (Kessen Neth probability-weaver, plucked the single surviving timeline) merged their arts.\n• Shaper (Year ~350): Sylvanus (Frostwood kinetic dance) and Torin (Cragjaw biological body-sculpting) merged by the Mimir chronicler Veyra the Merged.\n• Inquisitor (Year ~380): Orven the Still-Handed and Elias the Salt-Scarred merged their Wyrd-hunting traditions at the Barbed Vow.\n• Harbinger (Year ~380): Xyris (Astril, tore the first permanent Chaos Pocket in the Sundrift Vale) and Malakor (Skald, calculated Sol's extinction) merged their traditions.\n• Toxicologist (Year ~380): Varis the Trembling systematized venom extraction from the evolving fog-predators of the Frostwood Reach.",
    "locationIds": [
      "cragjaw-peaks",
      "iceheart-sea",
      "frostwood-reach",
      "bryngloom-forest",
      "sundrift-vale",
      "nordhalla"
    ],
    "factionIds": [],
    "classIds": [
      "chronarch",
      "gambit",
      "shaper",
      "inquisitor",
      "harbinger",
      "toxicologist"
    ],
    "causes": [
      "event-war-thousand-screams",
      "event-toll-wars",
      "event-memory-wars"
    ],
    "effects": []
  },
  {
    "id": "event-cult-founding",
    "date": {
      "year": 430,
      "eraId": "freezing-era"
    },
    "title": "The Over-Shanty Established: The Cult of Forgotten Shadow",
    "type": "founding",
    "phase": "squeeze",
    "description": "At the edge of the Bryngloom's peat-bogs, a permanent black market settlement coalesced beneath Atropolis's high canopy: the Over-Shanty. Drun outcasts, Vreken defaulters, Marked Vreken refugees, and desperate merchants from every region built a lawless trading post where Neth contracts held no authority and the only currency was what you could carry and defend. In the peat-crypts beneath the Over-Shanty, a group of desperate survivors (the first cultists of what would become the Cult of Forgotten Shadow) began to experiment with something they had found in the deepest bog: a silence that spoke back. Centuries later, disillusioned Dawn Vigil defectors who learned the truth — that reassembly summons Keth-Amar, not Sol — would find their way to these crypts, merging the bog-cult's raw contact with the Vigil's doctrinal corruption into the organized Cult of Forgotten Shadow that exists today.",
    "locationIds": [
      "over-shanty",
      "bryngloom-forest",
      "atropolis"
    ],
    "factionIds": [
      "drun-outcasts",
      "cult-of-forgotten-shadow"
    ],
    "classIds": [],
    "causes": [
      "event-drun-severing",
      "event-vreken-overlit-epidemic"
    ],
    "effects": [
      "event-silence-between-stars"
    ]
  },
  {
    "id": "event-fortieth-rebirth",
    "date": {
      "year": 424,
      "eraId": "freezing-era"
    },
    "title": "The Ninth Rebirth Window: 24%",
    "type": "cosmic",
    "phase": "squeeze",
    "description": "The ninth pulse. Output measured at 24%: detectable only by Augur instruments. The common people saw no warming at all during the False Dawn month. The myth of Sol's return, maintained for a century by priests and augurs, died in the streets.",
    "locationIds": [
      "frozen-archive",
      "sundale"
    ],
    "factionIds": [
      "house-solvan"
    ],
    "classIds": [
      "augur"
    ],
    "causes": [
      "event-twentieth-rebirth"
    ],
    "effects": [
      "event-false-dawn-riots"
    ]
  },
  {
    "id": "event-false-dawn-riots",
    "date": {
      "year": 425,
      "eraId": "freezing-era"
    },
    "title": "The False Dawn Riots",
    "type": "conflict",
    "phase": "squeeze",
    "description": "When the ninth Rebirth Window produced no visible warming, populations across Sundale, Nordhalla, and the Sundrift Vale erupted. The myth of Sol's return (the theological foundation of every regional bargain) broke. Temples were burned. Augurs were attacked in the streets. The Frozen Archive sealed its outer gates for the first time. House Solvan's Imperium, already hollowed by centuries of declining legitimacy, collapsed into a regency of Stewards who still refuse the title \"Lord\" until the sun returns. The Dawn Vigil militarized to fill the power vacuum.",
    "locationIds": [
      "sundale",
      "nordhalla",
      "sundrift-vale",
      "frozen-archive"
    ],
    "factionIds": [
      "house-solvan",
      "dawn-vigil"
    ],
    "classIds": [
      "martyr",
      "harbinger"
    ],
    "causes": [
      "event-fortieth-rebirth"
    ],
    "effects": [
      "event-solbrand-concealment"
    ]
  },
  {
    "id": "event-solbrand-concealment",
    "date": {
      "year": 426,
      "eraId": "freezing-era"
    },
    "title": "The Concealment of Sol's Breath Begins",
    "type": "conspiracy",
    "phase": "squeeze",
    "description": "In the chaos of the False Dawn Riots, the Hollow-Solari tending-clan beneath Emberspire made a decision that would shape Sundale for three centuries: they concealed Sol's Breath's measurable dimming from the outside world. The sacred flame (the primary thermal radiator of the entire Solari vault capital) had been fading for decades. Public knowledge would have destroyed what remained of Sundale's theocratic legitimacy. The concealment lasted generations, passed from tending-clan matriarch to matriarch, until Sol's Breath could no longer be hidden. By Year 780, three factions had formed around the truth: the Risen, the Sunderer, and the Scoured.",
    "locationIds": [
      "sundale",
      "emberspire-caldera",
      "harath-vault"
    ],
    "factionIds": [
      "house-solvan",
      "dawn-vigil"
    ],
    "classIds": [
      "martyr",
      "pyrofiend"
    ],
    "causes": [
      "event-false-dawn-riots"
    ],
    "effects": []
  },
  {
    "id": "event-memory-editing",
    "date": {
      "year": 438,
      "eraId": "freezing-era"
    },
    "title": "The Great Revision",
    "type": "conspiracy",
    "phase": "squeeze",
    "description": "Senior Scribe-Sentinels, having discovered that the fog makes memory malleable, began systematically editing the ledger-libraries. Entire family lines were erased. Noble houses that once existed were written out of history. The \"Great Revision\" continues to this day, with each generation of Sentinels believing they are the first to discover the power: never realizing their predecessors made the same discovery, edited the same records, and erased the same truths. The erased House Viridane became the Revision's template: if one house could be unmade, any could.",
    "locationIds": [
      "scribes-tower",
      "ledger-halls",
      "greymark-keep"
    ],
    "factionIds": [
      "scribe-sentinels",
      "house-thalreth",
      "scribe-cartel"
    ],
    "classIds": [
      "animist"
    ],
    "causes": [
      "event-ledger-collapse"
    ],
    "effects": []
  },
  {
    "id": "event-silence-between-stars",
    "date": {
      "year": 455,
      "eraId": "freezing-era"
    },
    "title": "The Silence Between Stars: Contact Made",
    "type": "discovery",
    "phase": "squeeze",
    "description": "The Cult of Forgotten Shadow, founded long ago in the peat-crypts beneath the Over-Shanty, made the first intentional two-way contact with the deep dark since Blizzard’s End. Something answered. Not an echo. Not a Wyrd-echo. Something that knew the cultists' names. Something that had been waiting. This was Keth-Amar's first direct communication with the surface in nearly six centuries: and it signaled the shift from passive consumption to active intrusion. Keth-Amar currently has no active emissary on the surface (Scathrach sealed itself away centuries ago) — it speaks through the cracks directly. The False Prophet tradition was born within months: Li Wei, an Ordan herd-watcher in the Sundrift Vale, witnessed the contact in a vision and looked directly into the silence where Sol once shone.",
    "locationIds": [
      "bryngloom-forest",
      "over-shanty",
      "sundrift-vale"
    ],
    "factionIds": [
      "cult-of-forgotten-shadow"
    ],
    "classIds": [
      "false_prophet",
      "revenant",
      "harbinger"
    ],
    "causes": [
      "event-cult-founding"
    ],
    "effects": [
      "event-skalyvr-silence"
    ],
    "narrative": "The Cult of Forgotten Shadow's inner circle makes first contact with **The Silence Between Stars**-an amorphous silence entity that whispers from the dark sky, instructing shadow priests on the locations of the Monoliths.",
    "dmHook": "The contact was initiated by an Astril heretic who tried to bind their Lumia heritage with shadow magic, creating a permanent beacon for the Silence.",
    "dateDisplay": "Year 210, Freezing Era"
  },
  {
    "id": "event-squeeze-traditions",
    "date": {
      "year": 415,
      "eraId": "freezing-era",
      "endYear": 475
    },
    "title": "The Squeeze Traditions: Late-Era Crisis",
    "type": "founding",
    "phase": "squeeze",
    "description": "Three traditions emerged from desperation and the weaponization of the Wyrd:\n\n• Plaguebringer (Year ~500): Vespera, a Vreken alchemist, bonded with bog-rot to cure the spore-hush ravaging her family's cave-keeps. She injected decaying Sunken Spire moss directly into her veins. The cure worked. She became a permanent host for active decay.\n• Revenant (Year ~550) (When bog-graves began waking on their own) the dead marching toward the Sundered Monoliths without permission: Kora the Veil-Speaker (Vreken blood-covenant) and Vesper the Scribe (Neth frost-stasis phylactery) merged their death-magic traditions at the Cold Hearth.\n• False Prophet (Year ~598): Li Wei followed a meteor into a Sundered Monolith crater in the Sundrift Vale following the Silence Between Stars. He returned with blank white eyes, a shattered mind, and a hypnotic madness that drains listeners' stamina.",
    "locationIds": [
      "bryngloom-forest",
      "sundrift-vale"
    ],
    "factionIds": [
      "cult-of-forgotten-shadow"
    ],
    "classIds": [
      "plaguebringer",
      "revenant",
      "false_prophet"
    ],
    "causes": [
      "event-silence-between-stars",
      "event-vreken-overlit-epidemic"
    ],
    "effects": []
  },
  {
    "id": "event-last-rebirth",
    "date": {
      "year": 475,
      "eraId": "freezing-era"
    },
    "title": "The Final Silent Window: 0%",
    "type": "cosmic",
    "phase": "intrusion",
    "description": "The thirteenth pulse closes with no output. The Mother's voice in the shards is exhausted. The Augurs at the Frozen Archive record: \"The song has stopped.\" The remaining Augurs quietly remove the measurements from public record, and the Archive seals the lower chambers where the old pulse records are held.",
    "locationIds": [
      "frozen-archive",
      "sundale"
    ],
    "factionIds": [],
    "classIds": [
      "augur"
    ],
    "causes": [
      "event-fortieth-rebirth",
      "event-augur-collapse",
      "event-solbrand-failing"
    ],
    "effects": []
  },
  {
    "id": "event-skalyvr-silence",
    "date": {
      "year": 465,
      "eraId": "freezing-era"
    },
    "title": "The Silence-Heat Heresy",
    "type": "conspiracy",
    "phase": "intrusion",
    "description": "With Nordhalla's geothermal sumps failing and the Frozen Archive's heating systems degrading, a Skalvyr scion of the younger generation made clandestine contact with outcast Solari pyrofiends. Construction began on a volatile heat-engine powered by Emberspire obsidian, sealed beneath the Frozen Archive's deepest levels. The Silence-Heat engine traded the Glacier Bargain's slow stability for a faster, dirtier warmth: warmth stolen from the deep and from Scathrach's Wyrd-touched fire. The glacier-preserved dead stirred. Temporal friction began contaminating the Augurs' readings. The engine still runs.",
    "locationIds": [
      "frozen-archive",
      "nordhalla"
    ],
    "factionIds": [
      "house-skalvyr"
    ],
    "classIds": [
      "pyrofiend",
      "augur"
    ],
    "causes": [
      "event-silence-between-stars"
    ],
    "effects": [
      "event-augur-collapse"
    ],
    "narrative": "A secret faction within the Frozen Archive, the **Cult of Forgotten Shadow**, begins clandestine construction of Silence-heat engines in the sealed lower vaults, attempting to melt the glaciers from within.",
    "dmHook": "The engines run on siphoned soul-warmth. Several missing Skald trackers' bodies have been found drained of heat near the vents.",
    "dateDisplay": "Year 415, Freezing Era"
  },
  {
    "id": "event-nethering",
    "date": {
      "year": 467,
      "eraId": "freezing-era"
    },
    "title": "The Nethering",
    "type": "disaster",
    "phase": "intrusion",
    "description": "Morvane (the death-boundary entity that had enforced the Neth's First Contract since before the sun was buried) became so distracted by whatever force Keth-Amar had unleashed that the pact began to fray. The Unraveling accelerated: Neth who broke contracts on purpose to force change began experiencing the Fading, a slow dissipation into nothingness. The First Contract itself began to reject previously accepted clauses: the Arcanoneer crisis. Drun numbers swelled as Neth voluntarily severed their names from the Contract. Morvane had been the metaphysical glue holding one of the world's foundational bargains together, and it was coming undone.",
    "locationIds": [
      "bryngloom-forest",
      "atropolis"
    ],
    "factionIds": [],
    "classIds": [
      "arcanoneer",
      "revenant",
      "false_prophet"
    ],
    "causes": [
      "event-silence-between-stars"
    ],
    "effects": [
      "event-augur-collapse"
    ]
  },
  {
    "id": "event-augur-collapse",
    "date": {
      "year": 469,
      "eraId": "freezing-era"
    },
    "title": "The Augur Collapse: Accuracy Plummets",
    "type": "disaster",
    "phase": "intrusion",
    "description": "Augur accuracy collapsed from 93% to 41% in three months. The star-arithmetic returned contradictory futures. The entrails of every sacrificed elk showed different deaths. Cause: temporal friction from the Silence-Heat engine disturbing the glacier-dead, combined with Keth-Amar's consumption reaching a threshold that destabilized linear time itself. The elders of the Frozen Archive suspect a deeper cause: the Watcher in the Mist, the entity that remembers time and guards the boundary between life and death, is fracturing under Keth-Amar's pressure. If the Watcher breaks, time itself breaks with it. The timeline fracture is not a symptom of the crisis — it is the crisis. The world's early-warning system was blinded at the worst possible moment: thirteen pulse windows exist, ten logged in full and three surviving only in fragment records. The remaining Augur elders disagree on whether the blindness is temporary or permanent. Cassia's body, preserved upright in glacier-ice, has begun to weep frozen tears.",
    "locationIds": [
      "frozen-archive",
      "nordhalla"
    ],
    "factionIds": [
      "house-skalvyr"
    ],
    "classIds": [
      "augur"
    ],
    "causes": [
      "event-skalyvr-silence",
      "event-nethering"
    ],
    "effects": []
  },
  {
    "id": "event-solbrand-failing",
    "date": {
      "year": 470,
      "eraId": "freezing-era"
    },
    "title": "Sol's Breath Fails: The Failing Becomes Visible",
    "type": "disaster",
    "phase": "intrusion",
    "description": "Sol's Breath (the sacred warmth the Hollow-Solari have tended in the deep vaults beneath Emberspire for four centuries) visibly began to fail. The tending-clan could no longer conceal the decline. Emberspire's vents cooled measurably. The Waste-Solari caldera weakened. The Frost-Tithe (Keth-Amar's birth-debt on Rime-Born mothers) worsened, claiming twice as many infants. Three factions crystallized around the failing Sol's Breath: the Risen (old faith, \"Sol will return\"), the Sunderer (heretics who believe Sol's Breath is Keth-Amar's feeding-line and must be destroyed), and the Scoured (who deface their forge-marks and scour the world for Monolith Shards).",
    "locationIds": [
      "sundale",
      "emberspire-caldera",
      "harath-vault"
    ],
    "factionIds": [
      "house-solvan",
      "dawn-vigil"
    ],
    "classIds": [
      "martyr",
      "pyrofiend",
      "spellguard"
    ],
    "causes": [
      "event-solbrand-concealment"
    ],
    "effects": [
      "event-sundale-civil-war"
    ],
    "narrative": "The **Sol's Breath** (the eternal ember believed to be Sol's last conscious fragment inside the Harath-Vault) begins to dim. The Hollow-Solari priestly elite of the Solari, desperate to maintain faith, conceal the decline from the outer Waste-Solari clans. Elder **Thaeron**, the eldest Sun-Speaker, retreats into the inner basalt ring of the Harath-Vault, spending eleven years staring into the fading flame in absolute silence. He discovers that Sol's Breath is not a closed ember, but a thermal feeding-line through which Keth-Amar is actively siphoning Sol's life, triggering a quiet three-way theological schism among the forge-clans.",
    "dmHook": "Thaeron is dying. He has been sustained for decades by proximity to Sol's Breath, but the ember's fading is accelerating his decline. Before he dies, he wants to tell someone what he has seen. He will only speak to an outsider: someone unaffiliated with the forge-clans, someone who cannot be accused of factional bias. The party is summoned to the Harath-Vault. What Thaeron tells them will change everything.",
    "dateDisplay": "Year 467, Freezing Era"
  },
  {
    "id": "event-sundale-civil-war",
    "date": {
      "year": 471,
      "eraId": "freezing-era"
    },
    "title": "The Sundale Civil War",
    "type": "conflict",
    "phase": "intrusion",
    "description": "As Sol's Breath failed, Sundale tore itself apart. The Risen, the Sunderer, and the Scoured (three incompatible interpretations of the same dying light) turned Emberspire's slopes into a battlefield. The Dawn Vigil split between those who believed reassembling the Monoliths would restart Sol (despite the Vigil's secret knowledge that it would summon Keth-Amar instead) and those who would rather let the star die than serve the Sun-Eater. Hierophant Aethelgard seized control of Hollow-Solari's theocratic apparatus and began conscripting Martyrs as strategic resources. The Harath-Vault (home to the Berserker arenas and the Forge of Grum) became contested ground.",
    "locationIds": [
      "sundale",
      "emberspire-caldera",
      "harath-vault",
      "basalt-shyr"
    ],
    "factionIds": [
      "house-solvan",
      "dawn-vigil",
      "the-risen",
      "the-sunderers"
    ],
    "classIds": [
      "martyr",
      "berserker",
      "pyrofiend",
      "spellguard"
    ],
    "causes": [
      "event-solbrand-failing"
    ],
    "effects": [
      "event-monoliths-waking"
    ]
  },
  {
    "id": "event-geothermal-collapse",
    "date": {
      "year": 472,
      "eraId": "freezing-era"
    },
    "title": "The Frostmaw Geothermal Collapse",
    "type": "disaster",
    "phase": "intrusion",
    "description": "The geothermal terraces at Frostmaw Holdfast (the primary food-growing infrastructure for the entire Cragjaw Peaks) began cooling. Hydrothermal crops failed. The Steam-Line Cartel throttled its surviving pipelines, prioritizing military and guild users. The Cragjaw's population faced the first mass famine in six centuries. Reports from the lower sumps claimed the Deep Alchemists had reopened their laboratories and were, once again, experimenting on something with more than two limbs.",
    "locationIds": [
      "cragjaw-peaks",
      "frostmaw-holdfast",
      "gearworks-gulch"
    ],
    "factionIds": [
      "steam-line-cartel",
      "deep-alchemists"
    ],
    "classIds": [
      "chronarch",
      "warden",
      "shaper"
    ],
    "causes": [
      "event-solbrand-failing"
    ],
    "effects": [
      "event-monoliths-waking"
    ]
  },
  {
    "id": "event-silent-sea",
    "date": {
      "year": 473,
      "eraId": "freezing-era"
    },
    "title": "The Silent Sea",
    "type": "catastrophe",
    "phase": "intrusion",
    "description": "The Iceheart Sea fell silent. The tidesong (the subsonic pressure-pulse that Merryn sailors and Myrathil Deep had navigated by for centuries) stopped. Lyris the Tide-Singer, founder of the Minstrel tradition, vanished the same night. The Treakous Rift Sundered Monolith was no longer a background hum; it was a command frequency. Myrathil Deep reported hearing instructions in the silence. Ships disappeared in increasing numbers: not sunk, not wrecked, just gone. Silence has been spreading up the rivers inland. The Brook Myrathil are the first to encounter it in freshwater for the first time.",
    "locationIds": [
      "iceheart-sea",
      "merrowport",
      "spindrift-lagoon"
    ],
    "factionIds": [
      "brine-bond-syndicate",
      "house-mereval"
    ],
    "classIds": [
      "minstrel",
      "gambit"
    ],
    "causes": [
      "event-monoliths-waking"
    ],
    "effects": []
  },
  {
    "id": "event-monoliths-waking",
    "date": {
      "year": 474,
      "eraId": "freezing-era"
    },
    "title": "The Waking of the Monoliths",
    "type": "catastrophe",
    "phase": "intrusion",
    "description": "All seven Sundered Monoliths began to hum simultaneously, a frequency that could be felt in the bones as much as heard. The Shard-Window storm-vortex above the Iceheart Sea's Monolith intensified, pulling ships into its eye. The Berg of the Frozen Flame in the Northern Ice-Flows melted its own cradle. The Cragjaw Subterranean Vault warmed for the first time since the Great Binding. Emberspire's throat Monolith pulsed in rhythm with Sol's Breath's failing light. The Treakous Oceanic Rift Monolith began broadcasting what the Deep Myrathil call \"instructions.\" Chaos Pockets stabilized into permanence across the Sundrift Vale. The bog-graves of Bryngloom rose and began marching. not randomly, but TOWARD the Monoliths. Every bargain struck in the past 800 years was coming due at once.",
    "locationIds": [
      "sundale",
      "iceheart-sea",
      "nordhalla",
      "cragjaw-peaks",
      "frostwood-reach",
      "bryngloom-forest",
      "sundrift-vale"
    ],
    "factionIds": [
      "dawn-vigil",
      "cult-of-forgotten-shadow"
    ],
    "classIds": [
      "all"
    ],
    "causes": [
      "event-sundale-civil-war",
      "event-geothermal-collapse"
    ],
    "effects": [],
    "narrative": "The **Scoured** Solari, having ritually defaced their forge-marks, scour the continents for Sundered Monoliths, believing that sealing the predator's wound will let the buried star die whole and quiet. In the north, frost lords stir beneath Nordhalla's glaciers. In Atropolis, the **Neth** file seventeen urgent petitions to claim the Monolith pools as protected contract archives. Civil war brews between the Hollow-Solari and Waste-Solari forge-clans in Sundale, while **Inquisitors** hunt the mycelial-addicted Over-Lit across the margins of every settled capital. The powder keg is global. The fuse is lit.",
    "dmHook": "This is where your campaign begins. Every region's crisis is an adventure waiting to happen. Every Sundered Monolith is a dungeon with a boss at its heart. Every faction has an agenda. Every NPC has a secret. The seventh age of Mythrill does not have a predetermined ending: that's what the players are for. Start small: a frozen village in the Frostwood Reach, a missing child, a fog that whispers. Build toward the Monoliths. End at Emberspire.",
    "dateDisplay": "Year 471, Freezing Era"
  },
  {
    "id": "event-bog-dead-march",
    "date": {
      "year": 474,
      "eraId": "freezing-era"
    },
    "title": "The Marching Dead",
    "type": "catastrophe",
    "phase": "intrusion",
    "description": "The dead of Bryngloom's peat-graves rose and began marching (not randomly animated, but MOVING in a single direction: toward the nearest Sundered Monolith. The Revenants discovered that the dead were being collected, not animated) whatever was calling them was gathering resources, not creating chaos. Twelve Revenants were found drained of blood with no wounds. The Inquisition, reduced to only forty-seven active members, could not even slow the march. The Root-Veil (the Vreken's continent-spanning mycelial network) began actively rejecting the Marked.",
    "locationIds": [
      "bryngloom-forest",
      "the-sunken-spire",
      "over-shanty"
    ],
    "factionIds": [],
    "classIds": [
      "revenant",
      "inquisitor",
      "plaguebringer"
    ],
    "causes": [
      "event-monoliths-waking"
    ],
    "effects": []
  },
  {
    "id": "event-the-first-ignition",
    "date": {
      "year": -100,
      "eraId": "before-deepening"
    },
    "title": "The First Ignition",
    "type": "cosmic",
    "phase": "before-deepening",
    "description": "The first stars ignite across the Silence, and each one establishes its dimming window (the ancient, cosmic death-rebirth cycle that governs all celestial ...",
    "narrative": "The first stars ignite across the Silence, and each one establishes its **dimming window** (the ancient, cosmic death-rebirth cycle that governs all celestial bodies. This is not a myth. It is a fundamental law of existence, older than any deity, crueler than any scripture. Every star that has ever burned has passed through its dimming window, shedding exhausted light and rekindling from within, surrounded by starless space. Every star has successfully emerged from its slumber) until Sol. This cosmic rule ensures that a star's vulnerability is also its ultimate furnace, but the dimming phase acts as a universal broadcast, signaling across the Silence to entities that feed on fading light.",
    "dmHook": "An artifact older than the Star-Fall, older than any known civilization, surfaces in the Cragjaw Peaks. The Fexric claim it predates their oldest holdfasts by millennia. It hums at a frequency that makes Astril heritage weep.",
    "dateDisplay": "Year 474, Freezing Era",
    "locationIds": [],
    "factionIds": [],
    "classIds": [],
    "causes": [],
    "effects": []
  },
  {
    "id": "event-aex-firstborn-of-sol",
    "date": {
      "year": -100,
      "eraId": "before-deepening"
    },
    "title": "Aex, Mother of Suns",
    "type": "cosmic",
    "phase": "before-deepening",
    "description": "Aex comes into being (living solar fire given form, a great parent of the cosmos, the Mother of suns yet unborn. Coiled around bright embers through the long eons, Aex is their gu...",
    "narrative": "**Aex** comes into being (living solar fire given form, a great parent of the cosmos, the Mother of suns yet unborn. Coiled around bright embers through the long eons, Aex is their guardian, its witness, its memory across eons. The oldest Fexric carvings depict Aex as a massive serpent of light coiled around a bright ember. Aex's very body was composed of a specialized, highly concentrated solar fire that could absorb raw thermal shocks, a biological armor of heat that would later inspire the defensive techniques of the **Spellguards** and serve as the physical foundation for the binding seal beneath Sundale.",
    "dmHook": "Aex is not truly dead. Fragments of the firstborn's consciousness linger in the binding seal) and therefore in every Sundered Monolith. A character who touches a Monolith may receive a vision: fire, betrayal, and the face of the one who took the hide.",
    "dateDisplay": "Before the Star-Fall",
    "locationIds": [],
    "factionIds": [],
    "classIds": [],
    "causes": [],
    "effects": []
  },
  {
    "id": "event-the-fexrick-carve-the-first-holdfast",
    "date": {
      "year": -100,
      "eraId": "before-deepening"
    },
    "title": "The Fexric Carve the First Holdfast",
    "type": "cosmic",
    "phase": "before-deepening",
    "description": "The Fexric (compact, gnomish engineers driven by an obsessive, generational mathematical focus) carve their first holdfast into the Cragjaw Peaks. Th...",
    "narrative": "The **Fexric** (compact, gnomish engineers driven by an obsessive, generational mathematical focus) carve their first holdfast into the Cragjaw Peaks. This marks the beginning of the oldest continuous civilization on Mythrill. Their oral maintenance songs, passed down for eight millennia, contain complex architectural equations and alchemical formulas no living Fexric fully understands, representing a lost age of advanced steam-power and clockwork engineering from before the ice sheets advanced.",
    "dmHook": "A Fexric oral song, when translated by a Myrathil Deep Listener, turns out to be a star-chart from before the sky went dark. It points to a location beneath Frostmaw Crag that no Fexric has excavated in six thousand years.",
    "dateDisplay": "Before the Star-Fall",
    "locationIds": [],
    "factionIds": [],
    "classIds": [],
    "causes": [],
    "effects": []
  },
  {
    "id": "event-the-thrumm-awaken",
    "date": {
      "year": -100,
      "eraId": "before-deepening"
    },
    "title": "The Thrumm Awaken",
    "type": "cosmic",
    "phase": "before-deepening",
    "description": "The Thrumm (hulking stone-trolls born of mineral and pressure) awaken in the deepest crags of the mountains. They are the peaks' first children, speak...",
    "narrative": "The **Thrumm** (hulking stone-trolls born of mineral and pressure) awaken in the deepest crags of the mountains. They are the peaks' first children, speaking in a low-frequency rumble that gives them their name. The Fexric call them \"the mountain's heartbeat made flesh.\" Their thick, calcified stone-hide and structural bones would later become the target of Fexric alchemical experiments, leading directly to the creation of the Smoothing Plague and the birth of the Groven.",
    "dmHook": "Thrumm shamans practice a form of lithomancy: reading future events in the cracks of sacred stones. The shamans have been reading the same prophecy for age upon age: \"The smooth ones will return, and the mountain will choose.\" The Groven do not know about this prophecy.",
    "dateDisplay": "Before the Star-Fall",
    "locationIds": [],
    "factionIds": [],
    "classIds": [],
    "causes": [],
    "effects": []
  },
  {
    "id": "event-the-vreken-cultivate-the-deep",
    "date": {
      "year": -100,
      "eraId": "before-deepening"
    },
    "title": "The Vreken Cultivate the Deep",
    "type": "cosmic",
    "phase": "before-deepening",
    "description": "The Vreken (a compact, lantern-eyed people) cultivate phosphorescent fungi in the Bryngloom's bog-caverns. Evolving to survive in the absolute black o...",
    "narrative": "The **Vreken** (a compact, lantern-eyed people) cultivate phosphorescent fungi in the Bryngloom's bog-caverns. Evolving to survive in the absolute black of the deep earth, their irises emit a steady bioluminescent glow, and they perceive \"the trail\": residual light left by passage, death, and decay. They develop a deep, spiritual reverence for the mycelial networks, laying the foundation for the political divide between the high-born **Clean** abbeys and the outcasted **Marked** wilderness guides.",
    "dmHook": "The oldest Vreken fungal-tablet records contain a word that does not translate into any known language. A Neth archivist who glimpsed the tablet went silent for three days, then filed a petition to have the tablet destroyed. The petition was denied. The Neth has not spoken of what they read.",
    "dateDisplay": "Before the Star-Fall",
    "locationIds": [],
    "factionIds": [],
    "classIds": [],
    "causes": [],
    "effects": []
  },
  {
    "id": "event-morvane-establishes-dominion",
    "date": {
      "year": -100,
      "eraId": "before-deepening"
    },
    "title": "Morvane Establishes Dominion",
    "type": "cosmic",
    "phase": "before-deepening",
    "description": "The Morvane establishes its domain over the Bryngloom Forest. The Vreken call it the Root-Veil and revere it as sacred. The entity does not demand wor...",
    "narrative": "The **Morvane** establishes its domain over the Bryngloom Forest. The Vreken call it the Root-Veil and revere it as sacred. The entity does not demand worship (it demands order. Every death in its domain is recorded. Every soul that passes through is weighed, catalogued, and filed, establishing the cosmic bureaucracy that the **Neth** would later exploit to write their First Contract for immortality.",
    "dmHook": "Morvane is not a god. It is something older) a cosmic functionary, a bureaucrat of the threshold between life and whatever comes after. It can be bargained with, but it cannot be lied to. Characters who die in the Bryngloom may find themselves in a waiting room, filling out forms in a language they suddenly understand, while something behind an ironwood desk considers their case.",
    "dateDisplay": "Before the Star-Fall",
    "locationIds": [],
    "factionIds": [],
    "classIds": [],
    "causes": [],
    "effects": []
  },
  {
    "id": "event-mareth-s-first-attempts",
    "date": {
      "year": -100,
      "eraId": "before-deepening"
    },
    "title": "Mareth's First Attempts",
    "type": "cosmic",
    "phase": "before-deepening",
    "description": "Mareth (the vast, semi-conscious intelligence of the Iceheart Sea) makes her first attempts at personhood. She shapes foam into faces, currents into l...",
    "narrative": "Mareth (the vast, semi-conscious intelligence of the Iceheart Sea) makes her first attempts at personhood. She shapes foam into faces, currents into limbs, storms into voices. None of them hold. But she is patient. She has been patient for longer than the continents have had names, slowly preparing the tidal spawning beds that would later explode with life to spawn the **Myrathil** during the Great Eruption.",
    "dmHook": "Mareth is not hostile: she is curious. She wants to understand the creatures that live on her skin. But her attempts at communication have created the Myrathil, the spawning gales, and the storms that sink ships. Characters lost at sea may encounter one of her failed experiments: a face in the foam that speaks in the voice of someone they buried.",
    "dateDisplay": "Before the Star-Fall",
    "locationIds": [],
    "factionIds": [],
    "classIds": [],
    "causes": [],
    "effects": []
  },
  {
    "id": "event-keth-amar-descends",
    "date": {
      "year": 300,
      "eraId": "ingress-breach"
    },
    "title": "Keth-Amar Descends",
    "type": "cosmic",
    "phase": "false-spring",
    "description": "Drawn by the fading beacon of a star in slumber, the abyssal predator Keth-Amar (the Sun-Eater, the First Hunger, a formless entity older than the dis...",
    "narrative": "Drawn by the fading beacon of a star in slumber, the abyssal predator **Keth-Amar** (the Sun-Eater, the First Hunger, a formless entity older than the distinction between life and Silence) descends upon the vulnerable solar core. The predator does not strike immediately; instead, it circles the dying sun like a leviathan in the dark, casting a massive, unseen shadow over Mythrill. The world begins to twist under its gravity. Nightmares of endless hunger plague the sleeping, the southern crops fail as a dry, mineral frost creeps past the northern ranges, and children born during this dark decade emerge with \"predator-eyes\" (black, glassy irises that reflect absolutely no light. The **Skald** of Nordhalla record that their prehistoric clockwork engines grow sluggish, their copper gears grinding as if choked by soot, while the **Waste-Solari** badland rangers urge their clans to dig deeper calderas, refusing to trust the silent vigil of the priests.",
    "dmHook": "Keth-Amar left something behind when it descended) a physical remnant of its passage through the Silence. It fell somewhere in the Iceheart Sea. The Myrathil call it \"the Hunger-Stone\" and have kept its location secret for centuries. Mareth has been circling it, studying it, waiting.",
    "dateDisplay": "Year 300, Ingress",
    "locationIds": [],
    "factionIds": [],
    "classIds": [],
    "causes": [],
    "effects": []
  },
  {
    "id": "event-the-fog-compact-founding-of-greymark-",
    "date": {
      "year": 50,
      "eraId": "star-fall-binding"
    },
    "title": "The Fog Compact (Founding of Greymark)",
    "type": "cosmic",
    "phase": "false-spring",
    "description": "House Thalreth seals the Fog Compact with the forest Sylvain and early Mimir, trading the region's spatial clarity for an insulating, protective mist ...",
    "narrative": "House Thalreth seals the **Fog Compact** with the forest Sylvain and early Mimir, trading the region's spatial clarity for an insulating, protective mist to keep their ironwood forests warm. Greymark Keep is established as their seat of power, carved into three massive converging ironwood roots above a geothermal vent.",
    "dmHook": "The original copy of the Fog Compact, written on heartwood, contains a secret clause detailing a spatial coordinate in the deep woods where the fog does not enter. The Thalreth have kept this coordinate secret for generations.",
    "dateDisplay": "Year 50, Star-Fall Era",
    "locationIds": [],
    "factionIds": [],
    "classIds": [],
    "causes": [],
    "effects": []
  },
  {
    "id": "event-the-underground-exodus",
    "date": {
      "year": 1,
      "eraId": "star-fall-binding"
    },
    "title": "The Underground Exodus",
    "type": "cosmic",
    "phase": "false-spring",
    "description": "As the surface world begins its long freeze, the great migrations begin. The Solari, forewarned by the frantic prophecies of the Hollow-Solari Sun-Speakers, a...",
    "narrative": "As the surface world begins its long freeze, the great migrations begin. The **Solari**, forewarned by the frantic prophecies of the Hollow-Solari Sun-Speakers, are already deep underground when the first glaciers advance. Guided by generational visions of darkness and descent, they establish **The Harath-Vault** deep within Sundale's secondary calderas, though the pragmatic **Waste-Solari** clans refuse the inner rings and build their own calderas along the Shyr basalt highway. In the northern reaches, the **Mimir** (the ancient, shape-shifting faceshifters) retreat into the transitional Fog-Vales of the Frostwood. Surrounded by a memory-stealing mist, their canopy aristocrats forge the first pristine heartwood masks, establishing the **Masked** nobility who use shape-shifting only as a high-born tool of statecraft, while the outcasted **Fractured** Mimir floor-scrappers wear crude composite masks of salvaged fragments, building a black market of salvaged memories in the dark undergrowth.",
    "dmHook": "Some Solari tunnels were sealed from the inside during the exodus: sections that Sun-Speakers declared \"unclean.\" No living Solari remembers why. The seals have never been broken. Something is still down there, waiting in the dark beneath Sundale, and it is not Keth-Amar.",
    "dateDisplay": "Year 1, Star-Fall Era",
    "locationIds": [],
    "factionIds": [],
    "classIds": [],
    "causes": [],
    "effects": []
  },
  {
    "id": "event-sera-solvan-the-first-martyr",
    "date": {
      "year": 325,
      "eraId": "ingress-breach"
    },
    "title": "Sera Solvan, the First Martyr",
    "type": "cosmic",
    "phase": "false-spring",
    "description": "The historical tragedy of the capitulation is forever marked by the name of Sera Solvan, a Solvarn mother who became the first Martyr. While the other...",
    "narrative": "The historical tragedy of the capitulation is forever marked by the name of **Sera Solvan**, a Solvarn mother who became the first **Martyr**. While the other noble patriarchs surrendered their firstborn heirs in silent, shame-filled secrecy to secure the volcanic vents, Sera refused to let her child's sacrifice be forgotten. As her infant was dragged into the northern rift, she took a shard of jagged volcanic obsidian and carved the child's true name deep into her forearm. The blood-spelled scar did not heal; instead, it began to glow with a pale, sympathetic solar fire that flared whenever she drew near the binding seals. This mark of ultimate maternal grief became an inherited biological legacy, passed down through her bloodline to every descendant. Her sacrifice birthed the Martyr calling: a lineage of protectors who carry the literal wounds of their people in their own flesh, turning their pain into an impenetrable shield.",
    "dmHook": "Sera Solvan's original journal survives in the Greymark archive, written in a code that only her bloodline can read. The journal contains the names of all six sacrificed children: names that were burned from every official record. Speaking a child's true name near the Monolith tied to their bloodline causes the Monolith to resonate differently. No one has tried this. No one knows what would happen.",
    "dateDisplay": "Year 325, Blizzard's End",
    "locationIds": [],
    "factionIds": [],
    "classIds": [],
    "causes": [],
    "effects": []
  },
  {
    "id": "event-the-first-exorcists-rise",
    "date": {
      "year": 327,
      "eraId": "ingress-breach"
    },
    "title": "The First Exorcists Rise",
    "type": "cosmic",
    "phase": "false-spring",
    "description": "The release of the Wyrd triggers an immediate, desperate immune response from the mortal races. Within months of the Shattering, the first Exorcists emerg...",
    "narrative": "The release of the Wyrd triggers an immediate, desperate immune response from the mortal races. Within months of the Shattering, the first **Exorcists** emerge (steel-willed scholars and priests who discover that the Wyrd-corruption can be bound, contained, and banished using rusted cold iron, burning salt, and sacred terror. Alongside them, the **Apexes** begin tracking the invisible spoor of Wyrd-manifestations through the freezing fog, while **Deathcallers** tune their hearing to the screams of the victims whose souls are trapped within the rot. Most tragic of all are the **Inquisitors**: an elite order of **Marked Vreken** and outcasted **Drun Neth** who take the Barbed Vow, using their biological trail-sight to hunt down their own spore-addicted, \"Over-Lit\" kin before the mycelial corruption can consume their minds.",
    "dmHook": "The first Exorcist) whose name has been lost to history: left behind a grimoire called \"The Anathema.\" It contains rituals for permanently destroying Wyrd-creatures by addressing the specific fear that birthed them. The grimoire was stolen from the Greymark archive forty years ago. It resurfaces at your campaign's most desperate moment, in the hands of someone who should not have it.",
    "dateDisplay": "Year 327, Ingress",
    "locationIds": [],
    "factionIds": [],
    "classIds": [],
    "causes": [],
    "effects": []
  },
  {
    "id": "event-synod-hold-established",
    "date": {
      "year": 240,
      "eraId": "freezing-era"
    },
    "title": "Synod Hold Established",
    "type": "cosmic",
    "phase": "first-ebbing",
    "description": "House Ordavan establishes Synod Hold as a permanent trade post and gathering place in the starless Sundrift Vale. They trade nomadic wool and hide for...",
    "narrative": "House Ordavan establishes **Synod Hold** as a permanent trade post and gathering place in the starless Sundrift Vale. They trade nomadic wool and hide for southern geothermal resources, drawing herders and Astril to settle in concentric stone rings.",
    "dmHook": "The central stone circle at Synod Hold is built from seven standing stones that hum at the same frequency as the Sundered Monoliths, suggesting they were harvested from the same ancient geological vein.",
    "dateDisplay": "Year 240, Freezing Era",
    "locationIds": [],
    "factionIds": [],
    "classIds": [],
    "causes": [],
    "effects": []
  },
  {
    "id": "event-the-stasis-of-aldren-thalreth-the-elder",
    "date": {
      "year": 170,
      "eraId": "freezing-era"
    },
    "title": "The Stasis of Aldren Thalreth the Elder",
    "type": "cosmic",
    "phase": "first-ebbing",
    "description": "Fearing the total loss of his memory to the creeping Frostwood fog, High Confessor Aldren Thalreth the Elder (ancestor of the line that still rules Gr...",
    "narrative": "Fearing the total loss of his memory to the creeping Frostwood fog, High Confessor **Aldren Thalreth the Elder** (ancestor of the line that still rules Greymark) journeys to Nordhalla and seals himself in meditative stasis inside a block of warm, glowing ice within the Frozen Archive. Scribe-Sentinels stand watch eternally to record any telepathic whispers from the frozen saint.",
    "dmHook": "The Elder's stasis chamber is radiating accelerated heat. If the ice melts, his return will trigger a massive theological crisis, as his last journals contradict the Church's official scriptures regarding Blizzard’s End.",
    "dateDisplay": "Year 170, Freezing Era",
    "locationIds": [],
    "factionIds": [],
    "classIds": [],
    "causes": [],
    "effects": []
  },
  {
    "id": "event-the-unlit-veil-reach-synod-hold",
    "date": {
      "year": 235,
      "eraId": "freezing-era"
    },
    "title": "The Unlit Veil Reach Synod Hold",
    "type": "cosmic",
    "phase": "first-ebbing",
    "description": "The first Unlit Veil couriers arrive at Synod Hold, offering \"trade consultation services\" and navigation charts. This marks the beginning of their sl...",
    "narrative": "The first **Unlit Veil** couriers arrive at Synod Hold, offering \"trade consultation services\" and navigation charts. This marks the beginning of their slow intelligence infiltration of the Sundrift Vale, positioning advisors at every Ordavan minister's elbow. The Veil are Astril who have learned to suppress their markings, the only Astril who can lie without their skin betraying them, making them the perfect spies.",
    "dmHook": "An Unlit Veil memory-crystal from this first contact is locked in the Synod vault. It contains the names of House Ordavan nobles who traded grazing rights for Vecross secrets: and the First Liar still holds those names as exploit.",
    "dateDisplay": "Year 235, Freezing Era",
    "locationIds": [],
    "factionIds": [],
    "classIds": [],
    "causes": [],
    "effects": []
  },
  {
    "id": "event-the-florae-siege-of-greymark",
    "date": {
      "year": 400,
      "eraId": "freezing-era"
    },
    "title": "The Florae Siege of Greymark",
    "type": "cosmic",
    "phase": "contraction",
    "description": "Florae raiders, seeking to reclaim their ancestral wood from House Thalreth, breach the outer palisade of Greymark Keep. Scribe-Sentinels and Thalren...",
    "narrative": "Florae raiders, seeking to reclaim their ancestral wood from House Thalreth, breach the outer palisade of Greymark Keep. Scribe-Sentinels and Thalren soldiers fight house-to-house for three days before repelling the invaders.",
    "dmHook": "The siege ended when the Thalreth released a high-density surge of memory-fog, hollowing the minds of the attacking Florae. The descendants of those attackers still wander the woods as mindless sentinel-shells.",
    "dateDisplay": "Year 400, Freezing Era",
    "locationIds": [],
    "factionIds": [],
    "classIds": [],
    "causes": [],
    "effects": []
  },
  {
    "id": "event-cult-of-forgotten-shadow-founded",
    "date": {
      "year": 431,
      "eraId": "freezing-era"
    },
    "title": "Cult of Forgotten Shadow Founded",
    "type": "cosmic",
    "phase": "contraction",
    "description": "Natalie Seline, a rogue Neth pact-weaver, founds the Cult of Forgotten Shadow in a peat-crypt beneath the Over-Shanty in the Bryngloom Forest. The Cul...",
    "narrative": "Natalie Seline, a rogue Neth pact-weaver, founds the **Cult of Forgotten Shadow** in a peat-crypt beneath the Over-Shanty in the Bryngloom Forest. The Cult begins practicing shadow-confession and memory extraction, trading crystal vials of harvested memories.",
    "dmHook": "Natalie Seline's first extracted memory-her own name and face-remains in the Sunken Confessionals. The Neth pact-lords will pay any price to destroy it.",
    "dateDisplay": "Year 431, Freezing Era",
    "locationIds": [],
    "factionIds": [],
    "classIds": [],
    "causes": [],
    "effects": []
  },
  {
    "id": "event-the-mounds-fall-silent",
    "date": {
      "year": 440,
      "eraId": "freezing-era"
    },
    "title": "The Mounds Fall Silent",
    "type": "cosmic",
    "phase": "squeeze",
    "description": "Nomadic clans of the Sundrift Vale report that three major ancestral burial mounds have fallen completely silent. The low-frequency hum that guided mi...",
    "narrative": "Nomadic clans of the Sundrift Vale report that three major ancestral burial mounds have fallen completely silent. The low-frequency hum that guided migrations for centuries vanishes, causing herders to lose their way in the starless steppes.",
    "dmHook": "The mounds didn't fall silent naturally. The Unlit Veil excavated their cores, siphoning the ancestral resonance into memory-crystals for sale in the south. The First Liar now possesses three hundred years of stolen Ordan ancestor-voices: and is listening.",
    "dateDisplay": "Year 440, Freezing Era",
    "locationIds": [],
    "factionIds": [],
    "classIds": [],
    "causes": [],
    "effects": []
  },
  {
    "id": "event-the-erasure-of-house-viridane",
    "date": {
      "year": 335,
      "eraId": "freezing-era"
    },
    "title": "The Erasure of House Viridane",
    "type": "cosmic",
    "phase": "squeeze",
    "description": "Determined to justify their own survival, the six capitulating noble houses spend three centuries systematically erasing every record of House Viridan...",
    "narrative": "Determined to justify their own survival, the six capitulating noble houses spend three centuries systematically erasing every record of **House Viridane**'s existence (the house that said *no*, the house that chose flight over sacrifice. Official histories are rewritten, libraries are burned, and lineages are forged. The lie holds in all human capitals: there were always only seven houses. The thorn-born **Florae** become the only living archive of the eighth house's existence, their oral tradition and migrating briar-scars keeping the memory of the refusal alive in the deep fog.",
    "dmHook": "A hidden chamber beneath the oldest Florae grove contains the Viridane family tree, grown from thorn-vine and preserved in moon-silver. It shows every descendant) and it shows that the bloodline did not die out. A living Viridane heir exists somewhere in the Frostwood Reach, unaware of their heritage. The Florae Lunarchs know who it is. They have been protecting this person for generations.",
    "dateDisplay": "Year 335, Freezing Era",
    "locationIds": [],
    "factionIds": [],
    "classIds": [],
    "causes": [],
    "effects": []
  },
  {
    "id": "event-the-great-fire-of-the-over-shanty",
    "date": {
      "year": 460,
      "eraId": "freezing-era"
    },
    "title": "The Great Fire of the Over-Shanty",
    "type": "cosmic",
    "phase": "intrusion",
    "description": "A massive fire breaks out in the Over-Shanty, threatening to burn down the entire suspended platforms slum. The Cult of Forgotten Shadow uses shadow m...",
    "narrative": "A massive fire breaks out in the Over-Shanty, threatening to burn down the entire suspended platforms slum. The Cult of Forgotten Shadow uses shadow magic to contain the flames, earning grudging respect from the Drun outcasts.",
    "dmHook": "The fire was set by Velun Neth agents attempting to incinerate the wanted boards and memory vaults of the Dangling Keel.",
    "dateDisplay": "Year 460, Freezing Era",
    "locationIds": [],
    "factionIds": [],
    "classIds": [],
    "causes": [],
    "effects": []
  },
  {
    "id": "event-the-last-mimir-birth",
    "date": {
      "year": 470,
      "eraId": "freezing-era"
    },
    "title": "The Last Mimir Birth",
    "type": "cosmic",
    "phase": "intrusion",
    "description": "The mother-flame (the sacred Mimir birthing fire maintained by midwives since before the Purge) gutters and goes out. The final Mimir birth occurs, bu...",
    "narrative": "The mother-flame (the sacred Mimir birthing fire maintained by midwives since before the Purge) gutters and goes out. The final Mimir birth occurs, but the child emerges **maskless**: a child whose mask cracked during the birthing ritual, leaving them without a stable face. Evolving a shifting parade of historical faces belonging to ancestors both living and dead, the child becomes a living archive of the Mimir race. The elders are paralyzed, unable to decide whether this child is a sign of their ultimate extinction or the first step toward a maskless rebirth.",
    "dmHook": "The maskless child is now thirty years old. They live in the deepest canopy-hold, hidden from the world. They have never worn a mask. Their face shifts constantly: a parade of strangers, some living, some dead, some who have never existed. The child can tell you who each face belongs to. Some of them are people who died centuries ago. One of them is someone who has not been born yet.",
    "dateDisplay": "Year 470, Freezing Era",
    "locationIds": [],
    "factionIds": [],
    "classIds": [],
    "causes": [],
    "effects": []
  },
  {
    "id": "event-the-monoliths-change-resonance",
    "date": {
      "year": 472,
      "eraId": "freezing-era"
    },
    "title": "The Monoliths Change Resonance",
    "type": "cosmic",
    "phase": "intrusion",
    "description": "The Sundered Monoliths (the seven fragments of the original binding seal dormant since Keth-Amar's breach) begin to wake in sequence. The Deep Myrathi...",
    "narrative": "The **Sundered Monoliths** (the seven fragments of the original binding seal dormant since Keth-Amar's breach) begin to wake in sequence. The Deep Myrathil Listeners feel the Iceheart Shard thrumming like a plucked string, while the Groven report the Shard beneath Frostmaw Crag has begun to sing, its vibrations cracking the calcified bridges of the Ancestor-Spans and making the stone weep. The Astril's Lumia heritage convulses in agony near any Monolith, realizing that the predator inside the vault has turned its attention to the fragments of its original victory.",
    "dmHook": "The seven Monoliths are not waking independently. They are waking in sequence (each one activating the next in a chain reaction that circles the world. The pattern traces a spiral that, when mapped, points to a single location: a point in the Silence directly above Emberspire's caldera. Whatever happens when the last Monolith wakes will happen there. The Astril Remnant) the last visible light: is positioned exactly at that point.",
    "dateDisplay": "Year 472, Freezing Era",
    "locationIds": [],
    "factionIds": [],
    "classIds": [],
    "causes": [],
    "effects": []
  },
  {
    "id": "event-the-shifting-of-the-spawning-gales",
    "date": {
      "year": 473,
      "eraId": "freezing-era"
    },
    "title": "The Shifting of the Spawning Gales",
    "type": "cosmic",
    "phase": "intrusion",
    "description": "The spawning gales: the oceanic storms that have created new Myrathil for centuries — shift north. The First Shore, the stretch of Iceheart coastline ...",
    "narrative": "The spawning gales: the oceanic storms that have created new Myrathil for centuries — shift north. The First Shore, the stretch of Iceheart coastline where Myrathil have spawned for millennia, grows quiet, its waves stilling and its foam thinning. **Mareth** shifts her storms toward Nordhalla's frozen coast, positioned directly over the deepest oceanic trench. Evolving a desperate defensive intelligence, Mareth is massing her Myrathil forces along the seabed to block Keth-Amar's geothermal hunger from breaching the ocean floor.",
    "dmHook": "Mareth is repositioning her forces. She knows something the land-folk do not: Keth-Amar's influence is not limited to the Sundered Monoliths. It is spreading through the world's geothermal network, following the vents and volcanic channels that warm the surface. Mareth is moving the Myrathil toward the point where the predator's influence will breach the ocean floor.",
    "dateDisplay": "Year 473, Freezing Era",
    "locationIds": [],
    "factionIds": [],
    "classIds": [],
    "causes": [],
    "effects": []
  },
  {
    "id": "event-whispering-pine-awakening",
    "date": {
      "year": 12,
      "eraId": "star-fall-binding"
    },
    "title": "The Awakening of the Whispering Pine",
    "type": "arcane",
    "phase": "false-spring",
    "description": "As the first continental frost-wave deepened, the ancient ironwood taiga absorbed trace volcanic sulfur from subterranean fissures. The needle-canopy began to vibrate in harmonic resonance with arctic gales, creating the eerie 'voices' that warned early Skald settlers of encroaching glacier wyrms.",
    "locationIds": [
      "whispering-pine",
      "hrafnskogur",
      "frostholm"
    ],
    "factionIds": [
      "house-skalvyr",
      "Corvani Flocks",
      "Skald Keepers"
    ],
    "classIds": [
      "animist",
      "warden",
      "augur"
    ],
    "causes": [
      "event-entombment"
    ],
    "effects": [
      "event-corvani-whispering-pact"
    ],
    "narrative": "When the sun was bound beneath Sundale, the cold plunged northward with terrifying speed. In the highland basin of the Icetalon, five million evergreen pines froze solid in a single night. Yet instead of snapping under the weight of ice, the ironwood trees drew upon deep geothermal steam vents, mineralizing their wood with iron and quartz. When the winds roared down from the peaks, the needles resonated like copper chimes. The Skald called it the 'Voice of the Ancestors' — an acoustic early-warning network that echoed across sixty leagues.",
    "dmHook": "The oldest grandmother pine in the center of the forest still hums a specific three-chord progression before a Wyrd-storm. An Animist who sleeps with their ear pressed to its petrified root-bark will receive a vision of the exact hour the next celestial tremor will strike.",
    "dateDisplay": "Year 12, Star-Fall Era"
  },
  {
    "id": "event-corvani-whispering-pact",
    "date": {
      "year": 28,
      "eraId": "star-fall-binding"
    },
    "title": "The Corvan Roost-Charter of Hrafnest",
    "type": "political",
    "phase": "false-spring",
    "description": "Matriarch Morwenna of the Corvani Flocks negotiated the historic roosting treaty with King-Jarl Aethil Skalvyr, ceding timber harvesting rights in exchange for autonomous governance of the cliff-aeries and monopoly over inter-realm raven messengers.",
    "locationIds": [
      "hrafnest",
      "whispering-pine",
      "vesperas-perch",
      "frostholm"
    ],
    "factionIds": [
      "Corvani Flocks",
      "house-skalvyr"
    ],
    "classIds": [
      "minstrel",
      "warden"
    ],
    "causes": [
      "event-whispering-pine-awakening"
    ],
    "effects": [
      "event-snowcall-coalition"
    ],
    "narrative": "Faced with freezing skies and territorial competition from Skald lumberjacks, Matriarch Morwenna descended from the Icetalon spires with five thousand ravens swirling in a dark vortex. In the Great Meadhall of Frosthold, she laid three feathers of pure frost upon the high hearth and offered a bargain: the Corvani would serve as the living eyes and ears of Nordhalla, carrying letters through blizzards that would ground any human scout, if the Skald swore to never fell a roost-tree in Hrafnskógur.",
    "dmHook": "A hidden clause in the original charcoal parchment of the Roost-Charter grants the Corvani Matriarch veto power over any timber harvest exceeding one hundred ironwood trunks. A rogue logging syndicate is currently attempting to burn the archive copy to expand their operations.",
    "dateDisplay": "Year 28, Star-Fall Era"
  },
  {
    "id": "event-bloodhammer-first-anvil",
    "date": {
      "year": 18,
      "eraId": "star-fall-binding"
    },
    "title": "The First Cold-Iron Anvil at Bloodhammer Sump",
    "type": "cultural",
    "phase": "false-spring",
    "description": "Grum Bloodhammer struck the first cold-iron anvil inside the volcanic crater of Bloodhammer Sump, creating runic alloy armor capable of enduring glacier-cold without fracturing.",
    "locationIds": [
      "bloodhammer-sump",
      "frostholm",
      "fjord-gate"
    ],
    "factionIds": [
      "Bloodhammer Clan",
      "house-skalvyr"
    ],
    "classIds": [
      "ironclad",
      "berserker"
    ],
    "causes": [
      "event-entombment"
    ],
    "effects": [
      "event-sunder-wall-erection"
    ],
    "narrative": "Traditional bronze and soft iron weapons shattered like glass against the frost-wraiths roaming the glacial moraine. Grum Bloodhammer, scorched from dipping his arms into sulfuric magma trenches, hauled a nine-hundred-pound meteoric iron block to the crater rim. Mixing volcanic sulfur with crushed magnetite and whale bone ash, he forged the legendary 'Frost-Cleaver' war-axes that allowed the Skald to reclaim the fjord valleys.",
    "dmHook": "The original master-anvil upon which Grum forged the first runic axe is still embedded in the heart of Sump Vent 1. It is said that any weapon quenched in its magma-trough receives a permanent rune of unyielding kinetic force.",
    "dateDisplay": "Year 18, Star-Fall Era"
  },
  {
    "id": "event-silence-vow-thogn",
    "date": {
      "year": 42,
      "eraId": "star-fall-binding"
    },
    "title": "The Silence-Vow of Þögn & the Breathless Stair",
    "type": "ritual",
    "phase": "false-spring",
    "description": "Consecration of the Breathless Stair and the sacred Silence-Cliff of Þögn, where the first generation of Rime-Born elders climbed three thousand steps to freeze traumatic memories of the dying world.",
    "locationIds": [
      "thogn",
      "breathless-stair",
      "frozen-archive"
    ],
    "factionIds": [
      "Skald Keepers",
      "The Frozen Archive"
    ],
    "classIds": [
      "augur",
      "martyr",
      "chronarch"
    ],
    "causes": [
      "event-entombment"
    ],
    "effects": [],
    "narrative": "The grief of watching green meadows die under mountains of ice drove dozens of early clan elders to despair. Seeking solace, hermit shamans discovered a granite precipice where the screaming polar gales dropped dead silent. They carved three thousand steps into the ice-covered rockface. Those who ascended to the top drank distilled rime-melt and chiseled their memories into the cliff face, feeling their sorrow freeze into numb, peaceful stillness.",
    "dmHook": "A disgraced Augur who climbed Þögn forty years ago chiseled an unbroken sequence of future dates into the stone ledge before taking the Silence-Vow. The final date chiseled on the cliff is tomorrow's sunrise.",
    "dateDisplay": "Year 42, Star-Fall Era"
  },
  {
    "id": "event-swallow-heart-awakening",
    "date": {
      "year": 35,
      "eraId": "star-fall-binding"
    },
    "title": "The Swallow-Heart Awakening at Sválghjarta",
    "type": "calamity",
    "phase": "false-spring",
    "description": "Miners excavating obsidian beneath the Icetalon peaks broke into a subterranean cavern and unearthed the Swallow-Heart, an eldritch pulsating organ of dark heat that gave birth to the fanatical Hungríd Cult.",
    "locationIds": [
      "svalghjartas-keep",
      "blodholl",
      "mord-cradle-camp"
    ],
    "factionIds": [
      "The Hungríd Cult",
      "Skald Berserkers"
    ],
    "classIds": [
      "blood_knight",
      "berserker",
      "inquisitor"
    ],
    "causes": [
      "event-entombment"
    ],
    "effects": [
      "event-blood-hall-rites"
    ],
    "narrative": "When miners struck the black glass vein, the ground groaned with the rhythmic thump of a giant heart. The air inside the cavern heated to blood-warmth within seconds, melting the glacier overhead and creating a labyrinth of steaming basalt galleries. Lord Vaelen Sválghjarta drank the ichor seeping from the heart, his skin turning obsidian black and his veins glowing crimson with unnatural heat. He declared that those who fed the Swallow-Heart with blood would never freeze.",
    "dmHook": "The Hungríd Cult is secretly smuggling frozen corpses from the Heir-Mounds to feed the Swallow-Heart. The heart's pulse rate has doubled in the past three weeks, causing violent geothermal eruptions beneath Snowcall City.",
    "dateDisplay": "Year 35, Star-Fall Era"
  },
  {
    "id": "event-sunder-wall-erection",
    "date": {
      "year": 80,
      "eraId": "star-fall-binding"
    },
    "title": "The Raising of the Sunder-Wall",
    "type": "military",
    "phase": "deepening-winter",
    "description": "Following relentless raids by nomadic Øsling warbands and rampaging Jutul frost-giants, King-Jarl Halvar ('Iron-Tooth') commanded the construction of the 300-foot ice-and-iron Sunder-Wall across the valley mouth.",
    "locationIds": [
      "sunder-wall-gates",
      "frostholm",
      "ymirs-hold",
      "frostfang-wastes"
    ],
    "factionIds": [
      "house-skalvyr",
      "Bloodhammer Clan",
      "Øsling Clan Confederation"
    ],
    "classIds": [
      "ironclad",
      "warden",
      "spellguard"
    ],
    "causes": [
      "event-bloodhammer-first-anvil"
    ],
    "effects": [],
    "narrative": "Five thousand Skald masons, Bloodhammer smiths, and Icechamber engineers worked continuously for five years in twenty-below blizzards. They anchored two thousand iron I-beams into mountain bedrock, packing the gaps with granite boulders and freezing them into solid monoliths with pumped seawater. The Sunder-Wall became the impenetrable shield protecting the civil fjord valleys from the feral monsters of the northern polar wastes.",
    "dmHook": "A deep fracture has appeared along the southern foundation of the Sunder-Wall near Gate 3. Sabotage marks resembling Jutul giant stone-chisels have been discovered along the iron pins.",
    "dateDisplay": "Year 80, Star-Fall Era"
  },
  {
    "id": "event-snowcall-coalition",
    "date": {
      "year": 62,
      "eraId": "star-fall-binding"
    },
    "title": "The Snowcall Charter & Free City Concord",
    "type": "political",
    "phase": "deepening-winter",
    "description": "Signing of the Snowcall Charter between House Skalvyr, High Neth scholar-refugees, and Corvani roost-merchants, establishing Snowcall City as a neutral highland sanctuary of trade, legal archives, and commerce.",
    "locationIds": [
      "snowcall-city",
      "saltgrinn",
      "stonegrip",
      "frostholm"
    ],
    "factionIds": [
      "house-skalvyr",
      "High Neth",
      "Corvani Roost-Merchants"
    ],
    "classIds": [
      "augur",
      "minstrel",
      "chronarch"
    ],
    "causes": [
      "event-corvani-whispering-pact"
    ],
    "effects": [],
    "narrative": "As civil unrest spread across the southern continents, hundreds of High Neth legal scribes and merchants fled north carrying cartloads of illuminated manuscripts and gold ingots. Meeting atop the geothermal terraces of the Icetalon, they swore the Snowcall Concord with Jarl Sigurd Skalvyr: the scholars would maintain the legal registries and trade ledgers of the north in exchange for permanent residential wards warmed by mountain steam conduits.",
    "dmHook": "The Slate Scriptorium in Snowcall City houses a copy of the First Binding Charter that contains three lines of text missing from all southern copies — lines that name the original sacrifice required to relight the sun.",
    "dateDisplay": "Year 62, Star-Fall Era"
  }
];

const EVENT_TYPES = {
  "cosmic": {
    "label": "Cosmic",
    "icon": "star"
  },
  "ritual": {
    "label": "Ritual",
    "icon": "fire"
  },
  "pact": {
    "label": "Pact",
    "icon": "scroll"
  },
  "catastrophe": {
    "label": "Catastrophe",
    "icon": "bolt"
  },
  "founding": {
    "label": "Founding",
    "icon": "flag"
  },
  "political": {
    "label": "Political",
    "icon": "crown"
  },
  "discovery": {
    "label": "Discovery",
    "icon": "magnifying-glass"
  },
  "conspiracy": {
    "label": "Conspiracy",
    "icon": "mask"
  },
  "disaster": {
    "label": "Disaster",
    "icon": "house-damage"
  },
  "conflict": {
    "label": "Conflict",
    "icon": "swords"
  },
  "migration": {
    "label": "Migration",
    "icon": "footprints"
  },
  "schism": {
    "label": "Schism",
    "icon": "split"
  },
  "cultural": {
    "label": "Cultural",
    "icon": "masks"
  }
};

const useTimelineStore = create((set, get) => ({
  calendar: MYTHRILL_CALENDAR,
  events: SEEDED_EVENTS,
  rebirthCycles: AEX_SCREAM_PULSES,
  warmthPhases: WARMTH_PHASES,
  tradeRoutes: TRADE_ROUTES,

  getEvent: (eventId) => get().events.find((e) => e.id === eventId) || null,

  getEventsByEra: (eraId) => get().events.filter((e) => e.date.eraId === eraId),

  getEventsByYear: (year) => get().events.filter((e) => e.date.year === year),

  getEventsByPhase: (phaseId) => get().events.filter((e) => e.phase === phaseId),

  getEventsByLocation: (locationId) =>
    get().events.filter((e) => e.locationIds && e.locationIds.includes(locationId)),

  getEventsByFaction: (factionId) =>
    get().events.filter((e) => e.factionIds && e.factionIds.includes(factionId)),

  getEventsByClass: (classId) =>
    get().events.filter((e) => e.classIds && e.classIds.includes(classId)),

  getEventsByType: (type) => get().events.filter((e) => e.type === type),

  getTimelineFor: ({ locationIds, factionIds, classIds }) => {
    const filters = [];
    if (locationIds) filters.push((e) => e.locationIds && locationIds.some((id) => e.locationIds.includes(id)));
    if (factionIds) filters.push((e) => e.factionIds && factionIds.some((id) => e.factionIds.includes(id)));
    if (classIds) filters.push((e) => e.classIds && classIds.some((id) => e.classIds.includes(id)));

    if (filters.length === 0) return get().events;

    return get().events.filter((e) => filters.some((fn) => fn(e)));
  },

  getCausalChain: (eventId) => {
    const event = get().getEvent(eventId);
    if (!event) return { causes: [], effects: [] };
    return {
      causes: (event.causes || []).map((id) => get().getEvent(id)).filter(Boolean),
      effects: (event.effects || []).map((id) => get().getEvent(id)).filter(Boolean)
    };
  },

  getChronology: () => CHRONOLOGY_ERA_DISPLAY,

  getEraTimeline: () => {
    const eras = get().calendar.eras;
    return eras.map((era) => ({
      ...era,
      events: get()
        .events.filter((e) => e.date.eraId === era.id)
        .sort((a, b) => a.date.year - b.date.year)
    }));
  },

  getPhaseTimeline: () => {
    return get().warmthPhases.map((phase) => ({
      ...phase,
      events: get()
        .events.filter((e) => e.phase === phase.id)
        .sort((a, b) => a.date.year - b.date.year)
    }));
  },

  getMonth: (monthId) => get().calendar.months.find((m) => m.id === monthId) || null,

  getHoliday: (holidayId) => get().calendar.holidays.find((h) => h.id === holidayId) || null,

  getEventTypes: () => EVENT_TYPES,

  getRebirthCycle: (cycleNumber) => get().rebirthCycles.find((c) => c.cycle === cycleNumber) || null,

  getWarmthPhase: (phaseId) => get().warmthPhases.find((p) => p.id === phaseId) || null,

  getWarmthPhaseForYear: (year) => {
    const phases = get().warmthPhases;
    for (const phase of phases) {
      const [start, end] = phase.years.split('-').map(Number);
      if (year >= start && year <= end) return phase;
    }
    return phases[phases.length - 1];
  },

  getTradeRoute: (routeId) => get().tradeRoutes.find((r) => r.id === routeId) || null,

  getTradeRoutesByLocation: (locationId) =>
    get().tradeRoutes.filter((r) =>
      r.origin === locationId || r.destination === locationId ||
      (r.via && r.via.includes(locationId))
    ),

  addEvent: (event) =>
    set((state) => ({ events: [...state.events, { ...event, id: event.id || `event-${Date.now()}` }] })),

  updateEvent: (eventId, updates) =>
    set((state) => ({
      events: state.events.map((e) => (e.id === eventId ? { ...e, ...updates } : e))
    })),

  removeEvent: (eventId) =>
    set((state) => ({ events: state.events.filter((e) => e.id !== eventId) }))
}));

export { CHRONOLOGY_ERA_DISPLAY, MYTHRILL_CALENDAR, EVENT_TYPES, SEEDED_EVENTS, AEX_SCREAM_PULSES, WARMTH_PHASES, TRADE_ROUTES };
export default useTimelineStore;
