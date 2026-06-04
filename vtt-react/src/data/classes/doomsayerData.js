/**
 * Doomsayer Class Data
 *
 * Complete class information for the Doomsayer - a Prophet of Catastrophe
 * who places living bomb prophecies with RNG chaos outcomes, using
 * Prophecy Range mechanics and Havoc as their primary resource.
 */

export const DOOMSAYER_DATA = {
  id : "doomsayer",
  name: "Doomsayer",
  icon: "fas fa-bolt",
  role: "Damage/Control (Chaotic Prophecy & Living Bombs)",
  damageTypes: ["necrotic", "psychic", "fire", "force"],

  overview: {
    originStory: `During the first solar eclipse of Sol's Deepening, the Skald archivist Malakor did not flee. He locked himself in the Scribe's Tower with thirty scrolls of star-arithmetic. By calculating the mass of the dying sun and the cooling rate of the mantle, he realized that the freeze was not temporary — it was mathematically absolute. The realization did not break his mind; it froze it.

The absolute certainty of the world's end left Malakor in a state of perpetual dread. The Doomsayer is chemically unable to feel joy, surprise, or physical warmth. His voice carries a subsonic frequency that induces minor panic attacks in nearby creatures, and his skin is cold and blue as fjord-ice.

Sound the bell of doom. The math is absolute, and the end is written in stone. Warn them before the final tally.`,
    title: "The Doomsayer",
    subtitle: "The End Already Came. Now It Answers to You.",

    quickOverview: {
      title: "Quick Overview",
      content: `**What You Need to Know**: Doomsayers plant "living bomb" prophecies — words of ruin stitched into flesh and air, each one a wound in the fabric of fate waiting to tear open. Each prophecy has a **Prophecy Range** created by rolling 2 dice — the results form a range (e.g., d8=1 and d6=3 → range is 1-3). When the prophecy resolves, a roll is made against this range: landing **between** the boundaries triggers the **Prophesied** effect (enhanced — catastrophe made manifest), landing **on** a boundary gives the **Base** effect (the doom speaks, but quietly), and landing **outside** the range triggers the **Outside** effect — and the fates turn their teeth on YOU. Self-damage. Mana drain. Worse. You earn **Havoc** from fulfilled prophecies — stolen entropy ripped from dying certainties — and spend it to fuel greater ruination.

**Prophecy Range Rules**:
1. **Creating the Range**: Roll 2 dice (type specified by each spell). The lower result becomes the **Low Boundary**; the higher result becomes the **High Boundary**. Die type does NOT determine position—only the numbers matter.
2. **Resolving the Prophecy**: Roll a resolution die (type specified by each spell) and compare the result to the range:
   - **Prophesied** (result falls between Low and High): Enhanced effect + Havoc earned.
   - **Base** (result equals Low or High boundary): Standard effect + 1 Havoc.
   - **Outside** (result is less than Low or greater than High): Negative effect / fizzle / self-damage. No Havoc. **Prophecy Backlash** — the doom turns inward.
3. **Doubles Rule**: If both dice roll the same number (e.g., d4=3 and d4=3), the range is a single value. The result can ONLY be Base (on the value) or Outside (any other result). Prophesied is impossible on doubles.

**Resource**: Havoc (stolen entropy from fulfilled prophecies, spent on greater catastrophe). Max 15. Persists between combats, resets on long rest.

**Playstyle**: Weaponized fatalism — plant prophecies like landmines in the bones of your enemies, detonate them for cascading catastrophe, hoard Havoc to widen fate's knife-edge

**Best For**: Players who love placing ticking time bombs in their enemies, detonating them for cascading chaos, and earning Havoc from fulfilled doom to fuel even greater explosions — and who accept that every prophecy is a gamble paid in their own flesh`,
    },

    description: `Something broke inside them the day they saw how it all ends. Not a crack — a rupture, clean through the soul. Now that ending bleeds out of them in prophecy and flame. Doomsayers do not predict doom. They CREATE it — planting living words of ruin into flesh and stone and air, each prophecy a wound in the world that festers until it bursts. Some detonate the moment they're spoken. Others burrow deep, ticking like a second heartbeat in the victim's chest, accumulating stolen entropy — Havoc — before unleashing catastrophe in a single, devastating convulsion. Every prophecy is a gamble. Miss the range, and the doom turns inward, chewing on the prophet's own flesh instead. The fates are not kind. The fates are a weapon, and the Doomsayer aims it.`,

    roleplayIdentity: {
      title: "Roleplay Identity",
      content: `**HISTORY: THE GENESIS**
The doomsayer's apocalypse counting was born in the library-vaults of <LoreLink termId="nordhalla">Nordhalla</LoreLink>. A Skald record-keeper named **Malakor** recorded the approaching doom of Sol's Deepening, calculating the exact arithmetic of coming deaths.

The price of this absolute calculation was a perpetual dread. Malakor became completely unable to feel joy or surprise, his voice carrying the solemn, mathematical certainty of doom.

**CITIES & CIVIL RECEPTION**
Doomsayers are respected yet avoided in civilized cities, often acting as solemn record-keepers in the <LoreLink termId="frozen_archive">Frozen Archive</LoreLink>.

**RACES & CULTURAL AFFILIATION**
The class is heavily practiced by the Solvarn humans and the <LoreLink termId="skald">Rune Keeper Skald</LoreLink>.

**NOTABLE FIGURES**
* **Malakor the Grim**: The archivist who calculated the exact decline of the human keeps, losing his ability to feel warmth.
* **Valeria the Grim**: A Solvarn priestess who prophesied the extinction of the surface cities during the Cold-Lock.`
    },

    signatureQuote: {
      text: '"I have calculated the exact hour of your death. Would you like to know it? Most people say no. It does not change the hour."',
      speaker: 'Malakor the Grim',
      context: 'Recorded in the margin of his final star-arithmetic scroll, found clutched in his frozen hands'
    },

    philosophy: {
      coreTenet: 'The future is not a mystery. It is a mathematical certainty that most people lack the courage to compute. The Doomsayer does not predict — they reveal what has already been decided.',
      relationship: 'Doomsayers are bound to absolute truth. They cannot offer comfort or hope because they have seen the numbers. The death of Sol was not a tragedy — it was arithmetic. The extinction of surface life is not a possibility — it is an equation waiting to be solved. Their power comes from accepting this and forcing others to accept it too.',
      paradox: 'The Doomsayer is chemically incapable of joy, yet they are the only class whose power grows from fulfilled predictions. Every prophecy that comes true gives them Havoc — stolen entropy, pure satisfaction. They are the only people in Mythrill who smile when the worst happens, because it means they were right.'
    },

    currentCrisis: `Three ancestral mounds in the Sundrift Vale fell silent in a single season. Doomsayers who attempted to calculate the cause experienced something unprecedented: their equations began returning multiple contradictory answers simultaneously. The same calculation, performed three times, yields three different extinction dates. Some Doomsayers have received results that predate the Deepening — results suggesting the world already ended, and what remains is a mathematical afterimage.

The senior Doomsayer Valeria the Grim has sealed herself in the Frozen Archive\'s deepest vault, refusing to speak. Novices report that her calculations have begun appearing on the walls of her chamber — written in frost, in her handwriting, despite her never touching a chisel. The equations describe an event she will not name, occurring on a date that keeps changing.`,

    meaningfulTradeoffs: `To calculate the end of all things is to carry that knowledge in your bones. Doomsayers cannot feel warmth — not physical, not emotional. They experience the world through a lens of terminal certainty. A Doomsayer at a wedding does not see love; they calculate the statistical likelihood of divorce, death in childbirth, and widowhood. A Doomsayer holding their own child calculates the child\'s probable lifespan to the minute. They are not cruel. They are honest in a way that most people find indistinguishable from cruelty.`,

    classSpecificLocations: [
      {
        name: 'The Apocrypha Vaults',
        locationId: 'frozen-archive',
        description: 'The deepest, coldest chambers of the Frozen Archive, where Doomsayers store their completed calculations. Each vault contains a single scroll — a mathematical proof of a specific extinction event. The oldest scrolls date to the first years of the Dimming. The newest are added weekly.',
        purpose: 'Archival — the Doomsayers believe that if the world ends, the calculations should survive to warn whatever comes next',
        status: 'Active — but the vaults are over capacity, and some scrolls have begun to rewrite themselves'
      }
    ],

    combatRole: {
      title: "Combat Role",
      content: `In combat, the Doomsayer is the only soul mad enough to plant living bomb prophecies in the bones of their enemies — words of ruin that tick and fester until detonated on command, unleashing RNG-chaos outcomes that no other class can create, cascade, or control. No one else earns Havoc from fulfilled doom and spends it to widen fate's knife-edge for even bigger explosions. Their chaos is FORECASTED — placed deliberately, detonated deliberately. A Chaos Weaver rolls the bones and prays. A Doomsayer writes the ending first, then forces the world to read it.

**Living Bomb Placement**: First round, plant a prophecy in a target or area — a wound in fate that waits to tear open
**Prophecy Range Manipulation**: Roll 2 dice to carve fate's boundaries, then spend Havoc to widen or narrow the blade
**Ticking Time Bombs**: Some prophecies accumulate dread over rounds before detonating — second heartbeats in the victim's chest
**Havoc Generation**: Every fulfilled prophecy rips stolen entropy from dying certainty, fueling greater catastrophe

But every prophecy is a wound in the Doomsayer too. When a resolution roll lands OUTSIDE the range, **Prophecy Backlash** tears into them — self-damage, mana drain, debilitation. Narrow ranges are devastating when they land, catastrophic when they miss. The fates punish hubris, and the prophet pays in blood.`,
    },

    playstyle: {
      title: "Playstyle",
      content: `Doomsayers reward players who:

**Plan Chaos**: Place prophecies strategically—on clustered enemies for area effects, on bosses for single-target devastation
**Manage Havoc**: Every fulfilled prophecy earns Havoc. Save it for big spells or spend it to manipulate prophecy ranges
**Embrace Uncertainty**: Prophecy outcomes are RNG-based but bounded. You control the range, fate controls the result
**Mix Instant and Delayed**: Some prophecies detonate immediately (quick chaos), others tick and accumulate (delayed devastation)
**Adapt to Outcomes**: Prophesied effects are bonus—plan for the Base effect and treat Prophesied as a pleasant surprise

The Prophecy Range mechanic creates a unique minigame: you set the boundaries, but the outcome within those boundaries is uncertain. Narrow ranges are harder to hit but have more devastating Prophesied effects. Wide ranges are safer but less spectacular.`,
    },

    immersiveCombatExample: {
      title: "Combat Example: The Prophet's Toll",
      content: `**The Setup**: You're a Doomsayer (Cataclysm specialization) facing a troll berserker and three goblin shamans. Your party needs you to deal damage and create chaos. Starting Havoc: 0. Starting Mana: 50/60. Your goal: Place a prophecy on the troll, detonate it, earn Havoc, and cascade into more prophecies.

**Starting State**: Havoc: 0/15 | Mana: 50/60 | HP: 55/55

**Turn 1 - Placing the First Prophecy (Havoc: 0 → 0)**

*The troll roars, green skin glistening. The goblin shamans begin their chants. You raise your hand, eyes blazing with apocalyptic vision.*

**Your Action**: Cast "Doom Bolt" on Troll (6 mana)
**Prophecy Range Setup**: Roll d8 and d6 → [3] and [5]
**Prophecy Range**: 3-5 (range of 3 values)

*You trace a burning sigil in the air. "Your doom is set. The range is drawn. Fate will decide." A shimmering prophecy mark appears above the troll.*

**Resolution Roll**: d6 → [4] → **INSIDE THE RANGE (3-5)!** → **PROPHESIZED!**

*The sigil DETONATES with enhanced force—prophetic energy amplified by fate's alignment.*

**Prophesied Effect**: 4d8 necrotic damage + target is weakened for 2 rounds
**Base Effect** (if rolled 3 or 5): 2d8 necrotic damage
**Outside Effect** (if rolled 1, 2, or 6): 1d8 necrotic to self instead

**Damage Roll**: 4d8 → [7, 5, 6, 8] = **26 necrotic damage!**
**Troll**: Weakened for 2 rounds (-2 to all rolls)
**Havoc Generated**: +3 (Prophesied fulfillment)

**Havoc**: 0 + 3 = **3/15**
**Mana**: 50 - 6 = 44/60

*The troll STAGGERS. Your prophecy hit perfectly within the range. The signs aligned. You feel Havoc surge through you—chaotic energy from a fulfilled prophecy.*

**Current State**: Havoc: 3/15 | Mana: 44/60 | Troll: Weakened (2 rounds)

**Turn 2 - Area Prophecy (Havoc: 3 → 5)**

*Three goblin shamans are chanting together. Time to place an area prophecy.*

**Your Action**: Cast "Calamity Zone" on Goblin cluster (10 mana)
**Prophecy Range Setup**: Roll d10 and d8 → [2] and [7]
**Prophecy Range**: 2-7 (range of 6 values—wider = safer)

**Resolution Roll**: d8 → [4] → **INSIDE THE RANGE (2-7)!** → **PROPHESIZED!**

**Prophesied Effect**: All goblins in 15ft take 3d8 fire damage + 1d8 force, area becomes difficult terrain
**Base Effect**: 2d8 fire damage
**Outside Effect**: Spell fizzles, you take 1d4 psychic backlash

**Damage Roll**: 3d8 fire → [6, 7, 5] = 18 fire + 1d8 force → [8] = **26 total to each goblin!**
**Terrain**: 15ft zone becomes burning difficult terrain for 3 rounds

**Goblin Shaman #1**: 26 damage → DEAD
**Goblin Shaman #2**: 26 damage → Nearly dead (5 HP)
**Goblin Shaman #3**: 26 damage → Nearly dead (8 HP)

**Havoc Generated**: +2 (Prophesied area fulfillment)
**Havoc**: 3 + 2 = **5/15**
**Mana**: 44 - 10 = 34/60

*The ground ERUPTS in prophetic fire. Two goblins are nearly dead. One is ashes. The zone burns with fate-fire—difficult terrain that will damage anyone who enters.*

**Current State**: Havoc: 5/15 | Mana: 34/60

**Turn 3 - The Ticking Bomb (Havoc: 5 → 9)**

*The troll is weakened. Two shamans are barely alive. Time for a delayed prophecy—a ticking time bomb.*

**Your Action**: Cast "Doom Countdown" on Troll (8 mana, places a delayed prophecy)
**Prophecy Duration**: 3 rounds (ticking bomb)
**Each Round Effect**: Troll takes 1d6 necrotic damage. Havoc accumulates.
**Detonation**: At end of round 3, roll prophecy range for massive effect.

*You press your palm against the troll's chest. "Three. Two. One. BOOM." A dark sigil sinks into its flesh. The countdown begins.*

**Troll takes**: 1d6 → [4] necrotic damage (Round 1 of 3)
**Havoc Generated**: +1 (delayed prophecy ticking)
**Havoc**: 5 + 1 = **6/15**

**Mana**: 34 - 8 = 26/60

**Your Action (remaining AP)**: Spend 2 Havoc to widen a prophecy range on your next spell by +1 on each boundary

*You channel Havoc into your prophetic sight, preparing for a bigger detonation.*

**Havoc**: 6 - 2 = **4/15** (stored as "Range Widening: +1 each side" for next spell)

**Goblin Shaman #2**: Casts a heal on troll → Troll regains 10 HP
**Goblin Shaman #3**: Attacks your mage → d20+4 → [13] → Hit! → 1d6+2 → [5]+2 = 7 damage

**Current State**: Havoc: 4/15 | Mana: 26/60 | Troll: Weakened (1 round left), Doom Countdown (2 rounds left)

**Turn 4 - Detonation (Havoc: 2 → 11)**

*Doom Countdown ticks. The troll is writhing.*

**Troll takes**: 1d6 → [6] necrotic damage (Round 2 of 3)
**Havoc Generated**: +1 (ticking) + 1 (rolled max on d6)
**Havoc**: 4 + 2 = **6/15**

**Your Action**: Cast "Cataclysm Blast" on Troll (20 mana + 4 Havoc)
**Prophecy Range Setup**: Roll d10 and d8 → [4] and [8]
**With Range Widening +1 each side**: Range becomes 3-9 (expanded by 1 in each direction)
**Prophecy Range**: 3-9 (7 values—wide range, safe detonation)

**Resolution Roll**: d8 → [7] → **INSIDE THE RANGE (3-9)!** → **PROPHESIED!**

*You raise both hands. The troll's Doom Countdown sigil MERGES with your Cataclysm Prophecy. The accumulated doom DETONATES.*

**Prophesied Effect**: 6d8 fire + 3d8 necrotic to all in 25ft radius, zone becomes difficult terrain for 5 rounds
**Base Effect**: 4d8 fire + 2d8 necrotic
**Outside Effect**: 2d8 to self

**Damage Roll**: 6d8 fire → [9, 7, 6, 8, 5, 9] = 44 fire + 3d8 necrotic → [10, 6, 8] = 24 necrotic = **68 total to each target in range!**
**Blast Radius**: 25ft catches Goblin Shamans #2 and #3

**Goblin Shaman #2**: 68 damage → OBLITERATED
**Goblin Shaman #3**: 68 damage → OBLITERATED
**Troll**: Takes 68 + 6 (Doom Countdown final tick) = 74 damage → COLLAPSES

*The troll EXPLODES in a burst of prophetic fire and necrotic energy. The two remaining shamans are caught in the blast and simply cease to exist. The battlefield is silent except for the crackle of fate-fire.*

**Combat Over**

**Final State**: Havoc: 4/15 (earned 9, spent 6) | Mana: 6/60 | HP: 55/55

**The Lesson**: Doomsayer gameplay is about:
1. **Prophecy Range**: Roll 2 dice to set boundaries (lower = Low, higher = High). Inside = Prophesied (bonus). Boundary = Base. Outside = negative/fizzle.
2. **Havoc Economy**: Every fulfilled prophecy generates Havoc. Spend it to widen ranges (1 Havoc = +1 to each boundary) or on powerful Havoc-costing spells.
3. **Living Bombs**: Doom Countdown was a 3-round ticking bomb that accumulated damage and Havoc before detonating alongside Cataclysm Blast.
4. **Calculated Chaos**: You don't control the roll, but you control the RANGE. Wide ranges = safer but weaker Prophesied effects. Narrow ranges = riskier but more devastating.
5. **Cascade Effect**: First prophecy → earn Havoc → spend Havoc to improve next prophecy → bigger Havoc payoff → cascade into ultimate spells.
6. **Risk Management**: If that Cataclysm Blast had rolled outside the range, YOU take the damage. Every prophecy is a calculated gamble.`,
    },

    characterCreation: {
      title: "Character Creation",
      content: `**Step 1: Assign Stats**
Prioritize **Spirit** (improves prophecy range resolution rolls and spell save DCs) and **Intelligence** (increases mana and spell damage). **Vitality** is secondary—you are squishy. Wisdom helps with perception to spot clustering enemies for area prophecies.

**Step 2: Choose a Specialization**
Read all three paths below. Choose based on your preferred playstyle:
- **Requiem**: You want to delete single targets. You like high-risk, high-reward moments.
- **Endbringer**: You enjoy building power over time and feeling unstoppable in long fights.
- **Cataclysm**: You love area control, battlefield chaos, and managing multiple effects at once.

**Step 3: Select Starting Spells**
You begin with **Doom Bolt** (universal) and **one spell from your specialization's level 1 pool**:
- Requiem: Doom Bolt + Doom Whisper
- Endbringer: Doom Bolt + Omen of Ash (or Doom Bolt + Omen Flame if no spec spell available)
- Cataclysm: Doom Bolt + Omen Flame

**Step 4: Equip Starting Gear**
- **Apocrypha** (two-handed tome): Your spellcasting focus and weapon. 1d8 necrotic melee.
- **Prophet's Vestments** (cloth armor): 2 armor. You are fragile—positioning is survival.
- **Cast of Ruin** (trinket): +1 Spirit, +1 Intelligence. Your prophecy dice.
- **Ashen Reagent Pouch** (trinket): +1 to your first prophecy range resolution roll each combat.

**Step 5: Understand Your First Turn**
Your first combat will feel slow—you have 0 Havoc. Cast Doom Bolt or your spec spell to generate your first Havoc, then use it to widen ranges on bigger spells. The Doomsayer ramps up; you are not a turn-one powerhouse.`,
    },
  },

  resourceSystem: {
    title: "Havoc",
    subtitle: "The Currency of Fulfilled Doom",

    description: `Havoc is not a resource. It is stolen entropy — the heat death of small certainties, ripped screaming from the moment a prophecy fulfills its terrible promise. When a target's doom comes to pass exactly as foretold, the universe bleeds energy, and the Doomsayer catches it in their teeth. This stolen decay is then spent to tear wider wounds in fate, to strengthen prophecies, or to fuel abilities that have no business existing in a world that hasn't ended yet. Havoc does not generate passively. It only flows from successful prophecy fulfillment — the Doomsayer must plant the bomb, watch it detonate, and drink the wreckage.

**Havoc Persistence**: Havoc carries over between combats but drains to nothing on a long rest. Sleep is the only mercy. You cannot bank Havoc across days — the stolen entropy finds its way back to the void.

**Havoc Overflow**: If an effect would grant Havoc beyond your maximum (15), the excess does not quietly vanish. It converts into 1d4 fire damage per point of overflow, hurled at a random enemy within 30ft — or it eats inward, wasted, if no enemies are near. Havoc ALWAYS finds an outlet. It is not polite.

**Concentration Limit**: You can maintain only **one concentration spell at a time**. If you cast a new concentration spell while maintaining another, the older one ends immediately. Choose carefully between your ticking prophecies and aura effects.`,

    cards: [
      {
        title: "Havoc (0-15)",
        stats: "Max: 15 | Earned from Prophecies",
        details:
          "Generated when prophecies fulfill (Prophesied outcome). Spent on stronger spells and widening prophecy ranges. Must be earned through successful prophecy plays.",
      },
      {
        title: "Prophecy Range",
        stats: "2 Dice → Low-High Range",
        details:
          "Roll 2 dice (type per spell) to create a range. Target rolls against it. Inside = Prophesied (bonus), On boundary = Base, Outside = Negative/Fizzle.",
      },
      {
        title: "Living Bombs",
        stats: "Instant or Delayed",
        details:
          "Some prophecies detonate immediately. Others tick for rounds, accumulating damage and Havoc before a massive detonation.",
      },
    ],

    generationTable: {
      headers: ["Prophecy Outcome", "Havoc Gain", "Notes"],
      rows: [
        [
          "Prophesied (inside range)",
          "+2 to +5",
          "Base gain + spell-specific bonus",
        ],
        ["Base (on boundary)", "+1", "Prophecy hit but not enhanced"],
        ["Outside (fizzle/negative)", "+0", "Prophecy failed—no Havoc earned"],
        [
          "Doom Countdown (per tick)",
          "+1",
          "Delayed prophecies generate Havoc each round",
        ],
        [
          "Doom Countdown (detonation)",
          "+3 to +6",
          "Final burst when countdown reaches 0",
        ],
        [
          "Multiple targets (area)",
          "+1 per target",
          "Area prophecies generate Havoc per target hit",
        ],
      ],
    },

    usage: {
      momentum:
        "Place cheap prophecies early to build Havoc. Once you have 5+, start using Havoc to widen ranges on bigger spells for safer Prophesied outcomes.",
      flourish:
        "Narrow ranges (1-2 values) give the strongest Prophesied effects but are hardest to hit. Spend Havoc to widen them by +1 per Havoc spent—turning a risky 3-5 into a safe 2-6.",
    },

    overheatRules: {
      title: "Prophecy Backlash",
      content: `When a prophecy rolls OUTSIDE the range, the Doomsayer suffers **Prophecy Backlash**:

**The Effect**: Depending on the spell, you may take self-damage, lose mana, or suffer a debuff. Each spell specifies its Outside effect.

**Common Outside Effects**:
- **Minor spells**: Take 1d4 psychic damage (prophetic headache)
- **Medium spells**: Take 1d8 necrotic damage and lose 5 mana
- **Major spells**: Take 2d8 damage and the spell cooldown still applies
- **Ultimate spells**: Take 3d10 damage and are stunned for 1 round

**Risk vs Reward**: Narrower ranges have more powerful Prophesied effects but higher Backlash risk. Wider ranges are safer but less spectacular.

**The Philosophy**: You spoke doom and doom answered—but not in the way you intended. The fates punish hubris.`,
    },

    strategicConsiderations: {
      title: "Prophecy Range Strategy",
      content: `**Narrow Range (1-2 values)**: High risk, high reward. Prophesied effects are devastating. Best used with Havoc to widen or against targets with low variance.

**Medium Range (3-5 values)**: Balanced approach. Good Prophesied payoff with reasonable risk. Standard play.

**Wide Range (6+ values)**: Safe bet. Prophesied effect is modest but consistent. Good for building Havoc early.

**Spending Havoc on Range Widening**: Each point of Havoc spent widens the range by 1 in each direction (e.g., 3-5 becomes 2-6 for 1 Havoc). This is often the most efficient use of early Havoc.

**Delayed vs Instant**: Delayed prophecies (Doom Countdown) generate Havoc over time and can combine with later prophecies for cascade detonation. Instant prophecies give immediate Havoc for quick ramp-up.

**Specialization Impact**: Requiem (single-target) gets bonus Havoc from single-target Prophesied hits. Endbringer (escalating) gains more Havoc as combat continues. Cataclysm (area) earns Havoc per target hit in area prophecies.`,
    },

    playingInPerson: {
      title: "Playing in Person",
      subtitle: "The Prophecy Board",
      content: `The Doomsayer is incredibly tactile when played in person.

**Required Materials**:
- **Two distinct dice sets**: One for each prophecy range die (e.g., red d8 for "Low," blue d6 for "High")
- **Havoc tokens**: Red/orange glass beads or poker chips (max 15)
- **Prophecy markers**: Small cards or sticky notes for active prophecies
- **A "Range Tracker"**: Two number clips on a strip showing Low-High range

**The Physical Hack**:
- **The Prophecy Roll**: When you cast a prophecy, roll both dice dramatically. Place the Low die on the left side of your Range Tracker and the High die on the right. The space between them is your Prophecy Range—physically visible to everyone.
- **The Resolution Roll**: When the prophecy resolves, roll a die and physically place it BETWEEN the boundary dice if it's inside, or outside them if it misses. The visual is immediate and dramatic.
- **Havoc Tokens**: Start with an empty pile. Every time a prophecy fulfills, add red beads. When you spend Havoc to widen a range, physically push a bead forward and move the Range Tracker wider. The bead pile is a visual tension builder.
- **Doom Countdown**: Write "DC: 3" on a sticky note attached to the target's mini. Each round, cross out and replace with "DC: 2," "DC: 1," "BOOM." The visible countdown creates real tension at the table.

**Pro Tip**: Use a small whiteboard for tracking active prophecies. Write each prophecy's range, target, and current tick count. The visual chaos of multiple active prophecies is part of the Doomsayer's identity.`,
    },
  },

  specializations: {
    title: "Doomsayer Specializations",
    subtitle: "Three Roads to Ruin",

    description: `Every Doomsayer stared into the same abyss and came back speaking the same language of endings. But the way they USE that ending — the shape of the ruin they carry — splits them into three paths. Requiems are assassins of fate, threading needles of absolute death through the narrowest prophetic windows, gambling everything on a single perfect strike. Endbringers are slow-motion catastrophes, their doom growing heavier and more suffocating with every passing round until the weight of it crushes everything nearby. Cataclysms are walking apocalypses, spraying prophecy-shrapnel across the entire battlefield, earning Havoc from every screaming target caught in the blast radius.`,

    passiveAbility: {
      name: "Prophet's Sight",
      description:
        'All Doomsayers can sense the "doom potential" of a creature—whether a target is particularly susceptible to prophecy (creatures with lower Spirit scores are easier targets). You also gain a bonus to Prophecy Range resolution rolls equal to half your Doomsayer level (rounded down, maximum +5). This bonus helps land inside the range more reliably.',
    },

    specs: [
      { id : "requiem",
        name: "Requiem",
        icon: "Necrotic/Necrotic Skull",
        color: "#4B0082",
        theme: "Single-Target Death Prophecies",

        description: `Requiems are fate's surgeons of death — or its butchers, depending on how the dice fall. They plant the narrowest, most lethal prophecies in a single target's flesh, each one a razor-thin window of absolute destruction. Their Prophesied effects are the most devastating in existence, but the margins are knife-edge thin. Miss the range, and the doom claws back into the Requiem's own body with unmatched cruelty. They earn bonus Havoc from single-target Prophesied hits and can stack multiple prophecies on the same victim — layering doom upon doom until the target is a walking graveyard of unfulfilled endings, each one waiting to detonate.`,

        playstyle:
          "Single-target nuke, precision prophecy, death stacking, high burst damage",

        strengths: [
          "Prophesied effects deal 50% more damage on single-target spells",
          "Bonus Havoc (+2) from single-target Prophesied hits",
          "Can stack up to 3 prophecies on the same target simultaneously",
          'Access to "Death Prophecy" abilities that can instantly kill low-HP targets',
        ],

        weaknesses: [
          "Narrower prophecy ranges (smaller dice) mean higher Backlash risk",
          "No area effect capability—all power focused on single targets",
          "Vulnerable against groups of enemies",
          "Less Havoc generation per combat since fewer targets are hit",
        ],

        specPassive: {
          name: "Death's precision",
          description:
            "When you roll a Prophesied outcome on a single-target spell, gain +2 bonus Havoc and the spell deals +50% damage. You can have up to 3 active prophecies on the same target—when one detonates, the others tick.",
        },

        keyAbilities: [
          "Death Mark: Place a narrow-range prophecy (d4+d4) that deals 6d10 necrotic on Prophesied (5 Havoc)",
          "Stacked Doom: Detonate all active prophecies on a target simultaneously for combined damage",
          "Requiem: Ultimate—place a prophecy that, if Prophesied, reduces target to 0 HP regardless of remaining health (10 Havoc, once per long rest)",
        ],

        recommendedFor:
          "Players who want to be the ultimate single-target burst damage dealer with a unique prophecy mechanic",
      },

      { id : "endbringer",
        name: "Endbringer",
        icon: "Void/Black Hole",
        color: "#FF4500",
        theme: "Escalating Effects & Doom Aura",

        description: `Endbringers are what happens when a prophecy doesn't detonate — it just keeps GROWING. Every round their doom lingers, it gains weight: more damage, more Havoc, more devastation, a slow-motion collapse that accelerates toward a crescendo of total ruin. They radiate a doom aura that crushes the will of anything nearby, and the longer a fight drags on, the more terrifying they become — their prophecies thickening like clotting blood, their Havoc reserves swelling with stolen entropy until the final detonation drowns everything in screaming light. Weak in the opening moments. Unstoppable by the end.`,

        playstyle:
          "Escalating damage, delayed gratification, doom aura, round-dependent power scaling",

        strengths: [
          "Prophecy effects escalate: +1d6 damage per round a prophecy remains active",
          "Doom aura: enemies within 15ft have -1 to all rolls per 3 Havoc you hold",
          "Delayed prophecies generate MORE Havoc the longer they tick",
          "Late-combat power spike is the highest of any spec",
        ],

        weaknesses: [
          "Weak in early combat—needs time to build up",
          "Vulnerable to being focused down before prophecies mature",
          "Less effective in short combats (3 rounds or fewer)",
          "Escalation requires concentration and positioning",
        ],

        specPassive: {
          name: "Escalating Doom",
          description:
            'Every round a prophecy remains active, its effects increase: +1d6 damage per round, +1 Havoc generated per tick. Your doom aura gives enemies within 15ft -1 to all rolls for every 3 Havoc you currently hold (max -5). At 10+ Havoc, your prophecies also apply a stacking "Doom" debuff: -1 to saves per stack.',
        },

        keyAbilities: [
          "Escalating Countdown: Place a prophecy that gains +1d8 damage per round for 5 rounds, then detonates (4 Havoc)",
          "Doom Aura Expansion: Spend 3 Havoc to expand doom aura to 30ft and increase penalty to -2",
          "Endbringer's Finale: After 5+ rounds of combat, spend 8 Havoc to trigger ALL active prophecies simultaneously with maximized Prophesied effects",
        ],

        recommendedFor:
          "Players who enjoy delayed gratification and increasingly devastating power over time",
      },

      { id : "cataclysm",
        name: "Cataclysm",
        icon: "Fire/Fire Storm",
        color: "#FF6347",
        theme: "Area Prophecies & Battlefield-Wide Chaos",

        description: `Cataclysms do not aim. They do not need to. Every prophecy they speak becomes a blast zone — 15 feet, 30 feet, 40 feet of weaponized fate that catches everything inside its radius and subjects every screaming target to the same RNG-ruin. They earn Havoc from each body caught in the detonation, making them the most efficient entropy harvesters alive, and they can layer multiple area prophecies on top of each other until the overlapping zones become nothing but a howling wound in reality. Where the Requiem is a scalpel and the Endbringer is a slow poison, the Cataclysm is a wildfire that does not care who burns.`,

        playstyle:
          "Area control, multi-target RNG chaos, simultaneous prophecies, battlefield domination",

        strengths: [
          "All spells can affect areas (15-40ft radius)",
          "Earn Havoc per target hit in area prophecies (1 Havoc per target)",
          "Can maintain 2+ area prophecies simultaneously",
          "Prophesied effects on area spells apply to ALL targets in the zone",
        ],

        weaknesses: [
          "Prophesied damage per target is lower than Requiem's single-target",
          "Friendly fire risk on some area prophecies",
          "Requires enemies to cluster for maximum effect",
          "Less effective against spread-out enemies or single bosses",
        ],

        specPassive: {
          name: "Cataclysmic Range",
          description:
            "All your prophecies are area-based (minimum 15ft radius). You earn +1 Havoc per target caught in the area when Prophesied. You can have up to 3 area prophecies active simultaneously. When two or more of your area prophecies overlap, the overlapping zone deals double damage and grants +1 bonus Havoc per target.",
        },

        keyAbilities: [
          "Rain of Doom: Place a 30ft area prophecy that rains RNG effects each round (roll d6 table: fire/necrotic/psychic/force/stun/heal reversal)",
          "Cataclysm Cascade: When an area prophecy Prophesied, all targets in the zone trigger a secondary prophecy (3 Havoc)",
          "End of Days: Spend 10 Havoc to create a 40ft zone where ALL dice rolls are subject to your prophecy range for 3 rounds",
        ],

        recommendedFor:
          "Players who love creating battlefield-wide chaos and controlling the flow of combat through area denial",
      },
    ],
  },

  exampleSpells: [
/**
 * Doomsayer Spells Part 1: Levels 1-5
 *
 * Overhauled spell data for the Doomsayer class.
 * Dark, oppressive descriptions. Doom stacking debuffs.
 * No 5e terminology. Prophecy resolution where applicable.
 * HP sacrifice costs on Level 3+ spells.
 */

  // ============================================================
  // LEVEL 1 SPELLS (4)
  // ============================================================

  { id : "doomsayer_doom_bolt",
    name: "Doom Bolt",
    description:
      "Your throat tears open as you speak the first syllable of ending. A bolt of pure necrotic certainty lances toward the target, branding their flesh with a doom that whispers of inevitable ruin. Every word costs blood — your vocal cords shred, your eyes well with crimson, and the taste of copper fills your mouth.",
    spellType: "ACTION",
    icon: "Necrotic/Skull Burst",
    level: 1,
    specialization: "universal",
    effectTypes: ["damage", "debuff"],
    typeConfig: {
      school: "necrotic",
      castTime: 1,
      castTimeType: "IMMEDIATE",
      icon: "Necrotic/Skull Burst",
    },
    targetingConfig: {
      targetingType: "single",
      rangeDistance: 60,
      targetRestrictions: ["enemies"],
      rangeType: "ranged",
    },
    resourceCost: {
      actionPoints: 1,
      mana: 6,
      classResource: {
        type: "havoc",
        cost: -3,
      },
    },
    resolution: "PROPHECY",
    mechanicsConfig: [
      {
        enabled: true,
        system: "PROPHECY",
        prophecy: {
          rangeDice: ["d8", "d6"],
          resolutionDie: "d6",
          prophesied: {
            damage: "4d8",
            effect: {
              id : "doom_i",
              name: "Doom I",
              duration: 2,
              unit: "rounds",
              statModifiers: [
                {
                  stat: "spirit",
                  value: -1,
                  magnitudeType: "penalty",
                },
              ],
              description:
                "Marked by prophetic doom. The target suffers -1 to Spirit saves for 2 rounds as the certainty of their end seeps into their soul.",
              doomStack: true,
              doomStackValue: 1,
            },
            havocGain: 3,
            description:
              "Deals 4d8 necrotic damage and afflicts the target with Doom I (-1 Spirit saves, 2 rounds).",
          },
          base: {
            damage: "2d8",
            havocGain: 1,
            description: "Deals 2d8 necrotic damage.",
          },
          outside: {
            backlash: "1d8 psychic to self",
            havocGain: 0,
            description:
              "The prophecy turns inward. Your mind recoils as the doom finds no purchase, dealing 1d8 psychic damage to you.",
          },
        },
      },
    ],
    damageConfig: {
      formula: "2d8",
      damageTypes: ["necrotic"],
      resolution: "PROPHECY",
    },
    cooldownConfig: {
      cooldownType: "none",
      cooldownValue: 0,
    },
    tags: ["damage", "debuff", "necrotic", "prophecy", "universal", "doom"],
  },

  { id : "doomsayer_doom_whisper",
    name: "Doom Whisper",
    description:
      "You lean close to the fabric of fate and whisper a name that should never be spoken. The syllables shred your vocal cords like broken glass and your throat fills with hot copper, but the whisper reaches the target's mind — a dirge of inevitable failure that splinters thought and drowns hope in black water.",
    spellType: "ACTION",
    icon: "Psychic/Agonizing Scream",
    level: 1,
    specialization: "requiem",
    effectTypes: ["debuff", "damage"],
    typeConfig: {
      school: "psychic",
      castTime: 1,
      castTimeType: "IMMEDIATE",
      icon: "Psychic/Agonizing Scream",
    },
    targetingConfig: {
      targetingType: "single",
      rangeDistance: 30,
      targetRestrictions: ["enemies"],
      rangeType: "ranged",
    },
    resourceCost: {
      actionPoints: 1,
      mana: 5,
      classResource: {
        type: "havoc",
        cost: -2,
      },
    },
    resolution: "PROPHECY",
    mechanicsConfig: [
      {
        enabled: true,
        system: "PROPHECY",
        prophecy: {
          rangeDice: ["d4", "d4"],
          resolutionDie: "d4",
          prophesied: {
            damage: "2d6",
            effect: {
              id : "doom_ii",
              name: "Doom II",
              duration: 2,
              unit: "rounds",
              statModifiers: [
                {
                  stat: "spirit",
                  value: -2,
                  magnitudeType: "penalty",
                },
              ],
              description:
                "The whispers burrow deep. The target suffers -2 to Spirit saves for 2 rounds as prophetic certainty rots their resolve from within.",
              doomStack: true,
              doomStackValue: 2,
            },
            havocGain: 2,
            description:
              "Deals 2d6 psychic damage and afflicts the target with Doom II (-2 Spirit saves, 2 rounds).",
          },
          base: {
            damage: "1d6",
            effect: {
              id : "doom_i",
              name: "Doom I",
              duration: 1,
              unit: "rounds",
              statModifiers: [
                {
                  stat: "spirit",
                  value: -1,
                  magnitudeType: "penalty",
                },
              ],
              description:
                "A whisper of doom lingers. -1 to Spirit saves for 1 round.",
              doomStack: true,
              doomStackValue: 1,
            },
            havocGain: 1,
            description:
              "Deals 1d6 psychic damage and afflicts the target with Doom I (-1 Spirit saves, 1 round).",
          },
          outside: {
            backlash: "1d4 psychic to self",
            havocGain: 0,
            description:
              "The whispers turn on you. Your own mind becomes the instrument of suffering as the words you spoke echo back, dealing 1d4 psychic damage.",
          },
        },
      },
    ],
    debuffConfig: {
      debuffType: "statusEffect",
      effects: [
        { id : "doom_whisper_debuff",
          name: "Whisper of Doom",
          description: "Doom stacking: -1 to -2 Spirit saves per stack",
          statusType: "doom",
          doomStack: true,
          doomStackValue: 1,
          mechanicsText:
            "Afflicts the target with Doom, reducing Spirit saves. Stacks with other Doom effects.",
        },
      ],
      durationType: "rounds",
      durationValue: 2,
      durationUnit: "rounds",
    },
    damageConfig: {
      formula: "1d6",
      damageTypes: ["psychic"],
      resolution: "PROPHECY",
    },
    cooldownConfig: {
      cooldownType: "none",
      cooldownValue: 0,
    },
    tags: ["debuff", "damage", "psychic", "prophecy", "requiem", "doom"],
  },

  { id : "doomsayer_omen_flame",
    name: "Omen Flame",
    description:
      "You speak the word that burns and your palms blister as prophetic fire takes shape — a flame that burns with the heat of a thousand dying suns, each tongue of fire a premonition of something that has not yet ended but already smells of ash. The flesh on your hands cracks and weeps as you release it.",
    spellType: "ACTION",
    icon: "Fire/Fire Bolt",
    level: 1,
    specialization: "cataclysm",
    effectTypes: ["damage"],
    typeConfig: {
      school: "fire",
      castTime: 1,
      castTimeType: "IMMEDIATE",
      icon: "Fire/Fire Bolt",
    },
    targetingConfig: {
      targetingType: "single",
      rangeDistance: 40,
      targetRestrictions: ["enemies"],
      rangeType: "ranged",
    },
    resourceCost: {
      actionPoints: 1,
      mana: 5,
      classResource: {
        type: "havoc",
        cost: -2,
      },
    },
    resolution: "PROPHECY",
    mechanicsConfig: [
      {
        enabled: true,
        system: "PROPHECY",
        prophecy: {
          rangeDice: ["d6", "d6"],
          resolutionDie: "d6",
          prophesied: {
            damage: "3d6 fire + 1d6 force",
            effect: {
              name: "Ignited",
              duration: 3,
              unit: "rounds",
              damagePerRound: "1d6",
              damageType: "fire",
              description:
                "Prophetic flames cling to the target, searing flesh with the heat of prophecy itself. 1d6 fire damage per round for 3 rounds.",
            },
            havocGain: 2,
            description:
              "Deals 3d6 fire + 1d6 force damage and ignites the target (1d6 fire/round, 3 rounds).",
          },
          base: {
            damage: "2d6 fire",
            havocGain: 1,
            description: "Deals 2d6 fire damage.",
          },
          outside: {
            backlash: "1d4 fire to self",
            havocGain: 0,
            description:
              "The flames sear the speaker's hands instead. Your blistered palms scream as 1d4 fire damage crawls up your fingers.",
          },
        },
      },
    ],
    damageConfig: {
      formula: "2d6",
      damageTypes: ["fire", "force"],
      resolution: "PROPHECY",
      dotConfig: {
        enabled: true,
        damagePerTick: "1d6",
        damageType: "fire",
        tickFrequency: "round",
        duration: 3,
        canStack: false,
        maxStacks: 1,
      },
    },
    cooldownConfig: {
      cooldownType: "none",
      cooldownValue: 0,
    },
    tags: ["damage", "fire", "force", "prophecy", "cataclysm", "dot"],
  },

  { id : "doomsayer_omen_of_ash",
    name: "Omen of Ash",
    description:
      "A creeping doom seeps from your fingertips — a withering prophecy that turns living flesh to ash, cell by cell. The target's skin grays and cracks as the doom burrows in, and you feel your own flesh trying to slough off your bones in sympathy. Some truths should not be spoken aloud.",
    spellType: "ACTION",
    icon: "Void/Black Hole",
    level: 1,
    specialization: "endbringer",
    effectTypes: ["damage", "debuff"],
    typeConfig: {
      school: "necrotic",
      castTime: 1,
      castTimeType: "IMMEDIATE",
      icon: "Void/Black Hole",
    },
    targetingConfig: {
      targetingType: "single",
      rangeDistance: 30,
      targetRestrictions: ["enemies"],
      rangeType: "ranged",
    },
    resourceCost: {
      actionPoints: 1,
      mana: 5,
      classResource: {
        type: "havoc",
        cost: -2,
      },
    },
    resolution: "PROPHECY",
    mechanicsConfig: [
      {
        enabled: true,
        system: "PROPHECY",
        prophecy: {
          rangeDice: ["d6", "d4"],
          resolutionDie: "d4",
          prophesied: {
            damage: "2d6",
            effect: {
              id : "creeping_doom",
              name: "Creeping Doom",
              duration: 3,
              unit: "rounds",
              damagePerRound: "1d4",
              damageType: "necrotic",
              statModifiers: [
                {
                  stat: "ALL ROLLS",
                  value: -1,
                  magnitudeType: "penalty",
                },
              ],
              description:
                "Flesh withers like ash in wind. Target takes 1d4 necrotic damage per round and suffers -1 to all rolls for 3 rounds as the doom eats them from the inside.",
            },
            havocGain: 2,
            description:
              "Deals 2d6 necrotic damage and afflicts the target with Creeping Doom (1d4 necrotic/round + -1 all rolls, 3 rounds).",
          },
          base: {
            damage: "1d6",
            havocGain: 1,
            description: "Deals 1d6 necrotic damage.",
          },
          outside: {
            backlash: "1d4 psychic to self",
            havocGain: 0,
            description:
              "The decay reaches for you instead. Your own skin crawls with phantom rot as 1d4 psychic damage wracks your body.",
          },
        },
      },
    ],
    damageConfig: {
      formula: "1d6",
      damageTypes: ["necrotic"],
      resolution: "PROPHECY",
    },
    debuffConfig: {
      debuffType: "statusEffect",
      effects: [
        { id : "creeping_doom",
          name: "Creeping Doom",
          description: "1d4 necrotic/round + -1 to all rolls for 3 rounds",
          statusType: "dot_penalty",
          mechanicsText:
            "Target withers under necrotic decay. Damage and penalty each round.",
        },
      ],
      durationType: "rounds",
      durationValue: 3,
      durationUnit: "rounds",
    },
    cooldownConfig: {
      cooldownType: "none",
      cooldownValue: 0,
    },
    tags: [
      "damage",
      "debuff",
      "necrotic",
      "prophecy",
      "endbringer",
      "dot",
    ],
  },

  // ============================================================
  // LEVEL 2 SPELLS (3)
  // ============================================================

  { id : "doomsayer_doom_countdown",
    name: "Doom Countdown",
    description:
      "You press your bloodied palm against the air and speak a number — and doom burrows into the target's flesh like a second heartbeat. Each round it ticks, a slow drumbeat of necrotic certainty building toward detonation. Your eyes bleed black as you set the countdown. The target will know exactly when the end comes. They just will not be able to stop it.",
    spellType: "ACTION",
    icon: "Necrotic/Skull Explosion",
    level: 2,
    specialization: "endbringer",
    effectTypes: ["damage", "debuff"],
    typeConfig: {
      school: "necrotic",
      castTime: 1,
      castTimeType: "IMMEDIATE",
      icon: "Necrotic/Skull Explosion",
    },
    targetingConfig: {
      targetingType: "single",
      rangeDistance: 40,
      targetRestrictions: ["enemies"],
      rangeType: "ranged",
    },
    resourceCost: {
      actionPoints: 2,
      mana: 8,
      hp: 5,
      classResource: {
        type: "havoc",
        cost: -3,
      },
    },
    resolution: "PROPHECY",
    mechanicsConfig: [
      {
        enabled: true,
        system: "PROPHECY",
        prophecy: {
          rangeDice: ["d6", "d4"],
          resolutionDie: "d4",
          tickDamage: "1d6 necrotic",
          prophesied: {
            damage: "4d8",
            effect: {
              id : "doom_i",
              name: "Doom I",
              duration: 2,
              unit: "rounds",
              statModifiers: [
                {
                  stat: "spirit",
                  value: -1,
                  magnitudeType: "penalty",
                },
              ],
              description:
                "The detonation plants a doom seed. Target suffers -1 to Spirit saves for 2 rounds.",
              doomStack: true,
              doomStackValue: 1,
            },
            havocGain: 3,
            description:
              "Detonates for 4d8 necrotic damage. Target suffers Doom I (-1 Spirit saves, 2 rounds).",
          },
          base: {
            damage: "2d8",
            havocGain: 1,
            description: "Detonates for 2d8 necrotic damage.",
          },
          outside: {
            backlash: "1d8 necrotic to self",
            havocGain: 0,
            description:
              "The countdown backfires. The doom that was meant for another crawls back up through your veins, dealing 1d8 necrotic damage to you.",
          },
        },
      },
    ],
    damageConfig: {
      formula: "1d6",
      damageTypes: ["necrotic"],
      resolution: "PROPHECY",
    },
    durationConfig: {
      durationValue: 3,
      durationUnit: "rounds",
      concentrationRequired: true,
      durationType: "rounds",
    },
    cooldownConfig: {
      cooldownType: "turn_based",
      cooldownValue: 3,
    },
    tags: [
      "damage",
      "debuff",
      "necrotic",
      "prophecy",
      "endbringer",
      "delayed",
      "concentration",
      "doom",
    ],
  },

  { id : "doomsayer_calamity_zone",
    name: "Calamity Zone",
    description:
      "The ground ruptures in prophetic fire as you speak the zone into existence. The word tastes like copper and ash on your tongue — every syllable a small sacrifice. Flames erupt in a ring of devastation, and the earth itself remembers what you said and refuses to forget. The zone burns with the memory of every ending you have ever witnessed.",
    spellType: "ACTION",
    icon: "Fire/Fire Storm",
    level: 2,
    specialization: "cataclysm",
    effectTypes: ["damage"],
    typeConfig: {
      school: "fire",
      castTime: 1,
      castTimeType: "IMMEDIATE",
      icon: "Fire/Fire Storm",
    },
    targetingConfig: {
      targetingType: "area",
      areaShape: "circle",
      areaSize: 15,
      rangeDistance: 40,
      rangeType: "ranged",
      targetRestrictions: ["enemies"],
    },
    resourceCost: {
      actionPoints: 2,
      mana: 10,
      classResource: {
        type: "havoc",
        cost: -4,
      },
    },
    resolution: "PROPHECY",
    mechanicsConfig: [
      {
        enabled: true,
        system: "PROPHECY",
        prophecy: {
          rangeDice: ["d10", "d8"],
          resolutionDie: "d8",
          prophesied: {
            damage: "3d8 fire + 1d8 force",
            effect: {
              name: "Burning Ground",
              duration: 3,
              unit: "rounds",
              damagePerRound: "1d4",
              damageType: "fire",
              description:
                "The 15ft zone becomes burning difficult terrain for 3 rounds. Enemies entering or starting their turn in the zone take 1d4 fire damage and are reduced to half movement speed.",
            },
            havocGain: 4,
            description:
              "Deals 3d8 fire + 1d8 force to all in area. Zone becomes burning difficult terrain (1d4 fire/round, half speed) for 3 rounds.",
          },
          base: {
            damage: "2d8 fire",
            havocGain: 2,
            description: "Deals 2d8 fire damage to all in area.",
          },
          outside: {
            backlash: "1d6 fire to self",
            havocGain: 0,
            description:
              "The ground erupts beneath you instead. Flames lick at your heels as 1d6 fire damage scorches your legs.",
          },
        },
      },
    ],
    damageConfig: {
      formula: "2d8",
      damageTypes: ["fire", "force"],
      resolution: "PROPHECY",
    },
    cooldownConfig: {
      cooldownType: "turn_based",
      cooldownValue: 3,
    },
    tags: ["damage", "fire", "force", "prophecy", "cataclysm", "area"],
  },

  { id : "doomsayer_death_mark",
    name: "Death Mark",
    description:
      "Your throat constricts painfully as the death brand burns itself into existence — a sigil of absolute ending that sears into the target's very soul. The brand pulses with the rhythm of their heartbeat, counting down to a close they cannot escape. You cannot speak for a moment after casting this; the word of death always takes something from the speaker.",
    spellType: "ACTION",
    icon: "Necrotic/Death Mark",
    level: 2,
    specialization: "requiem",
    effectTypes: ["damage", "debuff"],
    typeConfig: {
      school: "necrotic",
      castTime: 1,
      castTimeType: "IMMEDIATE",
      icon: "Necrotic/Death Mark",
    },
    targetingConfig: {
      targetingType: "single",
      rangeDistance: 30,
      targetRestrictions: ["enemies"],
      rangeType: "ranged",
    },
    resourceCost: {
      actionPoints: 2,
      mana: 10,
      classResource: {
        type: "havoc",
        cost: 1,
      },
    },
    resolution: "PROPHECY",
    mechanicsConfig: [
      {
        enabled: true,
        system: "PROPHECY",
        prophecy: {
          rangeDice: ["d4", "d4"],
          resolutionDie: "d4",
          prophesied: {
            damage: "6d8",
            effect: {
              id : "marked_for_death",
              name: "Marked for Death",
              duration: 5,
              unit: "rounds",
              healingBlock: true,
              bonusDamageTaken: "1d8",
              bonusDamageType: "necrotic",
              description:
                "Branded with inevitable death. The target cannot be healed by any means and takes +1d8 necrotic damage from every source that hits them for 5 rounds. The mark knows their name.",
            },
            havocGain: 0,
            description:
              "Deals 6d8 necrotic damage and brands the target for 5 rounds: no healing + +1d8 necrotic from all incoming damage.",
          },
          base: {
            damage: "3d8",
            havocGain: 0,
            description: "Deals 3d8 necrotic damage. No mark applied.",
          },
          outside: {
            backlash: "2d8 necrotic to self + Doom I",
            havocGain: 0,
            effect: {
              id : "doom_i",
              name: "Doom I",
              duration: 2,
              unit: "rounds",
              statModifiers: [
                {
                  stat: "spirit",
                  value: -1,
                  magnitudeType: "penalty",
                },
              ],
              description:
                "The death mark rebounds. You suffer -1 to Spirit saves for 2 rounds as your own ending whispers to you.",
              doomStack: true,
              doomStackValue: 1,
            },
            description:
              "The death mark rebounds, dealing 2d8 necrotic damage to you and afflicting you with Doom I (-1 Spirit saves, 2 rounds).",
          },
        },
      },
    ],
    damageConfig: {
      formula: "3d8",
      damageTypes: ["necrotic"],
      resolution: "PROPHECY",
    },
    debuffConfig: {
      debuffType: "statusEffect",
      effects: [
        { id : "marked_for_death",
          name: "Marked for Death",
          description: "No healing + +1d8 necrotic from all damage sources, 5 rounds",
          statusType: "death_mark",
          mechanicsText:
            "Target cannot be healed and takes bonus necrotic from all incoming damage.",
        },
      ],
      durationType: "rounds",
      durationValue: 5,
      durationUnit: "rounds",
    },
    cooldownConfig: {
      cooldownType: "turn_based",
      cooldownValue: 3,
    },
    tags: ["damage", "debuff", "necrotic", "prophecy", "requiem", "precision"],
  },

  // ============================================================
  // LEVEL 3 SPELLS (3)
  // ============================================================

  { id : "doomsayer_havoc_blast",
    name: "Havoc Blast",
    description:
      "You tear open a wound in fate itself and convert raw Havoc into a devastating blast of pure force. The energy rips through your arms before launching — muscles tearing, veins bulging black — and erupts toward the target in a shrieking column of devastation. Your limbs shake for a long moment after. The price of weaponizing chaos is always paid in flesh.",
    spellType: "ACTION",
    icon: "Arcane/Swirling Vortex",
    level: 3,
    specialization: "universal",
    effectTypes: ["damage"],
    typeConfig: {
      school: "force",
      castTime: 1,
      castTimeType: "IMMEDIATE",
      icon: "Arcane/Swirling Vortex",
    },
    targetingConfig: {
      targetingType: "single",
      rangeDistance: 50,
      targetRestrictions: ["enemies"],
      rangeType: "ranged",
    },
    resourceCost: {
      actionPoints: 2,
      mana: 14,
      hp: 3,
      classResource: {
        type: "havoc",
        cost: 3,
      },
    },
    resolution: "PROPHECY",
    mechanicsConfig: [
      {
        enabled: true,
        system: "PROPHECY",
        prophecy: {
          rangeDice: ["d10", "d10"],
          resolutionDie: "d10",
          prophesied: {
            damage: "5d10",
            havocGain: 0,
            description: "Deals 5d10 force damage.",
          },
          base: {
            damage: "3d10",
            havocGain: 0,
            description: "Deals 3d10 force damage.",
          },
          outside: {
            backlash: "2d10 force to self",
            havocGain: 0,
            description:
              "The Havoc detonates in your grasp. The force tears through your arms, dealing 2d10 force damage to you.",
          },
        },
      },
    ],
    damageConfig: {
      formula: "3d10",
      damageTypes: ["force"],
      resolution: "PROPHECY",
    },
    cooldownConfig: {
      cooldownType: "turn_based",
      cooldownValue: 3,
    },
    tags: ["damage", "force", "prophecy", "universal", "havoc"],
  },

  { id : "doomsayer_escalating_doom",
    name: "Escalating Doom",
    description:
      "A doom that grows more devastating with each passing moment. You plant the seed of ending in the target's flesh and with every round that passes it swells — a tumor of pure destructive force that feeds on time itself. Your sanity frays at the edges as the prophecy accumulates power; you can feel the weight of accumulated doom pressing against the inside of your skull. When it finally detonates, the world holds its breath.",
    spellType: "ACTION",
    icon: "Void/Black Hole",
    level: 3,
    specialization: "endbringer",
    effectTypes: ["damage", "debuff"],
    typeConfig: {
      school: "force",
      castTime: 1,
      castTimeType: "IMMEDIATE",
      icon: "Void/Black Hole",
    },
    targetingConfig: {
      targetingType: "single",
      rangeDistance: 40,
      targetRestrictions: ["enemies"],
      rangeType: "ranged",
    },
    resourceCost: {
      actionPoints: 2,
      mana: 12,
      hp: 5,
      classResource: {
        type: "havoc",
        cost: -2,
      },
    },
    resolution: "PROPHECY",
    mechanicsConfig: [
      {
        enabled: true,
        system: "PROPHECY",
        prophecy: {
          rangeDice: ["d8", "d6"],
          resolutionDie: "d6",
          tickDamage: {
            formula: "1d8",
            scaling: "+1d6 per round",
            damageTypes: ["force"],
          },
          prophesied: {
            damage: "4d10",
            effect: {
              id : "doom_ii",
              name: "Doom II",
              duration: 2,
              unit: "rounds",
              damagePerRound: "2d6",
              damageType: "force",
              statModifiers: [
                {
                  stat: "spirit",
                  value: -2,
                  magnitudeType: "penalty",
                },
              ],
              description:
                "The detonation unleashes accumulated doom. Target takes 2d6 force/round and -2 to Spirit saves for 2 rounds. Roll on the Detonation Table.",
              doomStack: true,
              doomStackValue: 2,
            },
            havocGain: 5,
            description:
              "Deals 4d10 force detonation + 2d6 force/round for 2 rounds + Doom II. Roll on Detonation Table.",
          },
          base: {
            damage: "2d10",
            havocGain: 2,
            description:
              "Deals 2d10 force detonation plus accumulated bonus damage.",
          },
          outside: {
            backlash: "1d10 force to self",
            havocGain: 0,
            description:
              "The doom collapses prematurely. The accumulated force recoils through your body, dealing 1d10 force damage.",
          },
        },
      },
    ],
    damageConfig: {
      formula: "1d8",
      damageTypes: ["force"],
      resolution: "PROPHECY",
    },
    durationConfig: {
      durationValue: 5,
      durationUnit: "rounds",
      concentrationRequired: true,
      durationType: "rounds",
    },
    triggerConfig: {
      triggers: [
        { id : "escalation_tick",
          name: "Doom Escalation",
          triggerType: "start_of_turn",
          action:
            "Increase bonus damage by 1d6 and deal 1d8 base force damage",
        },
      ],
    },
    tableConfig: {
      name: "Detonation Table",
      die: "1d6",
      rolls: [
        {
          roll: "1-2",
          effect:
            "Shockwave: All targets within 10ft knocked back 10ft",
        },
        {
          roll: "3-4",
          effect:
            "Lingering Void: Target takes 1d10 force damage per round for 2 rounds",
        },
        {
          roll: "5",
          effect:
            "Fate Breach: Target suffers -2 penalty to their next saving throw",
        },
        {
          roll: "6",
          effect:
            "Cascading Blast: The detonation deals an additional +2d10 force damage",
        },
      ],
    },
    cooldownConfig: {
      cooldownType: "turn_based",
      cooldownValue: 3,
    },
    tags: [
      "damage",
      "debuff",
      "force",
      "prophecy",
      "endbringer",
      "delayed",
      "escalating",
      "concentration",
      "doom",
    ],
  },

  { id : "doomsayer_rain_of_doom",
    name: "Rain of Doom",
    description:
      "You scream the zone into being and your voice cracks — a wet, broken sound that tastes of iron. Above the targeted area, the sky bruises and prophetic effects begin to rain down, each one a different flavor of catastrophe visited upon every enemy within. The rain does not discriminate. It simply ends.",
    spellType: "ACTION",
    icon: "Chaos/Comet Rain",
    level: 3,
    specialization: "cataclysm",
    effectTypes: ["damage"],
    typeConfig: {
      school: "force",
      castTime: 1,
      castTimeType: "IMMEDIATE",
      icon: "Chaos/Comet Rain",
    },
    targetingConfig: {
      targetingType: "area",
      areaShape: "circle",
      areaSize: 30,
      rangeDistance: 50,
      rangeType: "ranged",
      targetRestrictions: ["enemies"],
    },
    resourceCost: {
      actionPoints: 2,
      mana: 16,
      hp: 5,
      classResource: {
        type: "havoc",
        cost: 3,
      },
    },
    resolution: "PROPHECY",
    mechanicsConfig: [
      {
        enabled: true,
        system: "PROPHECY",
        prophecy: {
          rangeDice: ["d6", "d6"],
          resolutionDie: "d6",
          prophesied: {
            effect: {
              name: "Double Rain",
              description:
                "Roll twice on the Rain Table. Both results apply to ALL enemies in the 30ft zone.",
            },
            havocGain: 4,
            description:
              "Roll twice on the Rain Table. Each result applies to all enemies in the zone.",
          },
          base: {
            effect: {
              name: "Single Rain",
              description:
                "Roll once on the Rain Table. Result applies to all enemies in the 30ft zone.",
            },
            havocGain: 2,
            description:
              "Roll once on the Rain Table. Result applies to all enemies in the zone.",
          },
          outside: {
            backlash: {
              name: "Self Rain",
              description:
                "The rain falls on YOU instead. Roll once on the Rain Table and apply the result to yourself.",
            },
            havocGain: 0,
            description:
              "The rain turns. Fate's cruelty finds its source. Roll on the Rain Table against yourself.",
          },
        },
      },
    ],
    damageConfig: {
      formula: "2d6",
      damageTypes: ["force"],
      resolution: "PROPHECY",
    },
    durationConfig: {
      durationValue: 3,
      durationUnit: "rounds",
      concentrationRequired: true,
      durationType: "rounds",
    },
    tableConfig: {
      name: "Rain Table",
      die: "1d6",
      rolls: [
        {
          roll: "1",
          effect: "2d6 fire damage to all",
        },
        {
          roll: "2",
          effect: "2d6 necrotic damage to all",
        },
        {
          roll: "3",
          effect: "2d6 psychic damage to all",
        },
        {
          roll: "4",
          effect: "1d6 force damage + knocked prone",
        },
        {
          roll: "5",
          effect: "Doom II: -2 Spirit saves for 2 rounds (Spirit save DC SPELL_DC negates)",
        },
        {
          roll: "6",
          effect: "Roll twice on this table",
        },
      ],
    },
    cooldownConfig: {
      cooldownType: "turn_based",
      cooldownValue: 3,
    },
    tags: [
      "damage",
      "prophecy",
      "cataclysm",
      "area",
      "table",
      "concentration",
    ],
  },

  // ============================================================
  // LEVEL 4 SPELLS (3)
  // ============================================================

  { id : "doomsayer_requiem_of_death",
    name: "Requiem of Death",
    description:
      "A focused death prophecy of devastating precision. You speak the target's ending in a voice that is not your own — something older speaks through you, something that remembers every death that has ever occurred and catalogs them like music. Your eyes weep black ichor as the requiem builds. The target's flesh splits along invisible seams as the prophecy carves itself into their very being.",
    spellType: "ACTION",
    icon: "Necrotic/Necrotic Skull",
    level: 4,
    specialization: "requiem",
    effectTypes: ["damage", "debuff"],
    typeConfig: {
      school: "necrotic",
      castTime: 1,
      castTimeType: "IMMEDIATE",
      icon: "Necrotic/Necrotic Skull",
    },
    targetingConfig: {
      targetingType: "single",
      rangeDistance: 40,
      targetRestrictions: ["enemies"],
      rangeType: "ranged",
    },
    resourceCost: {
      actionPoints: 2,
      mana: 20,
      hp: 8,
      classResource: {
        type: "havoc",
        cost: 4,
      },
    },
    resolution: "PROPHECY",
    mechanicsConfig: [
      {
        enabled: true,
        system: "PROPHECY",
        prophecy: {
          rangeDice: ["d6", "d4"],
          resolutionDie: "d4",
          prophesied: {
            damage: "8d10",
            effect: {
              id : "soul_wound",
              name: "Soul Wound",
              duration: 5,
              unit: "rounds",
              damagePerRound: "1d6",
              damageType: "necrotic",
              healingBlock: true,
              description:
                "Spiritual wounds that refuse to close. Target cannot be healed by any means and bleeds 1d6 necrotic damage at the start of each turn for 5 rounds. The soul remembers what the body tries to forget.",
            },
            havocGain: 6,
            description:
              "Deals 8d10 necrotic damage and inflicts Soul Wound: no healing + 1d6 necrotic/round for 5 rounds.",
          },
          base: {
            damage: "5d10",
            havocGain: 3,
            description: "Deals 5d10 necrotic damage.",
          },
          outside: {
            backlash: "3d10 necrotic to self + Doom II",
            havocGain: 0,
            effect: {
              id : "doom_ii",
              name: "Doom II",
              duration: 2,
              unit: "rounds",
              statModifiers: [
                {
                  stat: "spirit",
                  value: -2,
                  magnitudeType: "penalty",
                },
              ],
              description:
                "The requiem turns. Your own soul bleeds as the death prophecy finds no target. -2 to Spirit saves for 2 rounds.",
              doomStack: true,
              doomStackValue: 2,
            },
            description:
              "Deals 3d10 necrotic damage to you and afflicts you with Doom II (-2 Spirit saves, 2 rounds).",
          },
        },
      },
    ],
    damageConfig: {
      formula: "5d10",
      damageTypes: ["necrotic"],
      resolution: "PROPHECY",
    },
    cooldownConfig: {
      cooldownType: "turn_based",
      cooldownValue: 2,
    },
    tags: ["damage", "debuff", "necrotic", "prophecy", "requiem"],
  },

  { id : "doomsayer_doom_aura",
    name: "Doom Aura",
    description:
      "Your mere presence becomes a weapon. An aura of escalating doom radiates outward — a crushing weight that makes the air thick with the stench of endings. Nearby enemies feel their will to fight drain away as the certainty of their defeat settles into their bones like lead. You do not speak this power into being. You simply ARE, and that is enough to break them.",
    spellType: "ACTION",
    icon: "Necrotic/Necrotic Wither",
    level: 4,
    specialization: "endbringer",
    effectTypes: ["debuff"],
    typeConfig: {
      school: "psychic",
      castTime: 1,
      castTimeType: "IMMEDIATE",
      icon: "Necrotic/Necrotic Wither",
    },
    targetingConfig: {
      targetingType: "self_centered",
      areaShape: "circle",
      areaSize: 20,
      rangeType: "self_centered",
      targetRestrictions: ["any"],
    },
    resourceCost: {
      actionPoints: 2,
      mana: 18,
      classResource: {
        type: "havoc",
        cost: 3,
      },
    },
    resolution: "AUTOMATIC",
    debuffConfig: {
      debuffType: "aura",
      effects: [
        { id : "doom_aura_debuff",
          name: "Doom Aura",
          description: "-2 to all rolls, increasing by -1 per round (max -5)",
          statusType: "doom_aura",
          mechanicsText:
            "Penalty increases by -1 each round the target remains in the aura.",
        },
      ],
      durationValue: 5,
      durationType: "rounds",
      durationUnit: "rounds",
    },
    durationConfig: {
      durationValue: 5,
      durationUnit: "rounds",
      concentrationRequired: true,
      durationType: "rounds",
    },
    statusEffectsConfig: [
      {
        name: "Doom Aura",
        duration: 5,
        unit: "rounds",
        statModifiers: [
          {
            stat: "ALL ROLLS",
            value: -2,
            magnitudeType: "penalty",
          },
        ],
        description:
          "Nearby enemies feel the crushing weight of their coming end. -2 to all rolls, increasing by -1 per round (max -5).",
      },
    ],
    triggerConfig: {
      triggers: [
        { id : "aura_debuff",
          name: "Doom Presence",
          triggerType: "passive_aura",
          action:
            "Enemies take -2 to all rolls, increasing by -1 per round (max -5)",
        },
        { id : "aura_havoc",
          name: "Havoc Siphon",
          triggerType: "end_of_turn",
          action: "Gain 1 Havoc per enemy within the aura",
        },
      ],
    },
    cooldownConfig: {
      cooldownType: "turn_based",
      cooldownValue: 2,
    },
    tags: ["debuff", "aura", "endbringer", "concentration"],
  },

  { id : "doomsayer_cataclysm_blast",
    name: "Cataclysm Blast",
    description:
      "A massive area prophecy detonation that tears open a wound in the world. Fire and necrotic energy cascade outward in a ring of annihilation, and your chest constricts as though your heart is being crushed in a fist of pure malice. The ground itself cracks and groans under the weight of what you have spoken. Nothing grows here again. Nothing ever will.",
    spellType: "ACTION",
    icon: "Fire/Volcanic Erupt",
    level: 4,
    specialization: "cataclysm",
    effectTypes: ["damage"],
    typeConfig: {
      school: "fire",
      secondaryElement: "necrotic",
      castTime: 1,
      castTimeType: "IMMEDIATE",
      icon: "Fire/Volcanic Erupt",
    },
    targetingConfig: {
      targetingType: "area",
      areaShape: "circle",
      areaSize: 25,
      rangeDistance: 50,
      rangeType: "ranged",
      targetRestrictions: ["enemies"],
    },
    resourceCost: {
      actionPoints: 2,
      mana: 20,
      hp: 8,
      classResource: {
        type: "havoc",
        cost: 4,
      },
    },
    resolution: "PROPHECY",
    mechanicsConfig: [
      {
        enabled: true,
        system: "PROPHECY",
        prophecy: {
          rangeDice: ["d10", "d8"],
          resolutionDie: "d8",
          prophesied: {
            damage: "6d8 fire + 3d8 necrotic",
            effect: {
              name: "Difficult Terrain",
              duration: 5,
              unit: "rounds",
              description:
                "The area becomes shattered, difficult terrain for 5 rounds. The ground itself bears the scars of your prophecy.",
            },
            havocGain: 6,
            description:
              "Deals 6d8 fire + 3d8 necrotic to all in area. Zone becomes difficult terrain for 5 rounds.",
          },
          base: {
            damage: "4d8 fire + 2d8 necrotic",
            havocGain: 3,
            description: "Deals 4d8 fire + 2d8 necrotic to all in area.",
          },
          outside: {
            backlash: "2d8 to self + Doom I",
            havocGain: 0,
            effect: {
              id : "doom_i",
              name: "Doom I",
              duration: 2,
              unit: "rounds",
              statModifiers: [
                {
                  stat: "spirit",
                  value: -1,
                  magnitudeType: "penalty",
                },
              ],
              description:
                "The cataclysm recoils. You suffer Doom I (-1 Spirit saves) as prophetic backlash.",
              doomStack: true,
              doomStackValue: 1,
            },
            description:
              "Deals 2d8 damage to you and afflicts you with Doom I (-1 Spirit saves, 2 rounds).",
          },
        },
      },
    ],
    damageConfig: {
      formula: "4d8+2d8",
      damageTypes: ["fire", "necrotic"],
      resolution: "PROPHECY",
    },
    cooldownConfig: {
      cooldownType: "turn_based",
      cooldownValue: 2,
    },
    tags: ["damage", "fire", "necrotic", "prophecy", "cataclysm", "area"],
  },

  // ============================================================
  // LEVEL 5 SPELLS (3)
  // ============================================================

  { id : "doomsayer_prophecy_of_ruin",
    name: "Prophecy of Ruin",
    description:
      "Reality itself ruptures. You speak a word that should not exist — a word that IS ending, that MEANS ending, that MAKES ending — and it tears through you like shrapnel. Your nose bleeds profusely, your eyes roll back, and for one terrible moment you see exactly how everything dies. Fire, necrotic rot, psychic dissolution, and the raw force of oblivion cascade across the battlefield. The word echoes long after you stop speaking. It will never fully stop.",
    spellType: "ACTION",
    icon: "Void/Red Energy Burst",
    level: 5,
    specialization: "universal",
    effectTypes: ["damage", "debuff"],
    typeConfig: {
      school: "fire",
      secondaryElement: "necrotic",
      castTime: 1,
      castTimeType: "IMMEDIATE",
      icon: "Void/Red Energy Burst",
    },
    targetingConfig: {
      targetingType: "area",
      areaShape: "circle",
      areaSize: 20,
      rangeDistance: 60,
      rangeType: "ranged",
      targetRestrictions: ["enemies"],
    },
    resourceCost: {
      actionPoints: 2,
      mana: 25,
      hp: 10,
      classResource: {
        type: "havoc",
        cost: 5,
      },
    },
    resolution: "PROPHECY",
    mechanicsConfig: [
      {
        enabled: true,
        system: "PROPHECY",
        prophecy: {
          rangeDice: ["d12", "d8"],
          resolutionDie: "d8",
          prophesied: {
            damage: "8d8",
            effect: {
              id : "doom_iii",
              name: "Doom III",
              duration: 2,
              unit: "rounds",
              statModifiers: [
                {
                  stat: "spirit",
                  value: -3,
                  magnitudeType: "penalty",
                },
              ],
              description:
                "The word of ruin brands all it touches. Targets suffer -3 to Spirit saves for 2 rounds as the prophecy etches itself into their very essence.",
              doomStack: true,
              doomStackValue: 3,
            },
            havocGain: 8,
            description:
              "Deals 8d8 mixed damage to all in area + Doom III (-3 Spirit saves, 2 rounds).",
          },
          base: {
            damage: "5d8",
            havocGain: 4,
            description: "Deals 5d8 mixed damage to all in area.",
          },
          outside: {
            backlash: "3d8 to self + Doom II",
            havocGain: 0,
            effect: {
              id : "doom_ii",
              name: "Doom II",
              duration: 2,
              unit: "rounds",
              statModifiers: [
                {
                  stat: "spirit",
                  value: -2,
                  magnitudeType: "penalty",
                },
              ],
              description:
                "The word of ruin turns on its speaker. You suffer -2 to Spirit saves for 2 rounds.",
              doomStack: true,
              doomStackValue: 2,
            },
            description:
              "Deals 3d8 damage to you and afflicts you with Doom II (-2 Spirit saves, 2 rounds).",
          },
        },
      },
    ],
    damageConfig: {
      formula: "5d8",
      damageTypes: ["fire", "necrotic", "psychic", "force"],
      resolution: "PROPHECY",
    },
    cooldownConfig: {
      cooldownType: "turn_based",
      cooldownValue: 2,
    },
    tags: [
      "damage",
      "debuff",
      "prophecy",
      "universal",
      "area",
      "doom",
    ],
  },

  { id : "doomsayer_stacked_doom",
    name: "Stacked Doom",
    description:
      "You SCREAM and blood pours from your mouth. Every active prophecy on the target detonates simultaneously — a cascade of fulfilled doom that rips through the victim in a single, devastating convulsion. Each prophecy resolves as its Prophesied outcome, no mercy, no second chances. If three or more prophecies tear open at once, the accumulated catastrophe is so total that the victim's spirit simply breaks. The scream never leaves your lips. It stays inside, where it has always been.",
    spellType: "ACTION",
    icon: "Necrotic/Skull Burst",
    level: 5,
    specialization: "requiem",
    effectTypes: ["damage", "control"],
    typeConfig: {
      school: "necrotic",
      castTime: 1,
      castTimeType: "IMMEDIATE",
      icon: "Necrotic/Skull Burst",
    },
    targetingConfig: {
      targetingType: "single",
      rangeDistance: 30,
      targetRestrictions: ["enemies"],
      rangeType: "ranged",
    },
    resourceCost: {
      actionPoints: 3,
      mana: 24,
      hp: 12,
      classResource: {
        type: "havoc",
        cost: 6,
      },
    },
    resolution: "AUTOMATIC",
    damageConfig: {
      formula: "2d8 × active_prophecies",
      damageTypes: ["necrotic"],
      resolution: "AUTOMATIC",
      dotConfig: {
        enabled: false,
      },
    },
    controlConfig: {
      controlType: "incapacitation",
      effects: [
        { id : "doom_iv",
          controlType: "incapacitation",
          name: "Doom IV",
          description:
            "Target suffers -4 to Spirit saves for 2 rounds when 3+ prophecies detonated simultaneously",
          statusType: "doom",
          doomStack: true,
          doomStackValue: 4,
          mechanicsText:
            "Triggered when 3 or more active prophecies are detonated simultaneously. Spirit breaks under accumulated doom.",
          config: {
            duration: 2,
            durationUnit: "rounds",
            strength: "strong",
            recoveryMethod: "save",
            durationType: "conditional",
          },
        },
      ],
      duration: 2,
      durationUnit: "rounds",
    },
    triggerConfig: {
      triggers: [
        { id : "mass_detonation",
          name: "Chain Detonation",
          triggerType: "on_cast",
          action:
            "All active prophecies on the target resolve as Prophesied. Each prophecy deals 2d8 necrotic damage. If 3+ prophecies detonated, target suffers Doom IV (-4 Spirit saves) for 2 rounds.",
        },
      ],
      conditionalEffects: {
        damage: {
          isConditional: true,
          defaultEnabled: false,
          conditionalFormulas: {
            "3+ prophecies": "2d8 × active_prophecies + Doom IV",
            "1-2 prophecies": "2d8 × active_prophecies",
            default: "2d8 × active_prophecies",
          },
        },
      },
    },
    cooldownConfig: {
      cooldownType: "turn_based",
      cooldownValue: 2,
    },
    tags: ["damage", "control", "prophecy", "requiem", "detonate", "doom"],
  },

  { id : "doomsayer_doom_nova",
    name: "Doom Nova",
    description:
      "An expanding wave of prophetic doom that rips outward from the impact point like the death scream of a dying star. Your entire body trembles as the nova launches — bones rattling, teeth cracking, blood vessels bursting behind your eyes. Fire and necrotic energy roll outward in a devastating ring, igniting everything they touch with prophetic flame. The battlefield will bear the scars of this word for generations. If there are generations left to count.",
    spellType: "ACTION",
    icon: "Fire/Fire Storm",
    level: 5,
    specialization: "cataclysm",
    effectTypes: ["damage"],
    typeConfig: {
      school: "fire",
      secondaryElement: "necrotic",
      castTime: 1,
      castTimeType: "IMMEDIATE",
      icon: "Fire/Fire Storm",
    },
    targetingConfig: {
      targetingType: "area",
      areaShape: "circle",
      areaSize: 40,
      rangeDistance: 60,
      rangeType: "ranged",
      targetRestrictions: ["enemies"],
    },
    resourceCost: {
      actionPoints: 3,
      mana: 26,
      hp: 10,
      classResource: {
        type: "havoc",
        cost: 6,
      },
    },
    resolution: "PROPHECY",
    mechanicsConfig: [
      {
        enabled: true,
        system: "PROPHECY",
        prophecy: {
          rangeDice: ["d12", "d10"],
          resolutionDie: "d10",
          prophesied: {
            damage: "6d8 fire + 6d8 necrotic",
            effect: {
              name: "Ignited",
              duration: 3,
              unit: "rounds",
              damagePerRound: "2d6 fire",
              dotDamageType: "fire",
              description:
                "Prophetic flames cling to all enemies. 2d6 fire damage per round for 3 rounds. The fire does not go out because the fire remembers.",
            },
            havocGain: 8,
            description:
              "Deals 6d8 fire + 6d8 necrotic and ignites all enemies (2d6 fire/round, 3 rounds).",
          },
          base: {
            damage: "4d8 fire + 4d8 necrotic",
            havocGain: 4,
            description: "Deals 4d8 fire + 4d8 necrotic to all enemies.",
          },
          outside: {
            backlash: "2d8 fire + 2d8 necrotic to self",
            havocGain: 0,
            description:
              "The nova collapses inward. You stand at ground zero as 2d8 fire + 2d8 necrotic damage detonates against your own flesh.",
          },
        },
      },
    ],
    damageConfig: {
      formula: "4d8 fire + 4d8 necrotic",
      damageTypes: ["fire", "necrotic"],
      resolution: "PROPHECY",
      dotConfig: {
        enabled: true,
        damagePerTick: "2d6",
        damageType: "fire",
        tickFrequency: "round",
        duration: 3,
        canStack: false,
        maxStacks: 1,
      },
    },
    durationConfig: {
      durationType: "rounds",
      durationValue: 3,
      durationUnit: "rounds",
    },
    cooldownConfig: {
      cooldownType: "turn_based",
      cooldownValue: 2,
    },
    tags: [
      "damage",
      "fire",
      "necrotic",
      "prophecy",
      "cataclysm",
      "area",
      "dot",
    ],
   },

/**
 * Doomsayer Spells Part 2: Levels 6-10 + Passives
 *
 * The darkest spells in the Doomsayer arsenal. Reality-breaking
 * prophecies, walking cataclysms, and the final requiems.
 * No 5e terminology. Prophecy resolution where applicable.
 */

  // ============================================================
  // LEVEL 6 SPELLS (3)
  // ============================================================

  { id : "doomsayer_cascade_doom",
    name: "Cascade Doom",
    description:
      "Chain reaction detonation. You speak the word that multiplies — each syllable splitting into a hundred prophetic embers that seek out every enemy in range. When the first target ignites, they BECOME the prophecy, detonating outward in a secondary explosion that engulfs everything nearby. The caster's veins bulge black as the cascade rips through their arms. Each link in the chain costs more blood than the last.",
    spellType: "ACTION",
    icon: "Fire/Fire Storm",
    level: 6,
    specialization: "cataclysm",
    effectTypes: ["damage"],
    typeConfig: {
      school: "fire",
      castTime: 1,
      castTimeType: "IMMEDIATE",
      icon: "Fire/Fire Storm",
    },
    targetingConfig: {
      targetingType: "area",
      areaShape: "circle",
      areaSize: 25,
      rangeDistance: 50,
      rangeType: "ranged",
      targetRestrictions: ["enemies"],
    },
    resourceCost: {
      actionPoints: 2,
      mana: 30,
      hp: 12,
      classResource: {
        type: "havoc",
        cost: 7,
      },
    },
    resolution: "PROPHECY",
    mechanicsConfig: [
      {
        enabled: true,
        system: "PROPHECY",
        prophecy: {
          rangeDice: ["d10", "d8"],
          resolutionDie: "d8",
          prophesied: {
            damage: "8d8 fire",
            effect: {
              name: "Cascade Detonation",
              description:
                "Each target hit becomes a secondary explosion, dealing 4d8 fire damage to all enemies within 15ft. Chain reactions propagate from secondary targets as well.",
              cascadeRadius: 15,
              cascadeDamage: "4d8",
              cascadeDamageType: "fire",
            },
            havocGain: 8,
            description:
              "Deals 8d8 fire damage. Each target detonates in a secondary 15ft explosion dealing 4d8 fire to nearby enemies.",
          },
          base: {
            damage: "5d8 fire",
            havocGain: 4,
            description: "Deals 5d8 fire damage to all in area.",
          },
          outside: {
            backlash: "3d8 fire to self",
            havocGain: 0,
            description:
              "The cascade collapses inward. The chain reaction finds no purchase and detonates against you instead, dealing 3d8 fire damage to yourself.",
          },
        },
      },
    ],
    damageConfig: {
      formula: "5d8",
      damageTypes: ["fire"],
      resolution: "PROPHECY",
    },
    cooldownConfig: {
      cooldownType: "long_rest",
      cooldownValue: 1,
    },
    tags: [
      "damage",
      "fire",
      "prophecy",
      "cataclysm",
      "area",
      "cascade",
    ],
  },

  { id : "doomsayer_endbringer_finale",
    name: "Endbringer Finale",
    description:
      "The final bell tolls. The caster has bled enough. This spell can only be unleashed after 5 rounds of combat — the caster has paid in blood for every round, and now the debt comes due. ALL active prophecies resolve as Prophesied automatically, reality surrendering to the accumulated weight of so much doom. Havoc generation doubles. Fire and necrotic energy erupt across the battlefield in a cataclysm that reshapes the terrain itself. When the dust settles, nothing remains unchanged.",
    spellType: "ACTION",
    icon: "Necrotic/Necrotic Skull",
    level: 6,
    specialization: "endbringer",
    effectTypes: ["damage"],
    typeConfig: {
      school: "necrotic",
      secondaryElement: "fire",
      castTime: 1,
      castTimeType: "IMMEDIATE",
      icon: "Necrotic/Necrotic Skull",
    },
    targetingConfig: {
      targetingType: "area",
      areaShape: "circle",
      areaSize: 60,
      rangeDistance: 60,
      rangeType: "ranged",
      targetRestrictions: ["enemies"],
    },
    resourceCost: {
      actionPoints: 3,
      mana: 32,
      hp: 15,
      classResource: {
        type: "havoc",
        cost: 8,
      },
    },
    resolution: "AUTOMATIC",
    damageConfig: {
      formula: "10d10",
      damageTypes: ["necrotic", "fire"],
      resolution: "AUTOMATIC",
    },
    triggerConfig: {
      triggers: [
        { id : "ultimate_detonation",
          name: "Ultimate Detonation",
          triggerType: "on_cast",
          action:
            "Requires 5 rounds of combat elapsed. All active prophecies on the battlefield resolve as Prophesied automatically. Havoc generation doubled for this cast.",
        },
      ],
      conditionalEffects: {
        damage: {
          isConditional: true,
          defaultEnabled: false,
          conditionalFormulas: {
            "5+ rounds combat": "10d10 necrotic+fire, all prophecies auto-Prophesied, double Havoc",
            default: "Cannot cast — requires 5 rounds of combat",
          },
        },
      },
    },
    cooldownConfig: {
      cooldownType: "long_rest",
      cooldownValue: 1,
    },
    tags: [
      "damage",
      "necrotic",
      "fire",
      "endbringer",
      "area",
      "ultimate",
      "prophecy_resolve",
    ],
  },

  { id : "doomsayer_execution_prophecy",
    name: "Execution Prophecy",
    description:
      "A lethal prophecy of absolute death. The caster's voice becomes something OTHER — hollow, resonant, inhuman — as they speak a word that exists outside the boundaries of mortal language. The word carves through reality like a blade through silk, seeking the target's thread in the tapestry of fate and CUTTING it. The caster's throat bleeds from the effort of channeling something that was never meant to pass through human lips.",
    spellType: "ACTION",
    icon: "Necrotic/Death Mark",
    level: 6,
    specialization: "requiem",
    effectTypes: ["damage"],
    typeConfig: {
      school: "necrotic",
      castTime: 1,
      castTimeType: "IMMEDIATE",
      icon: "Necrotic/Death Mark",
    },
    targetingConfig: {
      targetingType: "single",
      rangeDistance: 30,
      targetRestrictions: ["enemies"],
      rangeType: "ranged",
    },
    resourceCost: {
      actionPoints: 3,
      mana: 30,
      hp: 15,
      classResource: {
        type: "havoc",
        cost: 8,
      },
    },
    resolution: "PROPHECY",
    mechanicsConfig: [
      {
        enabled: true,
        system: "PROPHECY",
        prophecy: {
          rangeDice: ["d4", "d4"],
          resolutionDie: "d4",
          prophesied: {
            damage: "instant_death",
            effect: {
              name: "Execution",
              description:
                "Target reduced to 0 HP instantly. No save. No immunity. The prophecy has spoken and reality obeys.",
              instantKill: true,
              bypassImmunity: true,
            },
            havocGain: 10,
            description:
              "Target reduced to 0 HP. Instant death — no save, no immunity.",
          },
          base: {
            damage: "8d10 necrotic",
            effect: {
              name: "Near Execution",
              description:
                "If target is below 50% HP, they must make a Spirit save (DC SPELL_DC) or be reduced to 0 HP. On success, takes full damage.",
              conditionalKill: true,
              hpThreshold: 50,
              saveType: "spirit",
            },
            havocGain: 5,
            description:
              "Deals 8d10 necrotic damage. If target below 50% HP, Spirit save DC SPELL_DC or reduced to 0 HP.",
          },
          outside: {
            backlash: "8d10 necrotic to self",
            effect: {
              id : "doom_iii",
              name: "Doom III",
              duration: 2,
              unit: "rounds",
              statModifiers: [
                {
                  stat: "spirit",
                  value: -3,
                  magnitudeType: "penalty",
                },
              ],
              description:
                "The execution turns on its speaker. You suffer -3 to Spirit saves for 2 rounds as the death word reverberates through your own soul.",
              doomStack: true,
              doomStackValue: 3,
            },
            havocGain: 0,
            description:
              "Deals 8d10 necrotic damage to you and afflicts you with Doom III (-3 Spirit saves, 2 rounds).",
          },
        },
      },
      {
        enabled: true,
        system: "SAVING_THROW",
        savingThrow: {
          saveStat: "spirit",
          saveAgainst: "SPELL_DC",
          successEffect: "Target takes full 8d10 necrotic damage but is not reduced to 0 HP",
          failureEffect: "Target reduced to 0 HP",
          condition: "Target below 50% HP (base outcome only)",
        },
      },
    ],
    damageConfig: {
      formula: "8d10",
      damageTypes: ["necrotic"],
      resolution: "PROPHECY",
    },
    cooldownConfig: {
      cooldownType: "long_rest",
      cooldownValue: 1,
    },
    tags: [
      "damage",
      "necrotic",
      "prophecy",
      "requiem",
      "execution",
      "instant_kill",
    ],
  },

  // ============================================================
  // LEVEL 7 SPELLS (3)
  // ============================================================

  { id : "doomsayer_armageddon_herald",
    name: "Armageddon Herald",
    description:
      "The caster becomes a conduit of the apocalypse. Their eyes go entirely black — not the whites, not the iris, ALL of it — and their voice echoes with something ancient that has been waiting for this moment since before the world was made. In Herald form, prophecies bend toward fulfillment, Havoc generation doubles, and a Doom Aura radiates outward, breaking the spirit of everything nearby. The transformation is not painless. The caster's humanity frays with each passing second.",
    spellType: "ACTION",
    icon: "Arcane/Swirling Vortex",
    level: 7,
    specialization: "endbringer",
    effectTypes: ["buff"],
    typeConfig: {
      school: "force",
      castTime: 1,
      castTimeType: "IMMEDIATE",
      icon: "Arcane/Swirling Vortex",
    },
    targetingConfig: {
      targetingType: "self",
      rangeType: "self",
      rangeDistance: 0,
      targetRestrictions: ["self"],
    },
    resourceCost: {
      actionPoints: 3,
      mana: 35,
      hp: 10,
      classResource: {
        type: "havoc",
        cost: 8,
      },
    },
    resolution: "AUTOMATIC",
    buffConfig: {
      buffType: "transformation",
      effects: [
        { id : "herald_prophecy_bonus",
          name: "Prophetic Authority",
          description:
            "+2 to all Prophecy resolution rolls. The Herald's words carry the weight of inevitability.",
          statModifiers: [
            {
              stat: "PROPHECY_RESOLUTION",
              value: 2,
              magnitudeType: "bonus",
            },
          ],
        },
        { id : "herald_double_havoc",
          name: "Double Havoc",
          description:
            "All Havoc generation is doubled while in Herald form. The apocalypse feeds itself.",
          havocMultiplier: 2,
        },
        { id : "herald_doom_aura",
          name: "Doom Aura",
          description:
            "30ft aura: All enemies within suffer -3 penalty to Spirit saves and all rolls. The Herald's mere presence breaks resolve.",
          auraRadius: 30,
          auraPenalty: -3,
          statModifiers: [
            {
              stat: "spirit",
              value: -3,
              magnitudeType: "penalty",
            },
            {
              stat: "ALL ROLLS",
              value: -3,
              magnitudeType: "penalty",
            },
          ],
        },
      ],
    },
    durationConfig: {
      durationType: "rounds",
      durationValue: 10,
      durationUnit: "rounds",
      concentrationRequired: true,
    },
    cooldownConfig: {
      cooldownType: "long_rest",
      cooldownValue: 1,
    },
    tags: [
      "buff",
      "transformation",
      "force",
      "endbringer",
      "concentration",
      "aura",
    ],
  },

  { id : "doomsayer_apocalypse_zone",
    name: "Apocalypse Zone",
    description:
      "Fate itself is rewritten within this zone. The caster speaks a boundary into existence and the air within SHATTERS — reality becoming a fractured mirror where even d20 rolls are subject to prophecy (even results grant bonuses, odd results inflict penalties). Enemies standing in the zone at the start of their turn burn with prophetic fire and wither under necrotic decay simultaneously. The caster's skin cracks with prophetic energy, thin lines of light tracing across their body like a map of every possible future.",
    spellType: "ACTION",
    icon: "Chaos/Comet Rain",
    level: 7,
    specialization: "cataclysm",
    effectTypes: ["damage", "control"],
    typeConfig: {
      school: "fire",
      secondaryElement: "necrotic",
      castTime: 1,
      castTimeType: "IMMEDIATE",
      icon: "Chaos/Comet Rain",
    },
    targetingConfig: {
      targetingType: "area",
      areaShape: "circle",
      areaSize: 40,
      rangeDistance: 60,
      rangeType: "ranged",
      targetRestrictions: ["enemies"],
    },
    resourceCost: {
      actionPoints: 3,
      mana: 38,
      hp: 12,
      classResource: {
        type: "havoc",
        cost: 10,
      },
    },
    resolution: "AUTOMATIC",
    damageConfig: {
      formula: "3d8+3d8",
      damageTypes: ["fire", "necrotic"],
      resolution: "AUTOMATIC",
    },
    triggerConfig: {
      triggers: [
        { id : "zone_fate",
          name: "Prophetic Fate Zone",
          triggerType: "passive_zone",
          action:
            "All d20 rolls made within the zone use prophecy range: even results grant a bonus, odd results inflict a penalty. Fate itself is rewritten.",
        },
        { id : "zone_damage",
          name: "Prophetic Burn",
          triggerType: "start_of_turn",
          action:
            "Enemies starting their turn in the zone take 3d8 fire + 3d8 necrotic damage automatically.",
        },
      ],
    },
    durationConfig: {
      durationType: "rounds",
      durationValue: 3,
      durationUnit: "rounds",
      concentrationRequired: true,
    },
    cooldownConfig: {
      cooldownType: "long_rest",
      cooldownValue: 1,
    },
    tags: [
      "damage",
      "control",
      "fire",
      "necrotic",
      "cataclysm",
      "area",
      "zone",
      "concentration",
    ],
  },

  { id : "doomsayer_prophecy_of_annihilation",
    name: "Prophecy of Annihilation",
    description:
      "The ultimate single-target prophecy. The caster speaks a word that should not exist — a word that is the ANNIHILATION of something, not the description of it — and their throat BLEEDS. The word tears through the target's existence like a blade through smoke. If the target is weakened enough, they are not merely killed but ERASED — no resurrection, no return, no hope. The caster's voice may never fully recover from channeling something this absolute.",
    spellType: "ACTION",
    icon: "Necrotic/Necrotic Skull",
    level: 7,
    specialization: "requiem",
    effectTypes: ["damage"],
    typeConfig: {
      school: "necrotic",
      castTime: 1,
      castTimeType: "IMMEDIATE",
      icon: "Necrotic/Necrotic Skull",
    },
    targetingConfig: {
      targetingType: "single",
      rangeDistance: 30,
      targetRestrictions: ["enemies"],
      rangeType: "ranged",
    },
    resourceCost: {
      actionPoints: 3,
      mana: 38,
      hp: 15,
      classResource: {
        type: "havoc",
        cost: 10,
      },
    },
    resolution: "PROPHECY",
    mechanicsConfig: [
      {
        enabled: true,
        system: "PROPHECY",
        prophecy: {
          rangeDice: ["d4", "d4"],
          resolutionDie: "d4",
          prophesied: {
            damage: "12d12 necrotic",
            effect: {
              name: "Erasure",
              description:
                "If target is below 25% HP after damage, they are erased from existence. 0 HP, no resurrection possible for 24 hours. The prophecy does not kill — it UNMAKES.",
              conditionalErase: true,
              hpThreshold: 25,
              eraseDuration: 24,
              eraseDurationUnit: "hours",
              blockResurrection: true,
            },
            havocGain: 10,
            description:
              "Deals 12d12 necrotic damage. If target below 25% HP after damage, erased from existence (no resurrection 24h).",
          },
          base: {
            damage: "8d12 necrotic",
            havocGain: 5,
            description: "Deals 8d12 necrotic damage.",
          },
          outside: {
            backlash: "6d12 necrotic to self",
            effect: {
              id : "doom_iii",
              name: "Doom III",
              duration: 2,
              unit: "rounds",
              statModifiers: [
                {
                  stat: "spirit",
                  value: -3,
                  magnitudeType: "penalty",
                },
              ],
              description:
                "The annihilation prophecy finds no target and turns inward. You suffer -3 to Spirit saves for 2 rounds and are stunned for 1 round as your mind reels.",
              doomStack: true,
              doomStackValue: 3,
              stunDuration: 1,
              stunDurationUnit: "rounds",
            },
            havocGain: 0,
            description:
              "Deals 6d12 necrotic damage to you, afflicts you with Doom III (-3 Spirit saves), and stuns you for 1 round.",
          },
        },
      },
    ],
    damageConfig: {
      formula: "8d12",
      damageTypes: ["necrotic"],
      resolution: "PROPHECY",
    },
    cooldownConfig: {
      cooldownType: "long_rest",
      cooldownValue: 1,
    },
    tags: [
      "damage",
      "necrotic",
      "prophecy",
      "requiem",
      "annihilation",
      "erase",
    ],
  },

  // ============================================================
  // LEVEL 8 SPELLS (3)
  // ============================================================

  { id : "doomsayer_twist_of_doom",
    name: "Twist of Doom",
    description:
      "You twist fate through sheer force of will. Blood trickles from your ear — the mental cost of reshaping prophecy — as you reach into the fabric of an active prophecy and FORCE it to reroll. The new result must be accepted, for better or worse. If the twist results in a Prophesied outcome, the surge of vindicated doom grants +3 Havoc. Fate does not appreciate being corrected, and the headache will last for days.",
    spellType: "REACTION",
    icon: "Arcane/Swirling Vortex",
    level: 8,
    specialization: "universal",
    effectTypes: ["utility"],
    typeConfig: {
      school: "arcane",
      castTime: 1,
      castTimeType: "REACTION",
      icon: "Arcane/Swirling Vortex",
    },
    targetingConfig: {
      targetingType: "single",
      rangeDistance: 60,
      targetRestrictions: ["enemies"],
      rangeType: "ranged",
    },
    resourceCost: {
      actionPoints: 0,
      mana: 15,
      hp: 5,
      classResource: {
        type: "havoc",
        cost: 5,
      },
    },
    resolution: "AUTOMATIC",
    utilityConfig: {
      utilityType: "reroll",
      effects: [
        { id : "fate_reroll",
          name: "Fate Reroll",
          description:
            "Reroll any prophecy resolution die. The new result must be accepted. Cannot reroll the same prophecy twice.",
          rerollTarget: "prophecy_resolution",
          mustAccept: true,
        },
        { id : "twist_havoc",
          name: "Twist Reward",
          description:
            "+3 Havoc if the new result is Prophesied. The universe rewards audacity, grudgingly.",
          conditionalHavoc: 3,
          condition: "New result is Prophesied",
        },
      ],
    },
    triggerConfig: {
      triggers: [
        { id : "fate_twist",
          name: "Fate Twist",
          triggerType: "on_prophecy_resolution",
          action:
            "Reroll the prophecy resolution die. Must accept the new result. +3 Havoc if new result is Prophesied.",
        },
      ],
    },
    cooldownConfig: {
      cooldownType: "long_rest",
      cooldownValue: 1,
    },
    tags: [
      "utility",
      "arcane",
      "universal",
      "reaction",
      "reroll",
      "prophecy",
    ],
  },

  { id : "doomsayer_doom_legion",
    name: "Doom Legion",
    description:
      "A prophecy placed on EVERY enemy simultaneously. The caster SCREAMS until their voice gives out — a single sustained note that fractures into a thousand prophetic echoes, each one finding a different target. Every enemy the caster can see receives the doom. The sound is not human. It is not meant for human ears. The caster's throat tears, their eyes burst blood vessels, and for a moment they see every enemy's ending laid out like cards on a table.",
    spellType: "ACTION",
    icon: "Necrotic/Skull Explosion",
    level: 8,
    specialization: "cataclysm",
    effectTypes: ["damage"],
    typeConfig: {
      school: "fire",
      secondaryElement: "necrotic",
      castTime: 1,
      castTimeType: "IMMEDIATE",
      icon: "Necrotic/Skull Explosion",
    },
    targetingConfig: {
      targetingType: "multi",
      rangeDistance: 60,
      rangeType: "ranged",
      targetRestrictions: ["enemies"],
    },
    resourceCost: {
      actionPoints: 3,
      mana: 40,
      hp: 15,
      classResource: {
        type: "havoc",
        cost: 10,
      },
    },
    resolution: "PROPHECY",
    mechanicsConfig: [
      {
        enabled: true,
        system: "PROPHECY",
        prophecy: {
          rangeDice: ["d8", "d6"],
          resolutionDie: "d6",
          prophesied: {
            damage: "8d8",
            effect: {
              name: "Legion Ignition",
              description:
                "All hit targets are ignited, taking 2d6 fire damage per round for 3 rounds. Each enemy hit generates +4 Havoc.",
              dotDamage: "2d6",
              dotDamageType: "fire",
              dotDuration: 3,
              dotDurationUnit: "rounds",
              havocPerTarget: 4,
            },
            havocGain: 4,
            description:
              "Deals 8d8 fire+necrotic to EACH enemy you can see. All ignited (2d6 fire/round, 3 rounds). +4 Havoc per enemy hit.",
          },
          base: {
            damage: "5d8",
            havocGain: 2,
            description:
              "Deals 5d8 fire+necrotic to each enemy you can see.",
          },
          outside: {
            backlash: "2d8 per target in range to self",
            havocGain: 0,
            description:
              "The legion turns. For every enemy in range, you take 2d8 damage as the accumulated doom finds no purchase and recoils through your body.",
          },
        },
      },
    ],
    damageConfig: {
      formula: "5d8",
      damageTypes: ["fire", "necrotic"],
      resolution: "PROPHECY",
      dotConfig: {
        enabled: true,
        damagePerTick: "2d6",
        damageType: "fire",
        tickFrequency: "round",
        duration: 3,
        canStack: false,
        maxStacks: 1,
      },
    },
    cooldownConfig: {
      cooldownType: "long_rest",
      cooldownValue: 1,
    },
    tags: [
      "damage",
      "fire",
      "necrotic",
      "prophecy",
      "cataclysm",
      "multi_target",
      "dot",
    ],
  },

  { id : "doomsayer_death_sentence",
    name: "Death Sentence",
    description:
      "An inescapable doom brand. The caster carves the sentence into the air with a finger that leaves a trail of blood — not from a wound, but from the sheer act of writing fate itself. The brand sears into the target's essence: they cannot resolve prophecies as Outside (minimum Base outcome), every Prophesied result generates +3 Havoc, and their body refuses to heal above half health. The sentence is absolute. It can only be endured.",
    spellType: "ACTION",
    icon: "Necrotic/Death Mark",
    level: 8,
    specialization: "requiem",
    effectTypes: ["debuff"],
    typeConfig: {
      school: "necrotic",
      castTime: 1,
      castTimeType: "IMMEDIATE",
      icon: "Necrotic/Death Mark",
    },
    targetingConfig: {
      targetingType: "single",
      rangeDistance: 30,
      targetRestrictions: ["enemies"],
      rangeType: "ranged",
    },
    resourceCost: {
      actionPoints: 3,
      mana: 40,
      hp: 15,
      classResource: {
        type: "havoc",
        cost: 10,
      },
    },
    resolution: "AUTOMATIC",
    debuffConfig: {
      debuffType: "brand",
      effects: [
        { id : "death_sentence_brand",
          name: "Death Sentence",
          description:
            "Cannot resolve prophecies as Outside — minimum Base outcome is enforced. All Prophesied results generate +3 additional Havoc.",
          statusType: "doom_brand",
          prophecyFloor: "base",
          bonusHavoc: 3,
        },
        { id : "death_sentence_heal_cap",
          name: "Sentenced Flesh",
          description:
            "Cannot be healed above 50% HP while branded. The body refuses to recover fully under the weight of the sentence.",
          healCapPercent: 50,
        },
      ],
    },
    durationConfig: {
      durationType: "rounds",
      durationValue: 10,
      durationUnit: "rounds",
      concentrationRequired: true,
    },
    cooldownConfig: {
      cooldownType: "long_rest",
      cooldownValue: 1,
    },
    tags: [
      "debuff",
      "necrotic",
      "requiem",
      "brand",
      "concentration",
      "prophecy",
    ],
  },

  // ============================================================
  // LEVEL 9 SPELLS (3)
  // ============================================================

  { id : "doomsayer_the_end",
    name: "The End",
    description:
      "The Word of Ending. The caster speaks it and reality RECOILS — the air itself flinches, the ground shudders, and for one terrible moment everything within range sees their own ending reflected in the blast. Necrotic, fire, psychic, and raw force cascade outward in equal measure, and nothing is spared. Allies may be caught — the End does not discriminate. The caster's eyes turn entirely black for a full minute after casting, and the taste of ash never leaves their mouth.",
    spellType: "ACTION",
    icon: "Void/Red Energy Burst",
    level: 9,
    specialization: "universal",
    effectTypes: ["damage"],
    typeConfig: {
      school: "necrotic",
      secondaryElement: "fire",
      castTime: 1,
      castTimeType: "IMMEDIATE",
      icon: "Void/Red Energy Burst",
    },
    targetingConfig: {
      targetingType: "self_centered",
      areaShape: "circle",
      areaSize: 60,
      rangeType: "self_centered",
      rangeDistance: 0,
      targetRestrictions: ["any"],
    },
    resourceCost: {
      actionPoints: 3,
      mana: 50,
      hp: 20,
      classResource: {
        type: "havoc",
        cost: 12,
      },
    },
    resolution: "PROPHECY",
    mechanicsConfig: [
      {
        enabled: true,
        system: "PROPHECY",
        prophecy: {
          rangeDice: ["d12", "d10"],
          resolutionDie: "d10",
          prophesied: {
            damage: "10d10 mixed",
            effect: {
              name: "Erasure",
              description:
                "Enemies below 30% HP after damage are instantly reduced to 0 HP. No save. No immunity. The End has spoken.",
              instantKillThreshold: 30,
              instantKillMetric: "hp_percent",
              bypassImmunity: true,
            },
            havocGain: 12,
            description:
              "Deals 10d10 mixed damage to all in 60ft. Enemies below 30% HP after damage are erased (0 HP, no save). Friendly fire possible.",
          },
          base: {
            damage: "6d10 mixed",
            havocGain: 6,
            description:
              "Deals 6d10 mixed damage to all in 60ft. Friendly fire possible.",
          },
          outside: {
            backlash: "4d10 to self",
            effect: {
              id : "doom_iii",
              name: "Doom III",
              duration: 2,
              unit: "rounds",
              statModifiers: [
                {
                  stat: "spirit",
                  value: -3,
                  magnitudeType: "penalty",
                },
              ],
              description:
                "The End turns on its speaker. You suffer -3 to Spirit saves for 2 rounds as the word of ending echoes through your own existence.",
              doomStack: true,
              doomStackValue: 3,
            },
            havocGain: 0,
            description:
              "Deals 4d10 damage to you and afflicts you with Doom III (-3 Spirit saves, 2 rounds).",
          },
        },
      },
    ],
    damageConfig: {
      formula: "6d10",
      damageTypes: ["necrotic", "fire", "psychic", "force"],
      resolution: "PROPHECY",
    },
    cooldownConfig: {
      cooldownType: "long_rest",
      cooldownValue: 1,
    },
    tags: [
      "damage",
      "necrotic",
      "fire",
      "psychic",
      "force",
      "prophecy",
      "universal",
      "area",
      "friendly_fire",
    ],
  },

  { id : "doomsayer_cataclysm_incarnate",
    name: "Cataclysm Incarnate",
    description:
      "The caster becomes a walking cataclysm. Their skin cracks with prophetic fire — not burning, but ILLUMINATING from within, thin lines of molten gold tracing across their body like fault lines. Everything near them BURNS. Each turn, the Cataclysm Table rolls against every enemy within 40ft, auto-resolving as Prophesied. The caster does not choose what burns. The cataclysm decides. Their voice becomes the sound of cities falling.",
    spellType: "ACTION",
    icon: "Fire/Volcanic Erupt",
    level: 9,
    specialization: "cataclysm",
    effectTypes: ["buff"],
    typeConfig: {
      school: "fire",
      secondaryElement: "necrotic",
      castTime: 1,
      castTimeType: "IMMEDIATE",
      icon: "Fire/Volcanic Erupt",
    },
    targetingConfig: {
      targetingType: "self",
      rangeType: "self",
      rangeDistance: 0,
      targetRestrictions: ["self"],
    },
    resourceCost: {
      actionPoints: 3,
      mana: 50,
      hp: 20,
      classResource: {
        type: "havoc",
        cost: 12,
      },
    },
    resolution: "AUTOMATIC",
    buffConfig: {
      buffType: "ultimate_transformation",
      effects: [
        { id : "cataclysm_aura",
          name: "Cataclysm Aura",
          description:
            "Auto-Prophesied damage to all enemies within 40ft each turn via Cataclysm Table. The walking end does not negotiate.",
          auraRadius: 40,
          autoProphesied: true,
        },
      ],
    },
    triggerConfig: {
      triggers: [
        { id : "turn_cataclysm",
          name: "Cataclysm Turn",
          triggerType: "start_of_turn",
          action:
            "Roll on Cataclysm Table for each enemy within 40ft. All results resolve as Prophesied automatically.",
        },
      ],
    },
    tableConfig: {
      name: "Cataclysm Table",
      die: "1d6",
      rolls: [
        {
          roll: "1-2",
          effect: "4d6 fire damage to target",
        },
        {
          roll: "3-4",
          effect: "4d6 necrotic damage to target",
        },
        {
          roll: "5",
          effect:
            "4d6 psychic damage + Doom III (-3 Spirit saves, Spirit save DC SPELL_DC negates doom)",
        },
        {
          roll: "6",
          effect: "4d6 force damage + 30ft knockback",
        },
      ],
    },
    durationConfig: {
      durationType: "rounds",
      durationValue: 10,
      durationUnit: "rounds",
      concentrationRequired: true,
    },
    cooldownConfig: {
      cooldownType: "long_rest",
      cooldownValue: 1,
    },
    tags: [
      "buff",
      "transformation",
      "fire",
      "necrotic",
      "cataclysm",
      "concentration",
      "table",
      "aura",
    ],
  },

  { id : "doomsayer_requiem_absolute",
    name: "Requiem Absolute",
    description:
      "The final requiem. Fate itself cannot deny this doom. The caster's voice becomes something beyond human — something that should not exist, something that predates language and will outlast it. A single syllable carries the weight of absolute ending: the target is reduced to 0 HP. No save. No immunity. ALL creature types. No entity in existence can resist a song this final. The caster's nose bleeds black ichor and their eyes weep crimson. The word has been spoken. It cannot be unspoken.",
    spellType: "ACTION",
    icon: "Necrotic/Death Mark",
    level: 9,
    specialization: "requiem",
    effectTypes: ["damage"],
    typeConfig: {
      school: "necrotic",
      castTime: 1,
      castTimeType: "IMMEDIATE",
      icon: "Necrotic/Death Mark",
    },
    targetingConfig: {
      targetingType: "single",
      rangeDistance: 30,
      targetRestrictions: ["enemies"],
      rangeType: "ranged",
    },
    resourceCost: {
      actionPoints: 3,
      mana: 50,
      hp: 20,
      classResource: {
        type: "havoc",
        cost: 12,
      },
    },
    resolution: "PROPHECY",
    mechanicsConfig: [
      {
        enabled: true,
        system: "PROPHECY",
        prophecy: {
          rangeDice: ["d4", "d4"],
          resolutionDie: "d4",
          prophesied: {
            damage: "instant_death",
            effect: {
              name: "Absolute Requiem",
              description:
                "Target reduced to 0 HP. No save. No immunity. All creature types. Absolute. The requiem has no exceptions because the requiem is the exception to existence itself.",
              instantKill: true,
              bypassImmunity: true,
              allCreatureTypes: true,
              absolute: true,
            },
            havocGain: 12,
            description:
              "Target reduced to 0 HP. No save. No immunity. All creature types. Absolute.",
          },
          base: {
            damage: "15d12 necrotic",
            havocGain: 6,
            description: "Deals 15d12 necrotic damage.",
          },
          outside: {
            backlash: "15d12 necrotic to self",
            effect: {
              id : "doom_iv",
              name: "Doom IV",
              duration: 2,
              unit: "rounds",
              statModifiers: [
                {
                  stat: "spirit",
                  value: -4,
                  magnitudeType: "penalty",
                },
              ],
              description:
                "The absolute requiem turns on its speaker. You suffer -4 to Spirit saves for 2 rounds as the final song echoes through your own soul.",
              doomStack: true,
              doomStackValue: 4,
            },
            havocGain: 0,
            description:
              "Deals 15d12 necrotic damage to you and afflicts you with Doom IV (-4 Spirit saves, 2 rounds).",
          },
        },
      },
    ],
    damageConfig: {
      formula: "15d12",
      damageTypes: ["necrotic"],
      resolution: "PROPHECY",
    },
    cooldownConfig: {
      cooldownType: "long_rest",
      cooldownValue: 1,
    },
    tags: [
      "damage",
      "necrotic",
      "prophecy",
      "requiem",
      "instant_kill",
      "absolute",
    ],
  },

  // ============================================================
  // LEVEL 10 SPELLS (3)
  // ============================================================

  { id : "doomsayer_herald_of_the_end",
    name: "Herald of the End",
    description:
      "For one minute, you ARE the apocalypse. Fate bows. The caster's humanity burns away — eyes black, voice resonant with the End itself — and in its place stands something that prophecies obey. ALL prophecies auto-resolve as Prophesied. Havoc generation TRIPLES. The Herald is immune to fire, necrotic, and psychic damage. Backlash that would damage the Herald instead deals DOUBLE damage to enemies within range. The transformation is total. The person who was here before is gone. Whether they come back is uncertain.",
    spellType: "ACTION",
    icon: "Void/Black Hole",
    level: 10,
    specialization: "universal",
    effectTypes: ["buff"],
    typeConfig: {
      school: "force",
      castTime: 1,
      castTimeType: "IMMEDIATE",
      icon: "Void/Black Hole",
    },
    targetingConfig: {
      targetingType: "self",
      rangeType: "self",
      rangeDistance: 0,
      targetRestrictions: ["self"],
    },
    resourceCost: {
      actionPoints: 3,
      mana: 60,
      hp: 25,
      classResource: {
        type: "havoc",
        cost: 15,
      },
    },
    resolution: "AUTOMATIC",
    buffConfig: {
      buffType: "ultimate_transformation",
      effects: [
        { id : "herald_auto_prophesied",
          name: "Fate's Submission",
          description:
            "All prophecies cast by or against the Herald auto-resolve as Prophesied. Fate has surrendered.",
          autoProphesied: true,
        },
        { id : "herald_triple_havoc",
          name: "Apocalypse Engine",
          description:
            "Havoc generation tripled. The Herald does not merely channel doom — they ARE doom, and doom generates itself.",
          havocMultiplier: 3,
        },
        { id : "herald_immunity",
          name: "End Made Flesh",
          description:
            "Immune to fire, necrotic, and psychic damage. The Herald cannot be harmed by the very forces they embody.",
          immunities: ["fire", "necrotic", "psychic"],
        },
        { id : "herald_backlash_redirect",
          name: "Deflected Apocalypse",
          description:
            "Backlash damage that would affect the Herald instead deals double damage to the nearest enemy within 30ft. The End does not harm its Herald.",
          backlashRedirect: true,
          backlashMultiplier: 2,
          backlashRange: 30,
        },
      ],
    },
    durationConfig: {
      durationType: "rounds",
      durationValue: 10,
      durationUnit: "rounds",
      concentrationRequired: true,
    },
    cooldownConfig: {
      cooldownType: "long_rest",
      cooldownValue: 1,
    },
    tags: [
      "buff",
      "transformation",
      "force",
      "universal",
      "concentration",
      "ultimate",
    ],
  },

  { id : "doomsayer_end_of_all_things",
    name: "End of All Things",
    description:
      "Every prophecy detonates. EVERY. SINGLE. ONE. The caster reaches out with both hands and TEARS — ripping every active prophecy off the battlefield within 120ft and forcing them to resolve as Prophesied simultaneously. The combined detonation creates a Scorched Earth zone that continues to burn for 5 rounds afterward. The battlefield becomes a hellscape of fire, necrotic rot, and raw force. The caster may not survive the backlash. There is a very real chance they die casting this spell. The End does not care who it takes.",
    spellType: "ACTION",
    icon: "Fire/Volcanic Erupt",
    level: 10,
    specialization: "cataclysm",
    effectTypes: ["damage"],
    typeConfig: {
      school: "fire",
      secondaryElement: "necrotic",
      castTime: 1,
      castTimeType: "IMMEDIATE",
      icon: "Fire/Volcanic Erupt",
    },
    targetingConfig: {
      targetingType: "self_centered",
      areaShape: "circle",
      areaSize: 120,
      rangeType: "self_centered",
      rangeDistance: 0,
      targetRestrictions: ["any"],
    },
    resourceCost: {
      actionPoints: 3,
      mana: 60,
      hp: 25,
      classResource: {
        type: "havoc",
        cost: 15,
      },
    },
    resolution: "AUTOMATIC",
    damageConfig: {
      formula: "4d8 fire + 4d8 necrotic per active prophecy",
      damageTypes: ["fire", "necrotic", "force"],
      resolution: "AUTOMATIC",
      dotConfig: {
        enabled: true,
        damagePerTick: "3d8",
        damageType: "fire",
        tickFrequency: "round",
        duration: 5,
        canStack: false,
        maxStacks: 1,
        zoneName: "Scorched Earth",
        zoneDescription:
          "The ground itself burns with prophetic fire. 3d8 damage per round to all creatures in the zone for 5 rounds.",
      },
    },
    triggerConfig: {
      triggers: [
        { id : "final_detonation",
          name: "Final Detonation",
          triggerType: "on_cast",
          action:
            "Detonate ALL active prophecies on the battlefield within 120ft. Each resolves as Prophesied. Creates Scorched Earth zone (3d8/round, 5 rounds). Massive friendly fire risk.",
        },
      ],
    },
    cooldownConfig: {
      cooldownType: "long_rest",
      cooldownValue: 1,
    },
    tags: [
      "damage",
      "fire",
      "necrotic",
      "force",
      "cataclysm",
      "area",
      "ultimate",
      "prophecy_resolve",
      "dot",
      "friendly_fire",
    ],
  },

  { id : "doomsayer_final_requiem",
    name: "Final Requiem",
    description:
      "The last song of doom. Cannot be denied, survived, escaped, or forgiven. The caster's voice GIVES OUT permanently — they may never speak again — as the final requiem pours out of them in a sound that is not a scream, not a whisper, not a word. It is simply END. 20d12 necrotic damage with no save. If the target dies, they cannot be resurrected by any means. If they somehow survive, every future prophecy cast against them resolves as Prophesied permanently — their doom is no longer a possibility, it is a certainty awaiting its moment. The caster slumps, silent. Some words cost everything.",
    spellType: "ACTION",
    icon: "Necrotic/Necrotic Skull",
    level: 10,
    specialization: "requiem",
    effectTypes: ["damage"],
    typeConfig: {
      school: "necrotic",
      castTime: 1,
      castTimeType: "IMMEDIATE",
      icon: "Necrotic/Necrotic Skull",
    },
    targetingConfig: {
      targetingType: "single",
      rangeDistance: 60,
      targetRestrictions: ["enemies"],
      rangeType: "ranged",
    },
    resourceCost: {
      actionPoints: 3,
      mana: 60,
      hp: 25,
      classResource: {
        type: "havoc",
        cost: 15,
      },
    },
    resolution: "AUTOMATIC",
    damageConfig: {
      formula: "20d12",
      damageTypes: ["necrotic"],
      resolution: "AUTOMATIC",
    },
    triggerConfig: {
      triggers: [
        { id : "absolute_execution",
          name: "Absolute Execution",
          triggerType: "on_cast",
          action:
            "20d12 necrotic, no save. If target dies, cannot be resurrected. If target survives, all future prophecies against them auto-Prophesied permanently. Caster's voice gives out permanently.",
        },
      ],
      conditionalEffects: {
        damage: {
          isConditional: true,
          defaultEnabled: true,
          conditionalFormulas: {
            "target dies": "20d12 necrotic + no resurrection",
            "target survives":
              "20d12 necrotic + permanent auto-Prophesied on all future prophecies against target",
            default: "20d12 necrotic, no save",
          },
        },
      },
    },
    cooldownConfig: {
      cooldownType: "long_rest",
      cooldownValue: 1,
    },
    tags: [
      "damage",
      "necrotic",
      "requiem",
      "ultimate",
      "no_save",
      "no_resurrection",
    ],
  },

  // ============================================================
  // PASSIVE ABILITIES (3)
  // ============================================================

  { id : "doomsayer_doom_fatigue",
    name: "Doom Fatigue",
    description:
      "Each doom and prophecy beyond the first drains you. Spreading doom exhausts the prophet — you feel each prophecy like a weight on your soul, a slow accumulation of endings that your body was never meant to carry. At the start of each turn, you take 1d4 necrotic damage per active doom beyond the first. The more doom you spread, the more it consumes you from within. Your veins darken with each prophecy, and your coughs bring up something that is not entirely blood.",
    spellType: "PASSIVE",
    icon: "Necrotic/Necrotic Death",
    level: 1,
    specialization: "universal",
    effectTypes: ["passive"],
    typeConfig: {
      school: "necrotic",
      castTime: 0,
      castTimeType: "PASSIVE",
      icon: "Necrotic/Necrotic Death",
    },
    targetingConfig: {
      targetingType: "self",
      rangeType: "self",
      rangeDistance: 0,
      targetRestrictions: ["self"],
    },
    resourceCost: {
      resourceTypes: [],
      resourceValues: {},
      actionPoints: 0,
    },
    resolution: "AUTOMATIC",
    mechanicsConfig: [
      {
        enabled: true,
        system: "SELF_DAMAGE",
        triggerType: "start_of_turn",
        action:
          "Deal 1d4 necrotic damage to self per active doom beyond the first. Doom fatigue accumulates with each prophecy.",
        damageFormula: "1d4 per active doom beyond 1",
        damageType: "necrotic",
      },
    ],
    cooldownConfig: {
      cooldownType: "none",
      cooldownValue: 0,
    },
    tags: ["passive", "necrotic", "universal", "self_damage"],
  },

  { id : "doomsayer_inevitable_isolation",
    name: "Inevitable Isolation",
    description:
      "Your visions isolate you from hope. While you have active doom prophecies, you cannot benefit from ally healing or positive buffs — their healing simply fails to take hold on a soul so saturated with doom, their buffs sliding off you like water off a gravestone. The isolation is absolute. You also take 50% increased psychic damage from all sources — your mind, stretched thin by the constant flood of prophetic visions, has become catastrophically vulnerable to anything that targets the psyche.",
    spellType: "PASSIVE",
    icon: "Necrotic/Necrotic Death",
    level: 3,
    specialization: "universal",
    effectTypes: ["passive"],
    typeConfig: {
      school: "psychic",
      castTime: 0,
      castTimeType: "PASSIVE",
      icon: "Necrotic/Necrotic Death",
    },
    targetingConfig: {
      targetingType: "self",
      rangeType: "self",
      rangeDistance: 0,
      targetRestrictions: ["self"],
    },
    resourceCost: {
      resourceTypes: [],
      resourceValues: {},
      actionPoints: 0,
    },
    resolution: "AUTOMATIC",
    mechanicsConfig: [
      {
        enabled: true,
        system: "BUFF_BLOCK",
        condition: "Has active doom prophecies",
        action:
          "Cannot benefit from ally healing or positive buffs while active doom prophecies exist.",
        healingBlock: true,
        buffBlock: true,
        blockCondition: "active_doom_prophecies",
      },
      {
        enabled: true,
        system: "VULNERABILITY",
        vulnerabilityType: "psychic",
        vulnerabilityPercent: 50,
        description:
          "50% increased psychic damage from all sources. The prophet's mind is an open wound.",
      },
    ],
    cooldownConfig: {
      cooldownType: "none",
      cooldownValue: 0,
    },
    tags: ["passive", "psychic", "universal", "self_debuff"],
  },

  { id : "doomsayer_prophets_burden",
    name: "Prophet's Burden",
    description:
      "Failed prophecies hurt the prophet. When a doom prophecy is cleansed or dispelled before its natural resolution, the accumulated prophetic energy has nowhere to go but back into the one who spoke it. You take psychic damage equal to the doom's remaining potential damage (minimum 1d6). Your visions demand to be fulfilled — denied prophecy does not simply vanish. It returns to its source, and you ARE the source. Each undone prophecy is a psychic wound that reopens every time someone cheats fate.",
    spellType: "PASSIVE",
    icon: "Necrotic/Necrotic Death",
    level: 5,
    specialization: "universal",
    effectTypes: ["passive"],
    typeConfig: {
      school: "psychic",
      castTime: 0,
      castTimeType: "PASSIVE",
      icon: "Necrotic/Necrotic Death",
    },
    targetingConfig: {
      targetingType: "self",
      rangeType: "self",
      rangeDistance: 0,
      targetRestrictions: ["self"],
    },
    resourceCost: {
      resourceTypes: [],
      resourceValues: {},
      actionPoints: 0,
    },
    resolution: "AUTOMATIC",
    mechanicsConfig: [
      {
        enabled: true,
        system: "BACKLASH_ON_DISPEL",
        triggerType: "on_prophecy_dispelled",
        action:
          "When a doom prophecy is cleansed or dispelled before natural resolution, take psychic damage equal to the doom's remaining potential damage (minimum 1d6).",
        damageFormula: "remaining_potential_damage",
        minimumDamage: "1d6",
        damageType: "psychic",
      },
    ],
    cooldownConfig: {
      cooldownType: "none",
      cooldownValue: 0,
    },
    tags: ["passive", "psychic", "universal", "self_damage"],
  },

      {
        "id": "doomsayer_omen_raven",
        "name": "Omen of the Raven",
        "description": "Conjure a spectral raven from dark void energy. The raven flies to a targeted creature within 60 feet and whispers a creepy, prophetic riddle that leaves them unsettled, giving them disadvantage on their next Charisma check.",
        "level": 1,
        "spellType": "ACTION",
        "icon": "Necrotic/Miasma",
        "typeConfig": {
          "school": "shadow",
          "icon": "Necrotic/Miasma",
          "tags": [
            "utility",
            "roleplay",
            "doomsayer"
          ],
          "castTime": 1,
          "castTimeType": "IMMEDIATE"
        },
        "targetingConfig": {
          "targetingType": "single",
          "rangeType": "ranged",
          "rangeDistance": 60,
          "targetRestrictions": []
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
            "verbal",
            "somatic"
          ],
          "verbalText": "Illa nox loquitur...",
          "somaticText": "Reach out a flat hand, void energy condensing into a spectral crow that flies off"
        },
        "resolution": "NONE",
        "effectTypes": [
          "debuff"
        ],
        "debuffConfig": {
          "debuffType": "statusEffect",
          "effects": [
            {
              "id": "omen_raven_shiver",
              "name": "Creeping Riddle",
              "description": "Unsettled by a creepy omen. Disadvantage on your next Charisma check within 10 minutes.",
              "mechanicsText": "Disadvantage on next Charisma check."
            }
          ],
          "durationValue": 10,
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
          "doomsayer"
        ]
      },
  ],

  spellPools: {
    1: [
      "doomsayer_doom_bolt",
      "doomsayer_doom_whisper",
      "doomsayer_omen_flame",
      "doomsayer_omen_of_ash",
      "doomsayer_havoc_blast",
      "doomsayer_omen_raven",
    ],
    2: [
      "doomsayer_doom_countdown",
      "doomsayer_calamity_zone",
      "doomsayer_death_mark",
    ],
    3: [
      "doomsayer_havoc_blast",
      "doomsayer_escalating_doom",
      "doomsayer_rain_of_doom",
    ],
    4: [
      "doomsayer_requiem_of_death",
      "doomsayer_doom_aura",
      "doomsayer_cataclysm_blast",
    ],
    5: [
      "doomsayer_prophecy_of_ruin",
      "doomsayer_stacked_doom",
      "doomsayer_doom_nova",
    ],
    6: [
      "doomsayer_cascade_doom",
      "doomsayer_endbringer_finale",
      "doomsayer_execution_prophecy",
    ],
    7: [
      "doomsayer_apocalypse_zone",
      "doomsayer_armageddon_herald",
      "doomsayer_prophecy_of_annihilation",
    ],
    8: [
      "doomsayer_twist_of_doom",
      "doomsayer_doom_legion",
      "doomsayer_death_sentence",
    ],
    9: [
      "doomsayer_the_end",
      "doomsayer_cataclysm_incarnate",
      "doomsayer_requiem_absolute",
    ],
    10: [
      "doomsayer_herald_of_the_end",
      "doomsayer_end_of_all_things",
      "doomsayer_final_requiem",
    ],
  },
};

