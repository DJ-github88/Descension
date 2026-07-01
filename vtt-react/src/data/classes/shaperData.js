export const SHAPER_DATA = {
  restrictions: {
      "allowedSubraces": [
          "maskborne_mimir",
          "mistwoven_mimir",
          "unwoven_mimir",
          "morgh_groven",
          "ithran_groven"
      ],
      "hardBlocks": [
          "human",
          "emberth",
          "neth",
          "myrathil",
          "briaran"
      ],
      "narrativeUnlock": false,
      "justification": "Requires biological form-shifting capability. Hard Block: Humans can't physically reshape (bodies too fixed). Emberth bodies are too mineral-dense. Neth bodies are contract-locked by the First Contract. Myrathil are too fluid (can't hold shape)."
  },

  /**
   * Subrace Variants — the Shaper reshapes their own body, and what the body *is* shapes
   * the shaping. The Mimir castes each reconcile form-shifting with their mask-anchored
   * identity differently. The Groven castes carry the Deep Alchemists' original
   * body-sculpting heritage — the vats that made them, turned inward.
   */
  subraceVariants: {
    maskborne_mimir: {
      subraceName: 'Mask-Borne Mimir',
      title: 'The Form-Locked',
      reframe: `The <LoreLink termId="mimir">Mask-Borne</LoreLink> anchor their identity to a single carved mask, and a Shaper among them must reconcile the shaping forms with an *external identity-anchor* that resists change. The Mask-Borne are the most controlled Shapers: the mask holds the self stable while the body shifts around it, a fixed point around which transformation orbits. The most stable, and the most limited — they cannot reshape the face the mask protects.`,
      signatureAbility: {
        name: 'Anchor-Form',
        description: `Kinetic Flux builds faster when the Shaper's mask remains untouched — the mask is the fixed axis, and every transformation radiates from it. The instant the mask is struck or displaced, all held forms destabilize violently. The Mask-Borne fight to protect the one thing they cannot change.`
      },
      currentCrisisAngle: `Convergence Collapse hits the Mask-Borne as a *mask-crisis*: when young Mask-Borne attempt every form at once, the transformations begin *reaching for the mask*, trying to reshape the one thing that holds the self. Several young Mask-Borne have shattered their own masks mid-convergence, and the resulting identity-collapse is the most frightening thing the elder Shapers have ever witnessed — a Mimir without an anchor, dissolving in real time.`,
      signatureQuote: {
        text: '"My mask is the only shape I cannot change, and the dance keeps trying to take it from me. The day I let it, I will not be anyone to remember the loss."',
        speaker: 'Form-Keeper Mir-Vassen',
        context: 'A Mask-Borne Shaper, splinting his mask-straps before a convergence drill'
      }
    },

    mistwoven_mimir: {
      subraceName: 'Mist-Woven Mimir',
      title: 'The Sentinel-Shifter',
      reframe: `The <LoreLink termId="mimir">Mist-Woven</LoreLink> — the fog-sentinels of the <LoreLink termId="frostwood-reach">Ironwood Palisade</LoreLink> — treat the shaping forms as *vigil-adaptations*: each form is a posture of watching, a body configured for a specific kind of surveillance. A Mist-Woven Shaper does not reshape for combat; they reshape for *perception*, becoming the thing that sees what the fog hides.`,
      signatureAbility: {
        name: 'Vigil-Form',
        description: `Shaping forms optimized for sensory coverage rather than offense — widened eyes, extended auditory structures, distributed nerve-endings. The Mist-Woven are the tradition's scouts, and their Kinetic Flux generates from *detection* (spotting an enemy) as much as from combat impact.`
      },
      currentCrisisAngle: `The mist is learning to hide (the Apex crisis), and the Mist-Woven Shapers feel it most acutely — every vigil-form is returning less, the sensory adaptations hitting a fog that refuses to cooperate. The young Mist-Woven, in frustration, are pushing their vigil-forms past design limits, burning through crystalline skin to see a fog that has decided to be blind.`,
      signatureQuote: {
        text: '"I reshaped my eyes to pierce the mist. The mist reshaped itself to defy my eyes. We are arguing, and I am losing, and I do not know what it is protecting."',
        speaker: 'Sentinel Mir-Felss',
        context: 'A Mist-Woven Shaper, the third night her vigil-form returned nothing'
      }
    },

    unwoven_mimir: {
      subraceName: 'Unwoven Mimir',
      title: 'The Dissolving',
      reframe: `The <LoreLink termId="mimir">Unwoven</LoreLink> are already dissolving — maskless, their forms blurring into the fog. For the Unwoven, the Shaper art is both curse and *temporary salvation*: each held form briefly *coheres* a self that is otherwise fading. An Unwoven Shaper reshapes not to fight but to *remember what having an edge feels like*, and every transformation buys a few more hours of definition before the dissolution resumes.`,
      signatureAbility: {
        name: 'Coherence-Form',
        description: `Shaping forms temporarily *reverse* the Unwoven's dissolution, granting hours of crisp identity per transformation. The cost: every reversion to baseline loses a little more of the baseline itself. The Unwoven are buying time with the time they have left, and the exchange rate is worsening.`
      },
      currentCrisisAngle: `Convergence Collapse is, for the Unwoven, the most *tempting* crisis: attempting every form at once briefly produces a *super-coherent* state more defined than any single form. Young Unwoven are chasing convergence highs, burning through crystalline skin (which the Mimir cannot regenerate) for hours of feeling like a complete person. The Unwoven Shapers are, measurably, the happiest Shapers — and the fastest-dying.`,
      signatureQuote: {
        text: '"You fear the dance will dissolve you. I am already dissolving. The dance is the only thing that gives me edges. I will dance until there is nothing left to dance, and it will have been worth it."',
        speaker: 'Unwoven Mir-Naeth',
        context: 'An Unwoven Shaper, mid-convergence, more coherent than she has been in years'
      }
    },

    morgh_groven: {
      subraceName: 'Morgh Groven',
      title: 'The Vat-Sculpted',
      reframe: `The <LoreLink termId="groven">Morgh Groven</LoreLink> were *made* by body-sculpting — the Deep Alchemists' vats reshaped their <LoreLink termId="thrumm">Thrumm</LoreLink> root-stock into the heavy-scaled Morgh form. A Morgh Shaper does not learn body-sculpting; they *inherit* it, the alchemical heritage in their blood re-awakened. Their shaping is the tradition's most visceral irony: the race that was sculpted against its will, now sculpting *itself*.`,
      signatureAbility: {
        name: 'Vat-Recursion',
        description: `Shaping forms draw on the Morgh's dormant alchemical substrate — the same serums the Deep Alchemists used to create them. The Morgh can sculpt with a precision and violence no Mimir can match, hardening stone-scale into weapon-plate or softening it for flexibility. The regenerative Thrumm biology makes them the most durable Shapers.`
      },
      currentCrisisAngle: `Convergence Collapse among the Morgh risks *re-awakening the vat-protocols entirely* — a fully converged Morgh Shaper begins to resemble the Deep Alchemists' *original design intent*, a perfect servitor, before the will reasserts. The Vat-Breakers' Guild considers this the ultimate desecration: a Groven voluntarily returning to the vat-state. Worse, the Deep Alchemists have heard, and they are *very interested* in a Groven who can re-enter the vat without being put there.`,
      signatureQuote: {
        text: '"My makers sculpted me to kneel. I sculpt myself to stand. The danger is that the clay remembers the first shape, and so do I. Every form I take, the old one whispers."',
        speaker: 'Morgh Veyr Anvil-Sculpted',
        context: 'A Morgh Shaper, the morning after a convergence that left him briefly obedient'
      }
    },

    ithran_groven: {
      subraceName: 'Ithran Groven',
      title: 'The Span-Dancer',
      reframe: `The long-limbed <LoreLink termId="groven">Ithran Groven</LoreLink> — the bridge-builders, the diplomats — contribute the *kinetic* half of the Shaper art. An Ithran Shaper runs the Ancestor-Spans as a dance, building Kinetic Flux from the momentum of bridge-running, then channels that momentum into extended-limb transformations. Where the Morgh sculpt for durability, the Ithran sculpt for *reach and speed*.`,
      signatureAbility: {
        name: 'Span-Momentum',
        description: `Kinetic Flux generates dramatically faster from movement across the Shaper's own architecture — running a familiar bridge, swinging between spans. The Ithran are the tradition's momentum-specialists, and their forms emphasize reach, leverage, and the bone-knowledge of load-distribution that makes their bridges hold.`
      },
      currentCrisisAngle: `The Ancestor-Spans are cracking (the Warden/Gambit crisis), and the Ithran Span-Dancers are losing their *kinetic substrate* — the bridges that generate their Flux are failing. Young Ithran are running the cracking spans anyway, chasing momentum from structures that may collapse beneath them. The convergence of failing bridges and convergence-collapse is producing a generation of Ithran Shapers who dance on the edge of two collapses at once.`,
      signatureQuote: {
        text: '"My grandmother\'s span made me fast. Her span is failing. I run it anyway — the falling is faster than the standing, and the Flux does not care which one feeds it."',
        speaker: 'Ith-Sparra Span-Dancer',
        context: 'An Ithran Shaper, choosing which cracking span to run before a battle'
      }
    }
  },


  id: "shaper",
  name: "Shaper",
  icon: "fas fa-yin-yang",
  role: "Hybrid (Damage/Mobility/Adaptation)",
  damageTypes: ["physical", "primal", "storm"],

  livingOrder: {
    orderName: 'The Form-Convergence',
    founder: {
      name: '<LoreLink termId="veyra">Veyra</LoreLink>',
      status: `Alive. The <LoreLink termId="mimir">Mimir</LoreLink> chronicler who merged Sylvanus's kinetic momentum dance (Frostwood) with Torin's biological adaptation art (<LoreLink termId="frostmaw_holdfast">Frostmaw Holdfast</LoreLink>) still leads the Convergence, her semi-crystalline skin more calcified each year. She is the only Shaper who has held the merged art without burning out — because she invented it slowly, over centuries.`,
      note: `<LoreLink termId="veyra">Veyra</LoreLink> did not invent the Shaping Forms; she invented the *convergence*. The kinetic and biological traditions existed separately for centuries. She proved they were one dance seen from two angles.`
    },
    currentLeader: {
      name: '<LoreLink termId="veyra">Form-Matriarch Veyra the Merged</LoreLink>',
      title: 'Keeper of the Six Forms',
      characterization: `Ancient, patient, and more stone than flesh — <LoreLink termId="veyra">Veyra</LoreLink>'s body is a living record of every transformation she has ever held. She leads the Convergence from Frostmaw and teaches the six Forms in sequence, insisting no student attempt convergence until they have mastered each form alone. The young convergers consider this archaic. She considers their burnout rate the proof she is right.`
    },
    headquarters: { name: 'The Shaping Hall, Frostmaw Holdfast', locationId: 'frostmaw_holdfast' },
    crisisConnection: `<LoreLink termId="veyra">Veyra</LoreLink> is losing the argument. The purist-vs-converger schism is worsening, and Convergence Collapse is killing the young Mimir Shapers — burning through crystalline skin in years rather than centuries. <LoreLink termId="veyra">Veyra</LoreLink>'s slow method works, but the era does not allow for slow: the Frostwood mist is learning to hide, the Ancestor-Spans are cracking, and the world demands Shapers who can converge *now*. <LoreLink termId="veyra">Veyra</LoreLink> is being forced to teach the dangerous convergence she spent centuries proving was premature, because the alternative is a tradition of pure-form specialists who cannot meet the moment.`
  },

  worldFriction: [
    { region: 'human-settlements', status: 'distrusted', consequence: 'Form-shifting reads to most humans as Wyrd-adjacent — the Gref steals faces, and a being that reshapes its own face triggers the same reflex. A Shaper in a Thalren or Solvarn town is watched closely and barred from archive or temple interiors until they hold a single form for inspection.', workaround: 'Hold a single stable form in public; the Shaping is the art, but stillness is the camouflage. A Shaper who never transforms in view is treated as merely an unusual Mimir or Groven.' },
    { region: 'cragjaw-peaks', location: 'frostmaw_holdfast', status: 'celebrated', consequence: 'At Frostmaw, the Shaping Hall is a respected institution and Shapers are honored as the inheritors of the Vat-Breakers\' biological heritage. Groven and Mimir Shapers receive lodging, training-access, and the protection of the Form-Convergence.' }
  ],

  overview: {
    title: "The Shaper",
    subtitle: "The Body Is the Weapon",
    illustration: "/assets/images/classes/shaper_illustration.png",
    illustrationCaption: "A Shaper mid-transition, kinetic sparks trailing from reshaping limbs as bone and blade become one.",

    originStory: `The first shapers were not warriors or alchemists but desperate survivors who refused to accept the body they were born with. In the <LoreLink termId="frostwood-reach">Frostwood Reach</LoreLink>, the wood-warden Sylvanus learned to synchronize his strikes with the wind-swept ironwood branches, flowing through mist like a falling leaf, his twin axes carving a path of kinetic momentum through face-stealing horrors. In the <LoreLink termId="cragjaw-peaks">Cragjaw Peaks</LoreLink>, the troll-kin Torin drank a draft of raw alchemical sulfur-clay and forced his skeleton to calcify and expand, mimicking basalt pillars to hold up a collapsing mine.

When a wandering <LoreLink termId="mimir">Mimir</LoreLink> chronicler named Veyra encountered both traditions, she realized they were the same art expressed through different bodies. Sylvanus reshaped posture and momentum. Torin reshaped bone and flesh. Both treated the body as a medium—malleable, negotiable, and ultimately expendable in pursuit of perfection. Veyra merged the kinetic dance with the biological rupture, creating the Shaper: a combatant who treats their own body as the ultimate weapon, shifting between kinetic states and physical forms with the same fluid inevitability.

The price of this dual mastery is absolute. The Shaper’s joints grind from kinetic friction. Their bones crack from forced mutations. Their nervous system fires at velocities no mortal frame was designed to sustain. Every transformation leaves a scar. Every stance shift erodes their identity. The body is an instrument, and the Shaper plays it until the strings break.

Shape the flesh. Sharpen the bone. The dance does not end when the music stops. It ends when there is nothing left to move.`,

    quickOverview: {
      title: "Quick Overview",
      content: `**What You Need to Know**: The Shaper merges hyper-accelerated kinetic combat with biological shape-shifting. Navigate 6 Shaping Forms that blend combat posture and physical morphology. Build **Kinetic Flux** through combat actions. **Body Toll** tracks the cumulative cost of every transformation.

**Core Mechanic**: Flow between 6 Shaping Forms (Ataxic Flow, Arterial Strike, Centrifugal Fury, Deadened Bastion, Fluid Apex, Void Predator). Build Flux through form-specific combat actions. Shift forms to match the situation—but every shift adds Body Toll.

**Resources**: Kinetic Flux (0-20) & Body Toll (0-10).

**Fatal Flaw**: 0 base Armor, +50% wyrd vulnerability. If rooted/grappled, Flux drops to 0 and 1d10 blight/round.

**Best For**: Players who enjoy tactical versatility, rapid form-switching, and dual-resource tension.`
    },

    description: `A master of kinetic biology, the Shaper treats their body as a malleable weapon—reshaping posture, bone density, and musculature in real time. They flow between combat forms that blend the kinetic momentum dance with biological adaptation.`,

    roleplayIdentity: {
      title: "Roleplay Identity",
      content: `**HISTORY: THE CONVERGENCE**
Born from the convergence of the <LoreLink termId="frostwood-reach">Frostwood Reach</LoreLink> kinetic momentum dance and the <LoreLink termId="frostmaw_holdfast">Frostmaw Holdfast</LoreLink> biological body-sculpting. The Mimir chronicler Veyra merged both traditions into the Shaper art.

**CITIES & CIVIL RECEPTION**
Celebrated in the <LoreLink termId="frostwood-reach">Frostwood Reach</LoreLink>, respected but watched in <LoreLink termId="frostmaw_holdfast">Frostmaw Holdfast</LoreLink>. Common folk find their visible transformations disturbing.

**RACES & CULTURAL AFFILIATION**
Heavily practiced by the Mist-Woven <LoreLink termId="mimir">Mimir</LoreLink> (semi-crystalline skin withstands friction) and the Morgh <LoreLink termId="groven">Groven</LoreLink> (calcified bone structure stabilizes adaptation).

**NOTABLE FIGURES**
* **Sylvanus the Wood-Warden**: The pioneer of kinetic momentum shifting.
* **Torin the Troll-Kin**: The pioneer of biological calcification and expansion.
* **Veyra the Converger**: The Mimir scholar who synthesized both into a singular art.`
    },

    signatureQuote: {
      text: `“The blade does not move me. The beast does not frighten me. I am the blade. I am the beast. And when I am done, there will be nothing left of either.”`,
      speaker: "Veyra the Converger",
      context: "Spoken before the Battle of the Shattered Sump"
    },

    philosophy: {
      coreTenet: `The body is not fixed. It is a conversation between intention and bone, between velocity and flesh. A Shaper negotiates with their body—posture, density, speed, form—reshaping in real time until the body becomes the weapon the fight demands.`,
      relationship: `Power comes from kinetic momentum and biological adaptation—two expressions of the same truth. Momentum reshapes posture. Biology reshapes flesh. Together, they reshape everything.`,
      paradox: `The Shaper achieves perfection by destroying themselves. Every form shift leaves permanent marks—calcified skin, nocturnal vision, joints moving in wrong directions. The greatest Shapers can become anything and can no longer remember what they started as.`
    },

    currentCrisis: `Young Shapers experience **Convergence Collapse**—kinetic momentum and biological adaptation trigger simultaneously, causing the body to attempt every transformation at once. The Mimir are burning through their semi-crystalline skin in years. A faction of purist Shapers advocates single-tradition practice while convergers push deeper integration. The schism is worsening.`,

    meaningfulTradeoffs: `Every transformation leaves a permanent mark. Void Predator users retain shadow-touched vision. Deadened Bastion users develop calcified skin patches. Frequent shifters lose the ability to remember their original face. The dance is killing them, but stopping is death.`,

    classSpecificLocations: [
      {
        name: "The Convergence Sumps",
        locationId: "frostmaw-holdfast",
        description: "Deep alchemical chambers where Shapers undergo dual-transformations. Walls carved with both Mimir branch-vibration patterns and Groven transformation runes.",
        purpose: "Training ground, transformation chamber, recovery ward",
        status: "Active — divided between purist and converger factions"
      }
    ],

    combatRole: {
      title: "Combat Role",
      content: `**Why Bring Me?**: Rewrite combat posture, physical stats, damage resistances, and movement capabilities mid-combat. Bypass armor (Arterial Strike), tank (Deadened Bastion), ambush (Void Predator).

**Fatal Flaw**: 0 base Armor, +50% wyrd permanently. If movement reduced to 0, Flux drops to 0 and 1d10 blight/round.`
    },

    playstyle: {
      title: "Playstyle & Strategy",
      content: `**Shaping Forms**:
- Ataxic Flow (Defensive/Agile): +2 dodge, +10ft, advantage Disengage. (2 Flux)
- Arterial Strike (Offensive/Precision): +2 attack, expanded crit. (2 Flux)
- Centrifugal Fury (AoE/Multi): Attacks cleave. (3 Flux)
- Deadened Bastion (Defensive/Counter): Reaction parry, +20 temp HP. (2 Flux)
- Fluid Apex (Hub): +1 all rolls, any transition. (4 Flux)
- Void Predator (Stealth/Burst): Advantage first attack, +2d6 stealth. (3 Flux)

**Flux**: +1 hit, +2 crit, +1 dodge, +2 form-specific. -1 miss, hit taken, idle.
**Body Toll**: +1 per shift. 3+: Joint Lock. 5+: can’t speak. 7+: Feral. 10: GM control. Recovery: -3 Short Rest, reset Long Rest.`
    },

    immersiveCombatExample: {
      title: "Combat Example: The Shape of Violence",
      content: `**Turn 1**: Free shift to Void Predator (+1 Toll). Shadow Strike hits, +2 Flux from stealth.
**Turn 2**: Shift to Arterial Strike (2 Flux, +1 Toll). Kinetic Dissection—two hits, one crit.
**Turn 3**: Shift to Deadened Bastion (2 Flux, +1 Toll). +20 temp HP. Toll 3—Joint Lock. Arrows bounce.
**Turn 4**: Shift to Centrifugal Fury (3 Flux, +1 Toll). Sweep catches both archers. The kinetic engine sputters but enemies fall.`
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
    { id: "shaper_perfect_balance", name: "Perfect Balance", description: "Mutating musculature into fluid tension. Perfect balance on any surface. Advantage on Acrobatics.", level: 1, spellType: "ACTION", icon: "Utility/Acrobatic", typeConfig: { school: "physical", icon: "Utility/Acrobatic", tags: ["utility", "roleplay", "shaper"], castTime: 1, castTimeType: "IMMEDIATE" }, targetingConfig: { targetingType: "self", rangeType: "self" }, resourceCost: { actionPoints: 1, mana: 2, components: ["somatic"] }, resolution: "NONE", effectTypes: ["buff"], buffConfig: { buffType: "combatAdvantage", effects: [ { id: "perfect_balance", name: "Perfect Balance", description: "Perfect balance on any surface. Advantage on Acrobatics checks." } ], durationType: "rounds", durationValue: 1, durationUnit: "rounds", concentrationRequired: false, canBeDispelled: true }, cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 }, tags: ["utility", "roleplay", "shaper"] },
    { id : "shaper_kinetic_deflection",
      name: "Kinetic Deflection",
      description: "Deflect a ranged projectile, converting its energy into a retaliatory storm shock. Requires Ataxic Flow.",
      level: 4,
      spellType: "REACTION",
      icon: "Utility/Deflecting Shield",
      effectTypes: ["damage"],
      typeConfig: { school: "storm", icon: "Utility/Deflecting Shield", tags: ["reaction","deflect","form_ataxic_flow"], castTime: 0, castTimeType: "REACTION" },
      targetingConfig: { targetingType: "single", rangeType: "ranged", rangeDistance: 30, targetRestrictions: ["enemy"] },
      resourceCost: { actionPoints: 0, mana: 0, classResource: { type: "kinetic_flux", cost: 3 }, components: ["somatic"] },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },
      damageConfig: { formula: "2d6 + agility", damageTypes: ["storm"], resolution: "DICE" },
      formRequirement: "ataxic_flow",
      resolution: "DICE",
      tags: ["reaction","deflect","form_ataxic_flow","shaper"]
    },
    { id : "shaper_arterial_siphon",
      name: "Arterial Siphon",
      description: "Lunge forward, siphoning the target's life force to reduce your Body Toll by 1. Requires Arterial Strike.",
      level: 4,
      spellType: "ACTION",
      icon: "Poison/Envenom Dagger",
      effectTypes: ["damage","utility"],
      typeConfig: { school: "physical", icon: "Poison/Envenom Dagger", tags: ["melee","damage","healing","form_arterial_strike"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "single", rangeType: "melee", rangeDistance: 5, targetRestrictions: ["enemy"] },
      resourceCost: { actionPoints: 1, mana: 0, classResource: { type: "kinetic_flux", cost: 4 }, components: ["somatic"] },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
      damageConfig: { formula: "2d8 + agility", damageTypes: ["physical"], resolution: "DICE" },
      formRequirement: "arterial_strike",
      resolution: "DICE",
      tags: ["melee","damage","healing","form_arterial_strike","shaper"]
    },
    { id : "shaper_centrifugal_launch",
      name: "Centrifugal Launch",
      description: "Grab a target using your momentum and launch them into another foe. Requires Centrifugal Fury.",
      level: 5,
      spellType: "ACTION",
      icon: "Slashing/Whirl",
      effectTypes: ["damage","control"],
      typeConfig: { school: "physical", icon: "Slashing/Whirl", tags: ["melee","damage","control","form_centrifugal_fury"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "single", rangeType: "melee", rangeDistance: 5, targetRestrictions: ["enemy"] },
      resourceCost: { actionPoints: 1, mana: 0, classResource: { type: "kinetic_flux", cost: 5 }, components: ["somatic"] },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },
      damageConfig: { formula: "3d6 + strength", damageTypes: ["physical"], resolution: "DICE" },
      controlConfig: { controlType: "forcedMovement", effects: [{ id : "shaper_launch_push", name: "Launched", description: "Target is thrown up to 20 feet away.", config: {"distance":20,"movementType":"throw"} }] },
      formRequirement: "centrifugal_fury",
      resolution: "DICE",
      tags: ["melee","damage","control","form_centrifugal_fury","shaper"]
    },
    { id : "shaper_bastion_fortress",
      name: "Bastion Fortress",
      description: "Expand your bone structure to form an impenetrable barrier, granting +4 DR to adjacent allies. Requires Deadened Bastion.",
      level: 5,
      spellType: "ACTION",
      icon: "Utility/Deflecting Shield",
      effectTypes: ["buff"],
      typeConfig: { school: "physical", icon: "Utility/Deflecting Shield", tags: ["buff","defense","form_deadened_bastion"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "area", rangeType: "self_centered", areaShape: "circle", areaSize: 10, targetRestrictions: ["allies"] },
      resourceCost: { actionPoints: 1, mana: 0, classResource: { type: "kinetic_flux", cost: 5 }, components: ["somatic"] },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },
      buffConfig: { buffType: "statEnhancement", effects: [{ id : "shaper_bastion_fortress_dr", name: "Bone Ward", description: "Gain +4 DR.", mechanicsText: "+4 DR." }], durationType: "rounds", durationValue: 2, durationUnit: "rounds", canBeDispelled: false },
      formRequirement: "deadened_bastion",
      resolution: "NONE",
      tags: ["buff","defense","form_deadened_bastion","shaper"]
    },
    { id : "shaper_fluid_parry",
      name: "Fluid Parry",
      description: "Parry an attack and transition instantly to any form at half Flux cost. Requires Fluid Apex.",
      level: 5,
      spellType: "REACTION",
      icon: "Utility/Parry",
      effectTypes: ["utility"],
      typeConfig: { school: "physical", icon: "Utility/Parry", tags: ["reaction","parry","form_fluid_apex"], castTime: 0, castTimeType: "REACTION" },
      targetingConfig: { targetingType: "self", rangeType: "self" },
      resourceCost: { actionPoints: 0, mana: 0, classResource: { type: "kinetic_flux", cost: 3 }, components: ["somatic"] },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },
      utilityConfig: { utilityType: "stance_change", selectedEffects: [{ id : "fluid_parry_shift", name: "Instant Shift", description: "Transition instantly to another form." }], duration: 0, durationUnit: "instant", concentration: false, power: "minor" },
      formRequirement: "fluid_apex",
      resolution: "NONE",
      tags: ["reaction","parry","form_fluid_apex","shaper"]
    },
    { id : "shaper_void_terror",
      name: "Void Terror",
      description: "Manifest shadow claws that rip through a target's mind, imposing the Frightened condition. Requires Void Predator.",
      level: 6,
      spellType: "ACTION",
      icon: "Psychic/Psychic Telepathy",
      effectTypes: ["debuff"],
      typeConfig: { school: "blight", icon: "Psychic/Psychic Telepathy", tags: ["debuff","fear","form_void_predator"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "single", rangeType: "ranged", rangeDistance: 30, targetRestrictions: ["enemy"] },
      resourceCost: { actionPoints: 1, mana: 0, classResource: { type: "kinetic_flux", cost: 4 }, components: ["somatic","verbal"] },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
      debuffConfig: { debuffType: "statusEffect", effects: [{ id : "shaper_void_fear", name: "Shadow Terror", description: "Target is Frightened.", mechanicsText: "Frightened condition." }], durationType: "rounds", durationValue: 2, durationUnit: "rounds", canBeDispelled: true },
      formRequirement: "void_predator",
      resolution: "NONE",
      tags: ["debuff","fear","form_void_predator","shaper"]
    },
    { id : "shaper_kinetic_discharge",
      name: "Kinetic Discharge",
      description: "Release all accumulated Flux in a lightning nova, shocking all nearby enemies. Spends all Flux.",
      level: 6,
      spellType: "ACTION",
      icon: "Lightning/Thunderstorm",
      effectTypes: ["damage"],
      typeConfig: { school: "storm", icon: "Lightning/Thunderstorm", tags: ["aoe","damage"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "area", rangeType: "self_centered", areaShape: "circle", areaSize: 20, targetRestrictions: ["enemy"] },
      resourceCost: { actionPoints: 1, mana: 0, classResource: { type: "kinetic_flux", cost: "ALL" }, components: ["somatic"] },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },
      damageConfig: { formula: "3d6 + (Flux Expended * 1d4)", damageTypes: ["storm"], resolution: "DICE" },
      resolution: "DICE",
      tags: ["aoe","damage","storm","shaper"]
    },
    { id : "shaper_myotatic_reflex",
      name: "Myotatic Reflex",
      description: "Passive: Your muscles fire at extreme speed. Gain +1 Action Point if your Kinetic Flux is 10 or higher.",
      level: 7,
      spellType: "PASSIVE",
      icon: "Utility/Speed Boot",
      effectTypes: ["buff"],
      typeConfig: { school: "physical", icon: "Utility/Speed Boot", tags: ["passive","buff","reflex"], castTime: 0, castTimeType: "PASSIVE" },
      targetingConfig: { targetingType: "self", rangeType: "self" },
      resourceCost: { actionPoints: 0, mana: 0 },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
      buffConfig: { buffType: "statEnhancement", effects: [{ id : "shaper_myotatic_ap", name: "Reflex Speed", description: "Gain +1 Action Point per turn if Flux >= 10.", mechanicsText: "+1 AP at start of turn." }], durationType: "permanent", durationValue: 0, durationUnit: "rounds", canBeDispelled: false },
      resolution: "NONE",
      tags: ["passive","buff","reflex","shaper"]
    },
    { id : "shaper_bone_blade_mutation",
      name: "Bone Blade Mutation",
      description: "Mutate your forearms into permanent bone blades, increasing your melee range and damage. +1 Body Toll.",
      level: 7,
      spellType: "ACTION",
      icon: "Slashing/Bloody Slash",
      effectTypes: ["buff"],
      typeConfig: { school: "physical", icon: "Slashing/Bloody Slash", tags: ["buff","mutation"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "self", rangeType: "self" },
      resourceCost: { actionPoints: 1, mana: 0, classResource: { type: "kinetic_flux", cost: 2 }, components: ["somatic"] },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 4 },
      buffConfig: { buffType: "statEnhancement", effects: [{ id : "shaper_bone_blades", name: "Bone Blades", description: "Melee range increased by 5 feet, strikes deal +1d10 slashing.", mechanicsText: "+5ft reach, +1d10 slashing damage." }], durationType: "rounds", durationValue: 5, durationUnit: "rounds", canBeDispelled: false },
      bodyTollCost: 1,
      resolution: "NONE",
      tags: ["buff","mutation","shaper"]
    },
    { id : "shaper_chimeric_burst",
      name: "Chimeric Burst",
      description: "Activate two Shaping Forms simultaneously, gaining the benefits of both. +2 Body Toll.",
      level: 7,
      spellType: "ACTION",
      icon: "Nature/Form Shift",
      effectTypes: ["buff"],
      typeConfig: { school: "primal", icon: "Nature/Form Shift", tags: ["buff","transition"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "self", rangeType: "self" },
      resourceCost: { actionPoints: 1, mana: 0, classResource: { type: "kinetic_flux", cost: 4 }, components: ["somatic","verbal"] },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 5 },
      buffConfig: { buffType: "stance_change", effects: [{ id : "shaper_chimeric_state", name: "Chimeric Fusion", description: "Gain passive benefits of two adjacent forms.", mechanicsText: "Fuses two forms." }], durationType: "rounds", durationValue: 2, durationUnit: "rounds", canBeDispelled: false },
      bodyTollCost: 2,
      resolution: "NONE",
      tags: ["buff","transition","shaper"]
    },
    { id : "shaper_ataxic_maelstrom",
      name: "Ataxic Maelstrom",
      description: "Dash 40 feet in an unpredictable trajectory, striking all enemies passed. Requires Ataxic Flow.",
      level: 8,
      spellType: "ACTION",
      icon: "Slashing/Whirl",
      effectTypes: ["damage","utility"],
      typeConfig: { school: "physical", icon: "Slashing/Whirl", tags: ["mobility","damage","form_ataxic_flow"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "line", rangeType: "ranged", rangeDistance: 40, targetRestrictions: ["enemy"] },
      resourceCost: { actionPoints: 2, mana: 0, classResource: { type: "kinetic_flux", cost: 6 }, components: ["somatic"] },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },
      damageConfig: { formula: "4d6 + agility", damageTypes: ["physical"], resolution: "DICE" },
      formRequirement: "ataxic_flow",
      resolution: "DICE",
      tags: ["mobility","damage","form_ataxic_flow","shaper"]
    },
    { id : "shaper_arterial_rupture",
      name: "Arterial Rupture",
      description: "Deliver a deep tear that causes targets to suffer blight damage whenever they move. Requires Arterial Strike.",
      level: 8,
      spellType: "ACTION",
      icon: "Poison/Envenom Dagger",
      effectTypes: ["damage","debuff"],
      typeConfig: { school: "blight", icon: "Poison/Envenom Dagger", tags: ["melee","damage","debuff","form_arterial_strike"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "single", rangeType: "melee", rangeDistance: 5, targetRestrictions: ["enemy"] },
      resourceCost: { actionPoints: 1, mana: 0, classResource: { type: "kinetic_flux", cost: 6 }, components: ["somatic","verbal"] },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },
      damageConfig: { formula: "3d8 + agility", damageTypes: ["blight"], resolution: "DICE" },
      debuffConfig: { debuffType: "statusEffect", effects: [{ id : "shaper_ruptured_artery", name: "Ruptured Artery", description: "Target takes 1d10 blight damage per 10 feet moved.", mechanicsText: "Movement deals 1d10 blight damage." }], durationType: "rounds", durationValue: 3, durationUnit: "rounds", canBeDispelled: true },
      formRequirement: "arterial_strike",
      resolution: "DICE",
      tags: ["melee","damage","debuff","form_arterial_strike","shaper"]
    },
    { id : "shaper_centrifugal_barrage",
      name: "Centrifugal Barrage",
      description: "Launch a sweeping fan of bone spikes in a 25-foot cone. Requires Centrifugal Fury.",
      level: 8,
      spellType: "ACTION",
      icon: "Slashing/Whirl",
      effectTypes: ["damage"],
      typeConfig: { school: "physical", icon: "Slashing/Whirl", tags: ["aoe","damage","form_centrifugal_fury"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "area", rangeType: "self_centered", areaShape: "cone", areaSize: 25, targetRestrictions: ["enemy"] },
      resourceCost: { actionPoints: 1, mana: 0, classResource: { type: "kinetic_flux", cost: 6 }, components: ["somatic"] },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
      damageConfig: { formula: "4d6", damageTypes: ["physical"], resolution: "DICE" },
      formRequirement: "centrifugal_fury",
      resolution: "DICE",
      tags: ["aoe","damage","form_centrifugal_fury","shaper"]
    },
    { id : "shaper_bastion_earthquake",
      name: "Bastion Slam",
      description: "Slam your calcified fists into the floor, knocking nearby enemies prone. Requires Deadened Bastion.",
      level: 9,
      spellType: "ACTION",
      icon: "Bludgeoning/Hammer Crush",
      effectTypes: ["control"],
      typeConfig: { school: "physical", icon: "Bludgeoning/Hammer Crush", tags: ["aoe","control","form_deadened_bastion"], castTime: 2, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "area", rangeType: "self_centered", areaShape: "circle", areaSize: 20, targetRestrictions: ["enemy"] },
      resourceCost: { actionPoints: 2, mana: 0, classResource: { type: "kinetic_flux", cost: 7 }, components: ["somatic"] },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 4 },
      controlConfig: { controlType: "knockdown", effects: [{ id : "shaper_bastion_prone", name: "Prone Slam", description: "Knocked prone.", config: {"saveType":"strength","saveDC":17} }] },
      formRequirement: "deadened_bastion",
      resolution: "NONE",
      tags: ["aoe","control","form_deadened_bastion","shaper"]
    },
    { id : "shaper_void_phase",
      name: "Void Phase",
      description: "Teleport through the shadow planes up to 60 feet, leaving a decoy. Requires Void Predator.",
      level: 9,
      spellType: "ACTION",
      icon: "Utility/Hide",
      effectTypes: ["utility"],
      typeConfig: { school: "blight", icon: "Utility/Hide", tags: ["mobility","teleport","form_void_predator"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "single", rangeType: "ranged", rangeDistance: 60, targetRestrictions: ["any"] },
      resourceCost: { actionPoints: 1, mana: 0, classResource: { type: "kinetic_flux", cost: 8 }, components: ["somatic"] },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 4 },
      utilityConfig: { utilityType: "teleport", selectedEffects: [{ id : "void_decoy", name: "Shadow Decoy", description: "Teleport 60 feet and leave a shadow decoy." }], duration: 0, durationUnit: "instant", concentration: false, power: "major" },
      formRequirement: "void_predator",
      resolution: "NONE",
      tags: ["mobility","teleport","form_void_predator","shaper"]
    }
  ],

  spellPools: {
  "1": [
    "shaper_kinetic_dissection",
    "shaper_frantic_laceration",
    "shaper_form_shift",
    "shaper_perfect_balance"
  ],
  "2": [
    "shaper_ataxic_sway",
    "shaper_arterial_puncture",
    "shaper_alchemic_purge"
  ],
  "3": [
    "shaper_centrifugal_sweep",
    "shaper_bastion_riposte",
    "shaper_kinetic_dash"
  ],
  "4": [
    "shaper_alchemic_overdrive",
    "shaper_void_collapse",
    "shaper_kinetic_deflection",
    "shaper_arterial_siphon"
  ],
  "5": [
    "shaper_thousand_forms",
    "shaper_centrifugal_launch",
    "shaper_bastion_fortress",
    "shaper_fluid_parry"
  ],
  "6": [
    "shaper_sensory_numbing",
    "shaper_void_terror",
    "shaper_kinetic_discharge"
  ],
  "7": [
    "shaper_myotatic_reflex",
    "shaper_bone_blade_mutation",
    "shaper_chimeric_burst"
  ],
  "8": [
    "shaper_ataxic_maelstrom",
    "shaper_arterial_rupture",
    "shaper_centrifugal_barrage"
  ],
  "9": [
    "shaper_bastion_earthquake",
    "shaper_void_phase"
  ],
  "10": [
    "shaper_terminal_velocity"
  ]
}
};
