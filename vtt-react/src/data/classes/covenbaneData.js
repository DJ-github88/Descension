/**
 * Covenbane Class Data
 * 
 * Complete class information for the Covenbane - a stealthy witch hunter who builds
 * Hexbreaker charges to unleash devastating anti-magic attacks and abilities.
 */

export const COVENBANE_DATA = {
  id: 'covenbane',
  name: 'Covenbane',
  icon: 'fas fa-ban',
  role: 'Damage/Anti-Magic',

  // Overview Section
  overview: {
    title: 'The Covenbane',
    subtitle: 'Relentless Witch Hunter',

    quickOverview: {
      title: 'Quick Overview',
      content: `**What You Need to Know**: The Covenbane is a witch hunter who builds Hexbreaker charges (max 6) by attacking evil magic users or being targeted by spells. Each charge grants exponentially increasing passive bonuses: +damage, +speed, +true damage on every 3rd attack. You can spend charges on powerful anti-magic abilities (counterspell, dispel, teleport) or save them for devastating passive bonuses.

**Core Mechanic**: Attack evil spellcasters → Build Hexbreaker charges → Gain passive bonuses OR spend on abilities

**Resource**: Hexbreaker Charges (0-6, built through combat)

**Playstyle**: Anti-magic damage dealer, charge scaling, high mobility, true damage specialist

**Best For**: Players who enjoy hunting spellcasters, building power through combat, and making spend-vs-save decisions`
    },

    description: `The Covenbane is a stealthy, agile warrior specializing in hunting down witches, warlocks, and other malevolent magic users. Inspired by Vayne from League of Legends, they combine exceptional close-quarters combat skills with a keen understanding of dark magic. Through the Hexbreaker charge system, they build power with each attack against evil spellcasters, gaining exponential increases in damage, speed, and critical hit chance.`,

    roleplayIdentity: {
      title: 'Roleplay Identity',
      content: `Covenbanes are relentless hunters who have dedicated their lives to eradicating evil magic from the world. They walk a dangerous path, using dark energy and forbidden techniques to fight fire with fire. Unlike paladins who rely on divine righteousness, Covenbanes embrace the darkness to hunt those who wield it.

They understand that to hunt monsters, one must become monstrous. Each Hexbreaker charge they accumulate represents dark energy absorbed from their enemies—power they turn back against the wicked. This constant exposure to malevolent magic takes its toll, and many Covenbanes struggle with the line between hunter and hunted.

In roleplay, Covenbanes often embody:
- **The Vengeful Hunter**: Lost loved ones to dark magic and swore eternal vengeance
- **The Inquisitor**: Sanctioned by an order to hunt and eliminate magical threats
- **The Fallen Mage**: Once practiced magic, now hunts those who abuse it
- **The Monster Slayer**: Inspired by Witchers, uses alchemy and tactics to hunt supernatural threats
- **The Shadow Operative**: Works in secret to eliminate magical corruption before it spreads

Covenbanes are often solitary figures, marked by their profession. They carry silver weapons, wear protective charms, and bear scars from battles with supernatural foes. Many develop the ability to sense evil magic, their skin prickling in the presence of curses and dark spells. Some mark each kill with a tally, while others collect trophies from defeated witches and warlocks.

**Philosophy**: "To hunt the darkness, I must embrace it. To kill monsters, I must become one. But I will never become what they are—for I hunt with purpose, not malice."`
    },

    combatRole: {
      title: 'Combat Role',
      content: `The Covenbane is an anti-magic damage dealer who excels at:

**Charge Scaling**: Build Hexbreaker charges (max 6) for exponential power increases
**Anti-Magic Combat**: Specialize in hunting and neutralizing spellcasters
**True Damage**: Every third attack deals bonus true damage (Witch Hunter's Precision)
**High Mobility**: Speed bonuses from charges plus Shadow Step teleport
**Dispel Mastery**: Remove curses and magical effects from allies
**Burst Damage**: Devastating attacks when at high charge counts

**Strengths**:
- Exceptional scaling power through Hexbreaker charges
- True damage bypasses all armor and resistances
- High mobility with speed bonuses and teleport
- Strong anti-magic toolkit (counterspell, dispel, mana drain)
- Versatile specializations (stealth, anti-magic, pursuit)
- Devastating ultimate ability at 6 charges

**Weaknesses**:
- Requires building charges to reach full potential
- Gains charges primarily from evil magic users
- Must carefully manage charge spending vs passive bonuses
- Most abilities require melee or short range
- Significantly weaker at 0-2 charges
- Vulnerable to being kited before building charges

The Covenbane shines in fights against spellcasters and magical enemies, where they can rapidly build charges and unleash devastating attacks enhanced by true damage and critical hits.`
    },

    playstyle: {
      title: 'Playstyle & Strategy',
      content: `Playing a Covenbane is about building power through relentless pursuit and knowing when to spend charges versus saving them for passive bonuses. Key strategic considerations:

**Hexbreaker Charge Management**:
- **0 Charges**: Weak, focus on building charges quickly
- **1-2 Charges**: Basic bonuses, continue building
- **3-4 Charges**: Strong power spike, consider spending on abilities
- **5-6 Charges**: Maximum power, devastating passive bonuses or ultimate ability

**Charge Generation**:
- +1 per successful attack vs evil magic users
- +1 when targeted by enemy spells
- Shadowbane passive: +1 extra charge from stealth attacks
- Strategy: Prioritize spellcaster targets to build charges rapidly

**Passive Scaling** (Always Active):
| Charges | Damage | Speed | True Damage (3rd Attack) |
|---------|--------|-------|--------------------------|
| 0 | +0 | +0 ft | +0 |
| 1 | +1d4 | +5 ft | +1d6 |
| 2 | +1d6 | +10 ft | +1d8 |
| 3 | +2d6 | +15 ft | +2d6 |
| 4 | +3d6 | +20 ft | +2d8 |
| 5 | +4d6 | +25 ft | +3d8 |
| 6 | +5d6 | +30 ft | +4d8 |

**Witch Hunter's Precision**:
- Every **third attack** vs evil magic users deals bonus true damage
- Scales with Hexbreaker charges (see table above)
- True damage ignores all armor and resistances
- At 6 charges: +4d8 true damage on every third attack

**Ability Costs**:
- Shadow Step (1): Teleport 30ft, advantage on next attack
- Curse Eater (2): Dispel curse/magic from ally
- Dark Pursuit (3): Double movement speed
- Spirit Shackle (4): Root enemy for 1 minute
- Execution (5): Instant kill if below half HP
- Hexbreaker Fury (6): AoE damage + stun all enemies in 30ft

**Specialization Synergies**:
- **Shadowbane**: Stealth attacks auto-crit at 3+ charges, +1 charge from stealth
- **Spellbreaker**: Reflect damage on successful saves, melee counterspell
- **Demonhunter**: +10ft movement per charge, cannot be slowed at 3+ charges

**Combat Flow**:
- **Opening**: Use Shadow Step to engage, start building charges
- **Early Combat**: Focus attacks on spellcasters to build charges (0→3)
- **Mid Combat**: At 3+ charges, decide between spending or continuing to build
- **High Charges**: At 5-6 charges, either maintain for passive bonuses or spend on ultimate
- **Finishing**: Use Execution on wounded targets or Hexbreaker Fury for AoE

**Target Priority**:
1. Evil magic users (build charges)
2. Enemy spellcasters (anti-magic abilities)
3. Cursed/buffed enemies (Curse Eater value)
4. Low HP targets (Execution opportunity)

**Team Dynamics**:
- Works well with crowd control that groups enemies for Hexbreaker Fury
- Synergizes with tanks who can protect while building charges
- Benefits from scouts who identify spellcaster targets
- Provides utility through Curse Eater and dispel abilities
- Can assassinate priority targets with Shadowbane specialization`
    },

    immersiveCombatExample: {
      title: 'Combat Example: The Witch Hunt',
      content: `**The Setup**: Your party ambushes a coven of three witches and their summoned demon in a cursed forest clearing. You're a Covenbane (Shadowbane specialization) starting from stealth with 0 Hexbreaker charges. Time to hunt.

**Starting State**: Hexbreaker Charges: 0 | HP: 80/80 | Stealth: Active

**Turn 1 - The Opening Strike (Charges: 0 → 2)**

*You watch from the shadows as the witches chant around a ritual circle. The demon stands guard, its eyes glowing red. You mark your target: the lead witch, her hands crackling with dark energy.*

**Action**: Shadow Step (costs 1 charge, but you have 0—this is a free ability at 0 charges for Shadowbane spec) + Stealth Attack
**Effect**: Teleport 30ft behind lead witch, advantage on next attack, Shadowbane passive: +1 charge from stealth attack

*You blink through shadows, materializing behind the lead witch. Your silver crossbow bolt strikes true.*

**Attack Roll**: d20+5 (advantage) → [18] = Hit!
**Damage**: 2d8 (crossbow) + 1d6 (sneak attack) → [7, 6] + [4] = 17 damage
**Hexbreaker Charges**: +1 (hit evil magic user) +1 (Shadowbane stealth bonus) = 2 charges

*The witch screams. Dark energy bleeds from the wound. You feel it—the Hexbreaker charges building, dark power flowing into you.*

**Current Bonuses (2 Charges)**: +1d6 damage, +10ft speed, +1d8 true damage on 3rd attack

**Turn 2 - Building Power (Charges: 2 → 3)**

*The witches turn on you. One casts a curse. You feel it coming—dark magic reaching for your soul.*

**Witch's Action**: Casts "Curse of Weakness" at you
**Your Reaction**: You're TARGETED by a spell → +1 Hexbreaker charge!
**Hexbreaker Charges**: 2 + 1 = 3 charges

**Your Save**: d20+4 → [16] = Success! Curse resisted.

*The curse dissipates against your will. You've hunted witches long enough to resist their tricks. And now you're at 3 charges—the power spike.*

**Action**: Attack lead witch (2nd attack on her)
**Attack Roll**: d20+5 → [14] = Hit!
**Damage**: 2d8 (crossbow) + 2d6 (3 charges bonus) → [6, 7] + [5, 4] = 22 damage
**Result**: Lead witch down to 15 HP

**Current Bonuses (3 Charges)**: +2d6 damage, +15ft speed, +2d6 true damage on 3rd attack

**Turn 3 - The True Damage Proc (Charges: 3 → 4)**

*The lead witch is wounded, bleeding dark magic. This is your third attack on evil magic users. Witch Hunter's Precision activates.*

**Action**: Attack lead witch (3rd attack total—TRUE DAMAGE PROCS!)
**Attack Roll**: d20+5 → [17] = Hit!
**Damage**: 2d8 (crossbow) + 2d6 (3 charges) + **2d6 TRUE DAMAGE** (Witch Hunter's Precision) → [8, 5] + [6, 3] + [5, 4] = 31 damage (22 normal + 9 true)

*Your bolt pierces her heart. The true damage ignores her magical wards, her protective spells, everything. She falls, dead.*

**Hexbreaker Charges**: 3 + 1 (killed evil magic user) = 4 charges

**Witch 2's Turn**: Casts "Shadow Bolt" at you → You're targeted by spell → +1 charge!
**Hexbreaker Charges**: 4 + 1 = 5 charges
**Damage to You**: 3d6 → [4, 5, 3] = 12 damage (you're at 68/80 HP)

**Current Bonuses (5 Charges)**: +4d6 damage, +25ft speed, +3d8 true damage on 3rd attack

**Turn 4 - The Decision Point (Charges: 5)**

*You're at 5 charges. Two witches remain, plus the demon. You could spend 5 charges on "Execution" to instantly kill Witch 2 (she's at 60% HP, not below half). Or you could save charges, build to 6, and use "Hexbreaker Fury" to hit all three enemies.*

**Your Decision**: Save charges, build to 6 for ultimate ability

**Action**: Attack Witch 2 (1st attack on her)
**Attack Roll**: d20+5 → [19] = Hit!
**Damage**: 2d8 (crossbow) + 4d6 (5 charges) → [7, 8] + [5, 6, 4, 3] = 33 damage!

*Witch 2 staggers, badly wounded (down to 27 HP). Your damage is MASSIVE at 5 charges.*

**Hexbreaker Charges**: 5 + 1 (hit evil magic user) = 6 charges (MAXIMUM!)

**Current Bonuses (6 Charges)**: +5d6 damage, +30ft speed, +4d8 true damage on 3rd attack

**Turn 5 - Hexbreaker Fury (Charges: 6 → 0)**

*You're at maximum power. Six Hexbreaker charges pulse through you. The witches and demon are grouped together. Time to unleash hell.*

**Action**: Use "Hexbreaker Fury" (costs all 6 charges)
**Effect**: AoE damage + stun to all enemies within 30ft

*You raise your crossbow to the sky. The six Hexbreaker charges EXPLODE outward in a wave of silver-white energy.*

**Damage Roll**: 6d10 (base) + 5d6 (charge bonus) → [8, 9, 7, 10, 6, 8] + [5, 6, 4, 3, 2] = 48 + 20 = 68 damage to ALL enemies!

**Results**:
- Witch 2: 27 HP - 68 damage = DEAD (overkill)
- Witch 3: 50 HP - 68 damage = DEAD (overkill)
- Demon: 120 HP - 68 damage = 52 HP remaining, STUNNED for 1 turn

*The explosion of anti-magic energy obliterates the witches. The demon roars, stunned and wounded.*

**Hexbreaker Charges**: 6 - 6 = 0 (spent all charges)

**Turn 6 - Rebuilding (Charges: 0 → 1)**

*You're back to 0 charges, but the demon is stunned and alone. Time to rebuild.*

**Action**: Attack demon (1st attack)
**Attack Roll**: d20+5 (advantage, demon is stunned) → [16] = Hit!
**Damage**: 2d8 (crossbow) → [6, 7] = 13 damage
**Hexbreaker Charges**: 0 + 1 (hit evil creature) = 1 charge

**Demon's Turn**: Stunned, cannot act

**Turn 7 - Finishing the Hunt (Charges: 1 → 2)**

*The demon shakes off the stun. It charges at you, claws extended. Your party's tank intercepts.*

**Action**: Attack demon (2nd attack)
**Attack Roll**: d20+5 → [15] = Hit!
**Damage**: 2d8 (crossbow) + 1d4 (1 charge) → [8, 5] + [3] = 16 damage
**Hexbreaker Charges**: 1 + 1 = 2 charges

**Demon HP**: 52 - 13 - 16 = 23 HP remaining

**Your Party's Mage**: Casts "Fireball" → 25 damage → Demon DEAD

*The demon falls. The coven is destroyed. You stand among the corpses, silver crossbow still smoking. Three witches dead in seven turns. This is what you were born to do.*

**The Lesson**: Covenbane gameplay is about:
1. **Charge Building**: Every attack on evil magic users builds charges (0 → 6 in 5 turns)
2. **Passive Scaling**: At 5-6 charges, your damage is INSANE (+4d6 to +5d6 per attack)
3. **True Damage**: Every 3rd attack deals massive true damage that ignores all defenses
4. **Spend Decisions**: Save charges for passive bonuses or spend on powerful abilities
5. **Ultimate Timing**: Hexbreaker Fury at 6 charges can wipe entire groups
6. **Target Priority**: Focus evil magic users to build charges rapidly

You're not just a damage dealer—you're a WITCH HUNTER. Every charge makes you faster, stronger, deadlier. By the time you hit 6 charges, you're an unstoppable force of anti-magic fury.`
    }
  },

  // Resource System
  resourceSystem: {
    title: 'Hexbreaker System',
    subtitle: 'Accumulating Dark Energy Against Spellcasters',

    description: `The Covenbane's unique mechanic revolves around **Hexbreaker charges** - dark energy accumulated by attacking evil magic users or being targeted by spells. These charges increase the Covenbane's power exponentially, granting damage boosts, speed increases, and access to powerful abilities. Unlike mana or rage, Hexbreaker charges represent stolen dark energy turned against its source—the more you fight evil magic, the stronger you become.`,

    resourceBarExplanation: {
      title: 'Understanding Your Hexbreaker Charge Bar',
      content: `**What You See**: Your Hexbreaker charge bar displays as a d6 die with glowing segments, each segment representing one accumulated charge. As you build charges, the die fills with dark purple-silver energy, pulsing with stolen magical power.

**Visual Representation by Charge Level**:
- **0 Charges**: Empty die, no glow, you're at base power
- **1-2 Charges**: Dim purple glow, slight power building
- **3-4 Charges**: Bright purple-silver glow, significant power, die pulses
- **5 Charges**: Intense glow with dark energy crackling around the die
- **6 Charges**: MAXIMUM POWER - Die glows white-hot, lightning arcs between segments, ready for Hexbreaker Fury

**How It Changes**:
- **When You Hit Evil Magic Users**: +1 segment fills with dark energy (smooth fill animation)
- **When Targeted by Spells**: +1 segment fills (absorbing enemy magic)
- **When You Spend Charges**: Segments drain into your ability (energy flows from die to spell effect)
- **Out of Combat**: Charges slowly fade (1 per hour, dim glow effect)

**The Charge Counter**: Below the d6 is a numerical display showing "X/6 Charges" with color coding:
- **0-2 Charges**: White text (building phase)
- **3-4 Charges**: Yellow text (power spike)
- **5-6 Charges**: Red text (maximum power)

**Attack Counter (Witch Hunter's Precision)**: A small indicator shows "Attacks: 1/3" or "2/3" tracking your progress toward the true damage proc. When it hits "3/3", it flashes silver and resets after your next attack.

**Why This Matters**:

Hexbreaker charges are a **scaling resource** - the more you have, the stronger you become. Unlike mana (which you spend to cast spells), charges provide PASSIVE bonuses just by existing:
- 6 charges = +5d6 damage, +30ft speed, +4d8 true damage on 3rd attack
- 0 charges = No bonuses

This creates a fundamental decision: **Spend or Save?**
- **Spend**: Use charges on powerful abilities (Shadow Step, Curse Eater, Hexbreaker Fury)
- **Save**: Keep charges for massive passive bonuses

**The Covenbane's Dilemma**:
- High charges = Devastating passive damage (but vulnerable to losing charges if you need utility)
- Low charges = Weak damage (but you can build back up quickly)

**Strategic Depth**: Unlike other classes where resources are just "fuel" for abilities, Hexbreaker charges are BOTH fuel AND power. Every charge you spend on Shadow Step is a charge you're NOT using for +damage. Every charge you save for passive bonuses is a charge you're NOT spending on Curse Eater to save an ally.

**The Scaling Curve**: Charges scale EXPONENTIALLY, not linearly:
- 1 charge: +1d4 damage (average +2.5)
- 3 charges: +2d6 damage (average +7)
- 6 charges: +5d6 damage (average +17.5)

Going from 0 to 6 charges increases your damage by ~17.5 per attack, PLUS +30ft speed, PLUS +4d8 true damage every 3rd attack. This is why Covenbanes are terrifying at high charges—they become exponentially more dangerous.

**Master Covenbanes Know**:
- Build to 3 charges minimum before spending (3 is the power spike)
- Save 6 charges for Hexbreaker Fury only when facing multiple enemies
- Use Shadow Step (1 charge) freely at 5-6 charges (you'll still have 4-5 left)
- Never spend charges below 3 unless it's an emergency (Curse Eater to save ally)`
    },

    mechanics: {
      title: 'Detailed Mechanics',
      content: `**Accumulating Hexbreaker Charges (Building Power)**

**Maximum Capacity**: 6 charges (tracked with a d6)

**Generation Methods**:
1. **Attack Evil Magic User**: +1 charge per successful attack
   - Example: Hit a witch with crossbow → +1 charge
   - Example: Hit a cursed warlock with melee → +1 charge
   - Applies to: Witches, warlocks, cursed creatures, demons, evil spellcasters

2. **Targeted by Enemy Spell**: +1 charge when you are the target
   - Example: Witch casts "Curse of Weakness" at you → +1 charge (even if you save!)
   - Example: Warlock casts "Shadow Bolt" at you → +1 charge
   - Note: You gain the charge BEFORE resolving the spell (so you get stronger even from being attacked)

3. **Shadowbane Specialization Bonus**: +1 extra charge from stealth attacks
   - Example: Stealth attack on witch → +1 (hit) +1 (Shadowbane) = +2 charges total

**Persistence**:
- **In Combat**: Charges persist indefinitely
- **Between Combats**: Charges persist but decay at 1 per hour out of combat
- **Long Rest**: All charges reset to 0

**Using Hexbreaker Charges (Spending Power)**

**Passive Scaling (Always Active)**:
Charges provide automatic bonuses without spending them:
- **Damage Bonus**: Added to every attack (scales from +1d4 to +5d6)
- **Speed Bonus**: Added to movement (scales from +5ft to +30ft)
- **True Damage (Every 3rd Attack)**: Bonus true damage that ignores all armor/resistances (scales from +1d6 to +4d8)

**Example at 5 Charges**:
- Attack 1: 2d8 (crossbow) + 4d6 (charge bonus) = ~22 damage
- Attack 2: 2d8 (crossbow) + 4d6 (charge bonus) = ~22 damage
- Attack 3: 2d8 (crossbow) + 4d6 (charge bonus) + **3d8 TRUE DAMAGE** = ~38 damage (22 normal + 16 true)
- Movement: Base 30ft + 25ft (charge bonus) = 55ft per turn

**Active Abilities (Spending Charges)**:
You can spend charges to activate powerful abilities:
- **Shadow Step** (1 charge): Teleport 30ft, advantage on next attack
- **Curse Eater** (2 charges): Dispel curse/magic from ally
- **Dark Pursuit** (3 charges): Double movement speed for 1 minute
- **Spirit Shackle** (4 charges): Root enemy for 1 minute
- **Hexbreaker Fury** (6 charges): AoE damage + stun all enemies in 30ft

**When You Spend Charges**: They're consumed immediately
- Example: You have 5 charges, use Shadow Step (1 charge) → Now at 4 charges
- Example: You have 6 charges, use Hexbreaker Fury (6 charges) → Now at 0 charges

**Witch Hunter's Precision (Passive True Damage)**

**Mechanic**: Every **third attack** against evil magic users deals bonus true damage
- **Attack 1**: Normal damage + charge bonus
- **Attack 2**: Normal damage + charge bonus
- **Attack 3**: Normal damage + charge bonus + **TRUE DAMAGE** (ignores all defenses)
- **Attack 4**: Counter resets, back to Attack 1

**Scaling**: True damage scales with Hexbreaker charges
- 0 charges: +0 true damage
- 1 charge: +1d6 true damage
- 3 charges: +2d6 true damage
- 6 charges: +4d8 true damage

**Example at 6 Charges**:
- Attack 3 damage: 2d8 (weapon) + 5d6 (charge bonus) + **4d8 TRUE DAMAGE**
- Roll: [7, 8] + [5, 6, 4, 3, 2] + [7, 8, 6, 5] = 15 + 20 + 26 = 61 total damage!
- The 26 true damage ignores armor, resistances, shields, everything

**Strategic Balance**:
The key to mastering the Covenbane is knowing when to spend charges versus saving them for passive bonuses. At 6 charges, you're dealing massive damage passively—but Hexbreaker Fury can wipe an entire group. Choose wisely.`
    },

    // Hexbreaker Charge Scaling Table
    hexbreakerChargesTable: {
      title: 'Hexbreaker Charge Scaling',
      description: 'Passive bonuses granted by accumulated Hexbreaker charges. These bonuses are always active.',
      headers: ['Charges', 'Damage Bonus', 'Speed Bonus', 'True Damage (3rd Attack)', 'Special'],
      rows: [
        [
          '0',
          '+0',
          '+0 ft',
          '+0',
          'No bonuses'
        ],
        [
          '1',
          '+1d4',
          '+5 ft',
          '+1d6',
          'Slight power increase'
        ],
        [
          '2',
          '+1d6',
          '+10 ft',
          '+1d8',
          'Moderate power increase'
        ],
        [
          '3',
          '+2d6',
          '+15 ft',
          '+2d6',
          'Significant power increase'
        ],
        [
          '4',
          '+3d6',
          '+20 ft',
          '+2d8',
          'Major power increase'
        ],
        [
          '5',
          '+4d6',
          '+25 ft',
          '+3d8',
          'Massive power increase'
        ],
        [
          '6',
          '+5d6',
          '+30 ft',
          '+4d8',
          'Ultimate power, can use Hexbreaker Fury'
        ]
      ]
    },

    // Hexbreaker Abilities Table
    hexbreakerAbilitiesTable: {
      title: 'Hexbreaker Abilities',
      description: 'Active abilities that consume Hexbreaker charges. Choose when to spend charges strategically.',
      headers: ['Ability', 'Charge Cost', 'Effect', 'Range', 'Duration'],
      rows: [
        [
          'Vengeful Strike',
          '1-6 charges',
          'Deal weapon damage + (charges × proficiency) necrotic damage',
          'Melee',
          'Instant'
        ],
        [
          'Shadow Step',
          '1 charge',
          'Teleport to target, gain advantage on next attack',
          '30 ft',
          'Instant'
        ],
        [
          'Curse Eater',
          '2 charges',
          'Dispel curse or magical effect on self or ally',
          '15 ft',
          'Instant'
        ],
        [
          'Dark Pursuit',
          '3 charges',
          'Double movement speed, move through enemies without opportunity attacks',
          'Self',
          '1 minute'
        ],
        [
          'Spirit Shackle',
          '4 charges',
          'Root target in place (WIS save DC 8 + prof + DEX)',
          '30 ft',
          '1 minute'
        ],
        [
          'Hexbreaker Fury',
          '6 charges',
          'Deal (2 × level + weapon damage) necrotic to all in 30ft, stun 1 round',
          '30 ft radius',
          'Instant'
        ]
      ]
    },

    // Detection and Tracking Table
    detectionTrackingTable: {
      title: 'Witch Hunter Detection',
      description: 'The Covenbane has innate abilities to detect and track evil magic users.',
      headers: ['Ability', 'Range', 'Effect', 'Duration', 'Notes'],
      rows: [
        [
          'Sense Evil Magic',
          '60 ft',
          'Detect presence of cursed/evil magic users',
          'Concentration',
          'Can identify general direction'
        ],
        [
          'Mark of the Hunted',
          '120 ft',
          'Mark a spellcaster, see them through walls',
          '10 minutes',
          'Can only mark one target at a time'
        ],
        [
          'Curse Sight',
          '30 ft',
          'See all active curses and magical effects on targets',
          'Passive',
          'Always active'
        ],
        [
          'Anti-Magic Aura',
          '10 ft',
          'Spells cast within aura have disadvantage on attack rolls',
          'Passive',
          'Always active at 3+ charges'
        ]
      ]
    },

    strategicConsiderations: {
      title: 'Strategic Considerations',
      content: `**Charge Building**: Prioritize attacking evil magic users to build charges quickly. Being targeted by spells also generates charges - sometimes it's worth taking a hit to gain power.

**Charge Spending**: Low-cost abilities (Shadow Step, Curse Eater) provide tactical flexibility. High-cost abilities (Spirit Shackle, Hexbreaker Fury) are game-changers but reset your power.

**Target Priority**: Focus on evil spellcasters to maximize charge generation and true damage procs. Every third attack deals massive bonus true damage.

**Mobility Management**: Use Shadow Step for repositioning and Dark Pursuit for extended chases. High charges grant natural speed bonuses.

**Ultimate Timing**: Hexbreaker Fury at 6 charges is devastating but consumes all charges. Use when you can hit multiple high-value targets or need emergency CC.

**Specialization Synergy**: Shadowbane excels at stealth and burst, Spellbreaker at dispelling and anti-magic, Demonhunter at sustained damage against evil entities.`
    },

    practicalExample: {
      title: 'Practical Decision-Making Example',
      content: `**Scenario**: You're fighting a powerful warlock (60% HP) and his two cursed bodyguards (full HP). You have 4 Hexbreaker charges. Your party's healer just got cursed with "Curse of Decay" (taking 2d6 damage per turn). The warlock is channeling a ritual that will summon a demon in 2 turns.

**Current State**:
- Hexbreaker Charges: 4
- Warlock HP: ~60%
- Bodyguards: 2 at full HP
- Healer: Cursed (2d6 damage/turn)
- Ritual: Completes in 2 turns

**Your Passive Bonuses (4 Charges)**:
- +3d6 damage per attack
- +20ft movement speed
- +2d8 true damage on 3rd attack
- Attack Counter: 2/3 (next attack procs true damage!)

**Option A - Curse Eater (Save the Healer)**:
Use "Curse Eater" (2 charges) to dispel curse from healer
- Cost: 2 charges (4 → 2 remaining)
- Result: Healer saved, you lose +3d6 damage bonus (drops to +1d6)
- Pros: Healer survives, can continue healing party
- Cons: You lose significant damage output, still at 2 charges (weak)
- Risk: Warlock completes ritual while you're weak

**Option B - Spirit Shackle (Stop the Ritual)**:
Use "Spirit Shackle" (4 charges) to root warlock in place, interrupting ritual
- Cost: 4 charges (4 → 0 remaining)
- Result: Warlock rooted, ritual interrupted, you lose ALL bonuses
- Pros: Demon summoning prevented, warlock can't move
- Cons: You're at 0 charges (no bonuses), healer still cursed
- Risk: Healer dies to curse while you rebuild charges

**Option C - Attack Warlock (Build to 6 for Hexbreaker Fury)**:
Attack warlock, build charges, then use Hexbreaker Fury next turn
- Cost: 0 charges (4 → 5 after hit, then 6 next turn)
- Result: Warlock takes damage, you build to 6 charges
- Pros: Next turn you can Hexbreaker Fury all 3 enemies (warlock + bodyguards)
- Cons: Healer takes another 2d6 damage, ritual progresses (1 turn left)
- Risk: Healer might die, ritual might complete

**Option D - Attack Warlock (True Damage Proc) + Ask Ally to Dispel**:
Attack warlock with true damage proc, coordinate with party mage to dispel curse
- Cost: 0 charges (4 → 5 after hit)
- Result: Warlock takes massive damage (weapon + 3d6 + **2d8 true damage**), healer gets dispelled by ally
- Pros: High damage to warlock, healer saved, you keep building charges
- Cons: Requires coordination, ritual still progresses
- Risk: Party mage might not have dispel available

**Best Choice**: Option D (Attack + Coordinate)

**Why**:
1. **True Damage Proc**: You're at 2/3 attacks—next hit procs +2d8 true damage (ignores warlock's defenses)
2. **Charge Building**: You go from 4 → 5 charges, one away from Hexbreaker Fury
3. **Team Coordination**: Your party mage can dispel the curse (they have "Remove Curse" prepared)
4. **Damage Priority**: Killing the warlock stops the ritual permanently (better than rooting him)
5. **Resource Efficiency**: You don't spend charges, you BUILD them

**Execution**:
- **Your Action**: Attack warlock (3rd attack, true damage procs!)
  - Roll: 2d8 (crossbow) + 3d6 (4 charges) + **2d8 TRUE DAMAGE** → [7, 6] + [5, 4, 3] + [7, 8] = 13 + 12 + 15 = 40 damage!
  - Warlock HP: 60% → 35%
  - Hexbreaker Charges: 4 + 1 (hit evil magic user) = 5 charges
  - Attack Counter: Resets to 1/3

- **Party Mage's Action**: Casts "Remove Curse" on healer
  - Curse dispelled, healer saved

**Result**: Warlock badly wounded, healer saved, you're at 5 charges (one away from ultimate), ritual still has 1 turn left.

**Next Turn Strategy**:
- Attack warlock again → Build to 6 charges
- Warlock's turn: He either continues ritual OR defends himself (can't do both)
- If he continues ritual: Use Hexbreaker Fury (6 charges) to damage all 3 enemies + stun them, interrupting ritual
- If he defends: Attack again, likely kill him before ritual completes

**Alternative if Party Mage Doesn't Have Dispel**: Option A (Curse Eater)
- Why: Healer survival is critical. Lose 2 charges (4 → 2), but healer lives.
- Trade-off: You're weaker, but healer can keep party alive while you rebuild.

**Alternative if Healer Has High HP**: Option C (Build to 6 for Hexbreaker Fury)
- Why: If healer can survive 2 more turns of 2d6 damage (~7 damage/turn = 14 total), you can build to 6 and wipe all 3 enemies with Hexbreaker Fury.
- Risk: Healer might die, but if they survive, you win the fight decisively.

**The Lesson**: Covenbane decision-making involves:
1. **Charge Awareness**: Know your current bonuses and what you'd lose by spending
2. **True Damage Timing**: Track your attack counter (1/3, 2/3, 3/3) to maximize true damage procs
3. **Team Coordination**: Sometimes allies can handle utility (dispel, healing) while you focus on damage
4. **Spend Thresholds**:
   - Below 3 charges: Don't spend (too weak)
   - 3-4 charges: Spend on utility if necessary (Curse Eater, Shadow Step)
   - 5-6 charges: Consider ultimate (Hexbreaker Fury) or save for massive passive damage
5. **Target Priority**: Killing the warlock stops the ritual permanently (better than temporary solutions)

You're not just a damage dealer—you're a HUNTER. Every charge makes you deadlier. Spend wisely, or don't spend at all.`
    },

    playingInPerson: {
      title: 'Playing In Person',
      content: `**What You Need**:
- **6 Hexbreaker Charge Tokens** (coins, beads, or dice representing charges 0-6)
- **Passive Bonus Chart** (showing bonuses at each charge level)
- **True Damage Tracker** (for tracking 3rd attack true damage)
- **Attack Counter** (to track 1st, 2nd, 3rd attacks for Witch Hunter's Precision)
- **Ability Cost Reference** (showing charge costs for abilities)
- **Specialization Card** (showing spec-specific bonuses)

**Primary Tracking Method: Charge Tokens + Attack Counter**

The Covenbane builds Hexbreaker charges (0-6) by attacking evil spellcasters or being targeted by spells. Each charge grants exponentially increasing passive bonuses. Every 3rd attack deals bonus true damage. You can spend charges on powerful abilities or save them for devastating passive bonuses.

**Setup**:
\`\`\`
COVENBANE RESOURCE TRACKING:

HEXBREAKER CHARGES: [___] / 6

CHARGE GENERATION:
• +1 per attack vs evil magic users
• +1 when targeted by enemy spells
• Shadowbane spec: +1 extra from stealth attacks

PASSIVE BONUSES (Always Active):
Charges | Damage | Speed | True Damage (3rd Attack)
   0    |  +0%   |  +0   |        0
   1    |  +5%   | +5 ft |      1d6
   2    | +10%   | +10 ft|      2d6
   3    | +20%   | +15 ft|      3d6
   4    | +35%   | +20 ft|      4d6
   5    | +55%   | +25 ft|      5d6
   6    | +80%   | +30 ft|      6d6

WITCH HUNTER'S PRECISION:
• Every 3rd attack: Bonus true damage
• True damage = Charges × 1d6
• Bypasses all armor and resistances

ABILITY COSTS:
• Curse Eater (2 charges): Dispel curse/magic
• Shadow Step (3 charges): Teleport 30 ft
• Hexbreaker Fury (6 charges): Ultimate ability
\`\`\`

**How It Works**:

**Charge Generation**:
1. **Attack evil spellcaster** → +1 charge
2. **Targeted by spell** → +1 charge
3. **Add charge token** → Increase charge count
4. **Passive bonuses increase** → Check chart for new bonuses

**Passive Scaling (Always Active)**:
- **Damage Bonus**: All attacks deal increased damage
- **Speed Bonus**: Movement speed increased
- **True Damage**: Every 3rd attack deals bonus true damage

**Charge Spending**:
1. **Choose ability** → Check charge cost
2. **Remove charge tokens** → Subtract from charge count
3. **Activate ability** → Apply effects
4. **Passive bonuses decrease** → Check chart for new bonuses

**Example Charge Building**:

*You have 0 charges, attacking an evil warlock*

**Turn 1 - First Attack**:
1. "I attack the warlock!" (1st attack)
2. Attack roll: 1d20+5 → [16] + 5 = 21 (hit!)
3. Weapon damage: 1d8+3 → [6] + 3 = 9 damage
4. **Charge gained**: +1 (attacked evil spellcaster)
5. Add 1 charge token
6. Hexbreaker charges: 0 + 1 = **1 charge**
7. **New passive bonuses**: +5% damage, +5 ft speed, 1d6 true damage on 3rd attack

**Turn 2 - Second Attack**:
1. "I attack the warlock again!" (2nd attack)
2. Attack roll: 1d20+5 → [18] + 5 = 23 (hit!)
3. Weapon damage: 1d8+3 → [7] + 3 = 10 damage
4. Damage bonus (+5%): 10 × 1.05 = **10.5 damage** (round to 11)
5. **Charge gained**: +1 (attacked evil spellcaster)
6. Add 1 charge token
7. Hexbreaker charges: 1 + 1 = **2 charges**
8. **New passive bonuses**: +10% damage, +10 ft speed, 2d6 true damage on 3rd attack

**Turn 3 - Third Attack (True Damage!)**:
1. "I attack the warlock again!" (3rd attack - **Witch Hunter's Precision triggers!**)
2. Attack roll: 1d20+5 → [19] + 5 = 24 (hit!)
3. Weapon damage: 1d8+3 → [8] + 3 = 11 damage
4. Damage bonus (+10%): 11 × 1.10 = **12 damage**
5. **True damage**: 2d6 → [5,4] = **9 true damage** (bypasses armor!)
6. Total damage: 12 + 9 = **21 damage**
7. **Charge gained**: +1 (attacked evil spellcaster)
8. Add 1 charge token
9. Hexbreaker charges: 2 + 1 = **3 charges**
10. **New passive bonuses**: +20% damage, +15 ft speed, 3d6 true damage on 3rd attack
11. Reset attack counter to 1st attack

**Example Charge Spending**:

*You have 6 charges, using Hexbreaker Fury ultimate*

**Your Turn - Ultimate Ability**:
1. "I unleash Hexbreaker Fury!" (6 charges)
2. Remove all 6 charge tokens
3. Hexbreaker charges: 6 - 6 = **0 charges**
4. **Ultimate effect**: Next 3 attacks deal +6d6 true damage each, ignore resistances
5. **Passive bonuses reset**: +0% damage, +0 ft speed, 0 true damage on 3rd attack

**Example Being Targeted by Spell**:

*You have 3 charges, enemy mage casts Fireball at you*

**Enemy Mage's Turn**:
1. "The mage casts Fireball at you!"
2. Fireball damage: 8d6 → [6,5,4,6,3,5,4,6] = 39 fire damage
3. You take 39 fire damage
4. **Charge gained**: +1 (targeted by spell)
5. Add 1 charge token
6. Hexbreaker charges: 3 + 1 = **4 charges**
7. **New passive bonuses**: +35% damage, +20 ft speed, 4d6 true damage on 3rd attack

**Passive Bonus Chart**:
\`\`\`
═══════════════════════════════════
  HEXBREAKER CHARGE BONUSES
═══════════════════════════════════
0 CHARGES:
• Damage: +0%
• Speed: +0 ft
• True Damage (3rd): 0

1 CHARGE:
• Damage: +5%
• Speed: +5 ft
• True Damage (3rd): 1d6

2 CHARGES:
• Damage: +10%
• Speed: +10 ft
• True Damage (3rd): 2d6

3 CHARGES:
• Damage: +20%
• Speed: +15 ft
• True Damage (3rd): 3d6

4 CHARGES:
• Damage: +35%
• Speed: +20 ft
• True Damage (3rd): 4d6

5 CHARGES:
• Damage: +55%
• Speed: +25 ft
• True Damage (3rd): 5d6

6 CHARGES (MAX):
• Damage: +80%
• Speed: +30 ft
• True Damage (3rd): 6d6
═══════════════════════════════════
\`\`\`

**Ability Cost Reference Card**:
\`\`\`
═══════════════════════════════════
    COVENBANE ABILITIES
═══════════════════════════════════
CURSE EATER (2 charges):
• Dispel 1 curse or magical effect
• Range: Touch
• Action to use

SHADOW STEP (3 charges):
• Teleport up to 30 ft
• Must see destination
• Costs 1 AP to use

HEXBREAKER FURY (6 charges - ULTIMATE):
• Next 3 attacks: +6d6 true damage each
• Ignore all resistances and armor
• Lasts 3 attacks or 1 minute
• Action to activate
═══════════════════════════════════
\`\`\`

**Attack Counter Tracking**:
\`\`\`
═══════════════════════════════════
  WITCH HUNTER'S PRECISION
═══════════════════════════════════
ATTACK SEQUENCE:
1st Attack → Normal damage
2nd Attack → Normal damage
3rd Attack → Normal damage + TRUE DAMAGE

TRUE DAMAGE = Charges × 1d6
• 1 charge: +1d6 true damage
• 2 charges: +2d6 true damage
• 3 charges: +3d6 true damage
• 4 charges: +4d6 true damage
• 5 charges: +5d6 true damage
• 6 charges: +6d6 true damage

After 3rd attack, reset to 1st attack
═══════════════════════════════════
\`\`\`

**Example In-Person Turn**:

*You have 4 charges, attacking evil warlock (2nd attack in sequence)*

**Your Turn - Second Attack**:
1. "I attack the warlock!" (2nd attack)
2. Attack roll: 1d20+5 → [17] + 5 = 22 (hit!)
3. Weapon damage: 1d8+3 → [7] + 3 = 10 damage
4. Damage bonus (+35%): 10 × 1.35 = **13.5 damage** (round to 14)
5. **Charge gained**: +1 (attacked evil spellcaster)
6. Add 1 charge token
7. Hexbreaker charges: 4 + 1 = **5 charges**
8. **New passive bonuses**: +55% damage, +25 ft speed, 5d6 true damage on 3rd attack
9. Attack counter: 2nd → 3rd (next attack triggers true damage!)

**Next Turn - Third Attack (True Damage!)**:
1. "I attack the warlock again!" (3rd attack)
2. Attack roll: 1d20+5 → [19] + 5 = 24 (hit!)
3. Weapon damage: 1d8+3 → [8] + 3 = 11 damage
4. Damage bonus (+55%): 11 × 1.55 = **17 damage**
5. **True damage**: 5d6 → [6,5,4,6,5] = **26 true damage** (bypasses armor!)
6. Total damage: 17 + 26 = **43 damage**
7. **Charge gained**: +1 (attacked evil spellcaster)
8. Add 1 charge token
9. Hexbreaker charges: 5 + 1 = **6 charges** (MAX!)
10. **New passive bonuses**: +80% damage, +30 ft speed, 6d6 true damage on 3rd attack
11. Reset attack counter to 1st attack

**Alternative Tracking Methods**:

**Method 1: D6 Die**
- Rotate die to show current charges (1-6)
- Quick and visual
- Single die tracks everything

**Method 2: Token Stack**
- Stack tokens vertically (1-6 tokens)
- Visual representation of power
- Satisfying to add/remove

**Method 3: Charge Track**
- Linear track with 6 spaces
- Move marker along track
- Clear visual progression

**Method 4: Paper Tracking**
- Write charge count on paper
- Cross out and rewrite as it changes
- Minimalist approach

**Attack Counter Methods**:

**Method 1: Three Coins**
- Flip coins to show 1st, 2nd, 3rd attack
- Visual sequence tracking

**Method 2: D3 Die**
- Rotate die to show attack number
- Simple and compact

**Method 3: Tally Marks**
- Mark attacks on paper (/, //, ///)
- Cross out after 3rd attack

**Quick Reference Card Template**:
\`\`\`
COVENBANE QUICK REFERENCE

CHARGE GENERATION:
• Attack evil spellcaster: +1 charge
• Targeted by spell: +1 charge
• Shadowbane spec: +1 extra from stealth

PASSIVE BONUSES (Always Active):
• 0 charges: +0% damage, +0 ft speed
• 3 charges: +20% damage, +15 ft speed
• 6 charges: +80% damage, +30 ft speed

WITCH HUNTER'S PRECISION:
• Every 3rd attack: Bonus true damage
• True damage = Charges × 1d6
• Bypasses all armor and resistances

ABILITIES:
• Curse Eater (2 charges): Dispel curse
• Shadow Step (3 charges): Teleport 30 ft
• Hexbreaker Fury (6 charges): Ultimate

STRATEGY:
• Build charges by attacking spellcasters
• Save 6 charges for ultimate ability
• Use true damage on high-armor targets
• Spend charges on utility when needed
\`\`\`

**Thematic Enhancements**:

Many players enhance the Covenbane experience with:
- **Silver Tokens**: Silver coins for Hexbreaker charges (witch hunter theme)
- **Dark Dice**: Black/purple dice for true damage rolls
- **Charge Glow**: LED tea light that brightens with more charges
- **Attack Tracker**: Three-sided token showing attack sequence
- **Hunter's Mark**: Physical token marking targeted spellcaster
- **Shadow Step Marker**: Token showing teleport destination

**Charge Management Tips**:

**Building Strategy**:
- **Prioritize Spellcasters**: Attack evil magic users for charges
- **Tank Spells**: Get targeted by spells for bonus charges
- **Shadowbane Spec**: Use stealth attacks for extra charges
- **Rapid Building**: Focus fire on one spellcaster to build quickly
- **Max Charges**: Aim for 6 charges for maximum power

**Spending Strategy**:
- **Save for Ultimate**: 6 charges = Hexbreaker Fury (devastating)
- **Utility Spending**: Use 2-3 charges for Curse Eater or Shadow Step when needed
- **Passive vs Active**: Weigh passive bonuses against ability effects
- **Don't Waste**: Only spend charges when necessary
- **Rebuild Quickly**: After spending, focus on rebuilding charges

**Combat Strategy**:
- **Track Attacks**: Know when 3rd attack is coming for true damage
- **High-Armor Targets**: Use true damage on heavily armored enemies
- **Mobility**: Use speed bonuses to chase down fleeing spellcasters
- **Burst Windows**: Activate ultimate at 6 charges for massive damage

**Why This System Works**: The charge system creates exponential power scaling that feels incredibly satisfying. Going from 0 charges (weak) to 6 charges (devastating) creates a clear power fantasy. The physical act of adding charge tokens creates positive reinforcement—every attack makes you stronger. The 3rd attack true damage mechanic creates rhythm and anticipation. The spend-vs-save decision (use charges on abilities or keep for passive bonuses) creates meaningful strategic choices. The system is simple to track but creates deep gameplay.

**Pro Tips**:
- **Quick Math**: Round damage bonuses for speed (35% of 10 = 3.5 → 4)
- **Track Attacks**: Use coins or die to track 1st/2nd/3rd attack sequence
- **Charge Awareness**: Know your current bonuses at each charge level
- **Ultimate Timing**: Save 6 charges for critical moments
- **True Damage Focus**: Use 3rd attacks on high-armor targets
- **Rebuild Fast**: After spending charges, focus on rebuilding

**Budget-Friendly Alternatives**:
- **No tokens?** Use coins (pennies, dimes, quarters)
- **No die?** Write charge count on paper
- **No attack tracker?** Tally marks on paper (/, //, ///)
- **Minimalist**: Track charges and attack number on paper

**Specialization-Specific Tracking**:

**Shadowbane**:
- Track +1 extra charge from stealth attacks
- Mark when attacking from stealth
- Bonus charges accelerate building

**Witch Slayer**:
- Track enhanced true damage (+1d6 extra)
- Mark when fighting spellcasters
- True damage even more devastating

**Relentless Pursuit**:
- Track extended ultimate duration
- Mark when Hexbreaker Fury is active
- Longer burst windows

**Why Covenbane Is Perfect for In-Person Play**: The class is built around simple charge accumulation that creates exponential power scaling. The physical act of adding charge tokens creates satisfying feedback—every attack makes you visibly stronger. The 3rd attack true damage mechanic creates rhythm and anticipation (1st, 2nd, 3rd!). The passive bonus chart provides clear milestones (3 charges = power spike, 6 charges = ultimate). The spend-vs-save decision creates meaningful strategic choices. The system is simple enough to track mid-combat but creates deep strategic gameplay. Every charge gained feels like progress, and every 3rd attack feels like a payoff.`
    }
  },

  // Specializations
  specializations: {
    title: 'Covenbane Specializations',
    subtitle: 'Three Paths of Witch Hunting',

    description: `Covenbanes can specialize in three distinct approaches to hunting evil magic users, each focusing on different aspects of the Hexbreaker system and anti-magic combat.`,

    passiveAbility: {
      name: 'Witch Hunter\'s Precision',
      description: 'Every third attack against cursed or evil magic users deals bonus true damage that scales with Hexbreaker charges (base +1d6, up to +4d8 at 6 charges). This damage ignores all resistances and armor.'
    },

    specs: [
      {
        name: 'Shadowbane',
        icon: 'fas fa-user-ninja',
        description: 'Masters of stealth and assassination. Shadowbanes excel at infiltrating enemy lines and delivering devastating burst damage from the shadows.',

        passiveAbility: {
          name: 'Shadow Mastery',
          description: 'Gain expertise in Stealth. When attacking from stealth with 3+ Hexbreaker charges, your first attack automatically crits and generates +1 additional charge.'
        },

        keyAbilities: [
          {
            name: 'Umbral Assault',
            cost: '2 Hexbreaker Charges',
            effect: 'Enter stealth for 6 seconds even in combat. Your next attack from stealth deals +3d8 necrotic damage and silences the target for 2 rounds (cannot cast spells).'
          },
          {
            name: 'Night\'s Edge',
            cost: '3 Hexbreaker Charges',
            effect: 'Your attacks ignore armor and magical shields for 1 minute. Additionally, gain +2d6 damage against targets with active magical buffs.'
          },
          {
            name: 'Execution',
            cost: '5 Hexbreaker Charges',
            effect: 'If target is below half HP, instantly kill them (CON save DC 18 to survive with 1 HP). If target survives or is above half HP, deal 6d10 necrotic damage instead.'
          }
        ]
      },
      {
        name: 'Spellbreaker',
        icon: 'fas fa-shield-alt',
        description: 'Masters of anti-magic and dispelling. Spellbreakers excel at neutralizing magical threats and protecting allies from harmful spells.',

        passiveAbility: {
          name: 'Arcane Resistance',
          description: 'Gain advantage on all saves against spells. When you successfully save against a spell, gain +1 Hexbreaker charge and reflect 2d8 force damage back to the caster.'
        },

        keyAbilities: [
          {
            name: 'Counterspell Strike',
            cost: '2 Hexbreaker Charges',
            effect: 'As a reaction when an enemy casts a spell within 60ft, make a melee attack. If it hits, the spell is countered and you gain +2 Hexbreaker charges.'
          },
          {
            name: 'Dispel Field',
            cost: '3 Hexbreaker Charges',
            effect: 'Create a 20ft radius anti-magic field centered on you for 1 minute. All magical effects in the field are suppressed, and spells cast into it automatically fail.'
          },
          {
            name: 'Mana Drain',
            cost: '4 Hexbreaker Charges',
            effect: 'Target spellcaster loses 4d6 mana and cannot cast spells for 2 rounds. You gain temporary HP equal to mana drained. If target has no mana, they take 4d6 psychic damage instead.'
          }
        ]
      },
      {
        name: 'Demonhunter',
        icon: 'fas fa-skull',
        description: 'Masters of hunting evil entities and demons. Demonhunters excel at sustained damage against cursed targets and tracking dark magic users.',

        passiveAbility: {
          name: 'Relentless Pursuit',
          description: 'Your movement speed is increased by +10ft for each Hexbreaker charge you have. Additionally, you cannot be slowed or rooted while you have 3+ charges.'
        },

        keyAbilities: [
          {
            name: 'Hunter\'s Mark',
            cost: '1 Hexbreaker Charge',
            effect: 'Mark an evil magic user for 10 minutes. You can see them through walls, they cannot become invisible to you, and your attacks against them deal +2d6 radiant damage.'
          },
          {
            name: 'Condemn',
            cost: '3 Hexbreaker Charges',
            effect: 'Knock target back 20ft and pin them to a wall/surface. They are stunned for 1 round and take 4d8 radiant damage. If they hit a wall, damage is doubled.'
          },
          {
            name: 'Final Hour',
            cost: '5 Hexbreaker Charges',
            effect: 'Enter a state of ultimate focus for 1 minute. Gain +5 armor, +30ft movement, advantage on all attacks, and your Witch Hunter\'s Precision triggers on every attack (not just third).'
          }
        ]
      }
    ]
  },

  // Example Spells - organized by specialization
  exampleSpells: [
    // ===== SHADOWBANE SPECIALIZATION =====
    {
      id: 'cov_umbral_assault',
      name: 'Umbral Assault',
      description: 'Enter stealth even in combat and deliver a devastating silencing strike from the shadows.',
      spellType: 'ACTION',
      icon: 'ability_stealth',
      school: 'Shadow',
      level: 3,
      specialization: 'shadowbane',

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
        durationType: 'duration',
        duration: 2,
        durationUnit: 'rounds'
      },

      resourceCost: {
        hexbreakerCharges: 2,
        components: ['somatic'],
        somaticText: 'Meld into shadows and strike'
      },

      resolution: 'ATTACK_ROLL',

      damageConfig: {
        formula: '3d8',
        modifier: 'DEXTERITY',
        damageType: 'necrotic',
        bonusDamage: {
          condition: 'from_stealth',
          amount: '+3d8',
          description: 'Bonus damage when attacking from stealth'
        }
      },

      effects: {
        stealth: {
          duration: '6 seconds',
          description: 'Enter stealth even in combat'
        },
        damage: {
          instant: {
            amount: '3d8 + DEX',
            type: 'necrotic',
            description: 'Necrotic damage from shadow strike'
          }
        },
        silence: {
          duration: '2 rounds',
          description: 'Target cannot cast spells for 2 rounds'
        }
      },

      specialMechanics: {
        shadowbaneBonus: {
          enabled: true,
          effect: 'Shadowbanes with 3+ charges automatically crit on the attack from stealth'
        },
        combatStealth: {
          description: 'Unique ability to enter stealth during active combat'
        }
      },

      tags: ['melee', 'stealth', 'damage', 'silence', 'shadowbane']
    },

    {
      id: 'cov_execution',
      name: 'Execution',
      description: 'Attempt to execute a wounded target, instantly killing them or dealing massive damage.',
      spellType: 'ACTION',
      icon: 'ability_rogue_deadliness',
      school: 'Shadow',
      level: 7,
      specialization: 'shadowbane',

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
        mana: 10,
        hexbreakerCharges: 5,
        components: ['somatic', 'verbal'],
        verbalText: 'Your time ends now!',
        somaticText: 'Deliver killing blow'
      },

      savingThrow: {
        enabled: true,
        attribute: 'constitution',
        difficulty: 18,
        onSuccess: 'survive_with_1hp',
        onFailure: 'instant_death'
      },

      resolution: 'ATTACK_ROLL',

      damageConfig: {
        formula: '6d10',
        modifier: 'DEXTERITY',
        damageType: 'necrotic',
        attackType: 'weapon_attack'
      },

      effects: {
        execution: {
          threshold: 'Half HP',
          effect: 'Instant death',
          save: 'CON DC 18 to survive with 1 HP',
          description: 'If target is below half HP, attempt instant kill'
        },
        damage: {
          instant: {
            amount: '6d10 + DEX',
            type: 'necrotic',
            description: 'Damage if execution fails or target above threshold'
          }
        }
      },

      specialMechanics: {
        shadowbaneBonus: {
          enabled: true,
          effect: 'Shadowbanes can execute targets at 3/4 HP (instead of half HP)'
        },
        highRisk: {
          description: 'Consumes 5 charges - use strategically on high-value targets'
        }
      },

      tags: ['melee', 'damage', 'execute', 'ultimate', 'shadowbane']
    },

    // ===== SPELLBREAKER SPECIALIZATION =====
    {
      id: 'cov_counterspell_strike',
      name: 'Counterspell Strike',
      description: 'React to an enemy spell by striking them, countering the spell and gaining charges.',
      spellType: 'REACTION',
      icon: 'spell_holy_dispelmagic',
      school: 'Anti-Magic',
      level: 4,
      specialization: 'spellbreaker',

      typeConfig: {
        castTime: 1,
        castTimeType: 'REACTION',
        trigger: 'Enemy casts spell within 60ft'
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
        hexbreakerCharges: 2,
        components: ['somatic'],
        somaticText: 'Strike to disrupt spell'
      },

      resolution: 'ATTACK_ROLL',

      damageConfig: {
        formula: '2d8',
        modifier: 'DEXTERITY',
        damageType: 'force',
        attackType: 'weapon_attack'
      },

      effects: {
        counterspell: {
          description: 'If attack hits, the spell being cast is countered'
        },
        damage: {
          instant: {
            amount: '2d8 + DEX',
            type: 'force',
            description: 'Force damage from disrupting strike'
          }
        },
        chargeGain: {
          amount: 2,
          description: 'Gain +2 Hexbreaker charges on successful counter'
        }
      },

      specialMechanics: {
        spellbreakerBonus: {
          enabled: true,
          effect: 'Spellbreakers gain +3 charges (instead of +2) and reflect 1d8 damage to caster even if attack misses'
        },
        reactiveCounter: {
          description: 'Unique melee-range counterspell that rewards aggressive positioning'
        }
      },

      tags: ['reaction', 'counterspell', 'anti-magic', 'spellbreaker']
    },

    {
      id: 'cov_dispel_field',
      name: 'Dispel Field',
      description: 'Create an anti-magic field that suppresses all magical effects and prevents spellcasting.',
      spellType: 'ACTION',
      icon: 'spell_holy_dispelmagic',
      school: 'Anti-Magic',
      level: 5,
      specialization: 'spellbreaker',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'aoe',
        rangeType: 'self',
        rangeDistance: 0,
        aoeType: 'sphere',
        aoeSize: 20
      },

      durationConfig: {
        durationType: 'concentration',
        duration: 1,
        durationUnit: 'minutes'
      },

      resourceCost: {
        mana: 8,
        hexbreakerCharges: 3,
        components: ['verbal', 'somatic'],
        verbalText: 'Magic shall not pass!',
        somaticText: 'Create anti-magic barrier'
      },

      resolution: 'AUTOMATIC',

      effects: {
        antiMagicField: {
          radius: 20,
          duration: '1 minute (concentration)',
          effects: [
            'All magical effects suppressed',
            'Spells cast into field automatically fail',
            'Magical items become mundane',
            'Supernatural abilities disabled'
          ],
          description: 'Complete anti-magic zone centered on you'
        },
        mobility: {
          description: 'Field moves with you as you move'
        }
      },

      specialMechanics: {
        spellbreakerBonus: {
          enabled: true,
          effect: 'Spellbreakers increase radius to 30ft and can exclude allies from suppression'
        },
        selfSuppression: {
          description: 'Your own magical abilities are also suppressed while field is active'
        }
      },

      tags: ['aoe', 'anti-magic', 'suppression', 'concentration', 'spellbreaker']
    },

    {
      id: 'cov_mana_drain',
      name: 'Mana Drain',
      description: 'Drain mana from a spellcaster, preventing them from casting and gaining temporary HP.',
      spellType: 'ACTION',
      icon: 'spell_shadow_manafeed',
      school: 'Anti-Magic',
      level: 6,
      specialization: 'spellbreaker',

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
        durationType: 'duration',
        duration: 2,
        durationUnit: 'rounds'
      },

      resourceCost: {
        mana: 9,
        hexbreakerCharges: 4,
        components: ['verbal', 'somatic'],
        verbalText: 'Your power is mine!',
        somaticText: 'Drain magical energy'
      },

      savingThrow: {
        enabled: true,
        attribute: 'intelligence',
        difficulty: 16,
        onSuccess: 'half_drain',
        onFailure: 'full_drain'
      },

      resolution: 'SAVING_THROW',

      damageConfig: {
        formula: '4d6',
        modifier: 'INTELLIGENCE',
        damageType: 'psychic',
        attackType: 'spell_save'
      },

      effects: {
        manaDrain: {
          amount: '4d6',
          description: 'Target loses 4d6 mana'
        },
        silence: {
          duration: '2 rounds',
          description: 'Target cannot cast spells for 2 rounds'
        },
        tempHP: {
          amount: 'mana_drained',
          description: 'Gain temporary HP equal to mana drained'
        },
        fallback: {
          condition: 'target_has_no_mana',
          damage: '4d6 psychic',
          description: 'If target has no mana, deal psychic damage instead'
        }
      },

      specialMechanics: {
        spellbreakerBonus: {
          enabled: true,
          effect: 'Spellbreakers drain 6d6 mana (instead of 4d6) and extend silence duration to 3 rounds'
        },
        antiCaster: {
          description: 'Devastating against spellcasters, neutralizing their primary resource'
        }
      },

      tags: ['single-target', 'mana-drain', 'silence', 'anti-magic', 'spellbreaker']
    },

    // ===== DEMONHUNTER SPECIALIZATION =====
    {
      id: 'cov_hunters_mark',
      name: 'Hunter\'s Mark',
      description: 'Mark an evil magic user for tracking and bonus damage.',
      spellType: 'ACTION',
      icon: 'ability_hunter_markedfordeath',
      school: 'Tracking',
      level: 2,
      specialization: 'demonhunter',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 120
      },

      durationConfig: {
        durationType: 'duration',
        duration: 10,
        durationUnit: 'minutes'
      },

      resourceCost: {
        hexbreakerCharges: 1,
        components: ['verbal'],
        verbalText: 'You are marked for death'
      },

      resolution: 'AUTOMATIC',

      effects: {
        mark: {
          duration: '10 minutes',
          effects: [
            'See target through walls',
            'Target cannot become invisible to you',
            '+2d6 radiant damage on attacks',
            'Know exact distance and direction'
          ],
          description: 'Mark reveals and enhances damage against target'
        },
        tracking: {
          description: 'Can track marked target across any distance within same plane'
        }
      },

      specialMechanics: {
        demonhunterBonus: {
          enabled: true,
          effect: 'Demonhunters increase bonus damage to +3d6 and can mark up to 2 targets simultaneously'
        },
        singleTarget: {
          description: 'Can only have one mark active at a time (two for Demonhunters)'
        }
      },

      tags: ['utility', 'tracking', 'damage-buff', 'demonhunter']
    },

    {
      id: 'cov_condemn',
      name: 'Condemn',
      description: 'Knock target back and pin them to a wall, stunning them and dealing massive damage.',
      spellType: 'ACTION',
      icon: 'ability_paladin_judgementsofthejust',
      school: 'Radiant',
      level: 5,
      specialization: 'demonhunter',

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
        durationType: 'duration',
        duration: 1,
        durationUnit: 'rounds'
      },

      resourceCost: {
        mana: 7,
        hexbreakerCharges: 3,
        components: ['verbal', 'somatic'],
        verbalText: 'Be condemned!',
        somaticText: 'Knock target back with force'
      },

      savingThrow: {
        enabled: true,
        attribute: 'strength',
        difficulty: 16,
        onSuccess: 'half_knockback',
        onFailure: 'full_effect'
      },

      resolution: 'ATTACK_ROLL',

      damageConfig: {
        formula: '4d8',
        modifier: 'DEXTERITY',
        damageType: 'radiant',
        bonusDamage: {
          condition: 'hits_wall',
          amount: '×2',
          description: 'Damage doubled if target hits a wall'
        }
      },

      effects: {
        knockback: {
          distance: '20 ft',
          description: 'Knock target back 20ft'
        },
        pin: {
          condition: 'hits_wall',
          duration: '1 round',
          description: 'If target hits wall, they are pinned and stunned'
        },
        damage: {
          instant: {
            amount: '4d8 + DEX',
            type: 'radiant',
            description: 'Radiant damage (doubled if hits wall)'
          }
        }
      },

      specialMechanics: {
        demonhunterBonus: {
          enabled: true,
          effect: 'Demonhunters increase knockback to 30ft and stun duration to 2 rounds'
        },
        environmentalDamage: {
          description: 'Damage doubles if target is knocked into a wall or obstacle'
        }
      },

      tags: ['melee', 'damage', 'knockback', 'stun', 'demonhunter']
    },

    {
      id: 'cov_final_hour',
      name: 'Final Hour',
      description: 'Enter a state of ultimate focus, becoming an unstoppable hunter for 1 minute.',
      spellType: 'ACTION',
      icon: 'spell_holy_avenginewrath',
      school: 'Enhancement',
      level: 7,
      specialization: 'demonhunter',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self',
        rangeDistance: 0
      },

      durationConfig: {
        durationType: 'duration',
        duration: 1,
        durationUnit: 'minutes'
      },

      resourceCost: {
        mana: 12,
        hexbreakerCharges: 5,
        components: ['verbal', 'somatic'],
        verbalText: 'This is my final hour!',
        somaticText: 'Channel ultimate hunter focus'
      },

      resolution: 'AUTOMATIC',

      effects: {
        enhancement: {
          duration: '1 minute',
          effects: [
            '+5 armor',
            '+30ft movement speed',
            'Advantage on all attacks',
            'Witch Hunter\'s Precision on every attack (not just third)',
            'Cannot be slowed, stunned, or rooted',
            'Immune to fear and charm'
          ],
          description: 'Become an unstoppable hunter'
        },
        trueDamage: {
          description: 'Every attack triggers Witch Hunter\'s Precision (bonus true damage)'
        }
      },

      specialMechanics: {
        demonhunterBonus: {
          enabled: true,
          effect: 'Demonhunters extend duration to 2 minutes and gain +10 armor (instead of +5)'
        },
        ultimatePower: {
          description: 'Devastating ultimate ability that makes you nearly invincible for its duration'
        }
      },

      tags: ['self-buff', 'enhancement', 'ultimate', 'demonhunter']
    },

    // ===== UNIVERSAL ABILITIES =====
    {
      id: 'cov_shadow_step',
      name: 'Shadow Step',
      description: 'Teleport to a target and gain advantage on your next attack.',
      spellType: 'ACTION',
      icon: 'ability_rogue_shadowstep',
      school: 'Shadow',
      level: 1,
      specialization: 'universal',

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
        durationType: 'instant'
      },

      resourceCost: {
        hexbreakerCharges: 1,
        components: ['somatic'],
        somaticText: 'Vanish and reappear'
      },

      resolution: 'AUTOMATIC',

      effects: {
        teleport: {
          range: '30 ft',
          description: 'Instantly teleport to target location'
        },
        advantage: {
          duration: 'next_attack',
          description: 'Gain advantage on your next attack'
        }
      },

      specialMechanics: {
        mobility: {
          description: 'Excellent for repositioning, gap closing, or escaping'
        },
        lowCost: {
          description: 'Only costs 1 charge, making it highly spammable'
        }
      },

      tags: ['utility', 'teleport', 'mobility', 'universal']
    },

    {
      id: 'cov_vengeful_strike',
      name: 'Vengeful Strike',
      description: 'Channel Hexbreaker charges into a devastating strike.',
      spellType: 'ACTION',
      icon: 'ability_warrior_revenge',
      school: 'Physical',
      level: 2,
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
        hexbreakerCharges: '1-6',
        components: ['somatic'],
        somaticText: 'Strike with dark energy'
      },

      resolution: 'ATTACK_ROLL',

      damageConfig: {
        formula: 'weapon',
        modifier: 'DEXTERITY',
        damageType: 'necrotic',
        bonusDamage: {
          condition: 'per_charge',
          amount: 'charges × proficiency',
          description: 'Bonus necrotic damage scales with charges spent'
        }
      },

      effects: {
        damage: {
          instant: {
            amount: 'Weapon + (charges × proficiency bonus) necrotic',
            type: 'mixed',
            description: 'Physical weapon damage plus scaling necrotic damage'
          }
        },
        scaling: {
          description: 'Can spend 1-6 charges for variable damage output'
        }
      },

      specialMechanics: {
        flexibleCost: {
          description: 'Choose how many charges to spend (1-6) for variable damage'
        },
        darkEnergy: {
          description: 'Weapon glows with dark energy proportional to charges spent'
        }
      },

      tags: ['melee', 'damage', 'scaling', 'universal']
    },

    {
      id: 'cov_curse_eater',
      name: 'Curse Eater',
      description: 'Absorb and neutralize a curse or magical effect.',
      spellType: 'ACTION',
      icon: 'spell_shadow_curseofachimonde',
      school: 'Anti-Magic',
      level: 3,
      specialization: 'universal',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'touch',
        rangeDistance: 15
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        hexbreakerCharges: 2,
        components: ['somatic', 'verbal'],
        verbalText: 'I consume your curse!',
        somaticText: 'Draw curse into yourself'
      },

      resolution: 'AUTOMATIC',

      effects: {
        dispel: {
          targets: ['curse', 'magical_effect', 'debuff'],
          description: 'Remove one curse or magical effect from target'
        },
        absorption: {
          description: 'Convert absorbed curse into raw power (flavor)'
        }
      },

      specialMechanics: {
        versatileDispel: {
          description: 'Can target self or ally within 15ft'
        },
        powerConversion: {
          description: 'Neutralizes curse and converts it into Hexbreaker energy (flavor)'
        }
      },

      tags: ['utility', 'dispel', 'anti-magic', 'universal']
    },

    {
      id: 'cov_spirit_shackle',
      name: 'Spirit Shackle',
      description: 'Bind an enemy\'s spirit to the ground, immobilizing them.',
      spellType: 'ACTION',
      icon: 'spell_shadow_shackleundead',
      school: 'Shadow',
      level: 6,
      specialization: 'universal',

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
        durationType: 'duration',
        duration: 1,
        durationUnit: 'minutes'
      },

      resourceCost: {
        mana: 8,
        hexbreakerCharges: 4,
        components: ['verbal', 'somatic'],
        verbalText: 'Be bound!',
        somaticText: 'Summon dark tendrils'
      },

      savingThrow: {
        enabled: true,
        attribute: 'wisdom',
        difficulty: '8 + prof + DEX',
        onSuccess: 'no_effect',
        onFailure: 'rooted'
      },

      resolution: 'SAVING_THROW',

      effects: {
        root: {
          duration: '1 minute',
          description: 'Target cannot move from their current location'
        },
        visualEffect: {
          description: 'Dark tendrils of energy wrap around target, anchoring them'
        }
      },

      specialMechanics: {
        longDuration: {
          description: 'Lasts up to 1 minute - extremely long CC duration'
        },
        malevolentForce: {
          description: 'Dark energy physically binds target to the spot'
        }
      },

      tags: ['single-target', 'crowd-control', 'root', 'universal']
    },

    {
      id: 'cov_hexbreaker_fury',
      name: 'Hexbreaker Fury',
      description: 'Unleash all accumulated Hexbreaker charges in a cataclysmic burst of dark energy.',
      spellType: 'ACTION',
      icon: 'spell_shadow_shadowworddominate',
      school: 'Shadow',
      level: 8,
      specialization: 'universal',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'aoe',
        rangeType: 'self',
        rangeDistance: 0,
        aoeType: 'sphere',
        aoeSize: 30
      },

      durationConfig: {
        durationType: 'duration',
        duration: 1,
        durationUnit: 'rounds'
      },

      resourceCost: {
        mana: 15,
        hexbreakerCharges: 6,
        components: ['verbal', 'somatic'],
        verbalText: 'HEXBREAKER FURY!',
        somaticText: 'Release all accumulated dark energy'
      },

      savingThrow: {
        enabled: true,
        attribute: 'constitution',
        difficulty: 18,
        onSuccess: 'half_damage_no_stun',
        onFailure: 'full_effect'
      },

      resolution: 'SAVING_THROW',

      damageConfig: {
        formula: '2d6',
        modifier: 'LEVEL',
        damageType: 'necrotic',
        bonusDamage: {
          condition: 'weapon_damage',
          amount: 'weapon_damage',
          description: 'Add weapon damage to the burst'
        }
      },

      effects: {
        damage: {
          instant: {
            amount: '(2 × level) + weapon damage',
            type: 'necrotic',
            description: 'Massive necrotic damage to all enemies in 30ft'
          }
        },
        stun: {
          duration: '1 round',
          description: 'All enemies hit are stunned for 1 round'
        },
        aoe: {
          radius: 30,
          description: 'Affects all enemies within 30ft radius'
        }
      },

      specialMechanics: {
        ultimateAbility: {
          description: 'Requires maximum 6 Hexbreaker charges - ultimate ability'
        },
        chargeReset: {
          description: 'Consumes all 6 charges, resetting you to 0'
        },
        devastatingBurst: {
          description: 'Can turn the tide of battle by stunning and damaging all nearby enemies'
        }
      },

      tags: ['aoe', 'damage', 'stun', 'ultimate', 'universal']
    }
  ]
};

export default COVENBANE_DATA;




