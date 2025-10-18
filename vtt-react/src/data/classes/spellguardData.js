/**
 * Spellguard Class Data
 * 
 * Complete class information for the Spellguard - an anti-mage tank
 * who absorbs magical damage and converts it into power.
 */

export const SPELLGUARD_DATA = {
  id: 'spellguard',
  name: 'Spellguard',
  icon: 'fas fa-shield-alt',
  role: 'Tank/Anti-Mage',

  // Overview section
  overview: {
    title: 'The Spellguard',
    subtitle: 'Arcane Absorption Specialist',
    
    description: `The Spellguard is a magical tank who stands as a bulwark against enemy spellcasters. By absorbing and converting incoming magical damage into Arcane Energy Points (AEP), Spellguards transform enemy magic into their own power. They excel at disrupting enemy casters, protecting allies from magical threats, and turning the enemy's greatest strength into their greatest weakness.`,
    
    roleplayIdentity: {
      title: 'Roleplay Identity',
      content: `Spellguards are individuals who have learned to internalize and weaponize magical energy. Whether through rigorous training, natural affinity, or arcane experimentation, they possess the unique ability to absorb spells that would devastate others. They are the ultimate anti-mage specialists, feared by spellcasters and valued by allies.

**The Spellguard's Philosophy**: Magic is not inherently good or evil—it is energy, and energy can be redirected, absorbed, and repurposed. The greatest defense against magic is not resistance, but absorption and conversion.

**Common Archetypes**:
- **The Spell Eater**: A warrior who hungers for magical energy, actively seeking out enemy casters to drain
- **The Arcane Knight**: A disciplined protector trained in anti-magic combat techniques
- **The Mana Vampire**: One who feeds on magical energy, growing stronger with each spell absorbed
- **The Nullifier**: A zealot dedicated to suppressing and controlling dangerous magic
- **The Arcane Experiment**: A being transformed by magical experimentation, now able to metabolize spells
- **The Warden**: A guardian who shields others from magical threats through personal sacrifice

**Personality Traits**: Spellguards tend to be stoic, disciplined, and protective. They understand the dangers of unchecked magic and take their role as magical guardians seriously. Some are calm and methodical, while others are aggressive hunters of enemy casters. Many develop a sixth sense for detecting magical energy.

**Physical Manifestations**: A Spellguard's absorption abilities often manifest visibly—glowing runes that pulse when absorbing spells, an aura that seems to drink in magical light, or armor that shimmers with absorbed arcane energy. Their weapons and shields often bear anti-magic enchantments.`
    },
    
    combatRole: {
      title: 'Combat Role',
      content: `**Primary Role**: Magical Tank / Anti-Mage Specialist

The Spellguard excels at absorbing magical damage and disrupting enemy spellcasters. They are the ultimate counter to magic-heavy enemy compositions, growing stronger as they absorb more spells.

**Damage Mitigation**: Exceptional against magical damage through absorption mechanics. Moderate against physical damage through standard tanking.

**Threat Generation**: Generates high threat against enemy casters through spell disruption, reflection, and mana drain abilities.

**Utility**: Provides magical protection for allies, counterspell capabilities, and anti-magic zone control.

**Strengths**:
- Exceptional defense against magical damage
- Grows stronger when facing multiple casters
- Can reflect spells back at enemies
- Disrupts enemy spellcasters effectively
- Provides magical shields for allies
- Drains enemy mana through melee attacks
- Converts enemy power into personal resources

**Weaknesses**:
- Less effective against physical damage dealers
- Requires enemy spellcasters to generate AEP
- Limited AEP generation in non-magical encounters
- Resource-dependent for most powerful abilities
- Can be overwhelmed by rapid spell barrages
- Vulnerable when AEP reserves are depleted

**Team Dynamics**:
- Essential against magic-heavy enemy compositions
- Protects squishy casters from enemy spells
- Synergizes with physical damage dealers who can handle non-casters
- Benefits from healers who can sustain through absorption damage
- Works well with crowd control to manage multiple casters`
    },
    
    playstyle: {
      title: 'Playstyle & Strategy',
      content: `Playing a Spellguard is about positioning yourself to intercept enemy spells, managing your AEP reserves, and knowing when to absorb versus when to reflect.

**Core Gameplay Loop**:
1. **Position to Intercept** enemy spells targeting allies
2. **Absorb Magical Damage** to generate AEP
3. **Spend AEP** on shields, reflections, or offensive abilities
4. **Drain Mana** through melee attacks to weaken casters
5. **Protect Allies** with barriers and anti-magic zones

**AEP Management**:
- **Low AEP (0-15)**: Focus on absorption, conservative spending, basic shields
- **Medium AEP (16-40)**: Moderate spending on reflections and ally protection
- **High AEP (41-75)**: Aggressive spending, powerful barriers, offensive abilities
- **Maximum AEP (76-100)**: Ultimate abilities, mass protection, devastating counterattacks

**Positioning Strategy**:
- **Frontline Against Casters**: Stand between enemy casters and your allies
- **Spell Interception**: Position to intercept area spells before they reach allies
- **Mana Drain Range**: Stay in melee range of enemy casters to drain mana
- **Reflection Angles**: Position to reflect spells back at casters or into enemy groups

**When to Spend AEP**:
- **Emergency Shields**: Protect allies from devastating spells
- **Spell Reflection**: Turn powerful enemy spells against them
- **Offensive Bursts**: When you need to eliminate a priority caster
- **Mass Protection**: When facing multiple casters or area spells
- **Mana Denial**: Drain enemy casters to prevent future spells

**Specialization Strategies**:
- **Arcane Warden**: Maximum absorption, protect entire party, outlast enemy casters
- **Spell Breaker**: Aggressive reflection, punish enemy casters, disrupt spell rotations
- **Mana Reaver**: Offensive playstyle, drain and convert, eliminate casters quickly

**Advanced Techniques**:
- **Spell Baiting**: Intentionally draw enemy spells to build AEP
- **Reflection Timing**: Wait for high-value spells before using reflection abilities
- **AEP Banking**: Save AEP for critical moments rather than spending immediately
- **Mana Pressure**: Constantly drain enemy casters to limit their options
- **Zone Control**: Use anti-magic zones to deny areas to enemy casters`
    }
  },
  
  // Resource System
  resourceSystem: {
    title: 'Arcane Absorption',
    subtitle: 'Arcane Energy Points (AEP) System',
    
    description: `The Spellguard's power stems from their ability to absorb magical damage and convert it into Arcane Energy Points (AEP). Each point of magical damage absorbed generates AEP, which can then be spent on powerful defensive and offensive abilities. Mastering AEP management is the key to becoming an effective Spellguard.`,
    
    mechanics: {
      title: 'How It Works',
      content: `**Generating AEP**:
- **Absorb Elements (Passive)**: Automatically absorb fire, cold, lightning, or necrotic damage. Gain 2 AEP for every point of magical damage taken.
- **Energy Conversion (Passive)**: Convert physical damage into AEP. Gain 1 AEP for every 2 points of physical damage taken.
- **Mana Drain (Passive)**: When you hit with a melee attack, drain mana from the target equal to the damage dealt. Gain 1 AEP per mana drained.

**Maximum AEP**: You can hold up to 100 AEP at once. Excess AEP is lost.

**AEP Persistence**: AEP persists between combats but decays at a rate of 5 AEP per minute outside of combat.

**Spending AEP**: AEP can be spent on various abilities including shields, reflections, strikes, healing, and utility effects. Most abilities cost both mana and AEP.

**Strategic Considerations**:
- AEP generation is highest when facing multiple casters or in magical-heavy encounters
- Balance absorption (taking damage to generate AEP) with survival (using AEP for shields)
- Save AEP for critical moments rather than spending immediately
- Mana drain provides consistent AEP generation even against non-casters
- Different specializations have different AEP generation and spending patterns`
    },

    // AEP Generation Table
    aepGenerationTable: {
      title: 'AEP Generation Sources',
      headers: ['Source', 'AEP Gained', 'Trigger', 'Notes'],
      rows: [
        ['Absorb Elements', '2 per damage', 'Take magical damage', 'Fire, cold, lightning, necrotic'],
        ['Energy Conversion', '1 per 2 damage', 'Take physical damage', 'Less efficient than magical'],
        ['Mana Drain', '1 per mana', 'Melee hit', 'Drains mana equal to damage dealt'],
        ['Arcane Fortitude', '1.5x multiplier', 'Passive (Arcane Warden)', 'Spec-specific enhancement'],
        ['Reflection Bonus', '+5 AEP', 'Successful reflection', 'Spell Breaker specialization'],
        ['Critical Absorption', '+10 AEP', 'Absorb critical spell', 'Rare occurrence']
      ]
    },

    // AEP Spending Table
    aepSpendingTable: {
      title: 'AEP Abilities & Costs',
      headers: ['Ability', 'AEP Cost', 'Mana Cost', 'Effect'],
      rows: [
        ['Arcane Shield', '10', '4', 'Shield absorbs 10d6 damage for 1 minute'],
        ['Reflective Barrier', '10', '6', 'Reflect next spell back at caster'],
        ['Empowered Strike', '15', '5', 'Melee attack deals +2d6 arcane damage'],
        ['Arcane Rejuvenation', '20', '6', 'Heal 3d6 hit points'],
        ['Elemental Resistance', '10', '4', 'Resist one element for 1 minute'],
        ['Arcane Nova', '25', '8', 'Deal 6d6 arcane damage in 20-foot radius'],
        ['Barrier of Protection', '15', '6', 'Shield allies for 8d6 damage'],
        ['Spell Disruption', '15', '5', 'Counter enemy spell'],
        ['Arcane Strike', '15', '5', 'Melee attack deals +4d6 arcane damage'],
        ['Reflective Aura', '15', '6', 'Reflect 10 damage for 1 minute'],
        ['Spell Reflection', '15', '6', 'Instantly reflect spell'],
        ['Arcane Fortress', '25', '8', 'Immunity to magic for 1 turn'],
        ['Magic Nullification', '20', '6', 'Anti-magic zone for 1 minute'],
        ['Control Magic', '20', '7', 'Take control of summoned unit']
      ]
    },

    // AEP Strategic Thresholds
    aepThresholdsTable: {
      title: 'AEP Strategic Thresholds',
      headers: ['AEP Range', 'Strategy', 'Recommended Actions'],
      rows: [
        ['0-15', 'Critical Low', 'Focus on absorption, avoid spending, basic defense only'],
        ['16-40', 'Building', 'Moderate spending, use efficient abilities, build reserves'],
        ['41-75', 'Optimal', 'Aggressive spending, use powerful abilities, protect allies'],
        ['76-100', 'Maximum', 'Ultimate abilities, mass protection, devastating counterattacks']
      ]
    },

    strategicConsiderations: {
      title: 'Strategic Considerations',
      content: `**AEP Economy**:
- Prioritize high-efficiency abilities (10-15 AEP cost) for consistent value
- Save expensive abilities (20-25 AEP) for critical moments
- Balance AEP generation (taking damage) with survival (spending on shields)
- Against multiple casters, focus on absorption to rapidly build AEP
- Against single casters, use mana drain to generate steady AEP

**Specialization Synergies**:
- **Arcane Warden**: Maximize AEP generation through enhanced absorption, spend on ally protection
- **Spell Breaker**: Generate bonus AEP through reflections, spend on disruption and counterattacks
- **Mana Reaver**: Generate AEP through aggressive mana drain, spend on offensive abilities

**Combat Pacing**:
- Early Combat: Build AEP through absorption and mana drain
- Mid Combat: Spend AEP on shields and reflections as needed
- Late Combat: Use accumulated AEP for finishing moves or emergency protection

**Team Coordination**:
- Communicate AEP levels to allies so they know when you can shield them
- Position to intercept spells targeting vulnerable allies
- Use anti-magic zones to protect key areas during critical moments`
    }
  },

  // Specializations
  specializations: {
    title: 'Spellguard Specializations',
    description: 'Three distinct approaches to arcane absorption and anti-magic combat.',

    specs: [
      {
        id: 'arcane_warden',
        name: 'Arcane Warden',
        icon: 'spell_holy_powerwordshield',
        color: '#4169E1',
        theme: 'Defensive Tank',

        description: `The Arcane Warden specialization focuses on maximum magical absorption and ally protection. Arcane Wardens are the ultimate magical tanks, capable of shielding entire parties from devastating spell barrages. They excel at absorbing massive amounts of magical damage and converting it into protective barriers.`,

        playstyle: 'Defensive tank, maximum absorption, ally protection, sustained shielding',

        strengths: [
          'Highest AEP generation from absorbed damage',
          'Enhanced shield strength and duration',
          'Can protect multiple allies simultaneously',
          'Exceptional magical damage mitigation',
          'Longer-lasting protective barriers',
          'Bonus armor while shields are active'
        ],

        weaknesses: [
          'Less offensive capability than other specs',
          'Requires allies to protect to be most effective',
          'Lower damage output',
          'Dependent on enemy casters for AEP generation',
          'Less effective in solo situations'
        ],

        passiveAbility: {
          name: 'Arcane Absorption',
          description: 'All Spellguards passively absorb magical damage. Gain 2 AEP for every point of fire, cold, lightning, or necrotic damage taken. Additionally, gain 1 AEP for every 2 points of physical damage taken.',
          icon: 'spell_arcane_prismaticcloak'
        },

        specPassive: {
          name: 'Arcane Fortitude',
          description: 'Your absorption is enhanced. Gain 1.5x AEP for every point of magical damage absorbed (3 AEP per damage instead of 2). Additionally, while you have an active shield, gain +2 AC and +10% to all resistances.',
          icon: 'spell_holy_devotionaura'
        },

        keyAbilities: [
          'Enhanced Barriers - All shield abilities absorb 50% more damage and last 50% longer.',
          'Mass Protection - Barrier of Protection costs -5 AEP and affects all allies within 15 feet (instead of 10).',
          'Absorption Overflow - When your shields absorb damage, gain 1 AEP per 5 damage absorbed.'
        ]
      },

      {
        id: 'spell_breaker',
        name: 'Spell Breaker',
        icon: 'spell_holy_dispelmagic',
        color: '#9370DB',
        theme: 'Disruption Specialist',

        description: `The Spell Breaker specialization focuses on disrupting and reflecting enemy spells. Spell Breakers are aggressive anti-mage specialists who punish enemy casters by turning their own magic against them. They excel at spell reflection, counterspells, and making enemy casters regret every spell they cast.`,

        playstyle: 'Aggressive disruption, spell reflection, caster punishment, high-risk high-reward',

        strengths: [
          'Powerful spell reflection capabilities',
          'Bonus AEP from successful reflections',
          'Can reflect multiple spells in succession',
          'Disrupts enemy spell rotations',
          'Punishes enemy casters heavily',
          'Excellent against single powerful casters'
        ],

        weaknesses: [
          'Requires precise timing for reflections',
          'Less effective against non-casters',
          'Lower shield strength than Arcane Warden',
          'More vulnerable to spell barrages',
          'Requires good reaction speed'
        ],

        passiveAbility: {
          name: 'Arcane Absorption',
          description: 'All Spellguards passively absorb magical damage. Gain 2 AEP for every point of fire, cold, lightning, or necrotic damage taken. Additionally, gain 1 AEP for every 2 points of physical damage taken.',
          icon: 'spell_arcane_prismaticcloak'
        },

        specPassive: {
          name: 'Spell Reflection Mastery',
          description: 'Whenever you successfully reflect a spell, gain +5 AEP. Additionally, reflected spells deal 25% increased damage. Your Reflective Barrier and Spell Reflection abilities have their cooldowns reduced by 1 turn.',
          icon: 'spell_holy_dispelmagic'
        },

        keyAbilities: [
          'Rapid Reflection - Spell Reflection costs -5 AEP and can be used as a reaction.',
          'Reflection Chain - When you reflect a spell, your next reflection within 2 turns costs -10 AEP.',
          'Punishing Counter - Reflected spells have a 50% chance to also silence the caster for 1 turn.'
        ]
      },

      {
        id: 'mana_reaver',
        name: 'Mana Reaver',
        icon: 'spell_shadow_manafeed',
        color: '#8B008B',
        theme: 'Offensive Drain',

        description: `The Mana Reaver specialization focuses on aggressive mana drain and converting absorbed energy into devastating attacks. Mana Reavers are offensive anti-mages who drain enemy casters dry while unleashing powerful arcane strikes. They excel at eliminating enemy casters quickly through sustained mana pressure and burst damage.`,

        playstyle: 'Aggressive offense, mana drain focus, burst damage, caster elimination',

        strengths: [
          'Highest damage output of all Spellguard specs',
          'Enhanced mana drain on melee attacks',
          'Can convert AEP directly into damage',
          'Excellent at eliminating priority casters',
          'Strong sustained damage through mana drain',
          'Generates AEP consistently through melee'
        ],

        weaknesses: [
          'Requires melee range to be most effective',
          'Lower defensive capabilities',
          'More vulnerable to counterattacks',
          'Less effective at protecting allies',
          'Needs to balance offense with survival'
        ],

        passiveAbility: {
          name: 'Arcane Absorption',
          description: 'All Spellguards passively absorb magical damage. Gain 2 AEP for every point of fire, cold, lightning, or necrotic damage taken. Additionally, gain 1 AEP for every 2 points of physical damage taken.',
          icon: 'spell_arcane_prismaticcloak'
        },

        specPassive: {
          name: 'Mana Vampirism',
          description: 'Your melee attacks drain 2x mana (double the damage dealt). Additionally, for every 10 mana drained, your next melee attack deals +1d6 arcane damage (stacks up to 5 times). Empowered Strike and Arcane Strike cost -5 AEP.',
          icon: 'spell_shadow_manafeed'
        },

        keyAbilities: [
          'Devastating Strikes - Empowered Strike and Arcane Strike deal 50% increased damage.',
          'Mana Burn - When you drain mana from a target, they take 1 arcane damage per 2 mana drained.',
          'Energy Conversion - You can spend 20 AEP to instantly restore 20 mana (1 minute cooldown).'
        ]
      }
    ]
  },

  // Example Spells - showcasing AEP mechanics
  exampleSpells: [
    // BASIC DEFENSIVE SPELLS
    {
      id: 'sg_arcane_shield',
      name: 'Arcane Shield',
      description: 'Create a shield of absorbed arcane energy that protects you from incoming damage. The shield absorbs damage and grants bonus AC.',
      spellType: 'ACTION',
      icon: 'spell_holy_powerwordshield',
      school: 'Abjuration',
      level: 1,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      durationConfig: {
        durationType: 'minutes',
        duration: 1
      },

      resourceCost: {
        mana: 4,
        classResource: {
          type: 'arcane_energy_points',
          cost: 10
        },
        components: ['verbal', 'somatic'],
        verbalText: 'Aegis Arcanum!',
        somaticText: 'Raise hand to create shimmering barrier'
      },

      resolution: 'AUTOMATIC',

      healingConfig: {
        useAbsorptionShield: true,
        shieldConfig: {
          shieldType: 'standard',
          shieldAmount: '10d6',
          duration: 1,
          durationUnit: 'minutes'
        }
      },

      effects: {
        buff: {
          armorClass: 2,
          duration: 1,
          durationType: 'minutes'
        },
        shield: {
          amount: '10d6',
          type: 'arcane',
          duration: 1
        }
      },

      tags: ['defense', 'shield', 'aep-cost', 'self-buff']
    },

    {
      id: 'sg_reflective_barrier',
      name: 'Reflective Barrier',
      description: 'Create a barrier that reflects the next spell cast at you back at the caster. The reflected spell deals full damage and uses the original caster\'s spell save DC.',
      spellType: 'REACTION',
      icon: 'spell_holy_dispelmagic',
      school: 'Abjuration',
      level: 2,

      typeConfig: {
        castTime: 1,
        castTimeType: 'REACTION',
        reactionTrigger: 'When targeted by a spell'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 6,
        classResource: {
          type: 'arcane_energy_points',
          cost: 10
        },
        components: ['verbal', 'somatic'],
        verbalText: 'Reflecto!',
        somaticText: 'Thrust palm forward to create reflective ward'
      },

      resolution: 'AUTOMATIC',

      effects: {
        reflection: {
          type: 'spell',
          target: 'caster',
          percentage: 100,
          duration: 'next_spell'
        }
      },

      specialMechanics: {
        reflection: {
          reflectType: 'full_spell',
          targetOriginalCaster: true,
          usesOriginalDC: true
        }
      },

      tags: ['defense', 'reflection', 'reaction', 'aep-cost', 'anti-mage']
    },

    {
      id: 'sg_barrier_of_protection',
      name: 'Barrier of Protection',
      description: 'Create a protective barrier around all allies within 10 feet. The barrier absorbs damage for each ally and lasts for 1 minute.',
      spellType: 'ACTION',
      icon: 'spell_holy_prayerofhealing',
      school: 'Abjuration',
      level: 3,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        aoeType: 'circle',
        aoeSize: 10,
        rangeType: 'self_centered',
        validTargets: ['ally']
      },

      durationConfig: {
        durationType: 'minutes',
        duration: 1
      },

      resourceCost: {
        mana: 6,
        classResource: {
          type: 'arcane_energy_points',
          cost: 15
        },
        components: ['verbal', 'somatic'],
        verbalText: 'Protego Omnia!',
        somaticText: 'Sweep arms in circle to create protective dome'
      },

      resolution: 'AUTOMATIC',

      healingConfig: {
        useAbsorptionShield: true,
        shieldConfig: {
          shieldType: 'standard',
          shieldAmount: '8d6',
          duration: 1,
          durationUnit: 'minutes'
        }
      },

      effects: {
        shield: {
          amount: '8d6',
          type: 'arcane',
          duration: 1,
          aoe: true,
          targets: 'all_allies'
        }
      },

      tags: ['defense', 'shield', 'aoe', 'aep-cost', 'ally-protection']
    },

    // OFFENSIVE SPELLS
    {
      id: 'sg_empowered_strike',
      name: 'Empowered Strike',
      description: 'Infuse your next melee attack with absorbed arcane energy, dealing additional arcane damage. The strike also drains additional mana from the target.',
      spellType: 'ACTION',
      icon: 'ability_warrior_innerrage',
      school: 'Evocation',
      level: 1,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'melee',
        rangeDistance: 5,
        validTargets: ['enemy']
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 5,
        classResource: {
          type: 'arcane_energy_points',
          cost: 15
        },
        components: ['verbal', 'somatic'],
        verbalText: 'Impetus!',
        somaticText: 'Channel energy into weapon'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '2d6',
        damageType: 'arcane',
        scalingType: 'none'
      },

      effects: {
        damage: {
          instant: {
            formula: '2d6',
            type: 'arcane',
            additionalToMelee: true
          }
        },
        manaDrain: {
          amount: '2d6',
          description: 'Drains additional mana equal to arcane damage dealt'
        }
      },

      tags: ['damage', 'melee', 'arcane', 'aep-cost', 'mana-drain']
    },

    {
      id: 'sg_arcane_nova',
      name: 'Arcane Nova',
      description: 'Release stored arcane energy in a devastating burst around you. All enemies within 20 feet take arcane damage and have their spell damage reduced for 1 turn.',
      spellType: 'ACTION',
      icon: 'spell_arcane_blast',
      school: 'Evocation',
      level: 4,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        aoeType: 'circle',
        aoeSize: 20,
        rangeType: 'self_centered',
        validTargets: ['enemy']
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 8,
        classResource: {
          type: 'arcane_energy_points',
          cost: 25
        },
        components: ['verbal', 'somatic'],
        verbalText: 'Arcanum Explodo!',
        somaticText: 'Slam fists together to release energy burst'
      },

      resolution: 'SAVE',

      saveConfig: {
        saveType: 'dexterity',
        saveDC: 15,
        onSaveEffect: 'half_damage'
      },

      damageConfig: {
        formula: '6d6',
        damageType: 'arcane',
        scalingType: 'none'
      },

      effects: {
        damage: {
          instant: {
            formula: '6d6',
            type: 'arcane',
            aoe: true
          }
        },
        debuff: {
          type: 'spell_damage_reduction',
          amount: -2,
          duration: 1,
          durationType: 'turns'
        }
      },

      tags: ['damage', 'aoe', 'arcane', 'aep-cost', 'debuff']
    },

    {
      id: 'sg_arcane_strike',
      name: 'Arcane Strike',
      description: 'Channel massive arcane energy into your weapon for a devastating melee strike. Deals heavy arcane damage and silences the target for 1 turn.',
      spellType: 'ACTION',
      icon: 'spell_holy_blessingofstrength',
      school: 'Evocation',
      level: 3,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'melee',
        rangeDistance: 5,
        validTargets: ['enemy']
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 5,
        classResource: {
          type: 'arcane_energy_points',
          cost: 15
        },
        components: ['verbal', 'somatic'],
        verbalText: 'Arcanum Impactus!',
        somaticText: 'Overhead strike with glowing weapon'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '4d6',
        damageType: 'arcane',
        scalingType: 'none'
      },

      effects: {
        damage: {
          instant: {
            formula: '4d6',
            type: 'arcane',
            additionalToMelee: true
          }
        },
        debuff: {
          type: 'silence',
          duration: 1,
          durationType: 'turns',
          description: 'Target cannot cast spells'
        }
      },

      tags: ['damage', 'melee', 'arcane', 'aep-cost', 'silence', 'anti-mage']
    },

    // UTILITY SPELLS
    {
      id: 'sg_arcane_rejuvenation',
      name: 'Arcane Rejuvenation',
      description: 'Convert absorbed arcane energy into healing power. Heal yourself or an ally, restoring hit points based on your stored AEP.',
      spellType: 'ACTION',
      icon: 'spell_holy_heal',
      school: 'Abjuration',
      level: 2,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 30,
        validTargets: ['ally', 'self']
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 6,
        classResource: {
          type: 'arcane_energy_points',
          cost: 20
        },
        components: ['verbal', 'somatic'],
        verbalText: 'Sanatio Arcana!',
        somaticText: 'Channel healing energy toward target'
      },

      resolution: 'AUTOMATIC',

      healingConfig: {
        formula: '3d6',
        healingType: 'direct',
        resolution: 'DICE'
      },

      effects: {
        healing: {
          instant: {
            formula: '3d6',
            type: 'arcane'
          }
        }
      },

      tags: ['healing', 'utility', 'aep-cost', 'support']
    },

    {
      id: 'sg_elemental_resistance',
      name: 'Elemental Resistance',
      description: 'Use absorbed energy to grant yourself or an ally resistance to a chosen element (fire, cold, lightning, or necrotic) for 1 minute.',
      spellType: 'ACTION',
      icon: 'spell_nature_resistnature',
      school: 'Abjuration',
      level: 1,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'touch',
        rangeDistance: 5,
        validTargets: ['ally', 'self']
      },

      durationConfig: {
        durationType: 'minutes',
        duration: 1
      },

      resourceCost: {
        mana: 4,
        classResource: {
          type: 'arcane_energy_points',
          cost: 10
        },
        components: ['verbal', 'somatic'],
        verbalText: 'Resistentia!',
        somaticText: 'Touch target to grant resistance'
      },

      resolution: 'AUTOMATIC',

      effects: {
        buff: {
          type: 'elemental_resistance',
          elements: ['fire', 'cold', 'lightning', 'necrotic'],
          chooseOne: true,
          duration: 1,
          durationType: 'minutes',
          resistanceAmount: 'half_damage'
        }
      },

      tags: ['buff', 'resistance', 'utility', 'aep-cost', 'protection']
    },

    {
      id: 'sg_spell_disruption',
      name: 'Spell Disruption',
      description: 'Disrupt an enemy spell being cast, causing it to fail. This is a reaction that can be used when you see an enemy casting a spell within 60 feet.',
      spellType: 'REACTION',
      icon: 'spell_shadow_curseofachimonde',
      school: 'Abjuration',
      level: 3,

      typeConfig: {
        castTime: 1,
        castTimeType: 'REACTION',
        reactionTrigger: 'When you see an enemy casting a spell within 60 feet'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 60,
        validTargets: ['enemy']
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 5,
        classResource: {
          type: 'arcane_energy_points',
          cost: 15
        },
        components: ['verbal', 'somatic'],
        verbalText: 'Silentium!',
        somaticText: 'Cutting gesture to sever spell'
      },

      resolution: 'AUTOMATIC',

      effects: {
        counterspell: {
          type: 'interrupt',
          spellLevel: 'any',
          success: 'automatic'
        }
      },

      tags: ['counterspell', 'reaction', 'utility', 'aep-cost', 'anti-mage']
    },

    {
      id: 'sg_reflective_aura',
      name: 'Reflective Aura',
      description: 'Create an aura around yourself that reflects a portion of spell damage back at attackers for 1 minute. Reflects the next 10 points of spell damage taken.',
      spellType: 'ACTION',
      icon: 'spell_holy_holyprotection',
      school: 'Abjuration',
      level: 2,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      durationConfig: {
        durationType: 'minutes',
        duration: 1
      },

      resourceCost: {
        mana: 6,
        classResource: {
          type: 'arcane_energy_points',
          cost: 15
        },
        components: ['verbal', 'somatic'],
        verbalText: 'Aura Reflectus!',
        somaticText: 'Spin to create reflective field'
      },

      resolution: 'AUTOMATIC',

      effects: {
        aura: {
          type: 'reflection',
          reflectionAmount: 10,
          reflectionType: 'spell_damage',
          duration: 1,
          durationType: 'minutes'
        }
      },

      tags: ['buff', 'reflection', 'aura', 'aep-cost', 'anti-mage']
    },

    // ULTIMATE SPELLS
    {
      id: 'sg_arcane_fortress',
      name: 'Arcane Fortress',
      description: 'Create an impenetrable fortress of arcane energy around yourself, granting complete immunity to all magical damage for 1 turn. This is your ultimate defensive ability.',
      spellType: 'ACTION',
      icon: 'spell_holy_divineshield',
      school: 'Abjuration',
      level: 5,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      durationConfig: {
        durationType: 'turns',
        duration: 1
      },

      resourceCost: {
        mana: 8,
        classResource: {
          type: 'arcane_energy_points',
          cost: 25
        },
        components: ['verbal', 'somatic'],
        verbalText: 'Fortis Arcanum Absolutum!',
        somaticText: 'Cross arms to create impenetrable barrier'
      },

      resolution: 'AUTOMATIC',

      effects: {
        buff: {
          type: 'immunity',
          immunityType: 'magical_damage',
          duration: 1,
          durationType: 'turns'
        }
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 5,
        charges: 1
      },

      tags: ['defense', 'immunity', 'ultimate', 'aep-cost', 'anti-mage']
    },

    {
      id: 'sg_magic_nullification',
      name: 'Magic Nullification',
      description: 'Create a 20-foot radius anti-magic zone centered on yourself. All magical effects within the zone are suppressed for 1 minute. Enemies cannot cast spells within the zone.',
      spellType: 'ACTION',
      icon: 'spell_shadow_antimagicshell',
      school: 'Abjuration',
      level: 5,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        aoeType: 'circle',
        aoeSize: 20,
        rangeType: 'self_centered'
      },

      durationConfig: {
        durationType: 'minutes',
        duration: 1
      },

      resourceCost: {
        mana: 6,
        classResource: {
          type: 'arcane_energy_points',
          cost: 20
        },
        components: ['verbal', 'somatic'],
        verbalText: 'Nullus Magicae!',
        somaticText: 'Slam staff/weapon into ground to create zone'
      },

      resolution: 'AUTOMATIC',

      effects: {
        zone: {
          type: 'anti_magic',
          radius: 20,
          duration: 1,
          durationType: 'minutes',
          effects: [
            'suppress_magical_effects',
            'prevent_spellcasting',
            'dispel_ongoing_spells'
          ]
        }
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 3,
        charges: 1
      },

      tags: ['zone', 'anti-magic', 'ultimate', 'aep-cost', 'control']
    },

    {
      id: 'sg_spell_reflection',
      name: 'Spell Reflection',
      description: 'Instantly reflect the next spell cast at you back to the caster with increased power. The reflected spell deals 150% damage and cannot be countered.',
      spellType: 'REACTION',
      icon: 'spell_arcane_blink',
      school: 'Abjuration',
      level: 4,

      typeConfig: {
        castTime: 1,
        castTimeType: 'REACTION',
        reactionTrigger: 'When targeted by a spell'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 6,
        classResource: {
          type: 'arcane_energy_points',
          cost: 15
        },
        components: ['verbal', 'somatic'],
        verbalText: 'Reverso Maxima!',
        somaticText: 'Deflecting gesture'
      },

      resolution: 'AUTOMATIC',

      effects: {
        reflection: {
          type: 'spell',
          target: 'caster',
          percentage: 150,
          duration: 'next_spell',
          uncounterable: true
        }
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 2,
        charges: 1
      },

      tags: ['reflection', 'reaction', 'ultimate', 'aep-cost', 'anti-mage']
    },

    {
      id: 'sg_control_magic',
      name: 'Control Magic',
      description: 'Take control of a newly summoned creature or magical construct within 60 feet. The creature serves you for 1 minute or until dismissed.',
      spellType: 'REACTION',
      icon: 'spell_shadow_charm',
      school: 'Enchantment',
      level: 4,

      typeConfig: {
        castTime: 1,
        castTimeType: 'REACTION',
        reactionTrigger: 'When you see a creature being summoned within 60 feet'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 60,
        validTargets: ['summoned_creature']
      },

      durationConfig: {
        durationType: 'minutes',
        duration: 1
      },

      resourceCost: {
        mana: 7,
        classResource: {
          type: 'arcane_energy_points',
          cost: 20
        },
        components: ['verbal', 'somatic'],
        verbalText: 'Dominus Magicae!',
        somaticText: 'Grasping gesture to seize control'
      },

      resolution: 'SAVE',

      saveConfig: {
        saveType: 'wisdom',
        saveDC: 16,
        onSaveEffect: 'negates'
      },

      effects: {
        control: {
          type: 'charm',
          targetType: 'summoned',
          duration: 1,
          durationType: 'minutes',
          fullControl: true
        }
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 3,
        charges: 1
      },

      tags: ['control', 'charm', 'reaction', 'aep-cost', 'anti-mage', 'ultimate']
    }
  ]
};


