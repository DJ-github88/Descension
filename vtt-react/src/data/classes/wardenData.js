/**
 * Warden Class Data
 *
 * Complete class information for the Warden - the Penitent Jailer
 * who drives rusted iron chains through their own flesh to tether abominations.
 */

export const WARDEN_DATA = {
  id : "warden",
  name: "Warden",
  icon: "fas fa-link",
  role: "Melee Lockdown / Heavy Sentinel",
  damageTypes: ["slashing", "bludgeoning", "necrotic"],

  // Overview section
  overview: {
    title: "The Warden",
    subtitle: "The Penitent Jailer & Nightmare Bound",

    quickOverview: {
      title: "Quick Overview",
      content: `**What You Need to Know**: The Warden is a heavy-martial lockdown specialist who has completely abandoned all druidic or forest ranger tropes. They are the Penitent Jailer—wielding thick, rusted iron chains physically grafted directly into their own forearms, spine, and flesh. They do not guard trees; they guard nightmares.

**Core Mechanic**: Drive rusted hooks into your own flesh and the enemy to establish a *Flesh Tether* -> Restrict target's movement and target selection -> Generate *Tether Tension* through pain and manual reeling -> Spend Tension on bone-crushing flails, agony-infused braces, or ultimate ascundancies.

**Resource**: *Tether Tension* (0-10 scale), representing the agonizing physical strain on the chains driven through your bones. Built by establishing tethers, receiving strikes, or manually reeling; spent on massive crowd-control and crushing counter-strikes.

**Playstyle**: Extreme close-quarters lockdown. You physically anchor yourself to the battlefield's greatest horrors, forcing them into a brutal duel of meat and bone.

**Best For**: Players who enjoy high-risk, high-reward tactical shielding, inescapable crowd control, and the heavy, agonizing narrative of a warrior who pays for every victory in blood and bone.`,
    },

    description: `The Warden is a grim, tragic figure of absolute lockdown—a Penitent Jailer who binds their own flesh to the horrors they pursue. Stripped of all druidic or forest magic, they wield massive, rusted iron chains grafted directly into their forearms and spine. They exist to hold the line against nightmares, pinning abominations in place by physically chaining themselves to the beast. Their power is not magical grace; it is the desperate, agonizing survival of bone, meat, and iron under crushing tension.`,

    roleplayIdentity: {
      title: "Roleplay Identity",
      content: `Wardens are not forest protectors; they are the final, desperate cell of inquisitorial jailers. They bear the heavy scars of their calling, carrying the weight of nightmares that must never be allowed to reach the light. Driven by penance, they choose to drive rusted steel hooks through their own bones to become living anchors for the abominations of the deep.

**Common Warden Archetypes**:
- **The Penitent Jailer**: Driven by some unspoken past failure, they graft chains into their forearms to ensure no monster ever escapes their grasp again.
- **The Rusted Anchor**: A heavy-clad frontline sentinel who views their own body as a physical barricade, using iron and blood to halt colossal threats.
- **The Flayed Inquisitor**: Driven by zealotry, they use self-inflicted pain to fuel kinetic chain lashings, finding holy absolution in physical agony.
- **The Graveyard Sentinel**: Bound to ancient crypts or ruined keeps, guarding specific terrors that have been chained to their lineage for generations.

**Personality Traits**:
Wardens are stoic, grim, and utterly hollowed out by their duty. They speak in hushed tones, their voices like dry leaves scraping over gravel. They carry the smell of old iron, dried blood, and tomb-dust. They do not seek glory or companionship; they seek only the cold, silent relief of a duty completed.`,
    },

    combatRole: {
      title: "Combat Role",
      content: `**Primary Role**: Heavy-martial lockdown specialist and damage-absorbing anchor.

**Combat Strengths**:
- **Inescapable forced dueling**: The exclusive *Flesh Tether* creates an unbreakable 15-foot radius. The tethered enemy physically cannot target the Warden's allies.
- **Massive crowd control**: Able to lock down high-threat targets, preventing all teleportation and movement beyond the chain's reach.
- **Pain-driven resource economy**: Tether Tension scales with combat aggression and damage taken, feeding their most devastating close-range abilities.
- **Unrivaled tanking utility**: Keeps fragile allies completely safe from the tethered abomination.

**Combat Weaknesses**:
- **Shared Torment**: Because they are physically chained to the monster, they absorb 50% of all AoE or environmental damage that strikes their prisoner.
- **Agonizing Recoil**: If they tether a beast of vastly superior strength or speed, they are helplessly dragged across the battlefield, suffering massive bludgeoning damage (1d10 per 10 feet dragged).
- **Hard-coded Psychic Vulnerability**: Constant proximity to eldritch horrors fractures their mind, causing them to take +50% Psychic damage.
- **Zero Ranged Attacks**: Completely helpless at distance; they must reel targets in or walk them down in heavy iron.
- **Agonizing Cast Costs**: Establishing tethers or reelings requires sacrificing their own HP (1d6 necrotic/piercing to self) as the grafted hooks tear through flesh.`,
    },

    playstyle: {
      title: "Playstyle & Strategy",
      content: `**Tether Tension Management**:
Warden combat is a high-wire balancing act of pain and control. Tether Tension caps at 10. You must constantly manage this tension:
- **Tether and Reel**: Start combat by driving a *Flesh Tether* into the primary target (generates 2 Tension at the cost of 1d6 self-inflicted necrotic damage).
- **Pain is Power**: Build Tension by taking damage or using abilities that manually pull the chains tighter.
- **Spend to Subdue**: Consume Tether Tension to activate heavy defensive braces (*Penitent Resolve*, 4 Tension) or to deliver crushing flails (*Barbed Lash*, 2 Tension).
- **Iron Ascendancy**: Save 10 Tension to enter *Flayed Ascendancy* (ultimate transformation), where the Warden's flesh fuses with the iron, lashing out at all nearby foes and rendering them immune to displacement while the target is dragged helplessly.

**The Fatal Drag**:
Be wary of tethering high-strength targets. If they move, you are dragged. Use *Iron Brace* to double your weight and resist displacement, or suffer the bludgeoning recoil of being dragged across the gravel.

**Psychic Shielding**:
With a permanent +50% Psychic vulnerability, you must rely on your party's casters or your own *Penitent Resolve* to survive mental assaults. Keep the abomination's physical body bound to you, but keep your mind guarded.`,
    },

    immersiveCombatExample: {
      title: "Combat Example: The Tethered Nightmare",
      content: `**The Setup**: You are a Warden (Relentless Tormentor specialization) locking down a colossal flesh-golem. Your party is positioned safely behind you. Starting Tension: 0. HP: 90/90. Your goal: Drive your hooks deep, anchor the abomination, absorb its fury, and drag it into submission.

**Starting State**: Tether Tension: 0/10 | HP: 90/90 | Tethered Target: None

**Turn 1 - Graft the Hook (Tension: 0 → 2)**

*The flesh-golem roars, stepping toward your fragile mage. You step forward. You do not shout a holy oath. You grip the rusted chain extending from your forearms and drive the colossal hook straight through your own wrist and deep into the golem's shoulder.*

**Your Action**: "Flesh Tether" on Flesh-Golem (1 Action Point)
**Self-Harm**: Take 1d6 necrotic damage → [4] = 86 HP remaining.
**Effect**: Golem is tethered. It physically cannot target your allies or move beyond a 15-foot radius from you.
**Tension Generated**: +2 Tension (Tension: **2/10**)

*The golem shrieks as the chain snaps taut. It tries to raise its fist toward the mage, but the physical drag of the iron binds its focus to you. It must fight you, and only you.*

**Turn 2 - Pain Builds Power (Tension: 2 → 5)**

*The golem realizes it is trapped. It turns its fury upon you, smashing its heavy fists into your iron plate.*

**Golem's Turn**: Attacks you twice.
**Attack Roll 1**: d20+6 → Hit!
**Damage**: 18 bludgeoning damage. You endure.
**Tension Generated**: +1 (Tether strike) = **3/10** (Tension Threshold: Taut Links active! Your movement is restricted but your chain strikes deal +1d6 tearing damage).
**Attack Roll 2**: d20+6 → Hit!
**Damage**: 15 bludgeoning damage.
**Tension Generated**: +1 (Tether strike) = **4/10**
**Your Reaction**: "Iron Brace" (+2 Armor against the second hit, reducing the damage by 5). You manually pull the chain links, grinding them against your wrist bone to generate more tension.
**Tension Generated**: +1 (Iron Brace manual reel) = **5/10**

*HP: 86 - 18 - 10 = 58/90. Your blood lubricates the rusted links, but your mind is focused. Tension is at 5. The chains are vibrating with raw kinetic force.*

**Turn 3 - Bracing the Beast (Tension: 5 → 1)**

*The golem attempts to dash away to crush your allies. Because it is vastly larger, it drags you with it.*

**Golem's Action**: Attempts to break the boundary by dashing.
**Shared Torment Recoil**: You are dragged 20 feet across the gravel, taking 2d10 bludgeoning damage → [5, 4] = 9 damage.
**Your Action**: "Penitent Resolve" (4 Tether Tension spent).
**Tension**: 5 - 4 = **1/10**
**Effect**: Gain 50% damage resistance and +4 Armor for 2 rounds. Your physical mass doubles, stopping the golem's movement instantly.

*You slam your heel into the dirt. The iron plate grinds into the stone. The golem is jerked to a violent halt, its shoulder socket popping under the strain of the chain. It is locked down.*

**Turn 4 - Rebuilding the Trap (Tension: 1 → 6)**

**Your Action**: Agonizing Reel (1 AP). You pull the rusted chain tighter, grinding the metal hooks deeper into your flesh.
**Self-Harm**: Take 1d4 piercing damage → [2] = 47 HP remaining.
**Tension Generated**: +2 = **3/10**
**Your Action**: "Barbed Lash" (2 Tension spent) combined with a melee chain strike.
**Tension**: 3 - 2 = **1/10**
**Attack Roll**: d20+8 → Hit!
**Base Damage**: 2d6+4 → [5, 6] + 4 = 15 slashing damage.
**Barbed Lash Bonus**: +2d6 → [6, 4] = 10 bleeding damage.
**Total Damage**: 25 damage!
**Tension Generated**: +2 (striking tethered prey twice with multi-strike) = **3/10**

*The golem is bleeding black bile. It swings wildly again, missing as you deflect the blow.*
**Golem's Turn**: Swing misses.
**Your Reaction**: "Iron Brace" reaction.
**Tension Generated**: +1 = **4/10**

**Turn 5 - Flayed Ascendancy (Tension: 4 → 10 → 0)**

*You manually reel the chain once more as a free action under Tension, pushing your body to the limit. The pain is blinding, but the lock is absolute.*

**Tension**: Pushed to **10/10** (MAXIMUM!).
**Your Action**: "FLAYED ASCENDANCY" (10 Tension spent).
**Tension**: 10 - 10 = **0/10** (Transformation active for 6 rounds).

*You let out a tragic, gutteral roar. The rusted iron chains grafted to your spine expand, tearing through your skin and forming a sweeping ribcage of jagged steel around you. The golem tries to pull back, but the chains retract automatically, dragging its massive bulk helplessly toward you. You are the Jailer, and this is your gaol.*

**Final State**: HP: 45/90 | Tension: 0/10 | Flayed Ascendancy: Active (6 rounds) | Golem: Dragged and helpless.`,
    },
  },

  // Resource System
  resourceSystem: {
    title: "Tether Tension",
    subtitle: "The Agony of the Graft",

    description: `The Warden's resource is Tether Tension, a representation of the physical strain on the iron chains driven through their forearms, spine, and flesh. Generated by self-mutilating reels, establishing tethers, and taking damage, Tension is consumed to unleash crushing bludgeoning strikes or to brace against colossal impacts. This system forces the Warden to ride the razor-thin line between holding the beast and being ripped apart by it.`,

    cards: [
      {
        title: "Tether Tension (0-10)",
        stats: "10 Tension Max | Thresholds at 3/6/9",
        details: "Tension is a physical resource. As it builds, the chains pull taut, ripping through the Warden's flesh. High tension increases damage output but restricts mobility and increases self-harm."
      },
      {
        title: "Flesh Tether",
        stats: "1 Target Tethered",
        details: "Drive your rusted hooks into a target within 15 feet. They cannot leave the 15-foot radius or target your allies. Marking a new target tears the hooks out, dealing necrotic damage to you."
      },
      {
        title: "Shared Torment",
        stats: "50% AoE Damage Shared",
        details: "You are physically chained to the monster. 50% of all AoE or environmental damage that strikes your prisoner is shared directly into your own flesh. If they are dragged, so are you."
      }
    ],

    usage: {
      momentum: "Establish your Flesh Tether immediately. The initial impact generates 2 Tether Tension. Use manual reels to build Tension, then spend it on Iron Brace to ensure you cannot be dragged when the monster attempts to flee.",
      flourish: "Flayed Ascendancy is your absolute lockdown window. Consuming 10 Tension turns your flesh into an iron bastion, dragging the chained horror helplessly while shredding them with automatic chain lashes."
    },

    overheatRules: {
      title: "Tether Tension Thresholds",
      content: `The physical strain of the chains driven through your bone has a direct effect on your body:

**0-2 Tension (Slack Chain)**:
Your chains are slack. You have normal movement speed, but your chain-based strikes deal standard damage.

**3-5 Tension (Taut Links)**:
The chains pull tight. Your movement speed is restricted to the tethered target's vicinity (+5ft toward them, cannot move away). Your melee strikes deal +1d6 tearing damage as the chain vibrates, but you take 1d4 bludgeoning damage at the start of your turn if the target moved on its previous turn.

**6-8 Tension (Gravely Strained)**:
You are bound in agony. You gain +2 to attack rolls, but your movement speed is reduced by 10 ft. At the start of your turn, you take 1d6 piercing damage as the hooks in your flesh tear. You absorb 75% of the target's AoE damage instead of 50%.

**9-10 Tension (Lacerating Snap)**:
Maximum tension. Your attacks deal +2d8 bludgeoning/slashing damage. However, you are vulnerable to all physical damage, and if the target moves more than 15 feet from you, they drag you, dealing 2d10 bludgeoning damage to you. Any further Tension generated deals 1d10 piercing damage directly to your HP.`
    },

    resourceTables: [
      {
        title: "Tension Generation",
        headers: ["Action", "Tension Gained", "Notes"],
        rows: [
          ["Establish Flesh Tether", "2 Tension", "Costs 1d6 self-inflicted necrotic damage"],
          ["Suffer Strike from Tethered Target", "1 Tension", "Pain builds tension in the links"],
          ["Agonizing Reel (AP Cost)", "2 Tension", "Pull the chains tighter, dealing 1d4 piercing to self"],
          ["Evasive Brace Miss/Hit", "1 Tension", "Successful bracing or deflection builds tension"]
        ]
      },
      {
        title: "Tension Expenditure",
        headers: ["Cost", "Ability", "Effect"],
        rows: [
          ["2 Tension", "Barbed Lash", "Next attack deals +2d6 slashing/bleeding damage"],
          ["3 Tension", "Sweeping Chains", "Cone attack slows all targets by 15 feet"],
          ["4 Tension", "Penient Resolve", "Gain 50% damage resistance, doubled if tethered target is near"],
          ["6 Tension", "Iron Gaol", "Summon heavy iron bars to trap target for 3 rounds"],
          ["10 Tension", "Flayed Ascendancy", "Ultimate transformation; drag target and shred nearby foes"]
        ]
      }
    ]
  },

  // Character Creation
  characterCreation: {
    title: "Creating a Warden",
    subtitle: "Forging the Penitent Anchor",

    abilityPriorities: {
      primary: "Agility",
      primaryDesc: "Fuels your accuracy with heavy chains, your Dodge rate, and physical coordination.",
      secondary: "Constitution",
      secondaryDesc: "Vital for surviving the agonizing self-inflicted wounds and Shared Torment of the tether.",
      tertiary: "Spirit",
      tertiaryDesc: "Determines your resistance to mental fractures and the saving throw DC of your iron gaols."
    },

    startingEquipment: {
      weapons: [
        {
          name: "Grafted Iron Chains",
          damage: "2d6 slashing or bludgeoning",
          properties: "Heavy-martial, grafted to forearms. 15-foot range. Cannot be disarmed or removed."
        }
      ],
      armor: [
        {
          name: "Flayed Jailer Plate",
          armor: "15 + agility modifier (max +2)",
          properties: "Heavy iron plate bolted directly to the shoulders. -10ft base speed penalty."
        }
      ],
      gear: [
        "Inquisitorial bone saw and grafting tools",
        "Rusted lockpicks and manacles",
        "Tomb-dust incense (to numb the nerves)",
        "Pouch with 10 tarnished coins"
      ]
    },

    startingStats: {
      hp: "12 + Constitution modifier",
      hitDice: "1d12 per Warden level",
      armor: "15 + agility modifier (max +2) (Flayed Jailer Plate)",
      speed: "20 ft (heavy plate penalty included)",
      savingThrows: ["Agility", "Constitution"],
      skills: [
        "Choose 3 from: Athletics, Insight, Intimidation, Perception, Religion, Survival"
      ]
    },

    startingAbilities: [
      {
        name: "Flesh Tether",
        type: "Action",
        desc: "Drive iron chains into target within 15ft, locking them to your radius. Generates 2 Tension."
      },
      {
        name: "Chain Graft",
        type: "Passive",
        desc: "Melee reach is 15ft. Attacks have +1 to hit. Cannot use ranged weapons."
      },
      {
        name: "Iron Brace",
        type: "Reaction",
        desc: "+2 Armor against an attack. Miss or hit, gain 1 Tension."
      },
      {
        name: "Barbed Lash",
        type: "2 Tension",
        desc: "Empower next strike, dealing +2d6 slashing and bleeding damage."
      }
    ],

    specializationChoice: {
      level: 3,
      description: "At 3rd level, choose your path of penance: Flayed Stalker (stealth/bleed), Iron Gaoler (mass lockdown/cages), or Relentless Tormentor (inescapable drag/crush)."
    },

    levelProgression: {
      title: "Warden Level Progression",
      headers: ["Level", "Tension Max", "Feature Unlocked"],
      rows: [
        ["1", "10", "Flesh Tether, Chain Graft, Iron Brace, Barbed Lash"],
        ["2", "10", "Sweeping Chains, Penitent Resolve"],
        ["3", "10", "Specialization Choice + Spec Passives"],
        ["4", "10", "Ability Score Improvement"],
        ["5", "10", "Flayed Ascendancy (Ultimate Transformation)"],
        ["6", "10", "Iron Storm, Gaol Shatter"],
        ["7", "10", "Reel and Execute, Torturer's Wrath, Grave-Iron Cage"],
        ["8", "10", "Ability Score Improvement, Ascendant Jailer, Eternal Iron Tomb, Brutal Whipping"],
        ["9", "10", "Penitent Judgment, Mass Imprisonment, Inescapable Shackle"],
        ["10", "10", "Flayed Ascendancy Perfected, Cataclysm of Iron, Iron Prison Realm"]
      ]
    }
  },

  // Specializations
  specializations: {
    title: "Warden Paths of Penance",
    subtitle: "Three Modes of Torment",

    description: "Every Warden chooses a path of physical penance, tuning their iron grafts to perform specific, terrifying functions of lockdown, execution, or stealth.",

    sharedPassive: {
      name: "Cruel Tracker",
      icon: "Piercing/Targeted Strike",
      description: "You have advantage on Survival and Perception checks to track creatures. Your rusted chains drag behind you, carving a deep groove in the soil."
    },

    specs: [
      { id : "shadowblade",
        name: "Flayed Stalker",
        icon: "Piercing/Night Dagger",
        color: "#2E0854",
        theme: "Pain-Channeled Stealth",
        description: "The Flayed Stalker blends in the shadows not through grace, but through complete stillness and numbed flesh. They strike silently, dragging victims into the dark to rip them apart.",
        playstyle: "Stealth-based lockdown and bleed assassin, striking from silence with devastating flails.",
        strengths: [
          "Highest burst damage of all Warden specs",
          "Attacks from stealth generate +1 Tension (total 3 Tension)",
          "Agonizing silence hides them after spending Tension",
          "Devastating bleed and necrotic synergy"
        ],
        weaknesses: [
          "Requires stealth setup for maximum effectiveness",
          "Lower sustained survivability than Relentless Tormentor",
          "Fewer mass-control options than Iron Gaoler",
          "Agonizing recoil when stealth is broken"
        ],
        passiveAbilities: [
          {
            name: "Lacerating Ambush",
            icon: "Utility/Hide",
            description: "Attacks from stealth generate +1 Tension (total 3 Tension) and deal +1d8 bleed damage. You can hide for 1 action point after a successful strike."
          },
          {
            name: "Shed the Coil",
            icon: "Psychic/Mind Control",
            description: "After spending 3 or more Tension on an ability, you dissolve into shadow-smoke, becoming invisible for 1 round. Breaks if you attack."
          }
        ],
        recommendedSpells: [
          "Flayed Leap - Leap from stealth to lock chains around prey",
          "Flayed Shadow Assault - Ultimate stealth-fused chain frenzy",
          "Pain-Fueled Flail - Basic stealth strike generating high Tension",
          "Flesh Tether - Crucial to anchor targets before they run"
        ]
      },
      { id : "jailer",
        name: "Iron Gaoler",
        icon: "Necrotic/Crossed Bones",
        color: "#4A5568",
        theme: "Spectral Iron Cages",
        description: "The Iron Gaoler projects their inner torment outward, summoning heavy, spectral iron bars to cage multiple enemies and isolate them from the battlefield.",
        playstyle: "Heavy crowd control and sentinel defense, caging high-threat targets to contain the battlefield.",
        strengths: [
          "Reduced cage costs (4 Tension instead of 6)",
          "Enemies trapped in cages take +1d6 damage from all sources",
          "Can maintain up to 2 cages simultaneously",
          "Unrivaled area control"
        ],
        weaknesses: [
          "Lower direct single-target damage",
          "Cages can be broken by high-Strength giants",
          "Extremely slow base speed (-15ft speed penalty)",
          "Requires heavy Tension management for multi-cages"
        ],
        passiveAbilities: [
          {
            name: "Master Gaoler",
            icon: "Psychic/Mind Control",
            description: "Iron Gaol costs -2 Tension (4 Tension instead of 6). You can maintain up to 2 spectral iron cages simultaneously."
          },
          {
            name: "Condemned in Steel",
            icon: "Necrotic/Necrotic Skull",
            description: "Enemies trapped in your cages take +1d6 damage from all sources. If caged targets are tethered by Flesh Tether, they take an additional +1d6 damage."
          }
        ],
        recommendedSpells: [
          "Iron Gaol - Core cage control at reduced cost",
          "Conductive Torment - Chain kinetic feedback between caged foes",
          "Coliseum of Iron - Ultimate area cage lockdown",
          "Sweeping Chains - Cone bludgeoning to herd enemies into cages"
        ]
      },
      { id : "vengeance-seeker",
        name: "Relentless Tormentor",
        icon: "Slashing/Cross Slash",
        color: "#8B0000",
        theme: "Inescapable Drag & Crush",
        description: "The Relentless Tormentor uses their massive weight and absolute physical stubbornness to drag enemies across the gravel, crushing their bones against stone.",
        playstyle: "Displacement tank and relentless pursuer, dragging enemies helplessly and dealing massive bludgeoning damage.",
        strengths: [
          "Marked targets cannot escape or teleport out of line of sight",
          "Free dashes (reels) to tethered prey",
          "Absorbs and resists displacement effects",
          "Extended Flayed Ascendancy duration"
        ],
        weaknesses: [
          "Completely dependent on Flesh Tether for mobility",
          "Suffers high bludgeoning self-damage when dragged by giants",
          "Absorbs high percentages of shared AoE damage",
          "Zero ranged tools"
        ],
        passiveAbilities: [
          {
            name: "Inexorable Reel",
            icon: "Nature/Sense",
            description: "Tethered targets cannot hide, become invisible, or teleport while in your line of sight. Dashing (reeling) to them costs no action points, and your movement speed toward them increases by +5ft per Tension stack (max +50ft)."
          },
          {
            name: "Endless Binding",
            icon: "General/Fiery Rage",
            description: "Flayed Ascendancy lasts +2 rounds (total 6 rounds). While transformed, strikes against tethered targets generate +1 Tension."
          }
        ],
        recommendedSpells: [
          "Cruel Drag - Reel yourself to the target and strike",
          "Spined Torment - Massive crushing blows against tethered prey",
          "Flayed Ascendancy - Long-lasting ultimate engine of chains",
          "Flesh Tether - Absolutely mandatory for all mobility"
        ]
      }
    ]
  },

  // Combined level 1-10 meticulously normalized spells list
  exampleSpells: [
    // ==========================================
    // LEVEL 1 SPELLS
    // ==========================================
    { id : "warden_shadow_strike_ability",
      name: "Pain-Fueled Flail",
      description: "Lash out with your rusted iron chains. The agony of the hooks driven through your own flesh fuels the strike, generating Tether Tension on hit.",
      spellType: "ACTION",
      icon: "Utility/Hide",
      level: 1,
      specialization: "shadowblade",
      effectTypes: ["damage"],
      typeConfig: {
        school: "necrotic",
        icon: "Utility/Hide",
        tags: ["necrotic", "damage", "stealth", "shadowblade"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "melee",
        rangeDistance: 15,
        targetRestrictions: ["enemies"]
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 0,
        durationUnit: "rounds"
      },
      resourceCost: {
        actionPoints: 1,
        mana: 0,
        resourceTypes: ["tether_tension"],
        resourceValues: { tether_tension: 0 },
        classResource: { type: "tether_tension", cost: -1 }
      },
      resolution: "DICE",
      damageConfig: {
        formula: "1d8 + agility",
        damageTypes: ["necrotic"],
        resolution: "DICE"
      },
      specialMechanics: {
        tensionGenerator: {
          description: "Generates 1 Tether Tension on a successful strike. Generates 3 Tension instead if striking from stealth."
        }
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
      tags: ["necrotic", "damage", "stealth", "shadowblade"]
    },
    { id : "warden_mark_of_the_hunt",
      name: "Flesh Tether",
      description: "Drive rusted iron hooks directly through your own forearms and bone into a single target within 15 feet. Creates an unbreakable physical bond. The tethered enemy cannot move beyond 15 feet of you, cannot target your allies, and you absorb 50% of all AoE or environmental damage they suffer.",
      spellType: "ACTION",
      icon: "Piercing/Targeted Strike",
      level: 1,
      specialization: "universal",
      effectTypes: ["debuff"],
      typeConfig: {
        school: "necrotic",
        icon: "Piercing/Targeted Strike",
        tags: ["necrotic", "debuff", "tether", "universal"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "melee",
        rangeDistance: 15,
        targetRestrictions: ["enemies"]
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 99,
        durationUnit: "rounds"
      },
      resourceCost: {
        actionPoints: 1,
        mana: 0,
        resourceTypes: ["tether_tension"],
        resourceValues: { tether_tension: 0 },
        classResource: { type: "tether_tension", cost: -2 }
      },
      resolution: "AUTOMATIC",
      debuffConfig: {
        debuffType: "statusEffect",
        durationValue: 99,
        durationType: "rounds",
        durationUnit: "rounds",
        effects: [
          { id : "flesh_tethered",
            name: "Flesh Tethered",
            description: "Tethered to the Warden. Cannot target the Warden's allies, cannot move beyond 15 feet, and the Warden absorbs 50% of your AoE damage.",
            statusType: "restrained",
            level: "strong",
            statPenalty: [
              { stat: "movement_speed", value: 0, magnitudeType: "flat" }
            ],
            statusEffect: {
              vulnerability: {
                type: "psychic",
                percentage: 50
              }
            }
          }
        ]
      },
      specialMechanics: {
        forcedDuel: {
          description: "Tethered target physically cannot select your allies as targets for single-target attacks or spells."
        },
        selfHarm: {
          description: "Casting deals 1d6 necrotic damage to yourself as the hooks rip through your flesh."
        }
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
      tags: ["necrotic", "debuff", "tether", "universal"]
    },
    { id : "warden_vengeful_strike",
      name: "Barbed Lash",
      description: "Empower your next chain strike by manually pulling the hooks back through your forearms. Rips the target's flesh, dealing bonus damage and inducing bleeding.",
      spellType: "ACTION",
      icon: "Bludgeoning/Mortal Strike",
      level: 1,
      specialization: "universal",
      effectTypes: ["damage", "debuff"],
      typeConfig: {
        school: "slashing",
        icon: "Bludgeoning/Mortal Strike",
        tags: ["slashing", "damage", "bleed", "universal"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "melee",
        rangeDistance: 15,
        targetRestrictions: ["enemies"]
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 2,
        durationUnit: "rounds"
      },
      resourceCost: {
        actionPoints: 1,
        mana: 0,
        resourceTypes: ["tether_tension"],
        resourceValues: { tether_tension: 2 },
        classResource: { type: "tether_tension", cost: 2 }
      },
      resolution: "DICE",
      damageConfig: {
        formula: "2d6 + agility",
        damageTypes: ["slashing"],
        resolution: "DICE",
        dotConfig: {
          enabled: true,
          damagePerTick: "1d4",
          damageType: "necrotic",
          tickFrequency: "round",
          duration: 2,
          canStack: false,
          maxStacks: 1
        }
      },
      debuffConfig: {
        debuffType: "damageOverTime",
        durationValue: 2,
        durationType: "rounds",
        durationUnit: "rounds",
        effects: [
          { id : "barbed_bleed",
            name: "Lacerating Bleed",
            description: "Taking 1d4 necrotic damage at the start of each turn from ripped flesh."
          }
        ]
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
      tags: ["slashing", "damage", "bleed", "universal"]
    },
    { id : "warden_evasive_maneuvers",
      name: "Iron Brace",
      description: "When targeted by an attack, brace your armor and brace the chains. Gain an Armor bonus. Whether the attack lands or misses, you gain 1 Tether Tension by reeling in.",
      spellType: "REACTION",
      icon: "Utility/Parry",
      level: 1,
      specialization: "universal",
      effectTypes: ["buff"],
      typeConfig: {
        school: "physical",
        icon: "Utility/Parry",
        tags: ["buff", "defense", "reaction", "universal"],
        castTime: 1,
        castTimeType: "REACTION"
      },
      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
        targetRestrictions: ["self"]
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 1,
        durationUnit: "rounds"
      },
      resourceCost: {
        actionPoints: 0,
        mana: 0,
        resourceTypes: ["tether_tension"],
        resourceValues: { tether_tension: 0 },
        classResource: { type: "tether_tension", cost: -1 }
      },
      resolution: "AUTOMATIC",
      buffConfig: {
        buffType: "damageMitigation",
        durationValue: 1,
        durationType: "rounds",
        durationUnit: "rounds",
        effects: [
          { id : "braced_defense",
            name: "Braced",
            description: "Armor increased by +2 against the triggering attack.",
            statModifier: {
              stat: "armor",
              magnitude: 2,
              magnitudeType: "flat"
            }
          }
        ]
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },
      tags: ["buff", "defense", "reaction", "universal"]
    },
    { id : "warden_glaive_mastery",
      name: "Chain Graft",
      description: "Your arms are grafted to heavy iron chains. Your melee reach is permanently increased to 15 feet and your chain attacks have +1 to hit. However, you are strictly forbidden from wielding or using ranged weapons.",
      spellType: "PASSIVE",
      icon: "Slashing/Curved Blade",
      level: 1,
      specialization: "universal",
      effectTypes: ["buff"],
      typeConfig: {
        school: "physical",
        icon: "Slashing/Curved Blade",
        tags: ["passive", "buff", "universal"],
        castTime: 0,
        castTimeType: "PASSIVE"
      },
      targetingConfig: {
        targetingType: "self",
        rangeType: "self"
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 99,
        durationUnit: "rounds"
      },
      resourceCost: {
        actionPoints: 0,
        mana: 0,
        resourceTypes: ["tether_tension"],
        resourceValues: { tether_tension: 0 }
      },
      resolution: "AUTOMATIC",
      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          { id : "chain_reach",
            name: "Chain Reach",
            description: "Melee reach is 15 feet. Cannot use ranged weapons.",
            statModifier: {
              stat: "melee_range",
              magnitude: 15,
              magnitudeType: "flat"
            }
          }
        ]
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
      tags: ["passive", "buff", "universal"]
    },

    // ==========================================
    // LEVEL 2 SPELLS
    // ==========================================
    { id : "warden_shadow_ambush",
      name: "Flayed Leap",
      description: "Leap from stealth, throwing rusted chains directly into the target. You cannot teleport -- you must physically travel through the air, risking opportunity attacks.",
      spellType: "ACTION",
      icon: "Piercing/Night Dagger",
      level: 2,
      specialization: "shadowblade",
      effectTypes: ["damage"],
      typeConfig: {
        school: "necrotic",
        icon: "Piercing/Night Dagger",
        tags: ["necrotic", "damage", "mobility", "shadowblade"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "melee",
        rangeDistance: 25,
        targetRestrictions: ["enemies"]
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 0,
        durationUnit: "rounds"
      },
      resourceCost: {
        actionPoints: 1,
        mana: 0,
        resourceTypes: ["tether_tension"],
        resourceValues: { tether_tension: 0 },
        classResource: { type: "tether_tension", cost: -2 }
      },
      resolution: "DICE",
      damageConfig: {
        formula: "2d8 + agility",
        damageTypes: ["necrotic"],
        resolution: "DICE"
      },
      specialMechanics: {
        physicalLeap: {
          description: "This is a physical jump through the air, not a teleport. Invites opportunity attacks."
        }
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },
      tags: ["necrotic", "damage", "mobility", "shadowblade"]
    },
    { id : "warden_relentless_pursuit",
      name: "Cruel Drag",
      description: "Manually lock your gears and reel in. Dash directly to your tethered target, slamming into them with a colossal shield/body check. If they are lighter than you, they are dragged 10 feet toward you instead.",
      spellType: "ACTION",
      icon: "Nature/Sense",
      level: 2,
      specialization: "vengeance-seeker",
      effectTypes: ["damage", "utility"],
      typeConfig: {
        school: "bludgeoning",
        icon: "Nature/Sense",
        tags: ["bludgeoning", "damage", "drag", "vengeance-seeker"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "melee",
        rangeDistance: 30,
        targetRestrictions: ["enemies"]
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 0,
        durationUnit: "rounds"
      },
      resourceCost: {
        resourceTypes: ["tether_tension"],
        resourceValues: { tether_tension: 2 },
        actionPoints: 1,
        classResource: { type: "tether_tension", cost: 2 }
      },
      resolution: "DICE",
      damageConfig: {
        formula: "2d6 + constitution",
        damageTypes: ["bludgeoning"],
        resolution: "DICE"
      },
      utilityConfig: {
        utilityType: "movement",
        selectedEffects: [
          { id : "chain_drag", name: "Chain Reel", description: "Dash directly to the tethered target." }
        ]
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
      tags: ["bludgeoning", "damage", "drag", "vengeance-seeker"]
    },
    { id : "warden_whirling_glaive",
      name: "Sweeping Chains",
      description: "Whirl your heavy chains in a sweeping 15-foot cone, crushing bone and slowing all targets caught in the metal tempest.",
      spellType: "ACTION",
      icon: "Piercing/Dagger Rain",
      level: 2,
      specialization: "universal",
      effectTypes: ["damage", "debuff"],
      typeConfig: {
        school: "bludgeoning",
        icon: "Piercing/Dagger Rain",
        tags: ["bludgeoning", "damage", "aoe", "slow", "universal"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "cone",
        rangeType: "melee",
        rangeDistance: 15,
        targetRestrictions: ["enemies"]
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 1,
        durationUnit: "rounds"
      },
      resourceCost: {
        resourceTypes: ["tether_tension"],
        resourceValues: { tether_tension: 3 },
        actionPoints: 1,
        classResource: { type: "tether_tension", cost: 3 }
      },
      resolution: "DICE",
      damageConfig: {
        formula: "2d6 + strength/2",
        damageTypes: ["bludgeoning"],
        resolution: "DICE"
      },
      debuffConfig: {
        debuffType: "movementImpairment",
        durationValue: 1,
        durationType: "rounds",
        durationUnit: "rounds",
        effects: [
          { id : "slowed_chains",
            name: "Entangled Slow",
            description: "Movement speed reduced by 15 feet by wrapping chains."
          }
        ],
        statPenalties: [
          { stat: "movement_speed", magnitude: -15, magnitudeType: "flat" }
        ]
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },
      tags: ["bludgeoning", "damage", "aoe", "slow", "universal"]
    },
    { id : "warden_hunters_resolve",
      name: "Penitent Resolve",
      description: "Dig the grafted spine hooks deeper, welcoming the pain to brace your armor. Gain 50% damage resistance and Armor. The benefits are doubled if the tethered target is within 15 feet, anchoring you completely.",
      spellType: "ACTION",
      icon: "Utility/Deflecting Shield",
      level: 2,
      specialization: "universal",
      effectTypes: ["buff"],
      typeConfig: {
        school: "physical",
        icon: "Utility/Deflecting Shield",
        tags: ["buff", "defense", "resistance", "universal"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
        targetRestrictions: ["self"]
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 2,
        durationUnit: "rounds"
      },
      resourceCost: {
        resourceTypes: ["tether_tension"],
        resourceValues: { tether_tension: 4 },
        actionPoints: 1,
        classResource: { type: "tether_tension", cost: 4 }
      },
      resolution: "AUTOMATIC",
      buffConfig: {
        buffType: "damageMitigation",
        durationValue: 2,
        durationType: "rounds",
        durationUnit: "rounds",
        effects: [
          { id : "penitent_resist",
            name: "Enduring Meat",
            description: "Gain 50% damage resistance and +4 Armor against all incoming physical damage.",
            statModifier: {
              stat: "armor",
              magnitude: 4,
              magnitudeType: "flat"
            }
          }
        ]
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
      tags: ["buff", "defense", "resistance", "universal"]
    },

    // ==========================================
    // LEVEL 3 SPELLS
    // ==========================================
    { id : "warden_cage_of_vengeance",
      name: "Iron Gaol",
      description: "Spend Tension to erupt spectral iron bars around your target, trapping them in a brutal cage. They physically cannot move out of the cage or benefit from teleportation. Caged targets take additional damage.",
      spellType: "ACTION",
      icon: "Necrotic/Crossed Bones",
      level: 3,
      specialization: "jailer",
      effectTypes: ["control", "debuff"],
      typeConfig: {
        school: "necrotic",
        icon: "Necrotic/Crossed Bones",
        tags: ["necrotic", "control", "cage", "jailer"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "melee",
        rangeDistance: 30,
        targetRestrictions: ["enemies"]
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds"
      },
      resourceCost: {
        resourceTypes: ["tether_tension"],
        resourceValues: { tether_tension: 6 },
        actionPoints: 1,
        classResource: { type: "tether_tension", cost: 6 }
      },
      resolution: "SAVE",
      debuffConfig: {
        debuffType: "statusEffect",
        durationValue: 3,
        durationType: "rounds",
        durationUnit: "rounds",
        savingThrow: {
          ability: "constitution",
          difficultyClass: 15,
          saveOutcome: "reduced_duration"
        },
        effects: [
          { id : "iron_caged",
            name: "Imprisoned in Steel",
            description: "Caged in rusted iron. Speed is 0, cannot teleport, and takes +1d6 damage from all sources.",
            statusType: "restrained",
            level: "strong"
          }
        ]
      },
      specialMechanics: {
        jailerReduction: {
          description: "Jailer specialization reduces the cost of this spell to 4 Tension."
        }
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },
      tags: ["necrotic", "control", "cage", "jailer"]
    },
    { id : "warden_hunters_fury",
      name: "Spined Torment",
      description: "A brutal, agonizing downward smash with your chains. If the target is tethered to you, the strike rips their joints, dealing devastating bludgeoning damage and tearing their muscles.",
      spellType: "ACTION",
      icon: "Slashing/Cross Slash",
      level: 3,
      specialization: "vengeance-seeker",
      effectTypes: ["damage"],
      typeConfig: {
        school: "bludgeoning",
        icon: "Slashing/Cross Slash",
        tags: ["bludgeoning", "damage", "tether-synergy", "vengeance-seeker"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "melee",
        rangeDistance: 15,
        targetRestrictions: ["enemies"]
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 0,
        durationUnit: "rounds"
      },
      resourceCost: {
        resourceTypes: ["tether_tension"],
        resourceValues: { tether_tension: 3 },
        actionPoints: 1,
        classResource: { type: "tether_tension", cost: 3 }
      },
      resolution: "DICE",
      damageConfig: {
        formula: "4d6 + strength",
        damageTypes: ["bludgeoning"],
        resolution: "DICE"
      },
      specialMechanics: {
        tetherBonus: {
          description: "Deals +2d6 bludgeoning damage if the target is tethered via Flesh Tether."
        }
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
      tags: ["bludgeoning", "damage", "tether-synergy", "vengeance-seeker"]
    },
    { id : "warden_spectral_strike",
      name: "Necrotic Piercing",
      description: "Phase your chains slightly into the shadow realm, driving them through armor and bone to deal direct necrotic damage to the target's internal organs.",
      spellType: "ACTION",
      icon: "Piercing/Night Dagger",
      level: 3,
      specialization: "universal",
      effectTypes: ["damage"],
      typeConfig: {
        school: "necrotic",
        icon: "Piercing/Night Dagger",
        tags: ["necrotic", "damage", "armor-piercing", "universal"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "melee",
        rangeDistance: 15,
        targetRestrictions: ["enemies"]
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 0,
        durationUnit: "rounds"
      },
      resourceCost: {
        resourceTypes: ["tether_tension"],
        resourceValues: { tether_tension: 2 },
        actionPoints: 1,
        classResource: { type: "tether_tension", cost: 2 }
      },
      resolution: "DICE",
      damageConfig: {
        formula: "3d8 + spirit",
        damageTypes: ["necrotic"],
        resolution: "DICE"
      },
      specialMechanics: {
        armorPiercing: {
          description: "This attack completely ignores the target's Armor value."
        }
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
      tags: ["necrotic", "damage", "armor-piercing", "universal"]
    },
    { id : "warden_cage_trap",
      name: "Spiked Chain Trap",
      description: "Lay a coiled, heavy chain trap in a small area. When an enemy steps into it, the trap springs violently, driving hooks into their legs and caging them.",
      spellType: "ACTION",
      icon: "Necrotic/Crossed Bones",
      level: 3,
      specialization: "jailer",
      effectTypes: ["control"],
      typeConfig: {
        school: "physical",
        icon: "Necrotic/Crossed Bones",
        tags: ["physical", "control", "trap", "jailer"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "melee",
        rangeDistance: 20,
        targetRestrictions: ["enemies"]
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 2,
        durationUnit: "rounds"
      },
      resourceCost: {
        resourceTypes: ["tether_tension"],
        resourceValues: { tether_tension: 4 },
        actionPoints: 1,
        classResource: { type: "tether_tension", cost: 4 }
      },
      resolution: "SAVE",
      controlConfig: {
        controlType: "incapacitation",
        duration: 2,
        durationUnit: "rounds",
        savingThrow: {
          ability: "agility",
          difficultyClass: 14
        },
        effects: [
          { id : "trapped_cage",
            name: "Spike-Bound",
            description: "Restrained by coiled spikes. Speed is 0."
          }
        ]
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },
      tags: ["physical", "control", "trap", "jailer"]
    },

    // ==========================================
    // LEVEL 4 SPELLS
    // ==========================================
    { id : "warden_chain_lightning",
      name: "Conductive Torment",
      description: "Send a massive kinetic shockwave through your chains, jumping to all caged or linked targets and shattering their bones.",
      spellType: "ACTION",
      icon: "Psychic/Mind Control",
      level: 4,
      specialization: "jailer",
      effectTypes: ["damage"],
      typeConfig: {
        school: "necrotic",
        icon: "Psychic/Mind Control",
        tags: ["necrotic", "damage", "chain", "jailer"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "chain",
        rangeType: "melee",
        rangeDistance: 30,
        targetRestrictions: ["enemies"]
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 0,
        durationUnit: "rounds"
      },
      resourceCost: {
        resourceTypes: ["tether_tension"],
        resourceValues: { tether_tension: 2 },
        actionPoints: 1,
        classResource: { type: "tether_tension", cost: 2 }
      },
      resolution: "DICE",
      damageConfig: {
        formula: "2d6 + spirit",
        damageTypes: ["necrotic"],
        resolution: "DICE"
      },
      propagation: {
        method: "chain",
        behavior: "bounce",
        count: 4,
        range: 15,
        decay: 0.8
      },
      specialMechanics: {
        conductiveBonus: {
          description: "Trapped or caged targets take an additional +1d6 necrotic damage."
        }
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
      tags: ["necrotic", "damage", "chain", "jailer"]
    },
    { id : "warden_vengeful_leap",
      name: "Vicious Reel",
      description: "Manually winch your arm-grafted spool. Launch yourself directly toward your tethered prey. This is a heavy, physical reel; you provoke opportunity attacks along the path.",
      spellType: "ACTION",
      icon: "Nature/Sense",
      level: 4,
      specialization: "vengeance-seeker",
      effectTypes: ["damage", "utility"],
      typeConfig: {
        school: "physical",
        icon: "Nature/Sense",
        tags: ["physical", "damage", "mobility", "vengeance-seeker"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "melee",
        rangeDistance: 40,
        targetRestrictions: ["enemies"]
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 0,
        durationUnit: "rounds"
      },
      resourceCost: {
        resourceTypes: ["tether_tension"],
        resourceValues: { tether_tension: 3 },
        actionPoints: 1,
        classResource: { type: "tether_tension", cost: 3 }
      },
      resolution: "DICE",
      damageConfig: {
        formula: "5d6 + agility",
        damageTypes: ["bludgeoning"],
        resolution: "DICE"
      },
      utilityConfig: {
        utilityType: "movement",
        selectedEffects: [
          { id : "chain_reel", name: "Chain Winch", description: "Leap directly to your tethered prey." }
        ]
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
      tags: ["physical", "damage", "mobility", "vengeance-seeker"]
    },

    // ==========================================
    // LEVEL 5 SPELLS
    // ==========================================
    { id : "warden_umbral_assault",
      name: "Flayed Shadow Assault",
      description: "Dissolve your physical form into a mist of blood and shadow, strike three separate targets with crushing lashings, and disappear back into silence.",
      spellType: "ACTION",
      icon: "Psychic/Mind Control",
      level: 5,
      specialization: "shadowblade",
      effectTypes: ["damage", "buff"],
      typeConfig: {
        school: "necrotic",
        icon: "Psychic/Mind Control",
        tags: ["necrotic", "damage", "stealth", "shadowblade"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "melee",
        rangeDistance: 20,
        targetRestrictions: ["enemies"]
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 1,
        durationUnit: "rounds"
      },
      resourceCost: {
        resourceTypes: ["tether_tension"],
        resourceValues: { tether_tension: 10 },
        actionPoints: 1,
        classResource: { type: "tether_tension", cost: 10 }
      },
      resolution: "DICE",
      damageConfig: {
        formula: "6d8 + agility",
        damageTypes: ["necrotic"],
        resolution: "DICE"
      },
      buffConfig: {
        buffType: "triggeredEffect",
        durationValue: 1,
        durationType: "rounds",
        durationUnit: "rounds",
        effects: [
          { id : "shadow_invis",
            name: "Umbral Veil",
            description: "Become completely invisible for 1 round."
          }
        ]
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 8 },
      tags: ["necrotic", "damage", "stealth", "shadowblade"]
    },
    { id : "warden_prison_of_eternity",
      name: "Coliseum of Iron",
      description: "Erupt a massive circular arena of heavy iron pillars in a 20-foot area, caging all enemies inside. Teleportation is blocked completely.",
      spellType: "ACTION",
      icon: "Necrotic/Necrotic Skull",
      level: 5,
      specialization: "jailer",
      effectTypes: ["control"],
      typeConfig: {
        school: "necrotic",
        icon: "Necrotic/Necrotic Skull",
        tags: ["necrotic", "control", "cage", "jailer"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "circle",
        rangeType: "melee",
        rangeDistance: 30,
        targetRestrictions: ["enemies"]
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 4,
        durationUnit: "rounds"
      },
      resourceCost: {
        resourceTypes: ["tether_tension"],
        resourceValues: { tether_tension: 10 },
        actionPoints: 1,
        classResource: { type: "tether_tension", cost: 10 }
      },
      resolution: "SAVE",
      controlConfig: {
        controlType: "zone",
        duration: 4,
        durationUnit: "rounds",
        savingThrow: {
          ability: "strength",
          difficultyClass: 16
        },
        effects: [
          { id : "coliseum_imprisoned",
            name: "Bound in Coliseum",
            description: "Trapped in the iron zone. Cannot escape."
          }
        ]
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 8 },
      tags: ["necrotic", "control", "cage", "jailer"]
    },
    { id : "warden_avatar_of_vengeance",
      name: "Flayed Ascendancy",
      description: "Unleash all tension to fuse your flesh with your rusted iron grafts. Your chains burst outward, forming a cage of spikes around your bones. For 6 rounds, gain Armor, massive damage, and reel in all tethered targets helplessly.",
      spellType: "ACTION",
      icon: "General/Fiery Rage",
      level: 5,
      specialization: "vengeance-seeker",
      effectTypes: ["buff"],
      typeConfig: {
        school: "necrotic",
        icon: "General/Fiery Rage",
        tags: ["necrotic", "buff", "transformation", "vengeance-seeker"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
        targetRestrictions: ["self"]
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 6,
        durationUnit: "rounds"
      },
      resourceCost: {
        resourceTypes: ["tether_tension"],
        resourceValues: { tether_tension: 10 },
        actionPoints: 1,
        classResource: { type: "tether_tension", cost: 10 }
      },
      resolution: "AUTOMATIC",
      buffConfig: {
        buffType: "triggeredEffect",
        durationValue: 6,
        durationType: "rounds",
        durationUnit: "rounds",
        effects: [
          { id : "flayed_transformation",
            name: "Ascendant Flesh",
            description: "Gain +4 Armor, +2d6 bludgeoning damage, and generate +1 Tension on hit.",
            statModifier: {
              stat: "armor",
              magnitude: 4,
              magnitudeType: "flat"
            }
          }
        ]
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 10 },
      tags: ["necrotic", "buff", "transformation", "vengeance-seeker"]
    },

    // ==========================================
    // LEVEL 6 SPELLS
    // ==========================================
    { id : "warden_glaive_storm",
      name: "Iron Storm",
      description: "Whirl your heavy chains in a furious tempest, hitting all enemies in a 20-foot cone multiple times with bone-shattering force.",
      spellType: "ACTION",
      icon: "Piercing/Dagger Rain",
      level: 6,
      specialization: "universal",
      effectTypes: ["damage"],
      typeConfig: {
        school: "bludgeoning",
        icon: "Piercing/Dagger Rain",
        tags: ["bludgeoning", "damage", "aoe", "universal"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "cone",
        rangeType: "melee",
        rangeDistance: 20,
        targetRestrictions: ["enemies"]
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 0,
        durationUnit: "rounds"
      },
      resourceCost: {
        resourceTypes: ["tether_tension"],
        resourceValues: { tether_tension: 5 },
        actionPoints: 2,
        classResource: { type: "tether_tension", cost: 5 }
      },
      resolution: "DICE",
      damageConfig: {
        formula: "8d6 + strength",
        damageTypes: ["bludgeoning"],
        resolution: "DICE"
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 4 },
      tags: ["bludgeoning", "damage", "aoe", "universal"]
    },
    { id : "warden_cage_slam",
      name: "Gaol Shatter",
      description: "Slam a caged target with your heavy steel chain-spool, dealing immense bludgeoning damage and shattering their resolve, which extends the cage's duration by 1 round.",
      spellType: "ACTION",
      icon: "Psychic/Mind Control",
      level: 6,
      specialization: "jailer",
      effectTypes: ["damage"],
      typeConfig: {
        school: "bludgeoning",
        icon: "Psychic/Mind Control",
        tags: ["bludgeoning", "damage", "cage-synergy", "jailer"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "melee",
        rangeDistance: 15,
        targetRestrictions: ["enemies"]
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 0,
        durationUnit: "rounds"
      },
      resourceCost: {
        resourceTypes: ["tether_tension"],
        resourceValues: { tether_tension: 4 },
        actionPoints: 1,
        classResource: { type: "tether_tension", cost: 4 }
      },
      resolution: "DICE",
      damageConfig: {
        formula: "6d10 + strength",
        damageTypes: ["bludgeoning"],
        resolution: "DICE"
      },
      specialMechanics: {
        cageExtend: {
          description: "If the target is currently caged or trapped, extend that duration by 1 round."
        }
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },
      tags: ["bludgeoning", "damage", "cage-synergy", "jailer"]
    },

    // ==========================================
    // LEVEL 7 SPELLS
    // ==========================================
    { id : "warden_mark_execution",
      name: "Reel and Execute",
      description: "Winch the gears to drag a heavily wounded tethered target (below 30% health) directly into your blade. Delivers a guaranteed critical strike.",
      spellType: "ACTION",
      icon: "Piercing/Targeted Strike",
      level: 7,
      specialization: "vengeance-seeker",
      effectTypes: ["damage"],
      typeConfig: {
        school: "slashing",
        icon: "Piercing/Targeted Strike",
        tags: ["slashing", "damage", "execute", "vengeance-seeker"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "melee",
        rangeDistance: 15,
        targetRestrictions: ["enemies"]
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 0,
        durationUnit: "rounds"
      },
      resourceCost: {
        resourceTypes: ["tether_tension"],
        resourceValues: { tether_tension: 7 },
        actionPoints: 2,
        classResource: { type: "tether_tension", cost: 7 }
      },
      resolution: "DICE",
      damageConfig: {
        formula: "8d10 + agility",
        damageTypes: ["slashing"],
        resolution: "DICE",
        criticalConfig: {
          enabled: true,
          critMultiplier: 2,
          critRange: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
        }
      },
      specialMechanics: {
        executionThreshold: {
          description: "Can only be cast on tethered targets below 30% health."
        }
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 5 },
      tags: ["slashing", "damage", "execute", "vengeance-seeker"]
    },
    { id : "warden_shadow_cage",
      name: "Grave-Iron Cage",
      description: "Summon a dense cage of shadow-infused graveyard iron. Restrains all targets in a 15-foot radius and blocks all forms of dimensional escape.",
      spellType: "ACTION",
      icon: "Necrotic/Necrotic Skull",
      level: 7,
      specialization: "jailer",
      effectTypes: ["control"],
      typeConfig: {
        school: "necrotic",
        icon: "Necrotic/Necrotic Skull",
        tags: ["necrotic", "control", "cage", "jailer"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "circle",
        rangeType: "melee",
        rangeDistance: 30,
        targetRestrictions: ["enemies"]
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds"
      },
      resourceCost: {
        resourceTypes: ["tether_tension"],
        resourceValues: { tether_tension: 6 },
        actionPoints: 2,
        classResource: { type: "tether_tension", cost: 6 }
      },
      resolution: "SAVE",
      controlConfig: {
        controlType: "zone",
        duration: 3,
        durationUnit: "rounds",
        savingThrow: {
          ability: "strength",
          difficultyClass: 16
        },
        effects: [
          { id : "grave_caged",
            name: "Grave Caged",
            description: "Restrained. Speed is 0 and teleportation blocked."
          }
        ]
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 6 },
      tags: ["necrotic", "control", "cage", "jailer"]
    },
    { id : "warden_hunters_wrath",
      name: "Torturer's Wrath",
      description: "Deliver a devastating series of flailing attacks against a single tethered target, grinding the rusted chains back and forth through their flesh.",
      spellType: "ACTION",
      icon: "Slashing/Cross Slash",
      level: 7,
      specialization: "universal",
      effectTypes: ["damage"],
      typeConfig: {
        school: "slashing",
        icon: "Slashing/Cross Slash",
        tags: ["slashing", "damage", "universal"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "melee",
        rangeDistance: 15,
        targetRestrictions: ["enemies"]
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 0,
        durationUnit: "rounds"
      },
      resourceCost: {
        resourceTypes: ["tether_tension"],
        resourceValues: { tether_tension: 5 },
        actionPoints: 2,
        classResource: { type: "tether_tension", cost: 5 }
      },
      resolution: "DICE",
      damageConfig: {
        formula: "10d6 + agility",
        damageTypes: ["slashing"],
        resolution: "DICE"
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 4 },
      tags: ["slashing", "damage", "universal"]
    },

    // ==========================================
    // LEVEL 8 SPELLS
    // ==========================================
    { id : "warden_vengeance_incarnate",
      name: "Ascendant Jailer",
      description: "Harness all pain. Gain colossal speed toward your tethered target, +3d8 damage, and automatically generate Tension whenever you are struck.",
      spellType: "ACTION",
      icon: "General/Fiery Rage",
      level: 8,
      specialization: "vengeance-seeker",
      effectTypes: ["buff"],
      typeConfig: {
        school: "necrotic",
        icon: "General/Fiery Rage",
        tags: ["necrotic", "buff", "transformation", "vengeance-seeker"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
        targetRestrictions: ["self"]
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 4,
        durationUnit: "rounds"
      },
      resourceCost: {
        resourceTypes: ["tether_tension"],
        resourceValues: { tether_tension: 8 },
        actionPoints: 2,
        classResource: { type: "tether_tension", cost: 8 }
      },
      resolution: "AUTOMATIC",
      buffConfig: {
        buffType: "statEnhancement",
        durationValue: 4,
        durationType: "rounds",
        durationUnit: "rounds",
        effects: [
          { id : "ascendant_jailer_buff",
            name: "Unstoppable Will",
            description: "+3d8 damage and massive armor.",
            statModifier: {
              stat: "armor",
              magnitude: 6,
              magnitudeType: "flat"
            }
          }
        ]
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 8 },
      tags: ["necrotic", "buff", "transformation", "vengeance-seeker"]
    },
    { id : "warden_eternal_cage",
      name: "Eternal Iron Tomb",
      description: "Summon a permanent prison of cursed dungeon iron. The target is locked in place indefinitely until the Warden chooses to dispel it or dies.",
      spellType: "ACTION",
      icon: "Necrotic/Necrotic Skull",
      level: 8,
      specialization: "jailer",
      effectTypes: ["control"],
      typeConfig: {
        school: "necrotic",
        icon: "Necrotic/Necrotic Skull",
        tags: ["necrotic", "control", "cage", "jailer"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "melee",
        rangeDistance: 30,
        targetRestrictions: ["enemies"]
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 99,
        durationUnit: "rounds"
      },
      resourceCost: {
        resourceTypes: ["tether_tension"],
        resourceValues: { tether_tension: 8 },
        actionPoints: 2,
        classResource: { type: "tether_tension", cost: 8 }
      },
      resolution: "SAVE",
      controlConfig: {
        controlType: "incapacitation",
        duration: 99,
        durationUnit: "rounds",
        savingThrow: {
          ability: "strength",
          difficultyClass: 18
        },
        effects: [
          { id : "eternal_imprisoned",
            name: "Eternal Tomb",
            description: "Restrained indefinitely. Speed is 0."
          }
        ]
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 10 },
      tags: ["necrotic", "control", "cage", "jailer"]
    },
    { id : "warden_relentless_assault",
      name: "Brutal Whipping",
      description: "Lash out repeatedly with heavy chains, building 1 Tether Tension with each hit as you tear your own flesh to pieces.",
      spellType: "ACTION",
      icon: "Bludgeoning/Mortal Strike",
      level: 8,
      specialization: "universal",
      effectTypes: ["damage"],
      typeConfig: {
        school: "bludgeoning",
        icon: "Bludgeoning/Mortal Strike",
        tags: ["bludgeoning", "damage", "universal"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "melee",
        rangeDistance: 15,
        targetRestrictions: ["enemies"]
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 0,
        durationUnit: "rounds"
      },
      resourceCost: {
        resourceTypes: ["tether_tension"],
        resourceValues: { tether_tension: 6 },
        actionPoints: 2,
        classResource: { type: "tether_tension", cost: 6 }
      },
      resolution: "DICE",
      damageConfig: {
        formula: "12d6 + strength",
        damageTypes: ["bludgeoning"],
        resolution: "DICE"
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 5 },
      tags: ["bludgeoning", "damage", "universal"]
    },

    // ==========================================
    // LEVEL 9 SPELLS
    // ==========================================
    { id : "warden_justice_strikes",
      name: "Penitent Judgment",
      description: "Deliver a crushing chain slam to your tethered prey, shattering their armor and causing massive internal bleeding.",
      spellType: "ACTION",
      icon: "Slashing/Cross Slash",
      level: 9,
      specialization: "vengeance-seeker",
      effectTypes: ["damage"],
      typeConfig: {
        school: "bludgeoning",
        icon: "Slashing/Cross Slash",
        tags: ["bludgeoning", "damage", "tether-synergy", "vengeance-seeker"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "melee",
        rangeDistance: 15,
        targetRestrictions: ["enemies"]
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 0,
        durationUnit: "rounds"
      },
      resourceCost: {
        resourceTypes: ["tether_tension"],
        resourceValues: { tether_tension: 8 },
        actionPoints: 2,
        classResource: { type: "tether_tension", cost: 8 }
      },
      resolution: "DICE",
      damageConfig: {
        formula: "15d6 + strength",
        damageTypes: ["bludgeoning"],
        resolution: "DICE"
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 6 },
      tags: ["bludgeoning", "damage", "tether-synergy", "vengeance-seeker"]
    },
    { id : "warden_cage_mastery",
      name: "Mass Imprisonment",
      description: "Erupt individual spectral iron cages around all enemies within 30 feet, shutting down the entire battlefield.",
      spellType: "ACTION",
      icon: "Necrotic/Crossed Bones",
      level: 9,
      specialization: "jailer",
      effectTypes: ["control"],
      typeConfig: {
        school: "necrotic",
        icon: "Necrotic/Crossed Bones",
        tags: ["necrotic", "control", "cage", "jailer"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "circle",
        rangeType: "melee",
        rangeDistance: 40,
        targetRestrictions: ["enemies"]
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 4,
        durationUnit: "rounds"
      },
      resourceCost: {
        resourceTypes: ["tether_tension"],
        resourceValues: { tether_tension: 9 },
        actionPoints: 2,
        classResource: { type: "tether_tension", cost: 9 }
      },
      resolution: "SAVE",
      controlConfig: {
        controlType: "incapacitation",
        duration: 4,
        durationUnit: "rounds",
        savingThrow: {
          ability: "strength",
          difficultyClass: 18
        },
        effects: [
          { id : "mass_caged",
            name: "Caged Individually",
            description: "Restrained inside an iron cage. Speed is 0."
          }
        ]
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 10 },
      tags: ["necrotic", "control", "cage", "jailer"]
    },
    { id : "warden_no_escape_strike",
      name: "Inescapable Shackle",
      description: "Lash the chains around the target's throat, severing their connection to dimensions. They cannot teleport, blink, or turn invisible.",
      spellType: "ACTION",
      icon: "Piercing/Night Dagger",
      level: 9,
      specialization: "shadowblade",
      effectTypes: ["damage", "debuff"],
      typeConfig: {
        school: "necrotic",
        icon: "Piercing/Night Dagger",
        tags: ["necrotic", "damage", "debuff", "shadowblade"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "melee",
        rangeDistance: 15,
        targetRestrictions: ["enemies"]
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds"
      },
      resourceCost: {
        resourceTypes: ["tether_tension"],
        resourceValues: { tether_tension: 7 },
        actionPoints: 2,
        classResource: { type: "tether_tension", cost: 7 }
      },
      resolution: "DICE",
      damageConfig: {
        formula: "16d6 + agility",
        damageTypes: ["necrotic"],
        resolution: "DICE"
      },
      debuffConfig: {
        debuffType: "statusEffect",
        durationValue: 3,
        durationType: "rounds",
        durationUnit: "rounds",
        effects: [
          { id : "shackle_blocked",
            name: "Dimension Shackled",
            description: "Teleportation and invisibility suppressed."
          }
        ]
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 5 },
      tags: ["necrotic", "damage", "debuff", "shadowblade"]
    },

    // ==========================================
    // LEVEL 10 SPELLS
    // ==========================================
    { id : "warden_ultimate_vengeance",
      name: "Cataclysm of Iron",
      description: "Release all Tether Tension in one final, cataclysmic flail. Shatter your chains to shreds, dealing colossal bludgeoning damage to all tethered and nearby enemies.",
      spellType: "ACTION",
      icon: "General/Fiery Rage",
      level: 10,
      specialization: "universal",
      effectTypes: ["damage"],
      typeConfig: {
        school: "bludgeoning",
        icon: "General/Fiery Rage",
        tags: ["bludgeoning", "damage", "ultimate", "universal"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "circle",
        rangeType: "melee",
        rangeDistance: 20,
        targetRestrictions: ["enemies"]
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 0,
        durationUnit: "rounds"
      },
      resourceCost: {
        resourceTypes: ["tether_tension"],
        resourceValues: { tether_tension: 10 },
        actionPoints: 3,
        classResource: { type: "tether_tension", cost: 10 }
      },
      resolution: "DICE",
      damageConfig: {
        formula: "15d10 + strength * 2",
        damageTypes: ["bludgeoning"],
        resolution: "DICE"
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 15 },
      tags: ["bludgeoning", "damage", "ultimate", "universal"]
    },
    { id : "warden_prison_realm",
      name: "Iron Prison Realm",
      description: "Banish all nearby enemies to a massive, spectral iron prison realm. Trapped targets are completely helpless and vulnerable to all forms of harm.",
      spellType: "ACTION",
      icon: "Necrotic/Necrotic Skull",
      level: 10,
      specialization: "jailer",
      effectTypes: ["control"],
      typeConfig: {
        school: "necrotic",
        icon: "Necrotic/Necrotic Skull",
        tags: ["necrotic", "control", "cage", "ultimate", "jailer"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "circle",
        rangeType: "melee",
        rangeDistance: 60,
        targetRestrictions: ["enemies"]
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 6,
        durationUnit: "rounds"
      },
      resourceCost: {
        resourceTypes: ["tether_tension"],
        resourceValues: { tether_tension: 10 },
        actionPoints: 3,
        classResource: { type: "tether_tension", cost: 10 }
      },
      resolution: "SAVE",
      controlConfig: {
        controlType: "zone",
        duration: 6,
        durationUnit: "rounds",
        savingThrow: {
          ability: "spirit",
          difficultyClass: 20
        },
        effects: [
          { id : "realm_imprisoned",
            name: "Prison Realm Bound",
            description: "Completely restrained and vulnerable to 2d10 additional damage."
          }
        ]
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 20 },
      tags: ["necrotic", "control", "cage", "ultimate", "jailer"]
    },
    { id : "warden_avatar_perfected",
      name: "Flayed Ascendancy Perfected",
      description: "Transform into a god-like engine of rusted steel. Your chains expand to cover the sky. Gain Armor, absolute CC immunity, and automatically shred all tethered targets.",
      spellType: "ACTION",
      icon: "General/Fiery Rage",
      level: 10,
      specialization: "vengeance-seeker",
      effectTypes: ["buff"],
      typeConfig: {
        school: "necrotic",
        icon: "General/Fiery Rage",
        tags: ["necrotic", "buff", "transformation", "ultimate", "vengeance-seeker"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
        targetRestrictions: ["self"]
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 8,
        durationUnit: "rounds"
      },
      resourceCost: {
        resourceTypes: ["tether_tension"],
        resourceValues: { tether_tension: 10 },
        actionPoints: 3,
        classResource: { type: "tether_tension", cost: 10 }
      },
      resolution: "AUTOMATIC",
      buffConfig: {
        buffType: "statEnhancement",
        durationValue: 8,
        durationType: "rounds",
        durationUnit: "rounds",
        effects: [
          { id : "perfected_jailer_buff",
            name: "Iron God",
            description: "Gain +6 Armor, CC immunity, 50% physical resistance, and shred all tethered targets.",
            statModifier: {
              stat: "armor",
              magnitude: 6,
              magnitudeType: "flat"
            }
          }
        ]
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 20 },
      tags: ["necrotic", "buff", "transformation", "ultimate", "vengeance-seeker"]
    }
  ]
};
