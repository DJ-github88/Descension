/**
 * Arcanoneer Class Data
 * 
 * Complete class information for the Arcanoneer - a master of elemental sphere combination
 * inspired by Magicka's dynamic spell crafting system.
 */

export const ARCANONEER_DATA = {
  id: 'arcanoneer',
  name: 'Arcanoneer',
  icon: 'fas fa-atom',
  role: 'Damage/Utility',

  // Overview section
  overview: {
    title: 'The Arcanoneer',
    subtitle: 'Master of Elemental Sphere Combination',
    
    description: `The Arcanoneer is a master of runes and arcane engineering, capable of combining different elemental spheres to create a vast array of magical effects. Unlike traditional spellcasters who memorize specific spells, Arcanoneers harness raw elemental energy that manifests randomly each turn, then combine these spheres in creative ways to craft spells, gadgets, and traps on the fly. This system provides immense versatility and strategic depth, allowing the Arcanoneer to adapt to any situation.`,
    
    roleplayIdentity: {
      title: 'Roleplay Identity',
      content: `Arcanoneers are arcane engineers and elemental theorists who view magic as a science of combination and reaction. They see the eight fundamental elements as building blocks that can be mixed like alchemical reagents to produce infinite variations. Their power comes not from memorization, but from understanding how elements interact and react with each other.

In roleplay, Arcanoneers often carry notebooks filled with combination formulas, experiment with new sphere mixtures, and approach magic with scientific curiosity. They may mutter element names while casting, trace combination patterns in the air, or become excited when discovering new synergies.

Common Arcanoneer archetypes include:
- **The Arcane Scientist**: Treats magic like chemistry, constantly experimenting
- **The Combat Engineer**: Builds magical gadgets and battlefield devices
- **The Chaos Theorist**: Embraces randomness and finds patterns in disorder
- **The Elemental Savant**: Seeks to master all eight fundamental elements`
    },
    
    combatRole: {
      title: 'Combat Role',
      content: `**Primary Role**: Versatile damage dealer and utility caster

**Combat Identity**: The Arcanoneer excels at adapting to any situation by combining randomly generated elemental spheres into the perfect spell for the moment. They can deal massive AoE damage, provide healing support, create battlefield control effects, or unleash devastating single-target attacks - all depending on which spheres they roll each turn.

**Tactical Approach**:
- **Turn-by-Turn Adaptation**: Each turn brings new spheres, requiring quick thinking
- **Combination Mastery**: Understanding which 2, 3, or 4-sphere combos to use
- **Sphere Banking**: Saving specific spheres for powerful future combinations
- **Risk Management**: Balancing immediate needs vs. saving for bigger combos

**Strengths**:
- Unmatched versatility (can cast any element type)
- Powerful AoE damage with multi-element combinations
- Can adapt to any enemy weakness
- Scales incredibly well with game knowledge

**Weaknesses**:
- Highly dependent on RNG (random sphere generation)
- Requires extensive system knowledge to optimize
- Cannot guarantee specific spells when needed
- Complex decision-making each turn`
    },
    
    playstyle: {
      title: 'Playstyle',
      content: `**Moment-to-Moment Gameplay**:

Each turn, you roll 4d8 to generate your elemental spheres. You then decide:
1. Do I spend these spheres immediately for a 2-sphere combo?
2. Do I save them to combine with next turn's spheres for a 3 or 4-sphere ultimate?
3. Which combination best fits the current tactical situation?

**Example Turn Sequence**:
- **Turn 1**: Roll 4d8 → Get Fire, Fire, Ice, Healing
  - Option A: Cast Fire+Fire for pure fire damage
  - Option B: Cast Fire+Ice for Steam Burst (mixed damage)
  - Option C: Save all 4 for next turn to build toward a 4-sphere ultimate
  
- **Turn 2**: Roll 4d8 → Get Arcane, Shadow, Nature, Chaos
  - If you saved Turn 1 spheres, you now have 8 spheres total
  - Can cast a 4-sphere ultimate like "Elemental Fury" (Arcane+Fire+Ice+Nature)
  - Or cast multiple 2-sphere combos

**Mastery Comes From**:
- Memorizing the 8x8 combination matrix
- Knowing when to save vs. spend spheres
- Recognizing powerful 3 and 4-sphere recipes
- Adapting combinations to enemy weaknesses`
    }
  },
  
  // Resource System
  resourceSystem: {
    title: 'Sphere Generation & Elemental Combination',
    subtitle: 'Dynamic Spell Crafting System',
    
    description: `The Arcanoneer's power comes from generating random elemental spheres each turn and combining them to create spells. This system is inspired by Magicka's element combination mechanics, where different element pairings create unique magical effects.`,
    
    mechanics: {
      title: 'How It Works',
      content: `**Sphere Generation**:
At the start of each turn, roll 4d8. Each die result generates one elemental sphere:
- 1 = Arcane
- 2 = Holy  
- 3 = Shadow
- 4 = Fire
- 5 = Ice
- 6 = Nature (Thunder)
- 7 = Healing
- 8 = Chaos

**Sphere Banking**:
You can save spheres from previous turns. There is no maximum limit, but spheres persist only during combat. All spheres are lost when combat ends.

**Casting Spells**:
Spend 2, 3, or 4 spheres to cast a spell:
- **2 Spheres**: Cast any combination from the 8x8 matrix (64 possible spells)
- **3 Spheres**: Cast special recipe spells (limited specific combinations)
- **4 Spheres**: Cast ultimate recipe spells (limited specific combinations)

**Mana Costs**:
- 2-Sphere Spells: 5 mana
- 3-Sphere Spells: 10 mana  
- 4-Sphere Spells: 15 mana`
    },
    
    sphereGenerationTable: {
      title: 'Sphere Generation (Roll 4d8)',
      headers: ['d8 Roll', 'Element', 'Theme', 'Primary Effects'],
      rows: [
        ['1', 'Arcane', 'Raw Magic', 'Force damage, disorientation, magical effects'],
        ['2', 'Holy', 'Divine Light', 'Holy damage, healing, stunning, protection'],
        ['3', 'Shadow', 'Darkness/Necrotic', 'Shadow damage, curses, life drain, debuffs'],
        ['4', 'Fire', 'Flames', 'Fire damage, burning, ignition, explosions'],
        ['5', 'Ice', 'Frost', 'Ice damage, freezing, slowing, disorientation'],
        ['6', 'Nature', 'Thunder/Vines', 'Nature damage, restraint, poison, terrain'],
        ['7', 'Healing', 'Life Energy', 'Healing, regeneration, buffs, cleansing'],
        ['8', 'Chaos', 'Unpredictability', 'Random effects, wild magic, variable damage']
      ]
    },
    
    strategicConsiderations: {
      title: 'Strategic Considerations',
      content: `**When to Save Spheres**:
- You rolled elements that don't synergize well
- You're building toward a specific 3 or 4-sphere recipe
- Combat is going well and you can afford to invest in future power
- You want specific elements for next turn's combinations

**When to Spend Immediately**:
- You rolled a powerful 2-sphere combination
- You need immediate damage or healing
- You're low on mana and can't afford bigger combos
- The tactical situation requires immediate action

**Combination Priority**:
- **Pure Element Combos** (Fire+Fire, Ice+Ice): High focused damage
- **Opposing Elements** (Fire+Ice, Holy+Shadow): Unique mixed effects
- **Healing Combos**: Essential for party support
- **Chaos Combos**: High risk, high reward, unpredictable

**Advanced Tactics**:
- Track which spheres you're banking for multi-turn setups
- Learn enemy resistances and adapt element choices
- Coordinate with party for combo opportunities
- Save Chaos spheres for desperate situations`
    }
  },

  // Specializations
  specializations: {
    title: 'Arcanoneer Specializations',
    subtitle: 'Three Paths of Elemental Mastery',

    description: `Every Arcanoneer chooses one of three specializations that define their approach to sphere combination. Each specialization focuses on a dramatically different aspect of the sphere system, creating distinct playstyles.`,

    specs: [
      {
        id: 'elementalist',
        name: 'Elementalist',
        icon: 'spell_fire_flamebolt',
        color: '#FF4500',
        theme: 'Pure Element Mastery',

        description: `Elementalists focus on mastering specific elements and pure element combinations. Rather than mixing everything together, they perfect the art of elemental purity, gaining tremendous power when using the same element multiple times. They can reroll unwanted spheres to fish for their preferred elements.`,

        playstyle: 'Pure element focus, rerolling spheres, elemental specialization, consistent damage',

        strengths: [
          'Can reroll up to 2 spheres per turn',
          'Pure element combos (Fire+Fire, Ice+Ice, etc.) deal +50% damage',
          'Gain resistance to your most-used element type',
          'More consistent and predictable than other specs',
          'Excellent against enemies weak to specific elements'
        ],

        weaknesses: [
          'Less versatile than other specs',
          'Struggles against enemies resistant to your favored elements',
          'Cannot leverage chaos and mixed-element synergies as well',
          'Rerolls cost 1 mana per sphere rerolled',
          'Limited by element availability'
        ],

        passiveAbilities: [
          {
            name: 'Sphere Resonance',
            tier: 'Path Passive',
            description: 'When you generate 3 or more spheres of the same element in one turn, gain 1d4 temporary mana.',
            sharedBy: 'All Arcanoneers'
          },
          {
            name: 'Elemental Purity',
            tier: 'Specialization Passive',
            description: 'You can reroll up to 2 spheres per turn (costs 1 mana per reroll). Pure element combinations (same element twice) deal 50% bonus damage. You gain resistance to the element type you\'ve used most this combat.',
            uniqueTo: 'Elementalist'
          }
        ],

        recommendedFor: 'Players who want consistency, elemental specialization, and predictable power'
      },

      {
        id: 'chaosweaver',
        name: 'Chaosweaver',
        icon: 'spell_shadow_charm',
        color: '#9400D3',
        theme: 'Embrace Randomness',

        description: `Chaosweavers embrace the unpredictable nature of sphere generation, turning randomness into raw power. They roll extra spheres, make Chaos combinations devastatingly powerful, and can trigger wild magic surges that create unexpected battlefield effects. Where others see chaos, they see opportunity.`,

        playstyle: 'High variance, chaos magic, wild magic surges, explosive unpredictability',

        strengths: [
          'Roll 5d8 for spheres instead of 4d8 (one extra sphere per turn)',
          'All Chaos combinations deal double damage',
          'Chaos sphere combos trigger Wild Magic Surge (roll on table)',
          'Can turn any sphere into Chaos (once per turn, costs 2 mana)',
          'Highest damage potential of all specs'
        ],

        weaknesses: [
          'Extremely unpredictable and unreliable',
          'Wild Magic Surges can backfire',
          'Cannot reroll or manipulate spheres',
          'Difficult to plan multi-turn strategies',
          'High risk, high reward playstyle'
        ],

        passiveAbilities: [
          {
            name: 'Sphere Resonance',
            tier: 'Path Passive',
            description: 'When you generate 3 or more spheres of the same element in one turn, gain 1d4 temporary mana.',
            sharedBy: 'All Arcanoneers'
          },
          {
            name: 'Chaos Mastery',
            tier: 'Specialization Passive',
            description: 'Roll 5d8 for sphere generation (instead of 4d8). All Chaos element combinations deal double damage. When you use a Chaos sphere in any combination, roll on the Wild Magic Surge table for an additional random effect. Once per turn, you can convert any sphere to Chaos (costs 2 mana).',
            uniqueTo: 'Chaosweaver'
          }
        ],

        recommendedFor: 'Players who enjoy high-risk gameplay, randomness, and explosive unpredictable power'
      },

      {
        id: 'runesmith',
        name: 'Runesmith',
        icon: 'inv_misc_rune_01',
        color: '#4169E1',
        theme: 'Precise Control & Manipulation',

        description: `Runesmiths are masters of sphere manipulation and control. They can swap sphere types, store more spheres efficiently, and manipulate their combinations with surgical precision. Where Elementalists focus on purity and Chaosweavers embrace randomness, Runesmiths control every aspect of their magic.`,

        playstyle: 'Sphere manipulation, precise control, efficient banking, tactical mastery',

        strengths: [
          'Can swap any 2 spheres for different elements (once per turn, costs 3 mana)',
          'Can store up to 12 spheres (instead of unlimited but inefficient)',
          'Reduce mana cost of 3-sphere spells by 3 (10→7 mana)',
          'Can "lock" 1 sphere type to guarantee it next turn',
          'Most consistent and controllable spec'
        ],

        weaknesses: [
          'No damage bonuses (pure utility/control)',
          'Sphere manipulation is expensive (mana costs)',
          'Requires extensive planning and foresight',
          'Less explosive than other specs',
          'Complexity can be overwhelming'
        ],

        passiveAbilities: [
          {
            name: 'Sphere Resonance',
            tier: 'Path Passive',
            description: 'When you generate 3 or more spheres of the same element in one turn, gain 1d4 temporary mana.',
            sharedBy: 'All Arcanoneers'
          },
          {
            name: 'Runic Precision',
            tier: 'Specialization Passive',
            description: 'Once per turn, you can swap any 2 spheres for different element types (costs 3 mana total). You can store up to 12 spheres efficiently. 3-sphere spells cost 3 less mana (10→7). You can "lock" 1 sphere type at end of turn to guarantee that element appears in your next roll.',
            uniqueTo: 'Runesmith'
          }
        ],

        recommendedFor: 'Players who want precise control, tactical planning, and sphere manipulation mastery'
      }
    ]
  },

  // Example Spells - organized by combination tier
  exampleSpells: [
    // ========================================
    // 2-SPHERE COMBINATIONS
    // Representative examples from the 8x8 matrix
    // ========================================

    // Pure Element Combos
    {
      id: 'arc_arcane_detonation',
      name: 'Arcane Detonation',
      description: 'Arcane + Arcane: Pure arcane explosion dealing force damage and disorienting enemies.',
      spellType: 'ACTION',
      icon: 'spell_arcane_blast',
      school: 'Evocation',
      level: 2,
      sphereCost: ['Arcane', 'Arcane'],

      typeConfig: {
        castTime: 1,
        castTimeType: 'ACTION'
      },

      targetingConfig: {
        targetingType: 'ground',
        rangeType: 'ranged',
        rangeDistance: 60,
        aoeType: 'circle',
        aoeSize: 20
      },

      durationConfig: {
        durationType: 'instant',
        description: 'Instant explosion'
      },

      resourceCost: {
        mana: 5,
        spheres: ['Arcane', 'Arcane'],
        components: ['verbal', 'somatic'],
        verbalText: 'Arcanum Detonare!',
        somaticText: 'Clap hands together to release arcane energy'
      },

      resolution: 'SAVE',

      saveConfig: {
        saveType: 'dexterity',
        saveDC: 15,
        onSaveEffect: 'half'
      },

      damageConfig: {
        formula: '3d6',
        damageType: 'force',
        scalingType: 'none'
      },

      effects: {
        damage: {
          instant: {
            formula: '3d6',
            type: 'force'
          }
        },
        debuff: {
          type: 'disoriented',
          duration: '1 round',
          description: 'Targets are disoriented for 1 round'
        }
      },

      specialMechanics: {
        sphereCombo: {
          enabled: true,
          elements: ['Arcane', 'Arcane'],
          comboType: 'pure',
          elementalistBonus: '+50% damage (4d6+3 instead of 3d6)'
        }
      },

      tags: ['2-sphere', 'arcane', 'force', 'aoe', 'pure-element', 'elementalist'],
      flavorText: 'Raw arcane energy explodes outward, overwhelming the senses of those caught in the blast.'
    },

    {
      id: 'arc_firestorm',
      name: 'Firestorm',
      description: 'Fire + Fire: Massive fire explosion that ignites everything in the area.',
      spellType: 'ACTION',
      icon: 'spell_fire_flameshock',
      school: 'Evocation',
      level: 3,
      sphereCost: ['Fire', 'Fire'],

      typeConfig: {
        castTime: 1,
        castTimeType: 'ACTION'
      },

      targetingConfig: {
        targetingType: 'ground',
        rangeType: 'ranged',
        rangeDistance: 60,
        aoeType: 'circle',
        aoeSize: 30
      },

      durationConfig: {
        durationType: 'instant',
        description: 'Instant explosion with lingering fire'
      },

      resourceCost: {
        mana: 5,
        spheres: ['Fire', 'Fire'],
        components: ['verbal', 'somatic'],
        verbalText: 'Ignis Tempestas!',
        somaticText: 'Raise both hands and unleash flames'
      },

      resolution: 'SAVE',

      saveConfig: {
        saveType: 'dexterity',
        saveDC: 15,
        onSaveEffect: 'half'
      },

      damageConfig: {
        formula: '3d8',
        damageType: 'fire',
        scalingType: 'none'
      },

      effects: {
        damage: {
          instant: {
            formula: '3d8',
            type: 'fire'
          },
          overTime: {
            formula: '1d6',
            type: 'fire',
            duration: '1 minute',
            description: 'Targets take 1d6 fire damage each round for 1 minute'
          }
        }
      },

      specialMechanics: {
        sphereCombo: {
          enabled: true,
          elements: ['Fire', 'Fire'],
          comboType: 'pure',
          elementalistBonus: '+50% damage (4d8+4 instead of 3d8)'
        }
      },

      tags: ['2-sphere', 'fire', 'aoe', 'damage-over-time', 'pure-element', 'elementalist'],
      flavorText: 'A raging inferno engulfs the battlefield, leaving nothing but ash and embers.'
    },

    // Mixed Element Combos
    {
      id: 'arc_steam_burst',
      name: 'Steam Burst',
      description: 'Fire + Ice: Alternating fire and ice creates a disorienting steam explosion.',
      spellType: 'ACTION',
      icon: 'spell_frost_frostbolt',
      school: 'Evocation',
      level: 2,
      sphereCost: ['Fire', 'Ice'],

      typeConfig: {
        castTime: 1,
        castTimeType: 'ACTION'
      },

      targetingConfig: {
        targetingType: 'cone',
        rangeType: 'cone',
        rangeDistance: 20,
        aoeType: 'cone',
        aoeSize: 20
      },

      durationConfig: {
        durationType: 'instant',
        description: 'Instant burst'
      },

      resourceCost: {
        mana: 5,
        spheres: ['Fire', 'Ice'],
        components: ['verbal', 'somatic'],
        verbalText: 'Vapor Eruptio!',
        somaticText: 'Combine opposing hands of fire and ice'
      },

      resolution: 'SAVE',

      saveConfig: {
        saveType: 'constitution',
        saveDC: 15,
        onSaveEffect: 'half'
      },

      damageConfig: {
        formula: '2d6+2d6',
        damageType: 'fire and cold',
        scalingType: 'none'
      },

      effects: {
        damage: {
          instant: {
            formula: '2d6',
            type: 'fire'
          }
        },
        damage2: {
          instant: {
            formula: '2d6',
            type: 'cold'
          }
        },
        debuff: {
          type: 'disoriented',
          duration: '1 round',
          description: 'Targets disoriented for 1 round'
        }
      },

      tags: ['2-sphere', 'fire', 'ice', 'mixed-element', 'control'],
      flavorText: 'Opposing elements collide in a scalding burst of steam that blinds and burns.'
    },

    {
      id: 'arc_celestial_ray',
      name: 'Celestial Ray',
      description: 'Arcane + Holy: A beam of pure magical light that damages enemies and heals allies.',
      spellType: 'ACTION',
      icon: 'spell_holy_holybolt',
      school: 'Evocation',
      level: 2,
      sphereCost: ['Arcane', 'Holy'],

      typeConfig: {
        castTime: 1,
        castTimeType: 'ACTION'
      },

      targetingConfig: {
        targetingType: 'line',
        rangeType: 'line',
        rangeDistance: 60,
        aoeType: 'line',
        aoeSize: 60
      },

      durationConfig: {
        durationType: 'instant',
        description: 'Instant beam'
      },

      resourceCost: {
        mana: 5,
        spheres: ['Arcane', 'Holy'],
        components: ['verbal', 'somatic'],
        verbalText: 'Lux Arcanum!',
        somaticText: 'Point finger to fire beam of light'
      },

      resolution: 'SAVE',

      saveConfig: {
        saveType: 'constitution',
        saveDC: 15,
        onSaveEffect: 'half'
      },

      damageConfig: {
        formula: '2d8',
        damageType: 'radiant',
        scalingType: 'none'
      },

      effects: {
        damage: {
          instant: {
            formula: '2d8',
            type: 'radiant'
          }
        },
        healing: {
          instant: {
            formula: '2d8',
            description: 'Heals allies in the line for 2d8 HP'
          }
        },
        buff: {
          type: 'temporary-hp',
          amount: '1d4',
          duration: 'instant',
          description: 'Allies gain 1d4 temporary HP'
        }
      },

      tags: ['2-sphere', 'arcane', 'holy', 'mixed-element', 'healing', 'support'],
      flavorText: 'Divine arcane energy flows in a brilliant ray, harming the wicked and healing the righteous.'
    },

    {
      id: 'arc_pandemonium',
      name: 'Pandemonium',
      description: 'Chaos + Chaos: Ultimate chaos spell with completely unpredictable devastating effects.',
      spellType: 'ACTION',
      icon: 'spell_shadow_shadowwordpain',
      school: 'Evocation',
      level: 4,
      sphereCost: ['Chaos', 'Chaos'],

      typeConfig: {
        castTime: 1,
        castTimeType: 'ACTION'
      },

      targetingConfig: {
        targetingType: 'ground',
        rangeType: 'ranged',
        rangeDistance: 60,
        aoeType: 'circle',
        aoeSize: 40
      },

      durationConfig: {
        durationType: 'instant',
        description: 'Instant chaos'
      },

      resourceCost: {
        mana: 5,
        spheres: ['Chaos', 'Chaos'],
        components: ['verbal', 'somatic'],
        verbalText: 'PANDEMONIUM!',
        somaticText: 'Wild gestures releasing chaotic energy'
      },

      resolution: 'SAVE',

      saveConfig: {
        saveType: 'dexterity',
        saveDC: 15,
        onSaveEffect: 'half'
      },

      rollableTable: {
        enabled: true,
        name: 'Pandemonium Effect',
        description: 'Roll 1d8 to determine the chaotic effect',
        resolutionType: 'DICE',
        resolutionConfig: {
          diceType: 'd8'
        },
        entries: [
          { roll: 1, name: 'Force Explosion', effect: '4d6 force damage to all in area' },
          { roll: 2, name: 'Holy Nova', effect: '3d8 holy damage to enemies, heals allies 3d8' },
          { roll: 3, name: 'Shadow Burst', effect: '3d8 shadow damage, enemies cursed' },
          { roll: 4, name: 'Inferno', effect: '4d6 fire damage, ignites for 1d6/round' },
          { roll: 5, name: 'Blizzard', effect: '4d6 ice damage, freezes targets' },
          { roll: 6, name: 'Nature\'s Wrath', effect: '4d6 nature damage, creates difficult terrain' },
          { roll: 7, name: 'Mass Healing', effect: 'Heals all allies 4d8 HP' },
          { roll: 8, name: 'Reality Tear', effect: 'Grants +4 AC and resistance to all damage for 1 minute to allies' }
        ]
      },

      specialMechanics: {
        sphereCombo: {
          enabled: true,
          elements: ['Chaos', 'Chaos'],
          comboType: 'chaos',
          chaosweaverBonus: 'Double damage on all effects, roll twice on table and apply both'
        }
      },

      tags: ['2-sphere', 'chaos', 'random', 'unpredictable', 'chaosweaver'],
      flavorText: 'Reality itself fractures as pure chaos is unleashed upon the world.'
    },

    // ========================================
    // 3-SPHERE SPECIAL RECIPES
    // Powerful combinations requiring specific elements
    // ========================================

    {
      id: 'arc_glacial_blessing',
      name: 'Glacial Blessing',
      description: 'Holy + Ice + Nature: A blessing that heals allies and freezes enemies in protective icy terrain.',
      spellType: 'ACTION',
      icon: 'spell_frost_frostarmor',
      school: 'Abjuration',
      level: 3,
      sphereCost: ['Holy', 'Ice', 'Nature'],

      typeConfig: {
        castTime: 1,
        castTimeType: 'ACTION'
      },

      targetingConfig: {
        targetingType: 'ground',
        rangeType: 'ranged',
        rangeDistance: 60,
        aoeType: 'circle',
        aoeSize: 30
      },

      durationConfig: {
        durationType: 'minutes',
        duration: 1,
        description: 'Terrain lasts 1 minute'
      },

      resourceCost: {
        mana: 10,
        spheres: ['Holy', 'Ice', 'Nature'],
        components: ['verbal', 'somatic'],
        verbalText: 'Benedictio Glacialis!',
        somaticText: 'Spread arms to create blessed frozen terrain'
      },

      resolution: 'SAVE',

      saveConfig: {
        saveType: 'constitution',
        saveDC: 15,
        onSaveEffect: 'half'
      },

      damageConfig: {
        formula: '3d6',
        damageType: 'cold',
        scalingType: 'none'
      },

      effects: {
        healing: {
          instant: {
            formula: '4d8',
            description: 'Heals all allies in area for 4d8 HP'
          }
        },
        damage: {
          instant: {
            formula: '3d6',
            type: 'cold'
          }
        },
        terrain: {
          type: 'difficult-terrain',
          duration: '1 minute',
          description: 'Creates difficult icy terrain for 1 minute'
        }
      },

      specialMechanics: {
        sphereCombo: {
          enabled: true,
          elements: ['Holy', 'Ice', 'Nature'],
          comboType: '3-sphere-recipe',
          runesmithBonus: 'Costs 7 mana instead of 10'
        }
      },

      tags: ['3-sphere', 'holy', 'ice', 'nature', 'healing', 'terrain', 'runesmith'],
      flavorText: 'Divine frost spreads across the ground, blessing allies while freezing foes in place.'
    },

    {
      id: 'arc_thermal_surge',
      name: 'Thermal Surge',
      description: 'Fire + Ice + Healing: Alternating fire and ice that heals allies while devastating enemies with thermal shock.',
      spellType: 'ACTION',
      icon: 'spell_fire_twilightflamebreath',
      school: 'Evocation',
      level: 3,
      sphereCost: ['Fire', 'Ice', 'Healing'],

      typeConfig: {
        castTime: 1,
        castTimeType: 'ACTION'
      },

      targetingConfig: {
        targetingType: 'cone',
        rangeType: 'cone',
        rangeDistance: 30,
        aoeType: 'cone',
        aoeSize: 30
      },

      durationConfig: {
        durationType: 'instant',
        description: 'Instant surge'
      },

      resourceCost: {
        mana: 10,
        spheres: ['Fire', 'Ice', 'Healing'],
        components: ['verbal', 'somatic'],
        verbalText: 'Thermalis Unda!',
        somaticText: 'Sweep arms in wave motion'
      },

      resolution: 'SAVE',

      saveConfig: {
        saveType: 'dexterity',
        saveDC: 15,
        onSaveEffect: 'half'
      },

      damageConfig: {
        formula: '4d6+4d6',
        damageType: 'fire and cold',
        scalingType: 'none'
      },

      effects: {
        damage: {
          instant: {
            formula: '4d6',
            type: 'fire'
          }
        },
        damage2: {
          instant: {
            formula: '4d6',
            type: 'cold'
          }
        },
        healing: {
          instant: {
            formula: '3d8',
            description: 'Heals allies within the cone for 3d8 HP'
          }
        }
      },

      specialMechanics: {
        sphereCombo: {
          enabled: true,
          elements: ['Fire', 'Ice', 'Healing'],
          comboType: '3-sphere-recipe',
          runesmithBonus: 'Costs 7 mana instead of 10'
        }
      },

      tags: ['3-sphere', 'fire', 'ice', 'healing', 'mixed-element', 'runesmith'],
      flavorText: 'A wave of alternating heat and cold washes over the battlefield, healing friends and burning foes.'
    },

    {
      id: 'arc_primal_arcane_tempest',
      name: 'Primal Arcane Tempest',
      description: 'Arcane + Chaos + Nature: A tempest of chaotic arcane and nature magic that devastates and rejuvenates.',
      spellType: 'ACTION',
      icon: 'spell_nature_cyclone',
      school: 'Evocation',
      level: 4,
      sphereCost: ['Arcane', 'Chaos', 'Nature'],

      typeConfig: {
        castTime: 1,
        castTimeType: 'ACTION'
      },

      targetingConfig: {
        targetingType: 'ground',
        rangeType: 'ranged',
        rangeDistance: 60,
        aoeType: 'circle',
        aoeSize: 40
      },

      durationConfig: {
        durationType: 'minutes',
        duration: 1,
        description: 'Terrain lasts 1 minute'
      },

      resourceCost: {
        mana: 10,
        spheres: ['Arcane', 'Chaos', 'Nature'],
        components: ['verbal', 'somatic'],
        verbalText: 'Tempestas Primordialis!',
        somaticText: 'Spin arms to create swirling tempest'
      },

      resolution: 'SAVE',

      saveConfig: {
        saveType: 'dexterity',
        saveDC: 15,
        onSaveEffect: 'half'
      },

      damageConfig: {
        formula: '5d6+5d6',
        damageType: 'force and nature',
        scalingType: 'none'
      },

      effects: {
        damage: {
          instant: {
            formula: '5d6',
            type: 'force'
          }
        },
        damage2: {
          instant: {
            formula: '5d6',
            type: 'nature'
          }
        },
        healing: {
          instant: {
            formula: '4d8',
            description: 'Heals allies within radius for 4d8 HP'
          }
        },
        terrain: {
          type: 'difficult-terrain',
          duration: '1 minute',
          description: 'Creates chaotic difficult terrain for 1 minute'
        }
      },

      specialMechanics: {
        sphereCombo: {
          enabled: true,
          elements: ['Arcane', 'Chaos', 'Nature'],
          comboType: '3-sphere-recipe',
          runesmithBonus: 'Costs 7 mana instead of 10',
          chaosweaverBonus: 'Double damage on all effects'
        }
      },

      tags: ['3-sphere', 'arcane', 'chaos', 'nature', 'aoe', 'terrain', 'chaosweaver'],
      flavorText: 'Primal chaos and arcane power merge into a devastating storm that reshapes the battlefield.'
    },

    // ========================================
    // 4-SPHERE ULTIMATE RECIPES
    // The most powerful combinations
    // ========================================

    {
      id: 'arc_elemental_fury',
      name: 'Elemental Fury',
      description: 'Arcane + Fire + Ice + Nature: Unleashes a devastating combination of all four elements that ravages enemies.',
      spellType: 'ACTION',
      icon: 'spell_nature_wispsplode',
      school: 'Evocation',
      level: 5,
      sphereCost: ['Arcane', 'Fire', 'Ice', 'Nature'],

      typeConfig: {
        castTime: 1,
        castTimeType: 'ACTION'
      },

      targetingConfig: {
        targetingType: 'ground',
        rangeType: 'ranged',
        rangeDistance: 60,
        aoeType: 'circle',
        aoeSize: 40
      },

      durationConfig: {
        durationType: 'minutes',
        duration: 1,
        description: 'Terrain lasts 1 minute'
      },

      resourceCost: {
        mana: 15,
        spheres: ['Arcane', 'Fire', 'Ice', 'Nature'],
        components: ['verbal', 'somatic'],
        verbalText: 'ELEMENTUM FURIA!',
        somaticText: 'Slam fists together releasing all elements'
      },

      resolution: 'SAVE',

      saveConfig: {
        saveType: 'dexterity',
        saveDC: 15,
        onSaveEffect: 'half'
      },

      damageConfig: {
        formula: '6d6+6d6+6d6+6d6',
        damageType: 'force, fire, cold, and nature',
        scalingType: 'none'
      },

      effects: {
        damage: {
          instant: {
            formula: '6d6',
            type: 'force'
          }
        },
        damage2: {
          instant: {
            formula: '6d6',
            type: 'fire'
          }
        },
        damage3: {
          instant: {
            formula: '6d6',
            type: 'cold'
          }
        },
        damage4: {
          instant: {
            formula: '6d6',
            type: 'nature'
          }
        },
        terrain: {
          type: 'difficult-terrain',
          duration: '1 minute',
          description: 'Creates elemental difficult terrain for 1 minute'
        }
      },

      specialMechanics: {
        sphereCombo: {
          enabled: true,
          elements: ['Arcane', 'Fire', 'Ice', 'Nature'],
          comboType: '4-sphere-ultimate',
          description: 'Ultimate 4-element combination'
        }
      },

      tags: ['4-sphere', 'arcane', 'fire', 'ice', 'nature', 'ultimate', 'aoe'],
      flavorText: 'The four fundamental elements converge in a cataclysmic explosion of raw power.'
    },

    {
      id: 'arc_divine_cataclysm',
      name: 'Divine Cataclysm',
      description: 'Holy + Shadow + Healing + Chaos: A cataclysmic event dealing holy and shadow damage while healing allies.',
      spellType: 'ACTION',
      icon: 'spell_holy_prayerofhealing',
      school: 'Evocation',
      level: 5,
      sphereCost: ['Holy', 'Shadow', 'Healing', 'Chaos'],

      typeConfig: {
        castTime: 1,
        castTimeType: 'ACTION'
      },

      targetingConfig: {
        targetingType: 'ground',
        rangeType: 'ranged',
        rangeDistance: 60,
        aoeType: 'circle',
        aoeSize: 40
      },

      durationConfig: {
        durationType: 'instant',
        description: 'Instant cataclysm'
      },

      resourceCost: {
        mana: 15,
        spheres: ['Holy', 'Shadow', 'Healing', 'Chaos'],
        components: ['verbal', 'somatic'],
        verbalText: 'CATACLYSMUS DIVINUS!',
        somaticText: 'Raise hands to sky and bring down divine wrath'
      },

      resolution: 'SAVE',

      saveConfig: {
        saveType: 'wisdom',
        saveDC: 15,
        onSaveEffect: 'half'
      },

      damageConfig: {
        formula: '6d8+6d8',
        damageType: 'radiant and necrotic',
        scalingType: 'none'
      },

      effects: {
        damage: {
          instant: {
            formula: '6d8',
            type: 'radiant'
          }
        },
        damage2: {
          instant: {
            formula: '6d8',
            type: 'necrotic'
          }
        },
        healing: {
          instant: {
            formula: '5d8',
            description: 'Heals all allies in area for 5d8 HP'
          }
        },
        debuff: {
          type: 'stunned',
          duration: '1 round',
          description: 'Enemies are stunned for 1 round'
        }
      },

      specialMechanics: {
        sphereCombo: {
          enabled: true,
          elements: ['Holy', 'Shadow', 'Healing', 'Chaos'],
          comboType: '4-sphere-ultimate',
          chaosweaverBonus: 'Double damage and healing',
          description: 'Ultimate divine/shadow combination'
        }
      },

      tags: ['4-sphere', 'holy', 'shadow', 'healing', 'chaos', 'ultimate', 'chaosweaver'],
      flavorText: 'Light and darkness collide in a divine cataclysm that judges all within its reach.'
    },

    {
      id: 'arc_void_inferno',
      name: 'Void Inferno',
      description: 'Arcane + Shadow + Fire + Chaos: A chaotic inferno that consumes everything with void energy.',
      spellType: 'ACTION',
      icon: 'spell_shadow_shadowfiend',
      school: 'Evocation',
      level: 5,
      sphereCost: ['Arcane', 'Shadow', 'Fire', 'Chaos'],

      typeConfig: {
        castTime: 1,
        castTimeType: 'ACTION'
      },

      targetingConfig: {
        targetingType: 'ground',
        rangeType: 'ranged',
        rangeDistance: 60,
        aoeType: 'circle',
        aoeSize: 40
      },

      durationConfig: {
        durationType: 'instant',
        description: 'Instant void explosion'
      },

      resourceCost: {
        mana: 15,
        spheres: ['Arcane', 'Shadow', 'Fire', 'Chaos'],
        components: ['verbal', 'somatic'],
        verbalText: 'INFERNO VACUI!',
        somaticText: 'Tear open reality to unleash void flames'
      },

      resolution: 'SAVE',

      saveConfig: {
        saveType: 'dexterity',
        saveDC: 15,
        onSaveEffect: 'half'
      },

      damageConfig: {
        formula: '6d6+6d6+6d6',
        damageType: 'force, necrotic, and fire',
        scalingType: 'none'
      },

      effects: {
        damage: {
          instant: {
            formula: '6d6',
            type: 'force'
          }
        },
        damage2: {
          instant: {
            formula: '6d6',
            type: 'necrotic'
          }
        },
        damage3: {
          instant: {
            formula: '6d6',
            type: 'fire'
          }
        },
        debuff: {
          type: 'blinded',
          duration: '1 round',
          description: 'Enemies are blinded for 1 round'
        },
        debuff2: {
          type: 'stunned',
          duration: '1 round',
          description: 'Enemies are stunned for 1 round'
        }
      },

      specialMechanics: {
        sphereCombo: {
          enabled: true,
          elements: ['Arcane', 'Shadow', 'Fire', 'Chaos'],
          comboType: '4-sphere-ultimate',
          chaosweaverBonus: 'Double damage, enemies also take 2d6 void damage per round for 3 rounds',
          description: 'Ultimate destruction combination'
        }
      },

      tags: ['4-sphere', 'arcane', 'shadow', 'fire', 'chaos', 'ultimate', 'chaosweaver'],
      flavorText: 'A tear in reality unleashes void flames that consume all matter and energy.'
    }
  ]
};


