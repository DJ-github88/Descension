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

  // Example Spells - organized by specialization
  exampleSpells: [
    // ===== BLADE DANCER SPECIALIZATION =====
    {
      id: 'bd_flowing_strike',
      name: 'Flowing Strike',
      description: 'Attack while transitioning between stances, dealing bonus damage based on your current Momentum.',
      spellType: 'ACTION',
      icon: 'ability_rogue_slicedice',
      school: 'Physical',
      level: 2,
      specialization: 'blade-dancer',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'melee',
        rangeDistance: 5
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        momentum: 3,
        components: ['somatic'],
        somaticText: 'Fluid strike while shifting stance'
      },

      resolution: 'ATTACK_ROLL',

      damageConfig: {
        formula: '2d6',
        modifier: 'AGILITY',
        damageType: 'slashing',
        bonusDamage: {
          condition: 'per_momentum_point',
          amount: '+1d4',
          description: '+1d4 damage per Momentum point you have'
        }
      },

      effects: {
        damage: {
          base: '2d6 + AGI',
          type: 'slashing',
          scaling: '+1d4 per Momentum point'
        },
        stanceTransition: {
          enabled: true,
          description: 'After this attack, you may transition to a connected stance for free'
        }
      },

      specialMechanics: {
        bladeDancerBonus: {
          enabled: true,
          effect: 'Flow Masters can transition to any stance (not just connected) after this attack'
        },
        momentumScaling: {
          description: 'Damage increases with current Momentum, rewarding high resource management'
        }
      },

      tags: ['melee', 'damage', 'stance-transition', 'blade-dancer']
    },

    {
      id: 'bd_chain_dance',
      name: 'Chain Dance',
      description: 'Rapidly transition through multiple stances, attacking from each one in a devastating combo.',
      spellType: 'ACTION',
      icon: 'ability_warrior_bladestorm',
      school: 'Physical',
      level: 5,
      specialization: 'blade-dancer',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'special',
        rangeType: 'melee',
        rangeDistance: 5,
        description: 'Can target different enemies with each attack'
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        momentum: 8,
        flourish: 2,
        components: ['somatic'],
        somaticText: 'Flow through multiple combat forms'
      },

      resolution: 'ATTACK_ROLL',

      damageConfig: {
        formula: '3d8',
        modifier: 'AGILITY',
        damageType: 'slashing',
        attackCount: 3
      },

      effects: {
        multiAttack: {
          count: 3,
          damage: '3d8 + AGI each',
          type: 'slashing',
          description: 'Make 3 attacks, each from a different stance'
        },
        stanceFlow: {
          description: 'Transition through 3 different stances during this ability, ending in your choice of stance'
        }
      },

      specialMechanics: {
        stanceRequirement: {
          description: 'Must transition through 3 different stances. Each attack uses that stance\'s passive bonuses.'
        },
        flourishGeneration: {
          enabled: true,
          amount: 1,
          description: 'This is a signature Flow Master move - generates 1 Flourish when used'
        }
      },

      tags: ['melee', 'damage', 'multi-attack', 'stance-transition', 'blade-dancer', 'signature']
    },

    // ===== DUELIST SPECIALIZATION =====
    {
      id: 'bd_riposte',
      name: 'Perfect Riposte',
      description: 'Parry an incoming attack and counter with a devastating strike. Generates extra Momentum on success.',
      spellType: 'REACTION',
      icon: 'ability_parry',
      school: 'Physical',
      level: 3,
      specialization: 'duelist',

      typeConfig: {
        castTime: 0,
        castTimeType: 'REACTION',
        trigger: 'When an enemy attacks you'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'melee',
        rangeDistance: 5,
        description: 'The attacker'
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        momentum: 4,
        components: ['somatic'],
        somaticText: 'Deflect and counter in one motion'
      },

      resolution: 'SAVING_THROW',
      savingThrow: {
        ability: 'dexterity',
        dc: 15,
        onSuccess: 'Attack is parried, riposte deals full damage',
        onFailure: 'Attack hits normally, no riposte'
      },

      damageConfig: {
        formula: '3d8',
        modifier: 'AGILITY',
        damageType: 'piercing'
      },

      effects: {
        parry: {
          type: 'negate_attack',
          description: 'If successful, the attack is completely negated'
        },
        riposte: {
          damage: '3d8 + AGI',
          type: 'piercing',
          description: 'Counter-attack immediately after parrying'
        },
        momentumGain: {
          amount: 3,
          description: 'Gain 3 Momentum on successful parry'
        }
      },

      specialMechanics: {
        duelistBonus: {
          enabled: true,
          effect: 'Duelists gain 4 Momentum instead of 3, and riposte damage is doubled (6d8 + AGI)'
        },
        stanceRequirement: {
          stance: 'Rooted Stone',
          description: 'Most effective in Rooted Stone stance (+2 to parry DC)'
        }
      },

      tags: ['reaction', 'parry', 'counter', 'duelist']
    },

    {
      id: 'bd_precision_strike',
      name: 'Precision Strike',
      description: 'A perfectly aimed strike that targets a vital point, dealing massive damage and applying a bleeding wound.',
      spellType: 'ACTION',
      icon: 'ability_backstab',
      school: 'Physical',
      level: 4,
      specialization: 'duelist',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'melee',
        rangeDistance: 5
      },

      durationConfig: {
        durationType: 'instant',
        dotDuration: '3 rounds'
      },

      resourceCost: {
        momentum: 6,
        components: ['somatic'],
        somaticText: 'Precise thrust to vital point'
      },

      resolution: 'ATTACK_ROLL',

      damageConfig: {
        formula: '4d10',
        modifier: 'AGILITY',
        damageType: 'piercing'
      },

      debuffConfig: {
        effects: [
          'Target bleeds for 2d6 damage at start of each turn for 3 rounds',
          'Target has disadvantage on Constitution saves while bleeding'
        ]
      },

      effects: {
        damage: {
          instant: {
            formula: '4d10 + AGI',
            type: 'piercing'
          },
          overTime: {
            formula: '2d6',
            type: 'slashing',
            duration: 3,
            frequency: 'start_of_turn'
          }
        },
        debuff: {
          type: 'bleeding',
          duration: 3,
          effect: 'Disadvantage on Constitution saves'
        }
      },

      specialMechanics: {
        duelistBonus: {
          enabled: true,
          effect: 'Duelists have enhanced critical hit chance (crit on max damage die -2, -1, or max)'
        },
        stanceBonus: {
          stance: 'Striking Serpent',
          effect: 'In Striking Serpent stance, this attack automatically critically hits'
        },
        flourishGeneration: {
          enabled: true,
          amount: 1,
          description: 'This is a signature Duelist move - generates 1 Flourish when used'
        }
      },

      tags: ['melee', 'damage', 'bleed', 'critical', 'duelist', 'signature']
    },

    // ===== SHADOW DANCER SPECIALIZATION =====
    {
      id: 'bd_shadow_strike',
      name: 'Shadow Strike',
      description: 'Teleport behind your target and strike from the shadows with devastating force.',
      spellType: 'ACTION',
      icon: 'ability_rogue_shadowstrike',
      school: 'Physical',
      level: 3,
      specialization: 'shadow-dancer',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 30,
        description: 'Teleport to target, then attack'
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        momentum: 5,
        components: ['somatic'],
        somaticText: 'Step through shadows'
      },

      resolution: 'ATTACK_ROLL',

      damageConfig: {
        formula: '3d8',
        modifier: 'AGILITY',
        damageType: 'slashing',
        bonusDamage: {
          condition: 'from_stealth',
          amount: '+3d6',
          description: '+3d6 if attacking from Shadow Step stance'
        }
      },

      effects: {
        teleport: {
          range: 30,
          position: 'behind_target',
          description: 'Teleport to a space behind the target'
        },
        damage: {
          base: '3d8 + AGI',
          type: 'slashing',
          bonus: '+3d6 if in Shadow Step stance'
        },
        advantage: {
          condition: 'first_attack',
          description: 'This attack has advantage'
        }
      },

      specialMechanics: {
        shadowDancerBonus: {
          enabled: true,
          effect: 'Shadow Dancers can use this from any stance, automatically entering Shadow Step stance after teleporting'
        },
        stanceTransition: {
          automatic: true,
          stance: 'Shadow Step',
          description: 'Automatically enter Shadow Step stance after using this ability'
        },
        noOpportunityAttack: {
          enabled: true,
          description: 'This teleport does not provoke opportunity attacks'
        }
      },

      tags: ['melee', 'damage', 'teleport', 'shadow-dancer']
    },

    {
      id: 'bd_vanishing_blade',
      name: 'Vanishing Blade',
      description: 'Become invisible and strike with a guaranteed critical hit. The ultimate assassin technique.',
      spellType: 'ACTION',
      icon: 'ability_vanish',
      school: 'Physical',
      level: 6,
      specialization: 'shadow-dancer',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'melee',
        rangeDistance: 5
      },

      durationConfig: {
        durationType: 'instant',
        invisibilityDuration: '1 round'
      },

      resourceCost: {
        momentum: 8,
        flourish: 2,
        components: ['somatic'],
        somaticText: 'Fade into shadows, strike unseen'
      },

      resolution: 'AUTOMATIC',

      damageConfig: {
        formula: '6d10',
        modifier: 'AGILITY',
        damageType: 'slashing',
        guaranteedCritical: true
      },

      effects: {
        invisibility: {
          duration: 1,
          description: 'Become invisible for 1 round'
        },
        damage: {
          formula: '6d10 + AGI',
          type: 'slashing',
          critical: 'Automatic critical hit (12d10 + AGI)'
        },
        surprise: {
          effect: 'Target cannot react to this attack'
        }
      },

      specialMechanics: {
        guaranteedCritical: {
          enabled: true,
          description: 'This attack is always a critical hit, dealing double damage dice'
        },
        shadowDancerBonus: {
          enabled: true,
          effect: 'Shadow Dancers deal an additional +4d6 damage and remain invisible for 2 rounds instead of 1'
        },
        stanceRequirement: {
          stance: 'Shadow Step',
          description: 'Must be in Shadow Step stance to use this ability'
        },
        flourishGeneration: {
          enabled: true,
          amount: 1,
          description: 'This is a signature Shadow Dancer move - generates 1 Flourish when used'
        }
      },

      tags: ['melee', 'damage', 'critical', 'invisibility', 'shadow-dancer', 'signature']
    },

    // ===== UNIVERSAL ABILITIES =====
    {
      id: 'bd_stance_shift',
      name: 'Stance Shift',
      description: 'Rapidly change your combat stance to adapt to the situation. Each stance provides unique benefits.',
      spellType: 'ACTION',
      icon: 'ability_warrior_defensivestance',
      school: 'Physical',
      level: 1,
      specialization: 'universal',

      typeConfig: {
        castTime: 0,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      durationConfig: {
        durationType: 'until_changed'
      },

      resourceCost: {
        momentum: 'variable',
        description: '2-4 Momentum depending on stance transition (see stance network table)'
      },

      resolution: 'AUTOMATIC',

      effects: {
        stanceChange: {
          description: 'Change to a connected stance in the stance network',
          restrictions: 'Can only transition to connected stances (see network table)'
        },
        passiveGain: {
          description: 'Gain the passive effects of the new stance immediately'
        }
      },

      specialMechanics: {
        stanceNetwork: {
          description: 'Must follow the stance network connections. Dancing Blade can transition to any stance for 4 Momentum.'
        },
        bladeDancerBonus: {
          enabled: true,
          effect: 'Flow Masters pay 1 less Momentum for all transitions (minimum 1)'
        },
        shadowDancerBonus: {
          enabled: true,
          effect: 'Shadow Dancers can enter Shadow Step from any stance for 3 Momentum'
        }
      },

      tags: ['utility', 'stance', 'universal']
    },

    {
      id: 'bd_momentum_strike',
      name: 'Momentum Strike',
      description: 'A basic attack that generates Momentum, building your combat rhythm.',
      spellType: 'ACTION',
      icon: 'inv_sword_04',
      school: 'Physical',
      level: 1,
      specialization: 'universal',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'melee',
        rangeDistance: 5
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        momentum: 0,
        components: ['somatic'],
        somaticText: 'Swift strike'
      },

      resolution: 'ATTACK_ROLL',

      damageConfig: {
        formula: '1d8',
        modifier: 'AGILITY',
        damageType: 'slashing'
      },

      effects: {
        damage: {
          formula: '1d8 + AGI',
          type: 'slashing'
        },
        momentumGeneration: {
          onHit: 1,
          onCrit: 2,
          description: 'Generate 1 Momentum on hit, 2 on critical hit'
        }
      },

      specialMechanics: {
        basicAttack: {
          description: 'This is the Bladedancer\'s basic attack for building Momentum'
        },
        bladeDancerBonus: {
          enabled: true,
          effect: 'Flow Masters generate +1 additional Momentum from this attack'
        },
        stanceModifiers: {
          description: 'This attack benefits from your current stance\'s passive effects'
        }
      },

      tags: ['melee', 'damage', 'momentum-generation', 'universal']
    }
  ]
};

export default BLADEDANCER_DATA;

