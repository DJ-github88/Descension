export const COVENBANE_DATA = {
  id: "covenbane",
  name: "Covenbane",
  icon: "fas fa-crosshairs",
  color: "#8B4513",
  role: "Anti-Magic Hunter",
  damageTypes: ["radiant", "force", "slashing"],

  // Overview section
  overview: {
    title: "The Covenbane",
    subtitle: "Anti-Magic Hunter and Evil Destroyer",

    quickOverview: {
      title: "Quick Overview",
      content: `**What You Need to Know**: The Covenbane builds Hexbreaker Charges (0-6) through combat — attacking and defeating enemies — then unleashes those charges on devastating anti-magic abilities that shut down spellcasters, dispel enchantments, and banish demonic threats. Against evil magic users, every ability hits harder with bonus effects. No magic user is safe when a Covenbane is hunting.

**Core Mechanic**: Fight enemies → Generate Hexbreaker Charges from attacks and kills → Spend charges on escalating anti-magic abilities → Bonus effects against evil magic users

**Resource**: Hexbreaker Charges (0-6 scale, generated through combat)

**Passive**: Witch Hunter's Precision — Every 3rd attack against an evil magic user deals 1d6 radiant damage that bypasses all resistance

**Playstyle**: Relentless anti-magic striker — effective against all foes, devastating against evil casters

**Best For**: Players who love shutting down enemy casters, hunting specific targets, and being the ultimate counter to magical threats`,
    },

    description: `The Covenbane is a relentless hunter of evil magic, wielding powerful anti-magic abilities to track, weaken, and destroy spellcasters who wield dark forces. Through the Hexbreaker Charge mechanic, Covenbanes build power through combat — effective against all foes, but devastating against evil magic users with bonus debuffs, instant kills, and Witch Hunter's Precision triggering bonus radiant damage.`,

    roleplayIdentity: {
      title: "Roleplay Identity",
      content: `Covenbanes are driven by an unyielding hatred of evil magic and those who wield it. They may be religious inquisitors, seasoned monster hunters, or survivors of magical atrocities who have dedicated their lives to eradicating magical threats. Their anti-magic abilities manifest as holy silver weapons, divine seals that disrupt spells, and the ability to sense evil magic from afar.

Their dedication often shows physically: blessed silver weapons that glow when evil magic is near, holy seals tattooed on their skin that flare when spells are cast nearby, or an aura of righteous fury when confronting spellcasters.

Common Covenbane archetypes include:
- **The Inquisitor**: Religious hunter of heretics and dark sorcerers
- **The Witch Hunter**: Seasoned veteran who has faced countless magical threats
- **The Demon Slayer**: Specializes in hunting fiends and otherworldly entities
- **The Silver Knight**: Noble warrior wielding blessed weapons against evil
- **The Seal Bearer**: Marked by divine authority to judge and destroy magical corruption

Covenbanes understand that magic itself is not evil, but that evil corrupts everything it touches. They are the scalpel that removes the cancer of dark magic from the world.`,
    },

    combatRole: {
      title: "Combat Role",
      content: `The Covenbane is a specialized anti-magic striker that excels at:

**Spell Disruption**: Breaking enemy spells, silencing casters, and dispelling magical effects
**Evil Hunter**: Tracking and relentlessly pursuing evil magic users
**Area Control**: Creating zones where magic fails and evil creatures are weakened
**Radiant Damage**: Channeling divine power against evil and demonic threats

**Strengths**:
- Can completely shut down enemy spellcasters
- Builds charges through any combat, with bonuses against evil magic users
- Excellent at hunting and eliminating evil creatures
- Provides anti-magic protection for allies
- Witch Hunter's Precision adds passive bonus damage against evil casters
- Still effective in mundane encounters (full spell damage works on all targets)

**Weaknesses**:
- Bonus effects (debuffs, instant kills, charge refunds) only trigger against evil magic users
- Requires building Hexbreaker charges to use powerful abilities
- Less utility in non-magical encounters — a capable fighter, but not a specialist

The Covenbane shines in campaigns with significant magical threats, demonic encounters, and spellcaster antagonists. They are the perfect counter to evil sorcerers and fiendish invaders.`,
    },

    playstyle: {
      title: "Playstyle & Strategy",
      content: `Playing a Covenbane is about strategic anti-magic warfare and resource management. Key considerations:

**Building Hexbreaker Charges**:
- Deal damage to any enemy (+1 charge per hit)
- Use Covenbane spells (+1 charge per cast)
- Kill any enemy (+1 charge), kill evil magic users (+3 charges)
- Attack marked targets with Shadow Hunt for bonus charges

**Witch Hunter's Precision** (Level 2 Passive):
- Every 3rd weapon attack against an evil magic user deals 1d6 radiant damage bypassing resistance

**Hexbreaker Charge Strategy**:
- **1-2 Charges**: Basic anti-magic utilities and damage enhancement
- **3-4 Charges**: Area effects and spell disruption abilities
- **5-6 Charges**: Ultimate abilities and massive anti-magic effects

**Specialization Synergies**:
- **Shadowbane**: Stealth and assassination focus, perfect for hunting casters
- **Spellbreaker**: Anti-magic disruption, excels at shutting down spells
- **Demonhunter**: Pursuit and divine judgment, specializes in demonic threats

**Spell Design Rule**: All Covenbane spells deal full damage to any target. Bonus effects (debuffs, instant kills, charge refunds, extra damage dice) only activate against evil magic users.

**Team Dynamics**:
- Position to intercept enemy spellcasters
- Use area anti-magic effects to protect allies
- Coordinate with party to focus down magical threats
- Provide anti-magic support while others handle physical combat

**Anti-Magic Tactics**:
- Use Shadow Hunt to mark and track priority targets
- Dispel dangerous buffs before major encounters
- Create anti-magic zones during boss fights
- Save ultimate abilities for when enemies unleash powerful spells`,
    },

    combatExampleVsEvil: {
      title: "Combat Example: The Witch Hunt",
      content: `**The Setup**: You're a Covenbane (Spellbreaker) hunting a dark witch in a ruined temple. Your party: fighter, rogue, wizard. The witch is casting a summoning ritual. Starting Hexbreaker Charges: 0.

**Starting State**: HP: 85/85 | Hexbreaker Charges: 0 | Spells Ready: Shadow Hunt, Hex Strike, Silver Bolt

**Round 1 — Mark the Target**

*The witch gestures over a glowing circle. Demonic energy crackles.*

**Your Action**: Cast Shadow Hunt (bonus action) → Mark the witch
**Effect**: Advantage on attacks against her, +1d4 radiant per hit

*Hexbreaker Charges: 0 → 1*

**Your Attack**: Strike with Hex Strike active → Hit! +1d8 necrotic (evil target)

*Hexbreaker Charges: 1 → 2*

**Round 2 — Build and Punish**

*The witch hurls a fireball at your party.*

**Your Action**: Attack the witch again (advantage from Shadow Hunt)
**Effect**: Weapon damage + Shadow Hunt radiant. This is your 3rd attack vs an evil caster — Witch Hunter's Precision triggers! +1d6 radiant bypasses resistance.

*Hexbreaker Charges: 2 → 3*

**Round 3 — Shut Her Down**

*The witch begins her major summoning ritual.*

**Your Action**: Cast Anti-Magic Barrier (costs 2 charges)
**Effect**: 10ft dome where spells fail. The ritual sputters and dies.

*Hexbreaker Charges: 3 → 1*

**Round 4 — Finish the Hunt**

*Your fighter charges in. The witch is cornered.*

**Your Action**: Cast Hexbreaker Execution (costs 3 charges)
**Effect**: 6d10 radiant damage. The witch (28 HP) is an evil magic user at 25+ HP — no instant kill, but the damage is devastating. Fighter finishes her.

*Hexbreaker Charges: 0 → 3 (killing evil magic user = +3 charges)*

**Victory**: The witch is dead, the ritual stopped, and you're charged up for the next fight.`,
    },

    combatExampleMixed: {
      title: "Combat Example: The Bandit Ambush",
      content: `**The Setup**: Your party is ambushed by bandits on a forest road — no magic users, no evil auras. A mundane encounter. Starting Hexbreaker Charges: 2 (carried from last fight).

**Key Insight**: You're not useless without evil targets. Your spells still deal full damage and generate charges — you just lose the bonus effects.

**Round 1 — Charge Building**

*Three bandits rush from the treeline.*

**Your Action**: Cast Hex Strike (bonus action) → Attack the nearest bandit
**Effect**: +1d6 necrotic damage (not +1d8 — they're not evil). Generate 1 charge.

*Hexbreaker Charges: 2 → 3*

**Round 2 — Spend Wisely**

*The bandit chief charges you.*

**Your Action**: Cast Dark Pursuit (costs 1 charge) → Dash 30ft, advantage on next attack
**Effect**: Close the gap and strike with advantage.

*Hexbreaker Charges: 3 → 2*

**Round 3 — Clean Up**

**Your Action**: Cast Silver Bolt at a fleeing bandit
**Effect**: 2d8 radiant damage (doesn't curve around cover — they're not evil). Drops the bandit.

*Hexbreaker Charges: 2 → 2 (cast +1, spent 1)*

**Takeaway**: Against mundane enemies you're still a capable combatant — just without the extra debuffs, instant kills, and charge bonuses that make you devastating against evil casters.`,
    },
  },

  // Resource System
  resourceSystem: {
    title: "Hexbreaker Charges",
    subtitle: "Anti-Magic Power Through Confrontation",

    description: `The Covenbane is the ultimate answer to the corruption of dark magic. You build Hexbreaker Charges through relentless confrontation—attacking any foe builds your bank, but hunting evil magic users provides massive influxes of power. You spend these charges to unravel enchantments, silence casters, and deliver radiant judgment.`,

    cards: [
      {
        title: "Hexbreaker Charges (0-6)",
        stats: "Built through Combat",
        details:
          "Your stored anti-magic potential. Charges are generated by engaging in the hunt (attacks, kills, and spells) and persist between encounters.",
      },
      {
        title: "Witch Hunter's Precision",
        stats: "Level 2 Passive",
        details:
          "Every 3rd weapon attack against an evil magic user deals 1d6 Radiant damage. This damage bypasses all resistance and immunity.",
      },
    ],

    generationTable: {
      headers: ["Trigger", "Charges", "Notes"],
      rows: [
        [
          "Weapon Attack (Any target)",
          "+1",
          "Reliable building through combat",
        ],
        [
          "Cast Covenbane Spell",
          "+1",
          "Low-level spells often pay for themselves",
        ],
        [
          "Attack Marked Target",
          "+1 (Bonus)",
          "Use Shadow Hunt to accelerate your power",
        ],
        [
          "Defeat Evil Magic User",
          "+3",
          "The ultimate reward for a successful hunt",
        ],
        ["Defeat Any Other Enemy", "+1", "Minor trophies from the battlefield"],
      ],
    },

    usage: {
      momentum:
        "Spend 3-6 charges to trigger Execution effects or massive Anti-Magic Zones. Against evil casters, these abilities often include instant-kill thresholds or silence effects.",
      flourish:
        "⚠️ Precision Marking: Always open with 'Shadow Hunt'. It grants advantage and double-charges your attacks, allowing you to reach your 6-charge ultimate in half the time.",
    },

    overheatRules: {
      title: "Anti-Magic Superiority",
      content: `While the Covenbane doesn't "overheat," your efficiency depends entirely on the **nature of your target**.

**Mundane Targets**: 
- Your spells deal full damage.
- You lose all "Bane" effects (dispel, silence, or bonus damage).

**Evil Magic Users**: 
- Your abilities are supercharged. 
- Spells like "Silver Bolt" curve around cover, and "Hexbreaker Execution" can instantly destroy targets at low health.

**The Sense**: 
- You can detect evil magic within 60 feet. Use this to prioritize targets before they even begin casting.`,
    },

    strategicConsiderations: {
      title: "The Hunt: Targeting & Resource Management",
      content: `**Phase 1: The Mark (0-2 Charges)**: Cast 'Shadow Hunt' on the primary caster. Focus on building charges through quick strikes or 'Hex Strike'. You want to hit your mid-tier threshold as fast as possible.

**Phase 2: Disruption (3-4 Charges)**: Use 'Spellbreaker' or 'Anti-Magic Barrier' to shut down enemy rituals. You are now the most dangerous person on the field for a caster.

**Phase 3: Judgment (5-6 Charges)**: Unleash 'Hexbreaker Execution'. Against an evil caster, this is your "I Win" button, dealing massive damage and bypassing protections.

**Retention Strategy**: Don't spend all your charges on a minor bandit. Keep 3+ charges banked if you suspect a magical threat is looming nearby, as they persist between fights.

**Team Protection**: Stand near your allies. Your anti-magic zones can negate the fireballs and curses that would otherwise wipe your party.`,
    },

    playingInPerson: {
      title: "Playing in Person",
      subtitle: "The Silver Coins",
      content: `Use a tray of 6 Silver Coins or Metal Washers to track your power.

**Required Materials**:
- **6 Silver Coins** (Hexbreaker Charges)
- **1 Spare d6** (Precision Tally)
- **Silver Ring or Marker** (Bane Aura)

**The Resource Loop**:
- **Generate**: Flip a coin to the "Silver" side for each charge built.
- **Spend**: Slide coins toward the DM when you unleash your hunt.

**The Physical Hack (Friction Points)**:
- **Precision Tally**: Keep the d6 next to your dice. Each time you attack an evil caster, turn it: 1 → 2 → 3. On 3, you trigger **Witch Hunter's Precision**, then reset the die. Never miss your bonus radiant damage again.
- **The Bane Marker**: When you sense evil magic in an enemy (60ft), place a silver ring or marker around their mini. This reminds the entire team that your "Silver Bolt" and "Execution" bonuses are active against them.

**Pro Tips**: 
- Keep a specific "Shadow Hunt" token to place next to your marked prey — it reminds you to take your bonus charge on every hit.
- **Radiant Dice**: Use a distinct color (like white or gold) for your radiant bonus damage so you can roll it alongside your main weapon damage.`,
    },
  },

  // Class Features
  features: [
    {
      id: "witch_hunter_training",
      name: "Witch Hunter Training",
      description:
        "You gain proficiency with light armor, medium armor, shields, simple weapons, martial weapons, and alchemist's supplies.",
      level: 1,
    },
    {
      id: "hexbreaker_charges",
      name: "Hexbreaker Charges",
      description:
        "You build Hexbreaker charges by attacking evil magic users and using anti-magic abilities. Charges power your most devastating spells.",
      level: 1,
    },
    {
      id: "covenbane_magic",
      name: "Covenbane Magic",
      description:
        "You know the cantrips Light and Sacred Flame. At 2nd level you learn the spell Detect Magic.",
      level: 1,
    },
    {
      id: "witch_hunters_precision",
      name: "Witch Hunter's Precision",
      description:
        "Every 3rd weapon attack against an evil magic user deals 1d6 radiant damage that bypasses resistance and immunity. This damage cannot be reduced by any means.",
      level: 2,
    },
  ],

  // Talent Trees
  talentTrees: [
    {
      id: "shadowbane",
      name: "Shadowbane - Stealth & Assassination",
      description:
        "Masters of darkness and surprise, striking from the shadows to eliminate evil magic users.",
      icon: "Utility/Hide",
      color: "#2F2F4F",
      talents: [],
    },
    {
      id: "spellbreaker",
      name: "Spellbreaker - Anti-Magic Mastery",
      description:
        "Specialists in disrupting and destroying magical effects and spellcasters.",
      icon: "Arcane/Magical Cross Emblem 2",
      color: "#4F2F2F",
      talents: [],
    },
    {
      id: "demonhunter",
      name: "Demonhunter - Relentless Pursuit",
      description:
        "Fanatical hunters who mark and relentlessly pursue evil creatures across any distance.",
      icon: "Piercing/Targeted Strike",
      color: "#4F4F2F",
      talents: [],
    },
  ],

  // ═══════════════════════════════════════════════════════════════════
  // COVENBANE SPELLS BY LEVEL
  // ═════════════════════════════════════════════════════════════════
  exampleSpells: [
    // ===== LEVEL 1 SPELLS — Fundamentals (0 charges) =====

    {
      id: "cov_shadow_hunt",
      name: "Shadow Hunt",
      description:
        "Mark a creature within 60 feet with a spectral brand, sensing its presence and direction. Attacks against the marked target gain advantage and deal +1d4 radiant damage for 10 minutes.",
      level: 1,
      spellType: "ACTION",
      effectTypes: ["buff"],
      icon: "Piercing/Targeted Strike",
      typeConfig: {
        school: "shadow",
        icon: "Piercing/Targeted Strike",
        castTime: "1 bonus action",
        castTimeType: "bonus",
        range: "60 feet",
        rangeType: "ranged",
        tags: ["tracking", "marking", "utility"],
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: ["enemies"],
      },
      durationConfig: {
        durationType: "minutes",
        durationValue: 10,
        durationUnit: "minutes",
        requiresConcentration: true,
      },
      resourceCost: {
        resourceTypes: ["hexbreakerCharges"],
        resourceValues: { hexbreakerCharges: 0 },
        actionPoints: 1,
        components: ["verbal"],
      },
      classResource: { type: "hexbreaker", gain: 1 },
      buffConfig: {
        buffType: "statModifier",
        effects: [
          {
            name: "Hunter's Mark",
            description:
              "Advantage on attack rolls against marked target. Sense direction and distance within 10 miles.",
            mechanicsText: "",
            statModifier: {
              stat: "attack",
              magnitude: "advantage",
              magnitudeType: "special",
            },
          },
          {
            id: "mark_radiant_bonus",
            name: "Mark Weakness",
            description:
              "+1d4 radiant damage on weapon attacks against the marked target",
            mechanicsText: "1d4 radiant",
          },
        ],
        durationType: "minutes",
        durationValue: 10,
        durationUnit: "minutes",
        concentrationRequired: true,
        stackingRule: "replace",
        maxStacks: 1,
      },
      tags: ["tracking", "marking", "utility", "shadowbane"],
    },

    {
      id: "cov_hex_strike",
      name: "Hex Strike",
      description:
        "Imbue your weapon with disruptive hex energy. Your next melee attack deals +1d6 necrotic damage and generates 1 Hexbreaker Charge on hit. Against evil magic users, the damage increases to +1d8.",
      level: 1,
      spellType: "ACTION",
      effectTypes: ["buff"],
      icon: "Necrotic/Necrotic Skull",
      typeConfig: {
        school: "necrotic",
        icon: "Necrotic/Necrotic Skull",
        castTime: "1 bonus action",
        castTimeType: "bonus",
        range: "self",
        rangeType: "self",
        tags: ["damage", "weapon", "charge generation"],
      },
      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 1,
        durationUnit: "rounds",
        requiresConcentration: false,
      },
      resourceCost: {
        resourceTypes: ["hexbreakerCharges"],
        resourceValues: { hexbreakerCharges: 0 },
        actionPoints: 1,
        components: ["somatic"],
      },
      classResource: { type: "hexbreaker", gain: 1 },
      buffConfig: {
        buffType: "statModifier",
        effects: [
          {
            name: "Hex-Imbued Weapon",
            description:
              "Next melee attack deals +1d6 necrotic damage (+1d8 vs evil magic users). Generates 1 Hexbreaker Charge on hit against any target.",
            mechanicsText: "1d6 necrotic",
          },
        ],
        durationType: "rounds",
        durationValue: 1,
        durationUnit: "rounds",
        concentrationRequired: false,
        stackingRule: "replace",
        maxStacks: 1,
      },
      triggerConfig: {
        conditionalEffects: {
          buff: {
            isConditional: true,
            defaultEnabled: false,
            conditionalFormulas: {
              evil_magic_user: "1d8 necrotic bonus damage",
              default: "1d6 necrotic bonus damage",
            },
          },
        },
      },
      tags: ["damage", "weapon", "charge generation"],
    },

    {
      id: "cov_silver_blade",
      name: "Silver Blade",
      description:
        "Coat your weapon in blessed silver for 1 minute. Attacks deal +1d4 radiant damage. Against evil creatures, attacks also bypass magical resistance.",
      level: 1,
      spellType: "ACTION",
      effectTypes: ["buff"],
      icon: "Radiant/Radiant Beam",
      typeConfig: {
        school: "radiant",
        icon: "Radiant/Radiant Beam",
        castTime: "1 bonus action",
        castTimeType: "bonus",
        range: "self",
        rangeType: "self",
        tags: ["weapon", "anti magic", "resistance piercing"],
      },
      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },
      durationConfig: {
        durationType: "minutes",
        durationValue: 1,
        durationUnit: "minutes",
        requiresConcentration: true,
      },
      resourceCost: {
        resourceTypes: ["hexbreakerCharges"],
        resourceValues: { hexbreakerCharges: 0 },
        actionPoints: 1,
        components: ["verbal", "material"],
      },
      classResource: { type: "hexbreaker", gain: 1 },
      buffConfig: {
        buffType: "statModifier",
        effects: [
          {
            name: "Blessed Silver Coating",
            description:
              "Weapon attacks deal +1d4 radiant damage. Against evil creatures, attacks also bypass magical resistance and immunity.",
            mechanicsText: "1d4 radiant vs evil",
          },
        ],
        durationType: "minutes",
        durationValue: 1,
        durationUnit: "minutes",
        concentrationRequired: true,
        stackingRule: "replace",
        maxStacks: 1,
      },
      triggerConfig: {
        conditionalEffects: {
          buff: {
            isConditional: true,
            defaultEnabled: false,
            conditionalFormulas: {
              evil_magic_user: "+1d4 radiant + bypass magical resistance",
              default: "+1d4 radiant",
            },
          },
        },
      },
      tags: ["weapon", "anti magic", "resistance piercing", "demonhunter"],
    },

    {
      id: "cov_dark_pursuit",
      name: "Dark Pursuit",
      description:
        "Dash 30 feet on a wave of living shadow, ignoring difficult terrain and opportunity attacks. Gain advantage on your next melee attack.",
      level: 2,
      spellType: "ACTION",
      effectTypes: ["utility", "buff"],
      icon: "Utility/Speed Boot",
      typeConfig: {
        school: "shadow",
        icon: "Utility/Speed Boot",
        castTime: "1 action",
        castTimeType: "action",
        range: "self",
        rangeType: "self",
        tags: ["mobility", "speed", "utility"],
      },
      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 1,
        durationUnit: "rounds",
        requiresConcentration: false,
      },
      resourceCost: {
        resourceTypes: ["hexbreakerCharges"],
        resourceValues: { hexbreakerCharges: 1 },
        actionPoints: 1,
        components: ["somatic"],
      },
      classResource: { type: "hexbreaker", cost: 1 },
      utilityConfig: {
        utilityType: "movement",
        utilitySubtype: "speed",
        selectedEffects: [
          {
            id: "shadow_dash",
            name: "Shadow Dash",
            description:
              "Dash 30 feet without provoking opportunity attacks. Ignore difficult terrain until end of turn.",
            movementBonus: 30,
            duration: 1,
            durationUnit: "rounds",
            mechanicsText: "30 feet",
          },
        ],
        power: "moderate",
      },
      buffConfig: {
        buffType: "combatAdvantage",
        effects: [
          {
            id: "pursuit_advantage",
            name: "Relentless Strike",
            description: "Advantage on next melee attack this turn",
            mechanicsText: "",
          },
        ],
        durationType: "rounds",
        durationValue: 1,
        durationUnit: "rounds",
        concentrationRequired: false,
        stackingRule: "replace",
        maxStacks: 1,
      },
      triggerConfig: {
        conditionalEffects: {
          buff: {
            isConditional: true,
            defaultEnabled: false,
            conditionalFormulas: {
              evil_magic_user: "Dash 30ft + advantage + ignore difficult terrain",
              default: "Dash 30ft + advantage",
            },
          },
        },
      },
      tags: ["mobility", "speed", "utility", "shadowbane"],
    },

    {
      id: "cov_hex_weakness",
      name: "Hex of Weakness",
      description:
        "Afflict a target with a sigil unraveling their magic for 1 minute. Spell attacks suffer -2 penalty and spell save DC drops by 1. Evil casters have disadvantage on concentration checks when taking damage.",
      level: 2,
      spellType: "ACTION",
      effectTypes: ["debuff"],
      icon: "Necrotic/Necrotic Decay 1",
      typeConfig: {
        school: "necrotic",
        icon: "Necrotic/Necrotic Decay 1",
        castTime: "1 action",
        castTimeType: "action",
        range: "30 feet",
        rangeType: "ranged",
        tags: ["debuff", "curse", "anti magic"],
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
        targetRestrictions: ["enemies"],
      },
      durationConfig: {
        durationType: "minutes",
        durationValue: 1,
        durationUnit: "minutes",
        requiresConcentration: true,
      },
      resourceCost: {
        resourceTypes: ["hexbreakerCharges"],
        resourceValues: { hexbreakerCharges: 1 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
      },
      classResource: { type: "hexbreaker", cost: 1 },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
      debuffConfig: {
        debuffType: "statPenalty",
        effects: [
          {
            id: "weakened_magic",
            name: "Weakened Magic",
            description:
              "Spell attack rolls reduced by 2, spell save DC reduced by 1",
            statPenalty: [
              { stat: "spell_attack", value: -2 },
              { stat: "spell_dc", value: -1 },
            ],
            mechanicsText: "-2 Spell Attack, -1 Spell DC",
          },
          {
            id: "concentration_disruption",
            name: "Concentration Disruption",
            description:
              "Evil magic users have disadvantage on concentration checks when taking damage",
            statPenalty: {
              stat: "concentration",
              value: -99,
              magnitudeType: "disadvantage",
            },
            mechanicsText: "Disadvantage on Con checks (evil only)",
          },
        ],
        durationType: "minutes",
        durationValue: 1,
        durationUnit: "minutes",
        concentrationRequired: true,
        canBeDispelled: true,
        dispelDifficulty: "moderate",
        savingThrow: {
          ability: "spirit",
          difficultyClass: 13,
          saveOutcome: "negates",
        },
      },
      triggerConfig: {
        conditionalEffects: {
          debuff: {
            isConditional: true,
            defaultEnabled: false,
            conditionalFormulas: {
              evil_magic_user: "-2 Spell Attack, -1 Spell DC, disadvantage on concentration",
              default: "-2 Spell Attack, -1 Spell DC",
            },
          },
        },
      },
      tags: ["debuff", "curse", "anti magic", "spellbreaker"],
    },

    {
      id: "cov_silver_bolt",
      name: "Silver Bolt",
      description:
        "Launch a guided bolt of hardened silver light at a target within 60 feet. Deals 2d8 radiant damage. Against evil creatures, the bolt curves around cover and cannot be intercepted.",
      level: 2,
      spellType: "ACTION",
      effectTypes: ["damage"],
      icon: "Radiant/Radiant Bolt",
      typeConfig: {
        school: "radiant",
        icon: "Radiant/Radiant Bolt",
        castTime: "1 action",
        castTimeType: "action",
        range: "60 feet",
        rangeType: "ranged",
        tags: ["damage", "ranged", "anti magic"],
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: ["enemies"],
      },
      durationConfig: {
        durationType: "instant",
        durationValue: 0,
        durationUnit: "instant",
        requiresConcentration: false,
      },
      resourceCost: {
        resourceTypes: ["hexbreakerCharges"],
        resourceValues: { hexbreakerCharges: 1 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
      },
      classResource: { type: "hexbreaker", cost: 1 },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
      damageConfig: {
        formula: "2d8",
        damageType: "direct",
        elementType: "radiant",
        damageTypes: ["radiant"],
        canCrit: true,
        critMultiplier: 2,
        critDiceOnly: false,
        resolution: "DICE",
      },
      resolution: "DICE",
      triggerConfig: {
        conditionalEffects: {
          damage: {
            isConditional: true,
            defaultEnabled: false,
            conditionalFormulas: {
              evil_magic_user: "2d8 + 2d4",
              default: "2d8",
            },
          },
        },
      },
      tags: ["damage", "ranged", "anti magic", "demonhunter"],
    },

    // ===== LEVEL 3 SPELLS — Mid-Tier Tools (1-2 charges) =====

    {
      id: "cov_curse_eater",
      name: "Curse Eater",
      description:
        "Tear a curse, hex, or magical affliction from a creature you touch, healing them for 2d8 and gaining 1 Hexbreaker Charge if the affliction was evil magic.",
      level: 3,
      spellType: "ACTION",
      effectTypes: ["purification", "healing"],
      icon: "Necrotic/Devour",
      typeConfig: {
        school: "necrotic",
        icon: "Necrotic/Devour",
        castTime: "1 action",
        castTimeType: "action",
        range: "touch",
        rangeType: "touch",
        tags: ["dispel", "anti magic", "healing"],
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "touch",
        rangeDistance: 5,
        targetRestrictions: ["allies"],
      },
      durationConfig: {
        durationType: "instant",
        durationValue: 0,
        durationUnit: "instant",
        requiresConcentration: false,
      },
      resourceCost: {
        resourceTypes: ["hexbreakerCharges"],
        resourceValues: { hexbreakerCharges: 1 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
      },
      classResource: { type: "hexbreaker", cost: 1, gainOnEvilMagic: 1 },
      cooldownConfig: { cooldownType: "short_rest", cooldownValue: 1 },
      purificationConfig: {
        purificationType: "remove_curse",
        targetEffects: ["curse", "hex", "magical_affliction"],
        strength: "full",
        checkRequired: false,
        healAmount: "2d8",
      },
      healingConfig: {
        formula: "2d8",
        healingType: "direct",
        resolution: "DICE",
        hasHotEffect: false,
        hasShieldEffect: false,
      },
      tags: ["dispel", "anti magic", "healing", "spellbreaker"],
    },

    {
      id: "cov_shadow_ambush",
      name: "Shadow Ambush",
      description:
        "Dissolve into living shadow, becoming invisible for up to 1 minute. Your first melee attack from this state deals +2d6 necrotic damage with advantage and frightens evil magic users.",
      level: 3,
      spellType: "ACTION",
      effectTypes: ["buff"],
      icon: "Utility/Hide",
      typeConfig: {
        school: "shadow",
        icon: "Utility/Hide",
        castTime: "1 bonus action",
        castTimeType: "bonus",
        range: "self",
        rangeType: "self",
        tags: ["stealth", "utility", "shadowbane"],
      },
      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },
      durationConfig: {
        durationType: "minutes",
        durationValue: 1,
        durationUnit: "minutes",
        requiresConcentration: true,
      },
      resourceCost: {
        resourceTypes: ["hexbreakerCharges"],
        resourceValues: { hexbreakerCharges: 1 },
        actionPoints: 1,
        components: ["somatic"],
      },
      classResource: { type: "hexbreaker", cost: 1 },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
      buffConfig: {
        buffType: "statusEffectBuff",
        effects: [
          {
            id: "shadow_veil",
            name: "Shadow Veil",
            description:
              "Invisible to all creatures. Next melee attack deals +2d6 necrotic with advantage. Frightens evil magic users on hit.",
            mechanicsText: "2d6 necrotic",
          },
        ],
        statusEffects: [{ id: "invisible", level: 1 }],
        durationType: "minutes",
        durationValue: 1,
        durationUnit: "minutes",
        concentrationRequired: true,
        stackingRule: "replace",
        maxStacks: 1,
      },
      triggerConfig: {
        conditionalEffects: {
          buff: {
            isConditional: true,
            defaultEnabled: false,
            conditionalFormulas: {
              evil_magic_user: "2d6 necrotic + frighten target",
              default: "2d6 necrotic",
            },
          },
        },
      },
      tags: ["stealth", "utility", "shadowbane"],
    },

    {
      id: "cov_anti_magic_barrier",
      name: "Anti-Magic Barrier",
      description:
        "Project a 10-foot dome of anti-magic light for 3 rounds. Enemy spellcasters inside must Con save DC 14 or their spells fail. Allies inside gain +2 to saves against magic.",
      level: 3,
      spellType: "ACTION",
      effectTypes: ["buff", "utility"],
      icon: "Arcane/Magical Cross Emblem 2",
      typeConfig: {
        school: "necrotic",
        icon: "Arcane/Magical Cross Emblem 2",
        castTime: "1 action",
        castTimeType: "action",
        range: "self",
        rangeType: "self",
        tags: ["protection", "anti magic", "spellbreaker"],
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "sphere",
        aoeParameters: { radius: 10 },
        targetRestrictions: ["allies"],
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds",
        requiresConcentration: false,
      },
      resourceCost: {
        resourceTypes: ["hexbreakerCharges"],
        resourceValues: { hexbreakerCharges: 2 },
        actionPoints: 1,
        components: ["verbal"],
      },
      classResource: { type: "hexbreaker", cost: 2 },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
      utilityConfig: {
        utilityType: "environment",
        selectedEffects: [
          {
            id: "spell_disruption_zone",
            name: "Spell Disruption Zone",
            description:
              "Enemy spellcasters in zone must Con save DC 14 or spell fails. Allies gain +2 to saves vs magic.",
            duration: 5,
            durationUnit: "rounds",
            saveDC: 14,
            saveType: "constitution",
            mechanicsText: "10ft radius, 3 rounds",
          },
        ],
        power: "moderate",
      },
      buffConfig: {
        buffType: "damageMitigation",
        effects: [
          {
            id: "magic_resistance_aura",
            name: "Magic Resistance Aura",
            description:
              "+2 to all saving throws against spells and magical effects while inside the barrier",
            mechanicsText: "+2 save vs magic",
          },
        ],
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds",
        concentrationRequired: false,
        stackingRule: "replace",
        maxStacks: 1,
      },
      tags: ["protection", "anti magic", "spellbreaker"],
    },

    // ===== LEVEL 4 SPELLS — Strong Effects (2-3 charges) =====

    {
      id: "cov_silver_hex",
      name: "Silver Hex",
      description:
        "Brand a creature with a silver sigil that makes them vulnerable to radiant damage — all radiant damage from all sources is doubled. Evil magic users also suffer disadvantage on concentration checks when taking damage.",
      level: 4,
      spellType: "ACTION",
      effectTypes: ["debuff"],
      icon: "Radiant/Radiant Beam",
      typeConfig: {
        school: "radiant",
        icon: "Radiant/Radiant Beam",
        castTime: "1 action",
        castTimeType: "action",
        range: "30 feet",
        rangeType: "ranged",
        tags: ["debuff", "curse", "anti magic"],
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
        targetRestrictions: ["enemies"],
      },
      durationConfig: {
        durationType: "minutes",
        durationValue: 1,
        durationUnit: "minutes",
        requiresConcentration: true,
      },
      resourceCost: {
        resourceTypes: ["hexbreakerCharges"],
        resourceValues: { hexbreakerCharges: 2 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
      },
      classResource: { type: "hexbreaker", cost: 2 },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },
      debuffConfig: {
        debuffType: "statPenalty",
        effects: [
          {
            id: "radiant_vulnerability",
            name: "Radiant Vulnerability",
            description:
              "Vulnerable to radiant damage from all sources — radiant damage taken is doubled",
            statPenalty: {
              stat: "radiant_vulnerability",
              value: 100,
              magnitudeType: "percentage",
            },
            mechanicsText: "Radiant damage doubled",
          },
          {
            id: "silver_concentration_break",
            name: "Silver Disruption",
            description:
              "Evil magic users have disadvantage on concentration checks when taking damage",
            statPenalty: {
              stat: "concentration",
              value: -99,
              magnitudeType: "disadvantage",
            },
            mechanicsText: "Disadvantage on Con checks (evil only)",
          },
        ],
        durationType: "minutes",
        durationValue: 1,
        durationUnit: "minutes",
        concentrationRequired: true,
        canBeDispelled: true,
        dispelDifficulty: "hard",
        savingThrow: {
          ability: "spirit",
          difficultyClass: 15,
          saveOutcome: "negates",
        },
      },
      triggerConfig: {
        conditionalEffects: {
          debuff: {
            isConditional: true,
            defaultEnabled: false,
            conditionalFormulas: {
              evil_magic_user: "Radiant damage doubled + disadvantage on concentration",
              default: "Radiant damage doubled",
            },
          },
        },
      },
      tags: ["debuff", "curse", "anti magic", "demonhunter"],
    },

    {
      id: "cov_spirit_shackle",
      name: "Spirit Shackle",
      description:
        "Pin a target's shadow to the ground with anti-magic chains. The target is restrained for up to 1 minute (Spirit save DC 15 at end of each turn ends the effect). Attacks against the restrained target have advantage. Against evil magic users, the target is also silenced.",
      level: 4,
      spellType: "ACTION",
      effectTypes: ["control"],
      icon: "Necrotic/Corruption",
      typeConfig: {
        school: "shadow",
        icon: "Necrotic/Corruption",
        castTime: "1 action",
        castTimeType: "action",
        range: "30 feet",
        rangeType: "ranged",
        tags: ["crowd control", "root", "silence", "control"],
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
        targetRestrictions: ["enemies"],
      },
      durationConfig: {
        durationType: "minutes",
        durationValue: 1,
        durationUnit: "minutes",
        requiresConcentration: true,
      },
      resourceCost: {
        resourceTypes: ["hexbreakerCharges"],
        resourceValues: { hexbreakerCharges: 2 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
      },
      classResource: { type: "hexbreaker", cost: 2 },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },
      controlConfig: {
        controlType: "restrained",
        strength: "strong",
        duration: 1,
        durationType: "minutes",
        durationUnit: "minutes",
        savingThrow: {
          ability: "spirit",
          difficultyClass: 15,
          saveOutcome: "negates",
        },
        effects: [
          {
            id: "spirit_bind",
            name: "Spirit Bind",
            description:
              "Restrained. Speed reduced to 0. Attacks against target have advantage. Spirit save at end of each turn to break free. Silenced against evil magic users.",
            saveType: "spirit",
            saveDC: 15,
            condition: "restrained",
            duration: 3,
            durationUnit: "rounds",
            immobilize: true,
            silence: true,
            mechanicsText: "Speed 0, no verbal spells",
          },
        ],
        concentrationRequired: true,
        canBeDispelled: true,
      },
      triggerConfig: {
        conditionalEffects: {
          control: {
            isConditional: true,
            defaultEnabled: false,
            conditionalFormulas: {
              evil_magic_user: "Restrained + silenced, speed 0",
              default: "Restrained, speed 0",
            },
          },
        },
      },
      tags: ["crowd control", "root", "silence", "control", "shadowbane"],
    },

    {
      id: "cov_hexbreaker_precision",
      name: "Hexbreaker Precision",
      description:
        "Enter a state of magical perception for 1 minute. Gain +3 to attack rolls and +1d6 radiant damage on weapon attacks. Against evil magic users, your critical hit range expands to 19-20.",
      level: 4,
      spellType: "ACTION",
      effectTypes: ["buff"],
      icon: "Piercing/Focused Arrow Shot",
      typeConfig: {
        school: "necrotic",
        icon: "Piercing/Focused Arrow Shot",
        castTime: "1 bonus action",
        castTimeType: "bonus",
        range: "self",
        rangeType: "self",
        tags: ["buff", "accuracy", "anti magic"],
      },
      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },
      durationConfig: {
        durationType: "minutes",
        durationValue: 1,
        durationUnit: "minutes",
        requiresConcentration: true,
      },
      resourceCost: {
        resourceTypes: ["hexbreakerCharges"],
        resourceValues: { hexbreakerCharges: 2 },
        actionPoints: 1,
        components: ["verbal"],
      },
      classResource: { type: "hexbreaker", cost: 2 },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },
      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          {
            id: "precision_focus",
            name: "Hexbreaker Precision",
            description:
              "+3 to attack rolls, +1d6 radiant damage on weapon attacks. Expanded crit range vs evil magic users (19-20).",
            mechanicsText: "+3 Attack Rolls",
            statModifier: {
              stat: "attack",
              magnitude: 3,
              magnitudeType: "flat",
            },
          },
          {
            id: "precision_damage",
            name: "Radiant Strikes",
            description: "+1d6 radiant damage on all weapon attacks",
            mechanicsText: "1d6 radiant",
          },
          {
            id: "precision_crit",
            name: "Weakness Sight",
            description:
              "Critical hit range expanded by 1 against evil magic users",
            mechanicsText: "",
          },
        ],
        durationType: "minutes",
        durationValue: 1,
        durationUnit: "minutes",
        concentrationRequired: true,
        canBeDispelled: false,
        stackingRule: "replace",
        maxStacks: 1,
      },
      triggerConfig: {
        conditionalEffects: {
          buff: {
            isConditional: true,
            defaultEnabled: false,
            conditionalFormulas: {
              evil_magic_user: "+3 attack, +1d6 radiant, crit 19-20",
              default: "+3 attack, +1d6 radiant",
            },
          },
        },
      },
      tags: ["buff", "accuracy", "anti magic", "demonhunter"],
    },

    {
      id: "cov_silver_storm",
      name: "Silver Storm",
      description:
        "Fill a 20ft radius with whirling silver shards. Deals 5d6 radiant (Agility save DC 15 halves). Marks survivors — attacks vs marked creatures have advantage until your next turn.",
      level: 4,
      spellType: "ACTION",
      effectTypes: ["damage", "debuff"],
      icon: "Radiant/Bright Explosion",
      typeConfig: {
        school: "radiant",
        icon: "Radiant/Bright Explosion",
        castTime: "1 action",
        castTimeType: "action",
        range: "60 feet",
        rangeType: "ranged",
        tags: ["damage", "aoe", "radiant"],
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 60,
        aoeShape: "sphere",
        aoeParameters: { radius: 20 },
        targetRestrictions: ["enemies"],
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 1,
        durationUnit: "rounds",
        requiresConcentration: false,
      },
      resourceCost: {
        resourceTypes: ["hexbreakerCharges"],
        resourceValues: { hexbreakerCharges: 3 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
      },
      classResource: { type: "hexbreaker", cost: 3 },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },
      damageConfig: {
        formula: "5d6",
        elementType: "radiant",
        damageTypes: ["radiant"],
        canCrit: false,
        resolution: "DICE",
      },
      resolution: "SAVE",
      savingThrow: {
        ability: "agility",
        difficultyClass: 15,
        saveOutcome: "half_damage",
      },
      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          {
            id: "storm_mark",
            name: "Silver Mark",
            description:
              "Attacks against this creature have advantage until end of caster's next turn",
            statPenalty: {
              stat: "armor",
              value: -99,
              magnitudeType: "disadvantage_to_attackers",
            },
            mechanicsText: "Attacks against this creature have advantage",
          },
        ],
        durationType: "rounds",
        durationValue: 1,
        durationUnit: "rounds",
        canBeDispelled: true,
      },
      triggerConfig: {
        conditionalEffects: {
          damage: {
            isConditional: true,
            defaultEnabled: false,
            conditionalFormulas: {
              evil_magic_user: "5d6 radiant + advantage on all attacks vs marked",
              default: "5d6 radiant",
            },
          },
        },
      },
      tags: ["damage", "aoe", "radiant", "demonhunter"],
    },

    {
      id: "cov_hexbreaker_execution",
      name: "Hexbreaker Execution",
      description:
        "Channel Hexbreaker energy into a devastating melee strike. Deals 6d10 radiant damage to any target. Against evil magic users at 25 HP or lower, the target is instantly killed (Con save DC 16 negates). On kill, gain 2 charges.",
      level: 5,
      spellType: "ACTION",
      effectTypes: ["damage", "control"],
      icon: "Slashing/Execution",
      typeConfig: {
        school: "shadow",
        icon: "Slashing/Execution",
        castTime: "1 action",
        castTimeType: "action",
        range: "melee",
        rangeType: "melee",
        tags: ["execute", "control", "melee"],
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "melee",
        rangeDistance: 5,
        targetRestrictions: ["enemies"],
      },
      durationConfig: {
        durationType: "instant",
        durationValue: 0,
        durationUnit: "instant",
        requiresConcentration: false,
      },
      resourceCost: {
        resourceTypes: ["hexbreakerCharges"],
        resourceValues: { hexbreakerCharges: 3 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
      },
      classResource: { type: "hexbreaker", cost: 3, gainOnKill: 2 },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
      damageConfig: {
        formula: "6d10",
        elementType: "radiant",
        damageTypes: ["radiant"],
        canCrit: true,
        critMultiplier: 2,
        critDiceOnly: false,
        resolution: "DICE",
      },
      resolution: "DICE",
      controlConfig: {
        controlType: "incapacitated",
        strength: "severe",
        duration: 0,
        durationType: "instant",
        durationUnit: "instant",
        savingThrow: {
          ability: "constitution",
          difficultyClass: 16,
          saveOutcome: "negates",
        },
        effects: [
          {
            id: "divine_execution",
            name: "Divine Execution",
            description:
              "Instantly kill evil magic users at 25 HP or lower. On kill: gain 2 Hexbreaker Charges. Non-evil targets take damage only.",
            saveType: "constitution",
            saveDC: 16,
            condition: "death",
            duration: 1,
            durationUnit: "instant",
            mechanicsText: "DC 16 Con save or die",
          },
        ],
        canBeDispelled: false,
      },
      triggerConfig: {
        conditionalEffects: {
          damage: {
            isConditional: true,
            defaultEnabled: false,
            conditionalFormulas: {
              evil_magic_user: "6d10 radiant + instant kill at 25 HP (Con DC 16 negates) + gain 2 charges",
              default: "6d10 radiant",
            },
          },
        },
      },
      tags: ["execute", "control", "melee", "shadowbane"],
    },

    {
      id: "cov_anti_magic_field",
      name: "Anti-Magic Field",
      description:
        "Speak a word of absolute negation, creating a 15ft anti-magic sphere for 1 minute. No spells can be cast, summons vanish, magic items are suppressed, and concentration ends on entry.",
      level: 5,
      spellType: "ACTION",
      effectTypes: ["utility"],
      icon: "Necrotic/Protective Aura",
      typeConfig: {
        school: "necrotic",
        icon: "Necrotic/Protective Aura",
        castTime: "1 action",
        castTimeType: "action",
        range: "self",
        rangeType: "self",
        tags: ["aoe", "anti magic", "suppression", "spellbreaker"],
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "sphere",
        aoeParameters: { radius: 15 },
      },
      durationConfig: {
        durationType: "minutes",
        durationValue: 1,
        durationUnit: "minutes",
        requiresConcentration: true,
      },
      resourceCost: {
        resourceTypes: ["hexbreakerCharges"],
        resourceValues: { hexbreakerCharges: 4 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
      },
      classResource: { type: "hexbreaker", cost: 4 },
      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      utilityConfig: {
        utilityType: "environment",
        selectedEffects: [
          {
            id: "anti_magic_zone",
            name: "Anti-Magic Zone",
            description:
              "15ft sphere. No spells cast, summoned creatures vanish, magic items suppressed, concentration ends on entry. Moves with caster. Caster unaffected.",
            duration: 1,
            durationUnit: "minutes",
            radius: 15,
            mechanicsText: "15ft radius, 1 minute, concentration",
          },
        ],
        power: "major",
      },
      tags: ["aoe", "anti magic", "suppression", "spellbreaker"],
    },

    {
      id: "cov_hunters_net",
      name: "Hunter's Net",
      description:
        "Hurl a net of silver chains filling a 20ft radius. Targets are restrained and take 6d8 radiant damage (Strength save DC 16 negates). Against evil magic users, targets are also silenced and take 2d6 additional radiant each turn.",
      level: 5,
      spellType: "ACTION",
      effectTypes: ["control", "damage"],
      icon: "Necrotic/Crossed Bones",
      typeConfig: {
        school: "radiant",
        icon: "Necrotic/Crossed Bones",
        castTime: "1 action",
        castTimeType: "action",
        range: "30 feet",
        rangeType: "ranged",
        tags: ["aoe", "crowd control", "anti magic", "demonhunter"],
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 30,
        aoeShape: "sphere",
        aoeParameters: { radius: 20 },
        targetRestrictions: ["enemies"],
      },
      durationConfig: {
        durationType: "minutes",
        durationValue: 1,
        durationUnit: "minutes",
        requiresConcentration: true,
      },
      resourceCost: {
        resourceTypes: ["hexbreakerCharges"],
        resourceValues: { hexbreakerCharges: 3 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
      },
      classResource: { type: "hexbreaker", cost: 3 },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
      damageConfig: {
        formula: "6d8",
        elementType: "radiant",
        damageTypes: ["radiant"],
        canCrit: false,
        resolution: "DICE",
      },
      resolution: "SAVE",
      savingThrow: {
        ability: "strength",
        difficultyClass: 16,
        saveOutcome: "negates",
      },
      controlConfig: {
        controlType: "restrained",
        strength: "strong",
        duration: 1,
        durationType: "minutes",
        durationUnit: "minutes",
        savingThrow: {
          ability: "strength",
          difficultyClass: 16,
          saveOutcome: "negates",
        },
        effects: [
          {
            id: "silver_net",
            name: "Silver Chains",
            description:
              "Restrained, silenced, speed reduced to 5ft. Takes 2d6 radiant damage at start of each turn. Str save at end of each turn to break free.",
            saveType: "strength",
            saveDC: 15,
            condition: "restrained",
            duration: 3,
            durationUnit: "rounds",
            silence: true,
            dotFormula: "2d6",
            dotDamageType: "radiant",
            mechanicsText: "2d6 radiant/turn",
          },
        ],
        concentrationRequired: true,
        canBeDispelled: true,
      },
      triggerConfig: {
        conditionalEffects: {
          damage: {
            isConditional: true,
            defaultEnabled: false,
            conditionalFormulas: {
              evil_magic_user: "6d8 radiant + restrained + silenced + 2d6 radiant/turn",
              default: "6d8 radiant + restrained",
            },
          },
        },
      },
      tags: ["aoe", "crowd control", "anti magic", "demonhunter"],
    },

    // ===== LEVEL 6 SPELLS — Devastating (4-5 charges) =====

    {
      id: "cov_hexbreaker_fury",
      name: "Hexbreaker Fury",
      description:
        "Unleash a devastating shockwave of shadow and light in a 25-foot radius. Deals 8d6 necrotic damage (Con save DC 17 halves) and stuns targets for 1 round.",
      level: 6,
      spellType: "ACTION",
      effectTypes: ["damage", "control"],
      icon: "Poison/Poison Plague",
      typeConfig: {
        school: "necrotic",
        icon: "Poison/Poison Plague",
        castTime: "1 action",
        castTimeType: "action",
        range: "self",
        rangeType: "self",
        tags: ["aoe", "damage", "stun", "ultimate"],
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "sphere",
        aoeParameters: { radius: 25 },
        targetRestrictions: ["enemies"],
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 1,
        durationUnit: "rounds",
        requiresConcentration: false,
      },
      resourceCost: {
        resourceTypes: ["hexbreakerCharges"],
        resourceValues: { hexbreakerCharges: 5 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
      },
      classResource: { type: "hexbreaker", cost: 5 },
      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      damageConfig: {
        formula: "8d6",
        elementType: "necrotic",
        damageTypes: ["necrotic"],
        canCrit: false,
        resolution: "DICE",
      },
      resolution: "SAVE",
      savingThrow: {
        ability: "constitution",
        difficultyClass: 17,
        saveOutcome: "half_damage",
      },
      controlConfig: {
        controlType: "stunned",
        strength: "severe",
        duration: 1,
        durationType: "rounds",
        durationUnit: "rounds",
        savingThrow: {
          ability: "constitution",
          difficultyClass: 17,
          saveOutcome: "negates",
        },
        effects: [
          {
            id: "anti_magic_burst",
            name: "Anti-Magic Burst",
            description:
              "Stunned for 1 round on failed save. Half damage on successful save.",
            saveType: "constitution",
            saveDC: 17,
            condition: "stunned",
            duration: 1,
            durationUnit: "rounds",
            mechanicsText: "8d6 necrotic",
          },
        ],
        canBeDispelled: true,
      },
      triggerConfig: {
        conditionalEffects: {
          damage: {
            isConditional: true,
            defaultEnabled: false,
            conditionalFormulas: {
              evil_magic_user: "8d6 necrotic + stun + dispel enchantments",
              default: "8d6 necrotic + stun",
            },
          },
        },
      },
      tags: ["aoe", "damage", "stun", "ultimate", "spellbreaker"],
    },

    {
      id: "cov_shadow_eruption",
      name: "Shadow Eruption",
      description:
        "Erupt shadows upward in a 15-foot cone. Deals 8d6 necrotic damage (Agility save DC 17 halves) and blinds targets for 2 rounds, causing them to move randomly.",
      level: 6,
      spellType: "ACTION",
      effectTypes: ["damage", "debuff"],
      icon: "Void/Consumed by Void",
      typeConfig: {
        school: "shadow",
        icon: "Void/Consumed by Void",
        castTime: "1 action",
        castTimeType: "action",
        range: "self",
        rangeType: "self",
        tags: ["aoe", "damage", "debuff", "vision", "shadowbane"],
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "cone",
        aoeParameters: { radius: 15 },
        targetRestrictions: ["enemies"],
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 2,
        durationUnit: "rounds",
        requiresConcentration: false,
      },
      resourceCost: {
        resourceTypes: ["hexbreakerCharges"],
        resourceValues: { hexbreakerCharges: 4 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
      },
      classResource: { type: "hexbreaker", cost: 4 },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
      damageConfig: {
        formula: "8d6",
        elementType: "necrotic",
        damageTypes: ["necrotic"],
        canCrit: false,
        resolution: "DICE",
      },
      resolution: "SAVE",
      savingThrow: {
        ability: "agility",
        difficultyClass: 17,
        saveOutcome: "half_damage",
      },
      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          {
            id: "shadow_blindness",
            name: "Shadow Blindness",
            description:
              "Blinded for 2 rounds. Cannot see, automatically fails sight-based checks, disadvantage on attack rolls. Moves in a random direction at start of each turn.",
            statPenalty: {
              stat: "attack",
              value: -99,
              magnitudeType: "disadvantage",
            },
            mechanicsText:
              "Disadvantage on attack rolls for 2 rounds. Moves randomly.",
            statusType: "blinded",
            level: "moderate",
          },
        ],
        durationType: "rounds",
        durationValue: 2,
        durationUnit: "rounds",
        canBeDispelled: true,
        savingThrow: {
          ability: "agility",
          difficultyClass: 17,
          saveOutcome: "negates",
        },
      },
      triggerConfig: {
        conditionalEffects: {
          damage: {
            isConditional: true,
            defaultEnabled: false,
            conditionalFormulas: {
              evil_magic_user: "8d6 necrotic + blind + silence 1 round",
              default: "8d6 necrotic + blind",
            },
          },
        },
      },
      tags: ["aoe", "damage", "debuff", "vision", "shadowbane"],
    },

    {
      id: "cov_spell_nullification",
      name: "Spell Nullification",
      description:
        "Seal one of the target's known spells for 1 hour, making it completely inaccessible. Deals 3d8 psychic damage to evil magic users (Spirit save DC 17 negates).",
      level: 6,
      spellType: "ACTION",
      effectTypes: ["control", "damage"],
      icon: "Radiant/Golden Ring",
      typeConfig: {
        school: "necrotic",
        icon: "Radiant/Golden Ring",
        castTime: "1 action",
        castTimeType: "action",
        range: "60 feet",
        rangeType: "ranged",
        tags: ["anti magic", "seal", "spellbreaker"],
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: ["enemies"],
      },
      durationConfig: {
        durationType: "hours",
        durationValue: 1,
        durationUnit: "hours",
        requiresConcentration: false,
      },
      resourceCost: {
        resourceTypes: ["hexbreakerCharges"],
        resourceValues: { hexbreakerCharges: 4 },
        actionPoints: 2,
        components: ["verbal"],
      },
      classResource: { type: "hexbreaker", cost: 4 },
      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      damageConfig: {
        formula: "3d8",
        elementType: "psychic",
        damageTypes: ["psychic"],
        canCrit: false,
        resolution: "DICE",
      },
      resolution: "SAVE",
      savingThrow: {
        ability: "spirit",
        difficultyClass: 17,
        saveOutcome: "negates",
      },
      controlConfig: {
        controlType: "silenced",
        strength: "severe",
        duration: 1,
        durationType: "hours",
        durationUnit: "hours",
        savingThrow: {
          ability: "spirit",
          difficultyClass: 17,
          saveOutcome: "negates",
        },
        effects: [
          {
            id: "spell_seal",
            name: "Spell Seal",
            description:
              "One known spell becomes completely inaccessible for 1 hour. The sealed spell cannot be cast, prepared, or recalled. 3d8 psychic damage to evil magic users.",
            saveType: "spirit",
            saveDC: 17,
            condition: "silenced",
            duration: 1,
            durationUnit: "hours",
            mechanicsText: "DC 17 Spirit save",
          },
        ],
        canBeDispelled: true,
        dispelDifficulty: "very_hard",
      },
      triggerConfig: {
        conditionalEffects: {
          damage: {
            isConditional: true,
            defaultEnabled: false,
            conditionalFormulas: {
              evil_magic_user: "Seal spell + 3d8 psychic damage",
              default: "Seal spell only",
            },
          },
        },
      },
      tags: ["anti magic", "seal", "spellbreaker"],
    },

    // ===== LEVEL 7 SPELLS — Near-Ultimate (5-6 charges) =====

    {
      id: "cov_hexbreaker_storm",
      name: "Hexbreaker Storm",
      description:
        "Summon a persistent anti-magic storm in a 30-foot radius for 1 minute. Deals 3d8 radiant damage per round, imposes disadvantage on spellcasting, and prevents mana recovery.",
      level: 7,
      spellType: "ACTION",
      effectTypes: ["damage", "debuff"],
      icon: "Void/Black Hole",
      typeConfig: {
        school: "radiant",
        icon: "Void/Black Hole",
        castTime: "1 action",
        castTimeType: "action",
        range: "60 feet",
        rangeType: "ranged",
        tags: ["aoe", "damage over time", "anti magic", "concentration"],
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 60,
        aoeShape: "sphere",
        aoeParameters: { radius: 30 },
        targetRestrictions: ["enemies"],
      },
      durationConfig: {
        durationType: "minutes",
        durationValue: 1,
        durationUnit: "minutes",
        requiresConcentration: true,
      },
      resourceCost: {
        resourceTypes: ["hexbreakerCharges"],
        resourceValues: { hexbreakerCharges: 5 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
      },
      classResource: { type: "hexbreaker", cost: 5 },
      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      damageConfig: {
        formula: "3d8",
        elementType: "radiant",
        damageTypes: ["radiant"],
        hasDotEffect: true,
        dotConfig: {
          enabled: true,
          damagePerTick: "3d8",
          damageType: "radiant",
          duration: 3,
          tickFrequency: "round",
        },
        canCrit: false,
        resolution: "DICE",
      },
      resolution: "DICE",
      debuffConfig: {
        debuffType: "abilityDisable",
        effects: [
          {
            id: "anti_magic_weakening",
            name: "Anti-Magic Weakening",
            description:
              "Spellcasting at disadvantage. Cannot regain mana or spell slots. 3d8 radiant damage per round.",
            statPenalty: {
              stat: "spell_attack",
              value: -99,
              magnitudeType: "disadvantage",
            },
            mechanicsText: "3d8 radiant/round",
          },
        ],
        durationType: "minutes",
        durationValue: 1,
        durationUnit: "minutes",
        concentrationRequired: true,
        canBeDispelled: true,
        dispelDifficulty: "very_hard",
      },
      tags: [
        "aoe",
        "damage over time",
        "anti magic",
        "concentration",
        "spellbreaker",
      ],
    },

    {
      id: "cov_apex_predator",
      name: "Apex Predator",
      description:
        "Transform into a Void Hunter for 5 rounds, existing partially in the void. Immune to non-magical damage, teleport to attack visible creatures for free, and ignore Armor from physical armor and magic shields.",
      level: 7,
      spellType: "ACTION",
      effectTypes: ["transformation"],
      icon: "Void/Shadowy Potion",
      typeConfig: {
        school: "shadow",
        icon: "Void/Shadowy Potion",
        castTime: "1 action",
        castTimeType: "action",
        range: "self",
        rangeType: "self",
        tags: ["transformation", "mobility", "damage", "shadowbane"],
      },
      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 5,
        durationUnit: "rounds",
        requiresConcentration: false,
      },
      resourceCost: {
        resourceTypes: ["hexbreakerCharges"],
        resourceValues: { hexbreakerCharges: 6 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
      },
      classResource: { type: "hexbreaker", cost: 6 },
      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      transformationConfig: {
        transformationType: "spectral",
        targetType: "self",
        duration: 5,
        durationUnit: "rounds",
        power: "major",
        newForm: "Void Hunter",
        description:
          "Exist partially in the void, striking from impossible angles for 5 rounds.",
        grantedAbilities: [
          {
            id: "void_existence",
            name: "Void Existence",
            description: "Immune to all non-magical damage",
          },
          {
            id: "teleport_strike",
            name: "Teleport Strike",
            description:
              "Teleport to any visible creature as part of a melee attack (no action cost)",
          },
          {
            id: "ignore_defenses",
            name: "Ignore Defenses",
            description:
              "Attacks ignore Armor bonuses from physical armor and magical shields",
          },
        ],
      },
      triggerConfig: {
        conditionalEffects: {
          transformation: {
            isConditional: true,
            defaultEnabled: false,
            conditionalFormulas: {
              evil_magic_user: "+4d10 radiant vs evil, auto-detect alignment",
              default: "Melee reach 30ft, ignore armor",
            },
          },
        },
      },
      tags: ["transformation", "mobility", "damage", "shadowbane"],
    },

    {
      id: "cov_final_hour",
      name: "Final Hour",
      description:
        "When death nears, righteous fury takes hold for 3 rounds. Regain 50% HP, deal +3d8 radiant damage per attack, become immune to fear and charm, and cannot drop below 1 HP.",
      level: 7,
      spellType: "ACTION",
      effectTypes: ["buff", "healing"],
      icon: "Radiant/Divine Beam",
      typeConfig: {
        school: "radiant",
        icon: "Radiant/Divine Beam",
        castTime: "1 action",
        castTimeType: "action",
        range: "self",
        rangeType: "self",
        tags: ["buff", "damage", "last stand", "demonhunter"],
      },
      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds",
        requiresConcentration: false,
      },
      resourceCost: {
        resourceTypes: ["hexbreakerCharges"],
        resourceValues: { hexbreakerCharges: 6 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
      },
      classResource: { type: "hexbreaker", cost: 6 },
      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      buffConfig: {
        buffType: "statusEffectBuff",
        effects: [
          {
            id: "dying_fury",
            name: "Dying Fury",
            description:
              "Regain 50% of max HP. Attacks deal +3d8 radiant damage. Immune to fear and charm. Cannot be reduced below 1 HP by damage.",
            mechanicsText: "+3d8 radiant",
            statModifier: {
              stat: "damage_bonus",
              magnitude: "3d8",
              magnitudeType: "flat",
            },
          },
        ],
        statusEffects: [
          { id: "fear_immune", level: 1 },
          { id: "charm_immune", level: 1 },
        ],
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds",
        concentrationRequired: false,
        stackingRule: "replace",
        maxStacks: 1,
      },
      healingConfig: {
        formula: "50%",
        healingType: "percentage",
        resolution: "AUTOMATIC",
      },
      triggerConfig: {
        conditionalEffects: {
          buff: {
            isConditional: true,
            defaultEnabled: false,
            conditionalFormulas: {
              evil_magic_user: "+3d8 radiant vs evil, immune fear/charm, cannot die",
              default: "+3d8 radiant, immune fear/charm, cannot die",
            },
          },
        },
      },
      tags: ["buff", "healing", "last stand", "demonhunter"],
    },

    // ===== LEVEL 8 SPELLS — Ultimate-Tier (6 charges) =====

    {
      id: "cov_judgment_day",
      name: "Judgment Day",
      description:
        "Call down pillars of divine fire in a 40-foot radius. Deals 10d10 radiant damage (Charisma save DC 19 halves) against evil creatures.",
      level: 8,
      spellType: "ACTION",
      effectTypes: ["damage"],
      icon: "Radiant/Divine Blessing",
      typeConfig: {
        school: "radiant",
        icon: "Radiant/Divine Blessing",
        castTime: "1 action",
        castTimeType: "action",
        range: "60 feet",
        rangeType: "ranged",
        tags: ["aoe", "damage", "judgment", "demonhunter"],
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 60,
        aoeShape: "sphere",
        aoeParameters: { radius: 40 },
        targetRestrictions: ["enemies"],
      },
      durationConfig: {
        durationType: "instant",
        durationValue: 0,
        durationUnit: "instant",
        requiresConcentration: false,
      },
      resourceCost: {
        resourceTypes: ["hexbreakerCharges"],
        resourceValues: { hexbreakerCharges: 6 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
      },
      classResource: { type: "hexbreaker", cost: 6 },
      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      damageConfig: {
        formula: "10d10",
        elementType: "radiant",
        damageTypes: ["radiant"],
        canCrit: false,
        criticalConfig: {
          critType: "effect",
          critEffects: ["holy_ignition", "fear_aura"],
        },
        resolution: "DICE",
      },
      resolution: "SAVE",
      savingThrow: {
        ability: "charisma",
        difficultyClass: 19,
        saveOutcome: "half_damage",
      },
      triggerConfig: {
        conditionalEffects: {
          damage: {
            isConditional: true,
            defaultEnabled: false,
            conditionalFormulas: {
              evil_magic_user: "10d10 radiant + holy ignition + fear aura",
              default: "10d10 radiant",
            },
          },
        },
      },
      tags: ["aoe", "damage", "judgment", "demonhunter"],
    },

    {
      id: "cov_shadow_ascendant",
      name: "Shadow Ascendant",
      description:
        "Ascend to shadow form for 4 rounds. Melee reaches 30ft, bonus 2d6 necrotic strike vs different target, swap positions with any creature within 60ft.",
      level: 8,
      spellType: "ACTION",
      effectTypes: ["transformation"],
      icon: "Void/Consumed by Void",
      typeConfig: {
        school: "shadow",
        icon: "Void/Consumed by Void",
        castTime: "1 action",
        castTimeType: "action",
        range: "self",
        rangeType: "self",
        tags: ["transformation", "stealth", "damage", "shadowbane"],
      },
      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 4,
        durationUnit: "rounds",
        requiresConcentration: false,
      },
      resourceCost: {
        resourceTypes: ["hexbreakerCharges"],
        resourceValues: { hexbreakerCharges: 6 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
      },
      classResource: { type: "hexbreaker", cost: 6 },
      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      transformationConfig: {
        transformationType: "shadow",
        targetType: "self",
        duration: 4,
        durationUnit: "rounds",
        power: "major",
        newForm: "Shadow Ascendant",
        description: "Ascend to pure shadow form for 4 rounds.",
        grantedAbilities: [
          {
            id: "shadow_reach",
            name: "Shadow Reach",
            description: "Melee attack range extends to 30ft",
          },
          {
            id: "shadow_echo",
            name: "Shadow Echo",
            description:
              "After each attack, make a second attack dealing 2d6 necrotic damage against a different target within 15ft",
            damageFormula: "2d6",
          },
          {
            id: "shadow_step",
            name: "Shadow Step",
            description:
              "Swap positions with any creature within 60ft as a bonus action, becoming invisible until start of next turn",
          },
        ],
      },
      triggerConfig: {
        conditionalEffects: {
          transformation: {
            isConditional: true,
            defaultEnabled: false,
            conditionalFormulas: {
              evil_magic_user: "30ft reach + 2d6 necrotic echo + teleport + invisible on swap",
              default: "30ft reach + 2d6 necrotic echo + teleport",
            },
          },
        },
      },
      tags: ["transformation", "stealth", "damage", "shadowbane"],
    },

    {
      id: "cov_anti_magic_storm",
      name: "Anti-Magic Storm",
      description:
        "Summon a storm of anti-magic negation in a 35-foot radius for 3 rounds. Deals 10d6 necrotic damage, spells cast inside require 2 extra spell slots or fail, and magic items lose their enchantments.",
      level: 8,
      spellType: "ACTION",
      effectTypes: ["damage", "debuff"],
      icon: "Void/Black Hole",
      typeConfig: {
        school: "necrotic",
        icon: "Void/Black Hole",
        castTime: "1 action",
        castTimeType: "action",
        range: "60 feet",
        rangeType: "ranged",
        tags: ["aoe", "damage", "dispel", "spellbreaker"],
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 60,
        aoeShape: "sphere",
        aoeParameters: { radius: 35 },
        targetRestrictions: ["enemies"],
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds",
        requiresConcentration: true,
      },
      resourceCost: {
        resourceTypes: ["hexbreakerCharges"],
        resourceValues: { hexbreakerCharges: 6 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
      },
      classResource: { type: "hexbreaker", cost: 6 },
      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      damageConfig: {
        formula: "10d6",
        elementType: "necrotic",
        damageTypes: ["necrotic"],
        canCrit: false,
        resolution: "DICE",
      },
      resolution: "DICE",
      debuffConfig: {
        debuffType: "abilityDisable",
        effects: [
          {
            id: "magic_suppression_field",
            name: "Magic Suppression",
            description:
              "All spells cast in area require 2 additional spell slots or fail. Magic items lose all enchantment bonuses.",
            statPenalty: [
              {
                stat: "spell_slots",
                value: 2,
                magnitudeType: "additional_cost",
              },
            ],
            mechanicsText: "+2 spell slot cost",
          },
        ],
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds",
        concentrationRequired: true,
        canBeDispelled: true,
        dispelDifficulty: "very_hard",
      },
      triggerConfig: {
        conditionalEffects: {
          damage: {
            isConditional: true,
            defaultEnabled: false,
            conditionalFormulas: {
              evil_magic_user: "10d6 necrotic + spells cost +2 slots + items suppressed",
              default: "10d6 necrotic + spells cost +2 slots",
            },
          },
        },
      },
      tags: ["aoe", "damage", "dispel", "spellbreaker"],
    },

    // ===== LEVEL 9 SPELLS — Near-Pinnacle (6 charges) =====

    {
      id: "cov_hexbreaker_apocalypse",
      name: "Hexbreaker Apocalypse",
      description:
        "Unleash absolute negation in a 60-foot radius. Deals 12d10 necrotic damage (Charisma save DC 20 halves), destroys all magical effects and summons, and renders magic items inert for 1 hour.",
      level: 9,
      spellType: "ACTION",
      effectTypes: ["damage", "utility"],
      icon: "Necrotic/Necrotic Death",
      typeConfig: {
        school: "necrotic",
        icon: "Necrotic/Necrotic Death",
        castTime: "1 action",
        castTimeType: "action",
        range: "self",
        rangeType: "self",
        tags: ["aoe", "damage", "permanent", "spellbreaker"],
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "sphere",
        aoeParameters: { radius: 60 },
        targetRestrictions: ["enemies"],
      },
      durationConfig: {
        durationType: "instant",
        durationValue: 0,
        durationUnit: "instant",
        requiresConcentration: false,
      },
      resourceCost: {
        resourceTypes: ["hexbreakerCharges"],
        resourceValues: { hexbreakerCharges: 6 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
      },
      classResource: { type: "hexbreaker", cost: 6 },
      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      damageConfig: {
        formula: "12d10",
        elementType: "necrotic",
        damageTypes: ["necrotic"],
        canCrit: false,
        criticalConfig: {
          critType: "effect",
          critEffects: ["magic_annihilation", "silence_aura"],
        },
        resolution: "DICE",
      },
      resolution: "SAVE",
      savingThrow: {
        ability: "charisma",
        difficultyClass: 20,
        saveOutcome: "half_damage",
      },
      utilityConfig: {
        utilityType: "environment",
        selectedEffects: [
          {
            id: "apocalypse_field",
            name: "Apocalypse Field",
            description:
              "60ft sphere. All magical effects, enchantments, and summons destroyed. Magic items rendered inert for 1 hour. Spellcasters silenced for 1d4 rounds. The area counts as difficult terrain for 10 minutes.",
            duration: 1,
            durationUnit: "hours",
            radius: 60,
            mechanicsText: "60ft radius, all magic destroyed",
          },
        ],
        power: "major",
      },
      triggerConfig: {
        conditionalEffects: {
          damage: {
            isConditional: true,
            defaultEnabled: false,
            conditionalFormulas: {
              evil_magic_user: "12d10 necrotic + destroy all magic + silence 1d4 rounds + silence aura",
              default: "12d10 necrotic + destroy all magic",
            },
          },
        },
      },
      tags: ["aoe", "damage", "permanent", "spellbreaker"],
    },

    {
      id: "cov_void_hunter",
      name: "Void Hunter",
      description:
        "Phase into the void between worlds for 3 rounds. Become intangible and undetectable, deal 4d10 necrotic damage per melee attack bypassing all defenses, and teleport up to 120ft as a free action.",
      level: 9,
      spellType: "ACTION",
      effectTypes: ["transformation"],
      icon: "Psychic/Psionic Boom",
      typeConfig: {
        school: "shadow",
        icon: "Psychic/Psionic Boom",
        castTime: "1 action",
        castTimeType: "action",
        range: "self",
        rangeType: "self",
      triggerConfig: {
        conditionalEffects: {
          transformation: {
            isConditional: true,
            defaultEnabled: false,
            conditionalFormulas: {
              evil_magic_user: "4d10 necrotic bypass all defenses + intangible + 120ft teleport",
              default: "4d10 necrotic bypass all defenses + intangible + 120ft teleport",
            },
          },
        },
      },
      tags: ["transformation", "stealth", "assassination", "shadowbane"],
      },
      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds",
        requiresConcentration: false,
      },
      resourceCost: {
        resourceTypes: ["hexbreakerCharges"],
        resourceValues: { hexbreakerCharges: 6 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
      },
      classResource: { type: "hexbreaker", cost: 6 },
      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      transformationConfig: {
        transformationType: "shadow",
        targetType: "self",
        duration: 3,
        durationUnit: "rounds",
        power: "major",
        newForm: "Void Hunter",
        description: "Phase into the void between worlds for 3 rounds.",
        grantedAbilities: [
          {
            id: "void_phase",
            name: "Void Phase",
            description:
              "Intangible — immune to all damage and effects. Cannot be detected by any means.",
          },
          {
            id: "void_strike",
            name: "Void Strike",
            description:
              "Melee attacks from the void deal 4d10 necrotic damage and bypass all armor and resistances",
            damageFormula: "4d10",
          },
          {
            id: "void_teleport",
            name: "Void Teleport",
            description:
              "Teleport to any unoccupied space within 120ft as a free action",
          },
        ],
      },
      tags: ["transformation", "stealth", "assassination", "shadowbane"],
    },

    {
      id: "cov_divine_executioner",
      name: "Divine Executioner",
      description:
        "Become an instrument of divine justice for 5 rounds. Instantly read all creatures' alignments, deal +4d10 radiant damage against evil with weapon attacks, and gain complete immunity to evil-sourced damage and effects.",
      level: 9,
      spellType: "ACTION",
      effectTypes: ["transformation"],
      icon: "Radiant/Radiant Warrior",
      typeConfig: {
        school: "radiant",
        icon: "Radiant/Radiant Warrior",
        castTime: "1 action",
        castTimeType: "action",
        range: "self",
        rangeType: "self",
        tags: ["transformation", "damage", "demonhunter"],
      },
      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 5,
        durationUnit: "rounds",
        requiresConcentration: false,
      },
      resourceCost: {
        resourceTypes: ["hexbreakerCharges"],
        resourceValues: { hexbreakerCharges: 6 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
      },
      classResource: { type: "hexbreaker", cost: 6 },
      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      transformationConfig: {
        transformationType: "divine",
        targetType: "self",
        duration: 5,
        durationUnit: "rounds",
        power: "major",
        newForm: "Divine Executioner",
        description: "Become an instrument of divine justice for 5 rounds.",
        grantedAbilities: [
          {
            id: "divine_judge",
            name: "Divine Judge",
            description:
              "Instantly know the true alignment of every creature you can see",
          },
          {
            id: "execution_strike",
            name: "Execution Strike",
            description:
              "Weapon attacks deal +4d10 radiant damage against evil creatures",
            damageFormula: "4d10",
          },
          {
            id: "evil_immunity",
            name: "Evil Immunity",
            description:
              "Immune to all damage and effects from evil-aligned creatures and sources",
          },
        ],
      },
      triggerConfig: {
        conditionalEffects: {
          transformation: {
            isConditional: true,
            defaultEnabled: false,
            conditionalFormulas: {
              evil_magic_user: "+4d10 radiant vs evil + immune evil damage + detect alignment",
              default: "+4d10 radiant + detect alignment",
            },
          },
        },
      },
      tags: ["transformation", "damage", "demonhunter"],
    },

    // ===== LEVEL 10 SPELLS — Ultimate (6 charges) =====

    {
      id: "cov_hexbreaker_armageddon",
      name: "Hexbreaker Armageddon",
      description:
        "Erase all magic in a 100ft radius permanently. Deals 18d6 necrotic damage (Cha save DC 20 negates), all spells and enchantments destroyed, and evil casters who fail lose spellcasting permanently.",
      level: 10,
      spellType: "ACTION",
      effectTypes: ["damage", "utility"],
      icon: "Necrotic/Ritual",
      typeConfig: {
        school: "necrotic",
        icon: "Necrotic/Ritual",
        castTime: "1 action",
        castTimeType: "action",
        range: "self",
        rangeType: "self",
        tags: ["aoe", "damage", "permanent", "anti magic"],
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "sphere",
        aoeParameters: { radius: 100 },
      },
      durationConfig: {
        durationType: "permanent",
        durationValue: 0,
        durationUnit: "permanent",
        requiresConcentration: false,
      },
      resourceCost: {
        resourceTypes: ["hexbreakerCharges"],
        resourceValues: { hexbreakerCharges: 6 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
      },
      classResource: { type: "hexbreaker", cost: 6 },
      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      damageConfig: {
        formula: "18d6",
        elementType: "necrotic",
        damageTypes: ["necrotic"],
        canCrit: false,
        criticalConfig: {
          critType: "effect",
          critEffects: ["magic_annihilation", "reality_break"],
        },
        resolution: "DICE",
      },
      resolution: "SAVE",
      savingThrow: {
        ability: "charisma",
        difficultyClass: 20,
        saveOutcome: "negates",
      },
      utilityConfig: {
        utilityType: "environment",
        selectedEffects: [
          {
            id: "permanent_magic_ending",
            name: "Permanent Magic Death",
            description:
              "100ft sphere. All magic permanently destroyed. Spells fail, enchantments end, magic items become inert. Magic cannot function here again. Cha save or permanently lose spellcasting.",
            radius: 100,
            mechanicsText: "100ft radius, permanent",
          },
        ],
        power: "major",
      },
      triggerConfig: {
        conditionalEffects: {
          damage: {
            isConditional: true,
            defaultEnabled: false,
            conditionalFormulas: {
              evil_magic_user: "18d6 necrotic + permanently lose spellcasting on fail",
              default: "18d6 necrotic + magic destroyed",
            },
          },
        },
      },
      tags: ["aoe", "damage", "permanent", "anti magic", "spellbreaker"],
    },

    {
      id: "cov_shadow_god",
      name: "Shadow God",
      description:
        "Ascend to shadow godhood for 3 rounds. Immune to all damage except radiant, teleport freely within 120ft, and attacks against evil auto-crit. Gain 2 exhaustion levels when it ends.",
      level: 10,
      spellType: "ACTION",
      effectTypes: ["transformation"],
      icon: "Utility/Summon Minion",
      typeConfig: {
        school: "shadow",
        icon: "Utility/Summon Minion",
        castTime: "1 action",
        castTimeType: "action",
        range: "self",
        rangeType: "self",
      triggerConfig: {
        conditionalEffects: {
          transformation: {
            isConditional: true,
            defaultEnabled: false,
            conditionalFormulas: {
              evil_magic_user: "Auto-crit vs evil + immune all but radiant + 120ft teleport",
              default: "Immune all but radiant + 120ft teleport",
            },
          },
        },
      },
      tags: ["transformation", "ultimate", "shadowbane"],
      },
      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds",
        requiresConcentration: false,
      },
      resourceCost: {
        resourceTypes: ["hexbreakerCharges"],
        resourceValues: { hexbreakerCharges: 6 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
      },
      classResource: { type: "hexbreaker", cost: 6 },
      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      transformationConfig: {
        transformationType: "shadow",
        targetType: "self",
        duration: 3,
        durationUnit: "rounds",
        power: "major",
        newForm: "Shadow God",
        description: "Ascend to the pinnacle of shadow mastery for 3 rounds.",
        grantedAbilities: [
          {
            id: "shadow_immunity",
            name: "Shadow Immunity",
            description: "Immune to all damage except radiant",
          },
          {
            id: "instant_teleport",
            name: "Instant Teleport",
            description:
              "Teleport anywhere within 120ft as a free action (no action points)",
          },
          {
            id: "auto_crit_evil",
            name: "Auto-Crit Evil",
            description:
              "All attacks against evil creatures automatically critical hit",
          },
          {
            id: "shadow_exhaustion",
            name: "Shadow Exhaustion",
            description: "Gain 2 levels of exhaustion when transformation ends",
          },
        ],
      },
      tags: ["transformation", "ultimate", "shadowbane"],
    },

    {
      id: "cov_divine_incarnation",
      name: "Divine Incarnation",
      description:
        "Become an avatar of divine judgment for 3 rounds. Evil creatures within 30ft take 3d8 radiant damage per round, you're immune to evil-sourced damage, and once per round instantly kill an evil creature at 50 HP or below. Gain 2 exhaustion levels when it ends.",
      level: 10,
      spellType: "ACTION",
      effectTypes: ["transformation"],
      icon: "Radiant/Winged Angel",
      typeConfig: {
        school: "radiant",
        icon: "Radiant/Winged Angel",
        castTime: "1 action",
        castTimeType: "action",
        range: "self",
        rangeType: "self",
      triggerConfig: {
        conditionalEffects: {
          transformation: {
            isConditional: true,
            defaultEnabled: false,
            conditionalFormulas: {
              evil_magic_user: "3d8 radiant/round aura + instant kill 50 HP evil + immune evil",
              default: "Immune evil damage + divine aura",
            },
          },
        },
      },
      tags: ["transformation", "ultimate", "demonhunter"],
      },
      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds",
        requiresConcentration: false,
      },
      resourceCost: {
        resourceTypes: ["hexbreakerCharges"],
        resourceValues: { hexbreakerCharges: 6 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
      },
      classResource: { type: "hexbreaker", cost: 6 },
      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      transformationConfig: {
        transformationType: "divine",
        targetType: "self",
        duration: 3,
        durationUnit: "rounds",
        power: "major",
        newForm: "Divine Incarnation",
        description: "Become an avatar of divine justice for 3 rounds.",
        grantedAbilities: [
          {
            id: "divine_aura",
            name: "Divine Aura",
            description:
              "Evil creatures within 30ft take 3d8 radiant damage per round and are frightened",
            damageFormula: "3d8",
          },
          {
            id: "evil_immunity_full",
            name: "Complete Evil Immunity",
            description:
              "Immune to all damage and effects from evil creatures and sources",
          },
          {
            id: "execution_blow",
            name: "Execution Blow",
            description:
              "Once per round, instantly kill any evil creature within 30ft that has 50 HP or fewer",
          },
          {
            id: "divine_exhaustion",
            name: "Divine Exhaustion",
            description: "Gain 2 levels of exhaustion when transformation ends",
          },
        ],
      },
      tags: ["transformation", "ultimate", "demonhunter"],
    },
  ],

  // ═════════════════════════════════════════════════════════════════
  // SPELL POOLS BY LEVEL
  // ═════════════════════════════════════════════════════════════════
  spellPools: {
    1: ["cov_shadow_hunt", "cov_hex_strike", "cov_silver_blade"],
    2: ["cov_dark_pursuit", "cov_hex_weakness", "cov_silver_bolt"],
    3: ["cov_curse_eater", "cov_shadow_ambush", "cov_anti_magic_barrier"],
    4: [
      "cov_spirit_shackle",
      "cov_hexbreaker_precision",
      "cov_silver_storm",
      "cov_silver_hex",
    ],
    5: ["cov_hexbreaker_execution", "cov_anti_magic_field", "cov_hunters_net"],
    6: [
      "cov_hexbreaker_fury",
      "cov_shadow_eruption",
      "cov_spell_nullification",
    ],
    7: ["cov_hexbreaker_storm", "cov_apex_predator", "cov_final_hour"],
    8: ["cov_judgment_day", "cov_shadow_ascendant", "cov_anti_magic_storm"],
    9: [
      "cov_hexbreaker_apocalypse",
      "cov_void_hunter",
      "cov_divine_executioner",
    ],
    10: [
      "cov_hexbreaker_armageddon",
      "cov_shadow_god",
      "cov_divine_incarnation",
    ],
  },
};
