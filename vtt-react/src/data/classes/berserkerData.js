/**
 * Berserker Class Data
 * 
 * Complete class information for the Berserker - a fury-driven warrior
 * with escalating rage states and devastating combat abilities.
 */

export const BERSERKER_DATA = {
  id: 'berserker',
  name: 'Berserker',
  icon: 'fas fa-skull',
  role: 'Damage',

  // Overview section
  overview: {
    title: 'The Berserker',
    subtitle: 'Fury-Driven Warrior',

    quickOverview: {
      title: 'Quick Overview',
      content: `**What You Need to Know**: The Berserker builds Rage (0-100) through combat actions and ascends through six escalating Rage States, each unlocking more powerful abilities. The longer you fight, the stronger you become—but exceed 101 Rage without spending it and you Overheat, taking 2d6 damage and resetting to 0.

**Core Mechanic**: Attack/take damage → Build Rage → Ascend through Rage States → Spend Rage on devastating abilities → Avoid Overheat

**Resource**: Rage (0-100 scale, visualized as 2d10 dice)

**Playstyle**: Aggressive momentum-based melee, escalating power, high-risk high-reward

**Best For**: Players who enjoy building momentum, managing escalating power, and aggressive frontline combat`
    },

    description: `The Berserker harnesses their inner fury to unleash devastating attacks and gain incredible resilience. This class revolves around building and utilizing Rage, a resource that grows as they engage in combat. The Berserker's abilities scale with their Rage, becoming more powerful as their fury intensifies. By managing their Rage effectively, Berserkers can transition between different states of rage, each offering unique and potent effects.`,
    
    roleplayIdentity: {
      title: 'Roleplay Identity',
      content: `Berserkers are warriors who have learned to channel their primal fury into devastating combat prowess. Unlike controlled fighters, they embrace the chaos of battle, allowing their rage to fuel superhuman feats of strength and endurance. In roleplay, Berserkers often struggle with the line between controlled fury and mindless violence.

Their rage manifests physically: veins bulge, muscles swell, eyes blaze with fury, and their very presence becomes intimidating. At higher Rage States, they may lose the ability to speak coherently, communicating only through roars and battle cries.

Common Berserker archetypes include:
- **The Tribal Warrior**: Raised in a culture that venerates battle fury
- **The Scarred Veteran**: Years of combat have awakened an unstoppable rage
- **The Cursed Bloodline**: Born with an ancestral fury they cannot fully control
- **The Righteous Avenger**: Rage fueled by a burning need for justice or revenge`
    },
    
    combatRole: {
      title: 'Combat Role',
      content: `The Berserker is a frontline damage dealer who thrives in the thick of combat. They excel at:

**Sustained Damage**: Building Rage through combat actions creates escalating damage output
**Resilience**: Higher Rage States grant defensive bonuses and damage resistance
**Momentum**: The longer the fight, the more dangerous the Berserker becomes
**Battlefield Control**: AOE abilities and intimidating presence affect multiple enemies

However, Berserkers must carefully manage their Rage. Letting it decay wastes their potential, while letting it exceed 100 triggers Overheat, dealing massive self-damage and resetting their Rage to 0. The key is maintaining high Rage States while spending it strategically on powerful abilities.`
    },
    
    playstyle: {
      title: 'Playstyle & Strategy',
      content: `Playing a Berserker is about building and maintaining momentum. Key strategic considerations:

**Rage State Management**: 
- Smoldering (0-20): Building phase, basic abilities
- Frenzied (21-40): Combat effectiveness increases
- Primal (41-60): Significant power spike, self-sustain unlocked
- Carnage (61-80): Elite damage and defense
- Cataclysm (81-100): Peak performance, devastating abilities
- Obliteration (101+): Ultimate power but must spend immediately or Overheat

**Building Rage**: 
- Attack consistently to generate 1d6 Rage per attack
- Critical hits generate 2d6 Rage
- Taking damage generates 1d4 Rage (turn defense into offense)
- Defeating enemies generates 1d8 Rage

**Spending Rage**: 
- Use abilities at appropriate Rage States for maximum efficiency
- Don't hoard Rage—spending it prevents Overheat and unleashes power
- Time your big spenders (Carnage Strike, Cataclysmic Blow) for critical moments

**Rage Decay**: 
- Rage decreases by 5 points per round if no Rage-generating actions are taken
- Stay aggressive to maintain your Rage States

**Overheat Management**:
- If Rage exceeds 101 and isn't spent within one round, you take 2d6 damage and reset to 0
- Always have a plan to spend Rage when approaching 100`
    },

    immersiveCombatExample: {
      title: 'Combat Example: The Arena of Blood',
      content: `**The Setup**: You stand in the center of a gladiatorial arena, facing three armored pit fighters. The crowd roars for blood. Your greataxe feels light in your hands. Your Rage is at 0—for now.

**Turn 1 - First Blood (Rage: 0 → 8)**

*The first pit fighter charges. You meet him head-on, your axe swinging in a brutal arc.*

**Action**: Attack with greataxe → Hit!
**Rage Generation**: Roll 1d6 → [6] → Gain 6 Rage
**Enemy Counterattack**: Pit fighter strikes you → 8 damage taken
**Rage Generation**: Roll 1d4 → [2] → Gain 2 Rage

**Current Rage: 8** (Smoldering State)

*You feel the first stirrings of fury. Your muscles tense. Your breathing quickens. The pain from the pit fighter's blade doesn't hurt—it FUELS you.*

**Turn 2 - Building Fury (Rage: 8 → 23)**

*The second pit fighter joins the fray. Two against one. Good. More targets.*

**Action**: Attack pit fighter #1 → Hit!
**Rage Generation**: Roll 1d6 → [5] → Gain 5 Rage (now at 13)
**Action**: Second attack (using action points) → Hit!
**Rage Generation**: Roll 1d6 → [4] → Gain 4 Rage (now at 17)
**Enemy Attacks**: Both pit fighters strike you → 12 damage total
**Rage Generation**: Roll 1d4 → [6] → Gain 6 Rage (now at 23)

**Current Rage: 23** (Frenzied State - UNLOCKED!)

*Your vision starts to tinge red. Veins bulge in your neck and arms. You let out a guttural roar that echoes through the arena. The crowd goes wild. You've entered the Frenzied State—you now have +1 to all attack rolls.*

**Turn 3 - Ascending Wrath (Rage: 23 → 47)**

*The third pit fighter hesitates. He sees the fury in your eyes. Smart man. Won't save him.*

**Action**: Frenzied Slash (Rage ability) on pit fighter #1 → CRITICAL HIT!
**Rage Generation**: Roll 2d6 → [5, 6] = 11 → Gain 11 Rage (now at 34)
**Result**: Pit fighter #1 drops, blood spraying across the sand
**Rage Generation**: Defeated enemy → Roll 1d8 → [8] → Gain 8 Rage (now at 42)

**Action**: Charge pit fighter #2 → Hit!
**Rage Generation**: Roll 1d6 → [5] → Gain 5 Rage (now at 47)

**Current Rage: 47** (Primal State - UNLOCKED!)

*Something primal awakens inside you. Your muscles swell beyond natural limits. Blood from your wounds seems to flow backward, sealing cuts through sheer force of will. You've unlocked Bloodlust—you now regenerate health each turn. The crowd's roar fades to a dull hum. All you hear is your heartbeat. All you see is prey.*

**Turn 4 - Peak Carnage (Rage: 47 → 73)**

*Two pit fighters remain. They're backing away. Cowards.*

**Passive**: Bloodlust activates → Heal 1d8 HP → [6] → Regain 6 HP
**Action**: Primal Roar (AoE intimidation + damage)
**Rage Cost**: Spend 10 Rage (now at 37)
**Effect**: Both pit fighters take 2d6 damage and are frightened
**Action**: Attack frightened pit fighter #2 → Hit with advantage!
**Rage Generation**: Roll 1d6 → [6] → Gain 6 Rage (now at 43)
**Action**: Second attack → Hit!
**Rage Generation**: Roll 1d6 → [4] → Gain 4 Rage (now at 47)
**Enemy Attacks**: Pit fighter #3 attacks with disadvantage (frightened) → Misses!

*You laugh. A sound like grinding stone. You attack again.*

**Action**: Third attack (spending action points) → CRITICAL HIT!
**Rage Generation**: Roll 2d6 → [6, 5] = 11 → Gain 11 Rage (now at 58)
**Result**: Pit fighter #2 falls, skull caved in
**Rage Generation**: Defeated enemy → Roll 1d8 → [7] → Gain 7 Rage (now at 65)

**Current Rage: 65** (Carnage State - UNLOCKED!)

*Your body is a weapon. Your axe is just an extension of your will. You've reached Carnage State—+3 to attack rolls, damage resistance activated. The last pit fighter drops his weapon and runs. The crowd screams for you to finish him.*

**Turn 5 - The Overheat Danger (Rage: 65 → 98)**

*You chase him down. He's fast. You're faster.*

**Action**: Carnage Strike (massive Rage-fueled attack)
**Rage Cost**: Spend 15 Rage (now at 50)
**Effect**: 4d10 damage → Pit fighter #3 is nearly dead
**Rage Generation**: Roll 1d6 → [6] → Gain 6 Rage (now at 56)

**Action**: Basic attack to finish him → Hit!
**Rage Generation**: Roll 1d6 → [5] → Gain 5 Rage (now at 61)
**Result**: Pit fighter #3 dies
**Rage Generation**: Defeated enemy → Roll 1d8 → [8] → Gain 8 Rage (now at 69)

*The crowd erupts. They want MORE. They throw weapons into the arena. A massive armored champion enters—the Arena Master himself.*

**Action**: You roar and charge → Hit!
**Rage Generation**: Roll 1d6 → [6] → Gain 6 Rage (now at 75)
**Enemy Attack**: Arena Master's massive hammer strikes you → 15 damage!
**Rage Generation**: Roll 1d4 → [4] → Gain 4 Rage (now at 79)
**Action**: Second attack → CRITICAL HIT!
**Rage Generation**: Roll 2d6 → [6, 6] = 12 → Gain 12 Rage (now at 91)
**Action**: Third attack → Hit!
**Rage Generation**: Roll 1d6 → [5] → Gain 5 Rage (now at 96)
**Enemy Attack**: Arena Master strikes again → 12 damage!
**Rage Generation**: Roll 1d4 → [2] → Gain 2 Rage (now at 98)

**Current Rage: 98** (Cataclysm State - DANGER ZONE!)

*You're at the peak. Your body is beyond mortal limits. +4 to attack rolls. Immune to fear, stun, paralysis. But you're approaching the edge. Two more points and you'll hit Obliteration. Three more and you risk Overheat.*

**Turn 6 - Controlled Destruction (Rage: 98 → 35)**

*You need to spend this Rage NOW or it will consume you.*

**Action**: Cataclysmic Blow (ultimate Rage ability)
**Rage Cost**: Spend 50 Rage (now at 48)
**Effect**: 6d12 damage + knockback + stun
**Result**: Arena Master is staggered, armor cracked, bleeding heavily

*You feel the fury drain from you like water from a broken dam. Your vision clears slightly. Your muscles ache. But you're still in Primal State (48 Rage), still dangerous.*

**Action**: Attack while he's stunned → Hit!
**Rage Generation**: Roll 1d6 → [3] → Gain 3 Rage (now at 51)
**Action**: Second attack → Hit!
**Rage Generation**: Roll 1d6 → [4] → Gain 4 Rage (now at 55)
**Result**: Arena Master falls to his knees, defeated

*You stand over him, axe raised. The crowd chants your name. Your Rage slowly begins to decay (55 → 50 → 45...), but the battle is won.*

**The Lesson**: The Berserker is about riding the wave of fury—building it through aggression, spending it before it consumes you, and knowing when to unleash your most devastating abilities. You're not just managing a resource; you're wrestling with a beast inside you that wants to break free.`
    }
  },
  
  // Resource System
  resourceSystem: {
    title: 'Rage States',
    subtitle: 'Escalating Fury Mechanic',

    description: `The Berserker's Rage is measured on a scale from 0 to 100, represented by two 10-sided dice (2d10). As they fight, the Berserker generates Rage through various actions, allowing them to access increasingly powerful states of rage. Each Rage State unlocks new abilities and enhances the Berserker's combat effectiveness. This is a momentum-based resource system where aggression is rewarded and passivity is punished.`,

    resourceBarExplanation: {
      title: 'Understanding Your Rage Bar',
      content: `**What You See**: Your Berserker resource bar displays two 10-sided dice (2d10) that together represent your current Rage from 0 to 100. The left die shows the tens place (0-90), the right die shows the ones place (0-10). The dice glow with increasing intensity as your Rage rises, changing color to reflect your current Rage State.

**Visual Representation by State**:
- **Smoldering (0-20)**: Dim orange glow, barely visible embers
- **Frenzied (21-40)**: Bright orange, flickering flames
- **Primal (41-60)**: Red-orange, intense burning
- **Carnage (61-80)**: Deep red, roiling inferno
- **Cataclysm (81-100)**: Crimson with black edges, barely contained
- **Obliteration (101+)**: Violent purple-black, pulsing with danger

**How It Changes**:
- **When You Attack**: Dice spin and increase by 1d6 (average +3-4 per attack)
- **When You Crit**: Dice spin rapidly and jump by 2d6 (average +7)
- **When You Take Damage**: Dice pulse and increase by 1d4 (pain fuels rage)
- **When You Kill**: Dice explode upward by 1d8 (bloodlust surge)
- **When You Spend Rage**: Dice decrease by the ability cost, glow dims slightly
- **Passive Decay**: If you don't attack for a full round, dice slowly tick down by 5

**State Transition Moments**: When you cross a Rage State threshold (e.g., 40 → 41 entering Primal), your dice flash brightly and a visual effect plays—your character model changes, muscles bulge, eyes glow, aura intensifies. This is your power-up moment.

**The Overheat Warning**: When your Rage exceeds 100, the dice turn purple-black and pulse with a warning indicator. You have ONE ROUND to spend Rage below 101 or you'll Overheat—taking 2d6 damage and resetting to 0. The bar literally shakes and cracks to warn you.

**Why This Matters**: Unlike mana that you conserve, Rage is meant to be SPENT. Your resource bar isn't a savings account—it's a pressure gauge. The higher it climbs, the more powerful you become, but also the closer you are to exploding. Learning to ride the edge between Cataclysm (81-100) and Obliteration (101+) is the mark of a master Berserker.

**Strategic Depth**: Your Rage bar tells a story of the battle. A slowly climbing bar means you're building momentum. A rapidly fluctuating bar means you're spending and building in rhythm. A bar stuck at low Rage means you're not being aggressive enough. A bar at 95+ means you're playing with fire—literally.`
    },

    mechanics: {
      title: 'Detailed Mechanics',
      content: `**Rage Scale**:
- Ranges from 0 to 100 (can temporarily exceed 100)
- Visualized as 2d10 (left die = tens, right die = ones)
- Example: Left die shows 6, right die shows 3 = 63 Rage

**Generating Rage (How to Build Fury)**:

Every combat action that involves aggression or pain generates Rage:

- **Normal Attack (Hit)**: Roll 1d6, add result to Rage
  - Example: You have 25 Rage, attack and roll [4] → Now at 29 Rage

- **Critical Hit**: Roll 2d6, add result to Rage
  - Example: You have 45 Rage, crit and roll [5, 6] = 11 → Now at 56 Rage (jumped from Primal to Carnage!)

- **Taking Damage**: Roll 1d4, add result to Rage (pain fuels fury)
  - Example: You have 30 Rage, take 15 damage, roll [3] → Now at 33 Rage

- **Defeating an Enemy**: Roll 1d8, add result to Rage (bloodlust surge)
  - Example: You have 52 Rage, kill an enemy, roll [7] → Now at 59 Rage

**Spending Rage (How to Use Fury)**:

Berserker abilities cost Rage to activate. Higher-tier abilities cost more but deal devastating damage:

- **Basic Abilities**: 5-10 Rage (Frenzied Slash, War Cry)
- **Moderate Abilities**: 15-25 Rage (Primal Roar, Carnage Strike)
- **Ultimate Abilities**: 40-60 Rage (Cataclysmic Blow, Obliterating Strike)

Example: You're at 68 Rage (Carnage State). You use Carnage Strike (costs 20 Rage) → Now at 48 Rage (dropped to Primal State)

**Rage Decay (Punishment for Passivity)**:

At the end of each combat round, if you took NO Rage-generating actions (didn't attack, didn't take damage), your Rage decreases by 5 points.

Example: You're at 55 Rage but spend your turn running away and hiding → End of round: 55 - 5 = 50 Rage

**Overheat (The Danger Zone)**:

If your Rage exceeds 101 and you don't spend it below 101 within ONE ROUND, you Overheat:
- Take 2d6 damage (your fury turns inward, damaging you)
- Rage resets to 0 (complete exhaustion)
- Lose all Rage State benefits

Example: You're at 98 Rage, crit for 2d6 = [6, 5] = 11 → Now at 109 Rage (DANGER!)
- Next round: You MUST spend at least 9 Rage to get below 101
- If you don't: Roll 2d6 = [4, 3] = 7 damage taken, Rage resets to 0, you're back to Smoldering

**Rage State Thresholds**:

Your current Rage determines which state you're in and what bonuses you receive:
- 0-20: Smoldering (no bonuses)
- 21-40: Frenzied (+1 attack)
- 41-60: Primal (+2 attack, healing)
- 61-80: Carnage (+3 attack, damage resistance)
- 81-100: Cataclysm (+4 attack, condition immunity)
- 101+: Obliteration (+5 attack, MUST SPEND OR OVERHEAT)`
    },
    
    rageStatesTable: {
      title: 'Rage States & Abilities',
      headers: ['Rage State', 'Rage Range', 'Unlocked Abilities', 'State Benefits'],
      rows: [
        ['Smoldering', '0-20', 'Basic Strike, Defensive Stance', 'Building fury, basic combat effectiveness'],
        ['Frenzied', '21-40', 'Frenzied Slash, War Cry', '+1 to attack rolls, allies gain morale'],
        ['Primal', '41-60', 'Primal Roar, Bloodlust', '+2 to attack rolls, self-healing unlocked'],
        ['Carnage', '61-80', 'Carnage Strike, Raging Defense', '+3 to attack rolls, damage resistance'],
        ['Cataclysm', '81-100', 'Cataclysmic Blow, Unstoppable Force', '+4 to attack rolls, condition immunity'],
        ['Obliteration', '101+', 'Obliterating Strike, Wrath of the Berserker', '+5 to attack rolls, must spend or Overheat']
      ]
    },
    
    strategicConsiderations: {
      title: 'Strategic Considerations',
      content: `**Early Combat (0-40 Rage)**: Focus on building Rage through attacks. Use basic abilities sparingly to conserve Rage for higher states.

**Mid Combat (41-80 Rage)**: Your sweet spot. Primal and Carnage states offer excellent damage and survivability. Alternate between spending and building.

**Peak Fury (81-100 Rage)**: Unleash devastating abilities. Plan your spending carefully—you're at maximum effectiveness but approaching Overheat threshold.

**Overheat Zone (101+ Rage)**: Emergency state. You have one round to spend excess Rage or suffer 2d6 damage and reset. Use your most expensive abilities immediately.

**Rage Decay Management**: Never let Rage decay passively. If combat is winding down, spend remaining Rage on utility abilities or defensive buffs rather than losing it.`
    },

    overheatVisualization: {
      title: 'Overheat Visualization & Effects',
      content: `**What Happens When You Overheat (101+ Rage)**:

Your Rage bar undergoes a dramatic visual transformation to warn you of the danger:

**Visual Indicators**:
- **Dice Color**: Shifts from crimson red to violent purple-black
- **Glow Effect**: Intensifies dramatically, creating a pulsing aura around the dice
- **Dice Animation**: The dice begin to SHAKE and VIBRATE violently, as if barely contained
- **Warning Symbol**: A ⚠️ warning icon appears and pulses in sync with the dice
- **Aura Pulse**: A red pulsing aura expands and contracts around the dice, growing more intense
- **Screen Effect**: The entire resource bar area may have a subtle red tint or vignette effect

**The Countdown**:
Once you exceed 100 Rage, you have exactly ONE ROUND to act:
- **Round 1 (Overheat Triggered)**: Dice shake, warning appears, you can still act
- **End of Round 1**: If Rage is still 101+, you Overheat
  - Take 2d6 damage (your fury turns inward)
  - Rage resets to 0 (complete exhaustion)
  - Dice stop shaking and return to normal (Smoldering state)
  - You lose all Rage State bonuses

**How to Avoid Overheat**:
Spend Rage-costing abilities to bring yourself below 101. The more Rage you have over 100, the more you need to spend:
- 101 Rage: Spend 1+ Rage to get to 100
- 109 Rage: Spend 9+ Rage to get to 100
- 115 Rage: Spend 15+ Rage to get to 100

**Strategic Use of Overheat**:
Some advanced Berserkers intentionally push into Overheat to use their most powerful abilities (Obliterating Strike, Wrath of the Berserker) knowing they'll take the damage. This is high-risk, high-reward play—use it when you're confident you can finish the fight or when the damage is worth the payoff.

**Example Overheat Scenario**:
- You're at 95 Rage (Cataclysm)
- You crit and roll 2d6 = [6, 5] = 11 → Now at 106 Rage (OVERHEAT!)
- Dice turn purple-black and shake violently
- You have ONE ROUND to act
- Option A: Use Obliterating Strike (costs 60 Rage) → Drop to 46 Rage (Primal), avoid Overheat
- Option B: Do nothing → End of round: Take 2d6 damage, Rage resets to 0
- Option C: Use a cheaper ability (costs 10 Rage) → Drop to 96 Rage, avoid Overheat but waste potential`
    },

    practicalExample: {
      title: 'Practical Decision-Making Example',
      content: `**Scenario**: You're at 87 Rage (Cataclysm State) fighting a boss with 40% HP remaining. Your party's healer is down to 20% HP.

**Current State**:
- Rage: 87 (Cataclysm - +4 attack, condition immunity)
- Boss HP: ~40%
- Healer HP: ~20% (in danger)
- Your HP: 65%

**Option A - Go for the Kill**:
Use Cataclysmic Blow (costs 50 Rage, deals 6d12 damage)
- Pros: Massive damage, might finish the boss
- Cons: Drops you to 37 Rage (Primal State), lose +4 attack bonus, lose condition immunity
- Risk: If boss survives, you're weaker for the rest of the fight

**Option B - Sustain and Build**:
Use Primal Roar (costs 10 Rage, AoE damage + intimidate)
- Pros: Stays at 77 Rage (still Carnage State), keeps high bonuses
- Cons: Less burst damage, boss might kill healer
- Risk: Healer dies, you lose support

**Option C - Controlled Aggression**:
Normal attacks to build more Rage, then use Obliterating Strike next turn
- Pros: Attack twice, generate ~8 more Rage (95 total), then use ultimate ability
- Cons: Approaching Overheat danger zone (95 → one good crit puts you at 101+)
- Risk: Might Overheat if you crit

**Option D - Emergency Overheat Strategy**:
Attack recklessly to push past 101, then immediately use Obliterating Strike (costs 60 Rage)
- Pros: Briefly access Obliteration State (+5 attack), then spend before Overheat
- Cons: Requires precise timing, risky if you miss
- Risk: If you can't spend in time, you Overheat and reset to 0

**Best Choice**: Option A (Cataclysmic Blow)
- Why: Boss at 40% HP means one massive hit could end the fight. Healer survives if boss dies. Even if you drop to Primal State (37 Rage), the fight might be over. The risk of the boss surviving and killing your healer while you're at lower Rage is less than the reward of potentially ending the encounter immediately.

**Alternative if Boss is Tankier**: Option C (Build to 95+, then Obliterating Strike)
- Why: If you know the boss has high HP and won't die to Cataclysmic Blow, building to Obliteration State for the +5 attack bonus on your ultimate ability is worth the Overheat risk.

**The Lesson**: Rage management isn't just about avoiding Overheat—it's about knowing when to cash in your fury for maximum impact. Sometimes dropping from Cataclysm to Primal is worth it if it ends the fight. Sometimes riding the edge of Obliteration is the only way to win. Read the situation, trust your instincts, and let the fury guide you.`
    },

    playingInPerson: {
      title: 'Playing in Person',
      subtitle: 'Physical Tracking for Tabletop Play',
      content: `The Berserker's Rage system (0-100 scale with six escalating states) is perfectly suited to physical dice tracking, creating a visceral, momentum-driven experience. Here's how to track your fury at the table:

**Required Materials**:
- **2d10 dice** (preferably red/orange for thematic effect)
- **Rage State reference card** with state thresholds and bonuses
- **Optional: Rage tracker mat** with state zones marked

**Rage Tracking with 2d10**:

**The Two-Dice Method** (Recommended):

Use two 10-sided dice to represent your Rage (0-100):
- **Left Die (Tens Place)**: Shows 0-9, representing 0, 10, 20, 30, 40, 50, 60, 70, 80, 90
- **Right Die (Ones Place)**: Shows 0-9, representing 0-9
- **Combined**: Left die × 10 + Right die = Total Rage

**Examples**:
- Left die [6], Right die [3] = 63 Rage (Carnage State)
- Left die [4], Right die [7] = 47 Rage (Primal State)
- Left die [9], Right die [5] = 95 Rage (Cataclysm State, approaching Overheat!)
- Left die [0], Right die [0] = 0 Rage (Smoldering State)

**Generating Rage**:
When you perform Rage-generating actions, roll the appropriate die and add to your current Rage:
- **Normal Attack**: Roll 1d6 → Add result to Rage → Adjust dice
  - Example: At 25 Rage [2][5], attack and roll [4] → 25 + 4 = 29 → Set dice to [2][9]
- **Critical Hit**: Roll 2d6 → Add result to Rage → Adjust dice
  - Example: At 45 Rage [4][5], crit and roll [5, 6] = 11 → 45 + 11 = 56 → Set dice to [5][6]
- **Taking Damage**: Roll 1d4 → Add result to Rage → Adjust dice
  - Example: At 30 Rage [3][0], take damage and roll [3] → 30 + 3 = 33 → Set dice to [3][3]
- **Defeating Enemy**: Roll 1d8 → Add result to Rage → Adjust dice
  - Example: At 52 Rage [5][2], kill enemy and roll [7] → 52 + 7 = 59 → Set dice to [5][9]

**Spending Rage**:
When you use abilities, subtract the Rage cost and adjust dice:
- **Primal Roar (10 Rage)**: At 77 Rage [7][7] → 77 - 10 = 67 → Set dice to [6][7]
- **Carnage Strike (30 Rage)**: At 87 Rage [8][7] → 87 - 30 = 57 → Set dice to [5][7]
- **Cataclysmic Blow (50 Rage)**: At 87 Rage [8][7] → 87 - 50 = 37 → Set dice to [3][7]

**Rage Decay**:
If you don't attack for a full round, subtract 5 Rage:
- Example: At 42 Rage [4][2], no attack this round → 42 - 5 = 37 → Set dice to [3][7]

**Overheat Mechanic**:
If your Rage exceeds 100:
- **Warning**: Your dice show 101+ (e.g., [10][1] or higher)
- **Countdown**: You have ONE ROUND to spend Rage below 101
- **Overheat**: If you don't spend in time, roll 2d6 damage to yourself and reset dice to [0][0]

**Rage State Reference Card Template**:
\`\`\`
BERSERKER RAGE STATES

SMOLDERING (0-20)
Bonuses: None
Abilities: Basic attacks only

FRENZIED (21-40)
Bonuses: +1 attack, +5 movement
Abilities: Frenzied Strike, Rage Shout

PRIMAL (41-60)
Bonuses: +2 attack, +10 movement, +1d4 damage
Abilities: Primal Roar, Savage Leap

CARNAGE (61-80)
Bonuses: +3 attack, +15 movement, +1d6 damage, +2 AC
Abilities: Carnage Strike, Intimidating Presence

CATACLYSM (81-100)
Bonuses: +4 attack, +20 movement, +1d8 damage, +3 AC
Abilities: Cataclysmic Blow, Unstoppable Force

OBLITERATION (101+)
Bonuses: +5 attack, +25 movement, +2d6 damage, +4 AC
Abilities: Obliterating Strike (60 Rage)
WARNING: Spend Rage or Overheat (2d6 damage, reset to 0)!
\`\`\`

**Example In-Person Turn**:

*You have 45 Rage [4][5] (Primal State)*

**Turn 1 - Attack**:
1. "I attack the orc with my greataxe!"
2. Roll to hit → Hit!
3. Roll Rage generation: 1d6 → [4]
4. Add to Rage: 45 + 4 = 49
5. Adjust dice: [4][5] → [4][9]
6. Still in Primal State (41-60)

**Turn 2 - Critical Hit**:
1. "I attack again!"
2. Roll to hit → Natural 20! Critical hit!
3. Roll Rage generation: 2d6 → [5, 6] = 11
4. Add to Rage: 49 + 11 = 60
5. Adjust dice: [4][9] → [6][0]
6. Still in Primal State (barely!)

**Turn 3 - State Transition**:
1. "I attack the goblin!"
2. Roll to hit → Hit!
3. Roll Rage generation: 1d6 → [3]
4. Add to Rage: 60 + 3 = 63
5. Adjust dice: [6][0] → [6][3]
6. **RAGE STATE CHANGE**: Entered Carnage State! (61-80)
7. Announce: "My fury intensifies! I enter Carnage State!"
8. New bonuses: +3 attack, +15 movement, +1d6 damage, +2 AC

**Turn 4 - Spending Rage**:
1. "I use Carnage Strike!" (costs 30 Rage)
2. Subtract Rage: 63 - 30 = 33
3. Adjust dice: [6][3] → [3][3]
4. **RAGE STATE CHANGE**: Dropped to Frenzied State (21-40)
5. Roll damage with Carnage Strike bonus
6. New bonuses: +1 attack, +5 movement (lost Carnage bonuses)

**Alternative Tracking Methods**:

**The Single d100 Method**:
- Use a d100 (percentile die) to track Rage directly
- Roll Rage generation dice and add to d100 value
- Simpler but less thematic than 2d10

**The Token Method**:
- Use 100 tokens or beads to represent Rage
- Add/remove tokens as Rage changes
- Visual but cumbersome for large numbers

**The Tracker Mat Method**:
- Print a mat with zones for each Rage State (0-20, 21-40, 41-60, 61-80, 81-100, 101+)
- Use a marker or token to show current Rage within each zone
- Visual state tracking but requires custom mat

**The Paper Method**:
- Write current Rage on paper, update as needed
- Functional but less immersive

**Thematic Enhancements**:

Many players enhance the rage experience with:
- **Red/Orange Dice**: Use fiery-colored d10s for thematic effect
- **Rage Tracker Mat**: Print a mat with state zones and bonuses
- **Physical Intensity**: Speak louder/more aggressively as Rage increases
- **Dice Slamming**: Slam dice down when entering new Rage States
- **Overheat Warning**: Use a timer or alarm when at 101+ Rage

**Quick Reference: Rage Generation**:
\`\`\`
RAGE GENERATION:
• Normal Attack (Hit): +1d6 Rage
• Critical Hit: +2d6 Rage
• Taking Damage: +1d4 Rage
• Defeating Enemy: +1d8 Rage
• Rage Decay (No Attack): -5 Rage per round

OVERHEAT:
• Rage exceeds 100: WARNING!
• 1 round to spend below 101
• Fail to spend: 2d6 damage, reset to 0
\`\`\`

**Example Full Combat Sequence**:

*Starting: 0 Rage [0][0] (Smoldering)*

**Turn 1**: Attack (hit) → Roll [4] → 4 Rage [0][4] (Smoldering)
**Turn 2**: Attack (hit) → Roll [5] → 9 Rage [0][9] (Smoldering)
**Turn 3**: Attack (hit) → Roll [6] → 15 Rage [1][5] (Smoldering)
**Turn 4**: Attack (crit!) → Roll [5, 6] = 11 → 26 Rage [2][6] (Frenzied!)
**Turn 5**: Attack (hit) → Roll [4] → 30 Rage [3][0] (Frenzied)
**Turn 6**: Attack (hit) → Roll [6] → 36 Rage [3][6] (Frenzied)
**Turn 7**: Attack (hit) → Roll [5] → 41 Rage [4][1] (Primal!)
**Turn 8**: Use Primal Roar (10 Rage) → 31 Rage [3][1] (Frenzied)
**Turn 9**: Attack (hit) → Roll [6] → 37 Rage [3][7] (Frenzied)
**Turn 10**: Attack (crit!) → Roll [6, 5] = 11 → 48 Rage [4][8] (Primal!)

**State Transition Announcements**:

When you cross a Rage State threshold, announce it dramatically:
- **Entering Frenzied**: "My blood boils! I enter Frenzied State!"
- **Entering Primal**: "Primal fury awakens! I enter Primal State!"
- **Entering Carnage**: "Carnage consumes me! I enter Carnage State!"
- **Entering Cataclysm**: "Cataclysmic power surges! I enter Cataclysm State!"
- **Entering Obliteration**: "OBLITERATION! I am unstoppable!" (then immediately spend or Overheat!)

**Why This System Works**: The physical act of rolling dice to generate Rage, adjusting your 2d10 to show increasing fury, and watching your Rage climb through escalating states creates MOMENTUM. You can SEE your power growing, FEEL the tension as you approach Overheat, and EXPERIENCE the satisfaction of spending massive Rage on devastating abilities. The 2d10 system makes Rage tangible—it's not an abstract number, it's two dice sitting in front of you, showing your current fury level at a glance.

**Pro Tips**:
- **State Awareness**: Glance at your dice to know your current state instantly
- **Overheat Planning**: When approaching 80+ Rage, plan your next Rage-spending ability
- **Decay Prevention**: Attack every round to avoid -5 Rage decay
- **Crit Fishing**: At 90+ Rage, avoid crits (they might push you to Overheat)
- **Strategic Spending**: Don't hoard Rage—spending it prevents Overheat and unleashes power

**Budget-Friendly Alternatives**:
- **No d10s?** Use a d100 or track on paper
- **No colored dice?** Use any d10s, just label them "Tens" and "Ones"
- **Minimalist**: Just write Rage value on paper and update

**Why Berserker Is Perfect for In-Person Play**: The class is built around a simple, visceral mechanic: build Rage through combat, watch it climb through escalating states, spend it on devastating abilities, and avoid Overheat. The 2d10 system makes this tangible and immediate—you can see your fury growing with every attack, feel the tension as you approach 100, and experience the rush of spending massive Rage on game-changing abilities. The physical dice create a visual representation of your character's escalating fury, making every combat feel like a building crescendo of violence and power.`
    }
  },
  
  // Specializations
  specializations: {
    title: 'Berserker Specializations',
    subtitle: 'Three Paths of Fury',
    
    description: `Every Berserker chooses one of three specializations that define their approach to rage-fueled combat. Each specialization offers unique passive abilities and influences your Rage management strategy.`,
    
    specs: [
      {
        id: 'savage',
        name: 'Savage',
        icon: 'ability_warrior_intensifyrage',
        color: '#8B0000',
        theme: 'Relentless Aggression',
        
        description: `The Savage specialization embodies pure, unrelenting aggression. Savage Berserkers build Rage faster and hit harder, ascending through Rage States rapidly to overwhelm enemies with brutal force.`,
        
        playstyle: 'Fast Rage generation, aggressive offense, rapid state transitions',
        
        strengths: [
          'Generate +2 Rage from all sources',
          'Critical hit chance increased by 10%',
          'Abilities cost 5 less Rage',
          'Faster ascension through Rage States'
        ],
        
        weaknesses: [
          'More prone to Overheat',
          'Limited defensive options',
          'Requires constant aggression',
          'Vulnerable when Rage is low'
        ],
        
        keyAbilities: [
          'Savage Strikes: Critical hits generate additional Rage',
          'Bloodthirst: Heal for a portion of damage dealt',
          'Reckless Abandon: Trade defense for offense at high Rage'
        ],
        
        specPassive: {
          name: 'Unrelenting Fury',
          description: 'Generate +2 Rage from all sources. Critical hits have a 25% chance to not consume Rage when using abilities.'
        }
      },
      {
        id: 'juggernaut',
        name: 'Juggernaut',
        icon: 'ability_warrior_shieldmastery',
        color: '#4169E1',
        theme: 'Immovable Force',

        description: `The Juggernaut specialization focuses on resilience and endurance. Juggernaut Berserkers use their Rage to become nearly unkillable, standing firm against overwhelming odds while their fury makes them stronger.`,

        playstyle: 'Defensive Rage usage, damage mitigation, sustained combat',

        strengths: [
          'Gain temporary HP equal to Rage spent',
          'Damage resistance scales with Rage State',
          'Rage Decay reduced by 50%',
          'Can maintain high Rage States longer'
        ],

        weaknesses: [
          'Lower damage output',
          'Slower Rage generation',
          'Abilities cost more Rage',
          'Less burst potential'
        ],

        keyAbilities: [
          'Juggernaut\'s Endurance: Convert Rage into temporary HP',
          'Immovable Object: Become immune to forced movement',
          'Rage Armor: AC increases with Rage State'
        ],

        specPassive: {
          name: 'Juggernaut Resilience',
          description: 'Rage Decay reduced by 50%. Gain damage resistance equal to 5% per Rage State (max 30% at Obliteration).'
        }
      },
      {
        id: 'warlord',
        name: 'Warlord',
        icon: 'ability_warrior_battleshout',
        color: '#DAA520',
        theme: 'Tactical Fury',
        
        description: `The Warlord specialization combines rage with tactical awareness. Warlord Berserkers inspire allies, control the battlefield, and use their fury strategically rather than recklessly.`,
        
        playstyle: 'Team support, battlefield control, balanced Rage management',
        
        strengths: [
          'Abilities affect multiple allies',
          'War Cry grants team-wide buffs',
          'Can share Rage benefits with party',
          'Excellent in group combat'
        ],
        
        weaknesses: [
          'Less effective solo',
          'Moderate damage output',
          'Requires coordination',
          'Abilities have longer cooldowns'
        ],
        
        keyAbilities: [
          'Inspiring Presence: Allies within 30 feet gain bonus damage',
          'Commanding Shout: Grant allies temporary Rage benefits',
          'Tactical Fury: Spend Rage to grant allies advantage on attacks'
        ],
        
        specPassive: {
          name: 'Warlord\'s Command',
          description: 'War Cry and similar abilities grant allies +1 to attack and damage rolls per your Rage State (max +6). Allies within 30 feet gain +5 Rage when you defeat an enemy.'
        }
      }
    ]
  },
  
  // Complete Spell System - organized by Rage States and Level
  spells: [
    // ========================================
    // LEVEL 1 SPELLS - Basic Abilities
    // ========================================

    {
      id: 'berserk_basic_strike',
      name: 'Basic Strike',
      description: 'You channel the first stirrings of your inner fury into a devastating melee attack. As you swing, you can feel the rage building within you—a heat that starts in your chest and spreads through your arms, making every muscle burn with power. The strike itself is deceptively simple, but it carries the weight of your growing fury. With each successful hit, you feel the beast within you grow stronger, hungrier. Your vision begins to tinge red at the edges, and you can hear your own heartbeat thundering in your ears. This is the foundation of your power—every swing is a step closer to unleashing the full force of your rage.',
      level: 1,
      spellType: 'ACTION',
      icon: 'ability_warrior_savageblow',

      typeConfig: {
        school: 'bludgeoning',
        icon: 'ability_warrior_savageblow',
        tags: ['melee', 'damage', 'rage_generation', 'starter'],
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
        somaticText: 'Swing weapon with controlled fury, feeling the rage build with each motion'
      },

      resolution: 'DICE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '1d8 + strength',
        elementType: 'bludgeoning',
        damageType: 'direct',
        description: 'The strike lands with brutal force, driven by your growing rage. Each successful hit feeds the fury within you, and you can feel your power escalating with every blow.'
      },

      cooldownConfig: {
        type: 'none'
      },

      tags: ['melee', 'damage', 'rage_generation', 'starter', 'berserker']
    },

    {
      id: 'berserk_defensive_stance',
      name: 'Defensive Stance',
      description: 'Brace yourself in an unbreakable defensive posture. Your fury hardens your resolve, turning every attack against you into fuel for your rage. Only one stance can be active at a time.',
      level: 1,
      spellType: 'PASSIVE',
      icon: 'ability_warrior_defensivestance',

      typeConfig: {
        school: 'bludgeoning',
        icon: 'ability_warrior_defensivestance',
        tags: ['defense', 'buff', 'rage_generation', 'stance', 'toggleable', 'starter'],
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
          id: 'defensive_stance_ac',
          name: 'Iron Defense',
          description: 'Gain +2 armor. Your fury hardens your resolve, turning every attack against you into fuel for your rage',
          statModifier: {
            stat: 'armor',
            magnitude: 2,
            magnitudeType: 'flat'
          }
        }, {
          id: 'defensive_stance_rage_gen',
          name: 'Rage Fuel',
          description: 'Attacks against you generate +1 additional Rage (2 Rage total instead of 1)',
          statModifier: {
            stat: 'rageGeneration',
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

      tags: ['defense', 'buff', 'rage_generation', 'stance', 'toggleable', 'starter', 'berserker']
    },

    {
      id: 'berserk_rage_tap',
      name: 'Rage Tap',
      description: 'Plunge deep into your primal fury, awakening the beast within. Your attacks become more ferocious, and every strike feeds the growing storm of rage inside you. Only one stance can be active at a time.',
      level: 1,
      spellType: 'PASSIVE',
      icon: 'ability_warrior_bloodbath',

      typeConfig: {
        school: 'bludgeoning',
        icon: 'ability_warrior_bloodbath',
        tags: ['buff', 'rage_generation', 'damage', 'stance', 'toggleable', 'starter'],
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
          id: 'primal_awakening',
          name: 'Primal Awakening',
          description: 'Your attacks deal bonus damage. The beast within stirs, making your strikes more savage and your rage burn brighter',
          damageFormula: '+1d4',
          statModifier: {
            stat: 'damage',
            magnitude: '1d4',
            magnitudeType: 'flat'
          }
        }, {
          id: 'rage_tap_generation',
          name: 'Rage Surge',
          description: 'Successful attacks generate +1 additional Rage (2 Rage total instead of 1). Every strike feeds the growing storm of rage inside you',
          statModifier: {
            stat: 'rageGeneration',
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

      tags: ['buff', 'rage_generation', 'damage', 'stance', 'toggleable', 'starter', 'berserker']
    },

    // ========================================
    // LEVEL 2 SPELLS - Enhanced Abilities
    // ========================================

    {
      id: 'berserk_frenzied_slash',
      name: 'Frenzied Slash',
      description: 'Your rage has reached the Frenzied state, and now the beast within you breaks free. Your vision completely tints red, and the world narrows to nothing but your target. You unleash a whirlwind of savage strikes, each one faster and more brutal than the last. Your weapon becomes an extension of your fury, moving with impossible speed as you strike again and again. The strikes are not controlled—they are pure, unadulterated violence, driven by the primal need to destroy. Blood sprays with each hit, and you can feel the rage surging through your veins like liquid fire. On critical hits, the force of your fury is so overwhelming that it sends enemies flying backward, their bodies unable to withstand the raw power of your unleashed rage.',
      level: 2,
      spellType: 'ACTION',
      icon: 'ability_warrior_cleave',

      typeConfig: {
        school: 'bludgeoning',
        icon: 'ability_warrior_cleave',
        tags: ['melee', 'damage', 'rage_generation', 'frenzied'],
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
        resourceTypes: ['mana', 'rage_state'],
        resourceValues: { mana: 0, rage_state: 'Frenzied' },
        actionPoints: 1,
        components: ['somatic'],
        somaticText: 'Unleash a whirlwind of savage strikes, your vision red with fury as the beast within takes control'
      },

      resolution: 'DICE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '1d8 + strength + 1d6',
        elementType: 'bludgeoning',
        damageType: 'direct',
        canCrit: true,
        critMultiplier: 2,
        critDiceOnly: false,
        criticalConfig: {
          enabled: true,
          critType: 'dice',
          critMultiplier: 2,
          critEffects: ['knockback']
        },
        chanceOnHitConfig: {
          enabled: true,
          procType: 'dice',
          diceThreshold: 18,
          procChance: 15,
          customEffects: ['burning'],
          burningConfig: {
            damagePerRound: '1d6',
            duration: 2,
            durationUnit: 'rounds',
            saveDC: 15,
            saveType: 'constitution'
          }
        },
        description: 'The frenzied slash tears into your enemy with savage brutality. Each strike is driven by pure rage, and the damage escalates with your fury. On particularly devastating hits, your rage burns so hot that it literally sets your enemy on fire, the flames of your fury consuming them.'
      },

      cooldownConfig: {
        type: 'none'
      },

      tags: ['melee', 'damage', 'rage_generation', 'frenzied', 'berserker']
    },

    {
      id: 'berserk_war_cry',
      name: 'War Cry',
      description: 'You draw in a massive breath, feeling your rage build in your chest like a gathering storm. When you unleash your war cry, your voice becomes something more than human—it is the thunder of charging hordes, the roar of ancient beasts, the battle hymn of warriors long dead. The sound is so powerful it creates visible shockwaves in the air, and enemies within range are physically battered by the concussive force of your voice. Your allies feel their own fighting spirit ignite, their blood heating with the same primal fury that drives you. The war cry doesn\'t just inspire—it transforms, turning fear into courage and hesitation into action. The very air seems to vibrate with your fury, and for a moment, everyone within earshot shares in your rage.',
      level: 2,
      spellType: 'ACTION',
      icon: 'ability_warrior_warcry',

      typeConfig: {
        school: 'bludgeoning',
        icon: 'ability_warrior_warcry',
        tags: ['buff', 'aoe', 'support', 'rage_generation', 'frenzied'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'circle',
        aoeParameters: { radius: 30 },
        targetRestrictions: ['ally', 'enemy']
      },

      resourceCost: {
        resourceTypes: ['mana', 'rage_state'],
        resourceValues: { mana: 0, rage_state: 'Frenzied' },
        actionPoints: 1,
        components: ['verbal'],
        verbalText: 'FOR GLORY AND FURY!'
      },

      resolution: 'NONE',
      effectTypes: ['buff', 'damage'],

      buffConfig: {
        buffType: 'statEnhancement',
        effects: [{
          id: 'battle_fury',
          name: 'Battle Fury',
          description: 'The war cry has ignited your fighting spirit, sharpening your focus and strengthening your strikes. You gain +2 to attack rolls as your rage channels into perfect precision. Every swing feels guided by the fury within you, striking with unerring accuracy.',
          statModifier: {
            stat: 'attack',
            magnitude: 2,
            magnitudeType: 'flat'
          }
        }, {
          id: 'war_cry_morale',
          name: 'War Morale',
          description: 'Your allies are filled with the same primal fury that drives you. Their blood heats, their muscles tense, and they feel an overwhelming urge to fight. They gain +1d4 bonus damage as the war cry awakens the warrior within each of them.',
          damageFormula: '+1d4',
          statModifier: {
            stat: 'damage',
            magnitude: '1d4',
            magnitudeType: 'flat'
          }
        }],
        durationValue: 2,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: false,
        canBeDispelled: false
      },

      damageConfig: {
        formula: '1d4',
        elementType: 'thunder',
        damageType: 'direct',
        description: 'The concussive force of your war cry strikes enemies like a physical blow, causing their ears to ring and their balance to falter. The sound itself is a weapon, battering them with pure sonic force.'
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 2
      },

      tags: ['buff', 'aoe', 'support', 'rage_generation', 'frenzied', 'berserker']
    },

    {
      id: 'berserk_bloodthirst',
      name: 'Bloodthirst',
      description: 'Your hunger becomes something primal and insatiable. As you strike your foe, you don\'t just damage them—you drink deep of their life essence, feeling their vitality flow into you like a dark river. The sensation is intoxicating: with each drop of blood spilled, you feel your own wounds close, your muscles strengthen, and your rage burn brighter. Your weapon seems to pulse with dark energy as it tears into flesh, and you can actually see the life force being drawn from your enemy, visible as a red mist that flows into your body. The more damage you deal, the more you heal, creating a vicious cycle of destruction and renewal. On critical hits, the life drain is so powerful that it visibly weakens your enemy, their movements becoming sluggish as their vitality is consumed.',
      level: 2,
      spellType: 'ACTION',
      icon: 'spell_shadow_lifedrain',

      typeConfig: {
        school: 'bludgeoning',
        icon: 'spell_shadow_lifedrain',
        tags: ['healing', 'self_sustain', 'rage_generation', 'frenzied'],
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
        resourceTypes: ['mana', 'rage_state'],
        resourceValues: { mana: 0, rage_state: 'Frenzied' },
        actionPoints: 1,
        components: ['somatic'],
        somaticText: 'Strike with dark energy, visibly draining life force from your enemy as red mist flows into you'
      },

      resolution: 'DICE',
      effectTypes: ['damage', 'healing'],

      damageConfig: {
        formula: '1d6 + strength',
        elementType: 'necrotic',
        damageType: 'direct',
        canCrit: true,
        critMultiplier: 2,
        critDiceOnly: false,
        criticalConfig: {
          enabled: true,
          critType: 'dice',
          critMultiplier: 2,
          critEffects: ['life_drain'],
          lifeDrainConfig: {
            percentage: 50
          }
        },
        chanceOnHitConfig: {
          enabled: true,
          procType: 'dice',
          diceThreshold: 16,
          procChance: 25,
          customEffects: ['slow'],
          slowConfig: {
            speedReduction: 15,
            speedReductionType: 'flat',
            duration: 2,
            durationUnit: 'rounds',
            saveDC: 14,
            saveType: 'constitution'
          }
        },
        description: 'The bloodthirst strike tears into your enemy with necrotic force, actively draining their life essence. You can see their vitality being consumed, and they feel a deep cold spreading through their body as their life force is siphoned away.'
      },

      healingConfig: {
        formula: 'damageDealt / 2',
        healingType: 'direct',
        description: 'Each drop of spilled blood becomes fuel for your unyielding vitality. You feel the stolen life force flow through you, closing wounds, mending broken bones, and restoring your strength. The sensation is addictive—the more you drain, the stronger you become.'
      },

      cooldownConfig: {
        type: 'none'
      },

      tags: ['melee', 'damage', 'healing', 'self_sustain', 'rage_generation', 'frenzied', 'berserker']
    },

    {
      id: 'berserk_adrenaline_rush',
      name: 'Adrenaline Rush',
      description: 'Flood your body with adrenaline, gaining an extra action point immediately.',
      level: 2,
      spellType: 'ACTION',
      icon: 'ability_rogue_sprint',

      typeConfig: {
        school: 'bludgeoning',
        icon: 'ability_rogue_sprint',
        tags: ['buff', 'speed', 'rage_management', 'frenzied'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      resourceCost: {
        resourceTypes: ['mana', 'rage_cost'],
        resourceValues: { mana: 0, rage_cost: 10 },
        actionPoints: 0,
        components: ['somatic'],
        somaticText: 'Inject yourself with adrenaline'
      },

      resolution: 'NONE',
      effectTypes: ['buff'],

      buffConfig: {
        buffType: 'statEnhancement',
        effects: [{
          id: 'adrenaline_speed',
          name: 'Adrenaline Rush',
          description: 'Gain 1 extra action point immediately',
          statModifier: {
            stat: 'actionPoints',
            magnitude: 1,
            magnitudeType: 'flat'
          }
        }],
        durationValue: 0,
        durationType: 'instant',
        durationUnit: 'instant',
        concentrationRequired: false,
        canBeDispelled: false
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 3
      },

      tags: ['buff', 'speed', 'rage_management', 'frenzied', 'berserker']
    },

    // ========================================
    // LEVEL 3 SPELLS - Advanced Abilities
    // ========================================

    {
      id: 'berserk_primal_roar',
      name: 'Primal Roar',
      description: 'The ancient fury of your ancestors erupts in a deafening roar that shakes the earth and breaks the spirit. Enemies within range are battered by thunderous force and flee in terror from the awakening beast.',
      level: 3,
      spellType: 'ACTION',
      icon: 'ability_warrior_warcry',

      typeConfig: {
        school: 'bludgeoning',
        icon: 'ability_warrior_warcry',
        tags: ['aoe', 'damage', 'control', 'primal'],
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
        resourceTypes: ['mana', 'rage_state'],
        resourceValues: { mana: 0, rage_state: 'Primal' },
        actionPoints: 1,
        components: ['verbal'],
        verbalText: 'RAAAAGH!'
      },

      resolution: 'SAVE',
      effectTypes: ['damage', 'control'],

      damageConfig: {
        formula: '2d6 + strength',
        elementType: 'thunder',
        damageType: 'direct',
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'constitution',
          difficultyClass: 14,
          saveOutcome: 'halves'
        },
      },

      controlConfig: {
        controlType: 'mind_control',
        effects: [{
          id: 'fear',
          name: 'Primal Terror',
          description: 'Enemies flee in blind panic',
          config: {
            fearStrength: 'moderate'
          }
        }],
        duration: 2,
        durationUnit: 'rounds',
        saveDC: 14,
        saveType: 'constitution',
        saveOutcome: 'negates',
        savingThrow: true
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 2
      },

      tags: ['aoe', 'damage', 'control', 'primal', 'berserker']
    },

    {
      id: 'berserk_bloodlust',
      name: 'Bloodlust',
      description: 'The ancient blood of predators courses through your veins, awakening regenerative powers that mend your wounds with primal fury. Your very life force becomes a weapon of endurance.',
      level: 3,
      spellType: 'ACTION',
      icon: 'spell_shadow_lifedrain',

      typeConfig: {
        school: 'bludgeoning',
        icon: 'spell_shadow_lifedrain',
        tags: ['healing', 'hot', 'self_sustain', 'primal'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      resourceCost: {
        resourceTypes: ['mana', 'rage_state'],
        resourceValues: { mana: 0, rage_state: 'Primal' },
        actionPoints: 1,
        components: ['somatic'],
        somaticText: 'Embrace the fury within'
      },

      resolution: 'NONE',
      effectTypes: ['healing'],

      healingConfig: {
        formula: '1d8 + constitution',
        healingType: 'direct',
        hasHotEffect: true,
        hotFormula: '1d4 + constitution/2',
        hotDuration: 3,
        hotTickType: 'round',
        isProgressiveHot: true,
        progressiveStages: [{
          round: 1,
          formula: '1d4 + constitution/2',
          description: 'Initial primal regeneration'
        }, {
          round: 2,
          formula: '1d6 + constitution/2',
          description: 'Building regenerative fury'
        }, {
          round: 3,
          formula: '1d8 + constitution/2',
          description: 'Peak primal healing'
        }],
        description: 'Primal regeneration fueled by the blood of ancient hunters, growing stronger over time'
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 3
      },

      tags: ['healing', 'hot', 'self_sustain', 'primal', 'berserker']
    },

    {
      id: 'berserk_savage_leap',
      name: 'Savage Leap',
      description: 'Leap through the air with primal fury, crashing down on enemies in a devastating impact that stuns those caught in the blast.',
      level: 3,
      spellType: 'ACTION',
      icon: 'ability_heroicleap',

      typeConfig: {
        school: 'bludgeoning',
        icon: 'ability_heroicleap',
        tags: ['movement', 'damage', 'aoe', 'primal'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 20,
        aoeShape: 'circle',
        aoeParameters: { radius: 5 },
        targetRestrictions: ['enemy']
      },

      resourceCost: {
        resourceTypes: ['mana', 'rage_state'],
        resourceValues: { mana: 0, rage_state: 'Primal' },
        actionPoints: 1,
        components: ['somatic'],
        somaticText: 'Leap with primal force'
      },

      resolution: 'SAVE',
      effectTypes: ['damage', 'control'],

      damageConfig: {
        formula: '2d8 + strength',
        elementType: 'bludgeoning',
        damageType: 'direct',
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'constitution',
          difficultyClass: 15,
          saveOutcome: 'halves'
        },
      },

      controlConfig: {
        controlType: 'incapacitation',
        effects: [{
          id: 'stun',
          name: 'Impact Stun',
          description: 'Enemies are stunned by the devastating impact',
          config: {}
        }],
        duration: 1,
        durationUnit: 'rounds',
        saveDC: 15,
        saveType: 'constitution',
        saveOutcome: 'negates',
        savingThrow: true
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 2
      },

      tags: ['movement', 'damage', 'aoe', 'control', 'primal', 'berserker']
    },

    {
      id: 'berserk_berserk_charge',
      name: 'Berserk Charge',
      description: 'Charge forward with unstoppable momentum, plowing through enemies and knocking them aside with overwhelming force.',
      level: 3,
      spellType: 'ACTION',
      icon: 'ability_warrior_charge',

      typeConfig: {
        school: 'bludgeoning',
        icon: 'ability_warrior_charge',
        tags: ['movement', 'damage', 'control', 'primal'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'line',
        rangeType: 'ranged',
        rangeDistance: 30,
        aoeShape: 'line',
        aoeParameters: { length: 30, width: 5 },
        targetRestrictions: ['enemy']
      },

      resourceCost: {
        resourceTypes: ['mana', 'rage_state'],
        resourceValues: { mana: 0, rage_state: 'Primal' },
        actionPoints: 1,
        components: ['somatic'],
        somaticText: 'Charge with berserk momentum'
      },

      resolution: 'SAVE',
      effectTypes: ['damage', 'control'],

      damageConfig: {
        formula: '2d6 + strength',
        elementType: 'bludgeoning',
        damageType: 'direct',
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'strength',
          difficultyClass: 14,
          saveOutcome: 'halves'
        }
      },

      controlConfig: {
        controlType: 'forcedMovement',
        effects: [{
          id: 'push',
          name: 'Charge Impact',
          description: 'Enemies are pushed back by the unstoppable charge',
          config: {
            movementType: 'push',
            distance: 10
          }
        }],
        duration: 0,
        durationUnit: 'instant',
        saveDC: 14,
        saveType: 'strength',
        saveOutcome: 'negates',
        savingThrow: true
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 2
      },

      tags: ['movement', 'damage', 'control', 'primal', 'berserker']
    },

    // ========================================
    // LEVEL 4 SPELLS - Elite Abilities
    // ========================================

    {
      id: 'berserk_carnage_strike',
      name: 'Carnage Strike',
      description: 'Carnage incarnate flows through your veins as you unleash a strike of apocalyptic violence. The battlefield becomes your slaughterhouse, where every swing paints the ground red and leaves your enemies broken and bleeding.',
      level: 4,
      spellType: 'ACTION',
      icon: 'ability_warrior_decisivestrike',

      typeConfig: {
        school: 'bludgeoning',
        icon: 'ability_warrior_decisivestrike',
        tags: ['melee', 'damage', 'carnage'],
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
        resourceTypes: ['mana', 'rage_state'],
        resourceValues: { mana: 0, rage_state: 'Carnage' },
        actionPoints: 2,
        components: ['somatic'],
        somaticText: 'Strike with overwhelming carnage'
      },

      resolution: 'DICE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '2d8 + strength + 2d6',
        elementType: 'bludgeoning',
        damageType: 'direct',
        canCrit: true,
        critMultiplier: 2,
        critDiceOnly: false,
        criticalConfig: {
          enabled: true,
          critType: 'dice',
          critMultiplier: 3,
          critEffects: ['knockback', 'stun', 'bleeding'],
          extraDice: '1d8',
          knockbackConfig: {
            distance: 10
          },
          stunConfig: {
            duration: 1,
            durationUnit: 'round',
            saveDC: 15,
            saveType: 'constitution'
          },
          bleedingConfig: {
            damagePerRound: '1d4',
            duration: 2,
            durationUnit: 'rounds',
            saveDC: 14,
            saveType: 'constitution'
          }
        },
        chanceOnHitConfig: {
          enabled: true,
          procType: 'dice',
          diceThreshold: 17,
          procChance: 20,
          customEffects: ['fear'],
          fearConfig: {
            duration: 2,
            durationUnit: 'rounds',
            saveDC: 15,
            saveType: 'spirit'
          }
        },
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 1
      },

      tags: ['melee', 'damage', 'carnage', 'berserker']
    },

    {
      id: 'berserk_raging_defense',
      name: 'Raging Defense',
      description: 'Your fury becomes a shield. Gain resistance to all damage and regenerate Rage when attacked.',
      level: 4,
      spellType: 'ACTION',
      icon: 'ability_warrior_shieldwall',

      typeConfig: {
        school: 'bludgeoning',
        icon: 'ability_warrior_shieldwall',
        tags: ['defense', 'resistance', 'buff', 'carnage'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      resourceCost: {
        resourceTypes: ['mana', 'rage_state'],
        resourceValues: { mana: 0, rage_state: 'Carnage' },
        actionPoints: 2,
        components: ['somatic'],
        somaticText: 'Brace against all harm'
      },

      resolution: 'NONE',
      effectTypes: ['buff'],

      buffConfig: {
        buffType: 'statEnhancement',
        effects: [{
          id: 'all_resistances',
          name: 'All Resistances',
          description: 'Gain resistance to all damage types (50% damage reduction)',
          statModifier: {
            stat: 'all_resistances',
            magnitude: 50,
            magnitudeType: 'percentage',
            category: 'resistance',
            resistanceType: 'general'
          }
        }, {
          id: 'rage_regeneration',
          name: 'Rage Fuel',
          description: 'Attacks against you generate +3 Rage instead of +1',
          statModifier: {
            stat: 'rageGeneration',
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
        value: 2
      },

      tags: ['defense', 'resistance', 'buff', 'carnage', 'berserker']
    },

    {
      id: 'berserk_intimidating_presence',
      name: 'Intimidating Presence',
      description: 'Your terrifying aura causes enemies to flee and allies to fight harder.',
      level: 4,
      spellType: 'ACTION',
      icon: 'spell_shadow_deathscream',

      typeConfig: {
        school: 'bludgeoning',
        icon: 'spell_shadow_deathscream',
        tags: ['control', 'aoe', 'fear', 'carnage'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'circle',
        aoeParameters: { radius: 20 },
        targetRestrictions: ['enemy']
      },

      resourceCost: {
        resourceTypes: ['mana', 'rage_cost'],
        resourceValues: { mana: 0, rage_cost: 15 },
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'FEAR ME!',
        somaticText: 'Radiate terrifying aura'
      },

      resolution: 'SAVE',
      effectTypes: ['control'],

      controlConfig: {
        controlType: 'mind_control',
        effects: [{
          id: 'fear',
          name: 'Frightened',
          description: 'Enemies are overcome with terror',
          config: {
            fearStrength: 'moderate'
          }
        }],
        duration: 2,
        durationUnit: 'rounds',
        saveDC: 16,
        saveType: 'charisma',
        saveOutcome: 'negates',
        savingThrow: true
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 3
      },

      tags: ['control', 'aoe', 'fear', 'carnage', 'berserker']
    },

    {
      id: 'berserk_battle_trance',
      name: 'Battle Trance',
      description: 'Enter a trance-like state of perfect combat awareness, where time seems to slow and every movement becomes predictable. Your heightened reflexes allow you to dodge attacks with supernatural precision.',
      level: 4,
      spellType: 'ACTION',
      icon: 'ability_warrior_focusedrage',

      typeConfig: {
        school: 'bludgeoning',
        icon: 'ability_warrior_focusedrage',
        tags: ['buff', 'dodge', 'carnage'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      resourceCost: {
        resourceTypes: ['mana', 'rage_state'],
        resourceValues: { mana: 0, rage_state: 'Carnage' },
        actionPoints: 2,
        components: ['somatic'],
        somaticText: 'Enter battle trance'
      },

      resolution: 'NONE',
      effectTypes: ['buff'],

      buffConfig: {
        buffType: 'statEnhancement',
        effects: [{
          id: 'battle_trance_dodge',
          name: 'Battle Trance',
          description: 'Gain +3 dodge bonus. Your heightened reflexes and perfect combat awareness allow you to anticipate and evade incoming attacks',
          statModifier: {
            stat: 'dodge',
            magnitude: 3,
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
        value: 4
      },

      tags: ['buff', 'dodge', 'carnage', 'berserker']
    },

    // ========================================
    // LEVEL 5 SPELLS - Legendary Abilities
    // ========================================

    {
      id: 'berserk_cataclysmic_blow',
      name: 'Cataclysmic Blow',
      description: 'Gather the destructive force of a collapsing star in your fist and unleash it upon your foe. The impact can shatter stone, crumple armor, and leave even the mightiest warriors stunned and broken.',
      level: 5,
      spellType: 'ACTION',
      icon: 'ability_warrior_titansgrip',

      typeConfig: {
        school: 'bludgeoning',
        icon: 'ability_warrior_titansgrip',
        tags: ['melee', 'damage', 'control', 'cataclysm'],
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
        resourceTypes: ['mana', 'rage_state'],
        resourceValues: { mana: 0, rage_state: 'Cataclysm' },
        actionPoints: 2,
        components: ['somatic'],
        somaticText: 'Channel all fury into one devastating blow'
      },

      resolution: 'DICE',
      effectTypes: ['damage', 'control'],

      damageConfig: {
        formula: '3d8 + strength + 2d6',
        elementType: 'bludgeoning',
        damageType: 'direct',
        criticalConfig: {
          enabled: true,
          critType: 'dice',
          critMultiplier: 3,
          critEffects: ['stun', 'knockback', 'disarm'],
          explodingDice: true,
          explodingDiceType: 'reroll_add',
          stunConfig: {
            duration: 1,
            durationUnit: 'round',
            saveDC: 17,
            saveType: 'constitution'
          },
          knockbackConfig: {
            distance: 15
          },
          disarmConfig: {
            saveDC: 17,
            saveType: 'strength'
          }
        },
      },

      controlConfig: {
        controlType: 'incapacitation',
        effects: [{
          id: 'stun',
          name: 'Cataclysmic Impact',
          description: 'Target is stunned by the devastating blow',
          config: {
            durationType: 'temporary',
            recoveryMethod: 'automatic'
          }
        }],
        duration: 2,
        durationUnit: 'rounds',
        saveDC: 17,
        saveType: 'constitution',
        savingThrow: true
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 2
      },

      tags: ['melee', 'damage', 'control', 'cataclysm', 'berserker']
    },

    {
      id: 'berserk_unstoppable_force',
      name: 'Unstoppable Force',
      description: 'Your rage makes you immune to all conditions and forced movement for one round.',
      level: 5,
      spellType: 'ACTION',
      icon: 'spell_nature_shamanrage',

      typeConfig: {
        school: 'bludgeoning',
        icon: 'spell_nature_shamanrage',
        tags: ['buff', 'immunity', 'cataclysm'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      resourceCost: {
        resourceTypes: ['mana', 'rage_cost'],
        resourceValues: { mana: 0, rage_cost: 20 },
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'NOTHING STOPS ME!',
        somaticText: 'Surge forward with unstoppable momentum'
      },

      resolution: 'NONE',
      effectTypes: ['buff'],

      buffConfig: {
        buffType: 'statusEffect',
        effects: [{
          id: 'condition_immunity',
          name: 'Unstoppable Force',
          description: 'Immune to all conditions and forced movement for 1 round',
          statusType: 'immunity',
          level: 'major'
        }],
        durationValue: 1,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: false,
        canBeDispelled: false
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 3
      },

      tags: ['buff', 'immunity', 'cataclysm', 'berserker']
    },

    {
      id: 'berserk_commanding_shout',
      name: 'Commanding Shout',
      description: 'A powerful shout that rallies allies and demoralizes enemies for 2 rounds. Allies gain +2 attack bonus, enemies must save or suffer -2 attack penalty.',
      level: 5,
      spellType: 'ACTION',
      icon: 'ability_warrior_commandingshout',

      typeConfig: {
        school: 'bludgeoning',
        icon: 'ability_warrior_commandingshout',
        tags: ['buff', 'debuff', 'aoe', 'support', 'cataclysm'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'circle',
        aoeParameters: { radius: 30 },
        targetRestrictions: ['ally', 'enemy']
      },

      resourceCost: {
        resourceTypes: ['mana', 'rage_state'],
        resourceValues: { mana: 0, rage_state: 'Cataclysm' },
        actionPoints: 2,
        components: ['verbal'],
        verbalText: 'RALLY TO ME!'
      },

      resolution: 'NONE',
      effectTypes: ['buff', 'debuff'],

      buffConfig: {
        buffType: 'statEnhancement',
        effects: [{
          id: 'commanding_buff',
          name: 'Commanding Presence',
          description: 'Gain +2 attack bonus for 2 rounds',
          statModifier: {
            stat: 'attack',
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

      debuffConfig: {
        debuffType: 'statReduction',
        effects: [{
          id: 'demoralized',
          name: 'Demoralized',
          description: 'Your terrifying presence shakes their resolve, making them less effective in combat. The primal fury in your voice and the savage intensity in your eyes cause their hands to tremble and their aim to falter.',
          statModifier: {
            stat: 'attack',
            magnitude: 2,
            magnitudeType: 'flat'
          }
        }],
        durationValue: 2,
        durationType: 'rounds',
        durationUnit: 'rounds',
        difficultyClass: 16,
        savingThrow: 'charisma',
        saveOutcome: 'negates'
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 3
      },

      tags: ['buff', 'debuff', 'aoe', 'support', 'cataclysm', 'berserker']
    },

    {
      id: 'berserk_rage_eruption',
      name: 'Rage Eruption',
      description: 'Explode with uncontrollable fury, damaging all nearby enemies but risking self-harm.',
      level: 5,
      spellType: 'ACTION',
      icon: 'spell_fire_volcano',

      typeConfig: {
        school: 'bludgeoning',
        icon: 'spell_fire_volcano',
        tags: ['aoe', 'damage', 'self_damage', 'cataclysm'],
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
        resourceTypes: ['mana', 'rage_cost'],
        resourceValues: { mana: 0, rage_cost: 25 },
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'MY RAGE CONSUMES ALL!',
        somaticText: 'Explode with uncontrollable fury'
      },

      resolution: 'SAVE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '3d6 + strength',
        elementType: 'fire',
        damageType: 'direct',
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'constitution',
          difficultyClass: 15,
          saveOutcome: 'halves'
        },
        triggerCondition: 'activation',
        triggerDescription: 'Deals damage to self and nearby enemies'
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 4
      },

      tags: ['aoe', 'damage', 'self_damage', 'cataclysm', 'berserker']
    },

    // ========================================
    // LEVEL 6 SPELLS - Ultimate Abilities
    // ========================================

    {
      id: 'berserk_obliterating_strike',
      name: 'Obliterating Strike',
      description: 'The culmination of your rage erupts in a cataclysmic explosion of pure destructive force. Reality itself warps around your strike as you channel the entropy of a dying universe. Must be used immediately or risk Overheat.',
      level: 6,
      spellType: 'ACTION',
      icon: 'ability_warrior_rampage',

      typeConfig: {
        school: 'bludgeoning',
        icon: 'ability_warrior_rampage',
        tags: ['aoe', 'damage', 'ultimate', 'obliteration'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'circle',
        aoeParameters: { radius: 20 },
        targetRestrictions: ['enemy']
      },

      resourceCost: {
        resourceTypes: ['mana', 'rage_cost'],
        resourceValues: { mana: 0, rage_cost: 30 },
        actionPoints: 3,
        components: ['somatic'],
        somaticText: 'Unleash all accumulated fury in one devastating strike'
      },

      resolution: 'SAVE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '4d8 + strength + 3d6',
        elementType: 'force',
        damageType: 'direct',
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'constitution',
          difficultyClass: 18,
          saveOutcome: 'halves'
        },
        criticalConfig: {
          enabled: true,
          critType: 'dice',
          critMultiplier: 4,
          extraDice: '2d6',
          critEffects: ['knockback', 'stun', 'burning'],
          explodingDice: true,
          explodingDiceType: 'double_value',
          knockbackConfig: {
            distance: 20
          },
          stunConfig: {
            duration: 2,
            durationUnit: 'rounds',
            saveDC: 18,
            saveType: 'constitution'
          },
          burningConfig: {
            damagePerRound: '2d6',
            duration: 3,
            durationUnit: 'rounds',
            saveDC: 18,
            saveType: 'constitution'
          }
        },
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 4
      },

      tags: ['aoe', 'damage', 'ultimate', 'obliteration', 'berserker']
    },

    {
      id: 'berserk_wrath_berserker',
      name: 'Wrath of the Berserker',
      description: 'The ultimate expression of fury, channeling the full power of your rage into every strike for 3 rounds. Gain +5 damage bonus and advantage on all attack rolls.',
      level: 6,
      spellType: 'ACTION',
      icon: 'ability_warrior_innerrage',

      typeConfig: {
        school: 'bludgeoning',
        icon: 'ability_warrior_innerrage',
        tags: ['buff', 'advantage', 'damage', 'ultimate', 'obliteration'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      resourceCost: {
        resourceTypes: ['mana', 'rage_cost'],
        resourceValues: { mana: 0, rage_cost: 35 },
        actionPoints: 3,
        components: ['verbal', 'somatic'],
        verbalText: 'WITNESS TRUE FURY!',
        somaticText: 'Embrace the full power of rage'
      },

      resolution: 'NONE',
      effectTypes: ['buff'],

      buffConfig: {
        buffType: 'statEnhancement',
        effects: [{
          id: 'wrath_damage',
          name: 'Wrath of the Berserker',
          description: 'Gain +5 damage bonus and advantage on all attack rolls for 3 rounds',
          statModifier: {
            stat: 'damage',
            magnitude: 5,
            magnitudeType: 'flat'
          }
        }],
        durationValue: 3,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: false,
        canBeDispelled: false
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 5
      },

      tags: ['buff', 'advantage', 'damage', 'ultimate', 'obliteration', 'berserker']
    },

    {
      id: 'berserk_final_stand',
      name: 'Final Stand',
      description: 'Make a last stand against overwhelming odds for 2 rounds, becoming nearly invincible but unable to move.',
      level: 6,
      spellType: 'ACTION',
      icon: 'ability_warrior_laststand',

      typeConfig: {
        school: 'bludgeoning',
        icon: 'ability_warrior_laststand',
        tags: ['buff', 'invulnerability', 'ultimate'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      resourceCost: {
        resourceTypes: ['mana', 'rage_cost'],
        resourceValues: { mana: 0, rage_cost: 40 },
        actionPoints: 3,
        components: ['verbal', 'somatic'],
        verbalText: 'I WILL NOT FALL!',
        somaticText: 'Dig in for final stand'
      },

      resolution: 'NONE',
      effectTypes: ['buff'],

      buffConfig: {
        buffType: 'statEnhancement',
        effects: [{
          id: 'final_stand_defense',
          name: 'Final Stand',
          description: 'Gain 75% damage reduction for 2 rounds. Cannot move from your position.',
          statModifier: {
            stat: 'damage_reduction',
            magnitude: 75,
            magnitudeType: 'percentage'
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
        value: 6
      },

      tags: ['buff', 'invulnerability', 'ultimate', 'obliteration', 'berserker']
    },

    // ========================================
    // LEVEL 7 SPELLS - Mythic Abilities
    // ========================================

    {
      id: 'berserk_berserkers_rage',
      name: 'Berserker\'s Rage',
      description: 'Embrace the full power of your fury, transforming into an unstoppable force of destruction. Your body swells with primal energy, your muscles bulge with supernatural strength, and your eyes burn with pure rage.',
      level: 7,
      spellType: 'ACTION',
      icon: 'spell_nature_bloodlust',

      typeConfig: {
        school: 'bludgeoning',
        icon: 'spell_nature_bloodlust',
        tags: ['transformation', 'damage'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      resourceCost: {
        resourceTypes: ['mana', 'rage_cost'],
        resourceValues: { mana: 0, rage_cost: 50 },
        actionPoints: 3,
        components: ['verbal', 'somatic'],
        verbalText: 'I AM THE STORM!',
        somaticText: 'Embrace the raging beast within'
      },

      resolution: 'NONE',
      effectTypes: ['transformation', 'damage'],

      transformationConfig: {
        transformationType: 'physical',
        targetType: 'self',
        duration: 5,
        durationUnit: 'rounds',
        power: 'major',
        newForm: 'Berserker\'s Rage',
        description: 'Your body swells with primal energy as you embrace your fury.',
        grantedAbilities: [
          {
            id: 'rage_damage_bonus',
            name: '+8 Damage Bonus',
            description: 'All attacks deal +8 additional damage'
          },
          {
            id: 'rage_resistance',
            name: 'Pain Resistance',
            description: 'Reduce incoming damage by 2'
          }
        ]
      },

      damageConfig: {
        formula: '2d6',
        elementType: 'bludgeoning',
        damageType: 'direct',
        triggerCondition: 'activation',
        triggerDescription: 'Deals damage to self and nearby enemies when activated'
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 6
      },

      tags: ['buff', 'damage', 'transformation', 'obliteration', 'berserker']
    },

    {
      id: 'berserk_fury_of_the_ancients',
      name: 'Fury of the Ancients',
      description: 'The spirits of ancient berserkers possess your form as you transform into a living cyclone of primal fury. Blades of ancestral rage whirl around you, tearing through flesh and bone, leaving only devastation in your wake.',
      level: 7,
      spellType: 'ACTION',
      icon: 'ability_warrior_bladestorm',

      typeConfig: {
        school: 'bludgeoning',
        icon: 'ability_warrior_bladestorm',
        tags: ['aoe', 'damage', 'movement'],
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
        resourceTypes: ['mana', 'rage_cost'],
        resourceValues: { mana: 0, rage_cost: 45 },
        actionPoints: 3,
        components: ['somatic'],
        somaticText: 'Spin into a whirlwind of blades'
      },

      resolution: 'SAVE',
      effectTypes: ['damage', 'control'],

      damageConfig: {
        formula: '3d6 + strength + 2d6',
        elementType: 'bludgeoning',
        damageType: 'direct',
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'strength',
          difficultyClass: 18,
          saveOutcome: 'halves'
        },
        criticalConfig: {
          enabled: true,
          critType: 'dice',
          critMultiplier: 4,
          critEffects: ['knockback', 'stun', 'bleeding'],
          explodingDice: true,
          explodingDiceType: 'reroll_add'
        },
      },

      controlConfig: {
        controlType: 'knockdown',
        effects: [{
          id: 'repel',
          name: 'Whirlwind Force',
          description: 'Enemies are knocked back and down by the spinning fury',
          config: {}
        }],
        duration: 1,
        durationUnit: 'rounds',
        saveDC: 18,
        saveType: 'strength',
        savingThrow: true
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 5
      },

      tags: ['aoe', 'damage', 'movement', 'obliteration', 'berserker']
    },

    {
      id: 'berserk_blood_frenzy',
      name: 'Blood Frenzy',
      description: 'Enter a blood-fueled frenzy, healing 20 hit points for each enemy you defeat. Your bloodlust becomes a source of life-giving energy.',
      level: 7,
      spellType: 'ACTION',
      icon: 'spell_shadow_bloodboil',

      typeConfig: {
        school: 'bludgeoning',
        icon: 'spell_shadow_bloodboil',
        tags: ['buff', 'healing'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      resourceCost: {
        resourceTypes: ['mana', 'rage_cost'],
        resourceValues: { mana: 0, rage_cost: 55 },
        actionPoints: 3,
        components: ['verbal', 'somatic'],
        verbalText: 'BLOOD FUELS MY RAGE!',
        somaticText: 'Enter blood-fueled frenzy'
      },

      resolution: 'NONE',
      effectTypes: ['buff'],

      buffConfig: {
        buffType: 'statEnhancement',
        effects: [{
          id: 'blood_frenzy_heal',
          name: 'Blood Frenzy',
          description: 'Heal 20 hit points for each enemy you defeat. Your blood-fueled frenzy turns every kill into life-giving energy',
          statModifier: {
            stat: 'healingPerKill',
            magnitude: 20,
            magnitudeType: 'flat'
          }
        }],
        durationValue: 4,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: false,
        canBeDispelled: false
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 7
      },

      tags: ['buff', 'healing', 'obliteration', 'berserker']
    },

    // ========================================
    // LEVEL 8 SPELLS - Legendary Abilities
    // ========================================

    {
      id: 'berserk_ragnarok_fury',
      name: 'Ragnarok Fury',
      description: 'Unleash apocalyptic rage that shatters the earth and consumes everything in flames.',
      level: 8,
      spellType: 'ACTION',
      icon: 'spell_fire_ragnaros_lavabolt',

      typeConfig: {
        school: 'bludgeoning',
        icon: 'spell_fire_ragnaros_lavabolt',
        tags: ['aoe', 'damage', 'destruction'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 30,
        aoeShape: 'circle',
        aoeParameters: { radius: 25 },
        targetRestrictions: ['enemy']
      },

      resourceCost: {
        resourceTypes: ['mana', 'rage_cost'],
        resourceValues: { mana: 0, rage_cost: 60 },
        actionPoints: 4,
        components: ['verbal', 'somatic'],
        verbalText: 'THE WORLD BURNS!',
        somaticText: 'Strike the ground with apocalyptic force'
      },

      resolution: 'SAVE',
      effectTypes: ['damage', 'control'],

      damageConfig: {
        formula: '5d8 + strength + 4d6',
        elementType: 'fire',
        damageType: 'direct',
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'constitution',
          difficultyClass: 19,
          saveOutcome: 'halves'
        },
      },

      controlConfig: {
        controlType: 'incapacitation',
        effects: [{
          id: 'stun',
          name: 'Apocalyptic Shock',
          description: 'Enemies are stunned by the apocalyptic force',
          config: {
            durationType: 'temporary',
            recoveryMethod: 'automatic'
          }
        }],
        duration: 2,
        durationUnit: 'rounds',
        saveDC: 19,
        saveType: 'constitution',
        savingThrow: true
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 7
      },

      tags: ['aoe', 'damage', 'destruction', 'obliteration', 'berserker']
    },

    {
      id: 'berserk_immortal_rage',
      name: 'Immortal Rage',
      description: 'Your fury transcends death itself, granting immortality for 3 rounds. You become immune to death and all lethal damage, but the strain is immense.',
      level: 8,
      spellType: 'ACTION',
      icon: 'spell_shadow_deathscream',

      typeConfig: {
        school: 'bludgeoning',
        icon: 'spell_shadow_deathscream',
        tags: ['buff', 'immortality'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      resourceCost: {
        resourceTypes: ['mana', 'rage_cost'],
        resourceValues: { mana: 0, rage_cost: 70 },
        actionPoints: 4,
        components: ['verbal', 'somatic'],
        verbalText: 'DEATH CANNOT HOLD ME!',
        somaticText: 'Reject mortality itself'
      },

      resolution: 'NONE',
      effectTypes: ['buff'],

      buffConfig: {
        buffType: 'statusEffect',
        effects: [{
          id: 'immortal_rage',
          name: 'Immortal Rage',
          description: 'Immune to death and all lethal damage for 3 rounds',
          statusType: 'immortality',
          level: 'extreme'
        }],
        durationValue: 3,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: false,
        canBeDispelled: false
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 8
      },

      tags: ['buff', 'immortality', 'obliteration', 'berserker']
    },

    {
      id: 'berserk_dimensional_rift',
      name: 'Dimensional Rift',
      description: 'Tear open a rift to another dimension, pulling enemies through and dealing chaotic damage.',
      level: 8,
      spellType: 'ACTION',
      icon: 'spell_arcane_portalironforge',

      typeConfig: {
        school: 'bludgeoning',
        icon: 'spell_arcane_portalironforge',
        tags: ['aoe', 'damage', 'control'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 40,
        aoeShape: 'circle',
        aoeParameters: { radius: 20 },
        targetRestrictions: ['enemy']
      },

      resourceCost: {
        resourceTypes: ['mana', 'rage_cost'],
        resourceValues: { mana: 0, rage_cost: 75 },
        actionPoints: 4,
        components: ['verbal', 'somatic'],
        verbalText: 'REALITY TEARS APART!',
        somaticText: 'Rip open dimensional barriers'
      },

      resolution: 'SAVE',
      effectTypes: ['damage', 'control'],

      damageConfig: {
        formula: '4d6 + strength + 3d6',
        elementType: 'force',
        damageType: 'direct',
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'constitution',
          difficultyClass: 19,
          saveOutcome: 'halves'
        },
      },

      controlConfig: {
        controlType: 'forcedMovement',
        effects: [{
          id: 'pull',
          name: 'Dimensional Pull',
          description: 'Enemies are pulled toward the rift',
          config: {
            movementType: 'pull',
            distance: 20
          }
        }],
        duration: 0,
        durationUnit: 'instant',
        saveDC: 19,
        saveType: 'constitution',
        savingThrow: true
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 8
      },

      tags: ['aoe', 'damage', 'control', 'obliteration', 'berserker']
    },

    // ========================================
    // LEVEL 9 SPELLS - Legendary Rage Abilities
    // ========================================

    {
      id: 'berserk_primal_cataclysm',
      name: 'Primal Cataclysm',
      description: 'Channel all your accumulated fury into a devastating ground-shaking impact. The sheer violence of the attack strains your body as much as it devastates your enemies.',
      level: 9,
      spellType: 'ACTION',
      icon: 'spell_arcane_starfire',

      typeConfig: {
        school: 'bludgeoning',
        icon: 'spell_arcane_starfire',
        tags: ['aoe', 'damage', 'primal', 'obliteration'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'circle',
        aoeParameters: { radius: 20 },
        targetRestrictions: ['enemy']
      },

      resourceCost: {
        resourceTypes: ['mana', 'rage_state', 'rage_cost'],
        resourceValues: { mana: 0, rage_state: 'Obliteration', rage_cost: 80 },
        actionPoints: 4,
        components: ['verbal', 'somatic'],
        verbalText: 'FEEL MY FURY!',
        somaticText: 'Slam fists into the ground with devastating force'
      },

      resolution: 'SAVE',
      effectTypes: ['damage', 'control'],

      damageConfig: {
        formula: '4d10 + strength',
        elementType: 'bludgeoning',
        damageType: 'direct',
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'constitution',
          difficultyClass: 18,
          saveOutcome: 'halves'
        },
      },

      selfDamageConfig: {
        formula: '2d6',
        damageType: 'bludgeoning',
        description: 'The violent impact strains your own body'
      },

      controlConfig: {
        controlType: 'knockdown',
        effects: [{
          id: 'trip',
          name: 'Ground Tremor',
          description: 'Enemies are knocked prone by the shockwave',
          config: {
            durationType: 'instant',
            recoveryMethod: 'stand_action'
          }
        }],
        duration: 0,
        durationUnit: 'instant',
        saveDC: 18,
        saveType: 'strength',
        savingThrow: true
      },

      cooldownConfig: {
        type: 'combat',
        value: 1,
        description: 'Once per combat'
      },

      tags: ['aoe', 'damage', 'primal', 'obliteration', 'berserker', 'self-damage']
    },

    {
      id: 'berserk_veterans_resolve',
      name: 'Veteran\'s Resolve',
      description: 'Draw upon years of brutal combat experience, hardening your strikes with deadly precision for 3 rounds. This focused fury demands you remain aggressive - if you do not attack on your turn, the effect ends immediately.',
      level: 9,
      spellType: 'ACTION',
      icon: 'ability_warrior_endlessrage',

      typeConfig: {
        school: 'bludgeoning',
        icon: 'ability_warrior_endlessrage',
        tags: ['buff', 'damage', 'obliteration'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      resourceCost: {
        resourceTypes: ['mana', 'rage_state', 'rage_cost'],
        resourceValues: { mana: 0, rage_state: 'Obliteration', rage_cost: 60 },
        actionPoints: 3,
        components: ['verbal', 'somatic'],
        verbalText: 'I WILL NOT YIELD!',
        somaticText: 'Focus your fury into controlled devastation'
      },

      resolution: 'NONE',
      effectTypes: ['buff'],

      buffConfig: {
        buffType: 'statEnhancement',
        effects: [{
          id: 'veterans_resolve',
          name: 'Veteran\'s Resolve',
          description: 'Gain +4 damage bonus for 3 rounds. Effect ends immediately if you do not attack on your turn',
          statModifier: {
            stat: 'damage',
            magnitude: 4,
            magnitudeType: 'flat'
          }
        }],
        durationValue: 3,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: false,
        canBeDispelled: false,
        conditionalEnd: 'Must attack each turn or effect ends'
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 5
      },

      tags: ['buff', 'damage', 'obliteration', 'berserker']
    },

    {
      id: 'berserk_bloodrage_frenzy',
      name: 'Bloodrage Frenzy',
      description: 'Toggle a blood-soaked frenzy where every wound you inflict heals your body. The longer you maintain this savage state, the more it exhausts you - each round increases the toll taken when you finally emerge.',
      level: 9,
      spellType: 'TOGGLE',
      icon: 'spell_shadow_bloodboil',

      typeConfig: {
        school: 'bludgeoning',
        icon: 'spell_shadow_bloodboil',
        tags: ['buff', 'healing', 'lifesteal', 'toggle', 'obliteration'],
        castTime: 1,
        castTimeType: 'IMMEDIATE',
        toggleable: true
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      resourceCost: {
        resourceTypes: ['mana', 'rage_cost'],
        resourceValues: { mana: 0, rage_cost: 30 },
        actionPoints: 1,
        components: ['verbal', 'somatic'],
        verbalText: 'BLOOD FOR BLOOD!',
        somaticText: 'Enter a savage blood-fueled state'
      },

      resolution: 'NONE',
      effectTypes: ['buff'],

      buffConfig: {
        buffType: 'custom',
        customName: 'Bloodrage Frenzy',
        customDescription: 'Heal for 25% of melee damage dealt. When toggled off or after 5 rounds (max), take exhaustion damage equal to 1d8 per round maintained.',
        durationValue: 5,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: false,
        canBeDispelled: false,
        isToggle: true,
        maxDuration: 5,
        afterEffect: {
          type: 'scaling_damage',
          baseFormula: '1d8',
          scaling: 'per_round_maintained',
          description: 'Exhaustion damage scales with rounds maintained',
          damageFormula: '1d8 × rounds'
        }
      },

      mechanicsText: '25% lifesteal on melee attacks. Toggle off anytime or auto-ends at 5 rounds. Exhaustion: 1d8 × rounds maintained.',

      cooldownConfig: {
        type: 'turn_based',
        value: 4
      },

      tags: ['buff', 'healing', 'lifesteal', 'toggle', 'obliteration', 'berserker']
    },

    // ========================================
    // LEVEL 10 SPELLS - Ultimate Berserker Abilities
    // ========================================

    {
      id: 'berserk_cataclysmic_fury',
      name: 'Cataclysmic Fury',
      description: 'Release every ounce of accumulated rage in a devastating explosion of primal violence. The sheer force of the attack takes a severe toll on your body - you emerge victorious but badly shaken.',
      level: 10,
      spellType: 'ACTION',
      icon: 'spell_fire_meteorstorm',

      typeConfig: {
        school: 'bludgeoning',
        icon: 'spell_fire_meteorstorm',
        tags: ['aoe', 'damage', 'ultimate', 'obliteration'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'circle',
        aoeParameters: { radius: 25 },
        targetRestrictions: ['enemy']
      },

      resourceCost: {
        resourceTypes: ['mana', 'rage_state', 'rage_cost'],
        resourceValues: { mana: 0, rage_state: 'Obliteration', rage_cost: 90 },
        actionPoints: 4,
        components: ['verbal', 'somatic'],
        verbalText: 'WITNESS MY FURY!',
        somaticText: 'Explode with devastating primal force'
      },

      resolution: 'SAVE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '5d10 + strength',
        elementType: 'bludgeoning',
        damageType: 'direct',
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'constitution',
          difficultyClass: 18,
          saveOutcome: 'halves'
        },
      },

      selfDamageConfig: {
        formula: '3d6',
        damageType: 'bludgeoning',
        description: 'The devastating release of fury takes a severe toll on your body'
      },

      cooldownConfig: {
        type: 'combat',
        value: 1,
        description: 'Once per combat'
      },

      tags: ['aoe', 'damage', 'ultimate', 'obliteration', 'berserker', 'self-damage']
    },

    {
      id: 'berserk_battle_incarnate',
      name: 'Battle Incarnate',
      description: 'Become a living engine of war, your every movement optimized for destruction. This state of perfect violence demands total commitment - you cannot retreat or defend, only attack.',
      level: 10,
      spellType: 'ACTION',
      icon: 'ability_warrior_bloodnova',

      typeConfig: {
        school: 'bludgeoning',
        icon: 'ability_warrior_bloodnova',
        tags: ['transformation', 'obliteration'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      resourceCost: {
        resourceTypes: ['mana', 'rage_state', 'rage_cost'],
        resourceValues: { mana: 0, rage_state: 'Obliteration', rage_cost: 80 },
        actionPoints: 4,
        components: ['verbal', 'somatic'],
        verbalText: 'I AM WAR ITSELF!',
        somaticText: 'Transform into a perfect instrument of violence'
      },

      resolution: 'NONE',
      effectTypes: ['transformation'],

      transformationConfig: {
        transformationType: 'physical',
        targetType: 'self',
        duration: 3,
        durationUnit: 'rounds',
        power: 'major',
        newForm: 'Battle Incarnate',
        description: 'Become a perfect instrument of violence, optimized for destruction.',
        grantedAbilities: [
          {
            id: 'incarnate_damage',
            name: '+6 Damage Bonus',
            description: '+6 bonus damage on all attacks'
          },
          {
            id: 'incarnate_advantage',
            name: 'Combat Advantage',
            description: 'Advantage on all melee attack rolls'
          },
          {
            id: 'incarnate_restrictions',
            name: 'Total Commitment',
            description: 'Cannot take defensive actions, disengage, or move away from enemies'
          }
        ]
      },

      cooldownConfig: {
        type: 'combat',
        value: 1,
        description: 'Once per combat'
      },

      tags: ['transformation', 'obliteration', 'berserker']
    },

    {
      id: 'berserk_primal_apex',
      name: 'Primal Apex',
      description: 'Reach the absolute pinnacle of berserker rage - a state of pure, unthinking violence that few warriors ever achieve. The transformation is overwhelming, leaving you temporarily drained when it ends.',
      level: 10,
      spellType: 'ACTION',
      icon: 'spell_shadow_unholyfrenzy',

      typeConfig: {
        school: 'bludgeoning',
        icon: 'spell_shadow_unholyfrenzy',
        tags: ['transformation', 'obliteration'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      resourceCost: {
        resourceTypes: ['mana', 'rage_state', 'rage_cost'],
        resourceValues: { mana: 0, rage_state: 'Obliteration', rage_cost: 100 },
        actionPoints: 4,
        components: ['verbal', 'somatic'],
        verbalText: 'UNSTOPPABLE!',
        somaticText: 'Achieve the primal apex of berserker fury'
      },

      resolution: 'NONE',
      effectTypes: ['transformation'],

      transformationConfig: {
        transformationType: 'physical',
        targetType: 'self',
        duration: 3,
        durationUnit: 'rounds',
        power: 'major',
        newForm: 'Primal Apex',
        description: 'Reach the absolute pinnacle of berserker rage, transcending mortal limits.',
        grantedAbilities: [
          {
            id: 'apex_damage',
            name: '+8 Damage Bonus',
            description: 'All attacks deal +8 additional damage'
          },
          {
            id: 'apex_immunity',
            name: 'Fear & Stun Immunity',
            description: 'Immune to fear and stun effects'
          },
          {
            id: 'apex_exhaustion',
            name: 'Exhaustion (On End)',
            description: 'Take exhaustion damage when transformation ends',
            damageFormula: '2d8'
          }
        ]
      },

      cooldownConfig: {
        type: 'combat',
        value: 1,
        description: 'Once per combat'
      },

      tags: ['buff', 'transformation', 'obliteration', 'berserker', 'self-damage']
    }
  ],

  // Spell pools for level-based spell selection
  spellPools: {
    1: [
      'berserk_basic_strike',
      'berserk_defensive_stance',
      'berserk_rage_tap'
    ]
  }
};

