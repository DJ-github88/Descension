export const ANIMIST_DATA = {
  id: "animist",
  name: "Animist",
  icon: "fas fa-seedling",
  role: "Support / Control / Terrain",
  damageTypes: ["primal", "blight", "storm", "physical", "ember"],

  classIdentity: {
    title: "The Ancestral Conduit",
    subtitle: "Blood-Bound Voice of the Wild and the Written Word",
    utility: "Channel three distinct ancestral traditions through a single unified resource. The Animist erupts bone totems from self-mutilation (Primalist heritage), invokes ancient spirits through curse-driven invocation rituals (Witch Doctor heritage), and carves permanent runic networks into earth and flesh (Inscriptor heritage). They simultaneously terraform the battlefield, summon specters, and inscribe divine sigils, paying for every manifestation with their own blood, memories, and sanity.",
    fatalFlaw: "Triple catastrophic flaw from fused traditions. Spirit Erosion at 15+ Ancestral Resonance: 100% fire vulnerability, cannot receive party healing, forced movement shatters active runic networks dealing backlash, and the spirits demand service with 1d6 psychic/turn if you hoard resonance without invoking. The Animist walks three tightropes simultaneously, and falling from any one is devastating."
  },

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

**Core Mechanic 2 (Spirit Erosion)**: At 15+ resonance, the triple toll activates. You suffer 100% fire vulnerability, cannot receive party healing, and forced movement shatters your runic network. The spirits also demand service: 1d6 psychic damage per turn if you hoard resonance without spending.

**Core Mechanic 3 (Blood Price)**: Every ability costs HP. Totem eruption costs 5 HP. Rune carving costs 1d4-2d6 slashing self-damage. Curse casting drains 1d4 necrotic. The Animist is always bleeding.

**Playstyle**: Extreme battlefield control through three simultaneous systems. Terraform the terrain, summon ancestral specters, and invoke spirit interventions while managing a mounting spiritual debt that threatens to consume you.`,
    },
    description: `A walking archive of three dead traditions, written in scars, bone spurs, and spiritual static. The Animist does not cast magic; they undergo grotesque physical transformation. Bone erupts from flesh as totems. Blood carves glowing sigils into stone. The voices of ancestral spirits whisper through hallucinations that cannot be silenced. Every word of ancestral power costs a piece of the self: blood, memory, sanity, or all three.`,
    roleplayIdentity: {
      title: "Roleplay Identity",
      content: `**HISTORY: THE TRIPLE GENESIS**
The Animist's power was born from three founding events across the Mythrill continent. Kael the herd-ranger in the Sundrift Vale discovered totemic communion through bone eruption. Nyssa the herbalist in the Bryngloom discovered spirit invocation through loa bargaining. Theron the Skald in the Frozen Archive discovered runic inscription through memory sacrifice. The traditions merged when their carriers met at a crossroads and recognized each other's scars as the same ancestral language.

**CITIES & CIVIL RECEPTION**
Animists are viewed with a mixture of deep respect and visceral fear. Their bone spurs, glowing inscriptions, and spirit-static hallucinations make them unmistakable. They are essential in wilderness expeditions and siege defense, but unsettling in settled communities.

**RACES & CULTURAL AFFILIATION**
The class is practiced by the Ordan humans, Sylen Astril, Clean Vreken, Morren humans, Rune Keeper Skald, and Velun Neth.

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
        details: "100% fire vulnerability. Cannot receive party healing. Forced movement shatters runic networks (1d10 force per active rune). Spirits demand service: 1d6 psychic/turn if 15+ resonance and no invocation/spend this turn."
      },
      {
        title: "Blood Price",
        stats: "Constant Self-Damage",
        details: "Totem eruption costs 5 HP. Rune carving costs 1d4-2d6 slashing self-damage. Curse casting drains 1d4 necrotic self-damage. Every power costs the body."
      }
    ],
    generationTable: {
      headers: ["Action", "Resonance Gained", "Blood Price (HP Cost)", "Tradition"],
      rows: [
        ["Summon/Upgrade Totem", "+3 Resonance", "-5 HP", "Primalist"],
        ["Cast Curse", "+1 Resonance", "-1d4 necrotic self", "Spirit"],
        ["Apply Poison", "+1 Resonance", "-1 HP", "Spirit"],
        ["Place Healing Totem", "+1 Resonance", "-5 HP", "Primalist + Spirit"],
        ["Complete Ritual", "+2 Resonance", "-3d4 necrotic self", "Spirit"],
        ["Carve Level 1-2 Rune", "+1 Resonance", "-1d4 slashing self", "Inscriptor"],
        ["Carve Level 3+ Rune", "+2 Resonance", "-2d6 slashing self", "Inscriptor"],
        ["Remain Stationary (Turn Start)", "+1 Resonance", "Joints calcify", "Inscriptor"],
        ["Defeat Cursed Enemy", "+3 Resonance", "None", "Spirit"],
        ["Invoke Loa Spirit", "Spends 5-10 Resonance", "-3d6 necrotic self", "Spirit"],
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
      content: "At 15+ Ancestral Resonance, three catastrophic flaws activate simultaneously:\n1. **Flammable Being**: All fire damage is increased by 100%. No resistance bypass.\n2. **Ancestral Isolation**: Cannot benefit from healing spells cast by others. Your own totem healing still works on allies but not on you.\n3. **Runic Shatter**: If you are forcibly moved, all active runes shatter. Take 1d10 force damage per active rune and become vulnerable to all damage until end of next turn.\n4. **Spirit Demand**: If you end your turn at 15+ resonance without spending any, take 1d6 psychic damage from the demanding spirits."
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
      description: "At 15+ Ancestral Resonance: 100% fire vulnerability, cannot receive party healing, forced movement shatters runic networks (1d10 force/active rune), and 1d6 psychic/turn if hoarding without spending."
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
        keyAbilities: [
          "Ribcage Prison: Trap a target inside a cage of calcified bone for 2 rounds.",
          "Rune of Calcified Soil: Conjure two pillars instead of one, creating choke points.",
          "Choking Mud: Turn ground around a totem into rot-slick mud, reducing speed to 0.",
          "Network: Fortress of Flayed Stone: Connect all runes into an impenetrable fortress zone."
        ]
      },
      {
        id: "spirit_binder",
        name: "Spirit Binder",
        icon: "fas fa-ghost",
        color: "#8B008B",
        theme: "Beast Specters, Death Curses, Loa Invocation",
        description: "Fuses the Primalist's Bone-Stalker summoning with the Witch Doctor's Bokor death magic. The Spirit Binder is a summon-and-slay specialist who stitches the souls of dead beasts to their own nervous system, invokes death loa for devastating AoE, and curses enemies to feed the ancestral hunger.",
        playstyle: "Summoning specters, necrotic devastation, curse spreading, death invocation.",
        strengths: [
          "Summon multiple beast specters that share and amplify curse damage",
          "Baron Samedi invocation costs 2 less resonance and needs only 2 cursed enemies",
          "Curses generate +1 additional Ancestral Resonance",
          "Drains enemy vitality to replenish sacrificed HP through soul-siphon"
        ],
        weaknesses: [
          "Summons share your HP pool; fire damage to specters causes feedback damage",
          "Limited direct healing; must drain enemies to survive",
          "Weakest defensive positioning; no barriers or walls",
          "Cannot benefit from party healing at high resonance"
        ],
        specPassive: {
          name: "Shadow's Embrace",
          description: "Baron Samedi invocations cost 2 less resonance and require only 2 cursed enemies. Curses generate +1 additional Ancestral Resonance. Your beast summons deal +2 damage to bleeding or trapped targets."
        },
        keyAbilities: [
          "Wendigo Specters: Erupt starving wolves of bone and shadow from your torso.",
          "Invoke Baron Samedi: 14d6+spirit necrotic to all enemies, triple to cursed.",
          "Soul-Dredge: Drain vitality from target to heal your own flesh.",
          "Soul Siphon: Lifesteal that generates resonance on kill."
        ]
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
          "Allies take minor necrotic damage from branded weapons",
          "Lower personal shields; must rely on allies for defense",
          "Resonance generation depends on buffed allies dealing/taking damage",
          "Triple toll hits hardest due to aggressive playstyle"
        ],
        specPassive: {
          name: "Stormbrand Inscription",
          description: "When you carve an inscription onto an ally, take 1d6 slashing but ally gains +2 to attacks and saves for 5 rounds. Their weapon siphons life, healing 20% of damage dealt. Your spells deal +1d6 lightning damage near a Storm Totem. Simbi and Erzulie invocations cost 2 less resonance."
        },
        keyAbilities: [
          "Scribe: The Crimson Rite: Carve sigil onto ally weapon for +1d6 force damage on hit.",
          "Galvanic Antler: Shoot high-voltage sparks from your crown, shocking enemies.",
          "Totem of Healing: Healing totem that restores HP to nearby allies each turn.",
          "Invoke Simbi: Healing rain for 4d8 HP, cures diseases and poisons in 30ft."
        ]
      }
    ]
  },

  spellPools: {
    1: [
      "primalist_earth_bolt", "primalist_basic_healing_totem", "primalist_natures_blessing",
      "primalist_spirit_channel", "primalist_totem_bond", "primalist_whisper_gaea",
      "witch_doctor_withering_hex", "witch_doctor_venomous_sting", "witch_doctor_spirit_link", "witch-mojo_whisper",
      "inscriptor_arcane_inscription", "inscriptor_minor_rune", "inscriptor_rune_of_shielding", "inscriptor_scribes_ink"
    ],
    2: [
      "primalist_storm_gale", "primalist_earthen_shield", "primalist_spirit_sight",
      "witch_doctor_grave_bane", "witch_doctor_totem_of_warding", "witch_doctor_mending_wax",
      "inscriptor_rune_of_speed", "inscriptor_rune_of_warding", "inscriptor_flame_inscription", "inscriptor_rune_of_slowing"
    ],
    3: [
      "primalist_venomous_totem", "primalist_natures_grasp", "primalist_ancestral_bond", "primalist_shattered_conduit",
      "witch_doctor_bone_shrapnel", "witch_doctor_witch_brew", "witch_doctor_soul_siphon",
      "inscriptor_rune_of_destruction", "inscriptor_rune_of_vitality", "inscriptor_thorn_inscription", "inscriptor_rune_of_earth"
    ],
    4: [
      "primalist_earthquake_strike", "primalist_spirit_wolves", "primalist_primal_fury",
      "witch_doctor_mass_curse", "witch_doctor_voodoo_doll", "witch_doctor_invoke_simbi",
      "inscriptor_glyph_of_binding", "inscriptor_runic_shield", "inscriptor_sigil_of_power"
    ],
    5: [
      "primalist_thorn_barrier", "primalist_ancestral_guardian",
      "witch_doctor_hex", "witch_doctor_zombie_swarm", "witch_doctor_venomous_weapon",
      "inscriptor_rune_of_devastation", "inscriptor_glyph_mastery", "inscriptor_inscription_of_warding"
    ],
    6: [
      "primalist_elemental_fury_totem", "primalist_stone_skin",
      "witch_doctor_death_ward", "witch_doctor_invoke_papa_legba", "witch_doctor_totem_of_healing",
      "inscriptor_runic_array", "inscriptor_sigil_of_power_major", "inscriptor_glyph_nexus"
    ],
    7: [
      "primalist_meteor_storm", "primalist_natures_wrath",
      "witch_doctor_invoke_ogoun", "witch_doctor_invoke_erzulie", "witch_doctor_ritual_of_death",
      "inscriptor_ancient_rune", "inscriptor_inscribed_fortress", "inscriptor_master_inscriber"
    ],
    8: [
      "primalist_primal_apocalypse", "primalist_grand_totem_circle",
      "witch_doctor_invoke_baron_samedi", "witch_doctor_mass_resurrection", "witch_doctor_plague_storm",
      "inscriptor_primordial_glyph", "inscriptor_runic_apocalypse", "inscriptor_eternal_inscription"
    ],
    9: [
      "primalist_world_tree_avatar", "primalist_cataclysm", "primalist_eternal_totem",
      "witch_doctor_voodoo_apocalypse", "witch_doctor_spirit_ascension", "witch_doctor_invoke_erzulie_legendary",
      "inscriptor_worldscript", "inscriptor_master_of_runes", "inscriptor_inscription_of_eternity"
    ],
    10: [
      "primalist_primal_ascension", "primalist_gaia_wrath", "primalist_genesis",
      "witch_doctor_eternal_voodoo", "witch_doctor_invoke_papa_legba_supreme", "witch_doctor_ultimate_curse",
      "inscriptor_omniscript", "inscriptor_rune_of_creation", "inscriptor_runic_ascension"
    ]
  }
};
