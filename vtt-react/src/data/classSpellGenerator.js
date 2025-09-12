/**
 * Class Spell Generator
 * 
 * Programmatically generates all 81 class spells (3 per class for 27 classes)
 * Based on class specializations and spell archetypes
 */

import { CLASS_SPECIALIZATIONS } from './classSpellCategories';

// Spell archetype templates for different specialization types
const SPELL_ARCHETYPES = {
  // Damage archetypes
  damage_direct: {
    effectTypes: ['damage'],
    damageConfig: {
      damageType: 'direct',
      formula: '2d8 + intelligence',
      hasDotEffect: false
    },
    targetingConfig: {
      targetingType: 'single',
      range: 50,
      validTargets: ['enemy']
    },
    resourceCost: { mana: 25, health: 0, stamina: 0, focus: 0 },
    cooldownConfig: { type: 'turn_based', value: 3, charges: 1 }
  },

  damage_aoe: {
    effectTypes: ['damage'],
    damageConfig: {
      damageType: 'direct',
      formula: '1d10 + intelligence / 2',
      hasDotEffect: false
    },
    targetingConfig: {
      targetingType: 'aoe',
      aoeType: 'sphere',
      aoeSize: 20,
      range: 40,
      validTargets: ['enemy']
    },
    resourceCost: { mana: 35, health: 0, stamina: 0, focus: 0 },
    cooldownConfig: { type: 'turn_based', value: 4, charges: 1 }
  },

  damage_dot: {
    effectTypes: ['damage'],
    damageConfig: {
      damageType: 'direct',
      formula: '1d6 + 2',
      hasDotEffect: true,
      dotConfig: {
        duration: 12,
        tickFormula: '1d4 + 1',
        tickFrequency: 'start'
      }
    },
    targetingConfig: {
      targetingType: 'single',
      range: 45,
      validTargets: ['enemy']
    },
    resourceCost: { mana: 18, health: 0, stamina: 0, focus: 0 },
    cooldownConfig: { type: 'turn_based', value: 2, charges: 1 }
  },

  // Healing archetypes
  healing_direct: {
    effectTypes: ['healing'],
    healingConfig: {
      healingType: 'direct',
      formula: '3d8 + spirit',
      hasHotEffect: false
    },
    targetingConfig: {
      targetingType: 'single',
      range: 30,
      validTargets: ['ally', 'self']
    },
    resourceCost: { mana: 30, health: 0, stamina: 0, focus: 0 },
    cooldownConfig: { type: 'turn_based', value: 3, charges: 1 }
  },

  healing_aoe: {
    effectTypes: ['healing'],
    healingConfig: {
      healingType: 'area',
      formula: '2d8 + spirit / 2',
      maxTargets: 4
    },
    targetingConfig: {
      targetingType: 'aoe',
      aoeType: 'sphere',
      aoeSize: 25,
      range: 35,
      validTargets: ['ally', 'self']
    },
    resourceCost: { mana: 40, health: 0, stamina: 0, focus: 0 },
    cooldownConfig: { type: 'turn_based', value: 5, charges: 1 }
  },

  healing_hot: {
    effectTypes: ['healing'],
    healingConfig: {
      healingType: 'direct',
      formula: '2d6 + 3',
      hasHotEffect: true,
      hotConfig: {
        duration: 15,
        tickFormula: '1d6 + 2',
        tickFrequency: 'start'
      }
    },
    targetingConfig: {
      targetingType: 'single',
      range: 30,
      validTargets: ['ally', 'self']
    },
    resourceCost: { mana: 30, health: 0, stamina: 0, focus: 0 },
    cooldownConfig: { type: 'turn_based', value: 4, charges: 1 }
  },

  // Buff archetypes
  buff_self: {
    effectTypes: ['buff'],
    buffConfig: {
      buffType: 'enhancement',
      duration: 5,
      durationType: 'rounds',
      statBonuses: [
        { stat: 'intelligence', amount: 4, type: 'flat' },
        { stat: 'spirit', amount: 2, type: 'flat' }
      ],
      effects: ['enhanced_casting', 'mana_efficiency']
    },
    targetingConfig: {
      targetingType: 'self',
      range: 0,
      validTargets: ['self']
    },
    resourceCost: { mana: 25, health: 0, stamina: 0, focus: 0 },
    cooldownConfig: { type: 'turn_based', value: 6, charges: 1 }
  },

  buff_ally: {
    effectTypes: ['buff'],
    buffConfig: {
      buffType: 'protection',
      duration: 4,
      durationType: 'rounds',
      statBonuses: [
        { stat: 'constitution', amount: 3, type: 'flat' },
        { stat: 'agility', amount: 2, type: 'flat' }
      ],
      effects: ['damage_resistance', 'improved_saves']
    },
    targetingConfig: {
      targetingType: 'single',
      range: 40,
      validTargets: ['ally', 'self']
    },
    resourceCost: { mana: 22, health: 0, stamina: 0, focus: 0 },
    cooldownConfig: { type: 'turn_based', value: 5, charges: 1 }
  },

  buff_aoe: {
    effectTypes: ['buff'],
    buffConfig: {
      buffType: 'enhancement',
      duration: 20,
      durationType: 'seconds',
      effects: ['group_enhancement'],
      areaEffect: true
    },
    targetingConfig: {
      targetingType: 'aoe',
      aoeType: 'sphere',
      aoeSize: 20,
      range: 30,
      validTargets: ['ally', 'self']
    },
    resourceCost: { mana: 30, health: 0, stamina: 0, focus: 0 },
    cooldownConfig: { type: 'turn_based', value: 7, charges: 1 }
  },

  // Debuff archetypes
  debuff_single: {
    effectTypes: ['debuff'],
    debuffConfig: {
      debuffType: 'weakness',
      duration: 15,
      durationType: 'seconds',
      effects: ['reduced_damage', 'slowed']
    },
    targetingConfig: {
      targetingType: 'single',
      range: 45,
      validTargets: ['enemy']
    },
    resourceCost: { mana: 18, health: 0, stamina: 0, focus: 0 },
    cooldownConfig: { type: 'turn_based', value: 4, charges: 1 }
  },

  debuff_aoe: {
    effectTypes: ['debuff'],
    debuffConfig: {
      debuffType: 'weakness',
      duration: 12,
      durationType: 'seconds',
      effects: ['area_weakness'],
      areaEffect: true
    },
    targetingConfig: {
      targetingType: 'aoe',
      aoeType: 'sphere',
      aoeSize: 18,
      range: 40,
      validTargets: ['enemy']
    },
    resourceCost: { mana: 25, health: 0, stamina: 0, focus: 0 },
    cooldownConfig: { type: 'turn_based', value: 5, charges: 1 }
  },

  // Utility archetypes
  utility_movement: {
    effectTypes: ['utility'],
    utilityConfig: {
      utilityType: 'movement',
      effects: ['teleport', 'dash', 'phase']
    },
    targetingConfig: {
      targetingType: 'special',
      range: 60,
      validTargets: ['self']
    },
    resourceCost: { mana: 15, health: 0, stamina: 0, focus: 0 },
    cooldownConfig: { type: 'turn_based', value: 3, charges: 1 }
  },

  utility_control: {
    effectTypes: ['utility'],
    utilityConfig: {
      utilityType: 'control',
      effects: ['stun', 'root', 'silence']
    },
    targetingConfig: {
      targetingType: 'single',
      range: 40,
      validTargets: ['enemy']
    },
    resourceCost: { mana: 20, health: 0, stamina: 0, focus: 0 },
    cooldownConfig: { type: 'turn_based', value: 6, charges: 1 }
  },

  utility_special: {
    effectTypes: ['utility'],
    utilityConfig: {
      utilityType: 'special',
      effects: ['unique_class_ability']
    },
    targetingConfig: {
      targetingType: 'special',
      range: 50,
      validTargets: ['any']
    },
    resourceCost: { mana: 25, health: 0, stamina: 0, focus: 0 },
    cooldownConfig: { type: 'turn_based', value: 8, charges: 1 }
  }
};

// Spell name templates for different themes
const SPELL_NAME_TEMPLATES = {
  fire: ['Infernal Blast', 'Flame Strike', 'Burning Surge'],
  ice: ['Frost Bolt', 'Ice Shard', 'Frozen Touch'],
  lightning: ['Lightning Bolt', 'Thunder Strike', 'Electric Surge'],
  holy: ['Divine Light', 'Sacred Strike', 'Holy Radiance'],
  shadow: ['Shadow Bolt', 'Dark Strike', 'Void Touch'],
  nature: ['Nature\'s Wrath', 'Thorn Strike', 'Wild Growth'],
  arcane: ['Arcane Missile', 'Magic Strike', 'Mystic Bolt'],
  chaos: ['Chaos Bolt', 'Random Strike', 'Entropy Wave'],
  time: ['Temporal Strike', 'Time Warp', 'Chronos Blast'],
  music: ['Sonic Blast', 'Harmonic Strike', 'Melody Wave'],
  luck: ['Lucky Strike', 'Fortune Bolt', 'Fate Touch'],
  protection: ['Divine Shield', 'Sacred Ward', 'Holy Barrier'],
  healing: ['Healing Light', 'Restoration', 'Sacred Mend'],
  enhancement: ['Power Boost', 'Enhancement', 'Empowerment'],
  movement: ['Swift Step', 'Phase Walk', 'Quick Dash'],
  control: ['Hold Person', 'Binding Strike', 'Control Wave']
};

// Generate spell ID
const generateSpellId = (name) => {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now();
};

// Create a base spell template
const createBaseSpell = (name, description, className, specialization, icon, spellType = 'ACTION') => ({
  id: generateSpellId(name),
  name,
  description,
  className,
  specialization,
  source: 'class',
  icon,
  spellType,
  level: 1,
  tags: [className.toLowerCase(), specialization],
  effectTypes: [],
  damageTypes: [],
  dateCreated: new Date().toISOString(),
  lastModified: new Date().toISOString()
});

// Generate all class spells
export const generateAllClassSpells = () => {
  const allSpells = {};

  Object.entries(CLASS_SPECIALIZATIONS).forEach(([className, classData]) => {
    allSpells[className] = [];

    classData.specializations.forEach((specialization, index) => {
      // Generate 3 spells per specialization (one for each archetype pattern)
      const spellArchetypes = [
        index === 0 ? 'damage_direct' : index === 1 ? 'healing_direct' : 'buff_self',
        index === 0 ? 'damage_aoe' : index === 1 ? 'healing_aoe' : 'buff_ally', 
        index === 0 ? 'utility_control' : index === 1 ? 'utility_movement' : 'utility_special'
      ];

      spellArchetypes.forEach((archetypeKey, spellIndex) => {
        const archetype = SPELL_ARCHETYPES[archetypeKey];
        const spellNames = [`${specialization.name} Strike`, `${specialization.name} Mastery`, `${specialization.name} Expertise`];
        const spellName = spellNames[spellIndex];

        // Create more detailed descriptions based on archetype and specialization
        let description = '';
        if (archetypeKey.includes('damage')) {
          description = `Channel the power of ${specialization.name.toLowerCase()} to unleash devastating ${archetype.damageConfig?.elementType || 'elemental'} damage upon your enemies.`;
        } else if (archetypeKey.includes('healing')) {
          description = `Harness ${specialization.name.toLowerCase()} energies to restore health and vitality to yourself or allies.`;
        } else if (archetypeKey.includes('buff')) {
          description = `Invoke ${specialization.name.toLowerCase()} magic to enhance abilities and provide protective benefits.`;
        } else {
          description = `Utilize ${specialization.name.toLowerCase()} techniques to control the battlefield and manipulate your environment.`;
        }

        const spell = {
          ...createBaseSpell(spellName, description, className, specialization.id, specialization.icon),
          ...archetype
        };

        // Customize based on specialization theme
        if (spell.damageConfig) {
          spell.damageConfig.elementType = getElementTypeForSpecialization(specialization.id);
          spell.damageTypes = [spell.damageConfig.elementType];
        }

        // Adjust resource costs based on class theme
        if (className.includes('Mage') || className.includes('Wizard') || className.includes('Sorcerer')) {
          spell.resourceCost.mana = Math.floor(spell.resourceCost.mana * 1.2); // Mages use more mana
        } else if (className.includes('Warrior') || className.includes('Fighter')) {
          spell.resourceCost.stamina = Math.floor(spell.resourceCost.mana * 0.8); // Warriors use stamina
          spell.resourceCost.mana = Math.floor(spell.resourceCost.mana * 0.5);
        }

        allSpells[className].push(spell);
      });
    });
  });

  return allSpells;
};

// Helper function to determine element type based on specialization
const getElementTypeForSpecialization = (specializationId) => {
  const elementMap = {
    fire_mastery: 'fire',
    corruption_stages: 'shadow',
    demonic_power: 'shadow',
    harmonic_weaving: 'sonic',
    chord_combinations: 'sonic',
    musical_magic: 'sonic',
    temporal_control: 'temporal',
    time_manipulation: 'temporal',
    chronos_energy: 'temporal',
    reality_bending: 'chaos',
    entropy_control: 'chaos',
    chaos_dice: 'chaos',
    luck_manipulation: 'fortune',
    risk_management: 'fortune',
    fate_control: 'fortune',
    divine_protection: 'holy',
    holy_wrath: 'holy',
    sacred_healing: 'holy',
    divine_magic: 'holy',
    healing_arts: 'holy',
    sacred_rituals: 'holy'
  };

  return elementMap[specializationId] || 'force';
};

// Export the generated spells
export const ALL_CLASS_SPELLS = generateAllClassSpells();
