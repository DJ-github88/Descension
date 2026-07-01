/**
 * Apex Class Data
 *
 * Complete class information for the Apex - an agile melee combatant
 * who wields the Shadow Glaive and commands a loyal companion.
 */

export const APEX_DATA = {
  restrictions: {
      "allowedSubraces": [
          "maskborne_mimir",
          "mistwoven_mimir",
          "unwoven_mimir",
          "skald_human",
          "clean_vreken",
          "marked_vreken",
          "ordan_human"
      ],
      "hardBlocks": [
          "emberth",
          "neth",
          "myrathil",
          "tessen_human"
      ],
      "narrativeUnlock": true,
      "justification": "Requires cultures with predator-tracking traditions. Skald hunt in the Hunger Glaciers. Mimir track Wyrd in the mist. Ordan steppe nomads track prey across open tundra using scent and kinetic vibration. Other cultures lack the sensory training."
  },

  /**
   * Subrace Variants — the Apex tracks and resolves targets with minimum force, and the
   * *medium* of the tracking is what each variant inherits. The Mimir read the mist.
   * The Skald read the ice. The Vreken read the mycelium. The Ordan read the open steppe.
   * The mist is learning to hide from all of them.
   */
  subraceVariants: {
    maskborne_mimir: {
      subraceName: 'Mask-Borne Mimir',
      title: 'The Mask-Hunter',
      reframe: `The <LoreLink termId="mimir">Mask-Borne</LoreLink> anchor their identity to a fixed mask, and an Apex among them tracks through the fog with an *identity-stable perception* — the mask holds the self still while the senses range, a fixed point of awareness in the shifting mist. The Mask-Borne are the tradition's steadiest trackers, their judgment unclouded by the fog's identity-erosion.`,
      signatureAbility: {
        name: 'Anchor-Sense',
        description: `Tracking-perception is stabilized by the mask; while the Mask-Borne Apex's mask is intact and untouched, their sensory acuity cannot be eroded by the fog's memory-decay. The instant the mask is displaced, the senses scatter. The Mask-Borne hunt with their face protected at all costs.`
      },
      currentCrisisAngle: `The mist is learning to hide (the foundational crisis), and the Mask-Borne feel it as their anchored perception *meeting resistance* — the fog no longer merely erodes, it actively *evades* their senses. Several Mask-Borne Apexes have reported the mist *looking back* through their own stabilized perception, as if the thing they are hunting is now hunting through the very clarity they rely on.`,
      signatureQuote: {
        text: '"My mask holds me steady so I can see what the fog hides. Lately the fog sees me back, through my own steadiness. I have become the thing I am hunting, or it has become me."',
        speaker: 'Mask-Hunter Mir-Vassen',
        context: 'A Mask-Borne Apex, the fourth hunt his anchored senses returned nothing'
      }
    },

    mistwoven_mimir: {
      subraceName: 'Mist-Woven Mimir',
      title: 'The Sentinel-Tracker',
      reframe: `The <LoreLink termId="mimir">Mist-Woven</LoreLink> — the fog-sentinels of the <LoreLink termId="frostwood-reach">Ironwood Palisade</LoreLink> — track as *vigil*, treating every hunt as an extension of their sentinel-duty. A Mist-Woven Apex does not hunt for sport or bounty; they hunt because something has entered the perimeter, and the perimeter must be answered. Their tracking is defensive, methodical, and relentless.`,
      signatureAbility: {
        name: 'Perimeter-Track',
        description: `Tracking-acuity is amplified inside a defined perimeter the Apex has sworn to guard — a settlement, a stretch of palisade, a party's camp. Inside the perimeter, the Mist-Woven are nearly infallible. Outside it, pursuing prey that has fled, their acuity drops sharply. They are guards, not pursuers.`
      },
      currentCrisisAngle: `The mist's new evasion has the Mist-Woven sentinels on the verge of panic: the perimeter they have guarded for centuries is now *leaking*, the fog itself opening gaps for things to slip through undetected. Several Mist-Woven Apexes have abandoned their posts in the Palisade to hunt whatever is teaching the mist to hide, judging the root cause more dangerous than the perimeter-breaches it causes.`,
      signatureQuote: {
        text: '"I have guarded this wall for thirty years and the wall has held because the mist cooperated. Now the mist opens doors for the things I am meant to stop. I am leaving the wall to find the hand on the door."',
        speaker: 'Sentinel-Tracker Mir-Felss',
        context: 'A Mist-Woven Apex, requesting leave to hunt beyond the Palisade'
      }
    },

    unwoven_mimir: {
      subraceName: 'Unwoven Mimir',
      title: 'The Fog-Walker',
      reframe: `The <LoreLink termId="mimir">Unwoven</LoreLink> — maskless, dissolving — track by *becoming the fog*: their already-blurring forms merge with the mist, letting them move *inside* the very medium the prey hides in. An Unwoven Apex is the tradition's ghost, hunting from within the fog rather than against it. Their perception is fluid, unstable, and uniquely able to find things that have *become* the fog.`,
      signatureAbility: {
        name: 'Fog-Merge',
        description: `The Apex can dissolve partially into the fog, tracking prey *from inside* the mist rather than through it — the only tracking method effective against things that have adapted to hide *in* the fog. The cost: each merge costs the Unwoven more of their already-fading definition, and a prolonged hunt risks the tracker never fully re-cohering.`
      },
      currentCrisisAngle: `The mist's new evasion is, for the Unwoven, *entrapping* — they merge with the fog to hunt, and the fog, now actively deceptive, *keeps* them. Several Unwoven Apexes have failed to re-cohere after a deep-merge hunt, dissolving permanently into the very mist they entered. The Unwoven are the only trackers who can find what hides in the fog, and the fog is now killing them for it.`,
      signatureQuote: {
        text: '"I hunt by becoming the thing I hunt in. The fog used to let me leave. Now it does not want to. I am losing my edges, and the fog is gaining a hunter who will not need a body."',
        speaker: 'Unwoven Mir-Naeth',
        context: 'An Unwoven Apex, the morning after a hunt she barely re-cohered from'
      }
    },

    skald_human: {
      subraceName: 'Skald',
      title: 'The Glacier-Stalker',
      reframe: `The <LoreLink termId="skald">Skald</LoreLink> hunt in the <LoreLink termId="nordhalla">Hunger Glaciers</LoreLink>, tracking the things that crawl from the ice — the Stel, the glacier-revenants — across terrain that records every footprint in permanent frost. A Skald Apex reads the ice the way the Thalren read a ledger: every mark is recorded, every track is preserved, and the glacier does not lie.`,
      signatureAbility: {
        name: 'Ice-Reading',
        description: `Tracking-acuity is amplified on frozen terrain — snow, ice, frost — where every mark is preserved and readable. The Skald are the tradition's forensic trackers, able to read tracks days or weeks old in permanent frost. On thawed or warm terrain, their acuity collapses; the record simply is not there.`
      },
      currentCrisisAngle: `The glaciers are *warming* — slowly, marginally, but measurably — and the Skald Apexes read it as a catastrophe in slow motion: their entire tracking substrate is *melting*. The Hunger Glaciers preserve the record the Skald hunt by, and as they recede, the Skald are losing tracks that have stood for centuries. Several elders read the melt as the world itself forgetting how to be hunted.`,
      signatureQuote: {
        text: '"The glacier has kept every footprint for eight hundred years and I have read them all. Now the glacier weeps, and the footprints blur. I am watching my library melt, one drop at a time."',
        speaker: 'Glacier-Stalker Skald-Ragna',
        context: 'A Skald Apex, reading a track that was crisp last season and is now slush'
      }
    },

    clean_vreken: {
      subraceName: 'Clean Vreken',
      title: 'The Glow-Trailer',
      reframe: `The <LoreLink termId="vreken">Clean Vreken</LoreLink> track through bioluminescent *spoor* — the faint glow-trail every living thing leaves on the mycelial network as it moves. A Clean Vreken Apex reads the forest's nervous system the way a sailor reads a wake: the passage of any creature through connected ground lights a trail in the Root-Veil, and the Clean Vreken follow the light.`,
      signatureAbility: {
        name: 'Spoor-Glow',
        description: `Tracking is performed by reading bioluminescent spoor-trails in the Root-Veil — effective across any mycelium-connected terrain, and able to track creatures that leave no physical trace. The cost: tracks fade as the network's memory of the passage fades, and a spoor-trail in disturbed or dying mycelium is unreadable.`
      },
      currentCrisisAngle: `The Root-Veil is rejecting the Marked (the Plaguebringer crisis), and as the network recoils, the spoor-trails are *degrading* — the forest's memory of what passed through is being erased along with the mycelium. Clean Vreken Apexes are watching their tracking-substrate die the way the Skald watch the glaciers melt: the record they hunt by is disappearing.`,
      signatureQuote: {
        text: '"Everything that moves in this forest leaves a light, and I read the light. Now the lights are going out, not because the prey has stopped moving, but because the forest has stopped remembering. I am tracking things the world is forgetting."',
        speaker: 'Glow-Trailer Yssen',
        context: 'A Clean Vreken Apex, following a spoor-trail that was fading as she read it'
      }
    },

    marked_vreken: {
      subraceName: 'Marked Vreken',
      title: 'The Mycelium-Scent',
      reframe: `The <LoreLink termId="vreken">Marked Vreken</LoreLink> — ghost-mycelium walkers — track *through* their own network-connected skin, feeling the passage of prey as vibrations in the Root-Veil the way a spider feels a web. A Marked Apex does not read spoor; they *feel* movement, their mycelium-threaded body a living sensory net spread across miles of forest floor.`,
      signatureAbility: {
        name: 'Web-Sense',
        description: `Tracking is performed through tactile vibration in the host's own mycelial network — the Apex feels prey moving anywhere on connected ground, through their skin. The most *immediate* tracking method, but requires the prey to be moving; a stationary target produces no vibration and is invisible to the Web-Sense.`
      },
      currentCrisisAngle: `The Root-Veil's rejection of the Marked (the Plaguebringer crisis) is *amputating their senses* — as the network expels their mycelium, the Web-Sense's range collapses. Marked Apexes are being reduced from miles-wide perception to the range of their own skin, and the terror of going *numb* — of losing the web they have felt through for centuries — is driving some to tear the expelling mycelium out faster, to get the loss over with.`,
      signatureQuote: {
        text: '"I felt the whole forest through my skin, and now the forest is pulling its fingers out of me one by one. Soon I will feel only myself. I do not know how to hunt with only a body."',
        speaker: 'Marked Apex Vesh',
        context: 'A Marked Vreken, feeling another patch of mycelium detach from her arm'
      }
    },

    ordan_human: {
      subraceName: 'Ordan',
      title: 'The Steppe-Scent',
      reframe: `The <LoreLink termId="skald">Ordan</LoreLink> — steppe nomads — track across the open <LoreLink termId="sundrift-vale">Sundrift Vale</LoreLink> by *scent and kinetic vibration*, reading the grass and the wind the way a sailor reads the sea. An Ordan Apex is the tradition's open-terrain specialist: where the forest-trackers read cover and the glacier-trackers read frost, the Ordan read *distance*, tracking prey across miles of featureless steppe through the bend of a grass-stalk.`,
      signatureAbility: {
        name: 'Steppe-Read',
        description: `Tracking-acuity is amplified on open, windswept terrain — grassland, steppe, tundra — where kinetic vibration and scent carry for miles. The Ordan are the tradition's longest-range trackers, able to follow prey at distances that would lose any forest or glacier specialist. The cost: in dense cover or enclosed spaces, their range-craft is nearly useless.`
      },
      currentCrisisAngle: `The mist-learning-to-hide crisis has not reached the open steppe directly, but the Ordan report a subtler symptom: the *wind has started lying*. The steppe-trackers read the grass and the air, and both have begun carrying false information — scent-trails that lead nowhere, vibrations that have no source. The Ordan suspect whatever is teaching the Frostwood mist to hide is *also teaching the steppe wind to deceive*, and the open sky they have trusted for millennia is no longer neutral ground.`,
      signatureQuote: {
        text: '"I read the grass the way your scholar reads a page. The grass has started writing fiction. I have followed three trails this moon that led to nothing but wind. The steppe is lying to me, and I do not know what I did to deserve it."',
        speaker: 'Steppe-Scent Bayar',
        context: 'An Ordan Apex, returning from a third hunt that found nothing'
      }
    }
  },


  id : "apex",
  name: "Apex",
  icon: "fas fa-moon",
  role: "Damage",
  damageTypes: ["physical"],

  // Overview section
  livingOrder: {
    orderName: 'The Silent Hunt',
    founder: {
      name: '<LoreLink termId="sylas">Sylas</LoreLink>',
      status: `Alive — and entirely deaf. The tracker who tuned his senses to the silent vibrations of pine needles and damp earth, stalking a conceptual Wyrd-entity for seven days. To achieve absolute sensory focus, he paid with his hearing — completely deaf to kin, living in a silent predatory world. He has led the Hunt in sign-language ever since.`,
      note: `<LoreLink termId="sylas">Sylas</LoreLink> built the Silent Hunt on a trade the order still honors: give up one sense to sharpen the rest. Every Apex initiate chooses a sacrifice. <LoreLink termId="sylas">Sylas</LoreLink> chose hearing. The mist that is now learning to hide is teaching him that some things cannot be tracked even with every sense paid for.`
    },
    currentLeader: {
      name: '<LoreLink termId="sylas">Silent-Master Sylas</LoreLink>',
      title: 'The First Hunter',
      characterization: `Deaf, lethal, and patient beyond any living tracker. <LoreLink termId="sylas">Sylas</LoreLink> communicates through a tactile sign-language the Hunt developed specifically because spoken words are unreliable in the <LoreLink termId="frostwood-reach">Frostwood</LoreLink> fog. He leads from the deep ironwood and has tracked the same conceptual Wyrd-entity, on and off, for forty years. It has never let him close. Lately, it has begun circling *him*.`
    },
    headquarters: { name: 'The Still Blind, deep Ironwood Heart (Frostwood Reach)', locationId: 'frostwood-reach' },
    crisisConnection: `<LoreLink termId="sylas">Sylas</LoreLink> is the hunter realizing he has become the hunted. The mist is learning to hide — not randomly but *deliberately*, evading Apex senses that have held for centuries. He has concluded that something large has moved through the Reach for months without leaving trace, and that the something is *teaching the mist to evade the Hunt itself*. The Unwoven trackers who dissolve into the fog to find it are not coming back. <LoreLink termId="sylas">Sylas</LoreLink> is preparing to dissolve into the fog himself, knowing he may not come back either — because he is the only tracker who has ever gotten close, and the thing in the mist has noticed.`
  },

  worldFriction: [
    { region: 'frostwood-reach', status: 'celebrated', consequence: 'The Silent Hunt is the Frostwood\'s primary defense against the Wyrd; Mimir canopy-posts and Thalren settlements pay retainers to resident Apexes. A licensed Apex holds right-of-passage through the Ironwood Palisade without papers.', workaround: 'This standing is eroding with the mist-learning-to-hide crisis: an Apex who cannot find the Wyrd is an Apex who cannot justify their retainer, and the settlements are beginning to question the expense.' },
    { region: 'everywhere-else', status: 'solitary', consequence: 'Apexes are not persecuted anywhere, but they are universally considered unsettling — the absolute sensory focus reads as predation to ordinary people. An Apex in a market is given space, not welcome. They are tolerated, distrusted, and left alone, which is exactly how they prefer it.' }
  ],

  overview: {
    originStory: `The ranger Sylas tracked the invisible spoor of Wyrd-creatures through the Frostwood Reach by tuning his senses to the silent, sub-vocal vibrations of the pine needles and the damp earth. In a fog-shrouded valley, he stalked a conceptual entity for seven days, breathing only when the wind blew, training his eyes to trace the faint disturbances in the fog-memory.

To achieve this absolute sensory focus, Sylas paid with his own hearing, becoming completely deaf to the voices of his kin. The Apex lives in a silent, predatory world of scents and vibrations, unable to hear the warnings of allies or the screams of her prey. The forest is a map written in heat, odor, and kinetic tremors.

Draw the bow. Scent the spoor. The forest is silent, and you are its sharpest shadow. Strike before they know you are there.`,
    title: "The Apex",
    subtitle: "Shadow Glaive Wielder & Beast Companion",

    quickOverview: {
      title: "Quick Overview",
      content: `**What You Need to Know**: The Apex is an agile melee damage dealer who builds Quarry Marks through coordinated attacks with her beast companion — NOT from individual hits. Your glaive is deadly alone, but your true power comes from the pack.

**Core Mechanic**: Coordinate with companion → Generate Quarry Marks from companion synergy (coordinated strikes, companion commands, pack tactics) → Spend marks on companion buffs, glaive chain extensions, or ultimate abilities

**Resource**: Quarry Marks (0–5 scale, max +3 generated per turn, +4 for Beastmaster)

**Playstyle**: Hit-and-run tactical melee with deep companion synergy

**Best For**: Players who enjoy pet management, multi-target melee, and building power through teamwork between hunter and beast

---

**Your First Turn (Quickstart)**:
1. **Command** your companion to Attack a priority target (1 AP)
2. **Glaive Toss** at the same target (2 AP) — this is a Coordinated Strike
3. **Watch your Quarry Marks fill** — coordinated attacks with your companion generate +2 QM
4. **Spend marks** to extend chains, buff companion, or save for a devastating ultimate`,
    },

    description: `The Apex is a master of close-range combat who wields the legendary Shadow Glaive, a weapon capable of chaining deadly strikes between multiple enemies. Accompanied by a loyal beast companion, the Apex excels at hit-and-run tactics, weaving through enemy lines with deadly grace. Through the Quarry Marks system, she builds power through the bond with her companion — Quarry Marks represent pack coordination, not individual prowess. Glaive hits alone generate no marks; it is the synchronized rhythm of hunter and beast that fills the reservoir. This dynamic class rewards tactical positioning, companion management, and the synergy between hunter and beast.`,

    roleplayIdentity: {
      title: "Roleplay Identity",
      content: `**HISTORY: THE GENESIS**
The apex's stalker focus was forged in the ancient ironwood forests of the <LoreLink termId="frostwood-reach">Frostwood Reach</LoreLink>. A wood-ranger named **Sylas** tracked the invisible spoor of Wyrd-creatures, using the fog to mask his approach. The price of this perfect focus was a sensory numbness. Sylas became completely deaf to the voices of his kin, his mind permanently locked in the tracking of mist-spoor.

**CITIES & CIVIL RECEPTION**
Apexes are welcomed as essential guides and beast-slayers in every frontier keep, though they rarely speak or enter the civilian sectors.

**RACES & CULTURAL AFFILIATION**
The class is heavily practiced by the <LoreLink termId="mimir">Mist-Woven Mimir</LoreLink> and the Skald hunters.

**NOTABLE FIGURES**
* **Sylas the Silent**: The first ranger who tracked the invisible spoor of Wyrd-creatures through the Frostwood.
* **Maeve of the Canopy**: A Mist-Woven Mimir scout who guided the first Thalren refugees through the memory-erasing fog.`
    },

    signatureQuote: {
      text: '"The Wyrd-creature does not leave tracks in the snow. It leaves tracks in the memory of the snow. I do not hunt with my eyes. I hunt with my patience."',
      speaker: 'Sylas the Silent',
      context: 'Teaching his apprentice how to track a Gref through the fog'
    },

    philosophy: {
      coreTenet: 'Every creature leaves a mark on the world, whether it knows it or not. A footprint, a broken twig, a displaced scent, a tremor in the moss. The Apex reads these marks the way a scholar reads a book. The quarry cannot hide — they can only make the reading harder.',
      relationship: 'The Apex and her companion are not master and pet — they are partners. The bond is forged through shared hunts, shared kills, and shared survival. The companion does not obey; it anticipates. After years together, a Apex does not need to give commands — her companion knows what she needs before she knows it herself. This bond is sacred and irreplaceable. A Apex whose companion dies rarely takes another. The grief is too specific.',
      paradox: 'The Apex lives in a world of pure sensation — scents, vibrations, tiny visual cues — because she has deliberately sacrificed the world of human connection. Sylas went deaf to his kin so he could hear the forest. Every Apex since has made a similar trade: they give up something essential to their humanity in exchange for the ability to track the supernaturally untrackable. They are the greatest hunters in the world, and the loneliest.'
    },

    currentCrisis: `The mist is learning to hide. For centuries, Apexes have tracked Wyrd-creatures through the Frostwood Reach by reading the disturbances they leave in the fog — ripples of displaced vapor that betray their passage. But the fog is changing. It is becoming more static, less responsive, as if it is deliberately refusing to reveal the creatures moving through it.

Some Apexes believe the fog is responding to the increased activity of the Wyrd — that it is thickening to protect the incursions. Others believe something worse: the fog is not protecting them. It is hiding something else, something large, that has been moving through the Reach for months without leaving any trace. The old Apexes say the last time the fog went this still was the day before the first Gref appeared.`,

    meaningfulTradeoffs: `To be a Apex is to give up the world of words. The constant sensory tuning required to track Wyrd-creatures permanently alters the brain\'s auditory processing centers. Apexes gradually lose the ability to understand spoken language — not because their hearing fails, but because their brain no longer prioritizes human speech over environmental sound. They develop their own sign language, tactile gestures that can be felt through gloves. A pair of Apexes can hold a silent conversation through hand-pressure alone, but they cannot hear a friend say goodbye.`,

    classSpecificLocations: [
      {
        name: 'Sylas\'s Clearing',
        locationId: 'ironwood-heart',
        description: 'A small, moss-floored clearing deep in the Ironwood Heart where Sylas the Silent trained the first generation of Apexes. The trees around the clearing are carved with the hand-signs of every Apex who passed through — hundreds of symbols, each one unique, each one representing a graduate who went on to hunt the things that hide in the mist.',
        purpose: 'Training ground and memorial grove',
        status: 'Active — maintained by the Silent Sisterhood, a guild of Apexes who have lost all verbal speech'
      }
    ],

    combatRole: {
      title: "Combat Role",
      content: `**Primary Role**: Agile melee damage dealer with companion support

**Combat Strengths**:
- Exceptional multi-target damage through glaive chaining
- High mobility with Shadowstep and evasion abilities
- Companion provides additional damage, defense, or utility
- Strong burst damage when spending Quarry Marks
- Excellent at controlling enemy positioning

**Combat Weaknesses**:
- Requires enemies to be grouped for maximum glaive effectiveness
- Moderate armor (leather wearer)
- Companion can be targeted and killed
- Less effective at long range
- Dependent on Quarry Mark generation for peak performance (requires companion coordination, not just hits)

**Optimal Positioning**:
Apexes excel at close range (5-15 feet), positioning themselves to maximize glaive chains between grouped enemies. They should maintain mobility, using Shadowstep to reposition and avoid being surrounded while keeping their companion in effective range.`,
    },

    playstyle: {
      title: "Playstyle & Strategy",
      content: `**Quarry Mark Management**:
The key to mastering the Apex is generating and spending Quarry Marks efficiently. Marks are NOT generated by hitting enemies — they represent the bond between you and your companion. Generate marks through pack coordination:

- **1 Mark**: Enhance companion's next attack (+1d6 damage)
- **2 Marks**: Extend glaive chain by +1 target
- **3 Marks**: Companion special ability
- **5 Marks**: Specialization ultimate ability

**How Marks Are Generated** (Companion Synergy Only):
- **Coordinated Strike**: You AND your companion both attack the same target in one turn = +2 QM
- **Companion Lands a Hit**: +1 QM per companion attack that hits
- **Companion Takes Damage**: +1 QM (your bond flares with protective rage)
- **Companion Critical Hit**: +2 QM
- **You Hit Alone**: +0 QM — solo glaive hits generate NOTHING
- Turn Cap: MAX +3 QM per turn (+4 for Beastmaster)

**Companion Commands**:
Your companion is a crucial part of your combat effectiveness. Use commands wisely:
- **Attack**: When you need additional damage on priority targets
- **Defend**: When you or an ally needs protection (+2 DR)
- **Support**: For tactical advantages (buffs/debuffs)

**Glaive Positioning**:
Position yourself to maximize chain attacks. The Shadow Glaive chains to enemies within 5 feet of each other, so:
- Target enemies in tight groups
- Use mobility to position for optimal chains
- Coordinate with allies to group enemies (tanks, crowd control)

**Hit-and-Run Tactics**:
Don't stand still. Use Shadowstep and Evasion to:
- Strike quickly and reposition
- Avoid being surrounded
- Escape when focused
- Set up advantageous attack angles

**Team Dynamics**:
- Work with tanks to group enemies for glaive chains
- Coordinate companion attacks with team burst windows
- Use mobility to assist allies in trouble
- Mark priority targets for focused fire`,
    },

    immersiveCombatExample: {
      title: "Combat Example: The Shadow Glaive Dance",
      content: `**The Setup**: You're a Apex (Bladestorm specialization) with your wolf companion "Fang" facing a group of bandits (5 bandits in a tight formation). Your party is with you. Starting Quarry Marks: 2 (from previous encounter). Your goal: Use glaive chaining to hit multiple enemies, generate Quarry Marks through successful attacks, and coordinate with your companion for devastating combos.

**Starting State**: Quarry Marks: 2/5 | HP: 70/70 | Companion (Fang): 50/50 HP | Armor: 14

**Initiative**: Bandits 16, You 12, Fang acts on your turn (companion acts when commanded)

---

**Turn 1 — The Opening Chain (QM: 2 → 5)**

*Five bandits stand in a tight group, weapons drawn. You grip your Shadow Glaive—a crescent-bladed polearm that hums with dark energy. Fang growls beside you, ready to strike.*

**Bandit #5's Turn** (initiative 16): Charges toward you but is still 20ft away — no attack this turn.

**Your Turn** (initiative 12):
- **Action**: Shadow Glaive Attack on Bandit #1 (melee attack, chains to nearby enemies)
  - **Strike Roll**: 2d8 (glaive die) → [7, 6] + 4 (AGI) = **17 damage** to Bandit #1

*Your glaive strikes Bandit #1, and the blade GLOWS. Shadow energy arcs from the impact point, seeking nearby targets.*

- **Chain Mechanic**: Glaive chains to all enemies within 5 feet of primary target
  - **Enemies in Range**: Bandits #2, #3, #4 (all within 5 feet of Bandit #1)
  - **Chain Damage**: 1d8+4 to each chained target (Bladestorm spec: 1d6 minimum on chains)

  - **Chain Attack #1 (Bandit #2)**: 1d8+4 → [6] + 4 = **10 damage**
  - **Chain Attack #2 (Bandit #3)**: 1d8+4 → [7] + 4 = **11 damage**
  - **Chain Attack #3 (Bandit #4)**: 1d8+4 → [5] + 4 = **9 damage**

*The shadow energy EXPLODES outward, striking four bandits in one swing. They stagger, wounded.*

- **Total Damage**: 17 + 10 + 11 + 9 = **47 damage across 4 targets!**
- **Quarry Marks Generated**: +1 QM per enemy hit = +4 potential, but turn cap is +3
- **QM Calculation**: 2 + 3 = **5 QM** (cap reached, 1 mark lost to overflow)

- **Bonus Action**: Command Fang to Attack Bandit #1
  - **Fang Strike Roll**: 1d8 (companion die) → [6] + 3 = **9 damage**
  - **Result**: Bandit #1 takes 17 + 9 = 26 total damage — **DEAD**

*Fang leaps forward, jaws clamping down on Bandit #1's throat. The bandit falls.*

**End of Turn 1 — QM: 5/5 | 4 bandits remaining (all wounded)**

---

**Turn 2 — Extending the Chain (QM: 5 → 3 → 5)**

*The bandits regroup. Bandit #5 closes the distance and swings at you.*

**Bandit #5's Turn** (initiative 16):
- **Strike Roll**: 2d6 (bandit weapon) → [5, 4] + 3 = **12 damage**
- **Your HP**: 70 - 12 = **58/70**

**Your Turn** (initiative 12):
- **Quick Action** (0 AP): Spend 2 Quarry Marks to extend glaive chain by +1 target (can grab an enemy outside normal chain range)
  - **QM: 5 - 2 = 3**

*You focus your will. The Shadow Glaive pulses with darker energy. This next strike will chain further.*

- **Action**: Shadow Glaive Attack on Bandit #2
  - **Strike Roll**: 2d8 (glaive die) → [8, 7] + 4 (AGI) = **19 damage** to Bandit #2

- **Chain Mechanic**: Extended chain reaches Bandits #3, #4, and #5 (3 enemies within extended range)
  - **Chain Attack #1 (Bandit #3)**: 1d8+4 → [6] + 4 = **10 damage** → Bandit #3 **DEAD** (was already wounded)
  - **Chain Attack #2 (Bandit #4)**: 1d8+4 → [8] + 4 = **12 damage** → Bandit #4 **DEAD** (was already wounded)
  - **Chain Attack #3 (Bandit #5)**: 1d8+4 → [5] + 4 = **9 damage**

*The glaive chains to THREE enemies this time, killing two of them. Only Bandits #2 and #5 remain.*

- **QM Generated**: +3 from 3 enemies hit (turn cap). 3 + 3 = **5 QM** (cap reached)

- **Bonus Action**: Command Fang to Defend you (+2 DR for 1 round)
  - **Your Armor**: 14 + 2 = **16** until start of your next turn

*Fang positions himself protectively in front of you, snarling at the remaining bandits.*

**End of Turn 2 — QM: 5/5 | 2 bandits remaining | Your armor: 16**

---

**Turn 3 — Companion Empowerment (QM: 5 → 4 → 5)**

*Two bandits left. Bandit #2 is wounded (19 damage taken), Bandit #5 is wounded (9 damage taken). Time to finish this.*

**Bandit #2 Strike Roll** vs Fang → 1d6 → [1] → **Fumble!**

**Your Turn** (initiative 12):
- **Quick Action** (0 AP): Spend 1 Quarry Mark to enhance Fang's next attack (+1d6 damage)
  - **QM: 5 - 1 = 4**

- **Bonus Action**: Command Fang to Attack Bandit #2
  - **Fang Strike Roll**: 1d8 (companion die) → [7] + 3 = **10 damage**
  - **Result**: Bandit #2 **DEAD**

*Fang's jaws glow with shadow energy as he tears into Bandit #2. The bandit falls.*

- **Action**: Shadow Glaive Attack on Bandit #5 (last enemy)
  - **Strike Roll**: 2d8 (glaive die) → [8, 6] + 4 (AGI) = **18 damage** to Bandit #5
  - **Result**: Bandit #5 **DEAD**

*Your glaive sweeps through the last bandit. He falls. Combat over.*

- **QM Generated**: +1 (Fang hit, within turn cap). 4 + 1 = **5 QM** (banked for next fight — decay begins in 1 minute)

---

**Combat Over**

*You stand among five corpses, your Shadow Glaive still humming with dark energy. Fang sits beside you, blood on his muzzle. Your party stares.*

**Your Party's Mage**: "You... you killed four of them in one swing."
**You**: "Shadow Glaive chains to nearby enemies. The closer they stand, the more they die together."
**Your Party's Tank**: "And your wolf just... knew when to defend you?"
**You**: "Fang and I share an empathic bond. I command, he obeys. But we fight as one."
**Fang**: *Growls in agreement*

**Final State**: QM: 5/5 (banked, decay in 1 min) | HP: 58/70 | Fang: 50/50 HP

**The Lesson**: Apex gameplay is about:
1. **Glaive Chaining**: Hit 1 primary target, chain to 3 nearby enemies = 4 hits in one attack (47 damage total in Turn 1)
2. **Quarry Mark Management**: +1 QM per enemy hit (including chains), capped at +3 per turn (+4 for Beastmaster). Overflow marks are lost.
3. **Quarry Mark Spending**: Spent 2 QM to extend chain by +1 target (Turn 2), spent 1 QM to enhance Fang's attack (Turn 3)
4. **Companion Commands**: Commanded Fang to Attack (Turn 1, 3) and Defend (Turn 2). Companion commands cost 1 AP.
5. **Positioning**: Enemies grouped together = maximum chain effectiveness
6. **Burst Damage**: Turn 1 dealt 47 damage across 4 targets, Turn 2 dealt 50 damage across 4 targets (killed 2)
7. **Resource Banking**: Ended with 5 QM banked. Marks decay by 1/minute after a 1-minute grace period — rush to the next fight!
8. **AP Economy**: Each turn you have 3 AP. Glaive attack costs 2 AP, companion command costs 1 AP. Quarry Mark effects are free to activate.

You're not a single-target damage dealer. You're a CHAIN ATTACKER. When enemies group up, your Shadow Glaive becomes a weapon of mass destruction. One swing, four hits. And with Quarry Marks, you can extend chains even further, empower your companion, or unleash ultimate abilities. The key is positioning—get enemies close together, then watch the shadow energy arc between them. And Fang isn't just a pet—he's a tactical asset. Attack when you need damage, Defend when you need protection. Together, you're unstoppable.`,
    },
  },

  // Resource System
  resourceSystem: {
    title: "Quarry Marks (QM)",
    subtitle: "The Rhythm of the Hunt",

    description: `The Apex is a master of focus and coordination. Your core resource is **Quarry Marks** (0-5), silver-blue moonlight energy built through the bond between you and your beast companion. Solo glaive hits generate NOTHING — Quarry Marks are earned through pack coordination, not individual prowess. While your Shadow Glaive clears the field, your Quarry Marks are what turn your loyal companion from a pet into a lethal extension of your own will.`,

    cards: [
      {
        title: "Quarry Marks (0-5)",
        stats: "Cap: 5 Marks",
        details:
          "Build marks through companion synergy — coordinated strikes, companion hits, and pack tactics. Solo glaive hits generate NO marks.",
      },
      {
        title: "The Shadow Bond",
        stats: "Telepathic Link",
        details:
          "You and your companion share a resource pool. Marks generated by one can be spent by the other.",
      },
      {
        title: "Tactical Chain",
        stats: "2 QM Cost",
        details:
          "Spend 2 QM to force your glaive to chain to ONE additional target, even if they are out of range.",
      },
    ],

    generationTable: {
      headers: ["Event", "QM Gained", "Notes"],
      rows: [
        ["Coordinated Strike (you + companion hit same target same turn)", "+2 QM", "The heart of the pack — hunt together or not at all"],
        ["Companion Lands a Hit", "+1 QM", "Your beast's strikes resonate through the bond"],
        ["Companion Takes Damage", "+1 QM", "Protective rage surges through the link"],
        ["Companion Critical Hit", "+2 QM", "The bond flares with predatory fury"],
        ["Mark Quarry Ability", "+1 QM", "Special ability to mark without attacking"],
        ["Glaive Hit (Solo, no companion)", "+0 QM", "Solo hits generate NOTHING — you need the pack"],
        ["Turn Cap", "MAX +3", "You cannot generate more than 3 QM per turn"],
        [
          "Beastmaster Cap",
          "MAX +4",
          "Beastmaster specialization increases turn cap to +4",
        ],
        [
          "Overflow",
          "Lost",
          "Any marks generated beyond the turn cap are lost (they do not bank)",
        ],
        [
          "Mark Decay",
          "-1/min",
          "Outside combat, marks decay by 1 per minute after a 1-minute grace period",
        ],
        [
          "Companion Dead",
          "+0 QM",
          "If your companion is dead, you cannot generate ANY Quarry Marks until revived",
        ],
      ],
    },

    usage: {
      momentum:
        'Start by commanding your companion to "Attack" a target while you use "Glaive Toss" at the SAME target. This Coordinated Strike generates +2 QM immediately. Build your 3-mark "Companion Special" by turn two through pack coordination.',
      flourish:
        "⚠️ The Over-Hunt: If you hit 5 QM, don't sit on them. You generate marks so fast that any unspent marks are effectively wasted power. ⚠️ WITHOUT YOUR COMPANION: You generate ZERO marks. Keep your beast alive at all costs.",
    },

    overheatRules: {
      title: "Primal Outrage",
      content: `If you begin your turn with 5 Quarry Marks and generate additional marks (through overflow), or if your companion drops below 25% HP while you have 3+ Quarry Marks, your beast enters a **Primal Outrage**.

**The Effect**: For the next 2 turns, your companion deals **Double Damage** but becomes **Frenzied**. A frenzied beast will move toward and attack the NEAREST creature at the start of its turn, regardless of affiliation. You must spend an Action (Command) to snap it out of the frenzy early.`,
    },

    strategicConsiderations: {
      title: "The Hunting Party",
      content: `**Beastmaster Spec**: Your turn cap for QM generation is increased from +3 to +4, allowing you to cycle through Companion Specials every single turn. Your companion also gains independent initiative.

**The Companion Dependency**: If your companion dies, you lose ALL ability to generate Quarry Marks until it is revived. This is your greatest vulnerability.

**Quarry Mark Decay**: Your Quarry Marks decay by 1 at the end of each round your companion takes damage. A wounded companion cannot maintain the pack coordination needed for marks. PROTECT YOUR PET or lose your fuel.

**Bond Sickness (Enhanced)**: When your companion drops to 0 HP, you suffer Bond Sickness for 3 rounds (not 2): roll 1d6 on the Bond Sickness table each round:
| d6 | Effect |
|---|---|
| 1-2 | **Grief Strike** — Your next attack this round has disadvantage as your hands shake with loss. |
| 3-4 | **Phantom Pain** — Take 1d6 wyrd damage. The bond hurts even broken. |
| 5 | **Rage** — Your next attack deals +1d6 extra damage. The fury is real. |
| 6 | **Cold Focus** — You gain advantage on your next attack. The hunter channels grief into precision. |

**Banking**: Since marks persist between fights, always try to "finish" an encounter by building back up to 5 QM so you can open the next fight with an Ultimate.

**Mark Decay**: Quarry Marks decay by 1 per minute outside of combat. You retain your marks for 1 full minute after combat ends before they begin fading. This rewards aggressive, back-to-back encounters without guaranteeing every fight opens at maximum power.`,
    },

    playingInPerson: {
      title: "Playing in Person",
      subtitle: "The Hunting Trophy",
      content: `The Apex thrives when the player feels the "Build and Release" rhythm of the marks.

**Required Materials**:
- **5 Silver/Blue Tokens**: (Representing Quarry Marks).
- **Companion Miniature**: (Essential for tracking chain distances).
- **A Trophy Bowl**: (For the physical hack).

**The Physical Hack (Friction Points)**:
- **The Hunting Trophy**: When you kill an enemy that was "Marked" (had at least 1 QM spent on them), move 1 token from your spend pile into a separate **Trophy Bowl**. During a Short Rest, each token in the bowl can be "consumed" to grant 1d4 temporary HP to your companion.
- **The Chain Thread**: Use a piece of silver string or a pipe cleaner to physically connect your mini to the enemies hit by your Glaive Chain. It helps everyone see who is currently being "hunted."
- **Empathic Distress**: If your companion drops below 25% HP, flip your character sheet over or place it at an angle. It signals your character's emotional distraction to the table.

**Pro Tip**: Use a d6 to track QM on your companion's mini directly. It keeps the information where the action is happening.`,
    },
  },

  // Specializations
  specializations: {
    title: "Apex Specializations",
    subtitle: "Three Paths of the Hunt",

    description: `Every Apex chooses one of three specializations that define their combat style. Each specialization emphasizes different aspects of glaive combat, companion synergy, or stealth and mobility, offering unique passive abilities and playstyles.`,

    sharedPassive: null,

    specs: [
      { id : "bladestorm",
        name: "Bladestorm",
        icon: "Piercing/Dagger Rain",
        color: "#DC143C",
        theme: "Multi-Target Devastation",

        description: `The Bladestorm specialization focuses on maximizing the Shadow Glaive's chain attack potential. These Apexes are masters of positioning and timing, able to strike multiple enemies in a single fluid motion. They excel in situations where enemies are grouped together, turning their glaive into a whirlwind of death.`,

        playstyle:
          "Aggressive multi-target damage dealer, positioning for maximum chain attacks and area control",

        strengths: [
          "Highest multi-target damage among Apex specs",
          "Can chain to 5 targets instead of 4 (with passive)",
          "Momentum-based damage scaling",
          "Excellent against grouped enemies",
        ],

        weaknesses: [
          "Less effective against spread-out enemies",
          "Lower single-target damage than Shadowblade",
          "Requires careful positioning",
          "Companion plays secondary role",
        ],

        passiveAbilities: [
          {
            name: "Whirling Blades",
            icon: "Slashing/Quick Slash",
            description:
              "Your Shadow Glaive can chain to +1 additional target (total of 5 targets: 1d8 → 1d6 → 1d6 → 1d6 → 1d6). This does not cost Quarry Marks. Chain damage floor is raised to 1d6 at all levels.",
          },
          {
            name: "Momentum",
            icon: "Utility/Empowered Warrior",
            description:
              "Each successful chain attack grants you +1 to your next attack roll. This bonus stacks up to +3 and resets if you miss an attack.",
          },
        ],

        recommendedSpells: [
          "Glaive Toss - Your bread-and-butter chain attack",
          "Whirling Death - Spin attack for maximum AoE",
          "Blade Fury - Ultimate ability for massive multi-target burst",
          "Swift Assault - Rapid strikes to build Momentum",
        ],
      },
      { id : "beastmaster",
        name: "Beastmaster",
        icon: "Nature/Spawn",
        color: "#228B22",
        theme: "Companion Synergy",

        description: `The Beastmaster specialization deepens the bond between Apex and companion, creating a fighting duo that operates as a single deadly unit. These Apexes coordinate their attacks perfectly with their beasts, overwhelming enemies through synchronized strikes and tactical positioning.`,

        playstyle:
          "Coordinated attacks with companion, tactical positioning for Pack Tactics, balanced damage distribution",

        strengths: [
          "Strongest companion damage and utility",
          "Pack Tactics provides consistent advantage",
          "Companion has enhanced survivability",
          "Excellent single-target focus fire",
        ],

        weaknesses: [
          "Heavily reliant on companion staying alive",
          "Lower personal damage than other specs",
          "Requires positioning both Apex and companion",
          "Vulnerable if companion is killed",
        ],

        passiveAbilities: [
          {
            name: "Alpha Bond",
            icon: "Nature/Claw Marks",
            description:
              "Your companion deals +1d6 damage on all attacks. Your companion's maximum HP is increased by +10, and your companion gains its own initiative (acts independently at the start of its turn).",
          },
          {
            name: "Pack Tactics",
            icon: "Nature/Sense",
            description:
              "When you and your companion attack the same target, both of you gain advantage on attack rolls against that target until the end of your turn. Additionally, your companion's attacks generate Quarry Marks as if they were your glaive attacks.",
          },
        ],

        recommendedSpells: [
          "Companion Strike - Enhanced companion attack",
          "Coordinated Assault - Simultaneous attacks with advantage",
          "Primal Rage - Companion ultimate ability",
          "Mark Quarry - Build marks for companion empowerment",
        ],
      },
      { id : "shadowblade",
        name: "Shadowblade",
        icon: "Utility/Phantom Dash",
        color: "#4B0082",
        theme: "Stealth & Lethality",

        description: `The Shadowblade specialization embraces the shadows, using stealth and mobility to strike from unexpected angles. These Apexes are assassins who blend hit-and-run tactics with devastating burst damage, appearing from nowhere to eliminate priority targets before vanishing back into darkness.`,

        playstyle:
          "High mobility assassin, stealth attacks, burst damage, hit-and-run tactics",

        strengths: [
          "Highest single-target burst damage",
          "Exceptional mobility with enhanced Shadowstep",
          "Stealth attacks deal massive damage",
          "Superior survivability through evasion",
        ],

        weaknesses: [
          "Lower sustained damage than Bladestorm",
          "Requires stealth setup for maximum damage",
          "Less effective in prolonged fights",
          "Companion plays support role",
        ],

        passiveAbilities: [
          {
            name: "Shadow Veil",
            icon: "Utility/Hide",
            description:
              "After using Shadowstep, you gain +2 DR and advantage on Stealth checks for 1 round. You can hide for 1 AP during this time.",
          },
          {
            name: "Lethal Precision",
            icon: "Poison/Poison Concoction",
            description:
              "Attacks made from stealth or immediately after using Shadowstep deal an additional 2d6 damage. Additionally, your glaive chain damage becomes blight instead of slashing, and chained enemies cannot see you until the start of their next turn (Shadow Chain).",
          },
        ],

        recommendedSpells: [
          "Shadowstep - Core mobility and damage amplifier",
          "Shadow Strike - Massive stealth attack",
          "Phantom Blades - Ultimate multi-attack ability",
          "Evasion - Defensive survival tool",
        ],
      },
    ],
  },

  // Example Abilities - showcasing Shadow Glaive and Companion mechanics
  exampleSpells: [
    // BLADESTORM - Multi-Target Glaive Attacks
    {
      effectTypes: ["damage"],
      id : "apex_glaive_toss",
      name: "Glaive Toss",
      description:
        "Throw your Shadow Glaive at a target, chaining to additional enemies within 5 feet of each other.",
      spellType: "ACTION",
      icon: "Piercing/Dagger Rain",
      level: 1,
      specialization: "bladestorm",

      typeConfig: {
        castTime: 1,
        castTimeType: "IMMEDIATE",
        school: "physical",
        icon: "Piercing/Dagger Rain",
      },

      targetingConfig: {
        targetingType: "chain",
        rangeType: "ranged",
        rangeDistance: 30,
        chainDistance: 5,
        maxChains: 4,
      },

      propagation: {
        type: "chain",
        maxTargets: 4,
        chainDistance: 5,
        damageDecay: 0.5,
      },

      durationConfig: {
        durationType: "instant",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 4 },
        actionPoints: 1,
        components: ["somatic"],
        somaticText: "Throw glaive in spinning arc",
        classResource: { type: "quarry_marks", gain: 1 },
      },

      resolution: "DICE",

      damageConfig: {
        formula: "1d8",
        elementType: "physical",
        damageTypes: ["physical"],
        scalingType: "chain_reduction",
      },

      effects: {
        damage: {
          chain: {
            primary: "1d8",
            second: "1d6",
            third: "1d6",
            fourth: "1d4",
            type: "physical",
            chainDistance: 5,
            scalingNote:
              "Chain minimum damage increases with level: L1-4 as listed, L5-7 minimum 1d6 on all chains, L8-10 minimum 1d8 on all chains",
          },
        },
      },

      specialMechanics: {
        quarryMarks: {
          generated: 1,
          perHit: true,
          description: "Generate 1 Quarry Mark for each enemy hit",
        },
        chainMechanic: {
          description: "Chains to enemies within 5 feet of previous target",
          maxTargets: 4,
          damageReduction:
            "Chain damage: 1d8 (primary) → 1d6 → 1d6 → 1d4. At L5+, all chains deal at least 1d6. At L8+, all chains deal at least 1d8.",
        },
        bladestormPassive: {
          description:
            "Bladestorm spec can chain to 5 targets (adds 1d6 fifth target)",
        },
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
      tags: ["physical", "damage", "chain", "multi target", "bladestorm"],
    },

    {
      effectTypes: ["damage"],
      id : "apex_whirling_death",
      name: "Whirling Death",
      description:
        "Spin your Shadow Glaive in a deadly circle, striking all enemies within 10 feet.",
      spellType: "ACTION",
      icon: "Slashing/Quick Slash",
      level: 3,
      specialization: "bladestorm",

      typeConfig: {
        castTime: 1,
        castTimeType: "IMMEDIATE",
        school: "physical",
        icon: "Slashing/Quick Slash",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "self",
        areaType: "circle",
        areaSize: 10,
      },

      durationConfig: {
        durationType: "instant",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 10 },
        actionPoints: 1,
        components: ["somatic"],
        somaticText: "Spin in place with glaive extended",
        classResource: { type: "quarry_marks", cost: 2 },
      },

      resolution: "DICE",

      damageConfig: {
        formula: "2d8",
        elementType: "physical",
        damageTypes: ["physical"],
        scalingType: "none",
      },

      specialMechanics: {
        quarryMarks: {
          cost: 2,
          generated: 1,
          perHit: true,
          description:
            "Costs 2 marks to use, but generates 1 mark per enemy hit",
        },
        momentum: {
          description:
            "Each enemy hit grants +1 Momentum (Bladestorm passive), stacking up to +3",
        },
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },
      tags: ["physical", "damage", "aoe", "spin", "bladestorm"],
    },

    {
      effectTypes: ["damage"],
      id : "apex_blade_fury",
      name: "Blade Fury",
      description:
        "Unleash a devastating flurry of glaive strikes, hitting multiple targets in rapid succession.",
      spellType: "ACTION",
      icon: "Slashing/Whirl",
      level: 5,
      specialization: "bladestorm",

      typeConfig: {
        castTime: 1,
        castTimeType: "IMMEDIATE",
        school: "physical",
        icon: "Slashing/Whirl",
      },

      targetingConfig: {
        targetingType: "multi",
        rangeType: "melee",
        rangeDistance: 15,
        maxTargets: 5,
      },

      propagation: { type: "multi", maxTargets: 5 },

      durationConfig: {
        durationType: "instant",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 18 },
        actionPoints: 1,
        components: ["somatic"],
        somaticText: "Rapid spinning strikes with glaive",
        classResource: { type: "quarry_marks", cost: 5 },
      },

      resolution: "DICE",

      damageConfig: {
        formula: "3d8",
        elementType: "physical",
        damageTypes: ["physical"],
        scalingType: "none",
      },

      effects: {
        damage: {
          multiTarget: {
            formula: "3d8",
            type: "physical",
            targets: 5,
            description: "Each target takes full damage",
          },
        },
      },

      specialMechanics: {
        quarryMarks: {
          cost: 5,
          description: "Ultimate ability - costs all 5 Quarry Marks",
        },
        momentum: {
          description: "Grants maximum Momentum (+3) after use",
        },
        bladestormUltimate: {
          description: "Bladestorm specialization ultimate ability",
          additionalEffect: "Gain +2 DR until end of next turn",
        },
      },

      cooldownConfig: { cooldownType: "encounter", cooldownValue: 1 },
      tags: ["physical", "damage", "multi target", "ultimate", "bladestorm"],
    },

    // BEASTMASTER - Companion Synergy
    {
      effectTypes: ["damage"],
      id : "apex_companion_strike",
      name: "Companion Strike",
      description:
        "Command your companion to attack a target with enhanced ferocity.",
      spellType: "ACTION",
      icon: "Nature/Spawn",
      level: 1,
      specialization: "beastmaster",

      typeConfig: {
        castTime: 1,
        castTimeType: "IMMEDIATE",
        school: "physical",
        icon: "Nature/Spawn",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "companion",
        rangeDistance: 30,
      },

      durationConfig: {
        durationType: "instant",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 3 },
        actionPoints: 1,
        components: ["verbal"],
        verbalText: "Attack command to companion",
        classResource: { type: "quarry_marks", gain: 1 },
      },

      resolution: "DICE",

      damageConfig: {
        elementType: "physical",
        formula: "1d8",
        damageTypes: ["physical"],
        scalingType: "proficiency",
      },

      effects: {
        damage: {
          companion: {
            formula: "1d8 + proficiency bonus",
            type: "physical",
            source: "companion",
          },
        },
      },

      specialMechanics: {
        quarryMarks: {
          generated: 1,
          description: "Generate 1 Quarry Mark on hit",
        },
        companionCommand: {
          type: "attack",
          description: "Basic companion attack command",
        },
        beastmasterPassive: {
          description:
            "Beastmaster spec adds +1d4 damage (Primal Bond passive)",
        },
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
      tags: ["physical", "damage", "companion", "command", "beastmaster"],
    },

    {
      effectTypes: ["damage"],
      id : "apex_coordinated_assault",
      name: "Coordinated Assault",
      description:
        "You and your companion attack the same target simultaneously, overwhelming them with coordinated strikes.",
      spellType: "ACTION",
      icon: "Nature/Claw Marks",
      level: 3,
      specialization: "beastmaster",

      typeConfig: {
        castTime: 1,
        castTimeType: "IMMEDIATE",
        school: "physical",
        icon: "Nature/Claw Marks",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "melee",
        rangeDistance: 15,
      },

      durationConfig: {
        durationType: "instant",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 10 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Attack command",
        somaticText: "Point at target",
        classResource: { type: "quarry_marks", cost: 2 },
      },

      resolution: "DICE",

      damageConfig: {
        elementType: "physical",
        formula: "2d8",
        damageTypes: ["physical"],
        scalingType: "none",
      },

      effects: {
        damage: {
          apex: {
            formula: "2d8",
            type: "physical",
            advantage: true,
          },
          companion: {
            formula: "1d8 + proficiency",
            type: "physical",
            advantage: true,
          },
        },
      },

      specialMechanics: {
        quarryMarks: {
          cost: 2,
          generated: 2,
          description: "Costs 2 marks, generates 2 marks (1 per hit)",
        },
        packTactics: {
          description: "Both attacks have advantage (Pack Tactics passive)",
          requirement: "Beastmaster specialization",
        },
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },
      tags: ["physical", "damage", "companion", "coordinated", "beastmaster"],
    },

    {
      effectTypes: ["buff"],
      id : "apex_primal_rage",
      name: "Primal Rage",
      description:
        "Your companion enters a primal rage, gaining enhanced stats and attacking with savage fury.",
      spellType: "ACTION",
      icon: "Nature/Sense",
      level: 5,
      specialization: "beastmaster",

      typeConfig: {
        castTime: 1,
        castTimeType: "IMMEDIATE",
        school: "physical",
        icon: "Nature/Sense",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "companion",
      },

      durationConfig: {
        durationType: "rounds",
        duration: 3,
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 18 },
        actionPoints: 1,
        components: ["verbal"],
        verbalText: "Primal command to companion",
        classResource: { type: "quarry_marks", cost: 5 },
      },

      resolution: "AUTOMATIC",

      buffConfig: {
        effects: [
          { id : "companion_gains_2_to_attack_rolls",
            name: "Companion gains +2 to attack rolls",
            description: "Companion gains +2 to attack rolls",
            mechanicsText: "Companion gains +2 to attack rolls",
          },
          { id : "companion_deals_2d6_damage_on_all_a",
            name: "Companion deals +2d6 damage on all attacks",
            description: "Companion deals +2d6 damage on all attacks",
            mechanicsText: "Companion deals +2d6 damage on all attacks",
          },
          { id : "companion_gains_4_armor",
            name: "Companion gains +4 DR",
            description: "Companion gains +4 DR",
            mechanicsText: "Companion gains +4 DR",
          },
          { id : "companion_has_advantage_on_all_atta",
            name: "Companion has advantage on all attacks",
            description: "Companion has advantage on all attacks",
            mechanicsText: "Companion has advantage on all attacks",
          },
          { id : "duration_3_rounds",
            name: "Duration: 3 rounds",
            description: "Duration: 3 rounds",
            mechanicsText: "Duration: 3 rounds",
          },
        ],
      },

      effects: {
        buff: {
          target: "companion",
          duration: 3,
          attackBonus: 2,
          damageBonus: "2d6",
          acBonus: 4,
          advantage: true,
        },
      },

      specialMechanics: {
        quarryMarks: {
          cost: 5,
          description: "Ultimate ability - costs all 5 Quarry Marks",
        },
        beastmasterUltimate: {
          description: "Beastmaster specialization ultimate ability",
          companionRage: "Companion becomes a devastating force for 3 rounds",
        },
      },

      cooldownConfig: { cooldownType: "encounter", cooldownValue: 1 },
      tags: ["buff", "companion", "ultimate", "beastmaster"],
    },

    // SHADOWDANCER - Stealth & Mobility
    {
      effectTypes: ["utility", "buff"],
      id : "apex_shadowstep",
      name: "Shadowstep",
      description:
        "Teleport through shadows to a nearby location, gaining advantage on your next attack.",
      spellType: "ACTION",
      icon: "Utility/Phantom Dash",
      level: 1,
      specialization: "shadowblade",

      typeConfig: {
        castTime: 1,
        castTimeType: "IMMEDIATE",
        school: "blight",
        icon: "Utility/Phantom Dash",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "teleport",
        rangeDistance: 30,
      },

      durationConfig: {
        durationType: "instant",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 4 },
        actionPoints: 1,
        components: ["somatic"],
        somaticText: "Step into shadows",
        classResource: { type: "quarry_marks", gain: 1 },
      },

      resolution: "AUTOMATIC",

      utilityConfig: {
        utilityType: "teleportation",
        selectedEffects: [
          {
            id: "shadowstep_teleport",
            name: "Shadowstep Teleport",
            description: "Teleport through shadows to a nearby location up to 30 feet.",
          },
        ],
        duration: 0,
        durationUnit: "instant",
        concentration: false,
        power: "minor",
      },

      buffConfig: {
        buffType: "combatAdvantage",
        effects: [
          {
            id: "shadowstep_advantage",
            name: "Shadowstep Advantage",
            description: "Advantage on your next attack after Shadowstep.",
          },
        ],
        durationType: "rounds",
        durationValue: 1,
        durationUnit: "rounds",
        concentrationRequired: false,
        canBeDispelled: true,
      },

      effects: {
        utility: {
          teleport: {
            distance: 30,
            unit: "feet",
          },
          buff: {
            nextAttack: "advantage",
            duration: "1 attack",
          },
        },
      },

      specialMechanics: {
        shadowbladePassive: {
          description:
            "Shadowblade spec gains +2 DR and advantage on Stealth for 1 round (Shadow Veil passive)",
          additionalEffect: "Can hide for 1 AP after Shadowstep",
        },
        lethalPrecision: {
          description:
            "Next attack after Shadowstep deals +2d6 damage (Lethal Precision passive)",
        },
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
      tags: ["utility", "teleport", "mobility", "shadowblade"],
    },

    {
      effectTypes: ["damage"],
      id : "apex_shadow_strike",
      name: "Shadow Strike",
      description:
        "Strike from the shadows with devastating force, dealing 3d8 physical damage to an unsuspecting target. When delivered from stealth or immediately after Shadowstep, the blade drinks an additional 1d6 blight damage.",
      spellType: "ACTION",
      icon: "Poison/Poison Concoction",
      level: 3,
      specialization: "shadowblade",

      typeConfig: {
        secondaryElement: "physical",
        castTime: 1,
        castTimeType: "IMMEDIATE",
        school: "blight",
        icon: "Poison/Poison Concoction",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "melee",
        rangeDistance: 10,
      },

      durationConfig: {
        durationType: "instant",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 10 },
        actionPoints: 1,
        components: ["somatic"],
        somaticText: "Strike from stealth",
        classResource: { type: "quarry_marks", cost: 3 },
      },

      resolution: "DICE",

      damageConfig: {
        formula: "3d8",
        elementType: "physical",
        damageTypes: ["physical"],
        scalingType: "none",
      },

      effects: {
        damage: {
          base: {
            formula: "3d8",
            type: "physical",
            advantage: "if_stealthed",
          },
          bonus: {
            formula: "1d6",
            type: "blight",
            condition: "From stealth or after Shadowstep",
          },
        },
      },

      specialMechanics: {
        quarryMarks: {
          cost: 3,
          generated: 2,
          description:
            "Costs 3 marks, generates 2 on hit (1 base + 1 for crit potential)",
        },
        stealthRequirement: {
          description:
            "Deals maximum damage when used from stealth or after Shadowstep",
          bonusDamage: "+1d6 from Lethal Precision passive",
        },
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
      tags: ["physical", "blight", "damage", "stealth", "burst", "shadowblade"],
    },

    {
      effectTypes: ["damage"],
      id : "apex_phantom_blades",
      name: "Phantom Blades",
      description:
        "Create shadow copies of your glaive that strike multiple targets simultaneously.",
      spellType: "ACTION",
      icon: "Piercing/Night Dagger",
      level: 5,
      specialization: "shadowblade",

      typeConfig: {
        castTime: 1,
        castTimeType: "IMMEDIATE",
        school: "blight",
        icon: "Piercing/Night Dagger",
      },

      targetingConfig: {
        targetingType: "multi",
        rangeType: "ranged",
        rangeDistance: 30,
        maxTargets: 4,
      },

      propagation: { type: "multi", maxTargets: 4 },

      durationConfig: {
        durationType: "instant",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 18 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Umbra multiplicare!",
        somaticText: "Throw glaive while creating shadow copies",
        classResource: { type: "quarry_marks", cost: 5 },
      },

      resolution: "DICE",

      damageConfig: {
        elementType: "blight",
        formula: "3d8",
        damageTypes: ["blight"],
        scalingType: "none",
      },

      effects: {
        damage: {
          multiTarget: {
            formula: "3d8",
            type: "blight",
            targets: 4,
            description: "Each phantom blade strikes a different target",
          },
        },
      },

      specialMechanics: {
        quarryMarks: {
          cost: 5,
          description: "Ultimate ability - costs all 5 Quarry Marks",
        },
        shadowbladeUltimate: {
          description: "Shadowblade specialization ultimate ability",
          phantomBlades: "Creates 4 shadow copies that strike independently",
        },
        afterEffect: {
          description:
            "After using Phantom Blades, you can Shadowstep for 1 AP for free",
        },
      },

      cooldownConfig: { cooldownType: "encounter", cooldownValue: 1 },
      tags: ["blight", "damage", "multi target", "ultimate", "shadowblade"],
    },

    // UNIVERSAL ABILITIES - All Apexes
    {
      effectTypes: ["damage", "debuff"],
      id : "apex_moonlit_strike",
      name: "Moonlit Strike",
      description:
        "Empower your Shadow Glaive with lunar energy, dealing enhanced damage and potentially blinding your target.",
      spellType: "ACTION",
      icon: "Arcane/Star Trail Path",
      level: 2,
      specialization: "universal",

      typeConfig: {
        castTime: 1,
        castTimeType: "IMMEDIATE",
        school: "ember",
        icon: "Arcane/Star Trail Path",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "melee",
        rangeDistance: 10,
      },

      durationConfig: {
        durationType: "instant",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 7 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Luna fortis!",
        somaticText: "Glaive glows with moonlight",
        classResource: { type: "quarry_marks", gain: 1 },
      },

      resolution: "DICE",

      damageConfig: {
        elementType: "ember",
        formula: "2d6",
        damageTypes: ["ember"],
        scalingType: "none",
      },

      savingThrow: {
        ability: "constitution",
        dc: 14,
        onSave: "not_blinded",
      },

      debuffConfig: {
        debuffType: "statusEffect",
        durationValue: 1,
        durationType: "rounds",
        durationUnit: "rounds",
        saveDC: 14,
        saveType: "constitution",
        saveOutcome: "negates",
        effects: [
          { id : "blinded",
            name: "Blinded",
            description:
              "Blinded creatures have disadvantage on attack rolls - cannot see, automatically fails sight-based checks",
            statusType: "blinded",
            level: "moderate",
            statPenalty: [
              { stat: "attack", value: -99, magnitudeType: "disadvantage" },
              { stat: "perception", value: -99, magnitudeType: "auto_fail" },
            ],
            mechanicsText:
              "Disadvantage on attack rolls, auto-fail sight-based checks",
          },
        ],
      },

      effects: {
        damage: {
          base: {
            formula: "2d6",
            type: "ember",
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
        quarryMarks: {
          generated: 1,
          description: "Generate 1 Quarry Mark on hit",
        },
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },
      tags: ["ember", "damage", "debuff", "blind", "universal"],
    },

    {
      effectTypes: ["buff"],
      id : "apex_evasion",
      name: "Evasion",
      description:
        "Use your agility to avoid incoming attacks, increasing your defenses.",
      spellType: "REACTION",
      icon: "Utility/Parry",
      level: 2,
      specialization: "universal",

      typeConfig: {
        castTime: 1,
        castTimeType: "REACTION",
        trigger: "When you are targeted by an attack",
        school: "physical",
        icon: "Utility/Parry",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },

      durationConfig: {
        durationType: "rounds",
        duration: 1,
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 5 },
        actionPoints: 0,
        components: ["somatic"],
        somaticText: "Dodge and weave",
      },

      resolution: "AUTOMATIC",

      buffConfig: {
        effects: [
          { id : "gain_advantage_on_dexterity_saving_",
            name: "Gain advantage on Dexterity saving throws",
            description: "Gain advantage on Dexterity saving throws",
            mechanicsText: "Gain advantage on Dexterity saving throws",
          },
          { id : "gain_2_armor",
            name: "Gain +2 DR",
            description: "Gain +2 DR",
            mechanicsText: "Gain +2 DR",
          },
          { id : "duration_until_start_of_your_next_t",
            name: "Duration: Until start of your next turn",
            description: "Duration: Until start of your next turn",
            mechanicsText: "Duration: Until start of your next turn",
          },
        ],
      },

      effects: {
        buff: {
          acBonus: 2,
          savingThrowAdvantage: "agility",
          duration: 1,
        },
      },

      specialMechanics: {
        reaction: {
          trigger: "When targeted by attack or required to make Dex save",
          timing: "Before attack roll or saving throw",
        },
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },
      tags: ["buff", "defense", "reaction", "universal"],
    },

    {
      effectTypes: ["utility"],
      id : "apex_mark_quarry",
      name: "Mark Quarry",
      description:
        "Focus your hunter's instinct on a target, marking them as your quarry.",
      spellType: "ACTION",
      icon: "Piercing/Targeted Strike",
      level: 1,
      specialization: "universal",

      typeConfig: {
        castTime: 1,
        castTimeType: "IMMEDIATE",
        school: "physical",
        icon: "Piercing/Targeted Strike",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
      },

      durationConfig: {
        durationType: "minutes",
        duration: 10,
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 3 },
        actionPoints: 1,
        components: ["verbal"],
        verbalText: "Mark target as quarry",
        classResource: { type: "quarry_marks", gain: 1 },
      },

      resolution: "AUTOMATIC",

      utilityConfig: {
        utilityType: "special",
        selectedEffects: [
          {
            id: "mark_quarry",
            name: "Mark Quarry",
            description: "Mark a target as your quarry. You sense its direction within 1 mile for 10 minutes. Generates 1 Quarry Mark.",
          },
        ],
        duration: 10,
        durationUnit: "minutes",
        concentration: false,
        power: "minor",
      },

      effects: {
        utility: {
          mark: {
            description: "Generate 1 Quarry Mark immediately",
            tracking: "You know the direction to marked target within 1 mile",
            duration: "10 minutes or until target dies",
          },
        },
      },

      specialMechanics: {
        quarryMarks: {
          generated: 1,
          description: "Immediately gain 1 Quarry Mark",
        },
        tracking: {
          description: "You can sense the marked target's direction",
          range: "1 mile",
          duration: "10 minutes",
        },
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
      tags: ["utility", "mark", "tracking", "universal"],
    },

    {
      effectTypes: ["damage"],
      id : "apex_swift_assault",
      name: "Swift Assault",
      description:
        "Perform a rapid series of glaive strikes against multiple nearby enemies.",
      spellType: "ACTION",
      icon: "Slashing/Sword Strike",
      level: 3,
      specialization: "universal",

      typeConfig: {
        castTime: 1,
        castTimeType: "IMMEDIATE",
        school: "physical",
        icon: "Slashing/Sword Strike",
      },

      targetingConfig: {
        targetingType: "multi",
        rangeType: "melee",
        rangeDistance: 10,
        maxTargets: 3,
      },

      durationConfig: {
        durationType: "instant",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 8 },
        actionPoints: 1,
        components: ["somatic"],
        somaticText: "Rapid spinning strikes",
        classResource: { type: "quarry_marks", cost: 1 },
      },

      resolution: "DICE",

      damageConfig: {
        formula: "1d8",
        elementType: "physical",
        damageTypes: ["physical"],
        scalingType: "none",
      },

      effects: {
        damage: {
          multiTarget: {
            formula: "1d8",
            type: "physical",
            targets: 3,
          },
        },
        conditionalBuff: {
          condition: "If all 3 attacks hit",
          effect: "+1 DR until start of next turn",
        },
      },

      specialMechanics: {
        quarryMarks: {
          cost: 1,
          generated: 3,
          description: "Costs 1 mark, generates up to 3 marks (1 per hit)",
        },
        conditionalBonus: {
          description:
            "If all attacks hit, gain +1 DR until start of next turn",
        },
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },
      tags: ["physical", "damage", "multi target", "universal"],
    },

    // ===== ADDITIONAL SPELLS TO REACH 3 PER LEVEL =====

    // LEVEL 2 (needs 1 more)
    {
      effectTypes: ["buff"],
      id : "apex_hunters_mark",
      name: "Hunter's Mark",
      description:
        "Mark a target, making it easier for you and your companion to hunt.",
      spellType: "ACTION",
      icon: "Piercing/Focused Arrow Shot",
      level: 2,
      specialization: "universal",

      typeConfig: {
        castTime: 1,
        castTimeType: "IMMEDIATE",
        school: "physical",
        icon: "Piercing/Focused Arrow Shot",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        maxTargets: 1,
      },

      durationConfig: {
        durationType: "rounds",
        duration: 5,
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 7 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        classResource: { type: "quarry_marks", cost: 1 },
      },

      resolution: "DICE",

      buffConfig: {
        buffType: "combatAdvantage",
        effects: [
          {
            id: "hunters_mark_damage",
            name: "Hunter's Mark Damage",
            description: "+1d6 damage to you and your companion against the marked target for 3 rounds.",
          },
        ],
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds",
        concentrationRequired: true,
        canBeDispelled: true,
      },

      effects: {
        buff: {
          description: "Bonus damage on attacks against marked target",
          damageFormula: "+1d6",
          duration: 3,
          durationUnit: "rounds",
        },
      },

      specialMechanics: {
        concentration: {
          required: true,
          description:
            "Requires concentration. Maintaining the mark on a new target ends the effect on the previous target.",
        },
        quarryMarks: {
          cost: 1,
          generated: 1,
          perHit: true,
          description:
            "Costs 1 QM to cast. Attacks against marked target generate +1 additional Quarry Mark (capped by per-turn limit)",
        },
        companionSynergy: {
          description: "Companion deals bonus damage to marked target",
          damageFormula: "+1d6",
        },
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
      tags: ["buff", "mark", "companion synergy", "universal"],
    },

    // LEVEL 4 (needs 3)
    {
      effectTypes: ["damage"],
      id : "apex_shadow_assault",
      name: "Shadow Assault",
      description: "Dash to a target and strike with overwhelming force.",
      spellType: "ACTION",
      icon: "Utility/Phantom Dash",
      level: 4,
      specialization: "universal",

      typeConfig: {
        castTime: 1,
        castTimeType: "IMMEDIATE",
        school: "physical",
        icon: "Utility/Phantom Dash",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 40,
        maxTargets: 1,
      },

      durationConfig: {
        durationType: "instant",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 14 },
        actionPoints: 1,
        components: ["somatic"],
        classResource: { type: "quarry_marks", cost: 2 },
      },

      resolution: "DICE",

      damageConfig: {
        elementType: "physical",
        formula: "3d8 + agility",
        damageTypes: ["physical"],
      },

      effects: {
        movement: {
          description: "Teleport to target before attacking",
          distance: 40,
        },
        damage: {
          formula: "3d8 + agility",
          type: "physical",
        },
      },

      specialMechanics: {
        quarryMarks: {
          cost: 2,
          generated: 2,
          description:
            "Costs 2 Quarry Marks. Generates 2 Quarry Marks on hit (subject to per-turn cap)",
        },
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
      tags: ["physical", "damage", "mobility", "universal"],
    },

    {
      effectTypes: ["buff"],
      id : "apex_feral_bond",
      name: "Feral Bond",
      description:
        "Strengthen your bond with your companion, enhancing both of your combat abilities.",
      spellType: "ACTION",
      icon: "Nature/Spawn",
      level: 4,
      specialization: "universal",

      typeConfig: {
        castTime: 1,
        castTimeType: "IMMEDIATE",
        school: "physical",
        icon: "Nature/Spawn",
      },

      targetingConfig: {
        targetingType: "self",
      },

      durationConfig: {
        durationType: "rounds",
        duration: 4,
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 14 },
        actionPoints: 1,
        components: ["verbal"],
        classResource: { type: "quarry_marks", cost: 2 },
      },

      resolution: "DICE",

      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          {
            id: "feral_bond_self",
            name: "Feral Bond (Self)",
            description: "+2 to attack rolls and damage for 4 rounds.",
          },
          {
            id: "feral_bond_companion",
            name: "Feral Bond (Companion)",
            description: "Companion gains +2 to attack rolls and +1d6 damage for 4 rounds.",
          },
        ],
        durationType: "rounds",
        durationValue: 4,
        durationUnit: "rounds",
        concentrationRequired: false,
        canBeDispelled: true,
      },

      effects: {
        buff: {
          self: {
            description: "+2 to attack rolls and damage",
            duration: 4,
            durationUnit: "rounds",
          },
          companion: {
            description: "+2 to attack rolls and +1d6 damage",
            duration: 4,
            durationUnit: "rounds",
          },
        },
      },

      specialMechanics: {
        companionSynergy: {
          description:
            "Companion gains an additional reaction attack per round when you are attacked (does not stack with Beast Fury)",
        },
        quarryMarks: {
          costReduction: true,
          description:
            "Quarry Mark abilities cost -1 QM while bonded (minimum 0)",
        },
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },
      tags: ["buff", "companion synergy", "enhancement", "universal"],
    },

    {
      effectTypes: ["damage"],
      id : "apex_glaive_dance",
      name: "Glaive Dance",
      description:
        "Spin through enemies in a deadly dance, striking all in your path.",
      spellType: "ACTION",
      icon: "Slashing/Dual Blades",
      level: 4,
      specialization: "universal",

      typeConfig: {
        castTime: 1,
        castTimeType: "IMMEDIATE",
        school: "physical",
        icon: "Slashing/Dual Blades",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "self",
        areaType: "circle",
        areaSize: 15,
      },

      durationConfig: {
        durationType: "instant",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 15 },
        actionPoints: 2,
        components: ["somatic"],
        classResource: { type: "quarry_marks", gain: 1 },
      },

      resolution: "DICE",

      damageConfig: {
        elementType: "physical",
        formula: "3d10 + agility",
        damageTypes: ["physical"],
      },

      effects: {
        damage: {
          formula: "3d10 + agility",
          type: "physical",
          aoe: "All enemies within 15 feet",
        },
        movement: {
          description:
            "Can move up to 15 feet during the dance without provoking opportunity attacks",
        },
      },

      specialMechanics: {
        quarryMarks: {
          generated: 1,
          perHit: true,
          description: "Generate 1 Quarry Mark per enemy hit",
        },
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
      tags: ["physical", "damage", "aoe", "mobility", "universal"],
    },

    // LEVEL 6 (needs 3)
    {
      effectTypes: ["buff"],
      id : "apex_apex_predator",
      name: "Apex Predator",
      description:
        "Transform into the ultimate hunter, enhancing all your abilities.",
      spellType: "ACTION",
      icon: "Nature/Cat Face",
      level: 6,
      specialization: "universal",

      typeConfig: {
        castTime: 1,
        castTimeType: "IMMEDIATE",
        school: "physical",
        icon: "Nature/Cat Face",
      },

      targetingConfig: {
        targetingType: "self",
      },

      durationConfig: {
        durationType: "rounds",
        duration: 5,
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 22 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        classResource: { type: "quarry_marks", cost: 3 },
      },

      resolution: "DICE",

      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          {
            id: "apex_predator_bonus",
            name: "Apex Predator",
            description: "+3 to all attack rolls, +10 movement speed, advantage on Agility saves, and +3d6 bonus damage on all attacks for 5 rounds.",
          },
        ],
        durationType: "rounds",
        durationValue: 5,
        durationUnit: "rounds",
        concentrationRequired: false,
        canBeDispelled: true,
      },

      effects: {
        buff: {
          description:
            "+3 to all attack rolls, +10 movement speed, advantage on Agility saves, and bonus damage on all attacks for 5 rounds",
          damageFormula: "+3d6",
        },
      },

      specialMechanics: {
        quarryMarks: {
          generation: "double",
          description: "Generate double Quarry Marks from all sources",
        },
        companionSynergy: {
          description: "Companion gains same bonuses",
        },
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 4 },
      tags: ["buff", "transformation", "companion synergy", "universal"],
    },

    {
      effectTypes: ["damage"],
      id : "apex_death_from_above",
      name: "Death From Above",
      description:
        "Leap high into the air and crash down on enemies with devastating force.",
      spellType: "ACTION",
      icon: "Nature/Cat Face",
      level: 6,
      specialization: "universal",

      typeConfig: {
        castTime: 1,
        castTimeType: "IMMEDIATE",
        school: "physical",
        icon: "Nature/Cat Face",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 50,
        areaType: "circle",
        areaSize: 20,
      },

      durationConfig: {
        durationType: "instant",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 22 },
        actionPoints: 2,
        components: ["somatic"],
        classResource: { type: "quarry_marks", gain: 1 },
      },

      resolution: "DICE",

      damageConfig: {
        formula: "6d10 + agility * 1.5",
        elementType: "physical",
        damageTypes: ["physical"],
        savingThrowConfig: {
          enabled: true,
          savingThrowType: "agility",
          difficultyClass: 16,
          saveOutcome: "halves",
          partialEffect: true,
          partialEffectFormula: "damage/2",
        },
        criticalConfig: {
          critType: "effect",
          critEffects: ["knockdown"],
        },
      },

      specialMechanics: {
        quarryMarks: {
          generated: 3,
          description: "Generate 3 Quarry Marks on successful hit",
        },
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },
      tags: ["physical", "damage", "control", "aoe", "mobility", "universal"],
    },

    {
      effectTypes: ["damage"],
      id : "apex_pack_assault",
      name: "Pack Assault",
      description: "Coordinate a devastating assault with your companion.",
      spellType: "ACTION",
      icon: "Nature/Wolf Dash",
      level: 6,
      specialization: "universal",

      typeConfig: {
        castTime: 1,
        castTimeType: "IMMEDIATE",
        school: "physical",
        icon: "Nature/Wolf Dash",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
        maxTargets: 1,
      },

      durationConfig: {
        durationType: "instant",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 20 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        classResource: { type: "quarry_marks", cost: 3 },
      },

      resolution: "DICE",

      damageConfig: {
        elementType: "physical",
        formula: "5d6 + agility",
        damageTypes: ["physical"],
      },

      effects: {
        damage: {
          apex: {
            formula: "5d6 + agility",
            type: "physical",
          },
          companion: {
            formula: "3d6 + companion_attack",
            type: "physical",
            description: "Companion attacks immediately with advantage",
          },
        },
      },

      specialMechanics: {
        quarryMarks: {
          cost: 3,
          description: "Costs 3 Quarry Marks to use",
        },
        companionSynergy: {
          description: "Companion attacks with advantage and deals +3d6 damage",
        },
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },
      tags: [
        "physical",
        "damage",
        "companion synergy",
        "coordinated",
        "universal",
      ],
    },

    // LEVEL 7 (needs 3)
    {
      effectTypes: ["buff"],
      id : "apex_shadow_glaive_mastery",
      name: "Shadow Glaive Mastery",
      description:
        "Master the Shadow Glaive, unlocking its full devastating potential.",
      spellType: "ACTION",
      icon: "Poison/Poison Concoction",
      level: 7,
      specialization: "universal",

      typeConfig: {
        castTime: 1,
        castTimeType: "IMMEDIATE",
        school: "physical",
        icon: "Poison/Poison Concoction",
      },

      targetingConfig: {
        targetingType: "self",
      },

      durationConfig: {
        durationType: "rounds",
        duration: 5,
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 25 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        classResource: { type: "quarry_marks", cost: 3 },
      },

      resolution: "DICE",

      buffConfig: {
        buffType: "damageIncrease",
        effects: [
          {
            id: "glaive_mastery_chains",
            name: "Extended Chains",
            description: "All glaive attacks chain to +2 additional targets with no chain damage reduction for 5 rounds.",
          },
          {
            id: "glaive_mastery_damage",
            name: "Glaive Mastery Damage",
            description: "All glaive attacks deal +50% damage for 5 rounds.",
          },
        ],
        durationType: "rounds",
        durationValue: 5,
        durationUnit: "rounds",
        concentrationRequired: false,
        canBeDispelled: true,
      },

      effects: {
        buff: {
          description:
            "All glaive attacks chain to +2 additional targets, chain damage does not reduce, and all glaive attacks deal +50% damage for 5 rounds",
        },
      },

      specialMechanics: {
        quarryMarks: {
          generation: "enhanced",
          description: "Generate +1 additional Quarry Mark per target hit",
        },
        glassiveSynergy: {
          description:
            "Glaive chains ignore distance restrictions (chains to all enemies within 30 feet)",
        },
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 4 },
      tags: ["buff", "enhancement", "glaive", "chain", "universal"],
    },

    {
      effectTypes: ["control", "damage"],
      id : "apex_savage_roar",
      name: "Savage Roar",
      description:
        "Your companion unleashes a terrifying roar that frightens all enemies.",
      spellType: "ACTION",
      icon: "Nature/Roar",
      level: 7,
      specialization: "universal",

      typeConfig: {
        castTime: 1,
        castTimeType: "IMMEDIATE",
        school: "physical",
        icon: "Nature/Roar",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 30,
        areaType: "circle",
        areaSize: 30,
        origin: "companion",
      },

      durationConfig: {
        durationType: "rounds",
        duration: 3,
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 22 },
        actionPoints: 1,
        components: ["verbal"],
        classResource: { type: "quarry_marks", cost: 2 },
      },

      resolution: "DICE",

      controlConfig: {
        controlType: "fear",
        duration: 3,
        durationUnit: "rounds",
        effects: [
          {
            id: "savage_roar_fear",
            name: "Frightened",
            description: "Enemies within 30 feet of the companion must make a DC 17 Spirit save or be frightened for 3 rounds.",
            config: { saveType: "spirit", saveDC: 17, duration: 3, durationUnit: "rounds" },
          },
        ],
        savingThrow: { ability: "spirit", difficultyClass: 17, saveOutcome: "negates" },
      },

      damageConfig: {
        formula: "3d8",
        damageTypes: ["wyrd"],
        resolution: "DICE",
      },

      effects: {
        control: {
          description:
            "All enemies within 30 feet of companion must make DC 17 Spirit save or be frightened for 3 rounds",
          save: "DC 17 Spirit",
          saveEffect: "negates",
          duration: 3,
          durationUnit: "rounds",
        },
        damage: {
          description:
            "Frightened enemies take wyrd damage at the start of their turns",
          damageFormula: "3d8",
        },
      },

      specialMechanics: {
        companionSynergy: {
          description: "Companion must be alive and within 100 feet",
        },
        quarryMarks: {
          cost: 2,
          description: "Costs 2 Quarry Marks to use",
        },
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },
      tags: ["control", "fear", "companion synergy", "aoe", "universal"],
    },

    {
      effectTypes: ["damage"],
      id : "apex_hunters_fury",
      name: "Hunter's Fury",
      description:
        "Channel all your fury into a devastating flurry of glaive strikes.",
      spellType: "ACTION",
      icon: "Slashing/Whirl",
      level: 7,
      specialization: "universal",

      typeConfig: {
        castTime: 2,
        castTimeType: "IMMEDIATE",
        school: "physical",
        icon: "Slashing/Whirl",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "touch",
        maxTargets: 1,
      },

      durationConfig: {
        durationType: "instant",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 28 },
        actionPoints: 3,
        components: ["somatic"],
        classResource: { type: "quarry_marks", cost: 5 },
      },

      resolution: "DICE",

      damageConfig: {
        formula: "12d8 + agility * 2",
        elementType: "physical",
        damageTypes: ["physical"],
        criticalConfig: {
          critType: "effect",
          critEffects: ["rapid_strikes_crit"],
        },
      },

      specialMechanics: {
        quarryMarks: {
          cost: 5,
          description: "Costs 5 Quarry Marks (maximum) to use",
        },
        criticalHit: {
          description:
            "Each strike that rolls max damage counts as a critical hit",
        },
      },

      cooldownConfig: { cooldownType: "encounter", cooldownValue: 1 },
      tags: ["physical", "damage", "single target", "burst", "universal"],
    },

    // LEVEL 8 (needs 3)
    {
      effectTypes: ["damage"],
      id : "apex_shadow_storm",
      name: "Shadow Storm",
      description:
        "Create a storm of shadow energy that devastates all enemies.",
      spellType: "ACTION",
      icon: "Psychic/Mind Strike",
      level: 8,
      specialization: "universal",

      typeConfig: {
        castTime: 3,
        castTimeType: "IMMEDIATE",
        school: "blight",
        icon: "Psychic/Mind Strike",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "sight",
        areaType: "circle",
        areaSize: 50,
      },

      durationConfig: {
        durationType: "rounds",
        duration: 4,
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 30 },
        actionPoints: 3,
        components: ["verbal", "somatic"],
        classResource: { type: "quarry_marks", cost: 4 },
      },

      resolution: "DICE",

      damageConfig: {
        elementType: "blight",
        formula: "10d10 + agility",
        damageTypes: ["blight"],
        dot: {
          formula: "3d10",
          duration: 4,
          tickFrequency: "round",
        },
      },

      effects: {
        damage: {
          initial: {
            formula: "10d10 + agility",
            type: "blight",
          },
          dot: {
            formula: "3d10 shadow per round",
            duration: 4,
            durationUnit: "rounds",
          },
        },
        zone: {
          description:
            "Storm persists for 4 rounds, dealing 3d10 shadow damage per round to enemies in the area",
          damageFormula: "3d10",
        },
      },

      specialMechanics: {
        quarryMarks: {
          cost: 4,
          description: "Costs 4 Quarry Marks to use",
        },
      },

      cooldownConfig: { cooldownType: "encounter", cooldownValue: 1 },
      tags: ["blight", "damage", "aoe", "dot", "zone", "universal"],
    },

    {
      effectTypes: ["buff", "transformation"],
      id : "apex_primal_fusion",
      name: "Primal Fusion",
      description:
        "Merge your essence with your companion, becoming one unstoppable force.",
      spellType: "ACTION",
      icon: "Nature/Claw Marks",
      level: 8,
      specialization: "universal",

      typeConfig: {
        castTime: 2,
        castTimeType: "IMMEDIATE",
        school: "physical",
        icon: "Nature/Claw Marks",
      },

      targetingConfig: {
        targetingType: "self",
      },

      durationConfig: {
        durationType: "rounds",
        duration: 5,
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 30 },
        actionPoints: 3,
        components: ["verbal", "somatic"],
        classResource: { type: "quarry_marks", cost: 4 },
      },

      resolution: "DICE",

      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          {
            id: "primal_fusion_stats",
            name: "Primal Fusion",
            description: "+5 to all stats, +30 maximum HP, regenerate 5d10 HP per round, and attack twice per turn for 5 rounds.",
          },
        ],
        durationType: "rounds",
        durationValue: 5,
        durationUnit: "rounds",
        concentrationRequired: false,
        canBeDispelled: true,
      },

      transformationConfig: {
        transformationType: "primal",
        targetType: "self",
        newForm: "Primal Fusion",
        description: "Merge your essence with your companion, becoming one unstoppable force.",
        duration: 5,
        durationUnit: "rounds",
        power: "ultimate",
        concentration: true,
        maintainEquipment: true,
        statModifiers: [
          { stat: "strength", magnitude: 5, magnitudeType: "flat" },
          { stat: "agility", magnitude: 5, magnitudeType: "flat" },
          { stat: "constitution", magnitude: 5, magnitudeType: "flat" },
          { stat: "intelligence", magnitude: 5, magnitudeType: "flat" },
          { stat: "spirit", magnitude: 5, magnitudeType: "flat" },
          { stat: "charisma", magnitude: 5, magnitudeType: "flat" },
          { stat: "maxHp", magnitude: 30, magnitudeType: "flat" },
        ],
        grantedAbilities: [
          { id: "primal_fusion_regenerate", name: "Primal Regeneration", description: "Regenerate 5d10 HP per round." },
          { id: "primal_fusion_double_attack", name: "Twin Strikes", description: "Can attack twice per turn." },
        ],
      },

      effects: {
        transformation: {
          description:
            "Merge with companion, gaining +5 to all stats, +30 HP, and both your attacks combined",
        },
        buff: {
          description:
            "+5 to all stats, +30 maximum HP, regenerate HP per round, and can attack twice per turn for 5 rounds",
          healingFormula: "5d10",
        },
      },

      specialMechanics: {
        companionSynergy: {
          description:
            "Companion merges with you - cannot be targeted separately",
        },
        quarryMarks: {
          generation: "triple",
          description: "Generate triple Quarry Marks from all sources",
        },
      },

      cooldownConfig: { cooldownType: "encounter", cooldownValue: 1 },
      tags: [
        "transformation",
        "buff",
        "companion synergy",
        "merge",
        "universal",
      ],
    },

    {
      effectTypes: ["damage"],
      id : "apex_glaive_storm",
      name: "Glaive Storm",
      description:
        "Summon a storm of shadow glaives that strike all enemies repeatedly.",
      spellType: "CHANNELED",
      icon: "Piercing/Dagger Rain",
      level: 8,
      specialization: "universal",

      typeConfig: {
        maxChannelDuration: 5,
        durationUnit: "ROUNDS",
        interruptible: true,
        movementAllowed: false,
        concentrationDC: 15,
        dcType: "CONSTITUTION",
        tickFrequency: "END_OF_TURN",
        school: "physical",
        icon: "Piercing/Dagger Rain",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "sight",
        areaType: "circle",
        areaSize: 40,
      },

      durationConfig: {
        durationType: "rounds",
        duration: 5,
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 28 },
        actionPoints: 3,
        components: ["verbal", "somatic"],
        classResource: { type: "quarry_marks", gain: 2 },
        channelingFrequency: "per_round",
      },

      resolution: "DICE",

      channelingConfig: {
        type: "power_up",
        maxDuration: 5,
        durationUnit: "rounds",
        interruptible: true,
      },

      damageConfig: {
        formula: "8d8 + agility",
        elementType: "physical",
        damageTypes: ["physical"],
        hasDotEffect: true,
        dotConfig: {
          dotFormula: "8d8 + agility",
          duration: 5,
          tickFrequency: "round",
          isProgressiveDot: false,
        },
        criticalConfig: {
          critType: "effect",
          critEffects: ["glaive_storm_crit"],
        },
      },

      specialMechanics: {
        channeling: {
          description:
            "Must maintain concentration. Deals damage at end of each of your turns.",
        },
        quarryMarks: {
          generated: 2,
          perRound: true,
          description: "Generate 2 Quarry Marks per round channeled",
        },
      },

      cooldownConfig: { cooldownType: "encounter", cooldownValue: 1 },
      tags: ["physical", "damage", "aoe", "channeled", "dot", "universal"],
    },

    // LEVEL 9 (needs 3)
    {
      effectTypes: ["buff", "transformation"],
      id : "apex_ultimate_hunter",
      name: "Ultimate Hunter",
      description:
        "Become the ultimate hunter, transcending mortal limitations.",
      spellType: "ACTION",
      icon: "Nature/Roaring Bear",
      level: 9,
      specialization: "universal",

      typeConfig: {
        castTime: 3,
        castTimeType: "IMMEDIATE",
        school: "physical",
        icon: "Nature/Roaring Bear",
      },

      targetingConfig: {
        targetingType: "self",
      },

      durationConfig: {
        durationType: "rounds",
        duration: 10,
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 35 },
        actionPoints: 3,
        components: ["verbal", "somatic"],
        classResource: { type: "quarry_marks", cost: 5 },
      },

      resolution: "DICE",

      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          {
            id: "ultimate_hunter_bonus",
            name: "Ultimate Hunter",
            description: "+3 to attack and damage rolls, double Quarry Mark generation, and companion shares all bonuses for 10 rounds.",
          },
        ],
        durationType: "rounds",
        durationValue: 10,
        durationUnit: "rounds",
        concentrationRequired: false,
        canBeDispelled: true,
      },

      transformationConfig: {
        transformationType: "primal",
        targetType: "self",
        newForm: "Ultimate Hunter",
        description: "Become the ultimate hunter, transcending mortal limitations.",
        duration: 10,
        durationUnit: "rounds",
        power: "ultimate",
        concentration: true,
        maintainEquipment: true,
        grantedAbilities: [
          { id: "ultimate_hunter_attack", name: "Hunter Precision", description: "+3 to attack and damage rolls." },
          { id: "ultimate_hunter_qm", name: "Double Quarry Marks", description: "Generate double Quarry Marks from all sources." },
          { id: "ultimate_hunter_companion", name: "Shared Bond", description: "Companion shares all bonuses and cannot be killed while active." },
          { id: "ultimate_hunter_chains", name: "Extended Glaive", description: "Glaive chains to +2 additional targets." },
        ],
      },

      effects: {
        transformation: {
          description:
            "+3 to attack and damage rolls, double QM generation, companion shares all bonuses. Duration: 5 rounds.",
        },
      },

      specialMechanics: {
        quarryMarks: {
          generation: "double",
          description: "Generate double Quarry Marks from all sources",
        },
        companionSynergy: {
          description:
            "Companion gains same bonuses and cannot be killed while active",
        },
        glaiveMastery: {
          description: "Glaive chains to +2 additional targets",
        },
      },

      cooldownConfig: { cooldownType: "encounter", cooldownValue: 1 },
      tags: [
        "transformation",
        "buff",
        "legendary",
        "companion synergy",
        "universal",
      ],
    },

    {
      effectTypes: ["damage"],
      id : "apex_deaths_embrace",
      name: "Death's Embrace",
      description:
        "Channel the essence of death through your glaive, instantly killing weak enemies.",
      spellType: "ACTION",
      icon: "Necrotic/Necrotic Death",
      level: 9,
      specialization: "universal",

      typeConfig: {
        castTime: 2,
        castTimeType: "IMMEDIATE",
        school: "blight",
        icon: "Necrotic/Necrotic Death",
      },

      targetingConfig: {
        targetingType: "chain",
        rangeType: "ranged",
        rangeDistance: 60,
        chainDistance: 10,
        maxChains: 5,
      },

      durationConfig: {
        durationType: "instant",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 35 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        classResource: { type: "quarry_marks", cost: 5 },
      },

      resolution: "DICE",

      damageConfig: {
        elementType: "blight",
        formula: "10d6 + agility",
        damageTypes: ["blight"],
        savingThrowConfig: {
          enabled: true,
          savingThrowType: "constitution",
          difficultyClass: 18,
          saveOutcome: "halves",
          partialEffect: true,
          partialEffectFormula: "damage/2",
        },
      },

      effects: {
        damage: {
          formula: "10d6 + agility",
          type: "blight",
          save: "DC 18 Constitution for half damage",
          chain: "Chains to up to 5 enemies",
        },
        execute: {
          description:
            "Enemies below 20% HP that fail the save are instantly killed",
        },
      },

      specialMechanics: {
        quarryMarks: {
          cost: 5,
          description: "Costs 5 Quarry Marks to use",
        },
        execute: {
          description:
            "Enemies below 20% health are instantly killed on failed save",
        },
      },

      cooldownConfig: { cooldownType: "encounter", cooldownValue: 1 },
      tags: ["blight", "damage", "execute", "chain", "legendary", "universal"],
    },

    {
      effectTypes: ["buff", "passive"],
      id : "apex_eternal_hunt",
      name: "Eternal Hunt",
      description:
        "Begin an eternal hunt that never ends until your quarry falls.",
      spellType: "PASSIVE",
      icon: "Piercing/Targeted Strike",
      level: 9,
      specialization: "universal",

      typeConfig: {
        toggleable: true,
        school: "physical",
        icon: "Piercing/Targeted Strike",
      },

      targetingConfig: {
        targetingType: "self",
      },

      durationConfig: {
        durationType: "permanent",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 30 },
        actionPoints: 0,
        components: ["ritual"],
        classResource: { type: "quarry_marks", cost: 5 },
      },

      resolution: "DICE",

      buffConfig: {
        buffType: "triggeredEffect",
        effects: [
          {
            id: "eternal_hunt_auto_qm",
            name: "Eternal Hunt Marks",
            description: "Automatically generate 1 Quarry Mark per round (subject to per-turn cap).",
          },
          {
            id: "eternal_hunt_revive",
            name: "Companion Auto-Revive",
            description: "Companion auto-revives after 1 round if killed.",
          },
          {
            id: "eternal_hunt_chains",
            name: "Extended Glaive Chains",
            description: "Glaive chains to +2 additional targets.",
          },
        ],
        durationType: "permanent",
        durationValue: 0,
        durationUnit: "permanent",
        concentrationRequired: false,
        canBeDispelled: false,
      },

      effects: {
        passive: {
          description:
            "Generate 1 Quarry Mark per round automatically (subject to per-turn cap). Companion auto-revives after 1 round if killed. Glaive chains to +2 additional targets. Requires 1 QM per round to maintain or the effect ends.",
        },
      },

      specialMechanics: {
        quarryMarks: {
          maintenanceCost: 1,
          automaticGeneration: 1,
          description:
            "Automatically generate 1 Quarry Mark per round. Costs 1 QM per round to sustain the passive — if you cannot pay, the effect ends and must be reactivated with 5 QM.",
        },
        companionSynergy: {
          description:
            "Companion automatically revives after 1 round if killed",
        },
        glaiveMastery: {
          description: "Glaive chains to +2 additional targets",
        },
      },

      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      tags: [
        "passive",
        "legendary",
        "companion synergy",
        "enhancement",
        "universal",
        "toggleable",
      ],
    },

    // LEVEL 10 (needs 3)
    {
      effectTypes: ["damage"],
      id : "apex_godslayer",
      name: "Godslayer",
      description: "Strike with enough force to slay even gods.",
      spellType: "ACTION",
      icon: "Slashing/Sword Strike",
      level: 10,
      specialization: "universal",

      typeConfig: {
        castTime: 5,
        castTimeType: "IMMEDIATE",
        school: "storm",
        icon: "Slashing/Sword Strike",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "touch",
        maxTargets: 1,
      },

      durationConfig: {
        durationType: "instant",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 40 },
        actionPoints: 3,
        components: ["verbal", "somatic"],
        classResource: { type: "quarry_marks", cost: 5 },
      },

      resolution: "DICE",

      damageConfig: {
        elementType: "storm",
        formula: "12d6 + agility * 1.5",
        damageTypes: ["storm"],
      },

      effects: {
        damage: {
          formula: "12d6 + agility * 1.5",
          type: "storm",
          description:
            "Deals 12d6 + agility × 1.5 force damage that ignores resistances",
        },
        execute: {
          description:
            "If target HP drops below 25% after this attack, target is instantly killed",
        },
      },

      specialMechanics: {
        quarryMarks: {
          cost: 5,
          description: "Costs 5 Quarry Marks to use",
        },
        ignoresDefenses: {
          description:
            "Ignores resistances (not immunities). Cannot be partially reduced.",
        },
        execute: {
          threshold: 0.25,
          description:
            "Instantly kills target if their remaining HP is below 25% of maximum",
        },
      },

      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      tags: [
        "physical",
        "damage",
        "execute",
        "legendary",
        "single target",
        "universal",
      ],
    },

    {
      effectTypes: ["damage", "summoning"],
      id : "apex_primal_apocalypse",
      name: "Primal Apocalypse",
      description:
        "Summon the primal fury of nature itself to devastate the battlefield.",
      spellType: "ACTION",
      icon: "Nature/Earth Shatter",
      level: 10,
      specialization: "universal",

      typeConfig: {
        castTime: 5,
        castTimeType: "IMMEDIATE",
        school: "physical",
        icon: "Nature/Earth Shatter",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "sight",
        areaType: "circle",
        areaSize: 100,
      },

      durationConfig: {
        durationType: "rounds",
        duration: 5,
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 38 },
        actionPoints: 3,
        components: ["verbal", "somatic"],
        classResource: { type: "quarry_marks", cost: 5 },
      },

      resolution: "DICE",

      summoningConfig: {
        creatures: [
          {
            id: "primal_beast_spirit",
            name: "Primal Beast Spirit",
            description: "A primal beast spirit summoned to ravage your enemies.",
            size: "Large",
            type: "beast",
            stats: {
              maxHp: 50,
              armor: 15,
              maxMana: 0,
            },
            config: {
              quantity: 3,
              duration: 3,
              durationUnit: "rounds",
              hasDuration: true,
              concentration: false,
              controlType: "autonomous",
              controlRange: 100,
            },
          },
        ],
      },

      damageConfig: {
        elementType: "physical",
        formula: "12d6 + agility",
        damageTypes: ["physical"],
        savingThrowConfig: {
          enabled: true,
          savingThrowType: "constitution",
          difficultyClass: 18,
          saveOutcome: "halves",
          partialEffect: true,
          partialEffectFormula: "damage/2",
        },
        dot: {
          formula: "3d6",
          duration: 3,
          tickFrequency: "round",
        },
      },

      effects: {
        damage: {
          initial: {
            formula: "12d6 + agility",
            type: "primal",
            save: "DC 18 Constitution for half",
          },
          dot: {
            formula: "3d6 nature per round",
            duration: 3,
            durationUnit: "rounds",
          },
        },
        summon: {
          description:
            "Summons 3 primal beasts that attack enemies for 3 rounds",
        },
      },

      specialMechanics: {
        quarryMarks: {
          cost: 5,
          description: "Costs 5 Quarry Marks to use",
        },
        summons: {
          description:
            "Summons 3 primal beast spirits (50 HP, 15 armor each) that attack autonomously",
        },
      },

      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      tags: [
        "primal",
        "damage",
        "aoe",
        "summoning",
        "legendary",
        "dot",
        "universal",
      ],
    },

    {
      effectTypes: ["buff", "passive"],
      id : "apex_perfect_hunt",
      name: "Perfect Hunt",
      description: "Achieve the perfect hunt — mastery beyond mortal limits.",
      spellType: "PASSIVE",
      icon: "Piercing/On the Mark",
      level: 10,
      specialization: "universal",

      typeConfig: {
        toggleable: true,
        school: "physical",
        icon: "Piercing/On the Mark",
      },

      targetingConfig: {
        targetingType: "self",
      },

      durationConfig: {
        durationType: "permanent",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 38 },
        actionPoints: 0,
        components: ["ritual"],
        classResource: { type: "quarry_marks", cost: 5 },
      },

      resolution: "DICE",

      buffConfig: {
        buffType: "damageIncrease",
        effects: [
          {
            id: "perfect_hunt_cost",
            name: "Perfect Efficiency",
            description: "All Quarry Mark abilities cost 1 less QM (minimum 0).",
          },
          {
            id: "perfect_hunt_damage",
            name: "Perfect Strikes",
            description: "Attacks deal +1d8 damage.",
          },
          {
            id: "perfect_hunt_revive",
            name: "Eternal Companion",
            description: "Companion auto-revives after 1 round if killed.",
          },
          {
            id: "perfect_hunt_chains",
            name: "Master Glaive Chains",
            description: "Glaive chains to +3 additional targets.",
          },
        ],
        durationType: "permanent",
        durationValue: 0,
        durationUnit: "permanent",
        concentrationRequired: false,
        canBeDispelled: false,
      },

      effects: {
        passive: {
          description:
            "All Quarry Mark abilities cost 1 less QM (minimum 0). Attacks deal +1d8 damage. Companion auto-revives after 1 round. Glaive chains to +3 additional targets. Requires 1 QM per round to maintain or the effect ends.",
        },
      },

      specialMechanics: {
        quarryMarks: {
          maintenanceCost: 1,
          costReduction: 1,
          description:
            "All QM abilities cost 1 less (min 0). Costs 1 QM per round to sustain — if you cannot pay, the effect ends and must be reactivated with 5 QM.",
        },
        companionSynergy: {
          description: "Companion auto-revives after 1 round if killed",
        },
        glaiveMastery: {
          description: "Glaive chains to +3 additional targets",
        },
      },

      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      tags: [
        "passive",
        "legendary",
        "ascension",
        "companion synergy",
        "universal",
        "toggleable",
      ],
    },    {
      id : "hunt_bond_sickness",
      name: "Bond Sickness",
      description:
        "When your animal companion drops to 0 HP or is dismissed, you suffer Bond Sickness for 2 rounds: -2 to all attack rolls and -10 ft movement speed. The psychic link severing is physically painful. You cannot summon a new companion until Bond Sickness ends.",
      level: 1,
      spellType: "PASSIVE",
      icon: "Nature/Nature Primal",
      effectTypes: ["passive"],
      typeConfig: {
        school: "primal",
        icon: "Nature/Nature Primal",
        tags: ["passive", "debuff", "companion", "bond sickness", "apex"],
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
      tags: ["passive", "debuff", "companion", "bond sickness", "apex"],
    },
    { id : "hunt_pack_dependency",
      name: "Pack Dependency",
      description:
        "When you have no active animal companion, you lose access to all Pack Tactics abilities and your melee attacks deal -1d6 damage. You and your companion are one hunting unit -- without them, you are incomplete.",
      level: 3,
      spellType: "PASSIVE",
      icon: "Nature/Wolf Human Split Face",
      effectTypes: ["passive"],
      typeConfig: {
        school: "primal",
        icon: "Nature/Wolf Human Split Face",
        tags: ["passive", "debuff", "companion dependency", "pack tactics", "apex"],
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
      tags: ["passive", "debuff", "companion dependency", "pack tactics", "apex"],
    },

      {
        "id": "apex_sentry_spirit",
        "name": "Sentry Spirit",
        "description": "Call upon the spectral memory of a hunting falcon. The bird sits quietly on a branch above your campsite, chirping softly to wake your party if any creature walks within its keen sight.",
        "level": 1,
        "spellType": "ACTION",
        "icon": "Nature/Ethereal Falcon",
        "typeConfig": {
          "school": "primal",
          "icon": "Nature/Ethereal Falcon",
          "tags": [
            "utility",
            "roleplay",
            "apex"
          ],
          "castTime": 1,
          "castTimeType": "IMMEDIATE"
        },
        "targetingConfig": {
          "targetingType": "self",
          "rangeType": "self"
        },
        "resourceCost": {
          "actionPoints": 1,
          "resourceTypes": [
            "mana"
          ],
          "resourceValues": {
            "mana": 4
          },
          "components": [
            "verbal",
            "somatic"
          ],
          "verbalText": "Custos silvae, vigila!",
          "somaticText": "Whistle a sharp, high-pitched bird call while extending a leather-wrapped forearm"
        },
        "resolution": "NONE",
        "effectTypes": [
          "utility"
        ],
        "utilityConfig": {
          "utilityType": "conjuration",
          "selectedEffects": [
            {
              "id": "sentry_spirit_guard",
              "name": "Vigilant Watch",
              "description": "A spectral sentry guards a 40-foot radius. It alerts you if any creature larger than a rat enters the area, preventing surprise."
            }
          ],
          "duration": 8,
          "durationUnit": "hours",
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
          "apex"
        ]
      },
  ],
};
