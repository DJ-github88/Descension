/**
 * Exorcist Class Data
 *
 * Ground-up, surgical overhaul of the Exorcist class.
 * Embraces a heavy, oppressive, blackened thall and symphonic deathcore aesthetic.
 * Magic is a mutilation; command is a desperate battle of wills.
 *
 * Complies strictly with Mythrill VTT SPELL_DATA_REFERENCE.md.
 * Eradicates D&D tropes (AC, Dexterity, Spell Slots, Bonus Actions).
 * Eradicates the 'holy' damage type, replacing it strictly with 'radiant'.
 * Scrubs all D&D skill checks (Arcana, Stealth, Religion, etc.) from spell data.
 * Places all schools inside typeConfig.
 * Removes all redundant elementType fields from damageConfig.
 */

export const EXORCIST_DATA = {
  id: "exorcist",
  name: "Exorcist",
  icon: "fas fa-cross",
  role: "Iron Inquisitor / Sin-Eater",
  damageTypes: ["radiant", "force", "necrotic"],

  overview: {
    title: "The Exorcist",
    subtitle: "Rusted Iron, Agonizing Salt, and the Barbed Leash of Demons",

    quickOverview: {
      title: "Quick Overview",
      content: `**What You Must Know**: The Exorcist is a grim, blue-collar tradesman of the occult. They do not cast clean, glowing divine magic; their tools are burning salt, rusted iron nails, and agonizing brands. They bind demons through grueling rituals and command them with a barbed leash called **Divine Dominance**, tracking their grip with a shifting Dominance Die. Every aggressive action or strike of pain degrades this leash. Let the die hit zero, and the demon breaks free, its red eyes turning upon you with murderous revenge.

**Core Mechanic**: Bind demons through ritual → Command them in battle → Dominance Die decreases with actions and damage → Cast painful disciplinary spells to regain control → Risk absolute rebellion if the leash snaps.

**Resource**: Divine Dominance (Dominance Dice: d12 down to d6 per bound demon, up to 4 demons simultaneously).

**Playstyle**: High-tension summoner and support-controller balancing devastating demonic violence against the constant risk of rebellion and the agony of self-inflicted wounds.

**Best For**: Players who crave high-risk pet micromanagement, tragic roleplay, and the visceral feel of a character who bleeds for every scrap of power they command.`,
    },

    description: `The Exorcist stands on the thin, bleeding edge between divine authority and heresy. They believe the most effective weapon against evil is the evil itself—chained, mutilated, and forced to claw at its own kin. It is a grueling, blue-collar trade of flesh and willpower. Where others pray for salvation, the Exorcist hammers rusted iron stakes into the earth and burns salt across open wounds. Their presence is a tragedy, a copper-smelling dirge that demands a toll of blood from all who seek their aid.`,

    roleplayIdentity: {
      title: "Roleplay Identity",
      content: `Exorcists are not priests of high cathedrals; they are the Iron Inquisitors and Sin-Eaters who clean the gutter of the supernatural. They carry the crushing, atmospheric weight of their calling: ritual scars from binding ceremonies, hands permanently blackened by sulfur, and eyes that flicker with a cold, radiant light. Bound demons manifest as heavy spectral chains and weeping shadow, constant reminders of the horror they keep on a leash.

Common Exorcist archetypes include:
- **The Iron Inquisitor**: Driven by an unyielding hatred of the supernatural, they use cold iron and holy fire to subjugate horrors.
- **The Sin-Eater**: A weary wanderer who absorbs the curses of others into their own flesh, paying the price of agony to keep the innocent clean.
- **The Chained General**: Binds multiple lesser fiends, split in attention, walking the razor's edge of a collective rebellion.
- **The Flesh Vessel**: Channels a demon internally, lock-stepping their sanity with a monster that wants to steer their bones.

Every ritual is a mutilation, and every victory is paid for in salt, iron, and blood. They do not seek heaven's approval, only the survival of the meat and bone they are bound to protect.`,
    },

    combatRole: {
      title: "Combat Role",
      content: `In the theater of war, the Exorcist is a brutal, high-impact specialist:

**The Purge Utility ('Why Bring Me?')**: You are the absolute authority on purging curses, demonic possessions, and paranormal crowd control (stun, paralyze, fear) from allies, and you completely devastate supernatural entities (Undead, Spirits, Aberrations). However, your purges are traumatizing, dealing physical damage to the ally to rip the magic out of their nerve endings.

**The Fatal Flaw (The 'Mortal Deficit')**: Because your entire arsenal is hyper-specialized against the supernatural (radiant damage, salt, iron), you are staggeringly ineffective against mundane, mortal threats (bandits, beasts, mercenaries). Against normal flesh and blood, your spells do fractionary damage, and your physical frailty leaves you highly vulnerable to basic kinetic, martial attacks.

**Agonizing Command**: Position your bound demons to block chokepoints and shred supernatural threats while carefully managing the fragile leash of your Dominance Die.`,
    },

    playstyle: {
      title: "Playstyle & Strategy",
      content: `Playing an Exorcist requires cold calculation and a high tolerance for operational friction. You are managing high-powered, volatile tools that will turn on you the moment you look away.

**Operational Friction**: Your spells are heavy and agonizing. Restoring your Dominance Die requires self-inflicted wounds and caster HP sacrifice. Purging an ally of a curse requires splitting their skin with salt and iron. You must accept that your allies will bleed to be saved.

**Mortal Deficit Tactics**: When facing mundane mortal soldiers, your damage is cut to a fraction. You must rely on your demons' raw physical strikes or pivot entirely to crowd control and ally purges. Stand far behind your armored companions—a single basic sword strike can easily shatter your frail frame.

**The Dominance Loop**: Command your demons while their die is large (d12/d10). As they degrade to d8 or d6 through action and damage, spend your own health to whip them back into submission. If they hit 0, pray your Agility or Spirit saves hold, or prepare to banish the very creature you spent minutes binding.`,
    },

    immersiveCombatExample: {
      title: "Combat Example: The Price of the Purge",
      content: `**The Setup**: Your party is ambushed in a lightless tomb by a towering Wraith and three mundane skeletal archers. Your ally, the Paladin, is struck by a paralyzing death curse, frozen in terror. Your bound Shadow Hound is at d8 Dominance. You are already bleeding from your previous ritual.

**Turn 1 - Ripping the Curse (Why Bring Me?)**
*The Paladin stands paralyzed, eyes wide as necrotic veins crawl up his neck. You step forward, ignoring the arrows whistling by your head. You reach into your pouch, pull out a handful of coarse rock salt, and slam it directly into the Paladin's neck.*
* **Your Action**: Cast "Purge the Defiled" on the Paladin (1 AP, 6 mana).
* **The Toll**: The Paladin takes 1d8 physical damage (6 damage) as your salt burns his flesh.
* **The Purge**: The paralyzing death curse is instantly ripped out, dissolving into black smoke. The Paladin gasps, freed from the CC.

**Turn 2 - The Hound Lunges (Dominance Cost: d8 -> d6)**
*You point a scarred finger at the Wraith. The Shadow Hound roars, shadow-wreathed jaws clamping onto the Wraith's incorporeal flank.*
* **Your Action**: Command Shadow Hound to attack (1 AP).
* **The Strike**: 3d6 + 4 radiant damage = 14 damage. The Wraith shudders in agony.
* **The Cost**: The Shadow Hound's Dominance Die degrades from d8 to d6. You feel the spectral chain strain against your wrists as the hound's eyes turn back to lock onto your throat.

**Turn 3 - Agonizing Discipline (Hound DD: d6 -> d10)**
*You cannot let the leash slip any further. You take your ritual iron nail and slice it across your own palm, letting your own blood drip onto the spectral chains.*
* **Your Action**: Cast "Shackles of Searing Iron" on the Shadow Hound (1 AP, 5 mana).
* **The Sacrifice**: You take 1d6 caster HP damage (4 HP lost).
* **The Recovery**: The spectral chains flare with blinding radiant wire, searing the hound back into absolute obedience. The hound's DD is restored from d6 back to d10.

**The Lesson**: You saved the Paladin, devastated the Wraith, and secured your hound, but your own palms are shredded and your blood stains the stone. Every choice is a transaction of flesh.`,
    },
  },

  resourceSystem: {
    title: "Divine Dominance",
    subtitle: "The Barbed Leash of Sacred Terror",

    description: `The Exorcist does not request power; they command it. Through grueling binding rituals, you lash demonic entities to your will. This volatile relationship is tracked by the **Dominance Die**—a shifting resource that measures how tightly your divine authority holds the darkness. As your demons act or suffer damage, the chains weaken, and you must re-assert control through agonizing discipline or face a hostile rebellion.`,

    cards: [
      {
        title: "Dominance Dice (DD)",
        stats: "d12 down to d6",
        details: "Each bound demon has its own die representing your current grip. d12 is total submission; d6 is a hair-trigger rebellion.",
      },
      {
        title: "The Purge Toll",
        stats: "Agonizing Cleansing",
        details: "You possess absolute authority to rip curses and crowd control from allies, but they suffer physical damage as the magic is torn out.",
      },
      {
        title: "The Rebellion Save",
        stats: "Triggered at 0 DD",
        details: "If a die reaches 0, the demon makes a saving throw to break free. Failure means it turns fully hostile or flees.",
      },
    ],

    generationTable: {
      headers: ["Trigger", "Dominance Change", "Notes"],
      rows: [
        ["Successful Binding", "→ Starting Die", "Set by demon tier (Imp = d12, Shadow Hound = d10, Brute = d8)"],
        ["Standard Command", "-1 Step", "Simple attacks or movement"],
        ["Demon Takes Damage", "-1 Step", "Pain fuels their resistance against your chains"],
        ["Special Ability", "-2 Steps", "High-power demonic maneuvers"],
        ["Scourge of Submission", "+1 Step", "Quick corrective discipline (costs 1d4 caster HP)"],
        ["Shackles of Searing Iron", "+2 Steps", "Reinforcing the sacred bonds (costs 1d6 caster HP)"],
        ["Iron Yoke of Calamity", "→ Reset to Max", "Total divine reset (costs 2d8 caster HP and -3 Max HP)"],
      ],
    },

    usage: {
      momentum: "Command demons early and aggressively while their DD is high. As they dip into d8 and d6, shift your focus to self-sacrificing restoration or prepare to dismiss them.",
      flourish: "⚠️ Tactical Release: If a demon is at d6 and you lack the HP or mana for restoration, use your Action to 'Dismiss' it safely. It is better to lose a servant than to gain a new enemy.",
    },

    overheatRules: {
      title: "The Breaking Point",
      content: `When a demon's Dominance Die reaches 0, the divine chains shatter. The demon immediately makes a **Rebellion Save** (DC varies by demon type).

**The Result**:
- **Success**: The demon remains bound but stays at d6 DD. It is shaken but not free.
- **Failure**: The demon escapes. Roll 1d6:
  - **1-2**: Flees the battlefield.
  - **3-4**: Attacks you once, then flees.
  - **5-6**: Turns fully hostile—attacking you and your allies until destroyed.

Never leave a demon at 0 DD at the end of your turn unless you are prepared to fight it next.`,
    },

    strategicConsiderations: {
      title: "The Mortal Deficit & The Occult Trade",
      content: `**The Supernatural Specialization**: Your radiant salt and rusted iron deal massive damage to Undead, Spirits, and Aberrations, but against normal mortals, your magic suffers a massive damage penalty. You must rely on your summons' physical claws or support your allies.

**The Frailty Clause**: Your flesh is weak to mundane metal. Any kinetic or martial attack from normal enemies deals double damage to you. Stay behind your allies and let your summons take the blows.`,
    },

    playingInPerson: {
      title: "Playing in Person",
      subtitle: "The Leash Dice",
      content: `Tracking multiple dice sizes can be a nightmare on paper. Use these physical hacks:

- **The Leash Dice**: Place the actual die on the demon's card. When you command them, physically swap the die for the next size down (d12 → d10). This provides an immediate visual of which 'leash' is the shortest.
- **The AP Coin**: Use a coin to track if you've already commanded a specific demon this turn. Flip it once they've acted.
- **Restoration Tokens**: Use rusted iron nails or red glass beads to represent your restoration spells, reminding you of the physical toll.`,
    },
  },

  specializations: {
    title: "Tragic Specializations",
    subtitle: "Three Paths of Barbed Dominion",

    description: `Every Exorcist binds demons through divine authority — but how they weld that authority defines their path. Three specializations offer radically different relationships with the darkness they command.`,

    specs: [
      {
        id: "demonologist",
        name: "Demonologist",
        icon: "Necrotic/Demonic Empowerment",
        color: "#8B0000",
        theme: "Multiple Demon Control",
        description: "Demonologists are legion commanders — general tradesmen who split their willpower across multiple bound demons, sacrificing individual power for overwhelming numbers. Where others bind one demon, the Demonologist binds four, turning the battlefield into a zoo of chained horrors.",
        playstyle: "Summoner swarm — multiple demons, overwhelming action economy, constant DD juggling",
        strengths: [
          "Can bind up to 4 demons simultaneously",
          "Reduced Dominance restoration spell costs (-2 mana)",
          "Swarm bonus damage when multiple demons attack the same target",
        ],
        weaknesses: [
          "Individual demons are weaker than other specs",
          "Cannot bind Tier 4 (Greater) demons",
          "Managing 4 Dominance Dice simultaneously is demanding",
        ],
      },
      {
        id: "demon_lord",
        name: "Demon Lord",
        icon: "Utility/Resistance",
        color: "#4B0082",
        theme: "Single Powerful Demon & Covenant Focus",
        description: "Demon Lords forge an unbreakable bond with a single demon — a covenant of mutual destruction. They channel demonic power into both their bound servant and themselves, becoming something greater than either alone. Their singular focus means no backup plan: if the demon falls, the Exorcist stands alone.",
        playstyle: "One devastating demon + self buffs — high risk, highest single-target reward, master-servant symbiosis",
        strengths: [
          "Can bind Tier 4 Greater Demons (most powerful)",
          "Bound demon has +2 to all stats, DD degrades every 2 actions",
          "Demon deals +2d8 bonus damage when at d6 DD or lower",
        ],
        weaknesses: [
          "Can only bind 1 demon at a time",
          "All eggs in one basket — no backup if the demon escapes or dies",
          "Greater Demons start at d6 DD (hardest to control)",
        ],
      },
      {
        id: "possessed",
        name: "Possessed",
        icon: "Psychic/Mind Control",
        color: "#9400D3",
        theme: "Internal Demon Channeling",
        description: "The Possessed don't bind demons into the world — they invite them in. By channeling demonic essence directly into their own flesh, they gain supernatural physical power at the cost of constant internal warfare. Their Dominance Die doesn't track a pet's obedience — it tracks who's driving the body.",
        playstyle: "Hybrid melee/caster — self-buffs, demonic transformations, internal DD tracking self-control",
        strengths: [
          "Gain demonic physical enhancements (+2 Strength, +2 Constitution, +10 speed)",
          "Melee attacks deal additional 1d8 necrotic damage",
          "No external demons to manage or position",
        ],
        weaknesses: [
          "Cannot summon external demons at all",
          "Internal DD failure = demon takes control of your body for 1 turn",
          "Self-harm risk: 3d6 psychic damage when Internal DD hits 0",
        ],
      },
    ],
  },

  exampleSpells: [
    // ============================================================
    // LEVEL 1 SPELLS
    // ============================================================
    {
      id: "exo_purge_the_defiled",
      name: "Purge the Defiled",
      description: "You grab your ally and scream a tragic dirge, pressing raw rock salt directly into their flesh. The agony is immediate and severe, but the foreign magic is violently ripped from their nervous system, leaving them clean but scarred.",
      level: 1,
      spellType: "ACTION",
      icon: "Radiant/Radiant Golden Shield",
      effectTypes: ["damage", "utility"],
      typeConfig: {
        school: "radiant",
        icon: "Radiant/Radiant Golden Shield",
        tags: ["purification", "dispel", "utility", "Why Bring Me?"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "touch",
        rangeDistance: 5,
        targetRestrictions: ["allies"]
      },
      resourceCost: {
        actionPoints: 1,
        mana: 6
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 1
      },
      damageConfig: {
        formula: "1d8",
        damageTypes: ["bludgeoning"],
        resolution: "DICE"
      },
      utilityConfig: {
        utilityType: "protection",
        selectedEffects: [
          {
            id: "purge_debuffs",
            name: "Violent Purge",
            description: "Instantly removes all Curses, Possessions, and mental Crowd Control (paralyzed, stunned, feared) from the target ally."
          }
        ]
      },
      resolution: "DICE",
      tags: ["purification", "dispel", "utility", "Why Bring Me?"],
      flavorText: "The salt does not soothe; it burns until the heresy is purged."
    },
    {
      id: "exo_salt_brand",
      name: "Brand of Burning Salt",
      description: "You press a red-hot iron brand of coarse salt into the enemy's skin. The radiant heat burns deep into their spirit. Against supernatural horrors, it hollows out their defenses, leaving them intensely vulnerable. Against normal mortals, the brand fails to find purchase, leaving only a superficial scrape.",
      level: 1,
      spellType: "ACTION",
      icon: "Radiant/Divine Downward Sword",
      effectTypes: ["damage", "debuff"],
      typeConfig: {
        school: "radiant",
        icon: "Radiant/Divine Downward Sword",
        tags: ["damage", "debuff", "brand", "Mortal Deficit"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
        targetRestrictions: ["enemies"]
      },
      resourceCost: {
        actionPoints: 1,
        mana: 5
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 0
      },
      damageConfig: {
        formula: "2d6 + spirit",
        damageTypes: ["radiant"],
        resolution: "DICE"
      },
      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          {
            id: "radiant_vulnerability",
            name: "Salt Withered",
            description: "If target is Undead, Spirit, or Aberration, they gain +50% damage vulnerability to all damage for 2 rounds. Against Mortals, this spell deals 1/4 damage.",
            mechanicsText: "Precise vulnerability modifier applied to supernatural types.",
            statusEffect: {
              vulnerabilityType: "radiant",
              vulnerabilityPercent: 50
            }
          }
        ],
        savingThrow: {
          ability: "spirit",
          difficultyClass: 13,
          saveOutcome: "negates"
        },
        durationType: "rounds",
        durationValue: 2,
        durationUnit: "rounds"
      },
      resolution: "DICE",
      tags: ["damage", "debuff", "brand", "Mortal Deficit"],
      flavorText: "Agony is a universal key, but some locks are made of mundane meat."
    },
    {
      id: "exo_scourge_of_submission",
      name: "Scourge of Submission",
      description: "You whip your bound demon with spectral, radiant barbed wire, or slice your own palm open to reinforce your authority. It flinches, its rebellious will broken, restoring its Dominance Die by 1 step.",
      level: 1,
      spellType: "ACTION",
      icon: "Radiant/Radiant Divinity",
      effectTypes: ["damage", "utility"],
      typeConfig: {
        school: "radiant",
        icon: "Radiant/Radiant Divinity",
        tags: ["dominance", "restoration", "discipline"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: ["bound_demon_or_self"]
      },
      resourceCost: {
        actionPoints: 1,
        mana: 3,
        resourceTypes: ["health"],
        resourceValues: {},
        useFormulas: { health: true },
        resourceFormulas: { health: "1d4" }
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 0
      },
      damageConfig: {
        formula: "1d6",
        damageTypes: ["radiant"],
        resolution: "DICE"
      },
      utilityConfig: {
        utilityType: "fate_manipulation",
        selectedEffects: [
          {
            id: "restore_dd_1",
            name: "Dominance Restored",
            description: "Restores the target demon's Dominance Die by 1 step (e.g. d6 -> d8, 0 -> d6)."
          }
        ]
      },
      resolution: "DICE",
      tags: ["dominance", "restoration", "discipline"],
      flavorText: "A crack of radiant metal. The fiend whines. The leash holds."
    },
    {
      id: "exo_cinder_leash",
      name: "Command: Cinder Leash",
      description: "You yank the leash, sending a pulse of searing radiant energy through the chains. Your bound demon lunges forward, executing a basic attack wreathed in ash and flame.",
      level: 1,
      spellType: "ACTION",
      icon: "Fire/Flame Burst",
      effectTypes: ["damage"],
      typeConfig: {
        school: "radiant",
        icon: "Fire/Flame Burst",
        tags: ["command", "damage"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: ["enemies"]
      },
      resourceCost: {
        actionPoints: 1,
        mana: 2
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 0
      },
      damageConfig: {
        formula: "1d6 + spirit",
        damageTypes: ["radiant"],
        resolution: "DICE"
      },
      resolution: "DICE",
      tags: ["command", "damage"],
      flavorText: "Bite when I command, or burn when I pull."
    },
    {
      id: "exo_iron_barrier",
      name: "Zone of Rusted Nails",
      description: "You drive four rusted iron nails blessed in salt water into the soil around you. A cold, protective circle forms, repelling the supernatural and reinforcing the physical resolve of all allies within the zone.",
      level: 1,
      spellType: "ACTION",
      icon: "Force/Force Field",
      effectTypes: ["buff"],
      typeConfig: {
        school: "radiant",
        icon: "Force/Force Field",
        tags: ["buff", "zone", "protection"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        areaShape: "circle",
        areaSize: 15,
        targetRestrictions: ["allies"]
      },
      resourceCost: {
        actionPoints: 1,
        mana: 4
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 2
      },
      buffConfig: {
        buffType: "damageMitigation",
        effects: [
          {
            id: "iron_protection",
            name: "Rusted Resolve",
            description: "Grants +2 Armor and halves any psychic damage taken while standing in the circle.",
            mechanicsText: "+2 Armor, 50% psychic resistance.",
            statModifier: {
              stat: "armor",
              magnitude: 2,
              magnitudeType: "flat"
            }
          }
        ],
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds"
      },
      resolution: "AUTOMATIC",
      tags: ["buff", "zone", "protection"],
      flavorText: "Cold iron and bitter salt. A boundary the unholy cannot breathe within."
    },
    {
      id: "exo_spectral_dread",
      name: "Passive: Spectral Dread",
      description: "Your flesh is permanently thinned by the spirits tearing at your collar. While you devastate the supernatural, the mundane blade cuts deep. Any kinetic or martial weapon attack from normal mortal enemies deals double damage to you.",
      level: 1,
      spellType: "PASSIVE",
      icon: "Psychic/Mental Chaos",
      effectTypes: ["debuff"],
      typeConfig: {
        school: "necrotic",
        icon: "Psychic/Mental Chaos",
        tags: ["passive", "weakness", "Mortal Deficit"],
        castTime: 0,
        castTimeType: "PASSIVE"
      },
      targetingConfig: {
        targetingType: "self"
      },
      resourceCost: {
        actionPoints: 0,
        mana: 0
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 0
      },
      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          {
            id: "mortal_deficit_vulnerabilitiy",
            name: "Mortal Deficit",
            description: "Caster takes 100% increased damage from non-magical, mundane physical and martial attacks.",
            mechanicsText: "Double physical damage from mundane sources.",
            statusEffect: {
              vulnerabilityType: "physical",
              vulnerabilityPercent: 100
            }
          }
        ]
      },
      resolution: "AUTOMATIC",
      tags: ["passive", "weakness", "Mortal Deficit"],
      flavorText: "Chaining the abyss leaves no armor for the stones of the earth."
    },

    // ============================================================
    // LEVEL 2 SPELLS
    // ============================================================
    {
      id: "exo_bind_imp",
      name: "Ritual: Bind Imp",
      description: "A grueling ritual binding a minor, cowering fire-imp to your service. Requires purified lava, ash from a burnt holy text, and a gemstone. The Imp starts with a d12 Dominance Die.",
      level: 2,
      spellType: "ACTION",
      icon: "Fire/Flame Burst",
      effectTypes: ["summoning"],
      typeConfig: {
        school: "necrotic",
        icon: "Fire/Flame Burst",
        tags: ["summoning", "binding", "imp"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "self",
        areaShape: "circle",
        areaSize: 5
      },
      resourceCost: {
        actionPoints: 2,
        mana: 15
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 4
      },
      summoningConfig: {
        summonType: "permanent",
        creatureName: "Fire Imp",
        creatureType: "fiend",
        quantity: 1,
        statsFormula: "2d6 + 4",
        attackFormula: "1d6 + 2",
        duration: 0,
        durationUnit: "permanent",
        commandable: true,
        actionsPerTurn: 1,
        abilities: ["Searing Bolt", "Agile Flight"]
      },
      resolution: "AUTOMATIC",
      tags: ["summoning", "binding", "imp"],
      flavorText: "It whimpers and spits sparks, but the iron collar locks tight."
    },
    {
      id: "exo_shackles_of_searing_iron",
      name: "Shackles of Searing Iron",
      description: "You pull an agonizing chain of rusted iron and salt out of your own open veins, wrapping it around a bound demon. Restores its Dominance Die by 2 steps, but the backlash cuts deep into your own chest.",
      level: 2,
      spellType: "ACTION",
      icon: "Radiant/Divine Halo",
      effectTypes: ["damage", "utility"],
      typeConfig: {
        school: "radiant",
        icon: "Radiant/Divine Halo",
        tags: ["dominance", "restoration", "shackles"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: ["bound_demon_or_self"]
      },
      resourceCost: {
        actionPoints: 1,
        mana: 5,
        resourceTypes: ["health"],
        resourceValues: {},
        useFormulas: { health: true },
        resourceFormulas: { health: "1d6" }
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 0
      },
      damageConfig: {
        formula: "2d6",
        damageTypes: ["radiant"],
        resolution: "DICE"
      },
      utilityConfig: {
        utilityType: "fate_manipulation",
        selectedEffects: [
          {
            id: "restore_dd_2",
            name: "Dominance Restored",
            description: "Restores target demon's Dominance Die by 2 steps (e.g. d6 -> d10)."
          }
        ]
      },
      resolution: "DICE",
      tags: ["dominance", "restoration", "shackles"],
      flavorText: "Golden, brine-soaked chains drag the demon down. It screams; you bleed."
    },
    {
      id: "exo_agonizing_possession",
      name: "Agonizing Possession",
      description: "For the Possessed: Invite the fire-imp into your own marrow. Your skin blackens and cracks as embers glow beneath your veins, turning your hands into molten talons. Your melee attacks deal bonus fire and radiant damage, but you burn from within.",
      level: 2,
      spellType: "ACTION",
      icon: "Fire/Flame Burst",
      effectTypes: ["buff", "damage"],
      typeConfig: {
        school: "radiant",
        icon: "Fire/Flame Burst",
        tags: ["possessed", "buff", "transformation"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "self"
      },
      resourceCost: {
        actionPoints: 1,
        mana: 6,
        resourceTypes: ["health"],
        resourceValues: {},
        useFormulas: { health: true },
        resourceFormulas: { health: "1d6" }
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 3
      },
      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          {
            id: "molten_claws",
            name: "Cinder Talons",
            description: "Melee attacks deal +1d6 fire and +1d6 radiant damage. Agility is increased by 2. Lasts 3 rounds.",
            mechanicsText: "+1d6 fire/radiant, +2 Agility.",
            statModifier: {
              stat: "agility",
              magnitude: 2,
              magnitudeType: "flat"
            }
          }
        ],
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds"
      },
      damageConfig: {
        formula: "1d4",
        damageTypes: ["radiant"],
        resolution: "DICE"
      },
      resolution: "DICE",
      tags: ["possessed", "buff", "transformation"],
      flavorText: "My lungs are ash. My heart is a coal. Let them burn."
    },

    // ============================================================
    // LEVEL 3 SPELLS
    // ============================================================
    {
      id: "exo_iron_nail_smite",
      name: "Smite of Rusted Iron",
      description: "You launch three rusted, salt-crusted iron nails from your hand. They drive deep into the target's spirit. Against supernatural horrors (Undead/Spirits/Aberrations), the cold iron shatters their essence, dealing triple damage. Against mortal enemies, the nails deal only a fraction of their force.",
      level: 3,
      spellType: "ACTION",
      icon: "Radiant/Radiant Divinity",
      effectTypes: ["damage"],
      typeConfig: {
        school: "radiant",
        icon: "Radiant/Radiant Divinity",
        tags: ["damage", "smite", "Mortal Deficit"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: ["enemies"]
      },
      resourceCost: {
        actionPoints: 1,
        mana: 8
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 0
      },
      damageConfig: {
        formula: "3d8",
        damageTypes: ["radiant"],
        resolution: "DICE",
        savingThrow: {
          ability: "spirit",
          difficultyClass: 14,
          saveOutcome: "half_damage"
        },
        conditionalDamage: {
          enabled: true,
          conditions: [
            {
              targetType: "creature_type",
              creatureTypes: ["fiend", "undead", "spirit", "aberration"],
              bonusFormula: "6d8",
              description: "Deals triple damage (additional +6d8) to supernatural threats. Against Mortals, damage is reduced by 75%."
            }
          ]
        }
      },
      resolution: "DICE",
      tags: ["damage", "smite", "Mortal Deficit"],
      flavorText: "Cold iron splits the ghost. Mortals only feel the scratch of rust."
    },
    {
      id: "exo_iron_yoke_of_calamity",
      name: "Iron Yoke of Calamity",
      description: "An absolute, terrifying assertion of your authority. You force a massive, crushing collar of cold iron onto your demon's neck. Instantly resets its Dominance Die to maximum size. The extreme effort permanently drains your vitality until you next rest.",
      level: 3,
      spellType: "ACTION",
      icon: "Force/Force Field",
      effectTypes: ["damage", "utility"],
      typeConfig: {
        school: "radiant",
        icon: "Force/Force Field",
        tags: ["dominance", "ultimate_restoration", "mutilation"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
        targetRestrictions: ["bound_demon_or_self"]
      },
      resourceCost: {
        actionPoints: 2,
        mana: 10,
        resourceTypes: ["health"],
        resourceValues: {},
        useFormulas: { health: true },
        resourceFormulas: { health: "2d8" }
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 5
      },
      damageConfig: {
        formula: "3d6",
        damageTypes: ["radiant"],
        resolution: "DICE"
      },
      utilityConfig: {
        utilityType: "restoration",
        selectedEffects: [
          {
            id: "absolute_dominance_reset",
            name: "Absolute Dominion",
            description: "Resets the target's Dominance Die to its absolute maximum size. Reduces the caster's Max HP by 3 until their next long rest."
          }
        ]
      },
      resolution: "DICE",
      tags: ["dominance", "ultimate_restoration", "mutilation"],
      flavorText: "Kneel. Suffer. Obey. There is no other path for either of us."
    },
    {
      id: "exo_empower_covenant",
      name: "Empower Covenant",
      description: "You cut your forearm, spraying hot blood onto your bound demon. It drinks the offering, growing larger and more savage. The demon gains massive combat bonuses, but your vitality is depleted.",
      level: 3,
      spellType: "ACTION",
      icon: "Necrotic/Ritual of Blood",
      effectTypes: ["damage", "buff"],
      typeConfig: {
        school: "necrotic",
        icon: "Necrotic/Ritual of Blood",
        tags: ["buff", "demon_buff", "blood"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
        targetRestrictions: ["bound_demon_or_self"]
      },
      resourceCost: {
        actionPoints: 1,
        mana: 6,
        resourceTypes: ["health"],
        resourceValues: {},
        useFormulas: { health: true },
        resourceFormulas: { health: "2d6" }
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 3
      },
      damageConfig: {
        formula: "2d6",
        damageTypes: ["necrotic"],
        resolution: "DICE"
      },
      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          {
            id: "demonic_ferocity",
            name: "Blooded Ferocity",
            description: "Demon gains +3 to all attack rolls and its Agility is increased by 3 for 3 rounds.",
            mechanicsText: "+3 attacks, +3 Agility.",
            statModifier: {
              stat: "agility",
              magnitude: 3,
              magnitudeType: "flat"
            }
          }
        ],
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds"
      },
      resolution: "DICE",
      tags: ["buff", "demon_buff", "blood"],
      flavorText: "Drink of my ruin, and tear them to shreds."
    },

    // ============================================================
    // LEVEL 4 SPELLS
    // ============================================================
    {
      id: "exo_bind_shadow_hound",
      name: "Ritual: Bind Shadow Hound",
      description: "A dark ceremony to bind a feral Shadow Hound. Requires nightshade essence, a shadowy cloak, and a mirror. The hound starts with a d10 Dominance Die and attacks with shadow and bite.",
      level: 4,
      spellType: "ACTION",
      icon: "Necrotic/Ghostly Menace",
      effectTypes: ["summoning"],
      typeConfig: {
        school: "necrotic",
        icon: "Necrotic/Ghostly Menace",
        tags: ["summoning", "binding", "hound"],
        castTime: 2,
        castTimeType: "MINUTES",
        ritual: true
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "self",
        areaShape: "circle",
        areaSize: 5
      },
      resourceCost: {
        actionPoints: 2,
        mana: 25
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 5
      },
      summoningConfig: {
        summonType: "permanent",
        creatureName: "Shadow Hound",
        creatureType: "fiend",
        quantity: 1,
        statsFormula: "3d6 + 8",
        attackFormula: "2d6 + 3",
        duration: 0,
        durationUnit: "permanent",
        commandable: true,
        actionsPerTurn: 1,
        abilities: ["Shadow Bite", "Flickering Step"]
      },
      resolution: "AUTOMATIC",
      tags: ["summoning", "binding", "hound"],
      flavorText: "Out of the darkness, a snarling jaw. The leash snaps tight."
    },
    {
      id: "exo_severe_chains",
      name: "Severe Chains",
      description: "You summon agonizing spectral chains that wrap around a target, binding them to the spot. If the target is a fiend, spirit, or undead, the radiant salt on the chains eats into their marrow, dealing radiant damage over time.",
      level: 4,
      spellType: "ACTION",
      icon: "Force/Force Field",
      effectTypes: ["control", "damage"],
      typeConfig: {
        school: "radiant",
        icon: "Force/Force Field",
        tags: ["control", "paralyze", "damage"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 40,
        targetRestrictions: ["enemies"]
      },
      resourceCost: {
        actionPoints: 2,
        mana: 10
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 3
      },
      controlConfig: {
        controlType: "incapacitation",
        effects: [
          {
            id: "paralyzed_chains",
            name: "Severely Chained",
            description: "Target is Paralyzed for 2 rounds. Constitution save DC 15 to negate."
          }
        ],
        savingThrow: {
          ability: "constitution",
          difficultyClass: 15
        },
        duration: 2,
        durationUnit: "rounds"
      },
      damageConfig: {
        formula: "2d6",
        damageTypes: ["radiant"],
        resolution: "DICE",
        dotConfig: {
          enabled: true,
          damagePerTick: "2d6",
          damageType: "radiant",
          tickFrequency: "round",
          duration: 2,
          canStack: false,
          maxStacks: 1
        }
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 2,
        durationUnit: "rounds"
      },
      resolution: "DICE",
      tags: ["control", "paralyze", "damage"],
      flavorText: "The iron sinks deep. The spirit cannot run."
    },

    // ============================================================
    // LEVEL 5 SPELLS
    // ============================================================
    {
      id: "exo_bind_wraith",
      name: "Ritual: Bind Wraith",
      description: "A horrifying ritual to bind a weeping Wraith of grief. Requires ectoplasm and moonstone shard. The Wraith starts with a d10 Dominance Die and attacks with psychic screams.",
      level: 5,
      spellType: "ACTION",
      icon: "Necrotic/Skull Burst",
      effectTypes: ["summoning"],
      typeConfig: {
        school: "necrotic",
        icon: "Necrotic/Skull Burst",
        tags: ["summoning", "binding", "wraith"],
        castTime: 3,
        castTimeType: "MINUTES",
        ritual: true
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "self",
        areaShape: "circle",
        areaSize: 5
      },
      resourceCost: {
        actionPoints: 2,
        mana: 30
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 6
      },
      summoningConfig: {
        summonType: "permanent",
        creatureName: "Grave Wraith",
        creatureType: "undead",
        quantity: 1,
        statsFormula: "4d6 + 10",
        attackFormula: "2d8 + 4",
        duration: 0,
        durationUnit: "permanent",
        commandable: true,
        actionsPerTurn: 1,
        abilities: ["Psychic Scream", "Incorporeal Shift"]
      },
      resolution: "AUTOMATIC",
      tags: ["summoning", "binding", "wraith"],
      flavorText: "It weeps. It screams. It obeys, for the moment."
    },
    {
      id: "exo_cinder_purge",
      name: "AoE: Cinder Purge",
      description: "You shatter an entire vial of purified brine and salt over a wide area, sending a wave of burning salt across the battlefield. Purges all curses and crowd control from all allies within 20 feet, but deals physical damage to each of them. Devastates supernatural entities caught in the ash.",
      level: 5,
      spellType: "ACTION",
      icon: "Radiant/Radiant Golden Shield",
      effectTypes: ["damage", "utility"],
      typeConfig: {
        school: "radiant",
        icon: "Radiant/Radiant Golden Shield",
        tags: ["purification", "aoe_purge", "Why Bring Me?"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        areaShape: "circle",
        areaSize: 20,
        targetRestrictions: ["allies", "enemies"]
      },
      resourceCost: {
        actionPoints: 2,
        mana: 15
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 3
      },
      damageConfig: {
        formula: "2d6",
        damageTypes: ["bludgeoning"],
        resolution: "DICE",
        conditionalDamage: {
          enabled: true,
          conditions: [
            {
              targetType: "creature_type",
              creatureTypes: ["fiend", "undead", "spirit"],
              bonusFormula: "4d6",
              description: "Deals additional 4d6 radiant damage to supernatural enemies caught in the area."
            }
          ]
        }
      },
      utilityConfig: {
        utilityType: "protection",
        selectedEffects: [
          {
            id: "mass_purge_effects",
            name: "Cinder Cleansing",
            description: "Instantly removes all Curses, Possessions, and mental CC from all allies in the 20ft area."
          }
        ]
      },
      resolution: "DICE",
      tags: ["purification", "aoe_purge", "Why Bring Me?"],
      flavorText: "The air fills with white dust. The allies scream in agony; the spirits melt."
    },

    // ============================================================
    // LEVEL 6 SPELLS
    // ============================================================
    {
      id: "exo_bind_abyssal_brute",
      name: "Ritual: Bind Abyssal Brute",
      description: "A grueling, life-threatening ritual to bind a hulking Abyssal Brute. Requires giant's blood, Dragonfire chains, and deep earth stone. The Brute starts with a d8 Dominance Die and executes crushing strikes.",
      level: 6,
      spellType: "ACTION",
      icon: "Necrotic/Spectral Summoning",
      effectTypes: ["summoning"],
      typeConfig: {
        school: "necrotic",
        icon: "Necrotic/Spectral Summoning",
        tags: ["summoning", "binding", "brute"],
        castTime: 4,
        castTimeType: "MINUTES",
        ritual: true
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "self",
        areaShape: "circle",
        areaSize: 10
      },
      resourceCost: {
        actionPoints: 2,
        mana: 40
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 6
      },
      summoningConfig: {
        summonType: "permanent",
        creatureName: "Abyssal Brute",
        creatureType: "fiend",
        quantity: 1,
        statsFormula: "6d10 + 15",
        attackFormula: "3d8 + 5",
        duration: 0,
        durationUnit: "permanent",
        commandable: true,
        actionsPerTurn: 1,
        abilities: ["Crushing Slam", "Abyssal Guard"]
      },
      resolution: "AUTOMATIC",
      tags: ["summoning", "binding", "brute"],
      flavorText: "A mountain of muscle and fire. You hold the leash, but it shakes the earth."
    },
    {
      id: "exo_mass_discipline",
      name: "Mass Discipline",
      description: "You crack a massive spectral whip made of radiant barbed wire, lashing all active bound demons simultaneously. Restores the Dominance Die of all active demons by 2 steps, but the severe blood cost splits your own flesh.",
      level: 6,
      spellType: "ACTION",
      icon: "Radiant/Divine Halo",
      effectTypes: ["damage", "utility"],
      typeConfig: {
        school: "radiant",
        icon: "Radiant/Divine Halo",
        tags: ["dominance", "restoration", "mass_discipline"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        areaShape: "circle",
        areaSize: 60,
        targetRestrictions: ["bound_demon_or_self"]
      },
      resourceCost: {
        actionPoints: 2,
        mana: 15,
        resourceTypes: ["health"],
        resourceValues: {},
        useFormulas: { health: true },
        resourceFormulas: { health: "3d6" }
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 3
      },
      damageConfig: {
        formula: "3d6",
        damageTypes: ["radiant"],
        resolution: "DICE"
      },
      utilityConfig: {
        utilityType: "fate_manipulation",
        selectedEffects: [
          {
            id: "restore_all_dd",
            name: "Legion Obedience",
            description: "Restores the Dominance Die of all active summons by 2 steps."
          }
        ]
      },
      resolution: "DICE",
      tags: ["dominance", "restoration", "mass_discipline"],
      flavorText: "Hear the whip crack. Fall in line, or return to the ash."
    },

    // ============================================================
    // LEVEL 7 SPELLS
    // ============================================================
    {
      id: "exo_bind_balor",
      name: "Ritual: Bind Balor",
      description: "An incredibly dangerous ritual to bind a towering flame-fiend of ruin. Requires active magma, blood of a dragon, and a blackened holy relic. The Balor starts with a d6 Dominance Die and sweeps the area with molten iron.",
      level: 7,
      spellType: "ACTION",
      icon: "Fire/Flame Burst",
      effectTypes: ["summoning"],
      typeConfig: {
        school: "necrotic",
        icon: "Fire/Flame Burst",
        tags: ["summoning", "binding", "balor"],
        castTime: 5,
        castTimeType: "MINUTES",
        ritual: true
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "self",
        areaShape: "circle",
        areaSize: 15
      },
      resourceCost: {
        actionPoints: 3,
        mana: 50
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 7
      },
      summoningConfig: {
        summonType: "permanent",
        creatureName: "Balor Fiend",
        creatureType: "fiend",
        quantity: 1,
        statsFormula: "8d10 + 20",
        attackFormula: "4d10 + 6",
        duration: 0,
        durationUnit: "permanent",
        commandable: true,
        actionsPerTurn: 1,
        abilities: ["Molten Sweep", "Firestorm Aura"]
      },
      resolution: "AUTOMATIC",
      tags: ["summoning", "binding", "balor"],
      flavorText: "A walking volcano on a thread. If the thread snaps, the world ends."
    },

    // ============================================================
    // LEVEL 8 SPELLS
    // ============================================================
    {
      id: "exo_divine_crucifixion",
      name: "Ultimate: Divine Crucifixion",
      description: "You drive a colossal spectral stake of salt and cold iron directly through the target's spirit, pinning them to the fabric of reality. Deals colossal radiant damage to Undead, Fiends, and Spirits, paralyzing them instantly. Against mortals, the stake shatters on their mundane meat, dealing negligible damage.",
      level: 8,
      spellType: "ACTION",
      icon: "Radiant/Radiant Divinity",
      effectTypes: ["damage", "control"],
      typeConfig: {
        school: "radiant",
        icon: "Radiant/Radiant Divinity",
        tags: ["damage", "execute", "paralyze", "Mortal Deficit"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: ["enemies"]
      },
      resourceCost: {
        actionPoints: 3,
        mana: 30
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 4
      },
      damageConfig: {
        formula: "8d10",
        damageTypes: ["radiant"],
        resolution: "DICE",
        savingThrow: {
          ability: "spirit",
          difficultyClass: 18,
          saveOutcome: "half_damage"
        },
        conditionalDamage: {
          enabled: true,
          conditions: [
            {
              targetType: "creature_type",
              creatureTypes: ["fiend", "undead", "spirit", "aberration"],
              bonusFormula: "12d10",
              description: "Deals massive bonus damage (additional +12d10) to supernatural targets. Deals only 1/4 damage to Mortals."
            }
          ]
        }
      },
      controlConfig: {
        controlType: "incapacitation",
        effects: [
          {
            id: "crucifixion_paralysis",
            name: "Spirit Crucified",
            description: "Target is Paralyzed for 3 rounds. Spirit save DC 18 to negate."
          }
        ],
        savingThrow: {
          ability: "spirit",
          difficultyClass: 18
        },
        duration: 3,
        durationUnit: "rounds"
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds"
      },
      resolution: "DICE",
      tags: ["damage", "execute", "paralyze", "Mortal Deficit"],
      flavorText: "A scream that shakes the veil. The iron stake remains, smoking with sulfur."
    },

    // ============================================================
    // LEVEL 9 SPELLS
    // ============================================================
    {
      id: "exo_bind_demon_prince",
      name: "Ritual: Bind Demon Prince",
      description: "The absolute pinnacle of binding rituals. You chain an Arch-Demon of the pit to your very heartbeat. Requires a dark ritual circle and three rare materials. The Prince starts with a d6 Dominance Die and has extreme maintenance.",
      level: 9,
      spellType: "ACTION",
      icon: "Necrotic/Arise",
      effectTypes: ["summoning"],
      typeConfig: {
        school: "necrotic",
        icon: "Necrotic/Arise",
        tags: ["summoning", "binding", "demon_prince"],
        castTime: 10,
        castTimeType: "MINUTES",
        ritual: true
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "self",
        areaShape: "circle",
        areaSize: 20
      },
      resourceCost: {
        actionPoints: 3,
        mana: 80
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 10
      },
      summoningConfig: {
        summonType: "permanent",
        creatureName: "Demon Prince",
        creatureType: "fiend",
        quantity: 1,
        statsFormula: "10d10 + 30",
        attackFormula: "5d12 + 8",
        duration: 0,
        durationUnit: "permanent",
        commandable: true,
        actionsPerTurn: 2,
        abilities: ["Void Ruin", "Command Lesser Fiend"]
      },
      resolution: "AUTOMATIC",
      tags: ["summoning", "binding", "demon_prince"],
      flavorText: "An arch-horror bound by a single thread. Look away for a second, and it will tear your world apart."
    },

    // ============================================================
    // LEVEL 10 SPELLS
    // ============================================================
    {
      id: "exo_calamitous_ascension",
      name: "Ultimate: Calamitous Ascension",
      description: "For the Possessed: Invite the demon prince into your soul. You undergo a terrifying, tragic transformation into a towering beacon of blackened ash and searing radiant light. You gain absolute invulnerability to all supernatural and magical damage, but your Mortal Deficit is magnified: normal, mundane kinetic attacks deal quadruple damage.",
      level: 10,
      spellType: "ACTION",
      icon: "Radiant/Radiant Divinity",
      effectTypes: ["buff", "damage"],
      typeConfig: {
        school: "radiant",
        icon: "Radiant/Radiant Divinity",
        tags: ["possessed", "transformation", "ultimate", "Mortal Deficit"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "self"
      },
      resourceCost: {
        actionPoints: 3,
        mana: 50,
        resourceTypes: ["health"],
        resourceValues: {},
        useFormulas: { health: true },
        resourceFormulas: { health: "5d6" }
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 10
      },
      buffConfig: {
        buffType: "statusEffectBuff",
        effects: [
          {
            id: "demon_god_ascension",
            name: "Ash and Light",
            description: "Caster gains absolute invulnerability to all magical and elemental damage. Caster deals +3d10 radiant damage on all attacks. However, any mundane physical attacks deal 300% increased damage (quadruple damage). Lasts 3 rounds.",
            mechanicsText: "Invulnerability to magic, +3d10 radiant damage, 300% vulnerability to mundane physical attacks.",
            statusEffect: {
              vulnerabilityType: "physical",
              vulnerabilityPercent: 300
            }
          }
        ],
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds"
      },
      damageConfig: {
        formula: "5d6",
        damageTypes: ["radiant"],
        resolution: "DICE"
      },
      resolution: "DICE",
      tags: ["possessed", "transformation", "ultimate", "Mortal Deficit"],
      flavorText: "I am become the cataclysm. Chained, yet absolute."
    }
  ]
};
