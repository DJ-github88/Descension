/**
 * SpellCardUtils.js
 *
 * Utility functions for spell cards that don't depend on any other modules
 * to avoid circular dependencies.
 */

// Helper function to convert complex conditional expressions to plain English
const convertConditionalExpression = (formula, type = 'damage') => {
  if (!formula) return formula;

  const lowerFormula = formula.toLowerCase();

  // Handle "all heads ? X : 0" patterns
  const allHeadsMatch = lowerFormula.match(/all heads\s*\?\s*(\d+)\s*:\s*0/);
  if (allHeadsMatch) {
    const bonus = allHeadsMatch[1];
    return formula.replace(/all heads\s*\?\s*\d+\s*:\s*0/gi, `${bonus} bonus ${type} if all coins are heads`);
  }

  // Handle "X:0" patterns (shorthand ternary)
  const shortTernaryMatch = lowerFormula.match(/(\d+):0/);
  if (shortTernaryMatch) {
    const bonus = shortTernaryMatch[1];
    return formula.replace(/\d+:0/g, `${bonus} bonus if condition is met`);
  }

  // Return the original formula if no patterns match
  return formula;
};

// Convert complex conditional formulas to plain English
const convertComplexConditionalToEnglish = (formula, type = 'damage') => {
  let result = formula;

  // Handle health-based conditions
  result = result.replace(
    /\(currentHealth\s*<\s*maxHealth\s*\/\s*2\s*\?\s*(\d+)\s*:\s*(\d+)\)/gi,
    (match, trueVal, falseVal) => {
      if (falseVal === '0') {
        return `${trueVal} bonus ${type} if current health is less than half of max health`;
      }
      return `${trueVal} ${type} if current health is less than half of max health, otherwise ${falseVal}`;
    }
  );

  // Handle mana-based conditions
  result = result.replace(
    /\(currentMana\s*>\s*maxMana\s*\*\s*0\.75\s*\?\s*(\d+)\s*:\s*(\d+)\)/gi,
    (match, trueVal, falseVal) => {
      return `${trueVal} ${type} if current mana is above 75% of max mana, otherwise ${falseVal}`;
    }
  );

  result = result.replace(
    /\(currentMana\s*>\s*maxMana\s*\/\s*2\s*\?\s*(\d+)\s*:\s*(\d+)\)/gi,
    (match, trueVal, falseVal) => {
      if (falseVal === '0') {
        return `${trueVal} bonus ${type} if current mana is above half of max mana`;
      }
      return `${trueVal} ${type} if current mana is above half of max mana, otherwise ${falseVal}`;
    }
  );

  // Handle resource sacrifice conditions
  result = result.replace(
    /\(currentMana\s*>=\s*(\d+)\s*\?\s*currentMana\s*\/\s*(\d+)\s*:\s*(\d+)\)/gi,
    (match, threshold, divisor, falseVal) => {
      if (falseVal === '0') {
        return `one-${getOrdinal(divisor)} of current mana if you have at least ${threshold} mana`;
      }
      return `one-${getOrdinal(divisor)} of current mana if you have at least ${threshold} mana, otherwise ${falseVal}`;
    }
  );

  // Handle level scaling
  result = result.replace(/level\s*\*\s*(\d+)/gi, (match, multiplier) => {
    return `${multiplier} ${type} per character level`;
  });

  // Handle exhaustion penalties
  result = result.replace(/exhaustionLevel\s*\*\s*(\d+)/gi, (match, multiplier) => {
    return `${multiplier} ${type} penalty per exhaustion level`;
  });

  // Handle action point scaling
  result = result.replace(/currentActionPoints\s*\*\s*(\d+)/gi, (match, multiplier) => {
    return `${multiplier} ${type} per remaining action point`;
  });

  // Convert stat names to proper case
  result = result.replace(/\bintelligence\b/gi, 'Intelligence');
  result = result.replace(/\bstrength\b/gi, 'Strength');
  result = result.replace(/\bagility\b/gi, 'Agility');
  result = result.replace(/\bconstitution\b/gi, 'Constitution');
  result = result.replace(/\bspirit\b/gi, 'Spirit');
  result = result.replace(/\bcharisma\b/gi, 'Charisma');
  result = result.replace(/\bspellDamage\b/gi, 'Spell Damage');
  result = result.replace(/\bhealingPower\b/gi, 'Healing Power');

  // Clean up mathematical operators
  result = result.replace(/\s*\+\s*/g, ' + ');
  result = result.replace(/\s*-\s*/g, ' - ');

  // Handle other ternary patterns as fallback
  const ternaryMatch = result.match(/(.+?)\s*\?\s*(.+?)\s*:\s*(.+)/);
  if (ternaryMatch) {
    const condition = ternaryMatch[1].trim();
    const trueValue = ternaryMatch[2].trim();
    const falseValue = ternaryMatch[3].trim();

    if (falseValue === '0') {
      return `${trueValue} ${type} if ${condition}`;
    } else {
      return `${trueValue} ${type} if ${condition}, otherwise ${falseValue} ${type}`;
    }
  }

  return result;
};

// Helper function to convert numbers to ordinals
const getOrdinal = (num) => {
  const ordinals = {
    '2': 'half',
    '3': 'third',
    '4': 'quarter',
    '5': 'fifth',
    '6': 'sixth',
    '8': 'eighth',
    '10': 'tenth'
  };
  return ordinals[num] || `${num}th`;
};

// Convert technical formulas to plain English descriptions
export const formatFormulaToPlainEnglish = (formula, type = 'damage') => {
  if (!formula || typeof formula !== 'string') {
    return `Variable ${type}`;
  }

  // Clean up the formula
  const cleanFormula = formula.trim();

  // Handle complex conditional formulas first
  if (cleanFormula.includes('?') && cleanFormula.includes(':')) {
    return convertComplexConditionalToEnglish(cleanFormula, type);
  }

  // Handle dice-based formulas - just clean up spacing and return as-is
  const dicePattern = /\d+d\d+/i;
  if (dicePattern.test(cleanFormula)) {
    // This is a dice-based formula, just clean up spacing and formatting
    let cleanedFormula = cleanFormula;

    // Clean up mathematical operators spacing
    cleanedFormula = cleanedFormula.replace(/\s*\+\s*/g, ' + ');
    cleanedFormula = cleanedFormula.replace(/\s*\-\s*/g, ' - ');
    cleanedFormula = cleanedFormula.replace(/\s*\*\s*/g, ' * ');
    cleanedFormula = cleanedFormula.replace(/\s*\/\s*/g, ' / ');

    // Convert underscores to spaces and handle camelCase
    cleanedFormula = cleanedFormula.replace(/_/g, ' ');
    cleanedFormula = cleanedFormula.replace(/([a-z])([A-Z])/g, '$1 $2');

    // Clean up multiple spaces
    cleanedFormula = cleanedFormula.replace(/\s+/g, ' ').trim();

    return cleanedFormula;
  }

  // First, handle conditional expressions
  let processedFormula = convertConditionalExpression(cleanFormula, type);
  if (!processedFormula) {
    processedFormula = cleanFormula || '';
  }
  const lowerFormula = processedFormula.toLowerCase();

  // Handle coin-based formulas
  if (lowerFormula.includes('heads') || lowerFormula.includes('tails')) {
    // Handle complex conditional expressions like "heads × 8 + (all heads ? 15 : 0)"
    if (lowerFormula.includes('heads') && lowerFormula.includes('8') && lowerFormula.includes('all heads') && lowerFormula.includes('15')) {
      return `8 ${type} per head flipped, plus 15 bonus ${type} if all coins are heads`;
    }
    // Handle ternary operator patterns like "15:0" or "15 : 0"
    if (lowerFormula.includes('heads') && lowerFormula.includes('8') && (lowerFormula.includes('15:0') || lowerFormula.includes('15 : 0'))) {
      return `8 ${type} per head flipped, plus 15 bonus ${type} if all coins are heads`;
    }
    if (lowerFormula.includes('heads') && lowerFormula.includes('6') && (lowerFormula.includes('10:0') || lowerFormula.includes('10 : 0'))) {
      return `6 ${type} per head flipped, plus 10 bonus ${type} if all coins are heads`;
    }
    if (lowerFormula.includes('heads') && lowerFormula.includes('4') && (lowerFormula.includes('8:0') || lowerFormula.includes('8 : 0'))) {
      return `4 ${type} per head flipped, plus 8 bonus ${type} if all coins are heads`;
    }
    // Handle streak-based formulas
    if (lowerFormula.includes('heads') && lowerFormula.includes('7') && lowerFormula.includes('longest streak')) {
      return `7 ${type} per head flipped, plus 5 ${type} per streak length if streak is 3 or more`;
    }
    // Generic patterns
    if (lowerFormula.includes('heads') && lowerFormula.includes('8')) {
      return `8 ${type} per head flipped`;
    }
    if (lowerFormula.includes('heads') && lowerFormula.includes('7')) {
      return `7 ${type} per head flipped`;
    }
    if (lowerFormula.includes('heads') && lowerFormula.includes('6')) {
      return `6 ${type} per head flipped`;
    }
    if (lowerFormula.includes('heads') && lowerFormula.includes('5')) {
      return `5 ${type} per head flipped`;
    }
    if (lowerFormula.includes('heads') && lowerFormula.includes('4')) {
      return `4 ${type} per head flipped`;
    }
  }

  // Handle card-based formulas
  if (lowerFormula.includes('card') || lowerFormula.includes('face')) {
    if (lowerFormula.includes('card_value') && lowerFormula.includes('face_card') && lowerFormula.includes('5')) {
      return `${type} equal to card values plus 5 ${type} per face card`;
    }
    if (lowerFormula.includes('card_value') && lowerFormula.includes('face_card') && lowerFormula.includes('3')) {
      return `${type} equal to card values plus 3 ${type} per face card`;
    }
    if (lowerFormula.includes('card_value') && lowerFormula.includes('hearts') && lowerFormula.includes('3')) {
      return `${type} equal to card values plus 3 ${type} per heart`;
    }
    if (lowerFormula.includes('card_value') && lowerFormula.includes('hearts') && lowerFormula.includes('2')) {
      return `${type} equal to card values plus 2 ${type} per heart`;
    }
  }

  // Handle special variable formulas
  if (lowerFormula.includes('health_sacrificed')) {
    if (lowerFormula.includes('6d10') && lowerFormula.includes('0.5')) {
      return `Roll 6d10 for ${type}, then add half of the health you sacrificed`;
    }
    if (lowerFormula.includes('health_sacrificed')) {
      return `${type} based on health sacrificed`;
    }
  }
  if (lowerFormula.includes('damage_dealt')) {
    if (lowerFormula.includes('0.4')) {
      return `40% of damage dealt as ${type}`;
    }
    if (lowerFormula.includes('0.5')) {
      return `50% of damage dealt as ${type}`;
    }
    if (lowerFormula.includes('0.3')) {
      return `30% of damage dealt as ${type}`;
    }
    return `${type} based on damage dealt`;
  }

  // If we've processed the formula and it's different, return it
  if (processedFormula !== formula) {
    // Apply CAPS_CAPS formatting to the processed formula
    let finalFormula = processedFormula;

    // Apply the same CAPS_CAPS conversion as in formatFormulaToReadableText
    finalFormula = finalFormula.replace(/\b[A-Z][A-Z_]+[A-Z]\b/g, (match) => {
      // Skip if it's already been converted or is a known abbreviation
      if (match.includes(' ') || ['HP', 'MP', 'AP', 'XP', 'INT', 'STR', 'DEX', 'CON', 'WIS', 'CHA', 'HEA'].includes(match)) {
        return match;
      }
      return convertCapsToReadable(match);
    });

    return finalFormula;
  }

  // Fallback to technical conversion for other formulas
  return formatFormulaToReadableText(processedFormula);
};

// Helper function to convert CAPS_CAPS format to readable text
const convertCapsToReadable = (text) => {
  return text
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

// Helper function to convert stat names to readable format
const convertStatToReadable = (stat) => {
  const statLower = stat.toLowerCase();
  const statMap = {
    'int': 'Intelligence',
    'intelligence': 'Intelligence',
    'str': 'Strength',
    'strength': 'Strength',
    'agi': 'Agility',
    'agility': 'Agility',
    'con': 'Constitution',
    'constitution': 'Constitution',
    'spi': 'Spirit',
    'spirit': 'Spirit',
    'cha': 'Charisma',
    'charisma': 'Charisma',
    'hea': 'Healing Power',
    'healingpower': 'Healing Power',
    'spelldamage': 'Spell Damage',
    'damage': 'Physical Damage',
    'rangeddamage': 'Ranged Damage',
    'armor': 'Armor',
    'maxhealth': 'max health',
    'maxmana': 'max mana',
    'currenthealth': 'current health',
    'currentmana': 'current mana',
    'strengthmod': 'Strength modifier',
    'agilitymod': 'Agility modifier',
    'constitutionmod': 'Constitution modifier',
    'intelligencemod': 'Intelligence modifier',
    'spiritmod': 'Spirit modifier',
    'charismamod': 'Charisma modifier',
    // Spell damage types
    'firedamage': 'Fire Damage',
    'frostdamage': 'Frost Damage',
    'arcanedamage': 'Arcane Damage',
    'poisondamage': 'Poison Damage',
    'holydamage': 'Holy Damage',
    'shadowdamage': 'Shadow Damage',
    'naturedamage': 'Nature Damage',
    'lightningdamage': 'Lightning Damage',
    // Special variables
    'roundnumber': 'round number',
    'turnnumber': 'turn number',
    'level': 'caster level'
  };

  return statMap[statLower] || stat.charAt(0).toUpperCase() + stat.slice(1);
};

// Convert technical formulas to readable text (legacy function for backwards compatibility)
export const formatFormulaToReadableText = (formula, drawCount = 4) => {
  if (!formula || typeof formula !== 'string') {
    return 'Variable effect';
  }

  // Clean up the formula
  const cleanFormula = formula.trim();

  // Handle simple dice formulas with conversational language
  const simpleDicePattern = /^(\d+d\d+)(\s*\+\s*\w+)?$/i;
  if (simpleDicePattern.test(cleanFormula)) {
    const match = cleanFormula.match(/^(\d+d\d+)(\s*\+\s*(\w+))?$/i);
    if (match) {
      const dice = match[1];
      const stat = match[3];

      if (stat) {
        const statName = convertStatToReadable(stat);
        return `Roll ${dice} + ${statName}`;
      } else {
        return `Roll ${dice}`;
      }
    }
  }

  // Handle dice + stat patterns with conversational language
  const diceStatPattern = /(\d+d\d+)\s*\+\s*(\w+)/i;
  const diceMatch = cleanFormula.match(diceStatPattern);
  if (diceMatch) {
    const dice = diceMatch[1];
    const stat = diceMatch[2];
    const statName = convertStatToReadable(stat);
    return `Roll ${dice} + ${statName}`;
  }

  // Handle dice + multiple stats
  const diceMultiStatPattern = /(\d+d\d+)\s*\+\s*(\w+)\s*\+\s*(\w+)/i;
  const multiMatch = cleanFormula.match(diceMultiStatPattern);
  if (multiMatch) {
    const dice = multiMatch[1];
    const stat1 = convertStatToReadable(multiMatch[2]);
    const stat2 = convertStatToReadable(multiMatch[3]);
    return `Roll ${dice} + ${stat1} + ${stat2}`;
  }

  // Handle dice with numeric modifiers
  const diceNumPattern = /(\d+d\d+)\s*\+\s*(\d+)/i;
  const numMatch = cleanFormula.match(diceNumPattern);
  if (numMatch) {
    const dice = numMatch[1];
    const bonus = numMatch[2];
    return `Cast ${dice}, focus +${bonus}`;
  }

  // Handle just dice notation
  const diceOnlyPattern = /^(\d+d\d+)$/i;
  const diceOnlyMatch = cleanFormula.match(diceOnlyPattern);
  if (diceOnlyMatch) {
    return `Cast ${diceOnlyMatch[1]}`;
  }

  // Handle card-based formulas with conversational language
  if (cleanFormula.includes('CARD_VALUE')) {
    const cardStatPattern = /CARD_VALUE\s*\+\s*(\w+)/i;
    const cardMatch = cleanFormula.match(cardStatPattern);
    if (cardMatch) {
      const stat = convertStatToReadable(cardMatch[1]);
      return `Draw cards + ${stat}`;
    }
    return 'Draw cards for damage';
  }

  // Handle coin-based formulas with conversational language
  if (cleanFormula.includes('HEADS_COUNT')) {
    const coinStatPattern = /HEADS_COUNT\s*\*\s*(\d+)\s*\+\s*(\w+)/i;
    const coinMatch = cleanFormula.match(coinStatPattern);
    if (coinMatch) {
      const multiplier = coinMatch[1];
      const stat = convertStatToReadable(coinMatch[2]);
      return `Flip fate coins, ${multiplier} per heads + ${stat}`;
    }
    const coinSimplePattern = /HEADS_COUNT\s*\*\s*(\d+)/i;
    const simpleMatch = cleanFormula.match(coinSimplePattern);
    if (simpleMatch) {
      const multiplier = simpleMatch[1];
      return `Flip fate coins, ${multiplier} per heads`;
    }
    return 'Flip coins for damage';
  }

  // Convert common formula patterns to readable text
  let readableText = cleanFormula;

  // Card-based formulas - more conversational
  readableText = readableText.replace(/CARD_VALUE/g, 'card values');
  readableText = readableText.replace(/FACE_CARDS/g, 'face cards drawn');
  readableText = readableText.replace(/ACES/g, 'aces drawn');
  readableText = readableText.replace(/HIGHEST_CARD/g, 'highest card value');
  readableText = readableText.replace(/RED_COUNT/g, 'red cards drawn');
  readableText = readableText.replace(/BLACK_COUNT/g, 'black cards drawn');

  // Coin-based formulas - more conversational
  readableText = readableText.replace(/HEADS_COUNT/g, 'heads flipped');
  readableText = readableText.replace(/TAILS_COUNT/g, 'tails flipped');
  readableText = readableText.replace(/ALL_HEADS/g, 'all coins are heads');
  readableText = readableText.replace(/ALL_TAILS/g, 'all coins are tails');
  readableText = readableText.replace(/LONGEST_STREAK/g, 'longest streak');
  readableText = readableText.replace(/ALTERNATING_PATTERN/g, 'alternating pattern');

  // Convert stat names to thematic format
  readableText = readableText.replace(/\b(intelligence|INT)\b/gi, 'Intelligence');
  readableText = readableText.replace(/\b(healingpower|healingPower|HEA)\b/gi, 'Healing Power');
  readableText = readableText.replace(/\b(strength|STR)\b/gi, 'Strength');
  readableText = readableText.replace(/\b(agility|AGI)\b/gi, 'Agility');
  readableText = readableText.replace(/\b(constitution|CON)\b/gi, 'Constitution');
  readableText = readableText.replace(/\b(spirit|SPI)\b/gi, 'Spirit');
  readableText = readableText.replace(/\b(charisma|CHA)\b/gi, 'Charisma');
  readableText = readableText.replace(/\b(damage)\b/gi, 'might');
  readableText = readableText.replace(/\b(rangeddamage|rangedDamage)\b/gi, 'precision');
  readableText = readableText.replace(/\b(armor)\b/gi, 'defense');
  readableText = readableText.replace(/\b(maxhealth|maxHealth)\b/gi, 'max health');
  readableText = readableText.replace(/\b(maxmana|maxMana)\b/gi, 'max mana');
  readableText = readableText.replace(/\b(currenthealth|currentHealth)\b/gi, 'current health');
  readableText = readableText.replace(/\b(currentmana|currentMana)\b/gi, 'current mana');
  readableText = readableText.replace(/\b(roundnumber|roundNumber)\b/gi, 'round number');
  readableText = readableText.replace(/\b(turnnumber|turnNumber)\b/gi, 'turn number');

  // Convert spell damage types to thematic format
  readableText = readableText.replace(/\b(firedamage|fireDamage)\b/gi, 'flame mastery');
  readableText = readableText.replace(/\b(frostdamage|frostDamage)\b/gi, 'frost mastery');
  readableText = readableText.replace(/\b(arcanedamage|arcaneDamage)\b/gi, 'arcane mastery');
  readableText = readableText.replace(/\b(poisondamage|poisonDamage)\b/gi, 'toxin mastery');
  readableText = readableText.replace(/\b(holydamage|holyDamage)\b/gi, 'divine mastery');
  readableText = readableText.replace(/\b(shadowdamage|shadowDamage)\b/gi, 'shadow mastery');
  readableText = readableText.replace(/\b(naturedamage|natureDamage)\b/gi, 'nature mastery');
  readableText = readableText.replace(/\b(lightningdamage|lightningDamage)\b/gi, 'storm mastery');
  readableText = readableText.replace(/\b(spelldamage|spellDamage)\b/gi, 'spell mastery');

  // Handle mathematical operators more thematically
  readableText = readableText.replace(/\s*\+\s*/g, ' + ');
  readableText = readableText.replace(/\s*\-\s*/g, ' - ');
  readableText = readableText.replace(/\s*\*\s*/g, ' × ');
  readableText = readableText.replace(/\s*\/\s*/g, ' ÷ ');

  // Clean up multiple spaces and capitalize first letter
  readableText = readableText.replace(/\s+/g, ' ').trim();
  if (readableText.length > 0) {
    readableText = readableText.charAt(0).toUpperCase() + readableText.slice(1);
  }

  // Technical variables to readable format - comprehensive list
  readableText = readableText.replace(/HEALTH_SACRIFICED/g, 'Health Sacrificed');
  readableText = readableText.replace(/DAMAGE_DEALT/g, 'Damage Dealt');
  readableText = readableText.replace(/HEALING_DONE/g, 'Healing Done');
  readableText = readableText.replace(/MANA_SPENT/g, 'Mana Spent');
  readableText = readableText.replace(/STAMINA_USED/g, 'Stamina Used');
  readableText = readableText.replace(/CASTER_LEVEL/g, 'Caster Level');
  readableText = readableText.replace(/TARGET_LEVEL/g, 'Target Level');
  readableText = readableText.replace(/SPELL_LEVEL/g, 'Spell Level');
  readableText = readableText.replace(/CURRENT_HP/g, 'Current HP');
  readableText = readableText.replace(/MAX_HP/g, 'Max HP');
  readableText = readableText.replace(/MISSING_HP/g, 'Missing HP');
  readableText = readableText.replace(/HEALTH_MISSING/g, 'Health Missing');
  readableText = readableText.replace(/CURRENT_MANA/g, 'Current Mana');
  readableText = readableText.replace(/MAX_MANA/g, 'Max Mana');
  readableText = readableText.replace(/MISSING_MANA/g, 'Missing Mana');
  readableText = readableText.replace(/RAGE_POINTS/g, 'Rage Points');
  readableText = readableText.replace(/SAME_SUIT/g, 'Same Suit');
  readableText = readableText.replace(/LONGEST_STREAK/g, 'Longest Streak');

  // Additional technical variables that might appear
  readableText = readableText.replace(/RED_COUNT/g, 'Red Cards');
  readableText = readableText.replace(/BLACK_COUNT/g, 'Black Cards');
  readableText = readableText.replace(/TOTAL_FLIPS/g, 'Total Flips');
  readableText = readableText.replace(/CONSECUTIVE_HEADS/g, 'Consecutive Heads');
  readableText = readableText.replace(/ALTERNATING_PATTERN/g, 'Alternating Pattern');
  readableText = readableText.replace(/HEADS_RATIO/g, 'Heads Ratio');

  // Catch-all for any remaining CAPS_CAPS patterns
  readableText = readableText.replace(/\b[A-Z][A-Z_]+[A-Z]\b/g, (match) => {
    // Skip if it's already been converted or is a known abbreviation
    if (match.includes(' ') || ['HP', 'MP', 'AP', 'XP', 'INT', 'STR', 'DEX', 'CON', 'WIS', 'CHA', 'HEA'].includes(match)) {
      return match;
    }
    return convertCapsToReadable(match);
  });

  // Handle specific conditional expressions that are confusing
  // Convert "15:0" pattern to readable text
  readableText = readableText.replace(/(\d+):0/g, (match, bonus) => {
    return `${bonus} bonus if condition is met`;
  });

  // Convert "All Heads ? 15 : 0" pattern to readable text
  readableText = readableText.replace(/All Heads \? (\d+) : 0/gi, (match, bonus) => {
    return `${bonus} bonus if all coins are heads`;
  });

  // Convert "Same Suit ? X : Y" patterns
  readableText = readableText.replace(/Same Suit \? (\d+) : (\d+)/gi, (match, trueVal, falseVal) => {
    if (falseVal === '0') {
      return `${trueVal} bonus if all cards are the same suit`;
    }
    return `${trueVal} if all cards are the same suit, otherwise ${falseVal}`;
  });

  // Convert other ternary operators to more readable format
  readableText = readableText.replace(/\?\s*/g, ' if ');
  readableText = readableText.replace(/\s*:\s*/g, ', otherwise ');

  // Mathematical operators to more readable format
  readableText = readableText.replace(/\s*\+\s*/g, ' + ');
  readableText = readableText.replace(/\s*\*\s*/g, ' × ');
  readableText = readableText.replace(/\s*-\s*/g, ' - ');
  readableText = readableText.replace(/\s*\/\s*/g, ' ÷ ');

  // Clean up any remaining technical formatting
  readableText = readableText.replace(/_/g, ' ');
  readableText = readableText.replace(/([a-z])([A-Z])/g, '$1 $2');

  // Clean up multiple spaces and ensure proper capitalization
  readableText = readableText.replace(/\s+/g, ' ').trim();

  return readableText;
};

// Format damage or healing values
export const formatDamageOrHealing = (data) => {
  // Special handling for card-based spells
  if (data?.resolution === 'CARDS' && data?.cardConfig) {
    const drawCount = data.cardConfig.drawCount || 4;
    if (data.cardConfig.formula) {
      const plainEnglish = formatFormulaToPlainEnglish(data.cardConfig.formula, 'damage');
      return `Draw ${drawCount} cards: ${plainEnglish}`;
    }
    return `Draw ${drawCount} cards`;
  }

  // Special handling for coin-based spells
  if (data?.resolution === 'COINS' && data?.coinConfig) {
    const flipCount = data.coinConfig.flipCount || 5;
    if (data.coinConfig.formula) {
      const plainEnglish = formatFormulaToPlainEnglish(data.coinConfig.formula, 'damage');
      return `Flip ${flipCount} coins: ${plainEnglish}`;
    }
    return `Flip ${flipCount} coins`;
  }

  // Handle different data formats
  if (!data) {
    return 'Variable';
  }

  if (data.dice && data.dice !== 'N/A') {
    return `${data.dice}${data.flat > 0 ? ` + ${data.flat}` : ''}`;
  } else if (data.flat || data.flat === 0) {
    return `${data.flat}`;
  } else if (typeof data === 'string') {
    // Check if it's a technical formula that needs conversion
    if (data.includes('CARD_VALUE') || data.includes('HEADS_COUNT') || data.includes('FACE_CARD_COUNT') ||
        data.includes('HEALTH_SACRIFICED') || data.includes('DAMAGE_DEALT') || data.includes('TAILS_COUNT')) {
      return formatFormulaToPlainEnglish(data, 'damage');
    }
    return data;
  } else if (data.formula) {
    // Check if it's a technical formula that needs conversion
    if (data.formula.includes('CARD_VALUE') || data.formula.includes('HEADS_COUNT') || data.formula.includes('FACE_CARD_COUNT') ||
        data.formula.includes('HEALTH_SACRIFICED') || data.formula.includes('DAMAGE_DEALT') || data.formula.includes('TAILS_COUNT')) {
      return formatFormulaToPlainEnglish(data.formula, 'damage');
    }
    return data.formula;
  }

  return 'Variable';
};

// Comprehensive function to ensure any string gets properly formatted
export const ensureReadableFormat = (text) => {
  if (!text || typeof text !== 'string') {
    return text;
  }

  // Check if it contains technical variables and needs formatting
  const technicalVariables = [
    'HEALTH_SACRIFICED', 'DAMAGE_DEALT', 'HEALING_DONE', 'MANA_SPENT', 'STAMINA_USED',
    'CARD_VALUE', 'FACE_CARD_COUNT', 'HEADS_COUNT', 'TAILS_COUNT', 'ALL_HEADS', 'ALL_TAILS',
    'LONGEST_STREAK', 'SAME_SUIT', 'RED_COUNT', 'BLACK_COUNT', 'TOTAL_FLIPS',
    'CONSECUTIVE_HEADS', 'ALTERNATING_PATTERN', 'HEADS_RATIO'
  ];

  const needsFormatting = technicalVariables.some(variable => text.includes(variable));

  if (needsFormatting) {
    // If it looks like a formula, use formatFormulaToPlainEnglish
    if (text.includes('*') || text.includes('+') || text.includes('?') || text.includes(':')) {
      return formatFormulaToPlainEnglish(text);
    } else {
      // Otherwise use formatFormulaToReadableText
      return formatFormulaToReadableText(text);
    }
  }

  // Check for any remaining CAPS_CAPS patterns and convert them
  let formattedText = text.replace(/\b[A-Z][A-Z_]+[A-Z]\b/g, (match) => {
    // Skip if it's already been converted or is a known abbreviation
    if (match.includes(' ') || ['HP', 'MP', 'AP', 'XP', 'INT', 'STR', 'DEX', 'CON', 'WIS', 'CHA', 'HEA'].includes(match)) {
      return match;
    }
    return convertCapsToReadable(match);
  });

  return formattedText;
};

// Format a single effect component for display (similar to spellcard format)
// Used in triggers step to show effect previews
export const formatEffectComponent = (spell, effectType, subType = null) => {
  if (!spell) return null;

  // Helper function to clean formulas (similar to UnifiedSpellCard)
  const cleanFormula = (formula) => {
    if (!formula || typeof formula !== 'string') return '';
    
    let cleanedFormula = formula
      .replace(/\s*\+\s*/g, ' + ')
      .replace(/\s*\-\s*/g, ' - ')
      .replace(/\s*\*\s*/g, ' * ')
      .replace(/\s*\/\s*/g, ' / ')
      .replace(/\s+/g, ' ')
      .trim();

    // Replace resource variables
    const resourceVariableMap = {
      'action_points': 'Action Points',
      'astral_power': 'Astral Power',
      'strength': 'Strength',
      'agility': 'Agility',
      'constitution': 'Constitution',
      'intelligence': 'Intelligence',
      'spirit': 'Spirit',
      'charisma': 'Charisma',
      'str': 'Strength',
      'agi': 'Agility',
      'con': 'Constitution',
      'int': 'Intelligence',
      'spi': 'Spirit',
      'cha': 'Charisma'
    };

    Object.entries(resourceVariableMap).forEach(([variable, properName]) => {
      const regex = new RegExp(`\\b${variable}\\b`, 'gi');
      cleanedFormula = cleanedFormula.replace(regex, properName);
    });

    cleanedFormula = cleanedFormula.replace(/_/g, ' ');
    cleanedFormula = cleanedFormula.replace(/([a-z])([A-Z])/g, '$1 $2');

    return cleanedFormula;
  };

  // Format damage component
  if (effectType === 'damage' || effectType?.startsWith('damage_')) {
    const damageConfig = spell.damageConfig;
    if (!damageConfig) return null;

    const damageType = damageConfig.damageType || 'direct';
    const elementType = damageConfig.elementType || 'fire';
    const elementName = elementType.charAt(0).toUpperCase() + elementType.slice(1);
    
    // Get damage types array
    let damageTypesArray = spell.damageTypes || damageConfig.damageTypes;
    if (!damageTypesArray || damageTypesArray.length === 0) {
      damageTypesArray = [];
      if (spell.typeConfig?.school) damageTypesArray.push(spell.typeConfig.school);
      if (spell.typeConfig?.secondaryElement) damageTypesArray.push(spell.typeConfig.secondaryElement);
    }
    if (damageTypesArray.length === 0) {
      damageTypesArray = [elementType];
    }

    const formattedTypes = damageTypesArray
      .filter(type => type && type !== 'dot')
      .map(type => type.charAt(0).toUpperCase() + type.slice(1));
    
    const damageTypeText = formattedTypes.length > 0 
      ? (formattedTypes.length === 1 ? ` ${formattedTypes[0]}` : ` ${formattedTypes.join(' and ')}`)
      : '';

    // Handle specific damage sub-types
    if (subType === 'damage_direct' || (subType === null && damageType === 'direct')) {
      let formula = damageConfig.formula || '1d6 + INT';
      
      if (spell.resolution === 'CARDS') {
        const cardConfig = spell.cardConfig || damageConfig.cardConfig;
        const drawCount = cardConfig?.drawCount !== undefined ? cardConfig.drawCount : 3;
        const cardFormula = cardConfig?.formula || formula;
        return `Draw ${drawCount} cards: ${cleanFormula(cardFormula)}${damageTypeText} (Direct)`;
      } else if (spell.resolution === 'COINS') {
        const coinConfig = spell.coinConfig || damageConfig.coinConfig;
        const flipCount = coinConfig?.flipCount !== undefined ? coinConfig.flipCount : 4;
        const coinFormula = coinConfig?.formula || formula;
        return `Flip ${flipCount} coins: ${cleanFormula(coinFormula)}${damageTypeText} (Direct)`;
      } else {
        return `${cleanFormula(formula)}${damageTypeText} (Direct)`;
      }
    } else if (subType === 'damage_dot' || (subType === null && damageType === 'dot')) {
      const dotFormula = damageConfig.dotConfig?.dotFormula || damageConfig.formula || '1d4 + INT/2';
      const duration = damageConfig.dotConfig?.duration || damageConfig.dotDuration || 3;
      const tickFrequency = damageConfig.dotConfig?.tickFrequency || damageConfig.dotDurationUnit || 'round';
      const durationText = duration === 1 ? `1 ${tickFrequency}` : `${duration} ${tickFrequency}s`;
      
      if (spell.resolution === 'CARDS') {
        const cardConfig = damageConfig.dotConfig?.cardConfig || spell.cardConfig;
        const drawCount = cardConfig?.drawCount !== undefined ? cardConfig.drawCount : 3;
        const cardFormula = cardConfig?.formula || dotFormula;
        return `Draw ${drawCount} cards: ${cleanFormula(cardFormula)}${damageTypeText} per ${tickFrequency} for ${durationText} (DoT)`;
      } else if (spell.resolution === 'COINS') {
        const coinConfig = damageConfig.dotConfig?.coinConfig || spell.coinConfig;
        const flipCount = coinConfig?.flipCount !== undefined ? coinConfig.flipCount : 4;
        const coinFormula = coinConfig?.formula || dotFormula;
        return `Flip ${flipCount} coins: ${cleanFormula(coinFormula)}${damageTypeText} per ${tickFrequency} for ${durationText} (DoT)`;
      } else {
        return `${cleanFormula(dotFormula)}${damageTypeText} per ${tickFrequency} for ${durationText} (DoT)`;
      }
    } else if (subType === 'damage_combined' || (subType === null && damageType === 'combined')) {
      const instantFormula = damageConfig.formula || '1d6 + INT';
      const dotFormula = damageConfig.dotConfig?.dotFormula || damageConfig.formula || '1d4 + INT/2';
      return `${cleanFormula(instantFormula)}${damageTypeText} (Instant + DoT)`;
    }
  }

  // Format healing component
  if (effectType === 'healing' || effectType?.startsWith('healing_')) {
    const healingConfig = spell.healingConfig;
    if (!healingConfig) return null;

    const healingType = healingConfig.healingType || 'direct';

    if (subType === 'healing_direct' || (subType === null && (healingType === 'direct' || healingType === 'instant'))) {
      let formula = healingConfig.formula || '2d8 + HEA';
      
      if (spell.resolution === 'CARDS' && healingConfig.cardConfig?.formula) {
        const drawCount = healingConfig.cardConfig.drawCount !== undefined ? healingConfig.cardConfig.drawCount : 3;
        return `Draw ${drawCount} cards: ${cleanFormula(healingConfig.cardConfig.formula)} Healing (Direct)`;
      } else if (spell.resolution === 'COINS' && healingConfig.coinConfig?.formula) {
        const flipCount = healingConfig.coinConfig.flipCount !== undefined ? healingConfig.coinConfig.flipCount : 4;
        return `Flip ${flipCount} coins: ${cleanFormula(healingConfig.coinConfig.formula)} Healing (Direct)`;
      } else {
        return `${cleanFormula(formula)} Healing (Direct)`;
      }
    } else if (subType === 'healing_hot' || (subType === null && healingType === 'hot')) {
      const hotFormula = healingConfig.hotFormula || '1d6 + HEA/2';
      const duration = healingConfig.hotDuration || 3;
      const tickFrequency = healingConfig.hotTickType || 'round';
      const durationText = duration === 1 ? `1 ${tickFrequency}` : `${duration} ${tickFrequency}s`;
      
      if (spell.resolution === 'CARDS' && healingConfig.hotCardConfig?.formula) {
        const drawCount = healingConfig.hotCardConfig.drawCount !== undefined ? healingConfig.hotCardConfig.drawCount : 3;
        return `Draw ${drawCount} cards: ${cleanFormula(healingConfig.hotCardConfig.formula)} per ${tickFrequency} for ${durationText} (HoT)`;
      } else if (spell.resolution === 'COINS' && healingConfig.hotCoinConfig?.formula) {
        const flipCount = healingConfig.hotCoinConfig.flipCount !== undefined ? healingConfig.hotCoinConfig.flipCount : 4;
        return `Flip ${flipCount} coins: ${cleanFormula(healingConfig.hotCoinConfig.formula)} per ${tickFrequency} for ${durationText} (HoT)`;
      } else {
        return `${cleanFormula(hotFormula)} per ${tickFrequency} for ${durationText} (HoT)`;
      }
    } else if (subType === 'healing_shield' || (subType === null && healingConfig.hasShieldEffect)) {
      const shieldFormula = healingConfig.shieldFormula || '2d6 + HEA';
      const duration = healingConfig.shieldDuration || 3;
      
      if (spell.resolution === 'CARDS' && healingConfig.shieldCardConfig?.formula) {
        const drawCount = healingConfig.shieldCardConfig.drawCount !== undefined ? healingConfig.shieldCardConfig.drawCount : 3;
        return `Draw ${drawCount} cards: ${cleanFormula(healingConfig.shieldCardConfig.formula)} absorption for ${duration} rounds (Shield)`;
      } else if (spell.resolution === 'COINS' && healingConfig.shieldCoinConfig?.formula) {
        const flipCount = healingConfig.shieldCoinConfig.flipCount !== undefined ? healingConfig.shieldCoinConfig.flipCount : 4;
        return `Flip ${flipCount} coins: ${cleanFormula(healingConfig.shieldCoinConfig.formula)} absorption for ${duration} rounds (Shield)`;
      } else {
        return `${cleanFormula(shieldFormula)} absorption for ${duration} rounds (Shield)`;
      }
    } else if (subType === 'healing_combined' || (subType === null && healingType === 'combined')) {
      const instantFormula = healingConfig.formula || '2d8 + HEA';
      return `${cleanFormula(instantFormula)} Healing (Combined)`;
    }
  }

  // Fallback for other effect types
  return effectType.charAt(0).toUpperCase() + effectType.slice(1);
};

// Get color for damage type
export const getDamageTypeColor = (type) => {
  const typeColors = {
    fire: '#ef4444',
    frost: '#38bdf8',
    arcane: '#a855f7',
    nature: '#22c55e',
    shadow: '#6b21a8',
    holy: '#f59e0b',
    lightning: '#facc15',
    physical: '#9ca3af',
    acid: '#84cc16',
    poison: '#10b981',
    psychic: '#8b5cf6',
    radiant: '#fbbf24',
    necrotic: '#7e22ce',
    thunder: '#3b82f6',
    force: '#ec4899',
    cold: '#0ea5e9',
    bludgeoning: '#94a3b8',
    piercing: '#94a3b8',
    slashing: '#94a3b8'
  };
  return typeColors[type?.toLowerCase()] || '#9ca3af';
};

// Format cooldown text
export const formatCooldown = (cooldownConfig) => {
  if (!cooldownConfig || !cooldownConfig.enabled) return null;

  const { cooldownRounds, cooldownType } = cooldownConfig;
  if (cooldownType === 'rounds') {
    return `${cooldownRounds} round${cooldownRounds > 1 ? 's' : ''}`;
  } else if (cooldownType === 'turns') {
    return `${cooldownRounds} turn${cooldownRounds > 1 ? 's' : ''}`;
  } else if (cooldownType === 'longRest') {
    return 'Long Rest';
  } else if (cooldownType === 'shortRest') {
    return 'Short Rest';
  }
  return `${cooldownRounds} ${cooldownType}`;
};

// Get resource cost text
export const getResourceCost = (resourceCost) => {
  if (!resourceCost) return 'No Cost';

  const costs = [];
  if (resourceCost.mana > 0) costs.push(`${resourceCost.mana} Mana`);
  if (resourceCost.health > 0) costs.push(`${resourceCost.health} Health`);
  if (resourceCost.stamina > 0) costs.push(`${resourceCost.stamina} Stamina`);
  if (resourceCost.focus > 0) costs.push(`${resourceCost.focus} Focus`);
  if (resourceCost.rage > 0) costs.push(`${resourceCost.rage} Rage`);
  if (resourceCost.energy > 0) costs.push(`${resourceCost.energy} Energy`);
  if (resourceCost.comboPoints > 0) costs.push(`${resourceCost.comboPoints} Combo`);
  if (resourceCost.runicPower > 0) costs.push(`${resourceCost.runicPower} Runic`);
  if (resourceCost.soulShards > 0) costs.push(`${resourceCost.soulShards} Soul Shards`);
  if (resourceCost.holyPower > 0) costs.push(`${resourceCost.holyPower} Holy Power`);
  if (resourceCost.astralPower > 0) costs.push(`${resourceCost.astralPower} Astral Power`);
  if (resourceCost.maelstrom > 0) costs.push(`${resourceCost.maelstrom} Maelstrom`);
  if (resourceCost.chi > 0) costs.push(`${resourceCost.chi} Chi`);
  if (resourceCost.insanity > 0) costs.push(`${resourceCost.insanity} Insanity`);
  if (resourceCost.fury > 0) costs.push(`${resourceCost.fury} Fury`);
  if (resourceCost.pain > 0) costs.push(`${resourceCost.pain} Pain`);

  // If a primary resource type is specified, use that
  if (resourceCost.primaryResourceType && resourceCost.primaryResourceAmount > 0) {
    costs.push(`${resourceCost.primaryResourceAmount} ${resourceCost.primaryResourceType}`);
  }

  // For spells that use a custom resource
  if (resourceCost.customResource && resourceCost.customResourceAmount > 0) {
    costs.push(`${resourceCost.customResourceAmount} ${resourceCost.customResource}`);
  }

  return costs.length > 0 ? costs.join(', ') : 'No Cost';
};

// Format casting time
export const formatCastTime = (spell) => {
  if (!spell.castTime) {
    if (spell.spellType === 'ACTION') return 'Instant';
    if (spell.spellType === 'REACTION') return 'Reaction';
    if (spell.spellType === 'PASSIVE') return 'Passive';
    if (spell.spellType === 'CHANNELED') return 'Channeled';
    return 'Instant';
  }
  return spell.castTime;
};

// Format range
export const formatRange = (spell) => {
  if (!spell.range) {
    if (spell.targetingConfig?.rangeDistance) {
      return `${spell.targetingConfig.rangeDistance} ft`;
    }
    return '30 ft';
  }
  return spell.range;
};

// Get resolution icon
export const getResolutionIcon = (spell) => {
  if (!spell.resolution) return null;

  // Return FontAwesome icon components instead of emojis
  if (spell.resolution === 'DICE') return 'dice';
  if (spell.resolution === 'CARDS') return 'clone';
  if (spell.resolution === 'COINS') return 'coins';
  return null;
};

// Get resolution text
export const getResolutionText = (spell) => {
  if (!spell.resolution) return '';

  if (spell.resolution === 'DICE') return 'Dice';
  if (spell.resolution === 'CARDS') return 'Cards';
  if (spell.resolution === 'COINS') return 'Coins';
  return spell.resolution;
};

// Format duration
export const formatDuration = (spell) => {
  if (!spell.durationType || spell.durationType === 'instant') return 'Instant';

  if (spell.durationType === 'concentration') {
    return `Concentration (${spell.duration || 1} ${spell.durationUnit || 'minute'}${spell.duration > 1 ? 's' : ''})`;
  }

  if (spell.durationType === 'rounds') {
    return `${spell.duration || 1} round${spell.duration > 1 ? 's' : ''}`;
  }

  if (spell.durationType === 'turns') {
    return `${spell.duration || 1} turn${spell.duration > 1 ? 's' : ''}`;
  }

  return `${spell.duration || 1} ${spell.durationUnit || 'round'}${spell.duration > 1 ? 's' : ''}`;
};

// Get spell school color
export const getSpellSchoolColor = (school) => {
  if (!school) return '';

  const schoolLower = school.toLowerCase();
  if (schoolLower === 'fire') return 'spell-fire';
  if (schoolLower === 'frost' || schoolLower === 'cold') return 'spell-frost';
  if (schoolLower === 'arcane') return 'spell-arcane';
  if (schoolLower === 'nature') return 'spell-nature';
  if (schoolLower === 'shadow') return 'spell-shadow';
  if (schoolLower === 'holy') return 'spell-holy';
  if (schoolLower === 'lightning') return 'spell-lightning';
  return 'spell-physical';
};

// Get rarity class
export const getRarityClass = (rarity) => {
  if (!rarity) return '';
  return rarity.toLowerCase();
};

// Get border color based on school
export const getBorderColor = (spell) => {
  if (!spell.school) return '#3b3b3b';

  const schoolLower = spell.school.toLowerCase();
  if (schoolLower === 'fire') return '#ef4444';
  if (schoolLower === 'frost' || schoolLower === 'cold') return '#38bdf8';
  if (schoolLower === 'arcane') return '#a855f7';
  if (schoolLower === 'nature') return '#22c55e';
  if (schoolLower === 'shadow') return '#6b21a8';
  if (schoolLower === 'holy') return '#f59e0b';
  if (schoolLower === 'lightning') return '#facc15';
  return '#3b3b3b';
};
