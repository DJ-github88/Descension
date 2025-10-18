/**
 * Minstrel Class Data
 * 
 * Complete class information for the Minstrel - a musical spellcaster
 * who weaves magic through chord progressions and harmonic resonance.
 */

export const MINSTREL_DATA = {
  id: 'minstrel',
  name: 'Minstrel',
  icon: 'fas fa-music',
  role: 'Support',

  // Overview section
  overview: {
    title: 'The Minstrel',
    subtitle: 'Master of Musical Magic',
    
    description: `The Minstrel is a master of musical magic, weaving spells through intricate chord progressions and harmonic resonance. By combining spells with specific musical functions, the Minstrel creates harmonious effects that support allies, hinder foes, and manipulate the battlefield through the power of song. Their unique mechanic revolves around building musical notes and resolving them into powerful cadences.`,
    
    roleplayIdentity: {
      title: 'Roleplay Identity',
      content: `Minstrels are wandering performers, court musicians, battlefield drummers, and mystical bards who have discovered that music is not merely art—it is a fundamental force of reality. Through years of study and practice, they've learned to channel magic through musical theory, turning chord progressions into tangible power.

Their instruments are their spellcasting foci, and each Minstrel develops a unique relationship with their chosen instrument. Some carry ancient lutes passed down through generations, others wield war drums that echo with ancestral spirits, while still others use their own voice as their primary instrument.

In roleplay, Minstrels often serve as:
- **The Traveling Bard**: Collecting songs and stories while secretly gathering magical power
- **The Court Musician**: Using their position to influence politics and protect their patrons
- **The Battle Hymn Singer**: Leading troops with inspiring war songs and devastating sonic attacks
- **The Mystical Composer**: Seeking the perfect song that will unlock ultimate magical power
- **The Instrument Collector**: Hunting for legendary instruments with unique magical properties

Minstrels understand that every sound has meaning, every rhythm has power, and every melody can change the world. They see music in everything—the clash of swords, the rhythm of footsteps, the harmony of voices in conversation.`
    },
    
    combatRole: {
      title: 'Combat Role',
      content: `The Minstrel is a versatile support class that excels at:

**Adaptive Support**: Can switch between healing, buffing, and damage based on the situation
**Combo Gameplay**: Building musical notes and resolving them into powerful cadences creates engaging tactical decisions
**Area Effects**: Most Minstrel abilities affect multiple allies or enemies, making positioning crucial
**Sustained Power**: Unlike burst classes, Minstrels build power over time through careful note management

**Strengths**:
- Excellent multi-target support capabilities
- High versatility through different chord progressions
- Strong sustained healing and buffing
- Unique utility through musical effects
- Can adapt to different party compositions

**Weaknesses**:
- Requires setup time to build notes
- Less effective when caught alone
- Lower burst healing than dedicated healers
- Combo system requires planning and foresight
- Vulnerable to silence and interruption effects

The Minstrel shines in group content where they can orchestrate the flow of battle, building notes through builder spells and unleashing devastating cadences at critical moments.`
    },
    
    playstyle: {
      title: 'Playstyle & Strategy',
      content: `Playing a Minstrel is about reading the rhythm of battle and conducting your party to victory. Key strategic considerations:

**Note Management**:
- Each spell generates specific musical notes (I, II, III, IV, V, VI, VII)
- Notes stack up to 5 of each type
- Notes persist between combats but decay slowly (1 note per minute out of combat)
- Managing your note economy is crucial to having the right cadences available

**Chord Progression Planning**:
- **Perfect Cadence (I-IV-V-I)**: Guarantees ally critical hit - save for crucial moments
- **Deceptive Cadence (IV-VII-V-IV)**: Stuns enemies - use for crowd control
- **Circle of Fifths (V-I-VI-V)**: Damage over time - apply early in fights
- **Plagal Cadence (VI-V-I-III)**: Speed boost - use for repositioning or pursuit
- **Half Cadence (VII-V-IV-VI)**: Shield - preemptive defense before big attacks

**Instrument Selection**:
Different instruments provide different bonuses and affect your playstyle:
- **Lute/Harp**: Bonus to healing and charm effects
- **Drum**: Bonus to damage and buff duration
- **Flute/Horn**: Increased range and area of effect
- **Voice**: No equipment required, bonus to all effects but shorter range

**Specialization Synergies**:
- **Battlechoir**: Aggressive support, damage amplification, war songs
- **Soulsinger**: Healing focus, emotional manipulation, protective melodies
- **Dissonance**: Debuffs and control, chaotic magic, reality-warping sounds

**Team Dynamics**:
- Works best with coordinated teams who can capitalize on buffs
- Synergizes with classes that benefit from critical hits (Battlechoir)
- Provides sustained healing for prolonged encounters (Soulsinger)
- Offers crowd control for tactical teams (Dissonance)`
    }
  },
  
  // Resource System
  resourceSystem: {
    title: 'Musical Combo System',
    subtitle: 'Chord Progressions & Harmonic Resonance',
    
    description: `The Minstrel's unique resource system is based on Western music theory. Builder spells generate musical notes (I through VII), and Resolving spells consume specific note combinations to create powerful cadences. Mastering the Minstrel requires understanding both musical theory and tactical timing.`,
    
    mechanics: {
      title: 'How It Works',
      content: `**Musical Notes**: The foundation of Minstrel magic

**Builder Spells** generate specific musical notes:
- Each spell generates 1-3 notes of specific types
- Notes stack up to 5 of each type (I, II, III, IV, V, VI, VII)
- Notes persist between combats
- Notes decay at 1 per minute when out of combat

**Resolving Spells** consume note combinations:
- Require specific sequences of notes (e.g., V→I for Perfect Cadence)
- Consume the notes used in the progression
- Create powerful effects based on the cadence type
- Some progressions have multiple valid orderings

**Note Persistence**:
- Notes remain after combat, allowing you to prepare for the next encounter
- Strategic players can build notes during downtime
- Decay prevents infinite stacking but allows short-term planning

**Instrument Effects**:
Your chosen instrument modifies your abilities:
- **Lute**: +2 to healing, advantage on charm effects
- **War Drum**: +1d4 to damage spells, +1 turn to buff duration
- **Flute**: +10 ft to spell range, +5 ft to AOE radius
- **Horn**: +15 ft to spell range, allies hear you through walls
- **Voice**: No equipment needed, +1 to all effects, -10 ft range`
    },

    musicalNotesTable: {
      title: 'Musical Notes System',
      headers: ['Note', 'Function', 'Thematic Role', 'Generated By'],
      rows: [
        ['I (Tonic)', 'Foundation', 'Stability and home', 'Basic attacks, defensive spells'],
        ['II (Supertonic)', 'Mild Tension', 'Creates dissonance', 'Debuff and control spells'],
        ['III (Mediant)', 'Color', 'Emotional depth', 'Charm and emotion spells'],
        ['IV (Subdominant)', 'Movement', 'Forward motion', 'Support and healing spells'],
        ['V (Dominant)', 'Strong Tension', 'Demands resolution', 'Offensive spells'],
        ['VI (Submediant)', 'Relative Minor', 'Melancholy and depth', 'Fear and sorrow spells'],
        ['VII (Leading Tone)', 'Urgent Tension', 'Pulls to tonic', 'Finisher and climax spells']
      ]
    },

    chordProgressionsTable: {
      title: 'Chord Progressions & Cadences',
      headers: ['Progression', 'Name', 'Sequence', 'Effect', 'Tactical Use'],
      rows: [
        ['Perfect Cadence', 'Harmonious Resolution', 'I→IV→V→I', 'Ally\'s next attack is guaranteed critical hit', 'Save for boss damage phases'],
        ['Deceptive Cadence', 'Enchanter\'s Trick', 'IV→VII→V→IV', 'Stun enemy (DC 15 save)', 'Interrupt dangerous casts'],
        ['Circle of Fifths', 'Eternal Torment', 'V→I→VI→V', '2d4 DoT for 3 turns (30 ft radius)', 'Apply early to groups'],
        ['Plagal Cadence', 'Sacred Ascent', 'VI→V→I→III', '+20 ft speed, +2 Dex for 2 turns', 'Repositioning or pursuit'],
        ['Half Cadence', 'Arcane Shield', 'VII→V→IV→VI', '2d6 shield for 2 turns (15 ft radius)', 'Pre-cast before big attacks'],
        ['Authentic Cadence', 'Grand Finale', 'I→VI→III→I', '-4 damage taken, restore 1d8 HP (20 ft radius)', 'Survive burst damage'],
        ['Phrygian Cadence', 'Ancient Resolve', 'V→IV→I→VII', 'Advantage on attacks for 2 turns', 'Boost damage dealers'],
        ['Neapolitan Sixth', 'Mystical Precision', 'III→I→IV→V', '+2 crit chance next turn', 'Stack with other crit buffs'],
        ['Tritone Substitution', 'Dissonant Chains', 'IV→I→V→VI', 'Paralyze enemy (DC 18 save, 30 ft)', 'Lock down priority targets'],
        ['Picardy Third', 'Triumph of Light', 'I→VII→V→III', '+2 to saves, restore 2d6 HP (20 ft)', 'Counter debuff-heavy enemies']
      ]
    },

    strategicConsiderations: {
      title: 'Strategic Considerations',
      content: `**Early Combat (Turns 1-3)**: Focus on building notes with efficient builder spells. Prioritize notes for your most-needed cadences.

**Mid Combat (Turns 4-6)**: Begin resolving cadences. Use defensive cadences (Half Cadence, Authentic Cadence) to sustain your party, or offensive ones (Circle of Fifths, Phrygian Cadence) to pressure enemies.

**Late Combat (Turns 7+)**: Unleash your most powerful cadences. Perfect Cadence can secure kills, Tritone Substitution can lock down remaining threats.

**Between Combats**: Maintain 2-3 notes of each type as a "baseline" for quick cadence access. Let excess notes decay naturally.

**Instrument Choice**:
- **Lute** for healing-focused builds (Soulsinger)
- **War Drum** for aggressive support (Battlechoir)
- **Flute** for ranged safety and large groups
- **Voice** for versatility when you can't carry instruments`
    }
  },

  // Specializations
  specializations: {
    title: 'Minstrel Specializations',
    subtitle: 'Three Paths of Musical Mastery',

    description: `Every Minstrel chooses one of three specializations that define their musical style and magical focus. Each specialization offers unique passive abilities and influences your spell selection and playstyle.`,

    specs: [
      {
        id: 'battlechoir',
        name: 'Battlechoir',
        icon: 'spell_holy_crusaderstrike',
        color: '#DC143C',
        theme: 'War Songs & Aggressive Support',

        description: `Battlechoir Minstrels are battlefield commanders who turn combat into a symphony of destruction. Their war songs amplify ally damage, grant tactical advantages, and demoralize enemies. They favor drums, horns, and powerful vocals that can be heard over the chaos of battle.`,

        playstyle: 'Aggressive support, damage amplification, offensive buffs',

        strengths: [
          'Highest damage amplification for allies',
          'Strong offensive cadences',
          'Excellent for coordinated teams',
          'War drums provide bonus damage'
        ],

        weaknesses: [
          'Lower healing output than Soulsinger',
          'Requires allies to capitalize on buffs',
          'Less effective when team is scattered',
          'Vulnerable when focused'
        ],

        passiveAbilities: [
          {
            name: 'Harmonic Resonance',
            tier: 'Path Passive',
            description: 'When you complete a 4-note cadence, all allies within 30 feet gain +1d4 to their next attack or spell. This bonus stacks up to 3 times.',
            sharedBy: 'All Minstrels'
          },
          {
            name: 'War Anthem',
            tier: 'Specialization Passive',
            description: 'Your offensive cadences (Circle of Fifths, Phrygian Cadence, Neapolitan Sixth) grant all affected allies +2 to attack rolls for 2 turns. Additionally, when an ally scores a critical hit while affected by your buffs, you generate 1 random musical note.',
            uniqueTo: 'Battlechoir'
          }
        ],

        recommendedFor: 'Players who enjoy empowering their team, coordinated tactics, and aggressive playstyles'
      },

      {
        id: 'soulsinger',
        name: 'Soulsinger',
        icon: 'spell_holy_prayerofhealing',
        color: '#4169E1',
        theme: 'Healing Melodies & Emotional Magic',

        description: `Soulsingers are empathic healers who channel emotion through music. Their gentle melodies soothe wounds, calm fears, and restore hope. They understand that music touches the soul, and through this connection, they can heal both body and spirit. Soulsingers favor lutes, harps, and soft vocals.`,

        playstyle: 'Sustained healing, emotional manipulation, protective support',

        strengths: [
          'Strongest healing output',
          'Excellent sustained support',
          'Emotional manipulation abilities',
          'Can heal while building notes'
        ],

        weaknesses: [
          'Lower damage contribution',
          'Less burst healing than dedicated healers',
          'Requires mana management',
          'Vulnerable to interruption'
        ],

        passiveAbilities: [
          {
            name: 'Harmonic Resonance',
            tier: 'Path Passive',
            description: 'When you complete a 4-note cadence, all allies within 30 feet gain +1d4 to their next attack or spell. This bonus stacks up to 3 times.',
            sharedBy: 'All Minstrels'
          },
          {
            name: 'Soothing Melody',
            tier: 'Specialization Passive',
            description: 'Your healing cadences (Authentic Cadence, Picardy Third) heal for an additional 1d6 HP. Additionally, whenever you heal an ally, you generate 1 Tonic (I) note. When using a Lute or Harp, healing is increased by an additional +2.',
            uniqueTo: 'Soulsinger'
          }
        ],

        recommendedFor: 'Players who enjoy healing, supporting their team, and emotional roleplay'
      },

      {
        id: 'dissonance',
        name: 'Dissonance',
        icon: 'spell_shadow_psychicscream',
        color: '#8B008B',
        theme: 'Chaotic Sounds & Reality Warping',

        description: `Dissonance Minstrels have discovered that not all music is harmonious—and that chaos has its own terrible beauty. They wield discordant sounds, atonal melodies, and reality-warping frequencies that confuse, terrify, and control. Their music is an assault on the senses and the mind itself.`,

        playstyle: 'Crowd control, debuffs, chaotic effects, reality manipulation',

        strengths: [
          'Best crowd control capabilities',
          'Powerful debuffs and fear effects',
          'Unique reality-warping abilities',
          'Excels against grouped enemies'
        ],

        weaknesses: [
          'Lowest healing output',
          'Chaotic effects can be unpredictable',
          'Requires careful positioning',
          'Less effective against single targets'
        ],

        passiveAbilities: [
          {
            name: 'Harmonic Resonance',
            tier: 'Path Passive',
            description: 'When you complete a 4-note cadence, all allies within 30 feet gain +1d4 to their next attack or spell. This bonus stacks up to 3 times.',
            sharedBy: 'All Minstrels'
          },
          {
            name: 'Cacophony',
            tier: 'Specialization Passive',
            description: 'Your control cadences (Deceptive Cadence, Tritone Substitution) have their save DC increased by 2. Additionally, when an enemy fails a save against your cadence, all enemies within 10 feet must make a Wisdom save (DC 13) or become frightened for 1 turn. Dissonant sounds echo unpredictably.',
            uniqueTo: 'Dissonance'
          }
        ],

        recommendedFor: 'Players who enjoy control, debuffs, and unpredictable chaotic magic'
      }
    ]
  },

  // Example Spells - showcasing the spell wizard system
  exampleSpells: [
    // Builder Spells - Generate Musical Notes
    {
      id: 'minstrel_opening_chord',
      name: 'Opening Chord',
      description: 'Strike a resonant chord that generates foundational notes and deals minor sonic damage.',
      spellType: 'ACTION',
      icon: 'spell_holy_divinepurpose',
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
        mana: 10,
        components: ['verbal', 'somatic'],
        verbalText: 'Resonare!',
        somaticText: 'Strum instrument or gesture musically'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '1d6',
        damageType: 'thunder',
        scalingType: 'none'
      },

      effects: {
        damage: {
          instant: {
            formula: '1d6',
            type: 'thunder'
          }
        }
      },

      specialMechanics: {
        musicalCombo: {
          type: 'builder',
          generates: [
            { note: 'I', count: 2 },
            { note: 'V', count: 1 }
          ]
        }
      },

      tags: ['builder', 'basic', 'sonic', 'tonic-generator']
    },

    {
      id: 'minstrel_healing_hymn',
      name: 'Healing Hymn',
      description: 'Sing a soothing melody that heals an ally and generates subdominant notes.',
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
        rangeDistance: 40
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 15,
        components: ['verbal'],
        verbalText: 'Melodic healing verse'
      },

      resolution: 'DICE',

      effects: {
        healing: {
          instant: {
            formula: '2d6+2',
            type: 'magical'
          }
        }
      },

      specialMechanics: {
        musicalCombo: {
          type: 'builder',
          generates: [
            { note: 'IV', count: 2 },
            { note: 'I', count: 1 }
          ]
        },
        instrumentBonus: {
          lute: { healingBonus: 2 },
          harp: { healingBonus: 2 }
        }
      },

      tags: ['builder', 'healing', 'subdominant-generator', 'soulsinger']
    },

    {
      id: 'minstrel_war_drum',
      name: 'War Drum Beat',
      description: 'Beat a powerful rhythm that damages enemies and generates dominant notes.',
      spellType: 'ACTION',
      icon: 'ability_warrior_warcry',
      school: 'Evocation',
      level: 2,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'aoe',
        rangeType: 'ranged',
        rangeDistance: 30,
        aoeType: 'sphere',
        aoeSize: 15
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 20,
        components: ['somatic'],
        somaticText: 'Beat drum or stomp rhythmically'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '2d4',
        damageType: 'thunder',
        scalingType: 'none'
      },

      effects: {
        damage: {
          instant: {
            formula: '2d4',
            type: 'thunder'
          }
        }
      },

      specialMechanics: {
        musicalCombo: {
          type: 'builder',
          generates: [
            { note: 'V', count: 3 }
          ]
        },
        instrumentBonus: {
          drum: { damageBonus: '1d4' }
        }
      },

      tags: ['builder', 'aoe', 'damage', 'dominant-generator', 'battlechoir']
    },

    {
      id: 'minstrel_dissonant_shriek',
      name: 'Dissonant Shriek',
      description: 'Unleash a discordant scream that generates tension notes and frightens enemies.',
      spellType: 'ACTION',
      icon: 'spell_shadow_psychicscream',
      school: 'Enchantment',
      level: 3,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'aoe',
        rangeType: 'self',
        aoeType: 'sphere',
        aoeSize: 20
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 25,
        components: ['verbal'],
        verbalText: 'Piercing discordant scream'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '2d6',
        damageType: 'psychic',
        scalingType: 'none'
      },

      effects: {
        damage: {
          instant: {
            formula: '2d6',
            type: 'psychic'
          }
        },
        condition: {
          type: 'frightened',
          duration: 2,
          saveType: 'wisdom',
          saveDC: 14
        }
      },

      specialMechanics: {
        musicalCombo: {
          type: 'builder',
          generates: [
            { note: 'VII', count: 2 },
            { note: 'II', count: 1 }
          ]
        }
      },

      tags: ['builder', 'aoe', 'fear', 'leading-tone-generator', 'dissonance']
    },

    // Resolving Spells - Consume Notes for Powerful Cadences
    {
      id: 'minstrel_perfect_cadence',
      name: 'Perfect Cadence',
      description: 'Complete a perfect harmonic progression (I→IV→V→I) that guarantees an ally\'s next attack will critically strike.',
      spellType: 'ACTION',
      icon: 'spell_holy_holybolt',
      school: 'Divination',
      level: 4,

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
        durationType: 'timed',
        duration: 1,
        durationUnit: 'turns'
      },

      resourceCost: {
        mana: 30,
        components: ['verbal', 'somatic'],
        verbalText: 'Harmonic resolution phrase'
      },

      resolution: 'AUTOMATIC',

      effects: {
        buff: {
          type: 'guaranteed-crit',
          duration: 1,
          description: 'Next attack is guaranteed critical hit'
        }
      },

      specialMechanics: {
        musicalCombo: {
          type: 'resolver',
          consumes: [
            { note: 'I', count: 2 },
            { note: 'IV', count: 1 },
            { note: 'V', count: 1 }
          ],
          cadenceName: 'Perfect Cadence'
        }
      },

      tags: ['resolver', 'cadence', 'buff', 'critical', 'battlechoir']
    },

    {
      id: 'minstrel_circle_of_fifths',
      name: 'Circle of Fifths',
      description: 'Weave an eternal loop of torment (V→I→VI→V) that traps enemies in relentless agony.',
      spellType: 'ACTION',
      icon: 'spell_fire_twilightflamebreath',
      school: 'Evocation',
      level: 5,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'aoe',
        rangeType: 'ranged',
        rangeDistance: 60,
        aoeType: 'sphere',
        aoeSize: 30
      },

      durationConfig: {
        durationType: 'timed',
        duration: 3,
        durationUnit: 'turns'
      },

      resourceCost: {
        mana: 40,
        components: ['verbal', 'somatic'],
        verbalText: 'Cyclical harmonic phrase'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '2d4',
        damageType: 'thunder',
        scalingType: 'none'
      },

      effects: {
        damage: {
          dot: {
            formula: '2d4',
            type: 'thunder',
            duration: 3,
            interval: 'turn'
          }
        }
      },

      specialMechanics: {
        musicalCombo: {
          type: 'resolver',
          consumes: [
            { note: 'V', count: 2 },
            { note: 'I', count: 1 },
            { note: 'VI', count: 1 }
          ],
          cadenceName: 'Circle of Fifths'
        }
      },

      tags: ['resolver', 'cadence', 'dot', 'aoe', 'battlechoir']
    },

    {
      id: 'minstrel_authentic_cadence',
      name: 'Authentic Cadence',
      description: 'Perform a grand finale (I→VI→III→I) that fortifies and heals all nearby allies.',
      spellType: 'ACTION',
      icon: 'spell_holy_prayerofhealing02',
      school: 'Abjuration',
      level: 5,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'aoe',
        rangeType: 'self',
        aoeType: 'sphere',
        aoeSize: 20
      },

      durationConfig: {
        durationType: 'timed',
        duration: 1,
        durationUnit: 'turns'
      },

      resourceCost: {
        mana: 45,
        components: ['verbal', 'somatic'],
        verbalText: 'Triumphant finale verse'
      },

      resolution: 'DICE',

      effects: {
        healing: {
          instant: {
            formula: '1d8',
            type: 'magical'
          }
        },
        buff: {
          type: 'damage-reduction',
          value: 4,
          duration: 1,
          description: 'Reduce incoming damage by 4'
        }
      },

      specialMechanics: {
        musicalCombo: {
          type: 'resolver',
          consumes: [
            { note: 'I', count: 2 },
            { note: 'VI', count: 1 },
            { note: 'III', count: 1 }
          ],
          cadenceName: 'Authentic Cadence'
        },
        instrumentBonus: {
          lute: { healingBonus: 2 },
          harp: { healingBonus: 2 }
        }
      },

      tags: ['resolver', 'cadence', 'healing', 'aoe', 'defensive', 'soulsinger']
    },

    {
      id: 'minstrel_tritone_substitution',
      name: 'Tritone Substitution',
      description: 'Unleash powerful dissonance (IV→I→V→VI) that binds and paralyzes a foe.',
      spellType: 'ACTION',
      icon: 'spell_shadow_shadowwordpain',
      school: 'Enchantment',
      level: 6,

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
        durationUnit: 'turns'
      },

      resourceCost: {
        mana: 50,
        components: ['verbal', 'somatic'],
        verbalText: 'Dissonant binding phrase'
      },

      resolution: 'SAVE',

      effects: {
        condition: {
          type: 'paralyzed',
          duration: 1,
          saveType: 'wisdom',
          saveDC: 18
        }
      },

      specialMechanics: {
        musicalCombo: {
          type: 'resolver',
          consumes: [
            { note: 'IV', count: 1 },
            { note: 'I', count: 1 },
            { note: 'V', count: 1 },
            { note: 'VI', count: 1 }
          ],
          cadenceName: 'Tritone Substitution'
        }
      },

      tags: ['resolver', 'cadence', 'control', 'paralyze', 'dissonance']
    },

    {
      id: 'minstrel_picardy_third',
      name: 'Picardy Third',
      description: 'Shift from darkness to light (I→VII→V→III), filling allies with renewed hope and resilience.',
      spellType: 'ACTION',
      icon: 'spell_holy_divineprovidence',
      school: 'Abjuration',
      level: 6,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'aoe',
        rangeType: 'self',
        aoeType: 'sphere',
        aoeSize: 20
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 55,
        components: ['verbal', 'somatic'],
        verbalText: 'Hopeful ascending melody'
      },

      resolution: 'DICE',

      effects: {
        healing: {
          instant: {
            formula: '2d6',
            type: 'magical'
          }
        },
        buff: {
          type: 'saving-throw',
          value: 2,
          duration: 3,
          description: '+2 to all saving throws'
        }
      },

      specialMechanics: {
        musicalCombo: {
          type: 'resolver',
          consumes: [
            { note: 'I', count: 1 },
            { note: 'VII', count: 1 },
            { note: 'V', count: 1 },
            { note: 'III', count: 1 }
          ],
          cadenceName: 'Picardy Third'
        }
      },

      tags: ['resolver', 'cadence', 'healing', 'buff', 'saves', 'soulsinger']
    },

    // Utility Spell
    {
      id: 'minstrel_song_of_rest',
      name: 'Song of Rest',
      description: 'Perform a calming melody that allows allies to recover during a short rest.',
      spellType: 'RITUAL',
      icon: 'spell_holy_silence',
      school: 'Abjuration',
      level: 3,

      typeConfig: {
        castTime: 10,
        castTimeType: 'MINUTES'
      },

      targetingConfig: {
        targetingType: 'aoe',
        rangeType: 'self',
        aoeType: 'sphere',
        aoeSize: 30
      },

      durationConfig: {
        durationType: 'timed',
        duration: 1,
        durationUnit: 'hours'
      },

      resourceCost: {
        mana: 20,
        components: ['verbal', 'somatic'],
        verbalText: 'Soothing rest melody'
      },

      resolution: 'DICE',

      effects: {
        healing: {
          instant: {
            formula: '2d8',
            type: 'magical',
            description: 'Bonus healing during short rest'
          }
        }
      },

      specialMechanics: {
        musicalCombo: {
          type: 'builder',
          generates: [
            { note: 'I', count: 1 },
            { note: 'IV', count: 1 }
          ]
        }
      },

      tags: ['utility', 'ritual', 'healing', 'rest', 'soulsinger']
    }
  ]
};


