/**
 * Bladedancer Class Data
 * 
 * Complete class information for the Bladedancer - a martial artist who flows
 * between combat stances, building Momentum and earning Flourish through mastery.
 */

export const BLADEDANCER_DATA = {
  id: 'bladedancer',
  name: 'Bladedancer',
  icon: 'fas fa-wind',
  role: 'Damage',

  // Overview section
  overview: {
    title: 'The Bladedancer',
    subtitle: 'Master of Combat Stances',

    quickOverview: {
      title: 'Quick Overview',
      content: `**What You Need to Know**: The Bladedancer flows between 6 interconnected combat stances (Flowing Water, Striking Serpent, Whirling Wind, Rooted Stone, Dancing Blade, Shadow Step), each offering unique abilities and passive effects. You build Momentum through attacks and spend it to transition between stances and activate abilities. Performing signature moves in each stance earns Flourish tokens for ultimate abilities.

**Core Mechanic**: Attack → Build Momentum → Transition between stances → Adapt to combat → Earn Flourish → Unleash ultimates

**Resources**: Momentum (0-20, builds/decays during combat) & Flourish (persistent mastery tokens)

**Playstyle**: Adaptive melee combatant, stance-based tactics, high mobility, rewards skillful transitions

**Best For**: Players who enjoy tactical positioning, adaptive combat, and mastering complex interconnected systems`
    },

    description: `The Bladedancer is a martial artist who flows seamlessly between combat stances, adapting to any situation with grace and precision. Through the Momentum & Flourish system, they build combat rhythm and earn mastery tokens, unlocking devastating abilities as they dance through battle.`,
    
    roleplayIdentity: {
      title: 'Roleplay Identity',
      content: `Bladedancers are martial artists who have dedicated their lives to perfecting the art of combat through fluid movement and stance mastery. They view fighting as a dance—a flowing sequence of movements where each stance leads naturally into the next. Their philosophy emphasizes adaptability, grace under pressure, and the pursuit of martial perfection.

Unlike rigid martial traditions that focus on a single style, Bladedancers study multiple fighting forms and learn to transition seamlessly between them. They understand that true mastery comes not from perfecting one stance, but from knowing when and how to flow between many.

In roleplay, Bladedancers often embody:
- **The Wandering Duelist**: Traveling the world to test their skills against worthy opponents
- **The Monastery Exile**: Cast out for refusing to limit themselves to a single fighting style
- **The Dance Warrior**: Trained in both combat and performance arts, blending the two seamlessly
- **The Adaptive Survivor**: Learned to flow between styles out of necessity in brutal conflicts
- **The Style Collector**: Seeks out masters of different fighting forms to add to their repertoire

Bladedancers carry themselves with fluid grace even outside of combat. They move with purpose and economy of motion, and many practice their stance transitions as meditation. Some mark their mastery of each stance with tattoos, scars, or ritual symbols.

**Philosophy**: "Combat is a dance. Every stance is a step. Every strike is a note. Master the rhythm, and victory flows like water."`
    },
    
    combatRole: {
      title: 'Combat Role',
      content: `The Bladedancer is a versatile melee damage dealer who excels at:

**Adaptive Combat**: Switch between offensive, defensive, and utility stances to match the situation
**High Mobility**: Natural speed bonuses and stance-based movement abilities
**Sustained Damage**: Build Momentum through consistent attacks and spend it on powerful abilities
**Tactical Flexibility**: Each stance offers different passive effects and active abilities
**Mastery Rewards**: Earn Flourish tokens through signature moves for ultimate abilities

**Strengths**:
- Exceptional adaptability through 6 different combat stances
- High sustained damage output with Momentum scaling
- Strong mobility and repositioning capabilities
- Versatile toolkit covering offense, defense, and utility
- Rewards skillful play and stance management

**Weaknesses**:
- Requires understanding of stance network and transition paths
- Must build Momentum from 0 at start of each combat
- Stance transitions cost Momentum, limiting ability usage
- Less effective when unable to attack and build Momentum
- Complexity requires planning and tactical awareness

The Bladedancer shines in dynamic combats where they can build Momentum through consistent attacks and adapt their stance to counter enemy tactics.`
    },
    
    playstyle: {
      title: 'Playstyle & Strategy',
      content: `Playing a Bladedancer is about reading the flow of combat and adapting your stance to match the situation. Key strategic considerations:

**Stance Network Navigation**:
- **Flowing Water** (Start): Defensive/evasive, transitions to Striking Serpent, Shadow Step, or Dancing Blade
- **Striking Serpent**: Offensive/precision, transitions to Whirling Wind, Rooted Stone, or Flowing Water
- **Whirling Wind**: AoE/multi-target, transitions to Dancing Blade or Rooted Stone
- **Rooted Stone**: Defensive/counter, transitions to Striking Serpent or Flowing Water
- **Dancing Blade** (Hub): Balanced/versatile, can transition to ANY stance (costs 4 Momentum)
- **Shadow Step**: Stealth/burst, transitions to Striking Serpent or Dancing Blade

**Momentum Management**:
- Build: +1 per hit, +2 per crit, +1 per dodge/parry
- Decay: -1 per miss or taking damage
- Spend: 2-4 for stance changes, 3-6 for abilities
- Strategy: Maintain 6+ Momentum for tactical flexibility

**Flourish Economy**:
- Earn 1 token per stance signature move
- Persist between combats (no decay)
- Spend 2-5 on ultimate abilities
- Strategy: Master all stances to maximize Flourish generation

**Specialization Synergies**:
- **Flow Master**: Rapid transitions (-1 Momentum cost), combo chains, flow-focused
- **Duelist**: Precision strikes, counter-attacks, defensive mastery
- **Shadow Dancer**: Stealth, burst damage, Shadow Step specialization

**Combat Flow**:
- **Opening**: Start in Flowing Water, build Momentum with safe attacks
- **Mid-Combat**: Transition to offensive stances (Striking Serpent, Whirling Wind) when Momentum is high
- **Defensive**: Fall back to Rooted Stone or Flowing Water when under pressure
- **Finishing**: Use Dancing Blade as hub to reach any stance, spend Flourish on ultimates

**Team Dynamics**:
- Works well with tanks who can protect while building Momentum
- Synergizes with supports who provide attack speed or damage buffs
- Benefits from crowd control that allows safe Momentum building
- Can adapt stance to fill gaps in team composition (tank, DPS, or utility)`
    },

    immersiveCombatExample: {
      title: 'Combat Example: The Duel at Crimson Bridge',
      content: `**The Setup**: You face a rival duelist on a narrow bridge. He's a brute—all power, no finesse. You'll show him what true mastery looks like.

**Starting State**: Stance: Flowing Water | Momentum: 0 | Flourish: 3 tokens

**Turn 1 - Reading the Opponent (Momentum: 0 → 3)**

*You settle into Flowing Water stance—feet shoulder-width apart, blade held loosely, body relaxed. Your opponent charges.*

Enemy attacks → You dodge (Flowing Water passive: +2 dodge) → Counterattack hits!
**Momentum**: +1 (now at 1)

Second attack → Hit!
**Momentum**: +1 (now at 2)

Flowing Water signature move - "Rippling Deflection"
**Momentum**: +1 (now at 3)
**Flourish**: +1 token (now at 4) - earned for signature move!

*You flow around his attacks like water around stone. The rhythm builds.*

**Turn 2 - Shifting to Offense (Stance: Flowing Water → Striking Serpent)**

*Time to punish his recklessness.*

**Transition**: Flowing Water → Striking Serpent (costs 2 Momentum)
**Momentum**: 3 - 2 = 1

*Your stance narrows, blade extending like a serpent's fang.*

Attack → CRITICAL HIT!
**Momentum**: +2 (now at 3)

Striking Serpent signature - "Viper's Fang" (costs 3 Momentum)
**Momentum**: 3 - 3 = 0, then +2 for signature = 2
**Flourish**: +1 (now at 5)
**Effect**: Target bleeds, -2 to attacks

*Your blade finds the gap in his armor. He roars in pain.*

Enemy power attack → Hits you!
**Momentum**: -1 for taking damage (now at 1)

**Turn 3 - Defensive Adaptation (Stance: Striking Serpent → Rooted Stone)**

*He's wounded but dangerous. Weather his fury.*

**Transition**: Striking Serpent → Rooted Stone (costs 2 Momentum)
**Momentum**: 1 - 2 = -1... NOT ENOUGH!

*You don't have enough Momentum to transition. You need to build more first.*

Attack → Hit!
**Momentum**: +1 (now at 2)

**Now transition**: Rooted Stone (costs 2 Momentum)
**Momentum**: 2 - 2 = 0

*You plant your feet. Like a mountain, unmovable.*

Enemy combo (3 strikes) → First hits (reduced), second you parry!
**Momentum**: +1 for parry (now at 1)
Counter attack from parry → Hit!
**Momentum**: +1 (now at 2)

Rooted Stone signature - "Immovable Mountain"
**Momentum**: 2 - 2 = 0, then +2 for signature = 2
**Flourish**: +1 (now at 6)
**Effect**: Next attack reflected

Enemy's third strike → Reflected!
**Momentum**: +1 (now at 3)

*His own strength turned against him.*

**Turn 4 - Building for the Finale**

*You have 6 Flourish tokens—enough for an ultimate. But Dancing Blade costs 4 Momentum to reach.*

Attack → Hit! **Momentum**: +1 (now at 4)
Attack → Hit! **Momentum**: +1 (now at 5)

**Transition**: Rooted Stone → Dancing Blade (costs 4 Momentum)
**Momentum**: 5 - 4 = 1

*Your stance shifts—fluid, balanced, the heart of the dance.*

Attack → CRITICAL HIT!
**Momentum**: +2 (now at 3)

**Turn 5 - The Finishing Flourish**

*He's bleeding, exhausted. Time to end this with style.*

**Ultimate**: "Thousand Cuts Flourish" (costs 5 Flourish)
**Flourish**: 6 - 5 = 1 remaining

*You move like lightning through all 6 stances in rapid succession:*
*Flowing Water dodge → Striking Serpent thrust → Whirling Wind spin → Rooted Stone counter → Shadow Step vanish → Dancing Blade finale*

**Damage**: 6d10 (one per stance) + all bonuses
**Result**: Rival duelist falls, defeated

*You return to Flowing Water, blade clean, breathing steady. The duel is over.*

**The Lesson**: Bladedancer requires resource awareness (Momentum for transitions, Flourish for ultimates), stance knowledge (which connects to which), and tactical timing (when to transition vs. when to build). You can't spam abilities—you must earn your power through mastery.`
    }
  },
  
  // Resource System
  resourceSystem: {
    title: 'Momentum & Flourish System',
    subtitle: 'Dual Resource Combat Flow',

    description: `The Bladedancer uses a dual resource system: Momentum (primary) and Flourish (secondary). Momentum represents your combat rhythm and is built through successful actions but decays when you falter. Flourish represents mastery and is earned through perfect execution of stance-specific techniques. Together, these resources create a dynamic flow where tactical success builds toward ultimate power.`,

    resourceBarExplanation: {
      title: 'Understanding Your Resource Bars',
      content: `**Momentum Bar (Primary - Top Bar)**:

**What You See**: A horizontal bar with 10 segments, filling from left to right as you build Momentum. The bar pulses with energy and changes color based on your current stance:
- Flowing Water: Blue rippling effect
- Striking Serpent: Green with serpentine patterns
- Whirling Wind: White with swirling motion
- Rooted Stone: Brown with solid texture
- Dancing Blade: Silver with flowing ribbons
- Shadow Step: Purple with shadowy wisps

**How It Changes**:
- **Successful Attack**: +1 segment fills (smooth pulse)
- **Critical Hit**: +2 segments fill (bright flash)
- **Dodge/Parry**: +1 segment fills (defensive shimmer)
- **Miss or Take Damage**: -1 segment empties (flicker and dim)
- **Stance Transition**: -2 to -4 segments empty (flowing drain animation)
- **Ability Use**: Segments drain based on cost

**Visual Feedback**: When you have 6+ Momentum, the bar glows brightly, indicating you have enough for most transitions and abilities. Below 3 Momentum, the bar dims and pulses slowly—you're vulnerable and need to build.

**Flourish Tokens (Secondary - Below Momentum Bar)**:

**What You See**: Up to 5 ornate tokens displayed as elegant medallions, each showing the symbol of the stance where it was earned. Unlike Momentum, these don't fill a bar—they're discrete tokens that persist.

**How It Changes**:
- **Signature Move Performed**: A new token materializes with a flourish animation, showing the stance's symbol
- **Ultimate Ability Used**: Tokens fade away gracefully (2-5 tokens depending on ability)
- **Between Combats**: Tokens remain (they don't decay)

**Visual Distinction**: Flourish tokens glow with golden light, clearly different from the Momentum bar. They represent your accumulated mastery—proof that you've perfected each stance's signature technique.

**Current Stance Indicator**:

Below both resource bars, your current stance is displayed with an icon and name. When you transition, this icon smoothly animates to the new stance, showing the flow of movement.

**Why This Matters**:

You're managing TWO different resources with different purposes:
- **Momentum** = Short-term tactical resource (build and spend each fight)
- **Flourish** = Long-term mastery resource (accumulate across fights, spend on ultimates)

A Bladedancer with high Momentum but no Flourish can transition freely and use abilities, but lacks ultimate power. A Bladedancer with Flourish but low Momentum has mastery tokens but can't transition or act effectively. You need BOTH to reach peak performance.

**Strategic Depth**: Your resource bars tell the story of your combat flow. A steadily climbing Momentum bar means you're in rhythm. A fluctuating bar means you're taking risks. Flourish tokens accumulating means you're mastering each stance. Empty Flourish means you're spending your mastery on game-changing ultimates.`
    },

    mechanics: {
      title: 'Detailed Mechanics',
      content: `**Momentum (Primary Resource)**

**Maximum Capacity**: 10 points (visualized as 10 segments in your resource bar)

**Generation (How to Build Momentum)**:
- **Successful Attack (Hit)**: +1 Momentum
  - Example: You have 3 Momentum, attack hits → Now at 4 Momentum
- **Critical Hit**: +2 Momentum
  - Example: You have 5 Momentum, crit → Now at 7 Momentum
- **Successful Dodge**: +1 Momentum (rewarding defensive skill)
  - Example: You have 2 Momentum, dodge an attack → Now at 3 Momentum
- **Successful Parry**: +1 Momentum (rewarding defensive skill)
  - Example: You have 4 Momentum, parry an attack → Now at 5 Momentum

**Decay (How You Lose Momentum)**:
- **Missing an Attack**: -1 Momentum (breaking your rhythm)
  - Example: You have 6 Momentum, miss → Now at 5 Momentum
- **Taking Damage**: -1 Momentum (being disrupted)
  - Example: You have 7 Momentum, take damage → Now at 6 Momentum

**Usage (How to Spend Momentum)**:
- **Stance Transitions**: 2-4 Momentum (depending on which stances you're transitioning between)
- **Stance Abilities**: 3-6 Momentum (depending on ability power)
- **Signature Moves**: 2-3 Momentum (but you gain Flourish as reward)

**Starting State**: Begin each combat at 0 Momentum (you must build rhythm from scratch)

**Flourish (Secondary Resource)**

**Maximum Capacity**: 5 tokens (displayed as individual medallions, not a bar)

**Generation (How to Earn Flourish)**:
- **Perform a Stance's Signature Move**: +1 Flourish token
  - Each stance has ONE signature move
  - Example: Use "Viper's Fang" (Striking Serpent signature) → Earn 1 Flourish token
  - The token shows the Striking Serpent symbol

**Persistence**: Flourish tokens do NOT decay and persist between combats
- Example: End combat with 3 Flourish → Start next combat with 3 Flourish

**Usage (How to Spend Flourish)**:
- **Ultimate Abilities**: 2-5 Flourish tokens (devastating cross-stance techniques)
- **Mastery Techniques**: 2-3 Flourish tokens (advanced stance-specific abilities)

**Mastery Reward**: Encourages learning and perfecting each stance's signature move

**Stance System**

**Starting Stance**: Begin every combat in Flowing Water (defensive/evasive stance)

**Stance Transitions**:
- Cost 2-4 Momentum depending on the transition
- Can only transition to connected stances (see network below)
- **Exception**: Dancing Blade can transition to ANY stance (costs 4 Momentum)

**Stance Network**: Stances are interconnected like a web. You can't jump from any stance to any other—you must follow the connections.

Example: From Flowing Water, you can reach:
- Striking Serpent (2 Momentum)
- Shadow Step (2 Momentum)
- Dancing Blade (4 Momentum)

But you CANNOT go directly from Flowing Water to Whirling Wind—you'd need to go through Striking Serpent first.`
    },

    // Stance Network Table
    stanceNetworkTable: {
      title: 'Combat Stance Network',
      description: 'The Bladedancer can transition between stances following this network. Each stance has unique abilities and passives.',
      headers: ['Stance', 'Type', 'Passive Effects', 'Can Transition To', 'Transition Cost'],
      rows: [
        [
          'Flowing Water',
          'Defensive/Evasive',
          '+2 armor, +10 ft movement, advantage on Disengage',
          'Striking Serpent, Shadow Step, Dancing Blade',
          '2 Momentum'
        ],
        [
          'Striking Serpent',
          'Offensive/Precision',
          '+2 to attack rolls, increased crit chance',
          'Whirling Wind, Rooted Stone, Flowing Water',
          '2 Momentum'
        ],
        [
          'Whirling Wind',
          'AoE/Multi-target',
          'Attacks can cleave to adjacent enemies',
          'Dancing Blade, Rooted Stone',
          '3 Momentum'
        ],
        [
          'Rooted Stone',
          'Defensive/Counter',
          'Can use reaction to parry, riposte on successful parry',
          'Striking Serpent, Flowing Water',
          '2 Momentum'
        ],
        [
          'Dancing Blade',
          'Balanced/Versatile',
          '+1 to all rolls, can chain abilities',
          'ANY stance (universal hub)',
          '4 Momentum'
        ],
        [
          'Shadow Step',
          'Stealth/Burst',
          'Advantage on first attack, +2d6 damage on ambush',
          'Striking Serpent, Dancing Blade',
          '3 Momentum'
        ]
      ]
    },

    // Stance Abilities Table
    stanceAbilitiesTable: {
      title: 'Stance-Specific Abilities',
      description: 'Each stance grants access to unique abilities. Signature moves (★) generate 1 Flourish token when used.',
      headers: ['Stance', 'Ability Name', 'Cost', 'Effect', 'Signature'],
      rows: [
        [
          'Flowing Water',
          'Rippling Defense',
          '3 Momentum',
          'Dodge next attack automatically, gain +2 Momentum',
          ''
        ],
        [
          'Flowing Water',
          'Water\'s Embrace ★',
          '5 Momentum',
          'Become untargetable for 1 round, reposition anywhere within 30 ft',
          '★'
        ],
        [
          'Striking Serpent',
          'Viper Strike',
          '4 Momentum',
          'Attack with advantage, +1d8 damage',
          ''
        ],
        [
          'Striking Serpent',
          'Serpent\'s Fang ★',
          '6 Momentum',
          'Guaranteed critical hit, apply poison (1d6 damage/round for 3 rounds)',
          '★'
        ],
        [
          'Whirling Wind',
          'Cyclone Slash',
          '4 Momentum',
          'Attack all enemies within 10 ft',
          ''
        ],
        [
          'Whirling Wind',
          'Tempest Dance ★',
          '6 Momentum',
          'Attack all enemies within 15 ft, knock them back 10 ft',
          '★'
        ],
        [
          'Rooted Stone',
          'Iron Parry',
          '3 Momentum',
          'Parry next attack, riposte for 2d6 damage',
          ''
        ],
        [
          'Rooted Stone',
          'Mountain\'s Rebuke ★',
          '5 Momentum',
          'Parry all attacks this round, riposte each for 1d8 damage',
          '★'
        ],
        [
          'Dancing Blade',
          'Blade Flourish',
          '4 Momentum',
          'Attack twice in one action',
          ''
        ],
        [
          'Dancing Blade',
          'Dance of Blades ★',
          '6 Momentum',
          'Chain 3 different stance abilities in one turn',
          '★'
        ],
        [
          'Shadow Step',
          'Ambush Strike',
          '4 Momentum',
          'Teleport to target, attack with +3d6 damage',
          ''
        ],
        [
          'Shadow Step',
          'Vanishing Blade ★',
          '6 Momentum',
          'Become invisible, next attack is automatic critical hit',
          '★'
        ]
      ]
    },

    // Flourish Abilities Table
    flourishAbilitiesTable: {
      title: 'Flourish Ultimate Abilities',
      description: 'Powerful abilities that consume Flourish tokens. These represent the pinnacle of Bladedancer mastery.',
      headers: ['Ability Name', 'Flourish Cost', 'Effect', 'Requirements'],
      rows: [
        [
          'Perfect Form',
          '2 Flourish',
          'Gain +5 to all rolls for 3 rounds, Momentum cannot decay',
          'None'
        ],
        [
          'Stance Mastery',
          '3 Flourish',
          'All stance transitions cost 0 Momentum for 5 rounds',
          'None'
        ],
        [
          'Blade Storm',
          '3 Flourish',
          'Attack all enemies within 20 ft for 4d8 damage, knock prone',
          'Must be in Whirling Wind'
        ],
        [
          'Thousand Cuts',
          '4 Flourish',
          'Attack single target 10 times, each hit deals 1d6 damage',
          'Must be in Striking Serpent'
        ],
        [
          'Phantom Dance',
          '5 Flourish',
          'Create 3 illusory copies, each can attack independently for 1 minute',
          'Must be in Shadow Step'
        ]
      ]
    },

    practicalExample: {
      title: 'Practical Decision-Making Example',
      content: `**Scenario**: You're in Striking Serpent stance with 5 Momentum and 2 Flourish tokens. You're fighting three goblins (low HP) and one ogre (high HP, dangerous). Your party's tank just went down.

**Current State**:
- Stance: Striking Serpent (offensive/precision)
- Momentum: 5
- Flourish: 2 tokens
- Enemies: 3 goblins (clustered), 1 ogre (threatening)
- Tank: Down (you're now the target)

**Option A - Stay Offensive**:
Use "Viper's Fang" (Striking Serpent signature, costs 3 Momentum)
- Pros: Deals precision damage to ogre, earns 1 Flourish token (would have 3 total)
- Cons: Leaves you at 2 Momentum, not enough to transition to defensive stance
- Risk: Ogre attacks you next turn, you can't escape

**Option B - Transition to AoE**:
Transition to Whirling Wind (costs 2 Momentum), then use cleave attacks on goblins
- Pros: Can hit all 3 goblins at once, clear weak enemies
- Cons: Costs 2 Momentum to transition (leaves you at 3), Whirling Wind has no defensive bonuses
- Risk: Ogre still alive and you're vulnerable

**Option C - Defensive Retreat**:
Transition to Rooted Stone (costs 2 Momentum), use defensive abilities
- Pros: Rooted Stone has parry/counter abilities, can survive ogre's attack
- Cons: Doesn't kill any enemies, purely defensive
- Risk: Goblins and ogre both attack, you're outnumbered

**Option D - Hub Strategy**:
Transition to Dancing Blade (costs 4 Momentum), then immediately to Whirling Wind (costs 0 from Dancing Blade's hub ability)
- Pros: Reach Whirling Wind in one turn, can AoE goblins
- Cons: Costs 4 Momentum (leaves you at 1), very low resources
- Risk: If you miss, you're at 0 Momentum and vulnerable

**Option E - Flourish Ultimate**:
Use "Perfect Form" (costs 2 Flourish tokens)
- Pros: +5 to all rolls for 3 rounds, Momentum can't decay
- Cons: Spends all your Flourish, no immediate damage
- Risk: Doesn't solve the immediate threat

**Best Choice**: Option B (Transition to Whirling Wind, clear goblins)

**Why**:
1. Three goblins represent more total damage than one ogre over time
2. Whirling Wind's cleave can kill all 3 goblins in 1-2 attacks
3. You'll build Momentum back up from hitting multiple targets (+1 per hit)
4. With goblins dead, you can focus on ogre next turn
5. You still have 2 Flourish tokens for emergency ultimate if needed

**Execution**:
- Transition: Striking Serpent → Whirling Wind (costs 2 Momentum, now at 3)
- Attack with cleave: Hit all 3 goblins → +3 Momentum (now at 6)
- Goblins die (low HP)
- Next turn: Transition to Rooted Stone (costs 2 Momentum, now at 4) to defend against ogre
- Use parry/counter abilities to survive and build Momentum

**Alternative if Ogre is About to Kill You**: Option C (Rooted Stone defensive)
- Why: Survival > damage. Rooted Stone's parry can negate ogre's attack and counter for damage. You can clean up goblins later if you're alive.

**The Lesson**: Bladedancer decisions involve:
1. **Resource Math**: Can you afford the transition? Will you have enough Momentum left?
2. **Stance Pathing**: Which stances can you reach from your current position?
3. **Threat Assessment**: Which enemies are the real danger?
4. **Momentum Forecasting**: Will this action build or drain your Momentum?
5. **Flourish Timing**: Save for ultimates or spend for game-changing moments?

You're not just picking abilities—you're navigating a network of stances while managing two resources and adapting to dynamic threats. That's the Bladedancer's art.`
    },

    playingInPerson: {
      title: 'Playing in Person',
      subtitle: 'Physical Tracking for Tabletop Play',
      content: `The Bladedancer's dual resource system—Momentum (0-20, builds/decays) and Flourish (persistent tokens)—combined with 6 interconnected stances creates a flowing, tactical in-person experience. Here's how to track your combat dance at the table:

**Required Materials**:
- **20 tokens or beads** (for Momentum - blue/silver recommended)
- **5 special tokens** (for Flourish - gold/ornate recommended)
- **Stance reference cards** (one for each of the 6 stances)
- **Stance network diagram** showing transition paths
- **Current stance indicator** (token or card)

**Momentum Tracking**:

**The Token Method** (Recommended):

Use physical tokens to represent Momentum (0-20):
- **Starting State**: Begin each combat at 0 Momentum
- **Generating Momentum**: Add tokens when you succeed
  - Successful attack → +1 token
  - Critical hit → +2 tokens
  - Successful dodge/parry → +1 token
- **Losing Momentum**: Remove tokens when you fail
  - Miss an attack → -1 token
  - Take damage → -1 token
- **Spending Momentum**: Remove tokens when using abilities
  - Stance transition → -2 to -4 tokens (depending on transition)
  - Stance ability → -3 to -6 tokens (depending on ability)

**Alternative Tracking Methods**:
- **d20 Die**: Set it to your current Momentum count (0-20)
- **Tally Marks**: Write on paper with hash marks
- **Counter App**: Use a phone app to track Momentum

**Flourish Token Tracking**:

**The Special Token Method** (Recommended):

Use distinct, ornate tokens to represent Flourish (max 5):
- **Starting State**: Begin with 0 Flourish tokens (or carry over from previous combat)
- **Earning Flourish**: Add a token when you perform a signature move (★ abilities)
  - Example: Use "Serpent's Fang" (Striking Serpent signature) → Add 1 gold token
- **Spending Flourish**: Remove tokens when using ultimate abilities
  - Perfect Form (2 Flourish) → Remove 2 gold tokens
  - Blade Storm (3 Flourish) → Remove 3 gold tokens
  - Phantom Dance (5 Flourish) → Remove 5 gold tokens
- **Persistence**: Flourish tokens DON'T decay between combats (keep them!)

**Visual Distinction**: Use clearly different tokens for Momentum (blue/silver, common) vs. Flourish (gold/ornate, special) so you never confuse them.

**Stance Tracking**:

**The Stance Card Method** (Recommended):

Create reference cards for each stance showing:
- **Stance Name & Icon**
- **Passive Bonuses**
- **Available Abilities** (with Momentum costs)
- **Transition Paths** (which stances you can reach)
- **Signature Move** (★ ability that earns Flourish)

**Example Stance Cards**:

\`\`\`
FLOWING WATER (Starting Stance)
━━━━━━━━━━━━━━━━━━━━━━━━━━
Passive: +2 AC, advantage on Dex saves
Theme: Defensive, evasive

Abilities:
• Flowing Strike (3 Momentum): Attack + reposition
• Water's Embrace ★ (5 Momentum): Dodge all attacks this round, heal 2d6

Transitions (2 Momentum each):
→ Striking Serpent
→ Shadow Step
→ Dancing Blade

Signature Move: Water's Embrace ★
━━━━━━━━━━━━━━━━━━━━━━━━━━

STRIKING SERPENT
━━━━━━━━━━━━━━━━━━━━━━━━━━
Passive: +2 attack, +1d4 precision damage
Theme: Offensive, precision

Abilities:
• Viper's Strike (3 Momentum): Attack with +2d6 damage
• Serpent's Fang ★ (5 Momentum): Auto-crit next attack

Transitions:
→ Whirling Wind (2 Momentum)
→ Rooted Stone (2 Momentum)
→ Flowing Water (2 Momentum)

Signature Move: Serpent's Fang ★
━━━━━━━━━━━━━━━━━━━━━━━━━━

WHIRLING WIND
━━━━━━━━━━━━━━━━━━━━━━━━━━
Passive: +10 ft speed, cleave attacks
Theme: AoE, multi-target

Abilities:
• Whirlwind Strike (4 Momentum): Attack all adjacent enemies
• Cyclone Slash ★ (6 Momentum): Massive AoE, knock prone

Transitions:
→ Dancing Blade (3 Momentum)
→ Rooted Stone (2 Momentum)

Signature Move: Cyclone Slash ★
━━━━━━━━━━━━━━━━━━━━━━━━━━

ROOTED STONE
━━━━━━━━━━━━━━━━━━━━━━━━━━
Passive: +3 AC, cannot be moved
Theme: Defensive, counter

Abilities:
• Iron Parry (3 Momentum): Parry next attack, riposte 2d6
• Mountain's Rebuke ★ (5 Momentum): Parry all attacks, riposte each

Transitions:
→ Striking Serpent (2 Momentum)
→ Flowing Water (2 Momentum)

Signature Move: Mountain's Rebuke ★
━━━━━━━━━━━━━━━━━━━━━━━━━━

DANCING BLADE (Hub Stance)
━━━━━━━━━━━━━━━━━━━━━━━━━━
Passive: +1 attack, +5 ft speed
Theme: Balanced, versatile

Abilities:
• Blade Flourish (4 Momentum): Attack twice
• Dance of Blades ★ (6 Momentum): Chain 3 abilities

Transitions (4 Momentum each):
→ ANY STANCE (universal hub)

Signature Move: Dance of Blades ★
━━━━━━━━━━━━━━━━━━━━━━━━━━

SHADOW STEP
━━━━━━━━━━━━━━━━━━━━━━━━━━
Passive: +3d6 sneak attack, advantage from stealth
Theme: Stealth, burst damage

Abilities:
• Ambush Strike (4 Momentum): Teleport + attack +3d6
• Vanishing Blade ★ (6 Momentum): Invisibility, next attack auto-crit

Transitions:
→ Striking Serpent (2 Momentum)
→ Dancing Blade (3 Momentum)

Signature Move: Vanishing Blade ★
━━━━━━━━━━━━━━━━━━━━━━━━━━
\`\`\`

**Stance Network Diagram**:

Print a diagram showing how stances connect:
\`\`\`
        FLOWING WATER (Start)
         /      |      \\
        /       |       \\
  SHADOW    DANCING   STRIKING
   STEP      BLADE    SERPENT
     |         |      /     \\
     |         |     /       \\
     +----+----+----+    WHIRLING
          |              WIND
      DANCING             |
       BLADE              |
          |          ROOTED
          |           STONE
          |              |
          +------+-------+
                 |
            FLOWING WATER
\`\`\`

**Current Stance Indicator**:
- **Card Method**: Place current stance card face-up in front of you
- **Token Method**: Use a colored token to mark current stance on diagram
- **Highlight Method**: Use a marker or token to highlight current stance

**Example In-Person Turn**:

*You have 5 Momentum, 2 Flourish tokens, currently in Striking Serpent stance*

**Turn 1 - Attack and Build Momentum**:
1. "I attack the goblin!"
2. Roll to hit → Hit!
3. Add 1 Momentum token: 5 + 1 = 6 Momentum
4. Roll damage with Striking Serpent bonus: 1d8 + 1d4 → [7] + [3] = 10 damage!

**Turn 2 - Stance Transition**:
1. "I transition to Whirling Wind stance!" (costs 2 Momentum)
2. Remove 2 Momentum tokens: 6 - 2 = 4 Momentum
3. Swap Striking Serpent card for Whirling Wind card
4. Gain Whirling Wind bonuses: +10 ft speed, cleave attacks

**Turn 3 - Use Signature Move**:
1. "I use Cyclone Slash!" (costs 6 Momentum, signature move ★)
2. Remove 6 Momentum tokens: 4 - 6 = -2... NOT ENOUGH MOMENTUM!
3. "Wait, I only have 4 Momentum. I'll use Whirlwind Strike instead." (costs 4 Momentum)
4. Remove 4 Momentum tokens: 4 - 4 = 0 Momentum
5. Attack all adjacent enemies, roll damage for each

**Turn 4 - Rebuild Momentum**:
1. "I attack the orc!"
2. Roll to hit → Hit!
3. Add 1 Momentum token: 0 + 1 = 1 Momentum
4. "I attack again!" (second attack)
5. Roll to hit → Critical hit!
6. Add 2 Momentum tokens: 1 + 2 = 3 Momentum

**Quick Reference Card Template**:
\`\`\`
BLADEDANCER QUICK REFERENCE

MOMENTUM (Primary Resource):
• Start combat: 0 Momentum
• Maximum: 20 Momentum
• Build: Attack (+1), Crit (+2), Dodge/Parry (+1)
• Lose: Miss (-1), Take damage (-1)
• Spend: Transitions (2-4), Abilities (3-6)

FLOURISH (Secondary Resource):
• Maximum: 5 tokens
• Earn: Signature moves (★ abilities)
• Spend: Ultimate abilities (2-5 tokens)
• Persist: Don't decay between combats

STANCES:
💧 Flowing Water: Defensive, evasive (START)
🐍 Striking Serpent: Offensive, precision
🌪️ Whirling Wind: AoE, multi-target
🗿 Rooted Stone: Defensive, counter
⚔️ Dancing Blade: Balanced, hub (ANY transition)
👤 Shadow Step: Stealth, burst

STANCE TRANSITIONS:
• Most transitions: 2 Momentum
• To Dancing Blade: 3-4 Momentum
• From Dancing Blade: 4 Momentum (but can go ANYWHERE)
\`\`\`

**Thematic Enhancements**:

Many players enhance the stance-dancing experience with:
- **Stance Cards**: Laminated cards with stance artwork
- **Colored Tokens**: Blue for Momentum, gold for Flourish
- **Stance Diagram**: Printed network showing transition paths
- **Physical Movements**: Stand/sit differently for each stance
- **Stance Announcements**: Describe transitions dramatically

**Example Full Combat Sequence**:

*Starting: 0 Momentum, 2 Flourish tokens, Flowing Water stance*

**Turn 1**: Attack (hit) → 1 Momentum
**Turn 2**: Attack (hit) → 2 Momentum
**Turn 3**: Transition to Striking Serpent (2 Momentum) → 0 Momentum
**Turn 4**: Attack (crit!) → 2 Momentum
**Turn 5**: Use Serpent's Fang ★ (5 Momentum)... NOT ENOUGH! Attack instead → 3 Momentum
**Turn 6**: Attack (hit) → 4 Momentum
**Turn 7**: Attack (hit) → 5 Momentum
**Turn 8**: Use Serpent's Fang ★ (5 Momentum) → 0 Momentum, +1 Flourish (now 3 Flourish)
**Turn 9**: Attack (hit) → 1 Momentum
**Turn 10**: Spend 3 Flourish on Blade Storm! → 0 Flourish, massive AoE damage!

**Visual Organization**:

**Your Play Area**:
\`\`\`
[Current Stance Card]    [Momentum Tokens]    [Flourish Tokens]
  STRIKING SERPENT      ○○○○○○ (6)           ★★ (2)

[Stance Network Diagram]
(Shows all 6 stances with current stance highlighted)
\`\`\`

**Specialization-Specific Tracking**:

**Flow Master**:
- Stance transitions cost 1 less Momentum (minimum 1)
- Note: Most transitions become 1 Momentum instead of 2
- Track transition bonus: +1d6 damage after each stance change

**Duelist**:
- Parry/counter abilities cost 1 less Momentum
- Track parry count: Earn Flourish after 3 successful parries
- Note: Focus on Rooted Stone and Flowing Water stances

**Shadow Dancer**:
- Shadow Step abilities cost 1 less Momentum
- Earn Flourish from stealth kills (not just signature moves)
- Track stealth status: Note when invisible/hidden

**Why This System Works**: The physical act of adding/removing Momentum tokens, earning special Flourish tokens, and swapping stance cards creates a FLOWING RHYTHM. You can SEE your Momentum building and decaying, FEEL the weight of spending it on transitions, and EXPERIENCE the satisfaction of earning Flourish tokens through perfect execution. The stance cards show your current abilities at a glance, and the network diagram helps you plan your next transition. The dual resource system creates meaningful decisions: spend Momentum on transitions or abilities? Save Flourish for ultimates or spend for game-changing moments?

**Pro Tips**:
- **Momentum Banking**: Keep 6+ Momentum for tactical flexibility
- **Stance Planning**: Know which stance you need BEFORE transitioning
- **Flourish Timing**: Save for critical moments (boss phases, party in danger)
- **Signature Moves**: Use ★ abilities to earn Flourish when safe
- **Dancing Blade Hub**: Use Dancing Blade to reach any stance (costs 4 Momentum)

**Budget-Friendly Alternatives**:
- **No tokens?** Use coins for Momentum, special coins for Flourish
- **No stance cards?** Write stance names on paper with abilities listed
- **No diagram?** Just remember transition paths
- **Minimalist**: Track Momentum and Flourish on paper, announce stance changes

**Why Bladedancer Is Perfect for In-Person Play**: The class is built around flowing between stances while managing two distinct resources. The physical components (Momentum tokens, Flourish tokens, stance cards, network diagram) make the abstract concept of "combat flow" tangible and strategic. Swapping stance cards, adding Momentum tokens after successful attacks, and earning special Flourish tokens through signature moves creates a visceral sense of mastery. Every combat is a dance—building rhythm (Momentum), perfecting techniques (Flourish), and flowing between forms (stances). The physical tracking makes this dance visible and engaging.`
    }
  },

  // Specializations
  specializations: {
    title: 'Bladedancer Specializations',
    subtitle: 'Three Paths of Martial Mastery',

    description: `Bladedancers can specialize in different aspects of stance-based combat, each offering unique approaches to the Momentum & Flourish system. These specializations focus on rapid transitions (Flow Master), precision counters (Duelist), or stealth burst (Shadow Dancer).`,

    passiveAbility: {
      name: 'Stance Mastery',
      description: 'All Bladedancers can flow between 6 combat stances, building Momentum through successful combat actions and earning Flourish tokens through signature moves. Begin combat in Flowing Water stance.'
    },

    specs: [
      {
        name: 'Flow Master',
        icon: 'fas fa-wind',
        description: 'Masters of rapid stance transitions and combo chains. Flow Masters flow between stances with minimal cost, chaining abilities together for devastating combinations.',

        passiveAbility: {
          name: 'Flowing Transitions',
          description: 'All stance transitions cost 1 less Momentum (minimum 1). When you change stances, your next attack gains +1d6 damage.'
        },

        keyAbilities: [
          {
            name: 'Momentum Surge',
            description: 'Passive: Generate +1 additional Momentum from all sources.'
          },
          {
            name: 'Chain Dance',
            description: 'When you use an ability in one stance, you may immediately transition to a connected stance for free and use one of its abilities.'
          },
          {
            name: 'Endless Flow',
            description: 'Ultimate: For 1 minute, all stance transitions are free and you can transition to any stance regardless of network restrictions. Costs 4 Flourish.'
          }
        ]
      },

      {
        name: 'Duelist',
        icon: 'fas fa-sword',
        description: 'Masters of precision strikes and counter-attacks. Duelists excel in single combat, using perfect timing and technique to dominate opponents.',

        passiveAbility: {
          name: 'Perfect Precision',
          description: 'While in Striking Serpent or Rooted Stone stance, gain +2 to attack rolls and increased critical hit chance (crit on max damage die -1 or max).'
        },

        keyAbilities: [
          {
            name: 'Riposte Master',
            description: 'Passive: Successful parries generate 2 Momentum instead of 1. Riposte damage is doubled.'
          },
          {
            name: 'Precision Strike',
            description: 'Spend 5 Momentum to make an attack that automatically hits and deals maximum damage. If this kills the target, refund 3 Momentum.'
          },
          {
            name: 'Duel\'s End',
            description: 'Ultimate: Challenge a single enemy to a duel. For 1 minute, you both can only target each other. You gain +5 to all rolls, advantage on all attacks, and double Momentum generation. Costs 5 Flourish.'
          }
        ]
      },

      {
        name: 'Shadow Dancer',
        icon: 'fas fa-user-ninja',
        description: 'Masters of stealth and burst damage. Shadow Dancers strike from the shadows with devastating ambushes and can vanish mid-combat.',

        passiveAbility: {
          name: 'Shadow Affinity',
          description: 'You can enter Shadow Step stance from any stance (ignoring network restrictions) for 3 Momentum. While in Shadow Step, you are lightly obscured and have advantage on Stealth checks.'
        },

        keyAbilities: [
          {
            name: 'Ambush Expert',
            description: 'Passive: Attacks from Shadow Step deal +3d6 damage instead of +2d6. First attack each combat is always from Shadow Step.'
          },
          {
            name: 'Vanishing Strike',
            description: 'Spend 6 Momentum to teleport to any target within 60 ft, attack with advantage, then return to your original position. This does not provoke opportunity attacks.'
          },
          {
            name: 'Dance of Shadows',
            description: 'Ultimate: Become a shadow for 1 minute. You can teleport up to 30 ft for 1 AP, all attacks deal +4d6 damage, and you cannot be targeted by opportunity attacks. Costs 5 Flourish.'
          }
        ]
      }
    ]
  },

  // Spells - organized by level
  spells: [
    // ===== BLADE DANCER SPECIALIZATION =====
    // ========================================
    // LEVEL 1 SPELLS - Basic Abilities
    // ========================================

    {
      id: 'bladedancer_momentum_strike',
      name: 'Momentum Strike',
      description: 'A precise strike that builds your combat rhythm, channeling your Momentum into devastating force.',
      level: 1,
      spellType: 'ACTION',
      icon: 'inv_sword_04',

      typeConfig: {
        school: 'physical',
        icon: 'inv_sword_04',
        tags: ['melee', 'damage', 'momentum_generation', 'starter'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'melee',
        rangeDistance: 5,
        targetRestrictions: ['enemy']
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 0 },
        actionPoints: 1,
        components: ['somatic'],
        somaticText: 'Swift momentum-building strike'
      },

      resolution: 'DICE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '1d8 + agility',
        elementType: 'physical',
        damageType: 'direct',
        canCrit: true,
        critMultiplier: 2,
        critDiceOnly: false,
        criticalConfig: {
          enabled: true,
          critType: 'dice',
          critMultiplier: 2
        },
        description: 'Precise strike that builds combat rhythm and Momentum'
      },

      cooldownConfig: {
        type: 'none'
      },

      tags: ['melee', 'damage', 'momentum_generation', 'starter', 'bladedancer']
    },

    {
      id: 'bladedancer_stance_shift',
      name: 'Stance Shift',
      description: 'Flow between combat stances, adapting your fighting style to any situation. Each stance offers unique abilities and passive effects.',
      level: 1,
      spellType: 'ACTION',
      icon: 'ability_druid_catform',

      typeConfig: {
        school: 'physical',
        icon: 'ability_druid_catform',
        tags: ['utility', 'stance', 'transition', 'starter'],
        castTime: 0,
        castTimeType: 'FREE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      resourceCost: {
        resourceTypes: ['momentum'],
        resourceValues: { momentum: 2 },
        actionPoints: 0,
        components: []
      },

      resolution: 'NONE',
      effectTypes: ['utility'],

      utilityConfig: {
        utilityType: 'stance_change',
        selectedEffects: [{
          id: 'stance_transition',
          name: 'Stance Transition',
          description: 'Change to a connected stance in the stance network, gaining its passive effects'
        }],
        duration: 0,
        durationUnit: 'permanent',
        concentration: false,
        power: 'minor'
      },

      cooldownConfig: {
        type: 'none'
      },

      tags: ['utility', 'stance', 'transition', 'starter', 'bladedancer']
    },

    {
      id: 'bladedancer_defensive_flow',
      name: 'Defensive Flow',
      description: 'Flow into a defensive stance, gaining enhanced evasion and counter-attack opportunities.',
      level: 1,
      spellType: 'PASSIVE',
      icon: 'ability_warrior_defensivestance',

      typeConfig: {
        school: 'bludgeoning',
        icon: 'ability_warrior_defensivestance',
        tags: ['passive', 'defense', 'counter', 'toggleable', 'starter'],
        toggleable: true
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 0 },
        actionPoints: 0,
        components: []
      },

      resolution: 'NONE',
      effectTypes: ['buff'],

      buffConfig: {
        buffType: 'statEnhancement',
        effects: [{
          id: 'defensive_flow_dodge',
          name: 'Flowing Defense',
          description: 'Increases dodge chance and generates Momentum on successful dodges',
          statModifier: {
            stat: 'dodge',
            magnitude: 2,
            magnitudeType: 'flat'
          }
        }],
        durationValue: 0,
        durationType: 'permanent',
        durationUnit: 'permanent',
        concentrationRequired: false,
        canBeDispelled: false
      },

      cooldownConfig: {
        type: 'none'
      },

      tags: ['passive', 'defense', 'counter', 'toggleable', 'starter', 'bladedancer']
    },

    {
      id: 'bladedancer_quick_step',
      name: 'Quick Step',
      description: 'A swift repositioning technique that allows you to move quickly and strike from unexpected angles.',
      level: 1,
      spellType: 'ACTION',
      icon: 'ability_rogue_sprint',

      typeConfig: {
        school: 'physical',
        icon: 'ability_rogue_sprint',
        tags: ['movement', 'damage', 'mobility', 'starter'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'melee',
        rangeDistance: 5,
        targetRestrictions: ['enemy']
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 0 },
        actionPoints: 1,
        components: ['somatic'],
        somaticText: 'Swift repositioning strike'
      },

      resolution: 'DICE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '1d6 + agility',
        elementType: 'physical',
        damageType: 'direct',
        canCrit: true,
        critMultiplier: 2,
        critDiceOnly: false,
        description: 'Quick strike with enhanced mobility'
      },

      cooldownConfig: {
        type: 'none'
      },

      tags: ['movement', 'damage', 'mobility', 'starter', 'bladedancer']
    },

    // ========================================
    // LEVEL 2 SPELLS - Enhanced Abilities
    // ========================================

    {
      id: 'bladedancer_flowing_strike',
      name: 'Flowing Strike',
      description: 'A fluid attack that transitions between stances, dealing bonus damage based on your current Momentum level.',
      level: 2,
      spellType: 'ACTION',
      icon: 'ability_rogue_slicedice',

      typeConfig: {
        school: 'physical',
        icon: 'ability_rogue_slicedice',
        tags: ['melee', 'damage', 'stance-transition', 'momentum_scaling'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'melee',
        rangeDistance: 5,
        targetRestrictions: ['enemy']
      },

      resourceCost: {
        resourceTypes: ['mana', 'momentum'],
        resourceValues: { mana: 0, momentum: 3 },
        actionPoints: 1,
        components: ['somatic'],
        somaticText: 'Fluid strike while shifting stance'
      },

      resolution: 'DICE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '2d6 + agility + (CurrentMomentum * 1d4)',
        elementType: 'physical',
        damageType: 'direct',
        canCrit: true,
        critMultiplier: 2,
        critDiceOnly: false,
        criticalConfig: {
          enabled: true,
          critType: 'dice',
          critMultiplier: 2
        },
        chanceOnHitConfig: {
          enabled: true,
          procType: 'dice',
          diceThreshold: 18,
          procChance: 15,
          customEffects: ['knockback'],
          knockbackConfig: {
            distance: 10
          }
        },
        description: 'Fluid strike that scales with Momentum and may knock foes back on critical hits'
      },

      cooldownConfig: {
        type: 'none'
      },

      tags: ['melee', 'damage', 'stance-transition', 'momentum_scaling', 'bladedancer']
    },

    {
      id: 'bladedancer_dancing_blade',
      name: 'Dancing Blade',
      description: 'A mesmerizing series of strikes that flows between different attack patterns, building Momentum with each hit.',
      level: 2,
      spellType: 'ACTION',
      icon: 'ability_warrior_bladestorm',

      typeConfig: {
        school: 'physical',
        icon: 'ability_warrior_bladestorm',
        tags: ['melee', 'damage', 'multi-attack', 'momentum_generation'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'melee',
        rangeDistance: 5,
        targetRestrictions: ['enemy']
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 0 },
        actionPoints: 1,
        components: ['somatic'],
        somaticText: 'Flowing blade dance'
      },

      resolution: 'DICE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '2d6 + agility',
        elementType: 'physical',
        damageType: 'direct',
        canCrit: true,
        critMultiplier: 2,
        critDiceOnly: false,
        description: 'Multiple flowing strikes that build combat rhythm'
      },

      cooldownConfig: {
        type: 'none'
      },

      tags: ['melee', 'damage', 'multi-attack', 'momentum_generation', 'bladedancer']
    },

    {
      id: 'bladedancer_stance_dance',
      name: 'Stance Dance',
      description: 'Rapidly transition through multiple stances, gaining brief bonuses from each before returning to your original form.',
      level: 2,
      spellType: 'ACTION',
      icon: 'ability_druid_challangingroar',

      typeConfig: {
        school: 'physical',
        icon: 'ability_druid_challangingroar',
        tags: ['utility', 'stance', 'transition', 'buff'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      resourceCost: {
        resourceTypes: ['momentum'],
        resourceValues: { momentum: 4 },
        actionPoints: 1,
        components: ['somatic'],
        somaticText: 'Dance through stances'
      },

      resolution: 'NONE',
      effectTypes: ['buff'],

      buffConfig: {
        buffType: 'statEnhancement',
        effects: [{
          id: 'stance_dance_speed',
          name: 'Dancing Speed',
          description: 'The fluid motion of flowing through stances grants you exceptional mobility. The seamless transitions between combat forms make you move like water, flowing effortlessly across the battlefield.',
          statModifier: {
            stat: 'movementSpeed',
            magnitude: 10,
            magnitudeType: 'flat'
          }
        }],
        durationValue: 1,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: false,
        canBeDispelled: false
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 2
      },

      tags: ['utility', 'stance', 'transition', 'buff', 'bladedancer']
    },

    {
      id: 'bladedancer_blade_flurry',
      name: 'Blade Flurry',
      description: 'Unleash a rapid series of strikes, each building on the momentum of the last for devastating damage.',
      level: 2,
      spellType: 'ACTION',
      icon: 'ability_warrior_weaponmastery',

      typeConfig: {
        school: 'physical',
        icon: 'ability_warrior_weaponmastery',
        tags: ['melee', 'damage', 'multi-attack', 'momentum_scaling'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'melee',
        rangeDistance: 5,
        targetRestrictions: ['enemy']
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 0 },
        actionPoints: 1,
        components: ['somatic'],
        somaticText: 'Rapid blade flurry'
      },

      resolution: 'DICE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '1d8 + agility + (CurrentMomentum / 2)',
        elementType: 'physical',
        damageType: 'direct',
        canCrit: true,
        critMultiplier: 2,
        critDiceOnly: false,
        description: 'Multiple rapid strikes that scale with current Momentum'
      },

      cooldownConfig: {
        type: 'none'
      },

      tags: ['melee', 'damage', 'multi-attack', 'momentum_scaling', 'bladedancer']
    },

    {
      id: 'bladedancer_chain_dance',
      name: 'Chain Dance',
      description: 'Flow through multiple stances in rapid succession, unleashing a devastating combo of attacks from each combat form.',
      level: 4,
      spellType: 'ACTION',
      icon: 'ability_warrior_bladestorm',

      typeConfig: {
        school: 'physical',
        icon: 'ability_warrior_bladestorm',
        tags: ['melee', 'damage', 'multi-attack', 'stance-transition', 'flourish_generation'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'multi',
        rangeType: 'melee',
        rangeDistance: 5,
        maxTargets: 3,
        targetRestrictions: ['enemy']
      },

      resourceCost: {
        resourceTypes: ['mana', 'momentum', 'flourish'],
        resourceValues: { mana: 0, momentum: 8, flourish: 2 },
        actionPoints: 2,
        components: ['somatic'],
        somaticText: 'Flow through multiple combat forms'
      },

      resolution: 'DICE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '3d8 + agility',
        elementType: 'physical',
        damageType: 'direct',
        canCrit: true,
        critMultiplier: 2,
        critDiceOnly: false,
        criticalConfig: {
          enabled: true,
          critType: 'dice',
          critMultiplier: 2
        },
        description: 'Three devastating attacks, each enhanced by a different stance\'s power'
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 2
      },

      tags: ['melee', 'damage', 'multi-attack', 'stance-transition', 'flourish_generation', 'bladedancer']
    },

    // ========================================
    // LEVEL 3 SPELLS - Advanced Abilities
    // ========================================

    {
      id: 'bladedancer_perfect_riposte',
      name: 'Perfect Riposte',
      description: 'Parry an incoming attack and counter with a devastating strike that generates extra Momentum.',
      level: 3,
      spellType: 'REACTION',
      icon: 'ability_parry',

      typeConfig: {
        school: 'physical',
        icon: 'ability_parry',
        tags: ['reaction', 'parry', 'counter', 'momentum_generation'],
        castTime: 0,
        castTimeType: 'REACTION'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'melee',
        rangeDistance: 5,
        targetRestrictions: ['enemy']
      },

      resourceCost: {
        resourceTypes: ['mana', 'momentum'],
        resourceValues: { mana: 0, momentum: 4 },
        actionPoints: 0,
        components: ['somatic'],
        somaticText: 'Deflect and counter in one motion'
      },

      resolution: 'SAVE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '3d8 + agility',
        elementType: 'physical',
        damageType: 'direct',
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'agility',
          difficultyClass: 15,
          saveOutcome: 'negates'
        },
        description: 'Devastating counter-attack that may be avoided with an agility save'
      },

      cooldownConfig: {
        type: 'none'
      },

      tags: ['reaction', 'parry', 'counter', 'momentum_generation', 'bladedancer']
    },

    {
      id: 'bladedancer_whirling_defense',
      name: 'Whirling Defense',
      description: 'Spin with blinding speed, creating a defensive vortex that deflects incoming attacks and damages nearby enemies.',
      level: 3,
      spellType: 'ACTION',
      icon: 'ability_warrior_cleave',

      typeConfig: {
        school: 'physical',
        icon: 'ability_warrior_cleave',
        tags: ['defense', 'damage', 'aoe', 'mobility'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'circle',
        aoeParameters: { radius: 5 },
        targetRestrictions: ['enemy']
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 0 },
        actionPoints: 1,
        components: ['somatic'],
        somaticText: 'Spinning defensive vortex'
      },

      resolution: 'DICE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '1d8 + agility',
        elementType: 'physical',
        damageType: 'direct',
        canCrit: true,
        critMultiplier: 2,
        critDiceOnly: false,
        description: 'Whirling strikes that damage nearby enemies'
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 1
      },

      tags: ['defense', 'damage', 'aoe', 'mobility', 'bladedancer']
    },

    {
      id: 'bladedancer_flowing_dodge',
      name: 'Flowing Dodge',
      description: 'Reaction: When targeted by an attack, gain +4 Dodge for 1 round. Stacks with your base Dodge stat. Successful dodges grant +1 Momentum.',
      level: 3,
      spellType: 'REACTION',
      icon: 'ability_rogue_feint',

      typeConfig: {
        school: 'physical',
        icon: 'ability_rogue_feint',
        tags: ['reaction', 'defense', 'mobility', 'counter'],
        castTime: 0,
        castTimeType: 'REACTION'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 0 },
        actionPoints: 0,
        components: ['somatic'],
        somaticText: 'Flow around the attack'
      },

      resolution: 'NONE',
      effectTypes: ['buff'],

      buffConfig: {
        buffType: 'statEnhancement',
        effects: [{
          id: 'flowing_dodge_evasion',
          name: 'Flowing Evasion',
          description: '+4 Dodge for 1 round. Adds to your base Dodge (e.g., 5 base + 4 = 9 Dodge = 9% dodge chance).',
          statModifier: {
            stat: 'dodge',
            magnitude: 4,
            magnitudeType: 'flat'
          }
        }],
        durationValue: 1,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: false,
        canBeDispelled: false
      },

      cooldownConfig: {
        type: 'none'
      },

      tags: ['reaction', 'defense', 'mobility', 'counter', 'bladedancer']
    },

    {
      id: 'bladedancer_stance_mastery',
      name: 'Stance Mastery',
      description: 'Demonstrate mastery of your current stance, pushing it to its absolute limit. Every aspect of your combat form is amplified, making you a true master of that fighting style. Your movements become perfect, your strikes more precise, and your defenses impenetrable.',
      level: 3,
      spellType: 'ACTION',
      icon: 'ability_warrior_innerrage',

      typeConfig: {
        school: 'physical',
        icon: 'ability_warrior_innerrage',
        tags: ['buff', 'stance', 'mastery', 'enhancement'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      resourceCost: {
        resourceTypes: ['momentum'],
        resourceValues: { momentum: 6 },
        actionPoints: 1,
        components: ['verbal'],
        verbalText: 'Master this form!'
      },

      resolution: 'NONE',
      effectTypes: ['buff'],

      buffConfig: {
        buffType: 'statEnhancement',
        effects: [{
          id: 'stance_mastery_power',
          name: 'Stance Mastery',
          description: 'This mastery amplifies every aspect of your active stance, making your combat forms significantly more potent. Every ability, every movement, every strike is enhanced to its absolute peak.',
          statModifier: {
            stat: 'stancePower',
            magnitude: 2,
            magnitudeType: 'flat'
          }
        }],
        durationValue: 2,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: false,
        canBeDispelled: false
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 3
      },

      tags: ['buff', 'stance', 'mastery', 'enhancement', 'bladedancer']
    },

    {
      id: 'bladedancer_precision_strike',
      name: 'Precision Strike',
      description: 'A perfectly aimed strike that targets a vital point, dealing massive damage and applying a bleeding wound.',
      level: 4,
      spellType: 'ACTION',
      icon: 'ability_backstab',

      typeConfig: {
        school: 'physical',
        icon: 'ability_backstab',
        tags: ['melee', 'damage', 'bleed', 'critical', 'flourish_generation'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'melee',
        rangeDistance: 5,
        targetRestrictions: ['enemy']
      },

      resourceCost: {
        resourceTypes: ['mana', 'momentum'],
        resourceValues: { mana: 0, momentum: 6 },
        actionPoints: 1,
        components: ['somatic'],
        somaticText: 'Precise thrust to vital point'
      },

      resolution: 'DICE',
      effectTypes: ['damage', 'debuff'],

      damageConfig: {
        formula: '4d10 + agility',
        elementType: 'physical',
        damageType: 'direct',
        canCrit: true,
        critMultiplier: 2,
        critDiceOnly: false,
        criticalConfig: {
          enabled: true,
          critType: 'dice',
          critMultiplier: 2
        },
        description: 'Massive piercing damage to vital organs'
      },

      debuffConfig: {
        debuffType: 'statusEffect',
        effects: [{
          id: 'bleeding',
          name: 'Bleeding Wound',
          description: 'The target bleeds from a deep wound, taking physical damage over time as blood continues to flow. The wound is severe and continues to cause harm.',
          statusType: 'bleeding',
          level: 'moderate'
        }],
        durationValue: 3,
        durationType: 'rounds',
        durationUnit: 'rounds',
        difficultyClass: 15,
        savingThrowType: 'constitution',
        saveOutcome: 'ends_early'
      },

      cooldownConfig: {
        type: 'none'
      },

      tags: ['melee', 'damage', 'bleed', 'critical', 'flourish_generation', 'bladedancer']
    },

    {
      id: 'bladedancer_dancing_death',
      name: 'Dancing Death',
      description: 'Weave through multiple enemies in a deadly dance, striking each with precision and building unstoppable momentum.',
      level: 4,
      spellType: 'ACTION',
      icon: 'ability_rogue_sprint',

      typeConfig: {
        school: 'physical',
        icon: 'ability_rogue_sprint',
        tags: ['melee', 'damage', 'multi-target', 'momentum_generation', 'mobility'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'multi',
        rangeType: 'melee',
        rangeDistance: 5,
        maxTargets: 3,
        targetRestrictions: ['enemy']
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 0 },
        actionPoints: 2,
        components: ['somatic'],
        somaticText: 'Dance of death through enemies'
      },

      resolution: 'DICE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '2d6 + agility',
        elementType: 'physical',
        damageType: 'direct',
        canCrit: true,
        critMultiplier: 2,
        critDiceOnly: false,
        description: 'Graceful strikes that flow between multiple targets'
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 1
      },

      tags: ['melee', 'damage', 'multi-target', 'momentum_generation', 'mobility', 'bladedancer']
    },

    {
      id: 'bladedancer_shadow_strike',
      name: 'Shadow Strike',
      description: 'Teleport behind your target and strike from the shadows with devastating force, gaining advantage on the attack.',
      level: 5,
      spellType: 'ACTION',
      icon: 'ability_rogue_shadowstrike',

      typeConfig: {
        school: 'physical',
        icon: 'ability_rogue_shadowstrike',
        tags: ['melee', 'damage', 'teleport', 'advantage', 'stance-transition'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 30,
        targetRestrictions: ['enemy']
      },

      resourceCost: {
        resourceTypes: ['mana', 'momentum'],
        resourceValues: { mana: 0, momentum: 5 },
        actionPoints: 1,
        components: ['somatic'],
        somaticText: 'Step through shadows'
      },

      resolution: 'DICE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '3d8 + agility + (stance_shadow_step ? 3d6 : 0)',
        elementType: 'physical',
        damageType: 'direct',
        canCrit: true,
        critMultiplier: 2,
        critDiceOnly: false,
        criticalConfig: {
          enabled: true,
          critType: 'dice',
          critMultiplier: 2.5,
          critDiceOnly: false,
          extraDice: '2d8',
          critEffects: ['teleport', 'advantage'],
          teleportEffect: {
            distance: 10,
            behindTarget: true,
            description: 'Teleport behind target on critical hit'
          }
        },
        triggerConfig: {
          effectTriggers: {
            damage: {
              logicType: 'OR',
              compoundTriggers: [{
                id: 'stance_check',
                category: 'stance',
                name: 'Shadow Step Stance',
                parameters: {
                  stance: 'shadow_step',
                  perspective: 'self'
                }
              }]
            }
          },
          conditionalEffects: {
            damage: {
              isConditional: true,
              defaultEnabled: true,
              baseFormula: '3d8 + agility',
              conditionalFormulas: {
                'stance_shadow_step': '3d8 + agility + 3d6'
              }
            }
          }
        },
        description: 'Devastating strike from the shadows, enhanced when in Shadow Step stance'
      },

      cooldownConfig: {
        type: 'none'
      },

      tags: ['melee', 'damage', 'teleport', 'advantage', 'stance-transition', 'bladedancer']
    },

    {
      id: 'bladedancer_blade_barrier',
      name: 'Blade Barrier',
      description: 'Create a whirling barrier of blades around yourself, damaging enemies that approach and gaining defensive bonuses.',
      level: 5,
      spellType: 'ACTION',
      icon: 'ability_warrior_bladestorm',

      typeConfig: {
        school: 'physical',
        icon: 'ability_warrior_bladestorm',
        tags: ['defense', 'damage', 'aoe', 'concentration'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'circle',
        aoeParameters: { radius: 10 },
        targetRestrictions: ['enemy']
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 0 },
        actionPoints: 1,
        components: ['somatic'],
        somaticText: 'Create whirling blade barrier'
      },

      resolution: 'DICE',
      effectTypes: ['damage', 'buff'],

      damageConfig: {
        formula: '1d6 + agility',
        elementType: 'physical',
        damageType: 'direct',
        description: 'Whirling blades damage enemies that enter the barrier'
      },

      buffConfig: {
        buffType: 'statEnhancement',
        effects: [{
          id: 'blade_barrier_defense',
          name: 'Blade Defense',
          description: 'Enhanced AC from the protective barrier of blades',
          statModifier: {
            stat: 'armor',
            magnitude: 3,
            magnitudeType: 'flat'
          }
        }],
        durationValue: 3,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: true,
        canBeDispelled: false
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 2
      },

      tags: ['defense', 'damage', 'aoe', 'concentration', 'bladedancer']
    },

    {
      id: 'bladedancer_momentum_burst',
      name: 'Momentum Burst',
      description: 'Release all your stored Momentum in a single devastating explosion of speed and power.',
      level: 5,
      spellType: 'ACTION',
      icon: 'ability_warrior_bloodnova',

      typeConfig: {
        school: 'physical',
        icon: 'ability_warrior_bloodnova',
        tags: ['damage', 'aoe', 'momentum_spend', 'burst'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'circle',
        aoeParameters: { radius: 15 },
        targetRestrictions: ['enemy']
      },

      resourceCost: {
        resourceTypes: ['momentum'],
        resourceValues: { momentum: 'all' },
        actionPoints: 1,
        components: ['verbal'],
        verbalText: 'BURST!'
      },

      resolution: 'DICE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: 'momentum_spent * 1d8 + agility',
        elementType: 'physical',
        damageType: 'direct',
        canCrit: true,
        critMultiplier: 2,
        critDiceOnly: false,
        description: 'Explosive release of stored Momentum as raw damage'
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 3
      },

      tags: ['damage', 'aoe', 'momentum_spend', 'burst', 'bladedancer']
    },

    // ========================================
    // LEVEL 6 SPELLS - Master Abilities
    // ========================================

    {
      id: 'bladedancer_vanishing_blade',
      name: 'Vanishing Blade',
      description: 'Fade into invisibility for 1 round and strike with a devastating attack. The invisibility grants advantage on the attack.',
      level: 6,
      spellType: 'ACTION',
      icon: 'ability_vanish',

      typeConfig: {
        school: 'physical',
        icon: 'ability_vanish',
        tags: ['melee', 'damage', 'critical', 'invisibility', 'flourish_generation'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'melee',
        rangeDistance: 5,
        targetRestrictions: ['enemy']
      },

      resourceCost: {
        resourceTypes: ['mana', 'momentum', 'flourish'],
        resourceValues: { mana: 0, momentum: 8, flourish: 2 },
        actionPoints: 2,
        components: ['somatic'],
        somaticText: 'Fade into shadows, strike unseen'
      },

      resolution: 'DICE',
      effectTypes: ['damage', 'buff'],

      damageConfig: {
        formula: '6d10 + agility',
        elementType: 'physical',
        damageType: 'direct',
        canCrit: true,
        critMultiplier: 2,
        critDiceOnly: false,
        criticalConfig: {
          enabled: true,
          critType: 'dice',
          critMultiplier: 2,
          critEffects: ['surprise']
        },
        description: 'Devastating strike with advantage from invisibility'
      },

      buffConfig: {
        buffType: 'statusEffect',
        effects: [{
          id: 'vanishing_invisibility',
          name: 'Shadow Veil',
          description: 'Become invisible for 1 round, gaining advantage on attacks',
          statusType: 'invisibility',
          level: 'major'
        }],
        durationValue: 1,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: false,
        canBeDispelled: true
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 1
      },

      tags: ['melee', 'damage', 'critical', 'invisibility', 'flourish_generation', 'bladedancer']
    },

    {
      id: 'bladedancer_stance_harmony',
      name: 'Stance Harmony',
      description: 'Achieve perfect harmony between all stances, allowing you to draw power from multiple fighting styles simultaneously. You flow seamlessly between forms, combining their strengths into a unified combat style that transcends any single stance. This perfect balance requires intense concentration to maintain.',
      level: 6,
      spellType: 'ACTION',
      icon: 'ability_druid_treeoflife',

      typeConfig: {
        school: 'physical',
        icon: 'ability_druid_treeoflife',
        tags: ['buff', 'stance', 'harmony', 'concentration'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      resourceCost: {
        resourceTypes: ['momentum'],
        resourceValues: { momentum: 10 },
        actionPoints: 1,
        components: ['verbal'],
        verbalText: 'Harmony of forms!'
      },

      resolution: 'NONE',
      effectTypes: ['buff'],

      buffConfig: {
        buffType: 'statEnhancement',
        effects: [{
          id: 'stance_harmony_power',
          name: 'Harmonic Power',
          description: 'Allows you to combine and maintain benefits from multiple stances simultaneously. The perfect harmony between stances creates a unified combat style that transcends any single form. Requires concentration to maintain this delicate balance.',
          statModifier: {
            stat: 'multiStanceBenefits',
            magnitude: 1,
            magnitudeType: 'flat'
          }
        }],
        durationValue: 3,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: true,
        canBeDispelled: false
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 2
      },

      tags: ['buff', 'stance', 'harmony', 'concentration', 'bladedancer']
    },

    {
      id: 'bladedancer_reflecting_blades',
      name: 'Reflecting Blades',
      description: 'Your blades move with such speed and precision that they can deflect projectiles and reflect spells back at attackers.',
      level: 6,
      spellType: 'REACTION',
      icon: 'ability_parry',

      typeConfig: {
        school: 'physical',
        icon: 'ability_parry',
        tags: ['reaction', 'defense', 'reflection', 'counter'],
        castTime: 0,
        castTimeType: 'REACTION'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      resourceCost: {
        resourceTypes: ['momentum'],
        resourceValues: { momentum: 3 },
        actionPoints: 0,
        components: ['somatic'],
        somaticText: 'Deflect with blade precision'
      },

      resolution: 'NONE',
      effectTypes: ['utility'],

      utilityConfig: {
        utilityType: 'reflection',
        selectedEffects: [{
          id: 'spell_reflection',
          name: 'Spell Reflection',
          description: 'Reflect spells and projectiles back at attackers'
        }],
        duration: 1,
        durationUnit: 'rounds',
        concentration: false,
        power: 'major'
      },

      cooldownConfig: {
        type: 'none'
      },

      tags: ['reaction', 'defense', 'reflection', 'counter', 'bladedancer']
    },

    // ========================================
    // LEVEL 7 SPELLS - Ultimate Abilities
    // ========================================

    {
      id: 'bladedancer_flow_master_rapid_transitions',
      name: 'Flow Master - Rapid Transitions',
      description: 'Master the flow between stances, transitioning instantly and gaining enhanced Momentum generation.',
      level: 7,
      spellType: 'PASSIVE',
      icon: 'ability_druid_starfall',

      typeConfig: {
        school: 'physical',
        icon: 'ability_druid_starfall',
        tags: ['passive', 'stance', 'momentum_generation', 'flow_master'],
        toggleable: false
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 0 },
        actionPoints: 0,
        components: []
      },

      resolution: 'NONE',
      effectTypes: ['buff'],

      buffConfig: {
        buffType: 'statEnhancement',
        effects: [{
          id: 'rapid_transitions',
          name: 'Rapid Flow',
          description: 'Gain +1 stance transition cost reduction (minimum cost of 1), allowing you to change stances more efficiently. Additionally, each stance transition generates +1 Momentum, rewarding your fluid combat style.',
          statModifier: {
            stat: 'transitionCostReduction',
            magnitude: 1,
            magnitudeType: 'flat'
          }
        }, {
          id: 'flow_momentum_bonus',
          name: 'Flow Momentum',
          description: 'Gain +1 momentum generation, causing successful attacks to generate +1 additional Momentum. Your flowing combat style builds power with each strike.',
          statModifier: {
            stat: 'momentumGeneration',
            magnitude: 1,
            magnitudeType: 'flat'
          }
        }],
        durationValue: 0,
        durationType: 'permanent',
        durationUnit: 'permanent',
        concentrationRequired: false,
        canBeDispelled: false
      },

      cooldownConfig: {
        type: 'none'
      },

      tags: ['passive', 'stance', 'momentum_generation', 'flow_master', 'bladedancer']
    },

    {
      id: 'bladedancer_flow_combo',
      name: 'Flow Combo',
      description: 'Execute a devastating combo that flows seamlessly between stances, dealing massive damage with perfect timing.',
      level: 7,
      spellType: 'ACTION',
      icon: 'ability_warrior_unrelentingassault',

      typeConfig: {
        school: 'physical',
        icon: 'ability_warrior_unrelentingassault',
        tags: ['melee', 'damage', 'multi-attack', 'combo', 'flow_master'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'melee',
        rangeDistance: 5,
        targetRestrictions: ['enemy']
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 0 },
        actionPoints: 2,
        components: ['somatic'],
        somaticText: 'Flow through deadly combinations'
      },

      resolution: 'DICE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '4d6 + agility * 1.5',
        elementType: 'physical',
        damageType: 'direct',
        canCrit: true,
        critMultiplier: 3,
        critDiceOnly: false,
        description: 'Flawless combo strikes that flow like water'
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 2
      },

      tags: ['melee', 'damage', 'multi-attack', 'combo', 'flow_master', 'bladedancer']
    },

    {
      id: 'bladedancer_momentum_wave',
      name: 'Momentum Wave',
      description: 'Release a wave of pure momentum energy that damages enemies and boosts allies in a wide area.',
      level: 7,
      spellType: 'ACTION',
      icon: 'ability_warrior_shockwave',

      typeConfig: {
        school: 'physical',
        icon: 'ability_warrior_shockwave',
        tags: ['damage', 'buff', 'aoe', 'momentum_spend'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'circle',
        aoeParameters: { radius: 20 },
        targetRestrictions: ['all']
      },

      resourceCost: {
        resourceTypes: ['momentum'],
        resourceValues: { momentum: 15 },
        actionPoints: 2,
        components: ['verbal'],
        verbalText: 'WAVE OF POWER!'
      },

      resolution: 'DICE',
      effectTypes: ['damage', 'buff'],

      damageConfig: {
        formula: 'momentum_spent / 2 + agility',
        elementType: 'force',
        damageType: 'direct',
        description: 'Wave of momentum energy that damages enemies'
      },

      buffConfig: {
        buffType: 'statEnhancement',
        effects: [{
          id: 'momentum_wave_boost',
          name: 'Momentum Surge',
          description: 'Allies gain momentum and speed from the wave',
          statModifier: {
            stat: 'momentumGeneration',
            magnitude: 5,
            magnitudeType: 'flat'
          }
        }],
        durationValue: 2,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: false,
        canBeDispelled: false
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 3
      },

      tags: ['damage', 'buff', 'aoe', 'momentum_spend', 'bladedancer']
    },

    // ========================================
    // LEVEL 8 SPELLS - Legendary Abilities
    // ========================================

    {
      id: 'bladedancer_stance_mastery_dancing_blade',
      name: 'Stance Mastery - Dancing Blade',
      description: 'Achieve true mastery of all stances, allowing transitions to any stance and enhanced abilities.',
      level: 8,
      spellType: 'PASSIVE',
      icon: 'ability_warrior_bladestorm',

      typeConfig: {
        school: 'physical',
        icon: 'ability_warrior_bladestorm',
        tags: ['passive', 'stance', 'mastery', 'universal'],
        toggleable: false
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 0 },
        actionPoints: 0,
        components: []
      },

      resolution: 'NONE',
      effectTypes: ['buff'],

      buffConfig: {
        buffType: 'statEnhancement',
        effects: [{
          id: 'universal_transitions',
          name: 'Universal Flow',
          description: 'Can transition to any stance from Dancing Blade hub for 4 Momentum',
          statModifier: {
            stat: 'universalTransitions',
            magnitude: 1,
            magnitudeType: 'flat'
          }
        }, {
          id: 'stance_mastery',
          name: 'Stance Mastery',
          description: 'All stance abilities are enhanced and cost 1 less Momentum (minimum 1)',
          statModifier: {
            stat: 'stanceAbilityCostReduction',
            magnitude: 1,
            magnitudeType: 'flat'
          }
        }],
        durationValue: 0,
        durationType: 'permanent',
        durationUnit: 'permanent',
        concentrationRequired: false,
        canBeDispelled: false
      },

      cooldownConfig: {
        type: 'none'
      },

      tags: ['passive', 'stance', 'mastery', 'universal', 'bladedancer']
    },

    {
      id: 'bladedancer_blade_dance',
      name: 'Blade Dance',
      description: 'Perform an intricate dance of blades, teleporting between enemies and striking them with deadly precision.',
      level: 8,
      spellType: 'ACTION',
      icon: 'ability_rogue_fleetfooted',

      typeConfig: {
        school: 'physical',
        icon: 'ability_rogue_fleetfooted',
        tags: ['damage', 'teleport', 'multi-target', 'mobility'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'multi',
        rangeType: 'ranged',
        rangeDistance: 30,
        maxTargets: 4,
        targetRestrictions: ['enemy']
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 0 },
        actionPoints: 2,
        components: ['somatic'],
        somaticText: 'Dance through enemies like the wind'
      },

      resolution: 'DICE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '3d6 + agility',
        elementType: 'physical',
        damageType: 'direct',
        canCrit: true,
        critMultiplier: 2,
        critDiceOnly: false,
        description: 'Graceful strikes that teleport between targets'
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 2
      },

      tags: ['damage', 'teleport', 'multi-target', 'mobility', 'bladedancer']
    },

    {
      id: 'bladedancer_stance_echo',
      name: 'Stance Echo',
      description: 'Your mastery creates echoes of your stance transitions, allowing you to maintain benefits from recently used stances.',
      level: 8,
      spellType: 'PASSIVE',
      icon: 'ability_warrior_secondwind',

      typeConfig: {
        school: 'physical',
        icon: 'ability_warrior_secondwind',
        tags: ['passive', 'stance', 'echo', 'mastery'],
        toggleable: false
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 0 },
        actionPoints: 0,
        components: []
      },

      resolution: 'NONE',
      effectTypes: ['buff'],

      buffConfig: {
        buffType: 'statEnhancement',
        effects: [{
          id: 'stance_echo_benefits',
          name: 'Echo Benefits',
          description: 'Gain +2 to multi-stance echo, allowing you to retain partial benefits from your last 2 stances you used. This passive ability lets you maintain a lingering connection to recently used stances, creating a seamless flow between your combat forms.',
          statModifier: {
            stat: 'multiStanceEcho',
            magnitude: 2,
            magnitudeType: 'flat'
          }
        }],
        durationValue: 0,
        durationType: 'permanent',
        durationUnit: 'permanent',
        concentrationRequired: false,
        canBeDispelled: false
      },

      cooldownConfig: {
        type: 'none'
      },

      tags: ['passive', 'stance', 'echo', 'mastery', 'bladedancer']
    },

    // ========================================
    // LEVEL 9 SPELLS - Mythic Abilities
    // ========================================

    {
      id: 'bladedancer_flourish_ultimate_thousand_cuts',
      name: 'Flourish Ultimate - Thousand Cuts',
      description: 'Expend all your Flourish tokens to unleash a devastating storm of attacks through all 6 stances simultaneously.',
      level: 9,
      spellType: 'ACTION',
      icon: 'ability_warrior_savageblow',

      typeConfig: {
        school: 'physical',
        icon: 'ability_warrior_savageblow',
        tags: ['aoe', 'damage', 'multi-attack', 'flourish_spend', 'ultimate'],
        castTime: 2,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'circle',
        aoeParameters: { radius: 15 },
        targetRestrictions: ['enemy']
      },

      resourceCost: {
        resourceTypes: ['mana', 'flourish'],
        resourceValues: { mana: 0, flourish: 5 },
        actionPoints: 3,
        components: ['verbal', 'somatic'],
        verbalText: 'BY THE SIX WINDS!',
        somaticText: 'Dance through all forms'
      },

      resolution: 'DICE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '6d10 + agility * 2',
        elementType: 'physical',
        damageType: 'direct',
        canCrit: true,
        critMultiplier: 2,
        critDiceOnly: false,
        criticalConfig: {
          enabled: true,
          critType: 'dice',
          critMultiplier: 2
        },
        description: 'Six devastating attacks, one from each stance, enhanced by your mastery'
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 3
      },

      tags: ['aoe', 'damage', 'multi-attack', 'flourish_spend', 'ultimate', 'bladedancer']
    },

    {
      id: 'bladedancer_flourish_sixfold_strike',
      name: 'Flourish - Sixfold Strike',
      description: 'Spend Flourish tokens to perform a single devastating attack that embodies the power of all six stances.',
      level: 9,
      spellType: 'ACTION',
      icon: 'ability_warrior_endlessrage',

      typeConfig: {
        school: 'physical',
        icon: 'ability_warrior_endlessrage',
        tags: ['damage', 'critical', 'flourish_spend', 'stance_power'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'melee',
        rangeDistance: 5,
        targetRestrictions: ['enemy']
      },

      resourceCost: {
        resourceTypes: ['mana', 'flourish'],
        resourceValues: { mana: 0, flourish: 3 },
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'SIX WINDS UNITE!',
        somaticText: 'Channel all stances into one strike'
      },

      resolution: 'DICE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '6d8 + agility * 2',
        elementType: 'force',
        damageType: 'direct',
        canCrit: true,
        critMultiplier: 2,
        critDiceOnly: false,
        description: 'A devastating strike channeling the essence of all six stances'
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 2
      },

      tags: ['damage', 'critical', 'flourish_spend', 'stance_power', 'bladedancer']
    },

    {
      id: 'bladedancer_perfect_harmony',
      name: 'Perfect Harmony',
      description: 'Achieve perfect synchronization with all combat stances, gaining enhanced abilities and flawless transitions.',
      level: 9,
      spellType: 'PASSIVE',
      icon: 'ability_druid_enrage',

      typeConfig: {
        school: 'physical',
        icon: 'ability_druid_enrage',
        tags: ['passive', 'stance', 'harmony', 'mastery'],
        toggleable: false
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 0 },
        actionPoints: 0,
        components: []
      },

      resolution: 'NONE',
      effectTypes: ['buff'],

      buffConfig: {
        buffType: 'statEnhancement',
        effects: [{
          id: 'perfect_harmony_mastery',
          name: 'Harmonic Mastery',
          description: 'Stance transitions cost 1 Momentum (instead of 2-4), all stance abilities deal +1d6 damage',
          statModifier: {
            stat: 'perfectStanceMastery',
            magnitude: 1,
            magnitudeType: 'flat'
          }
        }],
        durationValue: 0,
        durationType: 'permanent',
        durationUnit: 'permanent',
        concentrationRequired: false,
        canBeDispelled: false
      },

      cooldownConfig: {
        type: 'none'
      },

      tags: ['passive', 'stance', 'harmony', 'mastery', 'bladedancer']
    },

    // ========================================
    // LEVEL 10 SPELLS - Transcendent Abilities
    // ========================================

    {
      id: 'bladedancer_dance_of_the_six_winds',
      name: 'Dance of the Six Winds',
      description: 'Enter a state of perfect martial focus, embodying all six stances simultaneously for a brief but devastating duration.',
      level: 10,
      spellType: 'ACTION',
      icon: 'ability_druid_earthandsky',

      typeConfig: {
        school: 'physical',
        icon: 'ability_druid_earthandsky',
        tags: ['transformation', 'ultimate', 'stance', 'transcendent'],
        castTime: 3,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      resourceCost: {
        resourceTypes: ['mana', 'momentum', 'flourish'],
        resourceValues: { mana: 0, momentum: 20, flourish: 5 },
        actionPoints: 4,
        components: ['verbal', 'somatic', 'material'],
        verbalText: 'I BECOME THE STORM!',
        somaticText: 'Unleash the dance of all forms',
        materialText: 'A blade infused with the essence of all six stances'
      },

      resolution: 'NONE',
      effectTypes: ['transformation'],

      transformationConfig: {
        transformationType: 'physical',
        targetType: 'self',
        duration: 1,
        durationUnit: 'minutes',
        power: 'major',
        newForm: 'Dance of the Six Winds',
        description: 'Enter a state of perfect martial focus, embodying all six stances simultaneously.',
        concentration: true,
        grantedAbilities: [
          {
            id: 'six_winds_passives',
            name: 'Six Winds Embodiment',
            description: 'Gain all passive effects from all six stances simultaneously'
          },
          {
            id: 'instant_transitions',
            name: 'Instant Transitions',
            description: 'Switch between any stance instantly without Momentum cost'
          },
          {
            id: 'doubled_momentum',
            name: 'Endless Flow',
            description: 'Momentum generation is doubled for the duration, allowing you to build combat momentum twice as fast with each successful action.'
          }
        ]
      },

      cooldownConfig: {
        type: 'long_rest'
      },

      tags: ['transformation', 'ultimate', 'stance', 'transcendent', 'bladedancer']
    },

    {
      id: 'bladedancer_zenith_blade_mastery',
      name: 'Zenith Blade Mastery',
      description: 'Achieve the ultimate pinnacle of blade mastery, where every strike becomes a work of art and every stance a perfect expression of combat.',
      level: 10,
      spellType: 'PASSIVE',
      icon: 'ability_warrior_bladestorm',

      typeConfig: {
        school: 'physical',
        icon: 'ability_warrior_bladestorm',
        tags: ['passive', 'mastery', 'ultimate', 'stance'],
        toggleable: false
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 0 },
        actionPoints: 0,
        components: []
      },

      resolution: 'NONE',
      effectTypes: ['buff'],

      buffConfig: {
        buffType: 'statEnhancement',
        effects: [{
          id: 'zenith_mastery',
          name: 'Zenith Mastery',
          description: '+2 to all attack rolls, +1d8 damage to all stance abilities, +2 Momentum generated per action',
          statModifier: {
            stat: 'ultimateBladeMastery',
            magnitude: 1,
            magnitudeType: 'flat'
          }
        }],
        durationValue: 0,
        durationType: 'permanent',
        durationUnit: 'permanent',
        concentrationRequired: false,
        canBeDispelled: false
      },

      cooldownConfig: {
        type: 'none'
      },

      tags: ['passive', 'mastery', 'ultimate', 'stance', 'bladedancer']
    }
  ],

  // Spell Pools by Level
  spellPools: {
    1: [
      'bladedancer_momentum_strike',
      'bladedancer_stance_shift',
      'bladedancer_defensive_flow',
      'bladedancer_quick_step'
    ],
    2: [
      'bladedancer_flowing_strike',
      'bladedancer_dancing_blade',
      'bladedancer_stance_dance',
      'bladedancer_blade_flurry'
    ],
    3: [
      'bladedancer_perfect_riposte',
      'bladedancer_whirling_defense',
      'bladedancer_flowing_dodge',
      'bladedancer_stance_mastery'
    ],
    4: [
      'bladedancer_chain_dance',
      'bladedancer_precision_strike',
      'bladedancer_dancing_death'
    ],
    5: [
      'bladedancer_shadow_strike',
      'bladedancer_blade_barrier',
      'bladedancer_momentum_burst'
    ],
    6: [
      'bladedancer_vanishing_blade',
      'bladedancer_stance_harmony',
      'bladedancer_reflecting_blades'
    ],
    7: [
      'bladedancer_flow_master_rapid_transitions',
      'bladedancer_flow_combo',
      'bladedancer_momentum_wave'
    ],
    8: [
      'bladedancer_stance_mastery_dancing_blade',
      'bladedancer_blade_dance',
      'bladedancer_stance_echo'
    ],
    9: [
      'bladedancer_flourish_ultimate_thousand_cuts',
      'bladedancer_flourish_sixfold_strike',
      'bladedancer_perfect_harmony'
    ],
    10: [
      'bladedancer_transcendent_dance_of_the_six_winds',
      'bladedancer_zenith_blade_mastery'
    ]
  },
};

export default BLADEDANCER_DATA;

