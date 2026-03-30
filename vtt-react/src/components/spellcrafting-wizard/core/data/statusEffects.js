/**
 * Status Effects Module
 *
 * Contains positive and negative status effects, combat advantages/disadvantages,
 * and utility functions for finding and manipulating status effects.
 */

/**
 * Positive status effects that can be applied by buffs
 */
export const POSITIVE_STATUS_EFFECTS = [
    {
      id: 'inspired',
      name: 'Inspired',
      description: 'Gain bonuses to ability checks, attacks, or saving throws',
      icon: 'spell_holy_divineillumination',
      category: 'mental',
      actionPointCost: 1,
      options: [
        { id: 'bardic', name: 'Bardic Inspiration', description: 'Add a die to an ability check, attack roll, or saving throw' },
        { id: 'guidance', name: 'Guidance', description: 'Add a d4 to an ability check' },
        { id: 'heroism', name: 'Heroism', description: 'Gain temporary hit points and immunity to fear' }
      ],
      defaultParameters: {
        effectDice: '1d4',
        inspirationDie: 6,
        uses: 1,
        affectsAttacks: true,
        affectsSaves: true,
        affectsAbilityChecks: true,
        affectsDamage: false,
        affectsInitiative: false
      }
    },
    {
      id: 'blessed',
      name: 'Blessed',
      description: 'Divine favor grants various protective benefits',
      icon: 'spell_holy_blessedrecovery',
      category: 'divine',
      actionPointCost: 2,
      options: [
        { id: 'protection', name: 'Protection', description: 'Gain Armor bonus and resistance to certain damage types' },
        { id: 'fortune', name: 'Fortune', description: 'Can reroll one die roll per round' },
        { id: 'life', name: 'Life', description: 'Gain bonus to healing received' }
      ],
      defaultParameters: {
        effectDice: '1d4',
        dieSize: 4,
        affectsAttacks: true,
        affectsSaves: true,
        affectsAbilityChecks: false,
        affectsDamage: false,
        holyWeapon: false,
        radiantDamage: '1d4'
      }
    },
    {
      id: 'regeneration',
      name: 'Regeneration',
      description: 'Recover hit points over time',
      icon: 'inv_relics_totemoflife',
      category: 'healing',
      actionPointCost: 2,
      options: [
        { id: 'fast', name: 'Fast Regeneration', description: 'Recover hit points at the start of each turn' },
        { id: 'escalating', name: 'Escalating Regeneration', description: 'Healing increases each round' },
        { id: 'adaptive', name: 'Adaptive Regeneration', description: 'More effective at lower health' }
      ],
      defaultParameters: {
        regenDice: '1d6',
        frequency: 'start_of_turn',
        enhancedRegeneration: false,
        regrowthTime: 'hour'
      }
    },
    {
      id: 'invisible',
      name: 'Invisible',
      description: 'Cannot be seen by normal sight',
      icon: 'ability_vanish',
      category: 'stealth',
      actionPointCost: 3,
      options: [
        { id: 'partial', name: 'Partial Invisibility', description: 'Heavily obscured, harder to detect' },
        { id: 'full', name: 'Full Invisibility', description: 'Completely invisible until you attack' },
        { id: 'selective', name: 'Selective Invisibility', description: 'Invisible to specific creatures' }
      ],
      defaultParameters: {
        detectionDC: '1d8',
        stealthBonus: '1d6',
        quality: 'standard',
        attackBonusType: 'advantage',
        attackBonus: '1d4',
        targetCategory: 'humanoids',
        intThreshold: 14
      },
      breaks: ['attack', 'castSpell', 'takeDamage']
    },
    {
      id: 'haste',
      name: 'Haste',
      description: 'Move and act more quickly',
      icon: 'ability_rogue_sprint',
      category: 'movement',
      actionPointCost: 3,
      options: [
        { id: 'movement', name: 'Enhanced Movement', description: 'Double movement speed' },
        { id: 'action', name: 'Extra Action', description: 'Gain an additional action each turn' },
        { id: 'casting', name: 'Quick Casting', description: 'Cast spells more quickly' }
      ],
      defaultParameters: {
        effectDice: '3d6',
        speedMultiplier: 2,
        additionalMovement: '3d6',
        affectsWalk: true,
        affectsSwim: true,
        affectsClimb: true,
        affectsFly: false,
        extraAction: true,
        bonusAction: false,
        extraReaction: false,
        defenseDice: '1d6',
        dexSaveAdvantage: true,
        refSaveAdvantage: true
      }
    },
    {
      id: 'resistance',
      name: 'Resistance',
      description: 'Take reduced damage from specific sources',
      icon: 'spell_holy_powerwordshield',
      category: 'protection',
      actionPointCost: 2,
      options: [
        { id: 'elemental', name: 'Elemental Resistance', description: 'Resistance to fire, cold, lightning, etc.' },
        { id: 'physical', name: 'Physical Resistance', description: 'Resistance to bludgeoning, piercing, slashing' },
        { id: 'magical', name: 'Magical Resistance', description: 'Resistance to magical damage types' }
      ],
      defaultParameters: {
        resistanceAmount: 50, // Percent
        adaptiveResistance: false,
        sharedResistance: false
      }
    },
    {
      id: 'flying',
      name: 'Flying',
      description: 'Gain the ability to fly',
      icon: 'ability_mount_flyingcarpet',
      category: 'movement',
      actionPointCost: 3,
      options: [
        { id: 'hover', name: 'Hovering', description: 'Float a few feet off the ground' },
        { id: 'wings', name: 'Winged Flight', description: 'Grow or manifest wings for true flight' },
        { id: 'levitation', name: 'Magical Levitation', description: 'Float without physical means' }
      ],
      defaultParameters: {
        flightSpeed: 60,
        maxAltitude: 100,
        maneuverability: 'good',
        vulnerable: 'knockdown'
      }
    },
    {
      id: 'truesight',
      name: 'Truesight',
      description: 'See through illusions and into magical darkness',
      icon: 'spell_holy_mindsooth',
      category: 'perception',
      actionPointCost: 2,
      options: [
        { id: 'darkvision', name: 'Enhanced Darkvision', description: 'See in magical darkness' },
        { id: 'seeInvisible', name: 'See Invisible', description: 'Detect invisible creatures and objects' },
        { id: 'detectMagic', name: 'Detect Magic', description: 'See magical auras and effects' }
      ],
      defaultParameters: {
        truesightRange: 60,
        penetrateIllusions: true,
        seeEthereal: false,
        seeAuras: true
      }
    },
    {
      id: 'energized',
      name: 'Energized',
      description: 'Gain additional action points and improved energy recovery',
      icon: 'spell_nature_lightning',
      category: 'enhancement',
      actionPointCost: 3,
      options: [
        { id: 'focused', name: 'Focused Mind', description: 'Recover action points more quickly' },
        { id: 'amplified', name: 'Amplified Power', description: 'Spells cost fewer action points' },
        { id: 'energetic', name: 'Energetic Movement', description: 'Movement costs fewer action points' }
      ],
      defaultParameters: {
        bonusActionPoints: 2,
        actionPointRegeneration: 1,
        costReduction: 1,
        overloadChance: 10 // Percent
      }
    },
    {
      id: 'shielded',
      name: 'Energy Shield',
      description: 'Surrounded by a protective energy barrier that absorbs damage',
      icon: 'spell_holy_powerwordshield',
      category: 'protection',
      actionPointCost: 2,
      options: [
        { id: 'absorbing', name: 'Absorbing Shield', description: 'Absorbs all types of damage' },
        { id: 'reflective', name: 'Reflective Shield', description: 'Returns a portion of damage to attacker' },
        { id: 'elemental', name: 'Elemental Shield', description: 'Provides immunity to specific element' }
      ],
      defaultParameters: {
        shieldAmount: '3d8',
        shieldRegeneration: 0,
        reflectionPercent: 0,
        elementalImmunity: ''
      }
    },
    {
      id: 'empowered',
      name: 'Empowered',
      description: 'Increases the power of spells and abilities',
      icon: 'spell_arcane_arcane02',
      category: 'enhancement',
      actionPointCost: 2,
      options: [
        { id: 'spellpower', name: 'Spell Power', description: 'Increases damage of spells' },
        { id: 'healing', name: 'Healing Power', description: 'Increases effectiveness of healing spells' },
        { id: 'duration', name: 'Extended Duration', description: 'Increases duration of effects' }
      ],
      defaultParameters: {
        powerIncrease: 25, // Percent
        critChanceBonus: 10, // Percent
        areaEffectBonus: 0 // Percent
      }
    }
  ];

/**
 * Combat advantages that can be used in the buff system
 */
export const COMBAT_ADVANTAGES = [
    // Buff advantages
    {
      id: 'attackers_advantage_buff',
      name: 'Attackers Have Advantage',
      description: 'Attackers roll twice and take the higher result when attacking you',
      icon: 'ability_warrior_defensivestance',
      category: 'buff',
      actionPointCost: 2,
      options: [
        { id: 'all', name: 'All Attackers', description: 'All attackers have advantage against you' },
        { id: 'melee', name: 'Melee Attackers', description: 'Melee attackers have advantage against you' },
        { id: 'ranged', name: 'Ranged Attackers', description: 'Ranged attackers have advantage against you' },
        { id: 'spell', name: 'Spell Attackers', description: 'Spell attackers have advantage against you' }
      ],
      defaultParameters: {
        effectDice: '1d20',
        bonusDice: '1d4',
        attackCount: 'all',
        affectsMelee: true,
        affectsRanged: true,
        affectsSpell: true,
        advantageCount: 1
      }
    },
    {
      id: 'attackers_disadvantage',
      name: 'Attackers Have Disadvantage',
      description: 'Attackers roll twice and take the lower result when attacking you',
      icon: 'ability_warrior_defensivestance',
      category: 'buff',
      actionPointCost: 2,
      options: [
        { id: 'all', name: 'All Attackers', description: 'All attackers have disadvantage against you' },
        { id: 'melee', name: 'Melee Attackers', description: 'Melee attackers have disadvantage against you' },
        { id: 'ranged', name: 'Ranged Attackers', description: 'Ranged attackers have disadvantage against you' },
        { id: 'spell', name: 'Spell Attackers', description: 'Spell attackers have disadvantage against you' }
      ],
      defaultParameters: {
        effectDice: '1d20',
        bonusDice: '1d4',
        attackCount: 'all',
        affectsMelee: true,
        affectsRanged: true,
        affectsSpell: true,
        advantageCount: 1
      }
    },
    {
      id: 'advantage_attack',
      name: 'Advantage on Attacks',
      description: 'Roll twice and take the higher result on attack rolls',
      icon: 'ability_warrior_battleshout',
      category: 'buff',
      actionPointCost: 2,
      options: [
        { id: 'all', name: 'All Attacks', description: 'Advantage on all attack rolls' },
        { id: 'melee', name: 'Melee Attacks', description: 'Advantage on melee attack rolls' },
        { id: 'ranged', name: 'Ranged Attacks', description: 'Advantage on ranged attack rolls' },
        { id: 'spell', name: 'Spell Attacks', description: 'Advantage on spell attack rolls' }
      ],
      defaultParameters: {
        effectDice: '1d20',
        bonusDice: '1d4',
        attackCount: 'all',
        affectsMelee: true,
        affectsRanged: true,
        affectsSpell: true,
        advantageCount: 1
      }
    },
    {
      id: 'critical_improved',
      name: 'Improved Critical',
      description: 'Expand critical hit range and/or increase critical damage',
      icon: 'ability_rogue_coldblood',
      category: 'buff',
      actionPointCost: 2,
      options: [
        { id: 'range', name: 'Expanded Range', description: 'Critical hits on 19-20 instead of just 20' },
        { id: 'damage', name: 'Enhanced Damage', description: 'Critical hits deal extra damage' },
        { id: 'effect', name: 'Special Effect', description: 'Critical hits cause additional effects' }
      ],
      defaultParameters: {
        effectDice: '1d6',
        critRange: 19,
        critDamage: '1d6',
        critEffect: 'none'
      }
    },
    {
      id: 'damage_bonus',
      name: 'Bonus Damage',
      description: 'Deal additional damage on successful attacks',
      icon: 'ability_warrior_weaponmastery',
      category: 'buff',
      actionPointCost: 1,
      options: [
        { id: 'elemental', name: 'Elemental Damage', description: 'Add elemental damage to attacks' },
        { id: 'weapon', name: 'Weapon Damage', description: 'Increase weapon damage directly' },
        { id: 'conditional', name: 'Conditional Damage', description: 'Extra damage under specific conditions' }
      ],
      defaultParameters: {
        effectDice: '1d6',
        damageType: 'fire',
        damageDice: '1d4',
        affectsMelee: true,
        affectsRanged: true,
        affectsSpell: false
      }
    },
    {
      id: 'extra_action',
      name: 'Extra Action',
      description: 'Gain additional actions in combat',
      icon: 'spell_nature_timestop',
      category: 'buff',
      actionPointCost: 4,
      options: [
        { id: 'attack', name: 'Extra Attack', description: 'Make an additional attack action' },
        { id: 'bonus', name: 'Extra Action Points', description: 'Gain additional action points' },
        { id: 'reaction', name: 'Extra Reaction', description: 'Gain an additional reaction' }
      ],
      defaultParameters: {
        effectDice: '1d6',
        actionPointBonus: 2,
        maxUses: 1,
        cooldown: 2 // rounds
      }
    },
    {
      id: 'damage_resistance',
      name: 'Damage Resistance',
      description: 'Reduce damage taken from specific sources',
      icon: 'spell_holy_devotionaura',
      category: 'buff',
      actionPointCost: 2,
      options: [
        { id: 'physical', name: 'Physical Resistance', description: 'Reduce physical damage taken' },
        { id: 'elemental', name: 'Elemental Resistance', description: 'Reduce elemental damage taken' },
        { id: 'magical', name: 'Magical Resistance', description: 'Reduce magical damage taken' }
      ],
      defaultParameters: {
        effectDice: '1d6',
        resistancePercent: 50,
        resistanceDuration: 3, // rounds
        resistanceType: 'all'
      }
    },
    {
      id: 'saving_throw_advantage',
      name: 'Saving Throw Advantage',
      description: 'Roll twice and take the higher result on saving throws',
      icon: 'spell_holy_sealofprotection',
      category: 'buff',
      actionPointCost: 1,
      options: [
        { id: 'all', name: 'All Saves', description: 'Advantage on all saving throws' },
        { id: 'specific', name: 'Specific Save', description: 'Advantage on a specific saving throw type' }
      ],
      defaultParameters: {
        effectDice: '1d20',
        savingThrowType: 'all',
        bonusDice: '1d4',
        maxUses: 3
      }
    },
    {
      id: 'lifesteal',
      name: 'Life Steal',
      description: 'Recover health based on damage dealt',
      icon: 'spell_shadow_lifedrain02',
      category: 'buff',
      actionPointCost: 2,
      options: [
        { id: 'percent', name: 'Percentage Based', description: 'Recover percentage of damage dealt as health' },
        { id: 'fixed', name: 'Fixed Amount', description: 'Recover fixed amount of health per hit' },
        { id: 'critical', name: 'Critical Drain', description: 'Enhanced life steal on critical hits' }
      ],
      defaultParameters: {
        effectDice: '1d6',
        lifestealPercent: 25,
        lifestealDice: '1d4',
        critMultiplier: 2
      }
    }
  ];

/**
 * Negative status effects that can be applied by debuffs
 */
export const NEGATIVE_STATUS_EFFECTS = [
    {
      id: 'blinded',
      name: 'Blinded',
      description: 'Cannot see, automatically fails sight-based checks, disadvantage on attacks',
      icon: 'spell_shadow_eyeofthedarkmoon',
      category: 'sensory',
      actionPointCost: 3,
      options: [
        { id: 'partial', name: 'Partially Blinded', description: 'Vision severely obscured, disadvantage on perception' },
        { id: 'complete', name: 'Completely Blinded', description: 'Cannot see at all, automatically fail sight-based checks' },
        { id: 'flash', name: 'Flash Blinded', description: 'Temporary blindness that fades over time' }
      ],
      defaultParameters: {
        visionReduction: 50, // Percent
        canHearDirection: true,
        completeDuration: 1,
        partialDuration: 3
      },
      counters: ['perception', 'ranged attacks', 'spell targeting'],
      saveType: 'constitution'
    },
    {
      id: 'charmed',
      name: 'Charmed',
      description: 'Regards the charmer as a friendly acquaintance, cannot attack them',
      icon: 'spell_shadow_mindsteal',
      category: 'mental',
      actionPointCost: 4,
      options: [
        { id: 'friendly', name: 'Friendly Charm', description: 'Regards target as friend, still has free will' },
        { id: 'dominated', name: 'Domination', description: 'Must obey charmer\'s commands' },
        { id: 'infatuated', name: 'Infatuation', description: 'Will protect charmer at all costs' }
      ],
      defaultParameters: {
        charmDuration: 3, // rounds
        charmStrength: 'medium',
        charmEffect: 'suggestion'
      },
      counters: ['free will', 'decision making'],
      saveType: 'charisma'
    },
    {
      id: 'frightened',
      name: 'Frightened',
      description: 'Disadvantage on ability checks and attacks while source of fear is in sight',
      icon: 'spell_shadow_possession',
      category: 'mental',
      actionPointCost: 2,
      options: [
        { id: 'shaken', name: 'Shaken', description: 'Disadvantage on ability checks while fear source is visible' },
        { id: 'terrified', name: 'Terrified', description: 'Cannot willingly move closer to the source of fear' },
        { id: 'panicked', name: 'Panicked', description: 'Must use actions to flee from source of fear' }
      ],
      defaultParameters: {
        fearDuration: 3, // rounds
        fearRadius: 30, // feet
        fearStrength: 'medium'
      },
      counters: ['morale', 'courage'],
      saveType: 'spirit'
    },
    {
      id: 'paralyzed',
      name: 'Paralyzed',
      description: 'Incapacitated, cannot move or speak, auto-fails STR and AGI saves',
      icon: 'spell_nature_stranglevines',
      category: 'physical',
      actionPointCost: 4,
      options: [
        { id: 'partial', name: 'Partially Paralyzed', description: 'Speed reduced to 0, disadvantage on AGI saves' },
        { id: 'complete', name: 'Completely Paralyzed', description: 'Cannot move or take actions at all' },
        { id: 'magical', name: 'Magical Paralysis', description: 'Cannot move but can still cast non-somatic spells' }
      ],
      defaultParameters: {
        paralysisDuration: 2, // rounds
        paralysisType: 'magical',
        allowMental: false
      },
      counters: ['movement', 'physical actions'],
      saveType: 'constitution'
    },
    {
      id: 'poisoned',
      name: 'Poisoned',
      description: 'Disadvantage on attack rolls and ability checks',
      icon: 'ability_rogue_poisonousanimosity',
      category: 'physical',
      actionPointCost: 2,
      options: [
        { id: 'weakening', name: 'Weakening Poison', description: 'Disadvantage on STR and CON checks and saves' },
        { id: 'debilitating', name: 'Debilitating Poison', description: 'Takes damage over time' },
        { id: 'paralyzing', name: 'Paralyzing Poison', description: 'May cause paralysis on failed save' }
      ],
      defaultParameters: {
        poisonDuration: 4, // rounds
        poisonDamage: '1d6',
        poisonEffects: ['disadvantage', 'dot'],
        poisonType: 'natural'
      },
      counters: ['physical prowess', 'stamina'],
      saveType: 'constitution'
    },

    {
      id: 'restrained',
      name: 'Restrained',
      description: 'Speed becomes 0, disadvantage on attacks, advantage on attacks against them',
      icon: 'ability_warrior_throwdown',
      category: 'physical',
      actionPointCost: 3,
      options: [
        { id: 'ensnared', name: 'Ensnared', description: 'Caught in vines, webs, or similar restraints' },
        { id: 'grappled', name: 'Grappled', description: 'Held by a creature, can attempt to break free' },
        { id: 'bound', name: 'Bound', description: 'Tied up with rope or chains, very difficult to escape' }
      ],
      defaultParameters: {
        restraintDuration: 3, // rounds
        restraintStrength: 'medium', // DC modifier
        restraintType: 'magical',
        restraintDamage: 0
      },
      counters: ['movement', 'evasion'],
      saveType: 'strength'
    },
    {
      id: 'silenced',
      name: 'Silenced',
      description: 'Cannot speak or cast spells with verbal components',
      icon: 'spell_holy_silence',
      category: 'magical',
      actionPointCost: 2,
      options: [
        { id: 'magical', name: 'Magical Silence', description: 'No sound can be created within an area' },
        { id: 'muted', name: 'Muted', description: 'Individual cannot speak but other sounds function normally' },
        { id: 'temporal', name: 'Temporal Stutter', description: 'Speech and verbal casting unreliable, may fail' }
      ],
      defaultParameters: {
        silenceDuration: 3, // rounds
        silenceRadius: 0, // 0 for targeted, >0 for area
        affectsVerbalSpells: true,
        affectsSoundEffects: true
      },
      counters: ['spellcasting', 'verbal communication'],
      saveType: 'charisma'
    },



  ];

/**
 * Combat disadvantages for the debuff system
 */
export const COMBAT_DISADVANTAGES = [
    // Debuff disadvantages
    {
      id: 'attackers_advantage',
      name: 'Attackers Have Advantage',
      description: 'Attackers roll twice and take the higher result when attacking you',
      icon: 'ability_warrior_defensivestance',
      category: 'debuff',
      actionPointCost: 2,
      options: [
        { id: 'all', name: 'All Attackers', description: 'All attackers have advantage against you' },
        { id: 'melee', name: 'Melee Attackers', description: 'Melee attackers have advantage against you' },
        { id: 'ranged', name: 'Ranged Attackers', description: 'Ranged attackers have advantage against you' },
        { id: 'spell', name: 'Spell Attackers', description: 'Spell attackers have advantage against you' }
      ],
      defaultParameters: {
        requiresSave: true,
        saveType: 'agility',
        duration: 3, // rounds
        disadvantageCount: 1,
        affectsMelee: true,
        affectsRanged: true,
        affectsSpell: true
      }
    },
    {
      id: 'disadvantage_attack',
      name: 'Disadvantage on Attacks',
      description: 'Roll twice and take the lower result on attack rolls',
      icon: 'ability_rogue_wrongfullyaccused',
      category: 'debuff',
      actionPointCost: 2,
      options: [
        { id: 'all', name: 'All Attacks', description: 'Disadvantage on all attack rolls' },
        { id: 'melee', name: 'Melee Attacks', description: 'Disadvantage on melee attack rolls' },
        { id: 'ranged', name: 'Ranged Attacks', description: 'Disadvantage on ranged attack rolls' },
        { id: 'spell', name: 'Spell Attacks', description: 'Disadvantage on spell attack rolls' }
      ],
      defaultParameters: {
        requiresSave: true,
        saveType: 'agility',
        duration: 3, // rounds
        disadvantageCount: 1,
        affectsMelee: true,
        affectsRanged: true,
        affectsSpell: true
      }
    },
    {
      id: 'disadvantage_save',
      name: 'Disadvantage on Saves',
      description: 'Roll twice and take the lower result on saving throws',
      icon: 'spell_shadow_antishadow',
      category: 'debuff',
      actionPointCost: 2,
      options: [
        { id: 'all', name: 'All Saves', description: 'Disadvantage on all saving throws' },
        { id: 'specific', name: 'Specific Save', description: 'Disadvantage on a specific saving throw' }
      ],
      saveTypes: [
        { id: 'strength', name: 'Strength', icon: 'spell_nature_strength' },
        { id: 'agility', name: 'Agility', icon: 'ability_rogue_quickrecovery' },
        { id: 'constitution', name: 'Constitution', icon: 'spell_holy_devotion' },
        { id: 'intelligence', name: 'Intelligence', icon: 'spell_arcane_arcane01' },
        { id: 'spirit', name: 'Spirit', icon: 'spell_holy_divinespirit' },
        { id: 'charisma', name: 'Charisma', icon: 'spell_holy_powerwordshield' }
      ],
      defaultParameters: {
        specificSave: 'strength',
        duration: 3, // rounds
        disadvantageCount: 1
      }
    },
    {
      id: 'damage_vulnerability',
      name: 'Vulnerability',
      description: 'Take increased damage from specific sources',
      icon: 'spell_shadow_shadowwordpain',
      category: 'debuff',
      actionPointCost: 3,
      options: [
        { id: 'physical', name: 'Physical Vulnerability', description: 'Take increased damage from physical attacks' },
        { id: 'elemental', name: 'Elemental Vulnerability', description: 'Take increased damage from elemental attacks' },
        { id: 'magical', name: 'Magical Vulnerability', description: 'Take increased damage from all magical attacks' }
      ],
      defaultParameters: {
        slashing: true,
        piercing: true,
        bludgeoning: true,
        primaryElement: 'fire',
        primaryStrength: 100, // percent (100% = double damage)
        duration: 3 // rounds
      }
    },
    {
      id: 'reduced_speed',
      name: 'Reduced Speed',
      description: 'Movement speed is reduced',
      icon: 'spell_frost_chainsofice',
      category: 'debuff',
      actionPointCost: 1,
      options: [
        { id: 'slow', name: 'Slowed', description: 'Movement speed reduced by half' },
        { id: 'immobile', name: 'Immobilized', description: 'Cannot move but can still take actions' },
        { id: 'restrained', name: 'Restrained', description: 'Speed becomes 0 and disadvantage on attacks' }
      ],
      defaultParameters: {
        speedReduction: 50, // percent
        duration: 3, // rounds
        affectsActionPoints: false
      }
    },
    {
      id: 'reduced_armor',
      name: 'Reduced Armor',
      description: 'Armor is reduced',
      icon: 'spell_shadow_curseofachimonde',
      category: 'debuff',
      actionPointCost: 2,
      options: [
        { id: 'minor', name: 'Minor Reduction', description: 'Armor reduced by a small amount' },
        { id: 'major', name: 'Major Reduction', description: 'Armor reduced significantly' },
        { id: 'bypass', name: 'Armor Bypass', description: 'Specific attacks ignore a portion of armor' }
      ],
      defaultParameters: {
        armorReduction: 4,
        duration: 3, // rounds
        bypassPercentage: 0 // percent
      }
    },
    {
      id: 'stat_reduction',
      name: 'Stat Reduction',
      description: 'Primary attribute values are reduced',
      icon: 'spell_shadow_curseofweakness',
      category: 'debuff',
      actionPointCost: 3,
      options: [
        { id: 'physical', name: 'Physical Weakness', description: 'Reduces strength and/or agility' },
        { id: 'mental', name: 'Mental Fatigue', description: 'Reduces intelligence and/or spirit' },
        { id: 'vitality', name: 'Reduced Vitality', description: 'Reduces constitution' }
      ],
      defaultParameters: {
        statReductions: {
          strength: 0,
          agility: 0,
          constitution: 0,
          intelligence: 0,
          spirit: 0,
          charisma: 0
        },
        duration: 3 // rounds
      }
    },
    {
      id: 'action_point_drain',
      name: 'Action Point Drain',
      description: 'Target loses action points or regenerates fewer per round',
      icon: 'spell_nature_timestop',
      category: 'debuff',
      actionPointCost: 3,
      options: [
        { id: 'immediate', name: 'Immediate Drain', description: 'Immediately removes action points' },
        { id: 'sustained', name: 'Sustained Drain', description: 'Reduces action point regeneration' },
        { id: 'increasing', name: 'Increasing Cost', description: 'Actions cost more action points' }
      ],
      defaultParameters: {
        immediateReduction: 2,
        regenReduction: 1,
        costIncrease: 1,
        duration: 2 // rounds
      }
    }
  ];

  /**
   * Find a status effect by ID and type
   * @param {string} id - The ID of the status effect to find
   * @param {boolean} positive - Whether to search in positive or negative effects
   * @returns {Object|null} - The found status effect or null
   */
export function findStatusEffectById(id, positive = true) {
    const effectsArray = positive ? POSITIVE_STATUS_EFFECTS : NEGATIVE_STATUS_EFFECTS;
    return effectsArray.find(effect => effect.id === id) || null;
  }

  /**
   * Find any status effect (positive or negative) by ID
   * @param {string} id - The ID of the status effect to find
   * @returns {Object|null} - The found status effect or null
   */
export function findAnyStatusEffectById(id) {
    return findStatusEffectById(id, true) || findStatusEffectById(id, false);
  }

  /**
   * Find a combat advantage/disadvantage by ID
   * @param {string} id - The ID of the combat advantage/disadvantage to find
   * @param {boolean} isAdvantage - Whether to search in advantages or disadvantages
   * @returns {Object|null} - The found combat advantage/disadvantage or null
   */
export function findCombatEffectById(id, isAdvantage = true) {
    const effectsArray = isAdvantage ? COMBAT_ADVANTAGES : COMBAT_DISADVANTAGES;
    return effectsArray.find(effect => effect.id === id) || null;
  }

  /**
   * Get all status effects of a specific category
   * @param {string} category - The category to filter by (e.g., 'mental', 'physical')
   * @param {boolean} positive - Whether to search in positive or negative effects
   * @returns {Array} - Array of status effects in the category
   */
export function getStatusEffectsByCategory(category, positive = true) {
    const effectsArray = positive ? POSITIVE_STATUS_EFFECTS : NEGATIVE_STATUS_EFFECTS;
    return effectsArray.filter(effect => effect.category === category);
  }

  /**
   * Check if a status effect would stack with existing effects
   * @param {Object} effect - The new effect to check
   * @param {Array} existingEffects - Array of existing effects
   * @returns {Object} - {stacks: boolean, conflicts: Array}
   */
export function checkStatusEffectStacking(effect, existingEffects) {
    if (!effect || !existingEffects || !existingEffects.length) {
      return { stacks: true, conflicts: [] };
    }

    const conflicts = [];

    // Check for identical effects (same ID)
    const sameIdEffects = existingEffects.filter(e => e.id === effect.id);
    if (sameIdEffects.length > 0) {
      conflicts.push({
        type: 'identical',
        effects: sameIdEffects,
        resolution: 'replace'
      });
    }

    // Check for mutually exclusive effects
    const exclusiveMap = {
      // Movement modifiers that don't stack
      'haste': ['slowed'],
      'slowed': ['haste'],

      // Control effects that override each other
      'paralyzed': ['stunned', 'restrained'],
      'stunned': ['paralyzed', 'restrained'],
      'restrained': ['paralyzed', 'stunned'],

      // Mental effects that conflict
      'charmed': ['frightened'],
      'frightened': ['charmed'],

      // Perception effects that conflict
      'blinded': ['truesight'],
      'truesight': ['blinded']
    };

    if (exclusiveMap[effect.id]) {
      const exclusiveConflicts = existingEffects.filter(e =>
        exclusiveMap[effect.id].includes(e.id)
      );

      if (exclusiveConflicts.length > 0) {
        conflicts.push({
          type: 'exclusive',
          effects: exclusiveConflicts,
          resolution: 'replace'
        });
      }
    }

    return {
      stacks: conflicts.length === 0,
      conflicts
    };
  }

  /**
   * Get status effects that counter a specific effect
   * @param {string} effectId - ID of the effect to find counters for
   * @returns {Array} - Array of status effects that counter the given effect
   */
export function getStatusEffectCounters(effectId) {
    const effect = findAnyStatusEffectById(effectId);
    if (!effect) return [];

    // Define counter relationships
    const counterMap = {
      // Positive effects countered by negative effects
      'haste': ['slowed', 'paralyzed', 'stunned'],
      'invisible': ['truesight'],
      'flying': ['restrained', 'paralyzed', 'stunned'],
      'regeneration': ['poisoned'],
      'resistance': ['vulnerability'],
      'empowered': ['silenced'],
      'shielded': ['dispel'],

      // Negative effects countered by positive effects
      'poisoned': ['regeneration', 'purify'],
      'blinded': ['truesight', 'purify'],
      'burning': ['frost', 'water'],
      'frozen': ['fire', 'heat'],
      'paralyzed': ['freedom'],
      'stunned': ['freedom'],
      'restrained': ['freedom'],
      'charmed': ['mindShield'],
      'frightened': ['courage'],
      'silenced': ['freedom']
    };

    return counterMap[effectId] || [];
  }

  /**
   * Check if a target is immune to a specific status effect
   * @param {Object} target - The target to check
   * @param {string} effectId - The ID of the effect to check immunity for
   * @returns {boolean} - Whether the target is immune
   */
export function isImmuneToStatusEffect(target, effectId) {
    if (!target || !target.immunities) return false;

    // Direct immunity to the effect
    if (target.immunities.includes(effectId)) return true;

    // Immunity categories
    const categoryImmunities = {
      'mental': ['charmed', 'frightened'],
      'physical': ['paralyzed', 'restrained', 'poisoned'],
      'magical': ['silenced'],
      'elemental': ['burning', 'frozen'],
      'sensory': ['blinded']
    };

    // Check category immunities
    for (const [category, effects] of Object.entries(categoryImmunities)) {
      if (target.immunities.includes(category) && effects.includes(effectId)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Get the text description of a status effect with custom parameters
   * @param {string} effectId - The ID of the status effect
   * @param {boolean} positive - Whether it's a positive or negative effect
   * @param {Object} parameters - Custom parameters for the effect
   * @returns {string} - A formatted description of the effect
   */
export function getStatusEffectDescription(effectId, positive = true, parameters = {}) {
    const effect = findStatusEffectById(effectId, positive);
    if (!effect) return 'Unknown effect';

    let description = effect.description;

    // Customize description based on parameters
    if (parameters) {
      // Replace placeholder values in the description
      if (effect.id === 'haste' && parameters.speedMultiplier) {
        description = description.replace('more quickly', `${parameters.speedMultiplier}× faster`);
      } else if (effect.id === 'resistance' && parameters.resistanceAmount) {
        description = description.replace('reduced damage', `${parameters.resistanceAmount}% less damage`);
      } else if (effect.id === 'flying' && parameters.flightSpeed) {
        description = description.replace('to fly', `to fly at ${parameters.flightSpeed} feet per round`);
      } else if (effect.id === 'truesight' && parameters.truesightRange) {
        description = description.replace('and into', `up to ${parameters.truesightRange} feet and into`);
      }

      // Add duration if specified
      if (parameters.duration) {
        description += ` for ${parameters.duration} ${parameters.durationType || 'rounds'}`;
      }
    }

    return description;
  }

  /**
   * Check if two status effects would be compatible on the same target
   * @param {string} effectIdA - First effect ID
   * @param {string} effectIdB - Second effect ID
   * @returns {boolean} - Whether the effects are compatible
   */
export function areStatusEffectsCompatible(effectIdA, effectIdB) {
    // Self-comparison is always true
    if (effectIdA === effectIdB) return true;

    // Incompatible effect pairs
    const incompatiblePairs = [
      ['haste', 'slowed'],
      ['invisible', 'blinded'],
      ['charmed', 'frightened'],
      ['paralyzed', 'flying'],
      ['paralyzed', 'haste'],
      ['stunned', 'flying'],
      ['stunned', 'haste'],
      ['silenced', 'empowered']
    ];

    return !incompatiblePairs.some(pair =>
      (pair[0] === effectIdA && pair[1] === effectIdB) ||
      (pair[0] === effectIdB && pair[1] === effectIdA)
    );
  }

  /**
   * Determine the severity of a negative status effect
   * @param {string} effectId - The ID of the negative status effect
   * @returns {string} - 'severe', 'moderate', or 'mild'
   */
export function getStatusEffectSeverity(effectId) {
    const severeEffects = ['paralyzed', 'stunned', 'charmed'];
    const moderateEffects = ['blinded', 'frightened', 'poisoned', 'restrained', 'silenced'];

    if (severeEffects.includes(effectId)) return 'severe';
    if (moderateEffects.includes(effectId)) return 'moderate';
    return 'mild';
  }

  /**
   * Get save DC for resisting a status effect
   * @param {string} effectId - The ID of the status effect
   * @param {Object} caster - The entity applying the effect
   * @returns {number} - The calculated save DC
   */
export function getStatusEffectSaveDC(effectId, caster) {
    const effect = findAnyStatusEffectById(effectId);
    if (!effect) return 10;

    // Base DC is 8 + proficiency + ability modifier
    let baseDC = 8;

    // Add caster's proficiency bonus
    if (caster && caster.proficiencyBonus) {
      baseDC += caster.proficiencyBonus;
    }

    // Add caster's relevant ability modifier
    if (caster && caster.abilityScores) {
      // Determine which ability score to use based on effect category
      let abilityMod = 0;

      if (effect.category === 'mental') {
        // Use Intelligence, Spirit, or Charisma
        abilityMod = Math.max(
          (caster.abilityScores.intelligence - 10) / 2,
          (caster.abilityScores.spirit - 10) / 2,
          (caster.abilityScores.charisma - 10) / 2
        );
      } else if (effect.category === 'physical') {
        // Use Strength or Constitution
        abilityMod = Math.max(
          (caster.abilityScores.strength - 10) / 2,
          (caster.abilityScores.constitution - 10) / 2
        );
      } else {
        // Default to primary casting ability
        abilityMod = (caster.abilityScores[caster.primaryCastingAbility] - 10) / 2;
      }

      baseDC += Math.floor(abilityMod);
    }

    // Add effect-specific DC modifier
    const effectDCModifiers = {
      'charmed': 2,
      'frightened': 0,
      'paralyzed': 2,
      'stunned': 2,
      'blinded': 1,
      'poisoned': 0,
      'burning': 0,
      'frozen': 1,
      'restrained': 0,
      'silenced': 1,
      'slowed': 0
    };

    return baseDC + (effectDCModifiers[effectId] || 0);
  }