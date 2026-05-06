/**
 * Huntress Class Data
 * 
 * Complete class information for the Huntress - an agile melee combatant
 * who wields the Shadow Glaive and commands a loyal companion.
 */

export const HUNTRESS_DATA = {
  id: 'huntress',
  name: 'Huntress',
  icon: 'fas fa-moon',
  role: 'Damage',
  damageTypes: ['piercing', 'slashing'],

  // Overview section
  overview: {
    title: 'The Huntress',
    subtitle: 'Shadow Glaive Wielder and Beastmaster',

    quickOverview: {
      title: 'Quick Overview',
      content: `**What You Need to Know**: The Huntress is an agile melee damage dealer who builds Quarry Marks through attacks to empower both her Shadow Glaive chains and her beast companion.

**Core Mechanic**: Attack enemies → Generate Quarry Marks → Spend marks on companion buffs, glaive chain extensions, or ultimate abilities

**Resource**: Quarry Marks (0–5 scale, max +3 generated per turn)

**Playstyle**: Hit-and-run tactical melee with companion synergy

**Best For**: Players who enjoy pet management, multi-target melee, and aggressive resource-building gameplay`,
    },

    description: `The Huntress is a master of close-range combat who wields the legendary Shadow Glaive, a weapon capable of chaining deadly strikes between multiple enemies. Accompanied by a loyal beast companion, the Huntress excels at hit-and-run tactics, weaving through enemy lines with deadly grace. Through the Quarry Marks system, she tracks her prey and unleashes devastating coordinated attacks with her companion. This dynamic class rewards tactical positioning, resource management, and the synergy between hunter and beast.`,

    roleplayIdentity: {
      title: 'Roleplay Identity',
      content: `Huntresses are elite warriors who have bonded with a beast companion through ancient rituals. They often serve as scouts, trackers, or guardians of wild places, using their agility and their companion's instincts to protect their territory.

**Common Huntress Archetypes**:
- **The Sentinel**: A guardian of sacred groves who patrols with her companion, defending nature from intruders
- **The Tracker**: A relentless pursuer who marks her quarry and never stops until the hunt is complete
- **The Shadowblade**: An assassin who strikes from darkness, her glaive a blur of deadly precision
- **The Beastmaster**: A warrior whose bond with her companion transcends normal understanding, fighting as one entity
- **The Moonlight Warrior**: A nocturnal hunter who channels lunar energy through her glaive and companion

**Personality Traits**:
Huntresses are typically independent, patient, and fiercely loyal to their companions. They value freedom, respect nature's balance, and trust their instincts. Many prefer the company of beasts to people, finding honesty in the wild that civilization lacks.`
    },

    combatRole: {
      title: 'Combat Role',
      content: `**Primary Role**: Agile melee damage dealer with companion support

**Combat Strengths**:
- Exceptional multi-target damage through glaive chaining
- High mobility with Shadowstep and evasion abilities
- Companion provides additional damage, defense, or utility
- Strong burst damage when spending Quarry Marks
- Excellent at controlling enemy positioning

**Combat Weaknesses**:
- Requires enemies to be grouped for maximum glaive effectiveness
- Moderate armor (leather wearer)
- Companion can be targeted and killed
- Less effective at long range
- Dependent on Quarry Mark generation for peak performance

**Optimal Positioning**:
Huntresses excel at close range (5-15 feet), positioning themselves to maximize glaive chains between grouped enemies. They should maintain mobility, using Shadowstep to reposition and avoid being surrounded while keeping their companion in effective range.`
    },

    playstyle: {
      title: 'Playstyle & Strategy',
      content: `**Quarry Mark Management**:
The key to mastering the Huntress is generating and spending Quarry Marks efficiently. Generate marks through successful attacks, then spend them strategically:

- **1 Mark**: Enhance companion's next attack (+1d6 damage)
- **2 Marks**: Extend glaive chain by +1 target
- **3 Marks**: Companion special ability
- **5 Marks**: Specialization ultimate ability

**Companion Commands**:
Your companion is a crucial part of your combat effectiveness. Use commands wisely:
- **Attack**: When you need additional damage on priority targets
- **Defend**: When you or an ally needs protection (+2 Armor)
- **Support**: For tactical advantages (buffs/debuffs)

**Glaive Positioning**:
Position yourself to maximize chain attacks. The Shadow Glaive chains to enemies within 5 feet of each other, so:
- Target enemies in tight groups
- Use mobility to position for optimal chains
- Coordinate with allies to group enemies (tanks, crowd control)

**Hit-and-Run Tactics**:
Don't stand still. Use Shadowstep and Evasion to:
- Strike quickly and reposition
- Avoid being surrounded
- Escape when focused
- Set up advantageous attack angles

**Team Dynamics**:
- Work with tanks to group enemies for glaive chains
- Coordinate companion attacks with team burst windows
- Use mobility to assist allies in trouble
- Mark priority targets for focused fire`
    },

    immersiveCombatExample: {
      title: 'Combat Example: The Shadow Glaive Dance',
      content: `**The Setup**: You're a Huntress (Shadowblade specialization) with your wolf companion "Fang" facing a group of bandits (5 bandits in a tight formation). Your party is with you. Starting Quarry Marks: 2 (from previous encounter). Your goal: Use glaive chaining to hit multiple enemies, generate Quarry Marks through successful attacks, and coordinate with your companion for devastating combos.

**Starting State**: Quarry Marks: 2/5 | HP: 70/70 | Companion (Fang): 50/50 HP

**Turn 1 — The Opening Chain (QM: 2 → 5)**

*Five bandits stand in a tight group, weapons drawn. You grip your Shadow Glaive—a crescent-bladed polearm that hums with dark energy. Fang growls beside you, ready to strike.*

**Your Action**: Shadow Glaive Attack on Bandit #1 (melee attack, chains to nearby enemies)
**Attack Roll**: d20+7 → [16] = Hit!
**Primary Target Damage**: 2d8+4 → [7, 6] + 4 = **17 damage** to Bandit #1

*Your glaive strikes Bandit #1, and the blade GLOWS. Shadow energy arcs from the impact point, seeking nearby targets.*

**Chain Mechanic**: Glaive chains to all enemies within 5 feet of primary target
**Enemies in Range**: Bandits #2, #3, #4 (all within 5 feet of Bandit #1)
**Chain Damage**: 1d8+4 to each chained target

**Chain Attack #1 (Bandit #2)**: 1d8+4 → [6] + 4 = **10 damage**
**Chain Attack #2 (Bandit #3)**: 1d8+4 → [7] + 4 = **11 damage**
**Chain Attack #3 (Bandit #4)**: 1d8+4 → [5] + 4 = **9 damage**

*The shadow energy EXPLODES outward, striking four bandits in one swing. They stagger, wounded.*

**Total Damage**: 17 + 10 + 11 + 9 = **47 damage across 4 targets!**
**Quarry Marks Generated**: +1 QM per enemy hit = +4 QM (hit 4 enemies), but per-turn cap is +3
**Quarry Marks**: 2 + 3 = **5 QM** (hit cap, 1 mark lost to overflow)

**Companion's Turn (Fang)**: Attack Bandit #1 (commanded to attack)
**Attack Roll**: d20+5 → [14] = Hit!
**Damage**: 1d8+3 → [6] + 3 = **9 damage**
**Result**: Bandit #1 takes 17 + 9 = 26 total damage, DEAD

*Fang leaps forward, jaws clamping down on Bandit #1's throat. The bandit falls.*

**Current State**: QM: 5/5 | 4 bandits remaining (all wounded)

**Turn 2 — Spending Quarry Marks (QM: 5 → 3 → 4)**

*The bandits regroup. Bandit #5 (who wasn't in the chain range) charges you. Time to use Quarry Marks.*

**Bandit #5's Turn**: Attacks you → [17] → Hit! → 2d6+3 → [5, 4] + 3 = 12 damage
**Your HP**: 70 - 12 = 58/70

**Your Action**: Spend 2 Quarry Marks to extend glaive chain by +1 target
**Quarry Marks**: 5 - 2 = **3 QM**

*You focus your will. The Shadow Glaive pulses with darker energy. This next strike will chain further.*

**Your Action**: Shadow Glaive Attack on Bandit #2
**Attack Roll**: d20+7 → [18] = Hit!
**Primary Target Damage**: 2d8+4 → [8, 7] + 4 = **19 damage** to Bandit #2

**Chain Mechanic**: Normally chains to enemies within 5 feet, but you spent 2 QM for +1 target
**Enemies in Range**: Bandits #3, #4, #5 (3 enemies)
**Extended Chain**: Can hit 3 + 1 = **4 targets total** (but only 3 enemies in range, so hits all 3)

**Chain Attack #1 (Bandit #3)**: 1d8+4 → [6] + 4 = **10 damage** → Bandit #3 DEAD (was already wounded)
**Chain Attack #2 (Bandit #4)**: 1d8+4 → [8] + 4 = **12 damage** → Bandit #4 DEAD (was already wounded)
**Chain Attack #3 (Bandit #5)**: 1d8+4 → [5] + 4 = **9 damage**

*The glaive chains to THREE enemies this time, killing two of them. Only Bandits #2 and #5 remain.*

**Quarry Marks Generated**: +1 per enemy hit = +3 (hit 3 enemies), but already generated 0 this turn so +3 total
**Quarry Marks**: 3 + 3 = **5 QM** (but wait — per-turn cap was already partially used on companion Fang's hit this turn? No — Turn 2 generation starts fresh. +3 from 3 hits = 3 generated. 3 + 3 = 5, but cap is +3/turn. 3 + 3 = **5 QM** ✓)

**Companion's Turn (Fang)**: You command Fang to Defend you (+2 Armor for 1 round)
*Fang positions himself protectively in front of you, snarling at the remaining bandits.*

**Current State**: QM: 5/5 | 2 bandits remaining | Your armor: 16 → 18 (Fang defending)

**Turn 3 — Companion Empowerment (QM: 5 → 4 → 5)**

*Two bandits left. Bandit #2 is wounded (19 damage taken), Bandit #5 is wounded (9 damage taken). Time to finish this.*

**Your Action**: Spend 1 Quarry Mark to enhance Fang's next attack (+1d6 damage)
**Quarry Marks**: 5 - 1 = **4 QM**

**Your Action**: Command Fang to attack Bandit #2
**Fang's Attack Roll**: d20+5 → [16] = Hit!
**Damage**: 1d8+3 + 1d6 (QM bonus) → [7] + 3 + [5] = **15 damage**
**Result**: Bandit #2 DEAD

*Fang's jaws glow with shadow energy as he tears into Bandit #2. The bandit falls.*

**Your Action**: Shadow Glaive Attack on Bandit #5 (last enemy)
**Attack Roll**: d20+7 → [19] = Hit!
**Damage**: 2d8+4 → [8, 6] + 4 = **18 damage**
**Result**: Bandit #5 DEAD

*Your glaive sweeps through the last bandit. He falls. Combat over.*

**Quarry Marks Generated**: +1 (Fang hit) + +1 (your glaive hit) = +2 this turn
**Quarry Marks**: 4 + 2 = **5 QM** (banked for next fight)

**Combat Over**

*You stand among five corpses, your Shadow Glaive still humming with dark energy. Fang sits beside you, blood on his muzzle. Your party stares.*

**Your Party's Mage**: "You... you killed four of them in one swing."
**You**: "Shadow Glaive chains to nearby enemies. The closer they stand, the more they die together."
**Your Party's Tank**: "And your wolf just... knew when to defend you?"
**You**: "Fang and I share an empathic bond. I command, he obeys. But we fight as one."
**Fang**: *Growls in agreement*

**Final State**: QM: 5/5 (banked) | HP: 58/70 | Fang: 50/50 HP

**The Lesson**: Huntress gameplay is about:
1. **Glaive Chaining**: Hit 1 primary target, chain to 3 nearby enemies = 4 hits in one attack (47 damage total in Turn 1)
2. **Quarry Mark Generation**: +1 QM per enemy hit (including chains), capped at +3 per turn
3. **Quarry Mark Spending**: Spent 2 QM to extend chain by +1 target (Turn 2), spent 1 QM to enhance Fang's attack (Turn 3)
4. **Companion Commands**: Commanded Fang to Attack (Turn 1, 3) and Defend (Turn 2)
5. **Positioning**: Enemies grouped together = maximum chain effectiveness
6. **Burst Damage**: Turn 1 dealt 47 damage across 4 targets, Turn 2 dealt 50 damage across 4 targets (killed 2)
7. **Resource Banking**: Ended with 5 QM banked for next fight
8. **Per-Turn Awareness**: You can only generate +3 QM per turn, so chain positioning matters — hitting 5 enemies still only gives +3

You're not a single-target damage dealer. You're a CHAIN ATTACKER. When enemies group up, your Shadow Glaive becomes a weapon of mass destruction. One swing, four hits. And with Quarry Marks, you can extend chains even further, empower your companion, or unleash ultimate abilities. The key is positioning—get enemies close together, then watch the shadow energy arc between them. And Fang isn't just a pet—he's a tactical asset. Attack when you need damage, Defend when you need protection, Support when you need utility. Together, you're unstoppable.`
    }
  },

  // Resource System
  resourceSystem: {
    title: 'Quarry Marks (QM)',
    subtitle: 'The Rhythm of the Hunt',

    description: `The Huntress is a master of focus and coordination. Your core resource is **Quarry Marks** (0-5), silver-blue moonlight energy built through successful strikes. While your Shadow Glaive clears the field, your Quarry Marks are what turn your loyal companion from a pet into a lethal extension of your own will.`,

    cards: [
      {
        title: 'Quarry Marks (0-5)',
        stats: 'Cap: 5 Marks',
        details: 'Build marks through hits. Spend to extend glaive chains or empower your beast companion.'
      },
      {
        title: 'The Shadow Bond',
        stats: 'Telepathic Link',
        details: 'You and your companion share a resource pool. Marks generated by one can be spent by the other.'
      },
      {
        title: 'Tactical Chain',
        stats: '2 QM Cost',
        details: 'Spend 2 QM to force your glaive to chain to ONE additional target, even if they are out of range.'
      }
    ],

    generationTable: {
      headers: ['Event', 'QM Gained', 'Notes'],
      rows: [
        ['Glaive Hit', '+1 QM', 'Per target hit (includes chains)'],
        ['Companion Hit', '+1 QM', 'Generated when your beast lands an attack'],
        ['Critical Hit', '+2 QM', 'Landing a crit on your primary target'],
        ['Mark Quarry', '+1 QM', 'Special ability to mark without attacking'],
        ['Turn Cap', 'MAX +3', 'You cannot generate more than 3 QM per turn']
      ]
    },

    usage: {
      momentum: 'Start by commanding your companion to "Attack" while you use "Glaive Toss." This reliably builds your 3-mark "Companion Special" by turn two.',
      flourish: '⚠️ The Over-Hunt: If you hit 5 QM, don\'t sit on them. You generate marks so fast that any unspent marks are effectively wasted power.'
    },

    overheatRules: {
      title: 'Primal Outrage',
      content: `If you generate 5+ Quarry Marks in a single turn (shattering your turn cap through multiple critical chains), your beast enters a **Primal Outrage**.

**The Effect**: For the next 2 turns, your companion deals **Double Damage** but becomes **Frenzied**. A frenzied beast will move toward and attack the NEAREST creature at the start of its turn, regardless of affiliation. You must spend an Action (Command) to snap it out of the frenzy early.`
    },

    strategicConsiderations: {
      title: 'The Hunting Party',
      content: `**Beastmaster Spec**: Your turn cap for QM generation is increased from +3 to +4, allowing you to cycle through Companion Specials every single turn.

**Banking**: Since marks persist between fights, always try to "finish" an encounter by building back up to 5 QM so you can open the next fight with an Ultimate.`
    },

    playingInPerson: {
      title: 'Playing in Person',
      subtitle: 'The Hunting Trophy',
      content: `The Huntress thrives when the player feels the "Build and Release" rhythm of the marks.

**Required Materials**:
- **5 Silver/Blue Tokens**: (Representing Quarry Marks).
- **Companion Miniature**: (Essential for tracking chain distances).
- **A Trophy Bowl**: (For the physical hack).

**The Physical Hack (Friction Points)**:
- **The Hunting Trophy**: When you kill an enemy that was "Marked" (had at least 1 QM spent on them), move 1 token from your spend pile into a separate **Trophy Bowl**. During a Short Rest, each token in the bowl can be "consumed" to grant 1d4 temporary HP to your companion.
- **The Chain Thread**: Use a piece of silver string or a pipe cleaner to physically connect your mini to the enemies hit by your Glaive Chain. It helps everyone see who is currently being "hunted."
- **Empathic Distress**: If your companion drops below 25% HP, flip your character sheet over or place it at an angle. It signals your character's emotional distraction to the table.

**Pro Tip**: Use a d6 to track QM on your companion's mini directly. It keeps the information where the action is happening.`
    }
  },

  // Specializations
  specializations: {
    title: 'Huntress Specializations',
    subtitle: 'Three Paths of the Hunt',
    
    description: `Every Huntress chooses one of three specializations that define their combat style. Each specialization emphasizes different aspects of glaive combat, companion synergy, or stealth and mobility, offering unique passive abilities and playstyles.`,
    
    sharedPassive: null,

    specs: [
      {
        id: 'bladestorm',
        name: 'Bladestorm',
        icon: 'Piercing/Dagger Rain',
        color: '#DC143C',
        theme: 'Multi-Target Devastation',
        
        description: `The Bladestorm specialization focuses on maximizing the Shadow Glaive's chain attack potential. These Huntresses are masters of positioning and timing, able to strike multiple enemies in a single fluid motion. They excel in situations where enemies are grouped together, turning their glaive into a whirlwind of death.`,
        
        playstyle: 'Aggressive multi-target damage dealer, positioning for maximum chain attacks and area control',
        
        strengths: [
          'Highest multi-target damage among Huntress specs',
          'Can chain to 5 targets instead of 4 (with passive)',
          'Momentum-based damage scaling',
          'Excellent against grouped enemies'
        ],
        
        weaknesses: [
          'Less effective against spread-out enemies',
          'Lower single-target damage than Shadowdancer',
          'Requires careful positioning',
          'Companion plays secondary role'
        ],
        
        passiveAbilities: [
          {
            name: 'Whirling Blades',
            icon: 'Slashing/Quick Slash',
            description: 'Your Shadow Glaive can chain to +1 additional target (total of 5 targets: 1d8 → 1d6 → 1d4 → 1d2 → 1d2). This does not cost Quarry Marks.'
          },
          {
            name: 'Momentum',
            icon: 'Utility/Empowered Warrior',
            description: 'Each successful chain attack grants you +1 to your next attack roll. This bonus stacks up to +3 and resets if you miss an attack.'
          }
        ],
        
        recommendedSpells: [
          'Glaive Toss - Your bread-and-butter chain attack',
          'Whirling Death - Spin attack for maximum AoE',
          'Blade Fury - Ultimate ability for massive multi-target burst',
          'Swift Assault - Rapid strikes to build Momentum'
        ]
      },
      {
        id: 'beastmaster',
        name: 'Beastmaster',
        icon: 'Nature/Spawn',
        color: '#228B22',
        theme: 'Companion Synergy',
        
        description: `The Beastmaster specialization deepens the bond between Huntress and companion, creating a fighting duo that operates as a single deadly unit. These Huntresses coordinate their attacks perfectly with their beasts, overwhelming enemies through synchronized strikes and tactical positioning.`,
        
        playstyle: 'Coordinated attacks with companion, tactical positioning for Pack Tactics, balanced damage distribution',
        
        strengths: [
          'Strongest companion damage and utility',
          'Pack Tactics provides consistent advantage',
          'Companion has enhanced survivability',
          'Excellent single-target focus fire'
        ],
        
        weaknesses: [
          'Heavily reliant on companion staying alive',
          'Lower personal damage than other specs',
          'Requires positioning both Huntress and companion',
          'Vulnerable if companion is killed'
        ],
        
        passiveAbilities: [
          {
            name: 'Alpha Bond',
            icon: 'Nature/Claw Marks',
            description: 'Your companion deals +1d4 damage on all attacks. Additionally, your companion\'s maximum HP is increased by 50%.'
          },
          {
            name: 'Pack Tactics',
            icon: 'Nature/Sense',
            description: 'When you and your companion attack the same target, both of you gain advantage on attack rolls against that target until the end of your turn.'
          }
        ],
        
        recommendedSpells: [
          'Companion Strike - Enhanced companion attack',
          'Coordinated Assault - Simultaneous attacks with advantage',
          'Primal Rage - Companion ultimate ability',
          'Mark Quarry - Build marks for companion empowerment'
        ]
      },
      {
        id: 'shadowblade',
        name: 'Shadowblade',
        icon: 'Utility/Phantom Dash',
        color: '#4B0082',
        theme: 'Stealth & Lethality',
        
        description: `The Shadowblade specialization embraces the shadows, using stealth and mobility to strike from unexpected angles. These Huntresses are assassins who blend hit-and-run tactics with devastating burst damage, appearing from nowhere to eliminate priority targets before vanishing back into darkness.`,
        
        playstyle: 'High mobility assassin, stealth attacks, burst damage, hit-and-run tactics',
        
        strengths: [
          'Highest single-target burst damage',
          'Exceptional mobility with enhanced Shadowstep',
          'Stealth attacks deal massive damage',
          'Superior survivability through evasion'
        ],
        
        weaknesses: [
          'Lower sustained damage than Bladestorm',
          'Requires stealth setup for maximum damage',
          'Less effective in prolonged fights',
          'Companion plays support role'
        ],
        
        passiveAbilities: [
          {
            name: 'Shadow Veil',
            icon: 'Utility/Hide',
            description: 'After using Shadowstep, you gain +2 Armor and advantage on Stealth checks for 1 round. You can hide for 1 AP during this time.'
          },
          {
            name: 'Lethal Precision',
            icon: 'Poison/Poison Concoction',
            description: 'Attacks made from stealth or immediately after using Shadowstep deal an additional 2d6 damage. This bonus applies to both glaive and companion attacks.'
          }
        ],
        
        recommendedSpells: [
          'Shadowstep - Core mobility and damage amplifier',
          'Shadow Strike - Massive stealth attack',
          'Phantom Blades - Ultimate multi-attack ability',
          'Evasion - Defensive survival tool'
        ]
      }
    ]
  },
  
  // Example Abilities - showcasing Shadow Glaive and Companion mechanics
  exampleSpells: [
    // BLADESTORM - Multi-Target Glaive Attacks
    {
      id: 'huntress_glaive_toss',
      name: 'Glaive Toss',
      description: 'Throw your Shadow Glaive at a target, chaining to additional enemies within 5 feet of each other.',
      spellType: 'ACTION',
      icon: 'Piercing/Dagger Rain',
      school: 'Physical',
      level: 1,
      specialization: 'bladestorm',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'chain',
        rangeType: 'ranged',
        rangeDistance: 30,
        chainDistance: 5,
        maxChains: 4
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        actionPoints: 1,
        components: ['somatic'],
        somaticText: 'Throw glaive in spinning arc'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '1d8',
        elementType: 'slashing',
        damageType: 'direct',
        scalingType: 'chain_reduction'
      },

      effects: {
        damage: {
          chain: {
            primary: '1d8',
            second: '1d6',
            third: '1d4',
            fourth: '1d2',
            type: 'slashing',
            chainDistance: 5
          }
        }
      },

      specialMechanics: {
        quarryMarks: {
          generated: 1,
          perHit: true,
          description: 'Generate 1 Quarry Mark for each enemy hit'
        },
        chainMechanic: {
          description: 'Chains to enemies within 5 feet of previous target',
          maxTargets: 4,
          damageReduction: 'Each chain deals less damage (1d8 → 1d6 → 1d4 → 1d2)'
        },
        bladestormPassive: {
          description: 'Bladestorm spec can chain to 5 targets (adds 1d2 fifth target)'
        }
      },

      tags: ['physical', 'damage', 'chain', 'multi target', 'bladestorm']
    },

    {
      id: 'huntress_whirling_death',
      name: 'Whirling Death',
      description: 'Spin your Shadow Glaive in a deadly circle, striking all enemies within 10 feet.',
      spellType: 'ACTION',
      icon: 'Slashing/Quick Slash',
      school: 'Physical',
      level: 3,
      specialization: 'bladestorm',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self',
        areaType: 'circle',
        areaSize: 10
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        actionPoints: 1,
        quarryMarks: 2,
        components: ['somatic'],
        somaticText: 'Spin in place with glaive extended'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '2d8',
        elementType: 'slashing',
        damageType: 'area',
        scalingType: 'none'
      },

      specialMechanics: {
        quarryMarks: {
          cost: 2,
          generated: 1,
          perHit: true,
          description: 'Costs 2 marks to use, but generates 1 mark per enemy hit'
        },
        momentum: {
          description: 'Each enemy hit grants +1 Momentum (Bladestorm passive), stacking up to +3'
        }
      },

      tags: ['physical', 'damage', 'aoe', 'spin', 'bladestorm']
    },

    {
      id: 'huntress_blade_fury',
      name: 'Blade Fury',
      description: 'Unleash a devastating flurry of glaive strikes, hitting multiple targets in rapid succession.',
      spellType: 'ACTION',
      icon: 'Slashing/Whirl',
      school: 'Physical',
      level: 5,
      specialization: 'bladestorm',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'multi',
        rangeType: 'melee',
        rangeDistance: 15,
        maxTargets: 5
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        actionPoints: 1,
        quarryMarks: 5,
        components: ['somatic'],
        somaticText: 'Rapid spinning strikes with glaive'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '3d8',
        elementType: 'slashing',
        damageType: 'direct',
        scalingType: 'none'
      },

      effects: {
        damage: {
          multiTarget: {
            formula: '3d8',
            type: 'slashing',
            targets: 5,
            description: 'Each target takes full damage'
          }
        }
      },

      specialMechanics: {
        quarryMarks: {
          cost: 5,
          description: 'Ultimate ability - costs all 5 Quarry Marks'
        },
        momentum: {
          description: 'Grants maximum Momentum (+3) after use'
        },
        bladestormUltimate: {
          description: 'Bladestorm specialization ultimate ability',
          additionalEffect: 'Gain +2 Armor until end of next turn'
        }
      },

      tags: ['physical', 'damage', 'multi target', 'ultimate', 'bladestorm']
    },

    // BEASTMASTER - Companion Synergy
    {
      id: 'huntress_companion_strike',
      name: 'Companion Strike',
      description: 'Command your companion to attack a target with enhanced ferocity.',
      spellType: 'ACTION',
      icon: 'Nature/Spawn',
      school: 'Physical',
      level: 1,
      specialization: 'beastmaster',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'companion',
        rangeDistance: 30
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        actionPoints: 1,
        components: ['verbal'],
        verbalText: 'Attack command to companion'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '1d8',
        damageType: 'bludgeoning',
        scalingType: 'proficiency'
      },

      effects: {
        damage: {
          companion: {
            formula: '1d8 + proficiency bonus',
            type: 'physical',
            source: 'companion'
          }
        }
      },

      specialMechanics: {
        quarryMarks: {
          generated: 1,
          description: 'Generate 1 Quarry Mark on hit'
        },
        companionCommand: {
          type: 'attack',
          description: 'Basic companion attack command'
        },
        beastmasterPassive: {
          description: 'Beastmaster spec adds +1d4 damage (Primal Bond passive)'
        }
      },

      tags: ['physical', 'damage', 'companion', 'command', 'beastmaster']
    },

    {
      id: 'huntress_coordinated_assault',
      name: 'Coordinated Assault',
      description: 'You and your companion attack the same target simultaneously, overwhelming them with coordinated strikes.',
      spellType: 'ACTION',
      icon: 'Nature/Claw Marks',
      school: 'Physical',
      level: 3,
      specialization: 'beastmaster',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'melee',
        rangeDistance: 15
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        actionPoints: 1,
        quarryMarks: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Attack command',
        somaticText: 'Point at target'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '2d8',
        damageType: 'bludgeoning',
        scalingType: 'none'
      },

      effects: {
        damage: {
          huntress: {
            formula: '2d8',
            type: 'slashing',
            advantage: true
          },
          companion: {
            formula: '1d8 + proficiency',
            type: 'physical',
            advantage: true
          }
        }
      },

      specialMechanics: {
        quarryMarks: {
          cost: 2,
          generated: 2,
          description: 'Costs 2 marks, generates 2 marks (1 per hit)'
        },
        packTactics: {
          description: 'Both attacks have advantage (Pack Tactics passive)',
          requirement: 'Beastmaster specialization'
        }
      },

      tags: ['physical', 'damage', 'companion', 'coordinated', 'beastmaster']
    },

    {
      id: 'huntress_primal_rage',
      name: 'Primal Rage',
      description: 'Your companion enters a primal rage, gaining enhanced stats and attacking with savage fury.',
      spellType: 'ACTION',
      icon: 'Nature/Sense',
      school: 'Physical',
      level: 5,
      specialization: 'beastmaster',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'companion'
      },

      durationConfig: {
        durationType: 'rounds',
        duration: 3
      },

      resourceCost: {
        actionPoints: 1,
        quarryMarks: 5,
        components: ['verbal'],
        verbalText: 'Primal command to companion'
      },

      resolution: 'AUTOMATIC',

      buffConfig: {
        effects: [
          'Companion gains +2 to attack rolls',
          'Companion deals +2d6 damage on all attacks',
          'Companion gains +4 Armor',
          'Companion has advantage on all attacks',
          'Duration: 3 rounds'
        ]
      },

      effects: {
        buff: {
          target: 'companion',
          duration: 3,
          attackBonus: 2,
          damageBonus: '2d6',
          acBonus: 4,
          advantage: true
        }
      },

      specialMechanics: {
        quarryMarks: {
          cost: 5,
          description: 'Ultimate ability - costs all 5 Quarry Marks'
        },
        beastmasterUltimate: {
          description: 'Beastmaster specialization ultimate ability',
          companionRage: 'Companion becomes a devastating force for 3 rounds'
        }
      },

      tags: ['buff', 'companion', 'ultimate', 'beastmaster']
    },

    // SHADOWDANCER - Stealth & Mobility
    {
      id: 'huntress_shadowstep',
      name: 'Shadowstep',
      description: 'Teleport through shadows to a nearby location, gaining advantage on your next attack.',
      spellType: 'ACTION',
      icon: 'Utility/Phantom Dash',
      school: 'Shadow',
      level: 1,
      specialization: 'shadowblade',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'teleport',
        rangeDistance: 30
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        actionPoints: 1,
        components: ['somatic'],
        somaticText: 'Step into shadows'
      },

      resolution: 'AUTOMATIC',

      effects: {
        utility: {
          teleport: {
            distance: 30,
            unit: 'feet'
          },
          buff: {
            nextAttack: 'advantage',
            duration: '1 attack'
          }
        }
      },

      specialMechanics: {
        shadowbladePassive: {
          description: 'Shadowdancer spec gains +2 Armor and advantage on Stealth for 1 round (Shadow Veil passive)',
          additionalEffect: 'Can hide for 1 AP after Shadowstep'
        },
        lethalPrecision: {
          description: 'Next attack after Shadowstep deals +2d6 damage (Lethal Precision passive)'
        }
      },

      tags: ['utility', 'teleport', 'mobility', 'shadowblade']
    },

    {
      id: 'huntress_shadow_strike',
      name: 'Shadow Strike',
      description: 'Strike from the shadows with devastating force, dealing massive damage to an unsuspecting target.',
      spellType: 'ACTION',
      icon: 'Poison/Poison Concoction',
      school: 'Shadow',
      level: 3,
      specialization: 'shadowblade',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'melee',
        rangeDistance: 10
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        actionPoints: 1,
        quarryMarks: 3,
        components: ['somatic'],
        somaticText: 'Strike from stealth'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '3d8',
        elementType: 'slashing',
        damageType: 'direct',
        scalingType: 'none'
      },

      effects: {
        damage: {
          base: {
            formula: '3d8',
            type: 'slashing',
            advantage: 'if_stealthed'
          },
          bonus: {
            formula: '1d6',
            type: 'necrotic',
            condition: 'From stealth or after Shadowstep'
          }
        }
      },

      specialMechanics: {
        quarryMarks: {
          cost: 3,
          generated: 2,
          description: 'Costs 3 marks, generates 2 on hit (1 base + 1 for crit potential)'
        },
        stealthRequirement: {
          description: 'Deals maximum damage when used from stealth or after Shadowstep',
          bonusDamage: '+1d6 from Lethal Precision passive'
        }
      },

      tags: ['physical', 'shadow', 'damage', 'stealth', 'burst', 'shadowblade']
    },

    {
      id: 'huntress_phantom_blades',
      name: 'Phantom Blades',
      description: 'Create shadow copies of your glaive that strike multiple targets simultaneously.',
      spellType: 'ACTION',
      icon: 'Piercing/Night Dagger',
      school: 'Shadow',
      level: 5,
      specialization: 'shadowblade',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'multi',
        rangeType: 'ranged',
        rangeDistance: 30,
        maxTargets: 4
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        actionPoints: 1,
        quarryMarks: 5,
        components: ['verbal', 'somatic'],
        verbalText: 'Umbra multiplicare!',
        somaticText: 'Throw glaive while creating shadow copies'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '3d8',
        damageType: 'necrotic',
        scalingType: 'none'
      },

      effects: {
        damage: {
          multiTarget: {
            formula: '3d8',
            type: 'necrotic',
            targets: 4,
            description: 'Each phantom blade strikes a different target'
          }
        }
      },

      specialMechanics: {
        quarryMarks: {
          cost: 5,
          description: 'Ultimate ability - costs all 5 Quarry Marks'
        },
        shadowbladeUltimate: {
          description: 'Shadowdancer specialization ultimate ability',
          phantomBlades: 'Creates 4 shadow copies that strike independently'
        },
        afterEffect: {
          description: 'After using Phantom Blades, you can Shadowstep for 1 AP for free'
        }
      },

      tags: ['shadow', 'damage', 'multi target', 'ultimate', 'shadowblade']
    },

    // UNIVERSAL ABILITIES - All Huntresses
    {
      id: 'huntress_moonlit_strike',
      name: 'Moonlit Strike',
      description: 'Empower your Shadow Glaive with lunar energy, dealing enhanced damage and potentially blinding your target.',
      spellType: 'ACTION',
      icon: 'Arcane/Star Trail Path',
      school: 'Arcane',
      level: 2,
      specialization: 'universal',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'melee',
        rangeDistance: 10
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        actionPoints: 1,
        components: ['verbal', 'somatic'],
        verbalText: 'Luna fortis!',
        somaticText: 'Glaive glows with moonlight'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '2d6',
        damageType: 'radiant',
        scalingType: 'none'
      },

      savingThrow: {
        ability: 'constitution',
        dc: 14,
        onSave: 'not_blinded'
      },

      debuffConfig: {
        debuffType: 'statusEffect',
        durationValue: 1,
        durationType: 'rounds',
        durationUnit: 'rounds',
        saveDC: 14,
        saveType: 'constitution',
        saveOutcome: 'negates',
        effects: [{
          id: 'blinded',
          name: 'Blinded',
          description: 'Blinded creatures have disadvantage on attack rolls - cannot see, automatically fails sight-based checks',
          statusType: 'blinded',
          level: 'moderate',
          statPenalty: [{ stat: 'attack', value: -99, magnitudeType: 'disadvantage' }, { stat: 'perception', value: -99, magnitudeType: 'auto_fail' }],
          mechanicsText: 'Disadvantage on attack rolls, auto-fail sight-based checks'
        }]
      },

      effects: {
        damage: {
          base: {
            formula: '2d6',
            type: 'radiant'
          }
        },
        debuff: {
          type: 'blinded',
          duration: 1,
          saveToNegate: true
        }
      },

      savingThrowEffect: {
        onSuccess: 'Takes full damage but not blinded',
        onFailure: 'Takes full damage and is blinded for 1 round'
      },

      specialMechanics: {
        quarryMarks: {
          generated: 1,
          description: 'Generate 1 Quarry Mark on hit'
        }
      },

      tags: ['radiant', 'damage', 'debuff', 'blind', 'universal']
    },

    {
      id: 'huntress_evasion',
      name: 'Evasion',
      description: 'Use your agility to avoid incoming attacks, increasing your defenses.',
      spellType: 'REACTION',
      icon: 'Utility/Parry',
      school: 'Physical',
      level: 2,
      specialization: 'universal',

      typeConfig: {
        castTime: 1,
        castTimeType: 'REACTION',
        trigger: 'When you are targeted by an attack'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      durationConfig: {
        durationType: 'rounds',
        duration: 1
      },

      resourceCost: {
        actionPoints: 0,
        components: ['somatic'],
        somaticText: 'Dodge and weave'
      },

      resolution: 'AUTOMATIC',

      buffConfig: {
        effects: [
          'Gain advantage on Dexterity saving throws',
          'Gain +2 Armor',
          'Duration: Until start of your next turn'
        ]
      },

      effects: {
        buff: {
          acBonus: 2,
          savingThrowAdvantage: 'agility',
          duration: 1
        }
      },

      specialMechanics: {
        reaction: {
          trigger: 'When targeted by attack or required to make Dex save',
          timing: 'Before attack roll or saving throw'
        }
      },

      tags: ['buff', 'defense', 'reaction', 'universal']
    },

    {
      id: 'huntress_mark_quarry',
      name: 'Mark Quarry',
      description: 'Focus your hunter\'s instinct on a target, marking them as your quarry.',
      spellType: 'ACTION',
      icon: 'Piercing/Targeted Strike',
      school: 'Physical',
      level: 1,
      specialization: 'universal',

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
        durationType: 'minutes',
        duration: 10
      },

      resourceCost: {
        actionPoints: 1,
        components: ['verbal'],
        verbalText: 'Mark target as quarry'
      },

      resolution: 'AUTOMATIC',

      effects: {
        utility: {
          mark: {
            description: 'Generate 1 Quarry Mark immediately',
            tracking: 'You know the direction to marked target within 1 mile',
            duration: '10 minutes or until target dies'
          }
        }
      },

      specialMechanics: {
        quarryMarks: {
          generated: 1,
          description: 'Immediately gain 1 Quarry Mark'
        },
        tracking: {
          description: 'You can sense the marked target\'s direction',
          range: '1 mile',
          duration: '10 minutes'
        }
      },

      tags: ['utility', 'mark', 'tracking', 'universal']
    },

    {
      id: 'huntress_swift_assault',
      name: 'Swift Assault',
      description: 'Perform a rapid series of glaive strikes against multiple nearby enemies.',
      spellType: 'ACTION',
      icon: 'Slashing/Sword Strike',
      school: 'Physical',
      level: 3,
      specialization: 'universal',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'multi',
        rangeType: 'melee',
        rangeDistance: 10,
        maxTargets: 3
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        actionPoints: 1,
        quarryMarks: 1,
        components: ['somatic'],
        somaticText: 'Rapid spinning strikes'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '1d6',
        elementType: 'slashing',
        damageType: 'direct',
        scalingType: 'none'
      },

      effects: {
        damage: {
          multiTarget: {
            formula: '1d6',
            type: 'slashing',
            targets: 3
          }
        },
        conditionalBuff: {
          condition: 'If all 3 attacks hit',
          effect: '+1 Armor until start of next turn'
        }
      },

      specialMechanics: {
        quarryMarks: {
          cost: 1,
          generated: 3,
          description: 'Costs 1 mark, generates up to 3 marks (1 per hit)'
        },
        conditionalBonus: {
          description: 'If all attacks hit, gain +1 Armor until start of next turn'
        }
      },

      tags: ['physical', 'damage', 'multi target', 'universal']
    },

    // ===== ADDITIONAL SPELLS TO REACH 3 PER LEVEL =====

    // LEVEL 2 (needs 1 more)
    {
      id: 'huntress_hunters_mark',
      name: "Hunter's Mark",
      description: 'Mark a target, making it easier for you and your companion to hunt.',
      spellType: 'ACTION',
      icon: 'Piercing/Focused Arrow Shot',
      school: 'Physical',
      level: 2,
      specialization: 'universal',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 60,
        maxTargets: 1
      },

      durationConfig: {
        durationType: 'rounds',
        duration: 5
      },

      resourceCost: {
        actionPoints: 1,
        components: ['verbal', 'somatic']
      },

      resolution: 'DICE',

      effects: {
        buff: {
          description: 'Bonus damage on attacks against marked target',
          damageFormula: '+2d6',
          duration: 5,
          durationUnit: 'rounds'
        }
      },

      specialMechanics: {
        quarryMarks: {
          generated: 2,
          perHit: true,
          description: 'Attacks against marked target generate +1 additional Quarry Mark'
        },
        companionSynergy: {
          description: 'Companion deals bonus damage to marked target',
          damageFormula: '+1d8'
        }
      },

      tags: ['buff', 'mark', 'companion synergy', 'universal']
    },

    // LEVEL 4 (needs 3)
    {
      id: 'huntress_shadow_assault',
      name: 'Shadow Assault',
      description: 'Dash to a target and strike with overwhelming force.',
      spellType: 'ACTION',
      icon: 'Utility/Phantom Dash',
      school: 'Physical',
      level: 4,
      specialization: 'universal',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 40,
        maxTargets: 1
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        actionPoints: 1,
        components: ['somatic']
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '4d8 + agility',
        damageType: 'slashing'
      },

      effects: {
        movement: {
          description: 'Teleport to target before attacking',
          distance: 40
        },
        damage: {
          formula: '4d8 + agility',
          type: 'slashing'
        }
      },

      specialMechanics: {
        quarryMarks: {
          generated: 2,
          description: 'Generate 2 Quarry Marks on hit'
        }
      },

      tags: ['physical', 'damage', 'mobility', 'universal']
    },

    {
      id: 'huntress_feral_bond',
      name: 'Feral Bond',
      description: 'Strengthen your bond with your companion, enhancing both of your combat abilities.',
      spellType: 'ACTION',
      icon: 'Nature/Spawn',
      school: 'Nature',
      level: 4,
      specialization: 'universal',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self'
      },

      durationConfig: {
        durationType: 'rounds',
        duration: 4
      },

      resourceCost: {
        actionPoints: 1,
        components: ['verbal']
      },

      resolution: 'DICE',

      effects: {
        buff: {
          self: {
            description: '+2 to attack rolls and damage',
            duration: 4,
            durationUnit: 'rounds'
          },
          companion: {
            description: '+2 to attack rolls and +2d6 damage',
            duration: 4,
            durationUnit: 'rounds'
          }
        }
      },

      specialMechanics: {
        companionSynergy: {
          description: 'Companion can act twice per turn while bonded'
        },
        quarryMarks: {
          costReduction: true,
          description: 'Quarry Mark abilities cost -1 QM while bonded'
        }
      },

      tags: ['buff', 'companion synergy', 'enhancement', 'universal']
    },

    {
      id: 'huntress_glaive_dance',
      name: 'Glaive Dance',
      description: 'Spin through enemies in a deadly dance, striking all in your path.',
      spellType: 'ACTION',
      icon: 'Slashing/Dual Blades',
      school: 'Physical',
      level: 4,
      specialization: 'universal',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self',
        areaType: 'circle',
        areaSize: 15
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        actionPoints: 2,
        components: ['somatic']
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '3d10 + agility',
        damageType: 'slashing'
      },

      effects: {
        damage: {
          formula: '3d10 + agility',
          type: 'slashing',
          aoe: 'All enemies within 15 feet'
        },
        movement: {
          description: 'Can move up to 15 feet during the dance without provoking opportunity attacks'
        }
      },

      specialMechanics: {
        quarryMarks: {
          generated: 1,
          perHit: true,
          description: 'Generate 1 Quarry Mark per enemy hit'
        }
      },

      tags: ['physical', 'damage', 'aoe', 'mobility', 'universal']
    },

    // LEVEL 6 (needs 3)
    {
      id: 'huntress_apex_predator',
      name: 'Apex Predator',
      description: 'Transform into the ultimate hunter, enhancing all your abilities.',
      spellType: 'ACTION',
      icon: 'Nature/Cat Face',
      school: 'Nature',
      level: 6,
      specialization: 'universal',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self'
      },

      durationConfig: {
        durationType: 'rounds',
        duration: 5
      },

      resourceCost: {
        actionPoints: 2,
        components: ['verbal', 'somatic']
      },

      resolution: 'DICE',

      effects: {
        buff: {
          description: '+3 to all attack rolls, +10 movement speed, advantage on Agility saves, and bonus damage on all attacks for 5 rounds',
          damageFormula: '+3d6'
        }
      },

      specialMechanics: {
        quarryMarks: {
          generation: 'double',
          description: 'Generate double Quarry Marks from all sources'
        },
        companionSynergy: {
          description: 'Companion gains same bonuses'
        }
      },

      tags: ['buff', 'transformation', 'companion synergy', 'universal']
    },

    {
      id: 'huntress_death_from_above',
      name: 'Death From Above',
      description: 'Leap high into the air and crash down on enemies with devastating force.',
      spellType: 'ACTION',
      icon: 'Nature/Cat Face',
      school: 'Physical',
      level: 6,
      specialization: 'universal',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 50,
        areaType: 'circle',
        areaSize: 20
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        actionPoints: 2,
        components: ['somatic']
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '6d10 + agility * 1.5',
        elementType: 'bludgeoning',
        damageType: 'area',
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'agility',
          difficultyClass: 16,
          saveOutcome: 'halves',
          partialEffect: true,
          partialEffectFormula: 'damage/2'
        },
        criticalConfig: {
          critType: 'effect',
          critEffects: ['knockdown']
        }
      },

      specialMechanics: {
        quarryMarks: {
          generated: 3,
          description: 'Generate 3 Quarry Marks on successful hit'
        }
      },

      tags: ['physical', 'damage', 'control', 'aoe', 'mobility', 'universal']
    },

    {
      id: 'huntress_pack_assault',
      name: 'Pack Assault',
      description: 'Coordinate a devastating assault with your companion.',
      spellType: 'ACTION',
      icon: 'Nature/Wolf Dash',
      school: 'Nature',
      level: 6,
      specialization: 'universal',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 30,
        maxTargets: 1
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        actionPoints: 2,
        components: ['verbal', 'somatic']
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '5d6 + agility',
        damageType: 'slashing'
      },

      effects: {
        damage: {
          huntress: {
            formula: '5d6 + agility',
            type: 'slashing'
          },
          companion: {
            formula: '3d6 + companion_attack',
            type: 'piercing',
            description: 'Companion attacks immediately with advantage'
          }
        }
      },

      specialMechanics: {
        quarryMarks: {
          cost: 3,
          description: 'Costs 3 Quarry Marks to use'
        },
        companionSynergy: {
          description: 'Companion attacks with advantage and deals +3d6 damage'
        }
      },

      tags: ['physical', 'damage', 'companion synergy', 'coordinated', 'universal']
    },

    // LEVEL 7 (needs 3)
    {
      id: 'huntress_shadow_glaive_mastery',
      name: 'Shadow Glaive Mastery',
      description: 'Master the Shadow Glaive, unlocking its full devastating potential.',
      spellType: 'ACTION',
      icon: 'Poison/Poison Concoction',
      school: 'Physical',
      level: 7,
      specialization: 'universal',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self'
      },

      durationConfig: {
        durationType: 'rounds',
        duration: 5
      },

      resourceCost: {
        actionPoints: 2,
        components: ['verbal', 'somatic']
      },

      resolution: 'DICE',

      effects: {
        buff: {
          description: 'All glaive attacks chain to +2 additional targets, chain damage does not reduce, and all glaive attacks deal +50% damage for 5 rounds'
        }
      },

      specialMechanics: {
        quarryMarks: {
          generation: 'enhanced',
          description: 'Generate +1 additional Quarry Mark per target hit'
        },
        glassiveSynergy: {
          description: 'Glaive chains ignore distance restrictions (chains to all enemies within 30 feet)'
        }
      },

      tags: ['buff', 'enhancement', 'glaive', 'chain', 'universal']
    },

    {
      id: 'huntress_savage_roar',
      name: 'Savage Roar',
      description: 'Your companion unleashes a terrifying roar that frightens all enemies.',
      spellType: 'ACTION',
      icon: 'Nature/Roar',
      school: 'Nature',
      level: 7,
      specialization: 'universal',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 30,
        areaType: 'circle',
        areaSize: 30,
        origin: 'companion'
      },

      durationConfig: {
        durationType: 'rounds',
        duration: 3
      },

      resourceCost: {
        actionPoints: 1,
        components: ['verbal']
      },

      resolution: 'DICE',

      effects: {
        control: {
          description: 'All enemies within 30 feet of companion must make DC 17 Spirit save or be frightened for 3 rounds',
          save: 'DC 17 Spirit',
          saveEffect: 'negates',
          duration: 3,
          durationUnit: 'rounds'
        },
        damage: {
          description: 'Frightened enemies take psychic damage at the start of their turns',
          damageFormula: '3d8'
        }
      },

      specialMechanics: {
        companionSynergy: {
          description: 'Companion must be alive and within 100 feet'
        },
        quarryMarks: {
          cost: 2,
          description: 'Costs 2 Quarry Marks to use'
        }
      },

      tags: ['control', 'fear', 'companion synergy', 'aoe', 'universal']
    },

    {
      id: 'huntress_hunters_fury',
      name: "Hunter's Fury",
      description: 'Channel all your fury into a devastating flurry of glaive strikes.',
      spellType: 'ACTION',
      icon: 'Slashing/Whirl',
      school: 'Physical',
      level: 7,
      specialization: 'universal',

      typeConfig: {
        castTime: 2,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'touch',
        maxTargets: 1
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        actionPoints: 3,
        components: ['somatic']
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '12d8 + agility * 2',
        elementType: 'slashing',
        damageType: 'direct',
        criticalConfig: {
          critType: 'effect',
          critEffects: ['rapid_strikes_crit']
        }
      },

      specialMechanics: {
        quarryMarks: {
          cost: 5,
          description: 'Costs 5 Quarry Marks (maximum) to use'
        },
        criticalHit: {
          description: 'Each strike that rolls max damage counts as a critical hit'
        }
      },

      tags: ['physical', 'damage', 'single target', 'burst', 'universal']
    },

    // LEVEL 8 (needs 3)
    {
      id: 'huntress_shadow_storm',
      name: 'Shadow Storm',
      description: 'Create a storm of shadow energy that devastates all enemies.',
      spellType: 'ACTION',
      icon: 'Psychic/Mind Strike',
      school: 'Shadow',
      level: 8,
      specialization: 'universal',

      typeConfig: {
        castTime: 3,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'sight',
        areaType: 'circle',
        areaSize: 50
      },

      durationConfig: {
        durationType: 'rounds',
        duration: 4
      },

      resourceCost: {
        actionPoints: 3,
        components: ['verbal', 'somatic']
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '10d10 + agility',
        damageType: 'necrotic',
        dot: {
          formula: '3d10',
          duration: 4,
          tickFrequency: 'round'
        }
      },

      effects: {
        damage: {
          initial: {
            formula: '10d10 + agility',
            type: 'necrotic'
          },
          dot: {
            formula: '3d10 shadow per round',
            duration: 4,
            durationUnit: 'rounds'
          }
        },
        zone: {
          description: 'Storm persists for 4 rounds, dealing 3d10 shadow damage per round to enemies in the area',
          damageFormula: '3d10'
        }
      },

      specialMechanics: {
        quarryMarks: {
          cost: 4,
          description: 'Costs 4 Quarry Marks to use'
        }
      },

      tags: ['shadow', 'damage', 'aoe', 'dot', 'zone', 'universal']
    },

    {
      id: 'huntress_primal_fusion',
      name: 'Primal Fusion',
      description: 'Merge your essence with your companion, becoming one unstoppable force.',
      spellType: 'ACTION',
      icon: 'Nature/Claw Marks',
      school: 'Nature',
      level: 8,
      specialization: 'universal',

      typeConfig: {
        castTime: 2,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self'
      },

      durationConfig: {
        durationType: 'rounds',
        duration: 5
      },

      resourceCost: {
        actionPoints: 3,
        components: ['verbal', 'somatic']
      },

      resolution: 'DICE',

      effects: {
        transformation: {
          description: 'Merge with companion, gaining +5 to all stats, +30 HP, and both your attacks combined'
        },
        buff: {
          description: '+5 to all stats, +30 maximum HP, regenerate HP per round, and can attack twice per turn for 5 rounds',
          healingFormula: '5d10'
        }
      },

      specialMechanics: {
        companionSynergy: {
          description: 'Companion merges with you - cannot be targeted separately'
        },
        quarryMarks: {
          generation: 'triple',
          description: 'Generate triple Quarry Marks from all sources'
        }
      },

      tags: ['transformation', 'buff', 'companion synergy', 'merge', 'universal']
    },

    {
      id: 'huntress_glaive_storm',
      name: 'Glaive Storm',
      description: 'Summon a storm of shadow glaives that strike all enemies repeatedly.',
      spellType: 'CHANNELED',
      icon: 'Piercing/Dagger Rain',
      school: 'Physical',
      level: 8,
      specialization: 'universal',

      typeConfig: {
        maxChannelDuration: 5,
        durationUnit: 'ROUNDS',
        interruptible: true,
        movementAllowed: false,
        concentrationDC: 15,
        dcType: 'CONSTITUTION',
        tickFrequency: 'END_OF_TURN'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'sight',
        areaType: 'circle',
        areaSize: 40
      },

      durationConfig: {
        durationType: 'rounds',
        duration: 5
      },

      resourceCost: {
        actionPoints: 3,
        components: ['verbal', 'somatic'],
        channelingFrequency: 'per_round'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '8d8 + agility',
        elementType: 'slashing',
        damageType: 'area',
        hasDotEffect: true,
        dotConfig: {
          dotFormula: '8d8 + agility',
          duration: 5,
          tickFrequency: 'round',
          isProgressiveDot: false
        },
        criticalConfig: {
          critType: 'effect',
          critEffects: ['glaive_storm_crit']
        }
      },

      specialMechanics: {
        channeling: {
          description: 'Must maintain concentration. Deals damage at end of each of your turns.'
        },
        quarryMarks: {
          generated: 2,
          perRound: true,
          description: 'Generate 2 Quarry Marks per round channeled'
        }
      },

      tags: ['physical', 'damage', 'aoe', 'channeled', 'dot', 'universal']
    },

    // LEVEL 9 (needs 3)
    {
      id: 'huntress_ultimate_hunter',
      name: 'Ultimate Hunter',
      description: 'Become the ultimate hunter, transcending mortal limitations.',
      spellType: 'ACTION',
      icon: 'Nature/Roaring Bear',
      school: 'Nature',
      level: 9,
      specialization: 'universal',

      typeConfig: {
        castTime: 3,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self'
      },

      durationConfig: {
        durationType: 'rounds',
        duration: 10
      },

      resourceCost: {
        actionPoints: 3,
        quarryMarks: 5,
        components: ['verbal', 'somatic']
      },

      resolution: 'DICE',

      effects: {
        transformation: {
          description: '+3 to attack and damage rolls, double QM generation, companion shares all bonuses. Duration: 5 rounds.'
        }
      },

      specialMechanics: {
        quarryMarks: {
          generation: 'double',
          description: 'Generate double Quarry Marks from all sources'
        },
        companionSynergy: {
          description: 'Companion gains same bonuses and cannot be killed while active'
        },
        glaiveMastery: {
          description: 'Glaive chains to +2 additional targets'
        }
      },

      tags: ['transformation', 'buff', 'legendary', 'companion synergy', 'universal']
    },

    {
      id: 'huntress_deaths_embrace',
      name: "Death's Embrace",
      description: 'Channel the essence of death through your glaive, instantly killing weak enemies.',
      spellType: 'ACTION',
      icon: 'Necrotic/Necrotic Death',
      school: 'Shadow',
      level: 9,
      specialization: 'universal',

      typeConfig: {
        castTime: 2,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'chain',
        rangeType: 'ranged',
        rangeDistance: 60,
        chainDistance: 10,
        maxChains: 5
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        actionPoints: 2,
        quarryMarks: 5,
        components: ['verbal', 'somatic']
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '10d6 + agility',
        damageType: 'necrotic',
        savingThrow: 'Constitution',
        saveDC: 18,
        saveEffect: 'half'
      },

      effects: {
        damage: {
          formula: '10d6 + agility',
          type: 'necrotic',
          save: 'DC 18 Constitution for half damage',
          chain: 'Chains to up to 5 enemies'
        },
        execute: {
          description: 'Enemies below 20% HP that fail the save are instantly killed'
        }
      },

      specialMechanics: {
        quarryMarks: {
          cost: 5,
          description: 'Costs 5 Quarry Marks to use'
        },
        execute: {
          description: 'Enemies below 20% health are instantly killed on failed save'
        }
      },

      tags: ['shadow', 'damage', 'execute', 'chain', 'legendary', 'universal']
    },

    {
      id: 'huntress_eternal_hunt',
      name: 'Eternal Hunt',
      description: 'Begin an eternal hunt that never ends until your quarry falls.',
      spellType: 'PASSIVE',
      icon: 'Piercing/Targeted Strike',
      school: 'Nature',
      level: 9,
      specialization: 'universal',

      typeConfig: {
        toggleable: true
      },

      targetingConfig: {
        targetingType: 'self'
      },

      durationConfig: {
        durationType: 'permanent'
      },

      resourceCost: {
        actionPoints: 0,
        quarryMarks: 5,
        components: ['ritual']
      },

      resolution: 'DICE',

      effects: {
        passive: {
          description: 'Generate 2 Quarry Marks per round automatically. Companion auto-revives after 1 round if killed. Glaive chains to +2 additional targets.'
        }
      },

      specialMechanics: {
        quarryMarks: {
          automaticGeneration: 2,
          description: 'Automatically generate 2 Quarry Marks per round (ignores per-turn cap)'
        },
        companionSynergy: {
          description: 'Companion automatically revives after 1 round if killed'
        },
        glaiveMastery: {
          description: 'Glaive chains to +2 additional targets'
        }
      },

      tags: ['passive', 'legendary', 'companion synergy', 'enhancement', 'universal', 'toggleable']
    },

    // LEVEL 10 (needs 3)
    {
      id: 'huntress_godslayer',
      name: 'Godslayer',
      description: 'Strike with enough force to slay even gods.',
      spellType: 'ACTION',
      icon: 'Slashing/Sword Strike',
      school: 'Physical',
      level: 10,
      specialization: 'universal',

      typeConfig: {
        castTime: 5,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'touch',
        maxTargets: 1
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        actionPoints: 3,
        quarryMarks: 5,
        components: ['verbal', 'somatic']
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '12d6 + agility * 1.5',
        damageType: 'force'
      },

      effects: {
        damage: {
          formula: '12d6 + agility * 1.5',
          type: 'force',
          description: 'Deals 12d6 + agility × 1.5 force damage that ignores resistances'
        },
        execute: {
          description: 'If target HP drops below 25% after this attack, target is instantly killed'
        }
      },

      specialMechanics: {
        quarryMarks: {
          cost: 5,
          description: 'Costs 5 Quarry Marks to use'
        },
        ignoresDefenses: {
          description: 'Ignores resistances (not immunities). Cannot be partially reduced.'
        },
        execute: {
          threshold: 0.25,
          description: 'Instantly kills target if their remaining HP is below 25% of maximum'
        }
      },

      tags: ['physical', 'damage', 'execute', 'legendary', 'single target', 'universal']
    },

    {
      id: 'huntress_primal_apocalypse',
      name: 'Primal Apocalypse',
      description: 'Summon the primal fury of nature itself to devastate the battlefield.',
      spellType: 'ACTION',
      icon: 'Nature/Earth Shatter',
      school: 'Nature',
      level: 10,
      specialization: 'universal',

      typeConfig: {
        castTime: 5,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'sight',
        areaType: 'circle',
        areaSize: 100
      },

      durationConfig: {
        durationType: 'rounds',
        duration: 5
      },

      resourceCost: {
        actionPoints: 3,
        quarryMarks: 5,
        components: ['verbal', 'somatic']
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '12d6 + agility',
        damageType: 'nature',
        savingThrow: 'Constitution',
        saveDC: 18,
        saveEffect: 'half',
        dot: {
          formula: '3d6',
          duration: 3,
          tickFrequency: 'round'
        }
      },

      effects: {
        damage: {
          initial: {
            formula: '12d6 + agility',
            type: 'nature',
            save: 'DC 18 Constitution for half'
          },
          dot: {
            formula: '3d6 nature per round',
            duration: 3,
            durationUnit: 'rounds'
          }
        },
        summon: {
          description: 'Summons 3 primal beasts that attack enemies for 3 rounds'
        }
      },

      specialMechanics: {
        quarryMarks: {
          cost: 5,
          description: 'Costs 5 Quarry Marks to use'
        },
        summons: {
          description: 'Summons 3 primal beast spirits (50 HP, 15 armor each) that attack autonomously'
        }
      },

      tags: ['nature', 'damage', 'aoe', 'summoning', 'legendary', 'dot', 'universal']
    },

    {
      id: 'huntress_perfect_hunt',
      name: 'Perfect Hunt',
      description: 'Achieve the perfect hunt — mastery beyond mortal limits.',
      spellType: 'PASSIVE',
      icon: 'Piercing/On the Mark',
      school: 'Nature',
      level: 10,
      specialization: 'universal',

      typeConfig: {
        toggleable: true
      },

      targetingConfig: {
        targetingType: 'self'
      },

      durationConfig: {
        durationType: 'permanent'
      },

      resourceCost: {
        actionPoints: 0,
        quarryMarks: 5,
        components: ['ritual']
      },

      resolution: 'DICE',

      effects: {
        passive: {
          description: 'All Quarry Mark abilities cost 1 less QM (minimum 0). Attacks deal +1d8 damage. Companion auto-revives after 1 round. Glaive chains to +3 additional targets.'
        }
      },

      specialMechanics: {
        quarryMarks: {
          costReduction: 1,
          description: 'All Quarry Mark abilities cost 1 less QM (minimum 0)'
        },
        companionSynergy: {
          description: 'Companion auto-revives after 1 round if killed'
        },
        glaiveMastery: {
          description: 'Glaive chains to +3 additional targets'
        }
      },

      tags: ['passive', 'legendary', 'ascension', 'companion synergy', 'universal', 'toggleable']
    }
  ]
};

