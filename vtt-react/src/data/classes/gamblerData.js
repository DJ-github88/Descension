/**
 * Gambler Class Data
 * 
 * Complete class information for the Gambler - a daring risk-taker
 * who manipulates luck and probability for high-stakes rewards.
 */

export const GAMBLER_DATA = {
  id: 'gambler',
  name: 'Gambler',
  icon: 'fas fa-dice',
  role: 'Damage/Utility',
  damageTypes: ['force', 'psychic'],

  // Overview section
  overview: {
    title: 'The Gambler',
    subtitle: 'Master of Fortune and Fate',

    quickOverview: {
      title: 'Quick Overview',
    content: `**What You Need to Know**: The Gambler generates Fortune Points by successfully casting spells or landing attacks. Spend Fortune Points to adjust roll results by ±1 each (similar to Chaos Weaver's Mayhem Modifiers, but for YOUR rolls). Three specializations use different mechanics and have different Fortune Point caps: coin flips (Fortune's Favor, max 7), dice rolls (High Roller, max 21), and card draws (Card Sharp, max 13). Spells include rollable tables with multiple outcomes (Jackpot: 3d20 slot machine with 20 outcomes, Fate's Coin: 6 coin flip options, High Roller: 3 d20-based bets, Death Roll: competitive 5d20 game).

**Core Mechanic**: Successful spell/attack → Generate Fortune Points → Spend to adjust YOUR roll results by ±1 per point

**Resource**: Fortune Points (Max varies by spec: 7 / 21 / 13)

**Playstyle**: High-risk damage dealer, probability manipulation, rollable table specialist, luck-based utility

**Best For**: Players who enjoy gambling mechanics, adjusting roll results, and unpredictable high-variance gameplay`
    },

    description: `A daring risk-taker who manipulates luck and probability. Gamblers embrace high-risk, high-reward strategies, using Fortune Points to turn chance into calculated advantage and swing battles on a single bet.`,
    
    roleplayIdentity: {
      title: 'Roleplay Identity',
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

**Physical Manifestations**: A Gambler's connection to fortune often manifests subtly—dice that always seem to roll in their favor, coins that land on the desired side, or an aura that makes others feel either lucky or unlucky in their presence. Some carry enchanted gambling implements that glow when fortune favors them.`
    },
    
    combatRole: {
      title: 'Combat Role',
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
- Provides valuable reroll support for critical ally actions`
    },
    
    playstyle: {
      title: 'Playstyle & Strategy',
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

**Perfect For**: Players who enjoy randomness, dramatic moments, risk/reward decisions, and don't mind occasional spectacular failures in pursuit of legendary successes.`
    },

    immersiveCombatExample: {
      title: 'Combat Example: The House Always Wins',
      content: `**The Setup**: You're a Gambler (High Roller specialization, Fortune Point max: 21) facing a powerful ogre champion and two goblin minions. Your party needs you to deal damage, but your spells are gambling-based—high risk, high reward. Starting Fortune Points: 3 (from previous encounter). Starting Mana: 40/50. Your goal: Build Fortune Points through successful actions, use them to adjust critical rolls, and unleash devastating gambling abilities.

**Starting State**: Fortune Points: 3/21 | Mana: 40/50 | HP: 60/70

**Turn 1 - Building Fortune (FP: 3 → 5)**

*The ogre roars, raising its massive club. The goblins cackle, circling. You pull out a pair of enchanted dice, grinning. "Let's make this interesting."*

**Your Action**: Cast "Lucky Strike" on Ogre (5 mana, roll 1d20 for damage multiplier)
**Attack Roll**: d20+5 → [16] = Hit!
**Damage Multiplier Roll**: 1d20 → [14] = 14x multiplier!
**Base Damage**: 1d6 → [4] = 4 damage
**Total Damage**: 4 × 14 = **56 damage!**

*The dice glow golden as they roll. Fourteen. The ogre takes a MASSIVE hit of magical energy. It staggers, roaring in pain.*

**Fortune Points Generated**: +1 FP (successful spell cast)
**Fortune Points**: 3 + 1 = **4 FP**
**Mana**: 40 - 5 = 35/50

**Ogre's Turn**: Attacks you → [18] → Hit! → 3d8+5 → [6, 7, 5] + 5 = 23 damage
**Your HP**: 60 - 23 = 37/70

*The ogre's club slams into you. You're hurt, but you're SMILING. That damage roll was worth it.*

**Your Party's Healer**: Heals you for 15 HP
**Your HP**: 37 + 15 = 52/70

**Current State**: FP: 4/21 | Mana: 35/50 | HP: 52/70

**Turn 2 - The Gamble (FP: 4 → 6)**

*You're at 4 Fortune Points. Time to use your signature spell: "Jackpot" - a 3d20 slot machine with 20 different outcomes. You roll 3d20 and match the results to a table.*

**Your Action**: Cast "Jackpot" on Ogre (8 mana, roll 3d20 and consult outcome table)
**3d20 Roll**: [12], [7], [19]

*Three magical slot machine reels appear above the ogre. They spin, then STOP. 12. 7. 19. You check the table...*

**Outcome Lookup**: 12-7-19 → "Moderate Win" → 4d10 damage + stun for 1 round

*Not bad, but you have 4 Fortune Points. Scanning the outcome table, you see [15, 7, 19] = "Big Win" for 6d10 damage + stun for 2 rounds + gain 2 Fortune Points. That costs 3 FP — affordable.*

**Decision**: Spend 3 Fortune Points to change [12] to [15]
**Fortune Points**: 4 - 3 = **1 FP**
**Adjusted Roll**: [15], [7], [19]
**Outcome Lookup**: 15-7-19 → "Big Win" → 6d10 damage + stun for 2 rounds + gain 2 Fortune Points

*You snap your fingers. The first reel SHIFTS from 12 to 15. The slot machine dings. BIG WIN!*

**Damage Roll**: 6d10 → [8, 9, 7, 10, 6, 8] = **48 damage!**
**Effect**: Ogre stunned for 2 rounds
**Fortune Points Generated**: +1 FP (successful spell) +2 FP (Big Win bonus) = +3 FP total
**Fortune Points**: 1 + 3 = **4 FP**

*The ogre is BLASTED by magical energy. It falls to one knee, stunned. The goblins back away, terrified.*

**Mana**: 35 - 8 = 27/50
**Current State**: FP: 4/21 | Mana: 27/50 | HP: 52/70 | Ogre: Stunned (2 rounds)

**Turn 3 - Finishing the Goblins (FP: 4 → 6)**

*The ogre is stunned. Time to clean up the goblins.*

**Your Action**: Cast "Fate's Coin" on Goblin #1 (4 mana, flip coin for outcome)
**Coin Flip**: Heads or Tails? → [Heads]
**Outcome**: Heads → "Lucky Strike" → 3d8 damage + gain 1 Fortune Point

**Damage Roll**: 3d8 → [7, 6, 8] = **21 damage**
**Result**: Goblin #1 DEAD (overkill)
**Fortune Points Generated**: +1 FP (successful spell) +1 FP (Lucky Strike bonus) = +2 FP
**Fortune Points**: 4 + 2 = **6 FP**

*You flip a golden coin. It spins in the air, glowing. Heads. The goblin is struck by a bolt of luck-infused energy. Dead.*

**Mana**: 27 - 4 = 23/50

**Goblin #2's Turn**: Attacks you → [11] → Miss!

**Current State**: FP: 6/21 | Mana: 23/50 | HP: 52/70

**Turn 4 - The Ultimate Gamble (FP: 6 → 8)**

*The ogre shakes off the stun. It's wounded (104 damage taken total) but still alive. One goblin remains. You have 6 Fortune Points. Time for the ultimate gamble: "Death Roll."*

**Your Action**: Cast "Death Roll" on Ogre (10 mana, competitive 5d20 game)
**How It Works**: You and the target each roll 5d20. Highest total wins. Winner deals damage equal to the difference.

**Your Roll**: 5d20 → [18, 12, 15, 9, 14] = **68 total**
**Ogre's Roll**: 5d20 → [16, 11, 13, 10, 17] = **67 total**

*You're winning by 1. You have 6 Fortune Points. Spend them to increase your [9] to [15] — that's 6 FP for +6 to your total.*

**Decision**: Spend 6 Fortune Points to change your [9] to [15]
**Fortune Points**: 6 - 6 = **0 FP**
**Adjusted Your Roll**: [18, 12, 15, 15, 14] = **74 total**
**Difference**: 74 - 67 = **7**

*You focus your will. The dice SHIFT. Your 9 becomes a 15. The ogre's eyes widen.*

**Damage**: 7d10 (difference of 7) → [9, 8, 10, 7, 6, 9, 8] = **57 damage!**

*The ogre EXPLODES in a burst of magical energy. Dead. The remaining goblin flees.*

**Fortune Points Generated**: +1 FP (successful spell) +1 FP (won Death Roll) = +2 FP
**Fortune Points**: 0 + 2 = **2 FP**
**Mana**: 23 - 10 = 13/50

**Combat Over**

*You stand among the corpses, breathing heavily. Your party stares at you.*

**Your Party's Tank**: "Did you just... gamble the ogre to death?"
**You**: "I didn't gamble. I CALCULATED. 68 vs 67? I spent 6 Fortune Points to turn that into 74 vs 67. The house always wins when you control the dice."
**Your Party's Mage**: "But what if you'd rolled lower?"
**You**: "Then I would have spent Fortune Points to adjust. That's the secret—build Fortune Points through successful actions, then spend them to turn near-wins into guaranteed wins. Luck is just probability you haven't manipulated yet."

**Final State**: FP: 2/21 (banked for next fight) | Mana: 13/50 | HP: 52/70

**The Lesson**: Gambler gameplay is about:
1. **Fortune Point Generation**: Generated 8 FP total (4 from successful spells, 2 from Big Win, 2 from Death Roll win)
2. **Fortune Point Spending**: Spent 9 FP total (3 to adjust Jackpot roll, 6 to adjust Death Roll)
3. **Roll Adjustment**: Changed [12] to [15] in Jackpot (cost 3 FP, gained better outcome), changed [9] to [15] in Death Roll (cost 6 FP, increased damage by 60)
4. **Risk Management**: Jackpot is random (3d20 with 20 outcomes), but Fortune Points let you adjust rolls to hit better outcomes
5. **Outcome Tables**: Jackpot has outcomes ranging from "Critical Fail" (damage yourself) to "JACKPOT" (10d10 + paralysis)
6. **Competitive Gambling**: Death Roll pits your rolls against enemy rolls—Fortune Points let you tip the scales
7. **Resource Conversion**: Spent 37 mana and 9 Fortune Points to deal 161 total damage (56 + 48 + 21 + 57) in 4 turns

You're not a consistent damage dealer. You're a GAMBLER who manipulates probability. You roll dice, flip coins, spin slot machines—but you're not leaving it to chance. You build Fortune Points through successful actions, then spend them to adjust critical rolls. When you roll 68 vs 67 in Death Roll, you don't accept the 1-point difference—you spend 6 Fortune Points to turn it into 7 points and deal 57 damage instead of 10. The randomness is real, but you control it. That's the Gambler's edge.`
    }
  },
  
  // Resource System
  resourceSystem: {
    title: 'Fortune Points',
    subtitle: 'Manipulating Luck and Probability',

    description: `Fortune Points represent the Gambler's accumulated luck and their ability to influence fate. Your maximum Fortune Points depend on your specialization: 7 for Fortune's Favor (the lucky number), 21 for High Roller (blackjack), or 13 for Card Sharp (cards in a suit). As they succeed in combat, they build Fortune Points, which they can then spend to adjust the outcomes of their gambles. This system allows Gamblers to embrace luck-based abilities while maintaining strategic control over critical moments.`,

    resourceBarExplanation: {
      title: 'Understanding Your Fortune Points Gauge',
      content: `**What You See**: Your Fortune Points gauge displays as a segmented bar matching your spec's max: 7 (Fortune's Favor, coin-shaped), 21 (High Roller, poker chip stack), or 13 (Card Sharp, card suit symbols). Segments fill with gold energy as you accumulate Fortune Points.

**Gauge Color Coding**:
- **0-25% (Red border)**: Low Fortune — build points before gambling
- **25-50% (Orange border)**: Cautious — can adjust minor rolls
- **50-75% (Yellow border)**: Comfortable — safe to use medium-risk abilities
- **75-100% (Green/Blue border)**: Strong Control — ultimate abilities available, "THE HOUSE ALWAYS WINS"

**Roll Adjustment Interface** (appears after any roll):
After your dice land, an adjustment prompt appears showing your roll and available Fortune Points. Use +/- buttons to adjust the result by ±1 per point. Each adjustment shows the FP cost before you confirm: "Spend 3 FP to change 14 → 17."

**Key Visual Cues**:
- **Natural 20**: Bar flashes gold, "+2 FP (CRITICAL!)"
- **Near-Miss (18-19)**: Tooltip suggests "Spend 1-2 FP for guaranteed crit?"
- **Critical Fail (1)**: Tooltip suggests "Spend FP to avoid critical failure?"
- **High-Risk Ability + Low FP**: Warning popup before casting

**Outcome Table Integration** (Jackpot, etc.): Hover over outcomes in the table to preview the FP cost to reach them. Example: Current [12, 7, 19] = "Moderate Win" → Hover [15, 7, 19] = "Big Win - Cost: 3 FP"

**Why This Matters**: The gauge is your control panel for probability manipulation. You see the roll, decide to adjust, watch the dice change with a golden flash. The visual feedback makes every adjustment feel powerful and intentional.`
    },

    mechanics: {
      title: 'How It Works',
      content: `**Starting State**: Gamblers begin each combat encounter with 0 Fortune Points

**Generating Fortune Points**:

Fortune Points are generated through successful actions in combat:
- **Successful Attack**: Landing an attack generates 1 Fortune Point
- **Successful Spell Cast**: Successfully casting a spell generates 1 Fortune Point
- **Winning a Gamble**: When a gambling ability produces a positive result, gain 1 Fortune Point
- **Critical Success**: Rolling a natural 20 generates 2 Fortune Points instead of 1

**Maximum Capacity**: Your Fortune Point cap depends on your specialization: Fortune's Favor (7), High Roller (21), or Card Sharp (13). Any excess is lost.

**Persistence**: Fortune Points persist between combats until spent or until you complete a long rest.

**Using Fortune Points**:

Fortune Points can be spent to adjust the results of any roll you make. Each Fortune Point spent allows you to increase or decrease the result by 1.

- **Spend 1 Point**: Adjust any roll by ±1
- **Spend Multiple Points**: Each additional point adjusts by another ±1
- **Post-Roll Decision**: After you see the result of any roll you make, you may spend Fortune Points to adjust that result by ±1 per point spent
- **No Limit Per Roll**: You can spend as many Fortune Points as you want on a single roll (up to your current total)
- **Timing**: The adjustment prompt appears after your dice land but before the GM declares the outcome

**Example**: You roll a 14 on a d20 attack roll. You have 8 Fortune Points. You could:
- Spend 0 points and accept the 14
- Spend 3 points to increase it to 17
- Spend 6 points to increase it to 20 (guaranteed critical hit)
- Spend points to decrease it if you wanted a specific number for a triggered effect

**Special Interactions**:

Some Gambler abilities specifically interact with Fortune Points:
- **Loaded Dice** (Passive): Choose a number (2-19). When you roll that number, you may spend 1 Fortune Point to reroll
- **Cheat Fate** (Reaction): Spend 3 Fortune Points to adjust any visible roll within 30 feet by ±2
- **Fortune's Favor**: Spend Fortune Points to grant allies rerolls or force enemy rerolls`
    },
    
    fortunePointTable: {
      title: 'Fortune Point Strategic Values',
      headers: ['Point Count (% of Max)', 'Strategic Value', 'Recommended Usage'],
      rows: [
        ['0-25% of max', 'Minimal Control', 'Focus on building points, avoid high-risk abilities'],
        ['25-50% of max', 'Low Control', 'Can adjust minor rolls, save for important moments'],
        ['50-75% of max', 'Moderate Control', 'Comfortable using medium-risk abilities, can guarantee some successes'],
        ['75-90% of max', 'High Control', 'Can afford multiple adjustments, safe to use high-risk abilities'],
        ['90-100% of max', 'Maximum Control', 'Near-complete control over outcomes, use ultimate abilities freely']
      ]
    },
    
    riskLevelTable: {
      title: 'Ability Risk Levels',
      headers: ['Risk Level', 'Description', 'Fortune Point Reserve Recommended'],
      rows: [
        ['Low Risk', 'Minor random elements, acceptable failure states', '0-3 points sufficient'],
        ['Medium Risk', 'Significant variance, some negative consequences possible', '4-6 points recommended'],
        ['High Risk', 'Extreme variance, potential for serious backfire', '7-10 points recommended'],
        ['Extreme Risk', 'Life-threatening consequences on failure', '11+ points strongly recommended'],
        ['Ultimate Risk', 'Potentially game-ending results either way', 'Maximum points (15-20) advised']
      ]
    },
    
    strategicConsiderations: {
      title: 'Strategic Considerations',
      content: `**Building Fortune Points Efficiently**:
- Focus on consistent, reliable attacks early in combat
- Use low-mana spells to generate points without depleting resources
- Avoid high-risk abilities until you have a comfortable Fortune Point reserve
- Critical hit builds can generate points faster (2 per crit)

**Spending Fortune Points Wisely**:
- Save points for boss encounters and critical moments
- Don't waste points on trash encounters unless necessary
- Consider the cost-benefit: is spending 5 points to turn a 15 into a 20 worth it?
- Remember that unspent points persist between combats

**Fortune Point Breakpoints** (adjust for your spec's max):
- **25% of Max**: Can turn most near-misses into hits
- **50% of Max**: Can guarantee critical hits on rolls of 10+
- **75% of Max**: Can adjust multiple important rolls in one encounter
- **100% of Max**: Maximum control, can manipulate entire combat sequences

**Risk Management**:
- Always maintain a 3-5 point reserve for emergencies
- Don't gamble with abilities you can't afford to fail
- Use Fortune Points to prevent catastrophic failures before chasing perfect successes
- Consider party composition: do you have healers to recover from bad gambles?

**Synergy with Abilities**:
- Some abilities become much stronger with Fortune Point investment
- Loaded Dice passive works best with high Fortune Point reserves
- Death Roll and other competitive abilities benefit greatly from point spending
- All-In and extreme gambles should only be used with maximum points available`
    },

    playingInPerson: {
      title: 'Playing in Person',
      subtitle: 'Physical Tracking for Tabletop Play',
      content: `The Gambler is THE most immersive class to play in person because you use ACTUAL gambling implements. Here's what you need and how it works:

**Required Materials** (by specialization):
- **Fortune's Favor**: A thematic coin (gold, lucky, or custom with sun/moon symbols) + 7 poker chips or tokens
- **High Roller**: Full polyhedral dice set (keep 3-4 d20s handy) + 21 poker chips + dice tray
- **Card Sharp**: Standard 52-card deck + 13 tokens + discard pile area

**Fortune Points = Physical Chips**: Start with 0 chips. Gain 1 chip per successful attack/spell (2 on crits, 1 for winning gambles). Spend chips to adjust rolls: remove chips equal to the adjustment. Max matches your spec (7/21/13). Chips persist between combats, reset on long rest.

**Coin Flip** (Fortune's Favor): Flip a real coin. Don't like the result? Remove 1 chip from your pool to flip it.

**Dice Abilities** (High Roller): Roll physical dice. Spend chips to adjust individual dice by ±1 each. For Jackpot (3d20), roll 3 d20s and consult the table. For Death Roll, you and the GM roll off.

**Card Draws** (Card Sharp): Draw from a real shuffled deck. Some abilities let you spend chips to redraw or swap cards.

**Quick Reference**:
\`\`\`
GENERATING: Successful attack/spell = +1 chip | Crit = +2 | Win gamble = +1
SPENDING: Adjust roll ±1 = 1 chip | Flip coin = 1 chip | Loaded Dice reroll = 1 chip
PERSISTENCE: Chips persist between combats | Reset to 0 after long rest
\`\`\`

**Why It Works**: The tactile feedback of physically flipping coins, rolling dice, and stacking chips creates genuine suspense and celebration. You're not simulating gambling — you're DOING it. The class becomes a mini-casino at your table.

**Budget Alternatives**: No chips? Use pennies, buttons, or paper clips. No coin? Roll d6 (1-3 = Heads, 4-6 = Tails). No cards? Use dice-based simulation (d13 for value, d4 for suit).`
    }
  },

  // Specializations
  specializations: {
    title: 'Gambler Specializations',
    subtitle: 'Three Paths of Fortune',

    description: `Every Gambler chooses one of three specializations that define their approach to luck manipulation and risk-taking. Each specialization has its own Fortune Point maximum, unique passive ability, and a dedicated talent tree that shares its name:

- **Fortune's Favor** (Max 7 FP) — Coin flip specialist. Talent tree: Fortune's Favor (was Luck Manipulation)
- **High Roller** (Max 21 FP) — Extreme risk/reward. Talent tree: High Roller (was Risk Management)
- **Card Sharp** (Max 13 FP) — Strategic gambler. Talent tree: Card Sharp (was Fate Control)

You may spend talent points in any tree, but your specialization's tree synergizes best with your passive ability.`,

    // Shared passive for all Gambler specializations
    sharedPassive: {
      name: 'Loaded Dice',
      icon: 'Social/Dice Roll',
      description: 'Choose a number between 2 and 19 at the start of each day. Whenever you roll that exact number on any die (for any purpose), you may spend 1 Fortune Point to reroll that die and use the new result. This effect applies to attack rolls, damage rolls, saving throws, and ability checks.',
      mechanicsNote: 'This passive gives Gamblers a way to turn unlucky rolls into second chances. Choose your number based on common roll targets (e.g., 10 for average rolls, 15 for important hits, 7 for lucky number superstition).'
    },

    specs: [
      {
        id: 'fortunes-favor',
        name: "Fortune's Favor",
        icon: 'Utility/Utility',
        color: '#c9aa71',
        theme: 'Luck Manipulation',

        description: `Masters of coin flips and probability. Fortune's Favor Gamblers bend luck to their will, granting rerolls and shaping chance-based outcomes in their favor.`,

        playstyle: 'Probability control, reroll manipulation, consistent luck-based advantages',

        strengths: [
          'Most consistent Gambler specialization',
          'Excellent support through reroll granting',
          'Strong defensive options via luck manipulation',
          'Can influence both ally and enemy rolls',
          'Lower risk than other specializations'
        ],

        weaknesses: [
          'Lower maximum damage potential than High Roller',
          'Requires Fortune Points to be truly effective',
          'Less spectacular results than other specs',
          'Coin flip mechanics still have 50/50 variance'
        ],

        uniquePassive: {
          name: "Lucky Streak",
          icon: 'Healing/Renewal',
          description: 'After 3 consecutive successful attacks/spells, your next coin flip auto-succeeds on the favorable outcome. Resets after use or after missing.',
          mechanicsNote: 'Rewards consistent play and reduces variance during hot streaks. Pairs well with low-risk attacks to build up guaranteed coin flip successes.'
        },

        keyAbilities: [
          "Fate's Coin - Flip a magical coin and choose one of six effects. Heads grants a powerful benefit, tails gives a lesser benefit or minor drawback. (5 mana, spend 1 Fortune Point to flip the result)",
          "Fortune's Favor - Grant an ally advantage on their next roll or force an enemy to reroll a successful attack/save. (2 mana, spend additional Fortune Points for multiple rerolls)",
          "Cheat Fate - As a reaction, adjust any visible roll within 30 feet by ±2 before the outcome is determined. (3 mana, costs 3 Fortune Points to activate)"
        ],

        recommendedFor: 'Players who want more control over randomness, enjoy supporting allies, and prefer consistent results over extreme variance.'
      },

      {
        id: 'high-roller',
        name: 'High Roller',
        icon: 'Utility/Glowing Shard',
        color: '#7a3b2e',
        theme: 'High Stakes Betting',

        description: `Extreme risk for extreme reward. High Rollers bet their own HP, mana, and resources on gambles that yield devastating results or catastrophic failures—all or nothing, every time.`,

        playstyle: 'Extreme risk/reward, resource betting, all-or-nothing plays',

        strengths: [
          'Highest damage potential of all Gambler specs',
          'Can turn near-death situations into victories',
          'Spectacular comeback potential',
          'Resource betting allows for massive burst damage',
          'Thrilling, dramatic gameplay moments'
        ],

        weaknesses: [
          'Extremely high risk of self-damage or death',
          'Can deplete resources quickly on bad luck',
          'Requires excellent Fortune Point management',
          'Vulnerable when bets fail',
          'Can accidentally kill themselves'
        ],

        uniquePassive: {
          name: "Double Down",
          icon: 'Social/Dice Roll',
          description: 'Whenever you successfully land a damaging ability, you may immediately spend 2 Fortune Points to "double down" and repeat the ability at half mana cost. If the second cast also succeeds, gain 3 Fortune Points. If it fails, lose 2 Fortune Points.',
          mechanicsNote: 'High-risk passive that can chain successes into devastating combos or turn wins into losses. Best used when you have Fortune Points to spare and can afford the mana cost.'
        },

        keyAbilities: [
          "All-In - Bet your current hit points. Roll a d100. Each Fortune Point spent (up to 10) shrinks the death window by 1%. At 0 FP: 1-50 double HP, 51-90 full heal, 91-100 drop to 0 HP. At 10 FP: death window eliminated. (10 mana, spend Fortune Points to guarantee survival)",
          "Double or Nothing - Make an attack roll. If it hits, it automatically becomes a critical hit dealing double damage. If it misses, you take the damage you would have dealt. (5 mana, spend Fortune Points to ensure hit)",
          "Betting Blitz - Bet up to half your max HP. If your next attack deals damage equal to or greater than double the bet amount, regain the health. Otherwise, lose the health bet. (5 mana, spend Fortune Points to increase damage)"
        ],

        recommendedFor: 'Players who love extreme risk/reward, enjoy dramatic moments, and don\'t mind occasional spectacular failures in pursuit of legendary victories.'
      },

      {
        id: 'card-sharp',
        name: 'Card Sharp',
        icon: 'Utility/Utility',
        color: '#daa520',
        theme: 'Strategic Gambling',

        description: `Strategic masterminds who treat combat like a high-stakes card game. Card Sharps specialize in prediction, pattern recognition, and calculated risks, turning randomness into advantage through analysis.`,

        playstyle: 'Calculated risks, prediction mechanics, strategic gambling',

        strengths: [
          'Most strategic Gambler specialization',
          'Rewards skill and game knowledge',
          'Strong competitive abilities (Death Roll, Taunt the Odds)',
          'Excellent against intelligent enemies',
          'Prediction mechanics can provide huge advantages'
        ],

        weaknesses: [
          'Requires good game knowledge to maximize',
          'Prediction abilities can fail completely',
          'Less effective against mindless enemies',
          'Competitive abilities require willing or forced participation',
          'Moderate damage compared to High Roller'
        ],

        uniquePassive: {
          name: "Card Counting",
          icon: 'Utility/Ornate Staff',
          description: 'You mentally track d20 results during combat. After you observe 5 d20 rolls (from any source — yours, allies, or enemies), your next prediction-based ability (Taunt the Odds, or any ability requiring you to guess a d20 result) automatically treats your guess as if it were within the success threshold. Resets after use or at the end of combat.',
          mechanicsNote: 'Track every d20 roll you see. After 5 rolls, your next Taunt the Odds automatically hits (no guess needed — the target takes 3d10 force damage with no risk of self-damage). This rewards attentiveness and makes Card Sharp the "counting cards" spec.'
        },

        keyAbilities: [
          "Jackpot - Roll 3d20 and compare to an extensive table of results. Triple numbers grant powerful rewards, while mismatched numbers give lesser effects. (8 mana, spend Fortune Points to adjust individual dice)",
          "Death Roll - Challenge a creature to a game of Death Roll. Both participants roll decreasing dice until someone loses. The loser takes 1-10d10 psychic damage and is stunned. (8 mana, spend Fortune Points to adjust rolls during game)",
          "Taunt the Odds - Choose a target and guess the result of a d20 roll. If you guess within 3, the target takes 3d10 damage. If you're off by more than 3, you take 1d10 damage. (4 mana, Card Counting passive gives advantage)"
        ],

        recommendedFor: 'Players who enjoy strategic gameplay, prediction mechanics, and using game knowledge to gain advantages.'
      }
    ]
  },

  // Example Spells - showcasing the gambling mechanics
  exampleSpells: [
      {
        id: 'lucky-strike',
        name: 'Lucky Strike',
        icon: 'Healing/Renewal',
        spellType: 'ACTION',
        school: 'Luck Manipulation',
        level: 2,

        description: 'Roll 4d12 before attacking. Matching dice set your multiplier: 4-of-a-kind deals 4x, triple deals 3x, pair deals 2x. All different? Take damage equal to the lowest die.',

        typeConfig: {
          castTime: 1,
          castTimeType: 'IMMEDIATE',
          tags: ['damage', 'fortune generation', 'variable', 'rollable table', 'gambler']
        },

        targetingConfig: {
          targetingType: 'single',
          rangeType: 'ranged',
          rangeDistance: 50,
          targetRestrictions: ['enemy']
        },

        resourceCost: {
          resourceTypes: ['mana'],
          resourceValues: { mana: 7 },
          actionPoints: 1,
          components: ['verbal', 'somatic'],
          verbalText: 'Fortuna!',
          somaticText: 'Roll dice in hand'
        },

        resolution: 'DICE',
        effectTypes: ['damage'],

        damageConfig: {
          formula: '1d8',
          elementType: 'force',
          damageType: 'direct',
          scalingType: 'multiplier'
        },

        specialMechanics: {
          fortunePoints: {
            generates: 'variable',
            description: '4 match: +3, 3 match: +2, 2 match: +1, all different: +0'
          },
          diceMatching: {
            dice: '4d12',
            matchingRules: 'Compare dice for matching numbers'
          }
        },

        rollableTable: {
          enabled: true,
          name: 'Lucky Strike Results',
          description: 'Roll 4d12 and check for matching numbers',
          resolutionType: 'DICE',
          resolutionConfig: { diceType: '4d12' },
          entries: [
            {
              range: 'All 4 match',
              result: 'Quadruple damage + 3 Fortune Points + Guaranteed critical hit',
              description: 'Example: 12-12-12-12'
            },
            {
              range: '3 match',
              result: 'Triple damage + 2 Fortune Points',
              description: 'Example: 8-8-8-3'
            },
            {
              range: '2 match',
              result: 'Double damage + 1 Fortune Point',
              description: 'Example: 5-5-9-2'
            },
            {
              range: 'All different',
              result: 'Normal damage + Take damage equal to lowest die',
              description: 'Example: 1-4-7-11 (take 1 damage)'
            }
          ]
        },

        tags: ['damage', 'fortune generation', 'variable', 'rollable table', 'gambler']
      },

      {
        id: 'fates-coin',
        name: "Fate's Coin",
        icon: 'Utility/Utility',
        spellType: 'ACTION',
        school: 'Luck Manipulation',
        level: 3,

        description: 'Flip a magical coin and choose one of six effects. Heads grants a powerful benefit, tails gives a lesser benefit or minor drawback. Spend 1 Fortune Point to flip the result.',

        typeConfig: {
          castTime: 1,
          castTimeType: 'IMMEDIATE',
          tags: ['utility', 'buff', 'debuff', 'coin flip', 'rollable table', 'gambler', 'fortunes-favor']
        },

        targetingConfig: {
          targetingType: 'single',
          rangeType: 'ranged',
          rangeDistance: 30,
          targetRestrictions: ['ally', 'self']
        },

        resourceCost: {
          resourceTypes: ['mana'],
          resourceValues: { mana: 10 },
          actionPoints: 1,
          components: ['verbal', 'material'],
          verbalText: 'Fatum Nummus!',
          materialComponents: 'A golden coin'
        },

        resolution: 'COINS',
        effectTypes: ['buff', 'utility'],

        buffConfig: {
          buffType: 'statusEffect',
          effects: [{
            id: 'fates_favor',
            name: "Fate's Favor",
            description: 'Choose one of six coin effects before flipping. Heads grants a powerful benefit, tails gives a lesser benefit or minor drawback.',
            mechanicsText: 'Choose one of six coin effects. Heads: powerful benefit, Tails: lesser benefit or minor drawback'
          }],
          durationValue: 1,
          durationType: 'minutes',
          durationUnit: 'minutes',
          concentrationRequired: false,
          canBeDispelled: true
        },

        utilityConfig: {
          utilityType: 'fate_manipulation',
          selectedEffects: [{
            id: 'flip_result',
            name: 'Flip Result',
            description: 'Spend 1 Fortune Point to flip the coin result (Heads to Tails or vice versa)'
          }],
          duration: 0,
          durationUnit: 'instant',
          concentration: false,
          power: 'moderate'
        },

        specialMechanics: {
          fortunePoints: {
            cost: 1,
            effect: 'Flip the coin result (Heads to Tails or vice versa)'
          },
          coinFlip: {
            type: 'choice_based',
            choices: 6,
            description: 'Choose one of six coin effects before flipping'
          }
        },

        rollableTable: {
          enabled: true,
          name: "Fate's Coin Effects",
          description: 'Choose one effect, then flip a coin',
          resolutionType: 'COIN_FLIP',
          resolutionConfig: { diceType: 'coin' },
          entries: [
            {
              range: 'Coin of Fortune',
              result: 'Heads: Advantage on next roll | Tails: Disadvantage on next roll',
              description: 'Affects your next attack roll or saving throw'
            },
            {
              range: 'Coin of Double or Nothing',
              result: 'Heads: Double next attack damage | Tails: Halve next attack damage',
              description: 'Affects your next damaging attack'
            },
            {
              range: 'Coin of Heal or Harm',
              result: 'Heads: Heal 2d6 HP | Tails: Take 1d6 damage',
              description: 'Immediate healing or self-damage'
            },
            {
              range: 'Coin of Mana Surge',
              result: 'Heads: Regain one spell use | Tails: Lose one spell use',
              description: 'Affects your available spell slots'
            },
            {
              range: 'Coin of Teleport or Trap',
              result: 'Heads: Teleport 30 feet | Tails: Restrained for 1 round',
              description: 'Movement manipulation'
            },
            {
              range: 'Coin of Speed',
              result: 'Heads: Double movement for 1 min | Tails: Halve movement for 1 min',
              description: 'Speed modification'
            }
          ]
        },

        tags: ['utility', 'buff', 'debuff', 'coin flip', 'rollable table', 'gambler', 'fortunes-favor']
      },

      {
        id: 'jackpot',
        name: 'Jackpot',
        icon: 'Utility/Utility',
        spellType: 'ACTION',
        school: 'Strategic Gambling',
        level: 8,

        description: 'Roll 3d20 slot machine. Triple numbers grant powerful rewards. Each combination can only occur once per long rest. Spend Fortune Points to adjust individual dice. NOTE: Jackpot draws from ALL elements (fire, lightning, radiant, necrotic) — it is the only Gambler ability that breaks the force/psychic convention, because it doesn\'t play by any rules.',

        typeConfig: {
          castTime: 1,
          castTimeType: 'IMMEDIATE',
          tags: ['ultimate', 'random', 'high risk', 'high reward', 'rollable table', 'gambler', 'card-sharp']
        },

        targetingConfig: {
          targetingType: 'self',
          rangeType: 'self'
        },

        resourceCost: {
          resourceTypes: ['mana'],
          resourceValues: { mana: 28 },
          actionPoints: 2,
          components: ['verbal', 'somatic', 'material'],
          verbalText: 'Fortuna Maxima!',
          somaticText: 'Pull imaginary slot machine lever',
          materialComponents: 'Three golden dice'
        },

        resolution: 'DICE',
        effectTypes: ['utility'],

        utilityConfig: {
          utilityType: 'fate_manipulation',
          selectedEffects: [{
            id: 'slot_machine',
            name: 'Slot Machine',
            description: 'Roll 3d20 and match results for various powerful effects. Spend Fortune Points to adjust individual dice by ±1 per point.'
          }],
          duration: 1,
          durationUnit: 'hours',
          concentration: false,
          power: 'major'
        },

        specialMechanics: {
          fortunePoints: {
            usage: 'Adjust individual dice by ±1 per point spent',
            example: 'Roll 19-19-18, spend 1 point to make it 19-19-19'
          },
          usageLimit: {
            type: 'long_rest',
            restriction: 'Each specific triple combination can only occur once per long rest'
          },
          slotMachine: {
            dice: '3d20',
            matchingRequired: true
          }
        },

        rollableTable: {
          enabled: true,
          name: 'Jackpot Slot Machine',
          description: 'Roll 3d20 and match the results',
          resolutionType: 'DICE',
          resolutionConfig: { diceType: '3d20' },
          entries: [
            { range: '20-20-20', result: 'Rare magical item + max damage on all attacks (1 hour)', description: 'Ultimate jackpot' },
            { range: '19-19-19', result: '5d10 radiant damage to all enemies in 30ft + 10 temp HP', description: 'Instant' },
            { range: '18-18-18', result: 'Advantage on all saving throws (1 hour)', description: 'Defensive boost' },
            { range: '17-17-17', result: 'Summon ethereal dragon ally (1 minute)', description: 'Combat summon' },
            { range: '16-16-16', result: 'Heal 40 HP + resistance to all damage (1 hour)', description: 'Survival boost' },
            { range: '15-15-15', result: '+5 to attack rolls and armor (10 minutes)', description: 'Combat enhancement' },
            { range: '14-14-14', result: 'Become ethereal - phase through objects (1 minute)', description: 'Utility/escape' },
            { range: '13-13-13', result: '4d10 lightning to 3 enemies in 30ft', description: 'Instant damage' },
            { range: '12-12-12', result: 'Storm: 8d10 lightning to all enemies in 40ft', description: 'AOE devastation' },
            { range: '11-11-11', result: 'Resistance to all damage + 2d10 radiant on next attack (1 hour)', description: 'Sustained power' },
            { range: '10-10-10', result: 'Advantage on attacks + heal 30 HP (1 hour)', description: 'Offensive boost' },
            { range: '9-9-9', result: 'Double spell damage but take 2d10 per spell (1 minute)', description: 'High risk/reward' },
            { range: '8-8-8', result: 'Gain extra turn immediately', description: 'Action economy' },
            { range: '7-7-7', result: 'Regain all spell uses + heal 50 HP', description: 'Full restore' },
            { range: '6-6-6', result: 'Celestial guardian: +5 armor and saves (1 minute)', description: 'Divine protection' },
            { range: '5-5-5', result: 'Shield absorbs next 50 damage', description: 'Damage absorption' },
            { range: '4-4-4', result: '6d6 fire to all in 20ft radius (including self)', description: 'Dangerous AOE' },
            { range: '3-3-3', result: 'Heal 20 HP + resistance to all damage (1 hour)', description: 'Moderate boost' },
            { range: '2-2-2', result: '3d10 necrotic to target + heal same amount', description: 'Life drain' },
            { range: '1-1-1', result: 'Take 5d10 damage + lose all spell uses for day', description: 'Critical failure' },
            { range: 'No Match', result: 'Gain 1d6 temp HP + 1 Fortune Point', description: 'Consolation prize' }
          ]
        },

        tags: ['ultimate', 'random', 'high risk', 'high reward', 'rollable table', 'gambler', 'card-sharp']
      },

      
      {
        id: 'all-in',
        name: 'All-In',
        icon: 'Social/Dice Roll',
        spellType: 'ACTION',
        school: 'High Stakes Betting',
        level: 10,

        description: 'Bet your current HP on d100 roll. Each Fortune Point spent (up to 10) shrinks the death window by 1%. At 0 FP spent: 1-50 double HP, 51-90 full heal, 91-100 DEATH. At 10 FP spent: death window eliminated, 51-100 always full heal.',

        typeConfig: {
          castTime: 1,
          castTimeType: 'IMMEDIATE',
          tags: ['ultimate', 'life or death', 'extreme risk', 'healing', 'rollable table', 'gambler', 'high-roller']
        },

        targetingConfig: {
          targetingType: 'self',
          rangeType: 'self'
        },

        resourceCost: {
          resourceTypes: ['mana'],
          resourceValues: { mana: 36 },
          actionPoints: 2,
          components: ['verbal', 'somatic'],
          verbalText: 'Omnia Aut Nihil!',
          somaticText: 'Push all chips forward'
        },

        resolution: 'DICE',
        effectTypes: ['healing', 'utility'],

        healingConfig: {
          formula: 'variable',
          healingType: 'direct',
          description: 'Roll d100. Results determine your fate.'
        },

        utilityConfig: {
          utilityType: 'fate_manipulation',
          selectedEffects: [{
            id: 'life_gamble',
            name: 'Life or Death Gamble',
            description: 'Bet your current HP on a d100 roll. Fortune Points can adjust the result.'
          }],
          duration: 0,
          durationUnit: 'instant',
          concentration: false,
          power: 'major'
        },

        specialMechanics: {
          fortunePoints: {
            critical: true,
            recommendation: '5-10 points to shrink death window',
            usage: 'Each FP spent (max 10) reduces death window by 1%. With 10 FP: death window shrinks from 91-100 to just 100, or is eliminated entirely if you spend all 10.'
          },
          lifeOrDeath: {
            warning: 'Can instantly kill you at 0 FP spent',
            scalingDeathWindow: {
              '0 FP spent': { safe: '1-90', death: '91-100' },
              '5 FP spent': { safe: '1-95', death: '96-100' },
              '10 FP spent': { safe: '1-100', death: 'ELIMINATED' }
            }
          }
        },

        rollableTable: {
          enabled: true,
          name: 'All-In Results',
          description: 'Roll 1d100 - your life is on the line. Death window shrinks by 1% per Fortune Point spent (max 10).',
          resolutionType: 'DICE',
          resolutionConfig: { diceType: '1d100' },
          entries: [
            { range: { min: 1, max: 50 }, result: 'Double your current hit points', description: 'Moderate success' },
            { range: { min: 51, max: 90 }, result: 'Heal to full health', description: 'Optimal result - aim for this' },
            { range: { min: 91, max: 100 }, result: 'Drop to 0 hit points (shrinks by 1% per FP spent)', description: 'DEATH window - spend FP to shrink or eliminate' }
          ]
        },

        tags: ['ultimate', 'life or death', 'extreme risk', 'healing', 'rollable table', 'gambler', 'high-roller']
      },

      {
        id: 'death-roll',
        name: 'Death Roll',
        icon: 'Necrotic/Demonic Empowerment',
        spellType: 'ACTION',
        school: 'Strategic Gambling',
        level: 7,

        description: 'Challenge creature to Death Roll minigame. Both roll d20s with decreasing maximums until someone loses. Loser takes psychic damage (winner chooses) and is stunned. Unwilling targets make Spirit save.',

        typeConfig: {
          castTime: 1,
          castTimeType: 'IMMEDIATE',
          tags: ['competitive', 'minigame', 'damage', 'control', 'psychic', 'gambler', 'card-sharp']
        },

        targetingConfig: {
          targetingType: 'single',
          rangeType: 'ranged',
          rangeDistance: 15,
          targetRestrictions: ['enemy']
        },

        resourceCost: {
          resourceTypes: ['mana'],
          resourceValues: { mana: 24 },
          actionPoints: 2,
          components: ['verbal', 'somatic'],
          verbalText: 'Ludus Mortis!',
          somaticText: 'Challenge opponent with dice'
        },

        resolution: 'DICE',
        effectTypes: ['damage', 'control'],

        damageConfig: {
          formula: '1d10 to 10d10',
          elementType: 'psychic',
          damageType: 'direct',
          description: 'Winner chooses how many d10s (1-10) the loser takes as psychic damage',
          savingThrowConfig: {
            enabled: true,
            savingThrowType: 'spirit',
            difficultyClass: 15,
            saveOutcome: 'negates'
          }
        },

        controlConfig: {
          controlType: 'incapacitation',
          strength: 'moderate',
          duration: 1,
          durationUnit: 'rounds',
          saveDC: 15,
          saveType: 'spirit',
          savingThrow: true,
          effects: [{
            id: 'stun',
            name: 'Stunned',
            description: 'Loser is stunned for 1 round, unable to take actions or reactions',
            config: {
              saveType: 'constitution',
              saveDC: 15,
              duration: 1,
              durationUnit: 'rounds',
              durationType: 'rounds',
              recoveryMethod: 'automatic'
            }
          }]
        },


        specialMechanics: {
          fortunePoints: {
            usage: 'Adjust rolls during game - increase to set low max, decrease to stay under max'
          },
          minigame: {
            type: 'death_roll',
            rules: 'Both roll d20, lower becomes new max, repeat until someone rolls over current max',
            example: 'R1: You 15, Enemy 12 (max:12). R2: You 8, Enemy 11 (Enemy loses)'
          },
          savingThrow: {
            type: 'spirit',
            dc: '8 + proficiency + Charisma',
            onFail: 'Compelled to play'
          }
        },

        tags: ['competitive', 'minigame', 'damage', 'control', 'psychic', 'gambler', 'card-sharp']
      },

      {
        id: 'double-or-nothing',
        name: 'Double or Nothing',
        icon: 'Utility/Empowered Warrior',
        spellType: 'ACTION',
        school: 'High Stakes Betting',
        level: 4,

        description: 'Make an attack roll. On hit: automatic critical hit with double damage. On miss: you take the damage instead. Spend 5-10 Fortune Points to guarantee hit.',

        typeConfig: {
          castTime: 1,
          castTimeType: 'IMMEDIATE',
          tags: ['damage', 'critical hit', 'self damage risk', 'gambler', 'high-roller']
        },

        targetingConfig: {
          targetingType: 'single',
          rangeType: 'weapon_or_spell_range'
        },

        durationConfig: {
          durationType: 'instant'
        },

        resourceCost: {
          resourceTypes: ['mana'],
          resourceValues: { mana: 14 },
          actionPoints: 1,
          components: ['verbal'],
          verbalText: 'Duplica Aut Nihil!'
        },

        resolution: 'ATTACK_ROLL',

        damageConfig: {
          formula: 'weapon_or_spell',
          damageType: 'variable',
          scalingType: 'critical_on_hit'
        },


        specialMechanics: {
          fortunePoints: {
            recommendation: '5-10 points to guarantee hit',
            usage: 'Adjust attack roll to ensure success',
            transforms: 'From suicidal gamble to guaranteed crit'
          },
          criticalHit: {
            automatic: true,
            condition: 'on_hit'
          },
          selfDamage: {
            condition: 'on_miss',
            amount: 'equal_to_would_be_damage'
          }
        },

        tags: ['damage', 'critical hit', 'self damage risk', 'gambler', 'high-roller']
      },

      {
        id: 'taunt-the-odds',
        name: 'Taunt the Odds',
        icon: 'Radiant/Radiant Warrior',
        spellType: 'ACTION',
        school: 'Strategic Gambling',
        level: 3,

        description: 'Guess a number 1-20, then roll d20. Guess within 3: target takes 3d10 damage. Off by 4+: you take 1d10 damage. Spend Fortune Points to adjust roll toward guess.',

        typeConfig: {
          castTime: 1,
          castTimeType: 'IMMEDIATE',
          tags: ['damage', 'prediction', 'skill based', 'gambler', 'card-sharp']
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
          resourceValues: { mana: 10 },
          actionPoints: 1,
          components: ['verbal', 'somatic'],
          verbalText: 'Provoco Fortunam!',
          somaticText: 'Point at target and call out number'
        },

        resolution: 'DICE',

        damageConfig: {
          formula: '4d6',
          elementType: 'force',
          damageType: 'direct',
          scalingType: 'accuracy_based'
        },


        specialMechanics: {
          fortunePoints: {
            usage: 'After seeing roll, adjust toward your guess',
            example: 'Guess 15, roll 11, spend 4 points to make it 15'
          },
          prediction: {
            type: 'number_guess',
            range: '1-20',
            successMargin: 3,
            failureMargin: 4
          },
          synergy: {
            cardCounting: 'Card Sharp passive: After observing 5 d20 rolls in combat, your next Taunt the Odds auto-hits (target takes 3d10 damage with no risk of self-damage). No guess needed — you already know the answer.'
          }
        },

        tags: ['damage', 'prediction', 'skill based', 'gambler', 'card-sharp']
      },

      {
        id: 'coin-toss',
        name: 'Coin Toss',
        icon: 'Utility/Utility',
        spellType: 'ACTION',
        school: 'Luck Manipulation',
        level: 2,

        description: 'Flip a coin. Heads: gain bonus to all rolls. Tails: take penalty to all rolls. Spend Fortune Points to flip the result.',

        typeConfig: {
          castTime: 1,
          castTimeType: 'IMMEDIATE',
          tags: ['buff', 'debuff', 'coin flip', 'rollable table', 'duration', 'gambler']
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
          resourceTypes: ['mana'],
          resourceValues: { mana: 6 },
          actionPoints: 1,
          components: ['verbal', 'material'],
          verbalText: 'Nummus Fortunae!',
          materialText: 'A coin'
        },

        resolution: 'COIN_FLIP',

        buffConfig: {
          buffType: 'statEnhancement',
          effects: [{
            id: 'coin_toss_buff',
            name: 'Coin Toss Buff',
            description: 'On heads: +2 to all rolls. On tails: -2 to all rolls.',
            statModifier: {
              stat: 'all_rolls',
              magnitude: 2,
              magnitudeType: 'flat',
              condition: 'on_heads'
            }
          }],
          durationValue: 1,
          durationType: 'hours',
          durationUnit: 'hours',
          concentrationRequired: false,
          canBeDispelled: true
        },

        specialMechanics: {
          fortunePoints: {
            cost: 1,
            effect: 'Flip the result (Heads to Tails or vice versa)',
            guarantee: 'With 1 point, always get +2 bonus'
          },
          coinFlip: {
            type: '1d2',
            heads: 2,
            tails: 1
          }
        },

        rollableTable: {
          enabled: true,
          name: 'Coin Toss Results',
          description: 'Flip a coin',
          resolutionType: 'COIN_FLIP',
          resolutionConfig: { diceType: 'coin' },
          entries: [
            { range: 'Heads', result: '+2 bonus to all rolls for 1 hour', description: 'Positive outcome' },
            { range: 'Tails', result: '-2 penalty to all rolls for 1 hour', description: 'Negative outcome' }
          ]
        },

        tags: ['buff', 'debuff', 'coin flip', 'rollable table', 'duration', 'gambler']
      },

      {
        id: 'gamblers-insight',
        name: "Gambler's Insight",
        icon: 'Psychic/Focused Mind',
        spellType: 'ACTION',
        school: 'Utility',
        level: 2,

        description: 'Gain advantage on Insight and Perception checks against one creature for 10 minutes. Detect lies, read intentions, notice body language, predict moves.',

        typeConfig: {
          castTime: 1,
          castTimeType: 'IMMEDIATE',
          tags: ['utility', 'social', 'detection', 'gambler']
        },

        targetingConfig: {
          targetingType: 'single',
          rangeType: 'ranged',
          rangeDistance: 30
        },

        durationConfig: {
          durationType: 'rounds',
          duration: 10,
          durationUnit: 'minute'
        },

        resourceCost: {
          resourceTypes: ['mana'],
          resourceValues: { mana: 6 },
          actionPoints: 1,
          components: ['verbal', 'somatic'],
          verbalText: 'Perspicio Verum!',
          somaticText: 'Touch temple and point at target'
        },

        resolution: 'AUTOMATIC',

        buffConfig: {
          buffType: 'skillEnhancement',
          effects: [{
            id: 'gamblers_insight',
            name: "Gambler's Insight",
            description: 'Gain advantage on Insight and Perception checks against target for 10 minutes',
            mechanicsText: 'Advantage on Insight and Perception checks for 10 minutes',
            skillModifier: {
              skills: ['Insight', 'Perception'],
              magnitude: 1,
              magnitudeType: 'advantage'
            }
          }],
          durationValue: 10,
          durationType: 'minutes',
          durationUnit: 'minutes',
          concentrationRequired: false,
          canBeDispelled: true
        },

        specialMechanics: {
          utility: {
            uses: ['Detect lies', 'Read intentions', 'Notice body language', 'Predict moves'],
            synergy: 'Pairs with Gambler charisma and deception skills'
          },
          social: {
            applications: ['Negotiations', 'Detecting ambushes', 'Social encounters']
          }
        },

        tags: ['utility', 'social', 'detection', 'gambler']
      },

      {
        id: 'fools-gold',
        name: "Fool's Gold",
        icon: 'Utility/Utility',
        spellType: 'ACTION',
        school: 'Illusion',
        level: 2,

        description: 'Create illusory gold/treasure (up to 100gp value) that looks real but vanishes when touched. Lasts 1 hour. Perfect for bribes, distractions, escapes, cons, and traps.',

        typeConfig: {
          castTime: 1,
          castTimeType: 'IMMEDIATE',
          tags: ['utility', 'illusion', 'deception', 'gambler']
        },

        targetingConfig: {
          targetingType: 'area',
          rangeType: 'touch'
        },

        durationConfig: {
          durationType: 'rounds',
          duration: 1,
          durationUnit: 'hour'
        },

        resourceCost: {
          resourceTypes: ['mana'],
          resourceValues: { mana: 7 },
          actionPoints: 1,
          components: ['verbal', 'somatic', 'material'],
          verbalText: 'Aurum Falsum!',
          somaticText: 'Conjure illusory treasure',
          materialText: 'A copper piece'
        },

        resolution: 'AUTOMATIC',

        utilityConfig: {
          utilityType: 'illusion',
          selectedEffects: [{
            id: 'fools_gold',
            name: "Fool's Gold",
            description: 'Create illusory gold/treasure (up to 100gp value) that looks real but vanishes when touched'
          }],
          duration: 1,
          durationUnit: 'hours',
          concentration: false,
          power: 'moderate'
        },

        specialMechanics: {
          illusion: {
            quality: 'Perfect to visual inspection',
            substance: 'No physical substance',
            detection: 'Touch immediately reveals fake'
          },
          utility: {
            uses: ['Bribes', 'Distractions', 'Escape tactics', 'Deception', 'Cons', 'Baiting traps']
          }
        },

        tags: ['utility', 'illusion', 'deception', 'gambler']
      },

    // ========================================
    // LEVEL 1 SPELLS
    // ========================================
    {
      id: 'gambler_lucky_toss',
      name: 'Lucky Toss',
      description: 'Toss a coin and channel luck into a minor attack. Heads deals damage, tails provides a small buff.',
      level: 1,
      spellType: 'ACTION',
      icon: 'Utility/Utility',

      typeConfig: {
        school: 'evocation',
        icon: 'Utility/Utility',
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 30,
        targetRestrictions: ['enemy', 'ally']
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 3 },
        actionPoints: 1,
        components: ['verbal', 'somatic'],
        verbalText: 'Luck be mine!',
        somaticText: 'Flip a coin'
      },

      resolution: 'COIN_FLIP',
      effectTypes: ['damage', 'buff'],

      damageConfig: {
        formula: '1d8 + charisma',
        elementType: 'force',
        damageType: 'direct'
      },

      buffConfig: {
        buffType: 'luck',
        effects: [{
          id: 'minor_luck',
          name: 'Minor Luck',
          description: '+1 to your next roll',
          statModifier: { stat: 'all_rolls', magnitude: 1, magnitudeType: 'flat' },
          mechanicsText: '+1 to next roll',
          charges: 1
        }],
        durationValue: 1,
        durationType: 'rounds',
        durationUnit: 'rounds'
      },

      specialMechanics: {
        coinFlip: {
          heads: { effect: 'damage', target: 'enemy' },
          tails: { effect: 'buff', target: 'self' }
        }
      },

      tags: ['damage', 'buff', 'coin flip', 'level 1', 'gambler']
    },

    {
      id: 'gambler_beginners_luck',
      name: "Beginner's Luck",
      description: 'Channel the power of fortune to grant yourself advantage on your next ability check or attack roll.',
      level: 1,
      spellType: 'ACTION',
      icon: 'Social/Dice Roll',

      typeConfig: {
        school: 'divination',
        icon: 'Social/Dice Roll',
        castTime: 1,
        castTimeType: 'BONUS'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 3 },
        actionPoints: 0,
        components: ['verbal'],
        verbalText: 'First timer!'
      },

      resolution: 'NONE',
      effectTypes: ['buff'],

      buffConfig: {
        buffType: 'advantage',
        effects: [{
          id: 'beginners_advantage',
          name: "Beginner's Advantage",
          description: 'Gain advantage on your next ability check or attack roll',
          mechanicsText: 'Advantage on next ability check or attack roll',
          charges: 1
        }],
        durationValue: 1,
        durationType: 'rounds',
        durationUnit: 'uses'
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 2
      },

      tags: ['buff', 'luck', 'level 1', 'gambler']
    },

    {
      id: 'gambler_dice_dart',
      name: 'Dice Dart',
      description: 'Throw a magically enchanted die that deals damage based on the roll.',
      level: 1,
      spellType: 'ACTION',
      icon: 'Social/Dice Roll',

      typeConfig: {
        school: 'evocation',
        icon: 'Social/Dice Roll',
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
        resourceValues: { mana: 3 },
        actionPoints: 1,
        components: ['somatic'],
        somaticText: 'Throw enchanted die'
      },

      resolution: 'DICE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '1d8',
        elementType: 'force',
        damageType: 'direct'
      },

      tags: ['damage', 'ranged', 'level 1', 'gambler']
    },

    // ========================================
    // LEVEL 5 SPELLS
    // ========================================
    {
      id: 'gambler_hot_streak',
      name: 'Hot Streak',
      description: 'When fortune favors you, ride the wave! Each successful attack this turn grants bonus damage on the next.',
      level: 5,
      spellType: 'ACTION',
      icon: 'Fire/Enveloping Fire',

      typeConfig: {
        school: 'enchantment',
        icon: 'Fire/Enveloping Fire',
        castTime: 1,
        castTimeType: 'BONUS'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 16 },
        actionPoints: 0,
        components: ['verbal'],
        verbalText: "I'm on fire!"
      },

      resolution: 'NONE',
      effectTypes: ['buff'],

      buffConfig: {
        buffType: 'statEnhancement',
        effects: [{
          id: 'hot_streak',
          name: 'Hot Streak',
          description: 'Each hit this turn grants +1d6 damage on your next attack, stacking up to 4 times.',
          mechanicsText: '+1d6 damage per hit this turn, stacking up to 4 times',
          charges: 4
        }],
        durationValue: 1,
        durationType: 'rounds',
        durationUnit: 'rounds'
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 4
      },

      tags: ['buff', 'damage', 'level 5', 'gambler']
    },

    {
      id: 'gambler_mirage_flip',
      name: 'Mirage Flip',
      description: 'Flip a coin to double or nullify your next spell or attack damage.',
      level: 5,
      spellType: 'REACTION',
      icon: 'Utility/Utility',

      typeConfig: {
        school: 'enchantment',
        icon: 'Utility/Utility',
        castTime: 1,
        castTimeType: 'REACTION'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      resourceCost: {
        resourceTypes: ['mana'],
          resourceValues: { mana: 17 },
          actionPoints: 0,
          components: ['verbal'],
          verbalText: 'Double or nothing!'
        },

        resolution: 'COIN_FLIP',
        effectTypes: ['buff'],

        buffConfig: {
          buffType: 'damage_modifier',
          effects: [{
            id: 'mirage_flip_double',
            name: 'Mirage Flip Double',
          description: 'On heads: double damage. On tails: zero damage.',
          mechanicsText: 'Heads: double damage. Tails: zero damage.'
        }]
      },

      specialMechanics: {
        coinFlip: {
          heads: { effect: 'double_damage', multiplier: 2 },
          tails: { effect: 'no_damage', multiplier: 0 }
        },
        trigger: 'on_attack_hit'
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 3
      },

      tags: ['buff', 'coin flip', 'high risk', 'level 5', 'gambler']
    },

    {
      id: 'gambler_fate_reroll',
      name: 'Fate Reroll',
      description: 'Reroll any dice you roll this turn and take the better result.',
      level: 5,
      spellType: 'ACTION',
      icon: 'Social/Dice Roll',

      typeConfig: {
        school: 'divination',
        icon: 'Social/Dice Roll',
        castTime: 1,
        castTimeType: 'BONUS'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      resourceCost: {
        resourceTypes: ['mana'],
          resourceValues: { mana: 18 },
          actionPoints: 0,
          components: ['somatic'],
          somaticText: 'Sleight of hand'
        },

        resolution: 'NONE',
        effectTypes: ['buff'],

        buffConfig: {
          buffType: 'reroll',
          effects: [{
            id: 'fate_reroll',
            name: 'Fate Reroll',
          description: 'Reroll any dice this turn and take the better result.',
          mechanicsText: 'Reroll any dice this turn and take the better result'
        }],
        durationValue: 1,
        durationType: 'rounds',
        durationUnit: 'rounds'
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 4
      },

      tags: ['buff', 'reroll', 'level 5', 'gambler']
    },

    // ========================================
    // LEVEL 6 SPELLS
    // ========================================
    {
      id: 'gambler_house_advantage',
      name: 'House Advantage',
      description: 'The house always wins. Steal luck from enemies, imposing disadvantage on them while granting yourself advantage.',
      level: 6,
      spellType: 'ACTION',
      icon: 'Psychic/Mind Roar',

      typeConfig: {
        school: 'enchantment',
        icon: 'Psychic/Mind Roar',
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
          resourceValues: { mana: 20 },
          actionPoints: 2,
          components: ['verbal', 'somatic'],
          verbalText: 'The house always wins!',
        somaticText: 'Card dealer gesture'
      },

      resolution: 'NONE',
      effectTypes: ['debuff', 'buff'],

      debuffConfig: {
        debuffType: 'disadvantage',
        effects: [{
          id: 'stolen_luck',
          name: 'Stolen Luck',
          description: 'Enemies have disadvantage on attack rolls and saving throws.',
          statPenalty: [{ stat: 'attack', value: -99, magnitudeType: 'disadvantage' }, { stat: 'saving_throws', value: -99, magnitudeType: 'disadvantage' }],
          mechanicsText: 'Disadvantage on attack rolls and saving throws'
        }],
        durationValue: 3,
        durationType: 'rounds',
        durationUnit: 'rounds',
        saveDC: 16,
        saveType: 'spirit',
        saveOutcome: 'negates'
      },

      buffConfig: {
        buffType: 'advantage',
        effects: [{
          id: 'house_advantage',
          name: 'House Advantage',
          description: 'You have advantage on all rolls for the duration.',
          mechanicsText: 'Advantage on all rolls for the duration'
        }],
        durationValue: 3,
        durationType: 'rounds',
        durationUnit: 'rounds'
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 5
      },

      tags: ['debuff', 'buff', 'luck', 'level 6', 'gambler']
    },

    {
      id: 'gambler_card_shark',
      name: 'Card Shark',
      description: 'Draw from your magical deck to unleash one of four powerful effects based on the suit.',
      level: 6,
      spellType: 'ACTION',
      icon: 'Psychic/Mental Chaos',

      typeConfig: {
        school: 'evocation',
        icon: 'Psychic/Mental Chaos',
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 60,
        targetRestrictions: ['enemy', 'ally']
      },

      resourceCost: {
        resourceTypes: ['mana'],
          resourceValues: { mana: 22 },
          actionPoints: 1,
          components: ['somatic'],
          somaticText: 'Draw a card'
        },

        resolution: 'DICE',
        effectTypes: ['utility'],

        rollableTable: {
        diceFormula: '1d4',
        entries: [
          { 
            roll: 1, 
            name: 'Spades (Damage)', 
            effect: { type: 'damage', formula: '6d8', element: 'force' } 
          },
          { 
            roll: 2, 
            name: 'Hearts (Healing)', 
            effect: { type: 'healing', formula: '5d8' } 
          },
          { 
            roll: 3, 
            name: 'Diamonds (Gold)', 
            effect: { type: 'buff', description: 'Target gains 100gp worth of magical currency' } 
          },
          { 
            roll: 4, 
            name: 'Clubs (Control)', 
            effect: { type: 'stun', duration: 2, durationUnit: 'rounds' } 
          }
        ]
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 3
      },

      tags: ['damage', 'healing', 'control', 'variable', 'rollable table', 'level 6', 'gambler']
    },

    {
      id: 'gambler_poker_face',
      name: 'Poker Face',
      description: 'Project an aura of unreadability, becoming immune to charm, fear, and mind-reading effects.',
      level: 6,
      spellType: 'ACTION',
      icon: 'General/Fiery Rage',

      typeConfig: {
        school: 'abjuration',
        icon: 'General/Fiery Rage',
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
          somaticText: 'Assume poker face'
      },

      resolution: 'NONE',
      effectTypes: ['buff'],

      buffConfig: {
        buffType: 'immunity',
        effects: [{
          id: 'poker_face',
          name: 'Poker Face',
          description: 'Immune to charm, fear, and mind-reading effects.',
          mechanicsText: 'Immune to charm, fear, and mind-reading effects',
          damageImmunity: ['charm', 'fear', 'mind_reading']
        }],
        durationValue: 5,
        durationType: 'rounds',
        durationUnit: 'rounds'
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 4
      },

      tags: ['buff', 'immunity', 'mental', 'level 6', 'gambler']
    },

    // ========================================
    // LEVEL 9 SPELLS
    // ========================================
    {
      id: 'gambler_high_roller',
      name: 'High Roller',
      description: 'Make the ultimate gamble. Roll a d20 - on a 15+, deal devastating damage. On a 1-5, take that damage yourself.',
      level: 9,
      spellType: 'ACTION',
      icon: 'Social/Dice Roll',

      typeConfig: {
        school: 'evocation',
        icon: 'Social/Dice Roll',
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
          resourceValues: { mana: 32 },
          actionPoints: 2,
          components: ['verbal', 'somatic'],
          verbalText: 'High stakes!',
          somaticText: 'Roll the divine die'
        },

        resolution: 'DICE',
        effectTypes: ['damage'],

        damageConfig: {
          formula: '18d6 + charisma',
        elementType: 'force',
        damageType: 'direct'
      },

      specialMechanics: {
        highRoll: {
          diceFormula: '1d20',
          success: { min: 15, effect: 'deal_damage_to_target' },
          neutral: { min: 6, max: 14, effect: 'deal_half_damage' },
          failure: { max: 5, effect: 'deal_damage_to_self' }
        }
      },

      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },

      tags: ['damage', 'high risk', 'high reward', 'level 9', 'gambler']
    },

    {
      id: 'gambler_jackpot_surge',
      name: 'Jackpot Surge',
      description: 'Hit the ultimate jackpot! Roll multiple dice and if any match, multiply your damage exponentially.',
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
        rangeDistance: 60,
        aoeShape: 'circle',
        aoeParameters: { radius: 25 },
        targetRestrictions: ['enemy']
      },

      resourceCost: {
        resourceTypes: ['mana'],
          resourceValues: { mana: 34 },
          actionPoints: 3,
          components: ['verbal', 'somatic'],
          verbalText: 'JACKPOT!',
          somaticText: 'Pull the lever'
        },

        resolution: 'DICE',
        effectTypes: ['damage'],

        damageConfig: {
          formula: '16d6 + charisma',
        elementType: 'force',
        damageType: 'direct',
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'agility',
          difficultyClass: 19,
          saveOutcome: 'halves'
        }
      },

      specialMechanics: {
        jackpot: {
          diceFormula: '3d6',
          matching: {
            twoMatch: { multiplier: 2, description: 'Double damage!' },
            threeMatch: { multiplier: 4, description: 'JACKPOT! Quadruple damage!' }
          }
        }
      },

      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },

      tags: ['damage', 'aoe', 'high reward', 'level 9', 'gambler']
    },

    {
      id: 'gambler_fortune_reversal',
      name: 'Fortune Reversal',
      description: 'Reverse the fortunes of battle. Swap your current HP percentage with a target enemy.',
      level: 9,
      spellType: 'ACTION',
      icon: 'Arcane/Rewind Time',

      typeConfig: {
        school: 'transmutation',
        icon: 'Arcane/Rewind Time',
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
          resourceValues: { mana: 34 },
          actionPoints: 2,
          components: ['verbal', 'somatic'],
          verbalText: 'Fortune flip!',
        somaticText: 'Dramatic coin flip'
      },

      resolution: 'COIN_FLIP',
      effectTypes: ['utility'],

      specialMechanics: {
        coinFlip: {
          heads: { effect: 'swap_hp_percentage', description: 'Your HP% and target HP% are swapped' },
          tails: { effect: 'nothing', description: 'Nothing happens' }
        }
      },

      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },

      tags: ['utility', 'coin flip', 'high risk', 'level 9', 'gambler']
    },

    // ADDITIONAL LEVEL 4 SPELLS
    // ADDITIONAL LEVEL 7 SPELL
    {
      id: 'gambler_all_or_nothing',
      name: 'All or Nothing',
      description: 'Flip a coin to unleash devastating force on all enemies or take damage yourself.',
      level: 7,
      spellType: 'ACTION',
      effectTypes: ['damage'],

      typeConfig: {
        school: 'evocation',
        icon: 'Utility/Utility',
        tags: ['damage', 'aoe', 'coin flip', 'ultimate', 'universal'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 50,
        aoeShape: 'circle',
        aoeParameters: { radius: 30 },
        targetRestrictions: ['enemy']
      },

      damageConfig: {
        formula: '12d6',
        elementType: 'force',
        damageType: 'area',
        criticalConfig: {
          critType: 'effect',
          critEffects: ['all_or_nothing_stun']
        }
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: {
          mana: 25
        },
        actionPoints: 2,
        components: ['verbal', 'somatic']
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 8
      },

      resolution: 'COIN_FLIP',
      tags: ['damage', 'aoe', 'coin flip', 'ultimate', 'universal']
    },

    // ADDITIONAL LEVEL 8 SPELL
    {
      id: 'gambler_weighted_dice',
      name: 'Weighted Dice',
      description: 'Spend Fortune Points to guarantee your damage roll hits maximum. Base: 14d6 force damage. Each Fortune Point spent treats one d6 as if it rolled 6 (max 7 dice weighted). No coin flip, no gamble — just results.',
      level: 8,
      spellType: 'ACTION',
      effectTypes: ['damage'],

      typeConfig: {
        school: 'evocation',
        icon: 'Social/Dice Roll',
        tags: ['damage', 'guaranteed', 'fortune point spending', 'universal'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 50,
        targetRestrictions: ['enemy'],
        maxTargets: 1
      },

      damageConfig: {
        formula: '14d6',
        elementType: 'force',
        damageType: 'direct',
        criticalConfig: {
          critType: 'dice',
          critMultiplier: 2,
          critDiceOnly: false
        }
      },

      specialMechanics: {
        fortunePoints: {
          usage: 'Each FP spent treats one d6 as if it rolled 6 (max 7 dice)',
          example: 'Spend 5 FP: 5 of your 14d6 automatically count as 6. Roll the remaining 9d6 normally.',
          guarantee: 'At 7 FP spent, half your dice are guaranteed maximum. The most reliable spell in the Gambler arsenal.'
        }
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: {
          mana: 28
        },
        actionPoints: 1,
        components: ['verbal', 'somatic']
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 5
      },

      resolution: 'DICE',
      tags: ['damage', 'guaranteed', 'fortune point spending', 'universal']
    },

    // ADDITIONAL LEVEL 10 SPELL
    {
      id: 'gambler_divine_jackpot',
      name: 'Divine Jackpot',
      description: 'Flip a coin wreathed in divine fire. Heads: deal 20d6 force damage to all enemies — those below 50% HP are instantly defeated, others are stunned 2 rounds. Tails: take 20d6 force damage but survive at 1 HP with advantage on all rolls for 1 round.',
      level: 10,
      spellType: 'ACTION',
      effectTypes: ['damage'],

      typeConfig: {
        school: 'evocation',
        icon: 'Utility/Utility',
        tags: ['damage', 'coin flip', 'ultimate', 'jackpot', 'universal'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'sight',
        rangeDistance: 120,
        aoeShape: 'circle',
        aoeParameters: { radius: 60 },
        targetRestrictions: ['enemy']
      },

      damageConfig: {
        formula: '20d6',
        elementType: 'force',
        damageType: 'area',
        criticalConfig: {
          critType: 'effect',
          critEffects: ['divine_judgment', 'fortune_mercy']
        }
      },

      specialMechanics: {
        coinFlip: {
          heads: {
            effect: 'divine_judgment',
            description: 'Deal 20d6 force damage to all enemies in range. Enemies below 50% HP are instantly defeated. Enemies above 50% HP are stunned for 2 rounds.'
          },
          tails: {
            effect: 'fortune_mercy',
            description: 'Take 20d6 force damage. If this would reduce you to 0 HP, you survive at 1 HP instead and gain advantage on all rolls for 1 round as fortune spares you.'
          }
        },
        loreNote: 'Fortune is a cruel mistress. She either destroys your enemies, or she teaches you why you should have folded.'
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: {
          mana: 38
        },
        actionPoints: 3,
        components: ['verbal', 'somatic']
      },

      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },

      resolution: 'COIN_FLIP',
      tags: ['damage', 'coin flip', 'ultimate', 'jackpot', 'universal']
    }
  ]
};
