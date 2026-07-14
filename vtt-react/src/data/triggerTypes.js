export const TRIGGER_TYPES = {
    COMBAT: {
        on_hit: {
            name: 'On Hit',
            icon: 'ability_warrior_bloodsword',
            description: 'Steel bites home under the Frostwood fog. Triggers when successfully hitting a target',
            validTargets: ['attacker', 'target'],
            defaultChance: 100
        },
        on_crit: {
            name: 'On Critical Hit',
            icon: 'ability_rogue_ambush',
            description: 'A Thrask killing-strike that splits helm and oath both. Triggers when landing a critical hit',
            validTargets: ['attacker', 'target'],
            defaultChance: 100
        },
        on_dodge: {
            name: 'On Dodge',
            icon: 'ability_rogue_feint',
            description: 'The Harbinger\'s sidestep out of prophecy\'s path. Triggers when dodging an attack',
            validTargets: ['attacker', 'defender'],
            defaultChance: 100
        },
        on_block: {
            name: 'On Block',
            icon: 'ability_warrior_shieldwall',
            description: 'Ironwood and cold-iron meet the oncoming blow. Triggers when blocking an attack',
            validTargets: ['attacker', 'defender'],
            defaultChance: 100
        }
    },
    DAMAGE: {
        on_damage_taken: {
            name: 'On Damage Taken',
            icon: 'ability_warrior_bloodfrenzy',
            description: 'Pain is a teacher older than the Sundering. Triggers when taking any damage',
            validTargets: ['self', 'attacker'],
            defaultChance: 100
        },
        on_damage_dealt: {
            name: 'On Damage Dealt',
            icon: 'ability_warrior_punishingblow',
            description: 'The Emberspire\'s answer to every slight. Triggers when dealing any damage',
            validTargets: ['self', 'target'],
            defaultChance: 100
        },
        threshold_high: {
            name: 'At High Health',
            icon: 'spell_holy_sealofsacrifice',
            description: 'Vitality that sings like a Solbrand ember in the chest. Triggers when health is above 75%',
            validTargets: ['self'],
            defaultChance: 100,
            threshold: 75
        },
        threshold_low: {
            name: 'At Low Health',
            icon: 'spell_holy_sealofblood',
            description: 'The Revenant\'s threshold, blood and breath both running thin. Triggers when health is below 25%',
            validTargets: ['self'],
            defaultChance: 100,
            threshold: 25
        }
    },
    STATUS: {
        on_buff_gained: {
            name: 'On Buff Gained',
            icon: 'spell_holy_powerwordshield',
            description: 'Solbrand warmth floods the wounded and willing. Triggers when gaining a beneficial effect',
            validTargets: ['self'],
            defaultChance: 100
        },
        on_debuff_gained: {
            name: 'On Debuff Gained',
            icon: 'spell_shadow_curseofsargeras',
            description: 'A Neth clause gone sour, a Wyrd-glyph gone wrong. Triggers when gaining a negative effect',
            validTargets: ['self'],
            defaultChance: 100
        },
        on_cc_break: {
            name: 'On CC Break',
            icon: 'spell_nature_removecurse',
            description: 'Cold-iron will throws off the Inquisitor\'s binding-chain. Triggers when breaking free from crowd control',
            validTargets: ['self', 'target'],
            defaultChance: 100
        }
    },
    MOVEMENT: {
        on_move: {
            name: 'On Movement',
            icon: 'ability_rogue_sprint',
            description: 'Footfalls on the bog-peat and the barrow-stone. Triggers when moving',
            validTargets: ['self'],
            defaultChance: 20
        },
        on_jump: {
            name: 'On Jump',
            icon: 'ability_rogue_quickrecovery',
            description: 'A Shaper\'s kinetic leap across the threshold. Triggers when jumping',
            validTargets: ['self'],
            defaultChance: 50
        },
        on_stop: {
            name: 'On Stop Moving',
            icon: 'ability_rogue_feint',
            description: 'Apex hunter-stillness at the edge of the briar. Triggers when stopping movement',
            validTargets: ['self'],
            defaultChance: 100
        }
    }
};

export const getTriggerInfo = (triggerId) => {
    for (const category of Object.values(TRIGGER_TYPES)) {
        if (category[triggerId]) {
            return category[triggerId];
        }
    }
    return null;
};

export const getAllTriggers = () => {
    const triggers = [];
    for (const category of Object.values(TRIGGER_TYPES)) {
        triggers.push(...Object.values(category));
    }
    return triggers;
};

export const getTriggersByCategory = () => {
    return TRIGGER_TYPES;
};

export const validateTriggerTarget = (trigger, target) => {
    const triggerInfo = getTriggerInfo(trigger);
    if (!triggerInfo) return false;
    return triggerInfo.validTargets.includes(target);
};

export const shouldTriggerProc = (trigger, chance = null) => {
    const triggerInfo = getTriggerInfo(trigger);
    if (!triggerInfo) return false;
    
    const procChance = chance || triggerInfo.defaultChance;
    return Math.random() * 100 <= procChance;
};
