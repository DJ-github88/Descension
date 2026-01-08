/**
 * Background Abilities Data Module
 * 
 * Defines the specific abilities granted by each background.
 * Each background provides three abilities that can be passive or active.
 * This data is used by both the rules system and character creation.
 */

export const BACKGROUND_ABILITIES = {
  mystic: [
    {
      name: 'Mana Surge',
      type: 'Active',
      usage: '1/Long Rest',
      description: 'Enter a Mana Surge state for 1 minute, reducing spell costs and casting one spell for free.',
      details: 'For 1 minute, all spell costs are reduced by 1 (minimum 1), and you can cast one spell of 3rd level or lower without expending a spell slot.'
    },
    {
      name: 'Elemental Attunement',
      type: 'Passive',
      usage: '1/Day',
      description: 'Attune to an elemental type once per day, gaining resistance and bonus damage.',
      details: 'Choose fire, cold, lightning, or acid. You gain resistance to that damage type and your spells and attacks deal +1 damage of that type until your next long rest.'
    }
  ],

  arcanist: [
    {
      name: 'Arcane Insight',
      type: 'Passive',
      usage: 'Always Active',
      description: 'Cast Detect Magic at will and gain advantage on checks to identify spells and magical effects.',
      details: 'You can cast Detect Magic at will without expending a spell slot. You have advantage on Intelligence (Arcana) checks to identify spells, magical items, and magical phenomena.'
    },
    {
      name: 'Spell Adaptation',
      type: 'Active',
      usage: '1/Short Rest',
      description: 'Modify a spell by changing its damage type, range, targets, or duration.',
      details: 'When you cast a spell, you can change one aspect: damage type (to any other type), double or halve the range, add or remove one target, or double or halve the duration.'
    }
  ],

  trickster: [
    {
      name: 'Fortune\'s Favor',
      type: 'Active',
      usage: '3/Long Rest',
      description: 'Force a reroll on any d20 roll made by you or an ally within 30 feet.',
      details: 'When you or an ally within 30 feet makes a d20 roll, you can use your reaction to force a reroll. The new result must be used. You can use this ability 3 times per long rest.'
    },
    {
      name: 'Lucky Break',
      type: 'Passive',
      usage: '1/Long Rest',
      description: 'Once per long rest, remain at 1 hit point instead of being reduced to 0.',
      details: 'When you would be reduced to 0 hit points, you can choose to drop to 1 hit point instead. This ability recharges on a long rest.'
    }
  ],

  zealot: [
    {
      name: 'Divine Favor',
      type: 'Passive',
      usage: '1/Long Rest',
      description: 'Gain resistance to radiant damage and advantage on one roll per long rest.',
      details: 'You have resistance to radiant damage. Once per long rest, you can choose to have advantage on any d20 roll you make.'
    },
    {
      name: 'Smite the Unfaithful',
      type: 'Active',
      usage: '1/Short Rest',
      description: 'Imbue your weapon with divine energy for bonus radiant damage on your next attack.',
      details: 'For 1 AP, your next weapon attack deals an additional 1d8 radiant damage. If the target is undead or a fiend, the damage increases to 2d8.'
    }
  ],

  harrow: [
    {
      name: 'Touch of Death',
      type: 'Passive',
      usage: 'Always Active',
      description: 'Gain temporary hit points when you reduce a creature to 0 hit points.',
      details: 'When you reduce a hostile creature to 0 hit points, you gain temporary hit points equal to your Constitution modifier + half your level (minimum 1).'
    },
    {
      name: 'Spectral Sight',
      type: 'Active',
      usage: 'At Will',
      description: 'See invisible creatures and into the Ethereal Plane for 1 minute.',
      details: 'As an action, you can see invisible creatures and objects, as well as see into the Ethereal Plane, for 1 minute. Once used, you must finish a short rest before using this ability again.'
    }
  ],

  hexer: [
    {
      name: 'Primal Connection',
      type: 'Passive',
      usage: 'Always Active',
      description: 'Communicate with beasts and plants, and gain advantage on Survival checks.',
      details: 'You can communicate simple concepts with beasts and plants. You have advantage on Wisdom (Survival) checks and can sense the general health and mood of natural environments.'
    },
    {
      name: 'Wild Shape',
      type: 'Active',
      usage: '1/Long Rest',
      description: 'Transform part of your body to gain bestial benefits for 10 minutes.',
      details: 'Choose one: claws (+1d4 damage to unarmed strikes), enhanced senses (advantage on Perception), or natural armor (+1 Armor). The transformation lasts 10 minutes.'
    }
  ],

  reaver: [
    {
      name: 'Adrenaline Rush',
      type: 'Active',
      usage: '1/Short Rest',
      description: 'Enter an adrenaline-fueled state for 1 minute, gaining temporary hit points and increased speed.',
      details: 'For 1 AP, gain temporary hit points equal to your level and increase your movement speed by 10 feet for 1 minute. While active, you have advantage on Strength checks and saves.'
    },
    {
      name: 'Devastating Strike',
      type: 'Active',
      usage: '1/Short Rest',
      description: 'Add your Strength modifier to damage again and potentially knock the target prone.',
      details: 'When you hit with a melee weapon attack, you can add your Strength modifier to the damage roll again. If the target is Large or smaller, it must make a Strength save or be knocked prone.'
    }
  ],

  mercenary: [
    {
      name: 'Combat Expertise',
      type: 'Passive',
      usage: 'Always Active',
      description: 'Gain proficiency with three weapons of your choice or +1 to attack rolls with already proficient weapons.',
      details: 'Choose three weapons to gain proficiency with, or if already proficient with three or more weapons, gain +1 to attack rolls with weapons you\'re proficient with.'
    },
    {
      name: 'Tactical Assessment',
      type: 'Active',
      usage: 'At Will',
      description: 'Assess a creature to learn its Armor, hit point percentage, and one damage vulnerability, resistance, or immunity.',
      details: 'As an action, choose a creature you can see. Learn its Armor, approximate hit point percentage (full, bloodied, near death), and one damage vulnerability, resistance, or immunity of your choice.'
    },
    {
      name: 'Dirty Fighting',
      type: 'Active',
      usage: '1/Short Rest',
      description: 'Force a target to make a Constitution save or be blinded or immobilized until the end of your next turn.',
      details: 'When you hit with a weapon attack, you can force the target to make a Constitution save. On a failure, choose to blind or immobilize them until the end of your next turn.'
    }
  ],

  sentinel: [
    {
      name: 'Protective Aura',
      type: 'Passive',
      usage: 'Always Active',
      description: 'Grant allies within 10 feet a +1 bonus to Armor and potentially increase it further as a reaction.',
      details: 'Allies within 10 feet of you gain +1 Armor. As a reaction when an ally within 10 feet is attacked, you can grant them an additional +2 Armor against that attack.'
    },
    {
      name: 'Planar Sense',
      type: 'Passive',
      usage: 'Always Active',
      description: 'Sense portals or weak points between planes and resist planar displacement effects.',
      details: 'You can sense portals, dimensional rifts, and planar boundaries within 60 feet. You have advantage on saves against teleportation, banishment, and other planar displacement effects.'
    },
    {
      name: 'Ward of Protection',
      type: 'Active',
      usage: '1/Long Rest',
      description: 'Create a 15-foot-radius ward that grants allies resistance to one damage type and damages enemies.',
      details: 'As an action, create a 15-foot radius ward centered on you that lasts 1 minute. Choose a damage type. Allies in the ward have resistance to that damage, and enemies take 1d6 damage of that type when they start their turn in the ward.'
    }
  ]
};

// Helper functions
export const getBackgroundAbilities = (backgroundId) => {
  return BACKGROUND_ABILITIES[backgroundId] || [];
};

export const getAllBackgroundAbilities = () => {
  return BACKGROUND_ABILITIES;
};

export const getBackgroundAbilityByName = (backgroundId, abilityName) => {
  const abilities = getBackgroundAbilities(backgroundId);
  return abilities.find(ability => ability.name === abilityName) || null;
};

export const getPassiveAbilities = (backgroundId) => {
  const abilities = getBackgroundAbilities(backgroundId);
  return abilities.filter(ability => ability.type === 'Passive');
};

export const getActiveAbilities = (backgroundId) => {
  const abilities = getBackgroundAbilities(backgroundId);
  return abilities.filter(ability => ability.type === 'Active');
};
