/**
 * Character Path Data Module
 *
 * Defines the 9 character paths for the character creation wizard:
 * Mystic, Zealot, Trickster, Harrow, Arcanist, Hexer, Reaver, Mercenary, Sentinel
 *
 * Each path provides:
 * - Stat modifiers (point allocation bonuses)
 * - Skill proficiencies
 * - Starting equipment
 * - Special features
 * - Thematic description
 */

export const PATH_DATA = {
    mystic: {
        id: 'mystic',
        name: 'Mystic',
        description: 'You have delved into the mysteries of the cosmos, studying ancient texts and communing with otherworldly forces. Your understanding of the arcane and divine grants you insight beyond mortal comprehension.',
        icon: 'fas fa-eye',
        statModifiers: {
            intelligence: 1,
            spirit: 2,
            charisma: 1
        },
        skillProficiencies: ['Arcana', 'Insight', 'Religion'],
        toolProficiencies: ['Alchemist\'s supplies'],
        languages: 2,
        startingEquipment: [
            'Crystal focus',
            'Tome of mysteries',
            'Incense and candles',
            'Ritual components pouch',
            'Traveler\'s robes',
            'Belt pouch with 20g'
        ],
        feature: {
            name: 'Mystical Insight',
            description: 'You can sense magical auras and identify the nature of supernatural phenomena. Once per day, you can gain advantage on any Intelligence (Arcana) or Wisdom (Insight) check.'
        },
        startingPoints: 2 // Extra points for stat allocation
    },

    zealot: {
        id: 'zealot',
        name: 'Zealot',
        description: 'Driven by unwavering faith and righteous fury, you have dedicated your life to a divine cause. Your fervor grants you strength in battle and the ability to inspire others through your conviction.',
        icon: 'fas fa-cross',
        statModifiers: {
            strength: 1,
            constitution: 1,
            spirit: 2
        },
        skillProficiencies: ['Intimidation', 'Religion', 'Persuasion'],
        toolProficiencies: ['Smith\'s tools'],
        languages: 1,
        startingEquipment: [
            'Holy symbol',
            'Prayer beads',
            'Ceremonial weapon',
            'Religious vestments',
            'Traveler\'s clothes',
            'Belt pouch with 15g'
        ],
        feature: {
            name: 'Divine Fervor',
            description: 'Your faith grants you resilience. Once per day, when you would be reduced to 0 hit points, you can choose to drop to 1 hit point instead.'
        },
        startingPoints: 1
    },

    trickster: {
        id: 'trickster',
        name: 'Trickster',
        description: 'You live by your wits and charm, using cunning and deception to navigate the world. Whether through sleight of hand, clever words, or elaborate schemes, you always find a way to come out ahead.',
        icon: 'fas fa-mask',
        statModifiers: {
            agility: 2,
            intelligence: 1,
            charisma: 1
        },
        skillProficiencies: ['Deception', 'Sleight of Hand', 'Stealth'],
        toolProficiencies: ['Thieves\' tools', 'Disguise kit'],
        languages: 1,
        startingEquipment: [
            'Thieves\' tools',
            'Disguise kit',
            'Set of fine clothes',
            'Signet ring (fake)',
            'Deck of marked cards',
            'Belt pouch with 25g'
        ],
        feature: {
            name: 'Silver Tongue',
            description: 'You excel at misdirection and fast talk. You can attempt to convince someone of a minor falsehood or distract them for a few moments, even if they\'re initially suspicious.'
        },
        startingPoints: 1
    },

    harrow: {
        id: 'harrow',
        name: 'Harrow',
        description: 'You have walked through darkness and emerged scarred but unbroken. Your experiences with loss, tragedy, or supernatural horror have hardened your resolve and granted you insight into the nature of fear and despair.',
        icon: 'fas fa-skull',
        statModifiers: {
            constitution: 2,
            spirit: 1,
            charisma: -1
        },
        skillProficiencies: ['Intimidation', 'Survival', 'Medicine'],
        toolProficiencies: ['Herbalism kit'],
        languages: 1,
        startingEquipment: [
            'Memento of loss',
            'Weathered cloak',
            'Survival gear',
            'Herbalism kit',
            'Common clothes (worn)',
            'Belt pouch with 10g'
        ],
        feature: {
            name: 'Hardened Soul',
            description: 'Your experiences have made you resistant to fear and despair. You have advantage on saving throws against being frightened, and you can help others overcome their fears through your presence.'
        },
        startingPoints: 0
    },

    arcanist: {
        id: 'arcanist',
        name: 'Arcanist',
        description: 'You are a scholar of the arcane arts, having spent years studying magical theory and practice. Your deep understanding of spellcraft and magical phenomena makes you invaluable in matters of mystical importance.',
        icon: 'fas fa-magic',
        statModifiers: {
            intelligence: 3,
            spirit: 1
        },
        skillProficiencies: ['Arcana', 'History', 'Investigation'],
        toolProficiencies: ['Calligrapher\'s supplies'],
        languages: 3,
        startingEquipment: [
            'Spellbook',
            'Component pouch',
            'Ink and quill',
            'Scholarly robes',
            'Reading glasses',
            'Belt pouch with 30g'
        ],
        feature: {
            name: 'Arcane Scholar',
            description: 'Your extensive study grants you deep magical knowledge. You can identify most spells as they\'re being cast and have advantage on checks to understand magical phenomena or decipher magical writings.'
        },
        startingPoints: 3
    },

    hexer: {
        id: 'hexer',
        name: 'Hexer',
        description: 'You have made pacts with dark forces or learned forbidden arts that others fear to touch. Your knowledge of curses, hexes, and shadow magic comes at a price, but grants you power over your enemies.',
        icon: 'fas fa-moon',
        statModifiers: {
            intelligence: 1,
            spirit: 1,
            charisma: 2
        },
        skillProficiencies: ['Arcana', 'Deception', 'Intimidation'],
        toolProficiencies: ['Poisoner\'s kit'],
        languages: 2,
        startingEquipment: [
            'Cursed trinket',
            'Ritual dagger',
            'Dark tome',
            'Hooded cloak',
            'Vial of strange liquid',
            'Belt pouch with 15g'
        ],
        feature: {
            name: 'Hex Sight',
            description: 'You can sense curses, hexes, and dark magic. Once per day, you can place a minor hex on a target, giving them disadvantage on their next ability check or saving throw.'
        },
        startingPoints: 2
    },

    reaver: {
        id: 'reaver',
        name: 'Reaver',
        description: 'You are a warrior who has lived by the sword, taking what you need through strength and violence. Your brutal experiences have made you tough and dangerous, but also isolated from civilized society.',
        icon: 'fas fa-sword',
        statModifiers: {
            strength: 2,
            constitution: 2,
            charisma: -1
        },
        skillProficiencies: ['Athletics', 'Intimidation', 'Survival'],
        toolProficiencies: ['Smith\'s tools'],
        languages: 0,
        startingEquipment: [
            'Battle-worn weapon',
            'Trophy from defeated foe',
            'Leather armor (studded)',
            'Traveler\'s clothes',
            'Whetstone',
            'Belt pouch with 20g'
        ],
        feature: {
            name: 'Battle Fury',
            description: 'In combat, you can enter a state of controlled rage. Once per day, you can gain advantage on all melee attack rolls for one round, but you take a -2 penalty to Armor until your next turn.'
        },
        startingPoints: 0
    },

    mercenary: {
        id: 'mercenary',
        name: 'Mercenary',
        description: 'You are a professional soldier-for-hire, skilled in warfare and tactics. Your pragmatic approach to conflict and your network of contacts in the military world make you a valuable ally and dangerous enemy.',
        icon: 'fas fa-coins',
        statModifiers: {
            strength: 1,
            agility: 1,
            constitution: 1,
            intelligence: 1
        },
        skillProficiencies: ['Athletics', 'Intimidation', 'Persuasion'],
        toolProficiencies: ['Gaming set', 'Vehicles (land)'],
        languages: 1,
        startingEquipment: [
            'Military insignia',
            'Contract of service',
            'Gaming set',
            'Traveler\'s clothes',
            'Weapon maintenance kit',
            'Belt pouch with 25g'
        ],
        feature: {
            name: 'Military Network',
            description: 'You have contacts in mercenary companies and military organizations. You can find work as a hired sword and gain access to military equipment and information through your connections.'
        },
        startingPoints: 1
    },

    sentinel: {
        id: 'sentinel',
        name: 'Sentinel',
        description: 'You have served as a guardian and protector, whether of a sacred place, important person, or vital secret. Your vigilance and dedication to duty have honed your senses and strengthened your resolve.',
        icon: 'fas fa-shield-alt',
        statModifiers: {
            constitution: 1,
            spirit: 2,
            charisma: 1
        },
        skillProficiencies: ['Insight', 'Perception', 'Athletics'],
        toolProficiencies: ['Mason\'s tools'],
        languages: 1,
        startingEquipment: [
            'Guardian\'s badge',
            'Signal horn',
            'Chain mail',
            'Traveler\'s clothes',
            'Rope (50 feet)',
            'Belt pouch with 15g'
        ],
        feature: {
            name: 'Watchful Guardian',
            description: 'Your training as a sentinel has sharpened your awareness. You cannot be surprised while conscious, and you can keep watch for twice as long as normal without suffering exhaustion.'
        },
        startingPoints: 1
    }
};

// Helper functions
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

// Legacy exports for backward compatibility (will be removed)
export const getCustomBackgroundData = getPathData;
export const getAllCustomBackgrounds = getAllPaths;
export const getCustomBackgroundNames = getPathNames;
export const getCustomBackgroundStatModifiers = getPathStatModifiers;
export const getCustomBackgroundSkills = getPathSkills;
export const getCustomBackgroundFeature = getPathFeature;
export const getCustomBackgroundStartingPoints = getPathStartingPoints;
