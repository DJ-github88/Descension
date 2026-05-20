export const BLADEDANCER_DATA = {
  id: "bladedancer",
  name: "Bladedancer",
  icon: "fas fa-biohazard",
  role: "Damage",
  damageTypes: ["slashing", "necrotic", "piercing"],

  overview: {
    title: "The Bladedancer",
    subtitle: "The Flayed Dervish",

    quickOverview: {
      title: "Quick Overview",
      content: `**What You Need to Know**: The Bladedancer flows between 6 agonizing Mutilation States (Ataxic Tremor, Arterial Focus, Centrifugal Flay, Deadened Nerve, Total Dislocation, Void Collapse), each offering horrifying physical alterations and mechanics. You build Momentum through frantic attacks and spend it to contort between states.
      
**Core Mechanic**: Infinite, unmitigated combo chaining. You build Momentum to vibrate your blades at impossible speeds, bypassing heavy Armor entirely.

**Resources**: Momentum (0-20, builds/decays during combat) & Trauma Tokens (persistent physical tolls traded for ultimates).

**Playstyle**: Relentless, terrifying striker. High risk, visceral momentum-based economy heavily reliant on positioning and absolute freedom of movement.

**Best For**: Players who enjoy razor's-edge resource management, stance-dancing, and dissecting heavily armored targets.`,
    },

    description: `A tragic dirge written in severed flesh and shattered bone. The Bladedancer is no elegant artist; they are an atrocity of alchemy and surgical mutilation. To achieve their hyper-accelerated momentum, they have flayed away their own limitations, destroying their joints to move at velocities the human body was never meant to withstand.`,

    roleplayIdentity: {
      title: "Roleplay Identity",
      content: `In the grimdark reality of Mythrill, the "Flayed Dervishes" are pitied as much as they are feared. They are outcasts who traded their sanity, humanity, and physical wholeness for unparalleled, unstoppable speed. They feel no pain while moving—only the frantic, agonizing need to maintain their momentum.

- **The Mutilated Survivor**: Someone who broke their own body to escape a greater horror.
- **The Alchemic Test Subject**: A tragic figure pumped full of sensory-depriving venom by a mad apothecary.
- **The Doomed Striker**: Knowing their heart will eventually rupture from the strain, they fight with nothing to lose.`,
    },

    combatRole: {
      title: "Combat Role",
      content: `**Why Bring Me?**: Infinite, unmitigated combo chaining. The Bladedancer is the only class capable of stacking infinite momentum to completely bypass heavy Armor ratings without triggering damage reduction. Their blades seek the microscopic gaps in full plate, shredding impenetrable foes.

**The Fatal Flaw (Momentum Dependency)**: They possess zero base Armor and suffer a catastrophic 100% vulnerability to guaranteed, unavoidable AoE damage. If their movement speed is ever reduced to 0 (by roots, grapples, or ice magic), their combo shatters. Their resource plummets to zero, and the hyper-accelerated strain on their heart causes severe internal necrotic and bleed damage. Rooting a Bladedancer is a death sentence.`,
    },

    playstyle: {
      title: "Playstyle & Strategy",
      content: `Playing a Bladedancer is about managing your own biological breakdown across 6 Mutilation States:

**Mutilation Network Navigation**:
- **Ataxic Tremor** (Start): Defensive spasms, transitions to Arterial Focus, Void Collapse, or Total Dislocation.
- **Arterial Focus**: Precision vitals, transitions to Centrifugal Flay, Deadened Nerve, or Ataxic Tremor.
- **Centrifugal Flay**: Torn-muscle AoE, transitions to Total Dislocation or Deadened Nerve.
- **Deadened Nerve**: Pain-receptor shutdown (Counter), transitions to Arterial Focus or Ataxic Tremor.
- **Total Dislocation** (Hub): Complete bodily breakdown, can transition to ANY state (costs 4 Momentum).
- **Void Collapse**: Impossible velocity (Stealth), transitions to Arterial Focus or Total Dislocation.

**Momentum Management**:
- Build: +1 per hit, +2 per crit, +1 per dodge/parry
- Decay: -1 per miss or taking damage
- Spend: 2-4 for state changes, 3-6 for abilities
- Strategy: Maintain 6+ Momentum or your heart will begin to fail.

Never stop moving. Avoid crowd control at all costs. Operational friction requires you to sacrifice Max HP to cleanse roots.`,
    },

    immersiveCombatExample: {
      title: "Combat Example: The Slaughter at Crimson Bridge",
      content: `**The Setup**: You face a rival duelist on a narrow bridge. He's a brute—all power, no finesse. You'll show him what true anatomical horror looks like.

**Turn 1 - Reading the Opponent (Momentum: 0 → 3)**
*You force your body into Ataxic Tremor—muscles violently spasming, blade twitching. He charges.*
Enemy attacks → You spasm out of the way (Ataxic Tremor passive: +2 Dodge) → You follow up with Frantic Laceration!
**Momentum**: +2 (now at 2)

*You snap your own shoulder out of its socket to swing again.*
Attack → Hit! **Momentum**: +1 (now at 3)

**Turn 2 - Shifting to Offense (State: Ataxic Tremor → Arterial Focus)**
*Time to punish his recklessness.*
**Transition**: Ataxic Tremor → Arterial Focus (costs 2 Momentum)
**Momentum**: 3 - 2 = 1
*You pump pure adrenaline into your veins. Your vision narrows to his exposed arteries.*
Attack → Hit! **Momentum**: +1 (now at 2)
Attack → CRITICAL HIT! **Momentum**: +2 (now at 4)

**Turn 3 - The Dissection**
*You vibrate your blade at a frequency that ignores his plate armor.*
**Action**: Kinetic Dissection (costs 1 Momentum).
**Momentum**: 4 - 1 = 3.
*The blade slides into the microscopic gap at his neck. Armor is completely bypassed. He bleeds out, unable to comprehend the speed of his own death.*`,
    },
  },

  resourceSystem: {
    title: "Momentum & Trauma System",
    description: "A dual-resource system tracking kinetic rhythm (Momentum) and permanent physical toll (Trauma Tokens).",

    cards: [
      {
        title: "Momentum (Primary)",
        stats: "0-20 Capacity",
        details: "Tracks your immediate kinetic heartbeat. Generated by successful hits/defenses, lost via misses/damage/idle turns, and spent on mutilations/abilities. Plummets to 0 if Rooted.",
      },
      {
        title: "Trauma Tokens (Secondary)",
        stats: "0-5 Tokens",
        details: "Represents permanent physical damage traded for ultimate power. Earned by performing State Signature Moves (★). Persists between combats.",
      },
    ],

    generationTable: {
      headers: ["Action", "Momentum Change", "Trauma Change"],
      rows: [
        ["Successful Attack", "+1", "0"],
        ["Critical Hit", "+2", "0"],
        ["Dodge/Parry", "+1", "0"],
        ["Miss Attack", "-1", "0"],
        ["Take Damage", "-1", "0"],
        ["Movement Speed = 0 (Rooted)", "Drops to 0", "0"],
        ["Signature Move (★)", "-Cost", "+1"],
        ["Extended Rest", "Reset to 0", "Reset to 0"],
      ],
    },

    usage: {
      momentum: "Used for Mutilation State transitions (2-4 cost) and active ability costs (3-6 cost).",
      trauma: "Used exclusively for Ultimate Abilities (2-5 cost) to unleash peak anatomical destruction.",
    },

    stanceNetworkTable: {
      title: "Mutilation State Network",
      description: "You must violently contort your body to transition between these states.",
      headers: ["State", "Type", "Passive Effects", "Can Transition To", "Transition Cost"],
      rows: [
        ["Ataxic Tremor", "Defensive/Spasmodic", "+2 dodge, +10 ft movement, advantage on Disengage", "Arterial Focus, Void Collapse, Total Dislocation", "2 Momentum"],
        ["Arterial Focus", "Offensive/Precision", "+2 to attack rolls, increased crit chance", "Centrifugal Flay, Deadened Nerve, Ataxic Tremor", "2 Momentum"],
        ["Centrifugal Flay", "AoE/Multi-target", "Attacks can cleave to adjacent enemies", "Total Dislocation, Deadened Nerve", "3 Momentum"],
        ["Deadened Nerve", "Defensive/Counter", "Ignore non-lethal pain, can use reaction to parry", "Arterial Focus, Ataxic Tremor", "2 Momentum"],
        ["Total Dislocation", "Balanced/Versatile", "Break all limiters. +1 to all rolls, can chain abilities", "ANY state (universal hub)", "4 Momentum"],
        ["Void Collapse", "Stealth/Burst", "Impossible velocity. Advantage on first attack, +2d6 damage", "Arterial Focus, Total Dislocation", "3 Momentum"],
      ],
    },
  },

  characterCreation: {
    title: "Character Creation",
    subtitle: "Beginning Your Agony",
    description: `Every Bladedancer begins their journey the same way — in Ataxic Tremor, blade twitching in hand, ready to sacrifice flesh for speed.`,
    steps: [
      {
        title: "Choose Your Starting State",
        content: "All Bladedancers begin combat in **Ataxic Tremor** — the spasmodic foundation from which all other mutilations flow.",
      },
      {
        title: "Understand Your Resources",
        content: "**Momentum** builds during combat and resets each fight. **Trauma** persists between fights but resets after an extended rest. If your movement is ever reduced to 0, you will die.",
      },
      {
        title: "Pick Your Equipment",
        content: "Bladedancers favor light, agile weapons and minimal armor. Your speed IS your defense. You possess 0 base armor inherently.",
      },
    ],
    equipment: {
      weapons: [
        { name: "Twin Flaying Blades", damage: "1d8 slashing (each)", description: "Paired surgical blades designed for infinite combo cuts" },
        { name: "Serrated Saber", damage: "1d8 slashing", description: "A blade meant to rip veins and tear muscle" },
      ],
      armor: { name: "Alchemical Bandages", description: "Provides 0 Armor. Bladedancers cannot wear armor due to their hyper-kinetic swelling and contortions." },
      gear: [
        "Apothecary's Venom Vials — sensory depriving agents",
        "20 Momentum Trackers (blue) — for tracking heartbeat rhythm",
        "5 Trauma Tokens (red) — for tracking permanent physical toll",
      ],
      startingGold: 15,
    },
  },

  specializations: {
    title: "Mutilation Paths",
    subtitle: "Three Paths of Anatomical Destruction",
    description: `Bladedancers can specialize in different forms of bodily destruction.`,
    passiveAbility: {
      name: "The Flayed Truth (Fatal Flaw)",
      description: "You have 0 base Armor and suffer 100% vulnerability to unavoidable AoE damage. If your movement speed is ever reduced to 0 (Rooted/Grappled), your heart strains, resetting Momentum to 0 and causing 1d10 Necrotic damage per round.",
    },
    specs: [
      {
        name: "Flesh-Torn Dervish",
        icon: "fas fa-wind",
        color: "#8B0000",
        theme: "Alchemical Horror",
        playstyle: "Chain rapid state transitions for devastating combo attacks. You are never locked into one form.",
        description: "Masters of rapid joint dislocation and combo chains.",
        strengths: ["Fastest transitions (-1 cost to all)", "Highest Trauma generation via frequent state changes", "Strongest sustained damage through combo chains"],
        weaknesses: ["Reliant on Momentum economy", "Vulnerable during transition turns", "Highest self-inflicted damage"],
        keyAbilities: [
          { name: "Violent Contortions", type: "Passive", cost: "None", description: "All state transitions cost 1 less Momentum. Next attack gains +1d6 damage." },
          { name: "Arterial Combo", type: "Action", cost: "2 AP, 6 Momentum", description: "4d6 + AGI×1.5, 3× crit multiplier" },
        ],
        passiveAbility: { name: "Violent Contortions", description: "All state transitions cost 1 less Momentum. When you change states, your next attack gains +1d6 damage." },
        talentTreeSummary: [
          { name: "Momentum Spasm", description: "Reduces transition costs, slows Momentum decay." },
          { name: "Alchemic Current", description: "Swift transitions with bonus Momentum." },
        ],
      },
      {
        name: "Nerve-Dead Duelist",
        icon: "fas fa-skull",
        color: "#27AE60",
        theme: "Precision Butchery",
        playstyle: "Dominate single targets through expanded critical ranges and devastating counter-attacks.",
        description: "Masters of precision strikes and pain-ignoring counter-attacks.",
        strengths: ["Expanded critical hit range", "Devastating counter-attacks", "Strongest single-target burst"],
        weaknesses: ["Only buffs 2 of 6 states", "Weak against multiple enemies", "Requires enemy to attack you"],
        keyAbilities: [
          { name: "Surgical Precision", type: "Passive", cost: "None", description: "+2 attack rolls in Arterial/Deadened state. Reroll 1s." },
          { name: "Unfeeling Riposte", type: "Reaction", cost: "4 Momentum", description: "3d8 + AGI counter-attack, ignoring pain." },
        ],
        passiveAbility: { name: "Surgical Precision", description: "While in Arterial Focus or Deadened Nerve state, gain +2 to attack rolls and increased critical hit chance. Reroll damage dice showing 1." },
        talentTreeSummary: [
          { name: "Precision Edge", description: "Expands critical hit range." },
          { name: "Perfect Timing", description: "Reaction attacks triggered by enemy actions." },
        ],
      },
      {
        name: "Void Walker",
        icon: "fas fa-user-ninja",
        color: "#2C3E50",
        theme: "Stealth & Burst",
        playstyle: "Move so fast you become invisible, striking from nothingness.",
        description: "Masters of stealth and burst damage, tearing reality with speed.",
        strengths: ["Can enter Void Collapse from ANY state", "Highest single-strike burst damage", "Invisibility and teleportation"],
        weaknesses: ["Relies on stealth", "Vulnerable when speed is broken", "Massive resource investment"],
        keyAbilities: [
          { name: "Void Affinity", type: "Passive", cost: "None", description: "Enter Void Collapse from any state for 3 Momentum. +1d6 damage from stealth." },
          { name: "Velocity Strike", type: "Action", cost: "4 Momentum", description: "Teleport to target, attack with 1d8 + AGI + 3d6 damage" },
        ],
        passiveAbility: { name: "Void Affinity", description: "You can enter Void Collapse state from any state for 3 Momentum. While in Void Collapse, you are lightly obscured and deal +1d6 damage." },
        talentTreeSummary: [
          { name: "Void Essence", description: "Generate bonus Trauma from stealth attacks." },
          { name: "Velocity Cloak", description: "Enhanced stealth with massive burst damage." },
        ],
      },
    ],
  },

  spells: [
    // ========================================
    // LEVEL 1 SPELLS - The Core Engine
    // ========================================
    {
      id: "bladedancer_the_flayed_truth",
      name: "The Flayed Truth (Fatal Flaw)",
      description: "Your body is a broken machine forced to run at impossible speeds. You possess 0 base Armor and suffer catastrophic 100% vulnerability to unavoidable AoE damage. If your movement speed is ever reduced to 0 (Rooted/Grappled), your heart strains, resetting Momentum to 0 and causing severe internal damage.",
      level: 1,
      spellType: "PASSIVE",
      icon: "Healing/Red Heart",
      typeConfig: { school: "physical", icon: "Healing/Red Heart", tags: ["passive", "fatal-flaw", "vulnerability"], castTime: 0, castTimeType: "PASSIVE" },
      targetingConfig: { targetingType: "self", rangeType: "self" },
      resourceCost: { actionPoints: 0 },
      resolution: "NONE",
      effectTypes: ["debuff"],
      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          { id: "aoe_vulnerability", name: "Hyper-Accelerated Metabolism", description: "Takes 100% extra damage from unavoidable AoE.", statusEffect: { type: "vulnerability", vulnerabilityType: "aoe", percentage: 100, trigger: "unavoidable_aoe" } },
          { id: "momentum_withdrawal", name: "Momentum Withdrawal", description: "If Rooted or Grappled, Momentum drops to 0 and take 1d10 Necrotic Bleed per round.", statusEffect: { type: "condition_trigger", trigger: "movement_zero", resourceDrain: { momentum: "all" }, damage: "1d10 necrotic" } }
        ],
        durationValue: 0, durationType: "permanent"
      },
      tags: ["passive", "fatal-flaw", "starter", "bladedancer"]
    },

    {
      id: "bladedancer_kinetic_dissection",
      name: "Kinetic Dissection (Unique Utility)",
      description: "By expending Momentum, you vibrate your blade at speeds that slide into the microscopic gaps of heavy Armor. You may attack endlessly as long as you have Momentum to burn.",
      level: 1,
      spellType: "ACTION",
      icon: "Slashing/Bloody Slash",
      typeConfig: { school: "slashing", icon: "Slashing/Bloody Slash", tags: ["melee", "damage", "combo", "armor_bypass", "starter"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "single", rangeType: "melee", rangeDistance: 5, targetRestrictions: ["enemy"] },
      resourceCost: { actionPoints: 1, resourceTypes: ["momentum"], resourceValues: { momentum: 1 }, components: ["somatic"], somaticText: "Vibrate blade past armor" },
      resolution: "DICE",
      effectTypes: ["damage"],
      damageConfig: {
        formula: "1d8 + agility",
        elementType: "slashing",
        damageTypes: ["slashing"],
        canCrit: true,
        critMultiplier: 2,
        armorPenetration: "100%",
        description: "Bypasses all Armor. If this attack lands, you may immediately cast Kinetic Dissection again for 0 Action Points by spending 1 additional Momentum.",
        resolution: "DICE"
      },
      tags: ["melee", "combo", "armor-bypass", "starter", "bladedancer"]
    },

    {
      id: "bladedancer_frantic_laceration",
      name: "Frantic Laceration",
      description: "A hyper-kinetic, traumatic bodily slash that builds the necessary momentum to keep your heart from bursting.",
      level: 1,
      spellType: "ACTION",
      icon: "Slashing/Quick Slash",
      typeConfig: { school: "slashing", icon: "Slashing/Quick Slash", tags: ["melee", "damage", "momentum_generation", "starter"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "single", rangeType: "melee", rangeDistance: 5, targetRestrictions: ["enemy"] },
      resourceCost: { actionPoints: 1, components: ["somatic"] },
      resolution: "DICE",
      effectTypes: ["damage"],
      damageConfig: {
        formula: "1d6 + agility",
        elementType: "slashing",
        damageTypes: ["slashing"],
        canCrit: true,
        critMultiplier: 2,
        description: "Precise strike that builds combat rhythm and Momentum.",
        resolution: "DICE"
      },
      momentumGain: 2,
      tags: ["melee", "damage", "momentum_generation", "starter", "bladedancer"]
    },

    {
      id: "bladedancer_mutilation_shift",
      name: "Mutilation Shift",
      description: "Snap your own joints to violently shift your center of gravity, forcing your body into a new horrific posture (Mutilation State).",
      level: 1,
      spellType: "ACTION",
      icon: "Necrotic/Crossed Bones",
      typeConfig: { school: "physical", icon: "Necrotic/Crossed Bones", tags: ["utility", "stance", "transition", "starter"], castTime: 0, castTimeType: "FREE" },
      targetingConfig: { targetingType: "self", rangeType: "self" },
      resourceCost: { actionPoints: 0, resourceTypes: ["momentum"], resourceValues: { momentum: 2 } },
      resolution: "NONE",
      effectTypes: ["utility"],
      utilityConfig: {
        utilityType: "stance_change",
        selectedEffects: [{ id: "stance_transition", name: "State Transition", description: "Change to a connected state in the network, gaining its passive effects" }],
        duration: 0, durationUnit: "permanent"
      },
      tags: ["utility", "stance", "transition", "starter", "bladedancer"]
    },

    // ========================================
    // LEVEL 2 SPELLS - State-Locked Abilities (Ataxic Tremor & Arterial Focus)
    // ========================================

    {
      id: "bladedancer_ataxic_spasm",
      name: "Ataxic Spasm",
      description: "Violently contort your spine to avoid a blow, turning near-death into kinetic fuel. Automatically dodge the next attack.",
      level: 2,
      spellType: "ACTION",
      icon: "Utility/Deflecting Shield",
      typeConfig: { school: "physical", icon: "Utility/Deflecting Shield", tags: ["defense", "dodge", "momentum_generation", "stance_ataxic_tremor"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "self", rangeType: "self" },
      resourceCost: { actionPoints: 1, resourceTypes: ["momentum"], resourceValues: { momentum: 3 } },
      resolution: "NONE",
      effectTypes: ["buff"],
      buffConfig: {
        buffType: "statusEffect",
        effects: [{ id: "ataxic_dodge", name: "Spasmodic Dodge", description: "Automatically dodge next attack. Gain +2 Momentum on success.", statusType: "dodge" }],
        durationValue: 1, durationType: "rounds"
      },
      stanceRequirement: "ataxic_tremor",
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },
      tags: ["defense", "dodge", "stance_ataxic_tremor", "bladedancer"]
    },

    {
      id: "bladedancer_arterial_puncture",
      name: "Arterial Puncture",
      description: "Thrust with bone-shattering speed, ignoring the agonizing recoil to sever a major artery.",
      level: 2,
      spellType: "ACTION",
      icon: "Piercing/Piercing Thrust",
      typeConfig: { school: "piercing", icon: "Piercing/Piercing Thrust", tags: ["melee", "damage", "precision", "bleed", "stance_arterial_focus"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "single", rangeType: "melee", rangeDistance: 5, targetRestrictions: ["enemy"] },
      resourceCost: { actionPoints: 1, resourceTypes: ["momentum"], resourceValues: { momentum: 4 } },
      resolution: "DICE",
      effectTypes: ["damage", "debuff"],
      damageConfig: {
        formula: "1d8 + agility + 1d8",
        elementType: "piercing",
        damageTypes: ["piercing"],
        canCrit: true, critMultiplier: 2,
        resolution: "DICE"
      },
      debuffConfig: {
        debuffType: "statusEffect",
        effects: [{ id: "arterial_bleed", name: "Arterial Bleed", description: "Target takes 1d6 Bleed damage per round.", statusType: "bleeding", damagePerTurn: "1d6" }],
        durationValue: 3, durationType: "rounds",
        savingThrow: { ability: "constitution", difficultyClass: 14, saveOutcome: "reduced_duration" }
      },
      stanceRequirement: "arterial_focus",
      tags: ["melee", "damage", "bleed", "stance_arterial_focus", "bladedancer"]
    },

    {
      id: "bladedancer_alchemic_purge",
      name: "Alchemic Purge",
      description: "When the body is trapped, you snap your own joints and flood your veins with corrosive adrenaline to break free. The pain is unimaginable, but stopping is death.",
      level: 2,
      spellType: "ACTION",
      icon: "Slashing/Bloody Slash",
      typeConfig: { school: "necrotic", tags: ["cleanse", "self_damage", "friction"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "self", rangeType: "self" },
      resourceCost: { actionPoints: 1, resourceTypes: ["momentum"], resourceValues: { momentum: 3 } },
      resolution: "NONE",
      effectTypes: ["utility", "debuff"],
      utilityConfig: {
        utilityType: "cleanse",
        selectedEffects: [{ id: "purge_root", name: "Purge Root", description: "Removes all Rooted and Grappled conditions." }]
      },
      debuffConfig: {
        debuffType: "statusEffect",
        effects: [{ id: "shattered_joints", name: "Shattered Joints", description: "Agility is reduced by 2 for the rest of combat.", statusEffect: { type: "stat_reduction", stat: "agility", value: -2 } }],
        durationValue: 0, durationType: "permanent"
      },
      tags: ["utility", "cleanse", "bladedancer"]
    },

    // ========================================
    // LEVEL 3 SPELLS - Advanced Contortions
    // ========================================

    {
      id: "bladedancer_centrifugal_laceration",
      name: "Centrifugal Laceration",
      description: "Spin so fast your own skin tears, showering enemies in a razor-sharp cyclone of agony.",
      level: 3,
      spellType: "ACTION",
      icon: "Slashing/Cleave",
      typeConfig: { school: "slashing", tags: ["melee", "damage", "aoe", "stance_centrifugal_flay"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "area", rangeType: "self_centered", aoeShape: "circle", aoeParameters: { radius: 10 }, targetRestrictions: ["enemy"] },
      resourceCost: { actionPoints: 1, resourceTypes: ["momentum"], resourceValues: { momentum: 4 } },
      resolution: "DICE",
      effectTypes: ["damage"],
      damageConfig: {
        formula: "1d8 + agility", elementType: "slashing", damageTypes: ["slashing"],
        canCrit: true, critMultiplier: 2, resolution: "DICE"
      },
      stanceRequirement: "centrifugal_flay",
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },
      momentumGain: 1, // Gains 1 per target hit implicitly by combat rules
      tags: ["aoe", "damage", "stance_centrifugal_flay", "bladedancer"]
    },

    {
      id: "bladedancer_unfeeling_riposte",
      name: "Unfeeling Riposte",
      description: "Lock your shattered joints in place, absorbing the blow through pure alchemic numbness before retaliating.",
      level: 3,
      spellType: "REACTION",
      icon: "Utility/Parry",
      typeConfig: { school: "slashing", tags: ["reaction", "parry", "counter", "stance_deadened_nerve"], castTime: 0, castTimeType: "REACTION" },
      targetingConfig: { targetingType: "single", rangeType: "melee", rangeDistance: 5, targetRestrictions: ["enemy"] },
      resourceCost: { actionPoints: 0, resourceTypes: ["momentum"], resourceValues: { momentum: 3 } },
      resolution: "DICE",
      effectTypes: ["damage"],
      damageConfig: {
        formula: "2d6 + agility", elementType: "slashing", damageTypes: ["slashing"],
        canCrit: true, critMultiplier: 2, resolution: "DICE"
      },
      stanceRequirement: "deadened_nerve",
      tags: ["reaction", "parry", "stance_deadened_nerve", "bladedancer"]
    },

    {
      id: "bladedancer_joint_snapping_dash",
      name: "Joint-Snapping Dash",
      description: "Dislocate your knee to pivot at an impossible angle, sacrificing flesh for pure velocity. Instantly reposition 30ft.",
      level: 3,
      spellType: "ACTION",
      icon: "Utility/Speed Boot",
      typeConfig: { school: "physical", tags: ["mobility", "reposition", "self_damage"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "self", rangeType: "self" },
      resourceCost: { actionPoints: 1, resourceTypes: ["momentum"], resourceValues: { momentum: 2 } },
      resolution: "NONE",
      effectTypes: ["utility"],
      utilityConfig: {
        utilityType: "reposition",
        selectedEffects: [{ id: "flayed_dash", name: "Flayed Dash", description: "Move 30ft without provoking attacks." }]
      },
      momentumGain: 3,
      tags: ["mobility", "reposition", "bladedancer"]
    },

    // ========================================
    // LEVEL 4 SPELLS - Signature Moves (Earn Trauma)
    // ========================================

    {
      id: "bladedancer_alchemic_overdose_star",
      name: "Alchemic Overdose ★",
      description: "Plunge your weapon into their vitals, flooding the wound with your own corrosive alchemic blood. Earning a Trauma Token.",
      level: 4,
      spellType: "ACTION",
      icon: "Poison/Envenom Dagger",
      typeConfig: { school: "piercing", tags: ["melee", "damage", "poison", "signature", "stance_arterial_focus"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "single", rangeType: "melee", rangeDistance: 5, targetRestrictions: ["enemy"] },
      resourceCost: { actionPoints: 1, resourceTypes: ["momentum"], resourceValues: { momentum: 6 } },
      resolution: "DICE",
      effectTypes: ["damage", "debuff"],
      damageConfig: {
        formula: "2d8 + agility", elementType: "piercing", damageTypes: ["piercing"],
        canCrit: true, critMultiplier: 2, isGuaranteedCrit: true, resolution: "DICE"
      },
      debuffConfig: {
        debuffType: "statusEffect",
        effects: [{ id: "venomous_blood", name: "Venomous Blood", description: "Target takes 1d6 poison/round.", statusType: "poisoned", damagePerTurn: "1d6" }],
        durationValue: 3, durationType: "rounds"
      },
      isSignatureMove: true,
      flourishGenerated: 1, // Using Flourish internally but displayed as Trauma
      stanceRequirement: "arterial_focus",
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
      tags: ["signature", "trauma_generation", "stance_arterial_focus", "bladedancer"]
    },

    {
      id: "bladedancer_void_collapse_star",
      name: "Void Collapse ★",
      description: "Your impossible velocity renders you invisible to the naked eye until you stop to eviscerate your target. Earns a Trauma Token.",
      level: 4,
      spellType: "ACTION",
      icon: "Utility/Hide",
      typeConfig: { school: "physical", tags: ["invisibility", "burst", "signature", "stance_void_collapse"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "self", rangeType: "self" },
      resourceCost: { actionPoints: 1, resourceTypes: ["momentum"], resourceValues: { momentum: 6 } },
      resolution: "NONE",
      effectTypes: ["buff"],
      buffConfig: {
        buffType: "statusEffect",
        effects: [{ id: "velocity_cloak", name: "Velocity Cloak", description: "Invisible for 1 round. Next attack is an auto-crit.", statusType: "invisibility" }],
        durationValue: 1, durationType: "rounds"
      },
      isSignatureMove: true,
      flourishGenerated: 1,
      stanceRequirement: "void_collapse",
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
      tags: ["signature", "trauma_generation", "stance_void_collapse", "bladedancer"]
    },

    // ========================================
    // LEVEL 5 SPELLS - Ultimates (Consume Trauma)
    // ========================================

    {
      id: "bladedancer_thousand_agonies",
      name: "Thousand Agonies",
      description: "You unleash all built momentum in a single devastating sphere of razor-sharp devastation. You spin so fast your skin tears, spraying your toxic blood in all directions.",
      level: 5,
      spellType: "ACTION",
      icon: "Slashing/Whirl",
      typeConfig: { school: "slashing", tags: ["aoe", "damage", "ultimate", "self_damage"], castTime: 2, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "area", rangeType: "self_centered", aoeShape: "circle", aoeParameters: { radius: 15 }, targetRestrictions: ["enemy"] },
      resourceCost: { actionPoints: 2, resourceTypes: ["momentum", "flourish"], resourceValues: { momentum: "ALL", flourish: 2 } },
      resolution: "DICE",
      effectTypes: ["damage"],
      damageConfig: {
        formula: "3d8 + (Momentum Expended * 1d4)",
        elementType: "slashing", damageTypes: ["slashing", "necrotic"],
        armorPenetration: "50%",
        description: "Deals massive damage scaling infinitely with Momentum expended. You take 1d8 necrotic damage.",
        resolution: "DICE"
      },
      tags: ["aoe", "ultimate", "self_damage", "bladedancer"]
    },

    // ========================================
    // LEVEL 6+ SPELLS - Escalating Horror
    // ========================================

    {
      id: "bladedancer_sensory_death",
      name: "Sensory Death",
      description: "Overdose on your alchemic venom. You go entirely numb, allowing for horrifying feats of momentum, but your mind begins to fray.",
      level: 6,
      spellType: "ACTION",
      icon: "Poison/Poison Contagion",
      typeConfig: { school: "necrotic", tags: ["buff", "friction", "combo"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "self", rangeType: "self" },
      resourceCost: { actionPoints: 1, resourceTypes: ["momentum"], resourceValues: { momentum: 5 } },
      resolution: "NONE",
      effectTypes: ["buff", "debuff"],
      buffConfig: {
        buffType: "statEnhancement",
        effects: [{ id: "numb_to_pain", name: "Numb to Pain", description: "Ignore all non-lethal conditions for 3 rounds. Attacks cost 0 AP to chain if you have Momentum." }],
        durationValue: 3, durationType: "rounds"
      },
      debuffConfig: {
        debuffType: "statusEffect",
        effects: [{ id: "frayed_mind", name: "Frayed Mind", description: "Self-debuff: -4 to Spirit saving throws. Take 2d6 Psychic damage when the effect ends.", statusEffect: { type: "stat_reduction", stat: "spirit", value: -4 } }],
        durationValue: 3, durationType: "rounds"
      },
      tags: ["buff", "friction", "bladedancer"]
    },

    {
      id: "bladedancer_terminal_velocity",
      name: "Terminal Velocity",
      description: "The ultimate, tragic pinnacle of the Flayed Dervish. You sacrifice the last of your humanity to move faster than time itself. Your heart will undoubtedly stop after this.",
      level: 10,
      spellType: "ACTION",
      icon: "Force/Explosion Burst",
      typeConfig: { school: "physical", tags: ["ultimate", "aoe", "armor_bypass", "self_damage"], castTime: 2, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "area", rangeType: "self_centered", aoeShape: "circle", aoeParameters: { radius: 50 }, targetRestrictions: ["enemy"] },
      resourceCost: { actionPoints: 3, resourceTypes: ["momentum", "flourish"], resourceValues: { momentum: 10, flourish: 5 } },
      resolution: "DICE",
      effectTypes: ["damage", "debuff"],
      damageConfig: {
        formula: "10d10 + (agility * 3)", elementType: "slashing", damageTypes: ["slashing", "necrotic"],
        armorPenetration: "100%", description: "Bypasses all Armor affecting everything in 50ft.", resolution: "DICE"
      },
      debuffConfig: {
        debuffType: "statusEffect",
        effects: [{ id: "terminal_strain", name: "Terminal Strain", description: "After casting, Momentum drops to 0, movement speed = 0, take 2d10 necrotic damage.", statusEffect: { type: "condition_trigger", trigger: "immediate", resourceDrain: { momentum: "all" }, movementPenalty: "0 speed", damage: "2d10 necrotic" } }],
        durationValue: 1, durationType: "rounds"
      },
      tags: ["ultimate", "aoe", "bladedancer"]
    }
  ]
};
