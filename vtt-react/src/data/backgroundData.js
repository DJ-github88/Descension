/**
 * Character Background Data Module
 * 
 * Defines all available character backgrounds with their mechanical benefits,
 * skill proficiencies, equipment, and roleplay features.
 */

export const BACKGROUND_DATA = {
    acolyte: {
        id: 'acolyte',
        name: 'Acolyte',
        description: 'You have spent your life in service to a temple, learning sacred rites and providing sacrifices to the god or gods you worship.',
        skillProficiencies: ['Insight', 'Religion'],
        languages: 2, // Choose 2 languages
        equipment: [
            'Holy symbol',
            'Prayer book',
            'Incense (5 sticks)',
            'Vestments',
            'Common clothes'
        ],
        startingCurrency: {
            gold: 12,
            silver: 8,
            copper: 0
        },
        feature: {
            name: 'Shelter of the Faithful',
            description: 'You and your companions can receive free healing and care at temples, shrines, and other religious establishments.'
        },
        statModifiers: {
            spirit: 3,
            intelligence: -1
        }
    },

    criminal: {
        id: 'criminal',
        name: 'Criminal',
        description: 'You are an experienced criminal with a history of breaking the law. You have spent a lot of time among other criminals.',
        skillProficiencies: ['Deception', 'Stealth'],
        toolProficiencies: ['Thieves\' tools', 'Gaming set'],
        languages: 1, // Underworld connections
        equipment: [
            'Crowbar',
            'Dark Common Clothes',
            'Lockpicks (5)'
        ],
        startingCurrency: {
            gold: 10,
            silver: 15,
            copper: 0
        },
        feature: {
            name: 'Criminal Contact',
            description: 'You have a reliable contact who acts as your liaison to a network of other criminals.'
        },
        statModifiers: {
            agility: 2,
            intelligence: 2,
            spirit: -2
        }
    },

    folkHero: {
        id: 'folkHero',
        name: 'Folk Hero',
        description: 'You come from humble origins, but you are destined for so much more. The people of your home village regard you as their champion.',
        skillProficiencies: ['Animal Handling', 'Survival'],
        toolProficiencies: ['Artisan\'s tools', 'Vehicles (land)'],
        languages: 1, // Folk heroes often travel and interact with diverse communities
        equipment: [
            'Artisan\'s tools',
            'Shovel',
            'Iron pot',
            'Common clothes',
            'Travel Rations (3 days)'
        ],
        startingCurrency: {
            gold: 8,
            silver: 12,
            copper: 0
        },
        feature: {
            name: 'Rustic Hospitality',
            description: 'Common folk will provide you with simple accommodations and food when needed.'
        },
        statModifiers: {
            constitution: 3,
            intelligence: -1
        }
    },

    noble: {
        id: 'noble',
        name: 'Noble',
        description: 'You understand wealth, power, and privilege. You carry a noble title, and your family owns land, collects taxes, and wields political influence.',
        skillProficiencies: ['History', 'Persuasion'],
        toolProficiencies: ['Gaming set'],
        languages: 1,
        equipment: [
            'Fine clothes',
            'Signet ring',
            'Scroll of pedigree',
            'Perfume (vial)'
        ],
        startingCurrency: {
            gold: 20,
            silver: 10,
            copper: 0
        },
        feature: {
            name: 'Position of Privilege',
            description: 'You are welcome in high society, and people assume you have the right to be wherever you are.'
        },
        statModifiers: {
            charisma: 2,
            intelligence: 1,
            constitution: -1
        }
    },

    sage: {
        id: 'sage',
        name: 'Sage',
        description: 'You spent years learning the lore of the multiverse. You scoured manuscripts, studied scrolls, and listened to the greatest experts.',
        skillProficiencies: ['Arcana', 'History'],
        languages: 2,
        equipment: [
            'Bottle of black ink',
            'Quill',
            'Small knife',
            'Letter from colleague',
            'Common clothes'
        ],
        startingCurrency: {
            gold: 8,
            silver: 15,
            copper: 0
        },
        feature: {
            name: 'Researcher',
            description: 'You know where and how to obtain information, including from libraries, universities, and sages.'
        },
        statModifiers: {
            intelligence: 4,
            strength: -2
        }
    },

    soldier: {
        id: 'soldier',
        name: 'Soldier',
        description: 'War has been your life for as long as you care to remember. You trained as a youth, studied the use of weapons and armor.',
        skillProficiencies: ['Athletics', 'Intimidation'],
        toolProficiencies: ['Gaming set', 'Vehicles (land)'],
        languages: 1, // Military campaigns expose you to foreign tongues
        equipment: [
            'Insignia of rank',
            'Trophy from fallen enemy',
            'Deck of cards',
            'Common clothes',
            'Military Rations (5 days)'
        ],
        startingCurrency: {
            gold: 12,
            silver: 6,
            copper: 0
        },
        feature: {
            name: 'Military Rank',
            description: 'You have a military rank from your career as a soldier and can invoke your rank to gain access to military facilities.'
        },
        statModifiers: {
            strength: 2,
            constitution: 2,
            intelligence: -2
        }
    },

    charlatan: {
        id: 'charlatan',
        name: 'Charlatan',
        description: 'You have always had a way with people. You know what makes them tick, you can tease out their hearts\' desires.',
        skillProficiencies: ['Deception', 'Sleight of Hand'],
        toolProficiencies: ['Forgery kit', 'Disguise kit'],
        languages: 1, // Worldly experience from traveling cons
        equipment: [
            'Disguise kit',
            'Tools of con of choice',
            'Fine clothes',
            'Signet ring of imaginary person',
            'Disguise accessories'
        ],
        startingCurrency: {
            gold: 11,
            silver: 12,
            copper: 0
        },
        feature: {
            name: 'False Identity',
            description: 'You have created a second identity that includes documentation, established acquaintances, and disguises.'
        },
        statModifiers: {
            charisma: 3,
            spirit: -1
        }
    },

    entertainer: {
        id: 'entertainer',
        name: 'Entertainer',
        description: 'You thrive in front of an audience. You know how to entrance them, entertain them, and even inspire them.',
        skillProficiencies: ['Acrobatics', 'Performance'],
        toolProficiencies: ['Disguise kit', 'Musical instrument'],
        languages: 1, // Traveling performers learn languages from diverse audiences
        equipment: [
            'Musical instrument',
            'Favor of admirer',
            'Costume',
            'Theatrical makeup'
        ],
        startingCurrency: {
            gold: 13,
            silver: 8,
            copper: 0
        },
        feature: {
            name: 'By Popular Demand',
            description: 'You can find a place to perform in any settlement, and receive modest lodging and food in return.'
        },
        statModifiers: {
            charisma: 2,
            agility: 2,
            constitution: -2
        }
    },

    guildArtisan: {
        id: 'guildArtisan',
        name: 'Guild Artisan',
        description: 'You are a member of an artisan\'s guild, skilled in a particular field and closely associated with other artisans.',
        skillProficiencies: ['Insight', 'Persuasion'],
        toolProficiencies: ['Artisan\'s tools'],
        languages: 1,
        equipment: [
            'Artisan\'s tools',
            'Letter of introduction from guild',
            'Traveler\'s clothes'
        ],
        startingCurrency: {
            gold: 14,
            silver: 10,
            copper: 0
        },
        feature: {
            name: 'Guild Membership',
            description: 'Your guild provides lodging and food when needed, and will pay for your funeral if necessary.'
        },
        statModifiers: {
            intelligence: 3,
            charisma: -1
        }
    },

    hermit: {
        id: 'hermit',
        name: 'Hermit',
        description: 'You lived in seclusion for a formative part of your life. In your time apart from the clamor of society, you found quiet, solitude, and perhaps some answers.',
        skillProficiencies: ['Medicine', 'Religion'],
        toolProficiencies: ['Herbalism kit'],
        languages: 1,
        equipment: [
            'Herbalism kit',
            'Scroll case with spiritual writings',
            'Winter blanket',
            'Trail rations (5 days)'
        ],
        startingCurrency: {
            gold: 4,
            silver: 12,
            copper: 0
        },
        feature: {
            name: 'Discovery',
            description: 'You discovered a great truth about the cosmos, nature, or divine powers during your isolation.'
        },
        statModifiers: {
            spirit: 3,
            charisma: -1
        }
    },

    outlander: {
        id: 'outlander',
        name: 'Outlander',
        description: 'You grew up in the wilds, far from civilization and the comforts of town and technology.',
        skillProficiencies: ['Athletics', 'Survival'],
        toolProficiencies: ['Musical instrument'],
        languages: 1,
        equipment: [
            'Staff',
            'Hunting trap',
            'Traveler\'s clothes',
            'Waterskin'
        ],
        startingCurrency: {
            gold: 7,
            silver: 18,
            copper: 0
        },
        feature: {
            name: 'Wanderer',
            description: 'You have an excellent memory for maps and geography, and can find food and shelter for yourself and others in the wild.'
        },
        statModifiers: {
            constitution: 2,
            spirit: 2,
            charisma: -2
        }
    },

    sailor: {
        id: 'sailor',
        name: 'Sailor',
        description: 'You sailed on a seagoing vessel for years. In that time, you faced down mighty storms, monsters of the deep, and those who wanted to sink your craft.',
        skillProficiencies: ['Athletics', 'Perception'],
        toolProficiencies: ['Navigator\'s tools', 'Vehicles (water)'],
        languages: 1, // Port cities expose sailors to many tongues
        equipment: [
            'Belaying pin',
            'Silk rope (50 feet)',
            'Lucky charm',
            'Common clothes'
        ],
        startingCurrency: {
            gold: 9,
            silver: 15,
            copper: 0
        },
        feature: {
            name: 'Ship\'s Passage',
            description: 'You can secure free passage on sailing ships for yourself and companions in exchange for work.'
        },
        statModifiers: {
            agility: 3,
            intelligence: -1
        }
    },

    merchant: {
        id: 'merchant',
        name: 'Merchant',
        description: 'You have spent your life in the world of trade and commerce, buying and selling goods across distant lands. You understand the value of coin and the art of negotiation.',
        skillProficiencies: ['Insight', 'Persuasion'],
        toolProficiencies: ['Navigator\'s tools'],
        languages: 2, // Merchants learn languages to conduct business
        equipment: [
            'Merchant\'s scale',
            'Sample goods',
            'Traveler\'s clothes',
            'Ledger'
        ],
        startingCurrency: {
            gold: 16,
            silver: 12,
            copper: 0
        },
        feature: {
            name: 'Trade Network',
            description: 'You have contacts in merchant guilds and trading posts across the land, allowing you to buy and sell goods at favorable prices and gather market information.'
        },
        statModifiers: {
            charisma: 2,
            intelligence: 2,
            strength: -2
        }
    },

    urchin: {
        id: 'urchin',
        name: 'Urchin',
        description: 'You grew up on the streets alone, orphaned, and poor. You had no one to watch over you or provide for you, so you learned to provide for yourself.',
        skillProficiencies: ['Sleight of Hand', 'Stealth'],
        toolProficiencies: ['Disguise kit', 'Thieves\' tools'],
        languages: 1, // Street smarts include picking up local dialects
        equipment: [
            'Small knife',
            'Map of home city',
            'Pet mouse',
            'Token of parents',
            'Common clothes'
        ],
        startingCurrency: {
            gold: 6,
            silver: 18,
            copper: 0
        },
        feature: {
            name: 'City Secrets',
            description: 'You know the secret patterns and flow of cities and can find passages through the urban sprawl that others would miss.'
        },
        statModifiers: {
            agility: 3,
            strength: -1
        }
    },

    scholar: {
        id: 'scholar',
        name: 'Scholar',
        description: 'You have dedicated your life to the pursuit of knowledge, studying in great libraries and academies. Your expertise in a particular field of study sets you apart.',
        skillProficiencies: ['History', 'Investigation'],
        toolProficiencies: ['Calligrapher\'s supplies'],
        languages: 2, // Scholars study ancient texts in various languages
        equipment: [
            'Bottle of ink',
            'Quill',
            'Parchment (10 sheets)',
            'Academic robes',
            'Research notes'
        ],
        startingCurrency: {
            gold: 12,
            silver: 10,
            copper: 0
        },
        feature: {
            name: 'Academic Network',
            description: 'You have connections with scholars, librarians, and academics across the realm who can provide you with access to knowledge and research materials.'
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
    const customBackgrounds = require('./customBackgroundData').CUSTOM_BACKGROUNDS;
    const customBackground = customBackgrounds[backgroundId];
    if (customBackground && customBackground.statModifiers) {
        return customBackground.statModifiers;
    }

    // No modifiers found
    return {};
};
