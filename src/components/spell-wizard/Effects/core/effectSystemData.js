/**
 * Enhanced Effect System Data
 * 
 * This file contains constants and utility functions for the action point-based spell effect system.
 * It defines effect types, damage types, duration options, stats, and more.
 */

// =====================================================================
// CORE EFFECT SYSTEM
// =====================================================================

/**
 * Main effect types that define the core functionality of spells and abilities
 */
const EFFECT_TYPES = [
    {
      id: 'damage',
      name: 'Damage',
      description: 'Deal damage to targets',
      icon: 'spell_fire_flamebolt',
      category: 'offensive',
      actionPointCost: 2
    },
    {
      id: 'healing',
      name: 'Healing',
      description: 'Restore health to targets',
      icon: 'spell_holy_flashheal',
      category: 'supportive',
      actionPointCost: 2
    },
    {
      id: 'buff',
      name: 'Buff',
      description: 'Apply positive effects to allies',
      icon: 'spell_holy_divinespirit',
      category: 'supportive',
      actionPointCost: 1
    },
    {
      id: 'debuff',
      name: 'Debuff',
      description: 'Apply negative effects to enemies',
      icon: 'spell_shadow_curseofsargeras',
      category: 'offensive',
      actionPointCost: 1
    },
    {
      id: 'utility',
      name: 'Utility',
      description: 'Create various non-combat effects',
      icon: 'spell_nature_polymorph',
      category: 'utility',
      actionPointCost: 1
    },
    {
      id: 'control',
      name: 'Control',
      description: 'Manipulate battlefield positioning and enemy actions',
      icon: 'spell_frost_chainsofice',
      category: 'tactical',
      actionPointCost: 2
    },
    {
      id: 'summoning',
      name: 'Summoning',
      description: 'Summon allies or creatures to assist in battle',
      icon: 'spell_shadow_summoninfernal',
      category: 'conjuration',
      actionPointCost: 3
    },
    {
      id: 'transformation',
      name: 'Transformation',
      description: 'Change form or properties of targets',
      icon: 'spell_nature_elementalshields',
      category: 'alteration',
      actionPointCost: 2
    }
  ];
  
  /**
   * Damage types with detailed categories and properties
   */
  const DAMAGE_TYPES = [
    // Physical types
    {
      id: 'bludgeoning',
      name: 'Bludgeoning',
      description: 'Blunt force trauma from hammers, falling, constriction',
      icon: 'inv_mace_2h_blacksmithing_01',
      category: 'physical',
      commonResistance: 'heavy armor',
      commonVulnerability: 'constructs'
    },
    {
      id: 'piercing',
      name: 'Piercing',
      description: 'Punctures and impalement from spears, arrows, bites',
      icon: 'inv_sword_33',
      category: 'physical',
      commonResistance: 'medium armor',
      commonVulnerability: 'unarmored'
    },
    {
      id: 'slashing',
      name: 'Slashing',
      description: 'Cuts, gashes, and tears from swords, axes, claws',
      icon: 'ability_warrior_cleave',
      category: 'physical',
      commonResistance: 'plate armor',
      commonVulnerability: 'cloth armor'
    },
    
    // Elemental types
    {
      id: 'fire',
      name: 'Fire',
      description: 'Burning damage from flames, heat, and combustion',
      icon: 'spell_fire_fire',
      category: 'elemental',
      commonResistance: 'red dragons, fire elementals',
      commonVulnerability: 'undead, plants, ice creatures'
    },
    {
      id: 'cold',
      name: 'Cold',
      description: 'Freezing damage from ice and extreme low temperatures',
      icon: 'spell_frost_frostbolt02',
      category: 'elemental',
      commonResistance: 'ice elementals, white dragons',
      commonVulnerability: 'fire creatures, water elementals'
    },
    {
      id: 'lightning',
      name: 'Lightning',
      description: 'Electrical damage from lightning and electrical energy',
      icon: 'spell_lightning_lightningbolt01',
      category: 'elemental',
      commonResistance: 'blue dragons, air elementals',
      commonVulnerability: 'creatures in metal armor, water-based creatures'
    },
    {
      id: 'thunder',
      name: 'Thunder',
      description: 'Concussive damage from sound and sonic energy',
      icon: 'spell_nature_thunderclap',
      category: 'elemental',
      commonResistance: 'constructs, air elementals',
      commonVulnerability: 'crystalline creatures, creatures with sensitive hearing'
    },
    {
      id: 'acid',
      name: 'Acid',
      description: 'Corrosive damage from acid and dissolving substances',
      icon: 'spell_nature_acid_01',
      category: 'elemental',
      commonResistance: 'oozes, black dragons',
      commonVulnerability: 'metal armor, constructs'
    },
    
    // Magical types
    {
      id: 'force',
      name: 'Force',
      description: 'Pure magical energy forming invisible constructs',
      icon: 'spell_arcane_blast',
      category: 'arcane',
      commonResistance: 'arcane golems',
      commonVulnerability: 'ethereal creatures',
      bypassesNormalResistance: true
    },
    {
      id: 'necrotic',
      name: 'Necrotic',
      description: 'Life-draining decay and negative energy',
      icon: 'spell_shadow_deathcoil',
      category: 'otherworldly',
      commonResistance: 'undead, constructs',
      commonVulnerability: 'living creatures, plants'
    },
    {
      id: 'radiant',
      name: 'Radiant',
      description: 'Holy energy that burns the impure',
      icon: 'spell_holy_holysmite',
      category: 'otherworldly',
      commonResistance: 'celestials, light elementals',
      commonVulnerability: 'undead, fiends, shadows'
    },
    {
      id: 'poison',
      name: 'Poison',
      description: 'Toxic substances that damage the body',
      icon: 'ability_rogue_poisonousanimosity',
      category: 'elemental',
      commonResistance: 'undead, constructs, plants',
      commonVulnerability: 'beasts, humanoids'
    },
    {
      id: 'psychic',
      name: 'Psychic',
      description: 'Mental energy that damages the mind',
      icon: 'spell_shadow_mindtwisting',
      category: 'otherworldly',
      commonResistance: 'mindless creatures, constructs',
      commonVulnerability: 'intelligent creatures, psionic beings'
    },
    {
      id: 'chaos',
      name: 'Chaos',
      description: 'Unpredictable energy that warps reality',
      icon: 'spell_shadow_seedofdestruction',
      category: 'otherworldly',
      commonResistance: 'demons, aberrations',
      commonVulnerability: 'lawful beings, constructs',
      unstable: true
    },
    {
      id: 'void',
      name: 'Void',
      description: 'Energy from the dark spaces between realities',
      icon: 'spell_shadow_shadowfury',
      category: 'otherworldly',
      commonResistance: 'aberrations, void creatures',
      commonVulnerability: 'creatures of light, summoned beings',
      bypassesNormalResistance: true
    }
  ];
  
  /**
   * Duration types for effects with detailed icons and descriptions
   */
  const DURATION_TYPES = [
    {
      id: 'instant',
      name: 'Instant',
      description: 'Effect occurs once and immediately',
      icon: 'spell_nature_timestop',
      actionPointModifier: 0
    },
    {
      id: 'rounds',
      name: 'Rounds',
      description: 'Effect lasts for a specific number of combat rounds',
      icon: 'spell_holy_borrowedtime',
      actionPointModifier: 1
    },
    {
      id: 'minutes',
      name: 'Minutes',
      description: 'Effect lasts for a specific number of minutes',
      icon: 'spell_holy_innerfire',
      actionPointModifier: 2
    },
    {
      id: 'hours',
      name: 'Hours',
      description: 'Effect lasts for a specific number of hours',
      icon: 'spell_holy_guardianspirit',
      actionPointModifier: 3
    },
    {
      id: 'concentration',
      name: 'Concentration',
      description: 'Effect lasts as long as caster maintains concentration',
      icon: 'spell_arcane_mindmastery',
      actionPointModifier: 1,
      requiresConcentration: true
    },
    {
      id: 'permanent',
      name: 'Permanent',
      description: 'Effect lasts until dispelled or ended by specific condition',
      icon: 'spell_holy_divineillumination',
      actionPointModifier: 4,
      requiresRitualCasting: true
    }
  ];
  
  /**
   * Targeting methods for spells and abilities
   */
  const TARGETING_TYPES = [
    {
      id: 'single',
      name: 'Single Target',
      description: 'Affects one specific target',
      icon: 'ability_hunter_snipershot',
      actionPointModifier: 0
    },
    {
      id: 'multi',
      name: 'Multiple Targets',
      description: 'Affects several individually selected targets',
      icon: 'spell_frost_chainofdamnation',
      actionPointModifier: 1
    },
    {
      id: 'area',
      name: 'Area of Effect',
      description: 'Affects all targets within a defined area',
      icon: 'spell_fire_flamestrike',
      actionPointModifier: 1
    },
    {
      id: 'chain',
      name: 'Chain Effect',
      description: 'Effect jumps from one target to nearby targets',
      icon: 'spell_frost_chainheal',
      actionPointModifier: 2
    },
    {
      id: 'cone',
      name: 'Cone',
      description: 'Affects targets in a cone-shaped area',
      icon: 'spell_fire_flamegeyser',
      actionPointModifier: 1
    },
    {
      id: 'line',
      name: 'Line',
      description: 'Affects targets in a line',
      icon: 'spell_arcane_starfire',
      actionPointModifier: 1
    },
    {
      id: 'self',
      name: 'Self',
      description: 'Only affects the caster',
      icon: 'spell_holy_powerwordshield',
      actionPointModifier: -1
    },
    {
      id: 'smart',
      name: 'Smart Targeting',
      description: 'Automatically selects targets based on parameters',
      icon: 'spell_holy_divineillumination',
      actionPointModifier: 2
    }
  ];
  
  /**
   * Area of Effect shapes with size parameters
   */
  const AOE_SHAPES = [
    {
      id: 'circle',
      name: 'Circle',
      description: 'Affects all targets within a circular area',
      icon: 'spell_holy_circleofrenewal',
      defaultRadius: 20,
      parameterType: 'radius'
    },
    {
      id: 'square',
      name: 'Square',
      description: 'Affects all targets within a square area',
      icon: 'inv_misc_gem_diamond_02',
      defaultSize: 15,
      parameterType: 'sideLength'
    },
    {
      id: 'cone',
      name: 'Cone',
      description: 'Affects targets in a cone-shaped area extending from the caster',
      icon: 'inv_throwingaxe_03',
      defaultRange: 15,
      defaultAngle: 90,
      parameterType: 'rangeAngle'
    },
    {
      id: 'line',
      name: 'Line',
      description: 'Affects targets in a straight line from the caster',
      icon: 'inv_weapon_bow_07',
      defaultLength: 30,
      defaultWidth: 5,
      parameterType: 'lengthWidth'
    },
    {
      id: 'cube',
      name: 'Cube',
      description: 'Affects all targets within a three-dimensional cube',
      icon: 'inv_misc_gem_diamond_01',
      defaultSize: 15,
      parameterType: 'sideLength'
    },
    {
      id: 'sphere',
      name: 'Sphere',
      description: 'Affects all targets within a three-dimensional sphere',
      icon: 'inv_misc_orb_01',
      defaultRadius: 20,
      parameterType: 'radius'
    },
    {
      id: 'cylinder',
      name: 'Cylinder',
      description: 'Affects all targets within a cylinder',
      icon: 'spell_holy_circleofrenewal',
      defaultRadius: 10,
      defaultHeight: 20,
      parameterType: 'radiusHeight'
    },
    {
      id: 'wall',
      name: 'Wall',
      description: 'Creates a wall-shaped effect',
      icon: 'spell_holy_powerwordbarrier',
      defaultLength: 30,
      defaultHeight: 10,
      defaultWidth: 5,
      parameterType: 'lengthHeightWidth'
    }
  ];
  
  // =====================================================================
  // STATS SYSTEM
  // =====================================================================
  
  /**
   * Primary stat modifiers (character attributes)
   */
  const PRIMARY_STAT_MODIFIERS = [
    {
      id: 'strength',
      name: 'Strength',
      description: 'Physical power, affects melee damage and carrying capacity',
      icon: 'spell_nature_strength',
      category: 'primary',
      defaultValue: 10,
      affectsSkills: ['athletics', 'intimidation'],
      affectsDefense: false,
      governs: ['meleeAttacks', 'carryingCapacity', 'physicalSaves']
    },
    {
      id: 'agility',
      name: 'Agility',
      description: 'Agility, reflexes, and balance, affects AC and ranged attacks',
      icon: 'ability_rogue_quickrecovery',
      category: 'primary',
      defaultValue: 10,
      affectsSkills: ['acrobatics', 'stealth', 'sleightOfHand'],
      affectsDefense: true,
      governs: ['rangedAttacks', 'initiative', 'reflexSaves']
    },
    {
      id: 'constitution',
      name: 'Constitution',
      description: 'Health, stamina, and vital force, affects hit points',
      icon: 'spell_holy_devotionaura',
      category: 'primary',
      defaultValue: 10,
      affectsSkills: ['concentration', 'endurance'],
      affectsDefense: true,
      governs: ['hitPoints', 'fortitudeSaves', 'diseaseResistance']
    },
    {
      id: 'intelligence',
      name: 'Intelligence',
      description: 'Reasoning and memory, affects arcane spellcasting',
      icon: 'spell_arcane_arcane02',
      category: 'primary',
      defaultValue: 10,
      affectsSkills: ['arcana', 'history', 'investigation', 'nature'],
      affectsDefense: false,
      governs: ['arcaneSpellcasting', 'actionPoints', 'knowledgeChecks']
    },
    {
      id: 'spirit',
      name: 'Spirit',
      description: 'Perception and insight, affects divine spellcasting',
      icon: 'spell_holy_holyguidance',
      category: 'primary',
      defaultValue: 10,
      affectsSkills: ['insight', 'medicine', 'perception', 'survival'],
      affectsDefense: false,
      governs: ['divineSpellcasting', 'willpowerSaves', 'healingEfficiency']
    },
    {
      id: 'charisma',
      name: 'Charisma',
      description: 'Force of personality, affects social interactions and some spellcasting',
      icon: 'spell_holy_powerinfusion',
      category: 'primary',
      defaultValue: 10,
      affectsSkills: ['deception', 'intimidation', 'performance', 'persuasion'],
      affectsDefense: false,
      governs: ['primalSpellcasting', 'socialInteractions', 'summoningPower']
    }
  ];
  
  /**
   * Secondary stat modifiers (derived attributes)
   */
  const SECONDARY_STAT_MODIFIERS = [
    {
      id: 'ac',
      name: 'Armor Class',
      description: 'How difficult you are to hit in combat',
      icon: 'inv_shield_04',
      category: 'defense',
      defaultValue: 10,
      derivedFrom: ['agility', 'armor'],
      formula: '10 + agilityMod + armorBonus',
      counters: ['physicalAttacks']
    },
    {
      id: 'initiative',
      name: 'Initiative',
      description: 'How quickly you act in combat',
      icon: 'spell_nature_invisibility',
      category: 'combat',
      defaultValue: 0,
      derivedFrom: ['agility', 'combatTraining'],
      formula: 'agilityMod + combatTrainingBonus',
      important: true
    },
    {
      id: 'speed',
      name: 'Movement Speed',
      description: 'How far you can move in a single round',
      icon: 'ability_rogue_sprint',
      category: 'movement',
      defaultValue: 30,
      derivedFrom: ['race', 'class', 'encumbrance'],
      formula: 'baseSpeed + racialMod - encumbrancePenalty',
      unit: 'feet'
    },
    {
      id: 'perception',
      name: 'Perception',
      description: 'Ability to notice hidden things',
      icon: 'ability_hunter_snipershot',
      category: 'senses',
      defaultValue: 10,
      derivedFrom: ['spirit', 'race'],
      formula: '10 + spiritMod + racialBonus',
      counters: ['stealth', 'invisibility']
    },
    {
      id: 'stealth',
      name: 'Stealth',
      description: 'Ability to move unseen',
      icon: 'ability_stealth',
      category: 'skills',
      defaultValue: 10,
      derivedFrom: ['agility', 'armor'],
      formula: '10 + agilityMod - armorPenalty',
      counters: ['perception']
    },
    {
      id: 'spellDC',
      name: 'Spell Save DC',
      description: 'How difficult your spells are to resist',
      icon: 'spell_arcane_starfire',
      category: 'magic',
      defaultValue: 10,
      derivedFrom: ['castingStat', 'proficiency'],
      formula: '8 + castingStatMod + proficiencyBonus + itemBonus',
      important: true
    },
    {
      id: 'spellAttack',
      name: 'Spell Attack Bonus',
      description: 'Your accuracy with spell attacks',
      icon: 'spell_nature_lightning',
      category: 'magic',
      defaultValue: 0,
      derivedFrom: ['castingStat', 'proficiency'],
      formula: 'castingStatMod + proficiencyBonus + itemBonus',
      important: true
    },
    {
      id: 'hp',
      name: 'Hit Points',
      description: 'Your health and ability to withstand damage',
      icon: 'spell_holy_sealofsacrifice',
      category: 'vitality',
      defaultValue: 10,
      derivedFrom: ['constitution', 'class', 'level'],
      formula: 'classBaseHP + (constitutionMod * level) + bonusHP',
      vital: true
    },
    {
      id: 'tempHP',
      name: 'Temporary Hit Points',
      description: 'Temporary buffer of health that absorbs damage',
      icon: 'spell_holy_powerwordshield',
      category: 'vitality',
      defaultValue: 0,
      derivedFrom: ['effects', 'spells'],
      formula: 'Sum of all active temporary HP effects (does not stack by default)',
      temporary: true
    },
    {
      id: 'actionPoints',
      name: 'Action Points',
      description: 'Points used to perform actions in combat',
      icon: 'spell_nature_timestop',
      category: 'combat',
      defaultValue: 5,
      derivedFrom: ['intelligence', 'class', 'level'],
      formula: 'baseActionPoints + intelligenceMod + classBonusPoints',
      vital: true,
      refreshCondition: 'At the start of your turn'
    },
    {
      id: 'energyShield',
      name: 'Energy Shield',
      description: 'Magical barrier that absorbs damage before hit points',
      icon: 'spell_holy_powerwordshield',
      category: 'defense',
      defaultValue: 0,
      derivedFrom: ['spells', 'items'],
      formula: 'Sum of all active energy shield effects',
      regenerates: true,
      regenFormula: '20% of max shield per round when not taking damage'
    },
    {
      id: 'magicResistance',
      name: 'Magic Resistance',
      description: 'Reduces damage from magical attacks',
      icon: 'spell_arcane_prismaticcloak',
      category: 'defense',
      defaultValue: 0,
      derivedFrom: ['race', 'class', 'items'],
      formula: 'raceResist + classResist + itemResist',
      maxValue: 75,
      unit: 'percent'
    }
  ];
  
  /**
   * Combat stat modifiers for detailed combat mechanics
   */
  const COMBAT_STAT_MODIFIERS = [
    {
      id: 'attack_bonus',
      name: 'Attack Bonus',
      description: 'Bonus to attack rolls',
      icon: 'ability_hunter_snipershot',
      category: 'combat',
      defaultValue: 0,
      actionPointImpact: 'Increases hit chance per AP spent'
    },
    {
      id: 'damage_bonus',
      name: 'Damage Bonus',
      description: 'Bonus to damage rolls',
      icon: 'ability_warrior_decisivestrike',
      category: 'combat',
      defaultValue: 0,
      damageFormula: 'baseDamage + damageBonus'
    },
    {
      id: 'crit_chance',
      name: 'Critical Hit Chance',
      description: 'Chance to score a critical hit',
      icon: 'ability_rogue_findweakness',
      category: 'combat',
      defaultValue: 5, // Percent
      critFormula: 'baseCritChance + critBonuses - targetCritResistance'
    },
    {
      id: 'crit_damage',
      name: 'Critical Damage',
      description: 'Additional damage on critical hits',
      icon: 'ability_rogue_eviscerate',
      category: 'combat',
      defaultValue: 100, // Percent
      critDamageFormula: 'baseDamage * (1 + critDamageMultiplier/100)'
    },
    {
      id: 'save_bonus',
      name: 'Saving Throw Bonus',
      description: 'Bonus to saving throws',
      icon: 'spell_holy_sealofprotection',
      category: 'combat',
      defaultValue: 0,
      saveFormula: 'd20 + saveBonus vs DC'
    },
    {
      id: 'evasion',
      name: 'Evasion',
      description: 'Chance to avoid attacks entirely',
      icon: 'spell_shadow_shadowward',
      category: 'combat',
      defaultValue: 0, // Percent
      evasionCheck: 'percentChance + agilityModifier - attackerAccuracy'
    },
    {
      id: 'accuracy',
      name: 'Accuracy',
      description: 'Reduces miss chance against evasive targets',
      icon: 'ability_hunter_mastermarksman',
      category: 'combat',
      defaultValue: 0, // Percent
      countersStat: 'evasion'
    },
    {
      id: 'healing_received',
      name: 'Healing Received',
      description: 'Modifies healing effects received',
      icon: 'spell_holy_renew',
      category: 'combat',
      defaultValue: 100, // Percent
      healFormula: 'baseHealing * (healingReceived/100)'
    },
    {
      id: 'threat_generation',
      name: 'Threat Generation',
      description: 'Modifies threat/aggro generated against enemies',
      icon: 'ability_warrior_challange',
      category: 'combat',
      defaultValue: 100, // Percent
      tankingRelated: true
    },
    {
      id: 'spell_penetration',
      name: 'Spell Penetration',
      description: 'Ignores a portion of targets spell resistance',
      icon: 'spell_arcane_arcane02',
      category: 'combat',
      defaultValue: 0, // Percent
      penetrationFormula: 'targetResistance - spellPenetration'
    },
    {
      id: 'action_point_regen',
      name: 'Action Point Regeneration',
      description: 'Additional action points recovered each round',
      icon: 'spell_nature_timestop',
      category: 'combat',
      defaultValue: 0,
      vital: true,
      maxValue: 5
    },
    {
      id: 'area_damage',
      name: 'Area Damage Bonus',
      description: 'Increases damage of area effect spells',
      icon: 'spell_fire_flamestrike',
      category: 'combat',
      defaultValue: 0, // Percent
      aoeFormula: 'baseDamage * (1 + areaDamageBonus/100)'
    },
    {
      id: 'cooldown_reduction',
      name: 'Cooldown Reduction',
      description: 'Reduces cooldown time of abilities',
      icon: 'spell_holy_borrowedtime',
      category: 'combat',
      defaultValue: 0, // Percent
      formula: 'baseCooldown * (1 - cooldownReduction/100)',
      maxValue: 75
    },
    {
      id: 'duration_modifier',
      name: 'Effect Duration Modifier',
      description: 'Changes duration of effects you apply',
      icon: 'spell_holy_innerfire',
      category: 'combat',
      defaultValue: 100, // Percent
      formula: 'baseDuration * (durationModifier/100)'
    }
  ];
  
  /**
   * Stat types organized into categories for better UI organization
   */
  const STAT_TYPES = {
    primary: {
      name: 'Primary Attributes',
      description: 'Core character attributes',
      stats: PRIMARY_STAT_MODIFIERS
    },
    secondary: {
      name: 'Secondary Attributes',
      description: 'Derived character attributes',
      stats: SECONDARY_STAT_MODIFIERS
    },
    combat: {
      name: 'Combat Statistics',
      description: 'Combat-specific attributes',
      stats: COMBAT_STAT_MODIFIERS
    }
  };
  
  // =====================================================================
  // STATUS EFFECTS SYSTEM
  // =====================================================================
  
  /**
   * Positive status effects that can be applied by buffs
   */
  const POSITIVE_STATUS_EFFECTS = [
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
        { id: 'protection', name: 'Protection', description: 'Gain AC bonus and resistance to certain damage types' },
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
      description: 'Gain bonus action points and improved energy recovery',
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
  const COMBAT_ADVANTAGES = [
    // Buff advantages
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
        affectsSpell: true
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
        { id: 'bonus', name: 'Extra Bonus Action', description: 'Gain an additional bonus action' },
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
  const NEGATIVE_STATUS_EFFECTS = [
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
      saveType: 'wisdom'
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
      icon: 'spell_nature_corrosivebreath',
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
      id: 'stunned',
      name: 'Stunned',
      description: 'Incapacitated, cannot move, auto-fails STR and AGI saves',
      icon: 'spell_frost_stun',
      category: 'physical',
      actionPointCost: 3,
      options: [
        { id: 'dazed', name: 'Dazed', description: 'Disadvantage on attacks and ability checks' },
        { id: 'unconscious', name: 'Unconscious', description: 'Falls prone, unable to act, attacks have advantage' },
        { id: 'electric', name: 'Electric Stun', description: 'Muscles spasm, may conduct to nearby creatures' }
      ],
      defaultParameters: {
        stunDuration: 1, // rounds
        noReactions: true,
        disadvantage: true,
        dropItems: true,
        criticalHits: true,
        wakesWhenDamaged: false,
        conductivity: false,
        electricDamage: 0
      },
      counters: ['actions', 'reactions'],
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
    {
      id: 'slowed',
      name: 'Slowed',
      description: 'Movement speed and action points reduced',
      icon: 'spell_frost_frostshock',
      category: 'physical',
      actionPointCost: 2,
      options: [
        { id: 'hindered', name: 'Hindered Movement', description: 'Movement speed reduced by half' },
        { id: 'lethargic', name: 'Lethargy', description: 'Action points reduced each round' },
        { id: 'temporal', name: 'Temporal Slowness', description: 'Actions take longer to perform' }
      ],
      defaultParameters: {
        slowDuration: 3, // rounds
        speedReduction: 50, // percent
        actionPointReduction: 1,
        attackPenalty: -2
      },
      counters: ['mobility', 'action economy'],
      saveType: 'dexterity'
    },
    {
      id: 'burning',
      name: 'Burning',
      description: 'Taking continuous fire damage and may spread to nearby flammable objects',
      icon: 'spell_fire_soulburn',
      category: 'elemental',
      actionPointCost: 2,
      options: [
        { id: 'mild', name: 'Mild Burn', description: 'Low damage over time' },
        { id: 'intense', name: 'Intense Burn', description: 'Moderate damage with additional effects' },
        { id: 'magical', name: 'Magical Fire', description: 'Cannot be extinguished by normal means' }
      ],
      defaultParameters: {
        burnDuration: 3, // rounds
        burnDamage: '1d6',
        spreadChance: 20, // percent
        extinguishDC: 15
      },
      counters: ['concentration', 'hiding'],
      saveType: 'dexterity'
    },
    {
      id: 'frozen',
      name: 'Frozen',
      description: 'Movement slowed or stopped and taking cold damage',
      icon: 'spell_frost_glacier',
      category: 'elemental',
      actionPointCost: 3,
      options: [
        { id: 'chilled', name: 'Chilled', description: 'Slowed movement and reduced dexterity' },
        { id: 'frostbitten', name: 'Frostbitten', description: 'Painful cold damage with lasting effects' },
        { id: 'frozen', name: 'Frozen Solid', description: 'Completely immobilized in ice' }
      ],
      defaultParameters: {
        freezeDuration: 2, // rounds
        freezeDamage: '1d6',
        movementReduction: 50, // percent
        actionPointCost: 1 // extra cost to break free
      },
      counters: ['mobility', 'dexterity'],
      saveType: 'constitution'
    }
  ];
  
  /**
   * Combat disadvantages for the debuff system
   */
  const COMBAT_DISADVANTAGES = [
    // Debuff disadvantages
    {
      id: 'disadvantage_attack',
      name: 'Disadvantage on Attacks',
      description: 'Roll twice and take the lower result on attack rolls',
      icon: 'ability_warrior_battlestance',
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
        saveType: 'dexterity',
        duration: 3 // rounds
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
      defaultParameters: {
        specificSave: 'strength',
        duration: 3 // rounds
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
      description: 'Armor Class (AC) is reduced',
      icon: 'spell_shadow_curseofachimonde',
      category: 'debuff',
      actionPointCost: 2,
      options: [
        { id: 'minor', name: 'Minor Reduction', description: 'AC reduced by a small amount' },
        { id: 'major', name: 'Major Reduction', description: 'AC reduced significantly' },
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
  
  // =====================================================================
  // SPELL MODIFIERS SYSTEM
  // =====================================================================
  
  /**
   * Spell damage modifiers for different damage types
   */
  const SPELL_DAMAGE_MODIFIERS = [
    {
      id: 'fire_spell_power',
      name: 'Fire Spell Power',
      description: 'Increases damage dealt by fire spells',
      icon: 'spell_fire_immolation',
      schoolCategory: 'elemental',
      defaultBonus: 10, // percent
      effectsStatusEffect: 'burning'
    },
    {
      id: 'frost_spell_power',
      name: 'Frost Spell Power',
      description: 'Increases damage dealt by frost spells',
      icon: 'spell_frost_frostbolt02',
      schoolCategory: 'elemental',
      defaultBonus: 10, // percent
      effectsStatusEffect: 'frozen'
    },
    {
      id: 'lightning_spell_power',
      name: 'Lightning Spell Power',
      description: 'Increases damage dealt by lightning spells',
      icon: 'spell_lightning_lightningbolt01',
      schoolCategory: 'elemental',
      defaultBonus: 10, // percent
      effectsStatusEffect: 'stunned'
    },
    {
      id: 'thunder_spell_power',
      name: 'Thunder Spell Power',
      description: 'Increases damage dealt by thunder spells',
      icon: 'spell_nature_thunderclap',
      schoolCategory: 'elemental',
      defaultBonus: 10, // percent
      effectsStatusEffect: 'deafened'
    },
    {
      id: 'acid_spell_power',
      name: 'Acid Spell Power',
      description: 'Increases damage dealt by acid spells',
      icon: 'spell_nature_acid_01',
      schoolCategory: 'elemental',
      defaultBonus: 10, // percent
      effectsStatusEffect: 'corroded'
    },
    {
      id: 'force_spell_power',
      name: 'Force Spell Power',
      description: 'Increases damage dealt by force spells',
      icon: 'spell_arcane_blast',
      schoolCategory: 'arcane',
      defaultBonus: 10, // percent
      bypassesResistance: true
    },
    {
      id: 'necrotic_spell_power',
      name: 'Necrotic Spell Power',
      description: 'Increases damage dealt by necrotic spells',
      icon: 'spell_shadow_deathcoil',
      schoolCategory: 'dark',
      defaultBonus: 10, // percent
      effectsStatusEffect: 'withered'
    },
    {
      id: 'radiant_spell_power',
      name: 'Radiant Spell Power',
      description: 'Increases damage dealt by radiant spells',
      icon: 'spell_holy_holysmite',
      schoolCategory: 'holy',
      defaultBonus: 10, // percent
      effectsStatusEffect: 'dazzled'
    },
    {
      id: 'poison_spell_power',
      name: 'Poison Spell Power',
      description: 'Increases damage dealt by poison spells',
      icon: 'ability_rogue_poisonousanimosity',
      schoolCategory: 'elemental',
      defaultBonus: 10, // percent
      effectsStatusEffect: 'poisoned'
    },
    {
      id: 'psychic_spell_power',
      name: 'Psychic Spell Power',
      description: 'Increases damage dealt by psychic spells',
      icon: 'spell_shadow_mindtwisting',
      schoolCategory: 'mental',
      defaultBonus: 10, // percent
      effectsStatusEffect: 'confused'
    },
    {
      id: 'chaos_spell_power',
      name: 'Chaos Spell Power',
      description: 'Increases damage dealt by chaos spells',
      icon: 'spell_shadow_shadowwordpain',
      schoolCategory: 'otherworldly',
      defaultBonus: 15, // percent
      unstable: true,
      effectsStatusEffect: 'warped'
    },
    {
      id: 'void_spell_power',
      name: 'Void Spell Power',
      description: 'Increases damage dealt by void spells',
      icon: 'spell_shadow_shadowfury',
      schoolCategory: 'otherworldly',
      defaultBonus: 15, // percent
      bypassesResistance: true,
      effectsStatusEffect: 'voidtouched'
    },
    // Physical spell damage modifiers
    {
      id: 'bludgeoning_spell_power',
      name: 'Bludgeoning Spell Power',
      description: 'Increases damage dealt by magical bludgeoning effects',
      icon: 'inv_mace_2h_blacksmithing_01',
      schoolCategory: 'physical',
      defaultBonus: 10, // percent
      effectsStatusEffect: 'dazed'
    },
    {
      id: 'piercing_spell_power',
      name: 'Piercing Spell Power',
      description: 'Increases damage dealt by magical piercing effects',
      icon: 'inv_sword_33',
      schoolCategory: 'physical',
      defaultBonus: 10, // percent
      effectsStatusEffect: 'bleeding'
    },
    {
      id: 'slashing_spell_power',
      name: 'Slashing Spell Power',
      description: 'Increases damage dealt by magical slashing effects',
      icon: 'ability_warrior_cleave',
      schoolCategory: 'physical',
      defaultBonus: 10, // percent
      effectsStatusEffect: 'wounded'
    }
  ];
  
  /**
   * Healing effect modifiers
   */
  const HEALING_EFFECT_MODIFIERS = [
    {
      id: 'direct_healing',
      name: 'Direct Healing',
      description: 'Increases the effectiveness of direct healing spells',
      icon: 'spell_holy_flashheal',
      category: 'healing',
      defaultBonus: 15, // percent
      affects: ['heal', 'cure wounds', 'healing word']
    },
    {
      id: 'healing_over_time',
      name: 'Healing Over Time',
      description: 'Increases the effectiveness of healing over time effects',
      icon: 'spell_holy_renew',
      category: 'healing',
      defaultBonus: 20, // percent
      affects: ['regeneration', 'renewal', 'rejuvenation']
    },
    {
      id: 'critical_healing',
      name: 'Critical Healing',
      description: 'Increases critical healing chance and effectiveness',
      icon: 'spell_holy_sealofsacrifice',
      category: 'healing',
      defaultBonus: 10, // percent crit chance
      critMultiplier: 2.5 // Critical healing multiplier
    },
    {
      id: 'group_healing',
      name: 'Group Healing',
      description: 'Increases the effectiveness of area healing spells',
      icon: 'spell_holy_prayerofhealing',
      category: 'healing',
      defaultBonus: 15, // percent
      affects: ['prayer of healing', 'circle of healing', 'healing rain']
    },
    {
      id: 'emergency_healing',
      name: 'Emergency Healing',
      description: 'Increases healing on targets below 30% health',
      icon: 'spell_holy_chastise',
      category: 'healing',
      defaultBonus: 25, // percent
      activationThreshold: 30 // percent health
    },
    {
      id: 'shield_power',
      name: 'Shield Power',
      description: 'Increases the strength of absorption shields',
      icon: 'spell_holy_powerwordshield',
      category: 'healing',
      defaultBonus: 20, // percent
      affects: ['barrier', 'shield', 'absorption']
    },
    {
      id: 'healing_efficiency',
      name: 'Healing Efficiency',
      description: 'Reduces action point cost of healing spells',
      icon: 'spell_holy_divineillumination',
      category: 'healing',
      actionPointReduction: 1,
      minCost: 1 // Minimum action point cost
    },
    {
      id: 'purification',
      name: 'Purification',
      description: 'Healing spells also remove negative effects',
      icon: 'spell_holy_dispelmagic',
      category: 'healing',
      cleansePower: 1, // Number of effects cleansed
      cleanseProbability: 25 // percent chance per effect
    }
  ];
  
  /**
   * Resistance types for damage reduction
   */
  const RESISTANCE_TYPES = [
    // Physical resistances
    {
      id: 'bludgeoning_resistance',
      name: 'Bludgeoning Resistance',
      description: 'Reduces damage taken from bludgeoning attacks',
      icon: 'inv_shield_04',
      damageType: 'bludgeoning',
      category: 'physical',
      defaultReduction: 50, // percent
      sourcesAffected: ['weapon', 'natural', 'magical']
    },
    {
      id: 'piercing_resistance',
      name: 'Piercing Resistance',
      description: 'Reduces damage taken from piercing attacks',
      icon: 'ability_parry',
      damageType: 'piercing',
      category: 'physical',
      defaultReduction: 50, // percent
      sourcesAffected: ['weapon', 'natural', 'magical']
    },
    {
      id: 'slashing_resistance',
      name: 'Slashing Resistance',
      description: 'Reduces damage taken from slashing attacks',
      icon: 'ability_warrior_defensivestance',
      damageType: 'slashing',
      category: 'physical',
      defaultReduction: 50, // percent
      sourcesAffected: ['weapon', 'natural', 'magical']
    },
    
    // Elemental resistances
    {
      id: 'fire_resistance',
      name: 'Fire Resistance',
      description: 'Reduces damage taken from fire attacks',
      icon: 'spell_fire_firearmor',
      damageType: 'fire',
      category: 'elemental',
      defaultReduction: 50, // percent
      statusResistance: 'burning'
    },
    {
      id: 'cold_resistance',
      name: 'Cold Resistance',
      description: 'Reduces damage taken from cold attacks',
      icon: 'spell_frost_frostarmor02',
      damageType: 'cold',
      category: 'elemental',
      defaultReduction: 50, // percent
      statusResistance: 'frozen'
    },
    {
      id: 'lightning_resistance',
      name: 'Lightning Resistance',
      description: 'Reduces damage taken from lightning attacks',
      icon: 'spell_nature_resistnature',
      damageType: 'lightning',
      category: 'elemental',
      defaultReduction: 50, // percent
      statusResistance: 'stunned'
    },
    {
      id: 'thunder_resistance',
      name: 'Thunder Resistance',
      description: 'Reduces damage taken from thunder attacks',
      icon: 'spell_nature_earthbind',
      damageType: 'thunder',
      category: 'elemental',
      defaultReduction: 50, // percent
      statusResistance: 'deafened'
    },
    {
      id: 'acid_resistance',
      name: 'Acid Resistance',
      description: 'Reduces damage taken from acid attacks',
      icon: 'spell_nature_acid_01',
      damageType: 'acid',
      category: 'elemental',
      defaultReduction: 50, // percent
      statusResistance: 'corroded'
    },
    
    // Magical resistances
    {
      id: 'force_resistance',
      name: 'Force Resistance',
      description: 'Reduces damage taken from force attacks',
      icon: 'spell_arcane_prismaticcloak',
      damageType: 'force',
      category: 'magical',
      defaultReduction: 50, // percent
      rare: true
    },
    {
      id: 'necrotic_resistance',
      name: 'Necrotic Resistance',
      description: 'Reduces damage taken from necrotic attacks',
      icon: 'spell_shadow_deadofnight',
      damageType: 'necrotic',
      category: 'magical',
      defaultReduction: 50, // percent
      statusResistance: 'withered'
    },
    {
      id: 'radiant_resistance',
      name: 'Radiant Resistance',
      description: 'Reduces damage taken from radiant attacks',
      icon: 'spell_holy_powerwordshield',
      damageType: 'radiant',
      category: 'magical',
      defaultReduction: 50, // percent
      statusResistance: 'dazzled'
    },
    {
      id: 'poison_resistance',
      name: 'Poison Resistance',
      description: 'Reduces damage taken from poison attacks',
      icon: 'ability_creature_poison_06',
      damageType: 'poison',
      category: 'magical',
      defaultReduction: 50, // percent
      statusResistance: 'poisoned'
    },
    {
      id: 'psychic_resistance',
      name: 'Psychic Resistance',
      description: 'Reduces damage taken from psychic attacks',
      icon: 'spell_shadow_mindrot',
      damageType: 'psychic',
      category: 'magical',
      defaultReduction: 50, // percent
      statusResistance: 'confused'
    },
    {
      id: 'chaos_resistance',
      name: 'Chaos Resistance',
      description: 'Reduces damage taken from chaotic magical forces',
      icon: 'spell_shadow_shadowwordpain',
      damageType: 'chaos',
      category: 'magical',
      defaultReduction: 50, // percent
      statusResistance: 'warped',
      rare: true
    },
    {
      id: 'void_resistance',
      name: 'Void Resistance',
      description: 'Reduces damage taken from void energy',
      icon: 'spell_shadow_shadowfury',
      damageType: 'void',
      category: 'magical',
      defaultReduction: 50, // percent
      statusResistance: 'voidtouched',
      rare: true
    }
  ];
  
  /**
   * Critical effect modifiers that can be applied on critical hits
   */
  const CRITICAL_EFFECT_MODIFIERS = [
    {
      id: 'knockdown',
      name: 'Knockdown',
      description: 'Critical hits can knock the target prone',
      icon: 'ability_warrior_throwdown',
      category: 'physical',
      defaultChance: 25, // percent
      saveDC: 15,
      saveType: 'strength'
    },
    {
      id: 'stun',
      name: 'Stunning Strike',
      description: 'Critical hits have a chance to stun the target',
      icon: 'spell_frost_stun',
      category: 'physical',
      defaultChance: 20, // percent
      duration: 1, // rounds
      saveDC: 15,
      saveType: 'constitution'
    },
    {
      id: 'bleed',
      name: 'Bleeding Wound',
      description: 'Critical hits cause additional bleeding damage over time',
      icon: 'ability_rogue_bloodsplatter',
      category: 'physical',
      defaultChance: 35, // percent
      dotDamage: '1d6',
      dotDuration: 3, // rounds
      saveType: 'constitution'
    },
    {
      id: 'vulnerability',
      name: 'Expose Weakness',
      description: 'Critical hits create a weakness that increases subsequent damage',
      icon: 'ability_warrior_sunder',
      category: 'tactical',
      defaultChance: 30, // percent
      vulnerabilityAmount: 20, // percent increased damage
      duration: 2, // rounds
      stackable: true,
      maxStacks: 3
    },
    {
      id: 'armorBreak',
      name: 'Armor Break',
      description: 'Critical hits temporarily reduce target\'s armor',
      icon: 'ability_warrior_shieldbreak',
      category: 'tactical',
      defaultChance: 25, // percent
      armorReduction: 4, // AC points
      duration: 2, // rounds
      saveType: 'constitution'
    },
    {
      id: 'elementalBurst',
      name: 'Elemental Burst',
      description: 'Critical hits trigger an additional elemental damage burst',
      icon: 'spell_fire_selfdestruct',
      category: 'elemental',
      defaultChance: 100, // percent (always triggers)
      burstDamage: '2d6',
      elementalType: 'fire', // can be any elemental damage type
      areaEffect: true,
      areaRadius: 10 // feet
    },
    {
      id: 'slowingStrike',
      name: 'Slowing Strike',
      description: 'Critical hits slow the target\'s movement and actions',
      icon: 'spell_frost_frostbolt',
      category: 'tactical',
      defaultChance: 30, // percent
      speedReduction: 50, // percent
      apReduction: 1,
      duration: 2, // rounds
      saveType: 'constitution'
    },
    {
      id: 'disarm',
      name: 'Disarm',
      description: 'Critical hits can disarm the target, making them drop their weapon',
      icon: 'ability_warrior_disarm',
      category: 'tactical',
      defaultChance: 20, // percent
      saveDC: 15,
      saveType: 'strength',
      restrictions: 'Only works on weapon-wielding targets'
    },
    {
      id: 'healingStrike',
      name: 'Healing Strike',
      description: 'Critical hits restore some of your health',
      icon: 'spell_holy_flashheal',
      category: 'healing',
      defaultChance: 100, // percent (always triggers)
      healingAmount: '2d6',
      healingFormula: '25% of damage dealt'
    },
    {
      id: 'fearStrike',
      name: 'Fearsome Strike',
      description: 'Critical hits can cause the target to become frightened',
      icon: 'spell_shadow_possession',
      category: 'mental',
      defaultChance: 25, // percent
      duration: 2, // rounds
      saveDC: 15,
      saveType: 'wisdom'
    },
    {
      id: 'actionPointRecovery',
      name: 'Energizing Critical',
      description: 'Critical hits restore action points',
      icon: 'spell_nature_timestop',
      category: 'tactical',
      defaultChance: 100, // percent (always triggers)
      apRestored: 1
    },
    {
      id: 'doubleStrike',
      name: 'Double Strike',
      description: 'Critical hits trigger an immediate extra attack',
      icon: 'ability_warrior_decisivestrike',
      category: 'physical',
      defaultChance: 25, // percent
      extraAttackDamage: '75% of normal'
    }
  ];
  
  // =====================================================================
  // UTILITY SYSTEM
  // =====================================================================
  
  /**
   * Utility effect types for non-combat spell effects
   */
  const UTILITY_EFFECT_TYPES = [
    {
      id: 'movement',
      name: 'Movement',
      description: 'Affects movement capabilities of targets or the caster',
      icon: 'ability_rogue_sprint',
      actionPointCost: 2,
      subtypes: [
        {
          id: 'teleport',
          name: 'Teleport',
          description: 'Instantly move to a new location without traversing the intervening space',
          icon: 'spell_arcane_blink',
          parameters: ['distance', 'needsLineOfSight', 'takesOthers', 'otherTargets']
        },
        {
          id: 'flight',
          name: 'Flight',
          description: 'Grant the ability to fly through the air, ignoring ground-based obstacles',
          icon: 'ability_mount_flyingcarpet',
          parameters: ['flightSpeed', 'maxAltitude', 'flightType']
        },
        {
          id: 'speed',
          name: 'Speed Boost',
          description: 'Dramatically increase movement speed for rapid traversal',
          icon: 'ability_rogue_sprint',
          parameters: ['speedMultiplier', 'duration', 'affectsActionPoints']
        },
        {
          id: 'phasing',
          name: 'Phasing',
          description: 'Shift partially out of reality, allowing passage through solid objects',
          icon: 'spell_arcane_portalironforge',
          parameters: ['phasingDuration', 'canAttack', 'visibility']
        },
        {
          id: 'wallWalking',
          name: 'Wall Walking',
          description: 'Walk on vertical surfaces and ceilings',
          icon: 'ability_rogue_quickrecovery',
          parameters: ['duration', 'climbSpeed', 'canHang']
        }
      ]
    },
    {
      id: 'control',
      name: 'Control',
      description: 'Manipulates the battlefield by restricting or directing movement',
      icon: 'spell_frost_chainsofice',
      actionPointCost: 3,
      subtypes: [
        {
          id: 'pull',
          name: 'Pull',
          description: 'Force targets to move toward a specific location using magical force',
          icon: 'ability_druid_typhoon',
          parameters: ['pullDistance', 'allowSave', 'saveType', 'pullDealsDamage', 'pullDamage']
        },
        {
          id: 'push',
          name: 'Push',
          description: 'Forcefully move targets away from a central point or line',
          icon: 'ability_warrior_charge',
          parameters: ['pushDistance', 'allowSave', 'saveType', 'pushDealsDamage', 'pushDamage']
        },
        {
          id: 'barrier',
          name: 'Barrier',
          description: 'Create an impassable wall or dome that blocks movement and possibly attacks',
          icon: 'spell_holy_powerwordbarrier',
          parameters: ['barrierType', 'barrierSize', 'barrierMaterial', 'barrierHP', 'barrierDealsDamage', 'barrierDamage']
        },
        {
          id: 'gravity',
          name: 'Gravity Manipulation',
          description: 'Alter local gravity to impede movement or cause levitation',
          icon: 'spell_arcane_blast',
          parameters: ['gravityMultiplier', 'affectedArea', 'duration', 'damageOnFall']
        }
      ]
    },
    {
      id: 'environment',
      name: 'Environment',
      description: 'Alters the physical environment for tactical advantage',
      icon: 'spell_nature_earthquake',
      actionPointCost: 2,
      subtypes: [
        {
          id: 'terrain',
          name: 'Terrain Modification',
          description: 'Change the physical landscape by creating difficult terrain, pits, or elevated platforms',
          icon: 'spell_nature_earthquake',
          parameters: ['terrainType', 'areaShape', 'areaSize', 'heightDepth', 'duration']
        },
        {
          id: 'hazard',
          name: 'Hazard Creation',
          description: 'Create environmental hazards like fire, ice, acid pools, or electrical fields',
          icon: 'spell_fire_soulburn',
          parameters: ['hazardType', 'areaShape', 'areaSize', 'hazardDamage', 'hazardPersistent', 'hazardDuration']
        },
        {
          id: 'light',
          name: 'Light/Darkness',
          description: 'Manipulate ambient lighting to create illumination or magical darkness',
          icon: 'spell_holy_mindsooth',
          parameters: ['lightType', 'intensity', 'radius', 'duration', 'moves']
        },
        {
          id: 'weather',
          name: 'Weather Manipulation',
          description: 'Create localized weather effects like fog, rain, wind, or supernatural storms',
          icon: 'spell_frost_icestorm',
          parameters: ['weatherType', 'intensity', 'radius', 'duration', 'damaging']
        }
      ]
    },
    {
      id: 'illusion',
      name: 'Illusion',
      description: 'Creates deceptive sensory effects to mislead or distract',
      icon: 'spell_shadow_psychicscream',
      actionPointCost: 2,
      subtypes: [
        {
          id: 'visual',
          name: 'Visual Illusion',
          description: 'Create false visual images that can range from simple objects to complex scenes',
          icon: 'spell_shadow_mindtwisting',
          parameters: ['illusionType', 'complexity', 'size', 'movement', 'interactivity']
        },
        {
          id: 'sound',
          name: 'Sound Illusion',
          description: 'Generate illusory sounds from whispers to thunderous explosions',
          icon: 'spell_holy_excorcism',
          parameters: ['soundType', 'volume', 'complexity', 'duration', 'direction']
        },
        {
            id: 'complex',
            name: 'Complex Illusion',
            description: 'Create fully interactive illusions that affect multiple senses simultaneously',
            icon: 'spell_shadow_demoniccircleteleport',
            parameters: ['illusionComplexity', 'sensesCovered', 'interactive', 'believability', 'duration']
          },
          {
            id: 'disguise',
            name: 'Disguise/Mimicry',
            description: 'Alter appearance to mimic another creature or object convincingly',
            icon: 'ability_rogue_disguise',
            parameters: ['disguiseType', 'quality', 'duration', 'detectDC', 'voiceChange']
          }
        ]
      },
      {
        id: 'transformation',
        name: 'Transformation',
        description: 'Changes physical form or properties of targets',
        icon: 'spell_nature_elementalshields',
        actionPointCost: 3,
        subtypes: [
          {
            id: 'animal',
            name: 'Animal Form',
            description: 'Transform target into an animal with corresponding abilities and limitations',
            icon: 'ability_druid_catform',
            parameters: ['animalType', 'size', 'abilities', 'mentalCapacity', 'duration']
          },
          {
            id: 'element',
            name: 'Elemental Transformation',
            description: 'Convert physical form partially or wholly into elemental material like fire, stone, or water',
            icon: 'spell_fire_elemental_totem',
            parameters: ['elementType', 'transformPercent', 'elementalAbilities', 'vulnerabilities', 'duration']
          },
          {
            id: 'size',
            name: 'Size Alteration',
            description: 'Dramatically increase or decrease the size of the target',
            icon: 'spell_nature_wispsplode',
            parameters: ['sizeMultiplier', 'statChanges', 'massChange', 'duration', 'maxSize']
          },
          {
            id: 'object',
            name: 'Object Transformation',
            description: 'Transform target into an inanimate object temporarily',
            icon: 'inv_misc_statue_07',
            parameters: ['objectType', 'size', 'awareness', 'vulnerability', 'duration']
          },
          {
            id: 'phaseshift',
            name: 'Phase Shift',
            description: 'Shift target partially into another plane of existence',
            icon: 'spell_arcane_portalshattrath',
            parameters: ['phaseType', 'corporeality', 'visibility', 'interactivity', 'duration']
          }
        ]
      },
      {
        id: 'divination',
        name: 'Divination',
        description: 'Reveals hidden information or predicts future events',
        icon: 'spell_holy_mindvision',
        actionPointCost: 2,
        subtypes: [
          {
            id: 'detection',
            name: 'Detection',
            description: 'Sense the presence and location of specific entities, objects, or magical effects',
            icon: 'spell_holy_mindvision',
            parameters: ['detectionType', 'range', 'detail', 'duration', 'throughObstacles']
          },
          {
            id: 'scrying',
            name: 'Scrying',
            description: 'View distant locations or subjects remotely',
            icon: 'spell_shadow_demoniccirclesummon',
            parameters: ['scryRange', 'accuracy', 'sensorType', 'detection', 'duration']
          },
          {
            id: 'identification',
            name: 'Identification',
            description: 'Determine properties, history, or nature of objects, creatures, or magical effects',
            icon: 'spell_holy_dispelmagic',
            parameters: ['idComplexity', 'revealCurses', 'revealHistory', 'accuracy', 'detailLevel']
          },
          {
            id: 'prediction',
            name: 'Prediction',
            description: 'Glimpse possible future events or outcomes',
            icon: 'spell_holy_sealofjustice',
            parameters: ['predictionRange', 'accuracy', 'detail', 'alternatives', 'predictionWindow']
          },
          {
            id: 'truesight',
            name: 'Truesight',
            description: 'See through illusions, invisibility, and into other planes',
            icon: 'spell_shadow_detectinvisibility',
            parameters: ['truesightRange', 'planarVision', 'detectMagic', 'revealDisguises', 'duration']
          }
        ]
      },
      {
        id: 'conjuration',
        name: 'Conjuration',
        description: 'Summons creatures, objects, or materials from elsewhere',
        icon: 'spell_shadow_summoninfernal',
        actionPointCost: 4,
        subtypes: [
          {
            id: 'creature',
            name: 'Creature Summoning',
            description: 'Summon creatures to aid you in battle or perform tasks',
            icon: 'spell_shadow_summonvoidwalker',
            parameters: ['creatureType', 'creatureLevel', 'controlType', 'duration', 'number']
          },
          {
            id: 'object',
            name: 'Object Conjuration',
            description: 'Create non-magical items temporarily or permanently',
            icon: 'inv_misc_enggizmos_19',
            parameters: ['objectType', 'objectSize', 'complexity', 'permanence', 'quality']
          },
          {
            id: 'element',
            name: 'Elemental Conjuration',
            description: 'Create raw elemental materials like fire, water, or stone',
            icon: 'spell_fire_volcano',
            parameters: ['elementType', 'quantity', 'duration', 'intensity', 'control']
          },
          {
            id: 'portal',
            name: 'Portal Creation',
            description: 'Create gateways between locations or planes',
            icon: 'spell_arcane_portaldalaran',
            parameters: ['portalRange', 'destination', 'size', 'stability', 'duration']
          }
        ]
      },
      {
        id: 'enchantment',
        name: 'Enchantment',
        description: 'Imbues objects or creatures with magical properties',
        icon: 'spell_holy_greaterblessingofkings',
        actionPointCost: 3,
        subtypes: [
          {
            id: 'weapon',
            name: 'Weapon Enchantment',
            description: 'Grant magical properties to weapons',
            icon: 'inv_sword_04',
            parameters: ['enchantmentType', 'power', 'duration', 'charges', 'specialEffect']
          },
          {
            id: 'armor',
            name: 'Armor Enchantment',
            description: 'Grant magical properties to armor or clothing',
            icon: 'inv_chest_plate_raidpaladin_i_01',
            parameters: ['enchantmentType', 'power', 'duration', 'charges', 'specialEffect']
          },
          {
            id: 'item',
            name: 'Item Enchantment',
            description: 'Grant magical properties to ordinary items',
            icon: 'inv_jewelcrafting_gem_14',
            parameters: ['enchantmentType', 'power', 'duration', 'charges', 'specialEffect']
          },
          {
            id: 'sentience',
            name: 'Sentience Granting',
            description: 'Grant temporary awareness and intelligence to inanimate objects',
            icon: 'inv_misc_book_17',
            parameters: ['intelligence', 'personality', 'abilities', 'loyalty', 'duration']
          }
        ]
      }
    ];
    
    /**
     * Special utility parameters that define behavior of utility effects
     */
    const UTILITY_PARAMETERS = {
      // Teleportation parameters
      teleport: {
        distance: { min: 5, max: 500, default: 30, unit: 'feet' },
        needsLineOfSight: { type: 'boolean', default: true, actionPointModifier: -1 },
        takesOthers: { type: 'boolean', default: false, actionPointModifier: 1 },
        otherTargets: { min: 1, max: 10, default: 1 }
      },
      
      // Flight parameters
      flight: {
        flightSpeed: { min: 5, max: 120, default: 30, unit: 'feet' },
        maxAltitude: { min: 5, max: 1000, default: 100, unit: 'feet' },
        flightType: { 
          options: ['winged', 'levitation', 'rocket', 'magical'],
          default: 'winged'
        }
      },
      
      // Barrier parameters
      barrier: {
        barrierType: { 
          options: ['wall', 'dome', 'cube', 'sphere'], 
          default: 'wall' 
        },
        barrierSize: { min: 5, max: 60, default: 15, unit: 'feet' },
        barrierMaterial: { 
          options: ['force', 'fire', 'ice', 'earth', 'water', 'necrotic'], 
          default: 'force' 
        },
        barrierHP: { min: 5, max: 200, default: 30 },
        barrierDealsDamage: { type: 'boolean', default: false, actionPointModifier: 1 },
        barrierDamage: { type: 'dice', default: '1d6' }
      },
      
      // Illusion parameters
      illusion: {
        illusionType: { 
          options: ['creature', 'object', 'scene', 'effect'], 
          default: 'object' 
        },
        complexity: { min: 1, max: 10, default: 5 },
        size: { min: 1, max: 60, default: 5, unit: 'feet' },
        movement: { type: 'boolean', default: false, actionPointModifier: 1 },
        interactivity: { min: 0, max: 10, default: 0, actionPointModifier: 0.5 },
        sensesCovered: { 
          options: ['sight', 'sound', 'smell', 'touch', 'taste', 'all'], 
          default: 'sight',
          multiple: true
        },
        believability: { min: 1, max: 20, default: 10 }
      }
    };
    
    // =====================================================================
    // HEALING AND SHIELDING SYSTEM
    // =====================================================================
    
    /**
     * Absorption shield types for protective buffs
     */
    const ABSORPTION_SHIELD_TYPES = [
      {
        id: 'standard',
        name: 'Standard Shield',
        description: 'Basic protective barrier that absorbs all damage types equally',
        icon: 'spell_holy_powerwordshield',
        durability: 'average',
        regenDelay: 3, // rounds before regeneration starts
        regenRate: 0, // percent of total per round
        actionPointCost: 2
      },
      {
        id: 'fortified',
        name: 'Fortified Shield',
        description: 'Stronger shield with higher capacity but no regeneration',
        icon: 'spell_holy_avengersshield',
        durability: 'high',
        multiplier: 1.5, // shield amount multiplier
        regenDelay: 0, // no regeneration
        regenRate: 0,
        actionPointCost: 3
      },
      {
        id: 'regenerating',
        name: 'Regenerating Shield',
        description: 'Shield that regenerates over time while not taking damage',
        icon: 'spell_nature_skinofearth',
        durability: 'average',
        regenDelay: 1, // rounds before regeneration starts
        regenRate: 20, // percent of total per round
        actionPointCost: 3
      },
      {
        id: 'reactive',
        name: 'Reactive Shield',
        description: 'Shield that provides damage reduction and can trigger effects when hit',
        icon: 'spell_holy_powerwordbarrier',
        durability: 'low',
        multiplier: 0.75, // shield amount multiplier
        damageReduction: 25, // percent damage reduction
        reflectChance: 20, // percent chance to reflect damage
        reflectAmount: 30, // percent of damage reflected
        actionPointCost: 3
      },
      {
        id: 'elemental',
        name: 'Elemental Shield',
        description: 'Shield specialized against specific damage types',
        icon: 'spell_fire_firearmor',
        durability: 'average',
        damageTypes: ['fire', 'cold', 'lightning', 'acid', 'thunder'],
        specializationMultiplier: 2.0, // multiplier for specialized damage type
        otherTypesMultiplier: 0.5, // multiplier for other damage types
        actionPointCost: 2
      },
      {
        id: 'layered',
        name: 'Layered Shield',
        description: 'Multiple shield layers that absorb damage sequentially',
        icon: 'spell_holy_sealofsacrifice',
        durability: 'high',
        layers: 3, // number of shield layers
        layerDistribution: 'equal', // how total shield amount is distributed
        layerRegenDelay: 2, // rounds before a depleted layer starts regenerating
        layerRegenRate: 25, // percent of layer capacity per round
        actionPointCost: 4
      },
      {
        id: 'absorbing',
        name: 'Absorbing Shield',
        description: 'Shield that converts portion of damage absorbed into healing',
        icon: 'spell_shadow_lifedrain',
        durability: 'below average',
        multiplier: 0.8, // shield amount multiplier
        absorptionRate: 25, // percent of damage converted to healing
        actionPointCost: 3
      },
      {
        id: 'overloading',
        name: 'Overloading Shield',
        description: 'Shield that explodes when depleted, damaging nearby enemies',
        icon: 'spell_fire_selfdestruct',
        durability: 'average',
        explosionDamage: 'remainingCapacity', // damage depends on remaining capacity
        explosionRadius: 15, // feet
        explosionDamageType: 'force',
        actionPointCost: 3
      }
    ];
    
    /**
     * Reflection damage types for shield systems
     */
    const REFLECTION_DAMAGE_TYPES = [
      {
        id: 'same',
        name: 'Mirror Reflection',
        description: 'Reflects the same damage type that was received',
        icon: 'spell_arcane_prismaticcloak',
        reflectionMultiplier: 1.0,
        actionPointCost: 2
      },
      {
        id: 'converted',
        name: 'Elemental Conversion',
        description: 'Converts incoming damage to a different damage type',
        icon: 'spell_fire_fireball02',
        reflectionMultiplier: 0.8,
        needsDamageType: true,
        actionPointCost: 2
      },
      {
        id: 'pure',
        name: 'Pure Force',
        description: 'Reflects damage as pure force energy that ignores resistances',
        icon: 'spell_arcane_blast',
        reflectionMultiplier: 0.6,
        bypassesResistance: true,
        actionPointCost: 3
      },
      {
        id: 'amplified',
        name: 'Amplified Reflection',
        description: 'Reflects a greater amount of damage than was received',
        icon: 'spell_shadow_unholyfrenzy',
        reflectionMultiplier: 1.5,
        actionPointCost: 4
      },
      {
        id: 'curse',
        name: 'Reflective Curse',
        description: 'Reflects damage and applies a debuff to the attacker',
        icon: 'spell_shadow_antishadow',
        reflectionMultiplier: 0.5,
        inflictsStatus: true,
        statusEffectId: 'weakened',
        statusDuration: 2, // rounds
        actionPointCost: 3
      }
    ];
    
    /**
     * Enhanced healing effect types
     */
    const ENHANCED_HEALING_TYPES = [
      {
        id: 'direct',
        name: 'Direct Healing',
        description: 'Immediate healing effect that restores hit points',
        icon: 'spell_holy_flashheal',
        actionPointCost: 2,
        targetTypes: ['single', 'multi', 'area'],
        effectParameters: ['healingAmount', 'criticalChance', 'potencyMultiplier']
      },
      {
        id: 'regeneration',
        name: 'Regeneration',
        description: 'Healing over time effect that restores hit points gradually',
        icon: 'spell_nature_rejuvenation',
        actionPointCost: 2,
        targetTypes: ['single', 'multi'],
        effectParameters: ['healingPerTick', 'duration', 'tickFrequency', 'scalingFactor']
      },
      {
        id: 'vampiric',
        name: 'Vampiric Healing',
        description: 'Drains health from target and heals the caster',
        icon: 'spell_shadow_lifedrain',
        actionPointCost: 3,
        targetTypes: ['single'],
        effectParameters: ['drainAmount', 'conversionRate', 'damageType', 'transfers']
      },
      {
        id: 'conditional',
        name: 'Conditional Healing',
        description: 'More effective healing under specific conditions',
        icon: 'spell_holy_holynova',
        actionPointCost: 2,
        targetTypes: ['single', 'multi', 'area'],
        effectParameters: ['baseHealing', 'bonusCondition', 'bonusMultiplier', 'statusEffect']
      },
      {
        id: 'resurrection',
        name: 'Resurrection',
        description: 'Brings fallen allies back to life',
        icon: 'spell_holy_resurrection',
        actionPointCost: 5,
        targetTypes: ['single'],
        effectParameters: ['healthPercent', 'penalties', 'materialComponents', 'timeLimit']
      },
      {
        id: 'spirit',
        name: 'Spirit Healing',
        description: 'Channeled healing that draws from spiritual energy',
        icon: 'spell_holy_guardianspirit',
        actionPointCost: 3,
        targetTypes: ['single', 'area'],
        effectParameters: ['channelDuration', 'healingPerSecond', 'spiritCost', 'auraSize']
      }
    ];
    
    /**
     * Chain effect configuration options
     */
    const CHAIN_EFFECT_CONFIGS = {
      healingChain: {
        targetingMethods: [
          {
            id: 'nearest',
            name: 'Nearest',
            description: 'Chains to the nearest valid target'
          },
          {
            id: 'nearest_injured',
            name: 'Nearest Injured',
            description: 'Chains to the nearest injured ally'
          },
          {
            id: 'lowest_health',
            name: 'Lowest Health',
            description: 'Chains to the ally with the lowest health percentage'
          },
          {
            id: 'most_injured',
            name: 'Most Injured',
            description: 'Chains to the ally missing the most hit points'
          },
          {
            id: 'random',
            name: 'Random',
            description: 'Chains to a random valid target'
          }
        ],
        falloffMethods: [
          {
            id: 'percentage',
            name: 'Percentage',
            description: 'Each jump reduces healing by a percentage'
          },
          {
            id: 'fixed',
            name: 'Fixed Reduction',
            description: 'Each jump reduces healing by a fixed amount'
          },
          {
            id: 'dice',
            name: 'Reduced Dice',
            description: 'Each jump reduces the number of healing dice'
          }
        ]
      },
      damageChain: {
        targetingMethods: [
          {
            id: 'nearest',
            name: 'Nearest',
            description: 'Chains to the nearest valid target'
          },
          {
            id: 'highest_health',
            name: 'Highest Health',
            description: 'Chains to the enemy with the highest health percentage'
          },
          {
            id: 'lowest_health',
            name: 'Lowest Health',
            description: 'Chains to the enemy with the lowest health percentage'
          },
          {
            id: 'random',
            name: 'Random',
            description: 'Chains to a random valid target'
          },
          {
            id: 'threat',
            name: 'Highest Threat',
            description: 'Chains to the enemy with the highest threat level'
          }
        ],
        falloffMethods: [
          {
            id: 'percentage',
            name: 'Percentage',
            description: 'Each jump reduces damage by a percentage'
          },
          {
            id: 'fixed',
            name: 'Fixed Reduction',
            description: 'Each jump reduces damage by a fixed amount'
          },
          {
            id: 'dice',
            name: 'Reduced Dice',
            description: 'Each jump reduces the number of damage dice'
          }
        ]
      }
    };
    
    // =====================================================================
    // UTILITY FUNCTIONS
    // =====================================================================
    

    const getWowIconPath = (iconName) => {
      return `https://wow.zamimg.com/images/wow/icons/medium/${iconName}.jpg`;
    };
    
    /**
     * Spell Effect Utility functions
     */
    const SpellEffectUtils = {

      getDamageTypeById: (id) => {
        return DAMAGE_TYPES.find(type => type.id === id) || null;
      },
      

      getDamageTypesByIds: (ids) => {
        if (!ids || !Array.isArray(ids)) return [];
        return ids.map(id => SpellEffectUtils.getDamageTypeById(id)).filter(Boolean);
      },
      

      getStatusEffectById: (id, positive = true) => {
        const effectsArray = positive ? POSITIVE_STATUS_EFFECTS : NEGATIVE_STATUS_EFFECTS;
        return effectsArray.find(effect => effect.id === id) || null;
      },
      

      getStatModifierById: (id) => {
        // Search through all stat types
        for (const categoryKey in STAT_TYPES) {
          const category = STAT_TYPES[categoryKey];
          const found = category.stats.find(stat => stat.id === id);
          if (found) return found;
        }
        return null;
      },
      

      getCombatAdvantageById: (id) => {
        return COMBAT_ADVANTAGES.find(adv => adv.id === id) || null;
      },
      

      getResistanceById: (id) => {
        return RESISTANCE_TYPES.find(res => res.id === id) || null;
      },
      

      getCriticalEffectById: (id) => {
        return CRITICAL_EFFECT_MODIFIERS.find(effect => effect.id === id) || null;
      },
      

      getUtilityEffectById: (mainId, subId) => {
        const mainEffect = UTILITY_EFFECT_TYPES.find(effect => effect.id === mainId);
        if (!mainEffect) return null;
        
        if (!subId) return mainEffect;
        
        const subEffect = mainEffect.subtypes.find(sub => sub.id === subId);
        return subEffect || null;
      },
      

      getAbsorptionShieldById: (id) => {
        return ABSORPTION_SHIELD_TYPES.find(shield => shield.id === id) || null;
      },
      

      getReflectionTypeById: (id) => {
        return REFLECTION_DAMAGE_TYPES.find(reflection => reflection.id === id) || null;
      },
      

      applyStatModifier: (baseValue, modifierValue, modifierType = 'flat') => {
        if (modifierType === 'percentage') {
          return baseValue * (1 + modifierValue / 100);
        }
        return baseValue + modifierValue;
      },
      

      combineModifiers: (modifiers) => {
        if (!modifiers || !modifiers.length) return { value: 0, type: 'flat' };
      
        const flatModifiers = modifiers.filter(m => m.type === 'flat');
        const percentModifiers = modifiers.filter(m => m.type === 'percentage');
      
        const totalFlat = flatModifiers.reduce((sum, m) => sum + m.value, 0);
        const totalPercent = percentModifiers.reduce((sum, m) => sum + m.value, 0);
      
        // If we have both types, convert flat to percent based on some base value
        // and return a percentage modifier
        if (flatModifiers.length && percentModifiers.length) {
          // This is a simplification; in practice you might want more sophisticated combining logic
          return {
            value: totalPercent,
            type: 'percentage',
            flatComponent: totalFlat
          };
        }
      
        if (percentModifiers.length) {
          return { value: totalPercent, type: 'percentage' };
        }
      
        return { value: totalFlat, type: 'flat' };
      },
      


      calculateActionPointCost: (effectTypes, configOptions = {}) => {
        if (!effectTypes || !effectTypes.length) return 0;
        
        // Base cost from effect types
        let baseCost = effectTypes.reduce((total, effectId) => {
          const effect = EFFECT_TYPES.find(e => e.id === effectId);
          return total + (effect ? effect.actionPointCost : 0);
        }, 0);
        
        // Modifier from targeting
        if (configOptions.targeting) {
          const targeting = TARGETING_TYPES.find(t => t.id === configOptions.targeting);
          if (targeting) {
            baseCost += targeting.actionPointModifier;
          }
        }
        
        // Modifier from duration
        if (configOptions.duration) {
          const duration = DURATION_TYPES.find(d => d.id === configOptions.duration);
          if (duration) {
            baseCost += duration.actionPointModifier;
          }
        }
        
        // Apply any action point efficiency
        if (configOptions.actionPointEfficiency) {
          baseCost = Math.max(1, Math.floor(baseCost * (1 - configOptions.actionPointEfficiency / 100)));
        }
        
        return Math.max(1, baseCost); // Minimum cost of 1
      },

      calculateSpellPowerBonus: (damageTypeId, spellPowerModifiers = {}) => {
        const spellPowerId = `${damageTypeId}_spell_power`;
        const bonus = spellPowerModifiers[spellPowerId] || 0;
        
        // Add any universal spell power bonus
        const universalBonus = spellPowerModifiers.universal_spell_power || 0;
        
        return bonus + universalBonus;
      },
      

      getEffectTypesByCategory: (category) => {
        if (!category) return EFFECT_TYPES;
        return EFFECT_TYPES.filter(effect => effect.category === category);
      },
      

      calculateResistance: (damageTypeId, targetResistances = {}, spellPenetration = 0) => {
        const resistanceId = `${damageTypeId}_resistance`;
        let resistance = targetResistances[resistanceId] || 0;
        
        // Apply spell penetration
        resistance = Math.max(0, resistance - spellPenetration);
        
        // Cap at 75% unless specifically allowing higher
        return Math.min(75, resistance);
      },
      

      formatActionPointCost: (cost) => {
        return `${cost} AP`;
      },
      

      getCounterEffects: (abilityId) => {
        // This would map abilities to status effects that counter them
        const counterMap = {
          'direct_damage': ['invisibility', 'reflect', 'dodge'],
          'area_damage': ['absorb', 'resist', 'phaseshift'],
          'healing': ['mortal_wounds', 'curse'],
          'summon': ['banish', 'dispel'],
          'movement': ['root', 'snare', 'slow'],
          'spellcasting': ['silence', 'interrupt', 'counterspell']
        };
        
        return counterMap[abilityId] || [];
      }
    };
    
    /**
     * Action Point System Utilities
     */
    const ActionPointUtils = {

      calculateBaseActionPoints: (level, intelligenceMod, classType) => {
        const classBonuses = {
          'mage': 2,
          'rogue': 1,
          'warrior': 0,
          'cleric': 1,
          'druid': 1,
          'warlock': 2,
          'paladin': 0,
          'ranger': 1,
          'monk': 2,
          'barbarian': 0
        };
        
        const classBonus = classBonuses[classType] || 0;
        const levelBonus = Math.floor(level / 4);
        
        return 5 + intelligenceMod + classBonus + levelBonus;
      },
      

      calculateActionPointRegen: (wisdom, effects = {}) => {
        let baseRegen = 3 + Math.floor((wisdom - 10) / 2);
        
        // Apply effect modifiers
        if (effects.hasOwnProperty('action_point_regen')) {
          baseRegen += effects.action_point_regen;
        }
        
        // Consider status effects
        if (effects.hasOwnProperty('status_effects')) {
          if (effects.status_effects.includes('stunned')) baseRegen = 0;
          if (effects.status_effects.includes('slowed')) baseRegen = Math.max(1, baseRegen - 1);
          if (effects.status_effects.includes('energized')) baseRegen += 1;
        }
        
        return Math.max(0, baseRegen);
      },
      

      calculateActionCost: (actionType, actionConfig = {}, characterState = {}) => {
        const baseCosts = {
          'attack': 2,
          'cast': 3,
          'move': 1,
          'item': 1,
          'defend': 1,
          'dash': 2,
          'disengage': 2,
          'help': 2,
          'hide': 2,
          'dodge': 2,
          'grapple': 2,
          'shove': 2,
          'search': 2,
          'ready': 2
        };
        
        let cost = baseCosts[actionType] || 1;
        
        // Apply modifiers from configuration
        if (actionType === 'cast' && actionConfig.spell) {
          cost = actionConfig.spell.apCost || cost;
          
          // Apply spell level modifiers
          if (actionConfig.spell.level) {
            cost += Math.max(0, actionConfig.spell.level - 1);
          }
        }
        
        // Apply character state modifiers
        if (characterState.hasOwnProperty('costModifiers')) {
          if (characterState.costModifiers.hasOwnProperty(actionType)) {
            cost += characterState.costModifiers[actionType];
          }
        }
        
        // Handle status effects
        if (characterState.hasOwnProperty('statusEffects')) {
          if (characterState.statusEffects.includes('slowed')) cost += 1;
          if (characterState.statusEffects.includes('haste')) cost = Math.max(1, cost - 1);
        }
        
        return Math.max(1, cost); // Minimum cost of 1
      },
      

      canPerformAction: (currentAP, cost) => {
        return currentAP >= cost;
      },
      

      formatActionPoints: (current, max) => {
        return `${current}/${max} AP`;
      }
    };
    
    // Export all constants and utility functions
    export {
      EFFECT_TYPES,
      DAMAGE_TYPES,
      DURATION_TYPES,
      TARGETING_TYPES,
      AOE_SHAPES,
      PRIMARY_STAT_MODIFIERS,
      SECONDARY_STAT_MODIFIERS,
      COMBAT_STAT_MODIFIERS,
      STAT_TYPES,
      COMBAT_ADVANTAGES,
      SPELL_DAMAGE_MODIFIERS,
      HEALING_EFFECT_MODIFIERS,
      RESISTANCE_TYPES,
      POSITIVE_STATUS_EFFECTS,
      NEGATIVE_STATUS_EFFECTS,
      COMBAT_DISADVANTAGES,
      CRITICAL_EFFECT_MODIFIERS,
      UTILITY_EFFECT_TYPES,
      UTILITY_PARAMETERS,
      ABSORPTION_SHIELD_TYPES,
      REFLECTION_DAMAGE_TYPES,
      ENHANCED_HEALING_TYPES,
      CHAIN_EFFECT_CONFIGS,
      getWowIconPath,
      SpellEffectUtils,
      ActionPointUtils
    };