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
  damageTypes: ['slashing', 'bludgeoning'],

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
- Smoldering (0-20): Building phase, basic abilities only
- Frenzied (21-40): +1 attack, +5 ft movement, initial power unlock
- Primal (41-60): +2 attack, +10 ft movement, +1d4 bonus damage, first real power spike
- Carnage (61-80): +3 attack, +15 ft movement, +1d6 bonus damage, 25% damage resistance, elite combat form
- Cataclysm (81-100): +4 attack, +20 ft movement, +1d8 bonus damage, 50% damage resistance, immune to fear & stun
- Obliteration (101+): +5 attack, +25 ft movement, +2d6 bonus damage, 50% damage resistance, immune to all conditions, MUST SPEND OR OVERHEAT

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

*Your vision starts to tinge red. Veins bulge in your neck and arms. You let out a guttural roar that echoes through the arena. The crowd goes wild. You've entered the Frenzied State—you now have +1 to all attack rolls and +5 ft movement.*

**Turn 3 - Ascending Wrath (Rage: 23 → 47)**

*The third pit fighter hesitates. He sees the fury in your eyes. Smart man. Won't save him.*

**Action**: Frenzied Slash (Rage ability) on pit fighter #1 → CRITICAL HIT!
**Rage Generation**: Roll 2d6 → [5, 6] = 11 → Gain 11 Rage (now at 34)
**Result**: Pit fighter #1 drops, blood spraying across the sand
**Rage Generation**: Defeated enemy → Roll 1d8 → [8] → Gain 8 Rage (now at 42)

**Action**: Charge pit fighter #2 → Hit!
**Rage Generation**: Roll 1d6 → [5] → Gain 5 Rage (now at 47)

**Current Rage: 47** (Primal State - UNLOCKED!)

*Something primal awakens inside you. Your muscles swell beyond natural limits. Blood from your wounds seems to flow backward, sealing cuts through sheer force of will. You've unlocked Bloodlust—you now regenerate health each turn. +2 to attack, +10 ft movement, +1d4 bonus damage. The crowd's roar fades to a dull hum. All you hear is your heartbeat. All you see is prey.*

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

*Your body is a weapon. Your axe is just an extension of your will. You've reached Carnage State—+3 to attack rolls, +15 ft movement, +1d6 bonus damage, 25% damage resistance. The last pit fighter drops his weapon and runs. The crowd screams for you to finish him.*

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

*You're at the peak. Your body is beyond mortal limits. +4 to attack rolls, +20 ft movement, +1d8 bonus damage, 50% damage resistance, immune to fear and stun. But you're approaching the edge. Two more points and you'll hit Obliteration. Three more and you risk Overheat.*

**Turn 6 - Controlled Destruction (Rage: 98 → 75)**

*You need to spend this Rage NOW or it will consume you.*
**Action**: Cataclysmic Blow (ultimate Rage ability)

**Rage Cost**: Spend 30 Rage (now at 68)
**Effect**: 3d8 + strength + 2d6 damage + knockback + stun
**Result**: Arena Master is staggered, armor cracked, bleeding heavily

*You feel the fury drain from you like water from a broken dam. Your vision clears slightly. Your muscles ache. But you're still in Carnage State (68 Rage), still dangerous.*

**Action**: Attack while he's stunned → Hit!
**Rage Generation**: Roll 1d6 → [3] → Gain 3 Rage (now at 71)
**Action**: Second attack → Hit!
**Rage Generation**: Roll 1d6 → [4] → Gain 4 Rage (now at 75)
**Result**: Arena Master falls to his knees, defeated

*You stand over him, axe raised. The crowd chants your name. Your Rage slowly begins to decay (75 → 70 → 65...), but the battle is won.*

**The Lesson**: The Berserker is about riding the wave of fury—building it through aggression, spending it before it consumes you, and knowing when to unleash your most devastating abilities. You're not just managing a resource; you're wrestling with a beast inside you that wants to break free.`
    }
  },

  // Resource System
  resourceSystem: {
    title: 'Rage States',
    subtitle: 'Escalating Fury Mechanic',

    description: `Rage is a pressure gauge, not a savings account. It builds through aggression, decays through passivity, and unlocks escalating power as it climbs through six states. The goal is to ride the wave — keep Rage high, spend it before it explodes, and ride the edge of Obliteration.`,

    cards: [
      {
        title: 'Rage (2d10)',
        stats: '0-100 Scale',
        details: 'A pressure gauge, not a mana pool. Climbs through 6 escalating states as you fight. Passivity decays it. Hitting 101+ without spending triggers Overheat.'
      }
    ],

    generationTable: {
      headers: ['Trigger', 'Rage Change', 'Notes'],
      rows: [
        ['Successful Attack (Hit)', '+1d6', 'Core generation loop'],
        ['Critical Hit', '+2d6', 'Major spike — watch for Overheat at high Rage'],
        ['Taking Damage', '+1d4', 'Pain fuels the fury'],
        ['Defeating an Enemy', '+1d8', 'Bloodlust surge'],
        ['No Rage action taken', '-5 per round', 'Passivity is punished'],
        ['Spending an ability', '-Ability Cost', 'Spending prevents Overheat and unleashes power'],
        ['Overheat (101+, unspent)', '→ Reset to 0', '2d6 self-damage, lose all State bonuses']
      ]
    },

    usage: {
      momentum: 'Ability costs range 5–100 Rage. Spending brings you back down through States — time it to maximize your current State bonuses before dropping.',
      flourish: '⚠️ Overheat: Exceed 101 Rage without spending within 1 round → 2d6 damage, Rage resets to 0. Advanced tactic: push to 101 intentionally to access Obliterating Strike, then spend immediately.'
    },

    overheatRules: {
      title: 'Overheat',
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
Pushing past 101 deliberately to access Obliterating Strike or Wrath of the Berserker is viable. You take the 2d6 hit, but the payoff can end the fight. Use it when you're confident or desperate.`
    },
    
    rageStatesTable: {
      title: 'Rage States & Abilities',
      headers: ['Rage State', 'Rage Range', 'Unlocked Abilities', 'State Benefits'],
      rows: [
        ['Smoldering', '0-20', 'Basic Strike, Defensive Stance, Rage Tap', 'No bonuses'],
        ['Frenzied', '21-40', 'Frenzied Slash, War Cry, Bloodthirst', '+1 attack, +5 ft movement'],
        ['Primal', '41-60', 'Primal Roar, Bloodlust, Savage Leap', '+2 attack, +10 ft movement, +1d4 bonus damage'],
        ['Carnage', '61-80', 'Carnage Strike, Raging Defense, Intimidating Presence', '+3 attack, +15 ft movement, +1d6 bonus damage, 25% damage resistance'],
        ['Cataclysm', '81-100', 'Cataclysmic Blow, Unstoppable Force', '+4 attack, +20 ft movement, +1d8 bonus damage, 50% damage resistance, immune to fear & stun'],
        ['Obliteration', '101+', 'Obliterating Strike, Wrath of the Berserker', '+5 attack, +25 ft movement, +2d6 bonus damage, 50% damage resistance, immune to all conditions — MUST SPEND OR OVERHEAT']
      ]
    },
    

    strategicConsiderations: {
      title: 'Combat Phases & Decision-Making',
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

→ **Best default**: Option A. Boss at 40% is within one massive hit. Cash in the fury.`
    },

    playingInPerson: {
      title: 'Playing in Person',
      subtitle: 'Physical Tracking for Tabletop Play',
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
- **Intentional Overheat**: If at 90+ and holding Obliterating Strike — go for the crit, push past 101, spend immediately. That's Berserker mastery.`
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
        icon: 'Utility/Empowered Warrior',
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
        icon: 'Utility/Shield',
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
          'Rage Armor: Armor increases with Rage State'
        ],

        specPassive: {
          name: 'Juggernaut Resilience',
          description: 'Rage Decay reduced by 50%. Gain damage resistance equal to 5% per Rage State (max 30% at Obliteration).'
        }
      },
      {
        id: 'warlord',
        name: 'Warlord',
        icon: 'Utility/Powerful Warrior',
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
      description: 'Channel your inner fury into a devastating melee strike. Each successful hit feeds the beast within, building your rage and bringing you closer to unleashing your full power.',
      level: 1,
      spellType: 'ACTION',
      icon: 'Slashing/Cross Slash',

      typeConfig: {
        school: 'bludgeoning',
        icon: 'Slashing/Cross Slash',
        tags: ['melee', 'damage', 'rage generation', 'starter'],
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
        somaticText: 'Swing with controlled fury, rage building with each motion'
      },

      resolution: 'DICE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '1d8 + strength',
        elementType: 'bludgeoning',
        damageType: 'direct',
        description: 'A brutal strike driven by growing rage. Each hit feeds the fury within, escalating your power with every blow.'
      },

      cooldownConfig: {
        type: 'none'
      },

      tags: ['melee', 'damage', 'rage generation', 'starter', 'berserker']
    },

    {
      id: 'berserk_defensive_stance',
      name: 'Defensive Stance',
      description: 'Brace yourself in an unbreakable defensive posture. Your fury hardens your resolve, turning every attack against you into fuel for your rage. Only one stance can be active at a time.',
      level: 1,
      spellType: 'PASSIVE',
      icon: 'Utility/Deflecting Shield',

      typeConfig: {
        school: 'bludgeoning',
        icon: 'Utility/Deflecting Shield',
        tags: ['defense', 'buff', 'rage generation', 'stance', 'toggleable', 'starter'],
        toggleable: true,
        exclusiveGroup: 'berserker_stance'
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

      tags: ['defense', 'buff', 'rage generation', 'stance', 'toggleable', 'starter', 'berserker']
    },

    {
      id: 'berserk_rage_tap',
      name: 'Rage Tap',
      description: 'Awaken the beast within through primal fury. Your attacks grow more ferocious, and every strike feeds the storm of rage inside you. Only one stance can be active at a time.',
      level: 1,
      spellType: 'PASSIVE',
      icon: 'Slashing/Bloody Slash',

      typeConfig: {
        school: 'bludgeoning',
        icon: 'Slashing/Bloody Slash',
        tags: ['buff', 'rage generation', 'damage', 'stance', 'toggleable', 'starter'],
        toggleable: true,
        exclusiveGroup: 'berserker_stance'
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
          description: '+1d4 bonus damage on all attacks',
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

      tags: ['buff', 'rage generation', 'damage', 'stance', 'toggleable', 'starter', 'berserker']
    },

    // ========================================
    // LEVEL 2 SPELLS - Enhanced Abilities
    // ========================================

    {
      id: 'berserk_frenzied_slash',
      name: 'Frenzied Slash',
      description: 'Unleash a whirlwind of savage strikes fueled by primal fury. Each hit feeds your rage, and devastating blows ignite enemies with burning fury. Critical hits send enemies flying.',
      level: 2,
      spellType: 'ACTION',
      icon: 'Slashing/Cleave',

      typeConfig: {
        school: 'bludgeoning',
        icon: 'Slashing/Cleave',
        tags: ['melee', 'damage', 'rage generation', 'frenzied'],
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
        resourceTypes: ['mana', 'rage_state', 'rage_cost'],
        resourceValues: { mana: 0, rage_state: 'Frenzied', rage_cost: 8 },
        actionPoints: 1,
        components: ['somatic'],
        somaticText: 'Unleash a whirlwind of savage strikes, vision red with fury'
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
        description: 'The frenzied slash tears into your enemy with savage brutality, driven by pure rage. Devastating hits can ignite enemies with burning fury.'
      },

      cooldownConfig: {
        type: 'none'
      },

      tags: ['melee', 'damage', 'rage generation', 'frenzied', 'berserker']
    },

    {
      id: 'berserk_war_cry',
      name: 'War Cry',
      description: 'Unleash a thunderous war cry that creates visible shockwaves, battering nearby enemies with concussive force while igniting your allies\' fighting spirit with primal fury.',
      level: 2,
      spellType: 'ACTION',
      icon: 'Utility/Overlords Command',

      typeConfig: {
        school: 'bludgeoning',
        icon: 'Utility/Overlords Command',
        tags: ['buff', 'aoe', 'support', 'rage generation', 'frenzied'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingMode: 'effect',
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'circle',
        aoeParameters: { radius: 30 },
        targetRestrictions: ['ally', 'enemy']
      },

      effectTargeting: {
        buff: {
          targetingType: 'area',
          rangeType: 'self_centered',
          aoeShape: 'circle',
          aoeParameters: { radius: 30 },
          targetRestrictions: ['ally']
        },
        damage: {
          targetingType: 'area',
          rangeType: 'self_centered',
          aoeShape: 'circle',
          aoeParameters: { radius: 30 },
          targetRestrictions: ['enemy']
        }
      },

      resourceCost: {
        resourceTypes: ['mana', 'rage_state', 'rage_cost'],
        resourceValues: { mana: 0, rage_state: 'Frenzied', rage_cost: 10 },
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
          description: 'Gain +2 to attack rolls',
          statModifier: {
            stat: 'attack',
            magnitude: 2,
            magnitudeType: 'flat'
          }
        }, {
          id: 'war_cry_morale',
          name: 'War Morale',
          description: 'Allies gain +1d4 bonus damage',
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
        elementType: 'bludgeoning',
        damageType: 'direct',
        description: 'Concussive sonic force batters nearby enemies.'
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 2
      },

      tags: ['buff', 'aoe', 'support', 'rage generation', 'frenzied', 'berserker']
    },

    {
      id: 'berserk_bloodthirst',
      name: 'Bloodthirst',
      description: 'Strike your foe with ravenous hunger, drinking deep of their life essence. The more damage you deal, the more you heal. Critical hits drain so fiercely that enemies are visibly weakened.',
      level: 2,
      spellType: 'ACTION',
      icon: 'Necrotic/Drain Soul',

      typeConfig: {
        school: 'bludgeoning',
        icon: 'Necrotic/Drain Soul',
        tags: ['healing', 'self sustain', 'rage generation', 'frenzied'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingMode: 'effect',
      targetingConfig: {
        targetingType: 'single',
        rangeType: 'melee',
        rangeDistance: 5,
        targetRestrictions: ['enemy']
      },

      effectTargeting: {
        damage: {
          targetingType: 'single',
          rangeType: 'melee',
          rangeDistance: 5,
          targetRestrictions: ['enemy']
        },
        healing: {
          targetingType: 'self'
        }
      },

      resourceCost: {
        resourceTypes: ['mana', 'rage_state', 'rage_cost'],
        resourceValues: { mana: 0, rage_state: 'Frenzied', rage_cost: 5 },
        actionPoints: 1,
        components: ['somatic'],
        somaticText: 'Strike with dark energy, draining life force as red mist flows into you'
      },

      resolution: 'DICE',
      effectTypes: ['damage', 'healing'],

      damageConfig: {
        formula: '1d6 + strength',
        elementType: 'slashing',
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
          customEffects: ['bleeding'],
          bleedingConfig: {
            damagePerRound: '1d4',
            duration: 2,
            durationUnit: 'rounds',
            saveDC: 14,
            saveType: 'constitution'
          }
        },
        description: 'Tears into your enemy with savage force, opening wounds that bleed freely while siphoning their vitality into yourself.'
      },

      healingConfig: {
        formula: 'damageDealt / 2',
        healingType: 'direct',
        description: 'Stolen life force flows through you, closing wounds and restoring strength.'
      },

      cooldownConfig: {
        type: 'none'
      },

      tags: ['melee', 'damage', 'healing', 'self sustain', 'rage generation', 'frenzied', 'berserker']
    },

    {
      id: 'berserk_adrenaline_rush',
      name: 'Adrenaline Rush',
      description: 'Flood your body with adrenaline, gaining an extra action point immediately.',
      level: 2,
      spellType: 'ACTION',
      icon: 'Utility/Speed Boot',

      typeConfig: {
        school: 'bludgeoning',
        icon: 'Utility/Speed Boot',
        tags: ['buff', 'speed', 'rage management', 'frenzied'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      resourceCost: {
        resourceTypes: ['mana', 'rage_state', 'rage_cost'],
        resourceValues: { mana: 0, rage_state: 'Frenzied', rage_cost: 10 },
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

      tags: ['buff', 'speed', 'rage management', 'frenzied', 'berserker']
    },

    // ========================================
    // LEVEL 3 SPELLS - Advanced Abilities
    // ========================================

    {
      id: 'berserk_primal_roar',
      name: 'Primal Roar',
      description: 'Unleash a deafening roar that deals lightning damage and sends enemies fleeing in terror. Constitution save halves damage and negates fear.',
      level: 3,
      spellType: 'ACTION',
      icon: 'Utility/Overlords Command',

      typeConfig: {
        school: 'bludgeoning',
        icon: 'Utility/Overlords Command',
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
        resourceTypes: ['mana', 'rage_state', 'rage_cost'],
        resourceValues: { mana: 0, rage_state: 'Primal', rage_cost: 15 },
        actionPoints: 1,
        components: ['verbal'],
        verbalText: 'RAAAAGH!'
      },

      resolution: 'SAVE',
      effectTypes: ['damage', 'control'],

      damageConfig: {
        formula: '2d6 + strength',
        elementType: 'bludgeoning',
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
            fearStrength: 'moderate',
            saveType: 'constitution',
            saveDC: 14,
            duration: 2,
            durationUnit: 'rounds'
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
      description: 'Channel primal fury into escalating regeneration. Heal instantly, then gain progressively stronger healing over the next 3 rounds.',
      level: 3,
      spellType: 'ACTION',
      icon: 'Necrotic/Drain Soul',

      typeConfig: {
        school: 'bludgeoning',
        icon: 'Necrotic/Drain Soul',
        tags: ['healing', 'hot', 'self sustain', 'primal'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      resourceCost: {
        resourceTypes: ['mana', 'rage_state', 'rage_cost'],
        resourceValues: { mana: 0, rage_state: 'Primal', rage_cost: 12 },
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

      tags: ['healing', 'hot', 'self sustain', 'primal', 'berserker']
    },

    {
      id: 'berserk_savage_leap',
      name: 'Savage Leap',
      description: 'Leap through the air with primal fury, crashing down on enemies in a devastating impact that stuns those caught in the blast.',
      level: 3,
      spellType: 'ACTION',
      icon: 'Utility/Upward Jump',

      typeConfig: {
        school: 'bludgeoning',
        icon: 'Utility/Upward Jump',
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
        resourceTypes: ['mana', 'rage_state', 'rage_cost'],
        resourceValues: { mana: 0, rage_state: 'Primal', rage_cost: 15 },
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
          config: {
            saveType: 'constitution',
            saveDC: 15,
            duration: 1,
            durationUnit: 'rounds'
          }
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
      icon: 'Utility/Dash',

      typeConfig: {
        school: 'bludgeoning',
        icon: 'Utility/Dash',
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
        resourceTypes: ['mana', 'rage_state', 'rage_cost'],
        resourceValues: { mana: 0, rage_state: 'Primal', rage_cost: 12 },
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
            distance: 10,
            saveType: 'strength',
            saveDC: 14
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
      description: 'A devastating strike that can send enemies flying, stun them, and leave them bleeding on devastating hits. Powerful hits may also inflict fear.',
      level: 4,
      spellType: 'ACTION',
      icon: 'Slashing/Sword Strike',

      typeConfig: {
        school: 'bludgeoning',
        icon: 'Slashing/Sword Strike',
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
        resourceTypes: ['mana', 'rage_state', 'rage_cost'],
        resourceValues: { mana: 0, rage_state: 'Carnage', rage_cost: 20 },
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
        value: 2
      },

      tags: ['melee', 'damage', 'carnage', 'berserker']
    },

    {
      id: 'berserk_raging_defense',
      name: 'Raging Defense',
      description: 'Your fury becomes a shield. Gain resistance to all damage and regenerate Rage when attacked.',
      level: 4,
      spellType: 'ACTION',
      icon: 'Utility/Shield',

      typeConfig: {
        school: 'bludgeoning',
        icon: 'Utility/Shield',
        tags: ['defense', 'resistance', 'buff', 'carnage'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      resourceCost: {
        resourceTypes: ['mana', 'rage_state', 'rage_cost'],
        resourceValues: { mana: 0, rage_state: 'Carnage', rage_cost: 15 },
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
      description: 'Radiate a terrifying aura that causes enemies within 20 feet to flee in panic.',
      level: 4,
      spellType: 'ACTION',
      icon: 'Necrotic/Screaming Skull',

      typeConfig: {
        school: 'bludgeoning',
        icon: 'Necrotic/Screaming Skull',
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
        resourceTypes: ['mana', 'rage_state', 'rage_cost'],
        resourceValues: { mana: 0, rage_state: 'Carnage', rage_cost: 18 },
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
            fearStrength: 'moderate',
            saveType: 'charisma',
            saveDC: 16,
            duration: 2,
            durationUnit: 'rounds'
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
      description: 'Enter a trance of perfect combat awareness, gaining +3 dodge for 2 rounds.',
      level: 4,
      spellType: 'ACTION',
      icon: 'General/Rage',

      typeConfig: {
        school: 'bludgeoning',
        icon: 'General/Rage',
        tags: ['buff', 'dodge', 'carnage'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      resourceCost: {
        resourceTypes: ['mana', 'rage_state', 'rage_cost'],
        resourceValues: { mana: 0, rage_state: 'Carnage', rage_cost: 15 },
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
      description: 'Channel devastating force into a single blow. Can stun, knock back, and disarm on devastating hits.',
      level: 5,
      spellType: 'ACTION',
      icon: 'Bludgeoning/Mortal Strike',

      typeConfig: {
        school: 'bludgeoning',
        icon: 'Bludgeoning/Mortal Strike',
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
        resourceTypes: ['mana', 'rage_state', 'rage_cost'],
        resourceValues: { mana: 0, rage_state: 'Cataclysm', rage_cost: 30 },
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
            durationType: 'rounds',
            recoveryMethod: 'automatic',
            saveType: 'constitution',
            saveDC: 17,
            duration: 2,
            durationUnit: 'rounds'
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
      icon: 'General/Fiery Rage',

      typeConfig: {
        school: 'bludgeoning',
        icon: 'General/Fiery Rage',
        tags: ['buff', 'immunity', 'cataclysm'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      resourceCost: {
        resourceTypes: ['mana', 'rage_state', 'rage_cost'],
        resourceValues: { mana: 0, rage_state: 'Cataclysm', rage_cost: 20 },
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
          level: 'major',
          mechanicsText: 'Immune to all crowd control conditions and forced movement for 1 round'
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
      icon: 'Utility/Powerful Warrior',

      typeConfig: {
        school: 'bludgeoning',
        icon: 'Utility/Powerful Warrior',
        tags: ['buff', 'debuff', 'aoe', 'support', 'cataclysm'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingMode: 'effect',
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'circle',
        aoeParameters: { radius: 30 },
        targetRestrictions: ['ally', 'enemy']
      },

      effectTargeting: {
        buff: {
          targetingType: 'area',
          rangeType: 'self_centered',
          aoeShape: 'circle',
          aoeParameters: { radius: 30 },
          targetRestrictions: ['ally']
        },
        debuff: {
          targetingType: 'area',
          rangeType: 'self_centered',
          aoeShape: 'circle',
          aoeParameters: { radius: 30 },
          targetRestrictions: ['enemy']
        }
      },

      resourceCost: {
        resourceTypes: ['mana', 'rage_state', 'rage_cost'],
        resourceValues: { mana: 0, rage_state: 'Cataclysm', rage_cost: 25 },
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
          description: 'Shakes their resolve, making them less effective in combat.',
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
      icon: 'Fire/Volcanic Erupt',

      typeConfig: {
        school: 'bludgeoning',
        icon: 'Fire/Volcanic Erupt',
        tags: ['aoe', 'damage', 'self damage', 'cataclysm'],
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
        resourceTypes: ['mana', 'rage_state', 'rage_cost'],
        resourceValues: { mana: 0, rage_state: 'Cataclysm', rage_cost: 25 },
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'MY RAGE CONSUMES ALL!',
        somaticText: 'Explode with uncontrollable fury'
      },

      resolution: 'SAVE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '3d6 + strength',
        elementType: 'bludgeoning',
        damageType: 'direct',
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'constitution',
          difficultyClass: 15,
          saveOutcome: 'halves'
        },
        triggerCondition: 'activation',
        triggerDescription: 'Deals 3d6 + strength bludgeoning damage to all enemies within 15 ft'
      },

      selfDamageConfig: {
        formula: '1d6',
        damageType: 'bludgeoning',
        description: 'The uncontrollable eruption of fury damages you as well'
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 4
      },

      tags: ['aoe', 'damage', 'self damage', 'cataclysm', 'berserker']
    },

    // ========================================
    // LEVEL 6 SPELLS - Ultimate Abilities
    // ========================================

    {
      id: 'berserk_obliterating_strike',
      name: 'Obliterating Strike',
      description: 'Unleash a massive explosion of destructive force. Devastating hits can send enemies flying, stun them, and set them ablaze. Must be used immediately or risk Overheat.',
      level: 6,
      spellType: 'ACTION',
      icon: 'Utility/Empowered Warrior',

      typeConfig: {
        school: 'bludgeoning',
        icon: 'Utility/Empowered Warrior',
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
        elementType: 'bludgeoning',
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
      icon: 'General/Rage',

      typeConfig: {
        school: 'bludgeoning',
        icon: 'General/Rage',
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
      icon: 'Utility/Resistance',

      typeConfig: {
        school: 'bludgeoning',
        icon: 'Utility/Resistance',
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
      description: 'Embrace the full power of your fury, transforming into an unstoppable force of destruction. Your body surges with primal energy and supernatural strength.',
      level: 7,
      spellType: 'ACTION',
      icon: 'General/Fiery Rage',

      typeConfig: {
        school: 'bludgeoning',
        icon: 'General/Fiery Rage',
        tags: ['buff', 'transformation', 'damage'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      effectTargeting: {
        transformation: {
          targetingType: 'self',
          rangeType: 'self'
        },
        damage: {
          targetingType: 'area',
          rangeType: 'self_centered',
          aoeShape: 'circle',
          aoeParameters: { radius: 15 },
          targetRestrictions: ['enemy']
        }
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
        triggerDescription: 'Deals 2d6 bludgeoning damage to all enemies within 15 ft when activated'
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
      description: 'Transform into a living cyclone of primal fury, dealing massive AoE damage and knocking enemies down.',
      level: 7,
      spellType: 'ACTION',
      icon: 'Slashing/Whirl',

      typeConfig: {
        school: 'bludgeoning',
        icon: 'Slashing/Whirl',
        tags: ['aoe', 'damage', 'control', 'movement'],
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
          config: {
            saveType: 'strength',
            saveDC: 18,
            pushDistance: 10,
            knockdown: true,
            duration: 1,
            durationUnit: 'rounds'
          }
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

      tags: ['aoe', 'damage', 'control', 'movement', 'obliteration', 'berserker']
    },

    {
      id: 'berserk_blood_frenzy',
      name: 'Blood Frenzy',
      description: 'Enter a blood-fueled frenzy, healing 20 hit points for each enemy you defeat. Your bloodlust becomes a source of life-giving energy.',
      level: 7,
      spellType: 'ACTION',
      icon: 'Necrotic/Blood Skull',

      typeConfig: {
        school: 'bludgeoning',
        icon: 'Necrotic/Blood Skull',
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
      description: 'Unleash apocalyptic fire that consumes everything in a 25-foot radius. Enemies that fail their save are stunned by the shockwave.',
      level: 8,
      spellType: 'ACTION',
      icon: 'Fire/Dripping Lava',

      typeConfig: {
        school: 'bludgeoning',
        icon: 'Fire/Dripping Lava',
        tags: ['aoe', 'damage', 'fire', 'control'],
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
        elementType: 'bludgeoning',
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
            durationType: 'rounds',
            recoveryMethod: 'automatic',
            saveType: 'constitution',
            saveDC: 19,
            duration: 2,
            durationUnit: 'rounds'
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

      tags: ['aoe', 'damage', 'fire', 'control', 'obliteration', 'berserker']
    },

    {
      id: 'berserk_immortal_rage',
      name: 'Immortal Rage',
      description: 'Your fury transcends death itself, granting immortality for 3 rounds. You become immune to death and all lethal damage, but the strain is immense.',
      level: 8,
      spellType: 'ACTION',
      icon: 'Necrotic/Screaming Skull',

      typeConfig: {
        school: 'bludgeoning',
        icon: 'Necrotic/Screaming Skull',
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
          level: 'extreme',
          mechanicsText: 'Cannot die or take lethal damage for 3 rounds. HP cannot drop below 1.'
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
      id: 'berserk_earthshaker_slam',
      name: 'Earthshaker Slam',
      description: 'Slam both fists into the ground with enough force to crack the earth, dragging enemies toward you and burying them under debris.',
      level: 8,
      spellType: 'ACTION',
      icon: 'Bludgeoning/Mortal Strike',

      typeConfig: {
        school: 'bludgeoning',
        icon: 'Bludgeoning/Mortal Strike',
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
        components: ['somatic'],
        somaticText: 'Slam fists into the earth with devastating force'
      },

      resolution: 'SAVE',
      effectTypes: ['damage', 'control'],

      damageConfig: {
        formula: '4d6 + strength + 3d6',
        elementType: 'bludgeoning',
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
          name: 'Ground Drag',
          description: 'The shockwave drags enemies toward the impact point',
          config: {
            movementType: 'pull',
            distance: 20,
            saveType: 'constitution',
            saveDC: 19
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
      icon: 'Arcane/Missile',

      typeConfig: {
        school: 'bludgeoning',
        icon: 'Arcane/Missile',
        tags: ['aoe', 'damage', 'obliteration'],
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
            recoveryMethod: 'stand_action',
            saveType: 'strength',
            saveDC: 18
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

      tags: ['aoe', 'damage', 'obliteration', 'berserker', 'self damage']
    },

    {
      id: 'berserk_veterans_resolve',
      name: 'Veteran\'s Resolve',
      description: 'Channel brutal combat experience, hardening strikes with deadly precision for 3 rounds. This fury demands aggression—if you don\'t attack on your turn, the effect ends.',
      level: 9,
      spellType: 'ACTION',
      icon: 'General/Rage',

      typeConfig: {
        school: 'bludgeoning',
        icon: 'General/Rage',
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
          description: 'Gain +8 damage bonus for 3 rounds. Effect ends immediately if you do not attack on your turn',
          statModifier: {
            stat: 'damage',
            magnitude: 8,
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
      description: 'Toggle a blood-soaked frenzy where wounds you inflict heal your body. Each round maintained increases the exhausting toll taken when you finally emerge from this savage state.',
      level: 9,
      spellType: 'STATE',
      icon: 'Necrotic/Blood Skull',

      typeConfig: {
        school: 'bludgeoning',
        icon: 'Necrotic/Blood Skull',
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
        resourceTypes: ['mana', 'rage_state', 'rage_cost'],
        resourceValues: { mana: 0, rage_state: 'Obliteration', rage_cost: 50 },
        actionPoints: 2,
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
        effects: [{
          id: 'bloodrage_lifesteal',
          name: 'Bloodrage Lifesteal',
          description: 'Heal for 25% of melee damage dealt',
          mechanicsText: '25% lifesteal on melee attacks',
          statModifier: {
            stat: 'lifesteal',
            magnitude: 25,
            magnitudeType: 'percentage'
          }
        }],
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
      icon: 'Fire/Fiery Comet',

      typeConfig: {
        school: 'bludgeoning',
        icon: 'Fire/Fiery Comet',
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

      tags: ['aoe', 'damage', 'ultimate', 'obliteration', 'berserker', 'self damage']
    },

    {
      id: 'berserk_battle_incarnate',
      name: 'Battle Incarnate',
      description: 'Become a living engine of war, your every movement optimized for destruction. This state of perfect violence demands total commitment - you cannot retreat or defend, only attack.',
      level: 10,
      spellType: 'ACTION',
      icon: 'Bludgeoning/Blood Punch',

      typeConfig: {
        school: 'bludgeoning',
        icon: 'Bludgeoning/Blood Punch',
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
      description: 'Reach the absolute pinnacle of berserker rage - a state of pure, unthinking violence that few warriors ever achieve. All enemies within sight tremble. The transformation is overwhelming, leaving you temporarily drained when it ends.',
      level: 10,
      spellType: 'ACTION',
      icon: 'General/Fiery Rage',

      typeConfig: {
        school: 'bludgeoning',
        icon: 'General/Fiery Rage',
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
            name: '+12 Damage Bonus',
            description: 'All attacks deal +12 additional damage'
          },
          {
            id: 'apex_resistance',
            name: 'Primal Resilience',
            description: '50% damage resistance while transformed'
          },
          {
            id: 'apex_immunity',
            name: 'Condition Immunity',
            description: 'Immune to all conditions while transformed'
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

      tags: ['buff', 'transformation', 'obliteration', 'berserker', 'self damage']
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

