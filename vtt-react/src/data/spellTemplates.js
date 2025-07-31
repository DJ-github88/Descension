/**
 * Spell Templates - Predefined templates for quick spell creation
 * These templates provide starting points for different spell types across classes.
 */

// Base template that all specific templates extend
const BASE_TEMPLATE = {
    name: '',
    description: '',
    source: 'class',
    class: '',
    spellType: 'active',
    flavorText: '',
    targetingMode: 'single',
    rangeType: 'ranged',
    range: 30,
    cooldownCategory: 'short',
    cooldownValue: 6,
    cooldownUnit: 'seconds',
    castTimeType: 'instant',
    castTimeValue: 0,
    triggersGlobalCooldown: true,
    usableWhileMoving: true,
    requiresLoS: true,
    interruptible: true
  };
  
  // Template categories
  export const TEMPLATE_CATEGORIES = {
    DAMAGE: 'damage',
    HEALING: 'healing',
    BUFF: 'buff',
    DEBUFF: 'debuff',
    UTILITY: 'utility'
  };
  
  // Damage Templates
  const DAMAGE_TEMPLATES = {
    // Direct damage spell
    DIRECT_DAMAGE: {
      ...BASE_TEMPLATE,
      name: 'Direct Damage',
      description: 'A quick direct damage spell that deals immediate damage to a single target.',
      category: 'damage',
      subtype: 'direct',
      damageTypes: ['fire'],
      primaryDamage: {
        dice: '2d6',
        flat: 4,
        procChance: 100
      },
      resourceCosts: {
        mana: { baseAmount: 20 }
      },
      complexity: 'basic',
      tags: ['offensive', 'damage'],
      cooldownCategory: 'short',
      cooldownValue: 3,
      visualTheme: 'fire'
    },
    
    // Area of Effect damage spell
    AOE_DAMAGE: {
      ...BASE_TEMPLATE,
      name: 'Area Damage',
      description: 'A powerful spell that deals damage to all enemies in the target area.',
      category: 'damage',
      subtype: 'aoe',
      targetingMode: 'aoe',
      aoeShape: 'circle',
      aoeSize: 8,
      damageTypes: ['frost'],
      primaryDamage: {
        dice: '3d6',
        flat: 6,
        procChance: 100
      },
      resourceCosts: {
        mana: { baseAmount: 35 }
      },
      complexity: 'intermediate',
      tags: ['offensive', 'damage', 'aoe'],
      cooldownCategory: 'medium',
      cooldownValue: 12,
      castTimeType: 'short',
      castTimeValue: 1.5,
      visualTheme: 'frost'
    },
    
    // Damage Over Time spell
    DOT_DAMAGE: {
      ...BASE_TEMPLATE,
      name: 'Damage Over Time',
      description: 'Afflicts the target with a condition that deals damage over time.',
      category: 'damage',
      subtype: 'dot',
      damageTypes: ['shadow'],
      isDot: true,
      dotDuration: 4,
      dotTick: '1d6',
      primaryDamage: {
        dice: '1d4',
        flat: 2,
        procChance: 100
      },
      resourceCosts: {
        mana: { baseAmount: 25 }
      },
      complexity: 'intermediate',
      tags: ['offensive', 'damage', 'dot'],
      cooldownCategory: 'short',
      cooldownValue: 6,
      visualTheme: 'shadow'
    },
    
    // Channeled damage spell
    CHANNELED_DAMAGE: {
      ...BASE_TEMPLATE,
      name: 'Channeled Damage',
      description: 'Channel a beam of energy that deals increasing damage while maintained.',
      category: 'damage',
      subtype: 'direct',
      damageTypes: ['arcane'],
      primaryDamage: {
        dice: '1d4',
        flat: 2,
        procChance: 100
      },
      resourceCosts: {
        mana: { baseAmount: 15 }
      },
      castTimeType: 'channeled',
      channelMaxTime: 5,
      complexity: 'advanced',
      tags: ['offensive', 'damage', 'channeled'],
      cooldownCategory: 'medium',
      cooldownValue: 8,
      usableWhileMoving: false,
      visualTheme: 'arcane'
    }
  };
  
  // Healing Templates
  const HEALING_TEMPLATES = {
    // Direct healing spell
    DIRECT_HEAL: {
      ...BASE_TEMPLATE,
      name: 'Direct Heal',
      description: 'A quick healing spell that instantly restores health to a single target.',
      category: 'healing',
      subtype: 'direct',
      healing: {
        dice: '2d8',
        flat: 5,
      },
      resourceCosts: {
        mana: { baseAmount: 25 }
      },
      complexity: 'basic',
      tags: ['healing'],
      cooldownCategory: 'short',
      cooldownValue: 4,
      visualTheme: 'holy'
    },
    
    // Area healing spell
    AOE_HEAL: {
      ...BASE_TEMPLATE,
      name: 'Area Healing',
      description: 'Heals all friendly targets in the target area.',
      category: 'healing',
      subtype: 'aoe',
      targetingMode: 'aoe',
      aoeShape: 'circle',
      aoeSize: 8,
      healing: {
        dice: '2d6',
        flat: 4,
      },
      resourceCosts: {
        mana: { baseAmount: 40 }
      },
      complexity: 'intermediate',
      tags: ['healing', 'aoe'],
      cooldownCategory: 'medium',
      cooldownValue: 15,
      castTimeType: 'short',
      castTimeValue: 2,
      visualTheme: 'holy'
    },
    
    // Healing over time spell
    HOT_HEAL: {
      ...BASE_TEMPLATE,
      name: 'Healing Over Time',
      description: 'Places a beneficial effect on the target that restores health over time.',
      category: 'healing',
      subtype: 'hot',
      healing: {
        dice: '1d4',
        flat: 2,
        isHoT: true,
        hotDuration: 5,
        hotTick: '1d6'
      },
      resourceCosts: {
        mana: { baseAmount: 30 }
      },
      complexity: 'intermediate',
      tags: ['healing', 'hot'],
      cooldownCategory: 'short',
      cooldownValue: 8,
      visualTheme: 'nature'
    }
  };
  
  // Buff Templates
  const BUFF_TEMPLATES = {
    // Stat buff
    STAT_BUFF: {
      ...BASE_TEMPLATE,
      name: 'Stat Enhancement',
      description: 'Enhances the target\'s attributes for a duration.',
      category: 'buff',
      subtype: 'stat',
      buffs: ['strengthen'],
      durationRounds: 5,
      durationRealTime: 30,
      durationUnit: 'seconds',
      resourceCosts: {
        mana: { baseAmount: 20 }
      },
      complexity: 'basic',
      tags: ['buff'],
      cooldownCategory: 'medium',
      cooldownValue: 20,
      visualTheme: 'arcane'
    },
    
    // Defensive buff
    DEFENSIVE_BUFF: {
      ...BASE_TEMPLATE,
      name: 'Defensive Shield',
      description: 'Surrounds the target with a protective barrier that absorbs damage.',
      category: 'buff',
      subtype: 'resist',
      buffs: ['shield'],
      durationRounds: 3,
      durationRealTime: 18,
      durationUnit: 'seconds',
      resourceCosts: {
        mana: { baseAmount: 30 }
      },
      complexity: 'intermediate',
      tags: ['buff', 'defensive'],
      cooldownCategory: 'medium',
      cooldownValue: 25,
      visualTheme: 'holy'
    },
    
    // Group buff / Aura
    AURA_BUFF: {
      ...BASE_TEMPLATE,
      name: 'Beneficial Aura',
      description: 'Creates an aura around the caster that enhances allies.',
      category: 'buff',
      subtype: 'utility',
      spellType: 'aura',
      auraEffects: [
        {
          name: 'Empowering Presence',
          effect: 'Increases attack power by 10%',
          range: 10,
          target: 'allies'
        }
      ],
      resourceCosts: {
        mana: { baseAmount: 40 }
      },
      complexity: 'advanced',
      tags: ['buff', 'aura'],
      cooldownCategory: 'long',
      cooldownValue: 60,
      visualTheme: 'holy'
    }
  };
  
  // Debuff Templates
  const DEBUFF_TEMPLATES = {
    // Crowd control debuff
    CROWD_CONTROL: {
      ...BASE_TEMPLATE,
      name: 'Crowd Control',
      description: 'Immobilizes the target, preventing movement for a duration.',
      category: 'debuff',
      subtype: 'cc',
      debuffs: ['root'],
      durationRounds: 3,
      durationRealTime: 8,
      durationUnit: 'seconds',
      resourceCosts: {
        mana: { baseAmount: 25 }
      },
      complexity: 'intermediate',
      tags: ['debuff', 'control'],
      cooldownCategory: 'medium',
      cooldownValue: 20,
      visualTheme: 'frost'
    },
    
    // Weakening debuff
    WEAKENING_DEBUFF: {
      ...BASE_TEMPLATE,
      name: 'Weaken',
      description: 'Reduces the target\'s strength and power for a duration.',
      category: 'debuff',
      subtype: 'stat',
      debuffs: ['weaken'],
      durationRounds: 4,
      durationRealTime: 24,
      durationUnit: 'seconds',
      resourceCosts: {
        mana: { baseAmount: 20 }
      },
      complexity: 'basic',
      tags: ['debuff'],
      cooldownCategory: 'short',
      cooldownValue: 15,
      visualTheme: 'shadow'
    },
    
    // Area debuff
    AOE_DEBUFF: {
      ...BASE_TEMPLATE,
      name: 'Area Debuff',
      description: 'Creates a zone that weakens all enemies inside it.',
      category: 'debuff',
      subtype: 'vulnerability',
      targetingMode: 'aoe',
      aoeShape: 'circle',
      aoeSize: 8,
      debuffs: ['vulnerability'],
      durationRounds: 3,
      durationRealTime: 10,
      durationUnit: 'seconds',
      resourceCosts: {
        mana: { baseAmount: 35 }
      },
      complexity: 'advanced',
      tags: ['debuff', 'aoe'],
      cooldownCategory: 'medium',
      cooldownValue: 25,
      castTimeType: 'short',
      castTimeValue: 1.5,
      visualTheme: 'poison'
    }
  };
  
  // Utility Templates
  const UTILITY_TEMPLATES = {
    // Movement utility
    MOVEMENT_UTILITY: {
      ...BASE_TEMPLATE,
      name: 'Blink',
      description: 'Instantly teleport a short distance.',
      category: 'utility',
      subtype: 'mobility',
      durationRounds: 0,
      durationRealTime: 0,
      resourceCosts: {
        mana: { baseAmount: 15 }
      },
      complexity: 'basic',
      tags: ['utility', 'mobility'],
      cooldownCategory: 'medium',
      cooldownValue: 15,
      visualTheme: 'arcane'
    },
    
    // Detection utility
    DETECTION_UTILITY: {
      ...BASE_TEMPLATE,
      name: 'Detect Magic',
      description: 'Reveals magical auras, hidden objects, and invisible creatures.',
      category: 'utility',
      subtype: 'detection',
      durationRounds: 5,
      durationRealTime: 30,
      durationUnit: 'seconds',
      resourceCosts: {
        mana: { baseAmount: 10 }
      },
      complexity: 'basic',
      tags: ['utility', 'detection'],
      cooldownCategory: 'short',
      cooldownValue: 10,
      visualTheme: 'arcane'
    },
    
    // Transformation utility
    TRANSFORMATION_UTILITY: {
      ...BASE_TEMPLATE,
      name: 'Polymorph',
      description: 'Transform the target into a harmless creature.',
      category: 'utility',
      subtype: 'transformation',
      debuffs: ['polymorph'],
      durationRounds: 6,
      durationRealTime: 50,
      durationUnit: 'seconds',
      resourceCosts: {
        mana: { baseAmount: 30 }
      },
      complexity: 'advanced',
      tags: ['utility', 'control'],
      cooldownCategory: 'long',
      cooldownValue: 45,
      castTimeType: 'short',
      castTimeValue: 1.5,
      visualTheme: 'arcane'
    }
  };
  
  // Combine all templates into a single object
  export const SPELL_TEMPLATES = {
    ...DAMAGE_TEMPLATES,
    ...HEALING_TEMPLATES,
    ...BUFF_TEMPLATES,
    ...DEBUFF_TEMPLATES,
    ...UTILITY_TEMPLATES
  };
  
  // Helper function to get all templates by category
  export const getTemplatesByCategory = (category) => {
    return Object.values(SPELL_TEMPLATES).filter(
      template => template.category === category
    );
  };
  
  // Helper function to get a template by ID
  export const getTemplateById = (templateId) => {
    return SPELL_TEMPLATES[templateId] || null;
  };
  
  // Helper function to get a random template
  export const getRandomTemplate = () => {
    const templateIds = Object.keys(SPELL_TEMPLATES);
    const randomIndex = Math.floor(Math.random() * templateIds.length);
    return SPELL_TEMPLATES[templateIds[randomIndex]];
  };
  
  // Helper function to adapt a template for a specific class
  export const adaptTemplateForClass = (templateId, classId) => {
    const template = getTemplateById(templateId);
    if (!template) return null;
    
    // Adjust resource costs based on class resource systems
    const classResourceMapping = {
      'pyrofiend': 'inferno',
      'gambler': 'fortune',
      'fateweaver': 'fortune',
      'primalist': 'totemicSynergy',
      'berserker': 'rage',
      'covenbane': 'hexbreakerCharges',
      'dreadnaught': 'darkResilience',
      'warden': 'vengeance',
      'elementalist': 'elementalHarmony',
      'chronomancer': 'temporalEnergy',
      'shadowdancer': 'shadowEssence',
      'beastmaster': 'beastBond',
      'runesmith': 'runeEnergy',
      'planeswalker': 'planarConnection',
      'alchemist': 'catalysts',
      'soulbinder': 'soulFragments',
      'druid': 'naturalHarmony',
      'stormbringer': 'stormIntensity',
      'spellblade': 'arcaneCharges',
      'oracle': 'divineInsight',
      'artificer': 'innovationPoints',
      'necromancer': 'deathEssence',
      'illusionist': 'mirageEnergy',
      'battlemage': 'combatFocus',
      'witch': 'hexPower',
      'celestial': 'astralEnergy',
      'shaman': 'ancestralBond'
    };
    
    const primaryResource = classResourceMapping[classId] || 'mana';
    
    // Create a new resource costs object
    const resourceCosts = {};
    resourceCosts[primaryResource] = { 
      baseAmount: template.resourceCosts.mana?.baseAmount || 20 
    };
    
    // Adjust damage types based on class themes
    const classDamageMapping = {
      'pyrofiend': ['fire'],
      'elementalist': ['fire', 'frost', 'nature', 'arcane'],
      'stormbringer': ['lightning'],
      'necromancer': ['shadow'],
      'druid': ['nature'],
      'illusionist': ['arcane'],
      'witch': ['shadow', 'poison'],
      'celestial': ['holy'],
      'shadowdancer': ['shadow'],
      'chronomancer': ['arcane', 'temporal']
    };
    
    // Adjust visual theme based on class
    const classVisualMapping = {
      'pyrofiend': 'fire',
      'elementalist': 'arcane',
      'stormbringer': 'lightning',
      'necromancer': 'shadow',
      'druid': 'nature',
      'illusionist': 'arcane',
      'witch': 'shadow',
      'celestial': 'holy',
      'shadowdancer': 'shadow',
      'chronomancer': 'temporal'
    };
    
    // Create adapted template
    const adaptedTemplate = {
      ...template,
      class: classId,
      resourceCosts,
      visualTheme: classVisualMapping[classId] || template.visualTheme
    };
    
    // Adjust damage types if it's a damage spell
    if (template.category === 'damage' && classDamageMapping[classId]) {
      adaptedTemplate.damageTypes = classDamageMapping[classId];
    }
    
    // Generate a class-appropriate name
    const classNames = {
      'pyrofiend': ['Inferno', 'Blaze', 'Combustion'],
      'elementalist': ['Elemental', 'Primal', 'Essence'],
      'necromancer': ['Death', 'Necrotic', 'Soul'],
      'druid': ['Wild', 'Natural', 'Primal'],
      'illusionist': ['Illusory', 'Phantasmal', 'Mirage'],
      'witch': ['Hex', 'Curse', 'Wicked'],
      'celestial': ['Divine', 'Radiant', 'Celestial']
    };
    
    if (classNames[classId]) {
      const prefix = classNames[classId][Math.floor(Math.random() * classNames[classId].length)];
      const baseName = template.name.split(' ');
      adaptedTemplate.name = `${prefix} ${baseName[baseName.length - 1]}`;
    }
    
    return adaptedTemplate;
  };
  
  export default SPELL_TEMPLATES;