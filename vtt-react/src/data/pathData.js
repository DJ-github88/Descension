/**
 * Character Path Data Module
 *
 * Defines the 9 character paths for the character creation wizard:
 * The Vessel, The Bound, The Unseen, The Scarred, The Archive-Sworn,
 * The Indebted, The Frostborn, The Wayfarer, The Threshold-Watcher
 *
 * Each path provides:
 * - Stat modifiers (point allocation bonuses)
 * - Skill proficiencies
 * - Starting equipment
 * - Special features
 * - Thematic description tied to Mythrill's lore
 */

export const PATH_DATA = {
    vessel: {
        id: 'vessel',
        name: 'The Vessel',
        description: 'You have been entered by something older than yourself — a constellation-spirit, a Wyrd-fragment, a bog-presence. You carry a passenger in your blood, and it speaks in frequencies only you can hear. The Astril call this opening the vessel; the Neth call it a breach of contract. Both are correct.',
        icon: 'fas fa-eye',
        statModifiers: {
            intelligence: 1,
            spirit: 2,
            charisma: 1
        },
        skillProficiencies: ['Arcana', 'Insight'],
        toolProficiencies: ['Alchemist\'s supplies'],
        languages: 2,
        startingEquipment: [
            'Throat-singing cord',
            'Stelequarts lens-shard',
            'Star-patterned felt wrap',
            'Memory-crystal (blank)',
            'Wind-leather satchel',
            'Belt pouch with 20g'
        ],
        feature: {
            name: 'Passenger\'s Whisper',
            description: 'The presence inside you grants glimpses beyond mortal perception. Once per day, you can gain advantage on any Spirit check or sense magical auras within 30 feet. The passenger may also offer unsolicited advice — not all of it helpful.'
        },
        startingPoints: 2
    },

    bound: {
        id: 'bound',
        name: 'The Bound',
        description: 'You have sworn a binding oath — to the Keeper, to the Luminarchy, to the Solbrand, or to a personal vow so deep it has become metaphysical. A contract is the most sincere form of love because it says you are willing to be bound in a way the world must enforce. Your word is iron. Your debt is eternal.',
        icon: 'fas fa-scroll',
        statModifiers: {
            strength: 1,
            constitution: 1,
            spirit: 2
        },
        skillProficiencies: ['Intimidation', 'Religion'],
        toolProficiencies: ['Calligrapher\'s supplies'],
        languages: 1,
        startingEquipment: [
            'Memory-glass tablet (blank)',
            'Keeper\'s clause-scroll',
            'Bog-iron ink pot',
            'Contract-sealed vestments',
            'Wind-leather cloak',
            'Belt pouch with 15g'
        ],
        feature: {
            name: 'Keeper\'s Clause',
            description: 'Your binding oath protects you at the threshold between life and death. Once per day, when you would be reduced to 0 hit points, you can choose to drop to 1 hit point instead — but you incur a debt that must be honored before the next moon or suffer the Keeper\'s attention.'
        },
        startingPoints: 1
    },

    unseen: {
        id: 'unseen',
        name: 'The Unseen',
        description: 'You operate in the gaps of the system — where contracts don\'t reach, where patterns don\'t glow, where the obligation-web is thin. The Unlit Astril can lie without their skin betraying them. The Fexrick Clan-Free survive by scavenging what the guilds discard. You are neither. You are worse: you are competent.',
        icon: 'fas fa-mask',
        statModifiers: {
            agility: 2,
            intelligence: 1,
            charisma: 1
        },
        skillProficiencies: ['Deception', 'Stealth'],
        toolProficiencies: ['Thieves\' tools', 'Disguise kit'],
        languages: 1,
        startingEquipment: [
            'Unlit veil-mask',
            'False signet ring',
            'Memory-crystal (stolen)',
            'Set of fine clothes',
            'Fiber-cord garrote',
            'Belt pouch with 25g'
        ],
        feature: {
            name: 'Exposure Track',
            description: 'You can attempt to convince, distract, or misdirect even initially suspicious targets. However, each use advances an internal Exposure counter — when maxed, your presence becomes known to the systems you\'ve been evading. Lay low to reset.'
        },
        startingPoints: 1
    },

    scarred: {
        id: 'scarred',
        name: 'The Scarred',
        description: 'You survived something that should have destroyed you — a vat, a Wyrd-attack, the Fading, the Over-Sung. You are scarred in ways that give you insight into darkness but cost you connection to the living. The Groven Vat-Breakers carry this. The Morren debtors carry this. You carry this.',
        icon: 'fas fa-skull',
        statModifiers: {
            constitution: 2,
            spirit: 1,
            charisma: -1
        },
        skillProficiencies: ['Intimidation', 'Survival'],
        toolProficiencies: ['Herbalism kit'],
        languages: 1,
        startingEquipment: [
            'Memento of survival (vat-glass shard, burned contract fragment, or Wyrd-scar tissue)',
            'Weathered wind-leather cloak',
            'Survival gear',
            'Herbalism kit',
            'Common clothes (worn)',
            'Belt pouch with 10g'
        ],
        feature: {
            name: 'Hardened Soul',
            description: 'Your brush with annihilation has made you resistant to fear and despair. You have advantage on saving throws against being frightened, and you can help others overcome their fears through your presence — though your muted affect makes this feel hollow.'
        },
        startingPoints: 0
    },

    archive_sworn: {
        id: 'archive_sworn',
        name: 'The Archive-Sworn',
        description: 'You are a scholar who has gained knowledge through direct neural transmission — memory-glass, celestial frequency, or monolith-resonance — not through books. The Neth Canopy-Ledger holds contracts in crystallized tree-sap. The Emberth sun-records are sung into obsidian. The Frozen Archive preserves the dead\'s final visions. You have touched one of these. It changed you.',
        icon: 'fas fa-book',
        statModifiers: {
            intelligence: 2,
            spirit: 2
        },
        skillProficiencies: ['Arcana', 'History'],
        toolProficiencies: ['Calligrapher\'s supplies'],
        languages: 3,
        startingEquipment: [
            'Memory-glass tablet (inscribed)',
            'Canopy-quill',
            'Archive-access credential',
            'Scholarly robes',
            'Fiber-cord ledger',
            'Belt pouch with 30g'
        ],
        feature: {
            name: 'Archive-Trance',
            description: 'Your direct knowledge-link grants deep insight into Mythrill\'s lore. You have advantage on checks to understand magical phenomena, decipher ancient writings, or recall regional history. You must spend 1 hour per day in trance or lose this benefit until your next rest.'
        },
        startingPoints: 3
    },

    indebted: {
        id: 'indebted',
        name: 'The Indebted',
        description: 'You have made a bargain with something dangerous — Keth-Amar, a Wyrd-entity, the Keeper, Scathrach — and the debt is still outstanding. Every region made a Dark Bargain. Yours was personal. Your power comes from the creditor, and the creditor is patient.',
        icon: 'fas fa-handshake',
        statModifiers: {
            intelligence: 1,
            spirit: 1,
            charisma: 2
        },
        skillProficiencies: ['Arcana', 'Deception'],
        toolProficiencies: ['Poisoner\'s kit'],
        languages: 2,
        startingEquipment: [
            'Cursed trinket from the bargain',
            'Ritual dagger',
            'Creditor\'s ledger (partial)',
            'Hooded cloak',
            'Bog-iron ink pot',
            'Belt pouch with 15g'
        ],
        feature: {
            name: 'Debt Track',
            description: 'You can place a minor hex on a target, giving them disadvantage on their next check or saving throw. Each use advances your Debt Track — at certain thresholds, you lose HP, suffer max HP reduction, or trigger a creditor visitation that cannot be avoided.'
        },
        startingPoints: 2
    },

    frostborn: {
        id: 'frostborn',
        name: 'The Frostborn',
        description: 'You come from a warrior tradition shaped by extreme cold and survival against impossible odds. The Skald of Nordhalla encase their dead in glacier-tombs. The Bloodhammer clans forge weapons in geothermal sumps. The Morgh warriors of the Cragjaw Peaks grow bridges from their own calcified bones. Violence is not a choice where you come from. It is the climate.',
        icon: 'fas fa-snowflake',
        statModifiers: {
            strength: 2,
            constitution: 2,
            charisma: -1
        },
        skillProficiencies: ['Athletics', 'Survival'],
        toolProficiencies: ['Smith\'s tools'],
        languages: 0,
        startingEquipment: [
            'Battle-worn weapon (glacier-tempered)',
            'Glacier-tomb shard trophy',
            'Heavy wind-leather armor',
            'Traveler\'s clothes',
            'Whetstone (frost-cracked)',
            'Belt pouch with 20g'
        ],
        feature: {
            name: 'Battle Fury',
            description: 'In combat, you can enter a state of cold fury. Once per day, you gain advantage on all melee attack rolls for one round, but you take a -2 penalty to Armor until your next turn. You also have resistance to rime damage while the fury is active.'
        },
        startingPoints: 0
    },

    wayfarer: {
        id: 'wayfarer',
        name: 'The Wayfarer',
        description: 'You are a professional traveler, guide, or toll-keeper who knows the routes between regions. The Ordan nomads solved the problem of a starless sky by memorizing the ground. The Ancestor-Span toll-keepers charge passage in bones and promises. The River-Fed Myrathil explore freshwater routes no map records. Your value lies in knowing how to get from here to there alive.',
        icon: 'fas fa-route',
        statModifiers: {
            strength: 1,
            agility: 1,
            constitution: 1,
            intelligence: 1
        },
        skillProficiencies: ['Survival', 'Persuasion'],
        toolProficiencies: ['Navigator\'s tools', 'Vehicles (land)'],
        languages: 1,
        startingEquipment: [
            'Ancestor-map (throat-sung cord-record)',
            'Toll-token from each region',
            'Fiber-cord ledger',
            'Traveler\'s clothes',
            'Waystation credential',
            'Belt pouch with 25g'
        ],
        feature: {
            name: 'Route Network',
            description: 'You have contacts at toll-stations, ports, and waystations across the regions. You can find safe passage, locate guides, and access trade routes that are closed to outsiders. Your knowledge of terrain reduces overland travel time by 25% in any region you have previously visited.'
        },
        startingPoints: 1
    },

    threshold_watcher: {
        id: 'threshold_watcher',
        name: 'The Threshold-Watcher',
        description: 'You guard a boundary — physical, spiritual, or metaphysical. The threshold between regions, between life and death, between the pact and the void. A Muren who maintains their rituals is a fortress; a Muren who falters is a bomb. You do not falter.',
        icon: 'fas fa-shield-alt',
        statModifiers: {
            constitution: 1,
            spirit: 2,
            charisma: 1
        },
        skillProficiencies: ['Insight', 'Perception'],
        toolProficiencies: ['Mason\'s tools'],
        languages: 1,
        startingEquipment: [
            'Guardian\'s badge (region-specific)',
            'Signal horn',
            'Chain mail (Fexric-reforged)',
            'Traveler\'s clothes',
            'Fiber-cord rope (50 feet)',
            'Belt pouch with 15g'
        ],
        feature: {
            name: 'Threshold Seal',
            description: 'Your training has sharpened your awareness beyond normal limits. You cannot be surprised while conscious, and you can keep watch for twice as long without suffering exhaustion. Once per day, you can seal a doorway or threshold for 1 minute, preventing passage by any means short of teleportation.'
        },
        startingPoints: 1
    }
};

export const getPathData = (pathId) => {
    return PATH_DATA[pathId] || null;
};

export const getAllPaths = () => {
    return Object.values(PATH_DATA);
};

export const getPathNames = () => {
    return Object.values(PATH_DATA).map(path => path.name);
};

export const getPathStatModifiers = (pathId) => {
    const path = getPathData(pathId);
    return path ? path.statModifiers : {};
};

export const getPathSkills = (pathId) => {
    const path = getPathData(pathId);
    return path ? path.skillProficiencies : [];
};

export const getPathFeature = (pathId) => {
    const path = getPathData(pathId);
    return path ? path.feature : null;
};

export const getPathStartingPoints = (pathId) => {
    const path = getPathData(pathId);
    return path ? path.startingPoints : 0;
};
