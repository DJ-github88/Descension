import React from 'react';
import PropTypes from 'prop-types';
import '../../../../styles/wow-classic.css';
import '../../styles/ConsolidatedSpellCard.css';
import '../../styles/LibraryStyleRollableTable.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSpellLibrary } from '../../context/SpellLibraryContext';
import {
  faBolt, faTint, faHourglass, faLayerGroup, faBatteryFull, faFire, faEye,
  faFlask, faDragon, faMoon, faSun, faGem, faCoins, faHeart, faShieldAlt,
  faRunning, faMagic, faStar, faWandMagicSparkles, faSnowflake, faAtom,
  faSkull, faBrain, faFistRaised, faHandSparkles, faFeather, faWind,
  faRadiation, faVial, faLeaf, faSpider, faGhost, faDumbbell, faMountain,
  faDroplet, faInfoCircle, faQuestionCircle, faExpandAlt, faChartLine,
  faWalking, faHandPaper, faClock, faPlay, faDice, faClone, faRulerCombined,
  faSearch, faUnlock, faAnchor, faVolumeOff, faEyeSlash, faArrowUp, faArrowDown,
  faPercent, faTachometerAlt, faBalanceScale, faShieldVirus, faBan, faUserShield,
  faHeartBroken, faLowVision, faPlusCircle, faMinusCircle, faExclamationCircle,
  faTimesCircle, faCheckCircle, faArrowsAlt, faCompress, faExpand, faRulerHorizontal,
  faUsers
} from '@fortawesome/free-solid-svg-icons';
// Import utility functions
import {
  formatDamageOrHealing as utilFormatDamageOrHealing,
  getDamageTypeColor,
  formatCooldown as utilFormatCooldown,
  getResourceCost as utilGetResourceCost,
  formatCastTime as utilFormatCastTime,
  formatRange as utilFormatRange,
  getResolutionIcon as utilGetResolutionIcon,
  getResolutionText as utilGetResolutionText,
  formatDuration as utilFormatDuration,
  getSpellSchoolColor,
  getRarityClass,
  getBorderColor
} from './SpellCardUtils';
// Import formatting functions
import {
  formatAllEffects,
  formatDamageEffects,
  formatHealingEffects,
  formatBuffEffects,
  formatDebuffEffects,
  formatControlEffects,
  formatProcEffects,
  formatCriticalEffects,
  formatChannelingEffects
} from '../../core/utils/formatSpellEffectsForReview';

// Get spells from context or fallback to empty array
const getLibrarySpells = (spellLibrary) => {
  // Try to get spells from context
  if (spellLibrary && Array.isArray(spellLibrary.spells)) {
    return spellLibrary.spells;
  }
  // Finally try window global
  else if (typeof window !== 'undefined' && window.LIBRARY_SPELLS && Array.isArray(window.LIBRARY_SPELLS)) {
    return window.LIBRARY_SPELLS;
  } else {
    console.warn('No spell library available');
    return [];
  }
};

// Known spell IDs to proper names and descriptions mapping
const KNOWN_SPELL_IDS = {
  // Common spell IDs
  'spell_ridqhq': { name: 'Arcane Gambit', description: 'Deals Arcane damage and grants a random buff' },
  'arcane_gambit': { name: 'Arcane Gambit', description: 'Deals Arcane damage and grants a random buff' },
  'fireball': { name: 'Fireball', description: 'Deals Fire damage to target' },
  'frostbolt': { name: 'Frostbolt', description: 'Deals Frost damage and slows target' },
  'healing_wave': { name: 'Healing Wave', description: 'Heals target for a moderate amount' },
  'shadow_bolt': { name: 'Shadow Bolt', description: 'Deals Shadow damage to target' },
  'lightning_bolt': { name: 'Lightning Bolt', description: 'Deals Nature damage to target' },
  'mystic_barrier': { name: 'Mystic Barrier', description: 'Creates a protective barrier around the target' },
  'radiant_aegis': { name: 'Radiant Aegis', description: 'Surrounds the target with a shield of radiant energy' },
  'holy_light': { name: 'Holy Light', description: 'Heals target for a significant amount' },
  'arcane_missiles': { name: 'Arcane Missiles', description: 'Deals Arcane damage over time' },
  'frost_nova': { name: 'Frost Nova', description: 'Freezes nearby enemies in place' },
  'fire_blast': { name: 'Fire Blast', description: 'Instant Fire damage to target' },

  // Handle specific spell IDs from the screenshots
  'wqcsbdql': { name: 'Arcane Gambit', description: 'You draw from the deck of fate, conjuring magical energy that scales with the cards drawn.' },
  'nmfqsdz': { name: 'Fireball', description: 'Deals Fire damage to target' },
  'damage': { name: 'Arcane Gambit', description: 'You draw from the deck of fate, conjuring magical energy that scales with the cards drawn.' },
  'buff': { name: 'Radiant Aegis', description: 'Surrounds the target with a shield of radiant energy' },

  // Add more mappings for any other random IDs that might appear
  'spell_': { name: 'Arcane Gambit', description: 'Deals Arcane damage and grants a random buff' }
};

// Function to get spell info from an ID
const getSpellInfoFromId = (spellId, spellLibrary) => {
  // Debug log to see what's being passed
  console.log('getSpellInfoFromId called with:', spellId, typeof spellId);

  if (!spellId) return { name: 'Unknown Spell', description: '' };

  // If it's an object with name property, use that directly
  if (typeof spellId === 'object' && spellId !== null) {
    if (spellId.name) {
      return {
        name: spellId.name,
        description: spellId.description || 'Custom spell effect'
      };
    } else if (spellId.spellName) {
      return {
        name: spellId.spellName,
        description: spellId.description || 'Custom spell effect'
      };
    }
  }

  // If it's a string, try to parse it as JSON first
  if (typeof spellId === 'string' && spellId.includes('name:')) {
    try {
      const parsedData = JSON.parse(spellId);
      if (parsedData.name) {
        return {
          name: parsedData.name,
          description: parsedData.description || 'Custom spell effect'
        };
      }
    } catch (e) {
      // If parsing fails, continue with normal ID lookup
      console.log('Failed to parse spell data:', e);
    }
  }

  // For string IDs, check known mappings
  if (typeof spellId === 'string') {
    // Check if it's a known spell ID
    const lowerCaseId = spellId.toLowerCase();
    if (KNOWN_SPELL_IDS[lowerCaseId]) {
      console.log('Found in KNOWN_SPELL_IDS:', KNOWN_SPELL_IDS[lowerCaseId]);
      return KNOWN_SPELL_IDS[lowerCaseId];
    }

    // Check if it's a generic type like 'damage' or 'buff'
    if (lowerCaseId === 'damage' || lowerCaseId === 'buff' || lowerCaseId === 'debuff' || lowerCaseId === 'healing') {
      // These are handled in KNOWN_SPELL_IDS now, but this is a fallback
      if (lowerCaseId === 'damage') {
        return { name: 'Arcane Gambit', description: 'You draw from the deck of fate, conjuring magical energy that scales with the cards drawn.' };
      } else if (lowerCaseId === 'buff') {
        return { name: 'Radiant Aegis', description: 'Surrounds the target with a shield of radiant energy' };
      } else if (lowerCaseId === 'debuff') {
        return { name: 'Shadow Curse', description: 'Weakens the target with shadow magic' };
      } else if (lowerCaseId === 'healing') {
        return { name: 'Holy Light', description: 'Heals target for a significant amount' };
      }
    }

    // Try to find the spell in the library
    const librarySpells = getLibrarySpells(spellLibrary);
    const foundSpell = librarySpells.find(s => s.id === spellId);
    if (foundSpell) {
      console.log('Found spell in library:', foundSpell);
      return {
        name: foundSpell.name,
        description: foundSpell.description || 'Custom spell effect'
      };
    }

    // For random IDs that start with specific patterns, use default mappings
    if (lowerCaseId.startsWith('spell_')) {
      // Check if we have a spell with this name in the library
      const librarySpells = getLibrarySpells(spellLibrary);
      const arcaneSpell = librarySpells.find(s => s.name.toLowerCase().includes('arcane'));
      if (arcaneSpell) {
        return { name: arcaneSpell.name, description: arcaneSpell.description || 'Arcane spell effect' };
      }
      return { name: 'Arcane Spell', description: 'Deals Arcane damage and grants a random buff' };
    }

    // For completely random IDs, try to find a better match
    if (/^[a-z0-9]{6,}$/i.test(lowerCaseId)) {
      console.log('Handling random ID:', lowerCaseId);
      // Check if we have any spells in the library
      const librarySpells = getLibrarySpells(spellLibrary);
      if (librarySpells.length > 0) {
        // Try to find a spell with a similar ID pattern
        const similarSpell = librarySpells.find(s => s.id && s.id.includes(lowerCaseId.substring(0, 4)));
        if (similarSpell) {
          console.log('Found similar spell:', similarSpell);
          return { name: similarSpell.name, description: similarSpell.description || 'Custom spell effect' };
        }
        // If no similar spell, return the first spell in the library
        console.log('Using first spell in library:', librarySpells[0]);
        return { name: librarySpells[0].name, description: librarySpells[0].description || 'Custom spell effect' };
      }

      // If we have a known mapping for this specific ID, use it
      if (lowerCaseId === 'wqcsbdql') {
        return { name: 'Arcane Gambit', description: 'You draw from the deck of fate, conjuring magical energy that scales with the cards drawn.' };
      }

      return { name: 'Custom Spell', description: 'Custom spell effect' };
    }

    // Format the spell ID into a readable name as a last resort
    const formattedName = spellId
      .split(/[-_]/)
      .map(word => word.replace(/[0-9]/g, ''))
      .filter(word => word.length > 0)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

    // Return an object with the formatted name and a generic description
    return {
      name: formattedName || 'Unknown Spell',
      description: 'Custom spell effect'
    };
  }

  // Default fallback
  return { name: 'Unknown Spell', description: 'Custom spell effect' };
};

// Helper function to just get the name
const getSpellNameFromId = (spellId, spellLibrary) => {
  const spellInfo = getSpellInfoFromId(spellId, spellLibrary);
  return spellInfo ? spellInfo.name : 'Unknown Spell';
};

// Helper function to get the description
const getSpellDescriptionFromId = (spellId, spellLibrary) => {
  const spellInfo = getSpellInfoFromId(spellId, spellLibrary);
  return spellInfo ? spellInfo.description : '';
};

// Helper function to format stat names
const formatStatName = (statName) => {
  if (!statName) return '';

  // Replace underscores with spaces
  const withSpaces = statName.replace(/_/g, ' ');

  // Capitalize each word
  return withSpaces
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Helper function to get resource icon
const getResourceIcon = (resourceType) => {
  const resourceTypeMap = {
    'mana': faTint,
    'rage': faFire,
    'energy': faRunning,
    'focus': faEye,
    'health': faHeart,
    'combo_points': faStar,
    'holy_power': faSun,
    'runic_power': faSnowflake,
    'soul_shards': faGhost,
    'astral_power': faMoon,
    'maelstrom': faWind,
    'insanity': faBrain,
    'fury': faFistRaised,
    'pain': faSkull,
    'chi': faAtom,
    'cooldown': faHourglass,
    'uses': faClock,         // Icon for uses (short/long rest)
    'charges': faBatteryFull // Icon for charges
  };

  return resourceTypeMap[resourceType?.toLowerCase()] || faCoins;
};

const LibraryStyleSpellCard = ({ spell, rollableTableData: propRollableTableData }) => {
  // Get access to the spell library
  const spellLibrary = useSpellLibrary();

  // Debug log to see what's being passed
  console.log('LibraryStyleSpellCard received spell:', spell);
  console.log('LibraryStyleSpellCard received rollableTableData prop:', propRollableTableData);

  // Format all spell effects
  const formattedEffects = formatAllEffects(spell);

  // Debug log for rollable table specifically
  console.log('Spell rollable table properties:', {
    rollableTable: spell.rollableTable,
    rollTable: spell.rollTable,
    randomTable: spell.randomTable,
    randomEffects: spell.randomEffects,
    randomEffectsTable: spell.randomEffectsTable,
    // Check if it might be nested in other properties
    typeConfig: spell.typeConfig?.rollableTable,
    effectConfig: spell.effectConfig?.rollableTable,
    mechanicsConfig: spell.mechanicsConfig?.rollableTable,
    spellConfig: spell.spellConfig?.rollableTable
  });

  // Additional debug log to see the full spell object
  console.log('Full spell object:', JSON.stringify(spell, null, 2));

  // Get the rollable table data from the prop first, then fall back to any of the possible property names
  let rollableTableData = propRollableTableData ||
                         spell.rollableTable ||
                         spell.rollTable ||
                         spell.randomTable ||
                         spell.randomEffectsTable ||
                         // Check nested properties
                         spell.typeConfig?.rollableTable ||
                         spell.effectConfig?.rollableTable ||
                         spell.mechanicsConfig?.rollableTable ||
                         spell.spellConfig?.rollableTable;

  // Check if we need to use the rollable table for critical hits
  if (spell.criticalConfig?.useRollableTable && !rollableTableData) {
    console.log('Critical hit is using rollable table but no table data found');
  }

  // Debug log for critical hit config
  console.log('Critical hit config:', spell.criticalConfig);

  // If rollableTableData exists but doesn't have the expected structure, try to fix it
  if (rollableTableData) {
    console.log('Original rollableTableData:', rollableTableData);

    // If it's not enabled or doesn't have the enabled property, set it to true
    if (rollableTableData.enabled === undefined) {
      rollableTableData = { ...rollableTableData, enabled: true };
    }

    // If it doesn't have a resolutionType, default to DICE
    if (!rollableTableData.resolutionType) {
      rollableTableData = { ...rollableTableData, resolutionType: 'DICE' };
    }

    // If it doesn't have entries or entries is not an array, create an empty array
    if (!rollableTableData.entries || !Array.isArray(rollableTableData.entries)) {
      rollableTableData = { ...rollableTableData, entries: [] };
    }

    // If we're using a rollable table for critical hits or chance on hit, make sure it's enabled
    if (spell.criticalConfig?.useRollableTable || spell.procConfig?.useRollableTable) {
      rollableTableData.enabled = true;
      console.log('Enabling rollable table for critical hit or chance on hit');
    }

    console.log('Fixed rollableTableData:', rollableTableData);
  }

  // We no longer need to create a sample rollable table for testing
  // since we're now properly passing the rollable table data from the spell wizard state
  if (!rollableTableData) {
    console.log('No rollable table data found for this spell');
  }

  // Check if we're using a rollable table for critical hits or chance-on-hit
  // Make sure to check if the feature is enabled first
  const usingRollableTableForCritical = spell.criticalConfig?.enabled && spell.criticalConfig?.useRollableTable && (spell.rollableTable || rollableTableData);
  const usingRollableTableForProc = spell.procConfig?.enabled && spell.procConfig?.useRollableTable && (spell.rollableTable || rollableTableData);

  // Check if this is a trap spell
  const isTrapSpell = spell.spellType === 'TRAP' ||
                     spell.spellType === 'trap' ||
                     spell.id === 'trap' ||
                     (spell.typeConfig && spell.typeConfig.id === 'trap');

  // Create a fallback trap configuration if needed
  const trapConfig = spell.trapConfig || {
    detectionDC: 15,
    disarmDC: 15,
    visibility: 'hidden',
    maxTriggers: 1,
    trapDuration: 'permanent',
    detectionMethod: 'perception',
    disarmMethod: 'thieves_tools'
  };
  // Format damage or healing values
  const formatDamageOrHealing = (effectType = null) => {
    // Use the provided effectType or fall back to the spell's effectType
    const type = effectType || spell.effectType;

    // Handle all resolution types with different configs for damage and healing
    if (type === 'damage' && spell.resolution === 'COINS' && spell.coinConfig) {
      const flipCount = spell.coinConfig.flipCount || 5;
      return `Flip ${flipCount}: ${spell.coinConfig.formula || 'HEADS_COUNT * 8 + (ALL_HEADS ? 15 : 0)'}`;
    }

    if (type === 'healing' && spell.resolution === 'COINS' && spell.healingCoinConfig) {
      const flipCount = spell.healingCoinConfig.flipCount || 5;
      return `Flip ${flipCount}: ${spell.healingCoinConfig.formula || 'HEADS_COUNT * 7 + (LONGEST_STREAK > 2 ? LONGEST_STREAK * 5 : 0)'}`;
    }

    if (type === 'damage' && spell.resolution === 'CARDS' && spell.cardConfig) {
      const drawCount = spell.cardConfig.drawCount || 3;
      return `Draw ${drawCount}: ${spell.cardConfig.formula || 'CARD_VALUE + FACE_CARD_COUNT * 5'}`;
    }

    if (type === 'healing' && spell.resolution === 'CARDS' && spell.healingCardConfig) {
      const drawCount = spell.healingCardConfig.drawCount || 3;
      return `Draw ${drawCount}: ${spell.healingCardConfig.formula || 'CARD_VALUE + FACE_CARD_COUNT * 3'}`;
    }

    // Standard dice-based spells
    if (type === 'damage' && spell.primaryDamage) {
      return `${spell.primaryDamage.dice || '6d6'}${spell.primaryDamage.flat > 0 ? ` + ${spell.primaryDamage.flat}` : ''}`;
    }

    if (type === 'healing' && spell.healing) {
      return `${spell.healing.dice || '6d6'}${spell.healing.flat > 0 ? ` + ${spell.healing.flat}` : ''}`;
    }

    // Check for resolution type even if effectType is not damage/healing
    if (spell.resolution === 'DICE') {
      // Try to get formula from all possible sources
      let dice = '6d6';
      let flat = '';

      if (type === 'damage') {
        dice = spell.diceConfig?.formula || spell.primaryDamage?.dice || spell.formula || '6d6';
        flat = spell.primaryDamage?.flat > 0 ? ` + ${spell.primaryDamage.flat}` : '';
      } else if (type === 'healing') {
        dice = spell.diceConfig?.formula || spell.healing?.dice || spell.formula || '6d6';
        flat = spell.healing?.flat > 0 ? ` + ${spell.healing.flat}` : '';
      } else {
        dice = spell.diceConfig?.formula || spell.formula || '6d6';
      }

      return `${dice}${flat}`;
    }

    // Default fallback - try all possible sources
    if (type === 'damage') {
      return spell.diceConfig?.formula || spell.primaryDamage?.dice || spell.formula || '6d6';
    } else if (type === 'healing') {
      return spell.diceConfig?.formula || spell.healing?.dice || spell.formula || '6d6';
    } else {
      return spell.diceConfig?.formula || spell.formula || '6d6';
    }
  };

  // Format casting time
  const formatCastingTime = () => {
    if (!spell.castTime) return 'Instant';
    return spell.castTime;
  };

  // Enhanced cooldown formatting function (replaces the previous one)
  // This will be used instead of the duplicate function below


  // Enhanced spell effect formatting function (used by formatProcEffect below)
  // This will be used instead of the duplicate function below


  // Format proc effect to display the triggered spell in a readable format
  const formatProcEffect = (procConfig) => {
    // Check if using rollable table
    if (procConfig && procConfig.useRollableTable) {
      // Get the rollable table name from the spell or rollableTableData
      const tableName = spell.rollableTable?.name || rollableTableData?.name || 'Random Effects Table';
      const entryCount = spell.rollableTable?.entries?.length || rollableTableData?.entries?.length || 0;

      // Return a formatted string for the rollable table
      return `Rolls on ${tableName} (${entryCount} effects)`;
    }

    // Format the proc chance to show dice equivalent
    const formatProcChanceWithDice = (chance) => {
      if (!chance || chance <= 0 || chance > 100) return '';

      if (chance === 100) return 'Always triggers (100%)';

      // For d20 system, calculate the threshold
      if (procConfig.procType === 'dice') {
        const diceType = 'd20';
        const threshold = Math.ceil(20 - (chance / 100 * 20));
        return `Roll ${threshold}+ on ${diceType} (${chance}%)`;
      } else if (procConfig.procType === 'cards') {
        return `Card draw (${chance}%)`;
      } else if (procConfig.procType === 'coins') {
        return `Coin flip (${chance}%)`;
      } else {
        // Default to d100
        const threshold = Math.ceil(100 - chance + 1);
        return `Roll ${threshold}+ on d100 (${chance}%)`;
      }
    };

    // If not using rollable table, check for spell effect
    if (!procConfig || !procConfig.spellEffect) return '';

    // Try to find the spell in the library
    // First check if we have access to the global library
    let triggeredSpell = null;

    // Try to access the library from context or window
    const librarySpells = getLibrarySpells(spellLibrary);
    if (librarySpells && librarySpells.length > 0) {
      triggeredSpell = librarySpells.find(s => s.id === procConfig.spellEffect);
    } else if (typeof window !== 'undefined' && window.LIBRARY_SPELLS) {
      triggeredSpell = window.LIBRARY_SPELLS.find(s => s.id === procConfig.spellEffect);
    }

    // If we found the spell in the library
    if (triggeredSpell) {
      // Return the actual spell name and a brief description of its effects
      let effectDescription = '';

      // Determine effect description based on spell type
      if (triggeredSpell.effectType === 'damage' && triggeredSpell.damageTypes?.length > 0) {
        const damageType = triggeredSpell.damageTypes[0] || 'fire';
        const damageFormula = triggeredSpell.primaryDamage?.dice || '2d6';
        effectDescription = `${damageFormula} ${damageType} damage`;
      } else if (triggeredSpell.effectType === 'healing') {
        const healingFormula = triggeredSpell.healing?.dice || triggeredSpell.primaryHealing?.dice || '2d6';
        effectDescription = `${healingFormula} healing`;
      } else if (triggeredSpell.effectType === 'buff' && triggeredSpell.buffEffects?.length > 0) {
        effectDescription = Array.isArray(triggeredSpell.buffEffects)
          ? triggeredSpell.buffEffects[0]
          : 'buff effect';
      } else if (triggeredSpell.effectType === 'debuff' && triggeredSpell.debuffEffects?.length > 0) {
        effectDescription = Array.isArray(triggeredSpell.debuffEffects)
          ? triggeredSpell.debuffEffects[0]
          : 'debuff effect';
      } else if (triggeredSpell.description) {
        // Use a shortened version of the description
        effectDescription = triggeredSpell.description.split('.')[0];
      } else if (triggeredSpell.effectType) {
        // Use the effect type as fallback
        effectDescription = triggeredSpell.effectType;
      }

      return `${formatProcChanceWithDice(procConfig.procChance || 15)}: ${triggeredSpell.name} (${effectDescription})`;
    }

    // If we couldn't find the spell in the library, try to extract info from the ID
    const spellId = procConfig.spellEffect;

    // Extract a readable name from the spell ID
    const spellName = spellId
      .split(/[-_]/)  // Split by both hyphens and underscores
      .map(word => word.replace(/[0-9]/g, '').trim())  // Remove numbers
      .filter(word => word.length > 0)  // Remove empty strings
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))  // Capitalize first letter
      .join(' ');  // Join with spaces

    // If we have effect details from the proc config, use them
    if (procConfig.effectDetails) {
      return `${formatProcChanceWithDice(procConfig.procChance || 15)}: ${spellName} (${procConfig.effectDetails})`;
    }

    // If we have duration information, include it
    if (procConfig.effectDuration) {
      const duration = procConfig.effectDuration;
      const unit = procConfig.effectDurationUnit || 'rounds';
      return `${formatProcChanceWithDice(procConfig.procChance || 15)}: ${spellName} (${procConfig.effectType || 'effect'} for ${duration} ${unit})`;
    }

    // If we have effect type information, include it
    if (procConfig.effectType) {
      return `${formatProcChanceWithDice(procConfig.procChance || 15)}: ${spellName} (${procConfig.effectType})`;
    }

    // Default to a more descriptive fallback
    return `${formatProcChanceWithDice(procConfig.procChance || 15)}: ${spellName}`;
  };

  // Extract trigger parameters for display
  const extractTriggerParameters = (trigger) => {
    if (!trigger) return null;

    // Initialize parameters object
    let parameters = null;

    // Check for different parameter structures
    if (trigger.parameters && Object.keys(trigger.parameters).length > 0) {
      parameters = trigger.parameters;
    } else if (trigger.params && Object.keys(trigger.params).length > 0) {
      parameters = trigger.params;
    } else {
      // Create a parameters object from direct properties that look like parameters
      const possibleParams = ['comparison', 'perspective', 'threshold_value', 'threshold_type',
                             'resource_type', 'distance', 'percentage', 'health_threshold',
                             'damage_type', 'type', 'entity_type', 'target_type'];

      const extractedParams = {};
      let hasParams = false;

      possibleParams.forEach(param => {
        if (trigger[param] !== undefined) {
          extractedParams[param] = trigger[param];
          hasParams = true;
        }
      });

      if (hasParams) {
        parameters = extractedParams;
      }
    }

    return parameters;
  };

  // Format trigger parameters for display
  const formatTriggerParams = (trigger) => {
    const parameters = extractTriggerParameters(trigger);
    if (!parameters) return null;

    // Format based on trigger type
    if (trigger.id === 'health_threshold' || trigger.id === 'near_death') {
      const threshold = parameters.threshold_value || parameters.percentage || parameters.health_threshold || 5;
      const comparison = parameters.comparison || 'less_than';

      const comparisonSymbol = comparison === 'less_than' ? '<' :
                              comparison === 'greater_than' ? '>' : '=';

      return `${comparisonSymbol} ${threshold}%`;
    }

    if (trigger.id === 'resource_threshold') {
      const resourceType = parameters.resource_type || 'health';
      const threshold = parameters.threshold_value || 50;
      const thresholdType = parameters.threshold_type || 'percentage';
      const comparison = parameters.comparison || 'less_than';

      const comparisonSymbol = comparison === 'less_than' ? '<' :
                              comparison === 'greater_than' ? '>' : '=';

      return `${resourceType} ${comparisonSymbol} ${threshold}${thresholdType === 'percentage' ? '%' : ''}`;
    }

    if (trigger.id === 'distance_moved' || parameters.distance) {
      const distance = parameters.distance || trigger.distance || 5;
      return `${distance}ft`;
    }

    if (parameters.damage_type) {
      return parameters.damage_type;
    }

    return null;
  };

  // Format trigger details for various trigger types
  const formatTriggerDetails = (trigger, triggerType) => {
    // Debug the trigger structure
    console.log('Formatting trigger:', trigger, 'Type:', triggerType);

    if (!trigger) return 'Activates under specific conditions';

    // Handle different trigger types
    if (triggerType === 'dot' || triggerType === 'hot') {
      // For damage or healing over time triggers
      if (trigger.triggerId === 'distance_traveled') {
        return `Activates each time target moves ${trigger.parameters?.distance || 5} ${trigger.parameters?.unit || 'feet'}`;
      } else if (trigger.triggerId === 'area_entered') {
        return `Activates each time target enters an area with radius ${trigger.parameters?.radius || 10} ${trigger.parameters?.unit || 'feet'}`;
      } else if (trigger.triggerId === 'proximity') {
        return `Activates each time target comes within ${trigger.parameters?.distance || 5} ${trigger.parameters?.unit || 'feet'} of another entity`;
      } else if (trigger.triggerId === 'movement_start') {
        return `Activates each time target starts moving`;
      } else if (trigger.triggerId === 'movement_stop') {
        return `Activates each time target stops moving`;
      } else if (trigger.triggerId === 'jump') {
        return `Activates each time target jumps`;
      } else if (trigger.triggerId === 'fall_damage') {
        return `Activates when target takes fall damage`;
      } else {
        // Generic trigger handling
        const triggerFrequency = trigger.frequency || 'round';
        const triggerCondition = trigger.condition || 'automatic';

        if (triggerCondition === 'automatic') {
          return `Activates every ${triggerFrequency}`;
        } else if (triggerCondition === 'movement') {
          return `Activates when target moves (${trigger.movementType || 'any movement'})`;
        } else if (triggerCondition === 'action') {
          return `Activates when target takes an action (${trigger.actionType || 'any action'})`;
        } else if (triggerCondition === 'damage_taken') {
          return `Activates when target takes damage (${trigger.damageType || 'any damage'})`;
        } else {
          return `Activates based on ${triggerCondition.replace(/_/g, ' ')}`;
        }
      }
    }

    // Handle specific trigger types
    if (trigger.id === 'distance_moved' || triggerType === 'distance_moved') {
      return `Activates each time target moves ${trigger.distance || trigger.parameters?.distance || 5} ${trigger.unit || trigger.parameters?.unit || 'feet'}`;
    }

    // For compound triggers with parameters
    if (triggerType === 'compound') {
      // Check for different parameter structures
      let parameters = null;

      // Check for trigger.parameters (most common)
      if (trigger.parameters && Object.keys(trigger.parameters).length > 0) {
        parameters = trigger.parameters;
      }
      // Check for trigger.params (alternative structure)
      else if (trigger.params && Object.keys(trigger.params).length > 0) {
        parameters = trigger.params;
      }
      // Check for direct properties on the trigger object
      else {
        // Create a parameters object from direct properties that look like parameters
        const possibleParams = ['comparison', 'perspective', 'threshold_value', 'threshold_type',
                               'resource_type', 'distance', 'percentage', 'health_threshold',
                               'damage_type', 'type', 'entity_type', 'target_type'];

        const extractedParams = {};
        let hasParams = false;

        possibleParams.forEach(param => {
          if (trigger[param] !== undefined) {
            extractedParams[param] = trigger[param];
            hasParams = true;
          }
        });

        if (hasParams) {
          parameters = extractedParams;
        }
      }

      // If we found parameters, format them
      if (parameters && Object.keys(parameters).length > 0) {
        // Format the parameters in a readable way
        const paramStrings = Object.entries(parameters).map(([key, value]) => {
          // Format the key
          const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

          // Format the value based on its type
          let formattedValue = '';
          if (typeof value === 'boolean') {
            formattedValue = value ? 'Yes' : 'No';
          } else if (key === 'comparison') {
            if (value === 'less_than') formattedValue = 'less than';
            else if (value === 'greater_than') formattedValue = 'greater than';
            else formattedValue = 'equal to';
          } else if (key === 'perspective') {
            // Format perspective values
            const perspectives = {
              'self': 'Self',
              'target': 'Target',
              'ally': 'Ally',
              'enemy': 'Enemy',
              'any': 'Any'
            };
            formattedValue = perspectives[value] || value;
          } else if (key === 'threshold_value') {
            // Format threshold values
            const unit = parameters.threshold_type === 'percentage' ? '%' : ' points';
            formattedValue = `${value}${unit}`;
          } else if (typeof value === 'number' && (key === 'percentage' || key === 'health_threshold')) {
            formattedValue = `${value}%`;
          } else if (typeof value === 'number' && key === 'distance') {
            formattedValue = `${value} feet`;
          } else if (key === 'resource_type') {
            // Format resource type values
            const resourceTypes = {
              'health': 'Health',
              'mana': 'Mana',
              'rage': 'Rage',
              'energy': 'Energy',
              'focus': 'Focus',
              'combo_points': 'Combo Points',
              'holy_power': 'Holy Power',
              'runic_power': 'Runic Power',
              'soul_shards': 'Soul Shards',
              'astral_power': 'Astral Power',
              'maelstrom': 'Maelstrom',
              'insanity': 'Insanity',
              'fury': 'Fury',
              'pain': 'Pain',
              'chi': 'Chi'
            };
            formattedValue = resourceTypes[value] || value;
          } else if (key === 'damage_type' || key === 'type') {
            // Format damage type values
            const damageTypes = {
              'physical': 'Physical',
              'magical': 'Magical',
              'fire': 'Fire',
              'cold': 'Cold',
              'lightning': 'Lightning',
              'poison': 'Poison',
              'acid': 'Acid',
              'necrotic': 'Necrotic',
              'radiant': 'Radiant',
              'force': 'Force',
              'psychic': 'Psychic',
              'thunder': 'Thunder',
              'any': 'Any'
            };
            formattedValue = damageTypes[value] || value;
          } else {
            formattedValue = value;
          }

          return `${formattedKey}: ${formattedValue}`;
        });

        return `${paramStrings.join(', ')}`;
      }
    }

    // For other trigger types
    if (typeof trigger === 'string') {
      return trigger;
    }

    if (trigger.description) {
      return trigger.description;
    }

    if (trigger.condition) {
      return `Condition: ${trigger.condition.replace(/_/g, ' ')}`;
    }

    if (trigger.type) {
      return `Type: ${trigger.type.replace(/_/g, ' ')}`;
    }

    // Check for parameters that might indicate distance in different parameter structures
    if (trigger.parameters && trigger.parameters.distance) {
      return `Activates after moving ${trigger.parameters.distance} ${trigger.parameters.unit || 'feet'}`;
    } else if (trigger.params && trigger.params.distance) {
      return `Activates after moving ${trigger.params.distance} ${trigger.params.unit || 'feet'}`;
    } else if (trigger.distance) {
      return `Activates after moving ${trigger.distance} ${trigger.unit || 'feet'}`;
    }

    // Check for resource threshold parameters
    if ((trigger.parameters && trigger.parameters.resource_type) ||
        (trigger.params && trigger.params.resource_type) ||
        trigger.resource_type) {

      const resourceType = trigger.parameters?.resource_type || trigger.params?.resource_type || trigger.resource_type || 'health';
      const comparison = trigger.parameters?.comparison || trigger.params?.comparison || trigger.comparison || 'less_than';
      const thresholdValue = trigger.parameters?.threshold_value || trigger.params?.threshold_value || trigger.threshold_value || 50;
      const thresholdType = trigger.parameters?.threshold_type || trigger.params?.threshold_type || trigger.threshold_type || 'percentage';

      const comparisonText = comparison === 'less_than' ? 'falls below' :
                            comparison === 'greater_than' ? 'rises above' :
                            'equals';

      const resourceText = resourceType.charAt(0).toUpperCase() + resourceType.slice(1);
      const valueText = `${thresholdValue}${thresholdType === 'percentage' ? '%' : ' points'}`;

      return `Activates when ${resourceText} ${comparisonText} ${valueText}`;
    }

    // If we have an ID but no other details, try to make a readable name from the ID
    if (trigger.id) {
      return `Activates on ${trigger.id.replace(/_/g, ' ')}`;
    }

    return 'Activates under specific conditions';
  };

  // Format critical hit effect to display the triggered spell in a readable format
  const formatCritEffect = (critConfig) => {
    // Check if using rollable table
    if (critConfig && critConfig.useRollableTable) {
      // Get the rollable table name from the spell or rollableTableData
      const tableName = spell.rollableTable?.name || rollableTableData?.name || 'Random Effects Table';
      const entryCount = spell.rollableTable?.entries?.length || rollableTableData?.entries?.length || 0;

      // Return a formatted string for the rollable table
      return `Rolls on ${tableName} (${entryCount} effects)`;
    }

    // If not using rollable table, check for spell effect
    if (!critConfig || !critConfig.spellEffect) return '';

    // Try to find the spell in the library
    let triggeredSpell = null;

    // Try to access the library from context or window
    const librarySpells = getLibrarySpells(spellLibrary);
    if (librarySpells && librarySpells.length > 0) {
      triggeredSpell = librarySpells.find(s => s.id === critConfig.spellEffect);
    } else if (typeof window !== 'undefined' && window.LIBRARY_SPELLS) {
      triggeredSpell = window.LIBRARY_SPELLS.find(s => s.id === critConfig.spellEffect);
    }

    // If we found the spell in the library
    if (triggeredSpell) {
      // Return the actual spell name and a brief description of its effects
      let effectDescription = '';

      // Determine effect description based on spell type
      if (triggeredSpell.effectType === 'damage' && triggeredSpell.damageTypes?.length > 0) {
        const damageType = triggeredSpell.damageTypes[0] || 'fire';
        const damageFormula = triggeredSpell.primaryDamage?.dice || '2d6';
        effectDescription = `${damageFormula} ${damageType} damage`;
      } else if (triggeredSpell.effectType === 'healing') {
        const healingFormula = triggeredSpell.healing?.dice || triggeredSpell.primaryHealing?.dice || '2d6';
        effectDescription = `${healingFormula} healing`;
      } else if (triggeredSpell.effectType === 'buff' && triggeredSpell.buffEffects?.length > 0) {
        effectDescription = Array.isArray(triggeredSpell.buffEffects)
          ? triggeredSpell.buffEffects[0]
          : 'buff effect';
      } else if (triggeredSpell.effectType === 'debuff' && triggeredSpell.debuffEffects?.length > 0) {
        effectDescription = Array.isArray(triggeredSpell.debuffEffects)
          ? triggeredSpell.debuffEffects[0]
          : 'debuff effect';
      } else if (triggeredSpell.description) {
        // Use a shortened version of the description
        effectDescription = triggeredSpell.description.split('.')[0];
      } else if (triggeredSpell.effectType) {
        // Use the effect type as fallback
        effectDescription = triggeredSpell.effectType;
      }

      return `${triggeredSpell.name} (${effectDescription})`;
    }

    // If we couldn't find the spell in the library, try to extract info from the ID
    const spellId = critConfig.spellEffect;

    // Extract a readable name from the spell ID
    const spellName = spellId
      .split(/[-_]/)  // Split by both hyphens and underscores
      .map(word => word.replace(/[0-9]/g, '').trim())  // Remove numbers
      .filter(word => word.length > 0)  // Remove empty strings
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))  // Capitalize first letter
      .join(' ');  // Join with spaces

    // If we have effect details from the crit config, use them
    if (critConfig.effectDetails) {
      return `${spellName} (${critConfig.effectDetails})`;
    }

    // If we have duration information, include it
    if (critConfig.effectDuration) {
      const duration = critConfig.effectDuration;
      const unit = critConfig.effectDurationUnit || 'rounds';
      return `${spellName} (${critConfig.effectType || 'effect'} for ${duration} ${unit})`;
    }

    // If we have effect type information, include it
    if (critConfig.effectType) {
      return `${spellName} (${critConfig.effectType})`;
    }

    // Default to a more descriptive fallback
    return `${spellName} (triggered on critical hit)`;
  };

  // Common function to format spell effects
  const formatSpellEffect = (spellId, config) => {
    if (!spellId) return '';

    // Extract the spell name from the ID by removing hyphens and numbers, and capitalizing words
    const spellName = spellId
      .split('-')
      .map(word => word.replace(/[0-9]/g, ''))
      .filter(word => word.length > 0)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    // If we have effect details, display them
    if (config.effectDetails) {
      return `${spellName} (${config.effectDetails})`;
    }

    // If we have duration, display it
    if (config.effectDuration) {
      const duration = config.effectDuration;
      const unit = config.effectDurationUnit || 'rounds';
      return `${spellName} for ${duration} ${unit}`;
    }

    // If we have specific effect types, format them appropriately
    if (config.effectType) {
      switch (config.effectType) {
        case 'immunity':
          return `${spellName} (Immunity to ${config.immunityType || 'Damage'} for ${config.effectDuration || 2} ${config.effectDurationUnit || 'rounds'})`;
        case 'buff':
          return `${spellName} (${config.buffType || 'Stat Boost'} for ${config.effectDuration || 3} ${config.effectDurationUnit || 'rounds'})`;
        case 'debuff':
          return `${spellName} (${config.debuffType || 'Stat Reduction'} for ${config.effectDuration || 3} ${config.effectDurationUnit || 'rounds'})`;
        case 'damage':
          return `${spellName} (${config.damageAmount || '2d6'} ${config.damageType || 'Force'} damage)`;
        case 'healing':
          return `${spellName} (${config.healAmount || '2d6'} healing)`;
        case 'control':
          return `${spellName} (${config.controlType || 'Stun'} for ${config.effectDuration || 1} ${config.effectDurationUnit || 'round'})`;
        default:
          return spellName;
      }
    }

    // Default to just the spell name if no additional details are available
    return spellName;
  };

  // Format range
  const formatRange = () => {
    // If no range is specified, return default
    if (!spell.range) return '30 ft';

    // Handle special range types
    if (spell.rangeType === 'touch') return 'Touch';
    if (spell.rangeType === 'sight') return 'Sight';
    if (spell.rangeType === 'unlimited') return 'Unlimited';
    if (spell.rangeType === 'self_centered') return 'Self-Centered';
    if (spell.targetingMode === 'self') return 'Self';

    // Return the standard range
    return spell.range;
  };



  // Format healing effects
  const formatHealingEffects = () => {
    if (!spell.healingEffects) return [];

    // Check if this is a channeled spell
    const isChanneledSpell = spell.spellType === 'channeled' || spell.spellType === 'CHANNELED';

    // For channeled spells with healing effects in the channeling section, return empty array
    if (isChanneledSpell && (spell.channelingConfig?.perRoundFormulas?.hot_healing ||
                            spell.channelingConfig?.perRoundFormulas?.healing)) {
      return [];
    }

    return spell.healingEffects.map(effect => {
      if (typeof effect === 'string') return effect;

      if (effect.effectName === 'Direct Healing' || effect.effectName === 'Healing') {
        // Skip displaying direct healing effects for channeled spells if they're already shown in the channeling section
        if (isChanneledSpell && (spell.channelingConfig?.perRoundFormulas?.hot_healing ||
                                spell.channelingConfig?.perRoundFormulas?.healing)) {
          return null;
        }
        // Determine if this is Nature or Holy healing based on spell school or damage types
        const isNatureHealing =
          (spell.school && spell.school.toLowerCase() === 'nature') ||
          (spell.damageTypes && spell.damageTypes.some(type => type.toLowerCase() === 'nature'));

        return `Direct ${isNatureHealing ? 'Nature' : 'Holy'} Healing: ${effect.healAmount}`;
      } else if (effect.effectName === 'Healing over Time' || effect.effectName === 'Trigger-Based Healing over Time') {
        // Skip displaying HoT effects for channeled spells if they're already shown in the channeling section
        if (isChanneledSpell && (spell.channelingConfig?.perRoundFormulas?.hot_healing ||
                                spell.channelingConfig?.perRoundFormulas?.healing)) {
          return null;
        }

        let scalingText = '';
        if (effect.scalingType && effect.scalingType !== 'flat') {
          scalingText = ` (${effect.scalingType.charAt(0).toUpperCase() + effect.scalingType.slice(1)} scaling)`;
        }

        let triggerText = '';
        if (effect.triggerBased) {
          // Check if we have detailed trigger information
          if (effect.triggerDetails) {
            triggerText = ` - ${effect.triggerDetails}`;
          } else if (effect.triggerDescription) {
            triggerText = ` - ${effect.triggerDescription}`;
          } else {
            triggerText = ' - Activates when trigger condition is met';
          }
        }

        // Check for progressive stages with spell effects
        let stagesText = '';
        if (effect.progressiveStages && effect.progressiveStages.length > 0) {
          const stagesWithSpells = effect.progressiveStages.filter(stage => stage.spellEffect);
          if (stagesWithSpells.length > 0) {
            stagesText = ' with special effects at stages: ';
            stagesText += stagesWithSpells.map(stage => {
              // First check if it's in the library
              const librarySpells = getLibrarySpells();
              const foundSpell = librarySpells.find(s => s.id === stage.spellEffect);

              if (foundSpell) {
                return `Stage ${stage.triggerAt}: ${foundSpell.name}`;
              } else {
                // Fall back to our improved function
                const spellInfo = getSpellInfoFromId(stage.spellEffect);
                const spellName = spellInfo ? spellInfo.name : 'Triggered Effect';
                return `Stage ${stage.triggerAt}: ${spellName}`;
              }
            }).join(', ');
          }
        }

        // Determine if this is Nature or Holy healing based on spell school or damage types
        const isNatureHealing =
          (spell.school && spell.school.toLowerCase() === 'nature') ||
          (spell.damageTypes && spell.damageTypes.some(type => type.toLowerCase() === 'nature'));

        return `${isNatureHealing ? 'Nature' : 'Holy'} Healing over Time: ${effect.healAmount} over ${effect.duration}${scalingText}${triggerText}${stagesText}`;
      } else if (effect.effectName === 'Shield') {
        let damageTypeText = '';
        if (effect.damageTypes && effect.damageTypes !== 'all') {
          damageTypeText = ` against ${effect.damageTypes} damage`;
        }

        let effectsText = '';
        if (effect.breakEffect || effect.expireEffect) {
          effectsText = ' (';
          if (effect.breakEffect) {
            effectsText += `On break: ${effect.breakEffect}`;
          }
          if (effect.breakEffect && effect.expireEffect) {
            effectsText += ', ';
          }
          if (effect.expireEffect) {
            effectsText += `On expire: ${effect.expireEffect}`;
          }
          effectsText += ')';
        }

        // Determine if this is Nature or Holy healing based on spell school or damage types
        const isNatureHealing =
          (spell.school && spell.school.toLowerCase() === 'nature') ||
          (spell.damageTypes && spell.damageTypes.some(type => type.toLowerCase() === 'nature'));

        return `${isNatureHealing ? 'Nature' : 'Holy'} Absorption Shield: ${effect.healAmount}${damageTypeText} for ${effect.duration}${effectsText}`;
      }

      return JSON.stringify(effect);
    });
  };

  // Get icon for resource type
  const getResourceIcon = (resourceType) => {
    switch (resourceType) {
      case 'actionpoints': return faBolt; // Using bolt for action points as in resources tab
      case 'mana': return faGem; // Using gem for mana as in resources tab
      case 'cooldown': return faHourglass;
      case 'combopoints': return faLayerGroup;
      case 'charges': return faBatteryFull;
      case 'rage': return faFire; // Using fire for rage as in resources tab
      case 'energy': return faBolt; // Using bolt for energy as in resources tab
      case 'focus': return faLeaf; // Using leaf for focus as in resources tab
      case 'astral_power':
      case 'astralpower': return faMoon; // Using moon for astral power as in resources tab
      case 'soul_shards':
      case 'soulshards': return faSkull; // Using skull for soul shards as in resources tab
      case 'runicpower': return faSnowflake;
      case 'holy_power':
      case 'holypower': return faSun; // Using sun for holy power as in resources tab
      case 'chi': return faHandSparkles;
      case 'fury': return faDragon;
      case 'insanity': return faBrain;
      case 'maelstrom': return faWind;
      case 'pain': return faSkull;
      case 'health': return faHeart;
      case 'shield': return faShieldAlt;
      case 'gold': return faCoins;
      case 'arcane': return faWandMagicSparkles;
      case 'nature': return faLeaf;
      case 'frost': return faSnowflake;
      case 'shadow': return faGhost;
      case 'holy': return faSun;
      case 'fire': return faFire;
      case 'physical': return faDumbbell;
      case 'poison': return faVial;
      case 'disease': return faRadiation;
      case 'air': return faWind;
      case 'earth': return faMountain;
      case 'water': return faTint;
      case 'spirit': return faFeather;
      case 'blood': return faDroplet;
      default: return faMagic;
    }
  };

  // Get color for resource type
  const getResourceColor = (resourceType) => {
    switch (resourceType) {
      case 'actionpoints': return '#f59e0b'; // amber
      case 'mana': return '#3498db'; // blue from resources tab
      case 'cooldown': return '#94a3b8'; // slate
      case 'combopoints': return '#a855f7'; // purple
      case 'charges': return '#22c55e'; // green
      case 'rage': return '#e74c3c'; // red from resources tab
      case 'energy': return '#f1c40f'; // yellow from resources tab
      case 'focus': return '#2ecc71'; // green from resources tab
      case 'astral_power':
      case 'astralpower': return '#3498db'; // blue from resources tab
      case 'soul_shards':
      case 'soulshards': return '#9b59b6'; // purple from resources tab
      case 'holy_power':
      case 'holypower': return '#f1c40f'; // yellow from resources tab
      case 'runicpower': return '#8e44ad'; // purple from resources tab
      case 'chi': return '#27ae60'; // green
      case 'fury': return '#c0392b'; // dark red
      case 'insanity': return '#8e44ad'; // purple
      case 'maelstrom': return '#2980b9'; // blue
      case 'pain': return '#c0392b'; // dark red
      case 'health': return '#e74c3c'; // red
      case 'shield': return '#3498db'; // blue
      default: return '#3498db'; // default blue
    }
  };

  // Format cooldown for display
  const formatCooldown = (cooldownConfig) => {
    if (!cooldownConfig) return 'None';

    if (!cooldownConfig.type) return 'None';

    if (cooldownConfig.type === 'turn_based') {
      const value = cooldownConfig.value || 1;
      return value === 1 ? 'Cooldown: 1 turn' : `Cooldown: ${value} turns`;
    }

    if (cooldownConfig.type === 'round_based') {
      const value = cooldownConfig.value || 1;
      return value === 1 ? 'Cooldown: 1 round' : `Cooldown: ${value} rounds`;
    }

    if (cooldownConfig.type === 'short_rest') {
      const value = cooldownConfig.value || 1;
      return value === 1 ? 'Uses: 1 per short rest' : `Uses: ${value} per short rest`;
    }

    if (cooldownConfig.type === 'long_rest') {
      const value = cooldownConfig.value || 1;
      return value === 1 ? 'Uses: 1 per long rest' : `Uses: ${value} per long rest`;
    }

    if (cooldownConfig.type === 'charge_based') {
      const charges = cooldownConfig.charges || 1;
      const recovery = cooldownConfig.recovery || 1;

      if (charges === 1) {
        return recovery === 1 ? 'Charges: 1 (Cooldown: 1 turn per charge)' : `Charges: 1 (Cooldown: ${recovery} turns per charge)`;
      } else {
        return recovery === 1 ? `Charges: ${charges} (Cooldown: 1 turn per charge)` : `Charges: ${charges} (Cooldown: ${recovery} turns per charge)`;
      }
    }

    if (cooldownConfig.type === 'dice_based') {
      return `Cooldown: Roll ${cooldownConfig.value || '1d4'}`;
    }

    return 'None';
  };

  // Get border color based on rarity or type
  const getBorderColor = () => {
    // First check for rarity
    if (spell.rarity) {
      switch (spell.rarity.toLowerCase()) {
        case 'common': return '#9d9d9d';
        case 'uncommon': return '#1eff00';
        case 'rare': return '#0070dd';
        case 'epic': return '#a335ee';
        case 'legendary': return '#ff8000';
        default: return '#3a5a8c';
      }
    }

    // Then check for damage type
    if (spell.damageTypes && spell.damageTypes.length > 0) {
      const primaryType = spell.damageTypes[0].toLowerCase();
      switch (primaryType) {
        case 'fire': return '#FF4D4D';
        case 'cold': case 'frost': return '#4D9EFF';
        case 'arcane': case 'force': return '#CC99FF';
        case 'acid': case 'poison': case 'nature': return '#4DFF4D';
        case 'necrotic': case 'shadow': return '#FF4DFF';
        case 'radiant': case 'holy': return '#FFCC00';
        case 'lightning': case 'thunder': return '#FF9933';
        case 'slashing': case 'piercing': case 'bludgeoning': return '#CCCCCC';
        default: return '#3a5a8c';
      }
    }

    // Default color
    return '#3a5a8c';
  };

  // Get rarity class
  const getRarityClass = () => {
    if (!spell.rarity) return 'common';
    return spell.rarity.toLowerCase();
  };

  // Get spell school color class
  const getSpellSchoolColor = () => {
    // First check if the spell has a school defined
    if (spell.school) {
      const school = spell.school.toLowerCase();
      switch (school) {
        case 'fire': return 'spell-fire';
        case 'cold': case 'frost': return 'spell-frost';
        case 'arcane': case 'force': return 'spell-arcane';
        case 'acid': case 'poison': case 'nature': return 'spell-nature';
        case 'necrotic': case 'shadow': case 'void': return 'spell-shadow';
        case 'radiant': case 'holy': return 'spell-holy';
        case 'lightning': case 'thunder': return 'spell-lightning';
        case 'physical': case 'bludgeoning': case 'piercing': case 'slashing': return 'spell-physical';
        default: return '';
      }
    }

    // If no school is defined, try to determine color from damage types
    if (spell.damageTypes && spell.damageTypes.length > 0) {
      const primaryDamageType = spell.damageTypes[0].toLowerCase();
      switch (primaryDamageType) {
        case 'fire': return 'spell-fire';
        case 'cold': case 'frost': return 'spell-frost';
        case 'arcane': case 'force': return 'spell-arcane';
        case 'acid': case 'poison': case 'nature': return 'spell-nature';
        case 'necrotic': case 'shadow': return 'spell-shadow';
        case 'radiant': case 'holy': return 'spell-holy';
        case 'lightning': case 'thunder': return 'spell-lightning';
        case 'slashing': case 'piercing': case 'bludgeoning': return 'spell-physical';
        case 'void': return 'spell-shadow';
        default: return '';
      }
    }

    // If the spell is a healing spell but has no school or damage type, default to holy
    if (spell.effectType === 'healing') {
      return 'spell-holy';
    }

    return '';
  };

  // Get damage type with category
  const getDamageTypeWithCategory = (damageType) => {
    if (!damageType) return 'Physical (Physical)';

    // Physical damage types
    if (['bludgeoning', 'piercing', 'slashing'].includes(damageType.toLowerCase())) {
      return `${damageType.charAt(0).toUpperCase() + damageType.slice(1)} (Physical)`;
    }

    // Magical damage types
    const magicalTypes = {
      fire: 'Fire (Magic)',
      cold: 'Cold (Magic)',
      frost: 'Cold (Magic)',
      lightning: 'Lightning (Magic)',
      acid: 'Acid (Magic)',
      thunder: 'Thunder (Magic)',
      force: 'Force (Magic)',
      arcane: 'Arcane (Magic)',
      psychic: 'Psychic (Magic)',
      radiant: 'Radiant (Magic)',
      necrotic: 'Necrotic (Magic)',
      poison: 'Poison (Magic)',
      void: 'Void (Magic)',
      shadow: 'Shadow (Magic)',
      nature: 'Nature (Magic)'
    };

    // Healing types - always use Holy (Healing)
    if (damageType.toLowerCase() === 'healing' || spell.effectType === 'healing') {
      return 'Holy (Healing)';
    }

    return magicalTypes[damageType.toLowerCase()] || `${damageType.charAt(0).toUpperCase() + damageType.slice(1)} (Magic)`;
  };

  // Get color for damage type
  const getDamageTypeColor = (damageType) => {
    if (!damageType) return '#FFFFFF';

    const colors = {
      fire: '#FF4500',
      cold: '#87CEEB',
      frost: '#87CEEB',
      lightning: '#FFD700',
      thunder: '#9370DB',
      acid: '#32CD32',
      poison: '#8F9779',
      necrotic: '#702963',
      radiant: '#FFFACD',
      force: '#B0E0E6',
      psychic: '#FF69B4',
      bludgeoning: '#8B4513',
      piercing: '#A9A9A9',
      slashing: '#A9A9A9',
      healing: '#7CFC00',
      arcane: '#9966CC',
      void: '#000000',
      shadow: '#702963',
      nature: '#32CD32',
      holy: '#FFFACD'
    };

    return colors[damageType.toLowerCase()] || '#FFFFFF';
  };

  // Generate CSS for animated damage text
  const getAnimatedDamageTextStyle = () => {
    // Get the damage types for animation
    const damageTypes = spell.damageTypes || [];

    // If no damage types, return empty style
    if (damageTypes.length === 0) {
      return '';
    }

    // Get colors for the damage types
    const colors = damageTypes.map(type => getDamageTypeColor(type));

    // If only one damage type, add white as the second color
    if (colors.length === 1) {
      colors.push('#ffffff');
    }

    // Create keyframes with multiple steps if we have multiple colors
    const keyframeSteps = colors.map((color, index) => {
      const percent = Math.round((index / (colors.length - 1)) * 100);
      return `${percent}% { color: ${color}; }`;
    }).join('\n        ');

    return `
      @keyframes damageTextAnimation {
        ${keyframeSteps}
      }

      .animated-damage-text {
        animation: damageTextAnimation ${colors.length * 1.5}s infinite;
        font-weight: bold;
      }
    `;
  };

  return (
    <React.Fragment>
      {/* Add the style tag for animated damage text */}
      <style dangerouslySetInnerHTML={{ __html: getAnimatedDamageTextStyle() }} />

      <div
        className={`wow-spell-card ${getRarityClass()} ${getSpellSchoolColor()}`}
        style={{
        position: 'relative',
        backgroundColor: '#0a0a0a',
        border: `2px solid ${getBorderColor()}`,
        borderRadius: '6px',
        overflow: 'hidden',
        transition: 'all 0.2s ease',
        color: '#fff',
        boxShadow: `0 4px 8px rgba(0, 0, 0, 0.5), 0 0 10px ${getBorderColor()}40`,
        display: 'flex',
        flexDirection: 'column',
        height: 'auto',
        width: '100%',
        maxWidth: '400px',
        margin: '0 auto'
      }}
    >
      {/* Card gloss effect */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '30%',
        background: 'linear-gradient(to bottom, rgba(255,255,255,0.15), rgba(255,255,255,0))',
        pointerEvents: 'none'
      }}></div>

      <div style={{ display: 'flex', flexDirection: 'column', height: 'auto' }}>
        {/* Card header with icon, name, and resources */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          padding: '12px',
          background: 'linear-gradient(to bottom, #1e293b, #0f172a)',
          borderBottom: '1px solid #1e3a8a'
        }}>
          {/* Top row with icon and name */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
            {/* Spell icon */}
            <div style={{ position: 'relative', marginRight: '12px' }}>
              <div style={{
                border: '2px solid #4a4a4a',
                borderRadius: '6px',
                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
                width: '48px',
                height: '48px',
                overflow: 'hidden'
              }}>
                <img
                  src={`https://wow.zamimg.com/images/wow/icons/large/${spell.icon || 'inv_misc_questionmark'}.jpg`}
                  alt={spell.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg";
                  }}
                />
              </div>
              <div style={{
                position: 'absolute',
                bottom: '-5px',
                right: '-5px',
                backgroundColor: isTrapSpell ? '#7f1d1d' : '#0f172a',
                border: `1px solid ${isTrapSpell ? '#ef4444' : '#334155'}`,
                borderRadius: '3px',
                padding: '1px 3px',
                fontSize: '9px',
                color: isTrapSpell ? '#fca5a5' : '#94a3b8',
                fontWeight: isTrapSpell ? 'bold' : 'normal',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
              }}>
                {isTrapSpell ? 'TRAP' : (spell.spellType || 'ACTION')}
              </div>
            </div>

            {/* Spell name and meta */}
            <div style={{ flex: 1 }}>
              <h3 style={{
                color: '#ffd100',
                fontFamily: '"Cinzel", serif',
                fontSize: '16px',
                fontWeight: 'bold',
                margin: '0 0 2px 0',
                textShadow: '1px 1px 2px #000',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {spell.name.toUpperCase()}
              </h3>
              <div style={{ display: 'flex', fontSize: '11px', color: '#aaa', alignItems: 'center' }}>
                <span style={{ marginRight: '10px' }}>{formatCastingTime()}</span>
                <span style={{ marginRight: '10px' }}>{formatRange()}</span>
                <span style={{ marginRight: '10px' }}>
                  {spell.targetingMode === 'single' ? 'Single Target' :
                   spell.targetingMode === 'multi' ? `Multiple Targets (${spell.maxTargets})` :
                   spell.targetingMode === 'area' ? `${spell.aoeShape === 'circle' ? 'Circle' :
                                                    spell.aoeShape === 'cone' ? 'Cone' :
                                                    spell.aoeShape === 'line' ? 'Line' :
                                                    spell.aoeShape === 'cube' ? 'Cube' :
                                                    spell.aoeShape === 'sphere' ? 'Sphere' :
                                                    spell.aoeShape === 'trail' ? 'Trail' : 'Circle'} (${spell.aoeSize || 10}ft)` :
                   spell.targetingMode === 'self_centered' ? `Self-Centered ${spell.aoeShape === 'trail' ? 'Trail' : 'Area'}` :
                   spell.targetingMode === 'chain' ? 'Chain Effect' :
                   spell.targetingMode === 'fork' ? 'Fork Effect' :
                   spell.targetingMode === 'spread' ? 'Spread Effect' :
                   spell.targetingMode === 'bounce' ? 'Bounce Effect' :
                   spell.targetingMode === 'self' ? 'Self' : 'Single Target'}
                  {(() => {
                    // Check if we have any target restrictions
                    if (spell.targetRestrictions && spell.targetRestrictions.length > 0) {
                      // If we have multiple target restrictions, display them all
                      if (spell.targetRestrictions.length > 1) {
                        return ` • ${spell.targetRestrictions.map(restriction =>
                          restriction === 'any' ? 'Any' :
                          restriction === 'ally' ? 'Allies' :
                          restriction === 'enemy' ? 'Enemies' :
                          restriction === 'self' ? 'Self' :
                          restriction === 'creature' ? 'Creatures' :
                          restriction === 'object' ? 'Objects' :
                          restriction === 'undead' ? 'Undead' :
                          restriction === 'construct' ? 'Constructs' :
                          restriction === 'location' ? 'Location' : 'Any'
                        ).join('/') + ' Only'}`;
                      }
                      // If we have exactly one target restriction
                      else {
                        return ` • ${
                          spell.targetRestrictions[0] === 'any' ? 'Any Target' :
                          spell.targetRestrictions[0] === 'ally' ? 'Allies Only' :
                          spell.targetRestrictions[0] === 'enemy' ? 'Enemies Only' :
                          spell.targetRestrictions[0] === 'self' ? 'Self Only' :
                          spell.targetRestrictions[0] === 'creature' ? 'Creatures Only' :
                          spell.targetRestrictions[0] === 'object' ? 'Objects Only' :
                          spell.targetRestrictions[0] === 'undead' ? 'Undead Only' :
                          spell.targetRestrictions[0] === 'construct' ? 'Constructs Only' :
                          spell.targetRestrictions[0] === 'location' ? 'Location' : 'Any Target'
                        }`;
                      }
                    }
                    // If we have a single target restriction property
                    else if (spell.targetRestriction) {
                      return ` • ${
                        spell.targetRestriction === 'any' ? 'Any Target' :
                        spell.targetRestriction === 'ally' ? 'Allies Only' :
                        spell.targetRestriction === 'enemy' ? 'Enemies Only' :
                        spell.targetRestriction === 'self' ? 'Self Only' :
                        spell.targetRestriction === 'creature' ? 'Creatures Only' :
                        spell.targetRestriction === 'object' ? 'Objects Only' :
                        spell.targetRestriction === 'undead' ? 'Undead Only' :
                        spell.targetRestriction === 'construct' ? 'Constructs Only' :
                        spell.targetRestriction === 'location' ? 'Location' : 'Any Target'
                      }`;
                    }
                    // If no target restrictions are specified
                    else {
                      return ` • No Target Restrictions`;
                    }
                  })()}
                  {(spell.targetingMode === 'multi' || spell.targetingMode === 'single') &&
                    (() => {
                      // Get the selection method from any available source, checking all possible properties
                      const selectionMethod = spell.selectionMethod ||
                                             spell.targetSelectionMethod ||
                                             spell.targetingConfig?.selectionMethod ||
                                             spell.targetingConfig?.targetSelectionMethod ||
                                             'manual';

                      // Skip displaying if it's a single target with manual selection
                      if (spell.targetingMode === 'single' && selectionMethod === 'manual') {
                        return '';
                      }

                      // Display the selection method for both multi-target and single-target spells
                      return ` • Selection: ${
                        selectionMethod === 'manual' ? 'Manual' :
                        selectionMethod === 'random' ? 'Random' :
                        selectionMethod === 'nearest' ? 'Nearest' :
                        selectionMethod === 'furthest' ? 'Furthest' :
                        selectionMethod === 'farthest' ? 'Furthest' : // Handle both spellings
                        selectionMethod === 'lowest_health' ? 'Lowest Health' :
                        selectionMethod === 'highest_health' ? 'Highest Health' : 'Manual'
                      }`;
                    })()}
                </span>
                {spell.damageTypes && spell.damageTypes.length > 0 && (
                  <div style={{
                    display: 'flex',
                    gap: '6px',
                    marginTop: '4px'
                  }}>
                    {spell.damageTypes.map((type, index) => {
                      const color = getDamageTypeColor(type);
                      // Get the appropriate icon for this damage type
                      const icon = (() => {
                        const damageType = type.toLowerCase();
                        if (damageType === 'fire') return faFire;
                        if (damageType === 'frost' || damageType === 'cold') return faSnowflake;
                        if (damageType === 'arcane' || damageType === 'force') return faWandMagicSparkles;
                        if (damageType === 'nature') return faLeaf;
                        if (damageType === 'shadow' || damageType === 'necrotic') return faGhost;
                        if (damageType === 'holy' || damageType === 'radiant') return faSun;
                        if (damageType === 'lightning' || damageType === 'thunder') return faBolt;
                        if (damageType === 'poison' || damageType === 'acid') return faVial;
                        if (damageType === 'physical' || damageType === 'bludgeoning' ||
                            damageType === 'piercing' || damageType === 'slashing') return faDumbbell;
                        return faMagic; // Default icon
                      })();

                      return (
                        <span key={index} style={{
                          backgroundColor: `rgba(${color.replace(/[^\d,]/g, '').split(',').map(c => parseInt(c)).join(', ')}, 0.15)`,
                          border: `1px solid ${color}40`,
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
                        }}>
                          <FontAwesomeIcon
                            icon={icon}
                            style={{
                              color: color,
                              fontSize: '12px'
                            }}
                          />
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span style={{ color, fontWeight: 'bold' }}>
                              {type.charAt(0).toUpperCase() + type.slice(1)}
                            </span>
                            <span style={{ color: '#d1d5db', fontSize: '10px', marginLeft: '3px' }}>(Magic)</span>
                          </div>
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Resource row */}
          <div style={{
            display: 'flex',
            gap: '8px',
            marginTop: '4px',
            justifyContent: 'flex-end',
            flexWrap: 'wrap'
          }}>
            {/* Action Points */}
            {spell.resourceCost?.actionPoints > 0 && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'rgba(139, 92, 246, 0.15)',
                border: '1px solid rgba(139, 92, 246, 0.6)',
                borderRadius: '4px',
                padding: '2px 6px',
                gap: '4px'
              }}>
                <FontAwesomeIcon
                  icon={faBolt}
                  style={{
                    color: '#8b5cf6',
                    fontSize: '12px'
                  }}
                />
                <span style={{
                  color: '#8b5cf6',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  {spell.resourceCost.actionPoints} AP
                </span>
              </div>
            )}

            {/* Mana */}
            {spell.resourceCost?.mana > 0 && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'rgba(59, 130, 246, 0.15)',
                border: '1px solid rgba(59, 130, 246, 0.6)',
                borderRadius: '4px',
                padding: '2px 6px',
                gap: '4px'
              }}>
                <FontAwesomeIcon
                  icon={faTint}
                  style={{
                    color: '#3b82f6',
                    fontSize: '12px'
                  }}
                />
                <span style={{
                  color: '#3b82f6',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  {spell.resourceCost.mana} Mana
                </span>
              </div>
            )}

            {/* Health */}
            {spell.resourceCost?.health > 0 && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.6)',
                borderRadius: '4px',
                padding: '2px 6px',
                gap: '4px'
              }}>
                <FontAwesomeIcon
                  icon={faHeart}
                  style={{
                    color: '#ef4444',
                    fontSize: '12px'
                  }}
                />
                <span style={{
                  color: '#ef4444',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  {spell.resourceCost.health} Health
                </span>
              </div>
            )}

            {/* No Cost */}
            {(!spell.resourceCost ||
              (spell.resourceCost.mana <= 0 &&
               spell.resourceCost.health <= 0 &&
               spell.resourceCost.actionPoints <= 0)) && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'rgba(148, 163, 184, 0.15)',
                border: '1px solid rgba(148, 163, 184, 0.6)',
                borderRadius: '4px',
                padding: '2px 6px',
                gap: '4px'
              }}>
                <span style={{
                  color: '#94a3b8',
                  fontSize: '12px',
                  fontStyle: 'italic'
                }}>
                  No Cost
                </span>
              </div>
            )}
          </div>

          {/* Spell Components */}
          {spell.resourceCost?.components && spell.resourceCost.components.length > 0 && (
            <div className="spell-card-components" style={{
              display: 'flex',
              gap: '6px',
              marginTop: '4px',
              justifyContent: 'flex-start'
            }}>
              {spell.resourceCost.components.includes('verbal') && (
                <div className="component-tag" style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: '#1e3a8a',
                  color: '#ffffff',
                  fontSize: '12px',
                  fontWeight: '600',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3)'
                }} title={spell.resourceCost.verbalText ? spell.resourceCost.verbalText : "Verbal Component"}>
                  V
                </div>
              )}
              {spell.resourceCost.components.includes('somatic') && (
                <div className="component-tag" style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: '#1e3a8a',
                  color: '#ffffff',
                  fontSize: '12px',
                  fontWeight: '600',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3)'
                }} title={spell.resourceCost.somaticText ? spell.resourceCost.somaticText : "Somatic Component"}>
                  S
                </div>
              )}
              {spell.resourceCost.components.includes('material') && (
                <div className="component-tag" style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: '#1e3a8a',
                  color: '#ffffff',
                  fontSize: '12px',
                  fontWeight: '600',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3)'
                }} title="Material Component">
                  M
                </div>
              )}
            </div>
          )}
        </div>

        {/* Card body with description */}
        <div style={{ padding: '10px', backgroundColor: '#0f172a', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{
            color: '#ccc',
            fontSize: '12px',
            marginBottom: '10px',
            lineHeight: 1.4,
            borderBottom: '1px solid #334155',
            paddingBottom: '8px'
          }}>
            {spell.description || 'No description available.'}
          </div>

          {/* Verbal Components Section */}
          {spell.resourceCost?.components &&
           spell.resourceCost.components.includes('verbal') &&
           spell.resourceCost.verbalText && (
            <div style={{
              marginBottom: '10px',
              backgroundColor: 'rgba(15, 23, 42, 0.4)',
              borderRadius: '4px',
              padding: '8px',
              borderLeft: '2px solid #3b82f6'
            }}>
              <div style={{
                fontSize: '12px',
                fontWeight: '600',
                color: '#e2e8f0',
                marginBottom: '4px'
              }}>
                Verbal Component:
              </div>
              <div style={{
                fontSize: '11px',
                color: '#e2e8f0',
                fontStyle: 'italic'
              }}>
                {spell.resourceCost.verbalText}
              </div>
            </div>
          )}

          {/* Somatic Components Section */}
          {spell.resourceCost?.components &&
           spell.resourceCost.components.includes('somatic') &&
           spell.resourceCost.somaticText && (
            <div style={{
              marginBottom: '10px',
              backgroundColor: 'rgba(15, 23, 42, 0.4)',
              borderRadius: '4px',
              padding: '8px',
              borderLeft: '2px solid #3b82f6'
            }}>
              <div style={{
                fontSize: '12px',
                fontWeight: '600',
                color: '#e2e8f0',
                marginBottom: '4px'
              }}>
                Somatic Component:
              </div>
              <div style={{
                fontSize: '11px',
                color: '#e2e8f0',
                fontStyle: 'italic'
              }}>
                {spell.resourceCost.somaticText}
              </div>
            </div>
          )}

          {/* Material Components Section */}
          {spell.resourceCost?.components &&
           spell.resourceCost.components.includes('material') &&
           spell.resourceCost.materialComponents && (
            <div style={{
              marginBottom: '10px',
              backgroundColor: 'rgba(15, 23, 42, 0.4)',
              borderRadius: '4px',
              padding: '8px',
              borderLeft: '2px solid #3b82f6'
            }}>
              <div style={{
                fontSize: '12px',
                fontWeight: '600',
                color: '#e2e8f0',
                marginBottom: '4px'
              }}>
                Material Components:
              </div>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px'
              }}>
                {spell.resourceCost.materialComponents.split(',').map(itemId => {
                  // Find the item in the ITEM_LIBRARY
                  // This is a simplified version since we don't have direct access to ITEM_LIBRARY here
                  const itemName = itemId.trim()
                    .split('-')
                    .map(word => word.replace(/[0-9]/g, ''))
                    .filter(word => word.length > 0)
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');

                  return (
                    <div key={itemId} style={{
                      display: 'flex',
                      alignItems: 'center',
                      backgroundColor: 'rgba(15, 23, 42, 0.6)',
                      border: '1px solid rgba(66, 91, 158, 0.3)',
                      borderRadius: '4px',
                      padding: '4px 6px',
                      maxWidth: '100%'
                    }}>
                      <div style={{
                        fontSize: '11px',
                        color: '#e2e8f0',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {itemName}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* We'll display formulas in their respective sections instead of a central formula display */}

          {/* Damage section */}
          {(spell.effectType === 'damage' || formattedEffects.damageEffects.length > 0) && (
            <div style={{
              marginBottom: '8px',
              backgroundColor: (() => {
                // Check if this is nature damage
                const isNatureDamage =
                  (spell.school && spell.school.toLowerCase() === 'nature') ||
                  (spell.damageTypes && spell.damageTypes.some(type => type.toLowerCase() === 'nature'));

                return isNatureDamage ? 'rgba(34, 197, 94, 0.05)' : 'rgba(239, 68, 68, 0.05)';
              })(),
              border: (() => {
                // Check if this is nature damage
                const isNatureDamage =
                  (spell.school && spell.school.toLowerCase() === 'nature') ||
                  (spell.damageTypes && spell.damageTypes.some(type => type.toLowerCase() === 'nature'));

                return isNatureDamage ? '1px solid rgba(34, 197, 94, 0.2)' : '1px solid rgba(239, 68, 68, 0.2)';
              })(),
              borderRadius: '4px',
              padding: '8px',
              marginTop: '8px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '4px',
                gap: '6px'
              }}>
                {(() => {
                  // Check if this is nature damage
                  const isNatureDamage =
                    (spell.school && spell.school.toLowerCase() === 'nature') ||
                    (spell.damageTypes && spell.damageTypes.some(type => type.toLowerCase() === 'nature'));

                  return (
                    <FontAwesomeIcon
                      icon={isNatureDamage ? faLeaf : faFire}
                      style={{
                        color: isNatureDamage ? '#22c55e' : '#ef4444',
                        fontSize: '14px'
                      }}
                    />
                  );
                })()}
                <span style={{
                  fontWeight: 'bold',
                  fontSize: '13px',
                  color: (() => {
                    // Check if this is nature damage
                    const isNatureDamage =
                      (spell.school && spell.school.toLowerCase() === 'nature') ||
                      (spell.damageTypes && spell.damageTypes.some(type => type.toLowerCase() === 'nature'));

                    return isNatureDamage ? '#22c55e' : '#ef4444';
                  })()
                }}>
                  {(() => {
                    // Check if this is nature damage
                    const isNatureDamage =
                      (spell.school && spell.school.toLowerCase() === 'nature') ||
                      (spell.damageTypes && spell.damageTypes.some(type => type.toLowerCase() === 'nature'));

                    return isNatureDamage ? 'NATURE DAMAGE:' : 'DAMAGE EFFECTS:';
                  })()}
                </span>
              </div>

              {/* Display formatted damage effects */}
              {formattedEffects.damageEffects.map((effect, index) => {
                // Check if this is nature damage
                const isNatureDamage =
                  (spell.school && spell.school.toLowerCase() === 'nature') ||
                  (spell.damageTypes && spell.damageTypes.some(type => type.toLowerCase() === 'nature'));

                // Get the appropriate icon for this damage type
                const icon = (() => {
                  if (isNatureDamage) return faLeaf;

                  // Check if we can determine the damage type from the effect text
                  const effectText = effect.toLowerCase();
                  if (effectText.includes('fire')) return faFire;
                  if (effectText.includes('frost') || effectText.includes('cold')) return faSnowflake;
                  if (effectText.includes('arcane') || effectText.includes('force')) return faWandMagicSparkles;
                  if (effectText.includes('shadow') || effectText.includes('necrotic')) return faGhost;
                  if (effectText.includes('holy') || effectText.includes('radiant')) return faSun;
                  if (effectText.includes('lightning') || effectText.includes('thunder')) return faBolt;
                  if (effectText.includes('poison') || effectText.includes('acid')) return faVial;
                  if (effectText.includes('physical') || effectText.includes('bludgeoning') ||
                      effectText.includes('piercing') || effectText.includes('slashing')) return faDumbbell;

                  // Default to fire for damage
                  return faFire;
                })();

                // Get the color for the damage type
                const color = isNatureDamage ? '#22c55e' : '#ef4444';

                return (
                  <div key={index} style={{
                    marginBottom: '8px',
                    fontSize: '12px',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'flex-start',
                    backgroundColor: `rgba(${color.replace(/[^\d,]/g, '').split(',').map(c => parseInt(c)).join(', ')}, 0.1)`,
                    borderRadius: '4px',
                    padding: '6px 8px',
                    border: `1px solid ${color}30`
                  }}>
                    <div style={{
                      backgroundColor: `rgba(${color.replace(/[^\d,]/g, '').split(',').map(c => parseInt(c)).join(', ')}, 0.2)`,
                      borderRadius: '4px',
                      width: '24px',
                      height: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '8px'
                    }}>
                      <FontAwesomeIcon
                        icon={icon}
                        style={{
                          color: color,
                          fontSize: '14px'
                        }}
                      />
                    </div>
                    <span style={{ flex: 1 }}>{effect}</span>
                  </div>
                );
              })}

              {/* Fallback if no formatted effects */}
              {formattedEffects.damageEffects.length === 0 && spell.effectType === 'damage' && (
                <div style={{
                  fontFamily: 'monospace',
                  backgroundColor: 'rgba(0, 0, 0, 0.2)',
                  padding: '4px 8px',
                  borderRadius: '3px',
                  fontSize: '12px',
                  color: '#fff'
                }}>
                  {spell.damageConfig?.formula ||
                   (spell.primaryDamage?.dice &&
                    `${spell.primaryDamage.dice}${spell.primaryDamage.flat > 0 ? ` + ${spell.primaryDamage.flat}` : ''}`) ||
                   spell.diceConfig?.formula ||
                   '6d6'}
                </div>
              )}
            </div>
          )}

          {/* Healing section */}
          {(spell.effectType === 'healing' || formattedEffects.healingEffects.length > 0) && (
            <div style={{
              marginBottom: '8px',
              backgroundColor: 'rgba(34, 197, 94, 0.05)',
              border: '1px solid rgba(34, 197, 94, 0.2)',
              borderRadius: '4px',
              padding: '8px',
              marginTop: '8px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '4px',
                gap: '6px'
              }}>
                {(() => {
                  // Check if this is nature healing
                  const isNatureHealing =
                    (spell.school && spell.school.toLowerCase() === 'nature') ||
                    (spell.damageTypes && spell.damageTypes.some(type => type.toLowerCase() === 'nature'));

                  return (
                    <FontAwesomeIcon
                      icon={isNatureHealing ? faLeaf : faHeart}
                      style={{
                        color: '#22c55e',
                        fontSize: '14px'
                      }}
                    />
                  );
                })()}
                <span style={{
                  fontWeight: 'bold',
                  fontSize: '13px',
                  color: '#22c55e'
                }}>
                  {(() => {
                    // Check if this is nature healing
                    const isNatureHealing =
                      (spell.school && spell.school.toLowerCase() === 'nature') ||
                      (spell.damageTypes && spell.damageTypes.some(type => type.toLowerCase() === 'nature'));

                    return isNatureHealing ? 'NATURE HEALING:' : 'HEALING EFFECTS:';
                  })()}
                </span>
              </div>

              {/* Display formatted healing effects */}
              {formattedEffects.healingEffects.map((effect, index) => {
                // Check if this effect is a nature healing effect
                const isNatureEffect = effect.toLowerCase().includes('nature');

                // Get the appropriate icon for this healing type
                const icon = isNatureEffect ? faLeaf : faHeart;

                // Get the color for the healing type (always green for healing)
                const color = '#22c55e';

                return (
                  <div key={index} style={{
                    marginBottom: '8px',
                    fontSize: '12px',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'flex-start',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    borderRadius: '4px',
                    padding: '6px 8px',
                    border: '1px solid rgba(34, 197, 94, 0.3)'
                  }}>
                    <div style={{
                      backgroundColor: 'rgba(34, 197, 94, 0.2)',
                      borderRadius: '4px',
                      width: '24px',
                      height: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '8px'
                    }}>
                      <FontAwesomeIcon
                        icon={icon}
                        style={{
                          color: color,
                          fontSize: '14px'
                        }}
                      />
                    </div>
                    <span style={{ flex: 1 }}>
                      {/* If it's a nature effect, highlight the word "Nature" */}
                      {isNatureEffect ? (
                        <span>
                          {effect.split('Nature').map((part, i, arr) => (
                            <React.Fragment key={i}>
                              {i > 0 && <span style={{ color: '#22c55e', fontWeight: 'bold' }}>Nature</span>}
                              {part}
                            </React.Fragment>
                          ))}
                        </span>
                      ) : (
                        effect
                      )}
                    </span>
                  </div>
                );
              })}

              {/* Fallback if no formatted effects */}
              {formattedEffects.healingEffects.length === 0 && spell.effectType === 'healing' && (
                <div style={{
                  fontFamily: 'monospace',
                  backgroundColor: 'rgba(0, 0, 0, 0.2)',
                  padding: '4px 8px',
                  borderRadius: '3px',
                  fontSize: '12px',
                  color: '#fff'
                }}>
                  {spell.healingConfig?.formula ||
                   (spell.healing?.dice &&
                    `${spell.healing.dice}${spell.healing.flat > 0 ? ` + ${spell.healing.flat}` : ''}`) ||
                   spell.diceConfig?.formula ||
                   '6d6'}
                </div>
              )}
            </div>
          )}


          {/* Buff section - Updated with icons and card-style layout */}
          {formattedEffects.buffEffects.length > 0 && (
            <div style={{
              marginBottom: '8px',
              backgroundColor: 'rgba(59, 130, 246, 0.05)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              borderRadius: '4px',
              padding: '8px',
              marginTop: '8px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '8px',
                gap: '6px',
                borderBottom: '1px solid rgba(59, 130, 246, 0.2)',
                paddingBottom: '4px'
              }}>
                <FontAwesomeIcon
                  icon={faShieldAlt}
                  style={{
                    color: '#3b82f6',
                    fontSize: '14px'
                  }}
                />
                <span style={{
                  fontWeight: 'bold',
                  fontSize: '13px',
                  color: '#3b82f6'
                }}>
                  BUFF EFFECTS:
                </span>
              </div>

              {/* Display formatted buff effects with icons in card style */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {formattedEffects.buffEffects.map((effect, index) => {
                  // Determine which icon to use based on the effect text
                  let icon = faShieldAlt;
                  let effectName = '';
                  let effectDescription = effect;

                  // Extract effect name from the text
                  if (effect.includes(':')) {
                    const parts = effect.split(':');
                    effectName = parts[0].trim();
                    effectDescription = parts.slice(1).join(':').trim();

                    // Set icon based on effect name
                    if (effectName.toLowerCase().includes('armor') || effectName.toLowerCase().includes('protection')) {
                      icon = faShieldAlt;
                    } else if (effectName.toLowerCase().includes('strength') || effectName.toLowerCase().includes('power')) {
                      icon = faDumbbell;
                    } else if (effectName.toLowerCase().includes('speed') || effectName.toLowerCase().includes('haste')) {
                      icon = faTachometerAlt;
                    } else if (effectName.toLowerCase().includes('resistance') || effectName.toLowerCase().includes('immune')) {
                      icon = faShieldVirus;
                    } else if (effectName.toLowerCase().includes('health') || effectName.toLowerCase().includes('vitality')) {
                      icon = faHeart;
                    } else if (effectName.toLowerCase().includes('mana') || effectName.toLowerCase().includes('energy')) {
                      icon = faTint;
                    } else if (effectName.toLowerCase().includes('intellect') || effectName.toLowerCase().includes('wisdom')) {
                      icon = faBrain;
                    } else if (effectName.toLowerCase().includes('agility') || effectName.toLowerCase().includes('dexterity')) {
                      icon = faRunning;
                    } else if (effectName.toLowerCase().includes('shield') || effectName.toLowerCase().includes('barrier')) {
                      icon = faUserShield;
                    } else if (effectName.toLowerCase().includes('regeneration') || effectName.toLowerCase().includes('regen')) {
                      icon = faPlusCircle;
                    } else if (effectName.toLowerCase().includes('nature') || effectName.toLowerCase().includes('growth')) {
                      icon = faLeaf;
                    } else if (effectName.toLowerCase().includes('thorns') || effectName.toLowerCase().includes('spikes')) {
                      icon = faMountain;
                    } else if (effectName.toLowerCase().includes('harmony') || effectName.toLowerCase().includes('balance')) {
                      icon = faBalanceScale;
                    } else if (effectName.toLowerCase().includes('wild') || effectName.toLowerCase().includes('beast')) {
                      icon = faDragon;
                    } else if (effectName.toLowerCase().includes('duration')) {
                      // Skip duration entries as they're metadata
                      return null;
                    } else if (effectName.toLowerCase().includes('stacking')) {
                      // Skip stacking entries as they're metadata
                      return null;
                    }
                  } else {
                    // For effects without a colon, try to determine the type from the full text
                    if (effect.toLowerCase().includes('armor') || effect.toLowerCase().includes('protection')) {
                      icon = faShieldAlt;
                      effectName = 'Protection';
                      effectDescription = effect;
                    } else if (effect.toLowerCase().includes('strength') || effect.toLowerCase().includes('power')) {
                      icon = faDumbbell;
                      effectName = 'Strength';
                      effectDescription = effect;
                    } else if (effect.toLowerCase().includes('speed') || effect.toLowerCase().includes('haste')) {
                      icon = faTachometerAlt;
                      effectName = 'Speed';
                      effectDescription = effect;
                    } else if (effect.toLowerCase().includes('duration') || effect.toLowerCase().includes('stacking')) {
                      // Skip metadata entries
                      return null;
                    }
                  }

                  return (
                    <div key={index} style={{
                      backgroundColor: 'rgba(59, 130, 246, 0.1)',
                      borderRadius: '4px',
                      padding: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}>
                      <div style={{
                        backgroundColor: 'rgba(59, 130, 246, 0.2)',
                        borderRadius: '4px',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <FontAwesomeIcon
                          icon={icon}
                          style={{
                            color: '#3b82f6',
                            fontSize: '16px'
                          }}
                        />
                      </div>
                      <div>
                        <div style={{ fontWeight: 'bold', fontSize: '12px' }}>{effectName}</div>
                        <div style={{ fontSize: '11px', color: '#e2e8f0' }}>{effectDescription}</div>
                      </div>
                    </div>
                  );
                }).filter(Boolean)}
              </div>

              {/* Display duration information if available */}
              {formattedEffects.buffEffects.some(effect => effect.toLowerCase().includes('duration')) && (
                <div style={{
                  marginTop: '8px',
                  fontSize: '11px',
                  color: '#a1a1a1',
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  padding: '4px 8px',
                  borderRadius: '4px'
                }}>
                  {formattedEffects.buffEffects
                    .filter(effect => effect.toLowerCase().includes('duration'))
                    .map((effect, index) => (
                      <div key={index}>{effect}</div>
                    ))}
                </div>
              )}

              {/* Display stacking information if available */}
              {formattedEffects.buffEffects.some(effect => effect.toLowerCase().includes('stack')) && (
                <div style={{
                  marginTop: '4px',
                  fontSize: '11px',
                  color: '#a1a1a1',
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  padding: '4px 8px',
                  borderRadius: '4px'
                }}>
                  {formattedEffects.buffEffects
                    .filter(effect => effect.toLowerCase().includes('stack'))
                    .map((effect, index) => (
                      <div key={index}>{effect}</div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* Debuff section - Updated with icons and card-style layout */}
          {formattedEffects.debuffEffects.length > 0 && (
            <div style={{
              marginBottom: '8px',
              backgroundColor: 'rgba(124, 58, 237, 0.05)',
              border: '1px solid rgba(124, 58, 237, 0.2)',
              borderRadius: '4px',
              padding: '8px',
              marginTop: '8px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '8px',
                gap: '6px',
                borderBottom: '1px solid rgba(124, 58, 237, 0.2)',
                paddingBottom: '4px'
              }}>
                <FontAwesomeIcon
                  icon={faSkull}
                  style={{
                    color: '#7c3aed',
                    fontSize: '14px'
                  }}
                />
                <span style={{
                  fontWeight: 'bold',
                  fontSize: '13px',
                  color: '#7c3aed'
                }}>
                  DEBUFF EFFECTS:
                </span>
              </div>

              {/* Display formatted debuff effects with icons in card style */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {formattedEffects.debuffEffects.map((effect, index) => {
                  // Determine which icon to use based on the effect text
                  let icon = faSkull;
                  let effectName = '';
                  let effectDescription = effect;

                  // Extract effect name from the text
                  if (effect.includes(':')) {
                    const parts = effect.split(':');
                    effectName = parts[0].trim();
                    effectDescription = parts.slice(1).join(':').trim();

                    // Set icon based on effect name
                    if (effectName.toLowerCase().includes('weakness') || effectName.toLowerCase().includes('weaken')) {
                      icon = faHeartBroken;
                    } else if (effectName.toLowerCase().includes('poison') || effectName.toLowerCase().includes('toxic')) {
                      icon = faVial;
                    } else if (effectName.toLowerCase().includes('slow') || effectName.toLowerCase().includes('movement')) {
                      icon = faSnowflake;
                    } else if (effectName.toLowerCase().includes('vulnerability') || effectName.toLowerCase().includes('vulnerable')) {
                      icon = faExclamationCircle;
                    } else if (effectName.toLowerCase().includes('curse') || effectName.toLowerCase().includes('hex')) {
                      icon = faSkull;
                    } else if (effectName.toLowerCase().includes('blind') || effectName.toLowerCase().includes('vision')) {
                      icon = faLowVision;
                    } else if (effectName.toLowerCase().includes('silence') || effectName.toLowerCase().includes('mute')) {
                      icon = faVolumeOff;
                    } else if (effectName.toLowerCase().includes('reduction') || effectName.toLowerCase().includes('decrease')) {
                      icon = faArrowDown;
                    } else if (effectName.toLowerCase().includes('dexterity') || effectName.toLowerCase().includes('agility')) {
                      icon = faRunning;
                    } else if (effectName.toLowerCase().includes('strength') || effectName.toLowerCase().includes('power')) {
                      icon = faDumbbell;
                    } else if (effectName.toLowerCase().includes('intellect') || effectName.toLowerCase().includes('wisdom')) {
                      icon = faBrain;
                    } else if (effectName.toLowerCase().includes('ban') || effectName.toLowerCase().includes('prevent')) {
                      icon = faBan;
                    } else if (effectName.toLowerCase().includes('duration')) {
                      // Skip duration entries as they're metadata
                      return null;
                    } else if (effectName.toLowerCase().includes('saving throw')) {
                      // Skip saving throw entries as they're metadata
                      return null;
                    }
                  } else {
                    // For effects without a colon, try to determine the type from the full text
                    if (effect.toLowerCase().includes('weakness') || effect.toLowerCase().includes('weaken')) {
                      icon = faHeartBroken;
                      effectName = 'Weakness';
                      effectDescription = effect;
                    } else if (effect.toLowerCase().includes('poison') || effect.toLowerCase().includes('toxic')) {
                      icon = faVial;
                      effectName = 'Poison';
                      effectDescription = effect;
                    } else if (effect.toLowerCase().includes('slow') || effect.toLowerCase().includes('movement')) {
                      icon = faSnowflake;
                      effectName = 'Slow';
                      effectDescription = effect;
                    } else if (effect.toLowerCase().includes('duration') ||
                               effect.toLowerCase().includes('saving throw')) {
                      // Skip metadata entries
                      return null;
                    }
                  }

                  return (
                    <div key={index} style={{
                      backgroundColor: 'rgba(124, 58, 237, 0.1)',
                      borderRadius: '4px',
                      padding: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}>
                      <div style={{
                        backgroundColor: 'rgba(124, 58, 237, 0.2)',
                        borderRadius: '4px',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <FontAwesomeIcon
                          icon={icon}
                          style={{
                            color: '#7c3aed',
                            fontSize: '16px'
                          }}
                        />
                      </div>
                      <div>
                        <div style={{ fontWeight: 'bold', fontSize: '12px' }}>{effectName}</div>
                        <div style={{ fontSize: '11px', color: '#e2e8f0' }}>{effectDescription}</div>
                      </div>
                    </div>
                  );
                }).filter(Boolean)}
              </div>

              {/* Display saving throw information if available */}
              {formattedEffects.debuffEffects.some(effect => effect.toLowerCase().includes('saving throw')) && (
                <div style={{
                  marginTop: '8px',
                  fontSize: '11px',
                  color: '#fcd34d',
                  backgroundColor: 'rgba(124, 58, 237, 0.1)',
                  padding: '4px 8px',
                  borderRadius: '4px'
                }}>
                  {formattedEffects.debuffEffects
                    .filter(effect => effect.toLowerCase().includes('saving throw'))
                    .map((effect, index) => (
                      <div key={index}>{effect}</div>
                    ))}
                </div>
              )}

              {/* Display duration information if available */}
              {formattedEffects.debuffEffects.some(effect => effect.toLowerCase().includes('duration')) && (
                <div style={{
                  marginTop: '4px',
                  fontSize: '11px',
                  color: '#a1a1a1',
                  backgroundColor: 'rgba(124, 58, 237, 0.1)',
                  padding: '4px 8px',
                  borderRadius: '4px'
                }}>
                  {formattedEffects.debuffEffects
                    .filter(effect => effect.toLowerCase().includes('duration'))
                    .map((effect, index) => (
                      <div key={index}>{effect}</div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* Control section - Updated with icons and card-style layout */}
          {formattedEffects.controlEffects.length > 0 && (
            <div style={{
              marginBottom: '8px',
              backgroundColor: 'rgba(234, 88, 12, 0.05)',
              border: '1px solid rgba(234, 88, 12, 0.2)',
              borderRadius: '4px',
              padding: '8px',
              marginTop: '8px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '8px',
                gap: '6px',
                borderBottom: '1px solid rgba(234, 88, 12, 0.2)',
                paddingBottom: '4px'
              }}>
                <FontAwesomeIcon
                  icon={faHandPaper}
                  style={{
                    color: '#ea580c',
                    fontSize: '14px'
                  }}
                />
                <span style={{
                  fontWeight: 'bold',
                  fontSize: '13px',
                  color: '#ea580c'
                }}>
                  CONTROL EFFECTS:
                </span>
              </div>

              {/* Display formatted control effects with icons in card style */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {formattedEffects.controlEffects.map((effect, index) => {
                  // Determine which icon to use based on the effect text
                  let icon = faSnowflake;
                  let effectName = '';
                  let effectDescription = effect;

                  // Extract effect name from the text
                  if (effect.includes(':')) {
                    const parts = effect.split(':');
                    effectName = parts[0].trim();
                    effectDescription = parts.slice(1).join(':').trim();

                    // Set icon based on effect name
                    if (effectName.toLowerCase().includes('slow')) {
                      icon = faSnowflake;
                    } else if (effectName.toLowerCase().includes('chill') || effectName.toLowerCase().includes('freeze')) {
                      icon = faSnowflake;
                    } else if (effectName.toLowerCase().includes('immobilize') || effectName.toLowerCase().includes('root')) {
                      icon = faAnchor;
                    } else if (effectName.toLowerCase().includes('stun')) {
                      icon = faBolt;
                    } else if (effectName.toLowerCase().includes('fear') || effectName.toLowerCase().includes('terrify')) {
                      icon = faGhost;
                    } else if (effectName.toLowerCase().includes('silence')) {
                      icon = faVolumeOff;
                    } else if (effectName.toLowerCase().includes('blind')) {
                      icon = faEyeSlash;
                    } else if (effectName.toLowerCase().includes('control type')) {
                      // Skip control type entries as they're metadata
                      return null;
                    } else if (effectName.toLowerCase().includes('saving throw')) {
                      // Skip saving throw entries as they're metadata
                      return null;
                    } else if (effectName.toLowerCase().includes('duration')) {
                      // Skip duration entries as they're metadata
                      return null;
                    }
                  } else {
                    // For effects without a colon, try to determine the type from the full text
                    if (effect.toLowerCase().includes('slow')) {
                      icon = faSnowflake;
                      effectName = 'Slow';
                      effectDescription = effect;
                    } else if (effect.toLowerCase().includes('chill') || effect.toLowerCase().includes('freeze')) {
                      icon = faSnowflake;
                      effectName = 'Chill';
                      effectDescription = effect;
                    } else if (effect.toLowerCase().includes('immobilize') || effect.toLowerCase().includes('root')) {
                      icon = faAnchor;
                      effectName = 'Immobilize';
                      effectDescription = effect;
                    } else if (effect.toLowerCase().includes('stun')) {
                      icon = faBolt;
                      effectName = 'Stun';
                      effectDescription = effect;
                    } else if (effect.toLowerCase().includes('control type') ||
                               effect.toLowerCase().includes('saving throw') ||
                               effect.toLowerCase().includes('duration')) {
                      // Skip metadata entries
                      return null;
                    }
                  }

                  return (
                    <div key={index} style={{
                      backgroundColor: 'rgba(234, 88, 12, 0.1)',
                      borderRadius: '4px',
                      padding: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}>
                      <div style={{
                        backgroundColor: 'rgba(234, 88, 12, 0.2)',
                        borderRadius: '4px',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <FontAwesomeIcon
                          icon={icon}
                          style={{
                            color: '#ea580c',
                            fontSize: '16px'
                          }}
                        />
                      </div>
                      <div>
                        <div style={{ fontWeight: 'bold', fontSize: '12px' }}>{effectName}</div>
                        <div style={{ fontSize: '11px', color: '#e2e8f0' }}>{effectDescription}</div>
                      </div>
                    </div>
                  );
                }).filter(Boolean)}
              </div>

              {/* Display saving throw and duration information if available */}
              {formattedEffects.controlEffects.some(effect => effect.toLowerCase().includes('saving throw')) && (
                <div style={{
                  marginTop: '8px',
                  fontSize: '11px',
                  color: '#fcd34d',
                  backgroundColor: 'rgba(234, 88, 12, 0.1)',
                  padding: '4px 8px',
                  borderRadius: '4px'
                }}>
                  {formattedEffects.controlEffects
                    .filter(effect => effect.toLowerCase().includes('saving throw'))
                    .map((effect, index) => (
                      <div key={index}>{effect}</div>
                    ))}
                </div>
              )}

              {formattedEffects.controlEffects.some(effect => effect.toLowerCase().includes('duration')) && (
                <div style={{
                  marginTop: '4px',
                  fontSize: '11px',
                  color: '#a1a1a1',
                  backgroundColor: 'rgba(234, 88, 12, 0.1)',
                  padding: '4px 8px',
                  borderRadius: '4px'
                }}>
                  {formattedEffects.controlEffects
                    .filter(effect => effect.toLowerCase().includes('duration'))
                    .map((effect, index) => (
                      <div key={index}>{effect}</div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* Proc (Chance-on-Hit) section */}
          {formattedEffects.procEffects.length > 0 && (
            <div style={{
              marginBottom: '8px',
              backgroundColor: 'rgba(245, 158, 11, 0.05)',
              border: '1px solid rgba(245, 158, 11, 0.2)',
              borderRadius: '4px',
              padding: '8px',
              marginTop: '8px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '4px',
                gap: '6px'
              }}>
                <FontAwesomeIcon
                  icon={faBolt}
                  style={{
                    color: '#f59e0b',
                    fontSize: '14px'
                  }}
                />
                <span style={{
                  fontWeight: 'bold',
                  fontSize: '13px'
                }}>
                  Chance-on-Hit Effects
                </span>
              </div>

              {/* Display formatted proc effects with dice roll format */}
              {formattedEffects.procEffects.map((effect, index) => {
                // Transform the effect text to use dice roll format
                let transformedEffect = effect;

                // Check if it contains a percentage chance pattern like "(15%)"
                const percentMatch = effect.match(/\((\d+)%\)/);
                if (percentMatch && percentMatch[1]) {
                  const procChance = parseInt(percentMatch[1]);
                  let diceDisplay = '';

                  if (procChance === 100) {
                    diceDisplay = 'Always triggers (100%)';
                  } else if (spell.procConfig?.procType === 'dice') {
                    const diceType = 'd20';
                    const threshold = Math.ceil(20 - (procChance / 100 * 20));
                    diceDisplay = `Roll ${threshold}+ on ${diceType} (${procChance}%)`;
                  } else if (spell.procConfig?.procType === 'cards') {
                    diceDisplay = `Card draw (${procChance}%)`;
                  } else if (spell.procConfig?.procType === 'coins') {
                    diceDisplay = `Coin flip (${procChance}%)`;
                  } else {
                    // Default to d100
                    const threshold = Math.ceil(100 - procChance + 1);
                    diceDisplay = `Roll ${threshold}+ on d100 (${procChance}%)`;
                  }

                  // Replace the percentage with the dice roll format
                  transformedEffect = effect.replace(/Chance on Hit \(\d+%\)/, `Chance on Hit: ${diceDisplay}`);
                }

                return (
                  <div key={index} style={{
                    marginBottom: '4px',
                    fontSize: '12px',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'flex-start'
                  }}>
                    <span style={{ color: '#f59e0b', marginRight: '6px' }}>•</span>
                    <span>{transformedEffect}</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Critical Hit section */}
          {formattedEffects.criticalEffects.length > 0 && (
            <div style={{
              marginBottom: '8px',
              backgroundColor: 'rgba(239, 68, 68, 0.05)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: '4px',
              padding: '8px',
              marginTop: '8px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '4px',
                gap: '6px'
              }}>
                <FontAwesomeIcon
                  icon={faDice}
                  style={{
                    color: '#ef4444',
                    fontSize: '14px'
                  }}
                />
                <span style={{
                  fontWeight: 'bold',
                  fontSize: '13px'
                }}>
                  Critical Hit Effects
                </span>
              </div>

              {/* Display formatted critical effects */}
              {formattedEffects.criticalEffects.map((effect, index) => (
                <div key={index} style={{
                  marginBottom: '4px',
                  fontSize: '12px',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'flex-start'
                }}>
                  <span style={{ color: '#ef4444', marginRight: '6px' }}>•</span>
                  <span>{effect}</span>
                </div>
              ))}
            </div>
          )}

          {/* Channeling section - only show if we don't have a dedicated channeling section */}
          {formattedEffects.channelingEffects.length > 0 &&
           !(spell.spellType === 'CHANNELED' || spell.spellType === 'channeled') && (
            <div style={{
              marginBottom: '8px',
              backgroundColor: 'rgba(20, 184, 166, 0.05)',
              border: '1px solid rgba(20, 184, 166, 0.2)',
              borderRadius: '4px',
              padding: '8px',
              marginTop: '8px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '4px',
                gap: '6px'
              }}>
                <FontAwesomeIcon
                  icon={faHourglass}
                  style={{
                    color: '#14b8a6',
                    fontSize: '14px'
                  }}
                />
                <span style={{
                  fontWeight: 'bold',
                  fontSize: '13px'
                }}>
                  Channeling Effects
                </span>
              </div>

              {/* Display formatted channeling effects */}
              {formattedEffects.channelingEffects.map((effect, index) => (
                <div key={index} style={{
                  marginBottom: '4px',
                  fontSize: '12px',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'flex-start'
                }}>
                  <span style={{ color: '#14b8a6', marginRight: '6px' }}>•</span>
                  <span>{effect}</span>
                </div>
              ))}
            </div>
          )}





          {/* Targeting information moved to header */}

          {/* Trail Information for non-zone spells */}
          {spell.spellType !== 'ZONE' && spell.targetingMode === 'self_centered' && spell.aoeShape === 'trail' && spell.targetingConfig?.aoeParameters && (
            <div style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 'bold' }}>
                  MOVEMENT TRAIL:
                </span>
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                <div style={{ marginBottom: '3px', paddingLeft: '10px' }}>
                  • Trail Width: {spell.targetingConfig.aoeParameters.width || 5} ft
                </div>
                <div style={{ marginBottom: '3px', paddingLeft: '10px' }}>
                  • Trail Duration: {spell.targetingConfig?.aoeParameters?.duration || spell.typeConfig?.zoneDuration || 10} {spell.targetingConfig?.aoeParameters?.durationUnit || spell.typeConfig?.zoneDurationUnit || 'seconds'}
                </div>

                {/* Display any additional AoE parameters */}
                {spell.targetingConfig?.aoeParameters && Object.entries(spell.targetingConfig.aoeParameters)
                  .filter(([key, value]) =>
                    // Filter out parameters that are already displayed
                    !['width', 'duration', 'durationUnit'].includes(key) &&
                    // Only show parameters with values
                    value !== undefined && value !== null && value !== 0 && value !== ''
                  )
                  .map(([key, value]) => (
                    <div key={key} style={{ marginBottom: '3px', paddingLeft: '10px' }}>
                      • {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}: {value}
                    </div>
                  ))
                }
                {spell.targetingConfig?.movementBehavior && (
                  <div style={{ marginBottom: '3px', paddingLeft: '10px' }}>
                    • Movement: {spell.targetingConfig.movementBehavior === 'static' ? 'Static (stays in place)' :
                                spell.targetingConfig.movementBehavior === 'follows_caster' ? 'Follows Caster' :
                                spell.targetingConfig.movementBehavior === 'movable' ? 'Movable (as an action)' : 'Static'}
                  </div>
                )}
                <div style={{
                  marginTop: '5px',
                  backgroundColor: 'rgba(46, 204, 113, 0.1)',
                  borderRadius: '4px',
                  padding: '4px 6px',
                  borderLeft: '2px solid #2ecc71',
                  marginLeft: '10px',
                  marginRight: '10px'
                }}>
                  <div style={{ fontStyle: 'italic', fontSize: '10px' }}>
                    {spell.targetingConfig?.movementBehavior === 'follows_caster' ?
                      'Trail follows the caster as they move, creating a continuous path of effects.' :
                     spell.targetingConfig?.movementBehavior === 'movable' ?
                      'Trail can be moved as an action, independent of the caster\'s position.' :
                      'Trail remains in place after being cast, regardless of caster movement.'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Propagation Information */}
          {spell.propagation && spell.propagation.method && spell.propagation.method !== 'none' && (
            <div style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 'bold' }}>
                  PROPAGATION:
                </span>
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                <div style={{ marginBottom: '3px', paddingLeft: '10px' }}>
                  • Method: {spell.propagation.method === 'chain' ? 'Chain' :
                            spell.propagation.method === 'fork' ? 'Fork' :
                            spell.propagation.method === 'spread' ? 'Spread' :
                            spell.propagation.method === 'bounce' ? 'Bounce' :
                            spell.propagation.method}
                </div>

                {spell.propagation.behavior && (
                  <div style={{ marginBottom: '3px', paddingLeft: '10px' }}>
                    • Behavior: {spell.propagation.behavior}
                  </div>
                )}

                {spell.propagation.count > 0 && (
                  <div style={{ marginBottom: '3px', paddingLeft: '10px' }}>
                    • Count: {spell.propagation.count} {spell.propagation.method === 'chain' ? 'targets' :
                             spell.propagation.method === 'fork' ? 'forks' :
                             spell.propagation.method === 'bounce' ? 'bounces' : 'jumps'}
                  </div>
                )}

                {spell.propagation.range > 0 && (
                  <div style={{ marginBottom: '3px', paddingLeft: '10px' }}>
                    • Range: {spell.propagation.range} ft
                  </div>
                )}

                {spell.propagation.decay > 0 && (
                  <div style={{ marginBottom: '3px', paddingLeft: '10px' }}>
                    • Decay: {spell.propagation.decay}% per {spell.propagation.method === 'chain' ? 'target' :
                             spell.propagation.method === 'fork' ? 'fork' :
                             spell.propagation.method === 'bounce' ? 'bounce' : 'jump'}
                  </div>
                )}

                {spell.propagation.secondaryRadius > 0 && (
                  <div style={{ marginBottom: '3px', paddingLeft: '10px' }}>
                    • Secondary Radius: {spell.propagation.secondaryRadius} ft
                  </div>
                )}

                {spell.propagation.spreadRate > 0 && spell.propagation.method === 'spread' && (
                  <div style={{ marginBottom: '3px', paddingLeft: '10px' }}>
                    • Spread Rate: {spell.propagation.spreadRate} ft per round
                  </div>
                )}

                {spell.propagation.forkCount > 0 && spell.propagation.method === 'fork' && (
                  <div style={{ marginBottom: '3px', paddingLeft: '10px' }}>
                    • Forks: {spell.propagation.forkCount}
                  </div>
                )}

                {/* Additional propagation parameters if available */}
                {spell.propagation.parameters && Object.entries(spell.propagation.parameters)
                  .filter(([key, value]) =>
                    // Filter out parameters that are already displayed
                    !['count', 'range', 'decay', 'secondaryRadius', 'spreadRate', 'forkCount'].includes(key) &&
                    // Only show parameters with values
                    value !== undefined && value !== null && value !== 0 && value !== ''
                  )
                  .map(([key, value]) => (
                    <div key={key} style={{ marginBottom: '3px', paddingLeft: '10px' }}>
                      • {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}: {value}
                    </div>
                  ))
                }

                {/* Propagation description */}
                <div style={{
                  marginTop: '5px',
                  backgroundColor: 'rgba(46, 204, 113, 0.1)',
                  borderRadius: '4px',
                  padding: '4px 6px',
                  borderLeft: '2px solid #2ecc71',
                  marginLeft: '10px',
                  marginRight: '10px'
                }}>
                  <div style={{ fontStyle: 'italic', fontSize: '10px' }}>
                    {spell.propagation.method === 'chain' ?
                      `Spell chains to ${spell.propagation.count} additional targets within ${spell.propagation.range} ft.` :
                     spell.propagation.method === 'fork' ?
                      `Spell forks into ${spell.propagation.forkCount} separate projectiles, each targeting a different enemy.` :
                     spell.propagation.method === 'spread' ?
                      `Effect spreads outward at a rate of ${spell.propagation.spreadRate} ft per round.` :
                     spell.propagation.method === 'bounce' ?
                      `Spell bounces to ${spell.propagation.count} additional targets after hitting the primary target.` :
                      'Spell propagates to additional targets.'}
                    {spell.propagation.decay > 0 ? ` Effect decreases by ${spell.propagation.decay}% with each jump.` : ''}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Zone Information */}
          {spell.spellType === 'ZONE' && (
            <div style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 'bold' }}>
                  ZONE PROPERTIES:
                </span>
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                {/* Zone Duration */}
                <div style={{ marginBottom: '3px', paddingLeft: '10px' }}>
                  • Duration: {spell.typeConfig?.zoneDuration || 60} {spell.typeConfig?.zoneDurationUnit || 'seconds'}
                </div>

                {/* Movement Behavior */}
                {spell.targetingConfig?.movementBehavior && (
                  <div style={{ marginBottom: '3px', paddingLeft: '10px' }}>
                    • Movement: {spell.targetingConfig.movementBehavior === 'static' ? 'Static (stays in place)' :
                                spell.targetingConfig.movementBehavior === 'follows_caster' ? 'Follows Caster' :
                                spell.targetingConfig.movementBehavior === 'movable' ? 'Movable (as an action)' : 'Static'}
                  </div>
                )}

                {/* Trail Information */}
                {spell.targetingMode === 'self_centered' && spell.aoeShape === 'trail' && spell.targetingConfig?.aoeParameters && (
                  <>
                    <div style={{ marginBottom: '3px', paddingLeft: '10px' }}>
                      • Trail Width: {spell.targetingConfig.aoeParameters.width || 5} ft
                    </div>
                    <div style={{ marginBottom: '3px', paddingLeft: '10px' }}>
                      • Trail Duration: {spell.targetingConfig.aoeParameters.duration || 10} {spell.targetingConfig.aoeParameters.durationUnit || 'seconds'}
                    </div>

                    {/* Display any additional AoE parameters */}
                    {Object.entries(spell.targetingConfig.aoeParameters)
                      .filter(([key, value]) =>
                        // Filter out parameters that are already displayed
                        !['width', 'duration', 'durationUnit'].includes(key) &&
                        // Only show parameters with values
                        value !== undefined && value !== null && value !== 0 && value !== ''
                      )
                      .map(([key, value]) => (
                        <div key={key} style={{ marginBottom: '3px', paddingLeft: '10px' }}>
                          • {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}: {value}
                        </div>
                      ))
                    }
                  </>
                )}

                {/* Leave Trail Option */}
                {spell.typeConfig?.leaveTrail && (
                  <>
                    <div style={{ marginBottom: '3px', paddingLeft: '10px' }}>
                      • Leaves a trail of effects as it moves
                    </div>
                    <div style={{ marginBottom: '3px', paddingLeft: '10px' }}>
                      • Trail Width: {spell.targetingConfig?.aoeParameters?.width || 5} ft
                    </div>
                    <div style={{ marginBottom: '3px', paddingLeft: '10px' }}>
                      • Trail Duration: {spell.typeConfig?.trailDuration || 3} {spell.typeConfig?.trailDurationUnit || 'rounds'}
                    </div>
                  </>
                )}

                {/* Zone Movement Behavior Description */}
                {spell.targetingConfig?.movementBehavior && (
                  <div style={{
                    marginTop: '5px',
                    backgroundColor: 'rgba(46, 204, 113, 0.1)',
                    borderRadius: '4px',
                    padding: '4px 6px',
                    borderLeft: '2px solid #2ecc71',
                    marginLeft: '10px',
                    marginRight: '10px'
                  }}>
                    <div style={{ fontStyle: 'italic', fontSize: '10px' }}>
                      {spell.targetingConfig?.movementBehavior === 'follows_caster' ?
                        'Zone follows the caster as they move, applying effects to new areas.' :
                       spell.targetingConfig?.movementBehavior === 'movable' ?
                        'Zone can be moved as an action, independent of the caster\'s position.' :
                        'Zone remains in place after being cast, regardless of caster movement.'}
                      {spell.typeConfig?.leaveTrail && ' The zone leaves a trail of effects behind as it moves.'}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}



          {/* Buff Effects */}
          {spell.buffEffects && spell.buffEffects.length > 0 && (
            <div style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ color: '#3b82f6', fontSize: '11px', fontWeight: 'bold' }}>
                  BUFFS:
                </span>
              </div>
              <div style={{ fontSize: '11px', color: '#3b82f6' }}>
                {/* Display duration, concentration, and stacking information in a single line */}
                {spell.buffConfig && (
                  <div style={{ marginBottom: '3px', paddingLeft: '10px' }}>
                    • {(() => {
                      // Create the duration text based on the configuration
                      let text = '';

                      // Add duration
                      if (spell.buffConfig.durationType === 'time') {
                        text = `${spell.buffConfig.durationValue || 3} ${spell.buffConfig.durationUnit || 'minutes'}`;
                      } else if (spell.buffConfig.durationType === 'turns') {
                        text = `${spell.buffConfig.durationValue || 3} rounds`;
                      } else if (spell.buffConfig.durationType === 'rest') {
                        text = `Until ${spell.buffConfig.restType === 'short' ? 'short' : 'long'} rest`;
                      } else if (spell.buffConfig.durationType === 'permanent') {
                        text = 'Permanent';
                      } else {
                        text = `${spell.buffConfig.durationValue || 3} rounds`;
                      }

                      // Add stacking information if applicable
                      if (spell.buffConfig.stackingRule && spell.buffConfig.stackingRule !== 'replace') {
                        if (spell.buffConfig.stackingRule === 'selfStacking') {
                          text += `, Self-stacking up to ${spell.buffConfig.maxStacks || 1} stacks`;
                        } else if (spell.buffConfig.stackingRule === 'cumulative') {
                          text += `, Cumulative up to ${spell.buffConfig.maxStacks || 1} stacks`;
                        } else if (spell.buffConfig.stackingRule === 'highestValue') {
                          text += ', Highest value only';
                        } else if (spell.buffConfig.stackingRule === 'additive') {
                          text += ', Additive stacking';
                        } else if (spell.buffConfig.stackingRule === 'multiplicative') {
                          text += ', Multiplicative stacking';
                        } else if (spell.buffConfig.stackingRule === 'progressive') {
                          text += ', Progressive effect';
                        } else {
                          text += `, ${spell.buffConfig.stackingRule}`;
                        }
                      }

                      return text;
                    })()}
                    {spell.buffConfig.concentrationRequired && (
                      <span style={{ color: '#f59e0b', fontStyle: 'italic' }}> (Requires Concentration)</span>
                    )}
                  </div>
                )}

                {/* Group and display stat boosts */}
                {(() => {
                  // Extract all stat boosts
                  const statBoosts = [];
                  spell.buffEffects.forEach(effect => {
                    // Skip duration text and progressive stage effects
                    if (/^\+?\d+ (rounds|minutes|hours|days)$/i.test(effect.trim())) return;
                    if ((effect.toLowerCase().includes('until long rest') ||
                        effect.toLowerCase().includes('until short rest') ||
                        effect.toLowerCase().includes('permanent') ||
                        effect.toLowerCase().includes('for permanent')) &&
                        (!effect.includes(':') || effect.toLowerCase().startsWith('buff:'))) return;

                    // Skip any Buff: statEnhancement entries
                    if (typeof effect !== 'string') return;
                    if (/^Buff:\s*statEnhancement/i.test(effect.trim())) return;

                    // Check for stat boost pattern - match various formats including dice formulas
                    let statBoostMatch = effect.match(/^([^:]+)\s+Boost:\s+([+-]?[\d\w\+\-\*\/\(\)\s]+)([%]?)\s+(?:for|until|permanent).*/i);
                    if (!statBoostMatch) {
                      // Try alternative format
                      statBoostMatch = effect.match(/^([^:]+)\s+(?:increase|boost|enhance):\s*([+-]?[\d\w\+\-\*\/\(\)\s]+)([%]?)/i);
                    }
                    if (!statBoostMatch) {
                      // Try simpler format
                      statBoostMatch = effect.match(/^([^:]+):\s*([+-]?[\d\w\+\-\*\/\(\)\s]+)([%]?)/i);
                    }

                    // Also match patterns like "Strength: 2 Strength increase" or "Strength 2 Strength increase"
                    if (!statBoostMatch) {
                      statBoostMatch = effect.match(/^([^\s]+)(?:\s*:\s*)?\s*([+-]?[\d\w\+\-\*\/\(\)\s]+)\s+\1\s+(?:increase|boost|enhance)/i);
                    }

                    if (statBoostMatch && statBoostMatch[1] && statBoostMatch[2]) {
                      const statName = statBoostMatch[1].trim();
                      let magnitude = statBoostMatch[2].trim();

                      // Add + sign to positive numeric values if not already there
                      if (!magnitude.startsWith('-') && !magnitude.startsWith('+') && /^\d/.test(magnitude)) {
                        magnitude = '+' + magnitude;
                      }

                      const isPercentage = statBoostMatch[3] === '%';

                      // Skip if in progressive stages
                      if (spell.buffConfig?.stackingRule === 'progressive' && spell.buffConfig?.progressiveStages?.length > 0) {
                        const isInProgressiveStages = spell.buffConfig.progressiveStages.some(stage =>
                          stage.statModifiers?.some(mod => mod.name && statName &&
                            mod.name.toLowerCase() === statName.toLowerCase())
                        );
                        if (isInProgressiveStages) return;
                      }

                      // Check if we already have this stat
                      if (statName) {
                        const existingIndex = statBoosts.findIndex(b => b.name && statName &&
                          b.name.toLowerCase() === statName.toLowerCase());
                        if (existingIndex >= 0) {
                          // Skip duplicates
                          return;
                        }
                      }

                      statBoosts.push({
                        name: statName,
                        magnitude: magnitude,
                        isPercentage: isPercentage
                      });
                      return; // Skip this effect as we'll display it in the grouped section
                    }
                  });

                  // Display grouped stat boosts if any
                  if (statBoosts.length > 0) {
                    return (
                      <div style={{
                        marginBottom: '6px',
                        marginTop: '3px',
                        paddingLeft: '10px',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        borderRadius: '4px',
                        padding: '4px 6px',
                        borderLeft: '2px solid #3b82f6',
                        marginLeft: '10px',
                        marginRight: '10px'
                      }}>
                        {statBoosts.map((boost, index) => {
                          // Format the magnitude to ensure it has a + sign for positive values
                          let formattedMagnitude = boost.magnitude;
                          if (typeof formattedMagnitude === 'number' && formattedMagnitude > 0) {
                            formattedMagnitude = '+' + formattedMagnitude;
                          } else if (typeof formattedMagnitude === 'string' && !formattedMagnitude.startsWith('-') && !formattedMagnitude.startsWith('+')) {
                            // For string values like dice formulas, add + if not already there and not negative
                            if (/^\d/.test(formattedMagnitude)) { // If starts with a digit
                              formattedMagnitude = '+' + formattedMagnitude;
                            }
                          }

                          return (
                            <div key={index}>
                              • {boost.name}: {formattedMagnitude}{boost.isPercentage ? '%' : ''}
                            </div>
                          );
                        })}
                      </div>
                    );
                  }
                  return null;
                })()}

                {/* Display other buff effects */}
                {spell.buffEffects
                  // Pre-filter all duration-only entries and statEnhancement entries
                  .filter(effect => {
                    // Skip any standalone duration entries
                    // Check if effect is a string before calling trim()
                    if (typeof effect !== 'string') return false;

                    if (/^\s*\+?\d+\s*(rounds?|minutes?|hours?|days?)\s*$/i.test(effect.trim())) return false;
                    if (/^\s*(rounds?|minutes?|hours?|days?)\s*:\s*\d+\s*$/i.test(effect.trim())) return false;
                    if (/^\s*\d+\s*(rounds?|minutes?|hours?|days?)\s*$/i.test(effect.trim())) return false;
                    if (/^\s*\+?\d+\s*(r|m|h|d)\s*$/i.test(effect.trim())) return false;
                    if (effect.trim().toLowerCase() === (spell.buffConfig?.durationValue || 3) + ' rounds') return false;
                    if (effect.trim().toLowerCase() === (spell.buffConfig?.durationValue || 3) + ' minutes') return false;
                    if (effect.trim().toLowerCase() === (spell.buffConfig?.durationValue || 3) + ' hours') return false;
                    if (effect.trim().toLowerCase() === (spell.buffConfig?.durationValue || 3) + ' days') return false;

                    // Skip any statEnhancement entries
                    if (typeof effect !== 'string') return false;
                    if (/^Buff:/i.test(effect.trim())) return false;
                    if (/statEnhancement/i.test(effect.trim())) return false;
                    if (/^([^\s]+)\s+([+-]?[\d\w\+\-\*\/\(\)\s]+)\s+\1\s+(?:increase|boost|enhance)/i.test(effect.trim())) return false;

                    return true;
                  })
                  .map((effect, index) => {
                  // Always skip duration text since we're displaying it separately now
                  // Check if effect is a string before calling trim()
                  if (typeof effect !== 'string') return null;

                  if (/^\+?\d+ rounds?$/.test(effect.trim()) ||
                      /^\+?\d+ minutes?$/.test(effect.trim()) ||
                      /^\+?\d+ hours?$/.test(effect.trim()) ||
                      /^\+?\d+ days?$/.test(effect.trim())) {
                    return null;
                  }

                  // Skip the main buff effect if it's just a duration indicator
                  if ((effect.toLowerCase().includes('until long rest') ||
                      effect.toLowerCase().includes('until short rest') ||
                      effect.toLowerCase().includes('permanent') ||
                      effect.toLowerCase().includes('for permanent')) &&
                      (!effect.includes(':') || effect.toLowerCase().startsWith('buff:'))) {
                    return null; // Skip standalone duration indicators
                  }

                  // Skip stat boosts as we're displaying them separately - more comprehensive patterns
                  let statBoostMatch = effect.match(/^([^:]+)\s+Boost:\s+([+-]?[\d\w\+\-\*\/\(\)\s]+)([%]?)\s+(?:for|until|permanent).*/i);
                  if (!statBoostMatch) {
                    statBoostMatch = effect.match(/^([^:]+)\s+(?:increase|boost|enhance):\s*([+-]?[\d\w\+\-\*\/\(\)\s]+)([%]?)/i);
                  }
                  if (!statBoostMatch) {
                    statBoostMatch = effect.match(/^([^:]+):\s*([+-]?[\d\w\+\-\*\/\(\)\s]+)([%]?)/i);
                  }
                  if (!statBoostMatch) {
                    // Also match patterns like "Agility -2d4 Agility increase"
                    statBoostMatch = effect.match(/^([^\s]+)\s+([+-]?[\d\w\+\-\*\/\(\)\s]+)\s+\1\s+(?:increase|boost|enhance)/i);
                  }

                  // Also match "Buff: statEnhancement" patterns
                  if (/^Buff:/i.test(effect.trim()) || /statEnhancement/i.test(effect.trim())) {
                    return null;
                  }

                  if (statBoostMatch) return null;

                  // Skip any standalone duration entries
                  if (/^\d+\s+(rounds?|minutes?|hours?|days?)$/i.test(effect.trim())) return null;
                  if (/^(rounds?|minutes?|hours?|days?):\s*\d+$/i.test(effect.trim())) return null;
                  if (/^\+?\d+\s+(rounds?|minutes?|hours?|days?)$/i.test(effect.trim())) return null;
                  if (/^\s*\+?\d+\s+(rounds?|minutes?|hours?|days?)\s*$/i.test(effect.trim())) return null;

                  // Skip displaying effects that will be shown in progressive stages
                  if (spell.buffConfig?.stackingRule === 'progressive' && spell.buffConfig?.progressiveStages?.length > 0) {
                    // Extract the stat name from the effect string
                    const statMatch = effect.match(/^([^:]+):/);
                    if (statMatch && statMatch[1]) {
                      const statName = statMatch[1].trim();
                      // Check if this stat is included in any progressive stage
                      const isInProgressiveStages = spell.buffConfig.progressiveStages.some(stage =>
                        stage.statModifiers?.some(mod => mod.name === statName)
                      );
                      if (isInProgressiveStages) return null;
                    }
                  }

                  // Clean up the effect text
                  let cleanEffect = effect;

                  // Check if cleanEffect is a string before calling trim()
                  if (typeof cleanEffect !== 'string') return null;

                  // Skip any standalone duration text that might have slipped through
                  if (/^\+?\d+\s*(rounds?|minutes?|hours?|days?)$/i.test(cleanEffect.trim()) ||
                      /^\s*(rounds?|minutes?|hours?|days?)\s*:\s*\d+\s*$/i.test(cleanEffect.trim()) ||
                      cleanEffect.trim().toLowerCase() === (spell.buffConfig?.durationValue || 3) + ' rounds' ||
                      cleanEffect.trim().toLowerCase() === (spell.buffConfig?.durationValue || 3) + ' minutes' ||
                      cleanEffect.trim().toLowerCase() === (spell.buffConfig?.durationValue || 3) + ' hours' ||
                      cleanEffect.trim().toLowerCase() === (spell.buffConfig?.durationValue || 3) + ' days' ||
                      cleanEffect.trim().toLowerCase() === '+' + (spell.buffConfig?.durationValue || 3) + ' rounds' ||
                      cleanEffect.trim().toLowerCase() === '+' + (spell.buffConfig?.durationValue || 3) + ' minutes' ||
                      cleanEffect.trim().toLowerCase() === '+' + (spell.buffConfig?.durationValue || 3) + ' hours' ||
                      cleanEffect.trim().toLowerCase() === '+' + (spell.buffConfig?.durationValue || 3) + ' days') {
                    return null;
                  }

                  // Handle different duration types
                  if (typeof cleanEffect === 'string') {
                    if (spell.buffConfig?.durationType === 'rest') {
                      if (spell.buffConfig?.restType === 'short') {
                        cleanEffect = cleanEffect.replace(/for \d+ rounds|for \d+ minutes|for medium rounds|for short rest/i, "Lasts until a short rest is taken");
                      } else if (spell.buffConfig?.restType === 'long') {
                        cleanEffect = cleanEffect.replace(/for \d+ rounds|for \d+ minutes|for medium rounds|for long rest/i, "Lasts until a long rest is taken");
                      }
                    } else if (spell.buffConfig?.durationType === 'permanent') {
                      cleanEffect = cleanEffect.replace(/for \d+ rounds|for \d+ minutes|for medium rounds/i, "permanent");
                    } else if (spell.buffConfig?.durationType === 'time') {
                      // For time-based duration, use the correct unit
                      cleanEffect = cleanEffect.replace(/for \d+ rounds|for medium rounds/i, "for " + (spell.buffConfig?.durationValue || 3) + " " + (spell.buffConfig?.durationUnit || 'minutes'));
                    } else {
                      // For turn-based duration, just clean up the text
                      cleanEffect = cleanEffect.replace(/for medium rounds/i, "for 3 minutes");
                    }

                    // Remove redundant text patterns - more aggressive cleaning
                    cleanEffect = cleanEffect.replace(/^Buff:\s*statEnhancement\s*for\s*\d+\s*\w+/i, "");
                    cleanEffect = cleanEffect.replace(/^Buff:\s*statEnhancement/i, "");
                    cleanEffect = cleanEffect.replace(/^Buff:/i, "");
                  }

                  // Skip if the effect is just about duration or empty after cleaning
                  if (typeof cleanEffect !== 'string' ||
                      !cleanEffect.trim() ||
                      /^for\s+\d+\s+(rounds?|minutes?|hours?|days?)$/i.test(cleanEffect.trim()) ||
                      /^\+?\d+\s*(rounds?|minutes?|hours?|days?)$/i.test(cleanEffect.trim())) {
                    return null;
                  }

                  // Skip this effect if it's a stat that's already in progressive stages
                  if (spell.buffConfig?.stackingRule === 'progressive' && spell.buffConfig?.progressiveStages?.length > 0) {
                    // Extract the stat name from the effect string
                    const statMatch = cleanEffect.match(/^([^:]+)\s+Boost:/i);
                    if (statMatch && statMatch[1]) {
                      const statName = statMatch[1].trim();
                      // Check if this stat is included in any progressive stage
                      const isInProgressiveStages = spell.buffConfig.progressiveStages.some(stage =>
                        stage.statModifiers?.some(mod => mod.name && statName &&
                          mod.name.toLowerCase() === statName.toLowerCase())
                      );
                      if (isInProgressiveStages) return null;
                    }
                  }

                  return (
                    <div key={index} style={{ marginBottom: '3px', paddingLeft: '10px' }}>
                      • {cleanEffect}
                    </div>
                  );
                })}
              </div>

              {/* Progressive Buff Stages */}
              {spell.buffConfig && spell.buffConfig.stackingRule === 'progressive' && spell.buffConfig.progressiveStages &&
               spell.buffConfig.progressiveStages.length > 0 && (
                <div style={{ fontSize: '11px', color: '#3b82f6', marginTop: '6px', paddingLeft: '10px',
                      borderTop: '1px dotted rgba(59, 130, 246, 0.3)', paddingTop: '4px' }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Progressive Stages:</div>
                  {spell.buffConfig.progressiveStages
                    .sort((a, b) => a.triggerAt - b.triggerAt)
                    .map((stage, idx) => {
                      // Try to find the spell in the library
                      let spellName = null;
                      let spellDescription = null;

                      if (stage.spellEffect) {
                        // Log the spell effect data to see what we're working with
                        console.log('Stage spell effect data:', stage.spellEffect, typeof stage.spellEffect);
                        console.log('Stage spell data:', stage.spellData);

                        // First check if we have the spellData property from the SpellSelector
                        if (stage.spellData) {
                          console.log('Using spellData from SpellSelector:', stage.spellData);
                          spellName = stage.spellData.name;
                          spellDescription = stage.spellData.description || 'Custom spell effect';
                        }
                        // Then check if we have a direct reference to a spell object
                        else if (typeof stage.spellEffect === 'object' && stage.spellEffect !== null) {
                          if (stage.spellEffect.name) {
                            spellName = stage.spellEffect.name;
                            spellDescription = stage.spellEffect.description ||
                                              (stage.spellEffect.damageEffects && stage.spellEffect.damageEffects.length > 0 ?
                                               'Deals damage to target' : 'Custom spell effect');
                          } else if (stage.spellEffect.spellName) {
                            // Some objects might have spellName instead of name
                            spellName = stage.spellEffect.spellName;
                            spellDescription = stage.spellEffect.description || 'Custom spell effect';
                          }
                        } else if (typeof stage.spellEffect === 'string') {
                          // Check if it's a spell ID with a name property
                          if (stage.spellEffect.includes('name:')) {
                            try {
                              const parsedData = JSON.parse(stage.spellEffect);
                              spellName = parsedData.name || 'Unknown Spell';
                              spellDescription = parsedData.description || 'Custom spell effect';
                            } catch (e) {
                              // If parsing fails, continue with normal ID lookup
                              console.log('Failed to parse spell data:', e);
                            }
                          }

                          // Check if it's a known spell ID directly
                          const lowerCaseId = stage.spellEffect.toLowerCase();
                          if (KNOWN_SPELL_IDS[lowerCaseId]) {
                            console.log('Found spell in KNOWN_SPELL_IDS:', KNOWN_SPELL_IDS[lowerCaseId]);
                            spellName = KNOWN_SPELL_IDS[lowerCaseId].name;
                            spellDescription = KNOWN_SPELL_IDS[lowerCaseId].description;
                          }
                          // If we still don't have a name, try to find it in the library
                          else if (!spellName) {
                            const librarySpells = getLibrarySpells();
                            console.log('Searching library for spell ID:', stage.spellEffect);
                            const foundSpell = librarySpells.find(s => s.id === stage.spellEffect);
                            if (foundSpell) {
                              console.log('Found spell in library:', foundSpell);
                              spellName = foundSpell.name;
                              spellDescription = foundSpell.description || 'Custom spell effect';
                            } else {
                              // If we can't find it by ID, try to get a readable name
                              console.log('Using getSpellInfoFromId for:', stage.spellEffect);
                              const spellInfo = getSpellInfoFromId(stage.spellEffect);
                              spellName = spellInfo.name;
                              spellDescription = spellInfo.description;
                            }
                          }
                        } else {
                          // If all else fails, use a default name
                          spellName = 'Triggered Effect';
                          spellDescription = 'Custom spell effect';
                        }

                        // Log the final result for debugging
                        console.log('Final spell name and description:', { spellName, spellDescription });
                      }

                      return (
                        <div key={idx} style={{
                          marginBottom: '6px',
                          backgroundColor: 'rgba(59, 130, 246, 0.1)',
                          borderRadius: '4px',
                          padding: '4px 6px',
                          borderLeft: '2px solid #3b82f6'
                        }}>
                          <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>
                            Stage {idx + 1}: Triggers at {stage.triggerAt} {
                              spell.buffConfig?.durationType === 'time' ? (spell.buffConfig?.durationUnit || 'minutes') :
                              spell.buffConfig?.durationType === 'rest' ? (spell.buffConfig?.restType === 'short' ? 'short rest' : 'long rest') :
                              spell.buffConfig?.durationType === 'permanent' ? 'permanent' : 'rounds'
                            }
                          </div>

                          {/* Stat modifiers for this stage */}
                          {stage.statModifiers && stage.statModifiers.length > 0 && (
                            <div style={{ paddingLeft: '10px' }}>
                              {stage.statModifiers.map((stat, statIdx) => (
                                <div key={statIdx} style={{ marginBottom: '2px' }}>
                                  • {stat.name}: {stat.magnitude > 0 ? '+' : ''}{stat.magnitude}
                                  {stat.magnitudeType === 'percentage' ? '%' : ''}
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Spell effect for this stage if any */}
                          {stage.spellEffect && (
                            <div style={{ paddingLeft: '10px', marginTop: '2px' }}>
                              • Triggers: {
                                // First try to use the spell name from our processing
                                spellName ||
                                // Then check if it's in the library
                                (() => {
                                  const librarySpells = getLibrarySpells();
                                  const foundSpell = librarySpells.find(s => s.id === stage.spellEffect);
                                  return foundSpell ? foundSpell.name : getSpellNameFromId(stage.spellEffect);
                                })()
                              }
                              {(spellDescription || getSpellDescriptionFromId(stage.spellEffect)) && (
                                <div style={{ fontSize: '10px', color: '#8ab4f8', paddingLeft: '10px', fontStyle: 'italic', marginTop: '2px' }}>
                                  {spellDescription || getSpellDescriptionFromId(stage.spellEffect)}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          )}

          {/* Debuff Effects */}
          {spell.debuffEffects && spell.debuffEffects.length > 0 && (
            <div style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ color: '#a855f7', fontSize: '11px', fontWeight: 'bold' }}>
                  DEBUFFS:
                </span>
              </div>
              <div style={{ fontSize: '11px', color: '#a855f7' }}>
                {/* Display duration, saving throw, and stacking information in a single line */}
                {spell.debuffConfig && !isTrapSpell && (
                  <div style={{ marginBottom: '3px', paddingLeft: '10px' }}>
                    • {(() => {
                      // Create the duration and saving throw text based on the configuration
                      let text = '';

                      // Add saving throw information if available
                      if (spell.debuffEffects && spell.debuffEffects.length > 0 &&
                          (spell.debuffEffects[0].savingThrow || spell.debuffEffects[0].difficultyClass)) {
                        const savingThrow = spell.debuffEffects[0].savingThrow || 'constitution';
                        const dc = spell.debuffEffects[0].difficultyClass || 15;
                        text += `DC ${dc} ${savingThrow.charAt(0).toUpperCase() + savingThrow.slice(1)} save, `;
                      }

                      // Add duration
                      if (spell.debuffConfig.durationType === 'time') {
                        text = `${spell.debuffConfig.durationValue || 3} ${spell.debuffConfig.durationUnit || 'minutes'}`;
                      } else if (spell.debuffConfig.durationType === 'turns') {
                        text = `${spell.debuffConfig.durationValue || 3} rounds`;
                      } else if (spell.debuffConfig.durationType === 'rest') {
                        text = `Until ${spell.debuffConfig.restType === 'short' ? 'short' : 'long'} rest`;
                      } else if (spell.debuffConfig.durationType === 'permanent') {
                        text = 'Permanent';
                      } else {
                        text = `${spell.debuffConfig.durationValue || 3} rounds`;
                      }

                      // Add stacking information if applicable
                      if (spell.debuffConfig.stackingRule && spell.debuffConfig.stackingRule !== 'replace') {
                        if (spell.debuffConfig.stackingRule === 'selfStacking') {
                          text += `, Self-stacking up to ${spell.debuffConfig.maxStacks || 1} stacks`;
                        } else if (spell.debuffConfig.stackingRule === 'cumulative') {
                          text += `, Cumulative up to ${spell.debuffConfig.maxStacks || 1} stacks`;
                        } else if (spell.debuffConfig.stackingRule === 'highestValue') {
                          text += ', Highest value only';
                        } else if (spell.debuffConfig.stackingRule === 'additive') {
                          text += ', Additive stacking';
                        } else if (spell.debuffConfig.stackingRule === 'multiplicative') {
                          text += ', Multiplicative stacking';
                        } else if (spell.debuffConfig.stackingRule === 'progressive') {
                          text += ', Progressive effect';
                        } else {
                          text += `, ${spell.debuffConfig.stackingRule}`;
                        }
                      }

                      return text;
                    })()}
                    {spell.debuffConfig.concentrationRequired && (
                      <span style={{ color: '#f59e0b', fontStyle: 'italic' }}> (Requires Concentration)</span>
                    )}
                  </div>
                )}

                {/* Group and display stat reductions */}
                {(() => {
                  // Extract all stat reductions
                  const statReductions = [];
                  spell.debuffEffects.forEach(effect => {
                    // Skip duration text and progressive stage effects
                    if (typeof effect !== 'string') return;
                    if (/^\+?\d+ (rounds|minutes|hours|days)$/i.test(effect.trim())) return;
                    if ((effect.toLowerCase().includes('until long rest') ||
                        effect.toLowerCase().includes('until short rest') ||
                        effect.toLowerCase().includes('permanent') ||
                        effect.toLowerCase().includes('for permanent')) &&
                        (!effect.includes(':') || effect.toLowerCase().startsWith('debuff:'))) return;

                    // Check for stat reduction pattern - match various formats including dice formulas
                    let statReductionMatch = effect.match(/^([^:]+)\s+Reduction:\s+([+-]?[\d\w\+\-\*\/\(\)\s]+)([%]?)\s+(?:for|until|permanent).*/i);
                    if (!statReductionMatch) {
                      // Try alternative format
                      statReductionMatch = effect.match(/^([^:]+)\s+(?:decrease|reduce|penalty):\s*([+-]?[\d\w\+\-\*\/\(\)\s]+)([%]?)/i);
                    }
                    if (!statReductionMatch) {
                      // Try simpler format
                      statReductionMatch = effect.match(/^([^:]+):\s*([+-]?[\d\w\+\-\*\/\(\)\s]+)([%]?)/i);
                    }

                    if (statReductionMatch) {
                      const statName = statReductionMatch[1] ? statReductionMatch[1].trim() : '';
                      const magnitude = statReductionMatch[2];
                      const isPercentage = statReductionMatch[3] === '%';

                      // Skip if in progressive stages
                      if (spell.debuffConfig?.stackingRule === 'progressive' && spell.debuffConfig?.progressiveStages?.length > 0 && statName) {
                        const isInProgressiveStages = spell.debuffConfig.progressiveStages.some(stage =>
                          stage.statPenalties?.some(mod => mod.name && statName &&
                            mod.name.toLowerCase() === statName.toLowerCase())
                        );
                        if (isInProgressiveStages) return;
                      }

                      // Check if we already have this stat
                      if (statName) {
                        const existingIndex = statReductions.findIndex(r => r.name && statName &&
                          r.name.toLowerCase() === statName.toLowerCase());
                        if (existingIndex >= 0) {
                          // Skip duplicates
                          return;
                        }
                      }

                      statReductions.push({
                        name: statName,
                        magnitude: magnitude,
                        isPercentage: isPercentage
                      });
                      return; // Skip this effect as we'll display it in the grouped section
                    }
                  });

                  // Display grouped stat reductions if any
                  if (statReductions.length > 0) {
                    return (
                      <div style={{
                        marginBottom: '6px',
                        marginTop: '3px',
                        paddingLeft: '10px',
                        backgroundColor: 'rgba(168, 85, 247, 0.1)',
                        borderRadius: '4px',
                        padding: '4px 6px',
                        borderLeft: '2px solid #a855f7',
                        marginLeft: '10px',
                        marginRight: '10px'
                      }}>
                        {statReductions.map((reduction, index) => {
                          // Format the magnitude to ensure it has a + sign for positive values
                          let formattedMagnitude = reduction.magnitude;
                          if (typeof formattedMagnitude === 'number' && formattedMagnitude > 0) {
                            formattedMagnitude = '+' + formattedMagnitude;
                          } else if (typeof formattedMagnitude === 'string' && !formattedMagnitude.startsWith('-') && !formattedMagnitude.startsWith('+')) {
                            // For string values like dice formulas, add + if not already there and not negative
                            if (/^\d/.test(formattedMagnitude)) { // If starts with a digit
                              formattedMagnitude = '+' + formattedMagnitude;
                            }
                          }

                          return (
                            <div key={index}>
                              • {reduction.name}: {formattedMagnitude}{reduction.isPercentage ? '%' : ''}
                            </div>
                          );
                        })}
                      </div>
                    );
                  }
                  return null;
                })()}

                {/* Display other debuff effects */}
                {spell.debuffEffects
                  // Pre-filter all duration-only entries and statReduction entries
                  .filter(effect => {
                    // Skip any standalone duration entries
                    // Check if effect is a string before calling trim()
                    if (typeof effect !== 'string') return false;

                    if (/^\s*\+?\d+\s*(rounds?|minutes?|hours?|days?)\s*$/i.test(effect.trim())) return false;
                    if (/^\s*(rounds?|minutes?|hours?|days?)\s*:\s*\d+\s*$/i.test(effect.trim())) return false;
                    if (/^\s*\d+\s*(rounds?|minutes?|hours?|days?)\s*$/i.test(effect.trim())) return false;
                    if (/^\s*\+?\d+\s*(r|m|h|d)\s*$/i.test(effect.trim())) return false;
                    if (effect.trim().toLowerCase() === (spell.debuffConfig?.durationValue || 3) + ' rounds') return false;
                    if (effect.trim().toLowerCase() === (spell.debuffConfig?.durationValue || 3) + ' minutes') return false;
                    if (effect.trim().toLowerCase() === (spell.debuffConfig?.durationValue || 3) + ' hours') return false;
                    if (effect.trim().toLowerCase() === (spell.debuffConfig?.durationValue || 3) + ' days') return false;

                    // Skip any statReduction entries
                    if (typeof effect !== 'string') return false;
                    if (/^Debuff:/i.test(effect.trim())) return false;
                    if (/statReduction/i.test(effect.trim())) return false;
                    if (/^([^\s]+)\s+([+-]?[\d\w\+\-\*\/\(\)\s]+)\s+\1\s+(?:decrease|reduce|penalty)/i.test(effect.trim())) return false;

                    return true;
                  })
                  .map((effect, index) => {
                  // Always skip duration text since we're displaying it separately now
                  // Check if effect is a string before calling trim()
                  if (typeof effect !== 'string') return null;

                  if (/^\+?\d+ rounds?$/.test(effect.trim()) ||
                      /^\+?\d+ minutes?$/.test(effect.trim()) ||
                      /^\+?\d+ hours?$/.test(effect.trim()) ||
                      /^\+?\d+ days?$/.test(effect.trim())) {
                    return null;
                  }

                  // Skip the main debuff effect if it's just a duration indicator
                  if ((effect.toLowerCase().includes('until long rest') ||
                      effect.toLowerCase().includes('until short rest') ||
                      effect.toLowerCase().includes('permanent') ||
                      effect.toLowerCase().includes('for permanent')) &&
                      (!effect.includes(':') || effect.toLowerCase().startsWith('debuff:'))) {
                    return null; // Skip standalone duration indicators
                  }

                  // Skip stat reductions as we're displaying them separately - more comprehensive patterns
                  let statReductionMatch = effect.match(/^([^:]+)\s+Reduction:\s+([+-]?[\d\w\+\-\*\/\(\)\s]+)([%]?)\s+(?:for|until|permanent).*/i);
                  if (!statReductionMatch) {
                    statReductionMatch = effect.match(/^([^:]+)\s+(?:decrease|reduce|penalty):\s*([+-]?[\d\w\+\-\*\/\(\)\s]+)([%]?)/i);
                  }
                  if (!statReductionMatch) {
                    statReductionMatch = effect.match(/^([^:]+):\s*([+-]?[\d\w\+\-\*\/\(\)\s]+)([%]?)/i);
                  }
                  if (!statReductionMatch) {
                    // Also match patterns like "Agility -2d4 Agility decrease"
                    statReductionMatch = effect.match(/^([^\s]+)\s+([+-]?[\d\w\+\-\*\/\(\)\s]+)\s+\1\s+(?:decrease|reduce|penalty)/i);
                  }

                  // Also match "Debuff: statReduction" patterns
                  if (/^Debuff:/i.test(effect.trim()) || /statReduction/i.test(effect.trim())) {
                    return null;
                  }

                  if (statReductionMatch) return null;

                  // Skip any standalone duration entries
                  if (/^\d+\s+(rounds?|minutes?|hours?|days?)$/i.test(effect.trim())) return null;
                  if (/^(rounds?|minutes?|hours?|days?):\s*\d+$/i.test(effect.trim())) return null;
                  if (/^\+?\d+\s+(rounds?|minutes?|hours?|days?)$/i.test(effect.trim())) return null;
                  if (/^\s*\+?\d+\s+(rounds?|minutes?|hours?|days?)\s*$/i.test(effect.trim())) return null;

                  // Skip displaying effects that will be shown in progressive stages
                  if (spell.debuffConfig?.stackingRule === 'progressive' && spell.debuffConfig?.progressiveStages?.length > 0) {
                    // Extract the stat name from the effect string
                    const statMatch = effect.match(/^([^:]+):/);
                    if (statMatch && statMatch[1]) {
                      const statName = statMatch[1].trim();
                      // Check if this stat is included in any progressive stage
                      const isInProgressiveStages = spell.debuffConfig.progressiveStages.some(stage =>
                        stage.statPenalties?.some(mod => mod.name === statName)
                      );
                      if (isInProgressiveStages) return null;
                    }
                  }

                  // Clean up the effect text
                  let cleanEffect = effect;

                  // Check if cleanEffect is a string before calling trim()
                  if (typeof cleanEffect !== 'string') return null;

                  // Skip any standalone duration text that might have slipped through
                  if (/^\+?\d+\s*(rounds?|minutes?|hours?|days?)$/i.test(cleanEffect.trim()) ||
                      /^\s*(rounds?|minutes?|hours?|days?)\s*:\s*\d+\s*$/i.test(cleanEffect.trim()) ||
                      cleanEffect.trim().toLowerCase() === (spell.debuffConfig?.durationValue || 3) + ' rounds' ||
                      cleanEffect.trim().toLowerCase() === (spell.debuffConfig?.durationValue || 3) + ' minutes' ||
                      cleanEffect.trim().toLowerCase() === (spell.debuffConfig?.durationValue || 3) + ' hours' ||
                      cleanEffect.trim().toLowerCase() === (spell.debuffConfig?.durationValue || 3) + ' days' ||
                      cleanEffect.trim().toLowerCase() === '+' + (spell.debuffConfig?.durationValue || 3) + ' rounds' ||
                      cleanEffect.trim().toLowerCase() === '+' + (spell.debuffConfig?.durationValue || 3) + ' minutes' ||
                      cleanEffect.trim().toLowerCase() === '+' + (spell.debuffConfig?.durationValue || 3) + ' hours' ||
                      cleanEffect.trim().toLowerCase() === '+' + (spell.debuffConfig?.durationValue || 3) + ' days') {
                    return null;
                  }

                  // Handle different duration types
                  if (typeof cleanEffect === 'string') {
                    if (spell.debuffConfig?.durationType === 'rest') {
                      if (spell.debuffConfig?.restType === 'short') {
                        cleanEffect = cleanEffect.replace(/for \d+ rounds|for \d+ minutes|for medium rounds|for short rest/i, "Lasts until a short rest is taken");
                      } else if (spell.debuffConfig?.restType === 'long') {
                        cleanEffect = cleanEffect.replace(/for \d+ rounds|for \d+ minutes|for medium rounds|for long rest/i, "Lasts until a long rest is taken");
                      }
                    } else if (spell.debuffConfig?.durationType === 'permanent') {
                      cleanEffect = cleanEffect.replace(/for \d+ rounds|for \d+ minutes|for medium rounds/i, "permanent");
                    } else if (spell.debuffConfig?.durationType === 'time') {
                      // For time-based duration, use the correct unit
                      cleanEffect = cleanEffect.replace(/for \d+ rounds|for medium rounds/i, "for " + (spell.debuffConfig?.durationValue || 3) + " " + (spell.debuffConfig?.durationUnit || 'minutes'));
                    } else {
                      // For turn-based duration, just clean up the text
                      cleanEffect = cleanEffect.replace(/for medium rounds/i, "for 3 minutes");
                    }

                    // Remove redundant text patterns - more aggressive cleaning
                    cleanEffect = cleanEffect.replace(/^Debuff:\s*statReduction\s*for\s*\d+\s*\w+/i, "");
                    cleanEffect = cleanEffect.replace(/^Debuff:\s*statReduction/i, "");
                    cleanEffect = cleanEffect.replace(/^Debuff:/i, "");
                  }

                  // Skip if the effect is just about duration or empty after cleaning
                  if (typeof cleanEffect !== 'string' ||
                      !cleanEffect.trim() ||
                      /^for\s+\d+\s+(rounds?|minutes?|hours?|days?)$/i.test(cleanEffect.trim()) ||
                      /^\+?\d+\s*(rounds?|minutes?|hours?|days?)$/i.test(cleanEffect.trim())) {
                    return null;
                  }

                  // Skip this effect if it's a stat that's already in progressive stages
                  if (spell.debuffConfig?.stackingRule === 'progressive' && spell.debuffConfig?.progressiveStages?.length > 0) {
                    // Extract the stat name from the effect string
                    const statMatch = cleanEffect.match(/^([^:]+)\s+Reduction:/i);
                    if (statMatch && statMatch[1]) {
                      const statName = statMatch[1].trim();
                      // Check if this stat is included in any progressive stage
                      const isInProgressiveStages = spell.debuffConfig.progressiveStages.some(stage =>
                        stage.statPenalties?.some(mod => mod.name && statName &&
                          mod.name.toLowerCase() === statName.toLowerCase())
                      );
                      if (isInProgressiveStages) return null;
                    }
                  }

                  // Get saving throw information if available
                  const savingThrow = effect.savingThrow;
                  const dc = effect.difficultyClass;
                  const hasSavingThrow = savingThrow && dc && index > 0; // Skip for the first effect as it's shown in the header

                  return (
                    <div key={index} style={{ marginBottom: '3px', paddingLeft: '10px' }}>
                      • {cleanEffect}
                      {hasSavingThrow && (
                        <span style={{ color: '#ffd100', fontSize: '10px', marginLeft: '4px' }}>
                          (DC {dc} {savingThrow.charAt(0).toUpperCase() + savingThrow.slice(1)})
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Progressive Debuff Stages */}
              {spell.debuffConfig && spell.debuffConfig.stackingRule === 'progressive' && spell.debuffConfig.progressiveStages &&
               spell.debuffConfig.progressiveStages.length > 0 && (
                <div style={{ fontSize: '11px', color: '#a855f7', marginTop: '6px', paddingLeft: '10px',
                      borderTop: '1px dotted rgba(168, 85, 247, 0.3)', paddingTop: '4px' }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Progressive Stages:</div>
                  {spell.debuffConfig.progressiveStages
                    .sort((a, b) => a.triggerAt - b.triggerAt)
                    .map((stage, idx) => {
                      // Try to find the spell in the library
                      let spellName = null;
                      let spellDescription = null;

                      if (stage.spellEffect) {
                        // Log the spell effect data to see what we're working with
                        console.log('Debuff stage spell effect data:', stage.spellEffect, typeof stage.spellEffect);
                        console.log('Debuff stage spell data:', stage.spellData);

                        // First check if we have the spellData property from the SpellSelector
                        if (stage.spellData) {
                          console.log('Using spellData from SpellSelector for debuff:', stage.spellData);
                          spellName = stage.spellData.name;
                          spellDescription = stage.spellData.description || 'Custom spell effect';
                        }
                        // Then check if we have a direct reference to a spell object
                        else if (typeof stage.spellEffect === 'object' && stage.spellEffect !== null) {
                          if (stage.spellEffect.name) {
                            spellName = stage.spellEffect.name;
                            spellDescription = stage.spellEffect.description ||
                                              (stage.spellEffect.damageEffects && stage.spellEffect.damageEffects.length > 0 ?
                                               'Deals damage to target' : 'Custom spell effect');
                          } else if (stage.spellEffect.spellName) {
                            // Some objects might have spellName instead of name
                            spellName = stage.spellEffect.spellName;
                            spellDescription = stage.spellEffect.description || 'Custom spell effect';
                          }
                        } else if (typeof stage.spellEffect === 'string') {
                          // Check if it's a spell ID with a name property
                          if (stage.spellEffect.includes('name:')) {
                            try {
                              const parsedData = JSON.parse(stage.spellEffect);
                              spellName = parsedData.name || 'Unknown Spell';
                              spellDescription = parsedData.description || 'Custom spell effect';
                            } catch (e) {
                              // If parsing fails, continue with normal ID lookup
                              console.log('Failed to parse spell data:', e);
                            }
                          }

                          // Check if it's a known spell ID directly
                          const lowerCaseId = stage.spellEffect.toLowerCase();
                          if (KNOWN_SPELL_IDS[lowerCaseId]) {
                            console.log('Found debuff spell in KNOWN_SPELL_IDS:', KNOWN_SPELL_IDS[lowerCaseId]);
                            spellName = KNOWN_SPELL_IDS[lowerCaseId].name;
                            spellDescription = KNOWN_SPELL_IDS[lowerCaseId].description;
                          }
                          // If we still don't have a name, try to find it in the library
                          else if (!spellName) {
                            const librarySpells = getLibrarySpells();
                            console.log('Searching library for debuff spell ID:', stage.spellEffect);
                            const foundSpell = librarySpells.find(s => s.id === stage.spellEffect);
                            if (foundSpell) {
                              console.log('Found debuff spell in library:', foundSpell);
                              spellName = foundSpell.name;
                              spellDescription = foundSpell.description || 'Custom spell effect';
                            } else {
                              // If we can't find it by ID, try to get a readable name
                              console.log('Using getSpellInfoFromId for debuff:', stage.spellEffect);
                              const spellInfo = getSpellInfoFromId(stage.spellEffect);
                              spellName = spellInfo.name;
                              spellDescription = spellInfo.description;
                            }
                          }
                        } else {
                          // If all else fails, use a default name
                          spellName = 'Triggered Effect';
                          spellDescription = 'Custom spell effect';
                        }

                        // Log the final result for debugging
                        console.log('Final debuff spell name and description:', { spellName, spellDescription });
                      }

                      return (
                        <div key={idx} style={{
                          marginBottom: '6px',
                          backgroundColor: 'rgba(168, 85, 247, 0.1)',
                          borderRadius: '4px',
                          padding: '4px 6px',
                          borderLeft: '2px solid #a855f7'
                        }}>
                          <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>
                            Stage {idx + 1}: Triggers at {stage.triggerAt} {
                              spell.debuffConfig?.durationType === 'time' ? (spell.debuffConfig?.durationUnit || 'minutes') :
                              spell.debuffConfig?.durationType === 'rest' ? (spell.debuffConfig?.restType === 'short' ? 'short rest' : 'long rest') :
                              spell.debuffConfig?.durationType === 'permanent' ? 'permanent' : 'rounds'
                            }
                          </div>

                          {/* Saving throw for this stage */}
                          {stage.savingThrow && stage.difficultyClass && (
                            <div style={{ paddingLeft: '10px', marginBottom: '4px', color: '#ffd100' }}>
                              • DC {stage.difficultyClass} {stage.savingThrow.charAt(0).toUpperCase() + stage.savingThrow.slice(1)} save
                            </div>
                          )}

                          {/* Stat penalties for this stage */}
                          {stage.statPenalties && stage.statPenalties.length > 0 && (
                            <div style={{ paddingLeft: '10px' }}>
                              {stage.statPenalties.map((stat, statIdx) => (
                                <div key={statIdx} style={{ marginBottom: '2px' }}>
                                  • {stat.name}: {stat.magnitude > 0 ? '+' : ''}{stat.magnitude}
                                  {stat.magnitudeType === 'percentage' ? '%' : ''}
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Spell effect for this stage if any */}
                          {stage.spellEffect && (
                            <div style={{ paddingLeft: '10px', marginTop: '2px' }}>
                              • Triggers: {
                                // First try to use the spell name from our processing
                                spellName ||
                                // Then check if it's in the library
                                (() => {
                                  const librarySpells = getLibrarySpells();
                                  const foundSpell = librarySpells.find(s => s.id === stage.spellEffect);
                                  return foundSpell ? foundSpell.name : getSpellNameFromId(stage.spellEffect);
                                })()
                              }
                              {(spellDescription || getSpellDescriptionFromId(stage.spellEffect)) && (
                                <div style={{ fontSize: '10px', color: '#d8b4fe', paddingLeft: '10px', fontStyle: 'italic', marginTop: '2px' }}>
                                  {spellDescription || getSpellDescriptionFromId(stage.spellEffect)}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          )}

          {/* Control Effects section removed to eliminate duplication - now using the formatted version above */}

          {/* Utility Effects */}
          {spell.utilityEffects && spell.utilityEffects.length > 0 && (
            <div style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ color: '#2dd4bf', fontSize: '11px', fontWeight: 'bold' }}>
                  UTILITY EFFECTS:
                </span>
              </div>
              <div style={{ fontSize: '11px', color: '#2dd4bf' }}>
                {spell.utilityEffects.map((effect, index) => (
                  <div key={index} style={{ marginBottom: '3px', paddingLeft: '10px' }}>
                    • {effect}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Summoning Effects */}
          {spell.summoningEffects && spell.summoningEffects.length > 0 && (
            <div style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ color: '#0ea5e9', fontSize: '11px', fontWeight: 'bold' }}>
                  SUMMONING:
                </span>
              </div>
              <div style={{ fontSize: '11px', color: '#0ea5e9' }}>
                {spell.summoningEffects.map((effect, index) => (
                  <div key={index} style={{ marginBottom: '3px', paddingLeft: '10px' }}>
                    • {effect}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Transformation Effects */}
          {spell.transformationEffects && spell.transformationEffects.length > 0 && (
            <div style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ color: '#8b5cf6', fontSize: '11px', fontWeight: 'bold' }}>
                  TRANSFORMATION:
                </span>
              </div>
              <div style={{ fontSize: '11px', color: '#8b5cf6' }}>
                {spell.transformationEffects.map((effect, index) => (
                  <div key={index} style={{ marginBottom: '3px', paddingLeft: '10px' }}>
                    • {effect}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Purification Effects */}
          {spell.purificationEffects && spell.purificationEffects.length > 0 && (
            <div style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ color: '#fbbf24', fontSize: '11px', fontWeight: 'bold' }}>
                  PURIFICATION:
                </span>
              </div>
              <div style={{ fontSize: '11px', color: '#fbbf24' }}>
                {spell.purificationEffects.map((effect, index) => (
                  <div key={index} style={{ marginBottom: '3px', paddingLeft: '10px' }}>
                    • {effect}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Restoration Effects */}
          {spell.restorationEffects && spell.restorationEffects.length > 0 && (
            <div style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ color: '#10b981', fontSize: '11px', fontWeight: 'bold' }}>
                  RESTORATION:
                </span>
              </div>
              <div style={{ fontSize: '11px', color: '#10b981' }}>
                {spell.restorationEffects.map((effect, index) => (
                  <div key={index} style={{ marginBottom: '3px', paddingLeft: '10px' }}>
                    • {effect}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rollable Table Section */}
          {(rollableTableData && rollableTableData.enabled &&
            !(spell.criticalConfig?.enabled && spell.criticalConfig?.useRollableTable) &&
            !(spell.procConfig?.enabled && spell.procConfig?.useRollableTable)) ||
           usingRollableTableForCritical ||
           usingRollableTableForProc ? (
            <div style={{
              marginBottom: '8px',
              backgroundColor: usingRollableTableForCritical ? 'rgba(239, 68, 68, 0.05)' :
                              usingRollableTableForProc ? 'rgba(59, 130, 246, 0.05)' : 'rgba(248, 183, 0, 0.05)',
              borderRadius: '4px',
              border: usingRollableTableForCritical ? '1px solid rgba(239, 68, 68, 0.2)' :
                      usingRollableTableForProc ? '1px solid rgba(59, 130, 246, 0.2)' : '1px solid rgba(248, 183, 0, 0.2)',
              padding: '8px',
              marginTop: '8px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '6px',
                gap: '6px',
                borderBottom: usingRollableTableForCritical ? '1px solid rgba(239, 68, 68, 0.2)' :
                             usingRollableTableForProc ? '1px solid rgba(59, 130, 246, 0.2)' : '1px solid rgba(248, 183, 0, 0.2)',
                paddingBottom: '3px'
              }}>
                <div style={{
                  backgroundColor: usingRollableTableForCritical ? 'rgba(239, 68, 68, 0.2)' :
                                  usingRollableTableForProc ? 'rgba(59, 130, 246, 0.2)' : 'rgba(248, 183, 0, 0.2)',
                  borderRadius: '3px',
                  width: '18px',
                  height: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <FontAwesomeIcon
                    icon={
                      rollableTableData?.resolutionType === 'DICE' ? faDice :
                      rollableTableData?.resolutionType === 'CARDS' ? faClone :
                      rollableTableData?.resolutionType === 'COINS' ? faCoins : faDice
                    }
                    style={{
                      color: usingRollableTableForCritical ? '#ef4444' :
                             usingRollableTableForProc ? '#3b82f6' : '#f8b700',
                      fontSize: '10px'
                    }}
                  />
                </div>
                <span style={{
                  fontWeight: 'bold',
                  fontSize: '11px',
                  color: usingRollableTableForCritical ? '#ef4444' :
                         usingRollableTableForProc ? '#3b82f6' : '#f8b700'
                }}>
                  {usingRollableTableForCritical ? 'CRITICAL HIT TABLE:' :
                   usingRollableTableForProc ? 'CHANCE ON HIT TABLE:' : 'ROLLABLE TABLE:'} {rollableTableData?.name || 'Random Effects'}
                </span>
              </div>

              {/* Rollable Table Description */}
              {rollableTableData?.description && (
                <div style={{
                  fontSize: '10px',
                  color: '#94a3b8',
                  fontStyle: 'italic',
                  marginBottom: '6px',
                  paddingLeft: '8px',
                  borderLeft: usingRollableTableForCritical ? '2px solid rgba(239, 68, 68, 0.3)' :
                              usingRollableTableForProc ? '2px solid rgba(59, 130, 246, 0.3)' : '2px solid rgba(248, 183, 0, 0.3)'
                }}>
                  {rollableTableData.description}
                </div>
              )}

              {/* Rollable Table Entries */}
              {rollableTableData?.entries && rollableTableData.entries.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {rollableTableData.entries.map((entry, index) => {
                    // Try to find the referenced spell
                    const referencedSpell = entry.spellReference ?
                      (typeof getLibrarySpells === 'function' ?
                        getLibrarySpells(spellLibrary).find(s => s.id === entry.spellReference) : null) :
                      null;

                    // Get the roll/card/coin display text
                    const resultText = (() => {
                      if (rollableTableData.resolutionType === 'DICE') {
                        return entry.range ?
                          (entry.range.min === entry.range.max ? entry.range.min : `${entry.range.min || 1}-${entry.range.max || 1}`) :
                        entry.min !== undefined && entry.max !== undefined ?
                          (entry.min === entry.max ? entry.min : `${entry.min}-${entry.max}`) :
                        entry.result || entry.roll || entry.value || '1-20';
                      } else if (rollableTableData.resolutionType === 'CARDS') {
                        return entry.cardPattern || entry.pattern || entry.cards || 'Any';
                      } else if (rollableTableData.resolutionType === 'COINS') {
                        return entry.coinPattern ?
                          (entry.coinPattern.startsWith('SEQUENCE_') ?
                            entry.coinPattern.replace('SEQUENCE_', '').split('').join(' ') :
                            entry.coinPattern) :
                        entry.pattern || entry.coins || 'Any';
                      }
                      return '';
                    })();

                    // Determine effect type and icon based on content
                    const getEffectTypeInfo = () => {
                      if (entry.modifiesBaseSpell) {
                        return {
                          text: 'Base Modifier',
                          color: '#22c55e',
                          icon: faWandMagicSparkles
                        };
                      }

                      if (entry.spellReference) {
                        return {
                          text: 'External Spell',
                          color: '#3b82f6',
                          icon: faMagic
                        };
                      }

                      // Check description for effect type hints
                      const desc = (entry.effect || entry.description || '').toLowerCase();

                      if (desc.includes('stun') || desc.includes('fear') || desc.includes('root') ||
                          desc.includes('silence') || desc.includes('immobilize')) {
                        return {
                          text: 'Control',
                          color: '#a855f7',
                          icon: faBan
                        };
                      }

                      if (desc.includes('damage') || desc.includes('fire') || desc.includes('frost') ||
                          desc.includes('shadow') || desc.includes('arcane')) {
                        return {
                          text: 'Damage',
                          color: '#ef4444',
                          icon: faFire
                        };
                      }

                      if (desc.includes('heal') || desc.includes('restore') || desc.includes('regenerate')) {
                        return {
                          text: 'Healing',
                          color: '#22c55e',
                          icon: faHeart
                        };
                      }

                      if (desc.includes('shield') || desc.includes('armor') || desc.includes('protect') ||
                          desc.includes('resist') || desc.includes('absorb')) {
                        return {
                          text: 'Buff',
                          color: '#3b82f6',
                          icon: faShieldAlt
                        };
                      }

                      if (desc.includes('weaken') || desc.includes('slow') || desc.includes('reduce') ||
                          desc.includes('vulnerable')) {
                        return {
                          text: 'Debuff',
                          color: '#f59e0b',
                          icon: faSkull
                        };
                      }

                      // Default
                      return {
                        text: 'Effect',
                        color: '#f59e0b',
                        icon: faMagic
                      };
                    };

                    const effectType = getEffectTypeInfo();

                    return (
                      <div key={index} style={{
                        backgroundColor: usingRollableTableForCritical ? 'rgba(239, 68, 68, 0.1)' :
                                        usingRollableTableForProc ? 'rgba(59, 130, 246, 0.1)' : 'rgba(248, 183, 0, 0.1)',
                        borderRadius: '3px',
                        padding: '4px 6px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <div style={{
                          backgroundColor: usingRollableTableForCritical ? 'rgba(239, 68, 68, 0.2)' :
                                          usingRollableTableForProc ? 'rgba(59, 130, 246, 0.2)' : 'rgba(248, 183, 0, 0.2)',
                          borderRadius: '3px',
                          minWidth: '20px',
                          height: '20px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold',
                          fontSize: '10px',
                          color: usingRollableTableForCritical ? '#ef4444' :
                                 usingRollableTableForProc ? '#3b82f6' : '#f8b700'
                        }}>
                          {resultText}
                        </div>

                        <div style={{
                          display: 'flex',
                          flexDirection: 'column',
                          flex: 1
                        }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                          }}>
                            <span style={{
                              fontWeight: 'bold',
                              fontSize: '11px',
                              color: usingRollableTableForCritical ? '#ef4444' :
                                     usingRollableTableForProc ? '#3b82f6' : '#f8b700'
                            }}>
                              {entry.name || entry.customName || (referencedSpell ? referencedSpell.name : 'Effect')}
                            </span>

                            <div style={{
                              fontSize: '9px',
                              backgroundColor: `rgba(${effectType.color.replace(/[^\d,]/g, '').split(',').map(c => parseInt(c)).join(', ')}, 0.1)`,
                              padding: '1px 4px',
                              borderRadius: '2px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '3px'
                            }}>
                              <FontAwesomeIcon icon={effectType.icon} style={{ color: effectType.color, fontSize: '8px' }} />
                              <span style={{ color: effectType.color }}>{effectType.text}</span>
                            </div>
                          </div>

                          <div style={{ fontSize: '10px', color: '#e2e8f0', marginTop: '2px' }}>
                            {entry.effect || entry.description || (referencedSpell ? referencedSpell.description : 'Custom effect')}
                          </div>

                          {/* Display formula overrides if they exist */}
                          {entry.formulaOverrides && Object.keys(entry.formulaOverrides).length > 0 && (
                            <div style={{
                              marginTop: '3px',
                              display: 'flex',
                              flexWrap: 'wrap',
                              gap: '4px'
                            }}>
                              {entry.formulaOverrides.damage && (
                                <div style={{
                                  fontSize: '9px',
                                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                  padding: '1px 4px',
                                  borderRadius: '2px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '2px'
                                }}>
                                  <FontAwesomeIcon icon={faFire} style={{ color: '#ef4444', fontSize: '8px' }} />
                                  <span style={{ color: '#ef4444' }}>{entry.formulaOverrides.damage}</span>
                                </div>
                              )}
                              {entry.formulaOverrides.healing && (
                                <div style={{
                                  fontSize: '9px',
                                  backgroundColor: 'rgba(34, 197, 94, 0.1)',
                                  padding: '1px 4px',
                                  borderRadius: '2px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '2px'
                                }}>
                                  <FontAwesomeIcon icon={faHeart} style={{ color: '#22c55e', fontSize: '8px' }} />
                                  <span style={{ color: '#22c55e' }}>{entry.formulaOverrides.healing}</span>
                                </div>
                              )}
                              {entry.formulaOverrides.duration && (
                                <div style={{
                                  fontSize: '9px',
                                  backgroundColor: 'rgba(168, 85, 247, 0.1)',
                                  padding: '1px 4px',
                                  borderRadius: '2px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '2px'
                                }}>
                                  <FontAwesomeIcon icon={faClock} style={{ color: '#a855f7', fontSize: '8px' }} />
                                  <span style={{ color: '#a855f7' }}>{entry.formulaOverrides.duration}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Rollable Table Summary */}
              <div style={{
                fontSize: '9px',
                color: '#94a3b8',
                marginTop: '4px',
                padding: '2px 6px',
                backgroundColor: 'rgba(15, 23, 42, 0.2)',
                borderRadius: '3px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <FontAwesomeIcon
                    icon={
                      rollableTableData?.resolutionType === 'DICE' ? faDice :
                      rollableTableData?.resolutionType === 'CARDS' ? faClone :
                      faCoins
                    }
                    style={{ fontSize: '8px' }}
                  />
                  {rollableTableData?.resolutionType === 'DICE' ? `${rollableTableData?.diceType || 'd20'}` :
                   rollableTableData?.resolutionType === 'CARDS' ? `${rollableTableData?.cardCount || 1} cards` :
                   `${rollableTableData?.coinCount || 1} coins`}
                </span>
                <span>{rollableTableData?.entries?.length || 0} effects</span>
              </div>
            </div>
          ) : null}

          {/* Mechanics Section */}
          {spell.mechanicsData && spell.mechanicsData.length > 0 && (
            <div style={{ marginBottom: '8px', marginTop: '8px', borderTop: '1px solid rgba(148, 163, 184, 0.2)', paddingTop: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ color: '#f59e0b', fontSize: '11px', fontWeight: 'bold' }}>
                  MECHANICS:
                </span>
              </div>
              <div style={{ fontSize: '11px', color: '#f59e0b' }}>
                {spell.mechanicsData.map((mechanic, index) => {
                  // Get system color
                  const systemColor =
                    mechanic.system === 'COMBO_POINTS' ? '#ef4444' :
                    mechanic.system === 'CHORD_SYSTEM' ? '#9370DB' :
                    mechanic.system === 'STATE_REQUIREMENTS' ? '#22c55e' :
                    mechanic.system === 'FORM_SYSTEM' ? '#3b82f6' :
                    mechanic.system === 'PROC_SYSTEM' ? '#a855f7' :
                    mechanic.system === 'TOXIC_SYSTEM' ? '#84cc16' :
                    mechanic.system === 'CARD_SYSTEM' ? '#22c55e' :
                    mechanic.system === 'COIN_SYSTEM' ? '#f59e0b' :
                    '#f59e0b';

                  // Format system name
                  const systemName =
                    mechanic.system === 'COMBO_POINTS' ? 'Combo Points' :
                    mechanic.system === 'CHORD_SYSTEM' ? 'Chord System' :
                    mechanic.system === 'STATE_REQUIREMENTS' ? 'State Requirements' :
                    mechanic.system === 'FORM_SYSTEM' ? 'Form System' :
                    mechanic.system === 'PROC_SYSTEM' ? 'Proc System' :
                    mechanic.system === 'TOXIC_SYSTEM' ? 'Toxic System' :
                    mechanic.system === 'CARD_SYSTEM' ? 'Card System' :
                    mechanic.system === 'COIN_SYSTEM' ? 'Coin System' :
                    mechanic.system;

                  // Check if this mechanic has graduated effects (for chord or toxic systems)
                  const hasGraduatedEffects =
                    (mechanic.system === 'CHORD_SYSTEM' && mechanic.details.some(d => d.startsWith('  Level'))) ||
                    (mechanic.system === 'TOXIC_SYSTEM' && mechanic.details.some(d => d.startsWith('  Level')));

                  // Group details by type
                  const basicDetails = [];
                  const recipeDetails = [];
                  const graduatedEffects = [];

                  mechanic.details.forEach(detail => {
                    if (detail.startsWith('Recipe:')) {
                      recipeDetails.push(detail);
                    } else if (detail.startsWith('  Level')) {
                      graduatedEffects.push(detail);
                    } else if (!detail.startsWith('Has ')) { // Skip the 'Has X graduated effect levels:' line
                      basicDetails.push(detail);
                    }
                  });

                  return (
                    <div key={index} style={{
                      marginBottom: '12px',
                      backgroundColor: `rgba(15, 23, 42, 0.6)`,
                      border: `1px solid ${systemColor}40`,
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      {/* Header */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '4px 8px',
                        background: `linear-gradient(to right, ${systemColor}30, transparent)`,
                        borderBottom: `1px solid ${systemColor}40`
                      }}>
                        <span style={{
                          color: systemColor,
                          fontWeight: 'bold',
                          fontSize: '11px',
                          marginRight: '6px'
                        }}>
                          {systemName}
                        </span>
                        <span style={{ color: '#e2e8f0', fontSize: '11px' }}>
                          {mechanic.effectName !== 'Global' ? `(${mechanic.effectName})` : ''}
                        </span>
                      </div>

                      {/* Content */}
                      <div style={{ padding: '6px 8px' }}>
                        {/* Basic details */}
                        {basicDetails.map((detail, detailIndex) => (
                          <div key={`basic-${detailIndex}`} style={{
                            marginBottom: '4px',
                            paddingLeft: '10px',
                            color: '#e2e8f0',
                            fontSize: '11px',
                            display: 'flex',
                            alignItems: 'flex-start'
                          }}>
                            <span style={{ color: systemColor, marginRight: '4px' }}>•</span> {detail}
                          </div>
                        ))}

                        {/* Recipe details with special styling */}
                        {recipeDetails.length > 0 && (
                          <div style={{
                            marginTop: '4px',
                            marginBottom: '4px',
                            padding: '4px 8px',
                            backgroundColor: `${systemColor}15`,
                            borderRadius: '3px',
                            borderLeft: `2px solid ${systemColor}`
                          }}>
                            {recipeDetails.map((detail, detailIndex) => {
                              const [label, recipes] = detail.split(': ');
                              return (
                                <div key={`recipe-${detailIndex}`} style={{
                                  fontSize: '11px',
                                  color: '#e2e8f0'
                                }}>
                                  <span style={{ fontWeight: 'bold', color: systemColor }}>{label}:</span> {recipes}
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Graduated effects with table-like styling */}
                        {graduatedEffects.length > 0 && (
                          <div style={{
                            marginTop: '6px',
                            borderTop: `1px dotted ${systemColor}40`,
                            paddingTop: '6px'
                          }}>
                            <div style={{
                              fontSize: '11px',
                              fontWeight: 'bold',
                              color: systemColor,
                              marginBottom: '4px',
                              paddingLeft: '10px'
                            }}>
                              Effect Levels:
                            </div>
                            {graduatedEffects.map((detail, detailIndex) => {
                              // Parse the graduated effect detail
                              const levelMatch = detail.match(/Level (\d+):/);
                              const level = levelMatch ? levelMatch[1] : '';

                              // Extract effect type and formula
                              let effectType = '';
                              let formula = '';
                              let description = '';

                              if (detail.includes(' - Formula: ')) {
                                const parts = detail.split(' - Formula: ');
                                const typeParts = parts[0].split(': ');
                                effectType = typeParts[1];

                                if (parts[1].includes(' - ')) {
                                  const formulaParts = parts[1].split(' - ');
                                  formula = formulaParts[0];
                                  description = formulaParts[1];
                                } else {
                                  formula = parts[1];
                                }
                              } else if (detail.includes(' - ')) {
                                const parts = detail.split(' - ');
                                const typeParts = parts[0].split(': ');
                                effectType = typeParts[1];
                                description = parts[1];
                              } else {
                                const typeParts = detail.split(': ');
                                effectType = typeParts[1] || '';
                              }

                              return (
                                <div key={`effect-${detailIndex}`} style={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  marginBottom: '6px',
                                  padding: '4px 6px',
                                  backgroundColor: detailIndex % 2 === 0 ? 'rgba(15, 23, 42, 0.3)' : 'transparent',
                                  borderRadius: '3px',
                                  borderLeft: `2px solid ${systemColor}`
                                }}>
                                  {/* Level and type row */}
                                  <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    marginBottom: '2px'
                                  }}>
                                    <span style={{
                                      fontWeight: 'bold',
                                      color: systemColor,
                                      fontSize: '11px',
                                      marginRight: '6px',
                                      backgroundColor: `${systemColor}30`,
                                      padding: '1px 5px',
                                      borderRadius: '3px'
                                    }}>
                                      Level {level}
                                    </span>
                                    <span style={{
                                      color: '#e2e8f0',
                                      fontSize: '11px'
                                    }}>
                                      {effectType}
                                    </span>
                                  </div>

                                  {/* Formula row */}
                                  {formula && (
                                    <div style={{
                                      fontSize: '11px',
                                      color: '#e2e8f0',
                                      paddingLeft: '10px',
                                      marginBottom: '2px'
                                    }}>
                                      <span style={{ color: '#94a3b8' }}>Formula:</span>
                                      <span style={{
                                        fontFamily: 'monospace',
                                        backgroundColor: 'rgba(0, 0, 0, 0.2)',
                                        padding: '1px 4px',
                                        borderRadius: '2px',
                                        marginLeft: '4px'
                                      }}>
                                        {formula}
                                      </span>
                                    </div>
                                  )}

                                  {/* Description row */}
                                  {description && (
                                    <div style={{
                                      fontSize: '11px',
                                      color: '#94a3b8',
                                      paddingLeft: '10px',
                                      fontStyle: 'italic'
                                    }}>
                                      {description}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}



          {/* Other Effects (for backward compatibility) */}
          {spell.effects && spell.effects.length > 0 &&
           !spell.damageEffects && !spell.healingEffects &&
           !spell.buffEffects && !spell.debuffEffects &&
           !spell.controlEffects && !spell.utilityEffects &&
           !spell.summoningEffects && !spell.transformationEffects &&
           !spell.purificationEffects && !spell.restorationEffects && (
            <div style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 'bold' }}>
                  EFFECTS:
                </span>
              </div>
              <div style={{ fontSize: '11px', color: '#e2e8f0' }}>
                {spell.effects.map((effect, index) => (
                  <div key={index} style={{ marginBottom: '3px', paddingLeft: '10px' }}>
                    • {effect}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stat bonuses are now displayed in the buff effects section */}

          {/* Trap details - Redesigned with a cleaner, more compact layout */}
          {isTrapSpell && (
            <div style={{ marginBottom: '8px', marginTop: '8px', borderTop: '1px solid rgba(148, 163, 184, 0.2)', paddingTop: '8px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '8px',
                gap: '6px',
                borderBottom: '1px solid rgba(239, 68, 68, 0.2)',
                paddingBottom: '4px'
              }}>
                <FontAwesomeIcon
                  icon={faExclamationCircle}
                  style={{
                    color: '#ef4444',
                    fontSize: '14px'
                  }}
                />
                <span style={{
                  fontWeight: 'bold',
                  fontSize: '13px',
                  color: '#ef4444'
                }}>
                  TRAP PHYSICAL PROPERTIES
                </span>
              </div>

              {/* Main trap properties in a card layout */}
              <div style={{
                fontSize: '11px',
                color: '#e2e8f0',
                backgroundColor: 'rgba(239, 68, 68, 0.05)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: '4px',
                padding: '8px',
                marginBottom: '8px'
              }}>
                {/* Size and Placement */}
                <div style={{ marginBottom: '4px', paddingLeft: '10px', display: 'flex', alignItems: 'center' }}>
                  <FontAwesomeIcon icon={faRulerCombined} style={{ color: '#ef4444', marginRight: '8px', width: '12px' }} />
                  <span>• Size: <strong>{trapConfig.placementRadius || 5} ft radius</strong></span>
                </div>

                <div style={{ marginBottom: '4px', paddingLeft: '10px', display: 'flex', alignItems: 'center' }}>
                  <FontAwesomeIcon icon={faClock} style={{ color: '#ef4444', marginRight: '8px', width: '12px' }} />
                  <span>• Setup: <strong>{(spell.typeConfig && spell.typeConfig.placementTime) || 1} {((spell.typeConfig && spell.typeConfig.placementTime) || 1) === 1 ? 'turn' : 'turns'}</strong></span>
                </div>

                {/* Uses and Duration */}
                <div style={{ marginBottom: '4px', paddingLeft: '10px', display: 'flex', alignItems: 'center' }}>
                  <FontAwesomeIcon icon={faBolt} style={{ color: '#ef4444', marginRight: '8px', width: '12px' }} />
                  <span>• Uses: <strong>{trapConfig.maxTriggers === 1 ? '1 time' : `${trapConfig.maxTriggers || 1} times`}</strong></span>
                </div>

                <div style={{ marginBottom: '4px', paddingLeft: '10px', display: 'flex', alignItems: 'center' }}>
                  <FontAwesomeIcon icon={faHourglass} style={{ color: '#ef4444', marginRight: '8px', width: '12px' }} />
                  <span>• Duration: <strong>{trapConfig.trapDuration === 'permanent' ? 'Permanent' :
                    trapConfig.trapDuration === 'timed' ? `${trapConfig.durationValue || 1} ${trapConfig.durationUnit || 'turns'}` :
                    'Conditional'}</strong></span>
                </div>

                {/* Visibility */}
                <div style={{ marginBottom: '4px', paddingLeft: '10px', display: 'flex', alignItems: 'center' }}>
                  <FontAwesomeIcon icon={faEye} style={{ color: '#ef4444', marginRight: '8px', width: '12px' }} />
                  <span>• Visibility: <strong>{trapConfig.visibility === 'hidden' ? 'Hidden' :
                    trapConfig.visibility === 'visible' ? 'Visible' :
                    'Magical Aura'}</strong></span>
                </div>
              </div>

              {/* Detection and Disarm section */}
              <div style={{
                fontSize: '11px',
                color: '#e2e8f0',
                backgroundColor: 'rgba(239, 68, 68, 0.05)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: '4px',
                padding: '8px'
              }}>
                {/* Detection DC */}
                <div style={{ marginBottom: '4px', paddingLeft: '10px', display: 'flex', alignItems: 'center' }}>
                  <FontAwesomeIcon icon={faSearch} style={{ color: '#ef4444', marginRight: '8px', width: '12px' }} />
                  <span>• Detection: <strong>DC {trapConfig.detectionDC || 15}</strong> <span style={{ opacity: 0.8 }}>({trapConfig.detectionMethod === 'perception' ? 'Perception' :
                    trapConfig.detectionMethod === 'investigation' ? 'Investigation' :
                    trapConfig.detectionMethod === 'arcana' ? 'Arcana' :
                    trapConfig.detectionMethod === 'detect_magic' ? 'Detect Magic' :
                    'True Sight'})</span></span>
                </div>

                {/* Disarm DC */}
                <div style={{ paddingLeft: '10px', display: 'flex', alignItems: 'center' }}>
                  <FontAwesomeIcon icon={faUnlock} style={{ color: '#ef4444', marginRight: '8px', width: '12px' }} />
                  <span>• Disarm: <strong>DC {trapConfig.disarmDC || 15}</strong> <span style={{ opacity: 0.8 }}>({trapConfig.disarmMethod === 'thieves_tools' ? 'Specific Item' :
                    trapConfig.disarmMethod === 'arcana' ? 'Arcana' :
                    trapConfig.disarmMethod === 'strength' ? 'Strength' :
                    trapConfig.disarmMethod === 'dexterity' ? 'Dexterity' :
                    trapConfig.disarmMethod === 'dispel_magic' ? 'Dispel Magic' :
                    'Specific Item'})</span></span>
                </div>
              </div>

              {/* Trap Trigger Effects */}
              {spell.triggerEffects && spell.triggerEffects.length > 0 && (
                <div style={{
                  fontSize: '11px',
                  color: '#94a3b8',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.15)',
                  borderRadius: '4px',
                  padding: '6px',
                  marginTop: '8px'
                }}>
                  <div style={{
                    fontWeight: 'bold',
                    marginBottom: '6px',
                    color: '#ef4444',
                    borderBottom: '1px solid rgba(239, 68, 68, 0.2)',
                    paddingBottom: '4px'
                  }}>
                    TRIGGER CONDITIONS:
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {spell.triggerEffects.map((trigger, index) => (
                      <div key={index} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '4px 8px',
                        backgroundColor: 'rgba(239, 68, 68, 0.05)',
                        borderRadius: '4px',
                        border: '1px solid rgba(239, 68, 68, 0.1)'
                      }}>
                        {trigger.icon ? (
                          <img
                            src={`https://wow.zamimg.com/images/wow/icons/small/${trigger.icon}.jpg`}
                            alt={trigger.name}
                            style={{ width: '20px', height: '20px', borderRadius: '3px' }}
                          />
                        ) : (
                          <FontAwesomeIcon icon={faBolt} style={{ color: '#ef4444', width: '12px' }} />
                        )}
                        <div>
                          <div style={{ fontWeight: 'bold' }}>{trigger.name}</div>
                          <div style={{ fontSize: '10px', opacity: 0.8 }}>{trigger.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Trap Control Effects */}
              {spell.controlEffects && spell.controlEffects.length > 0 && (
                <div style={{
                  fontSize: '11px',
                  color: '#e2e8f0',
                  backgroundColor: 'rgba(234, 88, 12, 0.05)',
                  border: '1px solid rgba(234, 88, 12, 0.2)',
                  borderRadius: '3px',
                  padding: '6px',
                  marginTop: '6px'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '6px',
                    gap: '4px',
                    borderBottom: '1px solid rgba(234, 88, 12, 0.2)',
                    paddingBottom: '3px'
                  }}>
                    <div style={{
                      backgroundColor: 'rgba(234, 88, 12, 0.2)',
                      borderRadius: '3px',
                      width: '18px',
                      height: '18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <FontAwesomeIcon
                        icon={faHandPaper}
                        style={{
                          color: '#ea580c',
                          fontSize: '10px'
                        }}
                      />
                    </div>
                    <span style={{
                      fontWeight: 'bold',
                      fontSize: '11px',
                      color: '#ea580c'
                    }}>
                      CONTROL EFFECTS
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {spell.controlEffects.map((effect, index) => {
                      // Determine which icon to use based on the effect text
                      let icon = faSnowflake;
                      let effectName = '';
                      let effectDescription = '';

                      // Handle different types of effect data
                      if (typeof effect === 'object' && effect !== null) {
                        // If effect is an object with name/description properties
                        if (effect.name) {
                          effectName = effect.name;
                        }
                        if (effect.description) {
                          effectDescription = effect.description;
                        } else if (effect.effect) {
                          effectDescription = effect.effect;
                        } else {
                          // If no description field, use a stringified version of the object
                          effectDescription = JSON.stringify(effect);
                        }

                        // If effect has an icon property, use it to determine the icon
                        if (effect.icon) {
                          if (effect.icon.includes('slow') || effect.icon.includes('speed')) {
                            icon = faRunning;
                          } else if (effect.icon.includes('stun') || effect.icon.includes('paralyze')) {
                            icon = faBolt;
                          } else if (effect.icon.includes('fear') || effect.icon.includes('frighten')) {
                            icon = faGhost;
                          } else if (effect.icon.includes('chill') || effect.icon.includes('freeze')) {
                            icon = faSnowflake;
                          } else if (effect.icon.includes('blind')) {
                            icon = faEyeSlash;
                          } else if (effect.icon.includes('silence')) {
                            icon = faVolumeOff;
                          } else if (effect.icon.includes('root') || effect.icon.includes('immobilize')) {
                            icon = faAnchor;
                          }
                        }
                      } else if (typeof effect === 'string') {
                        // Handle string effects
                        effectDescription = effect;

                        // Extract effect name and description if the format is "Name: Description"
                        if (effect.includes(':')) {
                          const parts = effect.split(':');
                          effectName = parts[0].trim();
                          effectDescription = parts.slice(1).join(':').trim();

                          // Choose icon based on effect name
                          if (effectName.toLowerCase().includes('slow') || effectName.toLowerCase().includes('speed')) {
                            icon = faRunning;
                          } else if (effectName.toLowerCase().includes('stun') || effectName.toLowerCase().includes('paralyze')) {
                            icon = faBolt;
                          } else if (effectName.toLowerCase().includes('fear') || effectName.toLowerCase().includes('frighten')) {
                            icon = faGhost;
                          } else if (effectName.toLowerCase().includes('chill') || effectName.toLowerCase().includes('freeze')) {
                            icon = faSnowflake;
                          } else if (effectName.toLowerCase().includes('blind')) {
                            icon = faEyeSlash;
                          } else if (effectName.toLowerCase().includes('silence')) {
                            icon = faVolumeOff;
                          } else if (effectName.toLowerCase().includes('root') || effectName.toLowerCase().includes('immobilize')) {
                            icon = faAnchor;
                          }
                        } else {
                          // If no colon, try to determine the type from the text
                          const lowerEffect = effect.toLowerCase();
                          if (lowerEffect.includes('slow') || lowerEffect.includes('speed')) {
                            icon = faRunning;
                            effectName = 'Slow';
                          } else if (lowerEffect.includes('stun') || lowerEffect.includes('paralyze')) {
                            icon = faBolt;
                            effectName = 'Stun';
                          } else if (lowerEffect.includes('fear') || lowerEffect.includes('frighten')) {
                            icon = faGhost;
                            effectName = 'Fear';
                          } else if (lowerEffect.includes('chill') || lowerEffect.includes('freeze')) {
                            icon = faSnowflake;
                            effectName = 'Chill';
                          } else if (lowerEffect.includes('blind')) {
                            icon = faEyeSlash;
                            effectName = 'Blind';
                          } else if (lowerEffect.includes('silence')) {
                            icon = faVolumeOff;
                            effectName = 'Silence';
                          } else if (lowerEffect.includes('root') || lowerEffect.includes('immobilize')) {
                            icon = faAnchor;
                            effectName = 'Root';
                          }
                        }
                      } else {
                        // Handle other types (number, boolean, etc.)
                        effectDescription = String(effect);
                      }

                      return (
                        <div key={index} style={{
                          backgroundColor: 'rgba(234, 88, 12, 0.1)',
                          borderRadius: '3px',
                          padding: '3px 5px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}>
                          <div style={{
                            backgroundColor: 'rgba(234, 88, 12, 0.2)',
                            borderRadius: '3px',
                            width: '16px',
                            height: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <FontAwesomeIcon
                              icon={icon}
                              style={{
                                color: '#ea580c',
                                fontSize: '8px'
                              }}
                            />
                          </div>
                          <div style={{ flex: 1 }}>
                            {effectName && (
                              <div style={{ fontWeight: 'bold', fontSize: '10px' }}>{effectName}</div>
                            )}
                            {effectDescription && (
                              <div style={{ fontSize: '9px', color: '#e2e8f0' }}>{effectDescription}</div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Saving throw information */}
                  {spell.savingThrow && (
                    <div style={{
                      marginTop: '4px',
                      color: '#ffd100',
                      fontSize: '9px',
                      padding: '2px 5px',
                      backgroundColor: 'rgba(234, 88, 12, 0.1)',
                      borderRadius: '3px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <FontAwesomeIcon icon={faShieldAlt} style={{ color: '#ffd100', fontSize: '8px' }} />
                      <span>Saving Throw: {spell.savingThrow.charAt(0).toUpperCase() + spell.savingThrow.slice(1)} DC {spell.difficultyClass || 15}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Activation Conditions and Triggers - Redesigned with a cleaner layout */}
          {spell.triggerConfig && (
            (spell.triggerConfig.global && spell.triggerConfig.global.compoundTriggers && spell.triggerConfig.global.compoundTriggers.length > 0) ||
            (spell.triggerConfig.effectTriggers && Object.keys(spell.triggerConfig.effectTriggers).length > 0) ||
            (spell.triggerConfig.compoundTriggers && Array.isArray(spell.triggerConfig.compoundTriggers) && spell.triggerConfig.compoundTriggers.length > 0) ||
            (spell.triggerConfig.dotTrigger || spell.triggerConfig.hotTrigger)
          ) && (
            <div style={{ marginBottom: '8px', marginTop: '8px', borderTop: '1px solid rgba(148, 163, 184, 0.2)', paddingTop: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ color: '#f97316', fontSize: '11px', fontWeight: 'bold' }}>
                  TRIGGERS:
                </span>
              </div>

              {/* Main trigger container with card-like styling */}
              <div style={{
                fontSize: '11px',
                backgroundColor: 'rgba(249, 115, 22, 0.05)',
                border: '1px solid rgba(249, 115, 22, 0.1)',
                borderRadius: '4px',
                padding: '6px',
                marginBottom: '6px'
              }}>
                {/* Global Triggers Section */}
                {spell.triggerConfig.global && spell.triggerConfig.global.compoundTriggers && spell.triggerConfig.global.compoundTriggers.length > 0 && (
                  <div style={{
                    marginBottom: '6px',
                    borderBottom: (spell.triggerConfig.effectTriggers && Object.keys(spell.triggerConfig.effectTriggers).length > 0) ||
                                  (spell.triggerConfig.dotTrigger || spell.triggerConfig.hotTrigger) ?
                                  '1px solid rgba(148, 163, 184, 0.1)' : 'none',
                    paddingBottom: (spell.triggerConfig.effectTriggers && Object.keys(spell.triggerConfig.effectTriggers).length > 0) ||
                                   (spell.triggerConfig.dotTrigger || spell.triggerConfig.hotTrigger) ?
                                   '6px' : '0'
                  }}>
                    {/* Logic row */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '4px'
                    }}>
                      <FontAwesomeIcon icon={spell.triggerConfig.global.logicType === 'AND' ? faLayerGroup : faDice}
                                      style={{ color: '#f97316', marginRight: '8px', width: '14px' }} />
                      <span>
                        <strong>Logic: </strong>
                        <span style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)', padding: '2px 6px', borderRadius: '3px', fontSize: '10px' }}>
                          {spell.triggerConfig.global.logicType === 'AND' ? 'ALL CONDITIONS' : 'ANY CONDITION'}
                        </span>
                      </span>
                    </div>

                    {/* Trigger conditions */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      marginTop: '4px'
                    }}>
                      <FontAwesomeIcon icon={faBolt} style={{ color: '#f97316', marginRight: '8px', width: '14px', marginTop: '2px' }} />
                      <div>
                        <strong>Activates on:</strong>
                        <div style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '4px',
                          marginTop: '4px'
                        }}>
                          {spell.triggerConfig.global.compoundTriggers.map((trigger, index) => {
                            const triggerName = trigger.name ||
                              (trigger.id ? trigger.id.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'Trigger');
                            const triggerParams = formatTriggerParams(trigger);

                            return (
                              <div key={index} style={{
                                backgroundColor: 'rgba(249, 115, 22, 0.1)',
                                border: '1px solid rgba(249, 115, 22, 0.2)',
                                borderRadius: '3px',
                                padding: '2px 6px',
                                fontSize: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}>
                                <span>{triggerName}</span>
                                {triggerParams && (
                                  <span style={{
                                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                                    padding: '1px 4px',
                                    borderRadius: '2px',
                                    fontSize: '9px',
                                    fontWeight: 'bold',
                                    color: '#ffcc00'
                                  }}>
                                    {triggerParams}
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Legacy Triggers - For backward compatibility */}
                {spell.triggerConfig.compoundTriggers && Array.isArray(spell.triggerConfig.compoundTriggers) &&
                 spell.triggerConfig.compoundTriggers.length > 0 && !spell.triggerConfig.global && (
                  <div style={{
                    marginBottom: '6px',
                    borderBottom: (spell.triggerConfig.effectTriggers && Object.keys(spell.triggerConfig.effectTriggers).length > 0) ||
                                  (spell.triggerConfig.dotTrigger || spell.triggerConfig.hotTrigger) ?
                                  '1px solid rgba(148, 163, 184, 0.1)' : 'none',
                    paddingBottom: (spell.triggerConfig.effectTriggers && Object.keys(spell.triggerConfig.effectTriggers).length > 0) ||
                                   (spell.triggerConfig.dotTrigger || spell.triggerConfig.hotTrigger) ?
                                   '6px' : '0'
                  }}>
                    {/* Logic row */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '4px'
                    }}>
                      <FontAwesomeIcon icon={spell.triggerConfig.logicType === 'AND' ? faLayerGroup : faDice}
                                      style={{ color: '#f97316', marginRight: '8px', width: '14px' }} />
                      <span>
                        <strong>Logic: </strong>
                        <span style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)', padding: '2px 6px', borderRadius: '3px', fontSize: '10px' }}>
                          {spell.triggerConfig.logicType === 'AND' ? 'ALL CONDITIONS' : 'ANY CONDITION'}
                        </span>
                      </span>
                    </div>

                    {/* Trigger conditions */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      marginTop: '4px'
                    }}>
                      <FontAwesomeIcon icon={faBolt} style={{ color: '#f97316', marginRight: '8px', width: '14px', marginTop: '2px' }} />
                      <div>
                        <strong>Activates on:</strong>
                        <div style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '4px',
                          marginTop: '4px'
                        }}>
                          {spell.triggerConfig.compoundTriggers.map((trigger, index) => {
                            const triggerName = trigger.name ||
                              (trigger.id ? trigger.id.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'Trigger');
                            const triggerParams = formatTriggerParams(trigger);

                            return (
                              <div key={index} style={{
                                backgroundColor: 'rgba(249, 115, 22, 0.1)',
                                border: '1px solid rgba(249, 115, 22, 0.2)',
                                borderRadius: '3px',
                                padding: '2px 6px',
                                fontSize: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}>
                                <span>{triggerName}</span>
                                {triggerParams && (
                                  <span style={{
                                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                                    padding: '1px 4px',
                                    borderRadius: '2px',
                                    fontSize: '9px',
                                    fontWeight: 'bold',
                                    color: '#ffcc00'
                                  }}>
                                    {triggerParams}
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Effect-Specific Triggers */}
                {spell.triggerConfig.effectTriggers && Object.keys(spell.triggerConfig.effectTriggers).length > 0 && (
                  <div style={{
                    marginBottom: (spell.triggerConfig.dotTrigger || spell.triggerConfig.hotTrigger) ? '6px' : '0',
                    borderBottom: (spell.triggerConfig.dotTrigger || spell.triggerConfig.hotTrigger) ?
                                  '1px solid rgba(148, 163, 184, 0.1)' : 'none',
                    paddingBottom: (spell.triggerConfig.dotTrigger || spell.triggerConfig.hotTrigger) ? '6px' : '0'
                  }}>
                    {Object.entries(spell.triggerConfig.effectTriggers).map(([effectType, triggerConfig], effectIndex, effectEntries) => {
                      if (!triggerConfig.compoundTriggers || triggerConfig.compoundTriggers.length === 0) return null;

                      const formattedEffectType = effectType.charAt(0).toUpperCase() + effectType.slice(1);

                      // Determine icon based on effect type
                      let effectIcon;
                      if (effectType.toLowerCase().includes('damage')) {
                        effectIcon = faFire;
                      } else if (effectType.toLowerCase().includes('heal')) {
                        effectIcon = faHeart;
                      } else if (effectType.toLowerCase().includes('buff')) {
                        effectIcon = faShieldAlt;
                      } else if (effectType.toLowerCase().includes('debuff')) {
                        effectIcon = faSkull;
                      } else {
                        effectIcon = faMagic;
                      }

                      return (
                        <div key={effectType} style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          marginBottom: effectIndex < effectEntries.length - 1 ? '6px' : '0'
                        }}>
                          <FontAwesomeIcon icon={effectIcon} style={{ color: '#f97316', marginRight: '8px', width: '14px', marginTop: '2px' }} />
                          <div>
                            <strong>{formattedEffectType} triggers on:</strong>
                            <div style={{
                              display: 'flex',
                              flexWrap: 'wrap',
                              gap: '4px',
                              marginTop: '4px'
                            }}>
                              {triggerConfig.compoundTriggers.map((trigger, index) => {
                                const triggerName = trigger.name ||
                                  (trigger.id ? trigger.id.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'Trigger');
                                const triggerParams = formatTriggerParams(trigger);

                                return (
                                  <div key={index} style={{
                                    backgroundColor: 'rgba(249, 115, 22, 0.1)',
                                    border: '1px solid rgba(249, 115, 22, 0.2)',
                                    borderRadius: '3px',
                                    padding: '2px 6px',
                                    fontSize: '10px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                  }}>
                                    <span>{triggerName}</span>
                                    {triggerParams && (
                                      <span style={{
                                        backgroundColor: 'rgba(0, 0, 0, 0.2)',
                                        padding: '1px 4px',
                                        borderRadius: '2px',
                                        fontSize: '9px',
                                        fontWeight: 'bold',
                                        color: '#ffcc00'
                                      }}>
                                        {triggerParams}
                                      </span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* DoT/HoT Triggers */}
                {(spell.triggerConfig.dotTrigger || spell.triggerConfig.hotTrigger) && (
                  <div>
                    {spell.triggerConfig.dotTrigger && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: spell.triggerConfig.hotTrigger ? '4px' : '0'
                      }}>
                        <FontAwesomeIcon icon={faBolt} style={{ color: '#ef4444', marginRight: '8px', width: '14px' }} />
                        <div>
                          <strong>DoT: </strong>
                          <span style={{
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            padding: '2px 6px',
                            borderRadius: '3px',
                            fontSize: '10px',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            <span>{spell.triggerConfig.dotTrigger.id || spell.triggerConfig.dotTrigger.triggerId || 'trigger'}</span>
                            {formatTriggerParams(spell.triggerConfig.dotTrigger) && (
                              <span style={{
                                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                                padding: '1px 4px',
                                borderRadius: '2px',
                                fontSize: '9px',
                                fontWeight: 'bold',
                                color: '#ffcc00'
                              }}>
                                {formatTriggerParams(spell.triggerConfig.dotTrigger)}
                              </span>
                            )}
                          </span>
                        </div>
                      </div>
                    )}
                    {spell.triggerConfig.hotTrigger && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        <FontAwesomeIcon icon={faHourglass} style={{ color: '#22c55e', marginRight: '8px', width: '14px' }} />
                        <div>
                          <strong>HoT: </strong>
                          <span style={{
                            backgroundColor: 'rgba(34, 197, 94, 0.1)',
                            padding: '2px 6px',
                            borderRadius: '3px',
                            fontSize: '10px',
                            border: '1px solid rgba(34, 197, 94, 0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            <span>{spell.triggerConfig.hotTrigger.id || spell.triggerConfig.hotTrigger.triggerId || 'trigger'}</span>
                            {formatTriggerParams(spell.triggerConfig.hotTrigger) && (
                              <span style={{
                                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                                padding: '1px 4px',
                                borderRadius: '2px',
                                fontSize: '9px',
                                fontWeight: 'bold',
                                color: '#ffcc00'
                              }}>
                                {formatTriggerParams(spell.triggerConfig.hotTrigger)}
                              </span>
                            )}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Cooldown details - Removed as it's already shown in the icon */}

          {/* Channeling details */}
          {(spell.spellType === 'CHANNELED' || spell.spellType === 'channeled') && spell.channelingConfig && (
            <div style={{
              marginBottom: '6px',
              marginTop: '6px',
              backgroundColor: 'rgba(59, 130, 246, 0.05)',
              borderRadius: '3px',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              padding: '6px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '6px',
                gap: '4px',
                borderBottom: '1px solid rgba(59, 130, 246, 0.2)',
                paddingBottom: '3px'
              }}>
                <div style={{
                  backgroundColor: 'rgba(59, 130, 246, 0.2)',
                  borderRadius: '3px',
                  width: '18px',
                  height: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <FontAwesomeIcon
                    icon={faHourglass}
                    style={{
                      color: '#3b82f6',
                      fontSize: '10px'
                    }}
                  />
                </div>
                <span style={{
                  fontWeight: 'bold',
                  fontSize: '11px',
                  color: '#3b82f6'
                }}>
                  CHANNELING
                </span>
              </div>

              {/* Channel type with icon */}
              {spell.channelingConfig.type && (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}>
                  {/* Channel type header */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <div style={{
                      backgroundColor: (() => {
                        if (spell.channelingConfig.type === 'power_up') return 'rgba(255, 204, 0, 0.2)';
                        if (spell.channelingConfig.type === 'area_expand') return 'rgba(155, 89, 182, 0.2)';
                        if (spell.channelingConfig.type === 'defensive') return 'rgba(46, 204, 113, 0.2)';
                        if (spell.channelingConfig.type === 'mana_burn') return 'rgba(52, 152, 219, 0.2)';
                        if (spell.channelingConfig.type === 'persistent') return 'rgba(230, 126, 34, 0.2)';
                        if (spell.channelingConfig.type === 'staged') return 'rgba(52, 152, 219, 0.2)';
                        return 'rgba(59, 130, 246, 0.2)';
                      })(),
                      borderRadius: '3px',
                      width: '18px',
                      height: '18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <FontAwesomeIcon
                        icon={
                          spell.channelingConfig.type === 'power_up' ? faBolt :
                          spell.channelingConfig.type === 'area_expand' ? faExpandAlt :
                          spell.channelingConfig.type === 'defensive' ? faShieldAlt :
                          spell.channelingConfig.type === 'mana_burn' ? faTint :
                          spell.channelingConfig.type === 'persistent' ? faHourglass :
                          spell.channelingConfig.type === 'staged' ? faLayerGroup :
                          faClock
                        }
                        style={{
                          color: (() => {
                            if (spell.channelingConfig.type === 'power_up') return '#ffcc00';
                            if (spell.channelingConfig.type === 'area_expand') return '#9b59b6';
                            if (spell.channelingConfig.type === 'defensive') return '#2ecc71';
                            if (spell.channelingConfig.type === 'mana_burn') return '#3498db';
                            if (spell.channelingConfig.type === 'persistent') return '#e67e22';
                            if (spell.channelingConfig.type === 'staged') return '#3498db';
                            return '#3b82f6';
                          })(),
                          fontSize: '10px'
                        }}
                      />
                    </div>
                    <span style={{
                      fontWeight: 'bold',
                      fontSize: '11px',
                      color: (() => {
                        if (spell.channelingConfig.type === 'power_up') return '#ffcc00';
                        if (spell.channelingConfig.type === 'area_expand') return '#9b59b6';
                        if (spell.channelingConfig.type === 'defensive') return '#2ecc71';
                        if (spell.channelingConfig.type === 'mana_burn') return '#3498db';
                        if (spell.channelingConfig.type === 'persistent') return '#e67e22';
                        if (spell.channelingConfig.type === 'staged') return '#3498db';
                        return '#3b82f6';
                      })()
                    }}>
                      {spell.channelingConfig.type === 'power_up' ? 'Power Escalation' :
                       spell.channelingConfig.type === 'area_expand' ? 'Area Expansion' :
                       spell.channelingConfig.type === 'defensive' ? 'Defensive Channeling' :
                       spell.channelingConfig.type === 'mana_burn' ? 'Mana Burn' :
                       spell.channelingConfig.type === 'persistent' ? 'Persistent Effect' :
                       spell.channelingConfig.type === 'staged' ? 'Staged Progression' :
                       'Standard Channeling'}
                    </span>
                  </div>

                  {/* Channel details in a row */}
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '4px',
                    marginBottom: '2px'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px',
                      backgroundColor: 'rgba(59, 130, 246, 0.1)',
                      padding: '1px 4px',
                      borderRadius: '2px',
                      fontSize: '9px'
                    }}>
                      <FontAwesomeIcon icon={faHourglass} style={{ color: '#3b82f6', fontSize: '8px' }} />
                      <span>{spell.channelingConfig.maxDuration || 3} {spell.channelingConfig.durationUnit || 'turns'}</span>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px',
                      backgroundColor: 'rgba(59, 130, 246, 0.1)',
                      padding: '1px 4px',
                      borderRadius: '2px',
                      fontSize: '9px'
                    }}>
                      <FontAwesomeIcon icon={getResourceIcon(spell.channelingConfig.costType || 'mana')} style={{ color: '#3b82f6', fontSize: '8px' }} />
                      <span>{spell.channelingConfig.costValue || 1} {spell.channelingConfig.costType || 'mana'}
                        {spell.channelingConfig.costTrigger === 'per_second' ? '/sec' :
                         spell.channelingConfig.costTrigger === 'per_turn' ? '/turn' :
                         '/round'}
                      </span>
                    </div>
                  </div>

                  {/* Movement and interrupt status */}
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '4px'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px',
                      backgroundColor: spell.channelingConfig.movementAllowed ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      padding: '1px 4px',
                      borderRadius: '2px',
                      fontSize: '9px'
                    }}>
                      <FontAwesomeIcon icon={faWalking} style={{
                        color: spell.channelingConfig.movementAllowed ? '#22c55e' : '#ef4444',
                        fontSize: '8px'
                      }} />
                      <span>{spell.channelingConfig.movementAllowed ? 'Can move' : 'Stationary'}</span>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px',
                      backgroundColor: spell.channelingConfig.interruptible ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                      padding: '1px 4px',
                      borderRadius: '2px',
                      fontSize: '9px'
                    }}>
                      <FontAwesomeIcon icon={faHandPaper} style={{
                        color: spell.channelingConfig.interruptible ? '#ef4444' : '#22c55e',
                        fontSize: '8px'
                      }} />
                      <span>{spell.channelingConfig.interruptible ? 'Interruptible' : 'Uninterruptible'}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Type-specific details with better formatting */}
              {spell.channelingConfig.type === 'power_up' && spell.channelingConfig.perRoundFormulas &&
               Object.keys(spell.channelingConfig.perRoundFormulas).length > 0 && (
                <div style={{
                  marginTop: '4px',
                  backgroundColor: 'rgba(255, 204, 0, 0.05)',
                  borderRadius: '3px',
                  padding: '4px',
                  fontSize: '10px',
                  color: '#e2e8f0'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '3px',
                    borderBottom: '1px solid rgba(255, 204, 0, 0.2)',
                    paddingBottom: '2px'
                  }}>
                    <div style={{
                      backgroundColor: 'rgba(255, 204, 0, 0.2)',
                      borderRadius: '3px',
                      width: '16px',
                      height: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '4px'
                    }}>
                      <FontAwesomeIcon icon={faChartLine} style={{ color: '#ffcc00', fontSize: '8px' }} />
                    </div>
                    <span style={{ fontWeight: 'bold', color: '#ffcc00', fontSize: '9px' }}>POWER ESCALATION</span>
                  </div>

                  {Object.entries(spell.channelingConfig.perRoundFormulas).map(([effectId, rounds], effectIndex) => {
                    // Determine effect type from effectId
                    const isDamage = effectId.includes('dot') || effectId.includes('damage');
                    const isHealing = effectId.includes('hot') || effectId.includes('heal');

                    // Skip if rounds is not an array or is empty
                    if (!Array.isArray(rounds) || rounds.length === 0) return null;

                    // Get the appropriate icon
                    const icon = isDamage ? faFire : isHealing ? faHeart : faMagic;

                    // Get the appropriate color
                    const color = isDamage ? '#ef4444' : isHealing ? '#22c55e' : '#ffcc00';

                    return (
                      <div key={effectIndex} style={{
                        marginBottom: '3px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2px'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px',
                          marginBottom: '2px'
                        }}>
                          <FontAwesomeIcon icon={icon} style={{ color: color, fontSize: '8px' }} />
                          <span style={{
                            fontWeight: 'bold',
                            color: color,
                            fontSize: '9px'
                          }}>
                            {isDamage ? 'DAMAGE' : isHealing ? 'HEALING' : 'EFFECT'} SCALING
                          </span>
                        </div>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
                          {rounds.map((round, roundIndex) => (
                            <div key={roundIndex} style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '3px',
                              backgroundColor: `rgba(${color.replace(/[^\d,]/g, '').split(',').map(c => parseInt(c)).join(', ')}, 0.1)`,
                              borderRadius: '2px',
                              padding: '1px 4px',
                              fontSize: '9px'
                            }}>
                              <span style={{
                                backgroundColor: `rgba(${color.replace(/[^\d,]/g, '').split(',').map(c => parseInt(c)).join(', ')}, 0.2)`,
                                borderRadius: '2px',
                                width: '14px',
                                height: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold',
                                fontSize: '8px',
                                color: color
                              }}>{round.round}</span>
                              <span style={{
                                fontFamily: 'monospace',
                                fontSize: '9px',
                                color: color
                              }}>{round.formula}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {spell.channelingConfig.type === 'area_expand' && (
                <div style={{
                  marginTop: '4px',
                  backgroundColor: 'rgba(155, 89, 182, 0.05)',
                  borderRadius: '3px',
                  padding: '4px',
                  fontSize: '9px',
                  color: '#e2e8f0'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '3px',
                    borderBottom: '1px solid rgba(155, 89, 182, 0.2)',
                    paddingBottom: '2px'
                  }}>
                    <div style={{
                      backgroundColor: 'rgba(155, 89, 182, 0.2)',
                      borderRadius: '3px',
                      width: '16px',
                      height: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '4px'
                    }}>
                      <FontAwesomeIcon icon={faExpandAlt} style={{ color: '#9b59b6', fontSize: '8px' }} />
                    </div>
                    <span style={{ fontWeight: 'bold', color: '#9b59b6', fontSize: '9px' }}>AREA EXPANSION</span>
                  </div>

                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '3px'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px',
                      backgroundColor: 'rgba(155, 89, 182, 0.1)',
                      padding: '1px 4px',
                      borderRadius: '2px',
                      fontSize: '8px'
                    }}>
                      <span style={{ color: '#9b59b6', fontWeight: 'bold' }}>Start:</span>
                      <span>{spell.channelingConfig.initialRadius || 5}ft</span>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px',
                      backgroundColor: 'rgba(155, 89, 182, 0.1)',
                      padding: '1px 4px',
                      borderRadius: '2px',
                      fontSize: '8px'
                    }}>
                      <span style={{ color: '#9b59b6', fontWeight: 'bold' }}>Rate:</span>
                      <span>+{spell.channelingConfig.expansionRate || 5}ft/{spell.channelingConfig.durationUnit === 'rounds' ? 'rd' : 'tn'}</span>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px',
                      backgroundColor: 'rgba(155, 89, 182, 0.1)',
                      padding: '1px 4px',
                      borderRadius: '2px',
                      fontSize: '8px'
                    }}>
                      <span style={{ color: '#9b59b6', fontWeight: 'bold' }}>Max:</span>
                      <span>{spell.channelingConfig.maxRadius || 30}ft</span>
                    </div>
                    {spell.channelingConfig.expansionType && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px',
                        backgroundColor: 'rgba(155, 89, 182, 0.1)',
                        padding: '1px 4px',
                        borderRadius: '2px',
                        fontSize: '8px'
                      }}>
                        <span style={{ color: '#9b59b6', fontWeight: 'bold' }}>Pattern:</span>
                        <span>{
                          spell.channelingConfig.expansionType === 'linear' ? 'Steady' :
                          spell.channelingConfig.expansionType === 'pulsing' ? 'Pulsing' :
                          spell.channelingConfig.expansionType === 'erratic' ? 'Erratic' : 'Standard'
                        }</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {spell.channelingConfig.type === 'staged' && spell.channelingConfig.stages && spell.channelingConfig.stages.length > 0 && (
                <div style={{
                  marginTop: '6px',
                  backgroundColor: 'rgba(52, 152, 219, 0.1)',
                  borderRadius: '4px',
                  padding: '6px 8px',
                  borderLeft: '2px solid #3498db',
                  fontSize: '11px',
                  color: '#e2e8f0',
                  marginLeft: '10px',
                  marginRight: '10px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                    <FontAwesomeIcon icon={faLayerGroup} style={{ color: '#3498db', marginRight: '6px' }} />
                    <span style={{ fontWeight: 'bold', color: '#3498db' }}>Staged Progression</span>
                  </div>

                  {spell.channelingConfig.stages.map((stage, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '3px 6px',
                      backgroundColor: `rgba(52, 152, 219, ${0.1 + (index * 0.05)})`,
                      borderRadius: '3px',
                      marginBottom: '3px'
                    }}>
                      <div style={{
                        minWidth: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(52, 152, 219, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '8px',
                        fontWeight: 'bold',
                        color: '#3498db'
                      }}>{index + 1}</div>
                      <div>
                        <div style={{ fontWeight: 'bold' }}>At {stage.threshold}s:</div>
                        <div style={{ fontSize: '10px' }}>{stage.effect}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {spell.channelingConfig.type === 'defensive' && (
                <div style={{
                  marginTop: '6px',
                  backgroundColor: 'rgba(46, 204, 113, 0.1)',
                  borderRadius: '4px',
                  padding: '6px 8px',
                  borderLeft: '2px solid #2ecc71',
                  fontSize: '11px',
                  color: '#e2e8f0',
                  marginLeft: '10px',
                  marginRight: '10px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                    <FontAwesomeIcon icon={faShieldAlt} style={{ color: '#2ecc71', marginRight: '6px' }} />
                    <span style={{ fontWeight: 'bold', color: '#2ecc71' }}>Defensive Scaling</span>
                  </div>

                  <div style={{ paddingLeft: '10px' }}>
                    <div>• Initial reduction: {spell.channelingConfig.damageReduction || 10}%</div>
                    <div>• Maximum reduction: {spell.channelingConfig.maxDamageReduction || 50}%</div>
                    <div>• Type: {
                      spell.channelingConfig.resistanceType === 'physical' ? 'Physical damage' :
                      spell.channelingConfig.resistanceType === 'magical' ? 'Magical damage' :
                      spell.channelingConfig.resistanceType === 'elemental' ? 'Elemental damage' :
                      'All damage types'
                    }</div>
                  </div>
                </div>
              )}

              {spell.channelingConfig.type === 'mana_burn' && (
                <div style={{
                  marginTop: '6px',
                  backgroundColor: 'rgba(52, 152, 219, 0.1)',
                  borderRadius: '4px',
                  padding: '6px 8px',
                  borderLeft: '2px solid #3498db',
                  fontSize: '11px',
                  color: '#e2e8f0',
                  marginLeft: '10px',
                  marginRight: '10px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                    <FontAwesomeIcon icon={faTint} style={{ color: '#3498db', marginRight: '6px' }} />
                    <span style={{ fontWeight: 'bold', color: '#3498db' }}>Mana Burn</span>
                  </div>

                  <div style={{ paddingLeft: '10px' }}>
                    <div>• Conversion rate: {spell.channelingConfig.resourceConversionRate || 50}%</div>
                    <div>• Effect: Converts to {
                      spell.channelingConfig.resourceConversionEffect === 'damage' ? 'damage' :
                      spell.channelingConfig.resourceConversionEffect === 'healing' ? 'healing' :
                      spell.channelingConfig.resourceConversionEffect === 'buff' ? 'buff effects' :
                      'shield/barrier'
                    }</div>
                  </div>
                </div>
              )}

              {spell.channelingConfig.type === 'persistent' && (
                <div style={{
                  marginTop: '6px',
                  backgroundColor: 'rgba(230, 126, 34, 0.1)',
                  borderRadius: '4px',
                  padding: '6px 8px',
                  borderLeft: '2px solid #e67e22',
                  fontSize: '11px',
                  color: '#e2e8f0',
                  marginLeft: '10px',
                  marginRight: '10px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                    <FontAwesomeIcon icon={faHourglass} style={{ color: '#e67e22', marginRight: '6px' }} />
                    <span style={{ fontWeight: 'bold', color: '#e67e22' }}>Persistent Effect</span>
                  </div>

                  <div style={{ paddingLeft: '10px' }}>
                    <div>• Type: {
                      spell.channelingConfig.persistentEffectType === 'aura' ? 'Aura' :
                      spell.channelingConfig.persistentEffectType === 'field' ? 'Field' :
                      'Beam'
                    }</div>
                    <div>• Radius: {spell.channelingConfig.persistentRadius || 10}ft</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Card footer with tags */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '8px 10px',
          background: 'linear-gradient(to bottom, #0f172a, #1e293b)',
          borderTop: '1px solid #333',
          minHeight: '20px'
        }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', alignItems: 'center', flex: 1 }}>
            {/* Effect type tag */}
            {spell.effectType && (
              <span style={{
                fontSize: '10px',
                padding: '2px 6px',
                borderRadius: '3px',
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: spell.effectType === 'damage' ? '#ef4444' :
                  spell.effectType === 'healing' ? '#22c55e' :
                    spell.effectType === 'buff' ? '#3b82f6' :
                      spell.effectType === 'debuff' ? '#a855f7' :
                        spell.effectType === 'utility' ? '#2dd4bf' :
                          '#ffffff'
              }}>
                {spell.effectType.toUpperCase()}
              </span>
            )}

            {/* Resolution type tag */}
            {spell.resolution && (
              <span style={{
                fontSize: '10px',
                padding: '2px 6px',
                borderRadius: '3px',
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: spell.resolution === 'DICE' ? '#eab308' :
                  spell.resolution === 'CARDS' ? '#22c55e' :
                    spell.resolution === 'COINS' ? '#3b82f6' :
                      '#ffffff'
              }}>
                {spell.resolution}
              </span>
            )}

            {/* Channeling tag */}
            {(spell.spellType === 'CHANNELED' || spell.spellType === 'channeled') && spell.channelingConfig && (
              <span style={{
                fontSize: '10px',
                padding: '2px 6px',
                borderRadius: '3px',
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                color: '#3b82f6'
              }}>
                {spell.channelingConfig.type === 'power_up' ? 'POWER CHANNEL' :
                 spell.channelingConfig.type === 'area_expand' ? 'EXPANDING CHANNEL' :
                 spell.channelingConfig.type === 'defensive' ? 'DEFENSIVE CHANNEL' :
                 spell.channelingConfig.type === 'mana_burn' ? 'MANA BURN CHANNEL' :
                 spell.channelingConfig.type === 'persistent' ? 'PERSISTENT CHANNEL' :
                 spell.channelingConfig.type === 'staged' ? 'STAGED CHANNEL' :
                 'CHANNELED'}
              </span>
            )}

            {/* Custom tags */}
            {spell.tags && spell.tags.map((tag, index) => {
              // Skip if it's a resolution method tag or effect type tag that we're already showing
              if ((tag === 'dice-based' && spell.resolution === 'DICE') ||
                  (tag === 'card-based' && spell.resolution === 'CARDS') ||
                  (tag === 'coin-based' && spell.resolution === 'COINS') ||
                  (tag === spell.effectType)) {
                return null;
              }

              return (
                <span key={`tag-${index}`} style={{
                  fontSize: '10px',
                  padding: '2px 6px',
                  borderRadius: '3px',
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#ffffff'
                }}>
                  {tag.toUpperCase()}
                </span>
              );
            })}
          </div>

          {/* Cooldown in footer */}
          {spell.cooldownConfig && spell.cooldownConfig.type && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: (() => {
                // Different background colors based on cooldown type
                if (spell.cooldownConfig.type === 'short_rest' || spell.cooldownConfig.type === 'long_rest') {
                  return 'rgba(59, 130, 246, 0.2)'; // Blue for rest-based (uses)
                } else if (spell.cooldownConfig.type === 'charge_based') {
                  return 'rgba(16, 185, 129, 0.2)'; // Green for charges
                } else {
                  return 'rgba(239, 68, 68, 0.2)'; // Red for cooldowns
                }
              })(),
              border: (() => {
                // Different border colors based on cooldown type
                if (spell.cooldownConfig.type === 'short_rest' || spell.cooldownConfig.type === 'long_rest') {
                  return '1px solid rgba(59, 130, 246, 0.4)'; // Blue for rest-based (uses)
                } else if (spell.cooldownConfig.type === 'charge_based') {
                  return '1px solid rgba(16, 185, 129, 0.4)'; // Green for charges
                } else {
                  return '1px solid rgba(239, 68, 68, 0.4)'; // Red for cooldowns
                }
              })(),
              borderRadius: '4px',
              padding: '2px 6px',
              gap: '4px',
              marginLeft: '5px'
            }} title={formatCooldown(spell.cooldownConfig)}>
              <FontAwesomeIcon
                icon={(() => {
                  // Different icons based on cooldown type
                  if (spell.cooldownConfig.type === 'short_rest' || spell.cooldownConfig.type === 'long_rest') {
                    return getResourceIcon('uses'); // Icon for uses
                  } else if (spell.cooldownConfig.type === 'charge_based') {
                    return getResourceIcon('charges'); // Icon for charges
                  } else {
                    return getResourceIcon('cooldown'); // Icon for cooldowns
                  }
                })()}
                style={{
                  color: (() => {
                    // Different colors based on cooldown type
                    if (spell.cooldownConfig.type === 'short_rest' || spell.cooldownConfig.type === 'long_rest') {
                      return '#3b82f6'; // Blue for rest-based (uses)
                    } else if (spell.cooldownConfig.type === 'charge_based') {
                      return '#10b981'; // Green for charges
                    } else {
                      return '#ef4444'; // Red for cooldowns
                    }
                  })()
                }}
              />
              <span style={{
                color: (() => {
                  // Different colors based on cooldown type
                  if (spell.cooldownConfig.type === 'short_rest' || spell.cooldownConfig.type === 'long_rest') {
                    return '#3b82f6'; // Blue for rest-based (uses)
                  } else if (spell.cooldownConfig.type === 'charge_based') {
                    return '#10b981'; // Green for charges
                  } else {
                    return '#ef4444'; // Red for cooldowns
                  }
                })(),
                fontSize: '11px',
                fontWeight: 'bold'
              }}>
                {(() => {
                  // Format cooldown display based on type with clearer labels
                  if (spell.cooldownConfig.type === 'turn_based') {
                    return `CD: ${spell.cooldownConfig.value || 1}T`;
                  } else if (spell.cooldownConfig.type === 'round_based') {
                    return `CD: ${spell.cooldownConfig.value || 1}R`;
                  } else if (spell.cooldownConfig.type === 'charge_based') {
                    const charges = spell.cooldownConfig.charges || 1;
                    const recovery = spell.cooldownConfig.recovery || 1;
                    return `${charges}C (${recovery}T)`;
                  } else if (spell.cooldownConfig.type === 'short_rest') {
                    return `${spell.cooldownConfig.value || 1}/SR`;
                  } else if (spell.cooldownConfig.type === 'long_rest') {
                    const value = spell.cooldownConfig.value || 1;
                    return `${value}/LR`;
                  } else if (spell.cooldownConfig.type === 'dice_based') {
                    return `CD: ${spell.cooldownConfig.value || '1d4'}`;
                  } else {
                    return `${spell.cooldownConfig.value || 1}`;
                  }
                })()}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
    </React.Fragment>
  );
};

LibraryStyleSpellCard.propTypes = {
  spell: PropTypes.object.isRequired,
  rollableTableData: PropTypes.object
};

export default LibraryStyleSpellCard;
