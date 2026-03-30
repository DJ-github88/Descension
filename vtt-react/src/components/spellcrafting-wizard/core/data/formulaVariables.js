/**
 * Formula Variables System
 * 
 * This file defines all the valid variables that can be used in spell formulas,
 * ensuring consistency with the character stats system.
 */

// Primary character attributes (matching characterStore.js)
export const PRIMARY_ATTRIBUTES = {
  strength: { 
    name: 'Strength', 
    description: 'Physical power and melee damage',
    category: 'Primary Attributes',
    example: 'strength + 5'
  },
  agility: { 
    name: 'Agility', 
    description: 'Dexterity, reflexes, and ranged accuracy',
    category: 'Primary Attributes',
    example: 'agility / 2'
  },
  constitution: { 
    name: 'Constitution', 
    description: 'Health, stamina, and physical resilience',
    category: 'Primary Attributes',
    example: 'constitution * 2'
  },
  intelligence: { 
    name: 'Intelligence', 
    description: 'Magical power, knowledge, and spell effectiveness',
    category: 'Primary Attributes',
    example: 'intelligence + 10'
  },
  spirit: { 
    name: 'Spirit', 
    description: 'Willpower, spiritual energy, and mana regeneration',
    category: 'Primary Attributes',
    example: 'spirit / 3'
  },
  charisma: { 
    name: 'Charisma', 
    description: 'Social influence, leadership, and divine magic',
    category: 'Primary Attributes',
    example: 'charisma + level'
  }
};

// Derived combat stats (matching characterStore.js derived stats)
export const COMBAT_STATS = {
  damage: { 
    name: 'Melee Damage', 
    description: 'Physical damage bonus from strength and equipment',
    category: 'Combat Stats',
    example: 'damage * 1.5'
  },
  spellDamage: { 
    name: 'Spell Damage', 
    description: 'Magical damage bonus from intelligence and equipment',
    category: 'Combat Stats',
    example: 'spellDamage + 20'
  },
  rangedDamage: { 
    name: 'Ranged Damage', 
    description: 'Ranged attack damage bonus from agility and equipment',
    category: 'Combat Stats',
    example: 'rangedDamage / 2'
  },
  healingPower: { 
    name: 'Healing Power', 
    description: 'Healing effectiveness bonus from spirit and equipment',
    category: 'Combat Stats',
    example: 'healingPower * 2'
  },
  armor: { 
    name: 'Armor', 
    description: 'Physical damage reduction from agility and equipment',
    category: 'Combat Stats',
    example: 'armor + 10'
  }
};

// Resource stats (matching characterStore.js)
export const RESOURCE_STATS = {
  maxHealth: { 
    name: 'Max Health', 
    description: 'Maximum health points',
    category: 'Resources',
    example: 'maxHealth * 0.1'
  },
  currentHealth: { 
    name: 'Current Health', 
    description: 'Current health points',
    category: 'Resources',
    example: 'currentHealth / 2'
  },
  maxMana: { 
    name: 'Max Mana', 
    description: 'Maximum mana points',
    category: 'Resources',
    example: 'maxMana * 0.2'
  },
  currentMana: { 
    name: 'Current Mana', 
    description: 'Current mana points',
    category: 'Resources',
    example: 'currentMana / 3'
  },
  maxActionPoints: { 
    name: 'Max Action Points', 
    description: 'Maximum action points per turn',
    category: 'Resources',
    example: 'maxActionPoints - 1'
  },
  currentActionPoints: { 
    name: 'Current Action Points', 
    description: 'Current action points remaining',
    category: 'Resources',
    example: 'currentActionPoints * 5'
  }
};

// Recovery and regeneration stats (matching characterStore.js)
export const RECOVERY_STATS = {
  healthRegen: { 
    name: 'Health Regeneration', 
    description: 'Health points regenerated per turn',
    category: 'Recovery',
    example: 'healthRegen * 10'
  },
  manaRegen: { 
    name: 'Mana Regeneration', 
    description: 'Mana points regenerated per turn',
    category: 'Recovery',
    example: 'manaRegen * 5'
  }
};

// Movement and utility stats (matching characterStore.js)
export const UTILITY_STATS = {
  moveSpeed: { 
    name: 'Movement Speed', 
    description: 'Base movement speed in feet per turn',
    category: 'Movement & Utility',
    example: 'moveSpeed / 10'
  },
  carryingCapacity: { 
    name: 'Carrying Capacity', 
    description: 'Maximum weight that can be carried',
    category: 'Movement & Utility',
    example: 'carryingCapacity / 100'
  }
};

// Character progression stats (matching characterStore.js)
export const PROGRESSION_STATS = {
  level: { 
    name: 'Character Level', 
    description: 'Current character level',
    category: 'Progression',
    example: 'level * 2'
  },
  exhaustionLevel: { 
    name: 'Exhaustion Level', 
    description: 'Current exhaustion level (0-6)',
    category: 'Progression',
    example: 'exhaustionLevel + 1'
  }
};

// Dice variables for formula building
export const DICE_VARIABLES = {
  '1d4': { name: '1d4', description: 'Roll one 4-sided die', category: 'Dice', example: '1d4 + strength' },
  '1d6': { name: '1d6', description: 'Roll one 6-sided die', category: 'Dice', example: '1d6 + intelligence' },
  '1d8': { name: '1d8', description: 'Roll one 8-sided die', category: 'Dice', example: '1d8 + spellDamage' },
  '1d10': { name: '1d10', description: 'Roll one 10-sided die', category: 'Dice', example: '1d10 + level' },
  '1d12': { name: '1d12', description: 'Roll one 12-sided die', category: 'Dice', example: '1d12 + damage' },
  '1d20': { name: '1d20', description: 'Roll one 20-sided die', category: 'Dice', example: '1d20 + agility' },
  '2d6': { name: '2d6', description: 'Roll two 6-sided dice', category: 'Dice', example: '2d6 + healingPower' },
  '3d6': { name: '3d6', description: 'Roll three 6-sided dice', category: 'Dice', example: '3d6 + constitution' }
};

// Card variables for card-based resolution
export const CARD_VARIABLES = {
  CARD_VALUE: { name: 'Card Value', description: 'Sum of all card values (A=1/14, J=11, Q=12, K=13)', category: 'Cards', example: 'CARD_VALUE + intelligence' },
  FACE_CARDS: { name: 'Face Cards', description: 'Number of face cards (J, Q, K) drawn', category: 'Cards', example: 'FACE_CARDS * 5' },
  PAIRS: { name: 'Pairs', description: 'Number of pairs in hand', category: 'Cards', example: 'PAIRS * 10' },
  SAME_SUIT: { name: 'Same Suit', description: 'Boolean: true if all cards are same suit', category: 'Cards', example: 'CARD_VALUE * (SAME_SUIT ? 2 : 1)' },
  FLUSH: { name: 'Flush', description: 'Boolean: true if 5+ cards of same suit', category: 'Cards', example: 'FLUSH ? 50 : 0' },
  STRAIGHT: { name: 'Straight', description: 'Boolean: true if cards form a sequence', category: 'Cards', example: 'STRAIGHT ? CARD_VALUE * 2 : CARD_VALUE' },
  ROYAL_FLUSH: { name: 'Royal Flush', description: 'Boolean: true if 10-J-Q-K-A of same suit', category: 'Cards', example: 'ROYAL_FLUSH ? 100 : 0' },
  POKER_HAND_RANK: { name: 'Poker Hand Rank', description: 'Poker hand strength (1-10, 10=Royal Flush)', category: 'Cards', example: 'POKER_HAND_RANK * 8' },
  STRAIGHT: { name: 'Straight', description: 'Boolean: true if cards form a sequence', category: 'Cards', example: 'STRAIGHT ? 40 : 0' },
  THREE_KIND: { name: 'Three of a Kind', description: 'Boolean: true if three cards have same value', category: 'Cards', example: 'THREE_KIND ? 30 : 0' },
  FOUR_KIND: { name: 'Four of a Kind', description: 'Boolean: true if four cards have same value', category: 'Cards', example: 'FOUR_KIND ? 60 : 0' },
  FULL_HOUSE: { name: 'Full House', description: 'Boolean: true if three of a kind + pair', category: 'Cards', example: 'FULL_HOUSE ? 45 : 0' },
  RED_COUNT: { name: 'Red Count', description: 'Number of red cards (hearts/diamonds)', category: 'Cards', example: 'RED_COUNT * 3' },
  BLACK_COUNT: { name: 'Black Count', description: 'Number of black cards (clubs/spades)', category: 'Cards', example: 'BLACK_COUNT * 3' },
  ACE_COUNT: { name: 'Ace Count', description: 'Number of aces in hand', category: 'Cards', example: 'ACE_COUNT * 15' },
  ROYAL_FLUSH: { name: 'Royal Flush', description: 'Boolean: true if 10, J, Q, K, A of same suit', category: 'Cards', example: 'ROYAL_FLUSH ? 100 : 0' }
};

// Coin variables for coin-based resolution
export const COIN_VARIABLES = {
  HEADS_COUNT: { name: 'Heads Count', description: 'Number of heads flipped', category: 'Coins', example: 'HEADS_COUNT * 5' },
  TAILS_COUNT: { name: 'Tails Count', description: 'Number of tails flipped', category: 'Coins', example: 'TAILS_COUNT * 3' },
  ALL_HEADS: { name: 'All Heads', description: 'Boolean: true if all coins are heads', category: 'Coins', example: 'ALL_HEADS ? 50 : 0' },
  ALL_TAILS: { name: 'All Tails', description: 'Boolean: true if all coins are tails', category: 'Coins', example: 'ALL_TAILS ? 25 : 0' },
  HEADS_RATIO: { name: 'Heads Ratio', description: 'Percentage of heads (0.0 to 1.0)', category: 'Coins', example: 'HEADS_RATIO * 100' },
  CONSECUTIVE_HEADS: { name: 'Consecutive Heads', description: 'Longest streak of consecutive heads', category: 'Coins', example: 'CONSECUTIVE_HEADS * 8' },
  CONSECUTIVE_TAILS: { name: 'Consecutive Tails', description: 'Longest streak of consecutive tails', category: 'Coins', example: 'CONSECUTIVE_TAILS * 6' },
  PATTERN_MATCH: { name: 'Pattern Match', description: 'Number of specific patterns found', category: 'Coins', example: 'PATTERN_MATCH * 12' },
  TOTAL_FLIPS: { name: 'Total Flips', description: 'Total number of coins flipped', category: 'Coins', example: 'TOTAL_FLIPS * 2' },
  CONSECUTIVE_HEADS: { name: 'Consecutive Heads', description: 'Longest streak of consecutive heads', category: 'Coins', example: 'CONSECUTIVE_HEADS * 8' },
  ALTERNATING_PATTERN: { name: 'Alternating Pattern', description: 'Boolean: true if coins alternate H-T-H-T', category: 'Coins', example: 'ALTERNATING_PATTERN ? 30 : 0' }
};

// Math functions available in formulas
export const MATH_FUNCTIONS = {
  'MAX(a, b)': { name: 'Maximum', description: 'Returns the larger of two values', category: 'Math Functions', example: 'MAX(strength, intelligence)' },
  'MIN(a, b)': { name: 'Minimum', description: 'Returns the smaller of two values', category: 'Math Functions', example: 'MIN(currentHealth, 50)' },
  'FLOOR(a)': { name: 'Floor', description: 'Rounds down to nearest integer', category: 'Math Functions', example: 'FLOOR(intelligence / 3)' },
  'CEIL(a)': { name: 'Ceiling', description: 'Rounds up to nearest integer', category: 'Math Functions', example: 'CEIL(spellDamage / 2)' },
  'ROUND(a)': { name: 'Round', description: 'Rounds to nearest integer', category: 'Math Functions', example: 'ROUND(healingPower * 1.5)' },
  'ABS(a)': { name: 'Absolute', description: 'Returns absolute value (always positive)', category: 'Math Functions', example: 'ABS(currentHealth - maxHealth)' }
};

// Combine all variables into organized categories
export const ALL_VARIABLES = {
  ...PRIMARY_ATTRIBUTES,
  ...COMBAT_STATS,
  ...RESOURCE_STATS,
  ...RECOVERY_STATS,
  ...UTILITY_STATS,
  ...PROGRESSION_STATS,
  ...DICE_VARIABLES,
  ...CARD_VARIABLES,
  ...COIN_VARIABLES,
  ...MATH_FUNCTIONS
};

// Organized categories for UI display
export const VARIABLE_CATEGORIES = {
  'Primary Attributes': Object.keys(PRIMARY_ATTRIBUTES),
  'Combat Stats': Object.keys(COMBAT_STATS),
  'Resources': Object.keys(RESOURCE_STATS),
  'Recovery': Object.keys(RECOVERY_STATS),
  'Movement & Utility': Object.keys(UTILITY_STATS),
  'Progression': Object.keys(PROGRESSION_STATS),
  'Dice': Object.keys(DICE_VARIABLES),
  'Cards': Object.keys(CARD_VARIABLES),
  'Coins': Object.keys(COIN_VARIABLES),
  'Math Functions': Object.keys(MATH_FUNCTIONS)
};

// Helper function to get variable info
export const getVariableInfo = (variableName) => {
  return ALL_VARIABLES[variableName] || null;
};

// Helper function to validate if a variable exists
export const isValidVariable = (variableName) => {
  return variableName in ALL_VARIABLES;
};

// Helper function to get all variables in a category
export const getVariablesByCategory = (category) => {
  const categoryKeys = VARIABLE_CATEGORIES[category] || [];
  return categoryKeys.map(key => ({
    name: key,
    ...ALL_VARIABLES[key]
  }));
};
