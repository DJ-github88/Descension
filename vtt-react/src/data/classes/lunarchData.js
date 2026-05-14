/**
 * Lunarch Class Data
 *
 * Complete class information for the Lunarch - a celestial archer and lunar mage
 * who channels the power of moon phases to adapt their combat style.
 */

export const LUNARCH_DATA = {
  id: "lunarch",
  name: "Lunarch",
  icon: "fas fa-moon",
  role: "Support/Control",
  damageTypes: ["arcane", "radiant"],

  // Overview section
  overview: {
    title: "The Lunarch",
    subtitle: "Celestial Archer and Lunar Mage",

    quickOverview: {
      title: "Quick Overview",
      content: `**What You Need to Know**: The Lunarch channels power from four moon phases, each granting distinct bonuses that cycle naturally or can be shifted manually for mana.

**Core Mechanic**: New Moon (defense/recovery) → Waxing Moon (support/healing) → Full Moon (offense/damage) → Waning Moon (control/efficiency)

**Resource**: Mana (8 per Phase Shift), 4-phase cycle (auto-advances every 3 rounds)

**Playstyle**: Adaptive ranged combat with phase-based versatility

**Best For**: Players who enjoy flexible role-shifting, celestial themes, and timing-based resource management`,
    },

    description: `The Lunarch is a master of celestial magic who draws power from the phases of the moon. Inspired by ancient lunar priestesses and celestial guardians, Lunarchs channel the ever-changing energy of the moon to adapt their combat style. Through the Phase Shift system, they flow between four distinct lunar phases, each granting unique bonuses and altering their spell effects. This dynamic resource system rewards tactical thinking and phase management, allowing Lunarchs to excel as versatile ranged combatants who can shift between offense, defense, and support as the battle demands.`,

    roleplayIdentity: {
      title: "Roleplay Identity",
      content: `Lunarchs are devoted followers of lunar deities, celestial scholars, or individuals touched by moonlight magic. They often serve as guardians of sacred groves, protectors of the night, or wandering mystics who follow the moon's guidance.

**Common Lunarch Archetypes**:
- **The Moonlight Sentinel**: A vigilant guardian who patrols under the moon's watchful gaze, protecting sacred sites and innocent travelers
- **The Celestial Scholar**: An academic who studies the movements of celestial bodies and harnesses their power through careful observation
- **The Lunar Priestess**: A devoted servant of a moon deity, channeling divine lunar power to heal allies and smite enemies
- **The Night Hunter**: A ranger who thrives in darkness, using moonlight to track prey and strike from the shadows
- **The Tide Caller**: A coastal mystic who understands the moon's influence on tides and uses this connection to manipulate water and fate

**Personality Traits**:
Lunarchs tend to be contemplative, patient, and attuned to natural cycles. They understand that power waxes and wanes, and they embrace change rather than resist it. Many are nocturnal by preference, finding peace and clarity under starlit skies.`,
    },

    combatRole: {
      title: "Combat Role",
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
Lunarchs excel at medium to long range (30-60 feet), where they can safely cast spells and loose arrows while maintaining awareness of the battlefield. They should position to maximize phase benefits—staying near allies during support phases, maintaining distance during offensive phases.`,
    },

    playstyle: {
      title: "Playstyle & Strategy",
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
- Use Waning Moon to extend crowd control effects from allies`,
    },

    immersiveCombatExample: {
      title: "Combat Example: The Lunar Cycle",
      content: `**The Setup**: You're a Lunarch (Moonlight Sentinel specialization) facing a group of shadow creatures (4 shadow wraiths + 1 shadow lord). Your party is with you. Starting Phase: New Moon (all Lunarchs start combat in New Moon). Starting Mana: 50/60. Your goal: Cycle through lunar phases strategically, using each phase's unique bonuses to adapt to the battle.

> **PHASE SKIP RULE**: When you manually shift to any phase, the 3-round timer resets. After your shifted phase ends, the cycle resumes from the NEXT phase in order. For example, shifting New Moon → Full Moon means after Full expires, you cycle to Waning (Waxing was skipped). Waxing returns after Waning completes.

**Starting State**: Phase: New Moon | Mana: 50/60 | HP: 65/65 | Round: 1

**NEW MOON PHASE (Rounds 1-3)**

**Turn 1 - New Moon: Recovery and Preparation (Phase: New Moon, Round 1/3)**

*The shadow wraiths emerge from the darkness, their forms shifting and ethereal. You raise your bow, moonlight gathering around you. The moon is NEW—dark, hidden, a time for recovery and preparation.*

**New Moon Bonuses**:
- +2 Armor (defensive bonus)
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

**Shadow Wraith #1's Turn**: Attacks you → [14] → Miss! (your Armor is 16 + 2 = 18 from New Moon)

*The wraith's claws pass through empty air. The new moon's protection shields you.*

**Current State**: Phase: New Moon (Round 1/3) | Mana: 44/60 | HP: 65/65

**Turn 2 - New Moon: Continued Defense (Phase: New Moon, Round 2/3)**

**Regeneration**: +1d6 HP → [3] = +3 HP (already at max, no effect)

**Your Action**: Cast "Lunar Arrow" at Shadow Wraith #2 (4 mana)
**Attack Roll**: d20+6 → [17] = Hit!
**Damage**: 1d8+4 radiant → [7] + 4 = **11 radiant damage**

**Mana**: 44 - 4 = 40/60

**Shadow Lord's Turn**: Casts "Shadow Bolt" at you → [16] → Miss! (armor 18)

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
**You**: "New Moon phase. +2 Armor, +1d6 HP regeneration per turn. I started defensive, then shifted to Full Moon for damage, then naturally cycled to Waning Moon for efficiency."

**Final State**: Phase: Waning Moon (Round 2/3) | Mana: 16/60 | HP: 65/65

**The Lesson**: Lunarch gameplay is about:
1. **Phase Cycling**: Started in New Moon (defensive), manually shifted to Full Moon (offensive), naturally cycled to Waning Moon (efficiency)
2. **Manual Shifting**: Spent 8 mana Turn 3 to shift from New Moon to Full Moon (skipped Waxing Moon because didn't need healing)
3. **Full Moon Damage**: Moonbeam: 17 → 28 damage (+11 from +2d6), Lunar Arrow crit: 12 → 46 damage (doubled base + doubled Full Moon bonus)
4. **Waning Moon Efficiency**: Saved 4 mana total (Moonbeam 6 → 4, Lunar Arrow 4 → 2)
5. **New Moon Defense**: +2 armor caused 2 attacks to miss (armor 16 → 18)
6. **Phase Duration**: Each phase lasts 3 rounds naturally, manual shift resets timer
7. **Strategic Shifting**: Skipped Waxing Moon (healing) because didn't need it, went straight to Full Moon for damage

You're not a static caster. You're a LUNAR MAGE who flows through moon phases. New Moon for defense and recovery. Waxing Moon for healing and support. Full Moon for MAXIMUM DAMAGE. Waning Moon for mana efficiency and control. The key is knowing when to let phases cycle naturally (free) and when to manually shift (8 mana). If you need damage NOW, shift to Full Moon. If you're low on mana, let it cycle to Waning Moon. The moon is always changing, and so are you.`,
    },
  },

  resourceSystem: {
    title: "The Lunar Cycle",
    subtitle: "Flowing Through the Four Phases",

    description: `The Lunarch is a celestial master who channels the shifting phases of the moon to adapt their combat role. By flowing through the Lunar Cycle—from the defensive stillness of the New Moon to the radiant fury of the Full Moon—they adapt to the battlefield's needs. Whether they are healing wounds under a Waxing Moon or conserving mana during the Waning phase, the Lunarch's strength lies in their rhythmic mastery of time and celestial alignment.`,

    cards: [
      {
        title: "🌑 New Moon (Defensive)",
        stats: "+2 Armor | +1d6 HP Regen | Stealth Adv",
        details:
          "The phase of hidden potential. Use this for recovery and preparation. You start every combat encounter here.",
      },
      {
        title: "🌒 Waxing Moon (Growth)",
        stats: "+1d6 Healing | +10ft Speed",
        details:
          "The phase of expansion. Your supportive spells and movement are enhanced, allowing you to reposition and mend allies.",
      },
      {
        title: "🌕 Full Moon (Radiance)",
        stats: "+2d6 Radiant DMG | Crit 19-20",
        details:
          "The phase of peak power. Unleash your most devastating attacks. Advantage on all attack rolls while the moon is full.",
      },
      {
        title: "🌘 Waning Moon (Efficiency)",
        stats: "-2 Mana Costs | +1 Rnd Debuffs",
        details:
          "The phase of release. Conserve your mana and ensure your control effects linger longer on the battlefield.",
      },
    ],

    generationTable: {
      headers: ["Action", "Cost", "Effect"],
      rows: [
        ["Natural Cycle", "Free", "Auto-advances to next phase every 3 rounds"],
        [
          "Phase Shift",
          "8 Mana",
          "Manually jump to any phase (resets 3-rnd timer)",
        ],
        [
          "Lunar Eclipse",
          "15 Mana",
          "Gain benefits of New + Full Moon for 2 rounds (Starfall Invoker Lv6 spell)",
        ],
      ],
    },

    usage: {
      momentum:
        'Coordinate your burst with the Full Moon. If the timer is almost up, spend the mana to "Shift" back into Full Moon to reset the 3-round clock and stay in the offensive pocket.',
      flourish:
        "⚠️ Phase Awareness: Don’t get caught in Full Moon when your team is at critical health. Anticipate the cycle and shift to Waxing Moon early if danger is spiked.",
    },

    overheatRules: {
      title: "Celestial Alignment",
      content: `Your current lunar phase determines your **Stance**, significantly altering your role on the battlefield. 

**🌑 New Moon (Defensive Stance)**:
- **Focus**: High survivability and recovery.
- **Strategy**: Use this time for mana-free utility or to reposition safely. The +2 Armor bonus makes you a difficult target for ranged enemies.

**🌒 Waxing Moon (Support Stance)**:
- **Focus**: Enhancing allies and mobility.
- **Strategy**: Move to the frontline to distribute heals. The speed bonus allows you to kite enemies while keeping your tank healthy.

**🌕 Full Moon (Offensive Stance)**:
- **Focus**: Maximum aggression and burst.
- **Strategy**: This is your "Go" window. Spend your mana on your most expensive spells. The expanded crit range and bonus radiant damage make your damage output peak here.

**🌘 Waning Moon (Efficiency Stance)**:
- **Focus**: Crowd control and stabilization.
- **Strategy**: Use the reduced mana costs to spam control spells. The increased debuff duration ensures your slowing and blinding effects stabilize the field before the cycle resets.`,
    },

    strategicConsiderations: {
      title: "The Rhythmic Archer",
      content: `**The 3-Round Rhythm**: Every combat has a pulse. You have 3 rounds to maximize each phase. Don't waste "Full Moon" rounds moving; move during "Waxing Moon" so you're planted and ready to fire when the light peaks.

**The Mana-Rich Shift**: Shifting costs 8 Mana—more than many spells. Only shift when the situation is desperate or when skipping a phase (like Waning) allows you to secure a kill that ends the fight early.

**Defensive Pivoting**: If you are focused by a boss, shift to New Moon immediately. The +2 Armor and HP regeneration can be the difference between a wipe and a recovery.

**Worked Example (Shift Timing)**:
- **Round 2 of Waxing Moon**: Your tank is hit for 50 damage.
- **The Play**: Don't wait for the cycle. Spend 8 Mana to Shift to Waxing Moon *again* (resetting the timer) or stay and use your enhanced +1d6 healing immediately. 
- **The Result**: You maximize the support window when it's needed most, rather than being forced into an offensive phase next round.`,
    },

    playingInPerson: {
      title: "Playing in Person",
      subtitle: "The Phase Dial",
      content: `Tracking a 4-phase cycle that changes every 3 rounds can be tricky. Use physical props to keep the rhythm.

**Required Materials**:
- **Lunar Phase Wheel** — A paper plate or card with the 4 phases. Use a clothespin to mark the current phase.
- **Cycle d6** — Use a die to track rounds. (1-2 = Rnd 1, 3-4 = Rnd 2, 5-6 = Rnd 3).

**The Physical Hack**:
- **The Moon Coin**: Use a large silver coin or token. When you shift to Full Moon, place it prominently on your character sheet. When it cycles to Waning, move it half-off the sheet.
- **LED Pulse**: If playing with lights, a blue light for New/Waning and a bright white light for Waxing/Full helps the whole table see your current "stance" without asking.

**Quick Reference**:
\`\`\`
CYCLE: New 🌑 → Waxing 🌒 → Full 🌕 → Waning 🌘
TIMER: 3 Rounds per Phase (Auto-Advances)
SHIFT: 8 Mana to change immediately (Resets Timer)
\`\`\`

**Tactile Tip**: When you "Shift" manually, physically spin your phase dial. It emphasizes the magical effort of bending the heavens to your will.`,
    },
  },

  // Specializations
  specializations: {
    title: "Lunarch Specializations",
    subtitle: "Three Paths of Lunar Mastery",

    description: `Every Lunarch chooses one of three specializations that define their approach to lunar magic. Each specialization emphasizes different aspects of the moon's power and offers unique passive abilities that enhance specific playstyles.`,

    sharedPassive: {
      name: "Lunar Empowerment",
      icon: "Arcane/Star Trail Path",
      description:
        "Your connection to the moon grants you darkvision up to 60 feet. Additionally, you have advantage on saving throws against being charmed or frightened while in Full Moon phase.",
    },

    specs: [
      {
        id: "moonlight-sentinel",
        name: "Moonlight Sentinel",
        icon: "Nature/Owl",
        color: "#C0C0C0",
        theme: "Precision Archer",

        description: `The Moonlight Sentinel specialization focuses on ranged precision and lunar-infused archery. These Lunarchs are deadly marksmen who channel moonlight through their arrows, dealing devastating damage from afar. They excel at single-target elimination and marking priority targets for their team.`,

        playstyle:
          "Ranged damage dealer alternating between bow attacks and lunar spells, with emphasis on critical strikes during Full Moon",

        strengths: [
          "Highest single-target ranged damage among Lunarch specs",
          "Excellent critical strike potential during Full Moon phase",
          "Can mark targets to amplify team damage",
          "Strong at long range (60+ feet)",
        ],

        weaknesses: [
          "Less effective in melee range",
          "Limited AoE damage compared to Starfall Invoker",
          "Requires clear line of sight for bow attacks",
          "Dependent on Full Moon phase for peak damage",
        ],

        passiveAbilities: [
          {
            name: "Lunar Empowerment",
            tier: "Path Passive",
            description:
              "Your connection to the moon grants you darkvision up to 60 feet. Additionally, you have advantage on saving throws against being charmed or frightened while in Full Moon phase.",
            sharedBy: "All Lunarch",
          },
          {
            name: "Lunar Precision",
            tier: "Specialization Passive",
            icon: "Piercing/On the Mark",
            description:
              "Your critical hits during Full Moon phase deal an additional 2d6 radiant damage. This bonus applies to both weapon attacks and spell attacks.",
            uniqueTo: "Moonlight Sentinel",
          },
          {
            name: "Sentinel's Mark",
            tier: "Specialization Ability",
            icon: "Piercing/Targeted Strike",
            description:
              "When you hit a creature with a ranged weapon attack, you can mark them until the end of your next turn. Marked creatures take +1d4 damage from your next spell that targets them.",
            uniqueTo: "Moonlight Sentinel",
          },
        ],

        recommendedSpells: [
          "Lunar Arrow - Your bread-and-butter ranged attack",
          "Sentinel's Shot - Mark and eliminate priority targets",
          "Moonfire Barrage - Multi-target damage when needed",
          "Phase Shift - Ensure you're in Full Moon for burst windows",
        ],
      },
      {
        id: "starfall-invoker",
        name: "Starfall Invoker",
        icon: "Arcane/Missile",
        color: "#4B0082",
        theme: "Celestial Bombardment",

        description: `The Starfall Invoker calls down the wrath of the heavens, raining celestial energy upon their enemies. This specialization excels at area-of-effect damage and battlefield control, making them ideal for handling multiple enemies or controlling choke points. They channel the destructive power of falling stars and cosmic beams.`,

        playstyle:
          "AoE damage and control specialist, focusing on positioning and timing to maximize celestial bombardment effects",

        strengths: [
          "Exceptional AoE damage potential",
          "Strong battlefield control with blinding and stunning effects",
          "Enhanced spell range and area during Full Moon",
          "Excellent at handling multiple enemies simultaneously",
        ],

        weaknesses: [
          "Lower single-target damage than Moonlight Sentinel",
          "High mana consumption for AoE spells",
          "Requires good positioning to avoid friendly fire",
          "Less effective against spread-out enemies",
        ],

        passiveAbilities: [
          {
            name: "Lunar Empowerment",
            tier: "Path Passive",
            description:
              "Your connection to the moon grants you darkvision up to 60 feet. Additionally, you have advantage on saving throws against being charmed or frightened while in Full Moon phase.",
            sharedBy: "All Lunarch",
          },
          {
            name: "Celestial Cascade",
            tier: "Specialization Passive",
            icon: "Arcane/Star Trail Path",
            description:
              "Your AoE spells during Full Moon phase affect an additional 5-foot radius beyond their normal area. This does not increase mana cost.",
            uniqueTo: "Starfall Invoker",
          },
          {
            name: "Stellar Guidance",
            tier: "Specialization Passive",
            icon: "Arcane/Magical Sword",
            description:
              "During Waxing Moon phase, you gain +2 to spell attack rolls. This bonus helps ensure your celestial bombardments hit their targets.",
            uniqueTo: "Starfall Invoker",
          },
        ],

        recommendedSpells: [
          "Starfall - Your signature AoE damage ability",
          "Celestial Beam - Line AoE with blinding effect",
          "Lunar Eclipse - Ultimate ability for massive burst",
          "Moonbeam - Sustained damage that changes with phases",
        ],
      },
      {
        id: "moonwell-guardian",
        name: "Moonwell Guardian",
        icon: "Nature/Ethereal Bird",
        color: "#20B2AA",
        theme: "Lunar Warden",

        description: `The Moonwell Guardian is a devoted warden who channels the moon's restorative power to heal and shield allies. They create sacred moonwells that pulse with lunar energy, bestow blessings that shift with the phases, and ensure their companions survive even the most dire battles. While rooted in the Lunarch's phase system, this specialization leans into the Waxing Moon's growth and the New Moon's protection, making them essential battlefield sustainers who shape the fight through healing zones and protective barriers.`,

        playstyle:
          "Support healer and protector, focusing on sustained healing, shields, and protective buffs for the party",

        strengths: [
          "Strongest healing output among Lunarch specs",
          "Can grant temporary hit points and shields",
          "Provides defensive buffs to nearby allies",
          "Excellent sustained healing during Waxing Moon",
        ],

        weaknesses: [
          "Lowest damage output of all Lunarch specs",
          "Requires proximity to allies to maximize passive benefits",
          "Mana-intensive healing rotation",
          "Vulnerable when focused by enemies",
        ],

        passiveAbilities: [
          {
            name: "Lunar Empowerment",
            tier: "Path Passive",
            description:
              "Your connection to the moon grants you darkvision up to 60 feet. Additionally, you have advantage on saving throws against being charmed or frightened while in Full Moon phase.",
            sharedBy: "All Lunarch",
          },
          {
            name: "Elune's Grace",
            tier: "Specialization Passive",
            icon: "Radiant/Radiant Golden Shield",
            description:
              "Your healing spells during Waxing Moon phase grant the target 1d6 temporary hit points in addition to the healing. These temporary HP last for 1 minute.",
            uniqueTo: "Lunar Guardian",
          },
          {
            name: "Lunar Sanctuary",
            tier: "Specialization Passive",
            icon: "Healing/Prayer",
            description:
              "While you are in New Moon phase, all allies within 15 feet of you gain +1 Armor. This bonus is lost if you move more than 15 feet away from them.",
            uniqueTo: "Lunar Guardian",
          },
        ],

        recommendedSpells: [
          "Moonwell - Create persistent healing zones",
          "Lunar Blessing - Shield allies with lunar energy",
          "Elune's Grace - Powerful healing and cleansing",
          "Phase Shift - Ensure you're in Waxing Moon when healing is needed",
        ],
      },
    ],
  },

  // Example Spells - showcasing Phase Shift mechanics
  exampleSpells: [
    // MOONLIGHT SENTINEL - Precision Archery
    {
      id: "lunarch_lunar_arrow",
      name: "Lunar Arrow",
      description:
        "Fire an arrow infused with moonlight that deals radiant damage. Effects vary with your current lunar phase.",
      spellType: "ACTION",
      icon: "Nature/Owl",
      level: 1,
      specialization: "moonlight-sentinel",
      effectTypes: ["damage"],

      typeConfig: {
        school: "radiant",
        icon: "Nature/Owl",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
      },

      durationConfig: {
        durationType: "instant",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 4 },
        actionPoints: 1,
        components: ["somatic", "material"],
        somaticText: "Draw and loose arrow",
        materialText: "Arrow infused with moonlight",
      },

      resolution: "DICE",

      damageConfig: {
        formula: "1d8",
        elementType: "radiant",
        damageTypes: ["direct"],
        scalingType: "none",
        resolution: "DICE",
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },

      specialMechanics: {
        phaseInteraction: {
          newMoon: "If you are hidden, add +1d4 damage",
          waxingMoon: "Add +1d4 radiant damage",
          fullMoon: "Add +1d6 radiant damage and increase crit range by 2",
          waningMoon: "Costs 1d4 less mana (minimum 1)",
        },
      },

      tags: [
        "radiant",
        "damage",
        "ranged",
        "phase dependent",
        "moonlight sentinel",
      ],
    },

    {
      id: "lunarch_sentinels_shot",
      name: "Sentinel's Shot",
      description:
        "Fire an arrow that strikes with unerring accuracy, leaving a glowing mark on your target. The mark pulses with lunar energy, making the target vulnerable to your next spell. The mark's power intensifies during Full Moon, lasting longer and amplifying your magic more effectively.",
      spellType: "ACTION",
      icon: "Piercing/Targeted Strike",
      level: 3,
      specialization: "moonlight-sentinel",
      effectTypes: ["damage", "debuff"],

      typeConfig: {
        school: "radiant",
        icon: "Piercing/Targeted Strike",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 80,
      },

      durationConfig: {
        durationType: "rounds",
        duration: 2,
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 7 },
        actionPoints: 1,
        components: ["somatic", "material"],
        somaticText: "Draw arrow with focused aim",
        materialText: "Silver-tipped arrow",
      },

      resolution: "DICE",

      damageConfig: {
        formula: "3d6",
        elementType: "radiant",
        damageTypes: ["direct"],
        scalingType: "none",
        resolution: "DICE",
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },

      debuffConfig: {
        debuffType: "statusEffect",
        durationValue: 2,
        durationType: "rounds",
        durationUnit: "rounds",
        effects: [
          {
            id: "marked",
            name: "Marked",
            description: "Marked targets take +1d4 damage from your next spell",
            statusType: "marked",
            level: "moderate",
            mechanicsText: "+1d4 damage from next spell for 2 rounds",
            dotFormula: "+1d4",
            dotDamageType: "radiant",
          },
        ],
      },

      specialMechanics: {
        phaseInteraction: {
          fullMoon:
            "Mark lasts 3 rounds instead of 2, and bonus damage increases to 1d6",
        },
        sentinelMark: {
          description: "Marked targets take bonus damage from your next spell",
          stackable: false,
        },
      },

      tags: [
        "radiant",
        "damage",
        "ranged",
        "debuff",
        "mark",
        "moonlight sentinel",
      ],
    },

    {
      id: "lunarch_moonfire_barrage",
      name: "Moonfire Barrage",
      description:
        "Unleash a volley of moonfire-infused arrows that rain down on multiple targets.",
      spellType: "ACTION",
      icon: "Piercing/Rapid Arrows",
      level: 5,
      specialization: "moonlight-sentinel",
      effectTypes: ["damage"],

      typeConfig: {
        school: "radiant",
        icon: "Piercing/Rapid Arrows",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "multi",
        rangeType: "ranged",
        rangeDistance: 60,
        maxTargets: 3,
      },

      durationConfig: {
        durationType: "instant",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 10 },
        actionPoints: 1,
        components: ["somatic", "material"],
        somaticText: "Rapid-fire arrow volley",
        materialText: "3 arrows",
      },

      resolution: "DICE",

      damageConfig: {
        formula: "2d6",
        elementType: "radiant",
        damageTypes: ["direct"],
        scalingType: "none",
        resolution: "DICE",
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },

      effects: {
        damage: {
          perTarget: {
            formula: "2d6",
            type: "radiant",
            targets: 3,
          },
        },
      },

      specialMechanics: {
        phaseInteraction: {
          fullMoon:
            "Can target up to 5 enemies instead of 3, and each arrow deals +1d6 damage",
        },
        multiTarget: {
          description: "Each arrow targets a different enemy within range",
          requiresLineOfSight: true,
        },
      },

      tags: [
        "radiant",
        "damage",
        "ranged",
        "multi target",
        "moonlight sentinel",
      ],
    },

    // STARFALL INVOKER - Celestial AoE
    {
      id: "lunarch_starfall",
      name: "Starfall",
      description:
        "Call down a shower of falling stars that crash into a target area, dealing radiant damage to all enemies within.",
      spellType: "ACTION",
      icon: "Arcane/Star Trail Path",
      level: 2,
      specialization: "starfall-invoker",
      effectTypes: ["damage"],

      typeConfig: {
        school: "radiant",
        icon: "Arcane/Star Trail Path",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 60,
        areaType: "circle",
        areaSize: 15,
      },

      durationConfig: {
        durationType: "instant",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 8 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Stellae cadunt!",
        somaticText: "Point skyward and bring hand down",
      },

      resolution: "DICE",

      damageConfig: {
        formula: "3d6",
        elementType: "radiant",
        damageTypes: ["direct"],
        scalingType: "none",
        resolution: "DICE",
        savingThrow: {
          ability: "agility",
          difficultyClass: 14,
          saveOutcome: "half",
        },
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },

      effects: {
        damage: {
          aoe: {
            formula: "3d6",
            type: "radiant",
            shape: "circle",
            radius: 15,
          },
        },
      },

      savingThrowEffect: {
        onSuccess: "Takes half damage (1d6+3)",
        onFailure: "Takes full damage (3d6)",
      },

      specialMechanics: {
        phaseInteraction: {
          fullMoon:
            "Radius increases to 20 feet (Celestial Cascade passive adds +5 feet to base 15)",
          waxingMoon:
            "+2 to spell attack rolls (from Stellar Guidance passive)",
        },
      },

      tags: ["radiant", "damage", "aoe", "starfall invoker"],
    },

    {
      id: "lunarch_celestial_beam",
      name: "Celestial Beam",
      description:
        "Channel a concentrated beam of celestial energy in a line, dealing radiant damage. Targets must save or be blinded for 1 round.",
      spellType: "ACTION",
      icon: "Arcane/Missile",
      level: 4,
      specialization: "starfall-invoker",
      effectTypes: ["damage", "debuff"],

      typeConfig: {
        school: "radiant",
        icon: "Arcane/Missile",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "line",
        rangeType: "ranged",
        rangeDistance: 60,
        lineLength: 30,
        lineWidth: 5,
      },

      durationConfig: {
        durationType: "instant",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 9 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Lux caelestis!",
        somaticText: "Extend both hands forward",
      },

      resolution: "SAVE",

      damageConfig: {
        formula: "4d6",
        elementType: "radiant",
        damageTypes: ["direct"],
        scalingType: "none",
        resolution: "DICE",
        savingThrow: {
          ability: "constitution",
          difficultyClass: 15,
          saveOutcome: "half",
        },
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },

      debuffConfig: {
        debuffType: "statusEffect",
        durationValue: 1,
        durationType: "rounds",
        durationUnit: "rounds",
        savingThrow: {
          ability: "constitution",
          difficultyClass: 15,
          saveOutcome: "negates",
        },
        effects: [
          {
            id: "blinded",
            name: "Blinded",
            description:
              "Blinded for 1 round - disadvantage on attack rolls, cannot see, automatically fails sight-based checks",
            statusType: "blinded",
            level: "moderate",
            statPenalty: [
              { stat: "attack", value: -99, magnitudeType: "disadvantage" },
            ],
            mechanicsText: "Disadvantage on attack rolls for 1 round",
          },
        ],
      },

      effects: {
        damage: {
          line: {
            formula: "4d6",
            type: "radiant",
            length: 30,
            width: 5,
          },
        },
        debuff: {
          type: "blinded",
          duration: 1,
          saveToNegate: true,
        },
      },

      savingThrowEffect: {
        onSuccess: "Takes full damage but not blinded",
        onFailure: "Takes full damage and is blinded for 1 round",
      },

      specialMechanics: {
        phaseInteraction: {
          fullMoon:
            "Blinded duration increases to 2 rounds, and damage increases by +1d6",
        },
      },

      tags: [
        "radiant",
        "damage",
        "line",
        "aoe",
        "blind",
        "debuff",
        "starfall invoker",
      ],
    },

    {
      id: "lunarch_lunar_eclipse",
      name: "Lunar Eclipse",
      description:
        "Channel both New Moon and Full Moon simultaneously. Gain New Moon's defensive power and Full Moon's offensive might, wreathed in a radiant lunar aura that burns nearby enemies.",
      spellType: "ACTION",
      icon: "Healing/Cure Within",
      level: 6,
      specialization: "starfall-invoker",
      effectTypes: ["buff", "damage"],

      typeConfig: {
        school: "radiant",
        icon: "Healing/Cure Within",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },

      durationConfig: {
        durationType: "rounds",
        duration: 2,
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 15 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "Eclipse lunaris!",
        somaticText: "Cross arms then spread wide",
      },

      resolution: "AUTOMATIC",

      buffConfig: {
        buffType: "dual_phase",
        effects: [
          {
            id: "new_moon_benefit",
            name: "New Moon Eclipse",
            description:
              "Gain +1d4 mana per turn and reduce incoming damage by 1d4",
            mechanicsText: "+1d4 mana regen and -1d4 damage reduction per turn",
          },
          {
            id: "full_moon_benefit",
            name: "Full Moon Eclipse",
            description: "Gain +1d6 to all damage and expand crit range by 2",
            mechanicsText: "+1d6 damage and +2 crit range",
          },
          {
            id: "radiant_aura",
            name: "Radiant Aura",
            description: "Deal 1d4 radiant damage to enemies within 10 feet",
            mechanicsText:
              "1d4 radiant damage to enemies within 10 feet per turn",
          },
        ],
        durationValue: 2,
        durationType: "rounds",
        durationUnit: "rounds",
        concentrationRequired: false,
        canBeDispelled: true,
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 5 },

      effects: {
        buff: {
          duration: 2,
          benefits: [
            "New Moon: Mana regen +1d4/turn, damage reduction -1d4",
            "Full Moon: Damage +1d6, crit range +2",
            "Aura: 1d4 radiant damage to nearby enemies",
          ],
        },
      },

      specialMechanics: {
        dualPhase: {
          description:
            "Gain benefits from both New Moon and Full Moon simultaneously. The eclipse creates a perfect balance where you draw power from both phases, becoming both a shield and a weapon. A radiant aura of lunar energy surrounds you, burning enemies who venture too close.",
          phaseLock: "Your phase does not cycle during Eclipse duration",
          afterEffect:
            "After Eclipse ends, you return to the phase you were in before casting",
        },
      },

      tags: ["buff", "self", "dual phase", "ultimate", "starfall invoker"],
    },

    // MOONWELL GUARDIAN - Healing & Support
    {
      id: "lunarch_moonwell",
      name: "Moonwell",
      description:
        "Create a sacred pool of lunar energy that heals all allies who stand within it.",
      spellType: "ACTION",
      icon: "Nature/Ethereal Bird",
      level: 2,
      specialization: "moonwell-guardian",
      effectTypes: ["healing"],

      typeConfig: {
        school: "radiant",
        icon: "Nature/Ethereal Bird",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 30,
        areaType: "circle",
        areaSize: 10,
      },

      durationConfig: {
        durationType: "minutes",
        duration: 1,
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 8 },
        actionPoints: 1,
        components: ["verbal", "somatic", "material"],
        verbalText: "Fons lunae!",
        somaticText: "Touch ground to create moonwell",
        materialText: "Vial of blessed water",
      },

      resolution: "AUTOMATIC",

      healingConfig: {
        formula: "1d6",
        healingType: "area",
        trigger: "start_of_turn",
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },

      effects: {
        healing: {
          aoe: {
            formula: "1d6",
            trigger: "At start of ally turn in area",
            shape: "circle",
            radius: 10,
            duration: "1 minute",
          },
        },
      },

      specialMechanics: {
        phaseInteraction: {
          waxingMoon:
            "Healing increases to 1d6+1d6 (total 2d6) and grants 1d6 temporary HP (Elune's Grace passive)",
          fullMoon: "Radius increases to 15 feet",
          waningMoon: "Duration increases to 2 minutes",
        },
        persistent: {
          description:
            "Moonwell remains until duration expires or you create a new one",
          limit: "Only one Moonwell can exist at a time",
        },
      },

      tags: ["healing", "aoe", "persistent", "support", "moonwell guardian"],
    },

    {
      id: "lunarch_lunar_blessing",
      name: "Lunar Blessing",
      description:
        "Bestow a protective shield of lunar energy upon an ally, absorbing incoming damage.",
      spellType: "ACTION",
      icon: "Force/Force Shield",
      level: 3,
      specialization: "moonwell-guardian",
      effectTypes: ["buff"],

      typeConfig: {
        school: "radiant",
        icon: "Force/Force Shield",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 40,
      },

      durationConfig: {
        durationType: "minutes",
        duration: 5,
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 7 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Benedictio lunae!",
        somaticText: "Gesture toward ally",
      },

      resolution: "AUTOMATIC",

      shieldConfig: {
        formula: "2d8",
        shieldType: "temporary_hp",
        duration: "5 minutes",
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },

      effects: {
        shield: {
          amount: "2d8",
          type: "temporary_hp",
          duration: "5 minutes or until depleted",
        },
      },

      specialMechanics: {
        phaseInteraction: {
          waxingMoon: "Shield amount increases to 2d8+1d6",
          fullMoon: "Shield also grants +1 Armor while active",
          newMoon:
            "If cast on ally within 15 feet, they also gain Lunar Sanctuary +1 Armor bonus",
        },
      },

      tags: ["shield", "protection", "support", "moonwell guardian"],
    },

    {
      id: "lunarch_elunes_grace",
      name: "Elune's Grace",
      description:
        "Channel the moon goddess's blessing to heal an ally and cleanse them of harmful effects.",
      spellType: "ACTION",
      icon: "Radiant/Radiant Golden Shield",
      level: 5,
      specialization: "moonwell-guardian",
      effectTypes: ["healing"],

      typeConfig: {
        school: "radiant",
        icon: "Radiant/Radiant Golden Shield",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 40,
      },

      durationConfig: {
        durationType: "instant",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 12 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Gratia Elunae!",
        somaticText: "Raise hand toward ally with palm open",
      },

      resolution: "AUTOMATIC",

      healingConfig: {
        formula: "4d8",
        healingType: "single",
        cleanse: true,
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },

      effects: {
        healing: {
          instant: {
            formula: "4d8",
            type: "radiant",
          },
        },
        cleanse: {
          removes: ["poison", "disease", "curse"],
          limit: "One condition removed",
        },
      },

      specialMechanics: {
        phaseInteraction: {
          waxingMoon:
            "Healing increases to 4d8+2d6, and target gains 2d6 temporary HP (Elune's Grace passive doubled)",
          fullMoon: "Can cleanse two conditions instead of one",
          waningMoon: "Costs 1d4 less mana",
        },
      },

      tags: ["healing", "cleanse", "support", "powerful", "moonwell guardian"],
    },

    // UNIVERSAL SPELLS - Phase Manipulation
    {
      id: "lunarch_phase_shift",
      name: "Phase Shift",
      description:
        "Manually shift to any lunar phase of your choice, resetting the natural cycle.",
      spellType: "ACTION",
      icon: "Arcane/Rewind Time",
      level: 1,
      specialization: "universal",
      effectTypes: ["utility"],

      typeConfig: {
        school: "arcane",
        icon: "Arcane/Rewind Time",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },

      durationConfig: {
        durationType: "rounds",
        duration: 3,
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 8 },
        actionPoints: 1,
        components: ["verbal"],
        verbalText:
          'Choose phase name: "Luna Nova!" (New), "Luna Crescens!" (Waxing), "Luna Plena!" (Full), "Luna Decrescens!" (Waning)',
      },

      resolution: "AUTOMATIC",

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },

      effects: {
        utility: {
          phaseChange: {
            description: "Immediately shift to chosen phase",
            duration: "3 rounds before natural cycling resumes",
            choices: ["New Moon", "Waxing Moon", "Full Moon", "Waning Moon"],
          },
        },
      },

      specialMechanics: {
        phaseMechanic: {
          description: "Core ability for all Lunarchs",
          tacticalUse: "Use to adapt to changing combat situations",
          manaCost: "Significant investment - use wisely",
        },
      },

      tags: ["utility", "phase shift", "universal", "core mechanic"],
    },

    {
      id: "lunarch_moonbeam",
      name: "Moonbeam",
      description:
        "Create a beam of moonlight that follows a target, dealing damage that changes based on your current phase.",
      spellType: "ACTION",
      icon: "Healing/Prayer",
      level: 3,
      specialization: "universal",
      effectTypes: ["damage"],

      typeConfig: {
        school: "radiant",
        icon: "Healing/Prayer",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
      },

      durationConfig: {
        durationType: "rounds",
        duration: 3,
        concentration: true,
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 9 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Radius lunae!",
        somaticText: "Point at target with glowing finger",
      },

      resolution: "DICE",

      damageConfig: {
        formula: "2d6",
        elementType: "radiant",
        damageTypes: ["direct"],
        scalingType: "none",
        recurring: true,
        resolution: "DICE",
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },

      effects: {
        damage: {
          recurring: {
            formula: "2d6",
            type: "radiant",
            trigger: "Start of target turn",
            duration: 3,
          },
        },
      },

      specialMechanics: {
        phaseInteraction: {
          newMoon:
            "Damage type becomes necrotic, and you heal for half damage dealt",
          waxingMoon: "Damage increases to 2d6+1d4",
          fullMoon:
            "Damage increases to 2d6+1d6 and beam cannot be broken by movement",
          waningMoon: "Duration increases to 5 rounds",
        },
        concentration: {
          description:
            "Requires concentration - ends if you lose concentration",
          movement: "Beam follows target if they move (unless in Full Moon)",
        },
      },

      tags: [
        "radiant",
        "damage",
        "concentration",
        "phase dependent",
        "universal",
      ],
    },

    {
      id: "lunarch_lunar_cycle",
      name: "Lunar Cycle",
      description:
        "Rapidly cycle through all four lunar phases in sequence, gaining brief benefits from each.",
      spellType: "ACTION",
      icon: "Arcane/Magical Sword",
      level: 4,
      specialization: "universal",
      effectTypes: ["buff", "utility"],

      typeConfig: {
        school: "arcane",
        icon: "Arcane/Magical Sword",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },

      durationConfig: {
        durationType: "instant",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 14 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Cyclus lunaris!",
        somaticText: "Spin in place with arms extended",
      },

      resolution: "AUTOMATIC",

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 4 },

      effects: {
        multiPhase: {
          sequence: [
            "New Moon: Restore 1d4 mana, reduce next attack by 1d4",
            "Waxing Moon: Next spell deals +1d4 damage or heals +1d6",
            "Full Moon: Next attack deals +1d6 damage with +2 crit range",
            "Waning Moon: Next spell costs 1d4 less mana",
          ],
          duration: "Benefits last until used or 1 minute",
        },
      },

      specialMechanics: {
        rapidCycle: {
          description: "Gain one benefit from each phase in rapid succession",
          usage: "All benefits are active simultaneously until consumed",
          afterEffect:
            "After all benefits are consumed, return to New Moon phase",
        },
      },

      tags: ["utility", "buff", "multi phase", "universal"],
    },

    // ========================================
    // LEVEL 7 SPELLS
    // ========================================
    {
      id: "lunarch_moonbeam_barrage",
      name: "Moonbeam Barrage",
      description:
        "Fire a volley of moonlight arrows that rain down on enemies in a wide area.",
      level: 7,
      spellType: "ACTION",
      icon: "Arcane/Empowering Growth",
      specialization: "moonlight-sentinel",

      typeConfig: {
        school: "radiant",
        icon: "Arcane/Empowering Growth",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 120,
        aoeShape: "circle",
        aoeParameters: { radius: 30 },
        targetRestrictions: ["enemy"],
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 35 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "Arrows of moonlight!",
        somaticText: "Fire into sky",
      },

      resolution: "DICE",
      effectTypes: ["damage"],

      damageConfig: {
        formula: "8d6 + agility",
        elementType: "radiant",
        damageTypes: ["direct"],
        resolution: "DICE",
        savingThrow: {
          ability: "agility",
          difficultyClass: 17,
          saveOutcome: "half",
        },
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 4 },

      specialMechanics: {
        phaseInteraction: {
          fullMoon:
            "Radius increases to 40 feet and each target takes an additional +2d6 radiant damage",
          waningMoon: "Mana cost reduced by 2",
        },
      },

      tags: ["damage", "aoe", "radiant", "archery", "level 7", "lunarch"],
    },

    {
      id: "lunarch_stellar_nova",
      name: "Stellar Nova",
      description:
        "Detonate a star above enemies, dealing massive damage and blinding those who fail their save.",
      level: 7,
      spellType: "ACTION",
      icon: "Radiant/Radiant Glow",
      specialization: "starfall-invoker",

      typeConfig: {
        school: "radiant",
        icon: "Radiant/Radiant Glow",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 90,
        aoeShape: "circle",
        aoeParameters: { radius: 25 },
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 40 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "Star, explode!",
        somaticText: "Pull down celestial energy",
      },

      resolution: "DICE",
      effectTypes: ["damage", "debuff"],

      damageConfig: {
        formula: "7d10 + intelligence",
        elementType: "radiant",
        damageTypes: ["direct"],
        resolution: "DICE",
        savingThrow: {
          ability: "constitution",
          difficultyClass: 17,
          saveOutcome: "half",
        },
      },

      debuffConfig: {
        debuffType: "statusEffect",
        durationValue: 2,
        durationType: "rounds",
        durationUnit: "rounds",
        effects: [
          {
            id: "blinded",
            name: "Blinded",
            description:
              "Blinded by stellar light - disadvantage on attack rolls, cannot see",
            statusType: "blinded",
            level: "strong",
            mechanicsText:
              "Disadvantage on attack rolls for 2 rounds, constitution save DC 17 to negate",
          },
        ],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 4 },

      specialMechanics: {
        phaseInteraction: {
          fullMoon:
            "Radius increases to 30 feet and blinded duration increases to 3 rounds",
          waningMoon: "Blinded duration increases to 3 rounds",
        },
      },

      tags: ["damage", "control", "blind", "radiant", "level 7", "lunarch"],
    },

    {
      id: "lunarch_moonwell_surge",
      name: "Moonwell Surge",
      description:
        "Create a surge of healing moonlight that heals all allies in an area and cleanses harmful effects.",
      level: 7,
      spellType: "ACTION",
      icon: "Radiant/Bright Explosion",
      specialization: "moonwell-guardian",

      typeConfig: {
        school: "radiant",
        icon: "Radiant/Bright Explosion",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "circle",
        aoeParameters: { radius: 30 },
        targetRestrictions: ["ally"],
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 38 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "Moonwell, surge!",
        somaticText: "Raise staff to moon",
      },

      resolution: "DICE",
      effectTypes: ["healing", "purification"],

      healingConfig: {
        formula: "6d8 + spirit",
        healingType: "direct",
        hasHotEffect: true,
        hotFormula: "2d6",
        hotDuration: 3,
        hotTickType: "round",
      },

      purificationConfig: {
        purificationType: "cleanse",
        targetType: "area",
        power: "major",
        duration: "instant",
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 4 },

      specialMechanics: {
        phaseInteraction: {
          waxingMoon:
            "Direct healing increases to 6d8+spirit+2d6 and HOT healing increases to 2d6+1d6",
          newMoon: "All healed allies gain 2d6 temporary hit points",
          fullMoon: "Radius increases to 40 feet",
        },
      },

      tags: ["healing", "purification", "aoe", "level 7", "lunarch"],
    },

    // ========================================
    // LEVEL 8 SPELLS
    // ========================================
    {
      id: "lunarch_phase_arrow_ultimate",
      name: "Phase Arrow: Annihilation",
      description:
        "Fire an arrow that phases through all obstacles and enemies, dealing damage to everything in its path.",
      level: 8,
      spellType: "ACTION",
      icon: "Arcane/Quick Step",
      specialization: "universal",

      typeConfig: {
        school: "force",
        icon: "Arcane/Quick Step",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "line",
        rangeType: "ranged",
        rangeDistance: 200,
        aoeShape: "line",
        aoeParameters: { width: 5, length: 200 },
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 50 },
        actionPoints: 2,
        components: ["somatic"],
        somaticText: "Fire with ultimate precision",
      },

      resolution: "DICE",
      effectTypes: ["damage"],

      damageConfig: {
        formula: "10d8 + agility * 2",
        elementType: "force",
        damageTypes: ["direct"],
        specialRules:
          "Ignores cover, concealment, and armor. Hits all enemies in line.",
        resolution: "DICE",
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 5 },

      specialMechanics: {
        phaseInteraction: {
          fullMoon:
            "Damage increases to 10d8+agility*2+3d6 radiant and crit range expands by 2",
          waningMoon: "Mana cost reduced by 4",
        },
      },

      tags: ["damage", "line", "piercing", "level 8", "lunarch"],
    },

    {
      id: "lunarch_constellation_burst",
      name: "Constellation Burst",
      description:
        "Summon a constellation that fires beams of starlight at multiple targets simultaneously.",
      level: 8,
      spellType: "ACTION",
      icon: "Arcane/Magical Sword",
      specialization: "starfall-invoker",

      typeConfig: {
        school: "radiant",
        icon: "Arcane/Magical Sword",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "multi",
        rangeType: "ranged",
        rangeDistance: 90,
        maxTargets: 6,
        targetRestrictions: ["enemy"],
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 48 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "Stars, align and strike!",
        somaticText: "Draw constellation in air",
      },

      resolution: "DICE",
      effectTypes: ["damage"],

      damageConfig: {
        formula: "6d8 + intelligence",
        elementType: "radiant",
        damageTypes: ["direct"],
        specialRules:
          "Each target hit separately. Can hit same target multiple times.",
        resolution: "DICE",
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 4 },

      specialMechanics: {
        phaseInteraction: {
          fullMoon:
            "Can target up to 8 enemies instead of 6, and each beam deals +1d6 radiant damage",
          waningMoon: "Mana cost reduced by 4",
        },
      },

      tags: ["damage", "multi target", "radiant", "level 8", "lunarch"],
    },

    {
      id: "lunarch_eclipse_barrier",
      name: "Eclipse Barrier",
      description:
        "Create a barrier of eclipse energy that absorbs damage and reflects attacks.",
      level: 8,
      spellType: "REACTION",
      icon: "Force/Force Field",
      specialization: "moonwell-guardian",

      typeConfig: {
        school: "radiant",
        icon: "Force/Force Field",
        castTime: 1,
        castTimeType: "REACTION",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "circle",
        aoeParameters: { radius: 20 },
        targetRestrictions: ["ally"],
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 45 },
        actionPoints: 0,
        components: ["verbal"],
        verbalText: "Eclipse, shield us!",
      },

      resolution: "DICE",
      effectTypes: ["buff"],

      buffConfig: {
        buffType: "shield",
        effects: [
          {
            id: "eclipse_barrier",
            name: "Eclipse Barrier",
            description:
              "Absorbs up to 50 damage. Reflects 50% of absorbed damage back to attackers.",
            shieldValue: {
              formula: "50",
              shieldType: "absorption",
            },
            mechanicsText:
              "Absorbs up to 50 damage. Reflects 50% of absorbed damage back at attackers.",
          },
        ],
        durationValue: 2,
        durationType: "rounds",
        durationUnit: "rounds",
        concentrationRequired: false,
        canBeDispelled: true,
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 4 },

      specialMechanics: {
        phaseInteraction: {
          newMoon:
            "Barrier absorption increases to 75 and grants +2 Armor to allies within",
          fullMoon:
            "Reflected damage increases to 75% and barrier deals 1d6 radiant to attackers",
          waningMoon: "Duration increases to 3 rounds",
        },
      },

      tags: ["buff", "shield", "reflect", "reaction", "level 8", "lunarch"],
    },

    // ========================================
    // LEVEL 9 SPELLS
    // ========================================
    {
      id: "lunarch_moonfire_rain",
      name: "Moonfire Rain",
      description:
        "Call down a rain of moonfire that scorches enemies in a wide area. Creates a persistent zone of radiant damage.",
      level: 9,
      spellType: "ACTION",
      icon: "Arcane/Star Trail Path",
      specialization: "moonlight-sentinel",

      typeConfig: {
        school: "radiant",
        icon: "Arcane/Star Trail Path",
        castTime: 2,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 120,
        aoeShape: "circle",
        aoeParameters: { radius: 40 },
        targetRestrictions: ["enemy"],
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 65 },
        actionPoints: 3,
        components: ["verbal", "somatic"],
        verbalText: "MOONFIRE, RAIN DOWN!",
        somaticText: "Draw bow to sky",
      },

      resolution: "DICE",
      effectTypes: ["damage"],

      damageConfig: {
        formula: "12d8 + agility * 2",
        elementType: "radiant",
        damageTypes: ["direct"],
        resolution: "DICE",
        savingThrow: {
          ability: "agility",
          difficultyClass: 19,
          saveOutcome: "half",
        },
      },

      zoneConfig: {
        duration: 3,
        durationUnit: "rounds",
        effects: ["persistent_damage"],
        persistentDamage: "3d8 radiant per round",
      },

      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },

      specialMechanics: {
        phaseInteraction: {
          fullMoon:
            "Persistent damage increases to 5d8 radiant per round and radius expands to 50 feet",
          waningMoon: "Zone duration increases to 5 rounds",
        },
      },

      tags: ["damage", "aoe", "zone", "ultimate", "level 9", "lunarch"],
    },

    {
      id: "lunarch_celestial_archery",
      name: "Celestial Archery",
      description:
        "Enter a state of perfect celestial archery, channeling the full moon into your aim.",
      level: 9,
      spellType: "ACTION",
      icon: "Nature/Ethereal Bird",
      specialization: "universal",

      typeConfig: {
        school: "radiant",
        icon: "Nature/Ethereal Bird",
        castTime: 1,
        castTimeType: "BONUS",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 60 },
        actionPoints: 0,
        components: ["verbal"],
        verbalText: "Perfect aim, granted!",
      },

      resolution: "NONE",
      effectTypes: ["buff"],

      buffConfig: {
        buffType: "accuracy",
        effects: [
          {
            id: "celestial_archery",
            name: "Celestial Archery",
            description:
              "Gain advantage on all ranged attack rolls. Critical hits on 18-20. Critical hits deal double damage.",
            mechanicsText:
              "Advantage on ranged attacks. Crit on 18-20. Double damage on crits.",
          },
        ],
        durationValue: 3,
        durationType: "rounds",
        durationUnit: "rounds",
        concentrationRequired: false,
        canBeDispelled: false,
      },

      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },

      specialMechanics: {
        phaseInteraction: {
          fullMoon:
            "Critical hit range expands to 17-20 and critical hits deal triple damage instead of double",
          newMoon: "Also gain +2 Armor while active",
        },
      },

      tags: ["buff", "archery", "ultimate", "level 9", "lunarch"],
    },

    {
      id: "lunarch_full_moon_blessing",
      name: "Full Moon Blessing",
      description:
        "Invoke the full power of the full moon to empower all allies with celestial strength.",
      level: 9,
      spellType: "ACTION",
      icon: "Radiant/Divine Illumination",
      specialization: "moonwell-guardian",

      typeConfig: {
        school: "radiant",
        icon: "Radiant/Divine Illumination",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "circle",
        aoeParameters: { radius: 40 },
        targetRestrictions: ["ally"],
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 70 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "Full Moon, bless us all!",
        somaticText: "Arms raised to moon",
      },

      resolution: "DICE",
      effectTypes: ["buff", "healing"],

      buffConfig: {
        buffType: "empowerment",
        effects: [
          {
            id: "full_moon_blessing",
            name: "Full Moon Blessing",
            description:
              "All allies gain +2 to all stats, advantage on attack rolls, and deal +1d6 radiant damage on attacks",
            statModifier: {
              stat: "all_stats",
              magnitude: 2,
              magnitudeType: "flat",
            },
            mechanicsText:
              "+2 all stats, advantage on attacks, +1d6 radiant damage on attacks",
          },
        ],
        durationValue: 3,
        durationType: "rounds",
        durationUnit: "rounds",
        concentrationRequired: false,
        canBeDispelled: true,
      },

      healingConfig: {
        formula: "6d8 + spirit",
        healingType: "direct",
        hasHotEffect: false,
      },

      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },

      specialMechanics: {
        phaseInteraction: {
          fullMoon:
            "Stat bonus increases to +3 and radiant damage bonus increases to +2d6",
          waxingMoon:
            "Healing increases to 6d8+spirit+2d6 and grants 2d6 temporary HP",
        },
      },

      tags: ["buff", "healing", "aoe", "ultimate", "level 9", "lunarch"],
    },

    // ========================================
    // LEVEL 10 SPELLS
    // ========================================
    {
      id: "lunarch_avatar_of_the_moon",
      name: "Avatar of the Moon",
      description:
        "Transform into an avatar of the moon itself, gaining godlike power over moonlight and shadows.",
      level: 10,
      spellType: "ACTION",
      icon: "Radiant/Radiant Divinity",
      specialization: "universal",

      typeConfig: {
        school: "radiant",
        icon: "Radiant/Radiant Divinity",
        castTime: 2,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 100 },
        actionPoints: 3,
        components: ["verbal"],
        verbalText: "I BECOME THE MOON!",
      },

      resolution: "NONE",
      effectTypes: ["transformation"],

      transformationConfig: {
        transformationType: "celestial",
        targetType: "self",
        duration: 4,
        durationUnit: "rounds",
        power: "major",
        newForm: "Avatar of the Moon",
        description: "Become one with the moon, a being of pure moonlight.",
        grantedAbilities: [
          {
            id: "lunar_stats",
            name: "Lunar Enhancement",
            description: "+5 to all attributes, +5 armor",
          },
          {
            id: "lunar_damage",
            name: "Moonlight Empowerment",
            description: "+50% damage on all attacks",
          },
          {
            id: "lunar_immunity",
            name: "Celestial Immunity",
            description: "Immune to radiant and necrotic damage",
          },
          {
            id: "moonlight_phase",
            name: "Moonlight Phasing",
            description:
              "Can phase through solid objects, immune to opportunity attacks",
          },
          {
            id: "lunar_flight",
            name: "Lunar Gravity",
            description: "Gain 60ft flying speed",
          },
          {
            id: "lunar_exhaustion",
            name: "Lunar Drain (On End)",
            description: "Gain 2 levels of exhaustion when transformation ends",
          },
        ],
        concentrationRequired: false,
        canBeDispelled: false,
      },

      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },

      specialMechanics: {
        phaseInteraction: {
          fullMoon:
            "Damage bonus increases to +75% and gain immunity to all damage for 1 round",
          newMoon:
            "Armor bonus increases to +8 and gain resistance to necrotic damage",
          waxingMoon: "Allies within 30 feet gain half your buff benefits",
          waningMoon: "Transformation duration increases to 5 rounds",
        },
      },

      tags: ["transformation", "ultimate", "level 10", "lunarch"],
    },

    {
      id: "lunarch_arrow_of_annihilation",
      name: "Arrow of Annihilation",
      description:
        "Fire the ultimate arrow - a bolt of pure moonlight that annihilates everything in its path.",
      level: 10,
      spellType: "ACTION",
      icon: "Radiant/Divine Blessing",
      specialization: "moonlight-sentinel",

      typeConfig: {
        school: "radiant",
        icon: "Radiant/Divine Blessing",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "line",
        rangeType: "ranged",
        rangeDistance: 500,
        aoeShape: "line",
        aoeParameters: { width: 10, length: 500 },
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 100 },
        actionPoints: 3,
        components: ["somatic"],
        somaticText: "Draw bow with all your might",
      },

      resolution: "DICE",
      effectTypes: ["damage"],

      damageConfig: {
        formula: "20d6 + agility",
        elementType: "radiant",
        damageTypes: ["direct"],
        resolution: "DICE",
        savingThrow: {
          ability: "agility",
          difficultyClass: 22,
          saveOutcome: "half",
        },
        specialRules:
          "Ignores resistance to radiant damage. Destroys unattended objects in path.",
      },

      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },

      specialMechanics: {
        phaseInteraction: {
          fullMoon:
            "Damage increases to 20d6+agility+4d6 and crit range expands to 18-20",
          waningMoon: "Mana cost reduced by 10",
        },
      },

      tags: ["damage", "line", "ultimate", "level 10", "lunarch"],
    },

    {
      id: "lunarch_eternal_moonwell",
      name: "Eternal Moonwell",
      description:
        "Create an eternal moonwell that continuously heals allies and damages enemies within it for the rest of combat.",
      level: 10,
      spellType: "ACTION",
      icon: "Healing/Heart Ripple",
      specialization: "moonwell-guardian",

      typeConfig: {
        school: "radiant",
        icon: "Healing/Heart Ripple",
        castTime: 2,
        castTimeType: "IMMEDIATE",
      },

      targetingMode: "effect",
      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 60,
        aoeShape: "circle",
        aoeParameters: { radius: 30 },
      },

      effectTargeting: {
        healing: {
          targetingType: "area",
          rangeType: "ranged",
          rangeDistance: 60,
          aoeShape: "circle",
          aoeParameters: { radius: 30 },
          targetRestrictions: ["ally"],
          description: "All allies in the moonwell zone are healed each round",
        },
        damage: {
          targetingType: "area",
          rangeType: "ranged",
          rangeDistance: 60,
          aoeShape: "circle",
          aoeParameters: { radius: 30 },
          targetRestrictions: ["enemy"],
          description:
            "All enemies in the moonwell zone take radiant damage each round",
        },
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 100 },
        actionPoints: 3,
        components: ["verbal", "somatic"],
        verbalText: "ETERNAL MOONWELL, ARISE!",
        somaticText: "Draw power from moon",
      },

      resolution: "DICE",
      effectTypes: ["utility", "healing", "damage"],

      zoneConfig: {
        duration: 0,
        durationUnit: "combat",
        effects: ["healing", "damage", "purification"],
        movable: false,
        size: { radius: 30 },
      },

      healingConfig: {
        formula: "4d8 + spirit",
        healingType: "hot",
        hasHotEffect: true,
        hotFormula: "4d8",
        hotDuration: 0,
        hotTickType: "round",
        targetRestrictions: ["ally"],
        description: "Heals all allies in zone each round for rest of combat",
      },

      damageConfig: {
        formula: "3d8",
        elementType: "radiant",
        damageTypes: ["persistent"],
        targetRestrictions: ["enemy"],
        description: "Damages all enemies in zone each round",
        resolution: "DICE",
      },

      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },

      specialMechanics: {
        phaseInteraction: {
          fullMoon:
            "Enemy damage increases to 5d8 radiant and radius expands to 40 feet",
          waxingMoon:
            "Healing increases to 4d8+2d6 and cleanses one condition per round",
          newMoon: "Allies in zone gain +2 Armor",
          waningMoon: "Enemy damage applies a 1-round slow debuff",
        },
      },

      tags: ["zone", "healing", "damage", "ultimate", "level 10", "lunarch"],
    },

    // ADDITIONAL LEVEL 1 SPELLS
    {
      id: "lunarch_moonlight_bolt",
      name: "Moonlight Bolt",
      description:
        "Fire a bolt of concentrated moonlight at a target, dealing radiant damage.",
      level: 1,
      spellType: "ACTION",
      icon: "Arcane/Star Trail Path",
      effectTypes: ["damage"],

      typeConfig: {
        school: "radiant",
        icon: "Arcane/Star Trail Path",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 40,
        targetRestrictions: ["enemy"],
        maxTargets: 1,
      },

      damageConfig: {
        formula: "1d8",
        elementType: "radiant",
        damageTypes: ["direct"],
        resolution: "DICE",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: {
          mana: 4,
        },
        actionPoints: 1,
        components: ["verbal", "somatic"],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },

      resolution: "DICE",

      specialMechanics: {
        phaseInteraction: {
          newMoon:
            "Damage type becomes necrotic, and you heal for half damage dealt",
          waxingMoon: "Add +1d4 radiant damage",
          fullMoon: "Add +1d6 radiant damage",
          waningMoon: "Costs 1d4 less mana (minimum 1)",
        },
      },

      tags: ["damage", "radiant", "moonlight", "universal"],
    },

    {
      id: "lunarch_minor_blessing",
      name: "Minor Blessing",
      description: "Bless an ally with lunar power, healing them.",
      level: 1,
      spellType: "ACTION",
      icon: "Healing/Prayer",
      effectTypes: ["healing"],

      typeConfig: {
        school: "radiant",
        icon: "Healing/Prayer",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
        targetRestrictions: ["ally"],
        maxTargets: 1,
      },

      healingConfig: {
        formula: "1d8 + spirit",
        healingType: "single_target",
        targetRestrictions: ["ally"],
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: {
          mana: 4,
        },
        actionPoints: 1,
        components: ["verbal", "somatic"],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },

      resolution: "DICE",

      specialMechanics: {
        phaseInteraction: {
          waxingMoon:
            "Healing increases to 1d8+spirit+1d4 and grants 1d4 temporary HP",
          fullMoon: "Healing increases to 1d8+spirit+1d6",
          newMoon: "Also grants +1 Armor for 1 round",
        },
      },

      tags: ["healing", "blessing", "minor blessing", "universal"],
    },

    // ADDITIONAL LEVEL 2 SPELLS
    {
      id: "lunarch_phase_step",
      name: "Phase Step",
      description:
        "Shift through phases of the moon to teleport up to 30 feet.",
      level: 2,
      spellType: "ACTION",
      icon: "Nature/Ethereal Bird",
      effectTypes: ["utility"],

      typeConfig: {
        school: "arcane",
        icon: "Nature/Ethereal Bird",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },

      utilityConfig: {
        utilityType: "movement",
        selectedEffects: [
          {
            id: "phase_shift",
            name: "Phase Shift",
            distance: 30,
            needsLineOfSight: false,
          },
        ],
        duration: 0,
        durationUnit: "instant",
        concentration: false,
        power: "moderate",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: {
          mana: 8,
        },
        actionPoints: 1,
        components: ["verbal"],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },

      resolution: "DICE",

      specialMechanics: {
        phaseInteraction: {
          newMoon:
            "Teleport range increases to 45 feet and you become invisible until end of turn",
          waxingMoon: "After teleporting, heal yourself for 1d6",
          fullMoon:
            "After teleporting, gain advantage on your next attack roll",
          waningMoon: "Costs 1d4 less mana (minimum 1)",
        },
      },

      tags: ["utility", "teleport", "movement", "universal"],
    },

    {
      id: "lunarch_crescent_strike",
      name: "Crescent Strike",
      description:
        "Strike with a crescent moon blade of lunar energy that deals radiant damage.",
      level: 2,
      spellType: "ACTION",
      icon: "Arcane/Magical Cross Emblem 2",
      effectTypes: ["damage"],

      typeConfig: {
        school: "radiant",
        icon: "Arcane/Magical Cross Emblem 2",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "melee",
        rangeDistance: 10,
        targetRestrictions: ["enemy"],
        maxTargets: 1,
      },

      damageConfig: {
        formula: "2d8",
        elementType: "radiant",
        damageTypes: ["direct"],
        resolution: "DICE",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: {
          mana: 8,
        },
        actionPoints: 1,
        components: ["somatic"],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },

      resolution: "DICE",

      specialMechanics: {
        phaseInteraction: {
          newMoon:
            "Damage type becomes arcane, and target has disadvantage on next attack roll",
          waxingMoon: "Add +1d4 radiant damage",
          fullMoon: "Add +1d6 radiant damage and increase crit range by 1",
          waningMoon: "Costs 1d4 less mana (minimum 1)",
        },
      },

      tags: ["damage", "radiant", "arcane", "crescent", "universal"],
    },

    // ADDITIONAL LEVEL 4 SPELL
    {
      id: "lunarch_lunar_chains",
      name: "Lunar Chains",
      description:
        "Bind an enemy with chains of moonlight, restraining them for 3 rounds.",
      level: 4,
      spellType: "ACTION",
      icon: "Frost/Confused",
      effectTypes: ["control"],

      typeConfig: {
        school: "radiant",
        icon: "Frost/Confused",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 40,
        targetRestrictions: ["enemy"],
        maxTargets: 1,
      },

      controlConfig: {
        controlType: "restraint",
        duration: 3,
        durationUnit: "rounds",
        saveDC: 15,
        saveType: "strength",
        savingThrow: true,
        effects: [
          {
            id: "lunar_chains",
            name: "Lunar Chains",
            description:
              "Restrained by moonlight chains - cannot move or take actions",
            config: {
              restraintType: "magical_bind",
              saveType: "charisma",
              saveDC: 17,
              duration: 3,
              durationUnit: "rounds",
              immobilize: true,
            },
          },
        ],
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: {
          mana: 15,
        },
        actionPoints: 1,
        components: ["verbal", "somatic"],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },

      resolution: "DICE",

      specialMechanics: {
        phaseInteraction: {
          newMoon: "Chains also drain 1d4 mana from the target each round",
          waxingMoon: "Target has disadvantage on the initial saving throw",
          fullMoon:
            "Restrained duration increases to 4 rounds, and chains deal 1d6 radiant damage per round",
          waningMoon: "Costs 1d4 less mana (minimum 1)",
        },
      },

      tags: ["control", "restrain", "moonlight", "universal"],
    },

    // ADDITIONAL LEVEL 5 SPELL
    {
      id: "lunarch_full_moon_radiance",
      name: "Full Moon Radiance",
      description: "Channel the full moon to heal all allies in a radius.",
      level: 5,
      spellType: "ACTION",
      icon: "Arcane/Star Trail Path",
      effectTypes: ["healing"],

      typeConfig: {
        school: "radiant",
        icon: "Arcane/Star Trail Path",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "circle",
        aoeParameters: { radius: 20 },
        targetRestrictions: ["ally"],
      },

      healingConfig: {
        formula: "5d8 + spirit",
        healingType: "aoe",
        targetRestrictions: ["ally"],
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: {
          mana: 18,
        },
        actionPoints: 2,
        components: ["verbal", "somatic"],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 4 },

      resolution: "DICE",

      specialMechanics: {
        phaseInteraction: {
          newMoon: "Healing also grants each ally 1d4 temporary hit points",
          waxingMoon:
            "Healing increases to 5d8+spirit+1d6, and targets are cleansed of one poison or disease",
          fullMoon: "Radius increases to 30 feet",
          waningMoon: "Costs 1d4 less mana (minimum 1)",
        },
      },

      tags: ["healing", "aoe", "full moon", "universal"],
    },

    // ADDITIONAL LEVEL 6 SPELL
    {
      id: "lunarch_eclipse_burst",
      name: "Eclipse Burst",
      description:
        "Create an eclipse that deals massive radiant damage to all enemies in an area.",
      level: 6,
      spellType: "ACTION",
      icon: "Void/Consumed by Void",
      effectTypes: ["damage"],

      typeConfig: {
        school: "radiant",
        icon: "Void/Consumed by Void",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 50,
        aoeShape: "circle",
        aoeParameters: { radius: 25 },
        targetRestrictions: ["enemy"],
      },

      damageConfig: {
        formula: "6d10 + spirit",
        elementType: "radiant",
        damageTypes: ["area"],
        savingThrow: {
          ability: "constitution",
          difficultyClass: 17,
          saveOutcome: "half",
        },
        criticalConfig: {
          enabled: true,
          critType: "dice",
          critMultiplier: 2.0,
          extraDice: "3d10",
          critEffects: ["radiant_burn"],
        },
        resolution: "DICE",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: {
          mana: 22,
        },
        actionPoints: 2,
        components: ["verbal", "somatic"],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 5 },

      resolution: "DICE",

      specialMechanics: {
        phaseInteraction: {
          newMoon:
            "Eclipse becomes a void eclipse - damage type changes to necrotic and enemies are weakened (-2 to attack rolls) for 1 round",
          waxingMoon: "Allies in the area are healed for 2d6",
          fullMoon:
            "Radius increases to 30 feet, and critical hit extra dice increase to 5d10",
          waningMoon: "Costs 1d4 less mana (minimum 1)",
        },
      },

      tags: ["damage", "radiant", "aoe", "eclipse", "universal"],
    },
  ],
};
