export const GAMBLER_DATA = {
  id: "gambler",
  name: "Gambler",
  icon: "fas fa-dice",
  role: "Damage / Utility",
  damageTypes: ["force", "psychic", "necrotic"],

  overview: {
    title: "The Desperate Debtor",
    subtitle: "The Parasite of Probability",

    quickOverview: {
      title: "Quick Overview",
      content: `**What You Need to Know**: The Gambler is no daring risk-taker or charming rogue. They are a gaunt, jittery Desperate Debtor who has bartered away their own natural luck to an extraplanar collector. Now, they must physically rip probability from the flesh of those around them, leaving a trail of biological deterioration in exchange for stolen fortune.

**Core Mechanic (Nudge & Wager)**: You generate Fortune Points (FP) through violent coin-flips, die throws, and card siphoning. You spend these points to manipulate the exact math of active d20 rolls, adjusting results by ±1 per point *after* they are rolled.

**The Debtor's Tax (Physical Toll)**: Banked luck demands a toll of flesh. Every single time you gain or bank a Fortune Point from a successful hit or winning gamble, you suffer 1 immediate, unpreventable HP damage as your body acts as collateral.

**Playstyle**: High-risk, visceral build-and-spend economy. You walk a knife-edge between spectacular fortune-manipulation and catastrophic internal hemorrhaging. If your FP pool drops to zero or you fail a critical gamble, you go Bust.`,
    },

    description: `A tragic dirge written in stolen luck and shattered marrow. The Gambler does not play for gold or glory; they play for the next agonizing breath. Having bartered their soul-anchored fortune to a cosmic debt collector, their veins twitch with the kinetic hum of stolen probability. To twist fate is to mutilate the self—a biological sacrifice that leaves them hollowed-out, gaunt, and perpetually on the verge of bankruptcy.`,

    roleplayIdentity: {
      title: "Roleplay Identity",
      content: `In the grimdark reality of Mythrill, these desperate souls are hunted outcasts. They are jittery addicts of chance who can see the invisible, vibrating strings of probability and flay their own skin just to pull them. 

- **The Reluctant Debtor**: A desperate soul who bartered their luck to save a dying loved one, only to realize the collector's terms are eternal.
- **The Probability Savant**: A hollowed-out scholar who mapped the mathematical patterns of cosmic debt and now treats their own blood as numbers.
- **The Thread Puller**: An addict who has flayed their fingers raw to physically feel and grasp the vibrating strings of destiny.
- **The Defaulted Hunter**: One who defaults on their loan and now tracks down other debtors, siphoning their fortune before the collector's hounds arrive.`,
    },

    combatRole: {
      title: "Combat Role",
      content: `**Why Bring Me?**: Perfect threshold control. The Gambler possesses the exclusive capacity to manipulate the exact math of active d20 rolls. By spending banked Fortune Points, they can squeeze a close failure into a success or drag an enemy's saving throw down beneath a crucial threshold. They are the ultimate mathematical safety net—or the spark that ignites a devastating high-stakes payload.

**The Fatal Flaw (Cosmic Bankruptcy)**: Your luck is a compounding loan. If you deplete your Fortune Point pool to absolute zero, or catastrophically fail a major gamble (such as a miss on Double or Nothing or rolling a catastrophic failure on Jackpot), you plunge into Cosmic Bankruptcy. Your internal organs hemorrhage, dealing severe necrotic damage, and you suffer a 100% vulnerability to magical Spirit and shadow forces for 2 rounds while unable to generate luck.`,
    },

    playstyle: {
      title: "Playstyle & Strategy",
      content: `Playing the Desperate Debtor requires balancing the raw mathematical power of roll manipulation against your own biological decay:

**The Turn 1 Loop**:
- Start combat with 1 Fortune Point. 
- Immediately lock into the build-and-spend economy using **Lucky Strike** or **Lucky Toss** on Turn 1. 
- Bank Fortune Points at the immediate cost of 1 HP per point, then immediately decide whether to hoard them for roll modifications or spend them on devastating active wagers.

**Roll Nudging**:
- After any d20 roll is made (attack roll, saving throw, check), spend Fortune Points to modify the result by ±1 per point.
- Spending FP triggers **Calculated Risk**, inflicting 1d4 psychic damage per point spent. You do not just spend points; you bleed for them.

**Managing the Void**:
- Never let your Fortune Point pool drop to 0. Always hold a single point in reserve, or the collector's hounds will trigger Cosmic Bankruptcy, locking your abilities and leaving you defenseless.`,
    },

    immersiveCombatExample: {
      title: "Combat Example: The Debt Paid at Iron Gallows",
      content: `**The Setup**: You stand before a hulking, armor-clad inquisitor. Your hands tremble; the debt is due. You must harvest his probability to keep your heart beating.

**Turn 1 - Harvesting the Collateral (FP: 1 → 3, HP: 45 → 43)**
*You mutter a chattering prayer, flaying your knuckles. You cast Lucky Strike!*
Dice roll matches! You deal 14 force damage.
**The Debtor's Tax**: You bank 2 Fortune Points. Your veins boil, and you suffer 2 immediate physical damage as collateral.

**Turn 2 - Nudging the Scales (FP: 3 → 2, HP: 43 → 41)**
*The inquisitor swings his massive hammer. The roll lands exactly on his hit threshold.*
**Reaction**: You spend 1 Fortune Point, tugging the strings of his hammer.
**Calculated Risk**: You suffer 1d4 psychic damage (rolling a 2) as your ears bleed.
*The hammer swings wide, missing your shoulder by a fraction of an inch. His luck was yours.*

**Turn 3 - The Ultimate Wager (FP: 2 → 0, HP: 41 → Bankruptcy)**
*Desperate, you cast Double or Nothing, putting your remaining life on the table.*
You roll a d20 to hit... and fail. The weapon recoils violently, hitting your own chest.
Your Fortune Points hit 0.
**Cosmic Bankruptcy**: Your lungs fill with blood (2d10 necrotic damage). For the next 2 rounds, you are deaf to fate, unable to cast, and 100% vulnerable to his dark spells. The debt collectors have come to harvest.`,
    },
  },

  resourceSystem: {
    title: "Fortune Points & Flesh Collateral",
    description: "A high-stakes, mathematical resource representing stolen luck and the physical degradation demanded by its extraplanar collectors.",

    cards: [
      {
        title: "Fortune Points (Primary)",
        stats: "7 to 21 Max (Scales by Spec)",
        details: "Vibrating tokens of stolen probability. Generated by coin flips, die rolls, and card draws. Spent after any d20 roll to adjust the result by ±1 per point.",
      },
      {
        title: "Flesh Collateral (The Debtor's Tax)",
        stats: "1 HP per FP Gained",
        details: "Stolen luck is bought with meat. Every single time you bank or gain a Fortune Point from any spell or effect, you suffer 1 immediate, unpreventable HP damage.",
      },
      {
        title: "Calculated Risk (The Spending Cost)",
        stats: "1d4 Psychic Damage per FP Spent",
        details: "Tugging the strings of fate tears your mind. Whenever you spend Fortune Points to modify a roll, you suffer 1d4 psychic damage per point spent. Cannot be mitigated.",
      },
    ],

    generationTable: {
      headers: ["Action / Spell", "Fortune Point Change", "Physical Toll (HP)"],
      rows: [
        ["Lucky Strike (Level 1)", "+1 to +3 on match", "-1 HP per point generated"],
        ["Lucky Toss (Level 1)", "+1 on heads", "-1 HP"],
        ["Beginner's Luck (Level 1)", "+1 on cast", "-1 HP"],
        ["Dice Dart (Level 1)", "+1 on cast", "-1 HP"],
        ["Nudge a d20 Roll", "-1 to -X points", "1d4 psychic damage per point spent"],
        ["Cosmic Bankruptcy (0 FP)", "Resets to 0, Locked", "2d10 necrotic damage + 100% Spirit/shadow vulnerability"],
      ],
    },

    usage: {
      nudging: "Modify any d20 roll (attack, save, ability check) by ±1 per Fortune Point spent. Must be declared AFTER the roll is seen, but BEFORE the outcome is narrated.",
      wagers: "Spent as resource requirements for high-stakes Level 2-10 actions (e.g., Death Roll, High Roller, Jackpot).",
    },
  },

  characterCreation: {
    title: "Character Creation",
    subtitle: "Signing the Soul-Contract",
    description: "Every Gambler begins their journey in a state of frantic, chattering desperation, their body acting as a living ledgers for cosmic probability.",
    steps: [
      {
        title: "Acknowledge the Sovereign Debt",
        content: "You begin play with exactly 1 Fortune Point and a trembling body. Your first action on Turn 1 must involve generating or spending luck.",
      },
      {
        title: "Accept the Blood Collateral",
        content: "Every point of luck you siphon from the cosmos will physically drain your flesh. You must be prepared to bleed to turn a failure into a success.",
      },
      {
        title: "Choose Your Instrument of Debt",
        content: "Select whether you siphon luck via a blood-slicked coin, a deck of flayed leather cards, or heavy bone dice.",
      },
    ],
  },

  startingEquipment: {
    weapons: [
      { name: "Blood-Slick Dagger", damage: "1d4 piercing", description: "A simple blade used more for drawing your own blood than fighting." },
      { name: "Serrated Cane-Sword", damage: "1d6 slashing", description: "A concealed blade to keep predators at bay while you chitter." },
    ],
    armor: {
      name: "Ripped Traveler's Cloak",
      armorRating: 11,
      type: "Light",
      description: "Thin, blood-splattered fabric that offers little protection against physical steel, and none against the entities you owe.",
    },
    gear: [
      "A set of heavy bone dice carved from a debtor's skull",
      "A deck of leather cards stained with alchemical ink",
      "10 steel fortune tokens (crimson and silver)",
      "A vial of numbing salt to quiet the chattering of your teeth",
    ],
    startingGold: 10,
  },

  specializations: {
    title: "Contracts of Fate",
    subtitle: "Three Paths of Probability Mutilation",
    description: "Specializing allows you to alter how you siphon and wage your stolen fortune.",
    passiveAbility: {
      name: "The Debtor's Tax",
      description: "Every single time you bank or gain a Fortune Point from a successful hit or winning gamble, you suffer 1 immediate HP damage as collateral for your borrowed luck.",
    },
    specs: [
      {
        name: "The Probability Savant",
        icon: "fas fa-brain",
        color: "#2980b9",
        theme: "Mathematical Parasitism",
        playstyle: "Strategic, consistent roll manipulation. You siphon small, steady streams of luck, minimizing high-risk drops and hoarding a small, perfect reserve of nudges.",
        description: "Masters of incremental math. They treat fate as a ledger to be meticulously balanced.",
        strengths: ["Maximum FP capacity set to 13", "Calculated Risk damage reduced to 1 per point spent", "Advantage on saving throws against mental effects"],
        weaknesses: ["Lower single-target burst damage", "Vulnerable to heavy physical steel", "Slower maximum FP generation"],
        keyAbilities: [
          { name: "Balanced Ledger", type: "Passive", cost: "None", description: "Calculated Risk damage is fixed at 1 psychic damage per FP spent instead of 1d4." },
          { name: "Savant's Nudge", type: "Reaction", cost: "1 FP", description: "Adjust an ally's saving throw by ±2 instead of ±1." },
        ],
        passiveAbility: {
          name: "Balanced Ledger",
          description: "Your calculated risk damage is fixed at 1 psychic damage per FP spent instead of 1d4. Your maximum Fortune Point capacity is set to 13.",
        },
        talentTreeSummary: [
          { name: "Risk Mitigation", description: "Reduces damage taken from physical attacks while carrying 5+ FP." },
          { name: "Precision Nudging", description: "Allows nudging rolls by ±2 per FP spent once per turn." },
        ],
      },
      {
        name: "The Flesh Wagerer",
        icon: "fas fa-skull",
        color: "#c0392b",
        theme: "Apocalyptic High Rolling",
        playstyle: "High stakes, devastating payloads. You wager entire pools of HP and mana for spectacular, bone-crushing force attacks, walking the absolute edge of death.",
        description: "Hollowed-out addicts who gamble with their own vital organs for apocalyptic results.",
        strengths: ["Maximum FP capacity set to 21", "Devastating force damage scaling with spent FP", "Generate FP on critical hits and self-damage"],
        weaknesses: ["Extremely high self-damage", "Highest vulnerability to Cosmic Bankruptcy", "Zero defensive utility"],
        keyAbilities: [
          { name: "Double Down", type: "Passive", cost: "None", description: "When you suffer self-damage from a spell, you immediately gain 2 Fortune Points." },
          { name: "Bone Shatter Wager", type: "Action", cost: "2 AP, 8 FP", description: "Deal 8d10 force damage to a target, but take 4d10 force damage yourself on a miss." },
        ],
        passiveAbility: {
          name: "Double Down",
          description: "When you suffer self-damage from a spell or gamble, you immediately gain 2 Fortune Points (and suffer the 2 HP Debtor's Tax). Your maximum Fortune Point capacity is set to 21.",
        },
        talentTreeSummary: [
          { name: "Marrow Betting", description: "Spend HP instead of mana to cast Gambler spells when out of mana." },
          { name: "Catastrophic Payload", description: "Multiplies critical hit damage by 3x on all high-risk spells." },
        ],
      },
      {
        name: "The Thread Puller",
        icon: "fas fa-spider",
        color: "#8e44ad",
        theme: "Fate Mutilation & Card Sharking",
        playstyle: "Strategic deck siphoning and competitive death matches. You drag enemies into high-stakes games where you hold all the loaded cards.",
        description: "Addicts who have flayed their fingertips raw to physically feel and grasp the vibrating strings of destiny.",
        strengths: ["Maximum FP capacity set to 15", "Can choose between two drawn cards in Card Shark", "High crowd control and forced saving throws"],
        weaknesses: ["Highly reliant on card-suit RNG", "Requires active targeting and setup", "Vulnerable to silence and spirit-shattering magic"],
        keyAbilities: [
          { name: "Loaded Deck", type: "Passive", cost: "None", description: "Whenever you draw from your magical deck, draw two cards and choose which suit to resolve." },
          { name: "Fate's Noose", type: "Action", cost: "1 AP, 4 FP", description: "Bind an enemy in threads of probability, stunning them for 1 round (Spirit DC 16 save negates)." },
        ],
        passiveAbility: {
          name: "Loaded Deck",
          description: "Whenever you draw from your magical deck, draw two cards and choose which suit to resolve. Your maximum Fortune Point capacity is set to 15.",
        },
        talentTreeSummary: [
          { name: "Thread Weaving", description: "Siphon 1 FP whenever an enemy within 30ft fails a saving throw." },
          { name: "Suit Manipulation", description: "Guarantees a Spades or Hearts suit once per long rest." },
        ],
      },
    ],
  },

  spells: [
    // ========================================
    // LEVEL 1 SPELLS - The Blood-Luck Engine
    // ========================================
    {
      id: "gambler_lucky_strike",
      name: "Lucky Strike",
      description: "Roll 4d12 bone dice before striking. Matching values dictate your strike's catastrophic power: 4 matching dice deal 4x damage, 3 matching deal 3x, and 2 matching deal 2x. All unique dice deal normal damage. Matches siphon 1, 2, or 3 Fortune Points, but your veins rupture: suffer 1 immediate HP damage per Fortune Point gained.",
      level: 1,
      spellType: "ACTION",
      icon: "Slashing/Quick Slash",
      typeConfig: {
        school: "force",
        icon: "Slashing/Quick Slash",
        tags: ["melee", "damage", "fortune_generation", "starter"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "melee",
        rangeDistance: 5,
        targetRestrictions: ["enemy"],
      },
      resourceCost: {
        actionPoints: 1,
        resourceTypes: ["mana"],
        resourceValues: { mana: 7 },
        components: ["somatic"],
        somaticText: "Throw bone dice onto the blade",
      },
      resolution: "DICE",
      effectTypes: ["damage"],
      damageConfig: {
        formula: "2d6 + charisma",
        damageTypes: ["force"],
        canCrit: true,
        critMultiplier: 2,
        resolution: "DICE",
      },
      specialMechanics: {
        fortunePoints: {
          generates: "variable",
          description: "Generates FP on matching dice. You spend 1 FP per FP generated as the toll of fortune.",
        },
        gamblingGame: {
          gameType: "yahtzee",
          description: "Roll 4d12 — pairs, triples, and quads multiply your damage and siphon Fortune Points.",
          resolution: "DICE",
          rules: { diceCount: 4, dieType: 12 },
          outcomeTiers: [
            { condition: "4_match", name: "Four of a Kind", multiplier: 4, fpGain: 3, fpCost: 3 },
            { condition: "3_match", name: "Three of a Kind", multiplier: 3, fpGain: 2, fpCost: 2 },
            { condition: "2_match", name: "Pair", multiplier: 2, fpGain: 1, fpCost: 1 },
            { condition: "no_match", name: "No Match", multiplier: 1, fpGain: 0 },
          ],
        },
      },
      tags: ["melee", "damage", "fortune_generation", "starter", "gambler"],
    },

    {
      id: "gambler_lucky_toss",
      name: "Lucky Toss",
      description: "Flick a blood-stained steel coin. Heads: target takes 1d10 + Charisma force damage. Tails: the coin floats, granting the target a shimmering barrier absorbing 10 damage for 1 round. Generates 1 Fortune Point, inflicting 1 immediate HP damage to you as your flesh pays the toll.",
      level: 1,
      spellType: "ACTION",
      icon: "Utility/Utility",
      typeConfig: {
        school: "force",
        icon: "Utility/Utility",
        tags: ["ranged", "damage", "buff", "coin_flip", "starter"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: ["enemy", "ally"],
      },
      resourceCost: {
        actionPoints: 1,
        resourceTypes: ["mana"],
        resourceValues: { mana: 3 },
        components: ["somatic"],
        somaticText: "Flick a blood-slicked coin",
      },
      resolution: "COINS",
      effectTypes: ["damage", "buff"],
      damageConfig: {
        formula: "1d10 + charisma",
        damageTypes: ["force"],
        resolution: "DICE",
      },
      buffConfig: {
        buffType: "shield",
        effects: [
          {
            id: "lucky_toss_shield",
            name: "Floating Fortune",
            description: "Absorbs 10 damage.",
          },
        ],
        durationValue: 1,
        durationType: "rounds",
        durationUnit: "rounds",
      },
      specialMechanics: {
        coinFlip: {
          heads: { effect: "deal_damage", description: "Deals 1d10 + Charisma force damage." },
          tails: { effect: "apply_shield", description: "Applies a shield absorbing 10 damage." },
        },
        fortunePoints: {
          generates: 1,
          description: "Generates 1 FP on cast, inflicting 1 HP damage to the caster.",
        },
        gamblingGame: {
          gameType: "coin_flip",
          description: "Flip 1 coin — heads hurts enemies, tails shields allies.",
          resolution: "COINS",
          rules: { flipCount: 1 },
          outcomeTiers: [
            { condition: "heads", name: "Heads", damage: "1d10 + CHA force", fpGain: 1, fpCost: 1 },
            { condition: "tails", name: "Tails", shield: 10, fpGain: 1, fpCost: 1 },
          ],
        },
      },
      tags: ["ranged", "damage", "buff", "coin_flip", "starter", "gambler"],
    },

    {
      id: "gambler_dice_dart",
      name: "Dice Dart",
      description: "Throw a magically loaded bone die at a creature's forehead. Deals 1d8 psychic damage. Generates 1 Fortune Point, inflicting 1 HP damage to you. You can spend up to 3 Fortune Points to add +1d6 psychic damage per point, taking 1d4 psychic damage per point spent.",
      level: 1,
      spellType: "ACTION",
      icon: "Social/Dice Roll",
      typeConfig: {
        school: "psychic",
        icon: "Social/Dice Roll",
        tags: ["ranged", "damage", "fortune_generation", "starter"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: ["enemy"],
      },
      resourceCost: {
        actionPoints: 1,
        resourceTypes: ["mana"],
        resourceValues: { mana: 3 },
        components: ["somatic"],
        somaticText: "Throw bone die",
      },
      resolution: "DICE",
      effectTypes: ["damage"],
      damageConfig: {
        formula: "1d8",
        damageTypes: ["psychic"],
        resolution: "DICE",
      },
      specialMechanics: {
        fortunePoints: {
          generates: 1,
          optionalCost: "1-3 FP",
          description: "Generates 1 FP (1 HP cost). You can spend 1-3 FP to add +1d6 psychic damage per point (1d4 psychic damage per point spent).",
        },
        gamblingGame: {
          gameType: "dice_throw",
          description: "Throw a bone die — siphon minor luck or spend FP to load the throw.",
          resolution: "DICE",
          rules: { diceCount: 1, dieType: 6 },
          outcomeTiers: [
            { condition: "cast", name: "Standard Dart", damage: "1d8 psychic", fpGain: 1, fpCost: 1 },
            { condition: "fp_empowered", name: "Loaded Dart", damage: "1d8 + Nd6 psychic", fpCost: "1-3" },
          ],
        },
      },
      tags: ["ranged", "damage", "fortune_generation", "starter", "gambler"],
    },

    {
      id: "gambler_beginners_luck",
      name: "Beginner's Luck",
      description: "Whisper a desperate plea to the cosmic collector. Gain advantage on your next attack roll or saving throw within 1 round. Generates 1 Fortune Point, dealing 1 HP damage to you.",
      level: 1,
      spellType: "ACTION",
      icon: "Psychic/Focused Mind",
      typeConfig: {
        school: "force",
        icon: "Psychic/Focused Mind",
        tags: ["buff", "luck", "starter"],
        castTime: 0,
        castTimeType: "FREE",
      },
      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },
      resourceCost: {
        actionPoints: 0,
        resourceTypes: ["mana"],
        resourceValues: { mana: 3 },
        components: ["verbal"],
        verbalText: "Just this once...",
      },
      resolution: "NONE",
      effectTypes: ["buff"],
      buffConfig: {
        buffType: "combatAdvantage",
        effects: [
          {
            id: "beginners_luck_buff",
            name: "Beginner's Advantage",
            description: "Advantage on your next attack roll or saving throw.",
          },
        ],
        durationValue: 1,
        durationType: "rounds",
        durationUnit: "rounds",
      },
      specialMechanics: {
        fortunePoints: {
          generates: 1,
          description: "Generates 1 FP on cast, inflicting 1 HP damage to the caster.",
        },
        gamblingGame: {
          gameType: "begging",
          description: "Plead for luck — gain instant combat advantage at a biological cost.",
          resolution: "AUTOMATIC",
          rules: { duration: 1 },
          outcomeTiers: [
            { condition: "cast", name: "Beggar's Luck", buff: "advantage next roll", fpGain: 1, fpCost: 1 },
          ],
        },
      },
      tags: ["buff", "luck", "starter", "gambler"],
    },

    {
      id: "gambler_calculated_risk",
      name: "Calculated Risk",
      description: "Every twist of probability has a price. When you spend Fortune Points to modify an active d20 roll, your skull fractures from the mental strain. You suffer 1d4 psychic damage per Fortune Point spent. This damage cannot be reduced or prevented. Gambling is pain.",
      level: 1,
      spellType: "PASSIVE",
      icon: "Slashing/Viking Axes",
      typeConfig: {
        school: "psychic",
        icon: "Slashing/Viking Axes",
        tags: ["passive", "weakness"],
        castTime: 0,
        castTimeType: "PASSIVE",
      },
      targetingConfig: { targetingType: "self", rangeType: "self" },
      resourceCost: { actionPoints: 0 },
      resolution: "AUTOMATIC",
      effectTypes: ["debuff"],
      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          {
            id: "calculated_risk_debuff",
            name: "Calculated Risk",
            description: "Suffer 1d4 psychic damage per Fortune Point spent to nudge rolls.",
          },
        ],
        durationValue: 0,
        durationType: "permanent",
      },
      tags: ["passive", "weakness", "gambler"],
    },

    {
      id: "gambler_house_edge",
      name: "House Edge",
      description: "The cosmic house always wins in the long run. When you roll a natural 1 on any gambling-based roll (dice rolls, coin flips, card draws used for spell effects), the collector immediately seizes your assets. You lose all unspent Fortune Points and cannot generate new points until the start of your next turn.",
      level: 1,
      spellType: "PASSIVE",
      icon: "Utility/Target Crosshair",
      typeConfig: {
        school: "physical",
        icon: "Utility/Target Crosshair",
        tags: ["passive", "weakness"],
        castTime: 0,
        castTimeType: "PASSIVE",
      },
      targetingConfig: { targetingType: "self", rangeType: "self" },
      resourceCost: { actionPoints: 0 },
      resolution: "AUTOMATIC",
      effectTypes: ["debuff"],
      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          {
            id: "house_edge_debuff",
            name: "House Edge",
            description: "Rolling a natural 1 on gamble rolls drains all FP and locks generation for 1 round.",
          },
        ],
        durationValue: 0,
        durationType: "permanent",
      },
      tags: ["passive", "weakness", "gambler"],
    },

    // ========================================
    // LEVEL 2 SPELLS - Risk & Illusion
    // ========================================
    {
      id: "gambler_coin_toss",
      name: "Coin Toss",
      description: "Flip a cursed iron coin wreathed in your own blood. Heads: gain a +2 bonus to all attack rolls and saving throws for 1 hour. Tails: suffer a -2 penalty to all attack rolls and saving throws for 1 hour. Generates 1 Fortune Point (inflicting 1 HP damage). You can spend 1 Fortune Point (taking 1d4 psychic damage) to force the coin to flip its result.",
      level: 2,
      spellType: "ACTION",
      icon: "Utility/Utility",
      typeConfig: {
        school: "force",
        icon: "Utility/Utility",
        tags: ["buff", "debuff", "coin_flip"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },
      resourceCost: {
        actionPoints: 1,
        resourceTypes: ["mana"],
        resourceValues: { mana: 6 },
        components: ["somatic"],
        somaticText: "Flip blood-slicked coin",
      },
      resolution: "COINS",
      effectTypes: ["buff", "debuff"],
      buffConfig: {
        buffType: "statusEffectBuff",
        effects: [
          {
            id: "coin_toss_heads",
            name: "Heads — Lady Luck's Smile",
            description: "+2 to all attack rolls and saving throws.",
            statPenalty: { stat: "attack_and_saves", magnitude: 2, magnitudeType: "flat" },
          },
        ],
        durationValue: 1,
        durationType: "hours",
        durationUnit: "hours",
      },
      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          {
            id: "coin_toss_tails",
            name: "Tails — Collector's Frown",
            description: "-2 to all attack rolls and saving throws.",
            statPenalty: { stat: "attack_and_saves", magnitude: -2, magnitudeType: "flat" },
          },
        ],
        durationValue: 1,
        durationType: "hours",
        durationUnit: "hours",
      },
      specialMechanics: {
        coinFlip: {
          heads: { effect: "apply_buff", description: "+2 to all attack rolls and saves." },
          tails: { effect: "apply_debuff", description: "-2 to all attack rolls and saves." },
        },
        fortunePoints: {
          generates: 1,
          optionalCost: "1 FP",
          description: "Generates 1 FP on cast (1 HP damage). Spend 1 FP to flip the result (1d4 psychic damage spent).",
        },
        gamblingGame: {
          gameType: "coin_flip",
          description: "High-stakes coin toss — tilt your entire stats ledger.",
          resolution: "COINS",
          rules: { flipCount: 1, durationHours: 1 },
          outcomeTiers: [
            { condition: "heads", name: "Heads", buff: "+2 attacks/saves", fpGain: 1, fpCost: 1 },
            { condition: "tails", name: "Tails", debuff: "-2 attacks/saves", fpGain: 1, fpCost: 1 },
          ],
        },
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },
      tags: ["buff", "debuff", "coin_flip", "gambler"],
    },

    {
      id: "gambler_insight",
      name: "Gambler's Insight",
      description: "Your chattering, twitching senses lock onto a target. Read their microscopically subtle tells, siphoning their luck. You gain advantage on all Insight and Perception checks against them for 10 minutes. Generates 1 Fortune Point, dealing 1 HP damage to you.",
      level: 2,
      spellType: "ACTION",
      icon: "Psychic/Focused Mind",
      typeConfig: {
        school: "psychic",
        icon: "Psychic/Focused Mind",
        tags: ["utility", "social"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
        targetRestrictions: ["enemy", "ally"],
      },
      resourceCost: {
        actionPoints: 1,
        resourceTypes: ["mana"],
        resourceValues: { mana: 6 },
        components: ["verbal", "somatic"],
        verbalText: "I see your hand...",
      },
      resolution: "NONE",
      effectTypes: ["buff"],
      buffConfig: {
        buffType: "statusEffectBuff",
        effects: [
          {
            id: "gamblers_insight_buff",
            name: "Gambler's Insight",
            description: "Advantage on Insight and Perception checks against target.",
          },
        ],
        durationValue: 10,
        durationType: "minutes",
        durationUnit: "minutes",
      },
      specialMechanics: {
        fortunePoints: {
          generates: 1,
          description: "Generates 1 FP on cast, inflicting 1 HP damage.",
        },
      },
      tags: ["utility", "social", "gambler"],
    },

    {
      id: "gambler_fools_gold",
      name: "Fool's Gold",
      description: "Reach into the empty void of your pockets and pull out a shimmering pile of coins, jewels, or cards (up to 100gp in value). The wealth is a temporary mathematical illusion; it dissolves into cold, grey ash in 1 hour or instantly if touched by holy steel. Siphons 1 Fortune Point (inflicting 1 HP damage).",
      level: 2,
      spellType: "ACTION",
      icon: "Utility/Utility",
      typeConfig: {
        school: "force",
        icon: "Utility/Utility",
        tags: ["utility", "illusion"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },
      resourceCost: {
        actionPoints: 1,
        resourceTypes: ["mana"],
        resourceValues: { mana: 7 },
        components: ["somatic"],
        somaticText: "Pull empty air from pockets",
      },
      resolution: "NONE",
      effectTypes: ["utility"],
      utilityConfig: {
        utilityType: "conjuration",
        selectedEffects: [
          {
            id: "fools_gold_wealth",
            name: "Shifting Wealth",
            description: "Conjure 100gp worth of illusory coins for 1 hour.",
          },
        ],
        duration: 1,
        durationUnit: "hours",
      },
      specialMechanics: {
        fortunePoints: {
          generates: 1,
          description: "Generates 1 FP on cast, inflicting 1 HP damage.",
        },
      },
      tags: ["utility", "illusion", "gambler"],
    },

    // ========================================
    // LEVEL 3 SPELLS - Prediction & Withdrawal
    // ========================================
    {
      id: "gambler_taunt_the_odds",
      name: "Taunt the Odds",
      description: "Challenge the math of the universe. Predict a number between 1 and 20, then roll a d20. If your roll is within 3 of your guess, deal 3d10 psychic damage to a target. If you are off by 4 or more, the probability backfires, dealing 1d10 psychic damage to you. You can spend Fortune Points to nudge the d20 roll toward your guess (1d4 psychic damage per point). Gaining 1 FP on success (1 HP damage).",
      level: 3,
      spellType: "ACTION",
      icon: "Radiant/Radiant Warrior",
      typeConfig: {
        school: "psychic",
        icon: "Radiant/Radiant Warrior",
        tags: ["ranged", "damage", "prediction"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: ["enemy"],
      },
      resourceCost: {
        actionPoints: 1,
        resourceTypes: ["mana"],
        resourceValues: { mana: 10 },
        components: ["verbal", "somatic"],
        verbalText: "The number is...",
      },
      resolution: "DICE",
      effectTypes: ["damage"],
      damageConfig: {
        formula: "3d10",
        damageTypes: ["psychic"],
        resolution: "DICE",
      },
      specialMechanics: {
        fortunePoints: {
          generates: 1,
          optionalCost: "1-5 FP",
          description: "Generates 1 FP on success (1 HP cost). Spend Fortune Points to nudge your d20 roll toward your guess (1d4 psychic damage per point spent).",
        },
        gamblingGame: {
          gameType: "number_guess",
          description: "Guess a number, roll a d20 — close matches deal damage, misses hurt you.",
          resolution: "DICE",
          rules: { diceCount: 1, dieType: 20, successRange: 3 },
          outcomeTiers: [
            { condition: "match_within_3", name: "Hit", damage: "3d10 psychic", fpGain: 1, fpCost: 1 },
            { condition: "miss_by_4+", name: "Backfire", selfDamage: "1d10 psychic", fpGain: 0 },
          ],
        },
      },
      tags: ["ranged", "damage", "prediction", "gambler"],
    },

    {
      id: "gambler_busted",
      name: "Busted",
      description: "When you have 0 Fortune Points, you enter severe probability withdrawal. You are a marked soul, shivering under the collector's gaze. You have disadvantage on all gambling-based resolution rolls (dice rolls, coin flips, card draws used for spell effects) until you bank at least 1 Fortune Point.",
      level: 3,
      spellType: "PASSIVE",
      icon: "/Exhausted",
      typeConfig: {
        school: "physical",
        icon: "/Exhausted",
        tags: ["passive", "weakness"],
        castTime: 0,
        castTimeType: "PASSIVE",
      },
      targetingConfig: { targetingType: "self", rangeType: "self" },
      resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 0 },
      resolution: "AUTOMATIC",
      effectTypes: ["debuff"],
      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          {
            id: "busted_withdrawal",
            name: "Probability Withdrawal",
            description: "Disadvantage on all gambling-based rolls.",
          },
        ],
        durationValue: 0,
        durationType: "permanent",
      },
      tags: ["passive", "weakness", "gambler"],
    },

    // ========================================
    // LEVEL 4 SPELLS - The Agonizing Double Down
    // ========================================
    {
      id: "gambler_double_or_nothing",
      name: "Double or Nothing",
      description: "Make an agonizing gamble on your physical form. Make a d20 attack roll against an enemy. On a hit: it becomes an automatic critical hit dealing double damage (4d10 + Charisma force). On a miss: you take the damage yourself, and if this reduces you to 0 HP, you immediately plunge into Cosmic Bankruptcy. Spend Fortune Points to nudge the attack roll (1d4 psychic damage per point spent).",
      level: 4,
      spellType: "ACTION",
      icon: "Utility/Empowered Warrior",
      typeConfig: {
        school: "psychic",
        secondaryElement: "force",
        icon: "Utility/Empowered Warrior",
        tags: ["melee", "damage", "critical_hit", "high_risk"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "melee",
        rangeDistance: 5,
        targetRestrictions: ["enemy"],
      },
      resourceCost: {
        actionPoints: 1,
        resourceTypes: ["mana"],
        resourceValues: { mana: 14 },
        components: ["somatic"],
        somaticText: "Hold blade to your own throat before swinging",
      },
      resolution: "DICE",
      effectTypes: ["damage"],
      damageConfig: {
        formula: "2d10 + charisma",
        damageTypes: ["psychic", "force"],
        resolution: "DICE",
      },
      specialMechanics: {
        fortunePoints: {
          optionalCost: "1-10 FP",
          description: "Spend Fortune Points to nudge the attack roll toward hitting (1d4 psychic damage per point spent).",
        },
        gamblingGame: {
          gameType: "double_down",
          description: "Make a high-stakes hit roll — critical damage on hit, suffer the damage yourself on miss.",
          resolution: "DICE",
          rules: { diceCount: 1, dieType: 20 },
          outcomeTiers: [
            { condition: "hit", name: "Double (Double Damage)", damage: "4d10 + CHA force", fpGain: 2, fpCost: 2 },
            { condition: "miss", name: "Nothing (Self-inflicted)", selfDamage: "2d10 + CHA force", fpGain: 0 },
          ],
        },
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 4 },
      tags: ["melee", "damage", "critical_hit", "high_risk", "gambler"],
    },

    // ========================================
    // LEVEL 5 SPELLS - Probability Acceleration
    // ========================================
    {
      id: "gambler_hot_streak",
      name: "Hot Streak",
      description: "Let the fever take hold. Spend 4 Fortune Points (taking 4d4 psychic damage) to accelerate your stolen probability. For 1 round, each successful attack or spell cast grants a stacking +1d6 force damage to your next strike, up to a maximum of 4 stacks. Each stack siphoned generates 1 FP (and deals 1 HP damage).",
      level: 5,
      spellType: "ACTION",
      icon: "Fire/Enveloping Fire",
      typeConfig: {
        school: "psychic",
        icon: "Fire/Enveloping Fire",
        tags: ["buff", "damage"],
        castTime: 0,
        castTimeType: "FREE",
      },
      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },
      resourceCost: {
        actionPoints: 0,
        resourceTypes: ["mana"],
        resourceValues: { mana: 16 },
        classResource: { type: "fortune_points", cost: 4 },
      },
      resolution: "NONE",
      effectTypes: ["buff"],
      buffConfig: {
        buffType: "statusEffectBuff",
        effects: [
          {
            id: "hot_streak_buff",
            name: "Hot Streak Acceleration",
            description: "Each successful attack adds +1d6 force damage, stacking up to 4 times.",
          },
        ],
        durationValue: 1,
        durationType: "rounds",
        durationUnit: "rounds",
      },
      specialMechanics: {
        fortunePoints: {
          cost: 4,
          generates: "up_to_4",
          description: "Costs 4 FP to cast (4d4 psychic damage). Generates 1 FP (1 HP damage) per stack built during the duration.",
        },
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 4 },
      tags: ["buff", "damage", "gambler"],
    },

    {
      id: "gambler_mirage_flip",
      name: "Mirage Flip",
      description: "As a reaction when an attack lands on a target within 30ft, flip a blood-stained coin. Heads: double the damage dealt to the target. Tails: nullify the damage entirely, but suffer 2d6 psychic damage as the probability shockwave collapses inside your skull. Spend 1 FP (1d4 psychic damage) to force heads.",
      level: 5,
      spellType: "REACTION",
      icon: "Utility/Utility",
      typeConfig: {
        school: "psychic",
        icon: "Utility/Utility",
        tags: ["reaction", "coin_flip", "high_risk"],
        castTime: 0,
        castTimeType: "REACTION",
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
        targetRestrictions: ["enemy", "ally"],
      },
      resourceCost: {
        actionPoints: 0,
        resourceTypes: ["mana"],
        resourceValues: { mana: 17 },
        components: ["somatic"],
      },
      resolution: "COINS",
      effectTypes: ["buff", "debuff"],
      specialMechanics: {
        coinFlip: {
          heads: { effect: "double_damage", description: "Doubles the damage of the triggering attack." },
          tails: { effect: "nullify_damage", description: "Reduces triggering damage to 0, but inflicts 2d6 psychic damage to you." },
        },
        fortunePoints: {
          optionalCost: "1 FP",
          description: "Spend 1 FP to force heads (1d4 psychic damage spent).",
        },
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },
      tags: ["reaction", "coin_flip", "high_risk", "gambler"],
    },

    {
      id: "gambler_fate_reroll",
      name: "Fate Reroll",
      description: "Tug the threads of probability until they bleed. Spend 4 Fortune Points (4d4 psychic damage) to force all your d20 rolls this turn to be rolled with advantage. Taking this loan of luck leaves your hands trembling; you have disadvantage on all saving throws until the start of your next turn.",
      level: 5,
      spellType: "ACTION",
      icon: "Social/Dice Roll",
      typeConfig: {
        school: "force",
        icon: "Social/Dice Roll",
        tags: ["buff", "reroll"],
        castTime: 0,
        castTimeType: "FREE",
      },
      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },
      resourceCost: {
        actionPoints: 0,
        resourceTypes: ["mana"],
        resourceValues: { mana: 18 },
        classResource: { type: "fortune_points", cost: 4 },
      },
      resolution: "NONE",
      effectTypes: ["buff", "debuff"],
      buffConfig: {
        buffType: "combatAdvantage",
        effects: [
          {
            id: "fate_reroll_advantage",
            name: "Borrowed Advantage",
            description: "Advantage on all d20 rolls this turn.",
          },
        ],
        durationValue: 1,
        durationType: "rounds",
        durationUnit: "rounds",
      },
      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          {
            id: "fate_reroll_tremble",
            name: "Trembling Loan",
            description: "Disadvantage on all saving throws.",
          },
        ],
        durationValue: 1,
        durationType: "rounds",
        durationUnit: "rounds",
      },
      specialMechanics: {
        fortunePoints: {
          cost: 4,
          description: "Costs 4 FP (4d4 psychic damage) to guarantee advantage on all d20 rolls for the turn.",
        },
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 5 },
      tags: ["buff", "reroll", "gambler"],
    },

    // ========================================
    // LEVEL 6 SPELLS - Luck Siphoning
    // ========================================
    {
      id: "gambler_house_advantage",
      name: "House Advantage",
      description: "The cosmic house always wins. Siphon the luck of all nearby enemies. All enemies in a 20ft radius make a Spirit save (DC 16). On a fail, their probability is drained, giving them disadvantage on all attack rolls and saving throws for 3 rounds. Meanwhile, you gain advantage on all rolls for 3 rounds. Costs 5 Fortune Points (5d4 psychic damage) to activate.",
      level: 6,
      spellType: "ACTION",
      icon: "Psychic/Mind Roar",
      typeConfig: {
        school: "psychic",
        icon: "Psychic/Mind Roar",
        tags: ["debuff", "buff"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 60,
        aoeShape: "circle",
        aoeParameters: { radius: 20 },
        targetRestrictions: ["enemy"],
      },
      resourceCost: {
        actionPoints: 2,
        resourceTypes: ["mana"],
        resourceValues: { mana: 20 },
        classResource: { type: "fortune_points", cost: 5 },
      },
      resolution: "NONE",
      effectTypes: ["debuff", "buff"],
      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          {
            id: "house_advantage_stolen_luck",
            name: "Stolen Luck",
            description: "Disadvantage on attack rolls and saving throws.",
            statPenalty: {
              stat: "attack_and_saves",
              magnitude: -99,
              magnitudeType: "disadvantage",
            },
          },
        ],
        durationValue: 3,
        durationType: "rounds",
        durationUnit: "rounds",
        savingThrow: {
          ability: "spirit",
          difficultyClass: 16,
          saveOutcome: "negates",
        },
      },
      buffConfig: {
        buffType: "combatAdvantage",
        effects: [
          {
            id: "house_advantage_buff",
            name: "House Advantage",
            description: "Advantage on all rolls for the duration.",
          },
        ],
        durationValue: 3,
        durationType: "rounds",
        durationUnit: "rounds",
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 5 },
      specialMechanics: {
        fortunePoints: {
          cost: 5,
          description: "Spend 5 FP (5d4 psychic damage) to steal luck from all nearby foes.",
        },
      },
      tags: ["debuff", "buff", "luck", "gambler"],
    },

    {
      id: "gambler_card_shark",
      name: "Card Shark",
      description: "Draw a card from a deck of flayed leather. Resolve based on the suit: Spades (deal 6d8 force damage), Hearts (heal 5d8 HP), Diamonds (gain 30 damage shield for 1 minute), Clubs (target stunned for 2 rounds, Spirit DC 15 negates). Generates 1 Fortune Point, dealing 1 HP damage to you.",
      level: 6,
      spellType: "ACTION",
      icon: "Psychic/Mental Chaos",
      typeConfig: {
        school: "force",
        icon: "Psychic/Mental Chaos",
        tags: ["rollable_table", "variable"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: ["enemy", "ally"],
      },
      resourceCost: {
        actionPoints: 1,
        resourceTypes: ["mana"],
        resourceValues: { mana: 22 },
        components: ["somatic"],
        somaticText: "Draw a flayed leather card",
      },
      resolution: "DICE",
      effectTypes: ["utility"],
      rollableTable: {
        enabled: true,
        name: "Card Shark Effects",
        description: "Draw 1d4 and consult the table",
        resolutionType: "DICE",
        resolutionConfig: { diceType: "1d4" },
        entries: [
          { min: 1, max: 1, result: "Spades — Deal 6d8 force damage to target", weight: 1 },
          { min: 2, max: 2, result: "Hearts — Heal target for 5d8 HP", weight: 1 },
          { min: 3, max: 3, result: "Diamonds — Target gains a shield absorbing 30 damage for 1 minute", weight: 1 },
          { min: 4, max: 4, result: "Clubs — Target is stunned for 2 rounds (Spirit DC 15 save negates)", weight: 1 },
        ],
      },
      specialMechanics: {
        fortunePoints: {
          generates: 1,
          description: "Generates 1 FP on draw, inflicting 1 HP damage.",
        },
        gamblingGame: {
          gameType: "poker",
          description: "Draw a card from a magical deck — suit determines the effect",
          resolution: "CARDS",
          rules: { drawCount: 1, deckType: "standard_suits", suits: 4 },
          outcomeTiers: [
            { condition: "spades", name: "Spades", damage: "6d8 force", fpGain: 1, fpCost: 1 },
            { condition: "hearts", name: "Hearts", healing: "5d8 HP", fpGain: 1, fpCost: 1 },
            { condition: "diamonds", name: "Diamonds", shield: "30 damage", fpGain: 1, fpCost: 1 },
            { condition: "clubs", name: "Clubs", control: "stun 2 rounds", fpGain: 1, fpCost: 1 },
          ],
        },
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },
      tags: ["damage", "healing", "control", "variable", "rollable_table", "gambler"],
    },

    {
      id: "gambler_poker_face",
      name: "Poker Face",
      description: "Project an aura of complete, chattering void, becoming entirely immune to charm, fear, and mind-reading effects for 5 rounds. Costs 5 Fortune Points (5d4 psychic damage) to activate.",
      level: 6,
      spellType: "ACTION",
      icon: "General/Fiery Rage",
      typeConfig: {
        school: "force",
        icon: "General/Fiery Rage",
        tags: ["buff", "immunity"],
        castTime: 1,
        castTimeType: "FREE",
      },
      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },
      resourceCost: {
        actionPoints: 0,
        resourceTypes: ["mana"],
        resourceValues: { mana: 20 },
        classResource: { type: "fortune_points", cost: 5 },
      },
      resolution: "NONE",
      effectTypes: ["buff"],
      buffConfig: {
        buffType: "statusEffectBuff",
        effects: [
          {
            id: "poker_face_immunity",
            name: "Poker Face Facade",
            description: "Immune to charm, fear, and mind-reading effects.",
            statusImmunities: ["charm", "fear", "mind_reading"],
          },
        ],
        durationValue: 5,
        durationType: "rounds",
        durationUnit: "rounds",
      },
      specialMechanics: {
        fortunePoints: {
          cost: 5,
          description: "Spend 5 FP (5d4 psychic damage) to become mentally unreadable.",
        },
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 4 },
      tags: ["buff", "immunity", "mental", "gambler"],
    },

    // ========================================
    // LEVEL 7 SPELLS - Competitive Execution
    // ========================================
    {
      id: "gambler_death_roll",
      name: "Death Roll",
      description: "Force an enemy into a competitive match of Death Roll. Unwilling targets make a Spirit save (DC 15) to resist. You both take turns rolling a d20. The lower roll becomes the new ceiling. The first to roll over the current ceiling loses, taking 1-10d10 psychic damage (winner's choice) and becoming stunned for 1 round. You may spend Fortune Points mid-game to stay under the ceiling (1d4 psychic damage per FP spent).",
      level: 7,
      spellType: "ACTION",
      icon: "Necrotic/Demonic Empowerment",
      typeConfig: {
        school: "psychic",
        icon: "Necrotic/Demonic Empowerment",
        tags: ["competitive", "damage", "control"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: ["enemy"],
      },
      resourceCost: {
        actionPoints: 2,
        resourceTypes: ["mana"],
        resourceValues: { mana: 24 },
        components: ["verbal", "somatic"],
        verbalText: "Let us roll for your soul...",
      },
      resolution: "DICE",
      effectTypes: ["damage", "control"],
      damageConfig: {
        formula: "10d10",
        damageTypes: ["psychic"],
        resolution: "DICE",
      },
      controlConfig: {
        controlType: "incapacitation",
        duration: 1,
        durationUnit: "rounds",
        effects: [
          {
            id: "death_roll_stun",
            name: "Death Roll Defeat",
            description: "Stunned for 1 round on losing the Death Roll.",
          },
        ],
      },
      specialMechanics: {
        fortunePoints: {
          optionalCost: "1-10 FP",
          description: "Spend FP during the roll sequence to stay under the ceiling (1d4 psychic damage per point spent).",
        },
        gamblingGame: {
          gameType: "death_roll",
          description: "A competitive d20 rolling match to establish a shrinking ceiling. The loser takes massive psychic damage.",
          resolution: "DICE",
          rules: { diceType: "d20", startCeiling: 20 },
        },
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 6 },
      tags: ["competitive", "damage", "control", "gambler"],
    },

    {
      id: "gambler_all_or_nothing",
      name: "All or Nothing",
      description: "Flip a high-stakes coin wreathed in screaming cosmic force. Heads: deal 12d6 force damage to all enemies in a 30ft radius, and stun them for 1 round (Spirit DC 16 save negates). Tails: the spell backfires, dealing 6d6 force damage to you. You may spend 1 Fortune Point (1d4 psychic damage) to flip the result. Generates 3 FP on heads (inflicting 3 HP damage).",
      level: 7,
      spellType: "ACTION",
      icon: "Utility/Utility",
      typeConfig: {
        school: "force",
        icon: "Utility/Utility",
        tags: ["damage", "aoe", "coin_flip", "ultimate"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 50,
        aoeShape: "circle",
        aoeParameters: { radius: 30 },
        targetRestrictions: ["enemy"],
      },
      resourceCost: {
        actionPoints: 2,
        resourceTypes: ["mana"],
        resourceValues: { mana: 25 },
        classResource: { type: "fortune_points", cost: 6 },
      },
      resolution: "COINS",
      effectTypes: ["damage", "control"],
      damageConfig: {
        formula: "12d6",
        damageTypes: ["force"],
        resolution: "DICE",
      },
      controlConfig: {
        controlType: "incapacitation",
        duration: 1,
        durationUnit: "rounds",
        savingThrow: {
          ability: "spirit",
          difficultyClass: 16,
          saveOutcome: "negates",
        },
        effects: [
          {
            id: "all_or_nothing_stun",
            name: "Stunned",
            description: "Enemies who fail the save are stunned for 1 round.",
          },
        ],
      },
      specialMechanics: {
        coinFlip: {
          heads: { effect: "deal_damage", description: "Deal 12d6 force damage to enemies in 30ft radius, stunning those who fail a Spirit DC 16 save for 1 round." },
          tails: { effect: "self_damage", description: "Take 6d6 force damage yourself." },
        },
        fortunePoints: {
          cost: 6,
          generates: 3,
          optionalCost: "1 FP",
          description: "Costs 6 FP to cast. Generates 3 FP on heads (3 HP damage). Spend 1 FP to flip the result (1d4 psychic damage).",
        },
        gamblingGame: {
          gameType: "coin_flip",
          description: "High-stakes coin toss — heads devastates enemies, tails wrecks you.",
          resolution: "COINS",
          rules: { flipCount: 1 },
          outcomeTiers: [
            { condition: "heads", name: "Heads", damage: "12d6 force", fpGain: 3, fpCost: 3 },
            { condition: "tails", name: "Tails", selfDamage: "6d6 force", fpGain: 0 },
          ],
        },
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 8 },
      tags: ["damage", "aoe", "coin_flip", "ultimate", "gambler"],
    },

    // ========================================
    // LEVEL 8 SPELLS - The Divine Slot Machine
    // ========================================
    {
      id: "gambler_jackpot",
      name: "Jackpot",
      description: "Roll 3d20 bone dice. The sum of the roll determines your tier of fortune: 3 (Catastrophic: take 5d10 necrotic damage, go Bust), 4-12 (Bad Luck: take 2d6 force damage, gain 1 FP), 13-25 (Small Win: deal 2d10 force damage, gain 1 FP), 26-38 (Moderate Win: deal 4d10 force damage and stun for 1 round, gain 1 FP), 39-48 (Big Win: deal 6d10 force damage and stun for 2 rounds, gain 2 FP), 49-55 (Massive Win: deal 8d10 radiant damage AoE, gain 2 FP), 56-59 (Near Jackpot: deal 10d10 radiant damage AoE, heal 30 HP, gain 3 FP), 60 (Perfect Jackpot: deal 10d10 radiant damage AoE, max damage on all attacks for 1 hour, gain 5 FP). Suffer 1 HP damage per FP gained. Spend FP to adjust individual dice by ±1 per point (1d4 psychic damage per FP spent).",
      level: 8,
      spellType: "ACTION",
      icon: "Utility/Utility",
      typeConfig: {
        school: "psychic",
        icon: "Utility/Utility",
        tags: ["ultimate", "random", "high_risk"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: ["enemy"],
      },
      resourceCost: {
        actionPoints: 2,
        resourceTypes: ["mana"],
        resourceValues: { mana: 28 },
        components: ["verbal", "somatic"],
        verbalText: "JACKPOT!",
      },
      resolution: "DICE",
      effectTypes: ["utility"],
      specialMechanics: {
        fortunePoints: {
          generates: "variable",
          optionalCost: "1-10 FP",
          description: "Siphons 1-5 FP depending on win tier (1 HP cost per FP gained). Spend FP to nudge individual dice results (1d4 psychic damage per point spent).",
        },
        gamblingGame: {
          gameType: "slot_machine",
          description: "Roll 3d20 — sum determines your payload tier.",
          resolution: "DICE",
          rules: { diceCount: 3, dieType: 20 },
          outcomeTiers: [
            { condition: "60", name: "Perfect Jackpot", damage: "10d10 radiant AoE + max damage 1hr", fpGain: 5, fpCost: 5 },
            { condition: "56-59", name: "Near Jackpot", damage: "10d10 radiant AoE + heal 30", fpGain: 3, fpCost: 3 },
            { condition: "49-55", name: "Massive Win", damage: "8d10 radiant AoE", fpGain: 2, fpCost: 2 },
            { condition: "39-48", name: "Big Win", damage: "6d10 force + stun 2 rounds", fpGain: 2, fpCost: 2 },
            { condition: "26-38", name: "Moderate Win", damage: "4d10 force + stun 1 round", fpGain: 1, fpCost: 1 },
            { condition: "13-25", name: "Small Win", damage: "2d10 force", fpGain: 1, fpCost: 1 },
            { condition: "4-12", name: "Bad Luck", selfDamage: "2d6 force", fpGain: 1 },
            { condition: "3", name: "Catastrophic Failure", selfDamage: "5d10 necrotic + Bankruptcy", fpGain: 0 },
          ],
        },
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 6 },
      tags: ["ultimate", "random", "high_risk", "gambler"],
    },

    {
      id: "gambler_weighted_dice",
      name: "Weighted Dice",
      description: "Cheat the cosmos entirely. Deal 14d6 force damage to a target. For each Fortune Point spent (up to 7), you may treat one d6 as an automatic 6. Spend 7 FP and half your dice are guaranteed maximum. This is pure, unmitigated theft of chance—because the best gamblers know when to cheat. Spend triggers Calculated Risk (1d4 psychic damage per point spent).",
      level: 8,
      spellType: "ACTION",
      icon: "Social/Dice Roll",
      typeConfig: {
        school: "force",
        icon: "Social/Dice Roll",
        tags: ["damage", "guaranteed"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 50,
        targetRestrictions: ["enemy"],
      },
      resourceCost: {
        actionPoints: 1,
        resourceTypes: ["mana"],
        resourceValues: { mana: 28 },
        classResource: { type: "fortune_points", cost: 7 },
      },
      resolution: "DICE",
      effectTypes: ["damage"],
      damageConfig: {
        formula: "14d6",
        damageTypes: ["force"],
        canCrit: true,
        critMultiplier: 2,
        resolution: "DICE",
      },
      specialMechanics: {
        fortunePoints: {
          cost: 7,
          description: "Spend up to 7 FP (1d4 psychic damage per FP spent) to force d6s to roll 6.",
        },
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 5 },
      tags: ["damage", "guaranteed", "fortune_point_spending", "gambler"],
    },

    // ========================================
    // LEVEL 9 SPELLS - High Wagers
    // ========================================
    {
      id: "gambler_high_roller",
      name: "High Roller",
      description: "Wager everything on a single throw. Roll a d20. On a 15+, deal 18d6 + Charisma force damage to a single enemy. On a 6-14, deal half damage. On a 1-5, your body implodes, dealing the full 18d6 + Charisma force damage to yourself. Spend Fortune Points to adjust the roll (1d4 psychic damage per point spent).",
      level: 9,
      spellType: "ACTION",
      icon: "Social/Dice Roll",
      typeConfig: {
        school: "force",
        icon: "Social/Dice Roll",
        tags: ["damage", "high_risk"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 90,
        targetRestrictions: ["enemy"],
      },
      resourceCost: {
        actionPoints: 2,
        resourceTypes: ["mana"],
        resourceValues: { mana: 32 },
        classResource: { type: "fortune_points", cost: 8 },
      },
      resolution: "DICE",
      effectTypes: ["damage"],
      damageConfig: {
        formula: "18d6 + charisma",
        damageTypes: ["force"],
        resolution: "DICE",
      },
      specialMechanics: {
        highRoll: {
          diceFormula: "1d20",
          success: { min: 15, effect: "deal_damage_to_target" },
          neutral: { min: 6, max: 14, effect: "deal_half_damage" },
          failure: { max: 5, effect: "deal_damage_to_self" },
        },
        fortunePoints: {
          cost: 8,
          optionalCost: "1-10 FP",
          description: "Costs 8 FP to cast. Spend FP to adjust your d20 roll (1d4 psychic damage per point spent).",
        },
        gamblingGame: {
          gameType: "high_card",
          description: "Roll a d20 — high rolls incinerate targets, low rolls implode your body.",
          resolution: "DICE",
          rules: { diceType: "d20", successThreshold: 15, neutralRange: "6-14", failureThreshold: 5 },
          outcomeTiers: [
            { condition: "15+", name: "High Card Success", damage: "18d6 + CHA force", fpGain: 3, fpCost: 3 },
            { condition: "6-14", name: "Neutral Push", damage: "9d6 + CHA/2 force (half)", fpGain: 1, fpCost: 1 },
            { condition: "1-5", name: "Low Card Failure", selfDamage: "18d6 + CHA force", fpGain: 0 },
          ],
        },
      },
      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      tags: ["damage", "high_risk", "gambler"],
    },

    {
      id: "gambler_jackpot_surge",
      name: "Jackpot Surge",
      description: "Pull the lever of probability. Roll 3d6. Deal 16d6 + Charisma force damage to all enemies in a 25ft radius (Agility DC 19 save for half). If you roll a pair of matching numbers, the damage is doubled. If you roll three-of-a-kind, it is quadrupled. Generates 5 FP on a triple, 3 FP on a pair, and 1 FP on no match (suffering 1 HP damage per FP generated).",
      level: 9,
      spellType: "ACTION",
      icon: "Radiant/Radiant Glow",
      typeConfig: {
        school: "force",
        icon: "Radiant/Radiant Glow",
        tags: ["damage", "aoe", "high_reward"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 60,
        aoeShape: "circle",
        aoeParameters: { radius: 25 },
        targetRestrictions: ["enemy"],
      },
      resourceCost: {
        actionPoints: 3,
        resourceTypes: ["mana"],
        resourceValues: { mana: 34 },
        classResource: { type: "fortune_points", cost: 8 },
      },
      resolution: "DICE",
      effectTypes: ["damage"],
      damageConfig: {
        formula: "16d6 + charisma",
        damageTypes: ["force"],
        savingThrow: {
          ability: "agility",
          difficultyClass: 19,
          saveOutcome: "half_damage",
        },
        resolution: "DICE",
      },
      specialMechanics: {
        fortunePoints: {
          cost: 8,
          generates: "variable",
          description: "Costs 8 FP to cast. Generates 1, 3, or 5 FP (1 HP damage per FP gained).",
        },
        gamblingGame: {
          gameType: "slot_machine",
          description: "Roll 3d6 — matching dice multiply damage exponentially.",
          resolution: "DICE",
          rules: { diceCount: 3, dieType: 6 },
          outcomeTiers: [
            { condition: "3_match", name: "Three-of-a-kind (4x damage)", multiplier: 4, fpGain: 5, fpCost: 5 },
            { condition: "2_match", name: "Pair (2x damage)", multiplier: 2, fpGain: 3, fpCost: 3 },
            { condition: "no_match", name: "No Match (1x damage)", multiplier: 1, fpGain: 1, fpCost: 1 },
          ],
        },
      },
      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      tags: ["damage", "aoe", "high_reward", "gambler"],
    },

    {
      id: "gambler_fortune_reversal",
      name: "Fortune Reversal",
      description: "A terrifying swap of life essence. Flip a coin. Heads: swap your current HP percentage with a target enemy's HP percentage. Tails: the swap fails, but you learn their current and max HP and gain advantage on your next attack against them. You can spend 1 Fortune Point (1d4 psychic damage) to force the coin to flip its result.",
      level: 9,
      spellType: "ACTION",
      icon: "Arcane/Rewind Time",
      typeConfig: {
        school: "force",
        icon: "Arcane/Rewind Time",
        tags: ["utility", "coin_flip", "high_risk"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: ["enemy"],
      },
      resourceCost: {
        actionPoints: 2,
        resourceTypes: ["mana"],
        resourceValues: { mana: 34 },
        classResource: { type: "fortune_points", cost: 8 },
      },
      resolution: "COINS",
      effectTypes: ["utility"],
      utilityConfig: {
        utilityType: "fate_manipulation",
        selectedEffects: [
          {
            id: "fortune_reversal_swap",
            name: "Percentage Swap",
            description: "Swap HP percentages on heads; learn stats and gain advantage on tails.",
          },
        ],
        duration: 0,
        durationUnit: "instant",
      },
      specialMechanics: {
        coinFlip: {
          heads: { effect: "swap_hp_percentage", description: "Your HP% and target HP% are swapped." },
          tails: { effect: "intel_consolation", description: "Learn current/max HP and gain advantage on next attack against target." },
        },
        fortunePoints: {
          cost: 8,
          optionalCost: "1 FP",
          description: "Costs 8 FP to cast. Spend 1 FP to force heads (1d4 psychic damage spent).",
        },
      },
      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      tags: ["utility", "coin_flip", "high_risk", "gambler"],
    },

    // ========================================
    // LEVEL 10 SPELLS - Apocalyptic Endgames
    // ========================================
    {
      id: "gambler_all_in",
      name: "All-In",
      description: "Wager your entire physical form on a single d100 roll. Each Fortune Point spent (up to 10) shrinks the death window by 1%. At 0 FP spent: 1-50 (double your current HP), 51-90 (heal to full HP), 91-100 (drop to 0 HP and immediately plunge into Cosmic Bankruptcy). At 10 FP spent, the death window is eliminated entirely. Suffer Calculated Risk psychic damage for each FP spent.",
      level: 10,
      spellType: "ACTION",
      icon: "Social/Dice Roll",
      typeConfig: {
        school: "psychic",
        icon: "Social/Dice Roll",
        tags: ["ultimate", "life_or_death", "high_risk"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },
      resourceCost: {
        actionPoints: 2,
        resourceTypes: ["mana"],
        resourceValues: { mana: 36 },
        classResource: { type: "fortune_points", cost: 10 },
      },
      resolution: "DICE",
      effectTypes: ["healing", "utility"],
      specialMechanics: {
        fortunePoints: {
          cost: 10,
          description: "Spend up to 10 FP (1d4 psychic damage per FP spent) to shrink the death window by 1% per point.",
        },
        gamblingGame: {
          gameType: "d100_wager",
          description: "Roll a d100 — double your health, heal to full, or suffer instant death and Bankruptcy.",
          resolution: "DICE",
          rules: { diceType: "d100" },
        },
      },
      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      tags: ["ultimate", "life_or_death", "high_risk", "gambler"],
    },

    {
      id: "gambler_divine_jackpot",
      name: "Divine Jackpot",
      description: "Flip a coin wreathed in screaming cosmic fire. Heads: deal 20d6 force damage to all enemies in a 60ft radius. Enemies below 50% HP must succeed on a Spirit DC 20 save or be stunned for 2 rounds. Tails: your heart stops and you take 20d6 force damage, but you survive at 1 HP with advantage on all rolls for 1 round. You may spend 1 Fortune Point (1d4 psychic damage) to flip the coin result.",
      level: 10,
      spellType: "ACTION",
      icon: "Utility/Utility",
      typeConfig: {
        school: "force",
        icon: "Utility/Utility",
        tags: ["damage", "coin_flip", "ultimate"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "sight",
        rangeDistance: 120,
        aoeShape: "circle",
        aoeParameters: { radius: 60 },
        targetRestrictions: ["enemy"],
      },
      damageConfig: {
        formula: "20d6",
        damageTypes: ["force"],
        resolution: "DICE",
      },
      controlConfig: {
        controlType: "incapacitation",
        duration: 2,
        durationUnit: "rounds",
        savingThrow: {
          ability: "spirit",
          difficultyClass: 20,
          saveOutcome: "negates",
        },
        effects: [
          {
            id: "divine_jackpot_stun",
            name: "Divine Stun",
            description: "Stunned for 2 rounds on a failed save.",
          },
        ],
      },
      resourceCost: {
        actionPoints: 3,
        resourceTypes: ["mana"],
        resourceValues: { mana: 38 },
        classResource: { type: "fortune_points", cost: 10 },
      },
      specialMechanics: {
        coinFlip: {
          heads: { effect: "deal_damage", description: "Deal 20d6 force damage to all enemies in a 60ft radius." },
          tails: { effect: "fortune_mercy", description: "Take 20d6 force damage, surviving at 1 HP with advantage on all rolls for 1 round." },
        },
        fortunePoints: {
          cost: 10,
          optionalCost: "1 FP",
          description: "Costs 10 FP to cast. Spend 1 FP to flip the result (1d4 psychic damage spent).",
        },
      },
      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      resolution: "COINS",
      tags: ["damage", "coin_flip", "ultimate", "gambler"],
    },
  ],
};
