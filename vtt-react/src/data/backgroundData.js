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
        "solvarn_human",
        "korr_solari",
        "thrask_solari",
        "thalren_human"
      ],
      "narrativeUnlock": true,
      "justification": "The pilgrimage to Emberspire is a specific journey requiring proximity to Sundale. Outsiders can take it with a narrative reason for the pilgrimage."
    },
    classHooks: [
      { classId: 'martyr', bridge: 'Witnessing Sol\'s Breath fade kindles the theology of willing suffering; many pilgrims take the Vow within a year of the pilgrimage.' },
      { classId: 'pyrofiend', bridge: 'Proximity to Emberspire draws the desperate toward Scathrach deeper vents; some pilgrims never climb back out.' },
      { classId: 'spellguard', bridge: 'Forgeside exposure to volatile Sol\'s Breath resonance is the on-ramp into the Damon tradition of magical defense.' }
    ],
    tensionPairings: [
      { classId: 'harbinger', tension: 'Pilgrims seek restoration of the buried star; a Harbinger among them has usually left the Vigil with the doom-arithmetic instead of faith.' }
    ],
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
      description: 'You carry a sealed phial containing a trace of Sol\'s Breath\'s light. Once per long rest, its faint warmth can calm a frightened ally (advantage on next save against fear) or illuminate a 15-foot radius for 10 minutes. The light attracts Wyrd-creatures if used openly.'
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
        "thrask_solari",
        "solvarn_human",
        "korr_solari"
      ],
      "narrativeUnlock": true,
      "justification": "The Basalt Shyr is a 90-mile road in Sundale. Running it requires Sundale geography knowledge."
    },
    classHooks: [
      { classId: 'spellguard', bridge: 'A career dodging magma-fractures and magical eruptions along the Shyr feeds directly into magical-defense engineering.' },
      { classId: 'pyrofiend', bridge: 'The magma-fracturing sumps that tear reality open are Scathrach territory; runners who linger too long hear the Ashen Sovereign.' },
      { classId: 'martyr', bridge: 'Runners who could not outrun a sulfur-cartel debt sometimes trade survival-pragmatism for the Vow.' }
    ],
    tensionPairings: [
      { classId: 'arcanoneer', tension: 'A runner lives by evasion and improvisation; the arcanoneer lives by pre-filed precision. The two mindsets are incompatible.' }
    ],
    name: 'Courier',
    description: 'The Basalt Shyr is a ninety-mile volcanic trade road, and the Sulfur Cartel (the Hollow-Solari monopoly that controls it) taxes every mile. You ran sulfur caravans and geothermal coal along its length, learning which basalt pillars shift without warning and where the magma-fracturing sumps (reality-tearing vents) tear holes in the air itself. The Dawn Vigil patrols the escarpment checkpoints for tithes and heretics. You learned to give them neither. Slag Gulch is where runners dodge the labor-levies and resupply before the final push. Ember Lagoon is where Cartel cargo changes hands, smuggled onto Merryn ships (crewed by the seafaring Merryn people) that ask no questions about the Vigil\'s missing sulfur. You know the Shyr the way a sailor knows a reef: by the things that have killed the careless. Now the Cartel\'s ledgers have your name in them, and the interest compounds. The road is still the only life that pays. Outrunning what you owe is the only alternative the Cartel recognizes. They are willing to wait, and the magma-fractures are willing to take.',
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
      description: 'You can predict when basalt pillars will shift or Husque-rifts will open. You and your companions gain advantage on Survival checks to navigate volcanic or geothermally-active terrain. You know the unspoken toll-rates of Waste-Solari ranger-stations.'
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
        "thalren_human",
        "florae_unified"
      ],
      "narrativeUnlock": true,
      "justification": "The Sovereign Ledger and Scribe-Cartel are Frostwood-specific. Exclude: Ordan (Steppe-Staves), Skald (runic genealogy), Tessen (knotted cord-cords), they use different record-keeping systems. Shorn Florae can plausibly pass as human scribes in Frostwood ports."
    },
    classHooks: [
      { classId: 'toxicologist', bridge: 'Fog-reagent cataloguing and ledger precision translate directly into the Distillery craft.' },
      { classId: 'inquisitor', bridge: 'Tracking the undocumented and the Wyrd-corrupted is the same archival discipline, turned predatory.' },
      { classId: 'spellguard', bridge: 'Anti-Wyrd paranoia and contract-literacy are the Thalren half of the Spellguard tradition.' }
    ],
    tensionPairings: [
      { classId: 'berserker', tension: 'An archivist chained to their journals cannot sustain the emotional singularity the Blood-Heat demands.' }
    ],
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
      "allowedSubraces": [],
      "justification": "Any race/subrace can be born into a noble house, even erased/subjugated ones (though with narrative tension for erased bloodlines)."
    },
    classHooks: [
      { classId: 'martyr', bridge: 'Solvan and Hollow-Solari heirs carry the original sacrifice as inheritance; the Vow formalizes what their house already demands.' },
      { classId: 'harbinger', bridge: 'An heir who works out the doom-arithmetic of their own house bargain becomes a Harbinger by deduction.' },
      { classId: 'false_prophet', bridge: 'Morren and Astril heirs can wield house authority as the seed of a manufactured congregation.' }
    ],
    tensionPairings: [
      { classId: 'inquisitor', tension: 'Heirs are trained to protect house secrets; the Inquisitor exists to sever them. An heir who takes the Barbed Vow hunts their own blood.' }
    ],
    name: 'Noble Scion',
    description: 'The histories speak of seven noble houses that sealed the bargains of survival. Six of them broke and fed their heirs to Keth-Amar; the seventh, House Viridane, refused and was erased, with House Morrath elevated to fill its empty seat. The Florae, descendants of Viridane, are remembered by the folk as the "eighth house" because they count what the official records hide. You descend from the survivors: Thalreth, Skalvyr, Solvan, Mereval, Tesshan, Ordavan, and Morrath (elevated to replace the erased Viridane). Every one of them struck a Dark Bargain to survive the long night, and every bargain has a price that came due. Your house\'s influence fractured long ago beneath the weight of what your ancestors promised. Some houses collapsed outright. Others limp on, their authority sustained by inertia and fear. The thorned Florae people still carry Viridane\'s blood in their veins, though no ledger will admit it. And the Bryngloom Forest\'s bargain was never a house\'s at all: the Neth people struck it with Morvane before any lord claimed the forest. You carry a name that opens doors and paints targets. Your ancestors bought survival with something they could not afford. The debt is still compounding, and someone has come to collect. What your house pays and what it refuses is your ledger now. The collectors have been patient for eight centuries, and patience like that does not last.',
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
      "allowedSubraces": [
        "ordan_human",
        "vashir_astril",
        "silath_astril"
      ],
      "narrativeUnlock": true,
      "justification": "Requires access to Synod Hold crystal archives and steppe scholarship. Both Earthen Astril and Stellar Astril study at the Synod, just on different paths."
    },
    classHooks: [
      { classId: 'augur', bridge: 'Celestial-archive study and constellation arithmetic are the Astril path into the augury.' },
      { classId: 'false_prophet', bridge: 'Mastery of genuine constellation-lore is the perfect substrate for a manufactured faith.' },
      { classId: 'harbinger', bridge: 'Academics who model the dimming of Lumia\'s echo slide naturally into the doom-arithmetic.' }
    ],
    tensionPairings: [
      { classId: 'berserker', tension: 'A scholar tempered by crystal archives and throat-sung theory rarely survives the Blood-Heat.' }
    ],
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
        "skald_human"
      ],
      "narrativeUnlock": true,
      "justification": "Bloodhammer Sump skirmishes and Hunger Glacier defense are Nordhalla-specific."
    },
    classHooks: [
      { classId: 'berserker', bridge: 'The Hunger Pact lives in a Veteran\'s blood; the Blood-Heat is its combat expression.' },
      { classId: 'warden', bridge: 'Frozen Archive proximity and geothermal-tunnel warfare are the surgical-graft on-ramp into the Bound.' },
      { classId: 'augur', bridge: 'A veteran of the glacier defenses has plenty of preserved dead to read at the Frozen Archive.' }
    ],
    tensionPairings: [
      { classId: 'false_prophet', tension: 'A veteran earned every scar in real combat; manufactured faith tastes like insult to someone who bled for truth.' }
    ],
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
      "allowedSubraces": [
        "velun_neth",
        "kessen_neth",
        "drun_neth",
        "morren_human",
        "clean_vreken",
        "marked_vreken"
      ],
      "narrativeUnlock": true,
      "justification": "Neth contract law (First Contract, Great Registry) is Bryngloom-specific. Vreken share the Bryngloom and navigate its debt-economy. Exclude: Skald, Ordan, neither uses written contract law."
    },
    classHooks: [
      { classId: 'arcanoneer', bridge: 'Contract-law mastery is the foundation Valerius weaponized; a Neth negotiator is halfway to the Arcanoneer already.' },
      { classId: 'revenant', bridge: 'A career in the debt-economy makes undeath-as-obligation-continuation a logical, not horrific, step.' },
      { classId: 'gambit', bridge: 'Reading loopholes and hidden clauses is the same art as reading probability-webs, just applied to law instead of fate.' }
    ],
    tensionPairings: [
      { classId: 'berserker', tension: 'Contract discipline and the Blood-Heat fury are mutually exclusive states of mind.' }
    ],
    name: 'Debt Negotiator',
    description: 'In Atropolis, a canopy city built in the treetops, everything has a price and every price is negotiable. You studied the First Contract (the foundational legal text of the Neth people) and Neth legal tradition in the canopy city\'s contract-halls, guiding clients through Regent Morrath\'s Great Registry (a total debt-and-citizenship registry) and navigating the debt-peonage that underpins the Bryngloom economy. In the Bryngloom Forest, debt is a living thing: every agreement binds, every handshake traps, and the Postmortem Corvee can conscript your corpse for labor if you die in default. You negotiated Memory-Glass Covenants, contracts that store and trade years of lifespan, for clients desperate to buy extra time. You learned to read a Neth contract by its silver-leaf binding and to spot the trap-clauses that bind the unwary. And you memorized the cautionary tale every negotiator learns: Saren-Vel, the greatest contract-lawyer of her generation, who burned her own name from the Contract and became the first of the Drun (the legally nonexistent), living in the Over-Shanty beyond the reach of every law she once mastered. The contract-halls are busier than ever. Morvane waits beneath the roots, patient as the mycelium, and the debt-economy grows. You have the silver tongue and the eye for loopholes. The quill is in your hand. Whose contracts hold and whose names burn is the only question the ink keeps asking.',
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
      description: 'You can spot loopholes, hidden clauses, and binding terms in any written agreement. You recognize a Neth contract by its silver-leaf binding and know the three fatal errors that void a First Contract clause. Merchants and Great Registry officials treat your drafted agreements as legally sound.'
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
        "skald_human"
      ],
      "narrativeUnlock": true,
      "justification": "Requires Nordhalla oral-history training and the specific context of Jarn-Tand's cultural suppression."
    },
    classHooks: [
      { classId: 'augur', bridge: 'A keeper of oral history at the Frozen Archive has the dead close at hand and the patience to read them.' },
      { classId: 'animist', bridge: 'The covert oral archive of the old ways is the seed of the Skald runic-branch of Animism. The ancestors the Runic Academies tried to burn still answer the songs.' },
      { classId: 'apex', bridge: 'Throat-sung navigation and wind-reading translate directly into the sensory tracking of the Silent Hunt.' }
    ],
    tensionPairings: [
      { classId: 'arcanoneer', tension: 'The oral archive and the written contract are rival memory-systems; a Storyteller trusts song where an Arcanoneer trusts filing.' }
    ],
    name: 'Storyteller',
    description: 'In Nordhalla, a frozen northern region, the authoritarian Jarn-Tand\'s Runic Academies burn every old drum they find. So the old ways moved into the only instrument they could not confiscate: the voice. You trained as a chanter, weaving animist history into verse so dense the inquisitors hear a drinking-song and never suspect they are listening to a heresy eight centuries old. Each performance is a hidden archive. Each chorus shields the Fredløse (the outlaw clans who refused Jarn-Tand\'s crown) from the Frost-Tithe\'s despair and the Academies\' erasure. In a land where the written rune is law and the spoken song is contraband, your voice is a covert hearth where the old ways still burn. The Glacier Bargain and the Hunger Winter that followed (the three-year blizzard that drove the ancestors to consume their own dead) birthed the first chants; every chanter since has added a verse. The Academies are listening closer now, and the Fredløse are fewer every winter. You carry the last songs of a people the cold is slowly silencing. The Academies are counting on the cold to finish what their bonfires could not. Keep the verse alive, and they lose.',
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
      "allowedRegions": [],
      "allowedSubraces": [],
      "justification": "Every region has some form of metalworking; the flavor shifts by region."
    },
    classHooks: [
      { classId: 'spellguard', bridge: 'The Damon tradition treats magical defense as forge-engineering; a Smith is already half-trained.' },
      { classId: 'warden', bridge: 'Chain-craft and gear-work are the mechanical backbone of the chain-graft surgical tradition.' },
      { classId: 'berserker', bridge: 'Skald and Waste-Solari forge-workers who absorbed enough forge-heat sometimes find the Blood-Heat igniting on its own.' }
    ],
    tensionPairings: [
      { classId: 'plaguebringer', tension: 'The sterile forge and the cultivated bog-disease are opposite relationships to material, creation versus decay.' }
    ],
    name: 'Smith',
    description: 'Metal remembers. Every hammer-strike, every quench, every fold of alloy is a record that outlasts the hand that made it. You apprenticed at one of the great forges: Harath-Vault beneath the temple-city of Emberspire, the Bloodhammer Sump\'s geothermal foundries, or the deep dock-forges of Ironjaw Port. There you learned to read the record the way a scribe reads ink. You understand metal as living memory. Every alloy is a conversation between elements; every forge-mark, a signature. At Gearworks Gulch in the Cragjaw Peaks, you studied clockwork engineering from the Fexric, a subterranean craft-oriented people whose gear-teeth cut as clean as their grievances. At Sol\'s Anvil Mesa in Sundale, Solvarn sun-priests still work ceremonial metal with techniques passed down from the Binding, the ancient ritual that first sealed the sun away. The forges are failing. Fuel runs low, ore-veins thin, and the old guild-marks lose their meaning as fewer smiths survive to teach them. You carry the grammar of metal in your hands. The old marks have stayed honest this long because someone always kept them so. The hammers still remember, even when the smiths do not.',
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
      "allowedRegions": [],
      "allowedSubraces": [],
      "justification": "Any character could have traveled to the Bryngloom and survived the spore-hush, though should require a narrative reason for being there."
    },
    classHooks: [
      { classId: 'plaguebringer', bridge: 'Surviving the hush leaves a permanent familiarity with the fungal substrate, the first step of cultivation.' },
      { classId: 'inquisitor', bridge: 'A mind fortified against the hush is fortified against the Wyrd; the Barbed Vow is a short step.' },
      { classId: 'animist', bridge: 'Resisting the mycelium song teaches the channeler discipline the spirit-bonds require.' }
    ],
    tensionPairings: [
      { classId: 'martyr', tension: 'A survivor built their whole identity around NOT being consumed; the Vow asks them to be consumed willingly.' }
    ],
    name: 'Plague Warden',
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
        "tessen_human",
        "morgh_groven",
        "ithran_groven",
        "drall_fexric",
        "kethrin_fexric"
      ],
      "narrativeUnlock": true,
      "justification": "Requires knowledge of Ancestor-Spans and Cragjaw geography."
    },
    classHooks: [
      { classId: 'warden', bridge: 'Frostmaw tunnel-navigation and bone-bridge reading are the native training-ground of the Bound.' },
      { classId: 'chronarch', bridge: 'The temporal-suspension pockets of the Cragjaw blizzard are where the Chronarch art is learned.' },
      { classId: 'shaper', bridge: 'Groven and Ithran trackers who internalize the bone-knowledge of the spans are primed for the Shaping Forms.' }
    ],
    tensionPairings: [
      { classId: 'minstrel', tension: 'The vertical silence of the peaks and the maritime cadence of the Iceheart are opposite acoustic worlds.' }
    ],
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
        "merryn_human",
        "shoreling_myrathil",
        "deepling_myrathil",
        "riverling_myrathil"
      ],
      "hardBlocks": [
        "vashir_astril",
        "silath_astril"
      ],
      "narrativeUnlock": true,
      "justification": "Requires Iceheart Sea maritime knowledge. Exclude: Tessen (sealed keep), Ordan (steppe nomads). Astril crystalline bodies do not float, hard block."
    },
    classHooks: [
      { classId: 'gambit', bridge: 'Tattooed trade-contracts and sea-omen gambling are the Merrain foundation of the Gambit tradition.' },
      { classId: 'minstrel', bridge: 'The storm-rhythm and ship-board cadence are the native substrate of the Tide-Choir.' }
    ],
    tensionPairings: [
      { classId: 'warden', tension: 'A Warden must anchor and hold; a sailor lives by movement and current. The immovable chain and the shifting tide are opposed philosophies.' }
    ],
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
      "allowedSubraces": [
        "velun_neth",
        "kessen_neth",
        "drun_neth",
        "morren_human",
        "clean_vreken",
        "marked_vreken"
      ],
      "narrativeUnlock": true,
      "justification": "Requires knowledge of Bryngloom Toll-Dikes, Mist-Gate Market, and peat-oil trade routes."
    },
    classHooks: [
      { classId: 'gambit', bridge: 'Toll-negotiation probability and bypass-route calculation are the Cragjaw-refined half of the Gambit art.' },
      { classId: 'revenant', bridge: 'A career in the peat-debt economy makes the undeath-as-obligation step both familiar and rational.' },
      { classId: 'toxicologist', bridge: 'Trading bog-reagents and memory-glass builds the pharmacological literacy the Distillery requires.' }
    ],
    tensionPairings: [
      { classId: 'berserker', tension: 'Trade demands patience and read of the other party; the Blood-Heat dissolves both in seconds.' }
    ],
    name: 'Black Market Trader',
    description: 'The Bryngloom Forest trades in three currencies: memory-glass (crystallized memories), peat-oil, and the years left in a lifespan. You ran goods across its root-tangled expanse under Regent Morrath\'s Great Registry, dealing in wyrd-warded curios (trinkets enchanted against supernatural forces) and the covenants that bind them. The living-ironwood Toll-Dikes tax every road, but you learned the bypasses. You bargained with Drun smugglers (the legally nonexistent outcasts) beneath the canopy, traded lifelines at the Mist-Gate Market where a desperate soul will sell five years for a chest of peat-oil, and rested at Morren\'s Bogpost where the forest meets the steppe. Your ledger is warded against the Inquisition\'s audit. Every entry is legal, or at least defensibly ambiguous. The Registry tightens its tariffs every season, and the Drun routes grow more dangerous as the Root-Veil spreads and the old crossings rot beneath it. You know the prices, the paths, and the faces that pay. No one else is bringing these goods through. The trade-routes close the season you stop running them, and the Forest does not forgive silence.',
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
      description: 'You know the trade laws of the Great Registry, the Drun\'s peat-harvesting routes, and the Toll-Dikes\' bypass channels. You can find buyers for illicit peat-oil or memory-glass, and your ledgers are recognized by Neth contract-houses.'
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
        "morren_human",
        "drun_neth",
        "marked_vreken",
        "clean_vreken"
      ],
      "narrativeUnlock": true,
      "justification": "The Over-Shanty is beneath Atropolis specifically. A non-Bryngloom native has never been there."
    },
    classHooks: [
      { classId: 'toxicologist', bridge: 'The black-market reagent trade of the Over-Shanty is a self-taught pharmacology degree.' },
      { classId: 'plaguebringer', bridge: 'Bog-proximity and salvage of the fungal underworld are the unwelcome apprenticeship of the Cultivar.' },
      { classId: 'inquisitor', bridge: 'Knowing the supernatural underworld from below makes an Urchin a devastating hunter when they turn.' }
    ],
    tensionPairings: [
      { classId: 'martyr', tension: 'An Urchin survived by being invisible and unrecorded; the Vow demands they be seen and broken for others.' }
    ],
    name: 'Urchin',
    description: 'The Over-Shanty is a hanging slum beneath the treetop city of Atropolis, like a wound the canopy city refuses to acknowledge. You grew up in its rope-bridges and salvage-nests, one of the Forgotten: undocumented, unrecorded, legally nonexistent under Regent Morrath\'s Great Registry. The Registry tracks every name above. Below, the Shanty tracks only who can climb and who cannot. The slum coalesced from Drun outcasts (people who erased their own names from the law), Morren defaulters, and merchants too desperate to check the drop. You learned which rope-bridges hold weight, how to slip past the Toll-Dike patrols, and how to bargain with Drun smugglers for black-market peat-oil. The memory-brokers know your face; the Registry never will. Atropolis thrives above, and the Shanty swells below, and the rope-bridges between them fray a little more every season. You were born outside the law. The Registry already has the blank space where your name was. Climb, or the mist fills it.',
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
      description: 'You know the secret pathways of the Over-Shanty\'s hanging slums, which rope-bridges hold weight, how to slip past the Toll-Dike checkpoints, and where Drun outcasts hide from the Registry-guard. You can navigate any hanging or vertical settlement at twice the normal speed.'
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
    description: 'For centuries, the seven Sundered Monoliths stood silent: six true fragments of the binding seal and one hollow echo where a seventh signature was never made. The Breach broke them: when an ancient entity called Keth-Amar consumed the six sacrificed heirs of the noble houses, the binding cracked and the fragments scattered across every region. They hummed quietly for generations. No one bothered to listen. Now they are waking. All seven at once, their resonance rising, and the song is getting louder. You track that resonance across the frozen world with cold iron stakes to ground the Wyrd-echoes (supernatural magical residue) and a journal of fragment-locations that certain powers would kill to possess. The monoliths were silent for the better part of eight centuries. Whatever changed, it changed recently, and it is still changing. You carry the only map that tracks all seven fragments, and the powers who want it do not negotiate. Reach the next Monolith first. The choice of whether the waking is hastened, halted, or understood only stays yours while you are the one standing at its base.',
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
        "florae_unified",
        "florae_unified"
      ],
      "narrativeUnlock": true,
      "justification": "Grove-Wardens swear the fae counter-bargain in the moonlit groves of the Frostwood Reach, a Florae bloodline obligation. An outsider could plausibly be sworn to the grove through adoption or an unpaid life-debt."
    },
    classHooks: [
      { classId: 'lunarch', bridge: 'The moonlit groves a Forest Warden patrols are the only place the lunar parasite is found; the patrol and the pact are one career.' },
      { classId: 'toxicologist', bridge: 'Thorn-blood and ghost-metal cold-working are the Florae foundation of the Distillery craft.' }
    ],
    tensionPairings: [
      { classId: 'martyr', tension: 'The fae bargain is fundamentally transactional; the Vow asks for uncompensated self-destruction. A Forest Warden turned Martyr has betrayed one covenant for another.' }
    ],
    name: 'Forest Warden',
    description: 'There were seven noble houses, and yours was the seventh — House Viridane, erased from every history the other six were permitted to write. The official record names only six, plus the upstart Morrath they crowned to replace you. That record is a lie of omission. You swore the old fae bargain in the moonlit groves of the Frostwood Reach, binding yourself to the Hollow-Court (the fae court of the forest) and the ironwood hollows where House Viridane (the erased seventh house) sealed its counter-pact when the other houses marched their heirs to be sacrificed to Keth-Amar. Viridane refused. Viridane ran. Viridane survived, in you and every Florae who carries the thorns. You tend the Thorn-Fall, where eight centuries of shed thorns record every unfulfilled promise the fae have witnessed. You mine ghost-metal from the cold vein beneath the deep groves and enforce the fae\'s old laws against the quiet expeditions the other families send to strip what Viridane left behind. You carry Viridane\'s last counter-pact in your blood and its law in your thorns. Viridane did not run eight centuries to end under leaf-rot. The grove holds as long as you do.',
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
      description: 'You carry the fae\'s old laws written in your flesh. Once per long rest, you may witness a spoken oath between two willing creatures and invoke the grove\'s old law: if either party breaks the oath within a year, you sense the breaking immediately and the oathbreaker cannot hide from your Insight checks for one month. Florae recognize you by your thorn-clusters (or your hidden token); fae-touched creatures and the Shorn community provide you shelter in exchange for a small thorn-tithe.'
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
        "veiled_mimir",
        "tethered_mimir"
      ],
      "narrativeUnlock": true,
      "justification": "Mask-Wardens train in the Fog-Vales to recover stolen masks and turn back the Hunters. A non-Mimir could be sworn in only through a deep act of protection, and even then, the mistrust outlasts the oath."
    },
    classHooks: [
      { classId: 'apex', bridge: 'Reading spore-trails and fog-silence is the native tracking art of the Silent Hunt.' },
      { classId: 'shaper', bridge: 'A Mimir who defends masks understands form and identity deeply, the substrate of the Shaping Forms.' },
      { classId: 'toxicologist', bridge: 'Floor-toxin brewing and intruder-detection are the Fractured Mimir half of the Distillery.' }
    ],
    tensionPairings: [
      { classId: 'berserker', tension: 'A Guardian exists to preserve fixed identity; the Blood-Heat dissolves it. The two are philosophical opposites, and a Mimir cannot be a Berserker anyway.' }
    ],
    name: 'Guardian',
    description: 'The Mimir are a masked people whose masks are ancient relics, and the Hunters (mask-collecting cartels) pay fortunes for them on the black market. You stand between the mask-wearers and the cartels that hunt them. You patrol the fog-spider-silk rope-bridges of the Spire-Aeries, watch the Watch-Bells for the next alarm, and track the detection-specialists who probe the misty Vales with ever-refining tools. The Mimir Purge took the birthing chambers and the last Mask-Mothers (the only ones who could craft new masks) with them. The Rupture that followed restricted every surviving mask to a first-born heir, and the mothers who could have made more are ashes. Since then, Keepers have guarded what remains. Whether you are an Arch Mimir scholar or a Fractured Mimir sentinel, you learned to read the spore-trails intruders leave and the silence the fog carves when an outsider moves through it. The Hunters are better funded than they have been in generations, and every mask that falls feeds a collection that grows bolder. You know their methods because you have buried the ones who got careless. The Vales will not defend themselves, and the Hunters have deeper coffers every season. Every mask you lose ends in a glass case in a city that calls it art.',
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
      description: 'You have learned how the Hunters track Mimir and how to turn that tracking back on them. Once per long rest, when you observe a creature using detection magic, scrying, or mundane tracking against you or a masked ally, you may turn the method against its user: for 1 hour, the tracker has disadvantage on all Perception and Investigation checks, and you know their general direction. Woven wardens along the Spire-Aeries and Fractured Mimir allies will shelter you and pass warning of Hunter movements.'
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
        "kethrin_fexric",
        "drall_fexric"
      ],
      "narrativeUnlock": true,
      "justification": "The guild-vaults and underground academies are Fexric-specific institutions. Clockwork Fexric study in formal academies; Caustic Fexric learned in secret before being expelled."
    },
    classHooks: [
      { classId: 'chronarch', bridge: 'Temporal-mechanics and gear-craft blueprints are the Clockwork Fexric foundation of the Chronarch engine.' },
      { classId: 'warden', bridge: 'Chain-graft gear-work and surgical-engineering literacy are the Fexric path into the Bound.' }
    ],
    tensionPairings: [
      { classId: 'animist', tension: 'A Machinist treats the world as a mechanism; an Animist treats it as a conversation. The two frames cannot share a skull.' }
    ],
    name: 'Machinist',
    description: 'Deep in the subterranean Fexric warrens (the tunnels of a craft-oriented people), behind sealed blast-doors, the guild-vaults keep their knowledge on copper-plate codices: precision gear-craft, clockwork temporal mechanics, and the ancestral binding theory that makes both possible. You trained in those vaults. Whether you are Clockwork Fexric (a formally-trained guild scholar) or Caustic Fexric (an expelled dropout who learned in secret), you learned the same grammar of gears, and it marked you for life. Clockwork Fexric scholars spend decades memorizing proprietary blueprints under the Master Craft-Guilds\' supervision, every formula earned, catalogued, and owned. Caustic Fexric dropouts learned enough before expulsion to be dangerous; they carry stolen fragment-pages stitched into their clothing, half-understood theories they improvise into working machines that sometimes work. The guild-vaults are closing their doors as the Cragjaw Peaks\' blizzard deepens and the old thermal-pipes freeze. What you memorized, no blast-door can lock away. The warrens are still standing because someone kept building when the vaults stopped sharing. That someone is now you.',
    skillProficiencies: ['Arcana', 'Investigation'],
    toolProficiencies: ['Artisan\'s tools (tinkerer\'s)', 'Thieves\' tools'],
    languages: 1,
    equipment: [
      'Copper-plate codex (water-damaged for Caustic Fexric, pristine for Clockwork Fexric)',
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
      description: 'You carry the structural grammar of Fexric engineering in your mind. You can identify any mechanical or clockwork device\'s origin-guild, approximate age, and intended function by inspection alone. Once per long rest, you can reverse-engineer a minor mechanism (lock, trap trigger, gear assembly) after 10 minutes of study. Clockwork Fexric gain research access at recognized guild halls; Caustic Fexric must rely on the underground salvage markets where their expired tokens still carry cachet.'
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
        "ordan_human"
      ],
      "narrativeUnlock": true,
      "justification": "The migration herds are Ordan-specific. No other culture follows the herds across the Sundrift Vale."
    },
    classHooks: [
      { classId: 'apex', bridge: 'Reading hoof-tracks in blizzard and predicting predator movement by wind-shift is the Ordan foundation of the Silent Hunt.' },
      { classId: 'animist', bridge: 'Totem-weaving from the migration-horse mane and ancestor-communion through the herd is Kael totemic root tradition.' }
    ],
    tensionPairings: [
      { classId: 'martyr', tension: 'A Herder lives to keep the migration moving; the Vow demands they stop and be broken. Stillness is the enemy of the steppe.' }
    ],
    name: 'Herder',
    description: 'The Ordan are steppe nomads who follow the grass-line across the vast Sundrift Vale, and the grass-line runs from the advancing frost. You guarded the migration herds, driving a hundred head of shag-ox through a circuit that never ends: ahead of the frost that claims the pasture, and back before the thaw rots what remains. The steppe kills the careless. You are not careless. You learned to read hoof-tracks in a blizzard, predict Wyrd-predator (supernatural predator) movements by the shift of the wind, and keep the herd moving when every instinct screams to shelter and wait. The herds are the Ordan\'s only wealth. Lose one animal to frost-collapse or a Wyrd-predator, and a family line starves for a generation. The grass-line is shrinking. The frost comes earlier every circuit, and the thaw rots more than it grows. You know the old routes, the safe grazes, the wind-signs that mean run. One lost animal starves a family line for a generation. The frost does not negotiate with cattle, and the herd will not save itself.',
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
      description: 'You can read the mood and movement of animals with uncanny precision. You have advantage on Animal Handling checks, and once per long rest you can sense the presence and general direction of any predator within 300 feet by the reaction of nearby animals. Ordan migration camps will always offer you shelter and a share of the fire in exchange for a night\'s herd-watch.'
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
        "vashir_astril",
        "silath_astril"
      ],
      "narrativeUnlock": true,
      "justification": "The Echo traditions are Astril-specific institutions. Both Earthen Astril (embracing) and Stellar Astril (suppressing) train in the same cathedral."
    },
    classHooks: [
      { classId: 'augur', bridge: 'Reading Lumia\'s echo and resonance-signatures is the Astril path into the augury.' },
      { classId: 'false_prophet', bridge: 'Genuine mastery of alien resonance is the most convincing substrate for a manufactured faith.' },
      { classId: 'harbinger', bridge: 'Scholars who model Lumia\'s fading echo slide into the doom-arithmetic of the Doom-Choir.' }
    ],
    tensionPairings: [
      { classId: 'berserker', tension: 'Crystal-archive discipline and the Blood-Heat fury cannot coexist in the same nervous system.' }
    ],
    name: 'Stargazer',
    description: 'Every Astril carries Lumia\'s echo in their crystalline markings, the biological resonance of a dead world\'s biosphere, and the Synod (the council that governs the Astril\'s relationship with that heritage) regulates the bond. You trained under its hierarchy, learning the crystal-lattice techniques that keep Lumia\'s echo from overwhelming the host. Whether you are Earthen Astril, who embraces the passenger\'s wild power, or Stellar Astril, who cages it behind mental discipline, you studied the same disciplines and survived them. You catalogued echo-lineages on memory-glass, learned the forbidden Echo-Songs that map the fading signatures of those lost to Lumia\'s call, and trained to recognize the resonance-signatures of an echo approaching the Submersion threshold, the point at which the host\'s consciousness is consumed entirely. Beyond that threshold, the Synod has no technique that brings either back. Lumia\'s echo is dimming. Every cycle, another host flickers toward Submersion, and the Synod\'s crystal techniques buy less time than they did a generation ago. You know the signs and the songs and the lattice-work that holds a dead world inside a living chest. The echo will not keep itself stable. That is your work, and the alternative is finding out what silence sounds like when the last fragment of Lumia goes dark.',
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
      description: 'You can identify any Astril\'s echo-lineage, power-level, and stability by observing their crystalline patterns for one minute. Once per long rest, you can calm an echo that is approaching the Submersion threshold (loss of control), granting the host advantage on their next Spirit saving throw. The Synod provides sanctuary to recognized scholars, though Stellar Astril scholars are watched more carefully than Earthen Astril.'
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
        "shoreling_myrathil",
        "deepling_myrathil",
        "riverling_myrathil"
      ],
      "narrativeUnlock": true,
      "justification": "The deep currents and pressure-dark are Myrathil-specific environments. Merryn sailors stay surface-level; Myrathil descend."
    },
    classHooks: [
      { classId: 'gambit', bridge: 'Reading current-temperature gradients and pressure-patterns is the Myrathil tide-probability half of the Gambit art.' },
      { classId: 'minstrel', bridge: 'The subsonic pressure-language of the abyss is the Deep foundation of the Pressure-Cadence.' }
    ],
    tensionPairings: [
      { classId: 'warden', tension: 'A Subsea Navigator lives in fluid, shifting space; a Warden must be immovable stone. The abyss and the anchor are opposed vocations.' }
    ],
    name: 'Subsea Navigator',
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
        "veiled_mimir",
        "tethered_mimir",
        "thalren_human",
        "florae_unified"
      ],
      "narrativeUnlock": true,
      "justification": "Fog-reading requires intimate knowledge of the Frostwood's living fog, its memory-erasing properties, its Wyrd-trails, and its secret passages. Non-Frostwood natives have never survived long enough to learn."
    },
    classHooks: [
      { classId: 'apex', bridge: 'Tracing Wyrd-trails through the fog by touch and scent is the Woven and Mimir foundation of the Silent Hunt.' },
      { classId: 'lunarch', bridge: 'Fog-dense Silence-light is the exact medium the lunar parasite feeds on; a Forest Guide is standing in the Lunarch recruiting-ground.' },
      { classId: 'inquisitor', bridge: 'Reading Wyrd-currents and memory-erasure patterns is the Thalren anti-Wyrd half of the Barbed Vow.' }
    ],
    tensionPairings: [
      { classId: 'arcanoneer', tension: 'A Forest Guide trusts instinct and shifting currents; an Arcanoneer trusts pre-filed precision. The fog makes the latter impossible and the former essential.' }
    ],
    name: 'Forest Guide',
    description: 'The fog in the Frostwood Reach is not weather. It is a living geography that responds to the thoughts of those inside it, and it literally eats memories. You read that fog the way a sailor reads the sea: tracing density shifts, memory-erasure currents, and the Wyrd-trails (supernatural residue) that things leave when they pass through it. You learned by touch, scent, and the kind of instinct that keeps you alive when the map dissolves. The masked Mimir navigate the canopy by spore-scent and fog-spider silk markers. The Thalren chart fog-currents on ironwood staves. The thorned Florae feel the fog through their connection to the forest floor, and where the mist pools deepest, their thorns ache with the memory of what it has swallowed. You learned to read all three, because the fog respects no single tradition. The fog is thickening. Every season it eats more, and the safe routes through the Reach shrink with it. You know the currents, the silk-trails, the places the mist pools when something is hunting. The maps lie now; the fog ate the truth out of them years ago. Trust the mist, or lose your name to it like every traveler who reached for ink instead.',
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
      description: 'You can navigate the Frostwood\'s memory-erasing fog without losing your bearings. You have advantage on Perception and Survival checks in fog, mist, or haze, and you are immune to the disorientation effect of the Reach\'s fog (though not its memory-erasing properties). Once per long rest, you can trace the trail of a Wyrd-creature through the fog for up to 1 mile. Frostwood settlements and Mimir canopy-posts will offer you shelter and fog-current updates.'
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
        "tessen_human",
        "morgh_groven",
        "ithran_groven"
      ],
      "narrativeUnlock": true,
      "justification": "Requires intimate knowledge of Cragjaw geothermal tunnels and deep-chasm infrastructure."
    },
    classHooks: [
      { classId: 'shaper', bridge: 'The chasm-tunnels of the Cragjaw deep-vent network are where the Shaper learns to mold flesh through heat and pressure, the deep forge of the body.' },
      { classId: 'warden', bridge: 'A Warden who has anchored in the thermal vents learns to draw strength from the earth\'s deep pulse, holding the line with volcanic patience.' }
    ],
    tensionPairings: [
      { classId: 'minstrel', tension: 'The silence of the deep tunnels and the acoustics of the open peaks are musically incompatible; one teaches stillness, the other resonance.' }
    ],
    name: 'Underground Delver',
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
      "allowedSubraces": [
        "merryn_human"
      ],
      "narrativeUnlock": true,
      "justification": "Requires familiarity with Brine-Bond Syndicate trade routes and Iceheart coastal tariffs."
    },
    classHooks: [
      { classId: 'gambit', bridge: 'The Brine-Bond trade-game (cargo manifests, bribe negotiations, Press-Warrant evasion) is a Gambit\'s native environment, every deal a gamble with Syndicate enforcers.' },
      { classId: 'minstrel', bridge: 'Coastal taverns and Syndicate trading posts are where the Brine-Tide minstrels learn their ballads of evasion, loss, and seafront justice.' }
    ],
    tensionPairings: [
      { classId: 'warden', tension: 'A Warden holds ground; a Brine-Trader would sell the ground and lease it back with options. Stasis and liquidity are fundamentally opposed philosophies.' }
    ],
    name: 'Coastal Trader',
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
  }
};

export const BACKGROUND_FLAVOR_TEXT = {
  emberspirePilgrim: 'You climbed the Ashen Escarpment and saw Sol\'s Breath burning behind obsidian. The Dawn Vigil branded your throat and sent you down with a phial of captured light. Now you carry a faith that might be heresy.',
  shyrRunner: 'Ninety miles of volcanic road, and the Sulfur Cartel taxes every step. You ran the basalt pillars and magma-fractures, learning which ground kills the careless. The Cartel has your name in their ledgers, and the debt compounds.',
  ledgerKeeper: 'In the Frostwood Reach, the fog eats memory. You kept the identity-ledgers at Greymark Keep, deciding who is real and who is forgotten. The ink dries fast, and the fog never sleeps.',
  bloodlineHeir: 'Seven noble houses remain. The eighth was erased for refusing to feed its heir to Keth-Amar. You carry a name that opens doors and paints targets. The debt your ancestors bought is still compounding.',
  synodAcademic: 'The Synod Hold sings when the wind finds the right key. You learned the forbidden Echo-Songs and the echo-lineages carved on bone Steppe-Staves. The stars are going out, and you have the training to read the patterns.',
  sumpsVeteran: 'The Bloodhammer Sump breeds soldiers the way a wound breeds salt. You carry the Hunger Pact in your blood: ancestral starvation turned to fury. The glaciers are advancing again, and the dead want you to survive.',
  debtNegotiator: 'In Atropolis, everything has a price and every price is negotiable. You read Neth contracts by their silver-leaf binding and spot the trap-clauses that bind the unwary. The greatest lawyer of your generation burned her own name from the Contract.',
  frostChanter: "Jarn-Tand's Academies burn every old drum they find, so the old ways moved into the voice. You weave animist history into drinking-songs that inquisitors never suspect are heresies eight centuries old. Your voice is a covert hearth.",
  forgeWright: 'Metal remembers. Every hammer-strike is a record that outlasts the hand that made it. You understand metal as living memory, reading forge-marks the way a scribe reads ink. The forges are failing, and fewer smiths survive to teach.',
  hushSurvivor: "You watched the hush take someone you loved. First the darkened veins, then the dissolved mind, then the Hush-Bogs. You fortified your mind against the mycelium's song, but it never fully fades. You know the early signs.",
  peakTracker: 'The Cragjaw Peaks are a vertical labyrinth where the blizzard rewrites every path. You navigate with knotted cord route-markers, reading the stress-fractures in bone-bridges the Groven dead left behind. The peaks are getting colder.',
  merrowSailor: 'The Iceheart Sea does not forgive debts. You sailed under the Sea-Charter, your arms inked with trade-tattoos that double as legal contracts. The sea is freezing earlier every year, and the routes are shrinking with the ice.',
  gloomwayTrader: 'The Bryngloom trades in three currencies: memory-glass, peat-oil, and years left in a lifespan. You run goods across root-tangled expanse, dealing in wyrd-warded curios. The Registry tightens its tariffs every season.',
  shantyRat: 'The Over-Shanty hangs beneath Atropolis like a wound the canopy city refuses to acknowledge. You grew up in rope-bridges and salvage-nests, one of the Forgotten: legally nonexistent. The rope-bridges fray a little more every season.',
  monolithHunter: 'The seven Sundered Monoliths are waking. All seven at once, their resonance rising. You track that resonance with cold iron stakes and a journal certain powers would kill to possess. Whatever changed, it changed recently.',
  groveWarden: 'There were seven houses, and yours was the seventh — struck from every history the others were allowed to write. You swore the old fae bargain in moonlit groves, binding yourself to the Hollow-Court. You tend the Thorn-Fall where eight centuries of shed thorns record every unfulfilled promise.',
  maskWarden: "The Mimir's masks are relics, and the Hunters pay fortunes for them. You stand between the mask-wearers and the cartels that hunt them, patrolling fog-spider-silk rope-bridges. Every mask that falls feeds a collection that grows bolder.",
  vaultScholar: 'Deep in the Fexric warrens, the guild-vaults keep their knowledge on copper-plate codices: precision gear-craft, temporal mechanics. You learned the grammar of gears, and it marked you for life. What you memorized, no blast-door can lock away.',
  herdGuardian: 'The Ordan steppe stretches endlessly, and the herds are everything. You guard the ember-hooved cattle across frozen grass, reading the wind for threats. The nomads trust your eyes more than any wall.',
  starboundScholar: 'Every Astril carries Lumia\'s echo in their blood, and the Synod governs that relationship with a dead world\'s memory. You trained under its hierarchy, learning the crystal-lattice techniques that keep the echo from overwhelming the host.',
  deepCurrentGuide: 'Beneath the Iceheart Sea, the water is still warm. You navigated the pressure-zones where light dies and the only maps are temperature-gradients felt through the skin. The abyss is patient, and it is learning the routes you know.',
  fogReader: 'The fog in the Frostwood Reach is not weather. It is a living geography that responds to thought. You read its density shifts and memory-erasure currents, tracing Wyrd-trails by touch and scent. The fog is thickening, and it never stops.',
  chasmDelver: 'Beneath the Cragjaw Peaks, the geothermal vents pulse in forgotten rhythms. You descended into the steam-tunnels where the only light is volcanic blood-red, maintaining pipes and reading pressure in the deep dark. The vents are pulsing faster now.',
  brineTrader: 'The Iceheart Sea does not forgive debts, and you learned that at the counter, not the mast. You know every tariff loophole and bribe price from Brinehorse Cove to Merrowport, keeping the coastal trade alive as the ice closes in.'
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
    'You read Neth contracts by their silver-leaf binding. Which clause did you miss that still binds you?',
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
    'The Fexric guild-vaults hold copper-plate codices. What codex did you memorize that no blast-door can lock away?',
    'You learned the grammar of gears. What mechanical secret did you discover that the guilds suppressed?',
    'Temporal mechanics are forbidden knowledge. What did you calculate that made the vault elders burn the evidence?'
  ],
  herdGuardian: [
    'The Ordan steppe is endless, and the herds are everything. Which ember-hooved bull did you lose in a blizzard that you still search for?',
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
    'Memory-erasure currents shift with the Wyrd-trails. Whose memory did you recover from the fog, and why did it matter?',
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
