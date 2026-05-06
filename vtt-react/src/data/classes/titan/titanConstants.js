/**
 * Titan Shared Constants
 * 
 * Single source of truth for all celestial devotion data.
 * Both titanData.js and TitanResourceBar.jsx import from this file
 * to prevent data drift between class rules and UI.
 */

export const DEVOTIONS = {
  solara: {
    id: 'solara',
    name: 'Solara',
    title: 'The Radiant Sun',
    icon: 'fa-sun',

    benefit: '+1d6 radiant damage on melee attacks',
    benefitShort: '+1d6 radiant melee',

    ultimateName: 'Solar Flare',
    ultimateShort: '3d8 radiant, blind 1 turn (10 ft)',
    ultimate: {
      damage: '3d8',
      elementType: 'radiant',
      aoeRadius: 10,
      aoeUnit: 'feet',
      debuff: 'blinded',
      debuffDuration: 1,
      usesPerLongRest: 1
    },

    restriction: 'Enemies have advantage on attacks against you in bright light',
    restrictionShort: 'Adv. on you in bright light',

    championRestrictionIncrease: 'Bright light radius expands from 30 ft to 60 ft. Advantage applies to all enemies within 60 ft.',

    colors: {
      base: '#B8860B',
      active: '#FFD700',
      glow: '#FFA500'
    }
  },

  lunara: {
    id: 'lunara',
    name: 'Lunara',
    title: 'The Moon Guardian',
    icon: 'fa-moon',

    benefit: '+2 Armor, regenerate 5 HP at start of each turn',
    benefitShort: '+2 Armor, 5 HP/turn regen',

    ultimateName: 'Lunar Shield',
    ultimateShort: 'Absorb 50 damage for all allies (15 ft)',
    ultimate: {
      shieldValue: 50,
      aoeRadius: 15,
      aoeUnit: 'feet',
      shieldType: 'absorption',
      targets: 'allies',
      usesPerLongRest: 1
    },

    restriction: 'Healing received from external sources is halved',
    restrictionShort: 'Ext. healing halved',

    championRestrictionIncrease: 'External healing reduced to 25% (instead of 50%). Self-healing from regeneration increased by 50%.',

    colors: {
      base: '#4682B4',
      active: '#87CEEB',
      glow: '#B0E0E6'
    }
  },

  astraeus: {
    id: 'astraeus',
    name: 'Astraeus',
    title: 'The Star Sage',
    icon: 'fa-star',

    benefit: '+10 ft movement speed, advantage on Agility saving throws',
    benefitShort: '+10 ft move, Agi save adv.',

    ultimateName: 'Starfall',
    ultimateShort: '4d6 force, stun 1 turn (60 ft range)',
    ultimate: {
      damage: '4d6',
      elementType: 'force',
      range: 60,
      rangeUnit: 'feet',
      targeting: 'single',
      debuff: 'stunned',
      debuffDuration: 1,
      usesPerLongRest: 1
    },

    restriction: 'Take +1d6 damage from non-magical attacks',
    restrictionShort: '+1d6 from non-magic attacks',

    championRestrictionIncrease: 'Extra damage from non-magical attacks increased to +2d6 (instead of +1d6).',

    colors: {
      base: '#6A5ACD',
      active: '#9370DB',
      glow: '#BA55D3'
    }
  },

  terranox: {
    id: 'terranox',
    name: 'Terranox',
    title: 'The Earth Titan',
    icon: 'fa-mountain',

    benefit: '+20 HP, resistance to bludgeoning/piercing/slashing damage',
    benefitShort: '+20 HP, phys resist',

    ultimateName: 'Earthquake',
    ultimateShort: '3d6 bludgeoning, knock prone (20 ft)',
    ultimate: {
      damage: '3d6',
      elementType: 'bludgeoning',
      aoeRadius: 20,
      aoeUnit: 'feet',
      debuff: 'prone',
      usesPerLongRest: 1
    },

    restriction: 'Movement speed reduced by 10 feet',
    restrictionShort: '-10 ft speed',

    championRestrictionIncrease: 'Movement speed reduced by 20 feet (instead of 10). Cannot use Dash action.',

    colors: {
      base: '#654321',
      active: '#8B4513',
      glow: '#A0522D'
    }
  },

  zephyra: {
    id: 'zephyra',
    name: 'Zephyra',
    title: 'The Wind Spirit',
    icon: 'fa-wind',

    benefit: '+2 attack speed, melee attacks deal +1d4 lightning damage',
    benefitShort: '+2 atk speed, +1d4 lightning',

    ultimateName: 'Wind Dash',
    ultimateShort: 'Teleport 30 ft, 3d6 lightning (5 ft AoE)',
    ultimate: {
      damage: '3d6',
      elementType: 'lightning',
      teleportDistance: 30,
      teleportUnit: 'feet',
      aoeRadius: 5,
      aoeUnit: 'feet',
      aoeLocation: 'destination',
      usesPerLongRest: 1
    },

    restriction: '10% chance to be knocked back 5 feet when taking damage',
    restrictionShort: '10% knockback on hit',

    championRestrictionIncrease: 'Knockback chance increased to 25% (instead of 10%). Knockback distance increased to 10 ft.',

    colors: {
      base: '#5F9EA0',
      active: '#00CED1',
      glow: '#AFEEEE'
    }
  }
};

export const SPECIALIZATIONS = {
  celestialChampion: {
    id: 'celestial-champion',
    name: 'Celestial Champion',
    icon: 'Radiant/Radiant Bolt',
    color: '#FFD700',
    passive: 'Divine Amplification',
    passiveDesc: 'Devotion passive benefits increased by 50%. Can use ultimate ability twice per long rest. Allies within 10 ft gain 25% of your devotion benefits.',
    restrictionNote: 'Devotion restrictions are also enhanced — see each devotion for the specific increase.'
  },
  divineConduit: {
    id: 'divine-conduit',
    name: 'Divine Conduit',
    icon: 'Radiant/Divine Radiance',
    color: '#87CEEB',
    passive: 'Balanced Channeling',
    passiveDesc: 'Devotion restrictions reduced by 50%. Devotion benefits reduced by 25%. Can attune to a second devotion at 50% effectiveness. Can switch devotions during one short rest per day.'
  },
  astralWarrior: {
    id: 'astral-warrior',
    name: 'Astral Warrior',
    icon: 'Arcane/Missile',
    color: '#9370DB',
    passive: 'Combat Versatility',
    passiveDesc: 'Can switch devotions for 1 AP (3 uses per long rest). Switching triggers a burst effect based on the new devotion. When you switch, your ultimate availability transfers to the new devotion.'
  }
};

export const BURST_EFFECTS = {
  solara: '2d6 radiant damage to nearest enemy within 10 ft',
  lunara: 'Gain 15 temporary HP',
  astraeus: 'Gain +10 ft movement speed until end of turn',
  terranox: 'Gain +2 Armor until end of turn',
  zephyra: 'Gain advantage on next attack roll'
};

export const TITAN_MANA = {
  basePool: 60,
  perLevel: 5,
  regenPerTurn: 5,
  shortRestRecovery: 0.5,
  devotionAbilitiesCost: 0,
  note: 'Devotion passives and ultimates (Levels 1-3) cost no mana. Level 4+ active spells cost mana as listed in their resourceCost fields.'
};
