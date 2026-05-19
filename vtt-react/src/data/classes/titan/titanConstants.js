/**
 * Titan Shared Constants - The Ossified Juggernaut
 * 
 * Single source of truth for all Calcification and Mass devotion data.
 * Both titanData.js and TitanResourceBar.jsx import from this file
 * to prevent data drift between class rules and UI.
 */

export const DEVOTIONS = {
  solara: {
    id: 'solara',
    name: 'Marrow-Burn',
    title: 'The Solaris Mortis',
    icon: 'fa-sun',

    benefit: 'Your skeleton heats to a white-hot calcium burn. Melee attacks deal +1d6 radiant (searing calcium) damage and generate +10 Calcification Mass on hit.',
    benefitShort: '+1d6 radiant, +10 Calcification on hit',

    ultimateName: 'Bleached Flare',
    ultimateShort: '3d8 radiant, blind 1 turn (10 ft). Cost: 30 Calcification.',
    ultimate: {
      damage: '3d8',
      elementType: 'radiant',
      aoeRadius: 10,
      aoeUnit: 'feet',
      debuff: 'blinded',
      debuffDuration: 1,
      usesPerLongRest: 1,
      calcificationCost: 30
    },

    restriction: 'Terminal Inertia: Dodge is 0. All attacks against you have advantage. You are vulnerable to Acid damage (+50% damage taken, dissolves 20 Calcification on hit).',
    restrictionShort: 'Dodge is 0, Adv on you. Acid vulnerability.',

    championRestrictionIncrease: 'Sickening white glow expands to 60 ft. Acid vulnerability increases to +100% damage taken and instantly drains all Calcification on hit.',

    colors: {
      base: '#5A5652',
      active: '#DFDCD6',
      glow: '#C0BAAF'
    }
  },

  lunara: {
    id: 'lunara',
    name: 'Pale Tomb',
    title: 'The Cadaverous Crust',
    icon: 'fa-moon',

    benefit: 'Fossilized bone covers your joints. Gain +2 Armor and +10 Calcification at the start of each turn. When hit, generate +5 Calcification.',
    benefitShort: '+2 Armor, +10 Calcification/turn, +5 on hit',

    ultimateName: 'Ossified Wall',
    ultimateShort: 'Absorb 50 damage for all allies (15 ft). Cost: 40 Calcification.',
    ultimate: {
      shieldValue: 50,
      aoeRadius: 15,
      aoeUnit: 'feet',
      shieldType: 'absorption',
      targets: 'allies',
      usesPerLongRest: 1,
      calcificationCost: 40
    },

    restriction: 'Terminal Inertia: External healing received is halved. Movement speed is reduced by 10 ft. You automatically fail Agility saving throws.',
    restrictionShort: 'Ext. healing halved, -10 ft speed, fail Agility saves.',

    championRestrictionIncrease: 'External healing reduced to 25%. Movement speed reduced by 20 ft. Acid damage melts your crust, dealing double damage.',

    colors: {
      base: '#3A4B56',
      active: '#768A96',
      glow: '#BACAD6'
    }
  },

  astraeus: {
    id: 'astraeus',
    name: 'Crushing Core',
    title: 'The Starless Singularity',
    icon: 'fa-star',

    benefit: 'Distort localized gravity. Melee attacks pull enemies 5 ft closer, dealing +1d6 force damage and generating +15 Calcification.',
    benefitShort: 'Pull enemies, +1d6 force, +15 Calcification on hit',

    ultimateName: 'Gravitational Collapse',
    ultimateShort: '4d6 force, stun 1 turn (60 ft range). Cost: 30 Calcification.',
    ultimate: {
      damage: '4d6',
      elementType: 'force',
      range: 60,
      rangeUnit: 'feet',
      targeting: 'single',
      debuff: 'stunned',
      debuffDuration: 1,
      usesPerLongRest: 1,
      calcificationCost: 30
    },

    restriction: 'Terminal Inertia: Dodge is 0. Agility saving throws take disadvantage and you take double damage from Acid which melts your joints.',
    restrictionShort: 'Dodge is 0, Agility save disadvantage, Acid vulnerability.',

    championRestrictionIncrease: 'Micro-fractured bones take +2d6 damage from all non-magical physical attacks.',

    colors: {
      base: '#2C1B35',
      active: '#583D70',
      glow: '#9370DB'
    }
  },

  terranox: {
    id: 'terranox',
    name: 'Fossilized Tomb',
    title: 'The Petrified Monolith',
    icon: 'fa-mountain',

    benefit: 'Muscle tissue petrifies into stone. Gain +20 Max HP, physical damage resistance, and +15 Calcification when taking physical damage.',
    benefitShort: '+20 HP, phys resist, +15 Calcification on hit',

    ultimateName: 'Tectonic Slam',
    ultimateShort: '3d6 bludgeoning, knock prone (20 ft). Cost: 40 Calcification.',
    ultimate: {
      damage: '3d6',
      elementType: 'bludgeoning',
      aoeRadius: 20,
      aoeUnit: 'feet',
      debuff: 'prone',
      usesPerLongRest: 1,
      calcificationCost: 40
    },

    restriction: 'Terminal Inertia: Dodge is 0. Movement speed reduced by 15 ft. You take double damage from Acid which dissolves your fossilized layer.',
    restrictionShort: 'Dodge is 0, -15 ft speed, Acid vulnerability.',

    championRestrictionIncrease: 'Movement speed reduced by 25 ft. You cannot Dash or Jump. Acid damage melts your stone skin, draining all Calcification.',

    colors: {
      base: '#281F1C',
      active: '#533C33',
      glow: '#8D6E63'
    }
  },

  zephyra: {
    id: 'zephyra',
    name: 'Flayed Gale',
    title: 'The Sharded Marrow',
    icon: 'fa-wind',

    benefit: 'Shattered calcium spikes tear your skin. Melee attacks deal +1d4 lightning damage and generate +10 Calcification. Gain +2 attack speed.',
    benefitShort: '+2 attack speed, +1d4 lightning, +10 Calcification on hit',

    ultimateName: 'Splinter Dash',
    ultimateShort: 'Teleport 30 ft, explode in bone shards dealing 3d6 lightning. Cost: 30 Calcification.',
    ultimate: {
      damage: '3d6',
      elementType: 'lightning',
      teleportDistance: 30,
      teleportUnit: 'feet',
      aoeRadius: 5,
      aoeUnit: 'feet',
      aoeLocation: 'destination',
      usesPerLongRest: 1,
      calcificationCost: 30
    },

    restriction: 'Terminal Inertia: Agility saving throws take disadvantage. Suffer Acid vulnerability. 25% chance to be knocked back 10 ft when hit as bones splinter.',
    restrictionShort: 'Agility save disadv, Acid vulnerability, 25% knockback when hit.',

    championRestrictionIncrease: 'Knockback chance increased to 50% and knockback distance to 15 ft. Acid damage splinters your marrow, dealing +15 slashing damage.',

    colors: {
      base: '#4A1D1D',
      active: '#8E2424',
      glow: '#B71C1C'
    }
  }
};

export const SPECIALIZATIONS = {
  celestialChampion: {
    id: 'celestial-champion',
    name: 'Ossified Scion',
    icon: 'Radiant/Radiant Bolt',
    color: '#EBE6DD',
    passive: 'Bone-Grafted Ascendancy',
    passiveDesc: 'Your body is a graveyard. Your Calcification benefits are increased by 50%. You can use your ultimate ability twice per long rest. Allies within 10 ft gain 25% of your bone density (Armor +1).',
    restrictionNote: 'Devotion restrictions are doubled, and you take double damage from Acid.'
  },
  divineConduit: {
    id: 'divine-conduit',
    name: 'Vessel of Bone-Marrow',
    icon: 'Radiant/Divine Radiance',
    color: '#768A96',
    passive: 'Marrow-Flux Harmony',
    passiveDesc: 'You have carved drainage channels into your bones. Calcification restrictions are halved. You can attune to a secondary bone attunement at 50% effectiveness. Can switch forms during one short rest per day.'
  },
  astralWarrior: {
    id: 'astral-warrior',
    name: 'Gravitational Rupture',
    icon: 'Arcane/Missile',
    color: '#583D70',
    passive: 'Terminal Weightless-Burst',
    passiveDesc: 'You can instantly fracture and rebuild your skeletal structure. Switch bone attunements mid-combat for 1 AP (3 uses per long rest). Switching triggers a bone-shattering shockwave.'
  }
};

export const BURST_EFFECTS = {
  solara: '3d6 radiant calcium burn to nearest enemy within 10 ft',
  lunara: 'Gain 20 temporary HP of calcified tissue',
  astraeus: 'Pulses a gravitational pull, pulling all enemies within 15 ft closer by 10 ft',
  terranox: 'Erect an earthen barricade, gaining +3 Armor until end of turn',
  zephyra: 'Explode bone splinters, dealing 2d8 slashing to all enemies within 5 ft'
};

export const TITAN_MANA = {
  basePool: 60,
  perLevel: 5,
  regenPerTurn: 5,
  shortRestRecovery: 0.5,
  devotionAbilitiesCost: 0,
  note: 'Calcification / Bone Density abilities (Levels 1-3) cost Calcification and no mana. Level 4+ active spells cost mana and interact directly with Calcification.'
};
