/**
 * Plaguebringer Class Data
 *
 * Complete class information for the Plaguebringer - a master of pestilence
 * who cultivates afflictions through strategic spell combinations.
 */

export const PLAGUEBRINGER_DATA = {
  id: 'plaguebringer',
  name: 'Plaguebringer',
  icon: 'fas fa-biohazard',
  role: 'Damage/Control',

  // Overview section
  overview: {
    title: 'The Plaguebringer',
    subtitle: 'Master of Pestilence and Decay',

    description: `The Plaguebringer is a master of pestilence and decay, weaving intricate webs of curses, toxins, and afflictions to bring their enemies to a slow, agonizing end. Unlike brute force warriors, the Plaguebringer thrives on the delicate art of nurturing and evolving their sinister creations. Each affliction begins as a seed, carefully planted on the target, and through meticulous cultivation, grows into a devastating plague that cripples and consumes.`,

    roleplayIdentity: {
      title: 'Roleplay Identity',
      content: `Plaguebringers are individuals who have mastered the forbidden arts of disease cultivation and affliction manipulation. They understand that true power lies not in overwhelming force, but in patient, methodical corruption. Every enemy is a garden to be tended, every affliction a seed to be nurtured into something far more terrible.

**Philosophy**: Power through patience. The Plaguebringer believes that the most devastating victories come not from quick strikes, but from carefully cultivated suffering. They see disease as an art form, each affliction a brushstroke in a masterpiece of decay.

**Personality Archetypes**:
- **The Methodical Gardener**: Views afflictions as plants to be cultivated, takes pride in their "work"
- **The Plague Doctor**: Seeks to understand disease to control it, twisted healer archetype
- **The Vengeful Spreader**: Uses plague as retribution, spreading suffering to those who wronged them
- **The Curious Experimenter**: Fascinated by how afflictions evolve and combine, driven by dark curiosity

**Social Dynamics**: Plaguebringers are often feared and avoided. Their very presence suggests contagion and decay. They must decide whether to hide their nature or embrace the terror they inspire.`
    },

    combatRole: {
      title: 'Combat Role',
      content: `**Primary Role**: Damage over time specialist with strong crowd control through debuffs

**Damage Profile**:
- Sustained damage through multiple stacking afflictions
- Burst damage via affliction consumption and evolution
- Area denial through contagion spread

**Control Capabilities**:
- Debuffs that reduce enemy effectiveness
- Crowd control through fear, confusion, and paralysis
- Area control via plague zones and contagion

**Survivability**: Moderate - Plaguebringers can convert healing into damage on enemies and have some self-sustain through dark rejuvenation effects, but are vulnerable to burst damage.`
    },

    playstyle: {
      title: 'Playstyle',
      content: `**Core Mechanic**: Affliction Cultivation. Apply base afflictions, then use category spells (Weaken, Torment, Fester, etc.) to evolve them into devastating final forms.

**Decision Points**:
- Which base affliction to apply to each target
- Which development path to follow for each affliction
- When to evolve afflictions vs. applying new ones
- Which targets to focus cultivation on vs. spreading contagion

**Skill Expression**:
- Tracking multiple afflictions across multiple targets
- Optimal spell sequencing to reach desired final afflictions
- Managing mana while building affliction chains
- Timing affliction consumption for maximum impact

**Team Dynamics**:
- Excels in prolonged encounters where afflictions can fully develop
- Synergizes with classes that can protect them during setup
- Benefits from crowd control to safely cultivate afflictions
- Can spread afflictions to grouped enemies for massive AoE damage`
    }
  },

  // Resource System
  resourceSystem: {
    title: 'Affliction Cultivation',
    subtitle: 'Eight Categories, Infinite Combinations',

    description: `The Affliction Cultivation system is the Plaguebringer's unique mechanic. Base afflictions are applied to targets, then evolved through specific spell categories. Each category spell advances the affliction along a development path, transforming it into increasingly powerful forms. The system rewards strategic planning and careful spell sequencing.`,

    mechanics: {
      title: 'How It Works',
      content: `**Step 1: Apply Base Affliction**
Cast a base affliction spell on a target (e.g., Curse of Agony, Blight of Despair, Venomous Touch).

**Step 2: Cultivate with Category Spells**
Use spells from specific categories to evolve the affliction:
- **Weaken**: Reduce defenses, make vulnerable
- **Torment**: Inflict psychic pain, cause confusion
- **Fester**: Spread decay, infect others
- **Amplify Pain**: Intensify existing suffering
- **Decay**: Accelerate decomposition, reduce healing
- **Nurture**: Strengthen afflictions, convert healing to harm
- **Corrupt**: Twist essence, turn strengths into weaknesses
- **Infect**: Spread contagion, increase vulnerability

**Step 3: Reach Final Affliction**
After following the correct development path (usually 3 category spells), the base affliction evolves into its final, devastating form.

**Example**:
1. Cast **Curse of Agony** (base affliction)
2. Cast **Mind Fracture** (Weaken category) → Affliction advances
3. Cast **Tormenting Visions** (Torment category) → Affliction advances
4. Cast **Amplify Pain** (Amplify Pain category) → Evolves into **Curse of True Agony**
   - Effect: 2d10 psychic damage per turn for 3 turns, stuns target for 2 turns

**Strategic Depth**:
- Different paths lead to different final afflictions
- Can maintain multiple afflictions on different targets
- Some final afflictions spread to nearby enemies
- Timing evolution is critical - evolve too early and waste potential, too late and target may die`
    },

    afflictionPathsTable: {
      title: 'Affliction Development Paths',
      headers: ['Base Affliction', 'Development Path', 'Final Affliction', 'Final Effect'],
      rows: [
        ['Curse of Agony', 'Weaken → Torment → Amplify Pain', 'Curse of True Agony', '2d10 psychic/turn for 3 turns, stun 2 turns'],
        ['Blight of Despair', 'Weaken → Fester → Decay', 'Blight of Despair Enhanced', '-7 STR/DEX for 1 min, disadvantage on attacks'],
        ['Whisper of Decay', 'Torment → Fester → Corrupt', 'Scream of the Plagued', '15ft aura: random attacks for 1 min'],
        ['Venomous Touch', 'Infect → Weaken → Amplify Pain', 'Deadly Caress', '5d6 poison, -5 armor for 1 min'],
        ['Fever Dream', 'Torment → Nurture → Infect', 'Epidemic Nightmare', '3d6 psychic, spreads fear (DC 15) in 5ft'],
        ['Chill of the Void', 'Decay → Weaken → Corrupt', 'Eternal Chill', '10ft freeze, 3d6 cold/turn for 2 turns'],
        ['Mark of the Pestilent', 'Nurture → Decay → Amplify Pain', 'Sigil of the Doomed', '20ft aura: no healing, 3d6 necrotic'],
        ['Retching Malediction', 'Fester → Torment → Nurture', 'Plague of Desolation', '15ft zone: 1d6 damage reduction, healing→poison']
      ]
    },

    categorySpellsTable: {
      title: 'Category Spell Examples',
      headers: ['Category', 'Example Spells', 'Primary Effect', 'Mana Cost Range'],
      rows: [
        ['Weaken', 'Enfeebling Fog, Drain Vitality, Crippling Miasma', 'Reduce defenses, stats, or actions', '4-6 mana'],
        ['Torment', 'Nightmare Pulse, Hallucinogenic Spores, Agonizing Wail', 'Psychic damage, confusion, fear', '6-8 mana'],
        ['Fester', 'Toxic Bloom, Infectious Sores, Plague of Flies', 'Spread damage, infect nearby targets', '5-7 mana'],
        ['Amplify Pain', "Suffering's Echo, Torment Amplifier, Pain Magnification", 'Double/triple existing damage', '8-10 mana'],
        ['Decay', 'Necrotic Burst, Decomposition, Wither Touch', 'Permanent HP loss, reduce healing', '8-10 mana'],
        ['Nurture', 'Dark Rejuvenation, Plague\'s Embrace, Corrupting Miasma', 'Convert healing to damage', '7-10 mana'],
        ['Corrupt', 'Essence Corruption, Perverse Infusion, Blight Seed', 'Turn strengths into weaknesses', '7-9 mana'],
        ['Infect', 'Pandemic Wave, Contagion Burst, Virulent Touch', 'Increase vulnerability, spread plague', '10-12 mana']
      ]
    },



    strategicConsiderations: {
      title: 'Strategic Affliction Management',
      content: `**Single Target Focus (Boss Fights)**:
- Apply base affliction immediately
- Follow optimal development path for maximum damage
- Use Amplify Pain category spells for burst windows
- Time final affliction evolution with team damage phases

**Multi-Target Spread (Trash Packs)**:
- Apply base afflictions to multiple targets
- Use Fester and Infect category spells to spread contagion
- Prioritize afflictions with AoE final forms (Scream of the Plagued, Plague of Desolation)
- Let afflictions spread naturally through contagion mechanics

**Affliction Tracking**:
- **1-2 Active Afflictions**: Easy to manage, focus on optimal paths
- **3-4 Active Afflictions**: Moderate complexity, prioritize high-value targets
- **5+ Active Afflictions**: High skill ceiling, requires careful tracking and sequencing

**Mana Management**:
- Base afflictions are cheap (3-5 mana)
- Category spells are moderate (4-12 mana)
- Plan spell sequences to avoid running out of mana mid-evolution
- Prioritize completing afflictions over starting new ones when low on mana

**Development Path Strategy**:
- **Weaken → Torment → Amplify Pain**: High single-target burst damage
- **Torment → Fester → Corrupt**: Crowd control and AoE spread
- **Nurture → Decay → Amplify Pain**: Anti-healing and sustained damage
- **Infect → Weaken → Amplify Pain**: Vulnerability stacking for team damage

**Team Coordination**:
- Communicate when final afflictions are about to trigger
- Coordinate burst windows with Amplify Pain evolutions
- Use plague zones to control enemy positioning
- Warn allies about contagion spread to avoid friendly fire`
    }
  },

  // Specializations
  specializations: {
    title: 'Plaguebringer Specializations',
    subtitle: 'Three Paths of Pestilence',

    description: `Plaguebringers can specialize in three distinct approaches to affliction cultivation, each focusing on different aspects of disease manipulation and plague spreading.`,

    sharedPassive: {
      name: 'Plague Mastery',
      icon: 'spell_shadow_plaguecloud',
      description: 'Your afflictions last 1d4 additional rounds and resist dispel attempts (roll 1d6, on 5-6 resist). Additionally, whenever an afflicted target dies, you gain 1d4 mana.'
    },

    specs: [
      {
        id: 'virulent-spreader',
        name: 'Virulent Spreader',
        icon: 'ability_creature_disease_05',
        color: '#556B2F',
        description: 'Masters of contagion who excel at spreading afflictions across multiple targets.',

        passive: {
          name: 'Epidemic Mastery',
          description: 'Your Fester and Infect category spells have their spread range increased by 10 ft. When an affliction spreads to a new target, it retains 2 of its 3 development steps (loses 1 step).'
        },

        strengths: [
          'Exceptional multi-target damage',
          'Rapid affliction spread in grouped enemies',
          'Strong area denial through plague zones',
          'Efficient mana usage through contagion'
        ],

        weaknesses: [
          'Lower single-target burst than other specs',
          'Requires enemies to be grouped',
          'Less effective against spread-out targets',
          'Contagion can be unpredictable'
        ],

        playstyleTips: [
          'Focus on afflictions with strong spread mechanics',
          'Use Fester category spells liberally',
          'Position yourself to maximize contagion chains',
          'Prioritize targets in the center of enemy groups'
        ]
      },

      {
        id: 'torment-weaver',
        name: 'Torment Weaver',
        icon: 'spell_shadow_mindtwisting',
        color: '#4B0082',
        description: 'Specialists in psychic afflictions who break minds as easily as bodies.',

        passive: {
          name: 'Psychic Resonance',
          description: 'Your Torment category spells deal +1d6 damage. Additionally, targets affected by your psychic afflictions must roll 1d6 when taking an action - on a 5-6, they attack their nearest ally instead.'
        },

        strengths: [
          'High crowd control potential',
          'Strong against intelligent enemies',
          'Causes chaos in enemy formations',
          'Bypasses physical defenses'
        ],

        weaknesses: [
          'Less effective against mindless enemies',
          'Lower sustained damage than other specs',
          'Requires careful positioning to avoid friendly fire',
          'Psychic resistance can negate effects'
        ],

        playstyleTips: [
          'Prioritize Torment development paths',
          'Target enemy casters and leaders first',
          'Use confusion effects to disrupt enemy strategies',
          'Combine with Corrupt category for maximum chaos'
        ]
      },

      {
        id: 'decay-harbinger',
        name: 'Decay Harbinger',
        icon: 'spell_shadow_deathanddecay',
        color: '#2F4F2F',
        description: 'Masters of necrotic decay who accelerate decomposition and prevent healing.',

        passive: {
          name: 'Accelerated Decay',
          description: 'Your Decay category spells reduce enemy maximum HP by an additional 1d6. Additionally, enemies affected by your afflictions have healing reduced by 1d8 per heal received.'
        },

        strengths: [
          'Exceptional anti-healing capabilities',
          'Permanent HP reduction stacks over time',
          'Strong in prolonged encounters',
          'Counters regeneration and healing-heavy enemies'
        ],

        weaknesses: [
          'Slower damage ramp-up',
          'Less effective in short encounters',
          'Requires sustained pressure',
          'Permanent HP loss can be resisted'
        ],

        playstyleTips: [
          'Focus on Decay and Nurture development paths',
          'Target high-HP enemies and healers',
          'Stack permanent HP reduction effects',
          'Use Dark Rejuvenation to punish enemy healers'
        ]
      }
    ]
  },

  // Example Spells
  exampleSpells: {
    title: 'Example Spells',
    subtitle: 'Showcasing Affliction Cultivation Mechanics',

    sections: [
      {
        id: 'base-afflictions',
        title: 'BASE AFFLICTIONS - Seeds of Decay',
        description: 'Starting points for affliction cultivation. These are applied first, then evolved through category spells.',
        spells: [
          {
            id: 'pb_curse_of_agony',
            name: 'Curse of Agony',
            description: 'Plant a seed of suffering in your target. Deals 1d6 psychic damage per turn for 4 turns. Can be evolved through Weaken → Torment → Amplify Pain into Curse of True Agony.',
            spellType: 'ACTION',
            icon: 'spell_shadow_curseofsargeras',
            school: 'Necromancy',
            level: 1,

            typeConfig: {
              castTime: 1,
              castTimeType: 'IMMEDIATE'
            },

            targetingConfig: {
              targetingType: 'single',
              rangeType: 'ranged',
              rangeDistance: 30
            },

            durationConfig: {
              durationType: 'timed',
              duration: 4,
              durationUnit: 'rounds'
            },

            resourceCost: {
              mana: 3,
              components: ['verbal', 'somatic'],
              verbalText: 'Dolor Aeternus!',
              somaticText: 'Point at target with cursing gesture'
            },

            savingThrow: {
              enabled: true,
              attribute: 'spirit',
              difficulty: 14,
              onSuccess: 'half_damage',
              onFailure: 'full_damage'
            },

            damageConfig: {
              formula: '1d6',
              modifier: 'INTELLIGENCE',
              damageType: 'psychic',
              attackType: 'spell_save'
            },

            effects: {
              damage: {
                overTime: {
                  amount: '1d6 + INT',
                  type: 'psychic',
                  interval: 'round',
                  duration: '4 rounds',
                  description: 'Psychic damage each round'
                }
              },
              affliction: {
                type: 'base_affliction',
                name: 'Curse of Agony',
                developmentPath: 'Weaken → Torment → Amplify Pain',
                finalForm: 'Curse of True Agony',
                trackable: true
              }
            },

            specialMechanics: {
              afflictionCultivation: {
                enabled: true,
                baseAffliction: 'Curse of Agony',
                developmentPath: ['Weaken', 'Torment', 'Amplify Pain'],
                finalAffliction: 'Curse of True Agony',
                finalEffect: '2d10 psychic damage per turn for 3 turns, stuns target for 2 turns'
              }
            },

            tags: ['affliction', 'base', 'psychic', 'curse', 'plaguebringer', 'torment-weaver'],
            flavorText: 'The seed of suffering takes root. Soon, it will bloom into true agony.'
          },

          {
            id: 'pb_venomous_touch',
            name: 'Venomous Touch',
            description: 'Infect your target with virulent poison. Deals 1d8 poison damage initially. Can be evolved through Infect → Weaken → Amplify Pain into Deadly Caress.',
            spellType: 'ACTION',
            icon: 'ability_creature_poison_06',
            school: 'Necromancy',
            level: 1,

            typeConfig: {
              castTime: 1,
              castTimeType: 'IMMEDIATE'
            },

            targetingConfig: {
              targetingType: 'single',
              rangeType: 'melee',
              rangeDistance: 5
            },

            durationConfig: {
              durationType: 'instant'
            },

            resourceCost: {
              mana: 4,
              components: ['verbal', 'somatic'],
              verbalText: 'Venenum Tactus!',
              somaticText: 'Touch target with poisoned hand'
            },

            savingThrow: {
              enabled: true,
              attribute: 'constitution',
              difficulty: 14,
              onSuccess: 'half_damage',
              onFailure: 'full_damage'
            },

            damageConfig: {
              formula: '1d8',
              modifier: 'INTELLIGENCE',
              damageType: 'poison',
              attackType: 'spell_save'
            },

            effects: {
              damage: {
                instant: {
                  amount: '1d8 + INT',
                  type: 'poison',
                  description: 'Immediate poison damage'
                }
              },
              affliction: {
                type: 'base_affliction',
                name: 'Venomous Touch',
                developmentPath: 'Infect → Weaken → Amplify Pain',
                finalForm: 'Deadly Caress',
                trackable: true
              }
            },

            specialMechanics: {
              afflictionCultivation: {
                enabled: true,
                baseAffliction: 'Venomous Touch',
                developmentPath: ['Infect', 'Weaken', 'Amplify Pain'],
                finalAffliction: 'Deadly Caress',
                finalEffect: '5d6 poison damage and -5 armor for 1 minute'
              }
            },

            tags: ['affliction', 'base', 'poison', 'melee', 'plaguebringer', 'virulent-spreader'],
            flavorText: 'A single touch. A lifetime of suffering.'
          }
        ]
      },
      {
        id: 'weaken-category',
        title: 'WEAKEN CATEGORY - Reduce Defenses',
        description: 'Spells that reduce enemy defenses, stats, and actions. Used to advance afflictions along vulnerability paths.',
        spells: [
          {
            id: 'pb_enfeebling_fog',
            name: 'Enfeebling Fog',
            description: 'Conjures a fog over a 20 ft radius. Characters within the fog have their armor reduced by 5 and have disadvantage on ranged attacks. Advances Weaken-path afflictions.',
            spellType: 'ACTION',
            icon: 'spell_shadow_blackplague',
            school: 'Necromancy',
            level: 2,

            typeConfig: {
              castTime: 1,
              castTimeType: 'IMMEDIATE'
            },

            targetingConfig: {
              targetingType: 'area',
              rangeType: 'ranged',
              rangeDistance: 60,
              aoeType: 'sphere',
              aoeSize: 20
            },

            durationConfig: {
              durationType: 'timed',
              duration: 1,
              durationUnit: 'minutes'
            },

            resourceCost: {
              mana: 4,
              components: ['verbal', 'somatic'],
              verbalText: 'Nebula Debilis!',
              somaticText: 'Spread arms to create fog'
            },

            savingThrow: {
              enabled: true,
              attribute: 'spirit',
              difficulty: 14,
              onSuccess: 'no_effect',
              onFailure: 'full_effect'
            },

            resolution: 'AUTOMATIC',

            effects: {
              zone: {
                type: 'debuff_zone',
                radius: 20,
                duration: '1 minute',
                description: 'Fog reduces armor and ranged accuracy'
              },
              debuff: {
                armorReduction: 5,
                disadvantage: 'ranged_attacks',
                duration: '1 minute',
                description: 'Weakened defenses and accuracy'
              }
            },

            specialMechanics: {
              afflictionAdvancement: {
                enabled: true,
                category: 'Weaken',
                description: 'Advances any afflictions on targets in the fog that require Weaken category'
              }
            },

            tags: ['weaken', 'category', 'debuff', 'area', 'plaguebringer'],
            flavorText: 'The fog saps strength and clarity. Defenses crumble.'
          },

          {
            id: 'pb_drain_vitality',
            name: 'Drain Vitality',
            description: 'Drains the life from a melee target, reducing their maximum HP by 1d10+2 and damage dealt by -2. You gain the health drained as temporary HP. Advances Weaken-path afflictions.',
            spellType: 'ACTION',
            icon: 'spell_shadow_lifedrain02',
            school: 'Necromancy',
            level: 2,

            typeConfig: {
              castTime: 1,
              castTimeType: 'IMMEDIATE'
            },

            targetingConfig: {
              targetingType: 'single',
              rangeType: 'melee',
              rangeDistance: 5
            },

            durationConfig: {
              durationType: 'timed',
              duration: 1,
              durationUnit: 'minutes'
            },

            resourceCost: {
              mana: 5,
              components: ['verbal', 'somatic'],
              verbalText: 'Vita Exhaurio!',
              somaticText: 'Grasp target and drain essence'
            },

            savingThrow: {
              enabled: true,
              attribute: 'constitution',
              difficulty: 15,
              onSuccess: 'half_effect',
              onFailure: 'full_effect'
            },

            resolution: 'AUTOMATIC',

            effects: {
              debuff: {
                maxHpReduction: '1d10+2',
                damageReduction: 2,
                duration: '1 minute',
                description: 'Reduced max HP and damage output'
              },
              healing: {
                tempHp: '1d10+2',
                description: 'Gain temporary HP equal to HP drained'
              }
            },

            specialMechanics: {
              afflictionAdvancement: {
                enabled: true,
                category: 'Weaken',
                description: 'Advances any afflictions on the target that require Weaken category'
              },
              savingThrowEffect: {
                onSuccess: 'HP reduction is halved, no temporary HP gained',
                onFailure: 'Full HP reduction and temporary HP gained'
              }
            },

            tags: ['weaken', 'category', 'drain', 'debuff', 'healing', 'plaguebringer'],
            flavorText: 'Your vitality becomes mine. Your strength fades.'
          }
        ]
      },
      {
        id: 'torment-category',
        title: 'TORMENT CATEGORY - Psychic Devastation',
        description: 'Spells that inflict psychic damage, confusion, and fear. Used to advance afflictions along mental breakdown paths.',
        spells: [
          {
            id: 'pb_hallucinogenic_spores',
            name: 'Hallucinogenic Spores',
            description: 'Releases hallucinogenic spores targeting a single enemy in melee range. The affected target hallucinates, seeing allies as foes, and must make an attack against an ally on their next turn. Advances Torment-path afflictions.',
            spellType: 'ACTION',
            icon: 'inv_misc_herb_felblossom',
            school: 'Enchantment',
            level: 2,

            typeConfig: {
              castTime: 1,
              castTimeType: 'IMMEDIATE'
            },

            targetingConfig: {
              targetingType: 'single',
              rangeType: 'melee',
              rangeDistance: 5
            },

            durationConfig: {
              durationType: 'timed',
              duration: 2,
              durationUnit: 'rounds'
            },

            resourceCost: {
              mana: 6,
              components: ['verbal', 'somatic', 'material'],
              verbalText: 'Sporas Dementiae!',
              somaticText: 'Release spores from hand',
              materialText: 'Fungal spores'
            },

            savingThrow: {
              enabled: true,
              attribute: 'spirit',
              difficulty: 12,
              onSuccess: 'disoriented_only',
              onFailure: 'full_effect'
            },

            resolution: 'AUTOMATIC',

            effects: {
              condition: {
                type: 'confused',
                duration: '2 rounds',
                description: 'Target attacks nearest ally on next turn'
              }
            },

            specialMechanics: {
              afflictionAdvancement: {
                enabled: true,
                category: 'Torment',
                description: 'Advances any afflictions on the target that require Torment category'
              },
              savingThrowEffect: {
                onSuccess: 'Target is disoriented but does not attack allies',
                onFailure: 'Target must attack nearest ally on next turn'
              }
            },

            tags: ['torment', 'category', 'psychic', 'confusion', 'plaguebringer', 'torment-weaver'],
            flavorText: 'Friend becomes foe. Reality fractures. Madness blooms.'
          },

          {
            id: 'pb_agonizing_wail',
            name: 'Agonizing Wail',
            description: 'An excruciating wail targets a single enemy within 25 ft, dealing 2d4 psychic damage and paralyzing with fear, causing them to lose their next action/3 AP. Advances Torment-path afflictions.',
            spellType: 'ACTION',
            icon: 'spell_shadow_deathscream',
            school: 'Necromancy',
            level: 3,

            typeConfig: {
              castTime: 1,
              castTimeType: 'IMMEDIATE'
            },

            targetingConfig: {
              targetingType: 'single',
              rangeType: 'ranged',
              rangeDistance: 25
            },

            durationConfig: {
              durationType: 'instant'
            },

            resourceCost: {
              mana: 8,
              components: ['verbal'],
              verbalText: 'ULULATUS DOLORIS!'
            },

            savingThrow: {
              enabled: true,
              attribute: 'spirit',
              difficulty: 16,
              onSuccess: 'half_damage_no_paralyze',
              onFailure: 'full_damage_and_paralyze'
            },

            damageConfig: {
              formula: '2d4',
              modifier: 'INTELLIGENCE',
              damageType: 'psychic',
              attackType: 'spell_save'
            },

            effects: {
              damage: {
                instant: {
                  amount: '2d4 + INT',
                  type: 'psychic',
                  description: 'Immediate psychic damage'
                }
              },
              condition: {
                type: 'paralyzed',
                duration: '1 round',
                description: 'Lose next action (3 AP)'
              }
            },

            specialMechanics: {
              afflictionAdvancement: {
                enabled: true,
                category: 'Torment',
                description: 'Advances any afflictions on the target that require Torment category'
              },
              savingThrowEffect: {
                onSuccess: 'Half damage, not paralyzed',
                onFailure: 'Full damage and paralyzed for 1 round'
              }
            },

            tags: ['torment', 'category', 'psychic', 'paralyze', 'plaguebringer', 'torment-weaver'],
            flavorText: 'The wail of the damned. Terror incarnate. Movement ceases.'
          }
        ]
      },
      {
        id: 'fester-category',
        title: 'FESTER CATEGORY - Spread Decay',
        description: 'Spells that spread damage and infect nearby targets. Used to advance afflictions along contagion paths.',
        spells: [
          {
            id: 'pb_infectious_sores',
            name: 'Infectious Sores',
            description: 'Infects a single target in melee range with open sores that burst if they move, spreading the infection to anyone within 5 ft, dealing 1d4 necrotic damage for 4 turns. Advances Fester-path afflictions.',
            spellType: 'ACTION',
            icon: 'spell_shadow_contagion',
            school: 'Necromancy',
            level: 2,

            typeConfig: {
              castTime: 1,
              castTimeType: 'IMMEDIATE'
            },

            targetingConfig: {
              targetingType: 'single',
              rangeType: 'melee',
              rangeDistance: 5
            },

            durationConfig: {
              durationType: 'until_cured'
            },

            resourceCost: {
              mana: 5,
              components: ['verbal', 'somatic'],
              verbalText: 'Ulcera Contagio!',
              somaticText: 'Touch target to inflict sores'
            },

            savingThrow: {
              enabled: true,
              attribute: 'constitution',
              difficulty: 14,
              onSuccess: 'no_spread',
              onFailure: 'full_effect'
            },

            damageConfig: {
              formula: '1d4',
              modifier: 'INTELLIGENCE',
              damageType: 'necrotic',
              attackType: 'spell_save'
            },

            effects: {
              damage: {
                overTime: {
                  amount: '1d4',
                  type: 'necrotic',
                  interval: 'round',
                  duration: '4 rounds',
                  description: 'Necrotic damage each round'
                }
              },
              contagion: {
                spreadRange: 5,
                spreadCondition: 'target_moves',
                spreadDamage: '1d4',
                description: 'Spreads to nearby creatures if target moves'
              }
            },

            specialMechanics: {
              afflictionAdvancement: {
                enabled: true,
                category: 'Fester',
                description: 'Advances any afflictions on the target that require Fester category'
              },
              spreadMechanic: {
                trigger: 'target_movement',
                range: 5,
                damage: '1d4 necrotic per turn for 4 turns',
                savingThrowEffect: {
                  onSuccess: 'Sores cause 1d4 damage but do not spread',
                  onFailure: 'Sores spread to all within 5 ft when target moves'
                }
              }
            },

            tags: ['fester', 'category', 'necrotic', 'contagion', 'plaguebringer', 'virulent-spreader'],
            flavorText: 'The sores weep. The infection spreads. None are safe.'
          },

          {
            id: 'pb_plague_of_flies',
            name: 'Plague of Flies',
            description: 'Summons a swarm of flies around a single target, causing distraction and 1d4 poison damage per turn, and reducing their sight range by 1d20 ft. Advances Fester-path afflictions.',
            spellType: 'ACTION',
            icon: 'inv_misc_monsterspidercarapace_01',
            school: 'Conjuration',
            level: 2,

            typeConfig: {
              castTime: 1,
              castTimeType: 'IMMEDIATE'
            },

            targetingConfig: {
              targetingType: 'single',
              rangeType: 'ranged',
              rangeDistance: 30
            },

            durationConfig: {
              durationType: 'timed',
              duration: 5,
              durationUnit: 'rounds'
            },

            resourceCost: {
              mana: 7,
              components: ['verbal', 'somatic'],
              verbalText: 'Musca Pestis!',
              somaticText: 'Summon flies with sweeping gesture'
            },

            resolution: 'AUTOMATIC',

            damageConfig: {
              formula: '1d4',
              modifier: 'INTELLIGENCE',
              damageType: 'poison',
              attackType: 'automatic'
            },

            effects: {
              damage: {
                overTime: {
                  amount: '1d4',
                  type: 'poison',
                  interval: 'round',
                  duration: '5 rounds',
                  description: 'Poison damage each round'
                }
              },
              debuff: {
                visionReduction: '1d20 ft',
                duration: '5 rounds',
                description: 'Sight range reduced by 1d20 ft'
              }
            },

            specialMechanics: {
              afflictionAdvancement: {
                enabled: true,
                category: 'Fester',
                description: 'Advances any afflictions on the target that require Fester category'
              }
            },

            tags: ['fester', 'category', 'poison', 'debuff', 'plaguebringer', 'virulent-spreader'],
            flavorText: 'The swarm descends. Vision fails. Decay festers.'
          }
        ]
      },
      {
        id: 'amplify-pain-category',
        title: 'AMPLIFY PAIN CATEGORY - Intensify Suffering',
        description: 'Spells that enhance existing afflictions and multiply damage. Used to advance afflictions along burst damage paths.',
        spells: [
          {
            id: 'pb_sufferings_echo',
            name: "Suffering's Echo",
            description: 'Intensifies the pain of a single afflicted target within 30 ft, doubling the damage of existing conditions and forcing a scream of agony that disorients them for 1 turn. Advances Amplify Pain-path afflictions.',
            spellType: 'ACTION',
            icon: 'spell_shadow_painspike',
            school: 'Necromancy',
            level: 3,

            typeConfig: {
              castTime: 1,
              castTimeType: 'IMMEDIATE'
            },

            targetingConfig: {
              targetingType: 'single',
              rangeType: 'ranged',
              rangeDistance: 30,
              requiresAffliction: true
            },

            durationConfig: {
              durationType: 'instant'
            },

            resourceCost: {
              mana: 9,
              components: ['verbal', 'somatic'],
              verbalText: 'Dolor Duplicatus!',
              somaticText: 'Clench fist to amplify pain'
            },

            savingThrow: {
              enabled: true,
              attribute: 'constitution',
              difficulty: 16,
              onSuccess: 'half_amplification',
              onFailure: 'full_amplification'
            },

            resolution: 'AUTOMATIC',

            effects: {
              amplification: {
                multiplier: 2,
                duration: '1 round',
                description: 'Doubles damage of all existing afflictions'
              },
              condition: {
                type: 'disoriented',
                duration: '1 round',
                description: 'Target is disoriented from pain'
              }
            },

            specialMechanics: {
              afflictionAdvancement: {
                enabled: true,
                category: 'Amplify Pain',
                description: 'Advances any afflictions on the target that require Amplify Pain category'
              },
              savingThrowEffect: {
                onSuccess: 'Damage increased by 1d6 instead of doubled',
                onFailure: 'Damage doubled and target disoriented'
              },
              requiresAffliction: {
                enabled: true,
                description: 'Target must have at least one active affliction'
              }
            },

            tags: ['amplify-pain', 'category', 'amplification', 'plaguebringer'],
            flavorText: 'Pain echoes. Suffering multiplies. Agony intensifies.'
          },

          {
            id: 'pb_pain_magnification',
            name: 'Pain Magnification',
            description: 'Focuses pain on a single enemy, tripling the damage of any pain-related effects for their next turn. Advances Amplify Pain-path afflictions.',
            spellType: 'ACTION',
            icon: 'spell_shadow_shadowwordpain',
            school: 'Necromancy',
            level: 4,

            typeConfig: {
              castTime: 1,
              castTimeType: 'IMMEDIATE'
            },

            targetingConfig: {
              targetingType: 'single',
              rangeType: 'ranged',
              rangeDistance: 30,
              requiresAffliction: true
            },

            durationConfig: {
              durationType: 'timed',
              duration: 1,
              durationUnit: 'rounds'
            },

            resourceCost: {
              mana: 10,
              components: ['verbal', 'somatic'],
              verbalText: 'Dolor Triplicatus!',
              somaticText: 'Focus energy on target'
            },

            savingThrow: {
              enabled: true,
              attribute: 'constitution',
              difficulty: 16,
              onSuccess: 'double_instead',
              onFailure: 'triple'
            },

            resolution: 'AUTOMATIC',

            effects: {
              amplification: {
                multiplier: 3,
                duration: '1 round',
                description: 'Triples damage of all pain-related effects'
              }
            },

            specialMechanics: {
              afflictionAdvancement: {
                enabled: true,
                category: 'Amplify Pain',
                description: 'Advances any afflictions on the target that require Amplify Pain category'
              },
              savingThrowEffect: {
                onSuccess: 'Damage doubled instead of tripled',
                onFailure: 'Damage tripled for next turn'
              },
              requiresAffliction: {
                enabled: true,
                description: 'Target must have at least one active pain-related affliction'
              }
            },

            tags: ['amplify-pain', 'category', 'amplification', 'plaguebringer'],
            flavorText: 'Pain magnified beyond endurance. Suffering absolute.'
          }
        ]
      },
      {
        id: 'decay-category',
        title: 'DECAY CATEGORY - Accelerate Decomposition',
        description: 'Spells that cause permanent HP loss and reduce healing. Used to advance afflictions along necrotic paths.',
        spells: [
          {
            id: 'pb_necrotic_burst',
            name: 'Necrotic Burst',
            description: 'A burst of necrotic energy on a single target within 10 ft causes 3d6 necrotic damage and permanently reduces their max HP by 2d10. Advances Decay-path afflictions.',
            spellType: 'ACTION',
            icon: 'spell_shadow_deathanddecay',
            school: 'Necromancy',
            level: 3,

            typeConfig: {
              castTime: 1,
              castTimeType: 'IMMEDIATE'
            },

            targetingConfig: {
              targetingType: 'single',
              rangeType: 'ranged',
              rangeDistance: 10
            },

            durationConfig: {
              durationType: 'instant'
            },

            resourceCost: {
              mana: 10,
              components: ['verbal', 'somatic'],
              verbalText: 'Necrosis Eruptio!',
              somaticText: 'Release burst of necrotic energy'
            },

            savingThrow: {
              enabled: true,
              attribute: 'constitution',
              difficulty: 17,
              onSuccess: 'reduced_effect',
              onFailure: 'full_effect'
            },

            damageConfig: {
              formula: '3d6',
              modifier: 'INTELLIGENCE',
              damageType: 'necrotic',
              attackType: 'spell_save'
            },

            effects: {
              damage: {
                instant: {
                  amount: '3d6 + INT',
                  type: 'necrotic',
                  description: 'Immediate necrotic damage'
                }
              },
              permanentDebuff: {
                maxHpReduction: '2d10',
                permanent: true,
                description: 'Permanently reduces max HP by 2d10'
              }
            },

            specialMechanics: {
              afflictionAdvancement: {
                enabled: true,
                category: 'Decay',
                description: 'Advances any afflictions on the target that require Decay category'
              },
              savingThrowEffect: {
                onSuccess: 'Damage is 2d6 and max HP reduction is 1d10',
                onFailure: 'Full damage and 2d10 max HP reduction'
              }
            },

            tags: ['decay', 'category', 'necrotic', 'permanent', 'plaguebringer', 'decay-harbinger'],
            flavorText: 'Flesh rots. Life force diminishes. Decay is permanent.'
          },

          {
            id: 'pb_wither_touch',
            name: 'Wither Touch',
            description: 'A touch attack that withers a single enemy, dealing 4d4 necrotic damage and reducing their healing received by 1d8 per heal for 5 turns. Advances Decay-path afflictions.',
            spellType: 'ACTION',
            icon: 'spell_shadow_soulleech',
            school: 'Necromancy',
            level: 3,

            typeConfig: {
              castTime: 1,
              castTimeType: 'IMMEDIATE'
            },

            targetingConfig: {
              targetingType: 'single',
              rangeType: 'melee',
              rangeDistance: 5
            },

            durationConfig: {
              durationType: 'instant'
            },

            resourceCost: {
              mana: 9,
              components: ['verbal', 'somatic'],
              verbalText: 'Tactus Marcescens!',
              somaticText: 'Touch target with withering hand'
            },

            savingThrow: {
              enabled: true,
              attribute: 'constitution',
              difficulty: 16,
              onSuccess: 'reduced_effect',
              onFailure: 'full_effect'
            },

            damageConfig: {
              formula: '4d4',
              modifier: 'INTELLIGENCE',
              damageType: 'necrotic',
              attackType: 'spell_save'
            },

            effects: {
              damage: {
                instant: {
                  amount: '4d4 + INT',
                  type: 'necrotic',
                  description: 'Immediate necrotic damage'
                }
              },
              debuff: {
                healingReduction: '1d8',
                duration: '5 rounds',
                description: 'Healing received is reduced by 1d8 per heal'
              }
            },

            specialMechanics: {
              afflictionAdvancement: {
                enabled: true,
                category: 'Decay',
                description: 'Advances any afflictions on the target that require Decay category'
              },
              savingThrowEffect: {
                onSuccess: 'Damage halved and healing reduction lasts 2 rounds',
                onFailure: 'Full damage and healing reduction lasts 5 rounds'
              }
            },

            tags: ['decay', 'category', 'necrotic', 'anti-healing', 'plaguebringer', 'decay-harbinger'],
            flavorText: 'The touch of death. Healing fails. Withering spreads.'
          }
        ]
      },
      {
        id: 'nurture-category',
        title: 'NURTURE CATEGORY - Strengthen Afflictions',
        description: 'Spells that convert healing to damage and strengthen plagues. Used to advance afflictions along anti-healing paths.',
        spells: [
          {
            id: 'pb_dark_rejuvenation',
            name: 'Dark Rejuvenation',
            description: 'Converts any healing on a single target within 20 ft into necrotic damage equal to the amount healed. Advances Nurture-path afflictions.',
            spellType: 'ACTION',
            icon: 'spell_shadow_darkritual',
            school: 'Necromancy',
            level: 3,

            typeConfig: {
              castTime: 1,
              castTimeType: 'IMMEDIATE'
            },

            targetingConfig: {
              targetingType: 'single',
              rangeType: 'ranged',
              rangeDistance: 20
            },

            durationConfig: {
              durationType: 'timed',
              duration: 3,
              durationUnit: 'rounds'
            },

            resourceCost: {
              mana: 8,
              components: ['verbal', 'somatic'],
              verbalText: 'Sanatio Inversa!',
              somaticText: 'Twist healing energy into harm'
            },

            savingThrow: {
              enabled: true,
              attribute: 'spirit',
              difficulty: 15,
              onSuccess: 'reduced_effect',
              onFailure: 'full_effect'
            },

            resolution: 'AUTOMATIC',

            effects: {
              curse: {
                type: 'healing_inversion',
                duration: '3 rounds',
                description: 'All healing becomes necrotic damage'
              }
            },

            specialMechanics: {
              afflictionAdvancement: {
                enabled: true,
                category: 'Nurture',
                description: 'Advances any afflictions on the target that require Nurture category'
              },
              healingInversion: {
                conversion: 'full',
                damageType: 'necrotic',
                description: 'All healing received becomes necrotic damage instead'
              },
              savingThrowEffect: {
                onSuccess: 'Healing is reduced by 1d8 instead of converted',
                onFailure: 'All healing becomes necrotic damage for 3 rounds'
              }
            },

            tags: ['nurture', 'category', 'curse', 'anti-healing', 'plaguebringer', 'decay-harbinger'],
            flavorText: 'Healing becomes harm. Life becomes death. Nurture becomes nightmare.'
          },

          {
            id: 'pb_plagues_embrace',
            name: "Plague's Embrace",
            description: 'Grants a single ally within 10 ft an aura that reflects 1d10 necrotic damage back to attackers. Advances Nurture-path afflictions on enemies who attack the ally.',
            spellType: 'ACTION',
            icon: 'spell_shadow_plaguecloud',
            school: 'Necromancy',
            level: 2,

            typeConfig: {
              castTime: 1,
              castTimeType: 'IMMEDIATE'
            },

            targetingConfig: {
              targetingType: 'single',
              rangeType: 'ranged',
              rangeDistance: 10,
              validTargets: 'ally'
            },

            durationConfig: {
              durationType: 'timed',
              duration: 3,
              durationUnit: 'rounds'
            },

            resourceCost: {
              mana: 7,
              components: ['verbal', 'somatic'],
              verbalText: 'Amplexus Pestis!',
              somaticText: 'Wrap ally in plague aura'
            },

            resolution: 'AUTOMATIC',

            effects: {
              buff: {
                type: 'damage_reflection',
                amount: '1d10',
                damageType: 'necrotic',
                duration: '3 rounds',
                description: 'Reflects 1d10 necrotic damage to attackers'
              }
            },

            specialMechanics: {
              afflictionAdvancement: {
                enabled: true,
                category: 'Nurture',
                description: 'Advances any afflictions on enemies who attack the buffed ally'
              },
              damageReflection: {
                amount: '1d10',
                damageType: 'necrotic',
                description: 'Attackers take 1d10 necrotic damage when they attack the buffed ally'
              }
            },

            tags: ['nurture', 'category', 'buff', 'reflection', 'plaguebringer'],
            flavorText: 'The plague protects. Attackers suffer. Allies endure.'
          }
        ]
      },
      {
        id: 'corrupt-category',
        title: 'CORRUPT CATEGORY - Twist Essence',
        description: 'Spells that turn strengths into weaknesses. Used to advance afflictions along corruption paths.',
        spells: [
          {
            id: 'pb_essence_corruption',
            name: 'Essence Corruption',
            description: 'Corrupts a single target within 15 ft, causing them to emit a 1d10 necrotic damage aura to their allies at the start of their turn. Advances Corrupt-path afflictions.',
            spellType: 'ACTION',
            icon: 'spell_shadow_shadesofdarkness',
            school: 'Necromancy',
            level: 3,

            typeConfig: {
              castTime: 1,
              castTimeType: 'IMMEDIATE'
            },

            targetingConfig: {
              targetingType: 'single',
              rangeType: 'ranged',
              rangeDistance: 15
            },

            durationConfig: {
              durationType: 'timed',
              duration: 3,
              durationUnit: 'rounds'
            },

            resourceCost: {
              mana: 8,
              components: ['verbal', 'somatic'],
              verbalText: 'Essentia Corruptio!',
              somaticText: 'Corrupt target\'s essence'
            },

            savingThrow: {
              enabled: true,
              attribute: 'spirit',
              difficulty: 15,
              onSuccess: 'reduced_aura',
              onFailure: 'full_aura'
            },

            damageConfig: {
              formula: '1d10',
              modifier: 'INTELLIGENCE',
              damageType: 'necrotic',
              attackType: 'automatic'
            },

            effects: {
              aura: {
                damage: '1d10',
                damageType: 'necrotic',
                radius: 10,
                targets: 'allies_of_target',
                duration: '3 rounds',
                description: 'Target emits harmful aura to their allies'
              }
            },

            specialMechanics: {
              afflictionAdvancement: {
                enabled: true,
                category: 'Corrupt',
                description: 'Advances any afflictions on the target that require Corrupt category'
              },
              savingThrowEffect: {
                onSuccess: 'Aura deals 1d4 damage',
                onFailure: 'Aura deals 1d10 damage'
              }
            },

            tags: ['corrupt', 'category', 'aura', 'necrotic', 'plaguebringer'],
            flavorText: 'Ally becomes enemy. Friend becomes foe. Corruption spreads.'
          },

          {
            id: 'pb_perverse_infusion',
            name: 'Perverse Infusion',
            description: "Converts an enemy's highest ability score bonus into a penalty of the same value. Advances Corrupt-path afflictions.",
            spellType: 'ACTION',
            icon: 'spell_shadow_twistedfaith',
            school: 'Necromancy',
            level: 4,

            typeConfig: {
              castTime: 1,
              castTimeType: 'IMMEDIATE'
            },

            targetingConfig: {
              targetingType: 'single',
              rangeType: 'ranged',
              rangeDistance: 30
            },

            durationConfig: {
              durationType: 'timed',
              duration: 1,
              durationUnit: 'minutes'
            },

            resourceCost: {
              mana: 9,
              components: ['verbal', 'somatic'],
              verbalText: 'Virtus Inversa!',
              somaticText: 'Invert target\'s strengths'
            },

            savingThrow: {
              enabled: true,
              attribute: 'spirit',
              difficulty: 16,
              onSuccess: 'half_penalty',
              onFailure: 'full_penalty'
            },

            resolution: 'AUTOMATIC',

            effects: {
              debuff: {
                type: 'stat_inversion',
                duration: '1 minute',
                description: 'Highest ability score bonus becomes penalty'
              }
            },

            specialMechanics: {
              afflictionAdvancement: {
                enabled: true,
                category: 'Corrupt',
                description: 'Advances any afflictions on the target that require Corrupt category'
              },
              statInversion: {
                target: 'highest_ability_score',
                effect: 'bonus_becomes_penalty',
                example: '+5 STR becomes -5 STR'
              },
              savingThrowEffect: {
                onSuccess: 'Penalty is half the value of the bonus',
                onFailure: 'Full bonus becomes full penalty'
              }
            },

            tags: ['corrupt', 'category', 'debuff', 'stat-inversion', 'plaguebringer'],
            flavorText: 'Strength becomes weakness. Power becomes frailty. Corruption complete.'
          }
        ]
      },
      {
        id: 'infect-category',
        title: 'INFECT CATEGORY - Spread Contagion',
        description: 'Spells that increase vulnerability and spread plague. Used to advance afflictions along epidemic paths.',
        spells: [
          {
            id: 'pb_virulent_touch',
            name: 'Virulent Touch',
            description: 'Causes a virulent reaction in a single target in melee range, dealing 4d6 poison damage and infecting all within 5 ft with a simple plague that deals 1d4 poison damage per turn. Advances Infect-path afflictions.',
            spellType: 'ACTION',
            icon: 'ability_creature_disease_01',
            school: 'Necromancy',
            level: 4,

            typeConfig: {
              castTime: 1,
              castTimeType: 'IMMEDIATE'
            },

            targetingConfig: {
              targetingType: 'single',
              rangeType: 'melee',
              rangeDistance: 5
            },

            durationConfig: {
              durationType: 'instant'
            },

            resourceCost: {
              mana: 11,
              components: ['verbal', 'somatic'],
              verbalText: 'Tactus Virulentus!',
              somaticText: 'Touch target to spread virulent plague'
            },

            savingThrow: {
              enabled: true,
              attribute: 'constitution',
              difficulty: 17,
              onSuccess: 'reduced_effect',
              onFailure: 'full_effect'
            },

            damageConfig: {
              formula: '4d6',
              modifier: 'INTELLIGENCE',
              damageType: 'poison',
              attackType: 'spell_save'
            },

            effects: {
              damage: {
                instant: {
                  amount: '4d6 + INT',
                  type: 'poison',
                  description: 'Immediate poison damage to primary target'
                }
              },
              contagion: {
                spreadRange: 5,
                spreadDamage: '1d4',
                spreadDuration: '4 rounds',
                description: 'Infects all within 5 ft with plague'
              }
            },

            specialMechanics: {
              afflictionAdvancement: {
                enabled: true,
                category: 'Infect',
                description: 'Advances any afflictions on the target that require Infect category'
              },
              spreadMechanic: {
                range: 5,
                damage: '1d4 poison per turn for 4 turns',
                targets: 'all_within_range'
              },
              savingThrowEffect: {
                onSuccess: 'Damage is 2d6 and infection is minor',
                onFailure: 'Full damage and full infection spread'
              }
            },

            tags: ['infect', 'category', 'poison', 'contagion', 'plaguebringer', 'virulent-spreader'],
            flavorText: 'One touch. Many infected. The plague spreads.'
          },

          {
            id: 'pb_contagion_burst',
            name: 'Contagion Burst',
            description: 'Creates a burst on a single target in melee range, initially dealing 2d6 poison damage and increasing by 1d6 for each subsequent Contagion Burst. Advances Infect-path afflictions.',
            spellType: 'ACTION',
            icon: 'spell_nature_corrosivebreath',
            school: 'Necromancy',
            level: 3,

            typeConfig: {
              castTime: 1,
              castTimeType: 'IMMEDIATE'
            },

            targetingConfig: {
              targetingType: 'single',
              rangeType: 'melee',
              rangeDistance: 5
            },

            durationConfig: {
              durationType: 'instant'
            },

            resourceCost: {
              mana: 10,
              components: ['verbal', 'somatic'],
              verbalText: 'Contagio Eruptio!',
              somaticText: 'Release contagion burst'
            },

            savingThrow: {
              enabled: true,
              attribute: 'constitution',
              difficulty: 16,
              onSuccess: 'reduced_damage',
              onFailure: 'full_damage'
            },

            damageConfig: {
              formula: '2d6',
              modifier: 'INTELLIGENCE',
              damageType: 'poison',
              attackType: 'spell_save'
            },

            effects: {
              damage: {
                instant: {
                  amount: '2d6 + INT',
                  type: 'poison',
                  description: 'Initial poison damage'
                }
              },
              stacking: {
                increment: '1d6',
                description: 'Each subsequent cast increases damage by 1d6'
              }
            },

            specialMechanics: {
              afflictionAdvancement: {
                enabled: true,
                category: 'Infect',
                description: 'Advances any afflictions on the target that require Infect category'
              },
              stackingDamage: {
                initial: '2d6',
                increment: '1d6',
                description: 'Damage increases with each cast on same target',
                example: '1st cast: 2d6, 2nd cast: 3d6, 3rd cast: 4d6, etc.'
              },
              savingThrowEffect: {
                onSuccess: 'Initial damage is 1d6 and effect spread is reduced',
                onFailure: 'Full damage and stacking effect applies'
              }
            },

            tags: ['infect', 'category', 'poison', 'stacking', 'plaguebringer', 'virulent-spreader'],
            flavorText: 'The contagion builds. Each burst stronger. Infection inevitable.'
          }
        ]
      }
    ]
  }
};

export default PLAGUEBRINGER_DATA;
