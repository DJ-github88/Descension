/**
 * Oracle Class Data
 * 
 * Complete class information for the Oracle - a diviner who sees past, present, and future
 * through the Prophetic Vision resource system.
 */

export const ORACLE_DATA = {
  id: 'oracle',
  name: 'Oracle',
  icon: 'fas fa-eye',
  role: 'Support/Utility (Divination & Fate Manipulation)',
  
  // Overview section
  overview: {
    title: 'The Oracle',
    subtitle: 'Seer of Truths and Weaver of Destiny',
    
    description: `Oracles are mystics who pierce the veil between past, present, and future. Through prophetic visions, they glimpse hidden truths, foresee coming events, and manipulate the threads of fate itself. Unlike the Gambler who relies on luck, or the Chronarch who manipulates time, Oracles see the tapestry of destiny and can subtly alter its weave. Their power grows when their predictions prove true, rewarding insight and foresight.`,
    
    rpIdentity: {
      title: 'Roleplaying Identity',
      content: `Oracles are enigmatic seers who speak in riddles and prophecies. They see connections others miss, perceive hidden motives, and sense the weight of destiny on individuals and events. Some are blessed by divine visions, others cursed with unwanted foresight. They might be:

**The Blind Seer**: Physical blindness traded for supernatural sight
**The Dream Walker**: Receiving visions through dreams and trances
**The Omen Reader**: Interpreting signs in nature, cards, bones, or stars
**The Fate Touched**: Born with the gift (or curse) of prophecy
**The Truth Seeker**: Dedicated to uncovering hidden knowledge

Oracles often struggle with the burden of knowledge - seeing tragedies before they occur, knowing secrets that could destroy relationships, or being unable to change what they foresee. They speak cryptically, not from arrogance, but because the future is fluid and speaking too plainly might alter it.`
    },
    
    combatRole: {
      title: 'Combat Role',
      content: `In combat, Oracles are tactical support specialists who excel at:

**Prediction & Preparation**: Foreseeing enemy actions and granting allies advantage
**Information Warfare**: Revealing enemy weaknesses, hidden threats, and tactical opportunities
**Fate Manipulation**: Forcing rerolls, altering outcomes, and bending probability
**Debuff & Control**: Cursing enemies with ill omens and prophesied doom
**Utility & Revelation**: Detecting traps, seeing through illusions, and uncovering secrets

Oracles are not direct damage dealers but force multipliers who make their allies more effective and their enemies less so. They shine in complex encounters where information and tactical advantage matter more than raw damage.`
    },
    
    playstyle: {
      title: 'Playstyle',
      content: `Oracles reward players who:

**Think Ahead**: Make predictions about combat outcomes and enemy actions
**Pay Attention**: Notice patterns, remember details, and connect information
**Take Risks**: Spend Visions on bold predictions for greater rewards
**Support Allies**: Focus on making the party more effective rather than personal glory
**Embrace Mystery**: Enjoy cryptic abilities and uncertain outcomes

The class has a unique prediction mechanic where you declare what you think will happen (e.g., "The enemy will miss their next attack" or "Our fighter will land a critical hit") and gain bonuses if your prediction proves true. This creates engaging gameplay where you're constantly reading the battlefield and making tactical forecasts.`
    }
  },
  
  // Resource System
  resourceSystem: {
    title: 'Prophetic Visions',
    subtitle: 'The Oracle\'s Unique Resource Mechanic',
    
    description: `Oracles generate Prophetic Visions by making accurate predictions and revealing hidden truths. These Visions can be spent to manipulate fate, force rerolls, or unleash powerful divination magic. The more accurate your predictions, the more power you accumulate.`,
    
    mechanics: {
      title: 'How Prophetic Visions Work',
      content: `**Generating Visions**
You gain Prophetic Visions through:

• **Correct Predictions**: Declare a prediction before an event (e.g., "The next attack will miss"). If correct, gain 1-3 Visions based on specificity
• **Revealing Truths**: Use divination abilities to uncover hidden information (traps, lies, weaknesses) - gain 1 Vision per revelation
• **Fulfilling Prophecies**: At the start of each session, make 3 prophecies about what will happen. Each that comes true grants 2 Visions
• **Witnessing Fate**: When a critical hit or critical miss occurs within 30 feet, gain 1 Vision

**Spending Visions**
Visions can be spent to:

• **Alter Fate** (1-3 Visions): Force a reroll, grant advantage/disadvantage, or add/subtract from a roll
• **Cast Divination Spells**: Many Oracle spells cost Visions instead of or in addition to mana
• **Activate Prophecies**: Trigger powerful effects by spending accumulated Visions
• **Weave Destiny**: Manipulate the threads of fate to create specific outcomes

**Vision Storage**
• Maximum Visions: 10
• Visions persist between combats
• Visions reset to 3 at the start of each long rest (representing baseline prophetic insight)`
    },
    
    predictionMechanics: {
      title: 'Prediction System',
      content: `**Making Predictions**
As a bonus action, you can make a prediction about an upcoming event:

**Simple Prediction** (1 Vision if correct):
• "The next attack will hit/miss"
• "The enemy will move/stay still"
• "An ally will take damage this round"

**Specific Prediction** (2 Visions if correct):
• "The rogue will land a critical hit"
• "The enemy will cast a spell"
• "The fighter will be reduced below half HP"

**Precise Prediction** (3 Visions if correct):
• "The enemy will cast Fireball targeting our cleric"
• "The next attack will roll between 15-20"
• "Two enemies will fall this round"

**Prophecy Timing**
Predictions must be made before the event occurs and are resolved immediately when the event happens or fails to happen. Failed predictions grant no Visions but have no other penalty.`
    },
    
    strategicConsiderations: {
      title: 'Strategic Considerations',
      content: `**Vision Economy**
• Start each session with 3 Visions from your long rest
• Make session prophecies early to potentially gain 6 more Visions (3 prophecies × 2 Visions each)
• Balance between making predictions (risky but rewarding) and spending Visions (immediate power)
• Save Visions for critical moments when altering fate could turn the tide

**Prediction Strategy**
• Make simple predictions frequently to build Visions steadily
• Save specific/precise predictions for when you have strong information
• Use divination spells to gather information that makes predictions easier
• Coordinate with allies to set up predictable scenarios

**Specialization Synergy**
• **Seers** excel at future predictions and gain bonus Visions from correct forecasts
• **Truthseekers** focus on revealing hidden information and past events
• **Fateweavers** spend Visions aggressively to manipulate outcomes directly`
    }
  },
  
  // Specializations
  specializations: {
    title: 'Oracle Specializations',
    subtitle: 'Three Paths of Prophetic Mastery',
    
    description: `Oracles can specialize in different aspects of divination and fate manipulation. Seers focus on future sight and prediction, Truthseekers uncover hidden knowledge and past events, while Fateweavers actively manipulate destiny threads to create desired outcomes.`,
    
    passiveAbility: {
      name: 'Third Eye',
      description: 'All Oracles can see invisible creatures and objects within 30 feet, have advantage on Insight checks, and can detect when someone is lying to them (though not what the truth is). You also start each long rest with 3 Prophetic Visions.'
    },
    
    specs: [
      {
        id: 'seer',
        name: 'Seer',
        icon: 'spell_holy_farsight',
        color: '#9370DB',
        theme: 'Future Sight & Prediction Mastery',
        
        description: `Seers specialize in glimpsing the future, making their predictions more accurate and rewarding. They can see multiple possible futures and guide allies toward the best outcomes. Their visions of what's to come make them invaluable tactical advisors.`,
        
        playstyle: 'Prediction focus, future sight, tactical foresight, ally guidance',
        
        strengths: [
          'Gain bonus Visions from correct predictions (+1 per prediction)',
          'Can make predictions as a free action instead of bonus action',
          'See 3 seconds into the future, granting advantage on initiative',
          'Predictions have longer duration and can stack'
        ],
        
        weaknesses: [
          'Abilities focused on prediction rather than direct power',
          'Requires accurate forecasting to be effective',
          'Less useful when facing completely unpredictable enemies',
          'Minimal direct damage output'
        ],
        
        specPassive: {
          name: 'Prophetic Clarity',
          description: 'Your predictions grant +1 additional Vision when correct. You can make predictions as a free action (once per round). When you make a correct specific or precise prediction, you can immediately make another prediction for free.'
        },
        
        keyAbilities: [
          'Foresight: See 6 seconds into the future, gaining advantage on your next action (2 Visions)',
          'Shared Vision: Grant an ally advantage on their next roll by showing them the future (1 Vision)',
          'Inevitable Outcome: Declare an attack will hit or miss - it does (5 Visions, once per long rest)'
        ],
        
        recommendedFor: 'Players who enjoy tactical planning and making accurate predictions'
      },

      {
        id: 'truthseeker',
        name: 'Truthseeker',
        icon: 'spell_holy_searinglightpriest',
        color: '#FFD700',
        theme: 'Past Sight & Hidden Knowledge',

        description: `Truthseekers peer into the past and uncover hidden truths. They can read the history of objects, see through lies and illusions, and reveal secrets long buried. Their power comes from knowledge itself, making them master investigators and lore keepers.`,

        playstyle: 'Information gathering, lie detection, secret revelation, investigation',

        strengths: [
          'Automatically detect lies and illusions within 30 feet',
          'Can read the history of objects and locations',
          'Reveal hidden enemies, traps, and secret doors',
          'Gain Visions from uncovering secrets (1 per revelation)'
        ],

        weaknesses: [
          'Less effective in straightforward combat',
          'Abilities require time and investigation',
          'Knowledge doesn\'t always translate to power',
          'Minimal offensive capabilities'
        ],

        specPassive: {
          name: 'All-Seeing Eye',
          description: 'You automatically detect lies, illusions, and hidden creatures within 30 feet. When you reveal a hidden truth (trap, secret door, disguised enemy, etc.), gain 1 Vision. You can touch an object to see its history for the past 24 hours.'
        },

        keyAbilities: [
          'Reveal Truth: Force a creature to answer one question truthfully (3 Visions, Wisdom save to resist)',
          'Past Sight: Touch an object to see its complete history (2 Visions, 1 minute ritual)',
          'Piercing Gaze: See through all illusions and disguises within 60 feet for 1 minute (2 Visions)'
        ],

        recommendedFor: 'Players who love investigation, uncovering secrets, and gathering information'
      },

      {
        id: 'fateweaver',
        name: 'Fateweaver',
        icon: 'spell_arcane_prismaticcloak',
        color: '#FF1493',
        theme: 'Destiny Manipulation & Fate Alteration',

        description: `Fateweavers don't just see destiny - they reshape it. By manipulating the threads of fate, they can force rerolls, alter outcomes, and bend probability to their will. They are aggressive Vision spenders who actively change the course of events rather than merely predicting them.`,

        playstyle: 'Fate manipulation, reroll forcing, outcome alteration, aggressive Vision spending',

        strengths: [
          'Can force enemies to reroll successful attacks',
          'Grant allies rerolls on failed saves or attacks',
          'Manipulate dice results by adding or subtracting values',
          'Create "fate locks" that guarantee specific outcomes'
        ],

        weaknesses: [
          'Burns through Visions quickly',
          'Less Vision generation than other specs',
          'Requires constant Vision management',
          'Reactive playstyle dependent on enemy actions'
        ],

        specPassive: {
          name: 'Threads of Destiny',
          description: 'You can see the glowing threads of fate connecting all creatures. Once per round as a reaction, you can spend 1 Vision to force any creature within 60 feet to reroll an attack, save, or ability check. You choose which result they use.'
        },

        keyAbilities: [
          'Twist Fate: Spend 2 Visions to add or subtract 1d6 from any roll within 60 feet',
          'Sever Thread: Spend 3 Visions to turn a critical hit into a normal hit (or vice versa)',
          'Destiny Lock: Spend 5 Visions to guarantee the next attack against a target hits and crits (once per long rest)'
        ],

        recommendedFor: 'Players who want to actively manipulate combat outcomes and control probability'
      }
    ]
  },

  // Example Spells - organized by specialization
  exampleSpells: [
    // ===== SEER SPECIALIZATION =====
    {
      id: 'oracle_foresight',
      name: 'Foresight',
      description: 'Peer 6 seconds into the future to see the outcome of your next action, granting you perfect clarity.',
      spellType: 'ACTION',
      icon: 'spell_holy_farsight',
      school: 'Divination',
      level: 2,
      specialization: 'seer',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        type: 'SELF',
        range: 0,
        rangeUnit: 'self'
      },

      resourceCost: {
        actionPoints: 1,
        visions: 2,
        components: ['verbal', 'somatic'],
        description: 'Spend 2 Prophetic Visions to glimpse the immediate future'
      },

      duration: {
        value: 1,
        unit: 'round',
        concentration: false
      },

      resolution: 'AUTOMATIC',

      effects: {
        primary: 'Gain advantage on your next attack roll, ability check, or saving throw',
        secondary: 'If you make a prediction about the outcome before rolling, gain +1 Vision if correct'
      },

      tags: ['seer', 'divination', 'advantage', 'self-buff']
    },

    {
      id: 'oracle_shared_vision',
      name: 'Shared Vision',
      description: 'Show an ally a glimpse of the future, guiding their actions toward success.',
      spellType: 'ACTION',
      icon: 'spell_holy_divineprovidence',
      school: 'Divination',
      level: 1,
      specialization: 'seer',

      typeConfig: {
        castTime: 1,
        castTimeType: 'REACTION'
      },

      targetingConfig: {
        type: 'SINGLE',
        range: 60,
        rangeUnit: 'feet',
        requiresLineOfSight: true,
        allowFriendly: true,
        allowSelf: false
      },

      resourceCost: {
        actionPoints: 2,
        visions: 1,
        components: ['verbal', 'somatic'],
        description: 'Spend 1 Vision to share your foresight'
      },

      duration: {
        value: 1,
        unit: 'instant',
        concentration: false
      },

      resolution: 'AUTOMATIC',

      effects: {
        primary: 'Target ally gains advantage on their next roll',
        secondary: 'If they succeed, you gain 1 Vision back'
      },

      tags: ['seer', 'divination', 'ally-buff', 'reaction']
    },

    {
      id: 'oracle_prophecy_of_doom',
      name: 'Prophecy of Doom',
      description: 'Declare a dire prophecy about an enemy\'s fate. If your prediction comes true, they suffer the prophesied doom.',
      spellType: 'ACTION',
      icon: 'spell_shadow_curseofachimonde',
      school: 'Divination',
      level: 4,
      specialization: 'seer',

      typeConfig: {
        castTime: 1,
        castTimeType: 'ACTION'
      },

      targetingConfig: {
        type: 'SINGLE',
        range: 60,
        rangeUnit: 'feet',
        requiresLineOfSight: true,
        allowFriendly: false,
        allowSelf: false
      },

      resourceCost: {
        actionPoints: 2,
        visions: 3,
        mana: 4,
        components: ['verbal', 'somatic'],
        description: 'Spend 3 Visions and 4 mana to curse with prophecy'
      },

      duration: {
        value: 3,
        unit: 'rounds',
        concentration: true
      },

      resolution: 'SAVING_THROW',
      savingThrow: {
        ability: 'WIS',
        dc: 'SPELL_DC',
        onSave: 'Prophecy fails to take hold',
        onFail: 'Target is cursed with prophesied doom'
      },

      effects: {
        primary: 'Declare a specific event (e.g., "You will miss your next attack" or "You will fall below half HP")',
        secondary: 'If the prophecy comes true within 3 rounds, target takes 3d8 psychic damage and is frightened for 1 round',
        tertiary: 'If prophecy comes true, you gain 2 Visions'
      },

      tags: ['seer', 'divination', 'curse', 'prediction', 'psychic']
    },

    // ===== TRUTHSEEKER SPECIALIZATION =====
    {
      id: 'oracle_reveal_truth',
      name: 'Reveal Truth',
      description: 'Compel a creature to speak only truth, unable to lie or deceive.',
      spellType: 'ACTION',
      icon: 'spell_holy_searinglightpriest',
      school: 'Divination',
      level: 3,
      specialization: 'truthseeker',

      typeConfig: {
        castTime: 1,
        castTimeType: 'ACTION'
      },

      targetingConfig: {
        type: 'SINGLE',
        range: 30,
        rangeUnit: 'feet',
        requiresLineOfSight: true,
        allowFriendly: false,
        allowSelf: false
      },

      resourceCost: {
        actionPoints: 2,
        visions: 3,
        components: ['verbal', 'somatic'],
        description: 'Spend 3 Visions to force truth'
      },

      duration: {
        value: 1,
        unit: 'minute',
        concentration: true
      },

      resolution: 'SAVING_THROW',
      savingThrow: {
        ability: 'WIS',
        dc: 'SPELL_DC',
        onSave: 'Target resists the compulsion',
        onFail: 'Target must answer one question truthfully'
      },

      effects: {
        primary: 'Target must answer one question you ask with complete honesty',
        secondary: 'They cannot lie, mislead, or omit important details',
        tertiary: 'When they answer, you gain 1 Vision from the revealed truth'
      },

      tags: ['truthseeker', 'divination', 'interrogation', 'social']
    },

    {
      id: 'oracle_past_sight',
      name: 'Past Sight',
      description: 'Touch an object or location to witness its history, seeing events that transpired here.',
      spellType: 'RITUAL',
      icon: 'spell_arcane_mindvision',
      school: 'Divination',
      level: 2,
      specialization: 'truthseeker',

      typeConfig: {
        castTime: 1,
        castTimeType: 'RITUAL',
        ritualDuration: 1,
        ritualUnit: 'minute'
      },

      targetingConfig: {
        type: 'TOUCH',
        range: 0,
        rangeUnit: 'touch',
        requiresLineOfSight: false
      },

      resourceCost: {
        actionPoints: 2,
        visions: 2,
        components: ['verbal', 'somatic'],
        description: 'Spend 2 Visions to peer into the past'
      },

      duration: {
        value: 10,
        unit: 'minutes',
        concentration: true
      },

      resolution: 'AUTOMATIC',

      effects: {
        primary: 'Witness the complete history of the touched object or location for the past 24 hours',
        secondary: 'See all creatures who interacted with it and hear conversations within 10 feet',
        tertiary: 'Each significant revelation grants 1 Vision (GM discretion, max 3)'
      },

      tags: ['truthseeker', 'divination', 'ritual', 'investigation']
    },

    {
      id: 'oracle_piercing_gaze',
      name: 'Piercing Gaze',
      description: 'Your eyes glow with supernatural light, seeing through all deceptions and illusions.',
      spellType: 'ACTION',
      icon: 'spell_holy_holyguidance',
      school: 'Divination',
      level: 3,
      specialization: 'truthseeker',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        type: 'SELF',
        range: 60,
        rangeUnit: 'feet'
      },

      resourceCost: {
        actionPoints: 2,
        visions: 2,
        components: ['verbal', 'somatic'],
        description: 'Spend 2 Visions to pierce all veils'
      },

      duration: {
        value: 1,
        unit: 'minute',
        concentration: true
      },

      resolution: 'AUTOMATIC',

      effects: {
        primary: 'See through all illusions, disguises, and invisibility within 60 feet',
        secondary: 'Automatically detect shapechangers and see their true form',
        tertiary: 'Gain 1 Vision for each hidden creature or illusion revealed (max 3 per casting)'
      },

      tags: ['truthseeker', 'divination', 'detection', 'anti-illusion']
    },

    // ===== FATEWEAVER SPECIALIZATION =====
    {
      id: 'oracle_twist_fate',
      name: 'Twist Fate',
      description: 'Reach out and twist the threads of destiny, altering the outcome of an event.',
      spellType: 'REACTION',
      icon: 'spell_arcane_prismaticcloak',
      school: 'Divination',
      level: 2,
      specialization: 'fateweaver',

      typeConfig: {
        castTime: 1,
        castTimeType: 'REACTION',
        trigger: 'A creature within 60 feet makes an attack roll, ability check, or saving throw'
      },

      targetingConfig: {
        type: 'SINGLE',
        range: 60,
        rangeUnit: 'feet',
        requiresLineOfSight: true,
        allowFriendly: true,
        allowSelf: true
      },

      resourceCost: {
        actionPoints: 1,
        visions: 2,
        components: ['verbal', 'somatic'],
        description: 'Spend 2 Visions to twist fate'
      },

      duration: {
        value: 1,
        unit: 'instant',
        concentration: false
      },

      resolution: 'AUTOMATIC',

      effects: {
        primary: 'Add or subtract 1d6 from the target\'s roll',
        secondary: 'You choose whether to add or subtract after seeing the initial roll',
        tertiary: 'Can turn a success into a failure or vice versa'
      },

      tags: ['fateweaver', 'divination', 'reaction', 'manipulation']
    },

    {
      id: 'oracle_sever_thread',
      name: 'Sever Thread',
      description: 'Cut the thread of fate at a critical moment, preventing or ensuring a critical outcome.',
      spellType: 'REACTION',
      icon: 'spell_shadow_soulleech_3',
      school: 'Divination',
      level: 4,
      specialization: 'fateweaver',

      typeConfig: {
        castTime: 1,
        castTimeType: 'REACTION',
        trigger: 'A creature within 60 feet rolls a natural 20 or natural 1'
      },

      targetingConfig: {
        type: 'SINGLE',
        range: 60,
        rangeUnit: 'feet',
        requiresLineOfSight: true,
        allowFriendly: true,
        allowSelf: true
      },

      resourceCost: {
        actionPoints: 2,
        visions: 3,
        components: ['verbal', 'somatic'],
        description: 'Spend 3 Visions to sever fate\'s thread'
      },

      duration: {
        value: 1,
        unit: 'instant',
        concentration: false
      },

      resolution: 'AUTOMATIC',

      effects: {
        primary: 'Turn a natural 20 into a natural 19 (normal hit instead of critical)',
        secondary: 'OR turn a natural 1 into a natural 2 (normal miss instead of critical fail)',
        tertiary: 'OR turn a normal roll into a critical (natural 20) or critical fail (natural 1)'
      },

      tags: ['fateweaver', 'divination', 'reaction', 'critical', 'manipulation']
    },

    {
      id: 'oracle_destiny_lock',
      name: 'Destiny Lock',
      description: 'Lock a creature\'s fate, ensuring their next action results in a specific outcome.',
      spellType: 'ACTION',
      icon: 'spell_holy_powerwordbarrier',
      school: 'Divination',
      level: 5,
      specialization: 'fateweaver',

      typeConfig: {
        castTime: 1,
        castTimeType: 'ACTION'
      },

      targetingConfig: {
        type: 'SINGLE',
        range: 60,
        rangeUnit: 'feet',
        requiresLineOfSight: true,
        allowFriendly: true,
        allowSelf: true
      },

      resourceCost: {
        actionPoints: 3,
        visions: 5,
        mana: 5,
        components: ['verbal', 'somatic', 'material'],
        materialComponents: 'A golden thread worth 100gp',
        description: 'Spend 5 Visions and 5 mana to lock destiny (once per long rest)'
      },

      duration: {
        value: 1,
        unit: 'round',
        concentration: false
      },

      resolution: 'AUTOMATIC',

      effects: {
        primary: 'The next attack roll made by or against the target automatically succeeds and is a critical hit',
        secondary: 'OR the next saving throw automatically succeeds or fails (your choice)',
        tertiary: 'This effect cannot be prevented, dispelled, or countered - fate is absolute'
      },

      specialMechanics: {
        limitation: 'Can only be used once per long rest',
        note: 'This is the ultimate fate manipulation - use wisely'
      },

      tags: ['fateweaver', 'divination', 'ultimate', 'guaranteed-outcome']
    },

    // ===== UNIVERSAL ABILITIES =====
    {
      id: 'oracle_detect_fate',
      name: 'Detect Fate',
      description: 'Sense the weight of destiny on creatures and objects, seeing who is important to the future.',
      spellType: 'ACTION',
      icon: 'spell_holy_prayerofhealing',
      school: 'Divination',
      level: 1,
      specialization: 'universal',

      typeConfig: {
        castTime: 1,
        castTimeType: 'ACTION'
      },

      targetingConfig: {
        type: 'SELF',
        range: 30,
        rangeUnit: 'feet'
      },

      resourceCost: {
        actionPoints: 2,
        visions: 1,
        components: ['verbal', 'somatic'],
        description: 'Spend 1 Vision to sense destiny'
      },

      duration: {
        value: 10,
        unit: 'minutes',
        concentration: true
      },

      resolution: 'AUTOMATIC',

      effects: {
        primary: 'See glowing threads of fate connecting creatures and objects within 30 feet',
        secondary: 'Brighter threads indicate greater importance to future events',
        tertiary: 'Can identify "key" NPCs, important items, and critical locations'
      },

      tags: ['universal', 'divination', 'detection', 'utility']
    },

    {
      id: 'oracle_omen_reading',
      name: 'Omen Reading',
      description: 'Read the omens in your surroundings to gain insight into the immediate future.',
      spellType: 'RITUAL',
      icon: 'inv_misc_bone_skull_02',
      school: 'Divination',
      level: 2,
      specialization: 'universal',

      typeConfig: {
        castTime: 10,
        castTimeType: 'RITUAL',
        ritualDuration: 10,
        ritualUnit: 'minutes'
      },

      targetingConfig: {
        type: 'SELF',
        range: 0,
        rangeUnit: 'self'
      },

      resourceCost: {
        actionPoints: 2,
        visions: 2,
        components: ['verbal', 'somatic', 'material'],
        materialComponents: 'Divination tools (bones, cards, or runes)',
        description: 'Spend 2 Visions to read the omens'
      },

      duration: {
        value: 1,
        unit: 'hour',
        concentration: false
      },

      resolution: 'AUTOMATIC',

      effects: {
        primary: 'Gain cryptic insight into the next hour (GM provides 3 vague clues about upcoming events)',
        secondary: 'Advantage on initiative rolls for the next hour',
        tertiary: 'If you act on the omens, gain 1 Vision when the predicted event occurs'
      },

      tags: ['universal', 'divination', 'ritual', 'foresight']
    }
  ]
};

