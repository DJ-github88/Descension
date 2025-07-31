export const STEPS = {
    ITEM_TYPE: 0,
    BASIC_INFO: 1,
    SLOT_AND_SIZE: 2,
    STATS: 3,
    COMBAT_STATS: 4,
    CHANCE_ON_HIT: 5,
    UTILITY: 6,
    VALUE: 7,
    APPEARANCE: 8
};

export const STEP_INFO = {
    [STEPS.ITEM_TYPE]: {
        name: 'Item Type',
        icon: 'inv_misc_book_08',
        description: 'Choose the fundamental nature of your item. Will it be a mighty weapon, protective armor, a mystical accessory, or perhaps something else entirely?'
    },
    [STEPS.BASIC_INFO]: {
        name: 'Basic Info',
        icon: 'inv_misc_bandage_07',
        description: 'Name your creation and give it a compelling description. Every legendary item has a story - what\'s yours?'
    },
    [STEPS.SLOT_AND_SIZE]: {
        name: 'Slot & Size',
        icon: 'inv_misc_desecrated_platehelm',
        description: 'Determine where this item is worn or held. The right placement can mean the difference between a useful tool and a masterpiece.'
    },

    [STEPS.STATS]: {
        name: 'Stats',
        icon: 'spell_holy_prayeroffortitude',
        description: 'Enhance the bearer\'s core attributes. Will they become stronger, more agile, or perhaps wiser through its use?'
    },
    [STEPS.COMBAT_STATS]: {
        name: 'Combat',
        icon: 'achievement_pvp_p_14',
        description: 'Define the item\'s combat capabilities. From devastating damage to impenetrable defenses, make it worthy of battle.'
    },
    [STEPS.CHANCE_ON_HIT]: {
        name: 'On Being Hit',
        icon: 'ability_warrior_revenge',
        description: 'Configure effects that trigger when the wearer is struck in battle. Create defensive mechanisms that punish attackers or protect the bearer.'
    },
    [STEPS.UTILITY]: {
        name: 'Utility',
        icon: 'trade_engineering',
        description: 'Add special features and utilities. Sometimes the most valuable items aren\'t the ones that deal damage, but those that solve problems.'
    },
    [STEPS.VALUE]: {
        name: 'Value',
        icon: 'inv_misc_coin_17',
        description: 'Set the item\'s worth in gold, silver, and copper. What price would a merchant pay for such a treasure?'
    },
    [STEPS.APPEARANCE]: {
        name: 'Appearance',
        icon: 'inv_misc_bag_28_halloween',
        description: 'Design the item\'s visual appearance. The finest items are as magnificent to behold as they are powerful to use.'
    }
};

export const getStepOrder = (isEditing, itemType) => {
    if (!isEditing) {
        return Object.values(STEPS);
    }

    // When editing, customize step order based on item type
    const baseSteps = [
        STEPS.BASIC_INFO,
        STEPS.SLOT_AND_SIZE,
        STEPS.STATS,
        STEPS.COMBAT_STATS,
        STEPS.CHANCE_ON_HIT,
        STEPS.UTILITY,
        STEPS.VALUE,
        STEPS.APPEARANCE
    ];

    // For weapons, ensure combat stats come right after slot selection
    if (itemType === 'weapon') {
        return [
            STEPS.BASIC_INFO,
            STEPS.SLOT_AND_SIZE,
            STEPS.COMBAT_STATS,
            STEPS.STATS,
            STEPS.CHANCE_ON_HIT,
            STEPS.UTILITY,
            STEPS.VALUE,
            STEPS.APPEARANCE
        ];
    }

    return baseSteps;
};
