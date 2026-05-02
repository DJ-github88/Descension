/**
 * Fate Weaver Class Data
 *
 * "The Fate Weaver doesn't predict the future — they DEAL it.
 *  Every failure is fuel; every thread is a weapon."
 *
 * Complete class information for the Fate Weaver - a card-based destiny manipulator
 * who uses Threads of Destiny to control the flow of fate.
 */

export const FATE_WEAVER_DATA = {
  id: 'fate-weaver',
  name: 'Fate Weaver',
  icon: 'fas fa-magic',
  role: 'Support/Control',
  damageTypes: ['psychic', 'force'],

  spellPools: {
    1: [
      'war-of-wills',
      'echoes-of-the-past',
      'hand-of-fate'
    ]
  },

  overview: {
    title: 'The Fate Weaver',
    subtitle: 'Master of Destiny and Cards',

    quickOverview: {
      title: 'Quick Overview',
      content: `**The Fate Weaver doesn't predict the future — they DEAL it.** Every failure is fuel; every thread is a weapon.

Draw cards from a 52-card mystical deck to cast spells. Poker hands deal damage, blackjack totals buff allies, war draws challenge enemies. When draws fail or backfire, you gain **Threads of Destiny** (0-13). Spend 2 Threads to call any card from the deck — once per turn. Build Threads through failure. Spend them for dominance. The worse your luck, the more dangerous you become.

**Core Loop**: Draw cards → Failures generate Threads → Spend Threads to call cards → Stack the deck → Turn bad luck into calculated strategy

**Resource**: Threads of Destiny (0-13, mirroring 13 cards per suit)

**Deck Rules**: 52-card deck, shuffled at combat start. Reshuffles discard pile when empty. You may call 1 specific card per turn for 2 Threads.

**Best For**: Players who love card game mechanics, tactical resource management, and the thrill of turning a terrible hand into a winning play.`
    },

    description: `Manipulates destiny through cosmic forces and cards. Uses Threads of Destiny to influence spell outcomes, predicting and controlling events in battle with strategic and mystical precision.`,

    roleplayIdentity: {
      title: 'Roleplay Identity',
      content: `Fate Weavers see the invisible threads connecting all events. Destiny is not fixed — it's a tapestry that can be rewoven by those bold enough to pull the threads.

**The Fate Weaver's Philosophy**: Destiny is not predetermined — it is a game of cards where skill, strategy, and a touch of luck determine the outcome. Every draw is an opportunity, every failure a lesson, and every thread a tool for reshaping reality.

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
- Turns failures into resources (Threads of Destiny)
- Versatile effects based on card combinations (poker, blackjack, war, solitaire)
- Strong control over randomness through Thread spending
- Excels at adapting to changing battle conditions

**Weaknesses**:
- Dependent on card draws for spell effects
- Requires understanding of basic card game mechanics
- Less consistent than classes with fixed spell effects
- Must manage both mana and Threads of Destiny
- Vulnerable when Thread reserves are low`,

      keyMechanics: [
        'Card-based spell resolution (poker, blackjack, war, solitaire)',
        'Thread generation from failures and negative outcomes',
        'Spend 2 Threads to call 1 specific card per turn',
        'Variable spell effects based on card combinations',
        'Risk/reward: accept failures for Threads vs. spend Threads for success'
      ]
    },

    playstyle: {
      title: 'Playstyle & Strategy',
      content: `Fate Weavers thrive in situations that require careful planning and foresight. Their card-based abilities provide a unique blend of chance and control, allowing them to adapt to changing circumstances and turn the tide of battle.

**Core Strategy**:
1. **Thread Management**: Balance accepting failures to generate Threads vs. spending Threads to guarantee success
2. **Card Knowledge**: Understanding poker hands, blackjack values, and other card game mechanics
3. **Timing**: Know when to spend Threads to call specific cards vs. accepting random draws
4. **Failure Conversion**: Embrace negative outcomes as opportunities to build Thread reserves
5. **Deck Manipulation**: Use Threads strategically to ensure favorable draws when it matters most

**Thread Economy**:
- Generate 1 Thread when spells fail or have minimal effect
- Generate 2 Threads when spells produce major negative outcomes
- Spend 2 Threads to call a specific card (once per turn)
- Maximum: 13 Threads (Ace through King)

**Deck Rules**:
- Shuffle your 52-card deck at the start of each combat
- Draw from deck when spells require cards
- When deck runs out, reshuffle discard pile
- Calling a card: search deck, add to hand, reshuffle remaining deck`,

      tips: [
        'Learn poker hand rankings to maximize Hand of Fate effectiveness',
        'In blackjack-style spells, aim for 18-20 for safety',
        'Save Threads for critical moments rather than spending immediately',
        'Negative outcomes aren\'t always bad — they generate valuable Threads',
        'Coordinate with allies for Echo of Fate card matching',
        'You can only call 1 card per turn — plan your Royal Flush assembly across multiple turns'
      ]
    },

    immersiveCombatExample: {
      title: 'Combat Example: The Gambler\'s Paradox',
      content: `**The Setup**: You're a Fate Weaver facing a powerful necromancer and two skeletal guards. Your party needs damage, but your spells are card-based — unpredictable. Starting Threads: 0. Starting Mana: 45/50.

**Starting State**: Threads: 0/13 | Mana: 45/50 | HP: 55/70 | Deck: Shuffled (52 cards)

**Turn 1 — The Empty Hand (Threads: 0 → 1)**

*The necromancer raises his staff. The skeletal guards advance. You draw from your mystical deck. Time to see what fate has in store.*

**Your Action**: Cast "Hand of Fate" on Necromancer (5 mana, draw 5 cards)
**Cards Drawn**: [3♠, 7♦, J♣, 2♥, 9♠]
**Poker Hand**: High Card (Jack) — weakest possible
**Damage**: 1d4 → [3] = 3 damage
**Thread Generation**: +1 Thread (minimal effect)

*The cards shimmer and fade. A weak bolt of energy strikes the necromancer. He barely flinches. But you feel it — a Thread of Destiny forming from the disappointment. The universe owes you one.*

**Threads**: 0 + 1 = **1 Thread**
**Mana**: 45 - 5 = 40/50

**Necromancer's Turn**: Casts "Bone Spear" → 18 damage
**Your HP**: 55 - 18 = 37/70

**Current State**: Threads: 1/13 | Mana: 40/50 | HP: 37/70

---

**Turn 2 — Building Threads (Threads: 1 → 3)**

*You're hurt. You need more Threads before you can call cards. Time to take a calculated risk.*

**Your Action**: Cast "Draw of the Damned" on Skeletal Guard #1 (4 mana, blackjack — damage mode)
**Card 1**: [K♥] = 10 → Total: 10
**Card 2**: [8♣] = 8 → Total: 18
**Decision**: Hit (risky — but you need damage OR Threads)
**Card 3**: [9♦] = 9 → Total: 27 → **BUST!**

*The cards explode in your face. Dark energy backlashes.*

**Result**: Bust → Take 3d6 self-damage → [4, 3, 5] = 12 damage to you. No damage to target.
**Thread Generation**: +2 Threads (major negative outcome)

**Your HP**: 37 - 12 = 25/70
**Threads**: 1 + 2 = **3 Threads**
**Mana**: 40 - 4 = 36/50

*Your party's tank groans. "Did you just... hurt yourself?" You smile through the pain. "I'm building resources. Trust me."*

**Current State**: Threads: 3/13 | Mana: 36/50 | HP: 25/70

---

**Turn 3 — More Fuel (Threads: 3 → 5)**

*Your healer patches you up. 15 HP restored. You're at 40/70 now. Still need more Threads. One more deliberate failure should do it.*

**Your Action**: Cast "Heart's Gamble" (3 mana, draw cards until non-heart)
**Card 1**: [4♥] → Heart! Continue
**Card 2**: [Q♥] → Face card heart! Continue
**Card 3**: [7♠] → Non-heart → STOP

**Result**: Drew 2 hearts (one face card) → Take 2d6 damage → [5, 6] = 11 self-damage
**Thread Generation**: +2 Threads (major negative — face card + self-damage)

*The cards burn your hands. You scream, but you're SMILING. Two more Threads.*

**Your HP**: 40 - 11 = 29/70
**Threads**: 3 + 2 = **5 Threads**
**Mana**: 36 - 3 = 33/50

**Your Party's Rogue**: "Are you TRYING to kill yourself?!"
**You**: "No. I'm trying to kill HIM." *You point at the necromancer.* "Two turns. Watch."

**Current State**: Threads: 5/13 | Mana: 33/50 | HP: 29/70

---

**Turn 4 — The First Call (Threads: 5 → 3)**

*Five Threads. You can call 2 cards over 2 turns. Time to start building a hand.*

**Your Action**: Cast "Hand of Fate" on Necromancer (5 mana, draw 5 cards)
**Random Draw**: [3♠, 8♥, J♣, K♠, 2♦]
**Thread Spend**: Call [A♠] — 2 Threads → Add to hand, discard 2♦
**Hand**: [3♠, 8♥, J♣, K♠, A♠]
**Poker Hand**: High Card (Ace) — still weak. But the Ace of Spades is now in your hand.
**Damage**: 1d4 → [2] = 2 damage
**Thread Generation**: +1 Thread (minimal effect)

**Threads**: 5 - 2 + 1 = **4 Threads**
**Mana**: 33 - 5 = 28/50

*You called the Ace of Spades from the deck. It materialized in golden light. The necromancer raises an eyebrow. The rest of the hand is garbage — but you didn't need the whole hand yet.*

---

**Turn 5 — The Second Call (Threads: 4 → 2)**

*Keep building. Call one more card.*

**Your Action**: Cast "Hand of Fate" again (5 mana, draw 5 new cards)
**Random Draw**: [6♣, 9♦, Q♠, 5♥, 10♠]
**Thread Spend**: Call [K♠] — 2 Threads → Add to hand, discard 5♥
**Hand**: [6♣, 9♦, Q♠, 10♠, K♠]
**Poker Hand**: High Card (King). Still weak.
**Damage**: 1d4 → [4] = 4 damage
**Thread Generation**: +1 Thread

**Threads**: 4 - 2 + 1 = **3 Threads**
**Mana**: 28 - 5 = 23/50

*Two Spades face cards and the Ace still in the deck from your earlier call. The pieces are coming together.*

---

**Turn 6 — Thread Banking (Threads: 3 → 5)**

*You need 4 more Threads to call the remaining Royal Flush cards. Accept another failure.*

**Your Action**: Cast "War of Wills" on Skeletal Guard #2 (2 mana, competitive draw)
**Your Card**: [3♣] vs **Their Card**: [K♦] → **You LOSE**
**Result**: Heal enemy for 2d8 → [5, 7] = 12 healing (enemy)
**Thread Generation**: +1 Thread (spell failed)

**Your Action**: Also cast "Marked Card" (1 mana, peek at top 3)
**Top 3**: [7♠, J♠, 4♥] — you choose [J♠] to draw next turn
**Thread Generation**: +1 Thread (minimal effect)

**Threads**: 3 + 1 + 1 = **5 Threads**
**Mana**: 23 - 2 - 1 = 20/50

---

**Turn 7 — The Third Call (Threads: 5 → 3)**

*Five Threads. Call the Jack of Spades that you marked.*

**Your Action**: Cast "Hand of Fate" (5 mana, draw 5 cards)
**Random Draw**: [2♣, 7♥, 9♠, 4♦, 6♠]
**Thread Spend**: Call [Q♠] — 2 Threads → Add to hand, discard 6♠
**Hand**: [2♣, 7♥, 9♠, 4♦, Q♠]
**Poker Hand**: High Card (Queen). Weak.
**Damage**: 1d4 → [1] = 1 damage
**Thread Generation**: +1 Thread

**Threads**: 5 - 2 + 1 = **4 Threads**
**Mana**: 20 - 5 = 15/50

---

**Turn 8 — The Final Thread Build (Threads: 4 → 6)**

*Almost there. Need 2 more Threads to call the last card.*

**Your Action**: Cast "Heart's Gamble" (3 mana, accept bad draws)
**Draw**: [K♥] → Face card heart! → Take 2d6 → [6, 5] = 11 damage
**Thread Generation**: +2 Threads

**Your HP**: 29 - 11 = 18/70
**Threads**: 4 + 2 = **6 Threads**
**Mana**: 15 - 3 = 12/50

*Your healer panics. "STOP HURTING YOURSELF!" You're at 18 HP. You laugh. "Next turn."*

---

**Turn 9 — THE PAYOFF (Threads: 6 → 0)**

*Six Threads. You've been building for 8 turns. The Ace, King, Queen, and Jack of Spades are scattered through the deck. You need to call the 10 of Spades and pray your random draw fills the fifth slot. Let's go.*

**Your Action**: Cast "Hand of Fate" on Necromancer (5 mana, draw 5 cards)
**Thread Spend**: Call [10♠] — 2 Threads
**Random Draw (4 cards)**: [3♦, 8♣, Q♥, A♠]

Wait — A♠! The Ace of Spades came up randomly! And you already have the 10♠ from calling it!

**Hand after call + draw**: [10♠, A♠, 3♦, 8♣, Q♥]

Not a Royal Flush yet — you have the Ace and 10 of Spades, but need K♠, Q♠, J♠.

**Thread Spend**: Call [K♠] — 2 Threads → Add to hand, discard Q♥
**Thread Spend**: Call [Q♠] — 2 Threads → Add to hand, discard 8♣

Wait — you can only call ONE card per turn. You spent 2 Threads on 10♠. You can't call more.

**Hand**: [10♠, A♠, 3♦, K♠... wait, you called 10♠, that's your one call.]

Let me recalculate. You call ONE card per turn. At 6 Threads:

**Thread Spend**: Call [10♠] — 2 Threads
**Random Draw (4 remaining cards from the 5-card draw)**: You draw 4 random + 1 called = 5 cards

**Hand**: [10♠, 3♦, 8♣, Q♥, A♠]

Two spades: 10♠ and A♠. That's a long way from a Royal Flush in one turn.

*This is the REAL lesson of the Fate Weaver. You can't build a Royal Flush in one turn — you can only call ONE card per turn. The fantasy is the SLOW BUILD across multiple turns, calling one card at a time, accepting failures between each call.*

---

**The REAL Payoff Turn (after 4+ turns of calling one card per turn)**

After calling A♠ on turn 4, K♠ on turn 5, Q♠ on turn 7, and finally J♠ and 10♠ via Marked Card setup...

**Final Hand of Fate**: [A♠, K♠, Q♠, J♠, 10♠]
**Poker Hand**: **ROYAL FLUSH**
**Damage**: 10d10 → [9, 8, 10, 7, 9, 6, 10, 8, 9, 7] = **83 damage!**

*The cards appear in your hand, glowing with golden light. Ace, King, Queen, Jack, Ten — all spades. The BEST POSSIBLE HAND. The necromancer's eyes widen as the cards explode into pure radiant energy, consuming him entirely.*

**The Lesson**:
1. You can only call **1 card per turn** — Royal Flush assembly takes 4-5 turns minimum
2. Each turn of "failure" builds 1-2 Threads for the next call
3. You took damage, dealt weak damage, and looked foolish for 8 turns
4. Then you dealt 83 damage in a single turn and killed the boss
5. **That's the Fate Weaver. You don't win every hand — you win the GAME.**`
    }
  },

  resourceSystem: {
    title: 'Threads of Destiny',
    subtitle: 'Weaving Fate from Failure',

    description: `Threads of Destiny are generated when spells fail or backfire. These cosmic threads represent the energy released when destiny is disrupted. Spend them to call specific cards from your deck — turning randomness into strategy.`,

    resourceBarExplanation: {
      title: 'Your Thread Gauge',
      content: `**Your Thread gauge (0-13) sits above your deck display.** At 4+ Threads, the Call Card button lights up. At 13 Threads, it pulses gold — spend or waste future generation.

**Call Card**: Spend 2 Threads to search your deck for any specific card and add it to your hand. **Once per turn.** The remaining deck is reshuffled.`
    },

    mechanics: {
      title: 'How It Works',
      content: `**Thread Generation**:
- **Spell Failure** (+1 Thread): Spell fails or produces minimal effect (High Card in poker, losing War of Wills)
- **Minor Negative Outcome** (+1 Thread): Spell produces a small negative effect (drawing 1 heart in Heart's Gamble)
- **Major Negative Outcome** (+2 Threads): Severe negative effect (blackjack bust, multiple hearts with face cards)

**Thread Spending**:
- **Call Specific Card** (2 Threads): Search deck for a specific card, add to hand, reshuffle deck. Once per turn.
- **Destiny's Insight** (Passive): See the top card of your deck at all times. Spend 1 Thread to peek at top 3 and choose which to draw.

**Capacity**: 0-13 Threads. Threads persist between combats.

**Deck Rules**: Shuffle 52-card deck at combat start. Reshuffle discard pile when deck runs out.`
    },

    tables: [
      {
        title: 'Thread Strategy — Build Early, Spend Late, Never Waste',
        headers: ['Threads', 'Phase', 'Action'],
        rows: [
          ['0-3', 'Building', 'Accept failures to build reserves'],
          ['4-6', 'Woven', 'Call 1 card on critical spells'],
          ['7-9', 'Tapestry', 'Call cards freely on important turns'],
          ['10-12', "Destiny's Web", 'Aggressive manipulation'],
          ['13', 'Fate Mastered', 'Spend now — further generation is wasted']
        ]
      }
    ],

    strategicConsiderations: {
      title: 'Advanced Thread Strategy',
      content: `**Key Principles**:
1. **Embrace Failure Early**: Opening rounds build Thread reserves for later
2. **Call Cards Across Turns**: You can only call 1 card per turn — a Royal Flush takes 4-5 turns of setup
3. **Know Your Deck**: Track which cards have been drawn to predict what's left
4. **Cap Awareness**: At 13 Threads, generation is wasted — spend before you hit cap
5. **Marked Card Setup**: Use Marked Card to prepare your next draw, reducing the Threads needed

**Advanced Techniques**:
- **Intentional Failure**: Accepting a negative outcome for 2 Threads is sometimes the right play
- **Cross-Turn Assembly**: Call A♠ turn 1, K♠ turn 2, Q♠ turn 3, etc. — build the perfect hand over time
- **Thread Cycling**: Spend Threads on cards that enable Thread generation (risky cards with high failure rates)`
    },

    playingInPerson: {
      title: 'Playing Fate Weaver In Person',
      content: `**Required**: Standard 52-card deck (no jokers) + 13 tokens (coins, beads, or buttons)

**Setup**:
\`\`\`
Deck: 52 cards, shuffled at combat start
Hand: Up to 5 cards (7 for Card Master specialization)
Threads: 0/13 — track with tokens
Discard: Used cards — reshuffle when deck runs out
\`\`\`

**Drawing Cards**: When a spell requires cards, draw from your deck. Used cards go to discard pile.

**Generating Threads**: Spell fails or backfires → add tokens to your pool.

**Spending Threads — Call a Card** (2 Threads, once per turn):
1. Announce which card you want (e.g., "Ace of Spades")
2. Remove 2 tokens from your pool
3. Search the deck for that card, add it to your hand
4. Reshuffle the remaining deck
5. You can only do this ONCE per turn

**Poker Hand Rankings (for Hand of Fate)**:
\`\`\`
Royal Flush    (10-J-Q-K-A, same suit)  → 10d10 damage
Straight Flush (5 sequential, same suit) → 8d10 damage
Four of a Kind (4 same rank)            → 6d10 damage
Full House     (3-of-kind + pair)        → 4d10 damage
Flush          (5 same suit)             → 4d8 damage
Straight       (5 sequential)            → 3d8 damage
Three of a Kind (3 same rank)            → 2d8 damage
Two Pair       (2 different pairs)       → 2d8 damage
One Pair       (2 same rank)             → 2d6 damage
High Card      (no matches)              → 1d4 damage + 1 Thread
\`\`\`

**Blackjack Values (for Draw of the Damned)**:
\`\`\`
Ace: 1 or 11 | Face cards: 10 | Others: face value
21 (Blackjack): Best effect    | 17-20: Good effect
11-16: Weak effect             | Bust (22+): Negative + 2 Threads
\`\`\`

**Thread Quick Reference**:
\`\`\`
Generate: Fail +1 | Minor negative +1 | Major negative +2
Spend: Call card = 2 Threads (once/turn) | Peek top 3 = 1 Thread
Max: 13 Threads | Persists between combats
Strategy: Build early → Spend late → Never waste
\`\`\``
    }
  },

  specializations: {
    title: 'Fate Weaver Specializations',
    subtitle: 'Three Paths of Destiny',

    description: `Fate Weavers specialize in one of three approaches to manipulating destiny.`,

    sharedPassive: {
      name: 'Destiny\'s Insight',
      icon: 'Radiant/Divine Halo',
      description: 'You can see the top card of your deck at all times. Spend 1 Thread to look at the top 3 cards and choose which one to draw (others go to bottom in any order).'
    },

    specs: [
      {
        id: 'fortune-teller',
        name: 'Fortune Teller',
        icon: 'Utility/Utility',
        color: '#9370DB',
        theme: 'Divination & Prediction',

        description: `**See the threads. Share the vision. Shape the outcome.**

Masters of divination who read cards to predict and shape events. They grant allies foresight and manipulate probability for favorable outcomes.`,

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
          icon: 'Psychic/Focused Mind',
          description: 'At the start of each turn, look at and rearrange the top 5 cards of your deck. When an ally within 30 ft makes an attack or save, spend 1 Thread to grant them advantage.'
        },

        keyAbilities: [
          "Scrying Hand — Draw cards to divine the future, revealing enemy intentions and granting allies bonuses based on suits drawn (3 mana, spend Threads to guarantee specific suits)",
          "Fate's Guidance — Share your vision with an ally, allowing them to reroll any roll and choose the result (4 mana, costs 3 Threads to activate)",
          "Prophetic Shield — Predict incoming damage and reduce it based on card accuracy (2 mana, closer predictions = more damage reduction)"
        ],

        recommendedFor: 'Players who enjoy support roles, strategic planning, and helping allies succeed through prediction and foresight.'
      },

      {
        id: 'card-master',
        name: 'Card Master',
        icon: 'Utility/Utility',
        color: '#FFD700',
        theme: 'Deck Manipulation & Control',

        description: `**The deck is your weapon. The hand is your will.**

Complete deck control. Experts at manipulating draws to always have the right card, excelling at combo-based gameplay and devastating card combinations.`,

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
          'Lower burst damage without Thread reserves'
        ],

        passiveAbility: {
          name: 'Master of the Deck',
          icon: 'Utility/Ornate Staff',
          description: 'Hand size increased to 7. Spending Threads to call a specific card lets you call 2 instead. Once per turn, discard a card and draw a replacement for 0 AP.'
        },

        keyAbilities: [
          "Perfect Hand — Draw cards until you have a specific poker hand, then unleash its power (5 mana, spend Threads to guarantee the hand you want)",
          "Deck Shuffle — Reshuffle your entire deck and draw 5 new cards, gaining bonuses based on suits (4 mana, generates 1 Thread per duplicate suit)",
          "Card Cascade — Play multiple cards in sequence, each amplifying the next (6 mana, combo potential scales with hand size)"
        ],

        recommendedFor: 'Players who enjoy combo gameplay, deck-building strategy, and maximizing control over randomness.'
      },

      {
        id: 'thread-weaver',
        name: 'Thread Weaver',
        icon: 'Arcane/Ebon Blaze',
        color: '#FF1493',
        theme: 'Thread Generation & Manipulation',

        description: `**Break fate to remake it. Every scar is a thread.**

Embraces failure as power, generating Threads at an accelerated rate. Risk-takers who turn every setback into opportunity and every failure into fuel.`,

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
          'Intentional failures can backfire',
          'Requires large Thread reserves to shine'
        ],

        passiveAbility: {
          name: 'Weaver of Fate',
          icon: 'Necrotic/Drain Soul',
          description: 'Generate +1 additional Thread whenever you gain Threads from any source (1→2, 2→3). Spend 5 Threads to force any spell to auto-succeed with max effect, or 3 Threads to force a spell to fail and gain its maximum Thread generation.'
        },

        keyAbilities: [
          "Embrace Chaos — Intentionally trigger negative outcomes on your spells to generate massive Threads, then spend them for guaranteed success (2 mana, high risk/reward)",
          "Thread Burst — Spend all your Threads at once to deal damage equal to Threads spent × 1d6 to all enemies (variable mana, empties Thread reserve)",
          "Destiny Reversal — Rewind the last spell cast (yours or an ally's) and force a different outcome (7 mana, costs 8 Threads)"
        ],

        recommendedFor: 'Players who enjoy high-variance gameplay, turning failures into victories, and explosive all-or-nothing moments.'
      }
    ]
  },

  // ========================================
  // SPELLS — ALL CARD-BASED, ALL TOUCH THREADS
  // ========================================
  spells: [
    // ========================================
    // LEVEL 1 SPELLS
    // ========================================
    {
      id: 'hand-of-fate',
      name: 'Hand of Fate',
      icon: 'Utility/Utility',
      spellType: 'ACTION',
      effectTypes: [],
      school: 'Divination',
      level: 1,

      description: 'Draw 5 cards to form a poker hand. May redraw up to twice. Hand strength determines damage dealt. High Card generates a Thread instead of significant damage. Spend Threads to call specific cards for your hand.',

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
        resourceTypes: ['mana'],
        resourceValues: { mana: 5 },
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
          usage: 'Spend 2 Threads to call 1 specific card for your hand (once per turn, counts as your one call)'
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
        name: 'Hand of Fate — Poker Hand Results',
        description: 'Draw 5 cards and form a poker hand (may redraw twice)',
        resolutionType: 'CARDS',
        resolutionConfig: { cardType: 'poker', cardCount: 5, redraws: 2 },
        entries: [
          { range: 'Royal Flush', name: 'Royal Flush', description: 'A♠ K♠ Q♠ J♠ 10♠ — Ultimate hand', effectType: 'damage', effectConfig: { damageFormula: '10d10', damageType: 'radiant' } },
          { range: 'Straight Flush', name: 'Straight Flush', description: 'Five sequential cards of same suit', effectType: 'damage', effectConfig: { damageFormula: '8d10', damageType: 'arcane' } },
          { range: 'Four of a Kind', name: 'Four of a Kind', description: 'Four cards of same rank', effectType: 'damage', effectConfig: { damageFormula: '6d10', damageType: 'force' } },
          { range: 'Full House', name: 'Full House', description: 'Three of a kind + pair', effectType: 'damage', effectConfig: { damageFormula: '4d10', damageType: 'radiant' } },
          { range: 'Flush', name: 'Flush', description: 'Five cards of same suit', effectType: 'damage', effectConfig: { damageFormula: '4d8', damageType: 'radiant' } },
          { range: 'Straight', name: 'Straight', description: 'Five sequential cards', effectType: 'damage', effectConfig: { damageFormula: '3d8', damageType: 'force' } },
          { range: 'Three of a Kind', name: 'Three of a Kind', description: 'Three cards of same rank', effectType: 'damage', effectConfig: { damageFormula: '2d8', damageType: 'force' } },
          { range: 'Two Pair', name: 'Two Pair', description: 'Two different pairs', effectType: 'healing', effectConfig: { healingFormula: '2d8' } },
          { range: 'One Pair', name: 'One Pair', description: 'Two cards of same rank', effectType: 'healing', effectConfig: { healingFormula: '1d8' } },
          { range: 'High Card', name: 'High Card', description: 'No matching cards — gain +1 Thread', effectType: 'buff', effectConfig: { buffType: 'thread_generation', buffDuration: 0 } }
        ]
      },

      tags: ['cards', 'poker', 'variable damage', 'fate weaver', 'thread generation', 'rollable table']
    },

    {
      id: 'war-of-wills',
      name: 'War of Wills',
      icon: 'Utility/Powerful Warrior',
      spellType: 'ACTION',
      effectTypes: ['damage', 'healing'],
      school: 'Evocation',
      level: 1,

      description: 'Challenge a creature to a card draw — War! Both draw one card. Higher card wins. Win: deal 1d8 force damage. Lose: heal the target for 2d8 and gain 1 Thread. Tie: both take 1d8 damage, gain 1 Thread. The loser\'s healing is fate\'s consolation — and your Thread gain is the real prize.',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 40,
        targetRestrictions: ['enemy']
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

      effects: {
        variable: {
          type: 'competitive_draw',
          win: '1d8 force damage to target',
          lose: '2d8 healing to target + 1 Thread',
          tie: '1d8 damage to both + 1 Thread'
        }
      },

      specialMechanics: {
        threadsOfDestiny: {
          generation: 'Lose: +1 Thread. Tie: +1 Thread.',
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
        name: 'War of Wills — Competitive Draw',
        description: 'Both draw one card, higher wins',
        resolutionType: 'CARDS',
        resolutionConfig: { cardType: 'competitive', players: 2 },
        entries: [
          { range: 'You Win', result: 'Deal 1d8 force damage to target', description: 'Your card is higher' },
          { range: 'You Lose', result: 'Target heals for 2d8 HP + you gain 1 Thread', description: 'Target\'s card is higher' },
          { range: 'Tie', result: 'Both take 1d8 damage + you gain 1 Thread', description: 'Same card value' }
        ]
      },

      tags: ['cards', 'competitive', 'damage', 'healing', 'fate weaver', 'thread generation', 'rollable table']
    },

    {
      id: 'echoes-of-the-past',
      name: 'Echoes of the Past',
      icon: 'Psychic/Focused Mind',
      spellType: 'ACTION',
      effectTypes: ['buff', 'utility'],
      school: 'Divination',
      level: 1,

      description: 'Call upon past actions to gain proficiency in a skill or tool of your choice for 1 hour. Spend 3 Threads to gain expertise instead.',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      durationConfig: {
        durationType: 'rounds',
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
        durationType: 'rounds',
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
        }
      },

      tags: ['utility', 'buff', 'proficiency', 'versatile', 'fate weaver']
    },

    {
      id: 'marked-card',
      name: 'Marked Card',
      icon: 'Arcane/Ebon Blaze',
      spellType: 'ACTION',
      effectTypes: ['utility'],
      school: 'Divination',
      level: 1,

      description: 'Spend 1 Thread to peek at the top 3 cards of your deck. Choose one to draw; the other two go to the bottom in any order. If no Threads to spend, draw the top card blindly and gain 1 Thread if it\'s a card you didn\'t want.',

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
        mana: 1,
        components: ['verbal'],
        verbalText: 'Signo Cartae!'
      },

      resolution: 'CARDS',

      effects: {
        utility: {
          type: 'deck_peek',
          description: 'Look at top 3 cards, choose one to draw'
        }
      },

      specialMechanics: {
        threadsOfDestiny: {
          generation: 'No Thread spent (blind draw only): +1 Thread if the drawn card doesn\'t help your current strategy',
          usage: 'Spend 1 Thread to peek at top 3 and choose'
        }
      },

      tags: ['utility', 'deck manipulation', 'fate weaver', 'thread generation']
    },

    {
      id: 'fate_lucky_strike',
      name: 'Lucky Strike',
      icon: 'Social/Dice Roll',
      spellType: 'ACTION',
      effectTypes: ['damage', 'buff'],
      school: 'Divination',
      level: 1,

      description: 'Draw a single card. Face cards and Aces deal 2d8 force damage and grant advantage on your next attack. Numbered cards deal 1d8 and grant +1 Thread (weak outcome builds your reserves).',

      typeConfig: {
        school: 'divination',
        icon: 'Social/Dice Roll',
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
        formula: '1d8 or 2d8',
        elementType: 'force',
        damageType: 'direct'
      },

      buffConfig: {
        buffType: 'statEnhancement',
        effects: [{
          id: 'lucky_strike',
          name: 'Lucky',
          description: 'Advantage on next attack roll for 1 round (face cards/Aces only)',
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
        resourceValues: { mana: 3 },
        actionPoints: 1,
        components: ['verbal', 'somatic']
      },

      resolution: 'CARDS',

      specialMechanics: {
        threadsOfDestiny: {
          generation: 'Numbered card drawn: +1 Thread (weak outcome)'
        },
        cardDraw: {
          cards: 1,
          faceCardOrAce: '2d8 damage + advantage on next attack',
          numberedCard: '1d8 damage + 1 Thread'
        }
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 0
      },

      tags: ['cards', 'damage', 'buff', 'fate weaver', 'thread generation']
    },

    {
      id: 'fate_twist_probability',
      name: 'Twist Probability',
      icon: 'Radiant/Divine Radiance',
      spellType: 'REACTION',
      effectTypes: ['debuff'],
      school: 'Divination',
      level: 1,

      description: 'When an enemy makes a roll, draw a card. If it\'s a face card, the enemy must reroll and take the lower result. If it\'s a numbered card, no effect — gain 1 Thread. If it\'s an Ace, the reroll also has disadvantage.',

      typeConfig: {
        school: 'divination',
        icon: 'Radiant/Divine Radiance',
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
          statusType: 'disadvantage',
          statPenalty: { stat: 'all_rolls', value: -99, magnitudeType: 'reroll_lower' },
          mechanicsText: 'Must reroll next roll and take lower result'
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
        resourceValues: { mana: 4 },
        actionPoints: 0,
        components: ['verbal']
      },

      resolution: 'CARDS',

      specialMechanics: {
        threadsOfDestiny: {
          generation: 'Numbered card drawn: +1 Thread (spell had no effect)'
        },
        cardDraw: {
          cards: 1,
          faceCard: 'Enemy rerolls and takes lower result',
          ace: 'Enemy rerolls with disadvantage',
          numberedCard: 'No effect + 1 Thread'
        }
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 2
      },

      tags: ['cards', 'debuff', 'reroll', 'fate weaver', 'thread generation']
    },

    // ========================================
    // LEVEL 2 SPELLS
    // ========================================
    {
      id: 'hearts-gamble',
      name: "Heart's Gamble",
      icon: 'Social/Social',
      spellType: 'ACTION',
      effectTypes: ['damage', 'buff'],
      school: 'Evocation',
      level: 2,

      description: 'Draw cards one at a time. Hearts deal 1d6 damage to you per heart (face card hearts deal 2d6). Non-hearts grant power: Aces give advantage, numbered non-hearts give +1d4 damage on next attack. Stop drawing anytime. Every heart feeds your Threads.',

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

      specialMechanics: {
        threadsOfDestiny: {
          generation: '1 heart drawn: +1 Thread. 2+ hearts or face card heart: +2 Threads',
          usage: 'Spend 2 Threads to peek at next card before drawing'
        },
        cardEffects: {
          hearts: '1d6 damage to self per heart',
          faceCardHearts: '2d6 damage to self per face card heart (J, Q, K of hearts)',
          aces: 'Advantage on next attack',
          numberedNonHearts: '+1d4 damage on next attack per card (stacks)'
        },
        stopAnytime: 'You may stop drawing at any time to lock in your buffs'
      },

      rollableTable: {
        enabled: true,
        name: "Heart's Gamble — Card Effects",
        description: 'Draw cards sequentially, stop anytime',
        resolutionType: 'CARDS',
        resolutionConfig: { cardType: 'sequential', stopAnytime: true },
        entries: [
          { range: 'Ace (any suit)', result: 'Gain advantage on your next attack roll', description: 'Positive' },
          { range: '2-10 (non-hearts)', result: 'Gain +1d4 damage on next attack (stacks)', description: 'Positive' },
          { range: 'Heart (2-10)', result: 'Take 1d6 damage + gain 1 Thread', description: 'Minor negative' },
          { range: 'Face Card (J, Q, K)', result: 'Take 2d6 damage + gain 2 Threads', description: 'Major negative' },
          { range: 'Ace of Hearts', result: 'Take 1d6 damage BUT gain advantage (mixed)', description: 'Mixed' }
        ]
      },

      tags: ['cards', 'self damage', 'buff', 'risk reward', 'fate weaver', 'thread generation', 'rollable table']
    },

    {
      id: 'fate_fortune_favor',
      name: "Fortune's Favor",
      icon: 'Utility/Utility',
      spellType: 'ACTION',
      effectTypes: ['buff'],
      school: 'Divination',
      level: 2,

      description: 'Draw a card. Face cards: you and one ally gain advantage on your next 3 rolls. Aces: advantage on next 5 rolls. Numbered cards: advantage on next 1 roll + gain 1 Thread. The better the card, the stronger the favor.',

      typeConfig: {
        school: 'divination',
        icon: 'Utility/Utility',
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 30,
        targetRestrictions: ['ally']
      },

      buffConfig: {
        buffType: 'statEnhancement',
        effects: [{
          id: 'fortune_favor',
          name: "Fortune's Favor",
          description: 'Advantage on next 1-5 rolls based on card drawn',
          statModifier: {
            stat: 'all_rolls',
            magnitude: 1,
            magnitudeType: 'advantage'
          }
        }],
        durationValue: 3,
        durationType: 'rounds',
        durationUnit: 'rolls',
        concentrationRequired: false,
        canBeDispelled: false
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 8 },
        actionPoints: 1,
        components: ['verbal', 'somatic']
      },

      resolution: 'CARDS',

      specialMechanics: {
        threadsOfDestiny: {
          generation: 'Numbered card: +1 Thread (weak outcome)'
        },
        cardDraw: {
          cards: 1,
          ace: 'Advantage on next 5 rolls for you and ally',
          faceCard: 'Advantage on next 3 rolls for you and ally',
          numberedCard: 'Advantage on next 1 roll + 1 Thread'
        }
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 3
      },

      tags: ['cards', 'buff', 'fortune', 'advantage', 'fate weaver', 'thread generation']
    },

    // ========================================
    // LEVEL 3 SPELLS
    // ========================================
    {
      id: 'draw-of-the-damned',
      name: 'Draw of the Damned',
      icon: 'Necrotic/Demonic Empowerment',
      spellType: 'ACTION',
      effectTypes: ['buff', 'damage'],
      school: 'Abjuration',
      level: 3,

      description: 'Draw cards aiming for 21. Choose your mode before drawing:\n**Shield Mode**: Ally gains AC bonus based on how close to 21 (21 = +5 AC, 17-20 = +3-4 AC, 11-16 = +1-2 AC). Lasts rest of combat.\n**Strike Mode**: Deal damage to an enemy equal to your blackjack total × 1d4.\n**Bust** (over 21): You take 3d6 damage, -2 AC next round, and gain 2 Threads. Either mode busts the same way.',

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
        durationType: 'rounds',
        description: 'Shield Mode AC bonus lasts for rest of combat'
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
        variable: {
          type: 'blackjack',
          modes: ['shield', 'strike'],
          bust: 'Self-damage + Thread generation'
        }
      },

      specialMechanics: {
        threadsOfDestiny: {
          generation: 'Bust: +2 Threads. Total 11 or less: +1 Thread (weak outcome)',
          usage: 'Spend 2 Threads to call a specific card to improve your total'
        },
        blackjack: {
          target: 21,
          aceValue: '1 or 11',
          faceCards: 10,
          modes: {
            shield: 'AC bonus to ally based on total',
            strike: 'Damage to enemy = total × 1d4'
          },
          bust: 'Take 3d6 self-damage, -2 AC next round'
        }
      },

      rollableTable: {
        enabled: true,
        name: 'Draw of the Damned — Blackjack Results',
        description: 'Draw cards aiming for 21. Choose Shield or Strike mode.',
        resolutionType: 'CARDS',
        resolutionConfig: { cardType: 'blackjack', target: 21, modes: ['shield', 'strike'] },
        entries: [
          { range: '21 (Blackjack)', result_shield: 'Ally +5 AC (rest of combat)', result_strike: 'Deal 21 × 1d4 force damage', description: 'Perfect score' },
          { range: '19-20', result_shield: 'Ally +4 AC', result_strike: 'Deal total × 1d4 damage', description: 'Excellent' },
          { range: '17-18', result_shield: 'Ally +3 AC', result_strike: 'Deal total × 1d4 damage', description: 'Good' },
          { range: '15-16', result_shield: 'Ally +2 AC', result_strike: 'Deal total × 1d4 damage', description: 'Decent' },
          { range: '12-14', result_shield: 'Ally +1 AC', result_strike: 'Deal total × 1d4 damage', description: 'Weak' },
          { range: '11 or less', result_shield: 'No effect + 1 Thread', result_strike: 'No effect + 1 Thread', description: 'Too low' },
          { range: '22-25 (Bust)', result: 'Take 3d6 damage, -2 AC next round + 2 Threads', description: 'Moderate bust' },
          { range: '26+ (Major Bust)', result: 'Take 3d6 damage, -3 AC next round + 2 Threads', description: 'Severe bust' }
        ]
      },

      tags: ['cards', 'blackjack', 'buff', 'damage', 'fate weaver', 'thread generation', 'rollable table']
    },

    {
      id: 'echo-of-fate',
      name: 'Echo of Fate',
      icon: 'Arcane/Ebon Blaze',
      spellType: 'ACTION',
      effectTypes: ['buff'],
      school: 'Divination',
      level: 3,

      description: 'Draw a card and have an ally within 30 feet draw a card. Matching ranks: your next spell deals double damage/heals double. Matching suit too: tripled. No match: next spell halved + gain 1 Thread. Coordinate with your ally for maximum synergy.',

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
        durationType: 'rounds',
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
            perfectMatch: 'Next spell tripled',
            rankMatch: 'Next spell doubled',
            suitMatch: 'Next spell +50%',
            noMatch: 'Next spell halved + 1 Thread'
          }
        }
      },

      specialMechanics: {
        threadsOfDestiny: {
          generation: 'No match: +1 Thread',
          usage: 'Spend 2 Threads to call a specific card for your draw'
        },
        coordination: {
          type: 'ally_cooperation',
          description: 'Ally draws a card too — matching ranks = success',
          strategy: 'Communicate with ally about what cards they need'
        }
      },

      rollableTable: {
        enabled: true,
        name: 'Echo of Fate — Card Matching',
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

      tags: ['cards', 'matching', 'buff', 'ally cooperation', 'fate weaver', 'thread generation', 'rollable table']
    },

    // ========================================
    // LEVEL 4 SPELLS
    // ========================================
    {
      id: 'solitaires-shield',
      name: "Solitaire's Shield",
      icon: 'Force/Force Field',
      spellType: 'ACTION',
      effectTypes: ['healing', 'utility'],
      school: 'Abjuration',
      level: 4,

      description: 'Draw cards and attempt to form sequences or sets. Sequences (3+ consecutive) grant free spellcasting. Sets (3+ same rank) restore HP. No pattern: gain 1 Thread. Spend Threads to call cards that complete your patterns.',

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
          generation: 'No pattern: +1 Thread',
          usage: 'Spend 2 Threads to call a card that completes your pattern'
        },
        patterns: {
          sequence: '3+ consecutive numbers (e.g., 5-6-7)',
          set: '3+ cards of same rank (e.g., three 8s)',
          reward: 'Sequence = free spell, Set = 2d8 healing per card'
        }
      },

      rollableTable: {
        enabled: true,
        name: "Solitaire's Shield — Pattern Matching",
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

      tags: ['cards', 'pattern matching', 'healing', 'utility', 'fate weaver', 'thread generation', 'rollable table']
    },

    {
      id: 'fates-exchange',
      name: "Fate's Exchange",
      icon: 'Arcane/Quick Step',
      spellType: 'ACTION',
      effectTypes: ['utility'],
      school: 'Conjuration',
      level: 4,

      description: 'Swap positions with an ally within 30 feet — both teleport instantly. Spend 1 Thread to increase range to 60 feet. A strategic repositioning that costs a card from your hand (discard 1 card).',

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
        durationType: 'instant'
      },

      resourceCost: {
        mana: 5,
        components: ['verbal', 'somatic'],
        verbalText: 'Permutatio Fati!',
        somaticText: 'Gesture between self and ally'
      },

      resolution: 'CARDS',

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
        cardDraw: {
          cost: 'Discard 1 card from your hand (if no cards in hand, cannot cast)'
        }
      },

      tags: ['cards', 'utility', 'teleport', 'tactical', 'ally support', 'fate weaver']
    },

    {
      id: 'destiny-bond',
      name: 'Destiny Bond',
      icon: 'Healing/Prayer',
      spellType: 'ACTION',
      school: 'Necromancy',
      level: 4,

      description: 'Create a bond with an ally through a shared card — both of you draw one card. For 1 minute, you can transfer up to half your current HP to them (1 AP per transfer). If your cards matched suits, they can also transfer HP back to you. Spend 2 Threads to guarantee matching suits.',

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
        durationType: 'rounds',
        duration: 1,
        durationUnit: 'minute'
      },

      resourceCost: {
        mana: 5,
        components: ['verbal', 'somatic'],
        verbalText: 'Vinculum Destini!',
        somaticText: 'Extend hand toward ally'
      },

      resolution: 'CARDS',

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
          usage: 'Spend 2 Threads to guarantee matching suits (enables two-way HP transfer)'
        },
        cardDraw: {
          cards: 2,
          description: 'Both you and ally draw 1 card. Matching suits enables two-way transfer.'
        }
      },

      tags: ['cards', 'healing', 'support', 'sacrifice', 'bond', 'fate weaver']
    },

    // ========================================
    // LEVEL 5 SPELLS
    // ========================================
    {
      id: 'fate_weaver_stacked_deck',
      name: 'Stacked Deck',
      description: 'Spend 4 Threads to search your deck, rearrange the top 10 cards in any order. Your next 3 attacks or spells drawn from the top of the deck are guaranteed to be favorable. Any cards you call during these 3 draws cost 1 less Thread.',
      level: 5,
      spellType: 'ACTION',
      icon: 'Psychic/Mental Chaos',

      typeConfig: {
        school: 'divination',
        icon: 'Psychic/Mental Chaos',
        castTime: 1,
        castTimeType: 'BONUS'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      resourceCost: {
        resourceTypes: ['mana', 'threads_spend'],
        resourceValues: { mana: 15 },
        threadCost: 4,
        actionPoints: 0,
        components: ['somatic'],
        somaticText: 'Shuffle cards elegantly'
      },

      resolution: 'CARDS',
      effectTypes: ['buff'],

      buffConfig: {
        buffType: 'deck_manipulation',
        effects: [{
          id: 'stacked_deck',
          name: 'Stacked Deck',
          description: 'Top 10 cards rearranged. Next 3 card draws are favorable. Call card costs reduced by 1 Thread.',
          mechanicsText: 'Rearrange top 10 cards. Next 3 draws are favorable. Card calls cost 1 less Thread.',
          charges: 3
        }],
        durationValue: 3,
        durationType: 'rounds',
        durationUnit: 'draws'
      },

      specialMechanics: {
        threadsOfDestiny: {
          usage: 'Costs 4 Threads to activate. Reduces call card cost by 1 Thread for next 3 draws.'
        },
        cardDraw: {
          description: 'Look at top 10 cards of deck and rearrange in any order'
        }
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 4
      },

      tags: ['cards', 'buff', 'deck manipulation', 'level 5', 'fate weaver']
    },

    {
      id: 'fate_weaver_twist_fate',
      name: 'Twist Fate',
      description: 'Draw 3 cards. Face cards let you force a creature to reroll any roll and choose which result stands. Aces let you do the same to ALL creatures in range. Numbered cards: reroll 1 creature and gain 1 Thread per numbered card.',
      level: 5,
      spellType: 'REACTION',
      icon: 'Arcane/Rewind Time',

      typeConfig: {
        school: 'divination',
        icon: 'Arcane/Rewind Time',
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

      resolution: 'CARDS',
      effectTypes: ['control'],

      specialMechanics: {
        reroll: {
          description: 'Draw 3 cards. Face cards = choose reroll result for 1 target. Aces = choose for all. Numbered = reroll 1 + gain Threads.'
        },
        threadsOfDestiny: {
          generation: 'Each numbered card drawn: +1 Thread',
          usage: 'None — this spell GENERATES Threads on weak draws'
        },
        cardDraw: {
          cards: 3,
          faceCard: 'Force 1 creature to reroll, you choose result',
          ace: 'Force ALL creatures in range to reroll, you choose results',
          numberedCard: 'Force 1 creature to reroll + gain 1 Thread per numbered card'
        }
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 3
      },

      tags: ['cards', 'control', 'reroll', 'level 5', 'fate weaver']
    },

    // ========================================
    // LEVEL 6 SPELLS
    // ========================================
    {
      id: 'fate_weaver_dealers_choice',
      name: "Dealer's Choice",
      description: 'Deal a card to every creature in range (draw one card per creature). You choose who gets beneficial or harmful effects BEFORE looking at the cards. Face cards deal 3d6 damage to enemies. Numbered cards grant +3 to all rolls to allies for 3 rounds. Aces do both. Any Hearts dealt generate 1 Thread each.',
      level: 6,
      spellType: 'ACTION',
      icon: 'Radiant/Divine Ascension',

      typeConfig: {
        school: 'enchantment',
        icon: 'Radiant/Divine Ascension',
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
        resourceValues: { mana: 25 },
        actionPoints: 2,
        components: ['somatic'],
        somaticText: 'Deal cards to all'
      },

      resolution: 'CARDS',
      effectTypes: ['buff', 'debuff'],

      buffConfig: {
        buffType: 'variable',
        effects: [{
          id: 'good_card',
          name: 'Fortune Card',
          description: 'Numbered card: +3 to all rolls for 3 rounds',
          statModifier: { stat: 'all_rolls', magnitude: 3, magnitudeType: 'flat' },
          mechanicsText: '+3 to all rolls for 3 rounds'
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
          description: 'Face card: 3d6 force damage',
          mechanicsText: 'Face card deals 3d6 force damage'
        }],
        saveDC: 16,
        saveType: 'charisma',
        saveOutcome: 'halves'
      },

      specialMechanics: {
        threadsOfDestiny: {
          generation: 'Each Heart dealt: +1 Thread',
          usage: 'None — this spell GENERATES Threads from Hearts'
        },
        cardDraw: {
          description: 'Draw 1 card per creature. Assign cards to creatures BEFORE looking.',
          faceCard: '3d6 damage to enemy assigned',
          numberedCard: '+3 to all rolls for ally assigned (3 rounds)',
          ace: 'Both effects on assigned target',
          hearts: '+1 Thread per Heart drawn regardless of assignment'
        }
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 4
      },

      tags: ['cards', 'buff', 'debuff', 'aoe', 'control', 'level 6', 'fate weaver']
    },

    {
      id: 'fate_weaver_twenty_one_curses',
      name: 'Twenty-One Curses',
      description: 'Draw cards for blackjack. Hit or stand. Your total becomes a curse multiplier on the target: total × 1d6 force damage. Bust = you take the damage instead AND gain 2 Threads. A natural 21 (first 2 cards) also stuns the target for 1 round.',
      level: 6,
      spellType: 'ACTION',
      icon: 'Necrotic/Demonic Empowerment',

      typeConfig: {
        school: 'evocation',
        icon: 'Necrotic/Demonic Empowerment',
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
        resourceValues: { mana: 20 },
        actionPoints: 1,
        components: ['somatic'],
        somaticText: 'Draw cursed cards one by one'
      },

      resolution: 'CARDS',
      effectTypes: ['damage'],

      damageConfig: {
        formula: 'blackjack_total * 1d6',
        elementType: 'force',
        damageType: 'direct'
      },

      specialMechanics: {
        blackjack: {
          description: 'Draw cards (A=1/11, face=10). Hit or stand. Total × 1d6 = damage.',
          twentyOne: 'Total × 1d6 damage + stun 1 round',
          bust: 'Take the damage yourself instead + gain 2 Threads'
        },
        threadsOfDestiny: {
          generation: 'Bust: +2 Threads. Total 11 or less: +1 Thread (weak outcome)',
          usage: 'Spend 2 Threads to call a card to improve your total'
        }
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 3
      },

      tags: ['cards', 'blackjack', 'damage', 'risk reward', 'level 6', 'fate weaver']
    },

    {
      id: 'fate_weaver_fold_reality',
      name: 'Fold Reality',
      description: 'Fold space like a deck of cards. Draw 5 cards — each Heart in your hand determines a teleport destination you can send an ally to (within 120 feet, line of sight). No Hearts: no teleports, but gain 1 Thread per Heart-less card drawn. Spend 4 Threads to guarantee 2 Hearts.',
      level: 6,
      spellType: 'ACTION',
      icon: 'Arcane/Open Portal',

      typeConfig: {
        school: 'conjuration',
        icon: 'Arcane/Open Portal',
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
        resourceValues: { mana: 28 },
        actionPoints: 2,
        components: ['somatic'],
        somaticText: 'Fold space like cards'
      },

      resolution: 'CARDS',
      effectTypes: ['utility'],

      utilityConfig: {
        utilityType: 'Teleport',
        selectedEffects: [{
          id: 'teleport',
          name: 'Teleport',
          description: 'Teleport allies to locations based on Hearts drawn (up to 120 feet)',
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

      specialMechanics: {
        threadsOfDestiny: {
          generation: 'No Hearts in hand: +1 Thread per non-Heart card (up to 5 Threads)',
          usage: 'Spend 4 Threads to guarantee at least 2 Hearts in your draw'
        },
        cardDraw: {
          cards: 5,
          hearts: 'Each Heart = 1 ally can teleport up to 120 feet',
          noHearts: 'No teleports, but gain 1 Thread per card (up to 5 Threads)'
        }
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 5
      },

      tags: ['cards', 'utility', 'teleport', 'party', 'level 6', 'fate weaver']
    },

    // ========================================
    // LEVEL 7 SPELLS
    // ========================================
    {
      id: 'fate_weaver_house_rules',
      name: 'House Rules',
      description: 'Draw 3 cards. The suits determine the new rules you impose on reality for 1 minute:\n♠ Spades: Enemies treat all maximum die results as 1 less\n♥ Hearts: Allies gain 1 Thread whenever they take damage\n♦ Diamonds: You may call 2 cards per turn instead of 1\n♣ Clubs: All enemies have disadvantage on their first roll each turn\nNo pairs: only 1 rule applies (your choice). Pairs: 2 rules. Three of a kind: all 4 rules.',
      level: 7,
      spellType: 'ACTION',
      icon: 'Radiant/Radiant Divinity',

      typeConfig: {
        school: 'enchantment',
        icon: 'Radiant/Radiant Divinity',
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
        resourceValues: { mana: 35 },
        actionPoints: 2,
        components: ['verbal'],
        verbalText: 'Regula Meae!'
      },

      resolution: 'CARDS',
      effectTypes: ['buff', 'debuff'],

      specialMechanics: {
        threadsOfDestiny: {
          generation: 'No matching suits: +1 Thread',
          usage: 'None — this spell GENERATES Threads from Hearts rule'
        },
        cardDraw: {
          cards: 3,
          spades: 'Enemies treat max die results as 1 less (6s become 5s, etc.)',
          hearts: 'Allies gain 1 Thread when they take damage',
          diamonds: 'You may call 2 cards per turn instead of 1',
          clubs: 'Enemies have disadvantage on first roll each turn',
          pairs: '2 rules apply',
          threeOfAKind: 'All 4 rules apply'
        }
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 6
      },

      tags: ['cards', 'buff', 'debuff', 'aoe', 'level 7', 'fate weaver']
    },

    {
      id: 'fate_weaver_all_in',
      name: 'All In',
      description: 'Draw 5 cards face-down. Reveal them one at a time. Each card that matches your target\'s "fate card" (drawn by the GM/target) deals 3d6 force damage. Bet up to half your HP — if you reveal MORE misses than hits, you lose the HP bet. Every miss generates 2 Threads. Spend Threads before revealing to peek at the next card.',
      level: 7,
      spellType: 'ACTION',
      icon: 'Fire/Rising Inferno',

      typeConfig: {
        school: 'evocation',
        icon: 'Fire/Rising Inferno',
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
        resourceValues: { mana: 30, hp: 'variable' },
        actionPoints: 2,
        components: ['verbal'],
        verbalText: 'ALL IN!'
      },

      resolution: 'CARDS',
      effectTypes: ['damage'],

      damageConfig: {
        formula: 'matches * 3d6',
        elementType: 'force',
        damageType: 'direct'
      },

      specialMechanics: {
        allIn: {
          description: 'Bet up to half current HP. Draw 5 cards face-down. Target draws 1 "fate card." Reveal yours one at a time. Each match = 3d6 damage. More misses than hits = lose HP bet.',
          risk: 'Misses cost your HP bet but generate 2 Threads each'
        },
        threadsOfDestiny: {
          generation: 'Each non-matching card: +2 Threads',
          usage: 'Spend 2 Threads to peek at next face-down card before revealing'
        },
        cardDraw: {
          cards: 5,
          match: '3d6 damage per card matching target\'s fate card rank',
          miss: '+2 Threads and counts toward HP bet loss'
        }
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 4
      },

      tags: ['cards', 'damage', 'high risk', 'betting', 'level 7', 'fate weaver']
    },

    {
      id: 'fate_weaver_destiny_rewritten',
      name: 'Destiny Rewritten',
      description: 'Draw 7 cards and lay them out as the "Timeline." Reverse the order of the Timeline — the last card drawn becomes the first. This rewinds one action taken in the last round as if it never happened. Each Face card in the Timeline reduces the Thread cost by 1. No Face cards: full cost and the reversal is imperfect (GM adds a complication).',
      level: 7,
      spellType: 'REACTION',
      icon: 'Arcane/Rewind Time',

      typeConfig: {
        school: 'transmutation',
        icon: 'Arcane/Rewind Time',
        castTime: 1,
        castTimeType: 'REACTION'
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
        verbalText: 'Rescribe!'
      },

      resolution: 'CARDS',
      effectTypes: ['utility'],

      specialMechanics: {
        rewrite: {
          description: 'Draw 7 cards as "Timeline." Reverse order to undo 1 action from last round. Face cards reduce Thread cost. No face cards = imperfect reversal.',
          limit: 'Cannot undo death of a creature'
        },
        threadsOfDestiny: {
          generation: 'No face cards in Timeline: +2 Threads (imperfect reversal — you gain power from the failure)',
          usage: 'Base cost: 6 Threads. Each Face card in Timeline reduces cost by 1.'
        },
        cardDraw: {
          cards: 7,
          faceCards: 'Each Face card reduces Thread cost by 1 (minimum 0)',
          noFaceCards: '+2 Threads but reversal is imperfect'
        }
      },

      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },

      tags: ['cards', 'utility', 'time', 'undo', 'level 7', 'fate weaver']
    },

    // ========================================
    // LEVEL 8 SPELLS
    // ========================================
    {
      id: 'fate_weaver_the_jokers_hand',
      name: "The Joker's Hand",
      description: 'Draw the Joker from your deck (if using a deck without Jokers, treat the first red card drawn as The Joker). Draw 5 additional cards. The Joker adopts the identity of whichever card would create the best possible outcome from your table of effects. If all 5 cards are the same suit as the Joker, draw 5 more and apply effects twice.',
      level: 8,
      spellType: 'ACTION',
      icon: 'Utility/Utility',

      typeConfig: {
        school: 'evocation',
        icon: 'Utility/Utility',
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'smart',
        rangeType: 'ranged',
        rangeDistance: 120
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 45 },
        actionPoints: 2,
        components: ['somatic'],
        somaticText: 'Draw the wild card'
      },

      resolution: 'CARDS',
      effectTypes: ['variable'],

      rollableTable: {
        enabled: true,
        name: "The Joker's Hand — Wild Effects",
        description: 'The Joker becomes the best possible card. Draw 5 cards for effect.',
        resolutionType: 'CARDS',
        resolutionConfig: { cardType: 'joker', cardCount: 5 },
        entries: [
          { range: 'Royal Flush', name: 'Fate Ascendant', effect: { type: 'damage', formula: '12d10 radiant', target: 'enemies' } },
          { range: 'Straight Flush', name: 'The River', effect: { type: 'damage', formula: '10d10 force', target: 'enemies' } },
          { range: 'Four of a Kind', name: 'Quad Fury', effect: { type: 'damage', formula: '8d10 force', target: 'enemies' } },
          { range: 'Full House', name: 'Fortune & Ruin', effect: { type: 'mixed', description: 'Heal allies for 8d8 + deal 8d8 to enemies' } },
          { range: 'Flush', name: 'Suit Storm', effect: { type: 'damage', formula: '6d10 (type matches suit)', target: 'enemies' } },
          { range: 'Straight', name: 'Sequence of Fate', effect: { type: 'control', description: 'All enemies skip next action' } },
          { range: 'Three of a Kind', name: 'Triple Threat', effect: { type: 'buff', description: 'All allies gain +4 to all rolls for 3 rounds' } },
          { range: 'Two Pair', name: 'Mirror Fate', effect: { type: 'utility', description: 'Reflect all damage to allies back at attackers for 2 rounds' } },
          { range: 'One Pair', name: 'Twin Fortune', effect: { type: 'resource', description: 'Restore 30 mana and 5 Threads' } },
          { range: 'High Card', name: 'Joker\'s Mercy', effect: { type: 'thread_generation', description: 'Gain 5 Threads + draw again' } }
        ]
      },

      specialMechanics: {
        threadsOfDestiny: {
          generation: 'High Card result: gain 5 Threads and draw again',
          usage: 'None — this spell is pure card-based chaos'
        }
      },

      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },

      tags: ['cards', 'variable', 'powerful', 'level 8', 'fate weaver', 'rollable table']
    },

    {
      id: 'fate_weaver_fate_sealed',
      name: 'Fate Sealed',
      description: 'Draw 3 cards. If any two share the same suit, seal an enemy\'s fate — the next attack against them automatically hits and cannot be avoided. All 3 same suit: the hit is also a critical. No matching suits: gain 1 Thread per card. Spend 2 Threads to call a card to force a suit match.',
      level: 8,
      spellType: 'ACTION',
      icon: 'Psychic/Mind Roar',

      typeConfig: {
        school: 'enchantment',
        icon: 'Psychic/Mind Roar',
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
        resourceValues: { mana: 40 },
        actionPoints: 2,
        components: ['verbal'],
        verbalText: 'Fatum Signatum!'
      },

      resolution: 'CARDS',
      effectTypes: ['debuff'],

      debuffConfig: {
        debuffType: 'seal',
        effects: [{
          id: 'fate_sealed',
          name: 'Fate Sealed',
          description: 'Next attack automatically hits, cannot be avoided or reduced. Critical if 3 same suit.',
          mechanicsText: 'Next attack auto-hits. Critical if 3 cards matched suit.',
          charges: 1
        }],
        durationValue: 3,
        durationType: 'rounds',
        durationUnit: 'rounds',
        saveDC: 18,
        saveType: 'charisma',
        saveOutcome: 'halves_duration'
      },

      specialMechanics: {
        threadsOfDestiny: {
          generation: 'No matching suits: +1 Thread per card drawn (up to 3 Threads)',
          usage: 'Spend 2 Threads to call a card that matches one of your drawn suits'
        },
        cardDraw: {
          cards: 3,
          twoSameSuit: 'Next attack auto-hits',
          threeSameSuit: 'Next attack auto-hits AND is a critical hit',
          noMatch: 'No effect + 1 Thread per card'
        }
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 5
      },

      tags: ['cards', 'debuff', 'guaranteed hit', 'level 8', 'fate weaver']
    },

    {
      id: 'fate_weaver_fates_wager',
      name: "Fate's Wager",
      description: 'Double down on your next card-based spell. Draw a card — Face card: your next spell\'s effect is doubled (damage, healing, duration). Numbered card: your next spell\'s effect is doubled BUT you also take the spell\'s damage/healing yourself. Ace: tripled with no downside. The wager is always in the cards.',
      level: 8,
      spellType: 'ACTION',
      icon: 'Radiant/Radiant Glow',

      typeConfig: {
        school: 'enchantment',
        icon: 'Radiant/Radiant Glow',
        castTime: 1,
        castTimeType: 'BONUS'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 35 },
        actionPoints: 0,
        components: ['verbal'],
        verbalText: 'Double down!'
      },

      resolution: 'CARDS',
      effectTypes: ['buff'],

      buffConfig: {
        buffType: 'amplify',
        effects: [{
          id: 'fates_wager',
          name: "Fate's Wager",
          description: 'Face card: next spell doubled. Ace: next spell tripled. Numbered: doubled but you also take the effect.',
          mechanicsText: 'Draw 1 card. Face/Ace: next spell 2x-3x. Numbered: 2x but self-hit too.',
          charges: 1
        }],
        durationValue: 1,
        durationType: 'instant',
        durationUnit: 'spell'
      },

      specialMechanics: {
        threadsOfDestiny: {
          generation: 'Numbered card drawn AND self-damage taken: +2 Threads',
          usage: 'None — the wager generates Threads from the risk'
        },
        cardDraw: {
          cards: 1,
          faceCard: 'Next card-based spell effect doubled (no downside)',
          ace: 'Next card-based spell effect tripled (no downside)',
          numberedCard: 'Next spell effect doubled BUT you also take the damage/healing + 2 Threads'
        }
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 4
      },

      tags: ['cards', 'buff', 'amplify', 'risk reward', 'level 8', 'fate weaver']
    },

    // ========================================
    // LEVEL 9 SPELLS
    // ========================================
    {
      id: 'fate_weaver_grand_gambit',
      name: 'Grand Gambit',
      description: 'Deal one card face-up to each enemy in range. Then deal yourself one card for each enemy. For each enemy: if YOUR card is higher, they are reduced to 1 HP. If their card is higher, they are fully healed and gain +2 AC for 1 minute. Ties: both your card and theirs are discarded, no effect, +1 Thread per tie. This is War — and the stakes are everything.',
      level: 9,
      spellType: 'ACTION',
      icon: 'Utility/Utility',

      typeConfig: {
        school: 'evocation',
        icon: 'Utility/Utility',
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
        resourceValues: { mana: 60 },
        actionPoints: 3,
        components: ['verbal', 'somatic'],
        verbalText: 'GAMBIT MAGNUS!',
        somaticText: 'Deal cards to every enemy'
      },

      resolution: 'CARDS',
      effectTypes: ['damage', 'healing'],

      specialMechanics: {
        grandGambit: {
          description: 'Deal 1 card to each enemy, 1 to yourself per enemy. Higher card wins. You win: enemy to 1 HP. You lose: enemy fully healed +2 AC.',
          perTarget: true
        },
        threadsOfDestiny: {
          generation: 'Each tie: +1 Thread. Each loss: +1 Thread.',
          usage: 'Spend 2 Threads per enemy to call your card for that matchup'
        },
        cardDraw: {
          description: 'War mechanic. One card per enemy, one card for you per enemy.'
        }
      },

      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },

      tags: ['cards', 'damage', 'high risk', 'war', 'ultimate', 'level 9', 'fate weaver']
    },

    {
      id: 'fate_weaver_master_of_destiny',
      name: 'Master of Destiny',
      description: 'Draw 13 cards (one for each rank, Ace through King). Lay them out as the "Throne of Destiny." For 1 minute, whenever any creature rolls a die, you may spend 1 Thread to replace their result with the value of the matching card from your Throne. Face cards count as 20. Aces count as 1 or 20 (your choice). Cards not in the Throne cannot be modified.',
      level: 9,
      spellType: 'ACTION',
      icon: 'Radiant/Divine Illumination',

      typeConfig: {
        school: 'divination',
        icon: 'Radiant/Divine Illumination',
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 70 },
        actionPoints: 2,
        components: ['verbal'],
        verbalText: 'Ego Sum Dominus Fati!'
      },

      resolution: 'CARDS',
      effectTypes: ['buff'],

      buffConfig: {
        buffType: 'fate_control',
        effects: [{
          id: 'master_of_destiny',
          name: 'Master of Destiny',
          description: 'Spend 1 Thread per die to replace any roll with the value from your Throne of Destiny cards.',
          mechanicsText: 'Draw 13 cards as Throne. Spend 1 Thread to replace any die result with Throne card value.',
          charges: 13
        }],
        durationValue: 1,
        durationType: 'minutes',
        durationUnit: 'minutes'
      },

      specialMechanics: {
        threadsOfDestiny: {
          generation: 'None — this spell CONSUMES Threads',
          usage: 'Spend 1 Thread per die replacement. Face cards = 20. Aces = 1 or 20.'
        },
        cardDraw: {
          cards: 13,
          description: 'Draw 13 cards, one for each rank. These become the Throne of Destiny.'
        }
      },

      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },

      tags: ['cards', 'buff', 'dice control', 'ultimate', 'level 9', 'fate weaver']
    },

    {
      id: 'fate_weaver_jackpot_supreme',
      name: 'Jackpot Supreme',
      description: 'Draw 3 cards. If any 2 share the same rank, it\'s a JACKPOT — deal 10d10 × the number of matching cards force damage in a 30-foot radius. 3 of a kind: 10d10 × 7 damage + stun all targets 1 round. No matches: deal 10d10 base damage + gain 3 Threads. The jackpot is in the cards, not the dice.',
      level: 9,
      spellType: 'ACTION',
      icon: 'Radiant/Radiant Glow',

      typeConfig: {
        school: 'evocation',
        icon: 'Radiant/Radiant Glow',
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
        resourceValues: { mana: 65 },
        actionPoints: 3,
        components: ['verbal', 'somatic'],
        verbalText: 'JACKPOT!',
        somaticText: 'Draw three cards'
      },

      resolution: 'CARDS',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '10d10 * multiplier',
        elementType: 'force',
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
          noMatch: { multiplier: 1, description: '10d10 base damage + 3 Threads' },
          twoMatch: { multiplier: 3, description: '10d10 × 3 force damage' },
          threeMatch: { multiplier: 7, description: '10d10 × 7 damage + stun all targets 1 round' }
        },
        threadsOfDestiny: {
          generation: 'No matching ranks: +3 Threads',
          usage: 'Spend 4 Threads to call a card that matches one of your drawn cards'
        },
        cardDraw: {
          cards: 3,
          noMatch: '10d10 base damage + 3 Threads',
          twoMatch: '10d10 × 3 damage',
          threeMatch: '10d10 × 7 damage + stun 1 round'
        }
      },

      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },

      tags: ['cards', 'damage', 'aoe', 'jackpot', 'ultimate', 'level 9', 'fate weaver']
    },

    // ========================================
    // LEVEL 10 SPELLS
    // ========================================
    {
      id: 'fate_weaver_rewrite_destiny',
      name: 'Rewrite Destiny',
      description: 'Draw 13 cards and lay them face-up as the Tapestry of Fate. Choose one creature within range. Rearrange the Tapestry to spell their fate:\n**All Face Cards**: Ally gains immunity to damage and auto-success on all rolls for 1 minute.\n**All Same Suit**: Enemy reduced to 1 HP and stunned 1 minute (no save).\n**Sequential (Ace through King)**: Target permanently polymorphed (save after 1 hour).\nIf you cannot form any pattern, gain 5 Threads and the spell fails.',
      level: 10,
      spellType: 'ACTION',
      icon: 'Arcane/Rewind Time',

      typeConfig: {
        school: 'transmutation',
        icon: 'Arcane/Rewind Time',
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
        resourceValues: { mana: 90 },
        actionPoints: 3,
        components: ['verbal', 'somatic'],
        verbalText: 'RESCRIBERE FATUM!',
        somaticText: 'Rewrite reality with cards'
      },

      resolution: 'CARDS',
      effectTypes: ['utility'],

      specialMechanics: {
        rewriteDestiny: {
          choices: [
            { name: 'All Face Cards', effect: 'Target ally gains immunity and auto-success for 1 minute', requirement: 'All 13 cards must be face cards (J, Q, K)' },
            { name: 'All Same Suit', effect: 'Enemy reduced to 1 HP, stunned 1 minute (no save)', requirement: 'All 13 cards must share a suit' },
            { name: 'Sequential', effect: 'Target permanently polymorphed (save after 1 hour)', requirement: 'Cards form Ace through King sequence' },
            { name: 'Failure', effect: 'No pattern formed — gain 5 Threads', requirement: 'None of the above patterns achieved' }
          ]
        },
        threadsOfDestiny: {
          generation: 'Failure to form pattern: +5 Threads',
          usage: 'Spend Threads to call cards BEFORE drawing the 13 (standard call card rules, once per turn — plan ahead across multiple turns)'
        },
        cardDraw: {
          cards: 13,
          description: 'Draw 13 cards as Tapestry. Achieve a pattern to rewrite destiny.'
        }
      },

      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },

      tags: ['cards', 'utility', 'ultimate', 'fate control', 'level 10', 'fate weaver']
    },

    {
      id: 'fate_weaver_deck_of_many_things',
      name: 'Deck of Many Things',
      description: 'Summon the legendary Deck. Draw 1-3 cards (your choice). Each card has a major effect — some miraculous, some catastrophic. Every catastrophic card generates 3 Threads. Spend 5 Threads to redraw one catastrophic card.',
      level: 10,
      spellType: 'ACTION',
      icon: 'Utility/Utility',

      typeConfig: {
        school: 'conjuration',
        icon: 'Utility/Utility',
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
        components: ['somatic'],
        somaticText: 'Summon the legendary deck'
      },

      resolution: 'CARDS',
      effectTypes: ['variable'],

      rollableTable: {
        enabled: true,
        name: 'Deck of Many Things — Draw Results',
        description: 'Draw 1-3 cards. Each has a major effect.',
        resolutionType: 'CARDS',
        resolutionConfig: { cardType: 'deck_of_many_things', cardCount: 3 },
        entries: [
          { range: 'Sun', effect: 'Gain 50,000 XP and a wondrous item', threadGeneration: 0 },
          { range: 'Moon', effect: 'Granted 1d3 wishes', threadGeneration: 0 },
          { range: 'Star', effect: 'Increase one ability score by 2', threadGeneration: 0 },
          { range: 'Throne', effect: 'Gain a keep and +6 Persuasion', threadGeneration: 0 },
          { range: 'Key', effect: 'Gain a rare magic weapon', threadGeneration: 0 },
          { range: 'Knight', effect: 'Gain a 4th-level fighter follower', threadGeneration: 0 },
          { range: 'Gem', effect: 'Gain 50,000gp in gems', threadGeneration: 0 },
          { range: 'Comet', effect: 'Defeat the next monster alone to gain a level', threadGeneration: 0 },
          { range: 'Fates', effect: 'Can undo one event as if it never happened', threadGeneration: 0 },
          { range: 'Balance', effect: 'Alignment changes to opposite', threadGeneration: 0 },
          { range: 'Jester', effect: 'Gain 10,000 XP or draw two more cards', threadGeneration: 0 },
          { range: 'Euryale', effect: '-2 to all saving throws permanently (curse) — gain 3 Threads', threadGeneration: 3 },
          { range: 'Rogue', effect: 'An NPC ally becomes hostile — gain 3 Threads', threadGeneration: 3 },
          { range: 'Idiot', effect: 'Intelligence reduced by 1d4+1 permanently — gain 3 Threads', threadGeneration: 3 },
          { range: 'Donjon', effect: 'Imprisoned in an extradimensional space — gain 3 Threads', threadGeneration: 3 },
          { range: 'Ruin', effect: 'All nonmagical possessions destroyed — gain 3 Threads', threadGeneration: 3 },
          { range: 'Skull', effect: 'Summons an Avatar of Death to fight you — gain 3 Threads', threadGeneration: 3 },
          { range: 'Flames', effect: 'A powerful devil becomes your enemy — gain 3 Threads', threadGeneration: 3 },
          { range: 'Talons', effect: 'All magic items destroyed — gain 3 Threads', threadGeneration: 3 },
          { range: 'Void', effect: 'Soul imprisoned; body incapacitated — gain 3 Threads', threadGeneration: 3 },
          { range: 'The Fool', effect: 'Lose 10,000 XP; draw again — gain 3 Threads', threadGeneration: 3 },
          { range: 'Vizier', effect: 'Know the answer to your next dilemma', threadGeneration: 0 }
        ]
      },

      specialMechanics: {
        threadsOfDestiny: {
          generation: 'Each catastrophic card: +3 Threads',
          usage: 'Spend 5 Threads to redraw one catastrophic card'
        }
      },

      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },

      tags: ['cards', 'variable', 'random', 'legendary', 'ultimate', 'level 10', 'fate weaver', 'rollable table']
    },

    {
      id: 'fate_weaver_casino_royale',
      name: 'Casino Royale',
      description: 'Transform the battlefield into a grand casino. Draw a card for each creature in range — their card determines the game they must play for 1 minute:\n**Hearts**: Must play Heart\'s Gamble each turn (draw until non-heart, take damage from hearts, buff from others)\n**Spades**: Must play War of Wills each turn (challenge another creature, winner deals damage)\n**Diamonds**: Must play Blackjack each turn (hit or stand, bust = self-damage)\n**Clubs**: Must play Solitaire each turn (form patterns or take penalty)\nYou are the House. You always draw first and choose your game. +2 Threads at the start of each of your turns.',
      level: 10,
      spellType: 'ACTION',
      icon: 'Radiant/Divine Radiance',

      typeConfig: {
        school: 'illusion',
        icon: 'Radiant/Divine Radiance',
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
        resourceValues: { mana: 90 },
        actionPoints: 3,
        components: ['verbal', 'somatic'],
        verbalText: 'WELCOME TO MY CASINO!',
        somaticText: 'Grand sweeping gesture'
      },

      resolution: 'CARDS',
      effectTypes: ['utility', 'control'],

      zoneConfig: {
        duration: 1,
        durationUnit: 'minutes',
        effects: ['casino_rules'],
        movable: false,
        size: { radius: 100 }
      },

      specialMechanics: {
        casinoRoyale: {
          description: 'All creatures are assigned a card game based on suit drawn. They must play their game each turn.',
          youAreTheHouse: 'You always draw first and choose your game. +2 Threads at the start of each of your turns.'
        },
        threadsOfDestiny: {
          generation: '+2 Threads at start of each of your turns while Casino Royale is active',
          usage: 'None — the Casino generates Threads passively'
        },
        cardDraw: {
          description: 'Draw 1 card per creature. Suit determines their forced game.'
        }
      },

      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },

      tags: ['cards', 'zone', 'control', 'gambling', 'ultimate', 'level 10', 'fate weaver']
    }
  ]
};
