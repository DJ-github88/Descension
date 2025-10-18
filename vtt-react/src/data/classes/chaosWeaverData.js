/**
 * Chaos Weaver Class Data
 * 
 * Complete class information for the Chaos Weaver - a master of unpredictability
 * who harnesses chaotic magic and random effects for devastating results.
 */

export const CHAOS_WEAVER_DATA = {
  id: 'chaos-weaver',
  name: 'Chaos Weaver',
  icon: 'fas fa-dice',
  role: 'Damage',

  // Overview section
  overview: {
    title: 'The Chaos Weaver',
    subtitle: 'Master of Unpredictability',
    
    description: `The Chaos Weaver is a master of unpredictability, weaving spells that produce a wide range of random effects. Embracing the chaotic nature of magic, Chaos Weavers thrive in the thrill of randomness and the potential for spectacular results. They manipulate the fabric of reality itself, creating bursts of mayhem and disorder on the battlefield. As the most powerful damage class in the game, Chaos Weavers can unleash devastating effects—though the chaos they create affects friend and foe alike.`,
    
    roleplayIdentity: {
      title: 'Roleplay Identity',
      content: `Chaos Weavers are individuals who have embraced the fundamental unpredictability of magic itself. They reject the rigid structures and predictable formulas of traditional spellcasting, instead channeling raw, unfiltered magical energy that manifests in wildly different ways each time it's cast.

**The Chaotic Philosophy**: Chaos Weavers believe that true power comes from accepting—and exploiting—the inherent randomness of the universe. They see patterns in chaos that others miss, finding opportunity in uncertainty.

**Common Archetypes**:
- **The Mad Experimenter**: Constantly testing the limits of reality, documenting each chaotic result with scientific fascination
- **The Entropy Cultist**: Worships the forces of disorder and decay, seeing chaos as the natural state of the universe
- **The Reality Gambler**: Treats every spell like a roll of the dice, addicted to the thrill of not knowing what will happen
- **The Accidental Savant**: Stumbled into chaos magic by accident and discovered a natural affinity for the unpredictable
- **The Chaos Prophet**: Believes they can see the future in the patterns of random events, using chaos to divine truth

**Personality Traits**: Chaos Weavers tend to be unpredictable, spontaneous, and comfortable with uncertainty. They often have a dark sense of humor about the consequences of their magic and may seem reckless or insane to more cautious spellcasters.`
    },
    
    combatRole: {
      title: 'Combat Role',
      content: `**Primary Role**: Highest Burst Damage in the Game

The Chaos Weaver holds the distinction of being the most powerful damage dealer in the entire game, surpassing even the Pyrofiend in raw destructive potential. However, this power comes with significant risk—chaos magic is indiscriminate and can affect allies, enemies, and the caster themselves.

**Damage Output**: Unmatched burst damage through random effects that can multiply damage, trigger additional effects, or create devastating combinations

**Battlefield Control**: Creates zones of chaos that alter terrain, teleport creatures, and apply random buffs/debuffs

**Utility**: Unpredictable utility that can solve problems in unexpected ways—or create new problems entirely

**Risk Management**: Requires careful positioning and timing to maximize beneficial chaos while minimizing friendly fire

**Team Dynamics**:
- Works best with adaptable teams who can capitalize on random opportunities
- Requires allies who can handle unexpected situations (sudden teleports, terrain changes, etc.)
- Benefits from tanks who can protect the party from chaotic backfire
- Synergizes with support classes who can mitigate negative random effects`
    },
    
    playstyle: {
      title: 'Playstyle',
      content: `**Embrace the Chaos**: Chaos Weavers excel when players lean into the unpredictability rather than fighting it

**Core Gameplay Loop**:
1. **Generate Mayhem Modifiers** through specific abilities
2. **Cast chaotic spells** that roll on random effect tables
3. **Spend Mayhem Modifiers** to nudge results toward desired outcomes
4. **Adapt to results** and capitalize on unexpected opportunities

**Strategic Depth**: While chaos magic appears random, skilled Chaos Weavers use Mayhem Modifiers to influence outcomes, turning unpredictability into a strategic advantage. Knowing when to spend modifiers and when to let chaos reign is the mark of a master.

**High Risk, Highest Reward**: Every spell is a gamble, but the potential payoff is unmatched. A lucky roll can end encounters instantly, while an unlucky one might require quick thinking to survive.

**Adaptability Required**: Players must think on their feet, turning negative results into opportunities and capitalizing on positive ones before they fade.

**Perfect For**: Players who enjoy randomness, creativity, adaptability, and don't mind occasional spectacular failures in pursuit of spectacular successes.`
    }
  },
  
  // Resource System
  resourceSystem: {
    title: 'Mayhem Modifiers',
    subtitle: 'Influencing the Chaos',
    
    description: `Chaos Weavers harness "Mayhem Modifiers" to influence the randomness of their spells. As they cast specific abilities, they accumulate Mayhem Modifiers, which they can then spend to adjust the outcomes of their chaotic magic. This system allows Chaos Weavers to embrace the chaotic nature of their abilities while maintaining a degree of strategic control.`,
    
    mechanics: {
      title: 'How It Works',
      content: `**Generating Mayhem Modifiers**:

Chaos Weavers generate Mayhem Modifiers through specific abilities designed for this purpose. These modifiers represent their attunement to the chaotic energies they wield.

- **Chaotic Infusion** (4 mana): Generate 1d4 Mayhem Modifiers
- **Wild Conduit** (6 mana): Generate 2d4 Mayhem Modifiers  
- **Unpredictable Surge** (5 mana): Generate 1d6 Mayhem Modifiers

**Maximum Capacity**: You can hold up to 20 Mayhem Modifiers at once. Any excess is lost.

**Persistence**: Mayhem Modifiers persist between combats until spent or until you complete a long rest.

**Using Mayhem Modifiers**:

Mayhem Modifiers can be spent to adjust the results of a roll on a random effects table. Each Mayhem Modifier spent allows you to move the result up or down by 1 on the table.

- **Spend 1 Modifier**: Adjust result by ±1
- **Spend Multiple**: Each additional modifier adjusts by another ±1
- **No Limit**: You can spend as many modifiers as you want on a single roll (up to your current total)

**Example**: You roll a 15 on the Wild Magic Surge table. You have 8 Mayhem Modifiers. You could:
- Spend 0 modifiers and accept result #15
- Spend 3 modifiers to change it to result #12 or #18
- Spend 8 modifiers to change it to result #7 or #23

This gives Chaos Weavers strategic control over chaos—you can save modifiers for critical moments or spend freely to avoid disasters.`
    },
    
    mayhemModifierTable: {
      title: 'Mayhem Modifier Strategic Values',
      headers: ['Modifier Count', 'Strategic Value', 'Recommended Usage'],
      rows: [
        ['0-2', 'Low Control', 'Generate more modifiers, avoid high-stakes chaos spells'],
        ['3-5', 'Moderate Control', 'Can adjust results by a few positions, use on medium-impact spells'],
        ['6-10', 'Good Control', 'Significant influence over outcomes, safe to use major chaos spells'],
        ['11-15', 'High Control', 'Can reach most desired results, ideal for critical moments'],
        ['16-20', 'Maximum Control', 'Near-complete control over chaos, use ultimate abilities freely']
      ]
    },
    
    chaosIntensityTable: {
      title: 'Chaos Intensity Levels',
      headers: ['Intensity', 'Description', 'Risk Level'],
      rows: [
        ['Minor Chaos', 'Small random effects, minimal impact (d4-d6 tables)', 'Low - Safe to use without modifiers'],
        ['Moderate Chaos', 'Noticeable random effects, can swing encounters (d10-d12 tables)', 'Medium - Consider spending 2-4 modifiers'],
        ['Major Chaos', 'Powerful random effects, game-changing results (d20 tables)', 'High - Spend 5-10 modifiers for safety'],
        ['Wild Magic', 'Extreme random effects, reality-altering consequences (d100 tables)', 'Extreme - Spend 10+ modifiers or embrace chaos'],
        ['Chaos Storm', 'Multiple simultaneous random effects, unpredictable cascades', 'Critical - Maximum modifiers recommended']
      ]
    },
    
    strategicConsiderations: {
      title: 'Strategic Considerations',
      content: `**When to Generate Modifiers**:
- At the start of combat before chaos spells are needed
- During lulls in combat when you have spare actions
- Before boss encounters or critical moments
- When your modifier count is below 5

**When to Spend Modifiers**:
- To avoid catastrophic negative results (like harming allies)
- To guarantee powerful positive results in critical moments
- To fine-tune results for specific tactical needs
- When you're near the 20 modifier cap and would waste generation

**When to Let Chaos Reign**:
- When you have few modifiers and the risk is acceptable
- When any result on the table would be beneficial
- When you want maximum unpredictability for roleplay
- When the potential reward outweighs the risk

**Resource Management**: Balance modifier generation with damage output. Spending too many turns generating modifiers reduces your damage, but having no modifiers makes chaos spells dangerous to use.`
    }
  },
  
  // Specializations
  specializations: {
    title: 'Chaos Weaver Specializations',
    subtitle: 'Three Paths of Chaotic Power',
    
    description: `Every Chaos Weaver chooses one of three specializations that define their approach to chaos magic. Each specialization offers unique passive abilities and influences your spell selection and playstyle.`,
    
    specs: [
      {
        id: 'reality-bending',
        name: 'Reality Bending',
        icon: 'spell_arcane_polymorphchicken',
        color: '#9B59B6',
        theme: 'Spatial Manipulation',
        
        description: `Reality Bending Chaos Weavers specialize in manipulating the fabric of reality itself. They excel at terrain transformation, teleportation, and altering the fundamental properties of objects and spaces. Their chaos is more controlled and tactical, focusing on battlefield manipulation.`,
        
        playstyle: 'Tactical chaos, terrain control, spatial manipulation, moderate risk',
        
        strengths: [
          'Superior battlefield control through terrain transformation',
          'Teleportation and repositioning abilities',
          'Can alter object properties for creative solutions',
          'More predictable chaos with tactical applications'
        ],
        
        weaknesses: [
          'Lower raw damage than other specs',
          'Requires good spatial awareness',
          'Effects can be negated by enemy movement',
          'Less effective in confined spaces'
        ],
        
        passiveAbility: {
          name: 'Chaos Attunement',
          description: 'All Chaos Weavers gain +1 Mayhem Modifier whenever they roll a natural 1 or natural 20 on any d20 roll.',
          icon: 'spell_shadow_charm'
        },
        
        specPassive: {
          name: 'Reality Anchor',
          description: 'When you use a spell that transforms terrain or teleports creatures, gain +2 Mayhem Modifiers. Additionally, you can spend 3 Mayhem Modifiers to choose the exact location of teleportation effects instead of them being random.',
          icon: 'spell_arcane_portalorgrimmar'
        },
        
        keyAbilities: [
          'Fractured Realms - Create rifts with random planar effects',
          'Reality Swap - Swap positions with random creatures',
          'Whimsical Alteration - Alter object properties unpredictably'
        ]
      },

      {
        id: 'wild-magic',
        name: 'Wild Magic',
        icon: 'spell_nature_wispsplode',
        color: '#E74C3C',
        theme: 'Pure Chaos',

        description: `Wild Magic Chaos Weavers embrace pure, unfiltered chaos. They specialize in wild magic surges, unpredictable spell effects, and reality-warping phenomena. Their magic is the most dangerous and unpredictable, but also has the highest potential for spectacular results.`,

        playstyle: 'Maximum chaos, highest risk/reward, unpredictable outcomes, pure randomness',

        strengths: [
          'Access to the most powerful random effects',
          'Highest damage potential in the game',
          'Can trigger multiple simultaneous chaos effects',
          'Unpredictability makes them hard to counter'
        ],

        weaknesses: [
          'Highest risk of friendly fire and self-harm',
          'Least control over outcomes',
          'Can create chaotic situations that harm the party',
          'Requires team coordination to manage chaos'
        ],

        passiveAbility: {
          name: 'Chaos Attunement',
          description: 'All Chaos Weavers gain +1 Mayhem Modifier whenever they roll a natural 1 or natural 20 on any d20 roll.',
          icon: 'spell_shadow_charm'
        },

        specPassive: {
          name: 'Wild Surge',
          description: 'Whenever you cast a spell, roll a d20. On a 1, trigger a Wild Magic Surge (roll on the Wild Magic Surge table). On a 20, your spell deals double damage or has double duration. Additionally, you generate +1 Mayhem Modifier whenever a Wild Magic Surge occurs.',
          icon: 'spell_fire_felrainoffire'
        },

        keyAbilities: [
          'Mist of Mayhem - AOE that triggers Wild Magic Surge for all creatures',
          'Arcane Roulette - d10 random spell effect',
          'Pandemonic Pulse - d20 chaos bolt with varying properties'
        ]
      },

      {
        id: 'entropy',
        name: 'Entropy',
        icon: 'spell_shadow_shadetruesight',
        color: '#2C3E50',
        theme: 'Decay and Destruction',

        description: `Entropy Chaos Weavers harness the forces of decay, disorder, and destruction. They specialize in entropic damage, armor reduction, and abilities that break down matter and energy. Their chaos is more focused on pure destructive power with debilitating side effects.`,

        playstyle: 'Sustained damage, debuffs, armor shredding, controlled destruction',

        strengths: [
          'Consistent high damage output',
          'Powerful armor reduction and debuffs',
          'Less reliant on extreme randomness',
          'Effective against heavily armored targets'
        ],

        weaknesses: [
          'Less spectacular burst damage than Wild Magic',
          'Fewer utility options',
          'Entropic effects can harm allies in close quarters',
          'Limited crowd control'
        ],

        passiveAbility: {
          name: 'Chaos Attunement',
          description: 'All Chaos Weavers gain +1 Mayhem Modifier whenever they roll a natural 1 or natural 20 on any d20 roll.',
          icon: 'spell_shadow_charm'
        },

        specPassive: {
          name: 'Entropic Decay',
          description: 'Your chaos damage ignores 25% of enemy armor. Additionally, enemies damaged by your chaos spells have their armor reduced by 1 (stacking up to 5) for the rest of combat. When an enemy reaches 5 stacks, gain +3 Mayhem Modifiers.',
          icon: 'spell_shadow_antishadow'
        },

        keyAbilities: [
          'Entropic Blast - High damage with armor reduction',
          'Chaos Burst - Random damage type burst',
          'Discordant Strike - Weapon infusion with random damage'
        ]
      }
    ]
  },

  // Example Spells - showcasing the spell wizard system with rollable tables
  exampleSpells: [
    // Basic Chaos Spells
    {
      id: 'chaos_burst',
      name: 'Chaos Burst',
      description: 'Send forth a burst of chaotic energy that deals 2d6 damage of a random type to a target.',
      spellType: 'ACTION',
      icon: 'spell_shadow_shadowwordpain',
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
        verbalText: 'Chaos!',
        somaticText: 'Thrust hand forward with crackling energy'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '2d6',
        damageType: 'random',
        scalingType: 'none'
      },

      rollableTable: {
        enabled: true,
        name: 'Random Damage Type',
        description: 'Roll to determine the damage type',
        resolutionType: 'DICE',
        resolutionConfig: {
          diceType: 'd6'
        },
        entries: [
          { range: { min: 1, max: 1 }, customName: 'Acid', effect: 'Acid damage - corrodes armor' },
          { range: { min: 2, max: 2 }, customName: 'Fire', effect: 'Fire damage - ignites flammables' },
          { range: { min: 3, max: 3 }, customName: 'Cold', effect: 'Cold damage - slows target' },
          { range: { min: 4, max: 4 }, customName: 'Lightning', effect: 'Lightning damage - chains to nearby enemies' },
          { range: { min: 5, max: 5 }, customName: 'Thunder', effect: 'Thunder damage - deafens target' },
          { range: { min: 6, max: 6 }, customName: 'Force', effect: 'Force damage - pushes target back 5 feet' }
        ]
      },

      effects: {
        damage: {
          instant: {
            formula: '2d6',
            type: 'random',
            primaryTarget: true
          }
        }
      },

      specialMechanics: {
        mayhemModifiers: {
          canSpend: true,
          adjustsTable: true,
          description: 'Spend Mayhem Modifiers to adjust the damage type result by ±1 per modifier'
        }
      },

      tags: ['chaos', 'damage', 'random', 'basic'],
      flavorText: 'The most basic chaos spell - unpredictable, but reliable in its unpredictability.'
    },

    // Mayhem Modifier Generation
    {
      id: 'chaotic_infusion',
      name: 'Chaotic Infusion',
      description: 'Infuse your magic with chaotic energy, generating 1d4 Mayhem Modifiers.',
      spellType: 'ACTION',
      icon: 'spell_shadow_charm',
      school: 'Transmutation',
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
        durationType: 'instant'
      },

      resourceCost: {
        mana: 4,
        components: ['verbal', 'somatic'],
        verbalText: 'Embrace chaos!',
        somaticText: 'Draw chaotic energy into yourself'
      },

      resolution: 'DICE',

      effects: {
        resource: {
          type: 'mayhemModifiers',
          formula: '1d4',
          description: 'Generate 1d4 Mayhem Modifiers'
        }
      },

      specialMechanics: {
        mayhemModifiers: {
          generated: '1d4',
          description: 'Roll 1d4 and gain that many Mayhem Modifiers (max 20 total)'
        }
      },

      tags: ['chaos', 'utility', 'resource-generation'],
      flavorText: 'Channel the raw energy of chaos to fuel your unpredictable magic.'
    },

    {
      id: 'wild_conduit',
      name: 'Wild Conduit',
      description: 'Channel the raw power of chaos through yourself, generating 2d4 Mayhem Modifiers.',
      spellType: 'ACTION',
      icon: 'spell_fire_felrainoffire',
      school: 'Transmutation',
      level: 3,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
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
        components: ['verbal', 'somatic'],
        verbalText: 'I am the conduit of chaos!',
        somaticText: 'Spread arms wide as chaotic energy flows through you'
      },

      resolution: 'DICE',

      effects: {
        resource: {
          type: 'mayhemModifiers',
          formula: '2d4',
          description: 'Generate 2d4 Mayhem Modifiers'
        }
      },

      specialMechanics: {
        mayhemModifiers: {
          generated: '2d4',
          description: 'Roll 2d4 and gain that many Mayhem Modifiers (max 20 total)'
        }
      },

      tags: ['chaos', 'utility', 'resource-generation'],
      flavorText: 'Become a living conduit for chaotic forces, storing their power for later use.'
    },

    // Rollable Table Showcase - Arcane Roulette
    {
      id: 'arcane_roulette',
      name: 'Arcane Roulette',
      description: 'Spin the wheel of magic and unleash an unpredictable spell effect. Roll a d10 to determine the outcome.',
      spellType: 'ACTION',
      icon: 'spell_arcane_arcane04',
      school: 'Evocation',
      level: 2,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'varies',
        rangeType: 'ranged',
        rangeDistance: 60
      },

      durationConfig: {
        durationType: 'varies'
      },

      resourceCost: {
        mana: 5,
        components: ['verbal', 'somatic', 'material'],
        verbalText: 'Let fate decide!',
        somaticText: 'Spin an imaginary wheel',
        materialText: 'A small die or coin'
      },

      resolution: 'DICE',

      rollableTable: {
        enabled: true,
        name: 'Arcane Roulette Effects',
        description: 'Spin the wheel of magic - roll d10 for random spell effect',
        resolutionType: 'DICE',
        resolutionConfig: {
          diceType: 'd10'
        },
        entries: [
          { range: { min: 1, max: 1 }, customName: 'Fireball', effect: '3d6 fire damage in 20-foot radius' },
          { range: { min: 2, max: 2 }, customName: 'Healing Wave', effect: 'Heal target for 2d8 HP' },
          { range: { min: 3, max: 3 }, customName: 'Blink', effect: 'Teleport target 30 feet in random direction' },
          { range: { min: 4, max: 4 }, customName: 'Polymorph', effect: 'Transform target into a sheep for 1 round' },
          { range: { min: 5, max: 5 }, customName: 'Chain Lightning', effect: '2d8 lightning damage, chains to 2 targets' },
          { range: { min: 6, max: 6 }, customName: 'Time Slow', effect: 'Target moves at half speed for 2 rounds' },
          { range: { min: 7, max: 7 }, customName: 'Haste', effect: 'Target gains extra action for 2 rounds' },
          { range: { min: 8, max: 8 }, customName: 'Summon', effect: '1d4 random creatures appear (neutral alignment)' },
          { range: { min: 9, max: 9 }, customName: 'Dispel Magic', effect: 'Remove all magical effects from target' },
          { range: { min: 10, max: 10 }, customName: 'Wild Magic Surge', effect: 'Roll on Wild Magic Surge table' }
        ]
      },

      effects: {
        random: {
          tableRoll: true,
          description: 'Effect varies based on d10 roll'
        }
      },

      specialMechanics: {
        mayhemModifiers: {
          canSpend: true,
          adjustsTable: true,
          description: 'Spend Mayhem Modifiers to adjust the result by ±1 per modifier spent'
        }
      },

      tags: ['chaos', 'random', 'utility', 'damage', 'table'],
      flavorText: 'Why choose one spell when you can let chaos choose for you?'
    },

    // Pandemonic Pulse - d20 Table
    {
      id: 'pandemonic_pulse',
      name: 'Pandemonic Pulse',
      description: 'Unleash a chaotic bolt of energy that changes its properties based on the roll of a d20. The bolt\'s damage type and additional effects vary dramatically with the roll.',
      spellType: 'ACTION',
      icon: 'spell_shadow_shadowwordpain',
      school: 'Evocation',
      level: 4,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 90
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 12,
        components: ['verbal', 'somatic'],
        verbalText: 'Pandemonium!',
        somaticText: 'Hurl a bolt of swirling chaotic energy'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: 'varies',
        damageType: 'varies',
        scalingType: 'none'
      },

      rollableTable: {
        enabled: true,
        name: 'Pandemonic Pulse Effects',
        description: 'Roll d20 to determine the chaotic bolt\'s damage type and power',
        resolutionType: 'DICE',
        resolutionConfig: {
          diceType: 'd20'
        },
        entries: [
          { range: { min: 1, max: 1 }, customName: 'Backfire', effect: 'You take 3d6 force damage' },
          { range: { min: 2, max: 3 }, customName: 'Weak Fire', effect: '2d6 fire damage' },
          { range: { min: 4, max: 5 }, customName: 'Cold Blast', effect: '3d6 cold damage, slows target' },
          { range: { min: 6, max: 7 }, customName: 'Lightning', effect: '3d6 lightning damage' },
          { range: { min: 8, max: 9 }, customName: 'Acid', effect: '3d6 acid damage, -2 AC for 2 rounds' },
          { range: { min: 10, max: 11 }, customName: 'Force', effect: '4d6 force damage' },
          { range: { min: 12, max: 13 }, customName: 'Necrotic', effect: '4d6 necrotic damage, heal for half' },
          { range: { min: 14, max: 15 }, customName: 'Radiant', effect: '4d6 radiant damage, blinds for 1 round' },
          { range: { min: 16, max: 17 }, customName: 'Psychic', effect: '5d6 psychic damage, confuses target' },
          { range: { min: 18, max: 19 }, customName: 'Pure Chaos', effect: '6d6 chaos damage, ignores resistance' },
          { range: { min: 20, max: 20 }, customName: 'Critical Chaos', effect: '8d6 damage of all types combined' }
        ]
      },

      effects: {
        damage: {
          instant: {
            formula: 'varies',
            type: 'varies',
            primaryTarget: true
          }
        }
      },

      specialMechanics: {
        mayhemModifiers: {
          canSpend: true,
          adjustsTable: true,
          description: 'Spend Mayhem Modifiers to adjust the d20 result by ±1 per modifier'
        }
      },

      tags: ['chaos', 'damage', 'random', 'high-power', 'table'],
      flavorText: 'A bolt of pure pandemonium - it could fizzle, or it could devastate.'
    },

    // Mist of Mayhem - Wild Magic Surge Table Showcase
    {
      id: 'mist_of_mayhem',
      name: 'Mist of Mayhem',
      description: 'Release a swirling mist in a 30-foot radius. Each creature within the mist must roll on the Wild Magic Surge table, potentially receiving buffs, debuffs, or whimsical effects.',
      spellType: 'ACTION',
      icon: 'spell_shadow_twilight',
      school: 'Conjuration',
      level: 5,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'aoe',
        aoeType: 'sphere',
        aoeSize: 30,
        rangeType: 'centered',
        validTargets: ['enemy', 'ally', 'self']
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 8,
        components: ['verbal', 'somatic', 'material'],
        verbalText: 'Let chaos reign!',
        somaticText: 'Sweep arms in a circle',
        materialText: 'A vial of swirling mist'
      },

      resolution: 'DICE',

      rollableTable: {
        enabled: true,
        name: 'Wild Magic Surge',
        description: 'Each creature in the mist rolls separately on this table',
        resolutionType: 'DICE',
        resolutionConfig: {
          diceType: 'd33'
        },
        entries: [
          { range: { min: 1, max: 1 }, customName: 'Ethereal Instability', effect: 'Disadvantage on all rolls for 1 minute' },
          { range: { min: 2, max: 2 }, customName: 'Chaotic Asphyxiation', effect: 'Muted and suffocating, 1d4 damage/round (DC 18 Int save to end)' },
          { range: { min: 3, max: 3 }, customName: 'Spatial Displacement', effect: 'All creatures teleport randomly within 60 yards' },
          { range: { min: 4, max: 4 }, customName: 'Life Flux', effect: 'HP randomly redistributed among allies within 60 feet' },
          { range: { min: 5, max: 5 }, customName: 'Chaos Nova', effect: 'Random polymorph, blind, deaf, or ethereal for 1d4 rounds' },
          { range: { min: 6, max: 6 }, customName: 'Chicken Flock', effect: '1d4 chickens appear and scatter' },
          { range: { min: 7, max: 7 }, customName: 'Arcane Amplification', effect: 'All spells within 40 feet deal +1 dice tier until next turn' },
          { range: { min: 8, max: 8 }, customName: 'Winged Mutation', effect: 'Random creature gains flight for 1 minute' },
          { range: { min: 9, max: 9 }, customName: 'Vampiric Surge', effect: 'Next attack drains HP equal to damage dealt' },
          { range: { min: 10, max: 10 }, customName: 'Confetti Explosion', effect: 'Harmless colorful confetti everywhere' },
          { range: { min: 11, max: 11 }, customName: 'Gravity Well', effect: 'Half speed in 50-foot radius (DC 12 Str save)' },
          { range: { min: 12, max: 12 }, customName: 'Mysterious Box', effect: 'A box appears with random contents (roll d4)' },
          { range: { min: 13, max: 13 }, customName: 'Dance Fever', effect: 'Must dance until DC 12 Wis save' },
          { range: { min: 14, max: 14 }, customName: 'Banana Summoning', effect: 'A banana appears and falls' },
          { range: { min: 15, max: 15 }, customName: 'Wolf Summoning', effect: '2 neutral wolves attack nearest target' },
          { range: { min: 16, max: 16 }, customName: 'Vulnerability Roulette', effect: 'Gain vulnerability to random damage type for 1 minute' },
          { range: { min: 17, max: 17 }, customName: 'Resistance Roulette', effect: 'Gain resistance to random damage type for 1 minute' },
          { range: { min: 18, max: 18 }, customName: 'Spontaneous Growth', effect: 'Plants double in size for 1 minute' },
          { range: { min: 19, max: 19 }, customName: 'Boulder Barrage', effect: 'Boulder falls at random location, 3d6 bludgeoning damage' },
          { range: { min: 20, max: 20 }, customName: 'Speed Surge', effect: '+10 feet movement until end of next turn' },
          { range: { min: 21, max: 21 }, customName: 'Gravitational Pull', effect: 'Restrained until DC 12 Str check (1d4 damage/round)' },
          { range: { min: 22, max: 22 }, customName: 'Gravitational Attraction', effect: 'Pulled 5 feet toward caster (DC 12 Str resist)' },
          { range: { min: 23, max: 23 }, customName: 'Healing Rain', effect: 'Heal 1d6 HP at start of turn for 3 rounds' },
          { range: { min: 24, max: 24 }, customName: 'Fire Bolt Barrage', effect: '2d6 fire damage (DC 12 Dex save)' },
          { range: { min: 25, max: 25 }, customName: 'Llama Shower', effect: 'Llamas rain down, 2d8 bludgeoning damage (DC 15 Dex save)' },
          { range: { min: 26, max: 26 }, customName: 'Deep Freeze', effect: 'Encased in ice, stunned, +5 AC, heal 1d6/turn until ice melts' },
          { range: { min: 27, max: 27 }, customName: 'Gravity Toss', effect: 'Flung 20 feet up, 1d6 falling damage (2d6 if hit ceiling)' },
          { range: { min: 28, max: 28 }, customName: 'Elemental Flux', effect: 'All spells change to random magical damage type for 1 minute' },
          { range: { min: 29, max: 29 }, customName: 'Realm of Death', effect: 'Transported to Death Realm, play Death\'s game (d6 rolls)' },
          { range: { min: 30, max: 30 }, customName: 'Rabbit\'s Wrath', effect: '2d4 rabbits appear, explode for 4d8 lightning if damaged' },
          { range: { min: 31, max: 31 }, customName: 'Toxic Miasma', effect: 'Poison gas spreads, 1d6 poison damage/turn' },
          { range: { min: 32, max: 32 }, customName: 'Mystical Mist', effect: 'Random effect (heal 1d8, +10 speed, +1d8 melee, or blind)' },
          { range: { min: 33, max: 33 }, customName: 'Ghostly Blade', effect: 'Summon spectral weapon with necrotic damage' }
        ]
      },

      effects: {
        aoe: {
          radius: 30,
          affectsAllies: true,
          affectsEnemies: true,
          affectsSelf: true,
          description: 'Each creature rolls separately on Wild Magic Surge table'
        }
      },

      specialMechanics: {
        mayhemModifiers: {
          canSpend: true,
          adjustsTable: true,
          perCreature: true,
          description: 'You can spend Mayhem Modifiers to adjust the result for each creature individually'
        }
      },

      tags: ['chaos', 'aoe', 'wild-magic', 'random', 'ultimate', 'table'],
      flavorText: 'Pure chaos incarnate - anything can happen when the mist descends.'
    },

    // Fractured Realms - Terrain Transformation
    {
      id: 'fractured_realms',
      name: 'Fractured Realms',
      description: 'Tear open multiple small rifts to other planes around you. Enemies stepping within 5 feet of a rift must roll on the Terrain Transformation table for random effects.',
      spellType: 'ACTION',
      icon: 'spell_arcane_portalorgrimmar',
      school: 'Conjuration',
      level: 6,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'aoe',
        aoeType: 'sphere',
        aoeSize: 50,
        rangeType: 'centered',
        validTargets: ['ground']
      },

      durationConfig: {
        durationType: 'rounds',
        duration: 3
      },

      resourceCost: {
        mana: 10,
        components: ['verbal', 'somatic', 'material'],
        verbalText: 'Realms fracture!',
        somaticText: 'Tear the air with both hands',
        materialText: 'A shard of planar crystal'
      },

      resolution: 'SAVE',

      saveConfig: {
        saveType: 'dexterity',
        saveDC: 15,
        onSaveEffect: 'negates'
      },

      rollableTable: {
        enabled: true,
        name: 'Terrain Transformation',
        description: 'Creatures entering rift zones trigger this table',
        resolutionType: 'DICE',
        resolutionConfig: {
          diceType: 'd10'
        },
        entries: [
          { range: { min: 1, max: 1 }, customName: 'Brimstone Cracks', effect: 'Difficult terrain, DC 15 Con save or 1d4 damage and prone' },
          { range: { min: 2, max: 2 }, customName: 'Thicket Growth', effect: 'Dense underbrush, DC 12 Dex check or restrained (DC 12 Str to escape)' },
          { range: { min: 3, max: 3 }, customName: 'Quicksand Pits', effect: 'DC 15 Str save or sink (DC 15 Str each turn to escape)' },
          { range: { min: 4, max: 4 }, customName: 'Crystal Shards', effect: '1d6 piercing damage when moving through (DC 15 Dex negates)' },
          { range: { min: 5, max: 5 }, customName: 'Frozen Glaze', effect: 'DC 12 Dex check or slip prone and take 1d4 bludgeoning' },
          { range: { min: 6, max: 6 }, customName: 'Ground Uprising', effect: 'DC 14 Dex save or knocked prone, 2d4 wall dimensions' },
          { range: { min: 7, max: 7 }, customName: 'Arcane Resonance', effect: 'DC 13 Dex save or lifted off ground for 1 round (disadvantage on actions)' },
          { range: { min: 8, max: 8 }, customName: 'Mystic Mists', effect: 'Visibility 5 feet, DC 15 Wis check to see through (disadvantage until end of turn)' },
          { range: { min: 9, max: 9 }, customName: 'Ethereal Echoes', effect: 'Ghostly images flicker, DC 14 Wis save or paranoia' },
          { range: { min: 10, max: 10 }, customName: 'Chaos Conduit', effect: 'Roll twice on this table for simultaneous transformations' }
        ]
      },

      effects: {
        zone: {
          duration: 3,
          radius: 50,
          triggersOnEntry: true,
          description: 'Creates multiple rift zones that trigger terrain transformations'
        }
      },

      specialMechanics: {
        mayhemModifiers: {
          canSpend: true,
          adjustsTable: true,
          description: 'Spend Mayhem Modifiers to adjust terrain transformation results'
        }
      },

      tags: ['chaos', 'terrain', 'zone', 'control', 'table'],
      flavorText: 'Reality itself fractures, bringing pieces of other planes into this one.'
    },

    // Reality Swap
    {
      id: 'reality_swap',
      name: 'Reality Swap',
      description: 'Swap places with a random creature within 30 feet. If the rolled creature is an ally, both gain advantage on their next attack. If an enemy, both are stunned for 1 round.',
      spellType: 'ACTION',
      icon: 'spell_arcane_blink',
      school: 'Conjuration',
      level: 4,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'random',
        rangeType: 'ranged',
        rangeDistance: 30,
        validTargets: ['creature']
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 8,
        components: ['verbal', 'somatic'],
        verbalText: 'Switch!',
        somaticText: 'Point at random direction'
      },

      resolution: 'AUTOMATIC',

      effects: {
        teleport: {
          swapPositions: true,
          randomTarget: true,
          range: 30
        },
        conditional: {
          ifAlly: {
            buff: {
              advantage: 'next_attack',
              duration: 1
            }
          },
          ifEnemy: {
            debuff: {
              stunned: true,
              duration: 1,
              affectsBoth: true
            }
          }
        }
      },

      specialMechanics: {
        mayhemModifiers: {
          canSpend: true,
          influenceTarget: true,
          description: 'Spend 5 Mayhem Modifiers to choose the target instead of it being random'
        }
      },

      tags: ['chaos', 'teleport', 'utility', 'random'],
      flavorText: 'Who needs to choose targets when reality can choose for you?'
    },

    // Entropic Blast
    {
      id: 'entropic_blast',
      name: 'Entropic Blast',
      description: 'Release a blast of entropic energy that deals 3d6 necrotic damage to a target and reduces their AC by 2 for 1 minute.',
      spellType: 'ACTION',
      icon: 'spell_shadow_antishadow',
      school: 'Necromancy',
      level: 5,

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
        mana: 11,
        components: ['verbal', 'somatic'],
        verbalText: 'Decay!',
        somaticText: 'Thrust palm forward with dark energy'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '3d6',
        damageType: 'necrotic',
        scalingType: 'none'
      },

      debuffConfig: {
        stats: {
          armorClass: '-2'
        },
        duration: 10,
        description: 'Target\'s armor decays, reducing AC by 2'
      },

      effects: {
        damage: {
          instant: {
            formula: '3d6',
            type: 'necrotic',
            primaryTarget: true
          }
        },
        debuff: {
          duration: 10,
          stats: {
            ac: -2
          },
          description: 'Entropic decay weakens armor'
        }
      },

      specialMechanics: {
        entropy: {
          armorReduction: 2,
          stacksWith: 'entropic_decay_passive',
          description: 'Works with Entropy spec passive for additional armor shredding'
        }
      },

      tags: ['chaos', 'damage', 'necrotic', 'debuff', 'entropy'],
      flavorText: 'The forces of entropy break down matter itself, weakening defenses.'
    },

    // Chaotic Vortex - Ultimate
    {
      id: 'chaotic_vortex',
      name: 'Chaotic Vortex',
      description: 'Draw upon the raw power of chaos to create a fluctuating vortex of energy that affects all creatures within a 30-foot radius. The nature of the vortex changes each round, providing a mix of beneficial and detrimental effects.',
      spellType: 'ACTION',
      icon: 'spell_fire_felrainoffire',
      school: 'Evocation',
      level: 8,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'aoe',
        aoeType: 'sphere',
        aoeSize: 30,
        rangeType: 'ranged',
        rangeDistance: 60,
        validTargets: ['all']
      },

      durationConfig: {
        durationType: 'rounds',
        duration: 3
      },

      resourceCost: {
        mana: 15,
        components: ['verbal', 'somatic', 'material'],
        verbalText: 'Chaos eternal!',
        somaticText: 'Spin in a circle with arms outstretched',
        materialText: 'A vial of pure chaos essence'
      },

      resolution: 'DICE',

      rollableTable: {
        enabled: true,
        name: 'Chaotic Vortex Effects',
        description: 'Roll at the start of each round to determine the vortex\'s effect',
        resolutionType: 'DICE',
        resolutionConfig: {
          diceType: 'd6'
        },
        entries: [
          { range: { min: 1, max: 1 }, customName: 'Damage All', effect: '4d6 random damage type to all creatures' },
          { range: { min: 2, max: 2 }, customName: 'Heal All', effect: '2d8 healing to all creatures' },
          { range: { min: 3, max: 3 }, customName: 'Teleport Random', effect: 'All creatures teleport randomly within the vortex' },
          { range: { min: 4, max: 4 }, customName: 'Buff/Debuff', effect: 'Allies gain +2 AC, enemies get -2 AC' },
          { range: { min: 5, max: 5 }, customName: 'Speed Change', effect: 'Random creatures gain haste, others get slowed' },
          { range: { min: 6, max: 6 }, customName: 'Wild Surge', effect: 'Each creature rolls on Wild Magic Surge table' }
        ]
      },

      effects: {
        zone: {
          duration: 3,
          radius: 30,
          changesEachRound: true,
          affectsAll: true
        }
      },

      specialMechanics: {
        mayhemModifiers: {
          canSpend: true,
          adjustsTable: true,
          perRound: true,
          description: 'Spend Mayhem Modifiers each round to adjust the vortex effect'
        }
      },

      tags: ['chaos', 'aoe', 'ultimate', 'zone', 'random', 'table'],
      flavorText: 'The ultimate expression of chaos - a vortex of pure unpredictability.'
    }
  ]
};


