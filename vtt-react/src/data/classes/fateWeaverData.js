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
    },

    immersiveCombatExample: {
      title: 'Combat Example: The Gambler\'s Paradox',
      content: `**The Setup**: You're a Fate Weaver (Fortune Teller specialization) facing a powerful necromancer and two skeletal guards. Your party needs you to deal damage, but your spells are card-based—unpredictable. Starting Threads: 4. Starting Mana: 45/50. Your goal: Use card mechanics strategically, build Threads from failures, then spend them to guarantee success when it matters.

**Starting State**: Threads: 4/20 | Mana: 45/50 | HP: 55/70 | Deck: Shuffled (52 cards)

**Turn 1 - The Risky Play (Threads: 4 → 5)**

*The necromancer raises his staff, dark energy crackling. The skeletal guards advance. You draw a card from your mystical deck. Time to see what fate has in store.*

**Your Action**: Cast "Hand of Fate" on Necromancer (8 mana, draw 5 cards for poker hand)
**Cards Drawn**: [3♠, 7♦, J♣, 2♥, 9♠]
**Poker Hand**: High Card (Jack) - WORST POSSIBLE HAND
**Damage**: 2d6 (base for High Card) → [4, 5] = 9 damage
**Thread Generation**: +1 Thread (spell succeeded but with minimal effect)

*The cards shimmer and fade. A weak bolt of energy strikes the necromancer. He barely flinches. But you feel it—a Thread of Destiny forming from the failure. The universe owes you one.*

**Threads**: 4 + 1 = **5 Threads**
**Mana**: 45 - 8 = 37/50

**Necromancer's Turn**: Casts "Bone Spear" at you → 3d8 → [6, 7, 5] = 18 damage
**Your HP**: 55 - 18 = 37/70

**Current State**: Threads: 5/20 | Mana: 37/50 | HP: 37/70

**Turn 2 - Building Threads (Threads: 5 → 8)**

*You're hurt, but you have a plan. You need more Threads. Time to take a risk.*

**Your Action**: Cast "Draw of the Damned" on Skeletal Guard #1 (6 mana, blackjack-style)
**Goal**: Get close to 21 for maximum damage, but don't bust

**Card 1**: [K♥] = 10 → Total: 10
**Decision**: Hit (draw another card)
**Card 2**: [8♣] = 8 → Total: 18
**Decision**: Hit (risky, but you want more damage)
**Card 3**: [9♦] = 9 → Total: 27 → **BUST!**

*The cards explode in your face. Dark energy backlashes, reducing your AC.*

**Result**: Bust (over 21) → AC reduced by 2 for 2 rounds, NO DAMAGE to target
**Thread Generation**: +2 Threads (major negative outcome)
**Threads**: 5 + 2 = **7 Threads**
**Mana**: 37 - 6 = 31/50

*Your party's tank groans. "Did you just... hurt yourself?" You smile through the pain. "I'm building resources. Trust me."*

**Skeletal Guard #1's Turn**: Attacks you (you have -2 AC!) → Hit! → 2d6+2 → [5, 4] + 2 = 11 damage
**Your HP**: 37 - 11 = 26/70

**Your Party's Healer**: Heals you for 15 HP
**Your HP**: 26 + 15 = 41/70

**Current State**: Threads: 7/20 | Mana: 31/50 | HP: 41/70 | AC: -2 (1 round remaining)

**Turn 3 - The Setup (Threads: 7 → 9)**

*You're at 7 Threads. Not quite enough to guarantee the perfect hand, but getting close. One more failure should do it.*

**Your Action**: Cast "Heart's Gamble" on Skeletal Guard #2 (5 mana, draw cards until non-heart)
**Goal**: Draw as few hearts as possible for maximum damage to enemy

**Card 1**: [4♥] → Heart! → Continue drawing
**Card 2**: [Q♥] → Heart (face card)! → Continue drawing
**Card 3**: [7♠] → Non-heart! → STOP

**Result**: Drew 2 hearts (one face card) → Take 2d6 damage yourself
**Damage to Self**: 2d6 → [5, 6] = 11 damage
**Damage to Enemy**: 0 (hearts cancel damage)
**Thread Generation**: +2 Threads (major negative outcome - face card heart + self-damage)

*The cards turn against you. Hearts burn your hands. You scream, but you're SMILING. Two more Threads. You're at 9 now.*

**Your HP**: 41 - 11 = 30/70
**Threads**: 7 + 2 = **9 Threads**
**Mana**: 31 - 5 = 26/50

**Your Party's Rogue**: "Are you TRYING to kill yourself?!"
**You**: "No. I'm trying to kill HIM." *You point at the necromancer.* "Next turn. Watch."

**Current State**: Threads: 9/20 | Mana: 26/50 | HP: 30/70

**Turn 4 - The Payoff (Threads: 9 → 1)**

*You're at 9 Threads. Enough to call 4 specific cards (2 Threads per card). Time to build a Royal Flush.*

**Your Action**: Cast "Hand of Fate" on Necromancer (8 mana, draw 5 cards)
**Thread Spending**: Spend 8 Threads to call 4 specific cards (2 Threads each)

**Called Cards**:
- Call [A♠] (2 Threads)
- Call [K♠] (2 Threads)
- Call [Q♠] (2 Threads)
- Call [J♠] (2 Threads)

**Random 5th Card**: [10♠] → **ROYAL FLUSH!**

*The cards appear in your hand, glowing with golden light. Ace, King, Queen, Jack, Ten—all spades. The BEST POSSIBLE HAND. The necromancer's eyes widen.*

**Poker Hand**: Royal Flush (best hand)
**Damage**: 10d10 (Royal Flush damage) → [9, 8, 10, 7, 9, 6, 10, 8, 9, 7] = **83 damage!**

*The cards explode into pure radiant energy, engulfing the necromancer. He screams as the light consumes him. When it fades, he's DEAD. Obliterated.*

**Threads**: 9 - 8 = **1 Thread**
**Mana**: 26 - 8 = 18/50

**Your Party**: *Stunned silence*
**Your Tank**: "...Okay, I take it back. That was worth it."
**You**: "Told you. Fate favors the patient."

**Skeletal Guards**: Without their master, the guards crumble to dust.

**Combat Over**

**The Lesson**: Fate Weaver gameplay is about:
1. **Thread Building**: Turns 1-3 generated 5 Threads (1 + 2 + 2) from failures and negative outcomes
2. **Accepting Failure**: Deliberately took risky plays (Draw of the Damned bust, Heart's Gamble) to build Threads
3. **Self-Damage Trade**: Took 11 damage from Heart's Gamble but gained 2 Threads—worth it for the setup
4. **Thread Spending**: Spent 8 Threads to call 4 specific cards, guaranteeing 4/5 of a Royal Flush
5. **Luck + Skill**: Random 5th card ([10♠]) completed the Royal Flush—but you stacked the odds
6. **Damage Variance**: Turn 1 dealt 9 damage (High Card), Turn 4 dealt 83 damage (Royal Flush) - 9x multiplier!
7. **Resource Conversion**: Converted 3 turns of failures/self-damage into 1 turn of massive burst

You're not a consistent damage dealer. You're a GAMBLER who turns bad luck into good luck. You take hits, you fail spells, you hurt yourself—all to build Threads. Then, when it matters, you spend those Threads to manipulate fate itself. You don't just draw cards. You CALL them. And when you call a Royal Flush, nothing survives.`
    }
  },

  // Resource System section
  resourceSystem: {
    title: 'Threads of Destiny',
    subtitle: 'Weaving Fate from Failure',

    description: `Threads of Destiny are the Fate Weaver's unique resource, generated whenever their spells fail or produce negative outcomes. These mystical threads represent the cosmic energy released when destiny is disrupted, which the Fate Weaver can then harness to manipulate future events. By spending Threads, Fate Weavers can call specific cards from their deck, transforming randomness into calculated strategy.`,

    resourceBarExplanation: {
      title: 'Understanding Your Threads of Destiny Gauge',
      content: `**What You See**: Your Threads of Destiny gauge displays as a horizontal bar with 20 segments, each representing 1 Thread. The bar is styled like a golden tapestry with intricate weaving patterns. As you accumulate Threads, the segments fill with shimmering golden-silver energy, representing the cosmic threads you've woven from fate's disruptions.

**Visual Representation by Thread Level**:

**0-3 Threads (Building Phase)**:
- Bar: 0-3 segments filled with dim golden glow
- Border: Gray (neutral)
- Effect: Minimal visual effects
- Status: "Building Threads"
- Recommendation: "Accept failures to build reserves"

**4-7 Threads (Moderate Reserve)**:
- Bar: 4-7 segments filled, golden glow brightening
- Border: Yellow (caution)
- Effect: Threads shimmer and pulse gently
- Status: "Moderate Reserve"
- Recommendation: "Spend on critical spells only"
- Call Card Button: Enabled (glowing) - "Call Specific Card (2 Threads)"

**8-12 Threads (Good Reserve)**:
- Bar: 8-12 segments filled, bright golden energy
- Border: Green (good)
- Effect: Threads weave together in animated patterns
- Status: "Good Reserve"
- Recommendation: "Spend freely on important moments"
- Call Card Button: Brightly glowing - "4-6 cards available"

**13-16 Threads (High Reserve)**:
- Bar: 13-16 segments filled, intense golden-white glow
- Border: Blue (excellent)
- Effect: Threads pulse with power, weaving complex patterns
- Status: "High Reserve - Aggressive Manipulation"
- Recommendation: "Maximize control over fate"
- Call Card Button: Pulsing - "6-8 cards available"

**17-20 Threads (At/Near Cap)**:
- Bar: 17-20 segments filled, maximum brightness
- Border: Orange (warning - approaching cap)
- Effect: Threads overflow with energy, sparkling particles
- Status: "AT CAP - Spend or Waste!"
- Recommendation: "Spend liberally to avoid waste"
- Warning Text: "Thread generation will be wasted if at 20!"

**Thread Generation Animation**:
When you gain Threads from a failure or negative outcome:
- **+1 Thread**: Single golden thread appears from the spell effect, flows to your bar, fills 1 segment
- **+2 Threads**: Two golden threads appear, intertwine, flow to bar, fill 2 segments with dramatic animation
- **Audio**: Soft chime sound for +1 Thread, louder chime for +2 Threads
- **Text Popup**: "+1 Thread of Destiny (Spell Failure)" or "+2 Threads (Major Negative Outcome)"

**Thread Spending Animation**:
When you spend Threads to call a specific card:
- **Cost Display**: "Call [A♠] - 2 Threads" button appears
- **Spending**: 2 segments drain from bar with reverse animation
- **Card Appearance**: The called card materializes from golden energy, spinning into your hand
- **Audio**: Magical whoosh sound, card shuffle sound
- **Text Popup**: "Called [A♠] from deck (-2 Threads)"

**Deck Display Integration**:
Your Threads gauge is positioned above your card deck display, showing:
- **Top Card Preview**: If you have Destiny's Insight passive, top card of deck shown
- **Cards in Hand**: Current cards drawn for active spell
- **Cards Remaining**: "Cards in deck: 47/52"
- **Call Card Interface**: Dropdown menu to select specific card to call (costs 2 Threads)

**Call Card Interface** (when you have 2+ Threads):
- **Button**: "Call Specific Card (2 Threads)" - glows when available
- **Click**: Opens card selector showing all 52 cards
- **Selection**: Click a card (e.g., A♠) → Confirmation "Call [A♠] for 2 Threads?"
- **Confirm**: Card is pulled from deck, added to your hand, 2 Threads spent
- **Limitation**: Once per turn (grayed out after use)

**Failure Feedback System**:
When a spell fails or produces negative outcome:
- **Spell Effect**: Shows failure animation (e.g., cards fizzling, bust explosion)
- **Thread Generation**: Golden threads emerge from the failure, flow to your bar
- **Positive Spin**: Text says "Failure converted to 1 Thread!" (not just "Spell Failed")
- **Visual**: Even failures look visually rewarding (golden energy, chimes, positive feedback)

**Strategic Indicators**:
- **At 0-3 Threads**: Tooltip says "Not enough to call cards - accept failures to build"
- **At 4-7 Threads**: Tooltip says "Can call 2-3 cards - save for critical moments"
- **At 8-12 Threads**: Tooltip says "Can call 4-6 cards - good reserve for manipulation"
- **At 13-16 Threads**: Tooltip says "Can call 6-8 cards - aggressive manipulation available"
- **At 17-20 Threads**: Tooltip says "AT CAP - spend or waste generation!"

**Why This Matters**: The Threads of Destiny gauge transforms failures into victories. When you bust on Draw of the Damned and take damage, you don't just feel bad—you see 2 golden threads flow into your bar, hear the chime, and read "+2 Threads (Major Negative Outcome)". The visual feedback makes failures feel GOOD because they're building your power. Then, when you spend 8 Threads to call 4 specific cards and build a Royal Flush, you see each card materialize from golden energy, and you FEEL the payoff. The gauge isn't just a resource bar—it's a visual story of turning bad luck into good luck, one thread at a time.`
    },

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