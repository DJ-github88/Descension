export const GAMBLER_DATA = {
  id : "gambler",
  name: "Gambler",
  icon: "fas fa-dice",
  role: "Damage / Utility",
  damageTypes: ["force", "psychic", "necrotic"],

  overview: {
    originStory: `The pirate captain Jax wagered his own lifeline in a game of dice against a freezing storm-spirit of the Iceheart Sea, seeking a wind that would blow his ice-locked vessel out of the grinding floes. He rolled three sixes, claiming the wind, but the spirit did not leave empty-handed; it claimed the warmth of his blood, synchronizing his pulse with the deep rifts.

The gambler's heartbeat was permanently synchronized with the ocean's tides, preventing him from ever finding sleep unless his head is submerged in freezing saltwater. If he remains on dry land for too long, his blood begins to clot and stagnate, and his mind slips into a state of wild, risk-seeking paranoia, mapping his fortunes on his tattooed skin.

Flip the coin. Bet it all. Fortune is a fickle mistress, and she demands your life as the stake. Roll the dice before the tide turns.`,
    title: "The Desperate Debtor",
    subtitle: "The Probability Siphon",

    quickOverview: {
      title: "Quick Overview",
      content: `**What You Need to Know**: The Gambler is a gaunt, high-strung Desperate Debtor who bartered their natural luck to an extraplanar collector. Now they must siphon probability from the world around them through coin flips, die throws, and card draws—enduring intense physical and mental strain as the price of stolen fortune.

**Core Mechanic (Nudge & Wager)**: You generate Fortune Points (FP) through violent coin-flips, die throws, and card siphoning. You spend these points to manipulate the exact math of active d20 rolls, adjusting results by ±1 per point *after* they are rolled.

**The Debtor's Tax (Probability Strain)**: Banked luck demands a toll of stamina. Every single time you gain or bank a Fortune Point from a successful hit or winning gamble, you suffer 1 immediate, unpreventable HP damage as your body serves as collateral for the cosmic debt.

**Playstyle**: High-risk, high-exertion build-and-spend economy. You walk a knife-edge between spectacular fortune-manipulation and total probability collapse. If your FP pool drops to zero or you fail a critical gamble, you go Bust.`,
    },

    description: `A tragic ledger written in stolen luck and grinding exertion. The Gambler does not play for gold or glory; they play for the next calculated breath. Having bartered their soul-anchored fortune to a cosmic debt collector, their nerves hum with the kinetic charge of stolen probability. To twist fate is to push the self past its limits—a physical and mental sacrifice that leaves them hollowed-out, gaunt, and perpetually on the verge of bankruptcy.`,

    roleplayIdentity: {
      title: "Roleplay Identity",
      content: `**HISTORY: THE GENESIS**
The gambler's risk-based magic was born in the floating alleys of <LoreLink termId="merrowport">Merrowport</LoreLink>. A Merryn pirate captain named **Jax** wagered his own lifeline to navigate a vessel through a perpetual storm-cycle. The price of this luck-manipulation was perpetual insomnia. His heartbeat was permanently synchronized with the churning of the freezing waves, preventing him from ever finding rest.

**CITIES & CIVIL RECEPTION**
Gamblers are highly celebrated in the tavern-decks of Merrowport, but they are viewed with clinical contempt by the Neth pact-lords of <LoreLink termId="ironjaw_port">Ironjaw Port</LoreLink>.

**RACES & CULTURAL AFFILIATION**
The class is almost exclusively practiced by the Merryn humans and the <LoreLink termId="myrathil">Breakers-Born Myrathil</LoreLink>.

**NOTABLE FIGURES**
* **Jax the Storm-Wagerer**: The pirate who gambled his soul for a gale and lost his sleep to the ocean's tides.
* **Elysia the Gilded Die**: A notorious high roller who won the charter of <LoreLink termId="merrowport">Merrowport</LoreLink> in a high-stakes dice game against a sea-spirit.`
    },

    signatureQuote: {
      text: '"I do not gamble against the house. I am the house. The stakes are your luck, and I am very, very good at collecting."',
      speaker: 'Jax the Storm-Wagerer',
      context: 'Said to a sea-spirit who tried to cheat him; he still won'
    },

    philosophy: {
      coreTenet: 'Everything is a bet. Love, war, survival, the weather — every moment is a wager between you and the universe. Most people do not realize they are playing. The Gambler does. They know the game is rigged, and they have learned to rig it back.',
      relationship: 'Gamblers do not have good luck — they have stolen luck. They bartered their original fortune to an extraplanar collector in exchange for the ability to manipulate probability on command. But stolen luck does not regenerate. Every Fortune Point spent was once a genuine stroke of good fortune that the Gambler had in their future. They are spending their own tomorrows to win today.',
      paradox: 'The Gambler controls luck — but they cannot be lucky themselves. Every Fortune Point they use costs them 1 unpreventable HP. They are bleeding their own future luck in the form of physical damage. A Gambler who uses their power excessively will find themselves in a permanent state of misfortune: doors slam in their face, food spoils instantly, allies trip at critical moments. The universe always balances the ledger, and the Gambler always pays.'
    },

    currentCrisis: `The Storm-Spirit is calling in Jax\'s debt. When Jax bargained for a favorable wind, he wagered "the warmth of his blood" — a poetic phrase he assumed was metaphor. The spirit just sent a collector to Merrowport with a written demand: Jax\'s heartbeat is now forfeit.

Jax is missing. His ship, the Last Wager, is gone from its berth. His first mate reports that he was seen walking into the Iceheart Sea at midnight, fully clothed, with a smile on his face and a loaded die in his hand. The other Gamblers of Merrowport have formed a search party, but they suspect the truth: Jax knew the terms better than anyone, and he calculated that his life was worth exactly one final game. If he wins, the debt is cleared for every Gambler who ever bargained with the Sea-Spirit. If he loses, the Iceheart Sea claims another captain.`,

    meaningfulTradeoffs: `A Gambler can never stop. The addiction is not psychological — it is physiological. The collateral damage from stored Fortune Points creates a constant, low-grade physical suffering that only a bet can relieve. Gamblers develop compulsive gambling habits not because they want to, but because the pain of unspent Fortune is worse than the pain of spending it. They gamble on anything — coin flips, dice throws, the exact time a candle will gutter out. It is not a vice. It is a symptom.`,

    classSpecificLocations: [
      {
        name: 'The House of Eighty-Eight Doors',
        locationId: 'merrowport',
        description: 'The most notorious gambling den in Merrowport, built in a former smuggler\'s warehouse with exactly eighty-eight doors (no one has found them all). Gamblers gather here to wager on anything — dice, cards, the sex of an unhatched fish, the exact number of rain-drops that will hit a specific roof-tile during a storm. The house takes a 10% cut and guarantees fair play by employing a retired Gambler as the pit boss.',
        purpose: 'Gambling den, social hub, and informal Gambler guild hall',
        status: 'Active — Jax\'s empty chair at the high-stakes table has become a shrine'
      }
    ],

    combatRole: {
      title: "Combat Role",
      content: `**Why Bring Me?**: Perfect threshold control. The Gambler possesses the exclusive capacity to manipulate the exact math of active d20 rolls. By spending banked Fortune Points, they can squeeze a close failure into a success or drag an enemy's saving throw down beneath a crucial threshold. They are the ultimate mathematical safety net—or the spark that ignites a devastating high-stakes payload.

**The Fatal Flaw (Cosmic Bankruptcy)**: Your luck is a compounding loan. If you deplete your Fortune Point pool to absolute zero, or catastrophically fail a major gamble (such as a miss on Double or Nothing or rolling a catastrophic failure on Jackpot), you plunge into Cosmic Bankruptcy. Your systems overload with probability feedback, dealing severe necrotic damage, and you suffer 100% vulnerability to magical Spirit and shadow forces for 2 rounds while unable to generate luck.`,
    },

    playstyle: {
      title: "Playstyle & Strategy",
      content: `Playing the Desperate Debtor requires balancing the raw mathematical power of roll manipulation against your own physical degradation:

**The Turn 1 Loop**:
- Start combat with 1 Fortune Point.
- Immediately lock into the build-and-spend economy using **Lucky Strike** or **Lucky Toss** on Turn 1.
- Bank Fortune Points at the immediate cost of 1 HP per point, then immediately decide whether to hoard them for roll modifications or spend them on devastating active wagers.

**Roll Nudging**:
- After any d20 roll is made (attack roll, saving throw, check), spend Fortune Points to modify the result by ±1 per point.
- Spending FP triggers **Calculated Risk**, inflicting 1d4 psychic damage per point spent. You do not just spend points; you endure agonizing mental strain for them.

**Managing the Void**:
- Never let your Fortune Point pool drop to 0. Always hold a single point in reserve, or the collector's hounds will trigger Cosmic Bankruptcy, locking your abilities and leaving you defenseless.`,
    },

    immersiveCombatExample: {
      title: "Combat Example: The Debt Paid at Iron Gallows",
      content: `**The Setup**: You stand before a hulking, armor-clad inquisitor. Your hands tremble with kinetic energy; the debt is due. You must harvest his probability to keep your systems stable.

**Turn 1 — Harvesting the Collateral (FP: 1 → 3, HP: 45 → 43)**
*You grit your teeth, focusing every nerve into your blade, and cast Lucky Strike!*
Dice roll matches! You deal 14 force damage.
**The Debtor's Tax**: You bank 2 Fortune Points. Your muscles seize and your vision blurs momentarily as you suffer 2 immediate physical damage—the collateral of stolen probability.

**Turn 2 — Nudging the Scales (FP: 3 → 2, HP: 43 → 41)**
*The inquisitor swings his massive hammer. The roll lands exactly on his hit threshold.*
**Reaction**: You spend 1 Fortune Point, channeling intense mental focus to pull the threads of his swing.
**Calculated Risk**: You suffer 1d4 psychic damage (rolling a 2) as a spike of probability feedback lances through your skull.
*The hammer swings wide, missing your shoulder by a fraction of an inch. His luck was yours.*

**Turn 3 — The Ultimate Wager (FP: 2 → 0, HP: 41 → Bankruptcy)**
*Desperate, you cast Double or Nothing, throwing every remaining resource onto the table.*
You roll your weapon die... and it's a natural 1. The kinetic recoil slams back into you like a shockwave.
Your Fortune Points hit 0.
**Cosmic Bankruptcy**: Your probability circuits overload (2d10 necrotic damage). For the next 2 rounds, you are deaf to fate, unable to cast, and 100% vulnerable to his dark spells. The debt collectors have come to collect.`,
    },
  },

  resourceSystem: {
    title: "Fortune Points & Probability Strain",
    subtitle: "The Debtor's Ledger",
    description: "A high-stakes, mathematical resource representing stolen luck and the physical and mental degradation demanded by its extraplanar collectors.",

    cards: [
      {
        title: "Fortune Points (Primary)",
        stats: "7 to 21 Max (Scales by Spec)",
        details: "Vibrating tokens of stolen probability. Generated by coin flips, die rolls, and card draws. Spent after any d20 roll to adjust the result by ±1 per point.",
      },
      {
        title: "Probability Strain (The Debtor's Tax)",
        stats: "1 HP per FP Gained",
        details: "Stolen luck is bought with vitality. Every single time you bank or gain a Fortune Point from any spell or effect, you suffer 1 immediate, unpreventable HP damage as your body channels the cosmic debt.",
      },
      {
        title: "Calculated Risk (The Spending Cost)",
        stats: "1d4 Psychic Damage per FP Spent",
        details: "Pulling the threads of fate strains your mind. Whenever you spend Fortune Points to modify a roll, you suffer 1d4 psychic damage per point spent. Cannot be mitigated.",
      },
    ],

    generationTable: {
      headers: ["Action / Spell", "Fortune Point Change", "Physical Toll (HP)"],
      rows: [
        ["Lucky Strike (Level 1)", "+1 to +3 on match", "−1 HP per point generated"],
        ["Lucky Toss (Level 1)", "+1 on heads", "−1 HP"],
        ["Beginner's Luck (Level 1)", "+1 on cast", "−1 HP"],
        ["Dice Dart (Level 1)", "+1 on cast", "−1 HP"],
        ["Nudge a d20 Roll", "−1 to −X points", "1d4 psychic damage per point spent"],
        ["Cosmic Bankruptcy (0 FP)", "Resets to 0, Locked", "2d10 necrotic damage + 100% Spirit/shadow vulnerability"],
      ],
    },

    usage: {
      nudging: "Modify any d20 roll (attack, save, ability check) by ±1 per Fortune Point spent. Must be declared AFTER the roll is seen, but BEFORE the outcome is narrated.",
      wagers: "Spent as resource requirements for high-stakes Level 2-10 actions (e.g., Death Roll, High Roller, Jackpot).",
      flourish: "⚠️ The Debtor's Tax applies to every single Fortune Point generated—no exceptions. You cannot reduce or prevent the 1 HP damage per FP gained.",
    },

    overheatRules: {
      title: "Cosmic Bankruptcy — Probability Collapse",
      content: "If your Fortune Point pool drops to 0, or you catastrophically fail a major gamble, you plunge into Cosmic Bankruptcy. You immediately suffer 2d10 necrotic damage as probability feedback overloads your systems. For 2 rounds, you are 100% vulnerable to Spirit and shadow damage, unable to generate Fortune Points, and cannot use gambling-based abilities. Recovery requires banking at least 1 Fortune Point through a successful action.",
    },

    rageStatesTable: {
      title: "Fortune Point Thresholds",
      headers: ["State / Phase", "Range", "Unlocked Mechanics", "Strain / Penalty"],
      rows: [
        ["Bust / Empty", "0 FP", "No nudging. Cosmic Bankruptcy triggers.", "Disadvantage on all gambling rolls. Vulnerability active."],
        ["Strapped", "1-3 FP", "Basic nudging. Can modify rolls by ±1-3.", "Debtor's Tax on every gain. Playing it cautious."],
        ["Flush", "4-8 FP", "Mid-tier wagers unlocked. Consistent roll control.", "Calculated Risk psychic damage scales sharply."],
        ["High Roller", "9-14 FP", "Premium wagers and ultimate abilities available.", "Self-damage per cast increases. One bad roll from Bust."],
        ["All-In", "15-21 FP", "Maximum nudging power. All abilities available.", "Extreme risk of catastrophic loss. Every FP spent hurts."],
      ],
    },
  },

  equipment: {
    title: "Starting Equipment",
    choices: [
      {
        name: "Path A — Razor Edge (Melee Gambler)",
        icon: "fas fa-dice",
        items: [
          "Serrated Cane-Sword (1d6 slashing, concealed blade for close-quarters probability siphoning)",
          "Reinforced Leather Vest (Armor 11, Light, no agility penalty)",
          "Set of weighted bone dice",
          "10 steel fortune tokens (crimson and silver)",
        ],
        description: "Maximum melee impact and rapid FP generation through Lucky Strike. Favors aggressive, up-close gambling where every swing is a wager.",
      },
      {
        name: "Path B — Thread Reader (Ranged Gambler)",
        icon: "fas fa-hat-wizard",
        items: [
          "Weighted Throwing Daggers (1d4 piercing, balanced for Lucky Toss and Dice Dart)",
          "Threadcaster's Bracers (Armor 10, Light, +5ft ranged spell distance)",
          "Deck of alchemically treated cards",
          "A vial of focusing salts to steady the nerves",
        ],
        description: "Ranged probability manipulation and utility. Favors careful FP banking from a distance, using card draws and coin flips for controlled, strategic outcomes.",
      },
    ],
    standardGear: [
      "Traveler's backpack with rations (7 days)",
      "Waterskin and bedroll",
      "A debt ledger (bound in worn leather, constantly updating itself)",
      "1d10 × 5 tarnished copper pieces",
    ],
    notes: "Gamblers cannot equip heavy armor or shields. Their probability-based abilities require unrestricted movement and a clear mental state.",
  },

  specializations: {
    title: "Specializations",
    subtitle: "Paths of Probability",
    description: "Specializing allows you to alter how you siphon and wager your stolen fortune. Each path offers a distinct relationship with probability and the collector's debt.",
    specs: [
      { id : "fortunes_favor",
        name: "The Probability Savant",
        icon: "fas fa-brain",
        color: "#2980b9",
        theme: "Mathematical Precision",
        description: "Masters of incremental math. They treat fate as a ledger to be meticulously balanced.",
        playstyle: "Strategic, consistent roll manipulation. You siphon small, steady streams of luck, minimizing high-risk drops and hoarding a small, perfect reserve of nudges.",
        strengths: [
          "Maximum FP capacity set to 13",
          "Calculated Risk damage reduced to 1 per point spent",
          "Advantage on saving throws against mental effects",
        ],
        weaknesses: [
          "Lower single-target burst damage",
          "Vulnerable to heavy physical strikes",
          "Slower maximum FP generation",
        ],
        specPassive: {
          name: "Balanced Ledger",
          description: "Your calculated risk damage is fixed at 1 psychic damage per FP spent instead of 1d4. Your maximum Fortune Point capacity is set to 13. You treat every nudge as a precise, calculated adjustment rather than a reckless gamble.",
        },
      },
      { id : "high_roller",
        name: "The Fortune Wagerer",
        icon: "fas fa-skull",
        color: "#c0392b",
        theme: "Apocalyptic High Rolling",
        description: "Extreme-risk gamblers who push their vital systems to the absolute limit for spectacular, reality-warping results.",
        playstyle: "High stakes, devastating payloads. You wager entire pools of HP and mana for spectacular, bone-rattling force attacks, walking the absolute edge of collapse.",
        strengths: [
          "Maximum FP capacity set to 21",
          "Devastating force damage scaling with spent FP",
          "Generate FP on critical hits and self-damage",
        ],
        weaknesses: [
          "Extremely high self-damage",
          "Highest vulnerability to Cosmic Bankruptcy",
          "Zero defensive utility",
        ],
        specPassive: {
          name: "Double Down",
          description: "When you suffer self-damage from a spell or gamble, you immediately gain 2 Fortune Points (and suffer the 2 HP Debtor's Tax). Your maximum Fortune Point capacity is set to 21. Pain is fuel, and you have learned to convert every shockwave of probability backlash into raw betting power.",
        },
      },
      { id : "card_sharp",
        name: "The Thread Reader",
        icon: "fas fa-spider",
        color: "#8e44ad",
        theme: "Fate Weaving & Card Sharking",
        playstyle: "Strategic deck siphoning and competitive duels. You drag enemies into high-stakes games where you hold all the loaded cards.",
        description: "Obsessive readers who have trained their senses to physically feel and grasp the vibrating strings of destiny, channeling them through focused card manipulation.",
        strengths: [
          "Maximum FP capacity set to 15",
          "Can choose between two drawn cards in Card Shark",
          "High crowd control and forced saving throws",
        ],
        weaknesses: [
          "Highly reliant on card-suit RNG",
          "Requires active targeting and setup",
          "Vulnerable to silence and spirit-shattering magic",
        ],
        specPassive: {
          name: "Loaded Deck",
          description: "Whenever you draw from your magical deck, draw two cards and choose which suit to resolve. Your maximum Fortune Point capacity is set to 15. The deck bends to your focus, giving you unprecedented control over probability outcomes.",
        },
      },
    ],
  },

  spells: [
    // ========================================
    // LEVEL 1 SPELLS — The Fortune Engine
    // ========================================
    { id: "gambler_lucky_strike",
      name: "Lucky Strike",
      description: "Roll 4d12 bone dice before striking. Matching values dictate your strike's devastating power: 4 matching dice deal 4x damage, 3 matching deal 3x, and 2 matching deal 2x. All unique dice deal normal damage. Matches siphon 1, 2, or 3 Fortune Points, but your body pays the toll: suffer 1 immediate HP damage per Fortune Point gained.",
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
        somaticText: "Channel probability into your blade with a sharp, overhand swing",
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
          description: "Generates FP on matching dice. You suffer 1 HP per FP generated as the toll of fortune.",
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
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 0,
      },
      tags: ["melee", "damage", "fortune_generation", "starter", "gambler"],
    },

    { id: "gambler_lucky_toss",
      name: "Lucky Toss",
      description: "Flick a weighted steel coin. Heads: target takes 1d10 + Charisma force damage. Tails: the coin floats, granting the target a shimmering barrier absorbing 10 damage for 1 round. Generates 1 Fortune Point, inflicting 1 immediate HP damage as your body channels the debt.",
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
        somaticText: "Flick a weighted coin with a sharp snap of the wrist",
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
            id : "lucky_toss_shield",
            name: "Floating Fortune",
            description: "Absorbs 10 damage for 1 round.",
            mechanicsText: "Target gains a shield absorbing 10 damage for 1 round.",
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
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 0,
      },
      tags: ["ranged", "damage", "buff", "coin_flip", "starter", "gambler"],
    },

    { id: "gambler_dice_dart",
      name: "Dice Dart",
      description: "Throw a magically weighted bone die at a creature. Deals 1d8 psychic damage. Generates 1 Fortune Point, inflicting 1 HP damage to you. You can spend up to 3 Fortune Points to add +1d6 psychic damage per point, taking 1d4 psychic damage per point spent.",
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
        somaticText: "Hurl a weighted die with a precise, snapping throw",
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
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 0,
      },
      tags: ["ranged", "damage", "fortune_generation", "starter", "gambler"],
    },

    { id: "gambler_beginners_luck",
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
            id : "beginners_luck_buff",
            name: "Beginner's Advantage",
            description: "Advantage on your next attack roll or saving throw.",
            mechanicsText: "Gain advantage on your next attack roll or saving throw within 1 round.",
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
          description: "Plead for luck — gain instant combat advantage at a physical cost.",
          resolution: "AUTOMATIC",
          rules: { duration: 1 },
          outcomeTiers: [
            { condition: "cast", name: "Beggar's Luck", buff: "advantage next roll", fpGain: 1, fpCost: 1 },
          ],
        },
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 0,
      },
      tags: ["buff", "luck", "starter", "gambler"],
    },

    { id: "gambler_calculated_risk",
      name: "Calculated Risk",
      description: "Every twist of probability has a price. When you spend Fortune Points to modify an active d20 roll, intense mental feedback tears through your concentration. You suffer 1d4 psychic damage per Fortune Point spent. This damage cannot be reduced or prevented. Manipulating fate demands exertion.",
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
            id : "calculated_risk_debuff",
            name: "Calculated Risk",
            description: "Suffer 1d4 psychic damage per Fortune Point spent to nudge rolls.",
            mechanicsText: "Suffer 1d4 psychic damage per FP spent on nudging d20 rolls. Cannot be reduced or prevented.",
          },
        ],
        durationValue: 0,
        durationType: "permanent",
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 0,
      },
      tags: ["passive", "weakness", "gambler"],
    },

    { id: "gambler_house_edge",
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
            id : "house_edge_debuff",
            name: "House Edge",
            description: "Rolling a natural 1 on gamble rolls drains all FP and locks generation for 1 round.",
            mechanicsText: "On natural 1 gambling rolls: lose all unspent FP, cannot generate FP until start of next turn.",
          },
        ],
        durationValue: 0,
        durationType: "permanent",
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 0,
      },
      tags: ["passive", "weakness", "gambler"],
    },

    // ========================================
    // LEVEL 2 SPELLS — Risk & Illusion
    // ========================================
    { id: "gambler_coin_toss",
      name: "Coin Toss",
      description: "Flip a heavy iron coin wreathed in probability energy. Heads: gain a +2 bonus to all attack rolls and saving throws for 1 hour. Tails: suffer a -2 penalty to all attack rolls and saving throws for 1 hour. Generates 1 Fortune Point (inflicting 1 HP damage). You can spend 1 Fortune Point (taking 1d4 psychic damage) to force the coin to flip its result.",
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
        somaticText: "Flip a heavy iron coin with deliberate, calculated force",
      },
      resolution: "COINS",
      effectTypes: ["buff", "debuff"],
      buffConfig: {
        buffType: "statusEffectBuff",
        effects: [
          {
            id : "coin_toss_heads",
            name: "Heads — Lady Luck's Smile",
            description: "+2 to all attack rolls and saving throws.",
            mechanicsText: "+2 to all attack rolls and saving throws for 1 hour.",
            statModifier: { stat: "attack_and_saves", magnitude: 2, magnitudeType: "flat" },
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
            id : "coin_toss_tails",
            name: "Tails — Collector's Frown",
            description: "-2 to all attack rolls and saving throws.",
            mechanicsText: "-2 to all attack rolls and saving throws for 1 hour.",
          },
        ],
        statPenalties: [
          { stat: "attack_and_saves", magnitude: -2, magnitudeType: "flat" },
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

    { id: "gambler_insight",
      name: "Gambler's Insight",
      description: "Your heightened, probability-tuned senses lock onto a target. Read their microscopically subtle tells, siphoning their luck. You gain advantage on all Insight and Perception checks against them for 10 minutes. Generates 1 Fortune Point, dealing 1 HP damage to you.",
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
            id : "gamblers_insight_buff",
            name: "Gambler's Insight",
            description: "Advantage on Insight and Perception checks against target.",
            mechanicsText: "Advantage on all Insight and Perception checks against the target for 10 minutes.",
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
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 0,
      },
      tags: ["utility", "social", "gambler"],
    },

    { id: "gambler_fools_gold",
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
        somaticText: "Pull shimmering probability from thin air",
      },
      resolution: "NONE",
      effectTypes: ["utility"],
      utilityConfig: {
        utilityType: "conjuration",
        selectedEffects: [
          {
            id : "fools_gold_wealth",
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
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 0,
      },
      tags: ["utility", "illusion", "gambler"],
    },

    // ========================================
    // LEVEL 3 SPELLS — Prediction & Withdrawal
    // ========================================
    { id: "gambler_taunt_the_odds",
      name: "Taunt the Odds",
      description: "Challenge the math of the universe. Predict a number between 1 and 20, then roll a d20. If your roll is within 3 of your guess, deal 3d10 psychic damage to a target. If you are off by 4 or more, the probability backfires, dealing 1d10 psychic damage to you. You can spend Fortune Points to nudge the d20 roll toward your guess (1d4 psychic damage per point). Gain 1 FP on success (1 HP damage).",
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
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 0,
      },
      tags: ["ranged", "damage", "prediction", "gambler"],
    },

    { id: "gambler_busted",
      name: "Busted",
      description: "When you have 0 Fortune Points, you enter severe probability withdrawal. Your senses dim and your reflexes slow under the collector's gaze. You have disadvantage on all gambling-based resolution rolls (dice rolls, coin flips, card draws used for spell effects) until you bank at least 1 Fortune Point.",
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
            id : "busted_withdrawal",
            name: "Probability Withdrawal",
            description: "Disadvantage on all gambling-based rolls.",
            mechanicsText: "Disadvantage on all gambling-based resolution rolls while at 0 FP. Ends when you bank at least 1 FP.",
          },
        ],
        durationValue: 0,
        durationType: "permanent",
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 0,
      },
      tags: ["passive", "weakness", "gambler"],
    },

    // ========================================
    // LEVEL 4 SPELLS — The Exerting Double Down
    // ========================================
    { id: "gambler_double_or_nothing",
      name: "Double or Nothing",
      description: "Make an all-or-nothing gamble on your physical limits. Make a Unified Strike roll against an enemy. On a hit: it becomes an automatic critical hit dealing double damage (4d10 + Charisma force). On a miss: you suffer the kinetic recoil yourself, taking the damage instead. If this reduces you to 0 HP, you immediately plunge into Cosmic Bankruptcy. Spend Fortune Points to nudge the strike roll (1d4 psychic damage per point spent).",
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
        somaticText: "Wind up a devastating overhand strike with everything on the line",
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
    // LEVEL 5 SPELLS — Probability Acceleration
    // ========================================
    { id: "gambler_hot_streak",
      name: "Hot Streak",
      description: "Let the probability fever take hold. Spend 4 Fortune Points (taking 4d4 psychic damage) to accelerate your stolen probability. For 1 round, each successful attack or spell cast grants a stacking +1d6 force damage to your next strike, up to a maximum of 4 stacks. Each stack siphoned generates 1 FP (and deals 1 HP damage).",
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
            id : "hot_streak_buff",
            name: "Hot Streak Acceleration",
            description: "Each successful attack adds +1d6 force damage, stacking up to 4 times.",
            mechanicsText: "For 1 round, each successful attack/spell adds +1d6 force damage to next strike (max 4 stacks). Each stack generates 1 FP (1 HP cost).",
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

    { id: "gambler_mirage_flip",
      name: "Mirage Flip",
      description: "As a reaction when an attack lands on a target within 30ft, flip a probability-charged coin. Heads: double the damage dealt to the target. Tails: nullify the damage entirely, but suffer 2d6 psychic damage as the probability shockwave rebounds through your concentration. Spend 1 FP (1d4 psychic damage) to force heads.",
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
      buffConfig: {
        buffType: "triggeredEffect",
        effects: [
          {
            id : "mirage_flip_double",
            name: "Mirage Flip — Double Damage",
            description: "Doubles the damage of the triggering attack.",
            mechanicsText: "Double the damage of the triggering attack against the target.",
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
            id : "mirage_flip_nullify",
            name: "Mirage Flip — Nullified Damage",
            description: "Triggering attack's damage is reduced to 0, but you suffer 2d6 psychic damage.",
            mechanicsText: "Nullify triggering attack's damage, but suffer 2d6 psychic damage as probability feedback.",
          },
        ],
        durationValue: 1,
        durationType: "rounds",
        durationUnit: "rounds",
      },
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

    { id: "gambler_fate_reroll",
      name: "Fate Reroll",
      description: "Pull the threads of probability with maximum exertion. Spend 4 Fortune Points (4d4 psychic damage) to force all your d20 rolls this turn to be rolled with advantage. Taking this loan of luck leaves your nerves rattled; you have disadvantage on all saving throws until the start of your next turn.",
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
            id : "fate_reroll_advantage",
            name: "Borrowed Advantage",
            description: "Advantage on all d20 rolls this turn.",
            mechanicsText: "Advantage on all d20 rolls for the current turn.",
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
            id : "fate_reroll_tremble",
            name: "Rattled Nerves",
            description: "Disadvantage on all saving throws.",
            mechanicsText: "Disadvantage on all saving throws until start of your next turn.",
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
    // LEVEL 6 SPELLS — Luck Siphoning
    // ========================================
    { id: "gambler_house_advantage",
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
            id : "house_advantage_stolen_luck",
            name: "Stolen Luck",
            description: "Disadvantage on attack rolls and saving throws.",
            mechanicsText: "Disadvantage on all attack rolls and saving throws for 3 rounds (Spirit DC 16 save negates).",
          },
        ],
        statPenalties: [
          { stat: "attack_and_saves", magnitude: -99, magnitudeType: "disadvantage" },
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
            id : "house_advantage_buff",
            name: "House Advantage",
            description: "Advantage on all rolls for the duration.",
            mechanicsText: "Advantage on all rolls for 3 rounds.",
            statModifier: { stat: "all_rolls", magnitude: 99, magnitudeType: "advantage" },
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

    { id: "gambler_card_shark",
      name: "Card Shark",
      description: "Draw a card from a deck of alchemically treated cards. Resolve based on the suit: Spades (deal 6d8 force damage), Hearts (heal 5d8 HP), Diamonds (gain 30 damage shield for 1 minute), Clubs (target stunned for 2 rounds, Spirit DC 15 negates). Generates 1 Fortune Point, dealing 1 HP damage to you.",
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
        somaticText: "Draw an alchemically charged card with a flourish",
      },
      resolution: "CARDS",
      effectTypes: ["utility"],
      utilityConfig: {
        utilityType: "fate_manipulation",
        selectedEffects: [
          {
            id : "card_shark_draw",
            name: "Draw Fate Card",
            description: "Draw a card and resolve its suit-specific effect: Spades (damage), Hearts (heal), Diamonds (shield), or Clubs (stun).",
          },
        ],
        duration: 1,
        durationUnit: "rounds",
      },
      rollableTable: {
        enabled: true,
        tableName: "Card Shark Effects",
        description: "Draw a card and consult the table",
        resolutionType: "CARDS",
        resolutionConfig: { cardCount: 1, deckType: "standard" },
        entries: [
          { cardPattern: "Spades", effect: "Deal 6d8 force damage to target", result: "Deal 6d8 force damage to target", weight: 1 },
          { cardPattern: "Hearts", effect: "Heal target for 5d8 HP", result: "Heal target for 5d8 HP", weight: 1 },
          { cardPattern: "Diamonds", effect: "Target gains a shield absorbing 30 damage for 1 minute", result: "Target gains a shield absorbing 30 damage for 1 minute", weight: 1 },
          { cardPattern: "Clubs", effect: "Target is stunned for 2 rounds (Spirit DC 15 save negates)", result: "Target is stunned for 2 rounds (Spirit DC 15 save negates)", weight: 1 },
        ],
      },
      specialMechanics: {
        fortunePoints: {
          generates: 1,
          description: "Generates 1 FP on draw, inflicting 1 HP damage.",
        },
        gamblingGame: {
          gameType: "poker",
          description: "Draw a card from a magical deck — suit determines the effect.",
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

    { id: "gambler_poker_face",
      name: "Poker Face",
      description: "Project an aura of absolute, impenetrable calm, becoming entirely immune to charm, fear, and mind-reading effects for 5 rounds. Costs 5 Fortune Points (5d4 psychic damage) to activate.",
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
            id : "poker_face_immunity",
            name: "Poker Face Facade",
            description: "Immune to charm, fear, and mind-reading effects.",
            mechanicsText: "Immune to charm, fear, and mind-reading effects for 5 rounds.",
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
          description: "Spend 5 FP (5d4 psychic damage) to become mentally impenetrable.",
        },
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 4 },
      tags: ["buff", "immunity", "mental", "gambler"],
    },

    // ========================================
    // LEVEL 7 SPELLS — Competitive Execution
    // ========================================
    { id: "gambler_death_roll",
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
        savingThrow: {
          ability: "spirit",
          difficultyClass: 15,
          saveOutcome: "negates",
        },
      },
      controlConfig: {
        controlType: "incapacitation",
        duration: 1,
        durationUnit: "rounds",
        savingThrow: {
          ability: "spirit",
          difficultyClass: 15,
          saveOutcome: "negates",
        },
        effects: [
          {
            id : "death_roll_stun",
            name: "Death Roll Defeat",
            description: "Stunned for 1 round on losing the Death Roll.",
            mechanicsText: "Stunned for 1 round upon losing the Death Roll competition.",
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

    { id: "gambler_all_or_nothing",
      name: "All or Nothing",
      description: "Flip a high-stakes coin wreathed in searing cosmic force. Heads: deal 12d6 force damage to all enemies in a 30ft radius, and stun them for 1 round (Spirit DC 16 save negates). Tails: the spell backfires, dealing 6d6 force damage to you. You may spend 1 Fortune Point (1d4 psychic damage) to flip the result. Generates 3 FP on heads (inflicting 3 HP damage).",
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
            id : "all_or_nothing_stun",
            name: "Stunned",
            description: "Enemies who fail the save are stunned for 1 round.",
            mechanicsText: "Stunned for 1 round on failed Spirit DC 16 save.",
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
    // LEVEL 8 SPELLS — The Divine Slot Machine
    // ========================================
    { id: "gambler_jackpot",
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
      utilityConfig: {
        utilityType: "fate_manipulation",
        selectedEffects: [
          {
            id : "jackpot_pull",
            name: "Pull the Slot",
            description: "Roll 3d20 to determine your payoff tier, ranging from catastrophic failure to a perfect jackpot.",
          },
        ],
        duration: 1,
        durationUnit: "rounds",
      },
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

    { id: "gambler_weighted_dice",
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
    // LEVEL 9 SPELLS — High Wagers
    // ========================================
    { id: "gambler_high_roller",
      name: "High Roller",
      description: "Wager everything on a single throw. Roll a d20. On a 15+, deal 18d6 + Charisma force damage to a single enemy. On a 6-14, deal half damage. On a 1-5, the probability violently backfires, dealing the full 18d6 + Charisma force damage to yourself. Spend Fortune Points to adjust the roll (1d4 psychic damage per point spent).",
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
          description: "Roll a d20 — high rolls devastate targets, low rolls send the force rebounding onto you.",
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

    { id: "gambler_jackpot_surge",
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

    { id: "gambler_fortune_reversal",
      name: "Fortune Reversal",
      description: "A terrifying swap of probability and vitality. Flip a coin. Heads: swap your current HP percentage with a target enemy's HP percentage. Tails: the swap fails, but you learn their current and max HP and gain advantage on your next attack against them. You can spend 1 Fortune Point (1d4 psychic damage) to force the coin to flip its result.",
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
            id : "fortune_reversal_swap",
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
    // LEVEL 10 SPELLS — Apocalyptic Endgames
    // ========================================
    { id: "gambler_all_in",
      name: "All-In",
      description: "Wager your entire physical existence on a single d100 roll. Each Fortune Point spent (up to 10) shrinks the death window by 1%. At 0 FP spent: 1-50 (double your current HP), 51-90 (heal to full HP), 91-100 (drop to 0 HP and immediately plunge into Cosmic Bankruptcy). At 10 FP spent, the death window is eliminated entirely. Suffer Calculated Risk psychic damage for each FP spent.",
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
      healingConfig: {
        formula: "2 * current_hp",
        healingType: "direct",
        resolution: "DICE",
      },
      utilityConfig: {
        utilityType: "fate_manipulation",
        selectedEffects: [
          {
            id : "all_in_wager",
            name: "Life-or-Death Wager",
            description: "Roll d100: double HP, heal to full, or plunge to 0 HP and Cosmic Bankruptcy.",
          },
        ],
        duration: 1,
        durationUnit: "rounds",
      },
      specialMechanics: {
        fortunePoints: {
          cost: 10,
          description: "Spend up to 10 FP (1d4 psychic damage per FP spent) to shrink the death window by 1% per point.",
        },
        gamblingGame: {
          gameType: "d100_wager",
          description: "Roll a d100 — double your health, heal to full, or suffer instant collapse and Bankruptcy.",
          resolution: "DICE",
          rules: { diceType: "d100" },
        },
      },
      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      tags: ["ultimate", "life_or_death", "high_risk", "gambler"],
    },

    { id: "gambler_divine_jackpot",
      name: "Divine Jackpot",
      description: "Flip a coin wreathed in searing cosmic energy. Heads: deal 20d6 force damage to all enemies in a 60ft radius. Enemies below 50% HP must succeed on a Spirit DC 20 save or be stunned for 2 rounds. Tails: your systems overload and you take 20d6 force damage, but you survive at 1 HP with advantage on all rolls for 1 round. You may spend 1 Fortune Point (1d4 psychic damage) to flip the coin result.",
      level: 10,
      spellType: "ACTION",
      icon: "Utility/Utility",
      effectTypes: ["damage", "control"],
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
            id : "divine_jackpot_stun",
            name: "Divine Stun",
            description: "Stunned for 2 rounds on a failed save.",
            mechanicsText: "Stunned for 2 rounds on failed Spirit DC 20 save (enemies below 50% HP only).",
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

      {
        "id": "gambler_cheats_sleight",
        "name": "Cheat's Sleight",
        "description": "Every hand has an ace. Reach into your sleeve and discreetly nudge a physical card, die, or small game piece without being seen, bending local probability to mask your rapid fingers.",
        "level": 2,
        "spellType": "ACTION",
        "icon": "Social/Dice Roll",
        "typeConfig": {
          "school": "force",
          "icon": "Social/Dice Roll",
          "tags": [
            "utility",
            "roleplay",
            "gambler"
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
            "mana": 3
          },
          "components": [
            "somatic"
          ],
          "somaticText": "Flick your wrist with hyper-fast, calculated muscle precision"
        },
        "resolution": "NONE",
        "effectTypes": [
          "buff"
        ],
        "buffConfig": {
          "buffType": "custom",
          "effects": [
            {
              "id": "cheats_sleight_active",
              "name": "Loaded Fingers",
              "description": "Gain advantage on Sleight of Hand checks to cheat at games of chance or palm small objects.",
              "mechanicsText": "Advantage on Sleight of Hand when palming/cheating."
            }
          ],
          "durationValue": 1,
          "durationType": "minutes",
          "durationUnit": "minutes"
        },
        "cooldownConfig": {
          "cooldownType": "turn_based",
          "cooldownValue": 0
        },
        "tags": [
          "utility",
          "roleplay",
          "gambler"
        ]
      },
  ],
};
