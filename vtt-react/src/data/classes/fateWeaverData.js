/**
 * Fate Weaver Class Data
 *
 * Sovereign of Flayed Skins — destiny is a physical body, and we are the surgeons who flay it.
 * Overhauled per the Auditor's Report: Witcher/Grimm dark folklore aesthetics,
 * Sanguine Reserve expanded capacity (4 cards, scaling to 7 for Sanguine Dealer),
 * normalized poker-hand scaling on Dirges of Flesh, and the brand-new Level 1 reaction
 * override spell 'Tapestry Shred'. Strictly VTT compliant, zero 5e tropes.
 */

export const FATE_WEAVER_DATA = {
  id: "fate-weaver",
  name: "Fate Weaver",
  icon: "fas fa-skull",
  role: "Macabre Cartomancer",
  damageTypes: ["psychic", "necrotic"],

  spellPools: {
    1: ["hand-of-fate", "war-of-wills", "echoes-of-the-past", "marked-card", "fate_lucky_strike", "fate_twist_probability", "tapestry-shred"],
    2: ["hearts-gamble", "fate_fortune_favor"],
    3: ["draw-of-the-damned", "echo-of-fate"],
    4: ["solitaires-shield", "fates-exchange", "destiny-bond"],
    5: ["fate_weaver_stacked_deck", "fate_weaver_twist_fate"],
    6: ["fate_weaver_dealers_choice", "fate_weaver_twenty_one_curses", "fate_weaver_fold_reality"],
    7: ["fate_weaver_house_rules", "fate_weaver_all_in", "fate_weaver_destiny_rewritten"],
    8: ["fate_weaver_the_jokers_hand", "fate_weaver_fate_sealed", "fate_weaver_fates_wager"],
    9: ["fate_weaver_grand_gambit", "fate_weaver_master_of_destiny", "fate_weaver_jackpot_supreme"],
    10: ["fate_weaver_rewrite_destiny", "fate_weaver_deck_of_many_things", "fate_weaver_casino_royale"]
  },

  classIdentity: {
    title: "Sovereign of Flayed Skins",
    subtitle: "The Cartomancer's Philosophy",
    utility: "Absolute, un-debatable d20 outcome overrides. They possess the exclusive, hard-coded domain capacity to replace active dice results at the table with pre-drawn card values, completely bypassing standard RNG checks for critical successes or saving throws.",
    fatalFlaw: "Karmic Debt and Hemorrhaging. Every single time they force reality to bend to their hand, time takes a literal pound of flesh. They accumulate an agonizing debt gauge that rapidly inflates their vulnerability to all damage types, inflicts persistent bleed counts, and triggers an instantaneous collapse if pushed past its limit (13 points). They possess zero defensive multi-target tools and are highly vulnerable to crushing, close-range martial attacks."
  },

  // Overview section
  overview: {
    title: "The Fate Weaver",
    subtitle: "Sovereign of Flayed Skins",

    quickOverview: {
      title: "Quick Overview",
      content: `**What You Need to Know**: You do not study magic; you perform anatomical surgery on time itself. Your spells are curses, and your power is paid in the flesh of flayed cards. You bank pre-drawn cards into your **Sanguine Reserve** and spend them to force absolute, un-debatable d20 outcome overrides anywhere on the field, completely bypassing RNG.
      
**Core Mechanic**: Draw cards → Bank them in Sanguine Reserve (0-4 cards) → Force overrides on d20 rolls (Face/Ace = 14-18, Numbered = Face Value) → Accumulate **Karmic Debt** (0-13) for overriding destiny → Suffer cascading debuffs (+5% vulnerability to all damage and 1d4 bleeding per stack) → Reaching 13 debt triggers immediate **Tapestry Collapse** (6d10 psychic damage and 1-round incapacitation).

**Resource**: Sanguine Reserve (baseline capacity: 4 banked cards) & Karmic Debt (0-13 gauge).

**Playstyle**: Extreme, oppressive risk-reward cartomancy with absolute control over success and failure, balanced by crushing physical frailty and self-inflicted hemorrhages.

**Best For**: Tacticians who crave absolute control over the table's dice rolls, enjoy calculating complex card-counting wagers, and embrace a high-risk, tragic dark fantasy aesthetic.`
    },

    description: `The Fate Weaver is a grim surgical architect of time. They view destiny not as an abstract concept, but as a physical body of veins and tendons—and they are the surgeons who flay it. Wielding decks of flayed skin and blood-ink parchment, they rip out threads of probability to force absolute outcomes. They do not roll for miracles; they command them. But the universe is a jealous accountant. For every thread of probability they shred, the cosmic balance tears a matching strip from their own body, accumulating Karmic Debt that slowly bleeds them to death.`,

    roleplayIdentity: {
      title: "Roleplay Identity",
      content: `In the tragic fantasy folklore of Mythrill, Fate Weavers are feared outcasts known as the "Sovereigns of Flayed Skins." They are individuals who looked into the Loom of Agony and tore away the threads that bound their lives. Their tools are cards crafted from their own flayed skin or the hides of those who died in desperate wagers.
      
Their power manifests as a grotesque physical corruption. Every card drawn slices open micro-fissures in their palms; every point of Karmic Debt they accumulate causes their veins to blacken and bleed through their skin. They speak in hushed, rhythmic dirges—their magic feeling less like divine authority and more like agonizing physical mutilation.

Fate Weaver archetypes include:
- **The Desperate Surgeon**: Attempted to sew a dying loved one's life thread back together, only to bind themselves to the flayed deck forever.
- **The Accursed Gambler**: Wagered their skin against an ancient entity of probability, winning the deck but losing their physical anchor.
- **The Heretical Chronicler**: Believes that all mortal history is a poorly written dirge and seeks to violently edit it card by card.`
    },

    combatRole: {
      title: "Combat Role",
      content: `The Fate Weaver represents the ultimate target-priority and fate-control utility in Mythrill. They offer:

**Absolute Dice Control**: The only class capable of bypassing the d20 roll entirely. By spending cards from their Sanguine Reserve, they can guarantee critical hits for allies or force critical failures on boss saving throws.
**High-Risk Necrotic Offense**: Their poker-based spells deal devastating necrotic damage, but scaling these spells escalates their own Karmic Debt.
**Agonizing Vulnerability**: They have zero defensive multi-target tools and suffer massive vulnerability to martial strikes. A Fate Weaver who manages their debt poorly will bleed out from their own success.

They are the ultimate double-edged sword: a class that can decide the outcome of any single action on the field, but whose very presence invites a swift, bleeding death.`
    },

    playstyle: {
      title: "Playstyle & Strategy",
      content: `Playing a Fate Weaver is a relentless math puzzle of blood and probability. You must constantly balance your banked cards against your rising debt.

**Sanguine Reserve Management**:
- Keep your reserve stocked (baseline capacity: 4 cards). An empty hand leaves you unmoored and highly vulnerable.
- Use **Sanguine Dealer** to scale your reserve capacity up to 7 cards, giving you a massive bank of overrides.

**The Karmic Debt Balance**:
- **0-4 Debt (Safe)**: Manageable, minor vulnerability.
- **5-9 Debt (Danger)**: Compounding +5% vulnerability per stack makes physical strikes lethal. You take 1d4 bleeding per stack at the end of each round.
- **10-12 Debt (Razor's Edge)**: Maximum offensive bonuses, but a single hit will obliterate you.
- **13 Debt (Tapestry Collapse)**: Immediate catastrophe. Your physical body fails, dealing 6d10 psychic damage and incapacitating you.

**The Override Timing**:
- Do not waste your banked cards on minor rolls. Save your high face cards for crucial saving throws or high-impact spell attacks.
- Use **Tapestry Shred** as a reaction to turn an enemy's critical success into a failure, or to force an ally's desperate strike to land.`
    },

    immersiveCombatExample: {
      title: "Combat Example: Flaying the Loom",
      content: `**The Setup**: You are a Fate Weaver facing a colossal, armored Death Knight. Your tank is battered, and your mage is preparing a final, massive spell. Your Sanguine Reserve has 3 cards banked: a King (17), a Queen (16), and a 3. Your current Karmic Debt is 4.

**Turn 1 - Forcing the Opening**
*The Death Knight swings its massive runeblade at your tank. It's a devastating blow—a rolled 19.*
*You step forward, your flayed skin deck humming with dark probability. You shred the tapestry.*
**Your Reaction**: Cast "Tapestry Shred" (10 mana, consumes King from Sanguine Reserve, inflicts +2 debt).
**The Result**: You override the Death Knight's roll. The rolled 19 is replaced by your King, but because it is an enemy attack, you choose to apply the 3 from your reserve instead, forcing an absolute failure!
**Karmic Debt**: 4 → 6.
**Drawback**: Your veins throb with black ichor. You now take 6d4 bleeding damage at the end of the round, and suffer +30% vulnerability to all damage types.

**Turn 2 - The Tragic Wager**
*The Death Knight is off-balance. Your mage launches their spell. The Knight must make an Agility saving throw.*
**Your Action**: Cast "Dirges of Flesh" (5 mana, AP: 1).
*You draw 5 flayed skins to form a poker hand. You get: Jack, Jack, Queen, 4, 2 (One Pair).*
*You discard the 4 and 2, redrawing to get: Jack, Jack, Jack, 9, 5 (Three of a Kind).*
**The Result**: Deals 2d10 necrotic damage and inflicts +1 debt.
**Karmic Debt**: 6 → 7.
*Your palms bleed open. You are now extremely frail, but you have paved the way for victory.*`
    }
  },

  // Resource System
  resourceSystem: {
    title: "Sanguine Reserve & Karmic Debt",
    subtitle: "Flayed Probability & Cosmic Repayments",
    description: `Your magic is a literal mutilation of probability. You hold a deck of flayed parchment cards, drawing them into your physical hand and banking them in your **Sanguine Reserve** (baseline maximum: 4 cards). These banked cards represent hard-coded destiny. When a creature rolls a d20, you can shred the tapestry of time, replacing their roll with the value of your card. But the loom demands symmetry: each override generates **Karmic Debt**. At 13 points of debt, your physical anchor collapses.`,
    
    cards: [
      {
        title: "Sanguine Reserve (0-4)",
        stats: "4 Cards Max (Baseline)",
        details: "Holds pre-drawn cards. Expended to override d20 rolls. Face cards map to 15-17, Aces map to 18, numbered cards map to their exact value."
      },
      {
        title: "Karmic Debt (0-13)",
        stats: "13 Stack Limit",
        details: "Each stack inflicts +5% damage vulnerability from all sources and deals 1d4 necrotic bleeding at the end of each round. Reaching 13 debt triggers immediate Tapestry Collapse."
      }
    ],

    generationTable: {
      headers: ["Action", "Resource Change", "Notes"],
      rows: [
        ["Bank Card (Sanguine Reserve)", "+1 Card", "Uses 'Sanguine Reserve' spell; max baseline 4 cards."],
        ["Force Override (Reaction)", "-1 Card, +2 Debt", "Replaces any d20 roll within 60 ft with card value."],
        ["Cast 'Dirges of Flesh'", "Variable Debt", "Each poker hand outcome inflicts 1-4 debt based on strength."],
        ["Call Card", "+2 Debt", "Search deck for a specific card; once per turn."],
        ["Extended Rest", "Resets Debt to 0", "Your body stitches itself back together; deck reshuffled."]
      ]
    },

    usage: {
      momentum: "Use your Sanguine Reserve cards to bypass RNG. Keep high face cards for saving throws and critical hits, and low numbered cards to force enemy failures.",
      flourish: "Manage your Karmic Debt. Push to high debt levels only when a combat ending blow is guaranteed. Use cleansing spells or rest to reduce debt before collapse."
    },

    overheatRules: {
      title: "Tapestry Collapse (13 Stacks)",
      content: `If your Karmic Debt reaches exactly 13 stacks, the pressure on your physical anchor reaches a breaking point. The timeline snaps back violently, tearing your flesh and mind apart:
- You immediately take **6d10 psychic damage** (this damage cannot be reduced or bypassed).
- You are **incapacitated** for 1 full round.
- Your Sanguine Reserve is entirely emptied (all banked cards are burned to ash).
- Your Karmic Debt resets to 0, but your maximum HP is permanently reduced by 5 until you complete a long rest.`
    },

    infernoLevelsTable: {
      title: "Karmic Debt Compounding Agony",
      headers: ["Debt Stacks", "Vulnerability", "End of Round Bleeding", "Mental State"],
      rows: [
        ["0", "0%", "None", "Anchored"],
        ["1-3", "+5% per stack", "1d4 necrotic per stack", "Flickering pulse; minor hand tremors."],
        ["4-6", "+5% per stack", "1d4 necrotic per stack", "Molten veins; skin begins to weep blood."],
        ["7-9", "+5% per stack", "1d4 necrotic per stack", "Shattered vision; voices of dead timelines scream."],
        ["10-12", "+5% per stack", "1d4 necrotic per stack", "Body dissolves into floating threads; near collapse."],
        ["13", "COLLAPSE", "Tapestry Collapse", "Immediate biological and psychic shutdown."]
      ]
    },

    strategicConsiderations: {
      title: "Strategic Laws of the Cartomancer",
      content: `**1. The Stitched Hand Scaling**: Sanguine Dealer specializations increase this reserve cap to 7 cards. This allows you to hold a full hand of options, making your d20 overrides vastly more versatile.
**2. Bleed Stacking**: The bleeding damage from Karmic Debt is necrotic and cannot be mitigated by standard magical resistance. It applies at the very end of your turn, meaning you must heal or end the combat before the round finishes.
**3. Target Priority**: You have zero defense against multiple targets. If surrounded, use 'Karmic Displacement' or 'Folding of Flesh' immediately to reposition. You are a glass focal point; stay behind your front liners.`
    }
  },

  // Specializations
  specializations: {
    title: "Fate Weaver Specializations",
    subtitle: "Three Postures of Flayed Reality",
    description: "Every Fate Weaver decides how they will carve the anatomy of probability. Your choice of specialization dictates how you handle the flayed cards and the cosmic backlash.",
    
    specs: [
      {
        id: "fortune_teller",
        name: "Flesh Scryer",
        icon: "Eye/All Seeing Eye",
        color: "#9b59b6",
        theme: "Anatomical Prophecy",
        playstyle: "Manipulate enemy saving throws and predict combat outcomes using pre-drawn flesh cards.",
        description: "Masters of looking through the skin of time to foresee and dictate enemy failures.",
        strengths: [
          "Highest difficulty class for psychic saving throws",
          "Forces disadvantage on enemy defense checks",
          "Excellent long-range psychic disruption"
        ],
        weaknesses: [
          "Relies heavily on high intellect cards",
          "Extremely vulnerable to physical stealth attacks",
          "No native physical self-defense"
        ],
        passiveAbility: {
          name: "Flayed Foresight",
          description: "When an enemy within 60 feet rolls a saving throw, you may peek at the top card of your deck. If it is a face card, the enemy has disadvantage on the save."
        }
      },
      {
        id: "card_master",
        name: "Sanguine Dealer",
        icon: "Cards/Deck of Cards",
        color: "#e74c3c",
        theme: "Card Manipulation",
        playstyle: "Maintain a massive hand of flayed cards, flooding the battlefield with constant d20 overrides.",
        description: "Masters of the deck. They carry the 'Stitched Hand', letting them store a massive reserve of cards to control every roll.",
        strengths: [
          "Maximum Sanguine Reserve capacity scales up to 7 cards",
          "Can spend debt to call two specific cards instead of one",
          "Highest frequency of d20 overrides"
        ],
        weaknesses: [
          "Generates Karmic Debt at an accelerated rate",
          "Highly dependent on draw luck",
          "Requires heavy mana upkeep to sustain large hand sizes"
        ],
        passiveAbility: {
          name: "Stitched Hand",
          description: "Your baseline Sanguine Reserve capacity is increased to 7 cards. When you use the 'Call Card' ability, you may search your deck for two specific cards instead of one, generating 3 debt instead of 2."
        }
      },
      {
        id: "thread_weaver",
        name: "Karmic Flayer",
        icon: "Necrotic/Tattered Threads",
        color: "#2c3e50",
        theme: "Thread Manipulation",
        playstyle: "Link targets together and redirect damage, using the threads of debt to bleed opponents.",
        description: "Masters of the threads. They bind enemies to their own debt, turning their vulnerability into a weapon.",
        strengths: [
          "Redirects up to 50% of incoming damage to linked targets",
          "Deals additional necrotic damage based on current debt level",
          "Strongest survivability against single-target focus"
        ],
        weaknesses: [
          "Requires constant maintenance of active bonds",
          "Zero area-of-effect defensive options",
          "If a bound ally dies, you immediately absorb their remaining debt"
        ],
        passiveAbility: {
          name: "Splintered Loom",
          description: "While you have 5 or more stacks of Karmic Debt, your spell attacks deal bonus necrotic damage equal to your current debt level. Additionally, you may link two creatures within 30 feet to share damage."
        }
      }
    ]
  },

  // Spells list
  spells: [
    // ========================================
    // LEVEL 1 SPELLS - The Core Probability Engine
    // ========================================
    {
      id: "hand-of-fate",
      name: "Dirges of Flesh",
      description: "Draw 5 flayed skins to form a poker hand. You may discard and redraw up to twice. Hand strength determines damage dealt, but the violent warping of probability inflicts escalating Karmic Debt. You may spend 2 debt to call a specific card from your deck (once per turn).",
      level: 1,
      spellType: "ACTION",
      icon: "Necrotic/Skull",
      typeConfig: {
        school: "necrotic",
        icon: "Necrotic/Skull",
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
        verbalText: "Flay the deck!",
        somaticText: "Scatter flayed ribbons of skin in a cascading arc"
      },
      resolution: "CARDS",
      effectTypes: ["damage"],
      damageConfig: {
        formula: "POKER_HAND_DAMAGE",
        damageTypes: ["necrotic"],
        resolution: "CARDS",
        cardConfig: {
          drawCount: 5,
          formula: "POKER_HAND_DAMAGE"
        }
      },
      specialMechanics: {
        pokerHandScaling: {
          description: "Pairs high-risk rewards with Karmic Debt escalation.",
          hands: [
            { name: "Royal Flush", damage: "12d10 necrotic", debtGain: 4, description: "Deals 12d10 necrotic damage + inflicts 4 debt. Immediate ultimate doom." },
            { name: "Straight Flush", damage: "10d10 necrotic", debtGain: 3, description: "Deals 10d10 necrotic damage + inflicts 3 debt." },
            { name: "Four of a Kind", damage: "8d10 necrotic", debtGain: 3, description: "Deals 8d10 necrotic damage + inflicts 3 debt." },
            { name: "Full House", damage: "6d10 necrotic", debtGain: 2, description: "Deals 6d10 necrotic damage + inflicts 2 debt." },
            { name: "Flush", damage: "4d10 necrotic", debtGain: 2, description: "Deals 4d10 necrotic damage + inflicts 2 debt." },
            { name: "Straight", damage: "3d10 necrotic", debtGain: 1, description: "Deals 3d10 necrotic damage + inflicts 1 debt." },
            { name: "Three of a Kind", damage: "2d10 necrotic", debtGain: 1, description: "Deals 2d10 necrotic damage + inflicts 1 debt." },
            { name: "Two Pair", damage: "2d8 psychic", debtGain: 1, description: "Deals 2d8 psychic damage + inflicts 1 debt." },
            { name: "One Pair", damage: "1d8 psychic", debtGain: 1, description: "Deals 1d8 psychic damage + inflicts 1 debt." },
            { name: "High Card", damage: "1d4 psychic", debtGain: 2, description: "Deals 1d4 psychic damage + inflicts 2 debt (the weak outcome shreds your own mind)." }
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
      tags: ["damage", "cards", "level 1", "fate weaver"]
    },

    {
      id: "war-of-wills",
      name: "Duel of Flayed Wills",
      description: "Draw 1 flayed card, and force your target to draw 1 as well. If your card's value is higher, you inflict psychic torment on their nervous system. If your card's value is lower, you absorb their psychic agony, taking damage and gaining 1 Karmic Debt.",
      level: 1,
      spellType: "ACTION",
      icon: "Psychic/Brain Shield",
      typeConfig: {
        school: "psychic",
        icon: "Psychic/Brain Shield",
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
        verbalText: "Flay your mind!"
      },
      resolution: "CARDS",
      effectTypes: ["damage"],
      damageConfig: {
        formula: "3d8 + intelligence/3",
        damageTypes: ["psychic"],
        resolution: "CARDS",
        cardConfig: {
          drawCount: 1,
          formula: "3d8 + intelligence/3"
        }
      },
      specialMechanics: {
        warOfWills: {
          description: "Compare one drawn card with target's drawn card. High card wins.",
          failureOutcome: "You take 1d8 psychic damage and gain 1 stack of Karmic Debt."
        }
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 1
      },
      tags: ["damage", "cards", "level 1", "fate weaver"]
    },

    {
      id: "echoes-of-the-past",
      name: "Dirge of Flayed Parchment",
      description: "Draw the memories of a deceased soul from your flayed deck. You gain temporary proficiency in one skill or tool of your choice for 10 minutes. Bending timeline constraints to learn these forbidden memories inflicts 1 Karmic Debt.",
      level: 1,
      spellType: "ACTION",
      icon: "Utility/Scroll",
      typeConfig: {
        school: "psychic",
        icon: "Utility/Scroll",
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
            id: "flayed_memories",
            name: "Flayed Memories",
            description: "Gain temporary proficiency in one selected skill or tool.",
            mechanicsText: ""
          }
        ],
        durationValue: 10,
        durationType: "minutes",
        durationUnit: "minutes"
      },
      specialMechanics: {
        threadsOfDestiny: {
          generation: "Acquiring forbidden knowledge inflicts 1 Karmic Debt"
        }
      },
      cooldownConfig: {
        cooldownType: "short_rest",
        cooldownValue: 1
      },
      tags: ["utility", "buff", "level 1", "fate weaver"]
    },

    {
      id: "marked-card",
      name: "Sanguine Reserve",
      description: "Slice your palm, painting flayed parchment with your blood. Peek at the top 3 cards of your deck. You may 'bank' one card into your Sanguine Reserve (max 4 capacity) and draw the other two. Each override reaction expends a card from this reserve. Bending the deck's anatomy generates 2 Karmic Debt.",
      level: 1,
      spellType: "ACTION",
      icon: "Cards/Card Draw",
      typeConfig: {
        school: "necrotic",
        icon: "Cards/Card Draw",
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
        somaticText: "Cut your thumb with card edge, leaving blood-ink"
      },
      resolution: "CARDS",
      effectTypes: ["utility"],
      utilityConfig: {
        utilityType: "card_draw",
        selectedEffects: [
          {
            id: "bank_card",
            name: "Sanguine Bank",
            description: "Bank 1 card into Sanguine Reserve. Max baseline capacity is 4 cards."
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
      tags: ["utility", "cards", "level 1", "fate weaver"]
    },

    {
      id: "fate_lucky_strike",
      name: "Scythe of Destiny",
      description: "Draw 1 flayed strip of bone-ink card. If it is a face card or an Ace, you strike with perfect timing, dealing 2d8 psychic damage and granting a critical threat range on your next offensive action. If it is a numbered card, it deals only 1d8 psychic and inflicts 1 Karmic Debt as the weak outcome bleeds your hands.",
      level: 1,
      spellType: "ACTION",
      icon: "Slashing/Scythe",
      typeConfig: {
        school: "psychic",
        icon: "Slashing/Scythe",
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
        somaticText: "Slash with a rigid, blood-stiffened flayed parchment"
      },
      resolution: "CARDS",
      effectTypes: ["damage"],
      damageConfig: {
        formula: "2d8 + intelligence/3 (Face) / 1d8 (Number)",
        damageTypes: ["psychic"],
        resolution: "CARDS",
        cardConfig: {
          drawCount: 1,
          formula: "2d8 + intelligence/3 / 1d8"
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
      tags: ["melee", "damage", "level 1", "fate weaver"]
    },

    {
      id: "fate_twist_probability",
      name: "Karmic Severance",
      description: "As a reaction to a creature within 30 feet rolling a saving throw, you snap your fingers and sever their threads. Expend a banked card from your Sanguine Reserve to override their result. Face cards force an absolute failure on the target's save; numbered cards force a standard roll with a -5 penalty. Inflicts 1 Karmic Debt.",
      level: 1,
      spellType: "REACTION",
      icon: "Utility/Hand Snapping",
      typeConfig: {
        school: "necrotic",
        icon: "Utility/Hand Snapping",
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
            id: "severed_destiny",
            name: "Severed Destiny",
            description: "Target's roll is overridden by your banked card value.",
            mechanicsText: ""
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
      tags: ["reaction", "debuff", "level 1", "fate weaver"]
    },

    {
      id: "tapestry-shred",
      name: "Tapestry Shred",
      description: "Mutilate the threads of time in response to an action. Consume an active card from your Sanguine Reserve to force an immediate d20 roll override on any creature within 60 feet. The target's active d20 roll is replaced by the banked card's hard-coded value: Aces count as 18, Kings as 17, Queens as 16, Jacks as 15, and numbered cards map to their exact face value. Inflicts 2 Karmic Debt as the timeline violently shifts.",
      level: 1,
      spellType: "REACTION",
      icon: "Arcane/Rewind Time",
      typeConfig: {
        school: "psychic",
        icon: "Arcane/Rewind Time",
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
            id: "tapestry_shred_override",
            name: "Tapestry Shred Override",
            description: "Force an immediate d20 roll override by expending a banked card from Sanguine Reserve. Aces = 18, Kings = 17, Queens = 16, Jacks = 15, Numbered = Face Value."
          }
        ]
      },
      specialMechanics: {
        threadsOfDestiny: {
          generation: "Generating this shift inflicts 2 Karmic Debt",
          usage: "Consumes 1 card from Sanguine Reserve"
        }
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 0
      },
      tags: ["reaction", "override", "level 1", "fate weaver"]
    },

    // ========================================
    // LEVEL 2 SPELLS
    // ========================================
    {
      id: "hearts-gamble",
      name: "Exsanguination Wager",
      description: "Sacrifice a portion of your own life force to heal an ally, but draw 1 card. If the card is red (Hearts/Diamonds), your sacrifice succeeds, healing them for 3d8 + your Spirit score. If it is black (Spades/Clubs), the cosmic loom rejects it: you take 2d8 psychic damage, the healing is halved, and you gain 1 Karmic Debt.",
      level: 2,
      spellType: "ACTION",
      icon: "Healing/Blood Transfer",
      typeConfig: {
        school: "necrotic",
        icon: "Healing/Blood Transfer",
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
        resourceTypes: ["mana"],
        resourceValues: { mana: 8 },
        healthCost: "2d6 slashing"
      },
      resolution: "CARDS",
      effectTypes: ["healing"],
      healingConfig: {
        formula: "3d8 + spirit (Red) / 1d8 + spirit/2 (Black)",
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
      tags: ["healing", "cards", "level 2", "fate weaver"]
    },

    {
      id: "fate_fortune_favor",
      name: "Flayed Favor",
      description: "Draw 1 flayed card to grant an ally a protective ward. The suit of the drawn card dictates the blessing: Hearts grants 2d8 temporary HP, Diamonds grants +3 to all saving throws, Spades grants +15 ft movement speed, and Clubs grants +2 to physical attack rolls. Duration is 3 rounds. Inflicts 1 Karmic Debt.",
      level: 2,
      spellType: "ACTION",
      icon: "Radiant/Divine Shield",
      typeConfig: {
        school: "psychic",
        icon: "Radiant/Divine Shield",
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
            id: "flayed_favor_buff",
            name: "Flayed Favor Blessing",
            description: "Hearts: Temp HP. Diamonds: Save bonus. Spades: Speed. Clubs: Attack bonus.",
            mechanicsText: ""
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
      tags: ["buff", "cards", "level 2", "fate weaver"]
    },

    // ========================================
    // LEVEL 3 SPELLS
    // ========================================
    {
      id: "draw-of-the-damned",
      name: "Sanguine Blackjack",
      description: "Force an enemy into an agonizing game. Draw cards trying to get as close to 21 as possible. Each drawn card deals 1d10 necrotic damage to the target. You may 'hit' up to 4 times. If your total exceeds 21, you bust: the target takes no further damage, you take 4d10 necrotic damage yourself, and you gain 3 Karmic Debt.",
      level: 3,
      spellType: "ACTION",
      icon: "Necrotic/Claw Strike",
      typeConfig: {
        school: "necrotic",
        icon: "Necrotic/Claw Strike",
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
        somaticText: "Weave card outlines into the air, enclosing the target"
      },
      resolution: "CARDS",
      effectTypes: ["damage"],
      damageConfig: {
        formula: "1d10 per card drawn (max 4)",
        damageTypes: ["necrotic"],
        resolution: "CARDS",
        cardConfig: {
          drawCount: 4,
          formula: "1d10 per card drawn"
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
      tags: ["damage", "cards", "level 3", "fate weaver"]
    },

    {
      id: "echo-of-fate",
      name: "Sympathetic Hemorrhage",
      description: "Sever two timelines and stitch them together. Choose two creatures within 30 feet of each other. For the next 3 rounds, whenever the primary target takes damage, the bound target takes 50% of that damage as untreatable necrotic damage. Generating this link generates 2 Karmic Debt.",
      level: 3,
      spellType: "ACTION",
      icon: "General/Chain Link",
      typeConfig: {
        school: "necrotic",
        icon: "General/Chain Link",
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
            id: "sympathetic_stitch",
            name: "Sympathetic Stitch",
            description: "Takes 50% of the damage dealt to the linked primary target.",
            mechanicsText: ""
          }
        ],
        durationValue: 3,
        durationType: "rounds",
        durationUnit: "rounds"
      },
      specialMechanics: {
        threadsOfDestiny: {
          generation: "Stitching two fates together generates 2 Karmic Debt."
        }
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 4
      },
      tags: ["debuff", "utility", "level 3", "fate weaver"]
    },

    // ========================================
    // LEVEL 4 SPELLS
    // ========================================
    {
      id: "solitaires-shield",
      name: "Solitary Flaying",
      description: "Draw 4 cards and lay them in a defensive matrix around yourself. You gain temporary shield points equal to the total face value of the drawn cards (Kings/Queens/Jacks count as 10, Aces as 15, numbered as face value). If any card drawn is a Club, your Armor is increased by 2 for the duration. Lasts 3 rounds. Generates 1 Karmic Debt.",
      level: 4,
      spellType: "ACTION",
      icon: "Utility/Shielding Aura",
      typeConfig: {
        school: "psychic",
        icon: "Utility/Shielding Aura",
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
            id: "solitaire_ward",
            name: "Solitaire Bone Ward",
            description: "Gains shield points equal to card total. Club drawn increases Armor by 2.",
            mechanicsText: ""
          }
        ],
        durationValue: 3,
        durationType: "rounds",
        durationUnit: "rounds"
      },
      specialMechanics: {
        threadsOfDestiny: {
          generation: "Stitching a shield of absolute numbers generates 1 Karmic Debt."
        }
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 3
      },
      tags: ["buff", "defense", "level 4", "fate weaver"]
    },

    {
      id: "fates-exchange",
      name: "Karmic Displacement",
      description: "Target two creatures within 60 feet. They must make a Spirit saving throw against your spell DC. On a failure, their physical positions are instantly swapped in space as you violently rip and cross their threads. Succeeding targets are unaffected. This reality warping generates 2 Karmic Debt.",
      level: 4,
      spellType: "ACTION",
      icon: "Utility/Teleport Portal",
      typeConfig: {
        school: "force",
        icon: "Utility/Teleport Portal",
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
            id: "displacement_swap",
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
      tags: ["utility", "mobility", "level 4", "fate weaver"]
    },

    {
      id: "destiny-bond",
      name: "Sanguine Binding",
      description: "Shoot a line of coagulated blood thread from your palm to bind an enemy within 30 feet. For the next 3 rounds, 50% of all damage you receive is redirected to the bound enemy as necrotic damage. If you take damage, they must make a Spirit save or be pulled 10 feet closer to you. Stitching this bond generates 2 Karmic Debt.",
      level: 4,
      spellType: "ACTION",
      icon: "Necrotic/Blood Link",
      typeConfig: {
        school: "necrotic",
        icon: "Necrotic/Blood Link",
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
        somaticText: "Pinch your palm to spray a congealed line of crimson string"
      },
      resolution: "DICE",
      effectTypes: ["debuff"],
      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          {
            id: "sanguine_binding_bond",
            name: "Sanguine Binding Bond",
            description: "Absorbs 50% of the Fate Weaver's damage. Spirit save or pulled 10ft on damage.",
            mechanicsText: ""
          }
        ],
        durationValue: 3,
        durationType: "rounds",
        durationUnit: "rounds"
      },
      specialMechanics: {
        threadsOfDestiny: {
          generation: "Stitching an active blood bond generates 2 Karmic Debt."
        }
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 4
      },
      tags: ["debuff", "defense", "level 4", "fate weaver"]
    },

    // ========================================
    // LEVEL 5 SPELLS
    // ========================================
    {
      id: "fate_weaver_stacked_deck",
      name: "Stacked Flayed Deck",
      description: "Focus your mind and rearrange the top 5 cards of your deck in any order you choose. This absolute manipulation allows you to predict your next outcomes perfectly. You may also exchange 1 card from your Sanguine Reserve with a card from these 5. Manipulating the future order generates 2 Karmic Debt.",
      level: 5,
      spellType: "ACTION",
      icon: "Cards/Deck Arrangement",
      typeConfig: {
        school: "psychic",
        icon: "Cards/Deck Arrangement",
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
            id: "stacked_deck_effect",
            name: "Stacked Deck",
            description: "Rearrange the top 5 cards of your deck. Swap 1 card with Sanguine Reserve."
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
      tags: ["utility", "cards", "level 5", "fate weaver"]
    },

    {
      id: "fate_weaver_twist_fate",
      name: "Twisted Strands",
      description: "As a reaction to a creature within 60 feet succeeding on an attack roll or saving throw, you violently twist their thread. Force them to reroll their action and take the worse result. This direct twisting generates 2 Karmic Debt as their success is physically torn from them.",
      level: 5,
      spellType: "REACTION",
      icon: "Utility/Hand Twist",
      typeConfig: {
        school: "psychic",
        icon: "Utility/Hand Twist",
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
            id: "twisted_strand_disadvantage",
            name: "Twisted Strand Disadvantage",
            description: "Target must reroll their action and take the worse result.",
            mechanicsText: ""
          }
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
      tags: ["reaction", "debuff", "level 5", "fate weaver"]
    },

    // ========================================
    // LEVEL 6 SPELLS
    // ========================================
    {
      id: "fate_weaver_dealers_choice",
      name: "Cartomancer's Harvest",
      description: "Choose 1 card from your Sanguine Reserve and consume it to unleash an effect. Hearts: heal yourself or an ally for 6d8 + Spirit. Diamonds: grant an ally +4 to all saving throws and 30 temporary HP for 3 rounds. Spades: deal 5d10 psychic damage to an enemy. Clubs: force an enemy to discard their next action. Generates 2 Karmic Debt.",
      level: 6,
      spellType: "ACTION",
      icon: "Cards/Dealers Choice",
      typeConfig: {
        school: "necrotic",
        icon: "Cards/Dealers Choice",
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
        formula: "5d10 + intelligence (Spades)",
        damageTypes: ["psychic"],
        resolution: "CARDS"
      },
      healingConfig: {
        formula: "6d8 + spirit (Hearts)",
        healingType: "direct",
        resolution: "CARDS"
      },
      specialMechanics: {
        threadsOfDestiny: {
          generation: "Consuming a banked card to harvest fate generates 2 Karmic Debt.",
          usage: "Consumes 1 card from Sanguine Reserve"
        }
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 3
      },
      tags: ["damage", "healing", "buff", "level 6", "fate weaver"]
    },

    {
      id: "fate_weaver_twenty_one_curses",
      name: "Hemorrhaging Blackjack",
      description: "An advanced, multi-target variant of Blackjack. Choose up to 3 enemies within a 30-foot radius. Deal cards to each of them. Each card dealt inflicts 2d6 necrotic damage. You may hit up to 3 times per enemy. If any enemy hits exactly 21, they take an additional 6d6 necrotic damage and begin bleeding. If you bust on an enemy, you take 3d6 necrotic damage and gain 2 debt. Generates 2 Karmic Debt baseline.",
      level: 6,
      spellType: "ACTION",
      icon: "Necrotic/Blood Burst",
      typeConfig: {
        school: "necrotic",
        icon: "Necrotic/Blood Burst",
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
        formula: "2d6 per card drawn",
        damageTypes: ["necrotic"],
        resolution: "CARDS",
        cardConfig: {
          drawCount: 9,
          formula: "2d6 per card drawn"
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
      tags: ["damage", "aoe", "level 6", "fate weaver"]
    },

    {
      id: "fate_weaver_fold_reality",
      name: "Folding of Flesh",
      description: "As a reaction to taking physical damage, you violently fold reality, vanishing from your position and leaving behind a decoy of flayed skin. You teleport up to 30 feet to an unoccupied space. The decoy explodes, dealing 3d8 necrotic damage to all adjacent creatures. Generating this escape generates 2 Karmic Debt.",
      level: 6,
      spellType: "REACTION",
      icon: "Utility/Flash Teleport",
      typeConfig: {
        school: "necrotic",
        icon: "Utility/Flash Teleport",
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
        damageTypes: ["necrotic"],
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
      tags: ["reaction", "mobility", "damage", "level 6", "fate weaver"]
    },

    // ========================================
    // LEVEL 7 SPELLS
    // ========================================
    {
      id: "fate_weaver_house_rules",
      name: "Sovereign Decrees",
      description: "You stand as the House, dictating the physical laws of the battlefield. For 1 round, all d20 rolls made by allies within 30 feet of you automatically succeed if your banked card is higher than a 10. All d20 rolls made by enemies within 30 feet automatically fail if your banked card is lower than a 10. Imposing your absolute decrees generates 3 Karmic Debt.",
      level: 7,
      spellType: "ACTION",
      icon: "Radiant/Divine Law",
      typeConfig: {
        school: "psychic",
        icon: "Radiant/Divine Law",
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
            id: "house_rules_ally_buff",
            name: "Sovereign Decree (Ally)",
            description: "d20 rolls automatically succeed if banked card is > 10.",
            mechanicsText: ""
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
            id: "house_rules_enemy_debuff",
            name: "Sovereign Decree (Enemy)",
            description: "d20 rolls automatically fail if banked card is < 10.",
            mechanicsText: ""
          }
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
      tags: ["buff", "debuff", "utility", "level 7", "fate weaver"]
    },

    {
      id: "fate_weaver_all_in",
      name: "Sanguine All-In",
      description: "Expend all currently banked cards in your Sanguine Reserve (minimum 2 cards) and unleash them in a single, devastating beam of flayed crimson light. Deals 3d10 necrotic damage per expended card to a single target. If you expend 4 or more cards, the target must make a Spirit saving throw or be incapacitated for 1 round. Generates 3 Karmic Debt.",
      level: 7,
      spellType: "ACTION",
      icon: "Necrotic/Blood Beam",
      typeConfig: {
        school: "necrotic",
        icon: "Necrotic/Blood Beam",
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
        verbalText: "Omnia wideo!",
        somaticText: "Throw your entire hand of cards forward, they dissolve into a white-hot stream"
      },
      resolution: "CARDS",
      effectTypes: ["damage"],
      damageConfig: {
        formula: "3d10 per card expended",
        damageTypes: ["necrotic"],
        resolution: "CARDS",
        cardConfig: {
          drawCount: 1,
          formula: "3d10 per card expended"
        }
      },
      specialMechanics: {
        threadsOfDestiny: {
          generation: "Expelling your entire reserve in a single burst generates 3 Karmic Debt.",
          usage: "Consumes ALL cards from Sanguine Reserve"
        }
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 4
      },
      tags: ["damage", "cards", "level 7", "fate weaver"]
    },

    {
      id: "fate_weaver_destiny_rewritten",
      name: "Destiny Mutilated",
      description: "Stitch an active status effect on a creature. Choose one active buff or debuff on any target within 60 feet. Draw 1 card. If the card is a face card or Ace, you double the remaining duration of that effect. If it is a numbered card, you immediately end the effect. Rewriting a status duration generates 2 Karmic Debt.",
      level: 7,
      spellType: "ACTION",
      icon: "Utility/Hourglass",
      typeConfig: {
        school: "psychic",
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
            id: "duration_rewrite",
            name: "Duration Rewrite",
            description: "Face/Ace: Double duration. Numbered: End the effect immediately."
          }
        ]
      },
      specialMechanics: {
        threadsOfDestiny: {
          generation: "Directly mutilating active effect durations generates 2 Karmic Debt."
        }
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 3
      },
      tags: ["utility", "cards", "level 7", "fate weaver"]
    },

    // ========================================
    // LEVEL 8 SPELLS
    // ========================================
    {
      id: "fate_weaver_the_jokers_hand",
      name: "The Flayed Jester",
      description: "Draw 3 cards from a deck containing two legendary Jokers. The Jokers represent pure, unmitigated chaos: if you draw a Red Joker, you heal all allies for 8d8 + Spirit and clear all active debuffs on them. If you draw a Black Joker, you take 5d10 psychic damage, and all enemies within 30 feet are struck for 8d10 necrotic damage. Standard cards deal 2d8 psychic damage. Generates 3 Karmic Debt.",
      level: 8,
      spellType: "ACTION",
      icon: "Cards/Joker",
      typeConfig: {
        school: "chaos",
        icon: "Cards/Joker",
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
        formula: "8d10 (Black Joker) / 2d8 (Standard)",
        damageTypes: ["necrotic"],
        resolution: "CARDS"
      },
      healingConfig: {
        formula: "8d8 + spirit (Red Joker)",
        healingType: "direct",
        resolution: "CARDS"
      },
      specialMechanics: {
        threadsOfDestiny: {
          generation: "Unleashing the chaotic nature of the Jester generates 3 Karmic Debt."
        }
      },
      cooldownConfig: {
        cooldownType: "long_rest",
        cooldownValue: 1
      },
      tags: ["damage", "healing", "cards", "level 8", "fate weaver"]
    },

    {
      id: "fate_weaver_fate_sealed",
      name: "Death Sentence Sealed",
      description: "Seal the target's physical anchor. Choose an enemy within 60 feet. They must make a Spirit saving throw against your spell DC. On a failure, they are marked for immediate execution: for the next 3 rounds, any attack roll made against them is a guaranteed critical hit. The strain of sealing this absolute doom generates 4 Karmic Debt.",
      level: 8,
      spellType: "ACTION",
      icon: "General/Gallows",
      typeConfig: {
        school: "necrotic",
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
            id: "death_sentence_seal",
            name: "Death Sentence Seal",
            description: "All attacks against target are guaranteed critical hits.",
            mechanicsText: ""
          }
        ],
        durationValue: 3,
        durationType: "rounds",
        durationUnit: "rounds"
      },
      specialMechanics: {
        threadsOfDestiny: {
          generation: "Sealing a mortal's physical death thread generates 4 Karmic Debt."
        }
      },
      cooldownConfig: {
        cooldownType: "long_rest",
        cooldownValue: 1
      },
      tags: ["debuff", "utility", "level 8", "fate weaver"]
    },

    {
      id: "fate_weaver_fates_wager",
      name: "Karmic Wager",
      description: "Wager your own flesh for amplification. Draw 1 card. If it is a face card or Ace, your next spell within 1 round deals triple damage and costs 0 AP. If it is a numbered card, your next spell deals double damage, but you take the exact same damage yourself. Drawing this wager generates 2 Karmic Debt.",
      level: 8,
      spellType: "ACTION",
      icon: "Cards/Card Wager",
      typeConfig: {
        school: "necrotic",
        icon: "Cards/Card Wager",
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
        verbalText: "Wager in blood!"
      },
      resolution: "CARDS",
      effectTypes: ["buff"],
      buffConfig: {
        buffType: "amplify",
        effects: [
          {
            id: "fates_wager_buff",
            name: "Sanguine Wager",
            description: "Face/Ace: next spell 3x. Numbered: 2x but hits you as well.",
            mechanicsText: ""
          }
        ],
        durationValue: 1,
        durationType: "rounds",
        durationUnit: "rounds"
      },
      specialMechanics: {
        threadsOfDestiny: {
          generation: "Taking a direct gamble on your physical shell generates 2 Karmic Debt."
        }
      },
      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 4
      },
      tags: ["buff", "cards", "level 8", "fate weaver"]
    },

    // ========================================
    // LEVEL 9 SPELLS
    // ========================================
    {
      id: "fate_weaver_grand_gambit",
      name: "Grand Carnage",
      description: "Initiate a competitive card draw with every enemy within 40 feet. Draw 1 card for each enemy, and 1 for yourself. If your card is higher than the enemy's, they are instantly reduced to 1 HP. If your card is lower, they are fully healed and gain +2 Armor for 1 minute. Ties inflict no effect but generate 1 debt. Generates 3 baseline debt.",
      level: 9,
      spellType: "ACTION",
      icon: "Utility/Utility",
      typeConfig: {
        school: "necrotic",
        icon: "Utility/Utility",
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
        verbalText: "Ruin and flesh!",
        somaticText: "Stitch the veins of all nearby enemies to your cards"
      },
      resolution: "CARDS",
      effectTypes: ["damage", "healing"],
      damageConfig: {
        formula: "Reduce to 1 HP (War Win)",
        damageTypes: ["necrotic"],
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
      tags: ["damage", "healing", "cards", "level 9", "fate weaver"]
    },

    {
      id: "fate_weaver_master_of_destiny",
      name: "Sovereign of Bleeding Threads",
      description: "Draw 13 cards into your Sanguine Reserve as an absolute Throne. For 1 minute, you may spend 1 Karmic Debt to override any creature's die roll with a card from this Throne: Face cards convert to 20, Aces to 1 or 20, and numbered cards to their exact face value. Generates 3 Karmic Debt baseline.",
      level: 9,
      spellType: "ACTION",
      icon: "Radiant/Divine Illumination",
      typeConfig: {
        school: "psychic",
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
            id: "master_of_destiny_buff",
            name: "Sovereign Override",
            description: "Spend 1 debt to replace any die roll with a Throne card value.",
            mechanicsText: ""
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
      tags: ["buff", "cards", "utility", "level 9", "fate weaver"]
    },

    {
      id: "fate_weaver_jackpot_supreme",
      name: "Karmic Rupture",
      description: "Draw 3 flayed cards and shatter them. Ranks dictate necrotic damage in a 30-foot circle: One Pair multiplies a 10d10 base damage by 3. Three of a kind multiplies damage by 7 and targets suffer 'Hemorrhaging Destiny' (incapacitated and take 4d10 necrotic damage at start of turn for 1 round). No matches deal 10d10 base and inflict 3 debt.",
      level: 9,
      spellType: "ACTION",
      icon: "Radiant/Radiant Glow",
      typeConfig: {
        school: "necrotic",
        icon: "Radiant/Radiant Glow",
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
        somaticText: "Violently shatter three flayed cards"
      },
      resolution: "CARDS",
      effectTypes: ["damage"],
      damageConfig: {
        formula: "10d10 x Multiplier (Pair: x3, Triple: x7)",
        damageTypes: ["necrotic"],
        resolution: "CARDS",
        cardConfig: {
          drawCount: 3,
          formula: "10d10 x Multiplier"
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
          twoMatch: { multiplier: 3, description: "10d10 × 3 necrotic damage" },
          threeMatch: { multiplier: 7, description: "10d10 × 7 damage + Hemorphaging Destiny incapacitation for 1 round" }
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
      tags: ["damage", "aoe", "cards", "level 9", "fate weaver"]
    },

    // ========================================
    // LEVEL 10 SPELLS
    // ========================================
    {
      id: "fate_weaver_rewrite_destiny",
      name: "Epitaph of the Flayed",
      description: "Draw 13 flayed skins and rearrange them to violently rewrite reality. All Face: target ally is immune to all damage and automatically succeeds on all rolls for 1 minute. Same Suit: target enemy is reduced to 1 HP and suffers Soul Flaying (incapacitated and takes 5d10 necrotic damage each turn for 1 minute). Failure to form a pattern inflicts 5 Karmic Debt.",
      level: 10,
      spellType: "ACTION",
      icon: "Arcane/Rewind Time",
      typeConfig: {
        school: "necrotic",
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
        somaticText: "Weave 13 cards into target's skin"
      },
      resolution: "CARDS",
      effectTypes: ["utility"],
      utilityConfig: {
        utilityType: "fate_manipulation",
        selectedEffects: [
          {
            id: "rewrite_destiny_effect",
            name: "Reality Epitaph",
            description: "All face: ally immune 1 min. Same suit: enemy 1 HP + Soul Flaying. Sequential: permanent polymorph."
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
              effect: "Enemy 1 HP + Soul Flaying (incapacitated + bleed) for 1 minute",
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
      tags: ["utility", "cards", "level 10", "fate weaver"]
    },

    {
      id: "fate_weaver_deck_of_many_things",
      name: "Grim Deck of Horrors",
      description: "Summon a legendary flayed deck of horrors and draw 1-3 cards. Each card yields either a miraculous blessing or a catastrophic curse. Catastrophic cards immediately generate 3 Karmic Debt. You may spend 5 debt to redraw a curse.",
      level: 10,
      spellType: "ACTION",
      icon: "Utility/Utility",
      typeConfig: {
        school: "necrotic",
        icon: "Utility/Utility",
        tags: ["utility", "cards"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "self",
        rangeType: "self"
      },
      durationConfig: {
        durationType: "instant",
        durationValue: 0,
        durationUnit: "instant"
      },
      resourceCost: {
        actionPoints: 2,
        resourceTypes: ["mana"],
        resourceValues: { mana: 80 },
        components: ["somatic"],
        somaticText: "Draw shards of flayed bone"
      },
      resolution: "CARDS",
      effectTypes: ["utility"],
      utilityConfig: {
        utilityType: "fate_manipulation",
        selectedEffects: [
          {
            id: "deck_of_many_things_harvest",
            name: "Grim Deck",
            description: "Draw 1-3 cards from legendary flayed deck. Major positive or catastrophic negative."
          }
        ],
        duration: 0,
        durationUnit: "instant"
      },
      rollableTable: {
        enabled: true,
        name: "Grim Deck of Horrors — Results",
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
      tags: ["utility", "cards", "level 10", "fate weaver"]
    },

    {
      id: "fate_weaver_casino_royale",
      name: "The Sanguine Theater",
      description: "Transform the battlefield into a flayed theater of agony in a 100-foot radius. Draw a card for every creature within: their suit determines their forced game: Hearts (Exsanguination Wager), Spades (Duel of Wills), Diamonds (Blackjack), Clubs (Solitaire). You are the House, generating 2 Karmic Debt at the start of each of your turns.",
      level: 10,
      spellType: "ACTION",
      icon: "Radiant/Divine Radiance",
      typeConfig: {
        school: "necrotic",
        icon: "Radiant/Divine Radiance",
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
        verbalText: "Welcome to the theater of bone!",
        somaticText: "Sweep hands to spray blood-ink in a 100 ft circle"
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
            id: "casino_zone_effect",
            name: "Sanguine Theater Domain",
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
            id: "forced_game_effect",
            controlType: "zone",
            name: "Flayed Plays",
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
      tags: ["zone", "control", "cards", "level 10", "fate weaver"]
    },

    // ===== PASSIVE ABILITIES =====
    {
      id: "fate_weaver_deck_exhaustion",
      name: "Sanguine Exhaustion",
      description: "When your deck of flayed parchment runs dry and must be reshuffled in blood, you take 2d6 psychic damage and are unable to call cards or manipulate rolls for that turn.",
      level: 1,
      spellType: "PASSIVE",
      icon: "Arcane/Magical Cross Emblem 2",
      effectTypes: ["passive"],
      typeConfig: {
        school: "necrotic",
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

    {
      id: "fate_weaver_fates_wrath",
      name: "Karmic Hemorrhage",
      description: "Every time you override a natural roll, force a destiny, or use the 'Call Card' ability, you accumulate 1 stack of Karmic Debt (max 13). Each stack of debt imposes +5% vulnerability to all damage types and deals 1d4 necrotic damage at the end of each round (untreatable by normal magic). Reaching 13 debt triggers immediate Tapestry Collapse, dealing 6d10 psychic damage and incapacitating you for 1 round.",
      level: 1,
      spellType: "PASSIVE",
      icon: "Force/Explosion Burst",
      effectTypes: ["passive"],
      typeConfig: {
        school: "necrotic",
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
            id: "karmic_debt_vulnerability",
            name: "Karmic Debt Vulnerability",
            description: "Suffer compounding +5% vulnerability and 1d4 bleeding per stack of debt.",
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

    {
      id: "fate_weaver_empty_hand",
      name: "Fleshless Void",
      description: "When your Sanguine Reserve is empty and you have 0 Karmic Debt, your physical anchor is dangerously unmoored. You have disadvantage on all saving throws and Dodge/Armor checks until you draw a card or gain 1 debt.",
      level: 3,
      spellType: "PASSIVE",
      icon: "General/Broken Armor",
      effectTypes: ["passive"],
      typeConfig: {
        school: "psychic",
        icon: "General/Broken Armor",
        tags: ["passive", "weakness"],
        castTime: 0,
        castTimeType: "PASSIVE"
      },
      targetingConfig: { targetingType: "self", rangeType: "self" },
      resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 0 },
      resolution: "AUTOMATIC",
      tags: ["passive", "weakness"]
    }
  ]
};
