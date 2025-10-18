/**
 * Fate Weaver Class Data
 * 
 * Complete class information for the Fate Weaver - a card-based destiny manipulator
 * who uses Threads of Destiny to control the flow of fate.
 */

export const FATE_WEAVER_DATA = {
  id: 'fate-weaver',
  name: 'Fate Weaver',
  icon: 'fas fa-cards',
  role: 'Support/Control',

  // Overview section
  overview: {
    title: 'The Fate Weaver',
    subtitle: 'Master of Destiny and Cards',
    
    description: `The Fate Weaver manipulates the threads of destiny using their unique connection to cosmic forces. They draw power from cards, utilizing "Threads of Destiny" to influence the outcomes of their spells and actions. This mechanic allows Fate Weavers to predict, alter, and control the course of events in battle, making their actions as strategic as they are mystical.`,
    
    roleplayIdentity: {
      title: 'Roleplay Identity',
      content: `Fate Weavers are individuals who have learned to see and manipulate the invisible threads that connect all events. They understand that destiny is not fixed but malleable—a tapestry that can be rewoven by those with the knowledge and power to do so. Through their mystical deck of cards, they read the future, alter the present, and learn from the past.

**The Fate Weaver's Philosophy**: Destiny is not predetermined—it is a game of cards where skill, strategy, and a touch of luck determine the outcome. Every draw is an opportunity, every failure a lesson, and every thread a tool for reshaping reality.

**Common Archetypes**:
- **The Oracle**: A mystic who reads the cards to divine the future and guide allies toward favorable outcomes
- **The Card Sharp**: A cunning strategist who treats fate like a game, always holding the right card at the right time
- **The Thread Spinner**: A weaver of destiny who collects failures and transforms them into power
- **The Fortune Teller**: A mysterious figure who sees patterns in chaos and turns misfortune into opportunity
- **The Deck Master**: A master of probability who stacks the deck in their favor through careful manipulation
- **The Cosmic Gambler**: A risk-taker who embraces both success and failure, knowing each feeds their power`,
      
      examples: [
        'A traveling fortune teller who discovered their readings were actually shaping reality',
        'A scholar who found an ancient deck of cards that revealed the threads of fate',
        'A gambler who learned that losing hands generated mystical power',
        'A priest who channels divine will through sacred cards',
        'A chaos mage who found order in the randomness of card draws',
        'A tactician who uses cards to predict and counter enemy strategies'
      ]
    },
    
    combatRole: {
      title: 'Combat Role',
      content: `**Primary Role**: Support/Control with card-based mechanics and destiny manipulation

**Strengths**:
- Strategic card-based gameplay with high skill ceiling
- Ability to turn failures into resources (Threads of Destiny)
- Versatile effects based on card combinations (poker hands, blackjack, etc.)
- Strong control over randomness through Thread spending
- Excellent at adapting to changing battle conditions
- Unique support abilities through card sharing and bonding

**Weaknesses**:
- Dependent on card draws for spell effects
- Requires understanding of card game mechanics
- Less consistent than classes with fixed spell effects
- Must manage both mana and Threads of Destiny
- Vulnerable when Thread reserves are low
- Some spells have negative outcomes that generate Threads`,
      
      keyMechanics: [
        'Card-based spell resolution (poker, blackjack, war, etc.)',
        'Threads of Destiny generation from failures and negative outcomes',
        'Strategic Thread spending to call specific cards from deck',
        'Variable spell effects based on card combinations',
        'Risk/reward balance between accepting failures for Threads vs. forcing success'
      ]
    },
    
    playstyle: {
      title: 'Playstyle & Strategy',
      content: `Fate Weavers thrive in situations that require careful planning and foresight. Their card-based abilities provide a unique blend of chance and control, allowing them to adapt to changing circumstances and turn the tide of battle.

**Core Strategy**:
1. **Thread Management**: Balance between accepting failures to generate Threads and spending Threads to guarantee success
2. **Card Knowledge**: Understanding poker hands, blackjack values, and other card game mechanics
3. **Timing**: Knowing when to spend Threads to call specific cards vs. accepting random draws
4. **Failure Conversion**: Embracing negative outcomes as opportunities to build Thread reserves
5. **Deck Manipulation**: Using Threads strategically to ensure favorable draws when it matters most

**Thread Economy**:
- Generate 1 Thread when spells fail or have no effect
- Generate 1-2 Threads when spells have negative outcomes (severity-dependent)
- Spend 2 Threads to call a specific card from the deck (once per turn)
- Maximum Thread capacity: 20 Threads

**Optimal Play Patterns**:
- Early combat: Accept some failures to build Thread reserves
- Mid combat: Use Threads to guarantee key spell successes
- Late combat: Spend remaining Threads for finishing moves
- Always maintain 4-6 Threads as emergency reserve`,
      
      tips: [
        'Learn poker hand rankings to maximize Hand of Fate effectiveness',
        'In blackjack-style spells (Draw of the Damned), aim for 18-20 for safety',
        'Save Threads for critical moments rather than spending immediately',
        'Negative outcomes aren\'t always bad—they generate valuable Threads',
        'Coordinate with allies for Echo of Fate card matching',
        'Track which cards have been drawn to predict remaining deck composition'
      ]
    }
  },

  // Resource System section
  resourceSystem: {
    title: 'Threads of Destiny',
    subtitle: 'Weaving Fate from Failure',

    description: `Threads of Destiny are the Fate Weaver's unique resource, generated whenever their spells fail or produce negative outcomes. These mystical threads represent the cosmic energy released when destiny is disrupted, which the Fate Weaver can then harness to manipulate future events. By spending Threads, Fate Weavers can call specific cards from their deck, transforming randomness into calculated strategy.`,

    mechanics: {
      title: 'How It Works',
      content: `**Thread Generation**: Fate Weavers generate Threads of Destiny whenever their spells fail or produce negative outcomes:
- **Spell Failure** (+1 Thread): When a spell fails to achieve its intended effect or produces no outcome
- **Minor Negative Outcome** (+1 Thread): When a spell produces a minor negative effect (e.g., drawing a heart in Heart's Gamble)
- **Major Negative Outcome** (+2 Threads): When a spell produces a severe negative effect (e.g., going far over 21 in Draw of the Damned)

**Thread Usage**: Spend Threads to manipulate your deck and control fate:
- **Call Specific Card** (2 Threads): Search the deck for a specific card and add it to your hand (once per turn)
- **Reweave Fate** (Passive): Automatically gain Threads when spells fail or backfire—failures are never wasted

**Thread Capacity**:
- **Maximum**: 20 Threads
- **Starting**: 0 Threads
- **Persistence**: Threads persist between combats and can be stockpiled for crucial encounters

**Strategic Principle**: The Fate Weaver thrives on turning failures into opportunities. Early in combat, accept some failures to build Thread reserves. Later, spend Threads to guarantee success when it matters most.`
    },

    tables: [
      {
        title: 'Thread Generation Examples',
        headers: ['Spell', 'Outcome', 'Threads Gained', 'Reasoning'],
        rows: [
          ['Hand of Fate', 'High Card (worst hand)', '1', 'Spell succeeded but with minimal effect'],
          ['Draw of the Damned', 'Total of 25 (bust)', '2', 'Major negative outcome (AC reduction)'],
          ['Heart\'s Gamble', 'Drew 1 heart', '1', 'Minor negative outcome (small damage)'],
          ['Heart\'s Gamble', 'Drew 3 hearts + face card', '2', 'Major negative outcome (heavy damage)'],
          ['War of Wills', 'Lost the draw', '1', 'Spell failed (opponent won)'],
          ['Echo of Fate', 'No matching cards', '1', 'Spell failed (no effect triggered)'],
          ['Solitaire\'s Shield', 'Incomplete sequence', '1', 'Spell failed (no sequence completed)'],
          ['Curse of the Old Maid', 'Drew the Old Maid', '2', 'Major negative outcome (damage instead of healing)']
        ]
      },
      {
        title: 'Thread Spending Strategy',
        headers: ['Thread Reserve', 'Recommended Action', 'Reasoning'],
        rows: [
          ['0-3 Threads', 'Accept random draws, build reserves', 'Not enough to reliably call cards'],
          ['4-7 Threads', 'Spend on critical spells only', 'Moderate reserve, use sparingly'],
          ['8-12 Threads', 'Spend freely on important moments', 'Good reserve, can afford to manipulate'],
          ['13-16 Threads', 'Aggressive manipulation', 'High reserve, maximize control'],
          ['17-20 Threads', 'At cap, must spend or waste', 'Spend liberally to avoid waste']
        ]
      }
    ],

    strategicConsiderations: {
      title: 'Strategic Thread Management',
      content: `Mastering Threads of Destiny is the key to becoming an effective Fate Weaver. The resource creates a unique risk/reward dynamic where failures become opportunities and careful planning pays dividends.

**Key Principles**:
1. **Embrace Failure Early**: In the opening rounds of combat, accepting some failures builds Thread reserves for later
2. **Save for Criticals**: Don't spend Threads on minor spells—save them for game-changing moments
3. **Know Your Deck**: Track which cards have been drawn to predict what's left and plan Thread usage
4. **Emergency Reserve**: Always maintain 4-6 Threads for unexpected situations
5. **Cap Awareness**: At 20 Threads, you must spend or waste generation—don't let Threads go to waste

**Advanced Techniques**:
- **Intentional Failure**: Sometimes accepting a negative outcome to gain 2 Threads is worth it
- **Thread Cycling**: Spend Threads to call cards that enable Thread generation (risky cards)
- **Combo Setup**: Use Threads to assemble specific card combinations for powerful effects
- **Ally Coordination**: In Echo of Fate, coordinate with allies to ensure matching cards`
    }
  },

  // Specializations section
  specializations: {
    title: 'Fate Weaver Specializations',
    subtitle: 'Three Paths of Destiny',

    description: `Fate Weavers can specialize in three distinct approaches to manipulating destiny, each focusing on different aspects of card-based magic and Thread manipulation.`,

    sharedPassive: {
      name: 'Destiny\'s Insight',
      icon: 'spell_holy_divinepurpose',
      description: 'You can see the top card of your deck at all times. Additionally, whenever you would draw a card, you may spend 1 Thread of Destiny to look at the top 3 cards and choose which one to draw (the others go to the bottom of the deck in any order).'
    },

    specs: [
      {
        id: 'fortune-teller',
        name: 'Fortune Teller',
        icon: 'inv_misc_tarot_01',
        color: '#9370DB',
        theme: 'Divination & Prediction',

        description: `The Fortune Teller specialization focuses on reading the cards to predict and shape future events. These Fate Weavers excel at divination, granting allies foresight and manipulating probability to ensure favorable outcomes. They are masters of preparation, always knowing what's coming and positioning their allies for success.`,

        playstyle: 'Predictive support, ally buffs, probability manipulation, information gathering',

        strengths: [
          'Excellent support and ally buffs',
          'Reveals enemy intentions and strategies',
          'Grants advantage and rerolls to allies',
          'Strong information gathering capabilities'
        ],

        weaknesses: [
          'Lower personal damage output',
          'Relies on allies to capitalize on predictions',
          'Less effective when solo',
          'Requires good communication with party'
        ],

        passiveAbility: {
          name: 'Prophetic Vision',
          icon: 'spell_holy_sealofwisdom',
          description: 'At the start of each turn, you may look at the top 5 cards of your deck and rearrange them in any order. Additionally, whenever an ally within 30 feet makes an attack roll or saving throw, you may spend 1 Thread of Destiny to grant them advantage on that roll (you must see the top card of your deck to use this ability).'
        },

        keyAbilities: [
          "Scrying Hand - Draw cards to divine the future, revealing enemy intentions and granting allies bonuses based on suits drawn (3 mana, spend Threads to guarantee specific suits)",
          "Fate's Guidance - Share your vision with an ally, allowing them to reroll any roll and choose the result (4 mana, costs 3 Threads to activate)",
          "Prophetic Shield - Predict incoming damage and reduce it based on card accuracy (2 mana, closer predictions = more damage reduction)"
        ],

        recommendedFor: 'Players who enjoy support roles, strategic planning, and helping allies succeed through prediction and foresight.'
      },

      {
        id: 'card-master',
        name: 'Card Master',
        icon: 'inv_misc_platnumdisks',
        color: '#FFD700',
        theme: 'Deck Manipulation & Control',

        description: `The Card Master specialization focuses on complete control over the deck and hand. These Fate Weavers are experts at manipulating their draws, ensuring they always have the right card at the right time. They excel at combo-based gameplay, assembling powerful card combinations to devastating effect.`,

        playstyle: 'Deck control, combo assembly, hand manipulation, consistent power',

        strengths: [
          'Excellent combo potential and synergy',
          'Consistent card draws and hand control',
          'Can hold more cards than other specs',
          'Strong sustained damage and utility'
        ],

        weaknesses: [
          'Requires setup time to assemble combos',
          'Less effective in short encounters',
          'Vulnerable when hand is disrupted',
          'Lower burst damage than other specs'
        ],

        passiveAbility: {
          name: 'Master of the Deck',
          icon: 'inv_misc_book_11',
          description: 'You may hold up to 7 cards in your hand (instead of the normal 5). Additionally, whenever you spend Threads of Destiny to call a specific card, you may call 2 cards instead of 1 for the same cost. Once per turn, you may discard a card and draw a new one for 0 AP (free).'
        },

        keyAbilities: [
          "Perfect Hand - Draw cards until you have a specific poker hand, then unleash its power (5 mana, spend Threads to guarantee the hand you want)",
          "Deck Shuffle - Reshuffle your entire deck and draw 5 new cards, gaining bonuses based on suits (4 mana, generates 1 Thread per duplicate suit)",
          "Card Cascade - Play multiple cards in sequence, each amplifying the next (6 mana, combo potential scales with hand size)"
        ],

        recommendedFor: 'Players who enjoy combo gameplay, deck-building strategy, and maximizing control over randomness.'
      },

      {
        id: 'thread-weaver',
        name: 'Thread Weaver',
        icon: 'spell_arcane_prismaticcloak',
        color: '#FF1493',
        theme: 'Thread Generation & Manipulation',

        description: `The Thread Weaver specialization embraces failure as a source of power, generating Threads of Destiny at an accelerated rate and using them in creative ways. These Fate Weavers are risk-takers who thrive on chaos, turning every setback into an opportunity and every failure into fuel for their next success.`,

        playstyle: 'High risk/reward, Thread generation focus, failure conversion, explosive power',

        strengths: [
          'Fastest Thread generation in the game',
          'Can guarantee spell success or failure',
          'Explosive burst damage potential',
          'Turns failures into massive advantages'
        ],

        weaknesses: [
          'Extremely high variance gameplay',
          'Can be unreliable in critical moments',
          'Requires large Thread reserves to shine',
          'Intentional failures can backfire'
        ],

        passiveAbility: {
          name: 'Weaver of Fate',
          icon: 'spell_shadow_soulleech_3',
          description: 'You generate +1 additional Thread whenever you would gain Threads (1 becomes 2, 2 becomes 3). Additionally, you can spend 5 Threads of Destiny to force any spell to automatically succeed with maximum effect, or spend 3 Threads to force any spell to fail and gain its maximum Thread generation.'
        },

        keyAbilities: [
          "Embrace Chaos - Intentionally trigger negative outcomes on your spells to generate massive Threads, then spend them for guaranteed success (2 mana, high risk/reward)",
          "Thread Burst - Spend all your Threads at once to deal damage equal to Threads spent × 1d6 to all enemies (variable mana, empties Thread reserve)",
          "Destiny Reversal - Rewind the last spell cast (yours or an ally's) and force a different outcome (7 mana, costs 8 Threads)"
        ],

        recommendedFor: 'Players who enjoy high-variance gameplay, turning failures into victories, and explosive all-or-nothing moments.'
      }
    ]
  },

  // Example Spells - showcasing card-based mechanics
  exampleSpells: [
    {
      id: 'hand-of-fate',
      name: 'Hand of Fate',
      icon: 'inv_misc_tarot_01',
      spellType: 'ACTION',
      school: 'Divination',
      level: 3,

      description: 'Draw five cards to form a poker hand. You may redraw up to twice. The strength of your hand determines the spell effect: Royal Flush (ultimate), Straight Flush (massive damage), Four of a Kind (heavy damage), Full House (damage + heal), Flush (moderate damage), Straight (damage), Three of a Kind (light damage), Two Pair (heal + advantage), One Pair (heal), High Card (minimal effect).',

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
        components: ['verbal', 'somatic', 'material'],
        verbalText: 'Fatum Manus!',
        somaticText: 'Draw cards from mystical deck',
        materialText: 'Deck of fate cards'
      },

      resolution: 'CARDS',

      effects: {
        variable: {
          type: 'poker_hand',
          outcomes: 10
        }
      },

      specialMechanics: {
        threadsOfDestiny: {
          generation: 'High Card: +1 Thread (minimal effect)',
          usage: 'Spend 2 Threads to call a specific card for your hand'
        },
        cardDraw: {
          initial: 5,
          redraws: 2,
          description: 'Draw 5 cards, may redraw up to 2 times'
        },
        pokerHands: {
          type: 'standard_poker',
          rankings: 'Royal Flush > Straight Flush > Four of a Kind > Full House > Flush > Straight > Three of a Kind > Two Pair > One Pair > High Card'
        }
      },

      rollableTable: {
        enabled: true,
        name: 'Hand of Fate - Poker Hand Results',
        description: 'Draw 5 cards and form a poker hand (may redraw twice)',
        resolutionType: 'CARDS',
        resolutionConfig: { cardType: 'poker', draws: 5, redraws: 2 },
        entries: [
          { range: 'Royal Flush', result: '10d10 radiant damage + heal all allies for 5d8 + gain legendary action', description: 'A♠ K♠ Q♠ J♠ 10♠ - Ultimate hand' },
          { range: 'Straight Flush', result: '8d10 damage + stun target for 1 round', description: 'Five sequential cards of same suit' },
          { range: 'Four of a Kind', result: '6d10 damage to target', description: 'Four cards of same rank' },
          { range: 'Full House', result: '4d10 damage + heal self for 3d8', description: 'Three of a kind + pair' },
          { range: 'Flush', result: '4d8 damage', description: 'Five cards of same suit' },
          { range: 'Straight', result: '3d8 damage', description: 'Five sequential cards' },
          { range: 'Three of a Kind', result: '2d8 damage', description: 'Three cards of same rank' },
          { range: 'Two Pair', result: 'Heal 2d8 + advantage on next roll', description: 'Two different pairs' },
          { range: 'One Pair', result: 'Heal 1d8', description: 'Two cards of same rank' },
          { range: 'High Card', result: 'No effect + gain 1 Thread', description: 'No matching cards - weakest hand' }
        ]
      },

      tags: ['cards', 'poker', 'variable-damage', 'fate-weaver', 'thread-generation']
    },

    {
      id: 'draw-of-the-damned',
      name: 'Draw of the Damned',
      icon: 'spell_shadow_demonicempathy',
      spellType: 'ACTION',
      school: 'Abjuration',
      level: 3,

      description: 'Draw cards aiming for a total as close to 21 as possible (blackjack rules: Aces=1 or 11, Face cards=10, others=face value). The closer to 21, the higher the AC bonus granted to an ally for the rest of combat. Going over 21 (bust) reduces your AC for the next round instead.',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'ally',
        rangeType: 'ranged',
        rangeDistance: 30
      },

      durationConfig: {
        durationType: 'combat',
        description: 'AC bonus lasts for rest of combat'
      },

      resourceCost: {
        mana: 4,
        components: ['verbal', 'somatic', 'material'],
        verbalText: 'Viginti Unum!',
        somaticText: 'Draw cards rapidly',
        materialText: 'Deck of fate cards'
      },

      resolution: 'CARDS',

      effects: {
        buff: {
          conditional: {
            type: 'blackjack_total',
            success: 'AC bonus based on proximity to 21',
            failure: 'AC reduction on bust'
          }
        }
      },

      specialMechanics: {
        threadsOfDestiny: {
          generation: 'Bust (over 21): +2 Threads (major negative outcome)',
          usage: 'Spend 2 Threads to call a specific card to improve total'
        },
        blackjack: {
          target: 21,
          aceValue: '1 or 11',
          faceCards: 10,
          description: 'Draw cards trying to reach 21 without going over'
        }
      },

      rollableTable: {
        enabled: true,
        name: 'Draw of the Damned - Blackjack Results',
        description: 'Draw cards aiming for 21 (Aces=1/11, Face=10)',
        resolutionType: 'CARDS',
        resolutionConfig: { cardType: 'blackjack', target: 21 },
        entries: [
          { range: '21 (Blackjack)', result: 'Ally gains +5 AC for rest of combat', description: 'Perfect score' },
          { range: '19-20', result: 'Ally gains +4 AC for rest of combat', description: 'Excellent score' },
          { range: '17-18', result: 'Ally gains +3 AC for rest of combat', description: 'Good score' },
          { range: '15-16', result: 'Ally gains +2 AC for rest of combat', description: 'Decent score' },
          { range: '12-14', result: 'Ally gains +1 AC for rest of combat', description: 'Weak score' },
          { range: '11 or less', result: 'No effect + gain 1 Thread', description: 'Too low - spell fails' },
          { range: '22-25 (Bust)', result: 'You lose -2 AC next round + gain 2 Threads', description: 'Moderate bust' },
          { range: '26+ (Major Bust)', result: 'You lose -3 AC next round + gain 2 Threads', description: 'Severe bust' }
        ]
      },

      tags: ['cards', 'blackjack', 'buff', 'ac-bonus', 'fate-weaver', 'thread-generation']
    },

    {
      id: 'hearts-gamble',
      name: "Heart's Gamble",
      icon: 'inv_valentinescard02',
      spellType: 'ACTION',
      school: 'Evocation',
      level: 2,

      description: 'Draw cards one at a time, avoiding hearts and face cards. Each heart drawn deals 1d6 damage to you. Each face card (J, Q, K) deals 2d6 damage. Other cards grant positive effects: Aces grant advantage, numbered cards grant damage boosts. You may stop drawing at any time.',

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
        mana: 3,
        components: ['verbal', 'somatic', 'material'],
        verbalText: 'Cor Periculum!',
        somaticText: 'Draw cards cautiously',
        materialText: 'Deck of fate cards'
      },

      resolution: 'CARDS',

      damageConfig: {
        formula: 'variable',
        damageType: 'variable',
        scalingType: 'card_based'
      },

      effects: {
        variable: {
          type: 'sequential_card_draw',
          risk: 'Hearts and face cards deal self-damage',
          reward: 'Aces and numbered cards grant buffs'
        }
      },

      specialMechanics: {
        threadsOfDestiny: {
          generation: '1 heart: +1 Thread, 2+ hearts or face card: +2 Threads',
          usage: 'Spend 2 Threads to peek at next card before drawing'
        },
        cardEffects: {
          hearts: '1d6 damage per heart',
          faceCards: '2d6 damage per face card (J, Q, K)',
          aces: 'Advantage on next attack',
          numbered: '+1d4 damage on next attack per card'
        },
        stopAnytime: 'You may stop drawing at any time to lock in your buffs'
      },

      rollableTable: {
        enabled: true,
        name: "Heart's Gamble - Card Effects",
        description: 'Draw cards sequentially, stop anytime',
        resolutionType: 'CARDS',
        resolutionConfig: { cardType: 'sequential', stopAnytime: true },
        entries: [
          { range: 'Ace (any suit)', result: 'Gain advantage on your next attack roll', description: 'Positive effect' },
          { range: '2-10 (non-hearts)', result: 'Gain +1d4 damage on next attack (stacks)', description: 'Positive effect' },
          { range: 'Heart (2-10)', result: 'Take 1d6 damage + gain 1 Thread', description: 'Minor negative' },
          { range: 'Face Card (J, Q, K)', result: 'Take 2d6 damage + gain 2 Threads', description: 'Major negative' },
          { range: 'Ace of Hearts', result: 'Take 1d6 damage BUT gain advantage (mixed)', description: 'Mixed outcome' }
        ]
      },

      tags: ['cards', 'self-damage', 'buff', 'risk-reward', 'fate-weaver', 'thread-generation']
    },

    {
      id: 'war-of-wills',
      name: 'War of Wills',
      icon: 'ability_warrior_battleshout',
      spellType: 'ACTION',
      school: 'Evocation',
      level: 1,

      description: 'Challenge a creature to a card draw. Both you and the target draw one card. Higher card wins: if you win, deal 3d8 damage. If you lose, heal the target for 2d8. If you tie, both take 1d8 damage.',

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
        mana: 2,
        components: ['verbal', 'somatic', 'material'],
        verbalText: 'Bellum Voluntatis!',
        somaticText: 'Draw card dramatically',
        materialText: 'Deck of fate cards'
      },

      resolution: 'CARDS',

      damageConfig: {
        formula: '3d8',
        damageType: 'force',
        scalingType: 'none'
      },

      effects: {
        variable: {
          type: 'competitive_draw',
          win: '3d8 damage to target',
          lose: '2d8 healing to target',
          tie: '1d8 damage to both'
        }
      },

      specialMechanics: {
        threadsOfDestiny: {
          generation: 'Lose: +1 Thread, Tie: +1 Thread',
          usage: 'Spend 2 Threads to call a specific card for your draw'
        },
        competitive: {
          type: 'high_card_wins',
          cardValues: 'Ace=14, King=13, Queen=12, Jack=11, 10-2=face value',
          tiebreaker: 'Suits (Spades > Hearts > Diamonds > Clubs)'
        }
      },

      rollableTable: {
        enabled: true,
        name: 'War of Wills - Competitive Draw',
        description: 'Both draw one card, higher wins',
        resolutionType: 'CARDS',
        resolutionConfig: { cardType: 'competitive', players: 2 },
        entries: [
          { range: 'You Win', result: 'Deal 3d8 force damage to target', description: 'Your card is higher' },
          { range: 'You Lose', result: 'Target heals for 2d8 HP + you gain 1 Thread', description: 'Target\'s card is higher' },
          { range: 'Tie', result: 'Both take 1d8 damage + you gain 1 Thread', description: 'Same card value' }
        ]
      },

      tags: ['cards', 'competitive', 'damage', 'healing', 'fate-weaver', 'thread-generation']
    },

    {
      id: 'solitaires-shield',
      name: "Solitaire's Shield",
      icon: 'spell_holy_powerwordbarrier',
      spellType: 'ACTION',
      school: 'Abjuration',
      level: 4,

      description: 'Draw cards and attempt to match them in sequences (consecutive numbers) or sets (same rank). Completing a sequence of 3+ cards allows you to cast your next spell for free. Completing a set of 3+ cards heals you for 2d8 per card in the set. Failing to complete any sequence or set generates Threads.',

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
        mana: 5,
        components: ['verbal', 'somatic', 'material'],
        verbalText: 'Solitudo Protegat!',
        somaticText: 'Arrange cards in patterns',
        materialText: 'Deck of fate cards'
      },

      resolution: 'CARDS',

      effects: {
        variable: {
          type: 'pattern_matching',
          sequence: 'Free spell cast',
          set: 'Healing based on set size'
        }
      },

      specialMechanics: {
        threadsOfDestiny: {
          generation: 'No sequence or set: +1 Thread',
          usage: 'Spend 2 Threads to call a specific card to complete pattern'
        },
        patterns: {
          sequence: '3+ consecutive numbers (e.g., 5-6-7)',
          set: '3+ cards of same rank (e.g., three 8s)',
          reward: 'Sequence = free spell, Set = 2d8 healing per card'
        }
      },

      rollableTable: {
        enabled: true,
        name: "Solitaire's Shield - Pattern Matching",
        description: 'Draw cards and form sequences or sets',
        resolutionType: 'CARDS',
        resolutionConfig: { cardType: 'pattern_matching' },
        entries: [
          { range: 'Sequence of 5+', result: 'Cast next 2 spells for free', description: 'e.g., 3-4-5-6-7' },
          { range: 'Sequence of 4', result: 'Cast next spell for free + gain 1d8 temp HP', description: 'e.g., 8-9-10-J' },
          { range: 'Sequence of 3', result: 'Cast next spell for free', description: 'e.g., 2-3-4' },
          { range: 'Set of 4', result: 'Heal 8d8 HP', description: 'Four of same rank' },
          { range: 'Set of 3', result: 'Heal 6d8 HP', description: 'Three of same rank' },
          { range: 'No pattern', result: 'No effect + gain 1 Thread', description: 'Failed to match' }
        ]
      },

      tags: ['cards', 'pattern-matching', 'healing', 'utility', 'fate-weaver', 'thread-generation']
    },

    {
      id: 'echo-of-fate',
      name: 'Echo of Fate',
      icon: 'spell_arcane_prismaticcloak',
      spellType: 'ACTION',
      school: 'Divination',
      level: 3,

      description: 'Draw a card and have an ally within 30 feet draw a card. If the cards match (same rank), your next spell deals double damage or heals for double. If they don\'t match, your next spell is halved. Coordinate with allies for best results.',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'ally',
        rangeType: 'ranged',
        rangeDistance: 30
      },

      durationConfig: {
        durationType: 'next_spell',
        description: 'Affects your next spell cast'
      },

      resourceCost: {
        mana: 4,
        components: ['verbal', 'somatic', 'material'],
        verbalText: 'Echo Fati!',
        somaticText: 'Draw card and gesture to ally',
        materialText: 'Deck of fate cards'
      },

      resolution: 'CARDS',

      effects: {
        buff: {
          conditional: {
            match: 'Next spell doubled',
            mismatch: 'Next spell halved'
          }
        }
      },

      specialMechanics: {
        threadsOfDestiny: {
          generation: 'Mismatch: +1 Thread',
          usage: 'Spend 2 Threads to call a specific card for your draw'
        },
        coordination: {
          type: 'ally_cooperation',
          description: 'Ally draws a card too - matching ranks = success',
          strategy: 'Communicate with ally about what cards they need'
        }
      },

      rollableTable: {
        enabled: true,
        name: 'Echo of Fate - Card Matching',
        description: 'You and ally each draw one card',
        resolutionType: 'CARDS',
        resolutionConfig: { cardType: 'matching', players: 2 },
        entries: [
          { range: 'Perfect Match (same card)', result: 'Next spell tripled + both gain 1d8 temp HP', description: 'Same rank AND suit' },
          { range: 'Rank Match', result: 'Next spell doubled', description: 'Same rank, different suit' },
          { range: 'Suit Match', result: 'Next spell +50%', description: 'Same suit, different rank' },
          { range: 'No Match', result: 'Next spell halved + gain 1 Thread', description: 'Different rank and suit' }
        ]
      },

      tags: ['cards', 'matching', 'buff', 'ally-cooperation', 'fate-weaver', 'thread-generation']
    },

    {
      id: 'fates-exchange',
      name: "Fate's Exchange",
      icon: 'spell_arcane_blink',
      spellType: 'ACTION',
      school: 'Conjuration',
      level: 4,

      description: 'Swap your position with an ally within 30 feet, allowing for strategic repositioning in combat. Both you and the ally teleport to each other\'s locations instantly.',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'ally',
        rangeType: 'ranged',
        rangeDistance: 30
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 5,
        components: ['verbal', 'somatic'],
        verbalText: 'Permutatio Fati!',
        somaticText: 'Gesture between self and ally'
      },

      resolution: 'AUTOMATIC',

      effects: {
        utility: {
          type: 'position_swap',
          range: 30,
          description: 'Instant teleportation swap with ally'
        }
      },

      specialMechanics: {
        threadsOfDestiny: {
          usage: 'Spend 1 Thread to increase range to 60 feet'
        },
        tactical: {
          uses: ['Save ally from danger', 'Position for flanking', 'Escape melee', 'Protect squishy allies']
        }
      },

      tags: ['utility', 'teleport', 'tactical', 'ally-support', 'fate-weaver']
    },

    {
      id: 'echoes-of-the-past',
      name: 'Echoes of the Past',
      icon: 'spell_holy_sealofwisdom',
      spellType: 'ACTION',
      school: 'Divination',
      level: 1,

      description: 'Call upon past actions to gain proficiency in a skill or tool of your choice for 1 hour. You channel the knowledge of those who came before.',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      durationConfig: {
        durationType: 'timed',
        duration: 1,
        durationUnit: 'hour'
      },

      resourceCost: {
        mana: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Memoria Praeteritorum!',
        somaticText: 'Touch forehead and recall memories'
      },

      resolution: 'AUTOMATIC',

      effects: {
        buff: {
          type: 'proficiency_grant',
          duration: '1 hour',
          choice: 'any skill or tool'
        }
      },

      specialMechanics: {
        threadsOfDestiny: {
          usage: 'Spend 3 Threads to gain expertise instead of proficiency'
        },
        versatility: {
          description: 'Choose any skill or tool proficiency when cast',
          examples: ['Lockpicking for a heist', 'Persuasion for negotiation', 'Arcana for ritual identification']
        }
      },

      tags: ['utility', 'buff', 'proficiency', 'versatile', 'fate-weaver']
    },

    {
      id: 'destiny-bond',
      name: 'Destiny Bond',
      icon: 'spell_holy_prayerofhealing',
      spellType: 'ACTION',
      school: 'Necromancy',
      level: 4,

      description: 'Create a bond with an ally, allowing you to transfer up to half of your current hit points to them for 1 AP. The bond lasts for 1 minute.',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'ally',
        rangeType: 'ranged',
        rangeDistance: 30
      },

      durationConfig: {
        durationType: 'timed',
        duration: 1,
        durationUnit: 'minute'
      },

      resourceCost: {
        mana: 5,
        components: ['verbal', 'somatic'],
        verbalText: 'Vinculum Destini!',
        somaticText: 'Extend hand toward ally'
      },

      resolution: 'AUTOMATIC',

      effects: {
        healing: {
          type: 'hp_transfer',
          maximum: '50% of current HP',
          action: '1 AP',
          duration: '1 minute'
        }
      },

      specialMechanics: {
        threadsOfDestiny: {
          usage: 'Spend 2 Threads to allow ally to transfer HP back to you'
        },
        sacrifice: {
          description: 'Transfer your HP to save allies',
          limit: 'Up to half your current HP per transfer',
          frequency: '1 AP while bond is active'
        }
      },

      tags: ['healing', 'support', 'sacrifice', 'bond', 'fate-weaver']
    }
  ]
};