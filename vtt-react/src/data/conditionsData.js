// Shared Conditions Data
// Used by ConditionsWindow and BuffDebuffCreatorModal

export const CONDITION_CATEGORIES = {
  MOVEMENT: 'Movement',
  MENTAL: 'Mental',
  PHYSICAL: 'Physical',
  MAGICAL: 'Magical',
  COMBAT: 'Combat'
};

export const CONDITIONS = {
  // Movement Conditions
  stunned: {
    name: 'Stunned',
    description: 'Cannot move or take actions',
    category: CONDITION_CATEGORIES.MOVEMENT,
    type: 'debuff',
    color: '#FFD700',
    icon: '/assets/icons/Status/mental/spiral-dizzy.png',
    severity: 'severe'
  },
  paralyzed: {
    name: 'Paralyzed',
    description: 'Cannot move or speak',
    category: CONDITION_CATEGORIES.PHYSICAL,
    type: 'debuff',
    color: '#8B4513',
    icon: '/assets/icons/Status/control/grasping-hand-restrain.png',
    severity: 'severe'
  },
  restrained: {
    name: 'Restrained',
    description: 'Movement is restricted',
    category: CONDITION_CATEGORIES.MOVEMENT,
    type: 'debuff',
    color: '#CD853F',
    icon: '/assets/icons/Status/control/locked-restrained.png',
    severity: 'moderate'
  },
  slowed: {
    name: 'Slowed',
    description: 'Movement speed reduced by half',
    category: CONDITION_CATEGORIES.MOVEMENT,
    type: 'debuff',
    color: '#87CEEB',
    icon: '/assets/icons/Status/movement/anchor-slow-root.png',
    severity: 'minor'
  },
  hasted: {
    name: 'Hasted',
    description: 'Movement speed doubled',
    category: CONDITION_CATEGORIES.MOVEMENT,
    type: 'buff',
    color: '#32CD32',
    icon: '/assets/icons/Status/movement/upward-arrow-haste.png',
    severity: 'beneficial'
  },

  // Mental Conditions
  charmed: {
    name: 'Charmed',
    description: 'Friendly to the charmer',
    category: CONDITION_CATEGORIES.MENTAL,
    type: 'debuff',
    color: '#FF69B4',
    icon: '/assets/icons/Status/buff/divided-heart-wings.png',
    severity: 'moderate'
  },
  frightened: {
    name: 'Frightened',
    description: 'Disadvantage on ability checks and attacks',
    category: CONDITION_CATEGORIES.MENTAL,
    type: 'debuff',
    color: '#8B0000',
    icon: '/assets/icons/Status/mental/fearful-face.png',
    severity: 'moderate'
  },
  confused: {
    name: 'Confused',
    description: 'Actions are unpredictable',
    category: CONDITION_CATEGORIES.MENTAL,
    type: 'debuff',
    color: '#9370DB',
    icon: '/assets/icons/Status/mental/confused-face.png',
    severity: 'moderate'
  },

  // Physical Conditions
  poisoned: {
    name: 'Poisoned',
    description: 'Disadvantage on attack rolls and ability checks',
    category: CONDITION_CATEGORIES.PHYSICAL,
    type: 'debuff',
    color: '#228B22',
    icon: '/assets/icons/Status/dot/skull-crossbones-poison.png',
    severity: 'moderate'
  },
  diseased: {
    name: 'Diseased',
    description: 'Ongoing health deterioration',
    category: CONDITION_CATEGORIES.PHYSICAL,
    type: 'debuff',
    color: '#556B2F',
    icon: '/assets/icons/Status/physical/intestines-organ-disease.png',
    severity: 'severe'
  },
  exhausted: {
    name: 'Exhausted',
    description: 'Reduced physical capabilities',
    category: CONDITION_CATEGORIES.PHYSICAL,
    type: 'debuff',
    color: '#A0522D',
    icon: '/assets/icons/Status/debuff/downward-arrow.png',
    severity: 'moderate'
  },

  // Magical Conditions
  silenced: {
    name: 'Silenced',
    description: 'Cannot cast spells with verbal components',
    category: CONDITION_CATEGORIES.MAGICAL,
    type: 'debuff',
    color: '#4B0082',
    icon: '/assets/icons/Status/control/gagged-silenced.png',
    severity: 'moderate'
  },
  dispelled: {
    name: 'Dispelled',
    description: 'Magical effects suppressed',
    category: CONDITION_CATEGORIES.MAGICAL,
    type: 'debuff',
    color: '#191970',
    icon: '/assets/icons/Status/magical/cross-pattern-magical.png',
    severity: 'severe'
  },

  // Combat Conditions
  blessed: {
    name: 'Blessed',
    description: 'Advantage on attack rolls and saving throws',
    category: CONDITION_CATEGORIES.COMBAT,
    type: 'buff',
    color: '#FFD700',
    icon: '/assets/icons/Status/buff/star-emblem-power.png',
    severity: 'beneficial'
  },
  defending: {
    name: 'Defending',
    description: 'Increased armor and damage resistance',
    category: CONDITION_CATEGORIES.COMBAT,
    type: 'buff',
    color: '#4682B4',
    icon: '/assets/icons/Status/buff/shield-protection.png',
    severity: 'beneficial'
  }
};

// Icon directory mapping - maps our category names to Status directory folders
const STATUS_ICON_DIRECTORIES = {
  Movement: 'movement',
  Mental: 'mental',
  Physical: 'physical',
  Magical: 'magical',
  Combat: 'combat',
  Control: 'control',
  Buff: 'buff',
  Debuff: 'debuff',
  DOT: 'dot',
  Healing: 'healing',
  HOT: 'hot',
  Defensive: 'defensive',
  Utility: 'utility',
  Other: 'other',
  Social: 'social'
};

// Helper function to get icon path
export const getStatusIconPath = (category, filename) => {
  const dir = STATUS_ICON_DIRECTORIES[category] || 'other';
  return `/assets/icons/Status/${dir}/${filename}`;
};

// Condition icons organized by category for the icon picker
// These are the specific condition icons
export const CONDITION_ICONS_BY_CATEGORY = {
  Movement: [
    { id: '/assets/icons/Status/mental/spiral-dizzy.png', name: 'Stunned', condition: 'stunned', isImage: true },
    { id: '/assets/icons/Status/control/locked-restrained.png', name: 'Restrained', condition: 'restrained', isImage: true },
    { id: '/assets/icons/Status/movement/anchor-slow-root.png', name: 'Slowed', condition: 'slowed', isImage: true },
    { id: '/assets/icons/Status/movement/upward-arrow-haste.png', name: 'Hasted', condition: 'hasted', isImage: true }
  ],
  Mental: [
    { id: '/assets/icons/Status/buff/divided-heart-wings.png', name: 'Charmed', condition: 'charmed', isImage: true },
    { id: '/assets/icons/Status/mental/fearful-face.png', name: 'Frightened', condition: 'frightened', isImage: true },
    { id: '/assets/icons/Status/mental/confused-face.png', name: 'Confused', condition: 'confused', isImage: true }
  ],
  Physical: [
    { id: '/assets/icons/Status/control/grasping-hand-restrain.png', name: 'Paralyzed', condition: 'paralyzed', isImage: true },
    { id: '/assets/icons/Status/dot/skull-crossbones-poison.png', name: 'Poisoned', condition: 'poisoned', isImage: true },
    { id: '/assets/icons/Status/physical/intestines-organ-disease.png', name: 'Diseased', condition: 'diseased', isImage: true },
    { id: '/assets/icons/Status/debuff/downward-arrow.png', name: 'Exhausted', condition: 'exhausted', isImage: true }
  ],
  Magical: [
    { id: '/assets/icons/Status/control/gagged-silenced.png', name: 'Silenced', condition: 'silenced', isImage: true },
    { id: '/assets/icons/Status/magical/cross-pattern-magical.png', name: 'Dispelled', condition: 'dispelled', isImage: true }
  ],
  Combat: [
    { id: '/assets/icons/Status/buff/star-emblem-power.png', name: 'Blessed', condition: 'blessed', isImage: true },
    { id: '/assets/icons/Status/buff/shield-protection.png', name: 'Defending', condition: 'defending', isImage: true }
  ]
};

// Function to load all icons from a Status directory category
// This will be used by the icon picker to show all available icons
export const getAllStatusIconsByCategory = async (category) => {
  // In a real implementation, this would fetch from the server or use a static list
  // For now, we'll return the condition icons plus a way to load more
  return CONDITION_ICONS_BY_CATEGORY[category] || [];
};

// Flattened list of all condition icons for the icon picker
export const ALL_CONDITION_ICONS = Object.values(CONDITION_ICONS_BY_CATEGORY).flat();

