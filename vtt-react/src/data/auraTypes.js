export const AURA_TYPES = {
    BENEFICIAL: {
        protection: {
            name: 'Protection',
            icon: 'spell_holy_powerwordshield',
            color: '#FFFFFF',
            description: 'Reduces damage taken by allies',
            effects: ['damage_reduction'],
            defaultRadius: 30
        },
        healing: {
            name: 'Healing',
            icon: 'spell_holy_healingaura',
            color: '#00FF00',
            description: 'Restores health to allies over time',
            effects: ['healing_over_time'],
            defaultRadius: 20
        },
        inspiration: {
            name: 'Inspiration',
            icon: 'spell_holy_auraoflight',
            color: '#FFFF00',
            description: 'Increases damage and healing done by allies',
            effects: ['damage_bonus', 'healing_bonus'],
            defaultRadius: 25
        },
        swiftness: {
            name: 'Swiftness',
            icon: 'spell_nature_swiftness',
            color: '#00FFFF',
            description: 'Increases movement speed of allies',
            effects: ['movement_speed'],
            defaultRadius: 30
        }
    },
    HARMFUL: {
        decay: {
            name: 'Decay',
            icon: 'spell_shadow_creepingplague',
            color: '#880000',
            description: 'Deals damage to enemies over time',
            effects: ['damage_over_time'],
            defaultRadius: 15
        },
        weakness: {
            name: 'Weakness',
            icon: 'spell_shadow_curseofsargeras',
            color: '#FF0000',
            description: 'Reduces damage dealt by enemies',
            effects: ['damage_reduction'],
            defaultRadius: 20
        },
        slowness: {
            name: 'Slowness',
            icon: 'spell_nature_slowingtotem',
            color: '#0000FF',
            description: 'Reduces movement speed of enemies',
            effects: ['movement_speed_reduction'],
            defaultRadius: 25
        }
    },
    UTILITY: {
        detection: {
            name: 'Detection',
            icon: 'spell_holy_mindvision',
            color: '#FF00FF',
            description: 'Reveals hidden enemies',
            effects: ['detect_invisibility', 'detect_stealth'],
            defaultRadius: 40
        },
        resistance: {
            name: 'Resistance',
            icon: 'spell_nature_resistnature',
            color: '#00FF88',
            description: 'Provides elemental resistance to allies',
            effects: ['elemental_resistance'],
            defaultRadius: 30
        },
        clarity: {
            name: 'Clarity',
            icon: 'spell_holy_mageaura',
            color: '#88FFFF',
            description: 'Increases resource regeneration',
            effects: ['resource_regeneration'],
            defaultRadius: 25
        }
    }
};

export const getAuraInfo = (auraId) => {
    for (const category of Object.values(AURA_TYPES)) {
        if (category[auraId]) {
            return category[auraId];
        }
    }
    return null;
};

export const getAllAuras = () => {
    const auras = [];
    for (const category of Object.values(AURA_TYPES)) {
        auras.push(...Object.values(category));
    }
    return auras;
};

export const getAurasByCategory = () => {
    return AURA_TYPES;
};

export const calculateAuraEffect = (aura, casterLevel, attributes = {}) => {
    if (!aura) return null;

    const baseEffect = {
        radius: aura.defaultRadius,
        duration: -1, // -1 indicates permanent until canceled
        effects: {}
    };

    // Calculate effect values based on level and attributes
    for (const effectType of aura.effects) {
        switch (effectType) {
            case 'damage_reduction':
                baseEffect.effects[effectType] = 5 + Math.floor(casterLevel * 0.5);
                break;
            case 'healing_over_time':
                baseEffect.effects[effectType] = 2 + Math.floor(casterLevel * 0.3);
                break;
            case 'damage_bonus':
                baseEffect.effects[effectType] = 3 + Math.floor(casterLevel * 0.2);
                break;
            case 'movement_speed':
                baseEffect.effects[effectType] = 10 + Math.floor(casterLevel * 0.5);
                break;
            // Add more effect calculations as needed
        }
    }

    return baseEffect;
};
