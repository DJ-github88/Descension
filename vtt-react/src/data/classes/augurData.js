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
  restrictions: {
      "allowedSubraces": [
          "skald_human",
          "sylen_astril",
          "muren_astril",
          "tessen_human",
          "clean_vreken",
          "marked_vreken"
      ],
      "hardBlocks": [
          "merryn_human",
          "ordan_human",
          "morren_human",
          "myrathil"
      ],
      "narrativeUnlock": true,
      "justification": "Requires proximity to preserved dead (glacier-tombs) and access to Frozen Archive's runic mathematics. Cultures without burial-preservation traditions (Ordan leave dead to steppe, Merryn bury at sea) can't maintain the ancestral connection."
  },

  /**
   * Subrace Variants — every Augur reads the future in something dead or dying, but
   * what counts as "entrails" depends entirely on what your people preserve. The
   * star-arithmetic is failing for all of them — but each tradition fails differently.
   */
  subraceVariants: {
    skald_human: {
      subraceName: 'Skald',
      title: 'The Glacier-Haruspex',
      reframe: `This is Cassia's original tradition. The <LoreLink termId="skald">Skald</LoreLink> read the future in the entrails of sacrificed glacier-elk at the <LoreLink termId="frozen_archive">Frozen Archive</LoreLink>, where the preserved dead stand upright in the ice as witnesses. The glacier-cold slows the cooling of the gore, extending the reading window — a Skald Augur working in a warm room has seconds; working against glacier-ice, they have minutes.`,
      signatureAbility: {
        name: 'Glacier-Reading',
        description: `Visceral auguries remain legible far longer when read against frozen ground or glacier-ice, extending the window in which a vision can be parsed. In warmth, the entrails (and the future they hold) cool and lie within heartbeats.`
      },
      currentCrisisAngle: `The accuracy collapse (93% to 41%) began at the Frozen Archive itself — the Skald's seat. The elder Haruspexes insist the elk are still true and that something is interfering with the ice, not the entrails. The younger Skald suspect the elders cannot accept that their founding method is obsolete.`,
      signatureQuote: {
        text: '"The elk has not lied to me in eight hundred years. I will not call her a liar now because the answer frightens me."',
        speaker: 'Cassia',
        context: 'The founder, defending her method against the first contradictory readings'
      }
    },

    sylen_astril: {
      subraceName: 'Sylen Astril',
      title: 'The Star-Viscera Reader',
      reframe: `The <LoreLink termId="astril">Sylen</LoreLink> read the future not in animal gore but in the resonant fractures of their own crystalline skin. The constellation-spirit's death-rattle echoes *forward* through the crystal lattice — a Sylen Augur's body is the entrail, and the prophecy is the crack that has not yet formed.`,
      signatureAbility: {
        name: 'Lattice-Fracture',
        description: `Visions manifest as stress-fractures in the host's crystalline skin, each fracture a glimpse of a future that has not yet occurred. The deeper the symbiosis, the clearer the crack — but the crack is real, and the skin does not always heal.`
      },
      currentCrisisAngle: `The Sylen's accuracy has not collapsed so much as *inverted* — they now see futures that are vividly clear and entirely wrong. Some Sylen Augurs believe their constellation-spirits are no longer reading the real future but a future the spirit *wants* to be true, the dying star's court choosing comfortable lies over the Deepening's truth.`,
      signatureQuote: {
        text: '"My skin broke in the shape of your death three days ago. You are still here. I do not know which of us to believe."',
        speaker: 'Aenith Glass-Skinned',
        context: 'A Sylen Augur to a party member who, by her reading, should be dead'
      }
    },

    muren_astril: {
      subraceName: 'Muren Astril',
      title: 'The Suppressed Oracle',
      reframe: `The <LoreLink termId="astril">Muren</LoreLink> bind and suppress their constellation-spirits — and an Augur among them weaponizes that captivity. The suppressed spirit *knows* what is coming and screams it through the crystal the Muren have gagged. A Muren Augur's prophecy is the desperate, trapped foreknowledge of a prisoner pounding on the inside of its own cage.`,
      signatureAbility: {
        name: 'Gagged-Foresight',
        description: `Suppressed constellation-spirits leak prophecy as involuntary flashes — vivid but fragmentary, the spirit smuggling warnings past its own bindings. The Muren cannot control what they see, only endure it.`
      },
      currentCrisisAngle: `The accuracy collapse has, paradoxically, made the Muren's spirits *easier* to suppress — the future they scream about is now so garbled it barely registers. Some Muren Augurs are relieved. Others are terrified: a spirit that stops screaming may have stopped because it has nothing left worth warning about.`,
      signatureQuote: {
        text: '"I bound it to silence it. Now it whispers, and I cannot tell whether it is finally dying or finally right."',
        speaker: 'Orathin the Muzzled',
        context: 'A Muren Augur, the night the readings first contradicted themselves'
      }
    },

    tessen_human: {
      subraceName: 'Tessen',
      title: 'The Keep-Prophet',
      reframe: `Sealed inside their snow-buried keeps for four centuries, the <LoreLink termId="house_tesshan">Tessen</LoreLink> have no elk and no glacier. They read the future in the cracks of their own crumbling architecture — the dying keep *as* entrail, the settling stone a slow-motion sacrifice. A Tessen Augur's prophecy is the sound the wall made before it fell.`,
      signatureAbility: {
        name: 'Stone-Harrow',
        description: `Visions are read in the stress-fractures of load-bearing architecture — the Augur's own keep, or any large masonry structure under strain. The bigger the structure and the closer to collapse, the clearer and more catastrophic the reading.`
      },
      currentCrisisAngle: `The Tessen's crisis is the most literal: their keeps are failing, and the stones now prophesy only one future — the keep's own collapse. Every Tessen Augur reads the same vision: the roof, falling, within a generation. The Tessen elders have classified this as a "structural problem" rather than a prophecy, because they cannot afford to believe otherwise.`,
      signatureQuote: {
        text: '"The wall sang its own death this morning. I have written it down. I will not read it aloud — the keep is listening."',
        speaker: 'Warden-Castellan Tess-Otha',
        context: 'A Tessen Augur, filing a prophecy she dare not share with her garrison'
      }
    },

    clean_vreken: {
      subraceName: 'Clean Vreken',
      title: 'The Bog-Gore Diviner',
      reframe: `The <LoreLink termId="vreken">Clean Vreken</LoreLink> read the future in the preserved dead the bog itself coughs up — peat-mummified corpses whose final, frozen expressions encode their last vision. Where the Skald read fresh sacrifice, the Vreken read the ancient dead the <LoreLink termId="bryngloom-forest">Bryngloom</LoreLink> has been kind enough to return.`,
      signatureAbility: {
        name: 'Peat-Reading',
        description: `Visions are parsed from recovered bog-mummies — their posture, expression, and the orientation of their last grasp. The older the corpse, the further forward it sees, but the more degraded the image. A fresh corpse sees hours; a centuries-old mummy sees decades, in fragments.`
      },
      currentCrisisAngle: `The bog has stopped returning its dead. For eight centuries the peat gave up a body every few months; in the past year, nothing. The Clean Vreken read this as the single clearest prophecy of all: the bog itself has seen something so terrible it refuses to let its witnesses surface.`,
      signatureQuote: {
        text: '"The dead come up when they have something to say. The dead have stopped coming up. You tell me what that means."',
        speaker: 'Grave-Keeper Yssen',
        context: 'A Clean Vreken diviner, at the edge of an empty peat-cut'
      }
    },

    marked_vreken: {
      subraceName: 'Marked Vreken',
      title: 'The Mycelium-Haruspex',
      reframe: `The <LoreLink termId="vreken">Marked Vreken</LoreLink> — ghost-mycelium walkers — read the future in the bioluminescent bloom-patterns of the <LoreLink termId="root_veil">mycelial network</LoreLink> threading their skin. The forest's nervous system is a living entrail-spread, and the Marked are the only ones who can feel it think.`,
      signatureAbility: {
        name: 'Bloom-Casting',
        description: `Visions manifest as shifting bioluminescent patterns across the host's fungal network — readable in real time by the Augur and, unfortunately, by any other Marked Vreken in proximity. The prophecy is broadcast as much as it is received.`
      },
      currentCrisisAngle: `The Root-Veil's bloom-patterns have begun *looping* — repeating the same prophecy over and over, as if the network is stuck. Marked Vreken Augurs cannot tell whether the forest is trying to emphasize one future or has simply broken. The repetition is driving the youngest readers to rip the mycelium from their own skin.`,
      signatureQuote: {
        text: '"The forest has one dream now, and it dreams it louder every night. I have stopped sleeping. I am afraid that if I sleep, I will dream it too."',
        speaker: 'Vesh the Bloom-Walked',
        context: 'A Marked Vreken Augur, during the third week of the looping vision'
      }
    }
  },


  id : "augur",
  name: "Augur",
  icon: "fas fa-skull-crossbones",
  role: "Visceral Haruspex (Omen Reading, Flesh Mutilation & Preemptive Evasion)",
  damageTypes: ["wyrd", "ember"],

  livingOrder: {
    orderName: 'The Frozen Order of the Elk',
    founder: {
      name: '<LoreLink termId="cassia">Cassia</LoreLink>',
      status: `Alive — technically. Her body sits in the <LoreLink termId="frozen_archive">Frozen Archive</LoreLink>, preserved upright in the glacier-ice, eyes open. She forgot her own name forty years ago but still reads entrails through the glass.`,
      note: `The Skald star-watcher who read the Deepening in a sacrificed elk's entrails. The temporal-feedback burn took her past, her family, and eventually her identity — the price of seeing too clearly, paid in installments.`
    },
    currentLeader: {
      name: '<LoreLink termId="skadi-glass-eye">Archive-Mistress <LoreLink termId="skadi-glass-eye">Skadi Glass-Eye</LoreLink></LoreLink>',
      title: 'Keeper of the Elk-Rites',
      characterization: `<LoreLink termId="cassia">Cassia</LoreLink>'s great-great-granddaughter, who learned the augury from a woman who no longer remembers being her great-great-grandmother. Skadi maintains the elk-herds and the ritual calendar, and has presided over the accuracy collapse from 93% to 41% without flinching — at least not where the junior augurs can see.`
    },
    headquarters: { name: 'The Frozen Archive', locationId: 'frozen_archive' },
    crisisConnection: `Skadi defends her founder's method against contradictory readings she cannot explain. Privately, she has begun a secret cross-reference — comparing the elk-readings against <LoreLink termId="cassia">Cassia</LoreLink>'s pre-collapse predictions. The pattern suggests the interference is *temporal*: something is editing the future the elk can see. She has not told the Archive council, because the implication is that the Chronarchs' temporal stitching is responsible.`
  },

  worldFriction: [
    { region: 'nordhalla', location: 'frozen_archive', status: 'celebrated', consequence: 'At the Frozen Archive, Augurs are the prophetic backbone — their readings inform Skald military deployment and House Skalvyr policy. Senior Augurs hold advisory seats and their elk-readings are recorded in the genealogical archives.', workaround: 'This standing is currently fragile: the 41% accuracy collapse has halved their credibility, and junior augurs are increasingly ignored by commanders who remember the 93% era.' },
    { region: 'sundrift-vale', status: 'distrusted', consequence: 'The Ordan leave their dead to the steppe and have no preservation tradition — Augury reads as necromancy to them. An Augur traveling the Vale is treated as a corpse-violator and refused hospitality at migration camps.' }
  ],

  overview: {
    originStory: `The future does not reveal itself to clean minds; it must be dragged, warm and steaming, from the belly of the dead. It is said that Cassia, the chief star-watcher of the Nordhalla Keeps, sat in the Frozen Archive when the star Sol first darkened. With the astrolabes frozen solid, she did not look to the sky. Instead, she took a bronze scaling knife and opened the abdomen of a sacrificial glacier-elk, spilling its entrails across the icy stone. By tracing the steaming convolutions of the intestines and the purple mottling of the liver, she read the exact hour of the Deepening. She did not find a path to salvation, but a map of the deaths to come.

The price of peering through the stargate feedback loops of fate was immediate and cruel. As the future flooded her mind, the temporal feedback loop burned away her past. The memories of her husband’s face, the warmth of the hearth, and the names of her children were incinerated to clear space for the mathematically precise coordinate chains of cosmic doom. To maintain this sight, the Augur must invite physical trauma. When the air is still and the future grows dim, she must carve deep runes into her own forearms, using the warm flow of her own blood to re-establish the connection to the stars. The viscera of her enemies and the split-open hides of beasts are her only ledger.

Predict the end. The sky is dark, but the runes in the meat still burn. Read the gory scroll before the final memory of your own name fades into the ice.`,
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
      content: `**HISTORY: THE GENESIS**
The augur's foresight was born in the Frozen Archive of <LoreLink termId="nordhalla">Nordhalla</LoreLink>. A Skald star-watcher named **Cassia** read the terrifying portents of Sol's Deepening, her runes burning with intense, blistering heat.

The price of this feedback loop was memory-loss. Cassia had to trade away her own personal memories to glimpse the future, leaving her runes scarred and her mind disoriented.

**CITIES & CIVIL RECEPTION**
Augurs are highly revered as scholars and prophets in the <LoreLink termId="frozen_archive">Frozen Archive</LoreLink> and the high halls of the <LoreLink termId="synod_hold">Synod-Hold</LoreLink>.

**RACES & CULTURAL AFFILIATION**
The class is heavily practiced by the <LoreLink termId="skald">Rune Keeper Skald</LoreLink> and the Astril.

**NOTABLE FIGURES**
* **Cassia the Star-Eyed**: The legendary seer of the <LoreLink termId="frozen_archive">Frozen Archive</LoreLink> who predicted the solar eclipse at the cost of her past.
* **Kaelen the Unseen**: An Astril priest who mapped the stellar decay from the Scribe's Tower.`
    },

    signatureQuote: {
      text: '"I opened the elk and saw our chieftain dead, our granary empty, and the sun still dark. The entrails do not lie. They also do not offer comfort."',
      speaker: 'Cassia the Star-Eyed',
      context: 'First recorded augury, Nordhalla Frozen Archive, Year 0 of the Dimming'
    },

    philosophy: {
      coreTenet: 'The future is not hidden — it is written in the present if you know where to look. Blood, bones, entrails, smoke, the scatter of rune-stones — these are not omens. They are data. The Augur reads the data that others are too squeamish to examine.',
      relationship: 'Augurs do not bargain with spirits or petition gods. They extract information from the physical world through direct, visceral methods. The future is not revealed to them — it is cut open, spilled, and read while steaming. This relationship is purely mechanical: the Augur opens, the future bleeds, the Augur reads.',
      paradox: 'The Augur sees what is coming but cannot change it. The visions are snapshots of probability, not commands. An Augur who sees a party member dying in the next room has two choices: warn them (and be right when they die anyway), or say nothing. The future does not change because it was seen. It changes despite being seen.'
    },

    currentCrisis: `The star-arithmetic is failing. For eight centuries, the Augurs of the Frozen Archive have used Cassia's original elk-entrail method to predict major events with 93% accuracy. In the past three months, accuracy has dropped to 41%. The entrails are not lying — they are returning results that contradict each other. One elk shows the Archive intact in ten years. Another shows it collapsed last week.

The Augurs have identified the cause: something is interfering with the flow of time itself, creating echoes of futures that cannot exist simultaneously. The phenomenon began on the same day the first Doomsayer returned contradictory extinction equations. The Augurs and Doomsayers do not speak to each other, but their numbers are converging on the same conclusion: the timeline is fracturing, and the Augurs are the first to feel the cracks.`,

    meaningfulTradeoffs: `To see the future is to lose the present. Augurs develop a condition called "chronal myopia" — their vision of tomorrow is crystal clear, but the room they are standing in now is blurry. They forget conversations that happened five minutes ago. They cannot read a book because the words of the next page overlay the words of the current one. They live in a permanent state of temporal vertigo, seeing every moment overlaid with its potential futures. Cassia forgot her children's names within a year of her first augury.`,

    classSpecificLocations: [
      {
        name: 'The Entrail Chambers',
        locationId: 'frozen-archive',
        description: 'A cold, stone chamber beneath the Frozen Archive where Augurs perform their readings. The floor is sloped and drained — blood washes away into a central basin. Racks of rune-etched bone chisels line the walls. The air smells of iron and old salt.',
        purpose: 'Ritual space for augury readings',
        status: 'Active — but the contradictory results have thrown the chamber into chaos'
      }
    ],

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
      content: `**The Setup**: You are an Augur creeping through a plague-blighted ruin with your party. A massive, iron-clad abominable executioner blocks the path. The room is quiet; no blood has been spilt. You have 0 Benediction and 0 Malediction. You must act.

**Turn 1 - The First Incision**
*Because no bleeding targets or fresh corpses exist, your eyes are blind to the future. You pull your ritual flaying hook and drag it across your own left forearm, carving the first sign.*
* **Self-Mutilation**: You take 1d6 slashing damage (4 HP lost) and suffer Bleed (1d4 damage at the start of your turn for 3 rounds). This generates +2 Malediction.
* **Your Action**: Cast "Fractured Fate Portent" on the Executioner (8 Mana + 2 Malediction spent).
* **Effect**: You scream the fracture you see. The executioner staggers as his femur cracks internally. He takes 2d6 wyrd damage and suffers -2 DR and -10ft speed for 3 rounds.
* **Mana**: 45 → 37/55.
* **Malediction**: 2 → 0/15.
* **Current State**: Malediction: 0/15 | Benediction: 0/5 | HP: 46/50 | Bleed Active (3 rounds)

**Turn 2 - The Blood Flows**
*The executioner roars in agony, his bones splintering from within. The fight begins.*
* **Fighter's Turn**: Attacks the executioner → d20+6 → [12] → Hit! 
* **Omen Reading**: 12 is even → +1 Benediction.
* **Enemy's Turn**: The executioner swings his massive cleaver at the Fighter → d20+7 → [17] → Hit!
* **Omen Reading**: 17 is odd → +1 Malediction.
* **Your Reaction**: Spend 1 Benediction and 1 Malediction to cast "Blood-Read Foresight".
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
          "Generated by even d20 rolls. Spent on immediate defense, preemptive evasion, and ember warding of flesh.",
      },
      {
        title: "Malediction",
        stats: "0-10 Scale (Harbinger: 15)",
        details:
          "Generated by odd d20 rolls. Spent on bone-splintering wyrd damage, crippling physical penalties, and vulnerability markings.",
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
        "Use your immediate reactions. Saving an ally from a fatal strike with Blood-Read Foresight or guaranteeing a critical counter-strike turns the tides of battle instantly.",
    },

    overheatRules: {
      title: "Omen Exhaustion & The Flesh Tax",
      content: `The Augur's manipulation of immediate fate carries severe physical and mental tolls:

**The Resource Caps**:
Your specialization limits your absolute capacity to store fate:
* **Auspex (Balanced)**: 10 Benediction / 10 Malediction.
* **Harbinger (Doom)**: 5 Benediction / 15 Malediction.
* **Hierophant (Grace)**: 15 Benediction / 5 Malediction.
Any resource generated beyond these caps is lost and immediately deals 1 wyrd damage per wasted point directly to the Augur's mind.

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
          "Blood-Read Foresight",
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
          "Fractured Fate Portent",
          "2 Malediction",
          "Target Crippling",
          "Action: Cracks bones internally. Deals 2d6 psychic, -2 DR, -10ft speed",
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

        description: `Auspices seek the perfect, terrifying equilibrium between creation and decay. They believe that fate is a scale that must be balanced in blood. By reading both the ember spray of life and the dark rot of death, they keep their parties hovering just above the grave while dragging their foes into it.`,

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
      },

      { id : "harbinger",
        name: "Harbinger",
        icon: "fa-cloud-bolt",
        color: "#8B5A8B",
        theme: "Prophet of the Black Ash",

        description: `Harbingers have stared too long into the screaming dark. Their bodies are maps of scars, their veins running with blackened maledictory rot. They care nothing for preservation; they seek only to accelerate the end. Every omen they read is a weapon, every word they whisper a fracture in a foe's skull.`,

        playstyle: "High-risk offensive wyrd damage, crippling debuffs, vulnerability stacking",

        strengths: [
          "Maximum resource caps set to 5 Benediction and 15 Malediction",
          "All wyrd damage ignores enemy resistances entirely",
          "Malediction-fueled spells deal +2d6 additional wyrd damage",
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
            "5/15 dual resource caps. wyrd damage ignores resistance. Malediction spells deal +2d6 wyrd damage.",
        },
      },

      { id : "hierophant",
        name: "Hierophant",
        icon: "fa-sun",
        color: "#DAA520",
        theme: "Martyr of the Blinding Splinters",

        description: `Hierophants are tragic martyrs who burn away their own sight to channel the searing, blinding light of tomorrow. They read the golden, agonizing threads of grace, congealing spilt blood into shields of shining marrow. They endure immense physical pain to ensure their allies never feel a wound.`,

        playstyle: "Aggressive defensive support, massive damage-mitigation zones, ember healing",

        strengths: [
          "Maximum resource caps set to 15 Benediction and 5 Malediction",
          "All healing spells restore 50% more HP",
          "Benediction-fueled spells grant allies +2 DR for 2 rounds",
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
            "15/5 dual resource caps. Healing increased by 50%. Benediction spells grant +2 DR to allies.",
        },
      },
    ],
  },

  exampleSpells: [
    // ============================================================
    // LEVEL 1 SPELLS (5)
    // ============================================================

    { id : "augur_read_the_signs",
      name: "Read the Omen",
      description:
        "You observe the shifting shadows and heat patterns rising from a recent clash. If no conflict is present, you draw upon localized kinetic friction, forcing the omens of fate to speak. The patterns reveal the target's fatal structural flaw.",
      level: 1,
      spellType: "ACTION",
      icon: "Necrotic/Ritual",
      effectTypes: ["debuff"],
      typeConfig: {
        school: "wyrd",
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
            description: "Target has +50% vulnerability to wyrd damage for 3 rounds.",
            mechanicsText: "Imposes 50% wyrd vulnerability on the target.",
            statusEffect: {
              vulnerabilityType: "wyrd",
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
      name: "Blood-Read Foresight",
      description:
        "You read the rapid pulse and visual strain of a targeted ally six seconds before the strike lands. Shouting a preemptive warning, you warp the local probability field to yank them out of harm's way, leaving the enemy striking nothing but a fading shadow.",
      level: 1,
      spellType: "REACTION",
      icon: "Nature/Ethereal Bear Spirit",
      effectTypes: ["buff", "utility"],
      typeConfig: {
        school: "wyrd",
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
            name: "Blood-Read Evasion",
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
      name: "Pulse Curse",
      description:
        "You project a focused pulse of kinetic pressure toward a foe. The force vibrates in mid-air, forming a floating, glowing rune of doom. Their vision clouds as their heartbeats sync to a slow, halting rhythm.",
      level: 1,
      spellType: "ACTION",
      icon: "Necrotic/Corruption",
      effectTypes: ["debuff", "damage"],
      typeConfig: {
        school: "wyrd",
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
        damageTypes: ["wyrd"],
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
        school: "ember",
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
        school: "wyrd",
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
      name: "Fractured Fate Portent",
      description:
        "You declare an omen of imminent fracture. An invisible, crushing weight slams down on the target's joints, straining their physical form. They stagger, their defenses splitting under their own weight.",
      level: 2,
      spellType: "ACTION",
      icon: "Necrotic/Bone Shards",
      effectTypes: ["debuff", "damage"],
      typeConfig: {
        school: "wyrd",
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
          { id : "fractured_fate_debuff",
            name: "Fractured Frame",
            description: "Target has -2 DR and their Agility is reduced by 2 for 3 rounds.",
            mechanicsText: "-2 DR and -2 Agility.",
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
        damageTypes: ["wyrd"],
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
      name: "Cruor Consecration",
      description:
        "You pour a chalice of consecrated alchemical oils onto the earth. The soil instantly shimmers, bubbling into a dense mist of kinetic energy. Enemies who walk here are slowed as the heavy pressure drags at their boots.",
      level: 2,
      spellType: "ACTION",
      icon: "Necrotic/Corruption",
      effectTypes: ["damage", "debuff"],
      typeConfig: {
        school: "blight",
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
        materialComponents: "A cup of alchemical oil",
        classResource: { type: "malediction", cost: 3 },
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
      debuffConfig: {
        debuffType: "statPenalty",
        effects: [
          { id : "kinetic_consecration_slow",
            name: "Kinetic Grasp",
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
        damageTypes: ["wyrd"],
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
      name: "Sanguine Aegis",
      description:
        "You trace a protective rune in mid-air and direct it at an ally. A shimmering, iron-hard carapace of crimson and golden light forms around them, drinking incoming trauma.",
      level: 2,
      spellType: "ACTION",
      icon: "Radiant/Divine Blessing",
      effectTypes: ["buff"],
      typeConfig: {
        school: "ember",
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
            description: "Grants +3 DR and resistance to the next source of physical damage.",
            mechanicsText: "+3 DR, physical resistance (1 charge).",
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
      name: "Omen Lance",
      description:
        "You thrust your hand forward, casting a dual lance of burning energy and shattering, resonant wyrd waves. If the immediate combat signs are even, the bolt strikes with terrible, blinding intensity.",
      level: 3,
      spellType: "ACTION",
      icon: "Radiant/Radiant Sunburst",
      effectTypes: ["damage"],
      typeConfig: {
        school: "wyrd",
        secondaryElement: "ember",
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
        damageTypes: ["wyrd", "ember"],
        secondaryDamage: {
          formula: "1d8",
          condition: "If the damage roll total is even, deal additional ember damage.",
        },
        resolution: "DICE",
      },
      resolution: "DICE",
      tags: ["attack", "damage", "dual_element", "omen"],
    },

    { id : "augur_harbinger_gaze",
      name: "Unblinking Gaze",
      description:
        "You lock eyes with a target and force them to see the vastness of fate, fracturing their sense of time. The mental shock breaks their concentration, leaving them staggered in blind terror.",
      level: 3,
      spellType: "ACTION",
      icon: "Psychic/Psionic Boom",
      effectTypes: ["damage", "debuff"],
      typeConfig: {
        school: "wyrd",
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
        damageTypes: ["wyrd"],
        resolution: "DICE",
      },
      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          { id : "unblinking_gaze_fear",
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
      name: "Vigilant Sanctuary",
      description:
        "You hammer your staff into the ground, creating a zone of blinding, protective radiance. Allies who stand within have their wounds sealed with warm, restorative light, while enemies are scorched by the searing truth.",
      level: 3,
      spellType: "ACTION",
      icon: "Radiant/ember light Burst",
      effectTypes: ["healing", "damage"],
      typeConfig: {
        school: "ember",
        icon: "Radiant/ember light Burst",
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
        damageTypes: ["ember"],
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
      name: "Ruinous Fate Hex",
      description:
        "You speak the ultimate word of decay. The target's temporal anchor begins to unravel. They freeze in absolute, screaming paralysis as their sense of self collapses.",
      level: 4,
      spellType: "ACTION",
      icon: "Necrotic/Death Mark",
      effectTypes: ["damage", "debuff"],
      typeConfig: {
        school: "wyrd",
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
        damageTypes: ["wyrd"],
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
        "You draw a massive, bloody cross in the air. The intersection creates a highly volatile spatial nexus: allies on one axis are bathed in blinding ember recovery, while enemies on the other are scorched.",
      level: 4,
      spellType: "ACTION",
      icon: "Arcane/Portal Archway",
      effectTypes: ["healing", "damage"],
      typeConfig: {
        school: "ember",
        secondaryElement: "wyrd",
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
        damageTypes: ["wyrd"],
        resolution: "DICE",
      },
      resolution: "DICE",
      tags: ["area", "healing", "damage", "omen"],
    },

    { id : "augur_hierophants_ward",
      name: "Martyr's Shroud",
      description:
        "You trace a massive ember shroud across your allies. Their skin hardens with the protective glare of congealed bones, making them completely immune to panic and significantly harder to cut.",
      level: 4,
      spellType: "ACTION",
      icon: "Radiant/Radiant Golden Shield",
      effectTypes: ["buff"],
      typeConfig: {
        school: "ember",
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
            description: "Grants +2 DR and absolute immunity to Charmed and Frightened conditions.",
            mechanicsText: "+2 DR, immune to Charmed/Frightened.",
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
      name: "Crimson-Mist Tempest",
      description:
        "You conjure a violent, swirling tempest of crimson light and howling chronal echoes. The storm is hyper-volatile: allies within are healed by the life-giving mist, while enemies have their defenses shredded by jagged wind shear.",
      level: 5,
      spellType: "ACTION",
      icon: "Lightning/Thunderstorm",
      effectTypes: ["damage", "healing"],
      typeConfig: {
        school: "wyrd",
        secondaryElement: "ember",
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
        damageTypes: ["wyrd", "ember"],
        secondaryDamage: {
          formula: "2d6",
          condition: "If the damage roll total is even, deal additional ember damage.",
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
        school: "wyrd",
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
            description: "Enemies have -3 to all attack rolls and -3 to DR while in the zone.",
            mechanicsText: "-3 attack rolls, -3 DR.",
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
        damageTypes: ["wyrd"],
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
        "You raise a colossal temple of ember bone splinters. The air burns with golden light, providing absolute shelter for your allies. Their wounds seal, their skin hardens, and all fear is instantly incinerated.",
      level: 5,
      spellType: "ACTION",
      icon: "Healing/Prayer",
      effectTypes: ["healing", "buff"],
      typeConfig: {
        school: "ember",
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
            description: "Allies have +3 to all saving throws and gain resistance to wyrd damage.",
            mechanicsText: "+3 all saving throws, wyrd resistance.",
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
        "You violently detonate the active omens clinging to your targets. Jagged shards of ember bone and wyrd agony burst outward from their skin, shredding nearby tissue and leaving them bleeding.",
      level: 6,
      spellType: "ACTION",
      icon: "Necrotic/Bone Shards",
      effectTypes: ["damage"],
      typeConfig: {
        school: "wyrd",
        secondaryElement: "ember",
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
        damageTypes: ["wyrd", "ember"],
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
        school: "wyrd",
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
        school: "ember",
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
      name: "Splitting of the Veil",
      description:
        "You split reality down the center. On one side, allies are bolstered by protective, golden fate. On the other, enemies have their planar anchors torn away, suffering catastrophic vulnerability.",
      level: 7,
      spellType: "ACTION",
      icon: "Arcane/Portal Archway",
      effectTypes: ["buff", "debuff"],
      typeConfig: {
        school: "wyrd",
        secondaryElement: "ember",
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
            description: "Allies have +2 to all d20 rolls and +2 DR.",
            mechanicsText: "+2 all rolls, +2 DR.",
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
        "You chant a horrifying, blackened dirge. The sky turns the color of congealed blood as a massive wave of wyrd agony crushes your enemies, shattering their mental armor and leaving them paralyzed.",
      level: 7,
      spellType: "ACTION",
      icon: "Psychic/Agonizing Scream",
      effectTypes: ["damage", "debuff"],
      typeConfig: {
        school: "wyrd",
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
        damageTypes: ["wyrd"],
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
      name: "Sanguine Altar of Grace",
      description:
        "You summon a colossal altar of crimson energy and golden splinters. The altar forms an absolute sanctuary: allies within are immune to all damage, while enemies are violently repelled by the searing light.",
      level: 7,
      spellType: "ACTION",
      icon: "Radiant/ember light Burst",
      effectTypes: ["buff", "utility"],
      typeConfig: {
        school: "ember",
        icon: "Radiant/ember light Burst",
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
        school: "wyrd",
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
        school: "blight",
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
              "If the target rolls an odd number on any d20 (attack, save, or check), they are instantly reduced to 0 HP (Constitution save DC 18 reduces this to 10d10 blight damage).",
            mechanicsText: "Odd d20 rolls trigger instant 0 HP or 10d10 blight.",
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
        "You flood the battlefield in a blinding, searing sky-fire of tragic ember light. The aurora bleeds the eyes of all who gaze upon it: allies have their flesh hardened, while enemies are charred to black ash.",
      level: 8,
      spellType: "ACTION",
      icon: "Radiant/Radiant Sunburst",
      effectTypes: ["healing", "damage", "buff"],
      typeConfig: {
        school: "ember",
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
        damageTypes: ["ember"],
        resolution: "DICE",
      },
      buffConfig: {
        buffType: "custom",
        effects: [
          { id : "aurora_allies_buff",
            name: "Sky-Clad Flesh",
            description: "Allies gain +3 DR and immunity to wyrd damage for the duration.",
            mechanicsText: "+3 DR, wyrd immunity.",
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
        school: "wyrd",
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
        "You declare a portent of absolute seismic collapse. The ground rips open, spraying molten wyrd fire. Enemies are crushed under collapsing mud, stunned, and marked with catastrophic rot.",
      level: 9,
      spellType: "ACTION",
      icon: "Void/Red Energy Burst",
      effectTypes: ["damage", "debuff"],
      typeConfig: {
        school: "wyrd",
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
        damageTypes: ["wyrd"],
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
        school: "ember",
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
        school: "ember",
        secondaryElement: "wyrd",
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
        "You dissolve your mortal frame, becoming a walking storm of decaying black ash and screaming wyrd horror. Every enemy who looks upon you staggers as their skin turns to soot, their femur bones cracking under fated weight.",
      level: 10,
      spellType: "ACTION",
      icon: "Void/Black Hole",
      effectTypes: ["debuff", "damage"],
      typeConfig: {
        school: "wyrd",
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
        damageTypes: ["wyrd"],
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
        school: "ember",
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
        damageTypes: ["ember"],
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

      {
        "id": "augur_whisper_harvester",
        "name": "Whisper of the Harvester",
        "description": "Stare intensely at a recently deceased beast or humanoid, reading the fading thermal residues of their final steps. Through sheer mental focus, trace a glowing copper-colored line on the ground mapping where their companions fled.",
        "level": 1,
        "spellType": "ACTION",
        "icon": "Necrotic/Ritual",
        "typeConfig": {
          "school": "wyrd",
          "icon": "Necrotic/Ritual",
          "tags": [
            "utility",
            "roleplay",
            "augur"
          ],
          "castTime": 1,
          "castTimeType": "IMMEDIATE"
        },
        "targetingConfig": {
          "targetingType": "single",
          "rangeType": "ranged",
          "rangeDistance": 10,
          "targetRestrictions": []
        },
        "resourceCost": {
          "actionPoints": 1,
          "resourceTypes": [
            "mana"
          ],
          "resourceValues": {
            "mana": 3
          },
          "components": [
            "verbal",
            "somatic"
          ],
          "verbalText": "Sicut vestigium apparet...",
          "somaticText": "Trace your finger through the damp soil near the target, ignoring the copper smell of rot"
        },
        "resolution": "NONE",
        "effectTypes": [
          "utility"
        ],
        "utilityConfig": {
          "utilityType": "perception",
          "selectedEffects": [
            {
              "id": "whisper_harvester_effect",
              "name": "Thermal Trace",
              "description": "Reveals a glowing trail showing the route taken by up to three of the deceased target's companions within the last hour."
            }
          ],
          "duration": 10,
          "durationUnit": "minutes",
          "concentration": false,
          "power": "minor"
        },
        "cooldownConfig": {
          "cooldownType": "turn_based",
          "cooldownValue": 0
        },
        "tags": [
          "utility",
          "roleplay",
          "augur"
        ]
      },
  ],

  spellPools: {
    1: [
      "augur_read_the_signs",
      "augur_omen_shield",
      "augur_minor_portent",
      "augur_sign_of_clarity",
      "augur_omen_bolt",
      "augur_whisper_harvester",
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
