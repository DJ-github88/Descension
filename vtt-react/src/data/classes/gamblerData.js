/**
 * Gambler Class Data
 *
 * Complete class information for the Gambler - a daring risk-taker
 * who manipulates luck and probability for high-stakes rewards.
 */

export const GAMBLER_DATA = {
  id: "gambler",
  name: "Gambler",
  icon: "fas fa-dice",
  role: "Damage/Utility",
  damageTypes: ["force", "psychic"],

  // Overview section
  overview: {
    title: "The Gambler",
    subtitle: "Master of Fortune and Fate",

    quickOverview: {
      title: "Quick Overview",
      coreLoop:
        "Successful spell/attack → Generate Fortune Points → Spend to adjust your own rolls by ±1 per point",
      resource: "Fortune Points (Cap: 7 / 13 / 21 by spec)",
      role: "Variable damage dealer + utility",
      playstyle:
        "High-risk damage, probability manipulation, rollable table specialist",
      bestFor:
        "Players who enjoy gambling mechanics, adjusting roll results, and high-variance gameplay",
    },

    description: `A daring risk-taker who manipulates luck and probability. Gamblers embrace high-risk, high-reward strategies, using Fortune Points to turn chance into calculated advantage and swing battles on a single bet.`,

    roleplayIdentity: {
      title: "Roleplay Identity",
      content: `Gamblers are individuals who have learned to see patterns in chaos and opportunity in uncertainty. They believe that fate is not fixed but fluid—something that can be nudged, influenced, and occasionally cheated. Whether through supernatural luck, divine favor, or simply uncanny intuition, Gamblers have an almost preternatural ability to beat the odds.

**The Gambler's Philosophy**: True power comes not from controlling every variable, but from knowing when to take risks and when to play it safe. Every moment is a gamble, and the universe rewards the bold.

**Common Archetypes**:
- **The Card Sharp**: A cunning strategist who treats life like a game of cards, always counting odds and reading tells
- **The Lucky Fool**: Blessed (or cursed) with supernatural fortune, stumbling into success through sheer chance
- **The Fate Weaver**: Believes they can see and manipulate the threads of destiny itself
- **The Debt Collector**: Made a deal with a powerful entity and now wields borrowed luck at a price
- **The Thrill Seeker**: Addicted to the rush of risk, constantly pushing their luck to feel alive
- **The Statistical Savant**: Uses probability and mathematics to turn randomness into advantage

**Personality Traits**: Gamblers tend to be confident, charismatic, and comfortable with uncertainty. They often have a flair for the dramatic, turning every action into a performance. Some are superstitious, carrying lucky charms and following elaborate rituals, while others are coldly analytical, treating every situation as a probability calculation.

**Physical Manifestations**: A Gambler's connection to fortune often manifests subtly—dice that always seem to roll in their favor, coins that land on the desired side, or an aura that makes others feel either lucky or unlucky in their presence. Some carry enchanted gambling implements that glow when fortune favors them.`,
    },

    combatRole: {
      title: "Combat Role",
      content: `**Primary Role**: Versatile Damage Dealer with Utility

The Gambler occupies a unique niche as a damage dealer whose output varies wildly based on luck and Fortune Point management. They can swing from devastating burst damage to complete whiffs, making them exciting but unpredictable.

**Damage Output**: Highly variable—can match top-tier damage dealers on lucky streaks or fall behind on unlucky ones. Fortune Points allow skilled players to smooth out variance.

**Utility**: Exceptional utility through probability manipulation, rerolls, and fate-altering abilities that can turn failures into successes for themselves and allies.

**Battlefield Control**: Creates uncertainty for enemies through unpredictable effects, forced gambles, and luck-based debuffs.

**Support Capabilities**: Can grant rerolls, manipulate enemy rolls, and provide luck-based buffs to allies.

**Strengths**:
- Extreme burst damage potential when luck aligns
- Fortune Points provide strategic control over randomness
- Versatile toolkit for various situations
- Excellent at turning bad situations around with lucky rolls
- Strong utility and support options
- Thrives in high-stakes moments

**Weaknesses**:
- Inconsistent damage output without Fortune Point investment
- Some abilities can backfire spectacularly
- Requires good Fortune Point management to be effective
- Less reliable than consistent damage dealers
- Can accidentally harm allies with chaotic effects
- Vulnerable when Fortune Points are depleted

**Team Dynamics**:
- Works well with adaptable teams who can capitalize on random opportunities
- Synergizes with support classes who can mitigate bad luck
- Benefits from tanks who can protect during unlucky streaks
- Provides valuable reroll support for critical ally actions`,
    },

    playstyle: {
      title: "Playstyle & Strategy",
      content: `Playing a Gambler is about managing risk versus reward and knowing when to trust in luck versus when to spend Fortune Points for guaranteed results.

**Core Gameplay Loop**:
1. **Build Fortune Points** through successful attacks and spell casts
2. **Take calculated risks** with luck-based abilities
3. **Spend Fortune Points** to adjust critical rolls
4. **Capitalize on lucky streaks** while they last

**Fortune Point Management** (thresholds scale with your spec's max):
- **Low Fortune (0-25%)**: Play conservatively, focus on building points, avoid high-risk abilities
- **Medium Fortune (25-50%)**: Moderate risk-taking, can afford to adjust important rolls
- **High Fortune (50-75%)**: Take big risks, use powerful abilities, adjust multiple rolls
- **Maximum Fortune (75-100%)**: Near-complete control, use highest-risk highest-reward abilities

**Risk Assessment**:
- **Low-Risk Abilities**: Consistent effects with minor random elements (Coin Toss, Gambler's Insight)
- **Medium-Risk Abilities**: Significant random variance but manageable consequences (Lucky Strike, Twist of Fate)
- **High-Risk Abilities**: Extreme variance with potential for disaster or triumph (Double or Nothing, Jackpot)
- **Ultimate Risk**: Life-or-death gambles with game-changing results (All-In, Death Roll)

**When to Spend Fortune Points**:
- To avoid catastrophic failures (preventing self-damage, ensuring critical hits land)
- To guarantee success on crucial rolls (boss damage, saving ally lives)
- To maximize already-good rolls into exceptional ones
- To turn near-misses into successes

**When to Save Fortune Points**:
- During trash encounters where variance is acceptable
- When Fortune Point count is low (below 5)
- Before boss fights or critical moments
- When abilities have acceptable failure states

**Specialization Strategies**:
- **Fortune's Favor**: Maximize coin flip manipulation, focus on rerolls and probability control
- **High Roller**: Embrace extreme risk/reward, bet resources for massive payoffs
- **Card Sharp**: Strategic gambling with calculated risks, deck manipulation

**Perfect For**: Players who enjoy randomness, dramatic moments, risk/reward decisions, and don't mind occasional spectacular failures in pursuit of legendary successes.`,
    },

    immersiveCombatExample: {
      title: "Combat Example: The House Always Wins",
      content: `**The Setup**: You're a Gambler (Card Sharp specialization, Fortune Point max: 13) facing a powerful ogre champion and two goblin minions. Your party needs you to deal damage, but your spells are gambling-based — high risk, high reward. Starting Fortune Points: 3 (from previous encounter). Starting Mana: 40/50. Your goal: Build Fortune Points through successful actions, use them to adjust critical rolls, and unleash devastating gambling abilities.

**Starting State**: Fortune Points: 3/13 | Mana: 40/50 | HP: 60/70

**Turn 1 - Building Fortune (FP: 3 → 4)**

*The ogre roars, raising its massive club. The goblins cackle, circling. You pull out a pair of enchanted dice, grinning. "Let's make this interesting."*

**Your Action**: Cast "Lucky Strike" on Ogre (7 mana, roll 4d12 and match for multiplier)
**4d12 Roll**: [8, 8, 3, 11] → Pair of 8s!
**Outcome**: Pair = Double damage + 1 Fortune Point
**Base Damage**: 1d8 → [5] = 5 damage
**Total Damage**: 5 × 2 = **10 damage**

*The dice glow golden as they land. A pair of eights. Not bad — double damage. The ogre snorts, barely feeling it.*

**Fortune Points Generated**: +1 FP (successful spell) + 1 FP (pair bonus) = +2 FP
**Fortune Points**: 3 + 2 = **5 FP**
**Mana**: 40 - 7 = 33/50

**Ogre's Turn**: Attacks you → [18] → Hit! → 3d8+5 → [6, 7, 5] + 5 = 23 damage
**Your HP**: 60 - 23 = 37/70

*The ogre's club slams into you. You're hurt, but you're SMILING. That pair built your stack.*

**Your Party's Healer**: Heals you for 15 HP
**Your HP**: 37 + 15 = 52/70

**Current State**: FP: 5/13 | Mana: 33/50 | HP: 52/70

**Turn 2 - The Gamble (FP: 5 → 7)**

*You're at 5 Fortune Points. Time to use your signature spell: "Jackpot" — roll 3d20, sum them, and consult the outcome table. Higher sums mean bigger payouts.*

**Your Action**: Cast "Jackpot" on Ogre (28 mana, roll 3d20 and sum for outcome tier)
**3d20 Roll**: [12], [7], [19]
**Sum**: 12 + 7 + 19 = **38**

*Three magical slot machine reels appear above the ogre. They spin, then STOP. 12. 7. 19. You check the table...*

**Outcome Lookup**: Sum 38 → "Moderate Win" (Sum 26-38 tier) → 4d10 force damage + stun for 1 round + gain 1 FP

*Not bad, but you have 5 Fortune Points. Scanning the table, Sum 39-48 is "Big Win" for 6d10 damage + stun for 2 rounds + gain 2 FP. You need to shift that 12 up to at least 15 to break into the next tier. That costs 3 FP — affordable.*

**Decision**: Spend 3 Fortune Points to change [12] to [15]
**Fortune Points**: 5 - 3 = **2 FP**
**Adjusted Roll**: [15], [7], [19]
**New Sum**: 15 + 7 + 19 = **41**
**Outcome Lookup**: Sum 41 → "Big Win" (Sum 39-48 tier) → 6d10 force damage + stun for 2 rounds + gain 2 FP

*You snap your fingers. The first reel SHIFTS from 12 to 15. The sum climbs to 41. Big Win territory!*

**Damage Roll**: 6d10 → [8, 9, 7, 10, 6, 8] = **48 damage!**
**Effect**: Ogre stunned for 2 rounds
**Fortune Points Generated**: +1 FP (successful spell) + 2 FP (Big Win bonus) = +3 FP total
**Fortune Points**: 2 + 3 = **5 FP**

*The ogre is BLASTED by magical energy. It falls to one knee, stunned. The goblins back away, terrified.*

**Mana**: 33 - 28 = 5/50
**Current State**: FP: 5/13 | Mana: 5/50 | HP: 52/70 | Ogre: Stunned (2 rounds)

**Turn 3 - Low Mana, Smart Play (FP: 5 → 6)**

*The ogre is stunned. Time to clean up a goblin, but you're almost out of mana. Time for a cheap spell.*

**Your Action**: Cast "Lucky Toss" on Goblin #1 (3 mana, flip a coin — heads deals damage, tails gives a buff)
**Coin Flip**: Heads or Tails? → [Heads]
**Outcome**: Heads → 1d8 + CHA force damage to Goblin #1

**Damage Roll**: 1d8 + 3 (CHA mod) → [6] + 3 = **9 damage**

*You flip a golden coin. Heads. A bolt of luck-infused energy strikes the goblin. It crumples.*

**Result**: Goblin #1 DEAD
**Fortune Points Generated**: +1 FP (successful spell)
**Fortune Points**: 5 + 1 = **6 FP**
**Mana**: 5 - 3 = 2/50

**Goblin #2's Turn**: Attacks you → [11] → Miss!

**Current State**: FP: 6/13 | Mana: 2/50 | HP: 52/70

**Turn 4 - The Ultimate Gamble (FP: 6 → 3)**

*The ogre shakes off the stun. It's wounded (58 damage taken total) but still alive. One goblin remains. You have 6 Fortune Points and almost no mana. Time for the ultimate gamble: "Death Roll."*

**Your Action**: Cast "Death Roll" on Ogre (24 mana... wait, you only have 2 mana.)

*You check your mana. 2. You need 24 for Death Roll. That's not happening. Time to improvise.*

**Your Action**: Attack with Duelist's Rapier (free action, 1d8+3 pierce)
**Attack Roll**: d20+5 → [14] = 19 → Hit!
**Damage**: 1d8+3 → [6]+3 = **9 damage**

*The rapier flashes. Not your best work, but the ogre is hurting.*

**Fortune Points Generated**: +1 FP (successful attack)
**Fortune Points**: 6 + 1 = **7 FP**

**Ogre's Turn**: Attacks you → [9] → Miss! (It's weakened from the stun.)

**Current State**: FP: 7/13 | Mana: 2/50 | HP: 52/70 | Ogre: 67 damage taken

**Turn 5 - The Comeback (FP: 7 → 3)**

*Your party's Alchemist tosses you a Mana Potion. Mana restored to 30/50. Now you can finish this.*

**Your Action**: Cast "Death Roll" on Ogre (24 mana, competitive d20 minigame)
**How It Works**: Both you and the target roll a d20. The lower roll becomes the new maximum. Both roll again. First to roll over the current max loses.

**Round 1**: You roll d20 → [15]. Ogre rolls d20 → [12]. Max becomes **12**.
**Round 2**: You roll d20 (max 12) → [8]. Under! Safe. Ogre rolls d20 (max 12) → [11]. Under! Safe.
**Round 3**: You roll d20 (max 11) → [9]. Under! Safe. Ogre rolls d20 (max 11) → [13]. OVER! **Ogre loses!**

*The dice clatter. 13 — over the limit of 11. The ogre's eyes widen as cosmic forces drag it down.*

**Result**: Ogre loses Death Roll. As the winner, you choose 5d10 psychic damage.
**Damage Roll**: 5d10 → [9, 8, 10, 7, 6] = **40 psychic damage!**
**Effect**: Ogre stunned for 1 round

*The ogre EXPLODES in a burst of psychic energy. Dead. The remaining goblin flees.*

**Fortune Points Generated**: +1 FP (successful spell) + 1 FP (won Death Roll) = +2 FP
**Fortune Points**: 7 - 0 (no adjustment needed) + 2 = **7 FP**
**Mana**: 30 - 24 = 6/50

**Combat Over**

*You stand among the corpses, breathing heavily. Your party stares at you.*

**Your Party's Tank**: "Did you just... gamble the ogre to death?"
**You**: "I didn't gamble. I CALCULATED. I used my FP to shift Jackpot from sum 38 to sum 41 — that moved me from Moderate Win to Big Win, adding 24 damage and an extra stun round. Then I played Death Roll clean — the ogre busted on round 3."
**Your Party's Mage**: "But what if you'd rolled lower in Death Roll?"
**You**: "Then I would have spent Fortune Points to adjust. That's the secret — build Fortune Points through successful actions, then spend them to turn near-losses into wins. The dice are random, but the strategy isn't."

**Final State**: FP: 7/13 (banked for next fight) | Mana: 6/50 | HP: 52/70

**The Lesson**: Gambler gameplay is about:
1. **Fortune Point Generation**: Generated 10 FP total across the fight (from successful attacks, spells, and gamble bonuses)
2. **Fortune Point Spending**: Spent 3 FP total (to shift Jackpot die from 12 to 15, moving up a tier)
3. **Tier Manipulation**: The core Jackpot strategy is sum-based — spending FP to shift individual dice moves your total into higher payout tiers
4. **Resource Awareness**: Low mana forced creative play in Turns 3-4 (cheap spells, weapon attacks)
5. **Death Roll**: A competitive minigame where both sides roll d20s with a descending ceiling. FP can adjust rolls mid-game to stay under the limit or push the enemy over
6. **Risk Management**: Used cheap spells (Lucky Toss at 3 mana) when mana was low, saved the big guns for when mana was restored
7. **Total Damage**: Dealt 10 (Lucky Strike) + 48 (Jackpot) + 9 (Lucky Toss, killed goblin) + 9 (Rapier) + 40 (Death Roll) = **116 damage** across 5 turns

You're not a consistent damage dealer. You're a GAMBLER who manipulates probability. You roll dice, flip coins, spin slot machines — but you're not leaving it to chance. You build Fortune Points through successful actions, then spend them to shift outcomes into your favor. When your Jackpot sum lands at 38, you don't accept "Moderate Win" — you spend 3 FP to push it to 41 and collect "Big Win." When Death Roll comes down to the wire, you spend FP to stay under the ceiling while your opponent busts. The randomness is real, but you control it. That's the Gambler's edge.`,
    },
  },

  characterCreation: {
    title: "Character Creation",
    primaryStat: "Charisma",
    secondaryStat: "Agility",
    savingThrows: ["Charisma", "Agility"],
    armorProficiency: ["Light"],
    weaponProficiency: ["Simple", "Rapier", "Dagger", "Crossbow (Hand)"],
    toolProficiency: ["Gaming Set (All)", "Disguise Kit"],
    skillRecommendations: ["Deception", "Insight", "Perception", "Persuasion"],
    guide: [
      "Choose Charisma as your highest stat — it drives Fortune Point generation and your spell damage.",
      "Agility keeps you alive in light armor. Constitution is your third priority.",
      "Select the Duelist fighting style for the rapier — your weapon attacks generate Fortune Points.",
      "Pick Deception and Insight as your first skills — they define the Gambler identity.",
    ],
  },

  startingEquipment: {
    title: "Starting Equipment",
    weapons: [
      {
        name: "Duelist's Rapier",
        damage: "1d8+3 pierce",
        properties: ["Finesse", "Versatile (1d10)"],
        note: "Your Fortune Point generator",
      },
      {
        name: "Dagger",
        damage: "1d4+3 pierce",
        properties: ["Finesse", "Light", "Thrown (20ft)"],
        note: "Backup weapon",
      },
    ],
    armor: { name: "Leather Armor", ac: "11 + AGI modifier", type: "Light" },
    items: [
      {
        name: "Lucky Coin",
        description:
          "Spell focus for coin-flip abilities. Glows faintly when Fortune favors you.",
      },
      {
        name: "Set of Loaded Dice",
        description:
          "A pair of d20s that feel slightly heavier than normal. Spell focus for dice abilities.",
      },
      {
        name: "Deck of Marked Cards",
        description:
          "A worn deck with subtle marks on each card. Spell focus for card abilities.",
      },
      {
        name: "50ft Silk Rope",
        description:
          "Useful for escapes, distractions, and creative problem-solving.",
      },
      {
        name: "Pouch of 15 Gold Pieces",
        description: "Starting funds. The house always provides a stake.",
      },
      {
        name: "Traveler's Clothes",
        description: "Well-fitted but unremarkable. Perfect for blending in.",
      },
    ],
    gold: 15,
  },

  // Resource System
  resourceSystem: {
    title: "Fortune Points (FP)",
    subtitle: "The House Always Wins",

    description: `The Gambler is a master of probability who views the battlefield as a high-stakes table. Your core resource is **Fortune Points** (FP). You build these points through successful plays and spend them to "cheat" fate—adjusting the results of your dice after they have already landed. While others rely on luck, you manipulate it.`,

    cards: [
      {
        title: "Fortune Points (FP)",
        stats: "Cap: 7 / 13 / 21",
        details:
          "Max points vary by spec (Favor / Sharp / Roller). Base FP spending adjusts YOUR OWN d20 attack rolls, damage rolls, saving throws, and ability checks by ±1 per point. Certain abilities (Cheat Fate, Death Roll) expand this scope to other rolls.",
      },
      {
        title: "Probability Tweak",
        stats: "Post-Roll Action",
        details:
          "Spend points AFTER the dice land and modifiers are applied, but BEFORE the DM determines success or failure. Turn a 19 into a 20 instantly.",
      },
      {
        title: "The Payout",
        stats: "Success Bonus",
        details:
          "Generating points through criticals or winning major gambles (Jackpots) rewards extra FP.",
      },
    ],

    generationTable: {
      headers: ["Action", "FP Gained", "Notes"],
      rows: [
        ["Successful Attack", "+1 FP", "Includes melee and ranged weapons"],
        [
          "Successful Spell",
          "+1 FP",
          "Must land on a target or resolve effect",
        ],
        ["Critical Success", "+2 FP", "Natural 20s are the ultimate fuel"],
        ["Winning a Gamble", "+1 FP", "Successful coin flip or slot match"],
        [
          "Big Win (Jackpot)",
          "+2 to +5 FP",
          "Specific high-tier spell outcomes",
        ],
      ],
    },

    usage: {
      momentum:
        'Early rounds should be spent on low-risk attacks to build your chip stack. Once you hit 50% of your cap, you have enough "insurance" to start using high-risk abilities like Death Roll.',
      flourish:
        "⚠️ Near-Miss Fishing: Watch for rolls of 18 or 19. Spending just 1-2 FP to force a Critical Hit is the most efficient use of your resource.",
    },

    overheatRules: {
      title: "Bankruptcy",
      content: `Bankruptcy triggers in two specific situations:

**Trigger A — All-In Death Window**: When you cast "All-In" and roll in the death window (91-100 adjusted for FP spent), you drop to 0 HP and suffer Bankruptcy.

**Trigger B — Double or Nothing Self-Kill**: When "Double or Nothing" misses AND the self-damage reduces you to 0 HP, you suffer Bankruptcy.

**The Effect**: Your Fortune Points drop to 0, and you cannot generate Fortune Points or cast Gambler spells for 2 rounds as the cosmic debt collectors take their due. You may still make basic weapon attacks.

**Note**: Missing a gamble, rolling low on Jackpot, or running out of FP does NOT trigger Bankruptcy. Only the two specific triggers above can cause it.`,
    },

    strategicConsiderations: {
      title: "Playing the Odds",
      content: `**High Roller Spec**: With a cap of 21, you can turn a total failure (roll of 1) into a critical success (roll of 20) in a single turn—if you have the chips.

**Persistence**: FP persists between combats. Start the "Boss Fight" by spending your banked points from the minions to ensure your opening ultimate lands.`,
    },

    playingInPerson: {
      title: "Playing in Person",
      subtitle: "The Chip Stack",
      content: `The Gambler is the most tactile class in the game. Don't use a pencil—use components.

**Required Materials**:
- **Poker Chips**: (7 for Favor, 13 for Sharp, 21 for High Roller).
- **A Thematic Coin**: (For flips).
- **A Dice Tray**: (The "Table").

**The Physical Hack (Friction Points)**:
- **The Chip Stack**: Stack your FP chips in plain view. When you use an ability with a "cost," push those chips into the center of the table (The Pot). If the spell succeeds, pull them back with your "Generation" payout. If it fails, the DM takes them.
- **The "Cheat" Flash**: When spending FP to adjust a die, physically tap the die with a chip before turning it to the new number. It makes the "cheat" feel intentional and cool.
- **The Bankruptcy Marker**: If you go Bust, place a black cloth or card over your chips. It signals to the table that the house has closed your account for now.

**Pro Tip**: For the High Roller spec, use actual casino-grade chips. The weight and sound of the chips moving across the table adds a layer of tension that a digital counter can't match.`,
    },
  },

  // Specializations
  specializations: {
    title: "Gambler Specializations",
    subtitle: "Three Paths of Fortune",

    description: `Every Gambler chooses one of three specializations that define their approach to luck manipulation and risk-taking. Each specialization has its own Fortune Point maximum, unique passive ability, and a dedicated talent tree that shares its name:

- **Fortune's Favor** (Max 7 FP) — Coin flip specialist. Talent tree: Fortune's Favor (was Luck Manipulation)
- **High Roller** (Max 21 FP) — Extreme risk/reward. Talent tree: High Roller (was Risk Management)
- **Card Sharp** (Max 13 FP) — Strategic gambler. Talent tree: Card Sharp (was Fate Control)

You may spend talent points in any tree, but your specialization's tree synergizes best with your passive ability.`,

    // Shared passive for all Gambler specializations
    sharedPassive: {
      name: "Loaded Dice",
      icon: "Social/Dice Roll",
      description:
        "Choose a number between 2 and 19 at the start of each day. Whenever you roll that number or within 1 of it on any d20 (for any purpose), you may spend 1 Fortune Point to reroll that die and use the new result. For example, if you choose 10, this triggers on rolls of 9, 10, or 11.",
      mechanicsNote:
        "15% trigger rate (3 numbers on a d20) makes this passive relevant most sessions. Choose your number based on common roll targets — 10 covers the widest tactical range, while 15 or 20 maximizes crit-fishing potential.",
    },

    specs: [
      {
        id: "fortunes-favor",
        name: "Fortune's Favor",
        icon: "Utility/Utility",
        color: "#c9aa71",
        theme: "Luck Manipulation",

        description: `Masters of coin flips and probability. Fortune's Favor Gamblers bend luck to their will, granting rerolls and shaping chance-based outcomes in their favor.`,

        playstyle:
          "Probability control, reroll manipulation, consistent luck-based advantages",

        strengths: [
          "Most consistent Gambler specialization",
          "Excellent support through reroll granting",
          "Strong defensive options via luck manipulation",
          "Can influence both ally and enemy rolls",
          "Lower risk than other specializations",
        ],

        weaknesses: [
          "Lower maximum damage potential than High Roller",
          "Requires Fortune Points to be truly effective",
          "Less spectacular results than other specs",
          "Coin flip mechanics still have 50/50 variance",
        ],

        uniquePassive: {
          name: "Lucky Streak",
          icon: "Healing/Renewal",
          description:
            "After 3 consecutive successful attacks/spells, your next coin flip auto-succeeds on the favorable outcome. Resets after use or after missing.",
          mechanicsNote:
            "Rewards consistent play and reduces variance during hot streaks. Pairs well with low-risk attacks to build up guaranteed coin flip successes.",
        },

        keyAbilities: [
          "Fate's Coin - Flip a magical coin and choose one of six effects. Heads grants a powerful benefit, tails gives a lesser benefit or minor drawback. (5 mana, spend 1 Fortune Point to flip the result)",
          "Fate's Blessing - Grant an ally advantage on their next roll or force an enemy to reroll a successful attack/save. (2 mana, spend additional Fortune Points for multiple rerolls)",
          "Cheat Fate - As a reaction, adjust any visible roll within 30 feet by ±2 before the outcome is determined. (3 mana, costs 3 Fortune Points to activate)",
        ],

        recommendedFor:
          "Players who want more control over randomness, enjoy supporting allies, and prefer consistent results over extreme variance.",
      },

      {
        id: "high-roller",
        name: "High Roller",
        icon: "Utility/Glowing Shard",
        color: "#7a3b2e",
        theme: "High Stakes Betting",

        description: `Extreme risk for extreme reward. High Rollers bet their own HP, mana, and resources on gambles that yield devastating results or catastrophic failures—all or nothing, every time.`,

        playstyle:
          "Extreme risk/reward, resource betting, all-or-nothing plays",

        strengths: [
          "Highest damage potential of all Gambler specs",
          "Can turn near-death situations into victories",
          "Spectacular comeback potential",
          "Resource betting allows for massive burst damage",
          "Thrilling, dramatic gameplay moments",
        ],

        weaknesses: [
          "Extremely high risk of self-damage or death",
          "Can deplete resources quickly on bad luck",
          "Requires excellent Fortune Point management",
          "Vulnerable when bets fail",
          "Can accidentally kill themselves",
        ],

        uniquePassive: {
          name: "Double Down",
          icon: "Social/Dice Roll",
          description:
            'Whenever you successfully land a damaging ability, you may immediately spend 2 Fortune Points to "double down" and repeat the ability at half mana cost. If the second cast also succeeds, gain 1 Fortune Point. If it fails, lose 2 Fortune Points. Once per turn.',
          mechanicsNote:
            "High-risk passive that can chain successes into combos. Net FP per successful chain: -1 (spend 2, gain 1). Once per turn prevents infinite loops. Best used when you can afford the mana cost and need burst damage.",
        },

        keyAbilities: [
          "All-In - Bet your current hit points. Roll a d100. Each Fortune Point spent (up to 10) shrinks the death window by 1%. At 0 FP: 1-50 double HP, 51-90 full heal, 91-100 drop to 0 HP. At 10 FP: death window eliminated. (10 mana, spend Fortune Points to guarantee survival)",
          "Double or Nothing - Make an attack roll. If it hits, it automatically becomes a critical hit dealing double damage. If it misses, you take the damage you would have dealt. (5 mana, spend Fortune Points to ensure hit)",
          "Betting Blitz - Bet up to half your max HP. If your next attack deals damage equal to or greater than double the bet amount, regain the health. Otherwise, lose the health bet. (5 mana, spend Fortune Points to increase damage)",
        ],

        recommendedFor:
          "Players who love extreme risk/reward, enjoy dramatic moments, and don't mind occasional spectacular failures in pursuit of legendary victories.",
      },

      {
        id: "card-sharp",
        name: "Card Sharp",
        icon: "Utility/Utility",
        color: "#daa520",
        theme: "Strategic Gambling",

        description: `Strategic masterminds who treat combat like a high-stakes card game. Card Sharps specialize in prediction, pattern recognition, and calculated risks, turning randomness into advantage through analysis.`,

        playstyle: "Calculated risks, prediction mechanics, strategic gambling",

        strengths: [
          "Most strategic Gambler specialization",
          "Rewards skill and game knowledge",
          "Strong competitive abilities (Death Roll, Taunt the Odds)",
          "Excellent against intelligent enemies",
          "Prediction mechanics can provide huge advantages",
        ],

        weaknesses: [
          "Requires good game knowledge to maximize",
          "Prediction abilities can fail completely",
          "Less effective against mindless enemies",
          "Competitive abilities require willing or forced participation",
          "Moderate damage compared to High Roller",
        ],

        uniquePassive: {
          name: "Card Counting",
          icon: "Utility/Ornate Staff",
          description:
            "You mentally track d20 results during combat. Your prediction accuracy improves the more rolls you observe: 2 rolls observed → guess range expands from ±3 to ±4; 4 rolls → ±5; 5+ rolls → your next prediction-based ability (Taunt the Odds, or any ability requiring you to guess a d20 result) automatically treats your guess as if it were within the success threshold (guaranteed hit, no self-damage risk). Resets after use or at the end of combat.",
          mechanicsNote:
            'Track every d20 roll you see. At 2 rolls, your Taunt the Odds range expands to ±4. At 4 rolls, ±5. At 5+ rolls, your next Taunt the Odds auto-hits (target takes 3d10 damage with no risk of self-damage). This rewards attentiveness and makes Card Sharp the "counting cards" spec. Display your current observation count on the HUD.',
        },

        keyAbilities: [
          "Jackpot - Roll 3d20 slot machine and sum the results for outcome tiers. Higher sums yield bigger payouts. Triples grant bonus effects. (8 mana, spend Fortune Points to adjust individual dice)",
          "Death Roll - Challenge a creature to a descending d20 game. Both roll d20s with a shrinking ceiling — first to roll over the current max loses. (8 mana, spend Fortune Points to adjust rolls mid-game)",
          "Taunt the Odds - Choose a target and guess the result of a d20 roll. If you guess within 3, the target takes 3d10 damage. If you're off by more than 3, you take 1d10 damage. (4 mana, Card Counting passive gives advantage)",
        ],

        recommendedFor:
          "Players who enjoy strategic gameplay, prediction mechanics, and using game knowledge to gain advantages.",
      },
    ],
  },

  // Example Spells - showcasing the gambling mechanics
  exampleSpells: [
    {
      id: "lucky-strike",
      name: "Lucky Strike",
      icon: "Healing/Renewal",
      spellType: "ACTION",
      level: 2,

      description:
        "Roll 4d12 before attacking. Matching dice set your multiplier: 4-of-a-kind deals 4x, triple deals 3x, pair deals 2x. All different? Normal damage only, no Fortune Points generated.",

      typeConfig: {
        school: "force",
        castTime: 1,
        castTimeType: "IMMEDIATE",
        tags: [
          "damage",
          "fortune generation",
          "variable",
          "rollable table",
          "gambler",
        ],
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 50,
        targetRestrictions: ["enemy"],
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 7 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Fortuna!",
        somaticText: "Roll dice in hand",
        classResource: { type: "fortune_points", cost: 1 },
      },

      resolution: "DICE",
      effectTypes: ["damage"],

      damageConfig: {
        formula: "2d6 + 2",
        damageTypes: ["force"],
        scalingType: "multiplier",
        resolution: "DICE",
      },

      specialMechanics: {
        fortunePoints: {
          generates: "variable",
          description:
            "4 match: +3, 3 match: +2, 2 match: +1, all different: +0",
        },
        diceMatching: {
          dice: "4d12",
          matchingRules: "Compare dice for matching numbers",
        },
      },

      rollableTable: {
        enabled: true,
        name: "Lucky Strike Results",
        description: "Roll 4d12 and check for matching numbers",
        resolutionType: "DICE",
        resolutionConfig: { diceType: "4d12" },
        entries: [
          {
            range: "All 4 match",
            result:
              "Quadruple damage + 3 Fortune Points + Guaranteed critical hit",
            description: "Example: 12-12-12-12",
          },
          {
            range: "3 match",
            result: "Triple damage + 2 Fortune Points",
            description: "Example: 8-8-8-3",
          },
          {
            range: "2 match",
            result: "Double damage + 1 Fortune Point",
            description: "Example: 5-5-9-2",
          },
          {
            range: "All different",
            result: "Normal damage only. No Fortune Points generated.",
            description: "Example: 1-4-7-11",
          },
        ],
      },

      tags: [
        "damage",
        "fortune generation",
        "variable",
        "rollable table",
        "gambler",
      ],

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 2,
      },
    },

    {
      id: "fates-coin",
      name: "Fate's Coin",
      icon: "Utility/Utility",
      spellType: "ACTION",
      level: 3,

      description:
        "Flip a magical coin and choose one of six effects. Heads grants a powerful benefit, tails gives a lesser benefit or minor drawback. Spend 1 Fortune Point to flip the result.",

      typeConfig: {
        school: "force",
        castTime: 1,
        castTimeType: "IMMEDIATE",
        tags: [
          "utility",
          "buff",
          "debuff",
          "coin flip",
          "rollable table",
          "gambler",
          "fortunes-favor",
        ],
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
        targetRestrictions: ["ally", "self"],
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 10 },
        actionPoints: 1,
        components: ["verbal", "material"],
        verbalText: "Fatum Nummus!",
        materialComponents: "A golden coin",
        classResource: { type: "fortune_points", cost: 1 },
      },

      resolution: "COINS",
      effectTypes: ["buff", "utility"],

      buffConfig: {
        buffType: "statusEffect",
        effects: [
          {
            id: "fates_favor",
            name: "Fate's Favor",
            description:
              "Choose one of six coin effects before flipping. Heads grants a powerful benefit, tails gives a lesser benefit or minor drawback.",
            mechanicsText:
              "Choose one of six coin effects. Heads: powerful benefit, Tails: lesser benefit or minor drawback",
          },
        ],
        durationValue: 1,
        durationType: "minutes",
        durationUnit: "minutes",
        concentrationRequired: false,
        canBeDispelled: true,
      },

      utilityConfig: {
        utilityType: "fate_manipulation",
        selectedEffects: [
          {
            id: "flip_result",
            name: "Flip Result",
            description:
              "Spend 1 Fortune Point to flip the coin result (Heads to Tails or vice versa)",
          },
        ],
        duration: 0,
        durationUnit: "instant",
        concentration: false,
        power: "moderate",
      },

      specialMechanics: {
        fortunePoints: {
          cost: 1,
          effect: "Flip the coin result (Heads to Tails or vice versa)",
        },
        coinFlip: {
          type: "choice_based",
          choices: 6,
          description: "Choose one of six coin effects before flipping",
        },
      },

      rollableTable: {
        enabled: true,
        name: "Fate's Coin Effects",
        description: "Choose one effect, then flip a coin",
        resolutionType: "COIN_FLIP",
        resolutionConfig: { diceType: "coin" },
        entries: [
          {
            range: "Coin of Fortune",
            result:
              "Heads: Advantage on next roll | Tails: Disadvantage on next roll",
            description: "Affects your next attack roll or saving throw",
          },
          {
            range: "Coin of Double or Nothing",
            result:
              "Heads: Double next attack damage | Tails: Halve next attack damage",
            description: "Affects your next damaging attack",
          },
          {
            range: "Coin of Heal or Harm",
            result: "Heads: Heal 2d6 HP | Tails: Take 1d6 damage",
            description: "Immediate healing or self-damage",
          },
          {
            range: "Coin of Mana Surge",
            result: "Heads: Regain one spell use | Tails: Lose one spell use",
            description: "Affects your available spell slots",
          },
          {
            range: "Coin of Teleport or Trap",
            result: "Heads: Teleport 30 feet | Tails: Restrained for 1 round",
            description: "Movement manipulation",
          },
          {
            range: "Coin of Speed",
            result:
              "Heads: Double movement for 1 min | Tails: Halve movement for 1 min",
            description: "Speed modification",
          },
        ],
      },

      tags: [
        "utility",
        "buff",
        "debuff",
        "coin flip",
        "rollable table",
        "gambler",
        "fortunes-favor",
      ],

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 3,
      },
    },

    {
      id: "jackpot",
      name: "Jackpot",
      icon: "Utility/Utility",
      spellType: "ACTION",
      level: 8,

      description:
        "Roll 3d20 slot machine. Add all three dice — the total determines your outcome tier. Triples grant bonus effects on top of their tier. Spend Fortune Points to adjust individual dice by ±1 per point, moving results up or down tiers. NOTE: Jackpot draws from ALL elements (fire, lightning, radiant, necrotic) — it is the only Gambler ability that breaks the force/psychic convention, because it doesn't play by any rules.",

      typeConfig: {
        school: "psychic",
        castTime: 1,
        castTimeType: "IMMEDIATE",
        tags: [
          "ultimate",
          "random",
          "high risk",
          "high reward",
          "rollable table",
          "gambler",
          "card-sharp",
        ],
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 28 },
        actionPoints: 2,
        components: ["verbal", "somatic", "material"],
        verbalText: "Fortuna Maxima!",
        somaticText: "Pull imaginary slot machine lever",
        materialComponents: "Three golden dice",
        classResource: { type: "fortune_points", cost: 7 },
      },

      resolution: "DICE",
      effectTypes: ["utility"],

      utilityConfig: {
        utilityType: "fate_manipulation",
        selectedEffects: [
          {
            id: "slot_machine",
            name: "Slot Machine",
            description:
              "Roll 3d20 and sum the results. Higher sums yield better outcomes. Triples grant bonus effects. Spend Fortune Points to adjust individual dice by ±1 per point.",
          },
        ],
        duration: 1,
        durationUnit: "hours",
        concentration: false,
        power: "major",
      },

      specialMechanics: {
        fortunePoints: {
          usage:
            "Adjust individual dice by ±1 per point spent to move the total into a higher tier",
          example:
            "Roll [12, 7, 19] = sum 38 (Moderate Win). Spend 3 FP to shift 12→15: [15, 7, 19] = sum 41 (Big Win)",
        },
        usageLimit: {
          type: "long_rest",
          restriction:
            "Each specific outcome tier can only produce its bonus effect once per long rest. Repeated tiers grant the base damage only.",
        },
        slotMachine: {
          dice: "3d20",
          mechanic: "sum_based",
          sumRange: "3-60",
          averageSum: "31.5",
        },
      },

      rollableTable: {
        enabled: true,
        name: "Jackpot Slot Machine",
        description:
          "Roll 3d20, add the results, and consult the table below. Triples grant bonus effects on top of their tier.",
        resolutionType: "DICE",
        resolutionConfig: { diceType: "3d20" },
        entries: [
          {
            range: "Sum 3 (1-1-1 only)",
            result:
              "Take 5d10 damage + lose all spell uses for the day. Triple bonus: None — you wagered everything on the worst possible roll.",
            description: "Critical failure",
          },
          {
            range: "Sum 4-12",
            result:
              "Take 2d6 force damage. Gain 1 Fortune Point as consolation.",
            description: "Bad Luck",
          },
          {
            range: "Sum 13-25",
            result:
              "Deal 2d10 force damage to one enemy within 30ft. Gain 1 Fortune Point.",
            description: "Small Win",
          },
          {
            range: "Sum 26-38",
            result:
              "Deal 4d10 force damage to one enemy + stun for 1 round. Gain 1 Fortune Point.",
            description: "Moderate Win",
            example: "[12, 7, 19] = 38",
          },
          {
            range: "Sum 39-48",
            result:
              "Deal 6d10 force damage to one enemy + stun for 2 rounds. Gain 2 Fortune Points.",
            description: "Big Win",
            example: "[15, 7, 19] = 41",
          },
          {
            range: "Sum 49-55",
            result:
              "Deal 8d10 radiant damage to all enemies in 30ft. Gain 2 Fortune Points.",
            description: "Massive Win",
          },
          {
            range: "Sum 56-59",
            result:
              "Deal 10d10 radiant damage to all enemies in 30ft + heal 30 HP. Gain 3 Fortune Points.",
            description: "Near Jackpot",
          },
          {
            range: "Sum 60 (20-20-20 only)",
            result:
              "Deal 10d10 radiant damage to all enemies in 40ft + gain a rare magical item + max damage on all attacks for 1 hour. Gain 5 Fortune Points.",
            description: "PERFECT JACKPOT",
          },
          {
            range: "Triple 2s",
            result: "Life drain 3d10 on one enemy within 30ft",
            description: "Triple Bonus",
          },
          {
            range: "Triple 3s",
            result: "Heal 20 HP + gain all damage resistances for 1 hour",
            description: "Triple Bonus",
          },
          {
            range: "Triple 4s",
            result:
              "6d6 fire damage to all creatures in 20ft (including yourself)",
            description: "Triple Bonus",
          },
          {
            range: "Triple 5s",
            result: "Gain a shield that absorbs 50 damage for 1 hour",
            description: "Triple Bonus",
          },
          {
            range: "Triple 6s",
            result:
              "Summon a celestial guardian with +5 AC and +5 saves for 1 minute",
            description: "Triple Bonus",
          },
          {
            range: "Triple 7s",
            result: "Regain all spent spell uses + heal 50 HP",
            description: "Triple Bonus",
          },
          {
            range: "Triple 8s",
            result: "Gain an extra turn immediately",
            description: "Triple Bonus",
          },
          {
            range: "Triple 9s",
            result:
              "Double spell damage for 1 minute, but take 2d10 psychic damage per spell cast",
            description: "Triple Bonus",
          },
          {
            range: "Triple 10s",
            result: "Gain advantage on all attacks + heal 30 HP for 1 hour",
            description: "Triple Bonus",
          },
          {
            range: "Triple 11s",
            result:
              "Gain all damage resistance + 2d10 radiant bonus on your next attack for 1 hour",
            description: "Triple Bonus",
          },
          {
            range: "Triple 12s",
            result: "Deal 8d10 lightning damage to all enemies in 40ft",
            description: "Triple Bonus",
          },
          {
            range: "Triple 13s",
            result: "Deal 4d10 lightning damage to up to 3 enemies within 60ft",
            description: "Triple Bonus",
          },
          {
            range: "Triple 14s",
            result:
              "Become ethereal for 1 minute (can pass through walls and creatures)",
            description: "Triple Bonus",
          },
          {
            range: "Triple 15s",
            result: "Gain +5 to attack rolls and AC for 10 minutes",
            description: "Triple Bonus",
          },
          {
            range: "Triple 16s",
            result: "Heal 40 HP + gain all damage resistances for 1 hour",
            description: "Triple Bonus",
          },
          {
            range: "Triple 17s",
            result: "Summon an ethereal dragon ally for 1 minute",
            description: "Triple Bonus",
          },
          {
            range: "Triple 18s",
            result: "Gain advantage on all saving throws for 1 hour",
            description: "Triple Bonus",
          },
          {
            range: "Triple 19s",
            result:
              "Deal 5d10 radiant damage to all enemies in 30ft + gain 10 temporary HP",
            description: "Triple Bonus",
          },
        ],
      },

      tags: [
        "ultimate",
        "random",
        "high risk",
        "high reward",
        "rollable table",
        "gambler",
        "card-sharp",
      ],

      cooldownConfig: {
        cooldownType: "long_rest",
        cooldownValue: 1,
      },
    },

    {
      id: "all-in",
      name: "All-In",
      icon: "Social/Dice Roll",
      spellType: "ACTION",
      level: 10,

      description:
        "Bet your current HP on d100 roll. Each Fortune Point spent (up to 10) shrinks the death window by 1%. At 0 FP spent: 1-50 double HP, 51-90 full heal, 91-100 DEATH. At 10 FP spent: death window eliminated, 51-100 always full heal.",

      typeConfig: {
        school: "psychic",
        castTime: 1,
        castTimeType: "IMMEDIATE",
        tags: [
          "ultimate",
          "life or death",
          "extreme risk",
          "healing",
          "rollable table",
          "gambler",
          "high-roller",
        ],
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 36 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "Omnia Aut Nihil!",
        somaticText: "Push all chips forward",
        classResource: { type: "fortune_points", cost: 10 },
      },

      resolution: "DICE",
      effectTypes: ["healing", "utility"],

      healingConfig: {
        formula: "variable",
        healingType: "direct",
        description: "Roll d100. Results determine your fate.",
      },

      utilityConfig: {
        utilityType: "fate_manipulation",
        selectedEffects: [
          {
            id: "life_gamble",
            name: "Life or Death Gamble",
            description:
              "Bet your current HP on a d100 roll. Fortune Points can adjust the result.",
          },
        ],
        duration: 0,
        durationUnit: "instant",
        concentration: false,
        power: "major",
      },

      specialMechanics: {
        fortunePoints: {
          critical: true,
          recommendation: "5-10 points to shrink death window",
          usage:
            "Each FP spent (max 10) reduces death window by 1%. With 10 FP: death window shrinks from 91-100 to just 100, or is eliminated entirely if you spend all 10.",
        },
        lifeOrDeath: {
          warning: "Can instantly kill you at 0 FP spent",
          scalingDeathWindow: {
            "0 FP spent": { safe: "1-90", death: "91-100" },
            "5 FP spent": { safe: "1-95", death: "96-100" },
            "10 FP spent": { safe: "1-100", death: "ELIMINATED" },
          },
        },
      },

      rollableTable: {
        enabled: true,
        name: "All-In Results",
        description:
          "Roll 1d100 - your life is on the line. Death window shrinks by 1% per Fortune Point spent (max 10).",
        resolutionType: "DICE",
        resolutionConfig: { diceType: "1d100" },
        entries: [
          {
            range: { min: 1, max: 50 },
            result: "Double your current hit points",
            description: "Moderate success",
          },
          {
            range: { min: 51, max: 90 },
            result: "Heal to full health",
            description: "Optimal result - aim for this",
          },
          {
            range: { min: 91, max: 100 },
            result: "Drop to 0 hit points (shrinks by 1% per FP spent)",
            description: "DEATH window - spend FP to shrink or eliminate",
          },
        ],
      },

      tags: [
        "ultimate",
        "life or death",
        "extreme risk",
        "healing",
        "rollable table",
        "gambler",
        "high-roller",
      ],

      cooldownConfig: {
        cooldownType: "long_rest",
        cooldownValue: 1,
      },
    },

    {
      id: "death-roll",
      name: "Death Roll",
      icon: "Necrotic/Demonic Empowerment",
      spellType: "ACTION",
      level: 7,

      description:
        "Challenge creature to Death Roll minigame. Both roll a d20 — the lower result becomes the new maximum ceiling. Both roll again, trying to stay under the ceiling. First to roll over it loses. Loser takes psychic damage (winner chooses 1-10d10) and is stunned for 1 round. Unwilling targets make Spirit save.",

      typeConfig: {
        school: "psychic",
        castTime: 1,
        castTimeType: "IMMEDIATE",
        tags: [
          "competitive",
          "minigame",
          "damage",
          "control",
          "psychic",
          "gambler",
          "card-sharp",
        ],
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 15,
        targetRestrictions: ["enemy"],
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 24 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "Ludus Mortis!",
        somaticText: "Challenge opponent with dice",
        classResource: { type: "fortune_points", cost: 6 },
      },

      resolution: "DICE",
      effectTypes: ["damage", "control"],

      damageConfig: {
        formula: "1d10 to 10d10",
        damageTypes: ["psychic"],
        description:
          "Winner chooses how many d10s (1-10) the loser takes as psychic damage",
        savingThrowConfig: {
          enabled: true,
          savingThrowType: "spirit",
          difficultyClass: 15,
          saveOutcome: "negates",
        },
        resolution: "DICE",
      },

      controlConfig: {
        controlType: "incapacitation",
        strength: "moderate",
        duration: 1,
        durationUnit: "rounds",
        saveDC: 15,
        saveType: "spirit",
        savingThrow: true,
        effects: [
          {
            id: "stun",
            name: "Stunned",
            description:
              "Loser is stunned for 1 round, unable to take actions or reactions",
            config: {
              saveType: "constitution",
              saveDC: 15,
              duration: 1,
              durationUnit: "rounds",
              durationType: "rounds",
              recoveryMethod: "automatic",
            },
          },
        ],
      },

      specialMechanics: {
        fortunePoints: {
          usage:
            "Adjust your roll during any round of the game — decrease to stay under the ceiling, or adjust enemy roll to push them over",
        },
        minigame: {
          type: "death_roll",
          rules:
            "Both roll d20. Lower result becomes the new ceiling max. Repeat — both must roll under the ceiling. First to roll over loses.",
          example:
            "R1: You 15, Enemy 12 (ceiling: 12). R2: You 8 (under!), Enemy 13 (OVER — enemy loses!)",
        },
        savingThrow: {
          type: "spirit",
          dc: "8 + proficiency + Charisma",
          onFail: "Compelled to play",
        },
      },

      cooldownConfig: {
        cooldownType: "short_rest",
        cooldownValue: 1,
      },

      tags: [
        "competitive",
        "minigame",
        "damage",
        "control",
        "psychic",
        "gambler",
        "card-sharp",
      ],
    },

    {
      id: "double-or-nothing",
      name: "Double or Nothing",
      icon: "Utility/Empowered Warrior",
      spellType: "ACTION",
      level: 4,

      description:
        "Make an attack roll. On hit: automatic critical hit with double damage. On miss: you take the damage instead. Spend 5-10 Fortune Points to guarantee hit.",

      effectTypes: ["damage"],

      typeConfig: {
        school: "psychic",
        castTime: 1,
        castTimeType: "IMMEDIATE",
        tags: [
          "damage",
          "critical hit",
          "self damage risk",
          "gambler",
          "high-roller",
        ],
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "weapon_or_spell_range",
      },

      durationConfig: {
        durationType: "instant",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 14 },
        actionPoints: 1,
        components: ["verbal"],
        verbalText: "Duplica Aut Nihil!",
        classResource: { type: "fortune_points", cost: 3 },
      },

      resolution: "ATTACK_ROLL",

      damageConfig: {
        formula: "weapon_or_spell",
        damageTypes: ["variable"],
        scalingType: "critical_on_hit",
        resolution: "DICE",
      },

      specialMechanics: {
        fortunePoints: {
          recommendation: "5-10 points to guarantee hit",
          usage: "Adjust attack roll to ensure success",
          transforms: "From suicidal gamble to guaranteed crit",
        },
        criticalHit: {
          automatic: true,
          condition: "on_hit",
        },
        selfDamage: {
          condition: "on_miss",
          amount: "equal_to_would_be_damage",
        },
      },

      tags: [
        "damage",
        "critical hit",
        "self damage risk",
        "gambler",
        "high-roller",
      ],

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 3,
      },
    },

    {
      id: "taunt-the-odds",
      name: "Taunt the Odds",
      icon: "Radiant/Radiant Warrior",
      spellType: "ACTION",
      level: 3,

      description:
        "Guess a number 1-20, then roll d20. Guess within 3: target takes 3d10 damage. Off by 4+: you take 1d10 damage. Spend Fortune Points to adjust roll toward guess.",

      effectTypes: ["damage"],

      typeConfig: {
        school: "psychic",
        castTime: 1,
        castTimeType: "IMMEDIATE",
        tags: ["damage", "prediction", "skill based", "gambler", "card-sharp"],
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
      },

      durationConfig: {
        durationType: "instant",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 10 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Provoco Fortunam!",
        somaticText: "Point at target and call out number",
        classResource: { type: "fortune_points", cost: 1 },
      },

      resolution: "DICE",

      damageConfig: {
        formula: "4d6",
        damageTypes: ["force"],
        scalingType: "accuracy_based",
        resolution: "DICE",
      },

      specialMechanics: {
        fortunePoints: {
          usage: "After seeing roll, adjust toward your guess",
          example: "Guess 15, roll 11, spend 4 points to make it 15",
        },
        prediction: {
          type: "number_guess",
          range: "1-20",
          successMargin: 3,
          failureMargin: 4,
        },
        synergy: {
          cardCounting:
            "Card Sharp passive: After observing 5 d20 rolls in combat, your next Taunt the Odds auto-hits (target takes 3d10 damage with no risk of self-damage). No guess needed — you already know the answer.",
        },
      },

      tags: ["damage", "prediction", "skill based", "gambler", "card-sharp"],

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 3,
      },
    },

    {
      id: "coin-toss",
      name: "Coin Toss",
      icon: "Utility/Utility",
      spellType: "ACTION",
      level: 2,

      description:
        "Flip a coin. Heads: gain bonus to all rolls. Tails: take penalty to all rolls. Spend Fortune Points to flip the result.",

      typeConfig: {
        school: "force",
        castTime: 1,
        castTimeType: "IMMEDIATE",
        tags: [
          "buff",
          "debuff",
          "coin flip",
          "rollable table",
          "duration",
          "gambler",
        ],
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },

      durationConfig: {
        durationType: "rounds",
        duration: 1,
        durationUnit: "hour",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 6 },
        actionPoints: 1,
        components: ["verbal", "material"],
        verbalText: "Nummus Fortunae!",
        materialText: "A coin",
        classResource: { type: "fortune_points", cost: 1 },
      },

      resolution: "COIN_FLIP",

      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          {
            id: "coin_toss_buff",
            name: "Coin Toss Buff",
            description:
              "On heads: +2 to all rolls. On tails: -2 to all rolls.",
            statModifier: {
              stat: "all_rolls",
              magnitude: 2,
              magnitudeType: "flat",
              condition: "on_heads",
            },
          },
        ],
        durationValue: 1,
        durationType: "hours",
        durationUnit: "hours",
        concentrationRequired: false,
        canBeDispelled: true,
      },

      specialMechanics: {
        fortunePoints: {
          cost: 1,
          effect: "Flip the result (Heads to Tails or vice versa)",
          guarantee: "With 1 point, always get +2 bonus",
        },
        coinFlip: {
          type: "1d2",
          heads: 2,
          tails: 1,
        },
      },

      rollableTable: {
        enabled: true,
        name: "Coin Toss Results",
        description: "Flip a coin",
        resolutionType: "COIN_FLIP",
        resolutionConfig: { diceType: "coin" },
        entries: [
          {
            range: "Heads",
            result: "+2 bonus to all rolls for 1 hour",
            description: "Positive outcome",
          },
          {
            range: "Tails",
            result: "-2 penalty to all rolls for 1 hour",
            description: "Negative outcome",
          },
        ],
      },

      tags: [
        "buff",
        "debuff",
        "coin flip",
        "rollable table",
        "duration",
        "gambler",
      ],

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 2,
      },
    },

    {
      id: "gamblers-insight",
      name: "Gambler's Insight",
      icon: "Psychic/Focused Mind",
      spellType: "ACTION",
      level: 2,

      description:
        "Gain advantage on Insight and Perception checks against one creature for 10 minutes. Detect lies, read intentions, notice body language, predict moves.",

      typeConfig: {
        school: "force",
        castTime: 1,
        castTimeType: "IMMEDIATE",
        tags: ["utility", "social", "detection", "gambler"],
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
      },

      durationConfig: {
        durationType: "rounds",
        duration: 10,
        durationUnit: "minute",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 6 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Perspicio Verum!",
        somaticText: "Touch temple and point at target",
        classResource: { type: "fortune_points", cost: 1 },
      },

      resolution: "AUTOMATIC",

      buffConfig: {
        buffType: "skillEnhancement",
        effects: [
          {
            id: "gamblers_insight",
            name: "Gambler's Insight",
            description:
              "Gain advantage on Insight and Perception checks against target for 10 minutes",
            mechanicsText:
              "Advantage on Insight and Perception checks for 10 minutes",
            skillModifier: {
              skills: ["Insight", "Perception"],
              magnitude: 1,
              magnitudeType: "advantage",
            },
          },
        ],
        durationValue: 10,
        durationType: "minutes",
        durationUnit: "minutes",
        concentrationRequired: false,
        canBeDispelled: true,
      },

      specialMechanics: {
        utility: {
          uses: [
            "Detect lies",
            "Read intentions",
            "Notice body language",
            "Predict moves",
          ],
          synergy: "Pairs with Gambler charisma and deception skills",
        },
        social: {
          applications: [
            "Negotiations",
            "Detecting ambushes",
            "Social encounters",
          ],
        },
      },

      tags: ["utility", "social", "detection", "gambler"],

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 2,
      },
    },

    {
      id: "fools-gold",
      name: "Fool's Gold",
      icon: "Utility/Utility",
      spellType: "ACTION",
      level: 2,

      description:
        "Create illusory gold/treasure (up to 100gp value) that looks real but vanishes when touched. Lasts 1 hour. Perfect for bribes, distractions, escapes, cons, and traps.",

      effectTypes: ["utility"],

      typeConfig: {
        school: "force",
        castTime: 1,
        castTimeType: "IMMEDIATE",
        tags: ["utility", "illusion", "deception", "gambler"],
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "touch",
      },

      durationConfig: {
        durationType: "rounds",
        duration: 1,
        durationUnit: "hour",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 7 },
        actionPoints: 1,
        components: ["verbal", "somatic", "material"],
        verbalText: "Aurum Falsum!",
        somaticText: "Conjure illusory treasure",
        materialText: "A copper piece",
        classResource: { type: "fortune_points", cost: 1 },
      },

      resolution: "AUTOMATIC",

      utilityConfig: {
        utilityType: "illusion",
        selectedEffects: [
          {
            id: "fools_gold",
            name: "Fool's Gold",
            description:
              "Create illusory gold/treasure (up to 100gp value) that looks real but vanishes when touched",
          },
        ],
        duration: 1,
        durationUnit: "hours",
        concentration: false,
        power: "moderate",
      },

      specialMechanics: {
        illusion: {
          quality: "Perfect to visual inspection",
          substance: "No physical substance",
          detection: "Touch immediately reveals fake",
        },
        utility: {
          uses: [
            "Bribes",
            "Distractions",
            "Escape tactics",
            "Deception",
            "Cons",
            "Baiting traps",
          ],
        },
      },

      tags: ["utility", "illusion", "deception", "gambler"],

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 2,
      },
    },

    // ========================================
    // LEVEL 1 SPELLS
    // ========================================
    {
      id: "gambler_lucky_toss",
      name: "Lucky Toss",
      description:
        "Toss a coin and channel luck into a minor attack. Heads deals damage, tails provides a small buff.",
      level: 1,
      spellType: "ACTION",
      icon: "Utility/Utility",

      typeConfig: {
        school: "force",
        icon: "Utility/Utility",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
        targetRestrictions: ["enemy", "ally"],
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 3 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Luck be mine!",
        somaticText: "Flip a coin",
        classResource: { type: "fortune_points", gain: 1 },
      },

      resolution: "COIN_FLIP",
      effectTypes: ["damage", "buff"],

      damageConfig: {
        formula: "1d10 + charisma",
        damageTypes: ["force"],
        resolution: "DICE",
      },

      buffConfig: {
        buffType: "luck",
        effects: [
          {
            id: "minor_luck",
            name: "Minor Luck",
            description: "+1 to your next roll",
            statModifier: {
              stat: "all_rolls",
              magnitude: 1,
              magnitudeType: "flat",
            },
            mechanicsText: "+1 to next roll",
            charges: 1,
          },
        ],
        durationValue: 1,
        durationType: "rounds",
        durationUnit: "rounds",
      },

      specialMechanics: {
        coinFlip: {
          heads: { effect: "damage", target: "enemy" },
          tails: { effect: "buff", target: "self" },
        },
      },

      tags: ["damage", "buff", "coin flip", "level 1", "gambler"],

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 1,
      },
    },

    {
      id: "gambler_beginners_luck",
      name: "Beginner's Luck",
      description:
        "Channel the power of fortune to grant yourself advantage on your next ability check or attack roll.",
      level: 1,
      spellType: "ACTION",
      icon: "Social/Dice Roll",

      typeConfig: {
        school: "force",
        icon: "Social/Dice Roll",
        castTime: 1,
        castTimeType: "BONUS",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 3 },
        actionPoints: 0,
        components: ["verbal"],
        verbalText: "First timer!",
        classResource: { type: "fortune_points", gain: 1 },
      },

      resolution: "NONE",
      effectTypes: ["buff"],

      buffConfig: {
        buffType: "advantage",
        effects: [
          {
            id: "beginners_advantage",
            name: "Beginner's Advantage",
            description:
              "Gain advantage on your next ability check or attack roll",
            mechanicsText: "Advantage on next ability check or attack roll",
            charges: 1,
          },
        ],
        durationValue: 1,
        durationType: "rounds",
        durationUnit: "uses",
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },

      tags: ["buff", "luck", "level 1", "gambler"],
    },

    {
      id: "gambler_dice_dart",
      name: "Dice Dart",
      description:
        "Throw a magically enchanted die that deals damage based on the roll. Spend 1 FP to add +1d6 damage.",
      level: 1,
      spellType: "ACTION",
      icon: "Social/Dice Roll",

      typeConfig: {
        school: "force",
        icon: "Social/Dice Roll",
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
        resourceValues: { mana: 3 },
        actionPoints: 1,
        components: ["somatic"],
        somaticText: "Throw enchanted die",
        classResource: { type: "fortune_points", gain: 1 },
      },

      resolution: "DICE",
      effectTypes: ["damage"],

      damageConfig: {
        formula: "1d8",
        damageTypes: ["force"],
        resolution: "DICE",
      },

      tags: ["damage", "ranged", "level 1", "gambler"],

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 1,
      },
    },

    // ========================================
    // LEVEL 5 SPELLS
    // ========================================
    {
      id: "gambler_hot_streak",
      name: "Hot Streak",
      description:
        "When fortune favors you, ride the wave! Each successful attack this turn grants bonus damage on the next.",
      level: 5,
      spellType: "ACTION",
      icon: "Fire/Enveloping Fire",

      typeConfig: {
        school: "psychic",
        icon: "Fire/Enveloping Fire",
        castTime: 1,
        castTimeType: "BONUS",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 16 },
        actionPoints: 0,
        components: ["verbal"],
        verbalText: "I'm on fire!",
        classResource: { type: "fortune_points", cost: 4 },
      },

      resolution: "NONE",
      effectTypes: ["buff"],

      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          {
            id: "hot_streak",
            name: "Hot Streak",
            description:
              "Each hit this turn grants +1d6 damage on your next attack, stacking up to 4 times.",
            mechanicsText:
              "+1d6 damage per hit this turn, stacking up to 4 times",
            charges: 4,
          },
        ],
        durationValue: 1,
        durationType: "rounds",
        durationUnit: "rounds",
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 4 },

      tags: ["buff", "damage", "level 5", "gambler"],
    },

    {
      id: "gambler_mirage_flip",
      name: "Mirage Flip",
      description:
        "Flip a coin to double or nullify your next spell or attack damage.",
      level: 5,
      spellType: "REACTION",
      icon: "Utility/Utility",

      typeConfig: {
        school: "psychic",
        icon: "Utility/Utility",
        castTime: 1,
        castTimeType: "REACTION",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 17 },
        actionPoints: 0,
        components: ["verbal"],
        verbalText: "Double or nothing!",
        classResource: { type: "fortune_points", cost: 4 },
      },

      resolution: "COIN_FLIP",
      effectTypes: ["buff"],

      buffConfig: {
        buffType: "damage_modifier",
        effects: [
          {
            id: "mirage_flip_double",
            name: "Mirage Flip Double",
            description: "On heads: double damage. On tails: zero damage.",
            mechanicsText: "Heads: double damage. Tails: zero damage.",
          },
        ],
      },

      specialMechanics: {
        coinFlip: {
          heads: { effect: "double_damage", multiplier: 2 },
          tails: { effect: "no_damage", multiplier: 0 },
        },
        trigger: "on_attack_hit",
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },

      tags: ["buff", "coin flip", "high risk", "level 5", "gambler"],
    },

    {
      id: "gambler_fate_reroll",
      name: "Fate Reroll",
      description:
        "Reroll any dice you roll this turn and take the better result.",
      level: 5,
      spellType: "ACTION",
      icon: "Social/Dice Roll",

      typeConfig: {
        school: "force",
        icon: "Social/Dice Roll",
        castTime: 1,
        castTimeType: "BONUS",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 18 },
        actionPoints: 0,
        components: ["somatic"],
        somaticText: "Sleight of hand",
        classResource: { type: "fortune_points", cost: 4 },
      },

      resolution: "NONE",
      effectTypes: ["buff"],

      buffConfig: {
        buffType: "reroll",
        effects: [
          {
            id: "fate_reroll",
            name: "Fate Reroll",
            description:
              "Reroll any dice this turn and take the better result.",
            mechanicsText:
              "Reroll any dice this turn and take the better result",
          },
        ],
        durationValue: 1,
        durationType: "rounds",
        durationUnit: "rounds",
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 4 },

      tags: ["buff", "reroll", "level 5", "gambler"],
    },

    // ========================================
    // LEVEL 6 SPELLS
    // ========================================
    {
      id: "gambler_house_advantage",
      name: "House Advantage",
      description:
        "The house always wins. Steal luck from enemies, imposing disadvantage on them while granting yourself advantage.",
      level: 6,
      spellType: "ACTION",
      icon: "Psychic/Mind Roar",

      typeConfig: {
        school: "psychic",
        icon: "Psychic/Mind Roar",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 60,
        aoeShape: "circle",
        aoeParameters: { radius: 20 },
        targetRestrictions: ["enemy"],
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 20 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "The house always wins!",
        somaticText: "Card dealer gesture",
        classResource: { type: "fortune_points", cost: 5 },
      },

      resolution: "NONE",
      effectTypes: ["debuff", "buff"],

      debuffConfig: {
        debuffType: "disadvantage",
        effects: [
          {
            id: "stolen_luck",
            name: "Stolen Luck",
            description:
              "Enemies have disadvantage on attack rolls and saving throws.",
            statPenalty: [
              { stat: "attack", value: -99, magnitudeType: "disadvantage" },
              {
                stat: "saving_throws",
                value: -99,
                magnitudeType: "disadvantage",
              },
            ],
            mechanicsText: "Disadvantage on attack rolls and saving throws",
          },
        ],
        durationValue: 3,
        durationType: "rounds",
        durationUnit: "rounds",
        saveDC: 16,
        saveType: "spirit",
        saveOutcome: "negates",
      },

      buffConfig: {
        buffType: "advantage",
        effects: [
          {
            id: "house_advantage",
            name: "House Advantage",
            description: "You have advantage on all rolls for the duration.",
            mechanicsText: "Advantage on all rolls for the duration",
          },
        ],
        durationValue: 3,
        durationType: "rounds",
        durationUnit: "rounds",
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 5 },

      tags: ["debuff", "buff", "luck", "level 6", "gambler"],
    },

    {
      id: "gambler_card_shark",
      name: "Card Shark",
      description:
        "Draw from your magical deck to unleash one of four powerful effects based on the suit.",
      level: 6,
      spellType: "ACTION",
      icon: "Psychic/Mental Chaos",

      typeConfig: {
        school: "force",
        icon: "Psychic/Mental Chaos",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: ["enemy", "ally"],
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 22 },
        actionPoints: 1,
        components: ["somatic"],
        somaticText: "Draw a card",
        classResource: { type: "fortune_points", cost: 5 },
      },

      resolution: "DICE",
      effectTypes: ["utility"],

      rollableTable: {
        enabled: true,
        name: "Card Shark Effects",
        description: "Draw 1d4 and consult the table",
        resolutionType: "DICE",
        resolutionConfig: { diceType: "1d4" },
        entries: [
          {
            min: 1,
            max: 1,
            result: "Spades — Deal 6d8 force damage to target",
            weight: 1,
          },
          {
            min: 2,
            max: 2,
            result: "Hearts — Heal target for 5d8 HP",
            weight: 1,
          },
          {
            min: 3,
            max: 3,
            result:
              "Diamonds — Target gains a shield absorbing 30 damage for 1 minute",
            weight: 1,
          },
          {
            min: 4,
            max: 4,
            result:
              "Clubs — Target is stunned for 2 rounds (Spirit DC 15 save negates)",
            weight: 1,
          },
        ],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },

      tags: [
        "damage",
        "healing",
        "control",
        "variable",
        "rollable table",
        "level 6",
        "gambler",
      ],
    },

    {
      id: "gambler_poker_face",
      name: "Poker Face",
      description:
        "Project an aura of unreadability, becoming immune to charm, fear, and mind-reading effects.",
      level: 6,
      spellType: "ACTION",
      icon: "General/Fiery Rage",

      typeConfig: {
        school: "force",
        icon: "General/Fiery Rage",
        castTime: 1,
        castTimeType: "BONUS",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 20 },
        actionPoints: 0,
        components: ["somatic"],
        somaticText: "Assume poker face",
        classResource: { type: "fortune_points", cost: 5 },
      },

      resolution: "NONE",
      effectTypes: ["buff"],

      buffConfig: {
        buffType: "immunity",
        effects: [
          {
            id: "poker_face",
            name: "Poker Face",
            description: "Immune to charm, fear, and mind-reading effects.",
            mechanicsText: "Immune to charm, fear, and mind-reading effects",
            damageImmunity: ["charm", "fear", "mind_reading"],
          },
        ],
        durationValue: 5,
        durationType: "rounds",
        durationUnit: "rounds",
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 4 },

      tags: ["buff", "immunity", "mental", "level 6", "gambler"],
    },

    // ========================================
    // LEVEL 9 SPELLS
    // ========================================
    {
      id: "gambler_high_roller",
      name: "High Roller",
      description:
        "Make the ultimate gamble. Roll a d20 - on a 15+, deal devastating damage. On a 1-5, take that damage yourself.",
      level: 9,
      spellType: "ACTION",
      icon: "Social/Dice Roll",

      typeConfig: {
        school: "force",
        icon: "Social/Dice Roll",
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
        resourceValues: { mana: 32 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "High stakes!",
        somaticText: "Roll the divine die",
        classResource: { type: "fortune_points", cost: 8 },
      },

      resolution: "DICE",
      effectTypes: ["damage"],

      damageConfig: {
        formula: "18d6 + charisma",
        damageTypes: ["force"],
        resolution: "DICE",
      },

      specialMechanics: {
        highRoll: {
          diceFormula: "1d20",
          success: { min: 15, effect: "deal_damage_to_target" },
          neutral: { min: 6, max: 14, effect: "deal_half_damage" },
          failure: { max: 5, effect: "deal_damage_to_self" },
        },
      },

      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },

      tags: ["damage", "high risk", "high reward", "level 9", "gambler"],
    },

    {
      id: "gambler_jackpot_surge",
      name: "Jackpot Surge",
      description:
        "Hit the ultimate jackpot! Roll multiple dice and if any match, multiply your damage exponentially.",
      level: 9,
      spellType: "ACTION",
      icon: "Radiant/Radiant Glow",

      typeConfig: {
        school: "force",
        icon: "Radiant/Radiant Glow",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 60,
        aoeShape: "circle",
        aoeParameters: { radius: 25 },
        targetRestrictions: ["enemy"],
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 34 },
        actionPoints: 3,
        components: ["verbal", "somatic"],
        verbalText: "JACKPOT!",
        somaticText: "Pull the lever",
        classResource: { type: "fortune_points", cost: 8 },
      },

      resolution: "DICE",
      effectTypes: ["damage"],

      damageConfig: {
        formula: "16d6 + charisma",
        damageTypes: ["force"],
        savingThrowConfig: {
          enabled: true,
          savingThrowType: "agility",
          difficultyClass: 19,
          saveOutcome: "halves",
        },
        resolution: "DICE",
      },

      specialMechanics: {
        jackpot: {
          diceFormula: "3d6",
          matching: {
            twoMatch: { multiplier: 2, description: "Double damage!" },
            threeMatch: {
              multiplier: 4,
              description: "JACKPOT! Quadruple damage!",
            },
          },
        },
      },

      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },

      tags: ["damage", "aoe", "high reward", "level 9", "gambler"],
    },

    {
      id: "gambler_fortune_reversal",
      name: "Fortune Reversal",
      description:
        "Reverse the fortunes of battle. Swap your current HP percentage with a target enemy.",

      level: 9,
      spellType: "ACTION",
      icon: "Arcane/Rewind Time",

      typeConfig: {
        school: "force",
        icon: "Arcane/Rewind Time",
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
        resourceValues: { mana: 34 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "Fortune flip!",
        somaticText: "Dramatic coin flip",
        classResource: { type: "fortune_points", cost: 8 },
      },

      resolution: "COIN_FLIP",
      effectTypes: ["utility"],

      specialMechanics: {
        coinFlip: {
          heads: {
            effect: "swap_hp_percentage",
            description: "Your HP% and target HP% are swapped",
          },
          tails: {
            effect: "scry",
            description:
              "Swap fails. Instead, you learn the target's current and maximum HP, and gain advantage on your next attack against them.",
          },
        },
      },

      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },

      tags: ["utility", "coin flip", "high risk", "level 9", "gambler"],
    },

    // ADDITIONAL LEVEL 4 SPELLS
    // ADDITIONAL LEVEL 7 SPELL
    {
      id: "gambler_all_or_nothing",
      name: "All or Nothing",
      description:
        "Flip a coin to unleash devastating force on all enemies or take damage yourself.",
      level: 7,
      spellType: "ACTION",
      effectTypes: ["damage"],

      typeConfig: {
        school: "force",
        icon: "Utility/Utility",
        tags: ["damage", "aoe", "coin flip", "ultimate", "universal"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 50,
        aoeShape: "circle",
        aoeParameters: { radius: 30 },
        targetRestrictions: ["enemy"],
      },

      damageConfig: {
        formula: "12d6",
        damageTypes: ["force"],
        criticalConfig: {
          critType: "effect",
          critEffects: ["all_or_nothing_stun"],
        },
        resolution: "DICE",
      },

      specialMechanics: {
        coinFlip: {
          heads: {
            effect: "deal_damage",
            description:
              "Deal 12d6 force damage to all enemies in 30ft radius. Enemies who fail a Spirit DC 16 save are stunned for 1 round.",
          },
          tails: {
            effect: "self_damage",
            description:
              "Take 6d6 force damage yourself. No damage dealt to enemies.",
          },
        },
        fortunePoints: {
          cost: 1,
          effect: "Flip the coin result (Heads to Tails or vice versa)",
          guarantee: "With 1 FP, guarantee the heads outcome",
        },
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 25 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        classResource: { type: "fortune_points", cost: 6 },
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 8 },

      resolution: "COIN_FLIP",
      tags: ["damage", "aoe", "coin flip", "ultimate", "universal"],
    },

    // ADDITIONAL LEVEL 8 SPELL
    {
      id: "gambler_weighted_dice",
      name: "Weighted Dice",
      description:
        "The house doesn't know the dice are loaded. Base: 14d6 force damage. Each Fortune Point spent treats one d6 as if it rolled 6 (max 7 dice weighted). No coin flip — this is pure cheating. Spend 7 FP and half your dice are guaranteed maximum.",
      level: 8,
      spellType: "ACTION",
      effectTypes: ["damage"],

      typeConfig: {
        school: "force",
        icon: "Social/Dice Roll",
        tags: ["damage", "guaranteed", "fortune point spending", "universal"],
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
        formula: "14d6",
        damageTypes: ["force"],
        criticalConfig: {
          critType: "dice",
          critMultiplier: 2,
          critDiceOnly: false,
        },
        resolution: "DICE",
      },

      specialMechanics: {
        fortunePoints: {
          usage: "Each FP spent treats one d6 as if it rolled 6 (max 7 dice)",
          example:
            "Spend 5 FP: 5 of your 14d6 automatically count as 6. Roll the remaining 9d6 normally.",
          guarantee:
            "At 7 FP spent, half your dice are guaranteed maximum. The most reliable spell in the Gambler arsenal — because the best gamblers know when to cheat.",
        },
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 28 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        classResource: { type: "fortune_points", cost: 7 },
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 5 },

      resolution: "DICE",
      tags: ["damage", "guaranteed", "fortune point spending", "universal"],
    },

    // ADDITIONAL LEVEL 10 SPELL
    {
      id: "gambler_divine_jackpot",
      name: "Divine Jackpot",
      description:
        "Flip a coin wreathed in divine fire. Heads: deal 20d6 force damage to all enemies in 60ft — enemies below 50% HP make a Spirit DC 20 save or are stunned for 2 rounds (instead of instantly defeated). Tails: take 20d6 force damage but survive at 1 HP with advantage on all rolls for 1 round.",
      level: 10,
      spellType: "ACTION",
      effectTypes: ["damage"],

      typeConfig: {
        school: "force",
        icon: "Utility/Utility",
        tags: ["damage", "coin flip", "ultimate", "jackpot", "universal"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "sight",
        rangeDistance: 120,
        aoeShape: "circle",
        aoeParameters: { radius: 60 },
        targetRestrictions: ["enemy"],
      },

      damageConfig: {
        formula: "20d6",
        damageTypes: ["force"],
        criticalConfig: {
          critType: "effect",
          critEffects: ["divine_judgment", "fortune_mercy"],
        },
        resolution: "DICE",
      },

      specialMechanics: {
        coinFlip: {
          heads: {
            effect: "divine_judgment",
            description:
              "Deal 20d6 force damage to all enemies in range. Enemies below 50% HP must succeed on a Spirit DC 20 save or be stunned for 2 rounds. Enemies above 50% HP are stunned for 1 round on a failed save.",
          },
          tails: {
            effect: "fortune_mercy",
            description:
              "Take 20d6 force damage. No safety net — if this reduces you to 0 HP, you die. Spend 1 Fortune Point to flip the coin result and get the heads outcome instead.",
          },
        },
        loreNote:
          "Fortune is a cruel mistress. She either destroys your enemies, or she teaches you why you should have folded.",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 38 },
        actionPoints: 3,
        components: ["verbal", "somatic"],
        classResource: { type: "fortune_points", cost: 10 },
      },

      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },

      resolution: "COIN_FLIP",
      tags: ["damage", "coin flip", "ultimate", "jackpot", "universal"],
    },
  ],
};
