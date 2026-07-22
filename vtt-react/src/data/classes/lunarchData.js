/**
 * Lunarch Class Data
 *
 * The Vessel of the Lunar Parasite. An ancient, unfeeling celestial entity has
 * burrowed into the Lunarch's nervous system. The moon is not their ally — it
 * is a cold, parasitic predator that feeds on memory, sensation, sanity, and
 * vitality in exchange for devastating cosmic power.
 */

export const LUNARCH_DATA = {
  restrictions: {
      "allowedSubraces": [
          "florae_unified",
          "florae_unified",
          "veiled_mimir",
          "tethered_mimir",
          "thalren_human"
      ],
      "hardBlocks": [
          "neth",
          "astril",
          "vreken",
          "skald_human",
          "emberth",
          "groven",
          "fexrick",
          "myrathil",
          "solvarn_human",
          "merryn_human",
          "ordan_human",
          "tessen_human",
          "morren_human"
      ],
      "narrativeUnlock": true,
      "justification": "Requires fog-dense environments where silence-light is accessible. The parasite specifically responded to Viridane blood. Non-Florae who enter the moonlit groves may be chosen, but the Florae are the original bloodline."
  },

  /**
   * Subrace Variants, the lunar parasite anchors itself to *identity*, and what serves
   * as that anchor depends on the host. For the Florae it is the fae-contract bloodline.
   * For the Mimir it is the mask itself, the parasite replaces the heartwood as the
   * thing that holds the self together. The caste of Mimir determines how stable that
   * replacement is.
   */
  subraceVariants: {
    florae_unified: {
      subraceName: 'Trueborn Florae',
      title: 'The Thorn-Bound',
      reframe: `The <LoreLink termId="florae">Trueborn</LoreLink>, thorn-cloaked traditionalists of the deep groves, are the parasite's original hosts, and they wear it openly. For the Trueborn, the lunar parasite is the fae-contract made flesh: the thorn-blood remembers what the fae loaned, and the parasite's phases *are* the debt's interest cycle. An Trueborn Lunarch does not fight the parasite; they *account* for it, each phase a payment, each Waning a default.`,
      signatureAbility: {
        name: 'Thorn-Debt',
        description: `The parasite's phases are synced to the host's fae-contract debt; power scales with the outstanding obligation, and the Waning phase (memory-loss) is *literally* interest collection. An Trueborn Lunarch who has fully repaid their fae-debt loses their magic, and so none ever do.`
      },
      currentCrisisAngle: `The dead-moon-is-a-fallen-star revelation strikes the Trueborn hardest: their fae-contract is bound to a *living* entity, and the elder parasites now communicating across hosts are the fallen star's brood-siblings. The Trueborn elders fear the fae themselves were parasites all along, that the entire Florae bloodline is a larval stage. Selene's three-week silence is, the Trueborn believe, her being *called home* to the fallen star she cannot refuse.`,
      signatureQuote: {
        text: '"The fae lent us the thorn and the moon collects the interest. We always knew the lender was older than the loan. We did not know the lender was still hatching."',
        speaker: 'Selene of House Viridane',
        context: 'The founder, in the journal she stopped writing three weeks ago'
      }
    },

    florae_unified: {
      subraceName: 'Shorn Florae',
      title: 'The Hidden Moon',
      reframe: `The <LoreLink termId="florae">Shorn</LoreLink> pass as human, living among the Thalren in the Frostwood's edge-settlements, and a Lunarch among them carries the parasite *in secret*, hidden beneath sleeves that cover the thorn-scars. A Shorn Lunarch's tragedy is doubled: they hide their race from their neighbors and their phase-changes from themselves, sneaking into moonlit clearings to feed a parasite no one knows they carry.`,
      signatureAbility: {
        name: 'Veiled-Phase',
        description: `The parasite's phases are suppressed during the day and in company, then erupt violently in isolation or moonlight, the Shorn cannot control *when* the phase shifts, only where they are when it happens. Power is potent but catastrophically unpredictable.`
      },
      currentCrisisAngle: `The elder parasites communicating across hosts is, for the Shorn, an *exposure crisis*: the cross-host communication manifests as visible moonlight bleeding through the skin during the day, when the Shorn are meant to be passing as human. The hidden moon is becoming impossible to hide, and the Thalren neighbors are beginning to notice that certain people *glow* at night.`,
      signatureQuote: {
        text: '"I hid my thorns to live among you. I hid my moon to live with myself. Now the moon will not stay hidden, and you are looking at me the way I always feared you would."',
        speaker: 'Vael the Smooth',
        context: 'A Shorn Lunarch, the morning after glowing through her sleeves'
      }
    },

    veiled_mimir: {
      subraceName: 'Arch Mimir',
      title: 'The Moon-Masked',
      reframe: `The <LoreLink termId="mimir">Arch Mimir</LoreLink> canopy aristocrats anchor their identity to a single carved mask, and a Lunarch among them finds the lunar parasite *replacing* the heartwood mask as the anchor of the self. The Arch Mimir are the most stable Mimir Lunarchs: the parasite bonds cleanly to a host already accustomed to external identity-anchoring. They trade a wooden face for a living one.`,
      signatureAbility: {
        name: 'Lunar-Anchor',
        description: `The parasite serves as a *replacement mask*, a second, living identity-anchor that holds the self together even when the physical mask is removed. A host can survive briefly unmasked in the fog, sustained by the parasite. The cost: the parasite's phases now *are* the host's identity, and the Waning phase is amnesia.`
      },
      currentCrisisAngle: `The dead-moon revelation threatens the Arch Mimir uniquely: if the parasite is one of many siblings communicating across hosts, the Lunarch's *identity* is being shared with strangers.`,
      signatureQuote: {
        text: '"I wore a mask to remember who I am. Now I wear the moon, and it remembers three other people who are also me. I cannot tell which of us is the original."',
        speaker: 'Veil-Keeper Mir-Tassen',
        context: 'An Arch Mimir Lunarch, cataloguing memories that arrived overnight'
      }
    },

    tethered_mimir: {
      subraceName: 'Fractured Mimir',
      title: 'The Sentinel-Moon',
      reframe: `The <LoreLink termId="mimir">Fractured Mimir</LoreLink> are the fog-sentinels, the watchers on the <LoreLink termId="frostwood-reach">Ironwood Palisade</LoreLink>, and a Lunarch among them must reconcile the parasite with an existing *duty-identity*. The Fractured host is anchored not by a mask but by *vigil*: the sentinel's watch. The parasite bonds to the vigil itself, and the moon becomes the thing they watch *for*.`,
      signatureAbility: {
        name: 'Vigil-Bond',
        description: `The parasite's power scales with the host's adherence to their sentinel-duty; a Fractured Lunarch who abandons their post loses their magic within hours.`
      },
      currentCrisisAngle: `The elder-parasite communication manifests in the Fractured as *false alarms*, the sentinel-moon reporting threats that are not there, calling the host to posts that do not exist.`,
      signatureQuote: {
        text: '"I am the sentinel and the moon is my post. Lately the moon sees things I do not. I do not know if it is lying or if I am going blind."',
        speaker: 'Sentinel Mir-Felss',
        context: 'A Fractured Lunarch, the fourth night of phantom alarms'
      }
    },

    thalren_human: {
      subraceName: 'Thalren',
      title: 'The Fog-Heresy',
      reframe: `The <LoreLink termId="skald">Thalren</LoreLink> value fixed identity above all, journals chained to belts, lineages tattooed on tapestries, and a Lunarch among them is a *heretic*, surrendering the very stability their culture worships. A Thalren Lunarch is rare, ostracized, and desperate: they have traded the recorded self for a parasitic one, and the fog that erases Thalren memory is, for them, *feeding* the moon.`,
      signatureAbility: {
        name: 'Fog-Communion',
        description: `The parasite draws power directly from the Frostwood's memory-erasing fog; a Thalren Lunarch in dense fog is the most potent variant of the tradition, channeling silence-light the fog itself filters. The cost: the Thalren's already-fading memories fade *faster*, fed to the parasite as fuel.`
      },
      currentCrisisAngle: `The Thalren Lunarchs are the variant most endangered by their own people: the Scribe-Cartel has begun identifying them (the glow gives them away) and striking them from the Sovereign Ledger as *legally nonexistent*, the same erasure applied to the Forgotten. A Thalren Lunarch who is unrecorded cannot prove they exist, and the parasite, feeding on a host the world no longer acknowledges, is growing erratic.`,
      signatureQuote: {
        text: '"My people chain journals to their belts to prove they are real. I let the moon eat my proof. The Ledger struck my name. By your law, I do not exist. By the moon\'s, I never stop."',
        speaker: 'Thal-Veyr the Unrecorded',
        context: 'A Thalren Lunarch, reading the notice of her own legal erasure'
      }
    }
  },


  id : "lunarch",
  name: "Lunarch",
  icon: "fas fa-moon",
  role: "Control/Support",
  damageTypes: ["ember", "blight", "wyrd"],

  // Overview section
  livingOrder: {
    orderName: 'The Lunar Communion',
    founder: {
      name: '<LoreLink termId="selene">Selene of House Viridane</LoreLink>',
      status: `Alive, but silent. Selene bargained with the wildwood fae in the moonlit groves and bound a lunar parasite to her bones. Three weeks ago she stopped speaking <LoreLink termId="florae">Florae</LoreLink> and began whispering in a language the elders cannot identify, older than the fae-contract, older than the dead moon.`,
      note: `The first Lunarch. Her parasite was believed singular; the discovery that the dead moon is a fallen star  —  and the "egg" a folk misunderstanding  —  has rendered her silence terrifying rather than merely concerning.`
    },
    currentLeader: {
      name: '<LoreLink termId="bri-vessela">Regent Bri-Vessela</LoreLink>',
      title: 'Keeper of the Phases (acting)',
      characterization: `A senior Trueborn Florae who has led the Communion in Selene's silence with visible reluctance. She is a theologian, not a politician, and she took the regency only because the alternative was civil war between the caste-factions. She spends her nights at Selene's side, transcribing the dead-language whispers, and her days pretending she understands what they mean.`
    },
    headquarters: { name: 'The Moonlit Groves, deep Frostwood Reach', locationId: 'frostwood-reach' },
    crisisConnection: `<LoreLink termId="bri-vessela">Bri-Vessela</LoreLink> is presiding over a Communion that is, quietly, being *called*, the elder parasites communicating across hosts are synchronizing the phases of every Lunarch toward an unknown convergence. Selene's whispers are, <LoreLink termId="bri-vessela">Bri-Vessela</LoreLink> has begun to suspect, not madness but *instructions*: the waking-song of the fallen star, and every Lunarch is a note in it. She does not know whether to stop the convergence or let it come, because no one alive remembers what wakes.`
  },

  worldFriction: [
    { region: 'frostwood-reach', status: 'persecuted', consequence: 'The Scribe-Cartel identifies Lunarchs by their tell-tale glow and strikes them from the Sovereign Ledger, the same legal erasure applied to the Forgotten. An unrecorded Lunarch cannot prove citizenship, own property, or cross the Ironwood Palisade checkpoints. The fog that erases Thalren memory feeds the parasite, making the persecution worse.', workaround: 'The Shorn Florae variant survives by passing as human; the Tethered Mimir variant is already unrecorded and feels little difference. The openly lunar have no workaround, only flight into the deep groves.' },
    { region: 'bryngloom-forest', status: 'banned', consequence: 'The Neth consider the lunar parasite an unbound entity outside the First Contract, a Lunarch in Atropolis is treated as a walking contract-breach and detained for "resolution of the unfiled attachment."' }
  ],

  overview: {
    originStory: `A lunarch is not a priest. They are a host. An ancient celestial parasite has burrowed into their nervous system and refused to leave. The moon is not a symbol of hope. It is a cold, alien predator that has been feeding on the light of dying stars since before flesh existed.

The first host was Selene of House Viridane, who struck the bargain during her family's flight from the northern keeps at the time of the Binding. The six noble houses had marched their firstborn to the peaks to seal the dark bargains with Keth-Amar. House Viridane refused. Selene led her family south through the Frostwood Reach into the moonlit fae groves, and there she bargained with wildwood fae for protection. The fae granted a lunar parasite, a creature of starlight and cold that wrapped around her bones and fed on her warmth. It guided them through the fog. It hid them from Keth-Amar's searching. It also took something Selene has never gotten back.

The Lunar Cycle is not a tool. It is the parasite's feeding schedule, and it does not care what the host was doing when the phase shifts. Every three rounds, the parasite forcefully rewrites the host's physiology to extract a different nutrient. During the New Moon, it feeds on memory, granting damage resistance and emotional immunity. During the Waxing phase, it feeds on sensation, amplifying damage output. During the Full Moon, it feeds on sanity, granting devastating radiant power but forcing Delirium rolls. During the Waning, it feeds on vitality, granting vampiric regeneration at the cost of life force. At the end of each phase, the host pays in pain, every transition dealing physical damage as the parasite rearranges their nervous system for the next feeding.

For eight centuries, the parasite bonded only to Florae bloodlines. The Trueborn Florae, descendants of House Viridane, are the original hosts. The parasite is the fae-contract made flesh, each phase a payment on an ancient debt. The Shorn Florae carry the parasite in secret while passing as human, sneaking into moonlit clearings to feed it when no one is watching. But the parasite has recently begun spreading. It now bonds to Mimir hosts, the Arch Mimir finding it replaces their heartwood mask as identity-anchor, and the Fractured Mimir having it bond to the vigil itself. Thalren hosts have begun emerging, the memory-erasing fog providing direct fuel for the parasite. A Thalren lunarch trades fixed identity for a parasitic one, and in dense fog, they are the most potent variant.

The elder parasites are communicating across their hosts. They are planning something. Selene has not spoken in three weeks, and when she does speak, it is in a language no living person recognizes. The Florae elders have discovered that the dead moon was never a moon at all. It was a fallen star, and the parasites are its brood, hatched from a fragment that fell into the Frostwood's groves during the Deepening. Whatever is waking is older than the fae-contract, older than the dark bargains, older than Selene's bargain itself.`,
    title: "The Lunarch",
    subtitle: "Vessel of the Lunar Parasite",

    quickOverview: {
      title: "Quick Overview",
      content: `**Who they are**: A host to an ancient celestial parasite that has threaded tendrils of starlight through their nervous system and refuses to leave. The moon is not a symbol of hope  —  it is a cold, alien predator that has been feeding on dying stars since before flesh existed, and it chose them without asking permission.

**The hook**: Every three rounds the parasite forcibly rewrites your physiology, cycling through four lunar phases  —  memory-eating New Moon, sensation-harvesting Waxing, sanity-eroding Full Moon, and vitality-draining Waning. Each phase grants devastating new abilities but extracts a different nutrient from your body. You must weaponize the horror.

**The cost**: Standard magical healing deals wyrd damage to you  —  the parasite devours foreign magic. Bludgeoning trauma ruptures your parasite-interlaced organs at +25%. Every phase shift deals damage and forces a roll on the Transition Shock Table. Your body is a crime scene the parasite refuses to leave.

**Bring one for**: The only class that can warp the passage of rounds on the battlefield, imposing a cosmic feeding cycle on enemies and turning your own parasitic affliction into a weapon that spreads phase-corresponding devastation across the entire fight.`,
    },

    description: `The Lunarch is not a priest. The Lunarch is a host — a walking crime scene where an ancient, unfeeling celestial parasite has burrowed into the nervous system and refused to leave. The moon is not a symbol of hope or guidance; it is a cold, alien predator that has been feeding on the light of dying stars since before flesh existed. When it chose the Lunarch, it did not ask permission. It seeped into their spine through the soft tissue at the base of the skull, threaded tendrils of starlight through their nerve clusters, and began to feed.

The Lunar Cycle is not a tool. It is the parasite's feeding schedule. Every three rounds, it rewrites the host's physiology to extract a different nutrient: memory during the New Moon, physical sensation during the Waxing, sanity during the Full, and raw vitality during the Waning. Each shift tears flesh along invisible seams where starlight has replaced connective tissue. The Lunarch cannot stop it. They can only direct it — choosing which horror to embrace, weaponizing the parasite's hunger against their enemies, and hoping their body holds together long enough to matter.

No other class can manipulate the passage of rounds on the battlefield. No other class can impose a cosmic feeding cycle on their enemies, spreading phase-corresponding afflictions across an entire fight. But the cost is absolute: the Lunarch is immune to standard magical healing, their parasite-interlaced organs rupture catastrophically under bludgeoning trauma, and every phase shift is a gamble with the Transition Shock Table. The Lunarch does not win fights through strength. They win by making the battlefield as hostile to existence as their own body has become.`,

    roleplayIdentity: {
      title: "Roleplay Identity",
      content: `**HISTORY: THE GENESIS**
The lunarch's crescent aura was born in the moonlit groves of the <LoreLink termId="frostwood-reach">Frostwood Reach</LoreLink>. A scion of House Viridane named **Selene** fled the noble armies and bargained with the wildwood fae to capture the moon's light. The price of this celestial aura was a permanent chill in her bones. Selene could never feel warmth again, even next to volcanic vents, her flesh glowing with a pale, sympathetic silver.

**CITIES & CIVIL RECEPTION**
Lunarchs are celebrated as spiritual leaders among the Florae, but they are hunted as heretics by the noble houses of the north.

**RACES & CULTURAL AFFILIATION**
The class is primarily practiced by the <LoreLink termId="florae">Florae</LoreLink> descendants of House Viridane, though the lunar parasite has occasionally bonded with Mimir mask-merged and Thalren hosts drawn to the Frostwood's moonlit groves.

**NOTABLE FIGURES**
* **Selene of House Viridane**: The founding scion of the Lunarch order who led her house's escape from the north.
* **Eldrin the Moon-Touched**: A Florae elder who established the first moonlit sanctuaries in the Frostwood Reach.`
    },

    signatureQuote: {
      text: '"The parasite does not hate me. It loves me. That is the horror of it. It loves me so completely that it has rewritten every cell of my body to match its idea of perfection."',
      speaker: 'Selene of House Viridane',
      context: 'Her testimony to the Florae elders, explaining why she cannot remove the lunar entity'
    },

    philosophy: {
      coreTenet: 'We thought the moon  —  Vael, the old songs called it  —  was dead, its ghost a pale recording of a celestial body no longer there. The elders have since learned the truth: Vael was never a corpse but a dormant star, a sleeping deity whose slumber has no known cause. When the Broken Seal cracked, the largest fragment of that fallen star broke away and plunged into the Frostwood\'s groves  —  and from that fragment hatched the lunar parasites now bonded to our bones. Some Lunarch lore still speaks of the fallen star as an "egg," though in truth it was a star, not a shell waiting to hatch; and Keth-Amar itself later nested in the corpse-star\'s hollow. We drew power from absence because absence was all we understood. Now we must learn to draw power from what is waking.',
      relationship: 'The lunar parasite is not a symbiont, it is a predator that has learned to keep its host alive. It feeds on specific human experiences: the New Moon feeds on hope, the Waxing on anticipation, the Full on ecstasy, the Waning on memory. It cycles through these phases relentlessly, consuming whatever emotional energy the host is producing at that moment. The host is not in control. The parasite decides when to hunt, and the host is left to pick up the pieces of their own psyche afterward.',
      paradox: 'The Lunarch is at their most powerful when the parasite is at its most active, the Full Moon phase brings devastating power, but it consumes the host\'s most precious memories. A Lunarch who cycles through too many Full Moons will forget their own name, their family, their reason for fighting. The parasite remembers for them, but the parasite does not care. It will cheerfully trade a moment of transcendent power for a decade of the host\'s most cherished experiences.'
    },

    currentCrisis: `The dead moon is calling its children home. For centuries, the lunar parasite that binds to Lunarchs was believed to be a singular entity, a fragment of the long-dead moon that persisted in orbit. The Florae elders have discovered otherwise: the dead moon was no mere ghost but a fallen star, and the parasites are not the children of an egg  —  they are the brood hatched from the great fragment that broke off the star and fell into the Frostwood's groves, now bonded to our bones. The "egg" was always a folk misunderstanding of the fallen star.

The elder parasites, those bonded to the first Lunarchs, are beginning to communicate with each other across their hosts. They are planning something. Selene of House Viridane has been silent for three weeks, staring at the sky, occasionally whispering in a language that no living person speaks. The Florae shamans have placed her in isolation, but they cannot stop the parasite from cycling through its phases.       When the next Full Moon comes, they do not know if Selene will still be Selene, or if she will be something the fallen star has been waiting for.`,

    meaningfulTradeoffs: `A Lunarch cannot control when they change, what they feel, or what they remember. The parasite cycles through its phases on a fixed schedule, and the host is along for the ride. A Lunarch in the Waning phase will lose memories regardless of whether they are in combat or sitting peacefully by a fire. They can be mid-conversation when the parasite decides it is time to feed, and they will suddenly forget the person they are talking to. Relationships are nearly impossible, partners learn to read the phase-cycle and avoid the host during certain times. The Lunarch lives at the mercy of a creature that does not negotiate.`,

    classSpecificLocations: [
      {
        name: 'The Moonlit Sanctuaries',
        locationId: 'ironwood-heart',
        description: 'Hidden clearings deep in the Ironwood Heart where the Florae elders established safe houses for Lunarchs to cycle through their phases without endangering others. Each sanctuary is a circle of standing stones positioned to catch the light of the dead moon at specific angles, minimizing the parasite\'s feeding efficiency and giving the host a few precious hours of lucidity.',
        purpose: 'Safe cycling grounds for Lunarchs in crisis',
        status: 'Active, Selene occupies the central sanctuary, and no one can approach'
      }
    ],

    combatRole: {
      title: "Combat Role",
      content: `**Primary Role**: Battlefield cycle manipulator and phase-contagion spreader with adaptive damage potential

**What You Bring That No One Else Can**:
- Distort the passage of rounds — add or remove rounds from active effects on the battlefield
- Impose phase-specific vulnerabilities on enemies across the entire battlefield
- Force enemies to "sync" with your current phase, applying phase-corresponding debuffs (memory loss, pain amplification, radiant vulnerability, life drain)
- The only class that can weaponize a feeding cycle as a battlefield-wide control mechanism

**Combat Strengths**:
- Unmatched battlefield control through phase contagion and round manipulation
- Devastating burst damage during Full Moon (Sanity Erosion) — +2d8 radiant, crit 19-20, ignores 50% DR
- Vampiric sustain during Waning Moon (Vitality Drain) — 25% of damage dealt returns as healing
- Extreme survivability during New Moon (Memory Eater) — +3 DR, immune to charm/fear
- Every phase shift creates a reality pulse that can be weaponized against nearby enemies

**Combat Weaknesses (The Fatal Flaw)**:
- **Celestial Rejection**: +25% vulnerability to Bludgeoning damage (your starlight-infused organs rupture under blunt trauma)
- **Healing Immunity**: Standard magical healing deals wyrd damage to you equal to 50% of the heal amount — the parasite devours foreign magic and converts it to wyrd feedback
- **Transition Shock**: Every phase shift (natural or manual) forces a roll on the Transition Shock Table (1d6) — you may take extra damage, lose mana, lose AP, or go blind
- **Self-Destructive Economy**: Natural cycle shifts deal 2d6 blight damage every 3 rounds. Manual shifts cost 8 mana + 1d8+2 necrotic. You are always bleeding.
- **Full Moon Delirium**: During Sanity Erosion, you must roll on the Delirium Table each turn — you may attack allies, lose AP, or take wyrd damage

**Optimal Positioning**:
Medium range (30-60 feet), close enough to spread phase contagion to enemies but far enough to avoid the bludgeoning attacks that will rupture your organs. Position near allies during Waxing Moon so they benefit from your redirected parasite-feeding (Sanguine Warden). Stay far from allies during Full Moon — the Delirium Table may force you to attack them.`,
    },

    playstyle: {
      title: "Playstyle & Strategy",
      content: `**Phase Management (Choose Your Suffering)**:
The Lunarch does not choose whether to suffer — only HOW. Each phase is a different flavor of horror:

- **New Moon (Memory Eater)**: The parasite feeds on cognition. +3 DR, immune to charm/fear, but -2 to attacks and lose 1d4 mana/turn. Use this when you're being targeted and need to survive. You are a passenger in your own body — the parasite drives, and it has excellent reflexes but terrible aim.
- **Waxing Moon (Sensation Harvest)**: The parasite feeds on nerve endings. +1d6 damage, +10ft speed, advantage on perception, but take 1d4 blight/turn and CANNOT be healed by any means. Use this for aggressive repositioning and damage bursts when you're healthy enough to absorb the feeding.
- **Full Moon (Sanity Erosion)**: The parasite floods your brain with cosmic signal. +2d8 radiant, crit 19-20, ignores 50% DR, but roll Delirium each turn and lose 5 max HP/round. This is your nuclear option — devastating but self-destructive. Never stay here longer than you must.
- **Waning Moon (Vitality Drain)**: The parasite drinks your life force. -3 mana costs, +10ft spell range, debuffs last +1 round, 25% vampiric healing, but -2 DR, -10ft speed, -10 max HP. Use this to recover through vampirism while controlling the field.

**The Transition Shock Table**:
Every shift (natural or manual), roll 1d6:
| d6 | Effect |
|---|---|
| 1 | Tissue Strain — Take 2d6 necrotic as flesh strains along starlight seams |
| 2 | Synaptic Flash — Blinded for 1 round as the parasite reroutes your optic nerves |
| 3 | Mana Hemorrhage — Lose 2d4 mana as the parasite drains arcane reserves |
| 4 | Temporal Dissonance — Lose 1 AP on your next turn as time stutters |
| 5 | Psychic Whiplash — Take 1d6 wyrd damage, disadvantage on next save |
| 6 | Parasitic Mercy — Only 1 blight damage. The parasite is sated... for now |

**The Healing Problem**:
You CANNOT be healed by standard magical means. A cleric casting healing spells on you deals wyrd damage instead. Your only recovery options are: Waning Moon vampirism (25% of damage dealt), Sanguine Warden blood-rites (cost your own HP), and specific self-damage spells that convert parasite-feeding into temporary sustenance. Plan accordingly.

**Round Manipulation**:
Your unique utility. Key abilities let you add or remove rounds from effects, extend debuffs on enemies, compress buff durations on allies, and force enemies to "sync" with your current phase. This makes you the only class that can accelerate or decelerate the entire battlefield's tempo.`,
    },



    immersiveCombatExample: {
      title: "Combat Example: The Parasite Feeds",
      content: `**The Setup**: You are a Level 4 Lunarch (Hollow Sentinel). Your nervous system hosts a celestial parasite that rewrites your flesh every 3 rounds. You are fighting 3 Corpse-Weavers (undead, bludgeoning attacks — your worst nightmare) and 1 Corpse-Weaver Matriarch. Starting Phase: New Moon. Starting Mana: 50/60. HP: 55/65. Your Phylactery... you don't have one. You just have scars that glow in the dark.

**Starting State**: Phase: New Moon (Memory Eater) | Mana: 50/60 | HP: 55/65 | Round: 1

**NEW MOON — THE MEMORY EATER (Rounds 1-3)**

**Turn 1 — The Parasite Takes the Reins (Phase: New Moon, Round 1/3)**

*The Corpse-Weavers emerge from the darkness, their limbs clicking. You feel the parasite stir at the base of your skull — cold, hungry, patient. New Moon. It is feeding on your memories. Your mother's face is already blurry.*

**New Moon (Memory Eater) Active**:
- +3 DR (parasite controls motor function — your body dodges before you think)
- Immune to Charm and Fear
- -2 to all attack rolls (you can barely remember how to aim)
- Lose 1d4 mana at start of turn (the parasite eats thought)

**Mana Drain**: -1d4 ? [3] = -3 mana
**Mana**: 50 - 3 = 47/60

*Your hands move without your permission. The parasite knows where the enemies are even if you're starting to forget why you're here.*

**Your Action**: Cast "Parasitic Bolt" at Corpse-Weaver #1 (4 mana)
**Attack Roll**: d20+6, but -2 from Memory Eater ? [12] = Hit!
**Base Damage**: 1d8 radiant ? [6] = 6 radiant
**New Moon Phase Bonus**: Target loses 1d4 mana or takes 1d4 extra necrotic ? [3] necrotic
**Total Damage**: **6 radiant + 3 necrotic = 9 damage**
**Self-Damage from Parasitic Bolt**: 1d4 necrotic ? [2] = 2 blight to you

**HP**: 55 - 2 = 53/65
**Mana**: 47 - 4 = 43/60

*The bolt punches through the Weaver's carapace. Cold white light bleeds from the wound. You feel a distant kinship with the thing — something alien lives in both of you.*

**Corpse-Weaver #2's Turn**: Attacks you with bludgeoning slam!
**Attack Roll**: d20+5 ? [15] = Hit!
**Damage**: 1d8+3 bludgeoning ? [7] + 3 = 10 bludgeoning
**CELESTIAL REJECTION (Fatal Flaw)**: +25% vulnerability to Bludgeoning ? 10, 1.25 = **12 bludgeoning damage**

*The slam connects with your ribs. You feel something SHIFT inside — not bone breaking, but the parasite's tendrils being jostled. Starlight bleeds from the impact site. Pain is distant. The Memory Eater is consuming the part of you that processes agony.*

**HP**: 53 - 12 = 41/65

**Current State**: Phase: New Moon (Round 1/3) | Mana: 43/60 | HP: 41/65

**Turn 2 — Paying in Flesh (Phase: New Moon, Round 2/3)**

**Mana Drain**: -1d4 ? [2] = -2 mana. *Your memory of last night's campfire fades.*
**Mana**: 43 - 2 = 41/60

**Your Action**: Cast "Phase Tear" — Force shift to FULL MOON (8 mana + 1d8+2 blight self-damage)
*You cannot endure another round of being a punching bag. You reach into the parasite's cycle and PULL yourself toward Full Moon. Your body screams.*

**Phase Shift Cost**: 8 mana + 1d8+2 necrotic ? [6] + 2 = 8 blight to you
**Transition Shock Table (1d6)**: [4] = **Temporal Dissonance** — lose 1 AP on your next turn

*Your skin splits along the starlight seams. Cold white light pours from the cracks. Your perception SHATTERS — for a moment, you see through the moon's eyes. Everything is so small. Everything is so breakable.*

**Mana**: 41 - 8 = 33/60
**HP**: 41 - 8 = 33/65

**FULL MOON — THE SANITY EROSION (Rounds 2-4)**

**Full Moon Active**:
- +2d8 ember damage on all attacks
- Critical hits on 19-20
- Attacks ignore 50% of DR
- DELIRIUM: Roll on Delirium Table at start of each turn
- -5 max HP per round in this phase

**Max HP Reduction**: 65 - 5 = 60 (temporary)
**HP**: 33/60 (still 33 HP, but ceiling drops)

**Delirium Roll (1d4)**: [3] = Take 1d6 wyrd damage
**wyrd damage**: [4] = 4 psychic. *The cosmos whisper a name. It might be yours. It might be the name of the star that will die last.*

**HP**: 33 - 4 = 29/60

**Your Action**: Cast "Parasitic Bolt" at Corpse-Weaver #1 (4 mana, Full Moon bonus)
**Attack Roll**: d20+6 ? [19] = **CRITICAL HIT!** (19-20 crit range)
**Base Damage**: 1d8 radiant ? [8] = 8, doubled = 16 radiant
**Full Moon Bonus**: +2d8 radiant ? [7, 6] = 13, doubled = 26 radiant
**Total Critical Damage**: **42 ember damage**
**Self-Damage**: 1d4 necrotic ? [3] = 3

*The bolt doesn't just hit the Weaver. It UNRAVELS it. Cold starlight erupts from every joint, every orifice, every crack in its carapace. The thing doesn't die — it stops. Mid-motion. Frozen in a moment of cosmic horror. Then it collapses into a pile of light-bleached chitin.*

**Corpse-Weaver #1**: OBLITERATED

**HP**: 29 - 3 = 26/60
**Mana**: 33 - 4 = 29/60

**Current State**: Phase: Full Moon (Round 1/3) | Mana: 29/60 | HP: 26/60 (max reduced)

**Turn 3 — The Matriarch (Phase: Full Moon, Round 2/3)**

**Max HP Reduction**: 60 - 5 = 55 (cumulative)
**Delirium Roll**: [1] = **Attack nearest creature.** *The parasite doesn't care about tactics. It is hungry and the Matriarch is too far.*

**Your Action (FORCED)**: Attack nearest target — Corpse-Weaver #3 (adjacent)
**Attack Roll**: d20+6 ? [17] = Hit!
**Damage**: 1d8 + 2d8 radiant (Full Moon) ? [7] + [5, 8] = 20 radiant
**Self-Damage**: 1d4 ? [1] = 1

**Corpse-Weaver #3**: Severely wounded
**HP**: 26 - 1 = 25/55
**Mana**: 29 (no mana spent — forced basic attack)

**Matriarch's Turn**: Slams you with bludgeoning attack!
**Damage**: 2d8+5 bludgeoning ? [8, 6] + 5 = 19 ?,1.25 (Celestial Rejection) = **23 bludgeoning**

*The Matriarch's massive limb catches you square in the chest. You HEAR your own ribs crack — not bone, but the starlight seams rupturing. White light sprays from your mouth. You taste cold vacuum.*

**HP**: 25 - 23 = 2/55

**Your Party's Healer**: "I'll heal you!"
**You**: "DON'T. Your healing will KILL me. The parasite eats foreign magic and feeds it back as wyrd damage. I need to shift to Waning and vampiric drain."

**Your Party's Tank**: Interposes, blocking the Matriarch's next attack.

**Current State**: Phase: Full Moon (Round 2/3) | Mana: 29/60 | HP: 2/55 (max reduced)

**Turn 4 — Survival Through Parasitism (Manual Shift to Waning Moon)**

*You are dying. The Full Moon is eating you from the inside. You reach into the cycle and PULL yourself toward Waning. The parasite protests — it was enjoying the Sanity Erosion. Your flesh strains again.*

**Phase Shift**: Full Moon ? Waning Moon (8 mana + 1d8+2 necrotic)
**Shift Cost**: 1d8+2 ? [5] + 2 = 7 necrotic
**Transition Shock**: [6] = **Parasitic Mercy** — only 1 necrotic. *The parasite is briefly sated from the Sanity Erosion feeding. It almost feels... grateful.*

**Total Self-Damage from Shift**: 7 + 1 = 8 necrotic
**HP**: 2 - 8 = ... **-6 HP**

*You collapse. Starlight bleeds from your eyes, your mouth, the seams in your skin. The parasite SCREAMS inside your skull — not in fear, but in fury. Its host is dying and it has not finished feeding.*

**Your Party's Tank**: "THE LUNARCH IS DOWN!"

*...but then your body TWITCHES. The Waning Moon takes hold. The parasite, desperate to preserve its host, inverts its feeding — drinking from the ambient life force of everything around you rather than from your own fading body.*

**WANING MOON — THE VITALITY DRAIN Active**:
- -3 mana costs
- 25% vampiric healing on all damage dealt
- -2 DR, -10 max HP
- But you're at NEGATIVE HP. The vampirism kicks in as a death-sustaining reflex.

**Your Action**: Cast "Silence Rend" at Matriarch and nearby Weavers (reduced cost: 8-3 = 5 mana)
**Damage**: 3d6 radiant ? [5, 6, 4] = 15 radiant (AoE, hits all 3 enemies)
**Vampiric Healing**: 25% of 15, 3 targets hit = 25% of 45 = 11 HP healed!

**HP**: -6 + 11 = 5/45 (max HP reduced by 10 from Waning + accumulated Full Moon penalties)
**Mana**: 29 - 8 + 3 = 24/60 (Waning cost reduction applied)

*You drag yourself upright. Blood-tinged moonlight drips from your fingertips. Your veins are black. Your skin is gray. But you are ALIVE, and the parasite is HUNGRY, and the Matriarch is looking at you with something it has never felt before: fear.*

**Combat Continues...**

**The Lesson**: Playing a Lunarch is about:
1. **Choosing Your Suffering**: New Moon for survivability at the cost of offense. Full Moon for devastation at the cost of sanity and HP. Waning for vampiric sustain at the cost of defense.
2. **The Flesh Economy**: Every shift costs blood. The Transition Shock Table is always looming. You cannot be healed normally. Your HP is a countdown timer, not a health bar.
3. **Celestial Rejection is Real**: That Bludgeoning vulnerability is not theoretical. Two hits took you from 55 HP to death's door. Avoid blunt weapons at all costs.
4. **Phase Weaponization**: You don't just cycle phases for yourself — you spread them to enemies, manipulate round counts, and force the entire battlefield to sync with your parasite's feeding schedule.
5. **The Delirium Gamble**: Full Moon's damage is unmatched, but the Delirium Table can force you to attack allies or lose your turn. Never stay in Sanity Erosion longer than absolutely necessary.
6. **Vampiric Emergency**: Waning Moon's 25% vampirism is your only reliable self-heal. When you're dying, shifting to Waning and dealing AoE damage can pull you back from the brink — but it requires enemies to be nearby and mana to be available.`,
    },
  },

  resourceSystem: {
    title: "The Lunar Parasite Economy",
    subtitle: "Flesh Is the Currency of the Cosmos",

    description: `The Lunar Cycle is not a tool. It is a feeding schedule imposed by an alien parasite fused to the Lunarch's nervous system. Every three rounds, the parasite FORCEFULLY REWRITES the host's physiology to extract a different nutrient — memory, sensation, sanity, or vitality. This is not optional. This is not free. Every natural cycle shift deals 2d6 irreducible blight damage as the Lunarch's flesh tears along invisible seams where starlight has replaced connective tissue. The Lunarch cannot stop the feeding. They can only direct it — choosing which horror to embrace at the cost of their own blood, and praying the parasite's hunger can be weaponized against their enemies before it consumes them entirely.`,

    cards: [
      {
        title: "New Moon — The Memory Eater",
        stats: "+3 DR | Immune: Charm/Fear | -2 Attacks | -1d4 Mana/turn",
        details:
          "The parasite feeds on cognition. You lose memories, tactical awareness, and fine motor control. In exchange, the parasite drives your body autonomously — reacting to threats faster than conscious thought. You are a passenger in your own flesh. You start every combat here.",
      },
      {
        title: "Waxing Moon — The Sensation Harvest",
        stats: "+1d6 Damage | +10ft Speed | Adv Perception | 1d4 blight/turn | No Healing",
        details:
          "The parasite feeds on nerve endings. Every sensation is amplified into agony. Pain becomes power — channeled into destructive force and hyper-awareness. But you CANNOT be healed by any means during this phase. The parasite intercepts all restoration and converts it into more sensation to feed on.",
      },
      {
        title: "Full Moon — The Sanity Erosion",
        stats: "+2d8 Radiant | Crit 19-20 | Ignores 50% DR | Delirium Roll/turn | -5 Max HP/round",
        details:
          "The parasite floods your brain with cosmic signal. Reality fractures. Your attacks become terrifying — raw stellar radiation channeled through a breaking mind. But each turn you must roll on the Delirium Table: attack an ally, lose AP, take wyrd damage, or — rarely — nothing. Your max HP erodes every round you remain.",
      },
      {
        title: "Waning Moon — The Vitality Drain",
        stats: "-3 Mana Costs | 25% Vampiric | +10ft Range | +1 Rnd Debuffs | -2 DR | -10 Max HP",
        details:
          "The parasite drinks raw life force. Your body withers — skin grays, veins blacken, breath shallows. But the siphoned vitality is converted into arcane efficiency and vampiric healing. This is your only reliable self-sustain. The 25% vampirism on all damage dealt is how you survive.",
      },
    ],

    generationTable: {
      headers: ["Action", "Cost", "Effect"],
      rows: [
        [
          "Natural Cycle",
          "2d6 Necrotic (irreducible)",
          "Auto-advances to next phase every 3 rounds. The parasite feeds. You bleed.",
        ],
        [
          "Manual Phase Shift",
          "8 Mana + 1d8+2 Necrotic",
          "Choose your horror. Resets 3-round timer. Roll Transition Shock (1d6).",
        ],
        [
          "Total Eclipse (Lv6)",
          "15 Mana + 3d6 Necrotic",
          "Gain TWO phases simultaneously for 2 rounds. Both drawbacks. Both boons. Roll Transition Shock twice.",
        ],
      ],
    },

    usage: {
      momentum:
        "Full Moon (Sanity Erosion) is your nuclear option. +2d8 radiant, crit 19-20, ignores half DR the Delirium Table can force you to attack allies and your max HP bleeds away every round. Never stay longer than you must. Get in, unleash the abyss, get out.",
      flourish:
        "Waning Moon (Vitality Drain) is your survival phase. The 25% vampirism is your ONLY reliable self-heal. When you're dying — and you will be dying often — shift to Waning and deal AoE damage to pull yourself back from the brink. The -2 DR hurts, but being dead hurts more.",
    },

    overheatRules: {
      title: "The Transition Shock Table",
      content: `Every time a phase shift occurs — natural cycle OR manual — the Lunarch's flesh strains along the starlight seams where the parasite has replaced connective tissue. Roll 1d6:

| d6 | Name | Effect |
|---|---|---|
| 1 | Tissue Rupture | Take 2d6 blight damage as flesh splits along starlight seams |
| 2 | Synaptic Flash | Blinded for 1 round as the parasite reroutes optic nerves |
| 3 | Mana Hemorrhage | Lose 2d4 mana as the parasite drains arcane reserves to fuel transition |
| 4 | Temporal Dissonance | Lose 1 AP on your next turn as your perception of time stutters |
| 5 | Psychic Whiplash | Take 1d6 wyrd damage and disadvantage on your next saving throw |
| 6 | Parasitic Mercy | Only 1 blight damage. The parasite is briefly sated. It almost feels... grateful. |

**The Delirium Table (Full Moon Only)**:
At the START of each turn during Full Moon (Sanity Erosion), roll 1d4:

| d4 | Effect |
|---|---|
| 1 | Cosmic Hallucination — You MUST attack the nearest creature (ally or enemy) with your next action |
| 2 | Temporal Seizure — Lose 1 AP this turn as your body convulses with starlight |
| 3 | Psychic Bleed — Take 1d6 wyrd damage as the cosmos whisper the names of dead stars |
| 4 | Moment of Clarity — No drawback this turn. The parasite blinks. Make it count. |`,
    },

    strategicConsiderations: {
      title: "The Flesh Economist",
      content: `**The 3-Round Death Clock**: Every 3 rounds, the parasite forces a natural cycle shift. This deals 2d6 blight damage AND forces a Transition Shock roll. You cannot opt out. You cannot reduce the damage. You can only choose WHICH phase you bleed into by shifting manually (which costs MORE blood). Every combat is a countdown — how many cycles can your body survive before the parasite consumes more than you can replenish?

**The Healing Problem**: You CANNOT be healed by standard magical means. The parasite devours foreign magic and converts it to wyrd feedback. A cleric's healing spell deals wyrd damage to you equal to 50% of the heal amount. Your ONLY recovery options are:
- Waning Moon vampirism (25% of all damage dealt returns as HP)
- Sanguine Warden blood-rites (heal allies by damaging yourself, then leech life back through Waning)
- Specific self-damaging spells that convert the parasite's feeding into temporary sustenance
- Natural HP recovery during short/long rests (the parasite sleeps too)

**The Bludgeoning Death Sentence**: Your starlight-infused organs are fragile. +25% vulnerability to Bludgeoning damage means a single critical hit from a mace, hammer, or slam attack can rupture your internal seams. Avoid. Blunt. Weapons. At. All. Costs.

**Phase Triage (Choose Your Suffering)**:
- Being focused by enemies? New Moon. The +3 DR and charm/fear immunity might keep you alive. You'll hit like a toddler, but you'll be alive.
- Healthy and need damage? Waxing Moon. +1d6 damage and +10ft speed. You'll take 1d4 blight/turn and can't be healed, but if you're healthy that's manageable.
- Something needs to DIE right now? Full Moon. +2d8 radiant, crit 19-20, ignores half DR. You may hallucinate and stab your healer. Your max HP drops every round. Get in, kill, get out.
- Dying and need sustain? Waning Moon. -3 mana costs and 25% vampirism. Your body withers but you steal life from everything you damage. This is your emergency room.

**Round Manipulation (Your Unique Edge)**:
No other class can manipulate the passage of rounds. Key applications:
- Extend debuffs on enemies by adding rounds
- Compress buff durations on allies by removing wasted rounds
- Force enemies to "sync" with your current phase via Phase Contagion
- Accelerate or decelerate the battlefield's entire tempo to match your parasite's feeding cycle`,
    },

    playingInPerson: {
      title: "Playing in Person",
      subtitle: "The Wound Tracker",
      content: `Tracking a 4-phase cycle that damages you every 3 rounds requires physical props. The Lunarch bleeds. Make it visible.

**Required Materials**:
- **Phase Dial** — A disc marked with 4 phases. Use a red clothespin to mark the current phase. The red reminds everyone you are suffering.
- **Damage d6** — Roll this EVERY cycle shift. Natural or manual. No exceptions. The table should hear it.
- **Self-Damage Tracker** — A row of d6s or tokens showing accumulated self-damage this combat. When it gets scary, the table feels it.

**The Physical Hack**:
- **The Bleeding Token**: Start with 10 red glass beads. Every time you take self-damage from a phase shift, remove one. When you're out of beads, your character is in critical danger. The whole table can see your countdown.
- **The Seam Lines**: Draw thin white lines on your character sheet with a gel pen. When you shift phases, trace one with your finger. These are the seams where the parasite has replaced your connective tissue with starlight. They glow faintly under UV light.
- **The Moon Coin**: A large coin, silver on one side (Full/Waxing), black on the other (New/Waning). Flip it on shifts. When it lands silver-side-up during Full Moon, everyone at the table tenses.

**Quick Reference**:
\`\`\`
CYCLE:  New Moon (Memory Eater) ? Waxing (Sensation) ? Full Moon (Sanity) ? Waning (Vitality)
TIMER:  3 Rounds per Phase (FORCED, costs 2d6 necrotic)
SHIFT:  8 Mana + 1d8+2 Necrotic (Choose phase, roll Transition Shock 1d6)
HEAL:   Cannot be healed by magic. Waning vampirism only.
WEAK:   +25% Bludgeoning vulnerability. Avoid hammers.
\`\`\`

**Tactile Tip**: When you "Shift" manually, physically press your hand against the base of your skull where the parasite fused. Flinch slightly. The other players should feel uncomfortable watching you decide which part of yourself to sacrifice next.`,
    },
  },

  // Specializations
  specializations: {
    title: "Lunarch Specializations",
    subtitle: "Three Expressions of the Parasite's Hunger",

    description: `The parasite has fused with your nervous system, but HOW it manifests depends on which part of your anatomy it has colonized most aggressively. Every Lunarch develops one dominant expression of the infection — a specialization that determines how the parasite's feeding is weaponized. These are not choices made at a temple or academy. They are biological mutations. The parasite reshapes you according to its own unknowable criteria, and you discover your specialization the first time you survive a phase shift that should have killed you.`,

    sharedPassive: {
      name: "Parasitic Bond",
      icon: "Arcane/Star Trail Path",
      description:
        "The parasite grants you darkvision up to 60 feet — your eyes have been partially replaced with photosensitive starlight receptors. You are immune to magical charm and fear effects during Full Moon (Sanity Erosion) because there is nothing left of your 'self' for those effects to target. You can see the seams in reality where the parasite has touched the world.",
    },

    specs: [
      { id : "hollow-sentinel",
        name: "Hollow Sentinel",
        icon: "Nature/Owl",
        color: "#A0A0A0",
        theme: "Precision Killer",

        description: `The parasite has hollowed out the Lunarch's eyes, replacing the vitreous humor with condensed starlight. They do not see the world as others do — they perceive it through the parasite's alien geometry, a lattice of angles and trajectories where every living thing is a target and every gap in armor is a screaming invitation. The Hollow Sentinel is a precision killer, and the parasite aims through them like a weapon. During Full Moon, their strikes bypass armor entirely — the starlight in their eyes can see through solid matter, finding the soft tissue beneath.`,

        playstyle:
          "Precision ranged assassin who must carefully manage Full Moon (Sanity Erosion) to land devastating armor-ignoring critical strikes while surviving the Delirium Table",

        strengths: [
          "Ranged attacks ignore 25% of DR (the parasite calculates weak points)",
          "Critical hits during Full Moon deal additional 2d6 wyrd damage — the target glimpses the cosmos through the wound",
          "Can mark targets, making them visible through walls and immune to concealment",
          "Devastating single-target elimination potential",
        ],

        weaknesses: [
          "No AoE capability — every shot is a single, surgical incision",
          "Full Moon Delirium can force you to attack allies instead of your marked target",
          "Extremely vulnerable when caught in melee (no close-range tools)",
          "Overwhelming dependence on Full Moon for peak performance",
        ],

        passiveAbilities: [
          {
            name: "Parasitic Bond",
            tier: "Path Passive",
            description:
              "The parasite grants you darkvision up to 60 feet and immunity to charm/fear during Full Moon. Your eyes contain starlight receptors that see through the parasite's alien geometry.",
            sharedBy: "All Lunarch",
          },
          {
            name: "Starlight Sockets",
            tier: "Specialization Passive",
            icon: "Piercing/On the Mark",
            description:
              "Your ranged attacks ignore 25% of the target's DR. The starlight in your eyes perceives structural weak points in any defense. During Full Moon (Sanity Erosion), critical hits deal an additional 2d6 wyrd damage as the wound channels a glimpse of the cosmos directly into the target's mind.",
            uniqueTo: "Hollow Sentinel",
          },
          {
            name: "Hollow Mark",
            tier: "Specialization Ability",
            icon: "Piercing/Targeted Strike",
            description:
              "When you hit a creature with a ranged attack, you can mark them until the end of your next turn. Marked creatures are visible to you through walls and concealment. Your next spell against a marked creature deals +1d6 ember damage as the parasite focuses its hunger.",
            uniqueTo: "Hollow Sentinel",
          },
        ],

        recommendedSpells: [
          "Parasitic Bolt - Your primary ranged attack, damages you as it damages them",
          "Hollow Sight - Mark priority targets for armor-piercing elimination",
          "Hollow Volley - Multi-target execution during Full Moon",
          "Phase Tear - Force-shift to Full Moon when a target must die NOW",
        ],
      },
      { id : "silence-speaker",
        name: "Silence-Speaker",
        color: "#2C3E50",
        theme: "Cosmic Contamination & Rifts",
        description: `The parasite has opened a channel to the Silence between stars — the cold, hateful space where light goes to die. The Silence-Speaker does not 'call down stars' or 'invoke celestial energy.' They tear holes in reality through which cold, predatory starlight bleeds. These rifts contaminate everything they touch, spreading cosmic sickness that disadvantages enemies and corrodes their ability to fight. The Silence-Speaker is a battlefield controller who warps the geometry of combat, and their AoE abilities apply 'Star-Sickness' — a lingering contamination that represents the parasite spreading its influence through the wounds it creates.`,

        playstyle:
          "Battlefield controller who tears reality apart, spreading cosmic contamination and phase contagion across entire enemy formations",

        strengths: [
          "AoE spells apply Star-Sickness: disadvantage on next attack roll, 1d4 ember damage at start of turn for 2 rounds",
          "During Waxing Moon, AoE radius increases by 5 ft (the parasite's tendrils reach further when feeding on sensation)",
          "Can spread the current phase's effects to enemies via Phase Contagion",
          "Round manipulation — add or remove rounds from active battlefield effects",
        ],

        weaknesses: [
          "Lower single-target damage than Hollow Sentinel",
          "Self-damage from AoE spells is higher (the parasite feeds more aggressively when reality tears)",
          "Requires precise positioning to avoid hitting allies with contamination",
          "Mana-intensive — most abilities cost 2+ more mana than equivalent Hollow Sentinel spells",
        ],

        passiveAbilities: [
          {
            name: "Parasitic Bond",
            tier: "Path Passive",
            description:
              "The parasite grants you darkvision up to 60 feet and immunity to charm/fear during Full Moon. Your eyes contain starlight receptors that see through the parasite's alien geometry.",
            sharedBy: "All Lunarch",
          },
          {
            name: "Silence Aperture",
            tier: "Specialization Passive",
            icon: "Arcane/Star Trail Path",
            description: "Your rift spells have their radius increased by 5 ft. Entering your active rift zones deals 1d4 radiant damage per round to enemies.",
            uniqueTo: "Silence-Speaker",
          },
          {
            name: "Phase Contagion",
            tier: "Specialization Passive",
            icon: "Arcane/Magical Sword",
            description:
              "When you deal damage with an AoE spell, you can choose to spread your current phase's horror to one enemy hit. New Moon: target loses 1d4 mana or takes 1d4 wyrd damage. Waxing: target takes 1d4 extra necrotic. Full Moon: target has disadvantage on next save. Waning: target loses 5 ft speed for 1 round.",
            uniqueTo: "Silence-Speaker",
          },
          {
            uniqueTo: "Silence-Speaker",
            name: "Star-Sickness Contagion",
            description: "Enemies affected by Star-Sickness have disadvantage on all saving throws against your phase effects.",
          },
          {
            uniqueTo: "Silence-Speaker",
            name: "Eclipse Shroud",
            description: "When standing inside a rift zone, you are treated as having total cover against ranged attacks.",
          }
        ],

        notableAbilities: [
          "Silence Rend - Your signature AoE, tears reality and spreads Star-Sickness",
          "Silence Beam - Line attack that leaves a trail of cosmic contamination",
          "Silence Collapse - Massive AoE with phase contagion",
          "Total Eclipse - Ultimate reality distortion, gain two phases at double the cost",
        ],
      },
      { id : "sanguine-warden",
        name: "Sanguine Warden",
        icon: "Nature/Ethereal Bird",
        color: "#8B0000",
        theme: "Sacrificial Healer",

        description: `The Sanguine Warden has learned to redirect the parasite's feeding outward — siphoning vitality from the moon's gravitational pull and channeling it through their own bleeding flesh to mend allies. This is not sacred healing. This is not spirit intervention. The Sanguine Warden literally bleeds moonlight, tearing open the starlight seams in their own body to create conduits through which stolen life force can flow into wounded companions. During Waxing Moon, their healing is increased by 50% because the parasite's sensation-feeding creates more tears to channel through — but each heal costs the Warden 1d4 blight damage as they rip themselves open further. During Waning Moon, a vampiric feedback loop allows them to recover 25% of the healing they deal to others. The Sanguine Warden is the only Lunarch who can semi-reliably sustain themselves, and they do it by making their own suffering into medicine.`,

        playstyle:
          "Sacrificial healer who bleeds moonlight to keep allies alive, sustaining themselves through vampiric feedback loops during Waning Moon",

        strengths: [
          "Only Lunarch spec with reliable self-sustain (Waning Moon vampiric feedback)",
          "Healing is increased by 50% during Waxing Moon (more flesh-tears to channel through)",
          "Can create persistent healing zones that pulse with stolen life force",
          "Allies healed by the Sanguine Warden gain temporary HP from the parasite's residue",
        ],

        weaknesses: [
          "Every heal costs the Warden HP — you are literally bleeding yourself dry to keep others alive",
          "Lowest damage output of all Lunarch specs",
          "Must stay in Waning Moon as long as possible to recover from Waxing Moon healing binges",
          "Cannot benefit from OTHER healers (Celestial Rejection applies to all magical healing)",
        ],

        passiveAbilities: [
          {
            name: "Parasitic Bond",
            tier: "Path Passive",
            description:
              "The parasite grants you darkvision up to 60 feet and immunity to charm/fear during Full Moon. Your eyes contain starlight receptors that see through the parasite's alien geometry.",
            sharedBy: "All Lunarch",
          },
          {
            name: "Blood Rite",
            tier: "Specialization Passive",
            icon: "Radiant/Radiant Golden Shield",
            description:
              "Your healing spells during Waxing Moon deal 1d4 blight damage to you but heal for 50% more. During Waning Moon, you recover 25% of all healing you deal to others as self-healing (vampiric feedback). This is the only reliable way a Lunarch can sustain themselves.",
            uniqueTo: "Sanguine Warden",
          },
          {
            name: "Parasitic Sanctuary",
            tier: "Specialization Passive",
            icon: "Healing/Prayer",
            description:
              "During New Moon (Memory Eater), all allies within 15 feet gain +1 DR as the parasite's defensive reflexes extend to protect nearby life signatures. During Waning Moon, allies healed by you also gain 1d6 temporary HP from the parasite's residue — starlight-scabbed wounds that harden into protective barriers.",
            uniqueTo: "Sanguine Warden",
          },
        ],

        recommendedSpells: [
          "Sanguine Transfer - Heal an ally at the cost of your own HP",
          "Sanguine Rites - Major heal during Waxing Moon for massive recovery",
          "Sanguine Deluge - AoE heal at massive self-cost during critical moments",
          "Phase Tear - Shift to Waning Moon to recover via vampiric feedback",
        ],
      },
    ],
  },

  // Example Spells - showcasing Phase Shift mechanics
  exampleSpells: [
    // MOONLIGHT SENTINEL - Precision Archery ? HOLLOW SENTINEL - Precision Killer
    { id : "lunarch_parasitic_bolt",
      name: "Parasitic Bolt",
      description:
        "Channel a sliver of the parasite's hunger into a bolt of condensed starlight that burrows into the target. The casting opens a seam in your palm — you bleed, they bleed, the parasite feeds on both.",
      spellType: "ACTION",
      icon: "Arcane/Star Trail Path",
      level: 1,
      specialization: "universal",
      effectTypes: ["damage"],

      typeConfig: {
        school: "ember",
        icon: "Arcane/Star Trail Path",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: ["enemy"],
      },

      durationConfig: {
        durationType: "instant",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 4 },
        actionPoints: 1,
        components: ["somatic"],
        somaticText: "Press palm open, channel starlight through",
      },

      resolution: "DICE",

      damageConfig: {
        formula: "1d8 + intelligence/4",
        damageTypes: ["ember"],
        resolution: "DICE",
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },

      specialMechanics: {
        phaseInteraction: {
          newMoon: "Damage type becomes necrotic. Target loses 1d4 mana or takes 1d4 extra necrotic if no mana.",
          waxingMoon: "Add +1d4 ember damage. Take 1 blight damage.",
          fullMoon: "Add +1d8 ember damage and increase crit range by 2.",
          waningMoon: "Heal for 25% of damage dealt. Costs 1 less mana (minimum 1).",
        },
        triggerConfig: {
          triggers: [
            { id: "lunarch_parasitic_bolt_parasitic_toll", name: "Parasitic Toll", triggerType: "on_cast", action: "The rift-parasite feeds on your flesh: selfDamage applies on cast." }
          ]
        },
        selfDamage: "Take 1d4 blight damage when you cast this spell",
        phaseAdvancement: 1,
      },

      tags: ["ember", "damage", "ranged", "phase dependent", "self damage"],
    },

    { id : "lunarch_phase_tear",
      name: "Phase Tear",
      description:
        "Channel the parasite's hunger to fuel a violent phase shift, releasing a shockwave of stellar energy that damages nearby enemies based on which horror you drag yourself into.",
      spellType: "ACTION",
      icon: "Force/Explosion Burst",
      level: 1,
      specialization: "universal",
      effectTypes: ["damage", "utility"],

      typeConfig: {
        school: "arcane",
        icon: "Force/Explosion Burst",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self_centered",
      },

      durationConfig: {
        durationType: "instant",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 8 },
        actionPoints: 1,
        components: ["somatic"],
        somaticText: "Press into the starlight seams and pull",
      },

      resolution: "DICE",

      damageConfig: {
        formula: "1d6",
        damageTypes: ["ember"],
        resolution: "DICE",
        savingThrow: {
          ability: "constitution",
          difficultyClass: 13,
          saveOutcome: "half_damage",
        },
      },

      utilityConfig: {
        utilityType: "stance_change",
        selectedEffects: [
          { id: "phase_tear_shift",
            name: "Forced Phase Shift",
            description: "Tear yourself into an adjacent phase, triggering a stellar shockwave and the chosen phase's effects on nearby enemies."
          },
        ],
        duration: 0,
        durationUnit: "instant",
        concentration: false,
        power: "minor",
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },

      specialMechanics: {
        phaseInteraction: {
          newMoon: "Enemies within 10 ft lose 1d4 mana or take 1d4 psychic. Gain +1 DR until next turn.",
          waxingMoon: "Enemies within 10 ft take 1d4 extra radiant. Gain +10 ft speed until next turn.",
          fullMoon: "Enemies within 15 ft take 2d6 radiant. Gain +1d6 radiant on next attack.",
          waningMoon: "Enemies within 10 ft slowed 1 round (save negates). Heal 1d4 HP.",
        },
        shiftEffect: "Force manual phase shift. Deals 1d8+2 necrotic and triggers Transition Shock.",
      },

      tags: ["utility", "phase shift", "damage", "universal", "self damage"],
    },

    { id : "lunarch_moon_touched_wound",
      name: "Moon-Touched Wound",
      description:
        "Strike a target in melee with a hand seething with parasitic starlight. The wound glows with cold light and inflicts a phase-dependent affliction.",
      spellType: "ACTION",
      icon: "Arcane/Magical Cross Emblem 2",
      level: 1,
      specialization: "universal",
      effectTypes: ["damage", "debuff"],

      typeConfig: {
        school: "ember",
        icon: "Arcane/Magical Cross Emblem 2",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "melee",
        rangeDistance: 10,
        targetRestrictions: ["enemy"],
      },

      durationConfig: {
        durationType: "rounds",
        durationValue: 2,
        durationUnit: "rounds",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 3 },
        actionPoints: 1,
        components: ["somatic"],
        somaticText: "Trace starlight-infused patterns across flesh",
      },

      resolution: "DICE",

      damageConfig: {
        formula: "1d6 + intelligence/4",
        damageTypes: ["ember"],
        resolution: "DICE",
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },

      debuffConfig: {
        debuffType: "statusEffect",
        durationValue: 2,
        durationType: "rounds",
        durationUnit: "rounds",
        effects: [
          { id : "star_sickness_minor",
            name: "Star-Sick Wound",
            description: "Wound glows with cold starlight. Phase-dependent debuff.",
            statusType: "weakened",
            level: "minor",
            mechanicsText: "Effect varies by current phase",
          },
        ],
      },

      specialMechanics: {
        phaseInteraction: {
          newMoon: "Target has disadvantage on next attack roll.",
          waxingMoon: "Target takes 1d4 necrotic per round for 2 rounds.",
          fullMoon: "Target has disadvantage on all saves for 2 rounds.",
          waningMoon: "Target loses 5 ft speed for 2 rounds.",
        },
      },

      tags: ["ember", "damage", "debuff", "melee", "phase dependent", "universal"],
    },

    { id : "lunarch_crescent_blade",
      name: "Crescent Blade",
      description:
        "Sweep a blade of crystallized parasite-secretion in a horizontal arc. It cuts cleanly but feeds on your nerve endings with each swing.",
      spellType: "ACTION",
      icon: "Arcane/Magical Cross Emblem 2",
      level: 2,
      specialization: "universal",
      effectTypes: ["damage"],

      typeConfig: {
        school: "ember",
        icon: "Arcane/Magical Cross Emblem 2",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "cone",
        rangeType: "melee",
        rangeDistance: 15,
      },

      durationConfig: {
        durationType: "instant",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 6 },
        actionPoints: 1,
        components: ["somatic"],
        somaticText: "Sweep arm, excrete crystallized parasite membrane",
      },

      resolution: "DICE",

      damageConfig: {
        formula: "2d8",
        damageTypes: ["ember"],
        resolution: "DICE",
        savingThrow: {
          ability: "agility",
          difficultyClass: 14,
          saveOutcome: "half_damage",
        },
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },

      specialMechanics: {
        phaseInteraction: {
          newMoon: "Damage type becomes necrotic. Targets have disadvantage on next attack.",
          waxingMoon: "Add +1d4 radiant. Take 1d4 necrotic yourself.",
          fullMoon: "Add +1d8 radiant, increase crit range by 1.",
          waningMoon: "Heal for 25% of total damage dealt. Costs 1 less mana.",
        },
      },

      tags: ["ember", "damage", "cone", "phase dependent", "universal"],
    },

    { id : "lunarch_parasitic_stride",
      name: "Parasitic Stride",
      description:
        "The parasite partially phases your body, allowing you to glide through space trailing starlight contamination. You do not run — you are pulled by the parasite's gravitational will.",
      spellType: "ACTION",
      icon: "Nature/Ethereal Bird",
      level: 2,
      specialization: "universal",
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

      durationConfig: {
        durationType: "instant",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 6 },
        actionPoints: 1,
        components: ["somatic"],
        somaticText: "Let the parasite pull, body phases partially",
      },

      resolution: "AUTOMATIC",

      utilityConfig: {
        utilityType: "movement",
        selectedEffects: [
          { id : "parasitic_stride",
            name: "Parasitic Stride",
            distance: 30,
            needsLineOfSight: false,
            isSpeedBoost: true,
            grantsOpportunityAttackImmunity: true,
          },
        ],
        duration: 0,
        durationUnit: "instant",
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },

      specialMechanics: {
        trailDamage: "Leave a 5 ft trail of starlight. Enemies entering take 1d4 radiant. Duration: 1 round.",
        phaseInteraction: {
          newMoon: "Speed 45 ft. Trail deals necrotic. Invisible until end of turn.",
          waxingMoon: "Gain +1d4 damage on next attack this turn.",
          fullMoon: "Gain advantage on next attack. Trail deals 1d6 radiant.",
          waningMoon: "Heal 25% of trail damage. Mana cost reduced by 1.",
        },
      },

      tags: ["utility", "movement", "trail damage", "phase dependent", "universal"],
    },

    { id : "lunarch_celestial_rejection",
      name: "Celestial Rejection",
      description:
        "PASSIVE: +25% Bludgeoning vulnerability (starlight-infused organs rupture under blunt trauma). Immune to standard magical healing — the parasite devours foreign magic, dealing wyrd damage equal to 50% of heal amount instead. Only your own phase-specific restoration works.",
      level: 1,
      spellType: "PASSIVE",
      icon: "Force/Explosion Burst",
      effectTypes: ["passive", "debuff"],
      typeConfig: {
        school: "arcane",
        icon: "Force/Explosion Burst",
        tags: ["passive", "lunarch", "fatal flaw"],
      },
      targetingConfig: { targetingType: "self" },
      resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 0 },
      resolution: "AUTOMATIC",
      debuffConfig: {
        debuffType: "statusEffect",
        durationValue: 0,
        durationType: "permanent",
        durationUnit: "permanent",
        effects: [
          { id : "bludgeoning_vulnerability",
            name: "Organ Rupture",
            description: "+25% Bludgeoning damage taken. Starlight-infused organs rupture under blunt force.",
            statusType: "vulnerability",
            level: "major",
            mechanicsText: "+25% Bludgeoning damage taken",
          },
          { id : "healing_rejection",
            name: "Magic Devourer",
            description: "Magical healing deals wyrd damage equal to 50% of heal amount. The parasite devours foreign magic.",
            statusType: "cursed",
            level: "major",
            mechanicsText: "Magical healing deals 50% wyrd damage instead",
          },
        ],
      },
      tags: ["passive", "lunarch", "fatal flaw", "vulnerability"],
    },

    { id : "lunarch_phase_lock",
      name: "Phase Lock",
      description:
        "PASSIVE: Taking damage during a manual phase shift interrupts it. Mana and blight cost are still paid but the shift fails.",
      level: 1,
      spellType: "PASSIVE",
      icon: "Arcane/Spiral Vortex",
      effectTypes: ["passive"],
      typeConfig: {
        school: "arcane",
        icon: "Arcane/Spiral Vortex",
        tags: ["passive", "lunarch", "weakness"],
      },
      targetingConfig: { targetingType: "self" },
      resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 0 },
      resolution: "AUTOMATIC",
      tags: ["passive", "lunarch", "weakness"],
    },

    { id : "lunarch_transition_shock",
      name: "Transition Shock",
      description:
        "PASSIVE: Every phase shift forces a 1d6 Transition Shock roll. 1=Tissue Rupture (2d6 blight), 2=Synaptic Flash (blinded 1 rnd), 3=Mana Hemorrhage (lose 2d4 mana), 4=Temporal Dissonance (lose 1 AP next turn), 5=Wyrd Whiplash (1d6 wyrd + disadv next save), 6=Parasitic Mercy (1 blight only).",
      level: 1,
      spellType: "PASSIVE",
      icon: "Force/Explosion Burst",
      effectTypes: ["passive"],
      typeConfig: {
        school: "arcane",
        icon: "Force/Explosion Burst",
        tags: ["passive", "lunarch", "transition shock"],
      },
      targetingConfig: { targetingType: "self" },
      resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 0 },
      resolution: "AUTOMATIC",
      tags: ["passive", "lunarch", "transition shock"],
    },

    // STARFALL INVOKER ? SILENCE SPEAKER
    { id : "lunarch_silence_rend",
      name: "Silence Rend",
      description:
        "Tear reality open in a 15ft radius. Cold, predatory starlight bleeds through, dealing 2d6 radiant damage and contaminating all enemies with Star-Sickness.",
      level: 1,
      spellType: "ACTION",
      icon: "Arcane/Quick Step",
      specialization: "silence-speaker",
      effectTypes: ["damage", "debuff"],

      typeConfig: {
        school: "ember",
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
        targetRestrictions: ["enemy"],
      },

      durationConfig: {
        durationType: "instant",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 8 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "A word that sounds like glass breaking in a vacuum",
        somaticText: "Claw at the air until it bleeds light",
      },

      resolution: "DICE",

      damageConfig: {
        formula: "2d6",
        damageTypes: ["ember"],
        resolution: "DICE",
        savingThrow: {
          ability: "agility",
          difficultyClass: 14,
          saveOutcome: "half_damage",
        },
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },

      debuffConfig: {
        debuffType: "statusEffect",
        durationValue: 2,
        durationType: "rounds",
        durationUnit: "rounds",
        effects: [
          { id : "star_sickness",
            name: "Star-Sickness",
            description: "Contaminated by cosmic rift-energy. Disadvantage on next attack, 1d4 radiant at start of turn.",
            statusType: "sickened",
            level: "moderate",
            mechanicsText: "Disadvantage on next attack and 1d4 radiant/turn for 2 rounds",
          },
        ],
      },

      specialMechanics: {
        phaseInteraction: {
          fullMoon: "Radius increases to 20 ft. Star-Sickness deals 1d6 radiant/turn.",
          waxingMoon: "Radius increases by 5 ft (Silence Aperture passive).",
        },
      },

      tags: ["ember", "damage", "aoe", "debuff", "star-sickness", "silence-speaker"],
    },

    { id : "lunarch_sanguine_transfer",
      name: "Sanguine Transfer",
      description:
        "Open a seam in your flesh and channel stolen life force through into an ally. Blood-tinged moonlight seals their wounds. You lose HP. They gain HP.",
      spellType: "ACTION",
      icon: "Healing/Prayer",
      level: 2,
      specialization: "sanguine-warden",
      effectTypes: ["healing"],

      typeConfig: {
        school: "ember",
        icon: "Healing/Prayer",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 40,
        targetRestrictions: ["ally"],
      },

      durationConfig: {
        durationType: "instant",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 5 },
        actionPoints: 1,
        components: ["somatic"],
        somaticText: "Open a starlight seam along your forearm",
      },

      resolution: "DICE",

      healingConfig: {
        formula: "2d8 + spirit",
        healingType: "direct",
        resolution: "DICE",
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },

      specialMechanics: {
        triggerConfig: {
          triggers: [
            { id: "lunarch_sanguine_transfer_parasitic_toll", name: "Parasitic Toll", triggerType: "on_cast", action: "The rift-parasite feeds on your flesh: selfDamage applies on cast." }
          ]
        },
        selfDamage: "Take 1d6 necrotic when cast. During Waxing: take 1d4 extra but healing +50%.",
        phaseAdvancement: 1,
        phaseInteraction: {
          waxingMoon: "Healing +50%. Take 1d4 extra necrotic. Target gains 1d6 temp HP.",
          fullMoon: "Also cleanses one poison or disease from target.",
          waningMoon: "Recover 25% of healing dealt as self-healing (vampiric feedback).",
          newMoon: "Target also gains +1 DR for 1 round.",
        },
      },

      tags: ["healing", "self damage", "sanguine warden"],
    },

    { id : "lunarch_hollow_sight",
      name: "Hollow Sight",
      description:
        "Focus the parasite's alien perception through your starlight sockets, searing a sigil into a target that only you can see. The sigil burns through armor, through walls, through flesh.",
      spellType: "ACTION",
      icon: "Piercing/Targeted Strike",
      level: 3,
      specialization: "hollow-sentinel",
      effectTypes: ["damage", "debuff"],

      typeConfig: {
        school: "ember",
        icon: "Piercing/Targeted Strike",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 80,
        targetRestrictions: ["enemy"],
      },

      durationConfig: {
        durationType: "rounds",
        durationValue: 2,
        durationUnit: "rounds",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 7 },
        actionPoints: 1,
        components: ["somatic"],
        somaticText: "Focus starlight through hollowed eyes",
      },

      resolution: "DICE",

      damageConfig: {
        formula: "3d6",
        damageTypes: ["ember"],
        resolution: "DICE",
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },

      debuffConfig: {
        debuffType: "statusEffect",
        durationValue: 2,
        durationType: "rounds",
        durationUnit: "rounds",
        effects: [
          { id : "hollow_mark",
            name: "Hollow Mark",
            description: "Marked by the parasite. Ignore 25% DR. +1d6 from next spell.",
            statusType: "marked",
            level: "moderate",
            mechanicsText: "Ignore 25% DR, +1d6 next spell, 2 rounds",
          },
        ],
      },

      specialMechanics: {
        phaseInteraction: {
          fullMoon: "Mark lasts 3 rounds. Bonus damage 1d8. Advantage on next attack vs target below half HP.",
          waxingMoon: "Mark also deals 1d4 blight/round.",
          waningMoon: "Duration +1 round. Heal 25% of damage to marked target.",
        },
      },

      tags: ["ember", "damage", "debuff", "mark", "hollow sentinel"],
    },

    // LEVEL 5 SPELLS
    { id : "lunarch_silence_beam",
      name: "Silence Beam",
      description:
        "Open a rift along a line and pour the Silence's hatred through it. Enemies are scorched by cold starlight and contaminated with cosmic sickness.",
      level: 5,
      spellType: "ACTION",
      icon: "Arcane/Missile",
      specialization: "silence-speaker",
      effectTypes: ["damage", "debuff"],

      typeConfig: {
        school: "ember",
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
        targetRestrictions: ["enemy"],
      },

      durationConfig: {
        durationType: "instant",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 9 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "A sound like a star dying",
        somaticText: "Extend both arms, claw a rift through the air",
      },

      resolution: "SAVE",

      damageConfig: {
        formula: "4d6",
        damageTypes: ["ember"],
        resolution: "DICE",
        savingThrow: {
          ability: "agility",
          difficultyClass: 15,
          saveOutcome: "half_damage",
        },
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },

      debuffConfig: {
        debuffType: "statusEffect",
        durationValue: 1,
        durationType: "rounds",
        durationUnit: "rounds",
        effects: [
          { id : "star_sickness_beam",
            name: "Star-Sickness",
            description: "Contaminated by silence beam. Disadvantage on next attack, 1d4 radiant at start of turn.",
            statusType: "sickened",
            level: "moderate",
            mechanicsText: "Disadvantage on next attack and 1d4 radiant/turn for 1 round",
          },
        ],
      },

      specialMechanics: {
        phaseInteraction: {
          fullMoon: "Star-Sickness 2 rounds. +1d6 damage. Line width 10 ft.",
          waxingMoon: "Line length 40 ft. +5 ft radius (Silence Aperture).",
          waningMoon: "Heal 25% of total damage. Mana cost reduced by 2.",
        },
      },

      tags: ["ember", "damage", "line", "debuff", "star-sickness", "silence-speaker"],
    },

    { id : "lunarch_binding_horror",
      name: "Binding Horror",
      description:
        "Project parasitic tendrils from the seams in your arms that wrap around a target, constricting and feeding. The tendrils are alive — extensions of the parasite.",
      spellType: "ACTION",
      icon: "Frost/Confused",
      level: 3,
      specialization: "universal",
      effectTypes: ["control"],

      typeConfig: {
        school: "ember",
        icon: "Frost/Confused",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 40,
        targetRestrictions: ["enemy"],
      },

      durationConfig: {
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 10 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "A command in a language that predates speech",
        somaticText: "Extend arms, let tendrils extrude from the seams",
      },

      resolution: "SAVE",

      controlConfig: {
        controlType: "restraint",
        duration: 3,
        durationUnit: "rounds",
        savingThrow: {
          ability: "strength",
          difficultyClass: 15,
          saveOutcome: "negates",
        },
        effects: [
          { id : "parasitic_bind",
            name: "Parasitic Bind",
            description: "Restrained by living tendrils. Cannot move. 1d4 blight/turn as tendrils feed.",
            config: {
              restraintType: "parasitic_bind",
              saveType: "strength",
              saveDC: 15,
              duration: 3,
              durationUnit: "rounds",
              immobilize: true,
            },
          },
        ],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },

      specialMechanics: {
        phaseInteraction: {
          newMoon: "Target loses 1d4 mana/round or takes 1d4 psychic.",
          waxingMoon: "Disadvantage on initial save.",
          fullMoon: "Tendrils deal 1d6 ember/round. Duration 4 rounds.",
          waningMoon: "Heal 25% of tendril damage. Mana cost reduced by 2.",
        },
      },

      tags: ["control", "restrain", "parasitic", "universal"],
    },

    // LEVEL 7 SPELLS
    { id : "lunarch_silence_supernova",
      name: "Silence Supernova",
      description:
        "Detonate a rift-core above your enemies. The explosion is not fire — it is the Silence remembering what light used to be, and hating it. Enemies are scorched and contaminated with mass delirium.",
      level: 7,
      spellType: "ACTION",
      icon: "Fire/Shadowy Blaze",
      specialization: "silence-speaker",
      effectTypes: ["damage", "debuff"],

      typeConfig: {
        school: "ember",
        icon: "Radiant/Radiant Glow",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 90,
        areaType: "circle",
        areaSize: 25,
        targetRestrictions: ["enemy"],
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 35 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "A syllable that sounds like a star collapsing",
        somaticText: "Pull a rift-core from your own chest and hurl it skyward",
      },

      resolution: "DICE",

      damageConfig: {
        formula: "7d10 + intelligence",
        damageTypes: ["ember"],
        resolution: "DICE",
        savingThrow: {
          ability: "constitution",
          difficultyClass: 17,
          saveOutcome: "half_damage",
        },
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 4 },

      debuffConfig: {
        debuffType: "statusEffect",
        durationValue: 2,
        durationType: "rounds",
        durationUnit: "rounds",
        effects: [
          { id : "mass_delirium",
            name: "Cosmic Delirium",
            description: "Mind shattered by silence supernova. Disadvantage on all rolls for 2 rounds.",
            statusType: "confused",
            level: "strong",
            mechanicsText: "Disadvantage on all rolls for 2 rounds (Con save DC 17 to negate)",
          },
        ],
      },

      specialMechanics: {
        triggerConfig: {
          triggers: [
            { id: "mass_delirium_parasitic_toll", name: "Parasitic Toll", triggerType: "on_cast", action: "The rift-parasite feeds on your flesh: selfDamage applies on cast." }
          ]
        },
        selfDamage: "Take 3d6 necrotic (tearing the rift-core from your chest).",
        phaseAdvancement: 1,
        phaseInteraction: {
          fullMoon: "Radius 30 ft. Delirium 3 rounds. +2d10 radiant.",
          waningMoon: "Heal 25% of damage. Delirium duration +1 round.",
        },
      },

      tags: ["damage", "control", "debuff", "ember", "silence-speaker"],
    },

    // LEVEL 8 SPELLS
    { id : "lunarch_silence_constellation",
      name: "Silence Constellation",
      description:
        "Summon a constellation of rift-wounds across the battlefield, each one firing a beam of cold silence-light at a different enemy. The constellation persists for moments — long enough to scar reality and everything caught in its geometry.",
      level: 8,
      spellType: "ACTION",
      icon: "Arcane/Starlight Ray",
      specialization: "silence-speaker",
      effectTypes: ["damage", "debuff"],

      typeConfig: {
        school: "ember",
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
        resourceValues: { mana: 42 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "The names of six dead stars, spoken in sequence",
        somaticText: "Draw the constellation in the air with bleeding fingers",
      },

      resolution: "DICE",

      damageConfig: {
        formula: "6d8 + intelligence",
        damageTypes: ["ember"],
        resolution: "DICE",
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 4 },

      debuffConfig: {
        debuffType: "statusEffect",
        durationValue: 2,
        durationType: "rounds",
        durationUnit: "rounds",
        effects: [
          { id : "star_sickness_constellation",
            name: "Star-Sickness",
            description: "Contaminated by silence constellation. Disadvantage on attacks, 1d4 radiant/turn.",
            statusType: "sickened",
            level: "strong",
            mechanicsText: "Disadvantage on attacks and 1d4 radiant/turn for 2 rounds",
          },
        ],
      },

      specialMechanics: {
        triggerConfig: {
          triggers: [
            { id: "star_sickness_constellation_parasitic_toll", name: "Parasitic Toll", triggerType: "on_cast", action: "The rift-parasite feeds on your flesh: selfDamage applies on cast." }
          ]
        },
        selfDamage: "Take 3d6 necrotic. Each rift-wound bleeds you as it fires.",
        phaseAdvancement: 1,
        phaseInteraction: {
          fullMoon: "8 targets. +1d8 radiant each. Star-Sickness deals 1d6/turn.",
          waningMoon: "Heal 25% of total damage. Mana cost reduced by 4.",
        },
      },

      tags: ["damage", "multi target", "debuff", "ember", "silence-speaker"],
    },

    { id : "lunarch_skyhole",
      name: "Skyhole",
      description:
        "Tear open the sky above a battlefield. Raw, predatory starlight pours through the wound in reality, scorching everything below. The tear persists — a gaping hole where the sky used to be, raining cosmic radiation each round.",
      level: 9,
      spellType: "ACTION",
      icon: "Arcane/Star Trail Path",
      specialization: "silence-speaker",
      effectTypes: ["damage"],

      typeConfig: {
        school: "ember",
        icon: "Arcane/Star Trail Path",
        castTime: 2,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 120,
        areaType: "circle",
        areaSize: 40,
        targetRestrictions: ["enemy"],
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 60 },
        actionPoints: 3,
        components: ["verbal", "somatic"],
        verbalText: "The sound of the sky being ripped open like cloth",
        somaticText: "Reach upward and PULL the firmament apart",
      },

      resolution: "DICE",

      damageConfig: {
        formula: "12d8 + intelligence * 2",
        damageTypes: ["ember"],
        resolution: "DICE",
        savingThrow: {
          ability: "agility",
          difficultyClass: 19,
          saveOutcome: "half_damage",
        },
      },

      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },

      specialMechanics: {
        triggerConfig: {
          triggers: [
            { id: "lunarch_skyhole_parasitic_toll", name: "Parasitic Toll", triggerType: "on_cast", action: "The rift-parasite feeds on your flesh: selfDamage applies on cast." }
          ]
        }
      },
    },
    {
      "id": "lunarch_void_chill",
      "name": "Silence-Chill",
      "description": "The parasite has made your blood a piece of the Silence between stars. For the duration you radiate an otherworldly cold: freeze a plane of water, crust a wet surface in ice, snuff small flames and heat-signatures, and chill drinks or preserve food. The same aura marks you as deeply, unsettlingly alien  —  advantage on Intimidation, disadvantage on Persuasion and warmth-based rapport. Out of combat.",
      "level": 3,
      "spellType": "ACTION",
      "icon": "Frost/Ice Shard",
      "typeConfig": { "school": "rime", "icon": "Frost/Ice Shard", "tags": ["utility", "cold", "exploration", "social", "lunarch"], "castTime": 1, "castTimeType": "IMMEDIATE" },
      "targetingConfig": { "targetingType": "self", "rangeType": "self" },
      "resourceCost": { "actionPoints": 1, "resourceTypes": ["mana"], "resourceValues": { "mana": 6 }, "components": ["somatic"], "somaticText": "Let the silence-cold bleed out through your skin" },
      "resolution": "NONE",
        "effectTypes": ["utility"],
        "utilityConfig": {
          "utilityType": "environment",
          "selectedEffects": [ { "id": "void_chill_cold", "name": "Dead-Moon Cold", "description": "For 1 hour: freeze water/crust ice, snuff small flames and heat-signatures, chill/preserve items. Your alien aura grants advantage on Intimidation but disadvantage on Persuasion  —  you radiate a cold that isn't entirely of this world.", "mechanicsText": "Freeze water/snuff flames; +Intimidation, -Persuasion 1 hour." } ],
          "duration": 1, "durationUnit": "hours", "concentration": false, "power": "moderate"
        },
        "cooldownConfig": { "cooldownType": "turn_based", "cooldownValue": 0 },
        "tags": ["utility", "cold", "exploration", "social", "lunarch"]
      },
      {
        "id": "lunarch_phase_stasis",
        "name": "Phase Stasis",
        "description": "Force the parasite into a single phase of dormancy for a few hours, buying yourself a window of lucid rest. The involuntary cycle pauses, you take no feeding damage, and you recover with advantage  —  but you cannot cast phase spells, and at the end the parasite wakes hungry, dealing a Transition Shock on emergence. Out of combat.",
        "level": 2,
        "spellType": "ACTION",
        "icon": "Utility/Utility",
        "typeConfig": { "school": "arcane", "icon": "Utility/Utility", "tags": ["utility", "rest", "lunarch"], "castTime": 1, "castTimeType": "MINUTES" },
        "targetingConfig": { "targetingType": "self", "rangeType": "self" },
        "resourceCost": { "actionPoints": 1, "resourceTypes": ["mana"], "resourceValues": { "mana": 10 }, "components": ["verbal", "somatic"], "somaticText": "Press both hands over the parasite's seat at the base of your skull and hold it still" },
        "resolution": "NONE",
        "effectTypes": ["utility"],
        "utilityConfig": {
          "utilityType": "rest",
          "selectedEffects": [ { "id": "phase_stasis_dormant", "name": "Dormant Parasite", "description": "For up to 4 hours the involuntary cycle pauses: no feeding damage, no phase penalties, advantage on rest recovery. You cannot cast Lunarch spells during stasis. On emergence, roll once on the Transition Shock Table  —  the parasite wakes hungry.", "mechanicsText": "Pause parasite cycle 4h; advantage on rest; Transition Shock on wake." } ],
          "duration": 4, "durationUnit": "hours", "concentration": false, "power": "moderate"
        },
        "cooldownConfig": { "cooldownType": "long_rest", "cooldownValue": 1 },
        "tags": ["utility", "rest", "lunarch"]
      }
  ],
};
