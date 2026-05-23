/**
 * Augur Class Data
 *
 * Complete surgical overhaul for the Augur - the Visceral Haruspex who reads
 * the immediate, blood-soaked future in fresh gore, spilt blood, and splintered marrow.
 *
 * Fueling Benediction and Malediction through d20 Even/Odd outcomes and self-mutilation,
 * this class dominates immediate preemptive action economy and round-by-round survival.
 */

export const AUGUR_DATA = {
  id : "augur",
  name: "Augur",
  icon: "fas fa-skull-crossbones",
  role: "Visceral Haruspex (Omen Reading, Flesh Mutilation & Preemptive Evasion)",
  damageTypes: ["psychic", "radiant"],

  overview: {
    title: "The Augur",
    subtitle: "Visceral Haruspex of the Ripped Flesh",

    quickOverview: {
      title: "Quick Overview",
      content: `**What You Must Know**: Augurs do not gaze at clean stars; they read the immediate, raw future in wet meat. Every time a d20 rolls within 60 feet—yours, an ally's, or an enemy's—the number speaks: Even results generate **Benediction** (radiant, agonizing foresight) while Odd results generate **Malediction** (psychic, decaying curses). You spend these twin resources to alter the immediate 6 seconds of combat.

**Core Mechanic**: d20 Roll → Even = +1 Benediction, Odd = +1 Malediction. Spend Benediction for preemptive evasion and warding, Malediction for crippling curses and agonizing rot.

**Fatal Flaw**: Magic demands fresh violence. If no bleeding targets or fresh corpses are present within 60 feet, your omen spells cannot perceive the future. To force them to speak, you must carve into your own meat, dealing slashing damage to yourself and inducing a Bleed condition.

**Why Bring Me?**: You dominate the round-by-round action economy. You provide absolute preemptive evasion to allies targeted by deadly strikes, or congeal warm blood across their weapons to guarantee devastating critical counter-strikes.`,
    },

    description: `The Augur is a tragic seer of the immediate gutter. While scholars squabble over ancient astronomical charts, the Augur plunges their hands into fresh wounds and reads the heat of spilling intestines. They do not predict broad cosmic destinies—they divine the exact trajectory of a blade, the snapping point of a bone, and the moment a throat will open. Every vision demands a toll of sanity or flesh; magic is not a formula, but a visceral mutilation that must be paid for in blood.`,

    roleplayIdentity: {
      title: "Roleplay Identity",
      content: `Augurs carry the crushing weight of tomorrow's tragedy today. They see the maggots in the skin of the living, and hear the death rattle in every laugh. Trained in dark folklore, forgotten woodland clearings, or desperate war camps, they use visceral catalysts to force reality to flinch. They are commonly known as:

**The Gut-Sifter**: A grim diviner who follows the path of armies, sifting through corpses and reading the warm patterns of exposed intestines.
**The Bone-Fracturer**: One who reads the cracks in their own knuckles or the shattered limbs of foes to map the pressure points of fate.
**The Self-Flayer**: A flagellant who believes that the only clean portal to the future is the opening of their own skin.
**The Crow-Call**: A desolate storm reader who maps the flight patterns of carrion birds, tracing where the next carcass will drop.
**The Desolate Oracle**: A ruined prophet who was blinded by a radiant vision of their own end, left to navigate the darkness by feeling the hot blood of others.

Augurs speak in hushed, heavy tones, like a funeral dirge. They are methodology-driven, intensely observant, and carry the smell of copper and rot wherever they walk.`,
    },

    combatRole: {
      title: "Combat Role",
      content: `In the visceral theater of war, Augurs are architects of survival and suffering:

**Preemptive Evasion**: Utilizing reactions to force attacks to automatically miss, shifting allies out of harm's way before blood is drawn.
**Critical Manipulation**: Guaranteeing devastating critical hits or immediate critical counter-strikes by tracing sigils of congealed blood.
**Visceral Debuffs**: Breaking bones, splintering marrow, and inflicting profound vulnerability through target flesh mutilation.
**Self-Inflicted Fuel**: Sacrificing their own health and enduring self-induced Bleed states to cast spells when the battlefield is clean of fresh gore.

Augurs are not frontline gladiators, nor are they safe, back-line spellcasters. They are high-risk, high-reward catalysts of immediate probability who must bleed to keep their allies breathing.`,
    },

    playstyle: {
      title: "Playstyle",
      content: `Playing an Augur is a lesson in tragic economy and intense focus:

**Track Every Die**: You are a hawk watching the table. Every d20 roll—attack, save, or check—directly builds your dual pools.
**Balance the Scales**: You must constantly juggle your Benediction (boons) and Malediction (curses), spending them strategically as the dice dictate.
**Accept the Agony**: You must be willing to slice your own HP and suffer Bleed damage when starting a fight from ambush or facing clean enemies, knowing that blood is the only key to your magic.
**Preemptive Focus**: You do not heal damage after it occurs; you prevent it by rewriting the incoming strike before the blade touches meat.`,
    },

    immersiveCombatExample: {
      title: "Combat Example: The Haruspex's Toll",
      content: `**The Setup**: You are an Augur (Harbinger specialization) creeping through a plague-blighted ruin with your party. A massive, iron-clad abominable executioner blocks the path. The room is quiet; no blood has been spilt. You have 0 Benediction and 0 Malediction. You must act.

**Turn 1 - The First Incision**
*Because no bleeding targets or fresh corpses exist, your eyes are blind to the future. You pull your ritual flaying hook and drag it across your own left forearm, carving the first sign.*
* **Self-Mutilation**: You take 1d6 slashing damage (4 HP lost) and suffer Bleed (1d4 damage at the start of your turn for 3 rounds). This generates +2 Malediction.
* **Your Action**: Cast "Splintered Bone Portent" on the Executioner (8 Mana + 2 Malediction spent).
* **Effect**: You scream the fracture you see. The executioner staggers as his femur cracks internally. He takes 2d6 psychic damage and suffers -2 Armor and -10ft speed for 3 rounds.
* **Mana**: 45 → 37/55.
* **Malediction**: 2 → 0/15.
* **Current State**: Malediction: 0/15 | Benediction: 0/5 | HP: 46/50 | Bleed Active (3 rounds)

**Turn 2 - The Blood Flows**
*The executioner roars in agony, his bones splintering from within. The fight begins.*
* **Fighter's Turn**: Attacks the executioner → d20+6 → [12] → Hit! 
* **Omen Reading**: 12 is even → +1 Benediction.
* **Enemy's Turn**: The executioner swings his massive cleaver at the Fighter → d20+7 → [17] → Hit!
* **Omen Reading**: 17 is odd → +1 Malediction.
* **Your Reaction**: Spend 1 Benediction and 1 Malediction to cast "Gore-Sown Foresight".
* **Effect**: You read the spray of dust and sweat. You pull the threads of the immediate six seconds. The cleaver cleaves empty air as the Fighter slips 10 feet backward under your frantic warning, completely evading the attack without opportunity strikes.
* **Current State**: Malediction: 0/15 | Benediction: 0/5 | HP: 46/50 | Fighter untouched. The executioner cleaves nothing but shadow.`,
    },
  },

  resourceSystem: {
    title: "Benediction & Malediction of the Haruspex",
    subtitle: "Agonizing Foresight & Fracturing Curses",

    description: `The Augur's magic is driven by the immediate vibration of combat. Every d20 roll within 60 feet generated by any creature fuels the Haruspex:
- **Even Rolls**: Generate 1 **Benediction**—the radiant, blinding flash of immediate preservation.
- **Odd Rolls**: Generate 1 **Malediction**—the psychic, decaying rot of immediate doom.

⚠️ **The Haruspex Flaw**: Your omen-reading spells require fresh violence. If no bleeding targets or fresh corpses exist within 60 feet, your vision is blind. You must execute a **Self-Mutilation** action (0 AP, once per round): take 1d6 slashing damage and inflict Bleed (1d4 damage at start of turn for 3 rounds) on yourself to generate 2 Benediction or 2 Malediction of your choice.

⚠️ **Omen Debt**: Your soul cannot safely hold these visions. At the end of a long rest, any unused Benediction or Malediction decays. If you had unused resources, your mind is scourged by the ghosts of unfulfilled futures, inflicting **Omen Debt** (a permanent -1 penalty to all saving throws per unused point, capped at -10) until you spill blood in combat again.`,

    cards: [
      {
        title: "Benediction",
        stats: "0-10 Scale (Hierophant: 15)",
        details:
          "Generated by even d20 rolls. Spent on immediate defense, preemptive evasion, and radiant warding of flesh.",
      },
      {
        title: "Malediction",
        stats: "0-10 Scale (Harbinger: 15)",
        details:
          "Generated by odd d20 rolls. Spent on bone-splintering psychic damage, crippling physical penalties, and vulnerability markings.",
      },
      {
        title: "Visceral Haruspex",
        stats: "Self-Mutilation",
        details:
          "If no fresh violence is spilt, you must flay your own flesh to generate omens. Spills 1d6 HP and inflicts self-bleed for 3 rounds.",
      },
    ],

    usage: {
      momentum:
        "Spill blood early. Once an enemy or ally is bleeding, your vision opens and you no longer need to mutilate yourself. Watch the rolls of allies and foes to dynamically adapt your action plan.",
      flourish:
        "Use your immediate reactions. Saving an ally from a fatal strike with Gore-Sown Foresight or guaranteeing a critical counter-strike turns the tides of battle instantly.",
    },

    overheatRules: {
      title: "Omen Exhaustion & The Flesh Tax",
      content: `The Augur's manipulation of immediate fate carries severe physical and mental tolls:

**The Resource Caps**:
Your specialization limits your absolute capacity to store fate:
* **Auspex (Balanced)**: 10 Benediction / 10 Malediction.
* **Harbinger (Doom)**: 5 Benediction / 15 Malediction.
* **Hierophant (Grace)**: 15 Benediction / 5 Malediction.
Any resource generated beyond these caps is lost and immediately deals 1 psychic damage per wasted point directly to the Augur's mind.

**The Flesh Tax (Operational Friction)**:
Many advanced spells demand an aggressive sacrifice of the caster's own physical integrity. You do not simply spend mana; you spend your own max HP, split your skin, or blind your own eyes to make the omens absolute.

**The Omen Debt (The Unwritten Future)**:
Fate demands resolution. If you hoard Benediction or Malediction without spending them, the unfulfilled paths twist inward. For every point of omen resource remaining at a long rest, you suffer 1 stack of Omen Debt. Each stack reduces all saving throws by 1 (max -10). The only way to cleanse Omen Debt is to complete a combat encounter where you successfully trigger at least three critical strikes or absolute evasions.`,
    },

    essenceGenerationTable: {
      title: "Haruspex Resource Generation",
      headers: ["Action", "Resource Gained", "Notes"],
      rows: [
        [
          "Even d20 Roll within 60ft",
          "+1 Benediction",
          "Generated by attacks, saves, or checks of allies, enemies, or yourself",
        ],
        [
          "Odd d20 Roll within 60ft",
          "+1 Malediction",
          "Generated by attacks, saves, or checks of allies, enemies, or yourself",
        ],
        [
          "Self-Mutilation (No Violence Present)",
          "+2 Benediction or Malediction",
          "Takes 1d6 slashing damage and inflicts self-bleed (1d4/round, 3 rounds)",
        ],
        [
          "Reading Fresh Entrails (Corpse within 10ft)",
          "+3 Benediction or Malediction",
          "Requires 1 Action. Sifts through a creature that died this round",
        ],
      ],
    },

    loaInvocationTable: {
      title: "Immediate Action Rites",
      headers: ["Rite", "Resource Cost", "Defensive / Offensive Focus", "Effect Summary"],
      rows: [
        [
          "Gore-Sown Foresight",
          "1 Benediction + 1 Malediction",
          "Absolute Defense",
          "Reaction: Incoming attack automatically misses; ally slips 10ft away",
        ],
        [
          "Omen of the Flayed Strike",
          "2 Benediction",
          "Absolute Offense",
          "Action: Next weapon attack is a guaranteed critical hit or critical counter-strike",
        ],
        [
          "Splintered Bone Portent",
          "2 Malediction",
          "Target Crippling",
          "Action: Cracks bones internally. Deals 2d6 psychic, -2 Armor, -10ft speed",
        ],
      ],
    },
  },

  specializations: {
    title: "Visceral Specializations",
    subtitle: "Three Paths of the Agonizing Sign",

    description: `Every Haruspex must choose how they interpret the spilt gore of the world. Will you balance the scales of agony, rot away in the shadow of doom, or burn your own sight to channel searing grace?`,

    passiveAbility: {
      name: "Omen's Path",
      description:
        "Your specialization alters your dual resource caps and unlocks distinct rites of flesh manipulation.",
    },

    specs: [
      { id : "auspex",
        name: "Auspex",
        icon: "fa-eye",
        color: "#C8A2C8",
        theme: "Balanced Haruspex",

        description: `Auspices seek the perfect, terrifying equilibrium between creation and decay. They believe that fate is a scale that must be balanced in blood. By reading both the radiant spray of life and the dark rot of death, they keep their parties hovering just above the grave while dragging their foes into it.`,

        playstyle: "Balanced control, dynamic adaptation, dual-purpose warding",

        strengths: [
          "Maximum resource caps set to a balanced 10 Benediction and 10 Malediction",
          "Spelling dual costs (both BN and ML) have their mana costs reduced by 30%",
          "Gain +1 to all saving throws while both resource pools are exactly equal",
          "Can spend 1 Benediction and 1 Malediction to instantly cleanse a physical condition",
        ],

        weaknesses: [
          "Lacks the extreme burst damage of Harbingers",
          "Lacks the high-impact protection zones of Hierophants",
          "Highly vulnerable when one resource pool is empty while the other is full",
        ],

        specPassive: {
          name: "Symmetric Foresight",
          description:
            "10/10 dual resource caps. Dual-cost spells cost 30% less mana. +1 to all saves when pools are balanced.",
        },

        keyAbilities: [
          "Cruciform Omen: Traces a bloody cross, splitting a target's destiny between blessing and curse",
          "Gore-Mist Tempests: A swirling storm of spilt gore that heals allies and blinds enemies",
          "Sovereign Haruspex: The ultimate transformation, giving total command over the dice.",
        ],
      },

      { id : "harbinger",
        name: "Harbinger",
        icon: "fa-cloud-bolt",
        color: "#8B5A8B",
        theme: "Prophet of the Black Ash",

        description: `Harbingers have stared too long into the screaming dark. Their bodies are maps of scars, their veins running with blackened maledictory rot. They care nothing for preservation; they seek only to accelerate the end. Every omen they read is a weapon, every word they whisper a fracture in a foe's skull.`,

        playstyle: "High-risk offensive psychic damage, crippling debuffs, vulnerability stacking",

        strengths: [
          "Maximum resource caps set to 5 Benediction and 15 Malediction",
          "All psychic damage ignores enemy resistances entirely",
          "Malediction-fueled spells deal +2d6 additional psychic damage",
          "Inflicting Bleed on an enemy generates +1 Malediction automatically",
        ],

        weaknesses: [
          "Extremely fragile; max HP reduced permanently by 10%",
          "Almost entirely lacks defensive or healing capabilities",
          "Highly prone to self-induced Bleed hazards",
        ],

        specPassive: {
          name: "Maledictory Rot",
          description:
            "5/15 dual resource caps. Psychic damage ignores resistance. Malediction spells deal +2d6 psychic damage.",
        },

        keyAbilities: [
          "Flayed Eyes Gaze: Shatters a target's mind with visions of their own skinning",
          "Ruinous Flaying Hex: A massive, crippling curse that paralyzes and rots target meat",
          "Harbinger of the Black Ash: Transform into an aura of pure, decaying death.",
        ],
      },

      { id : "hierophant",
        name: "Hierophant",
        icon: "fa-sun",
        color: "#DAA520",
        theme: "Martyr of the Blinding Splinters",

        description: `Hierophants are tragic martyrs who burn away their own sight to channel the searing, blinding light of tomorrow. They read the golden, agonizing threads of grace, congealing spilt blood into shields of shining marrow. They endure immense physical pain to ensure their allies never feel a wound.`,

        playstyle: "Aggressive defensive support, massive damage-mitigation zones, radiant healing",

        strengths: [
          "Maximum resource caps set to 15 Benediction and 5 Malediction",
          "All healing spells restore 50% more HP",
          "Benediction-fueled spells grant allies +2 Armor for 2 rounds",
          "Can absorb 50% of all damage taken by nearby allies passively",
        ],

        weaknesses: [
          "Extremely low damage output; physical weapon strikes deal half damage",
          "Spells have high mana costs",
          "Absorbing ally damage makes them highly prone to sudden death",
        ],

        specPassive: {
          name: "Searing Grace",
          description:
            "15/5 dual resource caps. Healing increased by 50%. Benediction spells grant +2 Armor to allies.",
        },

        keyAbilities: [
          "Martyr's Shroud: Wraps allies in a congealed ward that absorbs catastrophic damage",
          "Blinding Cathedral of Bones: Consecrates a zone with radiant bone splinters that blind foes and heal allies",
          "Hierophant of Blinding Splinters: Transform into a beacon of blinding light, repelling all evil.",
        ],
      },
    ],
  },

  exampleSpells: [
    // ============================================================
    // LEVEL 1 SPELLS (5)
    // ============================================================

    { id : "augur_read_the_signs",
      name: "Read the Guts",
      description:
        "You plunge your hands into a fresh wound or a corpse to read the steam rising from the exposed viscera. If no violence is present, you slice your own palm, forcing the omens to speak. The tragic patterns reveal the target's fatal structural flaw.",
      level: 1,
      spellType: "ACTION",
      icon: "Necrotic/Ritual",
      effectTypes: ["debuff"],
      typeConfig: {
        school: "psychic",
        icon: "Necrotic/Ritual",
        tags: ["debuff", "haruspex", "vulnerability", "omen"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: ["enemies"],
        maxTargets: 1,
        requiresLineOfSight: true,
      },
      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 4 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        classResource: { type: "malediction", cost: 1 },
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          { id : "gut_read_vulnerability",
            name: "Exposed Flaw",
            description: "Target has +50% vulnerability to psychic damage for 3 rounds.",
            mechanicsText: "Imposes 50% psychic vulnerability on the target.",
            statusEffect: {
              vulnerabilityType: "psychic",
              vulnerabilityPercent: 50,
            },
          },
        ],
        savingThrow: {
          ability: "spirit",
          difficultyClass: 13,
          saveOutcome: "negates",
        },
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds",
        canBeDispelled: true,
      },
      resolution: "DICE",
      tags: ["debuff", "haruspex", "vulnerability", "omen"],
    },

    { id : "augur_omen_shield",
      name: "Gore-Sown Foresight",
      description:
        "You read the arterial spray of a targeted ally six seconds before the strike lands. Screaming an agonizing warning, you tear the fabric of probability to yank them out of harm's way, leaving the enemy cleaving nothing but shadow.",
      level: 1,
      spellType: "REACTION",
      icon: "Nature/Ethereal Bear Spirit",
      effectTypes: ["buff", "utility"],
      typeConfig: {
        school: "psychic",
        icon: "Nature/Ethereal Bear Spirit",
        tags: ["reaction", "evasion", "preemptive", "omen"],
        castTime: 1,
        castTimeType: "REACTION",
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
        targetRestrictions: ["allies"],
        maxTargets: 1,
      },
      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 6 },
        actionPoints: 0,
        components: ["verbal"],
        classResource: { type: "benediction", cost: 2 },
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },
      buffConfig: {
        buffType: "damageMitigation",
        effects: [
          { id : "preemptive_evasion",
            name: "Gore-Sown Evasion",
            description:
              "The next attack targeting this ally automatically misses. The ally immediately shifts up to 10 feet without provoking opportunity strikes.",
            mechanicsText: "Forces next attack to miss. Ally moves 10ft free.",
          },
        ],
        durationType: "rounds",
        durationValue: 1,
        durationUnit: "rounds",
        canBeDispelled: false,
      },
      utilityConfig: {
        utilityType: "movement",
        selectedEffects: [
          { id : "preemptive_shift",
            name: "Fated Shift",
            description: "Shift 10 feet out of danger without provoking opportunity strikes.",
            distance: 10,
          },
        ],
        power: "minor",
      },
      resolution: "AUTOMATIC",
      tags: ["reaction", "evasion", "preemptive", "omen"],
    },

    { id : "augur_minor_portent",
      name: "Arterial Curse",
      description:
        "You fling a drop of your own fresh blood toward a foe. The blood congeals in mid-air, forming a floating, jagged rune of tragedy. Their eyes cloud with black spots as their heartbeats sync to a slow, dying rhythm.",
      level: 1,
      spellType: "ACTION",
      icon: "Necrotic/Corruption",
      effectTypes: ["debuff", "damage"],
      typeConfig: {
        school: "psychic",
        icon: "Necrotic/Corruption",
        tags: ["debuff", "damage", "curse", "omen"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: ["enemies"],
        maxTargets: 1,
        requiresLineOfSight: true,
      },
      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 4 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        classResource: { type: "malediction", cost: 1 },
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          { id : "arterial_curse_debuff",
            name: "Arterial Decay",
            description: "Target has -2 to all attack rolls as their vision clouds with rot.",
            mechanicsText: "-2 penalty to all attack rolls.",
          },
        ],
        savingThrow: {
          ability: "spirit",
          difficultyClass: 13,
          saveOutcome: "negates",
        },
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds",
        canBeDispelled: true,
      },
      damageConfig: {
        formula: "1d6",
        damageTypes: ["psychic"],
        resolution: "DICE",
      },
      resolution: "DICE",
      tags: ["debuff", "damage", "curse", "omen"],
    },

    { id : "augur_sign_of_clarity",
      name: "Omen of the Flayed Strike",
      description:
        "You paint a wet, crimson sigil on an ally's weapon. In their mind, they see the absolute, terrifying vulnerability of their foe—their guard shattered, their throat exposed. A guaranteed, bone-splintering strike.",
      level: 1,
      spellType: "ACTION",
      icon: "Radiant/Divine Downward Sword",
      effectTypes: ["buff"],
      typeConfig: {
        school: "radiant",
        icon: "Radiant/Divine Downward Sword",
        tags: ["buff", "critical", "support", "omen"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
        targetRestrictions: ["allies"],
        maxTargets: 1,
      },
      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 5 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        classResource: { type: "benediction", cost: 2 },
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },
      buffConfig: {
        buffType: "custom",
        effects: [
          { id : "flayed_strike_buff",
            name: "Fated Critical",
            description:
              "The next weapon strike is a guaranteed critical hit. If the ally is attacked before their turn, they may immediately execute a critical counter-strike as a reaction.",
            mechanicsText: "Next attack is a critical hit, or enables critical counter-strike reaction.",
          },
        ],
        durationType: "rounds",
        durationValue: 1,
        durationUnit: "rounds",
        canBeDispelled: true,
      },
      resolution: "AUTOMATIC",
      tags: ["buff", "critical", "support", "omen"],
    },

    { id : "augur_desperate_omen",
      name: "Death-Stretched Panic",
      description:
        "When your flesh is reduced to a bloody pulp, your visions of death sharpen into a hyper-focused panic. Agony overrides your fear, giving you the desperate agility of a cornered beast.",
      level: 1,
      spellType: "PASSIVE",
      icon: "Psychic/Mental Chaos",
      effectTypes: ["passive"],
      typeConfig: {
        school: "psychic",
        icon: "Psychic/Mental Chaos",
        tags: ["passive", "debuff", "omen", "augur"],
        castTime: 0,
        castTimeType: "PASSIVE",
      },
      targetingConfig: {
        targetingType: "self",
      },
      resourceCost: {
        resourceTypes: [],
        resourceValues: {},
        actionPoints: 0,
      },
      resolution: "AUTOMATIC",
      tags: ["passive", "debuff", "omen", "augur"],
    },

    // ============================================================
    // LEVEL 2 SPELLS (3)
    // ============================================================

    { id : "augur_portent_of_weakness",
      name: "Splintered Bone Portent",
      description:
        "You declare an omen of imminent fracture. An invisible, crushing weight slams down on the target's joints, cracking their bone structure internally. They stagger, their armor splitting under their own weight.",
      level: 2,
      spellType: "ACTION",
      icon: "Necrotic/Bone Shards",
      effectTypes: ["debuff", "damage"],
      typeConfig: {
        school: "psychic",
        icon: "Necrotic/Bone Shards",
        tags: ["debuff", "damage", "crippling", "omen"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: ["enemies"],
        maxTargets: 1,
        requiresLineOfSight: true,
      },
      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 8 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        classResource: { type: "malediction", cost: 2 },
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
      debuffConfig: {
        debuffType: "statPenalty",
        effects: [
          { id : "splintered_bone_debuff",
            name: "Cracked Frame",
            description: "Target has -2 Armor and their Agility is reduced by 2 for 3 rounds.",
            mechanicsText: "-2 Armor and -2 Agility.",
          },
        ],
        statPenalties: [
          { stat: "armor", magnitude: -2, magnitudeType: "flat" },
          { stat: "agility", magnitude: -2, magnitudeType: "flat" },
        ],
        savingThrow: {
          ability: "constitution",
          difficultyClass: 14,
          saveOutcome: "negates",
        },
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds",
        canBeDispelled: true,
      },
      damageConfig: {
        formula: "2d6",
        damageTypes: ["psychic"],
        resolution: "DICE",
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds",
        concentrationRequired: true,
      },
      resolution: "DICE",
      tags: ["debuff", "damage", "crippling", "omen"],
    },

    { id : "augur_terrain_of_ruin",
      name: "Fleshy Consecration",
      description:
        "You pour a chalice of decayed blood onto the earth. The soil instantly putrefies, bubbling into a wet bog of rotting offal and sharp bone fragments. Enemies who walk here are slowed as the dead grasp at their boots.",
      level: 2,
      spellType: "ACTION",
      icon: "Necrotic/Corruption",
      effectTypes: ["damage", "debuff"],
      typeConfig: {
        school: "necrotic",
        icon: "Necrotic/Corruption",
        tags: ["area", "damage", "debuff", "hazard", "omen"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 60,
        areaConfig: { areaType: "circle", areaSize: 20, areaSizeUnit: "ft" },
        targetRestrictions: ["enemies"],
        maxTargets: 15,
        targetSelectionMethod: "manual",
        requiresLineOfSight: true,
      },
      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 10 },
        actionPoints: 1,
        components: ["verbal", "somatic", "material"],
        materialComponents: "A cup of stagnant blood",
        classResource: { type: "malediction", cost: 3 },
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
      debuffConfig: {
        debuffType: "statPenalty",
        effects: [
          { id : "fleshy_bog_slow",
            name: "Rotting Grasp",
            description: "Movement speed halved and -2 to all Agility saving throws while in the zone.",
            mechanicsText: "Speed halved, -2 Agility saves.",
          },
        ],
        statPenalties: [
          { stat: "speed", magnitude: -50, magnitudeType: "percent" },
          { stat: "agility_saves", magnitude: -2, magnitudeType: "flat" },
        ],
        durationType: "rounds",
        durationValue: 5,
        durationUnit: "rounds",
        canBeDispelled: false,
      },
      damageConfig: {
        formula: "1d6",
        damageTypes: ["psychic"],
        hasDotEffect: true,
        dotConfig: {
          dotFormula: "1d6",
          duration: 5,
          tickFrequency: "turn",
          isProgressiveDot: false,
        },
        resolution: "DICE",
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 5,
        durationUnit: "rounds",
        concentrationRequired: true,
      },
      resolution: "DICE",
      tags: ["area", "damage", "debuff", "hazard", "omen"],
    },

    { id : "augur_sign_of_protection",
      name: "Congealed Aegis",
      description:
        "You trace your fingers through spilling blood and flick it at an ally. The warm spray congeals in mid-air, hardening into a shimmering, iron-hard carapace of scab and golden light that drinks incoming trauma.",
      level: 2,
      spellType: "ACTION",
      icon: "Radiant/Divine Blessing",
      effectTypes: ["buff"],
      typeConfig: {
        school: "radiant",
        icon: "Radiant/Divine Blessing",
        tags: ["buff", "armor", "mitigation", "omen"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 40,
        targetRestrictions: ["allies"],
        maxTargets: 1,
      },
      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 6 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        classResource: { type: "benediction", cost: 3 },
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },
      buffConfig: {
        buffType: "custom",
        effects: [
          { id : "congealed_aegis_buff",
            name: "Congealed Resolve",
            description: "Grants +3 Armor and resistance to the next source of physical damage.",
            mechanicsText: "+3 Armor, physical resistance (1 charge).",
          },
        ],
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds",
        canBeDispelled: true,
      },
      resolution: "AUTOMATIC",
      tags: ["buff", "armor", "mitigation", "omen"],
    },

    // ============================================================
    // LEVEL 3 SPELLS (3)
    // ============================================================

    { id : "augur_omen_bolt",
      name: "Lance of Fractured Marrow",
      description:
        "You thrust your hand forward, casting a dual lance of burning radiant marrow and shattering psychic screams. If the immediate combat signs are even, the bolt strikes with terrible, blinding intensity.",
      level: 3,
      spellType: "ACTION",
      icon: "Radiant/Radiant Sunburst",
      effectTypes: ["damage"],
      typeConfig: {
        school: "psychic",
        secondaryElement: "radiant",
        icon: "Radiant/Radiant Sunburst",
        tags: ["attack", "damage", "dual_element", "omen"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: ["enemies"],
        maxTargets: 1,
        requiresLineOfSight: true,
      },
      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 12 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        classResource: { type: "benediction", cost: 2 },
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
      damageConfig: {
        formula: "3d8",
        damageTypes: ["psychic", "radiant"],
        secondaryDamage: {
          formula: "1d8",
          condition: "If the damage roll total is even, deal additional radiant damage.",
        },
        resolution: "DICE",
      },
      resolution: "DICE",
      tags: ["attack", "damage", "dual_element", "omen"],
    },

    { id : "augur_harbinger_gaze",
      name: "Flayed Eyes Gaze",
      description:
        "You lock eyes with a target and force them to see their own body flayed to the bone, their flesh hung to dry. The horror fractures their mind, leaving them shrieking and clawing at their own face in blind terror.",
      level: 3,
      spellType: "ACTION",
      icon: "Psychic/Psionic Boom",
      effectTypes: ["damage", "debuff"],
      typeConfig: {
        school: "psychic",
        icon: "Psychic/Psionic Boom",
        tags: ["damage", "debuff", "fear", "omen"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 40,
        targetRestrictions: ["enemies"],
        maxTargets: 1,
        requiresLineOfSight: true,
      },
      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 12 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        classResource: { type: "malediction", cost: 3 },
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },
      damageConfig: {
        formula: "3d6",
        damageTypes: ["psychic"],
        resolution: "DICE",
      },
      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          { id : "flayed_gaze_fear",
            name: "Frightened",
            description: "Target is Frightened and has disadvantage on all attack rolls.",
            mechanicsText: "Frightened state, disadvantage on attack rolls.",
          },
        ],
        savingThrow: {
          ability: "spirit",
          difficultyClass: 14,
          saveOutcome: "negates",
        },
        durationType: "rounds",
        durationValue: 2,
        durationUnit: "rounds",
        canBeDispelled: true,
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 2,
        durationUnit: "rounds",
      },
      resolution: "DICE",
      tags: ["damage", "debuff", "fear", "omen"],
    },

    { id : "augur_sacred_ground",
      name: "Agonizing Sanctuary",
      description:
        "You hammer your staff into the ground, creating a zone of blinding, painful radiance. Allies who stand within have their wounds sealed with congealing light, while enemies are scorched by the searing truth.",
      level: 3,
      spellType: "ACTION",
      icon: "Radiant/Radiant Light Burst",
      effectTypes: ["healing", "damage"],
      typeConfig: {
        school: "radiant",
        icon: "Radiant/Radiant Light Burst",
        tags: ["area", "healing", "damage", "consecrated", "omen"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 45,
        areaConfig: { areaType: "circle", areaSize: 15, areaSizeUnit: "ft" },
        targetRestrictions: ["any"],
        maxTargets: 15,
        targetSelectionMethod: "manual",
        requiresLineOfSight: true,
      },
      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 14 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        classResource: { type: "benediction", cost: 3 },
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },
      healingConfig: {
        formula: "2d6",
        healingType: "zone",
        hasHotEffect: true,
        hotFormula: "1d6",
        hotDuration: 3,
        hotTickType: "turn",
        resolution: "DICE",
      },
      damageConfig: {
        formula: "2d6",
        damageTypes: ["radiant"],
        hasDotEffect: true,
        dotConfig: {
          dotFormula: "1d6",
          duration: 3,
          tickFrequency: "turn",
          isProgressiveDot: false,
        },
        resolution: "DICE",
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds",
        concentrationRequired: true,
      },
      resolution: "DICE",
      tags: ["area", "healing", "damage", "consecrated", "omen"],
    },

    // ============================================================
    // LEVEL 4 SPELLS (3)
    // ============================================================

    { id : "augur_grand_malediction",
      name: "Ruinous Flaying Hex",
      description:
        "You speak the ultimate word of decay. The target's skin begins to peel backward as if invisible blades were flaying them alive. They freeze in absolute, screaming paralysis as their nervous system collapses.",
      level: 4,
      spellType: "ACTION",
      icon: "Necrotic/Death Mark",
      effectTypes: ["damage", "debuff"],
      typeConfig: {
        school: "psychic",
        icon: "Necrotic/Death Mark",
        tags: ["debuff", "damage", "paralyze", "omen"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 45,
        targetRestrictions: ["enemies"],
        maxTargets: 1,
        requiresLineOfSight: true,
      },
      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 20 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        classResource: { type: "malediction", cost: 5 },
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },
      damageConfig: {
        formula: "4d8",
        damageTypes: ["psychic"],
        resolution: "DICE",
      },
      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          { id : "ruinous_flay_paralysis",
            name: "Skinless Shock",
            description: "Target is Paralyzed for 2 rounds by catastrophic sensory overload.",
            mechanicsText: "Paralyzed state.",
          },
        ],
        savingThrow: {
          ability: "constitution",
          difficultyClass: 15,
          saveOutcome: "negates",
        },
        durationType: "rounds",
        durationValue: 2,
        durationUnit: "rounds",
        canBeDispelled: true,
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 2,
        durationUnit: "rounds",
      },
      resolution: "DICE",
      tags: ["debuff", "damage", "paralyze", "omen"],
    },

    { id : "augur_balanced_sign",
      name: "Cruciform Omen",
      description:
        "You draw a massive, bloody cross in the air. The intersection creates a highly volatile spatial nexus: allies on one axis are bathed in blinding radiant recovery, while enemies on the other are scorched.",
      level: 4,
      spellType: "ACTION",
      icon: "Arcane/Portal Archway",
      effectTypes: ["healing", "damage"],
      typeConfig: {
        school: "radiant",
        secondaryElement: "psychic",
        icon: "Arcane/Portal Archway",
        tags: ["area", "healing", "damage", "omen"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 60,
        areaConfig: { areaType: "line", areaSize: 40, areaSizeUnit: "ft" },
        targetRestrictions: ["any"],
        maxTargets: 20,
        targetSelectionMethod: "manual",
        requiresLineOfSight: true,
      },
      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 18 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        classResource: [
          { type: "benediction", cost: 3 },
          { type: "malediction", cost: 3 },
        ],
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
      healingConfig: {
        formula: "3d8",
        healingType: "zone",
        resolution: "DICE",
      },
      damageConfig: {
        formula: "3d8",
        damageTypes: ["psychic"],
        resolution: "DICE",
      },
      resolution: "DICE",
      tags: ["area", "healing", "damage", "omen"],
    },

    { id : "augur_hierophants_ward",
      name: "Martyr's Shroud",
      description:
        "You trace a massive radiant shroud across your allies. Their skin hardens with the protective glare of congealed bones, making them completely immune to panic and significantly harder to cut.",
      level: 4,
      spellType: "ACTION",
      icon: "Radiant/Radiant Golden Shield",
      effectTypes: ["buff"],
      typeConfig: {
        school: "radiant",
        icon: "Radiant/Radiant Golden Shield",
        tags: ["buff", "support", "armor", "omen"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        rangeDistance: 0,
        areaConfig: { areaType: "sphere", areaSize: 30, areaSizeUnit: "ft" },
        targetRestrictions: ["allies"],
        maxTargets: 6,
        targetSelectionMethod: "auto",
        requiresLineOfSight: false,
      },
      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 16 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        classResource: { type: "benediction", cost: 4 },
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },
      buffConfig: {
        buffType: "custom",
        effects: [
          { id : "martyrs_shroud_buff",
            name: "Searing Shroud",
            description: "Grants +2 Armor and absolute immunity to Charmed and Frightened conditions.",
            mechanicsText: "+2 Armor, immune to Charmed/Frightened.",
            statModifier: {
              stat: "armor",
              magnitude: 2,
              magnitudeType: "flat",
            },
          },
        ],
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds",
        canBeDispelled: true,
      },
      resolution: "AUTOMATIC",
      tags: ["buff", "support", "armor", "omen"],
    },

    // ============================================================
    // LEVEL 5 SPELLS (3)
    // ============================================================

    { id : "augur_omen_storm",
      name: "Gore-Mist Tempests",
      description:
        "You conjure a violent, swirling tempest of spilt blood and howling souls. The storm is hyper-volatile: allies within are healed by the life-giving mist, while enemies have their flesh shredded by jagged bone winds.",
      level: 5,
      spellType: "ACTION",
      icon: "Lightning/Thunderstorm",
      effectTypes: ["damage", "healing"],
      typeConfig: {
        school: "psychic",
        secondaryElement: "radiant",
        icon: "Lightning/Thunderstorm",
        tags: ["area", "damage", "healing", "storm", "omen"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 60,
        areaConfig: { areaType: "sphere", areaSize: 25, areaSizeUnit: "ft" },
        targetRestrictions: ["any"],
        maxTargets: 20,
        targetSelectionMethod: "manual",
        requiresLineOfSight: true,
      },
      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 22 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        classResource: [
          { type: "benediction", cost: 3 },
          { type: "malediction", cost: 3 },
        ],
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },
      damageConfig: {
        formula: "4d6",
        damageTypes: ["psychic", "radiant"],
        secondaryDamage: {
          formula: "2d6",
          condition: "If the damage roll total is even, deal additional radiant damage.",
        },
        resolution: "DICE",
      },
      healingConfig: {
        formula: "4d6",
        healingType: "zone",
        resolution: "DICE",
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 5,
        durationUnit: "rounds",
        concentrationRequired: true,
      },
      resolution: "DICE",
      tags: ["area", "damage", "healing", "storm", "omen"],
    },

    { id : "augur_field_of_misfortune",
      name: "Desolate Bog of Fractures",
      description:
        "You consecrate a massive area with ancient, agonizing curses. The ground shudders as bones break beneath the surface, creating an oppressive aura that saps all martial coordination and breaks armor.",
      level: 5,
      spellType: "ACTION",
      icon: "Necrotic/Corruption",
      effectTypes: ["debuff", "damage"],
      typeConfig: {
        school: "psychic",
        icon: "Necrotic/Corruption",
        tags: ["area", "debuff", "damage", "hazard", "omen"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 60,
        areaConfig: { areaType: "circle", areaSize: 30, areaSizeUnit: "ft" },
        targetRestrictions: ["enemies"],
        maxTargets: 20,
        targetSelectionMethod: "manual",
        requiresLineOfSight: true,
      },
      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 24 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        classResource: { type: "malediction", cost: 5 },
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },
      debuffConfig: {
        debuffType: "statPenalty",
        effects: [
          { id : "field_misfortune_debuff",
            name: "Splintered Stance",
            description: "Enemies have -3 to all attack rolls and -3 to Armor while in the zone.",
            mechanicsText: "-3 attack rolls, -3 Armor.",
          },
        ],
        statPenalties: [
          { stat: "attack_rolls", magnitude: -3, magnitudeType: "flat" },
          { stat: "armor", magnitude: -3, magnitudeType: "flat" },
        ],
        durationType: "rounds",
        durationValue: 5,
        durationUnit: "rounds",
        canBeDispelled: false,
      },
      damageConfig: {
        formula: "3d6",
        damageTypes: ["psychic"],
        hasDotEffect: true,
        dotConfig: {
          dotFormula: "3d6",
          duration: 5,
          tickFrequency: "turn",
          isProgressiveDot: false,
        },
        resolution: "DICE",
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 5,
        durationUnit: "rounds",
        concentrationRequired: true,
      },
      resolution: "DICE",
      tags: ["area", "debuff", "damage", "hazard", "omen"],
    },

    { id : "augur_hierophants_domain",
      name: "Blinding Cathedral of Bones",
      description:
        "You raise a colossal temple of radiant bone splinters. The air burns with golden light, providing absolute shelter for your allies. Their wounds seal, their skin hardens, and all fear is instantly incinerated.",
      level: 5,
      spellType: "ACTION",
      icon: "Healing/Prayer",
      effectTypes: ["healing", "buff"],
      typeConfig: {
        school: "radiant",
        icon: "Healing/Prayer",
        tags: ["area", "healing", "buff", "sanctuary", "omen"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 60,
        areaConfig: { areaType: "circle", areaSize: 30, areaSizeUnit: "ft" },
        targetRestrictions: ["allies"],
        maxTargets: 10,
        targetSelectionMethod: "manual",
        requiresLineOfSight: true,
      },
      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 24 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        classResource: { type: "benediction", cost: 5 },
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },
      healingConfig: {
        formula: "4d6",
        healingType: "zone",
        hasHotEffect: true,
        hotFormula: "2d6",
        hotDuration: 5,
        hotTickType: "turn",
        resolution: "DICE",
      },
      buffConfig: {
        buffType: "custom",
        effects: [
          { id : "hierophants_domain_buff",
            name: "Sanctuary of Grace",
            description: "Allies have +3 to all saving throws and gain resistance to psychic damage.",
            mechanicsText: "+3 all saving throws, psychic resistance.",
            statModifier: {
              stat: "all_saves",
              magnitude: 3,
              magnitudeType: "flat",
            },
          },
        ],
        durationType: "rounds",
        durationValue: 5,
        durationUnit: "rounds",
        canBeDispelled: false,
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 5,
        durationUnit: "rounds",
        concentrationRequired: true,
      },
      resolution: "DICE",
      tags: ["area", "healing", "buff", "sanctuary", "omen"],
    },

    // ============================================================
    // LEVEL 6 SPELLS (3)
    // ============================================================

    { id : "augur_omen_shatter",
      name: "Flesh-Shattering Portent",
      description:
        "You violently detonate the active omens clinging to your targets. Jagged shards of radiant bone and psychic agony burst outward from their skin, shredding nearby tissue and leaving them bleeding.",
      level: 6,
      spellType: "ACTION",
      icon: "Necrotic/Bone Shards",
      effectTypes: ["damage"],
      typeConfig: {
        school: "psychic",
        secondaryElement: "radiant",
        icon: "Necrotic/Bone Shards",
        tags: ["damage", "aoe", "detonate", "omen"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 60,
        areaConfig: { areaType: "sphere", areaSize: 20, areaSizeUnit: "ft" },
        targetRestrictions: ["enemies"],
        maxTargets: 15,
        targetSelectionMethod: "manual",
        requiresLineOfSight: true,
      },
      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 25 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        classResource: [
          { type: "benediction", cost: 3 },
          { type: "malediction", cost: 3 },
        ],
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },
      damageConfig: {
        formula: "5d8",
        damageTypes: ["psychic", "radiant"],
        resolution: "DICE",
      },
      resolution: "DICE",
      tags: ["damage", "aoe", "detonate", "omen"],
    },

    { id : "augur_curse_of_the_unlucky",
      name: "Agony of the Miscreant",
      description:
        "You cast a horrific curse that binds a target's destiny to immediate misery. Every time they make a d20 roll, odd results are interpreted as natural 1s, causing catastrophic failures and shattering their bones.",
      level: 6,
      spellType: "ACTION",
      icon: "Necrotic/Necrotic Death",
      effectTypes: ["debuff"],
      typeConfig: {
        school: "psychic",
        icon: "Necrotic/Necrotic Death",
        tags: ["debuff", "curse", "unlucky", "omen"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 45,
        targetRestrictions: ["enemies"],
        maxTargets: 1,
        requiresLineOfSight: true,
      },
      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 28 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        classResource: { type: "malediction", cost: 6 },
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },
      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          { id : "unlucky_curse_debuff",
            name: "Agonizing Misfortune",
            description: "All odd d20 rolls count as natural 1s. Target stumbles on every action.",
            mechanicsText: "Odd rolls count as natural 1s.",
          },
        ],
        savingThrow: {
          ability: "spirit",
          difficultyClass: 16,
          saveOutcome: "negates",
        },
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds",
        canBeDispelled: true,
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds",
      },
      resolution: "DICE",
      tags: ["debuff", "curse", "unlucky", "omen"],
    },

    { id : "augur_crown_of_radiance",
      name: "Crown of Thorns and Glory",
      description:
        "You crown an ally in a ring of blinding, sharp radiant thorns. The crown bleeds their temples but elevates their soul, providing legendary combat fortune and +3 to all immediate rolls.",
      level: 6,
      spellType: "ACTION",
      icon: "Radiant/Golden Ring",
      effectTypes: ["buff"],
      typeConfig: {
        school: "radiant",
        icon: "Radiant/Golden Ring",
        tags: ["buff", "support", "elevate", "omen"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
        targetRestrictions: ["allies"],
        maxTargets: 1,
      },
      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 26 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        classResource: { type: "benediction", cost: 6 },
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },
      buffConfig: {
        buffType: "custom",
        effects: [
          { id : "crown_radiance_buff",
            name: "Crown of Glory",
            description: "Grants +3 to all d20 rolls, and resistance to all damage types.",
            mechanicsText: "+3 to all rolls, all-damage resistance.",
            statModifier: {
              stat: "all_rolls",
              magnitude: 3,
              magnitudeType: "flat",
            },
          },
        ],
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds",
        canBeDispelled: true,
      },
      resolution: "AUTOMATIC",
      tags: ["buff", "support", "elevate", "omen"],
    },

    // ============================================================
    // LEVEL 7 SPELLS (3)
    // ============================================================

    { id : "augur_reality_of_omens",
      name: "Splitting of the Flesh",
      description:
        "You split reality down the center. On one side, allies are bolstered by congealing marrow and golden fate. On the other, enemies have their skin torn away, suffering catastrophic vulnerability.",
      level: 7,
      spellType: "ACTION",
      icon: "Arcane/Portal Archway",
      effectTypes: ["buff", "debuff"],
      typeConfig: {
        school: "psychic",
        secondaryElement: "radiant",
        icon: "Arcane/Portal Archway",
        tags: ["area", "buff", "debuff", "split", "omen"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        rangeDistance: 0,
        areaConfig: { areaType: "sphere", areaSize: 45, areaSizeUnit: "ft" },
        targetRestrictions: ["any"],
        maxTargets: 30,
        targetSelectionMethod: "auto",
        requiresLineOfSight: false,
      },
      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 35 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        classResource: [
          { type: "benediction", cost: 4 },
          { type: "malediction", cost: 4 },
        ],
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },
      buffConfig: {
        buffType: "custom",
        effects: [
          { id : "reality_allies_buff",
            name: "Fated Step",
            description: "Allies have +2 to all d20 rolls and +2 Armor.",
            mechanicsText: "+2 all rolls, +2 Armor.",
            statModifier: {
              stat: "all_rolls",
              magnitude: 2,
              magnitudeType: "flat",
            },
          },
        ],
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds",
        canBeDispelled: false,
      },
      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          { id : "reality_enemies_debuff",
            name: "Flayed Reality",
            description: "Enemies have -2 to all d20 rolls and +50% vulnerability to all damage types.",
            mechanicsText: "-2 all rolls, +50% all damage vulnerability.",
            statusEffect: {
              vulnerabilityType: "all",
              vulnerabilityPercent: 50,
            },
          },
        ],
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds",
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds",
        concentrationRequired: true,
      },
      resolution: "AUTOMATIC",
      tags: ["area", "buff", "debuff", "split", "omen"],
    },

    { id : "augur_apocalypse_portent",
      name: "Dirge of the Unmade",
      description:
        "You chant a horrifying, blackened dirge. The sky turns the color of congealed blood as a massive wave of psychic agony crushes your enemies, shattering their mental armor and leaving them paralyzed.",
      level: 7,
      spellType: "ACTION",
      icon: "Psychic/Agonizing Scream",
      effectTypes: ["damage", "debuff"],
      typeConfig: {
        school: "psychic",
        icon: "Psychic/Agonizing Scream",
        tags: ["damage", "debuff", "apocalypse", "omen"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 60,
        areaConfig: { areaType: "sphere", areaSize: 30, areaSizeUnit: "ft" },
        targetRestrictions: ["enemies"],
        maxTargets: 20,
        targetSelectionMethod: "manual",
        requiresLineOfSight: true,
      },
      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 38 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        classResource: { type: "malediction", cost: 7 },
      },
      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      damageConfig: {
        formula: "6d8",
        damageTypes: ["psychic"],
        resolution: "DICE",
      },
      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          { id : "apocalypse_debuff_paralyze",
            name: "Mind Shatter",
            description: "Enemies are Paralyzed for 1 round by overwhelming trauma.",
            mechanicsText: "Paralyzed state.",
          },
        ],
        savingThrow: {
          ability: "spirit",
          difficultyClass: 17,
          saveOutcome: "negates",
        },
        durationType: "rounds",
        durationValue: 1,
        durationUnit: "rounds",
      },
      resolution: "DICE",
      tags: ["damage", "debuff", "apocalypse", "omen"],
    },

    { id : "augur_divine_sanctuary",
      name: "Bleeding Altar of Grace",
      description:
        "You summon a colossal altar of congealed blood and golden splinters. The altar forms an absolute sanctuary: allies within are immune to all damage, while enemies are violently repelled by the searing light.",
      level: 7,
      spellType: "ACTION",
      icon: "Radiant/Radiant Light Burst",
      effectTypes: ["buff", "utility"],
      typeConfig: {
        school: "radiant",
        icon: "Radiant/Radiant Light Burst",
        tags: ["area", "buff", "sanctuary", "omen"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        rangeDistance: 0,
        areaConfig: { areaType: "circle", areaSize: 20, areaSizeUnit: "ft" },
        targetRestrictions: ["any"],
        maxTargets: 15,
        targetSelectionMethod: "auto",
        requiresLineOfSight: false,
      },
      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 40 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        classResource: { type: "benediction", cost: 8 },
      },
      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      buffConfig: {
        buffType: "custom",
        effects: [
          { id : "divine_sanctuary_buff",
            name: "Unstoppable Altar",
            description: "Allies are immune to all damage and conditions while within the sanctuary.",
            mechanicsText: "Damage and condition immunity.",
          },
        ],
        durationType: "rounds",
        durationValue: 2,
        durationUnit: "rounds",
        canBeDispelled: false,
      },
      utilityConfig: {
        utilityType: "special",
        selectedEffects: [
          { id : "divine_sanctuary_repel",
            name: "Searing Repulsion",
            description: "Enemies are pushed 30 feet away from the sanctuary boundary (no save).",
            mechanicsText: "Pushes enemies 30ft away.",
          },
        ],
        power: "supreme",
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 2,
        durationUnit: "rounds",
        concentrationRequired: true,
      },
      resolution: "AUTOMATIC",
      tags: ["area", "buff", "sanctuary", "omen"],
    },

    // ============================================================
    // LEVEL 8 SPELLS (3)
    // ============================================================

    { id : "augur_twist_of_fate",
      name: "Agonizing Fate Tear",
      description:
        "You reach out with ethereal, bloody talons and tear the thread of a target's destiny. You force an immediate d20 reroll, modifying the final result by up to 5 points by draining your own marrow.",
      level: 8,
      spellType: "REACTION",
      icon: "Arcane/Spiral Vortex",
      effectTypes: ["utility"],
      typeConfig: {
        school: "psychic",
        icon: "Arcane/Spiral Vortex",
        tags: ["reaction", "manipulation", "fate", "omen"],
        castTime: 1,
        castTimeType: "REACTION",
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: ["any"],
        maxTargets: 1,
      },
      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 30 },
        actionPoints: 0,
        components: ["verbal"],
        classResource: [
          { type: "benediction", cost: 4 },
          { type: "malediction", cost: 4 },
        ],
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },
      utilityConfig: {
        utilityType: "special",
        selectedEffects: [
          { id : "fate_tear_reroll",
            name: "Agonizing Reroll",
            description:
              "Force any creature within 60ft to reroll a d20. You may add or subtract up to 5 to the final result.",
            mechanicsText: "Forces d20 reroll, modify result by ±5.",
          },
        ],
        power: "supreme",
      },
      resolution: "AUTOMATIC",
      tags: ["reaction", "manipulation", "fate", "omen"],
    },

    { id : "augur_omen_of_death",
      name: "Entropic Carrion Sign",
      description:
        "You mark a target's forehead with a wet, black sigil of absolute ending. The sign calls the carrion crows; if the target rolls an odd number on any d20, they suffer catastrophic bone failure, collapsing to 0 HP instantly.",
      level: 8,
      spellType: "ACTION",
      icon: "Necrotic/Death Mark",
      effectTypes: ["debuff"],
      typeConfig: {
        school: "necrotic",
        icon: "Necrotic/Death Mark",
        tags: ["debuff", "curse", "execute", "crows", "omen"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 45,
        targetRestrictions: ["enemies"],
        maxTargets: 1,
        requiresLineOfSight: true,
      },
      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 42 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        classResource: { type: "malediction", cost: 8 },
      },
      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          { id : "carrion_sign_death",
            name: "Entropic Carrion Sign",
            description:
              "If the target rolls an odd number on any d20 (attack, save, or check), they are instantly reduced to 0 HP (Constitution save DC 18 reduces this to 10d10 necrotic damage).",
            mechanicsText: "Odd d20 rolls trigger instant 0 HP or 10d10 necrotic.",
          },
        ],
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds",
        canBeDispelled: false,
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds",
      },
      resolution: "DICE",
      tags: ["debuff", "curse", "execute", "crows", "omen"],
    },

    { id : "augur_cosmic_aurora",
      name: "Searing Agony Aurora",
      description:
        "You flood the battlefield in a blinding, searing sky-fire of tragic radiant light. The aurora bleeds the eyes of all who gaze upon it: allies have their flesh hardened, while enemies are charred to black ash.",
      level: 8,
      spellType: "ACTION",
      icon: "Radiant/Radiant Sunburst",
      effectTypes: ["healing", "damage", "buff"],
      typeConfig: {
        school: "radiant",
        icon: "Radiant/Radiant Sunburst",
        tags: ["area", "healing", "damage", "aurora", "omen"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        rangeDistance: 0,
        areaConfig: { areaType: "sphere", areaSize: 60, areaSizeUnit: "ft" },
        targetRestrictions: ["any"],
        maxTargets: 30,
        targetSelectionMethod: "auto",
        requiresLineOfSight: false,
      },
      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 45 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        classResource: { type: "benediction", cost: 8 },
      },
      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      healingConfig: {
        formula: "5d8",
        healingType: "zone",
        resolution: "DICE",
      },
      damageConfig: {
        formula: "5d8",
        damageTypes: ["radiant"],
        resolution: "DICE",
      },
      buffConfig: {
        buffType: "custom",
        effects: [
          { id : "aurora_allies_buff",
            name: "Sky-Clad Flesh",
            description: "Allies gain +3 Armor and immunity to psychic damage for the duration.",
            mechanicsText: "+3 Armor, psychic immunity.",
            statModifier: {
              stat: "armor",
              magnitude: 3,
              magnitudeType: "flat",
            },
          },
        ],
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds",
        canBeDispelled: false,
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds",
        concentrationRequired: true,
      },
      resolution: "DICE",
      tags: ["area", "healing", "damage", "aurora", "omen"],
    },

    // ============================================================
    // LEVEL 9 SPELLS (3)
    // ============================================================

    { id : "augur_the_signs_speak",
      name: "The Gore Whispers",
      description:
        "You plunge your mind fully into the screaming network of spilt blood. The whispers of gore become a roaring torrent: for one round, you dictate the exact outcome of every d20 roll within 60 feet.",
      level: 9,
      spellType: "ACTION",
      icon: "Psychic/Psionic Boom",
      effectTypes: ["buff", "utility"],
      typeConfig: {
        school: "psychic",
        icon: "Psychic/Psionic Boom",
        tags: ["buff", "manipulation", "fate", "omen"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      targetingConfig: {
        targetingType: "self",
      },
      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 50 },
        actionPoints: 3,
        components: ["verbal", "somatic"],
        classResource: [
          { type: "benediction", cost: 6 },
          { type: "malediction", cost: 6 },
        ],
      },
      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      buffConfig: {
        buffType: "custom",
        effects: [
          { id : "gore_whispers_buff",
            name: "Dictate Fate",
            description:
              "You choose the exact d20 roll results for all actions within 60 feet for 1 round. All rolls automatically succeed or fail as you command.",
            mechanicsText: "Choose d20 outcomes for 1 round.",
          },
        ],
        durationType: "rounds",
        durationValue: 1,
        durationUnit: "rounds",
        canBeDispelled: false,
      },
      utilityConfig: {
        utilityType: "special",
        selectedEffects: [
          { id : "gore_whispers_fate",
            name: "Sovereign Decree",
            description: "Dictate all d20 results in 60 feet for 1 round.",
          },
        ],
        power: "supreme",
      },
      resolution: "AUTOMATIC",
      tags: ["buff", "manipulation", "fate", "omen"],
    },

    { id : "augur_cataclysm_portent",
      name: "Wounded World Portent",
      description:
        "You declare a portent of absolute seismic collapse. The ground rips open, spraying molten psychic fire. Enemies are crushed under collapsing mud, stunned, and marked with catastrophic rot.",
      level: 9,
      spellType: "ACTION",
      icon: "Void/Red Energy Burst",
      effectTypes: ["damage", "debuff"],
      typeConfig: {
        school: "psychic",
        icon: "Void/Red Energy Burst",
        tags: ["damage", "debuff", "stun", "omen"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 60,
        areaConfig: { areaType: "circle", areaSize: 40, areaSizeUnit: "ft" },
        targetRestrictions: ["enemies"],
        maxTargets: 25,
        targetSelectionMethod: "manual",
        requiresLineOfSight: true,
      },
      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 55 },
        actionPoints: 3,
        components: ["verbal", "somatic"],
        classResource: { type: "malediction", cost: 10 },
      },
      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      damageConfig: {
        formula: "8d8",
        damageTypes: ["psychic"],
        resolution: "DICE",
      },
      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          { id : "cataclysm_portent_debuff",
            name: "Cataclysmic Shock",
            description: "Enemies are Stunned for 2 rounds by absolute shock, and suffer -3 to Spirit saving throws.",
            mechanicsText: "Stunned state, -3 Spirit saves.",
          },
        ],
        savingThrow: {
          ability: "constitution",
          difficultyClass: 18,
          saveOutcome: "half_damage_no_stun",
        },
        durationType: "rounds",
        durationValue: 2,
        durationUnit: "rounds",
      },
      resolution: "DICE",
      tags: ["damage", "debuff", "stun", "omen"],
    },

    { id : "augur_eternal_benediction",
      name: "Agonizing Immortality Rite",
      description:
        "You perform the ultimate sacrificial rite of grace. You permanently blind your left eye, but raise a blinding, golden canopy of absolute preservation. Allies are immortal, completely immune to death and injury.",
      level: 9,
      spellType: "ACTION",
      icon: "Healing/Ressusitate",
      effectTypes: ["buff", "healing"],
      typeConfig: {
        school: "radiant",
        icon: "Healing/Ressusitate",
        tags: ["area", "buff", "healing", "immortality", "omen"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        rangeDistance: 0,
        areaConfig: { areaType: "circle", areaSize: 45, areaSizeUnit: "ft" },
        targetRestrictions: ["allies"],
        maxTargets: 15,
        targetSelectionMethod: "auto",
        requiresLineOfSight: false,
      },
      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 55 },
        actionPoints: 3,
        components: ["verbal", "somatic"],
        classResource: { type: "benediction", cost: 10 },
      },
      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      buffConfig: {
        buffType: "custom",
        effects: [
          { id : "immortality_rite_buff",
            name: "Unending Grace",
            description:
              "Allies are immune to damage, conditions, and cannot drop below 1 HP. Searing light immediately heals any wound.",
            mechanicsText: "Damage/condition immunity, HP cannot fall below 1.",
          },
        ],
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds",
        canBeDispelled: false,
      },
      healingConfig: {
        formula: "8d8",
        healingType: "zone",
        resolution: "DICE",
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds",
        concentrationRequired: true,
      },
      resolution: "AUTOMATIC",
      tags: ["area", "buff", "healing", "immortality", "omen"],
    },

    // ============================================================
    // LEVEL 10 SPELLS (3)
    // ============================================================

    { id : "augur_master_of_omens",
      name: "Sovereign Haruspex Transformation",
      description:
        "You ascend as the absolute sovereign of blood and fate. Your skin hardens into an ivory armor of bones, your veins glow with blinding gold. You control all numbers: you write the dice, you rewrite the marrow, you decide who lives.",
      level: 10,
      spellType: "ACTION",
      icon: "Arcane/Portal Archway",
      effectTypes: ["buff", "utility"],
      typeConfig: {
        school: "radiant",
        secondaryElement: "psychic",
        icon: "Arcane/Portal Archway",
        tags: ["ultimate", "transformation", "fate", "sovereign", "omen"],
        castTime: 1,
        castTimeType: "RITUAL",
      },
      targetingConfig: {
        targetingType: "self",
      },
      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 60 },
        actionPoints: 3,
        components: ["verbal", "somatic"],
        classResource: [
          { type: "benediction", cost: 10 },
          { type: "malediction", cost: 10 },
        ],
      },
      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      buffConfig: {
        buffType: "custom",
        effects: [
          { id : "master_of_omens",
            name: "Sovereign Haruspex",
            description:
              "You control all omens. Declare d20 Even/Odd before any roll. Spend 1 resource to change any result by ±1. All allies gain +2 to all rolls, all enemies suffer -2 to all rolls.",
            mechanicsText: "Declare d20 outcomes, modify rolls by ±1, allies +2, enemies -2.",
          },
        ],
        durationValue: 10,
        durationType: "rounds",
        durationUnit: "rounds",
        concentrationRequired: true,
        canBeDispelled: false,
      },
      utilityConfig: {
        utilityType: "special",
        selectedEffects: [
          { id : "master_of_omens_utility",
            name: "Omnipotent Reading",
            description: "Declare d20 Even/Odd outcomes before rolls. Spend Benediction/Malediction to modify rolls.",
            mechanicsText: "Modify rolls by ±1 per resource spent.",
          },
        ],
        power: "supreme",
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 10,
        durationUnit: "rounds",
        concentrationRequired: true,
      },
      resolution: "AUTOMATIC",
      tags: ["ultimate", "transformation", "fate", "sovereign", "omen"],
    },

    { id : "augur_harbinger_supreme",
      name: "Harbinger of the Black Ash",
      description:
        "You dissolve your mortal frame, becoming a walking storm of decaying black ash and screaming psychic horror. Every enemy who looks upon you staggers as their skin turns to soot, their femur bones cracking under fated weight.",
      level: 10,
      spellType: "ACTION",
      icon: "Void/Black Hole",
      effectTypes: ["debuff", "damage"],
      typeConfig: {
        school: "psychic",
        icon: "Void/Black Hole",
        tags: ["ultimate", "transformation", "ash", "debuff", "omen"],
        castTime: 1,
        castTimeType: "RITUAL",
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        rangeDistance: 0,
        areaConfig: { areaType: "sphere", areaSize: 90, areaSizeUnit: "ft" },
        targetRestrictions: ["enemies"],
        maxTargets: 30,
        targetSelectionMethod: "auto",
        requiresLineOfSight: false,
      },
      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 60 },
        actionPoints: 3,
        components: ["verbal", "somatic"],
        classResource: { type: "malediction", cost: 15 },
      },
      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          { id : "harbinger_supreme_debuff",
            name: "Screaming Ash",
            description: "Enemies have -3 to all d20 rolls, and you can force one reroll of an enemy success per round.",
            mechanicsText: "-3 to all rolls for enemies. Force one success reroll per round.",
          },
        ],
        durationType: "rounds",
        durationValue: 10,
        durationUnit: "rounds",
      },
      damageConfig: {
        formula: "3d8",
        damageTypes: ["psychic"],
        hasDotEffect: true,
        dotConfig: {
          dotFormula: "3d8",
          duration: 10,
          tickFrequency: "turn",
          isProgressiveDot: false,
        },
        resolution: "DICE",
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 10,
        durationUnit: "rounds",
        concentrationRequired: true,
      },
      resolution: "AUTOMATIC",
      tags: ["ultimate", "transformation", "ash", "debuff", "omen"],
    },

    { id : "augur_hierophant_supreme",
      name: "Hierophant of Blinding Splinters",
      description:
        "You burn away your humanity, transforming into an towering cathedral of blinding, white-hot radiant splinters. The battlefield is consecrated in a sea of golden light: allies are absolute, healed, and blessed with legendary fortune.",
      level: 10,
      spellType: "ACTION",
      icon: "Radiant/Radiant Sunburst",
      effectTypes: ["buff", "healing", "damage"],
      typeConfig: {
        school: "radiant",
        icon: "Radiant/Radiant Sunburst",
        tags: ["ultimate", "transformation", "splinters", "buff", "omen"],
        castTime: 1,
        castTimeType: "RITUAL",
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        rangeDistance: 0,
        areaConfig: { areaType: "sphere", areaSize: 120, areaSizeUnit: "ft" },
        targetRestrictions: ["any"],
        maxTargets: 30,
        targetSelectionMethod: "auto",
        requiresLineOfSight: false,
      },
      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 60 },
        actionPoints: 3,
        components: ["verbal", "somatic"],
        classResource: { type: "benediction", cost: 15 },
      },
      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      buffConfig: {
        buffType: "custom",
        effects: [
          { id : "hierophant_supreme_buff",
            name: "Unending Splendor",
            description:
              "Allies gain +3 to all d20 rolls, absolute resistance to all damage types, and immunity to frightened/charmed. Grant one free reroll on a failed roll per round.",
            statModifier: {
              stat: "all_rolls",
              magnitude: 3,
              magnitudeType: "flat",
            },
            mechanicsText: "+3 all rolls, all damage resistance, immune to frightened/charmed. Grant one reroll per round.",
          },
        ],
        durationValue: 10,
        durationType: "rounds",
        durationUnit: "rounds",
        concentrationRequired: true,
        canBeDispelled: false,
      },
      healingConfig: {
        formula: "4d8",
        healingType: "zone",
        hasHotEffect: true,
        hotFormula: "4d8",
        hotDuration: 10,
        hotTickType: "turn",
        resolution: "DICE",
      },
      damageConfig: {
        formula: "4d8",
        damageTypes: ["radiant"],
        hasDotEffect: true,
        dotConfig: {
          dotFormula: "4d8",
          duration: 10,
          tickFrequency: "turn",
          isProgressiveDot: false,
        },
        resolution: "DICE",
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 10,
        durationUnit: "rounds",
        concentrationRequired: true,
      },
      resolution: "AUTOMATIC",
      tags: ["ultimate", "transformation", "splinters", "buff", "omen"],
    },
  ],

  spellPools: {
    1: [
      "augur_read_the_signs",
      "augur_omen_shield",
      "augur_minor_portent",
      "augur_sign_of_clarity",
      "augur_omen_bolt",
    ],
    2: [
      "augur_portent_of_weakness",
      "augur_terrain_of_ruin",
      "augur_sign_of_protection",
    ],
    3: [
      "augur_omen_bolt",
      "augur_harbinger_gaze",
      "augur_sacred_ground",
    ],
    4: [
      "augur_grand_malediction",
      "augur_balanced_sign",
      "augur_hierophants_ward",
    ],
    5: [
      "augur_omen_storm",
      "augur_field_of_misfortune",
      "augur_hierophants_domain",
    ],
    6: [
      "augur_omen_shatter",
      "augur_curse_of_the_unlucky",
      "augur_crown_of_radiance",
    ],
    7: [
      "augur_reality_of_omens",
      "augur_apocalypse_portent",
      "augur_divine_sanctuary",
    ],
    8: [
      "augur_twist_of_fate",
      "augur_omen_of_death",
      "augur_cosmic_aurora",
    ],
    9: [
      "augur_the_signs_speak",
      "augur_cataclysm_portent",
      "augur_eternal_benediction",
    ],
    10: [
      "augur_master_of_omens",
      "augur_harbinger_supreme",
      "augur_hierophant_supreme",
    ],
  },
};
