/**
 * Berserker Class Data
 *
 * Complete class information for the Berserker - a fury-driven warrior
 * with escalating rage states and devastating combat abilities.
 */

export const BERSERKER_DATA = {
  id: "berserker",
  name: "Berserker",
  icon: "fas fa-skull",
  role: "Damage",
  damageTypes: ["slashing", "bludgeoning"],

  // Overview section
  overview: {
    title: "The Berserker",
    subtitle: "Fury-Driven Warrior",

    quickOverview: {
      title: "Quick Overview",
      content: `**What You Need to Know**: The Berserker builds Rage (0-100) through combat actions and ascends through six escalating Rage States, each unlocking more powerful abilities. The longer you fight, the stronger you become—but exceed 101 Rage without spending it and you Overheat, taking 2d6 damage and resetting to 0.

**Core Mechanic**: Attack/take damage → Build Rage → Ascend through Rage States → Spend Rage on devastating abilities → Avoid Overheat

**Resource**: Rage (0-100 scale, visualized as 2d10 dice)

**Playstyle**: Aggressive momentum-based melee, escalating power, high-risk high-reward

**Best For**: Players who enjoy building momentum, managing escalating power, and aggressive frontline combat`,
    },

    description: `The Berserker harnesses their inner fury to unleash devastating attacks and gain incredible resilience. This class revolves around building and utilizing Rage, a resource that grows as they engage in combat. The Berserker's abilities scale with their Rage, becoming more powerful as their fury intensifies. By managing their Rage effectively, Berserkers can transition between different states of rage, each offering unique and potent effects.`,

    roleplayIdentity: {
      title: "Roleplay Identity",
      content: `Berserkers are warriors who have learned to channel their primal fury into devastating combat prowess. Unlike controlled fighters, they embrace the chaos of battle, allowing their rage to fuel superhuman feats of strength and endurance. In roleplay, Berserkers often struggle with the line between controlled fury and mindless violence.

Their rage manifests physically: veins bulge, muscles swell, eyes blaze with fury, and their very presence becomes intimidating. At higher Rage States, they may lose the ability to speak coherently, communicating only through roars and battle cries.

Common Berserker archetypes include:
- **The Tribal Warrior**: Raised in a culture that venerates battle fury
- **The Scarred Veteran**: Years of combat have awakened an unstoppable rage
- **The Cursed Bloodline**: Born with an ancestral fury they cannot fully control
- **The Righteous Avenger**: Rage fueled by a burning need for justice or revenge`,
    },

    combatRole: {
      title: "Combat Role",
      content: `The Berserker is a frontline damage dealer who thrives in the thick of combat. They excel at:

**Sustained Damage**: Building Rage through combat actions creates escalating damage output
**Resilience**: Higher Rage States grant defensive bonuses and damage resistance
**Momentum**: The longer the fight, the more dangerous the Berserker becomes
**Battlefield Control**: AOE abilities and intimidating presence affect multiple enemies

However, Berserkers must carefully manage their Rage. Letting it decay wastes their potential, while letting it exceed 100 triggers Overheat, dealing massive self-damage and resetting their Rage to 0. The key is maintaining high Rage States while spending it strategically on powerful abilities.`,
    },

    playstyle: {
      title: "Playstyle & Strategy",
      content: `Playing a Berserker is about building and maintaining momentum. Key strategic considerations:

**Rage State Management**: 
- Smoldering (0-20): Building phase, basic abilities only, +1 skill checks
- Frenzied (21-40): +1 attack, +5 ft movement, +1 melee damage — but -1 ranged
- Primal (41-60): +2 attack, +2 melee damage, 1 HP lifesteal on crits — but -1 Armor
- Carnage (61-80): +3 attack, +3 melee damage, -1 incoming weapon damage — but -2 ranged, no Stealth
- Cataclysm (81-100): +4 attack, +4 melee damage, immune to Frightened — but enemies gain +1 to hit, 1d4 recoil on miss
- Obliteration (101-124): +5 attack, +5 melee damage, crits splash +1d6 — but -2 Armor, enemies gain +2 to hit, MUST SPEND OR OVERHEAT
- Annihilation (125-149): +6 attack, +6 melee damage, +10 ft movement, expanded crit range — but -3 Armor, enemies gain +3 to hit, 1d6 damage/turn
- Apocalypse (150+): +7 attack, +8 melee damage, +15 ft movement, all melee hits adjacent enemies, immune to all conditions — but -5 Armor, enemies gain +4 to hit, 2d6 damage/turn, no ranged attacks

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
- Always have a plan to spend Rage when approaching 100`,
    },

    immersiveCombatExample: {
      title: "Combat Example: The Arena of Blood",
      content: `**The Setup**: You stand in the center of a gladiatorial arena, facing three armored pit fighters. The crowd roars for blood. Your greataxe feels light in your hands. Your Rage is at 0 — for now.

**Turn 1 - First Blood (Rage: 0 → 8)**

*The first pit fighter charges. You meet him head-on, your axe swinging in a brutal arc.*

**Action**: Attack with greataxe → Hit!
**Rage Generation**: Roll 1d6 → [6] → Gain 6 Rage
**Enemy Counterattack**: Pit fighter strikes you → 8 damage taken
**Rage Generation**: Roll 1d4 → [2] → Gain 2 Rage

**Current Rage: 8** (Smoldering State)

*You feel the first stirrings of fury. Your muscles tense. Your breathing quickens. The pain from the pit fighter's blade doesn't hurt — it FUELS you.*

**Turn 2 - Building Fury (Rage: 8 → 23)**

*The second pit fighter joins the fray. Two against one. Good. More targets.*

**Action**: Attack pit fighter #1 → Hit!
**Rage Generation**: Roll 1d6 → [5] → Gain 5 Rage (now at 13)
**Action**: Second attack (extra attack from action points) → Hit!
**Rage Generation**: Roll 1d6 → [4] → Gain 4 Rage (now at 17)
**Enemy Attacks**: Both pit fighters strike you → 12 damage total
**Rage Generation**: Roll 1d4 → [6] → Gain 6 Rage (now at 23)

**Current Rage: 23** (Frenzied State - UNLOCKED!)

*Your vision starts to tinge red. Veins bulge in your neck and arms. You let out a guttural roar that echoes through the arena. The crowd goes wild. You've entered the Frenzied State — +1 to attack rolls, +5 ft movement, +1 melee damage.*

**Turn 3 - Ascending Wrath (Rage: 23 → 43)**

*The third pit fighter hesitates. He sees the fury in your eyes. Smart man. Won't save him.*

**Action**: Frenzied Slash (Rage ability) on pit fighter #1 → CRITICAL HIT!
**Rage Cost**: Spend 8 Rage (now at 15)
**Rage Generation**: Roll 2d6 → [5, 6] = 11 → Gain 11 Rage (now at 26)
**Result**: Pit fighter #1 drops, blood spraying across the sand
**Rage Generation**: Defeated enemy → Roll 1d8 → [8] → Gain 8 Rage (now at 34)
**Enemy Attack**: Pit fighter #2 strikes you → 6 damage
**Rage Generation**: Roll 1d4 → [3] → Gain 3 Rage (now at 37)
**Action**: Charge pit fighter #2 → Hit!
**Rage Generation**: Roll 1d6 → [6] → Gain 6 Rage (now at 43)

**Current Rage: 43** (Primal State - UNLOCKED!)

*Something primal awakens inside you. Your muscles swell beyond natural limits. Blood from your wounds seems to flow backward, sealing cuts through sheer force of will. You've unlocked Bloodlust — you now regenerate health each turn. +2 to attack rolls, +2 melee damage, 1 HP lifesteal on crits. The crowd's roar fades to a dull hum. All you hear is your heartbeat. All you see is prey.*

**Turn 4 - Peak Carnage (Rage: 43 → 61)**

*Two pit fighters remain. They're backing away. Cowards.*

**Passive**: Bloodlust activates → Heal 1d8 HP → [6] → Regain 6 HP
**Action**: Primal Roar (AoE intimidation + damage)
**Rage Cost**: Spend 15 Rage (now at 28)
**Effect**: Both pit fighters take 2d6 damage and are frightened
**Action**: Attack frightened pit fighter #2 → Hit with advantage!
**Rage Generation**: Roll 1d6 → [6] → Gain 6 Rage (now at 34)
**Action**: Second attack → Hit!
**Rage Generation**: Roll 1d6 → [4] → Gain 4 Rage (now at 38)
**Enemy Attacks**: Pit fighter #3 attacks with disadvantage (frightened) → hits you for 8 damage
**Rage Generation**: Roll 1d4 → [4] → Gain 4 Rage (now at 42)

*You laugh. A sound like grinding stone. You attack again.*

**Action**: Third attack → CRITICAL HIT!
**Rage Generation**: Roll 2d6 → [6, 5] = 11 → Gain 11 Rage (now at 53)
**Result**: Pit fighter #2 falls, skull caved in
**Rage Generation**: Defeated enemy → Roll 1d8 → [8] → Gain 8 Rage (now at 61)

**Current Rage: 61** (Carnage State - UNLOCKED!)

*Your body is a weapon. Your axe is just an extension of your will. You've reached Carnage State — +3 to attack rolls, +3 melee damage, reduce incoming weapon damage by 1. The last pit fighter drops his weapon and runs. The crowd screams for you to finish him.*

**Turn 5 - The Overheat Danger (Rage: 61 → 87)**

*You chase him down. He's fast. You're faster.*

**Action**: Carnage Strike (massive Rage-fueled attack)
**Rage Cost**: Spend 20 Rage (now at 41)
**Effect**: 4d10 damage → Pit fighter #3 is nearly dead
**Rage Generation**: Roll 1d6 → [6] → Gain 6 Rage (now at 47)
**Action**: Basic attack to finish him → Hit!
**Rage Generation**: Roll 1d6 → [5] → Gain 5 Rage (now at 52)
**Result**: Pit fighter #3 dies
**Rage Generation**: Defeated enemy → Roll 1d8 → [8] → Gain 8 Rage (now at 60)

*The crowd erupts. They want MORE. They throw weapons into the arena. A massive armored champion enters — the Arena Master himself.*

**Action**: You roar and charge → Hit!
**Rage Generation**: Roll 1d6 → [6] → Gain 6 Rage (now at 66)
**Enemy Attack**: Arena Master's massive hammer strikes you → 15 damage!
**Rage Generation**: Roll 1d4 → [4] → Gain 4 Rage (now at 70)
**Action**: Second attack → CRITICAL HIT!
**Rage Generation**: Roll 2d6 → [6, 6] = 12 → Gain 12 Rage (now at 82)
**Action**: Third attack → Hit!
**Rage Generation**: Roll 1d6 → [5] → Gain 5 Rage (now at 87)

**Current Rage: 87** (Cataclysm State - DANGER ZONE!)

*You're at the peak. +4 to attack rolls, +4 melee damage, immune to Frightened. But enemies gain +1 to hit you, and a miss deals 1d4 recoil damage. You're 14 points from Obliteration. One bad crit sequence and you'll Overheat.*

**Turn 6 - Controlled Destruction (Rage: 87 → 64)**

*You need to spend this Rage NOW or it will consume you.*
**Action**: Cataclysmic Blow (ultimate Rage ability)
**Rage Cost**: Spend 30 Rage (now at 57)
**Effect**: 3d8 + strength + 2d6 damage + knockback + stun
**Result**: Arena Master is staggered, armor cracked, bleeding heavily

*You feel the fury drain from you like water from a broken dam. Your vision clears slightly. Your muscles ache. But you're still in Carnage State (57 Rage), still dangerous.*

**Action**: Attack while he's stunned → Hit!
**Rage Generation**: Roll 1d6 → [3] → Gain 3 Rage (now at 60)
**Action**: Second attack → Hit!
**Rage Generation**: Roll 1d6 → [4] → Gain 4 Rage (now at 64)
**Result**: Arena Master falls to his knees, defeated

*You stand over him, axe raised. The crowd chants your name. Your Rage slowly begins to decay (64 → 59 → 54...), but the battle is won.*

**The Lesson**: The Berserker is about riding the wave of fury — building it through aggression, spending it before it consumes you, and knowing when to unleash your most devastating abilities. You're not just managing a resource; you're wrestling with a beast inside you that wants to break free.

> **What If — The Overheat Scenario**: In Turn 5, imagine your third attack had crit instead of hitting normally. Roll 2d6 → [6, 6] = 12 instead of 5. You'd hit 94 Rage instead of 87. Then if the Arena Master's counterattack had dealt 18 instead of 15 damage, the 1d4 Rage would be [4], pushing you to 98. One more crit on your next attack and you're at 110+ — Obliteration. You'd have ONE round to spend Obliterating Strike (60 Rage) or eat 2d6 damage and reset to 0. This is the razor's edge every Berserker dances on.`,
    },
  },

  // Character Creation
  equipment: {
    title: "Starting Equipment",
    description:
      "Choose one of the following weapon paths. All Berserkers also receive the standard adventuring gear listed below.",

    choices: [
      {
        name: "Greataxe Path",
        icon: "Slashing/Cross Slash",
        items: [
          "Greataxe (2d12 slashing)",
          "Hide Armor (AC 12 + Dex mod, max Dex +2)",
          "2 Throwing Axes (1d6 slashing, range 20/60)",
        ],
        description:
          "Maximum single-hit damage. Best for Savage and Warlord specializations that want big crits and Rage generation per strike.",
      },
      {
        name: "Dual Warhammer Path",
        icon: "Bludgeoning/Mortal Strike",
        items: [
          "Two Warhammers (1d10 bludgeoning each)",
          "Chain Shirt (AC 13 + Dex mod, max Dex +2)",
          "2 Throwing Hammers (1d6 bludgeoning, range 20/60)",
        ],
        description:
          "More attacks per turn means more Rage generation. Best for Juggernauts who want consistent Rage building through multiple hits.",
      },
    ],

    standardGear: [
      "Explorer's Pack (backpack, bedroll, mess kit, tinderbox, torches, rations x10, waterskin, rope 50ft)",
      "2d4 x 10 gold pieces",
    ],

    notes:
      "Berserkers cannot start with ranged weapons heavier than a throwing axe or throwing hammer. Your fury is a close-quarters weapon — the bow is for cowards.",
  },

  creationSteps: [
    {
      step: 1,
      title: "Choose Specialization",
      description:
        "Select Savage (aggressive offense), Juggernaut (tanky resilience), or Warlord (team support).",
    },
    {
      step: 2,
      title: "Select Weapon Path",
      description:
        "Choose the Greataxe (big hits) or Dual Warhammers (more attacks, more Rage).",
    },
    {
      step: 3,
      title: "Pick Your Stance",
      description:
        "Toggle Defensive Stance (+2 Armor, enemies build your Rage faster) or Rage Tap (+1d4 damage, attacks build Rage faster).",
    },
    {
      step: 4,
      title: "Understand Overheat",
      description:
        "Rage exceeding 100 triggers Overheat — you have one round to spend below 100 or take 2d6 damage and reset. Always have an escape valve.",
    },
    {
      step: 5,
      title: "Learn Your Rage States",
      description:
        "You start at Smoldering (0-20). Attack to build Rage, ascend through states, and spend before you explode.",
    },
  ],

  // Resource System
  resourceSystem: {
    title: "Rage States",
    subtitle: "Escalating Fury Mechanic",

    description: `Rage is a pressure gauge, not a savings account. It builds through aggression, decays through passivity, and unlocks escalating power as it climbs through six states. The goal is to ride the wave — keep Rage high, spend it before it explodes, and ride the edge of Obliteration.`,

    cards: [
      {
        title: "Rage (2d10)",
        stats: "0-100 Scale",
        details:
          "A pressure gauge, not a mana pool. Climbs through 6 escalating states as you fight. Passivity decays it. Hitting 101+ without spending triggers Overheat.",
      },
    ],

    generationTable: {
      headers: ["Trigger", "Rage Change", "Notes"],
      rows: [
        ["Successful Attack (Hit)", "+1d6", "Core generation loop"],
        [
          "Critical Hit",
          "+2d6",
          "Major spike — watch for Overheat at high Rage",
        ],
        ["Taking Damage", "+1d4", "Pain fuels the fury"],
        ["Defeating an Enemy", "+1d8", "Bloodlust surge"],
        ["No Rage action taken", "-5 per round", "Passivity is punished"],
        [
          "Spending an ability",
          "-Ability Cost",
          "Spending prevents Overheat and unleashes power",
        ],
        [
          "Overheat (101+, unspent)",
          "→ Reset to 0",
          "2d6 self-damage, lose all State bonuses",
        ],
      ],
    },

    usage: {
      momentum:
        "Ability costs range 5–100 Rage. Spending brings you back down through States — time it to maximize your current State bonuses before dropping.",
      flourish:
        "⚠️ Overheat: Exceed 101 Rage without spending within 1 round → 2d6 damage, Rage resets to 0. Advanced tactic: push to 101 intentionally to access Obliterating Strike, then spend immediately.",
    },

    overheatRules: {
      title: "Overheat",
      content: `When Rage exceeds 100 you enter the Obliteration State — the most powerful state, but a ticking clock.

**You have ONE ROUND** to spend Rage below 101. If you don't:
- Take **2d6 damage** (fury turns inward)
- Rage **resets to 0** (complete exhaustion)
- Lose **all State bonuses**

**How much do you need to spend?**
- At 101 Rage → spend 1+
- At 109 Rage → spend 9+
- At 115 Rage → spend 15+

**Advanced Play — Intentional Overheat:**
Pushing past 101 deliberately to access Obliterating Strike or Wrath of the Berserker is viable. You take the 2d6 hit, but the payoff can end the fight. Use it when you're confident or desperate.`,
    },

    rageStatesTable: {
      title: "Rage States & Abilities",
      headers: [
        "Rage State",
        "Rage Range",
        "Unlocked Abilities",
        "Bonuses",
        "Penalties",
      ],
      rows: [
        [
          "Smoldering",
          "0-20",
          "Basic Strike, Defensive Stance, Rage Tap",
          "+1 to skill checks",
          "None",
        ],
        [
          "Frenzied",
          "21-40",
          "Frenzied Slash, War Cry, Bloodthirst",
          "+1 attack, +5 ft movement, +1 damage on melee hits",
          "-1 to ranged attack rolls",
        ],
        [
          "Primal",
          "41-60",
          "Primal Roar, Bloodlust, Savage Leap",
          "+2 attack, +2 damage on melee hits, 1 HP lifesteal on crits",
          "-1 Armor while raging",
        ],
        [
          "Carnage",
          "61-80",
          "Carnage Strike, Raging Defense, Intimidating Presence",
          "+3 attack, +3 damage, Reduce incoming weapon damage by 1",
          "-2 to ranged attacks, Disadvantage on Stealth",
        ],
        [
          "Cataclysm",
          "81-100",
          "Cataclysmic Blow, Unstoppable Force",
          "+4 attack, +4 damage, Immune to Frightened",
          "Attackers gain +1 to hit, 1d4 recoil damage on miss",
        ],
        [
          "Obliteration",
          "101-124",
          "Obliterating Strike, Wrath of the Berserker",
          "+5 attack, +5 damage, Crits explode: +1d6 splash to adjacent",
          "-2 Armor, Attackers gain +2 to hit — SPEND OR OVERHEAT",
        ],
        [
          "Annihilation",
          "125-149",
          "Annihilating Fury, Unstoppable Rampage",
          "+6 attack, +6 damage, +10 ft movement, Crit range +1, Advantage on Strength checks",
          "-3 Armor, Attackers gain +3 to hit, 1d6 damage at start of each turn",
        ],
        [
          "Apocalypse",
          "150+",
          "Apocalyptic Wrath, Berserker God Mode",
          "+7 attack, +8 damage, +15 ft movement, Crit range +2, Melee hits adjacent enemies, Immune to all conditions",
          "-5 Armor, Attackers gain +4 to hit, 2d6 damage at start of each turn, No ranged attacks",
        ],
      ],
    },

    strategicConsiderations: {
      title: "Combat Phases & Decision-Making",
      content: `**Building (0–40 Rage)**: Attack relentlessly. Don't waste Rage on abilities yet — every point is climbing toward real power. Use basic abilities only if absolutely necessary.

**Sweet Spot (41–80 Rage)**: Primal and Carnage are your bread and butter. You have strong bonuses AND enough buffer to spend without dropping too low. Alternate spending and building — keep the rhythm.

**Peak Fury (81–100 Rage)**: Maximum effectiveness. Plan every spend carefully. One bad crit and you're at 101+. Before attacking, ask: "If I crit, can I spend what it would push me to?"

**Overheat Zone (101+ Rage)**: Emergency. Use your most expensive ability immediately. Obliterating Strike (60 Rage) is your best escape valve. Do NOT miss.

**Advanced Play — Intentional Overheat**: At 90+ Rage, deliberately chase crits to hit 101+, access Obliteration bonuses, and immediately spend Obliterating Strike before the round ends. High-risk, high-reward — only when confident.

**Rage Decay**: If combat slows and you're at 60+ Rage, spend on a utility ability (Raging Defense, Intimidating Presence) rather than letting it decay. Wasted Rage is wasted power.

**Worked Example (87 Rage, Cataclysm, Boss at 40% HP)**:
- **Option A** — Cataclysmic Blow (−30 Rage): Drops to Primal, but may end the fight. Best if boss looks fragile.
- **Option B** — Primal Roar (−15 Rage): Stays at Cataclysm, but lower burst. Best if you need AoE or the healer can hold.
- **Option C** — Attack → build to 95+, then Obliterating Strike: Best if boss is clearly tanky.
- **Option D** — Push to 101+, spend Obliterating Strike: Only if you're willing to eat 2d6 and the reward justifies it.

→ **Best default**: Option A. Boss at 40% is within one massive hit. Cash in the fury.`,
    },

    playingInPerson: {
      title: "Playing in Person",
      subtitle: "Physical Tracking for Tabletop Play",
      content: `Two red d10s on the table in front of you. Left die = tens. Right die = ones. That's your Rage. Watch it climb.

**Required Materials**:
- **2d10** (red/orange for thematic fire — but any d10s work)
- **Rage State reference card** (thresholds + bonuses at a glance)

**How to Read Your Rage**:
- Left [6], Right [3] = 63 Rage → Carnage State
- Left [8], Right [7] = 87 Rage → Cataclysm State
- Left [0], Right [0] = 0 Rage → Smoldering
- **101+**: Both dice physically can't show this cleanly — use a token beside them as the ⚠️ Overheat marker

**Each Turn — Adjust the Dice**:
- Hit → roll 1d6, add to dice total
- Crit → roll 2d6, add to dice total
- Take damage → roll 1d4, add to dice total
- Kill → roll 1d8, add to dice total
- Spend ability → subtract cost from dice total
- No attack this round → subtract 5 at end of round

**Rage State Reference**:
\`\`\`
RAGE STATES (2d10 = Tens + Ones):

🔥 Smoldering  0–20  | No bonuses
🔥 Frenzied   21–40  | +1 ATK, +5 ft
🔥 Primal     41–60  | +2 ATK, +10 ft, +1d4 dmg
🔥 Carnage    61–80  | +3 ATK, +15 ft, +1d6 dmg, 25% resist
💀 Cataclysm  81–100 | +4 ATK, +20 ft, +1d8 dmg, 50% resist, immune fear/stun
⚠️ Obliteration 101+ | +5 ATK, +25 ft, +2d6 dmg, 50% resist, immune all — SPEND OR OVERHEAT

RAGE GENERATION:
  Hit → +1d6 | Crit → +2d6 | Damage → +1d4 | Kill → +1d8
  No attack → −5/round

OVERHEAT (101+): 1 round to spend below 101
  → Fail: 2d6 self-damage, Rage resets to 0
\`\`\`

**Pro Tips**:
- Slam the dice down when you enter a new State — make it dramatic
- Keep the reference card visible at all times so you know your bonuses instantly
- At 80+ Rage: before every attack, check "if I crit, where does that put me?" and have a spend ready
- **Intentional Overheat**: If at 90+ and holding Obliterating Strike — go for the crit, push past 101, spend immediately. That's Berserker mastery.`,
    },
  },

  // Specializations
  specializations: {
    title: "Berserker Specializations",
    subtitle: "Three Paths of Fury",

    description: `Every Berserker chooses one of three specializations that define their approach to rage-fueled combat. Each specialization offers unique passive abilities and influences your Rage management strategy.`,

    specs: [
      {
        id: "savage",
        name: "Savage",
        icon: "Utility/Empowered Warrior",
        color: "#8B0000",
        theme: "Relentless Aggression",

        description: `The Savage specialization embodies pure, unrelenting aggression. Savage Berserkers build Rage faster and hit harder, ascending through Rage States rapidly to overwhelm enemies with brutal force.`,

        playstyle:
          "Fast Rage generation, aggressive offense, rapid state transitions",

        strengths: [
          "Generate +2 Rage from all sources",
          "Critical hit chance increased by 10%",
          "Abilities cost 5 less Rage",
          "Faster ascension through Rage States",
        ],

        weaknesses: [
          "More prone to Overheat",
          "Limited defensive options",
          "Requires constant aggression",
          "Vulnerable when Rage is low",
        ],

        keyAbilities: [
          "Savage Strikes: Critical hits generate additional Rage",
          "Bloodthirst: Heal for a portion of damage dealt",
          "Reckless Abandon: Trade defense for offense at high Rage",
        ],

        specPassive: {
          name: "Unrelenting Fury",
          description:
            "Generate +2 Rage from all sources. When you defeat an enemy, your next ability costs 5 less Rage (minimum 0).",
        },
      },
      {
        id: "juggernaut",
        name: "Juggernaut",
        icon: "Utility/Shield",
        color: "#4169E1",
        theme: "Immovable Force",

        description: `The Juggernaut specialization focuses on resilience and endurance. Juggernaut Berserkers use their Rage to become nearly unkillable, standing firm against overwhelming odds while their fury makes them stronger.`,

        playstyle: "Defensive Rage usage, damage mitigation, sustained combat",

        strengths: [
          "Gain temporary HP equal to Rage spent",
          "Damage resistance scales with Rage State",
          "Rage Decay reduced by 50%",
          "Can maintain high Rage States longer",
        ],

        weaknesses: [
          "Lower damage output compared to Savage",
          "Less burst potential at lower Rage States",
          "Vulnerable when Rage is low and defenses haven't scaled",
          "Relies on being targeted to generate Rage efficiently",
        ],

        keyAbilities: [
          "Juggernaut's Endurance: Convert Rage into temporary HP",
          "Immovable Object: Become immune to forced movement",
          "Rage Armor: Armor increases with Rage State",
        ],

        specPassive: {
          name: "Juggernaut Resilience",
          description:
            "Rage Decay reduced by 50%. Taking damage generates 2d4 Rage instead of 1d4. Gain damage resistance equal to 5% per Rage State (max 40% at Apocalypse).",
        },
      },
      {
        id: "warlord",
        name: "Warlord",
        icon: "Utility/Powerful Warrior",
        color: "#DAA520",
        theme: "Tactical Fury",

        description: `The Warlord specialization combines rage with tactical awareness. Warlord Berserkers inspire allies, control the battlefield, and use their fury strategically rather than recklessly.`,

        playstyle:
          "Team support, battlefield control, balanced Rage management",

        strengths: [
          "Abilities affect multiple allies",
          "War Cry grants team-wide buffs",
          "Can share Rage benefits with party",
          "Excellent in group combat",
        ],

        weaknesses: [
          "Less effective solo",
          "Moderate damage output",
          "Requires coordination",
          "Abilities have longer cooldowns",
        ],

        keyAbilities: [
          "Inspiring Presence: Allies within 30 feet gain bonus damage",
          "Commanding Shout: Grant allies temporary Rage benefits",
          "Tactical Fury: Spend Rage to grant allies advantage on attacks",
        ],

        specPassive: {
          name: "Warlord's Command",
          description:
            "When you use War Cry or Commanding Shout, allies within 30 feet gain a stack of Battle Fury (+1d4 bonus damage) for the duration, stacking up to 3 times. When you defeat an enemy, all allies within 30 feet gain +2 to their next attack roll.",
        },
      },
    ],
  },

  // Complete Spell System - organized by Rage States and Level
  spells: [
    // ========================================
    // LEVEL 1 SPELLS - Basic Abilities
    // ========================================

    {
      id: "berserk_basic_strike",
      name: "Basic Strike",
      description:
        "Channel your inner fury into a devastating melee strike. Each successful hit feeds the beast within, building your rage and bringing you closer to unleashing your full power.",
      level: 1,
      spellType: "ACTION",
      icon: "Slashing/Cross Slash",

      typeConfig: {
        school: "bludgeoning",
        icon: "Slashing/Cross Slash",
        tags: ["melee", "damage", "rage generation", "starter"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "melee",
        rangeDistance: 5,
        targetRestrictions: ["enemy"],
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 0 },
        actionPoints: 1,
        components: ["somatic"],
        somaticText:
          "Swing with controlled fury, rage building with each motion",
      },

      resolution: "DICE",
      effectTypes: ["damage"],

      rageGain: "1d6",

      damageConfig: {
        formula: "1d8 + strength",
        damageTypes: ["bludgeoning"],

        description:
          "A brutal strike driven by growing rage. Each hit feeds the fury within, escalating your power with every blow.",
        resolution: "DICE",
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 0,
      },

      tags: ["melee", "damage", "rage generation", "starter", "berserker"],

      rollableTable: {
        enabled: true,
        tableName: "Rage Surge",
        description: "Your fury erupts unpredictably with each strike, sometimes empowering you, sometimes spiraling out of control.",
        diceFormula: "1d20",
        resolutionType: "DICE",
        resolutionConfig: { diceType: "d20" },
        entries: [
          { range: { min: 1, max: 1 }, customName: "Fizzle", effect: "Your rage misfires. Take 1d4 self damage from suppressed fury." },
          { range: { min: 2, max: 3 }, customName: "Weak Strike", effect: "The blow lands feebly. Half damage on this attack." },
          { range: { min: 4, max: 6 }, customName: "Steady Hit", effect: "A clean strike. Normal damage, +1 Rage." },
          { range: { min: 7, max: 9 }, customName: "Fueled by Fury", effect: "Deal +1d6 bonus damage as rage empowers the strike." },
          { range: { min: 10, max: 12 }, customName: "Raging Blow", effect: "Deal +1d8 bonus damage and gain +2 Rage." },
          { range: { min: 13, max: 14 }, customName: "Brutal Slam", effect: "Knock the target 5 ft back. Deal +2d4 damage." },
          { range: { min: 15, max: 16 }, customName: "Blood Spray", effect: "Strike an artery. Target takes 1d4 bleeding damage per round for 2 rounds." },
          { range: { min: 17, max: 17 }, customName: "Rage Overflow", effect: "Deal +2d6 damage but take 1d4 self damage from uncontrolled fury." },
          { range: { min: 18, max: 18 }, customName: "Primal Howl", effect: "Let out a terrifying roar. All enemies within 10 ft are Frightened for 1 round." },
          { range: { min: 19, max: 19 }, customName: "Fury Unleashed", effect: "Deal +3d6 damage. Gain +1d8 Rage." },
          { range: { min: 20, max: 20 }, customName: "Berserker Epiphany", effect: "The rage achieves terrible clarity. Deal +4d6 damage and gain +2d6 Rage. Next attack has advantage." },
        ],
      },
    },

    {
      id: "berserk_defensive_stance",
      name: "Defensive Stance",
      description:
        "Brace yourself in an unbreakable defensive posture. Your fury hardens your resolve, turning every attack against you into fuel for your rage. Only one stance can be active at a time.",
      level: 1,
      spellType: "PASSIVE",
      icon: "Utility/Deflecting Shield",

      typeConfig: {
        school: "bludgeoning",
        icon: "Utility/Deflecting Shield",
        tags: [
          "defense",
          "buff",
          "rage generation",
          "stance",
          "toggleable",
          "starter",
        ],
        toggleable: true,
        exclusiveGroup: "berserker_stance",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 0 },
        actionPoints: 0,
        components: [],
      },

      resolution: "NONE",
      effectTypes: ["buff"],

      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          {
            id: "defensive_stance_ac",
            name: "Iron Defense",
            description:
              "Gain +2 armor. Your fury hardens your resolve, turning every attack against you into fuel for your rage",
            statModifier: {
              stat: "armor",
              magnitude: 2,
              magnitudeType: "flat",
            },
          },
          {
            id: "defensive_stance_rage_gen",
            name: "Rage Fuel",
            description:
              "Attacks against you generate +1 additional Rage (2 Rage total instead of 1)",
            statModifier: {
              stat: "rageGeneration",
              magnitude: 1,
              magnitudeType: "flat",
            },
          },
        ],
        durationValue: 0,
        durationType: "permanent",
        durationUnit: "permanent",
        concentrationRequired: false,
        canBeDispelled: false,
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 0,
      },

      tags: [
        "defense",
        "buff",
        "rage generation",
        "stance",
        "toggleable",
        "starter",
        "berserker",
      ],
    },

    {
      id: "berserk_rage_tap",
      name: "Rage Tap",
      description:
        "Awaken the beast within through primal fury. Your attacks grow more ferocious, and every strike feeds the storm of rage inside you. Only one stance can be active at a time.",
      level: 1,
      spellType: "PASSIVE",
      icon: "Slashing/Bloody Slash",

      typeConfig: {
        school: "bludgeoning",
        icon: "Slashing/Bloody Slash",
        tags: [
          "buff",
          "rage generation",
          "damage",
          "stance",
          "toggleable",
          "starter",
        ],
        toggleable: true,
        exclusiveGroup: "berserker_stance",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 0 },
        actionPoints: 0,
        components: [],
      },

      resolution: "NONE",
      effectTypes: ["buff"],

      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          {
            id: "primal_awakening",
            name: "Primal Awakening",
            description: "+1d4 bonus damage on all attacks",
            damageFormula: "+1d4",
            statModifier: {
              stat: "damage",
              magnitude: "1d4",
              magnitudeType: "flat",
            },
          },
          {
            id: "rage_tap_generation",
            name: "Rage Surge",
            description:
              "Successful attacks generate +1 additional Rage (2 Rage total instead of 1). Every strike feeds the growing storm of rage inside you",
            statModifier: {
              stat: "rageGeneration",
              magnitude: 1,
              magnitudeType: "flat",
            },
          },
        ],
        durationValue: 0,
        durationType: "permanent",
        durationUnit: "permanent",
        concentrationRequired: false,
        canBeDispelled: false,
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 0,
      },

      tags: [
        "buff",
        "rage generation",
        "damage",
        "stance",
        "toggleable",
        "starter",
        "berserker",
      ],
    },

    // ========================================
    // LEVEL 2 SPELLS - Enhanced Abilities
    // ========================================

    {
      id: "berserk_frenzied_slash",
      name: "Frenzied Slash",
      description:
        "Unleash a whirlwind of savage strikes fueled by primal fury. Each hit feeds your rage, and devastating blows send enemies flying from the sheer force.",
      level: 2,
      spellType: "ACTION",
      icon: "Slashing/Cleave",

      typeConfig: {
        school: "slashing",
        icon: "Slashing/Cleave",
        tags: ["melee", "damage", "rage generation", "frenzied"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "melee",
        rangeDistance: 5,
        targetRestrictions: ["enemy"],
      },

      resourceCost: {
        resourceTypes: ["mana", "rage_state", "rage_cost"],
        resourceValues: { mana: 0, rage_state: "Frenzied", rage_cost: 8 },
        actionPoints: 1,
        components: ["somatic"],
        somaticText:
          "Unleash a whirlwind of savage strikes, vision red with fury",
      },

      rageGain: "1d6",

      resolution: "DICE",
      effectTypes: ["damage"],

      damageConfig: {
        formula: "1d8 + strength + 1d6",
        damageTypes: ["slashing"],

        canCrit: true,
        critMultiplier: 2,
        critDiceOnly: false,
        criticalConfig: {
          enabled: true,
          critType: "dice",
          critMultiplier: 2,
          critEffects: ["knockback"],
        },
        chanceOnHitConfig: {
          enabled: true,
          procType: "dice",
          diceThreshold: 18,
          procChance: 15,
          customEffects: ["knockback"],
          knockbackConfig: {
            distance: 5,
          },
        },
        description:
          "The frenzied slash tears into your enemy with savage brutality, driven by pure rage. Devastating hits can ignite enemies with burning fury.",
        resolution: "DICE",
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 0,
      },

      tags: ["melee", "damage", "rage generation", "frenzied", "berserker"],

      rollableTable: {
        enabled: true,
        tableName: "Frenzy Mayhem",
        description: "Your frenzied slashes spiral into unpredictable violence — extra strikes, wild arcs, and self-destructive flurries.",
        diceFormula: "1d20",
        resolutionType: "DICE",
        resolutionConfig: { diceType: "d20" },
        entries: [
          { range: { min: 1, max: 1 }, customName: "Self-Mutilation", effect: "You slash yourself in the frenzy. Take 1d6 slashing damage." },
          { range: { min: 2, max: 3 }, customName: "Wild Miss", effect: "The slash goes wide. Half damage and you stumble, losing 5 ft of movement." },
          { range: { min: 4, max: 6 }, customName: "Glancing Blow", effect: "A shallow cut. Normal damage." },
          { range: { min: 7, max: 9 }, customName: "Double Slash", effect: "Your fury speeds your blade. Hit the target twice at half damage each." },
          { range: { min: 10, max: 12 }, customName: "Rending Tear", effect: "The slash tears deep. Deal +1d8 slashing and the target bleeds for 1d4/round for 2 rounds." },
          { range: { min: 13, max: 14 }, customName: "Whirlwind Slash", effect: "Spin and slash all enemies within 5 ft for full damage." },
          { range: { min: 15, max: 16 }, customName: "Savage Laceration", effect: "Carve a deep wound. +2d6 damage and target has disadvantage on next attack." },
          { range: { min: 17, max: 17 }, customName: "Blind Fury", effect: "Deal +3d6 damage but take 1d6 recoil damage. Gain +1d8 Rage." },
          { range: { min: 18, max: 18 }, customName: "Executioner's Arc", effect: "The slash finds the neck. Critical hit if target is below 25% HP." },
          { range: { min: 19, max: 19 }, customName: "Blood Frenzy", effect: "The strike drinks deep. Heal for half the damage dealt." },
          { range: { min: 20, max: 20 }, customName: "Frenzied Massacre", effect: "Unleash a devastating flurry. +4d6 damage, target is Stunned for 1 round, and you gain +2d6 Rage." },
        ],
      },
    },

    {
      id: "berserk_war_cry",
      name: "War Cry",
      description:
        "Unleash a thunderous war cry that creates visible shockwaves, battering nearby enemies with concussive force while igniting your allies' fighting spirit with primal fury.",
      level: 2,
      spellType: "ACTION",
      icon: "Utility/Overlords Command",

      typeConfig: {
        school: "bludgeoning",
        icon: "Utility/Overlords Command",
        tags: ["buff", "aoe", "support", "rage generation", "frenzied"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingMode: "effect",
      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "circle",
        aoeParameters: { radius: 30 },
        targetRestrictions: ["ally", "enemy"],
      },

      effectTargeting: {
        buff: {
          targetingType: "area",
          rangeType: "self_centered",
          aoeShape: "circle",
          aoeParameters: { radius: 30 },
          targetRestrictions: ["ally"],
        },
        damage: {
          targetingType: "area",
          rangeType: "self_centered",
          aoeShape: "circle",
          aoeParameters: { radius: 30 },
          targetRestrictions: ["enemy"],
        },
      },

      resourceCost: {
        resourceTypes: ["mana", "rage_state", "rage_cost"],
        resourceValues: { mana: 0, rage_state: "Frenzied", rage_cost: 10 },
        actionPoints: 1,
        components: ["verbal"],
        verbalText: "FOR GLORY AND FURY!",
      },

      resolution: "NONE",
      effectTypes: ["buff", "damage"],

      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          {
            id: "battle_fury",
            name: "Battle Fury",
            description: "Gain +2 to attack rolls",
            statModifier: {
              stat: "attack",
              magnitude: 2,
              magnitudeType: "flat",
            },
          },
          {
            id: "war_cry_morale",
            name: "War Morale",
            description: "Allies gain +1d4 bonus damage",
            damageFormula: "+1d4",
            statModifier: {
              stat: "damage",
              magnitude: "1d4",
              magnitudeType: "flat",
            },
          },
        ],
        durationValue: 2,
        durationType: "rounds",
        durationUnit: "rounds",
        concentrationRequired: false,
        canBeDispelled: false,
      },

      damageConfig: {
        formula: "1d4",
        damageTypes: ["bludgeoning"],

        description: "Concussive sonic force batters nearby enemies.",
        resolution: "DICE",
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },

      tags: [
        "buff",
        "aoe",
        "support",
        "rage generation",
        "frenzied",
        "berserker",
      ],

      rollableTable: {
        enabled: true,
        tableName: "War Cry Chaos",
        description: "Your battle cry reverberates with unpredictable primal fury, sometimes inspiring beyond reason, sometimes shattering eardrums indiscriminately.",
        diceFormula: "1d20",
        resolutionType: "DICE",
        resolutionConfig: { diceType: "d20" },
        entries: [
          { range: { min: 1, max: 1 }, customName: "Choked Scream", effect: "Your voice cracks. No buff applied. Take 1d4 psychic damage from embarrassment." },
          { range: { min: 2, max: 4 }, customName: "Weak Shout", effect: "A passable yell. Buff duration reduced to 1 round." },
          { range: { min: 5, max: 8 }, customName: "Rallying Cry", effect: "A solid war cry. Normal effects apply." },
          { range: { min: 9, max: 11 }, customName: "Deafening Blast", effect: "The sonic boom is overwhelming. Enemies within range are Deafened for 1 round in addition to normal effects." },
          { range: { min: 12, max: 13 }, customName: "Inspiring Roar", effect: "Allies gain +1d6 bonus damage instead of +1d4 for the duration." },
          { range: { min: 14, max: 15 }, customName: "Terrifying Bellow", effect: "Enemies within range must make a DC 14 Spirit save or become Frightened for 1 round." },
          { range: { min: 16, max: 16 }, customName: "Shattered Ground", effect: "The force cracks the earth. Difficult terrain in a 10 ft radius for 2 rounds." },
          { range: { min: 17, max: 17 }, customName: "Echoing Fury", effect: "The cry echoes. Buff duration extended to 3 rounds and enemies take an extra 1d4 damage." },
          { range: { min: 18, max: 18 }, customName: "Primal Surge", effect: "You and all allies gain +1d8 Rage (or equivalent resource). +2 to all attack rolls for duration." },
          { range: { min: 19, max: 19 }, customName: "Warcry of the Ancients", effect: "The cry channels ancestral fury. All allies gain +2d4 damage and are immune to Fear for 2 rounds." },
          { range: { min: 20, max: 20 }, customName: "Cataclysmic Howl", effect: "Reality trembles. Enemies take 2d8 bludgeoning damage and are knocked prone. Allies gain +3 attack for 2 rounds. You gain +2d8 Rage." },
        ],
      },
    },

    {
      id: "berserk_bloodthirst",
      name: "Bloodthirst",
      description:
        "Strike your foe with ravenous hunger, drinking deep of their life essence. The more damage you deal, the more you heal. Critical hits drain so fiercely that enemies are visibly weakened.",
      level: 2,
      spellType: "ACTION",
      icon: "Necrotic/Drain Soul",

      typeConfig: {
        school: "slashing",
        icon: "Necrotic/Drain Soul",
        tags: ["healing", "self sustain", "rage generation", "frenzied"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingMode: "effect",
      targetingConfig: {
        targetingType: "single",
        rangeType: "melee",
        rangeDistance: 5,
        targetRestrictions: ["enemy"],
      },

      effectTargeting: {
        damage: {
          targetingType: "single",
          rangeType: "melee",
          rangeDistance: 5,
          targetRestrictions: ["enemy"],
        },
        healing: {
          targetingType: "self",
        },
      },

      resourceCost: {
        resourceTypes: ["mana", "rage_state", "rage_cost"],
        resourceValues: { mana: 0, rage_state: "Frenzied", rage_cost: 5 },
        actionPoints: 1,
        components: ["somatic"],
        somaticText:
          "Strike with dark energy, draining life force as red mist flows into you",
      },

      resolution: "DICE",
      effectTypes: ["damage", "healing"],

      damageConfig: {
        formula: "1d6 + strength",
        damageTypes: ["slashing"],

        canCrit: true,
        critMultiplier: 2,
        critDiceOnly: false,
        criticalConfig: {
          enabled: true,
          critType: "dice",
          critMultiplier: 2,
          critEffects: ["life_drain"],
          lifeDrainConfig: {
            percentage: 50,
          },
        },
        chanceOnHitConfig: {
          enabled: true,
          procType: "dice",
          diceThreshold: 16,
          procChance: 25,
          customEffects: ["bleeding"],
          bleedingConfig: {
            damagePerRound: "1d4",
            duration: 2,
            durationUnit: "rounds",
            saveDC: 14,
            saveType: "constitution",
          },
        },
        description:
          "Tears into your enemy with savage force, opening wounds that bleed freely while siphoning their vitality into yourself.",
        resolution: "DICE",
      },

      healingConfig: {
        formula: "damageDealt / 2",
        healingType: "direct",
        resolution: "DICE",
        description:
          "Stolen life force flows through you, closing wounds and restoring strength.",
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 0,
      },

      tags: [
        "melee",
        "damage",
        "healing",
        "self sustain",
        "rage generation",
        "frenzied",
        "berserker",
      ],

      rollableTable: {
        enabled: true,
        tableName: "Bloodthirst Hunger",
        description: "Your ravenous strike feeds on life essence in unpredictable ways — sometimes the hunger spirals beyond your control.",
        diceFormula: "1d20",
        resolutionType: "DICE",
        resolutionConfig: { diceType: "d20" },
        entries: [
          { range: { min: 1, max: 1 }, customName: "Blood Rejection", effect: "The stolen vitality curdles. Take 1d6 necrotic damage instead of healing." },
          { range: { min: 2, max: 4 }, customName: "Thin Blood", effect: "Only a trickle of life force. Heal for only 25% of damage dealt instead of half." },
          { range: { min: 5, max: 8 }, customName: "Steady Drain", effect: "The hunger is sated. Normal lifesteal effect applies." },
          { range: { min: 9, max: 11 }, customName: "Deep Thirst", effect: "You drink deep. Heal for 75% of damage dealt instead of half." },
          { range: { min: 12, max: 13 }, customName: "Bleeding Bite", effect: "The wound gushes. Target takes 1d4 bleeding damage per round for 2 rounds. Normal healing." },
          { range: { min: 14, max: 15 }, customName: "Vampiric Surge", effect: "The life force invigorates you. Heal full damage dealt and gain +5 ft movement for 1 round." },
          { range: { min: 16, max: 16 }, customName: "Blood Frenzy", effect: "The taste sends you into a frenzy. Heal full damage and gain +1d6 Rage. Next attack has advantage." },
          { range: { min: 17, max: 17 }, customName: "Hemorrhaging Strike", effect: "You tear free a chunk. +2d6 damage and target bleeds for 1d6/round for 3 rounds." },
          { range: { min: 18, max: 18 }, customName: "Crimson Shield", effect: "Excess life force forms a barrier. Gain a shield equal to half the damage dealt, lasting 2 rounds." },
          { range: { min: 19, max: 19 }, customName: "Soul Drink", effect: "You drain something deeper. Heal for full damage dealt. Target has disadvantage on all rolls for 1 round." },
          { range: { min: 20, max: 20 }, customName: "Blood God's Feast", effect: "The hunger transcends mortality. Heal for DOUBLE damage dealt. Gain +2d8 Rage. All nearby enemies are Frightened for 1 round." },
        ],
      },
    },

    {
      id: "berserk_adrenaline_rush",
      name: "Adrenaline Rush",
      description:
        "Flood your body with adrenaline, gaining an extra action point immediately.",
      level: 2,
      spellType: "ACTION",
      icon: "Utility/Speed Boot",

      typeConfig: {
        school: "bludgeoning",
        icon: "Utility/Speed Boot",
        tags: ["buff", "speed", "rage management", "frenzied"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },

      resourceCost: {
        resourceTypes: ["mana", "rage_state", "rage_cost"],
        resourceValues: { mana: 0, rage_state: "Frenzied", rage_cost: 10 },
        actionPoints: 0,
        components: ["somatic"],
        somaticText: "Inject yourself with adrenaline",
      },

      resolution: "NONE",
      effectTypes: ["buff"],

      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          {
            id: "adrenaline_speed",
            name: "Adrenaline Rush",
            description: "Gain 1 extra action point immediately",
            statModifier: {
              stat: "actionPoints",
              magnitude: 1,
              magnitudeType: "flat",
            },
          },
        ],
        durationValue: 0,
        durationType: "instant",
        durationUnit: "instant",
        concentrationRequired: false,
        canBeDispelled: false,
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },

      tags: ["buff", "speed", "rage management", "frenzied", "berserker"],
    },

    {
      id: "berserk_counter_rage",
      name: "Counter-Rage",
      description:
        "When an enemy hits you, your fury erupts into an immediate retaliatory strike. Pain is fuel — every blow against you is answered.",
      level: 2,
      spellType: "REACTION",
      icon: "General/Combat Downward Strike",

      typeConfig: {
        school: "bludgeoning",
        icon: "General/Combat Downward Strike",
        tags: ["reaction", "melee", "damage", "rage generation", "frenzied"],
        castTime: 0,
        castTimeType: "REACTION",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "melee",
        rangeDistance: 5,
        targetRestrictions: ["enemy"],
      },

      triggerConfig: {
        triggerType: "when_hit",
        triggerCondition: "When an enemy melee attack hits you",
        triggerDescription:
          "Immediately make a melee counter-attack against the attacker",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 0 },
        actionPoints: 0,
        components: ["somatic"],
        somaticText: "Strike back with furious reflexes",
      },

      resolution: "DICE",
      effectTypes: ["damage"],

      rageGain: "1d4",

      damageConfig: {
        formula: "1d6 + strength",
        damageTypes: ["bludgeoning"],
        description:
          "A reflexive counter-strike fueled by fury. Generates Rage from the hit you just took AND the counter-attack.",
        resolution: "DICE",
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },

      tags: [
        "reaction",
        "melee",
        "damage",
        "rage generation",
        "frenzied",
        "berserker",
      ],
    },

    // ========================================
    // LEVEL 3 SPELLS - Advanced Abilities
    // ========================================

    {
      id: "berserk_primal_roar",
      name: "Primal Roar",
      description:
        "Unleash a deafening roar that sends a shockwave of concussive force through enemies, sending them fleeing in terror. Constitution save halves damage and negates fear.",
      level: 3,
      spellType: "ACTION",
      icon: "Utility/Overlords Command",

      typeConfig: {
        school: "bludgeoning",
        icon: "Utility/Overlords Command",
        tags: ["aoe", "damage", "control", "primal"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "circle",
        aoeParameters: { radius: 10 },
        targetRestrictions: ["enemy"],
      },

      resourceCost: {
        resourceTypes: ["mana", "rage_state", "rage_cost"],
        resourceValues: { mana: 0, rage_state: "Primal", rage_cost: 15 },
        actionPoints: 1,
        components: ["verbal"],
        verbalText: "RAAAAGH!",
      },

      resolution: "SAVE",
      effectTypes: ["damage", "control"],

      damageConfig: {
        formula: "2d6 + strength",
        damageTypes: ["bludgeoning"],

        savingThrowConfig: {
          enabled: true,
          savingThrowType: "constitution",
          difficultyClass: 14,
          saveOutcome: "half_damage",
        },
        resolution: "DICE",
      },

      controlConfig: {
        controlType: "mind_control",
        effects: [
          {
            id: "fear",
            name: "Primal Terror",
            description: "Enemies flee in blind panic",
            config: {
              fearStrength: "moderate",
              saveType: "constitution",
              saveDC: 14,
              duration: 2,
              durationUnit: "rounds",
            },
          },
        ],
        duration: 2,
        durationUnit: "rounds",
        saveDC: 14,
        saveType: "constitution",
        saveOutcome: "negates",
        savingThrow: true,
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },

      tags: ["aoe", "damage", "control", "primal", "berserker"],

      rollableTable: {
        enabled: true,
        tableName: "Primal Roar Effects",
        description: "Your roar carries the weight of ancient predators — the effect depends on which primal spirit answers your call.",
        diceFormula: "1d20",
        resolutionType: "DICE",
        resolutionConfig: { diceType: "d20" },
        entries: [
          { range: { min: 1, max: 1 }, customName: "Choked Silence", effect: "Your voice fails. Take 1d4 psychic damage. No effect on enemies." },
          { range: { min: 2, max: 3 }, customName: "Feeble Growl", effect: "A weak roar. Enemies take half damage and are not frightened." },
          { range: { min: 4, max: 6 }, customName: "Primal Bellow", effect: "A solid roar. Normal effects apply." },
          { range: { min: 7, max: 9 }, customName: "Thunderous Roar", effect: "The roar cracks stone. Full damage and enemies are deafened for 1 round in addition to being frightened." },
          { range: { min: 10, max: 11 }, customName: "Wolf's Howl", effect: "The call of the pack. You and allies within 30 ft gain +2 to attack rolls for 1 round." },
          { range: { min: 12, max: 13 }, customName: "Bear's Fury", effect: "The roar shakes the earth. Enemies are knocked prone. Damage becomes 3d6 + strength." },
          { range: { min: 14, max: 15 }, customName: "Dragon's Bellow", effect: "Primal fire spills from your throat. Add 1d8 fire damage to the roar effect." },
          { range: { min: 16, max: 16 }, customName: "Terrifying Visage", effect: "Your face twists into something inhuman. Enemies flee at double speed away from you for 2 rounds." },
          { range: { min: 17, max: 17 }, customName: "Shatter Will", effect: "The roar breaks minds. One target is Stunned for 1 round instead of frightened (DC 14 Con save)." },
          { range: { min: 18, max: 18 }, customName: "Primal Awakening", effect: "The roar awakens something ancient. All allies within 30 ft gain 1d8 temporary HP. You gain +1d6 Rage." },
          { range: { min: 19, max: 19 }, customName: "Beastlord's Command", effect: "The roar dominates lesser creatures. All affected enemies are Charmed for 1 round and frightened for 2 rounds." },
          { range: { min: 20, max: 20 }, customName: "Apex Predator", effect: "You become the apex. Enemies take 4d6 + strength damage, are Frightened for 3 rounds, and you enter the next Rage State immediately." },
        ],
      },
    },

    {
      id: "berserk_bloodlust",
      name: "Bloodlust",
      description:
        "Channel primal fury into escalating regeneration. Heal instantly, then gain progressively stronger healing over the next 3 rounds.",
      level: 3,
      spellType: "ACTION",
      icon: "Necrotic/Drain Soul",

      typeConfig: {
        school: "bludgeoning",
        icon: "Necrotic/Drain Soul",
        tags: ["healing", "hot", "self sustain", "primal"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },

      resourceCost: {
        resourceTypes: ["mana", "rage_state", "rage_cost"],
        resourceValues: { mana: 0, rage_state: "Primal", rage_cost: 12 },
        actionPoints: 1,
        components: ["somatic"],
        somaticText: "Embrace the fury within",
      },

      resolution: "NONE",
      effectTypes: ["healing"],

      healingConfig: {
        formula: "1d8 + constitution",
        healingType: "direct",
        resolution: "DICE",
        hasHotEffect: true,
        hotFormula: "1d4 + constitution/2",
        hotDuration: 3,
        hotTickType: "round",
        isProgressiveHot: true,
        progressiveStages: [
          {
            round: 1,
            formula: "1d4 + constitution/2",
            description: "Initial primal regeneration",
          },
          {
            round: 2,
            formula: "1d6 + constitution/2",
            description: "Building regenerative fury",
          },
          {
            round: 3,
            formula: "1d8 + constitution/2",
            description: "Peak primal healing",
          },
        ],
        description:
          "Primal regeneration fueled by the blood of ancient hunters, growing stronger over time",
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },

      tags: ["healing", "hot", "self sustain", "primal", "berserker"],
    },

    {
      id: "berserk_savage_leap",
      name: "Savage Leap",
      description:
        "Leap through the air with primal fury, crashing down on enemies in a devastating impact that stuns those caught in the blast.",
      level: 3,
      spellType: "ACTION",
      icon: "Utility/Upward Jump",

      typeConfig: {
        school: "bludgeoning",
        icon: "Utility/Upward Jump",
        tags: ["movement", "damage", "aoe", "primal"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 20,
        aoeShape: "circle",
        aoeParameters: { radius: 5 },
        targetRestrictions: ["enemy"],
      },

      resourceCost: {
        resourceTypes: ["mana", "rage_state", "rage_cost"],
        resourceValues: { mana: 0, rage_state: "Primal", rage_cost: 15 },
        actionPoints: 1,
        components: ["somatic"],
        somaticText: "Leap with primal force",
      },

      resolution: "SAVE",
      effectTypes: ["damage", "control"],

      damageConfig: {
        formula: "2d8 + strength",
        damageTypes: ["bludgeoning"],

        savingThrowConfig: {
          enabled: true,
          savingThrowType: "constitution",
          difficultyClass: 15,
          saveOutcome: "half_damage",
        },
        resolution: "DICE",
      },

      controlConfig: {
        controlType: "incapacitation",
        effects: [
          {
            id: "stun",
            name: "Impact Stun",
            description: "Enemies are stunned by the devastating impact",
            config: {
              saveType: "constitution",
              saveDC: 15,
              duration: 1,
              durationUnit: "rounds",
            },
          },
        ],
        duration: 1,
        durationUnit: "rounds",
        saveDC: 15,
        saveType: "constitution",
        saveOutcome: "negates",
        savingThrow: true,
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },

      tags: ["movement", "damage", "aoe", "control", "primal", "berserker"],

      rollableTable: {
        enabled: true,
        tableName: "Impact Chaos",
        description: "Your leap sends shockwaves through the earth. What happens when you land depends on how the ground receives you.",
        diceFormula: "1d20",
        resolutionType: "DICE",
        resolutionConfig: { diceType: "d20" },
        entries: [
          { range: { min: 1, max: 1 }, customName: "Face Plant", effect: "You miscalculate the landing. Take 1d8 self damage and are knocked prone. Enemies take half damage." },
          { range: { min: 2, max: 4 }, customName: "Heavy Landing", effect: "The impact shakes the ground. Normal effects." },
          { range: { min: 5, max: 7 }, customName: "Crater Impact", effect: "Your landing creates a small crater. Enemies within 10 ft are knocked prone. +1d6 damage." },
          { range: { min: 8, max: 9 }, customName: "Shockwave Bounce", effect: "The impact bounces you back up. You can leap again to a second location within 15 ft as a free action." },
          { range: { min: 10, max: 11 }, customName: "Ground Splitter", effect: "The landing cracks the earth in a line. All enemies in a 15 ft line from the landing point take damage and are knocked prone." },
          { range: { min: 12, max: 12 }, customName: "Primal Tremor", effect: "Aftershocks ripple outward. Enemies in the area take 1d6 additional damage at the start of next round." },
          { range: { min: 13, max: 14 }, customName: "Predator Pounce", effect: "You land on the primary target like a beast. Target is pinned (Restrained) for 1 round. DC 15 Str to break free." },
          { range: { min: 15, max: 15 }, customName: "Rage Impact", effect: "The landing fuels your fury. Gain +1d8 Rage. +2d6 bonus damage to all affected." },
          { range: { min: 16, max: 16 }, customName: "Meteor Strike", effect: "You descend like a meteor. Primary target takes double damage. All others take normal. Area ignites (1d4 fire/round for 1 round)." },
          { range: { min: 17, max: 17 }, customName: "Berserker Bounce", effect: "The impact sends you caroming. After landing, bounce to one more enemy within 15 ft and deal damage again." },
          { range: { min: 18, max: 18 }, customName: "Earth Shatter", effect: "The landing shatters stone. Area becomes difficult terrain for 3 rounds. +3d6 damage to all." },
          { range: { min: 19, max: 19 }, customName: "Apex Predator Drop", effect: "The perfect kill strike. +4d6 damage. If target is below 40% HP, they are executed. Gain +2d6 Rage." },
          { range: { min: 20, max: 20 }, customName: "Extinction Impact", effect: "The ground itself surrenders. All creatures in 15 ft take 6d8 damage. The terrain is permanently cratered. All enemies are Stunned for 1 round. Gain +3d6 Rage." },
        ],
      },
    },

    {
      id: "berserk_berserk_charge",
      name: "Berserk Charge",
      description:
        "Charge forward with unstoppable momentum, plowing through enemies and knocking them aside with overwhelming force.",
      level: 3,
      spellType: "ACTION",
      icon: "Utility/Dash",

      typeConfig: {
        school: "bludgeoning",
        icon: "Utility/Dash",
        tags: ["movement", "damage", "control", "primal"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "line",
        rangeType: "ranged",
        rangeDistance: 30,
        aoeShape: "line",
        aoeParameters: { length: 30, width: 5 },
        targetRestrictions: ["enemy"],
      },

      resourceCost: {
        resourceTypes: ["mana", "rage_state", "rage_cost"],
        resourceValues: { mana: 0, rage_state: "Primal", rage_cost: 12 },
        actionPoints: 1,
        components: ["somatic"],
        somaticText: "Charge with berserk momentum",
      },

      resolution: "SAVE",
      effectTypes: ["damage", "control"],

      damageConfig: {
        formula: "2d6 + strength",
        damageTypes: ["bludgeoning"],

        savingThrowConfig: {
          enabled: true,
          savingThrowType: "strength",
          difficultyClass: 14,
          saveOutcome: "half_damage",
        },
        resolution: "DICE",
      },

      controlConfig: {
        controlType: "forcedMovement",
        effects: [
          {
            id: "push",
            name: "Charge Impact",
            description: "Enemies are pushed back by the unstoppable charge",
            config: {
              movementType: "push",
              distance: 10,
              saveType: "strength",
              saveDC: 14,
            },
          },
        ],
        duration: 0,
        durationUnit: "instant",
        saveDC: 14,
        saveType: "strength",
        saveOutcome: "negates",
        savingThrow: true,
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },

      tags: ["movement", "damage", "control", "primal", "berserker"],
    },

    // ========================================
    // LEVEL 4 SPELLS - Elite Abilities
    // ========================================

    {
      id: "berserk_fury_slam",
      name: "Fury Slam",
      description:
        "A brutal ground-shaking slam that damages and slows all enemies in front of you. Quick, efficient, and devastating.",
      level: 4,
      spellType: "ACTION",
      icon: "Bludgeoning/Mortal Strike",

      typeConfig: {
        school: "bludgeoning",
        icon: "Bludgeoning/Mortal Strike",
        tags: ["melee", "damage", "aoe", "carnage"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "cone",
        rangeType: "self",
        aoeShape: "cone",
        aoeParameters: { length: 15, width: 10 },
        targetRestrictions: ["enemy"],
      },

      resourceCost: {
        resourceTypes: ["mana", "rage_state", "rage_cost"],
        resourceValues: { mana: 0, rage_state: "Carnage", rage_cost: 10 },
        actionPoints: 1,
        components: ["somatic"],
        somaticText: "Slam the ground with fury",
      },

      resolution: "SAVE",
      effectTypes: ["damage", "control"],

      damageConfig: {
        formula: "2d8 + strength",
        damageTypes: ["bludgeoning"],
        savingThrowConfig: {
          enabled: true,
          savingThrowType: "strength",
          difficultyClass: 15,
          saveOutcome: "half_damage",
        },
        resolution: "DICE",
      },

      controlConfig: {
        controlType: "battlefield_control",
        effects: [
          {
            id: "slow",
            name: "Grounded",
            description: "Enemies are slowed by the shockwave",
            config: {
              movementSpeed: "half",
              saveType: "strength",
              saveDC: 15,
              duration: 1,
              durationUnit: "rounds",
            },
          },
        ],
        duration: 1,
        durationUnit: "rounds",
        saveDC: 15,
        saveType: "strength",
        saveOutcome: "negates",
        savingThrow: true,
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 0,
      },

      tags: ["melee", "damage", "aoe", "control", "carnage", "berserker"],
    },

    {
      id: "berserk_carnage_strike",
      name: "Carnage Strike",
      description:
        "A devastating strike that can send enemies flying, stun them, and leave them bleeding on devastating hits. Powerful hits may also inflict fear.",
      level: 4,
      spellType: "ACTION",
      icon: "Slashing/Sword Strike",

      typeConfig: {
        school: "bludgeoning",
        icon: "Slashing/Sword Strike",
        tags: ["melee", "damage", "carnage"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "melee",
        rangeDistance: 5,
        targetRestrictions: ["enemy"],
      },

      resourceCost: {
        resourceTypes: ["mana", "rage_state", "rage_cost"],
        resourceValues: { mana: 0, rage_state: "Carnage", rage_cost: 20 },
        actionPoints: 2,
        components: ["somatic"],
        somaticText: "Strike with overwhelming carnage",
      },

      resolution: "DICE",
      effectTypes: ["damage"],

      damageConfig: {
        formula: "2d8 + strength + 2d6",
        damageTypes: ["bludgeoning"],

        canCrit: true,
        critMultiplier: 2,
        critDiceOnly: false,
        criticalConfig: {
          enabled: true,
          critType: "dice",
          critMultiplier: 3,
          critEffects: ["knockback", "stun", "bleeding"],
          extraDice: "1d8",
          knockbackConfig: {
            distance: 10,
          },
          stunConfig: {
            duration: 1,
            durationUnit: "round",
            saveDC: 15,
            saveType: "constitution",
          },
          bleedingConfig: {
            damagePerRound: "1d4",
            duration: 2,
            durationUnit: "rounds",
            saveDC: 14,
            saveType: "constitution",
          },
        },
        chanceOnHitConfig: {
          enabled: true,
          procType: "dice",
          diceThreshold: 17,
          procChance: 20,
          customEffects: ["fear"],
          fearConfig: {
            duration: 2,
            durationUnit: "rounds",
            saveDC: 15,
            saveType: "spirit",
          },
        },
        resolution: "DICE",
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },

      tags: ["melee", "damage", "carnage", "berserker"],

      rollableTable: {
        enabled: true,
        tableName: "Carnage Chaos",
        description: "Your devastating strike spirals into unpredictable brutality — sometimes empowering, sometimes backfiring with catastrophic force.",
        diceFormula: "1d20",
        resolutionType: "DICE",
        resolutionConfig: { diceType: "d20" },
        entries: [
          { range: { min: 1, max: 1 }, customName: "Catastrophic Miss", effect: "You overextend catastrophically. Take 2d6 self damage and are Stunned for 1 round." },
          { range: { min: 2, max: 3 }, customName: "Glancing Blow", effect: "The strike clips the target. Half damage, no critical effects possible." },
          { range: { min: 4, max: 7 }, customName: "Brutal Hit", effect: "A savage strike. Normal damage and effects." },
          { range: { min: 8, max: 10 }, customName: "Rending Strike", effect: "The blow tears through armor. +1d8 damage and target has -2 AC for 1 round." },
          { range: { min: 11, max: 12 }, customName: "Carnage Explosion", effect: "Impact creates a shockwave. All enemies within 10 ft take 1d8 bludgeoning damage." },
          { range: { min: 13, max: 14 }, customName: "Devastating Cleave", effect: "The strike cleaves through. Hit a second adjacent enemy for half damage." },
          { range: { min: 15, max: 15 }, customName: "Gore-Spatter", effect: "The wound sprays arterial blood. All adjacent enemies take 1d4 damage and are Disgusted for 1 round." },
          { range: { min: 16, max: 16 }, customName: "Skull Cracker", effect: "The blow connects with the skull. Target is Stunned for 1 round regardless of save. +2d6 damage." },
          { range: { min: 17, max: 17 }, customName: "Carnage Feedback", effect: "The violence feeds back into you. Deal +3d6 damage but take 1d8 self damage. Gain +1d8 Rage." },
          { range: { min: 18, max: 18 }, customName: "Executioner's Strike", effect: "If target is below 30% HP, they are executed outright. Otherwise +4d6 damage." },
          { range: { min: 19, max: 19 }, customName: "Savage Rampage", effect: "The strike triggers a rampage. Make two additional attacks against the same target at full damage." },
          { range: { min: 20, max: 20 }, customName: "Carnage Incarnate", effect: "The strike transcends mortality. +5d8 damage, target is Stunned for 2 rounds, all nearby enemies are Frightened, and you gain +3d6 Rage." },
        ],
      },
    },

    {
      id: "berserk_raging_defense",
      name: "Raging Defense",
      description:
        "Your fury becomes a shield. Gain resistance to all damage and regenerate Rage when attacked.",
      level: 4,
      spellType: "ACTION",
      icon: "Utility/Shield",

      typeConfig: {
        school: "bludgeoning",
        icon: "Utility/Shield",
        tags: ["defense", "resistance", "buff", "carnage"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },

      resourceCost: {
        resourceTypes: ["mana", "rage_state", "rage_cost"],
        resourceValues: { mana: 0, rage_state: "Carnage", rage_cost: 15 },
        actionPoints: 2,
        components: ["somatic"],
        somaticText: "Brace against all harm",
      },

      resolution: "NONE",
      effectTypes: ["buff"],

      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          {
            id: "all_resistances",
            name: "All Resistances",
            description:
              "Gain resistance to all damage types (50% damage reduction)",
            statModifier: {
              stat: "all_resistances",
              magnitude: 50,
              magnitudeType: "percentage",
              category: "resistance",
              resistanceType: "general",
            },
          },
          {
            id: "rage_regeneration",
            name: "Rage Fuel",
            description: "Attacks against you generate +3 Rage instead of +1",
            statModifier: {
              stat: "rageGeneration",
              magnitude: 2,
              magnitudeType: "flat",
            },
          },
        ],
        durationValue: 2,
        durationType: "rounds",
        durationUnit: "rounds",
        concentrationRequired: false,
        canBeDispelled: false,
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },

      tags: ["defense", "resistance", "buff", "carnage", "berserker"],
    },

    {
      id: "berserk_intimidating_presence",
      name: "Intimidating Presence",
      description:
        "Radiate a terrifying aura that causes enemies within 20 feet to flee in panic.",
      level: 4,
      spellType: "ACTION",
      icon: "Necrotic/Screaming Skull",

      typeConfig: {
        school: "bludgeoning",
        icon: "Necrotic/Screaming Skull",
        tags: ["control", "aoe", "fear", "carnage"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "circle",
        aoeParameters: { radius: 20 },
        targetRestrictions: ["enemy"],
      },

      resourceCost: {
        resourceTypes: ["mana", "rage_state", "rage_cost"],
        resourceValues: { mana: 0, rage_state: "Carnage", rage_cost: 18 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "FEAR ME!",
        somaticText: "Radiate terrifying aura",
      },

      resolution: "SAVE",
      effectTypes: ["control"],

      controlConfig: {
        controlType: "mind_control",
        effects: [
          {
            id: "fear",
            name: "Frightened",
            description: "Enemies are overcome with terror",
            config: {
              fearStrength: "moderate",
              saveType: "charisma",
              saveDC: 16,
              duration: 2,
              durationUnit: "rounds",
            },
          },
        ],
        duration: 2,
        durationUnit: "rounds",
        saveDC: 16,
        saveType: "charisma",
        saveOutcome: "negates",
        savingThrow: true,
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },

      tags: ["control", "aoe", "fear", "carnage", "berserker"],
    },

    {
      id: "berserk_battle_trance",
      name: "Battle Trance",
      description:
        "Enter a trance of perfect combat awareness, gaining +3 dodge for 2 rounds.",
      level: 4,
      spellType: "ACTION",
      icon: "General/Rage",

      typeConfig: {
        school: "bludgeoning",
        icon: "General/Rage",
        tags: ["buff", "dodge", "carnage"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },

      resourceCost: {
        resourceTypes: ["mana", "rage_state", "rage_cost"],
        resourceValues: { mana: 0, rage_state: "Carnage", rage_cost: 15 },
        actionPoints: 2,
        components: ["somatic"],
        somaticText: "Enter battle trance",
      },

      resolution: "NONE",
      effectTypes: ["buff"],

      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          {
            id: "battle_trance_dodge",
            name: "Battle Trance",
            description:
              "Gain +3 dodge bonus. Your heightened reflexes and perfect combat awareness allow you to anticipate and evade incoming attacks",
            statModifier: {
              stat: "dodge",
              magnitude: 3,
              magnitudeType: "flat",
            },
          },
        ],
        durationValue: 2,
        durationType: "rounds",
        durationUnit: "rounds",
        concentrationRequired: false,
        canBeDispelled: false,
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 4 },

      tags: ["buff", "dodge", "carnage", "berserker"],
    },

    // ========================================
    // LEVEL 5 SPELLS - Legendary Abilities
    // ========================================

    {
      id: "berserk_cataclysmic_blow",
      name: "Cataclysmic Blow",
      description:
        "Channel devastating force into a single blow. Can stun, knock back, and disarm on devastating hits.",
      level: 5,
      spellType: "ACTION",
      icon: "Bludgeoning/Mortal Strike",

      typeConfig: {
        school: "bludgeoning",
        icon: "Bludgeoning/Mortal Strike",
        tags: ["melee", "damage", "control", "cataclysm"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "melee",
        rangeDistance: 5,
        targetRestrictions: ["enemy"],
      },

      resourceCost: {
        resourceTypes: ["mana", "rage_state", "rage_cost"],
        resourceValues: { mana: 0, rage_state: "Cataclysm", rage_cost: 30 },
        actionPoints: 2,
        components: ["somatic"],
        somaticText: "Channel all fury into one devastating blow",
      },

      resolution: "DICE",
      effectTypes: ["damage", "control"],

      damageConfig: {
        formula: "3d8 + strength + 2d6",
        damageTypes: ["bludgeoning"],

        criticalConfig: {
          enabled: true,
          critType: "dice",
          critMultiplier: 3,
          critEffects: ["stun", "knockback", "disarm"],
          explodingDice: true,
          explodingDiceType: "reroll_add",
          stunConfig: {
            duration: 1,
            durationUnit: "round",
            saveDC: 17,
            saveType: "constitution",
          },
          knockbackConfig: {
            distance: 15,
          },
          disarmConfig: {
            saveDC: 17,
            saveType: "strength",
          },
        },
        resolution: "DICE",
      },

      controlConfig: {
        controlType: "incapacitation",
        effects: [
          {
            id: "stun",
            name: "Cataclysmic Impact",
            description: "Target is stunned by the devastating blow",
            config: {
              durationType: "rounds",
              recoveryMethod: "automatic",
              saveType: "constitution",
              saveDC: 17,
              duration: 2,
              durationUnit: "rounds",
            },
          },
        ],
        duration: 2,
        durationUnit: "rounds",
        saveDC: 17,
        saveType: "constitution",
        savingThrow: true,
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },

      tags: ["melee", "damage", "control", "cataclysm", "berserker"],

      rollableTable: {
        enabled: true,
        tableName: "Cataclysmic Mayhem",
        description: "The sheer force of your cataclysmic blow warps reality around the impact. Chaos reigns in the aftermath.",
        diceFormula: "1d20",
        resolutionType: "DICE",
        resolutionConfig: { diceType: "d20" },
        entries: [
          { range: { min: 1, max: 1 }, customName: "Catastrophic Backfire", effect: "The fury destroys you. Take 3d8 self damage. Target takes half damage. You are Stunned for 1 round." },
          { range: { min: 2, max: 3 }, customName: "Earth Shudders", effect: "The ground cracks beneath you. Difficult terrain in 15 ft radius for 2 rounds. Normal damage." },
          { range: { min: 4, max: 6 }, customName: "Devastating Impact", effect: "The blow lands with cataclysmic force. Normal effects apply." },
          { range: { min: 7, max: 9 }, customName: "Shockwave", effect: "The impact creates a shockwave. All enemies within 15 ft take 2d6 bludgeoning and are knocked prone." },
          { range: { min: 10, max: 11 }, customName: "Aftershock", effect: "The ground continues to crack. Target takes an additional 2d8 damage at the start of next round." },
          { range: { min: 12, max: 13 }, customName: "Rift in the Earth", effect: "A chasm opens. Target must make DC 16 Dex save or fall 10 ft into a pit, becoming Restrained." },
          { range: { min: 14, max: 14 }, customName: "Primal Eruption", effect: "Cataclysmic energy erupts. Add 3d8 fire damage to the strike. Target catches fire (1d6/round for 2 rounds)." },
          { range: { min: 15, max: 15 }, customName: "Titan's Crush", effect: "The blow compresses reality. Target is Crushed — Restrained and takes 1d8/round for 2 rounds. DC 17 Str to break free." },
          { range: { min: 16, max: 16 }, customName: "Cataclysm Bleed", effect: "The wound is catastrophic. Target bleeds for 2d6/round for 3 rounds. No save." },
          { range: { min: 17, max: 17 }, customName: "Reality Fracture", effect: "The blow tears reality. Target takes +4d8 force damage and is Stunned for 1 round. You take 2d6 psychic damage." },
          { range: { min: 18, max: 18 }, customName: "Obliteration Precursor", effect: "A taste of Obliteration. Deal +5d6 damage. If this kills the target, gain +3d8 Rage immediately." },
          { range: { min: 19, max: 19 }, customName: "Cataclysm Cascade", effect: "The impact chains. Up to 3 additional targets within 20 ft take 3d8 bludgeoning each. Primary target takes double damage." },
          { range: { min: 20, max: 20 }, customName: "End of All Things", effect: "The blow ends civilizations. +8d8 damage. Target is Annihilated if below 50% HP (no save). All creatures within 30 ft take 4d6 and are Stunned for 1 round. You gain +4d6 Rage. The ground becomes permanently cracked." },
        ],
      },
    },

    {
      id: "berserk_unstoppable_force",
      name: "Unstoppable Force",
      description:
        "Your rage makes you immune to all conditions and forced movement for one round.",
      level: 5,
      spellType: "ACTION",
      icon: "General/Fiery Rage",

      typeConfig: {
        school: "bludgeoning",
        icon: "General/Fiery Rage",
        tags: ["buff", "immunity", "cataclysm"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },

      resourceCost: {
        resourceTypes: ["mana", "rage_state", "rage_cost"],
        resourceValues: { mana: 0, rage_state: "Cataclysm", rage_cost: 20 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "NOTHING STOPS ME!",
        somaticText: "Surge forward with unstoppable momentum",
      },

      resolution: "NONE",
      effectTypes: ["buff"],

      buffConfig: {
        buffType: "statusEffect",
        effects: [
          {
            id: "condition_immunity",
            name: "Unstoppable Force",
            description:
              "Immune to all conditions and forced movement for 1 round",
            statusType: "immunity",
            level: "major",
            mechanicsText:
              "Immune to all crowd control conditions and forced movement for 1 round",
          },
        ],
        durationValue: 1,
        durationType: "rounds",
        durationUnit: "rounds",
        concentrationRequired: false,
        canBeDispelled: false,
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },

      tags: ["buff", "immunity", "cataclysm", "berserker"],

      rollableTable: {
        enabled: true,
        tableName: "Unstoppable Chaos",
        description: "When nothing can stop you, nothing CAN stop you — including your own good judgment. The effects of your unstoppable surge are unpredictable.",
        diceFormula: "1d20",
        resolutionType: "DICE",
        resolutionConfig: { diceType: "d20" },
        entries: [
          { range: { min: 1, max: 1 }, customName: "Juggernaut Reversal", effect: "The momentum works against you. Immunity lasts only until your next turn starts. You are Disoriented (disadvantage on next attack)." },
          { range: { min: 2, max: 4 }, customName: "Iron Will", effect: "Standard unstoppable effect. Immune to conditions and forced movement for 1 round." },
          { range: { min: 5, max: 7 }, customName: "Battering Ram", effect: "Your momentum carries through enemies. You can move through enemy spaces, dealing 1d6 damage to each you pass through." },
          { range: { min: 8, max: 9 }, customName: "Condition Purge", effect: "The surge purges all existing conditions from you in addition to granting immunity." },
          { range: { min: 10, max: 11 }, customName: "Tunnel Vision", effect: "Immunity to conditions, but you MUST move toward and attack the nearest enemy. Cannot retreat." },
          { range: { min: 12, max: 12 }, customName: "Seismic Charge", effect: "Your movement cracks the earth. Path becomes difficult terrain. Enemies adjacent to your path take 1d8 damage." },
          { range: { min: 13, max: 13 }, customName: "Rage Amplifier", effect: "The unstoppable fury builds rage. Gain +1d6 Rage per enemy you pass through this turn." },
          { range: { min: 14, max: 14 }, customName: "Untouchable", effect: "Immunity extended to include damage resistance (25%) for the round." },
          { range: { min: 15, max: 15 }, customName: "Wrecking Ball", effect: "You can charge through objects and walls. All destroyed barriers deal 1d8 debris damage to adjacent enemies." },
          { range: { min: 16, max: 16 }, customName: "Fear the Unstoppable", effect: "Enemies within 15 ft become Frightened for 1 round at the sight of your relentless advance." },
          { range: { min: 17, max: 17 }, customName: "Endurance Surge", effect: "The surge sustains you. Heal 2d8 HP. Immunity duration extended to 2 rounds." },
          { range: { min: 18, max: 18 }, customName: "Relentless Pursuit", effect: "If your attack drops the target, you can immediately move 15 ft toward another enemy and attack again (free action)." },
          { range: { min: 19, max: 19 }, customName: "Juggernaut", effect: "True unstoppable force. Immune to ALL effects for 2 rounds. Your movement is doubled. Every creature you pass through is knocked prone." },
          { range: { min: 20, max: 20 }, customName: "Force of Nature", effect: "You become an act of god. Immune to ALL damage and effects for 2 rounds. Double movement. Attacks deal +3d6 damage. All enemies in your path are thrown 10 ft aside. Gain +2d8 Rage." },
        ],
      },
    },

    {
      id: "berserk_commanding_shout",
      name: "Commanding Shout",
      description:
        "A powerful shout that rallies allies and demoralizes enemies for 2 rounds. Allies gain +2 attack bonus, enemies must save or suffer -2 attack penalty.",
      level: 5,
      spellType: "ACTION",
      icon: "Utility/Powerful Warrior",

      typeConfig: {
        school: "bludgeoning",
        icon: "Utility/Powerful Warrior",
        tags: ["buff", "debuff", "aoe", "support", "cataclysm"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingMode: "effect",
      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "circle",
        aoeParameters: { radius: 30 },
        targetRestrictions: ["ally", "enemy"],
      },

      effectTargeting: {
        buff: {
          targetingType: "area",
          rangeType: "self_centered",
          aoeShape: "circle",
          aoeParameters: { radius: 30 },
          targetRestrictions: ["ally"],
        },
        debuff: {
          targetingType: "area",
          rangeType: "self_centered",
          aoeShape: "circle",
          aoeParameters: { radius: 30 },
          targetRestrictions: ["enemy"],
        },
      },

      resourceCost: {
        resourceTypes: ["mana", "rage_state", "rage_cost"],
        resourceValues: { mana: 0, rage_state: "Cataclysm", rage_cost: 25 },
        actionPoints: 2,
        components: ["verbal"],
        verbalText: "RALLY TO ME!",
      },

      resolution: "NONE",
      effectTypes: ["buff", "debuff"],

      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          {
            id: "commanding_buff",
            name: "Commanding Presence",
            description: "Gain +2 attack bonus for 2 rounds",
            statModifier: {
              stat: "attack",
              magnitude: 2,
              magnitudeType: "flat",
            },
          },
        ],
        durationValue: 2,
        durationType: "rounds",
        durationUnit: "rounds",
        concentrationRequired: false,
        canBeDispelled: false,
      },

      debuffConfig: {
        debuffType: "statPenalty",
        effects: [
          {
            id: "demoralized",
            name: "Demoralized",
            description:
              "Shakes their resolve, making them less effective in combat.",
            statModifier: {
              stat: "attack",
              magnitude: -2,
              magnitudeType: "flat",
            },
          },
        ],
        durationValue: 2,
        durationType: "rounds",
        durationUnit: "rounds",
        difficultyClass: 16,
        savingThrow: "charisma",
        saveOutcome: "negates",
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },

      tags: ["buff", "debuff", "aoe", "support", "cataclysm", "berserker"],
    },

    {
      id: "berserk_rage_eruption",
      name: "Rage Eruption",
      description:
        "Explode with uncontrollable fury, damaging all nearby enemies but risking self-harm.",
      level: 5,
      spellType: "ACTION",
      icon: "Fire/Volcanic Erupt",

      typeConfig: {
        school: "bludgeoning",
        icon: "Fire/Volcanic Erupt",
        tags: ["aoe", "damage", "self damage", "cataclysm"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "circle",
        aoeParameters: { radius: 15 },
        targetRestrictions: ["enemy"],
      },

      resourceCost: {
        resourceTypes: ["mana", "rage_state", "rage_cost"],
        resourceValues: { mana: 0, rage_state: "Cataclysm", rage_cost: 25 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "MY RAGE CONSUMES ALL!",
        somaticText: "Explode with uncontrollable fury",
      },

      resolution: "SAVE",
      effectTypes: ["damage"],

      damageConfig: {
        formula: "3d6 + strength",
        damageTypes: ["bludgeoning"],

        savingThrowConfig: {
          enabled: true,
          savingThrowType: "constitution",
          difficultyClass: 15,
          saveOutcome: "half_damage",
        },
        triggerCondition: "activation",
        triggerDescription:
          "Deals 3d6 + strength bludgeoning damage to all enemies within 15 ft",
        resolution: "DICE",
      },

      selfDamageConfig: {
        formula: "1d6",

        description: "The uncontrollable eruption of fury damages you as well",
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 4 },

      tags: ["aoe", "damage", "self damage", "cataclysm", "berserker"],

      rollableTable: {
        enabled: true,
        tableName: "Eruption Chaos",
        description: "Your rage explodes outward in an uncontrolled detonation of primal fury. The collateral damage is anyone's guess.",
        diceFormula: "1d20",
        resolutionType: "DICE",
        resolutionConfig: { diceType: "d20" },
        entries: [
          { range: { min: 1, max: 1 }, customName: "Implosion", effect: "The fury collapses inward. Take 4d6 self damage. No damage to enemies. You are Stunned for 1 round." },
          { range: { min: 2, max: 3 }, customName: "Fizzle", effect: "The eruption sputters. Enemies take half damage. You take normal self damage." },
          { range: { min: 4, max: 6 }, customName: "Violent Eruption", effect: "Rage explodes outward. Normal effects apply." },
          { range: { min: 7, max: 9 }, customName: "Crimson Geyser", effect: "Blood and fury spray everywhere. All affected enemies bleed for 1d6/round for 2 rounds." },
          { range: { min: 10, max: 11 }, customName: "Ground Shatter", effect: "The eruption cracks the earth. Area becomes difficult terrain for 3 rounds. +1d8 damage." },
          { range: { min: 12, max: 13 }, customName: "Shockwave", effect: "The blast sends everyone flying. All affected creatures are pushed 10 ft outward. No self damage taken." },
          { range: { min: 14, max: 14 }, customName: "Pyroclastic Burst", effect: "Superheated rage ignites the air. Add 2d8 fire damage to the eruption. Fires start in the area." },
          { range: { min: 15, max: 15 }, customName: "Friendly Fire", effect: "The eruption is indiscriminate. Allies in range also take full damage. You take no self damage." },
          { range: { min: 16, max: 16 }, customName: "Overpressure", effect: "The blast compresses then explodes. Enemies take damage twice (once on impact, once on detonation). Total: double damage." },
          { range: { min: 17, max: 17 }, customName: "Rage Vortex", effect: "The eruption becomes a swirling vortex of fury for 2 rounds. Enemies in area take 2d6/round and are Slowed." },
          { range: { min: 18, max: 18 }, customName: "Soul Eruption", effect: "The blast tears at life essence. +3d8 necrotic damage. You heal for each enemy hit (1d8 per enemy)." },
          { range: { min: 19, max: 19 }, customName: "Cataclysm Unleashed", effect: "The eruption devastates everything. Double area (30 ft radius), +4d6 damage. You take 2d6 self damage but gain +3d6 Rage." },
          { range: { min: 20, max: 20 }, customName: "Ragnarok Spark", effect: "This eruption is a taste of the end times. All enemies in 30 ft take 6d8 + strength damage and are Stunned for 1 round. You take 3d6 self damage. The area is permanently scorched. Gain +4d6 Rage." },
        ],
      },
    },

    {
      id: "berserk_obliterating_strike",
      name: "Obliterating Strike",
      description:
        "Unleash a massive explosion of destructive force. Devastating hits can send enemies flying, stun them, and set them ablaze. Must be used immediately or risk Overheat.",
      level: 6,
      spellType: "ACTION",
      icon: "Utility/Empowered Warrior",

      typeConfig: {
        school: "bludgeoning",
        icon: "Utility/Empowered Warrior",
        tags: ["aoe", "damage", "ultimate", "obliteration"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "circle",
        aoeParameters: { radius: 20 },
        targetRestrictions: ["enemy"],
      },

      resourceCost: {
        resourceTypes: ["mana", "rage_cost"],
        resourceValues: { mana: 0, rage_cost: 30 },
        actionPoints: 3,
        components: ["somatic"],
        somaticText: "Unleash all accumulated fury in one devastating strike",
      },

      resolution: "SAVE",
      effectTypes: ["damage"],

      damageConfig: {
        formula: "4d8 + strength + 3d6",
        damageTypes: ["bludgeoning"],

        savingThrowConfig: {
          enabled: true,
          savingThrowType: "constitution",
          difficultyClass: 18,
          saveOutcome: "half_damage",
        },
        criticalConfig: {
          enabled: true,
          critType: "dice",
          critMultiplier: 4,
          extraDice: "2d6",
          critEffects: ["knockback", "stun", "bleeding"],
          explodingDice: true,
          explodingDiceType: "double_value",
          knockbackConfig: {
            distance: 20,
          },
          stunConfig: {
            duration: 2,
            durationUnit: "rounds",
            saveDC: 18,
            saveType: "constitution",
          },
          bleedingConfig: {},
        },
        resolution: "DICE",
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 4 },

      tags: ["aoe", "damage", "ultimate", "obliteration", "berserker"],

      rollableTable: {
        enabled: true,
        tableName: "Obliteration Chaos",
        description: "Your Obliterating Strike tears at the fabric of existence. The devastation is absolute, unpredictable, and possibly self-destructive.",
        diceFormula: "1d20",
        resolutionType: "DICE",
        resolutionConfig: { diceType: "d20" },
        entries: [
          { range: { min: 1, max: 1 }, customName: "Total Collapse", effect: "The fury annihilates YOU. Take 5d8 self damage. Enemies take half damage. You are Stunned for 2 rounds. Reset Rage to 0." },
          { range: { min: 2, max: 3 }, customName: "Fizzling Obliteration", effect: "The strike lacks killing intent. Enemies take half damage. No critical effects. You still pay full Rage cost." },
          { range: { min: 4, max: 6 }, customName: "Devastating Force", effect: "Obliteration strikes true. Normal effects apply with full force." },
          { range: { min: 7, max: 9 }, customName: "Obliteration Wave", effect: "The shockwave expands. Radius increases to 30 ft. All affected are knocked prone." },
          { range: { min: 10, max: 11 }, customName: "Atomized", effect: "The force pulverizes matter. Non-magical objects in the area are destroyed. Enemies take +3d6 force damage." },
          { range: { min: 12, max: 12 }, customName: "Crater Formation", effect: "A crater forms. Area becomes a 20 ft pit. Enemies in the area fall and are Restrained at the bottom." },
          { range: { min: 13, max: 13 }, customName: "Obliteration Cascade", effect: "The energy chains to secondary targets. Up to 4 additional enemies within 40 ft take 3d8 each." },
          { range: { min: 14, max: 14 }, customName: "Temporal Fracture", effect: "The strike breaks time. Affected enemies are Slowed for 3 rounds. You gain an extra action this turn." },
          { range: { min: 15, max: 15 }, customName: "Catastrophic Hemorrhage", effect: "The force liquefies organs. All affected bleed for 2d8/round for 3 rounds. No save." },
          { range: { min: 16, max: 16 }, customName: "Black Hole Impact", effect: "The strike creates a momentary singularity. All enemies within 40 ft are pulled 20 ft toward center. Those within 10 ft take double damage." },
          { range: { min: 17, max: 17 }, customName: "Rage Supernova", effect: "Your Rage detonates supernaturally. Triple the area (40 ft). All affected are Stunned for 1 round and take +4d6 damage. Take 2d8 self damage." },
          { range: { min: 18, max: 18 }, customName: "Erasure", effect: "The strike erases matter. One target below 50% HP is destroyed outright (no save). Others take +5d6 force damage." },
          { range: { min: 19, max: 19 }, customName: "Obliteration Protocol", effect: "Pure destruction algorithm. All affected take maximum possible damage (no roll needed). All are Stunned for 2 rounds. Ground is permanently destroyed." },
          { range: { min: 20, max: 20 }, customName: "End of Reason", effect: "The strike breaks existence. All creatures in 40 ft take 10d10 damage and are Stunned for 2 rounds. The terrain is permanently altered. You enter Apocalypse State regardless of current Rage. You are immune to all damage for 1 round." },
        ],
      },
    },

    {
      id: "berserk_wrath_berserker",
      name: "Wrath of the Berserker",
      description:
        "The ultimate expression of fury, channeling the full power of your rage into every strike for 3 rounds. Gain +5 damage bonus and advantage on all attack rolls.",
      level: 6,
      spellType: "ACTION",
      icon: "General/Rage",

      typeConfig: {
        school: "bludgeoning",
        icon: "General/Rage",
        tags: ["buff", "advantage", "damage", "ultimate", "obliteration"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },

      resourceCost: {
        resourceTypes: ["mana", "rage_cost"],
        resourceValues: { mana: 0, rage_cost: 35 },
        actionPoints: 3,
        components: ["verbal", "somatic"],
        verbalText: "WITNESS TRUE FURY!",
        somaticText: "Embrace the full power of rage",
      },

      resolution: "NONE",
      effectTypes: ["buff"],

      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          {
            id: "wrath_damage",
            name: "Wrath of the Berserker",
            description:
              "Gain +5 damage bonus and advantage on all attack rolls for 3 rounds",
            statModifier: {
              stat: "damage",
              magnitude: 5,
              magnitudeType: "flat",
            },
          },
        ],
        durationValue: 3,
        durationType: "rounds",
        durationUnit: "rounds",
        concentrationRequired: false,
        canBeDispelled: false,
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 5 },

      tags: [
        "buff",
        "advantage",
        "damage",
        "ultimate",
        "obliteration",
        "berserker",
      ],

      rollableTable: {
        enabled: true,
        tableName: "Wrath Manifestation",
        description: "The full power of your fury manifests in unpredictable ways. Your wrath takes on a life of its own.",
        diceFormula: "1d20",
        resolutionType: "DICE",
        resolutionConfig: { diceType: "d20" },
        entries: [
          { range: { min: 1, max: 1 }, customName: "Wrath Collapse", effect: "The power crushes you. Take 3d6 damage. Buff lasts only 1 round. You are Exhausted afterward." },
          { range: { min: 2, max: 3 }, customName: "Simmering Wrath", effect: "The fury doesn't fully ignite. +3 damage instead of +5. No advantage." },
          { range: { min: 4, max: 6 }, customName: "Wrath of the Berserker", effect: "Standard wrath. +5 damage and advantage on attacks for 3 rounds." },
          { range: { min: 7, max: 8 }, customName: "Aura of Wrath", effect: "Your wrath radiates outward. All enemies within 15 ft take 1d6 damage per round while the buff is active." },
          { range: { min: 9, max: 10 }, customName: "Blessing of Fury", effect: "Your wrath empowers allies too. All allies within 30 ft gain +2 damage for the duration." },
          { range: { min: 11, max: 11 }, customName: "Endless Wrath", effect: "The fury won't stop. Duration extended to 4 rounds instead of 3." },
          { range: { min: 12, max: 12 }, customName: "Wrath Regeneration", effect: "The wrath sustains your body. Heal 1d8 HP at the start of each turn during the buff." },
          { range: { min: 13, max: 13 }, customName: "Savage Criticals", effect: "Wrath sharpens your strikes. Crit range expands to 18-20 during the buff." },
          { range: { min: 14, max: 14 }, customName: "Unrelenting", effect: "The wrath refuses death. If you drop to 0 HP during the buff, you stay at 1 HP instead (once)." },
          { range: { min: 15, max: 15 }, customName: "Blood Wrath", effect: "The wrath drinks blood. 25% lifesteal on all attacks during the buff." },
          { range: { min: 16, max: 16 }, customName: "Primal Fury", effect: "The wrath transcends. +8 damage instead of +5. Advantage on all STR and CON checks too." },
          { range: { min: 17, max: 17 }, customName: "Wrath Storm", effect: "Your fury creates a storm around you. All attacks against you have disadvantage. All your attacks have advantage. +1d6 lightning on each hit." },
          { range: { min: 18, max: 18 }, customName: "Avatar of Wrath", effect: "You become wrath incarnate. +10 damage. Crit range 17-20. Cannot be slowed, stunned, or controlled for the duration." },
          { range: { min: 19, max: 19 }, customName: "Worldbreaker's Wrath", effect: "Your strikes can break the world. +12 damage. Each hit causes a localized earthquake — enemies within 5 ft of your target take 1d8 damage." },
          { range: { min: 20, max: 20 }, customName: "Wrath Eternal", effect: "THE FURY NEVER ENDS. Duration: rest of combat. +10 damage. Advantage on ALL rolls. Crit range 17-20. Every kill extends all active buffs by 1 round. At combat end, take 4d6 exhaustion damage. Worth it." },
        ],
      },
    },

    {
      id: "berserk_final_stand",
      name: "Final Stand",
      description:
        "Make a last stand against overwhelming odds for 2 rounds, becoming nearly invincible but unable to move.",
      level: 6,
      spellType: "ACTION",
      icon: "Utility/Resistance",

      typeConfig: {
        school: "bludgeoning",
        icon: "Utility/Resistance",
        tags: ["buff", "invulnerability", "ultimate"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },

      resourceCost: {
        resourceTypes: ["mana", "rage_cost"],
        resourceValues: { mana: 0, rage_cost: 40 },
        actionPoints: 3,
        components: ["verbal", "somatic"],
        verbalText: "I WILL NOT FALL!",
        somaticText: "Dig in for final stand",
      },

      resolution: "NONE",
      effectTypes: ["buff"],

      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          {
            id: "final_stand_defense",
            name: "Final Stand",
            description:
              "Gain 75% damage reduction for 2 rounds. Cannot move from your position.",
            statModifier: {
              stat: "damage_reduction",
              magnitude: 75,
              magnitudeType: "percentage",
            },
          },
        ],
        durationValue: 2,
        durationType: "rounds",
        durationUnit: "rounds",
        concentrationRequired: false,
        canBeDispelled: false,
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 6 },

      tags: [
        "buff",
        "invulnerability",
        "ultimate",
        "obliteration",
        "berserker",
      ],
    },

    // ========================================
    // LEVEL 7 SPELLS - Mythic Abilities
    // ========================================

    {
      id: "berserk_berserkers_rage",
      name: "Berserker's Rage",
      description:
        "Embrace the full power of your fury, transforming into an unstoppable force of destruction. Your body surges with primal energy and supernatural strength.",
      level: 7,
      spellType: "ACTION",
      icon: "General/Fiery Rage",

      typeConfig: {
        school: "bludgeoning",
        icon: "General/Fiery Rage",
        tags: ["buff", "transformation", "damage"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },

      targetingMode: "effect",

      effectTargeting: {
        transformation: {
          targetingType: "self",
          rangeType: "self",
        },
        damage: {
          targetingType: "area",
          rangeType: "self_centered",
          aoeShape: "circle",
          aoeParameters: { radius: 15 },
          targetRestrictions: ["enemy"],
        },
      },

      resourceCost: {
        resourceTypes: ["mana", "rage_cost"],
        resourceValues: { mana: 0, rage_cost: 50 },
        actionPoints: 3,
        components: ["verbal", "somatic"],
        verbalText: "I AM THE STORM!",
        somaticText: "Embrace the raging beast within",
      },

      resolution: "NONE",
      effectTypes: ["transformation", "damage"],

      transformationConfig: {
        transformationType: "physical",
        targetType: "self",
        duration: 5,
        durationUnit: "rounds",
        power: "major",
        newForm: "Berserker's Rage",
        description:
          "Your body swells with primal energy as you embrace your fury.",
        grantedAbilities: [
          {
            id: "rage_damage_bonus",
            name: "+8 Damage Bonus",
            description: "All attacks deal +8 additional damage",
          },
          {
            id: "rage_resistance",
            name: "Pain Resistance",
            description: "Reduce incoming damage by 2",
          },
        ],
      },

      damageConfig: {
        formula: "2d6",
        damageTypes: ["bludgeoning"],

        triggerCondition: "activation",
        triggerDescription:
          "Deals 2d6 bludgeoning damage to all enemies within 15 ft when activated",
        resolution: "DICE",
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 6 },

      tags: ["buff", "damage", "transformation", "obliteration", "berserker"],
    },

    {
      id: "berserk_fury_of_the_ancients",
      name: "Fury of the Ancients",
      description:
        "Transform into a living cyclone of primal fury, dealing massive AoE damage and knocking enemies down.",
      level: 7,
      spellType: "ACTION",
      icon: "Slashing/Whirl",

      typeConfig: {
        school: "bludgeoning",
        icon: "Slashing/Whirl",
        tags: ["aoe", "damage", "control", "movement"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "circle",
        aoeParameters: { radius: 15 },
        targetRestrictions: ["enemy"],
      },

      resourceCost: {
        resourceTypes: ["mana", "rage_cost"],
        resourceValues: { mana: 0, rage_cost: 45 },
        actionPoints: 3,
        components: ["somatic"],
        somaticText: "Spin into a whirlwind of blades",
      },

      resolution: "SAVE",
      effectTypes: ["damage", "control"],

      damageConfig: {
        formula: "3d6 + strength + 2d6",
        damageTypes: ["bludgeoning"],

        savingThrowConfig: {
          enabled: true,
          savingThrowType: "strength",
          difficultyClass: 18,
          saveOutcome: "half_damage",
        },
        criticalConfig: {
          enabled: true,
          critType: "dice",
          critMultiplier: 4,
          critEffects: ["knockback", "stun", "bleeding"],
          explodingDice: true,
          explodingDiceType: "reroll_add",
        },
        resolution: "DICE",
      },

      controlConfig: {
        controlType: "knockdown",
        effects: [
          {
            id: "repel",
            name: "Whirlwind Force",
            description:
              "Enemies are knocked back and down by the spinning fury",
            config: {
              saveType: "strength",
              saveDC: 18,
              pushDistance: 10,
              knockdown: true,
              duration: 1,
              durationUnit: "rounds",
            },
          },
        ],
        duration: 1,
        durationUnit: "rounds",
        saveDC: 18,
        saveType: "strength",
        savingThrow: true,
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 5 },

      tags: [
        "aoe",
        "damage",
        "control",
        "movement",
        "obliteration",
        "berserker",
      ],

      rollableTable: {
        enabled: true,
        tableName: "Cyclone of Chaos",
        description: "Your living cyclone of primal fury drags in everything around it — allies, enemies, debris, and sometimes things from beyond.",
        diceFormula: "1d20",
        resolutionType: "DICE",
        resolutionConfig: { diceType: "d20" },
        entries: [
          { range: { min: 1, max: 1 }, customName: "Cyclone Collapse", effect: "The cyclone implodes. Take 3d8 self damage and are knocked prone. Enemies take half damage." },
          { range: { min: 2, max: 3 }, customName: "Weak Whirlwind", effect: "The cyclone sputters. Enemies take half damage and are not knocked down." },
          { range: { min: 4, max: 6 }, customName: "Primal Cyclone", effect: "The whirlwind howls. Normal effects apply." },
          { range: { min: 7, max: 9 }, customName: "Debris Storm", effect: "The cyclone hurls debris. All affected take +2d6 damage and are Blinded for 1 round." },
          { range: { min: 10, max: 11 }, customName: "Tornado Alley", effect: "The cyclone elongates. Line of effect extends to 30 ft long, 10 ft wide. +1d8 damage." },
          { range: { min: 12, max: 13 }, customName: "Vacuum Center", effect: "The cyclone pulls everything in. All creatures within 25 ft are pulled 15 ft toward you before taking damage." },
          { range: { min: 14, max: 14 }, customName: "Lightning Cyclone", effect: "Static builds in the vortex. Add 2d8 lightning damage to all affected. You are immune to the lightning." },
          { range: { min: 15, max: 15 }, customName: "Blood Hurricane", effect: "The cyclone drinks blood. Heal for 1d8 per enemy hit. Affected enemies bleed for 1d6/round for 2 rounds." },
          { range: { min: 16, max: 16 }, customName: "Ancient Howl", effect: "The cyclone amplifies your roar. All affected are Frightened for 2 rounds in addition to knockdown." },
          { range: { min: 17, max: 17 }, customName: "Elemental Vortex", effect: "Primal energy surges. Add 1d6 fire, 1d6 lightning, and 1d6 cold damage to the cyclone." },
          { range: { min: 18, max: 18 }, customName: "Rampage Extension", effect: "The fury sustains you. Cyclone persists for 1 additional round, dealing half damage again." },
          { range: { min: 19, max: 19 }, customName: "Primal Devastation", effect: "The cyclone carves a scar into the earth. +5d8 damage. Area becomes permanently difficult terrain. Gain +3d6 Rage." },
          { range: { min: 20, max: 20 }, customName: "World Eater", effect: "The cyclone becomes a force of nature. Double radius. All affected take 8d8 damage, are thrown 20 ft, and are Stunned for 2 rounds. The terrain is permanently destroyed. Gain +4d6 Rage." },
        ],
      },
    },

    {
      id: "berserk_blood_frenzy",
      name: "Blood Frenzy",
      description:
        "Enter a blood-fueled frenzy, healing for each enemy you defeat. Your bloodlust becomes a source of life-giving energy, though the frenzy is exhausting to maintain.",
      level: 7,
      spellType: "ACTION",
      icon: "Necrotic/Blood Skull",

      typeConfig: {
        school: "bludgeoning",
        icon: "Necrotic/Blood Skull",
        tags: ["buff", "healing"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },

      resourceCost: {
        resourceTypes: ["mana", "rage_cost"],
        resourceValues: { mana: 0, rage_cost: 55 },
        actionPoints: 3,
        components: ["verbal", "somatic"],
        verbalText: "BLOOD FUELS MY RAGE!",
        somaticText: "Enter blood-fueled frenzy",
      },

      resolution: "NONE",
      effectTypes: ["buff"],

      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          {
            id: "blood_frenzy_heal",
            name: "Blood Frenzy",
            description:
              "Heal 20 hit points per enemy defeated (max 60 HP per round). Your blood-fueled frenzy turns every kill into life-giving energy",
            statModifier: {
              stat: "healingPerKill",
              magnitude: 20,
              magnitudeType: "flat",
            },
          },
        ],
        durationValue: 4,
        durationType: "rounds",
        durationUnit: "rounds",
        concentrationRequired: false,
        canBeDispelled: false,
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 7 },

      tags: ["buff", "healing", "obliteration", "berserker"],

      rollableTable: {
        enabled: true,
        tableName: "Blood Frenzy Surge",
        description: "Your blood-fueled frenzy has unpredictable effects on your physiology — sometimes enhancing, sometimes warping your body in unsettling ways.",
        diceFormula: "1d20",
        resolutionType: "DICE",
        resolutionConfig: { diceType: "d20" },
        entries: [
          { range: { min: 1, max: 1 }, customName: "Blood Rejection", effect: "Your body rejects the frenzy. Take 2d8 damage immediately. Healing per kill reduced to 5 HP." },
          { range: { min: 2, max: 4 }, customName: "Steady Frenzy", effect: "Standard blood frenzy. Heal 20 HP per kill (max 60/round)." },
          { range: { min: 5, max: 7 }, customName: "Enhanced Bloodlust", effect: "The frenzy is potent. Heal 25 HP per kill (max 80/round)." },
          { range: { min: 8, max: 9 }, customName: "Crimson Claws", effect: "Your fingernails elongate. Unarmed attacks deal 1d8 slashing. You can make one bonus unarmed attack per turn." },
          { range: { min: 10, max: 11 }, customName: "Blood Sight", effect: "You can see the blood in creatures' veins. Gain advantage on attacks against bleeding or wounded targets." },
          { range: { min: 12, max: 12 }, customName: "Sanguine Speed", effect: "Blood accelerates your movements. +10 ft movement and +1 action point per turn during the frenzy." },
          { range: { min: 13, max: 13 }, customName: "Hemoglobin Shield", effect: "Coagulated blood forms a barrier. Gain a shield equal to 2 × enemies killed (max 40 HP). Lasts until end of frenzy." },
          { range: { min: 14, max: 14 }, customName: "Vampiric Aura", effect: "Your frenzy pulls life from nearby enemies. All enemies within 10 ft take 1d4 necrotic/round. You heal that amount." },
          { range: { min: 15, max: 15 }, customName: "Massacre Healer", effect: "Killing blows send a pulse of healing to all allies within 30 ft. Each ally heals for 1d8 per kill you make." },
          { range: { min: 16, max: 16 }, customName: "Blood Rain", effect: "Your frenzy sprays blood in a 10 ft radius. All enemies in range are Blinded for 1 round per kill." },
          { range: { min: 17, max: 17 }, customName: "Undying Frenzy", effect: "The blood frenzy keeps you alive. If reduced to 0 HP during frenzy, stay at 1 HP instead (once). Duration extends by 1 round." },
          { range: { min: 18, max: 18 }, customName: "Blood God's Favor", effect: "The Blood God rewards your devotion. Heal 30 HP per kill (max 100/round). All allies within 15 ft gain +2 damage." },
          { range: { min: 19, max: 19 }, customName: "Crimson Hurricane", effect: "Your frenzy becomes a whirlwind of blood. Each turn, all adjacent enemies take 2d6 slashing. You heal for each enemy hit." },
          { range: { min: 20, max: 20 }, customName: "Sanguine Ascension", effect: "You transcend mortality through blood. Become immune to HP reduction for the duration. All kills grant permanent +5 max HP for the combat. Duration extended to 6 rounds. When it ends, you are Exhausted for 1 round." },
        ],
      },
    },

    {
      id: "berserk_ragnarok_fury",
      name: "Ragnarok Fury",
      description:
        "Unleash apocalyptic concussive force that consumes everything in a 25-foot radius. Enemies that fail their save are stunned by the shockwave.",
      level: 8,
      spellType: "ACTION",
      icon: "Fire/Dripping Lava",

      typeConfig: {
        school: "bludgeoning",
        icon: "Fire/Dripping Lava",
        tags: ["aoe", "damage", "control"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 30,
        aoeShape: "circle",
        aoeParameters: { radius: 25 },
        targetRestrictions: ["enemy"],
      },

      resourceCost: {
        resourceTypes: ["mana", "rage_cost"],
        resourceValues: { mana: 0, rage_cost: 60 },
        actionPoints: 4,
        components: ["verbal", "somatic"],
        verbalText: "THE WORLD BURNS!",
        somaticText: "Strike the ground with apocalyptic force",
      },

      resolution: "SAVE",
      effectTypes: ["damage", "control"],

      damageConfig: {
        formula: "5d8 + strength + 4d6",
        damageTypes: ["bludgeoning"],

        savingThrowConfig: {
          enabled: true,
          savingThrowType: "constitution",
          difficultyClass: 19,
          saveOutcome: "half_damage",
        },
        resolution: "DICE",
      },

      controlConfig: {
        controlType: "incapacitation",
        effects: [
          {
            id: "stun",
            name: "Apocalyptic Shock",
            description: "Enemies are stunned by the apocalyptic force",
            config: {
              durationType: "rounds",
              recoveryMethod: "automatic",
              saveType: "constitution",
              saveDC: 19,
              duration: 2,
              durationUnit: "rounds",
            },
          },
        ],
        duration: 2,
        durationUnit: "rounds",
        saveDC: 19,
        saveType: "constitution",
        savingThrow: true,
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 7 },

      tags: ["aoe", "damage", "fire", "control", "obliteration", "berserker"],

      rollableTable: {
        enabled: true,
        tableName: "Ragnarok Mayhem",
        description: "Your apocalyptic concussive force carries the wrath of endings — reality itself buckles under the strain of your fury.",
        diceFormula: "1d20",
        resolutionType: "DICE",
        resolutionConfig: { diceType: "d20" },
        entries: [
          { range: { min: 1, max: 1 }, customName: "Premature Ragnarok", effect: "The apocalypse turns inward. Take 6d8 self damage. Enemies take half damage. You are Stunned for 2 rounds." },
          { range: { min: 2, max: 3 }, customName: "Dud Apocalypse", effect: "The fury fizzles. Half damage. No stun effect. Shameful." },
          { range: { min: 4, max: 6 }, customName: "Apocalyptic Force", effect: "Ragnarok strikes. Normal effects apply." },
          { range: { min: 7, max: 9 }, customName: "Meteoric Impact", effect: "The force calls down destruction. Add 3d8 fire damage. Area ignites, dealing 1d8 fire/round for 2 rounds." },
          { range: { min: 10, max: 11 }, customName: "Tectonic Rupture", effect: "The ground shatters. Area becomes a 25 ft crater. Difficult terrain permanently. All enemies are Restrained." },
          { range: { min: 12, max: 13 }, customName: "Ragnarok Winds", effect: "Hurricane-force winds. All affected are pushed to the edge of the area and take +2d6 bludgeoning from debris." },
          { range: { min: 14, max: 14 }, customName: "Ash and Ruin", effect: "The blast fills the area with choking ash. Affected enemies are Blinded and Suffocating for 2 rounds." },
          { range: { min: 15, max: 15 }, customName: "Worldscar", effect: "The strike permanently scars the earth. A rift opens. Enemies within 10 ft of center fall in and take ongoing 2d6/round until they climb out." },
          { range: { min: 16, max: 16 }, customName: "Soul Ragnarok", effect: "The force tears at souls. Add 3d8 necrotic damage. Affected enemies lose 1 highest-level spell slot or ability use." },
          { range: { min: 17, max: 17 }, customName: "Extinction Event", effect: "The blast simulates mass extinction. All non-boss enemies below 40% HP are slain outright. Others take double damage." },
          { range: { min: 18, max: 18 }, customName: "Ragnarok Recursion", effect: "The apocalypse echoes. After initial damage, the area detonates again at start of your next turn for half damage." },
          { range: { min: 19, max: 19 }, customName: "Twilight of the Gods", effect: "Divine-level destruction. +6d8 damage. All affected are Stunned for 3 rounds. All structures in area collapse. Gain +4d8 Rage." },
          { range: { min: 20, max: 20 }, customName: "True Ragnarok", effect: "THE END. 50 ft radius. All creatures take 12d10 damage. Non-bosses below 75% HP are annihilated. Area is permanently a scorched wasteland. You enter Apocalypse State. Gain immunity for 1 round. Take 4d8 self damage." },
        ],
      },
    },

    {
      id: "berserk_immortal_rage",
      name: "Immortal Rage",
      description:
        "Your fury transcends death itself, granting immortality for 3 rounds. You become immune to death and all lethal damage, but the strain is immense — when it ends, you collapse.",
      level: 8,
      spellType: "ACTION",
      icon: "Necrotic/Screaming Skull",

      typeConfig: {
        school: "bludgeoning",
        icon: "Necrotic/Screaming Skull",
        tags: ["buff", "immortality"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },

      resourceCost: {
        resourceTypes: ["mana", "rage_cost"],
        resourceValues: { mana: 0, rage_cost: 70 },
        actionPoints: 4,
        components: ["verbal", "somatic"],
        verbalText: "DEATH CANNOT HOLD ME!",
        somaticText: "Reject mortality itself",
      },

      resolution: "NONE",
      effectTypes: ["buff"],

      buffConfig: {
        buffType: "statusEffect",
        effects: [
          {
            id: "immortal_rage",
            name: "Immortal Rage",
            description:
              "Immune to death and all lethal damage for 3 rounds. When the effect ends, you are Stunned for 1 round and take 3d6 exhaustion damage.",
            statusType: "immortality",
            level: "extreme",
            mechanicsText:
              "Cannot die or take lethal damage for 3 rounds. HP cannot drop below 1. When the effect ends: Stunned 1 round + 3d6 damage.",
          },
        ],
        durationValue: 3,
        durationType: "rounds",
        durationUnit: "rounds",
        concentrationRequired: false,
        canBeDispelled: false,
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 8 },

      tags: ["buff", "immortality", "obliteration", "berserker"],

      rollableTable: {
        enabled: true,
        tableName: "Death Defiance",
        description: "When you reject death itself, the cosmos takes notice. The aftermath of your immortality is never predictable.",
        diceFormula: "1d20",
        resolutionType: "DICE",
        resolutionConfig: { diceType: "d20" },
        entries: [
          { range: { min: 1, max: 1 }, customName: "False Immortality", effect: "Death was not truly denied. Duration reduced to 1 round. When it ends, take 4d6 damage and are Stunned for 2 rounds." },
          { range: { min: 2, max: 4 }, customName: "Heavy Toll", effect: "The strain is immense. After effect ends: Stunned 1 round + 4d6 exhaustion damage (worse than normal)." },
          { range: { min: 5, max: 7 }, customName: "Death's Grip", effect: "Standard immortality. Normal aftereffect applies." },
          { range: { min: 8, max: 9 }, customName: "Undying Fury", effect: "Your defiance fuels rage. Gain +1d8 Rage per round while immortal. Normal aftereffect." },
          { range: { min: 10, max: 11 }, customName: "Phantom Pain", effect: "You feel every blow that should have killed you. Gain resistance to the next damage type that hits you. Aftereffect: only 2d6 damage." },
          { range: { min: 12, max: 13 }, customName: "Death Aura", effect: "Your defiance radiates necrotic energy. All enemies within 10 ft take 1d8 necrotic per round while you are immortal." },
          { range: { min: 14, max: 14 }, customName: "Resurrection Surge", effect: "If you were below 25% HP when activated, heal to 50% HP. Normal aftereffect." },
          { range: { min: 15, max: 15 }, customName: "Soul Anchor", effect: "Your soul is anchored to your body. Aftereffect reduced: only 1d6 damage, no Stun." },
          { range: { min: 16, max: 16 }, customName: "Lich-Strike", effect: "Your immortal blows steal life. Melee attacks during immortality heal you for 25% of damage dealt." },
          { range: { min: 17, max: 17 }, customName: "Eternal Warrior", effect: "Duration extended to 4 rounds. Aftereffect: Stunned 1 round + 2d6 damage." },
          { range: { min: 18, max: 18 }, customName: "Death Reversal", effect: "If an ally within 30 ft dies during your immortality, they are revived with half HP. Aftereffect unchanged." },
          { range: { min: 19, max: 19 }, customName: "Beyond Death", effect: "For the duration, you deal +3d6 damage on all attacks and are immune to all conditions. Aftereffect: only 1d6 damage." },
          { range: { min: 20, max: 20 }, customName: "Undying God", effect: "True immortality for 3 rounds. Immune to ALL damage and conditions. All allies within 30 ft gain resistance to all damage. Aftereffect: no Stun, only 1d8 damage. You are Exhausted for 1 round (disadvantage on all rolls)." },
        ],
      },
    },

    {
      id: "berserk_earthshaker_slam",
      name: "Earthshaker Slam",
      description:
        "Slam both fists into the ground with enough force to crack the earth, dragging enemies toward you and burying them under debris.",
      level: 8,
      spellType: "ACTION",
      icon: "Bludgeoning/Mortal Strike",

      typeConfig: {
        school: "bludgeoning",
        icon: "Bludgeoning/Mortal Strike",
        tags: ["aoe", "damage", "control"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 40,
        aoeShape: "circle",
        aoeParameters: { radius: 20 },
        targetRestrictions: ["enemy"],
      },

      resourceCost: {
        resourceTypes: ["mana", "rage_cost"],
        resourceValues: { mana: 0, rage_cost: 75 },
        actionPoints: 4,
        components: ["somatic"],
        somaticText: "Slam fists into the earth with devastating force",
      },

      resolution: "SAVE",
      effectTypes: ["damage", "control"],

      damageConfig: {
        formula: "4d6 + strength + 3d6",
        damageTypes: ["bludgeoning"],

        savingThrowConfig: {
          enabled: true,
          savingThrowType: "constitution",
          difficultyClass: 19,
          saveOutcome: "half_damage",
        },
        resolution: "DICE",
      },

      controlConfig: {
        controlType: "forcedMovement",
        effects: [
          {
            id: "pull",
            name: "Ground Drag",
            description: "The shockwave drags enemies toward the impact point",
            config: {
              movementType: "pull",
              distance: 20,
              saveType: "constitution",
              saveDC: 19,
            },
          },
        ],
        duration: 0,
        durationUnit: "instant",
        saveDC: 19,
        saveType: "constitution",
        savingThrow: true,
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 8 },

      tags: ["aoe", "damage", "control", "obliteration", "berserker"],

      rollableTable: {
        enabled: true,
        tableName: "Earthshaker Chaos",
        description: "The earth itself rebels at your touch. What rises from the cracks is anyone's guess.",
        diceFormula: "1d20",
        resolutionType: "DICE",
        resolutionConfig: { diceType: "d20" },
        entries: [
          { range: { min: 1, max: 1 }, customName: "Self Bury", effect: "The ground swallows YOU. Take 3d6 damage. You are Restrained for 1 round. Enemies take half damage." },
          { range: { min: 2, max: 3 }, customName: "Tremor", effect: "A mild shake. Enemies take half damage and are not pulled." },
          { range: { min: 4, max: 6 }, customName: "Earthshaker Impact", effect: "The ground cracks. Normal effects apply." },
          { range: { min: 7, max: 9 }, customName: "Sinkhole", effect: "The ground collapses. Area becomes a 20 ft pit. Enemies who fall are Restrained." },
          { range: { min: 10, max: 11 }, customName: "Debris Avalanche", effect: "Shattered rock buries enemies. Affected targets are buried and take +2d6 damage. DC 19 Str to break free." },
          { range: { min: 12, max: 13 }, customName: "Fissure", effect: "A crack races outward. Line extends 40 ft. All creatures in the line take damage and are knocked prone." },
          { range: { min: 14, max: 14 }, customName: "Magma Vent", effect: "Underground heat erupts. Add 3d8 fire damage. Area ignites, dealing 1d8 fire/round for 2 rounds." },
          { range: { min: 15, max: 15 }, customName: "Stone Prison", effect: "Rising stone walls trap enemies. Affected targets are Encased in Stone — Restrained and line of sight blocked for 2 rounds." },
          { range: { min: 16, max: 16 }, customName: "Gravitational Collapse", effect: "The earth compresses then rebounds. Enemies are pulled 30 ft toward center. Those at center take double damage." },
          { range: { min: 17, max: 17 }, customName: "Tectonic Cascade", effect: "The quake triggers aftershocks. At start of next 2 rounds, all enemies in area take 2d6 bludgeoning." },
          { range: { min: 18, max: 18 }, customName: "Earth Eruption", effect: "Stalagmites burst from the ground. +4d8 piercing damage. Area becomes impassable terrain for 3 rounds." },
          { range: { min: 19, max: 19 }, customName: "Continental Sunder", effect: "The earth splits permanently. +5d8 damage. A 40 ft chasm opens. Enemies on either side are separated." },
          { range: { min: 20, max: 20 }, customName: "Worldbreaker", effect: "The planet cracks. All creatures in 50 ft take 10d8 bludgeoning. The terrain is permanently reshaped. Structures collapse. Gain +4d8 Rage. Take 3d8 self damage." },
        ],
      },
    },

    // ========================================
    // LEVEL 9 SPELLS - Legendary Rage Abilities
    // ========================================

    {
      id: "berserk_primal_cataclysm",
      name: "Primal Cataclysm",
      description:
        "Channel all your accumulated fury into a devastating ground-shaking impact. The sheer violence of the attack strains your body as much as it devastates your enemies.",
      level: 9,
      spellType: "ACTION",
      icon: "Arcane/Missile",

      typeConfig: {
        school: "bludgeoning",
        icon: "Arcane/Missile",
        tags: ["aoe", "damage", "obliteration"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "circle",
        aoeParameters: { radius: 20 },
        targetRestrictions: ["enemy"],
      },

      resourceCost: {
        resourceTypes: ["mana", "rage_state", "rage_cost"],
        resourceValues: { mana: 0, rage_state: "Obliteration", rage_cost: 80 },
        actionPoints: 4,
        components: ["verbal", "somatic"],
        verbalText: "FEEL MY FURY!",
        somaticText: "Slam fists into the ground with devastating force",
      },

      resolution: "SAVE",
      effectTypes: ["damage", "control"],

      damageConfig: {
        formula: "4d10 + strength",
        damageTypes: ["bludgeoning"],

        savingThrowConfig: {
          enabled: true,
          savingThrowType: "constitution",
          difficultyClass: 18,
          saveOutcome: "half_damage",
        },
        resolution: "DICE",
      },

      selfDamageConfig: {
        formula: "2d6",

        description: "The violent impact strains your own body",
      },

      controlConfig: {
        controlType: "knockdown",
        effects: [
          {
            id: "trip",
            name: "Ground Tremor",
            description: "Enemies are knocked prone by the shockwave",
            config: {
              durationType: "instant",
              recoveryMethod: "stand_action",
              saveType: "strength",
              saveDC: 18,
            },
          },
        ],
        duration: 0,
        durationUnit: "instant",
        saveDC: 18,
        saveType: "strength",
        savingThrow: true,
      },

      cooldownConfig: {
        cooldownType: "combat",
        cooldownValue: 1,
      },

      tags: ["aoe", "damage", "obliteration", "berserker", "self damage"],

      rollableTable: {
        enabled: true,
        tableName: "Primal Cataclysm Chaos",
        description: "The accumulated fury of an entire battle erupts in a single devastating moment. What rises from the aftermath cannot be predicted.",
        diceFormula: "1d20",
        resolutionType: "DICE",
        resolutionConfig: { diceType: "d20" },
        entries: [
          { range: { min: 1, max: 1 }, customName: "Self Annihilation", effect: "The cataclysm consumes you. Take 6d10 self damage. Enemies take half damage. You are Incapacitated for 2 rounds." },
          { range: { min: 2, max: 3 }, customName: "Seismic Ripple", effect: "The impact is dampened. Half damage to enemies. Self damage still applies." },
          { range: { min: 4, max: 6 }, customName: "Primal Devastation", effect: "The fury finds its mark. Normal effects." },
          { range: { min: 7, max: 9 }, customName: "Ground Zero", effect: "The impact creates a permanent crater. +2d10 damage. Enemies within 10 ft of center take double damage." },
          { range: { min: 10, max: 11 }, customName: "Rage Afterimage", effect: "Your fury lingers. Area becomes a Primal Zone for 3 rounds — enemies entering take 2d6/round." },
          { range: { min: 12, max: 12 }, customName: "Primal Storm", effect: "The cataclysm summons a storm. Area is engulfed in thunder and lightning. Add 3d8 thunder + 2d8 lightning damage." },
          { range: { min: 13, max: 13 }, customName: "Bone Shatter", effect: "The force crushes bone. All affected have -2 to all physical rolls for 3 rounds. No save." },
          { range: { min: 14, max: 14 }, customName: "Soul Rend", effect: "The cataclysm tears at spirit. Add 3d8 necrotic. Affected enemies lose 1 action point next turn." },
          { range: { min: 15, max: 15 }, customName: "Primal Regeneration", effect: "The released fury heals you. Heal 2d8 + constitution. Self damage negated. Gain +2d6 Rage." },
          { range: { min: 16, max: 16 }, customName: "Chain Cataclysm", effect: "The impact triggers secondary explosions. 3 random points within 40 ft explode for 3d8 each." },
          { range: { min: 17, max: 17 }, customName: "Berserker Ascension", effect: "The fury elevates you. Instantly enter next Rage State. +4d8 damage. Self damage reduced to 1d6." },
          { range: { min: 18, max: 18 }, customName: "Extinction Level", effect: "Mass extinction force. All non-boss enemies in area below 50% HP are annihilated. Others take +5d10 damage." },
          { range: { min: 19, max: 19 }, customName: "Primal Singularity", effect: "The fury creates a momentary singularity. All creatures in 30 ft are pulled to center. Those at center take 8d10 damage. Area becomes permanently devastated." },
          { range: { min: 20, max: 20 }, customName: "End of the Primal Age", effect: "The world ends and begins again. 40 ft radius. 12d10 damage to all. Terrain permanently reshaped. Non-boss enemies below 75% are annihilated. You heal to full HP. Gain Apocalypse State regardless of Rage. Self damage negated." },
        ],
      },
    },

    {
      id: "berserk_veterans_resolve",
      name: "Veteran's Resolve",
      description:
        "Channel brutal combat experience, hardening strikes with deadly precision for 3 rounds. This fury demands aggression—if you don't attack on your turn, the effect ends.",
      level: 9,
      spellType: "ACTION",
      icon: "General/Rage",

      typeConfig: {
        school: "bludgeoning",
        icon: "General/Rage",
        tags: ["buff", "damage", "obliteration"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },

      resourceCost: {
        resourceTypes: ["mana", "rage_state", "rage_cost"],
        resourceValues: { mana: 0, rage_state: "Obliteration", rage_cost: 60 },
        actionPoints: 3,
        components: ["verbal", "somatic"],
        verbalText: "I WILL NOT YIELD!",
        somaticText: "Focus your fury into controlled devastation",
      },

      resolution: "NONE",
      effectTypes: ["buff"],

      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          {
            id: "veterans_resolve",
            name: "Veteran's Resolve",
            description:
              "Gain +8 damage bonus for 3 rounds. Effect ends immediately if you do not attack on your turn",
            statModifier: {
              stat: "damage",
              magnitude: 8,
              magnitudeType: "flat",
            },
          },
        ],
        durationValue: 3,
        durationType: "rounds",
        durationUnit: "rounds",
        concentrationRequired: false,
        canBeDispelled: false,
        conditionalEnd: "Must attack each turn or effect ends",
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 5 },

      tags: ["buff", "damage", "obliteration", "berserker"],
    },

    {
      id: "berserk_bloodrage_frenzy",
      name: "Bloodrage Frenzy",
      description:
        "Toggle a blood-soaked frenzy where wounds you inflict heal your body. Each round maintained increases the exhausting toll taken when you finally emerge from this savage state.",
      level: 9,
      spellType: "STATE",
      icon: "Necrotic/Blood Skull",

      typeConfig: {
        school: "bludgeoning",
        icon: "Necrotic/Blood Skull",
        tags: ["buff", "healing", "lifesteal", "toggle", "obliteration"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
        toggleable: true,
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },

      resourceCost: {
        resourceTypes: ["mana", "rage_state", "rage_cost"],
        resourceValues: { mana: 0, rage_state: "Obliteration", rage_cost: 50 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "BLOOD FOR BLOOD!",
        somaticText: "Enter a savage blood-fueled state",
      },

      resolution: "NONE",
      effectTypes: ["buff"],

      buffConfig: {
        buffType: "custom",
        customName: "Bloodrage Frenzy",
        customDescription:
          "Heal for 25% of melee damage dealt. When toggled off or after 5 rounds (max), take exhaustion damage equal to 1d8 per round maintained.",
        effects: [
          {
            id: "bloodrage_lifesteal",
            name: "Bloodrage Lifesteal",
            description: "Heal for 25% of melee damage dealt",
            mechanicsText: "25% lifesteal on melee attacks",
            statModifier: {
              stat: "lifesteal",
              magnitude: 25,
              magnitudeType: "percentage",
            },
          },
        ],
        durationValue: 5,
        durationType: "rounds",
        durationUnit: "rounds",
        concentrationRequired: false,
        canBeDispelled: false,
        isToggle: true,
        maxDuration: 5,
        afterEffect: {
          type: "scaling_damage",
          baseFormula: "1d8",
          scaling: "per_round_maintained",
          description: "Exhaustion damage scales with rounds maintained",
          damageFormula: "1d8 × rounds",
        },
      },

      mechanicsText:
        "25% lifesteal on melee attacks. Toggle off anytime or auto-ends at 5 rounds. Exhaustion: 1d8 × rounds maintained.",

      rollableTable: {
        enabled: true,
        tableName: "Bloodrage Backlash",
        description: "When the blood frenzy ends, the toll it extracts is never predictable — sometimes merciful, often catastrophic.",
        diceFormula: "1d20",
        resolutionType: "DICE",
        resolutionConfig: { diceType: "d20" },
        entries: [
          { range: { min: 1, max: 1 }, customName: "Hemorrhagic Collapse", effect: "Your blood vessels rupture. Take 2d8 × rounds maintained instead of 1d8. Stunned for 1 round." },
          { range: { min: 2, max: 3 }, customName: "Severe Exhaustion", effect: "The frenzy nearly killed you. Take 1d10 × rounds maintained. Disadvantage on all rolls for 2 rounds." },
          { range: { min: 4, max: 6 }, customName: "Blood Price", effect: "Normal exhaustion. 1d8 × rounds maintained damage." },
          { range: { min: 7, max: 8 }, customName: "Iron Constitution", effect: "Your body absorbs the shock. Take only 1d6 × rounds maintained." },
          { range: { min: 9, max: 10 }, customName: "Blood Rush", effect: "The frenzy leaves you energized instead of drained. No exhaustion damage. Gain +1d6 Rage." },
          { range: { min: 11, max: 12 }, customName: "Crimson Afterimage", effect: "The blood frenzy lingers as a phantom. Gain +1d4 bonus damage for 2 rounds after ending." },
          { range: { min: 13, max: 13 }, customName: "Blood Echo", effect: "The last enemy you hit during frenzy takes 2d6 necrotic damage as the stolen life reasserts itself." },
          { range: { min: 14, max: 14 }, customName: "Vampiric Residue", effect: "Residual lifesteal persists. Heal for 10% of damage dealt for 1 round after ending." },
          { range: { min: 15, max: 15 }, customName: "Sanguine Shield", effect: "Coagulated blood forms a barrier. Gain a shield equal to rounds maintained × 5. Lasts 1 round." },
          { range: { min: 16, max: 16 }, customName: "Primal Purge", effect: "The blood frenzy purges toxins. Remove all debuffs and negative effects from yourself." },
          { range: { min: 17, max: 17 }, customName: "Blood Gift", effect: "Excess life force flows to allies. All allies within 30 ft heal for 2d8." },
          { range: { min: 18, max: 18 }, customName: "Crimson Awakening", effect: "The frenzy evolves you permanently. For the rest of combat, lifesteal is 10% (no toggle needed)." },
          { range: { min: 19, max: 19 }, customName: "Sanguine Transcendence", effect: "The blood frenzy achieves perfection. No exhaustion damage. Gain permanent +5 HP. Lifesteal 15% for rest of combat." },
          { range: { min: 20, max: 20 }, customName: "Blood God's Chosen", effect: "The Blood God claims you as their vessel. No exhaustion. Full HP restored. Enter next Rage State. All allies within 30 ft gain Bloodrage (15% lifesteal) for 3 rounds. You emit a Terrifying Aura (enemies within 15 ft have -2 to all rolls) for 3 rounds." },
        ],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 4 },

      tags: [
        "buff",
        "healing",
        "lifesteal",
        "toggle",
        "obliteration",
        "berserker",
      ],
    },

    // ========================================
    // LEVEL 10 SPELLS - Ultimate Berserker Abilities
    // ========================================

    {
      id: "berserk_cataclysmic_fury",
      name: "Cataclysmic Fury",
      description:
        "Release every ounce of accumulated rage in a devastating explosion of primal violence. The sheer force of the attack takes a severe toll on your body - you emerge victorious but badly shaken.",
      level: 10,
      spellType: "ACTION",
      icon: "Fire/Fiery Comet",

      typeConfig: {
        school: "bludgeoning",
        icon: "Fire/Fiery Comet",
        tags: ["aoe", "damage", "ultimate", "obliteration"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "circle",
        aoeParameters: { radius: 25 },
        targetRestrictions: ["enemy"],
      },

      resourceCost: {
        resourceTypes: ["mana", "rage_state", "rage_cost"],
        resourceValues: { mana: 0, rage_state: "Obliteration", rage_cost: 90 },
        actionPoints: 4,
        components: ["verbal", "somatic"],
        verbalText: "WITNESS MY FURY!",
        somaticText: "Explode with devastating primal force",
      },

      resolution: "SAVE",
      effectTypes: ["damage"],

      damageConfig: {
        formula: "5d10 + strength",
        damageTypes: ["bludgeoning"],

        savingThrowConfig: {
          enabled: true,
          savingThrowType: "constitution",
          difficultyClass: 18,
          saveOutcome: "half_damage",
        },
        resolution: "DICE",
      },

      selfDamageConfig: {
        formula: "3d6",

        description:
          "The devastating release of fury takes a severe toll on your body",
      },

      cooldownConfig: {
        cooldownType: "combat",
        cooldownValue: 1,
      },

      tags: [
        "aoe",
        "damage",
        "ultimate",
        "obliteration",
        "berserker",
        "self damage",
      ],

      rollableTable: {
        enabled: true,
        tableName: "Ultimate Cataclysm",
        description: "You pour EVERYTHING into this final explosion of rage. The result is beyond mortal comprehension — a chaos event that reshapes the battlefield forever.",
        diceFormula: "1d20",
        resolutionType: "DICE",
        resolutionConfig: { diceType: "d20" },
        entries: [
          { range: { min: 1, max: 1 }, customName: "Self Obliteration", effect: "The fury annihilates its vessel. Take 8d10 self damage. Enemies take quarter damage. You are Incapacitated for 3 rounds. Rage resets to 0." },
          { range: { min: 2, max: 3 }, customName: "Fading Fury", effect: "The explosion sputters. Half damage to all enemies. You take double self damage (6d6). Gain no Rage." },
          { range: { min: 4, max: 6 }, customName: "Cataclysmic Release", effect: "The fury detonates. Normal effects apply in full." },
          { range: { min: 7, max: 8 }, customName: "Primal Inferno", effect: "The explosion ignites the air. Add 4d8 fire damage. Area becomes a Fire Storm (2d8/round) for 3 rounds." },
          { range: { min: 9, max: 10 }, customName: "Shockwave of Ages", effect: "The blast sends a wave across the battlefield. Radius expands to 40 ft. All affected are pushed to the edge and knocked prone." },
          { range: { min: 11, max: 11 }, customName: "Soul Cataclysm", effect: "The fury tears at the spiritual plane. Add 4d8 necrotic damage. All affected lose their highest remaining ability use." },
          { range: { min: 12, max: 12 }, customName: "Rage Singularity", effect: "The explosion collapses into a point then re-expands. Enemies within 10 ft of center take triple damage. All others take normal damage." },
          { range: { min: 13, max: 13 }, customName: "Dimensional Tear", effect: "The fury breaks reality. A portal opens at the impact point for 1 round. Random enemies within 10 ft are teleported 30 ft in random directions." },
          { range: { min: 14, max: 14 }, customName: "Cataclysm Regeneration", effect: "The released fury heals instead of harms you. Heal to full HP. Self damage negated. Gain +3d8 Rage." },
          { range: { min: 15, max: 15 }, customName: "Extinction Protocol", effect: "The blast targets the weak. All non-boss enemies below 60% HP in 40 ft are slain outright." },
          { range: { min: 16, max: 16 }, customName: "Primal Resonance", effect: "The cataclysm echoes through all allies. All allies within 60 ft gain +4d6 damage on their next attack and are inspired (+2 to all rolls) for 2 rounds." },
          { range: { min: 17, max: 17 }, customName: "Time Fracture", effect: "The blast breaks causality. All affected enemies lose their next turn. You gain an extra turn immediately." },
          { range: { min: 18, max: 18 }, customName: "Godslayer", effect: "The fury threatens the divine. +8d8 damage. Boss enemies take a permanent -2 to all rolls. Non-bosses below 75% are annihilated." },
          { range: { min: 19, max: 19 }, customName: "Cataclysm Rebirth", effect: "From total destruction comes renewal. All enemies take maximum damage (no roll). You heal to full, gain Apocalypse State, and all abilities come off cooldown. Self damage negated." },
          { range: { min: 20, max: 20 }, customName: "Ragnarok Manifest", effect: "THE END OF ALL THINGS. 60 ft radius. ALL creatures take 15d10 unresistable damage. Non-bosses are annihilated regardless of HP. Bosses take a permanent -4 to all rolls. The terrain is permanently obliterated — a scorched void. You are restored to full HP, enter Apocalypse State, gain immunity to all damage for 2 rounds, and all allies within 60 ft gain +4 to all rolls for 3 rounds. The battlefield will never be the same." },
        ],
      },
    },

    {
      id: "berserk_battle_incarnate",
      name: "Battle Incarnate",
      description:
        "Become a living engine of war, your every movement optimized for destruction. While transformed, your Rage State bonuses are replaced by these effects. This state demands total commitment — you cannot retreat or defend, only attack.",
      level: 10,
      spellType: "ACTION",
      icon: "Bludgeoning/Blood Punch",

      typeConfig: {
        school: "bludgeoning",
        icon: "Bludgeoning/Blood Punch",
        tags: ["transformation", "obliteration"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },

      resourceCost: {
        resourceTypes: ["mana", "rage_state", "rage_cost"],
        resourceValues: { mana: 0, rage_state: "Obliteration", rage_cost: 80 },
        actionPoints: 4,
        components: ["verbal", "somatic"],
        verbalText: "I AM WAR ITSELF!",
        somaticText: "Transform into a perfect instrument of violence",
      },

      resolution: "NONE",
      effectTypes: ["transformation"],

      transformationConfig: {
        transformationType: "physical",
        targetType: "self",
        duration: 3,
        durationUnit: "rounds",
        power: "major",
        newForm: "Battle Incarnate",
        description:
          "Become a perfect instrument of violence. Rage State bonuses are replaced by these effects while transformed.",
        grantedAbilities: [
          {
            id: "incarnate_damage",
            name: "+6 Damage Bonus",
            description: "+6 bonus damage on all attacks",
          },
          {
            id: "incarnate_advantage",
            name: "Combat Advantage",
            description: "Advantage on all melee attack rolls",
          },
          {
            id: "incarnate_restrictions",
            name: "Total Commitment",
            description:
              "Cannot take defensive actions, disengage, or move away from enemies",
          },
        ],
      },

      cooldownConfig: {
        cooldownType: "combat",
        cooldownValue: 1,
      },

      tags: ["transformation", "obliteration", "berserker"],

      rollableTable: {
        enabled: true,
        tableName: "War Incarnate Chaos",
        description: "Your transformation into a living engine of war has unpredictable effects on reality — the battlefield warps around your newfound perfection of violence.",
        diceFormula: "1d20",
        resolutionType: "DICE",
        resolutionConfig: { diceType: "d20" },
        entries: [
          { range: { min: 1, max: 1 }, customName: "Weapon Breaks", effect: "Your weapon cannot withstand the fury. It shatters. You fight unarmed for the duration (1d8 damage instead of weapon damage)." },
          { range: { min: 2, max: 3 }, customName: "Friendly Fire Risk", effect: "Your strikes are indiscriminate. 25% chance each attack hits a random adjacent ally instead of the target." },
          { range: { min: 4, max: 6 }, customName: "Perfect War Machine", effect: "The transformation is flawless. Normal effects apply." },
          { range: { min: 7, max: 8 }, customName: "Accelerated Violence", effect: "Your speed is terrifying. Gain +1 extra action point per round for the duration." },
          { range: { min: 9, max: 10 }, customName: "Aura of Carnage", effect: "Your mere presence wounds. All enemies within 10 ft take 1d8 damage at the start of each of your turns." },
          { range: { min: 11, max: 11 }, customName: "Blade Storm", effect: "Every attack hits all enemies within melee range. No additional action cost." },
          { range: { min: 12, max: 12 }, customName: "Iron Constitution", effect: "Your body becomes living metal. Gain +4 Armor for the duration. Immune to bleeding and poison." },
          { range: { min: 13, max: 13 }, customName: "Bloodlust Unending", effect: "Each kill during transformation heals you for 2d8 and extends duration by 1 round." },
          { range: { min: 14, max: 14 }, customName: "Terrifying Momentum", effect: "Each consecutive hit increases damage by +1d4 (stacking). Resets if you miss." },
          { range: { min: 15, max: 15 }, customName: "Critical Perfection", effect: "Crit range expands to 17-20 during transformation. Crits deal +2d8 extra damage." },
          { range: { min: 16, max: 16 }, customName: "Unstoppable Advance", effect: "You cannot be stopped. Immune to all movement-impairing effects. Gain +15 ft movement." },
          { range: { min: 17, max: 17 }, customName: "War God's Blessing", effect: "Divine power surges through you. All attacks deal an additional 2d8 radiant damage." },
          { range: { min: 18, max: 18 }, customName: "Avatar of War", effect: "You become a colossus. Double in size. +4 damage becomes +8. Reach extends to 15 ft. All melee hits affect a 10 ft area." },
          { range: { min: 19, max: 19 }, customName: "Eternal Combatant", effect: "The transformation sustains itself. Duration becomes 'until combat ends.' No drain afterward." },
          { range: { min: 20, max: 20 }, customName: "War Itself", effect: "You ARE war. Duration 5 rounds. +12 damage (replaces +6). Crit range 16-20. Every attack generates +1d8 Rage. All melee attacks cleave all enemies in range. When transformation ends, all enemies within 30 ft take 5d8 damage from the shockwave of your return to mortality." },
        ],
      },
    },

    {
      id: "berserk_primal_apex",
      name: "Primal Apex",
      description:
        "Reach the absolute pinnacle of berserker rage — a state of pure, unthinking violence that few warriors ever achieve. All enemies within sight tremble. While transformed, your Rage State bonuses are replaced by these effects. The transformation is overwhelming, leaving you temporarily drained when it ends.",
      level: 10,
      spellType: "ACTION",
      icon: "General/Fiery Rage",

      typeConfig: {
        school: "bludgeoning",
        icon: "General/Fiery Rage",
        tags: ["transformation", "obliteration"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },

      resourceCost: {
        resourceTypes: ["mana", "rage_state", "rage_cost"],
        resourceValues: { mana: 0, rage_state: "Obliteration", rage_cost: 100 },
        actionPoints: 4,
        components: ["verbal", "somatic"],
        verbalText: "UNSTOPPABLE!",
        somaticText: "Achieve the primal apex of berserker fury",
      },

      resolution: "NONE",
      effectTypes: ["transformation"],

      transformationConfig: {
        transformationType: "physical",
        targetType: "self",
        duration: 3,
        durationUnit: "rounds",
        power: "major",
        newForm: "Primal Apex",
        description:
          "Reach the absolute pinnacle of berserker rage, transcending mortal limits. Rage State bonuses are replaced by these effects while transformed.",
        grantedAbilities: [
          {
            id: "apex_damage",
            name: "+12 Damage Bonus",
            description: "All attacks deal +12 additional damage",
          },
          {
            id: "apex_resistance",
            name: "Primal Resilience",
            description: "50% damage resistance while transformed",
          },
          {
            id: "apex_immunity",
            name: "Condition Immunity",
            description: "Immune to all conditions while transformed",
          },
          {
            id: "apex_exhaustion",
            name: "Exhaustion (On End)",
            description: "Take exhaustion damage when transformation ends",
            damageFormula: "2d8",
          },
        ],
      },

      cooldownConfig: {
        cooldownType: "combat",
        cooldownValue: 1,
      },

      tags: [
        "buff",
        "transformation",
        "obliteration",
        "berserker",
        "self damage",
      ],

      rollableTable: {
        enabled: true,
        tableName: "Apex Predator Chaos",
        description: "At the absolute pinnacle of berserker rage, you touch something primal and terrible. The effects ripple through all nearby life forms, reshaping fate itself.",
        diceFormula: "1d20",
        resolutionType: "DICE",
        resolutionConfig: { diceType: "d20" },
        entries: [
          { range: { min: 1, max: 1 }, customName: "Primal Regression", effect: "You devolve into a mindless beast. Lose all class abilities for the duration. Attack randomly (GM picks target). Take 4d8 self damage when transformation ends." },
          { range: { min: 2, max: 3 }, customName: "Feral Overload", effect: "The power is too much. Transformation lasts only 1 round. Take 3d8 exhaustion damage when it ends." },
          { range: { min: 4, max: 6 }, customName: "Primal Perfection", effect: "The apex state achieves balance. Normal effects apply." },
          { range: { min: 7, max: 8 }, customName: "Predator's Mark", effect: "Your gaze marks prey. Designate one target — all attacks against them have advantage and deal +2d8 damage for the duration." },
          { range: { min: 9, max: 10 }, customName: "Apex Regeneration", effect: "Your body regenerates at supernatural speed. Heal 2d8 HP at the start of each turn during transformation." },
          { range: { min: 11, max: 11 }, customName: "Pack Leader", effect: "Your apex state empowers allies. All allies within 30 ft gain +2d4 damage and advantage on their next attack." },
          { range: { min: 12, max: 12 }, customName: "Territorial Dominance", effect: "You claim the battlefield. All enemies within 30 ft must make DC 18 Spirit save or be Frightened for the duration." },
          { range: { min: 13, max: 13 }, customName: "Primal Senses", effect: "Your senses become supernatural. Cannot be surprised. Always know enemy positions. Immune to Blinded/Deafened. +4 to initiative." },
          { range: { min: 14, max: 14 }, customName: "Apex Speed", effect: "You move like lightning. Double movement speed. Can take a bonus action to make an additional attack each turn." },
          { range: { min: 15, max: 15 }, customName: "Flesh of the Ancients", effect: "Your body becomes prehistoric armor. Resistance to ALL damage for the duration. No exhaustion damage when transformation ends." },
          { range: { min: 16, max: 16 }, customName: "Devouring Maw", effect: "Your attacks consume life. 50% lifesteal on all attacks during transformation. Killing a target extends duration by 1 round." },
          { range: { min: 17, max: 17 }, customName: "Primal Command", effect: "Your apex presence dominates lesser beings. Once per round, command one non-boss enemy to flee (no save) as a free action." },
          { range: { min: 18, max: 18 }, customName: "Apex Catalyst", effect: "The transformation catalyzes your Rage. At the end of transformation, instead of exhaustion, gain permanent +2 damage for the rest of combat." },
          { range: { min: 19, max: 19 }, customName: "Berserker God", effect: "You ascend beyond mortal limits. Duration 5 rounds. +16 damage (replaces +12). 75% damage resistance. All melee hits are automatic crits on 18-20. When it ends, take only 1d8 exhaustion damage (not 2d8). All allies gain Inspiration." },
          { range: { min: 20, max: 20 }, customName: "Apex of Existence", effect: "You become the APEX OF ALL BERSERKERS. Duration: rest of combat. +20 damage. 80% damage resistance. Crit range 15-20. All melee attacks hit every enemy in range. Immune to ALL conditions. Every kill grants +2d8 Rage and heals you for 3d8. ALL allies within 60 ft gain +4 damage and are immune to Fear. When combat ends, you collapse (Incapacitated for 1 minute) but suffer no permanent damage. Legends will be written about this moment." },
        ],
      },
    },
  ],

  // Spell pools for level-based spell selection
  spellPools: {
    1: ["berserk_basic_strike", "berserk_defensive_stance", "berserk_rage_tap"],
  },
};
