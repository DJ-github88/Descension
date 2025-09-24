// Class-specific resource system configuration for HUD display
// Each class has a unique 4th resource bar with specific mechanics and visuals

export const CLASS_RESOURCE_TYPES = {
    // INFERNAL PATH
    'Pyrofiend': {
        id: 'demonicAscension',
        name: 'Demonic Ascension',
        shortName: 'DA',
        type: 'stages',
        description: 'Ascension through demonic stages, each granting power but increasing corruption',
        visual: {
            type: 'progress-bar',
            count: 10,
            arrangement: 'horizontal',
            baseColor: '#4A0000',
            activeColor: '#FF4500',
            glowColor: '#FF6347',
            icon: '🔥',
            effects: ['fire', 'infernal']
        },
        mechanics: {
            max: 9, // Stages 0-9
            current: 0,
            regen: 0,
            consumeVerb: 'ascend',
            gainVerb: 'corrupt'
        },
        tooltip: {
            title: 'Demonic Ascension Stage {current}',
            description: 'Each stage grants demonic power but increases corruption risk',
            showStage: true,
            showBonuses: true,
            showDrawbacks: true
        },
        stages: [
            { name: 'Mortal', bonuses: [], drawbacks: [] },
            { name: 'Touched', bonuses: ['+5% Fire Damage'], drawbacks: [] },
            { name: 'Marked', bonuses: ['+10% Fire Damage', '+2 Fire Spell Power'], drawbacks: ['Vulnerable to Radiant'] },
            { name: 'Tainted', bonuses: ['+15% Fire Damage', '+4 Fire Spell Power'], drawbacks: ['Vulnerable to Radiant', '-1 Charisma'] },
            { name: 'Corrupted', bonuses: ['+20% Fire Damage', '+6 Fire Spell Power'], drawbacks: ['Vulnerable to Radiant', '-2 Charisma'] },
            { name: 'Infernal', bonuses: ['+25% Fire Damage', '+8 Fire Spell Power'], drawbacks: ['Vulnerable to Radiant', '-3 Charisma', 'Aura of Fear'] },
            { name: 'Demonic', bonuses: ['+30% Fire Damage', '+10 Fire Spell Power'], drawbacks: ['Vulnerable to Radiant', '-4 Charisma', 'Aura of Fear'] },
            { name: 'Archfiend', bonuses: ['+35% Fire Damage', '+12 Fire Spell Power'], drawbacks: ['Vulnerable to Radiant', '-5 Charisma', 'Aura of Terror'] },
            { name: 'Demon Lord', bonuses: ['+40% Fire Damage', '+15 Fire Spell Power'], drawbacks: ['Vulnerable to Radiant', '-6 Charisma', 'Aura of Terror'] },
            { name: 'Infernal Avatar', bonuses: ['+50% Fire Damage', '+20 Fire Spell Power'], drawbacks: ['Vulnerable to Radiant', '-8 Charisma', 'Aura of Despair'] }
        ]
    },
    'Minstrel': {
        id: 'musicalNotes',
        name: 'Musical Notes',
        shortName: 'Notes',
        type: 'notes',
        description: 'Musical notes that can be combined into powerful chord combinations',
        visual: {
            type: 'progress-bar',
            count: 7,
            arrangement: 'horizontal',
            baseColor: '#1E3A8A',
            activeColor: '#FFD700',
            glowColor: '#FFA500',
            icon: '🎵',
            effects: ['musical', 'harmony']
        },
        mechanics: {
            max: 7, // 7 different notes
            current: 0,
            regen: 0,
            consumeVerb: 'play',
            gainVerb: 'compose'
        },
        tooltip: {
            title: 'Musical Notes ({current}/7)',
            description: 'Combine notes to create powerful chord effects',
            showNotes: true,
            showCombos: true
        },
        notes: [
            { name: 'Tonic', position: 1, color: '#FF0000' },
            { name: 'Supertonic', position: 2, color: '#FF7F00' },
            { name: 'Mediant', position: 3, color: '#FFFF00' },
            { name: 'Subdominant', position: 4, color: '#00FF00' },
            { name: 'Dominant', position: 5, color: '#0000FF' },
            { name: 'Submediant', position: 6, color: '#4B0082' },
            { name: 'Leading Tone', position: 7, color: '#9400D3' }
        ]
    },

    'Chronarch': {
        id: 'continuumGauge',
        name: 'Continuum Gauge',
        shortName: 'CG',
        type: 'gauge',
        description: 'Temporal energy that builds to unlock time manipulation effects',
        visual: {
            type: 'progress-bar',
            count: 1,
            arrangement: 'horizontal',
            baseColor: '#2D1B69',
            activeColor: '#9370DB',
            glowColor: '#DDA0DD',
            icon: '⏰',
            effects: ['temporal', 'clockwork']
        },
        mechanics: {
            max: 30,
            current: 0,
            regen: 1, // Gains 1 per turn
            consumeVerb: 'manipulate',
            gainVerb: 'accumulate'
        },
        tooltip: {
            title: '{current}/{max}',
            description: 'Temporal energy for time manipulation effects',
            showThresholds: true,
            showEffects: true
        },
        thresholds: [
            { value: 10, name: 'Minor Tempo', effects: ['Haste spells cost -1 mana'] },
            { value: 20, name: 'Major Tempo', effects: ['Can cast Slow as bonus action'] },
            { value: 30, name: 'Time Mastery', effects: ['Can cast Time Stop once per day'] }
        ]
    },

    // TRICKSTER PATH
    'Chaos Weaver': {
        id: 'entropyPoints',
        name: 'Entropy Points',
        shortName: 'EP',
        type: 'entropy',
        description: 'Chaotic energy that fuels unpredictable reality-bending magic',
        visual: {
            type: 'progress-bar', // Use standard horizontal bar like health/mana/AP
            count: 'variable',
            arrangement: 'horizontal',
            baseColor: '#0F1B3C', // Dark blue base
            activeColor: '#1E3A8A', // Deep blue fill
            glowColor: '#3B82F6', // Bright blue glow
            icon: '🌀',
            effects: ['chaos', 'reality-distortion', 'chaotic-wave']
        },
        mechanics: {
            max: 'calculated', // INT mod + level/5, minimum 5
            current: 0,
            regen: 0,
            consumeVerb: 'weave',
            gainVerb: 'harvest'
        },
        tooltip: {
            title: 'Entropy Points: {current}/{max}',
            description: 'Chaotic energy for reality manipulation and unpredictable magic effects',
            showDice: true,
            showChaos: true
        },
        dice: ['d4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100']
    },

    'Fate Weaver': {
        id: 'cardDeck',
        name: 'Fate Cards',
        shortName: 'Cards',
        type: 'cards',
        description: 'Mystical cards that reveal and manipulate destiny',
        visual: {
            type: 'progress-bar',
            count: 'variable',
            arrangement: 'horizontal',
            baseColor: '#1F2F2F',
            activeColor: '#FFD700',
            glowColor: '#FFA500',
            icon: '🃏',
            effects: ['mystical', 'fate']
        },
        mechanics: {
            max: 52, // Full deck
            current: 5, // Starting hand
            regen: 0,
            consumeVerb: 'play',
            gainVerb: 'draw'
        },
        tooltip: {
            title: 'Fate Cards: {current} in hand',
            description: 'Mystical cards that manipulate destiny',
            showHand: true,
            showDeck: true
        }
    },

    'Gambler': {
        id: 'luckPoints',
        name: 'Luck Points',
        shortName: 'LP',
        type: 'gambling',
        description: 'Luck points for gambling with fate, balanced against mounting risk',
        visual: {
            type: 'progress-bar',
            count: 2,
            arrangement: 'horizontal',
            baseColor: '#8B6914',
            activeColor: '#FFD700',
            glowColor: '#FFA500',
            riskColor: '#DC143C',
            icon: '🎲',
            effects: ['luck', 'risk']
        },
        mechanics: {
            max: 'calculated', // CHA mod + 5
            current: 0,
            risk: 0,
            regen: 0,
            consumeVerb: 'gamble',
            gainVerb: 'win'
        },
        tooltip: {
            title: 'Luck: {current}/{max} | Risk: {risk}',
            description: 'Gambling with fate - higher risk, higher reward',
            showOdds: true,
            showRisk: true
        }
    },
    // ZEALOT PATH
    'Martyr': {
        id: 'painCharges',
        name: 'Pain Charges',
        shortName: 'PC',
        type: 'sacrifice',
        description: 'Pain charges earned through sacrifice, with blood vow thresholds',
        visual: {
            type: 'progress-bar',
            count: 'variable',
            arrangement: 'horizontal',
            baseColor: '#4A0000',
            activeColor: '#FFD700',
            glowColor: '#FFF8DC',
            icon: '✝️',
            effects: ['holy', 'sacrifice']
        },
        mechanics: {
            max: 'calculated', // Based on CON mod
            current: 0,
            regen: 0,
            consumeVerb: 'sacrifice',
            gainVerb: 'suffer'
        },
        tooltip: {
            title: 'Pain Charges: {current} | Blood Vows: {vows}',
            description: 'Charges earned through sacrifice and suffering',
            showCharges: true,
            showVows: true
        }
    },

    'False Prophet': {
        id: 'heresyPoints',
        name: 'Heresy Points',
        shortName: 'HP',
        type: 'corruption',
        description: 'Heretical energy gained through deception and false prophecy',
        visual: {
            type: 'progress-bar',
            count: 'variable',
            arrangement: 'horizontal',
            baseColor: '#1F2F2F',
            activeColor: '#8B008B',
            glowColor: '#9932CC',
            icon: '👁️',
            effects: ['corruption', 'deception']
        },
        mechanics: {
            max: 'calculated', // CHA mod + 5
            current: 0,
            regen: 0,
            consumeVerb: 'deceive',
            gainVerb: 'corrupt'
        },
        tooltip: {
            title: 'Heresy Points: {current}/{max}',
            description: 'Dark energy from spreading lies and false prophecy',
            showLies: true,
            showCorruption: true
        }
    },

    'Exorcist': {
        id: 'spiritCharges',
        name: 'Spirit Charges',
        shortName: 'SC',
        type: 'holy',
        description: 'Holy charges earned through banishing evil spirits',
        visual: {
            type: 'progress-bar',
            count: 'variable',
            arrangement: 'horizontal',
            baseColor: '#B8860B',
            activeColor: '#FFFFFF',
            glowColor: '#F0F8FF',
            icon: '🕊️',
            effects: ['holy', 'banishment']
        },
        mechanics: {
            max: 'calculated', // SPIR mod + 3
            current: 0,
            regen: 0,
            consumeVerb: 'banish',
            gainVerb: 'sanctify'
        },
        tooltip: {
            title: 'Spirit Charges: {current}/{max}',
            description: 'Holy energy for banishing evil and enhancing divine magic',
            showCharges: true,
            showHoly: true
        }
    },

    // HARROW PATH
    'Plaguebringer': {
        id: 'plagueStacks',
        name: 'Plague Stacks',
        shortName: 'PS',
        type: 'disease',
        description: 'Disease stacks spread among enemies, growing in power',
        visual: {
            type: 'progress-bar',
            count: 'variable',
            arrangement: 'horizontal',
            baseColor: '#2D4A17',
            activeColor: '#9ACD32',
            glowColor: '#ADFF2F',
            icon: '🦠',
            effects: ['disease', 'contagion']
        },
        mechanics: {
            max: 'unlimited',
            current: 0,
            regen: 0,
            consumeVerb: 'infect',
            gainVerb: 'cultivate'
        },
        tooltip: {
            title: 'Plague Stacks: {stacks} enemies infected',
            description: 'Disease spreads among enemies, growing stronger',
            showStacks: true,
            showContagion: true
        }
    },

    'Lichborne': {
        id: 'phylacteryCore',
        name: 'Essence Echoes',
        shortName: 'EE',
        type: 'undead',
        description: 'Soul fragments stored in phylactery for undead power',
        visual: {
            type: 'progress-bar',
            count: 'variable',
            arrangement: 'horizontal',
            baseColor: '#2D1B69',
            activeColor: '#9370DB',
            glowColor: '#DDA0DD',
            icon: '💀',
            effects: ['necrotic', 'souls']
        },
        mechanics: {
            max: 5, // 3-5 echoes max
            current: 0,
            regen: 0,
            consumeVerb: 'consume',
            gainVerb: 'harvest'
        },
        tooltip: {
            title: 'Essence Echoes: {current}/{max}',
            description: 'Soul fragments powering undead abilities',
            showEchoes: true,
            showPhylactery: true
        }
    },

    'Deathcaller': {
        id: 'soulCharges',
        name: 'Soul Charges',
        shortName: 'SC',
        type: 'necromancy',
        description: 'Harvested souls that fuel necromantic magic',
        visual: {
            type: 'progress-bar',
            count: 'variable',
            arrangement: 'horizontal',
            baseColor: '#1F1F1F',
            activeColor: '#8A2BE2',
            glowColor: '#9932CC',
            icon: '⚰️',
            effects: ['necromantic', 'souls']
        },
        mechanics: {
            max: 'calculated', // SPIR mod + level/3
            current: 0,
            regen: 0,
            consumeVerb: 'expend',
            gainVerb: 'reap'
        },
        tooltip: {
            title: 'Soul Charges: {current}/{max}',
            description: 'Harvested souls for necromantic power',
            showCharges: true,
            showSouls: true
        }
    }
};

// Helper function to get class resource configuration
export const getClassResourceConfig = (className) => {
    return CLASS_RESOURCE_TYPES[className] || null;
};

// Helper function to initialize class resource based on character stats
export const initializeClassResource = (className, characterStats) => {
    const config = getClassResourceConfig(className);
    if (!config) return null;

    const level = characterStats.level || 1;
    const baseResource = {
        type: config.id,
        current: config.mechanics.current,
        max: config.mechanics.max,
        stacks: [],
        phase: config.mechanics.phase || null,
        threshold: 0,
        slots: [],
        charges: 0,
        volatility: config.mechanics.volatility || 0,
        strain: config.mechanics.strain || 0,
        risk: config.mechanics.risk || 0,
        flourish: config.mechanics.flourish || 0,
        stance: config.mechanics.stance || null,
        wardTokens: config.mechanics.wardTokens || 0,
        precision: config.mechanics.precision || 0,
        activeEffects: [],
        lastUpdate: Date.now()
    };

    // Calculate max based on character stats for certain classes
    if (config.mechanics.max === 'calculated') {
        const intMod = Math.floor((characterStats.intelligence - 10) / 2);
        const chaMod = Math.floor((characterStats.charisma - 10) / 2);
        const spirMod = Math.floor((characterStats.spirit - 10) / 2);
        const conMod = Math.floor((characterStats.constitution - 10) / 2);

        switch (className) {
            case 'Chaos Weaver':
                baseResource.max = Math.max(5, intMod + Math.floor(level / 5));
                break;
            case 'Gambler':
            case 'False Prophet':
                baseResource.max = Math.max(1, chaMod + 5);
                break;
            case 'Exorcist':
                baseResource.max = Math.max(1, spirMod + 3);
                break;
            case 'Martyr':
                baseResource.max = Math.max(1, conMod + 3);
                break;
            case 'Deathcaller':
                baseResource.max = Math.max(1, spirMod + Math.floor(level / 3));
                break;
            case 'Spellguard':
                baseResource.max = Math.max(1, intMod + 5);
                break;
            case 'Inscriptor':
                baseResource.max = Math.max(3, 3 + intMod);
                break;
            case 'Witch Doctor':
                baseResource.max = Math.max(1, 5 + spirMod);
                break;
            case 'Dreadnaught':
                baseResource.max = Math.max(1, 5 + conMod);
                break;
            case 'Toxicologist':
                baseResource.max = Math.max(1, intMod + 3);
                break;
            case 'Covenbane':
                baseResource.max = Math.max(1, spirMod + 5);
                break;
            case 'Lunarch':
                // Lunar charge max varies by phase
                baseResource.max = baseResource.phase === 'full' ? 10 : baseResource.phase === 'new' ? 3 : 6;
                break;
            default:
                baseResource.max = 5; // Default fallback
        }
    }

    return baseResource;
};

// Helper function to update class resource max values when stats change
export const updateClassResourceMax = (classResource, className, characterStats) => {
    const config = getClassResourceConfig(className);
    if (!config || !classResource) return classResource;

    if (config.mechanics.max === 'calculated') {
        const updatedResource = initializeClassResource(className, characterStats);
        return {
            ...classResource,
            max: updatedResource.max
        };
    }

    return classResource;
};

// Add remaining classes - ARCANIST PATH
CLASS_RESOURCE_TYPES['Spellguard'] = {
    id: 'wardPoints',
    name: 'Ward Points',
    shortName: 'WP',
    type: 'protection',
    description: 'Protective ward layers that absorb magical damage',
    visual: {
        type: 'progress-bar',
        count: 'variable',
        arrangement: 'horizontal',
        baseColor: '#1E3A8A',
        activeColor: '#87CEEB',
        glowColor: '#E0E6FF',
        icon: '🛡️',
        effects: ['abjuration', 'protection']
    },
    mechanics: {
        max: 'calculated', // INT mod + 5
        current: 0,
        regen: 0,
        consumeVerb: 'absorb',
        gainVerb: 'ward'
    },
    tooltip: {
        title: 'Ward Points: {current}/{max}',
        description: 'Protective barriers that absorb magical damage',
        showWards: true,
        showAbsorption: true
    }
};

CLASS_RESOURCE_TYPES['Inscriptor'] = {
    id: 'glyphSlots',
    name: 'Glyph Slots',
    shortName: 'GS',
    type: 'runic',
    description: 'Runic glyphs that can be inscribed and connected in magical circuits',
    visual: {
        type: 'progress-bar',
        count: 'calculated',
        arrangement: 'horizontal',
        baseColor: '#4A2C0A',
        activeColor: '#FFD700',
        glowColor: '#FFA500',
        icon: '🔮',
        effects: ['runic', 'inscription']
    },
    mechanics: {
        max: 'calculated',
        current: 0,
        regen: 0,
        consumeVerb: 'inscribe',
        gainVerb: 'charge'
    },
    tooltip: {
        title: 'Glyph Slots: {current}/{max} | Circuits: {circuits}',
        description: 'Runic glyphs connected in magical circuits',
        showGlyphs: true,
        showCircuits: true
    }
};

CLASS_RESOURCE_TYPES['Arcanoneer'] = {
    id: 'elementSlots',
    name: 'Element Slots',
    shortName: 'ES',
    type: 'elemental',
    description: 'Elemental runes loaded into cannon chamber with volatility risk',
    visual: {
        type: 'progress-bar',
        count: 6,
        arrangement: 'horizontal',
        baseColor: '#1F2F2F',
        activeColor: '#FF6347',
        glowColor: '#FFA500',
        volatilityColor: '#DC143C',
        icon: '💥',
        effects: ['elemental', 'volatility']
    },
    mechanics: {
        max: 6,
        current: 0,
        volatility: 0,
        regen: 0,
        consumeVerb: 'fire',
        gainVerb: 'load'
    },
    tooltip: {
        title: 'Elements: {current}/6 | Volatility: {volatility}%',
        description: 'Elemental runes with explosion risk at high volatility',
        showElements: true,
        showVolatility: true
    }
};

// HEXER PATH
CLASS_RESOURCE_TYPES['Witch Doctor'] = {
    id: 'voodooEssence',
    name: 'Voodoo Essence',
    shortName: 'VE',
    type: 'spiritual',
    description: 'Spiritual essence for invoking loa spirits and voodoo magic',
    visual: {
        type: 'progress-bar',
        count: 'calculated',
        arrangement: 'horizontal',
        baseColor: '#4A2C0A',
        activeColor: '#32CD32',
        glowColor: '#ADFF2F',
        icon: '🎭',
        effects: ['spiritual', 'tribal']
    },
    mechanics: {
        max: 'calculated',
        current: 0,
        regen: 0,
        consumeVerb: 'invoke',
        gainVerb: 'channel'
    },
    tooltip: {
        title: 'Voodoo Essence: {current}/{max} | Loa: {loa}',
        description: 'Spiritual essence for invoking loa spirits',
        showEssence: true,
        showLoa: true
    }
};

CLASS_RESOURCE_TYPES['Formbender'] = {
    id: 'wildInstinct',
    name: 'Wild Instinct',
    shortName: 'WI',
    type: 'primal',
    description: 'Primal instinct energy for shapeshifting and wild abilities',
    visual: {
        type: 'progress-bar',
        count: 5,
        arrangement: 'horizontal',
        baseColor: '#0F4B0F',
        activeColor: '#32CD32',
        glowColor: '#90EE90',
        icon: '🐺',
        effects: ['primal', 'transformation']
    },
    mechanics: {
        max: 5,
        current: 0,
        regen: 0,
        consumeVerb: 'shift',
        gainVerb: 'attune'
    },
    tooltip: {
        title: 'Wild Instinct: {current}/5 | Form: {form}',
        description: 'Primal energy for shapeshifting abilities',
        showInstinct: true,
        showForm: true
    }
};

CLASS_RESOURCE_TYPES['Primalist'] = {
    id: 'primalResonance',
    name: 'Primal Resonance',
    shortName: 'PR',
    type: 'elemental',
    description: 'Elemental resonance connecting to active totems',
    visual: {
        type: 'progress-bar',
        count: 6,
        arrangement: 'horizontal',
        baseColor: '#4A2C0A',
        activeColor: '#FF6347',
        glowColor: '#FFA500',
        icon: '🗿',
        effects: ['elemental', 'totemic']
    },
    mechanics: {
        max: 6,
        current: 0,
        regen: 0,
        consumeVerb: 'resonate',
        gainVerb: 'attune'
    },
    tooltip: {
        title: 'Primal Resonance: {current}/6 | Totems: {totems}',
        description: 'Elemental energy linking to active totems',
        showResonance: true,
        showTotems: true
    }
};

// REAVER PATH
CLASS_RESOURCE_TYPES['Berserker'] = {
    id: 'furyPoints',
    name: 'Fury Points',
    shortName: 'FP',
    type: 'rage',
    description: 'Fury that builds through combat with threshold bonuses',
    visual: {
        type: 'progress-bar',
        count: 15,
        arrangement: 'horizontal',
        baseColor: '#4A0000',
        activeColor: '#FF4500',
        glowColor: '#FF6347',
        icon: '⚔️',
        effects: ['rage', 'fury']
    },
    mechanics: {
        max: 15,
        current: 0,
        regen: 0,
        consumeVerb: 'rage',
        gainVerb: 'fury'
    },
    tooltip: {
        title: 'Fury: {current}/15 | Threshold: {threshold}',
        description: 'Battle fury with escalating power thresholds',
        showFury: true,
        showThresholds: true
    },
    thresholds: [
        { value: 5, name: 'Ember', effects: ['+10% damage'] },
        { value: 10, name: 'Blaze', effects: ['+20% damage', '+1 attack'] },
        { value: 15, name: 'Inferno', effects: ['+30% damage', '+2 attacks', 'Intimidating Presence'] }
    ]
};

CLASS_RESOURCE_TYPES['Dreadnaught'] = {
    id: 'guardPoints',
    name: 'Guard Points',
    shortName: 'GP',
    type: 'fortress',
    description: 'Defensive guard points and siege weapon stacks',
    visual: {
        type: 'progress-bar',
        count: 'calculated',
        arrangement: 'horizontal',
        baseColor: '#1F2F2F',
        activeColor: '#708090',
        glowColor: '#C0C0C0',
        icon: '🏰',
        effects: ['fortress', 'siege']
    },
    mechanics: {
        max: 'calculated',
        current: 0,
        regen: 0,
        consumeVerb: 'fortify',
        gainVerb: 'guard'
    },
    tooltip: {
        title: 'Guard Points: {current}/{max} | Siege: {siege}',
        description: 'Fortress defenses and siege weapon power',
        showGuard: true,
        showSiege: true
    }
};

CLASS_RESOURCE_TYPES['Titan'] = {
    id: 'gravitasGauge',
    name: 'Gravitas Gauge',
    shortName: 'GG',
    type: 'gravity',
    description: 'Gravitational energy with strain overload risk',
    visual: {
        type: 'progress-bar',
        count: 15,
        arrangement: 'horizontal',
        baseColor: '#2D1B69',
        activeColor: '#6A5ACD',
        glowColor: '#9370DB',
        strainColor: '#DC143C',
        icon: '🌌',
        effects: ['gravity', 'strain']
    },
    mechanics: {
        max: 15,
        current: 0,
        strain: 0,
        regen: 0,
        consumeVerb: 'manipulate',
        gainVerb: 'accumulate'
    },
    tooltip: {
        title: 'Gravitas: {current}/15 | Strain: {strain}',
        description: 'Gravitational power with overload consequences',
        showGravitas: true,
        showStrain: true
    }
};

// MERCENARY PATH
CLASS_RESOURCE_TYPES['Toxicologist'] = {
    id: 'vialsReagents',
    name: 'Vials & Reagents',
    shortName: 'VR',
    type: 'alchemy',
    description: 'Alchemical vials and reagents for poison crafting',
    visual: {
        type: 'progress-bar',
        count: 'calculated',
        arrangement: 'horizontal',
        baseColor: '#2D4A17',
        activeColor: '#9ACD32',
        glowColor: '#ADFF2F',
        icon: '🧪',
        effects: ['alchemy', 'poison']
    },
    mechanics: {
        max: 'calculated',
        current: 0,
        regen: 0,
        consumeVerb: 'brew',
        gainVerb: 'distill'
    },
    tooltip: {
        title: 'Vials: {current}/{max} | Reagents: {reagents}',
        description: 'Alchemical supplies for poison and potion crafting',
        showVials: true,
        showReagents: true
    }
};

CLASS_RESOURCE_TYPES['Covenbane'] = {
    id: 'sealTokens',
    name: 'Seal Tokens',
    shortName: 'ST',
    type: 'anti-magic',
    description: 'Anti-magic seals and dispel energy for witch hunting',
    visual: {
        type: 'progress-bar',
        count: 'variable',
        arrangement: 'horizontal',
        baseColor: '#1E3A8A',
        activeColor: '#87CEEB',
        glowColor: '#E0E6FF',
        icon: '🔒',
        effects: ['anti-magic', 'dispel']
    },
    mechanics: {
        max: 'calculated', // SPIR mod + 5
        current: 0,
        regen: 0,
        consumeVerb: 'seal',
        gainVerb: 'ward'
    },
    tooltip: {
        title: 'Seal Tokens: {current} | Dispel: {dispel} | Wards: {wards}',
        description: 'Anti-magic tools for countering witchcraft',
        showSeals: true,
        showDispel: true
    }
};

CLASS_RESOURCE_TYPES['Bladedancer'] = {
    id: 'edgeFlourish',
    name: 'Edge & Flourish',
    shortName: 'EF',
    type: 'finesse',
    description: 'Combat edge and flourish tokens with stance bonuses',
    visual: {
        type: 'progress-bar',
        count: 10,
        arrangement: 'horizontal',
        baseColor: '#606060',
        activeColor: '#FFD700',
        glowColor: '#FFA500',
        icon: '⚡',
        effects: ['finesse', 'grace']
    },
    mechanics: {
        max: 10,
        current: 0,
        flourish: 0,
        stance: 'balanced',
        regen: 0,
        consumeVerb: 'flourish',
        gainVerb: 'flow'
    },
    tooltip: {
        title: 'Edge: {current}/10 | Flourish: {flourish} | Stance: {stance}',
        description: 'Combat flow with graceful flourishes and stances',
        showEdge: true,
        showFlourish: true,
        showStance: true
    }
};

// SENTINEL PATH
CLASS_RESOURCE_TYPES['Lunarch'] = {
    id: 'lunarCharge',
    name: 'Lunar Charge',
    shortName: 'LC',
    type: 'lunar',
    description: 'Lunar energy that changes with moon phases',
    visual: {
        type: 'progress-bar',
        count: 'variable',
        arrangement: 'horizontal',
        baseColor: '#1F1F2F',
        activeColor: '#E6E6FA',
        glowColor: '#F8F8FF',
        icon: '🌙',
        effects: ['lunar', 'celestial']
    },
    mechanics: {
        max: 'calculated', // Based on current phase
        current: 0,
        phase: 'full',
        regen: 0,
        consumeVerb: 'channel',
        gainVerb: 'absorb'
    },
    tooltip: {
        title: 'Lunar Charge: {current}/{max} | Phase: {phase}',
        description: 'Moonlight energy varying with lunar phases',
        showCharge: true,
        showPhase: true
    }
};

CLASS_RESOURCE_TYPES['Huntress'] = {
    id: 'quarryTracking',
    name: 'Quarry Tracking',
    shortName: 'QT',
    type: 'hunter',
    description: 'Quarry marks and precision stacks for enhanced hunting',
    visual: {
        type: 'progress-bar',
        count: 'variable',
        arrangement: 'horizontal',
        baseColor: '#4A2C0A',
        activeColor: '#FF6347',
        glowColor: '#FFA500',
        icon: '🎯',
        effects: ['tracking', 'precision']
    },
    mechanics: {
        max: 'unlimited',
        current: 0,
        precision: 0,
        regen: 0,
        consumeVerb: 'track',
        gainVerb: 'mark'
    },
    tooltip: {
        title: 'Quarry: {quarry} | Precision: {precision}',
        description: 'Marked quarry and accumulated precision bonuses',
        showQuarry: true,
        showPrecision: true
    }
};

// Update the helper functions to work with the new configuration structure
export const getAllClassNames = () => {
    return Object.keys(CLASS_RESOURCE_TYPES);
};

// Helper function to get resource display text
export const getResourceDisplayText = (classResource, config) => {
    if (!classResource || !config) return '';

    switch (config.type) {
        case 'stages':
            return `Stage ${classResource.current}`;
        case 'notes':
            return `${classResource.stacks?.length || 0}/7 Notes`;
        case 'gauge':
            return `${classResource.current}/${classResource.max} ${config.shortName}`;
        case 'entropy':
            return `${classResource.current}/${classResource.max} EP`;
        case 'cards':
            return `${classResource.current} Cards`;
        case 'gambling':
            return `Luck: ${classResource.current} | Risk: ${classResource.risk || 0}`;
        default:
            return `${classResource.current}/${classResource.max} ${config.shortName}`;
    }
};

CLASS_RESOURCE_TYPES['Warden'] = {
    id: 'bulwarkMeter',
    name: 'Bulwark Meter',
    shortName: 'BM',
    type: 'protection',
    description: 'Protective barrier strength with ward token rewards',
    visual: {
        type: 'progress-bar',
        count: 12,
        arrangement: 'horizontal',
        baseColor: '#1E3A8A',
        activeColor: '#87CEEB',
        glowColor: '#E0E6FF',
        icon: '🛡️',
        effects: ['protection', 'barriers']
    },
    mechanics: {
        max: 12,
        current: 0,
        wardTokens: 0,
        regen: 0,
        consumeVerb: 'protect',
        gainVerb: 'fortify'
    },
    tooltip: {
        title: 'Bulwark: {current}/12 | Ward Tokens: {tokens}',
        description: 'Protective barriers with ward token rewards',
        showBulwark: true,
        showTokens: true
    },
    thresholds: [
        { value: 4, name: 'Ward Token', effects: ['Earn 1 Ward Token'] },
        { value: 8, name: 'Ward Token', effects: ['Earn 1 Ward Token'] },
        { value: 12, name: 'Ward Token', effects: ['Earn 1 Ward Token'] }
    ]
};