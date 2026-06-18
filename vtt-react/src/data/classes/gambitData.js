export const GAMBIT_DATA = {
  id: "gambit",
  name: "Gambit",
  icon: "fas fa-dice",
  role: "Damage / Control",
  damageTypes: ["storm", "wyrd", "blight"],

  classIdentity: {
    title: "The Wagering Architect",
    subtitle: "The Probability Siphon",
    utility: "Absolute d20 outcome manipulation through dual resource systems. They combine stolen Fortune Points with pre-drawn Fate Reserve cards to nudge, override, or replace any active roll on the battlefield. No other class wields both real-time nudging and hard-coded card overrides simultaneously.",
    fatalFlaw: "Dual collapse conditions. Fortune depletion triggers Cosmic Bankruptcy (2d10 necrotic, 100% vulnerability). Karmic Debt overflow triggers Tapestry Collapse (6d10 psychic, incapacitation, Fortune emptied, max HP reduced). Every resource gained costs HP through Debtor's Tax, and every resource spent deals wyrd damage through Calculated Risk. They possess zero defensive multi-target tools and are uniquely vulnerable to sustained physical and spirit-focused attacks."
  },

  spellPools: {
    1: ["gambler_lucky_strike", "gambler_lucky_toss", "gambler_dice_dart", "gambler_beginners_luck", "gambler_calculated_risk", "gambler_house_edge", "hand-of-fate", "war-of-wills", "echoes-of-the-past", "marked-card", "fate_lucky_strike", "fate_twist_probability", "tapestry-shred", "fate-reading_loom", "fate_weaver_deck_exhaustion", "fate_weaver_fates_wrath"],
    2: ["gambler_coin_toss", "gambler_insight", "gambler_fools_gold", "gambler_cheats_sleight", "hearts-gamble", "fate_fortune_favor"],
    3: ["gambler_taunt_the_odds", "gambler_busted", "draw-of-the-damned", "echo-of-fate", "fate_weaver_empty_hand"],
    4: ["gambler_double_or_nothing", "solitaires-shield", "fates-exchange", "destiny-bond"],
    5: ["gambler_hot_streak", "gambler_mirage_flip", "gambler_fate_reroll", "fate_weaver_stacked_deck", "fate_weaver_twist_fate"],
    6: ["gambler_house_advantage", "gambler_card_shark", "gambler_poker_face", "fate_weaver_dealers_choice", "fate_weaver_twenty_one_curses", "fate_weaver_fold_reality"],
    7: ["gambler_death_roll", "gambler_all_or_nothing", "fate_weaver_house_rules", "fate_weaver_all_in", "fate_weaver_destiny_rewritten"],
    8: ["gambler_jackpot", "gambler_weighted_dice", "fate_weaver_the_jokers_hand", "fate_weaver_fate_sealed", "fate_weaver_fates_wager"],
    9: ["gambler_high_roller", "gambler_jackpot_surge", "gambler_fortune_reversal", "fate_weaver_grand_gambit", "fate_weaver_master_of_destiny", "fate_weaver_jackpot_supreme"],
    10: ["gambler_all_in", "gambler_divine_jackpot", "fate_weaver_rewrite_destiny", "fate_weaver_deck_of_many_things", "fate_weaver_casino_royale"]
  },
  overview: {
    originStory: `The Gambit tradition was born from two independent discoveries of probability manipulation, separated by a thousand miles of frozen coastline and later fused into a single, devastating art.

In the floating alleys of Merrowport, the Merryn pirate captain Jax wagered his own lifeline in a game of dice against a freezing storm-spirit of the Iceheart Sea. He rolled three sixes, claiming the wind, but the spirit claimed the warmth of his blood in return. His heartbeat was permanently synchronized with the ocean's tides, preventing him from ever finding sleep unless his head was submerged in freezing saltwater. Jax discovered probability manipulation through gambling: coin flips, dice throws, and card draws that siphoned luck from the world around him.

In the vertical canyons of the Cragjaw Peaks, the Kessen Neth probability-watcher Lyra saw her trade-caravan cornered by a massive rockslide. Rather than outrun the stone, she used her rune-etched cards to pluck the threads of alternate timelines, finding the single reality where her companions survived. The psychic recoil of experiencing all alternate deaths in a single second permanently fractured her consciousness. Lyra discovered probability manipulation through card-reading: weaving the threads of destiny to force absolute outcomes on the battlefield.

The traditions merged when Jax's ship, the Last Wager, docked at Cragjaw during a rare thaw. Lyra was there, reading the fate-threads of the harbor. When their abilities resonated across the dock, the two discovered they were manipulating the same fundamental force: probability itself. Jax approached it as a bet to be won. Lyra approached it as a landscape to be navigated. Together, they founded the Gambit tradition, an art that treats probability as both a wager and a tapestry.

Flip the coin. Read the card. The universe is a game, and the board is yours to reshape. Wager wisely, for the house always collects.`,

    title: "The Wagering Architect",
    subtitle: "The Probability Siphon",

    quickOverview: {
      title: "Quick Overview",
      content: `**What You Need to Know**: The Gambit is a high-strung, dual-resource architect who wields both stolen Fortune Points and pre-drawn Fate Reserve cards. They manipulate probability through gambling mechanics and cartomantic surgery simultaneously, enduring intense physical and mental strain for every twist of fate they command.

**Core Mechanic 1 (Fortune Nudge)**: You generate Fortune Points (FP) through coin flips, die throws, card draws, and successful attacks. You spend these points to nudge any d20 roll by plus or minus 1 per point after the roll is made but before the outcome is resolved.

**Core Mechanic 2 (Fate Reserve Override)**: You draw rune-etched cards and bank them in your Fate Reserve. You spend these banked cards to hard-override d20 rolls, replacing dice results with pre-drawn card values. Face cards and Aces map to high values, numbered cards to their face value.

**Dual Cost System**: Every FP gained costs 1 unpreventable HP damage (Debtor's Tax). Every FP spent deals 1d4 wyrd damage per point (Calculated Risk, irreducible). Every card override generates Karmic Debt, which stacks vulnerability and arcane strain.

**Two Collapse Conditions**: Fortune hitting 0 triggers Cosmic Bankruptcy. Karmic Debt hitting 13 triggers Tapestry Collapse. Both are devastating and can end a fight instantly.

**Playstyle**: Extreme high-risk, high-reward dual-resource management. You walk a knife-edge between two different catastrophic failure states while wielding unmatched control over the battlefield's dice.`,
    },

    description: `A tragic ledger written in stolen luck and severed fate-threads. The Gambit does not play for gold or glory; they play for the next calculated breath. Having fused two ancient traditions of probability manipulation, they wield both the Gambler's raw fortune-siphoning and the Fate Weaver's precise cartomantic surgery. Their nerves hum with the kinetic charge of stolen probability, and their mind splits across fractured timeline threads. To twist fate is to push the self past its limits, a physical and mental sacrifice that leaves them hollowed-out, gaunt, and perpetually on the verge of dual collapse.`,
    roleplayIdentity: {
      title: "Roleplay Identity",
      content: `**HISTORY: THE DUAL GENESIS**
The Gambit's power was born from two founding events. In the floating alleys of Merrowport, the Merryn pirate captain Jax wagered his lifeline against a storm-spirit, discovering probability manipulation through gambling. In the vertical canyons of the Cragjaw Peaks, the Kessen Neth probability-watcher Lyra severed alternate timelines to save her caravan, discovering probability manipulation through card-reading. The traditions merged when Jax's ship docked at Cragjaw and their abilities resonated across the harbor.

**CITIES AND CIVIL RECEPTION**
Gambits are celebrated in the tavern-decks of Merrowport and valued in the canopy-libraries of Atropolis, but they are viewed with clinical contempt by the Neth pact-lords of Ironjaw Port.

**RACES AND CULTURAL AFFILIATION**
The class is practiced by Merryn humans, the Breakers-Born Myrathil, the Kessen Neth, and the fine-scaled Ithran Groven.

**NOTABLE FIGURES**
* Jax the Storm-Wagerer: The pirate who gambled his soul for a gale and lost his sleep to the ocean's tides. Now missing, believed to have walked into the Iceheart Sea for one final game.
* Lyra the Probability-Watcher: The cartomancer who witnessed her friends die in a hundred ways to find the one path where they lived. Now leads the radical Deck-Burners faction, seeking to destroy the Fates themselves.`
    },

    signatureQuote: {
      text: '"I do not gamble against the house. I am the house. The stakes are your luck, and I am very, very good at collecting."',
      speaker: 'Jax the Storm-Wagerer',
      context: 'Said to a sea-spirit who tried to cheat him; he still won'
    },

    philosophy: {
      coreTenet: 'Everything is a bet, and probability is a landscape. Love, war, survival, the weather: every moment is a wager between you and the universe, played on a terrain of shifting threads. Most people walk blindly across both. The Gambit reads the map, knows the game is rigged, and has learned to rig it back.',
      relationship: 'A Gambit wields two forms of stolen power. Fortune Points are banked luck siphoned from the world, paid for in HP through the Debtor\'s Tax. Fate Reserve cards are pre-drawn destiny, paid for in Karmic Debt. Both are borrowed from the Gambit\'s own future. Every FP spent was once a genuine stroke of good fortune waiting in their future. Every card override severs a thread of probability that the universe will eventually demand back. The Gambit is always in debt to two collectors simultaneously.',
      paradox: 'The Gambit controls luck and weaves fate, but cannot be lucky themselves. Every Fortune Point costs 1 unpreventable HP. Every card override accumulates Karmic Debt that amplifies all incoming damage. A Gambit who uses their power excessively bleeds from both resource systems: physical degradation from Fortune strain and temporal strain from Karmic Debt. The universe always balances both ledgers, and the Gambit always pays twice.'
    },

    currentCrisis: `The Gambit tradition faces a dual crisis. Jax is missing. His ship, the Last Wager, vanished from its berth in Merrowport. His first mate reports he was seen walking into the Iceheart Sea at midnight, fully clothed, with a smile on his face and a loaded die in his hand. The Gambits of Merrowport have formed a search party but suspect the truth: Jax walked into the sea to clear his debt with the storm-spirit in one final game.

Simultaneously, Lyra has gone radical. The founder of the Fate Weaver half of the tradition has concluded that Karmic Debt is not a natural law but an artificial construct imposed by an unknown entity. She has gathered the Deck-Burners, a faction pursuing a ritual that will force the universe to choose between the entity and every Gambit alive. If the ritual succeeds, Gambits will be free from Debt. If it fails, the Karmic Debt of every living practitioner will be collected simultaneously. Lyra has not told her followers the second part.`,

    meaningfulTradeoffs: `A Gambit carries two compounding burdens. The Fortune addiction is physiological: the collateral damage from stored Fortune Points creates constant, low-grade physical suffering that only a gamble can relieve. Gambits develop compulsive habits not out of choice but because the pain of unspent Fortune is worse than spending it.

The Karmic Debt burden is existential: a Gambit who saves a friend by overriding a lethal blow carries the knowledge that somewhere, in a rejected timeline, that friend died. The Weaver chose to let that reality suffer so this one could prosper. Between the two, most Gambits become profoundly fatalistic outside of combat. They gamble obsessively and refuse to make trivial choices. They carry two ledgers, and both are always in the red.`,

    classSpecificLocations: [
      {
        name: 'The House of Eighty-Eight Doors',
        locationId: 'merrowport',
        description: 'The most notorious gambling den in Merrowport, built in a former smuggler\'s warehouse with exactly eighty-eight doors. Gambits gather here to wager on anything: dice, cards, the sex of an unhatched fish, the exact number of raindrops that will hit a specific roof-tile during a storm. The house takes a 10 percent cut and guarantees fair play by employing a retired Gambit as the pit boss.',
        purpose: 'Gambling den, social hub, and informal Gambit guild hall for the Fortune-focused practitioners',
        status: 'Active. Jax\'s empty chair at the high-stakes table has become a shrine.'
      },
      {
        name: 'The Deck-Burners\' Hollow',
        locationId: 'cragjaw-peaks',
        description: 'A hidden cave-chamber in the lower Cragjaw Peaks where Lyra and her followers meet. The walls are covered in the burned patterns of thousands of cards, residue of Gambits who have burned their decks to sever their connection to fate entirely. The air is thick with the smell of old ash and ozone.',
        purpose: 'Secret meeting place for the radical Deck-Burners faction',
        status: 'Secret. Hidden even from most Gambits.'
      }
    ],
    combatRole: {
      title: "Combat Role",
      content: `**Why Bring Me?**: Unmatched dual-axis probability control. The Gambit possesses both the real-time roll nudging of Fortune Points and the absolute d20 override power of Fate Reserve cards. They can squeeze a close failure into a success with FP nudging, or bypass the roll entirely with a hard-coded card override. They are the ultimate mathematical safety net and the most devastating high-stakes payload on the field.

**The Fatal Flaw (Dual Collapse)**: You are at risk from two directions simultaneously. Fortune hitting 0 triggers Cosmic Bankruptcy (2d10 blight damage, 100 percent Spirit/shadow vulnerability for 2 rounds). Karmic Debt hitting 13 triggers Tapestry Collapse (6d10 irreducible wyrd damage, 1-round incapacitation, Fortune emptied, max HP reduced by 5 until long rest). Managing both resource pools under combat pressure is the defining challenge of the class.`,
    },

    playstyle: {
      title: "Playstyle and Strategy",
      content: `Playing the Wagering Architect requires balancing two intertwined resource economies against escalating physical and temporal strain:

**The Dual Resource Loop**:
- Start combat with 1 Fortune Point and 0 Karmic Debt.
- Use Gambler spells (Lucky Strike, Lucky Toss, Dice Dart) to generate Fortune Points, paying 1 HP per point via Debtor's Tax.
- Use Fate Weaver spells (Fate Reserve, Arcane Dirge) to draw and bank cards for hard overrides, generating Karmic Debt.
- Spend Fortune Points to nudge rolls (1d4 wyrd damage per point, irreducible).
- Spend Fate Reserve cards to override rolls entirely (generates Karmic Debt per override).

**Managing the Dual Void**:
- Never let Fortune hit 0. Always hold a reserve point, or Cosmic Bankruptcy will trigger.
- Never let Karmic Debt reach 13. Always track your debt accumulation, or Tapestry Collapse will end you.
- The two systems interact: spec passives can convert self-damage into Fortune, or use Karmic Debt to amplify damage.

**The Override Timing**:
- Do not waste banked cards on minor rolls. Save high face cards for crucial saving throws or boss spell attacks.
- Use Fortune nudging for incremental adjustments. Use card overrides for absolute guarantees.`,
    },

    immersiveCombatExample: {
      title: "Combat Example: The Wagering Architect at Iron Gallows",
      content: `**The Setup**: You stand before a hulking, armor-clad inquisitor. Your Fate Reserve holds 3 cards: a King (17), a Queen (16), and a 5. Your Fortune is at 3 FP. Your Karmic Debt sits at 2.

**Turn 1: Harvesting the Collateral (FP: 3 to 5, HP: 45 to 43, Debt: 2)**
*You grit your teeth, channeling probability into your blade, and cast Lucky Strike!*
You roll 4d12 bone dice: two pairs emerge. The damage doubles.
**The Debtor's Tax**: You bank 2 Fortune Points. Your muscles seize as you suffer 2 immediate HP damage.

**Turn 2: The Card Override (FP: 5 to 4, HP: 43 to 41, Debt: 2 to 4)**
*The inquisitor raises his hammer for a devastating blow. The roll lands at 19.*
**Your Reaction**: You cast Tapestry Shred, consuming the King (17) from your Fate Reserve.
**The Result**: The inquisitor's 19 is replaced with your banked card value. His blow swings wide.
**Karmic Debt**: 2 to 4. Your hands tremble as +20 percent vulnerability settles over you.

**Turn 3: The Nudge and the Wager (FP: 4 to 2, HP: 41 to 39, Debt: 4)**
*Your ally's spell attack rolls a 12 against the inquisitor's Spirit save DC of 14.*
You spend 2 Fortune Points to nudge the roll to 14. Exact hit.
**Calculated Risk**: 2d4 wyrd damage lances through your skull.

**Turn 4: The Push (FP: 2 to 0, HP: 39 to Bankruptcy, Debt: 4 to 7)**
*Desperate, you cast Arcane Dirge, drawing 5 cards for a poker hand: Two Pair.*
**The Damage**: 2d8 wyrd damage to the inquisitor. Debt climbs to 7.
Your Fortune hits 0.
**Cosmic Bankruptcy**: 2d10 blight damage. 100 percent Spirit vulnerability for 2 rounds. You are bleeding from both ledgers now.`,
    },
  },

  resourceSystem: {
    title: "Fortune Points and Karmic Debt",
    subtitle: "The Dual Ledger",
    description: "A dual-resource system representing stolen luck and severed fate-threads. Fortune Points fuel real-time roll nudging, while Karmic Debt accumulates from absolute probability overrides. Both demand physical and mental tolls that cannot be mitigated.",

    cards: [
      {
        title: "Fortune Points (Primary)",
        stats: "0 to 15 Max (Scales by Spec)",
        details: "Vibrating tokens of stolen probability. Generated through coin flips, die rolls, card draws, and successful attacks. Spent after any d20 roll to adjust the result by plus or minus 1 per point. Must be declared after the roll is seen but before the outcome is resolved.",
      },
      {
        title: "Debtor's Tax (Fortune Generation Cost)",
        stats: "1 HP per FP Gained",
        details: "Every Fortune Point gained costs 1 immediate, unpreventable HP damage. Your body serves as collateral for the cosmic debt. This damage cannot be reduced, prevented, or redirected.",
      },
      {
        title: "Calculated Risk (Fortune Spending Cost)",
        stats: "1d4 Psychic per FP Spent",
        details: "Spending Fortune Points to nudge rolls deals 1d4 wyrd damage per point spent. This damage cannot be reduced or prevented. Manipulating fate demands agonizing mental exertion.",
      },
      {
        title: "Karmic Debt (Secondary)",
        stats: "0 to 13 Gauge (Scales by Spec)",
        details: "Accumulated from card overrides, forced destiny manipulation, and high-stakes plays. Each stack imposes plus 5 percent vulnerability to ALL damage types. At the end of each round, suffer 1d4 psychic strain per stack.",
      },
      {
        title: "Tapestry Collapse (Karmic Debt Overflow)",
        stats: "Triggers at 13 Stacks",
        details: "6d10 irreducible wyrd damage. 1-round incapacitation. Fortune pool completely emptied. Maximum HP reduced by 5 until long rest. The ultimate price of pushing destiny too far.",
      },
    ],

    generationTable: {
      headers: ["Action / Spell", "Fortune Change", "Karmic Debt Change", "Physical Toll"],
      rows: [
        ["Lucky Strike (Level 1)", "+1 to +3 on match", "None", "-1 HP per FP generated"],
        ["Lucky Toss (Level 1)", "+1 on cast", "None", "-1 HP"],
        ["Dice Dart (Level 1)", "+1 on cast", "None", "-1 HP"],
        ["Beginner's Luck (Level 1)", "+1 on cast", "None", "-1 HP"],
        ["Fate Reserve (Level 1)", "None", "+2 Debt", "None"],
        ["Arcane Dirge (Level 1)", "None", "+1 to +4 Debt (by hand)", "None"],
        ["Nudge a d20 Roll", "-1 to -X FP", "None", "1d4 psychic per FP"],
        ["Tapestry Shred Override", "None", "+2 Debt", "None"],
        ["Cosmic Bankruptcy (0 FP)", "Reset to 0, Locked", "None", "2d10 necrotic + 100% vuln"],
        ["Tapestry Collapse (13 Debt)", "Fortune emptied", "Reset to 0", "6d10 psychic + incapacitate + max HP -5"],
      ],
    },

    usage: {
      nudging: "Modify any d20 roll (attack, save, ability check) by plus or minus 1 per Fortune Point spent. Must be declared AFTER the roll is seen but BEFORE the outcome is narrated.",
      overrides: "Spend banked Fate Reserve cards to hard-replace any d20 roll within range. Face cards force high outcomes, numbered cards force exact values. Each override generates Karmic Debt.",
      flourish: "Both the Debtor's Tax and Calculated Risk apply without exception. Neither can be reduced, prevented, or mitigated. Karmic Debt vulnerability stacks multiplicatively with other vulnerability sources.",
    },

    overheatRules: {
      title: "Dual Collapse Conditions",
      content: "The Gambit faces two catastrophic failure states. Cosmic Bankruptcy triggers when Fortune Points drop to 0: 2d10 blight damage, 100 percent vulnerability to Spirit and blight damage for 2 rounds, inability to generate Fortune Points. Tapestry Collapse triggers when Karmic Debt reaches 13: 6d10 irreducible wyrd damage, 1-round incapacitation, Fortune pool emptied, maximum HP reduced by 5 until long rest. A Gambit who collapses from both systems simultaneously is effectively removed from combat.",
    },

    rageStatesTable: {
      title: "Fortune Point Thresholds",
      headers: ["State / Phase", "Range", "Unlocked Mechanics", "Strain / Penalty"],
      rows: [
        ["Bust / Empty", "0 FP", "No nudging. Cosmic Bankruptcy triggers.", "Disadvantage on all gambling rolls. Vulnerability active."],
        ["Strapped", "1-3 FP", "Basic nudging. Can modify rolls by plus/minus 1-3.", "Debtor's Tax on every gain. Playing it cautious."],
        ["Flush", "4-8 FP", "Mid-tier wagers unlocked. Consistent roll control.", "Calculated Risk wyrd damage scales sharply."],
        ["High Roller", "9-14 FP", "Premium wagers and ultimate abilities available.", "Self-damage per cast increases. One bad roll from Bust."],
        ["All-In", "15-21 FP", "Maximum nudging power. All abilities available.", "Extreme risk of catastrophic loss. Every FP spent hurts."],
      ],
    },
  },
  equipment: {
    title: "Starting Equipment",
    choices: [
      {
        name: "Path A: Razor Edge (Melee Gambit)",
        icon: "fas fa-dice",
        items: [
          "Serrated Cane-Sword (1d6 slashing, concealed blade for close-quarters probability siphoning)",
          "Pair of Card Blades (1d6 slashing each, razor-edged playing cards mounted on hilts, from the Fate Weaver tradition)",
          "Reinforced Leather Vest (Armor 11, Light, no agility penalty)",
          "Set of weighted bone dice",
          "10 steel fortune tokens (crimson and silver)",
        ],
        description: "Maximum melee impact combining the Gambler's close-quarters fortune generation with the Fate Weaver's card blade aggression. Favors rapid FP generation through Lucky Strike and devastating melee probability strikes.",
      },
      {
        name: "Path B: Thread Reader (Ranged Gambit)",
        icon: "fas fa-hat-wizard",
        items: [
          "Weighted Throwing Daggers (1d4 piercing, balanced for Lucky Toss and Dice Dart)",
          "Rune-etched Staff (1d8 psychic, channels probability energy through crystalline tip, from the Fate Weaver tradition)",
          "Threadcaster's Bracers (Armor 10, Light, plus 5ft ranged spell distance)",
          "Deck Pouch (holds 52 rune-etched cards, always at hip)",
          "A vial of focusing salts to steady the nerves",
        ],
        description: "Ranged probability manipulation combining the Gambler's distance control with the Fate Weaver's staff channeling. Favors careful FP banking and Fate Reserve building from a distance, using card draws and coin flips for controlled outcomes.",
      },
    ],
    standardGear: [
      "Traveler's backpack with rations (7 days)",
      "Waterskin and bedroll",
      "A debt ledger (bound in worn leather, constantly updating itself)",
      "Rune-inscribing stylus and jar of aether-ink",
      "Probability abacus (mechanical calculator for tracking card counts)",
      "1d10 multiplied by 5 tarnished copper pieces",
    ],
    notes: "Gambits cannot equip heavy armor, shields, or heavy weapons. Their probability-based abilities require unrestricted movement, a clear mental state, and minimal interference from dense metals. Their deck is a primary weapon; losing it disables all card-based abilities until replaced.",
  },

  specializations: {
    title: "Specializations",
    subtitle: "Three Paths of the Wagering Architect",
    description: "Specializing determines how you balance the twin demands of Fortune and Karmic Debt. Each path offers a distinct relationship with probability, fate, and the cost of power.",

    specs: [
      {
        id: "probability_savant",
        name: "Probability Savant",
        icon: "fas fa-brain",
        color: "#2980b9",
        theme: "Mathematical Foresight",
        description: "Masters of incremental math and enemy save manipulation. They treat fate as a ledger to be meticulously balanced, combining the Gambler's Fortune precision with the Fate Weaver's predictive sight.",
        playstyle: "Strategic, consistent roll manipulation. You siphon small, steady streams of luck, minimize high-risk drops, and hoard a small, perfect reserve of nudges while peeking at enemy saving throws.",
        strengths: [
          "Maximum Fortune capacity set to 13",
          "Maximum Karmic Debt set to 10",
          "Calculated Risk fixed at 1 psychic per FP spent instead of 1d4",
          "When enemy within 60ft rolls a saving throw, peek at top card of deck; if face card, enemy has disadvantage",
        ],
        weaknesses: [
          "Lower single-target burst damage",
          "Vulnerable to heavy physical strikes",
          "Slower maximum FP generation",
        ],
        specPassive: {
          name: "Balanced Ledger",
          description: "Your Calculated Risk damage is fixed at 1 wyrd damage per FP spent instead of 1d4. When an enemy within 60 feet rolls a saving throw, you may peek at the top card of your deck. If it is a face card, the enemy has disadvantage on the save. Maximum Fortune: 13, Maximum Karmic Debt: 10.",
        },
      },
      {
        id: "high_roller",
        name: "High Roller",
        icon: "fas fa-skull",
        color: "#c0392b",
        theme: "Apocalyptic Stakes",
        description: "Extreme-risk gamblers who push their vital systems to the absolute limit for spectacular, reality-warping results. They combine the Gambler's high-stakes wagers with the Fate Weaver's expanded card capacity.",
        playstyle: "High stakes, devastating payloads. You wager entire pools of HP and mana for spectacular, bone-rattling force attacks, converting every shockwave of self-damage into raw betting power.",
        strengths: [
          "Maximum Fortune capacity set to 21",
          "Maximum Karmic Debt set to 13",
          "When suffering self-damage from spell or gamble, immediately gain 2 FP (and pay 2 HP Debtor's Tax)",
          "Fate Reserve and call card capacity increased by 50 percent",
        ],
        weaknesses: [
          "Extremely high self-damage",
          "Highest vulnerability to Cosmic Bankruptcy",
          "Zero defensive utility",
        ],
        specPassive: {
          name: "Double Down",
          description: "When you suffer self-damage from a spell or gamble, you immediately gain 2 Fortune Points (and suffer the 2 HP Debtor's Tax). Your Fate Reserve and call card capacity is increased by 50 percent. Pain is fuel, and you convert every shockwave of probability backlash into raw betting power. Maximum Fortune: 21, Maximum Karmic Debt: 13.",
        },
      },
      {
        id: "karmic_weaver",
        name: "Karmic Weaver",
        icon: "fas fa-spider",
        color: "#8e44ad",
        theme: "Thread Manipulation",
        description: "Obsessive readers who have trained their senses to physically feel the vibrating strings of destiny, channeling them through focused card manipulation and damage redirection. They combine the Gambler's deck control with the Fate Weaver's thread binding.",
        playstyle: "Strategic deck siphoning and damage redirection. You drag enemies into high-stakes games, link targets together to share damage, and turn Karmic Debt stacks into bonus blight damage.",
        strengths: [
          "Maximum Fortune capacity set to 15",
          "Maximum Karmic Debt set to 13",
          "Draw two cards from magical deck, choose which to resolve",
          "At 5 or more debt stacks, spell attacks deal bonus necrotic equal to current debt level",
          "Can link 2 creatures within 30ft to share damage",
        ],
        weaknesses: [
          "Highly reliant on card RNG",
          "Requires constant active targeting and setup",
          "Vulnerable to silence and spirit-shattering magic",
        ],
        specPassive: {
          name: "Loaded Deck",
          description: "Whenever you draw from your magical deck, draw two cards and choose which to resolve. While you have 5 or more stacks of Karmic Debt, your spell attacks deal bonus blight damage equal to your current debt level. You may link two creatures within 30 feet to share damage. Maximum Fortune: 15, Maximum Karmic Debt: 13.",
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
        school: "storm",
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
        damageTypes: ["storm"],
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
      tags: ["melee", "damage", "fortune_generation", "starter", "gambit"],
    },

    { id: "gambler_lucky_toss",
      name: "Lucky Toss",
      description: "Flick a weighted steel coin. Heads: target takes 1d10 + Charisma storm damage. Tails: the coin floats, granting the target a shimmering barrier absorbing 10 damage for 1 round. Generates 1 Fortune Point, inflicting 1 immediate HP damage as your body channels the debt.",
      level: 1,
      spellType: "ACTION",
      icon: "Utility/Utility",
      typeConfig: {
        school: "storm",
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
        damageTypes: ["storm"],
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
          heads: { effect: "deal_damage", description: "Deals 1d10 + Charisma storm damage." },
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
      tags: ["ranged", "damage", "buff", "coin_flip", "starter", "gambit"],
    },

    { id: "gambler_dice_dart",
      name: "Dice Dart",
      description: "Throw a magically weighted bone die at a creature. Deals 1d8 wyrd damage. Generates 1 Fortune Point, inflicting 1 HP damage to you. You can spend up to 3 Fortune Points to add +1d6 wyrd damage per point, taking 1d4 wyrd damage per point spent.",
      level: 1,
      spellType: "ACTION",
      icon: "Social/Dice Roll",
      typeConfig: {
        school: "wyrd",
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
        damageTypes: ["wyrd"],
        resolution: "DICE",
      },
      specialMechanics: {
        fortunePoints: {
          generates: 1,
          optionalCost: "1-3 FP",
          description: "Generates 1 FP (1 HP cost). You can spend 1-3 FP to add +1d6 wyrd damage per point (1d4 wyrd damage per point spent).",
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
      tags: ["ranged", "damage", "fortune_generation", "starter", "gambit"],
    },

    { id: "gambler_beginners_luck",
      name: "Beginner's Luck",
      description: "Whisper a desperate plea to the cosmic collector. Gain advantage on your next attack roll or saving throw within 1 round. Generates 1 Fortune Point, dealing 1 HP damage to you.",
      level: 1,
      spellType: "ACTION",
      icon: "Psychic/Focused Mind",
      typeConfig: {
        school: "storm",
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
      tags: ["buff", "luck", "starter", "gambit"],
    },

    { id: "gambler_calculated_risk",
      name: "Calculated Risk",
      description: "Every twist of probability has a price. When you spend Fortune Points to modify an active d20 roll, intense mental feedback tears through your concentration. You suffer 1d4 wyrd damage per Fortune Point spent. This damage cannot be reduced or prevented. Manipulating fate demands exertion.",
      level: 1,
      spellType: "PASSIVE",
      icon: "Slashing/Viking Axes",
      typeConfig: {
        school: "wyrd",
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
            description: "Suffer 1d4 wyrd damage per Fortune Point spent to nudge rolls.",
            mechanicsText: "Suffer 1d4 wyrd damage per FP spent on nudging d20 rolls. Cannot be reduced or prevented.",
          },
        ],
        durationValue: 0,
        durationType: "permanent",
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 0,
      },
      tags: ["passive", "weakness", "gambit"],
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
      tags: ["passive", "weakness", "gambit"],
    },

    // ========================================
    // LEVEL 2 SPELLS — Risk & Illusion
    // ========================================
    { id: "gambler_coin_toss",
      name: "Coin Toss",
      description: "Flip a heavy iron coin wreathed in probability energy. Heads: gain a +2 bonus to all attack rolls and saving throws for 1 hour. Tails: suffer a -2 penalty to all attack rolls and saving throws for 1 hour. Generates 1 Fortune Point (inflicting 1 HP damage). You can spend 1 Fortune Point (taking 1d4 wyrd damage) to force the coin to flip its result.",
      level: 2,
      spellType: "ACTION",
      icon: "Utility/Utility",
      typeConfig: {
        school: "storm",
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
          description: "Generates 1 FP on cast (1 HP damage). Spend 1 FP to flip the result (1d4 wyrd damage spent).",
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
      tags: ["buff", "debuff", "coin_flip", "gambit"],
    },

    { id: "gambler_insight",
      name: "Gambler's Insight",
      description: "Your heightened, probability-tuned senses lock onto a target. Read their microscopically subtle tells, siphoning their luck. You gain advantage on all Insight and Perception checks against them for 10 minutes. Generates 1 Fortune Point, dealing 1 HP damage to you.",
      level: 2,
      spellType: "ACTION",
      icon: "Psychic/Focused Mind",
      typeConfig: {
        school: "wyrd",
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
      tags: ["utility", "social", "gambit"],
    },

    { id: "gambler_fools_gold",
      name: "Fool's Gold",
      description: "Reach into the empty void of your pockets and pull out a shimmering pile of coins, jewels, or cards (up to 100gp in value). The wealth is a temporary mathematical illusion; it dissolves into cold, grey ash in 1 hour or instantly if touched by holy steel. Siphons 1 Fortune Point (inflicting 1 HP damage).",
      level: 2,
      spellType: "ACTION",
      icon: "Utility/Utility",
      typeConfig: {
        school: "storm",
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
      tags: ["utility", "illusion", "gambit"],
    },

    // ========================================
    // LEVEL 3 SPELLS — Prediction & Withdrawal
    // ========================================
    { id: "gambler_taunt_the_odds",
      name: "Taunt the Odds",
      description: "Challenge the math of the universe. Predict a number between 1 and 20, then roll a d20. If your roll is within 3 of your guess, deal 3d10 wyrd damage to a target. If you are off by 4 or more, the probability backfires, dealing 1d10 wyrd damage to you. You can spend Fortune Points to nudge the d20 roll toward your guess (1d4 wyrd damage per point). Gain 1 FP on success (1 HP damage).",
      level: 3,
      spellType: "ACTION",
      icon: "Radiant/Radiant Warrior",
      typeConfig: {
        school: "wyrd",
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
        damageTypes: ["wyrd"],
        resolution: "DICE",
      },
      specialMechanics: {
        fortunePoints: {
          generates: 1,
          optionalCost: "1-5 FP",
          description: "Generates 1 FP on success (1 HP cost). Spend Fortune Points to nudge your d20 roll toward your guess (1d4 wyrd damage per point spent).",
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
      tags: ["ranged", "damage", "prediction", "gambit"],
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
      tags: ["passive", "weakness", "gambit"],
    },

    // ========================================
    // LEVEL 4 SPELLS — The Exerting Double Down
    // ========================================
    { id: "gambler_double_or_nothing",
      name: "Double or Nothing",
      description: "Make an all-or-nothing gamble on your physical limits. Make a Unified Strike roll against an enemy. On a hit: it becomes an automatic critical hit dealing double damage (4d10 + Charisma force). On a miss: you suffer the kinetic recoil yourself, taking the damage instead. If this reduces you to 0 HP, you immediately plunge into Cosmic Bankruptcy. Spend Fortune Points to nudge the strike roll (1d4 wyrd damage per point spent).",
      level: 4,
      spellType: "ACTION",
      icon: "Utility/Empowered Warrior",
      typeConfig: {
        school: "wyrd",
        secondaryElement: "storm",
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
        damageTypes: ["wyrd", "storm"],
        resolution: "DICE",
      },
      specialMechanics: {
        fortunePoints: {
          optionalCost: "1-10 FP",
          description: "Spend Fortune Points to nudge the attack roll toward hitting (1d4 wyrd damage per point spent).",
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
      tags: ["melee", "damage", "critical_hit", "high_risk", "gambit"],
    },

    // ========================================
    // LEVEL 5 SPELLS — Probability Acceleration
    // ========================================
    { id: "gambler_hot_streak",
      name: "Hot Streak",
      description: "Let the probability fever take hold. Spend 4 Fortune Points (taking 4d4 wyrd damage) to accelerate your stolen probability. For 1 round, each successful attack or spell cast grants a stacking +1d6 storm damage to your next strike, up to a maximum of 4 stacks. Each stack siphoned generates 1 FP (and deals 1 HP damage).",
      level: 5,
      spellType: "ACTION",
      icon: "Fire/Enveloping Fire",
      typeConfig: {
        school: "wyrd",
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
            description: "Each successful attack adds +1d6 storm damage, stacking up to 4 times.",
            mechanicsText: "For 1 round, each successful attack/spell adds +1d6 storm damage to next strike (max 4 stacks). Each stack generates 1 FP (1 HP cost).",
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
          description: "Costs 4 FP to cast (4d4 wyrd damage). Generates 1 FP (1 HP damage) per stack built during the duration.",
        },
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 4 },
      tags: ["buff", "damage", "gambit"],
    },

    { id: "gambler_mirage_flip",
      name: "Mirage Flip",
      description: "As a reaction when an attack lands on a target within 30ft, flip a probability-charged coin. Heads: double the damage dealt to the target. Tails: nullify the damage entirely, but suffer 2d6 wyrd damage as the probability shockwave rebounds through your concentration. Spend 1 FP (1d4 wyrd damage) to force heads.",
      level: 5,
      spellType: "REACTION",
      icon: "Utility/Utility",
      typeConfig: {
        school: "wyrd",
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
            description: "Triggering attack's damage is reduced to 0, but you suffer 2d6 wyrd damage.",
            mechanicsText: "Nullify triggering attack's damage, but suffer 2d6 wyrd damage as probability feedback.",
          },
        ],
        durationValue: 1,
        durationType: "rounds",
        durationUnit: "rounds",
      },
      specialMechanics: {
        coinFlip: {
          heads: { effect: "double_damage", description: "Doubles the damage of the triggering attack." },
          tails: { effect: "nullify_damage", description: "Reduces triggering damage to 0, but inflicts 2d6 wyrd damage to you." },
        },
        fortunePoints: {
          optionalCost: "1 FP",
          description: "Spend 1 FP to force heads (1d4 wyrd damage spent).",
        },
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },
      tags: ["reaction", "coin_flip", "high_risk", "gambit"],
    },

    { id: "gambler_fate_reroll",
      name: "Fate Reroll",
      description: "Pull the threads of probability with maximum exertion. Spend 4 Fortune Points (4d4 wyrd damage) to force all your d20 rolls this turn to be rolled with advantage. Taking this loan of luck leaves your nerves rattled; you have disadvantage on all saving throws until the start of your next turn.",
      level: 5,
      spellType: "ACTION",
      icon: "Social/Dice Roll",
      typeConfig: {
        school: "storm",
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
          description: "Costs 4 FP (4d4 wyrd damage) to guarantee advantage on all d20 rolls for the turn.",
        },
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 5 },
      tags: ["buff", "reroll", "gambit"],
    },

    // ========================================
    // LEVEL 6 SPELLS — Luck Siphoning
    // ========================================
    { id: "gambler_house_advantage",
      name: "House Advantage",
      description: "The cosmic house always wins. Siphon the luck of all nearby enemies. All enemies in a 20ft radius make a Spirit save (DC 16). On a fail, their probability is drained, giving them disadvantage on all attack rolls and saving throws for 3 rounds. Meanwhile, you gain advantage on all rolls for 3 rounds. Costs 5 Fortune Points (5d4 wyrd damage) to activate.",
      level: 6,
      spellType: "ACTION",
      icon: "Psychic/Mind Roar",
      typeConfig: {
        school: "wyrd",
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
          description: "Spend 5 FP (5d4 wyrd damage) to steal luck from all nearby foes.",
        },
      },
      tags: ["debuff", "buff", "luck", "gambit"],
    },

    { id: "gambler_card_shark",
      name: "Card Shark",
      description: "Draw a card from a deck of alchemically treated cards. Resolve based on the suit: Spades (deal 6d8 storm damage), Hearts (heal 5d8 HP), Diamonds (gain 30 damage shield for 1 minute), Clubs (target stunned for 2 rounds, Spirit DC 15 negates). Generates 1 Fortune Point, dealing 1 HP damage to you.",
      level: 6,
      spellType: "ACTION",
      icon: "Psychic/Mental Chaos",
      typeConfig: {
        school: "storm",
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
          { cardPattern: "Spades", effect: "Deal 6d8 storm damage to target", result: "Deal 6d8 storm damage to target", weight: 1 },
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
      tags: ["damage", "healing", "control", "variable", "rollable_table", "gambit"],
    },

    { id: "gambler_poker_face",
      name: "Poker Face",
      description: "Project an aura of absolute, impenetrable calm, becoming entirely immune to charm, fear, and mind-reading effects for 5 rounds. Costs 5 Fortune Points (5d4 wyrd damage) to activate.",
      level: 6,
      spellType: "ACTION",
      icon: "General/Fiery Rage",
      typeConfig: {
        school: "storm",
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
          description: "Spend 5 FP (5d4 wyrd damage) to become mentally impenetrable.",
        },
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 4 },
      tags: ["buff", "immunity", "mental", "gambit"],
    },

    // ========================================
    // LEVEL 7 SPELLS — Competitive Execution
    // ========================================
    { id: "gambler_death_roll",
      name: "Death Roll",
      description: "Force an enemy into a competitive match of Death Roll. Unwilling targets make a Spirit save (DC 15) to resist. You both take turns rolling a d20. The lower roll becomes the new ceiling. The first to roll over the current ceiling loses, taking 1-10d10 wyrd damage (winner's choice) and becoming stunned for 1 round. You may spend Fortune Points mid-game to stay under the ceiling (1d4 wyrd damage per FP spent).",
      level: 7,
      spellType: "ACTION",
      icon: "Necrotic/Demonic Empowerment",
      typeConfig: {
        school: "wyrd",
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
        damageTypes: ["wyrd"],
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
          description: "Spend FP during the roll sequence to stay under the ceiling (1d4 wyrd damage per point spent).",
        },
        gamblingGame: {
          gameType: "death_roll",
          description: "A competitive d20 rolling match to establish a shrinking ceiling. The loser takes massive wyrd damage.",
          resolution: "DICE",
          rules: { diceType: "d20", startCeiling: 20 },
        },
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 6 },
      tags: ["competitive", "damage", "control", "gambit"],
    },

    { id: "gambler_all_or_nothing",
      name: "All or Nothing",
      description: "Flip a high-stakes coin wreathed in searing cosmic force. Heads: deal 12d6 storm damage to all enemies in a 30ft radius, and stun them for 1 round (Spirit DC 16 save negates). Tails: the spell backfires, dealing 6d6 storm damage to you. You may spend 1 Fortune Point (1d4 wyrd damage) to flip the result. Generates 3 FP on heads (inflicting 3 HP damage).",
      level: 7,
      spellType: "ACTION",
      icon: "Utility/Utility",
      typeConfig: {
        school: "storm",
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
        damageTypes: ["storm"],
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
          heads: { effect: "deal_damage", description: "Deal 12d6 storm damage to enemies in 30ft radius, stunning those who fail a Spirit DC 16 save for 1 round." },
          tails: { effect: "self_damage", description: "Take 6d6 storm damage yourself." },
        },
        fortunePoints: {
          cost: 6,
          generates: 3,
          optionalCost: "1 FP",
          description: "Costs 6 FP to cast. Generates 3 FP on heads (3 HP damage). Spend 1 FP to flip the result (1d4 wyrd damage).",
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
      tags: ["damage", "aoe", "coin_flip", "ultimate", "gambit"],
    },

    // ========================================
    // LEVEL 8 SPELLS — The Divine Slot Machine
    // ========================================
    { id: "gambler_jackpot",
      name: "Jackpot",
      description: "Roll 3d20 bone dice. The sum of the roll determines your tier of fortune: 3 (Catastrophic: take 5d10 blight damage, go Bust), 4-12 (Bad Luck: take 2d6 storm damage, gain 1 FP), 13-25 (Small Win: deal 2d10 storm damage, gain 1 FP), 26-38 (Moderate Win: deal 4d10 storm damage and stun for 1 round, gain 1 FP), 39-48 (Big Win: deal 6d10 storm damage and stun for 2 rounds, gain 2 FP), 49-55 (Massive Win: deal 8d10 ember damage AoE, gain 2 FP), 56-59 (Near Jackpot: deal 10d10 ember damage AoE, heal 30 HP, gain 3 FP), 60 (Perfect Jackpot: deal 10d10 ember damage AoE, max damage on all attacks for 1 hour, gain 5 FP). Suffer 1 HP damage per FP gained. Spend FP to adjust individual dice by ±1 per point (1d4 wyrd damage per FP spent).",
      level: 8,
      spellType: "ACTION",
      icon: "Utility/Utility",
      typeConfig: {
        school: "wyrd",
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
          description: "Siphons 1-5 FP depending on win tier (1 HP cost per FP gained). Spend FP to nudge individual dice results (1d4 wyrd damage per point spent).",
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
      tags: ["ultimate", "random", "high_risk", "gambit"],
    },

    { id: "gambler_weighted_dice",
      name: "Weighted Dice",
      description: "Cheat the cosmos entirely. Deal 14d6 storm damage to a target. For each Fortune Point spent (up to 7), you may treat one d6 as an automatic 6. Spend 7 FP and half your dice are guaranteed maximum. This is pure, unmitigated theft of chance—because the best gamblers know when to cheat. Spend triggers Calculated Risk (1d4 wyrd damage per point spent).",
      level: 8,
      spellType: "ACTION",
      icon: "Social/Dice Roll",
      typeConfig: {
        school: "storm",
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
        damageTypes: ["storm"],
        canCrit: true,
        critMultiplier: 2,
        resolution: "DICE",
      },
      specialMechanics: {
        fortunePoints: {
          cost: 7,
          description: "Spend up to 7 FP (1d4 wyrd damage per FP spent) to force d6s to roll 6.",
        },
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 5 },
      tags: ["damage", "guaranteed", "fortune_point_spending", "gambit"],
    },

    // ========================================
    // LEVEL 9 SPELLS — High Wagers
    // ========================================
    { id: "gambler_high_roller",
      name: "High Roller",
      description: "Wager everything on a single throw. Roll a d20. On a 15+, deal 18d6 + Charisma storm damage to a single enemy. On a 6-14, deal half damage. On a 1-5, the probability violently backfires, dealing the full 18d6 + Charisma storm damage to yourself. Spend Fortune Points to adjust the roll (1d4 wyrd damage per point spent).",
      level: 9,
      spellType: "ACTION",
      icon: "Social/Dice Roll",
      typeConfig: {
        school: "storm",
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
        damageTypes: ["storm"],
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
          description: "Costs 8 FP to cast. Spend FP to adjust your d20 roll (1d4 wyrd damage per point spent).",
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
      tags: ["damage", "high_risk", "gambit"],
    },

    { id: "gambler_jackpot_surge",
      name: "Jackpot Surge",
      description: "Pull the lever of probability. Roll 3d6. Deal 16d6 + Charisma storm damage to all enemies in a 25ft radius (Agility DC 19 save for half). If you roll a pair of matching numbers, the damage is doubled. If you roll three-of-a-kind, it is quadrupled. Generates 5 FP on a triple, 3 FP on a pair, and 1 FP on no match (suffering 1 HP damage per FP generated).",
      level: 9,
      spellType: "ACTION",
      icon: "Radiant/Radiant Glow",
      typeConfig: {
        school: "storm",
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
        damageTypes: ["storm"],
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
      tags: ["damage", "aoe", "high_reward", "gambit"],
    },

    { id: "gambler_fortune_reversal",
      name: "Fortune Reversal",
      description: "A terrifying swap of probability and vitality. Flip a coin. Heads: swap your current HP percentage with a target enemy's HP percentage. Tails: the swap fails, but you learn their current and max HP and gain advantage on your next attack against them. You can spend 1 Fortune Point (1d4 wyrd damage) to force the coin to flip its result.",
      level: 9,
      spellType: "ACTION",
      icon: "Arcane/Rewind Time",
      typeConfig: {
        school: "storm",
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
          description: "Costs 8 FP to cast. Spend 1 FP to force heads (1d4 wyrd damage spent).",
        },
      },
      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      tags: ["utility", "coin_flip", "high_risk", "gambit"],
    },

    // ========================================
    // LEVEL 10 SPELLS — Apocalyptic Endgames
    // ========================================
    { id: "gambler_all_in",
      name: "All-In",
      description: "Wager your entire physical existence on a single d100 roll. Each Fortune Point spent (up to 10) shrinks the death window by 1%. At 0 FP spent: 1-50 (double your current HP), 51-90 (heal to full HP), 91-100 (drop to 0 HP and immediately plunge into Cosmic Bankruptcy). At 10 FP spent, the death window is eliminated entirely. Suffer Calculated Risk wyrd damage for each FP spent.",
      level: 10,
      spellType: "ACTION",
      icon: "Social/Dice Roll",
      typeConfig: {
        school: "wyrd",
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
          description: "Spend up to 10 FP (1d4 wyrd damage per FP spent) to shrink the death window by 1% per point.",
        },
        gamblingGame: {
          gameType: "d100_wager",
          description: "Roll a d100 — double your health, heal to full, or suffer instant collapse and Bankruptcy.",
          resolution: "DICE",
          rules: { diceType: "d100" },
        },
      },
      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      tags: ["ultimate", "life_or_death", "high_risk", "gambit"],
    },

    { id: "gambler_divine_jackpot",
      name: "Divine Jackpot",
      description: "Flip a coin wreathed in searing cosmic energy. Heads: deal 20d6 storm damage to all enemies in a 60ft radius. Enemies below 50% HP must succeed on a Spirit DC 20 save or be stunned for 2 rounds. Tails: your systems overload and you take 20d6 storm damage, but you survive at 1 HP with advantage on all rolls for 1 round. You may spend 1 Fortune Point (1d4 wyrd damage) to flip the coin result.",
      level: 10,
      spellType: "ACTION",
      icon: "Utility/Utility",
      effectTypes: ["damage", "control"],
      typeConfig: {
        school: "storm",
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
        damageTypes: ["storm"],
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
          heads: { effect: "deal_damage", description: "Deal 20d6 storm damage to all enemies in a 60ft radius." },
          tails: { effect: "fortune_mercy", description: "Take 20d6 storm damage, surviving at 1 HP with advantage on all rolls for 1 round." },
        },
        fortunePoints: {
          cost: 10,
          optionalCost: "1 FP",
          description: "Costs 10 FP to cast. Spend 1 FP to flip the result (1d4 wyrd damage spent).",
        },
      },
      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      resolution: "COINS",
      tags: ["damage", "coin_flip", "ultimate", "gambit"],
    },

      {
        "id": "gambler_cheats_sleight",
        "name": "Cheat's Sleight",
        "description": "Every hand has an ace. Reach into your sleeve and discreetly nudge a physical card, die, or small game piece without being seen, bending local probability to mask your rapid fingers.",
        "level": 2,
        "spellType": "ACTION",
        "icon": "Social/Dice Roll",
        "typeConfig": {
          "school": "storm",
          "icon": "Social/Dice Roll",
          "tags": [
            "utility",
            "roleplay",
            "gambit"
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
          "gambit"
        ]
      },
  ,

    // ========================================
    // LEVEL 1 SPELLS - The Core Probability Engine
    // ========================================
    { id: "hand-of-fate",
      name: "Arcane Dirge",
      description: "Draw 5 cards to form a poker hand. You may discard and redraw up to twice. Hand strength determines damage dealt, but the intense warping of probability inflicts escalating Karmic Debt. You may spend 2 debt to call a specific card from your deck (once per turn).",
      level: 1,
      spellType: "ACTION",
      icon: "Necrotic/Necrotic Skull",
      typeConfig: {
        school: "blight",
        icon: "Necrotic/Necrotic Skull",
        tags: ["damage", "cards", "starter"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: ["enemy"]
      },
      resourceCost: {
        actionPoints: 1,
        resourceTypes: ["mana"],
        resourceValues: { mana: 5 },
        components: ["verbal", "somatic"],
        verbalText: "The hand is cast!",
        somaticText: "Flick probability cards in a cascading arc, each one leaving a trail of shimmering distortion"
      },
      resolution: "CARDS",
      effectTypes: ["damage"],
      damageConfig: {
        formula: "Varies by Poker Hand",
        damageTypes: ["blight"],
        resolution: "CARDS",
        cardConfig: {
          drawCount: 5,
          formula: "Varies by Poker Hand"
        }
      },
      specialMechanics: {
        pokerHandScaling: {
          description: "Pairs high-risk rewards with Karmic Debt escalation.",
          hands: [
            { name: "Royal Flush", damage: "12d10 necrotic", debtGain: 4, description: "Deals 12d10 blight damage + inflicts 4 debt. Absolute probability override." },
            { name: "Straight Flush", damage: "10d10 necrotic", debtGain: 3, description: "Deals 10d10 blight damage + inflicts 3 debt." },
            { name: "Four of a Kind", damage: "8d10 necrotic", debtGain: 3, description: "Deals 8d10 blight damage + inflicts 3 debt." },
            { name: "Full House", damage: "6d10 necrotic", debtGain: 2, description: "Deals 6d10 blight damage + inflicts 2 debt." },
            { name: "Flush", damage: "4d10 necrotic", debtGain: 2, description: "Deals 4d10 blight damage + inflicts 2 debt." },
            { name: "Straight", damage: "3d10 necrotic", debtGain: 1, description: "Deals 3d10 blight damage + inflicts 1 debt." },
            { name: "Three of a Kind", damage: "2d10 necrotic", debtGain: 1, description: "Deals 2d10 blight damage + inflicts 1 debt." },
            { name: "Two Pair", damage: "2d8 psychic", debtGain: 1, description: "Deals 2d8 wyrd damage + inflicts 1 debt." },
            { name: "One Pair", damage: "1d8 psychic", debtGain: 1, description: "Deals 1d8 wyrd damage + inflicts 1 debt." },
            { name: "High Card", damage: "1d4 psychic", debtGain: 2, description: "Deals 1d4 wyrd damage + inflicts 2 debt (the weak outcome strains your concentration severely)." }
          ]
        },
        threadsOfDestiny: {
          usage: "Spend 2 debt to call a specific card (once per turn)"
        }
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 0
      },
      tags: ["damage", "cards", "level 1", "gambit"]
    },

    { id: "war-of-wills",
      name: "Duel of Wills",
      description: "Draw 1 card and force your target to draw 1 as well. If your card's value is higher, you inflict wyrd overload on their nervous system. If your card's value is lower, you absorb the wyrd feedback, taking damage and gaining 1 Karmic Debt.",
      level: 1,
      spellType: "ACTION",
      icon: "Psychic/Brain Psionics",
      typeConfig: {
        school: "wyrd",
        icon: "Psychic/Brain Psionics",
        tags: ["damage", "cards", "starter"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 45,
        targetRestrictions: ["enemy"]
      },
      resourceCost: {
        actionPoints: 1,
        resourceTypes: ["mana"],
        resourceValues: { mana: 4 },
        components: ["verbal"],
        verbalText: "Your will bends!"
      },
      resolution: "CARDS",
      effectTypes: ["damage"],
      damageConfig: {
        formula: "Card Value × 2 + Intelligence",
        damageTypes: ["wyrd"],
        resolution: "CARDS",
        cardConfig: {
          drawCount: 1,
          formula: "Card Value × 2 + Intelligence"
        }
      },
      specialMechanics: {
        warOfWills: {
          description: "Compare one drawn card with target's drawn card. High card wins.",
          failureOutcome: "You take 1d8 wyrd damage and gain 1 stack of Karmic Debt."
        }
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 1
      },
      tags: ["damage", "cards", "level 1", "gambit"]
    },

    { id: "echoes-of-the-past",
      name: "Echo of the Loom",
      description: "Draw the residual memory of a severed timeline from your deck. You gain temporary proficiency in one skill or tool of your choice for 10 minutes. Bending timeline constraints to absorb these residual echoes inflicts 1 Karmic Debt.",
      level: 1,
      spellType: "ACTION",
      icon: "Arcane/Arcane Scroll",
      typeConfig: {
        school: "wyrd",
        icon: "Arcane/Arcane Scroll",
        tags: ["utility", "starter"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "self",
        rangeType: "self"
      },
      resourceCost: {
        actionPoints: 1,
        resourceTypes: ["mana"],
        resourceValues: { mana: 2 }
      },
      resolution: "NONE",
      effectTypes: ["buff"],
      buffConfig: {
        buffType: "proficiency",
        effects: [
          {
            id : "echo_memories",
            name: "Echo Memories",
            description: "Gain temporary proficiency in one selected skill or tool.",
            mechanicsText: "Gain proficiency in one skill or tool for 10 minutes. Inflicts 1 Karmic Debt."
          }
        ],
        durationValue: 10,
        durationType: "minutes",
        durationUnit: "minutes"
      },
      specialMechanics: {
        threadsOfDestiny: {
          generation: "Absorbing residual timeline echoes inflicts 1 Karmic Debt"
        }
      },
      cooldownConfig: {
        cooldownType: "short_rest",
        cooldownValue: 1
      },
      tags: ["utility", "buff", "level 1", "gambit"]
    },

    { id: "marked-card",
      name: "Fate Reserve",
      description: "Focus your will and channel probability energy into your cards. Peek at the top 3 cards of your deck. You may 'bank' one card into your Fate Reserve (max 4 capacity) and draw the other two. Each override reaction expends a card from this reserve. Reshaping the deck's probability generates 2 Karmic Debt.",
      level: 1,
      spellType: "ACTION",
      icon: "Arcane/Arcane Scroll",
      typeConfig: {
        school: "blight",
        icon: "Arcane/Arcane Scroll",
        tags: ["draw", "utility", "starter"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "self",
        rangeType: "self"
      },
      resourceCost: {
        actionPoints: 1,
        resourceTypes: ["mana"],
        resourceValues: { mana: 4 },
        components: ["somatic"],
        somaticText: "Channel a pulse of probability energy through your deck, cards levitating briefly"
      },
      resolution: "CARDS",
      effectTypes: ["utility"],
      utilityConfig: {
        utilityType: "card_draw",
        selectedEffects: [
          {
            id : "bank_card",
            name: "Fate Bank",
            description: "Bank 1 card into Fate Reserve. Max baseline capacity is 4 cards."
          }
        ]
      },
      specialMechanics: {
        threadsOfDestiny: {
          generation: "Warping probability to bank destiny generates 2 Karmic Debt."
        }
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 1
      },
      tags: ["utility", "cards", "level 1", "gambit"]
    },

    { id: "fate_lucky_strike",
      name: "Scythe of Destiny",
      description: "Draw 1 card. Face/Ace: deal 2d8 wyrd damage and gain critical threat on next attack. Numbered: deal 1d8 wyrd and gain 1 Karmic Debt.",
      level: 1,
      spellType: "ACTION",
      icon: "Slashing/Curved Scythe",
      typeConfig: {
        school: "wyrd",
        icon: "Slashing/Curved Scythe",
        tags: ["melee", "damage", "cards", "starter"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "melee",
        rangeDistance: 5,
        targetRestrictions: ["enemy"]
      },
      resourceCost: {
        actionPoints: 1,
        resourceTypes: ["mana"],
        resourceValues: { mana: 3 },
        components: ["somatic"],
        somaticText: "Slash with a rigid, probability-charged card blade trailing psychic energy"
      },
      resolution: "CARDS",
      effectTypes: ["damage"],
      damageConfig: {
        formula: "Card Value + Intelligence (Face/Ace) / Card Value/2 (Number)",
        damageTypes: ["wyrd"],
        resolution: "CARDS",
        cardConfig: {
          drawCount: 1,
          formula: "Card Value + Intelligence / Card Value/2"
        }
      },
      specialMechanics: {
        threadsOfDestiny: {
          generation: "Drawing a numbered card inflicts 1 Karmic Debt."
        }
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 0
      },
      tags: ["melee", "damage", "level 1", "gambit"]
    },

    { id: "fate_twist_probability",
      name: "Karmic Severance",
      description: "As a reaction to a creature within 30 feet rolling a saving throw, you snap your fingers and sever their probability thread. Expend a banked card from your Fate Reserve to override their result. Face cards force an absolute failure on the target's save; numbered cards force a standard roll with a -5 penalty. Inflicts 1 Karmic Debt.",
      level: 1,
      spellType: "REACTION",
      icon: "Necrotic/Severed Skeletal Hand",
      typeConfig: {
        school: "blight",
        icon: "Necrotic/Severed Skeletal Hand",
        tags: ["reaction", "debuff", "starter"],
        castTime: 1,
        castTimeType: "REACTION"
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
        targetRestrictions: ["any"]
      },
      resourceCost: {
        actionPoints: 0,
        resourceTypes: ["mana"],
        resourceValues: { mana: 4 },
        components: ["verbal"],
        verbalText: "Decido!"
      },
      resolution: "CARDS",
      effectTypes: ["debuff"],
      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          {
            id : "severed_destiny",
            name: "Severed Destiny",
            description: "Target's roll is overridden by your banked card value.",
            mechanicsText: "Face card: absolute save failure. Numbered: -5 penalty to save. Inflicts 1 Karmic Debt. Consumes 1 Fate Reserve card."
          }
        ]
      },
      specialMechanics: {
        threadsOfDestiny: {
          generation: "Severing the threads of probability generates 1 Karmic Debt."
        }
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 1
      },
      tags: ["reaction", "debuff", "level 1", "gambit"]
    },

    { id: "tapestry-shred",
      name: "Tapestry Shred",
      description: "Sever the threads of time in response to an action. Consume an active card from your Fate Reserve to force an immediate d20 roll override on any creature within 60 feet. The target's active d20 roll is replaced by the banked card's hard-coded value: Aces count as 18, Kings as 17, Queens as 16, Jacks as 15, and numbered cards map to their exact face value. Inflicts 2 Karmic Debt as the timeline violently shifts.",
      level: 1,
      spellType: "REACTION",
      icon: "Utility/Rewind Time",
      typeConfig: {
        school: "wyrd",
        icon: "Utility/Rewind Time",
        tags: ["reaction", "override", "utility"],
        castTime: 1,
        castTimeType: "REACTION"
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: ["any"]
      },
      resourceCost: {
        actionPoints: 0,
        resourceTypes: ["mana"],
        resourceValues: { mana: 10 },
        components: ["verbal"],
        verbalText: "Thread snap!"
      },
      resolution: "CARDS",
      effectTypes: ["utility"],
      utilityConfig: {
        utilityType: "fate_manipulation",
        selectedEffects: [
          {
            id : "tapestry_shred_override",
            name: "Tapestry Shred Override",
            description: "Force an immediate d20 roll override by expending a banked card from Fate Reserve. Aces = 18, Kings = 17, Queens = 16, Jacks = 15, Numbered = Face Value."
          }
        ]
      },
      specialMechanics: {
        threadsOfDestiny: {
          generation: "Generating this shift inflicts 2 Karmic Debt",
          usage: "Consumes 1 card from Fate Reserve"
        }
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 0
      },
      tags: ["reaction", "override", "level 1", "gambit"]
    },

    // ========================================
    // LEVEL 2 SPELLS
    // ========================================
    { id: "hearts-gamble",
      name: "Aether Wager",
      description: "Draw 1 card to heal an ally. Red card (Hearts/Diamonds): heal 3d8 + Spirit. Black card (Spades/Clubs): healing halved, you take 2d8 wyrd, and gain 1 Karmic Debt.",
      level: 2,
      spellType: "ACTION",
      icon: "Healing/Stitched",
      typeConfig: {
        school: "blight",
        icon: "Healing/Stitched",
        tags: ["healing", "cards", "risk_reward"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
        targetRestrictions: ["ally"]
      },
      resourceCost: {
        actionPoints: 1,
        resourceTypes: ["mana", "threads"],
        resourceValues: { mana: 8, threads: 2 }
      },
      resolution: "CARDS",
      effectTypes: ["healing"],
      healingConfig: {
        formula: "Card Value + Spirit (Red) / Card Value/2 (Black)",
        healingType: "direct",
        resolution: "CARDS"
      },
      specialMechanics: {
        threadsOfDestiny: {
          generation: "Drawing a black card inflicts 1 Karmic Debt."
        }
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 2
      },
      tags: ["healing", "cards", "level 2", "gambit"]
    },

    { id: "fate_fortune_favor",
      name: "Fortune's Favor",
      description: "Draw 1 card to grant an ally a protective ward. The suit of the drawn card dictates the blessing: Hearts grants 2d8 temporary HP, Diamonds grants +3 to all saving throws, Spades grants +15 ft movement speed, and Clubs grants +2 to physical attack rolls. Duration is 3 rounds. Inflicts 1 Karmic Debt.",
      level: 2,
      spellType: "ACTION",
      icon: "Radiant/Radiant Golden Shield",
      typeConfig: {
        school: "wyrd",
        icon: "Radiant/Radiant Golden Shield",
        tags: ["buff", "cards"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 45,
        targetRestrictions: ["ally"]
      },
      resourceCost: {
        actionPoints: 1,
        resourceTypes: ["mana"],
        resourceValues: { mana: 6 }
      },
      resolution: "CARDS",
      effectTypes: ["buff"],
      buffConfig: {
        buffType: "suit_blessing",
        effects: [
          {
            id : "fortune_favor_buff",
            name: "Fortune's Favor Blessing",
            description: "Hearts: Temp HP. Diamonds: Save bonus. Spades: Speed. Clubs: Attack bonus.",
            mechanicsText: "Draw 1 card. Suit determines buff: Hearts 2d8 temp HP, Diamonds +3 saves, Spades +15 ft speed, Clubs +2 attacks. Lasts 3 rounds. Inflicts 1 Karmic Debt."
          }
        ],
        durationValue: 3,
        durationType: "rounds",
        durationUnit: "rounds"
      },
      specialMechanics: {
        threadsOfDestiny: {
          generation: "Bending reality to favor an ally generates 1 Karmic Debt."
        }
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 2
      },
      tags: ["buff", "cards", "level 2", "gambit"]
    },

    // ========================================
    // LEVEL 3 SPELLS
    // ========================================
    { id: "draw-of-the-damned",
      name: "Arcane Blackjack",
      description: "Force an enemy into a contest of probability. Draw cards trying to get as close to 21 as possible. Each drawn card deals 1d10 blight damage to the target. You may 'hit' up to 4 times. If your total exceeds 21, you bust: the target takes no further damage, you take 4d10 blight damage yourself, and you gain 3 Karmic Debt.",
      level: 3,
      spellType: "ACTION",
      icon: "Bludgeoning/Cranium Crush",
      typeConfig: {
        school: "blight",
        icon: "Bludgeoning/Cranium Crush",
        tags: ["damage", "cards", "risk_reward"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 45,
        targetRestrictions: ["enemy"]
      },
      resourceCost: {
        actionPoints: 2,
        resourceTypes: ["mana"],
        resourceValues: { mana: 12 },
        components: ["verbal", "somatic"],
        verbalText: "Viginti unus!",
        somaticText: "Weave card outlines into the air, enclosing the target in a ring of probability"
      },
      resolution: "CARDS",
      effectTypes: ["damage"],
      damageConfig: {
        formula: "Card Value per card drawn (max 4)",
        damageTypes: ["blight"],
        resolution: "CARDS",
        cardConfig: {
          drawCount: 4,
          formula: "Card Value per card drawn"
        }
      },
      specialMechanics: {
        blackjackRules: {
          hitLimit: 4,
          bustThreshold: 21,
          bustSelfDamage: "4d10 necrotic",
          bustDebtGain: 3
        }
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 3
      },
      tags: ["damage", "cards", "level 3", "gambit"]
    },

    { id: "echo-of-fate",
      name: "Sympathetic Link",
      description: "Sever two probability threads and weave them together. Choose two creatures within 30 feet of each other. For the next 3 rounds, whenever the primary target takes damage, the bound target takes 50% of that damage as untreatable blight damage. Generating this link generates 2 Karmic Debt.",
      level: 3,
      spellType: "ACTION",
      icon: "Utility/Chained",
      typeConfig: {
        school: "blight",
        icon: "Utility/Chained",
        tags: ["debuff", "utility"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 60,
        aoeShape: "circle",
        aoeParameters: { radius: 30 }
      },
      resourceCost: {
        actionPoints: 1,
        resourceTypes: ["mana"],
        resourceValues: { mana: 10 }
      },
      resolution: "NONE",
      effectTypes: ["debuff"],
      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          {
            id : "sympathetic_stitch",
            name: "Sympathetic Stitch",
            description: "Takes 50% of the damage dealt to the linked primary target.",
            mechanicsText: "Link 2 creatures within 30 ft. Primary's damage is shared 50% as blight to secondary. Lasts 3 rounds. Inflicts 2 Karmic Debt."
          }
        ],
        durationValue: 3,
        durationType: "rounds",
        durationUnit: "rounds"
      },
      specialMechanics: {
        threadsOfDestiny: {
          generation: "Weaving two fates together generates 2 Karmic Debt."
        }
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 4
      },
      tags: ["debuff", "utility", "level 3", "gambit"]
    },

    // ========================================
    // LEVEL 4 SPELLS
    // ========================================
    { id: "solitaires-shield",
      name: "Solitaire Ward",
      description: "Draw 4 cards and lay them in a defensive matrix around yourself. You gain temporary shield points equal to the total face value of the drawn cards (Kings/Queens/Jacks count as 10, Aces as 15, numbered as face value). If any card drawn is a Club, your DR is increased by 2 for the duration. Lasts 3 rounds. Generates 1 Karmic Debt.",
      level: 4,
      spellType: "ACTION",
      icon: "Utility/Bound Shield",
      typeConfig: {
        school: "wyrd",
        icon: "Utility/Bound Shield",
        tags: ["buff", "defense", "cards"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "self",
        rangeType: "self"
      },
      resourceCost: {
        actionPoints: 1,
        resourceTypes: ["mana"],
        resourceValues: { mana: 12 }
      },
      resolution: "CARDS",
      effectTypes: ["buff"],
      buffConfig: {
        buffType: "shield",
        effects: [
          {
            id : "solitaire_ward",
            name: "Solitaire Ward",
            description: "Gains shield points equal to card total. Club drawn increases DR by 2.",
            mechanicsText: "Draw 4 cards. Gain shield = total face value (Face=10, Ace=15, Number=face). Club drawn: +2 DR. Lasts 3 rounds. Inflicts 1 Karmic Debt."
          }
        ],
        durationValue: 3,
        durationType: "rounds",
        durationUnit: "rounds"
      },
      specialMechanics: {
        threadsOfDestiny: {
          generation: "Weaving a shield of absolute numbers generates 1 Karmic Debt."
        }
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 3
      },
      tags: ["buff", "defense", "level 4", "gambit"]
    },

    { id: "fates-exchange",
      name: "Karmic Displacement",
      description: "Target two creatures within 60 feet. They must make a Spirit saving throw against your spell DC. On a failure, their physical positions are instantly swapped in space as you violently cross their probability threads. Succeeding targets are unaffected. This reality warping generates 2 Karmic Debt.",
      level: 4,
      spellType: "ACTION",
      icon: "Arcane/Open Portal",
      typeConfig: {
        school: "storm",
        icon: "Arcane/Open Portal",
        tags: ["utility", "mobility"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 60,
        aoeShape: "circle",
        aoeParameters: { radius: 30 }
      },
      resourceCost: {
        actionPoints: 1,
        resourceTypes: ["mana"],
        resourceValues: { mana: 14 }
      },
      resolution: "SAVE",
      effectTypes: ["utility"],
      utilityConfig: {
        utilityType: "teleportation",
        selectedEffects: [
          {
            id : "displacement_swap",
            name: "Karmic Displacement Swap",
            description: "Target's physical positions are instantly swapped."
          }
        ]
      },
      specialMechanics: {
        threadsOfDestiny: {
          generation: "Swapping the coordinate threads of reality generates 2 Karmic Debt."
        }
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 3
      },
      tags: ["utility", "mobility", "level 4", "gambit"]
    },

    { id: "destiny-bond",
      name: "Fate Binding",
      description: "Project a strand of condensed probability energy to bind an enemy within 30 feet. For the next 3 rounds, 50% of all damage you receive is redirected to the bound enemy as blight damage. If you take damage, they must make a Spirit save or be pulled 10 feet closer to you. Weaving this bond generates 2 Karmic Debt.",
      level: 4,
      spellType: "ACTION",
      icon: "Utility/Chained",
      typeConfig: {
        school: "blight",
        icon: "Utility/Chained",
        tags: ["debuff", "defense"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
        targetRestrictions: ["enemy"]
      },
      resourceCost: {
        actionPoints: 1,
        resourceTypes: ["mana"],
        resourceValues: { mana: 15 },
        components: ["somatic"],
        somaticText: "Extend your palm, projecting a spiraling thread of condensed probability"
      },
      resolution: "DICE",
      effectTypes: ["debuff"],
      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          {
            id : "fate_binding_bond",
            name: "Fate Binding Bond",
            description: "Absorbs 50% of the Fate Weaver's damage. Spirit save or pulled 10 ft on damage.",
            mechanicsText: "50% of your incoming damage redirects to bound enemy as blight. Spirit save or pulled 10 ft. Lasts 3 rounds. Inflicts 2 Karmic Debt."
          }
        ],
        durationValue: 3,
        durationType: "rounds",
        durationUnit: "rounds"
      },
      specialMechanics: {
        threadsOfDestiny: {
          generation: "Weaving an active probability bond generates 2 Karmic Debt."
        }
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 4
      },
      tags: ["debuff", "defense", "level 4", "gambit"]
    },

    // ========================================
    // LEVEL 5 SPELLS
    // ========================================
    { id: "fate_weaver_stacked_deck",
      name: "Stacked Deck",
      description: "Focus your mind and rearrange the top 5 cards of your deck in any order you choose. This absolute manipulation allows you to predict your next outcomes perfectly. You may also exchange 1 card from your Fate Reserve with a card from these 5. Manipulating the future order generates 2 Karmic Debt.",
      level: 5,
      spellType: "ACTION",
      icon: "Psychic/Focused Mind",
      typeConfig: {
        school: "wyrd",
        icon: "Psychic/Focused Mind",
        tags: ["utility", "cards"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "self",
        rangeType: "self"
      },
      resourceCost: {
        actionPoints: 1,
        resourceTypes: ["mana"],
        resourceValues: { mana: 10 },
        components: ["verbal"],
        verbalText: "Ordo futuri!"
      },
      resolution: "NONE",
      effectTypes: ["utility"],
      utilityConfig: {
        utilityType: "fate_manipulation",
        selectedEffects: [
          {
            id : "stacked_deck_effect",
            name: "Stacked Deck",
            description: "Rearrange the top 5 cards of your deck. Swap 1 card with Fate Reserve."
          }
        ]
      },
      specialMechanics: {
        threadsOfDestiny: {
          generation: "Stacking the deck of future fates generates 2 Karmic Debt."
        }
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 4
      },
      tags: ["utility", "cards", "level 5", "gambit"]
    },

    { id: "fate_weaver_twist_fate",
      name: "Twisted Strands",
      description: "As a reaction to a creature within 60 feet succeeding on an attack roll or saving throw, you violently twist their probability thread. Force them to reroll their action and take the worse result. This direct twisting generates 2 Karmic Debt as their success is torn from them.",
      level: 5,
      spellType: "REACTION",
      icon: "Psychic/Puppet Control",
      typeConfig: {
        school: "wyrd",
        icon: "Psychic/Puppet Control",
        tags: ["reaction", "debuff"],
        castTime: 1,
        castTimeType: "REACTION"
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: ["any"]
      },
      resourceCost: {
        actionPoints: 0,
        resourceTypes: ["mana"],
        resourceValues: { mana: 12 }
      },
      resolution: "NONE",
      effectTypes: ["debuff"],
      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          {
            id : "twisted_strand_disadvantage",
            name: "Twisted Strand Disadvantage",
            description: "Target must reroll their action and take the worse result.",
            mechanicsText: "Force a reroll on a successful attack or save; target takes the worse result. Inflicts 2 Karmic Debt."
          }
        ],
        statPenalties: [
          { stat: "all_rolls", magnitude: -99, magnitudeType: "disadvantage" }
        ]
      },
      specialMechanics: {
        threadsOfDestiny: {
          generation: "Violently twisting an active thread of success generates 2 Karmic Debt."
        }
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 2
      },
      tags: ["reaction", "debuff", "level 5", "gambit"]
    },

    // ========================================
    // LEVEL 6 SPELLS
    // ========================================
    { id: "fate_weaver_dealers_choice",
      name: "Cartomancer's Harvest",
      description: "Consume 1 Fate Reserve card. Hearts: heal 6d8+Spirit. Diamonds: ally +4 saves, 30 temp HP (3 rds). Spades: 5d10 wyrd. Clubs: enemy discards next action. +2 Debt.",
      level: 6,
      spellType: "ACTION",
      icon: "Necrotic/Devour",
      typeConfig: {
        school: "blight",
        icon: "Necrotic/Devour",
        tags: ["damage", "healing", "buff", "cards"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: ["any"]
      },
      resourceCost: {
        actionPoints: 1,
        resourceTypes: ["mana"],
        resourceValues: { mana: 20 }
      },
      resolution: "CARDS",
      effectTypes: ["damage", "healing", "buff"],
      damageConfig: {
        formula: "Card Value × 2 + Intelligence (Spades)",
        damageTypes: ["wyrd"],
        resolution: "CARDS"
      },
      healingConfig: {
        formula: "Card Value × 2 + Spirit (Hearts)",
        healingType: "direct",
        resolution: "CARDS"
      },
      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          { id: "dealers_choice_diamonds",
            name: "Diamond Fortune",
            description: "Ally gains +4 to all saving throws and 30 temporary HP for 3 rounds.",
            statModifier: { stat: "all_saves", magnitude: 4, magnitudeType: "flat" }
          },
        ],
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds",
        concentrationRequired: false,
        canBeDispelled: true,
      },
      specialMechanics: {
        threadsOfDestiny: {
          generation: "Consuming a banked card to harvest fate generates 2 Karmic Debt.",
          usage: "Consumes 1 card from Fate Reserve"
        }
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 3
      },
      tags: ["damage", "healing", "buff", "level 6", "gambit"]
    },

    { id: "fate_weaver_twenty_one_curses",
      name: "High Stakes Blackjack",
      description: "Multi-target Blackjack for up to 3 enemies. Each card deals 2d6 blight. Hit up to 3x/enemy. Exact 21: +6d6 blight. Bust: you take 3d6 blight, +2 debt. Baseline +2 Debt.",
      level: 6,
      spellType: "ACTION",
      icon: "Necrotic/Blood Skull",
      typeConfig: {
        school: "blight",
        icon: "Necrotic/Blood Skull",
        tags: ["damage", "aoe", "cards"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 60,
        aoeShape: "circle",
        aoeParameters: { radius: 15 }
      },
      resourceCost: {
        actionPoints: 2,
        resourceTypes: ["mana"],
        resourceValues: { mana: 24 }
      },
      resolution: "CARDS",
      effectTypes: ["damage"],
      damageConfig: {
        formula: "Card Value per card drawn",
        damageTypes: ["blight"],
        resolution: "CARDS",
        cardConfig: {
          drawCount: 9,
          formula: "Card Value per card drawn"
        }
      },
      specialMechanics: {
        blackjackAdvancedRules: {
          maxTargets: 3,
          hitLimitPerTarget: 3,
          blackjackBonus: "6d6 necrotic",
          bustSelfDamage: "3d6 necrotic per bust"
        },
        threadsOfDestiny: {
          generation: "Initiating a multi-target death wager generates 2 Karmic Debt."
        }
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 4
      },
      tags: ["damage", "aoe", "level 6", "gambit"]
    },

    { id: "fate_weaver_fold_reality",
      name: "Fold Reality",
      description: "Reaction to physical damage: teleport 30 ft, leaving an afterimage that detonates for 3d8 blight to adjacent creatures. Generates 2 Karmic Debt.",
      level: 6,
      spellType: "REACTION",
      icon: "Utility/Phantom Dash",
      typeConfig: {
        school: "blight",
        icon: "Utility/Phantom Dash",
        tags: ["reaction", "mobility", "damage"],
        castTime: 1,
        castTimeType: "REACTION"
      },
      targetingConfig: {
        targetingType: "self",
        rangeType: "self"
      },
      resourceCost: {
        actionPoints: 0,
        resourceTypes: ["mana"],
        resourceValues: { mana: 18 }
      },
      resolution: "DICE",
      effectTypes: ["damage"],
      damageConfig: {
        formula: "3d8",
        damageTypes: ["blight"],
        resolution: "DICE"
      },
      specialMechanics: {
        threadsOfDestiny: {
          generation: "Folding reality to escape physical injury generates 2 Karmic Debt."
        }
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 4
      },
      tags: ["reaction", "mobility", "damage", "level 6", "gambit"]
    },

    // ========================================
    // LEVEL 7 SPELLS
    // ========================================
    { id: "fate_weaver_house_rules",
      name: "Sovereign Decrees",
      description: "You stand as the House, dictating the physical laws of the battlefield. For 1 round, all d20 rolls made by allies within 30 feet of you automatically succeed if your banked card is higher than a 10. All d20 rolls made by enemies within 30 feet automatically fail if your banked card is lower than a 10. Imposing your absolute decrees generates 3 Karmic Debt.",
      level: 7,
      spellType: "ACTION",
      icon: "Utility/Overlords Command",
      typeConfig: {
        school: "wyrd",
        icon: "Utility/Overlords Command",
        tags: ["buff", "debuff", "utility"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "circle",
        aoeParameters: { radius: 30 }
      },
      resourceCost: {
        actionPoints: 2,
        resourceTypes: ["mana"],
        resourceValues: { mana: 30 }
      },
      resolution: "NONE",
      effectTypes: ["buff", "debuff"],
      buffConfig: {
        buffType: "house_rules_ally",
        effects: [
          {
            id : "house_rules_ally_buff",
            name: "Sovereign Decree (Ally)",
            description: "d20 rolls automatically succeed if banked card is > 10.",
            mechanicsText: "Allies within 30 ft auto-succeed d20 rolls if banked card > 10. Lasts 1 round.",
            statModifier: { stat: "all_rolls", magnitude: 99, magnitudeType: "advantage" }
          }
        ],
        durationValue: 1,
        durationType: "rounds",
        durationUnit: "rounds"
      },
      debuffConfig: {
        debuffType: "house_rules_enemy",
        effects: [
          {
            id : "house_rules_enemy_debuff",
            name: "Sovereign Decree (Enemy)",
            description: "d20 rolls automatically fail if banked card is < 10.",
            mechanicsText: "Enemies within 30 ft auto-fail d20 rolls if banked card < 10. Lasts 1 round."
          }
        ],
        statPenalties: [
          { stat: "all_rolls", magnitude: -99, magnitudeType: "disadvantage" }
        ],
        durationValue: 1,
        durationType: "rounds",
        durationUnit: "rounds"
      },
      specialMechanics: {
        threadsOfDestiny: {
          generation: "Enforcing absolute House rules on reality generates 3 Karmic Debt."
        }
      },
      cooldownConfig: {
        cooldownType: "long_rest",
        cooldownValue: 1
      },
      tags: ["buff", "debuff", "utility", "level 7", "gambit"]
    },

    { id: "fate_weaver_all_in",
      name: "Arcane All-In",
      description: "Expend all banked Fate Reserve cards (min 2). Deals 3d10 blight per card to one target. 4+ cards: target Spirit save or incapacitated 1 round. +3 Karmic Debt.",
      level: 7,
      spellType: "ACTION",
      icon: "Necrotic/Corrosive Beam",
      typeConfig: {
        school: "blight",
        icon: "Necrotic/Corrosive Beam",
        tags: ["damage", "cards"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: ["enemy"]
      },
      resourceCost: {
        actionPoints: 1,
        resourceTypes: ["mana"],
        resourceValues: { mana: 25 },
        components: ["verbal", "somatic"],
        verbalText: "Omnia video!",
        somaticText: "Throw your entire hand of cards forward, they dissolve into a crackling stream of probability"
      },
      resolution: "CARDS",
      effectTypes: ["damage"],
      damageConfig: {
        formula: "Card Value × 3 per expended card",
        damageTypes: ["blight"],
        resolution: "CARDS",
        cardConfig: {
          drawCount: 1,
          formula: "Card Value × 3 per expended card"
        }
      },
      specialMechanics: {
        threadsOfDestiny: {
          generation: "Expelling your entire reserve in a single burst generates 3 Karmic Debt.",
          usage: "Consumes ALL cards from Fate Reserve"
        }
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 4
      },
      tags: ["damage", "cards", "level 7", "gambit"]
    },

    { id: "fate_weaver_destiny_rewritten",
      name: "Destiny Rewritten",
      description: "Target an active status effect on a creature. Choose one active buff or debuff on any target within 60 feet. Draw 1 card. If the card is a face card or Ace, you double the remaining duration of that effect. If it is a numbered card, you immediately end the effect. Rewriting a status duration generates 2 Karmic Debt.",
      level: 7,
      spellType: "ACTION",
      icon: "Utility/Hourglass",
      typeConfig: {
        school: "wyrd",
        icon: "Utility/Hourglass",
        tags: ["utility", "cards"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: ["any"]
      },
      resourceCost: {
        actionPoints: 1,
        resourceTypes: ["mana"],
        resourceValues: { mana: 15 }
      },
      resolution: "CARDS",
      effectTypes: ["utility"],
      utilityConfig: {
        utilityType: "fate_manipulation",
        selectedEffects: [
          {
            id : "duration_rewrite",
            name: "Duration Rewrite",
            description: "Face/Ace: Double duration. Numbered: End the effect immediately."
          }
        ]
      },
      specialMechanics: {
        threadsOfDestiny: {
          generation: "Directly rewriting active effect durations generates 2 Karmic Debt."
        }
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 3
      },
      tags: ["utility", "cards", "level 7", "gambit"]
    },

    // ========================================
    // LEVEL 8 SPELLS
    // ========================================
    { id: "fate_weaver_the_jokers_hand",
      name: "The Wild Joker",
      description: "Draw 3 cards. Red Joker: heal allies 8d8+Spirit, clear debuffs. Black Joker: you take 5d10 blight, enemies take 8d10 blight (30 ft). Standard: 2d8 blight. +3 Debt.",
      level: 8,
      spellType: "ACTION",
      icon: "Chaos/Chaotic Shuffle",
      typeConfig: {
        school: "wyrd",
        icon: "Chaos/Chaotic Shuffle",
        tags: ["damage", "healing", "cards"],
        castTime: 2,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 60,
        aoeShape: "circle",
        aoeParameters: { radius: 30 }
      },
      resourceCost: {
        actionPoints: 2,
        resourceTypes: ["mana"],
        resourceValues: { mana: 35 }
      },
      resolution: "CARDS",
      effectTypes: ["damage", "healing"],
      damageConfig: {
        formula: "Card Value × 5 (Black Joker) / Card Value (Standard)",
        damageTypes: ["blight"],
        resolution: "CARDS"
      },
      healingConfig: {
        formula: "Card Value × 4 + Spirit (Red Joker)",
        healingType: "direct",
        resolution: "CARDS"
      },
      specialMechanics: {
        threadsOfDestiny: {
          generation: "Unleashing the chaotic nature of the Joker generates 3 Karmic Debt."
        }
      },
      cooldownConfig: {
        cooldownType: "long_rest",
        cooldownValue: 1
      },
      tags: ["damage", "healing", "cards", "level 8", "gambit"]
    },

    { id: "fate_weaver_fate_sealed",
      name: "Fate Sealed",
      description: "Seal the target's probability anchor. Choose an enemy within 60 feet. They must make a Spirit saving throw against your spell DC. On a failure, they are marked for immediate execution: for the next 3 rounds, any attack roll made against them is a guaranteed critical hit. The strain of sealing this absolute doom generates 4 Karmic Debt.",
      level: 8,
      spellType: "ACTION",
      icon: "General/Gallows",
      typeConfig: {
        school: "blight",
        icon: "General/Gallows",
        tags: ["debuff", "utility"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: ["enemy"]
      },
      resourceCost: {
        actionPoints: 2,
        resourceTypes: ["mana"],
        resourceValues: { mana: 40 },
        components: ["verbal"],
        verbalText: "Sententia mortis!"
      },
      resolution: "SAVE",
      effectTypes: ["debuff"],
      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          {
            id : "fate_sealed_mark",
            name: "Fate Sealed Mark",
            description: "All attacks against target are guaranteed critical hits.",
            mechanicsText: "Spirit save or target is marked: all attacks against them are guaranteed crits for 3 rounds. Inflicts 4 Karmic Debt."
          }
        ],
        durationValue: 3,
        durationType: "rounds",
        durationUnit: "rounds"
      },
      specialMechanics: {
        threadsOfDestiny: {
          generation: "Sealing a mortal's fate thread generates 4 Karmic Debt."
        }
      },
      cooldownConfig: {
        cooldownType: "long_rest",
        cooldownValue: 1
      },
      tags: ["debuff", "utility", "level 8", "gambit"]
    },

    { id: "fate_weaver_fates_wager",
      name: "Karmic Wager",
      description: "Wager your own stability for amplification. Draw 1 card. If it is a face card or Ace, your next spell within 1 round deals triple damage and costs 0 AP. If it is a numbered card, your next spell deals double damage, but you take the exact same damage yourself. Drawing this wager generates 2 Karmic Debt.",
      level: 8,
      spellType: "ACTION",
      icon: "Necrotic/Ritual",
      typeConfig: {
        school: "blight",
        icon: "Necrotic/Ritual",
        tags: ["buff", "cards", "risk_reward"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "self",
        rangeType: "self"
      },
      resourceCost: {
        actionPoints: 1,
        resourceTypes: ["mana"],
        resourceValues: { mana: 35 },
        components: ["verbal"],
        verbalText: "The wager is cast!"
      },
      resolution: "CARDS",
      effectTypes: ["buff"],
      buffConfig: {
        buffType: "amplify",
        effects: [
          {
            id : "fates_wager_buff",
            name: "Karmic Wager",
            description: "Face/Ace: next spell 3x. Numbered: 2x but hits you as well.",
            mechanicsText: "Face/Ace: next spell deals 3x damage at 0 AP. Numbered: next spell 2x damage but you take equal damage. Inflicts 2 Karmic Debt."
          }
        ],
        durationValue: 1,
        durationType: "rounds",
        durationUnit: "rounds"
      },
      specialMechanics: {
        threadsOfDestiny: {
          generation: "Taking a direct gamble on your temporal anchor generates 2 Karmic Debt."
        }
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 4
      },
      tags: ["buff", "cards", "level 8", "gambit"]
    },

    // ========================================
    // LEVEL 9 SPELLS
    // ========================================
    { id: "fate_weaver_grand_gambit",
      name: "Grand Gambit",
      description: "Initiate a competitive card draw with every enemy within 40 feet. Draw 1 card for each enemy, and 1 for yourself. If your card is higher than the enemy's, they are instantly reduced to 1 HP. If your card is lower, they are fully healed and gain +2 DR for 1 minute. Ties inflict no effect but generate 1 debt. Generates 3 baseline debt.",
      level: 9,
      spellType: "ACTION",
      icon: "Necrotic/Skull Explosion",
      typeConfig: {
        school: "blight",
        icon: "Necrotic/Skull Explosion",
        tags: ["damage", "healing", "cards"],
        castTime: 2,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "circle",
        aoeParameters: { radius: 40 },
        targetRestrictions: ["enemy"]
      },
      resourceCost: {
        actionPoints: 3,
        resourceTypes: ["mana"],
        resourceValues: { mana: 60 },
        components: ["verbal", "somatic"],
        verbalText: "Fate and ruin!",
        somaticText: "Weave probability threads from all nearby enemies into your cards"
      },
      resolution: "CARDS",
      effectTypes: ["damage", "healing"],
      damageConfig: {
        formula: "Reduce to 1 HP (War Win)",
        damageTypes: ["blight"],
        resolution: "CARDS",
        cardConfig: {
          drawCount: 1,
          formula: "Reduce to 1 HP"
        }
      },
      healingConfig: {
        formula: "Heal to Full (War Loss)",
        healingType: "direct",
        resolution: "CARDS"
      },
      specialMechanics: {
        grandGambit: {
          description: "Compare your card against each target's card. Win: reduced to 1 HP. Lose: fully healed.",
          perTarget: true
        },
        threadsOfDestiny: {
          generation: "Each tie or loss in matchups generates 1 Karmic Debt.",
          usage: "Spend 2 debt per enemy to call your card for their matchup"
        }
      },
      cooldownConfig: {
        cooldownType: "long_rest",
        cooldownValue: 1
      },
      tags: ["damage", "healing", "cards", "level 9", "gambit"]
    },

    { id: "fate_weaver_master_of_destiny",
      name: "Sovereign of Fate",
      description: "Draw 13 cards into your Fate Reserve as an absolute Throne. For 1 minute, you may spend 1 Karmic Debt to override any creature's die roll with a card from this Throne: Face cards convert to 20, Aces to 1 or 20, and numbered cards to their exact face value. Generates 3 Karmic Debt baseline.",
      level: 9,
      spellType: "ACTION",
      icon: "Radiant/Divine Illumination",
      typeConfig: {
        school: "wyrd",
        icon: "Radiant/Divine Illumination",
        tags: ["buff", "cards", "utility"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "self",
        rangeType: "self"
      },
      resourceCost: {
        actionPoints: 2,
        resourceTypes: ["mana"],
        resourceValues: { mana: 70 },
        components: ["verbal"],
        verbalText: "Ego sum lex!"
      },
      resolution: "CARDS",
      effectTypes: ["buff"],
      buffConfig: {
        buffType: "fate_control",
        effects: [
          {
            id : "master_of_destiny_buff",
            name: "Sovereign Override",
            description: "Spend 1 debt to replace any die roll with a Throne card value.",
            mechanicsText: "Draw 13 Throne cards. Spend 1 Karmic Debt per roll to replace any d20. Face=20, Ace=1 or 20, Numbered=face value. Lasts 1 minute. Inflicts 3 Karmic Debt."
          }
        ],
        durationValue: 1,
        durationType: "minutes",
        durationUnit: "minutes"
      },
      specialMechanics: {
        threadsOfDestiny: {
          generation: "Manifesting the Throne of 13 cards generates 3 Karmic Debt.",
          usage: "Spend 1 debt per roll replacement. Face cards = 20. Aces = 1 or 20."
        }
      },
      cooldownConfig: {
        cooldownType: "long_rest",
        cooldownValue: 1
      },
      tags: ["buff", "cards", "utility", "level 9", "gambit"]
    },

    { id: "fate_weaver_jackpot_supreme",
      name: "Karmic Rupture",
      description: "Draw 3 cards and shatter them. Ranks dictate blight damage in a 30-foot circle: One Pair multiplies a 10d10 base damage by 3. Three of a kind multiplies damage by 7 and targets suffer 'Temporal Overload' (incapacitated and take 4d10 blight damage at start of turn for 1 round). No matches deal 10d10 base and inflict 3 debt.",
      level: 9,
      spellType: "ACTION",
      icon: "Force/Explosion Burst",
      typeConfig: {
        school: "blight",
        icon: "Force/Explosion Burst",
        tags: ["damage", "aoe", "cards"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 90,
        aoeShape: "circle",
        aoeParameters: { radius: 30 },
        targetRestrictions: ["enemy"]
      },
      resourceCost: {
        actionPoints: 3,
        resourceTypes: ["mana"],
        resourceValues: { mana: 65 },
        components: ["verbal", "somatic"],
        verbalText: "Ruptura!",
        somaticText: "Violently shatter three probability cards, unleashing a shockwave of raw chance"
      },
      resolution: "CARDS",
      effectTypes: ["damage"],
      damageConfig: {
        formula: "Card Sum × Multiplier (Pair: ×3, Triple: ×7)",
        damageTypes: ["blight"],
        resolution: "CARDS",
        cardConfig: {
          drawCount: 3,
          formula: "Card Sum × Multiplier"
        },
        savingThrow: {
          ability: "agility",
          difficultyClass: 20,
          saveOutcome: "half_damage"
        }
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 1,
        durationUnit: "rounds"
      },
      specialMechanics: {
        jackpot: {
          noMatch: { multiplier: 1, description: "10d10 base damage + 3 debt" },
          twoMatch: { multiplier: 3, description: "10d10 × 3 blight damage" },
          threeMatch: { multiplier: 7, description: "10d10 × 7 damage + Temporal Overload incapacitation for 1 round" }
        },
        threadsOfDestiny: {
          generation: "Drawing no matching cards in the Rupture generates 3 Karmic Debt.",
          usage: "Spend 4 debt to call a card that matches one of your drawn cards"
        }
      },
      cooldownConfig: {
        cooldownType: "long_rest",
        cooldownValue: 1
      },
      tags: ["damage", "aoe", "cards", "level 9", "gambit"]
    },

    // ========================================
    // LEVEL 10 SPELLS
    // ========================================
    { id: "fate_weaver_rewrite_destiny",
      name: "Epitaph of Fate",
      description: "Draw 13 cards and rearrange them to rewrite reality. All Face: target ally is immune to all damage and automatically succeeds on all rolls for 1 minute. Same Suit: target enemy is reduced to 1 HP and suffers Temporal Collapse (incapacitated and takes 5d10 blight damage each turn for 1 minute). Failure to form a pattern inflicts 5 Karmic Debt.",
      level: 10,
      spellType: "ACTION",
      icon: "Arcane/Rewind Time",
      typeConfig: {
        school: "blight",
        icon: "Arcane/Rewind Time",
        tags: ["utility", "cards"],
        castTime: 3,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 120,
        targetRestrictions: ["any"]
      },
      durationConfig: {
        durationType: "minutes",
        durationValue: 1,
        durationUnit: "minutes"
      },
      resourceCost: {
        actionPoints: 3,
        resourceTypes: ["mana"],
        resourceValues: { mana: 90 },
        components: ["verbal", "somatic"],
        verbalText: "Fatum delevit!",
        somaticText: "Weave 13 cards into a spiraling lattice around the target"
      },
      resolution: "CARDS",
      effectTypes: ["utility"],
      utilityConfig: {
        utilityType: "fate_manipulation",
        selectedEffects: [
          {
            id : "rewrite_destiny_effect",
            name: "Reality Epitaph",
            description: "All face: ally immune 1 min. Same suit: enemy 1 HP + Temporal Collapse. Sequential: permanent polymorph."
          }
        ],
        duration: 1,
        durationUnit: "minutes"
      },
      specialMechanics: {
        rewriteDestiny: {
          choices: [
            {
              name: "All Face Cards",
              effect: "Ally immune and auto-success for 1 minute",
              requirement: "All 13 cards must be face cards"
            },
            {
              name: "All Same Suit",
              effect: "Enemy 1 HP + Temporal Collapse (incapacitated + strain) for 1 minute",
              requirement: "All 13 cards share a suit"
            }
          ]
        },
        threadsOfDestiny: {
          generation: "Failing to form a valid pattern among the 13 cards generates 5 Karmic Debt."
        }
      },
      cooldownConfig: {
        cooldownType: "long_rest",
        cooldownValue: 1
      },
      tags: ["utility", "cards", "level 10", "gambit"]
    },

    { id: "fate_weaver_deck_of_many_things",
      name: "Grim Deck of Fates",
      description: "Summon a legendary deck of probability and draw 1-3 cards. Each card yields either a miraculous blessing or a catastrophic curse. Catastrophic cards immediately generate 3 Karmic Debt. You may spend 5 debt to redraw a curse.",
      level: 10,
      spellType: "ACTION",
      icon: "Arcane/Arcane Tome",
      typeConfig: {
        school: "blight",
        icon: "Arcane/Arcane Tome",
        durationValue: 0,
        durationUnit: "instant"
      },
      resourceCost: {
        actionPoints: 2,
        resourceTypes: ["mana"],
        resourceValues: { mana: 80 },
        components: ["somatic"],
        somaticText: "Draw shimmering cards of condensed fate from the legendary deck"
      },
      resolution: "CARDS",
      effectTypes: ["utility"],
      utilityConfig: {
        utilityType: "fate_manipulation",
        selectedEffects: [
          {
            id : "deck_of_many_things_harvest",
            name: "Grim Deck",
            description: "Draw 1-3 cards from legendary fate deck. Major positive or catastrophic negative."
          }
        ],
        duration: 0,
        durationUnit: "instant"
      },
      rollableTable: {
        enabled: true,
        name: "Grim Deck of Fates — Results",
        description: "Draw 1-3 cards. Each has a major effect.",
        resolutionType: "CARDS",
        resolutionConfig: { cardType: "deck_of_many_things", cardCount: 3 },
        entries: [
          { range: "Vizier", effect: "Know the answer to your next dilemma", threadGeneration: 0 },
          { range: "Euryale", effect: "-2 to all saves permanently + gain 3 debt", threadGeneration: 3 }
        ]
      },
      specialMechanics: {
        threadsOfDestiny: {
          generation: "Each catastrophic card drawn generates 3 Karmic Debt.",
          usage: "Spend 5 debt to redraw one catastrophic card"
        }
      },
      cooldownConfig: {
        cooldownType: "long_rest",
        cooldownValue: 1
      },
      tags: ["utility", "cards", "level 10", "gambit"]
    },

    { id: "fate_weaver_casino_royale",
      name: "The Grand Theater",
      description: "Transform the battlefield into a probability theater in a 100-foot radius. Draw a card for every creature within: their suit determines their forced game: Hearts (Aether Wager), Spades (Duel of Wills), Diamonds (Blackjack), Clubs (Solitaire). You are the House, generating 2 Karmic Debt at the start of each of your turns.",
      level: 10,
      spellType: "ACTION",
      icon: "Necrotic/Necrotic Death",
      typeConfig: {
        school: "blight",
        icon: "Necrotic/Necrotic Death",
        tags: ["zone", "control", "cards"],
        castTime: 2,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "circle",
        aoeParameters: { radius: 100 }
      },
      resourceCost: {
        actionPoints: 3,
        resourceTypes: ["mana"],
        resourceValues: { mana: 90 },
        components: ["verbal", "somatic"],
        verbalText: "Welcome to the theater of fate!",
        somaticText: "Sweep hands to project probability energy in a 100 ft circle"
      },
      resolution: "CARDS",
      effectTypes: ["utility", "control"],
      durationConfig: {
        durationType: "minutes",
        durationValue: 1,
        durationUnit: "minutes"
      },
      utilityConfig: {
        utilityType: "fate_manipulation",
        selectedEffects: [
          {
            id : "casino_zone_effect",
            name: "Grand Theater Domain",
            description: "Battlefield becomes theater. Hearts (Wager), Spades (Duel), Diamonds (Blackjack), Clubs (Solitaire)."
          }
        ],
        duration: 1,
        durationUnit: "minutes"
      },
      controlConfig: {
        controlType: "zone",
        effects: [
          {
            id : "forced_game_effect",
            controlType: "zone",
            name: "Fate Plays",
            description: "Creatures must play assigned game each turn.",
            config: {
              duration: 1,
              durationUnit: "minutes",
              strength: "strong"
            }
          }
        ],
        duration: 1,
        durationUnit: "minutes"
      },
      zoneConfig: {
        duration: 1,
        durationUnit: "minutes",
        effects: ["casino_rules"],
        movable: false,
        size: { radius: 100 }
      },
      specialMechanics: {
        casinoRoyale: {
          description: "All creatures forced to perform card games based on suits drawn.",
          youAreTheHouse: "You always draw first and choose. You generate +2 debt at the start of your turns."
        },
        threadsOfDestiny: {
          generation: "+2 debt at start of your turns"
        }
      },
      cooldownConfig: {
        cooldownType: "long_rest",
        cooldownValue: 1
      },
      tags: ["zone", "control", "cards", "level 10", "gambit"]
    },

    // ===== PASSIVE ABILITIES =====
    { id: "fate_weaver_deck_exhaustion",
      name: "Arcane Exhaustion",
      description: "When your deck runs dry and must be reshuffled, the probability drain taxes your system. You take 2d6 wyrd damage and are unable to call cards or manipulate rolls for that turn.",
      level: 1,
      spellType: "PASSIVE",
      icon: "Arcane/Magical Cross Emblem 2",
      effectTypes: ["passive"],
      typeConfig: {
        school: "blight",
        icon: "Arcane/Magical Cross Emblem 2",
        tags: ["passive", "weakness"],
        castTime: 0,
        castTimeType: "PASSIVE"
      },
      targetingConfig: { targetingType: "self", rangeType: "self" },
      resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 0 },
      resolution: "AUTOMATIC",
      tags: ["passive", "weakness"]
    },

    { id: "fate_weaver_fates_wrath",
      name: "Karmic Strain",
      description: "Every time you override a natural roll, force a destiny, or use the 'Call Card' ability, you accumulate 1 stack of Karmic Debt (max 13). Each stack of debt imposes +5% vulnerability to all damage types and deals 1d4 wyrd strain at the end of each round (untreatable by normal magic). Reaching 13 debt triggers immediate Tapestry Collapse, dealing 6d10 wyrd damage and incapacitating you for 1 round.",
      level: 1,
      spellType: "PASSIVE",
      icon: "Force/Explosion Burst",
      effectTypes: ["passive", "debuff"],
      typeConfig: {
        school: "blight",
        icon: "Force/Explosion Burst",
        tags: ["passive", "weakness"],
        castTime: 0,
        castTimeType: "PASSIVE"
      },
      targetingConfig: { targetingType: "self", rangeType: "self" },
      resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 0 },
      resolution: "AUTOMATIC",
      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          {
            id : "karmic_debt_vulnerability",
            name: "Karmic Debt Vulnerability",
            description: "Suffer compounding +5% vulnerability and 1d4 psychic strain per stack of debt.",
            mechanicsText: "+5% all-damage vulnerability per Karmic Debt stack. 1d4 wyrd strain per stack at end of each round. At 13 stacks: Tapestry Collapse (6d10 wyrd + 1 round incapacitation).",
            statusEffect: {
              type: "vulnerability",
              value: 5,
              stat: "all_damage",
              magnitude: 5,
              magnitudeType: "percentage"
            }
          }
        ]
      },
      tags: ["passive", "weakness"]
    },

    { id: "fate_weaver_empty_hand",
      name: "Unmoored Void",
      description: "When your Fate Reserve is empty and you have 0 Karmic Debt, your temporal anchor is dangerously unmoored. You have disadvantage on all saving throws and Dodge checks until you draw a card or gain 1 debt.",
      level: 3,
      spellType: "PASSIVE",
      icon: "General/Broken Armor",
      effectTypes: ["passive", "debuff"],
      typeConfig: {
        school: "wyrd",
        icon: "General/Broken Armor",
        tags: ["passive", "weakness"],
        castTime: 0,
        castTimeType: "PASSIVE"
      },
      targetingConfig: { targetingType: "self", rangeType: "self" },
      resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 0 },
      resolution: "AUTOMATIC",
      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          {
            id : "unmoored_void_anchor",
            name: "Unmoored Anchor",
            description: "Disadvantage on all saving throws and Dodge checks.",
            mechanicsText: "While Fate Reserve is empty and Karmic Debt is 0: disadvantage on all saves and Dodge checks. Ends when you draw a card or gain 1 debt."
          }
        ],
        statPenalties: [
          { stat: "saves_and_dodge", magnitude: -99, magnitudeType: "disadvantage" }
        ]
      },
      tags: ["passive", "weakness"]
    },

      {
        "id": "fate-reading_loom",
        "name": "Reading of the Loom",
        "description": "Weave thin, glowing ethereal threads between the fingers of two observed creatures. By observing the tension, colors, and vibrations of the threads, gain a deep insight into their relationship or trust.",
        "level": 1,
        "spellType": "ACTION",
        "icon": "Arcane/Tangled Threads",
        "typeConfig": {
          "school": "arcane",
          "icon": "Arcane/Tangled Threads",
          "tags": [
            "utility",
            "roleplay",
            "gambit"
          ],
          "castTime": 1,
          "castTimeType": "IMMEDIATE"
        },
        "targetingConfig": {
          "targetingType": "area",
          "rangeType": "ranged",
          "rangeDistance": 30,
          "aoeShape": "circle",
          "aoeParameters": {
            "radius": 10
          }
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
          "somaticText": "Pluck the empty air, your fingers mimicking a weaver at a vertical loom"
        },
        "resolution": "NONE",
        "effectTypes": [
          "utility"
        ],
        "utilityConfig": {
          "utilityType": "perception",
          "selectedEffects": [
            {
              "id": "reading_loom_effect",
              "name": "Fate-Thread Reading",
              "description": "Reveals the immediate emotional alignment between two targets (e.g. mutual trust, hidden malice, fear, or absolute loyalty)."
            }
          ],
          "duration": 1,
          "durationUnit": "rounds",
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
          "gambit"
        ]
      }
 
  ],
};
