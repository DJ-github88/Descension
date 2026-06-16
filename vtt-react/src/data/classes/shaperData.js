export const SHAPER_DATA = {
  id: "shaper",
  name: "Shaper",
  icon: "fas fa-yin-yang",
  role: "Hybrid (Damage/Mobility/Adaptation)",
  damageTypes: ["physical", "primal", "storm"],  overview: {
    originStory: "The first shapers were not warriors or alchemists but desperate survivors who refused to accept the body they were born with. In the Frostwood Reach, the wood-warden Sylvanus learned to synchronize his strikes with the wind-swept ironwood branches, flowing through mist like a falling leaf, his twin axes carving a path of kinetic momentum through face-stealing horrors. In the Cragjaw Peaks, the troll-kin Torin drank a draft of raw alchemical sulfur-clay and forced his skeleton to calcify and expand, mimicking basalt pillars to hold up a collapsing mine.\n\nWhen a wandering Mimir chronicler named Veyra encountered both traditions, she realized they were the same art expressed through different bodies. Sylvanus reshaped posture and momentum. Torin reshaped bone and flesh. Both treated the body as a medium \u2014 malleable, negotiable, and ultimately expendable in pursuit of perfection. Veyra merged the kinetic dance with the biological rupture, creating the Shaper: a combatant who treats their own body as the ultimate weapon, shifting between kinetic states and physical forms with the same fluid inevitability.\n\nThe price of this dual mastery is absolute. The Shaper\u2019s joints grind from kinetic friction. Their bones crack from forced mutations. Their nervous system fires at velocities no mortal frame was designed to sustain. Every transformation leaves a scar. Every stance shift erodes their identity. The body is an instrument, and the Shaper plays it until the strings break.\n\nShape the flesh. Sharpen the bone. The dance does not end when the music stops. It ends when there is nothing left to move.",
    title: "The Shaper",
    subtitle: "The Body Is the Weapon",
    illustration: "/assets/images/classes/shaper_illustration.png",
    illustrationCaption: "A Shaper mid-transition, kinetic sparks trailing from reshaping limbs as bone and blade become one.",    quickOverview: {
      title: "Quick Overview",
      content: "**What You Need to Know**: The Shaper merges hyper-accelerated kinetic combat with biological shape-shifting. Navigate 6 Shaping Forms that blend combat posture and physical morphology. Build **Kinetic Flux** through combat actions. **Body Toll** tracks the cumulative cost of every transformation.\n\n**Core Mechanic**: Flow between 6 Shaping Forms (Ataxic Flow, Arterial Strike, Centrifugal Fury, Deadened Bastion, Fluid Apex, Void Predator). Build Flux through form-specific combat actions. Shift forms to match the situation \u2014 but every shift adds Body Toll.\n\n**Resources**: Kinetic Flux (0-20) & Body Toll (0-10).\n\n**Fatal Flaw**: 0 base Armor, +50% wyrd vulnerability. If rooted/grappled, Flux drops to 0 and 1d10 blight/round.\n\n**Best For**: Players who enjoy tactical versatility, rapid form-switching, and dual-resource tension."
    },
    description: "A master of kinetic biology, the Shaper treats their body as a malleable weapon \u2014 reshaping posture, bone density, and musculature in real time. They flow between combat forms that blend the kinetic momentum dance with biological adaptation.",
    roleplayIdentity: {
      title: "Roleplay Identity",
      content: "**HISTORY**: Born from the convergence of the Frostwood Reach kinetic momentum dance and the Frostmaw Holdfast biological body-sculpting. The Mimir chronicler Veyra merged both traditions into the Shaper art.\n\n**CITIES**: Celebrated in the Frostwood Reach, respected but watched in Frostmaw Holdfast. Common folk find their visible transformations disturbing.\n\n**RACES**: Heavily practiced by the Mist-Woven Mimir (semi-crystalline skin withstands friction) and the Morgh Groven (calcified bone structure stabilizes adaptation).\n\n**NOTABLE**: Sylvanus the Wood-Warden, Torin the Troll-Kin, Veyra the Converger."
    },
    signatureQuote: {
      text: "\u201CThe blade does not move me. The beast does not frighten me. I am the blade. I am the beast. And when I am done, there will be nothing left of either.\u201D",
      speaker: "Veyra the Converger",
      context: "Spoken before the Battle of the Shattered Sump"
    },
    philosophy: {
      coreTenet: "The body is not fixed. It is a conversation between intention and bone, between velocity and flesh. A Shaper negotiates with their body \u2014 posture, density, speed, form \u2014 reshaping in real time until the body becomes the weapon the fight demands.",
      relationship: "Power comes from kinetic momentum and biological adaptation \u2014 two expressions of the same truth. Momentum reshapes posture. Biology reshapes flesh. Together, they reshape everything.",
      paradox: "The Shaper achieves perfection by destroying themselves. Every form shift leaves permanent marks \u2014 calcified skin, nocturnal vision, joints moving in wrong directions. The greatest Shapers can become anything and can no longer remember what they started as."
    },
    currentCrisis: "Young Shapers experience **Convergence Collapse** \u2014 kinetic momentum and biological adaptation trigger simultaneously, causing the body to attempt every transformation at once. The Mimir are burning through their semi-crystalline skin in years. A faction of purist Shapers advocates single-tradition practice while convergers push deeper integration. The schism is worsening.",
    meaningfulTradeoffs: "Every transformation leaves a permanent mark. Void Predator users retain shadow-touched vision. Deadened Bastion users develop calcified skin patches. Frequent shifters lose the ability to remember their original face. The dance is killing them, but stopping is death.",
    classSpecificLocations: [
      { name: "The Convergence Sumps", locationId: "frostmaw-holdfast", description: "Deep alchemical chambers where Shapers undergo dual-transformations. Walls carved with both Mimir branch-vibration patterns and Groven transformation runes.", purpose: "Training ground, transformation chamber, recovery ward", status: "Active \u2014 divided between purist and converger factions" }
    ],
    combatRole: {
      title: "Combat Role",
      content: "**Why Bring Me?**: Rewrite combat posture, physical stats, damage resistances, and movement capabilities mid-combat. Bypass armor (Arterial Strike), tank (Deadened Bastion), ambush (Void Predator).\n\n**Fatal Flaw**: 0 base Armor, +50% wyrd permanently. If movement reduced to 0, Flux drops to 0 and 1d10 blight/round."
    },    playstyle: {
      title: "Playstyle & Strategy",
      content: "**Shaping Forms**:\n- Ataxic Flow (Defensive/Agile): +2 dodge, +10ft, advantage Disengage. (2 Flux)\n- Arterial Strike (Offensive/Precision): +2 attack, expanded crit. (2 Flux)\n- Centrifugal Fury (AoE/Multi): Attacks cleave. (3 Flux)\n- Deadened Bastion (Defensive/Counter): Reaction parry, +20 temp HP. (2 Flux)\n- Fluid Apex (Hub): +1 all rolls, any transition. (4 Flux)\n- Void Predator (Stealth/Burst): Advantage first attack, +2d6 stealth. (3 Flux)\n\n**Flux**: +1 hit, +2 crit, +1 dodge, +2 form-specific. -1 miss, hit taken, idle.\n**Body Toll**: +1 per shift. 3+: Joint Lock. 5+: can\u2019t speak. 7+: Feral. 10: GM control. Recovery: -3 Short Rest, reset Long Rest."
    },
    immersiveCombatExample: {
      title: "Combat Example: The Shape of Violence",
      content: "**Turn 1**: Free shift to Void Predator (+1 Toll). Shadow Strike hits, +2 Flux from stealth.\n**Turn 2**: Shift to Arterial Strike (2 Flux, +1 Toll). Kinetic Dissection \u2014 two hits, one crit.\n**Turn 3**: Shift to Deadened Bastion (2 Flux, +1 Toll). +20 temp HP. Toll 3 \u2014 Joint Lock. Arrows bounce.\n**Turn 4**: Shift to Centrifugal Fury (3 Flux, +1 Toll). Sweep catches both archers. The kinetic engine sputters but enemies fall."
    }
  },

  resourceSystem: {
    title: "Kinetic Flux & Body Toll",
    subtitle: "The Body as Engine and Erosion",
    description: "Dual-resource: Kinetic Flux (combat rhythm, 0-20) and Body Toll (transformation cost, 0-10).",
    cards: [
      { title: "Kinetic Flux (Primary)", stats: "0-20", details: "+1 hit, +2 crit, +1 dodge, +2 form-specific. -1 miss, hit taken, idle. Spent on shifts (2-4) and abilities (3-6). Drops to 0 if rooted." },
      { title: "Body Toll (Secondary)", stats: "0-10", details: "+1 per shift. 3+: Joint Lock. 5+: Identity Erosion. 7+: Feral. 10: Unraveling. -3 Short Rest, reset Long Rest." },
      { title: "Structural Fragility", stats: "Permanent", details: "0 Armor. +50% wyrd. Rooted: Flux to 0, 1d10 blight/round." }
    ],
    generationTable: {
      headers: ["Action", "Flux", "Toll"],
      rows: [
        ["Successful Attack", "+1", "0"],
        ["Critical Hit", "+2", "0"],
        ["Dodge/Parry", "+1", "0"],
        ["Form-Specific Action", "+2", "0"],
        ["Miss / Take Damage / Idle", "-1", "0"],
        ["Rooted / Immobilized", "Drops to 0", "0"],
        ["Form Shift (opening)", "FREE", "+1"],
        ["Form Shift (standard)", "-2 to -4", "+1"],
        ["Signature Move", "-Cost", "+1"],
        ["Extended Rest", "Reset", "Reset"]
      ]
    },
    usage: {
      momentum: "Spent on form transitions (2-4) and abilities (3-6).",
      flourish: "Body Toll is the strategic limiter. Each shift pushes toward identity collapse."
    },
    formNetworkTable: {
      title: "Shaping Form Network",
      description: "Shift posture and biology between unified combat forms.",
      headers: ["Form", "Type", "Passive", "Transitions", "Cost"],
      rows: [
        ["Ataxic Flow", "Defensive/Agile", "+2 dodge, +10ft, adv Disengage", "Arterial Strike, Void Predator, Fluid Apex", "2 Flux"],
        ["Arterial Strike", "Offensive/Precision", "+2 attack, expanded crit", "Centrifugal Fury, Deadened Bastion, Ataxic Flow", "2 Flux"],
        ["Centrifugal Fury", "AoE/Multi", "Cleave to adjacent", "Fluid Apex, Deadened Bastion", "3 Flux"],
        ["Deadened Bastion", "Defensive/Counter", "Reaction parry, +20 temp HP", "Arterial Strike, Ataxic Flow", "2 Flux"],
        ["Fluid Apex", "Balanced/Hub", "+1 all rolls, any transition", "ANY form", "4 Flux"],
        ["Void Predator", "Stealth/Burst", "Advantage first attack, +2d6 stealth", "Arterial Strike, Fluid Apex", "3 Flux"]
      ]
    }
  },  equipment: {
    title: "Starting Equipment",
    choices: [
      {
        name: "Twin Shaping Blades Path",
        icon: "Slashing/Cross Slash",
        items: ["Twin Shaping Blades (1d8 slashing each, form-adaptive grips)", "Alchemical Binding Wrap (0 Armor, freedom of movement)", "Mutation Catalysts (3 doses)"],
        description: "Rapid dual-wield strikes to build Flux quickly."
      },
      {
        name: "Heavy Serrated Talon Path",
        icon: "Piercing/Piercing Thrust",
        items: ["Serrated Bone Talon (1d10 slashing/piercing, fuses with hand during shifts)", "Alchemical Binding Wrap (0 Armor)", "Stabilizing Catalysts (2 doses)"],
        description: "Larger single-strike impact and form-amplified natural weapons."
      }
    ],
    standardGear: ["Shaper's Pack (backpack, rations x10, waterskin, wraps, 20 blue Flux trackers, 10 red Toll tokens)", "Currency: 1d10 x 5 copper pieces"],
    notes: "Speed IS armor. 0 base Armor. Cannot wield ranged weapons."
  },

  specializations: {
    title: "Specializations",
    subtitle: "Shaping Paths",
    description: "Choose a specialization to define your primary approach to bodily transformation.",
    passiveAbility: {
      name: "Kinetic Biology",
      description: "All Shapers shift between 6 Shaping Forms, build Kinetic Flux, accumulate Body Toll. Opening shift free (Flux), +1 Body Toll. 0 Armor, +50% wyrd vulnerability."
    },
    specs: [
      {
        id: "spec_flow_master",
        name: "Flow Master",
        icon: "fas fa-wind",
        color: "#8B0000",
        theme: "Chimeric Kinetic Fluidity",
        description: "Masters of fluid form transitions and chimeric fusion.",
        playstyle: "Rapidly shift, merge two forms simultaneously, maintain momentum through seamless transitions.",
        strengths: ["Reduced transition costs", "Can fuse two forms into chimeric hybrids", "High sustained adaptability"],
        weaknesses: ["Accelerated Body Toll from fusion", "Vulnerable if combo interrupted", "Complex resource management"],
        specPassive: { name: "Chimeric Current", description: "All transitions cost 1 less Flux (min 1). Next attack after shift deals +1d6 bonus. Can fuse two adjacent forms for +2 Body Toll, gaining passive effects from both." }
      },
      {
        id: "spec_iron_dancer",
        name: "Iron Dancer",
        icon: "fas fa-shield-halved",
        color: "#27AE60",
        theme: "Precision Striking & Stolen Traits",
        description: "Masters of extreme precision, counter-attacks, and stolen form traits.",
        playstyle: "Expanded crit ranges, devastating ripostes, stolen biological traits.",
        strengths: ["Expanded critical hit range", "Devastating counter-attacks", "Harvest traits from slain enemies"],
        weaknesses: ["Weak against groups", "Relies on being attacked for counters", "Stolen traits cost extra Toll"],
        specPassive: { name: "Steely Harvest", description: "Arterial Strike/Deadened Bastion: +2 attack, reroll 1s on damage. On killing blow, harvest one trait from enemy for rest of combat at +1 Body Toll." }
      },
      {
        id: "spec_primal_shadow",
        name: "Primal Shadow",
        icon: "fas fa-ghost",
        color: "#2C3E50",
        theme: "Stealth Burst & Shadow Forms",
        description: "Masters of stealth burst damage and shadow-infused transformations.",
        playstyle: "Vanish into shadow, shift into predatory forms, devastating ambush attacks.",
        strengths: ["Easy Void Predator access", "High stealth burst damage", "Shadow-infused abilities"],
        weaknesses: ["Dependent on stealth", "Low sustained defense", "Accelerated Toll from shadow mutations"],
        specPassive: { name: "Shadow Affinity", description: "Enter Void Predator from ANY form for 3 Flux. Void Predator: lightly obscured, +1d6 bonus damage. Stealth attacks from Void Predator generate +1 extra Flux and +1 Body Toll." }
      }
    ]
  },  spells: [
    { id: "shaper_structural_fragility", name: "Structural Fragility (Fatal Flaw)", description: "0 base Armor. +50% wyrd damage permanently. If Rooted/Grappled, Flux drops to 0 and take 1d10 blight/round.", level: 1, spellType: "PASSIVE", icon: "Healing/Red Heart", typeConfig: { school: "physical", icon: "Healing/Red Heart", tags: ["passive", "fatal-flaw", "vulnerability"], castTime: 0, castTimeType: "PASSIVE" }, targetingConfig: { targetingType: "self", rangeType: "self" }, resourceCost: { actionPoints: 0, mana: 0, components: ["somatic"] }, resolution: "NONE", effectTypes: ["debuff"], debuffConfig: { debuffType: "statPenalty", effects: [ { id: "structural_fragility_vulnerability", name: "Wyrd Vulnerability", description: "+50% wyrd damage taken permanently." }, { id: "structural_fragility_rooted", name: "Rooted Fragility", description: "If Rooted/Grappled, Kinetic Flux drops to 0 and you take 1d10 blight damage per round." } ] }, cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 }, tags: ["passive", "fatal-flaw", "starter", "shaper"] },
    { id: "shaper_kinetic_dissection", name: "Kinetic Dissection", description: "Vibrate blade at extreme speeds, bypassing all Armor. Chain by spending 1 extra Flux per repeat.", level: 1, spellType: "ACTION", icon: "Slashing/Bloody Slash", typeConfig: { school: "physical", icon: "Slashing/Bloody Slash", tags: ["melee", "damage", "combo", "armor_bypass", "starter"], castTime: 1, castTimeType: "IMMEDIATE" }, targetingConfig: { targetingType: "single", rangeType: "melee", rangeDistance: 5, targetRestrictions: ["enemy"] }, resourceCost: { actionPoints: 1, mana: 0, classResource: { type: "kinetic_flux", cost: 1 }, components: ["somatic"] }, resolution: "DICE", effectTypes: ["damage"], damageConfig: { formula: "1d8 + agility", damageTypes: ["physical"], resolution: "DICE", canCrit: true, critMultiplier: 2, armorPenetration: "100%" }, cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 }, tags: ["melee", "combo", "armor-bypass", "starter", "shaper"] },
    { id: "shaper_frantic_laceration", name: "Frantic Laceration", description: "Hyper-kinetic rapid slash that builds Flux.", level: 1, spellType: "ACTION", icon: "Slashing/Quick Slash", typeConfig: { school: "physical", icon: "Slashing/Quick Slash", tags: ["melee", "damage", "flux_generation", "starter"], castTime: 1, castTimeType: "IMMEDIATE" }, targetingConfig: { targetingType: "single", rangeType: "melee", rangeDistance: 5, targetRestrictions: ["enemy"] }, resourceCost: { actionPoints: 1, mana: 0, classResource: { type: "kinetic_flux", cost: -2 }, components: ["somatic"] }, resolution: "DICE", effectTypes: ["damage"], damageConfig: { formula: "1d6 + agility", damageTypes: ["physical"], resolution: "DICE", canCrit: true, critMultiplier: 2 }, fluxGain: 2, cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 }, tags: ["melee", "damage", "flux_generation", "starter", "shaper"] },
    { id: "shaper_form_shift", name: "Form Shift", description: "Reshape posture and biology into a new Shaping Form. +1 Body Toll.", level: 1, spellType: "ACTION", icon: "Nature/Form Shift", typeConfig: { school: "physical", icon: "Nature/Form Shift", tags: ["utility", "form_shift", "transition", "starter"], castTime: 0, castTimeType: "FREE" }, targetingConfig: { targetingType: "self", rangeType: "self" }, resourceCost: { actionPoints: 0, mana: 0, classResource: { type: "kinetic_flux", cost: 2 }, components: ["somatic"] }, resolution: "NONE", effectTypes: ["utility"], utilityConfig: { utilityType: "stance_change", selectedEffects: [ { id: "form_shift", name: "Shaping Form Shift", description: "Reshape posture and biology into a new Shaping Form. +1 Body Toll." } ], duration: 0, durationUnit: "instant", concentration: false, power: "major" }, bodyTollCost: 1, cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 }, tags: ["utility", "form_shift", "transition", "starter", "shaper"] },
    { id: "shaper_ataxic_sway", name: "Ataxic Sway", description: "Unpredictable dodge converting defense into kinetic fuel. Requires Ataxic Flow.", level: 2, spellType: "ACTION", icon: "Utility/Deflecting Shield", typeConfig: { school: "physical", icon: "Utility/Deflecting Shield", tags: ["defense", "dodge", "flux_generation", "form_ataxic_flow"], castTime: 1, castTimeType: "IMMEDIATE" }, targetingConfig: { targetingType: "self", rangeType: "self" }, resourceCost: { actionPoints: 1, mana: 0, classResource: { type: "kinetic_flux", cost: 3 }, components: ["somatic"] }, resolution: "NONE", effectTypes: ["buff"], buffConfig: { buffType: "movementBuff", effects: [ { id: "ataxic_dodge", name: "Ataxic Dodge", description: "Unpredictable dodge converting defense into kinetic fuel." } ], durationType: "rounds", durationValue: 1, durationUnit: "rounds", concentrationRequired: false, canBeDispelled: true }, formRequirement: "ataxic_flow", cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 }, tags: ["defense", "dodge", "form_ataxic_flow", "shaper"] },
    { id: "shaper_arterial_puncture", name: "Arterial Puncture", description: "Bone-hardened talon lunge. Requires Arterial Strike.", level: 2, spellType: "ACTION", icon: "Piercing/Piercing Thrust", typeConfig: { school: "physical", icon: "Piercing/Piercing Thrust", tags: ["melee", "damage", "precision", "bleed", "form_arterial_strike"], castTime: 1, castTimeType: "IMMEDIATE" }, targetingConfig: { targetingType: "single", rangeType: "melee", rangeDistance: 5, targetRestrictions: ["enemy"] }, resourceCost: { actionPoints: 1, mana: 0, classResource: { type: "kinetic_flux", cost: 4 }, components: ["somatic", "verbal"] }, resolution: "DICE", effectTypes: ["damage", "debuff"], damageConfig: { formula: "1d8 + agility + 1d8", damageTypes: ["physical"], resolution: "DICE", canCrit: true, critMultiplier: 2 }, debuffConfig: { debuffType: "damageOverTime", effects: [ { id: "arterial_bleed", name: "Arterial Bleed", description: "Bone-hardened talon lunge causes deep arterial bleeding." } ], durationType: "rounds", durationValue: 2, durationUnit: "rounds", canBeDispelled: true }, formRequirement: "arterial_strike", cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 }, tags: ["melee", "damage", "bleed", "form_arterial_strike", "shaper"] },
    { id: "shaper_alchemic_purge", name: "Alchemic Purge", description: "Force biology to reject immobilizing effects. +1 Body Toll.", level: 2, spellType: "ACTION", icon: "Nature/Nature Natural", typeConfig: { school: "primal", icon: "Nature/Nature Natural", tags: ["cleanse", "self_damage", "mutation"], castTime: 1, castTimeType: "IMMEDIATE" }, targetingConfig: { targetingType: "self", rangeType: "self" }, resourceCost: { actionPoints: 1, mana: 0, classResource: { type: "kinetic_flux", cost: 3 }, components: ["somatic", "verbal"] }, resolution: "NONE", effectTypes: ["utility"], utilityConfig: { utilityType: "cleanse", selectedEffects: [ { id: "alchemic_cleanse", name: "Alchemic Cleanse", description: "Force biology to reject immobilizing effects." } ], duration: 0, durationUnit: "instant", concentration: false, power: "minor" }, bodyTollCost: 1, cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 }, tags: ["utility", "cleanse", "shaper"] },
    { id: "shaper_centrifugal_sweep", name: "Centrifugal Sweep", description: "Spin with bone-hardened limbs. Requires Centrifugal Fury.", level: 3, spellType: "ACTION", icon: "Slashing/Cleave", typeConfig: { school: "physical", icon: "Slashing/Cleave", tags: ["melee", "damage", "aoe", "form_centrifugal_fury"], castTime: 1, castTimeType: "IMMEDIATE" }, targetingConfig: { targetingType: "area", rangeType: "self_centered", areaShape: "circle", areaSize: 10, targetRestrictions: ["enemy"] }, resourceCost: { actionPoints: 1, mana: 0, classResource: { type: "kinetic_flux", cost: 4 }, components: ["somatic"] }, resolution: "DICE", effectTypes: ["damage"], damageConfig: { formula: "1d8 + agility", damageTypes: ["physical"], resolution: "DICE", canCrit: true, critMultiplier: 2 }, formRequirement: "centrifugal_fury", fluxGain: 1, cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 }, tags: ["aoe", "damage", "form_centrifugal_fury", "shaper"] },
    { id: "shaper_bastion_riposte", name: "Bastion Riposte", description: "Absorb blow with calcified hide, counter. Requires Deadened Bastion.", level: 3, spellType: "REACTION", icon: "Utility/Parry", typeConfig: { school: "physical", icon: "Utility/Parry", tags: ["reaction", "parry", "counter", "form_deadened_bastion"], castTime: 0, castTimeType: "REACTION" }, targetingConfig: { targetingType: "single", rangeType: "melee", rangeDistance: 5, targetRestrictions: ["enemy"] }, resourceCost: { actionPoints: 0, mana: 0, classResource: { type: "kinetic_flux", cost: 3 }, components: ["somatic"] }, resolution: "DICE", effectTypes: ["damage"], damageConfig: { formula: "2d6 + agility", damageTypes: ["physical"], resolution: "DICE", canCrit: true, critMultiplier: 2 }, formRequirement: "deadened_bastion", cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 }, tags: ["reaction", "parry", "form_deadened_bastion", "shaper"] },
    { id: "shaper_kinetic_dash", name: "Kinetic Dash", description: "Mutation-powered leap 30ft.", level: 3, spellType: "ACTION", icon: "Utility/Speed Boot", typeConfig: { school: "physical", icon: "Utility/Speed Boot", tags: ["mobility", "reposition", "mutation"], castTime: 1, castTimeType: "IMMEDIATE" }, targetingConfig: { targetingType: "self", rangeType: "self" }, resourceCost: { actionPoints: 1, mana: 0, classResource: { type: "kinetic_flux", cost: 2 }, components: ["somatic"] }, resolution: "NONE", effectTypes: ["utility"], utilityConfig: { utilityType: "movement", selectedEffects: [ { id: "kinetic_leap", name: "Kinetic Leap", description: "Mutation-powered leap 30 feet." } ], duration: 0, durationUnit: "instant", concentration: false, power: "minor" }, fluxGain: 3, cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 }, tags: ["mobility", "reposition", "shaper"] },    { id: "shaper_alchemic_overdrive", name: "Alchemic Overdrive", description: "Venom-laced bone-hardened auto-crit. Signature: +1 Body Toll. Requires Arterial Strike.", level: 4, spellType: "ACTION", icon: "Poison/Envenom Dagger", typeConfig: { school: "physical", icon: "Poison/Envenom Dagger", tags: ["melee", "damage", "blight", "signature", "form_arterial_strike"], castTime: 1, castTimeType: "IMMEDIATE" }, targetingConfig: { targetingType: "single", rangeType: "melee", rangeDistance: 5, targetRestrictions: ["enemy"] }, resourceCost: { actionPoints: 1, mana: 0, classResource: { type: "kinetic_flux", cost: 6 }, components: ["somatic", "verbal"] }, resolution: "DICE", effectTypes: ["damage", "debuff"], damageConfig: { formula: "2d8 + agility", damageTypes: ["physical"], canCrit: true, critMultiplier: 2, isGuaranteedCrit: true, resolution: "DICE" }, debuffConfig: { debuffType: "damageOverTime", effects: [ { id: "venom_overdrive", name: "Venom Overdrive", description: "Venom-laced bone-hardened strike inflicts venom on the target." } ], durationType: "rounds", durationValue: 3, durationUnit: "rounds", canBeDispelled: true }, isSignatureMove: true, bodyTollGenerated: 1, formRequirement: "arterial_strike", cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 }, tags: ["signature", "form_arterial_strike", "shaper"] },
    { id: "shaper_void_collapse", name: "Void Collapse", description: "Shadow-blur speed, invisible 1 round. Signature: +1 Body Toll. Requires Void Predator.", level: 4, spellType: "ACTION", icon: "Utility/Hide", typeConfig: { school: "physical", icon: "Utility/Hide", tags: ["invisibility", "burst", "signature", "form_void_predator"], castTime: 1, castTimeType: "IMMEDIATE" }, targetingConfig: { targetingType: "self", rangeType: "self" }, resourceCost: { actionPoints: 1, mana: 0, classResource: { type: "kinetic_flux", cost: 6 }, components: ["somatic"] }, resolution: "NONE", effectTypes: ["buff"], buffConfig: { buffType: "statusEffectBuff", effects: [ { id: "void_invisibility", name: "Void Invisibility", description: "Shadow-blur speed renders you invisible for 1 round." } ], durationType: "rounds", durationValue: 1, durationUnit: "rounds", concentrationRequired: false, canBeDispelled: true }, isSignatureMove: true, bodyTollGenerated: 1, formRequirement: "void_predator", cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 }, tags: ["signature", "form_void_predator", "shaper"] },
    { id: "shaper_thousand_forms", name: "Thousand Forms", description: "Unleash all Flux in devastating cyclone, shifting through every form. +1 Body Toll.", level: 5, spellType: "ACTION", icon: "Slashing/Whirl", typeConfig: { school: "physical", secondaryElement: "storm", icon: "Slashing/Whirl", tags: ["aoe", "damage", "ultimate", "strain"], castTime: 2, castTimeType: "IMMEDIATE" }, targetingConfig: { targetingType: "area", rangeType: "self_centered", areaShape: "circle", areaSize: 15, targetRestrictions: ["enemy"] }, resourceCost: { actionPoints: 2, mana: 0, classResource: { type: "kinetic_flux", cost: "ALL" }, components: ["somatic", "verbal"] }, resolution: "DICE", effectTypes: ["damage"], damageConfig: { formula: "3d8 + (Flux Expended * 1d4)", damageTypes: ["physical", "storm"], resolution: "DICE", armorPenetration: "50%" }, bodyTollCost: 1, cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 }, tags: ["aoe", "ultimate", "strain", "shaper"] },
    { id: "shaper_sensory_numbing", name: "Sensory Numbing", description: "Suppress pain entirely. Ignore non-lethal conditions for 3 rounds. +1 Body Toll.", level: 6, spellType: "ACTION", icon: "Poison/Poison Contagion", typeConfig: { school: "blight", icon: "Poison/Poison Contagion", tags: ["buff", "mutation", "combo"], castTime: 1, castTimeType: "IMMEDIATE" }, targetingConfig: { targetingType: "self", rangeType: "self" }, resourceCost: { actionPoints: 1, mana: 0, classResource: { type: "kinetic_flux", cost: 5 }, components: ["somatic", "verbal"] }, resolution: "NONE", effectTypes: ["buff"], buffConfig: { buffType: "damageMitigation", effects: [ { id: "pain_suppression", name: "Pain Suppression", description: "Suppress pain entirely and ignore non-lethal conditions for 3 rounds." } ], durationType: "rounds", durationValue: 3, durationUnit: "rounds", concentrationRequired: false, canBeDispelled: true }, bodyTollCost: 1, cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 }, tags: ["buff", "mutation", "shaper"] },
    { id: "shaper_terminal_velocity", name: "Terminal Velocity", description: "Pinnacle \u2014 body rips through every form, 50ft radius, bypasses all Armor. +3 Body Toll.", level: 10, spellType: "ACTION", icon: "Force/Explosion Burst", typeConfig: { school: "physical", secondaryElement: "storm", icon: "Force/Explosion Burst", tags: ["ultimate", "aoe", "armor_bypass", "strain"], castTime: 2, castTimeType: "IMMEDIATE" }, targetingConfig: { targetingType: "area", rangeType: "self_centered", areaShape: "circle", areaSize: 50, targetRestrictions: ["enemy"] }, resourceCost: { actionPoints: 3, mana: 0, classResource: { type: "kinetic_flux", cost: 10 }, components: ["somatic", "verbal"] }, resolution: "DICE", effectTypes: ["damage", "debuff"], damageConfig: { formula: "10d10 + (agility * 3)", damageTypes: ["physical", "storm"], resolution: "DICE", armorPenetration: "100%" }, debuffConfig: { debuffType: "statusEffect", effects: [ { id: "terminal_disorientation", name: "Terminal Disorientation", description: "The kinetic shockwave rips through every form, disorienting survivors." } ], durationType: "rounds", durationValue: 2, durationUnit: "rounds", canBeDispelled: true }, bodyTollCost: 3, cooldownConfig: { cooldownType: "turn_based", cooldownValue: 4 }, tags: ["ultimate", "aoe", "shaper"] },
    { id: "shaper_perfect_balance", name: "Perfect Balance", description: "Mutating musculature into fluid tension. Perfect balance on any surface. Advantage on Acrobatics.", level: 1, spellType: "ACTION", icon: "Utility/Acrobatic", typeConfig: { school: "physical", icon: "Utility/Acrobatic", tags: ["utility", "roleplay", "shaper"], castTime: 1, castTimeType: "IMMEDIATE" }, targetingConfig: { targetingType: "self", rangeType: "self" }, resourceCost: { actionPoints: 1, mana: 2, components: ["somatic"] }, resolution: "NONE", effectTypes: ["buff"], buffConfig: { buffType: "combatAdvantage", effects: [ { id: "perfect_balance", name: "Perfect Balance", description: "Perfect balance on any surface. Advantage on Acrobatics checks." } ], durationType: "rounds", durationValue: 1, durationUnit: "rounds", concentrationRequired: false, canBeDispelled: true }, cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 }, tags: ["utility", "roleplay", "shaper"] }
  ],

  spellPools: {
    1: ["shaper_kinetic_dissection", "shaper_frantic_laceration", "shaper_form_shift", "shaper_perfect_balance"],
    2: ["shaper_ataxic_sway", "shaper_arterial_puncture", "shaper_alchemic_purge"],
    3: ["shaper_centrifugal_sweep", "shaper_bastion_riposte", "shaper_kinetic_dash"],
    4: ["shaper_alchemic_overdrive", "shaper_void_collapse"],
    5: ["shaper_thousand_forms"],
    6: ["shaper_sensory_numbing"],
    10: ["shaper_terminal_velocity"]
  }
};