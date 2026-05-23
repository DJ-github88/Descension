/**
 * Berserker Class Data
 *
 * Complete class information for the Berserker - the Hemorrhagic Butcher.
 * A tragic, high-risk warrior whose body is a self-destructive engine of war.
 */

export const BERSERKER_DATA = {
  id: "berserker",
  name: "Berserker",
  icon: "fas fa-skull",
  role: "Damage",
  damageTypes: ["slashing", "bludgeoning"],

  // Overview section (Oppressive & Tragic Lore)
  overview: {
    title: "The Berserker",
    subtitle: "The Hemorrhagic Butcher",
    illustration: "/assets/images/classes/berserker_illustration.png",
    illustrationCaption: "A Mimir Face Thief Berserker dual-wielding battleaxes with subtle crystal skin lines.",

    quickOverview: {
      title: "Quick Overview",
      content: `**What You Need to Know**: The Berserker is not a noble hero; they are a tragic anomaly. Their "Rage" is a violent physiological meltdown—Blood-Heat (0-100)—where adrenaline boils their blood and snaps their tendons to force inhuman strikes. The standard Blood-Heat gauge caps at 100, and exceeding it triggers **Metabolic Burnout (Overheat)**, causing internal organs to seize under the agonizing pressure. However, high-level overdrive masteries allow the player to enter temporary catastrophic states (101-150+) without instant burnout.

**Core Mechanic**: Every strike feeds the boiling Blood-Heat. At higher heat, their raw damage output scales drastically, but they permanently damage themselves to maintain it. They possess **Pain Immunity**, making them completely immune to pain—but this horrific state blocks all incoming healing from allies while raging.

**Resource**: Blood-Heat (0-100 Rage scale, physically tracked via d20s/d10s)

**Playstyle**: Violent, high-risk melee. You are a ticking time bomb. You must dance on the razor's edge of death to unleash apocalyptic damage before your own heart ruptures.

**Best For**: Players who enjoy riding the absolute edge of survival, trading health for unmitigated ruin, and punishing passivity.`,
    },

    description: `The Berserker represents the desperate, agonizing survival of meat and bone. They do not wield magic; they mutilate their own anatomy through pure adrenaline and boiling fury. As their Blood-Heat rises, their muscles literally tear themselves from the bone to swing harder. This physiological meltdown grants terrifying strength but rapidly burns their metabolic reserves, leading toward inevitable systemic collapse.`,

    roleplayIdentity: {
      title: "The Agony of the Flesh",
      content: `To be a Berserker is to bear a curse of relentless physical ruin. In roleplay, your fury is not a loud emotion—it is a horrifying physiological seizure. When the blood boils, veins blacken and bulge beneath the skin, steam rises from open gashes, and the stench of scorched copper follows you. You do not speak in battle; you emit guttural, rattling gasps as your lungs bleed from exertion.

Common archetypes of this tragic dirge:
- **The Adrenaline Thrall**: A survivor of a horrific battlefield who can only feel alive when their veins are screaming with fire.
- **The Tendon-Carver**: A warrior who deliberately cuts their own muscle binds to allow wider, unnatural weapon swings.
- **The Ruined Vessel**: A ticking clock of a person whose heart is visibly scarred and ready to seize from years of boiling Blood-Heat.`,
    },

    combatRole: {
      title: "The Death's Door Execute",
      content: `The Berserker is the ultimate "Why Bring Me?" execute engine. When their own health is critically low (below 30% HP), their survival instinct turns apocalyptic. Their boiling blood reaches such extreme temperatures that their strikes **completely bypass all physical resistances** of their enemies. They turn near-death into unmitigated destruction.

However, their **Fatal Flaw** is absolute: **Metabolic Burnout**. They possess absolutely zero self-healing or lifesteal. Furthermore, while their fury burns (Rage > 20), their pain immunity prevents their allies' magic from mending their flesh. They are highly vulnerable to sustained damage-over-time (Bleed/Poison) effects, which will silently drain their remaining meat while they are blind with rage.`,
    },

    playstyle: {
      title: "Strategic Self-Mutilation",
      content: `Managing the Berserker is a dance of attrition.
      
**The Sweet Spot (41-80 Blood-Heat)**: You hit with terrifying force and gain massive combat bonuses, but the thermal pressure is mounting.

**The Danger Zone (81-100 Blood-Heat)**: Your strikes tear your own bone structure. If your Rage exceeds 100, you have exactly one round to spend it below the threshold, or your heart suffers **Metabolic Burnout**, dealing 2d6 unresistable damage and dropping your Rage to 0. Entering active masteries allows temporary overdrive states (101-150+) to unleash absolute catastrophe.

**Agonizing Recoil**: Every level 1-10 ability requires a toll of flesh. Attacks generate Blood-Heat but inflict physical self-damage or agonizing self-debuffs. Violence is your only oxygen; if you go two full rounds without dealing melee damage, you enter **Pain Starvation**, causing your rage to turn inward and decay your mind.`,
    },

    immersiveCombatExample: {
      title: "Combat Example: The Tragic Toll",
      content: `**The Setup**: You stand before an armored Iron Golem in a decaying crypt. Your heart rate is normal, your Blood-Heat is at 0. Your greataxe is heavy, dragging in the dirt.

**Turn 1 - Splintering the Flesh (Rage: 0 → 12)**
*You heave your axe with both hands, muscles tearing as you force the blade forward.*
- **Action**: Cast **Hemorrhagic Strike** → Hit!
- **Blood-Heat**: Gain +12 Rage (now at 12).
- **Recoil**: Take 1d4 physical damage (tendons snapping).
*The pain doesn't register as a warning—it is a chemical trigger. The blood in your neck begins to sizzle.*

**Turn 2 - Boiling the Veins (Rage: 12 → 35)**
*You unlock your boiling veins, allowing the crimson fire to circulate. The Golem swings its heavy stone fist, striking your ribs.*
- **Action**: Activate **Boiling Veins** stance.
- **Golem Attack**: Hit! Take 12 damage.
- **Pain Immunity Triggers**: Your Rage is now 35 (Frenzied State). The Golem's follow-up hit hurts, but you laugh—a wet, rattling sound. You are now immune to pain; the friendly Priest's healing spell washes over you, but has **no effect**.
- **Self-Damage**: Lose 1 HP at the start of your turn.

**Turn 3 - Death's Door (Rage: 35 → 78)**
*Your health is down to 25%. You are at Death's Door. Your vision is a tunnel of red. The Golem's high physical resistance has ignored your allies' strikes, but you swing with desperate, apocalyptic force.*
- **Action**: Cast **Frenzied Slash** → Hit!
- **Why Bring Me?**: Because you are under 30% HP, your strike completely bypasses the Golem's stone resistance!
- **Damage**: Deal 45 unmitigated slashing damage.
- **Blood-Heat**: Spend 8 Rage (drops to 27) but gain +15 Rage on hit (ends at 42 - Primal State).
- **Recoil**: Take 1d4 physical damage.
*The Golem cracks, granite sundering under a strike that should have been physically impossible for a mortal frame. You stand blind with fury, your heart hammering a tragic dirge.*`,
    },
  },

  // Starting Equipment
  equipment: {
    title: "Starting Equipment",
    choices: [
      {
        name: "Shattered Greataxe Path",
        icon: "Slashing/Cross Slash",
        items: [
          "Shattered Greataxe (2d12 slashing, weighted with lead)",
          "Corrugated Hide Wraps (Armor 12, max Agility +2)",
          "2 Crude Throwing Cleavers (1d6 slashing, range 20/60)",
        ],
        description: "Maximum single-strike mutilation. Designed to deliver devastating blows at the cost of your own skeletal integrity.",
      },
      {
        name: "Dual Flayed Warhammers Path",
        icon: "Bludgeoning/Mortal Strike",
        items: [
          "Two Flayed Warhammers (1d10 bludgeoning each, wrapped in raw sinew)",
          "Heavy Splinted Bracers (Armor 13, max Agility +2)",
          "2 Sinew-Bound Throwing Spikes (1d6 piercing, range 20/60)",
        ],
        description: "More strikes per round to rapidly boil your Blood-Heat, forcing rapid transitions into paint-numbed states.",
      },
    ],
    standardGear: [
      "Butcher's Pack ( backpack, salt rations x10, cauterizing iron, torches x5, waterskin, hempen rope 50ft )",
      "1d10 x 5 rusted copper pieces",
    ],
    notes: "Ranged weapons are an insult to the meat. You cannot wield bows or crossbows; your rage requires close-quarters mutilation.",
  },

  creationSteps: [
    {
      step: 1,
      title: "Accept the Curse",
      description: "Choose your Specialization: Savage (pure devastation), Juggernaut (shattered resilience), or Warlord (tyrannical command).",
    },
    {
      step: 2,
      title: "Select Your Instrument",
      description: "Choose the heavy Shattered Greataxe (massive recoil) or Dual Flayed Warhammers (frequent self-harm).",
    },
    {
      step: 3,
      title: "Bind Your Stance",
      description: "Toggle Calloused Hide (+2 Armor, build Blood-Heat on pain) or Boiling Veins (+1d4 fire/slashing damage, constant HP drain).",
    },
    {
      step: 4,
      title: "Embrace Metabolic Burnout",
      description: "Understand that you cannot heal. Learn to manage your Blood-Heat to avoid Overheat, which ruptures your heart.",
    },
  ],

  // Resource System Config
  resourceSystem: {
    title: "Blood-Heat & Pain Immunity",
    subtitle: "The Agony of the Flesh",
    description: "Blood-Heat is a thermal pressure gauge of your physiological decay. It builds through self-harm and taking pain, unlocking terrifying physical thresholds. However, once you boil, you are immune to pain, preventing your allies from healing you. If you exceed 100 heat, you suffer Metabolic Burnout.",
    
    cards: [
      {
        title: "Blood-Heat (0-100)",
        stats: "Thermal Scale",
        details: "Rage represented as boiling blood. Built by striking, self-mutilation, and taking damage. Exceeding 100 triggers Metabolic Burnout.",
      },
    ],

    generationTable: {
      headers: ["Action", "Blood-Heat Change", "Flesh Toll / Recoil"],
      rows: [
        ["Cast Melee Ability", "+1d6", "Deals 1d4 physical damage to self"],
        ["Taking Damage", "+1d4", "Pain translates directly into heat"],
        ["Critical Hit", "+2d6", "Splinters bones, high thermal spike"],
        ["Kill Enemy", "+1d8", "Cruor adrenaline surge"],
        ["Passivity (1 turn without attack)", "-10 per round", "Cold blood leads to Pain Starvation"],
        ["Metabolic Burnout (101+ Heat)", "Reset to 0", "Ruptures heart, deals 2d6 unresistable damage"],
      ],
    },

    usage: {
      momentum: "Blood-Heat costs range from 5 to 100. Pushing higher unlocks stronger states, but every ability deals recoil damage to your own frame.",
      flourish: "⚠️ Pain Immunity: While Blood-Heat is 21 or higher, you are entirely immune to pain. Consequently, you cannot be healed by allies' spells or potions. You are a ticking clock.",
    },

    overheatRules: {
      title: "Metabolic Burnout",
      content: `When your Blood-Heat exceeds 100, you enter the Obliteration State. Your organs are cooking from within.
      
**You have EXACTLY ONE ROUND** to spend your Blood-Heat below 101. If you fail:
- Your heart seizes: take **2d6 unresistable damage** (ignores all shields and Armor).
- Your Blood-Heat **resets to 0** (complete metabolic exhaustion).
- You are **Stunned for 1 round** as your body suffers systemic shock.

*Note: High-level overdrive masteries temporarily bypass instant burnout to allow access to higher thresholds.*`,
    },

    rageStatesTable: {
      title: "Blood-Heat Thresholds",
      headers: ["State", "Heat Range", "Unlocked Mechanics", "Agony / Penalty"],
      rows: [
        ["Smoldering", "0-20", "Basic strikes available. You feel the cold chill of mortality.", "None"],
        ["Frenzied", "21-40", "+1 melee attack roll, +5 ft movement.", "Pain Immunity begins: Allies cannot heal you."],
        ["Primal", "41-60", "+2 melee attack rolls, +2 damage.", "Armor reduced by 2. Muscles begin to snap."],
        ["Carnage", "61-80", "+3 melee attack rolls, +4 damage.", "Armor reduced by 4, Agility check disadvantage."],
        ["Cataclysm", "81-100", "+4 melee attack rolls, +6 damage, immune to fear.", "Armor reduced by 6, miss recoil increases by 1d4."],
        ["Obliteration", "101-124", "+5 melee attack rolls, +8 damage, crits cleave.", "Armor reduced by 8, take 1d6 self-damage per turn."],
        ["Annihilation", "125-149", "+6 melee attack rolls, +10 damage, +15 ft movement.", "Armor reduced by 10, take 1d10 self-damage per turn."],
        ["Apocalypse", "150+", "+8 melee attack rolls, +15 damage, immune to all conditions.", "Armor reduced to 0, take 2d6 self-damage per turn, no defense possible."],
      ],
    },
  },

  // Specializations
  specializations: {
    title: "Specializations",
    subtitle: "Three Paths of Decay",
    description: "Choose the manner in which your body breaks to claim victory.",
    specs: [
      {
        id: "savage",
        name: "Savage",
        icon: "Utility/Empowered Warrior",
        color: "#8B0000",
        theme: "Hemorrhagic Ruin",
        description: "The Savage is a whirlwind of pure, self-destructive violence. They refuse to defend themselves, pushing their Blood-Heat to catastrophic levels to shatter enemy armor with raw, overwhelming impact.",
        playstyle: "High-heat offensive fury, aggressive self-damage, and massive near-death executes.",
        strengths: [
          "Accelerated Blood-Heat generation from every wound you inflict or suffer.",
          "Devastating damage scaling when fighting on the brink of death (below 30% HP).",
        ],
        weaknesses: [
          "Complete lack of defensive barriers or armor preservation.",
          "Extremely susceptible to sudden Metabolic Burnout (Overheat).",
        ],
        keyAbilities: [
          "Savage Strike: A devastating overhead blow that unleashes raw kinetic impact.",
          "Reckless Abandon: Instantly trigger a surge of Blood-Heat by splitting your own flesh.",
        ],
        specPassive: {
          name: "Unbridled Adrenaline",
          description: "You generate Blood-Heat 50% faster. When your Health drops below 30%, your strikes completely bypass enemy physical resistances, tearing through armor like paper.",
        },
      },
      {
        id: "juggernaut",
        name: "Juggernaut",
        icon: "Utility/Shield",
        color: "#4169E1",
        theme: "Calloused Husk",
        description: "The Juggernaut turns physical trauma into a weapon. Instead of falling, they force their wounds to calcify into dense plates of grey scar tissue, turning enemy strikes into temporary layers of structural defense.",
        playstyle: "Defensive rage scaling, converting raw damage taken into heavy temporary barriers.",
        strengths: [
          "Converts high Blood-Heat into thick layers of temporary, protective scar tissue.",
          "Halved armor penalties from high-heat states compared to other Berserkers.",
        ],
        weaknesses: [
          "Lower immediate damage output in exchange for structural durability.",
          "Slightly reduced movement speed due to rigid, calcified skin.",
        ],
        keyAbilities: [
          "Calloused Barrier: Instantly calcify your current Blood-Heat into a protective shield of bone and scar.",
          "Bone Spines: Shatter your protective calluses outward to impale nearby attackers.",
        ],
        specPassive: {
          name: "Shattered Resilience",
          description: "Your Blood-Heat decays half as fast. Every time you are struck by a physical attack, your skin calcifies, granting a layer of temporary Grit shields to absorb the next blow.",
        },
      },
      {
        id: "warlord",
        name: "Warlord",
        icon: "Utility/Powerful Warrior",
        color: "#DAA520",
        theme: "Tyrannical Dirge",
        description: "The Warlord is a commanding terror on the battlefield. They direct their physical suffering outward, transforming their agonizing screams into thunderous bellows that demoralize foes and whip allies into a bloodthirsty frenzy.",
        playstyle: "Tactical support, area-of-effect crowd control, and amplifying team-wide aggression.",
        strengths: [
          "Amplified shout and roar radius, intimidating entire groups of enemies at once.",
          "Inspires allies to strike harder whenever you suffer recoil damage.",
        ],
        weaknesses: [
          "Lacks personal shields, relying on allies to capitalize on your openings.",
          "Longer breathing intervals required between high-exhaustion yells.",
        ],
        keyAbilities: [
          "Tyrant's Command: A deafening bellow that forces enemies to focus their attention on you.",
          "Dirge of Battle: A blood-spraying roar that whips nearby allies into a temporary combat frenzy.",
        ],
        specPassive: {
          name: "Sanguine Dictator",
          description: "Your war cries affect all targets within 30 feet. Whenever you take self-damage from your abilities, your nearby allies are galvanized, gaining bonus damage on their next strike.",
        },
      },
    ],
  },

  // Level 1-10 Meticulously Normalized Spell List
  spells: [
    // ========================================
    // LEVEL 1 STARTING SPELLS (Flesh-Toll Starter Kit)
    // ========================================
    {
      id: "berserk_hemorrhagic_strike",
      name: "Hemorrhagic Strike",
      description:
        "Heave your weapon with terrifying, uncontrolled force. Your muscles snap and tear from the bone, dealing damage to yourself but building your Blood-Heat and tearing into your enemy's flesh.",
      level: 1,
      spellType: "ACTION",
      icon: "Slashing/Cross Slash",

      typeConfig: {
        school: "slashing",
        icon: "Slashing/Cross Slash",
        tags: ["melee", "damage", "rage generation", "starter", "self-damage"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "melee",
        rangeDistance: 5,
        targetRestrictions: ["enemy"],
      },

      resourceCost: {
        actionPoints: 1,
        mana: 0,
        resourceTypes: ["mana", "rage_generation"],
        resourceValues: { mana: 0, rage_generation: 6 },
        classResource: { type: "rage", cost: -6 }, // Negative cost means generation
        components: ["verbal", "somatic"],
        verbalText: "A guttural, rattling gasp of raw exertion.",
        somaticText: "Heave your weapon back with agonizing force, muscles visibly tearing as you force the blade forward."
      },

      resolution: "DICE",
      effectTypes: ["damage", "debuff"],

      damageConfig: {
        formula: "1d12 + strength",
        damageTypes: ["slashing"],
        resolution: "DICE",
        description: "A brutal, agonizing swing. Deals massive slashing damage, but the recoil snaps your own muscle fibers.",
      },

      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          {
            id: "self_laceration",
            name: "Self-Laceration",
            description: "Your tendons tear from the swing.",
            mechanicsText: "Take 1d4 physical damage to self",
            statModifier: {
              stat: "health",
              magnitude: "-1d4",
              magnitudeType: "dice",
              formula: "-1d4"
            },
          },
        ],
        durationType: "instant",
        durationValue: 0,
        durationUnit: "rounds",
        canBeDispelled: false,
      },

      triggerConfig: {
        triggers: [
          {
            id: "self_laceration_trigger",
            name: "Self-Laceration",
            triggerType: "on_cast",
            action: "Take 1d4 physical damage to self upon swinging."
          }
        ]
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 0,
      },

      tags: ["melee", "damage", "rage generation", "starter", "self-damage", "berserker"],

      rollableTable: {
        enabled: true,
        tableName: "Hemorrhagic Ruin",
        description: "Your desperate swinging causes unpredictable biological tears.",
        diceFormula: "1d20",
        resolutionType: "DICE",
        resolutionConfig: { diceType: "d20" },
        entries: [
          { range: { min: 1, max: 2 }, customName: "Tendon Rupture", effect: "Your shoulder dislocates. Take 1d6 damage and your next attack has disadvantage." },
          { range: { min: 3, max: 5 }, customName: "Shallow Gash", effect: "Normal damage. You take 1d4 recoil damage." },
          { range: { min: 6, max: 10 }, customName: "Savage Rent", effect: "Deal +1d6 physical damage. You take 1d4 recoil." },
          { range: { min: 11, max: 15 }, customName: "Boiling Splatter", effect: "Your boiling blood sprays the target. Deal +1d6 fire damage. Gain +2 additional Blood-Heat." },
          { range: { min: 16, max: 18 }, customName: "Arterial Sunder", effect: "Deal +2d6 damage. Target is inflicted with Bleeding (1d4 damage/round for 2 rounds). Take 1d4 recoil." },
          { range: { min: 19, max: 20 }, customName: "Hemorrhagic Meltdown", effect: "Apocalyptic swing. Bypasses all armor. Deal +3d6 damage and gain +1d8 Blood-Heat. Take 2d4 recoil." },
        ],
      },
    },

    {
      id: "berserk_calloused_hide",
      name: "Calloused Hide",
      description:
        "Toggle a defensive posture. Your flesh thickens with crude scar tissue, hardening you against strikes and feeding your Blood-Heat when hit—but the rigid skin makes you slow and highly vulnerable to bleeding.",
      level: 1,
      spellType: "PASSIVE",
      icon: "Utility/Deflecting Shield",

      typeConfig: {
        school: "bludgeoning",
        icon: "Utility/Deflecting Shield",
        tags: ["defense", "buff", "stance", "toggleable", "starter"],
        toggleable: true,
        exclusiveGroup: "berserker_stance",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },

      resourceCost: {
        actionPoints: 0,
        mana: 0,
        resourceTypes: ["mana"],
        resourceValues: { mana: 0 },
        components: ["somatic"],
        somaticText: "Flex your muscles until the skin splits, forcing thick, grey scar tissue to encase your torso like overlapping plates."
      },

      resolution: "NONE",
      effectTypes: ["buff"],

      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          {
            id: "calloused_skin",
            name: "Calloused Skin",
            description: "Gain +2 Armor. Every time an enemy hits you with a melee attack, gain +1d4 Blood-Heat.",
            statModifier: {
              stat: "armor",
              magnitude: 2,
              magnitudeType: "flat",
            },
          },
          {
            id: "rigid_flesh_drawback",
            name: "Rigid Flesh",
            description: "Your rigid flesh makes you slow and highly vulnerable to bleeding.",
            mechanicsText: "-5 ft Movement Speed, +2 damage taken from Bleed and Poison",
            statModifier: {
              stat: "movement_speed",
              magnitude: -5,
              magnitudeType: "flat",
            },
          },
        ],
        durationValue: 0,
        durationType: "permanent",
        durationUnit: "permanent",
        concentrationRequired: false,
        canBeDispelled: false,
      },

      triggerConfig: {
        triggers: [
          {
            id: "stance_on_hit",
            name: "Pain-Driven Heat",
            triggerType: "passive",
            action: "When hit by an enemy melee attack, gain +1d4 Blood-Heat."
          }
        ]
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 0,
      },

      tags: ["defense", "buff", "stance", "toggleable", "starter", "berserker"],
    },

    {
      id: "berserk_boiling_veins",
      name: "Boiling Veins",
      description:
        "Toggle a terrifying offensive stance. You allow your Blood-Heat to boil within your vessels. Your melee attacks deal bonus fire/slashing damage and boil your adrenaline rapidly—but your vessels rupture, burning your own life away each turn.",
      level: 1,
      spellType: "PASSIVE",
      icon: "Slashing/Bloody Slash",

      typeConfig: {
        school: "fire",
        icon: "Slashing/Bloody Slash",
        tags: ["damage", "buff", "stance", "toggleable", "starter", "self-damage"],
        toggleable: true,
        exclusiveGroup: "berserker_stance",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },

      resourceCost: {
        actionPoints: 0,
        mana: 0,
        resourceTypes: ["mana"],
        resourceValues: { mana: 0 },
        components: ["somatic"],
        somaticText: "Pound your chest over your heart until your veins bulge black and steam rises from your breath."
      },

      resolution: "NONE",
      effectTypes: ["buff"],

      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          {
            id: "boiling_blood_strike",
            name: "Boiling Blood Strike",
            description: "Your melee attacks deal +1d4 bonus fire/slashing damage and generate +2 additional Blood-Heat on hit.",
            mechanicsText: "+1d4 bonus fire/slashing damage, +2 Blood-Heat on hit",
            statModifier: {
              stat: "damage",
              magnitude: "1d4",
              magnitudeType: "flat",
            },
          },
          {
            id: "vessel_rupture",
            name: "Vessel Rupture",
            description: "You lose 1 HP at the start of each of your turns as your boiling blood scorches your internal pathways.",
            mechanicsText: "Lose 1 HP at start of your turn",
            statModifier: {
              stat: "health",
              magnitude: -1,
              magnitudeType: "flat",
            },
          },
        ],
        durationValue: 0,
        durationType: "permanent",
        durationUnit: "permanent",
        concentrationRequired: false,
        canBeDispelled: false,
      },

      triggerConfig: {
        triggers: [
          {
            id: "boiling_veins_tick",
            name: "Vessel Rupture",
            triggerType: "start_of_turn",
            action: "Lose 1 HP as boiling blood scorches internal pathways."
          },
          {
            id: "boiling_veins_hit",
            name: "Boiling Blood Strike",
            triggerType: "on_hit",
            action: "Add +1d4 bonus fire/slashing damage and generate +2 Blood-Heat."
          }
        ]
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 0,
      },

      tags: ["damage", "buff", "stance", "toggleable", "starter", "self-damage", "berserker"],
    },

    {
      id: "berserker_metabolic_burnout",
      name: "Metabolic Burnout & Death's Door",
      description:
        "CLASS PASSIVE. You have absolutely zero self-healing or lifesteal. While Blood-Heat is 21 or higher, you enter a pain-numbed frenzy: you cannot receive healing from allies. However, when your HP falls below 30%, you enter Death's Door, allowing your attacks to completely bypass enemy physical resistances.",
      level: 1,
      spellType: "PASSIVE",
      icon: "General/Rage",
      effectTypes: ["passive"],
      typeConfig: {
        school: "physical",
        icon: "General/Rage",
        tags: ["passive", "berserker", "class-passive", "restriction"],
      },
      targetingConfig: { targetingType: "self" },
      resourceCost: {
        actionPoints: 0,
        mana: 0,
        components: ["somatic"],
        somaticText: "The black veins of your anatomical corruption swell and pulse beneath your skin, hard and cold as stone."
      },
      resolution: "AUTOMATIC",
      triggerConfig: {
        triggers: [
          {
            id: "pain_numbed_frenzy",
            name: "Pain-Numbed Frenzy",
            triggerType: "passive",
            action: "While Blood-Heat is 21 or higher, you cannot receive healing from allies."
          },
          {
            id: "deaths_door",
            name: "Death's Door",
            triggerType: "passive",
            action: "When HP falls below 30%, attacks completely bypass enemy physical resistances."
          }
        ]
      },
      tags: ["passive", "berserker", "class-passive", "restriction"],
    },

    // ========================================
    // LEVEL 2 SPELLS (Frenzied Aggression)
    // ========================================
    {
      id: "berserk_frenzied_slash",
      name: "Frenzied Slash",
      description:
        "Swing in a wider, reckless arc. It consumes a portion of your Blood-Heat to shred the target, but the strain forces your own veins to leak.",
      level: 2,
      spellType: "ACTION",
      icon: "Slashing/Cleave",

      typeConfig: {
        school: "slashing",
        icon: "Slashing/Cleave",
        tags: ["melee", "damage", "rage cost", "self-damage"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "melee",
        rangeDistance: 5,
        targetRestrictions: ["enemy"],
      },

      resourceCost: {
        actionPoints: 1,
        mana: 0,
        resourceTypes: ["mana", "rage_cost"],
        resourceValues: { mana: 0, rage_cost: 8 },
        classResource: { type: "rage", cost: 8 },
        components: ["somatic"],
        somaticText: "Twist your torso past normal alignment, snapping muscle binds to unleash a wider greataxe sweep."
      },

      resolution: "DICE",
      effectTypes: ["damage", "debuff"],

      damageConfig: {
        formula: "2d6 + strength",
        damageTypes: ["slashing"],
        resolution: "DICE",
      },

      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          {
            id: "muscle_leak",
            name: "Muscle Leak",
            description: "Your own muscle fibers leak from high pressure.",
            mechanicsText: "Take 1d4 physical damage to self; target is inflicted with Bleeding (1d6/round for 2 rounds)",
            statModifier: {
              stat: "health",
              magnitude: "-1d4",
              magnitudeType: "dice",
              formula: "-1d4"
            },
          },
        ],
        durationType: "rounds",
        durationValue: 2,
        durationUnit: "rounds",
        canBeDispelled: false,
      },

      triggerConfig: {
        triggers: [
          {
            id: "frenzied_slash_recoil",
            name: "Vascular Recoil",
            triggerType: "on_cast",
            action: "Take 1d4 physical damage to self as vascular pressure spikes."
          },
          {
            id: "frenzied_slash_bleed",
            name: "Arterial Shred",
            triggerType: "on_hit",
            action: "Target is inflicted with Bleeding, taking 1d6 damage per round for 2 rounds."
          }
        ]
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 0,
      },

      tags: ["melee", "damage", "rage cost", "self-damage", "berserker"],
    },

    {
      id: "berserk_sanguine_howl",
      name: "Sanguine Howl",
      description:
        "Shout with such terrifying volume that your own lungs bleed. The visible shockwave shatters enemy resolve while sending your allies into a desperate frenzy.",
      level: 2,
      spellType: "ACTION",
      icon: "Utility/Overlords Command",

      typeConfig: {
        school: "bludgeoning",
        icon: "Utility/Overlords Command",
        tags: ["aoe", "debuff", "buff", "shout", "rage cost"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "circle",
        aoeParameters: { radius: 30 },
        targetRestrictions: ["any"],
      },

      resourceCost: {
        actionPoints: 1,
        mana: 0,
        resourceTypes: ["mana", "rage_cost"],
        resourceValues: { mana: 0, rage_cost: 10 },
        classResource: { type: "rage", cost: 10 },
        components: ["verbal", "somatic"],
        verbalText: "A blood-choked, chest-vibrating roar of pure anatomical madness.",
        somaticText: "Expand your ribcage past its capacity, spraying a fine crimson mist from your lungs as you bellow."
      },

      resolution: "SAVE",
      effectTypes: ["debuff", "buff"],

      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          {
            id: "terrorized",
            name: "Terrorized",
            description: "Enemies within 30 ft are Frightened (disadvantage on attack rolls) for 2 rounds. DC 14 Spirit save negates.",
            mechanicsText: "Enemies in 30 ft are Frightened (disadvantage on attack rolls) for 2 rounds"
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
      },

      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          {
            id: "sanguine_ferocity",
            name: "Sanguine Ferocity",
            description: "Allies within 30 ft gain a +2 bonus to physical attack rolls for 2 rounds. You take 1d4 sonic damage from lung hemorrhaging.",
            mechanicsText: "Allies within 30 ft gain a +2 bonus to physical attack rolls; you take 1d4 sonic damage to self"
          },
        ],
        durationType: "rounds",
        durationValue: 2,
        durationUnit: "rounds",
      },

      triggerConfig: {
        triggers: [
          {
            id: "sanguine_howl_recoil",
            name: "Lung Hemorrhage",
            triggerType: "on_cast",
            action: "Take 1d4 sonic self-damage from internal lung hemorrhaging."
          },
          {
            id: "sanguine_howl_intimidate",
            name: "Intimidating Shockwave",
            triggerType: "on_cast",
            action: "Enemies within 30 ft must make a DC 14 Spirit save or become Frightened for 2 rounds."
          },
          {
            id: "sanguine_howl_ferocity",
            name: "Inspirational Bloodspray",
            triggerType: "on_cast",
            action: "Allies within 30 ft gain +2 to physical attacks as they witness your struggle."
          }
        ]
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 3,
      },

      tags: ["aoe", "debuff", "buff", "shout", "rage cost", "berserker"],
    },

    // ========================================
    // LEVEL 3 SPELLS (Bone-Shattering Impact)
    // ========================================
    {
      id: "berserk_ruptured_leap",
      name: "Ruptured Leap",
      description:
        "Catapult your frame through the air and land with enough violence to sunder the earth. The impact shatters your own tibia, generating intense heat while leaving your foes crushed and broken.",
      level: 3,
      spellType: "ACTION",
      icon: "Utility/Speed Dash",

      typeConfig: {
        school: "bludgeoning",
        icon: "Utility/Speed Dash",
        tags: ["aoe", "damage", "control", "rage generation", "self-damage"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 30,
        aoeShape: "circle",
        aoeParameters: { radius: 15 },
        targetRestrictions: ["enemy"],
      },

      resourceCost: {
        actionPoints: 2,
        mana: 0,
        resourceTypes: ["mana", "rage_generation"],
        resourceValues: { mana: 0, rage_generation: 15 },
        classResource: { type: "rage", cost: -15 },
        components: ["somatic"],
        somaticText: "Push off with bone-splintering power, jumping up to 30 ft and crashing down feet-first into the earth."
      },

      resolution: "DICE",
      effectTypes: ["damage", "control", "debuff"],

      damageConfig: {
        formula: "2d8 + strength",
        damageTypes: ["bludgeoning"],
        resolution: "DICE",
      },

      controlConfig: {
        controlType: "knockdown",
        effects: [
          {
            id: "crushed_ground",
            name: "Crushed Ground",
            description: "Enemies in the landing zone are knocked prone. DC 14 Agility save negates.",
            config: {
              saveType: "agility",
              saveDC: 14,
            },
          },
        ],
        duration: 0,
        durationUnit: "instant",
      },

      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          {
            id: "shattered_tibia",
            name: "Shattered Tibia",
            description: "The violent landing crushes your own bone structure.",
            mechanicsText: "Take 1d6 physical damage and -15 ft movement speed for 1 round",
            statModifier: {
              stat: "movement_speed",
              magnitude: -15,
              magnitudeType: "flat",
            },
          },
        ],
        durationType: "rounds",
        durationValue: 1,
        durationUnit: "rounds",
      },

      triggerConfig: {
        triggers: [
          {
            id: "ruptured_leap_recoil",
            name: "Shattered Tibia",
            triggerType: "on_cast",
            action: "Take 1d6 physical self-damage upon landing."
          },
          {
            id: "ruptured_leap_impact",
            name: "Tectonic Crash",
            triggerType: "on_cast",
            action: "Enemies in landing zone are knocked prone unless they pass a DC 14 Agility save."
          }
        ]
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 3,
      },

      tags: ["aoe", "damage", "control", "rage generation", "self-damage", "berserker"],
    },

    {
      id: "berserk_pain_starvation",
      name: "Pain Starvation",
      description:
        "CLASS WEAKNESS. If you go 2 full rounds without dealing melee damage to an enemy, your body suffers immediate adrenaline withdrawal. Your Blood-Heat decays by 10 per round, and you gain disadvantage on all Dodge and Agility checks as your muscles shake.",
      level: 3,
      spellType: "PASSIVE",
      icon: "/Exhausted",
      effectTypes: ["passive"],
      typeConfig: {
        school: "physical",
        icon: "/Exhausted",
        tags: ["passive", "weakness", "berserker"],
      },
      targetingConfig: { targetingType: "self" },
      resourceCost: {
        actionPoints: 0,
        mana: 0,
        components: ["somatic"],
        somaticText: "Your limbs tremble and twitch uncontrollably as your metabolic rage freezes, starved of violence."
      },
      resolution: "AUTOMATIC",
      triggerConfig: {
        triggers: [
          {
            id: "pain_starvation_decay",
            name: "Adrenaline Withdrawal",
            triggerType: "end_of_turn",
            action: "If no melee damage was dealt to an enemy for 2 rounds, Blood-Heat decays by 10 per round and you suffer disadvantage on Dodge/Agility checks."
          }
        ]
      },
      tags: ["passive", "weakness", "berserker"],
    },

    // ========================================
    // LEVEL 4 SPELLS (Peak Self-Mutilation)
    // ========================================
    {
      id: "berserk_carnage_strike",
      name: "Carnage Strike",
      description:
        "A devastating overhead cleave that splits flesh and armor alike. You swing with such reckless weight that your shoulder partially dislocates, but the target's physical resistance is completely ignored if they are already wounded.",
      level: 4,
      spellType: "ACTION",
      icon: "Bludgeoning/Mortal Strike",

      typeConfig: {
        school: "slashing",
        icon: "Bludgeoning/Mortal Strike",
        tags: ["melee", "damage", "execute", "rage cost", "self-damage"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "melee",
        rangeDistance: 5,
        targetRestrictions: ["enemy"],
      },

      resourceCost: {
        actionPoints: 2,
        mana: 0,
        resourceTypes: ["mana", "rage_cost"],
        resourceValues: { mana: 0, rage_cost: 20 },
        classResource: { type: "rage", cost: 20 },
        components: ["somatic"],
        somaticText: "Raise your heavy weapon overhead with locking joints, bringing it down like a falling guillotine."
      },

      resolution: "DICE",
      effectTypes: ["damage", "debuff"],

      damageConfig: {
        formula: "3d12 + strength",
        damageTypes: ["slashing"],
        resolution: "DICE",
      },

      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          {
            id: "shoulder_dislocation",
            name: "Shoulder Dislocation",
            description: "Your shoulder pops under the load.",
            mechanicsText: "Take 1d8 physical damage and you cannot take Reactions for 1 round",
            statModifier: {
              stat: "health",
              magnitude: "-1d8",
              magnitudeType: "dice",
              formula: "-1d8"
            },
          },
        ],
        durationType: "rounds",
        durationValue: 1,
        durationUnit: "rounds",
      },

      triggerConfig: {
        triggers: [
          {
            id: "carnage_strike_recoil",
            name: "Shoulder Dislocation",
            triggerType: "on_cast",
            action: "Take 1d8 physical self-damage and lose your reaction for 1 round."
          },
          {
            id: "carnage_strike_execute",
            name: "Armor Shatter",
            triggerType: "on_hit",
            action: "If the target is wounded, completely ignore their physical resistances."
          }
        ]
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 2,
      },

      tags: ["melee", "damage", "execute", "rage cost", "self-damage", "berserker"],
    },

    {
      id: "berserk_raging_defense",
      name: "Raging Defense",
      description:
        "Force your mind to block out the agony of your ruined frame. You gain massive temporary endurance, but the sheer physical exertion leaves you slow to react.",
      level: 4,
      spellType: "ACTION",
      icon: "Utility/Shield",

      typeConfig: {
        school: "bludgeoning",
        icon: "Utility/Shield",
        tags: ["buff", "temp hp", "defense", "rage cost"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },

      resourceCost: {
        actionPoints: 1,
        mana: 0,
        resourceTypes: ["mana", "rage_cost"],
        resourceValues: { mana: 0, rage_cost: 25 },
        classResource: { type: "rage", cost: 25 },
        components: ["somatic"],
        somaticText: "Clench your fists until your fingernails cut your palms, ignoring the agony of current wounds."
      },

      resolution: "DICE",
      effectTypes: ["buff", "debuff"],

      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          {
            id: "rage_resilience",
            name: "Rage Resilience",
            description: "Gain 3d8 + Constitution modifier temporary HP (NOT healing). Lasts 3 rounds.",
            mechanicsText: "Gain 3d8 + Constitution modifier temporary HP (Grit shield) for 3 rounds",
            statModifier: {
              stat: "temporary_hp",
              magnitude: "3d8",
              magnitudeType: "dice",
            },
          },
        ],
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds",
      },

      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          {
            id: "resilience_exhaustion",
            name: "Exertion Fatigue",
            description: "Your Agility is reduced by 2 for 3 rounds due to muscular locking.",
            mechanicsText: "-2 Agility for 3 rounds",
            statModifier: {
              stat: "agility",
              magnitude: -2,
              magnitudeType: "flat",
            },
          },
        ],
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds",
      },

      triggerConfig: {
        triggers: [
          {
            id: "raging_defense_shield",
            name: "Endurance Lock",
            triggerType: "on_cast",
            action: "Gain 3d8 + Constitution modifier Grit temporary HP (does not count as healing)."
          },
          {
            id: "raging_defense_exhaustion",
            name: "Muscular Stiffness",
            triggerType: "on_cast",
            action: "Your joints lock, reducing Agility by 2 for 3 rounds."
          }
        ]
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 4,
      },

      tags: ["buff", "temp hp", "defense", "rage cost", "berserker"],
    },

    // ========================================
    // LEVEL 5 SPELLS (Threshold of Collapse)
    // ========================================
    {
      id: "berserk_cataclysmic_blow",
      name: "Cataclysmic Blow",
      description:
        "Slam your weapon forward with catastrophic force, sundering bones and sending the target flying. The impact reverberates through your own forearms, shattering your skeletal structural integrity.",
      level: 5,
      spellType: "ACTION",
      icon: "Bludgeoning/Mortal Strike",

      typeConfig: {
        school: "bludgeoning",
        icon: "Bludgeoning/Mortal Strike",
        tags: ["melee", "damage", "control", "rage cost", "self-damage"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "melee",
        rangeDistance: 5,
        targetRestrictions: ["enemy"],
      },

      resourceCost: {
        actionPoints: 3,
        mana: 0,
        resourceTypes: ["mana", "rage_cost"],
        resourceValues: { mana: 0, rage_cost: 35 },
        classResource: { type: "rage", cost: 35 },
        components: ["verbal", "somatic"],
        verbalText: "A deafening, beast-like bellow that ruptures vocal cords.",
        somaticText: "Slam your heavy weapon forward, letting the kinetic recoil sunder the flesh of your forearms."
      },

      resolution: "DICE",
      effectTypes: ["damage", "control", "debuff"],

      damageConfig: {
        formula: "4d10 + strength",
        damageTypes: ["bludgeoning"],
        resolution: "DICE",
      },

      controlConfig: {
        controlType: "knockdown",
        effects: [
          {
            id: "cataclysmic_shatter",
            name: "Bone Shatter",
            description: "Target is knocked back 15 ft and is Stunned for 1 round. DC 16 Constitution save negates the Stun.",
            config: {
              distance: 15,
              saveType: "constitution",
              saveDC: 16,
            },
          },
        ],
        duration: 1,
        durationUnit: "rounds",
      },

      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          {
            id: "forearm_splinters",
            name: "Forearm Splinters",
            description: "The violent shockwave cracks your own radius.",
            mechanicsText: "Take 2d6 physical damage and -2 on attack rolls for 1 round",
            statModifier: {
              stat: "attack_rolls",
              magnitude: -2,
              magnitudeType: "flat",
            },
          },
        ],
        durationType: "rounds",
        durationValue: 1,
        durationUnit: "rounds",
      },

      triggerConfig: {
        triggers: [
          {
            id: "cataclysmic_blow_recoil",
            name: "Forearm Fracture",
            triggerType: "on_cast",
            action: "Take 2d6 physical self-damage and your attack rolls suffer a -2 penalty for 1 round."
          },
          {
            id: "cataclysmic_blow_shatter",
            name: "Concussive Impact",
            triggerType: "on_hit",
            action: "Target is knocked back 15 ft and Stunned for 1 round unless they pass a DC 16 Constitution save."
          }
        ]
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 3,
      },

      tags: ["melee", "damage", "control", "rage cost", "self-damage", "berserker"],
    },

    {
      id: "berserk_unstoppable_force",
      name: "Unstoppable Force",
      description:
        "Force your boiling adrenaline to circulate at lethal pressures. You instantly rip free from all movement restraints and become completely immune to slows or paralysis—but your blood vessels burst, draining your life away.",
      level: 5,
      spellType: "ACTION",
      icon: "Utility/Empowered Warrior",

      typeConfig: {
        school: "physical",
        icon: "Utility/Empowered Warrior",
        tags: ["buff", "mobility", "rage cost", "self-damage"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },

      resourceCost: {
        actionPoints: 1,
        mana: 0,
        resourceTypes: ["mana", "rage_cost"],
        resourceValues: { mana: 0, rage_cost: 20 },
        classResource: { type: "rage", cost: 20 },
        components: ["somatic"],
        somaticText: "Rip and tear off any physical restraints or bonds with raw, bloody muscular force."
      },

      resolution: "NONE",
      effectTypes: ["buff", "debuff"],

      buffConfig: {
        buffType: "movementBuff",
        effects: [
          {
            id: "unrestrained",
            name: "Unrestrained Flow",
            description: "Immune to Slowed, Restrained, and Paralyzed. Movement speed is increased by 10 ft. Lasts 3 rounds.",
            mechanicsText: "Immune to Slowed, Restrained, and Paralyzed; +10 ft movement speed for 3 rounds",
            statModifier: {
              stat: "movement_speed",
              magnitude: 10,
              magnitudeType: "flat",
            },
          },
        ],
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds",
      },

      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          {
            id: "vascular_leak",
            name: "Vascular Burst",
            description: "Take 1d6 fire/physical damage at the start of each of your turns as your veins burst.",
            mechanicsText: "Take 1d6 fire/physical damage to self at start of turn for 3 rounds",
            statModifier: {
              stat: "health",
              magnitude: "-1d6",
              magnitudeType: "dice",
              formula: "-1d6"
            },
          },
        ],
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds",
      },

      triggerConfig: {
        triggers: [
          {
            id: "unstoppable_force_purge",
            name: "Restraint Purge",
            triggerType: "on_cast",
            action: "Instantly clear all Slowed, Restrained, and Paralyzed conditions from yourself."
          },
          {
            id: "unstoppable_force_leak",
            name: "Vascular Recoil",
            triggerType: "start_of_turn",
            action: "Take 1d6 fire/physical damage to self at the start of each of your turns for 3 rounds."
          }
        ]
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 4,
      },

      tags: ["buff", "mobility", "rage cost", "self-damage", "berserker"],
    },

    // ========================================
    // LEVEL 6 SPELLS (The Ultimate Execute)
    // ========================================
    {
      id: "berserk_obliterating_strike",
      name: "Obliterating Strike",
      description:
        "The ultimate Death's Door execute. Channel your entire dying vitality into a single slash. Bypasses all damage resistances and shields. If your own HP is critically low, this strike splits the physical world.",
      level: 6,
      spellType: "ACTION",
      icon: "Slashing/Cleave",

      typeConfig: {
        school: "slashing",
        icon: "Slashing/Cleave",
        tags: ["melee", "damage", "execute", "rage cost", "self-damage"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "melee",
        rangeDistance: 5,
        targetRestrictions: ["enemy"],
      },

      resourceCost: {
        actionPoints: 2,
        mana: 0,
        resourceTypes: ["mana", "rage_cost"],
        resourceValues: { mana: 0, rage_cost: 50 },
        classResource: { type: "rage", cost: 50 },
        components: ["verbal", "somatic"],
        verbalText: "An agonizing, hoarse scream of absolute finality that bursts capillaries in your eyes.",
        somaticText: "Put every ounce of your structural momentum into a shattering, two-handed downward slash, ignoring the warning crunch of your shoulder joints."
      },

      resolution: "DICE",
      effectTypes: ["damage", "debuff"],

      damageConfig: {
        formula: "5d12 + strength",
        damageTypes: ["slashing"],
        resolution: "DICE",
      },

      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          {
            id: "skeletal_fracture",
            name: "Skeletal Fracture",
            description: "Your own bones splinter from the strike. Take 3d6 physical damage. If you were below 30% HP, this attack deals double damage (10d12 + Strength) and completely annihilates non-boss enemies.",
            mechanicsText: "Take 3d6 physical damage; deals 2x damage and pulverizes non-bosses if under 30% HP",
            statModifier: {
              stat: "health",
              magnitude: "-3d6",
              magnitudeType: "dice",
              formula: "-3d6"
            }
          },
        ],
        durationType: "instant",
        durationValue: 0,
        durationUnit: "rounds",
      },

      triggerConfig: {
        triggers: [
          {
            id: "obliterating_recoil",
            name: "Skeletal Recoil",
            triggerType: "on_cast",
            action: "Take 3d6 physical self-damage upon execution."
          },
          {
            id: "obliterating_execute",
            name: "Death's Door Pulverize",
            triggerType: "on_hit",
            action: "If you are below 30% HP, this attack deals double damage and completely pulverizes non-boss enemies."
          }
        ]
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 5,
      },

      tags: ["melee", "damage", "execute", "rage cost", "self-damage", "berserker"],
    },

    {
      id: "berserk_wrath_berserker",
      name: "Wrath of the Berserker",
      description:
        "Enter a terrifying state where your heart pumps like a war drum. Your attack speed is doubled, but the systemic strain scorches your frame from within.",
      level: 6,
      spellType: "ACTION",
      icon: "General/Rage",

      typeConfig: {
        school: "physical",
        icon: "General/Rage",
        tags: ["buff", "rage cost", "self-damage"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },

      resourceCost: {
        actionPoints: 1,
        mana: 0,
        resourceTypes: ["mana", "rage_cost"],
        resourceValues: { mana: 0, rage_cost: 40 },
        classResource: { type: "rage", cost: 40 },
        components: ["verbal", "somatic"],
        verbalText: "A rapid, chest-vibrating hyperventilation that rises into an animalistic screech.",
        somaticText: "Beat your chest rhythmically like a hammer, forcing your pulse to accelerate to terrifying, lethal speeds."
      },

      resolution: "NONE",
      effectTypes: ["buff", "debuff"],

      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          {
            id: "heart_overdrive",
            name: "Heart Overdrive",
            description: "Gain +1 extra action point per turn. All attack rolls have advantage. Lasts 3 rounds.",
            mechanicsText: "+1 extra action point per turn, advantage on all attack rolls for 3 rounds",
            statModifier: {
              stat: "action_points",
              magnitude: 1,
              magnitudeType: "flat",
            },
          },
        ],
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds",
      },

      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          {
            id: "cardiac_strain",
            name: "Cardiac Strain",
            description: "Take 1d8 physical damage at the start of your turn. You cannot be targeted by friendly healing spells.",
            mechanicsText: "Take 1d8 physical damage to self at start of turn; cannot be healed by allies",
            statModifier: {
              stat: "health",
              magnitude: "-1d8",
              magnitudeType: "dice",
              formula: "-1d8"
            }
          },
        ],
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds",
      },

      triggerConfig: {
        triggers: [
          {
            id: "wrath_cardiac_strain",
            name: "Cardiac Recoil",
            triggerType: "start_of_turn",
            action: "Take 1d8 physical damage at the start of your turn for 3 rounds."
          },
          {
            id: "wrath_healing_block",
            name: "Sanguine Isolation",
            triggerType: "passive",
            action: "You cannot be targeted by friendly healing spells during this rage."
          }
        ]
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 6,
      },

      tags: ["buff", "rage cost", "self-damage", "berserker"],
    },

    // ========================================
    // LEVEL 7 SPELLS (Unmitigated Bloodletting)
    // ========================================
    {
      id: "berserk_blood_frenzy",
      name: "Blood Frenzy",
      description:
        "Toggle a tragic state where you paint the arena in your own boiling blood. Your attacks spray boiling liquid, dealing intense bonus damage, but the vascular pressure slowly leaks your life away.",
      level: 7,
      spellType: "STATE",
      icon: "Necrotic/Blood Skull",

      typeConfig: {
        school: "fire",
        icon: "Necrotic/Blood Skull",
        tags: ["buff", "damage", "toggleable", "rage cost", "self-damage"],
        toggleable: true,
        exclusiveGroup: "berserker_stance",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },

      resourceCost: {
        actionPoints: 1,
        mana: 0,
        resourceTypes: ["mana", "rage_cost"],
        resourceValues: { mana: 0, rage_cost: 30 },
        classResource: { type: "rage", cost: 30 },
        components: ["somatic"],
        somaticText: "Slash your own forearms before entering battle, letting your pressurized, boiling blood spray over your weapons."
      },

      resolution: "NONE",
      effectTypes: ["buff", "debuff"],

      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          {
            id: "boiling_blood_spray",
            name: "Boiling Blood Spray",
            description: "All melee attacks deal +2d6 bonus fire/slashing damage. Bypasses 50% of enemy Armor.",
            mechanicsText: "Melee attacks deal +2d6 bonus fire/slashing damage and bypass 50% Armor",
            statModifier: {
              stat: "damage",
              magnitude: "2d6",
              magnitudeType: "flat",
            },
          },
        ],
        durationType: "permanent",
        durationUnit: "permanent",
      },

      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          {
            id: "arterial_hemorrhage",
            name: "Arterial Hemorrhage",
            description: "You cannot receive healing from any source. You take 2 HP bleeding damage at the end of each round.",
            mechanicsText: "Cannot receive healing from any source; take 2 physical damage at end of round",
            statModifier: {
              stat: "health",
              magnitude: -2,
              magnitudeType: "flat",
              formula: "-2"
            }
          },
        ],
        durationType: "permanent",
        durationUnit: "permanent",
      },

      triggerConfig: {
        triggers: [
          {
            id: "blood_frenzy_spray",
            name: "Arterial Stance",
            triggerType: "passive",
            action: "melee attacks deal +2d6 bonus fire/slashing damage and bypass 50% of enemy Armor while active."
          },
          {
            id: "blood_frenzy_leak",
            name: "Slow Bleed",
            triggerType: "end_of_round",
            action: "Take 2 HP physical self-damage at the end of each round."
          }
        ]
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 0,
      },

      tags: ["buff", "damage", "toggleable", "rage cost", "self-damage", "berserker"],
    },

    // ========================================
    // LEVEL 8 SPELLS (Denying the Grave)
    // ========================================
    {
      id: "berserk_immortal_rage",
      name: "Immortal Rage",
      description:
        "Refuse to submit to death. You lock your muscular structure, ignoring all mortal injuries. You cannot die or fall unconscious, and your HP cannot drop below 1—but the toll of this defiance is catastrophic when the rage fades.",
      level: 8,
      spellType: "ACTION",
      icon: "Necrotic/Drain Soul",

      typeConfig: {
        school: "physical",
        icon: "Necrotic/Drain Soul",
        tags: ["buff", "immortality", "rage cost", "self-damage"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },

      resourceCost: {
        actionPoints: 3,
        mana: 0,
        resourceTypes: ["mana", "rage_cost"],
        resourceValues: { mana: 0, rage_cost: 60 },
        classResource: { type: "rage", cost: 60 },
        components: ["verbal", "somatic"],
        verbalText: "A continuous, furious, white-hot shriek of raw defiance.",
        somaticText: "Lock your joints and bones completely, ignoring structural breaks to keep fighting."
      },

      resolution: "NONE",
      effectTypes: ["buff", "debuff"],

      buffConfig: {
        buffType: "statusEffectBuff",
        effects: [
          {
            id: "death_defied",
            name: "Death Defied",
            description: "Immune to death and lethal damage. HP cannot drop below 1. Lasts 3 rounds.",
            mechanicsText: "Immune to death and lethal damage; HP cannot drop below 1 for 3 rounds"
          },
        ],
        durationValue: 3,
        durationType: "rounds",
        durationUnit: "rounds",
      },

      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          {
            id: "lethal_exhaustion",
            name: "Lethal Exhaustion",
            description: "When this state ends, your body collapses: take 5d6 unresistable exhaustion damage and you are Stunned for 1 round.",
            mechanicsText: "Take 5d6 unresistable damage and Stunned for 1 round when rage ends",
            statModifier: {
              stat: "health",
              magnitude: "-5d6",
              magnitudeType: "dice",
              formula: "-5d6"
            }
          },
        ],
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds",
      },

      triggerConfig: {
        triggers: [
          {
            id: "immortal_rage_defy",
            name: "Grave Defiance",
            triggerType: "passive",
            action: "You cannot die, fall unconscious, or drop below 1 HP for 3 rounds."
          },
          {
            id: "immortal_rage_fallout",
            name: "Lethal Backlash",
            triggerType: "on_fade",
            action: "When the effect ends, take 5d6 unresistable physical exhaustion damage and be Stunned for 1 round."
          }
        ]
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 8,
      },

      tags: ["buff", "immortality", "rage cost", "self-damage", "berserker"],
    },

    {
      id: "berserk_earthshaker_slam",
      name: "Earthshaker Slam",
      description:
        "Slam your heavy arms into the earth with massive force. The seismic shockwave drags enemies toward your position while fracturing your own wrists.",
      level: 8,
      spellType: "ACTION",
      icon: "Bludgeoning/Mortal Strike",

      typeConfig: {
        school: "bludgeoning",
        icon: "Bludgeoning/Mortal Strike",
        tags: ["aoe", "damage", "control", "rage cost", "self-damage"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "circle",
        aoeParameters: { radius: 30 },
        targetRestrictions: ["enemy"],
      },

      resourceCost: {
        actionPoints: 3,
        mana: 0,
        resourceTypes: ["mana", "rage_cost"],
        resourceValues: { mana: 0, rage_cost: 50 },
        classResource: { type: "rage", cost: 50 },
        components: ["verbal", "somatic"],
        verbalText: "A chest-shaking, window-rattling roar of destruction.",
        somaticText: "Leap slightly and slam both heavy weapons or fists straight into the ground with bone-shattering force."
      },

      resolution: "SAVE",
      effectTypes: ["damage", "control", "debuff"],

      damageConfig: {
        formula: "5d8 + strength",
        damageTypes: ["bludgeoning"],
        resolution: "DICE",
        savingThrow: {
          ability: "constitution",
          difficultyClass: 18,
          saveOutcome: "half_damage",
        },
      },

      controlConfig: {
        controlType: "forcedMovement",
        effects: [
          {
            id: "seismic_drag",
            name: "Seismic Drag",
            description: "Enemies are dragged 15 ft toward you by the fracturing ground.",
            config: {
              distance: 15,
              movementType: "pull",
            },
          },
        ],
        duration: 0,
        durationUnit: "instant",
      },

      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          {
            id: "fractured_wrists",
            name: "Fractured Wrists",
            description: "Your own wrists crack under the impact. Take 2d6 physical damage and your melee attacks have disadvantage next turn.",
            mechanicsText: "Take 2d6 physical damage and disadvantage on melee attacks next turn",
            statModifier: {
              stat: "health",
              magnitude: "-2d6",
              magnitudeType: "dice",
              formula: "-2d6"
            }
          },
        ],
        durationType: "rounds",
        durationValue: 1,
        durationUnit: "rounds",
      },

      triggerConfig: {
        triggers: [
          {
            id: "earthshaker_wrists",
            name: "Wrist Fracture",
            triggerType: "on_cast",
            action: "Take 2d6 physical self-damage upon slam."
          },
          {
            id: "earthshaker_pull",
            name: "Seismic Pull",
            triggerType: "on_hit",
            action: "Drag all affected enemies 15 ft toward you."
          }
        ]
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 5,
      },

      tags: ["aoe", "damage", "control", "rage cost", "self-damage", "berserker"],
    },

    // ========================================
    // LEVEL 9 SPELLS (Apocalyptic Exertion)
    // ========================================
    {
      id: "berserk_primal_cataclysm",
      name: "Primal Cataclysm",
      description:
        "Erupt in an explosion of desperate, earth-shaking violence. You strike the ground, tearing your own muscle tissue completely to deal massive crushing damage to all nearby foes.",
      level: 9,
      spellType: "ACTION",
      icon: "Arcane/Missile",

      typeConfig: {
        school: "bludgeoning",
        icon: "Arcane/Missile",
        tags: ["aoe", "damage", "rage cost", "self-damage"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "circle",
        aoeParameters: { radius: 25 },
        targetRestrictions: ["enemy"],
      },

      resourceCost: {
        actionPoints: 4,
        mana: 0,
        resourceTypes: ["mana", "rage_cost"],
        resourceValues: { mana: 0, rage_cost: 70 },
        classResource: { type: "rage", cost: 70 },
        components: ["verbal", "somatic"],
        verbalText: "A blood-spitting, guttural roar of explosive release.",
        somaticText: "Force your adrenaline past its ceiling, driving your weapons into the earth with massive force."
      },

      resolution: "SAVE",
      effectTypes: ["damage", "debuff"],

      damageConfig: {
        formula: "6d10 + strength",
        damageTypes: ["bludgeoning"],
        resolution: "DICE",
        savingThrow: {
          ability: "constitution",
          difficultyClass: 19,
          saveOutcome: "half_damage",
        },
      },

      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          {
            id: "systemic_muscle_tear",
            name: "Systemic Tear",
            description: "Your muscular system begins to fail. Take 4d6 physical damage and your Armor is reduced by 4 for 2 rounds.",
            mechanicsText: "Take 4d6 physical damage and -4 Armor for 2 rounds",
            statModifier: {
              stat: "armor",
              magnitude: -4,
              magnitudeType: "flat",
            },
          },
        ],
        durationType: "rounds",
        durationValue: 2,
        durationUnit: "rounds",
      },

      triggerConfig: {
        triggers: [
          {
            id: "cataclysm_muscle_tear",
            name: "Systemic Rip",
            triggerType: "on_cast",
            action: "Take 4d6 physical self-damage and suffer -4 Armor for 2 rounds."
          }
        ]
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 6,
      },

      tags: ["aoe", "damage", "rage cost", "self-damage", "berserker"],
    },

    {
      id: "berserk_veterans_resolve",
      name: "Veteran's Resolve",
      description:
        "Focus your agonizing pain into perfect, deadly accuracy. Your melee attacks gain a flat damage bonus, but the frenzy requires constant aggression—if you go a turn without attacking, your focus collapses.",
      level: 9,
      spellType: "ACTION",
      icon: "General/Rage",

      typeConfig: {
        school: "physical",
        icon: "General/Rage",
        tags: ["buff", "rage cost", "self-damage"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },

      resourceCost: {
        actionPoints: 1,
        mana: 0,
        resourceTypes: ["mana", "rage_cost"],
        resourceValues: { mana: 0, rage_cost: 45 },
        classResource: { type: "rage", cost: 45 },
        components: ["somatic"],
        somaticText: "Close your eyes briefly in the blood spray, focusing every fiber of your muscle memory into pure murder."
      },

      resolution: "NONE",
      effectTypes: ["buff", "debuff"],

      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          {
            id: "fatal_precision",
            name: "Fatal Precision",
            description: "Your melee attacks deal +10 flat physical damage. Lasts 3 rounds.",
            mechanicsText: "Melee attacks deal +10 flat physical damage for 3 rounds",
            statModifier: {
              stat: "damage",
              magnitude: 10,
              magnitudeType: "flat",
            },
          },
        ],
        durationValue: 3,
        durationType: "rounds",
        durationUnit: "rounds",
      },

      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          {
            id: "precision_strain",
            name: "Precision Strain",
            description: "Take 1d10 physical damage at the end of each round. If you go a turn without attacking, this effect ends immediately.",
            mechanicsText: "Take 1d10 physical damage at end of turn; buff ends early if no attacks are made",
            statModifier: {
              stat: "health",
              magnitude: "-1d10",
              magnitudeType: "dice",
              formula: "-1d10"
            }
          },
        ],
        durationValue: 3,
        durationType: "rounds",
        durationUnit: "rounds",
      },

      triggerConfig: {
        triggers: [
          {
            id: "precision_end_damage",
            name: "Precision Backlash",
            triggerType: "end_of_turn",
            action: "Take 1d10 physical self-damage at the end of each turn for 3 rounds."
          },
          {
            id: "precision_attack_check",
            name: "Aggression Keep",
            triggerType: "passive",
            action: "If you do not make a melee attack on your turn, this stance ends instantly."
          }
        ]
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 5,
      },

      tags: ["buff", "rage cost", "self-damage", "berserker"],
    },

    // ========================================
    // LEVEL 10 SPELLS (The Meltdown Apex)
    // ========================================
    {
      id: "berserk_cataclysmic_fury",
      name: "Cataclysmic Fury",
      description:
        "The ultimate explosion of Blood-Heat. Release every ounce of accumulated adrenaline in a catastrophic blast. The pressure nearly ruptures your heart, but turns all nearby life into ash.",
      level: 10,
      spellType: "ACTION",
      icon: "Fire/Fiery Comet",

      typeConfig: {
        school: "bludgeoning",
        icon: "Fire/Fiery Comet",
        tags: ["aoe", "damage", "execute", "rage cost", "self-damage"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "circle",
        aoeParameters: { radius: 30 },
        targetRestrictions: ["enemy"],
      },

      resourceCost: {
        actionPoints: 4,
        mana: 0,
        resourceTypes: ["mana", "rage_cost"],
        resourceValues: { mana: 0, rage_cost: 90 },
        classResource: { type: "rage", cost: 90 },
        components: ["verbal", "somatic"],
        verbalText: "A world-ending, blood-choked screech of catastrophic fury.",
        somaticText: "Force all Blood-Heat outward in a thermal, seismic blast that literally cracks your own breastbone."
      },

      resolution: "SAVE",
      effectTypes: ["damage", "debuff"],

      damageConfig: {
        formula: "8d12 + strength",
        damageTypes: ["bludgeoning"],
        resolution: "DICE",
        savingThrow: {
          ability: "constitution",
          difficultyClass: 20,
          saveOutcome: "half_damage",
        },
      },

      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          {
            id: "cardiac_rupture",
            name: "Cardiac Rupture",
            description: "Your heart wall tears under the load. Take 5d8 unresistable physical damage.",
            mechanicsText: "Take 5d8 unresistable physical damage to self",
            statModifier: {
              stat: "health",
              magnitude: "-5d8",
              magnitudeType: "dice",
              formula: "-5d8"
            }
          },
        ],
        durationType: "instant",
        durationValue: 0,
        durationUnit: "rounds",
      },

      triggerConfig: {
        triggers: [
          {
            id: "cardiac_rupture_recoil",
            name: "Aortic Rupture",
            triggerType: "on_cast",
            action: "Take 5d8 unresistable physical damage to self upon execution."
          }
        ]
      },

      cooldownConfig: {
        cooldownType: "combat",
        cooldownValue: 1,
      },

      tags: ["aoe", "damage", "execute", "rage cost", "self-damage", "berserker"],

      rollableTable: {
        enabled: true,
        tableName: "Cataclysmic Aftermath",
        description: "Your final explosion of rage creates a catastrophic shockwave on the physical plane.",
        diceFormula: "1d20",
        resolutionType: "DICE",
        resolutionConfig: { diceType: "d20" },
        entries: [
          { range: { min: 1, max: 2 }, customName: "Cardiac Rupture", effect: "Your heart ruptures completely. Take 8d8 physical damage and you are Stunned for 2 rounds." },
          { range: { min: 3, max: 5 }, customName: "Systemic Collapse", effect: "Normal damage. You collapse to 1 HP. Your Blood-Heat is reset to 0." },
          { range: { min: 6, max: 12 }, customName: "Scorched Earth", effect: "All affected enemies are knocked prone and take +2d6 fire damage. You take normal self-damage." },
          { range: { min: 13, max: 17 }, customName: "Boiling Shockwave", effect: "All affected enemies take +4d6 fire damage. Area is ignited (1d8 fire/round for 3 rounds)." },
          { range: { min: 18, max: 20 }, customName: "Ragnarok Manifest", effect: "The blast sunders the room. All enemies take double damage (16d12 + Strength). Non-bosses are pulverized completely. You heal to full HP from pure adrenaline, and all your abilities are reset. Self-damage is completely bypassed." },
        ],
      },
    },

    {
      id: "berserk_battle_incarnate",
      name: "Battle Incarnate",
      description:
        "Transform into an unstoppable colossus of war. Your boiling blood hardens your skin into living stone, replacing all your standard Blood-Heat state bonuses. The transformation is absolute—you cannot dodge, block, or retreat, only attack.",
      level: 10,
      spellType: "ACTION",
      icon: "Bludgeoning/Blood Punch",

      typeConfig: {
        school: "bludgeoning",
        icon: "Bludgeoning/Blood Punch",
        tags: ["transformation", "buff", "rage cost", "self-damage"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },

      resourceCost: {
        actionPoints: 4,
        mana: 0,
        resourceTypes: ["mana", "rage_cost"],
        resourceValues: { mana: 0, rage_cost: 80 },
        classResource: { type: "rage", cost: 80 },
        components: ["verbal", "somatic"],
        verbalText: "A booming, monotonous roar of singular, murderous focus.",
        somaticText: "Tense your entire body, locking your arms and shoulders into heavy war-harness posture as grey scar-plates cement over your joints."
      },

      resolution: "NONE",
      effectTypes: ["transformation", "debuff"],

      transformationConfig: {
        transformationType: "physical",
        targetType: "self",
        duration: 3,
        durationUnit: "rounds",
        power: "major",
        newForm: "Battle Incarnate",
        description: "Transform into war itself. Your standard Blood-Heat thresholds are replaced by absolute combat perfection.",
        grantedAbilities: [
          {
            id: "incarnate_strike_bonus",
            name: "Incarnate Fury",
            description: "+10 flat damage on all physical attacks. All attacks have advantage.",
          },
          {
            id: "incarnate_resilience",
            name: "Unyielding Husk",
            description: "+6 flat Armor. Complete immunity to all conditions.",
          },
        ],
      },

      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          {
            id: "no_retreat",
            name: "No Retreat",
            description: "You cannot take defensive actions, disengage, or move away from enemies. You take 2d8 physical damage when the transformation ends.",
            mechanicsText: "No retreat/defensive actions allowed; take 2d8 physical damage when transformation ends",
            statModifier: {
              stat: "health",
              magnitude: "-2d8",
              magnitudeType: "dice",
              formula: "-2d8"
            }
          },
        ],
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds",
      },

      triggerConfig: {
        triggers: [
          {
            id: "incarnate_no_retreat",
            name: "Murder Stance",
            triggerType: "passive",
            action: "You are locked in place and cannot disengage, dodge, block, or retreat."
          },
          {
            id: "incarnate_burnout",
            name: "Transformation Fatigue",
            triggerType: "on_fade",
            action: "Take 2d8 physical self-damage when the form ends."
          }
        ]
      },

      cooldownConfig: {
        cooldownType: "combat",
        cooldownValue: 1,
      },

      tags: ["transformation", "buff", "rage cost", "self-damage", "berserker"],
    },

    {
      id: "berserk_primal_apex",
      name: "Primal Apex",
      description:
        "Unlock the absolute pinnacle of anatomical destruction. You force your metabolic rate to increase by 500%. All nearby enemies tremble. You are a walking god of ruin, but your muscles literally burn off your skeletal frame.",
      level: 10,
      spellType: "ACTION",
      icon: "General/Fiery Rage",

      typeConfig: {
        school: "physical",
        icon: "General/Fiery Rage",
        tags: ["transformation", "buff", "rage cost", "self-damage"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },

      resourceCost: {
        actionPoints: 4,
        mana: 0,
        resourceTypes: ["mana", "rage_cost"],
        resourceValues: { mana: 0, rage_cost: 100 },
        classResource: { type: "rage", cost: 100 },
        components: ["verbal", "somatic"],
        verbalText: "An ear-splitting, primal scream of unmatched predatory dominance.",
        somaticText: "Rupture every capillary in your eyes and face, turning your vision blood-red as you force your body beyond its mechanical limits."
      },

      resolution: "NONE",
      effectTypes: ["transformation", "debuff"],

      transformationConfig: {
        transformationType: "physical",
        targetType: "self",
        duration: 3,
        durationUnit: "rounds",
        power: "major",
        newForm: "Primal Apex",
        description: "Become the absolute predator. You burn away your remaining life to force complete physical domination.",
        grantedAbilities: [
          {
            id: "apex_devastation",
            name: "+15 Damage Bonus",
            description: "All physical attacks deal +15 flat damage. Critical range is expanded to 18-20.",
          },
          {
            id: "apex_stone_flesh",
            name: "Predator Resilience",
            description: "Gain 50% damage resistance to all damage types. Immune to all control conditions.",
          },
        ],
      },

      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          {
            id: "predator_burnout",
            name: "Predator Burnout",
            description: "You take 4d8 unresistable physical exhaustion damage when the transformation ends, and you are Exhausted (disadvantage on all rolls) for 2 rounds.",
            mechanicsText: "Take 4d8 unresistable damage and Exhausted (disadvantage on all rolls) for 2 rounds when form ends",
            statModifier: {
              stat: "health",
              magnitude: "-4d8",
              magnitudeType: "dice",
              formula: "-4d8"
            }
          },
        ],
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds",
      },

      triggerConfig: {
        triggers: [
          {
            id: "predator_apex_burnout",
            name: "Overheat Fallout",
            triggerType: "on_fade",
            action: "Take 4d8 unresistable physical damage and suffer the Exhausted condition for 2 rounds."
          }
        ]
      },

      cooldownConfig: {
        cooldownType: "combat",
        cooldownValue: 1,
      },

      tags: ["transformation", "buff", "rage cost", "self-damage", "berserker"],
    },

      {
        "id": "berserk_roar_unyielding",
        "name": "Roar of the Unyielding",
        "description": "Let loose a chest-rumbling, low-frequency battle growl. The sheer acoustic shockwave snuffs nearby torches, cracks brittle glassware, and asserts your absolute dominance over local beasts.",
        "level": 1,
        "spellType": "ACTION",
        "icon": "Utility/Shout",
        "typeConfig": {
          "school": "physical",
          "icon": "Utility/Shout",
          "tags": [
            "utility",
            "roleplay",
            "berserker"
          ],
          "castTime": 1,
          "castTimeType": "IMMEDIATE"
        },
        "targetingConfig": {
          "targetingType": "area",
          "rangeType": "self_centered",
          "aoeShape": "circle",
          "aoeParameters": {
            "radius": 15
          },
          "targetRestrictions": []
        },
        "resourceCost": {
          "actionPoints": 1,
          "resourceTypes": [],
          "resourceValues": {},
          "components": [
            "verbal"
          ],
          "verbalText": "A deep, guttural, earth-shaking growl of raw battle-fury."
        },
        "resolution": "NONE",
        "effectTypes": [
          "buff"
        ],
        "buffConfig": {
          "buffType": "custom",
          "effects": [
            {
              "id": "roar_unyielding_intimidation",
              "name": "Unyielding Presence",
              "description": "Gain advantage on all Intimidation checks for 10 minutes. Weak wild animals are frightened and flee the area.",
              "mechanicsText": "Advantage on Intimidation checks. Harmless wild beasts flee."
            }
          ],
          "durationValue": 10,
          "durationType": "minutes",
          "durationUnit": "minutes"
        },
        "cooldownConfig": {
          "cooldownType": "turn_based",
          "cooldownValue": 0
        },
        "tags": [
          "utility",
          "roleplay",
          "berserker"
        ]
      },
  ],

  // Spell pools for level-based spell selection
  spellPools: {
    1: ["berserk_hemorrhagic_strike", "berserk_calloused_hide", "berserk_boiling_veins",
      "berserk_roar_unyielding"],
    2: ["berserk_frenzied_slash", "berserk_sanguine_howl"],
    3: ["berserk_ruptured_leap"],
    4: ["berserk_carnage_strike", "berserk_raging_defense"],
    5: ["berserk_cataclysmic_blow"],
    6: ["berserk_obliterating_strike", "berserk_wrath_berserker"],
    7: ["berserk_blood_frenzy"],
    8: ["berserk_immortal_rage", "berserk_earthshaker_slam"],
    9: ["berserk_primal_cataclysm", "berserk_veterans_resolve"],
    10: ["berserk_cataclysmic_fury", "berserk_battle_incarnate", "berserk_primal_apex"],
  },
};
