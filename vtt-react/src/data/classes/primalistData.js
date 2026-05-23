/**
 * Primalist Class Data
 *
 * Visceral, tragic atavistic support-defender channeling the brutal, blood-soaked laws of the wilderness.
 * Ground-up overhaul conforming to the modern VTT schema.
 */

export const PRIMALIST_DATA = {
  id : "primalist",
  name: "Primalist",
  icon: "fas fa-leaf",
  role: "Support / Crowd Control / Defender (Atavistic Horror)",
  damageTypes: ["nature", "bludgeoning", "lightning", "frost", "fire"],

  // ==========================================
  // 1. CLASS OVERVIEW (Lore & Identity)
  // ==========================================
  overview: {
    title: "The Primalist",
    subtitle: "Atavistic Horror and the Tragic Price of the Wilds",
    quickOverview: {
      title: "Quick Overview",
      content: `**TL;DR**: The Primalist is a tragic, heavy atavistic support-defender. You summon totems of bone, antler, and root by sacrificing your own flesh (HP costs). You excel at **Apex Isolation** (forcibly separating and locking down high-value targets behind impenetrable walls of thorns, mud, and rot), but you suffer from the **Beast's Toll** (eroding your own mind as you channel primal violence, locking you out of items, communication, and ally buffs) and a **catastrophic 100% vulnerability to Fire**.

**Core Mechanic**: Sacrifice maximum HP to erupt totems of bone and root → Generate **Totemic Synergy** → Spend synergy on devastating atavistic lockdowns and cataclysms → Balance the mounting **Beast's Toll** before your human mind is completely consumed.

**Playstyle**: Atavistic area-denial, high-risk crowd control, and surgical support that demands blood and sacrifice. Perfect for players who want to dominate the battlefield through structural layout control and visceral self-sacrifice.`
    },
    description: `A tragic conduit of the ancient, ruthless food chain. The Primalist does not cast magic; they undergo a grotesque physical mutilation, erupting bone, antler, and strangling root from their own flesh to manifest totems of calcified decay.`,
    roleplayIdentity: {
      title: "The Flesh-Mutilation of the Wilds",
      content: `**Atavistic Horror**: You are not a gentle druid whispering to the trees—you are a tinderbox of dry roots and splintered bone. Every totem you place is a literal piece of your skeletal structure torn free to act as a conduit. 

**Tragic Folklore**: Heavily inspired by the crushing, atmospheric darkness of blackened thall and Witcher-esque folklore, the Primalist represents the visceral, unforgiving laws of nature. Power is never free; it is paid for in maximum HP, blood, and the slow unraveling of your sanity.`
    },
    combatRole: {
      title: "The Apex Isolator",
      content: `**Unavoidable Lockdown**: In battle, your role is to tear high-value targets away from their allies and drag them into the dark. Through towering barricades of thorn, mud, and rot, you isolate threats and subject them to savage lockdowns.

**Blood-Soaked Bastion**: You protect your allies by absorbing and mitigating damage through calcified rib-plates and gravelords, but you can never benefit from the healing pulses of your own totems. You are a one-way conduit of bone.`
    },
    playstyle: {
      title: "The Toll of the Beast",
      content: `**Agonizing Friction**: Every spell hurts. You pay HP costs to erect your totems and summon nature's specters. 

**Mind-Rotting Fury**: The **Beast's Toll** erodes your human cognitive faculties. As your Totemic Synergy builds, you lose the ability to speak, use complex tools or items, and your mind becomes so wild that your allies' magic cannot touch you. Furthermore, because you are an amalgamation of dry wood and fur, fire burns you with catastrophic fury (+100% fire damage).`
    },
    immersiveCombatExample: {
      title: "Combat Example: The Splintered Rib",
      content: `**The Setup**: You face a corrupted bandit commander in a narrow mountain pass. Your wizard is low on mana, and the commander is preparing a devastating charge.

**Turn 1 - Eruption**: You slam your hand into the damp earth. A sickening CRACK echoes as a calcified pillar of your own ribs erupts from the soil (Grave-Root Totem). You take 5 physical damage and sacrifice 5 maximum HP. The totem pulses, healing your bleeding ranger, but you feel nothing but the biting wind.

**Turn 2 - The Drag**: The bandit captain tries to reach your wizard. You channel the **Bramble-Grip Lockdown**. Giant, thorny roots burst from your forearms, tearing your flesh, and wrap around his ankles. You drag him 30 feet into the dark forest, away from his guards, trapping him behind a wall of rot.

**Turn 3 - Fire and Ashes**: A bandit wizard hurls a fireball. Because of your **Beast's Toll**, you are highly flammable. The flames lick your bark-like hide and deal double damage, scorching your skin to ash. You roar in animalistic fury, unable to cry out in a human tongue, as the beast within takes full control.`
    }
  },

  // ==========================================
  // 2. RESOURCE SYSTEM
  // ==========================================
  resourceSystem: {
    title: "Totemic Synergy & The Beast's Toll",
    subtitle: "The Agony of the Wild Loop",
    description: "The Primalist's power operates on a visceral cycle of self-mutilation and mental erosion. Every totem you summon by sacrificing your own flesh increases your Totemic Synergy. This synergy is spent on devastating high-level spells, but as you channel these atavistic forces, the Beast's Toll erodes your human mind.",
    cards: [
      {
        title: "Totemic Synergy",
        stats: "0-20 Synergy",
        details: "Generated by summoning totems (usually +3 per totem) and sacrificing HP. Spent on high-tier atavistic spells."
      },
      {
        title: "The Beast's Toll",
        stats: "Catastrophic Flaw",
        details: "At high synergy, you cannot speak, use items, or benefit from party buffs. You suffer +100% damage from Fire."
      },
      {
        title: "Apex Isolation",
        stats: "Lockdown Specialist",
        details: "Spells and totems create physical barriers of bone and rot that block line of sight and isolate high-value targets."
      }
    ],
    generationTable: {
      headers: ["Action", "Synergy Gained", "Flesh Toll (HP Cost)", "Cognitive State Change"],
      rows: [
        ["Summon Grave-Root Totem", "+3 Synergy", "-5 HP", "Voice begins to crack into animalistic growls"],
        ["Summon Sepulcher Totem", "+3 Synergy", "-5 HP", "Cannot use complex items or tools"],
        ["Bramble-Grip Lockdown", "+4 Synergy", "-10 HP", "Cannot speak human words or benefit from party buffs"],
        ["Mother's Fury", "Spends 10 Synergy", "-15 HP", "Immune to fear but totally isolated"],
        ["The Great Annihilation", "Spends 18 Synergy", "-20 HP", "Absolute animalistic frenzy; hard-coded Fire vulnerability active"]
      ]
    },
    usage: {
      momentum: "Erect totems early by paying HP costs to build Synergy. Once Synergy is high, unleash devastating isolation spells, but beware the Fire vulnerability and the inability to receive party healing.",
      flourish: "⚠️ Flammability Clause: Any source of Fire damage dealt to the Primalist is increased by exactly 100%. This vulnerability cannot be bypassed by resistance spells."
    },
    overheatRules: {
      title: "Mental Erosion",
      content: "When you reach 15 or more Synergy, you enter a state of Atavistic Frenzy. While in this state, you are immune to fear and charm, but you cannot speak, use potions or equipment, or be targeted by friendly spells. You are entirely on your own."
    },
    strategicConsiderations: {
      title: "Surgical Isolation",
      content: "Use your totems to block corridors and trap enemies. By placing a totem in a doorway, you can completely isolate a boss from their minions while your group finishes them off."
    },
    playingInPerson: {
      title: "Playing in Person",
      subtitle: "The Splintered Bone Pile",
      content: "Use bone-white tokens to track your Totemic Synergy. When you cast a spell that costs HP, physically slide a token from your 'Life Pool' to your 'Synergy Pool' to represent the physical marrow being drained from your bones."
    }
  },

  // ==========================================
  // 3. SPECIALIZATIONS
  // ==========================================
  specializations: {
    title: "Primalist Specializations",
    subtitle: "Three Paths of Skeletal Eruption",
    description: "Primalists choose how their bodies mutate under the atavistic influence of the wild. Whether weaving impenetrable cages of bone, calling down storms of blackened thall, or stitching spirits to their own ribs, each path represents a tragic adaptation to the harsh laws of the food chain.",
    passiveAbility: {
      name: "Beast's Toll",
      description: "You possess a catastrophic 100% vulnerability to Fire damage (take double damage). Furthermore, you cannot benefit from the healing effects of your own totems."
    },
    specs: [
      { id : "earthwarden",
        name: "Root-Weaver (Earthwarden)",
        icon: "Nature/Earth Shield",
        color: "#8B4513",
        theme: "Bone Cages, Impenetrable Walls of Rot & Apex Isolation",
        description: "The Root-Weaver focuses on the heavy, silent power of soil and calcified marrow. They mutate their own skeletal system to construct massive barriers, trapping targets in inescapable ribcages of stone and root.",
        playstyle: "Apex isolation, crowd control, area-denial, high durability.",
        strengths: [
          "Can create high-HP walls of bone and thorn to divide the battlefield",
          "Excellent at locking down single targets inside ribcages",
          "High base armor and damage mitigation"
        ],
        weaknesses: [
          "Extremely slow movement speed",
          "Higher HP sacrifice costs for bone-weaving spells",
          "Highly dependent on active totems for survival"
        ],
        specPassive: {
          name: "Calcified Skeleton",
          description: "Gain +3 Armor. When a totem you placed is within 10 feet of you, you gain resistance to all physical damage types."
        },
        keyAbilities: [
          "Ribcage Prison: Trap a target inside a cage of calcified bone for 2 rounds.",
          "Choking Mud: Turn the ground around a totem into rot-slick mud, reducing enemy speed to 0.",
          "Ironwood Bark: Sacrificing 10 HP to coat your skin in thick, petrified bark."
        ],
        recommendedFor: "Players who want to act as an unyielding wall of wood and bone, locking down the strongest enemies."
      },
      { id : "stormbringer",
        name: "Sky-Thresher (Stormbringer)",
        icon: "Lightning/Thunder",
        color: "#4682B4",
        theme: "Blackened Thall, Static Antlers & Raining Sparks",
        description: "The Sky-Thresher channels the raw, agonizing power of galvanic storms. They grow jagged, metal-infused antlers that act as lightning rods, calling down deafening bolts that tear through flesh and earth.",
        playstyle: "High-risk offensive lightning damage, stat enhancement, area lightning.",
        strengths: [
          "Massive elemental nature and lightning damage",
          "Increases spell performance of all friendly spellcasters",
          "Can reposition totems violently to strike from new angles"
        ],
        weaknesses: [
          "Zero personal healing capabilities",
          "Static discharge damages self on high rolls",
          "Very vulnerable to physical attacks while channeling"
        ],
        specPassive: {
          name: "Galvanic Crown",
          description: "Your spells deal +1d6 additional lightning damage when you are standing within 10 feet of a Storm Totem."
        },
        keyAbilities: [
          "Static Antler: Shoot high-voltage sparks from your crown, shocking enemies.",
          "Galvanic Reposition: Violently snap your totems to a new target, shocking everyone in the path.",
          "Sky-Tear Avalanche: Rain jagged shards of lightning-scarred stone upon the field."
        ],
        recommendedFor: "Players who want to play a high-risk glass cannon channeling the devastating fury of a blackened storm."
      },
      { id : "spiritcaller",
        name: "Bone-Stalker (Spiritcaller)",
        icon: "Nature/Nature Primal",
        color: "#556B2F",
        theme: "Wendigo Specters, Soul-Dredging & Tragic Sacrifices",
        description: "The Bone-Stalker acts as a tragic conduit for the long-dead beasts of the primordial forest. They stitch the souls of starved wolves and skeletal raptors to their own nervous system, sending them out to hunt.",
        playstyle: "Summoning nature specters, drain-healing, debilitating status effects.",
        strengths: [
          "Can summon multiple specters of wood and bone",
          "Drains enemy vitality to replenish their own sacrificed HP",
          "Inflicts terrifying debuffs that erode enemy saving throws"
        ],
        weaknesses: [
          "Summons share your HP pool; if they burn, you take feedback damage",
          "Extremely high resource costs",
          "Weak direct damage without summons"
        ],
        specPassive: {
          name: "Starved Pack",
          description: "Your beast summons deal +2 damage to targets that are bleeding or trapped by your crowd control."
        },
        keyAbilities: [
          "Wendigo Specter: Erupt a starving wolf of bone and shadow from your torso.",
          "Soul-Dredge: Drain the vitality of a target to heal your own flesh.",
          "Ancestral Whispers: Debuff enemy Dodge and Willpower saves as the dead howl."
        ],
        recommendedFor: "Players who enjoy summoner playstyles with a dark, necromantic-nature twist."
      }
    ]
  },

  // ==========================================
  // 4. EXAMPLE SPELLS (13 Spells)
  // ==========================================
  exampleSpells: [
    { id : "prim_healing_totem",
      name: "Grave-Root Healing Totem",
      description: "Slam a splinter of your own femur into the soil. Roots burst from the bone, drinking 5 of your HP to knit the wounds of your allies for 1d6 healing at the start of their turn. You cannot receive this healing.",
      level: 2,
      spellType: "ACTION",
      icon: "Healing/Heart Ripple",
      effectTypes: ["healing", "summoning"],
      typeConfig: {
        school: "nature",
        icon: "Healing/Heart Ripple",
        castTime: 1,
        castTimeType: "IMMEDIATE",
        tags: ["healing", "totem", "nature"]
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 5,
        durationUnit: "rounds"
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 0
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
        targetRestrictions: ["any"],
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: ["mana", "totemic_synergy"],
        resourceValues: {
          mana: 3,
          totemic_synergy: 5
        },
        actionPoints: 1
      },
      healingConfig: {
        formula: "1d6",
        healingType: "direct",
        resolution: "DICE"
      },
      summoningConfig: {
        creatures: [
          { id : "healing_totem_summon",
            name: "Healing Totem",
            description: "A splintered bone structure pulsing with raw, vegetative sap.",
            size: "Small",
            type: "construct",
            tokenIcon: "spell_nature_healingtouch",
            stats: {
              maxHp: 10,
              armor: 12,
              maxMana: 0
            },
            config: {
              quantity: 1,
              duration: 5,
              durationUnit: "rounds",
              hasDuration: true,
              concentration: false,
              controlType: "autonomous",
              controlRange: 0
            }
          }
        ]
      },
      resolution: "DICE",
      tags: ["healing", "totem", "nature"]
    },

    { id : "prim_rejuvenation_totem",
      name: "Blood-Sap Totem",
      description: "A totem of living bark that weeps thick sap, drinking 5 of your HP to grant allies 1d4 healing at the start of their turns. You cannot receive this healing.",
      level: 2,
      spellType: "ACTION",
      icon: "Healing/Renewal",
      effectTypes: ["healing", "summoning"],
      typeConfig: {
        school: "nature",
        icon: "Healing/Renewal",
        castTime: 1,
        castTimeType: "IMMEDIATE",
        tags: ["healing", "totem", "nature"]
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 5,
        durationUnit: "rounds"
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 0
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
        targetRestrictions: ["any"],
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: ["mana", "totemic_synergy"],
        resourceValues: {
          mana: 3,
          totemic_synergy: 5
        },
        actionPoints: 1
      },
      healingConfig: {
        formula: "1d4",
        healingType: "direct",
        resolution: "DICE"
      },
      summoningConfig: {
        creatures: [
          { id : "rejuvenation_totem_summon",
            name: "Rejuvenation Totem",
            description: "Thick bark weeps dark crimson sap.",
            size: "Small",
            type: "construct",
            tokenIcon: "spell_nature_rejuvenation",
            stats: {
              maxHp: 10,
              armor: 12,
              maxMana: 0
            },
            config: {
              quantity: 1,
              duration: 5,
              durationUnit: "rounds",
              hasDuration: true,
              concentration: false,
              controlType: "autonomous",
              controlRange: 0
            }
          }
        ]
      },
      resolution: "DICE",
      tags: ["healing", "totem", "nature"]
    },

    { id : "prim_guardian_totem",
      name: "Ribcage Guardian Totem",
      description: "Erupt a cage of calcified ribs from the earth, sacrificing 5 HP. The ribs shield nearby allies, absorbing 5 damage per attack. You cannot benefit from this shielding.",
      level: 3,
      spellType: "ACTION",
      icon: "Nature/Earth Shield",
      effectTypes: ["buff", "summoning"],
      typeConfig: {
        school: "nature",
        icon: "Nature/Earth Shield",
        castTime: 1,
        castTimeType: "IMMEDIATE",
        tags: ["buff", "totem", "protection"]
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 5,
        durationUnit: "rounds"
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 0
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
        targetRestrictions: ["any"],
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: ["mana", "totemic_synergy"],
        resourceValues: {
          mana: 3,
          totemic_synergy: 5
        },
        actionPoints: 1
      },
      buffConfig: {
        buffType: "damageMitigation",
        effects: [
          { id : "guardian_shield_effect",
            name: "Ribcage Ward",
            description: "Absorbs 5 damage from any hostile attack.",
            statModifier: {
              stat: "damage_absorption",
              magnitude: 5,
              magnitudeType: "flat"
            }
          }
        ],
        durationValue: 5,
        durationType: "rounds",
        durationUnit: "rounds",
        concentrationRequired: false,
        canBeDispelled: true
      },
      summoningConfig: {
        creatures: [
          { id : "guardian_totem_summon",
            name: "Guardian Totem",
            description: "A hollow cage of bone that intercepts flying projectiles.",
            size: "Small",
            type: "construct",
            tokenIcon: "spell_nature_stoneclawtotem",
            stats: {
              maxHp: 10,
              armor: 12,
              maxMana: 0
            },
            config: {
              quantity: 1,
              duration: 5,
              durationUnit: "rounds",
              hasDuration: true,
              concentration: false,
              controlType: "autonomous",
              controlRange: 0
            }
          }
        ]
      },
      resolution: "AUTOMATIC",
      tags: ["buff", "totem", "protection"]
    },

    { id : "prim_earth_totem",
      name: "Lithic Spine Totem",
      description: "Shatter your knuckles to grow a pillar of jagged granite. Sacrificing 5 HP, it grants allies +2 Armor and resistance to non-magical bludgeoning damage.",
      level: 3,
      spellType: "ACTION",
      icon: "General/Increase Strength",
      effectTypes: ["buff", "summoning"],
      typeConfig: {
        school: "nature",
        icon: "General/Increase Strength",
        castTime: 1,
        castTimeType: "IMMEDIATE",
        tags: ["buff", "totem", "earth"]
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 5,
        durationUnit: "rounds"
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 0
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
        targetRestrictions: ["any"],
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: ["mana", "totemic_synergy"],
        resourceValues: {
          mana: 3,
          totemic_synergy: 5
        },
        actionPoints: 1
      },
      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          { id : "earth_totem_buff",
            name: "Lithic Stature",
            description: "Grants +2 Armor.",
            statModifier: {
              stat: "armor",
              magnitude: 2,
              magnitudeType: "flat"
            }
          }
        ],
        durationValue: 5,
        durationType: "rounds",
        durationUnit: "rounds",
        concentrationRequired: false,
        canBeDispelled: true
      },
      summoningConfig: {
        creatures: [
          { id : "earth_totem_summon",
            name: "Earth Totem",
            description: "A heavy, jagged granite pillar weeping grey sand.",
            size: "Small",
            type: "construct",
            tokenIcon: "spell_nature_tremortotem",
            stats: {
              maxHp: 10,
              armor: 12,
              maxMana: 0
            },
            config: {
              quantity: 1,
              duration: 5,
              durationUnit: "rounds",
              hasDuration: true,
              concentration: false,
              controlType: "autonomous",
              controlRange: 0
            }
          }
        ]
      },
      resolution: "AUTOMATIC",
      tags: ["buff", "totem", "earth"]
    },

    { id : "prim_flamecaller_totem",
      name: "Ashen Hearth Totem",
      description: "Exude scorching embers from your pores, sacrificing 5 HP to raise a totem of charred pine. Allies' weapon attacks deal +1d6 fire damage. Remember your Fire vulnerability.",
      level: 3,
      spellType: "ACTION",
      icon: "Fire/Fiery Symbol",
      effectTypes: ["buff", "summoning"],
      typeConfig: {
        school: "fire",
        icon: "Fire/Fiery Symbol",
        castTime: 1,
        castTimeType: "IMMEDIATE",
        tags: ["buff", "totem", "fire"]
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 5,
        durationUnit: "rounds"
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 0
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
        targetRestrictions: ["any"],
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: ["mana", "totemic_synergy"],
        resourceValues: {
          mana: 3,
          totemic_synergy: 5
        },
        actionPoints: 1
      },
      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          { id : "flamecaller_totem_buff",
            name: "Ashen Embers",
            description: "Weapon attacks deal +1d6 fire damage.",
            statModifier: {
              stat: "weapon_damage_fire",
              magnitude: 1,
              magnitudeType: "dice"
            }
          }
        ],
        durationValue: 5,
        durationType: "rounds",
        durationUnit: "rounds",
        concentrationRequired: false,
        canBeDispelled: true
      },
      summoningConfig: {
        creatures: [
          { id : "flamecaller_totem_summon",
            name: "Flamecaller Totem",
            description: "A charred pine trunk glowing internally with fire.",
            size: "Small",
            type: "construct",
            tokenIcon: "spell_fire_totemofwrath",
            stats: {
              maxHp: 10,
              armor: 12,
              maxMana: 0
            },
            config: {
              quantity: 1,
              duration: 5,
              durationUnit: "rounds",
              hasDuration: true,
              concentration: false,
              controlType: "autonomous",
              controlRange: 0
            }
          }
        ]
      },
      resolution: "AUTOMATIC",
      tags: ["buff", "totem", "fire"]
    },

    { id : "prim_storm_totem",
      name: "Galvanic Antler Totem",
      description: "Plant a lightning-scarred antler wreathed in static electricity. Sacrificing 5 HP, it grants allies +1 to spell attack rolls and spell save DCs.",
      level: 3,
      spellType: "ACTION",
      icon: "Lightning/Thunder",
      effectTypes: ["buff", "summoning"],
      typeConfig: {
        school: "lightning",
        icon: "Lightning/Thunder",
        castTime: 1,
        castTimeType: "IMMEDIATE",
        tags: ["buff", "totem", "storm"]
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 5,
        durationUnit: "rounds"
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 0
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
        targetRestrictions: ["any"],
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: ["mana", "totemic_synergy"],
        resourceValues: {
          mana: 3,
          totemic_synergy: 5
        },
        actionPoints: 1
      },
      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          { id : "storm_totem_buff_effect",
            name: "Galvanic Focus",
            description: "Adds +1 to all spell attack rolls and spell save DCs.",
            statModifier: {
              stat: "spell_attack",
              magnitude: 1,
              magnitudeType: "flat"
            }
          }
        ],
        durationValue: 5,
        durationType: "rounds",
        durationUnit: "rounds",
        concentrationRequired: false,
        canBeDispelled: true
      },
      summoningConfig: {
        creatures: [
          { id : "storm_totem_summon",
            name: "Storm Totem",
            description: "A huge, conductive antler wreathed in blue sparks.",
            size: "Small",
            type: "construct",
            tokenIcon: "spell_nature_lightning",
            stats: {
              maxHp: 10,
              armor: 12,
              maxMana: 0
            },
            config: {
              quantity: 1,
              duration: 5,
              durationUnit: "rounds",
              hasDuration: true,
              concentration: false,
              controlType: "autonomous",
              controlRange: 0
            }
          }
        ]
      },
      resolution: "AUTOMATIC",
      tags: ["buff", "totem", "storm"]
    },

    { id : "prim_frost_totem",
      name: "Chill-Vein Totem",
      description: "Sow a fragment of frozen bone that leaks glacial frost. Sacrificing 5 HP, it slows enemies' movement speed by 10 feet and reduces their attack speed by 25%.",
      level: 3,
      spellType: "ACTION",
      icon: "Frost/Inflicted Ice Shard",
      effectTypes: ["debuff", "summoning"],
      typeConfig: {
        school: "frost",
        icon: "Frost/Inflicted Ice Shard",
        castTime: 1,
        castTimeType: "IMMEDIATE",
        tags: ["debuff", "totem", "frost"]
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 5,
        durationUnit: "rounds"
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 0
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
        targetRestrictions: ["any"],
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: ["mana", "totemic_synergy"],
        resourceValues: {
          mana: 3,
          totemic_synergy: 5
        },
        actionPoints: 1
      },
      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          { id : "frost_slow_effect",
            name: "Chill-Vein Frost",
            description: "Shatters movement speed and slows reflexes."
          }
        ],
        durationValue: 5,
        durationType: "rounds",
        durationUnit: "rounds"
      },
      summoningConfig: {
        creatures: [
          { id : "frost_totem_summon",
            name: "Frost Totem",
            description: "A frozen bone chunk that radiates blinding cold.",
            size: "Small",
            type: "construct",
            tokenIcon: "spell_frost_glaciershield",
            stats: {
              maxHp: 10,
              armor: 12,
              maxMana: 0
            },
            config: {
              quantity: 1,
              duration: 5,
              durationUnit: "rounds",
              hasDuration: true,
              concentration: false,
              controlType: "autonomous",
              controlRange: 0
            }
          }
        ]
      },
      resolution: "AUTOMATIC",
      tags: ["debuff", "totem", "frost"]
    },

    { id : "prim_wind_totem",
      name: "Gale-Howl Totem",
      description: "Uproot a hollow branch that whistles with ancient storm winds. Sacrificing 5 HP, it increases allies' movement speed by 10 feet and grants them advantage on Dodge (Agility) saves.",
      level: 2,
      spellType: "ACTION",
      icon: "Nature/Wind Gust",
      effectTypes: ["buff", "summoning"],
      typeConfig: {
        school: "nature",
        icon: "Nature/Wind Gust",
        castTime: 1,
        castTimeType: "IMMEDIATE",
        tags: ["buff", "totem", "wind"]
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 5,
        durationUnit: "rounds"
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 0
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
        targetRestrictions: ["any"],
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: ["mana", "totemic_synergy"],
        resourceValues: {
          mana: 3,
          totemic_synergy: 5
        },
        actionPoints: 1
      },
      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          { id : "wind_totem_buff_effect",
            name: "Gale Swiftness",
            description: "Increases movement speed by 10 feet.",
            statModifier: {
              stat: "movement_speed",
              magnitude: 10,
              magnitudeType: "flat"
            }
          }
        ],
        durationValue: 5,
        durationType: "rounds",
        durationUnit: "rounds",
        concentrationRequired: false,
        canBeDispelled: true
      },
      summoningConfig: {
        creatures: [
          { id : "wind_totem_summon",
            name: "Wind Totem",
            description: "A hollow birch limb screaming with tempestuous wind.",
            size: "Small",
            type: "construct",
            tokenIcon: "spell_nature_windfury",
            stats: {
              maxHp: 10,
              armor: 12,
              maxMana: 0
            },
            config: {
              quantity: 1,
              duration: 5,
              durationUnit: "rounds",
              hasDuration: true,
              concentration: false,
              controlType: "autonomous",
              controlRange: 0
            }
          }
        ]
      },
      resolution: "AUTOMATIC",
      tags: ["buff", "totem", "wind"]
    },

    { id : "prim_healing_sanctuary",
      name: "Tragic Sanctuary",
      description: "When Grave-Root, Blood-Sap, Ribcage, and Lithic totems resonate, channel a tragic dome of protection. Sacrificing 10 HP, heals allies for 3d6, grants +3 Armor, and reduces damage taken by 25% for 2 rounds. You cannot receive this healing.",
      level: 5,
      spellType: "REACTION",
      icon: "Healing/Prayer",
      effectTypes: ["healing", "buff"],
      typeConfig: {
        school: "nature",
        icon: "Healing/Prayer",
        castTime: 1,
        castTimeType: "REACTION",
        tags: ["healing", "buff", "synergy"]
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 2,
        durationUnit: "rounds"
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 3
      },
      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
        targetRestrictions: ["allies"],
        requiresLineOfSight: false
      },
      resourceCost: {
        resourceTypes: ["mana", "totemic_synergy"],
        resourceValues: {
          mana: 6,
          totemic_synergy: 10,
          totemic_synergy: 12
        },
        actionPoints: 1
      },
      healingConfig: {
        formula: "3d6",
        healingType: "direct",
        resolution: "DICE"
      },
      buffConfig: {
        buffType: "damageMitigation",
        effects: [
          { id : "tragic_sanctuary_armor_buff",
            name: "Tragic Sanctuary Wards",
            description: "+3 Armor and 25% damage reduction.",
            statModifier: {
              stat: "armor",
              magnitude: 3,
              magnitudeType: "flat"
            }
          }
        ],
        durationValue: 2,
        durationType: "rounds",
        durationUnit: "rounds",
        concentrationRequired: false,
        canBeDispelled: false
      },
      resolution: "DICE",
      tags: ["healing", "buff", "synergy"]
    },

    { id : "prim_elemental_fury",
      name: "Atavistic Clashing",
      description: "When Flamecaller, Storm, Frost, and Wind totems resonate, invoke a gruesome elemental surge. Deals 8d6 damage to targets within a 30-foot radius. Deals 15 fire damage to yourself as your body combusts.",
      level: 6,
      spellType: "REACTION",
      icon: "Fire/Eruption",
      effectTypes: ["damage"],
      typeConfig: {
        school: "chaos",
        icon: "Fire/Eruption",
        castTime: 1,
        castTimeType: "REACTION",
        tags: ["damage", "synergy"]
      },
      durationConfig: {
        durationType: "instant",
        durationValue: 0,
        durationUnit: "instant"
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 4
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        rangeDistance: 30,
        aoeShape: "circle",
        aoeParameters: { radius: 30 },
        targetRestrictions: ["enemies"],
        requiresLineOfSight: false
      },
      resourceCost: {
        resourceTypes: ["mana", "totemic_synergy"],
        resourceValues: {
          mana: 8,
          totemic_synergy: 15,
          totemic_synergy: 15
        },
        actionPoints: 1
      },
      damageConfig: {
        formula: "8d6",
        elementType: "chaos",
        damageTypes: ["fire", "lightning", "frost"],
        resolution: "DICE"
      },
      resolution: "DICE",
      tags: ["damage", "synergy"]
    },

    { id : "prim_totemic_call",
      name: "Eruption of the Circle",
      description: "Undergo a horrifying physical convulsion, sacrificing 20 HP to grow all 8 totems simultaneously in a circle around you for 10 rounds. The sudden surge grants 8 Synergy immediately.",
      level: 7,
      spellType: "ACTION",
      icon: "Nature/Entangled",
      effectTypes: ["summoning"],
      typeConfig: {
        school: "nature",
        icon: "Nature/Entangled",
        castTime: 2,
        castTimeType: "IMMEDIATE",
        tags: ["summoning", "ultimate"]
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 10,
        durationUnit: "rounds"
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 5
      },
      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
        targetRestrictions: [],
        requiresLineOfSight: false
      },
      resourceCost: {
        resourceTypes: ["mana", "totemic_synergy"],
        resourceValues: {
          mana: 10,
          totemic_synergy: 20
        },
        actionPoints: 2
      },
      summoningConfig: {
        creatures: [
          { id : "all_eight_totems_summon",
            name: "All 8 Totems",
            description: "A massive, dense circle of 8 bone and root structures.",
            size: "Medium",
            type: "construct",
            tokenIcon: "spell_nature_stoneclawtotem",
            stats: {
              maxHp: 15,
              armor: 14,
              maxMana: 0
            },
            config: {
              quantity: 8,
              duration: 10,
              durationUnit: "rounds",
              hasDuration: true,
              concentration: false,
              controlType: "autonomous",
              controlRange: 0
            }
          }
        ]
      },
      resolution: "AUTOMATIC",
      tags: ["summoning", "ultimate"]
    },

    { id : "prim_totemic_recall",
      name: "Agonizing Pull",
      description: "Violently drag the roots of your totems through the dirt back to your feet. Repositions all active totems to your current location. You take 5 physical damage from the violent snapping of wood and bone.",
      level: 3,
      spellType: "ACTION",
      icon: "Nature/Thorny Entanglement",
      effectTypes: ["utility"],
      typeConfig: {
        school: "nature",
        icon: "Nature/Thorny Entanglement",
        castTime: 1,
        castTimeType: "IMMEDIATE",
        tags: ["utility"]
      },
      durationConfig: {
        durationType: "instant",
        durationValue: 0,
        durationUnit: "instant"
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 1
      },
      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
        targetRestrictions: [],
        requiresLineOfSight: false
      },
      resourceCost: {
        resourceTypes: ["mana", "totemic_synergy"],
        resourceValues: {
          mana: 4,
          totemic_synergy: 5
        },
        actionPoints: 1
      },
      utilityConfig: {
        utilityType: "custom",
        selectedEffects: [
          { id : "totemic_recall_active_effect",
            name: "Agonizing Relocation",
            description: "Pulls all active totems to your current cell instantly."
          }
        ],
        duration: 0,
        durationUnit: "instant",
        concentration: false
      },
      resolution: "AUTOMATIC",
      tags: ["utility"]
    },

    { id : "prim_earthquake",
      name: "Spine-Shatter Tremor",
      description: "Slam your own spine into the earth, sending a devastating tremor through the dirt. Deals 4d6 bludgeoning damage to all creatures in a 50-foot radius. Enemies who fail a Dodge save are knocked prone.",
      level: 8,
      spellType: "ACTION",
      icon: "Nature/Earth Shatter",
      effectTypes: ["damage", "control"],
      typeConfig: {
        school: "nature",
        icon: "Nature/Earth Shatter",
        castTime: 2,
        castTimeType: "IMMEDIATE",
        tags: ["damage", "control", "earth"]
      },
      durationConfig: {
        durationType: "instant",
        durationValue: 0,
        durationUnit: "instant"
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 3
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 120,
        aoeShape: "circle",
        aoeParameters: { radius: 50 },
        targetRestrictions: ["enemies"],
        requiresLineOfSight: false
      },
      resourceCost: {
        resourceTypes: ["mana", "totemic_synergy"],
        resourceValues: {
          mana: 8,
          totemic_synergy: 10
        },
        actionPoints: 2
      },
      damageConfig: {
        formula: "4d6",
        elementType: "nature",
        damageTypes: ["bludgeoning"],
        savingThrow: {
          ability: "dodge",
          difficultyClass: 16,
          saveOutcome: "half_damage"
        },
        resolution: "DICE"
      },
      controlConfig: {
        controlType: "lockdown",
        strength: "moderate",
        duration: 1,
        durationUnit: "rounds",
        effects: [
          { id : "earthquake_prone_effect",
            name: "Prone",
            description: "Knocked flat on the vibrating ground.",
            config: {
              durationType: "rounds",
              recoveryMethod: "automatic",
              duration: 1,
              durationUnit: "rounds"
            }
          }
        ]
      },
      resolution: "DICE",
      tags: ["damage", "control", "earth"]
    }
  ],

  // ==========================================
  // 5. LEVEL 1-10 CORE SPELLS & PASSIVES
  // ==========================================
  spells: [
    // ===== LEVEL 1 SPELLS =====
    { id: "primalist_earth_bolt",
      name: "Spine-Shard Bolt",
      description: "Shoot a calcified splinter of your own bone, sacrificing 2 HP. Deals 2d6 piercing and nature damage. Target must make a Dodge save or take full damage.",
      level: 1,
      spellType: "ACTION",
      icon: "Nature/Earth Shatter",
      effectTypes: ["damage"],
      typeConfig: {
        school: "nature",
        icon: "Nature/Earth Shatter",
        castTime: 1,
        castTimeType: "IMMEDIATE",
        tags: ["attack", "damage", "ranged"]
      },
      durationConfig: {
        durationType: "instant",
        durationValue: 0,
        durationUnit: "instant"
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 0
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: ["enemy"],
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: ["mana", "totemic_synergy"],
        resourceValues: {
          mana: 2,
          totemic_synergy: 2
        },
        actionPoints: 1
      },
      damageConfig: {
        formula: "2d6 + spirit",
        elementType: "nature",
        damageTypes: ["nature", "piercing"],
        savingThrow: {
          ability: "dodge",
          difficultyClass: 12,
          saveOutcome: "half_damage"
        },
        resolution: "DICE"
      },
      resolution: "DICE",
      tags: ["attack", "damage", "ranged"]
    },

    { id: "primalist_basic_healing_totem",
      name: "Rot-Sap Spindle",
      description: "Erupt a bone totem, sacrificing 4 HP. Pulses for 1d6 healing at the start of allies' turns for 3 rounds. You cannot receive this healing.",
      level: 1,
      spellType: "ACTION",
      icon: "Healing/Heart Ripple",
      effectTypes: ["healing", "summoning"],
      typeConfig: {
        school: "nature",
        icon: "Healing/Heart Ripple",
        castTime: 1,
        castTimeType: "IMMEDIATE",
        tags: ["healing", "totem", "nature"]
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds"
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 0
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
        targetRestrictions: ["any"],
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: ["mana", "totemic_synergy"],
        resourceValues: {
          mana: 3,
          totemic_synergy: 4
        },
        actionPoints: 1
      },
      healingConfig: {
        formula: "1d6",
        healingType: "direct",
        resolution: "DICE"
      },
      summoningConfig: {
        creatures: [
          { id : "rot_sap_spindle_summon",
            name: "Rot-Sap Spindle",
            description: "A small totem pulsing with dark green life.",
            size: "Small",
            type: "construct",
            tokenIcon: "spell_nature_healingtouch",
            stats: {
              maxHp: 10,
              armor: 10,
              maxMana: 0
            },
            config: {
              quantity: 1,
              duration: 3,
              durationUnit: "rounds",
              hasDuration: true,
              concentration: false,
              controlType: "autonomous",
              controlRange: 0
            }
          }
        ]
      },
      resolution: "DICE",
      tags: ["healing", "totem", "nature"]
    },

    { id: "primalist_natures_blessing",
      name: "Flayed Blessing",
      description: "Sacrifice 3 HP to weave a bloody web around an ally. Target receives +2 to all rolls and regenerates 1d4 HP per round for 2 rounds.",
      level: 1,
      spellType: "ACTION",
      icon: "Nature/Nature Primal",
      effectTypes: ["buff"],
      typeConfig: {
        school: "nature",
        icon: "Nature/Nature Primal",
        castTime: 1,
        castTimeType: "IMMEDIATE",
        tags: ["buff", "nature"]
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 2,
        durationUnit: "rounds"
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 0
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 45,
        targetRestrictions: ["ally"],
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: ["mana", "totemic_synergy"],
        resourceValues: {
          mana: 4,
          totemic_synergy: 3
        },
        actionPoints: 1
      },
      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          { id : "flayed_blessing_buff",
            name: "Flayed Vigor",
            description: "+2 to all rolls and 1d4 healing per round.",
            statModifier: {
              stat: "all_rolls",
              magnitude: 2,
              magnitudeType: "flat"
            }
          }
        ],
        durationValue: 2,
        durationType: "rounds",
        durationUnit: "rounds",
        concentrationRequired: false,
        canBeDispelled: true
      },
      resolution: "AUTOMATIC",
      tags: ["buff", "nature"]
    },

    // ===== LEVEL 2 SPELLS =====
    { id: "primalist_storm_gale",
      name: "Choking Gales",
      description: "Sacrifice 3 HP to summon a black, howling storm. Silences all enemies and reduces their speed by 15 feet inside the gale for 1 round.",
      level: 2,
      spellType: "ACTION",
      icon: "Nature/Wind Gust",
      effectTypes: ["debuff", "control"],
      typeConfig: {
        school: "nature",
        icon: "Nature/Wind Gust",
        castTime: 1,
        castTimeType: "IMMEDIATE",
        tags: ["control", "debuff", "wind"]
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 1,
        durationUnit: "rounds"
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 1
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 60,
        aoeShape: "circle",
        aoeParameters: { radius: 15 },
        targetRestrictions: ["enemies"],
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: ["mana", "totemic_synergy"],
        resourceValues: {
          mana: 4,
          totemic_synergy: 3
        },
        actionPoints: 1
      },
      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          { id : "choking_silence_effect",
            name: "Silence",
            description: "Unable to speak or cast vocal spells."
          }
        ],
        durationValue: 1,
        durationType: "rounds",
        durationUnit: "rounds"
      },
      controlConfig: {
        controlType: "lockdown",
        strength: "moderate",
        duration: 1,
        durationUnit: "rounds",
        effects: [
          { id : "choking_slow",
            name: "Slowed",
            description: "Movement speed reduced by 15 feet.",
            config: {
              durationType: "rounds",
              recoveryMethod: "automatic",
              duration: 1,
              durationUnit: "rounds"
            }
          }
        ]
      },
      resolution: "AUTOMATIC",
      tags: ["control", "debuff", "wind"]
    },

    { id: "primalist_earthen_shield",
      name: "Calcified Rib-Plate",
      description: "Graft calcified spurs onto an ally, sacrificing 4 HP. Grants +4 Armor and physical resistance for 3 rounds. You cannot receive this ward.",
      level: 2,
      spellType: "ACTION",
      icon: "Nature/Earth Shield",
      effectTypes: ["buff"],
      typeConfig: {
        school: "nature",
        icon: "Nature/Earth Shield",
        castTime: 1,
        castTimeType: "IMMEDIATE",
        tags: ["buff", "protection", "earth"]
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds"
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 1
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 45,
        targetRestrictions: ["ally"],
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: ["mana", "totemic_synergy"],
        resourceValues: {
          mana: 5,
          totemic_synergy: 4
        },
        actionPoints: 1
      },
      buffConfig: {
        buffType: "damageMitigation",
        effects: [
          { id : "calcified_ribs_buff",
            name: "Rib-Plate Wards",
            description: "+4 Armor and resistance to physical attacks.",
            statModifier: {
              stat: "armor",
              magnitude: 4,
              magnitudeType: "flat"
            }
          }
        ],
        durationValue: 3,
        durationType: "rounds",
        durationUnit: "rounds",
        concentrationRequired: false,
        canBeDispelled: true
      },
      resolution: "AUTOMATIC",
      tags: ["buff", "protection", "earth"]
    },

    { id: "primalist_spirit_sight",
      name: "Soul-Dredge Vision",
      description: "Rip open your third eye, sacrificing 2 HP. Gain sight of spirits, invisible stalkers, and hidden traps within 60 feet for 3 rounds.",
      level: 2,
      spellType: "ACTION",
      icon: "Psychic/Mind Control",
      effectTypes: ["utility"],
      typeConfig: {
        school: "nature",
        icon: "Psychic/Mind Control",
        castTime: 1,
        castTimeType: "IMMEDIATE",
        tags: ["utility", "perception"]
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds"
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 2
      },
      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
        targetRestrictions: [],
        requiresLineOfSight: false
      },
      resourceCost: {
        resourceTypes: ["mana", "totemic_synergy"],
        resourceValues: {
          mana: 4,
          totemic_synergy: 2
        },
        actionPoints: 1
      },
      utilityConfig: {
        utilityType: "perception",
        selectedEffects: [
          { id : "soul_sight_active",
            name: "Soul Sight",
            description: "Can see invisible creatures and spiritual traces."
          }
        ],
        duration: 3,
        durationUnit: "rounds",
        concentration: false
      },
      resolution: "AUTOMATIC",
      tags: ["utility", "perception"]
    },

    // ===== LEVEL 3 SPELLS =====
    { id: "primalist_venomous_totem",
      name: "Sepulcher Rot Totem",
      description: "Erupt a totem of toxic ash, sacrificing 5 HP. Fires toxic spit dealing 1d8 nature and poison damage to all enemies within 30 feet for 4 rounds.",
      level: 3,
      spellType: "ACTION",
      icon: "Nature/Entangled",
      effectTypes: ["damage", "summoning"],
      typeConfig: {
        school: "nature",
        icon: "Nature/Entangled",
        castTime: 1,
        castTimeType: "IMMEDIATE",
        tags: ["damage", "totem", "poison"]
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 4,
        durationUnit: "rounds"
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 1
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
        targetRestrictions: ["any"],
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: ["mana", "totemic_synergy"],
        resourceValues: {
          mana: 5,
          totemic_synergy: 5
        },
        actionPoints: 1
      },
      damageConfig: {
        formula: "1d8",
        elementType: "nature",
        damageTypes: ["nature", "poison"],
        resolution: "DICE"
      },
      summoningConfig: {
        creatures: [
          { id : "sepulcher_totem_summon",
            name: "Sepulcher Totem",
            description: "A totem of charred ash weeping thick acid.",
            size: "Small",
            type: "construct",
            tokenIcon: "spell_nature_poisonsense",
            stats: {
              maxHp: 15,
              armor: 13,
              maxMana: 0
            },
            config: {
              quantity: 1,
              duration: 4,
              durationUnit: "rounds",
              hasDuration: true,
              concentration: false,
              controlType: "autonomous",
              controlRange: 30
            }
          }
        ]
      },
      resolution: "DICE",
      tags: ["damage", "totem", "poison"]
    },

    { id: "primalist_natures_grasp",
      name: "Bramble-Grip Lockdown",
      description: "Shoot thorny roots from your wrists, sacrificing 6 HP. The target is grappled, immobilized, and takes 1d6 piercing damage per round for 2 rounds.",
      level: 3,
      spellType: "ACTION",
      icon: "Nature/Entangled",
      effectTypes: ["control", "damage"],
      typeConfig: {
        school: "nature",
        icon: "Nature/Entangled",
        castTime: 1,
        castTimeType: "IMMEDIATE",
        tags: ["control", "damage", "nature"]
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 2,
        durationUnit: "rounds"
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 2
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 45,
        targetRestrictions: ["enemy"],
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: ["mana", "totemic_synergy"],
        resourceValues: {
          mana: 6,
          totemic_synergy: 6
        },
        actionPoints: 1
      },
      damageConfig: {
        formula: "1d6",
        elementType: "nature",
        damageTypes: ["piercing"],
        resolution: "DICE"
      },
      controlConfig: {
        controlType: "lockdown",
        strength: "major",
        duration: 2,
        durationUnit: "rounds",
        effects: [
          { id : "bramble_lockdown_grappled",
            name: "Grappled",
            description: "Immobilized by strangling roots.",
            config: {
              durationType: "rounds",
              recoveryMethod: "automatic",
              duration: 2,
              durationUnit: "rounds"
            }
          }
        ]
      },
      resolution: "DICE",
      tags: ["control", "damage", "nature"]
    },

    { id: "primalist_ancestral_bond",
      name: "Sanguine Ancestral Pact",
      description: "Gouge your palm, sacrificing 5 HP to bind your heart to an ally. Increases target's maximum HP by 20 and grants resistance to shadow damage for 3 rounds.",
      level: 3,
      spellType: "ACTION",
      icon: "Nature/Nature Primal",
      effectTypes: ["buff"],
      typeConfig: {
        school: "nature",
        icon: "Nature/Nature Primal",
        castTime: 1,
        castTimeType: "IMMEDIATE",
        tags: ["buff", "nature"]
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds"
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 1
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 45,
        targetRestrictions: ["ally"],
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: ["mana", "totemic_synergy"],
        resourceValues: {
          mana: 6,
          totemic_synergy: 5
        },
        actionPoints: 1
      },
      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          { id : "sanguine_ancestral_vigor",
            name: "Ancestral Vigor",
            description: "+20 Max HP and Shadow resistance.",
            statModifier: {
              stat: "maxHp",
              magnitude: 20,
              magnitudeType: "flat"
            }
          }
        ],
        durationValue: 3,
        durationType: "rounds",
        durationUnit: "rounds",
        concentrationRequired: false,
        canBeDispelled: true
      },
      resolution: "AUTOMATIC",
      tags: ["buff", "nature"]
    },

    // ===== LEVEL 4 SPELLS =====
    { id: "primalist_earthquake_strike",
      name: "Skull-Cracking Shockwave",
      description: "Stomp violently, sacrificing 4 HP. Deals 3d6 bludgeoning damage to a target and stuns them for 1 round. Constitution save DC 14.",
      level: 4,
      spellType: "ACTION",
      icon: "Nature/Earth Shatter",
      effectTypes: ["damage", "control"],
      typeConfig: {
        school: "nature",
        icon: "Nature/Earth Shatter",
        castTime: 1,
        castTimeType: "IMMEDIATE",
        tags: ["attack", "damage", "stun"]
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 1,
        durationUnit: "rounds"
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 2
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
        targetRestrictions: ["enemy"],
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: ["mana", "totemic_synergy"],
        resourceValues: {
          mana: 5,
          totemic_synergy: 4
        },
        actionPoints: 1
      },
      damageConfig: {
        formula: "3d6",
        elementType: "nature",
        damageTypes: ["bludgeoning"],
        savingThrow: {
          ability: "constitution",
          difficultyClass: 14,
          saveOutcome: "half_damage"
        },
        resolution: "DICE"
      },
      controlConfig: {
        controlType: "incapacitation",
        strength: "moderate",
        duration: 1,
        durationUnit: "rounds",
        effects: [
          { id : "skull_crack_stun",
            name: "Stunned",
            description: "Stunned by heavy shockwave.",
            config: {
              durationType: "rounds",
              recoveryMethod: "automatic",
              duration: 1,
              durationUnit: "rounds"
            }
          }
        ]
      },
      resolution: "DICE",
      tags: ["attack", "damage", "stun"]
    },

    { id: "primalist_spirit_wolves",
      name: "Wendigo Specters",
      description: "Erupt two starving wolves of bone and shadow from your torso, sacrificing 8 HP. The specters hunt targets and inflict bleeding. Lasts 5 rounds.",
      level: 4,
      spellType: "ACTION",
      icon: "Nature/Nature Primal",
      effectTypes: ["summoning"],
      typeConfig: {
        school: "nature",
        icon: "Nature/Nature Primal",
        castTime: 2,
        castTimeType: "IMMEDIATE",
        tags: ["summoning", "nature", "spirit"]
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 5,
        durationUnit: "rounds"
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 3
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 45,
        aoeShape: "circle",
        aoeParameters: { radius: 10 },
        targetRestrictions: [],
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: ["mana", "totemic_synergy"],
        resourceValues: {
          mana: 8,
          totemic_synergy: 8
        },
        actionPoints: 2
      },
      summoningConfig: {
        creatures: [
          { id : "wendigo_specter_summon",
            name: "Wendigo Specter",
            description: "A starved wolf of jagged bone and freezing fog.",
            size: "Medium",
            type: "beast",
            tokenIcon: "ability_druid_catform",
            stats: {
              maxHp: 20,
              armor: 12,
              maxMana: 0
            },
            config: {
              quantity: 2,
              duration: 5,
              durationUnit: "rounds",
              hasDuration: true,
              concentration: false,
              controlType: "mental",
              controlRange: 45
            }
          }
        ]
      },
      resolution: "AUTOMATIC",
      tags: ["summoning", "nature", "spirit"]
    },

    { id: "primalist_primal_fury",
      name: "Atavistic Bloodlust",
      description: "Surrender your mind, sacrificing 5 HP. Grants +2 to attack rolls and physical damage, but suffer -2 to Willpower saves for 3 rounds.",
      level: 4,
      spellType: "ACTION",
      icon: "General/Increase Strength",
      effectTypes: ["buff"],
      typeConfig: {
        school: "nature",
        icon: "General/Increase Strength",
        castTime: 1,
        castTimeType: "IMMEDIATE",
        tags: ["buff", "nature"]
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds"
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 2
      },
      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
        targetRestrictions: [],
        requiresLineOfSight: false
      },
      resourceCost: {
        resourceTypes: ["mana", "totemic_synergy"],
        resourceValues: {
          mana: 6,
          totemic_synergy: 5
        },
        actionPoints: 1
      },
      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          { id : "atavistic_rage_buff",
            name: "Atavistic Rage",
            description: "+2 to attack rolls and damage, -2 to Willpower.",
            statModifier: {
              stat: "melee_attack",
              magnitude: 2,
              magnitudeType: "flat"
            }
          }
        ],
        durationValue: 3,
        durationType: "rounds",
        durationUnit: "rounds",
        concentrationRequired: false,
        canBeDispelled: true
      },
      resolution: "AUTOMATIC",
      tags: ["buff", "nature"]
    },

    // ===== LEVEL 5 SPELLS =====
    { id: "primalist_thorn_barrier",
      name: "Rot-Thorn Wall",
      description: "Grow a massive barrier of toxic brambles, sacrificing 8 HP. Blocks line of sight and movement. Enemies passing through take 2d8 nature damage. Lasts 5 rounds.",
      level: 5,
      spellType: "ACTION",
      icon: "Nature/Entangled",
      effectTypes: ["utility"],
      typeConfig: {
        school: "nature",
        icon: "Nature/Entangled",
        castTime: 2,
        castTimeType: "IMMEDIATE",
        tags: ["utility", "barrier", "nature"]
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 5,
        durationUnit: "rounds"
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 3
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 60,
        aoeShape: "line",
        aoeParameters: { length: 30, width: 5 },
        targetRestrictions: [],
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: ["mana", "totemic_synergy"],
        resourceValues: {
          mana: 8,
          totemic_synergy: 8
        },
        actionPoints: 2
      },
      utilityConfig: {
        utilityType: "custom",
        selectedEffects: [
          { id : "thorn_wall_active_effect",
            name: "Rot-Thorns",
            description: "Impenetrable wall of wood and thorns that blocks visibility and burns flesh."
          }
        ],
        duration: 5,
        durationUnit: "rounds",
        concentration: false
      },
      resolution: "AUTOMATIC",
      tags: ["utility", "barrier", "nature"]
    },

    { id: "primalist_ancestral_guardian",
      name: "Great Annihilation Beast",
      description: "Summon the calcified skull of an extinct behemoth, sacrificing 10 HP. Attacks enemies, intercepts damage, and lasts 4 rounds.",
      level: 5,
      spellType: "ACTION",
      icon: "Nature/Earth Shield",
      effectTypes: ["summoning"],
      typeConfig: {
        school: "nature",
        icon: "Nature/Earth Shield",
        castTime: 2,
        castTimeType: "IMMEDIATE",
        tags: ["summoning", "nature", "guardian"]
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 4,
        durationUnit: "rounds"
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 4
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
        targetRestrictions: [],
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: ["mana", "totemic_synergy"],
        resourceValues: {
          mana: 10,
          totemic_synergy: 10
        },
        actionPoints: 2
      },
      summoningConfig: {
        creatures: [
          { id : "annihilation_beast_summon",
            name: "Annihilation Beast",
            description: "A huge, atavistic behemoth composed of skulls and dead birch.",
            size: "Huge",
            type: "beast",
            tokenIcon: "spell_nature_stoneclawtotem",
            stats: {
              maxHp: 60,
              armor: 15,
              maxMana: 0
            },
            config: {
              quantity: 1,
              duration: 4,
              durationUnit: "rounds",
              hasDuration: true,
              concentration: false,
              controlType: "mental",
              controlRange: 30
            }
          }
        ]
      },
      resolution: "AUTOMATIC",
      tags: ["summoning", "nature", "guardian"]
    },

    // ===== LEVEL 6 SPELLS =====
    { id: "primalist_elemental_fury_totem",
      name: "Cataclysmic Pyre Totem",
      description: "Raise a totem of volcanic slag, sacrificing 8 HP. Spits ash dealing 3d8 fire damage to all nearby enemies for 4 rounds. Beware Fire vulnerability.",
      level: 6,
      spellType: "ACTION",
      icon: "Fire/Eruption",
      effectTypes: ["damage", "summoning"],
      typeConfig: {
        school: "fire",
        icon: "Fire/Eruption",
        castTime: 1,
        castTimeType: "IMMEDIATE",
        tags: ["damage", "totem", "fire"]
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 4,
        durationUnit: "rounds"
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 2
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
        targetRestrictions: ["any"],
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: ["mana", "totemic_synergy"],
        resourceValues: {
          mana: 8,
          totemic_synergy: 8
        },
        actionPoints: 1
      },
      damageConfig: {
        formula: "3d8",
        elementType: "fire",
        damageTypes: ["fire"],
        resolution: "DICE"
      },
      summoningConfig: {
        creatures: [
          { id : "cataclysmic_pyre_summon",
            name: "Cataclysmic Pyre Totem",
            description: "A totem constructed of burning coal and dry skull shards.",
            size: "Small",
            type: "construct",
            tokenIcon: "spell_fire_selfdestruct",
            stats: {
              maxHp: 25,
              armor: 13,
              maxMana: 0
            },
            config: {
              quantity: 1,
              duration: 4,
              durationUnit: "rounds",
              hasDuration: true,
              concentration: false,
              controlType: "autonomous",
              controlRange: 30
            }
          }
        ]
      },
      resolution: "DICE",
      tags: ["damage", "totem", "fire"]
    },

    { id: "primalist_stone_skin",
      name: "Petrified Flesh",
      description: "Sacrifice 6 HP to coat your skin in thick, petrified clay. Grants resistance to all physical damage, but reduces movement speed by 10 feet for 3 rounds.",
      level: 6,
      spellType: "ACTION",
      icon: "Nature/Earth Shield",
      effectTypes: ["buff"],
      typeConfig: {
        school: "nature",
        icon: "Nature/Earth Shield",
        castTime: 1,
        castTimeType: "IMMEDIATE",
        tags: ["buff", "protection", "earth"]
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds"
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 3
      },
      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
        targetRestrictions: [],
        requiresLineOfSight: false
      },
      resourceCost: {
        resourceTypes: ["mana", "totemic_synergy"],
        resourceValues: {
          mana: 6,
          totemic_synergy: 6
        },
        actionPoints: 1
      },
      buffConfig: {
        buffType: "damageMitigation",
        effects: [
          { id : "petrified_hide_buff_active",
            name: "Petrified Hide",
            description: "Physical damage resistance, -10 ft speed.",
            statModifier: {
              stat: "movement_speed",
              magnitude: -10,
              magnitudeType: "flat"
            }
          }
        ],
        durationValue: 3,
        durationType: "rounds",
        durationUnit: "rounds",
        concentrationRequired: false,
        canBeDispelled: true
      },
      resolution: "AUTOMATIC",
      tags: ["buff", "protection", "earth"]
    },

    // ===== LEVEL 7 SPELLS =====
    { id: "primalist_meteor_storm",
      name: "Sky-Tear Avalanche",
      description: "Call down jagged shards of lightning-scarred stone. Deals 10d6 fire and bludgeoning damage to all creatures in a 40-foot radius. Agility save DC 16 for half.",
      level: 7,
      spellType: "ACTION",
      icon: "Fire/Eruption",
      effectTypes: ["damage"],
      typeConfig: {
        school: "fire",
        icon: "Fire/Eruption",
        castTime: 2,
        castTimeType: "IMMEDIATE",
        tags: ["attack", "damage", "aoe"]
      },
      durationConfig: {
        durationType: "instant",
        durationValue: 0,
        durationUnit: "instant"
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 4
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 120,
        aoeShape: "circle",
        aoeParameters: { radius: 40 },
        targetRestrictions: ["enemies"],
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: ["mana", "totemic_synergy"],
        resourceValues: {
          mana: 10,
          totemic_synergy: 10
        },
        actionPoints: 2
      },
      damageConfig: {
        formula: "10d6",
        elementType: "fire",
        damageTypes: ["fire", "bludgeoning"],
        savingThrow: {
          ability: "agility",
          difficultyClass: 16,
          saveOutcome: "half_damage"
        },
        resolution: "DICE"
      },
      resolution: "DICE",
      tags: ["attack", "damage", "aoe"]
    },

    { id: "primalist_natures_wrath",
      name: "Mother's Fury",
      description: "Spends 10 Totemic Synergy and 15 HP. Your melee attacks deal +2d8 additional nature damage and knock enemies back 10 feet for 4 rounds.",
      level: 7,
      spellType: "ACTION",
      icon: "Nature/Entangled",
      effectTypes: ["buff"],
      typeConfig: {
        school: "nature",
        icon: "Nature/Entangled",
        castTime: 1,
        castTimeType: "IMMEDIATE",
        tags: ["buff", "synergy", "nature"]
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 4,
        durationUnit: "rounds"
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 3
      },
      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
        targetRestrictions: [],
        requiresLineOfSight: false
      },
      resourceCost: {
        resourceTypes: ["mana", "totemic_synergy"],
        resourceValues: {
          mana: 8,
          totemic_synergy: 15,
          totemic_synergy: 10
        },
        actionPoints: 1
      },
      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          { id : "mothers_fury_buff_effect",
            name: "Earth-Mother Wrath",
            description: "+2d8 melee damage and 10 ft knockback.",
            statModifier: {
              stat: "melee_damage_nature",
              magnitude: 2,
              magnitudeType: "dice"
            }
          }
        ],
        durationValue: 4,
        durationType: "rounds",
        durationUnit: "rounds",
        concentrationRequired: false,
        canBeDispelled: false
      },
      resolution: "AUTOMATIC",
      tags: ["buff", "synergy", "nature"]
    },

    // ===== LEVEL 8 SPELLS =====
    { id: "primalist_primal_apocalypse",
      name: "The Great Annihilation",
      description: "Spends 18 Totemic Synergy and 20 HP. Decimate the field, causing the soil within 100 feet to become a toxic wasteland of rot. Enemies take 2d6 acid damage per round.",
      level: 8,
      spellType: "ACTION",
      icon: "Necrotic/Necrotic Wither",
      effectTypes: ["utility"],
      typeConfig: {
        school: "nature",
        icon: "Necrotic/Necrotic Wither",
        castTime: 3,
        castTimeType: "IMMEDIATE",
        tags: ["damage", "synergy", "ultimate"]
      },
      durationConfig: {
        durationType: "permanent",
        durationValue: 0,
        durationUnit: "permanent"
      },
      cooldownConfig: {
        cooldownType: "long_rest",
        cooldownValue: 1
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "sight",
        aoeShape: "circle",
        aoeParameters: { radius: 100 },
        targetRestrictions: ["enemies"],
        requiresLineOfSight: false
      },
      resourceCost: {
        resourceTypes: ["mana", "totemic_synergy"],
        resourceValues: {
          mana: 12,
          totemic_synergy: 20,
          totemic_synergy: 18
        },
        actionPoints: 3
      },
      utilityConfig: {
        utilityType: "custom",
        selectedEffects: [
          { id : "great_annihilation_ wasteland",
            name: "Decay Zone",
            description: "Continuous acid damage to all targets within 100 feet."
          }
        ],
        duration: 0,
        durationUnit: "permanent",
        concentration: false
      },
      resolution: "AUTOMATIC",
      tags: ["damage", "synergy", "ultimate"]
    },

    { id: "primalist_grand_totem_circle",
      name: "Black Totemic Chime",
      description: "Grow a circular wall of 4 Lesser Bone Totems in a 20-foot radius, sacrificing 15 HP. Totems block sight and speed. Lasts 5 rounds.",
      level: 8,
      spellType: "ACTION",
      icon: "Nature/Entangled",
      effectTypes: ["summoning"],
      typeConfig: {
        school: "nature",
        icon: "Nature/Entangled",
        castTime: 2,
        castTimeType: "IMMEDIATE",
        tags: ["summoning", "totem", "protection"]
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 5,
        durationUnit: "rounds"
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 4
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 45,
        aoeShape: "circle",
        aoeParameters: { radius: 20 },
        targetRestrictions: [],
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: ["mana", "totemic_synergy"],
        resourceValues: {
          mana: 12,
          totemic_synergy: 15
        },
        actionPoints: 3
      },
      summoningConfig: {
        creatures: [
          { id : "lesser_bone_totem_summon",
            name: "Lesser Bone Totem",
            description: "Splintered bone structures forming an enclosure.",
            size: "Medium",
            type: "construct",
            tokenIcon: "spell_nature_stoneclawtotem",
            stats: {
              maxHp: 15,
              armor: 12,
              maxMana: 0
            },
            config: {
              quantity: 4,
              duration: 5,
              durationUnit: "rounds",
              hasDuration: true,
              concentration: false,
              controlType: "autonomous",
              controlRange: 0
            }
          }
        ]
      },
      resolution: "AUTOMATIC",
      tags: ["summoning", "totem", "protection"]
    },

    // ===== LEVEL 9 SPELLS =====
    { id: "primalist_world_tree_avatar",
      name: "Heart-Tree Possession",
      description: "Sacrifice 20 HP to become possessed by the World Tree. Grow towering branches from your flesh, granting allies +4 to all rolls and massive regeneration. Lasts 5 rounds (concentration).",
      level: 9,
      spellType: "ACTION",
      icon: "Nature/Growth",
      effectTypes: ["buff", "transformation"],
      typeConfig: {
        school: "nature",
        icon: "Nature/Growth",
        castTime: 2,
        castTimeType: "IMMEDIATE",
        tags: ["buff", "transformation", "ultimate"]
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 5,
        durationUnit: "rounds"
      },
      cooldownConfig: {
        cooldownType: "long_rest",
        cooldownValue: 1
      },
      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
        targetRestrictions: [],
        requiresLineOfSight: false
      },
      resourceCost: {
        resourceTypes: ["mana", "totemic_synergy"],
        resourceValues: {
          mana: 14,
          totemic_synergy: 20
        },
        actionPoints: 2
      },
      transformationConfig: {
        transformationType: "nature",
        targetType: "self",
        duration: 5,
        durationUnit: "rounds",
        power: "major",
        newForm: "Heart-Tree Avatar",
        description: "You mutate into a towering structure of petrified wood and bone.",
        grantedAbilities: [
          { id : "heart_tree_regrowth",
            name: "Heart-Tree Regrowth",
            description: "Pulse 2d10 healing to all allies per round (excluding self)."
          }
        ]
      },
      buffConfig: {
        buffType: "custom",
        effects: [
          { id : "heart_tree_poss_buff_effect",
            name: "Avatar Strength",
            description: "+4 to all rolls and massive regeneration.",
            statModifier: {
              stat: "all_rolls",
              magnitude: 4,
              magnitudeType: "flat"
            }
          }
        ],
        durationValue: 5,
        durationType: "rounds",
        durationUnit: "rounds",
        concentrationRequired: true,
        canBeDispelled: false
      },
      resolution: "AUTOMATIC",
      tags: ["buff", "transformation", "ultimate"]
    },

    { id: "primalist_cataclysm",
      name: "Primal Ruin",
      description: "Sacrifice 15 HP to trigger a crushing earthquake. Deals 6d8 bludgeoning and nature damage to all enemies in a 60-foot radius. DC 16 Fortitude save for half.",
      level: 9,
      spellType: "ACTION",
      icon: "Nature/Earth Shatter",
      effectTypes: ["damage", "control"],
      typeConfig: {
        school: "nature",
        icon: "Nature/Earth Shatter",
        castTime: 2,
        castTimeType: "IMMEDIATE",
        tags: ["attack", "damage", "control"]
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 2,
        durationUnit: "rounds"
      },
      cooldownConfig: {
        cooldownType: "long_rest",
        cooldownValue: 1
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 80,
        aoeShape: "circle",
        aoeParameters: { radius: 60 },
        targetRestrictions: ["enemies"],
        requiresLineOfSight: false
      },
      resourceCost: {
        resourceTypes: ["mana", "totemic_synergy"],
        resourceValues: {
          mana: 12,
          totemic_synergy: 15
        },
        actionPoints: 2
      },
      damageConfig: {
        formula: "6d8",
        elementType: "nature",
        damageTypes: ["bludgeoning", "nature"],
        savingThrow: {
          ability: "fortitude",
          difficultyClass: 16,
          saveOutcome: "half_damage"
        },
        resolution: "DICE"
      },
      controlConfig: {
        controlType: "lockdown",
        strength: "major",
        duration: 2,
        durationUnit: "rounds",
        effects: [
          { id : "cataclysm_silence",
            name: "Silence",
            description: "Deafened and silenced by the roar of the earth."
          }
        ]
      },
      resolution: "DICE",
      tags: ["attack", "damage", "control"]
    },

    { id: "primalist_eternal_totem",
      name: "Unbreakable Bone-Shard Totem",
      description: "Spends 15 Totemic Synergy and 25 HP. Raise an indestructible totem of legendary bone. Allies gain +2 to all stats and regenerate HP. Lasts 10 rounds.",
      level: 9,
      spellType: "ACTION",
      icon: "Nature/Earth Shield",
      effectTypes: ["buff", "summoning"],
      typeConfig: {
        school: "nature",
        icon: "Nature/Earth Shield",
        tags: ["summoning", "buff", "totem", "legendary"],
        castTime: 3,
        castTimeType: "IMMEDIATE"
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 10,
        durationUnit: "rounds"
      },
      cooldownConfig: {
        cooldownType: "long_rest",
        cooldownValue: 1
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 60,
        aoeShape: "circle",
        aoeParameters: { radius: 50 },
        targetRestrictions: [],
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: ["mana", "totemic_synergy"],
        resourceValues: {
          mana: 15,
          totemic_synergy: 25,
          totemic_synergy: 15
        },
        actionPoints: 3
      },
      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          { id : "eternal_empowerment_active",
            name: "Eternal Empowerment",
            description: "Allies gain +2 to all stats and regenerate per round.",
            statModifier: {
              stat: "all_stats",
              magnitude: 2,
              magnitudeType: "flat"
            }
          }
        ],
        durationValue: 10,
        durationType: "rounds",
        durationUnit: "rounds",
        concentrationRequired: false,
        canBeDispelled: false
      },
      summoningConfig: {
        creatures: [
          { id : "unbreakable_totem_summon",
            name: "Unbreakable Totem",
            description: "An indestructible skull totem glowing with ancient power.",
            size: "Large",
            type: "construct",
            tokenIcon: "spell_nature_strengthofearth",
            stats: {
              maxHp: 500,
              armor: 25,
              maxMana: 0
            },
            config: {
              quantity: 1,
              duration: 10,
              durationUnit: "rounds",
              hasDuration: true,
              concentration: false,
              controlType: "autonomous",
              controlRange: 0
            }
          }
        ]
      },
      resolution: "AUTOMATIC",
      tags: ["summoning", "buff", "totem", "legendary"]
    },

    // ===== LEVEL 10 SPELLS =====
    { id: "primalist_primal_ascension",
      name: "Atavistic Singularity",
      description: "Achieve perfect harmony with nature by spending 20 Totemic Synergy. Your durations are doubled, you gain damage resistance while at least one totem is active, and you are immune to fear.",
      level: 10,
      spellType: "PASSIVE",
      icon: "Healing/Heart Ripple",
      effectTypes: ["buff", "transformation"],
      typeConfig: {
        school: "nature",
        icon: "Healing/Heart Ripple",
        tags: ["buff", "transformation", "passive", "legendary", "toggleable"],
        toggleable: true
      },
      durationConfig: {
        durationType: "permanent",
        durationValue: 0,
        durationUnit: "permanent"
      },
      transformationConfig: {
        transformationType: "elemental",
        targetType: "self",
        duration: 0,
        durationUnit: "permanent",
        power: "major",
        newForm: "Primal Ascendant",
        description: "Achieve perfect harmony with atavistic decay, enhancing totemic mastery.",
        grantedAbilities: [
          { id : "totem_link_active",
            name: "Totem Link",
            description: "Damage resistance while totems are active."
          }
        ]
      },
      buffConfig: {
        buffType: "custom",
        effects: [
          { id : "primal_ascension_active_buff",
            name: "Primal Ascension",
            description: "Enhanced totem durations and immunity to fear.",
            customDescription: "You have achieved primal ascension. Damage resistance while totems are active, and durations doubled."
          }
        ],
        durationValue: 0,
        durationType: "permanent",
        durationUnit: "permanent",
        concentrationRequired: false,
        canBeDispelled: false
      },
      targetingConfig: {
        targetingType: "self"
      },
      resourceCost: {
        resourceTypes: ["totemic_synergy"],
        resourceValues: {
          totemic_synergy: 20
        },
        actionPoints: 0
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 0
      },
      resolution: "AUTOMATIC",
      tags: ["buff", "transformation", "passive", "legendary", "toggleable"]
    },

    { id: "primalist_gaia_wrath",
      name: "Soil-Drowned Oblivion",
      description: "Spends 20 Synergy and 20 HP. Obliterate all enemies on the battlefield with bludgeoning nature damage. Constitution save DC 20 for half.",
      level: 10,
      spellType: "ACTION",
      icon: "Nature/Entangled",
      effectTypes: ["damage"],
      typeConfig: {
        school: "nature",
        icon: "Nature/Entangled",
        tags: ["attack", "damage", "aoe", "legendary"],
        castTime: 3,
        castTimeType: "IMMEDIATE"
      },
      durationConfig: {
        durationType: "instant",
        durationValue: 0,
        durationUnit: "instant"
      },
      cooldownConfig: {
        cooldownType: "long_rest",
        cooldownValue: 1
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "sight",
        aoeShape: "circle",
        aoeParameters: { radius: 150 },
        targetRestrictions: ["enemy"],
        requiresLineOfSight: false
      },
      resourceCost: {
        resourceTypes: ["mana", "totemic_synergy"],
        resourceValues: {
          mana: 18,
          totemic_synergy: 20,
          totemic_synergy: 20
        },
        actionPoints: 3
      },
      damageConfig: {
        formula: "22d6 + spirit",
        elementType: "nature",
        damageTypes: ["nature", "bludgeoning"],
        savingThrow: {
          ability: "constitution",
          difficultyClass: 20,
          saveOutcome: "half_damage"
        },
        resolution: "DICE"
      },
      resolution: "DICE",
      tags: ["attack", "damage", "aoe", "legendary"]
    },

    { id: "primalist_genesis",
      name: "Forest-Sprouting Gore",
      description: "Spends 18 Synergy and 30 HP. Erupt an army of Treants, Earth Elementals, and Primal Beasts from your flesh. Lasts 10 rounds.",
      level: 10,
      spellType: "ACTION",
      icon: "Nature/Growth",
      effectTypes: ["summoning"],
      typeConfig: {
        school: "nature",
        icon: "Nature/Growth",
        tags: ["summoning", "nature", "legendary"],
        castTime: 3,
        castTimeType: "IMMEDIATE"
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 10,
        durationUnit: "rounds"
      },
      cooldownConfig: {
        cooldownType: "long_rest",
        cooldownValue: 1
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 80,
        aoeShape: "circle",
        aoeParameters: { radius: 40 },
        targetRestrictions: [],
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: ["mana", "totemic_synergy"],
        resourceValues: {
          mana: 20,
          totemic_synergy: 30,
          totemic_synergy: 18
        },
        actionPoints: 3
      },
      summoningConfig: {
        creatures: [
          { id : "nature_army_treants_active",
            name: "Treant",
            description: "A colossal moving deadwood tree.",
            size: "Huge",
            type: "plant",
            tokenIcon: "ability_druid_treeoflife",
            stats: { maxHp: 100, armor: 18, maxMana: 0 },
            config: {
              quantity: 1,
              duration: 10,
              durationUnit: "rounds",
              hasDuration: true,
              concentration: false,
              controlType: "mental",
              controlRange: 120
            }
          },
          { id : "nature_army_elementals_active",
            name: "Earth Elemental",
            description: "A crushing walking shard of the bedrock.",
            size: "Large",
            type: "elemental",
            tokenIcon: "spell_nature_strength",
            stats: { maxHp: 80, armor: 16, maxMana: 0 },
            config: {
              quantity: 2,
              duration: 10,
              durationUnit: "rounds",
              hasDuration: true,
              concentration: false,
              controlType: "mental",
              controlRange: 120
            }
          },
          { id : "nature_army_beasts_active",
            name: "Primal Beast",
            description: "A terrifying predator wreathed in antlers.",
            size: "Large",
            type: "beast",
            tokenIcon: "ability_druid_catform",
            stats: { maxHp: 60, armor: 14, maxMana: 0 },
            config: {
              quantity: 4,
              duration: 10,
              durationUnit: "rounds",
              hasDuration: true,
              concentration: false,
              controlType: "mental",
              controlRange: 120
            }
          }
        ]
      },
      resolution: "DICE",
      tags: ["summoning", "nature", "legendary"]
    },

    // ===== PASSIVE ABILITIES =====
    { id: "primalist_spirit_channel",
      name: "Spirit Channel",
      description: "One-way conduit: pour life force into totems but cannot receive their healing. Never affected by your own totem healing. Other totem effects (armor, damage, speed) apply normally.",
      level: 1,
      spellType: "PASSIVE",
      icon: "Nature/Nature Primal",
      effectTypes: ["passive"],
      typeConfig: {
        school: "nature",
        icon: "Nature/Nature Primal",
        tags: ["passive", "primalist", "restriction"]
      },
      durationConfig: {
        durationType: "permanent",
        durationValue: 0,
        durationUnit: "permanent"
      },
      targetingConfig: { targetingType: "self" },
      resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 0 },
      resolution: "AUTOMATIC",
      tags: ["passive", "primalist", "restriction"]
    },

    { id: "primalist_totem_bond",
      name: "Totem Bond",
      description: "With 0 active totems, spell damage is reduced by 2 and mana costs increase by 2. Penalty removed when you place your first totem.",
      level: 1,
      spellType: "PASSIVE",
      icon: "Necrotic/Necrotic Wither",
      effectTypes: ["passive"],
      typeConfig: {
        school: "nature",
        icon: "Necrotic/Necrotic Wither",
        tags: ["passive", "primalist", "weakness"]
      },
      durationConfig: {
        durationType: "permanent",
        durationValue: 0,
        durationUnit: "permanent"
      },
      targetingConfig: { targetingType: "self" },
      resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 0 },
      resolution: "AUTOMATIC",
      tags: ["passive", "primalist", "weakness"]
    },

    { id: "primalist_shattered_conduit",
      name: "Shattered Conduit",
      description: "When a totem is destroyed by enemy action, take 1d6 psychic damage and lose 3 Totemic Synergy (min 0). Natural expiration or voluntary dismissal does not trigger this.",
      level: 3,
      spellType: "PASSIVE",
      icon: "Nature/Thorny Entanglement",
      effectTypes: ["passive"],
      typeConfig: {
        school: "nature",
        icon: "Nature/Thorny Entanglement",
        tags: ["passive", "primalist", "weakness"]
      },
      durationConfig: {
        durationType: "permanent",
        durationValue: 0,
        durationUnit: "permanent"
      },
      targetingConfig: { targetingType: "self" },
      resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 0 },
      resolution: "AUTOMATIC",
      tags: ["passive", "primalist", "weakness"]
    }
  ],

  // ==========================================
  // 6. SPELL POOLS MAPPING
  // ==========================================
  spellPools: {
    1: [
      "primalist_earth_bolt",
      "primalist_basic_healing_totem",
      "primalist_natures_blessing",
      "primalist_spirit_channel",
      "primalist_totem_bond"
    ],
    2: [
      "primalist_storm_gale",
      "primalist_earthen_shield",
      "primalist_spirit_sight"
    ],
    3: [
      "primalist_venomous_totem",
      "primalist_natures_grasp",
      "primalist_ancestral_bond",
      "primalist_shattered_conduit"
    ],
    4: [
      "primalist_earthquake_strike",
      "primalist_spirit_wolves",
      "primalist_primal_fury"
    ],
    5: ["primalist_thorn_barrier", "primalist_ancestral_guardian"],
    6: ["primalist_elemental_fury_totem", "primalist_stone_skin"],
    7: ["primalist_meteor_storm", "primalist_natures_wrath"],
    8: ["primalist_primal_apocalypse", "primalist_grand_totem_circle"],
    9: [
      "primalist_world_tree_avatar",
      "primalist_cataclysm",
      "primalist_eternal_totem"
    ],
    10: [
      "primalist_primal_ascension",
      "primalist_gaia_wrath",
      "primalist_genesis"
    ]
  }
};
