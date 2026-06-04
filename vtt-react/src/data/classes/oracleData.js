/**
 * Oracle Class Data
 *
 * Ground-up surgical overhaul of the Oracle - a fragile anchor shattered by overlapping,
 * uninvited timelines. Every spell is a physical mutilation; power demands a toll of flesh and sanity.
 * Adheres strictly to SPELL_DATA_REFERENCE.md and Mythrill terminology.
 */

export const ORACLE_DATA = {
  id : "oracle",
  name: "Oracle",
  icon: "fas fa-eye",
  role: "Support/Utility (Foresight & Fate Manipulation)",
  damageTypes: ["psychic", "force"],

  classIdentity: {
    title: "The Oracle",
    subtitle: "The Wound That Never Closes",
    quote: `"I saw you die in seventeen different futures. This was the only one where you stood breathing. The cost was mine to bear."`,
    lore: "Oracles are not blessed mystics reciting gentle prophecies; they are fragile, trauma-shattered anchors shattered by the weight of overlapping, uninvited timelines. Every vision is a physical mutilation, an agonizing pressure that builds behind the eyes until they crack. They do not choose the sights they see—the future is an inescapable screaming mouth that forces itself into their minds, leaving their bodies as leaking vessels of volatile temporal mercury."
  },

  overview: {
    originStory: `Vala, the Astril star-watcher of the Sundrift Vale, stared into the black sky during Keth-Amar's descent and received a blinding vision of the stars' destruction. The constellation-spirits flooded her mind, searing her optical nerves and leaving her in a state of permanent temporal displacement.

The weight of this celestial foresight left her blind to the immediate present. The Oracle can see tomorrow's battles with perfect clarity, but she cannot see the stones at her feet, requiring allies to guide her steps through the physical world, her body wracked by warning seizures.

Glimpse the light. The future is written in starlight, and you are the lens. Read the thread before it burns away.`,
    title: "The Oracle",
    subtitle: "The Wound That Never Closes",

    quickOverview: {
      title: "Quick Overview",
      content: `**What You Need to Know**: You are a cursed vessel. Futures force themselves into your mind uninvited — every death, every branching timeline, every scream of what-might-be. You cannot stop the visions; you can only channel them, and every channeling adds to the Omen Debt that will eventually break you.
      
**Core Mechanic**: Cast Spell → Accumulate Omen Debt → Suffer Severe Threshold Penalties (at 3/6/9) → Manage Debt or trigger a catastrophic Debt Eruption at 10.

**Resource**: Omen Debt (0–10 scale, accumulates with every spell cast, never spent — only suffered)

**Playstyle**: Tactical support built on self-destruction — channel futures to empower allies, then pay the price in blood.

**Best For**: Players who embrace the weight of knowing what comes next and are willing to sacrifice their own body to change it.`,
    },

    description: `A tragic dirge written in bleeding eyes and shattered realities. The Oracle is no elegant fortune teller; they are a biological anchor splintering under the pressure of overlapping futures. To touch their sight is to invite immediate physical destruction. They speak in fractured gasps of what will be while chronal mercury leaks from their facial orifices, paying for every truth in the currency of their own vital organs.`,

    roleplayIdentity: {
      title: "Roleplay Identity",
      content: `**HISTORY: THE GENESIS**
The oracle's warning flashes were born in the starless steppe of the <LoreLink termId="sundrift-vale">Sundrift Vale</LoreLink>. An Astril star-watcher named **Vala** stared into the starless dark and received a vision of the stars' destruction. The price of this foresight was physical seizure. The warning flashes induced minor physical seizures, leaving her blind to the immediate present to see the future.

**CITIES & CIVIL RECEPTION**
Oracles are highly revered as vital spiritual guides in the yurt-camps of the steppe and the high halls of the <LoreLink termId="synod_hold">Synod-Hold</LoreLink>.

**RACES & CULTURAL AFFILIATION**
The class is heavily practiced by the crystal-skinned <LoreLink termId="astril">Sylen Astril</LoreLink> and nomadic humans.

**NOTABLE FIGURES**
* **Vala the Star-Eyed**: The Astril seer whose warning flashes left her blind to the dirt but clear to the future.
* **Micah the Seer**: A nomad who mapped the starless sky by tracing the echoes of dead constellations.`
    },

    signatureQuote: {
      text: '"I can see the exact moment of your death. I can also see three alternative versions where you survive. I will not tell you which one is real. That knowledge would break you, and you still have things to do."',
      speaker: 'Vala the Star-Eyed',
      context: 'Spoken to a caravan guard who asked his fortune; he died three days later from entirely preventable causes'
    },

    philosophy: {
      coreTenet: 'The future is not a single path — it is a thicket of overlapping possibilities, each one as real as the others. The Oracle sees them all simultaneously. They do not predict the future; they perceive the full landscape of probability, and they must navigate it moment by moment.',
      relationship: 'Oracles do not seek visions — the visions come whether they want them or not. Their power is a curse of constant, unwanted clarity. Every decision they witness has consequences they cannot unsee. The Omens are not tools they wield; they are weights they carry. The Oracle accumulates Omen Debt not by using their power but simply by existing — the visions come, and the Debt grows.',
      paradox: 'The Oracle knows everything that could happen and nothing that will. They can describe a dozen different versions of the next ten minutes with perfect clarity, but they cannot tell you which one will actually occur until it does. This makes them invaluable advisors — and profoundly unreliable. An Oracle who says "you will die tomorrow" is not giving you a death sentence. They are describing one possibility among a thousand. They do not know which one will come true. Neither do you.'
    },

    currentCrisis: `Vala has stopped speaking. The first Oracle — the Astril star-watcher who saw the destruction of the stars — has gone completely silent. She sits in her chamber in Synod Hold, staring at nothing, occasionally weeping, but she will not describe what she sees.

The other Oracles of the Sundrift Vale are divided. Some believe Vala has finally broken under the weight of Omen Debt — that her mind has collapsed into a permanent vision-state from which she cannot return. Others believe she has seen something so catastrophic that describing it would trigger it. The Steppe-Lord has stationed guards at her door with orders to report anyone who enters or leaves. But the guards have begun to notice something: Vala\'s tears leave trails in the dust on her floor, and the trails form patterns — complex, repeating geometric shapes that match no known prophecy system. She is not silent. She is drawing.`,

    meaningfulTradeoffs: `To be an Oracle is to be blind to the present. Vala can see the battle that will happen tomorrow with perfect clarity, but she cannot see the cup of water on the table in front of her. She requires a guide for basic movement — someone to describe the immediate physical world while she navigates the future. This dependence creates a strange intimacy: Oracles bond deeply with their guides, often developing romantic attachments to the people whose eyes they borrow. An Oracle without a guide is helpless, trapped in a world of infinite futures and zero present.`,

    classSpecificLocations: [
      {
        name: 'The Vision Chambers of Synod Hold',
        locationId: 'synod-hold',
        description: 'Dark, circular rooms lined with black felt at the center of Synod Hold, where Oracles retreat to receive visions without visual distraction. The walls are covered in charcoal sketches — the Oracles draw what they see, hoping patterns will emerge. The oldest sketches date back centuries, and some show events that have not yet occurred.',
        purpose: 'Vision reception and Omen recording',
        status: 'Active — Vala\'s chamber is sealed, but the others remain open'
      }
    ],

    combatRole: {
      title: "Combat Role",
      content: `In combat, Oracles are tactical support specialists who excel at:

**Information Warfare**: Revealing enemy weaknesses, hidden HP, and tactical intentions—paid in Omen Debt.
**Fate Manipulation**: Utilizing banked Forecast Dice to replace active table rolls without increasing Omen Debt.
**Ally Protection**: Intercepting lethal vectors with the iconic Level 1 Chrono-Wound, taking ally damage into their own timeline.
**Debuff & Control**: Cursing enemies and stripping magical buffs—costing vital flesh.

**THE ORACLE DOES NOT REROLL DICE**. The Oracle is NOT a probability manipulator — that is the Fate Weaver's exclusive domain. The Oracle SEES what IS and REVEALS it, paying for each vision in HP and escalating debt. Your power is KNOWLEDGE: enemy resistances, hidden HP thresholds, upcoming attack patterns, trap locations, and enemy intentions.

Every spell costs flesh. HP sacrifice, self-debuffs, blindness, max HP loss — these are the Oracle's true resource. Mana is secondary. Your body is the currency. Manage your Omen Debt carefully: at 3 you lose accuracy, at 6 you start going blind, at 9 your vessel cracks and you become vulnerable to all physical damage.`,
    },

    whatOracleIsNot: {
      title: "What the Oracle Is NOT",
      content: `**Not a Damage Dealer**: Your damage output is low. You empower allies to deal damage. You point at the thing that will kill them and say its name. That is your blade.

**Not a Healer**: You have no healing abilities. You knew the injury was coming three days ago. That is not the same as preventing it. Your one defensive tool — Chrono-Wound — absorbs damage INTO YOUR BODY. You are not preventing wounds; you are relocating them.

**Not a Tank**: You have light armor and low HP. Your survival comes from foresight — and from absorbing ally damage through Chrono-Wound, which makes you LESS survivable, not more.

**Not a Reroller**: You do NOT force rerolls. That is the Fate Weaver's exclusive domain. You REVEAL information and let your party act on it.

**Not Sustainable**: Every spell adds Omen Debt. At 6+ debt, you take automatic psychic damage each turn. At 9+, you are vulnerable to physical damage. You cannot cast forever. You must choose when the cost is worth paying.

**Omen Debt Thresholds**:
- **0-2 (Clear Mind)**: No penalties. The vessel is intact.
- **3-5 (Haunted)**: -1 to all d20 rolls. Visual: pupils dilate, obsidian veins crawl at the temples.
- **6-8 (Torn Veil)**: Take 1d4 psychic damage at start of each turn. Blinded for first round of next combat. Visual: eyes cloud milk-white.
- **9-10 (Cracked Vessel)**: Vulnerable to physical damage (+100% damage taken). Lose 10 max HP. At exactly 10 Debt, trigger a volatile Debt Eruption.`,
    },

    playstyle: {
      title: "Playstyle",
      content: `Oracles reward players who:

**Manage Debt**: Know when to cast and when to hold. Every spell adds Omen Debt — the question is always "is this worth the cost?"
**Think Ahead**: Position for Chrono-Wound absorption. Plan which ally you'll save and what you'll sacrifice.
**Pay Attention**: Notice patterns, remember details, and connect information the futures show you.
**Accept the Cost**: You WILL take damage from your own spells. You WILL go blind. You WILL lose max HP. The question is whether the enemy suffers more.
**Support Allies**: Your power makes everyone else more effective. You are the intelligence that makes the party lethal.

The class creates a unique tension between power and self-destruction. Cast too little and you're useless. Cast too much and your vessel breaks. The best Oracle players walk the knife's edge between sacrifice and suicide.`,
    },

    immersiveCombatExample: {
      title: "Combat Example: The Cursed Vessel's Gambit",
      content: `**The Setup**: You're an Oracle (Truthseeker specialization) facing a warband of hobgoblin soldiers and their warchief. Starting Omen Debt: 0/10. Starting Mana: 50/60. HP: 55/55. Your goal: Channel futures to expose enemy weaknesses while managing the accumulating debt.

**Starting State**: Omen Debt: 0/10 | Mana: 50/60 | HP: 55/55

---

**Turn 1 — First Channeling (Debt: 0 → 2)**

*The hobgoblins advance. You close your eyes and the futures SCREAM in.*

**Your Action (1 AP)**: Cast **Unmask** on the Hobgoblin Warchief
**Effect**: Strip one magical buff from target. Spirit save or lose the buff permanently.
**Self-Harm**: Take 1d6 psychic damage → [4]. Accumulate +2 Omen Debt.
*Your nose bleeds. The future you channeled ripped through you on the way out.*

**Your Action (1 AP)**: Cast **Reveal Weakness** on the Warchief
**Effect**: Expose vulnerability — allies gain advantage and +1d6 damage against target for 4 rounds.
**Self-Harm**: Take 1d6 psychic damage → [5]. Accumulate +2 Omen Debt.

*Blood trickles from your ears. "Strike NOW," you rasp. "He's exposed."*

**Mana**: 50 - 10 - 14 = 26/60
**HP**: 55 - 4 - 5 = 46/55
**Omen Debt**: 0 + 2 + 2 = **4/10** (HAUNTED: -1 to all d20 rolls, obsidian veins throbbing)

*The futures are crowding in. Your hands tremble. -1 to everything until the debt drops.*

---

**Turn 2 — Chrono-Wound (Debt: 4 → 7)**

**Hobgoblin Warchief's Turn**: Attacks your mage with a massive blow → 28 damage!

*Your mage drops to 4 HP. She'll die from the next hit.*

**Your Reaction**: Cast **Chrono-Wound**
**Effect**: Absorb the damage instead. You take 14 now, 7 next round, 7 the round after. The delayed damage can't kill you (drops to 1 HP).
**Self-Harm**: Take 14 force damage immediately. Accumulate +3 Omen Debt.
*You reach across time and PULL the blow into your own body. Your chest cringes. Ribs crack. But your mage stands.*

**Your Action (1 AP)**: Cast **Divine Insight** on the Warchief
**Effect**: Allies gain +2 to attack rolls against target for 3 rounds.
**Self-Harm**: Take 1d4 psychic damage → [3]. Accumulate +1 Omen Debt.

**Mana**: 26 - 20 - 10 = -4 → Can't cast! Use remaining mana only.
*Actually, you only have 26 mana. Chrono-Wound costs 20, Divine Insight costs 10. You can afford both.*

**Mana**: 26 - 20 - 5 = 1/60
**HP**: 46 - 14 - 3 = 29/55 (delayed 7 damage incoming next 2 rounds)
**Omen Debt**: 4 + 3 + 1 = **8/10** (TORN VEIL: 1d4 psychic/turn, Blinded next combat, eyes milky)

*Your eyes are going dark. The futures are screaming so loud you can barely hear your party. But the warchief has no buffs and every weakness exposed.*

---

**Turn 3 — The Debt Screams Back (Debt: 8, Torn Veil active)**

**Start of Turn**: Take 1d4 psychic from Torn Veil → [3].
**HP**: 29 - 3 = 26/55

**Delayed Chrono-Wound**: Take 7 force damage. HP: 26 - 7 = 19/55.

*You're bleeding from your eyes now. The debt is EATING you.*

**Your Action (1 AP)**: You DON'T cast. You take the Dodge action instead.
*One more spell would push you to 9 or 10. Vessel Breaking. You'd become vulnerable to physical and lose 10 max HP. At exactly 10, the timeline would violently erupt through you. Not worth it. You've done your job — the warchief is exposed and your allies have advantage.*

**Your Party's Tank**: Attacks Warchief with advantage (+2 from Divine Insight, +1d6 from Revealed Weakness)
**Attack Roll**: d20+6 with ADVANTAGE → [18, 12] → 18+6 = 24 → **HIT!**
**Damage**: 2d8+5+1d6 → [7,8] + 5 + [4] = 24 damage!

**Your Party's Rogue**: Attacks Warchief with advantage → **CRITICAL HIT!** → 48 damage!

**Warchief**: DEAD.

*The remaining hobgoblins see their leader fall and break rank.*

**Combat Over**

**Final State**: Omen Debt: 8/10 | Mana: 1/60 | HP: 19/55 (delayed 7 damage still incoming)
*You collapse to one knee. Blood pools beneath you. Your eyes are clouded — you'll be Blinded at the start of the next fight. But everyone is alive. Your mage would have died without Chrono-Wound. The warchief would have killed someone without Reveal Weakness. You paid for their survival in blood.*

**Your Party's Mage**: "You... you took my blow. I felt you pull it."
**You**: "I saw you die in seventeen futures. This was the only one where you didn't. The cost was mine to bear."`,
    },
  },

  characterCreation: {
    title: "Creating an Oracle",
    subtitle: "Opening the Wound",

    abilityPriorities: {
      primary: "Spirit",
      primaryDesc:
        "Powers your Omen Debt thresholds, determines spell save DCs, and fuels your foresight magic.",
      secondary: "Intelligence",
      secondaryDesc:
        "Boosts psychic damage on spells like Future Strike and Past Sins, and supports investigation skills.",
      tertiary: "Constitution",
      tertiaryDesc:
        "Survivability. You WILL take self-damage from every spell — every HP counts when you are your own resource.",
    },

    startingEquipment: {
      weapons: [
        {
          name: "Choose: Oracle's Foresight Staff OR Crystal Focus",
          damage:
            "Staff: 1d6 psychic (two-handed) / Focus: 1d4 psychic (one-handed)",
          properties:
            "Foresight Staff grants +2 Spirit, +1 INT. Crystal Focus allows off-hand Scrying Orb for +2 INT.",
        },
      ],
      armor: [
        {
          name: "Cursed Vestments",
          armor: "1 + agility modifier",
          properties:
            "Cloth armor. Grants +2 Spirit, +1 INT. Enchanted to channel futures — and nothing more.",
        },
      ],
      accessories: [
        {
          name: "Choose 1",
          options: [
            "Necklace of Fate (+1 Spirit, +1 INT)",
            "Oracle's Scrying Deck (tool — grants advantage on fortune-telling checks, once per day you may channel a future without adding Omen Debt)",
          ],
        },
      ],
      gear: [
        "Scrying tools (crystal, cards, or bones)",
        "Traveler's clothes with a dark hood",
        "Pouch with 10 gold pieces",
        "A journal for recording visions and the debt they incur",
      ],
      note: "Every spell adds Omen Debt. At 3+ debt you suffer -1 to all rolls. At 6+ you take automatic psychic damage each turn. At 9+ your vessel cracks. At exactly 10, a Debt Eruption occurs. Short rest reduces debt by 2; long rest resets to 0.",
    },

    startingStats: {
      hp: "8 + Constitution modifier",
      hitDice: "1d8 per Oracle level",
      armor: "1 + agility modifier (Cursed Vestments)",
      speed: "30 ft",
      savingThrows: ["Spirit", "Intelligence"],
      skills: [
        "Choose 3 from: Arcana, History, Insight, Investigation, Perception, Religion",
      ],
    },

    startingAbilities: [
      {
        name: "Third Eye",
        description:
          "See invisible creatures/objects within 30ft, advantage on Insight checks, detect lies. Your Omen Debt starts at 0 after each long rest.",
      },
      {
        name: "Fate's Whisper Strike",
        description:
          "Basic attack: 1d4 psychic damage + INT mod. Costs no resources. The only spell that adds 0 Omen Debt.",
      },
      {
        name: "Forecast Dice",
        description:
          "Roll 5 chosen dice at day start. Spend to replace any roll. Unused dice incur Fate's Burden.",
      },
    ],
  },

  resourceSystem: {
    title: "Omen Debt",
    subtitle: "The Weight of Unwitnessed Futures",

    description: `Futures assault the Oracle. They do not ask for visions — the visions force themselves in, a screaming tide of what-might-be that erodes the vessel with each channeling. Every spell the Oracle casts rips open the wound a little wider, adding to the Omen Debt that accumulates until the vessel breaks. The Oracle does not spend a resource and recover it. The Oracle accumulates a debt and suffers for it.`,

    cards: [
      {
        title: "The Cursed Vessel (0–10)",
        stats: "10 Debt Max | Thresholds at 3/6/9 | Catastrophic Eruption at 10",
        details:
          "A bleeding eye UI tracks your Omen Debt. It darkens as debt accumulates, with visible porcelain cracks forming at higher thresholds. The vessel is always one spell away from breaking.",
      },
      {
        title: "Flesh as Currency",
        stats: "HP Cost Per Spell | Self-Debuffs",
        details:
          "Every spell costs HP in addition to mana. Level 0-1: 1d4 psychic to self + 1 debt. Level 2-4: 1d6 psychic to self + 2 debt. Level 5-7: 2d6 psychic to self + 3 debt. Level 8-10: 3d6 psychic to self + 4 debt.",
      },
      {
        title: "Chrono-Wound",
        stats: "Absorb Ally Damage | Signature Move (Level 1)",
        details:
          "The Oracle's signature Level 1 ability: reach across time to absorb damage dealt to an ally. You take half immediately and the other half over 2 rounds. The delayed damage cannot kill you (drops to 1 HP). This is the Oracle's defining tactical choice.",
      },
      {
        title: "Forecast Dice",
        stats: "5 Dice at Day Start | Swap Any Roll",
        details:
          "At the start of each day, roll 5 dice of your choosing (any combination of d4, d6, d8, d10, d12, d20). Bank the results. During the day, spend a forecast die to replace any die roll result with the banked value. Unused dice cause Fate's Burden.",
      },
    ],

    visualDebtScars: {
      title: "Visual Debt Scars",
      description: "Terrifying physical transformations mapped directly across Omen Debt thresholds.",
      thresholds: [
        {
          level: "Debt 3-5 (Haunted)",
          name: "Whispering Shadows",
          description: "Your pupils dilate, swallowing your irises. The skin around your temples thins, revealing a network of pulsing, obsidian-colored veins that twitch in sync with timeline anomalies. Sound seems to warp around you as half-formed echoes of conversations that haven't occurred whisper just out of phase."
        },
        {
          level: "Debt 6-8 (Torn Veil)",
          name: "The Clouding White",
          description: "Your physical eyes cloud over completely, transforming into milk-white, blind spheres that leak tears of volatile, glowing temporal mercury. Fractures of pale, crystalline light begin cutting through your skin like broken porcelain around your neck and collarbones. Your presence is cold, smelling of stale dust and old copper."
        },
        {
          level: "Debt 9-10 (Cracked Vessel)",
          name: "Volatile Effluence",
          description: "Your flesh is no longer a solid boundary. Pale, blinding fractures crawl up your cheeks and nose. Chronal fluid—thick, glowing, and shifting with chaotic color—leaks aggressively from your eyes, nose, and ears, evaporating into shimmering mist as it touches reality. Space within 5 feet of you visibly warps and distorts under the pressure of overlapping timelines."
        }
      ]
    },

    debtAccumulationTable: {
      headers: ["Spell Level", "Debt Added", "Self-Harm", "Mana (varies)"],
      rows: [
        [
          "Level 0-1",
          "+1 Omen Debt",
          "1d4 psychic to self",
          "0-10 mana",
        ],
        [
          "Level 2-4",
          "+2 Omen Debt",
          "1d6 psychic to self",
          "12-22 mana",
        ],
        [
          "Level 5-7",
          "+3 Omen Debt",
          "2d6 psychic to self",
          "20-40 mana",
        ],
        [
          "Level 8-10",
          "+4 Omen Debt",
          "3d6 psychic to self, lose 5 max HP",
          "35-60 mana",
        ],
      ],
    },

    debtThresholds: {
      title: "Omen Debt Thresholds & Eruption",
      content: `**0-2 — Clear Mind**: No penalties. The vessel is intact. Futures whisper but you can ignore them.
      
**3-5 — Haunted**: -1 to ALL d20 rolls. The whispers have become shouts, crowding your concentration.
*Visual: pupils dilate into obsidian voids, veins throbbing at the temples.*

**6-8 — Torn Veil**: Take 1d4 psychic damage at the start of each of your turns. Blinded for the first round of the next combat encounter.
*Visual: eyes cloud completely into milk-white blind globes weeping glowing temporal mercury.*

**9-10 — Cracked Vessel**: You gain a catastrophic 100% vulnerability to ALL physical damage. You lose 10 maximum HP (restored on a long rest).
*Visual: fractures of pale, blinding light cut through your skin like cracked porcelain, chronal fluid leaking from your eyes, nose, and ears.*

**Exactly 10 Debt — Debt Eruption**: At exactly 10 Debt, the vessel ruptures under the raw pressure of reality-bleeding timelines. At the start of your turn, roll a d6:
- **1-3 (Temporal Blast)**: Chronal fluid violently explodes outward. All entities (allies and enemies) within 15 feet take 3d6 force damage. The Oracle takes 2d6 psychic damage.
- **4-5 (Timeline Fracture)**: The timeline snaps back into your flesh, permanently destroying 5 max HP for the remainder of the day.
- **6 (Reality Rip)**: A local rift tears reality wide open. All entities within 30 feet must make a DC 15 Spirit save or be stunned for 1 round. The Oracle takes 2d10 psychic damage as time fractures.

**Recovery**: Short rest reduces Omen Debt by 2. Long rest resets to 0. Some specialization abilities offer small debt reduction at a cost.`,
    },

    forecastDice: {
      title: "Forecast Dice",
      subtitle: "The Oracle's Unique Ability",
      description: `At the start of each day (after a long rest), the Oracle rolls **5 Forecast Dice** of their own choosing. You may select any combination of dice types (d4, d6, d8, d10, d12, d20) — for example, 2d6 + 1d8 + 1d10 + 1d20. The results are **banked** and can be spent throughout the day to replace any single die roll with a forecast die result. Using a forecast die does NOT add to Omen Debt.`,
      rules: [
        "**Rolling**: At the start of each day, choose your 5 dice and roll them. Record each result separately (e.g., d6=4, d6=2, d8=7, d10=3, d20=14).",
        "**Spending**: At any point during the day, you may spend one forecast die to replace the result of ANY die roll — yours, an ally's, or an enemy's. This includes attack rolls, damage rolls, saving throws, ability checks, and healing rolls.",
        '**Declaration**: You must declare the swap BEFORE the result is applied. "I swap my forecast d8 showing 7 for this attack roll."',
        "**One-for-One**: Each forecast die can only be used once. Once spent, it is consumed.",
        "**No Debt**: Using forecast dice does NOT add to Omen Debt. It is the only Oracle ability that channels futures without cost to the vessel.",
        "**Strategic Choice**: Choosing your dice types is a strategic decision. d20s give you wide-range replacement potential but are risky (you might roll low). d4s and d6s are more reliable for guaranteeing minimum values.",
      ],
      exampleLoadouts: [
        {
          name: "The Safety Net",
          dice: "5d6",
          strategy:
            "Reliable mid-range swaps. Good for turning misses into hits or guaranteeing damage.",
        },
        {
          name: "The Critical Fisher",
          dice: "2d20 + 3d4",
          strategy:
            "Fish for natural 20s on the d20s. Use d4s for small but guaranteed adjustments.",
        },
        {
          name: "The Balanced Oracle",
          dice: "2d8 + 2d6 + 1d12",
          strategy:
            "Mix of range sizes for versatile swap options throughout the day.",
        },
      ],
      fatesBurden: {
        title: "Fate's Burden",
        description: `If you reach the end of the day (next long rest) with unused Forecast Dice, you suffer **Fate's Burden**: a stacking penalty of **-1 to all d20 rolls per 2 unused forecast dice** (rounded down), carried to the next day. Maximum penalty is -3.`,
        rules: [
          "**Penalty**: Each 2 unused forecast dice = -1 to ALL d20 rolls (attacks, saves, checks, death saves) the following day. Round down (1 unused die = 0 penalty).",
          "**Stacking**: If you have 3 unused dice, you suffer -1. If you have 5 unused dice, you suffer -2.",
          "**Cap**: Maximum Fate's Burden is -3. Any dice beyond 6 unused do not increase the penalty further.",
          "**Clearing**: Fate's Burden clears at your NEXT long rest. During the burdened day, you still roll new forecast dice normally.",
          "**Philosophy**: The Oracle foresaw these outcomes and failed to act. The weight of unfulfilled prophecy drags at your sight.",
        ],
      },
    },

    usage: {
      momentum:
        'Cast freely at 0-2 debt. You have room to channel several futures before the penalties kick in.',
      flourish:
        "The knife's edge is at 5-6 debt. One more spell pushes you into Torn Veil (auto-damage/turn). Is the spell worth bleeding every turn?",
    },

    strategicConsiderations: {
      title: "Debt Management Strategy",
      content: `**Phase 1: Free Channeling (0-2 Debt)**: Cast what you need. You have no penalties. Build your information advantage and set up buffs/debuffs before the cost starts hurting.

**Phase 2: Cautious Casting (3-5 Debt)**: You're at -1 to all d20 rolls. Only cast when the benefit outweighs the penalty. Save your big spells for critical moments.

**Phase 3: Emergency Only (6-8 Debt)**: You take 1d4 psychic/turn automatically. Only cast if it will save a life — Chrono-Wound is worth the cost; minor buffs are not.

**Phase 4: Cracked Vessel (9-10 Debt)**: You are vulnerable to physical damage and have lost 10 max HP. STOP CASTING. Your only job now is to survive. Dodge, take cover, and pray for a short rest before you trigger a Debt Eruption.

**The Short Rest Calculation**: A short rest drops debt by 2. If you're at 8, a short rest brings you to 6 (still Torn Veil, but closer to Haunted). Two short rests bring you to 4. Sometimes retreating is the correct tactical decision.

**Chrono-Wound Timing**: Your signature ability. Use it to save a dying ally, NOT to prevent minor damage. Each use adds 3 debt and deals massive self-damage. One Chrono-Wound can push you from Haunted to Torn Veil. Two can break your vessel.`,
    },

    playingInPerson: {
      title: "Playing Oracle In Person",
      content: `**Required Materials**:
- **10 Red Tokens** (Blood-red beads or glass drops for Omen Debt)
- **Prediction Cards** (Index cards or sticky notes)
- **Fate Die** (A distinct d20 for forecast dice swaps)

**Tactile Tracking**:
1. **The Vessel**: Arrange your 10 tokens in a circle (a "vessel") on the table.
2. **Accumulating Debt**: When you cast a spell, move tokens from a "Reserve" pile INTO the vessel. The vessel fills with debt.
3. **Thresholds**: At 3 tokens, mark a -1 on your die rolls. At 6 tokens, place a "Blind" card in front of you. At 9 tokens, flip your character card to show "Vessel Breaking."
4. **The Eruption**: If you reach 10 tokens, place the "DEBT ERUPTION" card on your sheet, warning everyone of the ticking time bomb.

**The "Chrono-Wound" Token**:
Use a distinct large token (a blood drop or hourglass). When you Chrono-Wound, place it on the damaged ally's card, then move damage tokens to YOUR HP track. The physical act of pulling damage from one card to yours makes the sacrifice tangible.`,
    },
  },

  // Specializations
  specializations: {
    title: "Oracle Specializations",
    subtitle: "Three Paths of Forbidden Sight",

    description: `Three ways to gouge the third eye open wider. Seers drown in futures until their physical sight burns away. Truthseekers strip the skin off every lie and pay for each exposure in their own blood. Fateseers seize the threads of destiny and find that the threads cut back. Every path demands flesh. Every path leads to the same destination: knowing everything and being able to prevent nothing.`,

    passiveAbility: {
      name: "Third Eye",
      description:
        "All Oracles can see invisible creatures and objects within 30 feet, have advantage on Insight checks, and can detect when someone is lying to them (though not what the truth is). You accumulate Omen Debt with each casting — too much Debt and your mind fractures under the weight of prophecy.",
    },

    specs: [
      { id : "seer",
        name: "Seer",
        icon: "Utility/Watchful Eye",
        color: "#9370DB",
        theme: "Foresight Through Self-Blindness",

        description: `Seers tear their third eye open and let the future pour in like poison. Every correct prediction deepens the wound. Their foresight is unparalleled -- and so is the cost. The more clearly they see, the less they can look away from what is coming. They speak of bright tomorrows while their hands tremble from the weight of every yesterday that has not yet happened.`,

        playstyle:
          "Prediction focus, future sight, tactical foresight, ally guidance",

        strengths: [
          "Gain advantage on Insight checks from Prophetic Clarity",
          "Can make predictions for 0 AP (free) instead of 1 AP",
          "See 3 seconds into the future, granting advantage on initiative",
          "Predictions have longer duration and can stack",
        ],

        weaknesses: [
          "Abilities focused on prediction rather than direct power",
          "Requires accurate forecasting to be effective",
          "Less useful when facing completely unpredictable enemies",
          "Minimal direct damage output",
          "Blinded for 1 round when Omen Debt reaches 3+",
        ],

        specPassive: {
          name: "Prophetic Clarity",
          description:
            "Gain advantage on Insight checks. When Omen Debt is 3+, you are Blinded for 1 round after casting any spell. Make 1 free prediction per round (0 AP). Correct specific/precise predictions let you immediately predict again for free.",
        },

        keyAbilities: [
          "Foresight: See 6 seconds into the future, gaining advantage on your next action. Take 1d6 psychic damage and +2 Omen Debt.",
          "Shared Vision: Grant an ally advantage on their next roll by showing them the future. Take 1d4 psychic damage and +1 Omen Debt.",
          "Inevitable Outcome: Declare an attack will hit or miss — it does. Take 2d6 psychic damage and +3 Omen Debt. Once per long rest.",
        ],

        recommendedFor:
          "Players who enjoy tactical planning and making accurate predictions",
      },

      { id : "truthseeker",
        name: "Truthseeker",
        icon: "Radiant/Radiant Beam",
        color: "#FFD700",
        theme: "Truth Through Blood Sacrifice",

        description: `Truthseekers do not uncover secrets gently. They rip them from the fabric of reality like teeth from a jaw, and reality screams every time. Every falsehood stripped, every lie exposed, every hidden weakness dragged into the light -- each one leaves a mark on the Truthseeker that no amount of rest can heal. Their gift is knowing exactly how to destroy their enemies. Their curse is knowing it cost a piece of their own soul to learn.`,

        playstyle:
          "Information warfare, enemy debilitation, weakness exploitation, unmatched out-of-combat investigation",

        strengths: [
          "See enemy HP, buffs, resistances, and active cooldowns mid-combat",
          "Strip enemy buffs, immunities, and concealment",
          "Expose vulnerabilities that grant allies advantage and bonus damage",
          "Unmatched out-of-combat investigation (detect lies, read objects, see through deceptions)",
        ],

        weaknesses: [
          "Relies on enemies having secrets to expose (less effective against mindless foes)",
          "Limited direct damage — empowers allies instead",
          "Requires an action to study enemies before exploiting weaknesses",
          "Out-of-combat abilities don't help in pure slugfests",
          "Each revealed truth reduces max HP by 3 (returns on long rest)",
        ],

        mindlessFallback:
          "Against mindless or instinct-driven creatures (undead, constructs, beasts), Unmask and Reveal Weakness instead reveal type-based vulnerabilities: undead take +1d6 radiant from your allies, constructs suffer +1d6 force, beasts grant allies advantage on intimidation checks.",

        specPassive: {
          name: "All-Seeing Eye",
          description:
            "Auto-detect lies and falsehoods within 30 ft. Each revealed truth adds +1 Omen Debt and reduces your max HP by 3 (returns on long rest). In combat: when you use an action to study a creature, you see its HP, active buffs, resistances, and abilities on cooldown.",
        },

        keyAbilities: [
          "Unmask: Strip one buff or immunity from a studied target. Take 1d6 psychic damage and +2 Omen Debt. Max HP reduced by 3.",
          "Reveal Weakness: Expose a target's vulnerability — attacks against them gain advantage and deal +1d6 damage for 3 rounds. Take 1d6 psychic damage and +2 Omen Debt. Max HP reduced by 3.",
          "Exploit Truth: Deal psychic damage to a target equal to the number of debuffs currently affecting them ×2d6. Take 2d6 psychic damage and +3 Omen Debt. Max HP reduced by 6.",
        ],

        combatLoop:
          "Study enemy (learn secrets) → Unmask (strip buffs) → Reveal Weakness (expose vulnerability) → Allies exploit the exposed target",

        recommendedFor:
          "Players who love turning knowledge into power, dismantling enemy strategies, and making allies devastating",
      },

      { id : "fateseer",
        name: "Fateseer",
        icon: "Arcane/Ebon Blaze",
        color: "#FF1493",
        theme: "Fate Manipulation Through Self-Mutilation",

        description: `Fateseers do not simply see the future -- they reach into it and twist. But fate is barbed wire, and every manipulation tears something loose. They cannot alter what they have not foreseen, and every foresight carries a toll. This is what separates them from the Fate Weaver: the Fate Weaver bends chance with arithmetic. The Fateseer bends fate with their own shattered nervous system. The outcomes are the same. The price is not.`,

        playstyle:
          "Predict outcomes → Accumulate Omen Debt to reshape what you predicted → Set fate triggers for future events",

        strengths: [
          "Fate manipulation is gated through correct predictions (rewarding accuracy)",
          'Can pre-place "fate triggers" — conditional effects that fire when predicted events occur',
          "Echo correct predictions to repeat their effects",
          "Strongest late-game fate control when prediction accuracy is high",
        ],

        weaknesses: [
          "Cannot manipulate fate without first predicting it — vulnerable when predictions fail",
          "Requires prediction accuracy to unlock manipulation (high skill ceiling)",
          "Less immediate impact than specs that don't depend on predictions",
          "Force damage recoil equals the amount you changed a die result by",
        ],

        failedPredictionFallback:
          "On a failed prediction, your timeline flatlines, preventing you from triggering Premonition or using prediction-conditional abilities. However, once per long rest, you may activate your Fate Anchor: suffer 2d6 + Spirit modifier force damage as a reaction to treat the prediction as a partial success (avoiding Failed Prophecy backlash and allowing one prediction-conditional cast).",

        specPassive: {
          name: "Premonition",
          description:
            "When you manipulate a die roll, take force damage equal to the amount you changed the result by. +1 Omen Debt. Once per round, when one of your predictions resolves as correct, you may immediately apply one fate effect (reroll, ±1d6, or advantage/disadvantage) related to that prediction.",
        },

        fateAnchor: {
          name: "Fate Anchor",
          description: "Once per long rest, take 2d6 + Spirit modifier force damage to salvage a failed prediction, avoiding backlash and allowing one prediction-conditional action.",
          mechanicsText: "Once per long rest, as a reaction to a failed prediction, suffer 2d6 + Spirit modifier force damage to treat it as a partial success, skipping Failed Prophecy backlash and enabling one prediction-conditional ability."
        },

        keyAbilities: [
          'Fate Trigger: Place a conditional effect — "When X happens, Y occurs." Triggers last until used or 1 minute. Take 1d6 force damage and +2 Omen Debt per trigger.',
          "Fate Echo: When a correct prediction resolves, repeat its effect on a new target for free. Take 1d6 force damage and +2 Omen Debt.",
          "Destiny Lock: After a correct precise prediction, guarantee the predicted outcome is maximized. Take 2d6 force damage and +3 Omen Debt.",
        ],

        combatLoop:
          "Predict an outcome → If correct, trigger Premonition for free fate effect → Place Fate Triggers for future contingencies → Echo successful predictions to double impact",

        recommendedFor:
          "Players who want the Oracle's prediction system to be the engine that drives ALL their power — high skill ceiling, enormous payoff",
      },
    ],
  },

  // Spells - normalized Level 1-10 JSON spell list
  exampleSpells: [
    // ===== SEER SPECIALIZATION =====
    { id : "oracle_foresight",
      name: "Foresight",
      description: "Peer 6 seconds into the future to see the outcome of your next action, granting you perfect clarity.",
      spellType: "ACTION",
      icon: "Utility/Watchful Eye",
      level: 2,
      specialization: "seer",

      typeConfig: {
        school: "psychic",
        icon: "Utility/Watchful Eye",
        tags: ["seer", "advantage", "self_buff", "omen"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
        targetRestrictions: ["self"]
      },

      resourceCost: {
        actionPoints: 1,
        mana: 8,
        selfHarm: {
          hpCost: "1d6",
          omenDebt: 2,
          type: "psychic",
          description: "Take 1d6 psychic damage and accumulate 2 Omen Debt",
        },
        components: ["verbal", "somatic"],
      },

      durationConfig: {
        durationType: "rounds",
        durationValue: 1,
        durationUnit: "rounds",
      },

      resolution: "AUTOMATIC",
      effectTypes: ["buff"],

      buffConfig: {
        buffType: "combatAdvantage",
        effects: [
          { id : "prophetic_foresight",
            name: "Foresight Clarity",
            description: "Gain advantage on your next attack roll, saving throw, or ability check within 1 round.",
            mechanicsText: "Gain advantage on next attack, save, or check within 1 round."
          }
        ],
        durationType: "rounds",
        durationValue: 1,
        durationUnit: "rounds"
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 1
      },

      tags: ["seer", "advantage", "self_buff", "omen"],
    },

    { id : "oracle_shared_vision",
      name: "Shared Vision",
      description: "Show an ally a glimpse of the future, guiding their actions toward success.",
      spellType: "ACTION",
      icon: "Radiant/Divine Radiance",
      level: 1,
      specialization: "seer",

      typeConfig: {
        school: "psychic",
        icon: "Radiant/Divine Radiance",
        tags: ["seer", "buff", "ally_buff", "reaction", "omen"],
        castTime: 1,
        castTimeType: "REACTION",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: ["ally"],
        maxTargets: 1,
        requiresLineOfSight: true,
      },

      resourceCost: {
        actionPoints: 1,
        mana: 5,
        selfHarm: {
          hpCost: "1d4",
          omenDebt: 1,
          type: "psychic",
          description: "Take 1d4 psychic damage and accumulate 1 Omen Debt",
        },
        components: ["verbal", "somatic"],
      },

      resolution: "AUTOMATIC",
      effectTypes: ["buff"],

      buffConfig: {
        buffType: "combatAdvantage",
        effects: [
          { id : "guided_future",
            name: "Guided Future",
            description: "Target ally gains advantage on their next d20 roll.",
            mechanicsText: "Ally gains advantage on next d20 roll."
          }
        ],
        durationType: "rounds",
        durationValue: 1,
        durationUnit: "rounds"
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 0
      },

      tags: ["seer", "ally_buff", "reaction", "omen"],
    },

    { id : "oracle_prophecy_of_doom",
      name: "Prophecy of Doom",
      description: "Declare a prophecy of ruin on an enemy. They must resist the terrifying vision or be cursed with impending catastrophe.",
      spellType: "ACTION",
      icon: "Necrotic/Necrotic Skull",
      level: 4,
      specialization: "seer",

      typeConfig: {
        school: "psychic",
        icon: "Necrotic/Necrotic Skull",
        tags: ["seer", "curse", "debuff", "damage", "psychic", "omen"],
        castTime: 1,
        castTimeType: "ACTION",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: ["enemy"],
        maxTargets: 1,
        requiresLineOfSight: true,
      },

      resourceCost: {
        actionPoints: 2,
        mana: 18,
        selfHarm: {
          hpCost: "1d6",
          omenDebt: 2,
          type: "psychic",
          description: "Take 1d6 psychic damage and accumulate 2 Omen Debt",
        },
        components: ["verbal", "somatic"],
      },

      durationConfig: {
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds"
      },

      resolution: "DICE",
      effectTypes: ["debuff", "damage"],

      damageConfig: {
        formula: "3d6 + intelligence",
        damageTypes: ["psychic"],
        resolution: "DICE",
        savingThrow: {
          ability: "spirit",
          difficultyClass: 15,
          saveOutcome: "negates"
        }
      },

      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          { id : "prophesied_doom",
            name: "Prophesied Doom",
            description: "Cursed with a dire prophecy. The target has disadvantage on all attack rolls. If the predicted trigger occurs, they take an additional 2d6 psychic damage.",
            mechanicsText: "Disadvantage on attack rolls. Takes +2d6 psychic damage if prediction triggers."
          }
        ],
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds",
        savingThrow: {
          ability: "spirit",
          difficultyClass: 15,
          saveOutcome: "negates"
        }
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 2
      },

      tags: ["seer", "curse", "prediction", "psychic", "omen"],
    },

    // ===== TRUTHSEEKER SPECIALIZATION =====
    { id : "oracle_reveal_truth",
      name: "Reveal Truth",
      description: "Compel a creature to speak only truth. The target must answer one question honestly, unable to lie or mislead.",
      spellType: "ACTION",
      icon: "Radiant/Radiant Beam",
      level: 3,
      specialization: "truthseeker",

      typeConfig: {
        school: "psychic",
        icon: "Radiant/Radiant Beam",
        tags: ["truthseeker", "interrogation", "social", "omen"],
        castTime: 1,
        castTimeType: "ACTION",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
        targetRestrictions: ["enemy"],
        maxTargets: 1,
        requiresLineOfSight: true,
      },

      resourceCost: {
        actionPoints: 2,
        mana: 15,
        selfHarm: {
          hpCost: "1d6",
          omenDebt: 2,
          type: "psychic",
          description: "Take 1d6 psychic damage and accumulate 2 Omen Debt",
        },
        components: ["verbal", "somatic"],
      },

      durationConfig: {
        durationType: "rounds",
        durationValue: 10,
        durationUnit: "rounds"
      },

      resolution: "SAVE",
      effectTypes: ["debuff"],

      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          { id : "compelled_truth",
            name: "Compelled Truth",
            description: "Target must answer one question you ask with complete honesty, unable to lie, omit crucial facts, or speak in riddles.",
            mechanicsText: "Compelled to answer one question honestly. Cannot lie or omit facts."
          }
        ],
        durationType: "rounds",
        durationValue: 10,
        durationUnit: "rounds",
        savingThrow: {
          ability: "spirit",
          difficultyClass: 15,
          saveOutcome: "negates"
        }
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 2
      },

      tags: ["truthseeker", "interrogation", "social", "omen"],
    },

    { id : "oracle_past_sight",
      name: "Past Sight",
      description: "Touch an object or location to witness its history, seeing events that transpired here.",
      spellType: "ACTION",
      icon: "Psychic/Mind Read",
      level: 2,
      specialization: "truthseeker",

      typeConfig: {
        school: "psychic",
        icon: "Psychic/Mind Read",
        tags: ["truthseeker", "ritual", "investigation", "omen"],
        castTime: 1,
        castTimeType: "ACTION"
      },

      targetingConfig: {
        targetingType: "touch",
        rangeType: "touch",
        targetRestrictions: ["any"]
      },

      resourceCost: {
        actionPoints: 2,
        mana: 12,
        selfHarm: {
          hpCost: "1d6",
          omenDebt: 2,
          type: "psychic",
          description: "Take 1d6 psychic damage and accumulate 2 Omen Debt",
        },
        components: ["verbal", "somatic"],
      },

      durationConfig: {
        durationType: "rounds",
        durationValue: 100, // Roughly 10 minutes
        durationUnit: "rounds"
      },

      resolution: "AUTOMATIC",
      effectTypes: ["utility"],

      utilityConfig: {
        utilityType: "fate_manipulation",
        selectedEffects: [
          { id : "historical_sight",
            name: "Historical Clairvoyance",
            description: "Witness key events, creatures, and conversations within 10 feet of the target over the past 24 hours. Each key truth revealed drains 3 max HP permanently for the day and adds 1 Omen Debt."
          }
        ]
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 3
      },

      tags: ["truthseeker", "ritual", "investigation", "omen"],
    },

    { id : "oracle_piercing_gaze",
      name: "Piercing Gaze",
      description: "Your eyes glow with pale, porcelain light, seeing through all deceptions, illusions, and concealment.",
      spellType: "ACTION",
      icon: "Radiant/Enlightened Vision",
      level: 3,
      specialization: "truthseeker",

      typeConfig: {
        school: "psychic",
        icon: "Radiant/Enlightened Vision",
        tags: ["truthseeker", "detection", "anti_deception", "omen"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        rangeDistance: 60,
        targetRestrictions: ["any"]
      },

      resourceCost: {
        actionPoints: 2,
        mana: 14,
        selfHarm: {
          hpCost: "1d6",
          omenDebt: 2,
          type: "psychic",
          description: "Take 1d6 psychic damage and accumulate 2 Omen Debt",
        },
        components: ["verbal", "somatic"],
      },

      durationConfig: {
        durationType: "rounds",
        durationValue: 10, // 1 minute
        durationUnit: "rounds"
      },

      resolution: "AUTOMATIC",
      effectTypes: ["buff"],

      buffConfig: {
        buffType: "triggeredEffect",
        effects: [
          { id : "truesight_active",
            name: "Porcelain Sight",
            description: "See through all falsehoods, illusions, shapechangers, and invisibility within 60 feet. Automatically reveals hidden threats.",
            mechanicsText: "True sight 60ft. See shapechangers, invisible targets, and illusions."
          }
        ],
        durationType: "rounds",
        durationValue: 10,
        durationUnit: "rounds"
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 2
      },

      tags: ["truthseeker", "detection", "anti_deception", "omen"],
    },

    // ===== FATESEER SPECIALIZATION =====
    { id : "oracle_twist_fate",
      name: "Read the Threads",
      description: "Reveal the immediate thread of destiny surrounding a creature. You do not alter the roll, you merely expose what fate has decided before anyone else can act.",
      spellType: "REACTION",
      icon: "Utility/All Seeing Eye",
      level: 2,
      specialization: "fateseer",

      typeConfig: {
        school: "psychic",
        icon: "Utility/All Seeing Eye",
        tags: ["fateseer", "reaction", "information", "omen"],
        castTime: 1,
        castTimeType: "REACTION",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: ["any"],
        maxTargets: 1,
        requiresLineOfSight: true,
      },

      resourceCost: {
        actionPoints: 1,
        mana: 8,
        selfHarm: {
          hpCost: "1d6",
          omenDebt: 2,
          type: "psychic",
          description: "Take 1d6 psychic damage and accumulate 2 Omen Debt",
        },
        components: ["verbal", "somatic"],
      },

      resolution: "AUTOMATIC",
      effectTypes: ["utility"],

      utilityConfig: {
        utilityType: "fate_manipulation",
        selectedEffects: [
          { id : "expose_fate_thread",
            name: "Expose Roll",
            description: "Reveal the exact result of the target's roll and whether they succeeded or failed before the DM announces it. Also reveals their lowest resistance or current HP."
          }
        ]
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 0
      },

      tags: ["fateseer", "reaction", "information", "prediction-conditional", "omen"],
    },

    { id : "oracle_sever_thread",
      name: "Sever Thread",
      description: "Having predicted a massive twist in time, you sever the thread of a critical outcome, collapsing a guaranteed critical or disaster into a normal event.",
      spellType: "REACTION",
      icon: "Necrotic/Drain Soul",
      level: 4,
      specialization: "fateseer",

      typeConfig: {
        school: "psychic",
        icon: "Necrotic/Drain Soul",
        tags: ["fateseer", "reaction", "critical", "manipulation", "omen"],
        castTime: 1,
        castTimeType: "REACTION",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: ["any"],
        maxTargets: 1,
        requiresLineOfSight: true,
      },

      resourceCost: {
        actionPoints: 2,
        mana: 15,
        selfHarm: {
          hpCost: "1d6",
          omenDebt: 2,
          type: "psychic",
          description: "Take 1d6 psychic damage and accumulate 2 Omen Debt",
        },
        components: ["verbal", "somatic"],
      },

      resolution: "AUTOMATIC",
      effectTypes: ["utility"],

      utilityConfig: {
        utilityType: "fate_manipulation",
        selectedEffects: [
          { id : "collapse_critical",
            name: "Critical Collapse",
            description: "Reaction when a creature rolls a Natural 20 or Natural 1. Shift the Natural 20 to a Natural 19 (non-critical), or the Natural 1 to a Natural 2 (non-critical failure)."
          }
        ]
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 1
      },

      tags: ["fateseer", "reaction", "critical", "manipulation", "prediction-conditional", "omen"],
    },

    { id : "oracle_destiny_lock",
      name: "Destiny Lock",
      description: "Lock a creature's fate after a correct precise prediction. You force the timeline to bend and maximize a chosen outcome, making success absolute.",
      level: 7,
      spellType: "ACTION",
      icon: "Force/Force Field",
      specialization: "fateseer",

      typeConfig: {
        school: "psychic",
        icon: "Force/Force Field",
        tags: ["fateseer", "guaranteed_outcome", "omen", "level_7"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: ["any"],
        maxTargets: 1,
        requiresLineOfSight: true,
      },

      resourceCost: {
        actionPoints: 3,
        mana: 30,
        selfHarm: {
          hpCost: "2d6",
          omenDebt: 3,
          type: "psychic",
          description: "Take 2d6 psychic damage and accumulate 3 Omen Debt",
        },
        components: ["verbal", "somatic", "material"],
        materialComponents: "A golden thread worth 100gp",
      },

      durationConfig: {
        durationType: "rounds",
        durationValue: 1,
        durationUnit: "rounds"
      },

      resolution: "AUTOMATIC",
      effectTypes: ["utility"],

      utilityConfig: {
        utilityType: "fate_manipulation",
        selectedEffects: [
          { id : "lock_outcome",
            name: "Absolute Outcome Lock",
            description: "The next attack roll made by or against the target automatically succeeds as a critical hit, or the next saving throw automatically succeeds or fails (your choice)."
          }
        ]
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 3
      },

      tags: ["fateseer", "guaranteed_outcome", "prediction-conditional", "omen"],
    },

    // ===== NEW TRUTHSEEKER COMBAT SPELLS =====
    { id : "oracle_unmask",
      name: "Unmask",
      description: "Pierce through a target's defenses, stripping one active magical buff, elemental immunity, or concealment effect from their timeline.",
      level: 2,
      spellType: "ACTION",
      icon: "Psychic/Mind Read",
      specialization: "truthseeker",

      typeConfig: {
        school: "psychic",
        icon: "Psychic/Mind Read",
        tags: ["truthseeker", "debuff", "strip", "level_2"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: ["enemy"],
        maxTargets: 1,
      },

      resourceCost: {
        actionPoints: 1,
        mana: 10,
        selfHarm: {
          hpCost: "1d6",
          omenDebt: 2,
          type: "psychic",
          description: "Take 1d6 psychic damage and accumulate 2 Omen Debt. Reduce maximum HP by 3.",
        },
        components: ["verbal", "somatic"],
      },

      resolution: "SAVE",
      effectTypes: ["debuff"],

      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          { id : "unmasked_timeline",
            name: "Unmasked defenses",
            description: "Stripped of one buff, immunity, or concealment. On a successful Spirit save, the stripped buff returns after 1 round.",
            mechanicsText: "Removes one active buff, immunity, or concealment. Spirit save restores it in 1 round."
          }
        ],
        durationType: "rounds",
        durationValue: 4,
        durationUnit: "rounds",
        savingThrow: {
          ability: "spirit",
          difficultyClass: 14,
          saveOutcome: "reduced_duration"
        }
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 2
      },

      tags: ["truthseeker", "debuff", "strip", "level_2"],
    },

    { id : "oracle_past_sins",
      name: "Past Sins",
      description: "Channel the weight of a target's hidden past against them. The more debuffs and exposed weaknesses they carry, the more devastating this chronal backlash.",
      level: 5,
      spellType: "ACTION",
      icon: "Psychic/Agonizing Scream",
      specialization: "truthseeker",

      typeConfig: {
        school: "psychic",
        icon: "Psychic/Agonizing Scream",
        tags: ["truthseeker", "damage", "psychic", "scaling", "level_5"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: ["enemy"],
        maxTargets: 1,
      },

      resourceCost: {
        actionPoints: 1,
        mana: 20,
        selfHarm: {
          hpCost: "2d6",
          omenDebt: 3,
          type: "psychic",
          description: "Take 2d6 psychic damage and accumulate 3 Omen Debt",
        },
        components: ["verbal"],
      },

      resolution: "DICE",
      effectTypes: ["damage"],

      damageConfig: {
        formula: "2d6 per active debuff on target (maximum 8d6)",
        damageTypes: ["psychic"],
        resolution: "DICE",
        savingThrow: {
          ability: "spirit",
          difficultyClass: 16,
          saveOutcome: "half_damage"
        }
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 3
      },

      tags: ["truthseeker", "damage", "psychic", "scaling", "level_5"],
    },

    // ===== UNIVERSAL ABILITIES =====
    { id : "oracle_detect_fate",
      name: "Detect Fate",
      description: "Sense the weight of destiny on nearby entities and objects, revealing who and what are bound to upcoming timelines.",
      spellType: "ACTION",
      icon: "Healing/Prayer",
      level: 1,
      specialization: "universal",

      typeConfig: {
        school: "psychic",
        icon: "Healing/Prayer",
        tags: ["universal", "detection", "utility", "omen"],
        castTime: 1,
        castTimeType: "ACTION",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        rangeDistance: 30,
        targetRestrictions: ["any"]
      },

      resourceCost: {
        actionPoints: 2,
        mana: 8,
        selfHarm: {
          hpCost: "1d4",
          omenDebt: 1,
          type: "psychic",
          description: "Take 1d4 psychic damage and accumulate 1 Omen Debt",
        },
        components: ["verbal", "somatic"],
      },

      durationConfig: {
        durationType: "rounds",
        durationValue: 100, // 10 minutes
        durationUnit: "rounds"
      },

      resolution: "AUTOMATIC",
      effectTypes: ["utility"],

      utilityConfig: {
        utilityType: "fate_manipulation",
        selectedEffects: [
          { id : "sense_fate_lines",
            name: "Sense Fate Lines",
            description: "See glowing threads of destiny connecting creatures. Brighter threads indicate critical importance to future narrative events (key NPCs, trap triggers, plot objects)."
          }
        ]
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 1
      },

      tags: ["universal", "detection", "utility", "omen"],
    },

    { id : "oracle_omen_reading",
      name: "Omen Reading",
      description: "Perform a complex scrying ritual to read the warnings embedded in your surroundings.",
      spellType: "ACTION",
      icon: "Necrotic/Skull 2",
      level: 2,
      specialization: "universal",

      typeConfig: {
        school: "psychic",
        icon: "Necrotic/Skull 2",
        tags: ["universal", "ritual", "omen", "prediction"],
        castTime: 1,
        castTimeType: "ACTION", // Modeled as ritual in text
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
        targetRestrictions: ["self"]
      },

      resourceCost: {
        actionPoints: 2,
        mana: 12,
        selfHarm: {
          hpCost: "1d6",
          omenDebt: 2,
          type: "psychic",
          description: "Take 1d6 psychic damage and accumulate 2 Omen Debt",
        },
        components: ["verbal", "somatic", "material"],
        materialComponents: "Scrying tools (bones, runes, or cards)",
      },

      durationConfig: {
        durationType: "rounds",
        durationValue: 600, // 1 hour
        durationUnit: "rounds"
      },

      resolution: "AUTOMATIC",
      effectTypes: ["buff"],

      buffConfig: {
        buffType: "triggeredEffect",
        effects: [
          { id : "omens_read",
            name: "Foresight Omens",
            description: "Gain Cryptic Insight (GM provides 3 vague clues about upcoming encounters) and advantage on all Initiative rolls for 1 hour. Each omen that comes to pass adds 1 Omen Debt.",
            mechanicsText: "Gain 3 clues from GM. Advantage on initiative rolls for 1 hour."
          }
        ],
        durationType: "rounds",
        durationValue: 600,
        durationUnit: "rounds"
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 3
      },

      tags: ["universal", "ritual", "omen", "prediction"],
    },

    // ===== LEVEL 6 SPELLS =====
    { id : "oracle_future_strike",
      name: "Future Strike",
      description: "Strike an enemy's future coordinates before they can even perceive the attack. This strike cannot be blocked or evaded.",
      level: 6,
      spellType: "ACTION",
      icon: "Radiant/Divine Blessing",
      specialization: "seer",

      typeConfig: {
        school: "psychic",
        icon: "Radiant/Divine Blessing",
        tags: ["seer", "damage", "psychic", "guaranteed_hit", "level_6"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: ["enemy"],
        maxTargets: 1,
      },

      resourceCost: {
        actionPoints: 1,
        mana: 35,
        selfHarm: {
          hpCost: "2d6",
          omenDebt: 3,
          type: "psychic",
          description: "Take 2d6 psychic damage and accumulate 3 Omen Debt",
        },
        components: ["somatic"],
      },

      resolution: "DICE",
      effectTypes: ["damage"],

      damageConfig: {
        formula: "6d8 + intelligence",
        damageTypes: ["psychic"],
        resolution: "DICE",
        specialRules: "This attack automatically hits. It cannot be dodged, blocked, or reduced by mundane armor ratings."
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 3
      },

      tags: ["seer", "damage", "psychic", "guaranteed_hit", "level_6"],
    },

    { id : "oracle_reveal_weakness",
      name: "Reveal Weakness",
      description: "Peer into a target's timeline to expose a fatal weakness, leaving them completely vulnerable to all damage.",
      level: 3,
      spellType: "ACTION",
      icon: "Utility/All Seeing Eye",
      specialization: "truthseeker",

      typeConfig: {
        school: "psychic",
        icon: "Utility/All Seeing Eye",
        tags: ["truthseeker", "debuff", "vulnerability", "level_3"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: ["enemy"],
        maxTargets: 1,
      },

      resourceCost: {
        actionPoints: 1,
        mana: 14,
        selfHarm: {
          hpCost: "1d6",
          omenDebt: 2,
          type: "psychic",
          description: "Take 1d6 psychic damage and accumulate 2 Omen Debt",
        },
        components: ["verbal"],
      },

      resolution: "SAVE",
      effectTypes: ["debuff"],

      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          { id : "revealed_weakness",
            name: "Revealed Weakness",
            description: "The target takes 50% more damage from all sources for 4 rounds (or 2 rounds if the save succeeds).",
            statusEffect: {
              type: "vulnerability",
              vulnerabilityType: "all",
              percentage: 50
            },
            statPenalty: {
              stat: "damage_taken",
              value: 50,
              magnitudeType: "percentage_increase",
            },
            mechanicsText: "50% increased damage from all sources for 4 rounds (2 on save).",
          },
        ],
        durationType: "rounds",
        durationValue: 4,
        durationUnit: "rounds",
        savingThrow: {
          ability: "spirit",
          difficultyClass: 16,
          saveOutcome: "halves_duration"
        }
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 4
      },

      tags: ["truthseeker", "debuff", "vulnerability", "level_3"],
    },

    { id : "oracle_destiny_shift",
      name: "Destiny Shift",
      description: "Having foreseen this outcome, you bend time backward to force a critical reroll, choosing which timeline is applied.",
      level: 6,
      spellType: "REACTION",
      icon: "Arcane/Rewind Time",
      specialization: "fateseer",

      typeConfig: {
        school: "psychic",
        icon: "Arcane/Rewind Time",
        tags: ["fateseer", "utility", "reroll", "level_6", "prediction-conditional"],
        castTime: 1,
        castTimeType: "REACTION",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: ["any"],
        maxTargets: 1,
      },

      resourceCost: {
        actionPoints: 0,
        mana: 20,
        selfHarm: {
          hpCost: "2d6",
          omenDebt: 3,
          type: "psychic",
          description: "Take 2d6 psychic damage and accumulate 3 Omen Debt",
        },
        components: ["verbal"],
      },

      resolution: "AUTOMATIC",
      effectTypes: ["utility"],

      utilityConfig: {
        utilityType: "fate_manipulation",
        selectedEffects: [
          { id : "force_reroll",
            name: "Forced Timeline Shift",
            description: "Force any creature within 60 feet to reroll a d20 roll. You choose which roll result is applied. Requires a correct prediction this combat."
          }
        ]
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 2
      },

      tags: ["fateseer", "utility", "reroll", "level_6", "prediction-conditional"],
    },

    // ===== LEVEL 7 SPELLS =====
    { id : "oracle_prescient_dodge",
      name: "Prescient Dodge",
      description: "See incoming attacks before they occur, contorting your body out of harm's way with flawless agility.",
      level: 7,
      spellType: "ACTION",
      icon: "Nature/Ethereal Bird",
      specialization: "seer",

      typeConfig: {
        school: "psychic",
        icon: "Nature/Ethereal Bird",
        tags: ["seer", "buff", "evasion", "level_7"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
        targetRestrictions: ["self"]
      },

      resourceCost: {
        actionPoints: 0,
        mana: 18,
        selfHarm: {
          hpCost: "2d6",
          omenDebt: 3,
          type: "psychic",
          description: "Take 2d6 psychic damage and accumulate 3 Omen Debt",
        },
        components: ["somatic"],
      },

      resolution: "AUTOMATIC",
      effectTypes: ["buff"],

      buffConfig: {
        buffType: "damageMitigation",
        effects: [
          { id : "evasive_insight",
            name: "Prescient Evasion",
            description: "Enemies have disadvantage on all attack rolls against you. You automatically succeed on all Agility saving throws.",
            mechanicsText: "Enemies have disadvantage on attack rolls. Auto-succeed Agility saves."
          }
        ],
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds",
        concentrationRequired: true
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 5
      },

      tags: ["seer", "buff", "evasion", "level_7"],
    },

    { id : "oracle_expose_secrets",
      name: "Expose Secrets",
      description: "Expose a creature's hidden timeline, shattering their tactical advantages and revealing their complete history to your allies.",
      level: 7,
      spellType: "ACTION",
      icon: "Psychic/Mind Roar",
      specialization: "truthseeker",

      typeConfig: {
        school: "psychic",
        icon: "Psychic/Mind Roar",
        tags: ["truthseeker", "debuff", "damage", "level_7"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: ["enemy"],
        maxTargets: 1,
      },

      resourceCost: {
        actionPoints: 2,
        mana: 28,
        selfHarm: {
          hpCost: "2d6",
          omenDebt: 3,
          type: "psychic",
          description: "Take 2d6 psychic damage and accumulate 3 Omen Debt. Reduce max HP by 6.",
        },
        components: ["verbal", "somatic"],
      },

      resolution: "DICE",
      effectTypes: ["debuff", "damage"],

      damageConfig: {
        formula: "12d6 + intelligence",
        damageTypes: ["psychic"],
        resolution: "DICE",
        savingThrow: {
          ability: "spirit",
          difficultyClass: 17,
          saveOutcome: "half_damage"
        }
      },

      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          { id : "secrets_exposed",
            name: "Secrets Exposed",
            description: "All attacks against target gain advantage. The target cannot benefit from invisibility, cover, or concealment for 1 minute.",
            mechanicsText: "All attacks gain advantage. Target loses invisibility, cover, and concealment."
          }
        ],
        durationType: "rounds",
        durationValue: 10,
        durationUnit: "rounds",
        savingThrow: {
          ability: "spirit",
          difficultyClass: 17,
          saveOutcome: "halves_duration"
        }
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 4
      },

      tags: ["truthseeker", "debuff", "damage", "level_7"],
    },

    { id : "oracle_threads_of_fate",
      name: "Threads of Fate",
      description: "Intertwine the destinies of up to four targets, binding their timelines so that what affects one cascades into all.",
      level: 7,
      spellType: "ACTION",
      icon: "Force/Force Shield",
      specialization: "fateseer",

      typeConfig: {
        school: "psychic",
        icon: "Force/Force Shield",
        tags: ["fateseer", "utility", "link", "level_7", "prediction-conditional"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area", // multi-target
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: ["any"],
        maxTargets: 4,
      },

      resourceCost: {
        actionPoints: 2,
        mana: 28,
        selfHarm: {
          hpCost: "2d6",
          omenDebt: 3,
          type: "psychic",
          description: "Take 2d6 psychic damage and accumulate 3 Omen Debt",
        },
        components: ["somatic"],
      },

      resolution: "AUTOMATIC",
      effectTypes: ["utility"],

      utilityConfig: {
        utilityType: "fate_manipulation",
        selectedEffects: [
          { id : "fate_link",
            name: "Fate Bind",
            description: "Link up to 4 targets for 1 minute. Any damage split, healing received, or status conditions applied to one target are instantly shared among all linked targets."
          }
        ]
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 5
      },

      tags: ["fateseer", "utility", "link", "level_7", "prediction-conditional"],
    },

    // ===== LEVEL 8 SPELLS =====
    { id : "oracle_perfect_foresight",
      name: "Perfect Foresight",
      description: "Gaze into a complete, unbroken timeline of the next round. You see every enemy's action before it is executed, moving with impossible foresight.",
      level: 8,
      spellType: "ACTION",
      icon: "Radiant/Divine Radiance",
      specialization: "seer",

      typeConfig: {
        school: "psychic",
        icon: "Radiant/Divine Radiance",
        tags: ["seer", "buff", "prediction", "level_8"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
        targetRestrictions: ["self"]
      },

      resourceCost: {
        actionPoints: 0,
        mana: 35,
        selfHarm: {
          hpCost: "3d6",
          omenDebt: 4,
          type: "psychic",
          description: "Take 3d6 psychic damage, lose 5 max HP, and accumulate 4 Omen Debt",
        },
        components: ["somatic"],
      },

      resolution: "AUTOMATIC",
      effectTypes: ["buff"],

      buffConfig: {
        buffType: "combatAdvantage",
        effects: [
          { id : "perfect_foresight_active",
            name: "Perfect Foresight",
            description: "You know all enemy actions for 1 round. Gain advantage on all rolls, and enemies suffer disadvantage on all attack rolls against you.",
            mechanicsText: "Know all enemy actions. Advantage on all rolls. Enemies have disadvantage against you."
          }
        ],
        durationType: "rounds",
        durationValue: 1,
        durationUnit: "rounds"
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 5
      },

      tags: ["seer", "buff", "prediction", "level_8"],
    },

    { id : "oracle_psychic_assault",
      name: "Psychic Assault",
      description: "Assault a creature's mind with the absolute weight of their darkest, unwritten futures, leaving them paralyzed with dread.",
      level: 8,
      spellType: "ACTION",
      icon: "Psychic/Agonizing Scream",
      specialization: "truthseeker",

      typeConfig: {
        school: "psychic",
        icon: "Psychic/Agonizing Scream",
        tags: ["truthseeker", "damage", "control", "psychic", "level_8"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 90,
        targetRestrictions: ["enemy"],
        maxTargets: 1,
      },

      resourceCost: {
        actionPoints: 2,
        mana: 50,
        selfHarm: {
          hpCost: "3d6",
          omenDebt: 4,
          type: "psychic",
          description: "Take 3d6 psychic damage, lose 5 max HP, and accumulate 4 Omen Debt",
        },
        components: ["verbal"],
      },

      resolution: "DICE",
      effectTypes: ["damage", "control"],

      damageConfig: {
        formula: "10d8 + intelligence",
        damageTypes: ["psychic"],
        resolution: "DICE",
        savingThrow: {
          ability: "spirit",
          difficultyClass: 18,
          saveOutcome: "half_damage"
        }
      },

      controlConfig: {
        controlType: "incapacitation",
        effects: [
          { id : "psychic_paralysis",
            name: "Psychic Dread Stun",
            description: "Stunned with chronal terror for 2 rounds.",
            mechanicsText: "Stunned with terror for 2 rounds. Spirit DC 18 save negates."
          }
        ],
        duration: 2,
        durationUnit: "rounds",
        savingThrow: {
          ability: "spirit",
          difficultyClass: 18
        }
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 4
      },

      tags: ["truthseeker", "damage", "control", "psychic", "level_8"],
    },

    { id : "oracle_alter_destiny",
      name: "Alter Destiny",
      description: "Having predicted this outcome, you violently rewrite a single thread, completely changing the result of any active roll.",
      level: 8,
      spellType: "REACTION",
      icon: "Arcane/Rewind Time",
      specialization: "fateseer",

      typeConfig: {
        school: "arcane",
        icon: "Arcane/Rewind Time",
        tags: ["fateseer", "utility", "fate_control", "level_8", "prediction-conditional"],
        castTime: 1,
        castTimeType: "REACTION",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 120,
        targetRestrictions: ["any"],
        maxTargets: 1,
      },

      resourceCost: {
        actionPoints: 0,
        mana: 40,
        selfHarm: {
          hpCost: "3d6",
          omenDebt: 4,
          type: "psychic",
          description: "Take 3d6 psychic damage, lose 5 max HP, and accumulate 4 Omen Debt",
        },
        components: ["verbal"],
      },

      resolution: "AUTOMATIC",
      effectTypes: ["utility"],

      utilityConfig: {
        utilityType: "fate_manipulation",
        selectedEffects: [
          { id : "rewrite_roll",
            name: "Timeline Rewrite",
            description: "Change any active d20 roll result within 120 feet to any number you choose (1-20). Requires a correct specific/precise prediction."
          }
        ]
      },

      cooldownConfig: {
        cooldownType: "long_rest",
        cooldownValue: 1
      },

      tags: ["fateseer", "utility", "fate_control", "level_8", "prediction-conditional"],
    },

    // ===== LEVEL 9 SPELLS =====
    { id : "oracle_timeline_split",
      name: "Timeline Split",
      description: "Force the timeline to split in two, summoning a parallel copy of yourself to double your tactical impact.",
      level: 9,
      spellType: "ACTION",
      icon: "Arcane/Open Portal",
      specialization: "seer",

      typeConfig: {
        school: "arcane",
        icon: "Arcane/Open Portal",
        tags: ["seer", "summoning", "duplicate", "level_9"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
        targetRestrictions: ["self"]
      },

      resourceCost: {
        actionPoints: 2,
        mana: 50,
        selfHarm: {
          hpCost: "3d6",
          omenDebt: 4,
          type: "psychic",
          description: "Take 3d6 psychic damage, lose 5 max HP, and accumulate 4 Omen Debt",
        },
        components: ["verbal", "somatic"],
      },

      resolution: "AUTOMATIC",
      effectTypes: ["summoning"],

      summonConfig: {
        creatures: [
          { id : "timeline_duplicate",
            name: "Timeline Duplicate",
            description: "A perfect parallel copy of yourself. Can execute any spell you know for 3 rounds under independent control.",
            stats: {
              maxHp: "Same as caster",
              armor: "Same as caster",
              maxMana: "Same as caster"
            },
            config: {
              quantity: 1,
              duration: 3,
              durationUnit: "rounds",
              hasDuration: true,
              concentration: false,
              controlType: "independent",
              abilities: "Can cast any spell you know. Unshielded from feedback."
            }
          }
        ],
        duration: 3,
        durationUnit: "rounds"
      },

      cooldownConfig: {
        cooldownType: "long_rest",
        cooldownValue: 1
      },

      tags: ["seer", "summoning", "duplicate", "level_9"],
    },

    { id : "oracle_omniscience",
      name: "Omniscience",
      description: "Briefly tap into absolute chronal omniscience. Extract undeniable secrets of reality directly from the flow of time.",
      level: 9,
      spellType: "ACTION",
      icon: "Radiant/Radiant Glow",
      specialization: "truthseeker",

      typeConfig: {
        school: "psychic",
        icon: "Radiant/Radiant Glow",
        tags: ["truthseeker", "utility", "knowledge", "ritual", "level_9"],
        castTime: 10,
        castTimeType: "ACTION", // Modeled as ritual in text
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
        targetRestrictions: ["self"]
      },

      resourceCost: {
        actionPoints: 0,
        mana: 50,
        selfHarm: {
          hpCost: "3d6",
          omenDebt: 4,
          type: "psychic",
          description: "Take 3d6 psychic damage, lose 5 max HP, and accumulate 4 Omen Debt. Reduce max HP by 9.",
        },
        components: ["verbal", "somatic", "material"],
        materialComponents: "Rare, chronally-reactive incense worth 500gp",
      },

      resolution: "AUTOMATIC",
      effectTypes: ["utility"],

      utilityConfig: {
        utilityType: "fate_manipulation",
        selectedEffects: [
          { id : "absolute_omniscience",
            name: "Absolute Omniscience",
            description: "Ask the DM up to 3 questions. The DM must answer truthfully, completely, and without metaphorical veil, revealing any hidden trap, health total, or enemy intention."
          }
        ]
      },

      cooldownConfig: {
        cooldownType: "long_rest",
        cooldownValue: 1
      },

      tags: ["truthseeker", "utility", "knowledge", "ritual", "level_9"],
    },

    { id : "oracle_weave_destiny",
      name: "Weave Destiny",
      description: "Having foreseen all variables, you actively manipulate every thread of fate in a massive zone, forcing complete alignment with your predictions.",
      level: 9,
      spellType: "ACTION",
      icon: "Radiant/Divine Illumination",
      specialization: "fateseer",

      typeConfig: {
        school: "arcane",
        icon: "Radiant/Divine Illumination",
        tags: ["fateseer", "control", "fate", "ultimate", "level_9", "prediction-conditional"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        rangeDistance: 60,
        aoeShape: "circle",
        aoeSize: 60, // 60ft radius
        targetRestrictions: ["any"]
      },

      resourceCost: {
        actionPoints: 3,
        mana: 55,
        selfHarm: {
          hpCost: "3d6",
          omenDebt: 4,
          type: "psychic",
          description: "Take 3d6 psychic damage, lose 5 max HP, and accumulate 4 Omen Debt",
        },
        components: ["verbal", "somatic"],
      },

      resolution: "AUTOMATIC",
      effectTypes: ["control"],

      controlConfig: {
        controlType: "zone",
        effects: [
          { id : "destiny_weaving_active",
            name: "Weave Destiny",
            description: "For 1 round, you determine the exact outcome of every d20 roll within 60 feet. You choose success or failure for every attack, check, or save.",
            mechanicsText: "Choose success or failure for all rolls in 60ft for 1 round."
          }
        ],
        duration: 1,
        durationUnit: "rounds"
      },

      cooldownConfig: {
        cooldownType: "long_rest",
        cooldownValue: 1
      },

      tags: ["fateseer", "control", "fate", "ultimate", "level_9", "prediction-conditional"],
    },

    // ===== LEVEL 10 SPELLS =====
    { id : "oracle_future_self",
      name: "Future Self",
      description: "Tear open time to summon your future self—a godlike, immortal incarnation of your timeline's absolute peak.",
      level: 10,
      spellType: "ACTION",
      icon: "Force/Force Field",
      specialization: "seer",

      typeConfig: {
        school: "arcane",
        icon: "Force/Force Field",
        tags: ["seer", "summoning", "ultimate", "level_10"],
        castTime: 2,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 30,
        targetRestrictions: ["any"]
      },

      resourceCost: {
        actionPoints: 3,
        mana: 60,
        selfHarm: {
          hpCost: "3d6",
          omenDebt: 4,
          type: "psychic",
          description: "Take 3d6 psychic damage, lose 5 max HP, and accumulate 4 Omen Debt",
        },
        components: ["verbal", "somatic"],
      },

      resolution: "AUTOMATIC",
      effectTypes: ["summoning"],

      summonConfig: {
        creatures: [
          { id : "future_self_avatar",
            name: "Future Self",
            description: "An immortal version of yourself from a timeline where you reached peak chronal godhood.",
            stats: {
              maxHp: 200,
              armor: 25,
              maxMana: 100
            },
            config: {
              quantity: 1,
              duration: 5,
              durationUnit: "rounds",
              hasDuration: true,
              concentration: false,
              controlType: "independent",
              abilities: "Casts any spell you know at maximum power. Basic attacks deal 6d8 psychic damage."
            }
          }
        ],
        duration: 5,
        durationUnit: "rounds"
      },

      cooldownConfig: {
        cooldownType: "long_rest",
        cooldownValue: 1
      },

      tags: ["seer", "summoning", "ultimate", "level_10"],
    },

    { id : "oracle_absolute_truth",
      name: "Absolute Truth",
      description: "Reveal the absolute, terrifying truth of the cosmos, shattering the sanity of all enemies who look upon it.",
      level: 10,
      spellType: "ACTION",
      icon: "Radiant/Divine Blessing",
      specialization: "truthseeker",

      typeConfig: {
        school: "psychic",
        icon: "Radiant/Divine Blessing",
        tags: ["truthseeker", "damage", "control", "ultimate", "level_10"],
        castTime: 2,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        rangeDistance: 60,
        aoeShape: "circle",
        aoeSize: 60,
        targetRestrictions: ["enemy"]
      },

      resourceCost: {
        actionPoints: 3,
        mana: 60,
        selfHarm: {
          hpCost: "3d6",
          omenDebt: 4,
          type: "psychic",
          description: "Take 3d6 psychic damage, lose 5 max HP, and accumulate 4 Omen Debt",
        },
        components: ["verbal"],
      },

      resolution: "DICE",
      effectTypes: ["damage", "control"],

      damageConfig: {
        formula: "15d10 + intelligence * 2",
        damageTypes: ["psychic"],
        resolution: "DICE",
        savingThrow: {
          ability: "spirit",
          difficultyClass: 21,
          saveOutcome: "half_damage"
        }
      },

      controlConfig: {
        controlType: "incapacitation",
        effects: [
          { id : "absolute_insanity",
            name: "Crushed Sanity Stun",
            description: "Stunned by cosmic secrets. Cannot benefit from any magical protection or concealment.",
            mechanicsText: "Stunned. Target loses all active magical barriers and concealment."
          }
        ],
        duration: 1,
        durationUnit: "rounds",
        savingThrow: {
          ability: "charisma",
          difficultyClass: 18
        }
      },

      cooldownConfig: {
        cooldownType: "long_rest",
        cooldownValue: 1
      },

      tags: ["truthseeker", "damage", "control", "ultimate", "level_10"],
    },

    { id : "oracle_master_of_fate",
      name: "Master of Fate",
      description: "Merge with the chronal weave, becoming one with destiny. For 3 rounds, your power is absolute.",
      level: 10,
      spellType: "ACTION",
      icon: "Radiant/Radiant Glow",
      specialization: "fateseer",

      typeConfig: {
        school: "arcane",
        icon: "Radiant/Radiant Glow",
        tags: ["fateseer", "transformation", "ultimate", "level_10", "prediction-conditional"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
        targetRestrictions: ["self"]
      },

      resourceCost: {
        actionPoints: 3,
        mana: 60,
        selfHarm: {
          hpCost: "3d6",
          omenDebt: 4,
          type: "psychic",
          description: "Take 3d6 psychic damage, lose 5 max HP, and accumulate 4 Omen Debt",
        },
        components: ["verbal"],
      },

      resolution: "AUTOMATIC",
      effectTypes: ["transformation"],

      transformationConfig: {
        transformationType: "divine",
        targetType: "self",
        duration: 3,
        durationUnit: "rounds",
        power: "major",
        newForm: "Cosmic Timeweaver",
        description: "Transform into one with the fate threads, gaining massive attributes and temporal abilities. End of transformation inflicts 2 levels of exhaustion and +5 Omen Debt.",
        grantedAbilities: [
          { id : "fate_stats",
            name: "Cosmic Insight",
            description: "+5 to all attributes"
          },
          { id : "fate_control",
            name: "Fate Control",
            description: "Reroll any d20 roll up to 3 times per transformation."
          },
          { id : "fate_protection",
            name: "Fate Shield",
            description: "Once per transformation, negate a lethal blow completely."
          }
        ]
      },

      cooldownConfig: {
        cooldownType: "long_rest",
        cooldownValue: 1
      },

      tags: ["fateseer", "transformation", "ultimate", "level_10", "prediction-conditional"],
    },

    // ===== ZERO-RESOURCE FALLBACK =====
    { id : "oracle_fate_whisper_strike",
      name: "Fate's Whisper Strike",
      description: "Channel a sliver of prophetic energy into a basic strike. Costs no mana, but still fragments your timeline.",
      level: 0,
      spellType: "ACTION",
      icon: "Psychic/Mind Read",
      specialization: "universal",

      typeConfig: {
        school: "psychic",
        icon: "Psychic/Mind Read",
        tags: ["universal", "damage", "psychic", "fallback", "cantrip"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
        targetRestrictions: ["enemy"],
        maxTargets: 1,
      },

      resourceCost: {
        actionPoints: 1,
        selfHarm: {
          hpCost: "1d4",
          omenDebt: 1,
          type: "psychic",
          description: "Take 1d4 psychic damage and accumulate 1 Omen Debt",
        },
        components: ["verbal", "somatic"],
      },

      resolution: "DICE",
      effectTypes: ["damage"],

      damageConfig: {
        formula: "1d4 + intelligence",
        damageTypes: ["psychic"],
        resolution: "DICE",
        specialRules: "Always available. Generates Omen Debt and psychic self-harm on use."
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 0
      },

      tags: ["universal", "damage", "psychic", "fallback", "cantrip"],
    },

    // ===== ADDITIONAL LEVEL 1 SPELL =====
    { id : "oracle_divine_insight",
      name: "Divine Insight",
      description: "Gain a flash of prophetic insight about an enemy, revealing their upcoming movements to secure a flat bonus to attacks.",
      level: 1,
      spellType: "ACTION",
      specialization: "universal",

      typeConfig: {
        school: "psychic",
        icon: "Radiant/Divine Radiance",
        tags: ["buff", "insight", "universal"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 40,
        targetRestrictions: ["enemy"],
        maxTargets: 1,
      },

      resourceCost: {
        actionPoints: 1,
        mana: 10,
        selfHarm: {
          hpCost: "1d4",
          omenDebt: 1,
          type: "psychic",
          description: "Take 1d4 psychic damage and accumulate 1 Omen Debt",
        },
        components: ["verbal"],
      },

      resolution: "DICE",
      effectTypes: ["buff"],

      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          { id : "divine_insight_active",
            name: "Divine Insight",
            description: "Gain +2 flat bonus to attack rolls against the target for 3 rounds.",
            statModifier: {
              stat: "attack_rolls",
              magnitude: 2,
              magnitudeType: "flat",
            },
          },
        ],
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds"
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 0
      },

      tags: ["buff", "insight", "universal"],
    },

    // ===== ADDITIONAL LEVEL 3 SPELL =====
    { id : "oracle_prophetic_shield",
      name: "Prophetic Shield",
      description: "Foresight shows the trajectory of incoming strikes, allowing you to shield your vulnerable vessel with physical barriers.",
      level: 3,
      spellType: "ACTION",
      specialization: "universal",

      typeConfig: {
        school: "psychic",
        icon: "Force/Force Field",
        tags: ["buff", "defense", "prophecy", "universal"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
        targetRestrictions: ["self"]
      },

      resourceCost: {
        actionPoints: 1,
        mana: 18,
        selfHarm: {
          hpCost: "1d6",
          omenDebt: 2,
          type: "psychic",
          description: "Take 1d6 psychic damage and accumulate 2 Omen Debt",
        },
        components: ["verbal", "somatic"],
      },

      resolution: "DICE",
      effectTypes: ["buff"],

      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          { id : "prophetic_shield_active",
            name: "Prophetic Shield",
            description: "Gain +3 Armor and advantage on all saving throws for 4 rounds.",
            statModifier: {
              stat: "armor",
              magnitude: 3,
              magnitudeType: "flat",
            },
          },
        ],
        durationType: "rounds",
        durationValue: 4,
        durationUnit: "rounds"
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 3
      },

      tags: ["buff", "defense", "prophecy", "universal"],
    },

    // ===== ADDITIONAL LEVEL 4 SPELL =====
    { id : "oracle_fate_strike",
      name: "Fate Strike",
      description: "Strike with the raw force of a preordained blow. The damage is unavoidable, tearing through spatial boundaries.",
      level: 4,
      spellType: "ACTION",
      specialization: "universal",

      typeConfig: {
        school: "force",
        icon: "Radiant/Divine Blessing",
        tags: ["damage", "force", "guaranteed", "universal"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 50,
        targetRestrictions: ["enemy"],
        maxTargets: 1,
      },

      resourceCost: {
        actionPoints: 1,
        mana: 22,
        selfHarm: {
          hpCost: "1d6",
          omenDebt: 2,
          type: "psychic",
          description: "Take 1d6 psychic damage and accumulate 2 Omen Debt",
        },
        components: ["verbal", "somatic"],
      },

      resolution: "DICE",
      effectTypes: ["damage"],

      damageConfig: {
        formula: "5d8",
        damageTypes: ["force"],
        resolution: "DICE"
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 2
      },

      tags: ["damage", "force", "guaranteed", "universal"],
    },

    // ===== LEVEL 1 SIGNATURE ABILITY: CHRONO-WOUND =====
    { id : "oracle_chrono_wound",
      name: "Chrono-Wound",
      description: "Reach across time to absorb damage dealt to an ally within 60 feet. You take half the absorbed damage immediately and the other half over the next 2 rounds. The delayed damage cannot kill you — it drops you to 1 HP instead.",
      level: 1, // HARD-CODED AT LEVEL 1 AS PER DIRECTIVE
      spellType: "REACTION",
      icon: "Arcane/Rewind Time",
      specialization: "universal",

      typeConfig: {
        school: "force",
        icon: "Arcane/Rewind Time",
        tags: ["universal", "absorption", "chrono_wound", "level_1"],
        castTime: 1,
        castTimeType: "REACTION",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: ["ally"],
        maxTargets: 1,
        requiresLineOfSight: true,
      },

      resourceCost: {
        actionPoints: 1,
        mana: 20,
        selfHarm: {
          hpCost: "50% of absorbed damage immediately, 25% per round for 2 rounds",
          omenDebt: 3,
          type: "force",
          cantKillFromDelayed: true,
          description: "Absorb ally damage. Take half now, half over 2 rounds. Cannot die from delayed damage. +3 Omen Debt."
        },
        components: ["verbal", "somatic"],
      },

      resolution: "AUTOMATIC",
      effectTypes: ["damage"], // Absorbs and redistributes as self damage config

      tags: ["universal", "absorption", "chrono_wound", "level_1"],
    },

    // ===== PASSIVE: Failed Prophecy =====
    { id : "oracle_failed_prophecy",
      name: "Failed Prophecy",
      description: "When a prediction fails, accumulate +1 Omen Debt and take 2d6 psychic damage to self as the timeline snaps back. Your accuracy is your weapon — and your vulnerability.",
      level: 1,
      spellType: "PASSIVE",
      icon: "Psychic/Agonizing Scream",
      specialization: "universal",

      typeConfig: {
        school: "psychic",
        icon: "Psychic/Agonizing Scream",
        tags: ["passive", "debuff", "self_damage", "omen_debt", "oracle"],
        castTime: 0,
        castTimeType: "PASSIVE",
      },

      targetingConfig: {
        targetingType: "self",
        targetRestrictions: ["self"]
      },

      resourceCost: {
        actionPoints: 0,
      },

      resolution: "AUTOMATIC",
      effectTypes: ["passive"],
      tags: ["passive", "debuff", "self_damage", "omen_debt", "oracle"],
    },

    // ===== PASSIVE: Debt Overload (Overhauled thresholds + Debt Eruption) =====
    { id : "oracle_debt_overload",
      name: "Omen Debt: Cracked Vessel",
      description: "Prophecy demands a heavy toll. As your Omen Debt accumulates, your connection to reality fractures, inflicting terrible penalties and threatening a violent physical breakdown.",
      level: 1, // HARD-CODED AT LEVEL 1 SO ALL THRESHOLDS GOVERN FROM TURN ONE
      spellType: "PASSIVE",
      icon: "Necrotic/Skull Burst",
      specialization: "universal",

      typeConfig: {
        school: "psychic",
        icon: "Necrotic/Skull Burst",
        tags: ["passive", "debuff", "omen_debt", "self_damage", "oracle"],
        castTime: 0,
        castTimeType: "PASSIVE",
      },

      targetingConfig: {
        targetingType: "self",
        targetRestrictions: ["self"]
      },

      resourceCost: {
        actionPoints: 0,
      },

      resolution: "AUTOMATIC",
      effectTypes: ["debuff"],

      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          { id : "omen_debt_haunted",
            name: "Haunted (Debt 3-5)",
            description: "You suffer a flat -1 penalty to all d20 rolls. The whispers of branching timelines invade your thoughts.",
            statPenalty: {
              stat: "d20_rolls",
              value: -1,
              magnitudeType: "flat"
            }
          },
          { id : "omen_debt_torn_veil",
            name: "Torn Veil (Debt 6-8)",
            description: "At the start of your turn, you take 1d4 psychic damage. You are Blinded for the first round of your next combat encounter.",
            statusEffect: {
              type: "damage_over_time",
              damagePerTurn: "1d4",
              damageType: "psychic"
            }
          },
          { id : "omen_debt_cracked_vessel",
            name: "Cracked Vessel (Debt 9-10)",
            description: "You gain a catastrophic 100% vulnerability to all physical damage. You lose 10 maximum HP.",
            statusEffect: {
              type: "vulnerability",
              vulnerabilityType: "physical",
              percentage: 100
            }
          },
          { id : "omen_debt_eruption",
            name: "Debt Eruption (Exactly 10 Debt)",
            description: "At exactly 10 Debt, the vessel ruptures. At the start of your turn, roll a d6: 1-3: Localized blast deals 3d6 force damage to all entities within 15 feet. You take 2d6 psychic damage. 4-5: Permanent max HP reduced by 5 for the day. 6: Time rift stuns all entities within 30 feet who fail DC 15 Spirit save; you take 2d10 psychic damage.",
            statusEffect: {
              type: "turn_start_trigger",
              trigger: "exactly_10_debt",
              effects: ["aoe_explosion", "max_hp_loss", "stun_rift"]
            }
          }
        ],
        durationType: "permanent"
      },

      tags: ["passive", "debuff", "omen_debt", "self_damage", "oracle"],
    },
  ],

  spellSummary: [
    {
      level: 0,
      spells: [
      {
        "id": "oracle_gaze_beyond",
        "name": "Gaze into the Beyond",
        "description": "Stare deeply into standing water, swirling ash, or smoke. Force your third eye to focus, catching a fleeting, symbolic vision of a distant location or a clue about a targeted person's current emotional state.",
        "level": 1,
        "spellType": "ACTION",
        "icon": "Psychic/Focused Mind",
        "typeConfig": {
          "school": "psychic",
          "icon": "Psychic/Focused Mind",
          "tags": [
            "utility",
            "roleplay",
            "oracle"
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
          "selfHarm": {
            "hpCost": "1d4",
            "omenDebt": 1,
            "type": "psychic",
            "description": "Take 1d4 psychic damage and accumulate 1 Omen Debt"
          },
          "components": [
            "verbal",
            "somatic"
          ],
          "verbalText": "Visions, show me...",
          "somaticText": "Plunge your hand into cold water or ash, holding your breath under intense strain"
        },
        "resolution": "NONE",
        "effectTypes": [
          "utility"
        ],
        "utilityConfig": {
          "utilityType": "perception",
          "selectedEffects": [
            {
              "id": "gaze_beyond_vision",
              "name": "Symbolic Foresight",
              "description": "Reveals a brief symbolic image or clue about a location or person you have previously met. Accumulates +1 Omen Debt."
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
          "oracle"
        ]
      }
    ],
      spec: "Universal (Fallback)",
    },
    {
      level: 1,
      spells: ["Detect Fate", "Divine Insight", "Shared Vision", "Chrono-Wound", "Failed Prophecy", "Omen Debt: Cracked Vessel"],
      spec: "Universal / Seer",
    },
    {
      level: 2,
      spells: [
        "Omen Reading",
        "Foresight",
        "Read the Threads",
        "Unmask",
        "Past Sight",
      ],
      spec: "Universal / Seer / Fateseer / Truthseeker",
    },
    {
      level: 3,
      spells: [
        "Reveal Truth",
        "Piercing Gaze",
        "Prophetic Shield",
        "Reveal Weakness",
      ],
      spec: "Truthseeker / Universal",
    },
    {
      level: 4,
      spells: ["Prophecy of Doom", "Fate Strike", "Sever Thread"],
      spec: "Seer / Universal / Fateseer",
    },
    {
      level: 5,
      spells: ["Past Sins"],
      spec: "Truthseeker / Universal",
    },
    {
      level: 6,
      spells: ["Future Strike", "Destiny Shift"],
      spec: "Seer / Fateseer",
    },
    {
      level: 7,
      spells: [
        "Prescient Dodge",
        "Expose Secrets",
        "Destiny Lock",
        "Threads of Fate",
      ],
      spec: "Seer / Truthseeker / Fateseer",
    },
    {
      level: 8,
      spells: ["Perfect Foresight", "Psychic Assault", "Alter Destiny"],
      spec: "Seer / Truthseeker / Fateseer",
    },
    {
      level: 9,
      spells: ["Timeline Split", "Omniscience", "Weave Destiny"],
      spec: "Seer / Truthseeker / Fateseer",
    },
    {
      level: 10,
      spells: ["Future Self", "Absolute Truth", "Master of Fate"],
      spec: "Seer / Truthseeker / Fateseer",
    },
  ],
};
