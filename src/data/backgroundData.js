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
            'Common clothes',
            'Belt pouch with 15g'
        ],
        feature: {
            name: 'Shelter of the Faithful',
            description: 'You and your companions can receive free healing and care at temples, shrines, and other religious establishments.'
        }
    },

    criminal: {
        id: 'criminal',
        name: 'Criminal',
        description: 'You are an experienced criminal with a history of breaking the law. You have spent a lot of time among other criminals.',
        skillProficiencies: ['Deception', 'Stealth'],
        toolProficiencies: ['Thieves\' tools', 'Gaming set'],
        equipment: [
            'Crowbar',
            'Dark common clothes with hood',
            'Belt pouch with 15g'
        ],
        feature: {
            name: 'Criminal Contact',
            description: 'You have a reliable contact who acts as your liaison to a network of other criminals.'
        }
    },

    folkHero: {
        id: 'folkHero',
        name: 'Folk Hero',
        description: 'You come from humble origins, but you are destined for so much more. The people of your home village regard you as their champion.',
        skillProficiencies: ['Animal Handling', 'Survival'],
        toolProficiencies: ['Artisan\'s tools', 'Vehicles (land)'],
        equipment: [
            'Artisan\'s tools',
            'Shovel',
            'Iron pot',
            'Common clothes',
            'Belt pouch with 10g'
        ],
        feature: {
            name: 'Rustic Hospitality',
            description: 'Common folk will provide you with simple accommodations and food when needed.'
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
            'Purse with 25g'
        ],
        feature: {
            name: 'Position of Privilege',
            description: 'You are welcome in high society, and people assume you have the right to be wherever you are.'
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
            'Common clothes',
            'Belt pouch with 10g'
        ],
        feature: {
            name: 'Researcher',
            description: 'You know where and how to obtain information, including from libraries, universities, and sages.'
        }
    },

    soldier: {
        id: 'soldier',
        name: 'Soldier',
        description: 'War has been your life for as long as you care to remember. You trained as a youth, studied the use of weapons and armor.',
        skillProficiencies: ['Athletics', 'Intimidation'],
        toolProficiencies: ['Gaming set', 'Vehicles (land)'],
        equipment: [
            'Insignia of rank',
            'Trophy from fallen enemy',
            'Deck of cards',
            'Common clothes',
            'Belt pouch with 10g'
        ],
        feature: {
            name: 'Military Rank',
            description: 'You have a military rank from your career as a soldier and can invoke your rank to gain access to military facilities.'
        }
    },

    charlatan: {
        id: 'charlatan',
        name: 'Charlatan',
        description: 'You have always had a way with people. You know what makes them tick, you can tease out their hearts\' desires.',
        skillProficiencies: ['Deception', 'Sleight of Hand'],
        toolProficiencies: ['Forgery kit', 'Disguise kit'],
        equipment: [
            'Disguise kit',
            'Tools of con of choice',
            'Fine clothes',
            'Signet ring of imaginary person',
            'Belt pouch with 15g'
        ],
        feature: {
            name: 'False Identity',
            description: 'You have created a second identity that includes documentation, established acquaintances, and disguises.'
        }
    },

    entertainer: {
        id: 'entertainer',
        name: 'Entertainer',
        description: 'You thrive in front of an audience. You know how to entrance them, entertain them, and even inspire them.',
        skillProficiencies: ['Acrobatics', 'Performance'],
        toolProficiencies: ['Disguise kit', 'Musical instrument'],
        equipment: [
            'Musical instrument',
            'Favor of admirer',
            'Costume',
            'Belt pouch with 15g'
        ],
        feature: {
            name: 'By Popular Demand',
            description: 'You can find a place to perform in any settlement, and receive modest lodging and food in return.'
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
            'Traveler\'s clothes',
            'Belt pouch with 15g'
        ],
        feature: {
            name: 'Guild Membership',
            description: 'Your guild provides lodging and food when needed, and will pay for your funeral if necessary.'
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
            'Belt pouch with 5g'
        ],
        feature: {
            name: 'Discovery',
            description: 'You discovered a great truth about the cosmos, nature, or divine powers during your isolation.'
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
            'Belt pouch with 10g'
        ],
        feature: {
            name: 'Wanderer',
            description: 'You have an excellent memory for maps and geography, and can find food and shelter for yourself and others in the wild.'
        }
    },

    sailor: {
        id: 'sailor',
        name: 'Sailor',
        description: 'You sailed on a seagoing vessel for years. In that time, you faced down mighty storms, monsters of the deep, and those who wanted to sink your craft.',
        skillProficiencies: ['Athletics', 'Perception'],
        toolProficiencies: ['Navigator\'s tools', 'Vehicles (water)'],
        equipment: [
            'Belaying pin',
            'Silk rope (50 feet)',
            'Lucky charm',
            'Common clothes',
            'Belt pouch with 10g'
        ],
        feature: {
            name: 'Ship\'s Passage',
            description: 'You can secure free passage on sailing ships for yourself and companions in exchange for work.'
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
