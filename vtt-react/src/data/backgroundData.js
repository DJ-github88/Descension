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
 * OLD D&D SRD BACKGROUNDS (Phase 4 — commented out, replaced below)
 * ============================================================================
 * 
 * export const BACKGROUND_DATA = {
 *     acolyte: {
 *         id: 'acolyte',
 *         name: 'Acolyte',
 *         description: 'You have spent your life in service to a temple, learning sacred rites and providing sacrifices to the god or gods you worship.',
 *         skillProficiencies: ['Insight', 'Religion'],
 *         languages: 2,
 *         equipment: ['Holy symbol', 'Prayer book', 'Incense (5 sticks)', 'Vestments', 'Common clothes'],
 *         startingCurrency: { gold: 12, silver: 8, copper: 0 },
 *         feature: { name: 'Shelter of the Faithful', description: 'You and your companions can receive free healing and care at temples, shrines, and other religious establishments.' },
 *         statModifiers: { spirit: 3, intelligence: -1 }
 *     },
 *     criminal: { ... },
 *     folkHero: { ... },
 *     noble: { ... },
 *     sage: { ... },
 *     soldier: { ... },
 *     charlatan: { ... },
 *     entertainer: { ... },
 *     guildArtisan: { ... },
 *     hermit: { ... },
 *     outlander: { ... },
 *     sailor: { ... },
 *     merchant: { ... },
 *     urchin: { ... },
 *     scholar: { ... }
 * };
 */

export const BACKGROUND_DATA = {
    emberspirePilgrim: {
        id: 'emberspirePilgrim',
        name: 'Emberspire Pilgrim',
        description: 'You made the pilgrimage to Emberspire, witnessing the Solbrand\'s fading light under the watchful gaze of Hierophant Aethelgard\'s Dawn Vigil. You have passed through the Obsidian Citadels of the Ashen Escarpment where Ash-Dwellers are held in bondage, and either joined the Vigil\'s crusade for the Reforging or left with gnawing doubt. At Ember Lagoon, pilgrims ship out under the Dawn Vigil’s banner to spread the call of the sun\'s rebirth.',
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
        name: 'Shyr Runner',
        description: 'You navigated the ninety-mile Basalt Shyr, running caravans of volcanic sulfur and geothermal coal under the shadow of the Sulfur Cartel\'s monopoly. You learned when the basalt pillars shift, where magma-fracturing sumps tear open reality, and how to evade the Dawn Vigil patrols at the escarpment checkpoints. Slag Gulch serves as a resupply point where runners dodge the labor-levies, and at Ember Lagoon, Cartel cargo is smuggled onto Merryn ships.',
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
        name: 'Ledger Keeper',
        description: 'You maintained identity-ledgers at Greymark Keep in the Frostwood Reach under the Sovereign Ledger enforced by Jarl-Archivist Kaelen Thalreth. In a land where the protective fog erases memory and the Scribe-Cartel holds a monopoly on Soot-Resin Ink and Peat-Parchment, your chained journals are the only proof of legal citizenship. You have checked papers at the Ironwood Palisade checkpoints, catalogued lineages at Greythorn Copse, and researched the prehistoric carvings of Mistbarrow.',
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
        name: 'Bloodline Heir',
        description: 'You descend from one of the seven noble houses that struck the Dark Bargains — Thalreth, Skalvyr, Solvan, Mereval, Tesshan, Ordavan, or Morrath. The weight of ancestral sacrifice shapes every decision you make, though your family\'s influence has long since fractured beneath the consequences of those bargains. (The Bryngloom\'s bargain was unique: it was struck not by House Morrath, but by the Neth\'s own ancestors — a fact the remaining houses prefer to forget.)',
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
        name: 'Synod Academic',
        description: 'You studied at the Synod-Hold in Sundrift Vale — the shimmering crystal-lattice Astril cathedral where constellation-spirit lineages are preserved. You learned to decipher the forbidden, throat-sung Sky-Songs that map stars that went dark under the Ordavan bargain, and catalogued star-lineages carved on bone Steppe-Staves. You know how to bypass the basalt Cairn-Checkpoints, how to navigate Starfall Vale, and how to identify the Unlit spies of the Synod.',
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
        name: 'Sumps Veteran',
        description: 'You fought in the Bloodhammer Sump\'s geothermal skirmishes, the War of Thousand Screams, or the endless defense of the Hunger Glaciers. The Hunger Pact lives in your blood — ancestral starvation channeled into combat fury — and the Milk-Grief may have taken someone you loved.',
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
        name: 'Debt Negotiator',
        description: 'You studied the First Contract and Neth legal traditions in Atropolis, helping clients navigate Regent Morrath\'s Great Registry and the Scribe-Cartel’s peonage. You understand that in Bryngloom, debt is a living thing: every agreement is a binding clause, every handshake a potential trap, and the Postmortem Corvée can conscript your corpse if you default. You help negotiate Memory-Glass Covenants to purchase extra years of life.',
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
        name: 'Frost Chanter',
        description: 'You trained in Nordhalla\'s oral-history traditions, where song preserves what Járn-Tand\'s runic inquisitors seek to burn. Your performances are literally history-keeping rituals — each verse a hidden archive of the old animist ways, each chorus a shield against both the Milk-Grief\'s despair and the Runic Academies\' erasure. In a land where the old drums are outlawed, the Frost Chanter\'s voice is a covert hearth for the Fredløse.',
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
        name: 'Forge Wright',
        description: 'You apprenticed in the Harath-Vault\'s great forges beneath Emberspire, the Bloodhammer Sump\'s geothermal foundries, or the iron-working halls of Ironjaw Port. You understand metal not as dead material but as living memory — every hammer-strike recorded, every alloy a conversation between elements. At Gearworks Gulch in the Cragjaw Peaks, forge-workers learn clockwork engineering from Fexrick artisans, and at Sol\'s Anvil Mesa in Sundale, a forge-complex operated by Solvarn sun-priests produces ceremonial metalwork using techniques passed down since the Binding.',
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
        name: 'Hush Survivor',
        description: 'You lived in seclusion after witnessing the fungal hush claim someone you loved — watching Ghost-Mycelium darken their veins, dissolve their mind, and draw them into the Hush-Bogs as a mindless Spores-Born. You fortified your mind against the hush\'s seduction through isolation, but the mycelium\'s song never fully fades.',
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
        name: 'Peak Tracker',
        description: 'You navigated the Cragjaw Peaks\' vertical labyrinth, carrying knotted khipu route-markers to map pathways that the blizzard buries within hours. You learned to read the calcified bone-bridges, evade the Rope-Garrison toll-posts, and predict the hunting grounds of Yuki-Onna and Tengu-Crows. Deepchasm Keep is your home, and you know how to bypass the steam pipe junctions where heat-stealing Sump-Kappas nest.',
        skillProficiencies: ['Athletics', 'Survival'],
        toolProficiencies: ['Musical instrument'],
        languages: 1,
        equipment: [
            'Climbing rope (silk, 50ft)',
            'Pitons (10)',
            'Storm-cloak',
            'Knotted khipu route-markers',
            'Travel rations (5 days)'
        ],
        startingCurrency: {
            gold: 7,
            silver: 18,
            copper: 0
        },
        feature: {
            name: 'Ancestor-Span Reader',
            description: 'You can read the calcified warnings left by Groven dead in the bridge-spans — stress fractures, toll-marks, and memorial grooves. You have advantage on Survival checks in mountainous and high-altitude terrain, and you can always find safe passage across an Ancestor-Span. The mountain has no mercy, only lessons you have already learned.'
        },
        statModifiers: {
            constitution: 2,
            spirit: 2,
            charisma: -2
        }
    },

    merrowSailor: {
        id: 'merrowSailor',
        name: 'Merrow Sailor',
        description: 'You sailed the Iceheart Sea from Merrowport, navigating under the shadow of the Brine-Bond Syndicate and Admiral Varis\'s Sea-Charter. Your trade-tattoos are legal contracts inked on your skin to verify your debt-shares and prevent you from being pressed into lifetime service under the Board of Trade\'s Press-Warrants. You know how to slip past the Unfreezing Booms, how to dodge the Luck-Ledger inquisitors, and how to trade in Kelpie\'s Cove.',
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
        name: 'Gloomway Trader',
        description: 'You traded goods across the Bryngloom Forest, dealing in memory-glass covenants, peat-oil, and wyrd-warded curios under Regent Morrath\'s Great Registry. You learned to bypass the living-ironwood Toll-Dikes, negotiate with Drun smugglers, and trade at the Mist-Gate Market where lifelines are currency. Morren\'s Bogpost at the forest-steppe border is your frequent trade stop, and you carry a ledger warded against the Inquisition\'s audit.',
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
        name: 'Shanty Rat',
        description: 'You grew up in the Over-Shanty — the hanging slum beneath Atropolis\'s high canopy city. Having no record in Regent Morrath\'s Great Registry, you survived as one of the undocumented "Forgotten" among salvage, smugglers, and memory-brokers. You learned which rope-bridges hold, how to slip past the Toll-Dike patrols, and how to bargain with Drun outcasts for black-market peat-oil.',
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
            description: 'You know the secret pathways of the Over-Shanty\'s hanging slums — which rope-bridges hold weight, how to slip past the Toll-Dike checkpoints, and where Drun outcasts hide from the Registry-guard. You can navigate any hanging or vertical settlement at twice the normal speed.'
        },
        statModifiers: {
            agility: 3,
            strength: -1
        }
    },

    monolithHunter: {
        id: 'monolithHunter',
        name: 'Monolith Hunter',
        description: 'You track the seven Sundered Monoliths — the shattered fragments of Sol\'s original binding seal — as their resonance shifts across the frozen world. The monoliths are waking up after centuries of silence, and their song is getting louder. You carry cold iron stakes to ground Wyrd-echoes and a journal of fragment-locations that certain powers would kill to obtain.',
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
