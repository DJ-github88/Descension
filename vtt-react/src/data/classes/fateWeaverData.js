/**
 * Fate Weaver Class Data
 * 
 * Complete class information for the Fate Weaver - a card-based destiny manipulator
 * who uses Threads of Destiny to control the flow of fate.
 */

export const FATE_WEAVER_DATA = {
  id: 'fate-weaver',
  name: 'Fate Weaver',
  icon: 'fas fa-magic',
  role: 'Support/Control',

  // Level-based spell pools for starter/auto-assignment
  // Used when switching class to immediately grant known spells
  spellPools: {
    1: [
      'war-of-wills',
      'echoes-of-the-past',
      'hand-of-fate'
    ]
  },

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
- Maximum Thread capacity: 13 Threads (13 cards per suit: Ace through King)

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

**Starting State**: Threads: 4/13 | Mana: 45/50 | HP: 55/70 | Deck: Shuffled (52 cards)

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

**Current State**: Threads: 5/13 | Mana: 37/50 | HP: 37/70

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

**Current State**: Threads: 7/13 | Mana: 31/50 | HP: 41/70 | AC: -2 (1 round remaining)

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

**Current State**: Threads: 9/13 | Mana: 26/50 | HP: 30/70

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
      content: `**What You See**: Your Threads of Destiny gauge displays as a horizontal bar with 13 segments, each representing 1 Thread (mirroring the 13 cards per suit: Ace through King). The bar is styled like a golden tapestry with intricate weaving patterns and card suit symbols (♠ ♥ ♦ ♣). As you accumulate Threads, the segments fill with shimmering golden-silver energy, representing the cosmic threads you've woven from fate's disruptions.

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

**10-12 Threads (Destiny's Web)**:
- Bar: 10-12 segments filled, intense orange-gold glow
- Border: Orange-gold (high reserve)
- Effect: Threads pulse with power, weaving complex patterns
- Status: "Destiny's Web - Aggressive Manipulation"
- Recommendation: "Maximize control over fate"
- Call Card Button: Pulsing - "5-6 cards available"

**13 Threads (Fate Mastered - The King)**:
- Bar: All 13 segments filled, maximum brightness with crown symbol
- Border: Golden (warning - at cap)
- Effect: Threads overflow with energy, sparkling particles
- Status: "FATE MASTERED - The King's Power!"
- Recommendation: "Spend liberally to avoid waste"
- Warning Text: "Thread generation will be wasted if at 13!"

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
- **At 0-3 Threads**: Tooltip says "Sparse Threads - accept failures to build"
- **At 4-6 Threads**: Tooltip says "Woven Strands - can call 2-3 cards, save for critical moments"
- **At 7-9 Threads**: Tooltip says "Tapestry of Fate - can call 3-4 cards, good reserve for manipulation"
- **At 10-12 Threads**: Tooltip says "Destiny's Web - can call 5-6 cards, aggressive manipulation available"
- **At 13 Threads**: Tooltip says "FATE MASTERED - The King's Power! Spend or waste generation!"

**Why This Matters**: The Threads of Destiny gauge transforms failures into victories. When you bust on Draw of the Damned and take damage, you don't just feel bad—you see 2 golden threads flow into your bar, hear the chime, and read "+2 Threads (Major Negative Outcome)". The visual feedback makes failures feel GOOD because they're building your power. Then, when you spend 8 Threads to call 4 specific cards and build a Royal Flush, you see each card materialize from golden energy, and you FEEL the payoff. At 13 Threads, you've achieved "Fate Mastered" - the King's power - and the bar glows with maximum intensity. The gauge isn't just a resource bar—it's a visual story of turning bad luck into good luck, one thread at a time.`
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
- **Maximum**: 13 Threads (representing the 13 cards per suit: Ace through King)
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
          ['0-3 Threads', 'Accept random draws, build reserves', 'Sparse Threads - not enough to reliably call cards'],
          ['4-6 Threads', 'Spend on critical spells only', 'Woven Strands - moderate reserve, use sparingly'],
          ['7-9 Threads', 'Spend freely on important moments', 'Tapestry of Fate - good reserve, can afford to manipulate'],
          ['10-12 Threads', 'Aggressive manipulation', 'Destiny\'s Web - high reserve, maximize control'],
          ['13 Threads', 'At cap, must spend or waste', 'Fate Mastered - The King\'s Power! Spend liberally to avoid waste']
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
5. **Cap Awareness**: At 13 Threads (Fate Mastered), you must spend or waste generation—don't let Threads go to waste

**Advanced Techniques**:
- **Intentional Failure**: Sometimes accepting a negative outcome to gain 2 Threads is worth it
- **Thread Cycling**: Spend Threads to call cards that enable Thread generation (risky cards)
- **Combo Setup**: Use Threads to assemble specific card combinations for powerful effects
- **Ally Coordination**: In Echo of Fate, coordinate with allies to ensure matching cards`
    },

    playingInPerson: {
      title: 'Playing Fate Weaver In Person',
      content: `**Required Materials**:
- **Standard 52-Card Deck** (no jokers)
- **13 Thread Tokens** (gold/silver tokens, beads, or coins)
- **Thread Tracker Card** (showing 0-13 Thread capacity)
- **Poker Hand Reference** (rankings for Hand of Fate spell)
- **Blackjack Reference** (card values for Draw of the Damned spell)
- **Discard Pile** (separate area for used cards)
- **Hand Holder** (optional, for organizing your current hand)

**Primary Tracking Method: Physical Playing Cards + Thread Tokens**

The Fate Weaver is the ONLY class that uses actual playing cards as their core mechanic. You shuffle a real deck, draw real cards, and use Thread tokens to manipulate your draws. This creates an incredibly immersive, tactile experience where you're literally playing card games within your TTRPG.

**Setup**:
\`\`\`
FATE WEAVER SETUP:

DECK: [52 cards, shuffled] ← Your spell deck
HAND: [5 cards] ← Current hand (max 5, or 7 for Card Master)
DISCARD: [Used cards] ← Reshuffled when deck runs out

THREADS OF DESTINY: [○][○][○][○][○][○][○][○][○][○][○][○][○]
Current: 0/13 (max = 13, one per card rank Ace-King)

THREAD GENERATION:
• Spell fails or has no effect: +1 Thread
• Spell has negative outcome: +1-2 Threads (severity-based)

THREAD SPENDING:
• Call Specific Card: 2 Threads (once per turn)
• Look at Top 3 Cards: 1 Thread (choose which to draw)
\`\`\`

**How It Works**:

**Drawing Cards**:
1. Shuffle your 52-card deck at the start of combat
2. Draw 5 cards to form your starting hand
3. When you cast a card-based spell, you draw/play cards from your hand
4. When your hand is empty or you need more cards, draw from the deck
5. When the deck runs out, reshuffle the discard pile

**Generating Threads**:
1. **Spell Fails**: If a card-based spell fails or has no effect → +1 Thread token
2. **Negative Outcome**: If a spell hurts you or backfires → +1-2 Thread tokens
3. **Blackjack Bust**: If you bust in Draw of the Damned → +2 Thread tokens
4. **Poker Hand Fails**: If you can't make the required hand → +1 Thread token

**Spending Threads**:
1. **Call Specific Card** (2 Threads, once per turn):
   - Announce which card you want (e.g., "Ace of Spades")
   - Search your deck for that card
   - Add it to your hand
   - Reshuffle the deck

2. **Look at Top 3** (1 Thread, when drawing):
   - Look at top 3 cards of deck
   - Choose which one to draw
   - Put the other 2 on bottom of deck in any order

**Example Card-Based Spell: Hand of Fate (Poker)**

*You cast Hand of Fate, which requires you to make a poker hand*

**Your Current Hand**: [7♠][7♥][K♦][3♣][9♠]

**Turn 1 - Natural Draw**:
1. "I cast Hand of Fate!"
2. Look at your hand: You have a pair of 7s
3. **Pair** = 2d6 damage → Roll [4,5] = 9 damage
4. Discard the 5 cards used
5. No Threads generated (spell succeeded)

**Turn 2 - Bad Draw**:
1. Draw 5 new cards: [2♠][5♥][8♦][J♣][K♠]
2. "I cast Hand of Fate again!"
3. Look at your hand: No pairs, no straights, no flushes
4. **High Card** = 1d4 damage → Roll [2] = 2 damage (weak!)
5. Discard the 5 cards
6. **Generate 1 Thread** (spell was weak/ineffective)
7. Add 1 gold token to Thread pool → **1 Thread**

**Turn 3 - Using Threads to Call Cards**:
1. Draw 5 new cards: [4♠][6♥][9♦][Q♣][A♠]
2. "I spend 2 Threads to call Ace of Hearts!"
3. Remove 2 gold tokens → **0 Threads** (spent 2, had 1... wait, need 2!)
4. Actually, you only have 1 Thread, so you can't call a card yet
5. Cast Hand of Fate with current hand: No pairs
6. **High Card** again = 1d4 damage
7. **Generate 1 Thread** → **2 Threads** total

**Turn 4 - Now You Can Call Cards**:
1. Draw 5 new cards: [3♠][8♥][10♦][J♣][K♠]
2. "I spend 2 Threads to call Ace of Spades!"
3. Remove 2 gold tokens → **0 Threads**
4. Search deck for A♠, add to hand
5. Discard one card (K♠) to make room
6. New hand: [3♠][8♥][10♦][J♣][A♠]
7. "I spend 2 more Threads to call Ace of Hearts!"
8. Wait, you have 0 Threads now, can't call another card
9. Cast Hand of Fate: Still just high card
10. **Generate 1 Thread** → **1 Thread**

**Turn 5 - Building Toward Royal Flush**:
1. You need 4 more Threads to call 2 more cards
2. Accept some failures to build Threads
3. Eventually, with enough Threads, you can call:
   - 10♠, J♠, Q♠, K♠, A♠ = **ROYAL FLUSH!**
   - 10d10 damage → Roll [8,9,10,7,6,8,9,10,7,8] = 82 damage!

**Example Card-Based Spell: Draw of the Damned (Blackjack)**

*You cast Draw of the Damned, which uses blackjack rules*

**Turn 1 - Safe Play**:
1. "I cast Draw of the Damned!"
2. Draw 2 cards: [K♠][7♥] = 17 (King = 10, 7 = 7)
3. "I stand at 17"
4. Deal 3d6 damage → Roll [4,5,6] = 15 damage
5. Discard cards
6. No Threads generated (safe play, no bust)

**Turn 2 - Risky Play**:
1. Draw 2 cards: [5♠][6♥] = 11
2. "I hit!" (draw another card)
3. Draw: [9♦] = 20 (5+6+9)
4. "I stand at 20"
5. Deal 5d6 damage → Roll [6,5,4,6,5] = 26 damage!
6. No Threads generated (successful risk)

**Turn 3 - BUST!**:
1. Draw 2 cards: [10♠][8♥] = 18
2. "I hit!" (greedy play)
3. Draw: [7♦] = 25 (BUST! Over 21)
4. Take 3d6 damage to yourself → Roll [4,3,5] = 12 damage to me!
5. **Generate 2 Threads** (negative outcome, hurt yourself)
6. Add 2 gold tokens → **2 Threads**

**Turn 4 - Using Threads to Guarantee 21**:
1. Draw 2 cards: [9♠][5♥] = 14
2. "I spend 2 Threads to call 7 of Spades!"
3. Remove 2 gold tokens → **0 Threads**
4. Search deck for 7♠, add to hand
5. Total: 9+5+7 = 21 (BLACKJACK!)
6. Deal 6d6 damage → Roll [6,6,5,4,6,5] = 32 damage!
7. No Threads generated (perfect play)

**Poker Hand Rankings (for Hand of Fate)**:
\`\`\`
POKER HANDS (Highest to Lowest):

ROYAL FLUSH (10-J-Q-K-A, same suit):
Damage: 10d10 (average 55)
Rarity: Extremely rare without Thread manipulation

STRAIGHT FLUSH (5 cards in sequence, same suit):
Damage: 8d8 (average 36)
Example: 5♠-6♠-7♠-8♠-9♠

FOUR OF A KIND (4 cards same rank):
Damage: 7d8 (average 31.5)
Example: 7♠-7♥-7♦-7♣-K♠

FULL HOUSE (3 of a kind + pair):
Damage: 6d6 (average 21)
Example: 8♠-8♥-8♦-K♠-K♥

FLUSH (5 cards same suit):
Damage: 5d6 (average 17.5)
Example: 2♠-5♠-9♠-J♠-K♠

STRAIGHT (5 cards in sequence):
Damage: 4d6 (average 14)
Example: 5♠-6♥-7♦-8♣-9♠

THREE OF A KIND (3 cards same rank):
Damage: 3d6 (average 10.5)
Example: 9♠-9♥-9♦-K♠-2♣

TWO PAIR (2 pairs):
Damage: 2d8 (average 9)
Example: 7♠-7♥-K♦-K♣-3♠

PAIR (2 cards same rank):
Damage: 2d6 (average 7)
Example: J♠-J♥-K♦-5♣-2♠

HIGH CARD (no combinations):
Damage: 1d4 (average 2.5)
Generate: +1 Thread (weak outcome)
\`\`\`

**Blackjack Values (for Draw of the Damned)**:
\`\`\`
CARD VALUES:
• Ace: 1 or 11 (your choice)
• 2-10: Face value
• Jack, Queen, King: 10

OUTCOMES:
21 (Blackjack): 6d6 damage
20: 5d6 damage
19: 4d6 damage
18: 4d6 damage
17: 3d6 damage
16 or less: 2d6 damage
BUST (over 21): Take 3d6 damage, +2 Threads
\`\`\`

**Alternative Tracking Methods**:

**Method 1: Digital Deck + Physical Threads**
- Use a card shuffler app on phone/tablet
- Track Threads with physical tokens
- Faster shuffling, less table space
- Loses some tactile immersion

**Method 2: Dice Instead of Cards**
- Use dice to simulate card draws (d13 for rank, d4 for suit)
- Track Threads with tokens
- No deck needed, but less thematic
- Harder to visualize poker hands

**Method 3: Card Tiles**
- Use card tiles or tokens instead of full deck
- Easier to organize and see hands
- More durable than paper cards
- More expensive to acquire

**Method 4: Minimalist Paper Tracking**
- Write drawn cards on paper
- Track Threads with tally marks
- No materials needed
- Loses all tactile card-playing experience

**Thread Reference Card**:
\`\`\`
THREADS OF DESTINY REFERENCE

GENERATION:
• Spell fails/no effect: +1 Thread
• Negative outcome (minor): +1 Thread
• Negative outcome (major): +2 Threads
• Blackjack bust: +2 Threads
• Poker high card: +1 Thread

SPENDING:
• Call Specific Card: 2 Threads (once/turn)
• Look at Top 3 Cards: 1 Thread (when drawing)

MAXIMUM: 13 Threads (Ace through King)

STRATEGY:
0-3 Threads: Build reserves, accept failures
4-6 Threads: Spend on critical spells only
7-9 Threads: Spend freely on important moments
10-12 Threads: Aggressive manipulation
13 Threads: At cap, must spend or waste
\`\`\`

**Example In-Person Turn**:

*You have 6 Threads, fighting a dragon*

**Turn 1 - Build Toward Royal Flush**:
1. "I cast Hand of Fate!"
2. Current hand: [2♠][5♥][9♦][J♣][K♠]
3. "I spend 2 Threads to call 10 of Spades!"
4. Remove 2 tokens → **4 Threads**
5. Search deck, add 10♠ to hand
6. Discard 2♠ to make room
7. New hand: [5♥][9♦][J♣][K♠][10♠]

**Turn 2 - Continue Building**:
1. "I spend 2 Threads to call Queen of Spades!"
2. Remove 2 tokens → **2 Threads**
3. Add Q♠ to hand, discard 5♥
4. New hand: [9♦][J♣][K♠][10♠][Q♠]
5. Not enough Threads to call more cards yet

**Turn 3 - Accept Failure to Build Threads**:
1. Cast a different spell that fails
2. **Generate 1 Thread** → **3 Threads**
3. Still need more Threads

**Turn 4 - Final Assembly**:
1. "I spend 2 Threads to call Jack of Spades!"
2. Remove 2 tokens → **1 Thread**
3. Add J♠ to hand, discard 9♦
4. New hand: [J♣][K♠][10♠][Q♠][J♠]
5. Wait, I have J♣ and J♠, but I need all spades for Royal Flush
6. Need to call Ace of Spades and discard J♣
7. Not enough Threads! Need to build more

**Turn 5 - More Thread Building**:
1. Accept another failure
2. **Generate 1 Thread** → **2 Threads**

**Turn 6 - ROYAL FLUSH!**:
1. "I spend 2 Threads to call Ace of Spades!"
2. Remove 2 tokens → **0 Threads**
3. Add A♠ to hand, discard J♣
4. Final hand: [K♠][10♠][Q♠][J♠][A♠]
5. "I cast Hand of Fate with ROYAL FLUSH!"
6. Deal 10d10 damage → [8,9,10,7,6,8,9,10,7,8] = 82 damage to dragon!
7. Discard all 5 cards

**Quick Reference Card Template**:
\`\`\`
FATE WEAVER QUICK REFERENCE

CARD-BASED SPELLS:
• Hand of Fate: Poker hands (pair to royal flush)
• Draw of the Damned: Blackjack (17-21 or bust)
• Card Cascade: Play multiple cards in sequence
• Perfect Hand: Draw until you get specific hand

THREAD MECHANICS:
• Generate from failures and negative outcomes
• Spend to call specific cards (2 Threads)
• Spend to look at top 3 cards (1 Thread)
• Maximum 13 Threads (don't waste generation!)

POKER HANDS:
Royal Flush > Straight Flush > Four of a Kind >
Full House > Flush > Straight > Three of a Kind >
Two Pair > Pair > High Card

BLACKJACK:
21 = 6d6 | 20 = 5d6 | 19 = 4d6 | 18 = 4d6
17 = 3d6 | 16- = 2d6 | BUST = -3d6 + 2 Threads
\`\`\`

**Thematic Enhancements**:

Many players enhance the Fate Weaver experience with:
- **Tarot Deck**: Use tarot cards instead of playing cards for mystical theme
- **Golden Threads**: Use gold thread or string as Thread tokens
- **Card Sleeves**: Protect cards with themed sleeves (stars, fate symbols)
- **Dealer Visor**: Wear a card dealer visor for immersion
- **Card Shuffler**: Automatic shuffler for faster gameplay
- **Fate Dice**: Special dice for rolling damage based on poker hands

**Thread Management Tips**:

**Building Strategy**:
- **Accept Early Failures**: First 2-3 turns, accept some failures to build Threads
- **Know Your Limits**: Don't push for risky plays unless you have Thread backup
- **Track Deck**: Remember which cards have been played to predict draws
- **Emergency Reserve**: Keep 4-6 Threads for critical moments

**Spending Strategy**:
- **Royal Flush Assembly**: Save 10+ Threads to call all 5 cards for Royal Flush
- **Blackjack 21**: Spend 2 Threads to call the exact card you need for 21
- **Combo Setup**: Use Threads to assemble specific card combinations
- **Don't Waste**: At 13 Threads, spend liberally to avoid wasting generation

**Card Game Strategy**:
- **Poker**: Aim for straights and flushes (easier than four of a kind)
- **Blackjack**: Stand at 18-20 for safety, hit at 11-16 for higher damage
- **Deck Tracking**: Count cards to know what's left in the deck
- **Suit Awareness**: Track which suits have been played for flush potential

**Why This System Works**: The Fate Weaver is the ONLY class that uses actual playing cards, creating a unique, tactile experience. The physical act of shuffling, drawing, and playing cards makes you feel like you're actually manipulating fate. The Thread tokens represent your ability to "cheat" the deck by calling specific cards, transforming randomness into strategy. The tension of deciding whether to accept a bad hand (and gain Threads) or spend Threads to guarantee a good hand creates meaningful decisions every turn. The dramatic moment of assembling a Royal Flush by calling all 5 cards is incredibly satisfying and memorable.

**Pro Tips**:
- **Shuffle Thoroughly**: Shuffle deck well between combats to ensure randomness
- **Track Discards**: Keep discard pile organized to know when to reshuffle
- **Poker Knowledge**: Learn poker hand rankings to maximize Hand of Fate
- **Blackjack Math**: Know when to hit/stand based on current total
- **Thread Banking**: Build to 10+ Threads before attempting Royal Flush
- **Specialization Synergy**: Fortune Teller = ally support, Card Master = combo focus, Thread Weaver = failure conversion

**Budget-Friendly Alternatives**:
- **No playing cards?** Use dice to simulate draws (d13 for rank, d4 for suit)
- **No Thread tokens?** Use coins, buttons, or tally marks
- **No card holder?** Just hold cards in hand or lay them on table
- **Minimalist**: Track card draws on paper, use tally marks for Threads

**Specialization-Specific Tracking**:

**Fortune Teller**:
- Can share cards with allies (give them cards from your hand)
- Track which allies have your cards
- Bond with ally: They use your Thread pool
- Mark bonded ally on character sheet

**Card Master**:
- Hold up to 7 cards (instead of 5)
- When calling cards, call 2 cards for 2 Threads (not 1)
- Free discard/draw once per turn
- Use larger hand holder or spread cards on table

**Thread Weaver**:
- Generate +1 Thread from all sources (failures give 2, not 1)
- Can spend Threads to force failures (intentional bad outcomes)
- Track bonus Thread generation separately
- More aggressive Thread spending

**Why Fate Weaver Is Perfect for In-Person Play**: The class is literally built around playing card games at the table. You shuffle a real deck, draw real cards, make real poker hands and blackjack totals. The Thread tokens let you "cheat" by calling specific cards, creating a satisfying blend of luck and skill. The physical act of assembling a Royal Flush by searching the deck for each card, one by one, is incredibly immersive. Every card draw is exciting, every Thread spent is strategic, and every poker hand or blackjack total creates tension. It's a class that transforms your TTRPG into a casino, making it perfect for players who love card games and tactical resource management.`
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

  // Spells - organized by level, properly formatted for wizard
  spells: [
    {
      id: 'hand-of-fate',
      name: 'Hand of Fate',
      icon: 'inv_misc_tarot_01',
      spellType: 'ACTION',
      // Use rollable table as the primary effect renderer; omit generic sections
      effectTypes: [],
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
        resourceTypes: ['mana', 'threads_spend'],
        resourceValues: { mana: 5, threads_spend: 2 },
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
        resolutionConfig: { cardType: 'poker', cardCount: 5, redraws: 2 },
        entries: [
          { range: 'Royal Flush', name: 'Royal Flush', description: 'A♠ K♠ Q♠ J♠ 10♠ - Ultimate hand', effectType: 'damage', effectConfig: { damageFormula: '10d10', damageType: 'radiant' } },
          { range: 'Straight Flush', name: 'Straight Flush', description: 'Five sequential cards of same suit', effectType: 'damage', effectConfig: { damageFormula: '8d10', damageType: 'arcane' } },
          { range: 'Four of a Kind', name: 'Four of a Kind', description: 'Four cards of same rank', effectType: 'damage', effectConfig: { damageFormula: '6d10', damageType: 'force' } },
          { range: 'Full House', name: 'Full House', description: 'Three of a kind + pair', effectType: 'damage', effectConfig: { damageFormula: '4d10', damageType: 'radiant' } },
          { range: 'Flush', name: 'Flush', description: 'Five cards of same suit', effectType: 'damage', effectConfig: { damageFormula: '4d8', damageType: 'radiant' } },
          { range: 'Straight', name: 'Straight', description: 'Five sequential cards', effectType: 'damage', effectConfig: { damageFormula: '3d8', damageType: 'force' } },
          { range: 'Three of a Kind', name: 'Three of a Kind', description: 'Three cards of same rank', effectType: 'damage', effectConfig: { damageFormula: '2d8', damageType: 'force' } },
          { range: 'Two Pair', name: 'Two Pair', description: 'Two different pairs', effectType: 'healing', effectConfig: { healingFormula: '2d8' } },
          { range: 'One Pair', name: 'One Pair', description: 'Two cards of same rank', effectType: 'healing', effectConfig: { healingFormula: '1d8' } },
          { range: 'High Card', name: 'High Card', description: 'No matching cards - weakest hand (gain +1 Thread)', effectType: 'buff', effectConfig: { buffType: 'thread_generation', buffDuration: 0 } }
        ]
      },

      tags: ['cards', 'poker', 'variable-damage', 'fate-weaver', 'thread-generation']
    },

    {
      id: 'draw-of-the-damned',
      name: 'Draw of the Damned',
      icon: 'spell_shadow_demonicempathy',
      spellType: 'ACTION',
      effectTypes: ['buff'],
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
      effectTypes: ['damage', 'buff'],
      school: 'Evocation',
      level: 2,

      description: 'Draw cards one at a time, playing a dangerous game with fate itself. Hearts bring pain, face cards bring greater suffering, but other cards offer power and advantage. The longer you draw, the greater the risk and reward. You may stop drawing at any time, but the temptation to continue is strong.',

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
      effectTypes: ['damage', 'healing'],
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
      effectTypes: ['healing', 'utility'],
      school: 'Abjuration',
      level: 4,

      description: 'Draw cards and attempt to match them in sequences or sets. The patterns you create determine the power you gain. Sequences unlock free spellcasting, while sets restore your vitality. Failure to create patterns generates Threads of Destiny, weaving your fate into the cosmic tapestry.',

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
      effectTypes: ['buff'],
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
      effectTypes: ['utility'],
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
      effectTypes: ['buff', 'utility'],
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
      buffConfig: {
        type: 'proficiency',
        target: 'self',
        durationType: 'timed',
        durationValue: 1,
        durationUnit: 'hour',
        grant: {
          category: 'skill_or_tool',
          level: 'proficiency',
          selection: 'any'
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
    },

    // ========================================
    // LEVEL 5 SPELLS
    // ========================================
    {
      id: 'fate_weaver_stacked_deck',
      name: 'Stacked Deck',
      description: 'Manipulate probability to ensure your next three attacks or spells automatically hit.',
      level: 5,
      spellType: 'ACTION',
      icon: 'inv_misc_ticket_tarot_madness',

      typeConfig: {
        school: 'divination',
        icon: 'inv_misc_ticket_tarot_madness',
        castTime: 1,
        castTimeType: 'BONUS'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 20 },
        actionPoints: 0,
        components: ['somatic'],
        somaticText: 'Shuffle cards elegantly'
      },

      resolution: 'NONE',
      effectTypes: ['buff'],

      buffConfig: {
        buffType: 'advantage',
        effects: [{
          id: 'stacked_deck',
          name: 'Stacked Deck',
          description: 'Your next 3 attacks or spells automatically hit (critical on natural 20)'
        }],
        durationValue: 3,
        durationType: 'uses',
        durationUnit: 'attacks'
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 4
      },

      tags: ['buff', 'accuracy', 'poker', 'level-5', 'fate-weaver']
    },

    {
      id: 'fate_weaver_royal_flush',
      name: 'Royal Flush',
      description: 'Draw five magical cards. If they form a poker hand, gain scaling effects based on the hand.',
      level: 5,
      spellType: 'ACTION',
      icon: 'inv_misc_ticket_tarot_vengeance',

      typeConfig: {
        school: 'evocation',
        icon: 'inv_misc_ticket_tarot_vengeance',
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 60,
        aoeShape: 'circle',
        aoeParameters: { radius: 20 },
        targetRestrictions: ['enemy']
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 25 },
        actionPoints: 2,
        components: ['somatic'],
        somaticText: 'Draw five cards dramatically'
      },

      resolution: 'DICE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '4d8 + charisma',
        elementType: 'force',
        damageType: 'direct'
      },

      rollableTable: {
        diceFormula: '5d13',
        entries: [
          { roll: 'pair', name: 'Pair', effect: { multiplier: 1.5 } },
          { roll: 'two_pair', name: 'Two Pair', effect: { multiplier: 2 } },
          { roll: 'three_kind', name: 'Three of a Kind', effect: { multiplier: 2.5 } },
          { roll: 'straight', name: 'Straight', effect: { multiplier: 3 } },
          { roll: 'flush', name: 'Flush', effect: { multiplier: 3.5 } },
          { roll: 'full_house', name: 'Full House', effect: { multiplier: 4 } },
          { roll: 'four_kind', name: 'Four of a Kind', effect: { multiplier: 5 } },
          { roll: 'royal_flush', name: 'Royal Flush', effect: { multiplier: 10 } }
        ]
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 4
      },

      tags: ['damage', 'aoe', 'poker', 'pattern-matching', 'level-5', 'fate-weaver']
    },

    {
      id: 'fate_weaver_twist_fate',
      name: 'Twist Fate',
      description: 'Rewrite destiny itself. Force a creature to reroll any roll and take the result you choose.',
      level: 5,
      spellType: 'REACTION',
      icon: 'spell_holy_reverseentropy',

      typeConfig: {
        school: 'divination',
        icon: 'spell_holy_reverseentropy',
        castTime: 1,
        castTimeType: 'REACTION'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 60,
        targetRestrictions: ['any']
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 18 },
        actionPoints: 0,
        components: ['verbal'],
        verbalText: 'Muta Fatum!'
      },

      resolution: 'NONE',
      effectTypes: ['control'],

      specialMechanics: {
        reroll: {
          description: 'Target must reroll and you choose which result is used',
          trigger: 'on_any_roll'
        }
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 3
      },

      tags: ['control', 'utility', 'reroll', 'level-5', 'fate-weaver']
    },

    // ========================================
    // LEVEL 6 SPELLS
    // ========================================
    {
      id: 'fate_weaver_dealers_choice',
      name: "Dealer's Choice",
      description: 'Deal magical cards to all creatures in range. You choose who gets beneficial or harmful effects.',
      level: 6,
      spellType: 'ACTION',
      icon: 'inv_misc_ticket_tarot_ascension',

      typeConfig: {
        school: 'enchantment',
        icon: 'inv_misc_ticket_tarot_ascension',
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'circle',
        aoeParameters: { radius: 30 },
        targetRestrictions: ['any']
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 28 },
        actionPoints: 2,
        components: ['somatic'],
        somaticText: 'Deal cards to all'
      },

      resolution: 'DICE',
      effectTypes: ['buff', 'debuff'],

      buffConfig: {
        buffType: 'variable',
        effects: [{
          id: 'good_card',
          name: 'Fortune Card',
          description: 'Chosen allies gain +3 to all rolls for 3 rounds'
        }],
        durationValue: 3,
        durationType: 'rounds',
        durationUnit: 'rounds'
      },

      debuffConfig: {
        debuffType: 'variable',
        effects: [{
          id: 'bad_card',
          name: 'Misfortune Card',
          description: 'Chosen enemies have -3 to all rolls for 3 rounds'
        }],
        durationValue: 3,
        durationType: 'rounds',
        durationUnit: 'rounds',
        saveDC: 16,
        saveType: 'charisma',
        saveOutcome: 'negates'
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 4
      },

      tags: ['buff', 'debuff', 'aoe', 'control', 'level-6', 'fate-weaver']
    },

    {
      id: 'fate_weaver_blackjack',
      name: 'Blackjack',
      description: 'Draw cards trying to get as close to 21 as possible. Higher hands deal more damage, but bust deals damage to you.',
      level: 6,
      spellType: 'ACTION',
      icon: 'inv_misc_ticket_tarot_blessings',

      typeConfig: {
        school: 'evocation',
        icon: 'inv_misc_ticket_tarot_blessings',
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 60,
        targetRestrictions: ['enemy']
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 22 },
        actionPoints: 1,
        components: ['somatic'],
        somaticText: 'Draw cards one by one'
      },

      resolution: 'DICE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: 'card_total * 1d6',
        elementType: 'force',
        damageType: 'direct'
      },

      specialMechanics: {
        blackjack: {
          description: 'Draw cards (2-11 value). Try to get close to 21. Over 21 = bust (damage yourself instead)',
          twentyOne: 'Deal maximum damage and stun target',
          bust: 'Take the damage yourself instead'
        }
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 3
      },

      tags: ['damage', 'blackjack', 'risk-reward', 'level-6', 'fate-weaver']
    },

    {
      id: 'fate_weaver_fold_reality',
      name: 'Fold Reality',
      description: 'Fold the fabric of reality like a deck of cards, teleporting yourself and allies to a seen location.',
      level: 6,
      spellType: 'ACTION',
      icon: 'spell_arcane_portals',

      typeConfig: {
        school: 'conjuration',
        icon: 'spell_arcane_portals',
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'circle',
        aoeParameters: { radius: 10 },
        targetRestrictions: ['ally']
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 30 },
        actionPoints: 2,
        components: ['somatic'],
        somaticText: 'Fold space like cards'
      },

      resolution: 'NONE',
      effectTypes: ['utility'],

      utilityConfig: {
        utilityType: 'Teleport',
        selectedEffects: [{
          id: 'teleport',
          name: 'Teleport',
          description: 'Teleport yourself and up to 5 willing allies up to 120 feet',
          distance: 120,
          needsLineOfSight: true,
          takesOthers: true,
          maxOthers: 5
        }],
        duration: 0,
        durationUnit: 'instant',
        concentration: false,
        power: 'major'
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 5
      },

      tags: ['utility', 'teleport', 'party', 'level-6', 'fate-weaver']
    },

    // ========================================
    // LEVEL 7 SPELLS
    // ========================================
    {
      id: 'fate_weaver_house_rules',
      name: 'House Rules',
      description: 'Impose your own rules on reality. For the next minute, dice work differently in your favor.',
      level: 7,
      spellType: 'ACTION',
      icon: 'spell_holy_powerinfusion',

      typeConfig: {
        school: 'enchantment',
        icon: 'spell_holy_powerinfusion',
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'circle',
        aoeParameters: { radius: 60 }
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 40 },
        actionPoints: 2,
        components: ['verbal'],
        verbalText: 'Regula Meae!'
      },

      resolution: 'NONE',
      effectTypes: ['buff', 'debuff'],

      specialMechanics: {
        houseRules: {
          description: 'Choose one: Allies treat all 1s as 2s, OR enemies treat all 6s as 1s, OR you can reroll any die once per round',
          duration: '1 minute'
        }
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 6
      },

      tags: ['buff', 'debuff', 'aoe', 'dice-manipulation', 'level-7', 'fate-weaver']
    },

    {
      id: 'fate_weaver_all_in',
      name: 'All In',
      description: 'Go all in on a massive attack. Bet your own life force for devastating damage.',
      level: 7,
      spellType: 'ACTION',
      icon: 'spell_fire_burnout',

      typeConfig: {
        school: 'evocation',
        icon: 'spell_fire_burnout',
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 60,
        targetRestrictions: ['enemy']
      },

      resourceCost: {
        resourceTypes: ['mana', 'hp'],
        resourceValues: { mana: 35, hp: 'variable' },
        actionPoints: 2,
        components: ['verbal'],
        verbalText: 'ALL IN!'
      },

      resolution: 'DICE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: 'hp_bet * 2d6',
        elementType: 'force',
        damageType: 'direct'
      },

      specialMechanics: {
        allIn: {
          description: 'Bet up to half your current HP. Deal damage equal to HP bet × 2d6.',
          risk: 'If the attack misses, you still lose the HP'
        }
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 4
      },

      tags: ['damage', 'high-risk', 'betting', 'level-7', 'fate-weaver']
    },

    {
      id: 'fate_weaver_destiny_rewritten',
      name: 'Destiny Rewritten',
      description: 'Rewrite a recent event as if it never happened. Reverse one action taken in the last round.',
      level: 7,
      spellType: 'REACTION',
      icon: 'spell_holy_reverseentropy',

      typeConfig: {
        school: 'transmutation',
        icon: 'spell_holy_reverseentropy',
        castTime: 1,
        castTimeType: 'REACTION'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 45 },
        actionPoints: 0,
        components: ['verbal'],
        verbalText: 'Rescribe!'
      },

      resolution: 'NONE',
      effectTypes: ['utility'],

      specialMechanics: {
        rewrite: {
          description: 'Undo one action taken in the last round. All effects are reversed.',
          limit: 'Cannot undo death of a creature'
        }
      },

      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },

      tags: ['utility', 'time', 'undo', 'level-7', 'fate-weaver']
    },

    // ========================================
    // LEVEL 8 SPELLS
    // ========================================
    {
      id: 'fate_weaver_wild_card',
      name: 'Wild Card',
      description: 'Draw the ultimate wild card. Roll on a table of powerful random effects.',
      level: 8,
      spellType: 'ACTION',
      icon: 'inv_misc_ticket_tarot_stack',

      typeConfig: {
        school: 'evocation',
        icon: 'inv_misc_ticket_tarot_stack',
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'variable',
        rangeType: 'ranged',
        rangeDistance: 120
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 50 },
        actionPoints: 2,
        components: ['somatic'],
        somaticText: 'Draw the wild card'
      },

      resolution: 'DICE',
      effectTypes: ['variable'],

      rollableTable: {
        diceFormula: '1d10',
        entries: [
          { roll: 1, name: 'Joker', effect: { type: 'random_target', description: 'Cast a random level 5 spell on a random target' } },
          { roll: 2, name: 'The Tower', effect: { type: 'damage', formula: '10d10 force', target: 'enemies' } },
          { roll: 3, name: 'The Star', effect: { type: 'healing', formula: 'full heal', target: 'allies' } },
          { roll: 4, name: 'The Moon', effect: { type: 'transform', description: 'All enemies become sheep for 1 round' } },
          { roll: 5, name: 'The Sun', effect: { type: 'buff', description: 'All allies gain +5 to all stats for 1 minute' } },
          { roll: 6, name: 'Death', effect: { type: 'damage', description: 'Target must save or drop to 1 HP' } },
          { roll: 7, name: 'The Wheel', effect: { type: 'swap', description: 'Swap HP with target enemy' } },
          { roll: 8, name: 'Justice', effect: { type: 'reflect', description: 'All damage to allies is reflected for 1 minute' } },
          { roll: 9, name: 'The Magician', effect: { type: 'resource', description: 'Restore all mana and cooldowns' } },
          { roll: 10, name: 'Ace of Destiny', effect: { type: 'choose', description: 'Choose any effect from this table' } }
        ]
      },

      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },

      tags: ['variable', 'random', 'powerful', 'level-8', 'fate-weaver']
    },

    {
      id: 'fate_weaver_fate_sealed',
      name: 'Fate Sealed',
      description: 'Seal an enemy\'s fate. They cannot avoid the next attack or effect that targets them.',
      level: 8,
      spellType: 'ACTION',
      icon: 'spell_shadow_mindtwisting',

      typeConfig: {
        school: 'enchantment',
        icon: 'spell_shadow_mindtwisting',
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 90,
        targetRestrictions: ['enemy']
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 45 },
        actionPoints: 2,
        components: ['verbal'],
        verbalText: 'Fatum Signatum!'
      },

      resolution: 'NONE',
      effectTypes: ['debuff'],

      debuffConfig: {
        debuffType: 'seal',
        effects: [{
          id: 'fate_sealed',
          name: 'Fate Sealed',
          description: 'The next attack against this target automatically hits and cannot be avoided, blocked, or reduced'
        }],
        durationValue: 3,
        durationType: 'rounds',
        durationUnit: 'rounds',
        saveDC: 18,
        saveType: 'charisma',
        saveOutcome: 'halves_duration'
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 5
      },

      tags: ['debuff', 'guaranteed-hit', 'level-8', 'fate-weaver']
    },

    {
      id: 'fate_weaver_double_down',
      name: 'Double Down',
      description: 'Double the effect of your next spell. Also doubles any negative consequences.',
      level: 8,
      spellType: 'ACTION',
      icon: 'spell_holy_surgeoflight',

      typeConfig: {
        school: 'enchantment',
        icon: 'spell_holy_surgeoflight',
        castTime: 1,
        castTimeType: 'BONUS'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 40 },
        actionPoints: 0,
        components: ['verbal'],
        verbalText: 'Double down!'
      },

      resolution: 'NONE',
      effectTypes: ['buff'],

      buffConfig: {
        buffType: 'amplify',
        effects: [{
          id: 'double_down',
          name: 'Double Down',
          description: 'Your next spell deals double damage/healing but also doubles any self-damage or negative effects'
        }],
        durationValue: 1,
        durationType: 'spell',
        durationUnit: 'spell'
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 4
      },

      tags: ['buff', 'amplify', 'risk-reward', 'level-8', 'fate-weaver']
    },

    // ========================================
    // LEVEL 9 SPELLS
    // ========================================
    {
      id: 'fate_weaver_grand_gambit',
      name: 'Grand Gambit',
      description: 'The ultimate gamble. Flip a coin for each enemy in range. Heads eliminates them, tails fully heals them.',
      level: 9,
      spellType: 'ACTION',
      icon: 'inv_misc_coin_18',

      typeConfig: {
        school: 'evocation',
        icon: 'inv_misc_coin_18',
        castTime: 2,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'circle',
        aoeParameters: { radius: 40 },
        targetRestrictions: ['enemy']
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 70 },
        actionPoints: 3,
        components: ['verbal', 'somatic'],
        verbalText: 'GAMBIT MAGNUS!',
        somaticText: 'Flip a golden coin'
      },

      resolution: 'COIN_FLIP',
      effectTypes: ['damage', 'healing'],

      specialMechanics: {
        grandGambit: {
          heads: 'Enemy is reduced to 0 HP (no save)',
          tails: 'Enemy is fully healed and gains +2 AC for 1 minute',
          perTarget: true
        }
      },

      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },

      tags: ['damage', 'high-risk', 'coin-flip', 'ultimate', 'level-9', 'fate-weaver']
    },

    {
      id: 'fate_weaver_master_of_destiny',
      name: 'Master of Destiny',
      description: 'Become the master of fate itself. For 1 minute, you can set any die result to the number of your choice.',
      level: 9,
      spellType: 'ACTION',
      icon: 'spell_holy_divineillumination',

      typeConfig: {
        school: 'divination',
        icon: 'spell_holy_divineillumination',
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 80 },
        actionPoints: 2,
        components: ['verbal'],
        verbalText: 'Ego Sum Dominus Fati!'
      },

      resolution: 'NONE',
      effectTypes: ['buff'],

      buffConfig: {
        buffType: 'fate_control',
        effects: [{
          id: 'master_of_destiny',
          name: 'Master of Destiny',
          description: 'Choose the result of any die roll (yours or enemy\'s) up to 10 times'
        }],
        durationValue: 1,
        durationType: 'minutes',
        durationUnit: 'minutes'
      },

      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },

      tags: ['buff', 'dice-control', 'ultimate', 'level-9', 'fate-weaver']
    },

    {
      id: 'fate_weaver_jackpot_supreme',
      name: 'Jackpot Supreme',
      description: 'Hit the ultimate jackpot. Deal massive damage that multiplies based on matching dice.',
      level: 9,
      spellType: 'ACTION',
      icon: 'spell_holy_surgeoflight',

      typeConfig: {
        school: 'evocation',
        icon: 'spell_holy_surgeoflight',
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 90,
        aoeShape: 'circle',
        aoeParameters: { radius: 30 },
        targetRestrictions: ['enemy']
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 75 },
        actionPoints: 3,
        components: ['verbal', 'somatic'],
        verbalText: 'JACKPOT!',
        somaticText: 'Roll three dice'
      },

      resolution: 'DICE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '10d10 + charisma * 3',
        elementType: 'radiant',
        damageType: 'direct',
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'agility',
          difficultyClass: 20,
          saveOutcome: 'halves'
        }
      },

      specialMechanics: {
        jackpot: {
          diceFormula: '3d6',
          noMatch: { multiplier: 1 },
          twoMatch: { multiplier: 3 },
          threeMatch: { multiplier: 7, description: 'JACKPOT! Also stun all targets for 1 round' }
        }
      },

      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },

      tags: ['damage', 'aoe', 'jackpot', 'ultimate', 'level-9', 'fate-weaver']
    },

    // ========================================
    // LEVEL 10 SPELLS
    // ========================================
    {
      id: 'fate_weaver_rewrite_destiny',
      name: 'Rewrite Destiny',
      description: 'Completely rewrite the destiny of one creature. Choose their fate: victory, defeat, or transformation.',
      level: 10,
      spellType: 'ACTION',
      icon: 'spell_holy_borrowedtime',

      typeConfig: {
        school: 'transmutation',
        icon: 'spell_holy_borrowedtime',
        castTime: 3,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 120,
        targetRestrictions: ['any']
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 100 },
        actionPoints: 3,
        components: ['verbal', 'somatic'],
        verbalText: 'RESCRIBERE FATUM!',
        somaticText: 'Rewrite reality with cards'
      },

      resolution: 'NONE',
      effectTypes: ['utility'],

      specialMechanics: {
        rewriteDestiny: {
          choices: [
            { name: 'Victory', effect: 'Target ally gains immunity to damage and auto-success on all rolls for 1 minute' },
            { name: 'Defeat', effect: 'Target enemy is reduced to 1 HP and stunned for 1 minute (no save)' },
            { name: 'Transformation', effect: 'Target is permanently polymorphed into a harmless creature (save ends after 1 hour)' }
          ]
        }
      },

      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },

      tags: ['utility', 'ultimate', 'fate-control', 'level-10', 'fate-weaver']
    },

    {
      id: 'fate_weaver_deck_of_many_things',
      name: 'Deck of Many Things',
      description: 'Summon the legendary Deck of Many Things. Draw cards for incredibly powerful but unpredictable effects.',
      level: 10,
      spellType: 'ACTION',
      icon: 'inv_misc_ticket_tarot_stack',

      typeConfig: {
        school: 'conjuration',
        icon: 'inv_misc_ticket_tarot_stack',
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 90 },
        actionPoints: 2,
        components: ['somatic'],
        somaticText: 'Summon the legendary deck'
      },

      resolution: 'DICE',
      effectTypes: ['variable'],

      rollableTable: {
        diceFormula: '1d22',
        description: 'Draw 1-3 cards. Each has a major effect.',
        entries: [
          { roll: 1, name: 'Sun', effect: 'Gain 50,000 XP and a wondrous item' },
          { roll: 2, name: 'Moon', effect: 'Granted 1d3 wishes' },
          { roll: 3, name: 'Star', effect: 'Increase one ability score by 2' },
          { roll: 4, name: 'Throne', effect: 'Gain a keep and +6 Persuasion' },
          { roll: 5, name: 'Key', effect: 'Gain a rare magic weapon' },
          { roll: 6, name: 'Knight', effect: 'Gain a 4th-level fighter follower' },
          { roll: 7, name: 'Gem', effect: 'Gain 50,000gp in gems' },
          { roll: 8, name: 'Comet', effect: 'Defeat the next monster alone to gain a level' },
          { roll: 9, name: 'Fates', effect: 'Can undo one event as if it never happened' },
          { roll: 10, name: 'Balance', effect: 'Alignment changes to opposite' },
          { roll: 11, name: 'Jester', effect: 'Gain 10,000 XP or draw two more cards' },
          { roll: 12, name: 'Euryale', effect: '-2 to all saving throws permanently (curse)' },
          { roll: 13, name: 'Rogue', effect: 'An NPC ally becomes hostile' },
          { roll: 14, name: 'Idiot', effect: 'Intelligence reduced by 1d4+1 permanently' },
          { roll: 15, name: 'Donjon', effect: 'Imprisoned in an extradimensional space' },
          { roll: 16, name: 'Ruin', effect: 'All nonmagical possessions destroyed' },
          { roll: 17, name: 'Skull', effect: 'Summons an Avatar of Death to fight you' },
          { roll: 18, name: 'Flames', effect: 'A powerful devil becomes your enemy' },
          { roll: 19, name: 'Talons', effect: 'All magic items you own are destroyed' },
          { roll: 20, name: 'Void', effect: 'Soul imprisoned; body is incapacitated' },
          { roll: 21, name: 'The Fool', effect: 'Lose 10,000 XP; draw again' },
          { roll: 22, name: 'Vizier', effect: 'Know the answer to your next dilemma' }
        ]
      },

      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },

      tags: ['variable', 'random', 'legendary', 'ultimate', 'level-10', 'fate-weaver']
    },

    {
      id: 'fate_weaver_casino_royale',
      name: 'Casino Royale',
      description: 'Transform the battlefield into a grand casino. All attacks, spells, and abilities become gambles with chance-based outcomes.',
      level: 10,
      spellType: 'ACTION',
      icon: 'spell_holy_divineprovidence',

      typeConfig: {
        school: 'illusion',
        icon: 'spell_holy_divineprovidence',
        castTime: 2,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'circle',
        aoeParameters: { radius: 100 }
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 100 },
        actionPoints: 3,
        components: ['verbal', 'somatic'],
        verbalText: 'WELCOME TO MY CASINO!',
        somaticText: 'Grand sweeping gesture'
      },

      resolution: 'NONE',
      effectTypes: ['zone', 'control'],

      zoneConfig: {
        duration: 1,
        durationUnit: 'minutes',
        effects: ['gambling_rules'],
        movable: false,
        size: { radius: 100 }
      },

      specialMechanics: {
        casinoRoyale: {
          description: 'All attack rolls, saving throws, and ability checks work differently:',
          rules: [
            'All dice explode (max roll adds another die)',
            'Critical hits deal triple damage',
            'Natural 1s cause a random negative effect',
            'You gain advantage on all your rolls',
            'Enemies must gamble: before each action, flip a coin. Tails means they lose their action'
          ]
        }
      },

      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },

      tags: ['zone', 'control', 'gambling', 'ultimate', 'level-10', 'fate-weaver']
    },

    // ADDITIONAL LEVEL 1 SPELLS
    {
      id: 'fate_lucky_strike',
      name: 'Lucky Strike',
      description: 'Strike with enhanced luck, dealing 1d8 force damage and gaining advantage on next attack roll.',
      level: 1,
      spellType: 'ACTION',
      effectTypes: ['damage', 'buff'],

      typeConfig: {
        school: 'divination',
        icon: 'inv_misc_dice_01',
        tags: ['damage', 'buff', 'luck', 'universal'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 30,
        targetRestrictions: ['enemy'],
        maxTargets: 1
      },

      damageConfig: {
        formula: '1d8',
        elementType: 'force',
        damageType: 'direct'
      },

      buffConfig: {
        buffType: 'statEnhancement',
        effects: [{
          id: 'lucky_strike',
          name: 'Lucky',
          description: 'Advantage on next attack roll for 1 round',
          statModifier: {
            stat: 'attack_rolls',
            magnitude: 1,
            magnitudeType: 'advantage'
          }
        }],
        durationValue: 1,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: false,
        canBeDispelled: false
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: {
          mana: 10
        },
        actionPoints: 1,
        components: ['verbal', 'somatic']
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 0
      },

      resolution: 'DICE',
      tags: ['damage', 'buff', 'luck', 'universal']
    },

    {
      id: 'fate_twist_probability',
      name: 'Twist Probability',
      description: 'Twist the threads of fate to force an enemy to reroll their next roll and take the lower result.',
      level: 1,
      spellType: 'REACTION',
      effectTypes: ['debuff'],

      typeConfig: {
        school: 'divination',
        icon: 'spell_holy_divineprovidence',
        tags: ['debuff', 'fate', 'reroll', 'universal'],
        castTime: 1,
        castTimeType: 'REACTION'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 40,
        targetRestrictions: ['enemy'],
        maxTargets: 1
      },

      debuffConfig: {
        debuffType: 'statusEffect',
        effects: [{
          id: 'twisted_fate',
          name: 'Twisted Fate',
          description: 'Must reroll next roll and take lower result',
          statusType: 'disadvantage'
        }],
        durationValue: 1,
        durationType: 'rounds',
        durationUnit: 'rounds',
        saveDC: 12,
        saveType: 'spirit',
        saveOutcome: 'negates'
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: {
          mana: 10
        },
        actionPoints: 0,
        components: ['verbal']
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 2
      },

      resolution: 'DICE',
      tags: ['debuff', 'fate', 'reroll', 'universal']
    },

    // ADDITIONAL LEVEL 2 SPELL
    {
      id: 'fate_fortune_favor',
      name: "Fortune's Favor",
      description: 'Gain the favor of fortune, allowing you to roll twice on your next 3 rolls and take the higher result.',
      level: 2,
      spellType: 'ACTION',
      effectTypes: ['buff'],

      typeConfig: {
        school: 'divination',
        icon: 'inv_misc_coin_01',
        tags: ['buff', 'fortune', 'advantage', 'universal'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      buffConfig: {
        buffType: 'statEnhancement',
        effects: [{
          id: 'fortune_favor',
          name: "Fortune's Favor",
          description: 'Roll twice and take higher result for next 3 rolls',
          statModifier: {
            stat: 'all_rolls',
            magnitude: 1,
            magnitudeType: 'advantage'
          }
        }],
        durationValue: 3,
        durationType: 'rolls',
        durationUnit: 'rolls',
        concentrationRequired: false,
        canBeDispelled: false
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: {
          mana: 15
        },
        actionPoints: 1,
        components: ['verbal', 'somatic']
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 3
      },

      resolution: 'DICE',
      tags: ['buff', 'fortune', 'advantage', 'universal']
    }
  ]
};