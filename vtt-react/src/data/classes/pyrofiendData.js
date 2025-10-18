/**
 * Pyrofiend Class Data
 * 
 * Complete class information for the Pyrofiend - a demonic fire wielder
 * with ascending corruption stages and massive damage potential.
 */

export const PYROFIEND_DATA = {
  id: 'pyrofiend',
  name: 'Pyrofiend',
  icon: 'fas fa-fire',
  role: 'Damage',

  // Overview section
  overview: {
    title: 'The Pyrofiend',
    subtitle: 'Demonic Fire Wielder',
    
    description: `The Pyrofiend is a master of demonic fire magic, channeling infernal power through the dangerous Inferno Veil mechanic. As they cast fire spells, they ascend through increasingly powerful—and perilous—stages of demonic corruption. Each stage amplifies their fire damage but inflicts severe drawbacks inspired by the circles of Dante's Inferno and the seven deadly sins.`,
    
    roleplayIdentity: {
      title: 'Roleplay Identity',
      content: `Pyrofiends walk a razor's edge between mortal and demon. They have made pacts with infernal entities, trading their humanity for devastating power. In roleplay, Pyrofiends often struggle with their demonic nature—some embrace it fully, reveling in destruction, while others fight to maintain control over the corruption that threatens to consume them.
      
Their connection to hellfire manifests physically: eyes that glow with inner flame, skin that radiates heat, and an aura of sulfur and ash. At higher Inferno Levels, their appearance becomes increasingly demonic—horns may sprout, skin may crack to reveal molten veins, and their voice may echo with infernal resonance.

Common Pyrofiend archetypes include:
- **The Damned Scholar**: Sought forbidden knowledge and paid the price
- **The Vengeful Burned**: Survived a terrible fire and emerged changed
- **The Willing Vessel**: Deliberately sought demonic power for a greater purpose
- **The Cursed Bloodline**: Born with infernal heritage they cannot escape`
    },
    
    combatRole: {
      title: 'Combat Role',
      content: `The Pyrofiend is one of the highest damage dealers in the game, second only to the intentionally unbalanced Chaos Weaver. They excel at:

**Burst Damage**: Ascending to high Inferno Levels unleashes devastating fire damage
**Sustained Pressure**: Burn effects and damage-over-time keep enemies under constant threat  
**Risk-Reward Gameplay**: Managing Inferno Levels creates exciting tactical decisions
**Area Control**: Fire-based AOE spells can control the battlefield

However, this power comes at a cost. The Pyrofiend's drawbacks at high Inferno Levels can be crippling, requiring careful resource management and strategic timing. A Pyrofiend who ascends too quickly may find themselves unable to survive their own power.`
    },
    
    playstyle: {
      title: 'Playstyle & Strategy',
      content: `Playing a Pyrofiend is about managing risk versus reward. Key strategic considerations:

**Inferno Level Management**: 
- Low levels (0-3): Safe, consistent damage
- Mid levels (4-6): High damage with manageable drawbacks
- High levels (7-9): Devastating power but extreme vulnerability

**Timing Your Ascension**: 
- Ascend rapidly for burst damage when you need to eliminate priority targets
- Maintain mid-levels for sustained combat effectiveness
- Use Cooling Ember strategically to descend when drawbacks become too severe

**Specialization Synergies**:
- **Inferno**: Pure damage, aggressive ascension
- **Wildfire**: Spread and area control
- **Hellfire**: Demonic utility and self-sustain

**Team Dynamics**:
- Requires protection from tanks when at high Inferno Levels
- Benefits from healers who can offset self-damage
- Synergizes with crowd control to safely ascend`
    }
  },
  
  // Resource System
  resourceSystem: {
    title: 'Inferno Veil',
    subtitle: 'Demonic Ascension Mechanic',
    
    description: `The Inferno Veil is the Pyrofiend's unique resource system. It represents the character's descent into demonic corruption, with each level granting increased fire damage but inflicting thematic drawbacks based on the circles of Hell and the seven deadly sins.`,
    
    mechanics: {
      title: 'How It Works',
      content: `**Starting State**: All Pyrofiends begin combat at Inferno Level 0

**Ascending**: Many fire spells cause you to ascend 1-3 Inferno Levels when cast
**Descending**: The Cooling Ember spell and certain abilities reduce your Inferno Level
**Maximum Level**: Inferno Level 9 is the maximum—attempting to ascend further has no effect
**Level Persistence**: Your Inferno Level persists between combats unless you rest or use abilities to reduce it

**Damage Bonus**: At each Inferno Level, you gain bonus fire damage to ALL fire spells:
- Level 1: +1 fire damage
- Level 2: +2 fire damage
- Level 3: +3 fire damage
- ...continuing up to...
- Level 9: +10 fire damage

**Drawbacks**: Each level also inflicts increasingly severe penalties (see table below)`
    },
    
    infernoLevelsTable: {
      title: 'Inferno Veil: Level Effects',
      headers: ['Level', 'Fire Damage Bonus', 'Drawback', 'Thematic Inspiration'],
      rows: [
        ['0', '+0', 'None', 'Mortal State'],
        ['1', '+1', 'Minor visual distortions reduce hit chance by 2', 'Limbo - Flickering Flames'],
        ['2', '+2', 'Lustful intensity: 1d4 psychic damage per turn', 'Lust - Distracting Heat'],
        ['3', '+3', 'Oppressive heat: -10 ft movement, constant fatigue', 'Gluttony - Heavy Rain'],
        ['4', '+4', 'Molten veins: +2d6 damage taken from all attacks', 'Greed - Weight of Gold'],
        ['5', '+5', 'Body cracks: 1d6 bleeding per turn, -4 AC', 'Wrath - River Styx'],
        ['6', '+6', 'Blazing eyes: Disadvantage on sight-based checks/attacks', 'Heresy - Uncontrollable Fire'],
        ['7', '+7', 'Scorching breath: -15 ft speed, 1d6 suffocation per turn', 'Violence - Burning Sand'],
        ['8', '+8', 'Wreathed in flames: 2d4 self-damage per turn, disadvantage on Dex checks', 'Fraud - Raging Flames'],
        ['9', '+10', 'Engulfed: 4d8 self-damage per turn, death in 3 turns if not extinguished, disadvantage on all saves', 'Treachery - Frozen in Fire']
      ]
    },
    
    strategicConsiderations: {
      title: 'Strategic Considerations',
      content: `**Level 0-3 (Safe Zone)**: Minimal drawbacks, good for sustained combat
**Level 4-6 (Power Zone)**: High damage with manageable risks, optimal for most encounters
**Level 7-9 (Danger Zone)**: Extreme power but life-threatening drawbacks, use only for critical moments

**Cooling Ember**: Your primary tool for managing Inferno Levels. Reduces levels by 1d4 and heals you for 1d6 per level reduced. Use it when:
- Drawbacks become too severe
- Combat is ending and you want to reset
- You need emergency healing
- You're about to enter a dangerous situation at high levels`
    }
  },
  
  // Specializations
  specializations: {
    title: 'Pyrofiend Specializations',
    subtitle: 'Three Paths of Infernal Power',
    
    description: `Every Pyrofiend chooses one of three specializations that define their approach to demonic fire magic. Each specialization offers unique passive abilities and influences your spell selection and playstyle.`,
    
    specs: [
      {
        id: 'inferno',
        name: 'Inferno',
        icon: 'spell_fire_fireball02',
        color: '#FF4500',
        theme: 'Pure Destruction',
        
        description: `The Inferno specialization embodies raw, uncontrolled demonic fire. Inferno Pyrofiends are the most aggressive, ascending rapidly and dealing maximum burst damage. They embrace the corruption fully, using it as a weapon.`,
        
        playstyle: 'Aggressive burst damage, rapid ascension, high-risk high-reward',
        
        strengths: [
          'Highest single-target burst damage',
          'Fastest Inferno Level ascension',
          'Powerful execute abilities at high levels',
          'Bonus damage when above Inferno Level 5'
        ],
        
        weaknesses: [
          'Most vulnerable to drawbacks',
          'Limited defensive options',
          'Requires careful timing',
          'Struggles in prolonged fights'
        ],
        
        passiveAbilities: [
          {
            name: 'Infernal Surge',
            tier: 'Path Passive',
            description: 'When you ascend to Inferno Level 5 or higher, your next fire spell deals an additional 2d6 fire damage.',
            sharedBy: 'All Pyrofiends'
          },
          {
            name: 'Burning Ambition',
            tier: 'Specialization Passive',
            description: 'While at Inferno Level 7 or higher, your critical hit chance with fire spells increases by 10%, and critical hits deal an additional 1d10 fire damage.',
            uniqueTo: 'Inferno'
          }
        ],
        
        recommendedFor: 'Players who enjoy high-risk gameplay, burst damage, and aggressive tactics'
      },
      
      {
        id: 'wildfire',
        name: 'Wildfire',
        icon: 'spell_fire_flameshock',
        color: '#FF8C00',
        theme: 'Spreading Chaos',
        
        description: `Wildfire Pyrofiends specialize in spreading flames across multiple targets. Their fire jumps from enemy to enemy, creating cascading infernos that consume entire groups. They balance ascension with area control.`,
        
        playstyle: 'Area damage, damage-over-time effects, battlefield control',
        
        strengths: [
          'Excellent multi-target damage',
          'Strong damage-over-time effects',
          'Fire spreads between enemies',
          'Better sustained damage than Inferno'
        ],
        
        weaknesses: [
          'Lower single-target burst',
          'Requires enemy grouping',
          'DoT effects take time',
          'Less effective against single bosses'
        ],
        
        passiveAbilities: [
          {
            name: 'Infernal Surge',
            tier: 'Path Passive',
            description: 'When you ascend to Inferno Level 5 or higher, your next fire spell deals an additional 2d6 fire damage.',
            sharedBy: 'All Pyrofiends'
          },
          {
            name: 'Wildfire Spread',
            tier: 'Specialization Passive',
            description: 'When an enemy affected by your burn effect dies, the burn spreads to all enemies within 10 feet, dealing 2d6 fire damage and applying a new burn effect (1d6 fire damage per turn for 3 turns).',
            uniqueTo: 'Wildfire'
          }
        ],
        
        recommendedFor: 'Players who enjoy area control, damage-over-time builds, and tactical positioning'
      },
      
      {
        id: 'hellfire',
        name: 'Hellfire',
        icon: 'spell_shadow_shadowwordpain',
        color: '#8B0000',
        theme: 'Demonic Resilience',
        
        description: `Hellfire Pyrofiends embrace their demonic nature, gaining dark powers beyond mere fire. They convert damage into healing, summon infernal minions, and use demonic magic to sustain themselves through the Inferno Veil's drawbacks.`,
        
        playstyle: 'Self-sustain, demonic utility, balanced ascension',
        
        strengths: [
          'Best survivability of all specs',
          'Healing from damage dealt',
          'Demonic utility spells',
          'Can maintain high Inferno Levels longer'
        ],
        
        weaknesses: [
          'Lowest raw damage output',
          'More complex resource management',
          'Requires strategic spell selection',
          'Less burst damage than Inferno'
        ],
        
        passiveAbilities: [
          {
            name: 'Infernal Surge',
            tier: 'Path Passive',
            description: 'When you ascend to Inferno Level 5 or higher, your next fire spell deals an additional 2d6 fire damage.',
            sharedBy: 'All Pyrofiends'
          },
          {
            name: 'Demonic Vitality',
            tier: 'Specialization Passive',
            description: 'You heal for 25% of all fire damage you deal. Additionally, when you descend Inferno Levels (through Cooling Ember or other means), you gain temporary hit points equal to 3 times the number of levels descended.',
            uniqueTo: 'Hellfire'
          }
        ],
        
        recommendedFor: 'Players who want survivability, self-sufficiency, and a more forgiving playstyle'
      }
    ]
  },

  // Example Spells - showcasing Inferno Veil ascension mechanics
  exampleSpells: [
    // INFERNO VEIL 0-3 - Early Corruption Spells
    {
      id: 'pyro_ember_spark',
      name: 'Ember Spark',
      description: 'A minor spark of demonic fire that ignites your target.',
      spellType: 'ACTION',
      icon: 'spell_fire_flamebolt',
      school: 'Evocation',
      level: 1,

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
        durationType: 'instant'
      },

      resourceCost: {
        mana: 5,
        components: ['verbal', 'somatic'],
        verbalText: 'Ignis!',
        somaticText: 'Snap fingers to create spark'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '1d6',
        damageType: 'fire',
        scalingType: 'none'
      },

      effects: {
        damage: {
          instant: {
            formula: '1d6',
            type: 'fire'
          }
        }
      },

      specialMechanics: {
        infernoLevel: {
          required: 0,
          ascendBy: 1
        }
      },

      tags: ['fire', 'damage', 'basic', 'inferno-0']
    },

    {
      id: 'pyro_scorching_grasp',
      name: 'Scorching Grasp',
      description: 'Flames envelop your hand as you touch an enemy, burning them and leaving lingering fire.',
      spellType: 'ACTION',
      icon: 'spell_fire_flameshock',
      school: 'Evocation',
      level: 2,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'touch'
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 10,
        components: ['verbal', 'somatic'],
        verbalText: 'Ardeo!',
        somaticText: 'Grasp with burning hand'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '1d10',
        damageType: 'fire',
        scalingType: 'none'
      },

      effects: {
        damage: {
          instant: {
            formula: '1d10',
            type: 'fire'
          },
          dot: {
            formula: '1d4',
            type: 'fire',
            duration: 1,
            interval: 'turn'
          }
        }
      },

      specialMechanics: {
        infernoLevel: {
          required: 1,
          ascendBy: 1
        }
      },

      tags: ['fire', 'damage', 'dot', 'touch', 'inferno-1']
    },

    {
      id: 'pyro_fireball',
      name: 'Fireball',
      description: 'A classic explosive ball of fire that detonates on impact, damaging all nearby enemies. You absorb some of the heat, healing yourself.',
      spellType: 'ACTION',
      icon: 'spell_fire_fireball02',
      school: 'Evocation',
      level: 3,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 120,
        aoeShape: 'sphere',
        aoeParameters: {
          radius: 10
        }
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 20,
        components: ['verbal', 'somatic'],
        verbalText: 'Ignis Globus!',
        somaticText: 'Hurl ball of flame'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '3d6',
        damageType: 'fire',
        scalingType: 'none'
      },

      healingConfig: {
        formula: 'HALF_DAMAGE_DEALT',
        healingType: 'self',
        description: 'Heal for half the total fire damage dealt'
      },

      effects: {
        damage: {
          instant: {
            formula: '3d6',
            type: 'fire',
            aoe: true
          }
        },
        healing: {
          instant: {
            formula: 'HALF_DAMAGE_DEALT',
            target: 'self'
          }
        }
      },

      specialMechanics: {
        infernoLevel: {
          required: 3,
          ascendBy: 3
        }
      },

      tags: ['fire', 'damage', 'aoe', 'healing', 'inferno-3']
    },

    // INFERNO VEIL 4-6 - Demonic Power Spells
    {
      id: 'pyro_hellfire_wave',
      name: 'Hellfire Wave',
      description: 'A wave of hellish fire sweeps over your enemies, burning them intensely and leaving them smoldering.',
      spellType: 'ACTION',
      icon: 'spell_fire_sealoffire',
      school: 'Evocation',
      level: 5,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'cone',
        aoeParameters: {
          length: 30
        }
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 25,
        components: ['verbal', 'somatic'],
        verbalText: 'Infernus Unda!',
        somaticText: 'Sweep arms forward'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '4d8',
        damageType: 'fire',
        scalingType: 'none'
      },

      effects: {
        damage: {
          instant: {
            formula: '4d8',
            type: 'fire',
            aoe: true
          },
          dot: {
            formula: '1d8',
            type: 'fire',
            duration: 1,
            interval: 'turn'
          }
        }
      },

      specialMechanics: {
        infernoLevel: {
          required: 4,
          ascendBy: 2
        }
      },

      tags: ['fire', 'damage', 'aoe', 'cone', 'dot', 'inferno-4']
    },

    {
      id: 'pyro_lava_burst',
      name: 'Lava Burst',
      description: 'A burst of molten lava erupts from the ground beneath your target, dealing massive damage and splashing nearby enemies.',
      spellType: 'ACTION',
      icon: 'spell_shaman_lavaburst',
      school: 'Evocation',
      level: 6,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 80,
        aoeShape: 'sphere',
        aoeParameters: {
          radius: 15
        }
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 32,
        components: ['verbal', 'somatic', 'material'],
        verbalText: 'Terra Ignea!',
        somaticText: 'Slam fist downward',
        materialText: 'A piece of volcanic rock'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '6d6',
        damageType: 'fire',
        scalingType: 'none'
      },

      effects: {
        damage: {
          instant: {
            formula: '6d6',
            type: 'fire',
            primaryTarget: true
          },
          splash: {
            formula: '3d6',
            type: 'fire',
            aoe: true
          }
        }
      },

      specialMechanics: {
        infernoLevel: {
          required: 6,
          ascendBy: 3
        }
      },

      tags: ['fire', 'damage', 'aoe', 'splash', 'inferno-6']
    },

    // INFERNO VEIL 7-9 - Ultimate Corruption Spells
    {
      id: 'pyro_meteor_shower',
      name: 'Meteor Shower',
      description: 'Summon a shower of flaming meteors from the sky, devastating a large area and leaving burning craters.',
      spellType: 'ACTION',
      icon: 'spell_fire_meteorstorm',
      school: 'Evocation',
      level: 8,

      typeConfig: {
        castTime: 2,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 150,
        aoeShape: 'sphere',
        aoeParameters: {
          radius: 30
        }
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 45,
        components: ['verbal', 'somatic'],
        verbalText: 'Meteorus Infernus!',
        somaticText: 'Raise arms to the sky'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '8d6',
        damageType: 'fire',
        scalingType: 'none'
      },

      effects: {
        damage: {
          instant: {
            formula: '8d6',
            type: 'fire',
            aoe: true
          },
          dot: {
            formula: '2d8',
            type: 'fire',
            duration: 2,
            interval: 'turn'
          }
        }
      },

      specialMechanics: {
        infernoLevel: {
          required: 8,
          ascendBy: 2
        }
      },

      tags: ['fire', 'damage', 'aoe', 'dot', 'ultimate', 'inferno-8']
    },

    {
      id: 'pyro_infernal_avatar',
      name: 'Infernal Avatar',
      description: 'Transform into a being of pure fire, gaining immense power and immunity to fire damage. Your very presence burns those around you.',
      spellType: 'BUFF',
      icon: 'spell_fire_elemental_totem',
      school: 'Transmutation',
      level: 9,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self'
      },

      durationConfig: {
        durationType: 'minutes',
        duration: 1
      },

      resourceCost: {
        mana: 50,
        components: ['verbal', 'somatic'],
        verbalText: 'Ego Sum Ignis!',
        somaticText: 'Spread arms wide as flames engulf you'
      },

      resolution: 'NONE',

      buffConfig: {
        stats: {
          fireDamage: '+5',
          armorClass: '+3'
        },
        effects: [
          'Immunity to fire damage',
          'Enemies within 10 feet take 2d6 fire damage at start of their turn',
          'Your fire spells ignore fire resistance'
        ]
      },

      effects: {
        buff: {
          duration: 60,
          stats: {
            fireDamage: 5,
            ac: 3
          },
          immunities: ['fire'],
          aura: {
            damage: '2d6',
            type: 'fire',
            radius: 10
          }
        }
      },

      specialMechanics: {
        infernoLevel: {
          required: 9,
          ascendBy: 1
        }
      },

      tags: ['fire', 'buff', 'transformation', 'aura', 'ultimate', 'inferno-9']
    },

    // INFERNO MANAGEMENT - Ascend and Descend Dynamically
    {
      id: 'pyro_cooling_ember',
      name: 'Cooling Ember',
      description: 'A calming spell to manage your Inferno Levels. The demonic fire within you dims, healing your wounds as corruption fades.',
      spellType: 'ACTION',
      icon: 'spell_fire_twilightflamebreath',
      school: 'Abjuration',
      level: 1,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self'
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 10,
        components: ['verbal', 'somatic'],
        verbalText: 'Pax Ignis',
        somaticText: 'Place hand over heart'
      },

      resolution: 'DICE',

      healingConfig: {
        formula: '1d6_PER_LEVEL_REDUCED',
        healingType: 'self',
        description: 'Heal 1d6 per Inferno Level reduced'
      },

      effects: {
        healing: {
          instant: {
            formula: '1d6',
            multiplier: 'INFERNO_LEVELS_REDUCED',
            target: 'self'
          }
        }
      },

      specialMechanics: {
        infernoLevel: {
          required: 0,
          descendBy: '1d4'
        }
      },

      tags: ['fire', 'healing', 'utility', 'inferno-management']
    },

    {
      id: 'pyro_flame_step',
      name: 'Flame Step',
      description: 'Teleport a short distance in a burst of fire, leaving flames at your departure and arrival points.',
      spellType: 'ACTION',
      icon: 'ability_mage_firestarter',
      school: 'Conjuration',
      level: 2,

      typeConfig: {
        castTime: 0,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self'
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 15,
        components: ['verbal'],
        verbalText: 'Saltus Ignis!'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '1d6',
        damageType: 'fire',
        scalingType: 'none'
      },

      utilityConfig: {
        type: 'teleport',
        distance: 30,
        unit: 'feet'
      },

      effects: {
        utility: {
          teleport: {
            distance: 30,
            unit: 'feet'
          }
        },
        damage: {
          instant: {
            formula: '1d6',
            type: 'fire',
            targets: 'adjacent_at_start_and_end'
          }
        }
      },

      specialMechanics: {
        infernoLevel: {
          required: 0,
          ascendBy: 1
        }
      },

      tags: ['fire', 'utility', 'teleport', 'mobility']
    }
  ]
};

