/**
 * Oracle Class Data
 *
 * Complete class information for the Oracle - a diviner who sees past, present, and future
 * through the Prophetic Vision resource system.
 */

export const ORACLE_DATA = {
  id: "oracle",
  name: "Oracle",
  icon: "fas fa-eye",
  role: "Support/Utility (Divination & Fate Manipulation)",
  damageTypes: ["psychic", "force"],

  // Overview section
  overview: {
    title: "The Oracle",
    subtitle: "Seer of Truths and Weaver of Destiny",

    quickOverview: {
      title: "Quick Overview",
      content: `**What You Need to Know**: Oracles peer through the veil of time, declaring predictions about combat events and rewarded with Prophetic Visions when proven right—visions they then spend to twist fate itself.

**Core Mechanic**: Declare Prediction → Correct Outcome → Gain Prophetic Visions → Spend Visions to Force Rerolls, Buff Allies, or Unleash Divination Magic

**Resource**: Prophetic Visions (0–10 scale, gained from accurate predictions and witnessing fate)

**Playstyle**: Tactical prediction-based support

**Best For**: Players who love reading the battlefield, making bold calls, and turning foresight into devastating tactical advantage`,
    },

    description: `Oracles pierce the veil between past, present, and future. They declare bold predictions about combat — and when proven right, are rewarded with Prophetic Visions they spend to twist fate itself.`,

    roleplayIdentity: {
      title: "Roleplay Identity",
      content: `Oracles are enigmatic seers who speak in riddles and prophecies. They see connections others miss, perceive hidden motives, and sense the weight of destiny on individuals and events. Some are blessed by divine visions, others cursed with unwanted foresight. They might be:

**The Blind Seer**: Physical blindness traded for supernatural sight
**The Dream Walker**: Receiving visions through dreams and trances
**The Omen Reader**: Interpreting signs in nature, cards, bones, or stars
**The Fate Touched**: Born with the gift (or curse) of prophecy
**The Truth Seeker**: Dedicated to uncovering hidden knowledge

Oracles often struggle with the burden of knowledge - seeing tragedies before they occur, knowing secrets that could destroy relationships, or being unable to change what they foresee. They speak cryptically, not from arrogance, but because the future is fluid and speaking too plainly might alter it.`,
    },

    combatRole: {
      title: "Combat Role",
      content: `In combat, Oracles are tactical support specialists who excel at:

**Prediction & Preparation**: Foreseeing enemy actions and granting allies advantage
**Information Warfare**: Revealing enemy weaknesses, hidden threats, and tactical opportunities
**Fate Manipulation**: Forcing rerolls, altering outcomes, and bending probability
**Debuff & Control**: Cursing enemies with ill omens and prophesied doom
**Utility & Revelation**: Detecting traps, seeing through illusions, and uncovering secrets

      Oracles are not direct damage dealers but force multipliers who make their allies more effective and their enemies less so. They shine in complex encounters where information and tactical advantage matter more than raw damage.`,
    },

    whatOracleIsNot: {
      title: "What the Oracle Is NOT",
      content: `**Not a Damage Dealer**: Your damage output is low. You empower allies to deal damage, not do it yourself.

**Not a Healer**: You have no healing abilities. Bring a dedicated healer or rely on potions.

**Not a Tank**: You have light armor and low HP. Your survival comes from foresight (dodging, forcing rerolls, placing Fate Triggers) — not from absorbing hits.

**Not Passive**: Every turn requires a decision — predict, spend Visions, or position for Witnessing Fate. An Oracle who does nothing contributes nothing.

**Not Random**: Your power comes from accurate predictions and smart Vision spending, not from luck. A skilled Oracle is the most consistent force on the battlefield.`,
    },

    playstyle: {
      title: "Playstyle",
      content: `Oracles reward players who:

**Think Ahead**: Make predictions about combat outcomes and enemy actions
**Pay Attention**: Notice patterns, remember details, and connect information
**Take Risks**: Spend Visions on bold predictions for greater rewards
**Support Allies**: Focus on making the party more effective rather than personal glory
**Embrace Mystery**: Enjoy cryptic abilities and uncertain outcomes

The class has a unique prediction mechanic where you declare what you think will happen (e.g., "The enemy will miss their next attack" or "Our fighter will land a critical hit") and gain bonuses if your prediction proves true. This creates engaging gameplay where you're constantly reading the battlefield and making tactical forecasts.`,
    },

    immersiveCombatExample: {
      title: "Combat Example: The Fateseer's Gambit",
      content: `**The Setup**: You're an Oracle (Fateseer specialization) facing a group of assassins (3 assassins + 1 assassin master). Your party is with you. Starting Prophetic Visions: 3 (baseline). Starting Mana: 50/60. Your goal: Make predictions about combat events, gain Visions when correct, then spend Visions to twist fate and turn the tide of battle.

**Starting State**: Prophetic Visions: 3/10 | Mana: 50/60 | HP: 55/55

---

**Turn 1 — First Prediction (Visions: 3 → 4)**

*The assassins emerge from the shadows, blades drawn. You close your eyes and SEE. The future unfolds before you like a tapestry.*

**Your Action (1 AP)**: Make a Simple Prediction
**Prediction**: "The assassin master will attack our tank next turn."

*You open your eyes. "The master will strike our tank. Be ready."*

**Assassin #1's Turn**: Attacks your mage → [16] → Hit! → 2d6+3 → [5, 4] + 3 = 12 damage

**Assassin Master's Turn**: Attacks your tank → [18] → Hit! → 3d6+5 → [6, 5, 4] + 5 = 20 damage

*Your prediction was CORRECT. The master attacked the tank.*

**Prediction Result**: CORRECT! → +1 Prophetic Vision (Simple)
**Prophetic Visions**: 3 + 1 = **4/10**

**Fateseer Passive — Premonition**: Your prediction was correct! Spend 1 Vision to apply a fate effect immediately.
**Choice**: Subtract 1d6 from the assassin master's next attack roll.
**Cost**: 1 Vision

*You whisper a single word. The assassin master's next strike will falter—you've seen it, and now you've woven it.*

**Prophetic Visions**: 4 - 1 = **3/10**

**Your Action**: Cast **Divine Insight** on Assassin Master (1 AP, 10 mana)
**Effect**: All allies gain +2 to attack rolls against target for 3 rounds

*You fix your gaze on the master. "I see how you move. Your patterns are mine."*

**Mana**: 50 - 10 = 40/60

**Current State**: Visions: 3/10 | Mana: 40/60

---

**Turn 2 — Witnessing Fate (Visions: 3 → 6)**

**Your Party's Tank**: Attacks Assassin #1 → [20] → **CRITICAL HIT!** → 4d8+5 → [7, 8, 6, 7] + 5 = 33 damage → Assassin #1 DEAD

*A critical hit occurs within 30 feet of you. You WITNESS the threads of fate aligning.*

**Witnessing Fate**: Natural 20 within 30 ft → +1 Prophetic Vision
**Prophetic Visions**: 3 + 1 = **4/10**

**Your Action (1 AP)**: Make a Moderate Prediction
**Prediction**: "The assassin master's next attack will miss."

*You speak with certainty. "The master's blade will find only air."*

**Assassin Master's Turn**: Attacks your tank
**Attack Roll**: d20+7 → [9] → 9 + 7 = 16 → Miss! (tank's Armor is 17)

*The assassin master's blade swings wide—just as you predicted. Your Premonition from last turn subtracted 1d6, but it wasn't even needed. Fate agreed with you.*

**Prediction Result**: CORRECT! → +2 Prophetic Visions (Moderate)
**Prophetic Visions**: 4 + 2 = **6/10**

**Fateseer Passive — Premonition**: Correct prediction! Spend 1 Vision for an immediate fate effect.
**Choice**: Grant your tank advantage on their next attack.
**Cost**: 1 Vision

**Prophetic Visions**: 6 - 1 = **5/10**

**Your Party's Mage**: "You... you KNEW he would miss?"
**You**: "I saw it. The future is clear to me."

**Current State**: Visions: 5/10 | Mana: 40/60

---

**Turn 3 — Altering Fate (Visions: 5 → 2)**

*Assassin #2 attacks your mage. She's at 20 HP—this could kill her.*

**Assassin #2's Turn**: Attacks your mage → [18] → Hit! → 2d6+3 → [6, 5] + 3 = 14 damage

*Your mage drops to 6 HP. She's barely standing. But you saw this moment before combat even began—you have a Fate Trigger prepared.*

**Fate Trigger** (pre-placed earlier): "When an ally drops below 10 HP, they gain +4 Armor until end of round."
**Cost**: Already paid (2 Visions)
**Result**: Mage's Armor becomes 15 + 4 = 19. The attack that "hit" now MISSES.

*You raise your hand. "No. That is not how this ends. I placed this thread before the fight began."*

*The assassin's blade deflects off invisible force. Your mage stands, unharmed.*

**Your Party's Mage**: "I... I should be dead."
**You**: "I placed a fate trigger before combat. When you fell below 10 HP, my woven thread caught you."

**Your Action (Reaction)**: Cast **Twist Fate** on Assassin #2's next roll (1 AP, 2 Visions)
**Effect**: Add or subtract 1d6 from the target's next roll—you choose after seeing the result.

*You reach into the timestream and twist. "Your next roll belongs to me."*

**Prophetic Visions**: 5 - 2 = **3/10**

**Your Action**: Cast **Divine Insight** on Assassin #2 (1 AP, 10 mana)
**Effect**: All allies gain +2 to attack rolls against target for 3 rounds

**Mana**: 40 - 10 = 30/60

**Current State**: Visions: 3/10 | Mana: 30/60

---

**Turn 4 — Grand Prediction (Visions: 3 → 7)**

**Your Action (1 AP)**: Make a Grand Prediction
**Prediction**: "Our tank will land a critical hit on the assassin master this turn."

*You speak with absolute certainty. "The master will fall to our tank's blade. I have SEEN it."*

**Your Party's Tank's Turn**: Attacks Assassin Master (has advantage from Premonition, +2 from Divine Insight)
**Attack Roll**: d20+6 with ADVANTAGE → [19, 12] → Take 19 → **CRITICAL HIT!** (19-20 crit range)
**Damage**: 2d8+5 → [8, 7] + 5 = 20 damage → DOUBLED = 40 damage
**Total Damage**: **40!**

*The tank's blade strikes PERFECT. The assassin master staggers, mortally wounded.*

**Assassin Master**: 42 HP remaining → 2 HP (barely alive)

**Prediction Result**: CORRECT! → +3 Prophetic Visions (Grand)
**Prophetic Visions**: 3 + 3 = **6/10**

**Witnessing Fate**: Natural 20 within 30 ft → +1 Prophetic Vision
**Prophetic Visions**: 6 + 1 = **7/10**

**Fateseer Passive — Premonition**: Correct prediction! Spend 1 Vision for immediate fate effect.
**Choice**: Force the assassin master to reroll his next attack with disadvantage.
**Cost**: 1 Vision

**Prophetic Visions**: 7 - 1 = **6/10**

**Your Party's Tank**: "I've never struck that true. That was YOUR doing?"
**You**: "I saw it. I predicted it. And my Premonition made sure fate delivered."

**Current State**: Visions: 6/10 | Mana: 30/60

---

**Turn 5 — Rewriting Fate (Visions: 6 → 1)**

*The assassin master, barely alive, lunges at your mage. You predicted he would attack—you were right.*

**Assassin Master's Turn**: Attacks your mage (rerolling with disadvantage from Premonition)
**Attack Roll**: d20+7 with DISADVANTAGE → [4, 11] → Take 4 → 4 + 7 = 11 → Miss! (mage's Armor is 15)

*Your Premonition ensured he would miss. Now you end this.*

**Your Action**: Cast **Fate Strike** on Assassin Master (1 AP, 22 mana)
**Effect**: 5d8 force damage, guaranteed to hit—no attack roll needed

*You point at the dying master. "Your fate was sealed the moment I saw it."*

**Damage**: 5d8 → [6, 7, 5, 8, 4] = 30 force damage

**Assassin Master**: DEAD

*The assassin master crumples. Two remain.*

**Mana**: 30 - 22 = 8/60

**Assassin #2's Turn**: Attacks your tank → [14] → 14 + 5 = 19 → Hit! → 8 damage
*But you have Twist Fate active! You choose to subtract 1d6 from the roll.*
**Twist Fate**: Subtract [4] → 19 - 4 = 15 → Now MISSES! (tank's Armor is 17)

*The blade veers off course—your Twist Fate pulled it aside at the last moment.*

**Your Action (1 AP)**: Simple Prediction — "Assassin #3 will flee."
*Assassin #3, seeing the master fall, bolts for the door.*

**Prediction Result**: CORRECT! → +1 Prophetic Vision
**Prophetic Visions**: 6 + 1 = **7/10**

*But you're not letting him escape. You spend 3 Visions.*

**Your Action**: Cast **Twist Fate** as a reaction on Assassin #3's Agility check to open the door (2 Visions)
**Effect**: Subtract 1d6 → [5] from their check. They fail to open the door.

*The assassin claws at the handle. You've seen this moment—you twist fate, and the door stays shut.*

**Prophetic Visions**: 7 - 2 = **5/10**

**Assassin #2**, surrounded, surrenders.

**Combat Over**

*You lower your hands. Your eyes stop glowing. The battlefield is silent.*

**Your Party's Mage**: "You saved me twice. The fate trigger when I would have died, and the Twist Fate that made the master miss."
**You**: "I foresaw both moments before combat began. I placed a Fate Trigger for your survival, and used Premonition to turn my correct predictions into immediate fate effects. Every time I was right, I got to twist reality."
**Your Party's Tank**: "And that guaranteed hit—Fate Strike—on the master?"
**You**: "5d8 force damage. No roll needed. I SAW him die. Fate just needed a push."
**Your Party's Rogue**: "How many Visions do you have now?"
**You**: "Five. I started with 3, gained 8 through correct predictions, witnessing fate, and Premonition triggers, spent 6 total. I'll reset to 3 at our next long rest."

**Final State**: Visions: 5/10 | Mana: 8/60 | HP: 55/55

---

**The Lesson — How the Fateseer Oracle Plays**:

1. **Predict** → Made 4 predictions (Simple, Moderate, Grand, Simple). Gained 1/2/3/1 Visions when correct.
2. **Witness Fate** → Gained +1 Vision each time a Natural 20 occurred within 30 ft (2 crits = +2 Visions).
3. **Premonition (Fateseer Passive)** → Each correct prediction let me spend 1 Vision for a free fate effect: subtract 1d6 from an enemy, grant advantage, force disadvantage. This is the Fateseer's engine—accuracy fuels manipulation.
4. **Fate Triggers** → Pre-placed conditional effects ("When X happens, Y occurs") that fire automatically. I placed one before combat that saved the mage.
5. **Twist Fate (Reaction Spell)** → Spend 2 Visions to add/subtract 1d6 from any roll after seeing the result. I used it to turn a hit into a miss and to stop a fleeing enemy.
6. **Fate Strike (Universal Spell)** → Guaranteed 5d8 damage for 22 mana. When I need something dead without trusting the dice.
7. **Vision Economy**: Started with 3, gained 8, spent 6, ended with 5. The key insight: correct predictions feed your fate manipulation through Premonition, creating a virtuous cycle.

**You're not a damage dealer. You're a FATESEER.** You predict outcomes, and when you're right, fate itself bends to your will. The Fateseer's unique power is that every correct prediction isn't just a reward—it's an opportunity to immediately reshape reality. Predict accurately, and you become the most powerful force on the battlefield. Predict poorly, and you're vulnerable. Skill matters more than luck. Read the battlefield. See the future. Make it real.`,
    },
  },

  characterCreation: {
    title: "Creating an Oracle",
    subtitle: "Opening the Third Eye",

    abilityPriorities: {
      primary: "Spirit",
      primaryDesc:
        "Powers your Prophetic Visions, determines spell save DCs, and fuels your divination magic — your most important stat.",
      secondary: "Intelligence",
      secondaryDesc:
        "Boosts psychic damage on spells like Future Strike and Past Sins, and supports investigation/lore skills.",
      tertiary: "Constitution",
      tertiaryDesc:
        "Survivability. You are frontline-adjacent (30ft for Witnessing Fate) with light armor — every HP counts.",
    },

    startingEquipment: {
      weapons: [
        {
          name: "Choose: Oracle's Divination Staff OR Crystal Focus",
          damage:
            "Staff: 1d6 psychic (two-handed) / Focus: 1d4 psychic (one-handed)",
          properties:
            "Divination Staff grants +2 Spirit, +1 INT. Crystal Focus allows off-hand Scrying Orb for +2 INT.",
        },
      ],
      armor: [
        {
          name: "Prophetic Robes",
          ac: "1 + DEX mod",
          properties:
            "Cloth armor. Grants +2 Spirit, +1 INT. Light but enchanted for arcane defense.",
        },
      ],
      accessories: [
        {
          name: "Choose 1",
          options: [
            "Necklace of Fate (+1 Spirit, +1 INT)",
            "Oracle's Tarot Deck (tool — grants advantage on fortune-telling checks, 1 free Simple Prediction per day)",
          ],
        },
      ],
      gear: [
        "Divination tools (crystal, cards, or bones)",
        "Traveler's clothes with a dark hood",
        "Pouch with 10 gold pieces",
        "A journal for recording predictions and their outcomes",
      ],
      note: "Position within 30ft of allies to maximize Witnessing Fate triggers (Natural 20s and 1s). Your Prophetic Visions reset to 3 at each long rest.",
    },

    startingStats: {
      hp: "8 + Constitution modifier",
      hitDice: "1d8 per Oracle level",
      armorClass: "1 + DEX modifier (Prophetic Robes)",
      speed: "30 ft",
      savingThrows: ["Spirit", "Intelligence"],
      skills: [
        "Choose 3 from: Arcana, History, Insight, Investigation, Perception, Religion",
      ],
    },

    startingAbilities: [
      {
        name: "Third Eye",
        description:
          "See invisible creatures/objects within 30ft, advantage on Insight checks, detect lies, start each long rest with 3 Prophetic Visions.",
      },
      {
        name: "Fate's Whisper Strike",
        description:
          "Basic attack: 1d4 psychic damage + INT mod. Costs no resources. Grants +1 Vision on hit.",
      },
      {
        name: "Forecast Dice",
        description:
          "Roll 5 chosen dice at day start. Spend to replace any roll. Unused dice incur Fate's Burden.",
      },
    ],
  },

  // Resource System
  resourceSystem: {
    title: "Prophetic Visions",
    subtitle: "The Eye of Fate & The Prediction Engine",

    description: `Oracles generate Prophetic Visions by reading the flow of time and declaring predictions about combat. These visions allow them to reach into the timeline and manually reweave fate, forcing rerolls and altering outcomes in real-time.`,

    cards: [
      {
        title: "The Eye of Prophecy (0–10)",
        stats: "10 Vision Max | +1 per Turn",
        details:
          "A mystical eye UI tracks your foresight. It glows brighter as your clarity increases, granting reality-warping power at higher tiers.",
      },
      {
        title: "Prediction Engine",
        stats: "Simple / Moderate / Grand",
        details:
          "Declare what will happen next. Correct forecasts grant 1–3 Visions immediately, rewarding tactical insight over blind luck.",
      },
      {
        title: "Fate Manipulation",
        stats: "Force Rerolls | Alter Results",
        details:
          "Spend Visions as a Reaction to force enemies to reroll or grant allies advantage. You are the ultimate tactical safety net.",
      },
      {
        title: "Forecast Dice",
        stats: "5 Dice at Day Start | Swap Any Roll",
        details:
          "At the start of each day, roll 5 dice of your choosing (any combination of d4, d6, d8, d10, d12, d20). Bank the results. During the day, spend a forecast die to replace any die roll result with the banked value. Unused dice cause Fate's Burden.",
      },
    ],

    generationTable: {
      headers: ["Action/Event", "Vision Gain", "Notes"],
      rows: [
        [
          "Fate's Whisper",
          "+1 per Turn",
          "Passive floor (only while at 5 or fewer Visions)",
        ],
        ["Simple Prediction", "+1 Vision", 'e.g., "The next attack will hit"'],
        [
          "Moderate Prediction",
          "+2 Visions",
          'e.g., "The boss will cast a spell next turn"',
        ],
        [
          "Grand Prediction",
          "+3 Visions",
          'e.g., "Our rogue will crit this turn"',
        ],
        [
          "Witnessing Fate",
          "+1 Vision",
          "Triggers on any Natural 20 or Natural 1 within 30 ft",
        ],
        [
          "Revealing Truth",
          "+1 Vision",
          "Use divination to expose hidden traps/lies",
        ],
        ["Long Rest", "Reset to 3", "Baseline prophetic insight level"],
      ],
    },

    forecastDice: {
      title: "Forecast Dice",
      subtitle: "The Oracle's Unique Ability",
      description: `At the start of each day (after a long rest), the Oracle rolls **5 Forecast Dice** of their own choosing. You may select any combination of dice types (d4, d6, d8, d10, d12, d20) — for example, 2d6 + 1d8 + 1d10 + 1d20. The results are **banked** and can be spent throughout the day to replace any single die roll with a forecast die result.`,
      rules: [
        "**Rolling**: At the start of each day, choose your 5 dice and roll them. Record each result separately (e.g., d6=4, d6=2, d8=7, d10=3, d20=14).",
        "**Spending**: At any point during the day, you may spend one forecast die to replace the result of ANY die roll — yours, an ally's, or an enemy's. This includes attack rolls, damage rolls, saving throws, ability checks, and healing rolls.",
        '**Declaration**: You must declare the swap BEFORE the result is applied. "I swap my forecast d8 showing 7 for this attack roll."',
        "**One-for-One**: Each forecast die can only be used once. Once spent, it is consumed.",
        "**Timing**: You can use forecast dice in combat, during skill challenges, social encounters, or any other situation involving die rolls.",
        "**Strategic Choice**: Choosing your dice types is a strategic decision. d20s give you wide-range replacement potential but are risky (you might roll low). d4s and d6s are more reliable for guaranteeing minimum values.",
      ],
      exampleLoadouts: [
        {
          name: "The Safety Net",
          dice: "5d6",
          strategy:
            "Reliable mid-range swaps. Good for turning misses into hits or guaranteeing damage.",
        },
        {
          name: "The Critical Fisher",
          dice: "2d20 + 3d4",
          strategy:
            "Fish for natural 20s on the d20s. Use d4s for small but guaranteed adjustments.",
        },
        {
          name: "The Balanced Oracle",
          dice: "2d8 + 2d6 + 1d12",
          strategy:
            "Mix of range sizes for versatile swap options throughout the day.",
        },
      ],
      fatesBurden: {
        title: "Fate's Burden",
        description: `If you reach the end of the day (next long rest) with unused Forecast Dice, you suffer **Fate's Burden**: a stacking penalty of **-1 to all d20 rolls per 2 unused forecast dice** (rounded down), carried to the next day. Maximum penalty is -3.`,
        rules: [
          "**Penalty**: Each 2 unused forecast dice = -1 to ALL d20 rolls (attacks, saves, checks, death saves) the following day. Round down (1 unused die = 0 penalty).",
          "**Stacking**: If you have 3 unused dice, you suffer -1. If you have 5 unused dice, you suffer -2.",
          "**Cap**: Maximum Fate's Burden is -3. Any dice beyond 6 unused do not increase the penalty further.",
          "**Clearing**: Fate's Burden clears at your NEXT long rest. During the burdened day, you still roll new forecast dice normally.",
          "**Philosophy**: The Oracle foresaw these outcomes and failed to act. The weight of unfulfilled prophecy drags at your sight.",
        ],
      },
    },

    usage: {
      momentum:
        'Use Simple Predictions to steadily climb to 5+ Visions. Once your Eye is bright, you have the "Fate Bank" to save allies from lethal critical hits.',
      flourish:
        "⚠️ Prediction AP: Predictions cost 1 Action Point (0 AP for Seers). Always leave 1 AP in your tank if you need to generate Visions for a big turn.",
    },

    overheatRules: {
      title: "Prophetic Clarity",
      content: `Your current Vision level determines the intensity of your connection to the timestream:

**👁️ Maximum Foresight (9–10 Visions)**:
- **Status**: Omniscient Sight.
- **Effect**: The Eye of Prophecy blazes gold. You can see the ethereal "Fate Threads" connecting all combatants. Once per round as a reaction, you may spend 1 Vision to add +2 to your AC against one attack.

**👁️ High Insight (6–8 Visions)**:
- **Status**: Prophetic Clarity.
- **Effect**: silver-blue light radiates from your irises. You have enough reserve to use "Twist Destiny" (5 Visions) to completely change a hit to a miss.

**👁️ Moderate Insight (3–5 Visions)**:
- **Status**: Clear Sight.
- **Effect**: Soft blue glow. This is your safe zone for using Reactions like "Force Reroll" (3 Visions).

**👁️ Low Insight (0–2 Visions)**:
- **Status**: Limited Foresight.
- **Effect**: Dim light. You are vulnerable and must focus on basic predictions to rebuild your connection to the future.`,
    },

    strategicConsiderations: {
      title: "Combat Phases & Prediction Logic",
      content: `**Phase 1: Calibration (0-3 Visions)**: Focus on high-probability Simple Predictions. Predict that your tank will be attacked or that your mage will cast a spell. Build your bank.

**Phase 2: Manipulation (4-7 Visions)**: This is your active zone. Hold 3 Visions at all times for a "Force Reroll" Reaction to save a squishy ally. Use Moderate Predictions to replace spent Visions.

**Phase 3: Rewriting (8-10 Visions)**: Unleash Grand Prophecies. With 10 Visions, you can activate "Divine Intervention" to rewrite an entire round of combat.

**The Witnessing Loop**: Positioning is key. Stay within 30ft of the frontline. You gain +1 Vision every time *anyone* (ally or enemy) rolls a Natural 20 or Natural 1. The more chaotic the fight, the faster you gain power.

**Prediction Pro-Tip**: Coordinate with your team. If the Rogue tells you they are going to use their "Hidden Blade" for a crit attempt, make that your Grand Prediction. You guarantee the payoff for both of you.

**Prediction Adjudication**: Predictions are ruled by the GM. A prediction is "correct" if the predicted event occurs within the stated timeframe, even if minor details differ. Example: Predicting "the boss will cast a spell" is correct regardless of which spell. GMs should aim to reward creative, specific predictions over vague ones.`,
    },

    playingInPerson: {
      title: "Playing Oracle In Person",
      content: `**Required Materials**:
- **10 Ethereal Tokens** (Glass beads or silver coins for Visions)
- **Prediction Cards** (Index cards or sticky notes)
- **Fate Die** (A distinct d20 for forced rerolls)

**Tactile Tracking**:
1. **The Eye**: Arrange your 10 tokens in a circle (an "Eye") on the table.
2. **Declaring**: When you make a prediction, write it on a sticky note and place it in the center of your token circle.
3. **Resolving**: When the event happens, if you were right, move 1–3 tokens from your "Reserve" into the "Eye."

**The "Fate Thread" Hack**:
Use a silver string or measuring tape. Any critical event within 30ft of your miniature grants you +1 Vision. Having a physical 30ft marker helps you stay in the "Witnessing" pocket without constantly asking the DM for distances.`,
    },
  },

  // Specializations
  specializations: {
    title: "Oracle Specializations",
    subtitle: "Three Paths of Prophetic Mastery",

    description: `Oracles can specialize in different aspects of divination and fate manipulation. Seers focus on future sight and prediction, Truthseekers weaponize hidden knowledge through Reveal/Expose/Exploit, while Fateseers manipulate outcomes through prediction-conditional fate alteration.`,

    passiveAbility: {
      name: "Third Eye",
      description:
        "All Oracles can see invisible creatures and objects within 30 feet, have advantage on Insight checks, and can detect when someone is lying to them (though not what the truth is). You also start each long rest with 3 Prophetic Visions.",
    },

    specs: [
      {
        id: "seer",
        name: "Seer",
        icon: "Utility/Watchful Eye",
        color: "#9370DB",
        theme: "Future Sight & Prediction Mastery",

        description: `Seers glimpse possible futures and guide allies toward the best outcomes. Their predictions are more accurate and rewarding, making them invaluable tactical advisors.`,

        playstyle:
          "Prediction focus, future sight, tactical foresight, ally guidance",

        strengths: [
          "Gain bonus Visions from correct predictions (+1 per prediction)",
          "Can make predictions for 0 AP (free) instead of 1 AP",
          "See 3 seconds into the future, granting advantage on initiative",
          "Predictions have longer duration and can stack",
        ],

        weaknesses: [
          "Abilities focused on prediction rather than direct power",
          "Requires accurate forecasting to be effective",
          "Less useful when facing completely unpredictable enemies",
          "Minimal direct damage output",
        ],

        specPassive: {
          name: "Prophetic Clarity",
          description:
            "Correct predictions grant +1 Vision. Make 1 free prediction per round (0 AP). Correct specific/precise predictions let you immediately predict again for free.",
        },

        keyAbilities: [
          "Foresight: See 6 seconds into the future, gaining advantage on your next action (2 Visions)",
          "Shared Vision: Grant an ally advantage on their next roll by showing them the future (1 Vision)",
          "Inevitable Outcome: Declare an attack will hit or miss - it does (5 Visions, once per long rest)",
        ],

        recommendedFor:
          "Players who enjoy tactical planning and making accurate predictions",
      },

      {
        id: "truthseeker",
        name: "Truthseeker",
        icon: "Radiant/Radiant Beam",
        color: "#FFD700",
        theme: "Information Warfare & Exposed Weakness",

        description: `Truthseekers don't just uncover secrets—they weaponize them. They pierce through enemy defenses, expose hidden weaknesses, and strip away every advantage their opponents thought they had. In combat: Reveal → Expose → Exploit. Out of combat: unmatched investigation and revelation.`,

        playstyle:
          "Information warfare, enemy debilitation, weakness exploitation, unmatched out-of-combat investigation",

        strengths: [
          "See enemy HP, buffs, resistances, and active cooldowns mid-combat",
          "Strip enemy buffs, immunities, and concealment",
          "Expose vulnerabilities that grant allies advantage and bonus damage",
          "Unmatched out-of-combat investigation (detect lies, read objects, see through illusions)",
          "Gain Visions from uncovering secrets (1 per revelation)",
        ],

        weaknesses: [
          "Relies on enemies having secrets to expose (less effective against mindless foes)",
          "Limited direct damage—empowers allies instead",
          "Requires an action to study enemies before exploiting weaknesses",
          "Out-of-combat abilities don't help in pure slugfests",
        ],

        mindlessFallback:
          "Against mindless or instinct-driven creatures (undead, constructs, beasts), Unmask and Reveal Weakness instead reveal type-based vulnerabilities: undead take +1d6 radiant from your allies, constructs suffer +1d6 force, beasts grant allies advantage on intimidation checks.",

        specPassive: {
          name: "All-Seeing Eye",
          description:
            "Auto-detect lies, illusions, and hidden creatures within 30 ft. Gain 1 Vision when revealing a hidden truth. In combat: when you use an action to study a creature, you see its HP, active buffs, resistances, and abilities on cooldown.",
        },

        keyAbilities: [
          "Unmask: Strip one buff or immunity from a studied target (2 Visions)",
          "Reveal Weakness: Expose a target's vulnerability—attacks against them gain advantage and deal +1d6 damage for 3 rounds (3 Visions)",
          "Exploit Truth: Deal psychic damage to a target equal to the number of debuffs currently affecting them ×2d6 (4 Visions)",
        ],

        combatLoop:
          "Study enemy (learn secrets) → Unmask (strip buffs) → Reveal Weakness (expose vulnerability) → Allies exploit the exposed target",

        recommendedFor:
          "Players who love turning knowledge into power, dismantling enemy strategies, and making allies devastating",
      },

      {
        id: "fateseer",
        name: "Fateseer",
        icon: "Arcane/Ebon Blaze",
        color: "#FF1493",
        theme: "Prediction-First Fate Manipulation",

        description: `Fateseers don't blindly twist probability—they SEE the future first, then reshape what they've foreseen. Every fate manipulation must flow through a prediction. You cannot alter what you haven't foreseen. This is what separates you from a Fate Weaver: they manipulate chance blindly; you manipulate fate through foresight.`,

        playstyle:
          "Predict outcomes → Spend Visions to reshape what you predicted → Set fate triggers for future events",

        strengths: [
          "Fate manipulation is gated through correct predictions (rewarding accuracy)",
          'Can pre-place "fate triggers" — conditional effects that fire when predicted events occur',
          "Echo correct predictions to repeat their effects",
          "Strongest late-game fate control when prediction accuracy is high",
        ],

        weaknesses: [
          "Cannot manipulate fate without first predicting it—vulnerable when predictions fail",
          "Requires prediction accuracy to unlock manipulation (high skill ceiling)",
          "Less immediate impact than specs that don't depend on predictions",
          "Burns through Visions quickly when manipulating multiple fate threads",
        ],

        failedPredictionFallback:
          "On a failed prediction, you still gain 1 Vision as a consolation — but you cannot trigger Premonition or use prediction-conditional abilities until your next correct prediction. This prevents total dead turns from bad luck.",

        specPassive: {
          name: "Premonition",
          description:
            "Once per round, when one of your predictions resolves as correct, you may spend 1 Vision to immediately apply one fate effect (reroll, ±1d6, or advantage/disadvantage) related to that prediction. This fate manipulation is free from action point cost.",
        },

        keyAbilities: [
          'Fate Trigger: Spend 2 Visions to place a conditional effect—"When X happens, Y occurs." Triggers last until used or 1 minute. (2 Visions per trigger)',
          "Fate Echo: When a correct prediction resolves, repeat its effect on a new target for free (3 Visions)",
          "Destiny Lock: After making a correct precise prediction, spend 5 Visions to guarantee the predicted outcome is maximized (crits deal max damage, saves auto-fail, etc.)",
        ],

        combatLoop:
          "Predict an outcome → If correct, trigger Premonition for free fate effect → Place Fate Triggers for future contingencies → Echo successful predictions to double impact",

        recommendedFor:
          "Players who want the Oracle's prediction system to be the engine that drives ALL their power—high skill ceiling, enormous payoff",
      },
    ],
  },

  // Example Spells - organized by specialization
  exampleSpells: [
    // ===== SEER SPECIALIZATION =====
    {
      id: "oracle_foresight",
      name: "Foresight",
      description:
        "Peer 6 seconds into the future to see the outcome of your next action, granting you perfect clarity.",
      spellType: "ACTION",
      icon: "Utility/Watchful Eye",
      level: 2,
      specialization: "seer",

      typeConfig: {
        school: "psychic",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },

      resourceCost: {
        resourceTypes: ["visions"],
        resourceValues: { visions: 2 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        description:
          "Spend 2 Prophetic Visions to glimpse the immediate future",
      },

      duration: {
        value: 1,
        unit: "round",
        concentration: false,
      },

      resolution: "AUTOMATIC",
      effectTypes: ["buff"],

      effects: {
        primary:
          "Gain advantage on your next attack roll, ability check, or saving throw",
        secondary:
          "If you make a prediction about the outcome before rolling, gain +1 Vision if correct",
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },

      tags: ["seer", "divination", "advantage", "self buff"],
    },

    {
      id: "oracle_shared_vision",
      name: "Shared Vision",
      description:
        "Show an ally a glimpse of the future, guiding their actions toward success.",
      spellType: "ACTION",
      icon: "Radiant/Divine Radiance",
      level: 1,
      specialization: "seer",

      typeConfig: {
        school: "psychic",
        castTime: 1,
        castTimeType: "REACTION",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: ["ally"],
        maxTargets: 1,
        requiresLineOfSight: true,
      },

      resourceCost: {
        resourceTypes: ["visions"],
        resourceValues: { visions: 1 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        description: "Spend 1 Vision to share your foresight",
      },

      duration: {
        value: 1,
        unit: "instant",
        concentration: false,
      },

      resolution: "AUTOMATIC",
      effectTypes: ["buff"],

      effects: {
        primary: "Target ally gains advantage on their next roll",
        secondary: "If they succeed, you gain 1 Vision back",
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },

      tags: ["seer", "divination", "ally buff", "reaction"],
    },

    {
      id: "oracle_prophecy_of_doom",
      name: "Prophecy of Doom",
      description:
        "Declare a prophecy about an enemy's fate. The target is disadvantaged on their next attack roll. If the predicted event occurs within the duration, the target also suffers psychic damage and is frightened.",
      spellType: "ACTION",
      icon: "Necrotic/Necrotic Skull",
      level: 4,
      specialization: "seer",

      typeConfig: {
        school: "psychic",
        castTime: 1,
        castTimeType: "ACTION",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: ["enemy"],
        maxTargets: 1,
        requiresLineOfSight: true,
      },

      resourceCost: {
        resourceTypes: ["visions"],
        resourceValues: { visions: 3 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        description: "Spend 3 Visions to curse with prophecy",
      },

      duration: {
        value: 3,
        unit: "rounds",
        concentration: true,
      },

      resolution: "SAVING_THROW",
      savingThrow: {
        ability: "WIS",
        dc: "SPELL_DC",
        onSave: "Prophecy fails to take hold",
        onFail: "Target is cursed with prophesied doom",
      },

      effectTypes: ["debuff", "damage"],

      damageConfig: {
        damageType: "direct",
        elementType: "psychic",
        formula: "3d6 + intelligence",
        damageTypes: ["psychic"],
        hasDotEffect: false,
      },

      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          {
            id: "prophesied_doom",
            name: "Prophesied Doom",
            description:
              "Cursed with a dire prophecy - if the predicted event occurs, suffer the doom",
            statusType: "cursed",
            level: "major",
            mechanicsText:
              "Cursed with dire prophecy - suffer doom if predicted event occurs",
          },
        ],
        durationValue: 3,
        durationType: "rounds",
        durationUnit: "rounds",
        concentrationRequired: true,
        saveDC: 14,
        saveType: "spirit",
        saveOutcome: "negates",
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },

      tags: ["seer", "divination", "curse", "prediction", "psychic"],
    },

    // ===== TRUTHSEEKER SPECIALIZATION =====
    {
      id: "oracle_reveal_truth",
      name: "Reveal Truth",
      description:
        "Compel a creature to speak only truth. The target must answer one question honestly, unable to lie or mislead.",
      spellType: "ACTION",
      icon: "Radiant/Radiant Beam",
      level: 3,
      specialization: "truthseeker",

      typeConfig: {
        school: "psychic",
        castTime: 1,
        castTimeType: "ACTION",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
        targetRestrictions: ["enemy"],
        maxTargets: 1,
        requiresLineOfSight: true,
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 15 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        description: "Spend 15 mana to force truth",
        classResource: { type: "prophetic_visions", gain: 1 },
      },

      duration: {
        value: 1,
        unit: "minute",
        concentration: true,
      },

      resolution: "SAVING_THROW",
      effectTypes: ["utility"],
      savingThrow: {
        ability: "WIS",
        dc: "SPELL_DC",
        onSave: "Target resists the compulsion",
        onFail: "Target must answer one question truthfully",
      },

      effects: {
        primary:
          "Target must answer one question you ask with complete honesty",
        secondary: "They cannot lie, mislead, or omit important details",
        tertiary: "When they answer, you gain 1 Vision from the revealed truth",
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },

      tags: ["truthseeker", "divination", "interrogation", "social"],
    },

    {
      id: "oracle_past_sight",
      name: "Past Sight",
      description:
        "Touch an object or location to witness its history, seeing events that transpired here.",
      spellType: "ACTION",
      icon: "Psychic/Mind Read",
      level: 2,
      specialization: "truthseeker",

      typeConfig: {
        school: "psychic",
        castTime: 1,
        castTimeType: "RITUAL",
        ritualDuration: 1,
        ritualUnit: "minute",
      },

      targetingConfig: {
        targetingType: "touch",
        rangeType: "touch",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 12 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        description: "Spend 12 mana to peer into the past",
        classResource: {
          type: "prophetic_visions",
          gain: 1,
          condition: "revelation_gained",
        },
      },

      duration: {
        value: 10,
        unit: "minutes",
        concentration: true,
      },

      resolution: "AUTOMATIC",
      effectTypes: ["utility"],

      effects: {
        primary:
          "Witness the complete history of the touched object or location for the past 24 hours",
        secondary:
          "See all creatures who interacted with it and hear conversations within 10 feet",
        tertiary:
          "Each significant revelation grants 1 Vision (GM discretion, max 3)",
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },

      tags: ["truthseeker", "divination", "ritual", "investigation"],
    },

    {
      id: "oracle_piercing_gaze",
      name: "Piercing Gaze",
      description:
        "Your eyes glow with supernatural light, seeing through all deceptions and illusions.",
      spellType: "ACTION",
      icon: "Radiant/Enlightened Vision",
      level: 3,
      specialization: "truthseeker",

      typeConfig: {
        school: "psychic",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        rangeDistance: 60,
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 14 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        description: "Spend 14 mana to pierce all veils",
        classResource: {
          type: "prophetic_visions",
          gain: 1,
          condition: "hidden_revealed",
        },
      },

      duration: {
        value: 1,
        unit: "minute",
        concentration: true,
      },

      resolution: "AUTOMATIC",
      effectTypes: ["utility"],

      effects: {
        primary:
          "See through all illusions, disguises, and invisibility within 60 feet",
        secondary: "Automatically detect shapechangers and see their true form",
        tertiary:
          "Gain 1 Vision for each hidden creature or illusion revealed (max 3 per casting)",
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },

      tags: ["truthseeker", "divination", "detection", "anti illusion"],
    },

    // ===== FATESEER SPECIALIZATION =====
    {
      id: "oracle_twist_fate",
      name: "Twist Fate",
      description:
        "Having foreseen this moment, you reach out and twist the threads of destiny. You must have made a correct prediction this combat to use this ability.",
      spellType: "REACTION",
      icon: "Arcane/Ebon Blaze",
      level: 2,
      specialization: "fateseer",

      typeConfig: {
        school: "psychic",
        castTime: 1,
        castTimeType: "REACTION",
        trigger:
          "A creature within 60 feet makes an attack roll, ability check, or saving throw",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: ["any"],
        maxTargets: 1,
        requiresLineOfSight: true,
      },

      resourceCost: {
        resourceTypes: ["visions"],
        resourceValues: { visions: 2 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        description: "Spend 2 Visions to twist fate",
      },

      duration: {
        value: 1,
        unit: "instant",
        concentration: false,
      },

      resolution: "AUTOMATIC",
      effectTypes: ["utility"],

      effects: {
        primary: "Add or subtract 1d6 from the target's roll",
        secondary:
          "You choose whether to add or subtract after seeing the initial roll",
        tertiary: "Can turn a success into a failure or vice versa",
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },

      tags: [
        "fateseer",
        "divination",
        "reaction",
        "manipulation",
        "prediction-conditional",
      ],
    },

    {
      id: "oracle_sever_thread",
      name: "Sever Thread",
      description:
        "Having predicted this critical moment, you cut the thread of fate. You must have predicted a critical hit or critical miss this round to use this ability.",
      spellType: "REACTION",
      icon: "Necrotic/Drain Soul",
      level: 4,
      specialization: "fateseer",

      typeConfig: {
        school: "psychic",
        castTime: 1,
        castTimeType: "REACTION",
        trigger: "A creature within 60 feet rolls a natural 20 or natural 1",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: ["any"],
        maxTargets: 1,
        requiresLineOfSight: true,
      },

      resourceCost: {
        resourceTypes: ["visions"],
        resourceValues: { visions: 3 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        description: "Spend 3 Visions to sever fate's thread",
      },

      duration: {
        value: 1,
        unit: "instant",
        concentration: false,
      },

      resolution: "AUTOMATIC",
      effectTypes: ["utility"],

      effects: {
        primary:
          "Turn a natural 20 into a natural 19 (normal hit instead of critical)",
        secondary:
          "OR turn a natural 1 into a natural 2 (normal miss instead of critical fail)",
        tertiary:
          "OR turn a normal roll into a critical (natural 20) or critical fail (natural 1)",
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },

      tags: [
        "fateseer",
        "divination",
        "reaction",
        "critical",
        "manipulation",
        "prediction-conditional",
      ],
    },

    {
      id: "oracle_destiny_lock",
      name: "Destiny Lock",
      description:
        "Lock a creature's fate after a correct precise prediction. You must have made a correct precise (3 Vision) prediction this combat to cast this.",
      level: 7,
      spellType: "ACTION",
      icon: "Force/Force Field",
      specialization: "fateseer",

      typeConfig: {
        school: "psychic",
        castTime: 1,
        castTimeType: "ACTION",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: ["any"],
        maxTargets: 1,
        requiresLineOfSight: true,
      },

      resourceCost: {
        resourceTypes: ["visions"],
        resourceValues: { visions: 5 },
        actionPoints: 3,
        components: ["verbal", "somatic", "material"],
        materialComponents: "A golden thread worth 100gp",
        description:
          "Spend 5 Visions to lock destiny (requires correct precise prediction this combat)",
      },

      duration: {
        value: 1,
        unit: "round",
        concentration: false,
      },

      resolution: "AUTOMATIC",
      effectTypes: ["utility"],

      effects: {
        primary:
          "The next attack roll made by or against the target automatically succeeds and is a critical hit",
        secondary:
          "OR the next saving throw automatically succeeds or fails (your choice)",
        tertiary:
          "This effect cannot be prevented, dispelled, or countered - fate is absolute",
      },

      specialMechanics: {
        limitation:
          "Requires a correct precise prediction this combat. Can only be used once per combat.",
        note: "This is the ultimate prediction-driven fate manipulation",
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },

      tags: [
        "fateseer",
        "divination",
        "guaranteed outcome",
        "prediction-conditional",
      ],
    },

    // ===== NEW TRUTHSEEKER COMBAT SPELLS =====
    {
      id: "oracle_unmask",
      name: "Unmask",
      description:
        "Pierce through a target's defenses, stripping one magical buff, immunity, or concealment effect from them.",
      level: 2,
      spellType: "ACTION",
      icon: "Psychic/Mind Read",
      school: "Divination",
      specialization: "truthseeker",

      typeConfig: {
        school: "divination",
        icon: "Psychic/Mind Read",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: ["enemy"],
        maxTargets: 1,
      },

      resourceCost: {
        resourceTypes: ["visions"],
        resourceValues: { visions: 2 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "I see through you!",
      },

      resolution: "SAVE",
      effectTypes: ["debuff"],

      debuffConfig: {
        debuffType: "dispel",
        effects: [
          {
            id: "unmasked",
            name: "Unmasked",
            description:
              "One magical buff, immunity, or concealment effect is stripped from the target. You choose which.",
            mechanicsText:
              "Strip one buff/immunity/concealment. Spirit save: on success, the stripped buff returns after 1 round.",
          },
        ],
        saveDC: 14,
        saveType: "spirit",
        saveOutcome: "partial",
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },

      tags: ["truthseeker", "debuff", "strip", "level 2"],
    },

    {
      id: "oracle_past_sins",
      name: "Past Sins",
      description:
        "Channel the weight of a target's hidden past against them. The more debuffs and exposed weaknesses they have, the more devastating this attack.",
      level: 5,
      spellType: "ACTION",
      icon: "Psychic/Agonizing Scream",
      school: "Divination",
      specialization: "truthseeker",

      typeConfig: {
        school: "divination",
        icon: "Psychic/Agonizing Scream",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: ["enemy"],
        maxTargets: 1,
      },

      resourceCost: {
        resourceTypes: ["visions"],
        resourceValues: { visions: 3 },
        actionPoints: 1,
        components: ["verbal"],
        verbalText: "Your past sins condemn you!",
      },

      resolution: "DICE",
      effectTypes: ["damage"],

      damageConfig: {
        formula: "2d6 per debuff affecting the target (max 8d6)",
        elementType: "psychic",
        damageTypes: ["direct"],
        specialRules:
          "Counts all debuffs, exposed weaknesses, and stripped buffs on the target. Minimum 2d6 even with no debuffs.",
        savingThrowConfig: {
          enabled: true,
          savingThrowType: "spirit",
          difficultyClass: 16,
          saveOutcome: "halves",
        },
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },

      tags: ["truthseeker", "damage", "psychic", "scaling", "level 5"],
    },

    // ===== UNIVERSAL ABILITIES =====
    {
      id: "oracle_detect_fate",
      name: "Detect Fate",
      description:
        "Sense the weight of destiny on creatures and objects, seeing who is important to the future.",
      spellType: "ACTION",
      icon: "Healing/Prayer",
      level: 1,
      specialization: "universal",

      typeConfig: {
        school: "psychic",
        castTime: 1,
        castTimeType: "ACTION",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        rangeDistance: 30,
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 8 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        description: "Spend 8 mana to sense destiny",
        classResource: { type: "prophetic_visions", gain: 1 },
      },

      duration: {
        value: 10,
        unit: "minutes",
        concentration: true,
      },

      resolution: "AUTOMATIC",
      effectTypes: ["utility"],

      effects: {
        primary:
          "See glowing threads of fate connecting creatures and objects within 30 feet",
        secondary:
          "Brighter threads indicate greater importance to future events",
        tertiary:
          'Can identify "key" NPCs, important items, and critical locations',
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },

      tags: ["universal", "divination", "detection", "utility"],
    },

    {
      id: "oracle_omen_reading",
      name: "Omen Reading",
      description:
        "Read the omens in your surroundings to gain insight into the immediate future.",
      spellType: "ACTION",
      icon: "Necrotic/Skull 2",
      level: 2,
      specialization: "universal",

      typeConfig: {
        school: "psychic",
        castTime: 10,
        castTimeType: "RITUAL",
        ritualDuration: 10,
        ritualUnit: "minutes",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 12 },
        actionPoints: 2,
        components: ["verbal", "somatic", "material"],
        materialComponents: "Divination tools (bones, cards, or runes)",
        description: "Spend 12 mana to read the omens",
        classResource: {
          type: "prophetic_visions",
          gain: 1,
          condition: "omens_come_true",
        },
      },

      duration: {
        value: 1,
        unit: "hour",
        concentration: false,
      },

      resolution: "AUTOMATIC",
      effectTypes: ["utility"],

      effects: {
        primary:
          "Gain cryptic insight into the next hour (GM provides 3 vague clues about upcoming events)",
        secondary: "Advantage on initiative rolls for the next hour",
        tertiary:
          "If you act on the omens, gain 1 Vision when the predicted event occurs",
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },

      tags: ["universal", "divination", "ritual", "foresight"],
    },

    // ========================================
    // LEVEL 6 SPELLS
    // ========================================
    {
      id: "oracle_future_strike",
      name: "Future Strike",
      description:
        "See into the future to strike an enemy before they can react. This attack cannot be dodged or blocked.",
      level: 6,
      spellType: "ACTION",
      icon: "Radiant/Divine Blessing",
      specialization: "seer",

      typeConfig: {
        school: "divination",
        icon: "Radiant/Divine Blessing",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: ["enemy"],
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 35 },
        actionPoints: 1,
        components: ["somatic"],
        somaticText: "Point at where enemy will be",
      },

      resolution: "DICE",
      effectTypes: ["damage"],

      damageConfig: {
        formula: "6d8 + intelligence",
        elementType: "psychic",
        damageTypes: ["direct"],
        specialRules: "Cannot be dodged, blocked, or reduced by armor",
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },

      tags: ["seer", "damage", "psychic", "guaranteed hit", "level 6"],
    },

    {
      id: "oracle_reveal_weakness",
      name: "Reveal Weakness",
      description:
        "Peer into a target's timeline to discover their greatest weakness. All attacks against them gain advantage and deal +1d6 bonus damage.",
      level: 3,
      spellType: "ACTION",
      icon: "Utility/All Seeing Eye",
      specialization: "truthseeker",

      typeConfig: {
        school: "divination",
        icon: "Utility/All Seeing Eye",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: ["enemy"],
      },

      resourceCost: {
        resourceTypes: ["visions"],
        resourceValues: { visions: 3 },
        actionPoints: 1,
        components: ["verbal"],
        verbalText: "Reveal your weakness!",
      },

      resolution: "SAVE",
      effectTypes: ["debuff"],

      debuffConfig: {
        debuffType: "vulnerability",
        effects: [
          {
            id: "revealed_weakness",
            name: "Revealed Weakness",
            description:
              "Target takes 50% more damage from all sources for 4 rounds (or 2 rounds if save succeeds)",
            statPenalty: {
              stat: "damage_taken",
              value: 50,
              magnitudeType: "percentage_increase",
            },
            mechanicsText:
              "50% increased damage from all sources for 4 rounds (2 on save)",
          },
        ],
        durationValue: 4,
        durationType: "rounds",
        durationUnit: "rounds",
        saveDC: 16,
        saveType: "spirit",
        saveOutcome: "halves_duration",
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 4 },

      tags: ["truthseeker", "debuff", "vulnerability", "level 3"],
    },

    {
      id: "oracle_destiny_shift",
      name: "Destiny Shift",
      description:
        "Having foreseen this outcome, alter the threads of fate. You must have made a correct prediction this combat to use this ability.",
      level: 6,
      spellType: "REACTION",
      icon: "Arcane/Rewind Time",
      specialization: "fateseer",

      typeConfig: {
        school: "divination",
        icon: "Arcane/Rewind Time",
        castTime: 1,
        castTimeType: "REACTION",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: ["any"],
      },

      resourceCost: {
        resourceTypes: ["visions"],
        resourceValues: { visions: 3 },
        actionPoints: 0,
        components: ["verbal"],
        verbalText: "Fate, shift!",
      },

      resolution: "NONE",
      effectTypes: ["utility"],

      specialMechanics: {
        reroll: {
          description:
            "Force any creature to reroll any d20 roll. You choose which result is used.",
          trigger: "on_roll",
        },
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },

      tags: [
        "fateseer",
        "utility",
        "reroll",
        "level 6",
        "prediction-conditional",
      ],
    },

    // ========================================
    // LEVEL 7 SPELLS
    // ========================================
    {
      id: "oracle_prescient_dodge",
      name: "Prescient Dodge",
      description:
        "See incoming attacks before they happen, granting disadvantage on attacks against you and automatic success on Agility saves.",
      level: 7,
      spellType: "ACTION",
      icon: "Nature/Ethereal Bird",
      specialization: "seer",

      typeConfig: {
        school: "divination",
        icon: "Nature/Ethereal Bird",
        castTime: 1,
        castTimeType: "BONUS",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },

      resourceCost: {
        resourceTypes: ["visions"],
        resourceValues: { visions: 3 },
        actionPoints: 0,
        components: ["somatic"],
        somaticText: "Focus on the future",
      },

      resolution: "NONE",
      effectTypes: ["buff"],

      buffConfig: {
        buffType: "evasion",
        effects: [
          {
            id: "prescient_dodge",
            name: "Prescient Dodge",
            description:
              "Enemies have disadvantage on all attacks against you for 3 rounds (requires concentration). You automatically succeed on Agility saving throws.",
            mechanicsText:
              "Enemies have disadvantage on attacks against you for 3 rounds. Auto-succeed Agility saves.",
          },
        ],
        durationValue: 3,
        durationType: "rounds",
        durationUnit: "rounds",
        concentrationRequired: true,
        canBeDispelled: true,
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 5 },

      tags: ["seer", "buff", "evasion", "level 7"],
    },

    {
      id: "oracle_expose_secrets",
      name: "Expose Secrets",
      description:
        "Read the hidden truths in a creature's past, exposing their secrets. Attacks against them gain advantage and they lose all concealment.",
      level: 7,
      spellType: "ACTION",
      icon: "Psychic/Mind Roar",
      specialization: "truthseeker",

      typeConfig: {
        school: "divination",
        icon: "Psychic/Mind Roar",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: ["enemy"],
      },

      resourceCost: {
        resourceTypes: ["visions"],
        resourceValues: { visions: 4 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "Your secrets are mine!",
        somaticText: "Eye contact",
      },

      resolution: "SAVE",
      effectTypes: ["debuff", "damage"],

      debuffConfig: {
        debuffType: "exposed",
        effects: [
          {
            id: "exposed_secrets",
            name: "Exposed Secrets",
            description:
              "All attacks against target have advantage for 1 minute. Target cannot benefit from invisibility, cover, or concealment.",
            statPenalty: {
              stat: "armor",
              value: -99,
              magnitudeType: "advantage_to_attackers",
            },
            mechanicsText:
              "All attacks have advantage. Cannot benefit from invisibility, cover, or concealment.",
          },
        ],
        durationValue: 1,
        durationType: "minutes",
        durationUnit: "minutes",
        saveDC: 17,
        saveType: "spirit",
        saveOutcome: "halves_duration",
      },

      damageConfig: {
        formula: "12d6 + intelligence",
        elementType: "psychic",
        damageTypes: ["direct"],
        criticalConfig: {
          enabled: true,
          critType: "dice",
          critMultiplier: 2,
          critDiceOnly: false,
          extraDice: "2d10",
          critEffects: ["expose"],
          exposeConfig: {
            duration: 2,
            durationUnit: "rounds",
            advantageOnAttacks: true,
          },
        },
        savingThrowConfig: {
          enabled: true,
          savingThrowType: "spirit",
          difficultyClass: 17,
          saveOutcome: "halves",
          partialEffect: true,
          partialEffectFormula: "damage/2",
        },
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 4 },

      tags: ["truthseeker", "debuff", "damage", "level 7"],
    },

    {
      id: "oracle_threads_of_fate",
      name: "Threads of Fate",
      description:
        "Having foreseen how these fates intertwine, link them together. You must have made a correct prediction targeting at least one of these creatures this combat.",
      level: 7,
      spellType: "ACTION",
      icon: "Force/Force Shield",
      specialization: "fateseer",

      typeConfig: {
        school: "enchantment",
        icon: "Force/Force Shield",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "multi",
        rangeType: "ranged",
        rangeDistance: 60,
        maxTargets: 4,
        targetRestrictions: ["any"],
      },

      resourceCost: {
        resourceTypes: ["visions"],
        resourceValues: { visions: 4 },
        actionPoints: 2,
        components: ["somatic"],
        somaticText: "Weave fate threads",
      },

      resolution: "NONE",
      effectTypes: ["utility"],

      specialMechanics: {
        linkedFates: {
          description:
            "Link up to 4 creatures. Any effect on one affects all. Damage is split, healing is shared, conditions apply to all.",
          duration: "1 minute",
        },
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 5 },

      tags: [
        "fateseer",
        "utility",
        "link",
        "level 7",
        "prediction-conditional",
      ],
    },

    // ========================================
    // LEVEL 8 SPELLS
    // ========================================
    {
      id: "oracle_perfect_foresight",
      name: "Perfect Foresight",
      description:
        "Gain perfect knowledge of the immediate future. Know exactly what will happen in the next round.",
      level: 8,
      spellType: "ACTION",
      icon: "Radiant/Divine Radiance",
      specialization: "seer",

      typeConfig: {
        school: "divination",
        icon: "Radiant/Divine Radiance",
        castTime: 1,
        castTimeType: "BONUS",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },

      resourceCost: {
        resourceTypes: ["visions"],
        resourceValues: { visions: 5 },
        actionPoints: 0,
        components: ["somatic"],
        somaticText: "Close eyes and see",
      },

      resolution: "NONE",
      effectTypes: ["buff"],

      buffConfig: {
        buffType: "foresight",
        effects: [
          {
            id: "perfect_foresight",
            name: "Perfect Foresight",
            description:
              "You know all enemy actions for the next round. You have advantage on all rolls. Enemies have disadvantage against you.",
            mechanicsText:
              "Know all enemy actions next round. Advantage on all rolls. Enemies have disadvantage against you.",
          },
        ],
        durationValue: 1,
        durationType: "rounds",
        durationUnit: "rounds",
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 5 },

      tags: ["seer", "buff", "foresight", "level 8"],
    },

    {
      id: "oracle_psychic_assault",
      name: "Psychic Assault",
      description:
        "Assault a target's mind with visions of their darkest truths, dealing massive psychic damage.",
      level: 8,
      spellType: "ACTION",
      icon: "Psychic/Agonizing Scream",
      specialization: "truthseeker",

      typeConfig: {
        school: "enchantment",
        icon: "Psychic/Agonizing Scream",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 90,
        targetRestrictions: ["enemy"],
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 50 },
        actionPoints: 2,
        components: ["verbal"],
        verbalText: "Face your truth!",
      },

      resolution: "DICE",
      effectTypes: ["damage", "control"],

      damageConfig: {
        formula: "10d8 + intelligence",
        elementType: "psychic",
        damageTypes: ["direct"],
        savingThrowConfig: {
          enabled: true,
          savingThrowType: "spirit",
          difficultyClass: 18,
          saveOutcome: "halves",
        },
      },

      controlConfig: {
        controlType: "stun",
        strength: "strong",
        duration: 2,
        durationUnit: "rounds",
        saveDC: 18,
        saveType: "spirit",
        savingThrow: true,
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 4 },

      tags: ["truthseeker", "damage", "control", "psychic", "level 8"],
    },

    {
      id: "oracle_alter_destiny",
      name: "Alter Destiny",
      description:
        "Having predicted this exact outcome, you rewrite it completely. You must have made a correct specific or precise prediction about this target this combat to use this ability.",
      level: 8,
      spellType: "REACTION",
      icon: "Arcane/Rewind Time",
      specialization: "fateseer",

      typeConfig: {
        school: "transmutation",
        icon: "Arcane/Rewind Time",
        castTime: 1,
        castTimeType: "REACTION",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 120,
        targetRestrictions: ["any"],
      },

      resourceCost: {
        resourceTypes: ["visions"],
        resourceValues: { visions: 6 },
        actionPoints: 0,
        components: ["verbal"],
        verbalText: "Destiny, bend!",
      },

      resolution: "NONE",
      effectTypes: ["utility"],

      specialMechanics: {
        alterDestiny: {
          description:
            "Change any d20 roll result to any number you choose (1-20). Can turn failures into successes or successes into failures.",
          trigger: "on_any_d20_roll",
        },
      },

      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },

      tags: [
        "fateseer",
        "utility",
        "fate control",
        "level 8",
        "prediction-conditional",
      ],
    },

    // ========================================
    // LEVEL 9 SPELLS
    // ========================================
    {
      id: "oracle_timeline_split",
      name: "Timeline Split",
      description:
        "Split the timeline, creating two versions of yourself that act simultaneously.",
      level: 9,
      spellType: "ACTION",
      icon: "Arcane/Open Portal",
      specialization: "seer",

      typeConfig: {
        school: "conjuration",
        icon: "Arcane/Open Portal",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },

      resourceCost: {
        resourceTypes: ["visions"],
        resourceValues: { visions: 8 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "Timeline, split!",
        somaticText: "Pull apart gesture",
      },

      resolution: "NONE",
      effectTypes: ["summoning"],

      summonConfig: {
        creatures: [
          {
            id: "timeline_duplicate",
            name: "Timeline Duplicate",
            description: "A perfect copy of yourself from another timeline",
            stats: {
              maxHp: "same_as_caster",
              armor: "same_as_caster",
              maxMana: "same_as_caster",
            },
            config: {
              quantity: 1,
              duration: 3,
              durationUnit: "rounds",
              hasDuration: true,
              concentration: false,
              controlType: "independent",
              abilities: "Can take all your actions",
            },
          },
        ],
        duration: 3,
        durationUnit: "rounds",
      },

      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },

      tags: ["seer", "summoning", "duplicate", "level 9"],
    },

    {
      id: "oracle_omniscience",
      name: "Omniscience",
      description:
        "Briefly tap into omniscient knowledge. Learn any piece of information you desire.",
      level: 9,
      spellType: "ACTION",
      icon: "Radiant/Radiant Glow",
      specialization: "truthseeker",

      typeConfig: {
        school: "divination",
        icon: "Radiant/Radiant Glow",
        castTime: 10,
        castTimeType: "RITUAL",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },

      resourceCost: {
        resourceTypes: ["visions"],
        resourceValues: { visions: 10 },
        actionPoints: 0,
        components: ["verbal", "somatic", "material"],
        verbalText: "Reveal all truths",
        somaticText: "Meditation pose",
        materialText: "Rare incense worth 500gp",
      },

      resolution: "NONE",
      effectTypes: ["utility"],

      specialMechanics: {
        omniscience: {
          description:
            "Ask up to 3 questions. The DM must answer truthfully and completely. Can reveal hidden truths, secret locations, weaknesses, etc.",
          limitations:
            "Cannot predict decisions not yet made. Cannot reveal information protected by deity-level magic.",
        },
      },

      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },

      tags: ["truthseeker", "utility", "knowledge", "ritual", "level 9"],
    },

    {
      id: "oracle_weave_destiny",
      name: "Weave Destiny",
      description:
        "Having foreseen every thread of fate in this moment, you seize control of them all. You must have made at least 3 correct predictions this combat to use this ability.",
      level: 9,
      spellType: "ACTION",
      icon: "Radiant/Divine Illumination",
      specialization: "fateseer",

      typeConfig: {
        school: "transmutation",
        icon: "Radiant/Divine Illumination",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "circle",
        aoeParameters: { radius: 60 },
      },

      resourceCost: {
        resourceTypes: ["visions"],
        resourceValues: { visions: 10 },
        actionPoints: 3,
        components: ["verbal", "somatic"],
        verbalText: "I AM FATE!",
        somaticText: "Weaving motion",
      },

      resolution: "NONE",
      effectTypes: ["control"],

      specialMechanics: {
        weaveDestiny: {
          description:
            "For 1 round, you determine the outcome of all dice rolls in the area. You choose success or failure for every roll.",
          duration: "1 round",
        },
      },

      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },

      tags: [
        "fateseer",
        "control",
        "fate",
        "ultimate",
        "level 9",
        "prediction-conditional",
      ],
    },

    // ========================================
    // LEVEL 10 SPELLS
    // ========================================
    {
      id: "oracle_future_self",
      name: "Future Self",
      description:
        "Summon your future self - a version of you from a timeline where you reached godlike power.",
      level: 10,
      spellType: "ACTION",
      icon: "Force/Force Field",
      specialization: "seer",

      typeConfig: {
        school: "conjuration",
        icon: "Force/Force Field",
        castTime: 2,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 30,
      },

      resourceCost: {
        resourceTypes: ["visions"],
        resourceValues: { visions: 10 },
        actionPoints: 3,
        components: ["verbal", "somatic"],
        verbalText: "COME, MY FUTURE SELF!",
        somaticText: "Tear open time",
      },

      resolution: "NONE",
      effectTypes: ["summoning"],

      summonConfig: {
        creatures: [
          {
            id: "future_self",
            name: "Future Self",
            description: "A godlike version of yourself from the future",
            size: "Medium",
            type: "celestial",
            stats: {
              maxHp: 200,
              armor: 25,
              maxMana: 100,
            },
            config: {
              quantity: 1,
              duration: 5,
              durationUnit: "rounds",
              hasDuration: true,
              concentration: false,
              controlType: "independent",
              abilities:
                "Can cast any spell you know at maximum power. Attacks deal 6d8 psychic damage.",
            },
          },
        ],
        duration: 5,
        durationUnit: "rounds",
      },

      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },

      tags: ["seer", "summoning", "ultimate", "level 10"],
    },

    {
      id: "oracle_absolute_truth",
      name: "Absolute Truth",
      description:
        "Reveal the absolute truth of reality, forcing all creatures to confront their deepest fears and truths.",
      level: 10,
      spellType: "ACTION",
      icon: "Radiant/Divine Blessing",
      specialization: "truthseeker",

      typeConfig: {
        school: "enchantment",
        icon: "Radiant/Divine Blessing",
        castTime: 2,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "circle",
        aoeParameters: { radius: 60 },
        targetRestrictions: ["enemy"],
      },

      resourceCost: {
        resourceTypes: ["visions"],
        resourceValues: { visions: 10 },
        actionPoints: 3,
        components: ["verbal"],
        verbalText: "BEHOLD THE TRUTH!",
      },

      resolution: "DICE",
      effectTypes: ["damage", "control"],

      damageConfig: {
        formula: "15d10 + intelligence * 2",
        elementType: "psychic",
        damageTypes: ["direct"],
        savingThrowConfig: {
          enabled: true,
          savingThrowType: "spirit",
          difficultyClass: 21,
          saveOutcome: "halves",
        },
      },

      controlConfig: {
        controlType: "stun",
        strength: "overwhelming",
        duration: 1,
        durationUnit: "rounds",
        saveDC: 21,
        saveType: "spirit",
        savingThrow: true,
        effects: [
          {
            id: "truth_revealed",
            name: "Truth Revealed",
            description:
              "Stunned and cannot benefit from any magical protection or concealment",
            saveType: "charisma",
            saveDC: 18,
            duration: 1,
            durationUnit: "rounds",
          },
        ],
      },

      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },

      tags: ["truthseeker", "damage", "control", "ultimate", "level 10"],
    },

    {
      id: "oracle_master_of_fate",
      name: "Master of Fate",
      description:
        "Become the absolute master of fate itself. Your predictions have been so accurate that fate itself bends to your will. Requires at least 3 correct predictions this combat.",
      level: 10,
      spellType: "ACTION",
      icon: "Radiant/Radiant Glow",
      specialization: "fateseer",

      typeConfig: {
        school: "transmutation",
        icon: "Radiant/Radiant Glow",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },

      resourceCost: {
        resourceTypes: ["visions"],
        resourceValues: { visions: 10 },
        actionPoints: 3,
        components: ["verbal"],
        verbalText: "I AM THE MASTER OF FATE!",
      },

      resolution: "NONE",
      effectTypes: ["transformation"],

      transformationConfig: {
        transformationType: "divine",
        targetType: "self",
        duration: 3,
        durationUnit: "rounds",
        power: "major",
        newForm: "Master of Fate",
        description: "Become one with the cosmic forces of destiny.",
        grantedAbilities: [
          {
            id: "fate_stats",
            name: "Cosmic Insight",
            description: "+5 to all attributes",
          },
          {
            id: "fate_control",
            name: "Fate Control",
            description: "Reroll any die roll 3 times per transformation",
          },
          {
            id: "fate_sight",
            name: "Perfect Foresight",
            description: "Cannot be surprised, advantage on all saving throws",
          },
          {
            id: "fate_protection",
            name: "Fate Shield",
            description: "Once per transformation, negate a lethal blow",
          },
          {
            id: "fate_exhaustion",
            name: "Cosmic Drain (On End)",
            description:
              "Gain 2 levels of exhaustion and lose all remaining Vision Points",
          },
        ],
        concentrationRequired: false,
        canBeDispelled: false,
      },

      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },

      tags: [
        "fateseer",
        "transformation",
        "ultimate",
        "level 10",
        "prediction-conditional",
      ],
    },

    // ZERO-RESOURCE FALLBACK
    {
      id: "oracle_fate_whisper_strike",
      name: "Fate's Whisper Strike",
      description:
        "Channel a sliver of prophetic energy into a basic attack. Costs no mana and no Visions — your ever-present connection to the timestream.",
      level: 0,
      spellType: "ACTION",
      icon: "Psychic/Mind Read",
      specialization: "universal",

      typeConfig: {
        school: "psychic",
        icon: "Psychic/Mind Read",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
        targetRestrictions: ["enemy"],
        maxTargets: 1,
      },

      resourceCost: {
        resourceTypes: [],
        resourceValues: {},
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Fate whispers...",
        classResource: {
          type: "prophetic_visions",
          gain: 1,
          condition: "on_hit",
        },
      },

      resolution: "DICE",
      effectTypes: ["damage"],

      damageConfig: {
        formula: "1d4 + intelligence",
        elementType: "psychic",
        damageTypes: ["direct"],
        specialRules:
          "Grants +1 Prophetic Vision on hit. Always available — no cooldown.",
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },

      tags: ["universal", "damage", "psychic", "fallback", "cantrip"],
    },

    // ADDITIONAL LEVEL 1 SPELL
    {
      id: "oracle_divine_insight",
      name: "Divine Insight",
      description:
        "Gain divine insight into an enemy, revealing their weaknesses and granting +2 to attack rolls against them for 3 rounds.",
      level: 1,
      spellType: "ACTION",
      specialization: "universal",
      effectTypes: ["buff"],

      typeConfig: {
        school: "divination",
        icon: "Radiant/Divine Radiance",
        tags: ["buff", "insight", "universal"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 40,
        targetRestrictions: ["enemy"],
        maxTargets: 1,
      },

      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          {
            id: "divine_insight",
            name: "Divine Insight",
            description: "Gain +2 to attack rolls against target for 3 rounds",
            statModifier: {
              stat: "attack_rolls",
              magnitude: 2,
              magnitudeType: "flat",
            },
          },
        ],
        durationValue: 3,
        durationType: "rounds",
        durationUnit: "rounds",
        concentrationRequired: false,
        canBeDispelled: true,
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: {
          mana: 10,
        },
        actionPoints: 1,
        components: ["verbal"],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },

      resolution: "DICE",
      tags: ["buff", "insight", "universal"],
    },

    // ADDITIONAL LEVEL 3 SPELL
    {
      id: "oracle_prophetic_shield",
      name: "Prophetic Shield",
      description:
        "See incoming attacks before they happen, gaining +3 Armor and advantage on saving throws for 4 rounds.",
      level: 3,
      spellType: "ACTION",
      specialization: "universal",
      effectTypes: ["buff"],

      typeConfig: {
        school: "divination",
        icon: "Force/Force Field",
        tags: ["buff", "defense", "prophecy", "universal"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },

      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          {
            id: "prophetic_shield",
            name: "Prophetic Shield",
            description:
              "Gain +3 Armor and advantage on saving throws for 4 rounds",
            statModifier: {
              stat: "armor",
              magnitude: 3,
              magnitudeType: "flat",
            },
          },
        ],
        durationValue: 4,
        durationType: "rounds",
        durationUnit: "rounds",
        concentrationRequired: false,
        canBeDispelled: true,
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: {
          mana: 18,
        },
        actionPoints: 1,
        components: ["verbal", "somatic"],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },

      resolution: "DICE",
      tags: ["buff", "defense", "prophecy", "universal"],
    },

    // ADDITIONAL LEVEL 4 SPELL
    {
      id: "oracle_fate_strike",
      name: "Fate Strike",
      description:
        "Strike with the power of fate, guaranteed to hit your target.",
      level: 4,
      spellType: "ACTION",
      specialization: "universal",
      effectTypes: ["damage"],

      typeConfig: {
        school: "evocation",
        icon: "Radiant/Divine Blessing",
        tags: ["damage", "force", "guaranteed", "universal"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 50,
        targetRestrictions: ["enemy"],
        maxTargets: 1,
      },

      damageConfig: {
        formula: "5d8",
        elementType: "force",
        damageTypes: ["direct"],
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: {
          mana: 22,
        },
        actionPoints: 1,
        components: ["verbal", "somatic"],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },

      resolution: "DICE",
      tags: ["damage", "force", "guaranteed", "universal"],
    },

    // ADDITIONAL LEVEL 5 SPELL
    {
      id: "oracle_destiny_rewrite",
      name: "Destiny Rewrite",
      description:
        "Rewrite the destiny of an ally, allowing them to reroll any roll with advantage for 5 rounds.",
      level: 5,
      spellType: "ACTION",
      specialization: "universal",
      effectTypes: ["buff"],

      typeConfig: {
        school: "divination",
        icon: "Radiant/Divine Halo",
        tags: ["buff", "destiny", "advantage", "universal"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 40,
        targetRestrictions: ["ally"],
        maxTargets: 1,
      },

      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          {
            id: "destiny_rewrite",
            name: "Destiny Rewrite",
            description: "Can reroll any roll with advantage for 5 rounds",
            statModifier: {
              stat: "all_rolls",
              magnitude: 1,
              magnitudeType: "advantage",
            },
          },
        ],
        durationValue: 5,
        durationType: "rounds",
        durationUnit: "rounds",
        concentrationRequired: false,
        canBeDispelled: true,
      },

      resourceCost: {
        resourceTypes: ["visions"],
        resourceValues: {
          visions: 4,
        },
        actionPoints: 1,
        components: ["verbal", "somatic"],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 4 },

      resolution: "DICE",
      tags: ["buff", "destiny", "advantage", "universal"],
    },
  ],

  spellSummary: [
    {
      level: 0,
      spells: ["Fate's Whisper Strike"],
      spec: "Universal (Fallback)",
    },
    {
      level: 1,
      spells: ["Detect Fate", "Divine Insight", "Shared Vision"],
      spec: "Universal / Seer",
    },
    {
      level: 2,
      spells: [
        "Omen Reading",
        "Foresight",
        "Twist Fate",
        "Unmask",
        "Past Sight",
      ],
      spec: "Universal / Seer / Fateseer / Truthseeker",
    },
    {
      level: 3,
      spells: [
        "Reveal Truth",
        "Piercing Gaze",
        "Prophetic Shield",
        "Reveal Weakness",
      ],
      spec: "Truthseeker / Universal",
    },
    {
      level: 4,
      spells: ["Prophecy of Doom", "Fate Strike", "Sever Thread"],
      spec: "Seer / Universal / Fateseer",
    },
    {
      level: 5,
      spells: ["Past Sins", "Destiny Rewrite"],
      spec: "Truthseeker / Universal",
    },
    {
      level: 6,
      spells: ["Future Strike", "Destiny Shift"],
      spec: "Seer / Fateseer",
    },
    {
      level: 7,
      spells: [
        "Prescient Dodge",
        "Expose Secrets",
        "Destiny Lock",
        "Threads of Fate",
      ],
      spec: "Seer / Truthseeker / Fateseer",
    },
    {
      level: 8,
      spells: ["Perfect Foresight", "Psychic Assault", "Alter Destiny"],
      spec: "Seer / Truthseeker / Fateseer",
    },
    {
      level: 9,
      spells: ["Timeline Split", "Omniscience", "Weave Destiny"],
      spec: "Seer / Truthseeker / Fateseer",
    },
    {
      level: 10,
      spells: ["Future Self", "Absolute Truth", "Master of Fate"],
      spec: "Seer / Truthseeker / Fateseer",
    },
  ],
};
