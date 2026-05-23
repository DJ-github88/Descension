/**
 * Fate Weaver Class Data
 *
 * Cartomancer Sovereign — architects of probability who command the Loom of Fate.
 * Overhauled per audit standards: high-exertion arcane probability aesthetics,
 * Fate Reserve expanded capacity (4 cards, scaling to 7 for Arcane Dealer),
 * normalized poker-hand scaling on Arcane Dirge, and the Level 1 reaction
 * override spell 'Tapestry Shred'. Strictly VTT compliant, zero grimdark tropes.
 */

export const FATE_WEAVER_DATA = {
  id : "fate-weaver",
  name: "Fate Weaver",
  icon: "fas fa-skull",
  role: "Cartomancer Sovereign",
  damageTypes: ["psychic", "necrotic"],

  spellPools: {
    1: ["hand-of-fate", "war-of-wills", "echoes-of-the-past", "marked-card", "fate_lucky_strike", "fate_twist_probability", "tapestry-shred",
      "fate-reading_loom"],
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
    title: "Cartomancer Sovereign",
    subtitle: "The Loom's Architect",
    utility: "Absolute, un-debatable d20 outcome overrides. They possess the exclusive, hard-coded domain capacity to replace active dice results at the table with pre-drawn card values, completely bypassing standard RNG checks for critical successes or saving throws.",
    fatalFlaw: "Karmic Debt and Arcane Strain. Every single time they force reality to bend to their hand, the Loom demands equilibrium. They accumulate a crushing debt gauge that rapidly inflates their vulnerability to all damage types, inflicts persistent arcane strain, and triggers an instantaneous collapse if pushed past its limit (13 points). They possess zero defensive multi-target tools and are highly vulnerable to crushing, close-range martial attacks."
  },

  overview: {
    title: "The Fate Weaver",
    subtitle: "Cartomancer Sovereign",

    quickOverview: {
      title: "Quick Overview",
      content: `**What You Need to Know**: You do not study magic; you perform precision surgery on the fabric of probability itself. Your spells are calculated wagers, and your power is paid in temporal strain. You bank pre-drawn cards into your **Fate Reserve** and spend them to force absolute, un-debatable d20 outcome overrides anywhere on the field, completely bypassing RNG.

**Core Mechanic**: Draw cards → Bank them in Fate Reserve (0-4 cards) → Force overrides on d20 rolls (Face/Ace = 14-18, Numbered = Face Value) → Accumulate **Karmic Debt** (0-13) for overriding destiny → Suffer cascading debuffs (+5% vulnerability to all damage and 1d4 arcane strain per stack) → Reaching 13 debt triggers immediate **Tapestry Collapse** (6d10 psychic damage and 1-round incapacitation).

**Resource**: Fate Reserve (baseline capacity: 4 banked cards) & Karmic Debt (0-13 gauge).

**Playstyle**: Extreme, high-stakes cartomancy with absolute control over success and failure, balanced by crushing physical frailty and escalating arcane strain.

**Best For**: Tacticians who crave absolute control over the table's dice rolls, enjoy calculating complex card-counting wagers, and embrace a high-risk, high-reward probability-manipulation aesthetic.`
    },

    description: `The Fate Weaver is an arcane architect of probability. They view destiny not as an abstract concept, but as a vast, shimmering Loom of interwoven threads — and they are the surgeons who reroute them. Wielding decks of rune-etched parchment that pulse with latent probability energy, they pluck threads of possibility from the Loom and force absolute outcomes. They do not roll for miracles; they command them. But the cosmos is a jealous accountant. For every thread of probability they sever, the Loom demands equilibrium, accumulating Karmic Debt that taxes their physical anchor with escalating arcane strain.`,

    roleplayIdentity: {
      title: "Roleplay Identity",
      content: `In the dark folklore of Mythrill, Fate Weavers are feared outcasts known as "Cartomancer Sovereigns." They are individuals who stared into the Loom of Fate and tore away the threads that bound their destinies. Their tools are cards crafted from rune-etched parchment, each one a captured sliver of compressed probability.

Their power manifests as visible arcane strain. Every card drawn sends pulses of temporal energy through their nervous system; every point of Karmic Debt they accumulate causes their arcane resonance to spike uncontrollably, creating visible distortion halos around their hands. They speak in hushed, rhythmic incantations — their magic feeling less like divine authority and more like intense, taxing concentration pushed to the brink.

Fate Weaver archetypes include:
- **The Desperate Scholar**: Attempted to rewrite a dying loved one's fate thread, only to bind themselves to the probability deck forever.
- **The Accursed Gambler**: Wagered their destiny against an ancient entity of chance, winning the deck but losing their temporal anchor.
- **The Heretical Chronicler**: Believes that all mortal history is a poorly written narrative and seeks to meticulously edit it card by card.`
    },

    combatRole: {
      title: "Combat Role",
      content: `The Fate Weaver represents the ultimate target-priority and fate-control utility in Mythrill. They offer:

**Absolute Dice Control**: The only class capable of bypassing the d20 roll entirely. By spending cards from their Fate Reserve, they can guarantee critical hits for allies or force critical failures on boss saving throws.
**High-Risk Necrotic Offense**: Their poker-based spells deal devastating necrotic damage, but scaling these spells escalates their own Karmic Debt.
**Escalating Vulnerability**: They have zero defensive multi-target tools and suffer massive vulnerability to martial strikes. A Fate Weaver who manages their debt poorly will collapse from their own success.

**Why Bring Me?**: You decide the outcome of any single action on the field. Your fatal flaw is that your very presence invites a swift collapse if your Karmic Debt spirals.`
    },

    playstyle: {
      title: "Playstyle & Strategy",
      content: `Playing a Fate Weaver is a relentless probability puzzle of risk and reward. You must constantly balance your banked cards against your rising debt.

**Fate Reserve Management**:
- Keep your reserve stocked (baseline capacity: 4 cards). An empty hand leaves you unmoored and highly vulnerable.
- Use the **Arcane Dealer** specialization to scale your reserve capacity up to 7 cards, giving you a massive bank of overrides.

**The Karmic Debt Balance**:
- **0-4 Debt (Safe)**: Manageable, minor vulnerability.
- **5-9 Debt (Danger)**: Compounding +5% vulnerability per stack makes physical strikes lethal. You take 1d4 arcane strain per stack at the end of each round.
- **10-12 Debt (Razor's Edge)**: Maximum offensive bonuses, but a single hit will obliterate you.
- **13 Debt (Tapestry Collapse)**: Immediate catastrophe. Your temporal anchor fails, dealing 6d10 psychic damage and incapacitating you.

**The Override Timing**:
- Do not waste your banked cards on minor rolls. Save your high face cards for crucial saving throws or high-impact spell attacks.
- Use **Tapestry Shred** as a reaction to turn an enemy's critical success into a failure, or to force an ally's desperate strike to land.`
    },

    immersiveCombatExample: {
      title: "Combat Example: Unraveling the Loom",
      content: `**The Setup**: You are a Fate Weaver facing a colossal, armored Death Knight. Your tank is battered, and your mage is preparing a final, massive spell. Your Fate Reserve has 3 cards banked: a King (17), a Queen (16), and a 3. Your current Karmic Debt is 4.

**Turn 1 - Forcing the Opening**
*The Death Knight swings its massive runeblade at your tank. It's a devastating blow — a rolled 19.*
*You step forward, your rune-etched cards humming with probability energy. You sever the thread.*
**Your Reaction**: Cast "Tapestry Shred" (10 mana, consumes King from Fate Reserve, inflicts +2 debt).
**The Result**: You override the Death Knight's roll. The rolled 19 is replaced — you apply the 3 from your reserve instead, forcing an absolute failure!
**Karmic Debt**: 4 → 6.
**Drawback**: Your hands tremble with temporal dissonance. You now take 6d4 arcane strain damage at the end of the round, and suffer +30% vulnerability to all damage types.

**Turn 2 - The Calculated Wager**
*The Death Knight is off-balance. Your mage launches their spell. The Knight must make an Agility saving throw.*
**Your Action**: Cast "Arcane Dirge" (5 mana, AP: 1).
*You draw 5 cards to form a poker hand. You get: Jack, Jack, Queen, 4, 2 (One Pair).*
*You discard the 4 and 2, redrawing to get: Jack, Jack, Jack, 9, 5 (Three of a Kind).*
**The Result**: Deals 2d10 necrotic damage and inflicts +1 debt.
**Karmic Debt**: 6 → 7.
*Your concentration strains to its limit. You are extremely vulnerable, but you have paved the way for victory.*`
    }
  },

  resourceSystem: {
    title: "Fate Reserve & Karmic Debt",
    subtitle: "Probability Arsenal & Cosmic Balance",
    description: `Your magic is a precise manipulation of probability. You hold a deck of rune-etched cards, drawing them and banking them in your **Fate Reserve** (baseline maximum: 4 cards). These banked cards represent hard-coded destiny. When a creature rolls a d20, you can sever the thread of time, replacing their roll with the value of your card. But the Loom demands equilibrium: each override generates **Karmic Debt**. At 13 points of debt, your temporal anchor collapses.`,

    cards: [
      {
        title: "Fate Reserve (0-4)",
        stats: "4 Cards Max (Baseline)",
        details: "Holds pre-drawn cards. Expended to override d20 rolls. Face cards map to 15-17, Aces map to 18, numbered cards map to their exact value."
      },
      {
        title: "Karmic Debt (0-13)",
        stats: "13 Stack Limit",
        details: "Each stack inflicts +5% damage vulnerability from all sources and deals 1d4 arcane strain (psychic) at the end of each round. Reaching 13 debt triggers immediate Tapestry Collapse."
      }
    ],

    generationTable: {
      headers: ["Action", "Resource Change", "Notes"],
      rows: [
        ["Bank Card (Fate Reserve)", "+1 Card", "Uses 'Fate Reserve' spell; max baseline 4 cards."],
        ["Force Override (Reaction)", "-1 Card, +2 Debt", "Replaces any d20 roll within 60 ft with card value."],
        ["Cast 'Arcane Dirge'", "Variable Debt", "Each poker hand outcome inflicts 1-4 debt based on strength."],
        ["Call Card", "+2 Debt", "Search deck for a specific card; once per turn."],
        ["Extended Rest", "Resets Debt to 0", "Your temporal anchor stabilizes; deck reshuffled."]
      ]
    },

    usage: {
      momentum: "Use your Fate Reserve cards to bypass RNG. Keep high face cards for saving throws and critical hits, and low numbered cards to force enemy failures.",
      flourish: "⚠️ Manage your Karmic Debt. Push to high debt levels only when a combat-ending blow is guaranteed. Use cleansing spells or rest to reduce debt before collapse."
    },

    overheatRules: {
      title: "Tapestry Collapse (13 Stacks)",
      content: `If your Karmic Debt reaches exactly 13 stacks, the strain on your temporal anchor reaches a breaking point. The Loom snaps back violently, overloading your mind and body:
- You immediately take **6d10 psychic damage** (this damage cannot be reduced or bypassed).
- You are **incapacitated** for 1 full round.
- Your Fate Reserve is entirely emptied (all banked cards dissolve into arcane mist).
- Your Karmic Debt resets to 0, but your maximum HP is reduced by 5 until you complete a long rest.`
    },

    infernoLevelsTable: {
      title: "Karmic Debt Escalating Strain",
      headers: ["Debt Stacks", "Vulnerability", "End of Round Strain", "Mental State"],
      rows: [
        ["0", "0%", "None", "Anchored"],
        ["1-3", "+5% per stack", "1d4 psychic per stack", "Flickering focus; minor hand tremors."],
        ["4-6", "+5% per stack", "1d4 psychic per stack", "Arcane resonance surges; visible energy distortion."],
        ["7-9", "+5% per stack", "1d4 psychic per stack", "Shattered perception; echoes of alternate timelines."],
        ["10-12", "+5% per stack", "1d4 psychic per stack", "Temporal dissociation; body flickers at the edges."],
        ["13", "COLLAPSE", "Tapestry Collapse", "Immediate temporal anchor failure."]
      ]
    },

    strategicConsiderations: {
      title: "Strategic Laws of the Cartomancer",
      content: `**1. The Expanded Hand Scaling**: Arcane Dealer specializations increase this reserve cap to 7 cards. This allows you to hold a full hand of options, making your d20 overrides vastly more versatile.
**2. Strain Stacking**: The arcane strain from Karmic Debt is psychic-typed and cannot be mitigated by standard magical resistance. It applies at the very end of your turn, meaning you must heal or end the combat before the round finishes.
**3. Target Priority**: You have zero defense against multiple targets. If surrounded, use 'Karmic Displacement' or 'Fold Reality' immediately to reposition. You are a fragile focal point; stay behind your front liners.`
    }
  },

  equipment: {
    title: "Starting Equipment",
    choices: [
      {
        name: "Probability Staff Path",
        icon: "Arcane/Arcane Staff",
        items: [
          "Rune-etched Staff (1d8 psychic, channels probability energy through crystalline tip)",
          "Reinforced Scholar's Robes (AC 11 + Agility, no mobility restriction)",
          "Deck Pouch (holds 52 rune-etched cards, always at hip)",
          "Crystal Lens (grants advantage on first Arcana check each day)"
        ],
        description: "The control-focused path. Staff provides steady ranged psychic damage and rapid Fate Reserve building through focused channeling."
      },
      {
        name: "Dueling Card Blade Path",
        icon: "Slashing/Razor Card",
        items: [
          "Pair of Card Blades (1d6 slashing each, razor-edged playing cards mounted on hilts)",
          "Leather Duelist Coat (AC 12 + Agility, max +3 Agility bonus)",
          "Weighted Deck Tin (reinforced case, can be thrown as improvised weapon for 1d4 bludgeoning)",
          "Lucky Coin (flip once per rest; heads = recover 1 mana, tails = gain 1 Karmic Debt)"
        ],
        description: "The aggressive path. Dual card blades enable melee-range probability strikes and reward high-risk, close-quarters wagers."
      }
    ],
    standardGear: [
      "Traveler's backpack, rations (7 days), waterskin, tinderbox, 50 ft hemp rope",
      "Rune-inscribing stylus and jar of aether-ink",
      "Probability abacus (mechanical calculator for tracking card counts)",
      "1d10 × 5 tarnished silver pieces"
    ],
    notes: "Fate Weavers cannot wield heavy weapons or wear heavy armor — the Loom's resonance interferes with dense metal. You are restricted to staves, daggers, and card blades. Your deck is your primary weapon; losing it disables all card-based abilities until replaced."
  },

  specializations: {
    title: "Fate Weaver Specializations",
    subtitle: "Three Paths of the Loom",
    description: "Every Fate Weaver decides how they will sculpt the architecture of probability. Your choice of specialization dictates how you handle the cards and the cosmic backlash.",

    specs: [
      { id : "fortune_teller",
        name: "Fate Seer",
        icon: "Eye/All Seeing Eye",
        color: "#9b59b6",
        theme: "Probability Prophecy",
        playstyle: "Manipulate enemy saving throws and predict combat outcomes using pre-drawn cards.",
        description: "Masters of peering through the threads of time to foresee and dictate enemy failures.",
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
        specPassive: {
          name: "Aether Foresight",
          description: "When an enemy within 60 feet rolls a saving throw, you may peek at the top card of your deck. If it is a face card, the enemy has disadvantage on the save."
        }
      },
      { id : "card_master",
        name: "Arcane Dealer",
        icon: "Arcane/Arcane Deck",
        color: "#e74c3c",
        theme: "Card Manipulation",
        playstyle: "Maintain a massive hand of probability cards, flooding the battlefield with constant d20 overrides.",
        description: "Masters of the deck. They carry the 'Expanded Hand', letting them store a massive reserve of cards to control every roll.",
        strengths: [
          "Maximum Fate Reserve capacity scales up to 7 cards",
          "Can spend debt to call two specific cards instead of one",
          "Highest frequency of d20 overrides"
        ],
        weaknesses: [
          "Generates Karmic Debt at an accelerated rate",
          "Highly dependent on draw luck",
          "Requires heavy mana upkeep to sustain large hand sizes"
        ],
        specPassive: {
          name: "Expanded Hand",
          description: "Your baseline Fate Reserve capacity is increased to 7 cards. When you use the 'Call Card' ability, you may search your deck for two specific cards instead of one, generating 3 debt instead of 2."
        }
      },
      { id : "thread_weaver",
        name: "Karmic Weaver",
        icon: "Arcane/Arcane Threads",
        color: "#2c3e50",
        theme: "Thread Manipulation",
        playstyle: "Link targets together and redirect damage, using the threads of debt to overwhelm opponents.",
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
        specPassive: {
          name: "Splintered Loom",
          description: "While you have 5 or more stacks of Karmic Debt, your spell attacks deal bonus necrotic damage equal to your current debt level. Additionally, you may link two creatures within 30 feet to share damage."
        }
      }
    ]
  },

  spells: [
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
        school: "necrotic",
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
        damageTypes: ["necrotic"],
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
            { name: "Royal Flush", damage: "12d10 necrotic", debtGain: 4, description: "Deals 12d10 necrotic damage + inflicts 4 debt. Absolute probability override." },
            { name: "Straight Flush", damage: "10d10 necrotic", debtGain: 3, description: "Deals 10d10 necrotic damage + inflicts 3 debt." },
            { name: "Four of a Kind", damage: "8d10 necrotic", debtGain: 3, description: "Deals 8d10 necrotic damage + inflicts 3 debt." },
            { name: "Full House", damage: "6d10 necrotic", debtGain: 2, description: "Deals 6d10 necrotic damage + inflicts 2 debt." },
            { name: "Flush", damage: "4d10 necrotic", debtGain: 2, description: "Deals 4d10 necrotic damage + inflicts 2 debt." },
            { name: "Straight", damage: "3d10 necrotic", debtGain: 1, description: "Deals 3d10 necrotic damage + inflicts 1 debt." },
            { name: "Three of a Kind", damage: "2d10 necrotic", debtGain: 1, description: "Deals 2d10 necrotic damage + inflicts 1 debt." },
            { name: "Two Pair", damage: "2d8 psychic", debtGain: 1, description: "Deals 2d8 psychic damage + inflicts 1 debt." },
            { name: "One Pair", damage: "1d8 psychic", debtGain: 1, description: "Deals 1d8 psychic damage + inflicts 1 debt." },
            { name: "High Card", damage: "1d4 psychic", debtGain: 2, description: "Deals 1d4 psychic damage + inflicts 2 debt (the weak outcome strains your concentration severely)." }
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

    { id: "war-of-wills",
      name: "Duel of Wills",
      description: "Draw 1 card and force your target to draw 1 as well. If your card's value is higher, you inflict psychic overload on their nervous system. If your card's value is lower, you absorb the psychic feedback, taking damage and gaining 1 Karmic Debt.",
      level: 1,
      spellType: "ACTION",
      icon: "Psychic/Brain Psionics",
      typeConfig: {
        school: "psychic",
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
        damageTypes: ["psychic"],
        resolution: "CARDS",
        cardConfig: {
          drawCount: 1,
          formula: "Card Value × 2 + Intelligence"
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

    { id: "echoes-of-the-past",
      name: "Echo of the Loom",
      description: "Draw the residual memory of a severed timeline from your deck. You gain temporary proficiency in one skill or tool of your choice for 10 minutes. Bending timeline constraints to absorb these residual echoes inflicts 1 Karmic Debt.",
      level: 1,
      spellType: "ACTION",
      icon: "Arcane/Arcane Scroll",
      typeConfig: {
        school: "psychic",
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
      tags: ["utility", "buff", "level 1", "fate weaver"]
    },

    { id: "marked-card",
      name: "Fate Reserve",
      description: "Focus your will and channel probability energy into your cards. Peek at the top 3 cards of your deck. You may 'bank' one card into your Fate Reserve (max 4 capacity) and draw the other two. Each override reaction expends a card from this reserve. Reshaping the deck's probability generates 2 Karmic Debt.",
      level: 1,
      spellType: "ACTION",
      icon: "Arcane/Arcane Scroll",
      typeConfig: {
        school: "necrotic",
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
      tags: ["utility", "cards", "level 1", "fate weaver"]
    },

    { id: "fate_lucky_strike",
      name: "Scythe of Destiny",
      description: "Draw 1 card. Face/Ace: deal 2d8 psychic damage and gain critical threat on next attack. Numbered: deal 1d8 psychic and gain 1 Karmic Debt.",
      level: 1,
      spellType: "ACTION",
      icon: "Slashing/Curved Scythe",
      typeConfig: {
        school: "psychic",
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
        damageTypes: ["psychic"],
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
      tags: ["melee", "damage", "level 1", "fate weaver"]
    },

    { id: "fate_twist_probability",
      name: "Karmic Severance",
      description: "As a reaction to a creature within 30 feet rolling a saving throw, you snap your fingers and sever their probability thread. Expend a banked card from your Fate Reserve to override their result. Face cards force an absolute failure on the target's save; numbered cards force a standard roll with a -5 penalty. Inflicts 1 Karmic Debt.",
      level: 1,
      spellType: "REACTION",
      icon: "Necrotic/Severed Skeletal Hand",
      typeConfig: {
        school: "necrotic",
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
      tags: ["reaction", "debuff", "level 1", "fate weaver"]
    },

    { id: "tapestry-shred",
      name: "Tapestry Shred",
      description: "Sever the threads of time in response to an action. Consume an active card from your Fate Reserve to force an immediate d20 roll override on any creature within 60 feet. The target's active d20 roll is replaced by the banked card's hard-coded value: Aces count as 18, Kings as 17, Queens as 16, Jacks as 15, and numbered cards map to their exact face value. Inflicts 2 Karmic Debt as the timeline violently shifts.",
      level: 1,
      spellType: "REACTION",
      icon: "Utility/Rewind Time",
      typeConfig: {
        school: "psychic",
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
      tags: ["reaction", "override", "level 1", "fate weaver"]
    },

    // ========================================
    // LEVEL 2 SPELLS
    // ========================================
    { id: "hearts-gamble",
      name: "Aether Wager",
      description: "Draw 1 card to heal an ally. Red card (Hearts/Diamonds): heal 3d8 + Spirit. Black card (Spades/Clubs): healing halved, you take 2d8 psychic, and gain 1 Karmic Debt.",
      level: 2,
      spellType: "ACTION",
      icon: "Healing/Stitched",
      typeConfig: {
        school: "necrotic",
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
      tags: ["healing", "cards", "level 2", "fate weaver"]
    },

    { id: "fate_fortune_favor",
      name: "Fortune's Favor",
      description: "Draw 1 card to grant an ally a protective ward. The suit of the drawn card dictates the blessing: Hearts grants 2d8 temporary HP, Diamonds grants +3 to all saving throws, Spades grants +15 ft movement speed, and Clubs grants +2 to physical attack rolls. Duration is 3 rounds. Inflicts 1 Karmic Debt.",
      level: 2,
      spellType: "ACTION",
      icon: "Radiant/Radiant Golden Shield",
      typeConfig: {
        school: "psychic",
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
      tags: ["buff", "cards", "level 2", "fate weaver"]
    },

    // ========================================
    // LEVEL 3 SPELLS
    // ========================================
    { id: "draw-of-the-damned",
      name: "Arcane Blackjack",
      description: "Force an enemy into a contest of probability. Draw cards trying to get as close to 21 as possible. Each drawn card deals 1d10 necrotic damage to the target. You may 'hit' up to 4 times. If your total exceeds 21, you bust: the target takes no further damage, you take 4d10 necrotic damage yourself, and you gain 3 Karmic Debt.",
      level: 3,
      spellType: "ACTION",
      icon: "Bludgeoning/Cranium Crush",
      typeConfig: {
        school: "necrotic",
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
        damageTypes: ["necrotic"],
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
      tags: ["damage", "cards", "level 3", "fate weaver"]
    },

    { id: "echo-of-fate",
      name: "Sympathetic Link",
      description: "Sever two probability threads and weave them together. Choose two creatures within 30 feet of each other. For the next 3 rounds, whenever the primary target takes damage, the bound target takes 50% of that damage as untreatable necrotic damage. Generating this link generates 2 Karmic Debt.",
      level: 3,
      spellType: "ACTION",
      icon: "Utility/Chained",
      typeConfig: {
        school: "necrotic",
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
            mechanicsText: "Link 2 creatures within 30 ft. Primary's damage is shared 50% as necrotic to secondary. Lasts 3 rounds. Inflicts 2 Karmic Debt."
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
      tags: ["debuff", "utility", "level 3", "fate weaver"]
    },

    // ========================================
    // LEVEL 4 SPELLS
    // ========================================
    { id: "solitaires-shield",
      name: "Solitaire Ward",
      description: "Draw 4 cards and lay them in a defensive matrix around yourself. You gain temporary shield points equal to the total face value of the drawn cards (Kings/Queens/Jacks count as 10, Aces as 15, numbered as face value). If any card drawn is a Club, your Armor is increased by 2 for the duration. Lasts 3 rounds. Generates 1 Karmic Debt.",
      level: 4,
      spellType: "ACTION",
      icon: "Utility/Bound Shield",
      typeConfig: {
        school: "psychic",
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
            description: "Gains shield points equal to card total. Club drawn increases Armor by 2.",
            mechanicsText: "Draw 4 cards. Gain shield = total face value (Face=10, Ace=15, Number=face). Club drawn: +2 Armor. Lasts 3 rounds. Inflicts 1 Karmic Debt."
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
      tags: ["buff", "defense", "level 4", "fate weaver"]
    },

    { id: "fates-exchange",
      name: "Karmic Displacement",
      description: "Target two creatures within 60 feet. They must make a Spirit saving throw against your spell DC. On a failure, their physical positions are instantly swapped in space as you violently cross their probability threads. Succeeding targets are unaffected. This reality warping generates 2 Karmic Debt.",
      level: 4,
      spellType: "ACTION",
      icon: "Arcane/Open Portal",
      typeConfig: {
        school: "force",
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
      tags: ["utility", "mobility", "level 4", "fate weaver"]
    },

    { id: "destiny-bond",
      name: "Fate Binding",
      description: "Project a strand of condensed probability energy to bind an enemy within 30 feet. For the next 3 rounds, 50% of all damage you receive is redirected to the bound enemy as necrotic damage. If you take damage, they must make a Spirit save or be pulled 10 feet closer to you. Weaving this bond generates 2 Karmic Debt.",
      level: 4,
      spellType: "ACTION",
      icon: "Utility/Chained",
      typeConfig: {
        school: "necrotic",
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
            mechanicsText: "50% of your incoming damage redirects to bound enemy as necrotic. Spirit save or pulled 10 ft. Lasts 3 rounds. Inflicts 2 Karmic Debt."
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
      tags: ["debuff", "defense", "level 4", "fate weaver"]
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
        school: "psychic",
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
      tags: ["utility", "cards", "level 5", "fate weaver"]
    },

    { id: "fate_weaver_twist_fate",
      name: "Twisted Strands",
      description: "As a reaction to a creature within 60 feet succeeding on an attack roll or saving throw, you violently twist their probability thread. Force them to reroll their action and take the worse result. This direct twisting generates 2 Karmic Debt as their success is torn from them.",
      level: 5,
      spellType: "REACTION",
      icon: "Psychic/Puppet Control",
      typeConfig: {
        school: "psychic",
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
      tags: ["reaction", "debuff", "level 5", "fate weaver"]
    },

    // ========================================
    // LEVEL 6 SPELLS
    // ========================================
    { id: "fate_weaver_dealers_choice",
      name: "Cartomancer's Harvest",
      description: "Consume 1 Fate Reserve card. Hearts: heal 6d8+Spirit. Diamonds: ally +4 saves, 30 temp HP (3 rds). Spades: 5d10 psychic. Clubs: enemy discards next action. +2 Debt.",
      level: 6,
      spellType: "ACTION",
      icon: "Necrotic/Devour",
      typeConfig: {
        school: "necrotic",
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
        damageTypes: ["psychic"],
        resolution: "CARDS"
      },
      healingConfig: {
        formula: "Card Value × 2 + Spirit (Hearts)",
        healingType: "direct",
        resolution: "CARDS"
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
      tags: ["damage", "healing", "buff", "level 6", "fate weaver"]
    },

    { id: "fate_weaver_twenty_one_curses",
      name: "High Stakes Blackjack",
      description: "Multi-target Blackjack for up to 3 enemies. Each card deals 2d6 necrotic. Hit up to 3x/enemy. Exact 21: +6d6 necrotic. Bust: you take 3d6 necrotic, +2 debt. Baseline +2 Debt.",
      level: 6,
      spellType: "ACTION",
      icon: "Necrotic/Blood Skull",
      typeConfig: {
        school: "necrotic",
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
        damageTypes: ["necrotic"],
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
      tags: ["damage", "aoe", "level 6", "fate weaver"]
    },

    { id: "fate_weaver_fold_reality",
      name: "Fold Reality",
      description: "Reaction to physical damage: teleport 30 ft, leaving an afterimage that detonates for 3d8 necrotic to adjacent creatures. Generates 2 Karmic Debt.",
      level: 6,
      spellType: "REACTION",
      icon: "Utility/Phantom Dash",
      typeConfig: {
        school: "necrotic",
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
    { id: "fate_weaver_house_rules",
      name: "Sovereign Decrees",
      description: "You stand as the House, dictating the physical laws of the battlefield. For 1 round, all d20 rolls made by allies within 30 feet of you automatically succeed if your banked card is higher than a 10. All d20 rolls made by enemies within 30 feet automatically fail if your banked card is lower than a 10. Imposing your absolute decrees generates 3 Karmic Debt.",
      level: 7,
      spellType: "ACTION",
      icon: "Utility/Overlords Command",
      typeConfig: {
        school: "psychic",
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
      tags: ["buff", "debuff", "utility", "level 7", "fate weaver"]
    },

    { id: "fate_weaver_all_in",
      name: "Arcane All-In",
      description: "Expend all banked Fate Reserve cards (min 2). Deals 3d10 necrotic per card to one target. 4+ cards: target Spirit save or incapacitated 1 round. +3 Karmic Debt.",
      level: 7,
      spellType: "ACTION",
      icon: "Necrotic/Corrosive Beam",
      typeConfig: {
        school: "necrotic",
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
        damageTypes: ["necrotic"],
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
      tags: ["damage", "cards", "level 7", "fate weaver"]
    },

    { id: "fate_weaver_destiny_rewritten",
      name: "Destiny Rewritten",
      description: "Target an active status effect on a creature. Choose one active buff or debuff on any target within 60 feet. Draw 1 card. If the card is a face card or Ace, you double the remaining duration of that effect. If it is a numbered card, you immediately end the effect. Rewriting a status duration generates 2 Karmic Debt.",
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
      tags: ["utility", "cards", "level 7", "fate weaver"]
    },

    // ========================================
    // LEVEL 8 SPELLS
    // ========================================
    { id: "fate_weaver_the_jokers_hand",
      name: "The Wild Joker",
      description: "Draw 3 cards. Red Joker: heal allies 8d8+Spirit, clear debuffs. Black Joker: you take 5d10 psychic, enemies take 8d10 necrotic (30 ft). Standard: 2d8 psychic. +3 Debt.",
      level: 8,
      spellType: "ACTION",
      icon: "Chaos/Chaotic Shuffle",
      typeConfig: {
        school: "chaos",
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
        damageTypes: ["necrotic"],
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
      tags: ["damage", "healing", "cards", "level 8", "fate weaver"]
    },

    { id: "fate_weaver_fate_sealed",
      name: "Fate Sealed",
      description: "Seal the target's probability anchor. Choose an enemy within 60 feet. They must make a Spirit saving throw against your spell DC. On a failure, they are marked for immediate execution: for the next 3 rounds, any attack roll made against them is a guaranteed critical hit. The strain of sealing this absolute doom generates 4 Karmic Debt.",
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
      tags: ["debuff", "utility", "level 8", "fate weaver"]
    },

    { id: "fate_weaver_fates_wager",
      name: "Karmic Wager",
      description: "Wager your own stability for amplification. Draw 1 card. If it is a face card or Ace, your next spell within 1 round deals triple damage and costs 0 AP. If it is a numbered card, your next spell deals double damage, but you take the exact same damage yourself. Drawing this wager generates 2 Karmic Debt.",
      level: 8,
      spellType: "ACTION",
      icon: "Necrotic/Ritual",
      typeConfig: {
        school: "necrotic",
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
      tags: ["buff", "cards", "level 8", "fate weaver"]
    },

    // ========================================
    // LEVEL 9 SPELLS
    // ========================================
    { id: "fate_weaver_grand_gambit",
      name: "Grand Gambit",
      description: "Initiate a competitive card draw with every enemy within 40 feet. Draw 1 card for each enemy, and 1 for yourself. If your card is higher than the enemy's, they are instantly reduced to 1 HP. If your card is lower, they are fully healed and gain +2 Armor for 1 minute. Ties inflict no effect but generate 1 debt. Generates 3 baseline debt.",
      level: 9,
      spellType: "ACTION",
      icon: "Necrotic/Skull Explosion",
      typeConfig: {
        school: "necrotic",
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

    { id: "fate_weaver_master_of_destiny",
      name: "Sovereign of Fate",
      description: "Draw 13 cards into your Fate Reserve as an absolute Throne. For 1 minute, you may spend 1 Karmic Debt to override any creature's die roll with a card from this Throne: Face cards convert to 20, Aces to 1 or 20, and numbered cards to their exact face value. Generates 3 Karmic Debt baseline.",
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
      tags: ["buff", "cards", "utility", "level 9", "fate weaver"]
    },

    { id: "fate_weaver_jackpot_supreme",
      name: "Karmic Rupture",
      description: "Draw 3 cards and shatter them. Ranks dictate necrotic damage in a 30-foot circle: One Pair multiplies a 10d10 base damage by 3. Three of a kind multiplies damage by 7 and targets suffer 'Temporal Overload' (incapacitated and take 4d10 necrotic damage at start of turn for 1 round). No matches deal 10d10 base and inflict 3 debt.",
      level: 9,
      spellType: "ACTION",
      icon: "Force/Explosion Burst",
      typeConfig: {
        school: "necrotic",
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
        damageTypes: ["necrotic"],
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
          twoMatch: { multiplier: 3, description: "10d10 × 3 necrotic damage" },
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
      tags: ["damage", "aoe", "cards", "level 9", "fate weaver"]
    },

    // ========================================
    // LEVEL 10 SPELLS
    // ========================================
    { id: "fate_weaver_rewrite_destiny",
      name: "Epitaph of Fate",
      description: "Draw 13 cards and rearrange them to rewrite reality. All Face: target ally is immune to all damage and automatically succeeds on all rolls for 1 minute. Same Suit: target enemy is reduced to 1 HP and suffers Temporal Collapse (incapacitated and takes 5d10 necrotic damage each turn for 1 minute). Failure to form a pattern inflicts 5 Karmic Debt.",
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
      tags: ["utility", "cards", "level 10", "fate weaver"]
    },

    { id: "fate_weaver_deck_of_many_things",
      name: "Grim Deck of Fates",
      description: "Summon a legendary deck of probability and draw 1-3 cards. Each card yields either a miraculous blessing or a catastrophic curse. Catastrophic cards immediately generate 3 Karmic Debt. You may spend 5 debt to redraw a curse.",
      level: 10,
      spellType: "ACTION",
      icon: "Arcane/Arcane Tome",
      typeConfig: {
        school: "necrotic",
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
      tags: ["utility", "cards", "level 10", "fate weaver"]
    },

    { id: "fate_weaver_casino_royale",
      name: "The Grand Theater",
      description: "Transform the battlefield into a probability theater in a 100-foot radius. Draw a card for every creature within: their suit determines their forced game: Hearts (Aether Wager), Spades (Duel of Wills), Diamonds (Blackjack), Clubs (Solitaire). You are the House, generating 2 Karmic Debt at the start of each of your turns.",
      level: 10,
      spellType: "ACTION",
      icon: "Necrotic/Necrotic Death",
      typeConfig: {
        school: "necrotic",
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
      tags: ["zone", "control", "cards", "level 10", "fate weaver"]
    },

    // ===== PASSIVE ABILITIES =====
    { id: "fate_weaver_deck_exhaustion",
      name: "Arcane Exhaustion",
      description: "When your deck runs dry and must be reshuffled, the probability drain taxes your system. You take 2d6 psychic damage and are unable to call cards or manipulate rolls for that turn.",
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

    { id: "fate_weaver_fates_wrath",
      name: "Karmic Strain",
      description: "Every time you override a natural roll, force a destiny, or use the 'Call Card' ability, you accumulate 1 stack of Karmic Debt (max 13). Each stack of debt imposes +5% vulnerability to all damage types and deals 1d4 psychic strain at the end of each round (untreatable by normal magic). Reaching 13 debt triggers immediate Tapestry Collapse, dealing 6d10 psychic damage and incapacitating you for 1 round.",
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
            id : "karmic_debt_vulnerability",
            name: "Karmic Debt Vulnerability",
            description: "Suffer compounding +5% vulnerability and 1d4 psychic strain per stack of debt.",
            mechanicsText: "+5% all-damage vulnerability per Karmic Debt stack. 1d4 psychic strain per stack at end of each round. At 13 stacks: Tapestry Collapse (6d10 psychic + 1 round incapacitation).",
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
      description: "When your Fate Reserve is empty and you have 0 Karmic Debt, your temporal anchor is dangerously unmoored. You have disadvantage on all saving throws and Dodge/Armor checks until you draw a card or gain 1 debt.",
      level: 3,
      spellType: "PASSIVE",
      icon: "General/Broken Armor",
      effectTypes: ["passive", "debuff"],
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
      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          {
            id : "unmoored_void_anchor",
            name: "Unmoored Anchor",
            description: "Disadvantage on all saving throws and Dodge/Armor checks.",
            mechanicsText: "While Fate Reserve is empty and Karmic Debt is 0: disadvantage on all saves and Dodge/Armor checks. Ends when you draw a card or gain 1 debt."
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
            "fate_weaver"
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
          "fate_weaver"
        ]
      }
  ]
};
