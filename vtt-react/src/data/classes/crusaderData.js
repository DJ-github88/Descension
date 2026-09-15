import { UTILITY_SPELLS } from '../spells/utilitySpells';

/**
 * Crusader Class Data
 *
 * Complete class information for the Crusader - The Sol-Bound Zealot.
 * A heavy starlight-forged juggernaut who channels Aex's Willing Sacrifice
 * to re-enforce the binding frequency and execute Wyrd corruption.
 */

export const CRUSADER_ABILITIES = [

    // ===== NON-COMBAT & REACTION UTILITIES =====
    {
      id: "crusader_sanctified_hearth",
      name: "Sanctified Hearth",
      description: "Consecrate a 20ft campsite with starlight runes. Prevents nighttime ambushes, alerts the party to approaching threats, and allows restful sleep. Out of combat.",
      level: 1,
      spellType: "ACTION",
      icon: "Utility/Embraced by Fire",
      effectTypes: ["utility", "buff"],
      typeConfig: { school: "sacred", icon: "Utility/Embraced by Fire", tags: ["utility", "camp", "protection", "crusader"], castTime: 5, castTimeType: "MINUTES" },
      targetingConfig: { targetingType: "area", rangeType: "self", areaType: "circle", areaSize: 20, targetRestrictions: ["ally", "self"] },
      resourceCost: { actionPoints: 1, mana: 4 },
      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      tags: ["utility", "camp", "protection", "crusader"]
    },
    {
      id: "crusader_beacon_of_truth",
      name: "Beacon of Truth",
      description: "Ignite your greatsword with Aex's unburied light for 1 hour. Illuminates hidden passages, invisible runes, and reveals undead or Wyrd entities in 60ft. Out of combat.",
      level: 1,
      spellType: "ACTION",
      icon: "Radiant/Radiant Divinity",
      effectTypes: ["utility", "detection"],
      typeConfig: { school: "sacred", icon: "Radiant/Radiant Divinity", tags: ["utility", "light", "detection", "crusader"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "self", rangeType: "self" },
      resourceCost: { actionPoints: 1, mana: 3 },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
      tags: ["utility", "light", "detection", "crusader"]
    },
    {
      id: "crusader_starlight_interposition",
      name: "Starlight Interposition",
      description: "REACTION: Interpose your starlight shield when an ally within 10ft takes damage, reducing the damage by 50% and generating +10 Fervor.",
      level: 2,
      spellType: "REACTION",
      icon: "Radiant/Radiant Golden Shield",
      effectTypes: ["buff", "defense"],
      typeConfig: { school: "sacred", icon: "Radiant/Radiant Golden Shield", tags: ["reaction", "defense", "shield", "crusader"], castTime: 0, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "single", rangeType: "ranged", rangeDistance: 10, targetRestrictions: ["ally"] },
      resourceCost: { actionPoints: 0, mana: 4, classResource: { type: "fervor", gain: 10 } },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },
      tags: ["reaction", "defense", "shield", "crusader"]
    },
  

    // ===== EXPANDED CRUSADER SPELLS =====
    {
      id: "crusader_solar_beacon",
      name: "Solar Beacon",
      description: "Plant a pillar of consecrated starlight. Allies within 15ft gain +2 to saves and recover 1d6 HP per round. Deals sacred damage to undead/wyrd foes.",
      level: 3,
      spellType: "ACTION",
      icon: "Radiant/Radiant Divinity",
      effectTypes: ["buff", "healing", "damage"],
      typeConfig: { school: "sacred", icon: "Radiant/Radiant Divinity", tags: ["sacred", "aoe", "beacon", "crusader"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "area", rangeType: "ranged", rangeDistance: 40, areaType: "circle", areaSize: 15, targetRestrictions: ["all"] },
      resourceCost: { actionPoints: 1, mana: 5, classResource: { type: "fervor", gain: 10 } },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
      damageConfig: { formula: "2d6 + spirit", damageTypes: ["sacred"], resolution: "DICE" },
      customMechanic: "Generates +10 Fervor."
    },
    {
      id: "crusader_aegis_of_the_martyred_sun",
      name: "Aegis of the Martyred Sun",
      description: "Surround an ally in a blazing solar mantle. Absorbs 40 damage and retaliates with 2d8 sacred damage to any melee attacker.",
      level: 5,
      spellType: "ACTION",
      icon: "Radiant/Radiant Golden Shield",
      effectTypes: ["buff", "shield"],
      typeConfig: { school: "sacred", icon: "Radiant/Radiant Golden Shield", tags: ["sacred", "shield", "retaliation", "crusader"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "single", rangeType: "ranged", rangeDistance: 30, targetRestrictions: ["ally"] },
      resourceCost: { actionPoints: 1, mana: 8, classResource: { type: "fervor", cost: 25 } },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
      customMechanic: "Spends 25 Fervor. Absorbs 40 damage and retaliates for 2d8 sacred."
    },
    {
      id: "crusader_judgment_day_cataclysm",
      name: "Solar Cataclysm Judgment",
      description: "Call down the wrath of Aex's unburied light in a 30ft radius. Deals massive sacred and smashing damage, sundering all dark enchantments.",
      level: 9,
      spellType: "ACTION",
      icon: "Radiant/Radiant Divinity",
      effectTypes: ["damage", "dispel"],
      typeConfig: { school: "sacred", icon: "Radiant/Radiant Divinity", tags: ["sacred", "aoe", "judgment", "crusader"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "area", rangeType: "ranged", rangeDistance: 60, areaType: "circle", areaSize: 30, targetRestrictions: ["enemy"] },
      resourceCost: { actionPoints: 2, mana: 15, classResource: { type: "fervor", cost: 100 } },
      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      damageConfig: { formula: "8d10 + strength * 2", damageTypes: ["sacred", "smashing"], resolution: "DICE" },
      customMechanic: "Spends 100 Fervor."
    },
  
  // ━━━ LEVEL 1 ━━━
  {
    id: 'starlight_cleave',
    name: 'Starlight Cleave',
    description: 'Sweep a heavy 2H greatsword in a wide arc infused with Aex\'s song, cutting through enemy ranks and generating holy fervor.',
    level: 1,
    spellType: 'ACTION',
    icon: 'Radiant/Radiant Divinity',
    effectTypes: ['damage'],
    typeConfig: {
      school: 'sacred',
      icon: 'Radiant/Radiant Divinity',
      tags: ['sacred', 'smashing', 'melee', 'builder'],
      castTime: 1,
      castTimeType: 'IMMEDIATE'
    },
    targetingConfig: {
      targetingType: 'cone',
      rangeType: 'melee',
      rangeDistance: 5,
      areaSize: 10,
      targetRestrictions: ['enemies']
    },
    resourceCost: {
      actionPoints: 2,
      mana: 0, classResource: { type: "fervor", gain: 15 } },
    cooldownConfig: {
      cooldownType: 'turn_based',
      cooldownValue: 0
    },
    damageConfig: {
      formula: '1d10 + strength + 1d6',
      damageTypes: ['smashing', 'sacred'],
      resolution: 'DICE'
    },
    customMechanic: 'Generates +15 Fervor on hit.'
  },
  {
    id: 'zealous_strike',
    name: 'Zealous Strike',
    description: 'A direct overhead greatsword smash that drives holy force into a single foe, staggering their posture.',
    level: 1,
    spellType: 'ACTION',
    icon: 'Radiant/Divine Downward Sword',
    effectTypes: ['damage', 'debuff'],
    typeConfig: {
      school: 'sacred',
      icon: 'Radiant/Divine Downward Sword',
      tags: ['sacred', 'melee', 'single_target', 'builder'],
      castTime: 1,
      castTimeType: 'IMMEDIATE'
    },
    targetingConfig: {
      targetingType: 'single',
      rangeType: 'melee',
      rangeDistance: 5,
      targetRestrictions: ['enemies']
    },
    resourceCost: {
      actionPoints: 1,
      mana: 0, classResource: { type: "fervor", gain: 10 } },
    cooldownConfig: {
      cooldownType: 'turn_based',
      cooldownValue: 0
    },
    damageConfig: {
      formula: '1d8 + strength + 2',
      damageTypes: ['sacred', 'smashing'],
      resolution: 'DICE'
    },
    customMechanic: 'Generates +10 Fervor.'
  },
  {
    id: 'bastion_stance',
    name: 'Bastion Stance',
    description: 'Brace your greatsword or tower shield, locking your boots into the earth to gain +2 Active Soak die bonuses.',
    level: 1,
    spellType: 'ACTION',
    icon: 'Radiant/Radiant Golden Shield',
    effectTypes: ['buff'],
    typeConfig: {
      school: 'sacred',
      icon: 'Radiant/Radiant Golden Shield',
      tags: ['sacred', 'buff', 'defense'],
      castTime: 1,
      castTimeType: 'IMMEDIATE'
    },
    targetingConfig: {
      targetingType: 'self',
      rangeType: 'self',
      targetRestrictions: ['self']
    },
    resourceCost: {
      actionPoints: 1,
      mana: 0
    },
    cooldownConfig: {
      cooldownType: 'turn_based',
      cooldownValue: 1
    },
    buffConfig: {
      buffType: 'damageMitigation',
      effects: [
        { id: 'bastion_guard', name: 'Bastion Stance', description: '+2 to Active Soak Die rolls; cannot be forcibly moved or knocked prone for 1 round.', mechanicsText: '' }
      ]
    }
  },

  // ━━━ LEVEL 2 ━━━
  {
    id: 'radiant_guard',
    name: 'Radiant Guard',
    description: 'Channel Fervor into heavy bulwark plate, surrounding yourself or an ally with a pulsing barrier of starlight.',
    level: 2,
    spellType: 'ACTION',
    icon: 'Utility/Barred Shield',
    effectTypes: ['buff'],
    typeConfig: {
      school: 'sacred',
      icon: 'Radiant/Radiant Golden Shield',
      tags: ['sacred', 'buff', 'defense'],
      castTime: 1,
      castTimeType: 'IMMEDIATE'
    },
    targetingConfig: {
      targetingType: 'single',
      rangeType: 'ranged',
      rangeDistance: 30,
      targetRestrictions: ['ally', 'self']
    },
    resourceCost: {
      actionPoints: 1,
      mana: 0,
      classResource: { type: 'fervor', amount: 20 }
    },
    cooldownConfig: {
      cooldownType: 'turn_based',
      cooldownValue: 1
    },
    buffConfig: {
      buffType: 'damageMitigation',
      effects: [
        { id: 'radiant_soak', name: 'Radiant Guard', description: '+2 bonus to Active Soak Die rolls and 10 temporary HP for 2 rounds.', mechanicsText: '' }
      ]
    }
  },
  {
    id: 'consecrated_sweep',
    name: 'Consecrated Sweep',
    description: 'Drag your glowing blade across the ground, igniting a 10 ft semi-circle of sanctified ground that burns Wyrd-tainted foes.',
    level: 2,
    spellType: 'ACTION',
    icon: 'Radiant/Radiant Divinity',
    effectTypes: ['damage', 'ground_effect'],
    typeConfig: {
      school: 'sacred',
      icon: 'Radiant/Radiant Divinity',
      tags: ['sacred', 'aoe', 'ground'],
      castTime: 1,
      castTimeType: 'IMMEDIATE'
    },
    targetingConfig: {
      targetingType: 'cone',
      rangeType: 'melee',
      rangeDistance: 10,
      areaSize: 10,
      targetRestrictions: ['enemies']
    },
    resourceCost: {
      actionPoints: 2,
      mana: 0
    },
    cooldownConfig: {
      cooldownType: 'turn_based',
      cooldownValue: 1
    },
    damageConfig: {
      formula: '2d6 + strength',
      damageTypes: ['sacred'],
      resolution: 'DICE'
    },
    customMechanic: 'Ground burns for 2 rounds; enemies ending turn inside take 1d6 sacred damage.'
  },

  // ━━━ LEVEL 3 ━━━
  {
    id: 'zealots_inquisitive_eye',
    name: 'Zealot\'s Inquisitive Eye',
    description: 'Channel Aex\'s pure light through your eyes to detect Wyrd-taint in food, soil, or civilian bloodlines.',
    level: 3,
    spellType: 'CHANNELED',
    icon: 'Utility/Barred Shield',
    effectTypes: ['buff'],
    typeConfig: {
      school: 'sacred',
      icon: 'Psychic/Psychic Telepathy',
      tags: ['utility', 'rp', 'detection'],
      castTime: 1,
      castTimeType: 'IMMEDIATE'
    },
    targetingConfig: {
      targetingType: 'self',
      rangeType: 'self',
      targetRestrictions: ['self']
    },
    resourceCost: {
      actionPoints: 1,
      mana: 0
    },
    cooldownConfig: {
      cooldownType: 'turn_based',
      cooldownValue: 0
    },
    buffConfig: {
      buffType: 'custom',
      effects: [
        { id: 'wyrd_sense', name: 'Starlight Vision', description: 'Gain Advantage on Perception and Investigation checks to detect Wyrd corruption for 10 minutes.', mechanicsText: '' }
      ]
    }
  },
  {
    id: 'fervent_charge',
    name: 'Fervent Charge',
    description: 'Rush up to 30 feet in a straight line with blade lowered, slamming into an enemy to knock them back and generate massive Fervor.',
    level: 3,
    spellType: 'ACTION',
    icon: 'Utility/Bent Leg Motion',
    effectTypes: ['damage', 'mobility', 'debuff'],
    typeConfig: {
      school: 'sacred',
      icon: 'Utility/Bent Leg Motion',
      tags: ['sacred', 'mobility', 'smashing', 'gap_closer'],
      castTime: 1,
      castTimeType: 'IMMEDIATE'
    },
    targetingConfig: {
      targetingType: 'single',
      rangeType: 'ranged',
      rangeDistance: 30,
      targetRestrictions: ['enemies']
    },
    resourceCost: {
      actionPoints: 2,
      mana: 0, classResource: { type: "fervor", gain: 15 } },
    cooldownConfig: {
      cooldownType: 'turn_based',
      cooldownValue: 2
    },
    damageConfig: {
      formula: '2d8 + strength',
      damageTypes: ['smashing', 'sacred'],
      resolution: 'DICE'
    },
    customMechanic: 'Generates +20 Fervor. Target pushed 10 ft back.'
  },

  // ━━━ LEVEL 4 ━━━
  {
    id: 'righteous_upheaval',
    name: 'Righteous Upheaval',
    description: 'Slam your greatsword into the volcanic earth, erupting a wave of starlight and stone in a 15 ft cone.',
    level: 4,
    spellType: 'ACTION',
    icon: 'Radiant/Divine Beam',
    effectTypes: ['damage', 'debuff'],
    typeConfig: {
      school: 'sacred',
      icon: 'Bludgeoning/Stomp',
      tags: ['sacred', 'smashing', 'aoe', 'control'],
      castTime: 1,
      castTimeType: 'IMMEDIATE'
    },
    targetingConfig: {
      targetingType: 'cone',
      rangeType: 'melee',
      rangeDistance: 15,
      areaSize: 15,
      targetRestrictions: ['enemies']
    },
    resourceCost: {
      actionPoints: 2,
      mana: 0
    },
    cooldownConfig: {
      cooldownType: 'turn_based',
      cooldownValue: 2
    },
    damageConfig: {
      formula: '2d8 + strength',
      damageTypes: ['smashing', 'sacred'],
      resolution: 'DICE',
      savingThrow: {
        ability: 'strength',
        difficultyClass: 14,
        saveOutcome: 'half_damage'
      }
    },
    debuffConfig: {
      debuffType: 'statusEffect',
      effects: [
        { id: 'prone', name: 'Prone', description: 'Knocked Prone on a failed STR Save.', mechanicsText: '' }
      ]
    }
  },
  {
    id: 'solvan_retribution',
    name: 'Solvan Retribution',
    description: 'Inscribe a starlight cross on your chestplate. When an enemy hits you with a melee strike, release an immediate 10 ft radiant shockwave.',
    level: 4,
    spellType: 'REACTION',
    icon: 'Radiant/Divine Downward Sword',
    effectTypes: ['damage', 'buff'],
    typeConfig: {
      school: 'sacred',
      icon: 'Radiant/Divine Downward Sword',
      tags: ['sacred', 'reaction', 'retaliation'],
      castTime: 1,
      castTimeType: 'IMMEDIATE'
    },
    targetingConfig: {
      targetingType: 'self',
      rangeType: 'self',
      targetRestrictions: ['self']
    },
    resourceCost: {
      actionPoints: 1,
      mana: 0,
      classResource: { type: 'fervor', amount: 25 }
    },
    cooldownConfig: {
      cooldownType: 'turn_based',
      cooldownValue: 2
    },
    damageConfig: {
      formula: '2d6 + spirit',
      damageTypes: ['sacred'],
      resolution: 'DICE'
    }
  },

  // ━━━ LEVEL 5 ━━━
  {
    id: 'chakram_of_aex',
    name: 'Chakram of Aex',
    description: 'Hurl a spinning disc of crystallized starlight 30 ft down a line, slicing foes before returning to hand.',
    level: 5,
    spellType: 'ACTION',
    icon: 'Utility/Bent Leg Motion',
    effectTypes: ['damage'],
    typeConfig: {
      school: 'sacred',
      icon: 'Radiant/Holy Cross',
      tags: ['sacred', 'line', 'ranged'],
      castTime: 1,
      castTimeType: 'IMMEDIATE'
    },
    targetingConfig: {
      targetingType: 'line',
      rangeType: 'ranged',
      rangeDistance: 30,
      areaSize: 5,
      targetRestrictions: ['enemies']
    },
    resourceCost: {
      actionPoints: 2,
      mana: 0
    },
    cooldownConfig: {
      cooldownType: 'turn_based',
      cooldownValue: 2
    },
    damageConfig: {
      formula: '3d8 + strength',
      damageTypes: ['sacred'],
      resolution: 'DICE'
    }
  },
  {
    id: 'harmonic_smite',
    name: 'Harmonic Smite',
    description: 'Requires Harmonic Stance (50+ Fervor). Strike with intense acoustic resonance, sundering 50% of the target\'s Passive DR.',
    level: 5,
    spellType: 'ACTION',
    icon: 'Radiant/Divine Beam',
    effectTypes: ['damage', 'debuff'],
    typeConfig: {
      school: 'sacred',
      icon: 'Radiant/Divine Beam',
      tags: ['sacred', 'smite', 'harmonic', 'durability_shred'],
      castTime: 1,
      castTimeType: 'IMMEDIATE'
    },
    targetingConfig: {
      targetingType: 'single',
      rangeType: 'melee',
      rangeDistance: 5,
      targetRestrictions: ['enemies']
    },
    resourceCost: {
      actionPoints: 2,
      mana: 0,
      classResource: { type: 'fervor', amount: 30 }
    },
    cooldownConfig: {
      cooldownType: 'turn_based',
      cooldownValue: 1
    },
    damageConfig: {
      formula: '3d10 + strength + 1d8',
      damageTypes: ['sacred', 'smashing'],
      resolution: 'DICE'
    },
    debuffConfig: {
      debuffType: 'statusEffect',
      effects: [
        { id: 'sundered', name: 'Sundered DR', description: 'Target Passive DR reduced by 3 for 2 rounds.', mechanicsText: '' }
      ]
    }
  },

  // ━━━ LEVEL 6 ━━━
  {
    id: 'sanctified_hearth',
    name: 'Sanctified Hearth',
    description: 'Plant your greatsword into the snow or stone for 10 minutes, creating a 20 ft warm holy zone that melts ice barriers and shields allies.',
    level: 6,
    spellType: 'CHANNELED',
    icon: 'Fire/Burning Forge',
    effectTypes: ['buff'],
    typeConfig: {
      school: 'ember',
      icon: 'Utility/Embraced by Fire',
      tags: ['utility', 'rp', 'hearth'],
      castTime: 1,
      castTimeType: 'IMMEDIATE'
    },
    targetingConfig: {
      targetingType: 'area',
      rangeType: 'self_centered',
      areaSize: 20,
      targetRestrictions: ['ally', 'self']
    },
    resourceCost: {
      actionPoints: 1,
      mana: 0
    },
    cooldownConfig: {
      cooldownType: 'short_rest',
      cooldownValue: 1
    },
    buffConfig: {
      buffType: 'auraEffect',
      effects: [
        { id: 'hearth_warmth', name: 'Sanctified Hearth', description: 'Allies in 20 ft ignore sub-zero rime freezing hazards and gain Advantage on Constitution saves.', mechanicsText: '' }
      ]
    }
  },
  {
    id: 'beacon_of_sol',
    name: 'Beacon of Sol',
    description: 'Radiate blinding celestial starlight, forcing all enemies within 30 ft to target only you or suffer Disadvantage on attacks against allies.',
    level: 6,
    spellType: 'ACTION',
    icon: 'Radiant/Radiant Divinity',
    effectTypes: ['taunt', 'debuff'],
    typeConfig: {
      school: 'sacred',
      icon: 'Radiant/Radiant Divinity',
      tags: ['sacred', 'taunt', 'control'],
      castTime: 1,
      castTimeType: 'IMMEDIATE'
    },
    targetingConfig: {
      targetingType: 'area',
      rangeType: 'self_centered',
      areaSize: 30,
      targetRestrictions: ['enemies']
    },
    resourceCost: {
      actionPoints: 2,
      mana: 0,
      classResource: { type: 'fervor', amount: 35 }
    },
    cooldownConfig: {
      cooldownType: 'turn_based',
      cooldownValue: 3
    },
    debuffConfig: {
      debuffType: 'statusEffect',
      effects: [
        { id: 'compelled', name: 'Compelled Focus', description: 'Enemies have Disadvantage on attacks made against targets other than the Crusader for 1 round.', mechanicsText: '' }
      ]
    }
  },

  // ━━━ LEVEL 7 ━━━
  {
    id: 'reprimand_of_the_zealot',
    name: 'Reprimand of the Zealot',
    description: 'Interrupt an enemy casting a spell within 30 ft with a descending bolt of starlight lightning.',
    level: 7,
    spellType: 'REACTION',
    icon: 'Fire/Burning Forge',
    effectTypes: ['damage', 'debuff'],
    typeConfig: {
      school: 'sacred',
      icon: 'Radiant/Glowing Star',
      tags: ['sacred', 'storm', 'reaction', 'interrupt'],
      castTime: 1,
      castTimeType: 'IMMEDIATE'
    },
    targetingConfig: {
      targetingType: 'single',
      rangeType: 'ranged',
      rangeDistance: 30,
      targetRestrictions: ['enemies']
    },
    resourceCost: {
      actionPoints: 1,
      mana: 0
    },
    cooldownConfig: {
      cooldownType: 'turn_based',
      cooldownValue: 2
    },
    damageConfig: {
      formula: '3d6 + spirit',
      damageTypes: ['sacred', 'storm'],
      resolution: 'DICE',
      savingThrow: {
        ability: 'constitution',
        difficultyClass: 15,
        saveOutcome: 'damage_on_fail'
      }
    },
    debuffConfig: {
      debuffType: 'statusEffect',
      effects: [
        { id: 'stunned', name: 'Stunned', description: 'Spell interrupted and target Stunned for 1 round on failed CON Save.', mechanicsText: '' }
      ]
    }
  },
  {
    id: 'starlight_bulwark',
    name: 'Starlight Bulwark',
    description: 'Project a massive prismatic barrier 15 ft wide that blocks all projectile spells and ranged arrows for 2 rounds.',
    level: 7,
    spellType: 'ACTION',
    icon: 'Radiant/Radiant Golden Shield',
    effectTypes: ['buff', 'wall'],
    typeConfig: {
      school: 'sacred',
      icon: 'Radiant/Radiant Golden Shield',
      tags: ['sacred', 'barrier', 'wall'],
      castTime: 1,
      castTimeType: 'IMMEDIATE'
    },
    targetingConfig: {
      targetingType: 'line',
      rangeType: 'ranged',
      rangeDistance: 15,
      areaSize: 15,
      targetRestrictions: ['all']
    },
    resourceCost: {
      actionPoints: 2,
      mana: 0,
      classResource: { type: 'fervor', amount: 40 }
    },
    cooldownConfig: {
      cooldownType: 'turn_based',
      cooldownValue: 3
    },
    buffConfig: {
      buffType: 'damageMitigation',
      effects: [
        { id: 'bulwark', name: 'Starlight Bulwark', description: 'All allies behind the barrier gain Full Cover against ranged physical and spell attacks.', mechanicsText: '' }
      ]
    }
  },

  // ━━━ LEVEL 8 ━━━
  {
    id: 'solar_flameblade',
    name: 'Solar Flameblade',
    description: 'Infuse your weapon with holy volcanic flame for 1 minute, causing strikes to deal bonus ember/sacred damage and ignore physical DR.',
    level: 8,
    spellType: 'ACTION',
    icon: 'Fire/Burning Spear',
    effectTypes: ['buff'],
    typeConfig: {
      school: 'ember',
      icon: 'Slashing/Flaming Sword',
      tags: ['ember', 'sacred', 'buff', 'weapon'],
      castTime: 1,
      castTimeType: 'IMMEDIATE'
    },
    targetingConfig: {
      targetingType: 'self',
      rangeType: 'self',
      targetRestrictions: ['self']
    },
    resourceCost: {
      actionPoints: 1,
      mana: 0,
      classResource: { type: 'fervor', amount: 30 }
    },
    cooldownConfig: {
      cooldownType: 'turn_based',
      cooldownValue: 3
    },
    buffConfig: {
      buffType: 'damageIncrease',
      effects: [
        { id: 'flameblade_buff', name: 'Solar Flameblade', description: 'Melee strikes deal +2d6 ember/sacred damage and completely ignore enemy Passive DR for 1 minute.', mechanicsText: '' }
      ]
    }
  },
  {
    id: 'pillars_of_the_vigil',
    name: 'Pillars of the Vigil',
    description: 'Call down 3 radiant starlight monoliths in target 30 ft radius, dealing sacred damage and pinning foes between them.',
    level: 8,
    spellType: 'ACTION',
    icon: 'Radiant/Divine Beam',
    effectTypes: ['damage', 'control'],
    typeConfig: {
      school: 'sacred',
      icon: 'Radiant/Divine Beam',
      tags: ['sacred', 'aoe', 'monolith', 'control'],
      castTime: 2,
      castTimeType: 'IMMEDIATE'
    },
    targetingConfig: {
      targetingType: 'area',
      rangeType: 'ranged',
      rangeDistance: 45,
      areaSize: 30,
      targetRestrictions: ['enemies']
    },
    resourceCost: {
      actionPoints: 3,
      mana: 0,
      classResource: { type: 'fervor', amount: 50 }
    },
    cooldownConfig: {
      cooldownType: 'turn_based',
      cooldownValue: 4
    },
    damageConfig: {
      formula: '4d8 + strength + spirit',
      damageTypes: ['sacred'],
      resolution: 'DICE'
    }
  },

  // ━━━ LEVEL 9 ━━━
  {
    id: 'shield_of_light_and_steel',
    name: 'Shield of Light & Steel',
    description: 'Raise a massive radiant barrier granting +4 Passive DR and reflecting sacred retaliation at attackers.',
    level: 9,
    spellType: 'ACTION',
    icon: 'Fire/Burning Spear',
    effectTypes: ['buff'],
    typeConfig: {
      school: 'sacred',
      icon: 'Radiant/Radiant Golden Shield',
      tags: ['sacred', 'buff', 'defense'],
      castTime: 1,
      castTimeType: 'IMMEDIATE'
    },
    targetingConfig: {
      targetingType: 'self',
      rangeType: 'self',
      targetRestrictions: ['self']
    },
    resourceCost: {
      actionPoints: 2,
      mana: 0,
      classResource: { type: 'fervor', amount: 40 }
    },
    cooldownConfig: {
      cooldownType: 'turn_based',
      cooldownValue: 3
    },
    buffConfig: {
      buffType: 'damageMitigation',
      effects: [
        { id: 'light_shield', name: 'Light & Steel', description: '+4 Passive DR; melee attackers take 2d8 sacred retaliation damage for 2 rounds.', mechanicsText: '' }
      ]
    }
  },
  {
    id: 'supernova_surge',
    name: 'Supernova Surge',
    description: 'Vent all stored starlight zeal in a 30 ft radius explosion, blinding all foes and converting 100% of damage taken this encounter into bonus sacred burst.',
    level: 9,
    spellType: 'ACTION',
    icon: 'Radiant/Radiant Divinity',
    effectTypes: ['damage', 'debuff'],
    typeConfig: {
      school: 'sacred',
      icon: 'Radiant/Radiant Divinity',
      tags: ['sacred', 'aoe', 'burst'],
      castTime: 2,
      castTimeType: 'IMMEDIATE'
    },
    targetingConfig: {
      targetingType: 'area',
      rangeType: 'self_centered',
      areaSize: 30,
      targetRestrictions: ['enemies']
    },
    resourceCost: {
      actionPoints: 3,
      mana: 0,
      classResource: { type: 'fervor', amount: 60 }
    },
    cooldownConfig: {
      cooldownType: 'long_rest',
      cooldownValue: 1
    },
    damageConfig: {
      formula: '6d8 + strength + spirit',
      damageTypes: ['sacred'],
      resolution: 'DICE'
    }
  },

  // ━━━ LEVEL 10 ━━━
  {
    id: 'solvan_judgment_titanfall',
    name: 'Solvan Judgment / Titanfall',
    description: 'Consume 100 Fervor to call down a titanic starlight hammer smash in a 20 ft radius, shattering Durability and DR and leaving permanent consecrated ground.',
    level: 10,
    spellType: 'ACTION',
    icon: 'Slashing/Assassins Blade',
    effectTypes: ['damage'],
    typeConfig: {
      school: 'sacred',
      icon: 'Bludgeoning/Swinging Hammer',
      tags: ['sacred', 'storm', 'aoe', 'capstone'],
      castTime: 2,
      castTimeType: 'IMMEDIATE'
    },
    targetingConfig: {
      targetingType: 'area',
      rangeType: 'ranged',
      rangeDistance: 60,
      areaShape: 'circle',
      areaSize: 20,
      targetRestrictions: ['enemies']
    },
    resourceCost: {
      actionPoints: 3,
      mana: 0,
      classResource: { type: 'fervor', amount: 100 }
    },
    cooldownConfig: {
      cooldownType: 'long_rest',
      cooldownValue: 1
    },
    damageConfig: {
      formula: '8d10 + strength * 2 + 30',
      damageTypes: ['sacred', 'storm', 'smashing'],
      resolution: 'DICE',
      savingThrow: {
        ability: 'agility',
        difficultyClass: 16,
        saveOutcome: 'half_damage'
      }
    }
  },
  {
    id: 'avatar_of_the_willing_sacrifice',
    name: 'Avatar of the Willing Sacrifice',
    description: 'Transfigure your body into pure solid starlight for 3 rounds. Become immune to all damage, while all greatsword strikes trigger free Harmonic Smites.',
    level: 10,
    spellType: 'ACTION',
    icon: 'Radiant/Divine Downward Sword',
    effectTypes: ['buff', 'damage'],
    typeConfig: {
      school: 'sacred',
      icon: 'Radiant/Divine Downward Sword',
      tags: ['sacred', 'capstone', 'invulnerability'],
      castTime: 1,
      castTimeType: 'IMMEDIATE'
    },
    targetingConfig: {
      targetingType: 'self',
      rangeType: 'self',
      targetRestrictions: ['self']
    },
    resourceCost: {
      actionPoints: 3,
      mana: 0,
      classResource: { type: 'fervor', amount: 100 }
    },
    cooldownConfig: {
      cooldownType: 'long_rest',
      cooldownValue: 1
    },
    buffConfig: {
      buffType: 'invulnerability',
      effects: [
        { id: 'avatar_starlight', name: 'Avatar of Aex', description: 'Immune to all damage types for 3 rounds. All melee attacks deal maximum damage and trigger free AoE starlight bursts.', mechanicsText: '' }
      ]
    }
  },
  {
    id: "crusader_judgment_strike",
    name: "Judgment Strike",
    description: "Smite an enemy with righteous solar authority. Deals 2d8 sacred damage; the target suffers disadvantage on attack rolls made against anyone other than the Crusader for 1 round.",
    level: 2,
    spellType: "ACTION",
    icon: "Radiant/Divine Downward Sword",
    effectTypes: ["damage", "debuff"],
    typeConfig: {
      school: "sacred",
      icon: "Radiant/Divine Downward Sword",
      tags: ["sacred", "melee", "single_target", "debuff", "crusader"],
      castTime: 1,
      castTimeType: "IMMEDIATE"
    },
    targetingConfig: {
      targetingType: "single",
      rangeType: "melee",
      rangeDistance: 5,
      targetRestrictions: ["enemies"]
    },
    resourceCost: {
      actionPoints: 1,
      mana: 6,
      classResource: { type: "fervor", gain: 10 }
    },
    damageConfig: {
      formula: "2d8 + strength",
      elementType: "sacred",
      damageTypes: ["sacred"],
      resolution: "DICE"
    },
    debuffConfig: {
      debuffType: "statusEffect",
      effects: [
        {
          id: "judgment_strike_disadvantage",
          name: "Judged Stature",
          description: "Disadvantage on attack rolls against targets other than the Crusader.",
          mechanicsText: "Disadvantage on attack rolls targeting anyone other than the Crusader for 1 round."
        }
      ],
      durationValue: 1,
      durationType: "rounds",
      durationUnit: "rounds"
    },
    cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },
    tags: ["sacred", "melee", "single_target", "debuff", "crusader"]
  },
  {
    id: "crusader_banner_of_devotion",
    name: "Banner of the Solar Host",
    description: "Plant a radiant solar battle standard in the earth, generating a 20ft consecrated aura for 3 rounds. Allies inside gain +1 to hit with weapon attacks and +5ft movement speed.",
    level: 3,
    spellType: "ACTION",
    icon: "Radiant/Holy Cross",
    effectTypes: ["buff"],
    typeConfig: {
      school: "sacred",
      icon: "Radiant/Holy Cross",
      tags: ["buff", "aura", "consecration", "crusader"],
      castTime: 1,
      castTimeType: "IMMEDIATE"
    },
    targetingConfig: {
      targetingType: "area",
      rangeType: "self",
      aoeType: "circle",
      aoeSize: 20,
      targetRestrictions: ["allies"]
    },
    durationConfig: {
      durationType: "rounds",
      durationValue: 3,
      durationUnit: "rounds"
    },
    resourceCost: {
      actionPoints: 1,
      mana: 8,
      classResource: { type: "fervor", cost: 15 }
    },
    buffConfig: {
      buffType: "enhancement",
      effects: [
        {
          id: "solar_banner_inspiration",
          name: "Solar Host Inspiration",
          description: "+1 to weapon attacks and +5ft movement speed.",
          mechanicsText: "Allies within 20ft gain +1 on weapon attack rolls and +5ft movement speed for 3 rounds."
        }
      ],
      durationType: "rounds",
      durationValue: 3,
      durationUnit: "rounds"
    },
    cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },
    tags: ["buff", "aura", "consecration", "crusader"]
  },
  {
    id: "crusader_shield_wall_discipline",
    name: "Shield-Wall Discipline",
    description: "Lock shields into a defensive phalanx for 3 rounds. The Crusader and all adjacent allies gain +3 Damage Reduction and heavy cover against ranged attacks.",
    level: 4,
    spellType: "ACTION",
    icon: "Radiant/Radiant Golden Shield",
    effectTypes: ["buff"],
    typeConfig: {
      school: "smashing",
      icon: "Radiant/Radiant Golden Shield",
      tags: ["buff", "defense", "phalanx", "crusader"],
      castTime: 1,
      castTimeType: "IMMEDIATE"
    },
    targetingConfig: {
      targetingType: "area",
      rangeType: "self",
      aoeType: "circle",
      aoeSize: 5,
      targetRestrictions: ["allies"]
    },
    durationConfig: {
      durationType: "rounds",
      durationValue: 3,
      durationUnit: "rounds"
    },
    resourceCost: {
      actionPoints: 1,
      mana: 10,
      classResource: { type: "fervor", gain: 15 }
    },
    buffConfig: {
      buffType: "protection",
      effects: [
        {
          id: "shield_wall_phalanx",
          name: "Shield Phalanx",
          description: "+3 DR and heavy cover from ranged attacks.",
          mechanicsText: "Crusader and adjacent allies gain +3 DR and heavy cover against ranged attacks for 3 rounds."
        }
      ],
      durationType: "rounds",
      durationValue: 3,
      durationUnit: "rounds"
    },
    cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },
    tags: ["buff", "defense", "phalanx", "crusader"]
  },
  {
    id: "crusader_radiant_shackle",
    name: "Radiant Sun-Shackle",
    description: "Cast blazing solar tethers around an enemy within 35ft. Target's movement speed drops to 0 on round 1 and is halved on rounds 2-3 (Spirit DC 15 negates).",
    level: 4,
    spellType: "ACTION",
    icon: "Radiant/Chakra Circle",
    effectTypes: ["control", "debuff"],
    typeConfig: {
      school: "sacred",
      icon: "Radiant/Chakra Circle",
      tags: ["control", "debuff", "immobilize", "crusader"],
      castTime: 1,
      castTimeType: "IMMEDIATE"
    },
    targetingConfig: {
      targetingType: "single",
      rangeType: "ranged",
      rangeDistance: 35,
      targetRestrictions: ["enemies"],
      maxTargets: 1
    },
    durationConfig: {
      durationType: "rounds",
      durationValue: 3,
      durationUnit: "rounds"
    },
    resourceCost: {
      actionPoints: 1,
      mana: 11,
      classResource: { type: "fervor", cost: 20 }
    },
    controlConfig: {
      controlType: "immobilization",
      effects: [
        {
          id: "radiant_sun_chains",
          name: "Sun-Shackle Restraint",
          description: "Speed reduced to 0 on round 1, halved on rounds 2-3.",
          mechanicsText: "Speed 0 on round 1, halved on rounds 2-3 on failed DC 15 Spirit save."
        }
      ],
      savingThrow: {
        ability: "spirit",
        difficultyClass: 15,
        saveOutcome: "negates"
      },
      durationValue: 3,
      durationUnit: "rounds"
    },
    cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },
    tags: ["control", "debuff", "immobilize", "crusader"]
  },
  {
    id: "crusader_aura_of_zeal",
    name: "Aura of Righteous Zeal",
    description: "Radiate incandescent solar brilliance across a 25ft aura for 3 rounds. Allies within gain +1d6 sacred damage on all weapon strikes, and invisible enemies inside are revealed.",
    level: 5,
    spellType: "ACTION",
    icon: "Radiant/Radiant Aura",
    effectTypes: ["buff"],
    typeConfig: {
      school: "sacred",
      icon: "Radiant/Radiant Aura",
      tags: ["buff", "aura", "empowerment", "crusader"],
      castTime: 1,
      castTimeType: "IMMEDIATE"
    },
    targetingConfig: {
      targetingType: "area",
      rangeType: "self",
      aoeType: "circle",
      aoeSize: 25,
      targetRestrictions: ["allies"]
    },
    durationConfig: {
      durationType: "rounds",
      durationValue: 3,
      durationUnit: "rounds"
    },
    resourceCost: {
      actionPoints: 1,
      mana: 12,
      classResource: { type: "fervor", cost: 25 }
    },
    buffConfig: {
      buffType: "damage_enhancement",
      effects: [
        {
          id: "zeal_weapon_empowerment",
          name: "Zealous Weapon Infusion",
          description: "+1d6 sacred damage on weapon attacks; reveals invisibility within 25ft.",
          mechanicsText: "Allies within 25ft add +1d6 sacred damage to weapon attacks. Invisibility suppressed in aura."
        }
      ],
      durationType: "rounds",
      durationValue: 3,
      durationUnit: "rounds"
    },
    cooldownConfig: { cooldownType: "turn_based", cooldownValue: 4 },
    tags: ["buff", "aura", "empowerment", "crusader"]
  },
  {
    id: "crusader_wrathful_smite",
    name: "Wrathful Sun-Smite",
    description: "Empower your greatsword with blazing solar retribution. Next strike deals 6d8 sacred damage and knocks the target prone (Constitution DC 16 for half and resists knockdown).",
    level: 6,
    spellType: "ACTION",
    icon: "Radiant/Divine Downward Sword",
    effectTypes: ["damage", "control"],
    typeConfig: {
      school: "sacred",
      icon: "Radiant/Divine Downward Sword",
      tags: ["damage", "control", "smite", "sacred", "crusader"],
      castTime: 1,
      castTimeType: "IMMEDIATE"
    },
    targetingConfig: {
      targetingType: "single",
      rangeType: "melee",
      rangeDistance: 5,
      targetRestrictions: ["enemies"],
      maxTargets: 1
    },
    durationConfig: {
      durationType: "instant",
      durationValue: 0,
      durationUnit: "rounds"
    },
    resourceCost: {
      actionPoints: 1,
      mana: 14,
      classResource: { type: "fervor", cost: 30 }
    },
    damageConfig: {
      formula: "6d8 + strength",
      elementType: "sacred",
      damageTypes: ["sacred"],
      resolution: "DICE",
      savingThrow: {
        ability: "constitution",
        difficultyClass: 16,
        saveOutcome: "half_damage"
      }
    },
    controlConfig: {
      controlType: "knockdown",
      effects: [
        {
          id: "wrathful_smite_prone",
          name: "Righteous Knockdown",
          description: "Target knocked prone on failed Constitution save.",
          mechanicsText: "Target knocked prone on failed DC 16 Constitution save."
        }
      ],
      durationValue: 0,
      durationUnit: "instant"
    },
    cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },
    tags: ["damage", "control", "smite", "sacred", "crusader"]
  },
  {
    id: "crusader_aegis_of_the_vanguard",
    name: "Aegis of the Vanguard",
    description: "Interpose a towering translucent solar bulwark before an ally within 30ft for 3 rounds. Grants 25 Temporary HP, +2 DR, and immunity to forced movement.",
    level: 6,
    spellType: "ACTION",
    icon: "Radiant/Radiant Golden Shield",
    effectTypes: ["buff"],
    typeConfig: {
      school: "sacred",
      icon: "Radiant/Radiant Golden Shield",
      tags: ["buff", "defense", "shield", "crusader"],
      castTime: 1,
      castTimeType: "IMMEDIATE"
    },
    targetingConfig: {
      targetingType: "single",
      rangeType: "ranged",
      rangeDistance: 30,
      targetRestrictions: ["allies"],
      maxTargets: 1
    },
    durationConfig: {
      durationType: "rounds",
      durationValue: 3,
      durationUnit: "rounds"
    },
    resourceCost: {
      actionPoints: 1,
      mana: 13,
      classResource: { type: "fervor", cost: 25 }
    },
    buffConfig: {
      buffType: "temporary_hp",
      effects: [
        {
          id: "vanguard_solar_aegis",
          name: "Vanguard Aegis",
          description: "25 Temp HP, +2 DR, and immunity to forced movement.",
          mechanicsText: "Target ally gains 25 Temporary HP, +2 DR, and cannot be forcibly moved for 3 rounds."
        }
      ],
      durationType: "rounds",
      durationValue: 3,
      durationUnit: "rounds"
    },
    cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },
    tags: ["buff", "defense", "shield", "crusader"]
  },
  {
    id: "crusader_dawn_bastion",
    name: "Dawn Bastion",
    description: "Erect a 20ft hemispherical dome of dawn light for 3 rounds. Allies within gain DR 6 against physical and elemental damage, and take half damage from area effects.",
    level: 7,
    spellType: "ACTION",
    icon: "Radiant/Divine Illumination",
    effectTypes: ["buff"],
    typeConfig: {
      school: "sacred",
      icon: "Radiant/Divine Illumination",
      tags: ["buff", "defense", "sanctuary", "crusader"],
      castTime: 1,
      castTimeType: "IMMEDIATE"
    },
    targetingConfig: {
      targetingType: "area",
      rangeType: "self",
      aoeType: "circle",
      aoeSize: 20,
      targetRestrictions: ["allies"]
    },
    durationConfig: {
      durationType: "rounds",
      durationValue: 3,
      durationUnit: "rounds"
    },
    resourceCost: {
      actionPoints: 1,
      mana: 16,
      classResource: { type: "fervor", cost: 35 }
    },
    buffConfig: {
      buffType: "protection",
      effects: [
        {
          id: "dawn_bastion_protection",
          name: "Dawn Bastion Sanctuary",
          description: "DR 6 against all damage and half damage from area attacks.",
          mechanicsText: "Allies within 20ft gain DR 6 and take 50% reduced damage from area-of-effect abilities."
        }
      ],
      durationType: "rounds",
      durationValue: 3,
      durationUnit: "rounds"
    },
    cooldownConfig: { cooldownType: "turn_based", cooldownValue: 4 },
    tags: ["buff", "defense", "sanctuary", "crusader"]
  },
  {
    id: "crusader_pillar_of_condemnation",
    name: "Pillar of Condemnation",
    description: "Call down a vertical pillar of concentrated solar flame in a 15ft area up to 50ft away. Deals 8d8 ember damage (Agility DC 17 for half) and blinds enemies for 2 rounds.",
    level: 7,
    spellType: "ACTION",
    icon: "Fire/Fireball",
    effectTypes: ["damage", "control"],
    typeConfig: {
      school: "ember",
      icon: "Fire/Fireball",
      tags: ["damage", "control", "aoe", "ember", "crusader"],
      castTime: 2,
      castTimeType: "IMMEDIATE"
    },
    targetingConfig: {
      targetingType: "area",
      rangeType: "ranged",
      rangeDistance: 50,
      aoeType: "circle",
      aoeSize: 15,
      targetRestrictions: ["enemies"]
    },
    durationConfig: {
      durationType: "rounds",
      durationValue: 2,
      durationUnit: "rounds"
    },
    resourceCost: {
      actionPoints: 2,
      mana: 18,
      classResource: { type: "fervor", cost: 40 }
    },
    damageConfig: {
      formula: "8d8",
      elementType: "ember",
      damageTypes: ["ember"],
      resolution: "DICE",
      savingThrow: {
        ability: "agility",
        difficultyClass: 17,
        saveOutcome: "half_damage"
      }
    },
    controlConfig: {
      controlType: "blindness",
      effects: [
        {
          id: "condemnation_blindness",
          name: "Blinding Solar Column",
          description: "Blinded for 2 rounds on failed Agility save.",
          mechanicsText: "Targets blinded for 2 rounds on failed DC 17 Agility save."
        }
      ],
      durationValue: 2,
      durationUnit: "rounds"
    },
    cooldownConfig: { cooldownType: "turn_based", cooldownValue: 4 },
    tags: ["damage", "control", "aoe", "ember", "crusader"]
  },
  {
    id: "crusader_radiant_transfusion",
    name: "Radiant Transfusion",
    description: "Channel blinding solar restorative power into an ally within 40ft. Restores 35 HP, cleanses 2 negative status conditions, and grants +10 Temporary HP.",
    level: 8,
    spellType: "ACTION",
    icon: "Healing/Golden Heart",
    effectTypes: ["healing", "cleanse", "buff"],
    typeConfig: {
      school: "sacred",
      icon: "Healing/Golden Heart",
      tags: ["healing", "cleanse", "buff", "sacred", "crusader"],
      castTime: 1,
      castTimeType: "IMMEDIATE"
    },
    targetingConfig: {
      targetingType: "single",
      rangeType: "ranged",
      rangeDistance: 40,
      targetRestrictions: ["allies"],
      maxTargets: 1
    },
    durationConfig: {
      durationType: "instant",
      durationValue: 0,
      durationUnit: "rounds"
    },
    resourceCost: {
      actionPoints: 1,
      mana: 20,
      classResource: { type: "fervor", cost: 35 }
    },
    healingConfig: {
      formula: "35",
      healingType: "direct",
      description: "Restores 35 hit points."
    },
    utilityConfig: {
      utilityType: "cleanse",
      selectedEffects: [
        {
          id: "transfusion_cleanse",
          name: "Solar Purification",
          description: "Cleanses 2 negative status conditions.",
          mechanicsText: "Removes up to 2 debuffs, poisons, or curses from target ally."
        }
      ],
      power: "major"
    },
    buffConfig: {
      buffType: "temporary_hp",
      effects: [
        {
          id: "transfusion_temp_hp",
          name: "Residual Radiant Ward",
          description: "10 Temporary HP.",
          mechanicsText: "Target gains 10 Temporary HP for 3 rounds."
        }
      ],
      durationType: "rounds",
      durationValue: 3,
      durationUnit: "rounds"
    },
    cooldownConfig: { cooldownType: "turn_based", cooldownValue: 4 },
    tags: ["healing", "cleanse", "buff", "sacred", "crusader"]
  },
  {
    id: "crusader_blades_of_the_crusade",
    name: "Blades of the Holy Crusade",
    description: "Conjure a swirling cyclone of radiant greatswords across a 25ft radius for 3 rounds. Deals 8d8 sacred damage upon casting and 2d8 sacred damage to any foe ending their turn in the zone.",
    level: 8,
    spellType: "ACTION",
    icon: "Piercing/Dagger Whirl",
    effectTypes: ["damage", "control"],
    typeConfig: {
      school: "sacred",
      icon: "Piercing/Dagger Whirl",
      tags: ["damage", "control", "aoe", "sacred", "crusader"],
      castTime: 2,
      castTimeType: "IMMEDIATE"
    },
    targetingConfig: {
      targetingType: "area",
      rangeType: "ranged",
      rangeDistance: 45,
      aoeType: "circle",
      aoeSize: 25,
      targetRestrictions: ["enemies"]
    },
    durationConfig: {
      durationType: "rounds",
      durationValue: 3,
      durationUnit: "rounds"
    },
    resourceCost: {
      actionPoints: 2,
      mana: 22,
      classResource: { type: "fervor", cost: 50 }
    },
    damageConfig: {
      formula: "8d8",
      elementType: "sacred",
      damageTypes: ["sacred"],
      resolution: "DICE",
      savingThrow: {
        ability: "agility",
        difficultyClass: 18,
        saveOutcome: "half_damage"
      }
    },
    controlConfig: {
      controlType: "hazard_zone",
      effects: [
        {
          id: "crusade_blade_vortex",
          name: "Sword Vortex",
          description: "Foes ending their turn in the zone suffer 2d8 sacred damage.",
          mechanicsText: "Hostile creatures ending turn in zone take 2d8 sacred damage."
        }
      ],
      durationValue: 3,
      durationUnit: "rounds"
    },
    cooldownConfig: { cooldownType: "turn_based", cooldownValue: 5 },
    tags: ["damage", "control", "aoe", "sacred", "crusader"]
  },
  {
    id: "crusader_immortal_vanguard",
    name: "The Immortal Vanguard",
    description: "Transform into an unshakeable solar bulwark for 3 rounds. Gain DR 10, cannot drop below 1 HP, and any damage dealt to allies within 20ft is halved, with the other half transferred to you.",
    level: 9,
    spellType: "ACTION",
    icon: "Radiant/Golden Knight",
    effectTypes: ["buff"],
    typeConfig: {
      school: "sacred",
      icon: "Radiant/Golden Knight",
      tags: ["buff", "defense", "immortality", "crusader"],
      castTime: 2,
      castTimeType: "IMMEDIATE"
    },
    targetingConfig: {
      targetingType: "area",
      rangeType: "self",
      aoeType: "circle",
      aoeSize: 20,
      targetRestrictions: ["allies"]
    },
    durationConfig: {
      durationType: "rounds",
      durationValue: 3,
      durationUnit: "rounds"
    },
    resourceCost: {
      actionPoints: 2,
      mana: 26,
      classResource: { type: "fervor", cost: 60 }
    },
    buffConfig: {
      buffType: "protection",
      effects: [
        {
          id: "immortal_vanguard_shield",
          name: "Immortal Vanguard Stance",
          description: "Crusader gains DR 10 and cannot drop below 1 HP; 50% ally damage within 20ft redirects to Crusader.",
          mechanicsText: "Crusader gains DR 10, cannot drop below 1 HP. 50% of damage to allies within 20ft transfers to Crusader."
        }
      ],
      durationType: "rounds",
      durationValue: 3,
      durationUnit: "rounds"
    },
    cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
    tags: ["buff", "defense", "immortality", "crusader"]
  },
  {
    id: "crusader_apotheosis_of_light",
    name: "Apotheosis of Sol's Light",
    description: "Transcend mortal form and manifest as an incandescent solar avatar for 1 minute (10 rounds). Sprout six wings of blinding light, gain flying speed 60ft, heal all allies for 15 HP at round start, and all attacks deal maximum possible damage rolls.",
    level: 10,
    spellType: "ACTION",
    icon: "Radiant/Divine Radiance",
    effectTypes: ["buff", "transformation", "healing"],
    typeConfig: {
      school: "sacred",
      icon: "Radiant/Divine Radiance",
      tags: ["buff", "transformation", "ultimate", "sacred", "crusader"],
      castTime: 2,
      castTimeType: "IMMEDIATE"
    },
    targetingConfig: {
      targetingType: "self",
      rangeType: "self"
    },
    durationConfig: {
      durationType: "rounds",
      durationValue: 10,
      durationUnit: "rounds"
    },
    resourceCost: {
      actionPoints: 2,
      mana: 30,
      classResource: { type: "fervor", cost: 100 }
    },
    buffConfig: {
      buffType: "transformation",
      effects: [
        {
          id: "sol_apotheosis_avatar",
          name: "Avatar of the Unconquered Sun",
          description: "Flight 60ft, maximum damage rolls on attacks, and passive 15 HP round-start heal to party.",
          mechanicsText: "Fly speed 60ft; all damage rolls deal maximum values; allies within 30ft heal 15 HP at start of round."
        }
      ],
      durationType: "rounds",
      durationValue: 10,
      durationUnit: "rounds"
    },
    cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
    tags: ["buff", "transformation", "ultimate", "sacred", "crusader"]
  },
  {
    id: "crusader_sun_kings_decree",
    name: "Decree of the Sun King",
    description: "Issue a supreme sovereign proclamation across an 80ft radius for 3 rounds. All enemies in range are compelled to prostrate before the Sun King (speed 0, cannot take reactions, DC 20 Spirit save negates), and cannot make attack rolls against allies with lower health than you.",
    level: 10,
    spellType: "ACTION",
    icon: "Radiant/Holy Cross",
    effectTypes: ["control"],
    typeConfig: {
      school: "sacred",
      icon: "Radiant/Holy Cross",
      tags: ["control", "ultimate", "sacred", "crusader"],
      castTime: 2,
      castTimeType: "IMMEDIATE"
    },
    targetingConfig: {
      targetingType: "area",
      rangeType: "self",
      aoeType: "circle",
      aoeSize: 80,
      targetRestrictions: ["enemies"]
    },
    durationConfig: {
      durationType: "rounds",
      durationValue: 3,
      durationUnit: "rounds"
    },
    resourceCost: {
      actionPoints: 2,
      mana: 30,
      classResource: { type: "fervor", cost: 100 }
    },
    controlConfig: {
      controlType: "prostration",
      effects: [
        {
          id: "sun_king_prostration",
          name: "Prostration of the Unworthy",
          description: "Speed 0, no reactions, cannot attack allies with lower HP than Crusader.",
          mechanicsText: "Speed 0 and no reactions for 3 rounds on failed DC 20 Spirit save. Enemies barred from attacking allies with lower HP than Crusader."
        }
      ],
      savingThrow: {
        ability: "spirit",
        difficultyClass: 20,
        saveOutcome: "negates"
      },
      durationValue: 3,
      durationUnit: "rounds"
    },
    cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
    tags: ["control", "ultimate", "sacred", "crusader"]
  }
];

export const CRUSADER_DATA = {
  spellPools: {
    1: [
      "crusader_sanctified_hearth",
      "crusader_beacon_of_truth",
      "starlight_cleave",
      "zealous_strike",
      "bastion_stance"
    ],
    2: [
      "crusader_starlight_interposition",
      "radiant_guard",
      "consecrated_sweep",
      "crusader_judgment_strike"
    ],
    3: [
      "crusader_solar_beacon",
      "zealots_inquisitive_eye",
      "fervent_charge",
      "crusader_banner_of_devotion"
    ],
    4: [
      "righteous_upheaval",
      "solvan_retribution",
      "crusader_shield_wall_discipline",
      "crusader_radiant_shackle"
    ],
    5: [
      "crusader_aegis_of_the_martyred_sun",
      "chakram_of_aex",
      "harmonic_smite",
      "crusader_aura_of_zeal"
    ],
    6: [
      "sanctified_hearth",
      "beacon_of_sol",
      "crusader_wrathful_smite",
      "crusader_aegis_of_the_vanguard"
    ],
    7: [
      "reprimand_of_the_zealot",
      "starlight_bulwark",
      "crusader_dawn_bastion",
      "crusader_pillar_of_condemnation"
    ],
    8: [
      "solar_flameblade",
      "pillars_of_the_vigil",
      "crusader_radiant_transfusion",
      "crusader_blades_of_the_crusade"
    ],
    9: [
      "crusader_judgment_day_cataclysm",
      "shield_of_light_and_steel",
      "supernova_surge",
      "crusader_immortal_vanguard"
    ],
    10: [
      "solvan_judgment_titanfall",
      "avatar_of_the_willing_sacrifice",
      "crusader_apotheosis_of_light",
      "crusader_sun_kings_decree"
    ]
  },
  id: "crusader",
  classResource: {
    type: "fervor",
    base: 0,
    max: 100,
    generationNote: "Generated by melee engagement, defending allies, and holding sanctified ground. Spent on solar smites and holy auras.",
    criticalThresholds: { harmonicStance: 50, judgment: 100 },
    mechanicsNote: "At 50+ Fervor, enters Harmonic Stance (+bonus sacred damage). Solvan Judgment expends 100 Fervor."
  },
  name: "Crusader",
  title: "The Sol-Bound Zealot",
  icon: "Radiant/Divine Downward Sword",
  role: "Damage / Tank",
  damageTypes: ["sacred", "ember", "smashing", "stabbing", "slicing", "storm"],

  restrictions: {
    allowedSubraces: [
      "skald_human",
      "thrask_solari",
      "silath_astril"
    ],
    hardBlocks: [
      "mimir",
      "neth",
      "groven",
      "fexric"
    ],
    narrativeUnlock: true,
    justification: "Requires proximity to Solvan starlight relics or Emberspire's radiant calderas. Mimir are too identity-fragile to sustain Aex's song. Nethien cannot reconcile starlight zeal with Morvane's legal contracts. Groven are vat-born creatures whose biology rejects sacred harmonics."
  },

  livingOrder: {
    orderName: 'The Solvan Vigil',
    founder: {
      name: 'Lord-Captain Vane Solvan',
      status: 'Fallen at the Wyrd-Breach. His shattered starlight blade is mounted above the Great Forge in Sundale.',
      note: 'The first to forge starlight steel into heavy battle-plates. He bound Aex\'s Willing Sacrifice to physical plate.'
    },
    currentLeader: {
      name: 'Hierophant Aethelgard',
      title: 'High Purger of the Dawn Vigil',
      characterization: 'An unyielding Solari zealot who treats starlight as a non-negotiable martial law.'
    },
    headquarters: { name: 'The Obsidian Citadel', locationId: 'sundale' },
    crisisConnection: 'Aethelgard demands Crusaders reforge the 7 Sundered Monoliths, unaware that the 7th Monolith is tainted by Keth Amar.'
  },

  worldFriction: [
    { region: 'sundale', location: 'harath_vault', status: 'revered', consequence: 'Crusaders lead the vanguard against Wyrd incursions from the Ashen Escarpment; forge-masters prioritize their plating maintenance above all others.', workaround: 'None needed; treated as holy liberators.' },
    { region: 'bryngloom-forest', location: 'atropolis', status: 'distrusted', consequence: 'Atropolis contract-archivists view Crusader zeal as dangerous fanaticism that threatens fragile legal covenants with bog entities.', workaround: 'Sheathe greatswords in leaded peace-wraps and register with city bailiffs.' },
    { region: 'frostwood-reach', status: 'tolerated', consequence: 'Thalren settlers welcome Crusader heavy swords against wandering Wyrd-beasts, but fear their strict intolerance of pagan fog rites.', workaround: 'Confine purges to confirmed abominations and respect village elders.' },
    { region: 'emberspire', status: 'allied', consequence: 'Waste-Solari forge-knights share the Crusader\'s martial philosophy, welcoming their holy starlight to supplement geothermal defenses.', workaround: 'Participate in the ritual caldera-kindling.' }
  ],

  overview: {
    title: "The Crusader",
    subtitle: "The Sol-Bound Zealot",
    illustration: "/assets/images/classes/crusader_illustration.png",
    illustrationCaption: "A Solari Crusader channeling Aex's starlight song through a shattered greatsword.",
    originStory: `A Crusader is not a peaceful monk praying at an altar. You are a walking starlight furnace encased in sixty pounds of hammered iron and consecrated glass, standing on the rim of the dark and daring the monsters of Keth Amar to try you.

When the Freezing Era fell post-Great Breach and the sun was extinguished from the heavens, six noble houses marched their firstborn heirs north to seal the dark bargains of survival. But House Solvan recognised that appeasement was merely a delayed death sentence. Led by Lord-Captain Vane Solvan, their smiths and knights broke into the sealed vaults of the fallen star Aex, prying loose fragments of pure, crystallized starlight. They did not store the relics in velvet boxes—they smelted the star-matter directly into the core of their heavy battle-plates and Greatswords.

To channel Aex's Willing Sacrifice is an ordeal of agonizing physical friction. Starlight does not flow like gentle water; it surges like high-voltage holy electricity through bone, marrow, and blood vessels. Every heavy swing of your two-handed greatsword vibrates at the primordial binding frequency that holds reality together. When you take damage on the frontline, your heavy plate converts the kinetic trauma into blinding Fervor. At fifty Fervor, your blade glows white-hot with Aex's Harmonic Stance, slicing through enchanted shields and demonic hide as though they were dry parchment. At one hundred Fervor, you unleash Solvan Judgment—a catastrophic three-action pillar of descending starlight that shatters enemy Durability and DR and leaves the earth permanently consecrated.

The cost of this zeal is complete, exhausting physical devotion. A Crusader cannot cast spells from a safe distance; you must be close enough to smell the enemy's breath to build Fervor. If you push your zeal too far without releasing a smite, the blinding starlight bleeds into your own optic nerves, causing peripheral Starlight Burnout. Today, the Dawn Vigil stands at a terrifying ideological crossroads: Hierophant Aethelgard commands all Crusaders to reforge the 7 Sundered Monoliths, unaware that the 7th Monolith is tainted by Keth Amar. You march into the dark with a greatsword on your shoulder, knowing that if your faith falters for even a second, the light you carry will burn you alive from the inside out.`,

    quickOverview: {
      title: "Class Overview",
      content: `**Who they are**: The Crusader is a frontline starlight juggernaut and sacred zealot who channels the primordial starlight of Aex through heavy greatswords and consecrated plating. You stand at the vanguard, converting martial combat and sacred conviction into unstoppable Fervor.

**The hook**: You build **Fervor** by swinging heavy greatswords and absorbing enemy strikes. At 50+ Fervor, you enter **Harmonic Stance**, imbuing all your strikes with bonus sacred damage. At 100 Fervor, you unleash **Solvan Judgment**, an apocalyptic holy smite that shatters enemy Durability and DR.

**The resource bar & costs**: Your resource bar is **Fervor** (0–100). Generating Fervor powers your offensive stances and holy smites. However, maintaining maximum zeal strains your focus—failing to vent Fervor through smites can cause Starlight Burnout, requiring steady momentum.

**Bring one for**: Unstoppable frontline defense, heavy greatsword swings, sacred AoE smites, and playing an unstoppable holy warrior who purges corruption.`
    },
    description: `The Crusader is a heavy starlight-forged juggernaut who channels Aex's Willing Sacrifice to re-enforce the binding frequency and execute Wyrd corruption.`,
    roleplayIdentity: {
      title: "Roleplay Identity",
      content: `**HISTORY: THE GENESIS**
Forged during the Freezing Era when Solvan knights bound Aex's starlight song to heavy plate to hold the Wyrd-breach.

**CITIES & CIVIL RECEPTION**
Highly revered in Sundale and Emberspire; viewed with caution by Atropolis archivists who fear religious zeal.

**RACES & CULTURAL AFFILIATION**
Solari carry the ancestral starlight lineage; Skald humans fuse it with the Hunger Pact; Waste-Solari draw geothermal magma-fire; Stellar Astril refract it through crystal skin.

**NOTABLE FIGURES**
* **Lord-Captain Vane Solvan**: The first to forge starlight steel into heavy battle-plates.
* **Hierophant Aethelgard**: Leader of the Dawn Vigil.`
    },
    signatureQuote: {
      text: '"My ancestor held the knife that flayed the star\'s child. I hold the blade that will cut down anything that tries to finish the meal."',
      speaker: 'Lord-Captain Vane Solvan',
      context: 'To a Dawn Vigil initiate before the charge into the Wyrd-breach'
    },
    philosophy: {
      coreTenet: 'Starlight is not a passive blessing. It is a sword forged in sacrifice, bought with Aex\'s blood, and sustained by those who stand in the dark.',
      relationship: 'Crusaders see themselves as living seals holding back Keth Amar.',
      paradox: 'To protect life, they must burn their own mortality in starlight zeal.'
    },
    currentCrisis: `The Dawn Vigil is divided: Hierophant Aethelgard commands all Crusaders to reforge the 7 Monoliths, while veteran Crusaders suspect the 7th Monolith is corrupted by Keth Amar.`,
    meaningfulTradeoffs: `High Durability, heavy DR, and holy smites come at the cost of mobility and heavy dependence on Fervor management.`,
    classSpecificLocations: [
      {
        name: 'The Obsidian Citadel',
        locationId: 'sundale',
        description: 'The bastion of the Dawn Vigil guarding the Ashen Escarpment.',
        purpose: 'Training and holy vows',
        status: 'Active'
      }
    ],
    combatRole: {
      title: "The Frontline Starlight Purger",
      content: `Generates Fervor through physical strikes and soak rolls, unleashing sacred smites and starlight barriers.`
    },
    playstyle: {
      title: "Fervor-Driven Smite Engine",
      content: `Balance physical weapon swings with Fervor spending. Build Fervor to 50 for Harmonic Stance, or dump 100 for Solvan Judgment.`
    },
    immersiveCombatExample: {
      title: "Combat Example: Solvan Judgment",
      content: `**Turn 1**: Strike with Starlight Cleave, building +15 Fervor. Absorbing hits builds +20 Fervor. At 100 Fervor, call down Solvan Judgment to obliterate Wyrd abominations.`
    }
  },

  subraceVariants: {
    skald_human: {
      subraceName: 'Skald',
      title: 'The Frost-Hearth Zealot',
      reframe: `The <LoreLink termId="skald">Skald</LoreLink> Crusaders merged the Hunger Pact with Solvan starlight doctrine during the Bloodhammer migration into <LoreLink termId="sundale">Sundale</LoreLink>. They treat their greatswords as mobile hearths in Nordhalla’s blizzards. When a Skald Crusader ignites their Fervor, the blade emits intense thermal warmth, keeping their party alive in whiteout blizzards.`,
      signatureAbility: {
        name: 'Hearth-Blade Ignition',
        description: `Venting Fervor creates a 20 ft thermal aura. Allies standing within the aura take half damage from rime freezing hazards and gain Advantage on CON Saves.`
      },
      currentCrisisAngle: `The Skald Crusaders reject the Skald Council's execution order against the Unbound. They view the Unbound Berserkers as lost kin needing starlight guidance rather than heretics to be executed.`,
      signatureQuote: {
        text: '"The ice wants your toes. The dark wants your soul. My blade says neither one gets a turn today."',
        speaker: 'Haldor Iron-Hearth',
        context: 'Spoken while holding the Ancestor-Span bridge during a three-day blizzard'
      }
    },

    thrask_solari: {
      subraceName: 'Waste-Solari - Thyrm',
      title: 'The Magma Crusader',
      reframe: `The <LoreLink termId="solari">Waste-Solari</LoreLink> Crusaders channel <LoreLink termId="scathrach">Scathrach's</LoreLink> uncorrupted ember to infuse heavy bulwark plate with geothermal heat. They view Aex's song as the magma-hum of <LoreLink termId="emberspire">Emberspire</LoreLink>. Their zeal is tectonic, welding heavy iron plate directly to their shoulders.`,
      signatureAbility: {
        name: 'Caldera-Cleave',
        description: `Spending Fervor converts 50% of your sacred damage into ember damage, setting the ground on fire and dealing continuous ember ticks to enemies.`
      },
      currentCrisisAngle: `As Emberspire's calderas cool, Waste-Solari Crusaders are forced deeper into Scathrach's subterranean vents, risking exposure to Wyrd-taint to keep their plating heated.`,
      signatureQuote: {
        text: '"You pray to a sun you never saw. I pray to the boiling mud under my boots. Let us see whose god hits harder."',
        speaker: 'Korr Vulcan-Shield',
        context: 'Addressing a Solari priest in the Harath-Vault'
      }
    },

    silath_astril: {
      subraceName: 'Stellar Astril - Astril',
      title: 'The Crystal Judgment',
      reframe: `The <LoreLink termId="astril">Stellar Astril</LoreLink> Crusaders resonate with Aex's willing sacrifice, using their crystalline skin lattice to act as a tuning fork for starlight. When they absorb damage, the energy refracts through their skin, charging their blade with golden harmonic frequency.`,
      signatureAbility: {
        name: 'Refractive Bulwark',
        description: `Rolling your Active Soak die against spell strikes generates +5 Fervor. Absorbing spell damage empowers your next strike with +1d6 bonus sacred damage.`
      },
      currentCrisisAngle: `The accuracy collapse in Astril star-arithmetic has driven Stellar Crusaders to abandon passive observation entirely: they now enforce starlight justice through physical combat.`,
      signatureQuote: {
        text: '"My skin broke in the shape of a star a century ago. I am merely passing the light forward."',
        speaker: 'Valen Prism-Blade',
        context: 'Before executing a Wyrd-Channel in the Frostwood'
      }
    }
  },

  combatRole: {
    title: "The Frontline Starlight Purger",
    content: `The Crusader is a heavy offensive juggernaut that generates **Fervor** (0–100) through physical combat and starlight invocation. 
    
    When Fervor reaches 50+, the Crusader enters **Aex's Harmonic Stance**, causing all melee strikes to deal bonus **sacred** damage. Spending 100 Fervor unleashes **Solvan Judgment**, a 3 AP catastrophic AoE smite that shatters enemy Passive DR and leaves sanctified ground.`
  },

  resourceEngine: {
    name: "Fervor",
    max: 100,
    color: "#f59e0b",
    icon: "faCross",
    description: "Generated by dealing melee strikes, taking physical hits, or standing on sanctified ground. Used to empower holy flurries and unleash Solvan Judgment."
  },

  resourceSystem: {
    title: "Fervor: The Solar Battery",
    subtitle: "How Your Resource Works (Beginner's Guide)",
    description: `**1. What is it? (The Solar Battery)**
Fervor (0–100) is celestial starlight generated through martial vanguard combat and consecrated territory.

**2. How do I build it?**
- Strike enemies with greatsword and shield attacks (+10 to +15 Fervor).
- Block incoming blows with your greatshield (+10 Fervor).
- Stand within your own Consecrated ground (+5 per round).

**3. How do I spend it & what is the catch?**
- Spend Fervor on high-impact Solar Smites, protective party shields, and area-of-effect judgments.
- **The Catch (Zealous Scorching)**: Storing **80+ unspent Fervor** causes radiant overload—the excessive starlight burns your own skin and imposes visual glare penalties until vented.`,
    cards: [
      {
        title: "Fervor (0-100)",
        stats: "Holy Frequency Scale",
        details: "Starlight zeal built through melee strikes and defensive soak. Used to fuel holy flurries and unleash Solvan Judgment."
      },
      {
        title: "Harmonic Stance (50+ Fervor)",
        stats: "Resonant Power",
        details: "At 50+ Fervor, greatswords glow white-hot, adding +1d6 sacred damage to all attacks and sundering enemy Durability and DR."
      }
    ],
    generationTable: {
      headers: ["Action", "Fervor Gain", "Effect"],
      rows: [
        ["Melee Strike (Starlight Cleave)", "+15 Fervor", "Deals physical + sacred damage"],
        ["Taking Hit / Active Soak Roll", "+10 Fervor", "Converts damage taken into starlight resonance"],
        ["Standing on Consecrated Ground", "+5 Fervor per turn", "Holy ambient recharge"],
        ["Harmonic Stance (50+ Fervor)", "Passive buff", "All melee strikes deal +1d6 bonus sacred damage"],
        ["Solvan Judgment (100 Fervor)", "Consumes 100 Fervor", "Catastrophic 3 AP 20 ft AoE smite"]
      ]
    }
  },

  specializations: {
    title: "Crusader Specializations",
    description: "Choose your path of starlight zeal: the greatsword smiting Solar Justiciar, the unbreakable Dawn Bastion, or the spell-shattering Harmonic Inquisitor.",
    specs: [
      {
        id: "solar_justiciar",
        name: "Solar Justiciar",
        icon: "Radiant/Divine Downward Sword",
        color: "#f59e0b",
        theme: "Heavy Greatsword Smites & Durability and DR Destruction",
        description: "The vanguard executioner of the Dawn Vigil. You wield massive two-handed greatswords, converting Fervor into durability-shattering holy smites that obliterate Wyrd abominations.",
        playstyle: "Aggressive frontline burst DPS. Build Fervor with heavy swings and spend it on devastating single-target and cone smites.",
        strengths: [
          "Unmatched physical and sacred Durability and DR penetration",
          "High burst damage through Harmonic Smite and Solvan Judgment",
          "Permanent consecrated ground creation"
        ],
        weaknesses: [
          "Vulnerable to kiting and ranged spellcasters",
          "Demands continuous melee momentum to maintain Fervor",
          "Low mobility outside of Fervent Charge"
        ],
        specPassive: {
          name: "Righteous Cleave",
          description: "All greatsword strikes deal +15% damage against Aberrations, Undead, and Wyrd-tainted creatures."
        }
      },
      {
        id: "dawn_bastion",
        name: "Dawn Bastion",
        icon: "Radiant/Radiant Golden Shield",
        color: "#3b82f6",
        theme: "Starlight Bulwark & Consecrated Ground Tank",
        description: "The immovable shield of Solvan doctrine. You bind Aex's starlight song into heavy battle-plates, generating Fervor when taking hits and shielding allies behind walls of solid light.",
        playstyle: "Immortal frontline tank. Taunt enemies with Beacon of Sol and raise Starlight Bulwarks to protect fragile allies.",
        strengths: [
          "Supreme Passive DR and Active Soak scaling",
          "AoE taunting and aggro management",
          "Full party protection against ranged projectiles"
        ],
        weaknesses: [
          "Lower single-target damage output",
          "Requires allies to position behind protective barriers",
          "Heavy plating reduces base movement speed"
        ],
        specPassive: {
          name: "Aegis of the Star",
          description: "Whenever an ally within 15 ft takes damage, gain +10 Fervor and redirect 25% of the damage into your own Active Soak die."
        }
      },
      {
        id: "harmonic_inquisitor",
        name: "Harmonic Inquisitor",
        icon: "Radiant/Glowing Star",
        color: "#8b5cf6",
        theme: "Starlight Lightning & Magic Negation",
        description: "The occult hunter of the Vigil. You channel Aex's song as a discordant tuning fork, using starlight lightning to interrupt enemy spellcasters and purge magical shields.",
        playstyle: "Hybrid melee/mid-range anti-caster. Counter enemy spells with Reprimand and hurl Chakrams of Aex across lines.",
        strengths: [
          "Reaction-based spell interruptions and stuns",
          "Mid-range line AoE damage through Chakram of Aex",
          "High burst sacred/storm hybrid damage"
        ],
        weaknesses: [
          "Slightly lower physical defense than Dawn Bastion",
          "Relies on reaction economy and timing",
          "High Fervor consumption for reaction counters"
        ],
        specPassive: {
          name: "Discordant Reprimand",
          description: "Successfully interrupting an enemy spell refunds 100% of the reaction's AP cost and grants +20 Fervor."
        }
      }
    ]
  },

  spells: CRUSADER_ABILITIES
};

CRUSADER_DATA.spells = CRUSADER_ABILITIES;
export const CRUSADER_SPELLS = CRUSADER_ABILITIES;
