/**
 * False Prophet Class Data
 * 
 * Complete class information for the False Prophet - a chaotic spellcaster
 * who channels eldritch energies and madness to warp reality and minds.
 */

export const FALSE_PROPHET_DATA = {
  id: 'false_prophet',
  name: 'False Prophet',
  icon: 'fas fa-eye',
  role: 'Caster/Controller',

  // Overview section
  overview: {
    title: 'The False Prophet',
    subtitle: 'Herald of Madness and Eldritch Truth',
    
    description: `The False Prophet channels chaotic energies from the eldritch void, accumulating Madness Points through their reality-bending spells. This madness empowers their shadow damage but threatens to consume them entirely. Walking the razor's edge between power and insanity, False Prophets tempt fate with forbidden knowledge and risk catastrophic consequences.`,
    
    roleplayIdentity: {
      title: 'Roleplay Identity',
      content: `False Prophets are conduits for truths too terrible for mortal minds to comprehend. They have glimpsed the void beyond reality and returned changed—their sanity fractured, their perception warped, but their power undeniable. Whether they sought this knowledge willingly or were cursed with unwanted visions, they now walk between worlds.

Their madness manifests physically: eyes that see too much, whispers only they can hear, reality flickering at the edges of their vision. At high Madness levels, the void bleeds through—shadows writhe unnaturally, impossible geometries appear, and the air itself seems to scream.

Common False Prophet archetypes include:
- **The Cursed Oracle**: Burdened with visions they never wanted
- **The Forbidden Scholar**: Sought knowledge mortals were meant to ignore
- **The Void-Touched**: Survived contact with eldritch entities
- **The Mad Preacher**: Spreads dark truths disguised as salvation
- **The Reality Breaker**: Believes sanity is a cage to be shattered

False Prophets understand that madness and power are inseparable. Each spell brings them closer to the abyss, but also closer to godhood. The question is: will they master the madness, or will it master them?`
    },
    
    combatRole: {
      title: 'Combat Role',
      content: `The False Prophet is a high-risk, high-reward caster/controller that excels at:

**Psychic Damage**: Shattering minds with eldritch horrors and maddening visions
**Mind Control**: Bending wills, causing confusion, and turning enemies against each other
**Shadow Magic**: Dealing escalating shadow damage as Madness Points accumulate
**Reality Manipulation**: Creating chaotic zones and unpredictable effects

**Strengths**:
- Extremely high damage potential with accumulated Madness
- Powerful crowd control and debuff capabilities
- Can turn enemies into temporary allies
- Unpredictable abilities that enemies can't plan for
- Strong against single powerful enemies (mind control)

**Weaknesses**:
- Constant risk of Insanity Convulsion at 20 Madness
- Randomness can backfire in critical moments
- Fragile and vulnerable to burst damage
- Requires careful Madness management
- Less effective against mindless enemies
- Self-inflicting effects from Insanity Convulsions

The False Prophet thrives on chaos and risk, rewarding players who can balance aggression with self-preservation.`
    },
    
    playstyle: {
      title: 'Playstyle & Strategy',
      content: `Playing a False Prophet is about dancing on the edge of madness. Key considerations:

**Building Madness**:
- Madness-generating spells roll dice (1d4, 1d6, 1d8) to determine points gained
- Each Madness Point increases shadow damage by +1
- Randomness means you can't predict exact Madness levels
- Some spells generate more Madness but have stronger effects

**Madness Level Strategy**:
- **0-5 Points (Safe Zone)**: Low damage bonus, build freely
- **6-11 Points (Temptation Zone)**: Access to Veil of Shadows (6), Eldritch Vision (9)
- **12-19 Points (Danger Zone)**: Apocalyptic Revelation available but high risk
- **20 Points (Insanity)**: Automatic Convulsion, roll on table for chaotic effect

**Temptation Abilities**:
- **6 Madness**: Veil of Shadows (invisibility) - adds 1d4 Madness
- **9 Madness**: Eldritch Vision (see through walls) - adds 1d6 Madness
- **12 Madness**: Apocalyptic Revelation (8d6 AoE) - adds 2d6 Madness
- Using these abilities risks pushing you into Insanity Convulsion

**Spending Madness**:
- Madness-spending spells consume rolled amounts (1d4, 1d6, 1d8)
- Use spending spells to stay below 20 Madness threshold
- Strategic spending can keep you in the 12-19 "sweet spot"
- Some spending spells provide healing, buffs, or powerful attacks

**Insanity Convulsion Management**:
- At 20 Madness, roll 1d6 on Insanity Convulsion Table
- Effects range from AoE damage to stuns to random teleportation
- All effects are self-inflicting or chaotic
- May trigger Short-Term Madness (1d4 rounds of impairment)
- After Convulsion, Madness resets to 0

**Specialization Synergies**:
- **Voidcaller**: Aggressive madness generation, maximum damage output
- **Deceiver**: Mind control focus, uses madness for manipulation
- **Cultist**: Balanced corruption, sustained DoT and curse effects

**Team Dynamics**:
- Warn allies when approaching high Madness (Convulsions can hit friendlies)
- Coordinate mind control with team to maximize controlled enemy damage
- Use chaos zones strategically to control battlefield
- Synergizes with classes that can protect fragile casters`
    },

    immersiveCombatExample: {
      title: 'Combat Example: Dancing on the Edge of Madness',
      content: `**The Setup**: You're a False Prophet (Voidcaller specialization) facing a group of bandits (4 bandits + 1 bandit captain). Your party is with you, but you're the primary damage dealer. Starting Madness: 0. Starting Mana: 40/50. Your goal: Build Madness for maximum damage, use Temptation abilities strategically, and DON'T hit 20 Madness unless you're ready for chaos.

**Starting State**: Madness: 0/20 | Shadow Damage Bonus: +0 | Mana: 40/50 | HP: 60/60

**Turn 1 - Building Madness (Madness: 0 → 5)**

*The bandits charge. You raise your hands, void energy crackling between your fingers. Time to embrace the darkness.*

**Your Action**: Cast "Whispers of the Void" on Bandit #1 (6 mana, generates 1d6 Madness)
**Madness Roll**: 1d6 → [5] → +5 Madness Points
**Madness**: 0 + 5 = **5 Madness**
**Shadow Damage Bonus**: +5 to all shadow damage
**Spell Damage**: 3d6 shadow + 5 (Madness bonus) → [4, 5, 6] + 5 = 20 damage
**Result**: Bandit #1 takes 20 damage, frightened for 2 rounds

*Dark whispers fill the bandit's mind. He screams, clutching his head. You feel the madness building—a sweet, intoxicating power.*

**Mana**: 40 - 6 = 34/50
**Current State**: Madness: 5/20 | Shadow Damage Bonus: +5

**Turn 2 - Approaching the Threshold (Madness: 5 → 11)**

*The bandits are wary now. The captain barks orders. You smile. They have no idea what's coming.*

**Your Action**: Cast "Eldritch Bolt" on Bandit #2 (5 mana, generates 1d6 Madness)
**Madness Roll**: 1d6 → [6] → +6 Madness Points
**Madness**: 5 + 6 = **11 Madness**
**Shadow Damage Bonus**: +11 to all shadow damage
**Spell Damage**: 2d8 shadow + 11 (Madness bonus) → [7, 6] + 11 = 24 damage!
**Result**: Bandit #2 takes 24 damage, DEAD (overkill)

*The bolt of void energy obliterates the bandit. Your vision swims. The world tilts. You're at 11 Madness—past the 9 threshold. Eldritch Vision is now available.*

**Mana**: 34 - 5 = 29/50
**Temptation Unlocked**: Eldritch Vision (9+ Madness) - See through walls, detect invisible, +1d6 Madness

**Current State**: Madness: 11/20 | Shadow Damage Bonus: +11 | Eldritch Vision Available

**Turn 3 - The Temptation (Madness: 11 → 16)**

*The bandit captain ducks behind cover. You can't see him. But you COULD see him... if you used Eldritch Vision. It would cost 1d6 Madness. You're at 11. If you roll high, you could hit 17-18. Close to the edge. But the power...*

**Your Decision**: Use Eldritch Vision (adds 1d6 Madness)
**Madness Roll**: 1d6 → [5] → +5 Madness Points
**Madness**: 11 + 5 = **16 Madness**
**Shadow Damage Bonus**: +16 to all shadow damage

*Your eyes turn black. The walls become transparent. You see EVERYTHING. The captain hiding behind the crate. The bandit sneaking up behind your ally. The rats in the walls. The worms in the earth. TOO MUCH. But you can use this.*

**Your Action**: Cast "Shadow Bolt" at bandit captain (behind cover, but you can see him!) (5 mana, no Madness generation)
**Spell Damage**: 3d6 shadow + 16 (Madness bonus) → [5, 6, 4] + 16 = 31 damage!
**Result**: Bandit captain takes 31 damage, severely wounded (down to 15 HP)

*The captain screams as the bolt phases through the crate and strikes him. "How did you—?!" You don't answer. You're too busy fighting the voices in your head.*

**Mana**: 29 - 5 = 24/50
**Current State**: Madness: 16/20 | Shadow Damage Bonus: +16 | **DANGER ZONE**

**Turn 4 - The Decision Point (Madness: 16 → 19)**

*You're at 16 Madness. Four points from Insanity Convulsion. You have two choices:*
*1. Spend Madness with a spending spell to drop back to safety*
*2. Keep building for maximum damage and risk hitting 20*

*You're a Voidcaller. You chose this path. MAXIMUM DAMAGE.*

**Your Action**: Cast "Void Tendrils" on remaining bandits (7 mana, generates 1d4 Madness)
**Madness Roll**: 1d4 → [3] → +3 Madness Points
**Madness**: 16 + 3 = **19 Madness**
**Shadow Damage Bonus**: +19 to all shadow damage
**Spell Damage**: 4d6 shadow + 19 (Madness bonus) → [6, 5, 4, 6] + 19 = 40 damage to all bandits in 20ft radius!

*Tendrils of pure void energy erupt from the ground, wrapping around the bandits. They scream as the darkness consumes them.*

**Results**:
- Bandit #3: 40 damage → DEAD
- Bandit #4: 40 damage → DEAD
- Bandit Captain: 15 HP - 40 damage → DEAD (overkill)

*All enemies dead. You're at 19 Madness. ONE POINT from Insanity Convulsion. Your hands shake. The voices are SCREAMING. Reality is fracturing at the edges.*

**Mana**: 24 - 7 = 17/50
**Current State**: Madness: 19/20 | Shadow Damage Bonus: +19 | **ONE POINT FROM CONVULSION**

**Turn 5 - The Comedown (Madness: 19 → 13)**

*Combat is over. You need to spend Madness before you lose control. You have spending spells.*

**Your Action**: Cast "Siphon Sanity" (self-heal, spends 1d6 Madness)
**Madness Spent**: 1d6 → [6] → -6 Madness Points
**Madness**: 19 - 6 = **13 Madness**
**Healing**: 6 × 2 = 12 HP healed (you weren't damaged, but now you're at full)

*You breathe deeply. The voices quiet. The world solidifies. You're back to 13 Madness—still high, but safe. For now.*

**Your Party's Healer**: "Are you... okay? Your eyes were completely black."
**You**: "I'm fine. Better than fine. Did you see that damage?"
**Your Party's Tank**: "We saw. We also saw you almost lose your mind."
**You**: "Almost doesn't count."

*But you know the truth. You were one bad roll away from Insanity Convulsion. One 1d4 roll of [4] instead of [3] and you would have hit 20. The table would have rolled. Maybe Shadow Burst (5d6 damage to yourself and allies). Maybe Mind Shatter (stunned for 2 rounds). Maybe worse.*

*But you didn't. You danced on the edge and came back. That's what False Prophets do.*

**The Lesson**: False Prophet gameplay is about:
1. **Madness Generation**: Random dice rolls (1d4, 1d6, 1d8) mean you can't predict exact Madness levels
2. **Damage Scaling**: At 19 Madness, +19 shadow damage turned 21 base damage into 40 damage (90% increase!)
3. **Temptation Abilities**: Eldritch Vision cost 1d6 Madness but provided crucial tactical advantage
4. **Risk Management**: Stayed at 19 Madness (one point from Convulsion) for maximum damage
5. **Spending Strategy**: Used Siphon Sanity after combat to drop from 19 → 13, avoiding Convulsion
6. **Randomness**: If Void Tendrils had rolled 1d4 → [4] instead of [3], would have hit 20 and triggered Convulsion
7. **Reward**: Dealt 115 total damage in 4 turns (20 + 24 + 31 + 40) with massive Madness scaling

You're not a safe, predictable caster. You're a chaos mage who gambles with sanity for power. Every spell is a dice roll. Every turn is a risk. And when you hit 19 Madness and unleash 40 damage AoE, it's all worth it. Until it isn't.`
    }
  },
  
  // Resource System
  resourceSystem: {
    title: 'Madness Points',
    subtitle: 'The Price of Forbidden Power',
    
    description: `Madness Points represent the False Prophet's descent into eldritch insanity. As they channel void energies, their grip on reality weakens, but their power grows. Each point increases shadow damage by +1, tempting them to accumulate more. However, reaching 20 Madness Points triggers an Insanity Convulsion—a catastrophic release of chaotic energy.`,
    
    mechanics: {
      title: 'Core Mechanics',
      content: `**Generating Madness Points**:
- Certain spells generate Madness by rolling dice (1d4, 1d6, or 1d8)
- The result is added to your current Madness Points
- Generation is random—you can't predict exact amounts
- Higher-tier spells typically generate more Madness

**Spending Madness Points**:
- Other spells spend Madness by rolling dice (1d4, 1d6, or 1d8)
- The rolled amount is subtracted from your current Madness Points
- If you don't have enough Madness, the spell fails or has reduced effect
- Spending is also random—strategic risk management required

**Shadow Damage Scaling**:
- Each Madness Point increases shadow damage by +1
- At 10 Madness: +10 shadow damage to all shadow spells
- At 19 Madness: +19 shadow damage (maximum safe level)
- This bonus applies to all shadow damage you deal

**Madness Thresholds**:
- **6 Madness**: Unlock Veil of Shadows (invisibility, adds 1d4 Madness)
- **9 Madness**: Unlock Eldritch Vision (true sight, adds 1d6 Madness)
- **12 Madness**: Unlock Apocalyptic Revelation (8d6 AoE, adds 2d6 Madness)
- **20 Madness**: Automatic Insanity Convulsion

**Insanity Convulsion**:
When you reach 20 Madness Points, you immediately experience an Insanity Convulsion. Roll 1d6 on the Insanity Convulsion Table:

1. **Shadow Burst**: Deal 5d6 necrotic damage to yourself and all creatures within 20 ft
2. **Mind Shatter**: Stunned for 2 rounds
3. **Dark Whispers**: Disadvantage on all attacks and saves for 3 rounds
4. **Chaotic Pulse**: Teleport randomly within 60 ft, take 4d6 psychic damage
5. **Psychic Scream**: All creatures within 30 ft make Wisdom save or frightened for 3 rounds
6. **Nightmare Echoes**: Take 6d6 psychic damage, gain Short-Term Madness for 1d4 rounds

After the Convulsion, your Madness Points reset to 0.

**Short-Term Madness Effects** (if triggered):
Roll 1d6 for the specific effect:
1. **Paranoia**: Attack nearest ally
2. **Delirium**: Disadvantage on all skill checks and saves
3. **Fearful**: Flee from combat for 1 round
4. **Confusion**: Cannot distinguish friend from foe
5. **Despair**: Cannot cast spells for 1 round
6. **Rage**: Advantage on attacks but attack nearest creature (friend or foe)`
    },
    
    resourceBarExplanation: {
      title: 'Understanding Your Madness Gauge',
      content: `**What You See**: Your Madness gauge is a horizontal bar with 20 individual segments, each representing 1 Madness Point. As you accumulate Madness, the segments fill with swirling purple-black void energy, pulsing and writhing like living darkness.

**Visual Representation by Madness Level**:

**0-5 Madness (Safe Zone)**:
- Bar: 0-5 segments filled with dim purple glow
- Border: Green (safe)
- Effect: Minimal visual distortion, screen is clear
- Shadow Damage Bonus: +0 to +5 displayed in small text
- Status: "Building Power"

**6-8 Madness (First Threshold)**:
- Bar: 6-8 segments filled, purple glow brightening
- Border: Yellow (caution)
- Effect: Slight screen edge vignette (purple tint at corners)
- Temptation Unlocked: **Veil of Shadows** icon glows (invisibility ability)
- Shadow Damage Bonus: +6 to +8 displayed in larger text
- Status: "Temptation Available"
- Audio: Faint whispers begin

**9-11 Madness (Second Threshold)**:
- Bar: 9-11 segments filled, bright purple with black tendrils
- Border: Orange (warning)
- Effect: Screen vignette intensifies, occasional visual flicker
- Temptation Unlocked: **Eldritch Vision** icon glows (true sight ability)
- Shadow Damage Bonus: +9 to +11 displayed in bold
- Status: "Power Growing"
- Audio: Whispers louder, occasional laughter

**12-14 Madness (Third Threshold - Danger Zone)**:
- Bar: 12-14 segments filled, violent purple-black swirling
- Border: Red (danger)
- Effect: Screen edges darken significantly, periodic screen shake
- Temptation Unlocked: **Apocalyptic Revelation** icon glows (8d6 AoE ability)
- Shadow Damage Bonus: +12 to +14 displayed in large, pulsing text
- Status: "DANGER - High Madness"
- Audio: Loud whispers, screaming, reality distortion sounds

**15-19 Madness (Critical Zone)**:
- Bar: 15-19 segments filled, chaotic energy crackling between segments
- Border: Flashing red with black lightning
- Effect: Heavy screen distortion, frequent screen shake, void tendrils appear at screen edges
- All Temptations: Available but RISKY (any could push you to 20)
- Shadow Damage Bonus: +15 to +19 displayed in HUGE pulsing text
- Status: "CRITICAL - ONE POINT FROM CONVULSION"
- Audio: SCREAMING, reality tearing sounds, heartbeat pounding
- Warning Text: "MADNESS CRITICAL - CONVULSION IMMINENT" flashes on screen

**20 Madness (INSANITY CONVULSION)**:
- Bar: ALL 20 segments filled, EXPLODING with void energy
- Border: Entire screen flashes white, then black
- Effect: Screen goes completely dark for 1 second, then EXPLOSION of purple-black energy
- Convulsion Table: 1d6 roll animation appears in center of screen
- Audio: LOUD EXPLOSION, glass shattering, reality breaking
- Status: "INSANITY CONVULSION TRIGGERED"
- Result: Roll displayed with dramatic animation, effect applied, Madness resets to 0

**Temptation Ability Icons** (appear at thresholds):
- **Veil of Shadows** (6+ Madness): Shadowy cloak icon, glows purple when available
- **Eldritch Vision** (9+ Madness): Eye with void pupil icon, glows when available
- **Apocalyptic Revelation** (12+ Madness): Exploding void sphere icon, glows when available
- Each icon shows: Ability name, Madness cost (1d4/1d6/2d6), current availability

**Shadow Damage Bonus Display**:
- Small text at 0-5 Madness: "+5 shadow damage"
- Medium text at 6-11 Madness: "+10 shadow damage" (yellow)
- Large text at 12-14 Madness: "+13 shadow damage" (orange)
- HUGE pulsing text at 15-19 Madness: "+19 SHADOW DAMAGE" (red, pulsing)

**Madness Generation/Spending Indicators**:
- When you cast a Madness-generating spell: Dice roll animation (1d4/1d6/1d8) appears above bar, segments fill with animation
- When you cast a Madness-spending spell: Dice roll animation appears, segments drain with reverse animation
- Randomness emphasized: You see the dice roll BEFORE the Madness changes, reinforcing unpredictability

**Warning Systems**:
- At 15 Madness: Yellow warning text "Approaching Convulsion Threshold"
- At 17 Madness: Orange warning text "DANGER - 3 Points from Convulsion"
- At 19 Madness: Red flashing text "CRITICAL - 1 POINT FROM CONVULSION" + alarm sound
- When casting spell that could trigger Convulsion: Confirmation prompt "This spell could trigger Insanity Convulsion. Proceed?"

**Why This Matters**: The Madness gauge isn't just a resource bar—it's a visual representation of your descent into insanity. The screen effects, audio cues, and warning systems create tension and immersion. When you're at 19 Madness and the screen is shaking, whispers are screaming, and the warning text is flashing, you FEEL the danger. You know one bad dice roll will trigger Convulsion. That's the thrill of False Prophet—dancing on the edge of madness, watching the gauge fill, hearing the whispers grow louder, and deciding whether to push for one more spell or spend Madness to safety. The visual feedback makes every point of Madness feel meaningful and dangerous.`
    },
    
    strategicDepth: {
      title: 'Strategic Depth',
      content: `The Madness system creates constant tension between power and risk:

**Risk vs. Reward**:
- Higher Madness = more damage, but closer to Convulsion
- Temptation abilities offer powerful effects but add more Madness
- Spending spells provide safety but consume your damage bonus

**Optimal Madness Ranges**:
- **Conservative (0-8)**: Safe, low damage, minimal risk
- **Moderate (9-14)**: Good damage, access to Eldritch Vision, manageable risk
- **Aggressive (15-19)**: Maximum damage, all abilities unlocked, high risk
- **Insane (20)**: Convulsion guaranteed, chaos unleashed

**Advanced Techniques**:
- "Madness Surfing": Staying at 15-19 for maximum damage without Convulsion
- "Controlled Detonation": Deliberately triggering Convulsion when beneficial
- "Madness Cycling": Alternating between generation and spending for sustained power
- "Threshold Dancing": Using Temptation abilities at exact thresholds before spending

The best False Prophets learn to embrace chaos while maintaining just enough control to avoid self-destruction.`
    },

    playingInPerson: {
      title: 'Playing False Prophet In Person',
      content: `**Required Materials**:
- **20 Madness Tokens** (purple/black tokens, beads, or dice)
- **Madness Generation Dice** (d4, d6, d8 for rolling Madness gains)
- **Madness Spending Dice** (d4, d6, d8 for rolling Madness costs)
- **Insanity Convulsion Table** (d6 reference card)
- **Threshold Tracker** (card showing 6/9/12/20 thresholds)
- **Shadow Damage Counter** (optional, for tracking current bonus)

**Primary Tracking Method: Madness Token Pool**

The False Prophet's Madness Points are tracked using a pool of physical tokens that grow and shrink randomly as you cast spells. Unlike most resource systems, you don't know exactly how much Madness you'll gain or spend—you roll dice to determine the amounts, creating unpredictable, chaotic gameplay.

**Setup**:
\`\`\`
MADNESS POOL: [○][○][○][○][○][○][○][○][○][○] (10 Madness)

SHADOW DAMAGE BONUS: +10 (1 per Madness Point)

THRESHOLDS:
☐ 6 Madness: Veil of Shadows unlocked
☐ 9 Madness: Eldritch Vision unlocked
☐ 12 Madness: Apocalyptic Revelation unlocked
☐ 20 Madness: INSANITY CONVULSION!

CURRENT MADNESS: [___] / 20
\`\`\`

**How It Works**:

**Generating Madness (Random)**:
1. Cast a Madness-generating spell
2. Roll the specified die (1d4, 1d6, or 1d8)
3. Add that many tokens to your Madness pool
4. Shadow damage bonus increases by the rolled amount
5. Check if you've crossed any thresholds

**Spending Madness (Random)**:
1. Cast a Madness-spending spell
2. Roll the specified die (1d4, 1d6, or 1d8)
3. Remove that many tokens from your Madness pool
4. Shadow damage bonus decreases by the rolled amount
5. If you don't have enough Madness, spell may fail or have reduced effect

**Example Madness Generation**:

*Starting: 0 Madness*

**Turn 1**: Cast "Whispers of the Void" (generates 1d4 Madness)
- Roll 1d4 → [3]
- Add 3 purple tokens to pool → **3 Madness**
- Shadow damage bonus: +3

**Turn 2**: Cast "Eldritch Bolt" (generates 1d6 Madness)
- Roll 1d6 → [5]
- Add 5 purple tokens → **8 Madness**
- Shadow damage bonus: +8
- Threshold crossed: 6 Madness → Veil of Shadows unlocked!

**Turn 3**: Cast "Mind Fracture" (generates 1d8 Madness)
- Roll 1d8 → [7]
- Add 7 purple tokens → **15 Madness**
- Shadow damage bonus: +15
- Thresholds crossed: 9 Madness (Eldritch Vision), 12 Madness (Apocalyptic Revelation)

**Turn 4**: Cast "Shadow Drain" (spends 1d6 Madness)
- Roll 1d6 → [4]
- Remove 4 purple tokens → **11 Madness**
- Shadow damage bonus: +11

**The Danger Zone (15-19 Madness)**:

When you're at 15-19 Madness, you're in the "Madness Surfing" zone—maximum damage potential but one bad roll away from Insanity Convulsion:

*You have 17 Madness*

**Option 1**: Cast another generating spell (1d4 Madness)
- Roll 1d4 → [1] = 18 Madness (safe!)
- Roll 1d4 → [2] = 19 Madness (still safe!)
- Roll 1d4 → [3] = 20 Madness → **INSANITY CONVULSION!**
- Roll 1d4 → [4] = 21 Madness → **INSANITY CONVULSION!**

**Option 2**: Spend Madness to stay safe
- Cast spending spell (1d6 Madness)
- Roll 1d6 → [5] = 12 Madness (back to safe zone)

**Insanity Convulsion (20 Madness)**:

When you reach exactly 20 Madness (or exceed it), you immediately trigger an Insanity Convulsion:

1. **Announce**: "I've reached 20 Madness! Insanity Convulsion!"
2. **Roll 1d6** on the Insanity Convulsion Table
3. **Apply Effect** (all effects are self-inflicting or chaotic)
4. **Reset Madness**: Remove ALL tokens → 0 Madness
5. **Shadow Damage Bonus**: Resets to +0

**Insanity Convulsion Table**:
\`\`\`
Roll 1d6:

1. SHADOW BURST
   Deal 5d6 necrotic to yourself + all within 20 ft
   Roll: 5d6 → [4,6,3,5,2] = 20 damage to everyone!

2. MIND SHATTER
   Stunned for 2 rounds
   Cannot move, act, or react

3. DARK WHISPERS
   Disadvantage on attacks/saves for 3 rounds
   Roll all d20s twice, take lower result

4. CHAOTIC PULSE
   Teleport randomly within 60 ft + 4d6 psychic
   DM determines random location

5. PSYCHIC SCREAM
   All within 30 ft: WIS save or frightened 3 rounds
   Enemies flee from you

6. NIGHTMARE ECHOES
   Take 6d6 psychic + Short-Term Madness 1d4 rounds
   Roll on Short-Term Madness table
\`\`\`

**Short-Term Madness Table** (if triggered by result 6):
\`\`\`
Roll 1d6 for duration 1d4 rounds:

1. PARANOIA: Attack nearest ally
2. DELIRIUM: Disadvantage on all checks/saves
3. FEARFUL: Flee from combat for 1 round
4. CONFUSION: Cannot distinguish friend from foe
5. DESPAIR: Cannot cast spells for 1 round
6. HALLUCINATION: Perceive illusions, DM describes
\`\`\`

**Alternative Tracking Methods**:

**Method 1: Dice Tower**
- Stack d6s to show current Madness (3 dice = 18 Madness)
- Add/remove dice as Madness changes
- Visual height shows danger level
- Quick to adjust, but limited to multiples of 6

**Method 2: d20 Tracker**
- Use a d20 to show current Madness Points
- Rotate die as Madness changes
- Simple and compact
- Doesn't show individual token accumulation

**Method 3: Tally Marks**
- Write tally marks on paper as you gain Madness
- Cross out marks as you spend Madness
- Minimalist approach
- Easy to track exact count

**Method 4: Madness Dial**
- Create a dial with numbers 0-20
- Rotate pointer as Madness changes
- Visual representation of danger zones
- Requires crafting custom dial

**Threshold Reference Card**:
\`\`\`
FALSE PROPHET MADNESS THRESHOLDS

SHADOW DAMAGE BONUS:
+1 per Madness Point (at 15 Madness = +15 shadow damage)

TEMPTATION ABILITIES:
6 Madness: Veil of Shadows (invisibility, +1d4 Madness)
9 Madness: Eldritch Vision (true sight, +1d6 Madness)
12 Madness: Apocalyptic Revelation (8d6 AoE, +2d6 Madness)

DANGER ZONES:
0-5: Safe, low damage
6-11: Moderate, abilities unlocked
12-19: High damage, high risk
20+: INSANITY CONVULSION!

MADNESS GENERATION SPELLS:
• Whispers of Void: +1d4 Madness
• Eldritch Bolt: +1d6 Madness
• Mind Fracture: +1d8 Madness
• Shadow Torrent: +2d6 Madness

MADNESS SPENDING SPELLS:
• Shadow Drain: -1d6 Madness
• Clarity Burst: -1d8 Madness
• Void Anchor: -1d4 Madness
\`\`\`

**Example In-Person Turn**:

*You have 14 Madness, fighting a group of cultists*

**Turn 1 - Generate More Madness**:
1. "I cast Eldritch Bolt at the cultist leader!"
2. Roll spell damage: 3d6 + 14 (Madness bonus) → [4,5,6] + 14 = 29 damage!
3. Roll Madness generation: 1d6 → [4]
4. Add 4 purple tokens → **18 Madness**
5. Announce: "I'm at 18 Madness now. Shadow damage bonus is +18. I'm in the danger zone!"

**Turn 2 - Temptation Ability**:
1. "I use Apocalyptic Revelation! 8d6 AoE to all cultists!"
2. Roll damage: 8d6 + 18 → [6,5,4,6,3,5,4,6] + 18 = 55 damage!
3. Roll Madness cost: 2d6 → [3,5] = 8 Madness added
4. Add 8 purple tokens → **26 Madness** → Over 20!
5. "INSANITY CONVULSION!"

**Turn 3 - Convulsion**:
1. Roll 1d6 on Convulsion Table → [4] = Chaotic Pulse
2. Teleport randomly within 60 ft (DM determines location)
3. Take 4d6 psychic → [4,3,5,6] = 18 psychic damage to myself
4. Remove ALL purple tokens → **0 Madness**
5. Shadow damage bonus resets to +0
6. Announce: "I'm back to 0 Madness. Time to build again..."

**Quick Reference Card Template**:
\`\`\`
FALSE PROPHET QUICK REFERENCE

MADNESS MECHANICS:
• Generate: Roll die, add tokens (1d4/1d6/1d8)
• Spend: Roll die, remove tokens (1d4/1d6/1d8)
• Shadow Damage: +1 per Madness Point
• Convulsion: At 20 Madness, roll 1d6 on table

MADNESS STRATEGY:
• Safe Zone (0-8): Build freely
• Power Zone (9-14): Good damage, manageable risk
• Danger Zone (15-19): Maximum damage, high risk
• Convulsion (20+): Chaos unleashed, reset to 0

TEMPTATION ABILITIES:
6: Veil of Shadows (+1d4 Madness)
9: Eldritch Vision (+1d6 Madness)
12: Apocalyptic Revelation (+2d6 Madness)

CONVULSION EFFECTS:
1. Shadow Burst (5d6 to all nearby)
2. Mind Shatter (stunned 2 rounds)
3. Dark Whispers (disadvantage 3 rounds)
4. Chaotic Pulse (teleport + 4d6 psychic)
5. Psychic Scream (frighten all nearby)
6. Nightmare Echoes (6d6 + Short-Term Madness)
\`\`\`

**Thematic Enhancements**:

Many players enhance the False Prophet experience with:
- **Purple/Black Tokens**: Use dark-colored beads or tokens for Madness
- **Eldritch Dice**: Purple or black dice for Madness rolls
- **Convulsion Sound**: Play eerie sound effect when hitting 20 Madness
- **Madness Journal**: Write cryptic notes as Madness increases
- **Eye Symbol**: Keep an eye symbol that "watches" as Madness grows
- **Flickering Candle**: Candle that flickers more as Madness increases

**Madness Management Tips**:

**Building Strategy**:
- **Start Slow**: Build to 6-9 Madness first for moderate power
- **Track Thresholds**: Know when you unlock Temptation abilities
- **Calculate Risk**: At 15+ Madness, every generating spell risks Convulsion
- **Embrace Chaos**: Accept that you can't control exact Madness amounts

**Spending Strategy**:
- **Emergency Spending**: Use spending spells when approaching 20
- **Madness Surfing**: Stay at 15-19 for maximum damage if you're brave
- **Threshold Awareness**: Don't spend below thresholds you want to maintain
- **Random Spending**: Remember spending is random—you might spend more than expected

**Convulsion Management**:
- **Controlled Detonation**: Sometimes triggering Convulsion is strategic
- **Positioning**: Be aware of allies when near 20 (Shadow Burst hits everyone)
- **Backup Plan**: Have low-Madness spells ready for post-Convulsion recovery
- **Accept Chaos**: Convulsions are part of the class fantasy

**Example Full Combat Sequence**:

*Starting: 0 Madness*

**Turn 1**: Cast Whispers (1d4) → Roll [3] → 3 Madness (+3 shadow damage)
**Turn 2**: Cast Eldritch Bolt (1d6) → Roll [5] → 8 Madness (+8 shadow damage)
**Turn 3**: Cast Mind Fracture (1d8) → Roll [6] → 14 Madness (+14 shadow damage)
**Turn 4**: Cast Eldritch Bolt (1d6) → Roll [4] → 18 Madness (+18 shadow damage)
**Turn 5**: Cast Whispers (1d4) → Roll [3] → 21 Madness → **CONVULSION!**
**Turn 6**: Roll Convulsion → [2] = Mind Shatter → Stunned 2 rounds, reset to 0
**Turn 7-8**: Stunned, cannot act
**Turn 9**: Recovered, start building Madness again from 0

**Visual Organization**:

**Madness Display Layout**:
\`\`\`
MADNESS POOL: [●][●][●][●][●][●][●][●][●][●][●][●][●][●][●][○][○][○][○][○]
Current: 15/20 (DANGER ZONE!)

SHADOW DAMAGE: +15

UNLOCKED ABILITIES:
✓ Veil of Shadows (6)
✓ Eldritch Vision (9)
✓ Apocalyptic Revelation (12)

NEXT THRESHOLD: 20 = CONVULSION!
\`\`\`

**Battlefield Tracking**:
- **Madness Tokens**: Pool of purple/black tokens showing current Madness
- **Threshold Card**: Reference showing 6/9/12/20 thresholds
- **Convulsion Table**: d6 table ready for when you hit 20
- **Shadow Damage Tracker**: Current bonus written on card

**Why This System Works**: The randomness of Madness generation and spending creates genuine tension and unpredictability. You can't plan exact Madness amounts—you roll dice and react to the results. The physical act of adding tokens as you descend into madness, then watching the pile grow dangerously close to 20, creates visceral anxiety. The moment you hit 20 and roll on the Convulsion table is dramatic and chaotic, perfectly capturing the False Prophet's theme of "power through insanity." The reset to 0 after Convulsion creates a satisfying cycle of building, risking, exploding, and rebuilding.

**Pro Tips**:
- **Count Before Casting**: Always count current Madness before generating more
- **Know Your Dice**: Understand average rolls (d4=2.5, d6=3.5, d8=4.5)
- **Threshold Planning**: Decide which Temptation abilities you want before combat
- **Convulsion Timing**: Sometimes triggering Convulsion when beneficial is smart
- **Track Shadow Damage**: Keep current bonus visible so you don't forget to add it
- **Specialization Synergy**: Voidcaller = aggressive generation, Deceiver = control focus, Harbinger = balanced approach

**Budget-Friendly Alternatives**:
- **No tokens?** Use coins, buttons, or dice to represent Madness
- **No Convulsion table?** Write effects on index card
- **No threshold tracker?** Just remember 6/9/12/20 thresholds
- **Minimalist**: Track Madness count on paper, roll dice for generation/spending

**Specialization-Specific Tracking**:

**Voidcaller**:
- Add +1 to all Madness generation rolls
- If you roll 1d4 → [3], add 4 tokens (not 3)
- At 15+ Madness, add +1d8 to shadow damage spells
- Track bonus damage separately

**Deceiver**:
- Mind control spells don't generate Madness
- Can spend Madness to enhance control duration
- Track controlled enemies separately

**Harbinger**:
- Can choose to reroll Madness generation once per turn
- Convulsion effects can target enemies instead of self
- Mark when reroll is available

**Why False Prophet Is Perfect for In-Person Play**: The class is built around dice rolls and randomness, which are already core to tabletop gaming. The physical act of rolling dice to determine Madness generation creates suspense—will you roll high and risk Convulsion, or low and stay safe? The growing pile of Madness tokens creates visual tension as you approach 20, and the dramatic moment of hitting 20 and rolling on the Convulsion table is pure chaos. The unpredictability makes every turn exciting, and the reset mechanic (Convulsion → 0 Madness) creates natural story arcs within combat. It's a class that embraces the randomness of dice, making it perfect for in-person play.`
    }
  },

  // Specializations
  specializations: {
    title: 'False Prophet Specializations',
    subtitle: 'Three Paths to Madness',

    description: `False Prophets can specialize in different aspects of eldritch power, each offering unique approaches to managing madness and wielding void energies.`,

    specs: [
      {
        id: 'voidcaller',
        name: 'Voidcaller',
        icon: 'spell_shadow_twilight',
        color: '#9400D3',
        theme: 'Aggressive Madness',

        description: `Voidcallers embrace madness fully, generating it rapidly to maximize their shadow damage output. They are the most aggressive False Prophet specialization, willing to risk Insanity Convulsions for devastating power. Their connection to the void is strongest, allowing them to channel pure eldritch energy.`,

        playstyle: 'High-risk aggression, maximum shadow damage, rapid madness generation',

        strengths: [
          'Highest shadow damage potential of all specs',
          'Generates Madness faster for quicker power scaling',
          'Bonus damage when at high Madness levels',
          'Powerful burst damage capabilities'
        ],

        weaknesses: [
          'Most likely to trigger Insanity Convulsions',
          'Requires aggressive playstyle that increases risk',
          'Less control over Madness accumulation',
          'Vulnerable during Convulsion recovery'
        ],

        passiveAbilities: [
          {
            name: 'Eldritch Empowerment',
            tier: 'Path Passive',
            description: 'When you reach 10 or more Madness Points, your next shadow damage spell deals an additional 2d6 shadow damage.',
            sharedBy: 'All False Prophets'
          },
          {
            name: 'Void Surge',
            tier: 'Specialization Passive',
            description: 'Whenever you generate Madness Points, add +1 to the rolled amount. When you have 15 or more Madness Points, your shadow damage spells deal an additional 1d8 damage.',
            uniqueTo: 'Voidcaller'
          }
        ],

        recommendedFor: 'Players who enjoy high-risk/high-reward gameplay, maximum damage output, and aggressive spellcasting'
      },

      {
        id: 'deceiver',
        name: 'Deceiver',
        icon: 'spell_shadow_charm',
        color: '#8B008B',
        theme: 'Mind Control & Manipulation',

        description: `Deceivers use their madness to warp the minds of others, specializing in control, deception, and manipulation. They are masters of turning enemies against each other and creating illusions that blur the line between reality and nightmare. Their madness is a tool for domination.`,

        playstyle: 'Control-focused, mind manipulation, strategic madness spending',

        strengths: [
          'Powerful mind control and charm effects',
          'Can turn enemies into temporary allies',
          'Extended duration on confusion and fear effects',
          'Excellent crowd control capabilities'
        ],

        weaknesses: [
          'Lower direct damage than Voidcaller',
          'Less effective against mindless enemies',
          'Requires strategic target selection',
          'Control effects can be resisted'
        ],

        passiveAbilities: [
          {
            name: 'Eldritch Empowerment',
            tier: 'Path Passive',
            description: 'When you reach 10 or more Madness Points, your next shadow damage spell deals an additional 2d6 shadow damage.',
            sharedBy: 'All False Prophets'
          },
          {
            name: 'Master Manipulator',
            tier: 'Specialization Passive',
            description: 'Your mind control and charm spells have their duration increased by 50%. When you successfully control an enemy, you gain 1d4 Madness Points. Enemies have disadvantage on saves against your confusion effects.',
            uniqueTo: 'Deceiver'
          }
        ],

        recommendedFor: 'Players who enjoy control gameplay, manipulating enemies, and strategic battlefield control'
      },

      {
        id: 'cultist',
        name: 'Cultist',
        icon: 'spell_shadow_deathcoil',
        color: '#4B0082',
        theme: 'Corruption & Curses',

        description: `Cultists spread corruption and curses, specializing in damage-over-time effects and sustained madness management. They perform dark rituals that empower themselves and their allies while slowly destroying their enemies. Their madness is channeled into methodical, inevitable destruction.`,

        playstyle: 'Sustained damage, DoT effects, balanced madness management',

        strengths: [
          'Excellent sustained damage with DoT effects',
          'Better Madness management than other specs',
          'Can empower allies with dark rituals',
          'Strong in prolonged encounters'
        ],

        weaknesses: [
          'Lower burst damage than Voidcaller',
          'DoT effects take time to ramp up',
          'Less impactful in short fights',
          'Requires setup time for rituals'
        ],

        passiveAbilities: [
          {
            name: 'Eldritch Empowerment',
            tier: 'Path Passive',
            description: 'When you reach 10 or more Madness Points, your next shadow damage spell deals an additional 2d6 shadow damage.',
            sharedBy: 'All False Prophets'
          },
          {
            name: 'Corrupting Presence',
            tier: 'Specialization Passive',
            description: 'Your damage-over-time effects last 2 additional rounds. When you spend Madness Points, heal yourself for 5 HP per point spent. Enemies affected by your curses take an additional 1d4 necrotic damage per round.',
            uniqueTo: 'Cultist'
          }
        ],

        recommendedFor: 'Players who enjoy DoT gameplay, sustained damage, and balanced resource management'
      }
    ]
  },

  // Example Spells - showcasing the spell wizard system
  exampleSpells: [
    // MADNESS GENERATORS - Basic Psychic Damage
    {
      id: 'fp_dark_whisper',
      name: 'Dark Whisper',
      description: 'Send haunting whispers from the void to shatter a target\'s mind, dealing psychic damage.',
      spellType: 'ACTION',
      icon: 'spell_shadow_siphonmana',
      school: 'Psychic',
      level: 1,

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
        mana: 8,
        components: ['verbal'],
        verbalText: 'Sussurri Tenebris'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '2d6',
        modifier: 'INTELLIGENCE',
        damageType: 'psychic',
        attackType: 'spell_attack'
      },

      effects: {
        damage: {
          instant: {
            amount: '2d6 + INT',
            type: 'psychic',
            description: 'Whispers from the void assault the target\'s mind'
          }
        }
      },

      specialMechanics: {
        madnessGeneration: {
          enabled: true,
          formula: '1d4',
          description: 'Generates 1d4 Madness Points when cast'
        }
      },

      flavorText: 'The void speaks, and minds break.'
    },

    {
      id: 'fp_mind_fracture',
      name: 'Mind Fracture',
      description: 'Fracture a target\'s mind with eldritch energy, causing confusion and glimpses of the void.',
      spellType: 'ACTION',
      icon: 'spell_shadow_mindsteal',
      school: 'Psychic',
      level: 3,

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
        durationAmount: 3
      },

      resourceCost: {
        mana: 15,
        components: ['verbal', 'somatic'],
        verbalText: 'Mens Fractura',
        somaticText: 'Crushing gesture toward target\'s head'
      },

      resolution: 'SAVING_THROW',
      savingThrow: {
        attribute: 'WISDOM',
        dc: 'SPELL_DC',
        onSuccess: 'half_duration',
        onFailure: 'full_effect'
      },

      effects: {
        condition: {
          type: 'confused',
          duration: '3 rounds',
          description: 'Target cannot distinguish friend from foe, acts erratically'
        }
      },

      specialMechanics: {
        madnessGeneration: {
          enabled: true,
          formula: '1d6',
          description: 'Generates 1d6 Madness Points when cast'
        }
      },

      flavorText: 'Reality cracks. Sanity shatters. The void seeps through.'
    },

    {
      id: 'fp_tormenting_visions',
      name: 'Tormenting Visions',
      description: 'Fill a target\'s vision with horrifying eldritch horrors, dealing psychic damage over time.',
      spellType: 'ACTION',
      icon: 'spell_shadow_shadowwordpain',
      school: 'Psychic',
      level: 4,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 50
      },

      durationConfig: {
        durationType: 'rounds',
        durationAmount: 4
      },

      resourceCost: {
        mana: 20,
        components: ['verbal', 'somatic'],
        verbalText: 'Visiones Cruciatus',
        somaticText: 'Hands pressed to temples'
      },

      resolution: 'AUTOMATIC',

      effects: {
        damage: {
          overTime: {
            amount: '2d6',
            type: 'psychic',
            interval: 'round',
            duration: '4 rounds',
            description: 'Visions of eldritch horrors torment the target each round'
          }
        }
      },

      specialMechanics: {
        madnessGeneration: {
          enabled: true,
          formula: '1d8',
          description: 'Generates 1d8 Madness Points when cast'
        }
      },

      flavorText: 'They see what lurks beyond. They cannot unsee it.'
    },

    // MADNESS GENERATORS - Control & Debuffs
    {
      id: 'fp_corrupt_mind',
      name: 'Corrupt Mind',
      description: 'Corrupt a target\'s mind with dark whispers, forcing them to attack their own allies.',
      spellType: 'ACTION',
      icon: 'spell_shadow_possession',
      school: 'Mind Control',
      level: 5,

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
        durationType: 'rounds',
        durationAmount: '1d4'
      },

      resourceCost: {
        mana: 25,
        components: ['verbal', 'somatic'],
        verbalText: 'Mens Corruptio',
        somaticText: 'Grasping motion toward target'
      },

      resolution: 'SAVING_THROW',
      savingThrow: {
        attribute: 'WISDOM',
        dc: 'SPELL_DC',
        onSuccess: 'negated',
        onFailure: 'full_effect'
      },

      effects: {
        condition: {
          type: 'charmed',
          duration: '1d4 rounds',
          description: 'Target attacks its allies for the duration'
        }
      },

      specialMechanics: {
        madnessGeneration: {
          enabled: true,
          formula: '1d8',
          description: 'Generates 1d8 Madness Points when cast'
        },
        mindControl: {
          enabled: true,
          controlType: 'hostile_to_allies',
          description: 'Target becomes hostile to its allies and attacks them'
        }
      },

      flavorText: 'Friend becomes foe. Trust becomes betrayal. The void laughs.'
    },

    {
      id: 'fp_maddening_scripture',
      name: 'Maddening Scripture',
      description: 'Recite eldritch scripture that drives all who hear it toward madness and confusion.',
      spellType: 'ACTION',
      icon: 'spell_shadow_unholyfrenzy',
      school: 'Psychic',
      level: 4,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'aoe',
        rangeType: 'self',
        aoeType: 'radius',
        aoeSize: 20
      },

      durationConfig: {
        durationType: 'rounds',
        durationAmount: 2
      },

      resourceCost: {
        mana: 22,
        components: ['verbal'],
        verbalText: 'Forbidden words in an unknowable tongue'
      },

      resolution: 'SAVING_THROW',
      savingThrow: {
        attribute: 'WISDOM',
        dc: 'SPELL_DC_PLUS_PERSUASION',
        onSuccess: 'negated',
        onFailure: 'full_effect'
      },

      effects: {
        condition: {
          type: 'confused',
          duration: '2 rounds',
          description: 'All enemies in radius must save or be confused'
        }
      },

      specialMechanics: {
        madnessGeneration: {
          enabled: true,
          formula: '1d6',
          description: 'Generates 1d6 Madness Points when cast'
        },
        performanceBonus: {
          enabled: true,
          description: 'GM awards +3, 0, or -5 to Persuasion roll based on RP quality'
        }
      },

      flavorText: 'Words that should not be spoken. Truths that should not be known.'
    },

    {
      id: 'fp_abyssal_command',
      name: 'Abyssal Command',
      description: 'Command creatures from the abyss to rise and fight for you.',
      spellType: 'ACTION',
      icon: 'spell_shadow_demonicempathy',
      school: 'Summoning',
      level: 6,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'ground',
        rangeType: 'ranged',
        rangeDistance: 30
      },

      durationConfig: {
        durationType: 'rounds',
        durationAmount: '1d4'
      },

      resourceCost: {
        mana: 30,
        components: ['verbal', 'somatic'],
        verbalText: 'Abyssus Imperium',
        somaticText: 'Beckoning gesture toward the ground'
      },

      resolution: 'AUTOMATIC',

      effects: {
        summon: {
          creatureType: 'abyssal_minions',
          count: '1d4',
          duration: '1d4 rounds',
          description: 'Summons 1d4 abyssal creatures to fight for you'
        }
      },

      specialMechanics: {
        madnessGeneration: {
          enabled: true,
          formula: '1d8',
          description: 'Generates 1d8 Madness Points when cast'
        }
      },

      flavorText: 'The abyss answers. Its servants hunger.'
    },

    // MADNESS SPENDERS - Buffs & Utility
    {
      id: 'fp_dark_bidding',
      name: 'Dark Bidding',
      description: 'Channel Madness Points into raw power, boosting combat abilities temporarily.',
      spellType: 'ACTION',
      icon: 'spell_shadow_unholystrength',
      school: 'Enhancement',
      level: 3,

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
        durationAmount: '1d4'
      },

      resourceCost: {
        mana: 12,
        components: ['verbal'],
        verbalText: 'Potentia Tenebris'
      },

      resolution: 'AUTOMATIC',

      effects: {
        buff: {
          attackBonus: '+2 per Madness Point spent',
          damageBonus: '+2 per Madness Point spent',
          duration: '1d4 rounds',
          description: 'Gain +2 to attack and damage rolls per Madness Point spent'
        }
      },

      specialMechanics: {
        madnessSpending: {
          enabled: true,
          formula: '1d6',
          description: 'Spends 1d6 Madness Points when cast. Effect scales with amount spent.'
        }
      },

      flavorText: 'Power demands sacrifice. Madness is the currency.'
    },

    {
      id: 'fp_feeding_darkness',
      name: 'Feeding Darkness',
      description: 'Feed on the darkness within, converting Madness Points into healing.',
      spellType: 'ACTION',
      icon: 'spell_shadow_lifedrain',
      school: 'Restoration',
      level: 4,

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
        mana: 18,
        components: ['verbal', 'somatic'],
        verbalText: 'Tenebris Vescor',
        somaticText: 'Hands clutching chest'
      },

      resolution: 'AUTOMATIC',

      healingConfig: {
        formula: 'MADNESS_SPENT',
        modifier: 'NONE',
        healingType: 'self',
        scaling: '2x'
      },

      effects: {
        healing: {
          instant: {
            amount: '2 HP per Madness Point spent',
            type: 'self',
            description: 'Restore HP equal to twice the Madness Points spent'
          }
        }
      },

      specialMechanics: {
        madnessSpending: {
          enabled: true,
          formula: '1d6',
          description: 'Spends 1d6 Madness Points. Heals for 2 HP per point spent.'
        }
      },

      flavorText: 'The void takes. The void gives. Balance is an illusion.'
    },

    {
      id: 'fp_maddening_wrath',
      name: 'Maddening Wrath',
      description: 'Channel accumulated madness into a devastating attack of pure chaos.',
      spellType: 'ACTION',
      icon: 'spell_shadow_shadowbolt',
      school: 'Evocation',
      level: 5,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 50
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 25,
        components: ['verbal', 'somatic'],
        verbalText: 'Ira Insania',
        somaticText: 'Violent thrusting motion'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '4d8',
        modifier: 'INTELLIGENCE',
        damageType: 'shadow',
        attackType: 'spell_attack',
        bonusDamage: '2 per Madness Point spent'
      },

      effects: {
        damage: {
          instant: {
            amount: '4d8 + INT + (2 × Madness spent)',
            type: 'shadow',
            description: 'Devastating shadow damage enhanced by spent Madness'
          }
        }
      },

      specialMechanics: {
        madnessSpending: {
          enabled: true,
          formula: '1d6',
          description: 'Spends 1d6 Madness Points. Deals +2 damage per point spent.'
        }
      },

      flavorText: 'Madness becomes wrath. Wrath becomes annihilation.'
    },

    {
      id: 'fp_enslave',
      name: 'Enslave',
      description: 'Spend Madness to completely enslave a target\'s mind, making them your thrall.',
      spellType: 'ACTION',
      icon: 'spell_shadow_mindshear',
      school: 'Mind Control',
      level: 6,

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
        durationAmount: '1d4'
      },

      resourceCost: {
        mana: 35,
        components: ['verbal', 'somatic'],
        verbalText: 'Servitus Mentis',
        somaticText: 'Commanding gesture'
      },

      resolution: 'SAVING_THROW',
      savingThrow: {
        attribute: 'WISDOM',
        dc: 'SPELL_DC_PLUS_MADNESS',
        onSuccess: 'negated',
        onFailure: 'full_effect'
      },

      effects: {
        condition: {
          type: 'dominated',
          duration: '1d4 rounds',
          description: 'Target becomes your thrall, obeying all commands'
        }
      },

      specialMechanics: {
        madnessSpending: {
          enabled: true,
          formula: '1d8',
          description: 'Spends 1d8 Madness Points. DC increases by +1 per point spent.'
        },
        mindControl: {
          enabled: true,
          controlType: 'full_control',
          description: 'You control the target\'s actions completely'
        }
      },

      flavorText: 'Free will is an illusion. Obedience is truth.'
    },

    {
      id: 'fp_reality_twist',
      name: 'Reality Twist',
      description: 'Twist reality itself, creating a zone of chaotic and unpredictable effects.',
      spellType: 'ACTION',
      icon: 'spell_shadow_twilight',
      school: 'Transmutation',
      level: 7,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'aoe',
        rangeType: 'ranged',
        rangeDistance: 40,
        aoeType: 'radius',
        aoeSize: 20
      },

      durationConfig: {
        durationType: 'rounds',
        durationAmount: '1d4'
      },

      resourceCost: {
        mana: 40,
        components: ['verbal', 'somatic'],
        verbalText: 'Realitas Distortio',
        somaticText: 'Twisting, warping gestures'
      },

      resolution: 'AUTOMATIC',

      effects: {
        zone: {
          type: 'chaos',
          radius: 20,
          duration: '1d4 rounds',
          description: 'All creatures in zone experience random effects each round'
        }
      },

      specialMechanics: {
        madnessSpending: {
          enabled: true,
          formula: '1d8',
          description: 'Spends 1d8 Madness Points when cast'
        },
        randomEffects: {
          enabled: true,
          description: 'Roll 1d6 each round for random effect: 1=teleport, 2=damage, 3=heal, 4=slow, 5=haste, 6=confusion'
        }
      },

      flavorText: 'Reality bends. Logic breaks. Chaos reigns.'
    },

    // SPECIAL TEMPTATION ABILITIES
    {
      id: 'fp_veil_of_shadows',
      name: 'Veil of Shadows',
      description: 'Cloak yourself in shadows, becoming invisible. Requires 6 Madness Points. Adds 1d4 Madness.',
      spellType: 'ACTION',
      icon: 'spell_shadow_charm',
      school: 'Illusion',
      level: 4,

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
        durationAmount: '1d4'
      },

      resourceCost: {
        mana: 20,
        components: ['verbal'],
        verbalText: 'Velum Umbrae'
      },

      resolution: 'AUTOMATIC',

      effects: {
        condition: {
          type: 'invisible',
          duration: '1d4 rounds',
          description: 'You become invisible for 1d4 rounds'
        }
      },

      specialMechanics: {
        madnessRequirement: {
          enabled: true,
          minimum: 6,
          description: 'Requires at least 6 Madness Points to cast'
        },
        madnessGeneration: {
          enabled: true,
          formula: '1d4',
          description: 'Adds 1d4 Madness Points after casting (risk of Convulsion)'
        },
        temptationAbility: true
      },

      flavorText: 'Power at a price. Invisibility at the cost of sanity.'
    },

    {
      id: 'fp_eldritch_vision',
      name: 'Eldritch Vision',
      description: 'See through walls and detect hidden enemies with void-touched sight. Requires 9 Madness. Adds 1d6 Madness.',
      spellType: 'ACTION',
      icon: 'spell_shadow_soulleech_3',
      school: 'Divination',
      level: 5,

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
        durationAmount: '1d4'
      },

      resourceCost: {
        mana: 25,
        components: ['verbal', 'somatic'],
        verbalText: 'Visio Abyssi',
        somaticText: 'Hands over eyes'
      },

      resolution: 'AUTOMATIC',

      effects: {
        buff: {
          type: 'true_sight',
          duration: '1d4 rounds',
          description: 'See through walls, detect invisible creatures, see in darkness'
        }
      },

      specialMechanics: {
        madnessRequirement: {
          enabled: true,
          minimum: 9,
          description: 'Requires at least 9 Madness Points to cast'
        },
        madnessGeneration: {
          enabled: true,
          formula: '1d6',
          description: 'Adds 1d6 Madness Points after casting (higher risk)'
        },
        temptationAbility: true
      },

      flavorText: 'See all. Know all. Lose all.'
    },

    {
      id: 'fp_apocalyptic_revelation',
      name: 'Apocalyptic Revelation',
      description: 'Unleash a massive wave of psychic energy. Requires 12 Madness. Adds 2d6 Madness (high Convulsion risk).',
      spellType: 'ACTION',
      icon: 'spell_shadow_shadowwordpain',
      school: 'Evocation',
      level: 8,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'aoe',
        rangeType: 'self',
        aoeType: 'radius',
        aoeSize: 30
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 50,
        components: ['verbal', 'somatic'],
        verbalText: 'APOCALYPSIS MENTIS!',
        somaticText: 'Arms spread wide, releasing energy'
      },

      resolution: 'SAVING_THROW',
      savingThrow: {
        attribute: 'WISDOM',
        dc: 'SPELL_DC',
        onSuccess: 'half_damage',
        onFailure: 'full_damage'
      },

      damageConfig: {
        formula: '8d6',
        modifier: 'INTELLIGENCE',
        damageType: 'psychic',
        attackType: 'spell_save'
      },

      effects: {
        damage: {
          instant: {
            amount: '8d6 + INT',
            type: 'psychic',
            description: 'Massive psychic damage to all enemies in 30 ft radius'
          }
        }
      },

      specialMechanics: {
        madnessRequirement: {
          enabled: true,
          minimum: 12,
          description: 'Requires at least 12 Madness Points to cast'
        },
        madnessGeneration: {
          enabled: true,
          formula: '2d6',
          description: 'Adds 2d6 Madness Points after casting (VERY high Convulsion risk)'
        },
        temptationAbility: true,
        warning: 'Extremely likely to trigger Insanity Convulsion'
      },

      flavorText: 'The void speaks its final truth. All who hear it break.'
    },

    // ADDITIONAL DIVERSE SPELLS
    {
      id: 'fp_curse_of_flesh',
      name: 'Curse of Flesh',
      description: 'Curse a target, causing their flesh to decay and rot over time.',
      spellType: 'ACTION',
      icon: 'spell_shadow_curseofachimonde',
      school: 'Necromancy',
      level: 4,

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
        durationType: 'rounds',
        durationAmount: '1d4'
      },

      resourceCost: {
        mana: 20,
        components: ['verbal', 'somatic'],
        verbalText: 'Maledictio Carnis',
        somaticText: 'Pointing at target with withering gesture'
      },

      resolution: 'SAVING_THROW',
      savingThrow: {
        attribute: 'CONSTITUTION',
        dc: 'SPELL_DC',
        onSuccess: 'half_duration',
        onFailure: 'full_effect'
      },

      effects: {
        damage: {
          overTime: {
            amount: '2d6',
            type: 'necrotic',
            interval: 'round',
            duration: '1d4 rounds',
            description: 'Flesh decays, dealing necrotic damage each round'
          }
        }
      },

      specialMechanics: {
        madnessGeneration: {
          enabled: true,
          formula: '1d6',
          description: 'Generates 1d6 Madness Points when cast'
        }
      },

      flavorText: 'Flesh is weak. The curse makes it weaker.'
    },

    {
      id: 'fp_twisted_sermon',
      name: 'Twisted Sermon',
      description: 'Deliver a dark sermon that inflicts psychic damage and causes paranoia.',
      spellType: 'ACTION',
      icon: 'spell_shadow_psychicscream',
      school: 'Psychic',
      level: 5,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'aoe',
        rangeType: 'cone',
        aoeSize: 30
      },

      durationConfig: {
        durationType: 'rounds',
        durationAmount: 2
      },

      resourceCost: {
        mana: 28,
        components: ['verbal'],
        verbalText: 'Dark sermon in twisted language'
      },

      resolution: 'SAVING_THROW',
      savingThrow: {
        attribute: 'WISDOM',
        dc: 'SPELL_DC',
        onSuccess: 'half_damage',
        onFailure: 'full_damage_and_paranoia'
      },

      damageConfig: {
        formula: '4d6',
        modifier: 'INTELLIGENCE',
        damageType: 'psychic',
        attackType: 'spell_save'
      },

      effects: {
        damage: {
          instant: {
            amount: '4d6 + INT',
            type: 'psychic',
            description: 'Psychic damage to all in cone'
          }
        },
        condition: {
          type: 'paranoid',
          duration: '2 rounds',
          description: 'Failed saves also cause paranoia (see allies as enemies)'
        }
      },

      specialMechanics: {
        madnessGeneration: {
          enabled: true,
          formula: '1d6',
          description: 'Generates 1d6 Madness Points when cast'
        }
      },

      flavorText: 'False words. True madness. Inevitable betrayal.'
    },

    {
      id: 'fp_befoul',
      name: 'Befoul',
      description: 'Befoul an area with dark energy, creating hazardous terrain.',
      spellType: 'ACTION',
      icon: 'spell_shadow_plaguecloud',
      school: 'Conjuration',
      level: 3,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'ground',
        rangeType: 'ranged',
        rangeDistance: 40,
        aoeType: 'radius',
        aoeSize: 20
      },

      durationConfig: {
        durationType: 'rounds',
        durationAmount: 4
      },

      resourceCost: {
        mana: 15,
        components: ['verbal', 'somatic'],
        verbalText: 'Corruptio Terrae',
        somaticText: 'Sweeping gesture over ground'
      },

      resolution: 'AUTOMATIC',

      effects: {
        zone: {
          type: 'difficult_terrain',
          radius: 20,
          duration: '4 rounds',
          description: 'Area becomes difficult terrain, movement halved'
        },
        damage: {
          overTime: {
            amount: '1d6',
            type: 'necrotic',
            interval: 'round',
            duration: '4 rounds',
            description: 'Creatures starting turn in area take 1d6 necrotic damage'
          }
        }
      },

      specialMechanics: {
        madnessGeneration: {
          enabled: true,
          formula: '1d6',
          description: 'Generates 1d6 Madness Points when cast'
        }
      },

      flavorText: 'The ground itself rejects the living.'
    },

    {
      id: 'fp_black_oath',
      name: 'Black Oath',
      description: 'Swear a black oath that curses an enemy, reducing their effectiveness.',
      spellType: 'ACTION',
      icon: 'spell_shadow_curseofmannoroth',
      school: 'Curse',
      level: 4,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 50
      },

      durationConfig: {
        durationType: 'rounds',
        durationAmount: '1d4'
      },

      resourceCost: {
        mana: 18,
        components: ['verbal'],
        verbalText: 'Sacramentum Nigrum'
      },

      resolution: 'SAVING_THROW',
      savingThrow: {
        attribute: 'CHARISMA',
        dc: 'SPELL_DC',
        onSuccess: 'half_duration',
        onFailure: 'full_effect'
      },

      effects: {
        debuff: {
          type: 'disadvantage_all',
          duration: '1d4 rounds',
          description: 'Target has disadvantage on all attack rolls and saving throws'
        }
      },

      specialMechanics: {
        madnessSpending: {
          enabled: true,
          formula: '1d4',
          description: 'Spends 1d4 Madness Points when cast'
        }
      },

      flavorText: 'An oath sworn in darkness. A curse sealed in blood.'
    },

    {
      id: 'fp_isolate',
      name: 'Isolate',
      description: 'Sever a target\'s connections, preventing them from receiving healing or buffs.',
      spellType: 'ACTION',
      icon: 'spell_shadow_antishadow',
      school: 'Curse',
      level: 3,

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
        durationType: 'rounds',
        durationAmount: '1d4'
      },

      resourceCost: {
        mana: 16,
        components: ['verbal', 'somatic'],
        verbalText: 'Solitudo Aeterna',
        somaticText: 'Cutting gesture'
      },

      resolution: 'SAVING_THROW',
      savingThrow: {
        attribute: 'WISDOM',
        dc: 'SPELL_DC',
        onSuccess: 'negated',
        onFailure: 'full_effect'
      },

      effects: {
        debuff: {
          type: 'isolation',
          duration: '1d4 rounds',
          description: 'Target cannot receive healing or beneficial effects from allies'
        }
      },

      specialMechanics: {
        madnessSpending: {
          enabled: true,
          formula: '1d4',
          description: 'Spends 1d4 Madness Points when cast'
        }
      },

      flavorText: 'Alone in the void. No help. No hope. No escape.'
    },

    {
      id: 'fp_devouring_omen',
      name: 'Devouring Omen',
      description: 'Summon a terrifying apparition that frightens enemies and marks them for doom.',
      spellType: 'ACTION',
      icon: 'spell_shadow_demonicfortitude',
      school: 'Illusion',
      level: 6,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'aoe',
        rangeType: 'ranged',
        rangeDistance: 30,
        aoeType: 'radius',
        aoeSize: 15
      },

      durationConfig: {
        durationType: 'rounds',
        durationAmount: 3
      },

      resourceCost: {
        mana: 30,
        components: ['verbal', 'somatic'],
        verbalText: 'Omen Devorans',
        somaticText: 'Summoning gesture'
      },

      resolution: 'SAVING_THROW',
      savingThrow: {
        attribute: 'WISDOM',
        dc: 'SPELL_DC',
        onSuccess: 'negated',
        onFailure: 'frightened_and_disadvantage'
      },

      effects: {
        condition: {
          type: 'frightened',
          duration: '3 rounds',
          description: 'Enemies are frightened and have disadvantage on all rolls'
        },
        summon: {
          creatureType: 'apparition',
          count: 1,
          duration: '3 rounds',
          description: 'Terrifying apparition appears, causing fear'
        }
      },

      specialMechanics: {
        madnessGeneration: {
          enabled: true,
          formula: '1d8',
          description: 'Generates 1d8 Madness Points when cast'
        }
      },

      flavorText: 'They see their doom. They cannot look away.'
    }
  ]
};


