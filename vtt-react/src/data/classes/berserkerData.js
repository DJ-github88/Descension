/**
 * Berserker Class Data
 * 
 * Complete class information for the Berserker - a fury-driven warrior
 * with escalating rage states and devastating combat abilities.
 */

export const BERSERKER_DATA = {
  id: 'berserker',
  name: 'Berserker',
  icon: 'fas fa-axe-battle',
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
  
  // Example Spells - organized by specialization, showcasing Rage States mechanic
  exampleSpells: [
    // SMOLDERING STATE (0-20 Rage) - Basic Abilities
    {
      id: 'berserk_basic_strike',
      name: 'Basic Strike',
      description: 'A standard melee attack. Available at all Rage levels.',
      spellType: 'ACTION',
      icon: 'ability_warrior_savageblow',
      school: 'Martial',
      level: 1,
      specialization: 'savage',

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
        mana: 0,
        classResource: {
          type: 'rage',
          cost: 5
        },
        components: ['somatic'],
        somaticText: 'Swing weapon with controlled fury'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '1d8',
        damageType: 'slashing',
        scalingType: 'none'
      },

      effects: {
        damage: {
          instant: {
            formula: '1d8',
            type: 'slashing'
          }
        }
      },

      specialMechanics: {
        rageState: {
          required: 'Smoldering (0-20)',
          rageGeneration: '1d6 on hit'
        }
      },

      tags: ['melee', 'damage', 'basic', 'smoldering', 'berserker']
    },

    {
      id: 'berserk_defensive_stance',
      name: 'Defensive Stance',
      description: 'Channel your rage into a defensive posture, gaining +2 AC for one round.',
      spellType: 'ACTION',
      icon: 'ability_warrior_defensivestance',
      school: 'Martial',
      level: 1,
      specialization: 'juggernaut',

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
        duration: 1
      },

      resourceCost: {
        mana: 0,
        classResource: {
          type: 'rage',
          cost: 10
        },
        components: ['somatic'],
        somaticText: 'Adopt defensive posture'
      },

      resolution: 'NONE',

      buffConfig: {
        stats: {
          armorClass: '+2'
        },
        effects: [
          '+2 AC for 1 round',
          'Can be used reactively'
        ]
      },

      effects: {
        buff: {
          duration: 1,
          stats: {
            ac: 2
          }
        }
      },

      specialMechanics: {
        rageState: {
          required: 'Smoldering (0-20)',
          rageGeneration: '1d4 if hit while in stance'
        }
      },

      tags: ['defense', 'buff', 'ac', 'smoldering', 'berserker']
    },

    // FRENZIED STATE (21-40 Rage) - Escalating Power
    {
      id: 'berserk_frenzied_slash',
      name: 'Frenzied Slash',
      description: 'A powerful attack fueled by rising fury, dealing an additional 1d6 damage.',
      spellType: 'ACTION',
      icon: 'ability_warrior_cleave',
      school: 'Martial',
      level: 2,
      specialization: 'savage',

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
        mana: 0,
        classResource: {
          type: 'rage',
          cost: 15
        },
        components: ['somatic'],
        somaticText: 'Unleash a frenzied strike'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '1d8+1d6',
        damageType: 'slashing',
        scalingType: 'none'
      },

      effects: {
        damage: {
          instant: {
            formula: '1d8+1d6',
            type: 'slashing'
          }
        }
      },

      specialMechanics: {
        rageState: {
          required: 'Frenzied (21-40)',
          rageGeneration: '1d6 on hit',
          bonus: '+1 to attack roll while Frenzied'
        }
      },

      tags: ['melee', 'damage', 'frenzied', 'berserker']
    },

    {
      id: 'berserk_war_cry',
      name: 'War Cry',
      description: 'Release a thunderous battle cry that increases allies\' attack rolls by +1 for one round.',
      spellType: 'ACTION',
      icon: 'ability_warrior_warcry',
      school: 'Martial',
      level: 2,
      specialization: 'warlord',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'aoe',
        rangeType: 'self',
        areaOfEffect: {
          type: 'RADIUS',
          size: 30,
          unit: 'feet'
        }
      },

      durationConfig: {
        durationType: 'rounds',
        duration: 1
      },

      resourceCost: {
        mana: 0,
        classResource: {
          type: 'rage',
          cost: 20
        },
        components: ['verbal'],
        verbalText: 'FOR GLORY!'
      },

      resolution: 'NONE',

      buffConfig: {
        effects: [
          'All allies within 30 feet gain +1 to attack rolls for 1 round',
          'Allies gain +5 temporary Rage if they are Berserkers'
        ]
      },

      effects: {
        buff: {
          duration: 1,
          aoe: true,
          radius: 30,
          stats: {
            attackBonus: 1
          }
        }
      },

      specialMechanics: {
        rageState: {
          required: 'Frenzied (21-40)',
          rageGeneration: '1d4 per ally affected'
        }
      },

      tags: ['buff', 'aoe', 'support', 'frenzied', 'berserker']
    },

    // PRIMAL STATE (41-60 Rage) - Self-Sustain Unlocked
    {
      id: 'berserk_primal_roar',
      name: 'Primal Roar',
      description: 'Unleash a primal roar that deals 2d6 damage to all enemies within 10 feet.',
      spellType: 'ACTION',
      icon: 'ability_warrior_warcry',
      school: 'Martial',
      level: 3,
      specialization: 'savage',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'aoe',
        rangeType: 'self',
        areaOfEffect: {
          type: 'RADIUS',
          size: 10,
          unit: 'feet'
        }
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 0,
        classResource: {
          type: 'rage',
          cost: 25
        },
        components: ['verbal'],
        verbalText: 'RAAAAGH!'
      },

      resolution: 'SAVE',

      saveConfig: {
        saveType: 'constitution',
        saveDC: 15,
        onSaveEffect: 'half_damage'
      },

      damageConfig: {
        formula: '2d6',
        damageType: 'thunder',
        scalingType: 'none'
      },

      effects: {
        damage: {
          instant: {
            formula: '2d6',
            type: 'thunder',
            aoe: true
          }
        }
      },

      specialMechanics: {
        rageState: {
          required: 'Primal (41-60)',
          rageGeneration: '1d4 per enemy hit',
          bonus: '+2 to attack rolls while Primal'
        }
      },

      tags: ['aoe', 'damage', 'thunder', 'primal', 'berserker']
    },

    {
      id: 'berserk_bloodlust',
      name: 'Bloodlust',
      description: 'Channel your rage into regenerative fury, healing for 1d8 hit points.',
      spellType: 'ACTION',
      icon: 'spell_shadow_lifedrain',
      school: 'Martial',
      level: 3,
      specialization: 'savage',

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
        mana: 0,
        classResource: {
          type: 'rage',
          cost: 30
        },
        components: ['somatic'],
        somaticText: 'Embrace the fury within'
      },

      resolution: 'NONE',

      healingConfig: {
        formula: '1d8',
        healingType: 'self'
      },

      effects: {
        healing: {
          instant: {
            formula: '1d8',
            target: 'self'
          }
        }
      },

      specialMechanics: {
        rageState: {
          required: 'Primal (41-60)',
          bonus: 'Healing increased by +1d6 if above 50 Rage'
        }
      },

      tags: ['healing', 'self-sustain', 'primal', 'berserker']
    },

    // CARNAGE STATE (61-80 Rage) - Elite Power
    {
      id: 'berserk_carnage_strike',
      name: 'Carnage Strike',
      description: 'A devastating attack dealing an additional 3d6 damage, leaving enemies reeling.',
      spellType: 'ACTION',
      icon: 'ability_warrior_decisivestrike',
      school: 'Martial',
      level: 4,
      specialization: 'savage',

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
        mana: 0,
        classResource: {
          type: 'rage',
          cost: 35
        },
        components: ['somatic'],
        somaticText: 'Strike with overwhelming force'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '1d8+3d6',
        damageType: 'slashing',
        scalingType: 'none'
      },

      effects: {
        damage: {
          instant: {
            formula: '1d8+3d6',
            type: 'slashing'
          }
        }
      },

      specialMechanics: {
        rageState: {
          required: 'Carnage (61-80)',
          rageGeneration: '2d6 on hit',
          bonus: '+3 to attack rolls while in Carnage state'
        }
      },

      tags: ['melee', 'damage', 'carnage', 'berserker']
    },

    {
      id: 'berserk_raging_defense',
      name: 'Raging Defense',
      description: 'Your fury becomes a shield. Gain resistance to all damage types for one round.',
      spellType: 'ACTION',
      icon: 'ability_warrior_shieldwall',
      school: 'Martial',
      level: 4,
      specialization: 'juggernaut',

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
        duration: 1
      },

      resourceCost: {
        mana: 0,
        classResource: {
          type: 'rage',
          cost: 40
        },
        components: ['somatic'],
        somaticText: 'Brace against all harm'
      },

      resolution: 'NONE',

      buffConfig: {
        effects: [
          'Gain resistance to all damage types for 1 round',
          'Take half damage from all sources'
        ]
      },

      effects: {
        buff: {
          duration: 1,
          resistances: ['all']
        }
      },

      specialMechanics: {
        rageState: {
          required: 'Carnage (61-80)',
          rageGeneration: '1d6 per attack received while active'
        }
      },

      tags: ['defense', 'resistance', 'buff', 'carnage', 'berserker']
    },

    // CATACLYSM STATE (81-100 Rage) - Peak Performance
    {
      id: 'berserk_cataclysmic_blow',
      name: 'Cataclysmic Blow',
      description: 'A massive strike dealing 4d6 damage to a single target, potentially stunning them.',
      spellType: 'ACTION',
      icon: 'ability_warrior_titansgrip',
      school: 'Martial',
      level: 5,
      specialization: 'savage',

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
        mana: 0,
        classResource: {
          type: 'rage',
          cost: 45
        },
        components: ['somatic'],
        somaticText: 'Channel all fury into one devastating blow'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '4d6',
        damageType: 'bludgeoning',
        scalingType: 'none'
      },

      debuffConfig: {
        effects: [
          'Target must make DC 16 Constitution save or be stunned for 1 round'
        ]
      },

      effects: {
        damage: {
          instant: {
            formula: '4d6',
            type: 'bludgeoning'
          }
        },
        debuff: {
          type: 'stun',
          duration: 1,
          saveType: 'constitution',
          saveDC: 16
        }
      },

      specialMechanics: {
        rageState: {
          required: 'Cataclysm (81-100)',
          rageGeneration: '2d6 on hit',
          bonus: '+4 to attack rolls while in Cataclysm state'
        }
      },

      tags: ['melee', 'damage', 'stun', 'cataclysm', 'berserker']
    },

    {
      id: 'berserk_unstoppable_force',
      name: 'Unstoppable Force',
      description: 'Your rage makes you immune to all conditions for one round. Nothing can stop you.',
      spellType: 'ACTION',
      icon: 'spell_nature_shamanrage',
      school: 'Martial',
      level: 5,
      specialization: 'juggernaut',

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
        duration: 1
      },

      resourceCost: {
        mana: 0,
        classResource: {
          type: 'rage',
          cost: 50
        },
        components: ['verbal', 'somatic'],
        verbalText: 'NOTHING STOPS ME!',
        somaticText: 'Surge forward with unstoppable momentum'
      },

      resolution: 'NONE',

      buffConfig: {
        effects: [
          'Gain immunity to all conditions for 1 round',
          'Cannot be stunned, paralyzed, frightened, charmed, or restrained',
          'Automatically succeed on saves against forced movement'
        ]
      },

      effects: {
        buff: {
          duration: 1,
          immunities: ['all_conditions']
        }
      },

      specialMechanics: {
        rageState: {
          required: 'Cataclysm (81-100)',
          warning: 'Approaching Overheat threshold - spend Rage wisely'
        }
      },

      tags: ['buff', 'immunity', 'conditions', 'cataclysm', 'berserker']
    },

    // OBLITERATION STATE (101+ Rage) - Ultimate Power
    {
      id: 'berserk_obliterating_strike',
      name: 'Obliterating Strike',
      description: 'An ultimate attack dealing 6d6 damage to all enemies within 20 feet. Must be used immediately or risk Overheat.',
      spellType: 'ACTION',
      icon: 'ability_warrior_rampage',
      school: 'Martial',
      level: 6,
      specialization: 'savage',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'aoe',
        rangeType: 'self',
        areaOfEffect: {
          type: 'RADIUS',
          size: 20,
          unit: 'feet'
        }
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 0,
        classResource: {
          type: 'rage',
          cost: 60
        },
        components: ['somatic'],
        somaticText: 'Unleash all accumulated fury in one devastating strike'
      },

      resolution: 'SAVE',

      saveConfig: {
        saveType: 'dexterity',
        saveDC: 17,
        onSaveEffect: 'half_damage'
      },

      damageConfig: {
        formula: '6d6',
        damageType: 'force',
        scalingType: 'none'
      },

      effects: {
        damage: {
          instant: {
            formula: '6d6',
            type: 'force',
            aoe: true
          }
        }
      },

      specialMechanics: {
        rageState: {
          required: 'Obliteration (101+)',
          warning: 'OVERHEAT IMMINENT - If not spent this round, take 2d6 damage and reset to 0 Rage',
          bonus: '+5 to attack rolls while in Obliteration state'
        }
      },

      tags: ['aoe', 'damage', 'ultimate', 'obliteration', 'berserker']
    },

    {
      id: 'berserk_wrath_berserker',
      name: 'Wrath of the Berserker',
      description: 'For the next three rounds, gain advantage on all attack rolls and +5 to damage. The ultimate expression of fury.',
      spellType: 'ACTION',
      icon: 'ability_warrior_innerrage',
      school: 'Martial',
      level: 6,
      specialization: 'warlord',

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
        duration: 3
      },

      resourceCost: {
        mana: 0,
        classResource: {
          type: 'rage',
          cost: 50
        },
        components: ['verbal', 'somatic'],
        verbalText: 'WITNESS TRUE FURY!',
        somaticText: 'Embrace the full power of rage'
      },

      resolution: 'NONE',

      buffConfig: {
        stats: {
          damageBonus: '+5'
        },
        effects: [
          'Advantage on all attack rolls for 3 rounds',
          '+5 to all damage rolls',
          'Rage Decay suspended during duration',
          'Allies within 30 feet gain +2 to attack rolls'
        ]
      },

      effects: {
        buff: {
          duration: 3,
          stats: {
            damageBonus: 5
          },
          advantages: ['attack'],
          aura: {
            radius: 30,
            allyBonus: 2
          }
        }
      },

      specialMechanics: {
        rageState: {
          required: 'Obliteration (101+)',
          warning: 'OVERHEAT IMMINENT - Using this ability prevents Overheat',
          bonus: 'Rage Decay suspended for duration'
        }
      },

      tags: ['buff', 'advantage', 'damage', 'ultimate', 'obliteration', 'berserker']
    }
  ]
};

