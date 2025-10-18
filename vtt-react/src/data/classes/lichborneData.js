/**
 * Lichborne Class Data
 * 
 * Complete class information for the Lichborne - a frost-wielding undead
 * master who balances life-draining aura with phylactery resurrection.
 */

export const LICHBORNE_DATA = {
  id: 'lichborne',
  name: 'Lichborne',
  icon: 'fas fa-skull',
  role: 'Damage/Control',

  // Overview section
  overview: {
    title: 'The Lichborne',
    subtitle: 'Eternal Frost and Undying Will',
    
    description: `The Lichborne harnesses the power of frost through their Eternal Frost Aura, a powerful but taxing ability that amplifies their frost magic at the cost of their own vitality. This mechanic is complemented by the Lichborne's Phylactery, an ancient artifact that anchors their soul and provides a lifeline in dire situations. Together, these systems create a dynamic, high-risk, high-reward playstyle that emphasizes strategic decision-making and careful management of resources.`,
    
    roleplayIdentity: {
      title: 'Roleplay Identity',
      content: `Lichborne are individuals who have transcended death through forbidden rituals, binding their soul to a phylactery. They exist in a state between life and death, wielding frost magic that mirrors their cold, undying nature. The phylactery is both their greatest strength and their most vulnerable weakness.

**Philosophy**: Death is not the end, but a transformation. The Lichborne believes that true power comes from mastering the boundary between life and death, using their undead state to achieve immortality and unmatched magical prowess.

**Personality Archetypes**:
- **The Eternal Scholar**: Seeks knowledge across centuries, viewing death as merely an inconvenience
- **The Vengeful Revenant**: Returned from death to exact revenge, fueled by cold fury
- **The Reluctant Immortal**: Bound to phylactery against their will, struggling with their undead nature
- **The Power-Hungry Lich**: Embraces undeath fully, seeking ever-greater magical power

**Social Dynamics**: Lichborne are feared and reviled by most. Their undead nature is obvious to those who look closely - pale skin, cold touch, unnatural stillness. They must decide whether to hide their nature or embrace the terror they inspire.`
    },
    
    combatRole: {
      title: 'Combat Role',
      content: `**Primary Role**: Frost damage specialist with resurrection mechanics

**Damage Profile**:
- High sustained frost damage through Eternal Frost Aura
- Area control through freezing and chilling effects
- Burst damage through frozen target interactions

**Control Capabilities**:
- Freeze enemies in place, preventing actions
- Chill effects that reduce movement speed
- Terrain control through ice walls and barriers

**Survivability**: High - Phylactery provides resurrection, but maintaining Eternal Frost Aura drains health. Requires careful balance between offense and self-preservation.`
    },
    
    playstyle: {
      title: 'Playstyle',
      content: `**Core Mechanic**: Eternal Frost Aura. Activate to enhance frost spells (+1d6 damage, chilling effects) but lose 1d6 HP per turn. Phylactery stores HP and provides resurrection.

**Decision Points**:
- When to activate/deactivate Eternal Frost Aura
- How much HP to store in Phylactery vs. keep available
- Which targets to freeze vs. chill
- When to use Phylactery resurrection vs. save it

**Skill Expression**:
- Managing health drain from Eternal Frost Aura
- Timing aura activation for maximum damage windows
- Strategic Phylactery HP storage and usage
- Exploiting frozen targets with bonus damage spells

**Aura Management Strategy**:
- **Aggressive**: Keep aura active constantly, rely on Phylactery resurrection
- **Balanced**: Toggle aura on/off based on combat intensity
- **Conservative**: Only activate aura for burst windows, preserve HP

**Team Dynamics**:
- Benefits from healers who can offset aura drain
- Synergizes with classes that can group enemies for AoE freeze
- Can control battlefield with ice walls and frozen enemies
- Phylactery resurrection allows aggressive plays`
    }
  },
  
  // Resource System
  resourceSystem: {
    title: 'Eternal Frost Aura & Phylactery',
    subtitle: 'Power Through Sacrifice, Resurrection Through Preparation',
    
    description: `The Lichborne's unique dual-mechanic system combines the Eternal Frost Aura (active power boost with health drain) and the Phylactery (HP storage and resurrection). Mastering both mechanics is essential to becoming an effective Lichborne.`,
    
    mechanics: {
      title: 'How It Works',
      content: `**Eternal Frost Aura**:
- **Activation**: 1 AP to activate, 0 AP to deactivate
- **Duration**: Up to 1 minute while active
- **Enhanced Frost Damage**: All frost spells deal +1d6 frost damage
- **Chilling Effects**: Enemies hit by frost spells must save (DC 15 Constitution) or have movement speed reduced by 10 ft until end of their next turn
- **Health Drain**: Lose 1d6 HP at the start of each turn while active (cannot be mitigated)
- **Sustaining**: Use healing spells/abilities to offset drain

**Phylactery Mechanics**:
- **HP Storage**: Ritual (1 hour) to transfer 10 HP into Phylactery
- **Maximum Storage**: 50 HP total
- **Resurrection**: When reduced to 0 HP, spend 10 HP from Phylactery to revive with 10 HP
- **Limit**: Once per combat
- **Recharging**: Sacrifice HP during short/long rest (max 10 HP per rest)

**Strategic Depth**:
- Balance aura damage boost against health drain
- Pre-store HP in Phylactery before dangerous encounters
- Time aura activation for burst damage windows
- Coordinate with healers to maintain aura longer`
    },

    keyAbilities: [
      {
        name: 'Eternal Frost Aura',
        type: 'Toggle Ability',
        description: 'Activate to enhance frost spells (+1d6 damage, chilling effects) but lose 1d6 HP per turn'
      },
      {
        name: 'Phylactery Storage',
        type: 'Ritual (1 hour)',
        description: 'Transfer 10 HP into Phylactery (max 50 HP stored)'
      },
      {
        name: 'Phylactery Resurrection',
        type: 'Passive',
        description: 'When reduced to 0 HP, spend 10 HP from Phylactery to revive with 10 HP (once per combat)'
      }
    ],

    strategicConsiderations: {
      title: 'Strategic Considerations',
      content: `**Phylactery 0-20 HP (Low Reserve)**:
- Avoid risky plays, conserve HP
- Deactivate aura unless necessary
- Focus on chilling/freezing for control
- Recharge Phylactery at next rest

**Phylactery 20-40 HP (Moderate Reserve)**:
- Can afford moderate aura usage
- Balance offense and defense
- Use resurrection as safety net
- Maintain some HP buffer

**Phylactery 40-50 HP (Full Reserve)**:
- Aggressive aura usage viable
- Can afford risky plays with resurrection backup
- Maximum damage output
- Coordinate burst windows with team

**Aura Management**:
- **Turn 1-2**: Activate aura for opening burst
- **Turn 3-5**: Toggle based on healing availability
- **Turn 6+**: Deactivate if low HP, reactivate for finishers

**Healing Coordination**:
- Communicate aura status to healers
- Time aura activation after receiving heals
- Use self-healing spells strategically
- Deactivate aura if no healing available`
    }
  },

  // Specializations
  specializations: {
    title: 'Lichborne Specializations',
    subtitle: 'Three Paths of Eternal Frost',

    description: 'Lichborne can specialize in three distinct paths, each emphasizing different aspects of frost magic and undead power.',

    sharedPassive: {
      name: 'Undying Frost',
      icon: 'spell_frost_frostarmor02',
      description: 'Your Eternal Frost Aura chilling effects have their save DC increased by 2 (DC 17 instead of 15). Additionally, you are immune to frost damage.'
    },

    specs: [
      {
        id: 'frostbound_tyrant',
        name: 'Frostbound Tyrant',
        icon: 'spell_frost_frostarmor',
        color: '#4A90E2',
        description: 'Masters of freezing enemies and controlling the battlefield',
        theme: 'Control and crowd control through freezing',

        passive: {
          name: 'Permafrost Mastery',
          description: 'Your freeze effects last 1d4 additional rounds. Frozen enemies take +1d6 damage from your frost spells.'
        },

        strengths: [
          'Exceptional crowd control through extended freezes',
          'High bonus damage to frozen targets',
          'Strong area denial with AoE freezes',
          'Can lock down multiple dangerous enemies'
        ],

        weaknesses: [
          'Lower damage against unfrozen targets',
          'Requires setup time to freeze enemies',
          'Less effective against freeze-immune enemies',
          'Relies on landing freeze saves'
        ],

        playstyle: 'Focus on freezing multiple enemies and exploiting frozen targets for bonus damage. Excels at locking down dangerous foes.',

        playstyleTips: [
          'Prioritize freezing high-threat targets first',
          'Use AoE freezes to control grouped enemies',
          'Follow up freezes with high-damage spells',
          'Coordinate with team to exploit frozen enemies'
        ]
      },
      {
        id: 'spectral_reaper',
        name: 'Spectral Reaper',
        icon: 'spell_shadow_soulleech_3',
        color: '#9370DB',
        description: 'Combines frost and necrotic damage for devastating hybrid attacks',
        theme: 'Frost/necrotic hybrid damage',

        passive: {
          name: 'Deathly Chill',
          description: 'Your frost spells deal +1d6 necrotic damage. Enemies killed by your spells have a 1 in 1d6 chance (roll 6) to rise as spectral minions for 1d4 rounds.'
        },

        strengths: [
          'Hybrid damage bypasses single-type resistances',
          'Can summon minions for additional damage/tanking',
          'Strong sustained damage output',
          'Effective against both living and undead enemies'
        ],

        weaknesses: [
          'Minion summoning is RNG-dependent',
          'Lower crowd control than Frostbound Tyrant',
          'Minions are temporary and fragile',
          'Less survivability than Phylactery Guardian'
        ],

        playstyle: 'Hybrid damage dealer who combines frost and necrotic energy. Can summon temporary minions from slain enemies.',

        playstyleTips: [
          'Focus on killing low-HP enemies to trigger minion summons',
          'Use hybrid spells to bypass resistances',
          'Position minions to body-block or flank',
          'Maintain Eternal Frost Aura for maximum damage'
        ]
      },
      {
        id: 'phylactery_guardian',
        name: 'Phylactery Guardian',
        icon: 'spell_frost_frozencore',
        color: '#2D1B69',
        description: 'Enhanced phylactery mechanics and survivability',
        theme: 'Improved resurrection and HP management',

        passive: {
          name: 'Fortified Phylactery',
          description: 'Your Phylactery can store up to 75 HP (instead of 50). Phylactery resurrection costs 8 HP (instead of 10) and revives you with 15 HP (instead of 10).'
        },

        strengths: [
          'Highest survivability of all specs',
          'Can afford aggressive aura usage',
          'More frequent resurrections',
          'Better HP buffer for risky plays'
        ],

        weaknesses: [
          'Lower damage output than other specs',
          'No crowd control bonuses',
          'Still vulnerable to burst damage',
          'Resurrection limited to once per combat'
        ],

        playstyle: 'Tankier Lichborne with enhanced resurrection mechanics. Can afford more aggressive aura usage.',

        playstyleTips: [
          'Keep Phylactery at high HP before dangerous encounters',
          'Use aggressive aura uptime with resurrection backup',
          'Don\'t be afraid to take risks with full Phylactery',
          'Coordinate resurrections with team for maximum impact'
        ]
      }
    ]
  },

  // Example Spells - showcasing frost magic and phylactery mechanics
  exampleSpells: [
    // BASIC FROST SPELLS
    {
      id: 'lb_grave_chill',
      name: 'Grave Chill',
      description: 'A spectral chill that deals damage and chills the target. If target is Frozen, deals additional damage.',
      category: 'basic_frost',
      spellType: 'ACTION',
      icon: 'spell_frost_frostbolt',
      school: 'Necromancy',

      resourceCost: {
        actionPoints: 2,
        mana: 5,
        components: ['verbal', 'somatic'],
        verbalText: 'Frigus Mortis!',
        somaticText: 'Extend hand with frost emanating'
      },

      castTime: 'Action',
      range: 30,
      targetType: 'Single Enemy',

      resolution: 'SAVE',

      saveConfig: {
        saveType: 'constitution',
        saveDC: 15,
        onSaveEffect: 'negates_chill'
      },

      damageConfig: {
        baseDamage: '1d6',
        damageType: 'frost',
        bonusDamage: {
          condition: 'target_frozen',
          amount: '+1d6',
          description: 'Bonus damage if target is Frozen'
        }
      },

      debuffConfig: {
        effects: [
          'Target is Chilled',
          'Movement speed reduced by 10 feet until end of next turn'
        ]
      },

      effects: {
        damage: {
          base: '1d6',
          type: 'frost',
          conditional: {
            frozen: '+1d6'
          }
        },
        debuff: {
          type: 'chilled',
          duration: 1,
          movementReduction: 10
        }
      },

      specialMechanics: {
        eternalFrostAura: {
          active: 'Deals +1d6 frost damage (total 2d6 base, 3d6 if frozen)',
          description: 'Aura enhances all frost spell damage'
        },
        frozenInteraction: {
          condition: 'Target has Frozen condition',
          effect: 'Deals additional 1d6 frost damage'
        }
      },

      tags: ['frost', 'damage', 'chill', 'basic', 'lichborne']
    },

    // FREEZE & CONTROL SPELLS
    {
      id: 'lb_wraith_spear',
      name: 'Wraith Spear',
      description: 'Summon a spectral spear of ice that pierces through enemies, potentially freezing them.',
      category: 'freeze_control',
      spellType: 'ACTION',
      icon: 'spell_frost_frostblast',
      school: 'Evocation',

      resourceCost: {
        actionPoints: 2,
        mana: 10,
        components: ['verbal', 'somatic'],
        verbalText: 'Hasta Gelidus!',
        somaticText: 'Thrust hand forward, conjuring ice spear'
      },

      castTime: 'Action',
      range: 40,
      targetType: 'Single Enemy',

      resolution: 'SAVE',

      saveConfig: {
        saveType: 'dexterity',
        saveDC: 15,
        onSaveEffect: 'half_damage_no_freeze'
      },

      damageConfig: {
        baseDamage: '2d6',
        damageType: 'frost',
        bonusDamage: {
          condition: 'target_frozen',
          amount: '+1d6',
          description: 'Bonus damage if target is already Frozen'
        }
      },

      debuffConfig: {
        effects: [
          'Target is Frozen for 1 turn',
          'Immobilized, cannot take actions or reactions'
        ]
      },

      effects: {
        damage: {
          base: '2d6',
          type: 'frost',
          conditional: {
            frozen: '+1d6'
          }
        },
        debuff: {
          type: 'frozen',
          duration: 1,
          immobilized: true,
          noActions: true,
          noReactions: true
        }
      },

      savingThrowEffect: {
        onSuccess: 'Takes 1d6 frost damage, not Frozen',
        onFailure: 'Takes 2d6 frost damage and is Frozen for 1 turn'
      },

      specialMechanics: {
        eternalFrostAura: {
          active: 'Deals +1d6 frost damage (total 3d6 base, 4d6 if already frozen)',
          description: 'Aura enhances damage and applies chill on save'
        }
      },

      tags: ['frost', 'damage', 'freeze', 'control', 'lichborne']
    },

    {
      id: 'lb_deathly_frost',
      name: 'Deathly Frost',
      description: 'Emit a burst of cold energy, damaging and freezing nearby enemies.',
      category: 'freeze_control',
      spellType: 'ACTION',
      icon: 'spell_frost_frostnova',
      school: 'Evocation',

      resourceCost: {
        actionPoints: 2,
        mana: 15,
        components: ['verbal', 'somatic'],
        verbalText: 'Glacies Mortis!',
        somaticText: 'Slam hands together, releasing frost wave'
      },

      castTime: 'Action',
      range: 'Self',
      targetType: 'AoE - 10 ft radius',

      resolution: 'SAVE',

      saveConfig: {
        saveType: 'constitution',
        saveDC: 15,
        onSaveEffect: 'half_damage_no_freeze'
      },

      damageConfig: {
        baseDamage: '1d8',
        damageType: 'frost',
        aoe: {
          shape: 'circle',
          radius: 10
        }
      },

      debuffConfig: {
        effects: [
          'Targets are Frozen for 1 turn',
          'Immobilized, cannot take actions or reactions'
        ]
      },

      effects: {
        damage: {
          base: '1d8',
          type: 'frost',
          aoe: {
            shape: 'circle',
            radius: 10
          }
        },
        debuff: {
          type: 'frozen',
          duration: 1,
          immobilized: true,
          noActions: true,
          noReactions: true
        }
      },

      savingThrowEffect: {
        onSuccess: 'Takes 1d4 frost damage, not Frozen',
        onFailure: 'Takes 1d8 frost damage and is Frozen for 1 turn'
      },

      specialMechanics: {
        eternalFrostAura: {
          active: 'Deals +1d6 frost damage per target (total 1d8+1d6 per target)',
          description: 'Aura enhances AoE damage'
        }
      },

      tags: ['frost', 'damage', 'freeze', 'aoe', 'control', 'lichborne']
    },

    // UTILITY & SUPPORT SPELLS
    {
      id: 'lb_glacial_shroud',
      name: 'Glacial Shroud',
      description: 'Encase yourself in ice, reducing damage taken and chilling attackers.',
      category: 'utility_support',
      spellType: 'ACTION',
      icon: 'spell_frost_frostarmor',
      school: 'Abjuration',

      resourceCost: {
        actionPoints: 2,
        mana: 8,
        components: ['verbal', 'somatic'],
        verbalText: 'Scutum Glaciei!',
        somaticText: 'Cross arms over chest, ice forms around body'
      },

      castTime: 'Bonus Action',
      range: 'Self',
      targetType: 'Self',

      resolution: 'AUTOMATIC',

      buffConfig: {
        effects: [
          'Reduce damage taken by 3',
          'Enemies that hit you must save or be Chilled',
          'Lasts 1 minute'
        ]
      },

      effects: {
        buff: {
          damageReduction: 3,
          duration: '1 minute',
          counterAttack: {
            trigger: 'when_hit',
            effect: 'attacker_chilled',
            save: {
              type: 'constitution',
              dc: 15
            }
          }
        }
      },

      specialMechanics: {
        chillingTouch: {
          trigger: 'Enemy hits you in melee',
          effect: 'Enemy must save (DC 15 Constitution) or be Chilled',
          chillEffect: 'Movement speed reduced by 10 ft until end of their next turn'
        }
      },

      tags: ['frost', 'buff', 'defense', 'utility', 'lichborne']
    },

    {
      id: 'lb_frozen_bastion',
      name: 'Frozen Bastion',
      description: 'Create a wall of ice that blocks movement and projectiles.',
      category: 'utility_support',
      spellType: 'ACTION',
      icon: 'spell_frost_icewall',
      school: 'Conjuration',

      resourceCost: {
        actionPoints: 2,
        mana: 12,
        components: ['verbal', 'somatic'],
        verbalText: 'Murus Glacialis!',
        somaticText: 'Sweep hand horizontally, ice wall rises'
      },

      castTime: 'Action',
      range: 60,
      targetType: 'Terrain',

      resolution: 'AUTOMATIC',

      summonConfig: {
        type: 'ice_wall',
        dimensions: {
          length: 20,
          height: 10,
          thickness: 1
        },
        hp: 50,
        duration: '1 minute'
      },

      effects: {
        summon: {
          type: 'ice_wall',
          length: '20 ft',
          height: '10 ft',
          thickness: '1 ft',
          hp: 50,
          duration: '1 minute',
          blocksMovement: true,
          blocksProjectiles: true
        }
      },

      specialMechanics: {
        wallProperties: {
          hp: 50,
          immunities: ['frost'],
          vulnerabilities: ['fire'],
          description: 'Wall can be destroyed by dealing 50 damage. Takes double damage from fire.'
        }
      },

      tags: ['frost', 'summon', 'terrain', 'utility', 'control', 'lichborne']
    },

    // AOE DEVASTATION SPELLS
    {
      id: 'lb_spectral_orb',
      name: 'Spectral Orb',
      description: 'Summon a spinning orb of ice that damages and chills enemies in its path.',
      category: 'aoe_devastation',
      spellType: 'ACTION',
      icon: 'spell_frost_frostbolt02',
      school: 'Evocation',

      resourceCost: {
        actionPoints: 2,
        mana: 18,
        components: ['verbal', 'somatic'],
        verbalText: 'Orbis Gelidus!',
        somaticText: 'Spin hands in circle, orb forms and launches'
      },

      castTime: 'Action',
      range: 30,
      targetType: 'Line - 30 ft',

      resolution: 'SAVE',

      saveConfig: {
        saveType: 'constitution',
        saveDC: 15,
        onSaveEffect: 'half_damage_no_chill'
      },

      damageConfig: {
        baseDamage: '2d8',
        damageType: 'frost',
        aoe: {
          shape: 'line',
          length: 30,
          width: 5
        },
        bonusDamage: {
          condition: 'target_frozen',
          amount: '+1d6',
          description: 'Bonus damage if target is Frozen'
        }
      },

      debuffConfig: {
        effects: [
          'Targets have movement speed halved',
          'Chilled effect lasts until end of next turn'
        ]
      },

      effects: {
        damage: {
          base: '2d8',
          type: 'frost',
          aoe: {
            shape: 'line',
            length: 30,
            width: 5
          },
          conditional: {
            frozen: '+1d6'
          }
        },
        debuff: {
          type: 'chilled',
          duration: 1,
          movementReduction: 'half'
        }
      },

      savingThrowEffect: {
        onSuccess: 'Takes 1d8 frost damage, not Chilled',
        onFailure: 'Takes 2d8 frost damage and movement speed halved'
      },

      specialMechanics: {
        eternalFrostAura: {
          active: 'Deals +1d6 frost damage per target hit',
          description: 'Aura enhances line AoE damage'
        }
      },

      tags: ['frost', 'damage', 'aoe', 'chill', 'lichborne']
    },

    // HYBRID FROST/NECROTIC SPELLS
    {
      id: 'lb_necrotic_blizzard',
      name: 'Necrotic Blizzard',
      description: 'Call forth a storm of necrotic ice shards that rains down in a designated area.',
      category: 'hybrid_necrotic',
      spellType: 'ACTION',
      icon: 'spell_frost_icestorm',
      school: 'Necromancy',

      resourceCost: {
        actionPoints: 3,
        mana: 20,
        components: ['verbal', 'somatic'],
        verbalText: 'Tempestas Mortis!',
        somaticText: 'Raise both hands skyward, storm forms above'
      },

      castTime: 'Action',
      range: 60,
      targetType: 'AoE - 20 ft radius',

      resolution: 'SAVE',

      saveConfig: {
        saveType: 'constitution',
        saveDC: 15,
        onSaveEffect: 'half_damage_no_freeze'
      },

      damageConfig: {
        baseDamage: '3d6',
        damageTypes: ['necrotic', 'frost'],
        aoe: {
          shape: 'circle',
          radius: 20
        }
      },

      debuffConfig: {
        effects: [
          'Targets are Frozen for 1 turn',
          'Immobilized, cannot take actions or reactions'
        ]
      },

      effects: {
        damage: {
          base: '3d6',
          types: ['necrotic', 'frost'],
          split: '1d6 necrotic + 2d6 frost',
          aoe: {
            shape: 'circle',
            radius: 20
          }
        },
        debuff: {
          type: 'frozen',
          duration: 1,
          immobilized: true,
          noActions: true,
          noReactions: true
        }
      },

      savingThrowEffect: {
        onSuccess: 'Takes 1d6 necrotic + 1d6 frost damage, not Frozen',
        onFailure: 'Takes 1d6 necrotic + 2d6 frost damage and is Frozen for 1 turn'
      },

      specialMechanics: {
        eternalFrostAura: {
          active: 'Frost portion deals +1d6 damage (total 1d6 necrotic + 3d6 frost)',
          description: 'Aura only enhances frost damage portion'
        },
        hybridDamage: {
          description: 'Deals both necrotic and frost damage',
          benefit: 'Bypasses single-type resistances'
        }
      },

      tags: ['frost', 'necrotic', 'damage', 'aoe', 'freeze', 'hybrid', 'lichborne']
    },

    {
      id: 'lb_frostbite_curse',
      name: 'Frostbite Curse',
      description: 'Inflict a painful frostbite on a target, causing damage and reducing their effectiveness in combat.',
      category: 'basic_frost',
      spellType: 'ACTION',
      icon: 'spell_frost_frostshock',
      school: 'Necromancy',

      resourceCost: {
        actionPoints: 2,
        mana: 6,
        components: ['verbal', 'somatic'],
        verbalText: 'Maledictio Frigoris!',
        somaticText: 'Point at target, frost spreads across their body'
      },

      castTime: 'Action',
      range: 40,
      targetType: 'Single Enemy',

      resolution: 'SAVE',

      saveConfig: {
        saveType: 'constitution',
        saveDC: 15,
        onSaveEffect: 'half_damage_no_debuff'
      },

      damageConfig: {
        baseDamage: '1d6',
        damageType: 'frost',
        bonusDamage: {
          condition: 'target_frozen',
          amount: '+1d6',
          description: 'Bonus damage if target is Frozen'
        }
      },

      debuffConfig: {
        effects: [
          'Target is Slowed',
          'Movement speed reduced by 10 feet',
          'Can only take one action OR one bonus action per turn (not both)',
          'Suffers Frostbite: takes 1d4 frost damage for every 5 feet moved',
          'Lasts 1 minute'
        ]
      },

      effects: {
        damage: {
          base: '1d6',
          type: 'frost',
          conditional: {
            frozen: '+1d6'
          }
        },
        debuff: {
          type: 'slowed',
          duration: '1 minute',
          movementReduction: 10,
          actionLimitation: 'one_action_or_bonus',
          frostbite: {
            damage: '1d4',
            trigger: 'per 5 ft moved'
          }
        }
      },

      savingThrowEffect: {
        onSuccess: 'Takes 1d4 frost damage, no debuff',
        onFailure: 'Takes 1d6 frost damage, Slowed and Frostbite for 1 minute'
      },

      specialMechanics: {
        eternalFrostAura: {
          active: 'Deals +1d6 frost damage (total 2d6 base, 3d6 if frozen)',
          description: 'Aura enhances damage'
        },
        frostbiteMechanic: {
          description: 'Enemy takes 1d4 frost damage per 5 ft moved',
          counterplay: 'Enemy can choose to stay still to avoid movement damage'
        }
      },

      tags: ['frost', 'damage', 'debuff', 'slow', 'dot', 'lichborne']
    },

    {
      id: 'lb_deathly_spikes',
      name: 'Deathly Spikes',
      description: 'Summon spikes of necrotic ice from the ground, impaling enemies and creating difficult terrain.',
      category: 'hybrid_necrotic',
      spellType: 'ACTION',
      icon: 'spell_deathknight_frostfever',
      school: 'Necromancy',

      resourceCost: {
        actionPoints: 2,
        mana: 14,
        components: ['verbal', 'somatic'],
        verbalText: 'Aculei Mortis!',
        somaticText: 'Slam fist into ground, spikes erupt'
      },

      castTime: 'Action',
      range: 40,
      targetType: 'AoE - 10 ft radius',

      resolution: 'SAVE',

      saveConfig: {
        saveType: 'dexterity',
        saveDC: 15,
        onSaveEffect: 'half_damage'
      },

      damageConfig: {
        baseDamage: '2d6',
        damageTypes: ['necrotic', 'frost'],
        aoe: {
          shape: 'circle',
          radius: 10
        },
        bonusDamage: {
          condition: 'target_frozen',
          amount: '+1d6',
          description: 'Bonus damage if target is Frozen'
        }
      },

      terrainConfig: {
        type: 'difficult_terrain',
        duration: '1 minute',
        area: '10 ft radius'
      },

      effects: {
        damage: {
          base: '2d6',
          types: ['necrotic', 'frost'],
          split: '1d6 necrotic + 1d6 frost',
          aoe: {
            shape: 'circle',
            radius: 10
          },
          conditional: {
            frozen: '+1d6'
          }
        },
        terrain: {
          type: 'difficult',
          duration: '1 minute',
          area: '10 ft radius',
          description: 'Ice spikes remain, creating difficult terrain'
        }
      },

      savingThrowEffect: {
        onSuccess: 'Takes 1d6 total damage (split necrotic/frost)',
        onFailure: 'Takes 2d6 total damage (1d6 necrotic + 1d6 frost)'
      },

      specialMechanics: {
        eternalFrostAura: {
          active: 'Frost portion deals +1d6 damage (total 1d6 necrotic + 2d6 frost)',
          description: 'Aura only enhances frost damage portion'
        },
        terrainControl: {
          description: 'Creates difficult terrain that persists for 1 minute',
          effect: 'Enemies must spend 2 ft of movement for every 1 ft moved through area'
        }
      },

      tags: ['frost', 'necrotic', 'damage', 'aoe', 'terrain', 'hybrid', 'lichborne']
    },

    {
      id: 'lb_banshees_breath',
      name: "Banshee's Breath",
      description: 'Release a chilling wind that damages and pushes back enemies.',
      category: 'hybrid_necrotic',
      spellType: 'ACTION',
      icon: 'spell_shadow_soulleech_3',
      school: 'Necromancy',

      resourceCost: {
        actionPoints: 2,
        mana: 16,
        components: ['verbal', 'somatic'],
        verbalText: 'Spiritus Gelidus!',
        somaticText: 'Inhale deeply, exhale spectral wind'
      },

      castTime: 'Action',
      range: 'Self',
      targetType: 'Cone - 15 ft',

      resolution: 'SAVE',

      saveConfig: {
        saveType: 'strength',
        saveDC: 15,
        onSaveEffect: 'half_damage_no_push'
      },

      damageConfig: {
        baseDamage: '2d8',
        damageType: 'frost',
        aoe: {
          shape: 'cone',
          length: 15
        },
        bonusDamage: {
          condition: 'target_frozen',
          amount: '+1d6',
          description: 'Bonus damage if target is Frozen'
        }
      },

      pushConfig: {
        distance: 10,
        direction: 'away_from_caster'
      },

      effects: {
        damage: {
          base: '2d8',
          type: 'frost',
          aoe: {
            shape: 'cone',
            length: 15
          },
          conditional: {
            frozen: '+1d6'
          }
        },
        push: {
          distance: 10,
          direction: 'away',
          description: 'Targets pushed back 10 feet'
        }
      },

      savingThrowEffect: {
        onSuccess: 'Takes 1d8 frost damage, not pushed',
        onFailure: 'Takes 2d8 frost damage and pushed back 10 feet'
      },

      specialMechanics: {
        eternalFrostAura: {
          active: 'Deals +1d6 frost damage per target (total 3d8 base, 4d8 if frozen)',
          description: 'Aura enhances cone damage'
        },
        positioning: {
          description: 'Can push enemies off cliffs or into hazards',
          tactical: 'Use to create space or reposition enemies'
        }
      },

      tags: ['frost', 'damage', 'aoe', 'push', 'cone', 'lichborne']
    },

    {
      id: 'lb_cryostatic_tomb',
      name: 'Cryostatic Tomb',
      description: 'Place yourself or an ally in a protective ice block, healing and shielding them from harm.',
      category: 'utility_support',
      spellType: 'ACTION',
      icon: 'spell_frost_frozencore',
      school: 'Abjuration',

      resourceCost: {
        actionPoints: 3,
        mana: 25,
        components: ['verbal', 'somatic'],
        verbalText: 'Sepulcrum Glaciale!',
        somaticText: 'Encase target in ice cocoon'
      },

      castTime: 'Action',
      range: 10,
      targetType: 'Self or Ally',

      resolution: 'AUTOMATIC',

      healingConfig: {
        formula: '3d6',
        healingType: 'instant',
        description: 'Heals target immediately'
      },

      shieldConfig: {
        type: 'temporary_hp',
        amount: 'equal_to_healing',
        duration: '1 minute or until destroyed',
        hp: 50
      },

      effects: {
        healing: {
          instant: {
            formula: '3d6',
            target: 'single'
          }
        },
        shield: {
          temporaryHp: 'equal to healing rolled',
          iceBlock: {
            hp: 50,
            duration: '1 minute',
            immunities: ['all_damage_while_encased'],
            restriction: 'Cannot move or take actions while encased'
          }
        }
      },

      specialMechanics: {
        iceBlock: {
          hp: 50,
          duration: '1 minute',
          description: 'Target is encased in ice block with 50 HP',
          immunities: 'Immune to all damage while encased',
          restriction: 'Cannot move or take actions',
          breakable: 'Allies can break ice block early by dealing 50 damage to it'
        },
        tacticalUse: {
          description: 'Use on dying ally to stabilize and protect',
          alternative: 'Use on self when low HP to heal and reset'
        }
      },

      tags: ['frost', 'healing', 'shield', 'utility', 'support', 'lichborne']
    }
  ]
};


