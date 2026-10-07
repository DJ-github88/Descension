/**
 * Character Background Data Module
 * 
 * Defines all available character backgrounds with their mechanical benefits,
 * skill proficiencies, equipment, and roleplay features.
 * 
 * Phase 4 (2026-06-10): All 15 D&D SRD backgrounds replaced with Mythrill-native backgrounds.
 * Old entries preserved in comments for reference.
 */

/*
 * ============================================================================
 * OLD D&D SRD BACKGROUNDS (Phase 4, commented out, replaced below)
 * ============================================================================
 * 
 * export const BACKGROUND_DATA = {
 *   acolyte: {
 *     id: 'acolyte',
 *     name: 'Acolyte',
 *     description: 'You have spent your life in service to a temple, learning sacred rites and providing sacrifices to the spirit or spirits you worship.',
 *     skillProficiencies: ['Insight', 'Religion'],
 *     languages: 2,
 *     equipment: ['Holy symbol', 'Prayer book', 'Incense (5 sticks)', 'Vestments', 'Common clothes'],
 *     startingCurrency: { gold: 12, silver: 8, copper: 0 },
 *     feature: { name: 'Shelter of the Faithful', description: 'You and your companions can receive free healing and care at temples, shrines, and other religious establishments.' },
 *     statModifiers: { spirit: 3, intelligence: -1 }
 *   },
 *   criminal: { ... },
 *   folkHero: { ... },
 *   noble: { ... },
 *   sage: { ... },
 *   soldier: { ... },
 *   charlatan: { ... },
 *   entertainer: { ... },
 *   guildArtisan: { ... },
 *   hermit: { ... },
 *   outlander: { ... },
 *   sailor: { ... },
 *   merchant: { ... },
 *   urchin: { ... },
 *   scholar: { ... }
 * };
 */

export const BACKGROUND_DATA = {
  emberspirePilgrim: {
    id: 'emberspirePilgrim',
    restrictions: {
      "allowedRegions": [
        "sundale"
      ],
      "allowedSubraces": [
        'korr_solari',
        'thrask_solari',
        'thalren_human'
      ],
      "narrativeUnlock": true,
      "justification": "The pilgrimage to Emberspire is a specific journey requiring proximity to Sundale. Outsiders can take it with a narrative reason for the pilgrimage."
    },
    classHooks: [
      { classId: 'martyr', bridge: 'Witnessing Sol\'s Breath fade kindles the theology of willing suffering; many pilgrims take the Vow within a year.' },
      { classId: 'pyrofiend', bridge: 'Proximity to Emberspire draws the desperate toward Scathrach deeper vents; some pilgrims never climb back out.' },
      { classId: 'spellguard', bridge: 'Forgeside exposure to volatile Sol\'s Breath resonance is the on-ramp into the Damon tradition of magical defense.' }
    ],
    tensionPairings: [
      { classId: 'augur', tension: 'A pilgrim who reads the sun\'s dimming as an Augur may conclude the Reforging is a lie the Vigil already knows.' }
    ],
    subraceFlavor: {
      korr_solari: 'You climbed from the deep vaults; the light was the first sky you ever saw.',
      thrask_solari: 'You already wore the ash; the pilgrimage just gave the burning a name.',
      thalren_human: 'You came from the fog and found a heat that erases memory instead of keeping it.',
      skald_human: 'You climbed south out of the ice to see a sun that still burned.',
      tessen_human: 'You left the sealed keep on the one pilgrimage the gates allow.',
      merryn_human: 'You came ashore from a freezing sea to stand before the buried sun.',
      ordan_human: 'You followed a star-song that pointed at the caldera.'
    },
    name: 'Pilgrim',
    description: 'Every year, the faithful climb the volcanic Ashen Escarpment to the temple-city of Emberspire, where Sol\'s Breath (the buried sun) burns behind sealed obsidian. The Dawn Vigil, the order that guards the sun\'s prison, watches over the pilgrimage, and watches the pilgrims. You made the climb. You saw the light that the Reforging (the promised restoration of the sun) promises to restore, filtering through the Obsidian Citadels where indentured Ash-Dwellers haul basalt for a spirit they are forbidden to pray to. Some descend with the Vigil\'s seal branded on their throats, ready to spread the call of rebirth to every frozen port. Others descend with doubt gnawing where the brand should be. You carried your phial of captured Sol\'s Breath-light down to Ember Lagoon, where the Vigil\'s black-hulled ships carry the faithful and the faithless alike to whatever the Dawn Vigil calls service. The sun is buried. The Vigil says it will rise again. You have seen what lies beneath the obsidian, and you cannot unsee it. What you do with that knowledge is the only question the Vigil left unanswered.',
    skillProficiencies: ['Insight', 'Religion'],
    languages: 2,
    equipment: [
      'Sealed Sol\'s Breath phial',
      'Basalt prayer-beads',
      'Ash-cloth robe',
      'Pilgrim\'s rations (5 days)',
      'Common clothes'
    ],
    startingCurrency: {
      gold: 12,
      silver: 8,
      copper: 0
    },
    feature: {
      name: 'Sol\'s Breath\'s Ember',
      description: 'You carry a sealed phial containing a trace of Sol\'s Breath\'s light. Once per long rest, its faint warmth can calm a frightened ally (advantage on next save against fear) or illuminate a 15-foot radius for 10 minutes. The light attracts Wyrd entities and native creatures if used openly.'
    },
    statModifiers: {
      spirit: 3,
      intelligence: -1
    }
  },

  shyrRunner: {
    id: 'shyrRunner',
    restrictions: {
      "allowedRegions": [
        "sundale"
      ],
      "allowedSubraces": [
        'thrask_solari',
        'korr_solari'
      ],
      "narrativeUnlock": true,
      "justification": "The Basalt Shyr is a 90-mile road in Sundale. Running it requires Sundale geography knowledge."
    },
    classHooks: [
      { classId: 'spellguard', bridge: 'A career dodging magma-fractures and magical eruptions along the Shyr feeds directly into magical-defense engineering.' },
      { classId: 'pyrofiend', bridge: 'The magma-fracturing sumps that tear reality open are Scathrach territory; runners who linger hear the Ashen Sovereign.' },
      { classId: 'martyr', bridge: 'Runners who could not outrun a sulfur-cartel debt sometimes trade survival-pragmatism for the Vow.' }
    ],
    tensionPairings: [
      { classId: 'crusader', tension: 'A runner who stops running and stands to fight becomes a Crusader, the exact immobility the Shyr punishes.' }
    ],
    subraceFlavor: {
      thrask_solari: 'You raced your own clans\' sulfur caravans and learned to read the vents.',
      korr_solari: 'You ran a road your people carved, dodging tithe-takers of your own blood.',
      thalren_human: 'You ran the Shyr with a memory of the road the fog could not take.',
      tessen_human: 'You ran cargo the keep-gates would not let you keep.'
    },
    name: 'Courier',
    description: 'The Basalt Shyr is a ninety-mile volcanic trade road, and the Sulfur Cartel (the Korr monopoly that controls it) taxes every mile. You ran sulfur caravans and geothermal coal along its length, learning which basalt pillars shift without warning and where the magma-fracturing sumps (reality-tearing vents) tear holes in the air itself. The Dawn Vigil patrols the escarpment checkpoints for tithes and heretics. You learned to give them neither. Slag Gulch is where runners dodge the labor-levies and resupply before the final push. Ember Lagoon is where Cartel cargo changes hands, smuggled onto Merryn ships (crewed by the seafaring Merryn people) that ask no questions about the Vigil\'s missing sulfur. You know the Shyr the way a sailor knows a reef: by the things that have killed the careless. Now the Cartel\'s ledgers have your name in them, and the interest compounds. The road is still the only life that pays. Outrunning what you owe is the only alternative the Cartel recognizes. They are willing to wait, and the magma-fractures are willing to take.',
    skillProficiencies: ['Deception', 'Stealth'],
    toolProficiencies: ['Thieves\' tools', 'Gaming set'],
    languages: 1,
    equipment: [
      'Climbing spikes',
      'Heat-shield tarp',
      'Cinder-goggles',
      'Route-markers (10)'
    ],
    startingCurrency: {
      gold: 10,
      silver: 15,
      copper: 0
    },
    feature: {
      name: 'Shyr-Sense',
      description: 'You can predict when basalt pillars will shift or Husque-rifts will open. You and your companions gain advantage on Survival checks to navigate volcanic or geothermally-active terrain. You know the unspoken toll-rates of Anhur ranger-stations.'
    },
    statModifiers: {
      agility: 2,
      intelligence: 2,
      spirit: -2
    }
  },

  ledgerKeeper: {
    id: 'ledgerKeeper',
    restrictions: {
      "allowedRegions": [
        "frostwood-reach"
      ],
      "allowedSubraces": [
        'thalren_human',
        'florae_unified'
      ],
      "narrativeUnlock": true,
      "justification": "The Sovereign Ledger and Scribe-Cartel are Frostwood-specific. Exclude: Ordu (Steppe-Staves), Skald (runic genealogy), Tessic (knotted cord-cords), they use different record-keeping systems. Oaken Florae can plausibly pass as human scribes in Frostwood ports."
    },
    classHooks: [
      { classId: 'toxicologist', bridge: 'Cataloguing every reagent and its provenance is the first half of the Distillery\'s craft.' },
      { classId: 'inquisitor', bridge: 'A scribe who has read what the ledger hides is the natural recruit for the Barbed Vow.' }
    ],
    tensionPairings: [
      { classId: 'toxicologist', tension: 'A keeper who begins editing the record rather than keeping it drifts toward the poisoner\'s silence.' }
    ],
    subraceFlavor: {
      thalren_human: 'You copied the names the fog would have eaten, one ledger at a time.',
      florae_unified: 'You kept the grove\'s records in bark and breath, never on paper.',
      veiled_mimir: 'You kept the mask-archive and the Sovereign Ledger in the same breath.',
      tethered_mimir: 'You copied names without a mask, and the fog took the copies first.'
    },
    name: 'Scribe',
    description: 'In the Frostwood Reach, a region where a living fog literally erases people\'s memories, the fog eats memory, and Jarl-Archivist Kaelen Thalreth eats dissent. You kept the identity-ledgers at Greymark Keep, where a citizen is only as real as their last entry in the Sovereign Ledger, the official registry of citizens. If the fog takes your name and no scribe records the loss, you become one of the Forgotten, and no law protects the unrecorded. The Scribe-Cartel holds the monopoly on Soot-Resin Ink and Peat-Parchment. Your chained journals were the only proof that thousands of people existed. You checked papers at the Ironwood Palisade, catalogued lineages at Greythorn Copse, and bent over the prehistoric carvings at Mistbarrow trying to read what the fog had already half-erased. Kaelen\'s father Aldren started the Ledger Purge generations ago to strip the undocumented from the record. Now Aldren sits in his chambers re-reading his own journals, trying to remember who he is. The fog took him. Kaelen tells himself it won\'t take the Reach. You hold the quill that decides who is real and who is forgotten. The ink dries fast, and the fog never sleeps.',
    skillProficiencies: ['Animal Handling', 'Survival'],
    toolProficiencies: ['Artisan\'s tools', 'Vehicles (land)'],
    languages: 1,
    equipment: [
      'Ironwood-bound journal',
      'Ink-vial (peat-based)',
      'Quill',
      'Fog-ward charm',
      'Identity-papers'
    ],
    startingCurrency: {
      gold: 8,
      silver: 12,
      copper: 0
    },
    feature: {
      name: 'Ledger-Bound Identity',
      description: 'Your personal journal serves as incontestable legal proof of your existence under Kaelen Thalreth\'s Sovereign Ledger. When fog threatens to erase a memory, referencing your ledger allows you to recall it. Common folk and Palisade guards will provide simple accommodations to a documented Scribe.'
    },
    statModifiers: {
      constitution: 3,
      intelligence: -1
    }
  },

  bloodlineHeir: {
    id: 'bloodlineHeir',
    restrictions: {
      "allowedRegions": [],
      "allowedSubraces": [
        'thalren_human',
        'skald_human',
        'tessen_human',
        'merryn_human',
        'ordan_human',
        'viridian_florae',
        'florae_unified'
      ],
      "narrativeUnlock": true,
      "justification": "Any race/subrace can be born into a noble house, even erased/subjugated ones (though with narrative tension for erased bloodlines)."
    },
    classHooks: [
      { classId: 'martyr', bridge: 'Solvan and Korr heirs carry the original sacrifice as inheritance; the Vow formalizes what their house already demands.' },
      { classId: 'harbinger', bridge: 'An heir who works out the doom-arithmetic of their own house bargain becomes a Harbinger by deduction.' },
      { classId: 'false_prophet', bridge: 'Mycellan and Astril heirs can wield house authority as the seed of a manufactured congregation.' }
    ],
    tensionPairings: [
      { classId: 'inquisitor', tension: 'Heirs are trained to protect house secrets; the Inquisitor exists to sever them. An heir who takes the Barbed Vow hunts their own blood.' }
    ],
    subraceFlavor: {
      thalren_human: 'You descend from House Thalreth, and the fog took your house before it took your name.',
      skald_human: 'You descend from House Skalvyr, and the winter your ancestors bought never ended.',
      tessen_human: 'You descend from House Tesshan, and your keep was paid for with a blizzard.',
      merryn_human: 'You descend from House Mereval, and your family\'s fortune is written in other people\'s ink.',
      ordan_human: 'You descend from House Ordavan, and the grass your ancestors bought grows over their graves.',
      viridian_florae: 'You descend from House Viridane, the erased seventh, and no ledger will admit it.',
      florae_unified: 'You descend from House Viridane, and you keep the eighth house counted in bark.'
    },
    name: 'Noble Scion',
    description: 'The histories speak of seven noble houses that sealed the bargains of survival. Six of them broke and fed their heirs to Keth Amar; the seventh, House Viridane, refused and was erased, with House Morrath elevated to fill its empty seat. The Florae, descendants of Viridane, are remembered by the folk as the "eighth house" because they count what the official records hide. You descend from the survivors: Thalreth, Skalvyr, Solvan, Mereval, Tesshan, Ordavan, and Morrath (elevated to replace the erased Viridane). Every one of them struck a Dark Bargain to survive the long night, and every bargain has a price that came due. Your house\'s influence fractured long ago beneath the weight of what your ancestors promised. Some houses collapsed outright. Others limp on, their authority sustained by inertia and fear. The thorned Florae people still carry Viridane\'s blood in their veins, though no ledger will admit it. And the Bryngloom Forest\'s bargain was never a house\'s at all: the Athien people struck it with Morvane before any lord claimed the forest. You carry a name that opens doors and paints targets. Your ancestors bought survival with something they could not afford. The debt is still compounding, and someone has come to collect. What your house pays and what it refuses is your ledger now. The collectors have been patient for age upon age, and patience like that does not last.',
    skillProficiencies: ['History', 'Persuasion'],
    toolProficiencies: ['Gaming set'],
    languages: 1,
    equipment: [
      'House signet ring',
      'Scroll of lineage',
      'Fine clothes',
      'Heirloom dagger'
    ],
    startingCurrency: {
      gold: 20,
      silver: 10,
      copper: 0
    },
    feature: {
      name: 'Bloodline Authority',
      description: 'The seven houses\' names still carry weight across the frozen world. You can invoke your lineage to gain audience with regional authorities, access restricted house archives, and demand shelter in house-holds. Be warned: naming your house also names its ancient enemies.'
    },
    statModifiers: {
      charisma: 2,
      intelligence: 1,
      constitution: -1
    }
  },

  synodAcademic: {
    id: 'synodAcademic',
    restrictions: {
      "allowedRegions": [
        "sundrift-vale"
      ],
      "allowedSubraces": [],
      "narrativeUnlock": true,
      "justification": "Requires access to Synod Hold crystal archives and steppe scholarship. Both Lumian and Kordak study at the Synod, just on different paths."
    },
    classHooks: [
      { classId: 'animist', bridge: 'The Synod archives the dead; some scholars stop reading about ancestors and start speaking with them.' },
      { classId: 'false_prophet', bridge: 'A scholar who watches revelation outpace evidence can manufacture the revelation instead.' },
      { classId: 'harbinger', bridge: 'Academics who read the entropic records too closely tend to leave with the doom-arithmetic.' }
    ],
    tensionPairings: [
      { classId: 'arcanoneer', tension: 'A scholar who prefers filed precision to revelation becomes an Arcanoneer, and the two disciplines despise each other.' }
    ],
    subraceFlavor: {
      ordan_human: 'You catalogued the stars that used to guide your herds.',
      vashir_astril: 'You studied a dead world\'s echo the way others study a living library.',
      silath_astril: 'You were taught the suppressed history, and the penalty for writing it down.',
      velun_neth: 'You read the Synod\'s dead-world echoes the way you read a contract.',
      veiled_mimir: 'You traded archive-secrets with the Synod, one mask-note for one echo.',
      tessen_human: 'You studied the echo-lineages by the light of a keep that never opened.'
    },
    name: 'Scholar',
    description: 'The Synod Hold, a crystal academy of living stone, rises from the Sundrift steppe like a crystal thorn, the walls singing when the wind finds the right key. You studied there, learning to read the echo-lineages that the Astril (descendants of refugees from the devoured world Lumia) have carried since their first ancestors knelt in the stone circles and opened themselves to the resonance of a dead world. The crystal-lattice archives preserve every echo-signature that still resonates. You learned the forbidden Echo-Songs, the throat-sung maps of lineages that went dark when the echo overwhelmed the host. You catalogued echo-lineages carved on bone Steppe-Staves (record-keeping poles), learned to bypass the basalt Cairn-Checkpoints, and navigate Starfall Vale where the crystalline remnants of Lumia\'s memory fall. You learned to identify the Unlit Veil\'s spies inside the Synod itself. The echo is fading. Every season, another vessel goes silent, another song loses its referent. The Synod studies the archives while the memories go dark. You have the training to read the patterns. Whether you use it to preserve what remains or to understand what is killing the echoes is the choice the steppe has laid at your feet.',
    skillProficiencies: ['Arcana', 'History'],
    languages: 2,
    equipment: [
      'Memory-glass shard',
      'Crystal-lens',
      'Bone Steppe-Stave replica',
      'Ritual chalk',
      'Synod robes'
    ],
    startingCurrency: {
      gold: 8,
      silver: 15,
      copper: 0
    },
    feature: {
      name: 'Echo-Archive',
      description: 'You memorized portions of the Synod\'s crystal-lattice archives and can decode bone Steppe-Staves. You can recall obscure celestial history, identify Lumian echo traces, and recognize the resonance-signatures of the seven Sundered Monoliths. Academic and religious institutions grant you research access.'
    },
    statModifiers: {
      intelligence: 4,
      strength: -2
    }
  },

  sumpsVeteran: {
    id: 'sumpsVeteran',
    restrictions: {
      "allowedRegions": [
        "nordhalla"
      ],
      "allowedSubraces": [
        'skald_human'
      ],
      "narrativeUnlock": true,
      "justification": "Bloodhammer Sump skirmishes and Hunger Glacier defense are Nordhalla-specific."
    },
    classHooks: [
      { classId: 'berserker', bridge: 'The Hunger Pact recognizes a survivor of the Sump; veterans who came back changed sometimes come back burning.' },
      { classId: 'augur', bridge: 'Men who survived the Sump often learned to read a fight three seconds before it started.' },
      { classId: 'martyr', bridge: 'Veterans who watched their line die around them sometimes choose to take the next wound themselves.' }
    ],
    tensionPairings: [
      { classId: 'harbinger', tension: 'A veteran who has seen the Sump spread may conclude the freeze is unwinnable and take up the doom-arithmetic.' }
    ],
    subraceFlavor: {
      skald_human: 'You came back from the Sump; the ice in your veins never fully thawed.',
      thrask_solari: 'You fought the Sump beside Skald clans and never once felt the cold.',
      korr_solari: 'You fought in the Sump and went home to a deeper dark.',
      morgh_groven: 'You held a Sump trench the way you hold a bridge.',
      ithran_groven: 'You carried the Sump\'s wounded across spans that were falling.'
    },
    name: 'Veteran',
    description: 'The Bloodhammer Sump, a volcanic war zone of geothermal vents and constant skirmishes, breeds soldiers the way a wound breeds salt. You fought in its geothermal skirmishes, or the War of Thousand Screams, or the endless defense of the advancing Hunger Glaciers. Every Skald soldier carries the Hunger Pact in their blood: ancestral starvation from the Hunger Winter, the three-year blizzard that followed the Glacier Bargain, when the ancestors consumed their own dead to survive. The pact turns that memory into fury when the fighting starts. The Frost-Tithe, a yearly tribute of lives and resources to the encroaching cold, takes its share from every family. It took someone you loved. You learned to fight in geothermal vents where the air burns and the cold above kills just as fast, through the First Thermal War and every sump-skirmish since. Now the glaciers are advancing again, and the Hunger Pact still hums beneath your skin when the fighting nears. The dead who fed your bloodline gave you their fury so you would survive. What are you spending it on? The dead do not get to choose.',
    skillProficiencies: ['Athletics', 'Intimidation'],
    toolProficiencies: ['Gaming set', 'Vehicles (land)'],
    languages: 1,
    equipment: [
      'Insignia of rank (lava-forged)',
      'Trophy from fallen enemy',
      'Geothermal gauge',
      'Common clothes',
      'Field rations (5 days)'
    ],
    startingCurrency: {
      gold: 12,
      silver: 6,
      copper: 0
    },
    feature: {
      name: 'Sump-Hardened',
      description: 'You fought in geothermal vents where the air itself burns and the cold above kills just as fast. You have advantage on Constitution saving throws against extreme heat and extreme cold. Military installations and Nordhalla holdfasts recognize your rank and grant you access.'
    },
    statModifiers: {
      strength: 2,
      constitution: 2,
      intelligence: -2
    }
  },

  debtNegotiator: {
    id: 'debtNegotiator',
    restrictions: {
      "allowedRegions": [
        "bryngloom-forest"
      ],
      "allowedSubraces": [],
      "narrativeUnlock": true,
      "justification": "Athien contract law (First Contract, Great Registry) is Bryngloom-specific. Mycellan share the Bryngloom and navigate its debt-economy. Exclude: Skald, Ordu, neither uses written contract law."
    },
    classHooks: [
      { classId: 'arcanoneer', bridge: 'Reading a contract for hidden clauses is half of contract-syntax spellcraft.' },
      { classId: 'revenant', bridge: 'Negotiators who die mid-debt sometimes find the ledger will not release them.' },
      { classId: 'gambit', bridge: 'A negotiator who has staked everything on one clause already knows how the House works.' }
    ],
    tensionPairings: [
      { classId: 'inquisitor', tension: 'A negotiator who tires of bargaining may conclude every debt is corruption to be severed.' }
    ],
    subraceFlavor: {
      velun_neth: 'You wrote the terms, and then you were bound by them.',
      kessen_neth: 'You learned the obligation-web by being caught in it.',
      drun_neth: 'You negotiated from outside the law, where no contract can reach you.',
      clean_vreken: 'You brokered debts in the fungal dark, where a promise glows as it\'s made.',
      marked_vreken: 'You traded terms through the mycelium, and the network remembers.',
      merryn_human: 'You negotiated debts the way you negotiate a storm: loudly and in ink.',
      thrask_solari: 'You brokered sulfur contracts the Cartel could not read.'
    },
    name: 'Negotiator',
    description: 'In Atropolis, a canopy city built in the treetops, everything has a price and every price is negotiable. You studied the First Contract (the foundational legal text of the Athien people) and Athien legal tradition in the canopy city\'s contract-halls, guiding clients through Regent Morrath\'s Great Registry (a total debt-and-citizenship registry) and navigating the debt-peonage that underpins the Bryngloom economy. In the Bryngloom Forest, debt is a living thing: every agreement binds, every handshake traps, and the Postmortem Corvee can conscript your corpse for labor if you die in default. You negotiated Memory-Glass Covenants, contracts that store and trade years of lifespan, for clients desperate to buy extra time. You learned to read a Athien contract by its silver-leaf binding and to spot the trap-clauses that bind the unwary. And you memorized the cautionary tale every negotiator learns: Saren-Vel, the greatest contract-lawyer of her generation, who burned her own name from the Contract and became the first of the Riven (the legally nonexistent), living in the Over-Shanty beyond the reach of every law she once mastered. The contract-halls are busier than ever. Morvane waits beneath the roots, patient as the mycelium, and the debt-economy grows. You have the silver tongue and the eye for loopholes. The quill is in your hand. Whose contracts hold and whose names burn is the only question the ink keeps asking.',
    skillProficiencies: ['Deception', 'Sleight of Hand'],
    toolProficiencies: ['Forgery kit', 'Disguise kit'],
    languages: 1,
    equipment: [
      'Contract-scroll case',
      'Forgery kit',
      'Measuring scales',
      'Fine clothes',
      'Wax seals (10)'
    ],
    startingCurrency: {
      gold: 11,
      silver: 12,
      copper: 0
    },
    feature: {
      name: 'Contractual Eye',
      description: 'You can spot loopholes, hidden clauses, and binding terms in any written agreement. You recognize a Athien contract by its silver-leaf binding and know the three fatal errors that void a First Contract clause. Merchants and Great Registry officials treat your drafted agreements as legally sound.'
    },
    statModifiers: {
      charisma: 3,
      spirit: -1
    }
  },

  frostChanter: {
    id: 'frostChanter',
    restrictions: {
      "allowedRegions": [
        "nordhalla"
      ],
      "allowedSubraces": [
        'skald_human'
      ],
      "narrativeUnlock": true,
      "justification": "Requires Nordhalla oral-history training and the specific context of Jarn-Tand's cultural suppression."
    },
    classHooks: [
      { classId: 'augur', bridge: 'A storyteller who knows how every saga ends can read the present the same way.' },
      { classId: 'berserker', bridge: 'Chanting the Hunger Winter too faithfully can wake the Pact the songs were meant to mourn.' },
      { classId: 'martyr', bridge: 'A chanter who carries every death in the saga may choose to carry the next one in the body.' }
    ],
    tensionPairings: [
      { classId: 'harbinger', tension: 'A chanter who believes the sagas are over may start writing the last one.' }
    ],
    subraceFlavor: {
      skald_human: 'You kept the old sagas in a body the cold could not preserve.',
      ordan_human: 'You wove the migration-songs into a heresy the ice could not burn.',
      thalren_human: 'You kept the sagas the fog kept trying to eat.'
    },
    name: 'Storyteller',
    description: 'In Nordhalla, a frozen northern region, the authoritarian Jarn-Tand\'s Runic Academies burn every old drum they find. So the old ways moved into the only instrument they could not confiscate: the voice. You trained as a chanter, weaving animist history into verse so dense the inquisitors hear a drinking-song and never suspect they are listening to a heresy older than the Freeze. Each performance is a hidden archive. Each chorus shields the Øsling (the highland clans who refused Jarn-Tand\'s crown) from the Frost-Tithe\'s despair and the Academies\' erasure. In a land where the written rune is law and the spoken song is contraband, your voice is a covert hearth where the old ways still burn. The Glacier Bargain and the Hunger Winter that followed (the three-year blizzard that drove the ancestors to consume their own dead) birthed the first chants; every chanter since has added a verse. The Academies are listening closer now, and the Øsling are fewer every winter. You carry the last songs of a people the cold is slowly silencing. The Academies are counting on the cold to finish what their bonfires could not. Keep the verse alive, and they lose.',
    skillProficiencies: ['Acrobatics', 'Performance'],
    toolProficiencies: ['Disguise kit', 'Musical instrument'],
    languages: 1,
    equipment: [
      'Concealed story-drum',
      'Admirer\'s rune-token',
      'Performance cloak',
      'Voice-salve'
    ],
    startingCurrency: {
      gold: 13,
      silver: 8,
      copper: 0
    },
    feature: {
      name: 'Voice-Archive',
      description: 'Your performances preserve history that the cold would otherwise destroy. Once per long rest, you can recount a buried tale so vividly that all who hear it gain advantage on their next History check related to that story. You can find a place to perform in any Nordhalla settlement and receive modest lodging in return.'
    },
    statModifiers: {
      charisma: 2,
      agility: 2,
      constitution: -2
    }
  },

  forgeWright: {
    id: 'forgeWright',
    restrictions: {
      "allowedRegions": [
        'sundale',
        'nordhalla',
        'iceheart-sea',
        'cragjaw-peaks'
      ],
      "allowedSubraces": [],
      "narrativeUnlock": true,
      "justification": "Every region has some form of metalworking; the flavor shifts by region."
    },
    classHooks: [
      { classId: 'spellguard', bridge: 'The Damon tradition treats magical defense as forge-engineering; a Smith is already half-trained.' },
      { classId: 'warden', bridge: 'Chain-craft and gear-work are the mechanical backbone of the chain-graft surgical tradition.' },
      { classId: 'berserker', bridge: 'Skald and Anhur forge-workers who absorbed enough forge-heat sometimes find the Rage igniting on its own.' }
    ],
    tensionPairings: [
      { classId: 'pyrofiend', tension: 'A smith who has spent a life feeding fire may stop banking it and let the furnace in.' }
    ],
    subraceFlavor: {
      thrask_solari: 'You worked the caldera forges where the metal is never allowed to cool.',
      skald_human: 'You learned the Bloodhammer Sump\'s foundries, and the heat settled in your bones.',
      merryn_human: 'You forged in the dock-shops of Ironjaw, where a contract is as binding as a weld.',
      kethrin_fexric: 'You cut gear-teeth to guild tolerance and signed your work in the metal.',
      drall_fexric: 'You learned the forge by salvaging the machines the guild discarded.',
      morgh_groven: 'You poured spans with Morgh vat-crews and read the metal like a ledger.',
      ithran_groven: 'You built the iron bones of bridges and learned exactly when they fail.',
      tessen_human: 'You forged the keep-mechanisms that fail only when no one is watching.',
      veiled_mimir: 'You learned to read a forge-mark the way you read a mask.',
      korr_solari: 'You forged in the deep vaults and never learned to fear the heat.',
      vashir_astril: 'You worked star-metal and told no one what the lattice whispered.',
      silath_astril: 'You forged weapons the suppression would rather you did not.',
      viridian_florae: 'You shaped ghost-metal in the cold grove, and the forge smelled of sap.',
      deepling_myrathil: 'You forged in the drowned forges where the quench is the sea itself.',
      shoreling_myrathil: 'You forged at the tide-line, tempering in salt.',
      riverling_myrathil: 'You forged in river-towns and sent your work downstream.'
    },
    name: 'Smith',
    description: 'Metal remembers. Every hammer-strike, every quench, every fold of alloy is a record that outlasts the hand that made it. You apprenticed at one of the great forges: Harath-Vault beneath the temple-city of Emberspire, the Bloodhammer Sump\'s geothermal foundries, or the deep dock-forges of Ironjaw Port. There you learned to read the record the way a scribe reads ink. You understand metal as living memory. Every alloy is a conversation between elements; every forge-mark, a signature. At Gearworks Gulch in the Cragjaw Peaks, you studied clockwork engineering from the Fex, a subterranean craft-oriented people whose gear-teeth cut as clean as their grievances. At Sol\'s Anvil Mesa in Sundale, Solari sun-priests still work ceremonial metal with techniques passed down from the Great Binding, the ancient ritual that first sealed the sun away. The forges are failing. Fuel runs low, ore-veins thin, and the old guild-marks lose their meaning as fewer smiths survive to teach them. You carry the grammar of metal in your hands. The old marks have stayed honest this long because someone always kept them so. The hammers still remember, even when the smiths do not.',
    skillProficiencies: ['Insight', 'Persuasion'],
    toolProficiencies: ['Artisan\'s tools'],
    languages: 1,
    equipment: [
      'Smith\'s hammer',
      'Forge-apron',
      'Metal-sample kit',
      'Guild letter of introduction'
    ],
    startingCurrency: {
      gold: 14,
      silver: 10,
      copper: 0
    },
    feature: {
      name: 'Forge-Sense',
      description: 'You understand metal as a living memory. By touch, you can identify the origin-region and approximate age of any forged metal object, and you recognize the secret forge-marks of Harath-Vault, Bloodhammer Sump, and Ironjaw Port. Your guild provides lodging and burial rites if needed.'
    },
    statModifiers: {
      intelligence: 3,
      charisma: -1
    }
  },

  hushSurvivor: {
    id: 'hushSurvivor',
    restrictions: {
      "allowedRegions": [
        'bryngloom-forest'
      ],
      "allowedSubraces": [
        'velun_neth',
        'kessen_neth',
        'drun_neth',
        'clean_vreken',
        'marked_vreken'
      ],
      "narrativeUnlock": true,
      "justification": "Any character could have traveled to the Bryngloom and survived the spore-hush, though should require a narrative reason for being there."
    },
    classHooks: [
      { classId: 'plaguebringer', bridge: 'Surviving the hush leaves a permanent familiarity with the fungal substrate, the first step of cultivation.' },
      { classId: 'inquisitor', bridge: 'A mind fortified against the hush is fortified against the Wyrd; the Barbed Vow is a short step.' },
      { classId: 'animist', bridge: 'Resisting the mycelium song teaches the channeler discipline the spirit-bonds require.' }
    ],
    tensionPairings: [
      { classId: 'revenant', tension: 'A survivor who refused to be consumed may, when death comes, refuse that too.' }
    ],
    subraceFlavor: {
      velun_neth: 'The hush killed someone the Contract could not save, and you filed the loss anyway.',
      kessen_neth: 'You survived the hush and learned that some obligations outlive the flesh.',
      drun_neth: 'The hush could not take you; nothing legal has been able to reach you since.',
      clean_vreken: 'You watched the hush take kin your own blood was immune to, and it taught you nothing.',
      marked_vreken: 'The hush spoke to you through your own mycelium and you refused to answer.'
    },
    name: 'Survivor',
    description: 'The hush is a fungal plague that dissolves the mind and turns its victims into puppets of the mycelium. You watched it take someone you loved. First the Ghost-Mycelium, the infectious fungal agent, darkened their veins. Then it dissolved their mind. Then it drew them into the Hush-Bogs to join the Spores-Born, the mindless fungal-puppeted dead who drift the bog\'s edge. You retreated into seclusion and fortified your mind against the hush\'s seduction, brick by brick, until the song could not reach you. It almost worked. The mycelium\'s song never fully fades. You hear it in the silence between thoughts, a low hum that promises warmth and cessation. The Over-Lit epidemic that scattered concentrated Ghost-Mycelium through every trade route made the hush a regional catastrophe, and the Hush-Bogs are fuller now than they have been in generations. You survived the hush when the person beside you did not. That survival left a mark the mycelium recognizes. You know the early signs: the darkening veins, the far-away stare, the warmth that is not warmth. You are the only one in any room who can read the signs in time. The hush is counting on the room not knowing.',
    skillProficiencies: ['Medicine', 'Religion'],
    toolProficiencies: ['Herbalism kit'],
    languages: 1,
    equipment: [
      'Mycelium-testing kit',
      'Herbal sedatives (3 doses)',
      'Sealed journal',
      'Winter blanket',
      'Trail rations (5 days)'
    ],
    startingCurrency: {
      gold: 4,
      silver: 12,
      copper: 0
    },
    feature: {
      name: 'Hush-Fortified Mind',
      description: 'Having resisted the fungal hush\'s pull, you built permanent mental defenses. You have advantage on saving throws against charm effects and psychic effects that would alter your perception or implant false memories. You can recognize the early physical signs of Ghost-Mycelium infection in others.'
    },
    statModifiers: {
      spirit: 3,
      charisma: -1
    }
  },

  peakTracker: {
    id: 'peakTracker',
    restrictions: {
      "allowedRegions": [
        "cragjaw-peaks"
      ],
      "allowedSubraces": [
        'tessen_human',
        'morgh_groven',
        'ithran_groven',
        'drall_fexric',
        'kethrin_fexric'
      ],
      "narrativeUnlock": true,
      "justification": "Requires knowledge of Ancestor-Spans and Cragjaw geography."
    },
    classHooks: [
      { classId: 'warden', bridge: 'Guiding caravans across the spans breeds the same instinct that drives the chain-graft.' },
      { classId: 'chronarch', bridge: 'Reading a mountain for avalanche-timing is the same discipline as reading a timeline.' },
      { classId: 'shaper', bridge: 'Years of climbing on Groven-modified joints teach a body to reshape under load.' }
    ],
    tensionPairings: [
      { classId: 'revenant', tension: 'A tracker who has died on the spans once too often may come back refusing to stay down.' }
    ],
    subraceFlavor: {
      tessen_human: 'You walked the spans your keeps were built beside, never once looking down.',
      morgh_groven: 'You read the ancestor-spans by the dead who hold them up.',
      ithran_groven: 'You crossed bridges you helped pour, and remembered every span that fell.',
      drall_fexric: 'You scavenged the high passes for salvage the guilds left behind.',
      kethrin_fexric: 'You maintained the mountain lifts the holdfasts depend on.',
      veiled_mimir: 'You read the peaks the way you read the fog: by what they hide.',
      tethered_mimir: 'You crossed the spans without a mask, trusting the stone.',
      thalren_human: 'You learned the peaks because the fog took every lower path.'
    },
    name: 'Mountaineer',
    description: 'The Cragjaw Peaks are a vertical labyrinth of deadly mountains where the blizzard rewrites every path within hours of it being carved. You navigated that labyrinth with knotted cord route-markers, mapping what the storm buries and re-buries. The calcified bone-bridges called Ancestor-Spans, left behind by the Groven people (an ancient race of bone-workers), are the only crossings that hold, and you learned to read their stress-fractures before committing your weight. You evaded the Rope-Garrison toll-posts, predicted the hunting grounds of Rime-Brides (ice-elemental hunters) and Storm-Crows, and found safe passage through the steam-pipe junctions where heat-stealing Sump-Scrabs nest. Deepchasm Keep is your home, and from its walls you watched trackers who knew one route fewer than the storm take the wrong bridge. The peaks are getting colder, and the blizzard thicker. The bone-bridges the ancestors left are not being replaced. You carry the routes in your knotted cord, the only map that outlasts the storm. Miss the passage and your companions learn, very briefly, why the Groven carved their memorials into the spans. The blizzard is indifferent to which name is next.',
    skillProficiencies: ['Athletics', 'Survival'],
    toolProficiencies: ['Musical instrument'],
    languages: 1,
    equipment: [
      'Climbing rope (silk, 50ft)',
      'Pitons (10)',
      'Storm-cloak',
      'Knotted cord route-markers',
      'Travel rations (5 days)'
    ],
    startingCurrency: {
      gold: 7,
      silver: 18,
      copper: 0
    },
    feature: {
      name: 'Ancestor-Span Reader',
      description: 'You can read the calcified warnings left by Groven dead in the bridge-spans, stress fractures, toll-marks, and memorial grooves. You have advantage on Survival checks in mountainous and high-altitude terrain, and you can always find safe passage across an Ancestor-Span. The mountain has no mercy, only lessons you have already learned.'
    },
    statModifiers: {
      constitution: 2,
      spirit: 2,
      charisma: -2
    }
  },

  merrowSailor: {
    id: 'merrowSailor',
    restrictions: {
      "allowedRegions": [
        "iceheart-sea"
      ],
      "allowedSubraces": [
        'merryn_human',
        'shoreling_myrathil',
        'deepling_myrathil',
        'riverling_myrathil'
      ],
      "hardBlocks": [
        "vashir_astril",
        "silath_astril"
      ],
      "narrativeUnlock": true,
      "justification": "Requires Iceheart Sea maritime knowledge. Exclude: Tessic (sealed keep), Ordu (steppe nomads). Astril crystalline bodies do not float, hard block."
    },
    classHooks: [
      { classId: 'gambit', bridge: 'Every voyage is a wager, and a sailor who has rolled the dice enough learns to rig them.' },
      { classId: 'minstrel', bridge: 'A sailor who has sung the crew through a storm has already begun the Choir.' },
      { classId: 'apex', bridge: 'Hunting the thing in the water before it hunts you is the sailor\'s version of the Trade.' }
    ],
    tensionPairings: [
      { classId: 'augur', tension: 'A sailor who reads the tide for omens may stop trusting the tide and start reading blood.' }
    ],
    subraceFlavor: {
      merryn_human: 'You signed your first oath in ink on your own forearm.',
      shoreling_myrathil: 'You crewed surface ships that still flinched at your eyes.',
      deepling_myrathil: 'You surfaced for the first time and hated every horizon.',
      riverling_myrathil: 'You carried river cargo to the coast and stayed for the sea.',
      velun_neth: 'You crewed a Merryn ship as the only soul aboard who could read the charter.',
      kethrin_fexric: 'You kept the ship\'s engines running through the ice.'
    },
    name: 'Sailor',
    description: 'The Iceheart Sea, a freezing northern ocean, does not forgive debts, and the Board of Trade does not forget them. You sailed from Merrowport under Grand Admiral Osric Mereval\'s Sea-Charter (the official trade license), your arms inked with trade-tattoos that double as legal contracts. Every line of ink verifies a debt-share; every missing line is a gap the Press-Warrants (forced conscription orders) can fill with lifetime naval service. You learned to slip the Unfreezing Booms, dodge the Luck-Ledger inquisitors who audit every sailor\'s skin for unpaid shares, and trade in Brinehorse Cove where the Brine-Bond Syndicate asks fewer questions. The Merryn (the seafaring human culture) tattooed their debts on their skin for centuries before the Syndicate formalized the practice. Now the ink is law, and the law is ink. The sea is freezing earlier every year, and the trade-routes the Sea-Charter protects are shrinking with the ice. You know the water, the wind, and the exact weight of ink on your skin. The ink on your skin is the only currency the Board of Trade accepts. Pray it outlasts your debt.',
    skillProficiencies: ['Athletics', 'Perception'],
    toolProficiencies: ['Navigator\'s tools', 'Vehicles (water)'],
    languages: 1,
    equipment: [
      'Belaying pin',
      'Silk rope (50 feet)',
      'Lucky charm (Luck-Ledger coin)',
      'Oilskin coat',
      'Common clothes'
    ],
    startingCurrency: {
      gold: 9,
      silver: 15,
      copper: 0
    },
    feature: {
      name: 'Tattoo-Contract',
      description: 'Your skin bears legal trade-tattoos recognized by the Mereval Board of Trade. You can secure passage on merchant ships in exchange for a contract of debt-labor, and you are skilled at identifying loop-holes in Syndicate cargo ledgers.'
    },
    statModifiers: {
      agility: 3,
      intelligence: -1
    }
  },

  gloomwayTrader: {
    id: 'gloomwayTrader',
    restrictions: {
      "allowedRegions": [
        "bryngloom-forest"
      ],
      "allowedSubraces": [],
      "narrativeUnlock": true,
      "justification": "Requires knowledge of Bryngloom Toll-Dikes, Mist-Gate Market, and peat-oil trade routes."
    },
    classHooks: [
      { classId: 'gambit', bridge: 'The Gloom-Market runs on credit and nerve; a trader there is already a gambler.' },
      { classId: 'revenant', bridge: 'Traders who die owing the wrong people sometimes keep trading anyway.' },
      { classId: 'plaguebringer', bridge: 'The Gloom-Market deals in things that grow; some traders start growing them too.' }
    ],
    tensionPairings: [
      { classId: 'augur', tension: 'A trader who can read the market\'s future may stop trading and start foretelling.' }
    ],
    subraceFlavor: {
      velun_neth: 'You moved goods the Ledger had already priced.',
      kessen_neth: 'You traded on credit against a fate you hadn\'t spent yet.',
      drun_neth: 'You dealt in things that legally do not exist, because neither do you.',
      clean_vreken: 'You walked the glowing market-paths where nothing can be hidden.',
      marked_vreken: 'You sold through the roots, and the roots took their cut.',
      merryn_human: 'You smuggled along the root-rivers and paid the tolls in secrets.',
      drall_fexric: 'You sold salvaged guild-tech through the Gloom-Market at a markup.'
    },
    name: 'Smuggler',
    description: 'The Bryngloom Forest trades in three currencies: memory-glass (crystallized memories), peat-oil, and the years left in a lifespan. You ran goods across its root-tangled expanse under Regent Morrath\'s Great Registry, dealing in wyrd-warded curios (trinkets enchanted against supernatural forces) and the covenants that bind them. The living-ironwood Toll-Dikes tax every road, but you learned the bypasses. You bargained with Riven smugglers (the legally nonexistent outcasts) beneath the canopy, traded lifelines at the Mist-Gate Market where a desperate soul will sell five years for a chest of peat-oil, and rested at Morren\'s Bogpost where the forest meets the steppe. Your ledger is warded against the Inquisition\'s audit. Every entry is legal, or at least defensibly ambiguous. The Registry tightens its tariffs every season, and the Riven routes grow more dangerous as the Root-Veil spreads and the old crossings rot beneath it. You know the prices, the paths, and the faces that pay. No one else is bringing these goods through. The trade-routes close the season you stop running them, and the Forest does not forgive silence.',
    skillProficiencies: ['Insight', 'Persuasion'],
    toolProficiencies: ['Navigator\'s tools'],
    languages: 2,
    equipment: [
      'Merchant\'s scale',
      'Sample goods (3)',
      'Trade-ledger (Registry-certified)',
      'Fog-charms (3)',
      'Traveler\'s clothes'
    ],
    startingCurrency: {
      gold: 16,
      silver: 12,
      copper: 0
    },
    feature: {
      name: 'Gloom-Market Pass',
      description: 'You know the trade laws of the Great Registry, the Riven\'s peat-harvesting routes, and the Toll-Dikes\' bypass channels. You can find buyers for illicit peat-oil or memory-glass, and your ledgers are recognized by Athien contract-houses.'
    },
    statModifiers: {
      charisma: 2,
      intelligence: 2,
      strength: -2
    }
  },

  shantyRat: {
    id: 'shantyRat',
    restrictions: {
      "allowedRegions": [
        "bryngloom-forest"
      ],
      "allowedSubraces": [
        'drun_neth',
        'marked_vreken',
        'clean_vreken'
      ],
      "narrativeUnlock": true,
      "justification": "The Over-Shanty is beneath Atropolis specifically. A non-Bryngloom native has never been there."
    },
    classHooks: [
      { classId: 'plaguebringer', bridge: 'A shanty child who survives the hush learns to make peace with decay.' },
      { classId: 'inquisitor', bridge: 'Urchins who grow up watching corruption spread often want to cut it out.' },
      { classId: 'animist', bridge: 'The shanties bury their dead in the fungal dark; some children learn to listen.' }
    ],
    tensionPairings: [
      { classId: 'revenant', tension: 'A rat who has been left for dead may decide not to let death finish the job.' }
    ],
    subraceFlavor: {
      drun_neth: 'You survived where the ledger says you were never born.',
      marked_vreken: 'You grew up in the spore-hollows, quick because slow children vanish.',
      clean_vreken: 'You were the rare clean child in the shanties, and everyone wanted a piece.',
      velun_neth: 'You were born under the Ledger\'s notice, and the Registry never found you.',
      kessen_neth: 'You grew up owing everyone and nothing.'
    },
    name: 'Urchin',
    description: 'The Over-Shanty is a hanging slum beneath the treetop city of Atropolis, like a wound the canopy city refuses to acknowledge. You grew up in its rope-bridges and salvage-nests, one of the Forgotten: undocumented, unrecorded, legally nonexistent under Regent Morrath\'s Great Registry. The Registry tracks every name above. Below, the Shanty tracks only who can climb and who cannot. The slum coalesced from Riven outcasts (people who erased their own names from the law), Mycellan defaulters, and merchants too desperate to check the drop. You learned which rope-bridges hold weight, how to slip past the Toll-Dike patrols, and how to bargain with Riven smugglers for black-market peat-oil. The memory-brokers know your face; the Registry never will. Atropolis thrives above, and the Shanty swells below, and the rope-bridges between them fray a little more every season. You were born outside the law. The Registry already has the blank space where your name was. Climb, or the mist fills it.',
    skillProficiencies: ['Sleight of Hand', 'Stealth'],
    toolProficiencies: ['Disguise kit', 'Thieves\' tools'],
    languages: 1,
    equipment: [
      'Grappling hook',
      'Rope (30ft)',
      'Stolen signet',
      'Shiv',
      'Patched clothes'
    ],
    startingCurrency: {
      gold: 6,
      silver: 18,
      copper: 0
    },
    feature: {
      name: 'Shanty-Passage',
      description: 'You know the secret pathways of the Over-Shanty\'s hanging slums, which rope-bridges hold weight, how to slip past the Toll-Dike checkpoints, and where Riven outcasts hide from the Registry-guard. You can navigate any hanging or vertical settlement at twice the normal speed.'
    },
    statModifiers: {
      agility: 3,
      strength: -1
    }
  },

  monolithHunter: {
    id: 'monolithHunter',
    restrictions: {
      "allowedRegions": [],
      "allowedSubraces": [],
      "justification": "The seven Monoliths are scattered across all regions; any character could hunt them."
    },
    classHooks: [
      { classId: 'harbinger', bridge: 'A career measuring the waking resonance of the Monoliths leads inevitably to the doom-arithmetic.' },
      { classId: 'augur', bridge: 'Reading the prophetic song of the fragments is a natural extension of the augury.' },
      { classId: 'spellguard', bridge: 'Wyrd-grounding stakes and resonance-sense are the defensive half of the Aegis discipline.' }
    ],
    tensionPairings: [
      { classId: 'false_prophet', tension: 'A Hunter pursues buried truth; a False Prophet manufactures it. The two are professional enemies.' }
    ],
    name: 'Relic Hunter',
    description: 'For centuries the seven Sundered Monoliths stood silent: six are the greatest fallen shards of Aex\'s broken divine aegis, and one — the Counterfeit — is the hollow echo where the seventh seal was never made. The Blind Strike broke them: when the predator crashed into the planetary ward the Secret Aegis alone held, the Mother\'s aegis fractured and the shards scattered across every region. They hummed quietly for generations. Now they are waking — all seven at once, resonance rising, the Counterfeit humming wrong. You track that resonance across the frozen world with cold iron stakes to ground the Predatory Wyrd-echoes and a journal of shard-locations that certain powers would kill to possess. The monoliths were silent for a century and a half. Whatever changed did so recently, and is still changing. You carry the only map that tracks all seven. The choice of whether the waking is hastened, halted or understood only stays yours while you are the one standing at its base.',
    skillProficiencies: ['History', 'Investigation'],
    toolProficiencies: ['Calligrapher\'s supplies'],
    languages: 2,
    equipment: [
      'Cold iron stakes (3)',
      'Wyrd-detection lens',
      'Monolith-rubbing kit',
      'Field journal',
      'Bog-salt pouch'
    ],
    startingCurrency: {
      gold: 12,
      silver: 10,
      copper: 0
    },
    feature: {
      name: 'Wyrd-Grounding',
      description: 'You carry cold iron stakes and know the ritual to ground Wyrd-echoes. Once per long rest, you can bind a minor Wyrd manifestation to a stake, suppressing its effects for 1 hour. You can sense the general direction of the nearest Sundered Monolith within 10 miles. Scholars and relic-hunters recognize your expertise and share fragment-lore.'
    },
    statModifiers: {
      intelligence: 4,
      agility: -2
    }
  },

  groveWarden: {
    id: 'groveWarden',
    restrictions: {
      "allowedRegions": [
        "frostwood-reach"
      ],
      "allowedSubraces": [
        'viridian_florae',
        'florae_unified'
      ],
      "narrativeUnlock": true,
      "justification": "Grove-Wardens swear the fae counter-bargain in the moonlit groves of the Frostwood Reach, a Florae bloodline obligation. An outsider could plausibly be sworn to the grove through adoption or an unpaid life-debt."
    },
    classHooks: [
      { classId: 'lunarch', bridge: 'Grove-wardens who keep the moonlit boundaries sometimes catch the parasite\'s attention.' },
      { classId: 'toxicologist', bridge: 'Knowing every thorn and sap in the grove is the Florae road into the Distillery.' }
    ],
    tensionPairings: [
      { classId: 'lunarch', tension: 'A warden who resents the old-law groves may drift toward the parasite that ignores them.' }
    ],
    subraceFlavor: {
      viridian_florae: 'You kept the old-law groves your people will never write down.',
      florae_unified: 'You warded the timber groves that build the cities you avoid.',
      thalren_human: 'You warded the groves the fog could not enter, and counted the names it took.'
    },
    name: 'Ranger',
    description: 'There were seven noble houses, and yours was the seventh — House Viridane, erased from every history the other six were permitted to write. The official record names only six, plus the upstart Morrath they crowned to replace you. That record is a lie of omission. You swore the old fae bargain in the moonlit groves of the Frostwood Reach, binding yourself to the Hollow-Court (the fae court of the forest) and the ironwood hollows where House Viridane (the erased seventh house) sealed its counter-pact when the other houses marched their heirs to be sacrificed to Keth Amar. Viridane refused. Viridane ran. Viridane survived, in you and every Florae who carries the thorns. You tend the Thorn-Fall, where shed thorns beyond counting record every unfulfilled promise the fae have witnessed. You mine ghost-metal from the cold vein beneath the deep groves and enforce the fae\'s old laws against the quiet expeditions the other families send to strip what Viridane left behind. You carry Viridane\'s last counter-pact in your blood and its law in your thorns. Viridane did not run from the Devouring to end under leaf-rot. The grove holds as long as you do.',
    skillProficiencies: ['Insight', 'Survival'],
    toolProficiencies: ['Artisan\'s tools (ghost-metal cold-working)'],
    languages: 1,
    equipment: [
      'Ghost-metal warden\'s token',
      'Thorn-pruning blade',
      'Moonlit-grove route-cord',
      'Fae-contract tally (notched bone)',
      'Traveler\'s clothes'
    ],
    startingCurrency: {
      gold: 8,
      silver: 10,
      copper: 0
    },
    feature: {
      name: 'Old-Law Witness',
      description: 'You carry the fae\'s old laws written in your flesh. Once per long rest, you may witness a spoken oath between two willing creatures and invoke the grove\'s old law: if either party breaks the oath within a year, you sense the breaking immediately and the oathbreaker cannot hide from your Insight checks for one month. Florae recognize you by your thorn-clusters (or your hidden token); fae-touched creatures and the Oaken community provide you shelter in exchange for a small thorn-tithe.'
    },
    statModifiers: {
      spirit: 2,
      charisma: 1,
      strength: -1
    }
  },

  maskWarden: {
    id: 'maskWarden',
    restrictions: {
      "allowedRegions": [
        "frostwood-reach"
      ],
      "allowedSubraces": [
        'veiled_mimir',
        'tethered_mimir'
      ],
      "narrativeUnlock": true,
      "justification": "Mask-Wardens train in the Fog-Vales to recover stolen masks and turn back the Hunters. A non-Mimir could be sworn in only through a deep act of protection, and even then, the mistrust outlasts the oath."
    },
    classHooks: [
      { classId: 'apex', bridge: 'Standing the palisade watch against mist-predators is the Silent Hunt\'s training ground.' },
      { classId: 'shaper', bridge: 'A sentinel who has worn a mask for decades can learn to reshape the face beneath it.' }
    ],
    tensionPairings: [
      { classId: 'apex', tension: 'A warden who loses the mask may trade identity for the fog\'s senses instead.' }
    ],
    subraceFlavor: {
      veiled_mimir: 'You stood the palisade watch, mask steady against the mist.',
      tethered_mimir: 'You kept the vigil without a mask, anchored only by a Mote.',
      thalren_human: 'You guarded the Mimir mask-roads because the fog respected you too.'
    },
    name: 'Guardian',
    description: 'The Mimir are a masked people whose masks are ancient relics, and the Hunters (mask-collecting cartels) pay fortunes for them on the black market. You stand between the mask-wearers and the cartels that hunt them. You patrol the fog-spider-silk rope-bridges of the Spire-Aeries, watch the Watch-Bells for the next alarm, and track the detection-specialists who probe the misty Vales with ever-refining tools. The Mimir Purge took the birthing chambers and the last Mask-Mothers (the only ones who could craft new masks) with them. The Rupture that followed restricted every surviving mask to a first-born heir, and the mothers who could have made more are ashes. Since then, Keepers have guarded what remains. Whether you are an Arch Mimir scholar or a Broken Mimir sentinel, you learned to read the spore-trails intruders leave and the silence the fog carves when an outsider moves through it. The Hunters are better funded than they have been in generations, and every mask that falls feeds a collection that grows bolder. You know their methods because you have buried the ones who got careless. The Vales will not defend themselves, and the Hunters have deeper coffers every season. Every mask you lose ends in a glass case in a city that calls it art.',
    skillProficiencies: ['Perception', 'Stealth'],
    toolProficiencies: ['Navigator\'s tools', 'Disguise kit'],
    languages: 1,
    equipment: [
      'Storm-glass signal-whistle',
      'Fog-spider silk rope (50ft)',
      'Spore-trail reading kit',
      'Recovered mask-shard (provenance unknown)',
      'Warded traveler\'s cloak'
    ],
    startingCurrency: {
      gold: 9,
      silver: 10,
      copper: 0
    },
    feature: {
      name: 'Hunter\'s Reversal',
      description: 'You have learned how the Hunters track Mimir and how to turn that tracking back on them. Once per long rest, when you observe a creature using detection magic, scrying, or mundane tracking against you or a masked ally, you may turn the method against its user: for 1 hour, the tracker has disadvantage on all Perception and Investigation checks, and you know their general direction. Woven wardens along the Spire-Aeries and Broken Mimir allies will shelter you and pass warning of Hunter movements.'
    },
    statModifiers: {
      agility: 2,
      intelligence: 1,
      charisma: -1
    }
  },

  vaultScholar: {
    id: 'vaultScholar',
    restrictions: {
      "allowedRegions": [
        "cragjaw-peaks"
      ],
      "allowedSubraces": [
        'kethrin_fexric',
        'drall_fexric'
      ],
      "narrativeUnlock": true,
      "justification": "The guild-vaults and underground academies are Fex-specific institutions. Brasskin study in formal academies; Alchemite learned in secret before being expelled."
    },
    classHooks: [
      { classId: 'chronarch', bridge: 'Guild archivists who study the time-vaults sometimes learn to turn the gears themselves.' },
      { classId: 'arcanoneer', bridge: 'A machinist who reads the elemental regulators can graduate to weaving them.' },
      { classId: 'pyrofiend', bridge: 'Vault-workers who survive a refinery breach sometimes never cool back down.' }
    ],
    tensionPairings: [
      { classId: 'gambit', tension: 'A machinist who starts betting on failure-rates may stop building and start wagering.' }
    ],
    subraceFlavor: {
      kethrin_fexric: 'You memorized blueprints the guild would burn if you left.',
      drall_fexric: 'You reverse-engineered machines the guild forbade you to own.',
      tessen_human: 'You studied the vaults by keep-light, and built what the guild forbade.',
      ithran_groven: 'You read the vaults\' gear-teeth the way you read a bridge\'s stress.'
    },
    name: 'Machinist',
    description: 'Deep in the subterranean Fex warrens (the tunnels of a craft-oriented people), behind sealed blast-doors, the guild-vaults keep their knowledge on copper-plate codices: precision gear-craft, clockwork temporal mechanics, and the ancestral binding theory that makes both possible. You trained in those vaults. Whether you are Brasskin (a formally-trained guild scholar) or Alchemite (an expelled dropout who learned in secret), you learned the same grammar of gears, and it marked you for life. Brasskin scholars spend decades memorizing proprietary blueprints under the Master Craft-Guilds\' supervision, every formula earned, catalogued, and owned. Alchemite dropouts learned enough before expulsion to be dangerous; they carry stolen fragment-pages stitched into their clothing, half-understood theories they improvise into working machines that sometimes work. The guild-vaults are closing their doors as the Cragjaw Peaks\' blizzard deepens and the old thermal-pipes freeze. What you memorized, no blast-door can lock away. The warrens are still standing because someone kept building when the vaults stopped sharing. That someone is now you.',
    skillProficiencies: ['Arcana', 'Investigation'],
    toolProficiencies: ['Artisan\'s tools (tinkerer\'s)', 'Thieves\' tools'],
    languages: 1,
    equipment: [
      'Copper-plate codex (water-damaged for Alchemite, pristine for Brasskin)',
      'Tinker\'s toolkit',
      'Blueprint fragment-pages (3)',
      'Vault-pass token (expired or forged)',
      'Workman\'s clothes'
    ],
    startingCurrency: {
      gold: 10,
      silver: 8,
      copper: 0
    },
    feature: {
      name: 'Blueprint Memory',
      description: 'You carry the structural grammar of Fex engineering in your mind. You can identify any mechanical or clockwork device\'s origin-guild, approximate age, and intended function by inspection alone. Once per long rest, you can reverse-engineer a minor mechanism (lock, trap trigger, gear assembly) after 10 minutes of study. Brasskin gain research access at recognized guild halls; Alchemite must rely on the underground salvage markets where their expired tokens still carry cachet.'
    },
    statModifiers: {
      intelligence: 4,
      strength: -2
    }
  },

  herdGuardian: {
    id: 'herdGuardian',
    restrictions: {
      "allowedRegions": [
        "sundrift-vale"
      ],
      "allowedSubraces": [
        'ordan_human'
      ],
      "narrativeUnlock": true,
      "justification": "The migration herds are Ordu-specific. No other culture follows the herds across the Sundrift Vale."
    },
    classHooks: [
      { classId: 'animist', bridge: 'Guarding the herd means learning the routes the dead still remember.' },
      { classId: 'false_prophet', bridge: 'A herder who watches the migration thin may start preaching meaning into the silence.' }
    ],
    tensionPairings: [
      { classId: 'false_prophet', tension: 'A guardian who loses the herd may replace it with a congregation.' }
    ],
    subraceFlavor: {
      ordan_human: 'You moved with the herd by the songs of the dead who knew the route.',
      vashir_astril: 'You guarded the herd by the light of a dead star.',
      silath_astril: 'You guarded the herd and said nothing about the sky.'
    },
    name: 'Herder',
    description: 'The Ordu are steppe nomads who follow the grass-line across the vast Sundrift Vale, and the grass-line runs from the advancing frost. You guarded the migration herds, driving a hundred head of shag-ox through a circuit that never ends: ahead of the frost that claims the pasture, and back before the thaw rots what remains. The steppe kills the careless. You are not careless. You learned to read hoof-tracks in a blizzard, predict supernatural predator movements by the shift of the wind, and keep the herd moving when every instinct screams to shelter and wait. The herds are the Ordu\'s only wealth. Lose one animal to frost-collapse or a supernatural predator, and a family line starves for a generation. The grass-line is shrinking. The frost comes earlier every circuit, and the thaw rots more than it grows. You know the old routes, the safe grazes, the wind-signs that mean run. One lost animal starves a family line for a generation. The frost does not negotiate with cattle, and the herd will not save itself.',
    skillProficiencies: ['Animal Handling', 'Survival'],
    toolProficiencies: ['Artisan\'s tools (leatherworker\'s)'],
    languages: 1,
    equipment: [
      'Herder\'s staff (ironwood core)',
      'Whistle-braided cord (10ft)',
      'Winter-wraps (lined with shag-ox wool)',
      'Trail-biscuits (7 days rations)',
      'Herd-branding iron'
    ],
    startingCurrency: {
      gold: 6,
      silver: 14,
      copper: 0
    },
    feature: {
      name: 'Herd-Sense',
      description: 'You can read the mood and movement of animals with uncanny precision. You have advantage on Animal Handling checks, and once per long rest you can sense the presence and general direction of any predator within 300 feet by the reaction of nearby animals. Ordu migration camps will always offer you shelter and a share of the fire in exchange for a night\'s herd-watch.'
    },
    statModifiers: {
      constitution: 2,
      agility: 2,
      intelligence: -2
    }
  },

  starboundScholar: {
    id: 'starboundScholar',
    restrictions: {
      "allowedRegions": [
        "sundrift-vale"
      ],
      "allowedSubraces": [
        'vashir_astril',
        'silath_astril'
      ],
      "narrativeUnlock": true,
      "justification": "The Echo traditions are Astril-specific institutions. Both Lumian (embracing) and Kordak (suppressing) train in the same cathedral."
    },
    classHooks: [
      { classId: 'harbinger', bridge: 'A stargazer who computes the dead star\'s math too closely may find the doom-arithmetic.' },
      { classId: 'arcanoneer', bridge: 'Charting the eight frequencies as starlight cycles is the Astril road into elemental grammar.' }
    ],
    tensionPairings: [
      { classId: 'harbinger', tension: 'A scholar of a murdered star may stop studying it and start mourning it into a weapon.' }
    ],
    subraceFlavor: {
      vashir_astril: 'You read the sky your ancestors fled across.',
      silath_astril: 'You studied the star that was killed, and were told not to mourn it.',
      ordan_human: 'You charted the stars your ancestors stopped needing.'
    },
    name: 'Astronomer',
    description: 'Every Astril carries Lumia\'s echo in their crystalline markings, the biological resonance of a dead world\'s biosphere, and the Synod (the council that governs the Astril\'s relationship with that heritage) regulates the bond. You trained under its hierarchy, learning the crystal-lattice techniques that keep Lumia\'s echo from overwhelming the host. Whether you are Lumian, who embraces the passenger\'s wild power, or Kordak, who cages it behind mental discipline, you studied the same disciplines and survived them. You catalogued echo-lineages on memory-glass, learned the forbidden Echo-Songs that map the fading signatures of those lost to Lumia\'s call, and trained to recognize the resonance-signatures of an echo approaching the Submersion threshold, the point at which the host\'s consciousness is consumed entirely. Beyond that threshold, the Synod has no technique that brings either back. Lumia\'s echo is dimming. Every cycle, another host flickers toward Submersion, and the Synod\'s crystal techniques buy less time than they did a generation ago. You know the signs and the songs and the lattice-work that holds a dead world inside a living chest. The echo will not keep itself stable. That is your work, and the alternative is finding out what silence sounds like when the last fragment of Lumia goes dark.',
    skillProficiencies: ['Religion', 'Arcana'],
    toolProficiencies: ['Musical instrument (throat-singing bowl)'],
    languages: 2,
    equipment: [
      'Memory-glass shard (echo-lineage encoded)',
      'Crystal resonance bowl',
      'Celestial chart (bone-etched)',
      'Synod vestments',
      'Ritual incense (3 sticks)'
    ],
    startingCurrency: {
      gold: 8,
      silver: 12,
      copper: 0
    },
    feature: {
      name: 'Echo-Resonance Reading',
      description: 'You can identify any Astril\'s echo-lineage, power-level, and stability by observing their crystalline patterns for one minute. Once per long rest, you can calm an echo that is approaching the Submersion threshold (loss of control), granting the host advantage on their next Spirit saving throw. The Synod provides sanctuary to recognized scholars, though Kordak scholars are watched more carefully tha Lumian.'
    },
    statModifiers: {
      spirit: 3,
      intelligence: 1,
      strength: -2
    }
  },

  deepCurrentGuide: {
    id: 'deepCurrentGuide',
    restrictions: {
      "allowedRegions": [
        "iceheart-sea"
      ],
      "allowedSubraces": [
        'deepling_myrathil',
        'shoreling_myrathil',
        'riverling_myrathil'
      ],
      "narrativeUnlock": true,
      "justification": "The deep currents and pressure-dark are Myrathil-specific environments. Merryn sailors stay surface-level; Myrathil descend."
    },
    classHooks: [
      { classId: 'minstrel', bridge: 'Reading a current by feel is one step from singing it.' },
      { classId: 'augur', bridge: 'Reading the deep\'s patterns for danger is the trench road into pressure-sight.' },
      { classId: 'apex', bridge: 'Guiding boats past predators is the trench version of the hunt.' }
    ],
    tensionPairings: [
      { classId: 'animist', tension: 'A guide who listens to the drowned currents may start hearing the drowned.' }
    ],
    subraceFlavor: {
      shoreling_myrathil: 'You guided boats through shallows the surface crews couldn\'t read.',
      deepling_myrathil: 'You navigated trenches no surface vessel has mapped.',
      riverling_myrathil: 'You guided trade down rivers that change course every spring.',
      merryn_human: 'You guided the deep currents and surfaced only to sign the manifest.'
    },
    name: 'Navigator',
    description: 'Beneath the Iceheart Sea\'s frozen surface, the water is still warm, and the Myrathil (an aquatic people who live beneath the ice) have always known it. You navigated the deep currents, the pressure-zones where light dies and the only maps are temperature-gradients felt through the skin. Down there, thermal vents glow against bioluminescent trench-walls, and things breathe in the dark water that remember the names of drowned sailors. You guided expeditions through the Ice Veins, the subsurface warm-water channels, and learned to read the deep-sea\'s silent language of pressure and temperature. The current-shift tells you where the ice above will crack. The silence tells you what is hunting beneath you. The cold-spots tell you where the things that remember are listening. The Ice Veins are narrowing as the surface freezes thicker every year, and the deep-currents are slowing. The abyss is patient, and it is learning the routes the Myrathil have used for generations. You know every current, every vent, every warm pocket the Ice Veins still hold open. The abyss learns a route every time someone uses it and forgets one every season the ice thickens. Guide the expeditions while the routes still exist.',
    skillProficiencies: ['Perception', 'Nature'],
    toolProficiencies: ['Navigator\'s tools', 'Vehicles (water)'],
    languages: 1,
    equipment: [
      'Depth-pressure gauge (Myrathil-crafted)',
      'Bioluminescent lure-stone',
      'Cold-waxed rope (silk-core, 50ft)',
      'Waterproof satchel',
      'Coral-needle tool'
    ],
    startingCurrency: {
      gold: 8,
      silver: 10,
      copper: 0
    },
    feature: {
      name: 'Current-Reading',
      description: 'You can read underwater and subterranean current patterns with preternatural accuracy. You have advantage on Survival and Nature checks in aquatic environments, and can predict when the Iceheart Sea\'s surface will crack or shift. Myrathil deep-communities recognize your skill and will provide safe harbor, fresh water from thermal vents, and passage through the Ice Veins.'
    },
    statModifiers: {
      agility: 2,
      constitution: 2,
      charisma: -2
    }
  },

  fogReader: {
    id: 'fogReader',
    restrictions: {
      "allowedRegions": [
        "frostwood-reach"
      ],
      "allowedSubraces": [
        'veiled_mimir',
        'tethered_mimir',
        'thalren_human',
        'viridian_florae',
        'florae_unified'
      ],
      "narrativeUnlock": true,
      "justification": "Fog-reading requires intimate knowledge of the Frostwood's living fog, its memory-erasing properties, its residue-trails, and its secret passages. Non-Frostwood natives have never survived long enough to learn."
    },
    classHooks: [
      { classId: 'apex', bridge: 'Reading the fog\'s memory-shifts is the first half of the sensory Trade.' },
      { classId: 'inquisitor', bridge: 'A guide who has seen what the fog hides may join the Vow to hunt it.' },
      { classId: 'lunarch', bridge: 'A reader who walks the moonlit groves may catch the parasite\'s notice.' }
    ],
    tensionPairings: [
      { classId: 'shaper', tension: 'A guide who spends too long in the fog may start reshaping to match it.' }
    ],
    subraceFlavor: {
      veiled_mimir: 'You read the fog\'s memory and kept your own intact behind a mask.',
      tethered_mimir: 'You read the fog without a mask, and paid it in memories.',
      thalren_human: 'You guided travelers through the same fog that took your past.',
      florae_unified: 'You read the mist through the groves that grow where it thins.',
      viridian_florae: 'You walked the moonlit groves where the fog remembers the fae-law.',
      ordan_human: 'You read the fog the way you read a storm-line on the steppe.'
    },
    name: 'Scout',
    description: 'The fog in the Frostwood Reach is not weather. It is a living geography that responds to the thoughts of those inside it, and it literally eats memories. You read that fog the way a sailor reads the sea: tracing density shifts, memory-erasure currents, and the residue-trails that things leave when they pass through it. You learned by touch, scent, and the kind of instinct that keeps you alive when the map dissolves. The masked Mimir navigate the canopy by spore-scent and fog-spider silk markers. The Tallyn chart fog-currents on ironwood staves. The thorned Florae feel the fog through their connection to the forest floor, and where the mist pools deepest, their thorns ache with the memory of what it has swallowed. You learned to read all three, because the fog respects no single tradition. The fog is thickening. Every season it eats more, and the safe routes through the Reach shrink with it. You know the currents, the silk-trails, the places the mist pools when something is hunting. The maps lie now; the fog ate the truth out of them years ago. Trust the mist, or lose your name to it like every traveler who reached for ink instead.',
    skillProficiencies: ['Survival', 'Perception'],
    toolProficiencies: ['Navigator\'s tools'],
    languages: 1,
    equipment: [
      'Fog-ward compass (needle follows memory-currents)',
      'Fog-spider silk trail-cord (30ft)',
      'Soot-resin ink stick (marks visible in fog)',
      'Breath-filtering veil',
      'Frostwood traveler\'s cloak'
    ],
    startingCurrency: {
      gold: 7,
      silver: 14,
      copper: 0
    },
    feature: {
      name: 'Fog-Sense',
      description: 'You can navigate the Frostwood\'s memory-erasing fog without losing your bearings. You have advantage on Perception and Survival checks in fog, mist, or haze, and you are immune to the disorientation effect of the Reach\'s fog (though not its memory-erasing properties). Once per long rest, you can trace the trail of any creature (native or Wyrd-touched) through the fog for up to 1 mile. Frostwood settlements and Mimir canopy-posts will offer you shelter and fog-current updates.'
    },
    statModifiers: {
      agility: 2,
      spirit: 2,
      intelligence: -1
    }
  },

  chasmDelver: {
    id: 'chasmDelver',
    restrictions: {
      "allowedRegions": [
        "cragjaw-peaks"
      ],
      "allowedSubraces": [
        'tessen_human',
        'morgh_groven',
        'ithran_groven'
      ],
      "narrativeUnlock": true,
      "justification": "Requires intimate knowledge of Cragjaw geothermal tunnels and deep-chasm infrastructure."
    },
    classHooks: [
      { classId: 'shaper', bridge: 'Delving under the keeps teaches a body to reshape for tight stone.' },
      { classId: 'warden', bridge: 'A delver who has held a tunnel mouth against something knows the chain-graft\'s logic.' },
      { classId: 'martyr', bridge: 'Delvers who have carried a collapsed comrade\'s weight sometimes choose to carry it always.' }
    ],
    tensionPairings: [
      { classId: 'revenant', tension: 'A delver buried too long may come back unwilling to stay buried.' }
    ],
    subraceFlavor: {
      tessen_human: 'You mapped the under-keeps your family sealed and forgot.',
      morgh_groven: 'You delved the old vat-tunnels the Alchemists abandoned.',
      ithran_groven: 'You crossed the deep spans where the bridges end and the dark begins.',
      veiled_mimir: 'You mapped the under-vaults with a mask-lamp and no company.'
    },
    name: 'Delver',
    description: 'The Cragjaw Peaks are not just a labyrinth of storm and bone. Beneath the snow-buried keeps, the geothermal vents pulse in rhythms the surface has forgotten. You are one of the Chasm-Dwellers, the pipe-wardens who descend into the steam-tunnel networks beneath the terraced mountain settlements. You maintain the geothermal pipes with knotted cord records, reinforce the calcified substructures, and read pressure-fluctuations to predict blowouts before the pipes scream. The only light in the deep is the red glow of volcanic blood. Rime-Brides (ice-elemental hunters) stalk the heat-sinks, luring tunnel-workers into the steam-ghost zone. And the Rock-Speakers (the traditional animists who commune with the deep spirits) have been silenced for generations, but their tunnels remain marked in the oldest cord-maps. The vents are pulsing faster now. The pressure is rising. Something beneath the peaks wants out, and you know the tunnels too hot to enter, the pipes about to burst, and the dark where the answers the surface refuses to hear still echo.',
    skillProficiencies: ['Athletics', 'Survival'],
    toolProficiencies: ['Smith\'s tools'],
    languages: 1,
    equipment: [
      'Geothermal lantern',
      'Steam-goggles',
      'Pipe-wrench',
      'Chalk (10 pieces)',
      'Travel rations (5 days)',
      'Common clothes'
    ],
    startingCurrency: {
      gold: 7,
      silver: 18,
      copper: 0
    },
    feature: {
      name: 'Deep-Path Intuition',
      description: 'You can navigate subterranean environments and steam-tunnel networks without a map. You always know your depth relative to the surface and can sense geothermal temperature gradients that lead to safe passage, heat sources, or danger zones. You have advantage on Survival checks in subterranean environments, and you can predict pipe-blowouts and vent-eruptions within 100 feet.'
    },
    statModifiers: {
      constitution: 2,
      intelligence: 2,
      charisma: -2
    }
  },

  brineTrader: {
    id: 'brineTrader',
    restrictions: {
      "allowedRegions": [
        "iceheart-sea"
      ],
      "allowedSubraces": [],
      "narrativeUnlock": true,
      "justification": "Requires familiarity with Brine-Bond Syndicate trade routes and Iceheart coastal tariffs."
    },
    classHooks: [
      { classId: 'gambit', bridge: 'A coastal trader prices risk for a living and has already made the first wager.' },
      { classId: 'minstrel', bridge: 'A trader who works the docks by voice alone is halfway to the Choir.' }
    ],
    tensionPairings: [
      { classId: 'minstrel', tension: 'A trader who learns the sea\'s cadence may start hearing the song under the market.' }
    ],
    subraceFlavor: {
      merryn_human: 'You traded along the Iceheart coast where every contract is a wager.',
      shoreling_myrathil: 'You traded at the tide-line where the land and the sea both pay.',
      deepling_myrathil: 'You surfaced to trade, and went back down richer.',
      riverling_myrathil: 'You carried inland goods to the coast and returned with salt.',
      velun_neth: 'You priced every cargo to the last clause.',
      korr_solari: 'You traded sulfur and glass through ports that feared your eyes.',
      vashir_astril: 'You traded star-charts and crystal, and never quoted the true price.',
      silath_astril: 'You traded under a suppressed name, and your cargo moved anyway.',
      viridian_florae: 'You traded timber and thorn-goods that no ledger would name.',
      florae_unified: 'You traded grove-work in cities that did not know your grove.',
      kethrin_fexric: 'You traded certified goods and refused every uncertified cargo.',
      drall_fexric: 'You traded salvage the guild had written off.',
      tessen_human: 'You traded through the one gate your keep allowed.',
      drun_neth: 'You traded in things that legally did not exist, because neither did you.',
      marked_vreken: 'You traded through the roots, and the roots took their cut.',
      clean_vreken: 'You traded honest goods in a market that preferred dishonest ones.'
    },
    name: 'Trader',
    description: 'The Iceheart Sea, a freezing northern ocean, does not forgive debts, and you learned that lesson not at the mast but at the counter. You never shipped out, but you know every cargo manifest, tariff loophole, and Press-Warrant (forced conscription) evasion that keeps the Brine-Bond Syndicate\'s coastal trade running. You memorized the weight of a bribe in every port, slipped cargo past inspectors, haggled with root-traders for frost-resistant cloth, and traded with salvagers for reclaimed cargo at a tenth of its value. The routes are freezing. The Syndicate tightens its quotas every season. And the traders who cannot adapt end up on the Press-Warrant lists, their tattoo-contracts transferred to the deck of a coal-hauler with no say in the matter. But you know the back-channels, the tax-haven coves, and the exact price of a man\'s freedom when the Board of Trade comes calling. You never needed a deck beneath your feet to navigate the Iceheart. You just needed the right contacts, the right bribes, and the nerve to use them before the ice closed in.',
    skillProficiencies: ['Persuasion', 'Insight'],
    toolProficiencies: ['Gaming set (dice)'],
    languages: 1,
    equipment: [
      'Trade ledger',
      'Syndicate seal ring',
      'Fine clothes',
      'Set of loaded dice',
      'Travel rations (3 days)',
      'Silk rope (50 feet)'
    ],
    startingCurrency: {
      gold: 12,
      silver: 10,
      copper: 0
    },
    feature: {
      name: 'Syndicate Back-Channel',
      description: 'You know the Brine-Bond Syndicate\'s internal codes, territory boundaries, and bribe prices across the Iceheart coast. You can identify whose authority matters in any port (dock-master, harbormaster, Syndicate factor, or Board inspector) and how much influence is required to bypass tariffs, slip cargo past inspection, or secure the release of an indentured sailor from a Press-Warrant.'
    },
    statModifiers: {
      charisma: 3,
      intelligence: 1
    }
  },

  keepWarden: {
    id: 'keepWarden',
    restrictions: {
      "allowedRegions": [ "cragjaw-peaks" ],
      "allowedSubraces": [
        'tessen_human'
      ],
      "narrativeUnlock": true,
      "justification": "Tessic keep-life is sealed behind controlled gates; an outsider could be adopted into a keep or serve as a licensed work-crew member."
    },
    classHooks: [
      { classId: 'revenant', bridge: 'A keep-warden who dies at the gate and is anchored to the keep-stone comes back, and the keep will not let them go.' }
    ],
    tensionPairings: [
      { classId: 'revenant', tension: 'A warden who refuses the keystone-anchor may spend a whole life watching the keep fail instead of holding it.' }
    ],
    subraceFlavor: {
      tessen_human: 'You counted the watch-bells of a keep your family sealed and forgot the way out.',
      morgh_groven: 'You helped pour the keep and stayed to keep it.',
      ithran_groven: 'You know which keep-walls will hold and which will not.'
    },
    name: 'Sentry',
    description: 'The Tessic keep is not a castle. It is a sealed instrument, and you are one of the parts that watches the others. You grew up inside a controlled gate, taught to count the Watch-Bells and to read the keep\'s breath: the frost-thick in the pipes, the groan of a wall as the blizzard finds a new angle, the exact minute the oiled shutters must close or the whole district freezes behind them. House Tesshan traded its visibility for a blizzard that hides the keeps, and the price has been four hundred years of maintenance. You drill for an extinction that has not come yet and will not stop being scheduled. The keep\'s stone is failing in places the official engineers will not admit, and the ledger of repairs has been quietly falling behind for a generation. You are the one who stays when the gate seals. What you keep out, and what you let in, is the whole question of a keep-warden\'s life.',
    skillProficiencies: ['Perception', 'Investigation'],
    toolProficiencies: ['Artisan\'s tools (keep-mechanisms)'],
    languages: 1,
    equipment: [
      'Brass watch-bell (kept silent)',
      'Frost-pipe pressure gauge',
      'Sealed keep-signet',
      'Wax ration tally',
      'Common clothes'
    ],
    startingCurrency: { gold: 8, silver: 6, copper: 0 },
    feature: {
      name: 'Watch-Bell Recall',
      description: 'You know the warning-signs of a failing structure: frost-thick, pipe-groan, the shift of a wall under load. You gain advantage on checks to detect structural or environmental failure (collapsing floors, failing seals, breached walls) and can name the safest exit of any enclosed settlement you have spent an hour in.'
    },
    statModifiers: { constitution: 2, intelligence: 1 }
  },

  spanBuilder: {
    id: 'spanBuilder',
    restrictions: {
      "allowedRegions": [ "cragjaw-peaks" ],
      "allowedSubraces": [
        'morgh_groven',
        'ithran_groven'
      ],
      "narrativeUnlock": true,
      "justification": "Ancestor-span engineering is a Groven guild tradition; an outsider could be apprenticed into a span-crew."
    },
    classHooks: [
      { classId: 'warden', bridge: 'A span-builder who has held a falling bridge knows the chain-graft\'s logic: hold the load, or everyone below dies.' },
      { classId: 'shaper', bridge: 'Reading a span\'s stress teaches a Groven body to reshape under load.' },
      { classId: 'martyr', bridge: 'Span-crews tally every crossing that held; some builders choose to become the span.' }
    ],
    tensionPairings: [
      { classId: 'shaper', tension: 'A builder who begins reshaping the bridge instead of building it drifts toward the Shaping Hall.' }
    ],
    subraceFlavor: {
      morgh_groven: 'You poured spans with Morgh vat-crews and never once stepped off the edge.',
      ithran_groven: 'You read the wind across a span before you trusted it with weight.',
      tessen_human: 'You crossed the spans so often you learned to mend them.'
    },
    name: 'Builder',
    description: 'The Ancestor-Spans are not built. They are grown, calcified bone-work laid down by Groven dead, and they are the only crossings in the Cragjaw that the blizzard cannot erase. You are one of the crews that keep them standing. You learned to read a span the way a physician reads a body: the resonance when the wind hits, the hairline shift at a joint, the minute sag that means a crossing has one more winter in it. When the Deep Alchemists reshaped your ancestors into labor, they built something that could carry weight forever; the spans are what you built with that inheritance once it belonged to you. The old spans are failing faster than the crews can mend them, and the engineers who understood the original bone-work are dying. You carry the load, literally, and the bridge remembers who built it. What you do when the last span goes is the only crossing left that no one has mapped.',
    skillProficiencies: ['Athletics', 'Investigation'],
    toolProficiencies: ['Artisan\'s tools (bone-masonry)'],
    languages: 1,
    equipment: [
      'Span-reader\'s resonance rod',
      'Bone-mason\'s chisel and clamps',
      'Load-cord (knotted tally)',
      'Harness and grapnel',
      'Traveler\'s clothes'
    ],
    startingCurrency: { gold: 9, silver: 7, copper: 0 },
    feature: {
      name: 'Load-Bearer',
      description: 'You can read the structural integrity of any span, floor, or bridge at a glance and know its safe load. You gain advantage on checks to cross or reinforce failing structures, and once per long rest you may brace a collapsing structure long enough for your allies to cross safely (they pass unharmed; you take the strain).'
    },
    statModifiers: { strength: 2, constitution: 1 }
  },

  contractClerk: {
    id: 'contractClerk',
    restrictions: {
      "allowedRegions": [ "bryngloom-forest" ],
      "allowedSubraces": [
        'velun_neth'
      ],
      "narrativeUnlock": true,
      "justification": "The First Contract is Athien; an outsider could serve as a licensed foreign notary, but never as a signatory."
    },
    classHooks: [
      { classId: 'arcanoneer', bridge: 'A clerk who has filed ten thousand clauses is one equation away from filing a weave.' },
      { classId: 'animist', bridge: 'Filing a request with the archive of the dead is just contract-law applied to ancestors.' },
      { classId: 'revenant', bridge: 'A clerk who dies mid-clause sometimes finds the Contract will not release the signature.' }
    ],
    tensionPairings: [
      { classId: 'revenant', tension: 'A clerk who trusts the paperwork too much may sign away the one clause that keeps them alive.' }
    ],
    subraceFlavor: {
      velun_neth: 'You filed clauses in the Heart-Vault and learned that a promise is a thing with teeth.',
      kessen_neth: 'You filed clauses for the Athien and kept your own obligations hidden.'
    },
    name: 'Clerk',
    description: 'In the Heart-Vault at Atropolis, the First Contract grows through the living ironwood like a fossil in amber, and clerks like you tend it. You were raised on the Doctrine of Exhaustion: every event is a clause, every clause a sentence in a grammar older than speech, and your job is to file the world correctly. You have read the clauses the Ledger hides, the ones drafted during the Years of Whispers, the ones that price a person\'s whole life in bog-iron ink. You know exactly how much of a citizen is negotiable, because you have been the one negotiating. The Ledger is fracturing, and the clauses you filed decades ago are being rejected by Morvane itself, which means the ground beneath your entire people may be a lie that is only now coming due. You did not sign the Contract. You only wrote it down. But a clerk knows better than anyone that what is written is what is real, and what is real can be voided.',
    skillProficiencies: ['History', 'Insight'],
    toolProficiencies: ['Calligrapher\'s supplies'],
    languages: 2,
    equipment: [
      'Sealed filing-quill',
      'Bog-iron inkpot (First Contract grade)',
      'Notary\'s ledger (water-stained)',
      'Memory-glass reading lens',
      'Common clothes'
    ],
    startingCurrency: { gold: 14, silver: 6, copper: 0 },
    feature: {
      name: 'Filed Witness',
      description: 'You may cite the First Contract to compel a moment of truth. Once per long rest, when a creature speaks a falsehood in your presence, you may invoke the Contract aloud; the creature must make a Spirit save (DC 13) or be unable to repeat that specific lie for one day. Athien recognize your authority; other peoples are impressed, suspicious, or furious, depending on what your people have done to their ledgers.'
    },
    statModifiers: { intelligence: 3, charisma: -1 }
  },

  obligationBroker: {
    id: 'obligationBroker',
    restrictions: {
      "allowedRegions": [ "bryngloom-forest" ],
      "allowedSubraces": [
        'kessen_neth'
      ],
      "narrativeUnlock": true,
      "justification": "Obligation-web brokerage is a Weft specialty; an outsider could buy into the trade with a recorded debt."
    },
    classHooks: [
      { classId: 'augur', bridge: 'Reading the obligation-web for an impending breach is the Weft road into the Augur\'s audit.' },
      { classId: 'gambit', bridge: 'A broker who has staked a fate-thread already knows how the House keeps its collateral.' }
    ],
    tensionPairings: [
      { classId: 'gambit', tension: 'A broker who stops brokering and starts wagering becomes a Gambit, and the House collects either way.' }
    ],
    subraceFlavor: {
      kessen_neth: 'You sold a stranger\'s future to pay a debt that was never yours.',
      velun_neth: 'You brokered obligations the Ledger had already priced.'
    },
    name: 'Broker',
    description: 'The Weft see the world as a web of obligations, and you learned to read the threads the way a sailor reads wind. Every promise is a line, every debt a knot, and every person a point where many lines cross. You worked the flooded vaults and the frontier posts where the web is thinnest, buying and selling claims on other people\'s futures: a favor owed here, a marriage promised there, the second half of a fate-thread staked generations ago in a vault no one remembers opening. The House holds your bloodline\'s threads as collateral, so you keep moving, because a Weft who stops raising the stakes begins to fray. You have sold things that were not yours to sell and made them true by writing them down. The web is coming up short, the same way the Reckoner\'s ledger is, and something is quietly cutting threads. You can feel it through the strands you still hold. When the web breaks, you will know which knot was holding you.',
    skillProficiencies: ['Persuasion', 'Insight'],
    toolProficiencies: ['Gaming set'],
    languages: 1,
    equipment: [
      'Obligation-web tally (knotted cord)',
      'Set of marked fate-coins',
      'Registry writ (loan against a future)',
      'Debt-knife (ceremonial)',
      'Common clothes'
    ],
    startingCurrency: { gold: 10, silver: 12, copper: 0 },
    feature: {
      name: 'Web-Read',
      description: 'You can sense a binding obligation and its strain. Once per long rest, when you interact with a creature for at least a minute, you learn one true obligation they carry (a debt, an oath, a promised favor) and whether it is close to breaking. You also know when you personally are the target of an unfulfilled obligation.'
    },
    statModifiers: { charisma: 2, intelligence: 1 }
  },
  greymarkArchivist: {
    id: 'greymarkArchivist',
    restrictions: {
      "allowedRegions": [ "frostwood-reach" ],
      "allowedSubraces": [
        'thalren_human'
      ],
      "narrativeUnlock": true,
      "justification": "The Greymark lineage-tapestries are a Tallyn institution; an outsider could be adopted into a record-keeping house."
    },
    classHooks: [
      { classId: 'inquisitor', bridge: 'An archivist who has read what the tapestries record knows exactly what the fog hides, and who is hiding it.' },
      { classId: 'toxicologist', bridge: 'A keeper who catalogues every poison the fog-predators carry is already half a Distiller.' }
    ],
    tensionPairings: [
      { classId: 'inquisitor', tension: 'An archivist who decides the record itself is a corruption may take the Vow and start cutting names.' }
    ],
    subraceFlavor: {
      thalren_human: 'You kept the tapestries that remember what the fog has already taken.',
      veiled_mimir: 'You archived lineages with the Mimir, mask to ledger.',
      tethered_mimir: 'You kept names without a mask, and paid the fog in your own.'
    },
    name: 'Archivist',
    description: 'The Frostwood Reach eats memory, and Greymark Keep answers with ink. You served the lineage-tapestries: forty thousand names woven into hanging cloth, each thread a person the fog has not yet been allowed to erase. An archivist\'s work is a war fought one name at a time. You learned to recite a family\'s ancestry back thirty generations without a ledger, and to hear the moment a petitioner\'s story stops matching the record. The fog does not merely take people; it rewrites what everyone remembers about them, and only the tapestries disagree. The Reach is forgetting faster than the tapestries can be rewoven, and someone has begun cutting threads that were never meant to be cut. You are one of the few who can prove a name existed at all. Whether you restore it or bury it is the question every archivist eventually answers.',
    skillProficiencies: ['History', 'Insight'],
    toolProficiencies: ['Calligrapher\'s supplies'],
    languages: 2,
    equipment: [
      'Waxed lineage-tapestry swatch',
      'Archivist\'s recording quill',
      'Bog-iron inkpot (record grade)',
      'Index-cord (knotted name tally)',
      'Common clothes'
    ],
    startingCurrency: { gold: 12, silver: 8, copper: 0 },
    feature: {
      name: 'Living Index',
      description: 'You have committed thousands of lineages to memory. You can recite the recorded ancestry of any Frostwood family you have studied, and once per long rest you may recall a specific detail (a name, an oath, a debt) about a person the fog has erased, proving it existed. Tallyn recognize your authority; the Forgotten and those who profit from forgetting do not.'
    },
    statModifiers: { intelligence: 2, spirit: 1 }
  },

  privateer: {
    id: 'privateer',
    restrictions: {
      "allowedRegions": [ "iceheart-sea" ],
      "allowedSubraces": [ "merryn_human" ],
      "narrativeUnlock": true,
      "justification": "Merryn letters-of-marque are a Merrowport institution; an outsider could sail under a bought commission."
    },
    classHooks: [
      { classId: 'gambit', bridge: 'A privateer\'s whole trade is a wager on the next prize, and the House is already counting.' },
      { classId: 'minstrel', bridge: 'A crew sings itself into a fight; some privateers learn to make the song real.' }
    ],
    tensionPairings: [
      { classId: 'gambit', tension: 'A privateer who stops hunting prizes and starts staking them becomes a Gambit, and the House owns the ship.' }
    ],
    subraceFlavor: {
      merryn_human: 'You sailed under a letter-of-marque and paid your crew in shares of luck.'
    },
    name: 'Privateer',
    description: 'The Iceheart Sea does not recognize neutrality, only commissions. You sailed under a Merryn letter-of-marque, licensed to take what the Board of Trade could not protect and to keep a share of it. You know prize law the way a duelist knows reach: which hulls are fair game, which flags are a trap, and which storm-lane will hide a raid. Your crew was paid in shares, not wages, and a bad run meant a hungry winter for every family in the tattoo-ledger. You have burned a ship you meant to keep and kept one you meant to burn. The line between privateer and pirate is a piece of paper, and yours is water-stained and quietly forged in one clause. When the ice closes and the prizes thin, the only question is who you will rob next, and whether your crew still trusts the paper that made them legal.',
    skillProficiencies: ['Deception', 'Survival'],
    toolProficiencies: ['Navigator\'s tools'],
    languages: 1,
    equipment: [
      'Water-stained letter-of-marque',
      'Prize-share ledger (tattoo-inked)',
      'Boarding axe',
      'Storm-lane chart',
      'Common clothes'
    ],
    startingCurrency: { gold: 10, silver: 10, copper: 0 },
    feature: {
      name: 'Letter of Marque',
      description: 'You carry a commission that a Merryn port will honor and most others will argue about. In coastal settlements you can claim safe harbor, sell prize goods at a reduced tariff, and legally refuse a Press-Warrant once per port. Inland or under Board of Trade authority, the letter marks you as a raider and can be used against you.'
    },
    statModifiers: { charisma: 2, agility: 1 }
  },

  nameless: {
    id: 'nameless',
    restrictions: {
      "allowedRegions": [ "bryngloom-forest" ],
      "allowedSubraces": [ "drun_neth" ],
      "narrativeUnlock": true,
      "justification": "Being struck from the First Contract is a Riven state; an outsider could be declared legally dead through a Severing or a forged erasure."
    },
    classHooks: [
      { classId: 'plaguebringer', bridge: 'The law cannot see you and neither can the hush; a Nameless is the ideal host for a plague that registers as nothing.' }
    ],
    tensionPairings: [
      { classId: 'plaguebringer', tension: 'A Nameless who decides to make the world acknowledge them may do it through a plague no ledger can trace.' }
    ],
    subraceFlavor: {
      drun_neth: 'You were struck from the Contract, and the world has been trying to forget you ever since.'
    },
    name: 'Nameless',
    description: 'In the Bryngloom, a name is a legal fact. Yours is not one. You were struck from the First Contract, or you struck yourself from it, and the Registry now reads as if you were never born. The law cannot tax you, bind you, inherit you, or avenge you. The Riven call this freedom; the Bedel call it damnation; the Registry calls it a filing error it will eventually correct. You live in the seams of a civilization built entirely on recorded names, which makes you invisible and unspeakably lonely. Every door that checks a ledger closes to you, and every door that does not is usually a trap. You keep no legal records because you are not a legal person. Whatever you build, you build under a name you borrowed, and you know exactly how long you can keep wearing it.',
    skillProficiencies: ['Stealth', 'Deception'],
    toolProficiencies: ['Forgery kit'],
    languages: 1,
    equipment: [
      'Borrowed identity papers',
      'Forgery kit',
      'Severance token (null-iron)',
      'Peat-hooded cloak',
      'Common clothes'
    ],
    startingCurrency: { gold: 6, silver: 4, copper: 0 },
    feature: {
      name: 'Unperson',
      description: 'You have no legal record, so Registry- and Ledger-keyed magic and bureaucracy cannot target or track you by name (this includes First Contract-keyed detection). The cost is standing: you cannot own property, claim an inheritance, or invoke any civic right, and anyone who formally \'recognizes\' you can drag you back into the ledger\'s reach.'
    },
    statModifiers: { agility: 2, charisma: -1 }
  },

  cryptKeeper: {
    id: 'cryptKeeper',
    restrictions: {
      "allowedRegions": [ "bryngloom-forest" ],
      "allowedSubraces": [ "clean_vreken", "marked_vreken" ],
      "narrativeUnlock": true,
      "justification": "The ancestral crypts and the Root-Veil are Mycellan institutions; an outsider could be bound to a crypt through an unpaid life-debt."
    },
    classHooks: [
      { classId: 'animist', bridge: 'A keeper who tends the ancestral lights is already speaking with the dead.' },
      { classId: 'plaguebringer', bridge: 'A keeper who has catalogued every rot in the crypt is half a cultivator already.' },
      { classId: 'inquisitor', bridge: 'Cromyx keepers are the ones sent after whatever climbs out of a breached crypt.' }
    ],
    tensionPairings: [
      { classId: 'revenant', tension: 'A keeper who refuses to let the crypt claim them may simply refuse to stay buried.' }
    ],
    subraceFlavor: {
      clean_vreken: 'You kept the crypts where the ancestral lights burn, and named every one of them.',
      marked_vreken: 'You kept the crypts from the inside, and the mycelium kept you.'
    },
    name: 'Crypt-Keeper',
    description: 'Beneath the Bryngloom, the Mycellan do not bury their dead so much as keep them lit. You are one of the keepers who tend the ancestral crypts, where the fungal glow that passes for a soul is fed and watched and counted. A keeper\'s work is equal parts gardener and jailer: you feed the lights that still answer, you name the ones that go dark, and you seal the ones that start to move without permission. The Root-Veil runs through every crypt wall, and lately it has been pulling back from the oldest chambers, leaving the lights to gutter on their own. Something is waking in the deep rows that the old keepers\' ledgers only hint at. You know the difference between a light that is resting and a light that is hunting, and you are one of the few who can still tell.',
    skillProficiencies: ['Religion', 'Insight'],
    toolProficiencies: ['Herbalism kit'],
    languages: 1,
    equipment: [
      'Ancestral-light lantern',
      'Crypt-row ledger (bark-bound)',
      'Root-Veil warding salts',
      'Funeral veil',
      'Common clothes'
    ],
    startingCurrency: { gold: 7, silver: 6, copper: 0 },
    feature: {
      name: 'Ancestral Light',
      description: 'You can read the fungal ancestral lights of a crypt: which are at rest, which are failing, and which are no longer themselves. You have advantage on checks to detect undead, fungal corruption, or a light that has been tampered with, and you can safely seal (or release) one such light per long rest. Mycellan crypts and the Root-Veil recognize your office; the Registry considers you a grave-robber with paperwork.'
    },
    statModifiers: { spirit: 2, intelligence: 1 }
  },


  zenithCartographer: {
  "id": "zenithCartographer",
  "restrictions": {
    "allowedRegions": [
      "zenith",
      "frostwood-reach"
    ],
    "allowedSubraces": [
      "vashir_astril"
    ],
    "narrativeUnlock": true,
    "justification": "Only the Lumian maintain the high celestial astrolabes that pierce the upper cloud-ceilings to chart pre-Star-Fall constellations."
  },
  "classHooks": [
    {
      "classId": "arcanoneer",
      "bridge": "Stellar geometry and celestial angles translate directly into high-tier elemental firing matrices."
    },
    {
      "classId": "augur",
      "bridge": "Reading dead stars that still shine through the gloom provides the cleanest causal timelines."
    },
    {
      "classId": "harbinger",
      "bridge": "Tracking where celestial bodies crashed into the void reveals where planar rifts are widest."
    }
  ],
  "tensionPairings": [
    {
      "classId": "animist",
      "tension": "An astronomer who looks only upward can become estranged from the bone-and-soil ancestor spirits below."
    }
  ],
  "subraceFlavor": {
    "vashir_astril": "You tracked the dying constellations from the highest frosted domes, knowing every missing star by its absence."
  },
  "name": "Zenith Cartographer",
  "description": "Before the Star-Fall dragged darkness over Mythrill, the Lumian charted every celestial transit. You were trained in the high crystal-domed observatories of the upper peaks, learning to read stellar grammar through brass armillary spheres and frosted quartz lenses. Even now, with the sun buried and only dim cosmic rifts flickering in the stratosphere, your eyes track the silent drift of Selunis and the faint echoes of the First Contract. You can map a continent by dead stars alone, navigating terrain where compasses spin uselessly in the fog.",
  "skillProficiencies": [
    "Arcana",
    "Investigation"
  ],
  "languages": 2,
  "equipment": [
    "Brass armillary astrolabe",
    "Star-chart parchment scroll (star-leather tube)",
    "Quartz focusing prism",
    "Scribe's celestial ink-well",
    "Traveling robes"
  ],
  "startingCurrency": {
    "gold": 14,
    "silver": 5,
    "copper": 0
  },
  "feature": {
    "name": "Stellar Zenith",
    "description": "You always know true celestial north, current time of day or night, and the exact phase of Selunis even while deep underground or beneath thick magical fog. You cannot become lost while navigating under an open or partially visible sky."
  },
  "statModifiers": {
    "intelligence": 2,
    "spirit": 1,
    "strength": -1
  }
},

  craterVanguard: {
  "id": "craterVanguard",
  "restrictions": {
    "allowedRegions": [
      "sundale",
      "frostwood-reach"
    ],
    "allowedSubraces": [
      "silath_astril"
    ],
    "narrativeUnlock": true,
    "justification": "The Kordak bear the high-density bone and kinetic shock-tolerance forged during violent celestial impacts."
  },
  "classHooks": [
    {
      "classId": "crusader",
      "bridge": "Working the glowing crater-iron binds sacred celestial alloy directly into heavy armaments."
    },
    {
      "classId": "harbinger",
      "bridge": "Surviving kinetic blast-waves attunes the body to entropy and force devastation."
    },
    {
      "classId": "augur",
      "bridge": "Divining the landing sites of future falling debris is second nature to crater scouts."
    }
  ],
  "tensionPairings": [
    {
      "classId": "falseProphet",
      "tension": "Hearing celestial voices in the smoking impact-glass threatens to tear a warrior away from the frontline."
    }
  ],
  "subraceFlavor": {
    "silath_astril": "Your bones absorbed the impact when the star hit; you stood where weaker flesh shattered to ash."
  },
  "name": "Crater Vanguard",
  "description": "Where falling stars tore into the earth and left boiling basins of glass and shattered bedrock, the Silath Astril walked into the fire. With bones dense as ironwood and skin conditioned by intense gravitational shear, you served on the vanguard that secured impact craters before scavengers or Wyrd beasts could claim the celestial slag. You know how to brace against seismic shocks, lever fallen meteorites out of magma-crusts, and stand your ground against blast-waves that would snap ordinary limbs like dry twigs.",
  "skillProficiencies": [
    "Athletics",
    "Survival"
  ],
  "languages": 1,
  "equipment": [
    "Meteorite-iron crowbar",
    "Basalt-fiber heavy gloves",
    "Heavy impact boots",
    "Serrated pry-dagger",
    "Common clothes"
  ],
  "startingCurrency": {
    "gold": 10,
    "silver": 8,
    "copper": 0
  },
  "feature": {
    "name": "Dense Gravitas",
    "description": "Your dense bone structure and low center of gravity grant advantage on saving throws and checks against being knocked prone, shoved, or moved against your will. In addition, falling damage is reduced by an amount equal to your level times 2."
  },
  "statModifiers": {
    "constitution": 2,
    "strength": 1,
    "agility": -1
  }
},

  clockworkHorologist: {
  "id": "clockworkHorologist",
  "restrictions": {
    "allowedRegions": [
      "iron-deep",
      "sundale"
    ],
    "allowedSubraces": [
      "kethrin_fexric"
    ],
    "narrativeUnlock": true,
    "justification": "The Guild-Bound Fex strictly regulate the water-clocks, dead-beat escapements, and temporal balances of the subterranean under-cities."
  },
  "classHooks": [
    {
      "classId": "chronarch",
      "bridge": "Calibrating micro-escapements is the mundane foundation of anchoring temporal currents."
    },
    {
      "classId": "spellguard",
      "bridge": "Interception gear requires micro-tolerances that only master horologists can forge."
    },
    {
      "classId": "arcanoneer",
      "bridge": "Clockwork gear-trains regulate the delicate mana-fuel flow in modern elemental cannonry."
    }
  ],
  "tensionPairings": [
    {
      "classId": "pyrofiend",
      "tension": "A horologist whose precision is warped by Scathrach breach-fire risks melting their own life's work."
    }
  ],
  "subraceFlavor": {
    "kethrin_fexric": "You spent eighty years cutting tooth-profiles into brass wheels so the grand water-clock never lost a heartbeat."
  },
  "name": "Clockwork Horologist",
  "description": "Deep within the subterranean workshops of the Kethrin Guilds, life is measured in the rhythmic click of escapements and the tension of hairsprings. You spent decades apprenticed to master clock-smiths, learning to hand-cut gear teeth to micron tolerances, temper coiled mainsprings in sulfur oil, and balance pendulum-regulators that keep entire underground bastions synchronized. To you, a mechanism is not a puzzle; it is a mechanical heartbeat waiting to be calibrated.",
  "skillProficiencies": [
    "Investigation",
    "Arcana"
  ],
  "languages": 1,
  "equipment": [
    "Horologist's loupe and tweezers",
    "Set of precision brass micro-files",
    "Pocket chronometer in cushioned case",
    "Brass caliper",
    "Guild apprentice apron"
  ],
  "startingCurrency": {
    "gold": 16,
    "silver": 0,
    "copper": 0
  },
  "feature": {
    "name": "Escapement Precision",
    "description": "You intuitively detect mechanical stress, flawed clockwork, trap triggers, and lock tumblers by sound and touch. You gain advantage on checks to disarm mechanical devices, pick mechanical locks, or repair clockwork apparatus."
  },
  "statModifiers": {
    "intelligence": 2,
    "agility": 1,
    "spirit": -1
  }
},

  vitriolProspector: {
  "id": "vitriolProspector",
  "restrictions": {
    "allowedRegions": [
      "iron-deep",
      "sundale"
    ],
    "allowedSubraces": [
      "drall_fexric"
    ],
    "narrativeUnlock": true,
    "justification": "The Clan-Free Fex survive in the caustic runoff tunnels and acid leach-fields where guild laws dare not reach."
  },
  "classHooks": [
    {
      "classId": "gambit",
      "bridge": "Diving into boiling vitriol sumps is the ultimate wager of health against heavy metal yields."
    },
    {
      "classId": "warden",
      "bridge": "Chemical grafting requires bodies that do not dissolve at the first drip of caustic solvent."
    },
    {
      "classId": "spellguard",
      "bridge": "Absorbing chemical explosions prepares an operative for venting unstable volatile energy."
    }
  ],
  "tensionPairings": [
    {
      "classId": "arcanoneer",
      "tension": "A rough acid-diver who handles refined high-astral conduits is viewed as a clumsy liability by academic gunners."
    }
  ],
  "subraceFlavor": {
    "drall_fexric": "You have no guild badge, but you know which green puddle will yield raw copper and which will eat your boots."
  },
  "name": "Vitriol Prospector",
  "description": "While the guild-bound kin polished clock-wheels in well-ventilated halls, you climbed down into the caustic sumps where toxic runoff from industrial alchemy pools into boiling ponds of vitriol. Clan-free and beholden to no guild master, you earned your bread panning acidic sediment for precipitated platinum, leeching copper-scale with raw vitriol, and clearing corroded drain-flumes that would dissolve a human's lungs in three breaths. Your calluses are yellowed, your nostrils scent chemical leaks before the alarms ring, and your kit is made of lead and vulcanized gut.",
  "skillProficiencies": [
    "Survival",
    "Acrobatics"
  ],
  "languages": 1,
  "equipment": [
    "Lead-lined vitriol crucible",
    "Treated leather respirator-mask",
    "Corrosion-resistant copper tongs",
    "Acid-burned protective apron",
    "Sturdy salvage clothes"
  ],
  "startingCurrency": {
    "gold": 11,
    "silver": 6,
    "copper": 0
  },
  "feature": {
    "name": "Caustic Tolerance",
    "description": "You have resistance to environmental acid damage and toxic chemical fumes. You can identify corrosive chemicals, alchemical reagents, and refined acids by sight and faint aroma without risking harm."
  },
  "statModifiers": {
    "constitution": 2,
    "agility": 1,
    "charisma": -1
  }
},

  peatTender: {
  "id": "peatTender",
  "restrictions": {
    "allowedRegions": [
      "bryngloom-forest"
    ],
    "allowedSubraces": [
      "morgh_groven"
    ],
    "narrativeUnlock": true,
    "justification": "The Morgh Groven dwell in the ancient rot-canopies and deep peat bogs where decomposition is the sacred source of renewal."
  },
  "classHooks": [
    {
      "classId": "shaper",
      "bridge": "Molding rotting wood and fibrous bog-moss is the origin of Groven morphological sculpting."
    },
    {
      "classId": "martyr",
      "bridge": "Surrendering one's own bark to feed the fungal nursery is the sacred theology of willing loss."
    },
    {
      "classId": "warden",
      "bridge": "Grafting petrified or peat-cured timber directly onto living wood creates unbreakable bio-frames."
    }
  ],
  "tensionPairings": [
    {
      "classId": "berserker",
      "tension": "A tender whose patient decomposition rhythm is shattered by reckless rage disrupts the delicate peat balance."
    }
  ],
  "subraceFlavor": {
    "morgh_groven": "You buried the dead in living peat, listening as the roots broke bone into sap and the moss learned their names."
  },
  "name": "Peat-Grave Tender",
  "description": "In the stagnant black waters of the Bryngloom, the Morgh Groven do not consider death an ending, but a necessary digestion. As a Peat-Grave Tender, you walked the spongy quagmires where centuries of fallen trees and forgotten wanderers sink into the preserving peat. You tended the shelf-fungi nurseries, harvested medicinal mold-veils from ancestral bogs, and listened to the slow, subterranean sighs of the peat-moss as it broke down the dead to feed the living canopy. You know the exact consistency of earth that will preserve a secret forever—or give it back when the rot is finished.",
  "skillProficiencies": [
    "Nature",
    "Medicine"
  ],
  "languages": 1,
  "equipment": [
    "Bog-iron peat spade",
    "Woven wicker herb basket with dried shelf-fungi",
    "Jar of preserving bog-clay",
    "Lichen-stitched wrap",
    "Common clothes"
  ],
  "startingCurrency": {
    "gold": 8,
    "silver": 12,
    "copper": 0
  },
  "feature": {
    "name": "Mycelial Sense",
    "description": "By pressing your hand to wet soil, moss, or peat, you can sense the presence of decomposing matter, buried corpses, and subterranean water flows within 60 feet. You gain advantage on Medicine checks using natural herbs and fungal pastes."
  },
  "statModifiers": {
    "spirit": 2,
    "constitution": 1,
    "charisma": -1
  }
},

  petrifiedMason: {
  "id": "petrifiedMason",
  "restrictions": {
    "allowedRegions": [
      "bryngloom-forest",
      "frostwood-reach"
    ],
    "allowedSubraces": [
      "ithran_groven"
    ],
    "narrativeUnlock": true,
    "justification": "The Amordjin Groven carry quartz, silica, and basalt in their petrified heartwood, shaping rock and stone like timber."
  },
  "classHooks": [
    {
      "classId": "chronarch",
      "bridge": "Petrified timber that took ten thousand years to mineralize carries deep temporal stability."
    },
    {
      "classId": "warden",
      "bridge": "Interlocking mineralized heartwood into defensive bulwarks is ancient Amordjin engineering."
    },
    {
      "classId": "martyr",
      "bridge": "Enduring centuries of tectonic grinding without yielding teaches absolute sacrificial resilience."
    }
  ],
  "tensionPairings": [
    {
      "classId": "shaper",
      "tension": "Forcing mineralized stone-bark to rapidly flex and reform causes excruciating structural fractures."
    }
  ],
  "subraceFlavor": {
    "ithran_groven": "Your heartwood calcified three ages ago; you carve petrified oak with the grain of granite."
  },
  "name": "Petrified Timber-Mason",
  "description": "Over centuries of absorbing silica and subterranean mineral springs, the Amordjin Groven undergo a wondrous calcification: their sap crystallizes into quartz and their bark turns to slate. As a Petrified Timber-Mason, you worked the ancient stone-groves, quarrying petrified trees that predate the Star-Fall to construct monolithic bridges, vault arches, and retaining walls that never rot or warp. You read the fault-lines in ancient stone as clearly as rings in soft pine, shaping rock with seasoned gouges and patient leverage where human picks break.",
  "skillProficiencies": [
    "Athletics",
    "History"
  ],
  "languages": 1,
  "equipment": [
    "Hardened flint chisel and stone hammer",
    "Carved sample of petrified heartwood",
    "Architectural plumb-line and chalk",
    "Heavy canvas apron",
    "Work clothes"
  ],
  "startingCurrency": {
    "gold": 12,
    "silver": 4,
    "copper": 0
  },
  "feature": {
    "name": "Lithic Grain",
    "description": "You understand the structural integrity of natural stone, masonry, and petrified materials. You can identify load-bearing weaknesses, hidden tunnels, and unstable rock with a glance. You have natural DR 1 against non-magical bludgeoning and crushing damage."
  },
  "statModifiers": {
    "constitution": 2,
    "strength": 1,
    "agility": -1
  }
},

  scriptureHerald: {
  "id": "scriptureHerald",
  "restrictions": {
    "allowedRegions": [
      "zenith",
      "frostwood-reach"
    ],
    "allowedSubraces": [
      "veiled_mimir"
    ],
    "narrativeUnlock": true,
    "justification": "The Arch Mimir rule from the cloud-spire aeries, preserving celestial genealogies and ancient scripture archives."
  },
  "classHooks": [
    {
      "classId": "lunarch",
      "bridge": "The high aeries preserve the earliest hymns to Selunis before the moon-gloom fell."
    },
    {
      "classId": "warden",
      "bridge": "Guarding the cloud-bridges against sky-beasts requires immaculate martial discipline."
    },
    {
      "classId": "shaper",
      "bridge": "Arch Mimir aesthetics treat the living body as an architectural canvas for sublime symmetry."
    }
  ],
  "tensionPairings": [
    {
      "classId": "apex",
      "tension": "Trading sensory purity for bestial instincts is considered grotesque degeneration in the high aeries."
    }
  ],
  "subraceFlavor": {
    "veiled_mimir": "You stood upon the marble wind-terraces, singing the Seven Decrees to pilgrims who could not bear your gaze."
  },
  "name": "Scripture-Aerie Herald",
  "description": "Perched upon soaring peaks above the mist, the Arch Mimir maintain the immaculate white marble spires of the Scripture-Aeries. You were raised in the high wind-galleries, trained from youth in heraldic genealogy, ancient treaties, and the ceremonial recitation of the Pre-Fall Compacts. Your voice was cultivated to carry across mountain chasms without strain, bearing the formal edicts of high councils to the lower valleys. You carry yourself with the unyielding poise of a people who have never set foot in the mud without feeling their dignity offended.",
  "skillProficiencies": [
    "History",
    "Persuasion"
  ],
  "languages": 2,
  "equipment": [
    "Illuminated aerie scroll-case",
    "Silver-nibbed transcription quill",
    "Ceremonial silk shoulder-sash",
    "Formal heraldic mantle",
    "Fine linen robes"
  ],
  "startingCurrency": {
    "gold": 18,
    "silver": 0,
    "copper": 0
  },
  "feature": {
    "name": "Highborne Decorum",
    "description": "Your formal speech and mastery of heraldry command respect among nobility, diplomats, and planar entities. You gain advantage on Persuasion and Insight checks when dealing with officials, high courts, or religious hierarchies."
  },
  "statModifiers": {
    "charisma": 2,
    "intelligence": 1,
    "constitution": -1
  }
},

  quietTraded: {
  "id": "quietTraded",
  "restrictions": {
    "allowedRegions": [
      "frostwood-reach",
      "bryngloom-forest"
    ],
    "allowedSubraces": [
      "tethered_mimir"
    ],
    "narrativeUnlock": true,
    "justification": "The Broken Mimir severed their celestial tethers and made sensory Trades with the Quiet to survive in the damp slums."
  },
  "classHooks": [
    {
      "classId": "apex",
      "bridge": "Giving up ordinary sight or hearing opens the deeper sensory Trade of the Silent Hunt."
    },
    {
      "classId": "toxicologist",
      "bridge": "Brewing numbing agents to dull the phantom pain of severed tethers leads directly into poison-craft."
    },
    {
      "classId": "inquisitor",
      "bridge": "Knowing the taste of broken covenants makes one relentless in hunting violators."
    }
  ],
  "tensionPairings": [
    {
      "classId": "minstrel",
      "tension": "A broken soul whose ears were traded to the Quiet cannot harmonize with the Tide-Choir."
    }
  ],
  "subraceFlavor": {
    "tethered_mimir": "You severed the high tether with a rusted knife, and the Quiet took your hearing in exchange for survival."
  },
  "name": "Quiet-Traded Scavenger",
  "description": "When the tether linking your line to the high aeries snapped, the fall was sudden and brutal. Left to rot in the squalor of Riverreach and the waterlogged alleys of the lower settlements, you did what Broken Mimir must do to survive: you made a Trade with the Quiet. Perhaps you traded your hearing for tremorsense through your fingertips, or sacrificed your sense of taste for the ability to scent danger in the fog. You scavenged relics fallen from the sky, pawned aerie heirlooms to buy bread, and learned that silence is not empty—it is full of predators waiting for you to make a sound.",
  "skillProficiencies": [
    "Stealth",
    "Perception"
  ],
  "languages": 1,
  "equipment": [
    "Severed silver tether-clasp (tarnished)",
    "Set of delicate lock-picks",
    "Wax-treated earplugs or eye-wrap",
    "Scavenger's pry-dagger",
    "Patchwork coat"
  ],
  "startingCurrency": {
    "gold": 6,
    "silver": 14,
    "copper": 0
  },
  "feature": {
    "name": "Echo of the Quiet",
    "description": "When you stand motionless in total darkness or heavy fog, your remaining senses expand dramatically. You cannot be surprised by hidden or invisible creatures within 30 feet, and you can sense air currents and ground tremors caused by approaching foes."
  },
  "statModifiers": {
    "agility": 2,
    "spirit": 1,
    "charisma": -1
  }
},

  trenchListener: {
  "id": "trenchListener",
  "restrictions": {
    "allowedRegions": [
      "iceheart-sea"
    ],
    "allowedSubraces": [
      "deepling_myrathil"
    ],
    "narrativeUnlock": true,
    "justification": "The Nereid Myrathil dwell in the lightless Treakous Rift, humming to the Sundered Monolith in the basalt deep."
  },
  "classHooks": [
    {
      "classId": "augur",
      "bridge": "Listening to low-frequency pressure reverberations reveals oceanic seismic events days before they strike."
    },
    {
      "classId": "animist",
      "bridge": "The drowned souls of ancient sunken vessels linger in the deep trenches where no sun reaches."
    },
    {
      "classId": "apex",
      "bridge": "Trench apex predators hunt by bioluminescent lures and current-shifts in pitch-black chasms."
    }
  ],
  "tensionPairings": [
    {
      "classId": "minstrel",
      "tension": "Surface singing requires rapid breath and open air; the deep hum drowns in surface commotion."
    }
  ],
  "subraceFlavor": {
    "deepling_myrathil": "You hummed into the lightless basalt trench for forty cycles, and the sleeping Monolith hummed back."
  },
  "name": "Abyssal Trench-Listener",
  "description": "Miles beneath the ice-locked surface of the Iceheart Sea, down in the crushing dark of the Treakous Oceanic Rift, the Nereid Myrathil live in a world of pure vibration. Apprenticed to the Ulvir acoustic chambers, you learned the sacred practice of humming into the sunless chasm and interpreting the echoes that return. You tracked the deep hydrothermal currents, tended luminous squid herds, and felt the slow, terrifying thrum of the Sundered Monolith resting in the abyss. To you, the surface world is a blinding, deafening cacophony of pointless noise.",
  "skillProficiencies": [
    "Perception",
    "Arcana"
  ],
  "languages": 1,
  "equipment": [
    "Whalebone acoustic tuning-fork",
    "Sealed nautilus-shell light-lure phial",
    "Pressure-cured kelp mantle",
    "Deep-sea bone stylus",
    "Traveler's wraps"
  ],
  "startingCurrency": {
    "gold": 9,
    "silver": 10,
    "copper": 0
  },
  "feature": {
    "name": "Pressure Reverberation",
    "description": "You can sense low-frequency acoustic vibrations and seismic movements through water or solid stone up to 120 feet away. You are immune to being deafened by acoustic shocks and can communicate with underwater creatures via subsonic vocalizations."
  },
  "statModifiers": {
    "spirit": 2,
    "constitution": 1,
    "charisma": -1
  }
},

  saltHingeEnvoy: {
  "id": "saltHingeEnvoy",
  "restrictions": {
    "allowedRegions": [
      "iceheart-sea",
      "sundale"
    ],
    "allowedSubraces": [
      "shoreling_myrathil"
    ],
    "narrativeUnlock": true,
    "justification": "The Corali Myrathil command the limestone harbor of Salt-Hinge, mediating accords between land empires and sea clans."
  },
  "classHooks": [
    {
      "classId": "minstrel",
      "bridge": "Reading the room during tense maritime negotiations is identical to conducting a chorus."
    },
    {
      "classId": "augur",
      "bridge": "Watching what the morning tide washes up reveals which ships sank and which are overdue."
    }
  ],
  "tensionPairings": [
    {
      "classId": "revenant",
      "tension": "An envoy committed to civil peace cannot easily harbor the silent fury of the tide-kept dead."
    }
  ],
  "subraceFlavor": {
    "shoreling_myrathil": "You stood on the limestone boom-cranes of Salt-Hinge, balancing human port taxes against the freedom of the open sea."
  },
  "name": "Salt-Hinge Harbor Envoy",
  "description": "Carved into the sheer white limestone cliffs where the Silver River meets the Iceheart Sea, Salt-Hinge Fortress is the undisputed crossway of sea and soil. You served on the harbor quay and in the Spindrift Tide-Council, negotiating shipping tolls, docking charters, and fishing rights between stubborn Sundale galleon captains and free-floating Myrathil raft-villages. You know every port authority ordinance, how to bribe a customs clerk with genuine sea-glass, and how to spot a smuggling hull before it clears the outer breakwater.",
  "skillProficiencies": [
    "Persuasion",
    "Insight"
  ],
  "languages": 2,
  "equipment": [
    "Bronze maritime treaty seal",
    "Waterproofed harbor ledger and ink",
    "Conch shell signaling horn",
    "Tailored wave-silk vestment",
    "Practical storm-cape"
  ],
  "startingCurrency": {
    "gold": 17,
    "silver": 5,
    "copper": 0
  },
  "feature": {
    "name": "Maritime Accords",
    "description": "Your diplomatic credentials grant you and your companions free docking rights, safe lodging in harbor garrisons, and access to port masters along any civilized coast. You gain advantage on checks to spot forged shipping manifests and maritime fraud."
  },
  "statModifiers": {
    "charisma": 2,
    "agility": 1,
    "constitution": -1
  }
},

  cataractScout: {
  "id": "cataractScout",
  "restrictions": {
    "allowedRegions": [
      "frostwood-reach",
      "bryngloom-forest"
    ],
    "allowedSubraces": [
      "riverling_myrathil"
    ],
    "narrativeUnlock": true,
    "justification": "The Ondine Myrathil follow freshwater river arteries hundreds of miles inland, mapping rapids and peat sluices."
  },
  "classHooks": [
    {
      "classId": "animist",
      "bridge": "Listening to the river spirits at confluences uncovers centuries of inland history."
    },
    {
      "classId": "augur",
      "bridge": "Reading foam-swirls and sediment drift is the river-born haruspex method of divination."
    },
    {
      "classId": "minstrel",
      "bridge": "The freshwater river-cadence carries news upstream faster than mounted riders."
    }
  ],
  "tensionPairings": [
    {
      "classId": "revenant",
      "tension": "Freshwater currents wash clean; carrying the salty necrosis of a Revenant anchor is an agonizing burden."
    }
  ],
  "subraceFlavor": {
    "riverling_myrathil": "You paddled your birch-skin canoe up Cataract Reach where no salt-water child had ever dared swim."
  },
  "name": "Cataract River-Scout",
  "description": "While your coastal cousins remained near the familiar ocean swell, you turned your prow inland, paddling up churning rapids, cataract waterfalls, and marshy river deltas into the deep heart of the continent. You mapped uncharted river forks, negotiated with solitary river-folk and Groven moss-gatherers, and discovered the hidden sluiceways that bypass inland garrisons. You are just as comfortable navigating a birch-skin canoe through whitewater rapids as you are diving into a sunken peat bog to recover a drowned cargo crate.",
  "skillProficiencies": [
    "Survival",
    "Athletics"
  ],
  "languages": 1,
  "equipment": [
    "Hardened birchwood paddle",
    "Waxed canvas waterproof river map",
    "Braided sinew river-rope (50 ft)",
    "River-smoothed bone fillet knife",
    "Durable travel tunic"
  ],
  "startingCurrency": {
    "gold": 10,
    "silver": 10,
    "copper": 0
  },
  "feature": {
    "name": "Current Rider",
    "description": "Navigating against rapid currents, river surges, or deep marsh water costs you no extra movement penalty. In addition, you and your party can travel along freshwater rivers at twice normal overland speed when using watercraft."
  },
  "statModifiers": {
    "agility": 2,
    "constitution": 1,
    "intelligence": -1
  }
},

  vaultTender: {
  "id": "vaultTender",
  "restrictions": {
    "allowedRegions": [
      "sundale"
    ],
    "allowedSubraces": [
      "korr_solari"
    ],
    "narrativeUnlock": true,
    "justification": "The Korr dwelled in the echoing obsidian vaults under Emberspire, guarding the cold crust of the buried sun."
  },
  "classHooks": [
    {
      "classId": "martyr",
      "bridge": "Living in lightless subterranean isolation turns suffering into sacred devotion to Sol's Breath."
    },
    {
      "classId": "spellguard",
      "bridge": "The volcanic containment vaults are the birthplace of high-temperature thermal warding."
    },
    {
      "classId": "pyrofiend",
      "bridge": "Close proximity to Emberspire deepest volcanic conduits makes demonic starfire whispers inevitable."
    }
  ],
  "tensionPairings": [
    {
      "classId": "augur",
      "tension": "Reading the cooling crust may reveal that the sun will never rise again—a truth the vaults forbid."
    }
  ],
  "subraceFlavor": {
    "korr_solari": "You kept vigil in the deep obsidian shafts where the rock is still hot to the touch and the dark never ends."
  },
  "name": "Obsidian Vault-Tender",
  "description": "When the sun fell beneath the earth, the Korr retreated into the deepest obsidian catacombs beneath Emberspire. As a Vault-Tender, you walked the dark basalt corridors that encircle the sleeping core, monitoring the temperature-gradient of the volcanic crust and tending the copper conduits that siphon lingering heat to the settlements above. In the absolute dark of the vaults, your eyes learned to see heat instead of color, and your mind learned the quiet fortitude of a people who have accepted that light is something you remember, not something you see.",
  "skillProficiencies": [
    "Stealth",
    "Religion"
  ],
  "languages": 1,
  "equipment": [
    "Obsidian thermal-chisel",
    "Basalt prayer medallion of Sol's Breath",
    "Sulfur-treated hemp wrap",
    "Heavy vault key on iron ring",
    "Dull grey ash-tunic"
  ],
  "startingCurrency": {
    "gold": 12,
    "silver": 6,
    "copper": 0
  },
  "feature": {
    "name": "Vault Thermal Sight",
    "description": "In subterranean darkness, you can perceive heat signatures, warm volcanic veins, and warm-blooded creatures up to 60 feet away with complete clarity. You are immune to being blinded by bright flashes of flame or radiant light."
  },
  "statModifiers": {
    "constitution": 2,
    "spirit": 1,
    "charisma": -1
  }
},

  ashDuneSkimmer: {
  "id": "ashDuneSkimmer",
  "restrictions": {
    "allowedRegions": [
      "sundale"
    ],
    "allowedSubraces": [
      "thrask_solari"
    ],
    "narrativeUnlock": true,
    "justification": "The Anhur endure the brutal surface cinder-flats and toxic dust storms of the Ashen Escarpment."
  },
  "classHooks": [
    {
      "classId": "crusader",
      "bridge": "Scouring the ash-wastes with blade and shield brings sacred martial purpose to survival."
    },
    {
      "classId": "pyrofiend",
      "bridge": "Breathing cinder-dust and surviving volcanic eruptions makes one kinship with the Ashen Cabal."
    },
    {
      "classId": "martyr",
      "bridge": "Bearing the blistering winds without complaint is the daily liturgy of the Anhur."
    }
  ],
  "tensionPairings": [
    {
      "classId": "spellguard",
      "tension": "A rugged scavenger who improvises scrap defenses clashes with rigid guild spellguard doctrine."
    }
  ],
  "subraceFlavor": {
    "thrask_solari": "You strapped obsidian goggles across your brow and outran the pyroclastic storm across the salt-cinder wastes."
  },
  "name": "Ash-Dune Skimmer",
  "description": "Above ground in Sundale, where the volcanic soil is barren and blistering ash-squalls tear skin from flesh, the Anhur thrive. Bound in cured cinder-hide and wearing goggles carved from smoked volcanic glass, you skimmed the shifting grey sand-dunes on sled-skis, scouting merchant caravan tracks and scavenging the abandoned wagons of those who choked on sulfur vents. You know how to dig an emergency trench into cooling volcanic sand, how to filter potable moisture from toxic alkali pans, and how to read the wind when the mountain threatens to cough.",
  "skillProficiencies": [
    "Survival",
    "Perception"
  ],
  "languages": 1,
  "equipment": [
    "Smoked-glass obsidian sand-goggles",
    "Ash-dune skimmer snowshoe-skis",
    "Treated sulfur-cloth dust scarf",
    "Bone salvage hook",
    "Rugged scavenger wraps"
  ],
  "startingCurrency": {
    "gold": 9,
    "silver": 12,
    "copper": 0
  },
  "feature": {
    "name": "Ash-Lung Resilience",
    "description": "You cannot suffocate or suffer coughing fits from non-magical volcanic ash, heavy dust, or sulfur fumes. You have advantage on Constitution saving throws against heat exhaustion and environmental desert hazards."
  },
  "statModifiers": {
    "constitution": 2,
    "agility": 1,
    "intelligence": -1
  }
},

  sanctuarySeneschal: {
  "id": "sanctuarySeneschal",
  "restrictions": {
    "allowedRegions": [
      "bryngloom-forest"
    ],
    "allowedSubraces": [
      "clean_vreken"
    ],
    "narrativeUnlock": true,
    "justification": "The Bedel dwell in porcelain-white quarantine vaults, maintaining unblemished bloodlines and sacred sanitary rites."
  },
  "classHooks": [
    {
      "classId": "animist",
      "bridge": "Communing with the uncorrupted ancestors who died before the blight entered the forest."
    },
    {
      "classId": "revenant",
      "bridge": "Preserving souls in pristine silver containers without allowing fungal rot to take hold."
    }
  ],
  "tensionPairings": [
    {
      "classId": "plaguebringer",
      "tension": "A conservator dedicated to absolute purity who becomes a vector of plague is an unforgivable traitor."
    }
  ],
  "subraceFlavor": {
    "clean_vreken": "You washed the marble threshold in camphor-water every sunrise, ensuring no blighted spore crossed into the sanctuary."
  },
  "name": "Sanctuary Conservator",
  "description": "Deep within the Bryngloom Forest, where fungal rot and necrotic spores creep through the moss, the Bedel maintain the hermetically sealed Sanctuaries. As a Sanctuary Conservator, you guarded the triple airlocks, oversaw the ritual fumigations of incoming travelers, and inspected every batch of food and water for the faintest speck of mold. You know the exact recipes of cleansing lyes, the proper cadence of isolation rites, and the agonizing decisions that must be made when a beloved relative shows the first dark spot on their skin.",
  "skillProficiencies": [
    "Medicine",
    "Insight"
  ],
  "languages": 1,
  "equipment": [
    "Silver incense-censer with camphor resin",
    "Porcelain apothecary mortar and pestle",
    "Linen quarantine veil and gloves",
    "Sterilized bone scalpel",
    "Pristine white linen attire"
  ],
  "startingCurrency": {
    "gold": 15,
    "silver": 2,
    "copper": 0
  },
  "feature": {
    "name": "Quarantine Vigil",
    "description": "With a brief medical inspection (1 minute), you can determine whether a creature or food item is infected with non-magical disease, necrotic corruption, or biological poison. You gain advantage on saving throws against contagious sickness, airborne pathogens, and rot."
  },
  "statModifiers": {
    "intelligence": 2,
    "spirit": 1,
    "strength": -1
  }
},

  nullSaltHunter: {
  "id": "nullSaltHunter",
  "restrictions": {
    "allowedRegions": [
      "bryngloom-forest"
    ],
    "allowedSubraces": [
      "marked_vreken"
    ],
    "narrativeUnlock": true,
    "justification": "The Cromyx are outcasts bearing blight-scars who hunt rogue abominations and twisted kin with cold-iron and null-salt."
  },
  "classHooks": [
    {
      "classId": "inquisitor",
      "bridge": "Binding null-salt and cold-iron into hunting chains is the foundational rite of the Barbed Vow."
    },
    {
      "classId": "apex",
      "bridge": "Stalking feral kin through the mire sharpens predatory stealth and sensory tracking."
    },
    {
      "classId": "plaguebringer",
      "bridge": "Embracing the blight-stain turns personal affliction into an offensive bioweapon."
    }
  ],
  "tensionPairings": [
    {
      "classId": "augur",
      "tension": "Looking into the future of a doomed, blighted lineage is a despair most hunters refuse to bear."
    }
  ],
  "subraceFlavor": {
    "marked_vreken": "They cast you out when the black rot took your skin; you returned with null-salt chains to drag their nightmares away."
  },
  "name": "Null-Salt Hunter",
  "description": "When the dark marks surfaced on your flesh, the Bedel Houses closed their airlocks and barred you forever. Cast into the boggy frontier, you did not lie down to rot. You packed your festering lesions with caustic null-salt, bound cold-iron barbs around your knuckles, and forged a trade hunting down rogue ghouls, mutated horrors, and corrupted kin who breached the settlements. You are dirty, feared, and indispensable—the hound the high houses pay in coin to kill the monsters they pretend do not exist.",
  "skillProficiencies": [
    "Intimidation",
    "Survival"
  ],
  "languages": 1,
  "equipment": [
    "Pouch of null-salt crystals (5 uses)",
    "Cold-iron barbed wire wrap (20 ft)",
    "Notched hunting cleaver",
    "Stained leather duster with reinforced collar",
    "Common clothes"
  ],
  "startingCurrency": {
    "gold": 8,
    "silver": 15,
    "copper": 0
  },
  "feature": {
    "name": "Blight-Scarred Tenacity",
    "description": "When reduced below one-third of your maximum hit points, the deadened nerve-endings in your blight-scars surge with adrenaline, granting +2 to Armor Class and making you immune to pain-based stun and movement reduction effects until healed."
  },
  "statModifiers": {
    "constitution": 2,
    "strength": 1,
    "charisma": -1
  }
},

  steppeSinger: {
  "id": "steppeSinger",
  "restrictions": {
    "allowedRegions": [
      "northern-steppes",
      "frostwood-reach"
    ],
    "allowedSubraces": [
      "ordan_human"
    ],
    "narrativeUnlock": true,
    "justification": "The Ordu humans are steppe nomads who sing ten generations of ancestors into the wind to guide their great beast herds."
  },
  "classHooks": [
    {
      "classId": "animist",
      "bridge": "Throat-singing on the open plains connects directly with the roaming spirits of ancient herds."
    },
    {
      "classId": "apex",
      "bridge": "Riding wild steppe-coursers and bonding with hunting hawks is the heart of Ordu survival."
    }
  ],
  "tensionPairings": [
    {
      "classId": "falseProphet",
      "tension": "Trading ancient lineage memory for an alien cosmic frequency shatters the ancestor circle."
    }
  ],
  "subraceFlavor": {
    "ordan_human": "You sang the migration stanzas into the freezing gale, and three thousand horn-beasts turned as one."
  },
  "name": "Steppe Wind-Singer",
  "description": "On the endless wind-scoured grasslands of the northern plateaus, the Ordu clans do not measure borders in stone or ink. You rode with the nomad wagon-circles, learning the sacred throat-singing styles that carry for miles across the plains. Your songs record the names of horses, the locations of frozen water-wells, and the genealogy of ancestor spirits who ride beside the living in the storm. You know how to soothe an enraged pack-beast with a low chest-drone, read weather in the grass-sway, and find your way across hundreds of leagues of featureless steppe.",
  "skillProficiencies": [
    "Animal Handling",
    "Survival"
  ],
  "languages": 2,
  "equipment": [
    "Horsehair two-stringed steppe lute",
    "Braided leather lariat (40 ft)",
    "Horn-handled bone skinning knife",
    "Felt-lined steppe riding cloak",
    "Nomad travel clothes"
  ],
  "startingCurrency": {
    "gold": 10,
    "silver": 8,
    "copper": 0
  },
  "feature": {
    "name": "Wind-Pace & Herd-Song",
    "description": "You can calm domesticated and wild beasts with your throat-songs, gaining advantage on Animal Handling checks. In addition, mounted or foot overland travel pace for you and your travelling companions is increased by 20% across plains, steppes, and tundra."
  },
  "statModifiers": {
    "spirit": 2,
    "constitution": 1,
    "intelligence": -1
  }
},

  glacierHarpooner: {
  "id": "glacierHarpooner",
  "restrictions": {
    "allowedRegions": [
      "nordhalla"
    ],
    "allowedSubraces": [
      "skald_human"
    ],
    "narrativeUnlock": true,
    "justification": "The Skald of Nordhalla brave creaking glacier crevasses to harpoon leviathans and rime-beasts to feed their clans."
  },
  "classHooks": [
    {
      "classId": "berserker",
      "bridge": "The adrenaline fury required to tackle a charging rime-mammoth is the cradle of the Bloodhammer line."
    },
    {
      "classId": "warden",
      "bridge": "Lashing bone plates and heavy ice-crampons into protective suits builds unbreakable frames."
    },
    {
      "classId": "harbinger",
      "bridge": "Surviving frozen glacier crevasses exposes hunters to deep entropic void-frost."
    }
  ],
  "tensionPairings": [
    {
      "classId": "augur",
      "tension": "Reading doom in the ice cracks creates hesitation in a hunter whose life depends on instantaneous reflexes."
    }
  ],
  "subraceFlavor": {
    "skald_human": "You sank a bone harpoon into the flank of a rime-mammoth while hanging over a bottomless glacier abyss."
  },
  "name": "Glacier Harpooner",
  "description": "High in the jagged peaks and blue-ice glaciers of Nordhalla, the Skald do not farm; they hunt. As a Glacier Harpooner, you traversed sheer ice-crevasses on bone crampons, tracking massive woolly leviathans and frost-trolls across the perpetual white. Armed with heavy barbed harpoons and braided seal-sinew ropes, you were the one who threw the line and braced against the anchor-stake, risking being dragged into the abyss so your clan would eat through the long, freezing night. You know the groan of ice before an avalanche breaks, and the cold cannot slow your heartbeat.",
  "skillProficiencies": [
    "Athletics",
    "Survival"
  ],
  "languages": 1,
  "equipment": [
    "Forged iron glacier harpoon with line-swivel",
    "Spiked bone ice-crampons and climbing pitons",
    "Braided sinew hauling rope (50 ft)",
    "Mammoth-hide snow-goggles",
    "Heavy fur-lined winter coat"
  ],
  "startingCurrency": {
    "gold": 11,
    "silver": 4,
    "copper": 0
  },
  "feature": {
    "name": "Ice-Footed Stride",
    "description": "You ignore difficult terrain caused by ice, snow, slick rocks, or frozen slopes, moving across them at full speed without slipping. Furthermore, extreme sub-zero cold conditions impose no exhaustion or penalties on your physical checks."
  },
  "statModifiers": {
    "strength": 2,
    "constitution": 1,
    "charisma": -1
  }
},

  canopyWeaver: {
  "id": "canopyWeaver",
  "restrictions": {
    "allowedRegions": [
      "frostwood-reach",
      "bryngloom-forest"
    ],
    "allowedSubraces": [
      "viridian_florae"
    ],
    "narrativeUnlock": true,
    "justification": "The Briaren Florae live in soaring green canopies, weaving living botanical vines and harvesting delicate floral scents for arboreal courts."
  },
  "classHooks": [
    {
      "classId": "toxicologist",
      "bridge": "Distilling subtle flower neuro-toxins and calming botanical scents is master chemistry."
    },
    {
      "classId": "lunarch",
      "bridge": "Canopy blooms that only open under Selunis's light carry pristine lunar resonance."
    },
    {
      "classId": "animist",
      "bridge": "The high branches remember the sun better than the damp forest floor."
    }
  ],
  "tensionPairings": [
    {
      "classId": "apex",
      "tension": "Courtly botanical aesthetics reject the predatory gore and violent instincts of the ground hunt."
    }
  ],
  "subraceFlavor": {
    "viridian_florae": "You wove the flowering canopy bridges of the upper court, shaping living orchids that bloom at night."
  },
  "name": "Canopy Bloom-Weaver",
  "description": "Hundreds of feet above the dark, predatory forest floor, the Briaren Florae create soaring arboreal palaces of living green. As a Canopy Bloom-Weaver, you were trained to shape living lianas, graft flowering orchids into luminous suspension bridges, and distill exquisite botanical perfumes for the high canopy courts. You understand the chemical language of plants—how a breath of lavender can still anger, how night-blooming jasmine can mask a betrayal, and how living vines can be guided to form furniture, ladders, or living defenses that respond to touch.",
  "skillProficiencies": [
    "Nature",
    "Persuasion"
  ],
  "languages": 1,
  "equipment": [
    "Pruning shears of polished bronze",
    "Silk pouch of rare botanical flower seeds",
    "Phials of distilled floral essences (3)",
    "Living vine-belt that flexes on command",
    "Fine courtly canopy garb"
  ],
  "startingCurrency": {
    "gold": 15,
    "silver": 8,
    "copper": 0
  },
  "feature": {
    "name": "Pheromone Distillation",
    "description": "You can exhale or release subtle, fragrant botanical pheromones to ease tension in social encounters, gaining advantage on Persuasion checks against non-hostile humanoids and beasts. In addition, you can harvest fresh herbal and floral components during any short rest in wild vegetation."
  },
  "statModifiers": {
    "charisma": 2,
    "agility": 1,
    "strength": -1
  }
},

  briarSentinel: {
  "id": "briarSentinel",
  "restrictions": {
    "allowedRegions": [
      "frostwood-reach",
      "bryngloom-forest"
    ],
    "allowedSubraces": [
      "florae_unified"
    ],
    "narrativeUnlock": true,
    "justification": "The Oaken Florae are dense, thorny, tough briar-wood folk who guard the deep taproots that bore through solid rock."
  },
  "classHooks": [
    {
      "classId": "toxicologist",
      "bridge": "Extracting bitter protective alkaloid resins from briar bark teaches natural toxin defense."
    },
    {
      "classId": "animist",
      "bridge": "Taproots that dig forty yards into the earth touch the deep bedrock spirits."
    },
    {
      "classId": "apex",
      "bridge": "Stalking through impenetrable thorn thickets where soft-skinned beasts cannot follow."
    }
  ],
  "tensionPairings": [
    {
      "classId": "lunarch",
      "tension": "Grounded taproots rooted in solid rock reject the ethereal, drifting pull of lunar communion."
    }
  ],
  "subraceFlavor": {
    "florae_unified": "Your bark grew thick with iron thorns; you stood in the briar-line when the logging axes came."
  },
  "name": "Briar-Root Sentinel",
  "description": "While the delicate Briaren kin play with courtly flowers in the high canopy, the Oaken Florae stand upon the rocky ground where survival is contested with stone and thorn. As a Briar-Root Sentinel, your bark grew thick and ridged with needle-sharp briar spines, your roots digging into solid granite to anchor your grove against storms and logging crews. You patrolled the tangled briar-hedges, harvested bitter protective resins from deep taproots, and learned to use your barbed limbs to snare and tear apart anything foolish enough to trespass.",
  "skillProficiencies": [
    "Nature",
    "Survival"
  ],
  "languages": 1,
  "equipment": [
    "Briar-wood barbed quarterstaff",
    "Jar of bitter root-tap resin",
    "Hardened thorn-tipped skinning awl",
    "Toughened bark-weave cloak",
    "Common traveler wraps"
  ],
  "startingCurrency": {
    "gold": 10,
    "silver": 5,
    "copper": 0
  },
  "feature": {
    "name": "Thorn-Barbed Bark",
    "description": "Your tough, thorn-barbed bark punishes close-quarters combatants. Any creature that grapples you or hits you with an unarmed strike or natural weapon takes 1d4 piercing damage. You also have advantage on saving throws against plant-based toxins, poisons, and thorny environmental hazards."
  },
  "statModifiers": {
    "constitution": 2,
    "strength": 1,
    "charisma": -1
  }
},

};

export const BACKGROUND_FLAVOR_TEXT = {
  emberspirePilgrim: 'You climbed the Ashen Escarpment and saw Sol\'s Breath burning behind obsidian. The Dawn Vigil branded your throat and sent you down with a phial of captured light. Now you carry a faith that might be heresy.',
  shyrRunner: 'Ninety miles of volcanic road, and the Sulfur Cartel taxes every step. You ran the basalt pillars and magma-fractures, learning which ground kills the careless. The Cartel has your name in their ledgers, and the debt compounds.',
  ledgerKeeper: 'In the Frostwood Reach, the fog eats memory. You kept the identity-ledgers at Greymark Keep, deciding who is real and who is forgotten. The ink dries fast, and the fog never sleeps.',
  bloodlineHeir: 'Seven noble houses remain. The eighth was erased for refusing to feed its heir to Keth Amar. You carry a name that opens doors and paints targets. The debt your ancestors bought is still compounding.',
  synodAcademic: 'The Synod Hold sings when the wind finds the right key. You learned the forbidden Echo-Songs and the echo-lineages carved on bone Steppe-Staves. The stars are going out, and you have the training to read the patterns.',
  sumpsVeteran: 'The Bloodhammer Sump breeds soldiers the way a wound breeds salt. You carry the Hunger Pact in your blood: ancestral starvation turned to fury. The glaciers are advancing again, and the dead want you to survive.',
  debtNegotiator: 'In Atropolis, everything has a price and every price is negotiable. You read Athien contracts by their silver-leaf binding and spot the trap-clauses that bind the unwary. The greatest lawyer of your generation burned her own name from the Contract.',
  frostChanter: "Jarn-Tand's Academies burn every old drum they find, so the old ways moved into the voice. You weave animist history into drinking-songs that inquisitors never suspect are heresies older than the Freeze. Your voice is a covert hearth.",
  forgeWright: 'Metal remembers. Every hammer-strike is a record that outlasts the hand that made it. You understand metal as living memory, reading forge-marks the way a scribe reads ink. The forges are failing, and fewer smiths survive to teach.',
  hushSurvivor: "You watched the hush take someone you loved. First the darkened veins, then the dissolved mind, then the Hush-Bogs. You fortified your mind against the mycelium's song, but it never fully fades. You know the early signs.",
  peakTracker: 'The Cragjaw Peaks are a vertical labyrinth where the blizzard rewrites every path. You navigate with knotted cord route-markers, reading the stress-fractures in bone-bridges the Groven dead left behind. The peaks are getting colder.',
  merrowSailor: 'The Iceheart Sea does not forgive debts. You sailed under the Sea-Charter, your arms inked with trade-tattoos that double as legal contracts. The sea is freezing earlier every year, and the routes are shrinking with the ice.',
  gloomwayTrader: 'The Bryngloom trades in three currencies: memory-glass, peat-oil, and years left in a lifespan. You run goods across root-tangled expanse, dealing in wyrd-warded curios. The Registry tightens its tariffs every season.',
  shantyRat: 'The Over-Shanty hangs beneath Atropolis like a wound the canopy city refuses to acknowledge. You grew up in rope-bridges and salvage-nests, one of the Forgotten: legally nonexistent. The rope-bridges fray a little more every season.',
  monolithHunter: 'The seven Sundered Monoliths are waking. All seven at once, their resonance rising. You track that resonance with cold iron stakes and a journal certain powers would kill to possess. Whatever changed, it changed recently.',
  groveWarden: 'There were seven houses, and yours was the seventh — struck from every history the others were allowed to write. You swore the old fae bargain in moonlit groves, binding yourself to the Hollow-Court. You tend the Thorn-Fall where shed thorns beyond counting record every unfulfilled promise.',
  maskWarden: "The Mimir's masks are relics, and the Hunters pay fortunes for them. You stand between the mask-wearers and the cartels that hunt them, patrolling fog-spider-silk rope-bridges. Every mask that falls feeds a collection that grows bolder.",
  vaultScholar: 'Deep in the Fex warrens, the guild-vaults keep their knowledge on copper-plate codices: precision gear-craft, temporal mechanics. You learned the grammar of gears, and it marked you for life. What you memorized, no blast-door can lock away.',
  herdGuardian: 'The Ordu steppe stretches endlessly, and the herds are everything. You guard the ember-hooved cattle across frozen grass, reading the wind for threats. The nomads trust your eyes more than any wall.',
  starboundScholar: 'Every Astril carries Lumia\'s echo in their blood, and the Synod governs that relationship with a dead world\'s memory. You trained under its hierarchy, learning the crystal-lattice techniques that keep the echo from overwhelming the host.',
  deepCurrentGuide: 'Beneath the Iceheart Sea, the water is still warm. You navigated the pressure-zones where light dies and the only maps are temperature-gradients felt through the skin. The abyss is patient, and it is learning the routes you know.',
  fogReader: 'The fog in the Frostwood Reach is not weather. It is a living geography that responds to thought. You read its density shifts and memory-erasure currents, tracing residue-trails by touch and scent. The fog is thickening, and it never stops.',
  chasmDelver: 'Beneath the Cragjaw Peaks, the geothermal vents pulse in forgotten rhythms. You descended into the steam-tunnels where the only light is volcanic blood-red, maintaining pipes and reading pressure in the deep dark. The vents are pulsing faster now.',
  brineTrader: 'The Iceheart Sea does not forgive debts, and you learned that at the counter, not the mast. You know every tariff loophole and bribe price from Brinehorse Cove to Merrowport, keeping the coastal trade alive as the ice closes in.'
,
  keepWarden: 'You grew up inside a sealed keep, counting watch-bells and drilling for an extinction that never comes. The stone is failing in places the engineers will not admit.',
  spanBuilder: 'The Ancestor-Spans are grown from Groven bone, and you keep them standing. You read a bridge the way a physician reads a body. The old spans are failing faster than the crews can mend.',
  contractClerk: 'You filed clauses in the Heart-Vault and learned that a promise is a thing with teeth. The Ledger is fracturing, and the clauses you filed are being rejected by Morvane itself.',
  obligationBroker: 'You read the web of obligations the way a sailor reads wind. You have sold things that were not yours and made them true by writing them down. Something is cutting threads.',
  greymarkArchivist: 'You kept the lineage-tapestries at Greymark, reciting names the fog had already taken. Every name you speak is a small refusal of the mist.',
  privateer: 'You sailed under a Merryn letter-of-marque, licensed to take what the Board could not protect. The line between privateer and pirate is one water-stained clause.',
  nameless: 'You were struck from the First Contract, and the Registry reads as if you were never born. The law cannot see you, and neither can the hush.',
  cryptKeeper: 'You tend the Bryngloom crypts where the ancestral lights burn and gutter. You know which dead are resting and which are hunting.',

  zenithCartographer: "You charted the dead stars above the cloud-ceilings with brass armillary spheres. Even in the thickest fog, the heavens guide your step.",
  craterVanguard: "You walked into the smoking impact-craters where celestial iron shattered bedrock. Your bones absorbed the shock that breaks lesser folk.",
  clockworkHorologist: "You cut gear-teeth to micron tolerances and tuned escapements in the under-city workshops. Every mechanism speaks to your fingers.",
  vitriolProspector: "You panned boiling acid sumps for precipitated copper and precious heavy metals, wearing lead and skin that knows how to survive caustic burns.",
  peatTender: "You walked the black quagmires of the Bryngloom, tending the fungal cradles where memory and death decompose into living soil.",
  petrifiedMason: "Your sapwood crystallized into quartz and slate across centuries. You shape petrified timber with the patience of living bedrock.",
  scriptureHerald: "You sang ancestral genealogies from the white marble aeries of the Arch Mimir, commanding deference across the wind-scoured peaks.",
  quietTraded: "When your celestial tether snapped, you traded a sense to the Quiet to survive in the mire. Silence is your shield and your hunting ground.",
  trenchListener: "Miles deep in the Treakous Rift, you hummed into the lightless basalt abyss, listening to the heartbeat of the sleeping Sundered Monolith.",
  saltHingeEnvoy: "You stood on the limestone boom-cranes of Salt-Hinge, negotiating tariffs and treaties between suspicious captains and tide-clans.",
  cataractScout: "You paddled birch-skin canoes against boiling freshwater rapids, mapping river forks and hidden sluices far into the continental interior.",
  vaultTender: "In the lightless basalt catacombs under Emberspire, you monitored the cooling crust of the buried sun, seeing warmth where others see only dark.",
  ashDuneSkimmer: "You skimmed the grey volcanic ash-dunes on sled-skis through toxic sulfur storms, scavenging the caravans that choked on the caldera air.",
  sanctuarySeneschal: "Behind the triple-sealed airlocks of the Bedel Sanctuaries, you maintained the camphor-water wash and isolation rites that hold back the rot.",
  nullSaltHunter: "Exiled when the dark rot touched your flesh, you bound cold-iron and null-salt around your arms to hunt your fallen kin for bounty coin.",
  steppeSinger: "You rode with the northern wagon-circles, throat-singing the names of ten generations into the wind to steer great herds across the grasslands.",
  glacierHarpooner: "On the creaking blue-ice glaciers of Nordhalla, you threw barbed bone harpoons into leviathans while braced over bottomless crevasses.",
  canopyWeaver: "High in the Briaren boughs, you grafted flowering orchids into aerial bridges and distilled botanical scents for the arboreal courts.",
  briarSentinel: "Your bark grew thick with iron thorns in the stony soil. You stood in the briar-line, anchoring the grove against axes and beasts alike.",
};

export const BACKGROUND_ROLEPLAYING_HOOKS = {
  emberspirePilgrim: [
    'Sol\'s Breath branded your throat at the end of a pilgrimage. What did you see in the light that the Dawn Vigil told you to forget?',
    'Your faith borders on heresy. Which doctrine do you question, and whom have you told?',
    'The phial of captured light you carry is more than a relic. What would you do if someone tried to take it?'
  ],
  shyrRunner: [
    'The Sulfur Cartel knows your name and your debt. How close are they to collecting, and what would you do to escape?',
    'You learned the volcanic roads by running them. What cargo did you carry that still haunts you?',
    'The basalt pillars hold secrets for those who know where to look. What did you find in the magma-fractures?'
  ],
  ledgerKeeper: [
    'The Frostwood fog eats memory, but you kept the ledgers. Whose identity did you record, and whose did you erase?',
    'Greymark Keep trusts you with the truth. What secret are you hiding in the margins?',
    'The fog never sleeps, and neither did you. What did you see on night-watch that changed how you read the ledgers?'
  ],
  bloodlineHeir: [
    'Seven noble houses remain; the eighth was erased. Was your family responsible, or were they the victims?',
    'Your name opens doors and paints targets. Which door do you most want to walk through, and which assassin do you most fear?',
    'The debt your ancestors bought is still compounding. Do you intend to pay it, forgive it, or burn the ledger?'
  ],
  synodAcademic: [
    'The echoes are fading, and you can read the patterns. What did the last echo-signature you charted reveal?',
    'You learned forbidden Echo-Songs. Which song do you sing when no one is listening, and what happens when you do?',
    'The Synod Hold expelled you, or you left. Which version is true, and what did you take with you?'
  ],
  sumpsVeteran: [
    'The Hunger Pact lives in your blood. What was the worst deprivation you survived, and what did it cost the person next to you?',
    'The Bloodhammer Sump makes soldiers and breaks them. Which of your squad did you fail, and how do you carry that debt?',
    'The glaciers advance, and the dead want you to survive. What message do the dead carry for the living?'
  ],
  debtNegotiator: [
    'The greatest lawyer of your generation burned her name from the Contract. What was her name, and why did she do it?',
    'You read Athien contracts by their silver-leaf binding. Which clause did you miss that still binds you?',
    'Atropolis runs on debt. Who owes you, and what are you willing to do to collect?'
  ],
  frostChanter: [
    'Jarn-Tand burns old drums. Where did you hide the drum that carries your lineage?',
    'Your voice is a covert hearth. Which song would get you executed if the inquisitors heard it?',
    'You weave heresy into drinking-songs. Who has heard your true song, and did they recognize it?'
  ],
  forgeWright: [
    'Metal remembers, and you read forge-marks like scripture. What did you forge that you wish you could unmake?',
    'The forges are failing, and smiths are dying. Who taught you, and what technique died with them?',
    'Your hammer-strikes are records. What message did you leave in your last piece that only another forgeWright could read?'
  ],
  hushSurvivor: [
    'You watched the hush take someone you loved. What were their last words before the mycelium dissolved their mind?',
    'The Hush-Bogs showed you the signs. What symptom do you scan for in strangers, and what do you do when you see it?',
    'You fortified your mind, but the song never fully fades. What trigger still weakens your defenses?'
  ],
  peakTracker: [
    'The blizzard rewrites every path. Which route did you lose that you still dream about?',
    'The bone-bridges are not being replaced. What did you see at the far end of a span that made you cut the ropes behind you?',
    'A Rime-Bride stalked your trail for three days. Why did it stop following?'
  ],
  merrowSailor: [
    'Your arms are inked with trade-tattoos. Which line of ink represents a debt you cannot pay?',
    'The sea freezes earlier every year. What did you see on the last open-water run that you refuse to discuss?',
    'A Press-Warrant has your name. How long before the Syndicate finds you, and who will you sacrifice to stay free?'
  ],
  gloomwayTrader: [
    'The Bryngloom trades in years of lifespan. How many of your own years have you already sold?',
    'You dealt in wyrd-warded curios. Which item did you handle that still follows you in dreams?',
    'The Registry tightens tariffs every season. What contraband are you currently transporting, and who hired you?'
  ],
  shantyRat: [
    'The Over-Shanty hangs beneath Atropolis. Where is your nest, and what did you find in the salvage-nests that the canopy-city wants back?',
    'You are one of the Forgotten: legally nonexistent. What would you do if someone offered to make you real?',
    'The rope-bridges fray every season. Which bridge broke behind you, and who did you leave on the wrong side?'
  ],
  monolithHunter: [
    'The seven Sundered Monoliths are waking. Which monolith called to you first, and what did it show you?',
    'Your journal contains truths certain powers would kill to possess. What have you written on the last page?',
    'Cold iron stakes and resonance readings. What did you find that changed your understanding of what the monoliths are?'
  ],
  groveWarden: [
    'The Hollow-Court bound you with an old fae bargain. What did you swear, and what did it cost you to swear it?',
    'The Thorn-Fall records every unfulfilled promise. Whose thorn do you carry that you cannot remove?',
    'They say seven houses signed, but the seventh was erased and a substitute crowned in its place. Does the erased line still survive in some form, and are you its last keeper?'
  ],
  maskWarden: [
    'The Hunters pay fortunes for Mimir masks. Which mask did you save, and which did you let fall?',
    'You patrol fog-spider-silk rope-bridges. What did you see on patrol that the cartels would pay to learn?',
    'Every mask that falls feeds a collection. Whose mask did you wear once, and what did it show you?'
  ],
  vaultScholar: [
    'The Fex guild-vaults hold copper-plate codices. What codex did you memorize that no blast-door can lock away?',
    'You learned the grammar of gears. What mechanical secret did you discover that the guilds suppressed?',
    'Temporal mechanics are forbidden knowledge. What did you calculate that made the vault elders burn the evidence?'
  ],
  herdGuardian: [
    'The Ordu steppe is endless, and the herds are everything. Which ember-hooved bull did you lose in a blizzard that you still search for?',
    'The nomads trust your eyes. What threat did you spot on the horizon that no one else believed?',
    'You read the wind for danger. What came on a wind you misread, and who paid the price?'
  ],
  starboundScholar: [
    'Every Astril carries Lumia\'s echo. Whose resonance did you calibrate, and what happened when it burned too bright?',
    'The Synod governs life and memory. Which law of the Synod did you break in service of saving a host?',
    'You learned crystal-lattice techniques. What did you see in the lattice that the hierarchy told you to forget?'
  ],
  deepCurrentGuide: [
    'Beneath the Iceheart Sea, the water is still warm. What pressure-zone did you navigate that the surface charts deny exists?',
    'The abyss is patient and learning your routes. What creatures stir in the temperature-gradients you taught them?',
    'Light dies in the deep. What did you learn in the dark that reshaped your understanding of the world above?'
  ],
  fogReader: [
    'The fog in the Frostwood is a living geography. What thought does the fog respond to in you, and what does it reveal?',
    'Memory-erasure currents shift with the residue-trails. Whose memory did you recover from the fog, and why did it matter?',
    'The fog thickens every year. What map of density shifts do you carry that no ink could record?'
  ],
  chasmDelver: [
    'The geothermal vents pulse faster every season. What did you hear through the pipes that the Keep-Priests deny exists?',
    'The Rock-Speakers\' tunnels remain in the oldest cord-maps. Have you ever followed one of those maps, and what did you find?',
    'Pressure builds in the deep. What blowout did you predict that no one believed until the pipes screamed?'
  ],
  brineTrader: [
    'The Syndicate tightens its quotas. Which cargo manifest did you falsify, and where is the real cargo now?',
    'You know the exact price of a man\'s freedom. Whose freedom did you fail to buy, and whose did you sell?',
    'The routes are freezing. What deal did you strike that keeps your name off the Press-Warrant lists?'
  ]
,
  keepWarden: [
    'Which bell rang when it should not have, and what did you do?',
    'The keep\'s repairs are falling behind. What did you hide from the official engineers, and why?',
    'You are the one who stays when the gate seals. Who did you leave outside?'
  ],
  spanBuilder: [
    'Which span did you lose on your watch, and who was on it?',
    'You can read a bridge\'s last winter in its sag. What did you do when the crew would not believe you?',
    'The bone-work is your inheritance. What did you find inside a span sealed for centuries?'
  ],
  contractClerk: [
    'Which clause did you file that you now wish you could void?',
    'You have read the clauses the Ledger hides. What did the Years of Whispers leave in the margins?',
    'A person\'s whole life can be priced in bog-iron ink. Whose price did you set?'
  ],
  obligationBroker: [
    'You sold a stranger\'s future to pay a debt that was never yours. Do you remember their face?',
    'Which fate-thread do you still hold, and what happens when it comes due?',
    'You can feel the web coming up short. What knot is holding you?'
  ],
  greymarkArchivist: [
    'Which name did you keep reciting long after everyone else had forgotten it?',
    'The tapestries record what the fog has taken. What did you find written there that should not exist?',
    'You know the ancestry of everyone who petitions you. Whose lineage did you quietly erase?'
  ],
  privateer: [
    'Which prize did you take that you still cannot justify, and who did it ruin?',
    'Your letter-of-marque has a forged clause. Who knows about it?',
    'Your crew was paid in shares, not wages. Which crewmate did you short, and why?'
  ],
  nameless: [
    'What name do you wear now, and who did you borrow it from?',
    'You were struck from the Contract. Did you choose it, or was it done to you?',
    'Someone formally recognized you once. Who, and what did it cost you to make them forget?'
  ],
  cryptKeeper: [
    'Which light in your crypt went dark on your watch, and what did you tell the family?',
    'Something in the deep rows is waking. What did the oldest ledger say about it?',
    'You sealed a light that begged you not to. Do you think it was still itself?'
  ],

  zenithCartographer: [
  "Which missing star did you discover had vanished from the sky, and who did you tell?",
  "You carry an astronomical chart that maps a cosmic rift above Mythrill. What did you calculate is falling through it?",
  "The Lumian archives hold charts from before the Star-Fall. What was written in the margins of your master's astrolabe?"
],
  craterVanguard: [
  "What was pulled from the burning core of the crater you secured, and who stole it from you?",
  "You survived an impact blast that pulverized your unit. Why did the falling star spare you?",
  "The celestial slag in your weapon still hums with kinetic resonance. What happens when you swing it in anger?"
],
  clockworkHorologist: [
  "Which civic water-clock did you secretly modify, and whose schedule did it disrupt?",
  "You found an impossible mechanism sealed inside a clockwork automaton. What was powering it?",
  "The Brasskin Guild demanded you surrender your private schematics. What did you burn before fleeing?"
],
  vitriolProspector: [
  "Which vitriol runoff trench did you prospect that belonged to a criminal syndicate, and who took the fall?",
  "You carry an alchemical scar that never quite healed. Which chemical compound caused it?",
  "What rare precipitate did you pan from the toxic sump that you refuse to sell at any price?"
],
  peatTender: [
  "Whose body did you bury in the deep peat whose identity the authorities were desperate to erase?",
  "What did the oldest mycelial network whisper to you during a night vigil in the quagmire?",
  "A shelf-fungus bloom on your arm sprouted from an ancient grave. Whose memory does it carry?"
],
  petrifiedMason: [
  "Which monolithic span did you carve that has survived three glacial tremors without a crack?",
  "Inside a petrified oak felled for quarrying, you found a chamber. What was preserved within the stone wood?",
  "Your stone bark deflects blades, but where is your singular hairline fault, and who knows where to strike?"
],
  scriptureHerald: [
  "Which highborne decree did you refuse to proclaim from the wind-terraces, and what were the consequences?",
  "You know an embarrassing secret about a high Arch Mimir lineage. How long can you keep it hidden?",
  "A lowlander petitioner once begged you for sanctuary in the aerie. Why did you look away?"
],
  quietTraded: [
  "What exact sense or certainty did you trade to the Quiet, and what did the silence leave in its place?",
  "Who cut your celestial tether, and do you keep the severed clasp out of grief or vengeance?",
  "In the damp under-alleys of Riverreach, what did you see lurking in the fog that the high aeries deny exists?"
],
  trenchListener: [
  "What rhythm did the Sundered Monolith begin humming on the day you chose to leave the abyss?",
  "You guided a light-squid swarm through a volcanic vent that surface charts say is impassable. Who was following you?",
  "The pressure-silence of the deep is gone on the surface. How do you silence the unbearable noise of the world?"
],
  saltHingeEnvoy: [
  "Which maritime treaty clause did you forge in favor of a stranded raft-clan?",
  "A Sundale privateer owes you their ship and their freedom. When will you call in that marker?",
  "What washed ashore at the First Shore during the last full moon that made the Spindrift Council go pale?"
],
  cataractScout: [
  "Which inland cataract waterfall hides a freshwater cavern that you have never shown on any map?",
  "You carried news upstream that saved a settlement from a flash flood. Why did they still banish you?",
  "What relic did you dive to retrieve from a sunken logging barge in the peat river?"
],
  vaultTender: [
  "What did the thermal crust beneath Emberspire reveal about the fading pulse of Sol's Breath?",
  "You guarded the sealed copper conduits for thirty years. What leaked through the basalt joints?",
  "A pilgrim slipped into the forbidden lower vaults on your watch. Did they burn, or did they find something else?"
],
  ashDuneSkimmer: [
  "What was in the cargo of the sand-galleon that you picked clean during the great sulfur gale?",
  "You survived an ash-dune collapse that buried your skimming crew. Whose goggles are you still wearing?",
  "The Ashen Escarpment is moving northward. How long until the cinder flats swallow the frontier?"
],
  sanctuarySeneschal: [
  "Who did you turn away at the quarantine airlock whom you still see in your dreams?",
  "What sample of necrotic mold did you preserve in secret because its medicinal properties were too valuable to burn?",
  "The camphor smoke hides the smell of decay. How long has the sanctuary been compromised?"
],
  nullSaltHunter: [
  "Who was the first kin you were paid to hunt down and bind in null-salt, and did they recognize you?",
  "The caustic salt has eaten into your flesh. How much feeling do you have left in your hands?",
  "A noble house paid you in tainted coin to silence an escaped family secret. Who survived?"
],
  steppeSinger: [
  "Which ancestral throat-song did you sing that summoned a spirit herd your clan could not control?",
  "Your favorite mount was bred from wild steppe stock. What bond do you share that words cannot express?",
  "The freezing wind carries echoes of lost tribes. Which forgotten clan's song do you alone remember?"
],
  glacierHarpooner: [
  "What colossal beast is still swimming through the ice-floes with your family's heirloom harpoon in its hide?",
  "You fell thirty paces into a glacier crevasse and climbed back out. What did you see frozen in the deep ice?",
  "A winter blizzard trapped your hunting party in a snow cave. How did you survive when the rations ran out?"
],
  canopyWeaver: [
  "Which rare orchid scent did you blend that caused an entire courtly duel to turn into an alliance?",
  "A living vine bridge you cultivated collapsed under suspicious circumstances. Who cut the root-cord?",
  "What forbidden biological secret did you learn about the Briaren canopy while pruning the high branches?"
],
  briarSentinel: [
  "Which logging party's axes shattered against your briar-bark, and what trophy did you take from them?",
  "The taproot you guarded touched something ancient buried beneath the bedrock. What awoke?",
  "Your thorns carry an alkaloid resin that deadens pain. Who begged you for a dose, and why did you refuse?"
],
};

// Helper functions
export const getBackgroundData = (backgroundId) => {
  return BACKGROUND_DATA[backgroundId] || null;
};

export const getAllBackgrounds = () => {
  return Object.values(BACKGROUND_DATA);
};

export const getBackgroundNames = () => {
  return Object.values(BACKGROUND_DATA).map(bg => bg.name);
};

export const getBackgroundSkills = (backgroundId) => {
  const background = getBackgroundData(backgroundId);
  return background ? background.skillProficiencies : [];
};

export const getBackgroundFeature = (backgroundId) => {
  const background = getBackgroundData(backgroundId);
  return background ? background.feature : null;
};

export const getBackgroundStatModifiers = (backgroundId) => {
  // First try standard backgrounds
  const standardBackground = BACKGROUND_DATA[backgroundId];
  if (standardBackground && standardBackground.statModifiers) {
    return standardBackground.statModifiers;
  }

  // Fall back to custom backgrounds for backward compatibility
  const customBackgrounds = require('./legacyDisciplineData').CUSTOM_BACKGROUNDS;
  const customBackground = customBackgrounds[backgroundId];
  if (customBackground && customBackground.statModifiers) {
    return customBackground.statModifiers;
  }

  // No modifiers found
  return {};
};
