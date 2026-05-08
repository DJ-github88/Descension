/**
 * Lichborne Class Data
 * 
 * Complete class information for the Lichborne - a frost-wielding undead
 * master who balances life-draining aura with phylactery resurrection.
 */

export const LICHBORNE_DATA = {
  id: 'lichborne',
  name: 'Lichborne',
  icon: 'fas fa-skull',
  role: 'Damage/Control',
  damageTypes: ['necrotic', 'frost'],

  // Overview section
  overview: {
    title: 'The Lichborne',
    subtitle: 'Eternal Frost and Undying Will',

    quickOverview: {
      title: 'Quick Overview',
      content: `**What You Need to Know**: The Lichborne switches between two casting modes — Normal Mode (spells cost Mana) and Aura Mode (spells cost HP instead of Mana, dealing enhanced damage). Their Phylactery charges by killing enemies and provides resurrection on death.

**Core Mechanic**: Toggle Eternal Frost Aura → Spells cost HP instead of Mana → +1d6 frost damage + chill on all spells → Phylactery charges per kill → Resurrect on death

**Resources**: Mana (Normal Mode), HP (Aura Mode), Phylactery HP (harvested from kills)

**Playstyle**: Dual-mode caster — safe and sustainable in Normal Mode, glass cannon in Aura Mode. Death is a tactical reset, not a failure.

**Best For**: Players who enjoy risk-reward management, undead fantasy, life-draining aggression, and turning death into a weapon`,
    },

    description: `The Lichborne is a frost-wielding undead who turns death itself into a resource. Their core mechanic is **Dual-Mode Casting**: in Normal Mode, frost spells cost Mana like any caster. But when the Eternal Frost Aura is activated, all frost spells cost **HP instead of Mana** and deal enhanced damage (+1d6 frost, chill on hit). The Lichborne's Phylactery charges by **killing enemies** — each kill adds 1d6 HP to the Phylactery pool, which can be spent to resurrect when the Lichborne dies. This creates a predator's loop: kill to charge your Phylactery, burn your own HP for devastating power, die, resurrect from your harvested life force, and do it again.`,
    
    roleplayIdentity: {
      title: 'Roleplay Identity',
      content: `Lichborne are individuals who have transcended death through forbidden rituals, binding their soul to a phylactery. They exist in a state between life and death, wielding frost magic that mirrors their cold, undying nature. The phylactery is both their greatest strength and their most vulnerable weakness.

**Philosophy**: Death is not the end, but a transformation. The Lichborne believes that true power comes from mastering the boundary between life and death, using their undead state to achieve immortality and unmatched magical prowess.

**Personality Archetypes**:
- **The Eternal Scholar**: Seeks knowledge across centuries, viewing death as merely an inconvenience
- **The Vengeful Revenant**: Returned from death to exact revenge, fueled by cold fury
- **The Reluctant Immortal**: Bound to phylactery against their will, struggling with their undead nature
- **The Power-Hungry Lich**: Embraces undeath fully, seeking ever-greater magical power

**Social Dynamics**: Lichborne are feared and reviled by most. Their undead nature is obvious to those who look closely - pale skin, cold touch, unnatural stillness. They must decide whether to hide their nature or embrace the terror they inspire.`
    },
    
    combatRole: {
      title: 'Combat Role',
      content: `**Primary Role**: Frost damage specialist with resurrection mechanics

**Damage Profile**:
- High sustained frost damage through Eternal Frost Aura
- Area control through freezing and chilling effects
- Burst damage through frozen target interactions

**Control Capabilities**:
- Freeze enemies in place, preventing actions
- Chill effects that reduce movement speed
- Terrain control through ice walls and barriers

**Survivability**: High - Phylactery provides resurrection, but maintaining Eternal Frost Aura drains health. Requires careful balance between offense and self-preservation.`
    },
    
    playstyle: {
      title: 'Playstyle',
      content: `**Core Mechanic**: Dual-Mode Casting. Switch between Normal Mode (Mana costs) and Aura Mode (HP costs, enhanced damage).

**Normal Mode (Aura OFF)**:
- Frost spells cost Mana as normal
- Sustainable, safe casting
- Use for conserving HP or when healer is unavailable

**Aura Mode (Aura ON)**:
- Frost spells cost HP instead of Mana
- All frost spells deal +1d6 frost damage
- Enemies hit must save DC 17 Con or be Chilled (-10 ft speed)
- Aura itself drains HP at start of each turn (scales with level: 1d6 Lv1-4, 1d8 Lv5-7, 1d10 Lv8-10)
- Toggle is free — no AP or Mana cost

**Phylactery Harvester**:
- Enemies killed by your frost spells add 1d6 HP to your Phylactery (max 50 HP)
- When you die, spend all stored Phylactery HP to resurrect at that value
- Once per combat
- **Death Trigger**: On Phylactery resurrection, freeze all enemies within 15ft for 1 round

**Decision Points**:
- When to switch between Normal and Aura Mode
- Whether to stay aggressive (killing to charge Phylactery) or play safe
- Whether to use Phylactery as resurrection insurance or spend it on Phylactery Burst
- When dying is actually the right play (death trigger freeze can save a wipe)

**Skill Expression**:
- Managing HP as both your life and your spell resource in Aura Mode
- Timing mode switches for maximum damage windows
- Aggressive play to charge Phylactery through kills
- Using death strategically for the Death Trigger freeze

**Mode Management Strategy**:
- **Aggressive**: Aura Mode constantly, burn HP for damage, kill to charge Phylactery, die and resurrect with Death Trigger
- **Balanced**: Switch modes based on combat intensity and healer availability
- **Conservative**: Aura Mode only for burst windows, Normal Mode for sustain

**Team Dynamics**:
- Healers offset your Aura drain, letting you stay in Aura Mode longer
- Synergizes with classes that group enemies for AoE frost kills (charges Phylactery fast)
- Death Trigger freeze can set up devastating team combos
- Phylactery resurrection means you can take risks no other caster can`,
    },

    immersiveCombatExample: {
      title: 'Combat Example: Death Is Fuel',
      content: `**The Setup**: You're a **Level 4 Lichborne** facing a group of fire elementals (3 elementals + 1 fire elemental lord). Starting HP: 80/80. Phylactery HP: 10 (from a previous kill). Eternal Frost Aura: OFF (Normal Mode). Starting Mana: 50/60. Your goal: Switch to Aura Mode for devastating frost damage, kill enemies to charge your Phylactery, and use death as a tactical weapon.

**Starting State**: HP: 80/80 | Phylactery HP: 10 | Mode: Normal | Mana: 50/60

**Turn 1 — Switching to Aura Mode**

*The fire elementals blaze before you, their heat oppressive. You close your eyes and reach for the cold within. Your phylactery—a frozen crystal hanging from your neck—pulses with dark energy.*

**Your Action**: Switch to Aura Mode (Free action — no AP or Mana cost)

*Frost spreads from your body in waves. The temperature DROPS. Ice crystals form in the air around you. Your skin turns pale blue, your breath visible. You are now in AURA MODE.*

**Aura Mode: ACTIVE**
**Effect**: Frost spells cost HP instead of Mana. All frost spells deal +1d6 frost damage. Enemies hit: DC 17 Con save or Chilled (-10 ft speed).
**Aura Drain**: Will lose 1d6 HP at start of each turn

**Your Action**: Cast "Ice Lance" at Fire Elemental #1 — costs HP instead of Mana!
**HP Cost**: 12 HP (would have been 12 Mana in Normal Mode)
**Your HP**: 80 - 12 = 68/80

**Attack Roll**: d20+6 → [16] = Hit!
**Base Damage**: 4d6 frost → [5, 6, 4, 3] = 18 damage
**Aura Bonus**: +1d6 frost → [5] = +5 damage
**Total Damage**: 18 + 5 = **23 frost damage!**

*The ice lance pierces the fire elemental. It HISSES, steam rising from the impact.*

**Chilling Effect**: Fire Elemental #1 must save DC 17 Constitution
**Save Roll**: [11] → FAIL!
**Effect**: Movement speed reduced by 10 ft until end of its next turn

**Current State**: HP: 68/80 | Phylactery HP: 10 | Mode: Aura | Mana: 50/60

**Fire Elemental #1's Turn**: Attacks you → [17] → Hit! → 2d8+4 fire → [7, 6] + 4 = 17 fire damage
**Your HP**: 68 - 17 = 51/80

**Current State**: HP: 51/80 | Phylactery HP: 10 | Mode: Aura | Mana: 50/60

**Turn 2 — Kill to Charge (HP: 51 → 46, Phylactery: 10 → 16)**

*You feel the aura draining your life force. The cold is consuming you from within. But the power... the POWER is worth it.*

**Start of Turn**: Aura drain (Level 4 = 1d6)
**Drain Roll**: 1d6 → [5] = 5 HP lost
**Your HP**: 51 - 5 = 46/80

**Your Action**: Cast "Frozen Orb" at all 3 fire elementals — costs HP!
**HP Cost**: 10 HP
**Your HP**: 46 - 10 = 36/80

**Damage Roll**: 4d6 frost → [6, 5, 4, 6] = 21 damage
**Aura Bonus**: +1d6 frost → [4] = +4 damage
**Total Damage**: 21 + 4 = **25 frost damage to ALL 3 elementals!**

*A sphere of absolute zero explodes among the elementals. They shriek, their flames guttering.*

**Chilling Effect**: All 3 elementals must save DC 17 Constitution
**Elemental #1**: [9] → FAIL! → -10 ft speed
**Elemental #2**: [12] → FAIL! → -10 ft speed
**Elemental #3**: [14] → FAIL! → -10 ft speed

*All three elementals are CHILLED, their movement slowed.*

**Mana**: 50/60 (didn't spend any! Aura Mode uses HP instead)

**Fire Elemental Lord's Turn**: Casts "Flame Strike" at you → 4d6 fire → [5, 6, 4, 5] = 20 fire damage
**Your HP**: 36 - 20 = 16/80

*The fire lord's flames sear you. You're at 16/80 HP. The aura is draining you, and the enemies are hitting hard.*

**Current State**: HP: 16/80 | Phylactery HP: 10 | Mode: Aura | Mana: 50/60

**Turn 3 — Kill to Charge + Strategic Death (HP: 16 → 11 → 0 → RESURRECTION!)**

**Start of Turn**: Aura drain
**Drain Roll**: 1d6 → [5] = 5 HP lost
**Your HP**: 16 - 5 = 11/80

*You're at 11 HP. The aura is killing you. But Fire Elemental #2 is almost dead from the earlier Frozen Orb damage...*

**Your Action**: Cast "Frost Bolt" at Fire Elemental #2 — costs HP!
**HP Cost**: 4 HP
**Your HP**: 11 - 4 = 7/80

**Damage Roll**: 1d8+Int frost → [7] + 3 = 10 damage
**Aura Bonus**: +1d6 frost → [4] = +4 damage
**Total Damage**: 10 + 4 = **14 frost damage!**

*Frost Bolt strikes the weakened elemental. It SHATTERS — extinguished.*

**Fire Elemental #2 is DEAD!**

**PHYLACTERY HARVESTER TRIGGERS!**
*Soul energy flows from the dying elemental into your phylactery.*
**Phylactery Charge**: +1d6 HP → [4] = +4 HP
**Phylactery HP**: 10 + 4 = **14 HP**

**Fire Elemental #3's Turn**: Attacks you → [18] → Hit! → 2d8+4 → [8, 7] + 4 = 19 damage
**Your HP**: 7 - 19 = **-12 HP** → YOU DIE!

*The flames consume you. You fall, your body burning. But your phylactery PULSES.*

**PHYLACTERY RESURRECTION TRIGGERS!**

*Your phylactery SHATTERS, releasing the harvested life force. Your body REFORMS from ice and shadow.*

**Phylactery Resurrection**: Spend all stored HP (14 HP)
**Your HP**: 0 → **14 HP** (resurrected!)
**Phylactery HP**: 14 → **0** (depleted)

**DEATH TRIGGER ACTIVATES!**
*Ice ERUPTS from the ground around you as you reform. All enemies within 15ft are FROZEN.*

**Death Trigger**: All enemies within 15ft Frozen for 1 round (no save)
**Fire Elemental #1**: FROZEN!
**Fire Elemental #3**: FROZEN!

*You rise from the ashes, frost spreading from your reformed body. Two elementals are FROZEN SOLID. The fire lord stumbles back, terrified.*

**Your Party's Healer**: "You... you DIED. And then you froze everything?!"
**You**: "Death is fuel. My phylactery harvested that elemental's soul. I spent it to come back. And the cold of my resurrection... freezes everything around me."

**Current State**: HP: 14/80 | Phylactery HP: 0 (depleted) | Mode: Aura (still active) | Mana: 50/60

**Turn 4 — Switching to Normal Mode to Recover**

**Start of Turn**: Aura drain
**Drain Roll**: 1d6 → [3] = 3 HP lost
**Your HP**: 14 - 3 = 11/80

*You're at 11 HP with no Phylactery backup. Time to play safe.*

**Your Action**: Switch to Normal Mode (Free action)

*You release the cold. The frost aura dissipates. You can breathe again. Spells now cost Mana.*

**Your Action**: Cast "Siphon Soul" at frozen Fire Elemental #1 (8 Mana — now in Normal Mode, uses Mana!)
**Attack Roll**: d20+6 → [18] = Hit!
**Damage**: 2d6 frost → [5, 4] = 9 damage
**Healing**: Heal for half = 4 HP
**Your HP**: 11 + 4 = 15/80

*You drain the frozen elemental's life force. Warmth floods back into your undead body.*

**Mana**: 50 - 8 = **42/60**

**Fire Elemental #1 is DEAD from the damage!**

**PHYLACTERY HARVESTER TRIGGERS!**
**Phylactery Charge**: +1d6 HP → [3] = +3 HP
**Phylactery HP**: 0 + 3 = **3 HP** (starting to recharge!)

**Your Party's Healer**: Heals you for 15 HP
**Your HP**: 15 + 15 = 30/80

**Your Party's Tank**: Shatters frozen Fire Elemental #3 → DEAD
**Fire Elemental Lord**: Still alive, badly wounded from earlier

**Current State**: HP: 30/80 | Phylactery HP: 3 | Mode: Normal | Mana: 42/60

**Turn 5 — Finishing the Fight**

**Your Action**: Cast "Frost Nova" at Fire Elemental Lord (16 Mana)
**Effect**: AoE burst — 5d6 frost damage in 20ft radius. Fire Elemental Lord must save DC 15 Constitution or be rooted for 2 rounds.

**Damage Roll**: 5d6 frost → [4, 6, 3, 5, 2] = 20 frost damage

*Frost erupts outward from you in a ring of ice, engulfing the fire lord.*

**Fire Lord's Save**: [9] → FAIL!

*The fire lord is encased in frost, rooted to the ground. Helpless.*

**Your Party's Tank**: Shatters the frozen lord with a hammer strike → DEAD

**Combat Over**

*You stand among the melted remains of the fire elementals. Your phylactery is recharging — you harvested 3 HP from the last kill. You'll need to kill more enemies to fully recharge it.*

**Your Party's Tank**: "You died. Actually died. Froze everything when you came back. Then drained that elemental's soul to heal."
**You**: "That's what Lichborne do. I burned my own life for power, killed to charge my phylactery, died, and my resurrection froze the battlefield. My death wasn't a mistake — it was the plan."

**Final State**: HP: 30/80 | Phylactery HP: 3 (needs more kills) | Mode: Normal | Mana: 26/60

**The Lesson**: Lichborne gameplay is about:
1. **Dual-Mode Casting**: Switched to Aura Mode Turn 1 — spells cost HP instead of Mana, dealt +1d6 damage
2. **Aura Drain**: Lost HP each turn from the aura itself (5 + 5 + 3 = 13 HP total from drain)
3. **HP as Spell Cost**: Spent 26 HP total on spells in Aura Mode (12 + 10 + 4) — no Mana used during Aura Mode!
4. **Kill Charging**: Killed Fire Elemental #2 → Phylactery gained +4 HP from Harvester
5. **Strategic Death**: Died to enemy attacks → Phylactery resurrected at 14 HP → Death Trigger FROZE 2 enemies (no save!)
6. **Mode Switching**: Switched to Normal Mode Turn 4 to recover — spells cost Mana again
7. **Life Drain**: Used Siphon Soul to deal damage AND heal AND charge Phylactery from the kill
8. **Mana Conservation**: Spent 0 Mana during 3 turns of Aura Mode — all 50 Mana preserved for Normal Mode
9. **AoE Finish**: Used Frost Nova to root the boss, setting up the party for the kill

You're not a safe, sustainable caster. You're an UNDEAD PREDATOR who burns your own life for devastating power, kills enemies to fuel your resurrection, and uses death itself as a tactical weapon. The key decisions: when to switch modes (Normal for safety, Aura for devastation), when to kill (to charge Phylactery), and when dying is actually the right play (Death Trigger freeze). Death isn't the end. It's your strongest move.`,
    },
  },
  
  // Resource System
  resourceSystem: {
    title: 'Dual-Mode Casting & Harvester Phylactery',
    subtitle: 'Burn Your Life for Power, Harvest the Dead to Return',

    description: `The Lichborne is an undying frost-master who treats their own life force as just another spell slot. By toggling their Eternal Frost Aura, they switch from standard mana casting to a devastating HP-burning mode that freezes the air around them. Every kill feeds their Phylactery, building a pool of life that triggers a tactical resurrection and battlefield-wide freeze when they finally succumb to their own power.`,

    cards: [
      {
        title: 'Eternal Frost Aura (Toggle)',
        stats: 'HP Casting | +1d6 Damage',
        details: 'Switch between Normal (Mana) and Aura (HP) casting. Aura mode adds damage and Chills targets, but drains HP every turn.'
      },
      {
        title: 'Harvester Phylactery (0–50)',
        stats: '+1d6 HP per Kill',
        details: 'Harvest the souls of fallen enemies. This pool is automatically spent on death to resurrect you at the stored value.'
      },
      {
        title: 'Death Trigger (Burst)',
        stats: '15-ft Radius Freeze',
        details: 'Upon resurrection, the sudden release of necrotic frost freezes all enemies within 15ft for 1 round (no save).'
      }
    ],

    generationTable: {
      headers: ['Action/Event', 'Resource Change', 'Effect'],
      rows: [
        ['Activate Aura', 'Free Toggle', 'Switch to HP casting mode'],
        ['Cast in Aura Mode', 'Spend HP', 'Bypass Mana costs entirely'],
        ['Kill Enemy', '+1d6 Phylactery', 'Harvest soul to fuel resurrection'],
        ['Start of Turn', '-1d6/d8/d10 HP', 'Aura drain (scales with level)'],
        ['Death', 'Spent All Stored', 'Resurrect + Death Trigger freeze'],
        ['Short Rest', '+10 Phylactery', 'Manual HP transfer fallback']
      ]
    },

    usage: {
      momentum: 'Use Aura Mode to conserve mana for utility spells while dealing massive burst damage. Aggressive kills are your only way to build resurrection insurance.',
      flourish: '⚠️ Aura Drain: The cold consumes you. Stay in Aura Mode only as long as your Phylactery reserve (or healer) can support your inevitable fall.'
    },

    overheatRules: {
      title: 'Phylactery Resonance',
      content: `Your current Phylactery charge determines your **Immortality Threshold** and dictates how aggressively you should utilize your Eternal Frost Aura.

**🌕 Full (36–50 HP)**:
- **Status**: Maximum Aggression.
- **Strategy**: You are effectively immortal. Stay in Aura Mode constantly and seek a tactical death near large groups of enemies to trigger the 15ft battlefield freeze.

**🌗 Stable (16–35 HP)**:
- **Status**: Balanced Play.
- **Strategy**: Use Aura Mode for 2-3 turn burst windows. Ensure you have a kill in sight (minions are best) to maintain your reserves before the cold consumes you.

**🌑 Low (0–15 HP)**:
- **Status**: Critical Danger.
- **Strategy**: Switch to Normal Mode immediately. You lack the life force to survive a resurrection or the turn-by-turn drain of the aura. Focus on Siphon Soul to rebuild your pool.`
    },

    strategicConsiderations: {
      title: 'Combat Phases & Decision-Making',
      content: `**Predator's Opening (Mode Switch)**: Start in Normal Mode to assess the field. Switch to Aura Mode once high-value targets are identified. You bypass mana constraints, so unleash your most expensive AoE spells immediately to secure early kills.

**Harvesting (Early Combat)**: Focus entirely on weak minions or finishing blows. Your priority isn't just damage—it's charging the Phylactery. Aim for at least 30 HP in the reserve before taking risky positions.

**Tactical Expiry (Mid-Combat)**: If the enemy team is clustered, Aura-casting until you reach 0 HP is a viable strategy. The resulting Death Trigger freeze (15ft radius, no save) is one of the strongest control tools in the game.

**Rebirth (Late Combat)**: After resurrection, you are at your most vulnerable. Switch back to Normal Mode to heal with Siphon Soul and spend your preserved Mana pool while rebuilding your soul reserve.

**Worked Example (Aura Mode, 15 HP Left, Phylactery at 40)**:
- **Scenario**: Surrounded by 3 enemies.
- **The Play**: Cast a high-cost Frost Nova. The HP cost will likely drop you to 0.
- **The Result**: You die, immediately resurrect at 40 HP, and Freeze all 3 enemies in place.
- **Outcome**: You've traded a 'death' for 40 HP and a guaranteed 1-round stun on the entire frontline.`
    },

    playingInPerson: {
      title: 'Playing Lichborne In Person',
      content: `**Required Materials**:
- **Eternal Frost Aura Toggle** (card or token showing Normal Mode / Aura Mode)
- **HP Tracker** (d100 or paper for current HP)
- **Phylactery HP Tracker** (separate tracker for harvested HP)
- **Aura Drain Die** (d6 for Lv1-4, d8 for Lv5-7, d10 for Lv8-10)
- **Frost Damage Bonus Tracker** (showing +1d6 when in Aura Mode)
- **Resurrection Tracker** (marking when Phylactery resurrection is available)

**Primary Tracking Method: Mode Toggle + Dual HP Tracking**

The Lichborne's resource system uses a mode toggle (Normal vs Aura) plus two HP pools (your HP and Phylactery HP). In Normal Mode, spells cost Mana. In Aura Mode, spells cost HP instead. The Phylactery charges by killing enemies and provides resurrection when you die.

**Setup**:
\`\`\`
LICHBORNE RESOURCE TRACKING:

YOUR HP: [___] / 80
PHYLACTERY HP: [___] / 50 (harvested from kills)
MANA: [___] / 60 (only used in Normal Mode)

CASTING MODE: [NORMAL] / [AURA]
When Aura Mode:
• Frost spells cost HP instead of Mana
• All frost spells: +1d6 frost damage
• Enemies hit: CON save DC 17 or -10 ft speed (chilled)
• You lose 1d6/1d8/1d10 HP at start of each turn (scales with level)

PHYLACTERY HARVESTER:
• Kill enemy with frost spell → +1d6 HP to Phylactery
• Max: 50 HP stored
• When you die: Resurrect at Phylactery HP value
• Death Trigger: Freeze all enemies within 15ft for 1 round (no save)
• Cooldown: Once per combat
\`\`\`

**How It Works**:

**Dual-Mode Casting**:
1. **Normal Mode** (Aura OFF): Cast frost spells using Mana. Standard caster.
2. **Switch to Aura Mode**: Free action. No AP or Mana cost. Can switch once per turn.
3. **Aura Mode** (Aura ON): Frost spells cost HP instead of Mana. +1d6 damage. Chill on hit.
4. **Aura Drain**: At start of each turn in Aura Mode, lose 1d6 HP (Lv1-4), 1d8 HP (Lv5-7), or 1d10 HP (Lv8-10).
5. **Switch to Normal Mode**: Free action. Spells cost Mana again.

**Phylactery Harvester**:
1. **Kill Charge**: Each enemy killed by your frost spells → add 1d6 HP to Phylactery
2. **Maximum**: Phylactery stores up to 50 HP (75 for Phylactery Guardian spec)
3. **Resurrection**: When you die → resurrect at stored Phylactery HP value
4. **Death Trigger**: On resurrection → freeze all enemies within 15ft for 1 round (no save!)
5. **Reset**: Phylactery HP goes to 0 after resurrection. Charge it by killing more enemies.
6. **Once Per Combat**: Can only resurrect once per combat encounter

**Example Mode Switching**:

*You have 80 HP, Phylactery has 10 HP, Normal Mode, 50 Mana*

**Turn 1 - Switch to Aura Mode**:
1. "I switch to Aura Mode!"
2. Flip mode card to "AURA MODE"
3. Frost spells now cost HP instead of Mana

**Turn 2 - Aura Drain + Cast Spell**:
1. Start of turn: Roll aura drain → 1d6 → [4] = 4 HP lost
2. Your HP: 80 - 4 = **76 HP**
3. "I cast Ice Lance at the orc! Costs 12 HP in Aura Mode."
4. Your HP: 76 - 12 = **64 HP**
5. Spell damage: 4d6 (base) + 1d6 (aura bonus) = 5d6
6. Roll: [5,4,6,3,5] = 23 frost damage
7. Orc must save CON DC 17 or -10 ft speed (chilled)
8. Mana: Still 50/60 (didn't spend any!)

**Turn 3 - Kill to Charge Phylactery**:
1. Start of turn: Roll aura drain → 1d6 → [5] = 5 HP lost
2. Your HP: 64 - 5 = **59 HP**
3. "I cast Frozen Orb at the group! Costs 10 HP."
4. Your HP: 59 - 10 = **49 HP**
5. Damage kills two goblins!
6. **PHYLACTERY HARVEST**: 2 kills × 1d6 each → [3] + [5] = **+8 HP to Phylactery**
7. Phylactery HP: 10 + 8 = **18 HP**

**Turn 4 - Strategic Death**:
1. Boss attacks you → 30 damage
2. Your HP: 49 - 30 = **19 HP**
3. Minion attacks you → 22 damage
4. Your HP: 19 - 22 = **-3 HP** → YOU DIE!

**Phylactery Resurrection**:
1. "My Phylactery activates! I resurrect at 18 HP!"
2. Your body crumbles to ice, then reforms
3. **HP Restored**: 18 HP (equal to Phylactery HP)
4. **Phylactery HP**: Resets to 0
5. **Death Trigger**: "All enemies within 15ft are FROZEN for 1 round! No save!"
6. Boss and minion are both FROZEN
7. **Cooldown**: Cannot resurrect again this combat

**Turn 5 - Switch to Normal Mode**:
1. Start of turn: Roll aura drain → 1d6 → [2] = 2 HP lost
2. Your HP: 18 - 2 = **16 HP**
3. "I switch to Normal Mode to recover!"
4. Flip mode card to "NORMAL MODE"
5. "I cast Siphon Soul on the frozen boss! Costs 6 Mana."
6. Mana: 50 - 6 = 44/60
7. Deal damage AND heal for half!

**Aura Toggle Card Template**:
\`\`\`
═════════════════════════════════════
     ETERNAL FROST AURA
═════════════════════════════════════
MODE: [NORMAL] ← Flip to show Mode

NORMAL MODE (Aura OFF):
• Frost spells cost Mana
• No damage bonus, no chill
• No HP drain

AURA MODE (Aura ON):
✓ Frost spells cost HP instead of Mana
✓ All frost spells: +1d6 frost damage
✓ Enemies hit: CON save DC 17 or -10 ft speed
✗ You lose 1d6/1d8/1d10 HP at start of each turn

SWITCH MODE: Free action (once per turn)
═════════════════════════════════════
\`\`\`

**Phylactery Tracker Card Template**:
\`\`\`
═════════════════════════════════════
       PHYLACTERY HARVESTER
═════════════════════════════════════
STORED HP: [___] / 50

CHARGING:
• Kill enemy with frost spell → +1d6 HP
• Charge from kills in combat!

RESURRECTION:
☐ Available (once per combat)
☐ Used (need new combat to reset)

WHEN YOU DIE:
1. Resurrect at Phylactery HP value
2. Phylactery HP resets to 0
3. DEATH TRIGGER: Freeze all enemies
   within 15ft for 1 round (NO SAVE!)
4. Mark resurrection as "Used"
═════════════════════════════════════
\`\`\`

**Alternative Tracking Methods**:

**Method 1: Dual HP Dice**
- Use two d100s (one for your HP, one for Phylactery HP)
- Rotate dice as HP changes
- Visual and easy to see both pools

**Method 2: HP Tokens**
- Use tokens to represent HP (1 token = 10 HP)
- Separate piles for your HP and Phylactery HP
- Blue tokens for Phylactery, red for HP

**Method 3: Mode Coin**
- Use a coin (heads = Aura Mode, tails = Normal Mode)
- Flip when switching modes
- Simple and tactile

**Quick Reference Card Template**:
\`\`\`
LICHBORNE QUICK REFERENCE

DUAL-MODE CASTING:
• Switch: Free action, once per turn
• Normal Mode: Spells cost Mana
• Aura Mode: Spells cost HP, +1d6 frost, chill DC 17
• Aura Drain: 1d6 HP/turn (Lv1-4), 1d8 (Lv5-7), 1d10 (Lv8-10)

PHYLACTERY HARVESTER:
• Kill enemy → +1d6 Phylactery HP
• Max: 50 HP (75 for Guardian)
• Die → Resurrect at stored HP value
• Death Trigger: Freeze 15ft radius, 1 round, no save
• Once per combat

MODE STRATEGY:
• Normal: Safe, sustainable, uses Mana
• Aura: Devastating, uses HP, aggressive
• Kill enemies to charge Phylactery
• Die strategically for Death Trigger freeze
\`\`\`

**Thematic Enhancements**:

Many players enhance the Lichborne experience with:
- **Phylactery Prop**: Small crystal or gem representing the Phylactery
- **Frost Dice**: Blue/white dice for frost damage rolls
- **Mode Token**: LED tea light that glows blue when in Aura Mode
- **HP Crystals**: Blue crystals or beads for tracking Phylactery HP
- **Resurrection Token**: Special token marking resurrection availability
- **Kill Counter**: Small counter for tracking kills per combat for Phylactery charging
- **Temperature Drop**: Mention room getting colder when switching to Aura Mode

**Mode Management Tips**:

**When to Use Aura Mode**:
- Start of combat for burst damage
- When you have full HP and healer support
- When Phylactery is charged (resurrection available)
- When enemies are grouped for AoE frost kills (charges Phylactery fast)

**When to Use Normal Mode**:
- When HP is low and no healer available
- When Phylactery is depleted (no resurrection insurance)
- When you need to sustain for a long fight
- Between combat encounters

**Phylactery Strategy**:
- **Aggressive**: Kill weak enemies first to charge Phylactery fast
- **Death Trigger**: Sometimes dying IS the play — freeze all enemies for your team
- **Recharging**: After resurrection, switch to Normal Mode and kill to rebuild
- **Guardian Spec**: 75 HP Phylactery means you can be even more aggressive

**Why This System Works**: The mode toggle is simple — flip a card or coin — but creates fundamentally different gameplay. In Normal Mode you're a standard caster. In Aura Mode you're a glass cannon burning your own life for devastating power. The Phylactery Harvester creates a positive feedback loop: kill enemies → charge Phylactery → die and resurrect with Death Trigger freeze → kill more enemies to recharge. The physical act of rolling the aura drain die each turn creates tension, and the kill-charge mechanic makes every enemy death feel rewarding. The Death Trigger is the ultimate expression of the class philosophy — when you die, EVERYONE around you suffers. Death isn't a failure. It's your strongest move.

**Pro Tips**:
- **Mode Timing**: Switch to Aura Mode when you have a kill opportunity (charges Phylactery)
- **Kill Priority**: Weak enemies = fast Phylactery charges. Save big spells for bosses.
- **Death Trigger Setup**: Position near enemies before "dying" to maximize the 15ft freeze
- **Mana Conservation**: Use Aura Mode for 2-3 turns, then switch to Normal Mode with full Mana
- **Siphon Soul**: Life drain spell heals you AND charges Phylactery on kill
- **Spec Synergy**: Frostbound = freeze/shatter loop, Reaper = kill army, Guardian = maximum resurrections`,
    },
  },

  // Specializations
  specializations: {
    title: 'Lichborne Specializations',
    subtitle: 'Three Paths of Eternal Frost',

    description: 'Lichborne can specialize in three distinct paths, each emphasizing different aspects of frost magic and undead power.',

    sharedPassive: {
      name: 'Undying Frost',
      icon: 'Frost/Frozen in Ice',
      description: 'Your Eternal Frost Aura chilling effects have their save DC increased by 2 (DC 17 instead of 15). Additionally, you are immune to frost damage. When you resurrect via Phylactery, all enemies within 15ft are Frozen for 1 round (Death Trigger, no save).'
    },

    specs: [
      {
        id: 'frostbound_tyrant',
        name: 'Frostbound Tyrant',
        icon: 'Frost/Frozen in Ice',
        color: '#4A90E2',
        description: 'Masters of freezing enemies and shattering them for devastating burst damage',
        theme: 'Freeze → Shatter → Refreeze loop',

        passive: {
          name: 'Permafrost Mastery',
          description: 'Your freeze effects last 1d4 additional rounds. Frozen enemies take +1d6 damage from your frost spells. When a frozen enemy takes damage, there is a 50% chance they Shatter (takes an additional 3d6 frost damage but the freeze ends immediately). In Aura Mode, your chill effect upgrades to a freeze (1 round) on a failed save instead of just slowing movement.'
        },

        strengths: [
          'Exceptional crowd control through extended freezes',
          'Shatter mechanic creates an active freeze → damage → refreeze loop',
          'Strong bonus damage to frozen targets',
          'Can lock down multiple dangerous enemies'
        ],

        weaknesses: [
          'Shatter ends the freeze — must choose between damage and control',
          'Requires setup time to freeze enemies before dealing bonus damage',
          'Less effective against freeze-immune enemies',
          'Relies on landing freeze saves'
        ],

        playstyle: 'Freeze enemies, then Shatter them for massive burst damage. The Shatter ends the freeze, so you must refreeze to repeat the loop. Creates an active, engaging play pattern where you constantly balance crowd control against burst damage.',

        playstyleTips: [
          'Freeze high-threat targets, then Shatter for burst damage',
          'Use AoE freezes to set up multi-target Shatters',
          'Refreeze after Shatter to maintain crowd control',
          'Save Shatters for enemies you can finish off'
        ],

        passiveAbilities: [
          {
            name: 'Undying Frost',
            tier: 'Path Passive',
            description: 'Your Eternal Frost Aura chilling effects have their save DC increased by 2 (DC 17 instead of 15). Additionally, you are immune to frost damage. Death Trigger: On Phylactery resurrection, freeze all enemies within 15ft for 1 round.',
            sharedBy: 'All Lichborne'
          },
          {
            name: 'Permafrost Mastery',
            tier: 'Specialization Passive',
            description: 'Your freeze effects last 1d4 additional rounds. Frozen enemies take +1d6 damage from your frost spells. 50% chance to Shatter frozen targets on damage (3d6 additional frost, ends freeze). Aura Mode upgrade: Chill becomes Freeze (1 round) on failed save.',
            uniqueTo: 'Frostbound Tyrant'
          }
        ]
      },
      {
        id: 'spectral_reaper',
        name: 'Spectral Reaper',
        icon: 'Necrotic/Drain Soul',
        color: '#9370DB',
        description: 'Commands an army of spectral minions raised from slain enemies',
        theme: 'Kill enemies → raise spectral army → overwhelm',

        passive: {
          name: 'Deathly Chill',
          description: 'Your frost spells deal +1d6 necrotic damage. Every enemy killed by your spells rises as a spectral minion for 1d4 rounds (max 4 minions). Minions have 10 HP and deal 1d6 necrotic damage per turn on your command (1 AP to command all). In Aura Mode, you heal for 2 HP each time a spectral minion deals damage.'
        },

        strengths: [
          'Guaranteed minion army — no RNG dependence',
          'Hybrid frost/necrotic damage bypasses single-type resistances',
          'Minions provide additional damage, body-blocking, and area denial',
          'Strong sustained damage from personal spells + minion attacks'
        ],

        weaknesses: [
          'Minions are fragile (10 HP each) and temporary',
          'Requires kills to build army — weak in long single-target fights',
          'Lower crowd control than Frostbound Tyrant',
          'Less survivability than Phylactery Guardian'
        ],

        playstyle: 'Aggressive hybrid damage dealer who commands a growing army of spectral minions. Kill weak enemies first to build your army, then overwhelm stronger targets with combined personal + minion damage.',

        playstyleTips: [
          'Prioritize killing weak enemies to build your minion army fast',
          'Command minions to body-block dangerous enemies or flank',
          'Use hybrid spells to bypass resistances',
          'Maintain Aura Mode for maximum kill potential'
        ],

        passiveAbilities: [
          {
            name: 'Undying Frost',
            tier: 'Path Passive',
            description: 'Your Eternal Frost Aura chilling effects have their save DC increased by 2 (DC 17 instead of 15). Additionally, you are immune to frost damage. Death Trigger: On Phylactery resurrection, freeze all enemies within 15ft for 1 round.',
            sharedBy: 'All Lichborne'
          },
          {
            name: 'Deathly Chill',
            tier: 'Specialization Passive',
            description: 'Your frost spells deal +1d6 necrotic damage. Every enemy killed by your spells rises as a spectral minion for 1d4 rounds (max 4). Minions have 10 HP and deal 1d6 necrotic damage per turn (1 AP to command all). Aura Mode upgrade: Heal 2 HP per minion damage instance.',
            uniqueTo: 'Spectral Reaper'
          }
        ]
      },
      {
        id: 'phylactery_guardian',
        name: 'Phylactery Guardian',
        icon: 'Frost/Frost Manipulation',
        color: '#2D1B69',
        description: 'Enhanced phylactery mechanics and survivability',
        theme: 'Improved resurrection and HP management',

        passive: {
          name: 'Fortified Phylactery',
          description: 'Your Phylactery can store up to 75 HP (instead of 50). Phylactery resurrection revives you with the full stored HP value. Death Trigger freeze radius increased to 25ft (instead of 15ft). In Aura Mode, you store 1 HP in your Phylactery for every 10 damage you take from any source (max 5 per round).'
        },

        strengths: [
          'Highest survivability of all specs — 75 HP Phylactery',
          'Death Trigger freeze in 25ft radius (larger than other specs)',
          'Can afford aggressive Aura Mode usage with massive resurrection buffer',
          'More frequent and safer resurrections'
        ],

        weaknesses: [
          'Lower damage output than other specs',
          'No crowd control or minion bonuses',
          'Still vulnerable to burst damage above Phylactery capacity',
          'Resurrection limited to once per combat'
        ],

        playstyle: 'Tankiest Lichborne with enhanced Phylactery mechanics. Larger Death Trigger radius and 75 HP Phylactery makes dying a powerful tactical weapon. Can afford maximum Aura Mode aggression.',

        playstyleTips: [
          'Keep Phylactery at high HP before dangerous encounters by killing enemies',
          'Use Aura Mode aggressively — your 75 HP Phylactery can absorb the risk',
          'Position near enemies before dying for maximum Death Trigger coverage',
          'Coordinate resurrections with team for devastating freeze setups'
        ],

        passiveAbilities: [
          {
            name: 'Undying Frost',
            tier: 'Path Passive',
            description: 'Your Eternal Frost Aura chilling effects have their save DC increased by 2 (DC 17 instead of 15). Additionally, you are immune to frost damage. Death Trigger: On Phylactery resurrection, freeze all enemies within 25ft for 1 round.',
            sharedBy: 'All Lichborne'
          },
          {
            name: 'Fortified Phylactery',
            tier: 'Specialization Passive',
            description: 'Your Phylactery can store up to 75 HP (instead of 50). Resurrect at full stored HP value. Death Trigger freeze radius increased to 25ft (instead of 15ft). Aura Mode upgrade: Store 1 Phylactery HP per 10 damage taken (max 5/round).',
            uniqueTo: 'Phylactery Guardian'
          }
        ]
      }
    ]
  },

  // Example Spells - showcasing frost magic and phylactery mechanics
  exampleSpells: [
    // BASIC FROST SPELLS
    {
      id: 'lb_grave_chill',
      name: 'Grave Chill',
      level: 1,
      description: 'A spectral chill that deals damage and chills the target. If target is Frozen, deals additional damage.',
      category: 'basic_frost',
      spellType: 'ACTION',
      icon: 'Frost/Ice Orb',
      school: 'Necromancy',

      resourceCost: {
        actionPoints: 2,
        mana: 5,
        components: ['verbal', 'somatic'],
        verbalText: 'Frigus Mortis!',
        somaticText: 'Extend hand with frost emanating'
      },

      castTime: 'Action',
      range: 30,
      targetType: 'Single Enemy',

      resolution: 'SAVE',

      saveConfig: {
        saveType: 'constitution',
        saveDC: 15,
        onSaveEffect: 'negates_chill'
      },

      damageConfig: {
        baseDamage: '1d6',
        damageType: 'frost',
        bonusDamage: {
          condition: 'target_frozen',
          amount: '+1d6',
          description: 'Bonus damage if target is Frozen'
        }
      },

      debuffConfig: {
        debuffType: 'statusEffect',
        durationValue: 1,
        durationType: 'turns',
        durationUnit: 'turns',
        effects: [{
          id: 'chilled',
          name: 'Chilled',
          description: 'Movement speed reduced by 10 feet',
          statusType: 'slow',
          level: 'minor',
          statPenalty: { stat: 'movement_speed', value: -10 },
          movementPenalty: -10
        }]
      },

      effects: {
        damage: {
          base: '1d6',
          type: 'frost',
          conditional: {
            frozen: '+1d6'
          }
        },
        debuff: {
          type: 'chilled',
          duration: 1,
          movementReduction: 10
        }
      },

      specialMechanics: {
        eternalFrostAura: {
          active: 'Deals +1d6 frost damage (total 2d6 base, 3d6 if frozen)',
          description: 'Aura enhances all frost spell damage'
        },
        frozenInteraction: {
          condition: 'Target has Frozen condition',
          effect: 'Deals additional 1d6 frost damage'
        }
      },

      tags: ['frost', 'damage', 'chill', 'basic', 'lichborne']
    },

    // FREEZE & CONTROL SPELLS
    {
      id: 'lb_wraith_spear',
      name: 'Wraith Spear',
      level: 1,
      description: 'Summon a spectral spear of ice that pierces through enemies, potentially freezing them.',
      category: 'freeze_control',
      spellType: 'ACTION',
      icon: 'Frost/Frostbite Effect',
      school: 'Evocation',

      resourceCost: {
        actionPoints: 2,
        mana: 10,
        components: ['verbal', 'somatic'],
        verbalText: 'Hasta Gelidus!',
        somaticText: 'Thrust hand forward, conjuring ice spear'
      },

      castTime: 'Action',
      range: 40,
      targetType: 'Single Enemy',

      resolution: 'SAVE',

      saveConfig: {
        saveType: 'agility',
        saveDC: 15,
        onSaveEffect: 'half_damage_no_freeze'
      },

      damageConfig: {
        baseDamage: '2d6',
        damageType: 'frost',
        bonusDamage: {
          condition: 'target_frozen',
          amount: '+1d6',
          description: 'Bonus damage if target is already Frozen'
        }
      },

      debuffConfig: {
        effects: [
          'Target is Frozen for 1 turn',
          'Immobilized, cannot take actions or reactions'
        ]
      },

      effects: {
        damage: {
          base: '2d6',
          type: 'frost',
          conditional: {
            frozen: '+1d6'
          }
        },
        debuff: {
          type: 'frozen',
          duration: 1,
          immobilized: true,
          noActions: true,
          noReactions: true
        }
      },

      savingThrowEffect: {
        onSuccess: 'Takes 1d6 frost damage, not Frozen',
        onFailure: 'Takes 2d6 frost damage and is Frozen for 1 turn'
      },

      specialMechanics: {
        eternalFrostAura: {
          active: 'Deals +1d6 frost damage (total 3d6 base, 4d6 if already frozen)',
          description: 'Aura enhances damage and applies chill on save'
        }
      },

      tags: ['frost', 'damage', 'freeze', 'control', 'lichborne']
    },

    {
      id: 'lb_deathly_frost',
      name: 'Deathly Frost',
      level: 2,
      description: 'Emit a burst of cold energy, damaging and freezing nearby enemies.',
      category: 'freeze_control',
      spellType: 'ACTION',
      icon: 'Frost/Frozen AoE',
      school: 'Evocation',

      resourceCost: {
        actionPoints: 2,
        mana: 15,
        components: ['verbal', 'somatic'],
        verbalText: 'Glacies Mortis!',
        somaticText: 'Slam hands together, releasing frost wave'
      },

      castTime: 'Action',
      range: 'Self',
      targetType: 'AoE - 10 ft radius',

      resolution: 'SAVE',

      saveConfig: {
        saveType: 'constitution',
        saveDC: 15,
        onSaveEffect: 'half_damage_no_freeze'
      },

      damageConfig: {
        baseDamage: '1d8',
        damageType: 'frost',
        aoe: {
          shape: 'circle',
          radius: 10
        }
      },

      debuffConfig: {
        effects: [
          'Targets are Frozen for 1 turn',
          'Immobilized, cannot take actions or reactions'
        ]
      },

      effects: {
        damage: {
          base: '1d8',
          type: 'frost',
          aoe: {
            shape: 'circle',
            radius: 10
          }
        },
        debuff: {
          type: 'frozen',
          duration: 1,
          immobilized: true,
          noActions: true,
          noReactions: true
        }
      },

      savingThrowEffect: {
        onSuccess: 'Takes 1d4 frost damage, not Frozen',
        onFailure: 'Takes 1d8 frost damage and is Frozen for 1 turn'
      },

      specialMechanics: {
        eternalFrostAura: {
          active: 'Deals +1d6 frost damage per target (total 1d8+1d6 per target)',
          description: 'Aura enhances AoE damage'
        }
      },

      tags: ['frost', 'damage', 'freeze', 'aoe', 'control', 'lichborne']
    },

    // UTILITY & SUPPORT SPELLS
    {
      id: 'lb_glacial_shroud',
      name: 'Glacial Shroud',
      level: 1,
      description: 'Encase yourself in ice, reducing damage taken and chilling attackers.',
      category: 'utility_support',
      spellType: 'ACTION',
      icon: 'Frost/Frozen in Ice',
      school: 'Abjuration',

      resourceCost: {
        actionPoints: 2,
        mana: 8,
        components: ['verbal', 'somatic'],
        verbalText: 'Scutum Glaciei!',
        somaticText: 'Cross arms over chest, ice forms around body'
      },

      castTime: '1 Action Point',
      range: 'Self',
      targetType: 'Self',

      resolution: 'AUTOMATIC',

      buffConfig: {
        effects: [
          'Reduce damage taken by 3',
          'Enemies that hit you must save or be Chilled',
          'Lasts 1 minute'
        ]
      },

      effects: {
        buff: {
          damageReduction: 3,
          duration: '1 minute',
          counterAttack: {
            trigger: 'when_hit',
            effect: 'attacker_chilled',
            save: {
              type: 'constitution',
              dc: 15
            }
          }
        }
      },

      specialMechanics: {
        chillingTouch: {
          trigger: 'Enemy hits you in melee',
          effect: 'Enemy must save (DC 15 Constitution) or be Chilled',
          chillEffect: 'Movement speed reduced by 10 ft until end of their next turn'
        }
      },

      tags: ['frost', 'buff', 'defense', 'utility', 'lichborne']
    },

    {
      id: 'lb_frozen_bastion',
      name: 'Frozen Bastion',
      level: 2,
      description: 'Create a wall of ice that blocks movement and projectiles.',
      category: 'utility_support',
      spellType: 'ACTION',
      icon: 'Frost/Icey wall',
      school: 'Conjuration',

      resourceCost: {
        actionPoints: 2,
        mana: 12,
        components: ['verbal', 'somatic'],
        verbalText: 'Murus Glacialis!',
        somaticText: 'Sweep hand horizontally, ice wall rises'
      },

      castTime: 'Action',
      range: 60,
      targetType: 'Terrain',

      resolution: 'AUTOMATIC',

      summonConfig: {
        type: 'ice_wall',
        dimensions: {
          length: 20,
          height: 10,
          thickness: 1
        },
        hp: 50,
        duration: '1 minute'
      },

      effects: {
        summon: {
          type: 'ice_wall',
          length: '20 ft',
          height: '10 ft',
          thickness: '1 ft',
          hp: 50,
          duration: '1 minute',
          blocksMovement: true,
          blocksProjectiles: true
        }
      },

      specialMechanics: {
        wallProperties: {
          hp: 50,
          immunities: ['frost'],
          vulnerabilities: ['fire'],
          description: 'Wall can be destroyed by dealing 50 damage. Takes double damage from fire.'
        }
      },

      tags: ['frost', 'summon', 'terrain', 'utility', 'control', 'lichborne']
    },

    {
      id: 'lb_siphon_soul',
      name: 'Siphon Soul',
      level: 2,
      description: 'Drain the life force from a target, dealing frost damage and healing yourself for half the damage dealt. If the target dies, gain +1d6 Phylactery HP.',
      category: 'basic_frost',
      spellType: 'ACTION',
      icon: 'Necrotic/Drain Soul',
      school: 'Necromancy',

      resourceCost: {
        actionPoints: 2,
        mana: 8,
        components: ['verbal', 'somatic'],
        verbalText: 'Anima Rapio!',
        somaticText: 'Reach out with spectral hand, draining life force'
      },

      castTime: 'Action',
      range: 30,
      targetType: 'Single Enemy',

      resolution: 'SAVE',

      saveConfig: {
        saveType: 'constitution',
        saveDC: 15,
        onSaveEffect: 'half_damage_no_heal'
      },

      damageConfig: {
        baseDamage: '2d8',
        damageType: 'frost',
        bonusDamage: {
          condition: 'target_frozen',
          amount: '+1d6',
          description: 'Bonus damage if target is Frozen'
        }
      },

      healingConfig: {
        formula: 'half_damage_dealt',
        healingType: 'self',
        description: 'Heal yourself for half the damage dealt'
      },

      specialMechanics: {
        eternalFrostAura: {
          active: 'Deals +1d6 frost damage (total 3d8 base). Healing increases proportionally.',
          description: 'Aura enhances the life drain'
        },
        phylacteryHarvester: {
          trigger: 'Target dies from this spell',
          effect: 'Gain +1d6 Phylactery HP in addition to normal kill charge',
          description: 'Double phylactery charge on Siphon Soul kills'
        },
        frozenInteraction: {
          condition: 'Target has Frozen condition',
          effect: 'Deals additional 1d6 frost damage'
        }
      },

      tags: ['frost', 'damage', 'healing', 'drain', 'phylactery', 'lichborne']
    },

    // HYBRID FROST/NECROTIC SPELLS
    {
      id: 'lb_necrotic_blizzard',
      name: 'Necrotic Blizzard',
      level: 4,
      description: 'Call forth a storm of necrotic ice shards that rains down in a designated area.',
      category: 'hybrid_necrotic',
      spellType: 'ACTION',
      icon: 'Frost/Frozen Wave',
      school: 'Necromancy',

      resourceCost: {
        actionPoints: 3,
        mana: 20,
        components: ['verbal', 'somatic'],
        verbalText: 'Tempestas Mortis!',
        somaticText: 'Raise both hands skyward, storm forms above'
      },

      castTime: 'Action',
      range: 60,
      targetType: 'AoE - 20 ft radius',

      resolution: 'SAVE',

      saveConfig: {
        saveType: 'constitution',
        saveDC: 15,
        onSaveEffect: 'half_damage_no_freeze'
      },

      damageConfig: {
        baseDamage: '3d6',
        damageTypes: ['necrotic', 'frost'],
        aoe: {
          shape: 'circle',
          radius: 20
        }
      },

      debuffConfig: {
        effects: [
          'Targets are Frozen for 1 turn',
          'Immobilized, cannot take actions or reactions'
        ]
      },

      effects: {
        damage: {
          base: '3d6',
          types: ['necrotic', 'frost'],
          split: '1d6 necrotic + 2d6 frost',
          aoe: {
            shape: 'circle',
            radius: 20
          }
        },
        debuff: {
          type: 'frozen',
          duration: 1,
          immobilized: true,
          noActions: true,
          noReactions: true
        }
      },

      savingThrowEffect: {
        onSuccess: 'Takes 1d6 necrotic + 1d6 frost damage, not Frozen',
        onFailure: 'Takes 1d6 necrotic + 2d6 frost damage and is Frozen for 1 turn'
      },

      specialMechanics: {
        eternalFrostAura: {
          active: 'Frost portion deals +1d6 damage (total 1d6 necrotic + 3d6 frost)',
          description: 'Aura only enhances frost damage portion'
        },
        hybridDamage: {
          description: 'Deals both necrotic and frost damage',
          benefit: 'Bypasses single-type resistances'
        }
      },

      tags: ['frost', 'necrotic', 'damage', 'aoe', 'freeze', 'hybrid', 'lichborne']
    },

    {
      id: 'lb_frostbite_curse',
      name: 'Frostbite Curse',
      level: 1,
      description: 'Inflict a painful frostbite on a target, causing damage and reducing their effectiveness in combat.',
      category: 'basic_frost',
      spellType: 'ACTION',
      icon: 'Frost/Inflicted Ice Shard',
      school: 'Necromancy',

      resourceCost: {
        actionPoints: 2,
        mana: 6,
        components: ['verbal', 'somatic'],
        verbalText: 'Maledictio Frigoris!',
        somaticText: 'Point at target, frost spreads across their body'
      },

      castTime: 'Action',
      range: 40,
      targetType: 'Single Enemy',

      resolution: 'SAVE',

      saveConfig: {
        saveType: 'constitution',
        saveDC: 15,
        onSaveEffect: 'half_damage_no_debuff'
      },

      damageConfig: {
        baseDamage: '1d6',
        damageType: 'frost',
        bonusDamage: {
          condition: 'target_frozen',
          amount: '+1d6',
          description: 'Bonus damage if target is Frozen'
        }
      },

      debuffConfig: {
        effects: [
          'Target is Slowed',
          'Movement speed reduced by 10 feet',
          'Can only spend half of maximum action points per turn (rounded down)',
          'Suffers Frostbite: takes 1d4 frost damage for every 5 feet moved',
          'Lasts 1 minute'
        ]
      },

      effects: {
        damage: {
          base: '1d6',
          type: 'frost',
          conditional: {
            frozen: '+1d6'
          }
        },
        debuff: {
          type: 'slowed',
          duration: '1 minute',
          movementReduction: 10,
          actionLimitation: 'one_action_or_bonus',
          frostbite: {
            damage: '1d4',
            trigger: 'per 5 ft moved'
          }
        }
      },

      savingThrowEffect: {
        onSuccess: 'Takes 1d4 frost damage, no debuff',
        onFailure: 'Takes 1d6 frost damage, Slowed and Frostbite for 1 minute'
      },

      specialMechanics: {
        eternalFrostAura: {
          active: 'Deals +1d6 frost damage (total 2d6 base, 3d6 if frozen)',
          description: 'Aura enhances damage'
        },
        frostbiteMechanic: {
          description: 'Enemy takes 1d4 frost damage per 5 ft moved',
          counterplay: 'Enemy can choose to stay still to avoid movement damage'
        }
      },

      tags: ['frost', 'damage', 'debuff', 'slow', 'dot', 'lichborne']
    },

    {
      id: 'lb_deathly_spikes',
      name: 'Deathly Spikes',
      level: 3,
      description: 'Summon spikes of necrotic ice from the ground, impaling enemies and creating difficult terrain.',
      category: 'hybrid_necrotic',
      spellType: 'ACTION',
      icon: 'Frost/Frostbite Effect',
      school: 'Necromancy',

      resourceCost: {
        actionPoints: 2,
        mana: 14,
        components: ['verbal', 'somatic'],
        verbalText: 'Aculei Mortis!',
        somaticText: 'Slam fist into ground, spikes erupt'
      },

      castTime: 'Action',
      range: 40,
      targetType: 'AoE - 10 ft radius',

      resolution: 'SAVE',

      saveConfig: {
        saveType: 'agility',
        saveDC: 15,
        onSaveEffect: 'half_damage'
      },

      damageConfig: {
        baseDamage: '2d6',
        damageTypes: ['necrotic', 'frost'],
        aoe: {
          shape: 'circle',
          radius: 10
        },
        bonusDamage: {
          condition: 'target_frozen',
          amount: '+1d6',
          description: 'Bonus damage if target is Frozen'
        }
      },

      terrainConfig: {
        type: 'difficult_terrain',
        duration: '1 minute',
        area: '10 ft radius'
      },

      effects: {
        damage: {
          base: '2d6',
          types: ['necrotic', 'frost'],
          split: '1d6 necrotic + 1d6 frost',
          aoe: {
            shape: 'circle',
            radius: 10
          },
          conditional: {
            frozen: '+1d6'
          }
        },
        terrain: {
          type: 'difficult',
          duration: '1 minute',
          area: '10 ft radius',
          description: 'Ice spikes remain, creating difficult terrain'
        }
      },

      savingThrowEffect: {
        onSuccess: 'Takes 1d6 total damage (split necrotic/frost)',
        onFailure: 'Takes 2d6 total damage (1d6 necrotic + 1d6 frost)'
      },

      specialMechanics: {
        eternalFrostAura: {
          active: 'Frost portion deals +1d6 damage (total 1d6 necrotic + 2d6 frost)',
          description: 'Aura only enhances frost damage portion'
        },
        terrainControl: {
          description: 'Creates difficult terrain that persists for 1 minute',
          effect: 'Enemies must spend 2 ft of movement for every 1 ft moved through area'
        }
      },

      tags: ['frost', 'necrotic', 'damage', 'aoe', 'terrain', 'hybrid', 'lichborne']
    },

    {
      id: 'lb_banshees_breath',
      name: "Banshee's Breath",
      level: 3,
      description: 'Release a chilling wind that damages and pushes back enemies.',
      category: 'hybrid_necrotic',
      spellType: 'ACTION',
      icon: 'Necrotic/Drain Soul',
      school: 'Necromancy',

      resourceCost: {
        actionPoints: 2,
        mana: 16,
        components: ['verbal', 'somatic'],
        verbalText: 'Spiritus Gelidus!',
        somaticText: 'Inhale deeply, exhale spectral wind'
      },

      castTime: 'Action',
      range: 'Self',
      targetType: 'Cone - 15 ft',

      resolution: 'SAVE',

      saveConfig: {
        saveType: 'strength',
        saveDC: 15,
        onSaveEffect: 'half_damage_no_push'
      },

      damageConfig: {
        baseDamage: '2d8',
        damageType: 'frost',
        aoe: {
          shape: 'cone',
          length: 15
        },
        bonusDamage: {
          condition: 'target_frozen',
          amount: '+1d6',
          description: 'Bonus damage if target is Frozen'
        }
      },

      pushConfig: {
        distance: 10,
        direction: 'away_from_caster'
      },

      effects: {
        damage: {
          base: '2d8',
          type: 'frost',
          aoe: {
            shape: 'cone',
            length: 15
          },
          conditional: {
            frozen: '+1d6'
          }
        },
        push: {
          distance: 10,
          direction: 'away',
          description: 'Targets pushed back 10 feet'
        }
      },

      savingThrowEffect: {
        onSuccess: 'Takes 1d8 frost damage, not pushed',
        onFailure: 'Takes 2d8 frost damage and pushed back 10 feet'
      },

      specialMechanics: {
        eternalFrostAura: {
          active: 'Deals +1d6 frost damage per target (total 3d8 base, 4d8 if frozen)',
          description: 'Aura enhances cone damage'
        },
        positioning: {
          description: 'Can push enemies off cliffs or into hazards',
          tactical: 'Use to create space or reposition enemies'
        }
      },

      tags: ['frost', 'damage', 'aoe', 'push', 'cone', 'lichborne']
    },

    {
      id: 'lb_frost_fever',
      name: 'Frost Fever',
      level: 3,
      description: 'Afflict a target with supernatural frostbite. Deals damage that increases the lower your HP is — the closer to death, the more devastating. In Aura Mode, this spell is at its peak.',
      category: 'basic_frost',
      spellType: 'ACTION',
      icon: 'Frost/Frostbite Effect',
      school: 'Necromancy',

      resourceCost: {
        actionPoints: 2,
        mana: 10,
        components: ['verbal', 'somatic'],
        verbalText: 'Febris Glacialis!',
        somaticText: 'Touch brow, then point at target — frost spreads from your fingers'
      },

      castTime: 'Action',
      range: 40,
      targetType: 'Single Enemy',

      resolution: 'DICE',

      damageConfig: {
        baseDamage: '2d6',
        damageType: 'frost',
        bonusDamage: {
          condition: 'caster_low_hp',
          amount: '+1d6 per 25% HP missing',
          description: 'Damage increases based on how low your HP is. Below 75% HP: +1d6. Below 50% HP: +2d6. Below 25% HP: +3d6.'
        }
      },

      debuffConfig: {
        effects: [
          'Target is Slowed',
          'Movement speed reduced by 10 feet',
          'Suffers Frostbite: takes 1d4 frost damage for every 5 feet moved',
          'Lasts 2 rounds'
        ]
      },

      effects: {
        damage: {
          base: '2d6',
          type: 'frost',
          scaling: {
            below_75pct_hp: '+1d6',
            below_50pct_hp: '+2d6',
            below_25pct_hp: '+3d6'
          }
        },
        debuff: {
          type: 'slowed',
          duration: 2,
          movementReduction: 10,
          frostbite: {
            damage: '1d4',
            trigger: 'per 5 ft moved'
          }
        }
      },

      specialMechanics: {
        eternalFrostAura: {
          active: 'Deals +1d6 frost damage. The Aura drain itself lowers your HP, which FUELS this spell further.',
          description: 'Self-damaging synergy — Aura drain pushes you into higher damage brackets'
        },
        desperationScaling: {
          description: 'This spell rewards being at low HP — the core Lichborne risk/reward',
          brackets: {
            above_75pct: '2d6 base only',
            below_75pct: '2d6 + 1d6 = 3d6',
            below_50pct: '2d6 + 2d6 = 4d6',
            below_25pct: '2d6 + 3d6 = 5d6'
          }
        }
      },

      tags: ['frost', 'damage', 'debuff', 'slow', 'desperation', 'lichborne']
    },
  ],

  // Comprehensive Spell List (Levels 1-10, 3 spells each)
  spells: [
    // ===== LEVEL 1 SPELLS =====
    {
      id: 'lichborne_frost_bolt',
      name: 'Frost Bolt',
      description: 'Launch a bolt of frost energy at your target, dealing frost damage and potentially slowing their movement.',
      level: 1,
      spellType: 'ACTION',
      effectTypes: ['damage'],
      typeConfig: {
        school: 'frost',
        icon: 'Frost/Frozen in Ice',
        tags: ['attack', 'damage', 'frost', 'lichborne'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },
      damageConfig: {
        formula: '1d8 + intelligence',
        elementType: 'frost',
        damageType: 'direct',
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'constitution',
          difficultyClass: 12,
          saveOutcome: 'negates',
          partialEffect: false
        }
      },
      debuffConfig: {
        debuffType: 'statusEffect',
        durationValue: 1,
        durationType: 'rounds',
        durationUnit: 'rounds',
        saveDC: 12,
        saveType: 'constitution',
        saveOutcome: 'negates',
        effects: [{
          id: 'slow',
          name: 'Chilled',
          description: 'Movement speed reduced by 10 feet for 1 round',
          statPenalty: { stat: 'movement_speed', value: -10 },
          movementPenalty: -10
        }]
      },
      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 60,
        targetRestrictions: ['enemy'],
        maxTargets: 1,
        targetSelectionMethod: 'manual',
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 4 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 0
      },
      resolution: 'DICE',
      tags: ['attack', 'damage', 'frost', 'lichborne']
    },
    
    {
      id: 'lichborne_ice_armor',
      name: 'Ice Armor',
      description: 'Encase yourself in protective frost, gaining temporary armor and resistance.',
      level: 1,
      spellType: 'ACTION',
      effectTypes: ['buff'],
      typeConfig: {
        school: 'frost',
        icon: 'Frost/Frozen in Ice',
        tags: ['buff', 'defense', 'frost', 'lichborne'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },
      buffConfig: {
        buffType: 'statEnhancement',
        effects: [{
          id: 'armor_boost',
          name: 'Ice Armor',
          description: 'Gain +2 armor for 3 rounds',
          statModifier: {
            stat: 'armor',
            magnitude: 2,
            magnitudeType: 'flat'
          }
        }],
        durationValue: 3,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: false,
        canBeDispelled: true
      },
      targetingConfig: {
        targetingType: 'self'
      },
      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 4 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 3
      },
      resolution: 'DICE',
      tags: ['buff', 'defense', 'frost', 'lichborne']
    },

    {
      id: 'lichborne_phylactery_store',
      name: 'Phylactery Store',
      description: 'Channel your life force into your phylactery, storing HP for emergency resurrection.',
      level: 1,
      spellType: 'ACTION',
      effectTypes: ['utility'],
      typeConfig: {
        school: 'necrotic',
        icon: 'Necrotic/Drain Soul',
        tags: ['utility', 'phylactery', 'lichborne'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },
      utilityConfig: {
        utilityType: 'special',
        selectedEffects: [{
          id: 'phylactery_store',
          name: 'Store Life Force',
          description: 'Store up to 20 HP in phylactery. Lose that HP now but can resurrect with it later.'
        }],
        duration: 0,
        durationUnit: 'permanent',
        concentration: false,
        power: 'minor'
      },
      targetingConfig: {
        targetingType: 'self'
      },
      resourceCost: {
        resourceTypes: [],
        resourceValues: {},
        useFormulas: {},
        actionPoints: 1,
        components: ['somatic'],
        hpCost: 10
      },
      cooldownConfig: {
        type: 'short_rest',
        value: 1
      },
      resolution: 'DICE',
      tags: ['utility', 'phylactery', 'lichborne']
    },

    // ===== LEVEL 2 SPELLS =====
    {
      id: 'lichborne_siphon_soul',
      name: 'Siphon Soul',
      description: 'Drain the life force from a target, dealing frost damage and healing yourself for half. If target dies, gain bonus Phylactery HP.',
      level: 2,
      spellType: 'ACTION',
      effectTypes: ['damage', 'healing'],
      typeConfig: {
        school: 'frost',
        secondaryElement: 'necrotic',
        icon: 'Necrotic/Drain Soul',
        tags: ['attack', 'damage', 'healing', 'drain', 'phylactery', 'lichborne'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },
      damageConfig: {
        formula: '2d8 + intelligence',
        elementType: 'frost',
        damageType: 'direct',
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'constitution',
          difficultyClass: 13,
          saveOutcome: 'halves',
          partialEffect: true,
          partialEffectFormula: 'damage/2'
        }
      },
      healingConfig: {
        formula: 'half_damage_dealt',
        healingType: 'instant',
        hasHotEffect: false,
        hasShieldEffect: false,
        description: 'Heal yourself for half the damage dealt'
      },
      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 30,
        targetRestrictions: ['enemy'],
        maxTargets: 1,
        targetSelectionMethod: 'manual',
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 8 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 1
      },
      resolution: 'DICE',
      tags: ['attack', 'damage', 'healing', 'drain', 'phylactery', 'lichborne']
    },

    {
      id: 'lichborne_freezing_touch',
      name: 'Freezing Touch',
      description: 'Touch your enemy with frost-laden hands, freezing them in place briefly.',
      level: 2,
      spellType: 'ACTION',
      effectTypes: ['control'],
      typeConfig: {
        school: 'frost',
        icon: 'Frost/Dripping Ice',
        tags: ['control', 'frost', 'stun', 'lichborne'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },
      controlConfig: {
        controlType: 'incapacitation',
        strength: 'moderate',
        duration: 1,
        durationUnit: 'rounds',
        saveDC: 13,
        saveType: 'constitution',
        savingThrow: true,
        effects: [{
          id: 'paralyze',
          name: 'Frozen',
          description: 'Target is frozen solid and cannot move or take actions for 1 round',
          config: {
            durationType: 'rounds',
            recoveryMethod: 'automatic',
            saveType: 'constitution',
            saveDC: 15,
            duration: 1,
            durationUnit: 'rounds'
          }
        }]
      },
      targetingConfig: {
        targetingType: 'single',
        rangeType: 'touch',
        targetRestrictions: ['enemy'],
        maxTargets: 1,
        targetSelectionMethod: 'manual',
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 8 },
        useFormulas: {},
        actionPoints: 2,
        components: ['somatic']
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 2
      },
      resolution: 'DICE',
      tags: ['control', 'frost', 'stun', 'lichborne']
    },

    {
      id: 'lichborne_frost_ward',
      name: 'Frost Ward',
      description: 'Create a protective ward of frost around yourself or an ally.',
      level: 2,
      spellType: 'ACTION',
      effectTypes: ['buff'],
      typeConfig: {
        school: 'frost',
        icon: 'Frost/Icy Shield',
        tags: ['buff', 'defense', 'shield', 'lichborne'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },
      buffConfig: {
        buffType: 'statEnhancement',
        effects: [{
          id: 'damage_reduction',
          name: 'Frost Ward',
          description: 'Reduces incoming damage by 3 (flat reduction per hit) for 2 rounds',
          statModifier: {
            stat: 'damage_reduction',
            magnitude: 3,
            magnitudeType: 'flat'
          }
        }],
        durationValue: 2,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: false,
        canBeDispelled: true
      },
      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 30,
        targetRestrictions: ['ally', 'self'],
        maxTargets: 1,
        targetSelectionMethod: 'manual',
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 7 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 3
      },
      resolution: 'DICE',
      tags: ['buff', 'defense', 'shield', 'lichborne']
    },

    // ===== LEVEL 3 SPELLS =====
    {
      id: 'lichborne_frozen_orb',
      name: 'Frozen Orb',
      description: 'Conjure a sphere of absolute zero that explodes in a burst of frost, damaging all enemies in the area.',
      level: 3,
      spellType: 'ACTION',
      effectTypes: ['damage'],
      typeConfig: {
        school: 'frost',
        icon: 'Frost/Ice Orb',
        tags: ['attack', 'damage', 'aoe', 'frost', 'lichborne'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },
      damageConfig: {
        formula: '4d6 + intelligence',
        elementType: 'frost',
        damageType: 'direct'
      },
      debuffConfig: {
        debuffType: 'statusEffect',
        durationValue: 1,
        durationType: 'rounds',
        durationUnit: 'rounds',
        saveDC: 14,
        saveType: 'constitution',
        saveOutcome: 'negates',
        effects: [{
          id: 'slow',
          name: 'Chilled',
          description: 'Movement speed reduced by 15 feet for 1 round',
          statPenalty: { stat: 'movement_speed', value: -15 },
          movementPenalty: -15
        }]
      },
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 60,
        aoeShape: 'circle',
        aoeParameters: { radius: 20 },
        targetRestrictions: ['enemy'],
        maxTargets: 10,
        targetSelectionMethod: 'manual',
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 10 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 2
      },
      resolution: 'DICE',
      tags: ['attack', 'damage', 'aoe', 'frost', 'lichborne']
    },

    {
      id: 'lichborne_ice_lance',
      name: 'Ice Lance',
      description: 'Hurl a massive lance of ice that deals devastating damage to a single target.',
      level: 3,
      spellType: 'ACTION',
      effectTypes: ['damage'],
      typeConfig: {
        school: 'frost',
        icon: 'Frost/Frostbite Effect',
        tags: ['attack', 'damage', 'frost', 'lichborne'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },
      damageConfig: {
        formula: '4d6 + intelligence',
        elementType: 'frost',
        damageType: 'direct',
        criticalConfig: {
          enabled: true,
          critType: 'dice',
          critMultiplier: 2,
          critDiceOnly: false,
          explodingDice: false,
          critEffects: ['knockback'],
          spellEffect: null
        }
      },
      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 100,
        targetRestrictions: ['enemy'],
        maxTargets: 1,
        targetSelectionMethod: 'manual',
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 12 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 1
      },
      resolution: 'DICE',
      tags: ['attack', 'damage', 'frost', 'lichborne']
    },

    {
      id: 'lichborne_ice_step',
      name: 'Ice Step',
      description: 'Teleport to a frozen or chilled enemy, dealing frost damage to them and any enemies you pass through.',
      level: 3,
      spellType: 'ACTION',
      effectTypes: ['damage', 'utility'],
      typeConfig: {
        school: 'frost',
        icon: 'Frost/Frost Freeze 1',
        tags: ['attack', 'damage', 'movement', 'teleport', 'frost', 'lichborne'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },
      damageConfig: {
        formula: '2d6 + intelligence',
        elementType: 'frost',
        damageType: 'direct',
        description: 'Deals frost damage to the target and any enemies passed through during teleport'
      },
      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 60,
        targetRestrictions: ['enemy'],
        maxTargets: 1,
        targetSelectionMethod: 'manual',
        requiresLineOfSight: true,
        targetCondition: 'frozen_or_chilled'
      },
      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 6 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 1
      },
      specialMechanics: {
        teleport: {
          type: 'targeted',
          range: 60,
          condition: 'Target must be Frozen or Chilled',
          effect: 'Teleport to a space adjacent to the target',
          pathDamage: true
        }
      },
      resolution: 'DICE',
      tags: ['attack', 'damage', 'movement', 'teleport', 'frost', 'lichborne']
    },

    {
      id: 'lichborne_frost_fever',
      name: 'Frost Fever',
      description: 'Afflict a target with supernatural frostbite. Deals damage that increases the lower your HP is — the closer to death, the more devastating.',
      level: 3,
      spellType: 'ACTION',
      effectTypes: ['damage', 'control'],
      typeConfig: {
        school: 'frost',
        icon: 'Frost/Frostbite Effect',
        tags: ['attack', 'damage', 'debuff', 'desperation', 'frost', 'lichborne'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },
      damageConfig: {
        formula: '2d6 + intelligence + desperation_bonus',
        elementType: 'frost',
        damageType: 'direct',
        description: 'Below 75% HP: +1d6. Below 50% HP: +2d6. Below 25% HP: +3d6.'
      },
      debuffConfig: {
        debuffType: 'statusEffect',
        durationValue: 2,
        durationType: 'rounds',
        durationUnit: 'rounds',
        saveDC: 14,
        saveType: 'constitution',
        saveOutcome: 'negates',
        effects: [{
          id: 'frostbite',
          name: 'Frost Fever',
          description: 'Movement speed reduced by 10 feet. Takes 1d4 frost damage per 5 feet moved.',
          statPenalty: { stat: 'movement_speed', value: -10 },
          movementPenalty: -10
        }]
      },
      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 40,
        targetRestrictions: ['enemy'],
        maxTargets: 1,
        targetSelectionMethod: 'manual',
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 10 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 1
      },
      resolution: 'DICE',
      tags: ['attack', 'damage', 'debuff', 'desperation', 'frost', 'lichborne']
    },

    // ===== LEVEL 4 SPELLS =====
    {
      id: 'lichborne_glacial_spike',
      name: 'Glacial Spike',
      description: 'Summon a massive spike of ancient ice that impales your target.',
      level: 4,
      spellType: 'ACTION',
      effectTypes: ['damage'],
      typeConfig: {
        school: 'frost',
        icon: 'Frost/Inflicted Ice Shard',
        tags: ['attack', 'damage', 'frost', 'lichborne'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },
      damageConfig: {
        formula: '6d6 + intelligence',
        elementType: 'frost',
        damageType: 'direct',
        criticalConfig: {
          enabled: true,
          critType: 'dice',
          critMultiplier: 2,
          critDiceOnly: false,
          explodingDice: true,
          explodingDiceType: 'reroll_add',
          critEffects: ['stun'],
          spellEffect: null
        }
      },
      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 80,
        targetRestrictions: ['enemy'],
        maxTargets: 1,
        targetSelectionMethod: 'manual',
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 14 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 2
      },
      resolution: 'DICE',
      tags: ['attack', 'damage', 'frost', 'lichborne']
    },

    {
      id: 'lichborne_frost_nova',
      name: 'Frost Nova',
      description: 'Release a burst of frost energy that freezes all enemies around you.',
      level: 4,
      spellType: 'ACTION',
      effectTypes: ['control', 'damage'],
      typeConfig: {
        school: 'frost',
        icon: 'Frost/Frozen AoE',
        tags: ['control', 'damage', 'aoe', 'frost', 'lichborne'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },
      damageConfig: {
        formula: '5d6 + intelligence',
        elementType: 'frost',
        damageType: 'direct'
      },
      controlConfig: {
        controlType: 'restraint',
        strength: 'strong',
        duration: 2,
        durationUnit: 'rounds',
        saveDC: 15,
        saveType: 'constitution',
        savingThrow: true,
        effects: [{
          id: 'bind',
          name: 'Frozen in Place',
          description: 'Target is rooted and cannot move for 2 rounds',
          config: {
            restraintType: 'physical',
            saveType: 'constitution',
            saveDC: 15,
            duration: 2,
            durationUnit: 'rounds',
            immobilize: true
          }
        }]
      },
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'circle',
        aoeParameters: { radius: 20 },
        targetRestrictions: ['enemy'],
        maxTargets: 8,
        targetSelectionMethod: 'automatic',
        requiresLineOfSight: false
      },
      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 16 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 3
      },
      resolution: 'DICE',
      tags: ['control', 'damage', 'aoe', 'frost', 'lichborne']
    },

    {
      id: 'lichborne_phylactery_shield',
      name: 'Phylactery Shield',
      description: 'Channel power from your phylactery to create a protective barrier.',
      level: 4,
      spellType: 'ACTION',
      effectTypes: ['buff'],
      typeConfig: {
        school: 'necrotic',
        icon: 'Necrotic/Protective Aura',
        tags: ['buff', 'defense', 'shield', 'phylactery', 'lichborne'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },
      buffConfig: {
        buffType: 'temporaryHP',
        effects: [{
          id: 'temp_hp',
          name: 'Phylactery Shield',
          description: 'Grants temporary shield equal to stored phylactery HP',
          tempHPFormula: 'phylactery_hp',
          tempHPType: 'barrier'
        }],
        durationValue: 3,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: false,
        canBeDispelled: false
      },
      targetingConfig: {
        targetingType: 'self'
      },
      resourceCost: {
        resourceTypes: [],
        resourceValues: {},
        useFormulas: {},
        actionPoints: 1,
        components: ['somatic']
      },
      cooldownConfig: {
        type: 'short_rest',
        value: 1
      },
      resolution: 'DICE',
      tags: ['buff', 'defense', 'shield', 'phylactery', 'lichborne']
    },

    // ===== LEVEL 5 SPELLS =====
    {
      id: 'lichborne_blizzard',
      name: 'Blizzard',
      description: 'Summon a devastating blizzard that damages and slows all enemies in a large area.',
      level: 5,
      spellType: 'CHANNELED',
      effectTypes: ['damage', 'control'],
      typeConfig: {
        school: 'frost',
        icon: 'Frost/Frozen Wave',
        tags: ['channeled', 'damage', 'control', 'aoe', 'frost', 'lichborne'],
        maxChannelDuration: 3,
        durationUnit: 'ROUNDS',
        interruptible: true,
        movementAllowed: false,
        concentrationDC: 12,
        dcType: 'CONSTITUTION',
        tickFrequency: 'START_OF_TURN',
        breakEffect: 'none'
      },
      damageConfig: {
        formula: '5d6 + intelligence',
        elementType: 'frost',
        damageType: 'area',
        hasDotEffect: true,
        dotConfig: {
          duration: 3,
          tickFrequency: 'round',
          dotFormula: '5d6 + intelligence',
          isProgressiveDot: false
        }
      },
      debuffConfig: {
        debuffType: 'statusEffect',
        durationValue: 3,
        durationType: 'rounds',
        durationUnit: 'rounds',
        saveDC: 15,
        saveType: 'constitution',
        saveOutcome: 'halves_effects',
        effects: [{
          id: 'slow',
          name: 'Chilled by Blizzard',
          description: 'Movement speed reduced by 20 feet while in blizzard',
          statPenalty: { stat: 'movement_speed', value: -20 },
          movementPenalty: -20
        }]
      },
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 60,
        aoeShape: 'circle',
        aoeParameters: { radius: 30 },
        targetRestrictions: ['enemy'],
        maxTargets: 15,
        targetSelectionMethod: 'manual',
        requiresLineOfSight: true
      },
      channelingConfig: {
        type: 'persistent',
        baseFormula: '5d6 + intelligence',
        tickFrequency: 'round',
        maxDuration: 3
      },
      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 14 },
        useFormulas: {},
        actionPoints: 2,
        channelingFrequency: 'per_round',
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 4
      },
      resolution: 'DICE',
      tags: ['channeled', 'damage', 'control', 'aoe', 'frost', 'lichborne']
    },

    {
      id: 'lichborne_deaths_return',
      name: "Death's Return",
      description: 'When you resurrect via Phylactery, the cold of your return freezes all nearby enemies. This passive enhances your Death Trigger: increased freeze radius and duration.',
      level: 5,
      spellType: 'PASSIVE',
      effectTypes: ['control', 'utility'],
      typeConfig: {
        school: 'frost',
        icon: 'Frost/Frozen in Ice',
        tags: ['control', 'passive', 'phylactery', 'frost', 'lichborne'],
        toggleable: false
      },
      utilityConfig: {
        utilityType: 'special',
        selectedEffects: [{
          id: 'death_trigger_enhanced',
          name: "Death's Return",
          description: 'Death Trigger freeze radius increased to 20ft (from 15ft). Freeze duration increased to 2 rounds (from 1). Enemies frozen by Death Trigger take +1d6 frost damage.'
        }],
        duration: 0,
        durationUnit: 'permanent',
        concentration: false,
        power: 'major'
      },
      buffConfig: {
        buffType: 'custom',
        effects: [{
          id: 'death_trigger_enhancement',
          name: "Death's Return",
          description: 'Enhanced Death Trigger on Phylactery resurrection',
          customDescription: 'Your Phylactery resurrection is devastating. When you die and resurrect, the cold of your return freezes all enemies within 20ft for 2 rounds and deals 1d6 frost damage to each.'
        }],
        durationValue: 0,
        durationType: 'permanent',
        durationUnit: 'permanent',
        concentrationRequired: false,
        canBeDispelled: false
      },
      targetingConfig: {
        targetingType: 'self'
      },
      resourceCost: {
        resourceTypes: [],
        resourceValues: {},
        useFormulas: {},
        actionPoints: 0,
        components: []
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 0
      },
      resolution: 'DICE',
      tags: ['control', 'passive', 'phylactery', 'frost', 'lichborne']
    },

    {
      id: 'lichborne_cryonic_preservation',
      name: 'Cryonic Preservation',
      description: 'Freeze yourself or an ally in ice, becoming invulnerable but unable to act.',
      level: 5,
      spellType: 'ACTION',
      effectTypes: ['utility', 'buff'],
      typeConfig: {
        school: 'frost',
        icon: 'Frost/Ice Shards',
        tags: ['utility', 'buff', 'defense', 'frost', 'lichborne'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },
      utilityConfig: {
        utilityType: 'special',
        selectedEffects: [{
          id: 'ice_block',
          name: 'Cryonic Preservation',
          description: 'Target is frozen in unbreakable ice. Immune to all damage. Cannot move or act. Lasts 2 rounds.'
        }],
        duration: 2,
        durationUnit: 'rounds',
        concentration: false,
        power: 'major'
      },
      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 30,
        targetRestrictions: ['ally', 'self'],
        maxTargets: 1,
        targetSelectionMethod: 'manual',
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 16 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },
      resolution: 'DICE',
      tags: ['utility', 'buff', 'defense', 'frost', 'lichborne']
    },

    // ===== LEVEL 6 SPELLS =====
    {
      id: 'lichborne_glacial_cascade',
      name: 'Glacial Cascade',
      description: 'Unleash a cascade of ice shards that strike multiple enemies in sequence.',
      level: 6,
      spellType: 'ACTION',
      effectTypes: ['damage'],
      typeConfig: {
        school: 'frost',
        icon: 'Frost/Frozen Area',
        tags: ['attack', 'damage', 'chain', 'frost', 'lichborne'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },
      damageConfig: {
        formula: '9d6 + intelligence',
        elementType: 'frost',
        damageType: 'direct'
      },
      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 60,
        targetRestrictions: ['enemy'],
        maxTargets: 1,
        targetSelectionMethod: 'manual',
        requiresLineOfSight: true,
        propagationMethod: 'chain',
        propagationBehavior: 'nearest'
      },
      propagation: {
        method: 'chain',
        behavior: 'nearest',
        parameters: {
          count: 3,
          range: 30,
          decay: 20
        }
      },
      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 22 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 3
      },
      resolution: 'DICE',
      tags: ['attack', 'damage', 'chain', 'frost', 'lichborne']
    },

    {
      id: 'lichborne_absolute_zero',
      name: 'Absolute Zero',
      description: 'Create a zone of absolute zero temperature that instantly freezes everything within.',
      level: 6,
      spellType: 'ACTION',
      effectTypes: ['damage', 'control'],
      typeConfig: {
        school: 'frost',
        icon: 'Frost/Inflicted Ice Shard',
        tags: ['attack', 'damage', 'control', 'aoe', 'frost', 'lichborne'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },
      damageConfig: {
        formula: '8d6 + intelligence * 2',
        elementType: 'frost',
        damageType: 'direct',
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'constitution',
          difficultyClass: 16,
          saveOutcome: 'halves',
          partialEffect: true,
          partialEffectFormula: 'damage/2'
        }
      },
      controlConfig: {
        controlType: 'incapacitation',
        strength: 'strong',
        duration: 2,
        durationUnit: 'rounds',
        saveDC: 16,
        saveType: 'constitution',
        savingThrow: true,
        effects: [{
          id: 'paralyze',
          name: 'Frozen Solid',
          description: 'Target is frozen solid and cannot take actions or reactions for 2 rounds',
          config: {
            durationType: 'rounds',
            recoveryMethod: 'automatic',
            saveType: 'constitution',
            saveDC: 18,
            duration: 2,
            durationUnit: 'rounds'
          }
        }]
      },
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 60,
        aoeShape: 'circle',
        aoeParameters: { radius: 25 },
        targetRestrictions: ['enemy'],
        maxTargets: 12,
        targetSelectionMethod: 'manual',
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 24 },
        useFormulas: {},
        actionPoints: 3,
        components: ['verbal', 'somatic', 'material'],
        materialComponents: 'A crystal of pure ice'
      },
      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },
      resolution: 'DICE',
      tags: ['attack', 'damage', 'control', 'aoe', 'frost', 'lichborne']
    },

    {
      id: 'lichborne_phylactery_burst',
      name: 'Phylactery Burst',
      description: 'Release all stored Phylactery HP as a devastating explosion of necrotic frost. Empties Phylactery completely.',
      level: 6,
      spellType: 'ACTION',
      effectTypes: ['damage'],
      typeConfig: {
        school: 'necrotic',
        secondaryElement: 'frost',
        icon: 'Necrotic/Necrotic Death',
        tags: ['attack', 'damage', 'aoe', 'necrotic', 'frost', 'phylactery', 'lichborne'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },
      damageConfig: {
        formula: '8d6 + intelligence + phylactery_hp',
        elementType: 'frost',
        secondaryElementType: 'necrotic',
        damageType: 'direct',
        description: 'Deals base damage plus your stored Phylactery HP. Empties Phylactery after use.'
      },
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'circle',
        aoeParameters: { radius: 25 },
        targetRestrictions: ['enemy'],
        maxTargets: 10,
        targetSelectionMethod: 'automatic',
        requiresLineOfSight: false
      },
      resourceCost: {
        resourceTypes: [],
        resourceValues: {},
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'short_rest',
        value: 1
      },
      resolution: 'DICE',
      tags: ['attack', 'damage', 'aoe', 'necrotic', 'frost', 'phylactery', 'lichborne']
    },

    // ===== LEVEL 7 SPELLS =====
    {
      id: 'lichborne_eternal_winter',
      name: 'Eternal Winter',
      description: 'Summon an eternal winter storm that engulfs the battlefield.',
      level: 7,
      spellType: 'STATE',
      effectTypes: ['damage', 'control'],
      typeConfig: {
        school: 'frost',
        icon: 'Frost/Frozen Wave',
        tags: ['damage', 'control', 'aoe', 'zone', 'frost', 'lichborne'],
        zoneDuration: 4,
        zoneDurationUnit: 'rounds',
        leaveTrail: false
      },
      damageConfig: {
        formula: '8d6 + intelligence',
        elementType: 'frost',
        damageType: 'area',
        criticalConfig: {
          enabled: true,
          critType: 'dice',
          critMultiplier: 2,
          critDiceOnly: false,
          extraDice: '3d6',
          critEffects: ['freeze'],
          freezeConfig: {
            duration: 1,
            durationUnit: 'round',
            saveDC: 17,
            saveType: 'constitution',
            speedReduction: 100
          }
        },
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'constitution',
          difficultyClass: 17,
          saveOutcome: 'halves',
          partialEffect: true,
          partialEffectFormula: 'damage/2'
        },
        hasDotEffect: true,
        dotConfig: {
          duration: 4,
          tickFrequency: 'round',
          dotFormula: '8d6 + intelligence',
          isProgressiveDot: false
        },
        description: 'All enemies in the zone take damage at the start of their turn'
      },
      debuffConfig: {
        debuffType: 'statusEffect',
        durationValue: 4,
        durationType: 'rounds',
        durationUnit: 'rounds',
        effects: [{
          id: 'slow',
          name: 'Winter Storm',
          description: 'Movement speed reduced by 50% and visibility heavily obscured',
          statPenalty: { stat: 'movement_speed', value: -50, magnitudeType: 'percentage' },
          movementPenalty: -50
        }]
      },
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 80,
        aoeShape: 'circle',
        aoeParameters: { radius: 40 },
        targetRestrictions: ['enemy'],
        maxTargets: 20,
        targetSelectionMethod: 'manual',
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 24 },
        useFormulas: {},
        actionPoints: 3,
        components: ['verbal', 'somatic', 'material'],
        materialComponents: 'Snow from a mountain peak'
      },
      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },
      resolution: 'DICE',
      tags: ['damage', 'control', 'aoe', 'zone', 'frost', 'lichborne']
    },

    {
      id: 'lichborne_frost_chains',
      name: 'Frost Chains',
      description: 'Bind multiple enemies with chains of magical ice.',
      level: 7,
      spellType: 'ACTION',
      effectTypes: ['control'],
      typeConfig: {
        school: 'frost',
        icon: 'Frost/Ice Orb',
        tags: ['control', 'multi target', 'frost', 'lichborne'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },
      controlConfig: {
        controlType: 'restraint',
        strength: 'strong',
        duration: 3,
        durationUnit: 'rounds',
        saveDC: 17,
        saveType: 'strength',
        savingThrow: true,
        effects: [{
          id: 'bind',
          name: 'Frost Chains',
          description: 'Target is bound by frost chains and cannot move or take actions for 3 rounds. Can attempt DC 17 Strength save at end of each turn to break free.',
          config: {
            restraintType: 'magical',
            saveType: 'strength',
            saveDC: 17,
            duration: 3,
            durationUnit: 'rounds',
            immobilize: true
          }
        }]
      },
      targetingConfig: {
        targetingType: 'multi',
        rangeType: 'ranged',
        rangeDistance: 60,
        targetRestrictions: ['enemy'],
        maxTargets: 4,
        targetSelectionMethod: 'manual',
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 25 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 4
      },
      resolution: 'DICE',
      tags: ['control', 'multi target', 'frost', 'lichborne']
    },

    {
      id: 'lichborne_soul_frost',
      name: 'Soul Frost',
      description: 'Corrupt a target with hybrid necrotic frost, draining their life force to heal yourself and chilling nearby enemies. Deals frost and necrotic damage split between the target and enemies in a 10ft radius around them.',
      level: 7,
      spellType: 'ACTION',
      effectTypes: ['damage', 'healing', 'control'],
      typeConfig: {
        school: 'frost',
        secondaryElement: 'necrotic',
        icon: 'Necrotic/Drain Soul',
        tags: ['attack', 'damage', 'healing', 'aoe', 'necrotic', 'frost', 'lichborne'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },
      damageConfig: {
        formula: '6d6 + intelligence',
        elementType: 'frost',
        secondaryElementType: 'necrotic',
        damageType: 'direct',
        description: 'Deals 3d6 frost + 3d6 necrotic to primary target. Enemies within 10ft take 2d6 frost damage and must save or be Chilled. Heal for half of total damage dealt.',
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'constitution',
          difficultyClass: 17,
          saveOutcome: 'halves',
          partialEffect: true,
          partialEffectFormula: 'damage/2'
        }
      },
      healingConfig: {
        formula: 'half_damage_dealt',
        healingType: 'instant',
        hasHotEffect: false,
        hasShieldEffect: false,
        description: 'Heal yourself for half the total damage dealt'
      },
      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 40,
        targetRestrictions: ['enemy'],
        maxTargets: 1,
        targetSelectionMethod: 'manual',
        requiresLineOfSight: true,
        aoeShape: 'circle',
        aoeParameters: { radius: 10, centeredOn: 'target' }
      },
      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 22 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 3
      },
      resolution: 'DICE',
      tags: ['attack', 'damage', 'healing', 'aoe', 'necrotic', 'frost', 'lichborne']
    },

    // ===== LEVEL 8 SPELLS =====
    {
      id: 'lichborne_glacier_formation',
      name: 'Glacier Formation',
      description: 'Create a massive glacier that crushes and freezes all enemies in a huge area.',
      level: 8,
      spellType: 'ACTION',
      effectTypes: ['damage', 'control'],
      typeConfig: {
        school: 'frost',
        icon: 'Frost/Frozen in Ice',
        tags: ['attack', 'damage', 'control', 'aoe', 'frost', 'lichborne'],
        castTime: 2,
        castTimeType: 'IMMEDIATE'
      },
      damageConfig: {
        formula: '14d6 + intelligence',
        elementType: 'frost',
        damageType: 'direct',
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'agility',
          difficultyClass: 18,
          saveOutcome: 'halves',
          partialEffect: true,
          partialEffectFormula: 'damage/2'
        }
      },
      controlConfig: {
        controlType: 'restraint',
        strength: 'extreme',
        duration: 3,
        durationUnit: 'rounds',
        saveDC: 18,
        saveType: 'strength',
        savingThrow: true,
        effects: [{
          id: 'bind',
          name: 'Trapped in Glacier',
          description: 'Target is trapped within the glacier and restrained for 3 rounds. Requires DC 18 Strength check to break free.',
          config: {
            restraintType: 'physical',
            saveType: 'strength',
            saveDC: 18,
            duration: 3,
            durationUnit: 'rounds',
            immobilize: true
          }
        }]
      },
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 100,
        aoeShape: 'circle',
        aoeParameters: { radius: 35 },
        targetRestrictions: ['enemy'],
        maxTargets: 15,
        targetSelectionMethod: 'manual',
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 30 },
        useFormulas: {},
        actionPoints: 3,
        components: ['verbal', 'somatic', 'material'],
        materialComponents: 'Ancient glacial ice'
      },
      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },
      resolution: 'DICE',
      tags: ['attack', 'damage', 'control', 'aoe', 'frost', 'lichborne']
    },

    {
      id: 'lichborne_frozen_tomb',
      name: 'Frozen Tomb',
      description: 'Encase a powerful enemy in an unbreakable tomb of ice.',
      level: 8,
      spellType: 'ACTION',
      effectTypes: ['control'],
      typeConfig: {
        school: 'frost',
        icon: 'Frost/Icey wall',
        tags: ['control', 'single target', 'frost', 'lichborne'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },
      controlConfig: {
        controlType: 'incapacitation',
        strength: 'extreme',
        duration: 5,
        durationUnit: 'rounds',
        saveDC: 18,
        saveType: 'constitution',
        savingThrow: true,
        effects: [{
          id: 'paralyze',
          name: 'Frozen Tomb',
          description: 'Target is encased in magical ice and completely incapacitated for 5 rounds. Cannot take any actions. Ice has 150 HP. Target can attempt DC 18 Constitution save at end of each turn.',
          config: {
            durationType: 'rounds',
            recoveryMethod: 'save_or_break',
            saveType: 'constitution',
            saveDC: 18,
            duration: 5,
            durationUnit: 'rounds',
            immobilize: true,
            shieldValue: 150
          }
        }]
      },
      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 60,
        targetRestrictions: ['enemy'],
        maxTargets: 1,
        targetSelectionMethod: 'manual',
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 28 },
        useFormulas: {},
        actionPoints: 3,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },
      resolution: 'DICE',
      tags: ['control', 'single target', 'frost', 'lichborne']
    },

    {
      id: 'lichborne_deathfrost_aura',
      name: 'Deathfrost Aura',
      description: 'Amplify your Eternal Frost Aura to lethal levels, dealing damage to nearby enemies.',
      level: 8,
      spellType: 'STATE',
      effectTypes: ['damage', 'buff'],
      typeConfig: {
        school: 'frost',
        secondaryElement: 'necrotic',
        icon: 'Frost/Frozen in Ice',
        tags: ['buff', 'damage', 'aura', 'frost', 'necrotic', 'lichborne'],
        stateVisibility: 'visible',
        cooldownAfterTrigger: 0,
        cooldownUnit: 'seconds',
        maxTriggers: -1
      },
      damageConfig: {
        formula: '13d6 + intelligence',
        elementType: 'frost',
        secondaryElementType: 'necrotic',
        damageType: 'area',
        description: 'Enemies within 15 feet take damage at the start of their turn'
      },
      buffConfig: {
        buffType: 'statEnhancement',
        effects: [{
          id: 'frost_amplification',
          name: 'Amplified Eternal Frost',
          description: 'Eternal Frost Aura bonus increased to +2d6 for 4 rounds',
          statModifier: {
            stat: 'frost_damage',
            magnitude: 2,
            magnitudeType: 'dice'
          }
        }],
        durationValue: 4,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: true,
        canBeDispelled: true
      },
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'circle',
        aoeParameters: { radius: 15 },
        targetRestrictions: ['enemy'],
        maxTargets: 10,
        targetSelectionMethod: 'automatic',
        requiresLineOfSight: false
      },
      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 32 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },
      resolution: 'DICE',
      tags: ['buff', 'damage', 'aura', 'frost', 'necrotic', 'lichborne']
    },

    // ===== LEVEL 9 SPELLS =====
    {
      id: 'lichborne_ice_age',
      name: 'Ice Age',
      description: 'Bring forth a new ice age, freezing the entire battlefield.',
      level: 9,
      spellType: 'ACTION',
      effectTypes: ['damage', 'control'],
      typeConfig: {
        school: 'frost',
        icon: 'Frost/Frozen Wave',
        tags: ['attack', 'damage', 'control', 'aoe', 'frost', 'epic', 'lichborne'],
        castTime: 3,
        castTimeType: 'IMMEDIATE'
      },
      damageConfig: {
        formula: '18d6 + intelligence',
        elementType: 'frost',
        damageType: 'direct',
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'constitution',
          difficultyClass: 19,
          saveOutcome: 'halves',
          partialEffect: true,
          partialEffectFormula: 'damage/2'
        }
      },
      controlConfig: {
        controlType: 'incapacitation',
        strength: 'extreme',
        duration: 4,
        durationUnit: 'rounds',
        saveDC: 19,
        saveType: 'constitution',
        savingThrow: true,
        effects: [{
          id: 'paralyze',
          name: 'Frozen by Ice Age',
          description: 'Target is completely frozen solid for 4 rounds. Cannot take any actions or reactions. Requires DC 19 Constitution save at end of each turn to break free.',
          config: {
            durationType: 'rounds',
            recoveryMethod: 'save',
            saveType: 'constitution',
            saveDC: 19,
            duration: 4,
            durationUnit: 'rounds'
          }
        }]
      },
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 150,
        aoeShape: 'circle',
        aoeParameters: { radius: 60 },
        targetRestrictions: ['enemy'],
        maxTargets: 30,
        targetSelectionMethod: 'manual',
        requiresLineOfSight: false
      },
      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 35 },
        useFormulas: {},
        actionPoints: 3,
        components: ['verbal', 'somatic', 'material'],
        materialComponents: 'A crystal from the elemental plane of ice'
      },
      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },
      resolution: 'DICE',
      tags: ['attack', 'damage', 'control', 'aoe', 'frost', 'epic', 'lichborne']
    },

    {
      id: 'lichborne_lich_ascension',
      name: 'Lich Ascension',
      description: 'Temporarily ascend to true lichdom, gaining immense power and near invulnerability.',
      level: 9,
      spellType: 'STATE',
      effectTypes: ['buff', 'transformation'],
      typeConfig: {
        school: 'necrotic',
        secondaryElement: 'frost',
        icon: 'Void/Consumed by Void',
        tags: ['buff', 'transformation', 'phylactery', 'epic', 'lichborne'],
        stateVisibility: 'visible',
        cooldownAfterTrigger: 0,
        cooldownUnit: 'seconds',
        maxTriggers: 1
      },
      buffConfig: {
        buffType: 'statEnhancement',
        effects: [
          {
            id: 'lich_power',
            name: 'Lich Power',
            description: 'All frost spells deal +3d6 damage, gain +5 armor, and reduce all incoming damage by 3 for 5 rounds',
            statModifier: {
              stat: 'armor',
              magnitude: 5,
              magnitudeType: 'flat'
            }
          },
          {
            id: 'lich_reduction',
            name: 'Undead Resilience',
            description: 'Reduce all incoming damage by 3 (flat reduction per hit) for 5 rounds',
            statModifier: {
              stat: 'damage_reduction',
              magnitude: 3,
              magnitudeType: 'flat'
            }
          }
        ],
        durationValue: 5,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: false,
        canBeDispelled: false
      },
      transformationConfig: {
        transformationType: 'elemental',
        targetType: 'self',
        duration: 5,
        durationUnit: 'rounds',
        power: 'major',
        newForm: 'Eternal Winter',
        description: 'Become one with the endless cold, transcending the limitations of undeath.',
        grantedAbilities: [
          { id: 'frost_control', name: 'Frost Aura Mastery', description: 'Eternal Frost Aura no longer drains your HP' },
          { id: 'frost_immunity', name: 'Frost Immunity', description: 'Immune to frost damage' }
        ]
      },
      targetingConfig: {
        targetingType: 'self'
      },
      resourceCost: {
        resourceTypes: [],
        resourceValues: {},
        useFormulas: {},
        actionPoints: 3,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },
      resolution: 'DICE',
      tags: ['buff', 'transformation', 'phylactery', 'epic', 'lichborne']
    },

    {
      id: 'lichborne_phylactery_nova',
      name: 'Phylactery Nova',
      description: 'Release all stored phylactery power in a devastating explosion.',
      level: 9,
      spellType: 'ACTION',
      effectTypes: ['damage'],
      typeConfig: {
        school: 'necrotic',
        secondaryElement: 'frost',
        icon: 'Psychic/Mind Strike',
        tags: ['attack', 'damage', 'aoe', 'necrotic', 'frost', 'phylactery', 'epic', 'lichborne'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },
      damageConfig: {
        formula: '20d6 + intelligence + phylactery_hp',
        elementType: 'necrotic',
        secondaryElementType: 'frost',
        damageType: 'direct',
        description: 'Damage scales with stored phylactery HP (multiplied by 2). Empties phylactery completely.'
      },
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'circle',
        aoeParameters: { radius: 50 },
        targetRestrictions: ['enemy'],
        maxTargets: 25,
        targetSelectionMethod: 'automatic',
        requiresLineOfSight: false
      },
      resourceCost: {
        resourceTypes: [],
        resourceValues: {},
        useFormulas: {},
        actionPoints: 3,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },
      resolution: 'DICE',
      tags: ['attack', 'damage', 'aoe', 'necrotic', 'frost', 'phylactery', 'epic', 'lichborne']
    },

    // ===== LEVEL 10 SPELLS =====
    {
      id: 'lichborne_apocalyptic_freeze',
      name: 'Apocalyptic Freeze',
      description: 'Freeze time itself, stopping all enemies in their tracks while you move freely.',
      level: 10,
      spellType: 'ACTION',
      effectTypes: ['control'],
      typeConfig: {
        school: 'frost',
        icon: 'Frost/Frost Freeze 1',
        tags: ['control', 'aoe', 'frost', 'time', 'legendary', 'lichborne'],
        castTime: 2,
        castTimeType: 'IMMEDIATE'
      },
      controlConfig: {
        controlType: 'incapacitation',
        strength: 'extreme',
        duration: 3,
        durationUnit: 'rounds',
        saveDC: 20,
        saveType: 'constitution',
        savingThrow: true,
        effects: [{
          id: 'stun',
          name: 'Time Frozen',
          description: 'All enemies are frozen in time for 3 rounds. Cannot move, act, or react. You can act normally. Requires DC 20 Constitution save to negate.',
          config: {
            durationType: 'rounds',
            recoveryMethod: 'automatic',
            saveType: 'constitution',
            saveDC: 20,
            duration: 3,
            durationUnit: 'rounds'
          }
        }]
      },
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'circle',
        aoeParameters: { radius: 100 },
        targetRestrictions: ['enemy'],
        maxTargets: 50,
        targetSelectionMethod: 'automatic',
        requiresLineOfSight: false
      },
      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 38 },
        useFormulas: {},
        actionPoints: 3,
        components: ['verbal', 'somatic', 'material'],
        materialComponents: 'The heart of a time elemental'
      },
      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },
      resolution: 'DICE',
      tags: ['control', 'aoe', 'frost', 'time', 'legendary', 'lichborne']
    },

    {
      id: 'lichborne_eternal_phylactery',
      name: 'Eternal Phylactery',
      description: 'Bind your soul permanently to your phylactery, ensuring infinite resurrections.',
      level: 10,
      spellType: 'PASSIVE',
      effectTypes: ['utility', 'buff'],
      typeConfig: {
        school: 'necrotic',
        icon: 'Necrotic/Protective Aura',
        tags: ['utility', 'buff', 'passive', 'phylactery', 'legendary', 'lichborne', 'toggleable'],
        toggleable: true
      },
      utilityConfig: {
        utilityType: 'special',
        selectedEffects: [{
          id: 'eternal_phylactery',
          name: 'Eternal Phylactery',
          description: 'Resurrection limit increased to 3 per combat. After each resurrection, phylactery auto-refills to 30 HP. Resurrection still spends all stored Phylactery HP. Can only be permanently destroyed by a legendary ritual.'
        }],
        duration: 0,
        durationUnit: 'permanent',
        concentration: false,
        power: 'major'
      },
      buffConfig: {
        buffType: 'custom',
        effects: [{
          id: 'phylactery_eternal',
          name: 'Eternal Phylactery',
          description: 'Enhanced phylactery with increased resurrection charges and auto-refill',
          customDescription: 'Your phylactery has become eternal. You can resurrect up to 3 times per combat. After each resurrection, your phylactery auto-refills to 30 HP. Each resurrection still spends all stored Phylactery HP.',
          mechanicsText: '3 resurrections per combat. Auto-refill to 30 HP after resurrection. Still spends all stored HP on rez.'
        }],
        durationValue: 0,
        durationType: 'permanent',
        durationUnit: 'permanent',
        concentrationRequired: false,
        canBeDispelled: false
      },
      targetingConfig: {
        targetingType: 'self'
      },
      resourceCost: {
        resourceTypes: [],
        resourceValues: {},
        useFormulas: {},
        actionPoints: 0,
        components: ['ritual'],
        materialComponents: 'The essence of immortality, 10,000 gold pieces worth of rare gems'
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 0
      },
      resolution: 'DICE',
      tags: ['utility', 'buff', 'passive', 'phylactery', 'legendary', 'lichborne', 'toggleable']
    },

    {
      id: 'lichborne_world_freeze',
      name: 'World Freeze',
      description: 'Freeze the entire world in ice, creating a permanent winter apocalypse.',
      level: 10,
      spellType: 'ACTION',
      effectTypes: ['damage', 'control', 'utility'],
      typeConfig: {
        school: 'frost',
        icon: 'Frost/Ice Crystal Rune',
        tags: ['attack', 'damage', 'control', 'terrain', 'frost', 'legendary', 'lichborne'],
        castTime: 5,
        castTimeType: 'IMMEDIATE'
      },
      damageConfig: {
        formula: '25d6 + intelligence',
        elementType: 'frost',
        damageType: 'direct',
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'constitution',
          difficultyClass: 20,
          saveOutcome: 'halves',
          partialEffect: true,
          partialEffectFormula: 'damage/2'
        }
      },
      controlConfig: {
        controlType: 'incapacitation',
        strength: 'extreme',
        duration: 10,
        durationUnit: 'rounds',
        saveDC: 20,
        saveType: 'constitution',
        savingThrow: true,
        effects: [{
          id: 'paralyze',
          name: 'World Freeze',
          description: 'All enemies are frozen solid for 10 rounds. Cannot take any actions. The terrain becomes permanently frozen.',
          config: {
            durationType: 'hours',
            recoveryMethod: 'save',
            saveType: 'constitution',
            saveDC: 22,
            duration: 10,
            durationUnit: 'rounds'
          }
        }]
      },
      utilityConfig: {
        utilityType: 'environment',
        selectedEffects: [{
          id: 'permanent_winter',
          name: 'Permanent Winter',
          description: 'The entire battlefield becomes permanently frozen terrain. Difficult terrain for enemies, normal for you.'
        }],
        duration: 0,
        durationUnit: 'permanent',
        concentration: false,
        power: 'major'
      },
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'sight',
        aoeShape: 'circle',
        aoeParameters: { radius: 200 },
        targetRestrictions: ['enemy'],
        maxTargets: 100,
        targetSelectionMethod: 'automatic',
        requiresLineOfSight: false
      },
      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 40 },
        useFormulas: {},
        actionPoints: 3,
        components: ['verbal', 'somatic', 'material'],
        materialComponents: 'A shard of the primordial ice, worth 50,000 gold'
      },
      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },
      resolution: 'DICE',
      tags: ['attack', 'damage', 'control', 'terrain', 'frost', 'legendary', 'lichborne']
    }
  ],

  // Spell Pools by Level
  spellPools: {
    1: [
      'lichborne_frost_bolt',
      'lichborne_ice_armor',
      'lichborne_phylactery_store'
    ],
    2: [
      'lichborne_siphon_soul',
      'lichborne_freezing_touch',
      'lichborne_frost_ward'
    ],
    3: [
      'lichborne_frozen_orb',
      'lichborne_ice_lance',
      'lichborne_frost_fever',
      'lichborne_ice_step'
    ],
    4: [
      'lichborne_glacial_spike',
      'lichborne_frost_nova',
      'lichborne_phylactery_shield'
    ],
    5: [
      'lichborne_blizzard',
      'lichborne_deaths_return',
      'lichborne_cryonic_preservation'
    ],
    6: [
      'lichborne_phylactery_burst',
      'lichborne_absolute_zero',
      'lichborne_glacial_cascade'
    ],
    7: [
      'lichborne_eternal_winter',
      'lichborne_frost_chains',
      'lichborne_soul_frost'
    ],
    8: [
      'lichborne_glacier_formation',
      'lichborne_frozen_tomb',
      'lichborne_deathfrost_aura'
    ],
    9: [
      'lichborne_ice_age',
      'lichborne_lich_ascension',
      'lichborne_phylactery_nova'
    ],
    10: [
      'lichborne_apocalyptic_freeze',
      'lichborne_eternal_phylactery',
      'lichborne_world_freeze'
    ]
  }
};


