export const BLADEDANCER_DATA = {
  id : "bladedancer",
  name: "Bladedancer",
  icon: "fas fa-biohazard",
  role: "Damage",
  damageTypes: ["slashing", "necrotic", "piercing"],

  overview: {
    title: "The Bladedancer",
    subtitle: "The Kinetic Dervish",

    quickOverview: {
      title: "Quick Overview",
      content: `**What You Need to Know**: The Bladedancer flows between 6 high-speed Kinetic States (Ataxic Tremor, Arterial Focus, Centrifugal Sweep, Deadened Nerve, Fluid Pivot, Void Collapse), each offering unique physical posture changes and custom mechanics. You build Momentum through rapid strikes and spend it to shift between states.
      
**Core Mechanic**: Infinite, unmitigated combo chaining. You build Momentum to vibrate your blades at extreme speeds, bypassing heavy Armor.

**Resources**: Momentum (0-20, builds/decays during combat) & Trauma Tokens (persistent kinetic energy tokens traded for powerful finishers).

**Playstyle**: Relentless, high-speed striker. High risk, high reward momentum-based economy heavily reliant on positioning and absolute freedom of movement.

**Best For**: Players who enjoy razor's-edge resource management, rapid stance-dancing, and dissecting heavily armored targets.`
    },

    description: `A master of hyper-accelerated momentum, the Bladedancer is a swift tempest of steel. To achieve their incredible velocities, they undergo rigorous alchemical conditioning and joint flexibility training, allowing them to move at speeds that push the limits of mortal physiology in exchange for constant kinetic pressure.`,

    roleplayIdentity: {
      title: "The Path of Velocity",
      content: `In the world of Mythrill, the Kinetic Dervishes are feared for their absolute speed. They have pushed their physical bodies to the absolute limit, relying on special alchemical wraps to stabilize their joints during extreme movement. They live for the rush of battle, where their focus narrows entirely to the rhythm of combat.

- **The Agile Outcast**: A free-spirited duelist who rejected traditional martial schools to forge their own high-speed path.
- **The Alchemic Prodigy**: An initiate who utilizes stabilizing alchemical extracts to accelerate their nervous system.
- **The Doomed Sentinel**: A high-risk fighter who pushes their speed to protect their allies, ignoring the personal strain.`
    },

    combatRole: {
      title: "Combat Role",
      content: `**Why Bring Me?**: Infinite, unmitigated combo chaining. The Bladedancer is the only class capable of stacking infinite momentum to completely bypass heavy Armor ratings without triggering damage reduction. Their blades seek the microscopic gaps in full plate, shredding impenetrable foes.

**The Fatal Flaw (Momentum Dependency)**: They possess zero base Armor and suffer a catastrophic 100% vulnerability to guaranteed, unavoidable AoE damage. If their movement speed is ever reduced to 0 (by roots, grapples, or ice magic), their combo shatters. Their resource plummets to zero, and the sudden cessation of their hyper-accelerated movement causes severe internal kinetic strain. Keeping a Bladedancer mobile is essential for their survival.`
    },

    playstyle: {
      title: "Playstyle & Strategy",
      content: `Playing a Bladedancer is about navigating 6 distinct combat states to control the battlefield:

**Kinetic State Navigation**:
- **Ataxic Tremor** (Start): Spasmodic defensive movement, transitions to Arterial Focus, Void Collapse, or Fluid Pivot.
- **Arterial Focus**: High-precision critical strikes, transitions to Centrifugal Sweep, Deadened Nerve, or Ataxic Tremor.
- **Centrifugal Sweep**: Whirling area attacks, transitions to Fluid Pivot or Deadened Nerve.
- **Deadened Nerve**: Focused defensive parries, transitions to Arterial Focus or Ataxic Tremor.
- **Fluid Pivot** (Hub): Complete posture fluidity, can transition to ANY state (costs 4 Momentum).
- **Void Collapse**: Extreme speed stealth, transitions to Arterial Focus or Fluid Pivot.

**Momentum Management**:
- Build: +1 per hit, +2 per crit, +1 per dodge/parry.
- Decay: -1 per miss or taking damage.
- Spend: 2-4 for stance shifts, 3-6 for abilities.
- Strategy: Maintain 6+ Momentum or your kinetic engine will begin to stall.

Always keep moving. Avoid crowd control at all costs. You can sacrifice some health to cleanse restrictive crowd control using alchemical agents.`
    },

    immersiveCombatExample: {
      title: "Combat Example: The Duel at the Razor's Edge",
      content: `**The Setup**: You face a heavy vanguard in full plate. Traditional strikes will bounce off his shield. You need to build momentum and strike the gaps in his armor.

**Turn 1 - Building Rhythm (Momentum: 0 → 3)**
*You enter Ataxic Tremor stance, moving in unpredictable, rapid bursts to throw off his aim. The vanguard lunges with his spear.*
- **Reaction**: You easily dodge the spear thrust (+1 Momentum).
- **Action**: You follow up with **Frantic Laceration** (+2 Momentum).
- **Momentum**: Now at 3. You feel the kinetic heat rising.

**Turn 2 - Precision Strike (State: Ataxic Tremor → Arterial Focus)**
*With momentum established, you shift into Arterial Focus, narrowing your sight to the gaps in his plate armor.*
- **Action**: Shift stance to **Arterial Focus** (costs 2 Momentum, down to 1).
- **Action**: Swing with rapid twin cuts. Hits twice, including one critical strike!
- **Momentum**: +1 on hit, +2 on crit. You are now at 4 Momentum.

**Turn 3 - Bypassing the Shield**
*With your blades vibrating at impossible frequencies, you deliver a devastating strike.*
- **Action**: Cast **Kinetic Dissection** (costs 1 Momentum).
- **Effect**: Bypasses 100% of his Armor. Your blade slips perfectly into the joint under his arm, ending the fight instantly.
- **Momentum**: Remaining 3. You step back, breathing heavily, slowing down your internal clock.`
    }
  },

  resourceSystem: {
    title: "Momentum & Trauma System",
    subtitle: "The Kinetic Engine",
    description: "A dual-resource system tracking kinetic rhythm (Momentum) and physical toll (Trauma Tokens). Momentum builds through rapid strikes and successful dodges, while Trauma represents major kinetic discharges traded for powerful finishers.",

    cards: [
      {
        title: "Momentum (Primary)",
        stats: "0-20 Capacity",
        details: "Tracks your immediate combat rhythm. Generated by successful hits/defenses, lost via misses/damage/idle turns, and spent on stance shifts and special abilities. Plummets to 0 if your movement is restricted."
      },
      {
        title: "Trauma Tokens (Secondary)",
        stats: "0-5 Tokens",
        details: "Represents persistent kinetic energy discharges traded for ultimate finishers. Earned by performing State Signature Moves (★). Persists between combats."
      }
    ],

    generationTable: {
      headers: ["Action", "Momentum Change", "Trauma Change"],
      rows: [
        ["Successful Attack", "+1", "0"],
        ["Critical Hit", "+2", "0"],
        ["Dodge/Parry", "+1", "0"],
        ["Miss Attack", "-1", "0"],
        ["Take Damage", "-1", "0"],
        ["Rooted / Immobilized", "Drops to 0", "0"],
        ["Signature Move (★)", "-Cost", "+1"],
        ["Extended Rest", "Reset to 0", "Reset to 0"]
      ]
    },

    usage: {
      momentum: "Used for Stance transitions (2-4 cost) and active ability costs (3-6 cost).",
      flourish: "⚠️ Momentum Dependency: If your movement speed is ever reduced to 0, your Momentum immediately plummets to 0 and the sudden kinetic backlash deals internal strain damage."
    },

    stanceNetworkTable: {
      title: "Kinetic State Network",
      description: "Shift your body's posture to transition between these specialized combat states.",
      headers: ["State", "Type", "Passive Effects", "Can Transition To", "Transition Cost"],
      rows: [
        ["Ataxic Tremor", "Defensive/Agile", "+2 dodge, +10 ft movement, advantage on Disengage", "Arterial Focus, Void Collapse, Fluid Pivot", "2 Momentum"],
        ["Arterial Focus", "Offensive/Precision", "+2 to attack rolls, increased crit chance", "Centrifugal Sweep, Deadened Nerve, Ataxic Tremor", "2 Momentum"],
        ["Centrifugal Sweep", "AoE/Multi-target", "Attacks can cleave to adjacent enemies", "Fluid Pivot, Deadened Nerve", "3 Momentum"],
        ["Deadened Nerve", "Defensive/Counter", "High pain tolerance, can use reaction to parry", "Arterial Focus, Ataxic Tremor", "2 Momentum"],
        ["Fluid Pivot", "Balanced/Universal", "+1 to all rolls, can easily shift to any other state", "ANY state (universal hub)", "4 Momentum"],
        ["Void Collapse", "Stealth/Burst", "Advantage on first attack, +2d6 damage from stealth", "Arterial Focus, Fluid Pivot", "3 Momentum"]
      ]
    }
  },

  equipment: {
    title: "Starting Equipment",
    choices: [
      {
        name: "Twin Kinetic Blades Path",
        icon: "Slashing/Cross Slash",
        items: [
          "Twin Kinetic Blades (1d8 slashing each, balanced steel blades built for infinite combo chains)",
          "Alchemical Wrap Bandages (Provides 0 Armor, lightweight linen that offers absolute freedom of movement)",
          "Venom Vials (3 doses of sensory-accelerating oil)"
        ],
        description: "Focuses on rapid dual-wield cuts to build massive Momentum quickly."
      },
      {
        name: "Serrated Saber Path",
        icon: "Slashing/Bloody Slash",
        items: [
          "Serrated Saber (1d10 slashing, heavy saber designed for deep cuts and critical strikes)",
          "Alchemical Wrap Bandages (Provides 0 Armor, lightweight linen that offers absolute freedom of movement)",
          "Stabilizing Salts (Reduces physical strain after rapid dashes)"
        ],
        description: "Focuses on larger, heavy cuts and high single-strike kinetic impact."
      }
    ],
    standardGear: [
      "Agile Pack (backpack, rations x10, waterskin, alchemical wraps, 20 blue Momentum trackers, 5 red Trauma tokens)",
      "Currency: 1d10 x 5 copper pieces"
    ],
    notes: "Your speed IS your armor, and heavy steel restricts your kinetic flow. You possess 0 base Armor inherently. Furthermore, you cannot wield ranged weapons; your kinetic acceleration requires direct, physical melee contact."
  },

  specializations: {
    title: "Specializations",
    subtitle: "Dervish Paths",
    description: "Choose a specialization to define your primary combat style. Each specialization grants a single, high-impact signature passive or ability that anchors your playstyle.",
    specs: [
      {
        id : "spec_torn_dervish",
        name: "Flowing Dervish",
        icon: "fas fa-wind",
        color: "#8B0000",
        theme: "Kinetic Fluidity",
        description: "Masters of high-speed fluid movement and effortless combo chains.",
        playstyle: "Rapidly shift between kinetic states to maintain maximum combo momentum.",
        strengths: [
          "Reduced stance transition costs",
          "High sustained combo damage"
        ],
        weaknesses: [
          "High resource expenditure",
          "Vulnerable if combo is interrupted"
        ],
        specPassive: {
          name: "Fluid Pivot",
          description: "All stance transitions cost 1 less Momentum. When you change stances, your next attack deals +1d6 bonus damage."
        }
      },
      {
        id : "spec_dead_duelist",
        name: "Steel-Nerved Duelist",
        icon: "fas fa-skull",
        color: "#27AE60",
        theme: "Precision Striking",
        description: "Masters of extreme focus, precision strikes, and flawless counter-attacks.",
        playstyle: "Defeat single targets through expanded critical ranges and swift ripostes.",
        strengths: [
          "Expanded critical hit range",
          "Devastating counter-attacks"
        ],
        weaknesses: [
          "Weak against large groups",
          "Relies on being attacked to trigger counters"
        ],
        specPassive: {
          name: "Steely Focus",
          description: "While in Arterial Focus or Deadened Nerve stances, gain +2 to attack rolls, and reroll any damage dice showing a 1."
        }
      },
      {
        id : "spec_void_walker",
        name: "Void Walker",
        icon: "fas fa-user-ninja",
        color: "#2C3E50",
        theme: "Stealth & Burst",
        description: "Masters of sheer speed and surprise attacks from the shadows.",
        playstyle: "Move so quickly you become a blur, striking from nothingness.",
        strengths: [
          "Easy access to Void Collapse stance",
          "High stealth burst damage"
        ],
        weaknesses: [
          "Highly dependent on stealth",
          "Low sustained defense"
        ],
        specPassive: {
          name: "Void Affinity",
          description: "You can enter Void Collapse from any stance for 3 Momentum. While in Void Collapse, you are lightly obscured and deal +1d6 bonus damage."
        }
      }
    ]
  },

  spells: [
    // ========================================
    // LEVEL 1 SPELLS - The Core Engine
    // ========================================
    { id: "bladedancer_the_flayed_truth",
      name: "The Kinetic Paradox (Fatal Flaw)",
      description: "Your body moves at speeds that push mortal physiology to its limit. You have 0 base Armor and 100% vulnerability to unavoidable AoE. If Rooted or Grappled, Momentum drops to 0 and you take Necrotic Bleed.",
      level: 1,
      spellType: "PASSIVE",
      icon: "Healing/Red Heart",
      typeConfig: {
        school: "physical",
        icon: "Healing/Red Heart",
        tags: ["passive", "fatal-flaw", "vulnerability"],
        castTime: 0,
        castTimeType: "PASSIVE"
      },
      targetingConfig: {
        targetingType: "self",
        rangeType: "self"
      },
      resourceCost: {
        actionPoints: 0,
        mana: 0,
        components: ["somatic"],
        somaticText: "Constantly maintain rapid kinetic vibrations across all limbs."
      },
      resolution: "NONE",
      effectTypes: ["debuff"],
      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          {
            id : "aoe_vulnerability",
            name: "Hyper-Accelerated Metabolism",
            description: "Takes 100% extra damage from unavoidable AoE.",
            mechanicsText: "100% vulnerability to unavoidable AoE",
            statusEffect: {
              type: "vulnerability",
              vulnerabilityType: "aoe",
              percentage: 100,
              trigger: "unavoidable_aoe"
            }
          },
          {
            id : "momentum_withdrawal",
            name: "Momentum Withdrawal",
            description: "If Rooted or Grappled, Momentum drops to 0 and take 1d10 Necrotic Bleed per round.",
            mechanicsText: "If Rooted/Grappled: Momentum drops to 0, take 1d10 Necrotic Bleed/round",
            statusEffect: {
              type: "condition_trigger",
              trigger: "movement_zero",
              resourceDrain: {
                momentum: "all"
              },
              damage: "1d10 necrotic"
            }
          }
        ],
        durationValue: 0,
        durationType: "permanent",
        durationUnit: "permanent"
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 0
      },
      tags: ["passive", "fatal-flaw", "starter", "bladedancer"]
    },

    { id: "bladedancer_kinetic_dissection",
      name: "Kinetic Dissection",
      description: "By expending Momentum, you vibrate your blade at speeds that slide into the microscopic gaps of heavy Armor. You may attack endlessly as long as you have Momentum to burn.",
      level: 1,
      spellType: "ACTION",
      icon: "Slashing/Bloody Slash",
      typeConfig: {
        school: "slashing",
        icon: "Slashing/Bloody Slash",
        tags: ["melee", "damage", "combo", "armor_bypass", "starter"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "melee",
        rangeDistance: 5,
        targetRestrictions: ["enemy"]
      },
      resourceCost: {
        actionPoints: 1,
        mana: 0,
        resourceTypes: ["momentumCost"],
        resourceValues: {
          momentumCost: 1
        },
        classResource: {
          type: "momentum",
          cost: 1
        },
        components: ["somatic"],
        somaticText: "Vibrate blade at high frequency, seeking gaps in heavy plating."
      },
      resolution: "DICE",
      effectTypes: ["damage"],
      damageConfig: {
        formula: "1d8 + agility",
        damageTypes: ["slashing"],
        resolution: "DICE",
        canCrit: true,
        critMultiplier: 2,
        armorPenetration: "100%",
        description: "Bypasses all Armor. If this attack lands, you may immediately cast Kinetic Dissection again for 0 Action Points by spending 1 additional Momentum."
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 0
      },
      tags: ["melee", "combo", "armor-bypass", "starter", "bladedancer"]
    },

    { id: "bladedancer_frantic_laceration",
      name: "Frantic Laceration",
      description: "A hyper-kinetic, rapid slash that builds momentum and establishes your combat rhythm.",
      level: 1,
      spellType: "ACTION",
      icon: "Slashing/Quick Slash",
      typeConfig: {
        school: "slashing",
        icon: "Slashing/Quick Slash",
        tags: ["melee", "damage", "momentum_generation", "starter"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "melee",
        rangeDistance: 5,
        targetRestrictions: ["enemy"]
      },
      resourceCost: {
        actionPoints: 1,
        mana: 0,
        resourceTypes: ["momentumGain"],
        resourceValues: {
          momentumGain: 2
        },
        classResource: {
          type: "momentum",
          cost: -2
        },
        components: ["somatic"],
        somaticText: "Execute a swift, sweeping slash in a continuous arc."
      },
      resolution: "DICE",
      effectTypes: ["damage"],
      damageConfig: {
        formula: "1d6 + agility",
        damageTypes: ["slashing"],
        resolution: "DICE",
        canCrit: true,
        critMultiplier: 2,
        description: "Precise strike that builds combat rhythm and Momentum."
      },
      momentumGain: 2,
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 0
      },
      tags: ["melee", "damage", "momentum_generation", "starter", "bladedancer"]
    },

    { id: "bladedancer_mutilation_shift",
      name: "Dervish Shift",
      description: "Swiftly adjust your center of gravity, shifting your body into a new specialized posture (Kinetic State).",
      level: 1,
      spellType: "ACTION",
      icon: "Necrotic/Crossed Bones",
      typeConfig: {
        school: "physical",
        icon: "Necrotic/Crossed Bones",
        tags: ["utility", "stance", "transition", "starter"],
        castTime: 0,
        castTimeType: "FREE"
      },
      targetingConfig: {
        targetingType: "self",
        rangeType: "self"
      },
      resourceCost: {
        actionPoints: 0,
        mana: 0,
        resourceTypes: ["momentumCost"],
        resourceValues: {
          momentumCost: 2
        },
        classResource: {
          type: "momentum",
          cost: 2
        },
        components: ["somatic"],
        somaticText: "Shift posture and weight dynamically to channel kinetic flow."
      },
      resolution: "NONE",
      effectTypes: ["utility"],
      utilityConfig: {
        utilityType: "stance_change",
        selectedEffects: [
          {
            id : "stance_transition",
            name: "State Transition",
            description: "Change to a connected state in the network, gaining its passive effects"
          }
        ],
        duration: 0,
        durationUnit: "permanent"
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 0
      },
      tags: ["utility", "stance", "transition", "starter", "bladedancer"]
    },

    // ========================================
    // LEVEL 2 SPELLS - State-Locked Abilities (Ataxic Tremor & Arterial Focus)
    // ========================================
    { id: "bladedancer_ataxic_spasm",
      name: "Ataxic Sway",
      description: "Perform an unpredictable sway to avoid a blow, converting defense into immediate kinetic fuel.",
      level: 2,
      spellType: "ACTION",
      icon: "Utility/Deflecting Shield",
      typeConfig: {
        school: "physical",
        icon: "Utility/Deflecting Shield",
        tags: ["defense", "dodge", "momentum_generation", "stance_ataxic_tremor"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "self",
        rangeType: "self"
      },
      resourceCost: {
        actionPoints: 1,
        mana: 0,
        resourceTypes: ["momentumCost"],
        resourceValues: {
          momentumCost: 3
        },
        classResource: {
          type: "momentum",
          cost: 3
        },
        components: ["somatic"],
        somaticText: "Quickly lean back in an unexpected defensive sway."
      },
      resolution: "NONE",
      effectTypes: ["buff"],
      buffConfig: {
        buffType: "statusEffect",
        effects: [
          {
            id : "ataxic_dodge",
            name: "Spasmodic Dodge",
            description: "Automatically dodge next attack. Gain +2 Momentum on success.",
            mechanicsText: "Automatically dodge next attack. Gain +2 Momentum on success.",
            statusType: "dodge"
          }
        ],
        durationValue: 1,
        durationType: "rounds",
        durationUnit: "rounds"
      },
      stanceRequirement: "ataxic_tremor",
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 1
      },
      tags: ["defense", "dodge", "stance_ataxic_tremor", "bladedancer"]
    },

    { id: "bladedancer_arterial_puncture",
      name: "Arterial Puncture",
      description: "Thrust forward with high speed, bypassing enemy shields to strike a vulnerable artery.",
      level: 2,
      spellType: "ACTION",
      icon: "Piercing/Piercing Thrust",
      typeConfig: {
        school: "piercing",
        icon: "Piercing/Piercing Thrust",
        tags: ["melee", "damage", "precision", "bleed", "stance_arterial_focus"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "melee",
        rangeDistance: 5,
        targetRestrictions: ["enemy"]
      },
      resourceCost: {
        actionPoints: 1,
        mana: 0,
        resourceTypes: ["momentumCost"],
        resourceValues: {
          momentumCost: 4
        },
        classResource: {
          type: "momentum",
          cost: 4
        },
        components: ["somatic", "verbal"],
        somaticText: "Lunge forward, driving blade into a precise armor gap.",
        verbalText: "A short, sharp breath of deep concentration."
      },
      resolution: "DICE",
      effectTypes: ["damage", "debuff"],
      damageConfig: {
        formula: "1d8 + agility + 1d8",
        damageTypes: ["piercing"],
        resolution: "DICE",
        canCrit: true,
        critMultiplier: 2
      },
      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          {
            id : "arterial_bleed",
            name: "Deep Bleed",
            description: "Target takes 1d6 Bleed damage per round.",
            mechanicsText: "Target takes 1d6 Bleed damage per round.",
            statusType: "bleeding",
            damagePerTurn: "1d6"
          }
        ],
        durationValue: 3,
        durationType: "rounds",
        durationUnit: "rounds",
        savingThrow: {
          ability: "constitution",
          difficultyClass: 14,
          saveOutcome: "reduced_duration"
        }
      },
      stanceRequirement: "arterial_focus",
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 0
      },
      tags: ["melee", "damage", "bleed", "stance_arterial_focus", "bladedancer"]
    },

    { id: "bladedancer_alchemic_purge",
      name: "Alchemic Purge",
      description: "Cleanse your system of immobilizing effects by administering a fast-acting alchemical stimulant.",
      level: 2,
      spellType: "ACTION",
      icon: "Slashing/Bloody Slash",
      typeConfig: {
        school: "necrotic",
        icon: "Slashing/Bloody Slash",
        tags: ["cleanse", "self_damage", "friction"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "self",
        rangeType: "self"
      },
      resourceCost: {
        actionPoints: 1,
        mana: 0,
        resourceTypes: ["momentumCost"],
        resourceValues: {
          momentumCost: 3
        },
        classResource: {
          type: "momentum",
          cost: 3
        },
        components: ["somatic", "verbal"],
        somaticText: "Crack knuckles and quickly inject alchemical stimulant.",
        verbalText: "A low groan of sudden, freezing energy."
      },
      resolution: "NONE",
      effectTypes: ["utility", "debuff"],
      utilityConfig: {
        utilityType: "cleanse",
        selectedEffects: [
          {
            id : "purge_root",
            name: "Purge Root",
            description: "Removes all Rooted and Grappled conditions."
          }
        ]
      },
      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          {
            id : "joint_strain",
            name: "Joint Strain",
            description: "Agility is reduced by 2 for the rest of combat.",
            mechanicsText: "Agility reduced by 2 for the rest of combat.",
            statusEffect: {
              type: "stat_reduction",
              stat: "agility",
              value: -2
            }
          }
        ],
        durationValue: 0,
        durationType: "permanent",
        durationUnit: "permanent"
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 0
      },
      tags: ["utility", "cleanse", "bladedancer"]
    },

    // ========================================
    // LEVEL 3 SPELLS - Advanced Contortions
    // ========================================
    { id: "bladedancer_centrifugal_sweep",
      name: "Centrifugal Sweep",
      description: "Spin rapidly with swept blades, catching all surrounding enemies in a cyclone of steel.",
      level: 3,
      spellType: "ACTION",
      icon: "Slashing/Cleave",
      typeConfig: {
        school: "slashing",
        icon: "Slashing/Cleave",
        tags: ["melee", "damage", "aoe", "stance_centrifugal_sweep"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        areaShape: "circle",
        areaSize: 10,
        targetRestrictions: ["enemy"]
      },
      resourceCost: {
        actionPoints: 1,
        mana: 0,
        resourceTypes: ["momentumCost"],
        resourceValues: {
          momentumCost: 4
        },
        classResource: {
          type: "momentum",
          cost: 4
        },
        components: ["somatic"],
        somaticText: "Spin swiftly on one heel, sweeping both blades outward."
      },
      resolution: "DICE",
      effectTypes: ["damage"],
      damageConfig: {
        formula: "1d8 + agility",
        damageTypes: ["slashing"],
        resolution: "DICE",
        canCrit: true,
        critMultiplier: 2
      },
      stanceRequirement: "centrifugal_sweep",
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 1
      },
      momentumGain: 1,
      tags: ["aoe", "damage", "stance_centrifugal_sweep", "bladedancer"]
    },

    { id: "bladedancer_steely_riposte",
      name: "Steely Riposte",
      description: "Absorb an incoming melee blow with a rigid parry, immediately turning the opponent's momentum into a counter-attack.",
      level: 3,
      spellType: "REACTION",
      icon: "Utility/Parry",
      typeConfig: {
        school: "slashing",
        icon: "Utility/Parry",
        tags: ["reaction", "parry", "counter", "stance_deadened_nerve"],
        castTime: 0,
        castTimeType: "REACTION"
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "melee",
        rangeDistance: 5,
        targetRestrictions: ["enemy"]
      },
      resourceCost: {
        actionPoints: 0,
        mana: 0,
        resourceTypes: ["momentumCost"],
        resourceValues: {
          momentumCost: 3
        },
        classResource: {
          type: "momentum",
          cost: 3
        },
        components: ["somatic"],
        somaticText: "Cross blades in a solid, kinetic parry to block and strike back."
      },
      resolution: "DICE",
      effectTypes: ["damage"],
      damageConfig: {
        formula: "2d6 + agility",
        damageTypes: ["slashing"],
        resolution: "DICE",
        canCrit: true,
        critMultiplier: 2
      },
      stanceRequirement: "deadened_nerve",
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 0
      },
      tags: ["reaction", "parry", "stance_deadened_nerve", "bladedancer"]
    },

    { id: "bladedancer_kinetic_dash",
      name: "Kinetic Dash",
      description: "Execute a sudden, incredibly fast leap, repositioning yourself up to 30 feet in an instant.",
      level: 3,
      spellType: "ACTION",
      icon: "Utility/Speed Boot",
      typeConfig: {
        school: "physical",
        icon: "Utility/Speed Boot",
        tags: ["mobility", "reposition", "strain"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "self",
        rangeType: "self"
      },
      resourceCost: {
        actionPoints: 1,
        mana: 0,
        resourceTypes: ["momentumCost"],
        resourceValues: {
          momentumCost: 2
        },
        classResource: {
          type: "momentum",
          cost: 2
        },
        components: ["somatic"],
        somaticText: "Spring forward from a low, high-tension crouch."
      },
      resolution: "NONE",
      effectTypes: ["utility"],
      utilityConfig: {
        utilityType: "reposition",
        selectedEffects: [
          {
            id : "kinetic_dash_effect",
            name: "Kinetic Dash",
            description: "Move 30ft without provoking attacks."
          }
        ]
      },
      momentumGain: 3,
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 0
      },
      tags: ["mobility", "reposition", "bladedancer"]
    },

    // ========================================
    // LEVEL 4 SPELLS - Signature Moves (Earn Trauma)
    // ========================================
    { id: "bladedancer_alchemic_overdrive_star",
      name: "Alchemic Overdrive ★",
      description: "Deliver a precise envenomed strike, earning a Trauma Token for your ultimate finishers.",
      level: 4,
      spellType: "ACTION",
      icon: "Poison/Envenom Dagger",
      typeConfig: {
        school: "piercing",
        icon: "Poison/Envenom Dagger",
        tags: ["melee", "damage", "poison", "signature", "stance_arterial_focus"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "melee",
        rangeDistance: 5,
        targetRestrictions: ["enemy"]
      },
      resourceCost: {
        actionPoints: 1,
        mana: 0,
        resourceTypes: ["momentumCost", "flourishGain"],
        resourceValues: {
          momentumCost: 6,
          flourishGain: 1
        },
        classResource: {
          type: "momentum",
          cost: 6
        },
        components: ["somatic", "verbal"],
        somaticText: "Thrust both blades deep, letting venom slide off the grooves.",
        verbalText: "A short, focused shout of impact."
      },
      resolution: "DICE",
      effectTypes: ["damage", "debuff"],
      damageConfig: {
        formula: "2d8 + agility",
        damageTypes: ["piercing"],
        canCrit: true,
        critMultiplier: 2,
        isGuaranteedCrit: true,
        resolution: "DICE"
      },
      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          {
            id : "venomous_blood",
            name: "Venomous Blood",
            description: "Target takes 1d6 poison/round.",
            mechanicsText: "Target takes 1d6 poison damage per round for 3 rounds.",
            statusType: "poisoned",
            damagePerTurn: "1d6"
          }
        ],
        durationValue: 3,
        durationType: "rounds",
        durationUnit: "rounds"
      },
      isSignatureMove: true,
      flourishGenerated: 1,
      stanceRequirement: "arterial_focus",
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 2
      },
      tags: ["signature", "trauma_generation", "stance_arterial_focus", "bladedancer"]
    },

    { id: "bladedancer_void_collapse_star",
      name: "Void Collapse ★",
      description: "Accelerate to such speed that you become a temporary blur, earning a Trauma Token.",
      level: 4,
      spellType: "ACTION",
      icon: "Utility/Hide",
      typeConfig: {
        school: "physical",
        icon: "Utility/Hide",
        tags: ["invisibility", "burst", "signature", "stance_void_collapse"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "self",
        rangeType: "self"
      },
      resourceCost: {
        actionPoints: 1,
        mana: 0,
        resourceTypes: ["momentumCost", "flourishGain"],
        resourceValues: {
          momentumCost: 6,
          flourishGain: 1
        },
        classResource: {
          type: "momentum",
          cost: 6
        },
        components: ["somatic"],
        somaticText: "Vibrate your body into a high-speed optical blur."
      },
      resolution: "NONE",
      effectTypes: ["buff"],
      buffConfig: {
        buffType: "statusEffect",
        effects: [
          {
            id : "velocity_cloak",
            name: "Velocity Cloak",
            description: "Invisible for 1 round. Next attack is an auto-crit.",
            mechanicsText: "Invisibility for 1 round. Next attack is an auto-crit.",
            statusType: "invisibility"
          }
        ],
        durationValue: 1,
        durationType: "rounds",
        durationUnit: "rounds"
      },
      isSignatureMove: true,
      flourishGenerated: 1,
      stanceRequirement: "void_collapse",
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 2
      },
      tags: ["signature", "trauma_generation", "stance_void_collapse", "bladedancer"]
    },

    // ========================================
    // LEVEL 5 SPELLS - Ultimates (Consume Trauma)
    // ========================================
    { id: "bladedancer_thousand_blades",
      name: "Thousand Blades",
      description: "Unleash all built momentum in a devastating, high-speed cyclone of steel surrounding you.",
      level: 5,
      spellType: "ACTION",
      icon: "Slashing/Whirl",
      typeConfig: {
        school: "slashing",
        icon: "Slashing/Whirl",
        tags: ["aoe", "damage", "ultimate", "strain"],
        castTime: 2,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        areaShape: "circle",
        areaSize: 15,
        targetRestrictions: ["enemy"]
      },
      resourceCost: {
        actionPoints: 2,
        mana: 0,
        resourceTypes: ["momentumCost", "flourishRequired"],
        resourceValues: {
          momentumCost: "ALL",
          flourishRequired: 2
        },
        classResource: {
          type: "momentum",
          cost: "ALL"
        },
        components: ["somatic", "verbal"],
        somaticText: "Spin with ultimate force, discharging all stored kinetic energy.",
        verbalText: "A loud, continuous shout of raw exertion."
      },
      resolution: "DICE",
      effectTypes: ["damage"],
      damageConfig: {
        formula: "3d8 + (Momentum Expended * 1d4)",
        damageTypes: ["slashing", "necrotic"],
        resolution: "DICE",
        armorPenetration: "50%",
        description: "Deals massive damage scaling infinitely with Momentum expended. You take 1d8 physical strain damage."
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 3
      },
      tags: ["aoe", "ultimate", "strain", "bladedancer"]
    },

    // ========================================
    // LEVEL 6+ SPELLS - Escalating Horror
    // ========================================
    { id: "bladedancer_sensory_numbing",
      name: "Sensory Numbing",
      description: "Administer an alchemical numbing compound, ignoring all minor pain to focus entirely on pure momentum.",
      level: 6,
      spellType: "ACTION",
      icon: "Poison/Poison Contagion",
      typeConfig: {
        school: "necrotic",
        icon: "Poison/Poison Contagion",
        tags: ["buff", "friction", "combo"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "self",
        rangeType: "self"
      },
      resourceCost: {
        actionPoints: 1,
        mana: 0,
        resourceTypes: ["momentumCost"],
        resourceValues: {
          momentumCost: 5
        },
        classResource: {
          type: "momentum",
          cost: 5
        },
        components: ["somatic", "verbal"],
        somaticText: "Inhale alchemical vapors to suppress nervous system pain.",
        verbalText: "A heavy, cold gasp of air."
      },
      resolution: "NONE",
      effectTypes: ["buff", "debuff"],
      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          {
            id : "numb_to_pain",
            name: "Numb to Pain",
            description: "Ignore all non-lethal conditions for 3 rounds. Attacks cost 0 AP to chain if you have Momentum.",
            mechanicsText: "Ignore non-lethal conditions. Melee attacks cost 0 AP as long as you have Momentum."
          }
        ],
        durationValue: 3,
        durationType: "rounds",
        durationUnit: "rounds"
      },
      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          {
            id : "frayed_mind",
            name: "Frayed Mind",
            description: "Self-debuff: -4 to Spirit saving throws. Take 2d6 Psychic damage when the effect ends.",
            mechanicsText: "-4 to Spirit saving throws. Take 2d6 Psychic damage when the effect ends.",
            statusEffect: {
              type: "stat_reduction",
              stat: "spirit",
              value: -4
            }
          }
        ],
        durationValue: 3,
        durationType: "rounds",
        durationUnit: "rounds"
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 2
      },
      tags: ["buff", "friction", "bladedancer"]
    },

    { id: "bladedancer_terminal_velocity",
      name: "Terminal Velocity",
      description: "The absolute pinnacle of kinetic speed. Accelerate past temporal bounds to strike all surrounding targets in a flash.",
      level: 10,
      spellType: "ACTION",
      icon: "Force/Explosion Burst",
      typeConfig: {
        school: "physical",
        icon: "Force/Explosion Burst",
        tags: ["ultimate", "aoe", "armor_bypass", "strain"],
        castTime: 2,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        areaShape: "circle",
        areaSize: 50,
        targetRestrictions: ["enemy"]
      },
      resourceCost: {
        actionPoints: 3,
        mana: 0,
        resourceTypes: ["momentumCost", "flourishRequired"],
        resourceValues: {
          momentumCost: 10,
          flourishRequired: 5
        },
        classResource: {
          type: "momentum",
          cost: 10
        },
        components: ["somatic", "verbal"],
        somaticText: "Sprint at blinding, impossible velocities across a massive area.",
        verbalText: "A powerful final shout of extreme physical release."
      },
      resolution: "DICE",
      effectTypes: ["damage", "debuff"],
      damageConfig: {
        formula: "10d10 + (agility * 3)",
        damageTypes: ["slashing", "necrotic"],
        resolution: "DICE",
        armorPenetration: "100%",
        description: "Bypasses all Armor affecting everything in 50ft."
      },
      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          {
            id : "terminal_strain",
            name: "Terminal Strain",
            description: "After casting, Momentum drops to 0, movement speed = 0, take 2d10 physical strain damage.",
            mechanicsText: "Momentum drops to 0, movement speed becomes 0, take 2d10 physical strain damage.",
            statusEffect: {
              type: "condition_trigger",
              trigger: "immediate",
              resourceDrain: {
                momentum: "all"
              },
              movementPenalty: "0 speed",
              damage: "2d10 necrotic"
            }
          }
        ],
        durationValue: 1,
        durationType: "rounds",
        durationUnit: "rounds"
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 4
      },
      tags: ["ultimate", "aoe", "bladedancer"]
    }
  ]
};
