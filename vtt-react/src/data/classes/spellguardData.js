/**
 * Spellguard Class Data
 *
 * "Flesh stitched to radioactive metal. We are the tombs of their gods."
 *
 * Complete class information for the Spellguard - the Void-Scarred Aegis.
 * A catastrophic magical sponge that absorbs volatile enemy spells into their own 
 * mutilated flesh, suffering severe internal radiation to protect allies before
 * detonating that stored energy back at the caster.
 *
 * ⚠️ EXCLUSIVE DOMAIN: The Spellguard is the only class that can physically intercept
 * magical attacks meant for allies and store the raw leyline energy inside their own body.
 */

export const SPELLGUARD_DATA = {
  id : "spellguard",
  name: "Spellguard",
  icon: "fas fa-shield-alt",
  role: "Void-Scarred Aegis",
  damageTypes: ["arcane", "force", "necrotic"],

  spellPools: {
    1: ["void-siphon", "entropic-aegis", "leyline-rift", "refract-kinetic"],
  },

  overview: {
    title: "The Spellguard",
    subtitle: "The Void-Scarred Aegis",

    quickOverview: {
      title: "Visceral Overview",
      content: `**The Spellguard is the Void-Scarred Aegis.** They are not a shining magic knight. Their flesh is a blistered tomb, and their specialized armor is permanently scarred by the radioactive fallout of absorbed magic. They stand between their party and the apocalypse, dragging raw leylines into their own lungs to save those behind them.

**Why Bring Me?**: You are the ultimate magical sponge and reflector. You possess the exclusive, terrifying utility to physically intercept lethal magical attacks meant for your allies, draw the raw spell-energy into your own body, and violently detonate it back at the enemy.

**The Fatal Flaw**: **Arcane Radiation & Kinetic Fragility**. Magic is a radioactive poison. Holding unspent Void Resonance burns you from the inside out, melting your maximum HP and causing internal necrotic damage every round you fail to purge it. Furthermore, your hyper-specialized refraction plate leaves you catastrophically vulnerable to raw, heavy kinetic trauma. A single swing of a mundane executioner's axe can shatter your brittle shell (+50% vulnerability to Bludgeoning and Slashing damage).

**Core Loop**: Intercept magical damage → Absorb it into the flesh as volatile Void Resonance → Suffer Arcane Radiation → Violently purge the radiation through devastating explosions and reflections.`,
    },

    description: `A tragic, heavily-armored sponge for magical catastrophe. The Spellguard absorbs spells meant for their allies, converting the hostile magic into a highly unstable internal resource called Void Resonance, before vomiting it back as raw force.`,

    roleplayIdentity: {
      title: "Lore & Roleplay Identity",
      content: `To be a Spellguard is to accept that you are already dead. You have surgically grafted void-glass and refraction plating directly into your spine and ribcage, creating a body designed to metabolize explosions. You are a walking fallout zone. The magic you absorb doesn't just bounce off—it enters your bloodstream, boils your internal organs, and sings in your teeth.

**The Aegis Philosophy**: The blast must be contained. The flesh is temporary; the line must hold. We do not block magic. We eat it.

**Common Archetypes**:
- **The Living Tomb**: A silent guardian whose vocal cords were burned away by a dragon's breath they swallowed to save a village.
- **The Radioactive Martyr**: A fanatic who actively hunts magical anomalies, seeking to consume them before they harm the innocent, bleeding black ash.
- **The Hollowed Refractor**: An ancient soldier whose internal organs have been entirely replaced by pulsing, unstable void crystals.`,

      examples: [
        "A former paladin who realized faith couldn't stop a meteor, so they replaced their heart with a void-engine.",
        "An arcane experiment gone wrong, now serving as a mercenary who eats curses for coin.",
        "A tragic sibling who absorbed a lethal petrification spell meant for their brother, now slowly turning to crystal.",
      ],
    },

    combatRole: {
      title: "Combat Role",
      content: `**Primary Role**: Magical Tank / Volatile Reflector
      
**Strengths**:
- **Absolute Magical Domination**: Feasts on enemy spellcasters, converting their greatest attacks into your ammunition.
- **Ally Interception**: The only class that can leap into the path of targeted spells to save fragile teammates.
- **Cataclysmic Purges**: Can release massive AoE force detonations when their radiation reaches critical mass.

**Weaknesses**:
- **Kinetic Fragility**: Catastrophically weak to mundane physical trauma. A simple beast or a bandit with a warhammer will crush your brittle armor (+50% Bludgeoning/Slashing vulnerability).
- **Internal Meltdown**: If you absorb magic and fail to purge it, the Arcane Radiation will permanently reduce your maximum HP and deal continuous necrotic damage.
- **Reliance on Enemy Magic**: If the enemy does not cast spells, you must resort to self-mutilating abilities to generate your resonance.`,

      keyMechanics: [
        "Void Resonance (0-100 AEP): Volatile energy generated by absorbing magic.",
        "Arcane Radiation: Unspent Resonance inflicts continuous internal necrotic damage.",
        "Magical Interception: Reactions to physically step in front of spells targeting allies.",
        "Violent Purge: Actions that detonate stored resonance to clear the self-burn.",
      ],
    },

    playstyle: {
      title: "Playstyle & Strategy",
      content: `Playing a Spellguard is a terrifying balancing act of absorption and purging. You want to be hit by magic, but holding the magic is actively killing you.

**Core Strategy**:
1. **The Intercept**: Position yourself near squishy allies. When an enemy casts, use your Reactions to step into the blast radius and absorb the blow.
2. **The Siphon**: If the enemy refuses to cast, use *Void Siphon* to physically rip the mana out of their bodies, generating your own Resonance.
3. **The Meltdown Management**: You CANNOT hold Resonance. If you end your turn with high Resonance, the radiation will melt your HP. 
4. **The Purge**: Immediately spend your Resonance on *Entropic Aegis* or *Arcane Detonation* to expel the radiation back into the enemy ranks.
5. **Hide from Steel**: Pray your allies intercept the enemy berserkers. If a warhammer hits you, your void-glass ribs will shatter.`,

      tips: [
        "Never end your turn at maximum Void Resonance unless you are prepared to sacrifice your maximum HP.",
        "Your Refract Kinetic ability can save you from a physical ambush, but the necrotic strain is severe.",
        "Use your body as a shield. You are built to die so they can live.",
      ],
    },

    immersiveCombatExample: {
      title: "Combat Example: The Meltdown",
      content: `**The Setup**: A Coven pyromancer unleashes a searing inferno aimed directly at your party's fragile Fate Weaver. 

**Turn 1 — The Interception**
The pyromancer's hands ignite. You trigger your Reaction: *Agonizing Intercept*. You step directly in front of the Fate Weaver as the inferno hits. The fire does not burn you—it is inhaled into your chest cavity. You take no fire damage, but you instantly generate 40 **Void Resonance**.

**Turn 1 (End) — The Radiation**
You end your turn holding 40 Resonance. The **Arcane Radiation** triggers. Black veins pulse on your neck. You suffer 4 necrotic damage, and your maximum HP is permanently reduced by 4 until you take a long rest. The magic is eating you alive.

**Turn 2 — The Purge**
The pain is unbearable. You step forward, grabbing the pyromancer by the throat. You cast *Violent Purge*, expelling all 40 Void Resonance directly into their chest. A shockwave of pure force shatters the pyromancer's ribs, dealing massive force damage. Your Resonance drops to 0. The burning in your veins stops. You survived the meltdown—for now.`,
    },
  },

  // Resource System
  resourceSystem: {
    title: "Void Resonance & Arcane Radiation",
    subtitle: "The Anatomy of a Meltdown",

    description: `You are a living void-battery. Incoming magical damage does not harm your exterior—it is pulled inside you, converting into **Void Resonance** (tracked as AEP). However, this energy is highly radioactive.

**The Resource Mechanics**:
- **Void Resonance (AEP 0-100)**: Generated by absorbing spells, intercepting magic, or ripping mana from targets using *Void Siphon*. 
- **Arcane Radiation**: If you end your round with unspent Void Resonance, you suffer internal burns. You take necrotic damage equal to (Resonance / 10), rounded down. Your maximum HP is reduced by this same amount until you complete a long rest.
- **Physical Fragility**: Your body is a specialized magical sponge. You suffer a permanent +50% vulnerability to all Bludgeoning and Slashing damage.`,

    cards: [
      {
        title: "Void Resonance (AEP)",
        stats: "0-100 Capacity",
        details:
         "The volatile fuel. Generates when you absorb magic or siphon mana. Used to power your devastating purges and shields.",
      },
      {
        title: "Arcane Radiation",
        stats: "End of Round Strain",
        details:
         "Unspent Resonance / 10 = Necrotic Damage and Max HP Reduction. You must continuously purge the energy to survive.",
      },
      {
        title: "Physical Fragility",
        stats: "+50% Vulnerability",
        details:
         "Catastrophically weak to Bludgeoning and Slashing. Kinetic trauma shatters your void-glass bones.",
      },
    ],

    generationTable: {
      headers: ["Action", "Resonance Change", "The Toll"],
      rows: [
        ["Absorb Magical Damage", "+1 per damage", "Energy fills your lungs"],
        ["Void Siphon (Melee)", "+15 Resonance", "Ripping magic from their blood"],
        ["Agonizing Intercept", "Absorb Ally's Damage", "Internal temperature spikes"],
        ["Violent Purge", "-All Resonance", "Radiation clears, flesh cools"],
      ],
    },

    usage: {
      momentum:
        "Absorb enemy spells to fill your Resonance, but immediately look for a way to purge it. Do not let the radiation fester in your body.",
      flourish:
        "When ambushed by physical attackers, use 'Refract Kinetic' to harden your shell, even though it spikes your internal necrotic strain.",
    },

    overheatRules: {
      title: "Critical Meltdown (100 Resonance)",
      content: `If you reach exactly 100 Void Resonance, your containment fails completely.
1. **The Rupture**: You instantly explode, dealing 10d6 force damage to ALL creatures within 30 feet (including allies).
2. **The Burnout**: You are reduced to 1 HP, your maximum HP is halved, and you are incapacitated for 1 round.
3. **The Reset**: Your Resonance resets to 0. You must never let the reactor breach.`,
    },

    strategicConsiderations: {
      title: "The Kinetic Death Sentence",
      content: `Do not try to tank physical monsters. A giant with a club is your hard counter. If a creature deals heavy bludgeoning or slashing damage, you will melt instantly due to your +50% vulnerability. Fall back and let the Dreadnaught or Berserker handle the meat—you are here for the magic.`,
    },

    playingInPerson: {
      title: "Physical Radiation Trackers",
      subtitle: "The Glowing Cores",
      content: `Use the following physical props to track the agony:
- **Resonance Dial**: A d100 (tens and ones die) to track your current Void Resonance.
- **Black Tokens**: Place a black token on your character sheet every time your max HP drops from Arcane Radiation.
- **The Meltdown Warning**: If your dial crosses 80, stand your miniature up on a red base to warn the party of an imminent explosion.`,
    },
  },

  specializations: {
    title: "Radiation Protocols",
    subtitle: "Three Methods of Containing the Apocalypse",

    description: `Spellguards must choose how their body processes the lethal radiation of Void Resonance.`,

    sharedPassive: {
      name: "Brittle Kinetic Shell",
      icon: "Slashing/Crushing Blow",
      description:
        "Your void-glass plating repels magic but shatters under physical trauma. You have +50% vulnerability to all Bludgeoning and Slashing damage.",
    },

    specs: [
      { id : "arcane_warden",
        name: "Void-Scarred Bastion",
        icon: "Force/Force Field",
        color: "#1E3A8A",
        theme: "Maximum Containment",

        description: `**The flesh is a vault. Lock the radiation inside.**
        
Bastions focus entirely on intercepting damage meant for their allies, converting their own body into a localized black hole for enemy magic. They generate Resonance faster and endure the radiation longer.`,

        playstyle:
          "Heavy ally protection, spell interception, delayed detonation",

        strengths: [
          "Generates 1.5x Resonance from absorbed magic",
          "Can intercept spells from greater distances",
          "Radiation damage is delayed by 1 round",
        ],

        weaknesses: [
          "Lowest personal damage output",
          "Incredibly reliant on healers to fix radiation burns",
          "When they finally purge, it hits allies too",
        ],

        passiveAbility: {
          name: "Lead-Lined Ribcage",
          icon: "Force/Force Field",
          description:
            "You generate 1.5x Resonance from absorbed magical damage. The necrotic damage from Arcane Radiation is halved, though the max HP reduction remains full.",
        },

        keyAbilities: [
          "Gravity Well — Pull all magical projectiles in a 40ft radius into your own chest.",
          "Stasis Lock — Freeze your own blood to temporarily ignore Arcane Radiation.",
        ],

        recommendedFor:
          "Players who want to play the ultimate sacrificial protector, literally jumping on magical grenades.",
      },

      { id : "spell_breaker",
        name: "Entropic Eraser",
        icon: "Arcane/Magical Cross Emblem 2",
        color: "#4C1D95",
        theme: "Violent Refraction",

        description: `**Do not hold the poison. Vomit it back.**
        
Erasers specialize in bouncing magic back before it can fully settle in their lungs. They focus on precise reflections, treating enemy casters like mirrors.`,

        playstyle:
          "High-risk reflections, anti-mage dueling, rapid purging",

        strengths: [
          "Reflected spells deal 125% damage",
          "Can counterspell with pure force",
          "Excellent at shutting down single high-value targets",
        ],

        weaknesses: [
          "Struggles against AoE magic",
          "Requires perfect reaction timing",
          "Highly susceptible to physical ambushes while reflecting",
        ],

        passiveAbility: {
          name: "Shattered Mirror Plating",
          icon: "Arcane/Magical Cross Emblem 2",
          description:
            "Successfully reflecting a spell immediately purges 20 Void Resonance and restores 1d8 HP.",
        },

        keyAbilities: [
          "Agonizing Refraction — Reflect a spell, but the physical strain causes your eyes to bleed.",
          "Mirror's Edge — Shatter your void-armor to unleash a flurry of reflective shards.",
        ],

        recommendedFor:
          "Players who want to punish enemy casters by turning their own apocalyptic spells against them.",
      },

      { id : "mana_reaver",
        name: "Leyline Devourer",
        icon: "Necrotic/Drain Soul",
        color: "#581C87",
        theme: "Vampiric Starvation",

        description: `**If they will not cast, we will rip it from their veins.**
        
Devourers do not wait to be hit. They aggressively charge enemy casters, physically tearing the mana from their bodies and converting it into devastating localized explosions.`,

        playstyle:
          "Aggressive melee anti-mage, mana starvation, constant purging",

        strengths: [
          "Drains 2x mana on all melee attacks",
          "Does not need enemy spells to generate Resonance",
          "Incredible single-target lockdown",
        ],

        weaknesses: [
          "Must remain in melee range, exposing them to physical attacks",
          "Self-inflicts heavy necrotic damage to fuel attacks",
          "Zero long-range presence",
        ],

        passiveAbility: {
          name: "Starving Void",
          icon: "Necrotic/Drain Soul",
          description:
            "Your melee attacks drain 2d4 mana instead of 1d4. If a target has 0 mana, you instead drain their maximum HP.",
        },

        keyAbilities: [
          "Sunder Leyline — A devastating strike that cripples the target's ability to cast spells.",
          "Black Hole Collapse — Consume the mana of everyone in the room, creating a singularity.",
        ],

        recommendedFor:
          "Players who want to aggressively hunt and execute enemy spellcasters before they can even chant a spell.",
      },
    ],
  },

  // ========================================
  // SPELLGUARD SPELLS
  // ========================================
  exampleSpells: [
    // ========================================
    // PASSIVES (LEVEL 1)
    // ========================================
    { id : "spellguard_arcane_radiation",
      name: "Arcane Radiation",
      description:
        "The magic you absorb is radioactive poison. At the end of your round, if you hold unspent Void Resonance, you take necrotic damage equal to (Resonance / 10), rounded down. Your maximum HP is permanently reduced by this same amount until you complete a long rest.",
      level: 1,
      spellType: "PASSIVE",
      icon: "Necrotic/Necrotic Decay 1",
      effectTypes: ["passive"],
      typeConfig: {
        school: "necrotic",
        icon: "Necrotic/Necrotic Decay 1",
        tags: ["passive", "weakness", "radiation"],
      },
      targetingConfig: { targetingType: "self" },
      resourceCost: { actionPoints: 0, mana: 0 },
      resolution: "AUTOMATIC",
      tags: ["passive", "spellguard", "weakness"],
    },
    { id : "spellguard_kinetic_fragility",
      name: "Brittle Kinetic Shell",
      description:
        "Your void-glass plating and flesh are hyper-specialized to absorb energy, rendering you catastrophically vulnerable to physical trauma. You suffer a permanent +50% vulnerability to all Bludgeoning and Slashing damage.",
      level: 1,
      spellType: "PASSIVE",
      icon: "Slashing/Crushing Blow",
      effectTypes: ["passive"],
      typeConfig: {
        school: "physical",
        icon: "Slashing/Crushing Blow",
        tags: ["passive", "weakness", "vulnerability"],
      },
      targetingConfig: { targetingType: "self" },
      resourceCost: { actionPoints: 0, mana: 0 },
      resolution: "AUTOMATIC",
      tags: ["passive", "spellguard", "weakness"],
    },

    // ========================================
    // LEVEL 1 SPELLS
    // ========================================
    { id : "sg_void_siphon",
      name: "Void Siphon",
      description:
        "A brutal melee strike that physically rips raw magic out of the target. Deals 1d8 bludgeoning and 1d8 force damage. If the target is a spellcaster, they lose 2d4 mana. Generates +15 Void Resonance as the raw magic enters your bloodstream.",
      level: 1,
      spellType: "ACTION",
      icon: "Necrotic/Drain Soul",
      effectTypes: ["damage", "utility"],

      typeConfig: {
        school: "force",
        icon: "Necrotic/Drain Soul",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "melee",
        rangeDistance: 5,
        targetRestrictions: ["enemies"],
      },

      resourceCost: {
        actionPoints: 1,
        mana: 4,
        classResource: {
          type: "arcane_energy_points",
          cost: -15, 
        },
        components: ["somatic"],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },

      resolution: "DICE",

      damageConfig: {
        formula: "1d8 + 1d8",
        damageTypes: ["bludgeoning", "force"],
        resolution: "DICE",
      },

      utilityConfig: {
        utilityType: "resource_drain",
        selectedEffects: [
          { id : "mana_tear",
            name: "Mana Tear",
            description: "Target loses 2d4 mana. You generate 15 Void Resonance.",
          },
        ],
      },

      tags: ["melee", "drain", "resonance generation", "spellguard"],
    },

    { id : "sg_entropic_aegis",
      name: "Entropic Aegis",
      description:
        "Shards of volatile void crystal erupt from your skin, forming a barrier that absorbs 4d8 damage for 1 minute. Every time the shield absorbs damage, it generates 2 Void Resonance as the magic leaks into you. If shattered by a kinetic attack, it detonates inwardly, dealing 2d6 slashing damage to you.",
      level: 1,
      spellType: "ACTION",
      icon: "Force/Force Field",
      effectTypes: ["buff"],

      typeConfig: {
        school: "force",
        icon: "Force/Force Field",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },

      resourceCost: {
        actionPoints: 1,
        mana: 4,
        classResource: {
          type: "arcane_energy_points",
          cost: 10,
        },
        components: ["verbal", "somatic"],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },

      resolution: "AUTOMATIC",

      buffConfig: {
        buffType: "damageMitigation",
        effects: [
          { id : "void_barrier",
            name: "Void Barrier",
            description:
              "Absorbs 4d8 damage. Generates 2 Resonance per hit absorbed. Self-inflicts 2d6 slashing if broken by physical attacks.",
            mechanicsText: "Absorb 4d8",
          },
        ],
        durationValue: 1,
        durationType: "minutes",
        durationUnit: "minutes",
      },

      tags: ["shield", "defense", "spellguard"],
    },

    { id : "sg_refract_kinetic",
      name: "Refract Kinetic",
      description:
        "A desperate survival technique. You harden your physical shell by channeling radiation into your bones. For 1 round, your +50% physical vulnerability is suppressed, and you gain +2 Armor. However, the internal friction deals 1d4 necrotic damage to you instantly.",
      level: 1,
      spellType: "ACTION",
      icon: "Slashing/Crushing Blow",
      effectTypes: ["buff", "damage"],

      typeConfig: {
        school: "necrotic",
        icon: "Slashing/Crushing Blow",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },

      resourceCost: {
        actionPoints: 1,
        mana: 6,
        classResource: {
          type: "arcane_energy_points",
          cost: 10,
        },
        components: ["somatic"],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },

      resolution: "AUTOMATIC",

      buffConfig: {
        buffType: "statModifier",
        effects: [
          { id : "kinetic_hardening",
            name: "Kinetic Hardening",
            description: "Suppresses physical vulnerability and grants +2 Armor.",
            mechanicsText: "+2 Armor",
            statModifier: {
              stat: "armor",
              magnitude: 2,
              magnitudeType: "flat",
            },
          },
        ],
        durationValue: 1,
        durationType: "rounds",
        durationUnit: "rounds",
      },
      
      damageConfig: {
        formula: "1d4",
        damageTypes: ["necrotic"],
        resolution: "AUTOMATIC",
      },

      tags: ["defense", "survival", "self damage", "spellguard"],
    },

    { id : "sg_leyline_rift",
      name: "Leyline Rift",
      description:
        "Tear through the spatial leylines to instantly teleport up to 30 feet to an enemy caster. The violent transition generates +10 Void Resonance, but the friction rips your flesh, dealing 1d6 necrotic damage to yourself.",
      level: 1,
      spellType: "ACTION",
      icon: "Force/Explosion Burst",
      effectTypes: ["utility", "damage"],

      typeConfig: {
        school: "arcane",
        icon: "Force/Explosion Burst",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
        targetRestrictions: ["enemies"],
      },

      resourceCost: {
        actionPoints: 1,
        mana: 4,
        classResource: {
          type: "arcane_energy_points",
          cost: -10,
        },
        components: ["verbal"],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },

      resolution: "AUTOMATIC",

      utilityConfig: {
        utilityType: "movement",
        selectedEffects: [
          { id : "spatial_tear",
            name: "Spatial Tear",
            description: "Teleport adjacent to target enemy.",
          },
        ],
      },
      
      damageConfig: {
        formula: "1d6",
        damageTypes: ["necrotic"],
        resolution: "AUTOMATIC",
      },

      tags: ["mobility", "teleport", "self damage", "spellguard"],
    },

    // ========================================
    // LEVEL 2 SPELLS
    // ========================================
    { id : "sg_agonizing_intercept",
      name: "Agonizing Intercept",
      description:
        "When an ally within 15 feet is targeted by a spell, you instantly leap into its path, becoming the new target. The magical impact is fully absorbed into your body, generating Void Resonance equal to the damage it would have dealt. The horrific strain causes your eyes to bleed, blinding you until the end of your next turn.",
      level: 2,
      spellType: "REACTION",
      icon: "Force/Force Field",
      effectTypes: ["utility", "debuff"],

      typeConfig: {
        school: "force",
        icon: "Force/Force Field",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 15,
        targetRestrictions: ["allies"],
      },

      resourceCost: {
        actionPoints: 1,
        mana: 6,
        classResource: {
          type: "arcane_energy_points",
          cost: 0,
        },
        components: ["somatic"],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },

      resolution: "AUTOMATIC",

      utilityConfig: {
        utilityType: "protection",
        selectedEffects: [
          { id : "spell_magnet",
            name: "Spell Magnet",
            description: "Intercept spell targeting ally. Absorb its damage as Void Resonance.",
          },
        ],
      },
      
      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          { id : "strain_blindness",
            name: "Strain Blindness",
            description: "You are blinded by the radiation feedback.",
            mechanicsText: "Blinded",
          },
        ],
        statusEffects: [{ id : "blinded", level: 1 }],
        durationValue: 1,
        durationType: "rounds",
        durationUnit: "rounds",
      },

      tags: ["reaction", "interception", "spellguard"],
    },

    { id : "sg_shattered_mirror_ward",
      name: "Shattered Mirror Ward",
      description:
        "Raise an agonizing barrier of spatial refraction. When targeted by a spell, reflect it back at the caster for 100% damage. The violent refraction inflicts internal burns, dealing 1d8 necrotic damage to your own organs.",
      level: 2,
      spellType: "REACTION",
      icon: "Arcane/Magical Cross Emblem 2",
      effectTypes: ["utility", "damage"],

      typeConfig: {
        school: "arcane",
        icon: "Arcane/Magical Cross Emblem 2",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },

      resourceCost: {
        actionPoints: 1,
        mana: 6,
        classResource: {
          type: "arcane_energy_points",
          cost: 15,
        },
        components: ["verbal", "somatic"],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },

      resolution: "AUTOMATIC",

      utilityConfig: {
        utilityType: "protection",
        selectedEffects: [
          { id : "mirror_refract",
            name: "Mirror Refraction",
            description: "Reflect incoming spell back at the caster (100% damage).",
          },
        ],
      },
      
      damageConfig: {
        formula: "1d8",
        damageTypes: ["necrotic"],
        resolution: "AUTOMATIC",
      },

      tags: ["reaction", "reflection", "self damage", "spellguard"],
    },

    // ========================================
    // LEVEL 3 SPELLS
    // ========================================
    { id : "sg_warding_ribcage",
      name: "Warding Ribcage",
      description:
        "Call forth spectral, radioactive rib-like structures to encase allies within 15 feet. Grants a shield absorbing 4d6 damage. Every time an ally's shield absorbs damage, you take 2 necrotic damage from the feedback link, but gain 2 Void Resonance.",
      level: 3,
      spellType: "ACTION",
      icon: "Necrotic/Drain Soul",
      effectTypes: ["buff"],

      typeConfig: {
        school: "force",
        icon: "Necrotic/Drain Soul",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        areaShape: "circle",
        areaSize: 15,
        targetRestrictions: ["allies"],
      },

      resourceCost: {
        actionPoints: 1,
        mana: 10,
        classResource: {
          type: "arcane_energy_points",
          cost: 20,
        },
        components: ["verbal", "somatic", "material"],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },

      resolution: "AUTOMATIC",

      buffConfig: {
        buffType: "damageMitigation",
        effects: [
          { id : "ribcage_shield",
            name: "Ribcage Shield",
            description: "Absorbs 4d6 damage. Spellguard takes 2 necrotic damage and gains 2 Resonance per hit.",
            mechanicsText: "Absorb 4d6",
          },
        ],
        durationValue: 1,
        durationType: "minutes",
        durationUnit: "minutes",
      },

      tags: ["aoe", "shield", "feedback", "spellguard"],
    },

    { id : "sg_void_suppression",
      name: "Void Suppression",
      description:
        "Instantly crush a spell in the target's throat by flooding their lungs with void ash. Force an Intelligence save. On fail, their spell is countered, and you absorb Resonance equal to the spell's level × 10.",
      level: 3,
      spellType: "REACTION",
      icon: "Arcane/Magical Cross Emblem 2",
      effectTypes: ["utility", "control"],

      typeConfig: {
        school: "void",
        icon: "Arcane/Magical Cross Emblem 2",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: ["enemies"],
      },

      resourceCost: {
        actionPoints: 1,
        mana: 10,
        classResource: {
          type: "arcane_energy_points",
          cost: 15,
        },
        components: ["verbal", "somatic"],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },

      resolution: "SAVE",

      utilityConfig: {
        utilityType: "disruption",
        selectedEffects: [
          { id : "counter_spell",
            name: "Counter Spell",
            description: "Interrupt target's spell casting.",
          },
        ],
      },
      
      controlConfig: {
        controlType: "silence",
        effects: [
          { id : "lung_ash",
            name: "Ash in Lungs",
            description: "Spell countered on failed save.",
          },
        ],
        savingThrow: {
          ability: "intelligence",
          difficultyClass: 14,
          saveOutcome: "negates",
        },
        duration: 0,
        durationUnit: "instant",
      },

      tags: ["reaction", "counterspell", "spellguard"],
    },

    // ========================================
    // LEVEL 4 SPELLS
    // ========================================
    { id : "sg_entropic_supernova",
      name: "Entropic Supernova",
      description:
        "A devastating purge of radiation. Unleash a blinding eruption of stored energy, dealing 6d8 force damage to all enemies in a 20-foot radius (Agility save for half). Enemies who fail their save are blinded by void radiation for 1 round.",
      level: 4,
      spellType: "ACTION",
      icon: "Force/Explosion Burst",
      effectTypes: ["damage", "debuff"],

      typeConfig: {
        school: "force",
        icon: "Force/Explosion Burst",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        areaShape: "circle",
        areaSize: 20,
        targetRestrictions: ["enemies"],
      },

      resourceCost: {
        actionPoints: 1,
        mana: 14,
        classResource: {
          type: "arcane_energy_points",
          cost: 40,
        },
        components: ["verbal", "somatic"],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },

      resolution: "SAVE",

      damageConfig: {
        formula: "6d8",
        damageTypes: ["force"],
        resolution: "SAVE",
        savingThrow: {
          ability: "agility",
          difficultyClass: 15,
          saveOutcome: "half_damage",
        },
      },

      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          { id : "supernova_blind",
            name: "Radiation Blindness",
            description: "Blinded by the violent purge.",
            mechanicsText: "Blinded",
          },
        ],
        statusEffects: [{ id : "blinded", level: 1 }],
        durationValue: 1,
        durationType: "rounds",
        durationUnit: "rounds",
      },

      tags: ["aoe", "purge", "detonation", "spellguard"],
    },

    // ========================================
    // LEVEL 5 SPELLS
    // ========================================
    { id : "sg_tomb_of_the_aegis",
      name: "Tomb of the Aegis",
      description:
        "Encase yourself in a solid tomb of blackened void crystal. You gain complete immunity to all damage and effects for 1 round, but cannot act. At the start of your next turn, the tomb violently shatters, dealing 4d6 slashing damage to you and all adjacent creatures.",
      level: 5,
      spellType: "ACTION",
      icon: "Force/Force Field",
      effectTypes: ["buff", "damage"],

      typeConfig: {
        school: "force",
        icon: "Force/Force Field",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },

      resourceCost: {
        actionPoints: 1,
        mana: 18,
        classResource: {
          type: "arcane_energy_points",
          cost: 50,
        },
        components: ["verbal", "somatic"],
      },

      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },

      resolution: "AUTOMATIC",

      buffConfig: {
        buffType: "invulnerability",
        effects: [
          { id : "void_tomb",
            name: "Void Tomb",
            description: "Immune to all damage and effects. Cannot take actions.",
            mechanicsText: "Invulnerability",
          },
        ],
        durationValue: 1,
        durationType: "rounds",
        durationUnit: "rounds",
      },
      
      damageConfig: {
        formula: "4d6",
        damageTypes: ["slashing"],
        resolution: "AUTOMATIC",
      },

      tags: ["defense", "immunity", "self damage", "spellguard"],
    },
    
    { id : "sg_violent_purge",
      name: "Violent Purge",
      description:
        "A cataclysmic blast of arcane radiation to save your own life from a meltdown. Expel ALL your Void Resonance (minimum 30 required). Deals force damage equal to (Void Resonance × 1.5) to all creatures within 20 feet, including your allies.",
      level: 5,
      spellType: "ACTION",
      icon: "Force/Explosion Burst",
      effectTypes: ["damage"],

      typeConfig: {
        school: "force",
        icon: "Force/Explosion Burst",
        castTime: 2,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        areaShape: "circle",
        areaSize: 20,
        targetRestrictions: ["any"],
      },

      resourceCost: {
        actionPoints: 2,
        mana: 10,
        classResource: {
          type: "arcane_energy_points",
          cost: 100, 
        },
        components: ["verbal", "somatic"],
      },

      cooldownConfig: { cooldownType: "short_rest", cooldownValue: 1 },

      resolution: "DICE",

      damageConfig: {
        formula: "AEP * 1.5",
        damageTypes: ["force"],
        resolution: "DICE",
      },

      tags: ["ultimate", "purge", "aoe", "spellguard"],
    },

    // ========================================
    // LEVEL 6-10 SPELLS (Selected High-Tier Purges)
    // ========================================
    { id : "sg_leyline_blackout",
      name: "Leyline Blackout",
      description:
        "Absolute suppression of the dimensional leylines. Creates a 60-foot zone of oppressive gravity that suppresses all spells, magic items, and magical effects for 5 rounds. Casting this tears your vocal cords, silencing you for 1 minute.",
      level: 7,
      spellType: "ACTION",
      icon: "Void/Black Hole",
      effectTypes: ["utility", "debuff"],

      typeConfig: {
        school: "void",
        icon: "Void/Black Hole",
        castTime: 2,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        areaShape: "circle",
        areaSize: 60,
        targetRestrictions: ["any"],
      },

      resourceCost: {
        actionPoints: 2,
        mana: 26,
        classResource: {
          type: "arcane_energy_points",
          cost: 35,
        },
        components: ["verbal", "somatic"],
      },

      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },

      resolution: "AUTOMATIC",

      utilityConfig: {
        utilityType: "environment",
        selectedEffects: [
          { id : "anti_magic_field",
            name: "Anti-Magic Field",
            description: "Suppresses all magic in the area.",
          },
        ],
      },
      
      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          { id : "torn_vocal_cords",
            name: "Torn Vocal Cords",
            description: "You are silenced by the immense physical strain.",
            mechanicsText: "Silenced",
          },
        ],
        statusEffects: [{ id : "silenced", level: 1 }],
        durationValue: 1,
        durationType: "minutes",
        durationUnit: "minutes",
      },

      tags: ["zone", "anti magic", "ultimate", "spellguard"],
    },

    { id : "sg_cosmic_unraveling",
      name: "Cosmic Unraveling",
      description:
        "Instantly end all magical phenomena on the battlefield, regardless of power level or origin. The sheer volume of magic consumed instantly puts you into Critical Meltdown, reducing you to 1 HP and shattering your armor.",
      level: 10,
      spellType: "ACTION",
      icon: "Void/Black Hole",
      effectTypes: ["utility", "damage"],

      typeConfig: {
        school: "void",
        icon: "Void/Black Hole",
        castTime: 3,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        areaShape: "circle",
        areaSize: 200,
        targetRestrictions: ["any"],
      },

      resourceCost: {
        actionPoints: 3,
        mana: 40,
        classResource: {
          type: "arcane_energy_points",
          cost: 100,
        },
        components: ["verbal", "somatic", "material"],
      },

      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },

      resolution: "AUTOMATIC",

      utilityConfig: {
        utilityType: "disruption",
        selectedEffects: [
          { id : "absolute_dispel",
            name: "Absolute Dispel",
            description: "Dispels EVERYTHING. No saves. No exceptions.",
          },
        ],
      },
      
      damageConfig: {
        formula: "Current_HP - 1",
        damageTypes: ["necrotic"],
        resolution: "AUTOMATIC",
      },

      tags: ["ultimate", "dispel", "suicide", "spellguard"],
    },

      {
        "id": "spellguard_aegis_beacon",
        "name": "Aegis Beacon",
        "description": "Tap your steel chest plate, causing your armor to gleam with a brilliant silver light. This projects a narrow beam of intense light that functions as a distress beacon or flashes to illuminate a dark cavern.",
        "level": 2,
        "spellType": "ACTION",
        "icon": "Radiant/Radiant Divinity",
        "typeConfig": {
          "school": "arcane",
          "icon": "Radiant/Radiant Divinity",
          "tags": [
            "utility",
            "roleplay",
            "spellguard"
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
            "somatic"
          ],
          "somaticText": "Tap your gauntlet firmly against your breastplate twice, a metallic chime ringing out"
        },
        "resolution": "NONE",
        "effectTypes": [
          "utility"
        ],
        "utilityConfig": {
          "utilityType": "conjuration",
          "selectedEffects": [
            {
              "id": "aegis_beacon_glow",
              "name": "Aegis Illumination",
              "description": "Your chest plate projects a 60-foot cone of bright silver light for 1 hour. It functions as a distress beacon visible up to 5 miles away in open air."
            }
          ],
          "duration": 1,
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
          "spellguard"
        ]
      }
  ],
};
