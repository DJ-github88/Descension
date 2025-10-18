/**
 * WITCH DOCTOR CLASS DATA
 * 
 * Voodoo practitioner who invokes powerful loa (voodoo gods) through Voodoo Essence
 * Resource System: Voodoo Essence - generated through curses, rituals, totems, and poisons
 * Specializations: Death Caller, Spirit Healer, War Priest
 */

export const WITCH_DOCTOR_DATA = {
  id: 'witch-doctor',
  name: 'Witch Doctor',
  icon: 'fas fa-skull',
  role: 'Support/Damage',

  // Overview section
  overview: {
    title: 'The Witch Doctor',
    subtitle: 'Voodoo Invoker & Loa Channeler',
    
    description: `The Witch Doctor is a mystical practitioner of voodoo magic who channels the power of ancient loa (voodoo gods) through accumulated Voodoo Essence. By performing rituals, casting curses, placing totems, and applying poisons, the Witch Doctor gathers spiritual energy that can be spent to invoke powerful deities. Each loa requires specific precursors to be met before their divine power can be called upon, rewarding strategic planning and careful resource management.`,
    
    roleplayIdentity: {
      title: 'Roleplay Identity',
      content: `Witch Doctors are spiritual intermediaries between the mortal world and the realm of the loa. Whether through ancestral tradition, desperate bargaining, or scholarly pursuit of forbidden knowledge, they have learned to commune with powerful voodoo spirits and channel their divine power.

**The Witch Doctor's Philosophy**: The loa are neither good nor evil—they are forces of nature, ancient spirits with their own agendas. To invoke them is to make a pact, to offer respect and tribute in exchange for their devastating power. Every curse cast, every ritual performed, every totem placed is an offering to the spirits.

**Common Witch Doctor Archetypes**:
- **The Tribal Shaman**: Keeper of ancestral traditions, protector of their people through ancient rites
- **The Desperate Bargainer**: Made a pact with the loa in a moment of need, now bound to their service
- **The Dark Scholar**: Studied forbidden voodoo texts, seeking power through understanding the spirits
- **The Cursed Bloodline**: Born with the loa's mark, destined to serve as their mortal vessel`
    },
    
    combatRole: {
      title: 'Combat Role',
      content: `The Witch Doctor is a versatile support/control caster who excels at debuffing enemies, supporting allies, and unleashing devastating divine invocations. They build power gradually through curses and rituals, then spend it on game-changing loa invocations.

**Damage Output**: Moderate sustained damage through curses and poisons. High burst potential through loa invocations.

**Survivability**: Moderate. Relies on totems for protection and healing, with some defensive rituals available.

**Utility**: Exceptional. Provides curses, healing, resurrection, teleportation, and powerful buffs through loa invocations.

**Complexity**: High. Requires careful tracking of Voodoo Essence, curse management, and strategic timing of loa invocations based on precursor conditions.`
    },
    
    playstyle: {
      title: 'Playstyle & Strategy',
      content: `**Core Gameplay Loop**:
1. **Build Voodoo Essence** through curses, poisons, totems, and rituals
2. **Manage Precursors** by tracking cursed enemies, ally positions, and ritual completion
3. **Invoke Loa** when essence and precursors align for maximum impact
4. **Control the Battlefield** with strategic totem placement and curse application

**Voodoo Essence Management**:
- **Low Essence (0-5)**: Focus on building through curses and totems, conservative play
- **Medium Essence (6-9)**: Can invoke minor loa (Simbi, Papa Legba), maintain curse coverage
- **High Essence (10+)**: Ready for major invocations (Baron Samedi, Ogoun), game-changing moments

**Precursor Planning**:
- Track which enemies are cursed for Baron Samedi invocation
- Position near allies for Erzulie invocation
- Complete rituals proactively to enable Papa Legba
- Apply poisons early to enable Ogoun when needed

**Strategic Considerations**:
- Curse high-priority targets early to build toward Baron Samedi
- Place Totem of Healing before invoking Erzulie for maximum benefit
- Save Ritual of Death for critical moments when multiple enemies are grouped
- Coordinate with allies for optimal positioning before major invocations`
    }
  },
  
  // Resource System
  resourceSystem: {
    title: 'Voodoo Essence & Loa Invocation',
    subtitle: 'Spiritual Energy & Divine Channeling',

    description: `The Witch Doctor's power stems from Voodoo Essence, a spiritual resource generated through voodoo practices. This essence is spent to invoke powerful loa (voodoo gods), each requiring specific precursor conditions to be met. Mastering the balance between essence generation, precursor management, and strategic invocation timing is the key to becoming a powerful Witch Doctor.`,
    
    mechanics: {
      title: 'How It Works',
      content: `**Voodoo Essence Generation**:
- **Casting Curses**: Each curse cast generates 1 Voodoo Essence
- **Applying Poisons**: Poisoning weapons or throwing poison grenades generates 1 Voodoo Essence
- **Performing Rituals**: Successfully completing a ritual generates 2 Voodoo Essence
- **Placing Totems**: Each totem placed generates 1 Voodoo Essence
- **Defeating Cursed Enemies**: Defeating an enemy you cursed generates 3 Voodoo Essence

**Maximum Capacity**: You can hold up to 15 Voodoo Essence at once

**Loa Invocation**:
Each loa requires both sufficient Voodoo Essence AND specific precursor conditions to be met. Invocations are powerful, game-changing abilities that consume all required essence when activated.

**Precursor Tracking**:
Carefully track battlefield conditions to know when you can invoke each loa. Some precursors require preparation (rituals, totem placement), while others emerge naturally through combat (cursed enemies, ally positioning).`
    },
    
    essenceGenerationTable: {
      title: 'Voodoo Essence Generation',
      headers: ['Action', 'Essence Gained', 'Notes'],
      rows: [
        ['Cast Curse', '1', 'Any curse spell applied to enemy'],
        ['Apply Poison', '1', 'Weapon poison or poison grenade'],
        ['Place Totem', '1', 'Any totem type'],
        ['Perform Ritual', '2', 'Ritual must complete successfully'],
        ['Defeat Cursed Enemy', '3', 'Enemy must have your curse active']
      ]
    },

    loaInvocationTable: {
      title: 'Loa Invocations',
      headers: ['Loa', 'Essence Cost', 'Precursors', 'Effect Summary'],
      rows: [
        ['Baron Samedi', '10', '3+ cursed enemies, Ritual of Death', 'Resurrect ally + curse all enemies (4d6 necrotic over 3 turns)'],
        ['Erzulie', '8', '2+ allies within 10ft, Totem of Healing placed', '+2 AC, fear immunity, heal 3d8 to all allies in 30ft'],
        ['Papa Legba', '7', '2+ essence from rituals, within 30ft of cursed enemy', 'Telepathy for 1hr + teleport 5 allies within 1 mile'],
        ['Simbi', '6', '1+ ally below 50% HP, Ritual of Cleansing', 'Healing rain: 4d6 HP, cure diseases/poisons in 30ft'],
        ['Ogoun', '9', 'Poison applied, 1+ ally in combat within 15ft', '+2 attack, physical resistance, +2d6 fire damage for 1min']
      ]
    },

    strategicConsiderations: {
      title: 'Strategic Considerations',
      content: `**Early Combat (Rounds 1-3)**:
Focus on building essence through curses and totems. Apply poisons to weapons. Identify which loa will be most valuable for the current encounter.

**Mid Combat (Rounds 4-6)**:
You should have 6-10 essence. Consider invoking Simbi for healing or Papa Legba for utility. Continue building toward major invocations if the fight will last longer.

**Late Combat (Rounds 7+)**:
Prime time for Baron Samedi or Ogoun invocations. These game-changing abilities can turn the tide of difficult battles.

**Precursor Preparation**:
- Always have Ritual of Death ready for Baron Samedi opportunities
- Place Totem of Healing proactively when allies are grouped
- Track your ritual-generated essence for Papa Legba
- Apply poisons early in combat to enable Ogoun later`
    }
  },

  // Specializations
  specializations: {
    title: 'Voodoo Specializations',
    subtitle: 'Three Paths of the Loa',
    
    description: `Witch Doctors specialize in different aspects of voodoo practice, each focusing on specific loa and spiritual techniques. Choose your specialization to determine which divine powers you master.`,
    
    passiveAbility: {
      name: 'Loa\'s Favor',
      description: 'All Witch Doctors can invoke any of the five loa, but your specialization determines which invocations are enhanced and cost less essence.'
    },
    
    specs: [
      {
        id: 'shadow-priest',
        name: 'Shadow Priest',
        icon: 'spell_shadow_raisedead',
        color: '#8B008B',
        theme: 'Necromancy & Resurrection',

        description: `Shadow Priests specialize in the darker aspects of voodoo, focusing on Baron Samedi and the manipulation of life and death. They excel at cursing enemies, raising the dead, and wielding necrotic power.`,

        playstyle: 'Aggressive cursing, necrotic damage, resurrection focus',
        
        strengths: [
          'Baron Samedi invocation costs -2 essence (8 instead of 10)',
          'Curses generate +1 additional Voodoo Essence',
          'Enhanced necrotic damage on cursed targets',
          'Can invoke Baron Samedi with only 2 cursed enemies (instead of 3)'
        ],

        weaknesses: [
          'Limited healing compared to other specs',
          'Requires curse management',
          'Baron Samedi precursors still demanding',
          'Less effective against undead/constructs'
        ],

        specPassive: {
          name: 'Shadow\'s Embrace',
          description: 'Baron Samedi invocations cost 2 less essence and require only 2 cursed enemies. Curses generate +1 additional Voodoo Essence.'
        },
        
        keyAbilities: [
          'Curse of Agony: Your signature curse that deals 2d6 necrotic damage per turn',
          'Ritual of Death: Dark ritual that curses an area and frightens enemies',
          'Baron Samedi Invocation: Resurrect ally and devastate enemies with necrotic curse'
        ]
      },
      
      {
        id: 'spirit-healer',
        name: 'Spirit Healer',
        icon: 'spell_nature_healingtouch',
        color: '#20B2AA',
        theme: 'Healing & Protection',
        
        description: `Spirit Healers channel Erzulie and Simbi, focusing on protective magic, healing, and support. They excel at keeping allies alive through totems, healing rituals, and divine protection.`,
        
        playstyle: 'Support-focused, totem placement, healing optimization',
        
        strengths: [
          'Erzulie and Simbi invocations cost -2 essence each',
          'Totems generate +1 additional Voodoo Essence',
          'Enhanced healing on all spells (+50%)',
          'Totems have increased range and duration'
        ],
        
        weaknesses: [
          'Lower damage output',
          'Requires ally positioning awareness',
          'Totem placement can be disrupted',
          'Less effective when solo'
        ],
        
        specPassive: {
          name: 'Spirit\'s Grace',
          description: 'Erzulie and Simbi invocations cost 2 less essence. Totems generate +1 additional essence and have +50% healing power.'
        },
        
        keyAbilities: [
          'Totem of Healing: Healing totem that restores 2d4 HP per turn to nearby allies',
          'Ritual of Cleansing: Purifying ritual that removes curses and diseases',
          'Erzulie Invocation: Divine protection granting AC, fear immunity, and healing'
        ]
      },
      
      {
        id: 'war-priest',
        name: 'War Priest',
        icon: 'ability_warrior_innerrage',
        color: '#DC143C',
        theme: 'Combat Enhancement & Spirits',
        
        description: `War Priests follow Ogoun and Papa Legba, focusing on combat enhancement, poison warfare, and spiritual communication. They excel at empowering allies and devastating enemies with enhanced weapons.`,
        
        playstyle: 'Aggressive support, poison application, combat buffs',
        
        strengths: [
          'Ogoun and Papa Legba invocations cost -2 essence each',
          'Poisons generate +1 additional Voodoo Essence',
          'Enhanced weapon damage (+2d6 on poisoned weapons)',
          'Can apply poisons as bonus action'
        ],
        
        weaknesses: [
          'Limited direct healing',
          'Requires melee range for some abilities',
          'Poison-resistant enemies reduce effectiveness',
          'Ogoun precursors require ally coordination'
        ],
        
        specPassive: {
          name: 'Warrior\'s Spirit',
          description: 'Ogoun and Papa Legba invocations cost 2 less essence. Poisons generate +1 additional essence and deal +2d6 damage.'
        },
        
        keyAbilities: [
          'Venomous Weapon: Apply potent poison adding 2d4 poison damage for 1 hour',
          'Poison Cloud: Toxic explosion dealing 3d6 poison damage in 10ft radius',
          'Ogoun Invocation: Empower allies with combat prowess and fire damage'
        ]
      }
    ]
  },

  // Example Spells - organized by specialization
  exampleSpells: [
    // ===== SHADOW PRIEST SPECIALIZATION =====
    {
      id: 'wd_curse_of_agony',
      name: 'Curse of Agony',
      description: 'Inflict a painful curse on the target, causing them to writhe in pain and take necrotic damage each turn.',
      spellType: 'ACTION',
      icon: 'spell_shadow_curseofsargeras',
      school: 'Necromancy',
      level: 2,
      specialization: 'shadow-priest',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 60
      },

      durationConfig: {
        durationType: 'rounds',
        duration: 10
      },

      resourceCost: {
        mana: 3,
        components: ['verbal', 'somatic', 'material'],
        verbalText: 'Suffer eternal torment!',
        somaticText: 'Point at target with cursed fetish',
        materialText: 'Voodoo doll fragment'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '2d6',
        damageType: 'necrotic',
        scalingType: 'dot'
      },

      effects: {
        damage: {
          dot: {
            formula: '2d6',
            type: 'necrotic',
            duration: 10,
            interval: 'turn'
          }
        },
        debuff: {
          type: 'cursed',
          duration: 10,
          description: 'Target is cursed and takes necrotic damage each turn'
        }
      },

      specialMechanics: {
        voodooEssence: {
          generates: 1,
          description: 'Generates 1 Voodoo Essence when cast'
        },
        curse: {
          type: 'agony',
          stackable: false,
          description: 'Counts toward Baron Samedi precursor (3 cursed enemies)'
        }
      },

      tags: ['curse', 'necrotic', 'dot', 'shadow-priest', 'essence-generator'],
      flavorText: 'The loa of pain hear your plea. Let suffering be their answer.'
    },

    {
      id: 'wd_ritual_of_death',
      name: 'Ritual of Death',
      description: 'Perform a dark ritual that curses an area, dealing necrotic damage and frightening enemies within.',
      spellType: 'ACTION',
      icon: 'spell_shadow_darkritual',
      school: 'Necromancy',
      level: 3,
      specialization: 'shadow-priest',

      typeConfig: {
        castTime: 1,
        castTimeType: 'ACTION'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 30,
        aoeType: 'circle',
        aoeSize: 15
      },

      durationConfig: {
        durationType: 'rounds',
        duration: 3
      },

      resourceCost: {
        mana: 5,
        components: ['verbal', 'somatic', 'material'],
        verbalText: 'Baron Samedi, accept this offering!',
        somaticText: 'Draw ritual circle with staff',
        materialText: 'Graveyard dirt and bone dust'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '2d6',
        damageType: 'necrotic',
        scalingType: 'dot'
      },

      effects: {
        damage: {
          dot: {
            formula: '2d6',
            type: 'necrotic',
            duration: 3,
            interval: 'turn',
            aoe: true
          }
        },
        control: {
          type: 'frightened',
          duration: 3,
          savingThrow: 'Wisdom',
          dc: 15
        },
        zone: {
          type: 'cursed_ground',
          duration: 3,
          description: 'Area becomes cursed ground'
        }
      },

      specialMechanics: {
        voodooEssence: {
          generates: 2,
          description: 'Generates 2 Voodoo Essence (ritual completion)'
        },
        precursor: {
          enables: 'baron_samedi',
          description: 'Required precursor for Baron Samedi invocation'
        },
        ritual: {
          type: 'death',
          interruptible: true,
          description: 'Can be interrupted if caster takes damage'
        }
      },

      tags: ['ritual', 'necrotic', 'aoe', 'fear', 'shadow-priest', 'precursor'],
      flavorText: 'Death walks among the living. The Baron demands tribute.'
    },

    {
      id: 'wd_baron_samedi_invocation',
      name: 'Invoke Baron Samedi',
      description: 'Channel the power of Baron Samedi, the loa of death and resurrection. Resurrect one fallen ally with full HP and curse all enemies within 30 feet.',
      spellType: 'ACTION',
      icon: 'spell_shadow_raisedead',
      school: 'Necromancy',
      level: 7,
      specialization: 'shadow-priest',

      typeConfig: {
        castTime: 1,
        castTimeType: 'ACTION'
      },

      targetingConfig: {
        targetingType: 'special',
        rangeType: 'ranged',
        rangeDistance: 30,
        aoeType: 'circle',
        aoeSize: 30
      },

      durationConfig: {
        durationType: 'rounds',
        duration: 3
      },

      resourceCost: {
        mana: 15,
        voodooEssence: 10,
        components: ['verbal', 'somatic', 'material'],
        verbalText: 'Baron Samedi, master of the crossroads, I invoke thee!',
        somaticText: 'Raise staff to the sky',
        materialText: 'Top hat and cigar as offering'
      },

      resolution: 'AUTOMATIC',

      healingConfig: {
        formula: 'FULL_HP',
        healingType: 'resurrection',
        description: 'Resurrect one ally with full hit points'
      },

      damageConfig: {
        formula: '4d6',
        damageType: 'necrotic',
        scalingType: 'dot'
      },

      effects: {
        resurrection: {
          targets: 1,
          condition: 'dead_within_1_minute',
          healAmount: 'FULL_HP',
          description: 'Resurrect one fallen ally'
        },
        damage: {
          dot: {
            formula: '4d6',
            type: 'necrotic',
            duration: 3,
            interval: 'turn',
            aoe: true,
            targets: 'all_enemies_in_radius'
          }
        },
        debuff: {
          type: 'cursed',
          duration: 3,
          targets: 'all_enemies_in_radius'
        }
      },

      specialMechanics: {
        voodooEssence: {
          cost: 10,
          specialization_discount: 2,
          description: 'Shadow Priests pay only 8 essence'
        },
        precursors: {
          required: ['3_cursed_enemies', 'ritual_of_death'],
          specialization_reduction: '2_cursed_enemies_for_shadow_priest',
          description: 'Requires 3 cursed enemies and Ritual of Death completion'
        },
        invocation: {
          type: 'loa',
          deity: 'Baron Samedi',
          cooldown: 'once_per_long_rest'
        }
      },

      tags: ['invocation', 'loa', 'resurrection', 'necrotic', 'aoe', 'shadow-priest', 'ultimate'],
      flavorText: 'The Baron arrives in a cloud of cigar smoke, his laughter echoing as death itself bows before him.'
    },

    // ===== SPIRIT HEALER SPECIALIZATION =====
    {
      id: 'wd_totem_of_healing',
      name: 'Totem of Healing',
      description: 'Place a healing totem that restores hit points to all allies within 10 feet each turn.',
      spellType: 'ACTION',
      icon: 'spell_nature_healingtouch',
      school: 'Conjuration',
      level: 2,
      specialization: 'spirit-healer',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'ground',
        rangeType: 'ranged',
        rangeDistance: 30,
        aoeType: 'circle',
        aoeSize: 10
      },

      durationConfig: {
        durationType: 'rounds',
        duration: 10
      },

      resourceCost: {
        mana: 4,
        components: ['verbal', 'somatic', 'material'],
        verbalText: 'Spirits of healing, answer my call!',
        somaticText: 'Plant totem in ground',
        materialText: 'Carved wooden totem'
      },

      resolution: 'AUTOMATIC',

      healingConfig: {
        formula: '2d4',
        healingType: 'aoe_allies',
        description: 'Heal all allies within 10 feet each turn'
      },

      effects: {
        healing: {
          dot: {
            formula: '2d4',
            type: 'healing',
            duration: 10,
            interval: 'turn',
            aoe: true,
            targets: 'allies_in_radius'
          }
        },
        summon: {
          type: 'totem',
          hp: 10,
          ac: 10,
          duration: 10,
          description: 'Totem can be destroyed by enemies'
        }
      },

      specialMechanics: {
        voodooEssence: {
          generates: 1,
          specialization_bonus: 1,
          description: 'Generates 1 essence (2 for Spirit Healers)'
        },
        precursor: {
          enables: 'erzulie',
          description: 'Required precursor for Erzulie invocation'
        },
        totem: {
          type: 'healing',
          destructible: true,
          specialization_bonus: '+50% healing for Spirit Healers'
        }
      },

      tags: ['totem', 'healing', 'aoe', 'spirit-healer', 'essence-generator', 'precursor'],
      flavorText: 'The spirits gather around the totem, their gentle touch mending wounds.'
    },

    {
      id: 'wd_ritual_of_cleansing',
      name: 'Ritual of Cleansing',
      description: 'Perform a purifying ritual that removes all curses, diseases, and poisons from an ally.',
      spellType: 'ACTION',
      icon: 'spell_holy_purify',
      school: 'Abjuration',
      level: 3,
      specialization: 'spirit-healer',

      typeConfig: {
        castTime: 1,
        castTimeType: 'ACTION'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'touch',
        rangeDistance: 5
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 4,
        components: ['verbal', 'somatic', 'material'],
        verbalText: 'Simbi, cleanse this vessel!',
        somaticText: 'Wash target with blessed water',
        materialText: 'River water and purifying herbs'
      },

      resolution: 'AUTOMATIC',

      effects: {
        cleanse: {
          removes: ['curse', 'disease', 'poison'],
          targets: 'single_ally',
          description: 'Remove all negative conditions'
        }
      },

      specialMechanics: {
        voodooEssence: {
          generates: 2,
          description: 'Generates 2 Voodoo Essence (ritual completion)'
        },
        precursor: {
          enables: 'simbi',
          description: 'Required precursor for Simbi invocation'
        },
        ritual: {
          type: 'cleansing',
          interruptible: true
        }
      },

      tags: ['ritual', 'cleanse', 'healing', 'spirit-healer', 'precursor'],
      flavorText: 'The river spirit washes away all impurities, leaving only purity.'
    },

    {
      id: 'wd_erzulie_invocation',
      name: 'Invoke Erzulie',
      description: 'Channel the power of Erzulie, goddess of love and protection. Create a protective aura granting AC bonus, fear immunity, and healing to all allies within 30 feet.',
      spellType: 'ACTION',
      icon: 'spell_holy_prayerofhealing',
      school: 'Abjuration',
      level: 6,
      specialization: 'spirit-healer',

      typeConfig: {
        castTime: 1,
        castTimeType: 'ACTION'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self',
        aoeType: 'circle',
        aoeSize: 30
      },

      durationConfig: {
        durationType: 'rounds',
        duration: 10
      },

      resourceCost: {
        mana: 12,
        voodooEssence: 8,
        components: ['verbal', 'somatic', 'material'],
        verbalText: 'Erzulie, goddess of love, protect your children!',
        somaticText: 'Embrace allies with open arms',
        materialText: 'Jewels and fine perfume as offering'
      },

      resolution: 'AUTOMATIC',

      healingConfig: {
        formula: '3d8',
        healingType: 'aoe_allies',
        description: 'Heal all allies in 30ft radius over 1 minute'
      },

      effects: {
        healing: {
          dot: {
            formula: '3d8',
            type: 'healing',
            duration: 10,
            interval: 'turn',
            aoe: true,
            targets: 'allies_in_radius'
          }
        },
        buff: {
          ac_bonus: 2,
          duration: 10,
          targets: 'allies_in_radius'
        },
        immunity: {
          type: 'fear',
          duration: 10,
          targets: 'allies_in_radius'
        }
      },

      specialMechanics: {
        voodooEssence: {
          cost: 8,
          specialization_discount: 2,
          description: 'Spirit Healers pay only 6 essence'
        },
        precursors: {
          required: ['2_allies_within_10ft', 'totem_of_healing_placed'],
          description: 'Requires 2 allies within 10ft and Totem of Healing on battlefield'
        },
        invocation: {
          type: 'loa',
          deity: 'Erzulie',
          cooldown: 'once_per_long_rest'
        }
      },

      tags: ['invocation', 'loa', 'healing', 'buff', 'protection', 'spirit-healer', 'ultimate'],
      flavorText: 'Erzulie descends in radiant beauty, her love a shield against all harm.'
    },

    // ===== WAR PRIEST SPECIALIZATION =====
    {
      id: 'wd_venomous_weapon',
      name: 'Venomous Weapon',
      description: 'Apply a potent poison to your weapon, adding poison damage to your attacks for 1 hour.',
      spellType: 'ACTION',
      icon: 'ability_rogue_dualweild',
      school: 'Transmutation',
      level: 2,
      specialization: 'war-priest',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      durationConfig: {
        durationType: 'hours',
        duration: 1
      },

      resourceCost: {
        mana: 3,
        components: ['verbal', 'somatic', 'material'],
        verbalText: 'Venom of the serpent, coat my blade!',
        somaticText: 'Anoint weapon with poison vial',
        materialText: 'Poison extract'
      },

      resolution: 'AUTOMATIC',

      damageConfig: {
        formula: '2d4',
        damageType: 'poison',
        scalingType: 'weapon_enhancement'
      },

      effects: {
        buff: {
          type: 'weapon_enhancement',
          damage_bonus: '2d4',
          damage_type: 'poison',
          duration: 60,
          description: 'Weapon deals additional poison damage'
        }
      },

      specialMechanics: {
        voodooEssence: {
          generates: 1,
          specialization_bonus: 1,
          description: 'Generates 1 essence (2 for War Priests)'
        },
        precursor: {
          enables: 'ogoun',
          description: 'Counts toward Ogoun invocation precursor'
        },
        poison: {
          type: 'weapon_coating',
          specialization_bonus: '+2d6 damage for War Priests'
        }
      },

      tags: ['poison', 'buff', 'weapon', 'war-priest', 'essence-generator', 'precursor'],
      flavorText: 'The serpent loa bless your weapon with deadly venom.'
    },

    {
      id: 'wd_poison_cloud',
      name: 'Poison Cloud',
      description: 'Create a toxic cloud that explodes in a 10-foot radius, dealing poison damage and poisoning enemies.',
      spellType: 'ACTION',
      icon: 'spell_nature_nullifypoison_02',
      school: 'Evocation',
      level: 3,
      specialization: 'war-priest',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 60,
        aoeType: 'circle',
        aoeSize: 10
      },

      durationConfig: {
        durationType: 'rounds',
        duration: 3
      },

      resourceCost: {
        mana: 5,
        components: ['verbal', 'somatic', 'material'],
        verbalText: 'Breathe deep the poison air!',
        somaticText: 'Throw poison grenade',
        materialText: 'Poison grenade'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '3d6',
        damageType: 'poison',
        scalingType: 'aoe'
      },

      effects: {
        damage: {
          instant: {
            formula: '3d6',
            type: 'poison',
            aoe: true
          }
        },
        debuff: {
          type: 'poisoned',
          duration: 3,
          savingThrow: 'Constitution',
          dc: 15
        }
      },

      specialMechanics: {
        voodooEssence: {
          generates: 1,
          description: 'Generates 1 Voodoo Essence'
        },
        precursor: {
          enables: 'ogoun',
          description: 'Counts toward Ogoun invocation precursor'
        }
      },

      tags: ['poison', 'damage', 'aoe', 'war-priest', 'essence-generator'],
      flavorText: 'Toxic fumes choke your enemies, the spirits of disease rejoicing.'
    },

    {
      id: 'wd_ogoun_invocation',
      name: 'Invoke Ogoun',
      description: 'Channel the power of Ogoun, god of war and iron. Imbue yourself and allies within 30 feet with fierce combat prowess.',
      spellType: 'ACTION',
      icon: 'ability_warrior_innerrage',
      school: 'Transmutation',
      level: 7,
      specialization: 'war-priest',

      typeConfig: {
        castTime: 1,
        castTimeType: 'ACTION'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self',
        aoeType: 'circle',
        aoeSize: 30
      },

      durationConfig: {
        durationType: 'rounds',
        duration: 10
      },

      resourceCost: {
        mana: 15,
        voodooEssence: 9,
        components: ['verbal', 'somatic', 'material'],
        verbalText: 'Ogoun, god of war, grant us your strength!',
        somaticText: 'Raise weapon to the sky',
        materialText: 'Machete and rum as offering'
      },

      resolution: 'AUTOMATIC',

      damageConfig: {
        formula: '2d6',
        damageType: 'fire',
        scalingType: 'weapon_enhancement'
      },

      effects: {
        buff: {
          attack_bonus: 2,
          damage_bonus: '2d6',
          damage_type: 'fire',
          duration: 10,
          targets: 'allies_in_radius'
        },
        resistance: {
          type: 'physical',
          duration: 10,
          targets: 'allies_in_radius'
        }
      },

      specialMechanics: {
        voodooEssence: {
          cost: 9,
          specialization_discount: 2,
          description: 'War Priests pay only 7 essence'
        },
        precursors: {
          required: ['poison_applied', '1_ally_in_combat_within_15ft'],
          description: 'Requires poison application and 1 ally in combat within 15ft'
        },
        invocation: {
          type: 'loa',
          deity: 'Ogoun',
          cooldown: 'once_per_long_rest'
        }
      },

      tags: ['invocation', 'loa', 'buff', 'fire', 'war-priest', 'ultimate'],
      flavorText: 'Ogoun arrives with the clash of steel, his war cry igniting the blood of warriors.'
    },

    // ===== ADDITIONAL UTILITY SPELLS (ALL SPECIALIZATIONS) =====
    {
      id: 'wd_simbi_invocation',
      name: 'Invoke Simbi',
      description: 'Channel the power of Simbi, spirit of healing and rivers. Summon a healing rain that falls over a 30-foot radius.',
      spellType: 'ACTION',
      icon: 'spell_nature_tranquility',
      school: 'Conjuration',
      level: 5,
      specialization: 'spirit-healer',

      typeConfig: {
        castTime: 1,
        castTimeType: 'ACTION'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 60,
        aoeType: 'circle',
        aoeSize: 30
      },

      durationConfig: {
        durationType: 'rounds',
        duration: 10
      },

      resourceCost: {
        mana: 10,
        voodooEssence: 6,
        components: ['verbal', 'somatic', 'material'],
        verbalText: 'Simbi, river spirit, wash away our pain!',
        somaticText: 'Pour water from sacred vessel',
        materialText: 'River water in ceremonial bowl'
      },

      resolution: 'AUTOMATIC',

      healingConfig: {
        formula: '4d6',
        healingType: 'aoe_allies',
        description: 'Heal all allies in 30ft radius'
      },

      effects: {
        healing: {
          instant: {
            formula: '4d6',
            type: 'healing',
            aoe: true,
            targets: 'allies_in_radius'
          }
        },
        cleanse: {
          removes: ['disease', 'poison'],
          targets: 'allies_in_radius',
          description: 'Cure all diseases and poisons'
        }
      },

      specialMechanics: {
        voodooEssence: {
          cost: 6,
          specialization_discount: 2,
          description: 'Spirit Healers pay only 4 essence'
        },
        precursors: {
          required: ['1_ally_below_50_percent_hp', 'ritual_of_cleansing'],
          description: 'Requires 1 ally below 50% HP and Ritual of Cleansing completion'
        },
        invocation: {
          type: 'loa',
          deity: 'Simbi',
          cooldown: 'once_per_long_rest'
        }
      },

      tags: ['invocation', 'loa', 'healing', 'cleanse', 'spirit-healer', 'ultimate'],
      flavorText: 'Simbi rises from the waters, her healing rain washing away all suffering.'
    },

    {
      id: 'wd_papa_legba_invocation',
      name: 'Invoke Papa Legba',
      description: 'Channel the power of Papa Legba, guardian of the crossroads. Grant telepathy and teleport allies across great distances.',
      spellType: 'ACTION',
      icon: 'spell_arcane_portalironforge',
      school: 'Conjuration',
      level: 6,
      specialization: 'war-priest',

      typeConfig: {
        castTime: 1,
        castTimeType: 'ACTION'
      },

      targetingConfig: {
        targetingType: 'special',
        rangeType: 'special',
        rangeDistance: 5280
      },

      durationConfig: {
        durationType: 'hours',
        duration: 1
      },

      resourceCost: {
        mana: 12,
        voodooEssence: 7,
        components: ['verbal', 'somatic', 'material'],
        verbalText: 'Papa Legba, open the way!',
        somaticText: 'Draw crossroads symbol with staff',
        materialText: 'Walking stick and tobacco as offering'
      },

      resolution: 'AUTOMATIC',

      effects: {
        telepathy: {
          duration: 60,
          range: 'unlimited',
          targets: 'all_allies',
          description: 'All allies can communicate telepathically'
        },
        teleportation: {
          targets: 5,
          range: 5280,
          condition: 'previously_seen_location',
          description: 'Teleport up to 5 allies to any location within 1 mile'
        }
      },

      specialMechanics: {
        voodooEssence: {
          cost: 7,
          specialization_discount: 2,
          description: 'War Priests pay only 5 essence'
        },
        precursors: {
          required: ['2_essence_from_rituals', 'within_30ft_of_cursed_enemy'],
          description: 'Requires 2+ essence from rituals and be within 30ft of cursed enemy'
        },
        invocation: {
          type: 'loa',
          deity: 'Papa Legba',
          cooldown: 'once_per_long_rest'
        }
      },

      tags: ['invocation', 'loa', 'teleportation', 'utility', 'war-priest', 'ultimate'],
      flavorText: 'Papa Legba opens the crossroads, his ancient wisdom guiding you through the spirit realm.'
    },

    {
      id: 'wd_hex_of_weakness',
      name: 'Hex of Weakness',
      description: 'Reduce the target\'s Strength and Dexterity, making them vulnerable to physical attacks.',
      spellType: 'ACTION',
      icon: 'spell_shadow_curseofachimonde',
      school: 'Necromancy',
      level: 2,
      specialization: 'shadow-priest',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 60
      },

      durationConfig: {
        durationType: 'rounds',
        duration: 10
      },

      resourceCost: {
        mana: 4,
        components: ['verbal', 'somatic'],
        verbalText: 'Weakness consume you!',
        somaticText: 'Point at target with cursed gesture'
      },

      resolution: 'DICE',

      effects: {
        debuff: {
          strength_reduction: '1d6',
          dexterity_reduction: '1d6',
          duration: 10,
          savingThrow: 'Constitution',
          dc: 14
        },
        curse: {
          type: 'weakness',
          duration: 10
        }
      },

      specialMechanics: {
        voodooEssence: {
          generates: 1,
          description: 'Generates 1 Voodoo Essence'
        },
        curse: {
          type: 'weakness',
          stackable: false,
          description: 'Counts toward Baron Samedi precursor'
        }
      },

      tags: ['curse', 'debuff', 'shadow-priest', 'essence-generator'],
      flavorText: 'Your strength drains away, stolen by the spirits of weakness.'
    },

    {
      id: 'wd_spirit_communion',
      name: 'Spirit Communion',
      description: 'Speak with spirits to gain insight about a location, object, or person. The spirits provide cryptic but useful information.',
      spellType: 'RITUAL',
      icon: 'spell_shadow_soulleech_3',
      school: 'Divination',
      level: 3,
      specialization: 'all',

      typeConfig: {
        castTime: 10,
        castTimeType: 'MINUTES'
      },

      targetingConfig: {
        targetingType: 'special',
        rangeType: 'self'
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 3,
        components: ['verbal', 'somatic', 'material'],
        verbalText: 'Spirits of the past, speak to me!',
        somaticText: 'Burn incense and meditate',
        materialText: 'Incense and spirit offerings'
      },

      resolution: 'AUTOMATIC',

      effects: {
        divination: {
          type: 'spirit_knowledge',
          questions: 3,
          accuracy: 'cryptic_but_truthful',
          description: 'Ask spirits 3 questions about location, object, or person'
        }
      },

      specialMechanics: {
        voodooEssence: {
          generates: 2,
          description: 'Generates 2 Voodoo Essence (ritual completion)'
        },
        ritual: {
          type: 'communion',
          interruptible: true,
          duration: 10
        }
      },

      tags: ['ritual', 'divination', 'utility', 'all-specs', 'essence-generator'],
      flavorText: 'The spirits whisper secrets from beyond the veil, their words cryptic but true.'
    },

    {
      id: 'wd_totem_of_courage',
      name: 'Totem of Courage',
      description: 'Place a totem that grants allies immunity to fear effects and a bonus to attack rolls.',
      spellType: 'ACTION',
      icon: 'spell_nature_stoneskintotem',
      school: 'Conjuration',
      level: 3,
      specialization: 'war-priest',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'ground',
        rangeType: 'ranged',
        rangeDistance: 30,
        aoeType: 'circle',
        aoeSize: 10
      },

      durationConfig: {
        durationType: 'rounds',
        duration: 10
      },

      resourceCost: {
        mana: 4,
        components: ['verbal', 'somatic', 'material'],
        verbalText: 'Spirits of war, embolden us!',
        somaticText: 'Plant war totem in ground',
        materialText: 'Carved war totem'
      },

      resolution: 'AUTOMATIC',

      effects: {
        buff: {
          attack_bonus: 1,
          duration: 10,
          aoe: true,
          targets: 'allies_in_radius'
        },
        immunity: {
          type: 'fear',
          duration: 10,
          aoe: true,
          targets: 'allies_in_radius'
        },
        summon: {
          type: 'totem',
          hp: 10,
          ac: 10,
          duration: 10
        }
      },

      specialMechanics: {
        voodooEssence: {
          generates: 1,
          description: 'Generates 1 Voodoo Essence'
        },
        totem: {
          type: 'courage',
          destructible: true
        }
      },

      tags: ['totem', 'buff', 'immunity', 'war-priest', 'essence-generator'],
      flavorText: 'The war spirits rally around the totem, their courage infectious.'
    }
  ]
};

