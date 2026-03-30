import {
  faFire,
  faHeart,
  faWandMagic,
  faSkull,
  faGauge,
  faShield,
  faHandSparkles,
  faDroplet
} from '@fortawesome/free-solid-svg-icons';

// Import effect components
import DamageEffects from '../../data/effects/DamageEffects.jsx';
import HealingEffects from '../../data/effects/HealingEffects.jsx';
import BuffEffects from '../../data/effects/BuffEffects.jsx';
import DebuffEffects from '../../data/effects/DebuffEffects.jsx';
import UtilityEffects from '../../data/effects/UtilityEffects.jsx';
import ControlEffects from '../../data/effects/ControlEffects.jsx';
import SummoningEffects from '../../data/effects/SummoningEffects.jsx';
import TransformationEffects from '../../data/effects/TransformationEffects.jsx';
import PurificationEffects from '../../data/effects/PurificationEffects.jsx';
import RestorationEffects from '../../data/effects/RestorationEffects.jsx';

const EFFECT_TYPES = [
    {
      id: 'damage',
      name: 'Damage',
      description: 'Deal damage to targets',
      icon: faFire,
      category: 'offensive',
      actionPointCost: 2
    },
    {
      id: 'healing',
      name: 'Healing',
      description: 'Restore health to targets',
      icon: faHeart,
      category: 'supportive',
      actionPointCost: 2
    },
    {
      id: 'buff',
      name: 'Buff',
      description: 'Apply positive effects to allies',
      icon: faWandMagic,
      category: 'supportive',
      actionPointCost: 1
    },
    {
      id: 'debuff',
      name: 'Debuff',
      description: 'Apply negative effects to enemies',
      icon: faSkull,
      category: 'offensive',
      actionPointCost: 1
    },
    {
      id: 'utility',
      name: 'Utility',
      description: 'Create various non-combat effects',
      icon: faGauge,
      category: 'utility',
      actionPointCost: 1
    },
    {
      id: 'control',
      name: 'Control',
      description: 'Manipulate battlefield positioning and enemy actions',
      icon: faShield,
      category: 'tactical',
      actionPointCost: 2
    },
    {
      id: 'summoning',
      name: 'Summoning',
      description: 'Summon allies or creatures to assist in battle',
      icon: 'spell_shadow_summoninfernal',
      category: 'conjuration',
      actionPointCost: 3
    },
    {
      id: 'transformation',
      name: 'Transformation',
      description: 'Change form or properties of targets',
      icon: 'spell_nature_elementalshields',
      category: 'alteration',
      actionPointCost: 2
    },
    {
      id: 'purification',
      name: 'Purification',
      description: 'Dispel effects, cleanse ailments, or resurrect allies',
      icon: faHandSparkles,
      category: 'supportive',
      actionPointCost: 2
    },
    {
      id: 'restoration',
      name: 'Restoration',
      description: 'Restore resources like mana, rage, energy, etc.',
      icon: faDroplet,
      category: 'supportive',
      actionPointCost: 2
    }
];

const getEffectTypeById = (id) => {
    return EFFECT_TYPES.find(effectType => effectType.id === id) || null;
};

const getEffectTypesByCategory = (category) => {
    if (!category) return EFFECT_TYPES;
    return EFFECT_TYPES.filter(effect => effect.category === category);
};

// Get the display label for an effect type
const getEffectTypeLabel = (id) => {
    const effectType = getEffectTypeById(id);
    return effectType ? effectType.name : 'Unknown Effect';
};

// Get the description for an effect type
const getEffectTypeDescription = (id) => {
    const effectType = getEffectTypeById(id);
    return effectType ? effectType.description : '';
};

// Get the appropriate component for an effect type
const getEffectTypeComponent = (id) => {
    switch(id) {
        case 'damage':
            return DamageEffects;
        case 'healing':
            return HealingEffects;
        case 'buff':
            return BuffEffects;
        case 'debuff':
            return DebuffEffects;
        case 'utility':
            return UtilityEffects;
        case 'control':
            return ControlEffects;
        case 'summoning':
            return SummoningEffects;
        case 'transformation':
            return TransformationEffects;
        case 'purification':
            return PurificationEffects;
        case 'restoration':
            return RestorationEffects;
        default:
            return null;
    }
};

const calculateEffectActionPointCost = (effectIds, configOptions = {}) => {
    if (!effectIds || !effectIds.length) return 0;

    // Base cost from effect types
    let baseCost = effectIds.reduce((total, effectId) => {
        const effect = getEffectTypeById(effectId);
        return total + (effect ? effect.actionPointCost : 0);
    }, 0);

    // Apply any action point efficiency
    if (configOptions.actionPointEfficiency) {
        baseCost = Math.max(1, Math.floor(baseCost * (1 - configOptions.actionPointEfficiency / 100)));
    }

    return Math.max(1, baseCost); // Minimum cost of 1
};

const formatActionPointCost = (cost) => {
    return `${cost} AP`;
};

export {
    EFFECT_TYPES,
    getEffectTypeById,
    getEffectTypesByCategory,
    getEffectTypeLabel,
    getEffectTypeDescription,
    getEffectTypeComponent,
    calculateEffectActionPointCost,
    formatActionPointCost
};