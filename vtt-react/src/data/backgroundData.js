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
        "korr_emberth",
        "thrask_emberth",
        "thalren_human"
      ],
      "narrativeUnlock": true,
      "justification": "The pilgrimage to Emberspire is a specific journey requiring proximity to Sundale. Outsiders can take it with a narrative reason for the pilgrimage."
    },
    classHooks: [
      { classId: 'martyr', bridge: 'Witnessing the Solbrand fade kindles the theology of willing suffering; many pilgrims take the Vow within a year of the pilgrimage.' },
      { classId: 'pyrofiend', bridge: 'Proximity to Emberspire draws the desperate toward Scathrach deeper vents; some pilgrims never climb back out.' },
      { classId: 'spellguard', bridge: 'Forgeside exposure to volatile Solbrand resonance is the on-ramp into the Damon tradition of magical defense.' }
    ],
    tensionPairings: [
      { classId: 'harbinger', tension: 'Pilgrims seek restoration of the buried star; a Harbinger among them has usually left the Vigil with the doom-arithmetic instead of faith.' }
    ],
    name: 'Emberspire Pilgrim',
    description: 'Every year, the faithful climb the Ashen Escarpment to Emberspire, where the Solbrand burns behind sealed obsidian. Hierophant Aethelgard\'s Dawn Vigil watches over the pilgrimage, and watches the pilgrims. You made the climb. You saw the light the Reforging promises to restore, filtering through the Obsidian Citadels where Ash-Dweller bondsmen haul basalt for a spirit they are forbidden to pray to. Some descend with the Vigil\'s seal branded on their throats, ready to spread the call of rebirth to every frozen port. Others descend with doubt gnawing where the brand should be. You carried your phial of captured Solbrand-light down to Ember Lagoon, where the Vigil\'s black-hulled ships carry the faithful and the faithless alike to whatever the Dawn Vigil calls service. The sun is buried. The Vigil says it will rise again. You have seen what lies beneath the obsidian, and you cannot unsee it. What you do with that knowledge is the only question the Vigil left unanswered.',
    skillProficiencies: ['Insight', 'Religion'],
    languages: 2,
    equipment: [
      'Sealed Solbrand phial',
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
      name: 'Solbrand\'s Ember',
      description: 'You carry a sealed phial containing a trace of the Solbrand\'s light. Once per long rest, its faint warmth can calm a frightened ally (advantage on next save against fear) or illuminate a 15-foot radius for 10 minutes. The light attracts Wyrd-creatures if used openly.'
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
        "thrask_emberth",
        "solvarn_human",
        "korr_emberth"
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
      { classId: 'arcanoneer', tension: 'A runner lives by evasion and improvisation; the contract-mage lives by pre-filed precision. The two mindsets are incompatible.' }
    ],
    name: 'Shyr Runner',
    description: 'The Basalt Shyr is ninety miles of volcanic road, and the Sulfur Cartel taxes every mile of it. You ran sulfur caravans and geothermal coal along its length, learning which basalt pillars shift without warning and where the magma-fracturing sumps tear holes in the air itself. The Dawn Vigil patrols the escarpment checkpoints for tithes and heretics. You learned to give them neither. Slag Gulch is where runners dodge the labor-levies and resupply before the final push. Ember Lagoon is where Cartel cargo changes hands, smuggled onto Merryn ships that ask no questions about the Vigil\'s missing sulfur. You know the Shyr the way a sailor knows a reef: by the things that have killed the careless. Now the Cartel\'s ledgers have your name in them, and the interest compounds. The road is still the only life that pays. It falls to you to outrun what you owe, or find a different kind of ending at the bottom of a magma-fracture.',
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
      description: 'You can predict when basalt pillars will shift or Husque-rifts will open. You and your companions gain advantage on Survival checks to navigate volcanic or geothermally-active terrain. You know the unspoken toll-rates of Thrask ranger-stations.'
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
        "smoothskinned_briaran"
      ],
      "narrativeUnlock": true,
      "justification": "The Sovereign Ledger and Scribe-Cartel are Frostwood-specific. Exclude: Ordan (Steppe-Staves), Skald (runic genealogy), Tessen (knotted cord-cords), they use different record-keeping systems. Smooth-Skinned Briaran can plausibly pass as human scribes in Frostwood ports."
    },
    classHooks: [
      { classId: 'toxicologist', bridge: 'Fog-reagent cataloguing and ledger precision translate directly into the Distillery craft.' },
      { classId: 'inquisitor', bridge: 'Tracking the undocumented and the Wyrd-corrupted is the same archival discipline, turned predatory.' },
      { classId: 'spellguard', bridge: 'Anti-Wyrd paranoia and contract-literacy are the Thalren half of the Spellguard tradition.' }
    ],
    tensionPairings: [
      { classId: 'berserker', tension: 'An archivist chained to their journals cannot sustain the emotional singularity the Blood-Heat demands.' }
    ],
    name: 'Ledger Keeper',
    description: 'In the Frostwood Reach, the fog eats memory, and Jarl-Archivist Kaelen Thalreth eats dissent. You kept the identity-ledgers at Greymark Keep, where a citizen is only as real as their last entry in the Sovereign Ledger. If the fog takes your name and no scribe records the loss, you become one of the Forgotten, and no law protects the unrecorded. The Scribe-Cartel holds the monopoly on Soot-Resin Ink and Peat-Parchment. Your chained journals were the only proof that thousands of people existed. You checked papers at the Ironwood Palisade, catalogued lineages at Greythorn Copse, and bent over the prehistoric carvings at Mistbarrow trying to read what the fog had already half-erased. Kaelen\'s father Aldren started the Ledger Purge generations ago to strip the undocumented from the record. Now Aldren sits in his chambers re-reading his own journals, trying to remember who he is. The fog took him. Kaelen tells himself it won\'t take the Reach. You hold the quill that decides who is real and who is forgotten. The ink dries fast, and the fog never sleeps.',
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
      description: 'Your personal journal serves as incontestable legal proof of your existence under Kaelen Thalreth\'s Sovereign Ledger. When fog threatens to erase a memory, referencing your ledger allows you to recall it. Common folk and Palisade guards will provide simple accommodations to a documented Ledger Keeper.'
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
      { classId: 'martyr', bridge: 'Solvan and Korr heirs carry the original sacrifice as inheritance; the Vow formalizes what their house already demands.' },
      { classId: 'harbinger', bridge: 'An heir who works out the doom-arithmetic of their own house bargain becomes a Harbinger by deduction.' },
      { classId: 'false_prophet', bridge: 'Morren and Astril heirs can wield house authority as the seed of a manufactured congregation.' }
    ],
    tensionPairings: [
      { classId: 'inquisitor', tension: 'Heirs are trained to protect house secrets; the Inquisitor exists to sever them. An heir who takes the Barbed Vow hunts their own blood.' }
    ],
    name: 'Bloodline Heir',
    description: 'There were eight noble houses, once. Seven remain on the rolls. The eighth, House Viridane, refused to feed its heir to Keth-Amar at the Breach, and the other houses erased it from every record that mattered. You descend from the survivors: Thalreth, Skalvyr, Solvan, Mereval, Tesshan, Ordavan, Morrath. Every one of them struck a Dark Bargain to survive the long night, and every bargain has a price that came due. Your house\'s influence fractured long ago beneath the weight of what your ancestors promised. Some houses collapsed outright. Others limp on, their authority sustained by inertia and fear. The Briaran still carry Viridane\'s blood in their thorns, though no ledger will admit it. And the Bryngloom\'s bargain was never a house\'s at all: the Neth struck it with the Keeper of the Last Threshold before any lord claimed the forest. You carry a name that opens doors and paints targets. Your ancestors bought survival with something they could not afford. The debt is still compounding, and someone has come to collect. It falls to you to decide what your house pays and what it refuses.',
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
        "sylen_astril",
        "muren_astril"
      ],
      "narrativeUnlock": true,
      "justification": "Requires access to Synod-Hold crystal archives and steppe scholarship. Both Sylen and Muren Astril study at the Synod, just on different paths."
    },
    classHooks: [
      { classId: 'augur', bridge: 'Celestial-archive study and constellation arithmetic are the Astril path into the augury.' },
      { classId: 'false_prophet', bridge: 'Mastery of genuine constellation-lore is the perfect substrate for a manufactured faith.' },
      { classId: 'harbinger', bridge: 'Academics who model the dimming of the constellation-spirits slide naturally into the doom-arithmetic.' }
    ],
    tensionPairings: [
      { classId: 'berserker', tension: 'A scholar tempered by crystal archives and throat-sung theory rarely survives the Blood-Heat.' }
    ],
    name: 'Synod Academic',
    description: 'The Synod-Hold rises from the Sundrift steppe like a crystal thorn, its lattice-walls singing when the wind finds the right key. You studied there, learning to read the constellation-spirit lineages that the Astril have carried since the first ancestors knelt in the stone circles and received the stars into their chests. The crystal-lattice archives preserve every spirit-lineage that still burns. You learned the forbidden Sky-Songs, the throat-sung maps of stars that went dark when the Ordavan bargain was struck. You catalogued star-lineages carved on bone Steppe-Staves, learned to bypass the basalt Cairn-Checkpoints, and navigate Starfall Vale where the dead constellations fall. You learned to identify the Unlit Veil\'s spies inside the Synod itself. The constellation-spirits are fading. Every season, another lineage goes dark, another song loses its referent. The Synod studies the archives while the stars go out. You have the training to read the patterns. Whether you use it to preserve what remains or to understand what is killing the sky is the choice the steppe has laid at your feet.',
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
      name: 'Constellation-Archive',
      description: 'You memorized portions of the Synod\'s crystal-lattice archives and can decode bone Steppe-Staves. You can recall obscure celestial history, identify constellation-spirit traces, and recognize the resonance-signatures of the seven Sundered Monoliths. Academic and religious institutions grant you research access.'
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
      { classId: 'berserker', bridge: 'The Hunger Pact lives in a Sumps Veteran blood; the Blood-Heat is its combat expression.' },
      { classId: 'warden', bridge: 'Frozen Archive proximity and geothermal-tunnel warfare are the surgical-graft on-ramp into the Bound.' },
      { classId: 'augur', bridge: 'A veteran of the glacier defenses has plenty of preserved dead to read at the Frozen Archive.' }
    ],
    tensionPairings: [
      { classId: 'false_prophet', tension: 'A veteran earned every scar in real combat; manufactured faith tastes like insult to someone who bled for truth.' }
    ],
    name: 'Sumps Veteran',
    description: 'The Bloodhammer Sump breeds soldiers the way a wound breeds salt. You fought in its geothermal skirmishes, or the War of Thousand Screams, or the endless defense of the Hunger Glaciers. Every Skald soldier carries the Hunger Pact in their blood: ancestral starvation from the Hunger Winter, the three-year blizzard that followed the Glacier Bargain, when the ancestors consumed their own dead to survive. The pact turns that memory into fury when the fighting starts. The Frost-Tithe takes its share from every family. It took someone you loved. You learned to fight in geothermal vents where the air burns and the cold above kills just as fast, through the First Thermal War and every sump-skirmish since. Now the glaciers are advancing again, and the Hunger Pact still hums beneath your skin when the fighting nears. The dead who fed your bloodline gave you their fury so you would survive. It falls to you to decide what that fury is for.',
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
    description: 'In Atropolis, everything has a price and every price is negotiable. You studied the First Contract and Neth legal tradition in the canopy city\'s contract-halls, guiding clients through Regent Morrath\'s Great Registry and the peonage the Scribe-Cartel enforces. In the Bryngloom, debt is a living thing: every agreement binds, every handshake traps, and the Postmortem Corvee can conscript your corpse if you die in default. You negotiated Memory-Glass Covenants for clients desperate to buy extra years. You learned to read a Neth contract by its silver-leaf binding and to spot the trap-clauses that bind the unwary. And you memorized the cautionary tale every negotiator learns: Saren-Vel, the greatest contract-lawyer of her generation, who burned her own name from the Contract and became the first of the Drun, legally nonexistent, living in the Over-Shanty beyond the reach of every law she once mastered. The contract-halls are busier than ever. The Keeper of the Last Threshold waits beneath the roots, patient as the mycelium, and the debt-economy grows. You have the silver tongue and the eye for loopholes. It falls to you to decide whose contracts hold and whose names burn.',
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
      { classId: 'arcanoneer', tension: 'The oral archive and the written contract are rival memory-systems; a Frost Chanter trusts song where an Arcanoneer trusts filing.' }
    ],
    name: 'Frost Chanter',
    description: 'In Nordhalla, Jarn-Tand\'s Runic Academies burn every old drum they find. So the old ways moved into the only instrument they could not confiscate: the voice. You trained as a Frost Chanter, weaving animist history into verse so dense the inquisitors hear a drinking-song and never suspect they are listening to a heresy eight centuries old. Each performance is a hidden archive. Each chorus shields the Fredlose from the Frost-Tithe\'s despair and the Academies\' erasure. In a land where the written rune is law and the spoken song is contraband, your voice is a covert hearth where the old ways still burn. The Glacier Bargain and the Hunger Winter that followed birthed the first chants; every chanter since has added a verse. The Academies are listening closer now, and the Fredlose are fewer every winter. You carry the last songs of a people the cold is slowly silencing. It falls to you to keep the verse alive, or let the old ways freeze with the last voice that remembers them.',
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
      { classId: 'spellguard', bridge: 'The Damon tradition treats magical defense as forge-engineering; a Forge Wright is already half-trained.' },
      { classId: 'warden', bridge: 'Chain-craft and gear-work are the mechanical backbone of the chain-graft surgical tradition.' },
      { classId: 'berserker', bridge: 'Skald and Thrask forge-workers who absorbed enough forge-heat sometimes find the Blood-Heat igniting on its own.' }
    ],
    tensionPairings: [
      { classId: 'plaguebringer', tension: 'The sterile forge and the cultivated bog-disease are opposite relationships to material, creation versus decay.' }
    ],
    name: 'Forge Wright',
    description: 'Metal remembers. Every hammer-strike, every quench, every fold of alloy is a record that outlasts the hand that made it. You apprenticed at one of the great forges: Harath-Vault beneath Emberspire, the Bloodhammer Sump\'s geothermal foundries, or the iron halls of Ironjaw Port. There you learned to read the record the way a scribe reads ink. You understand metal as living memory. Every alloy is a conversation between elements; every forge-mark, a signature. At Gearworks Gulch in the Cragjaw Peaks, you studied clockwork engineering from Fexric artisans whose gear-teeth cut as clean as their grievances. At Sol\'s Anvil Mesa in Sundale, Solvarn sun-priests still work ceremonial metal with techniques passed down from the Binding. The forges are failing. Fuel runs low, ore-veins thin, and the old guild-marks lose their meaning as fewer smiths survive to teach them. You carry the grammar of metal in your hands. It falls to you to keep the old marks honest, or let the forge-knowledge die with the last smiths who remember what the hammers used to say.',
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
    name: 'Hush Survivor',
    description: 'You watched the hush take someone you loved. First the Ghost-Mycelium darkened their veins. Then it dissolved their mind. Then it drew them into the Hush-Bogs to join the Spores-Born, the mindless fungal-puppeted dead who drift the bog\'s edge. You retreated into seclusion and fortified your mind against the hush\'s seduction, brick by brick, until the song could not reach you. It almost worked. The mycelium\'s song never fully fades. You hear it in the silence between thoughts, a low hum that promises warmth and cessation. The Over-Lit epidemic that scattered concentrated Ghost-Mycelium through every Neth trade-route made the hush a regional catastrophe, and the Hush-Bogs are fuller now than they have been in generations. You survived the hush when the person beside you did not. That survival left a mark the mycelium recognizes. You know the early signs, the darkening veins, the far-away stare, the warmth that is not warmth. It falls to you to spot the infection before it takes another voice you know.',
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
    name: 'Peak Tracker',
    description: 'The Cragjaw Peaks are a vertical labyrinth where the blizzard rewrites every path within hours of it being carved. You navigated that labyrinth with knotted cord route-markers, mapping what the storm buries and re-buries. The calcified bone-bridges the Groven dead left behind are the only crossings that hold, and you learned to read their stress-fractures before committing your weight. You evaded the Rope-Garrison toll-posts, predicted the hunting grounds of Rime-Brides and Storm-Crows, and found safe passage through the steam-pipe junctions where heat-stealing Sump-Scrabs nest. Deepchasm Keep is your home, and from its walls you watched trackers who knew one route fewer than the storm take the wrong bridge. The peaks are getting colder, and the blizzard thicker. The bone-bridges the ancestors left are not being replaced. You carry the routes in your knotted cord, the only map that outlasts the storm. It falls to you to find the passage, or watch your companions learn why the Groven carved their memorials into the spans.',
    skillProficiencies: ['Athletics', 'Survival'],
    toolProficiencies: ['Musical instrument'],
    languages: 1,
    equipment: [
      'Climbing rope (silk, 50ft)',
      'Pitons (10)',
      'Storm-cloak',
      'Knotted knotted cord route-markers',
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
        "breaker_myrathil",
        "deep_myrathil",
        "river_myrathil"
      ],
      "hardBlocks": [
        "sylen_astril",
        "muren_astril"
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
    name: 'Merrow Sailor',
    description: 'The Iceheart Sea does not forgive debts, and the Board of Trade does not forget them. You sailed from Merrowport under Grand Admiral Varis Mereval\'s Sea-Charter, your arms inked with trade-tattoos that double as legal contracts. Every line of ink verifies a debt-share; every missing line is a gap the Press-Warrants can fill with lifetime service. You learned to slip the Unfreezing Booms, dodge the Luck-Ledger inquisitors who audit every sailor\'s skin for unpaid shares, and trade in Kelpie\'s Cove where the Brine-Bond Syndicate asks fewer questions. The Merryn tattooed their debts on their skin for centuries before the Syndicate formalized the practice. Now the ink is law, and the law is ink. The sea is freezing earlier every year, and the trade-routes the Sea-Charter protects are shrinking with the ice. You know the water, the wind, and the exact weight of ink on your skin. It falls to you to sail the routes that still pay, or find out what the Board of Trade does to a sailor whose tattoos run out before the debt does.',
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
    name: 'Gloomway Trader',
    description: 'The Bryngloom Forest trades in three currencies: memory-glass, peat-oil, and the years left in a lifespan. You ran goods across its root-tangled expanse under Regent Morrath\'s Great Registry, dealing in wyrd-warded curios and the covenants that bind them. The living-ironwood Toll-Dikes tax every road, but you learned the bypasses. You bargained with Drun smugglers beneath the canopy, traded lifelines at the Mist-Gate Market where a desperate soul will sell five years for a chest of peat-oil, and rested at Morren\'s Bogpost where the forest meets the steppe. Your ledger is warded against the Inquisition\'s audit. Every entry is legal, or at least defensibly ambiguous. The Registry tightens its tariffs every season, and the Drun routes grow more dangerous as the Root-Veil spreads and the old crossings rot beneath it. You know the prices, the paths, and the faces that pay. It falls to you to run the goods the law forbids, or watch the trade-routes close and the Forest go silent.',
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
      { classId: 'inquisitor', bridge: 'Knowing the supernatural underworld from below makes a Shanty Rat a devastating hunter when they turn.' }
    ],
    tensionPairings: [
      { classId: 'martyr', tension: 'A Shanty Rat survived by being invisible and unrecorded; the Vow demands they be seen and broken for others.' }
    ],
    name: 'Shanty Rat',
    description: 'The Over-Shanty hangs beneath Atropolis like a wound the canopy city refuses to acknowledge. You grew up in its rope-bridges and salvage-nests, one of the Forgotten: undocumented, unrecorded, legally nonexistent under Regent Morrath\'s Great Registry. The Registry tracks every name above. Below, the Shanty tracks only who can climb and who cannot. The slum coalesced from Drun outcasts, Morren defaulters, and merchants too desperate to check the drop. You learned which rope-bridges hold weight, how to slip past the Toll-Dike patrols, and how to bargain with Drun smugglers for black-market peat-oil. The memory-brokers know your face; the Registry never will. Atropolis thrives above, and the Shanty swells below, and the rope-bridges between them fray a little more every season. You were born outside the law. It falls to you to climb high enough to matter, or vanish into the mist like every Forgotten the Registry has already erased from the world.',
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
    name: 'Monolith Hunter',
    description: 'For centuries, the seven Sundered Monoliths stood silent, the shattered remnants of the seal that once bound Sol beneath the world. The Breach broke them: when Keth-Amar consumed the six sacrificed heirs, the binding cracked and the fragments scattered across every region. They hummed quietly for generations. No one bothered to listen. Now they are waking. All seven at once, their resonance rising, and the song is getting louder. You track that resonance across the frozen world with cold iron stakes to ground the Wyrd-echoes and a journal of fragment-locations that certain powers would kill to possess. The monoliths were silent for the better part of eight centuries. Whatever changed, it changed recently, and it is still changing. You carry the only map that tracks all seven fragments, and the powers who want it do not negotiate. It falls to you to reach the next Monolith before they do, and to decide whether the waking should be hastened, halted, or understood.',
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
        "unshorn_briaran",
        "smoothskinned_briaran"
      ],
      "narrativeUnlock": true,
      "justification": "Grove-Wardens swear the fae counter-bargain in the moonlit groves of the Frostwood Reach, a Briaran bloodline obligation. An outsider could plausibly be sworn to the grove through adoption or an unpaid life-debt."
    },
    classHooks: [
      { classId: 'lunarch', bridge: 'The moonlit groves a Grove Warden patrols are the only place the lunar parasite is found; the patrol and the pact are one career.' },
      { classId: 'toxicologist', bridge: 'Thorn-blood and ghost-metal cold-working are the Briaran foundation of the Distillery craft.' }
    ],
    tensionPairings: [
      { classId: 'martyr', tension: 'The fae bargain is fundamentally transactional; the Vow asks for uncompensated self-destruction. A Grove Warden turned Martyr has betrayed one covenant for another.' }
    ],
    name: 'Grove Warden',
    description: 'There were eight houses, not seven. The histories will tell you otherwise. The histories are wrong. You swore the old fae bargain in the moonlit groves of the Frostwood Reach, binding yourself to the Hollow-Court and the ironwood hollows where House Viridane sealed its counter-pact when the other houses marched their heirs to Keth-Amar. Viridane refused. Viridane ran. Viridane survived, in you and every Briaran who carries the thorns. You tend the Thorn-Fall, where eight centuries of shed thorns record every unfulfilled promise the fae have witnessed. You mine ghost-metal from the cold vein beneath the deep groves and enforce the fae\'s old laws against the quiet expeditions the other families send to strip what Viridane left behind. Smooth-Skinned wardens carry their oath hidden beneath borrowed names. Unshorn wardens wear their thorns openly, the only proof anywhere in the world that House Viridane existed. The families\' expeditions are growing bolder, and the Thorn-Fall is growing heavier with broken promises. You carry Viridane\'s last counter-pact in your blood and its law in your thorns. It falls to you to hold the grove, or watch the final proof of the eighth house rot into the Frostwood floor.',
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
      description: 'You carry the fae\'s old laws written in your flesh. Once per long rest, you may witness a spoken oath between two willing creatures and invoke the grove\'s old law: if either party breaks the oath within a year, you sense the breaking immediately and the oathbreaker cannot hide from your Insight checks for one month. Briaran recognize you by your thorn-clusters (or your hidden token); fae-touched creatures and the Smooth-Skinned community provide you shelter in exchange for a small thorn-tithe.'
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
        "maskborne_mimir",
        "mistwoven_mimir",
        "unwoven_mimir"
      ],
      "narrativeUnlock": true,
      "justification": "Mask-Wardens train in the Fog-Vales to recover stolen masks and turn back the Hunters. A non-Mimir could be sworn in only through a deep act of protection, and even then, the mistrust outlasts the oath."
    },
    classHooks: [
      { classId: 'apex', bridge: 'Reading spore-trails and fog-silence is the native tracking art of the Silent Hunt.' },
      { classId: 'shaper', bridge: 'A Mimir who defends masks understands form and identity deeply, the substrate of the Shaping Forms.' },
      { classId: 'toxicologist', bridge: 'Floor-toxin brewing and intruder-detection are the Unwoven half of the Distillery.' }
    ],
    tensionPairings: [
      { classId: 'berserker', tension: 'A Mask Warden exists to preserve fixed identity; the Blood-Heat dissolves it. The two are philosophical opposites, and a Mimir cannot be a Berserker anyway.' }
    ],
    name: 'Mask Warden',
    description: 'The Mimir\'s masks are relics, and the Hunters pay fortunes for them on the black collector\'s market. You stand between the mask-wearers and the cartels that hunt them. You patrol the fog-spider-silk rope-bridges of the Spire-Aeries, watch the Watch-Bells for the next alarm, and track the detection-magicians who probe the Vales with ever-refining glass-cutters. The Mimir Purge took the birthing chambers and the last Mask-Mothers with them. The Rupture that followed restricted every surviving mask to a first-born heir, and the mothers who could have made more are ashes. Since then, Mask-Wardens have guarded what remains. Whether you are Mask-Borne aristocrat, Mist-Woven cliff-sentinel, or Unwoven floor-guide, you learned to read the spore-trails intruders leave and the silence the fog carves when an outsider moves through it. The Hunters are better funded than they have been in generations, and every mask that falls feeds a collection that grows bolder. You know their methods because you have buried the ones who got careless. It falls to you to hold the Vales, or watch the last masks disappear into glass cases in cities that will never understand what they stole.',
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
      description: 'You have learned how the Hunters track Mimir and how to turn that tracking back on them. Once per long rest, when you observe a creature using detection magic, scrying, or mundane tracking against you or a masked ally, you may turn the method against its user: for 1 hour, the tracker has disadvantage on all Perception and Investigation checks, and you know their general direction. Mist-Woven wardens along the Spire-Aeries and Unwoven guides on the deep floor will shelter you and pass warning of Hunter movements.'
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
      "justification": "The guild-vaults and underground academies are Fexric-specific institutions. Kethrin study in formal academies; Drall learned in secret before being expelled."
    },
    classHooks: [
      { classId: 'chronarch', bridge: 'Temporal-mechanics and gear-craft blueprints are the Kethrin foundation of the Chronarch engine.' },
      { classId: 'warden', bridge: 'Chain-graft gear-work and surgical-engineering literacy are the Fexric path into the Bound.' }
    ],
    tensionPairings: [
      { classId: 'animist', tension: 'A Vault Scholar treats the world as a mechanism; an Animist treats it as a conversation. The two frames cannot share a skull.' }
    ],
    name: 'Vault Scholar',
    description: 'Deep in the Fexric warrens, behind sealed blast-doors, the guild-vaults keep their knowledge on copper-plate codices: precision gear-craft, temporal mechanics, the ancestral binding theory that makes both possible. You trained in those vaults. Whether Kethrin or Drall, you learned the same grammar of gears, and it marked you for life. Kethrin scholars spend decades memorizing proprietary blueprints under the Master Craft-Guilds\' supervision, every formula earned, catalogued, and owned. Drall dropouts learned enough before expulsion to be dangerous. They carry stolen fragment-pages stitched into their clothing, half-understood theories they improvise into working machines that sometimes work. The guild-vaults are closing their doors as the Cragjaw blizzard deepens and the old thermal-pipes freeze. What you memorized, no blast-door can lock away. It falls to you to build what the warrens need, or improvise what the vaults refuse to share.',
    skillProficiencies: ['Arcana', 'Investigation'],
    toolProficiencies: ['Artisan\'s tools (tinkerer\'s)', 'Thieves\' tools'],
    languages: 1,
    equipment: [
      'Copper-plate codex (water-damaged for Drall, pristine for Kethrin)',
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
      description: 'You carry the structural grammar of Fexric engineering in your mind. You can identify any mechanical or clockwork device\'s origin-guild, approximate age, and intended function by inspection alone. Once per long rest, you can reverse-engineer a minor mechanism (lock, trap trigger, gear assembly) after 10 minutes of study. Kethrin gain research access at recognized guild halls; Drall must rely on the underground salvage markets where their expired tokens still carry cachet.'
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
      { classId: 'martyr', tension: 'A Herd Guardian lives to keep the migration moving; the Vow demands they stop and be broken. Stillness is the enemy of the steppe.' }
    ],
    name: 'Herd Guardian',
    description: 'The Ordan follow the grass-line, and the grass-line runs from the frost. You guarded the migration herds across the Sundrift Vale, driving a hundred head of shag-ox through a circuit that never ends: ahead of the frost that claims the pasture, and back before the thaw rots what remains. The steppe kills the careless. You are not careless. You learned to read hoof-tracks in a blizzard, predict Wyrd-predator movements by the shift of the wind, and keep the herd moving when every instinct screams to shelter and wait. The herds are the Ordan\'s only wealth. Lose one animal to frost-collapse or a Wyrd-predator, and a family line starves for a generation. The grass-line is shrinking. The frost comes earlier every circuit, and the thaw rots more than it grows. You know the old routes, the safe grazes, the wind-signs that mean run. It falls to you to keep the herd alive, or watch the Ordan\'s last wealth freeze into the steppe.',
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
        "sylen_astril",
        "muren_astril"
      ],
      "narrativeUnlock": true,
      "justification": "The Luminarchy and its constellation-spirit traditions are Astril-specific institutions. Both Sylen (embracing) and Muren (suppressing) train in the same cathedral."
    },
    classHooks: [
      { classId: 'augur', bridge: 'Reading constellation-spirit stability and resonance-signatures is the Astril path into the augury.' },
      { classId: 'false_prophet', bridge: 'Genuine mastery of celestial resonance is the most convincing substrate for a manufactured faith.' },
      { classId: 'harbinger', bridge: 'Scholars who model the constellation-spirits fade into the doom-arithmetic of the Doom-Choir.' }
    ],
    tensionPairings: [
      { classId: 'berserker', tension: 'Crystal-archive discipline and the Blood-Heat fury cannot coexist in the same nervous system.' }
    ],
    name: 'Starbound Scholar',
    description: 'Every Astril carries a constellation-spirit in their chest, and the Luminarchy governs that marriage of star and flesh. You trained under its hierarchy, learning the crystal-lattice techniques that keep celestial resonance from burning the host alive. Whether Sylen, who embraces the passenger\'s wild power, or Muren, who cages it behind mental discipline, you studied the same disciplines and survived them. You catalogued spirit-lineages on memory-glass, learned the forbidden Sky-Songs that map the constellations that have already gone dark, and trained to recognize the resonance-signatures of a constellation-spirit approaching the Unlit threshold. Beyond that threshold, the spirit consumes the host, and the Luminarchy has no technique that brings either back. The constellation-spirits are dimming. Every cycle, another host flickers toward the Unlit, and the Luminarchy\'s crystal techniques buy less time than they did a generation ago. You know the signs and the songs and the lattice-work that holds a star inside a ribcage. It falls to you to keep the spirits stable, or learn what happens when the last constellation goes dark.',
    skillProficiencies: ['Religion', 'Arcana'],
    toolProficiencies: ['Musical instrument (throat-singing bowl)'],
    languages: 2,
    equipment: [
      'Memory-glass shard (spirit-lineage encoded)',
      'Crystal resonance bowl',
      'Celestial chart (bone-etched)',
      'Luminarchy vestments',
      'Ritual incense (3 sticks)'
    ],
    startingCurrency: {
      gold: 8,
      silver: 12,
      copper: 0
    },
    feature: {
      name: 'Spirit-Resonance Reading',
      description: 'You can identify any constellation-spirit\'s lineage, power-level, and stability by observing its host\'s luminous patterns for one minute. Once per long rest, you can calm a constellation-spirit that is approaching the Unlit threshold (loss of control), granting the host advantage on their next Spirit saving throw. The Luminarchy provides sanctuary to recognized scholars, though Muren scholars are watched more carefully than Sylen.'
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
        "breaker_myrathil",
        "deep_myrathil",
        "river_myrathil"
      ],
      "narrativeUnlock": true,
      "justification": "The deep currents and pressure-dark are Myrathil-specific environments. Merryn sailors stay surface-level; Myrathil descend."
    },
    classHooks: [
      { classId: 'gambit', bridge: 'Reading current-temperature gradients and pressure-patterns is the Myrathil tide-probability half of the Gambit art.' },
      { classId: 'minstrel', bridge: 'The subsonic pressure-language of the abyss is the Deep-Born foundation of the Pressure-Cadence.' }
    ],
    tensionPairings: [
      { classId: 'warden', tension: 'A Deep Current Guide lives in fluid, shifting space; a Warden must be immovable stone. The abyss and the anchor are opposed vocations.' }
    ],
    name: 'Deep Current Guide',
    description: 'Beneath the Iceheart Sea\'s frozen surface, the water is still warm, and the Myrathil have always known it. You navigated the deep currents, the pressure-zones where light dies and the only maps are temperature-gradients felt through the skin. Down there, thermal vents glow against bioluminescent trench-walls, and things breathe in the dark water that remember the names of drowned sailors. You guided expeditions through the Ice Veins, the subsurface arteries where warm water still flows, and learned to read the deep-sea\'s silent language of pressure and temperature. The current-shift tells you where the ice above will crack. The silence tells you what is hunting beneath you. The cold-spots tell you where the things that remember are listening. The Ice Veins are narrowing as the surface freezes thicker every year, and the deep-currents are slowing. The abyss is patient, and it is learning the routes the Myrathil have used for generations. You know every current, every vent, every warm pocket the Ice Veins still hold open. It falls to you to guide the last expeditions through, or let the deep go silent with the sailors whose names the dark water keeps.',
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
        "maskborne_mimir",
        "mistwoven_mimir",
        "unwoven_mimir",
        "thalren_human",
        "unshorn_briaran"
      ],
      "narrativeUnlock": true,
      "justification": "Fog-reading requires intimate knowledge of the Frostwood\'s living fog, its memory-erasing properties, its Wyrd-trails, and its secret passages. Non-Frostwood natives have never survived long enough to learn."
    },
    classHooks: [
      { classId: 'apex', bridge: 'Tracing Wyrd-trails through the fog by touch and scent is the Mist-Woven and Mimir foundation of the Silent Hunt.' },
      { classId: 'lunarch', bridge: 'Fog-dense void-light is the exact medium the lunar parasite feeds on; a Fog Reader is standing in the Lunarch recruiting-ground.' },
      { classId: 'inquisitor', bridge: 'Reading Wyrd-currents and memory-erasure patterns is the Thalren anti-Wyrd half of the Barbed Vow.' }
    ],
    tensionPairings: [
      { classId: 'arcanoneer', tension: 'A Fog Reader trusts instinct and shifting currents; an Arcanoneer trusts pre-filed precision. The fog makes the latter impossible and the former essential.' }
    ],
    name: 'Fog Reader',
    description: 'The fog in the Frostwood Reach is not weather. It is a living geography that responds to the thoughts of those inside it, and it eats memory by the season. You read that fog the way a sailor reads the sea: tracing density shifts, memory-erasure currents, and the Wyrd-trails things leave when they pass through it. You learned by touch, scent, and the kind of instinct that keeps you alive when the map dissolves. The Mimir navigate the canopy by spore-scent and fog-spider silk markers. The Thalren chart fog-currents on ironwood staves. The Briaran feel the fog through their thorn-root connection to the forest floor, and where the mist pools deepest, their thorns ache with the memory of what it has swallowed. You learned to read all three, because the fog respects no single tradition. The fog is thickening. Every season it eats more, and the safe routes through the Reach shrink with it. You know the currents, the silk-trails, the places the mist pools when something is hunting. It falls to you to find the path the fog has swallowed, or lose your name to it like every traveler who trusted a map over the mist.',
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
  }
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
