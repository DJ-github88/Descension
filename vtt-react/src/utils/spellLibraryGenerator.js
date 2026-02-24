/**
 * Spell Library Generator
 * 
 * This utility generates high-quality, original spells that fully utilize
 * the spell wizard's capabilities while avoiding WoW-like naming conventions.
 */

// Original spell themes and concepts
const SPELL_THEMES = {
  ELEMENTAL: {
    name: 'Elemental',
    concepts: ['primal', 'essence', 'manifestation', 'convergence', 'resonance'],
    elements: ['flame', 'frost', 'storm', 'earth', 'void', 'radiance', 'shadow']
  },
  ARCANE: {
    name: 'Arcane',
    concepts: ['weave', 'nexus', 'confluence', 'matrix', 'paradigm', 'theorem'],
    modifiers: ['twisted', 'pure', 'chaotic', 'ordered', 'ancient', 'forbidden']
  },
  DIVINE: {
    name: 'Divine',
    concepts: ['blessing', 'wrath', 'grace', 'judgment', 'sanctuary', 'covenant'],
    sources: ['celestial', 'sacred', 'hallowed', 'divine', 'blessed', 'righteous']
  },
  NATURE: {
    name: 'Nature',
    concepts: ['growth', 'decay', 'cycle', 'harmony', 'wildness', 'balance'],
    aspects: ['verdant', 'withering', 'blooming', 'thorned', 'rooted', 'flowing']
  },
  MIND: {
    name: 'Mind',
    concepts: ['thought', 'memory', 'dream', 'nightmare', 'insight', 'madness'],
    effects: ['piercing', 'soothing', 'fragmenting', 'unifying', 'expanding']
  },
  TEMPORAL: {
    name: 'Temporal',
    concepts: ['moment', 'eternity', 'acceleration', 'stasis', 'echo', 'paradox'],
    aspects: ['fleeting', 'eternal', 'swift', 'frozen', 'recursive', 'displaced']
  }
};

// Spell name generation patterns
const NAME_PATTERNS = [
  '{adjective} {concept}',
  '{concept} of {source}',
  '{adjective} {concept} of {element}',
  '{source}\'s {concept}',
  '{element} {concept}',
  '{concept} {modifier}',
  '{adjective} {element} {concept}'
];

// Quality adjectives for spell names
const QUALITY_ADJECTIVES = [
  'Ethereal', 'Sublime', 'Profound', 'Resonant', 'Luminous', 'Umbral',
  'Crystalline', 'Flowing', 'Piercing', 'Gentle', 'Fierce', 'Serene',
  'Volatile', 'Stable', 'Prismatic', 'Monolithic', 'Delicate', 'Robust'
];

// Advanced spell formulas that create interesting mechanics
const ADVANCED_FORMULAS = {
  SCALING_DAMAGE: [
    '1d4 + level', '2d6 + (level * 2)', '1d8 + (level / 2)',
    '3d4 + level', '1d10 + (level * 1.5)', '2d8 + level'
  ],
  PROGRESSIVE_HEALING: [
    '1d6 + 2, then 1d4 per round for 3 rounds',
    '2d4 + 4, increasing by 1d4 each round for 4 rounds',
    '1d8 + level, then half amount for 2 rounds'
  ],
  CONDITIONAL_EFFECTS: [
    '2d6 + 4, +1d6 if target is below half health',
    '1d8 + 2, double if target has no armor',
    '3d4 + level, +2d4 if cast at night'
  ]
};

/**
 * Generate a unique spell name based on theme and pattern
 */
function generateSpellName(theme, pattern) {
  const themeData = SPELL_THEMES[theme];
  const adjective = QUALITY_ADJECTIVES[Math.floor(Math.random() * QUALITY_ADJECTIVES.length)];
  const concept = themeData.concepts[Math.floor(Math.random() * themeData.concepts.length)];
  
  let name = pattern;
  name = name.replace('{adjective}', adjective);
  name = name.replace('{concept}', concept);
  
  // Replace theme-specific placeholders
  if (themeData.elements && name.includes('{element}')) {
    const element = themeData.elements[Math.floor(Math.random() * themeData.elements.length)];
    name = name.replace('{element}', element);
  }
  
  if (themeData.sources && name.includes('{source}')) {
    const source = themeData.sources[Math.floor(Math.random() * themeData.sources.length)];
    name = name.replace('{source}', source);
  }
  
  if (themeData.modifiers && name.includes('{modifier}')) {
    const modifier = themeData.modifiers[Math.floor(Math.random() * themeData.modifiers.length)];
    name = name.replace('{modifier}', modifier);
  }
  
  if (themeData.aspects && name.includes('{aspect}')) {
    const aspect = themeData.aspects[Math.floor(Math.random() * themeData.aspects.length)];
    name = name.replace('{aspect}', aspect);
  }
  
  return name;
}

/**
 * Generate a spell description based on theme and effects
 */
function generateSpellDescription(name, theme, effectTypes, spellType) {
  const themeData = SPELL_THEMES[theme];
  const effectDescriptions = {
    damage: 'channels destructive energy',
    healing: 'mends wounds and restores vitality',
    buff: 'enhances the target with beneficial magic',
    debuff: 'weakens the target with hindering magic',
    control: 'manipulates the battlefield',
    utility: 'provides practical magical assistance',
    summoning: 'calls forth magical entities',
    transformation: 'alters the fundamental nature of the target'
  };
  
  const castingDescriptions = {
    ACTION: 'You focus your will and speak the incantation',
    CHANNELED: 'You maintain concentration while weaving the spell',
    REACTION: 'You instinctively respond with magical energy',
    PASSIVE: 'The magic flows through you constantly',
    TRAP: 'You carefully place magical energies that await activation',
    STATE: 'You attune yourself to respond to specific conditions'
  };
  
  const primaryEffect = effectTypes[0];
  const effectDesc = effectDescriptions[primaryEffect] || 'creates magical effects';
  const castingDesc = castingDescriptions[spellType] || 'You cast the spell';
  
  return `${castingDesc}, drawing upon ${themeData.name.toLowerCase()} forces. This spell ${effectDesc}, manifesting as ${name.toLowerCase()}. The magical energies resonate with the fundamental forces of ${themeData.name.toLowerCase()}, creating lasting effects that reflect the spell's true nature.`;
}

/**
 * Generate appropriate damage types based on theme
 */
function getDamageTypesForTheme(theme) {
  const themeDamageTypes = {
    ELEMENTAL: ['fire', 'cold', 'lightning', 'acid', 'thunder'],
    ARCANE: ['force', 'psychic', 'radiant'],
    DIVINE: ['radiant', 'necrotic', 'thunder'],
    NATURE: ['poison', 'acid', 'piercing', 'bludgeoning'],
    MIND: ['psychic', 'necrotic'],
    TEMPORAL: ['force', 'necrotic', 'radiant']
  };
  
  return themeDamageTypes[theme] || ['force'];
}

/**
 * Generate appropriate visual theme based on spell theme
 */
function getVisualThemeForTheme(theme) {
  const visualThemes = {
    ELEMENTAL: 'fire',
    ARCANE: 'arcane',
    DIVINE: 'holy',
    NATURE: 'nature',
    MIND: 'shadow',
    TEMPORAL: 'arcane'
  };
  
  return visualThemes[theme] || 'neutral';
}

/**
 * Generate a complete spell configuration
 */
export function generateSpell(theme, effectTypes, spellType = 'ACTION', level = 1) {
  const pattern = NAME_PATTERNS[Math.floor(Math.random() * NAME_PATTERNS.length)];
  const name = generateSpellName(theme, pattern);
  const description = generateSpellDescription(name, theme, effectTypes, spellType);
  const damageTypes = getDamageTypesForTheme(theme);
  const visualTheme = getVisualThemeForTheme(theme);
  
  const spell = {
    id: `generated-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name,
    description,
    level,
    spellType,
    effectTypes: [...effectTypes],
    damageTypes: effectTypes.includes('damage') ? [damageTypes[0]] : [],
    tags: [theme.toLowerCase(), ...effectTypes],
    visualTheme,
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    categoryIds: [],
    
    // Generate appropriate configurations based on effect types
    ...(effectTypes.includes('damage') && {
      damageConfig: generateDamageConfig(level, damageTypes[0])
    }),
    
    ...(effectTypes.includes('healing') && {
      healingConfig: generateHealingConfig(level)
    }),
    
    ...(effectTypes.includes('buff') && {
      buffConfig: generateBuffConfig(level)
    }),
    
    ...(effectTypes.includes('debuff') && {
      debuffConfig: generateDebuffConfig(level)
    }),
    
    // Always include targeting and resource configs
    targetingConfig: generateTargetingConfig(effectTypes, spellType),
    resourceCost: generateResourceCost(level, effectTypes.length),
    durationConfig: generateDurationConfig(effectTypes, spellType)
  };
  
  return spell;
}

/**
 * Generate damage configuration
 */
function generateDamageConfig(level, damageType) {
  const formulas = ADVANCED_FORMULAS.SCALING_DAMAGE;
  const formula = formulas[Math.floor(Math.random() * formulas.length)];
  
  return {
    damageType: 'direct',
    elementType: damageType,
    formula: formula.replace('level', level.toString()),
    hasDotEffect: Math.random() < 0.3,
    ...(Math.random() < 0.3 && {
      dotFormula: '1d4',
      dotDuration: 3,
      dotTickType: 'round'
    }),
    criticalConfig: {
      enabled: true,
      critType: 'dice',
      critMultiplier: 2,
      critDiceOnly: false
    }
  };
}

/**
 * Generate healing configuration
 */
function generateHealingConfig(level) {
  return {
    healingType: 'direct',
    formula: `${Math.max(1, Math.floor(level/2))}d6 + ${level * 2}`,
    hasHotEffect: Math.random() < 0.4,
    hasShieldEffect: Math.random() < 0.2,
    ...(Math.random() < 0.4 && {
      hotFormula: '1d4 + 1',
      hotDuration: 3,
      hotTickType: 'round'
    }),
    criticalConfig: {
      enabled: true,
      critType: 'dice',
      critMultiplier: 2
    }
  };
}

/**
 * Generate buff configuration
 */
function generateBuffConfig(level) {
  const statModifiers = ['strength', 'agility', 'constitution', 'intelligence', 'spirit', 'charisma'];
  const selectedStat = statModifiers[Math.floor(Math.random() * statModifiers.length)];
  
  return {
    buffs: [
      {
        name: 'Magical Enhancement',
        description: `Enhances ${selectedStat} through magical means`,
        duration: 300 + (level * 60),
        effects: {
          statModifiers: {
            [selectedStat]: Math.max(1, Math.floor(level / 2) + 1)
          }
        }
      }
    ]
  };
}

/**
 * Generate debuff configuration
 */
function generateDebuffConfig(level) {
  return {
    debuffs: [
      {
        name: 'Magical Hindrance',
        description: 'Impedes the target with magical interference',
        duration: 180 + (level * 30),
        effects: {
          statModifiers: {
            agility: -(Math.max(1, Math.floor(level / 2) + 1))
          }
        }
      }
    ]
  };
}

/**
 * Generate targeting configuration
 */
function generateTargetingConfig(effectTypes, spellType) {
  const isOffensive = effectTypes.includes('damage') || effectTypes.includes('debuff');
  const isSupportive = effectTypes.includes('healing') || effectTypes.includes('buff');
  
  if (spellType === 'ZONE') {
    return {
      targetingType: 'area',
      aoeShape: 'circle',
      aoeParameters: { radius: 20 },
      range: 60,
      validTargets: isOffensive ? ['enemy'] : isSupportive ? ['ally', 'self'] : ['any']
    };
  }
  
  return {
    targetingType: Math.random() < 0.7 ? 'single' : 'area',
    range: Math.random() < 0.3 ? 5 : 30 + Math.floor(Math.random() * 90),
    validTargets: isOffensive ? ['enemy'] : isSupportive ? ['ally', 'self'] : ['any'],
    ...(Math.random() < 0.3 && {
      aoeShape: 'circle',
      aoeParameters: { radius: 15 }
    })
  };
}

/**
 * Generate resource cost
 */
function generateResourceCost(level, effectCount) {
  const baseCost = 10 + (level * 5) + (effectCount * 5);
  return {
    mana: { baseAmount: baseCost }
  };
}

/**
 * Generate duration configuration
 */
function generateDurationConfig(effectTypes, spellType) {
  const needsDuration = effectTypes.some(type => ['buff', 'debuff', 'control'].includes(type));
  
  if (!needsDuration || spellType === 'ACTION') {
    return {
      durationType: 'instant',
      durationValue: 0
    };
  }
  
  return {
    durationType: 'rounds',
    durationValue: 3 + Math.floor(Math.random() * 5)
  };
}
