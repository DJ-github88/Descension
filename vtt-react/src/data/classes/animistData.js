export const ANIMIST_DATA = {
  restrictions: {
      "allowedSubraces": [
          "ordan_human",
          "sylen_astril",
          "clean_vreken",
          "morren_human",
          "skald_human",
          "velun_neth"
      ],
      "hardBlocks": [
          "emberth",
          "fexrick",
          "myrathil",
          "tessen_human"
      ],
      "narrativeUnlock": true,
      "justification": "Requires ancestral spirit-channeling. Emberth commune with volcanic entities (different paradigm). Fexrick see spirits as machine-failure states. Tessen isolation prevents access. Myrathil have no land spirit tradition."
  },

  /**
   * Subrace Variants — the Animist is three traditions fused (totemic, runic, spore),
   * and each allowed subrace practices one of the three — or a fourth, stranger variant
   * born of debt or contract. The ancestral language they share is fracturing.
   */
  subraceVariants: {
    ordan_human: {
      subraceName: 'Ordan',
      title: 'The Steppe-Throat',
      reframe: `The <LoreLink termId="skald">Ordan</LoreLink> Animist does not carve runes or inhale spores. They sing. The ancestor lives in the overtone — the second voice the throat produces above the fundamental — woven into the mane-hair of the migration-horse and carried fifteen miles across the <LoreLink termId="sundrift-vale">Sundrift Vale</LoreLink>. An Ordan Animist who loses their voice loses their entire lineage in a single silence.`,
      signatureAbility: {
        name: 'Overtone-Channel',
        description: `Spirit-invocations are throat-sung and carry across vast open distances, but fail utterly indoors, underground, or under heavy canopy. The totem (a braid of migration-horse mane) must face the open steppe to resonate.`
      },
      currentCrisisAngle: `The Ordan's throat-sung dialect was never written down — it lives only in muscle-memory. As the ancestral language fragments, the Ordan hear the disharmony first and loudest, and cannot cross-reference it against the runic or spore traditions because they have no text to compare. They are screaming about a fracture no one else can verify.`,
      signatureQuote: {
        text: '"The ancestor is the second voice. Kill the first, and I will still answer you with the one that matters."',
        speaker: 'Bayar Wind-Throat',
        context: 'A stepse Animist who survived losing his speaking voice to a Wyrd-strike'
      }
    },

    sylen_astril: {
      subraceName: 'Sylen Astril',
      title: 'The Constellation-Conduit',
      reframe: `The <LoreLink termId="astril">Sylen</LoreLink> seek total symbiosis with the constellation-spirits nesting in their crystalline skin. An Astril Animist does not summon a separate ancestor — they commune with the imprisoned fragment of Sol's celestial court carried in their own blood. The spirit is not external. It is the host. They channel the trapped court of a dead god through skin that hums with stellar resonance.`,
      signatureAbility: {
        name: 'Star-Communion',
        description: `Spirit-power scales with the depth of the host's symbiosis; a fully-symbiotic Sylen Animist channels the spirit as self, not as other. Power is strongest in absolute darkness — where the trapped star-light in their skin is the only light left.`
      },
      currentCrisisAngle: `The constellation-spirits in Sylen blood predate the Animist tradition — they are the loudest "ancestors" of any tradition. When the dialect fractured, the Sylen's spirits began screaming contradictory prophecies through crystalline skin. Young Sylen Animists are going mad, unable to silence a chorus that predates the language meant to speak to it.`,
      signatureQuote: {
        text: '"You call them ancestors. I call them the court of a murdered god, and they live in my forearm. Do not ask me to be quiet about it."',
        speaker: 'Lirien Bright-Veined',
        context: 'A Sylen Animist, declining to join a tri-regional communion'
      }
    },

    clean_vreken: {
      subraceName: 'Clean Vreken',
      title: 'The Spore-Inhaler',
      reframe: `The <LoreLink termId="vreken">Clean Vreken</LoreLink> inhale the loa — the ancestral dead ride bioluminescent spores into the lungs and speak through shifting glow-patterns on the skin. Their Animism is the oldest of the three root traditions, older than <LoreLink termId="kora">Kora</LoreLink>, older than the Root-Veil contract. The dead speak through mycelium, and the Clean Vreken have been breathing the dead for centuries.`,
      signatureAbility: {
        name: 'Spore-Inhalation',
        description: `The loa must be inhaled from a specific fungal strain native to the deep <LoreLink termId="bryngloom-forest">Bryngloom</LoreLink>; bonds form in the lungs and express as bioluminescent skin-text. The Clean Vreken's deep-glow makes their spirit-dialogue legible at a distance — but broadcasts every emotion to every Vreken nearby.`
      },
      currentCrisisAngle: `The fungal substrate is the Clean Vreken's dialect, and that substrate is one with the <LoreLink termId="root_veil">Root-Veil</LoreLink>. When the Root-Veil shifts, the Clean Vreken hear it as a scream. The dialect-fracture feels, to them, like the forest itself is being strangled — and they are the only tradition that feels it as physical pain.`,
      signatureQuote: {
        text: '"You carve your dead into stone. You sing them into wind. I breathe mine, and when the forest coughs, I taste blood."',
        speaker: 'Mother Ysen',
        context: 'A Clean Vreken spore-elder, explaining why she will not travel south'
      }
    },

    morren_human: {
      subraceName: 'Morren',
      title: 'The Debt-Bound',
      reframe: `The <LoreLink termId="house_morrath">Morren</LoreLink> are debtors to the Neth, and a Morren Animist channels no glorious ancestor — they summon the specific forebear whose unpaid contract still accrues interest against their family. The ancestor is not honored. The ancestor is *owed*. Every Morren family recites their contract at mealtimes; the Animist makes that recitation literal.`,
      signatureAbility: {
        name: 'Contract-Invocation',
        description: `The spirit summoned is the family's debt-ancestor; it bargains for service rather than aiding freely, each invocation incrementally renegotiating an inherited obligation. Power, for a Morren Animist, is also a form of payment — and the interest compounds.`
      },
      currentCrisisAngle: `The Morren are the only tradition whose ancestors are *legally* bound. When the dialect fractured, the debt-ancestors began refusing to acknowledge renegotiations — demanding the original terms, in the original language, which the living no longer speak correctly. Families are being called to account for debts they cannot even recite, and the Keeper's Sanction looms.`,
      signatureQuote: {
        text: '"My grandmother borrowed her survival and left me the bill. Now she will not leave until I have read it back to her, correctly, in a language neither of us remembers."',
        speaker: 'Petr Debt-Son',
        context: 'A Morren Animist, the night before his family\'s contract-review'
      }
    },

    skald_human: {
      subraceName: 'Skald',
      title: 'The Rune-Keeper',
      reframe: `Where the Ordan sing and the Vreken inhale, the <LoreLink termId="skald">Skald</LoreLink> inscribe. They carve their ancestors' names into their own skin — the rune IS the ancestor, and the scar-tissue is its house. A Skald Animist covered in runic scars carries a permanent retinue of the dead, each anchored to a specific wound that never fully closes.`,
      signatureAbility: {
        name: 'Skin-Rune Anchoring',
        description: `Spirits are bound to carved runes on the Animist's own body; the more runes, the more ancestors on call — but each rune is a permanent open wound that re-opens and bleeds during invocation. A Skald Animist's power is written, visibly, in their scars.`
      },
      currentCrisisAngle: `The Skald's runic dialect is the most rigid — carved in flesh, it cannot adapt. When the ancestral language shifted, the runes did not shift with it. Carved ancestors are now speaking a dialect no living practitioner matches, and the runes, cut in good faith eight generations ago, are beginning to itch, warm, and — some swear — migrate.`,
      signatureQuote: {
        text: '"My great-grandmother carved this name into her own arm so it would outlast the glacier. It has. She has not been so cooperative."',
        speaker: 'Hakon Scar-List',
        context: 'A Rune-Keeper of the Frozen Archive, counting his open wounds'
      }
    },

    velun_neth: {
      subraceName: 'Velun Neth',
      title: 'The Ledger-Summoner',
      reframe: `The <LoreLink termId="neth">Velun Neth</LoreLink> cannot lie, and cannot forget — the Keeper enforces both. A Velun Neth Animist does not commune with the dead; they *file a request*. The ancestor is a recorded entry in the great archive of <LoreLink termId="atropolis">Atropolis</LoreLink>, summoned through proper citation, offer, and acknowledgment of outstanding obligation.`,
      signatureAbility: {
        name: 'Ledger-Citation',
        description: `Spirits are summoned by referencing their exact entry in the archive; the more precise the citation (full name, dates, contract history), the stronger the bond. A mis-citation summons the wrong ancestor — and the Velun Neth cannot legally dismiss what they have invoked.`
      },
      currentCrisisAngle: `The Velun Neth are the tradition most committed to a unified ancestral language — it is their filing system. The dialect-fracture is, to them, a corruption of the archive itself. Some senior Ledger-Summoners suspect the <LoreLink termId="keeper_of_the_last_threshold">Keeper</LoreLink> is permitting it — that the death-threshold guardian is, for reasons of its own, redacting the dead.`,
      signatureQuote: {
        text: '"You speak to your ancestors. I file a motion to hear mine. The difference is that mine always answer, and the answer is always admissible."',
        speaker: 'Clerk Vel-Ossaren',
        context: 'A senior Ledger-Summoner, declining an invitation to a spirit-communion'
      }
    }
  },

  id: "animist",
  name: "Animist",
  icon: "fas fa-seedling",
  role: "Support / Control / Terrain",
  damageTypes: ["primal", "blight", "storm", "physical", "ember"],
  implemented: true,
  

  classIdentity: {
    title: "The Ancestral Conduit",
    subtitle: "Blood-Bound Voice of the Wild and the Written Word",
    utility: "Channel three distinct ancestral traditions through a single unified resource. The Animist erupts bone totems from self-mutilation (Primalist heritage), invokes ancient spirits through curse-driven invocation rituals (Witch Doctor heritage), and carves permanent runic networks into earth and flesh (Inscriptor heritage). They simultaneously terraform the battlefield, summon specters, and inscribe divine sigils, paying for every manifestation with their own blood, memories, and sanity.",
    fatalFlaw: "Triple catastrophic flaw from fused traditions. Spirit Erosion at 15+ Ancestral Resonance: 100% ember vulnerability, cannot receive party healing, forced movement shatters active runic networks dealing backlash, and the spirits demand service with 1d6 wyrd/turn if you hoard resonance without invoking. The Animist walks three tightropes simultaneously, and falling from any one is devastating."
  },

  livingOrder: {
    orderName: 'The Ancestral Convergence',
    founder: {
      name: '<LoreLink termId="triune-founders">The Triune Founders</LoreLink> — Kael, Nyssa, Theron',
      status: `All dead. The three carriers met at a crossroads and recognized each other's scars. The crossroads is now the Convergence shrine, rotating between the three regions.`,
      note: `Kael (<LoreLink termId="skald">Ordan</LoreLink>, totemic), Nyssa (<LoreLink termId="vreken">Vreken</LoreLink>, spore), and Theron (<LoreLink termId="skald">Skald</LoreLink>, runic) merged their traditions when they realized they spoke dialects of a single ancestral language.`
    },
    currentLeader: {
      name: '<LoreLink termId="sera-three-scars">Convenor Sera Three-Scars</LoreLink>',
      title: 'Voice of the Convergence',
      characterization: `A Morren woman who bears the marks of all three traditions — throat-sung overtones, inhaled spores, and a single carved rune on her collarbone. She is the only living Animist who can still hold all three dialects at once, which is also slowly killing her. She convenes the tri-regional councils and translates between traditions that no longer fully understand each other.`
    },
    headquarters: { name: 'The Convergence Crossroads (archive seat: the Frozen Archive)', locationId: 'frozen_archive' },
    crisisConnection: `<LoreLink termId="sera-three-scars">Sera Three-Scars</LoreLink> is the Convergence's last fluent translator, and the dialect-fracture is eroding even her ability to bridge the three traditions. When she can no longer hold all three dialects, the Convergence dissolves — and with it the Animist tradition's claim to be a single art. She is searching desperately for a successor and finding none; every young Animist who attempts all three simultaneously suffers sensory collapse.`
  },

  worldFriction: [
    { region: 'nordhalla', status: 'persecuted', consequence: 'The Cleansing of the Hearth — House Skalvyr religious purge — explicitly targets tribal Animists and Sky-Readers. Practitioners caught throat-singing or skin-carving are arrested; the Runic Academies denounce ancestral communion as heresy.', workaround: 'The Skald Rune-Keeper variant survives by framing its practice as genealogy rather than magic — the runes read as record-keeping to inquisitors who do not look too closely.' },
    { region: 'sundrift-vale', status: 'persecuted', consequence: 'House Ordavan systematically purges Sky-Singers under the state-enforced ancestor worship. Ordan throat-sung Animists are the most hunted; their overtones carry for miles and cannot be hidden.' },
    { region: 'bryngloom-forest', location: 'atropolis', status: 'tolerated', consequence: 'The Velun Neth Ledger-Summoners are legally protected as archival practice; the Vreken spore-elders are tolerated as a forest-floor fixture. Bryngloom is the safest region for an Animist — provided they do not disturb the Root-Veil.' }
  ],

  overview: {
    originStory: `The Animist tradition was born from three independent discoveries of ancestral communion, separated by mountains and marshlands, later fused into a single, devastating art.

In the starless grasslands of the Sundrift Vale, the human herd-ranger Kael sat motionless for three seasons, letting bone and root erupt from his own flesh until the wind-spirits claimed him as kin. He discovered communion through totemic eruption: the sacrifice of physical form to channel the brutal laws of the wilderness.

In the lightless groves of the Bryngloom Forest, the Vreken botanist Nyssa inhaled the bioluminescent spore-dust of the bog and bargained with the ancient loa for healing power. She discovered communion through spirit invocation: the accumulation of spiritual debt that powerful beings would honor with divine intervention.

In the Frozen Archive of Nordhalla, the Skald scholar Theron carved the mathematical formulas of the ancient clockwork songs into his own skin, binding their power to his nervous system. He discovered communion through blood inscription: the permanent scarification of truth into reality itself.

The three traditions merged when Nyssa's caravan passed through the Sundrift Vale during a thaw. Kael's totems resonated with Nyssa's loa, and both recognized the runic patterns in Theron's flesh as the same ancestral language written in different scripts. Together, they founded the Animist tradition, an art that treats the world as a living text written in bone, blood, and spirit. Every eruption, every curse, every inscription is a word in the ancestral language, and the Animist is the voice that speaks it.

Carve the bone. Invoke the dead. Inscribe the earth. The ancestors remember what the living forget, and they will speak through you whether you are ready or not.`,
    title: "The Animist",
    subtitle: "Ancestral Conduit and the Triple Toll of Communion",
    quickOverview: {
      title: "Quick Overview",
      content: `**What You Need to Know**: The Animist is a tragic, triple-blooded controller who wields three ancestral traditions simultaneously. They erupt bone totems, invoke spirits through curses, and carve runic networks into the earth, paying for every manifestation with HP, memories, and sanity.

**Core Mechanic 1 (Ancestral Resonance 0-20)**: Build resonance by sacrificing HP to summon totems, cast curses, carve runes, and complete rituals. Spend resonance on devastating invocations, totem powers, and runic network activations.

**Core Mechanic 2 (Spirit Erosion)**: At 15+ resonance, the triple toll activates. You suffer 100% ember vulnerability, cannot receive party healing, and forced movement shatters your runic network. The spirits also demand service: 1d6 wyrd damage per turn if you hoard resonance without spending.

**Core Mechanic 3 (Blood Price)**: Every ability costs HP. Totem eruption costs 5 HP. Rune carving costs 1d4-2d6 slashing self-damage. Curse casting drains 1d4 blight. The Animist is always bleeding.

**Playstyle**: Extreme battlefield control through three simultaneous systems. Terraform the terrain, summon ancestral specters, and invoke spirit interventions while managing a mounting spiritual debt that threatens to consume you.`,
    },
    description: `A walking archive of three dead traditions, written in scars, bone spurs, and spiritual static. The Animist does not cast magic; they undergo grotesque physical transformation. Bone erupts from flesh as totems. Blood carves glowing sigils into stone. The voices of ancestral spirits whisper through hallucinations that cannot be silenced. Every word of ancestral power costs a piece of the self: blood, memory, sanity, or all three.`,
    roleplayIdentity: {
      title: "Roleplay Identity",
      content: `**HISTORY: THE TRIPLE GENESIS**
The Animist's power was born from three founding events across the Mythrill continent. Kael the herd-ranger in the <LoreLink termId="sundrift-vale">Sundrift Vale</LoreLink> discovered totemic communion through bone eruption. Nyssa the herbalist in the <LoreLink termId="bryngloom-forest">Bryngloom Forest</LoreLink> discovered spirit invocation through loa bargaining. Theron the <LoreLink termId="skald">Skald</LoreLink> in the Frozen Archive of <LoreLink termId="nordhalla">Nordhalla</LoreLink> discovered runic inscription through memory sacrifice. The traditions merged when their carriers met at a crossroads and recognized each other's scars as the same ancestral language.

**CITIES & CIVIL RECEPTION**
Animists are viewed with a mixture of deep respect and visceral fear. Their bone spurs, glowing inscriptions, and spirit-static hallucinations make them unmistakable. They are essential in wilderness expeditions and siege defense, but unsettling in settled communities.

**RACES & CULTURAL AFFILIATION**
The class is practiced by the <LoreLink termId="house_ordavan">Ordan</LoreLink> humans, Sylen <LoreLink termId="astril">Astril</LoreLink>, Clean <LoreLink termId="vreken">Vreken</LoreLink>, <LoreLink termId="house_morrath">Morren</LoreLink> humans, Rune Keeper <LoreLink termId="skald">Skald</LoreLink>, and Velun <LoreLink termId="neth">Neth</LoreLink>.

**NOTABLE FIGURES**
* **Kael the Herd-Runner**: The ranger who lived as a wolf for ten seasons, founding the totemic tradition.
* **Nyssa the Herbalist**: The botanist who bargained with the bog-loa, founding the spirit tradition.
* **Theron the Skald Scholar**: The archivist who traded his memories for the clockwork songs, founding the runic tradition.`
    },
    signatureQuote: {
      text: '"The bone remembers what the mind forgets. The spirit remembers what the bone forgets. The rune remembers what the spirit forgets. I am the one who reads all three, and pays for every word."',
      speaker: 'The Triune, first Animist',
      context: 'Carved into the foundation stone of the Ancestral Convergence, discovered by Theron'
    },

    philosophy: {
      coreTenet: 'The world is not governed by laws or gods alone. It is governed by ancestors. Every creature that has ever lived has left an imprint on the world, and the Animist can read those imprints, invoke those spirits, and carve those truths into permanence. The bone is the body\'s memory. The spirit is the soul\'s memory. The rune is the mind\'s memory. An Animist reads all three.',
      relationship: 'The Animist stands at the intersection of three ancestral traditions. Totemic power erupts from their flesh as physical bone and root. Spirit invocation accumulates as a debt the loa honor. Runic inscription carves permanent truth into reality. Each tradition reinforces the others: totems provide anchor points for runic networks, spirits can be bound to runes, and runic amplification intensifies totem effects.',
      paradox: 'The Animist gains power by losing themselves across three dimensions. Physical self (totem eruption costs HP and leaves permanent bone spurs), mental self (spirit channeling erases memories and causes hallucinations), and spiritual self (runic inscription trades lifespan for permanent records). The greatest Animists are covered in bone spurs, covered in runic scars, and accompanied by spirits only they can see. They have given everything to become everything.'
    },

    currentCrisis: `The ancestral language is fragmenting. For centuries, the three traditions spoke the same root language, but centuries of separation have created dialects that no longer align perfectly. Bone totems that should resonate with runic networks are producing unstable harmonics. Spirit invocations are interfering with runic inscriptions, causing letters to shift on the page. The loa are confused by runic binding circles that use totemic syntax.

The Animists call this the Triune Dissonance. Young Animists who learn all three traditions simultaneously are experiencing complete sensory collapse, hearing bone-language, spirit-language, and rune-language simultaneously in a cacophony that drives them into catatonia. Senior Animists who learned one tradition before the others are faring better but report that the three voices in their head are growing louder and more argumentative.

Some Animists believe the Dissonance is a sign that the three founders never intended their traditions to be fused. Others believe it is a test that will produce a fourth, unified language once the Discordance is resolved. A small faction advocates abandoning two of the three traditions and returning to mastery of a single ancestral voice.`,

    meaningfulTradeoffs: `To be an Animist is to never be comfortable in any environment. Buildings feel wrong to the totemic tradition (earth blocked). Cities feel overwhelming to the spirit tradition (too many spiritual echoes). Libraries feel dangerous to the runic tradition (the ink competes with blood-inscriptions). The Animist needs the wilderness for totems, the spiritual liminal spaces for invocations, and solid stone for runic carving. Finding all three in one place is nearly impossible, so they are perpetually homesick for a place that may not exist.`,

    combatRole: {
      title: "The Ancestral Architect",
      content: `**Triple Battlefield Control**: Your role is to reshape the entire battlefield through three simultaneous systems. Bone totems create physical anchor points and healing zones. Curse-driven spirit invocations provide burst damage and divine intervention. Runic networks create permanent zones of denial and amplification.

**Self-Sustaining Agony**: You protect your allies through massive self-sacrifice. Every totem costs HP. Every rune costs HP. Every curse costs HP. You are a one-way conduit of ancestral power, bleeding constantly to maintain control over three overlapping systems of dominance.`
    },
    playstyle: {
      title: "The Triple Toll",
      content: `**Three Systems, One Resource**: Ancestral Resonance fuels all three traditions. Choose whether to invest resonance into totem eruption, spirit invocation, or runic inscription. The most powerful Animist weaves all three simultaneously, but this accelerates Spirit Erosion.

**Spirit Erosion**: The triple toll activates at 15+ resonance. Fire burns you at double strength. Party healers cannot touch you. If an enemy shoves you, your runic network explodes in backlash. And the spirits claw at your mind if you hoard without spending.`
    },
  },

  resourceSystem: {
    title: "Ancestral Resonance & Spirit Erosion",
    subtitle: "The Triple Toll of Blood, Bone, and Spirit",
    description: "The Animist's power operates on a unified resource that feeds three ancestral traditions simultaneously. Every totem summoned, every curse cast, every rune carved generates Ancestral Resonance. This resonance is spent across all three systems, but as it builds, the Spirit Erosion exacts a catastrophic triple toll.",
    cards: [
      {
        title: "Ancestral Resonance",
        stats: "0-20 Resonance",
        details: "Generated by totem summoning (Primalist tradition), curse casting and ritual completion (Witch Doctor tradition), and rune carving plus stationary stance (Inscriptor tradition). Spent on totem powers, spirit invocations, and runic network activations."
      },
      {
        title: "Spirit Erosion",
        stats: "Triple Catastrophic Flaw (15+ Resonance)",
        details: "100% ember vulnerability. Cannot receive party healing. Forced movement shatters runic networks (1d10 force per active rune). Spirits demand service: 1d6 wyrd/turn if 15+ resonance and no invocation/spend this turn."
      },
      {
        title: "Blood Price",
        stats: "Constant Self-Damage",
        details: "Totem eruption costs 5 HP. Rune carving costs 1d4-2d6 slashing self-damage. Curse casting drains 1d4 blight self-damage. Every power costs the body."
      }
    ],
    generationTable: {
      headers: ["Action", "Resonance Gained", "Blood Price (HP Cost)", "Tradition"],
      rows: [
        ["Summon/Upgrade Totem", "+3 Resonance", "-5 HP", "Primalist"],
        ["Cast Curse", "+1 Resonance", "-1d4 blight self", "Spirit"],
        ["Apply Poison", "+1 Resonance", "-1 HP", "Spirit"],
        ["Place Healing Totem", "+1 Resonance", "-5 HP", "Primalist + Spirit"],
        ["Complete Ritual", "+2 Resonance", "-3d4 blight self", "Spirit"],
        ["Carve Level 1-2 Rune", "+1 Resonance", "-1d4 slashing self", "Inscriptor"],
        ["Carve Level 3+ Rune", "+2 Resonance", "-2d6 slashing self", "Inscriptor"],
        ["Remain Stationary (Turn Start)", "+1 Resonance", "Joints calcify", "Inscriptor"],
        ["Defeat Cursed Enemy", "+3 Resonance", "None", "Spirit"],
        ["Invoke Loa Spirit", "Spends 5-10 Resonance", "-3d6 blight self", "Spirit"],
        ["Activate Runic Network", "Spends 3-8 Resonance", "-2d6 force self", "Inscriptor"],
        ["Totem Cataclysm", "Spends 10+ Resonance", "-15 HP", "Primalist"]
      ]
    },
    usage: {
      momentum: "Erupt totems for area control and healing, carve runes to secure choke points, and spread curses to build resonance fast. Weave all three traditions for maximum battlefield dominance.",
      flourish: "When resonance hits 15+, you are at peak power but triple toll is active. Spend resonance aggressively on invocations and network detonations. The spirits will punish hesitation."
    },
    overheatRules: {
      title: "Spirit Erosion (The Triple Toll)",
      content: "At 15+ Ancestral Resonance, three catastrophic flaws activate simultaneously:\n1. **Flammable Being**: All ember damage is increased by 100%. No resistance bypass.\n2. **Ancestral Isolation**: Cannot benefit from healing spells cast by others. Your own totem healing still works on allies but not on you.\n3. **Runic Shatter**: If you are forcibly moved, all active runes shatter. Take 1d10 force damage per active rune and become vulnerable to all damage until end of next turn.\n4. **Spirit Demand**: If you end your turn at 15+ resonance without spending any, take 1d6 wyrd damage from the demanding spirits."
    },
    strategicConsiderations: {
      title: "Weaving Three Traditions",
      content: "The key to Animist mastery is knowing when to weave all three traditions and when to focus. Early combat: place a totem (anchor point), carve a rune near it (runic network node), and curse an enemy (resonance builder). Mid combat: connect your runes through your totem, creating amplified zones. Late combat: spend high resonance on devastating invocations or network detonations."
    }
  },

  specializations: {
    title: "Animist Specializations",
    subtitle: "Three Paths of Ancestral Communion",
    description: "The Animist chooses how to balance the three ancestral traditions. Each specialization emphasizes a different fusion of totemic power, spirit invocation, and runic inscription.",
    passiveAbility: {
      name: "Spirit Erosion",
      description: "At 15+ Ancestral Resonance: 100% ember vulnerability, cannot receive party healing, forced movement shatters runic networks (1d10 force/active rune), and 1d6 wyrd/turn if hoarding without spending."
    },
    specs: [
      {
        id: "thornwarden",
        name: "Thornwarden",
        icon: "fas fa-shield-alt",
        color: "#8B4513",
        theme: "Bone Cages, Runic Walls, Apex Isolation",
        description: "Fuses the Primalist's Root-Weaver bone-barrier lockdown with the Inscriptor's Runebinder zone terraforming. The Thornwarden is an immovable zone controller who erects massive barriers of calcified bone and permanent runic walls, isolating high-value targets behind impenetrable defenses.",
        playstyle: "Defensive zone mastery, apex isolation, choke point lockdown, terrain manipulation.",
        strengths: [
          "Bone totems and runic walls combine to create impenetrable battlefield partitions",
          "Calcified passive grants +3 DR and physical resistance near own totems",
          "Runic zones are permanent and cannot be dispelled",
          "Can connect up to 5 runes into a single massive defensive network"
        ],
        weaknesses: [
          "Extremely slow; highest HP sacrifice costs for bone-weaving abilities",
          "Zero mobility; voluntary movement breaks runic connection",
          "Highly dependent on active totems and rune placement for survival",
          "Cannot heal self from own totems"
        ],
        specPassive: {
          name: "Scarred Earth Domain",
          description: "Gain +3 DR. When a totem you placed is within 10ft of you, gain resistance to all physical damage types. Your runic zones are permanent and cannot be dispelled. Enemies within your active network have magical resistances reduced by 25%."
        },
      },
      {
        id: "spirit_binder",
        name: "Spirit Binder",
        icon: "fas fa-ghost",
        color: "#8B008B",
        theme: "Beast Specters, Death Curses, Loa Invocation",
        description: "Fuses the Primalist's Bone-Stalker summoning with the Witch Doctor's Bokor death magic. The Spirit Binder is a summon-and-slay specialist who stitches the souls of dead beasts to their own nervous system, invokes death loa for devastating AoE, and curses enemies to feed the ancestral hunger.",
        playstyle: "Summoning specters, blight devastation, curse spreading, death invocation.",
        strengths: [
          "Summon multiple beast specters that share and amplify curse damage",
          "Baron Samedi invocation costs 2 less resonance and needs only 2 cursed enemies",
          "Curses generate +1 additional Ancestral Resonance",
          "Drains enemy vitality to replenish sacrificed HP through soul-siphon"
        ],
        weaknesses: [
          "Summons share your HP pool; ember damage to specters causes feedback damage",
          "Limited direct healing; must drain enemies to survive",
          "Weakest defensive positioning; no barriers or walls",
          "Cannot benefit from party healing at high resonance"
        ],
        specPassive: {
          name: "Shadow's Embrace",
          description: "Baron Samedi invocations cost 2 less resonance and require only 2 cursed enemies. Curses generate +1 additional Ancestral Resonance. Your beast summons deal +2 damage to bleeding or trapped targets."
        },
      },
      {
        id: "stormscribe",
        name: "Stormscribe",
        icon: "fas fa-bolt",
        color: "#4682B4",
        theme: "Lightning Fury, Healing Totems, Inscribed Ally Buffs",
        description: "Fuses the Primalist's Stormbringer lightning attacks with the Witch Doctor's Mambo healing and the Inscriptor's Enchanter ally buffs. The Stormscribe is the most versatile Animist, supporting allies through inscribed weapon buffs, healing totems, and devastating elemental fury.",
        playstyle: "Aggressive support, elemental damage, ally buff inscription, healing totems.",
        strengths: [
          "Inscribe ally weapons with +2 attack/saves and lifesteal siphoning",
          "Healing totems generate +1 additional resonance and heal 50% more",
          "Lightning damage +1d6 when standing near Storm Totem",
          "Simbi invocation costs 2 less; Erzulie costs 2 less for clutch healing"
        ],
        weaknesses: [
          "Allies take minor blight damage from branded weapons",
          "Lower personal shields; must rely on allies for defense",
          "Resonance generation depends on buffed allies dealing/taking damage",
          "Triple toll hits hardest due to aggressive playstyle"
        ],
        specPassive: {
          name: "Stormbrand Inscription",
          description: "When you carve an inscription onto an ally, take 1d6 slashing but ally gains +2 to attacks and saves for 5 rounds. Their weapon siphons life, healing 20% of damage dealt. Your spells deal +1d6 lightning damage near a Storm Totem. Simbi and Erzulie invocations cost 2 less resonance."
        },
      }
    ]
  },

    spells: [
    { id : "animist_earth_bolt",
      name: "Earthen Splinter",
      description: "Hurl a sharp splinter of ancestral stone at a foe. Generates 1 Resonance.",
      level: 1,
      spellType: "ACTION",
      icon: "Nature/Nature Natural 11",
      effectTypes: ["damage"],
      typeConfig: { school: "primal", icon: "Nature/Nature Natural 11", tags: ["melee","damage","starter"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "single", rangeType: "ranged", rangeDistance: 60, targetRestrictions: ["enemies"] },
      resourceCost: { actionPoints: 1, mana: 3, classResource: { type: "resonance", cost: -1 } },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
      damageConfig: { formula: "1d8 + spirit", damageTypes: ["primal"], resolution: "DICE" },
      resolution: "DICE",
      tags: ["damage","starter","primal"]
    },
    { id : "animist_healing_totem",
      name: "Bone Sprout Totem",
      description: "Erupt a bone totem that heals nearby allies at the start of your turn. Generates 3 Resonance.",
      level: 1,
      spellType: "ACTION",
      icon: "Healing/Golden Heart",
      effectTypes: ["healing"],
      typeConfig: { school: "primal", icon: "Healing/Golden Heart", tags: ["summon","healing","totem","starter"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "area", rangeType: "ranged", rangeDistance: 30, targetRestrictions: ["allies"], areaShape: "circle", areaSize: 15 },
      resourceCost: { actionPoints: 1, mana: 4, classResource: { type: "resonance", cost: -3 } },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },
      healingConfig: { formula: "1d6 + spirit", healingType: "zone", resolution: "DICE" },
      resolution: "DICE",
      tags: ["healing","summon","totem","starter"]
    },
    { id : "animist_mojo_whisper",
      name: "Mojo Whisper",
      description: "Whisper a curse of spiritual static to leave a target vulnerable to blight damage. Generates 1 Resonance.",
      level: 1,
      spellType: "ACTION",
      icon: "Necrotic/Necrotic Wither",
      effectTypes: ["debuff"],
      typeConfig: { school: "blight", icon: "Necrotic/Necrotic Wither", tags: ["debuff","curse","starter"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "single", rangeType: "ranged", rangeDistance: 45, targetRestrictions: ["enemies"] },
      resourceCost: { actionPoints: 1, mana: 2, classResource: { type: "resonance", cost: -1 } },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
      debuffConfig: { debuffType: "statusEffect", effects: [{ id : "animist_mojo_vulnerability", name: "Spirit Static", description: "Target takes +2 blight damage from all spells.", mechanicsText: "+2 Blight damage taken." }], durationType: "rounds", durationValue: 3, durationUnit: "rounds", canBeDispelled: true },
      resolution: "AUTOMATIC",
      tags: ["debuff","curse","starter","blight"]
    },
    { id : "animist_crimson_brand",
      name: "Crimson Brand",
      description: "Carve a bloody brand onto an ally's weapon, adding force damage to strikes. Generates 1 Resonance.",
      level: 1,
      spellType: "ACTION",
      icon: "Slashing/Bloody Slash",
      effectTypes: ["buff"],
      typeConfig: { school: "physical", icon: "Slashing/Bloody Slash", tags: ["buff","brand","starter"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "single", rangeType: "touch", rangeDistance: undefined, targetRestrictions: ["allies"] },
      resourceCost: { actionPoints: 1, mana: 4, classResource: { type: "resonance", cost: -1 } },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
      buffConfig: { buffType: "statEnhancement", effects: [{ id : "animist_brand_force", name: "Crimson Brand", description: "Weapon strikes deal +1d4 force damage.", mechanicsText: "+1d4 force damage on hit." }], durationType: "rounds", durationValue: 5, durationUnit: "rounds", canBeDispelled: true },
      resolution: "AUTOMATIC",
      tags: ["buff","brand","starter","physical"]
    },
    { id : "animist_rune_of_shielding",
      name: "Rune of Shielding",
      description: "Carve a protective rune on the floor. Allies standing on it gain a shield. Generates 1 Resonance.",
      level: 1,
      spellType: "ACTION",
      icon: "Healing/Heart Shield",
      effectTypes: ["buff"],
      typeConfig: { school: "physical", icon: "Healing/Heart Shield", tags: ["buff","rune","starter"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "area", rangeType: "ranged", rangeDistance: 30, targetRestrictions: ["allies"], areaShape: "circle", areaSize: 10 },
      resourceCost: { actionPoints: 1, mana: 5, classResource: { type: "resonance", cost: -1 } },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
      buffConfig: { buffType: "statEnhancement", effects: [{ id : "animist_rune_shield_buff", name: "Runic Ward", description: "Gain +15 temporary HP while inside the rune.", mechanicsText: "+15 Temp HP." }], durationType: "rounds", durationValue: 3, durationUnit: "rounds", canBeDispelled: true },
      resolution: "AUTOMATIC",
      tags: ["buff","rune","starter","physical"]
    },
    { id : "animist_gale_totem",
      name: "Storm-Howl Totem",
      description: "Erupt a lightning totem that shocks and repels enemies. Generates 3 Resonance.",
      level: 2,
      spellType: "ACTION",
      icon: "Lightning/Thunderstorm",
      effectTypes: ["damage","control"],
      typeConfig: { school: "storm", icon: "Lightning/Thunderstorm", tags: ["summon","damage","totem"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "area", rangeType: "ranged", rangeDistance: 45, targetRestrictions: ["enemies"], areaShape: "circle", areaSize: 15 },
      resourceCost: { actionPoints: 1, mana: 6, classResource: { type: "resonance", cost: -3 } },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },
      damageConfig: { formula: "2d6 + spirit", damageTypes: ["storm"], resolution: "DICE" },
      controlConfig: { controlType: "forcedMovement", effects: [{ id : "animist_gale_push", name: "Storm Gust", description: "Pushes targets 10 feet away from the totem.", config: {"distance":10,"movementType":"push"} }] },
      resolution: "DICE",
      tags: ["damage","control","totem","storm"]
    },
    { id : "animist_spirit_link",
      name: "Spirit Link",
      description: "Forge a link between two targets, sharing healing or damage. Generates 1 Resonance.",
      level: 2,
      spellType: "ACTION",
      icon: "Psychic/Psychic Telepathy",
      effectTypes: ["buff"],
      typeConfig: { school: "wyrd", icon: "Psychic/Psychic Telepathy", tags: ["buff","link"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "chain", rangeType: "ranged", rangeDistance: 30, targetRestrictions: ["any"] },
      resourceCost: { actionPoints: 1, mana: 4, classResource: { type: "resonance", cost: -1 } },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
      buffConfig: { buffType: "custom", effects: [{ id : "animist_linked_state", name: "Linked Souls", description: "Linked targets share 50% of damage or healing received.", mechanicsText: "Shares 50% damage/healing." }], durationType: "rounds", durationValue: 3, durationUnit: "rounds", canBeDispelled: true },
      resolution: "AUTOMATIC",
      tags: ["buff","link","wyrd"]
    },
    { id : "animist_rune_of_celerity",
      name: "Rune of Celerity",
      description: "Carve a rune on the ground that grants speed to allies. Generates 1 Resonance.",
      level: 2,
      spellType: "ACTION",
      icon: "Utility/Speed Boot",
      effectTypes: ["buff"],
      typeConfig: { school: "primal", icon: "Utility/Speed Boot", tags: ["buff","rune"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "area", rangeType: "ranged", rangeDistance: 30, targetRestrictions: ["allies"], areaShape: "circle", areaSize: 10 },
      resourceCost: { actionPoints: 1, mana: 4, classResource: { type: "resonance", cost: -1 } },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },
      buffConfig: { buffType: "movementBuff", effects: [{ id : "animist_celerity_buff", name: "Quickened Steps", description: "Gain +15 feet of movement speed.", mechanicsText: "+15ft speed." }], durationType: "rounds", durationValue: 3, durationUnit: "rounds", canBeDispelled: true },
      resolution: "AUTOMATIC",
      tags: ["buff","rune","primal"]
    },
    { id : "animist_calcified_spire",
      name: "Calcified Spire",
      description: "Erupt a wall of bone spires to block passage. Generates 2 Resonance.",
      level: 2,
      spellType: "ACTION",
      icon: "Bludgeoning/Hammer Crush",
      effectTypes: ["control"],
      typeConfig: { school: "physical", icon: "Bludgeoning/Hammer Crush", tags: ["control","terrain"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "line", rangeType: "ranged", rangeDistance: 30, targetRestrictions: ["any"] },
      resourceCost: { actionPoints: 1, mana: 5, classResource: { type: "resonance", cost: -2 } },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
      controlConfig: { controlType: "zone", effects: [{ id : "animist_bone_wall", name: "Impassable Bone", description: "Bones block movement and grant full cover.", config: {"zoneType":"impassable_terrain"} }] },
      resolution: "AUTOMATIC",
      tags: ["control","terrain","physical"]
    },
    { id : "animist_thorn_barrier",
      name: "Thorn Barrier",
      description: "Summon a dense barrier of sharp thorns. Deals damage to enemies who cross it. Generates 2 Resonance.",
      level: 3,
      spellType: "ACTION",
      icon: "Nature/Nature Natural 11",
      effectTypes: ["damage","control"],
      typeConfig: { school: "primal", icon: "Nature/Nature Natural 11", tags: ["control","damage","hazard"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "line", rangeType: "ranged", rangeDistance: 45, targetRestrictions: ["enemies"] },
      resourceCost: { actionPoints: 1, mana: 6, classResource: { type: "resonance", cost: -2 } },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
      damageConfig: { formula: "2d6", damageTypes: ["primal"], resolution: "DICE" },
      controlConfig: { controlType: "zone", effects: [{ id : "animist_thorn_slow", name: "Thorn Thicket", description: "Difficult terrain. Deals primal damage to trespassers.", config: {"zoneType":"difficult_terrain"} }] },
      resolution: "DICE",
      tags: ["control","damage","hazard","primal"]
    },
    { id : "animist_spirit_wolves",
      name: "Wendigo Specters",
      description: "Summon two spectral wolves from your shadow to attack enemies. Generates 3 Resonance.",
      level: 3,
      spellType: "ACTION",
      icon: "Necrotic/Necrotic Wither",
      effectTypes: ["damage"],
      typeConfig: { school: "blight", icon: "Necrotic/Necrotic Wither", tags: ["summon","damage"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "area", rangeType: "ranged", rangeDistance: 30, targetRestrictions: ["enemies"], areaShape: "circle", areaSize: 10 },
      resourceCost: { actionPoints: 1, mana: 8, classResource: { type: "resonance", cost: -3 } },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },
      damageConfig: { formula: "2d8", damageTypes: ["blight"], resolution: "DICE" },
      resolution: "DICE",
      tags: ["summon","damage","blight"]
    },
    { id : "animist_rune_of_destruction",
      name: "Rune of Destruction",
      description: "Carve a volatile rune on the floor. Detonates in a fire blast when an enemy steps on it. Spends 3 Resonance.",
      level: 3,
      spellType: "ACTION",
      icon: "Fire/Volcanic Corruption",
      effectTypes: ["damage"],
      typeConfig: { school: "ember", icon: "Fire/Volcanic Corruption", tags: ["damage","rune","trap"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "area", rangeType: "ranged", rangeDistance: 45, targetRestrictions: ["enemies"], areaShape: "circle", areaSize: 15 },
      resourceCost: { actionPoints: 1, mana: 6, classResource: { type: "resonance", cost: 3 } },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
      damageConfig: { formula: "4d6", damageTypes: ["ember"], resolution: "DICE" },
      resolution: "DICE",
      tags: ["damage","rune","trap","ember"]
    },
    { id : "animist_siphon_hex",
      name: "Soul-Dredge Hex",
      description: "Afflict target with a curse that drains HP to heal you each round. Generates 1 Resonance.",
      level: 3,
      spellType: "ACTION",
      icon: "Necrotic/Necrotic Wither",
      effectTypes: ["damage","healing"],
      typeConfig: { school: "blight", icon: "Necrotic/Necrotic Wither", tags: ["damage","healing","curse"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "single", rangeType: "ranged", rangeDistance: 60, targetRestrictions: ["enemies"] },
      resourceCost: { actionPoints: 1, mana: 6, classResource: { type: "resonance", cost: -1 } },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },
      damageConfig: { formula: "1d8", damageTypes: ["blight"], resolution: "DICE", dotConfig: { dotFormula: "1d8", duration: 3, tickFrequency: "turn", isProgressiveDot: false } },
      healingConfig: { formula: "1d8", healingType: "target", resolution: "DICE" },
      resolution: "DICE",
      tags: ["damage","healing","curse","blight"]
    },
    { id : "animist_earthen_grasp",
      name: "Gaean Grasp",
      description: "Burl stone hands out of the earth to restrain all enemies in the area. Spends 4 Resonance.",
      level: 4,
      spellType: "ACTION",
      icon: "Nature/Nature Natural 11",
      effectTypes: ["control"],
      typeConfig: { school: "primal", icon: "Nature/Nature Natural 11", tags: ["control","area"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "area", rangeType: "ranged", rangeDistance: 45, targetRestrictions: ["enemies"], areaShape: "circle", areaSize: 15 },
      resourceCost: { actionPoints: 1, mana: 8, classResource: { type: "resonance", cost: 4 } },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
      controlConfig: { controlType: "restraint", effects: [{ id : "animist_stone_restraint", name: "Gaean Hold", description: "Restrained by stone. Cannot move. DC 14 Strength save to break.", config: {"restraintType":"physical","breakOnDamage":false,"condition":"restrained"} }] },
      resolution: "AUTOMATIC",
      tags: ["control","area","primal"]
    },
    { id : "animist_invoke_simbi",
      name: "Invoke Simbi",
      description: "Loa invocation: Call a restorative rain that heals and cleanses allies. Spends 6 Resonance.",
      level: 4,
      spellType: "ACTION",
      icon: "Healing/Golden Heart",
      effectTypes: ["healing"],
      typeConfig: { school: "primal", icon: "Healing/Golden Heart", tags: ["healing","invocation","cleanse"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "area", rangeType: "ranged", rangeDistance: 60, targetRestrictions: ["allies"], areaShape: "circle", areaSize: 20 },
      resourceCost: { actionPoints: 1, mana: 8, classResource: { type: "resonance", cost: 6 } },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },
      healingConfig: { formula: "3d8 + spirit", healingType: "zone", resolution: "DICE" },
      resolution: "DICE",
      tags: ["healing","invocation","cleanse","primal"]
    },
    { id : "animist_scribe_warding",
      name: "Glyph of Warding",
      description: "Carve a glowing brand onto an ally's armor, granting +2 DR. Generates 1 Resonance.",
      level: 4,
      spellType: "ACTION",
      icon: "Arcane/Ebon Blaze",
      effectTypes: ["buff"],
      typeConfig: { school: "arcane", icon: "Arcane/Ebon Blaze", tags: ["buff","brand"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "single", rangeType: "touch", rangeDistance: undefined, targetRestrictions: ["allies"] },
      resourceCost: { actionPoints: 1, mana: 6, classResource: { type: "resonance", cost: -1 } },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },
      buffConfig: { buffType: "statEnhancement", effects: [{ id : "animist_warding_dr", name: "Runic Safeguard", description: "Gain +2 DR.", mechanicsText: "+2 DR." }], durationType: "rounds", durationValue: 5, durationUnit: "rounds", canBeDispelled: true },
      resolution: "AUTOMATIC",
      tags: ["buff","brand","arcane"]
    },
    { id : "animist_totemic_storm",
      name: "Totemic Overload",
      description: "Arc lightning between all active totems, shocking enemies in between. Spends 5 Resonance.",
      level: 5,
      spellType: "CHANNELED",
      icon: "Lightning/Thunderstorm",
      effectTypes: ["damage"],
      typeConfig: { school: "storm", icon: "Lightning/Thunderstorm", tags: ["damage","storm","totem","combo"], castTime: 2, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "area", rangeType: "self_centered", rangeDistance: undefined, targetRestrictions: ["enemies"], areaShape: "circle", areaSize: 40 },
      resourceCost: { actionPoints: 2, mana: 12, classResource: { type: "resonance", cost: 5 } },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },
      damageConfig: { formula: "5d6 + spirit", damageTypes: ["storm"], resolution: "DICE" },
      resolution: "DICE",
      tags: ["damage","storm","totem","combo"]
    },
    { id : "animist_ritual_of_the_bog",
      name: "Swamp Consecration",
      description: "Consecrate the ground into a rotting marsh that slows and poisons enemies. Spends 4 Resonance.",
      level: 5,
      spellType: "ACTION",
      icon: "Necrotic/Necrotic Wither",
      effectTypes: ["damage","debuff"],
      typeConfig: { school: "blight", icon: "Necrotic/Necrotic Wither", tags: ["hazard","area","poison"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "area", rangeType: "ranged", rangeDistance: 45, targetRestrictions: ["enemies"], areaShape: "circle", areaSize: 20 },
      resourceCost: { actionPoints: 1, mana: 10, classResource: { type: "resonance", cost: 4 } },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
      damageConfig: { formula: "2d6", damageTypes: ["blight"], resolution: "DICE", dotConfig: { dotFormula: "1d6", duration: 4, tickFrequency: "turn", isProgressiveDot: false } },
      debuffConfig: { debuffType: "movementImpairment", effects: [{ id : "animist_swamp_slow", name: "Mire Slow", description: "Movement speed is halved in the marsh.", mechanicsText: "Movement speed halved." }], durationType: "rounds", durationValue: 4, durationUnit: "rounds", canBeDispelled: false },
      resolution: "DICE",
      tags: ["hazard","area","blight"]
    },
    { id : "animist_brand_of_spellguard",
      name: "Spellbrand",
      description: "Inscribe a runic shield onto an ally's weapon, granting magic resistance. Generates 1 Resonance.",
      level: 5,
      spellType: "ACTION",
      icon: "Arcane/Ebon Blaze",
      effectTypes: ["buff"],
      typeConfig: { school: "arcane", icon: "Arcane/Ebon Blaze", tags: ["buff","brand"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "single", rangeType: "touch", rangeDistance: undefined, targetRestrictions: ["allies"] },
      resourceCost: { actionPoints: 1, mana: 8, classResource: { type: "resonance", cost: -1 } },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
      buffConfig: { buffType: "statEnhancement", effects: [{ id : "animist_spell_resistance", name: "Spellward Brand", description: "Gain +25% magic resistance.", mechanicsText: "+25% Magic Resistance." }], durationType: "rounds", durationValue: 5, durationUnit: "rounds", canBeDispelled: true },
      resolution: "AUTOMATIC",
      tags: ["buff","brand","arcane"]
    },
    { id : "animist_invoke_papa_legba",
      name: "Invoke Papa Legba",
      description: "Loa invocation: Summon Papa Legba to immediately cleanse CC and grant +1 AP. Spends 7 Resonance.",
      level: 6,
      spellType: "ACTION",
      icon: "Psychic/Psychic Telepathy",
      effectTypes: ["buff"],
      typeConfig: { school: "wyrd", icon: "Psychic/Psychic Telepathy", tags: ["buff","invocation","cleanse"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "single", rangeType: "ranged", rangeDistance: 60, targetRestrictions: ["allies"] },
      resourceCost: { actionPoints: 1, mana: 10, classResource: { type: "resonance", cost: 7 } },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 4 },
      buffConfig: { buffType: "statusEffectBuff", effects: [{ id : "animist_legba_cleanse", name: "Legba's Key", description: "CC cleansed and gain +1 Action Point next turn.", mechanicsText: "CC cleansed, +1 AP next turn." }], durationType: "rounds", durationValue: 1, durationUnit: "rounds", canBeDispelled: true },
      resolution: "AUTOMATIC",
      tags: ["buff","invocation","cleanse","wyrd"]
    },
    { id : "animist_grave_sight",
      name: "Grave Sight",
      description: "Shatter a target's mind with the presence of death. Target suffers vulnerability. Spends 4 Resonance.",
      level: 6,
      spellType: "CHANNELED",
      icon: "Psychic/Psychic Telepathy",
      effectTypes: ["debuff"],
      typeConfig: { school: "wyrd", icon: "Psychic/Psychic Telepathy", tags: ["debuff","channel"], castTime: 2, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "single", rangeType: "ranged", rangeDistance: 45, targetRestrictions: ["enemies"] },
      resourceCost: { actionPoints: 2, mana: 10, classResource: { type: "resonance", cost: 4 } },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
      debuffConfig: { debuffType: "statusEffect", effects: [{ id : "animist_grave_sight_debuff", name: "Eldritch Terror", description: "Target has disadvantage on saves and takes +50% wyrd damage.", mechanicsText: "Disadvantage on saves, +50% Wyrd damage." }], durationType: "rounds", durationValue: 2, durationUnit: "rounds", canBeDispelled: true },
      resolution: "AUTOMATIC",
      tags: ["debuff","channel","wyrd"]
    },
    { id : "animist_rune_of_vitality",
      name: "Rune of Vitality",
      description: "Carve a rune that heals allies when they walk over it. Spends 4 Resonance.",
      level: 6,
      spellType: "ACTION",
      icon: "Healing/Golden Heart",
      effectTypes: ["healing"],
      typeConfig: { school: "primal", icon: "Healing/Golden Heart", tags: ["healing","rune"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "area", rangeType: "ranged", rangeDistance: 30, targetRestrictions: ["allies"], areaShape: "circle", areaSize: 10 },
      resourceCost: { actionPoints: 1, mana: 8, classResource: { type: "resonance", cost: 4 } },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },
      healingConfig: { formula: "3d6 + spirit", healingType: "zone", resolution: "DICE" },
      resolution: "DICE",
      tags: ["healing","rune","primal"]
    },
    { id : "animist_inscribed_fortress",
      name: "Runic Fortress",
      description: "Inscribe a massive fortress zone that shields allies and blocks enemies. Spends 8 Resonance.",
      level: 7,
      spellType: "ACTION",
      icon: "Arcane/Ebon Blaze",
      effectTypes: ["buff","control"],
      typeConfig: { school: "arcane", icon: "Arcane/Ebon Blaze", tags: ["buff","control","zone"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "area", rangeType: "ranged", rangeDistance: 45, targetRestrictions: ["any"], areaShape: "circle", areaSize: 20 },
      resourceCost: { actionPoints: 2, mana: 15, classResource: { type: "resonance", cost: 8 } },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 4 },
      buffConfig: { buffType: "statEnhancement", effects: [{ id : "animist_fortress_defense", name: "Fortress Ward", description: "Allies inside gain +3 DR and advantage on physical saving throws.", mechanicsText: "+3 DR, advantage on physical saves." }], durationType: "rounds", durationValue: 3, durationUnit: "rounds", canBeDispelled: false },
      controlConfig: { controlType: "zone", effects: [{ id : "animist_fortress_border", name: "Runic Barrier", description: "Enemies cannot cross the zone boundary.", config: {"zoneType":"impassable_terrain"} }] },
      resolution: "AUTOMATIC",
      tags: ["buff","control","zone","arcane"]
    },
    { id : "animist_invoke_erzulie",
      name: "Invoke Erzulie",
      description: "Loa invocation: Call Erzulie for a massive healing burst to all allies. Spends 8 Resonance.",
      level: 7,
      spellType: "ACTION",
      icon: "Healing/Golden Heart",
      effectTypes: ["healing"],
      typeConfig: { school: "divine", icon: "Healing/Golden Heart", tags: ["healing","invocation"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "area", rangeType: "self_centered", rangeDistance: undefined, targetRestrictions: ["allies"], areaShape: "circle", areaSize: 30 },
      resourceCost: { actionPoints: 2, mana: 14, classResource: { type: "resonance", cost: 8 } },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 5 },
      healingConfig: { formula: "6d6 + spirit", healingType: "zone", resolution: "DICE" },
      resolution: "DICE",
      tags: ["healing","invocation","divine"]
    },
    { id : "animist_spirit_dredge",
      name: "Spirit Dredge",
      description: "Siphon HP from all cursed enemies to heal your own flesh. Spends 5 Resonance.",
      level: 7,
      spellType: "ACTION",
      icon: "Necrotic/Necrotic Wither",
      effectTypes: ["damage","healing"],
      typeConfig: { school: "blight", icon: "Necrotic/Necrotic Wither", tags: ["damage","healing","combo"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "area", rangeType: "self_centered", rangeDistance: undefined, targetRestrictions: ["enemies"], areaShape: "circle", areaSize: 45 },
      resourceCost: { actionPoints: 1, mana: 12, classResource: { type: "resonance", cost: 5 } },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
      damageConfig: { formula: "3d8", damageTypes: ["blight"], resolution: "DICE" },
      healingConfig: { formula: "3d8", healingType: "target", resolution: "DICE" },
      resolution: "DICE",
      tags: ["damage","healing","combo","blight"]
    },
    { id : "animist_invoke_baron_samedi",
      name: "Invoke Baron Samedi",
      description: "Loa invocation: Strike all cursed enemies with devastating shadow rot. Spends 10 Resonance.",
      level: 8,
      spellType: "ACTION",
      icon: "Necrotic/Necrotic Wither",
      effectTypes: ["damage"],
      typeConfig: { school: "blight", icon: "Necrotic/Necrotic Wither", tags: ["damage","invocation","ultimate"], castTime: 2, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "area", rangeType: "self_centered", rangeDistance: undefined, targetRestrictions: ["enemies"], areaShape: "circle", areaSize: 60 },
      resourceCost: { actionPoints: 2, mana: 20, classResource: { type: "resonance", cost: 10 } },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 5 },
      damageConfig: { formula: "8d6 + spirit", damageTypes: ["blight"], resolution: "DICE" },
      resolution: "DICE",
      tags: ["damage","invocation","ultimate","blight"]
    },
    { id : "animist_primeval_totem",
      name: "Primal Beast Totem",
      description: "Erupt the ultimate totem that boosts ally attack rolls and DR. Spends 8 Resonance.",
      level: 8,
      spellType: "ACTION",
      icon: "Nature/Nature Natural 11",
      effectTypes: ["buff"],
      typeConfig: { school: "primal", icon: "Nature/Nature Natural 11", tags: ["summon","buff","totem"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "area", rangeType: "ranged", rangeDistance: 45, targetRestrictions: ["allies"], areaShape: "circle", areaSize: 30 },
      resourceCost: { actionPoints: 1, mana: 16, classResource: { type: "resonance", cost: 8 } },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 4 },
      buffConfig: { buffType: "statEnhancement", effects: [{ id : "animist_primeval_rage", name: "Beast Totem Rage", description: "+2 to attack rolls and +2 DR.", mechanicsText: "+2 attack, +2 DR." }], durationType: "rounds", durationValue: 5, durationUnit: "rounds", canBeDispelled: false },
      resolution: "AUTOMATIC",
      tags: ["summon","buff","totem","primal"]
    },
    { id : "animist_rune_of_binding",
      name: "Rune of Binding",
      description: "Carve a rune on the floor that chains and tethers all enemies in the area. Spends 6 Resonance.",
      level: 8,
      spellType: "ACTION",
      icon: "Arcane/Ebon Blaze",
      effectTypes: ["control"],
      typeConfig: { school: "force", icon: "Arcane/Ebon Blaze", tags: ["control","rune"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "area", rangeType: "ranged", rangeDistance: 30, targetRestrictions: ["enemies"], areaShape: "circle", areaSize: 15 },
      resourceCost: { actionPoints: 1, mana: 12, classResource: { type: "resonance", cost: 6 } },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },
      controlConfig: { controlType: "restraint", effects: [{ id : "animist_rune_bind", name: "Chaining Rune", description: "Restrained by spectral chains. Cannot move.", config: {"restraintType":"physical","breakOnDamage":true,"condition":"restrained"} }] },
      resolution: "AUTOMATIC",
      tags: ["control","rune","force"]
    },
    { id : "animist_worldscribe",
      name: "Worldscribe",
      description: "Inscribe permanent planar glyphs that continuously pulse healing and shield allies. Spends 12 Resonance.",
      level: 9,
      spellType: "ACTION",
      icon: "Arcane/Ebon Blaze",
      effectTypes: ["healing","buff"],
      typeConfig: { school: "arcane", icon: "Arcane/Ebon Blaze", tags: ["healing","buff","ultimate"], castTime: 2, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "area", rangeType: "ranged", rangeDistance: 45, targetRestrictions: ["allies"], areaShape: "circle", areaSize: 30 },
      resourceCost: { actionPoints: 2, mana: 25, classResource: { type: "resonance", cost: 12 } },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 6 },
      healingConfig: { formula: "4d6 + spirit", healingType: "zone", resolution: "DICE" },
      buffConfig: { buffType: "statEnhancement", effects: [{ id : "animist_worldscribe_dr", name: "Worldscribe Aegis", description: "Gain +4 DR.", mechanicsText: "+4 DR." }], durationType: "permanent", durationValue: 0, durationUnit: "rounds", canBeDispelled: false },
      resolution: "DICE",
      tags: ["healing","buff","ultimate","arcane"]
    },
    { id : "animist_cataclysmic_eruption",
      name: "Totem Cataclysm",
      description: "Detonate all active totems in a catastrophic blast of fire and stone. Spends 12 Resonance.",
      level: 9,
      spellType: "ACTION",
      icon: "Fire/Volcanic Corruption",
      effectTypes: ["damage"],
      typeConfig: { school: "ember", icon: "Fire/Volcanic Corruption", tags: ["damage","ultimate","totem"], castTime: 2, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "area", rangeType: "self_centered", rangeDistance: undefined, targetRestrictions: ["enemies"], areaShape: "circle", areaSize: 50 },
      resourceCost: { actionPoints: 2, mana: 24, classResource: { type: "resonance", cost: 12 } },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 6 },
      damageConfig: { formula: "8d8 + spirit", damageTypes: ["ember"], resolution: "DICE" },
      resolution: "DICE",
      tags: ["damage","ultimate","totem","ember"]
    },
    { id : "animist_triune_ascension",
      name: "Triune Ascension",
      description: "Enter a state of supreme ancestral alignment, unleashing totems, loa, and runes simultaneously. Spends 15 Resonance.",
      level: 10,
      spellType: "ACTION",
      icon: "Nature/Nature Natural 11",
      effectTypes: ["buff"],
      typeConfig: { school: "primal", icon: "Nature/Nature Natural 11", tags: ["buff","ultimate"], castTime: 3, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "self", rangeType: "self", rangeDistance: undefined, targetRestrictions: ["self"] },
      resourceCost: { actionPoints: 3, mana: 30, classResource: { type: "resonance", cost: 15 } },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 8 },
      buffConfig: { buffType: "triggeredEffect", effects: [{ id : "animist_triune_buff", name: "Triune Avatar", description: "+5 to attacks, +5 DR, +2 AP, and double healing.", mechanicsText: "+5 attacks, +5 DR, +2 AP, double healing." }], durationType: "rounds", durationValue: 6, durationUnit: "rounds", canBeDispelled: false },
      resolution: "AUTOMATIC",
      tags: ["buff","ultimate","primal"]
    },
    { id : "animist_spectral_guardian",
      name: "Ancestral Colossus",
      description: "Summon a massive spectral colossus of bone and spirit to smash enemies. Spends 15 Resonance.",
      level: 10,
      spellType: "ACTION",
      icon: "Necrotic/Necrotic Wither",
      effectTypes: ["damage","control"],
      typeConfig: { school: "blight", icon: "Necrotic/Necrotic Wither", tags: ["summon","damage","control"], castTime: 3, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "area", rangeType: "ranged", rangeDistance: 60, targetRestrictions: ["enemies"], areaShape: "circle", areaSize: 25 },
      resourceCost: { actionPoints: 3, mana: 30, classResource: { type: "resonance", cost: 15 } },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 8 },
      damageConfig: { formula: "10d10", damageTypes: ["blight"], resolution: "DICE" },
      controlConfig: { controlType: "knockdown", effects: [{ id : "animist_colossus_knockdown", name: "Tremor Slam", description: "Knocked prone.", config: {"saveType":"strength","saveDC":18} }] },
      resolution: "DICE",
      tags: ["summon","damage","control","blight"]
    }
  ],

  spellPools: {
  "1": [
    "animist_earth_bolt",
    "animist_healing_totem",
    "animist_mojo_whisper",
    "animist_crimson_brand",
    "animist_rune_of_shielding"
  ],
  "2": [
    "animist_gale_totem",
    "animist_spirit_link",
    "animist_rune_of_celerity",
    "animist_calcified_spire"
  ],
  "3": [
    "animist_thorn_barrier",
    "animist_spirit_wolves",
    "animist_rune_of_destruction",
    "animist_siphon_hex"
  ],
  "4": [
    "animist_earthen_grasp",
    "animist_invoke_simbi",
    "animist_scribe_warding"
  ],
  "5": [
    "animist_totemic_storm",
    "animist_ritual_of_the_bog",
    "animist_brand_of_spellguard"
  ],
  "6": [
    "animist_invoke_papa_legba",
    "animist_grave_sight",
    "animist_rune_of_vitality"
  ],
  "7": [
    "animist_inscribed_fortress",
    "animist_invoke_erzulie",
    "animist_spirit_dredge"
  ],
  "8": [
    "animist_invoke_baron_samedi",
    "animist_primeval_totem",
    "animist_rune_of_binding"
  ],
  "9": [
    "animist_worldscribe",
    "animist_cataclysmic_eruption"
  ],
  "10": [
    "animist_triune_ascension",
    "animist_spectral_guardian"
  ]
}
};
