/**
 * Lunarch Class Data
 * 
 * Complete class information for the Lunarch - a celestial archer and lunar mage
 * who channels the power of moon phases to adapt their combat style.
 */

export const LUNARCH_DATA = {
  id: 'lunarch',
  name: 'Lunarch',
  icon: 'fas fa-moon',
  role: 'Support/Control',

  // Overview section
  overview: {
    title: 'The Lunarch',
    subtitle: 'Celestial Archer and Lunar Mage',
    
    description: `The Lunarch is a master of celestial magic who draws power from the phases of the moon. Inspired by ancient lunar priestesses and celestial guardians, Lunarchs channel the ever-changing energy of the moon to adapt their combat style. Through the Phase Shift system, they flow between four distinct lunar phases, each granting unique bonuses and altering their spell effects. This dynamic resource system rewards tactical thinking and phase management, allowing Lunarchs to excel as versatile ranged combatants who can shift between offense, defense, and support as the battle demands.`,

    roleplayIdentity: {
      title: 'Roleplay Identity',
      content: `Lunarchs are devoted followers of lunar deities, celestial scholars, or individuals touched by moonlight magic. They often serve as guardians of sacred groves, protectors of the night, or wandering mystics who follow the moon's guidance.

**Common Lunarch Archetypes**:
- **The Moonlight Sentinel**: A vigilant guardian who patrols under the moon's watchful gaze, protecting sacred sites and innocent travelers
- **The Celestial Scholar**: An academic who studies the movements of celestial bodies and harnesses their power through careful observation
- **The Lunar Priestess**: A devoted servant of a moon deity, channeling divine lunar power to heal allies and smite enemies
- **The Night Hunter**: A ranger who thrives in darkness, using moonlight to track prey and strike from the shadows
- **The Tide Caller**: A coastal mystic who understands the moon's influence on tides and uses this connection to manipulate water and fate

**Personality Traits**:
Lunarchs tend to be contemplative, patient, and attuned to natural cycles. They understand that power waxes and wanes, and they embrace change rather than resist it. Many are nocturnal by preference, finding peace and clarity under starlit skies.`
    },

    combatRole: {
      title: 'Combat Role',
      content: `**Primary Role**: Ranged Support/Control with adaptive damage potential

**Combat Strengths**:
- Exceptional versatility through phase shifting
- Strong ranged damage during Full Moon phase
- Excellent healing and support during Waxing Moon phase
- Superior mana efficiency and control during Waning Moon phase
- Enhanced survivability during New Moon phase

**Combat Weaknesses**:
- Requires careful phase management and timing
- Less effective when caught in wrong phase for situation
- Moderate armor and hit points (cloth/leather wearer)
- Mana-dependent for both spells and phase shifting
- Vulnerable in melee range

**Optimal Positioning**:
Lunarchs excel at medium to long range (30-60 feet), where they can safely cast spells and loose arrows while maintaining awareness of the battlefield. They should position to maximize phase benefits—staying near allies during support phases, maintaining distance during offensive phases.`
    },

    playstyle: {
      title: 'Playstyle & Strategy',
      content: `**Phase Management**:
The key to mastering the Lunarch is understanding when to shift phases and when to let them cycle naturally. Each phase offers distinct advantages:

- **New Moon**: Use for recovery, mana regeneration, and defensive positioning. Ideal when you need to reset or prepare for the next engagement.
- **Waxing Moon**: Perfect for supporting allies with enhanced healing and buffs. Shift here when your team needs sustain.
- **Full Moon**: Your damage phase. Unleash devastating attacks and maximize offensive spell power.
- **Waning Moon**: Control and efficiency phase. Extend debuffs, reduce mana costs, and maintain battlefield control.

**Resource Economy**:
Manual phase shifting costs 8 mana, so balance between natural cycling (every 3 rounds) and tactical shifts. Don't waste mana shifting unnecessarily—plan ahead and anticipate combat flow.

**Spell Selection**:
Choose spells that synergize with your preferred phases. Moonlight Sentinels focus on damage spells enhanced by Full Moon, Starfall Invokers leverage AoE during all phases, and Moonwell Guardians maximize Waxing Moon healing.

**Team Dynamics**:
- Coordinate with tanks to know when you'll need defensive phases
- Communicate with healers about when you'll shift to Waxing Moon for support
- Time Full Moon phases with your team's burst damage windows
- Use Waning Moon to extend crowd control effects from allies`
    },

    immersiveCombatExample: {
      title: 'Combat Example: The Lunar Cycle',
      content: `**The Setup**: You're a Lunarch (Moonlight Sentinel specialization) facing a group of shadow creatures (4 shadow wraiths + 1 shadow lord). Your party is with you. Starting Phase: New Moon (all Lunarchs start combat in New Moon). Starting Mana: 50/60. Your goal: Cycle through lunar phases strategically, using each phase's unique bonuses to adapt to the battle.

**Starting State**: Phase: New Moon | Mana: 50/60 | HP: 65/65 | Round: 1

**NEW MOON PHASE (Rounds 1-3)**

**Turn 1 - New Moon: Recovery and Preparation (Phase: New Moon, Round 1/3)**

*The shadow wraiths emerge from the darkness, their forms shifting and ethereal. You raise your bow, moonlight gathering around you. The moon is NEW—dark, hidden, a time for recovery and preparation.*

**New Moon Bonuses**:
- +2 AC (defensive bonus)
- +1d6 HP regeneration per turn
- Advantage on stealth checks

**Regeneration**: +1d6 HP → [4] = +4 HP
**Your HP**: 65 + 4 = 69/65 (over max, capped at 65)

*You feel the new moon's energy flowing through you, subtle and protective.*

**Your Action**: Cast "Moonbeam" at Shadow Wraith #1 (6 mana)
**Attack Roll**: d20+6 → [15] = Hit!
**Damage**: 2d10 radiant → [8, 7] = **15 radiant damage**

*A beam of pale moonlight strikes the wraith. It shrieks, recoiling from the radiant energy.*

**Mana**: 50 - 6 = 44/60

**Shadow Wraith #1's Turn**: Attacks you → [14] → Miss! (your AC is 16 + 2 = 18 from New Moon)

*The wraith's claws pass through empty air. The new moon's protection shields you.*

**Current State**: Phase: New Moon (Round 1/3) | Mana: 44/60 | HP: 65/65

**Turn 2 - New Moon: Continued Defense (Phase: New Moon, Round 2/3)**

**Regeneration**: +1d6 HP → [3] = +3 HP (already at max, no effect)

**Your Action**: Cast "Lunar Arrow" at Shadow Wraith #2 (4 mana)
**Attack Roll**: d20+6 → [17] = Hit!
**Damage**: 1d8+4 radiant → [7] + 4 = **11 radiant damage**

**Mana**: 44 - 4 = 40/60

**Shadow Lord's Turn**: Casts "Shadow Bolt" at you → [16] → Miss! (AC 18)

*The shadow bolt dissipates against your new moon protection.*

**Current State**: Phase: New Moon (Round 2/3) | Mana: 40/60 | HP: 65/65

**Turn 3 - New Moon Ending, Manual Shift to Full Moon (Phase: New Moon → Full Moon)**

*The new moon phase is ending. Normally it would cycle to Waxing Moon, but you need DAMAGE. Time to shift to Full Moon.*

**Your Action**: Manual Phase Shift to Full Moon (8 mana, resets 3-round timer)

*You reach out to the lunar energies and PULL. The moon in your mind's eye SWELLS from new to full. Brilliant silver light erupts around you.*

**Phase Shift**: New Moon → **Full Moon**
**Mana**: 40 - 8 = 32/60
**Phase Timer**: Reset to Round 1/3 (Full Moon will last 3 rounds)

**FULL MOON PHASE (Rounds 4-6)**

**Full Moon Bonuses**:
- +2d6 radiant damage on all attacks
- Critical hits on 19-20 (expanded crit range)
- Advantage on attack rolls

**Your Action**: Cast "Moonbeam" at Shadow Wraith #3 (6 mana, with Full Moon bonus)
**Attack Roll**: d20+6 with ADVANTAGE → [18, 12] → Take 18 = Hit!
**Base Damage**: 2d10 radiant → [9, 8] = 17 damage
**Full Moon Bonus**: +2d6 radiant → [5, 6] = +11 damage
**Total Damage**: 17 + 11 = **28 radiant damage!**

*The moonbeam BLAZES with full moon power. The wraith is VAPORIZED.*

**Shadow Wraith #3**: DEAD

**Mana**: 32 - 6 = 26/60

**Current State**: Phase: Full Moon (Round 1/3) | Mana: 26/60 | HP: 65/65

**Turn 4 - Full Moon: Maximum Damage (Phase: Full Moon, Round 2/3)**

*The full moon's power surges through you. Your attacks are DEVASTATING.*

**Your Action**: Cast "Lunar Arrow" at Shadow Lord (4 mana, with Full Moon bonus)
**Attack Roll**: d20+6 with ADVANTAGE → [19, 14] → Take 19 = **CRITICAL HIT!** (19-20 crit range)
**Base Damage**: 1d8+4 radiant → [8] + 4 = 12 damage → DOUBLED = 24 damage
**Full Moon Bonus**: +2d6 radiant → [6, 5] = +11 damage → DOUBLED = 22 damage
**Total Damage**: 24 + 22 = **46 radiant damage!**

*Your arrow EXPLODES with full moon energy, striking the shadow lord with devastating force. It staggers, badly wounded.*

**Mana**: 26 - 4 = 22/60

**Shadow Lord**: 46 damage taken, severely wounded

**Current State**: Phase: Full Moon (Round 2/3) | Mana: 22/60 | HP: 65/65

**Turn 5 - Full Moon Ending, Natural Cycle to Waning Moon (Phase: Full Moon → Waning Moon)**

*The full moon phase ends naturally. The moon begins to WANE, shifting to the waning phase.*

**Phase Cycle**: Full Moon → **Waning Moon** (natural cycle, no mana cost)
**Phase Timer**: Reset to Round 1/3

**WANING MOON PHASE (Rounds 6-8)**

**Waning Moon Bonuses**:
- Spell mana costs reduced by 2
- Debuffs last +1 round
- +10 ft spell range

**Your Action**: Cast "Moonbeam" at Shadow Lord (6 mana - 2 = 4 mana, with Waning Moon cost reduction)
**Attack Roll**: d20+6 → [16] = Hit!
**Damage**: 2d10 radiant → [9, 7] = **16 radiant damage**
**Result**: Shadow Lord DEAD (was already severely wounded)

*The shadow lord falls, dissolving into darkness.*

**Mana**: 22 - 4 = 18/60 (saved 2 mana from Waning Moon!)

**Your Party's Tank**: Kills Shadow Wraith #1
**Your Party's Mage**: Kills Shadow Wraith #2

**Only Shadow Wraith #4 remains**

**Current State**: Phase: Waning Moon (Round 1/3) | Mana: 18/60 | HP: 65/65

**Turn 6 - Waning Moon: Mana Efficiency (Phase: Waning Moon, Round 2/3)**

**Your Action**: Cast "Lunar Arrow" at Shadow Wraith #4 (4 mana - 2 = 2 mana)
**Attack Roll**: d20+6 → [18] = Hit!
**Damage**: 1d8+4 radiant → [6] + 4 = **10 radiant damage**
**Result**: Shadow Wraith #4 DEAD

**Mana**: 18 - 2 = 16/60 (saved 2 mana!)

**Combat Over**

*You lower your bow. The shadow creatures are gone, dissolved by moonlight. The waning moon's energy fades, and you feel the cycle preparing to begin anew.*

**Your Party's Mage**: "Your arrows... they were GLOWING. And that one critical hit did FORTY-SIX damage. What happened?"
**You**: "I shifted to Full Moon phase. +2d6 radiant damage on all attacks, advantage on attack rolls, and critical hits on 19-20. That's why the critical did so much—both the base damage AND the Full Moon bonus were doubled."
**Your Party's Tank**: "And at the end? Your spells cost less mana?"
**You**: "Waning Moon phase. All spell costs reduced by 2 mana. I cast Moonbeam for 4 mana instead of 6, and Lunar Arrow for 2 mana instead of 4. Saved 4 mana total."
**Your Party's Healer**: "And at the start? The wraiths couldn't hit you."
**You**: "New Moon phase. +2 AC, +1d6 HP regeneration per turn. I started defensive, then shifted to Full Moon for damage, then naturally cycled to Waning Moon for efficiency."

**Final State**: Phase: Waning Moon (Round 2/3) | Mana: 16/60 | HP: 65/65

**The Lesson**: Lunarch gameplay is about:
1. **Phase Cycling**: Started in New Moon (defensive), manually shifted to Full Moon (offensive), naturally cycled to Waning Moon (efficiency)
2. **Manual Shifting**: Spent 8 mana Turn 3 to shift from New Moon to Full Moon (skipped Waxing Moon because didn't need healing)
3. **Full Moon Damage**: Moonbeam: 17 → 28 damage (+11 from +2d6), Lunar Arrow crit: 12 → 46 damage (doubled base + doubled Full Moon bonus)
4. **Waning Moon Efficiency**: Saved 4 mana total (Moonbeam 6 → 4, Lunar Arrow 4 → 2)
5. **New Moon Defense**: +2 AC caused 2 attacks to miss (AC 16 → 18)
6. **Phase Duration**: Each phase lasts 3 rounds naturally, manual shift resets timer
7. **Strategic Shifting**: Skipped Waxing Moon (healing) because didn't need it, went straight to Full Moon for damage

You're not a static caster. You're a LUNAR MAGE who flows through moon phases. New Moon for defense and recovery. Waxing Moon for healing and support. Full Moon for MAXIMUM DAMAGE. Waning Moon for mana efficiency and control. The key is knowing when to let phases cycle naturally (free) and when to manually shift (8 mana). If you need damage NOW, shift to Full Moon. If you need healing, shift to Waxing Moon. If you're low on mana, let it cycle to Waning Moon. The moon is always changing, and so are you.`
    }
  },
  
  // Resource System
  resourceSystem: {
    title: 'Lunar Phases',
    subtitle: 'Phase Shift Mechanic',

    description: `The Lunarch's power flows with the phases of the moon. Unlike static resource systems, the Lunar Phase mechanic is cyclical and ever-changing, reflecting the natural ebb and flow of lunar energy. Lunarchs begin each combat in the New Moon phase and can either allow phases to cycle naturally every 3 rounds or manually shift to any phase by spending mana.`,

    resourceBarExplanation: {
      title: 'Understanding Your Lunar Phase Interface',
      content: `**What You See**: The Lunarch's interface displays a beautiful LUNAR CYCLE WHEEL showing all four moon phases arranged in a circle. Your current phase is highlighted and glowing, with a timer showing how many rounds remain before the natural cycle advances.

**LUNAR PHASE WHEEL** (Center of HUD):

**Wheel Layout**:
- **Top**: New Moon (dark circle, barely visible)
- **Right**: Waxing Moon (crescent moon, growing)
- **Bottom**: Full Moon (bright full circle, radiant)
- **Left**: Waning Moon (crescent moon, shrinking)
- **Center**: Current phase indicator with large glowing moon icon

**Current Phase Display**:
- **Active Phase**: Large moon icon in center showing current phase
- **Phase Name**: "NEW MOON" / "WAXING MOON" / "FULL MOON" / "WANING MOON" in glowing text
- **Phase Timer**: "Round 2/3" countdown showing when natural cycle will advance
- **Next Phase Arrow**: Glowing arrow pointing to next phase in cycle

**Phase Visualization by Type**:

**New Moon (Dark, Defensive)**:
- **Icon**: Nearly black circle with faint silver outline
- **Glow**: Subtle dark blue aura
- **Character Effect**: Character model has faint protective shimmer
- **Bonuses Displayed**: "+2 AC | +1d6 HP Regen | Stealth Advantage"
- **Color Theme**: Dark blue/black

**Waxing Moon (Growing, Supportive)**:
- **Icon**: Crescent moon growing from left, silver-white
- **Glow**: Soft green-white aura
- **Character Effect**: Character model has gentle healing glow
- **Bonuses Displayed**: "+1d6 Healing | +10 ft Movement | +1d4 Spell Damage"
- **Color Theme**: Green-white

**Full Moon (Bright, Offensive)**:
- **Icon**: Brilliant full circle, blazing silver-white
- **Glow**: Intense radiant aura, pulsing
- **Character Effect**: Character model GLOWS with moonlight, weapons shine
- **Bonuses Displayed**: "+2d6 Radiant Damage | Crit 19-20 | Attack Advantage"
- **Color Theme**: Bright silver-white/gold

**Waning Moon (Shrinking, Efficient)**:
- **Icon**: Crescent moon shrinking from right, pale silver
- **Glow**: Calm purple-blue aura
- **Character Effect**: Character model has subtle arcane shimmer
- **Bonuses Displayed**: "Spell Cost -2 Mana | Debuffs +1 Round | +10 ft Range"
- **Color Theme**: Purple-blue

**Phase Cycle Animation** (Natural Cycling):
When phase naturally advances every 3 rounds:
- **Current Phase**: Fades and dims
- **Wheel Rotation**: Wheel rotates clockwise, next phase moves to center
- **New Phase**: Brightens and pulses with energy
- **Audio**: Soft chime, phase-specific sound (wind for New, chime for Waxing, bell for Full, whisper for Waning)
- **Text Notification**: "Phase Cycle: NEW MOON → WAXING MOON"
- **Timer Reset**: "Round 1/3" appears

**Manual Phase Shift Interface**:
- **Shift Buttons**: Four buttons around the wheel, one for each phase
- **Cost Display**: "Shift to FULL MOON (8 mana)" on each button
- **Highlight**: Button for current phase is grayed out (can't shift to current phase)
- **Cooldown**: No cooldown, can shift every turn if you have mana

**Manual Phase Shift Animation**:
When you manually shift phases:
- **Mana Drain**: Mana bar decreases by 8
- **Wheel Spin**: Wheel SPINS rapidly to target phase
- **Energy Burst**: Explosion of lunar energy from character
- **Phase Change**: New phase icon appears in center with dramatic glow
- **Audio**: Powerful whoosh sound, phase-specific activation sound
- **Text Notification**: "MANUAL SHIFT: NEW MOON → FULL MOON (8 mana)"
- **Timer Reset**: "Round 1/3" (manual shift resets 3-round timer)
- **Screen Effect**: Brief flash of phase color (dark for New, green for Waxing, bright for Full, purple for Waning)

**Phase Bonus Indicators**:
Below the lunar wheel, active bonuses are displayed:

**New Moon Bonuses**:
- **AC Bonus**: Shield icon "+2 AC" in blue
- **Regeneration**: Heart icon "+1d6 HP/turn" in green
- **Stealth**: Eye icon "Advantage on Stealth" in dark blue

**Waxing Moon Bonuses**:
- **Healing Boost**: Cross icon "+1d6 Healing" in green
- **Movement**: Boot icon "+10 ft Speed" in white
- **Spell Damage**: Wand icon "+1d4 Spell Damage" in green

**Full Moon Bonuses**:
- **Damage Boost**: Sword icon "+2d6 Radiant Damage" in gold
- **Crit Range**: Star icon "Crit 19-20" in bright white
- **Attack Advantage**: Crosshair icon "Advantage on Attacks" in silver

**Waning Moon Bonuses**:
- **Mana Efficiency**: Droplet icon "Spell Cost -2" in purple
- **Debuff Extension**: Clock icon "Debuffs +1 Round" in blue
- **Range Boost**: Arrow icon "+10 ft Range" in purple

**Phase-Specific Spell Effects**:
When you cast spells, the interface shows phase bonuses:

**Example (Full Moon - Moonbeam)**:
- **Spell Cast**: "Moonbeam (6 mana)"
- **Base Damage**: "2d10 radiant = 17 damage"
- **Full Moon Bonus**: "+2d6 radiant = +11 damage" (shown in gold)
- **Total**: "28 damage!" (combined total)
- **Visual**: Moonbeam spell is BRIGHTER and LARGER during Full Moon

**Example (Waning Moon - Moonbeam)**:
- **Spell Cast**: "Moonbeam (6 mana - 2 = 4 mana)" (cost reduction shown)
- **Mana Saved**: "Saved 2 mana (Waning Moon)" notification
- **Visual**: Spell has purple-blue tint during Waning Moon

**Phase Timer Countdown**:
- **Round 1/3**: Green border, "2 rounds until phase cycle"
- **Round 2/3**: Yellow border, "1 round until phase cycle"
- **Round 3/3**: Red border, "Phase cycling NEXT TURN"
- **Cycle Warning**: When timer hits 3/3, "⚠️ PHASE CYCLING NEXT TURN" warning appears

**Phase Cycle Preview**:
- **Next Phase Indicator**: Arrow pointing to next phase in cycle
- **Preview Text**: "Next: WAXING MOON (in 1 round)" or "Next: WAXING MOON (manual shift: 8 mana)"
- **Strategic Info**: Hovering over next phase shows its bonuses

**Combat Integration**:
- **Damage Numbers**: When you deal damage, phase bonus is shown separately
  * "Moonbeam: 17 damage + 11 (Full Moon) = 28 total!"
- **Healing Numbers**: When you heal, phase bonus is shown
  * "Moonlight Heal: 2d8 = 12 HP + 6 (Waxing Moon) = 18 HP healed!"
- **Mana Costs**: When you cast spells in Waning Moon, cost reduction is shown
  * "Moonbeam: 6 mana - 2 (Waning Moon) = 4 mana"

**Phase Lock Indicator**:
Some abilities lock you in current phase for 1 round:
- **Lock Icon**: Padlock appears on phase wheel
- **Text**: "PHASE LOCKED (1 round)" in red
- **Effect**: Cannot manually shift, natural cycle paused
- **Duration**: "Lock expires in 1 round"

**Lunar Eclipse Ultimate**:
When you use Lunar Eclipse ultimate (gain New Moon + Full Moon benefits):
- **Dual Phase Display**: Both New Moon and Full Moon icons appear in center
- **Combined Bonuses**: "+2 AC (New Moon) | +2d6 Damage (Full Moon) | +1d6 HP Regen (New Moon) | Crit 19-20 (Full Moon)"
- **Duration**: "Lunar Eclipse: 2 rounds remaining"
- **Visual**: Character glows with BOTH dark protective aura AND bright offensive aura
- **Audio**: Dramatic dual-tone sound (deep hum + bright chime)

**Why This Matters**: The Lunar Phase Wheel makes you feel like you're CHANNELING THE MOON. When you're in New Moon, you see the dark circle, the "+2 AC" shield icon, and your character has a protective shimmer. When you manually shift to Full Moon, the wheel SPINS, your character EXPLODES with radiant light, and the "+2d6 Radiant Damage" appears in gold. When you cast Moonbeam during Full Moon and see "17 + 11 (Full Moon) = 28 damage!", you KNOW the phase shift was worth the 8 mana. The timer countdown keeps you aware of when phases will naturally cycle, so you can plan ahead. The phase-specific visual effects make each phase feel distinct—New Moon is dark and defensive, Waxing Moon is gentle and supportive, Full Moon is BLAZING and offensive, Waning Moon is calm and efficient. You're not just tracking a resource—you're FLOWING with the lunar cycle.`
    },

    mechanics: {
      title: 'How It Works',
      content: `**Phase Cycling**:
- **Starting Phase**: All Lunarchs begin combat in New Moon phase
- **Natural Cycling**: Phases automatically advance every 3 rounds (New Moon → Waxing Moon → Full Moon → Waning Moon → New Moon)
- **Manual Shifting**: Spend 8 mana to immediately shift to any phase of your choice
- **Phase Tracking**: Your current phase is displayed on your character sheet and affects all applicable spells and abilities

**Phase Duration**:
Each phase lasts for 3 rounds when cycling naturally. Manual shifts reset the 3-round timer, meaning if you manually shift on round 2, the new phase will last for 3 full rounds from that point.

**Mana Management**:
Manual phase shifting is a significant mana investment (8 mana). Consider whether the tactical advantage of shifting immediately is worth the cost, or if you can wait for the natural cycle. In longer combats, natural cycling is more efficient. In burst situations, manual shifting can be game-changing.

**Phase Stacking**:
You can only be in one phase at a time. However, certain ultimate abilities (like Lunar Eclipse) can temporarily grant benefits from multiple phases simultaneously.`
    },

    resourceTables: [
      {
        title: 'Lunar Phase Effects',
        headers: ['Phase', 'Duration', 'Primary Benefit', 'Secondary Benefit', 'Tertiary Benefit'],
        rows: [
          ['New Moon', '3 rounds', 'Mana Regen: +1d4 per turn', 'Damage Reduction: -1d4 incoming', 'Stealth: +2 to checks'],
          ['Waxing Moon', '3 rounds', 'Spell Damage: +1d4', 'Healing Boost: +1d6', 'Movement: +10 feet'],
          ['Full Moon', '3 rounds', 'All Damage: +1d6', 'Crit Range: +2', 'Radiant Aura: 1d4 damage'],
          ['Waning Moon', '3 rounds', 'Debuff Duration: +1d4 rounds', 'Mana Cost: -1d4 (min 1)', 'Wisdom Saves: Advantage']
        ]
      },
      {
        title: 'Phase Shift Costs & Timing',
        headers: ['Action', 'Mana Cost', 'Action Type', 'Notes'],
        rows: [
          ['Natural Phase Cycle', '0 mana', 'Automatic', 'Occurs every 3 rounds'],
          ['Manual Phase Shift', '8 mana', '1 AP', 'Shift to any phase immediately'],
          ['Lunar Eclipse (Ultimate)', '15 mana', 'Action', 'Gain New Moon + Full Moon benefits for 2 rounds'],
          ['Phase Lock (Passive)', '0 mana', 'Passive', 'Some abilities lock you in current phase for 1 round']
        ]
      },
      {
        title: 'Strategic Phase Usage',
        headers: ['Combat Situation', 'Recommended Phase', 'Reasoning'],
        rows: [
          ['Combat Start', 'New Moon (default)', 'Regenerate mana, reduce initial damage'],
          ['Burst Damage Window', 'Full Moon', 'Maximize damage output with +1d6 and crit bonus'],
          ['Ally Needs Healing', 'Waxing Moon', 'Enhanced healing +1d6 per spell'],
          ['Extended Control', 'Waning Moon', 'Extend debuffs, reduce mana costs'],
          ['Low Mana', 'New Moon or Waning Moon', 'Regenerate mana or reduce spell costs'],
          ['Boss Execute Phase', 'Full Moon', 'Maximum damage for finishing blow']
        ]
      }
    ],

    keyAbilities: {
      title: 'Key Phase Abilities',
      abilities: [
        {
          name: 'Phase Shift',
          cost: '8 mana',
          type: '1 AP',
          description: 'Immediately shift to any lunar phase of your choice. The new phase lasts for 3 rounds before naturally cycling to the next phase.'
        },
        {
          name: 'Lunar Attunement',
          cost: 'Passive',
          type: 'Passive',
          description: 'You are always attuned to one of the four lunar phases. Your current phase affects all spells and abilities that have phase-specific effects.'
        },
        {
          name: 'Moonlight Infusion',
          cost: '4 mana',
          type: 'Reaction',
          description: 'When you cast a spell, you can spend 4 additional mana to double the phase bonus for that spell only. (Example: Full Moon +1d6 becomes +2d6 for one spell)'
        }
      ]
    },

    strategicTips: {
      title: 'Strategic Tips',
      content: `**Early Combat (Rounds 1-3)**:
Start in New Moon to build mana reserves and reduce incoming damage. Use this time to assess the battlefield and plan your phase transitions.

**Mid Combat (Rounds 4-6)**:
Shift to Full Moon for burst damage or Waxing Moon for healing, depending on team needs. This is when phase management becomes critical.

**Late Combat (Rounds 7+)**:
Use Waning Moon to extend control effects and conserve mana, or cycle back to Full Moon for execute damage on low-health enemies.

**Emergency Situations**:
- Ally at critical health: Manual shift to Waxing Moon immediately
- Boss enrage phase: Manual shift to Full Moon for maximum damage
- Surrounded by enemies: Manual shift to New Moon for damage reduction
- Running low on mana: Stay in New Moon or shift to Waning Moon

**Mana Conservation**:
Avoid manual shifting unless absolutely necessary. Three rounds is enough time for most tactical situations. Save your mana for spells rather than constant phase shifting.`
    },

    playingInPerson: {
      title: 'Playing in Person',
      subtitle: 'Physical Tracking for Tabletop Play',
      content: `The Lunarch's Lunar Phase system—cycling through 4 moon phases every 3 rounds—creates a rhythmic, adaptive in-person experience. Here's how to track your celestial power at the table:

**Required Materials**:
- **4 phase cards or tokens** (one for each moon phase)
- **Round counter** (d4 die or tokens to track rounds 1-3)
- **Phase reference card** with phase bonuses
- **Optional: Moon phase wheel** (printed diagram)

**Lunar Phase Tracking**:

**The Phase Card Method** (Recommended):

Use physical cards to represent the four moon phases. Place the current phase card face-up in front of you, with a d4 die showing which round (1, 2, or 3) you're in for that phase.

**Phase Cards Template**:

\`\`\`
🌑 NEW MOON (Defensive)
+2 AC | +1d6 HP regen/turn | Stealth advantage
Duration: 3 rounds → Waxing Moon

🌒 WAXING MOON (Supportive)
+1d6 healing | +10 ft move | +1d4 spell damage
Duration: 3 rounds → Full Moon

🌕 FULL MOON (Offensive)
+2d6 radiant damage | Crit 19-20 | Attack advantage
Duration: 3 rounds → Waning Moon

🌘 WANING MOON (Efficient)
Spell cost -2 mana | Debuff +1 round | +10 ft range
Duration: 3 rounds → New Moon
\`\`\`

**Natural Phase Cycling**:

Use a d4 die to track rounds within each phase:
- **d4 = 1**: Round 1 of current phase
- **d4 = 2**: Round 2 of current phase
- **d4 = 3**: Round 3 of current phase (last round)
- **After Round 3**: Swap to next phase card, reset d4 to 1

**Example Tracking**:
- Combat starts: New Moon card, d4 = [1]
- End of Round 1: Advance d4 to [2]
- End of Round 2: Advance d4 to [3]
- End of Round 3: Swap to Waxing Moon card, reset d4 to [1]

**Manual Phase Shifting** (8 mana):
1. Announce: "I shift to Full Moon!" (spend 8 mana)
2. Swap current phase card for Full Moon card
3. Reset d4 to [1] (new phase starts at round 1)

**Example In-Person Combat**:

*Starting: New Moon, d4 = [1]*

**Round 1**: New Moon [1] → Regen 1d6 HP, attack → Advance d4 to [2]
**Round 2**: New Moon [2] → Regen 1d6 HP, attack → Advance d4 to [3]
**Round 3**: New Moon [3] → Regen 1d6 HP, attack → Swap to Waxing Moon, d4 = [1]
**Round 4**: Waxing Moon [1] → +10 ft move, attack +1d4 → Advance d4 to [2]
**Round 5**: "Boss is low! I shift to Full Moon!" (8 mana) → Swap to Full Moon, d4 = [1]
**Round 6**: Full Moon [1] → Attack +2d6 radiant, crit on 19-20!

**Quick Reference**:
\`\`\`
PHASE CYCLE: New → Waxing → Full → Waning → (repeat)
DURATION: 3 rounds per phase (automatic)
MANUAL SHIFT: 8 mana (1 AP, any phase)
START: Always New Moon
\`\`\`

**Why This Works**: The d4 die and phase cards create a simple, visual tracking system. You always know which phase you're in (card) and when it will change (d4). The physical act of swapping cards every 3 rounds creates rhythm, and the strategic decision of when to spend 8 mana to shift manually adds depth.

**Budget Alternative**: Just write phase name and round number on paper (e.g., "Full Moon 2/3").`
    }
  },
  
  // Specializations
  specializations: {
    title: 'Lunarch Specializations',
    subtitle: 'Three Paths of Lunar Mastery',
    
    description: `Every Lunarch chooses one of three specializations that define their approach to lunar magic. Each specialization emphasizes different aspects of the moon's power and offers unique passive abilities that enhance specific playstyles.`,
    
    sharedPassive: {
      name: 'Lunar Empowerment',
      icon: 'spell_nature_starfall',
      description: 'Your connection to the moon grants you darkvision up to 60 feet. Additionally, you have advantage on saving throws against being charmed or frightened while in Full Moon phase.'
    },

    specs: [
      {
        id: 'moonlight-sentinel',
        name: 'Moonlight Sentinel',
        icon: 'ability_hunter_sentinelowl',
        color: '#C0C0C0',
        theme: 'Precision Archer',
        
        description: `The Moonlight Sentinel specialization focuses on ranged precision and lunar-infused archery. These Lunarchs are deadly marksmen who channel moonlight through their arrows, dealing devastating damage from afar. They excel at single-target elimination and marking priority targets for their team.`,
        
        playstyle: 'Ranged damage dealer alternating between bow attacks and lunar spells, with emphasis on critical strikes during Full Moon',
        
        strengths: [
          'Highest single-target ranged damage among Lunarch specs',
          'Excellent critical strike potential during Full Moon phase',
          'Can mark targets to amplify team damage',
          'Strong at long range (60+ feet)'
        ],
        
        weaknesses: [
          'Less effective in melee range',
          'Limited AoE damage compared to Starfall Invoker',
          'Requires clear line of sight for bow attacks',
          'Dependent on Full Moon phase for peak damage'
        ],
        
        passiveAbilities: [
          {
            name: 'Lunar Empowerment',
            tier: 'Path Passive',
            description: 'Your connection to the moon grants you darkvision up to 60 feet. Additionally, you have advantage on saving throws against being charmed or frightened while in Full Moon phase.',
            sharedBy: 'All Lunarch'
          },
          {
            name: 'Lunar Precision',
            tier: 'Specialization Passive',
            icon: 'ability_hunter_mastermarksman',
            description: 'Your critical hits during Full Moon phase deal an additional 2d6 radiant damage. This bonus applies to both weapon attacks and spell attacks.',
            uniqueTo: 'Moonlight Sentinel'
          },
          {
            name: "Sentinel's Mark",
            tier: 'Specialization Ability',
            icon: 'ability_hunter_markedfordeath',
            description: 'When you hit a creature with a ranged weapon attack, you can mark them until the end of your next turn. Marked creatures take +1d4 damage from your next spell that targets them.',
            uniqueTo: 'Moonlight Sentinel'
          }
        ],
        
        recommendedSpells: [
          'Lunar Arrow - Your bread-and-butter ranged attack',
          "Sentinel's Shot - Mark and eliminate priority targets",
          'Moonfire Barrage - Multi-target damage when needed',
          'Phase Shift - Ensure you\'re in Full Moon for burst windows'
        ]
      },
      {
        id: 'starfall-invoker',
        name: 'Starfall Invoker',
        icon: 'spell_arcane_starfire',
        color: '#4B0082',
        theme: 'Celestial Bombardment',
        
        description: `The Starfall Invoker calls down the wrath of the heavens, raining celestial energy upon their enemies. This specialization excels at area-of-effect damage and battlefield control, making them ideal for handling multiple enemies or controlling choke points. They channel the destructive power of falling stars and cosmic beams.`,
        
        playstyle: 'AoE damage and control specialist, focusing on positioning and timing to maximize celestial bombardment effects',
        
        strengths: [
          'Exceptional AoE damage potential',
          'Strong battlefield control with blinding and stunning effects',
          'Enhanced spell range and area during Full Moon',
          'Excellent at handling multiple enemies simultaneously'
        ],
        
        weaknesses: [
          'Lower single-target damage than Moonlight Sentinel',
          'High mana consumption for AoE spells',
          'Requires good positioning to avoid friendly fire',
          'Less effective against spread-out enemies'
        ],
        
        passiveAbilities: [
          {
            name: 'Lunar Empowerment',
            tier: 'Path Passive',
            description: 'Your connection to the moon grants you darkvision up to 60 feet. Additionally, you have advantage on saving throws against being charmed or frightened while in Full Moon phase.',
            sharedBy: 'All Lunarch'
          },
          {
            name: 'Celestial Cascade',
            tier: 'Specialization Passive',
            icon: 'spell_nature_starfall',
            description: 'Your AoE spells during Full Moon phase affect an additional 5-foot radius beyond their normal area. This does not increase mana cost.',
            uniqueTo: 'Starfall Invoker'
          },
          {
            name: 'Stellar Guidance',
            tier: 'Specialization Passive',
            icon: 'spell_arcane_arcane04',
            description: 'During Waxing Moon phase, you gain +2 to spell attack rolls. This bonus helps ensure your celestial bombardments hit their targets.',
            uniqueTo: 'Starfall Invoker'
          }
        ],
        
        recommendedSpells: [
          'Starfall - Your signature AoE damage ability',
          'Celestial Beam - Line AoE with blinding effect',
          'Lunar Eclipse - Ultimate ability for massive burst',
          'Moonbeam - Sustained damage that changes with phases'
        ]
      },
      {
        id: 'moonwell-guardian',
        name: 'Moonwell Guardian',
        icon: 'spell_holy_elunesgrace',
        color: '#20B2AA',
        theme: 'Lunar Healer',
        
        description: `The Moonwell Guardian is a devoted protector who channels the moon's restorative power to heal and shield allies. They create sacred moonwells, bestow lunar blessings, and ensure their companions survive even the most dire battles. This specialization is essential for any party lacking dedicated healing.`,
        
        playstyle: 'Support healer and protector, focusing on sustained healing, shields, and protective buffs for the party',
        
        strengths: [
          'Strongest healing output among Lunarch specs',
          'Can grant temporary hit points and shields',
          'Provides defensive buffs to nearby allies',
          'Excellent sustained healing during Waxing Moon'
        ],
        
        weaknesses: [
          'Lowest damage output of all Lunarch specs',
          'Requires proximity to allies to maximize passive benefits',
          'Mana-intensive healing rotation',
          'Vulnerable when focused by enemies'
        ],
        
        passiveAbilities: [
          {
            name: 'Lunar Empowerment',
            tier: 'Path Passive',
            description: 'Your connection to the moon grants you darkvision up to 60 feet. Additionally, you have advantage on saving throws against being charmed or frightened while in Full Moon phase.',
            sharedBy: 'All Lunarch'
          },
          {
            name: "Elune's Grace",
            tier: 'Specialization Passive',
            icon: 'spell_holy_holyprotection',
            description: 'Your healing spells during Waxing Moon phase grant the target 1d6 temporary hit points in addition to the healing. These temporary HP last for 1 minute.',
            uniqueTo: 'Lunar Guardian'
          },
          {
            name: 'Lunar Sanctuary',
            tier: 'Specialization Passive',
            icon: 'spell_holy_prayerofhealing02',
            description: 'While you are in New Moon phase, all allies within 15 feet of you gain +1 AC. This bonus is lost if you move more than 15 feet away from them.',
            uniqueTo: 'Lunar Guardian'
          }
        ],
        
        recommendedSpells: [
          'Moonwell - Create persistent healing zones',
          'Lunar Blessing - Shield allies with lunar energy',
          "Elune's Grace - Powerful healing and cleansing",
          'Phase Shift - Ensure you\'re in Waxing Moon when healing is needed'
        ]
      }
    ]
  },
  
  // Example Spells - showcasing Phase Shift mechanics
  exampleSpells: [
    // MOONLIGHT SENTINEL - Precision Archery
    {
      id: 'lunarch_lunar_arrow',
      name: 'Lunar Arrow',
      description: 'Fire an arrow infused with moonlight that deals damage based on your current lunar phase.',
      spellType: 'ACTION',
      icon: 'ability_hunter_sentinelowl',
      school: 'Evocation',
      level: 1,
      specialization: 'moonlight-sentinel',

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
        durationType: 'instant'
      },

      resourceCost: {
        mana: 4,
        components: ['somatic', 'material'],
        somaticText: 'Draw and loose arrow',
        materialText: 'Arrow infused with moonlight'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '1d8',
        damageType: 'radiant',
        scalingType: 'none'
      },

      effects: {
        damage: {
          base: {
            formula: '1d8',
            type: 'radiant'
          },
          phaseBonus: {
            newMoon: '+1d4 (stealth damage)',
            waxingMoon: '+1d4 (spell power)',
            fullMoon: '+1d6 (maximum power)',
            waningMoon: '+0 (no bonus)'
          }
        }
      },

      specialMechanics: {
        phaseInteraction: {
          newMoon: 'If you are hidden, add +1d4 damage',
          waxingMoon: 'Add +1d4 radiant damage',
          fullMoon: 'Add +1d6 radiant damage and increase crit range by 2',
          waningMoon: 'Costs 1d4 less mana (minimum 1)'
        }
      },

      tags: ['radiant', 'damage', 'ranged', 'phase-dependent', 'moonlight-sentinel']
    },

    {
      id: 'lunarch_sentinels_shot',
      name: "Sentinel's Shot",
      description: 'Fire a powerful arrow that marks your target, causing them to take additional damage from your next spell.',
      spellType: 'ACTION',
      icon: 'ability_hunter_markedfordeath',
      school: 'Evocation',
      level: 3,
      specialization: 'moonlight-sentinel',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 80
      },

      durationConfig: {
        durationType: 'rounds',
        duration: 2
      },

      resourceCost: {
        mana: 7,
        components: ['somatic', 'material'],
        somaticText: 'Draw arrow with focused aim',
        materialText: 'Silver-tipped arrow'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '2d8',
        damageType: 'radiant',
        scalingType: 'none'
      },

      debuffConfig: {
        effects: [
          "Target is Marked for 2 rounds",
          "Marked targets take +1d4 damage from your next spell"
        ]
      },

      effects: {
        damage: {
          instant: {
            formula: '2d8',
            type: 'radiant'
          }
        },
        debuff: {
          type: 'marked',
          duration: 2,
          bonusDamage: '1d4'
        }
      },

      specialMechanics: {
        phaseInteraction: {
          fullMoon: 'Mark lasts 3 rounds instead of 2, and bonus damage increases to 1d6'
        },
        sentinelMark: {
          description: 'Marked targets take bonus damage from your next spell',
          stackable: false
        }
      },

      tags: ['radiant', 'damage', 'ranged', 'debuff', 'mark', 'moonlight-sentinel']
    },

    {
      id: 'lunarch_moonfire_barrage',
      name: 'Moonfire Barrage',
      description: 'Unleash a volley of moonfire-infused arrows that rain down on multiple targets.',
      spellType: 'ACTION',
      icon: 'ability_hunter_rapidkilling',
      school: 'Evocation',
      level: 5,
      specialization: 'moonlight-sentinel',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'multi',
        rangeType: 'ranged',
        rangeDistance: 60,
        maxTargets: 3
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 10,
        components: ['somatic', 'material'],
        somaticText: 'Rapid-fire arrow volley',
        materialText: '3 arrows'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '2d6',
        damageType: 'radiant',
        scalingType: 'none'
      },

      effects: {
        damage: {
          perTarget: {
            formula: '2d6',
            type: 'radiant',
            targets: 3
          }
        }
      },

      specialMechanics: {
        phaseInteraction: {
          fullMoon: 'Can target up to 5 enemies instead of 3, and each arrow deals +1d6 damage'
        },
        multiTarget: {
          description: 'Each arrow targets a different enemy within range',
          requiresLineOfSight: true
        }
      },

      tags: ['radiant', 'damage', 'ranged', 'multi-target', 'moonlight-sentinel']
    },

    // STARFALL INVOKER - Celestial AoE
    {
      id: 'lunarch_starfall',
      name: 'Starfall',
      description: 'Call down a shower of falling stars that crash into a target area, dealing radiant damage to all enemies within.',
      spellType: 'ACTION',
      icon: 'spell_nature_starfall',
      school: 'Evocation',
      level: 2,
      specialization: 'starfall-invoker',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 60,
        areaType: 'circle',
        areaSize: 15
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 8,
        components: ['verbal', 'somatic'],
        verbalText: 'Stellae cadunt!',
        somaticText: 'Point skyward and bring hand down'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '3d6',
        damageType: 'radiant',
        scalingType: 'none'
      },

      savingThrow: {
        ability: 'dexterity',
        dc: 14,
        onSave: 'half'
      },

      effects: {
        damage: {
          aoe: {
            formula: '3d6',
            type: 'radiant',
            shape: 'circle',
            radius: 15
          }
        }
      },

      savingThrowEffect: {
        onSuccess: 'Takes half damage (1d6+3)',
        onFailure: 'Takes full damage (3d6)'
      },

      specialMechanics: {
        phaseInteraction: {
          fullMoon: 'Radius increases to 20 feet (Celestial Cascade passive adds +5 feet to base 15)',
          waxingMoon: '+2 to spell attack rolls (from Stellar Guidance passive)'
        }
      },

      tags: ['radiant', 'damage', 'aoe', 'starfall-invoker']
    },

    {
      id: 'lunarch_celestial_beam',
      name: 'Celestial Beam',
      description: 'Channel a concentrated beam of celestial energy in a line, dealing radiant damage and potentially blinding targets.',
      spellType: 'ACTION',
      icon: 'spell_arcane_starfire',
      school: 'Evocation',
      level: 4,
      specialization: 'starfall-invoker',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'line',
        rangeType: 'ranged',
        rangeDistance: 60,
        lineLength: 30,
        lineWidth: 5
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 9,
        components: ['verbal', 'somatic'],
        verbalText: 'Lux caelestis!',
        somaticText: 'Extend both hands forward'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '4d6',
        damageType: 'radiant',
        scalingType: 'none'
      },

      savingThrow: {
        ability: 'constitution',
        dc: 15,
        onSave: 'not_blinded'
      },

      debuffConfig: {
        effects: [
          'Targets who fail save are Blinded for 1 round',
          'Blinded creatures have disadvantage on attack rolls'
        ]
      },

      effects: {
        damage: {
          line: {
            formula: '4d6',
            type: 'radiant',
            length: 30,
            width: 5
          }
        },
        debuff: {
          type: 'blinded',
          duration: 1,
          saveToNegate: true
        }
      },

      savingThrowEffect: {
        onSuccess: 'Takes full damage but not blinded',
        onFailure: 'Takes full damage and is blinded for 1 round'
      },

      specialMechanics: {
        phaseInteraction: {
          fullMoon: 'Blinded duration increases to 2 rounds, and damage increases by +1d6'
        }
      },

      tags: ['radiant', 'damage', 'line', 'aoe', 'blind', 'debuff', 'starfall-invoker']
    },

    {
      id: 'lunarch_lunar_eclipse',
      name: 'Lunar Eclipse',
      description: 'Channel the power of both the New Moon and Full Moon simultaneously, gaining defensive and offensive benefits for a brief period.',
      spellType: 'ACTION',
      icon: 'spell_nature_nullifydisease',
      school: 'Transmutation',
      level: 6,
      specialization: 'starfall-invoker',

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
        mana: 15,
        components: ['verbal', 'somatic'],
        verbalText: 'Eclipse lunaris!',
        somaticText: 'Cross arms then spread wide'
      },

      resolution: 'AUTOMATIC',

      buffConfig: {
        effects: [
          'Gain New Moon benefits: +1d4 mana per turn, -1d4 incoming damage',
          'Gain Full Moon benefits: +1d6 to all damage, +2 crit range',
          'Radiant aura deals 1d4 damage to enemies within 10 feet',
          'Duration: 2 rounds'
        ]
      },

      effects: {
        buff: {
          duration: 2,
          benefits: [
            'New Moon: Mana regen +1d4/turn, damage reduction -1d4',
            'Full Moon: Damage +1d6, crit range +2',
            'Aura: 1d4 radiant damage to nearby enemies'
          ]
        }
      },

      specialMechanics: {
        dualPhase: {
          description: 'Grants benefits from both New Moon and Full Moon simultaneously',
          phaseLock: 'Your phase does not cycle during Eclipse duration',
          afterEffect: 'After Eclipse ends, you return to the phase you were in before casting'
        }
      },

      tags: ['buff', 'self', 'dual-phase', 'ultimate', 'starfall-invoker']
    },

    // MOONWELL GUARDIAN - Healing & Support
    {
      id: 'lunarch_moonwell',
      name: 'Moonwell',
      description: 'Create a sacred pool of lunar energy that heals all allies who stand within it.',
      spellType: 'ACTION',
      icon: 'spell_holy_elunesgrace',
      school: 'Conjuration',
      level: 2,
      specialization: 'moonwell-guardian',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 30,
        areaType: 'circle',
        areaSize: 10
      },

      durationConfig: {
        durationType: 'minutes',
        duration: 1
      },

      resourceCost: {
        mana: 8,
        components: ['verbal', 'somatic', 'material'],
        verbalText: 'Fons lunae!',
        somaticText: 'Touch ground to create moonwell',
        materialText: 'Vial of blessed water'
      },

      resolution: 'AUTOMATIC',

      healingConfig: {
        formula: '1d6',
        healingType: 'area',
        trigger: 'start_of_turn'
      },

      effects: {
        healing: {
          aoe: {
            formula: '1d6',
            trigger: 'At start of ally turn in area',
            shape: 'circle',
            radius: 10,
            duration: '1 minute'
          }
        }
      },

      specialMechanics: {
        phaseInteraction: {
          waxingMoon: 'Healing increases to 1d6+1d6 (total 2d6) and grants 1d6 temporary HP (Elune\'s Grace passive)',
          fullMoon: 'Radius increases to 15 feet',
          waningMoon: 'Duration increases to 2 minutes'
        },
        persistent: {
          description: 'Moonwell remains until duration expires or you create a new one',
          limit: 'Only one Moonwell can exist at a time'
        }
      },

      tags: ['healing', 'aoe', 'persistent', 'support', 'moonwell-guardian']
    },

    {
      id: 'lunarch_lunar_blessing',
      name: 'Lunar Blessing',
      description: 'Bestow a protective shield of lunar energy upon an ally, absorbing incoming damage.',
      spellType: 'ACTION',
      icon: 'spell_holy_powerwordshield',
      school: 'Abjuration',
      level: 3,
      specialization: 'moonwell-guardian',

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
        durationType: 'minutes',
        duration: 5
      },

      resourceCost: {
        mana: 7,
        components: ['verbal', 'somatic'],
        verbalText: 'Benedictio lunae!',
        somaticText: 'Gesture toward ally'
      },

      resolution: 'AUTOMATIC',

      shieldConfig: {
        formula: '2d8',
        shieldType: 'temporary_hp',
        duration: '5 minutes'
      },

      effects: {
        shield: {
          amount: '2d8',
          type: 'temporary_hp',
          duration: '5 minutes or until depleted'
        }
      },

      specialMechanics: {
        phaseInteraction: {
          waxingMoon: 'Shield amount increases to 2d8+1d6',
          fullMoon: 'Shield also grants +1 AC while active',
          newMoon: 'If cast on ally within 15 feet, they also gain Lunar Sanctuary +1 AC bonus'
        }
      },

      tags: ['shield', 'protection', 'support', 'moonwell-guardian']
    },

    {
      id: 'lunarch_elunes_grace',
      name: "Elune's Grace",
      description: 'Channel the moon goddess\'s blessing to heal an ally and cleanse them of harmful effects.',
      spellType: 'ACTION',
      icon: 'spell_holy_holyprotection',
      school: 'Evocation',
      level: 5,
      specialization: 'moonwell-guardian',

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
        mana: 12,
        components: ['verbal', 'somatic'],
        verbalText: 'Gratia Elunae!',
        somaticText: 'Raise hand toward ally with palm open'
      },

      resolution: 'AUTOMATIC',

      healingConfig: {
        formula: '4d8',
        healingType: 'single',
        cleanse: true
      },

      effects: {
        healing: {
          instant: {
            formula: '4d8',
            type: 'radiant'
          }
        },
        cleanse: {
          removes: ['poison', 'disease', 'curse'],
          limit: 'One condition removed'
        }
      },

      specialMechanics: {
        phaseInteraction: {
          waxingMoon: 'Healing increases to 4d8+2d6, and target gains 2d6 temporary HP (Elune\'s Grace passive doubled)',
          fullMoon: 'Can cleanse two conditions instead of one',
          waningMoon: 'Costs 1d4 less mana'
        }
      },

      tags: ['healing', 'cleanse', 'support', 'powerful', 'moonwell-guardian']
    },

    // UNIVERSAL SPELLS - Phase Manipulation
    {
      id: 'lunarch_phase_shift',
      name: 'Phase Shift',
      description: 'Manually shift to any lunar phase of your choice, resetting the natural cycle.',
      spellType: 'ACTION',
      icon: 'spell_nature_timestop',
      school: 'Transmutation',
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
        durationType: 'rounds',
        duration: 3
      },

      resourceCost: {
        mana: 8,
        components: ['verbal'],
        verbalText: 'Choose phase name: "Luna Nova!" (New), "Luna Crescens!" (Waxing), "Luna Plena!" (Full), "Luna Decrescens!" (Waning)'
      },

      resolution: 'AUTOMATIC',

      effects: {
        utility: {
          phaseChange: {
            description: 'Immediately shift to chosen phase',
            duration: '3 rounds before natural cycling resumes',
            choices: ['New Moon', 'Waxing Moon', 'Full Moon', 'Waning Moon']
          }
        }
      },

      specialMechanics: {
        phaseMechanic: {
          description: 'Core ability for all Lunarchs',
          tacticalUse: 'Use to adapt to changing combat situations',
          manaCost: 'Significant investment - use wisely'
        }
      },

      tags: ['utility', 'phase-shift', 'universal', 'core-mechanic']
    },

    {
      id: 'lunarch_moonbeam',
      name: 'Moonbeam',
      description: 'Create a beam of moonlight that follows a target, dealing damage that changes based on your current phase.',
      spellType: 'ACTION',
      icon: 'spell_holy_prayerofhealing02',
      school: 'Evocation',
      level: 3,
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
        durationType: 'rounds',
        duration: 3,
        concentration: true
      },

      resourceCost: {
        mana: 9,
        components: ['verbal', 'somatic'],
        verbalText: 'Radius lunae!',
        somaticText: 'Point at target with glowing finger'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '2d6',
        damageType: 'radiant',
        scalingType: 'none',
        recurring: true
      },

      effects: {
        damage: {
          recurring: {
            formula: '2d6',
            type: 'radiant',
            trigger: 'Start of target turn',
            duration: 3
          }
        }
      },

      specialMechanics: {
        phaseInteraction: {
          newMoon: 'Damage type becomes necrotic, and you heal for half damage dealt',
          waxingMoon: 'Damage increases to 2d6+1d4',
          fullMoon: 'Damage increases to 2d6+1d6 and beam cannot be broken by movement',
          waningMoon: 'Duration increases to 5 rounds'
        },
        concentration: {
          description: 'Requires concentration - ends if you lose concentration',
          movement: 'Beam follows target if they move (unless in Full Moon)'
        }
      },

      tags: ['radiant', 'damage', 'concentration', 'phase-dependent', 'universal']
    },

    {
      id: 'lunarch_lunar_cycle',
      name: 'Lunar Cycle',
      description: 'Rapidly cycle through all four lunar phases in sequence, gaining brief benefits from each.',
      spellType: 'ACTION',
      icon: 'spell_arcane_arcane04',
      school: 'Transmutation',
      level: 4,
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
        durationType: 'instant'
      },

      resourceCost: {
        mana: 14,
        components: ['verbal', 'somatic'],
        verbalText: 'Cyclus lunaris!',
        somaticText: 'Spin in place with arms extended'
      },

      resolution: 'AUTOMATIC',

      effects: {
        multiPhase: {
          sequence: [
            'New Moon: Restore 1d4 mana, reduce next attack by 1d4',
            'Waxing Moon: Next spell deals +1d4 damage or heals +1d6',
            'Full Moon: Next attack deals +1d6 damage with +2 crit range',
            'Waning Moon: Next spell costs 1d4 less mana'
          ],
          duration: 'Benefits last until used or 1 minute'
        }
      },

      specialMechanics: {
        rapidCycle: {
          description: 'Gain one benefit from each phase in rapid succession',
          usage: 'All benefits are active simultaneously until consumed',
          afterEffect: 'After all benefits are consumed, return to New Moon phase'
        }
      },

      tags: ['utility', 'buff', 'multi-phase', 'universal']
    }
  ]
};

