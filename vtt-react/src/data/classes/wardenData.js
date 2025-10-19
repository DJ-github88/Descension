/**
 * Warden Class Data
 * 
 * Complete class information for the Warden - a relentless hunter inspired by Maiev Shadowsong
 * who wields glaives and embodies vengeful justice through the Vengeance Points system.
 */

export const WARDEN_DATA = {
  id: 'warden',
  name: 'Warden',
  icon: 'fas fa-gavel',
  role: 'Damage/Control',

  // Overview section
  overview: {
    title: 'The Warden',
    subtitle: 'Essence of Vengeance Incarnate',
    
    description: `The Warden embodies the spirit of relentless pursuit and vengeful justice, a hunter who never stops until their quarry is brought to justice. Wielding twin glaives and commanding spectral cages, the Warden controls the battlefield through a combination of mobility, precision strikes, and crowd control. Through the Vengeance Points system, they build power with each successful attack and evasion, channeling that fury into devastating abilities and ultimate transformations. This class rewards aggressive play, tactical marking of targets, and the patient accumulation of vengeance to unleash at critical moments.`,

    roleplayIdentity: {
      title: 'Roleplay Identity',
      content: `Wardens are elite hunters and jailers who have dedicated their lives to pursuing those who have escaped justice. They are relentless, patient, and utterly devoted to their cause. Many Wardens serve as prison keepers, bounty hunters, or executioners, using their abilities to track, capture, and punish the guilty.

**Common Warden Archetypes**:
- **The Jailer**: A prison keeper who uses spectral cages to contain the most dangerous criminals
- **The Bounty Hunter**: A relentless tracker who marks their prey and never stops the pursuit
- **The Executioner**: A vengeful warrior who delivers swift justice to those who have wronged others
- **The Shadow Stalker**: A stealthy assassin who strikes from darkness with deadly precision
- **The Avenger**: A warrior consumed by vengeance, channeling their fury into unstoppable power

**Personality Traits**:
Wardens are typically stoic, determined, and single-minded in their pursuit of justice. They value duty, honor, and retribution. Many carry deep scars from past failures or losses, driving them to never let another criminal escape. They are patient hunters who will wait years for the perfect moment to strike.`
    },

    combatRole: {
      title: 'Combat Role',
      content: `**Primary Role**: Agile damage dealer with crowd control capabilities

**Combat Strengths**:
- Exceptional single-target burst damage
- Strong crowd control through cage abilities
- High mobility with dash and blink abilities
- Vengeance Points provide flexible resource management
- Marked targets take increased damage
- Avatar transformation grants massive power spike

**Combat Weaknesses**:
- Moderate armor (leather wearer)
- Requires VP buildup for ultimate abilities
- Cage abilities can be broken by strong enemies
- Less effective against spread-out enemies
- Dependent on successful attacks for VP generation

**Optimal Positioning**:
Wardens excel at medium range (10-20 feet), using mobility to close gaps and strike marked targets. They should focus on building VP through successful attacks, then spending it strategically on cage abilities or the Avatar transformation.`
    },

    playstyle: {
      title: 'Playstyle & Strategy',
      content: `**Vengeance Points Management**:
The key to mastering the Warden is building and spending Vengeance Points efficiently. Generate VP through successful attacks and evasions, then spend them strategically:

- **1 VP**: Empower next attack (+1d6 damage)
- **2 VP**: Enhanced glaive throw (multi-target)
- **3 VP**: Hunter's Resolve (heal + damage resistance)
- **5 VP**: Cage of Vengeance (trap target)
- **10 VP**: Avatar of Vengeance (ultimate transformation)

**Mark and Hunt**:
Start combat by marking high-priority targets with Mark of the Hunt. This provides:
- +1 VP per attack against marked target (total 2 VP per hit)
- +1d6 damage to marked target
- Tracking ability to sense marked target's location

**Cage Control**:
Use Cage of Vengeance to trap dangerous enemies or prevent escapes:
- Costs 5 VP
- Traps target for 3 rounds
- Prevents movement and teleportation
- Caged enemies take increased damage

**Avatar Transformation**:
Build to 10 VP for the ultimate Avatar of Vengeance:
- Massive stat boost for 4 rounds
- Increased attack speed and damage
- Enhanced VP generation
- Damage resistance

**Evasion and VP Generation**:
Don't just focus on offense - successful dodges generate VP:
- Use Evasive Maneuvers to dodge and gain 1 VP
- Shadowblade spec gains bonus VP from stealth attacks
- Build VP defensively when low on health

**Team Dynamics**:
- Mark priority targets for focused fire
- Use cages to isolate dangerous enemies
- Coordinate Avatar transformation with team burst windows
- Provide crowd control for team safety`
    },

    immersiveCombatExample: {
      title: 'Combat Example: The Relentless Hunter',
      content: `**The Setup**: You're a Warden (Shadowblade specialization) hunting a dangerous criminal and his guards (1 criminal mastermind + 4 elite guards). Your party is with you. Starting VP: 0. Starting Mana: 45/50. Your goal: Mark the criminal, build Vengeance Points through attacks and evasions, then use Avatar of Vengeance to finish him.

**Starting State**: VP: 0/10 | Mana: 45/50 | HP: 65/65 | Marked Target: None

**Turn 1 - Mark of the Hunt (VP: 0 → 2)**

*The criminal mastermind stands surrounded by his guards. You've hunted him for months. Today, justice is served.*

**Your Action (Bonus Action)**: "Mark of the Hunt" on Criminal Mastermind (no cost)
**Effect**: Target is marked. You gain +1 VP per attack against marked target (total 2 VP per hit), deal +1d6 damage to marked target, can sense marked target's location

*You focus on the criminal. A spectral mark appears above his head, visible only to you. He is MARKED.*

**Your Party's Tank**: "What's that symbol above him?"
**You**: "Mark of the Hunt. He's my prey now. I'll gain 2 VP per attack against him instead of 1, and I deal +1d6 damage to him."

**Your Action**: Glaive attack on Criminal Mastermind (marked)
**Attack Roll**: d20+7 → [16] = Hit!
**Base Damage**: 2d6+4 → [6, 5] + 4 = 15 damage
**Mark Bonus**: +1d6 → [5] = +5 damage
**Total Damage**: 15 + 5 = **20 damage**

*Your glaive SLASHES across the criminal's chest. He staggers back.*

**VP Generated**: +2 (marked target) = **2/10**

**Criminal Mastermind**: "You! The Warden! I thought I'd escaped you!"
**You**: "No one escapes justice. I've tracked you for six months. Your hunt ends today."

**Current State**: VP: 2/10 | Mana: 45/50 | HP: 65/65 | Marked: Criminal

**Turn 2 - Building Vengeance (VP: 2 → 5)**

*The guards attack. One swings at you.*

**Elite Guard #1's Turn**: Attacks you
**Attack Roll**: d20+5 → [14] = Hit!
**Damage**: 2d8+3 → [7, 6] + 3 = 16 damage

**Your Reaction**: "Evasive Maneuvers" (no cost, reaction)
**Effect**: Dodge the attack, gain +1 VP

*You TWIST away from the blade. It misses by inches.*

**Damage**: 0 (dodged)
**VP Generated**: +1 (successful evasion) = **3/10**

**Your Party's Rogue**: "You dodged that perfectly!"
**You**: "Evasive Maneuvers. I gain 1 VP when I successfully dodge. I'm at 3 VP now."

**Your Action**: Glaive attack on Criminal Mastermind (marked)
**Attack Roll**: d20+7 → [18] = Hit!
**Base Damage**: 2d6+4 → [5, 6] + 4 = 15 damage
**Mark Bonus**: +1d6 → [6] = +6 damage
**Total Damage**: 15 + 6 = **21 damage**

**VP Generated**: +2 (marked target) = **5/10**

**Criminal Mastermind**: Takes 21 damage → HEAVILY DAMAGED (41 total damage so far)

**Your Action (Bonus Action)**: Spend 1 VP to empower next attack
**Effect**: Next attack deals +1d6 damage

**VP**: 5 - 1 = **4/10**

**Current State**: VP: 4/10 | Mana: 45/50 | HP: 65/65

**Turn 3 - Cage of Vengeance (VP: 4 → 1)**

*The criminal tries to flee. Not on your watch.*

**Criminal Mastermind's Turn**: Attempts to run (Dash action)

**Your Reaction**: "Cage of Vengeance" (5 VP, reaction)
**Effect**: Spectral cage traps target for 3 rounds, prevents movement and teleportation, caged enemies take +1d8 damage from all sources

*Spectral bars ERUPT from the ground, forming a CAGE around the criminal. He's TRAPPED.*

**VP**: 4 - 5 = Would go negative, but you can't spend more VP than you have

*Wait, I need to recalculate. Let me fix this.*

**Actually**: You have 4 VP, Cage costs 5 VP. You need 1 more VP.

**Your Action**: Glaive attack on Criminal Mastermind (marked, empowered from last turn)
**Attack Roll**: d20+7 → [17] = Hit!
**Base Damage**: 2d6+4 → [6, 5] + 4 = 15 damage
**Mark Bonus**: +1d6 → [5] = +5 damage
**Empowered Bonus**: +1d6 → [6] = +6 damage
**Total Damage**: 15 + 5 + 6 = **26 damage**

**VP Generated**: +2 (marked target) = **6/10**

*Now you have 6 VP. The criminal tries to flee.*

**Criminal Mastermind's Turn**: Attempts to run (Dash action)

**Your Reaction**: "Cage of Vengeance" (5 VP)
**Effect**: Spectral cage traps target for 3 rounds

*Spectral bars ERUPT from the ground, forming a CAGE around the criminal. He SLAMS into the bars, trapped.*

**VP**: 6 - 5 = **1/10**

**Criminal Mastermind**: "NO! Let me OUT!"
**You**: "You're caged. Like the criminals you imprisoned in your dungeons. Justice."

**Current State**: VP: 1/10 | Mana: 45/50 | HP: 65/65 | Criminal: Caged (3 rounds)

**Turn 4 - Building to Avatar (VP: 1 → 5)**

*The criminal is caged. The guards attack desperately.*

**Elite Guard #2's Turn**: Attacks you
**Attack Roll**: d20+5 → [13] = Hit!
**Damage**: 2d8+3 → [6, 7] + 3 = 16 damage

**Your Reaction**: Evasive Maneuvers
**Effect**: Dodge, gain +1 VP

**Damage**: 0 (dodged)
**VP**: 1 + 1 = **2/10**

**Your Action**: Glaive attack on Criminal Mastermind (marked, caged)
**Attack Roll**: d20+7 → [19] = Hit!
**Base Damage**: 2d6+4 → [6, 6] + 4 = 16 damage
**Mark Bonus**: +1d6 → [5] = +5 damage
**Cage Bonus**: +1d8 → [7] = +7 damage (caged enemies take extra damage)
**Total Damage**: 16 + 5 + 7 = **28 damage**

**VP Generated**: +2 (marked target) = **4/10**

**Your Action (Bonus Action)**: Glaive Throw (2 VP, hits multiple enemies)
**Effect**: Throw glaive at 2 targets, returns to hand

**VP**: 4 - 2 = **2/10**

**Glaive Throw**: Hits Elite Guard #1 and #2
**Damage to Each**: 2d6+4 → [5, 6] + 4 = **15 damage each**

**VP Generated**: +1 (Guard #1) + 1 (Guard #2) = **+2 VP**
**VP**: 2 + 2 = **4/10**

*Your glaive SPINS through the air, slashing both guards, then returns to your hand.*

**Your Party's Mage**: "Your glaive came back to you!"
**You**: "Glaive Throw. Costs 2 VP, hits multiple targets. I'm building VP for Avatar of Vengeance."

**Current State**: VP: 4/10 | Mana: 45/50 | HP: 65/65

**Turn 5 - Avatar of Vengeance (VP: 4 → 10 → 0)**

*You need 10 VP for Avatar. Time to build.*

**Your Action**: Glaive attack on Criminal Mastermind (marked, caged)
**Attack Roll**: d20+7 → [18] = Hit!
**Base Damage**: 2d6+4 → [6, 5] + 4 = 15 damage
**Mark Bonus**: +1d6 → [6] = +6 damage
**Cage Bonus**: +1d8 → [8] = +8 damage
**Total Damage**: 15 + 6 + 8 = **29 damage**

**VP Generated**: +2 (marked target) = **6/10**

**Elite Guard #3's Turn**: Attacks you
**Your Reaction**: Evasive Maneuvers → Dodge, +1 VP
**VP**: 6 + 1 = **7/10**

**Your Party's Tank**: Attacks Elite Guard #1 → DEAD

**Your Turn (Extra Attack)**: Glaive attack on Criminal Mastermind
**Attack Roll**: d20+7 → [16] = Hit!
**Damage**: 29 damage (similar roll)
**VP Generated**: +2 = **9/10**

**Elite Guard #4's Turn**: Attacks you
**Your Reaction**: Evasive Maneuvers → Dodge, +1 VP
**VP**: 9 + 1 = **10/10** (MAXIMUM!)

**Your Action (Bonus Action)**: "AVATAR OF VENGEANCE" (10 VP, ultimate transformation)
**Effect**: Transform for 4 rounds, gain +4 to all stats, +2d8 damage on attacks, damage resistance, enhanced VP generation

*You ROAR. Spectral energy ERUPTS from your body. Your glaives BLAZE with vengeful power. You become the AVATAR OF VENGEANCE.*

**VP**: 10 - 10 = **0/10** (but Avatar active for 4 rounds)

**Your Party (in awe)**: "What... what ARE you?!"
**You (voice echoing with power)**: "AVATAR OF VENGEANCE. JUSTICE INCARNATE."

**Current State**: VP: 0/10 | Avatar: Active (4 rounds) | Mana: 45/50 | HP: 65/65

**Turn 6 - Avatar's Wrath**

*In Avatar form, you are UNSTOPPABLE.*

**Your Action (Avatar Form)**: Glaive attack on Criminal Mastermind (marked, caged, Avatar bonuses)
**Attack Roll**: d20+11 (+7 base +4 Avatar) → [20] = **CRITICAL HIT!**
**Base Damage**: 4d6+8 (doubled) → [6, 5, 6, 6] + 8 = 31 damage
**Mark Bonus**: 2d6 (doubled) → [5, 6] = 11 damage
**Cage Bonus**: 2d8 (doubled) → [7, 8] = 15 damage
**Avatar Bonus**: 2d8 → [7, 8] = 15 damage
**Total Damage**: 31 + 11 + 15 + 15 = **72 damage!**

*Your glaive BLAZES with spectral fire. The strike is DEVASTATING.*

**Criminal Mastermind**: Takes 72 damage → **DEAD**

**Combat Over**

*The Avatar form fades. The criminal is dead. Justice is served.*

**Your Party's Healer**: "You... you dealt 72 damage in ONE HIT."
**You**: "Avatar of Vengeance. Costs 10 VP, lasts 4 rounds. I had +4 to all stats, +2d8 damage on attacks, and damage resistance. The critical hit doubled everything. Base damage, mark bonus, cage bonus, all doubled. Plus Avatar's +2d8."
**Your Party's Rogue**: "How did you build to 10 VP so fast?"
**You**: "I marked the criminal at the start, so I gained 2 VP per attack against him instead of 1. I dodged attacks with Evasive Maneuvers, gaining 1 VP per dodge. I attacked him 5 times (2 VP each = 10 VP) and dodged 3 times (1 VP each = 3 VP). Total: 13 VP generated, spent 5 VP on Cage of Vengeance and 2 VP on Glaive Throw, leaving me with 6 VP. Then I built the final 4 VP through more attacks and dodges to reach 10 VP for Avatar."

**Final State**: VP: 0/10 | Mana: 45/50 | HP: 65/65

**The Lesson**: Warden gameplay is about:
1. **Mark of the Hunt**: Marked criminal for +2 VP per attack and +1d6 damage
2. **VP Generation**: Built VP through successful attacks (+1 VP, +2 if marked) and evasions (+1 VP)
3. **Cage of Vengeance**: Spent 5 VP to trap criminal, preventing escape and adding +1d8 damage
4. **Glaive Throw**: Spent 2 VP to hit multiple targets with returning glaive
5. **Avatar of Vengeance**: Spent 10 VP for ultimate transformation (+4 stats, +2d8 damage, 4 rounds)
6. **Critical Strike**: Avatar form critical hit dealt 72 damage in one strike
7. **Evasive Maneuvers**: Dodged 3 attacks, gaining 3 VP and taking 0 damage

You're a RELENTLESS HUNTER who marks prey and builds Vengeance Points through combat. You mark high-priority targets for bonus VP and damage. You dodge attacks to build VP defensively. You cage enemies to trap them and amplify damage. When you reach 10 VP, you transform into the AVATAR OF VENGEANCE—a spectral warrior with massive stat boosts who deals devastating damage. The criminal tried to run. You caged him. He tried to fight. You became the Avatar and dealt 72 damage in one critical strike. No one escapes the Warden. JUSTICE IS INEVITABLE.`
    }
  },
  
  // Resource System
  resourceSystem: {
    title: 'Vengeance Points',
    subtitle: 'Essence of Retribution',
    
    description: `The Warden channels their fury and determination into Vengeance Points, a resource that builds through successful combat actions and can be spent to unleash devastating abilities. This system rewards aggressive play, successful evasions, and strategic resource management, allowing the Warden to adapt to any combat situation.`,
    
    mechanics: {
      title: 'How It Works',
      content: `**Generating Vengeance Points**:
- **Successful Attack**: Gain 1 VP when you hit an enemy
- **Marked Target Hit**: Gain 2 VP when you hit a marked target (1 base + 1 bonus)
- **Critical Hit**: Gain 2 VP when you score a critical hit
- **Successful Evasion**: Gain 1 VP when you successfully dodge an attack
- **Maximum Capacity**: You can hold up to 10 Vengeance Points at once
- **Persistence**: VP persist between combats until spent

**Spending Vengeance Points**:
- **1 VP - Vengeful Strike**: Your next attack deals +1d6 damage
- **2 VP - Whirling Glaive**: Enhanced multi-target glaive throw
- **3 VP - Hunter's Resolve**: Heal 2d8 HP and gain +2 AC for 2 rounds
- **5 VP - Cage of Vengeance**: Trap target in spectral cage for 3 rounds
- **10 VP - Avatar of Vengeance**: Transform into ultimate form for 4 rounds

**VP Tracking**:
Your current Vengeance Points are displayed on your character sheet as glowing marks (0-10). VP are consumed when you activate abilities that require them.

**Strategic Considerations**:
- Build VP aggressively in early combat
- Save 5 VP for emergency cage abilities
- Build to 10 VP for Avatar transformation in boss fights
- Use 1-3 VP abilities for sustained combat
- Mark high-value targets to accelerate VP generation`
    },

    resourceTables: [
      {
        title: 'Vengeance Point Generation',
        headers: ['Action', 'VP Gained', 'Notes'],
        rows: [
          ['Successful Attack', '1 VP', 'Any successful hit generates VP'],
          ['Attack Marked Target', '2 VP', '1 base + 1 bonus for marked target'],
          ['Critical Hit', '2 VP', 'Critical hits generate double VP'],
          ['Successful Evasion', '1 VP', 'Dodging attacks generates VP'],
          ['Shadowblade Stealth Attack', '3 VP', 'Spec passive: stealth attacks generate +1 VP']
        ]
      },
      {
        title: 'Vengeance Point Expenditure',
        headers: ['Cost', 'Ability', 'Effect'],
        rows: [
          ['1 VP', 'Vengeful Strike', 'Next attack deals +1d6 damage'],
          ['2 VP', 'Whirling Glaive', 'Multi-target glaive throw'],
          ['3 VP', 'Hunter\'s Resolve', 'Heal 2d8 HP, gain +2 AC for 2 rounds'],
          ['5 VP', 'Cage of Vengeance', 'Trap target for 3 rounds'],
          ['10 VP', 'Avatar of Vengeance', 'Ultimate transformation for 4 rounds']
        ]
      },
      {
        title: 'Mark of the Hunt Effects',
        headers: ['Effect', 'Benefit', 'Duration'],
        rows: [
          ['Bonus VP Generation', '+1 VP per attack (total 2 VP)', 'Until mark expires'],
          ['Bonus Damage', '+1d6 damage on all attacks', 'Until mark expires'],
          ['Tracking', 'Sense direction to target within 1 mile', 'Until mark expires'],
          ['Mark Duration', 'Lasts until target dies or new target marked', 'Permanent until replaced'],
          ['Jailer Spec Bonus', 'Caged marked targets take +1d6 from all sources', 'While caged']
        ]
      }
    ],

    keyAbilities: {
      title: 'Core Warden Abilities',
      abilities: [
        {
          name: 'Mark of the Hunt',
          cost: 'Bonus Action',
          type: 'Mark',
          description: 'Mark a target as your prey. Attacks against marked targets generate +1 VP (total 2 VP) and deal +1d6 damage. You can sense the marked target\'s direction within 1 mile. Only one target can be marked at a time.'
        },
        {
          name: 'Vengeful Strike',
          cost: '1 VP',
          type: 'Enhancement',
          description: 'Spend 1 VP to empower your next attack, dealing +1d6 damage. This can be used as a bonus action before attacking.'
        },
        {
          name: 'Evasive Maneuvers',
          cost: 'Reaction',
          type: 'Defense',
          description: 'When targeted by an attack, use your reaction to gain +2 AC against that attack. If the attack misses, gain 1 VP.'
        },
        {
          name: 'Glaive Mastery',
          cost: 'Passive',
          type: 'Passive',
          description: 'You are proficient with glaives and can wield them with deadly precision. Your glaive attacks have +1 to hit and can be thrown up to 30 feet.'
        }
      ]
    },

    strategicTips: {
      title: 'Strategic Tips',
      content: `**Early Combat (Rounds 1-3)**:
Mark your primary target immediately. Focus on building VP through aggressive attacks. Use Evasive Maneuvers to generate VP defensively.

**Mid Combat (Rounds 4-6)**:
Start spending VP on Whirling Glaive for multi-target damage or Hunter's Resolve for sustain. Save 5 VP for Cage of Vengeance if needed.

**Late Combat (Rounds 7+)**:
Build to 10 VP for Avatar of Vengeance transformation. Use this during critical moments or boss fights for maximum impact.

**VP Economy**:
- Don't hoard VP - spend them regularly
- 1-2 VP abilities are very efficient for sustained combat
- Save 5 VP for emergency cage situations
- Build to 10 VP only for critical moments

**Mark Management**:
- Mark high-priority targets (bosses, casters, healers)
- Switch marks if your target dies
- Coordinate with team to focus marked targets
- Use tracking to prevent escapes

**Cage Tactics**:
- Cage dangerous enemies to isolate them
- Cage fleeing enemies to prevent escape
- Cage casters to interrupt channeling
- Jailer spec makes cages more powerful`
    }
  },
  
  // Specializations
  specializations: {
    title: 'Warden Specializations',
    subtitle: 'Three Paths of Vengeance',
    
    description: `Every Warden chooses one of three specializations that define their approach to justice and vengeance. Each specialization emphasizes different aspects of the Warden's abilities, offering unique passive abilities and playstyles.`,
    
    sharedPassive: {
      name: 'Relentless Hunter',
      icon: 'ability_hunter_markedfordeath',
      description: 'You have advantage on Survival and Perception checks to track creatures. Additionally, you can move at full speed while tracking without penalty.'
    },

    specs: [
      {
        id: 'shadowblade',
        name: 'Shadowblade',
        icon: 'ability_rogue_shadowstrike',
        color: '#2E0854',
        theme: 'Stealth Assassin',

        description: `The Shadowblade specialization focuses on stealth, precision strikes, and burst damage from the shadows. These Wardens are patient assassins who strike when their prey is most vulnerable, generating massive amounts of Vengeance Points through stealth attacks and using that power to deliver devastating finishing blows.`,

        playstyle: 'Stealth-based burst damage dealer, striking from shadows with enhanced VP generation',

        strengths: [
          'Highest burst damage among Warden specs',
          'Stealth attacks generate +1 VP (total 3 VP per hit)',
          'Invisibility after spending VP',
          'Excellent at eliminating priority targets'
        ],

        weaknesses: [
          'Requires stealth setup for maximum effectiveness',
          'Lower sustained damage than Vengeance Seeker',
          'Less crowd control than Jailer',
          'Vulnerable when stealth is broken'
        ],

        passiveAbilities: [
          {
            name: 'Shadow Strike',
            icon: 'ability_stealth',
            description: 'Attacks made from stealth generate +1 VP (total 3 VP: 1 base + 2 from stealth bonus) and deal +1d8 damage. You can hide as a bonus action after attacking.'
          },
          {
            name: 'Umbral Veil',
            icon: 'spell_shadow_charm',
            description: 'After spending 3 or more VP on an ability, you become invisible for 1 round. This invisibility breaks if you attack or cast a spell.'
          }
        ],

        recommendedSpells: [
          'Blink Strike - Teleport behind target and attack from stealth',
          'Umbral Assault - Ultimate invisibility + massive damage combo',
          'Shadow Strike - Core stealth attack ability',
          'Mark of the Hunt - Mark targets for tracking and bonus damage'
        ]
      },
      {
        id: 'jailer',
        name: 'Jailer',
        icon: 'spell_shadow_shackleundead',
        color: '#4A5568',
        theme: 'Cage Master',

        description: `The Jailer specialization masters the art of imprisonment and crowd control. These Wardens use spectral cages to trap and control the battlefield, preventing escapes and isolating dangerous enemies. They excel at locking down multiple targets and making caged enemies vulnerable to their team's attacks.`,

        playstyle: 'Crowd control specialist, trapping enemies and controlling battlefield positioning',

        strengths: [
          'Reduced cage costs (3 VP instead of 5)',
          'Caged enemies take +1d6 damage from all sources',
          'Can cage multiple targets',
          'Excellent battlefield control'
        ],

        weaknesses: [
          'Lower personal damage than other specs',
          'Cages can be broken by strong enemies',
          'Requires VP management for multiple cages',
          'Less mobile than Shadowblade or Vengeance Seeker'
        ],

        passiveAbilities: [
          {
            name: 'Master Jailer',
            icon: 'spell_shadow_mindsteal',
            description: 'Cage of Vengeance costs -2 VP (3 VP instead of 5). Additionally, you can maintain up to 2 cages simultaneously instead of 1.'
          },
          {
            name: 'Condemned',
            icon: 'spell_shadow_curseofachimonde',
            description: 'Enemies trapped in your cages take +1d6 damage from all sources. If a caged enemy is marked by Mark of the Hunt, they take an additional +1d6 damage (total +2d6).'
          }
        ],

        recommendedSpells: [
          'Cage of Vengeance - Core cage ability at reduced cost',
          'Chain Lightning - Glaive chains between caged enemies',
          'Prison of Eternity - Ultimate mass cage ability',
          'Whirling Glaive - Multi-target damage to set up cages'
        ]
      },
      {
        id: 'vengeance-seeker',
        name: 'Vengeance Seeker',
        icon: 'ability_warrior_revenge',
        color: '#8B0000',
        theme: 'Relentless Pursuit',

        description: `The Vengeance Seeker specialization embodies the relentless hunter who never stops pursuing their prey. These Wardens excel at sustained damage, mobility, and synergy with Mark of the Hunt. They are unstoppable forces who chase down fleeing enemies and deliver justice with unwavering determination.`,

        playstyle: 'High mobility sustained damage dealer, excelling at chasing and eliminating marked targets',

        strengths: [
          'Marked targets cannot hide or become invisible',
          'Free dash to marked targets',
          'Enhanced Avatar of Vengeance duration',
          'Excellent at pursuing fleeing enemies'
        ],

        weaknesses: [
          'Dependent on Mark of the Hunt for maximum effectiveness',
          'Lower burst damage than Shadowblade',
          'Less crowd control than Jailer',
          'Requires aggressive positioning'
        ],

        passiveAbilities: [
          {
            name: 'Inexorable Pursuit',
            icon: 'ability_hunter_aspectoftheviper',
            description: 'Marked targets cannot hide from you or become invisible. Additionally, dashing to a marked target costs no action points (free bonus action).'
          },
          {
            name: 'Endless Vengeance',
            icon: 'spell_shadow_unholyfrenzy',
            description: 'Avatar of Vengeance lasts +2 rounds (total 6 rounds instead of 4). While in Avatar form, attacks against marked targets generate +1 VP (total 3 VP per hit).'
          }
        ],

        recommendedSpells: [
          'Relentless Pursuit - Core dash and multi-strike ability',
          'Hunter\'s Fury - Empowered attacks against marked targets',
          'Avatar of Vengeance - Ultimate transformation with extended duration',
          'Mark of the Hunt - Essential for spec synergy'
        ]
      }
    ]
  },

  // Example Abilities - showcasing Vengeance Points and glaive combat
  exampleSpells: [
    // SHADOWBLADE - Stealth Assassin
    {
      id: 'warden_blink_strike',
      name: 'Blink Strike',
      description: 'Teleport behind your target and strike from the shadows with deadly precision.',
      spellType: 'ACTION',
      icon: 'ability_rogue_shadowstrike',
      school: 'Shadow',
      level: 2,
      specialization: 'shadowblade',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'teleport',
        rangeDistance: 30
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        actionPoints: 1,
        components: ['somatic'],
        somaticText: 'Blink through shadows'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '2d8',
        damageType: 'shadow',
        scalingType: 'none'
      },

      effects: {
        utility: {
          teleport: {
            distance: 30,
            position: 'behind_target'
          }
        },
        damage: {
          base: {
            formula: '2d8',
            type: 'shadow'
          },
          bonus: {
            formula: '1d8',
            type: 'shadow',
            condition: 'Shadow Strike passive (attack from stealth)'
          }
        }
      },

      specialMechanics: {
        vengeancePoints: {
          generated: 3,
          description: 'Generates 3 VP (1 base + 2 from Shadow Strike passive)'
        },
        stealth: {
          description: 'Counts as attacking from stealth for Shadow Strike passive',
          bonusDamage: '+1d8 damage',
          bonusVP: '+2 VP'
        },
        positioning: {
          description: 'Teleports you behind the target, granting advantage on the attack'
        }
      },

      tags: ['shadow', 'damage', 'teleport', 'stealth', 'shadowblade']
    },

    {
      id: 'warden_shadow_strike_ability',
      name: 'Shadow Strike',
      description: 'Strike from the shadows with enhanced power, dealing massive damage and generating Vengeance Points.',
      spellType: 'ACTION',
      icon: 'ability_stealth',
      school: 'Shadow',
      level: 1,
      specialization: 'shadowblade',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'melee',
        rangeDistance: 10
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        actionPoints: 1,
        components: ['somatic'],
        somaticText: 'Strike from stealth'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '3d6',
        damageType: 'physical',
        scalingType: 'none'
      },

      effects: {
        damage: {
          base: {
            formula: '3d6',
            type: 'physical'
          },
          bonus: {
            formula: '1d8',
            type: 'shadow',
            condition: 'If attacking from stealth'
          }
        },
        utility: {
          hideAfter: 'Can hide as bonus action after attacking'
        }
      },

      specialMechanics: {
        vengeancePoints: {
          generated: 3,
          description: 'Generates 3 VP when attacking from stealth (1 base + 2 from Shadow Strike passive)'
        },
        stealth: {
          requirement: 'Maximum effectiveness when attacking from stealth',
          bonusDamage: '+1d8 damage',
          bonusVP: '+2 VP'
        },
        hideBonus: {
          description: 'Can hide as bonus action after attacking (Shadowblade passive)'
        }
      },

      tags: ['physical', 'shadow', 'damage', 'stealth', 'shadowblade']
    },

    {
      id: 'warden_umbral_assault',
      name: 'Umbral Assault',
      description: 'Become one with the shadows, gaining invisibility and unleashing a devastating series of strikes.',
      spellType: 'ACTION',
      icon: 'spell_shadow_charm',
      school: 'Shadow',
      level: 5,
      specialization: 'shadowblade',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'multi',
        rangeType: 'melee',
        rangeDistance: 10,
        maxTargets: 3
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        actionPoints: 1,
        vengeancePoints: 10,
        components: ['verbal', 'somatic'],
        verbalText: 'Umbra me abscondat!',
        somaticText: 'Dissolve into shadows'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '4d8',
        damageType: 'shadow',
        scalingType: 'none'
      },

      effects: {
        buff: {
          invisibility: {
            duration: 2,
            description: 'Become invisible for 2 rounds before attacking'
          }
        },
        damage: {
          multiTarget: {
            formula: '4d8',
            type: 'shadow',
            targets: 3,
            advantage: true
          }
        }
      },

      specialMechanics: {
        vengeancePoints: {
          cost: 10,
          description: 'Ultimate ability - costs all 10 Vengeance Points'
        },
        shadowbladeUltimate: {
          description: 'Shadowblade specialization ultimate ability',
          invisibility: 'Gain 2 rounds of invisibility before striking',
          multiStrike: 'Strike up to 3 targets with advantage'
        },
        umbralVeil: {
          description: 'After using this ability, Umbral Veil passive triggers (invisibility for 1 round)'
        }
      },

      tags: ['shadow', 'damage', 'multi-target', 'ultimate', 'invisibility', 'shadowblade']
    },

    // JAILER - Cage Master
    {
      id: 'warden_cage_of_vengeance',
      name: 'Cage of Vengeance',
      description: 'Summon a spectral cage around your target, trapping them and preventing escape.',
      spellType: 'ACTION',
      icon: 'spell_shadow_shackleundead',
      school: 'Shadow',
      level: 3,
      specialization: 'jailer',

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
        duration: 3
      },

      resourceCost: {
        actionPoints: 1,
        vengeancePoints: 3,
        components: ['verbal', 'somatic'],
        verbalText: 'Carcer aeternus!',
        somaticText: 'Summon spectral cage'
      },

      resolution: 'SAVING_THROW',

      savingThrow: {
        ability: 'strength',
        dc: 15,
        onSave: 'cage_duration_halved'
      },

      debuffConfig: {
        effects: [
          'Target is trapped in 10-foot radius cage',
          'Cannot move beyond cage boundaries',
          'Cannot teleport or use movement abilities',
          'Takes +1d6 damage from all sources (Jailer passive)',
          'Duration: 3 rounds (or 1 round on successful save)'
        ]
      },

      effects: {
        debuff: {
          type: 'caged',
          duration: 3,
          radius: 10,
          effects: {
            movementRestriction: 'Cannot leave 10-foot radius',
            teleportBlock: 'Cannot teleport',
            damageVulnerability: '+1d6 from all sources (Condemned passive)'
          }
        }
      },

      savingThrowEffect: {
        onSuccess: 'Cage duration reduced to 1 round',
        onFailure: 'Trapped for full 3 rounds'
      },

      specialMechanics: {
        vengeancePoints: {
          cost: 3,
          description: 'Costs 3 VP for Jailer spec (reduced from 5 VP by Master Jailer passive)'
        },
        jailerPassive: {
          description: 'Master Jailer passive reduces cost by 2 VP',
          multiCage: 'Can maintain up to 2 cages simultaneously'
        },
        condemned: {
          description: 'Caged enemies take +1d6 damage from all sources',
          markedBonus: 'If target is marked, takes additional +1d6 (total +2d6)'
        }
      },

      tags: ['shadow', 'control', 'cage', 'debuff', 'jailer']
    },

    {
      id: 'warden_chain_lightning',
      name: 'Chain Lightning',
      description: 'Throw your glaive in an arc that chains between caged enemies, dealing devastating damage.',
      spellType: 'ACTION',
      icon: 'spell_shadow_mindsteal',
      school: 'Shadow',
      level: 4,
      specialization: 'jailer',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'chain',
        rangeType: 'ranged',
        rangeDistance: 40,
        chainDistance: 20,
        maxChains: 4
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        actionPoints: 1,
        vengeancePoints: 2,
        components: ['somatic'],
        somaticText: 'Throw glaive in chaining arc'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '2d6',
        damageType: 'shadow',
        scalingType: 'chain_bonus'
      },

      effects: {
        damage: {
          chain: {
            primary: '2d6',
            second: '2d6',
            third: '2d6',
            fourth: '2d6',
            type: 'shadow',
            chainDistance: 20,
            cagedBonus: '+1d6 per caged enemy'
          }
        }
      },

      specialMechanics: {
        vengeancePoints: {
          cost: 2,
          generated: 1,
          perHit: true,
          description: 'Costs 2 VP, generates 1 VP per enemy hit'
        },
        cageChaining: {
          description: 'Prioritizes chaining to caged enemies',
          bonusDamage: 'Caged enemies take +1d6 damage (Condemned passive)',
          chainRange: 'Chains up to 20 feet between targets (longer than normal)'
        },
        jailerSynergy: {
          description: 'Extremely effective when multiple enemies are caged',
          optimalUse: 'Use after caging 2+ enemies for maximum damage'
        }
      },

      tags: ['shadow', 'damage', 'chain', 'cage-synergy', 'jailer']
    },

    {
      id: 'warden_prison_of_eternity',
      name: 'Prison of Eternity',
      description: 'Create a massive spectral prison that traps all enemies in a large area.',
      spellType: 'ACTION',
      icon: 'spell_shadow_curseofachimonde',
      school: 'Shadow',
      level: 5,
      specialization: 'jailer',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 50,
        areaType: 'circle',
        areaSize: 20
      },

      durationConfig: {
        durationType: 'rounds',
        duration: 4
      },

      resourceCost: {
        actionPoints: 1,
        vengeancePoints: 10,
        components: ['verbal', 'somatic'],
        verbalText: 'Carcer infinitus!',
        somaticText: 'Summon massive prison'
      },

      resolution: 'SAVING_THROW',

      savingThrow: {
        ability: 'strength',
        dc: 16,
        onSave: 'half_duration'
      },

      debuffConfig: {
        effects: [
          'All enemies in 20-foot radius are caged',
          'Cannot leave the prison area',
          'Cannot teleport or use movement abilities',
          'Take +1d6 damage from all sources (Condemned passive)',
          'Duration: 4 rounds (or 2 rounds on successful save)'
        ]
      },

      effects: {
        debuff: {
          aoe: {
            shape: 'circle',
            radius: 20,
            type: 'caged',
            duration: 4,
            effects: {
              movementRestriction: 'Cannot leave prison area',
              teleportBlock: 'Cannot teleport',
              damageVulnerability: '+1d6 from all sources'
            }
          }
        }
      },

      savingThrowEffect: {
        onSuccess: 'Prison duration reduced to 2 rounds',
        onFailure: 'Trapped for full 4 rounds'
      },

      specialMechanics: {
        vengeancePoints: {
          cost: 10,
          description: 'Ultimate ability - costs all 10 Vengeance Points'
        },
        jailerUltimate: {
          description: 'Jailer specialization ultimate ability',
          massControl: 'Cages all enemies in 20-foot radius',
          teamSynergy: 'Provides massive crowd control for team'
        },
        condemned: {
          description: 'All caged enemies take +1d6 damage from all sources',
          markedBonus: 'Marked enemies take additional +1d6 (total +2d6)'
        }
      },

      tags: ['shadow', 'control', 'cage', 'aoe', 'ultimate', 'jailer']
    },

    // VENGEANCE SEEKER - Relentless Pursuit
    {
      id: 'warden_relentless_pursuit',
      name: 'Relentless Pursuit',
      description: 'Dash towards your marked target and unleash a series of rapid strikes.',
      spellType: 'ACTION',
      icon: 'ability_hunter_aspectoftheviper',
      school: 'Physical',
      level: 2,
      specialization: 'vengeance-seeker',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'dash',
        rangeDistance: 40
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        actionPoints: 1,
        vengeancePoints: 2,
        components: ['somatic'],
        somaticText: 'Dash and strike rapidly'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '3d6',
        damageType: 'physical',
        scalingType: 'none'
      },

      effects: {
        utility: {
          dash: {
            distance: 40,
            target: 'marked_target',
            free: 'if_vengeance_seeker_spec'
          }
        },
        damage: {
          multiStrike: {
            strikes: 3,
            formula: '1d6',
            type: 'physical',
            total: '3d6'
          },
          markedBonus: {
            formula: '+1d6',
            condition: 'If target is marked'
          }
        }
      },

      specialMechanics: {
        vengeancePoints: {
          cost: 2,
          generated: 6,
          description: 'Costs 2 VP, generates up to 6 VP (2 VP per strike against marked target)'
        },
        inexorablePursuit: {
          description: 'Vengeance Seeker spec: Dashing to marked target costs no action points',
          freeMovement: 'Dash is a free bonus action for Vengeance Seekers'
        },
        markedSynergy: {
          description: 'Each strike against marked target generates 2 VP (1 base + 1 mark bonus)',
          bonusDamage: '+1d6 damage if target is marked'
        }
      },

      tags: ['physical', 'damage', 'dash', 'multi-strike', 'vengeance-seeker']
    },

    {
      id: 'warden_hunters_fury',
      name: 'Hunter\'s Fury',
      description: 'Channel your vengeance into a devastating attack against your marked prey.',
      spellType: 'ACTION',
      icon: 'ability_warrior_revenge',
      school: 'Physical',
      level: 3,
      specialization: 'vengeance-seeker',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'melee',
        rangeDistance: 10
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        actionPoints: 1,
        vengeancePoints: 3,
        components: ['verbal', 'somatic'],
        verbalText: 'Fury of the hunt!',
        somaticText: 'Empowered glaive strike'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '4d8',
        damageType: 'physical',
        scalingType: 'marked_target'
      },

      effects: {
        damage: {
          base: {
            formula: '4d8',
            type: 'physical'
          },
          markedBonus: {
            formula: '+2d8',
            type: 'physical',
            condition: 'If target is marked by Mark of the Hunt'
          }
        }
      },

      specialMechanics: {
        vengeancePoints: {
          cost: 3,
          generated: 2,
          description: 'Costs 3 VP, generates 2 VP on hit (marked target)'
        },
        markedRequirement: {
          description: 'Deals maximum damage against marked targets',
          baseDamage: '4d8 against any target',
          markedDamage: '6d8 against marked target (+2d8 bonus)'
        },
        vengeanceSeekerSynergy: {
          description: 'Vengeance Seeker spec excels with this ability',
          combo: 'Use after Relentless Pursuit for devastating combo'
        }
      },

      tags: ['physical', 'damage', 'marked-synergy', 'vengeance-seeker']
    },

    {
      id: 'warden_avatar_of_vengeance',
      name: 'Avatar of Vengeance',
      description: 'Transform into the ultimate embodiment of vengeance, gaining massive power for a limited time.',
      spellType: 'ACTION',
      icon: 'spell_shadow_unholyfrenzy',
      school: 'Shadow',
      level: 5,
      specialization: 'vengeance-seeker',

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
        duration: 6
      },

      resourceCost: {
        actionPoints: 1,
        vengeancePoints: 10,
        components: ['verbal', 'somatic'],
        verbalText: 'I am vengeance incarnate!',
        somaticText: 'Transform into Avatar form'
      },

      resolution: 'AUTOMATIC',

      buffConfig: {
        effects: [
          'Gain +4 to attack rolls',
          'Deal +2d6 damage on all attacks',
          'Gain +4 AC',
          'Gain damage resistance (reduce all damage by 1d6)',
          'Generate +1 VP per attack (total 2 VP, or 3 VP against marked targets)',
          'Duration: 6 rounds (Vengeance Seeker spec with Endless Vengeance passive)'
        ]
      },

      effects: {
        buff: {
          transformation: {
            duration: 6,
            attackBonus: 4,
            damageBonus: '2d6',
            acBonus: 4,
            damageResistance: '1d6',
            vpGeneration: '+1 VP per attack'
          }
        }
      },

      specialMechanics: {
        vengeancePoints: {
          cost: 10,
          description: 'Ultimate ability - costs all 10 Vengeance Points'
        },
        vengeanceSeekerUltimate: {
          description: 'Vengeance Seeker specialization ultimate ability',
          extendedDuration: '6 rounds instead of 4 (Endless Vengeance passive)',
          enhancedVP: 'Attacks against marked targets generate 3 VP (1 base + 1 Avatar + 1 mark)'
        },
        transformation: {
          description: 'Become an unstoppable force of vengeance',
          visualEffect: 'Shadowy aura, glowing eyes, enhanced glaives',
          powerSpike: 'Massive stat boost for extended duration'
        }
      },

      tags: ['buff', 'transformation', 'ultimate', 'vengeance-seeker']
    },

    // UNIVERSAL ABILITIES - All Wardens
    {
      id: 'warden_mark_of_the_hunt',
      name: 'Mark of the Hunt',
      description: 'Mark a target as your prey, increasing damage dealt and generating bonus Vengeance Points.',
      spellType: 'ACTION',
      icon: 'ability_hunter_markedfordeath',
      school: 'Physical',
      level: 1,
      specialization: 'universal',

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
        durationType: 'special',
        duration: 'Until target dies or new target marked'
      },

      resourceCost: {
        actionPoints: 1,
        components: ['verbal'],
        verbalText: 'Mark target as prey'
      },

      resolution: 'AUTOMATIC',

      effects: {
        utility: {
          mark: {
            vpBonus: '+1 VP per attack (total 2 VP)',
            damageBonus: '+1d6 damage on all attacks',
            tracking: 'Sense direction to target within 1 mile',
            duration: 'Until target dies or new mark applied'
          }
        }
      },

      specialMechanics: {
        vengeancePoints: {
          bonus: '+1 VP per attack against marked target',
          description: 'Attacks generate 2 VP total (1 base + 1 mark bonus)'
        },
        tracking: {
          description: 'You can sense the marked target\'s direction within 1 mile',
          vengeanceSeekerBonus: 'Vengeance Seeker spec: Marked targets cannot hide or become invisible'
        },
        singleTarget: {
          description: 'Only one target can be marked at a time',
          switching: 'Marking a new target removes the previous mark'
        }
      },

      tags: ['utility', 'mark', 'tracking', 'universal']
    },

    {
      id: 'warden_whirling_glaive',
      name: 'Whirling Glaive',
      description: 'Throw your glaive in a sweeping arc, hitting multiple enemies and slowing them.',
      spellType: 'ACTION',
      icon: 'ability_rogue_fanofknives',
      school: 'Physical',
      level: 2,
      specialization: 'universal',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 30,
        areaType: 'cone',
        areaSize: 15
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        actionPoints: 1,
        vengeancePoints: 2,
        components: ['somatic'],
        somaticText: 'Throw glaive in sweeping arc'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '2d6',
        damageType: 'physical',
        scalingType: 'none'
      },

      debuffConfig: {
        effects: [
          'Enemies hit are slowed',
          'Movement speed reduced by 10 feet',
          'Duration: 1 round'
        ]
      },

      effects: {
        damage: {
          aoe: {
            formula: '2d6',
            type: 'physical',
            shape: 'cone',
            size: 15
          }
        },
        debuff: {
          type: 'slowed',
          duration: 1,
          effect: '-10 feet movement speed'
        }
      },

      specialMechanics: {
        vengeancePoints: {
          cost: 2,
          generated: 1,
          perHit: true,
          description: 'Costs 2 VP, generates 1 VP per enemy hit'
        },
        slow: {
          description: 'Enemies hit have movement speed reduced by 10 feet for 1 round',
          tacticalUse: 'Prevents enemies from escaping or closing distance'
        }
      },

      tags: ['physical', 'damage', 'aoe', 'debuff', 'slow', 'universal']
    },

    {
      id: 'warden_hunters_resolve',
      name: 'Hunter\'s Resolve',
      description: 'Call upon your inner strength to heal yourself and gain damage resistance.',
      spellType: 'ACTION',
      icon: 'spell_holy_restoration',
      school: 'Physical',
      level: 2,
      specialization: 'universal',

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
        duration: 2
      },

      resourceCost: {
        actionPoints: 1,
        vengeancePoints: 3,
        components: ['verbal'],
        verbalText: 'Inner strength sustains me'
      },

      resolution: 'AUTOMATIC',

      healingConfig: {
        formula: '2d8',
        scalingType: 'none'
      },

      buffConfig: {
        effects: [
          'Heal 2d8 HP',
          'Gain +2 AC for 2 rounds',
          'If marked targets are within sight, effects are doubled (4d8 HP, +4 AC)'
        ]
      },

      effects: {
        healing: {
          base: {
            formula: '2d8',
            type: 'healing'
          },
          markedBonus: {
            formula: '4d8',
            condition: 'If marked target is within sight'
          }
        },
        buff: {
          acBonus: 2,
          duration: 2,
          markedBonus: {
            acBonus: 4,
            condition: 'If marked target is within sight'
          }
        }
      },

      specialMechanics: {
        vengeancePoints: {
          cost: 3,
          description: 'Costs 3 VP for healing and defense'
        },
        markedSynergy: {
          description: 'Effects doubled if marked target is within sight',
          baseHealing: '2d8 HP, +2 AC',
          enhancedHealing: '4d8 HP, +4 AC (with marked target visible)'
        },
        tacticalUse: {
          description: 'Use when low on health or facing heavy attacks',
          timing: 'Best used when marked target is visible for doubled effect'
        }
      },

      tags: ['healing', 'buff', 'defense', 'universal']
    },

    {
      id: 'warden_vengeful_strike',
      name: 'Vengeful Strike',
      description: 'Empower your next attack with vengeance, dealing bonus damage.',
      spellType: 'ACTION',
      icon: 'ability_warrior_savageblow',
      school: 'Physical',
      level: 1,
      specialization: 'universal',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      durationConfig: {
        durationType: 'special',
        duration: 'Next attack'
      },

      resourceCost: {
        actionPoints: 1,
        vengeancePoints: 1,
        components: ['verbal'],
        verbalText: 'Vengeance guides my blade'
      },

      resolution: 'AUTOMATIC',

      effects: {
        buff: {
          nextAttack: {
            bonusDamage: '+1d6',
            duration: 'Next attack only'
          }
        }
      },

      specialMechanics: {
        vengeancePoints: {
          cost: 1,
          description: 'Costs 1 VP for +1d6 damage on next attack'
        },
        efficiency: {
          description: 'Very efficient VP usage for sustained damage',
          combo: 'Use before high-damage abilities for maximum effect'
        }
      },

      tags: ['buff', 'damage', 'enhancement', 'universal']
    },

    {
      id: 'warden_evasive_maneuvers',
      name: 'Evasive Maneuvers',
      description: 'Use your agility to evade an incoming attack, generating Vengeance Points.',
      spellType: 'REACTION',
      icon: 'ability_rogue_feint',
      school: 'Physical',
      level: 1,
      specialization: 'universal',

      typeConfig: {
        castTime: 1,
        castTimeType: 'REACTION',
        trigger: 'When you are targeted by an attack'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        actionPoints: 1,
        components: ['somatic'],
        somaticText: 'Dodge and weave'
      },

      resolution: 'AUTOMATIC',

      buffConfig: {
        effects: [
          'Gain +2 AC against triggering attack',
          'If attack misses, gain 1 VP'
        ]
      },

      effects: {
        buff: {
          acBonus: 2,
          duration: 'Against triggering attack only'
        },
        utility: {
          vpGeneration: {
            amount: 1,
            condition: 'If attack misses'
          }
        }
      },

      specialMechanics: {
        vengeancePoints: {
          generated: 1,
          condition: 'If the attack misses',
          description: 'Successful evasion generates 1 VP'
        },
        reaction: {
          trigger: 'When targeted by attack',
          timing: 'Before attack roll is resolved'
        },
        defensiveVP: {
          description: 'Allows VP generation through defense, not just offense',
          tacticalUse: 'Use when low on VP and under attack'
        }
      },

      tags: ['buff', 'defense', 'reaction', 'vp-generation', 'universal']
    },

    {
      id: 'warden_glaive_mastery',
      name: 'Glaive Mastery',
      description: 'Your mastery of glaive combat grants you enhanced accuracy and versatility.',
      spellType: 'PASSIVE',
      icon: 'inv_weapon_glaive_01',
      school: 'Physical',
      level: 1,
      specialization: 'universal',

      typeConfig: {
        castTime: 0,
        castTimeType: 'PASSIVE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      durationConfig: {
        durationType: 'permanent'
      },

      resourceCost: {
        actionPoints: 0,
        components: []
      },

      resolution: 'AUTOMATIC',

      buffConfig: {
        effects: [
          'Glaive attacks have +1 to hit',
          'Glaives can be thrown up to 30 feet',
          'Thrown glaives return to your hand after attacking'
        ]
      },

      effects: {
        passive: {
          attackBonus: 1,
          throwRange: 30,
          glaiveReturn: true
        }
      },

      specialMechanics: {
        passive: {
          description: 'Always active passive ability',
          attackBonus: '+1 to hit with glaive attacks',
          throwRange: 'Can throw glaives up to 30 feet',
          magicReturn: 'Thrown glaives magically return to your hand'
        }
      },

      tags: ['passive', 'enhancement', 'glaive', 'universal']
    }
  ]
};

