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

  // Overview section
  overview: {
    title: 'The Gambler',
    subtitle: 'Master of Fortune and Fate',

    quickOverview: {
      title: 'Quick Overview',
      content: `**What You Need to Know**: The Gambler generates Fortune Points by successfully casting spells or landing attacks. Spend Fortune Points to adjust roll results by ±1 each (similar to Chaos Weaver's Mayhem Modifiers, but for YOUR rolls). Three specializations use different mechanics: coin flips, dice rolls, and card draws. Spells include rollable tables with multiple outcomes (Jackpot: 3d20 slot machine with 20 outcomes, Fate's Coin: 6 coin flip options, High Roller: 3 d20-based bets, Death Roll: competitive 5d20 game).

**Core Mechanic**: Successful spell/attack → Generate Fortune Points → Spend to adjust YOUR roll results by ±1 per point

**Resource**: Fortune Points (0-20, generated from successful actions)

**Playstyle**: High-risk damage dealer, probability manipulation, rollable table specialist, luck-based utility

**Best For**: Players who enjoy gambling mechanics, adjusting roll results, and unpredictable high-variance gameplay`
    },

    description: `The Gambler is a daring risk-taker who manipulates luck and probability to gain an edge in combat. Embracing high-risk, high-reward strategies, Gamblers are known for their bold moves and their ability to turn the tide of battle with a well-placed bet. They thrive on chance and the thrill of unpredictability, using Fortune Points to influence outcomes and transform random chance into calculated advantage.`,
    
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

**Fortune Point Management**:
- **Low Fortune (0-3)**: Play conservatively, focus on building points, avoid high-risk abilities
- **Medium Fortune (4-8)**: Moderate risk-taking, can afford to adjust important rolls
- **High Fortune (9-15)**: Take big risks, use ultimate abilities, adjust multiple rolls
- **Maximum Fortune (16-20)**: Near-complete control, use highest-risk highest-reward abilities

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
      content: `**The Setup**: You're a Gambler (High Roller specialization) facing a powerful ogre champion and two goblin minions. Your party needs you to deal damage, but your spells are gambling-based—high risk, high reward. Starting Fortune Points: 3 (from previous encounter). Starting Mana: 40/50. Your goal: Build Fortune Points through successful actions, use them to adjust critical rolls, and unleash devastating gambling abilities.

**Starting State**: Fortune Points: 3/20 | Mana: 40/50 | HP: 60/70

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

**Current State**: FP: 4/20 | Mana: 35/50 | HP: 52/70

**Turn 2 - The Gamble (FP: 4 → 6)**

*You're at 4 Fortune Points. Time to use your signature spell: "Jackpot" - a 3d20 slot machine with 20 different outcomes. You roll 3d20 and match the results to a table. But the rolls are random. Unless...*

**Your Action**: Cast "Jackpot" on Ogre (8 mana, roll 3d20 and consult outcome table)
**3d20 Roll**: [12], [7], [19]

*Three magical slot machine reels appear above the ogre. They spin, then STOP. 12. 7. 19. You check the table...*

**Outcome Lookup**: 12-7-19 → "Moderate Win" → 4d10 damage + stun for 1 round

*Not bad, but not great. You have 4 Fortune Points. You could spend them to adjust the rolls. If you change [12] to [20], [7] to [20], and [19] to [20], you'd get triple 20s—the JACKPOT outcome (10d10 damage + paralysis). That would cost 3 Fortune Points (12→20 = 8 points... wait, that's too expensive).*

*Actually, let me check the table for better outcomes. If you change [7] to [20] (costs 13 Fortune Points—you don't have that many). Okay, different strategy. What if you adjust [12] to [15]? That's 3 Fortune Points. Let's see what 15-7-19 gives...*

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
**Current State**: FP: 4/20 | Mana: 27/50 | HP: 52/70 | Ogre: Stunned (2 rounds)

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

**Current State**: FP: 6/20 | Mana: 23/50 | HP: 52/70

**Turn 4 - The Ultimate Gamble (FP: 6 → 8)**

*The ogre shakes off the stun. It's wounded (104 damage taken total) but still alive. One goblin remains. You have 6 Fortune Points. Time for the ultimate gamble: "Death Roll."*

**Your Action**: Cast "Death Roll" on Ogre (10 mana, competitive 5d20 game)
**How It Works**: You and the target each roll 5d20. Highest total wins. Winner deals damage equal to the difference.

**Your Roll**: 5d20 → [18, 12, 15, 9, 14] = **68 total**
**Ogre's Roll**: 5d20 → [16, 11, 13, 10, 17] = **67 total**

*You're winning by 1. But that's not enough damage to kill the ogre. You have 6 Fortune Points. You could spend them to increase your total or decrease the ogre's total. Let's increase your [9] to [15] (costs 6 Fortune Points).*

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

**Final State**: FP: 2/20 (banked for next fight) | Mana: 13/50 | HP: 52/70

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

    description: `Fortune Points represent the Gambler's accumulated luck and their ability to influence fate. As they succeed in combat, they build Fortune Points, which they can then spend to adjust the outcomes of their gambles. This system allows Gamblers to embrace luck-based abilities while maintaining strategic control over critical moments.`,

    resourceBarExplanation: {
      title: 'Understanding Your Fortune Points Gauge',
      content: `**What You See**: Your Fortune Points gauge displays as a horizontal bar with 20 segments, each representing 1 Fortune Point. The bar is styled like a golden coin stack with glowing poker chips. As you accumulate Fortune Points, the segments fill with shimmering gold energy, representing your accumulated luck.

**Visual Representation by Fortune Point Level**:

**0-2 Fortune Points (Minimal Control)**:
- Bar: 0-2 segments filled with dim gold glow
- Border: Red (warning)
- Effect: Minimal visual effects, bar looks depleted
- Status: "Low Fortune - Build Points"
- Recommendation: "Focus on successful attacks/spells to build Fortune"
- Dice Icon: Grayed out (not enough to adjust rolls meaningfully)

**3-5 Fortune Points (Low Control)**:
- Bar: 3-5 segments filled, gold glow brightening
- Border: Orange (caution)
- Effect: Faint golden sparkles around bar
- Status: "Low Fortune"
- Recommendation: "Can adjust minor rolls, save for important moments"
- Dice Icon: Dim glow (can adjust rolls by ±3 to ±5)

**6-10 Fortune Points (Moderate Control)**:
- Bar: 6-10 segments filled, bright gold energy
- Border: Yellow (moderate)
- Effect: Golden coins appear to spin around the bar
- Status: "Moderate Fortune"
- Recommendation: "Comfortable using medium-risk abilities"
- Dice Icon: Glowing (can adjust rolls by ±6 to ±10)
- Ability Unlocks: Medium-risk abilities highlighted

**11-15 Fortune Points (High Control)**:
- Bar: 11-15 segments filled, intense golden glow
- Border: Green (good)
- Effect: Golden coins and poker chips swirl around bar, lucky symbols appear
- Status: "High Fortune - Strong Control"
- Recommendation: "Can afford multiple adjustments, safe to use high-risk abilities"
- Dice Icon: Brightly glowing with lucky aura
- Ability Unlocks: High-risk abilities highlighted

**16-20 Fortune Points (Maximum Control)**:
- Bar: 16-20 segments filled, maximum brightness
- Border: Blue (excellent)
- Effect: Bar overflows with golden energy, four-leaf clovers and lucky symbols orbit the bar
- Status: "MAXIMUM FORTUNE - Near-Complete Control"
- Recommendation: "Use ultimate abilities freely, adjust any roll"
- Dice Icon: Pulsing with maximum power
- Ability Unlocks: ALL abilities available, ultimate gambles recommended
- Special Text: "THE HOUSE ALWAYS WINS"

**Fortune Point Generation Animation**:
When you generate Fortune Points:
- **+1 FP (Successful Action)**: Single golden coin appears from your character, flies to bar, fills 1 segment with chime sound
- **+2 FP (Critical Success)**: Two golden coins appear, spin together, fly to bar with louder chime
- **+1 FP (Winning Gamble)**: Poker chip appears from spell effect, flies to bar with casino sound
- **Text Popup**: "+1 Fortune Point (Successful Spell)" or "+2 FP (Critical Hit!)"

**Fortune Point Spending Animation**:
When you spend Fortune Points to adjust a roll:
- **Spending Prompt**: After you roll, prompt appears: "Adjust roll? (You have 8 FP)"
- **Adjustment Interface**: Slider appears showing current roll (e.g., "14") with +/- buttons
- **Spending**: Click + to increase roll (costs 1 FP per +1), click - to decrease
- **Visual**: Each FP spent shows a golden coin flying from bar to the dice, dice number CHANGES
- **Confirmation**: "Spent 3 FP: 14 → 17" with golden flash
- **Audio**: Coin spending sound, dice re-rolling sound

**Roll Adjustment Interface** (appears after any roll):
- **Current Roll Display**: Large dice showing your roll (e.g., "14")
- **Fortune Point Counter**: "You have 8 Fortune Points"
- **Adjustment Slider**:
  * Left side: "-8" (decrease by 8) → "6"
  * Center: "0" (no change) → "14"
  * Right side: "+8" (increase by 8) → "22"
- **Cost Display**: "Spend 3 FP to change 14 → 17"
- **Confirm Button**: "Adjust Roll" (spends FP and changes result)
- **Cancel Button**: "Accept Roll" (no FP spent)

**Special Roll Indicators**:
- **Natural 20**: If you roll natural 20, bar flashes gold, "+2 FP (CRITICAL!)" appears
- **Near-Miss**: If you roll 18-19 (close to crit), tooltip suggests "Spend 1-2 FP for guaranteed crit?"
- **Critical Fail**: If you roll natural 1, tooltip suggests "Spend FP to avoid critical failure?"

**Gambling Ability Integration**:
When you cast gambling spells (Jackpot, Death Roll, Fate's Coin):
- **Pre-Roll**: Fortune Point bar pulses, showing available FP for adjustment
- **During Roll**: Dice/coins/cards appear with animation
- **Post-Roll**: Adjustment interface appears immediately
- **Example (Jackpot)**: Roll 3d20 → [12, 7, 19] → Prompt: "Spend FP to adjust? (3 FP to change 12→15)"

**Outcome Table Integration** (for Jackpot, etc.):
- **Table Display**: Shows all possible outcomes with your current roll highlighted
- **Adjustment Preview**: Hover over different outcomes to see FP cost to reach them
- **Example**:
  * Current: [12, 7, 19] = "Moderate Win" (4d10 damage)
  * Hover [15, 7, 19]: "Big Win (6d10 damage) - Cost: 3 FP"
  * Hover [20, 20, 20]: "JACKPOT (10d10 damage) - Cost: 21 FP (NOT ENOUGH)"

**Persistence Indicator**:
- **Between Combats**: Fortune Points bar shows "Banked: 8/20 FP - Persists until long rest"
- **Visual**: Bar has a "locked" icon indicating FP won't decay
- **Strategic Info**: "Fortune Points persist between combats - save for boss fights"

**Risk Level Warnings**:
When casting high-risk abilities with low Fortune Points:
- **Warning Popup**: "HIGH RISK ABILITY - Only 3 Fortune Points available"
- **Recommendation**: "Recommended: 7+ FP for safe adjustment"
- **Confirm**: "Cast Anyway" or "Cancel"

**Why This Matters**: The Fortune Points gauge isn't just a resource bar—it's your CONTROL PANEL for probability manipulation. When you roll a 14 and need a 17, you don't just accept it—you see the adjustment interface, slide the bar to +3, spend 3 Fortune Points, and watch the dice change from 14 to 17 with a golden flash. The visual feedback makes every adjustment feel powerful and intentional. When you're at 18 Fortune Points and the bar is overflowing with golden energy, you KNOW you have near-complete control over your rolls. And when you cast Jackpot and see the outcome table with FP costs to reach each outcome, you can make informed decisions: "I rolled Moderate Win, but for 3 FP I can get Big Win—worth it!" The gauge transforms randomness into strategy, showing you exactly how much control you have and what it costs to manipulate fate.`
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

**Maximum Capacity**: You can hold up to 20 Fortune Points at once. Any excess is lost.

**Persistence**: Fortune Points persist between combats until spent or until you complete a long rest.

**Using Fortune Points**:

Fortune Points can be spent to adjust the results of any roll you make. Each Fortune Point spent allows you to increase or decrease the result by 1.

- **Spend 1 Point**: Adjust any roll by ±1
- **Spend Multiple Points**: Each additional point adjusts by another ±1
- **No Limit Per Roll**: You can spend as many Fortune Points as you want on a single roll (up to your current total)
- **Declare Before Outcome**: You must decide how many points to spend and in which direction before the GM reveals the outcome

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
      headers: ['Point Count', 'Strategic Value', 'Recommended Usage'],
      rows: [
        ['0-2', 'Minimal Control', 'Focus on building points, avoid high-risk abilities'],
        ['3-5', 'Low Control', 'Can adjust minor rolls, save for important moments'],
        ['6-10', 'Moderate Control', 'Comfortable using medium-risk abilities, can guarantee some successes'],
        ['11-15', 'High Control', 'Can afford multiple adjustments, safe to use high-risk abilities'],
        ['16-20', 'Maximum Control', 'Near-complete control over outcomes, use ultimate abilities freely']
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

**Fortune Point Breakpoints**:
- **5 Points**: Can turn most near-misses into hits
- **10 Points**: Can guarantee critical hits (turn 10+ into 20)
- **15 Points**: Can adjust multiple important rolls in one encounter
- **20 Points**: Maximum control, can manipulate entire combat sequences

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
      content: `The Gambler is THE most immersive class to play in person because you use ACTUAL gambling implements—real coins, dice, and cards. This creates an authentic casino experience at your table. Here's how to bring the Gambler to life with physical materials:

**Required Materials**:
- **20 poker chips or tokens** (for Fortune Points tracking)
- **1 coin** (for coin flip abilities - a two-sided coin, preferably thematic)
- **Standard polyhedral dice set** (d4, d6, d8, d10, d12, d20)
- **Playing cards** (standard 52-card deck for Card Sharp specialization)
- **Tracking mat or play area** with Fortune Point zone

**Fortune Points Tracking**:

**The Poker Chip Method** (Highly Recommended):

Use actual poker chips to represent Fortune Points:
- **Starting State**: Begin with 0 chips in your Fortune Point pool
- **Generating Points**: When you successfully cast a spell or land an attack, take 1 chip from the bank and add it to your pool
- **Critical Success**: Take 2 chips instead of 1
- **Spending Points**: When adjusting a roll, remove chips from your pool equal to the adjustment (e.g., adjust by +3 = remove 3 chips)
- **Maximum**: 20 chips maximum in your pool

**Setup**:
Create two zones on your play mat:
- **Fortune Point Pool** (your active chips)
- **Bank** (unused chips, up to 20 total)

**Why Poker Chips Work Perfectly**: The tactile experience of earning chips when you succeed and spending them to adjust rolls creates the authentic feeling of gambling. You can SEE your fortune accumulate, FEEL the weight of spending 6 chips to guarantee a critical hit, and HEAR the satisfying clink of chips as you build your pool.

**Alternative Tracking Methods**:
- **d20 Die**: Set it to your current Fortune Point count (0-20)
- **Tally Marks**: Write on paper (less immersive but functional)
- **Colored Beads**: Use gold/yellow beads in a small bowl

**Coin Flip Abilities** (Fortune's Favor Specialization):

**The Real Coin Method**:

For abilities like "Fate's Coin" and "Coin Toss":
1. **Choose Your Effect**: Announce which of the 6 coin flip options you're choosing
2. **Flip the Coin**: Physically flip a real coin
3. **Call It**: "Heads" or "Tails" (or let the ability determine which side is favorable)
4. **Result**: If it lands on the favorable side, you get the effect; if not, you don't
5. **Fortune Point Adjustment**: If you don't like the result, spend 1 Fortune Point to flip the coin result (Heads becomes Tails, Tails becomes Heads)

**Recommended Coin**: Use a thematic coin—a gold coin, a lucky coin, or even a custom-made Gambler coin with symbols instead of heads/tails.

**Example In-Person Coin Flip**:
- You cast "Fate's Coin" and choose "Advantage on next attack"
- You flip your coin → Lands on Tails (unfavorable)
- You have 5 Fortune Points (chips)
- You decide to spend 1 chip to flip the result
- Remove 1 chip from your pool → Result becomes Heads (favorable)
- You gain advantage on your next attack!

**Dice Rolling Abilities** (High Roller Specialization):

**The Physical Dice Method**:

For abilities like "Jackpot" (3d20 slot machine) and "High Roller" (3 d20 bets):
1. **Roll the Dice**: Physically roll the required dice (e.g., 3d20 for Jackpot)
2. **Check the Result**: Compare to the outcome table
3. **Fortune Point Adjustment**: Spend Fortune Points to adjust individual dice by ±1 each
4. **Final Result**: Apply the adjusted outcome

**Example: Jackpot (3d20 Slot Machine)**:
- You cast "Jackpot" (costs 10 mana)
- Roll 3d20 physically → Results: [12, 15, 18]
- Check the table: No match, so it's a low-tier outcome
- You have 8 Fortune Points
- You spend 3 chips: +3 to the 12 → [15, 15, 18]
- Still no triple, but now you have a double (15-15)
- Check the table for double 15s outcome
- Remove 3 chips from your pool (now at 5 Fortune Points)

**Example: Death Roll (Competitive Minigame)**:
- You cast "Death Roll" on an enemy
- Both you and the GM roll d20s
- **Round 1**: You roll 15, Enemy rolls 12 → Max becomes 12
- **Round 2**: You roll 8, Enemy rolls 11 → Enemy loses (rolled over max)
- You win! Enemy takes damage and is stunned
- You gain 2 Fortune Points (winning gamble) → Add 2 chips to your pool

**Fortune Point Adjustment During Death Roll**:
- If you're at risk of losing, spend Fortune Points to adjust your rolls
- Example: You roll 13 (over max of 12) → Spend 1 chip to make it 12 (safe)
- Example: Enemy rolls 8 (safe) → Spend 2 chips to make it 10 (still safe but sets higher max for them)

**Card Drawing Abilities** (Card Sharp Specialization):

**The Playing Card Method**:

For Card Sharp abilities that involve card draws:
1. **Shuffle a Deck**: Use a standard 52-card deck
2. **Draw Cards**: Physically draw the required number of cards
3. **Resolve Effect**: Apply the effect based on card suit, number, or combination
4. **Fortune Point Adjustment**: Some abilities let you spend points to redraw or swap cards

**Example Card-Based Ability**:
- You cast "Deck of Fate" (hypothetical ability)
- Draw 3 cards from your shuffled deck → [7♠, K♥, 3♦]
- Effect depends on suits and values
- You have 6 Fortune Points
- Spend 2 chips to redraw the 3♦ → Draw again → [Q♣]
- New hand: [7♠, K♥, Q♣]
- Resolve the improved outcome

**Quick Reference Card Template**:
\`\`\`
GAMBLER FORTUNE POINTS TRACKER

Current Fortune Points: [Count your chips]
Maximum: 20 points

GENERATING POINTS:
• Successful attack/spell: +1 chip
• Critical success (nat 20): +2 chips
• Winning a gamble: +1 chip

SPENDING POINTS:
• Adjust any roll by ±1: 1 chip per ±1
• Flip coin result: 1 chip
• Reroll (Loaded Dice): 1 chip

PERSISTENCE:
• Fortune Points persist between combats
• Reset to 0 after long rest
\`\`\`

**Specialization-Specific Materials**:

**Fortune's Favor** (Coin Flip Specialist):
- **Primary Tool**: A special coin (gold coin, lucky coin, custom coin)
- **Backup**: Keep a second coin in case you lose the first
- **Thematic Touch**: Use a coin with meaningful symbols (e.g., sun/moon, fortune/misfortune)

**High Roller** (Dice Specialist):
- **Primary Tools**: Full polyhedral dice set (d4, d6, d8, d10, d12, d20)
- **Multiple d20s**: Keep 3-4 d20s for abilities like Jackpot (3d20) and Death Roll
- **Dice Tray**: Use a dice tray to keep rolls contained and visible

**Card Sharp** (Card Specialist):
- **Primary Tool**: Standard 52-card deck (poker-sized)
- **Card Sleeves**: Protect your cards with sleeves
- **Discard Pile**: Keep a separate area for discarded cards
- **Reshuffle**: Shuffle the deck between encounters or when it runs out

**Example Full In-Person Turn**:

*You have 4 poker chips in your Fortune Point pool*

**Your Turn**:
1. "I cast Lucky Strike at the ogre" (costs 5 mana)
2. Roll d20 for attack → [14] → Hit!
3. Add 1 chip to your pool (successful spell) → Now at 5 chips
4. Roll damage: 2d8 → [5, 6] = 11 damage
5. "Now I'll use Jackpot!" (costs 10 mana)
6. Roll 3d20 → [11, 14, 19]
7. "I want triple 19s for the jackpot. I'll spend 8 chips to adjust."
8. Spend 8 chips: +8 to the 11 → [19, 14, 19]
9. Spend 5 more chips... wait, I only have 5 chips left after spending 8
10. "Actually, I can't afford triple 19s. I'll keep [19, 14, 19] for a double 19 outcome."
11. Remove 8 chips from pool → Now at -3... wait, that's wrong
12. *Recalculate*: Started with 5 chips, can only spend 5 chips max
13. Spend 5 chips: +5 to the 14 → [11, 19, 19]
14. Remove 5 chips → Now at 0 chips
15. Check table for double 19s → Apply outcome
16. If it's a "Big Win" outcome, gain 2 chips → Now at 2 chips

**The Immersion Factor**:

Playing Gambler in person is uniquely satisfying because:
- **Tactile Feedback**: Physically flipping coins, rolling dice, and drawing cards creates visceral excitement
- **Visual Drama**: Everyone at the table can SEE your Fortune Point pool grow and shrink
- **Authentic Gambling**: You're not simulating gambling—you're ACTUALLY gambling with real implements
- **Tension**: The moment before a coin flip or dice roll is genuinely suspenseful
- **Celebration**: When you hit a jackpot or win a Death Roll, the physical evidence (chips, dice, cards) makes it feel real

**Pro Tips**:
- **Announce Clearly**: Always announce how many Fortune Points you're spending before adjusting rolls
- **Keep Chips Visible**: Your Fortune Point pool should be visible to the GM and party (transparency builds trust)
- **Thematic Flair**: Use casino-quality chips, weighted coins, and premium dice for maximum immersion
- **Sound Effects**: Some groups enjoy adding casino sound effects (slot machine jingles, coin clinks) when using abilities
- **Roleplay**: Physically flip the coin with a flourish, slam dice on the table dramatically, or shuffle cards like a dealer

**Budget-Friendly Alternatives**:
- **No poker chips?** Use pennies, buttons, or paper clips
- **No coin?** Use a d2 (or d6: 1-3 = Heads, 4-6 = Tails)
- **No playing cards?** Use a dice-based card simulation (d13 for value, d4 for suit)
- **Minimalist**: Just use a d20 to track Fortune Points and standard dice for abilities

**Why Gambler Is Perfect for In-Person Play**: Unlike classes with abstract resources (mana, rage), the Gambler's mechanics are DESIGNED around physical randomization tools. Every ability involves flipping, rolling, or drawing—actions that are MORE fun in person than digitally. The class becomes a mini-casino at your table, and you're the dealer, the player, and the house all at once.`
    }
  },

  // Specializations
  specializations: {
    title: 'Gambler Specializations',
    subtitle: 'Three Paths of Fortune',

    description: `Every Gambler chooses one of three specializations that define their approach to luck manipulation and risk-taking. Each specialization offers unique passive abilities and influences your gambling style and spell selection.`,

    // Shared passive for all Gambler specializations
    sharedPassive: {
      name: 'Loaded Dice',
      icon: 'inv_misc_dice_01',
      description: 'Choose a number between 2 and 19 at the start of each day. Whenever you roll that exact number on any die (for any purpose), you may spend 1 Fortune Point to reroll that die and use the new result. This effect applies to attack rolls, damage rolls, saving throws, and ability checks.',
      mechanicsNote: 'This passive gives Gamblers a way to turn unlucky rolls into second chances. Choose your number based on common roll targets (e.g., 10 for average rolls, 15 for important hits, 7 for lucky number superstition).'
    },

    specs: [
      {
        id: 'fortunes-favor',
        name: "Fortune's Favor",
        icon: 'inv_misc_coin_17',
        color: '#c9aa71',
        theme: 'Luck Manipulation',

        description: `Fortune's Favor Gamblers are masters of coin flips and probability manipulation. They specialize in bending luck to their will, granting rerolls, and influencing the outcomes of chance-based events. These Gamblers believe that fortune favors the bold—and they've learned to make fortune favor them specifically.`,

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
          icon: 'spell_holy_blessedrecovery',
          description: 'After successfully landing 3 attacks or spells in a row, your next coin flip ability automatically succeeds on the favorable outcome without needing to flip. This effect resets after use or after missing an attack/spell.',
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
        icon: 'inv_misc_gem_diamond_01',
        color: '#7a3b2e',
        theme: 'High Stakes Betting',

        description: `High Roller Gamblers embrace extreme risk for extreme reward. They bet their own health, mana, and resources on the outcomes of their gambles, capable of achieving devastating results—or catastrophic failures. These Gamblers live for the thrill of putting everything on the line and coming out on top.`,

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
          icon: 'ability_rogue_rollthebones',
          description: 'Whenever you successfully land a damaging ability, you may immediately spend 2 Fortune Points to "double down" and repeat the ability at half mana cost. If the second cast also succeeds, gain 3 Fortune Points. If it fails, lose 2 Fortune Points.',
          mechanicsNote: 'High-risk passive that can chain successes into devastating combos or turn wins into losses. Best used when you have Fortune Points to spare and can afford the mana cost.'
        },

        keyAbilities: [
          "All-In - Bet your current hit points. Roll a d100. 1-50: Double your current HP. 51-90: Heal to full health. 91-100: Drop to 0 HP. (10 mana, spend 10+ Fortune Points to guarantee heal to full)",
          "Double or Nothing - Make an attack roll. If it hits, it automatically becomes a critical hit dealing double damage. If it misses, you take the damage you would have dealt. (5 mana, spend Fortune Points to ensure hit)",
          "Betting Blitz - Bet up to half your max HP. If your next attack deals damage equal to or greater than double the bet amount, regain the health. Otherwise, lose the health bet. (5 mana, spend Fortune Points to increase damage)"
        ],

        recommendedFor: 'Players who love extreme risk/reward, enjoy dramatic moments, and don\'t mind occasional spectacular failures in pursuit of legendary victories.'
      },

      {
        id: 'card-sharp',
        name: 'Card Sharp',
        icon: 'inv_misc_platnumdisks',
        color: '#daa520',
        theme: 'Strategic Gambling',

        description: `Card Sharp Gamblers are strategic masterminds who treat combat like a high-stakes card game. They specialize in prediction, pattern recognition, and calculated risks. These Gamblers use their keen analytical minds to turn randomness into advantage through careful observation and strategic play.`,

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
          icon: 'inv_misc_book_11',
          description: 'You mentally track the "deck" of d20 results. After seeing 5 d20 rolls in combat (from any source), you gain advantage on predicting the next d20 result. This gives you advantage on abilities that require guessing or predicting rolls (Taunt the Odds, Evens and Odds, etc.).',
          mechanicsNote: 'Represents the Card Sharp\'s ability to read patterns and predict outcomes. Resets after each prediction or at the end of combat.'
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
        icon: 'spell_holy_blessedrecovery',
        spellType: 'ACTION',
        school: 'Luck Manipulation',
        level: 2,

        description: 'Roll 4d12 before making an attack. The matching dice determine your damage multiplier. Four matching dice deal quadruple damage, three matching deal triple, two matching deal double. All different numbers causes you to take damage equal to the lowest die.',

        typeConfig: {
          castTime: 1,
          castTimeType: 'IMMEDIATE',
          tags: ['damage', 'fortune-generation', 'variable', 'gambler']
        },

        targetingConfig: {
          targetingType: 'single',
          rangeType: 'ranged',
          rangeDistance: 50,
          targetRestrictions: ['enemy']
        },

        resourceCost: {
          resourceTypes: ['mana'],
          resourceValues: { mana: 3 },
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

        tags: ['damage', 'fortune-generation', 'variable', 'gambler']
      },

      {
        id: 'fates-coin',
        name: "Fate's Coin",
        icon: 'inv_misc_coin_17',
        spellType: 'ACTION',
        school: 'Luck Manipulation',
        level: 3,

        description: 'Flip a magical coin and choose one of six effects. Heads grants a powerful benefit, tails gives a lesser benefit or minor drawback. Spend 1 Fortune Point to flip the result.',

        typeConfig: {
          castTime: 1,
          castTimeType: 'IMMEDIATE',
          tags: ['buff', 'utility', 'fortune-cost', 'gambler']
        },

        targetingConfig: {
          targetingType: 'single',
          rangeType: 'ranged',
          rangeDistance: 30,
          targetRestrictions: ['ally', 'self']
        },

        resourceCost: {
          resourceTypes: ['mana'],
          resourceValues: { mana: 5 },
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
            description: 'Choose one of six coin effects before flipping. Heads grants a powerful benefit, tails gives a lesser benefit or minor drawback.'
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

        tags: ['utility', 'buff', 'debuff', 'coin-flip', 'gambler', 'fortunes-favor']
      },

      {
        id: 'jackpot',
        name: 'Jackpot',
        icon: 'inv_misc_platnumdisks',
        spellType: 'ACTION',
        school: 'Strategic Gambling',
        level: 8,

        description: 'Roll 3d20 slot machine. Triple numbers grant powerful rewards. Each combination can only occur once per long rest. Spend Fortune Points to adjust individual dice.',

        typeConfig: {
          castTime: 1,
          castTimeType: 'IMMEDIATE',
          tags: ['ultimate', 'random', 'high-risk', 'high-reward', 'gambler']
        },

        targetingConfig: {
          targetingType: 'self',
          rangeType: 'self'
        },

        resourceCost: {
          resourceTypes: ['mana'],
          resourceValues: { mana: 8 },
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
            { range: '12-12-12', result: 'Storm: 4d10 lightning + 4d10 thunder to all enemies in 40ft', description: 'AOE devastation' },
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

        tags: ['ultimate', 'random', 'high-risk', 'high-reward', 'gambler', 'card-sharp']
      },

      
      {
        id: 'all-in',
        name: 'All-In',
        icon: 'ability_rogue_rollthebones',
        spellType: 'ACTION',
        school: 'High Stakes Betting',
        level: 10,

        description: 'Bet your current HP on d100 roll. 1-50: Double HP. 51-90: Full heal. 91-100: Drop to 0 HP. WARNING: Can instantly kill you. Requires 10+ Fortune Points for safety.',

        typeConfig: {
          castTime: 1,
          castTimeType: 'IMMEDIATE',
          tags: ['ultimate', 'life-or-death', 'extreme-risk', 'healing', 'gambler']
        },

        targetingConfig: {
          targetingType: 'self',
          rangeType: 'self'
        },

        resourceCost: {
          resourceTypes: ['mana'],
          resourceValues: { mana: 10 },
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
          description: 'Roll the dice of fate. The result could be miraculous healing, devastating loss, or anything in between. Fortune favors the bold, but also punishes the reckless.'
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
            recommendation: '10-15 points minimum',
            usage: 'With 10 points, turn any 41+ into safe zone (51-90). With 40 points, can manipulate any result.'
          },
          lifeOrDeath: {
            warning: 'Can instantly kill you',
            safeZone: '51-90',
            deathZone: '91-100'
          }
        },

        rollableTable: {
          enabled: true,
          name: 'All-In Results',
          description: 'Roll 1d100 - your life is on the line',
          resolutionType: 'DICE',
          resolutionConfig: { diceType: '1d100' },
          entries: [
            { range: { min: 1, max: 50 }, result: 'Double your current hit points', description: 'Moderate success' },
            { range: { min: 51, max: 90 }, result: 'Heal to full health', description: 'Optimal result - aim for this' },
            { range: { min: 91, max: 100 }, result: 'Drop to 0 hit points', description: 'DEATH - avoid at all costs' }
          ]
        },

        tags: ['ultimate', 'life-or-death', 'extreme-risk', 'healing', 'gambler', 'high-roller']
      },

      {
        id: 'death-roll',
        name: 'Death Roll',
        icon: 'spell_shadow_demonicempathy',
        spellType: 'ACTION',
        school: 'Strategic Gambling',
        level: 7,

        description: 'Challenge creature to Death Roll minigame. Both roll d20s with decreasing maximums until someone loses. Loser takes psychic damage (winner chooses) and is stunned. Unwilling targets make Spirit save.',

        typeConfig: {
          castTime: 1,
          castTimeType: 'IMMEDIATE',
          tags: ['minigame', 'damage', 'control', 'psychic', 'gambler']
        },

        targetingConfig: {
          targetingType: 'single',
          rangeType: 'ranged',
          rangeDistance: 15,
          targetRestrictions: ['enemy']
        },

        resourceCost: {
          resourceTypes: ['mana'],
          resourceValues: { mana: 8 },
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
              durationType: 'temporary',
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

        tags: ['competitive', 'minigame', 'psychic', 'control', 'gambler', 'card-sharp']
      },

      {
        id: 'double-or-nothing',
        name: 'Double or Nothing',
        icon: 'ability_warrior_intensifyrage',
        spellType: 'ACTION',
        school: 'High Stakes Betting',
        level: 4,

        description: 'Make an attack roll. On hit: automatic critical hit with double damage. On miss: you take the damage instead. Spend 5-10 Fortune Points to guarantee hit.',

        typeConfig: {
          castTime: 1,
          castTimeType: 'IMMEDIATE'
        },

        targetingConfig: {
          targetingType: 'single',
          rangeType: 'weapon_or_spell_range'
        },

        durationConfig: {
          durationType: 'instant'
        },

        resourceCost: {
          mana: 5,
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

        tags: ['damage', 'critical-hit', 'self-damage-risk', 'gambler', 'high-roller']
      },

      {
        id: 'taunt-the-odds',
        name: 'Taunt the Odds',
        icon: 'spell_holy_righteousfury',
        spellType: 'ACTION',
        school: 'Strategic Gambling',
        level: 3,

        description: 'Guess a number 1-20, then roll d20. Guess within 3: target takes 3d10 damage. Off by 4+: you take 1d10 damage. Spend Fortune Points to adjust roll toward guess.',

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
          mana: 4,
          components: ['verbal', 'somatic'],
          verbalText: 'Provoco Fortunam!',
          somaticText: 'Point at target and call out number'
        },

        resolution: 'DICE',

        damageConfig: {
          formula: '3d10',
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
            cardCounting: 'Card Sharp passive gives advantage on guess'
          }
        },

        tags: ['damage', 'prediction', 'skill-based', 'gambler', 'card-sharp']
      },

      {
        id: 'coin-toss',
        name: 'Coin Toss',
        icon: 'inv_misc_coin_01',
        spellType: 'ACTION',
        school: 'Luck Manipulation',
        level: 2,

        description: 'Flip a coin. Heads: gain bonus to all rolls. Tails: take penalty to all rolls. Spend Fortune Points to flip the result.',

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
          mana: 3,
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

        tags: ['buff', 'debuff', 'coin-flip', 'duration', 'gambler']
      },

      {
        id: 'gamblers-insight',
        name: "Gambler's Insight",
        icon: 'spell_holy_sealofwisdom',
        spellType: 'ACTION',
        school: 'Utility',
        level: 2,

        description: 'Gain advantage on Insight and Perception checks against one creature for 10 minutes. Detect lies, read intentions, notice body language, predict moves.',

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
          duration: 10,
          durationUnit: 'minute'
        },

        resourceCost: {
          mana: 3,
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
        icon: 'inv_misc_coin_02',
        spellType: 'ACTION',
        school: 'Illusion',
        level: 2,

        description: 'Create illusory gold/treasure (up to 100gp value) that looks real but vanishes when touched. Lasts 1 hour. Perfect for bribes, distractions, escapes, cons, and traps.',

        typeConfig: {
          castTime: 1,
          castTimeType: 'IMMEDIATE'
        },

        targetingConfig: {
          targetingType: 'point',
          rangeType: 'touch'
        },

        durationConfig: {
          durationType: 'timed_or_until_touched',
          duration: 1,
          durationUnit: 'hour'
        },

        resourceCost: {
          mana: 3,
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
      icon: 'inv_misc_coin_01',

      typeConfig: {
        school: 'evocation',
        icon: 'inv_misc_coin_01',
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
        resourceValues: { mana: 2 },
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
          description: '+1 to your next roll'
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

      tags: ['damage', 'buff', 'coin-flip', 'level-1', 'gambler']
    },

    {
      id: 'gambler_beginners_luck',
      name: "Beginner's Luck",
      description: 'Channel the power of fortune to grant yourself advantage on your next ability check or attack roll.',
      level: 1,
      spellType: 'ACTION',
      icon: 'inv_misc_dice_01',

      typeConfig: {
        school: 'divination',
        icon: 'inv_misc_dice_01',
        castTime: 1,
        castTimeType: 'BONUS'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 1 },
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
          description: 'Gain advantage on your next ability check or attack roll'
        }],
        durationValue: 1,
        durationType: 'uses',
        durationUnit: 'uses'
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 2
      },

      tags: ['buff', 'luck', 'level-1', 'gambler']
    },

    {
      id: 'gambler_dice_dart',
      name: 'Dice Dart',
      description: 'Throw a magically enchanted die that deals damage based on the roll.',
      level: 1,
      spellType: 'ACTION',
      icon: 'inv_misc_dice_02',

      typeConfig: {
        school: 'evocation',
        icon: 'inv_misc_dice_02',
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
        resourceValues: { mana: 2 },
        actionPoints: 1,
        components: ['somatic'],
        somaticText: 'Throw enchanted die'
      },

      resolution: 'DICE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '2d6',
        elementType: 'force',
        damageType: 'direct'
      },

      tags: ['damage', 'ranged', 'level-1', 'gambler']
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
      icon: 'spell_fire_immolation',

      typeConfig: {
        school: 'enchantment',
        icon: 'spell_fire_immolation',
        castTime: 1,
        castTimeType: 'BONUS'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 15 },
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
          description: 'Each hit this turn grants +1d6 damage on your next attack, stacking up to 4 times.'
        }],
        durationValue: 1,
        durationType: 'rounds',
        durationUnit: 'rounds'
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 4
      },

      tags: ['buff', 'damage', 'level-5', 'gambler']
    },

    {
      id: 'gambler_double_or_nothing',
      name: 'Double or Nothing',
      description: 'Gamble big! Double your next spell or attack damage on heads, or deal nothing on tails.',
      level: 5,
      spellType: 'REACTION',
      icon: 'inv_misc_coin_05',

      typeConfig: {
        school: 'enchantment',
        icon: 'inv_misc_coin_05',
        castTime: 1,
        castTimeType: 'REACTION'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 12 },
        actionPoints: 0,
        components: ['verbal'],
        verbalText: 'Double or nothing!'
      },

      resolution: 'COIN_FLIP',
      effectTypes: ['buff'],

      buffConfig: {
        buffType: 'damage_modifier',
        effects: [{
          id: 'double_damage',
          name: 'Double Damage',
          description: 'On heads: double damage. On tails: zero damage.'
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

      tags: ['buff', 'coin-flip', 'high-risk', 'level-5', 'gambler']
    },

    {
      id: 'gambler_loaded_dice',
      name: 'Loaded Dice',
      description: 'Subtly manipulate the odds. Reroll any dice you roll this turn and take the better result.',
      level: 5,
      spellType: 'ACTION',
      icon: 'inv_misc_dice_02',

      typeConfig: {
        school: 'divination',
        icon: 'inv_misc_dice_02',
        castTime: 1,
        castTimeType: 'BONUS'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 14 },
        actionPoints: 0,
        components: ['somatic'],
        somaticText: 'Sleight of hand'
      },

      resolution: 'NONE',
      effectTypes: ['buff'],

      buffConfig: {
        buffType: 'reroll',
        effects: [{
          id: 'loaded_dice',
          name: 'Loaded Dice',
          description: 'Reroll any dice this turn and take the better result.'
        }],
        durationValue: 1,
        durationType: 'rounds',
        durationUnit: 'rounds'
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 4
      },

      tags: ['buff', 'reroll', 'level-5', 'gambler']
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
      icon: 'spell_shadow_mindtwisting',

      typeConfig: {
        school: 'enchantment',
        icon: 'spell_shadow_mindtwisting',
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
        resourceValues: { mana: 22 },
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
          description: 'Enemies have disadvantage on attack rolls and saving throws.'
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
          description: 'You have advantage on all rolls for the duration.'
        }],
        durationValue: 3,
        durationType: 'rounds',
        durationUnit: 'rounds'
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 5
      },

      tags: ['debuff', 'buff', 'luck', 'level-6', 'gambler']
    },

    {
      id: 'gambler_card_shark',
      name: 'Card Shark',
      description: 'Draw from your magical deck to unleash one of four powerful effects based on the suit.',
      level: 6,
      spellType: 'ACTION',
      icon: 'inv_misc_ticket_tarot_madness',

      typeConfig: {
        school: 'evocation',
        icon: 'inv_misc_ticket_tarot_madness',
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
        resourceValues: { mana: 20 },
        actionPoints: 1,
        components: ['somatic'],
        somaticText: 'Draw a card'
      },

      resolution: 'DICE',
      effectTypes: ['variable'],

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

      tags: ['damage', 'healing', 'control', 'variable', 'level-6', 'gambler']
    },

    {
      id: 'gambler_poker_face',
      name: 'Poker Face',
      description: 'Project an aura of unreadability, becoming immune to charm, fear, and mind-reading effects.',
      level: 6,
      spellType: 'ACTION',
      icon: 'spell_shadow_unholyfrenzy',

      typeConfig: {
        school: 'abjuration',
        icon: 'spell_shadow_unholyfrenzy',
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
        somaticText: 'Assume poker face'
      },

      resolution: 'NONE',
      effectTypes: ['buff'],

      buffConfig: {
        buffType: 'immunity',
        effects: [{
          id: 'poker_face',
          name: 'Poker Face',
          description: 'Immune to charm, fear, and mind-reading effects.'
        }],
        durationValue: 5,
        durationType: 'rounds',
        durationUnit: 'rounds'
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 4
      },

      tags: ['buff', 'immunity', 'mental', 'level-6', 'gambler']
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
      icon: 'inv_misc_dice_01',

      typeConfig: {
        school: 'evocation',
        icon: 'inv_misc_dice_01',
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
        resourceValues: { mana: 50 },
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'High stakes!',
        somaticText: 'Roll the divine die'
      },

      resolution: 'DICE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '15d10 + charisma * 2',
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

      tags: ['damage', 'high-risk', 'high-reward', 'level-9', 'gambler']
    },

    {
      id: 'gambler_jackpot_surge',
      name: 'Jackpot Surge',
      description: 'Hit the ultimate jackpot! Roll multiple dice and if any match, multiply your damage exponentially.',
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
        rangeDistance: 60,
        aoeShape: 'circle',
        aoeParameters: { radius: 25 },
        targetRestrictions: ['enemy']
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 55 },
        actionPoints: 3,
        components: ['verbal', 'somatic'],
        verbalText: 'JACKPOT!',
        somaticText: 'Pull the lever'
      },

      resolution: 'DICE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '8d8 + charisma',
        elementType: 'radiant',
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

      tags: ['damage', 'aoe', 'high-reward', 'level-9', 'gambler']
    },

    {
      id: 'gambler_fortune_reversal',
      name: 'Fortune Reversal',
      description: 'Reverse the fortunes of battle. Swap your current HP percentage with a target enemy.',
      level: 9,
      spellType: 'ACTION',
      icon: 'spell_holy_reverseentropy',

      typeConfig: {
        school: 'transmutation',
        icon: 'spell_holy_reverseentropy',
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
        resourceValues: { mana: 60 },
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

      tags: ['utility', 'coin-flip', 'high-risk', 'level-9', 'gambler']
    },

    // ADDITIONAL LEVEL 3 SPELLS
    {
      id: 'gambler_lucky_shot',
      name: 'Lucky Shot',
      description: 'Take a lucky shot that deals damage based on a coin flip.',
      level: 3,
      spellType: 'ACTION',
      effectTypes: ['damage'],

      typeConfig: {
        school: 'evocation',
        icon: 'inv_misc_coin_01',
        tags: ['damage', 'coin-flip', 'universal'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 40,
        targetRestrictions: ['enemy'],
        maxTargets: 1
      },

      damageConfig: {
        formula: '4d8',
        elementType: 'force',
        damageType: 'direct'
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: {
          mana: 18
        },
        actionPoints: 1,
        components: ['verbal', 'somatic']
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 2
      },

      resolution: 'COIN_FLIP',
      tags: ['damage', 'coin-flip', 'universal']
    },

    {
      id: 'gambler_risky_maneuver',
      name: 'Risky Maneuver',
      description: 'Attempt a risky maneuver - on heads gain enhanced stats, on tails take damage.',
      level: 3,
      spellType: 'ACTION',
      effectTypes: ['buff'],

      typeConfig: {
        school: 'enhancement',
        icon: 'inv_misc_dice_02',
        tags: ['buff', 'coin-flip', 'risky', 'universal'],
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
          id: 'risky_maneuver',
          name: 'Risky Maneuver',
          description: 'Gain +4 to all stats for 3 rounds (on heads)',
          statModifier: {
            stat: 'all_stats',
            magnitude: 4,
            magnitudeType: 'flat'
          }
        }],
        durationValue: 3,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: false,
        canBeDispelled: true
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: {
          mana: 18
        },
        actionPoints: 1
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 3
      },

      resolution: 'COIN_FLIP',
      tags: ['buff', 'coin-flip', 'risky', 'universal']
    },

    {
      id: 'gambler_double_down',
      name: 'Double Down',
      description: 'Double down on your luck - on heads deal damage, on tails take damage.',
      level: 3,
      spellType: 'ACTION',
      effectTypes: ['damage'],

      typeConfig: {
        school: 'evocation',
        icon: 'inv_misc_coin_02',
        tags: ['damage', 'coin-flip', 'high-risk', 'universal'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 40,
        targetRestrictions: ['enemy'],
        maxTargets: 1
      },

      damageConfig: {
        formula: '5d10',
        elementType: 'force',
        damageType: 'direct'
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: {
          mana: 20
        },
        actionPoints: 1,
        components: ['verbal', 'somatic']
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 3
      },

      resolution: 'COIN_FLIP',
      tags: ['damage', 'coin-flip', 'high-risk', 'universal']
    },

    // ADDITIONAL LEVEL 4 SPELLS
    {
      id: 'gambler_fortune_favors',
      name: 'Fortune Favors',
      description: 'Call on fortune to favor you - on heads gain advantage on all rolls for 4 rounds, on tails gain disadvantage.',
      level: 4,
      spellType: 'ACTION',
      effectTypes: ['buff'],

      typeConfig: {
        school: 'divination',
        icon: 'spell_holy_divineprovidence',
        tags: ['buff', 'coin-flip', 'fortune', 'universal'],
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
          id: 'fortune_favors',
          name: 'Fortune Favors',
          description: 'Gain advantage on all rolls for 4 rounds (on heads)',
          statModifier: {
            stat: 'all_rolls',
            magnitude: 1,
            magnitudeType: 'advantage'
          }
        }],
        durationValue: 4,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: false,
        canBeDispelled: true
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: {
          mana: 22
        },
        actionPoints: 1
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 4
      },

      resolution: 'COIN_FLIP',
      tags: ['buff', 'coin-flip', 'fortune', 'universal']
    },

    {
      id: 'gambler_jackpot_strike',
      name: 'Jackpot Strike',
      description: 'Strike for the jackpot - on heads deal critical damage, on tails deal normal damage.',
      level: 4,
      spellType: 'ACTION',
      effectTypes: ['damage'],

      typeConfig: {
        school: 'evocation',
        icon: 'inv_misc_coin_01',
        tags: ['damage', 'coin-flip', 'jackpot', 'universal'],
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
        formula: '6d12',
        elementType: 'force',
        damageType: 'direct',
        criticalConfig: {
          enabled: true,
          critMultiplier: 2,
          critDiceOnly: false
        }
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: {
          mana: 24
        },
        actionPoints: 1,
        components: ['verbal', 'somatic']
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 3
      },

      resolution: 'COIN_FLIP',
      tags: ['damage', 'coin-flip', 'jackpot', 'universal']
    },

    // ADDITIONAL LEVEL 7 SPELL
    {
      id: 'gambler_all_in',
      name: 'All In',
      description: 'Go all in - on heads deal damage to all enemies, on tails take damage yourself.',
      level: 7,
      spellType: 'ACTION',
      effectTypes: ['damage'],

      typeConfig: {
        school: 'evocation',
        icon: 'inv_misc_coin_02',
        tags: ['damage', 'aoe', 'coin-flip', 'ultimate', 'universal'],
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
        formula: '10d10',
        elementType: 'force',
        damageType: 'area',
        criticalConfig: {
          critType: 'effect',
          critEffects: ['all_in_stun']
        }
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: {
          mana: 45
        },
        actionPoints: 2,
        components: ['verbal', 'somatic']
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 8
      },

      resolution: 'COIN_FLIP',
      tags: ['damage', 'aoe', 'coin-flip', 'ultimate', 'universal']
    },

    // ADDITIONAL LEVEL 8 SPELL
    {
      id: 'gambler_loaded_dice',
      name: 'Loaded Dice',
      description: 'Use loaded dice to guarantee success - automatically deal damage with no gamble.',
      level: 8,
      spellType: 'ACTION',
      effectTypes: ['damage'],

      typeConfig: {
        school: 'evocation',
        icon: 'inv_misc_dice_01',
        tags: ['damage', 'guaranteed', 'universal'],
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
        formula: '8d10',
        elementType: 'force',
        damageType: 'direct',
        criticalConfig: {
          critType: 'dice',
          critMultiplier: 2,
          critDiceOnly: false
        }
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: {
          mana: 50
        },
        actionPoints: 1,
        components: ['verbal', 'somatic']
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 5
      },

      resolution: 'DICE',
      tags: ['damage', 'guaranteed', 'universal']
    },

    // ADDITIONAL LEVEL 10 SPELL
    {
      id: 'gambler_divine_jackpot',
      name: 'Divine Jackpot',
      description: 'Hit the divine jackpot - on heads instantly win the encounter, on tails take 20d12 force damage.',
      level: 10,
      spellType: 'ACTION',
      effectTypes: ['damage'],

      typeConfig: {
        school: 'evocation',
        icon: 'inv_misc_coin_01',
        tags: ['damage', 'coin-flip', 'ultimate', 'jackpot', 'universal'],
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
        formula: '20d12',
        elementType: 'force',
        damageType: 'area',
        criticalConfig: {
          critType: 'effect',
          critEffects: ['divine_victory', 'instant_win']
        }
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: {
          mana: 100
        },
        actionPoints: 3,
        components: ['verbal', 'somatic']
      },

      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },

      resolution: 'COIN_FLIP',
      tags: ['damage', 'coin-flip', 'ultimate', 'jackpot', 'universal']
    }
  ]
};
