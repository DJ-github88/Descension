/**
 * Doomsayer Class Data
 *
 * Complete class information for the Doomsayer - a Prophet of Catastrophe
 * who places living bomb prophecies with RNG chaos outcomes, using
 * Prophecy Range mechanics and Havoc as their primary resource.
 */

export const DOOMSAYER_DATA = {
  id: 'doomsayer',
  name: 'Doomsayer',
  icon: 'fas fa-bolt',
  role: 'Damage/Control (Chaotic Prophecy & Living Bombs)',
  damageTypes: ['necrotic', 'psychic', 'fire', 'force'],

  overview: {
    title: 'The Doomsayer',
    subtitle: 'Prophet of Catastrophe, Weaver of Living Doom',

    quickOverview: {
      title: 'Quick Overview',
      content: `**What You Need to Know**: Doomsayers place "living bomb" prophecies on targets or areas. Each prophecy has a **Prophecy Range** created by rolling 2 dice—the results form a range (e.g., d8=1 and d6=3 → range is 1-3). When the prophecy resolves, a roll is made against this range: landing **between** the boundaries triggers the **Prophesized** effect (enhanced), landing **on** a boundary gives the **Base** effect, and landing **outside** the range triggers the **Outside** effect (negative/fizzle/spell-dependent). You earn **Havoc** from fulfilled prophecies and spend it to fuel stronger spells.

**Core Mechanic**: Cast prophecy → Roll 2 dice (type per spell) → Creates Prophecy Range → Target rolls against range → Between = Prophesized (bonus), On boundary = Base, Outside = Negative/Fizzle

**Resource**: Havoc (earned by fulfilling prophecies, spent on stronger spells)

**Playstyle**: Calculated chaos—place prophecies, watch them detonate with RNG outcomes, manipulate prophecy ranges with Havoc

**Best For**: Players who love unpredictable high-impact moments, ticking time bomb mechanics, and controlled chaos that's different from pure RNG`
    },

    description: `Doomsayers are harbingers of the inevitable—prophets who speak doom into existence. They don't merely predict catastrophe; they CREATE it. By placing "living bomb" prophecies on targets or areas, Doomsayers set the stage for devastating RNG-based explosions of fate. Some prophecies detonate immediately; others tick like time bombs, accumulating Havoc before unleashing accumulated catastrophe.`,

    roleplayIdentity: {
      title: 'Roleplay Identity',
      content: `Doomsayers carry the weight of inevitable doom. They have seen the end of all things—a vision that forever changed them—and now they bring pieces of that end to the present. They are not evil by nature; they simply understand that destruction is a necessary part of existence. Some are cursed with the sight, others chose it willingly. They might be:

**The End Seer**: One who glimpsed the apocalypse and now channels fragments of it
**The Doom Herald**: A divine messenger carrying prophecies of destruction from angry gods
**The Entropy Scholar**: A scholar who studied the heat death of the universe and learned to accelerate it locally
**The Cursed Oracle**: One whose predictions of doom always come true—whether they want them to or not
**The War Prophet**: Military doomsayer who places catastrophic prophecies on enemy formations

Doomsayers tend to be intense, dramatic, and slightly unsettling. They speak in absolutes—"this WILL end," "your doom is WRITTEN"—because for them, it literally is. They find beauty in destruction and meaning in entropy. Their companions often find them both terrifying and oddly comforting—at least someone knows how it all ends.`
    },

    combatRole: {
      title: 'Combat Role',
      content: `In combat, Doomsayers are chaotic damage dealers and controllers who excel at:

**Living Bomb Placement**: First round of combat, place a prophecy on a target or area
**Prophecy Range Manipulation**: Roll 2 dice to set prophecy ranges, then spend Havoc to widen or narrow them
**RNG Chaos**: Prophecy outcomes are random but bounded—calculated chaos, not pure randomness
**Ticking Time Bombs**: Some prophecies accumulate effects over rounds before detonating
**Havoc Generation**: Every fulfilled prophecy generates Havoc for stronger spells

Doomsayers differ from Chaos Weavers in that their chaos is FORECASTED—placed deliberately and detonated on command. A Chaos Weaver rolls randomly and adapts; a Doomsayer sets the terms of chaos and watches them unfold.`
    },

    playstyle: {
      title: 'Playstyle',
      content: `Doomsayers reward players who:

**Plan Chaos**: Place prophecies strategically—on clustered enemies for area effects, on bosses for single-target devastation
**Manage Havoc**: Every fulfilled prophecy earns Havoc. Save it for big spells or spend it to manipulate prophecy ranges
**Embrace Uncertainty**: Prophecy outcomes are RNG-based but bounded. You control the range, fate controls the result
**Mix Instant and Delayed**: Some prophecies detonate immediately (quick chaos), others tick and accumulate (delayed devastation)
**Adapt to Outcomes**: Prophesized effects are bonus—plan for the Base effect and treat Prophesized as a pleasant surprise

The Prophecy Range mechanic creates a unique minigame: you set the boundaries, but the outcome within those boundaries is uncertain. Narrow ranges are harder to hit but have more devastating Prophesized effects. Wide ranges are safer but less spectacular.`
    },

    immersiveCombatExample: {
      title: 'Combat Example: The Prophet\'s Toll',
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

**Prophesized Effect**: 4d8 necrotic damage + target is weakened for 2 rounds
**Base Effect** (if rolled 3 or 5): 2d8 necrotic damage
**Outside Effect** (if rolled 1, 2, or 6): 1d8 necrotic to self instead

**Damage Roll**: 4d8 → [7, 5, 6, 8] = **26 necrotic damage!**
**Troll**: Weakened for 2 rounds (-2 to all rolls)
**Havoc Generated**: +3 (Prophesized fulfillment)

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

**Prophesized Effect**: All goblins in 15ft take 3d8 fire damage + 1d8 force, area becomes difficult terrain
**Base Effect**: 2d8 fire damage
**Outside Effect**: Spell fizzles, you take 1d4 psychic backlash

**Damage Roll**: 3d8 fire → [6, 7, 5] = 18 fire + 1d8 force → [8] = **26 total to each goblin!**
**Terrain**: 15ft zone becomes burning difficult terrain for 3 rounds

**Goblin Shaman #1**: 26 damage → DEAD
**Goblin Shaman #2**: 26 damage → Nearly dead (5 HP)
**Goblin Shaman #3**: 26 damage → Nearly dead (8 HP)

**Havoc Generated**: +2 (Prophesized area fulfillment)
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

**Your Action (remaining AP)**: Spend 4 Havoc to widen a prophecy range on your next spell by +2

*You channel Havoc into your prophetic sight, preparing for a bigger detonation.*

**Havoc**: 6 - 4 = **2/15** (stored as "Range Widening: +2" for next spell)

**Goblin Shaman #2**: Casts a heal on troll → Troll regains 10 HP
**Goblin Shaman #3**: Attacks your mage → d20+4 → [13] → Hit! → 1d6+2 → [5]+2 = 7 damage

**Current State**: Havoc: 2/15 | Mana: 26/60 | Troll: Weakened (1 round left), Doom Countdown (2 rounds left)

**Turn 4 - Detonation (Havoc: 2 → 11)**

*Doom Countdown ticks. The troll is writhing.*

**Troll takes**: 1d6 → [6] necrotic damage (Round 2 of 3)
**Havoc Generated**: +1 (ticking) + 2 (Prophesized—rolled max on d6)
**Havoc**: 2 + 3 = **5/15**

**Your Action**: Cast "Cataclysm Prophecy" on Troll (15 mana + 5 Havoc)
**Prophecy Range Setup**: Roll d12 and d10 → [4] and [8]
**With Range Widening +2**: Range becomes 2-10 (expanded by 2 in each direction)
**Prophecy Range**: 2-10 (9 values—very safe, very powerful)

**Resolution Roll**: d10 → [7] → **INSIDE THE RANGE (2-10)!** → **PROPHESIZED!**

*You raise both hands. The troll's Doom Countdown sigil MERGES with your Cataclysm Prophecy. The accumulated doom DETONATES.*

**Prophesized Effect**: 8d10 necrotic + fire damage, 15ft radius blast, targets are stunned for 1 round
**Base Effect**: 4d10 damage
**Outside Effect**: 2d10 to self

**Damage Roll**: 8d10 → [9, 7, 10, 6, 8, 5, 9, 7] = **61 damage!**
**Blast Radius**: 15ft catches Goblin Shamans #2 and #3

**Goblin Shaman #2**: 61 damage → OBLITERATED
**Goblin Shaman #3**: 61 damage → OBLITERATED
**Troll**: Takes 61 + 6 (Doom Countdown final tick) = 67 damage → COLLAPSES

*The troll EXPLODES in a burst of prophetic fire and necrotic energy. The two remaining shamans are caught in the blast and simply cease to exist. The battlefield is silent except for the crackle of fate-fire.*

**Combat Over**

**Your Party's Fighter**: "...What just happened?"
**You**: "I placed a doom prophecy on the troll. The range was 2 to 10. Fate rolled a 7—inside the range. Prophesized. That means the effect was DOUBLED. I also had a Doom Countdown ticking on it for 3 rounds. When the Cataclysm Prophecy detonated, the accumulated doom combined. 61 damage to the troll and everything near it."
**Your Party's Mage**: "And if fate had rolled outside the range?"
**You**: "Then I would have taken 2d10 damage to myself. That's the gamble. I set the range, I widened it with Havoc, but I don't control the roll. Fate does. And today, fate agreed with me."

**Final State**: Havoc: 5/15 (earned 9, spent 5) | Mana: 11/60 | HP: 55/55

**The Lesson**: Doomsayer gameplay is about:
1. **Prophecy Range**: Roll 2 dice to set boundaries. Inside = Prophesized (bonus). Outside = negative/fizzle.
2. **Havoc Economy**: Every fulfilled prophecy generates Havoc. Spend it to widen ranges (safer) or on powerful Havoc-costing spells.
3. **Living Bombs**: Doom Countdown was a 3-round ticking bomb that accumulated damage and Havoc before detonating alongside Cataclysm Prophecy.
4. **Calculated Chaos**: You don't control the roll, but you control the RANGE. Wide ranges = safer but weaker Prophesized effects. Narrow ranges = riskier but more devastating.
5. **Cascade Effect**: First prophecy → earn Havoc → spend Havoc to improve next prophecy → bigger Havoc payoff → cascade into ultimate spells.
6. **Risk Management**: If that Cataclysm Prophecy had rolled outside the range, YOU take the damage. Every prophecy is a calculated gamble.`
    }
  },

  resourceSystem: {
    title: 'Havoc',
    subtitle: 'The Currency of Fulfilled Doom',

    description: `Doomsayers earn **Havoc** by fulfilling prophecies—when a target rolls inside the Prophecy Range and the Prophesized effect triggers, Havoc is generated. This chaotic energy is then spent to cast stronger spells, widen prophecy ranges for safer bets, or fuel devastating abilities. Unlike other resources that generate passively, Havoc only flows from successful prophecy fulfillment—rewarding aggressive play and accurate range-setting.`,

    cards: [
      {
        title: 'Havoc (0-15)',
        stats: 'Max: 15 | Earned from Prophecies',
        details: 'Generated when prophecies fulfill (Prophesized outcome). Spent on stronger spells and widening prophecy ranges. Must be earned through successful prophecy plays.'
      },
      {
        title: 'Prophecy Range',
        stats: '2 Dice → Low-High Range',
        details: 'Roll 2 dice (type per spell) to create a range. Target rolls against it. Inside = Prophesized (bonus), On boundary = Base, Outside = Negative/Fizzle.'
      },
      {
        title: 'Living Bombs',
        stats: 'Instant or Delayed',
        details: 'Some prophecies detonate immediately. Others tick for rounds, accumulating damage and Havoc before a massive detonation.'
      }
    ],

    generationTable: {
      headers: ['Prophecy Outcome', 'Havoc Gain', 'Notes'],
      rows: [
        ['Prophesized (inside range)', '+2 to +5', 'Base gain + spell-specific bonus'],
        ['Base (on boundary)', '+1', 'Prophecy hit but not enhanced'],
        ['Outside (fizzle/negative)', '+0', 'Prophecy failed—no Havoc earned'],
        ['Doom Countdown (per tick)', '+1', 'Delayed prophecies generate Havoc each round'],
        ['Doom Countdown (detonation)', '+3 to +6', 'Final burst when countdown reaches 0'],
        ['Multiple targets (area)', '+1 per target', 'Area prophecies generate Havoc per target hit']
      ]
    },

    usage: {
      momentum: 'Place cheap prophecies early to build Havoc. Once you have 5+, start using Havoc to widen ranges on bigger spells for safer Prophesized outcomes.',
      flourish: 'Narrow ranges (1-2 values) give the strongest Prophesized effects but are hardest to hit. Spend Havoc to widen them by +1 per Havoc spent—turning a risky 3-5 into a safe 2-6.'
    },

    overheatRules: {
      title: 'Prophecy Backlash',
      content: `When a prophecy rolls OUTSIDE the range, the Doomsayer suffers **Prophecy Backlash**:

**The Effect**: Depending on the spell, you may take self-damage, lose mana, or suffer a debuff. Each spell specifies its Outside effect.

**Common Outside Effects**:
- **Minor spells**: Take 1d4 psychic damage (prophetic headache)
- **Medium spells**: Take 1d8 necrotic damage and lose 5 mana
- **Major spells**: Take 2d8 damage and the spell cooldown still applies
- **Ultimate spells**: Take 3d10 damage and are stunned for 1 round

**Risk vs Reward**: Narrower ranges have more powerful Prophesized effects but higher Backlash risk. Wider ranges are safer but less spectacular.

**The Philosophy**: You spoke doom and doom answered—but not in the way you intended. The fates punish hubris.`
    },

    strategicConsiderations: {
      title: 'Prophecy Range Strategy',
      content: `**Narrow Range (1-2 values)**: High risk, high reward. Prophesized effects are devastating. Best used with Havoc to widen or against targets with low variance.

**Medium Range (3-5 values)**: Balanced approach. Good Prophesized payoff with reasonable risk. Standard play.

**Wide Range (6+ values)**: Safe bet. Prophesized effect is modest but consistent. Good for building Havoc early.

**Spending Havoc on Range Widening**: Each point of Havoc spent widens the range by 1 in each direction (e.g., 3-5 becomes 2-6 for 1 Havoc). This is often the most efficient use of early Havoc.

**Delayed vs Instant**: Delayed prophecies (Doom Countdown) generate Havoc over time and can combine with later prophecies for cascade detonation. Instant prophecies give immediate Havoc for quick ramp-up.

**Specialization Impact**: Requiem (single-target) gets bonus Havoc from single-target Prophesized hits. Endbringer (escalating) gains more Havoc as combat continues. Cataclysm (area) earns Havoc per target hit in area prophecies.`
    },

    playingInPerson: {
      title: 'Playing in Person',
      subtitle: 'The Prophecy Board',
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

**Pro Tip**: Use a small whiteboard for tracking active prophecies. Write each prophecy's range, target, and current tick count. The visual chaos of multiple active prophecies is part of the Doomsayer's identity.`
    }
  },

  specializations: {
    title: 'Doomsayer Specializations',
    subtitle: 'Three Paths of Catastrophe',

    description: `Every Doomsayer chooses one of three paths that define how they deliver doom. Requiems focus on devastating single-target death prophecies. Endbringers specialize in escalating effects that grow more powerful each round. Cataclysms create area-based prophecies and battlefield-wide RNG chaos.`,

    passiveAbility: {
      name: 'Prophet\'s Sight',
      description: 'All Doomsayers can sense the "doom potential" of a creature—whether a target is particularly susceptible to prophecy (creatures with lower Spirit scores are easier targets). You also gain +1 to your Prophecy Range resolution roll per Doomsayer level (divided by 2, rounded down, max +5). This bonus helps land inside the range more reliably.'
    },

    specs: [
      {
        id: 'requiem',
        name: 'Requiem',
        icon: 'Necrotic/Necrotic Skull',
        color: '#4B0082',
        theme: 'Single-Target Death Prophecies',

        description: `Requiems are assassins of fate, placing devastating single-target prophecies that can obliterate a single enemy. Their prophecy ranges are narrower but their Prophesized effects are the most lethal in the game. They earn bonus Havoc from single-target Prophesized hits and can stack multiple prophecies on the same target.`,

        playstyle: 'Single-target nuke, precision prophecy, death stacking, high burst damage',

        strengths: [
          'Prophesized effects deal 50% more damage on single-target spells',
          'Bonus Havoc (+2) from single-target Prophesized hits',
          'Can stack up to 3 prophecies on the same target simultaneously',
          'Access to "Death Prophecy" abilities that can instantly kill low-HP targets'
        ],

        weaknesses: [
          'Narrower prophecy ranges (smaller dice) mean higher Backlash risk',
          'No area effect capability—all power focused on single targets',
          'Vulnerable against groups of enemies',
          'Less Havoc generation per combat since fewer targets are hit'
        ],

        specPassive: {
          name: 'Death\'s precision',
          description: 'When you roll a Prophesized outcome on a single-target spell, gain +2 bonus Havoc and the spell deals +50% damage. You can have up to 3 active prophecies on the same target—when one detonates, the others tick.'
        },

        keyAbilities: [
          'Death Mark: Place a narrow-range prophecy (d4+d4) that deals 6d10 necrotic on Prophesized (5 Havoc)',
          'Stacked Doom: Detonate all active prophecies on a target simultaneously for combined damage',
          'Requiem: Ultimate—place a prophecy that, if Prophesized, reduces target to 0 HP regardless of remaining health (10 Havoc, once per long rest)'
        ],

        recommendedFor: 'Players who want to be the ultimate single-target burst damage dealer with a unique prophecy mechanic'
      },

      {
        id: 'endbringer',
        name: 'Endbringer',
        icon: 'Void/Black Hole',
        color: '#FF4500',
        theme: 'Escalating Effects & Doom Aura',

        description: `Endbringers embody the escalating nature of doom. Their effects grow stronger each round they remain active—prophecies that tick longer deal more damage, generate more Havoc, and eventually reach devastating crescendos. They also project a doom aura that weakens nearby enemies.`,

        playstyle: 'Escalating damage, delayed gratification, doom aura, round-dependent power scaling',

        strengths: [
          'Prophecy effects escalate: +1d6 damage per round a prophecy remains active',
          'Doom aura: enemies within 15ft have -1 to all rolls per 3 Havoc you hold',
          'Delayed prophecies generate MORE Havoc the longer they tick',
          'Late-combat power spike is the highest of any spec'
        ],

        weaknesses: [
          'Weak in early combat—needs time to build up',
          'Vulnerable to being focused down before prophecies mature',
          'Less effective in short combats (3 rounds or fewer)',
          'Escalation requires concentration and positioning'
        ],

        specPassive: {
          name: 'Escalating Doom',
          description: 'Every round a prophecy remains active, its effects increase: +1d6 damage per round, +1 Havoc generated per tick. Your doom aura gives enemies within 15ft -1 to all rolls for every 3 Havoc you currently hold (max -5). At 10+ Havoc, your prophecies also apply a stacking "Doom" debuff: -1 to saves per stack.'
        },

        keyAbilities: [
          'Escalating Countdown: Place a prophecy that gains +1d8 damage per round for 5 rounds, then detonates (4 Havoc)',
          'Doom Aura Expansion: Spend 3 Havoc to expand doom aura to 30ft and increase penalty to -2',
          'Endbringer\'s Finale: After 5+ rounds of combat, spend 8 Havoc to trigger ALL active prophecies simultaneously with maximized Prophesized effects'
        ],

        recommendedFor: 'Players who enjoy delayed gratification and increasingly devastating power over time'
      },

      {
        id: 'cataclysm',
        name: 'Cataclysm',
        icon: 'Fire/Fire Storm',
        color: '#FF6347',
        theme: 'Area Prophecies & Battlefield-Wide Chaos',

        description: `Cataclysms specialize in area-based prophecies that create RNG chaos across the entire battlefield. Their prophecy ranges affect zones rather than single targets, and they can have multiple area prophecies active simultaneously. They earn Havoc from every target caught in their area prophecies—making them the most efficient Havoc generators.`,

        playstyle: 'Area control, multi-target RNG chaos, simultaneous prophecies, battlefield domination',

        strengths: [
          'All spells can affect areas (15-40ft radius)',
          'Earn Havoc per target hit in area prophecies (1 Havoc per target)',
          'Can maintain 2+ area prophecies simultaneously',
          'Prophesized effects on area spells apply to ALL targets in the zone'
        ],

        weaknesses: [
          'Prophesized damage per target is lower than Requiem\'s single-target',
          'Friendly fire risk on some area prophecies',
          'Requires enemies to cluster for maximum effect',
          'Less effective against spread-out enemies or single bosses'
        ],

        specPassive: {
          name: 'Cataclysmic Range',
          description: 'All your prophecies are area-based (minimum 15ft radius). You earn +1 Havoc per target caught in the area when Prophesized. You can have up to 3 area prophecies active simultaneously. When two or more of your area prophecies overlap, the overlapping zone deals double damage and grants +1 bonus Havoc per target.'
        },

        keyAbilities: [
          'Rain of Doom: Place a 30ft area prophecy that rains RNG effects each round (roll d6 table: fire/necrotic/psychic/force/stun/heal reversal)',
          'Cataclysm Cascade: When an area prophecy Prophesized, all targets in the zone trigger a secondary prophecy (3 Havoc)',
          'End of Days: Spend 10 Havoc to create a 40ft zone where ALL dice rolls are subject to your prophecy range for 3 rounds'
        ],

        recommendedFor: 'Players who love creating battlefield-wide chaos and controlling the flow of combat through area denial'
      }
    ]
  },

  exampleSpells: [
    // ===== LEVEL 1 SPELLS =====
    {
      id: 'doomsayer_doom_bolt',
      name: 'Doom Bolt',
      description: 'Place a basic prophecy on a target. Roll d8 and d6 to set the Prophecy Range, then resolve immediately.',
      spellType: 'ACTION',
      icon: 'Necrotic/Skull Burst',
      school: 'Evocation',
      level: 1,
      specialization: 'universal',
      typeConfig: { castTime: 1, castTimeType: 'IMMEDIATE' },
      targetingConfig: { type: 'SINGLE', range: 60, rangeUnit: 'feet', requiresLineOfSight: true, allowFriendly: false, allowSelf: false },
      resourceCost: { actionPoints: 1, mana: 6, components: ['verbal', 'somatic'], description: '6 mana. Prophecy Range: d8 + d6.' },
      duration: { value: 0, unit: 'instant', concentration: false },
      resolution: 'DICE',
      prophecyRange: { diceTypes: ['d8', 'd6'], prophesized: '4d8 necrotic + weakened 2 rounds', base: '2d8 necrotic', outside: '1d8 necrotic to self' },
      damageConfig: { formula: '2d8', elementType: 'necrotic', damageType: 'direct' },
      tags: ['damage', 'necrotic', 'prophecy', 'universal']
    },
    {
      id: 'doomsayer_doom_whisper',
      name: 'Doom Whisper',
      description: 'Whisper doom into a target\'s mind, placing a minor prophecy that rattles them.',
      spellType: 'ACTION',
      icon: 'Psychic/Agonizing Scream',
      school: 'Enchantment',
      level: 1,
      specialization: 'requiem',
      typeConfig: { castTime: 1, castTimeType: 'IMMEDIATE' },
      targetingConfig: { type: 'SINGLE', range: 30, rangeUnit: 'feet', requiresLineOfSight: true, allowFriendly: false, allowSelf: false },
      resourceCost: { actionPoints: 1, mana: 5, components: ['verbal'], description: '5 mana. Prophecy Range: d4 + d4.' },
      duration: { value: 2, unit: 'rounds', concentration: false },
      resolution: 'SAVING_THROW',
      savingThrow: { ability: 'SPIRIT', dc: 'SPELL_DC', onSave: 'Half effect', onFail: 'Full effect' },
      prophecyRange: { diceTypes: ['d4', 'd4'], prophesized: '-3 to all rolls 2 rounds + 2d6 psychic', base: '-1 to all rolls 2 rounds + 1d6 psychic', outside: '1d4 psychic to self' },
      damageConfig: { formula: '1d6', elementType: 'psychic', damageType: 'direct' },
      tags: ['debuff', 'psychic', 'prophecy', 'requiem']
    },
    {
      id: 'doomsayer_omen_flame',
      name: 'Omen Flame',
      description: 'Hurl a bolt of prophetic fire that sets a target ablaze with doom fire.',
      spellType: 'ACTION',
      icon: 'Fire/Fire Bolt',
      school: 'Evocation',
      level: 1,
      specialization: 'cataclysm',
      typeConfig: { castTime: 1, castTimeType: 'IMMEDIATE' },
      targetingConfig: { type: 'SINGLE', range: 40, rangeUnit: 'feet', requiresLineOfSight: true, allowFriendly: false, allowSelf: false },
      resourceCost: { actionPoints: 1, mana: 5, components: ['verbal', 'somatic'], description: '5 mana. Prophecy Range: d6 + d6.' },
      duration: { value: 0, unit: 'instant', concentration: false },
      resolution: 'DICE',
      prophecyRange: { diceTypes: ['d6', 'd6'], prophesized: '3d6 fire + 1d6 force + ignite (1d6/round for 2 rounds)', base: '2d6 fire', outside: '1d4 fire to self' },
      damageConfig: { formula: '2d6', elementType: 'fire', damageType: 'direct' },
      tags: ['damage', 'fire', 'prophecy', 'cataclysm']
    },

    // ===== LEVEL 2 SPELLS =====
    {
      id: 'doomsayer_doom_countdown',
      name: 'Doom Countdown',
      description: 'Place a ticking time bomb prophecy on a target. Deals damage each round for 3 rounds, then detonates.',
      spellType: 'ACTION',
      icon: 'Necrotic/Skull Explosion',
      school: 'Necromancy',
      level: 2,
      specialization: 'endbringer',
      typeConfig: { castTime: 1, castTimeType: 'ACTION' },
      targetingConfig: { type: 'SINGLE', range: 40, rangeUnit: 'feet', requiresLineOfSight: true, allowFriendly: false, allowSelf: false },
      resourceCost: { actionPoints: 2, mana: 8, components: ['verbal', 'somatic'], description: '8 mana. Delayed prophecy: 3 rounds.' },
      duration: { value: 3, unit: 'rounds', concentration: true },
      resolution: 'DICE',
      prophecyRange: { diceTypes: ['d6', 'd4'], tickDamage: '1d6 necrotic/round', detonation: '4d8 necrotic + stunned 1 round on Prophesized, 2d8 on Base, 1d8 to self on Outside', havocPerTick: 1 },
      damageConfig: { formula: '1d6', elementType: 'necrotic', damageType: 'dot' },
      tags: ['damage', 'necrotic', 'prophecy', 'endbringer', 'delayed', 'concentration']
    },
    {
      id: 'doomsayer_calamity_zone',
      name: 'Calamity Zone',
      description: 'Place an area prophecy that creates a zone of RNG effects centered on a point.',
      spellType: 'ACTION',
      icon: 'Fire/Fire Storm',
      school: 'Evocation',
      level: 2,
      specialization: 'cataclysm',
      typeConfig: { castTime: 1, castTimeType: 'ACTION' },
      targetingConfig: { type: 'AREA', range: 40, rangeUnit: 'feet', areaType: 'radius', areaSize: 15, requiresLineOfSight: true },
      resourceCost: { actionPoints: 2, mana: 10, components: ['verbal', 'somatic'], description: '10 mana. Area prophecy.' },
      duration: { value: 0, unit: 'instant', concentration: false },
      resolution: 'DICE',
      prophecyRange: { diceTypes: ['d10', 'd8'], prophesized: '3d8 fire + 1d8 force to all + difficult terrain 3 rounds', base: '2d8 fire to all', outside: '1d6 fire to self' },
      damageConfig: { formula: '2d8', elementType: 'fire', damageType: 'direct' },
      tags: ['damage', 'fire', 'prophecy', 'cataclysm', 'area']
    },
    {
      id: 'doomsayer_death_mark',
      name: 'Death Mark',
      description: 'Mark a target with a narrow but deadly prophecy. High risk, devastating Prophesized payoff.',
      spellType: 'ACTION',
      icon: 'Necrotic/Death Mark',
      school: 'Necromancy',
      level: 2,
      specialization: 'requiem',
      typeConfig: { castTime: 1, castTimeType: 'ACTION' },
      targetingConfig: { type: 'SINGLE', range: 30, rangeUnit: 'feet', requiresLineOfSight: true, allowFriendly: false, allowSelf: false },
      resourceCost: { actionPoints: 2, mana: 10, havoc: 2, components: ['verbal', 'somatic'], description: '10 mana + 2 Havoc. Narrow range: d4 + d4.' },
      duration: { value: 0, unit: 'instant', concentration: false },
      resolution: 'DICE',
      prophecyRange: { diceTypes: ['d4', 'd4'], prophesized: '6d8 necrotic + target cannot heal for 3 rounds', base: '3d8 necrotic', outside: '2d8 necrotic to self' },
      damageConfig: { formula: '3d8', elementType: 'necrotic', damageType: 'direct' },
      tags: ['damage', 'necrotic', 'prophecy', 'requiem', 'precision']
    },

    // ===== LEVEL 3 SPELLS =====
    {
      id: 'doomsayer_havoc_blast',
      name: 'Havoc Blast',
      description: 'Unleash stored Havoc as a devastating blast of chaotic energy.',
      spellType: 'ACTION',
      icon: 'Arcane/Swirling Vortex',
      school: 'Evocation',
      level: 3,
      specialization: 'universal',
      typeConfig: { castTime: 1, castTimeType: 'IMMEDIATE' },
      targetingConfig: { type: 'SINGLE', range: 50, rangeUnit: 'feet', requiresLineOfSight: true, allowFriendly: false, allowSelf: false },
      resourceCost: { actionPoints: 2, mana: 14, havoc: 3, components: ['verbal', 'somatic'], description: '14 mana + 3 Havoc' },
      duration: { value: 0, unit: 'instant', concentration: false },
      resolution: 'DICE',
      prophecyRange: { diceTypes: ['d8', 'd6'], prophesized: '6d8 damage (split any between necrotic/fire/psychic) + target weakened', base: '4d8 damage', outside: '2d8 to self' },
      damageConfig: { formula: '4d8', elementType: 'necrotic', damageType: 'direct' },
      tags: ['damage', 'prophecy', 'universal', 'havoc']
    },
    {
      id: 'doomsayer_escalating_doom',
      name: 'Escalating Doom',
      description: 'Place a prophecy that grows more devastating each round it remains active.',
      spellType: 'ACTION',
      icon: 'Void/Black Hole',
      school: 'Necromancy',
      level: 3,
      specialization: 'endbringer',
      typeConfig: { castTime: 1, castTimeType: 'ACTION' },
      targetingConfig: { type: 'SINGLE', range: 40, rangeUnit: 'feet', requiresLineOfSight: true, allowFriendly: false, allowSelf: false },
      resourceCost: { actionPoints: 2, mana: 12, components: ['verbal', 'somatic'], description: '12 mana. 5-round delayed prophecy.' },
      duration: { value: 5, unit: 'rounds', concentration: true },
      resolution: 'DICE',
      prophecyRange: { diceTypes: ['d8', 'd6'], tickDamage: '1d8 + 1d6 per round active (cumulative)', detonation: 'Base damage + accumulated bonus. Prophesized: double accumulated. Outside: half accumulated to self.', havocPerTick: 1 },
      tags: ['damage', 'necrotic', 'prophecy', 'endbringer', 'delayed', 'escalating', 'concentration']
    },
    {
      id: 'doomsayer_rain_of_doom',
      name: 'Rain of Doom',
      description: 'Create a 30ft zone where prophetic effects rain down each round based on a d6 table.',
      spellType: 'ACTION',
      icon: 'Chaos/Comet Rain',
      school: 'Evocation',
      level: 3,
      specialization: 'cataclysm',
      typeConfig: { castTime: 1, castTimeType: 'ACTION' },
      targetingConfig: { type: 'AREA', range: 50, rangeUnit: 'feet', areaType: 'radius', areaSize: 30, requiresLineOfSight: true },
      resourceCost: { actionPoints: 2, mana: 16, havoc: 3, components: ['verbal', 'somatic'], description: '16 mana + 3 Havoc. Area prophecy.' },
      duration: { value: 3, unit: 'rounds', concentration: true },
      resolution: 'DICE',
      prophecyRange: { diceTypes: ['d6', 'd6'], rainTable: ['1: 2d6 fire to all', '2: 2d6 necrotic to all', '3: 2d6 psychic to all', '4: 1d6 force + knocked prone', '5: Stunned 1 round', '6: Roll twice (prophesized auto-triggers)'], prophesized: 'Roll twice on table, apply both', base: 'Roll once', outside: 'Effects target self instead' },
      tags: ['damage', 'prophecy', 'cataclysm', 'area', 'table', 'concentration']
    },

    // ===== LEVEL 4-10: Abbreviated for space, same pattern =====
    {
      id: 'doomsayer_requiem_of_death',
      name: 'Requiem of Death',
      description: 'A focused death prophecy that deals devastating single-target damage with a narrow range.',
      spellType: 'ACTION', icon: 'Necrotic/Necrotic Skull', school: 'Necromancy', level: 4, specialization: 'requiem',
      typeConfig: { castTime: 1, castTimeType: 'ACTION' },
      targetingConfig: { type: 'SINGLE', range: 40, rangeUnit: 'feet', requiresLineOfSight: true, allowFriendly: false, allowSelf: false },
      resourceCost: { actionPoints: 2, mana: 20, havoc: 4, components: ['verbal', 'somatic'] },
      duration: { value: 0, unit: 'instant', concentration: false }, resolution: 'DICE',
      prophecyRange: { diceTypes: ['d6', 'd4'], prophesized: '8d10 necrotic + target cannot be healed for 5 rounds', base: '5d10 necrotic', outside: '3d10 to self' },
      damageConfig: { formula: '5d10', elementType: 'necrotic', damageType: 'direct' },
      tags: ['damage', 'necrotic', 'prophecy', 'requiem']
    },
    {
      id: 'doomsayer_doom_aura',
      name: 'Doom Aura',
      description: 'Project an aura of escalating doom that weakens nearby enemies and generates Havoc passively.',
      spellType: 'ACTION', icon: 'Necrotic/Necrotic Wither', school: 'Enchantment', level: 4, specialization: 'endbringer',
      typeConfig: { castTime: 1, castTimeType: 'IMMEDIATE' },
      targetingConfig: { type: 'SELF_CENTERED', range: 0, rangeUnit: 'self', areaType: 'radius', areaSize: 20 },
      resourceCost: { actionPoints: 2, mana: 18, havoc: 3, components: ['verbal', 'somatic'] },
      duration: { value: 5, unit: 'rounds', concentration: true }, resolution: 'AUTOMATIC',
      effects: { primary: 'Enemies in aura: -2 to all rolls. +1 penalty per round active (max -5).', secondary: 'Gain 1 Havoc per round per enemy in aura.' },
      tags: ['debuff', 'aura', 'endbringer', 'prophecy', 'concentration']
    },
    {
      id: 'doomsayer_cataclysm_blast',
      name: 'Cataclysm Blast',
      description: 'Massive area prophecy detonation affecting a wide area.',
      spellType: 'ACTION', icon: 'Fire/Volcanic Erupt', school: 'Evocation', level: 4, specialization: 'cataclysm',
      typeConfig: { castTime: 1, castTimeType: 'ACTION' },
      targetingConfig: { type: 'AREA', range: 50, rangeUnit: 'feet', areaType: 'radius', areaSize: 25, requiresLineOfSight: true },
      resourceCost: { actionPoints: 2, mana: 20, havoc: 4, components: ['verbal', 'somatic', 'material'] },
      duration: { value: 0, unit: 'instant', concentration: false }, resolution: 'DICE',
      prophecyRange: { diceTypes: ['d10', 'd8'], prophesized: '6d8 fire + 3d8 necrotic to all + difficult terrain 5 rounds', base: '4d8 fire + 2d8 necrotic', outside: '2d8 to self' },
      damageConfig: { formula: '4d8', elementType: 'fire', damageType: 'direct' },
      tags: ['damage', 'fire', 'necrotic', 'prophecy', 'cataclysm', 'area']
    },
    // LEVEL 5
    {
      id: 'doomsayer_prophecy_of_ruin',
      name: 'Prophecy of Ruin',
      description: 'A devastating prophecy that can shatter an area with RNG chaos.',
      spellType: 'ACTION', icon: 'Void/Red Energy Burst', school: 'Evocation', level: 5, specialization: 'universal',
      typeConfig: { castTime: 1, castTimeType: 'ACTION' },
      targetingConfig: { type: 'AREA', range: 60, rangeUnit: 'feet', areaType: 'radius', areaSize: 20, requiresLineOfSight: true },
      resourceCost: { actionPoints: 2, mana: 25, havoc: 5, components: ['verbal', 'somatic', 'material'] },
      duration: { value: 0, unit: 'instant', concentration: false }, resolution: 'DICE',
      prophecyRange: { diceTypes: ['d12', 'd8'], prophesized: '8d8 mixed (fire/necrotic/psychic/force) to all + stunned 1 round', base: '5d8 mixed to all', outside: '3d8 to self + stunned 1 round' },
      damageConfig: { formula: '5d8', elementType: 'necrotic', damageType: 'direct' },
      tags: ['damage', 'prophecy', 'universal', 'area']
    },
    {
      id: 'doomsayer_stacked_doom',
      name: 'Stacked Doom',
      description: 'Detonate all active prophecies on a single target simultaneously.',
      spellType: 'ACTION', icon: 'Necrotic/Skull Burst', school: 'Necromancy', level: 5, specialization: 'requiem',
      typeConfig: { castTime: 1, castTimeType: 'ACTION' },
      targetingConfig: { type: 'SINGLE', range: 30, rangeUnit: 'feet', requiresLineOfSight: true, allowFriendly: false, allowSelf: false },
      resourceCost: { actionPoints: 3, mana: 24, havoc: 6, components: ['verbal', 'somatic'] },
      duration: { value: 0, unit: 'instant', concentration: false }, resolution: 'DICE',
      effects: { primary: 'Detonate ALL active prophecies on target. Each prophecy deals its Prophesized damage regardless of range roll. If 3+ prophecies detonated, target is also paralyzed for 1 round.' },
      tags: ['damage', 'prophecy', 'requiem', 'detonate']
    },
    {
      id: 'doomsayer_doom_nova',
      name: 'Doom Nova',
      description: 'Create an expanding wave of prophetic doom that damages all enemies in a massive area.',
      spellType: 'ACTION', icon: 'Fire/Fire Storm', school: 'Evocation', level: 5, specialization: 'cataclysm',
      typeConfig: { castTime: 1, castTimeType: 'ACTION' },
      targetingConfig: { type: 'SELF_CENTERED', range: 0, rangeUnit: 'self', areaType: 'radius', areaSize: 40 },
      resourceCost: { actionPoints: 3, mana: 26, havoc: 6, components: ['verbal', 'somatic'] },
      duration: { value: 0, unit: 'instant', concentration: false }, resolution: 'DICE',
      prophecyRange: { diceTypes: ['d12', 'd10'], prophesized: '6d8 fire + 6d8 necrotic to all enemies in range', base: '4d8 fire + 4d8 necrotic', outside: '2d8 fire + 2d8 necrotic to self' },
      damageConfig: { formula: '4d8', elementType: 'fire', damageType: 'direct' },
      tags: ['damage', 'fire', 'necrotic', 'prophecy', 'cataclysm', 'area']
    },
    // LEVEL 6-10 (powerful spells following the same prophecy pattern)
    { id: 'doomsayer_cascade_doom', name: 'Cascade Doom', description: 'When a prophecy Prophesized, all targets in zone trigger secondary prophecy.', spellType: 'ACTION', icon: 'Fire/Fiery Arc', school: 'Evocation', level: 6, specialization: 'cataclysm', typeConfig: { castTime: 1, castTimeType: 'ACTION' }, targetingConfig: { type: 'AREA', range: 50, rangeUnit: 'feet', areaType: 'radius', areaSize: 25 }, resourceCost: { actionPoints: 2, mana: 30, havoc: 7, components: ['verbal', 'somatic'] }, duration: { value: 0, unit: 'instant', concentration: false }, resolution: 'DICE', prophecyRange: { diceTypes: ['d10', 'd8'], prophesized: '8d8 fire + cascade 4d8 to secondary targets within 15ft', base: '5d8 fire', outside: '3d8 to self' }, damageConfig: { formula: '5d8', elementType: 'fire', damageType: 'direct' }, tags: ['damage', 'prophecy', 'cataclysm', 'area', 'cascade'] },
    { id: 'doomsayer_endbringer_finale', name: 'Endbringer\'s Finale', description: 'After 5+ rounds of combat, detonate all active prophecies with maximized effects.', spellType: 'ACTION', icon: 'Void/Falling Meteors', school: 'Evocation', level: 6, specialization: 'endbringer', typeConfig: { castTime: 1, castTimeType: 'ACTION' }, targetingConfig: { type: 'SPECIAL', range: 60, rangeUnit: 'feet' }, resourceCost: { actionPoints: 3, mana: 32, havoc: 8, components: ['verbal', 'somatic'] }, duration: { value: 0, unit: 'instant', concentration: false }, resolution: 'AUTOMATIC', effects: { primary: 'Detonate ALL active prophecies. Each deals its Prophesized effect automatically (no range roll needed). Each prophecy generates double Havoc.' }, cooldownConfig: { type: 'long_rest', value: 1 }, tags: ['ultimate', 'prophecy', 'endbringer', 'detonate'] },
    { id: 'doomsayer_execution_prophecy', name: 'Execution Prophecy', description: 'Place a lethal prophecy on a low-HP target. Prophesized = instant death.', spellType: 'ACTION', icon: 'Necrotic/Necrotic Skull', school: 'Necromancy', level: 6, specialization: 'requiem', typeConfig: { castTime: 1, castTimeType: 'RITUAL' }, targetingConfig: { type: 'SINGLE', range: 30, rangeUnit: 'feet', requiresLineOfSight: true, allowFriendly: false, allowSelf: false }, resourceCost: { actionPoints: 3, mana: 30, havoc: 8, components: ['verbal', 'somatic', 'material'] }, duration: { value: 0, unit: 'instant', concentration: false }, resolution: 'SAVING_THROW', savingThrow: { ability: 'SPIRIT', dc: 'SPELL_DC', onSave: '8d10 necrotic damage instead', onFail: 'Target reduced to 0 HP if below 50% health' }, prophecyRange: { diceTypes: ['d4', 'd4'], prophesized: 'No save—target is reduced to 0 HP regardless of health', base: 'Spirit save as above', outside: '8d10 necrotic to self' }, cooldownConfig: { type: 'long_rest', value: 1 }, tags: ['ultimate', 'death', 'prophecy', 'requiem'] },
    // LEVEL 7
    { id: 'doomsayer_armageddon_herald', name: 'Armageddon Herald', description: 'Become a living conduit of doom, gaining powerful passive effects.', spellType: 'ACTION', icon: 'Void/Demonic Possesion', school: 'Transmutation', level: 7, specialization: 'endbringer', typeConfig: { castTime: 1, castTimeType: 'ACTION' }, targetingConfig: { type: 'SELF', range: 0, rangeUnit: 'self' }, resourceCost: { actionPoints: 3, mana: 35, havoc: 8, components: ['verbal', 'somatic'] }, duration: { value: 1, unit: 'minute', concentration: true }, resolution: 'AUTOMATIC', effects: { primary: 'Gain doom form: +2 to all Prophecy Range resolution rolls, all prophecies generate double Havoc, doom aura expands to 30ft with -3 penalty.', secondary: 'All damage you deal becomes necrotic + fire and ignores 5 resistance.' }, cooldownConfig: { type: 'long_rest', value: 1 }, tags: ['ultimate', 'transformation', 'endbringer', 'prophecy'] },
    { id: 'doomsayer_apocalypse_zone', name: 'Apocalypse Zone', description: 'Create a 40ft zone where fate itself is subject to your prophecy range for 3 rounds.', spellType: 'ACTION', icon: 'Fire/Volcanic Erupt', school: 'Transmutation', level: 7, specialization: 'cataclysm', typeConfig: { castTime: 1, castTimeType: 'RITUAL' }, targetingConfig: { type: 'AREA', range: 60, rangeUnit: 'feet', areaType: 'radius', areaSize: 40 }, resourceCost: { actionPoints: 3, mana: 38, havoc: 10, components: ['verbal', 'somatic', 'material'] }, duration: { value: 3, unit: 'rounds', concentration: true }, resolution: 'AUTOMATIC', effects: { primary: 'All d20 rolls made within the zone are subject to your prophecy range. Even results = bonus effects, odd = penalty effects. You control the boundaries.', secondary: 'Enemies in zone take 3d8 fire + 3d8 necrotic per round.' }, cooldownConfig: { type: 'long_rest', value: 1 }, tags: ['ultimate', 'prophecy', 'cataclysm', 'area', 'zone'] },
    { id: 'doomsayer_prophecy_of_annihilation', name: 'Prophecy of Annihilation', description: 'The ultimate single-target prophecy. Prophesized destroys utterly.', spellType: 'ACTION', icon: 'Necrotic/Grim Reaper Casting', school: 'Necromancy', level: 7, specialization: 'requiem', typeConfig: { castTime: 1, castTimeType: 'RITUAL' }, targetingConfig: { type: 'SINGLE', range: 30, rangeUnit: 'feet', requiresLineOfSight: true, allowFriendly: false, allowSelf: false }, resourceCost: { actionPoints: 3, mana: 38, havoc: 10, components: ['verbal', 'somatic', 'material'] }, duration: { value: 0, unit: 'instant', concentration: false }, resolution: 'DICE', prophecyRange: { diceTypes: ['d4', 'd4'], prophesized: '12d12 necrotic. If target is below 25% HP, reduced to 0 regardless.', base: '8d12 necrotic', outside: '6d12 necrotic to self + stunned 1 round' }, damageConfig: { formula: '8d12', elementType: 'necrotic', damageType: 'direct' }, cooldownConfig: { type: 'long_rest', value: 1 }, tags: ['ultimate', 'damage', 'prophecy', 'requiem'] },
    // LEVEL 8
    { id: 'doomsayer_twist_of_doom', name: 'Twist of Doom', description: 'Reaction: Reroll a prophecy range resolution and force the new result.', spellType: 'REACTION', icon: 'Arcane/Magical Staff', school: 'Divination', level: 8, specialization: 'universal', typeConfig: { castTime: 0, castTimeType: 'REACTION' }, targetingConfig: { type: 'SPECIAL', range: 60, rangeUnit: 'feet' }, resourceCost: { actionPoints: 0, mana: 15, havoc: 5, components: ['verbal'] }, duration: { value: 0, unit: 'instant', concentration: false }, resolution: 'AUTOMATIC', effects: { primary: 'Reroll any prophecy range resolution die. Must accept new result. If new result is Prophesized, gain +3 Havoc.' }, cooldownConfig: { type: 'long_rest', value: 1 }, tags: ['reaction', 'prophecy', 'universal', 'reroll'] },
    { id: 'doomsayer_doom_legion', name: 'Doom Legion', description: 'Place a prophecy on every enemy you can see. All detonate simultaneously.', spellType: 'ACTION', icon: 'Chaos/Chaotic Rupture', school: 'Necromancy', level: 8, specialization: 'cataclysm', typeConfig: { castTime: 1, castTimeType: 'RITUAL' }, targetingConfig: { type: 'SPECIAL', range: 60, rangeUnit: 'feet' }, resourceCost: { actionPoints: 3, mana: 40, havoc: 10, components: ['verbal', 'somatic', 'material'] }, duration: { value: 0, unit: 'instant', concentration: false }, resolution: 'DICE', prophecyRange: { diceTypes: ['d8', 'd6'], prophesized: '8d8 fire + necrotic to each enemy. +4 Havoc per enemy hit.', base: '5d8 to each enemy', outside: '2d8 to self per enemy that missed' }, damageConfig: { formula: '5d8', elementType: 'fire', damageType: 'direct' }, cooldownConfig: { type: 'long_rest', value: 1 }, tags: ['ultimate', 'prophecy', 'cataclysm', 'area', 'multi'] },
    { id: 'doomsayer_death_sentence', name: 'Death Sentence', description: 'Mark a target for absolute death. Within 3 rounds, they WILL die unless saved by divine intervention.', spellType: 'ACTION', icon: 'Necrotic/Necrotic Skull', school: 'Necromancy', level: 8, specialization: 'requiem', typeConfig: { castTime: 1, castTimeType: 'RITUAL' }, targetingConfig: { type: 'SINGLE', range: 30, rangeUnit: 'feet', requiresLineOfSight: true, allowFriendly: false, allowSelf: false }, resourceCost: { actionPoints: 3, mana: 40, havoc: 10, components: ['verbal', 'somatic', 'material'] }, duration: { value: 3, unit: 'rounds', concentration: true }, resolution: 'SAVING_THROW', savingThrow: { ability: 'SPIRIT', dc: 'SPELL_DC', onSave: 'Take 10d10 necrotic instead', onFail: 'At end of 3 rounds, reduced to 0 HP. No save. No immunity.' }, prophecyRange: { diceTypes: ['d6', 'd4'], prophesized: 'No save allowed. Target is aware of impending doom.', base: 'Spirit save as above', outside: '10d10 necrotic to self' }, cooldownConfig: { type: 'long_rest', value: 1 }, tags: ['ultimate', 'death', 'prophecy', 'requiem', 'concentration'] },
    // LEVEL 9
    { id: 'doomsayer_the_end', name: 'The End', description: 'Speak the word of ending. All creatures in range face a prophecy of annihilation.', spellType: 'ACTION', icon: 'Void/Black Hole', school: 'Evocation', level: 9, specialization: 'universal', typeConfig: { castTime: 1, castTimeType: 'RITUAL' }, targetingConfig: { type: 'SELF_CENTERED', range: 0, rangeUnit: 'self', areaType: 'radius', areaSize: 60 }, resourceCost: { actionPoints: 3, mana: 50, havoc: 12, components: ['verbal', 'somatic', 'material'] }, duration: { value: 0, unit: 'instant', concentration: false }, resolution: 'DICE', prophecyRange: { diceTypes: ['d12', 'd10'], prophesized: '10d10 mixed to all enemies. Enemies below 30% HP are reduced to 0.', base: '6d10 mixed to all enemies', outside: '4d10 to self' }, damageConfig: { formula: '6d10', elementType: 'necrotic', damageType: 'direct' }, cooldownConfig: { type: 'long_rest', value: 1 }, tags: ['ultimate', 'damage', 'prophecy', 'universal', 'area'] },
    { id: 'doomsayer_cataclysm_incarnate', name: 'Cataclysm Incarnate', description: 'Become a walking cataclysm. Everything around you is subject to prophetic destruction.', spellType: 'ACTION', icon: 'Fire/Fire Demon', school: 'Transmutation', level: 9, specialization: 'cataclysm', typeConfig: { castTime: 1, castTimeType: 'RITUAL' }, targetingConfig: { type: 'SELF', range: 0, rangeUnit: 'self' }, resourceCost: { actionPoints: 3, mana: 50, havoc: 12, components: ['verbal', 'somatic'] }, duration: { value: 1, unit: 'minute', concentration: true }, resolution: 'AUTOMATIC', effects: { primary: 'For duration: At start of each turn, roll d6 table affecting all enemies within 40ft: 1-2 fire, 3-4 necrotic, 5 psychic + stun, 6 force + knockback. All hits are auto-Prophesized.', secondary: 'Gain immunity to fire and necrotic. All Havoc costs reduced by half.' }, cooldownConfig: { type: 'long_rest', value: 1 }, tags: ['ultimate', 'transformation', 'cataclysm', 'prophecy', 'area'] },
    { id: 'doomsayer_requiem_absolute', name: 'Requiem Absolute', description: 'The final requiem. Place a prophecy so absolute that fate itself cannot deny it.', spellType: 'ACTION', icon: 'Necrotic/Necrotic Wither 2', school: 'Necromancy', level: 9, specialization: 'requiem', typeConfig: { castTime: 1, castTimeType: 'RITUAL' }, targetingConfig: { type: 'SINGLE', range: 30, rangeUnit: 'feet', requiresLineOfSight: true, allowFriendly: false, allowSelf: false }, resourceCost: { actionPoints: 3, mana: 50, havoc: 12, components: ['verbal', 'somatic'] }, duration: { value: 0, unit: 'instant', concentration: false }, resolution: 'DICE', prophecyRange: { diceTypes: ['d4', 'd4'], prophesized: 'Target is reduced to 0 HP. No save. No immunity. Even undead and constructs.', base: '15d12 necrotic damage', outside: '15d12 necrotic to self' }, damageConfig: { formula: '15d12', elementType: 'necrotic', damageType: 'direct' }, cooldownConfig: { type: 'long_rest', value: 1 }, tags: ['ultimate', 'death', 'prophecy', 'requiem'] },
    // LEVEL 10
    { id: 'doomsayer_herald_of_the_end', name: 'Herald of the End', description: 'Transform into the Herald of the End Times. For one minute, you ARE the apocalypse.', spellType: 'ACTION', icon: 'Void/Falling Meteors', school: 'Transmutation', level: 10, specialization: 'universal', typeConfig: { castTime: 1, castTimeType: 'RITUAL' }, targetingConfig: { type: 'SELF', range: 0, rangeUnit: 'self' }, resourceCost: { actionPoints: 3, mana: 60, havoc: 15, components: ['verbal', 'somatic', 'material'] }, duration: { value: 1, unit: 'minute', concentration: true }, resolution: 'AUTOMATIC', effects: { primary: 'For duration: (1) All prophecy ranges are auto-Prophesized—no range roll needed. (2) Every spell generates triple Havoc. (3) Immune to fire, necrotic, psychic. (4) +5 to all damage rolls. (5) All spells that would cause Prophecy Backlash instead deal double damage to enemies.', secondary: 'Doom aura: 60ft, enemies -3 to all rolls. Each round, roll d6 table affecting all enemies in aura.' }, cooldownConfig: { type: 'long_rest', value: 1 }, tags: ['ultimate', 'transformation', 'prophecy', 'universal'] },
    { id: 'doomsayer_end_of_all_things', name: 'End of All Things', description: 'Speak the prophecy that ends all prophecies. Every active prophecy on the battlefield detonates simultaneously at maximum power.', spellType: 'ACTION', icon: 'Void/Consumed by Void', school: 'Evocation', level: 10, specialization: 'cataclysm', typeConfig: { castTime: 1, castTimeType: 'RITUAL' }, targetingConfig: { type: 'SELF_CENTERED', range: 0, rangeUnit: 'self', areaType: 'radius', areaSize: 120 }, resourceCost: { actionPoints: 3, mana: 60, havoc: 15, components: ['verbal', 'somatic'] }, duration: { value: 0, unit: 'instant', concentration: false }, resolution: 'AUTOMATIC', effects: { primary: 'Detonate ALL active prophecies (yours and any other Doomsayer\'s) within 120ft. Each prophecy resolves as Prophesized automatically. Combined damage is applied to all affected targets. Gain Havoc equal to total prophecies detonated.', secondary: 'The explosion leaves a "Scorched Earth" zone for 5 rounds: enemies take 3d8 fire/necrotic per round, no prophecy can be placed in this zone.' }, cooldownConfig: { type: 'long_rest', value: 1 }, tags: ['ultimate', 'prophecy', 'cataclysm', 'detonate', 'area'] },
    { id: 'doomsayer_final_requiem', name: 'Final Requiem', description: 'The last song of doom. Sing the prophecy that cannot be denied, cannot be survived, cannot be escaped.', spellType: 'ACTION', icon: 'Necrotic/Necrotic Wither 4', school: 'Necromancy', level: 10, specialization: 'requiem', typeConfig: { castTime: 1, castTimeType: 'RITUAL' }, targetingConfig: { type: 'SINGLE', range: 60, rangeUnit: 'feet', requiresLineOfSight: true, allowFriendly: false, allowSelf: false }, resourceCost: { actionPoints: 3, mana: 60, havoc: 15, components: ['verbal', 'somatic'] }, duration: { value: 0, unit: 'instant', concentration: false }, resolution: 'AUTOMATIC', effects: { primary: 'No prophecy range roll. No saving throw. Target takes 20d12 necrotic damage. If this reduces them to 0 HP, they cannot be resurrected by any means. If target survives, they are permanently marked: all future Doomsayer prophecies against them auto-Prophesize.', secondary: 'You take damage equal to half the damage dealt (rounded down). The price of absolute doom.' }, cooldownConfig: { type: 'long_rest', value: 1 }, tags: ['ultimate', 'death', 'prophecy', 'requiem', 'absolute']
    }
  ],

  spellPools: {
    1: ['doomsayer_doom_bolt', 'doomsayer_doom_whisper', 'doomsayer_omen_flame', 'doomsayer_havoc_blast'],
    2: ['doomsayer_doom_countdown', 'doomsayer_calamity_zone', 'doomsayer_death_mark'],
    3: ['doomsayer_havoc_blast', 'doomsayer_escalating_doom', 'doomsayer_rain_of_doom'],
    4: ['doomsayer_requiem_of_death', 'doomsayer_doom_aura', 'doomsayer_cataclysm_blast'],
    5: ['doomsayer_prophecy_of_ruin', 'doomsayer_stacked_doom', 'doomsayer_doom_nova'],
    6: ['doomsayer_cascade_doom', 'doomsayer_endbringer_finale', 'doomsayer_execution_prophecy'],
    7: ['doomsayer_apocalypse_zone', 'doomsayer_armageddon_herald', 'doomsayer_prophecy_of_annihilation'],
    8: ['doomsayer_twist_of_doom', 'doomsayer_doom_legion', 'doomsayer_death_sentence'],
    9: ['doomsayer_the_end', 'doomsayer_cataclysm_incarnate', 'doomsayer_requiem_absolute'],
    10: ['doomsayer_herald_of_the_end', 'doomsayer_end_of_all_things', 'doomsayer_final_requiem']
  }
};
