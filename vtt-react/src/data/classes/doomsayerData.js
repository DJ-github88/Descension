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
      content: `**What You Need to Know**: Doomsayers place "living bomb" prophecies on targets or areas. Each prophecy has a **Prophecy Range** created by rolling 2 dice—the results form a range (e.g., d8=1 and d6=3 → range is 1-3). When the prophecy resolves, a roll is made against this range: landing **between** the boundaries triggers the **Prophesied** effect (enhanced), landing **on** a boundary gives the **Base** effect, and landing **outside** the range triggers the **Outside** effect (negative/fizzle/spell-dependent). You earn **Havoc** from fulfilled prophecies and spend it to fuel stronger spells.

**Prophecy Range Rules**:
1. **Creating the Range**: Roll 2 dice (type specified by each spell). The lower result becomes the **Low Boundary**; the higher result becomes the **High Boundary**. Die type does NOT determine position—only the numbers matter.
2. **Resolving the Prophecy**: Roll a resolution die (type specified by each spell) and compare the result to the range:
   - **Prophesied** (result falls between Low and High): Enhanced effect + Havoc earned.
   - **Base** (result equals Low or High boundary): Standard effect + 1 Havoc.
   - **Outside** (result is less than Low or greater than High): Negative effect / fizzle / self-damage. No Havoc.
3. **Doubles Rule**: If both dice roll the same number (e.g., d4=3 and d4=3), the range is a single value. The result can ONLY be Base (on the value) or Outside (any other result). Prophesied is impossible on doubles.

**Resource**: Havoc (earned by fulfilling prophecies, spent on stronger spells). Max 15. Persists between combats, resets on long rest.

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
**Adapt to Outcomes**: Prophesied effects are bonus—plan for the Base effect and treat Prophesied as a pleasant surprise

The Prophecy Range mechanic creates a unique minigame: you set the boundaries, but the outcome within those boundaries is uncertain. Narrow ranges are harder to hit but have more devastating Prophesied effects. Wide ranges are safer but less spectacular.`
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
6. **Risk Management**: If that Cataclysm Blast had rolled outside the range, YOU take the damage. Every prophecy is a calculated gamble.`
    },

    characterCreation: {
      title: 'Character Creation',
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
Your first combat will feel slow—you have 0 Havoc. Cast Doom Bolt or your spec spell to generate your first Havoc, then use it to widen ranges on bigger spells. The Doomsayer ramps up; you are not a turn-one powerhouse.`
    }
  },

  resourceSystem: {
    title: 'Havoc',
    subtitle: 'The Currency of Fulfilled Doom',

    description: `Doomsayers earn **Havoc** by fulfilling prophecies—when a target rolls inside the Prophecy Range and the Prophesied effect triggers, Havoc is generated. This chaotic energy is then spent to cast stronger spells, widen prophecy ranges for safer bets, or fuel devastating abilities. Unlike other resources that generate passively, Havoc only flows from successful prophecy fulfillment—rewarding aggressive play and accurate range-setting.

**Havoc Persistence**: Havoc carries over between combats but resets to 0 on a long rest. You cannot bank Havoc across days—use it or lose it.

**Havoc Overflow**: If an effect would grant you Havoc beyond your maximum (15), the excess is converted into 1d4 fire damage per point of overflow to a random enemy within 30ft (or wasted if no enemies are nearby). You never waste Havoc entirely—the energy finds an outlet.

**Concentration Limit**: You can maintain only **one concentration spell at a time**. If you cast a new concentration spell while maintaining another, the older one ends immediately. Choose carefully between your ticking prophecies and aura effects.`,

    cards: [
      {
        title: 'Havoc (0-15)',
        stats: 'Max: 15 | Earned from Prophecies',
        details: 'Generated when prophecies fulfill (Prophesied outcome). Spent on stronger spells and widening prophecy ranges. Must be earned through successful prophecy plays.'
      },
      {
        title: 'Prophecy Range',
        stats: '2 Dice → Low-High Range',
        details: 'Roll 2 dice (type per spell) to create a range. Target rolls against it. Inside = Prophesied (bonus), On boundary = Base, Outside = Negative/Fizzle.'
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
        ['Prophesied (inside range)', '+2 to +5', 'Base gain + spell-specific bonus'],
        ['Base (on boundary)', '+1', 'Prophecy hit but not enhanced'],
        ['Outside (fizzle/negative)', '+0', 'Prophecy failed—no Havoc earned'],
        ['Doom Countdown (per tick)', '+1', 'Delayed prophecies generate Havoc each round'],
        ['Doom Countdown (detonation)', '+3 to +6', 'Final burst when countdown reaches 0'],
        ['Multiple targets (area)', '+1 per target', 'Area prophecies generate Havoc per target hit']
      ]
    },

    usage: {
      momentum: 'Place cheap prophecies early to build Havoc. Once you have 5+, start using Havoc to widen ranges on bigger spells for safer Prophesied outcomes.',
      flourish: 'Narrow ranges (1-2 values) give the strongest Prophesied effects but are hardest to hit. Spend Havoc to widen them by +1 per Havoc spent—turning a risky 3-5 into a safe 2-6.'
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

**Risk vs Reward**: Narrower ranges have more powerful Prophesied effects but higher Backlash risk. Wider ranges are safer but less spectacular.

**The Philosophy**: You spoke doom and doom answered—but not in the way you intended. The fates punish hubris.`
    },

    strategicConsiderations: {
      title: 'Prophecy Range Strategy',
      content: `**Narrow Range (1-2 values)**: High risk, high reward. Prophesied effects are devastating. Best used with Havoc to widen or against targets with low variance.

**Medium Range (3-5 values)**: Balanced approach. Good Prophesied payoff with reasonable risk. Standard play.

**Wide Range (6+ values)**: Safe bet. Prophesied effect is modest but consistent. Good for building Havoc early.

**Spending Havoc on Range Widening**: Each point of Havoc spent widens the range by 1 in each direction (e.g., 3-5 becomes 2-6 for 1 Havoc). This is often the most efficient use of early Havoc.

**Delayed vs Instant**: Delayed prophecies (Doom Countdown) generate Havoc over time and can combine with later prophecies for cascade detonation. Instant prophecies give immediate Havoc for quick ramp-up.

**Specialization Impact**: Requiem (single-target) gets bonus Havoc from single-target Prophesied hits. Endbringer (escalating) gains more Havoc as combat continues. Cataclysm (area) earns Havoc per target hit in area prophecies.`
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
      description: 'All Doomsayers can sense the "doom potential" of a creature—whether a target is particularly susceptible to prophecy (creatures with lower Spirit scores are easier targets). You also gain a bonus to Prophecy Range resolution rolls equal to half your Doomsayer level (rounded down, maximum +5). This bonus helps land inside the range more reliably.'
    },

    specs: [
      {
        id: 'requiem',
        name: 'Requiem',
        icon: 'Necrotic/Necrotic Skull',
        color: '#4B0082',
        theme: 'Single-Target Death Prophecies',

        description: `Requiems are assassins of fate, placing devastating single-target prophecies that can obliterate a single enemy. Their prophecy ranges are narrower but their Prophesied effects are the most lethal in the game. They earn bonus Havoc from single-target Prophesied hits and can stack multiple prophecies on the same target.`,

        playstyle: 'Single-target nuke, precision prophecy, death stacking, high burst damage',

        strengths: [
          'Prophesied effects deal 50% more damage on single-target spells',
          'Bonus Havoc (+2) from single-target Prophesied hits',
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
          description: 'When you roll a Prophesied outcome on a single-target spell, gain +2 bonus Havoc and the spell deals +50% damage. You can have up to 3 active prophecies on the same target—when one detonates, the others tick.'
        },

        keyAbilities: [
          'Death Mark: Place a narrow-range prophecy (d4+d4) that deals 6d10 necrotic on Prophesied (5 Havoc)',
          'Stacked Doom: Detonate all active prophecies on a target simultaneously for combined damage',
          'Requiem: Ultimate—place a prophecy that, if Prophesied, reduces target to 0 HP regardless of remaining health (10 Havoc, once per long rest)'
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
          'Endbringer\'s Finale: After 5+ rounds of combat, spend 8 Havoc to trigger ALL active prophecies simultaneously with maximized Prophesied effects'
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
          'Prophesied effects on area spells apply to ALL targets in the zone'
        ],

        weaknesses: [
          'Prophesied damage per target is lower than Requiem\'s single-target',
          'Friendly fire risk on some area prophecies',
          'Requires enemies to cluster for maximum effect',
          'Less effective against spread-out enemies or single bosses'
        ],

        specPassive: {
          name: 'Cataclysmic Range',
          description: 'All your prophecies are area-based (minimum 15ft radius). You earn +1 Havoc per target caught in the area when Prophesied. You can have up to 3 area prophecies active simultaneously. When two or more of your area prophecies overlap, the overlapping zone deals double damage and grants +1 bonus Havoc per target.'
        },

        keyAbilities: [
          'Rain of Doom: Place a 30ft area prophecy that rains RNG effects each round (roll d6 table: fire/necrotic/psychic/force/stun/heal reversal)',
          'Cataclysm Cascade: When an area prophecy Prophesied, all targets in the zone trigger a secondary prophecy (3 Havoc)',
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
      description: 'Place a prophecy of ruin on a target, marking them for inevitable destruction.',
      spellType: 'ACTION',
      icon: 'Necrotic/Skull Burst',
      school: 'necrotic',
      level: 1,
      specialization: 'universal',
      effectTypes: ['damage'],
      typeConfig: { school: 'necrotic', castTime: '1 action', castTimeType: 'action' },
      targetingConfig: { targetingType: 'single', rangeDistance: 60, targetRestrictions: ['enemies'] },
      resourceCost: { actionPoints: 1, mana: 6, classResource: { type: 'havoc', cost: -3 } },
      resolution: 'PROPHECY',
      mechanicsConfig: [
        {
          enabled: true,
          system: 'PROPHECY',
          prophecy: {
        rangeDice: ['d8', 'd6'],
        resolutionDie: 'd6',
        prophesied: { damage: '4d8', effect: { name: 'Weakened', duration: 2, unit: 'rounds', statModifiers: [{ stat: 'ALL ROLLS', value: -2 }], description: '-2 penalty to all attack rolls, ability checks, and saving throws for 2 rounds.' }, havocGain: 3, description: 'Deals 4d8 necrotic damage and imposes -2 to all rolls for 2 rounds.' },
        base: { damage: '2d8', havocGain: 1, description: 'Deals 2d8 necrotic damage.' },
        outside: { backlash: '1d8 necrotic to self', havocGain: 0, description: 'The prophecy backfires, dealing 1d8 necrotic damage to you.' }
      }
        }
      ],
      damageConfig: {
        formula: '2d8',
        damageTypes: ['necrotic'],
        resolution: 'PROPHECY'
      },
      tags: ['damage', 'necrotic', 'prophecy', 'universal']
    },
    {
      id: 'doomsayer_doom_whisper',
      name: 'Doom Whisper',
      description: 'Whisper inevitable failure into a target\'s mind, manifesting their fears into reality.',
      spellType: 'ACTION',
      icon: 'Psychic/Agonizing Scream',
      school: 'psychic',
      level: 1,
      specialization: 'requiem',
      effectTypes: ['debuff'],
      typeConfig: { school: 'psychic', castTime: '1 action', castTimeType: 'action' },
      targetingConfig: { targetingType: 'single', rangeDistance: 30, targetRestrictions: ['enemies'] },
      resourceCost: { actionPoints: 1, mana: 5, classResource: { type: 'havoc', cost: -2 } },
      resolution: 'PROPHECY',
      mechanicsConfig: [
        {
          enabled: true,
          system: 'PROPHECY',
          prophecy: {
        rangeDice: ['d4', 'd4'],
        resolutionDie: 'd4',
        prophesied: { debuff: '-3 to all rolls', damage: '2d6', duration: 2, havocGain: 2, description: 'Deals 2d6 psychic damage and imposes a -3 penalty to all rolls for 2 rounds.' },
        base: { debuff: '-1 to all rolls', damage: '1d6', duration: 2, havocGain: 1, description: 'Deals 1d6 psychic damage and imposes a -1 penalty to all rolls.' },
        outside: { backlash: '1d4 psychic to self', havocGain: 0, description: 'The whispers echo in your own mind, dealing 1d4 psychic damage.' }
      }
        }
      ],
      debuffConfig: {
        debuffType: 'statPenalty',
        effects: [
          { id: 'whisper_doom', name: 'Whisper of Doom', description: '-1 to -3 to all rolls', mechanicsText: '' }
        ],
        durationType: 'rounds', durationValue: 2, durationUnit: 'rounds'
      },
      tags: ['debuff', 'psychic', 'prophecy', 'requiem']
    },
    {
      id: 'doomsayer_omen_flame',
      name: 'Omen Flame',
      description: 'Hurl a bolt of prophetic fire that burns with the heat of a thousand dying suns.',
      spellType: 'ACTION',
      icon: 'Fire/Fire Bolt',
      school: 'fire',
      level: 1,
      specialization: 'cataclysm',
      effectTypes: ['damage'],
      typeConfig: { school: 'fire', castTime: '1 action', castTimeType: 'action' },
      targetingConfig: { targetingType: 'single', rangeDistance: 40, targetRestrictions: ['enemies'] },
      resourceCost: { actionPoints: 1, mana: 5, classResource: { type: 'havoc', cost: -2 } },
      resolution: 'PROPHECY',
      mechanicsConfig: [
        {
          enabled: true,
          system: 'PROPHECY',
          prophecy: {
            rangeDice: ['d6', 'd6'],
            resolutionDie: 'd6',
            prophesied: { 
              damage: '3d6 fire + 1d6 force', 
              effect: {
                name: 'Ignited',
                duration: 3,
                damagePerRound: '1d6',
                description: 'The target is engulfed in prophetic flames, suffering 1d6 fire damage each round.'
              },
              havocGain: 2, 
              description: 'Deals massive dual damage and ignites the target.' 
            },
            base: { 
              damage: '2d6 fire', 
              havocGain: 1, 
              description: 'Deals 2d6 fire damage.' 
            },
            outside: { 
              backlash: '1d4 fire to self', 
              havocGain: 0, 
              description: 'The flames singe your hands, dealing 1d4 fire damage.' 
            }
          }
        }
      ],
      damageConfig: { formula: '2d6', damageTypes: ['fire'], resolution: 'PROPHECY' },
      tags: ['damage', 'fire', 'prophecy', 'cataclysm']
    },
    {
      id: 'doomsayer_omen_of_ash',
      name: 'Omen of Ash',
      description: 'Place a creeping doom prophecy on a target, causing them to slowly wither into dust.',
      spellType: 'ACTION',
      icon: 'Void/Black Hole',
      school: 'necrotic',
      level: 1,
      specialization: 'endbringer',
      effectTypes: ['damage'],
      typeConfig: { school: 'necrotic', castTime: '1 action', castTimeType: 'action' },
      targetingConfig: { targetingType: 'single', rangeDistance: 30, targetRestrictions: ['enemies'] },
      resourceCost: { actionPoints: 1, mana: 5, classResource: { type: 'havoc', cost: -2 } },
      resolution: 'PROPHECY',
      mechanicsConfig: [
        {
          enabled: true,
          system: 'PROPHECY',
          prophecy: {
            rangeDice: ['d6', 'd4'],
            resolutionDie: 'd4',
            prophesied: { damage: '2d6', effect: { name: 'Creeping Doom', duration: 3, unit: 'rounds', damagePerRound: '1d4', damageType: 'necrotic', statModifiers: [{ stat: 'ALL ROLLS', value: -1 }], description: 'Target withers under necrotic decay, taking 1d4 necrotic damage and suffering -1 to all rolls at the start of each turn for 3 rounds.' }, havocGain: 2, description: 'Deals 2d6 necrotic damage and afflicts the target with Creeping Doom (1d4 necrotic/round + -1 all rolls for 3 rounds).' },
            base: { damage: '1d6', havocGain: 1, description: 'Deals 1d6 necrotic damage.' },
            outside: { backlash: '1d4 psychic to self', havocGain: 0, description: 'The decay touches you, dealing 1d4 psychic damage.' }
          }
        }
      ],
      damageConfig: { formula: '1d6', damageTypes: ['necrotic'], resolution: 'PROPHECY' },
      tags: ['damage', 'necrotic', 'prophecy', 'endbringer', 'delayed', 'escalating']
    },

    // ===== LEVEL 2 SPELLS =====
    {
      id: 'doomsayer_doom_countdown',
      name: 'Doom Countdown',
      description: 'Place a ticking time bomb prophecy on a target.',
      spellType: 'ACTION',
      icon: 'Necrotic/Skull Explosion',
      school: 'necrotic',
      level: 2,
      specialization: 'endbringer',
      effectTypes: ['damage'],
      typeConfig: { school: 'necrotic', castTime: '1 action', castTimeType: 'action' },
      targetingConfig: { targetingType: 'single', rangeDistance: 40, targetRestrictions: ['enemies'] },
      resourceCost: { actionPoints: 2, mana: 8, classResource: { type: 'havoc', cost: -3 } },
      durationConfig: { durationValue: 3, durationUnit: 'rounds', concentrationRequired: true },
      resolution: 'PROPHECY',
      mechanicsConfig: [
        {
          enabled: true,
          system: 'PROPHECY',
          prophecy: {
        rangeDice: ['d6', 'd4'],
        resolutionDie: 'd4',
        tickDamage: '1d6 necrotic',
            prophesied: { 
              damage: '4d8', 
              effect: { name: 'Stunned', duration: 1, unit: 'round', saveDC: 14, saveType: 'Constitution', description: 'The detonation concusses the target. They must succeed on a DC 14 Constitution save or be stunned for 1 round, unable to act.' }, 
              havocGain: 3,
              description: 'Detonates for 4d8 necrotic damage. Target must make DC 14 Con save or be stunned for 1 round.'
            },
        base: { damage: '2d8', havocGain: 1, description: 'Detonates for 2d8 necrotic damage.' },
        outside: { backlash: '1d8 to self', havocGain: 0, description: 'The countdown backfires, dealing 1d8 necrotic damage to you.' }
      }
        }
      ],
      damageConfig: { formula: '1d6', damageTypes: ['necrotic'], resolution: 'PROPHECY' },
      tags: ['damage', 'necrotic', 'prophecy', 'endbringer', 'delayed', 'concentration']
    },
    {
      id: 'doomsayer_calamity_zone',
      name: 'Calamity Zone',
      description: 'Create a zone of RNG effects centered on a point.',
      spellType: 'ACTION',
      icon: 'Fire/Fire Storm',
      school: 'fire',
      level: 2,
      specialization: 'cataclysm',
      effectTypes: ['damage'],
      typeConfig: { school: 'fire', castTime: '1 action', castTimeType: 'action' },
      targetingConfig: { targetingType: 'area', areaShape: 'circle', areaSize: 15, rangeDistance: 40 },
      resourceCost: { actionPoints: 2, mana: 10, classResource: { type: 'havoc', cost: -4 } },
      resolution: 'PROPHECY',
      mechanicsConfig: [
        {
          enabled: true,
          system: 'PROPHECY',
          prophecy: {
            rangeDice: ['d10', 'd8'],
            resolutionDie: 'd8',
            prophesied: { damage: '3d8 fire + 1d8 force', effect: { name: 'Burning Ground', duration: 3, unit: 'rounds', damagePerRound: '1d4', damageType: 'fire', description: 'The 15ft zone becomes burning difficult terrain for 3 rounds. Enemies entering or starting their turn in the zone take 1d4 fire damage and move at half speed.' }, havocGain: 4, description: 'Deals 3d8 fire + 1d8 force damage to all in area. Zone becomes burning difficult terrain (1d4 fire/round, half speed) for 3 rounds.' },
            base: { damage: '2d8 fire', havocGain: 2, description: 'Deals 2d8 fire damage to all in area.' },
            outside: { backlash: '1d6 fire to self', havocGain: 0, description: 'The ground erupts beneath you, dealing 1d6 fire damage.' }
          }
        }
      ],
      damageConfig: { formula: '2d8', damageTypes: ['fire'], resolution: 'PROPHECY' },
      tags: ['damage', 'fire', 'prophecy', 'cataclysm', 'area']
    },
    {
      id: 'doomsayer_death_mark',
      name: 'Death Mark',
      description: 'Mark a target with a narrow but deadly prophecy.',
      spellType: 'ACTION',
      icon: 'Necrotic/Death Mark',
      school: 'necrotic',
      level: 2,
      specialization: 'requiem',
      effectTypes: ['damage'],
      typeConfig: { school: 'necrotic', castTime: '1 action', castTimeType: 'action' },
      targetingConfig: { targetingType: 'single', rangeDistance: 30, targetRestrictions: ['enemies'] },
      resourceCost: { actionPoints: 2, mana: 10, classResource: { type: 'havoc', cost: 1 } }, // Cost is 1 havoc
      resolution: 'PROPHECY',
      mechanicsConfig: [
        {
          enabled: true,
          system: 'PROPHECY',
          prophecy: {
            rangeDice: ['d4', 'd4'],
            resolutionDie: 'd4',
            prophesied: { 
              damage: '6d8', 
              effect: {
                name: 'Marked for Death',
                duration: 5,
                unit: 'rounds',
                healingBlock: true,
                bonusDamageTaken: '1d8',
                bonusDamageType: 'necrotic',
                description: 'The target is branded with inevitable death. They cannot be healed by any means (spells, potions, features) and take +1d8 necrotic damage from every source that hits them for 5 rounds.'
              },
              havocGain: 0,
              description: 'Deals 6d8 necrotic damage and brands the target for 5 rounds: no healing + +1d8 necrotic from all incoming damage.'
            },
            base: { 
              damage: '3d8', 
              havocGain: 0,
              description: 'Deals 3d8 necrotic damage. No mark applied.'
            },
            outside: { 
              backlash: '2d8 to self', 
              havocGain: 0,
              description: 'The death mark rebounds, dealing 2d8 necrotic damage to you.'
            }
          }
        }
      ],
      damageConfig: { formula: '3d8', damageTypes: ['necrotic'], resolution: 'PROPHECY' },
      tags: ['damage', 'necrotic', 'prophecy', 'requiem', 'precision']
    },

    // ===== LEVEL 3 SPELLS =====
    {
      id: 'doomsayer_havoc_blast',
      name: 'Havoc Blast',
      description: 'Unleash stored Havoc as a devastating blast of chaotic energy that ripples through fate.',
      spellType: 'ACTION',
      icon: 'Arcane/Swirling Vortex',
      school: 'evocation',
      level: 3,
      specialization: 'universal',
      effectTypes: ['damage'],
      typeConfig: { school: 'evocation', castTime: '1 action', castTimeType: 'action' },
      targetingConfig: { targetingType: 'single', rangeDistance: 50, targetRestrictions: ['enemies'] },
      resourceCost: { 
        actionPoints: 2, 
        mana: 14, 
        classResource: { type: 'havoc', cost: 3 } 
      },
      resolution: 'PROPHECY',
      mechanicsConfig: [
        {
          enabled: true,
          system: 'PROPHECY',
          prophecy: {
            rangeDice: ['d10', 'd10'],
            resolutionDie: 'd10',
            prophesied: { damage: '5d10', havocGain: 0, description: 'Deals 5d10 force damage.' },
            base: { damage: '3d10', havocGain: 0, description: 'Deals 3d10 force damage.' },
            outside: { backlash: '2d10 to self', havocGain: 0, description: 'Deals 2d10 damage to you.' }
          }
        }
      ],
      damageConfig: { formula: '3d10', damageTypes: ['force'], resolution: 'PROPHECY' },
      tags: ['damage', 'force', 'prophecy', 'universal', 'havoc']
    },
    {
      id: 'doomsayer_calamity_bolt',
      name: 'Calamity Bolt',
      description: 'A bolt of chaotic energy that deals more damage if your prediction is accurate.',
      spellType: 'ACTION',
      icon: 'Chaos/Chaotic Bolt',
      school: 'evocation',
      level: 3,
      specialization: 'cataclysm',
      effectTypes: ['damage'],
      typeConfig: { school: 'evocation', castTime: '1 action', castTimeType: 'action' },
      targetingConfig: { targetingType: 'single', rangeDistance: 60, targetRestrictions: ['enemies'] },
      resourceCost: { actionPoints: 2, mana: 10, classResource: { type: 'havoc', cost: 2 } },
      resolution: 'PROPHECY',
      mechanicsConfig: [
        {
          enabled: true,
          system: 'PROPHECY',
          prophecy: {
            rangeDice: ['d8', 'd6'],
            resolutionDie: 'd6',
            prophesied: { 
              damage: '6d8', 
              effect: {
                name: 'Weakened',
                duration: 2,
                unit: 'rounds',
                statModifiers: [
                  { stat: 'STR', value: -4 },
                  { stat: 'AGI', value: -4 }
                ],
                description: 'Target is crushed by prophetic weight. -4 to Strength and Agility for 2 rounds, affecting melee/ranged attacks, damage, and physical checks.'
              },
              havocGain: 4, 
              description: 'Deals 6d8 chaotic damage and weakens the target.' 
            },
            base: { 
              damage: '4d8', 
              havocGain: 2, 
              description: 'Deals 4d8 chaotic damage.' 
            },
            outside: { 
              backlash: '2d8 chaotic to self', 
              havocGain: 0, 
              description: 'The blast backfires, dealing 2d8 damage to you.' 
            }
          }
        }
      ],
      damageConfig: {
        formula: '4d8',
        damageTypes: ['chaotic'],
        resolution: 'PROPHECY'
      },
      tags: ['damage', 'chaotic', 'prophecy', 'universal', 'havoc']
    },
    {
      id: 'doomsayer_escalating_doom',
      name: 'Escalating Doom',
      description: 'Place a prophecy that grows more devastating each round it remains active. Each turn the doom lingers, it deals pulsing force damage and accumulates power, culminating in a violent detonation.',
      spellType: 'ACTION',
      icon: 'Void/Black Hole',
      school: 'force',
      level: 3,
      specialization: 'endbringer',
      effectTypes: ['damage'],
      typeConfig: { school: 'force', castTime: '1 action', castTimeType: 'action' },
      targetingConfig: { targetingType: 'single', rangeDistance: 40, targetRestrictions: ['enemies'] },
      damageConfig: {
        formula: '1d8',
        damageTypes: ['force'],
        resolution: 'PROPHECY'
      },
      resourceCost: { actionPoints: 2, mana: 12, classResource: { type: 'havoc', cost: -2 } },
      durationConfig: { durationValue: 5, durationUnit: 'rounds', concentrationRequired: true },
      resolution: 'PROPHECY',
      mechanicsConfig: [
        {
          enabled: true,
          system: 'PROPHECY',
          prophecy: {
            rangeDice: ['d8', 'd6'],
            resolutionDie: 'd6',
            tickDamage: { formula: '1d8', scaling: '+1d6 per round', damageTypes: ['force'] },
            prophesied: { 
              damage: '4d10', 
              effect: { name: 'Devastating Detonation', duration: 2, unit: 'rounds', damagePerRound: '2d6', damageType: 'force', statModifiers: [{ stat: 'ALL ROLLS', value: -2 }], description: 'The detonation unleashes accumulated force energy. Target takes 2d6 force damage and suffers -2 to all rolls for 2 rounds after detonation. Also roll on the Detonation Table.' }, 
              havocGain: 5, 
              description: 'Deals 4d10 force damage plus all accumulated bonus damage on detonation. Target takes 2d6 force/round and -2 all rolls for 2 rounds. Roll on Detonation Table.' 
            },
            base: { 
              damage: '2d10', 
              havocGain: 2, 
              description: 'Deals 2d10 force damage plus all accumulated bonus damage on detonation.' 
            },
            outside: { 
              backlash: '1d10 self', 
              havocGain: 0, 
              description: 'The doom collapses prematurely. You take 1d10 force damage and the target is spared the detonation.' 
            }
          }
        }
      ],
      tableConfig: {
        name: 'Detonation Table',
        rolls: [
          { roll: '1-2', effect: 'Shockwave: All targets knocked back 10ft' },
          { roll: '3-4', effect: 'Lingering Void: Target takes 1d10 force damage per round for 2 rounds' },
          { roll: '5', effect: 'Fate Breach: Target takes a -2 penalty to their next save' },
          { roll: '6', effect: 'Cascading Blast: The detonation deals an additional +2d10 force damage' }
        ]
      },
      triggerConfig: {
        triggers: [
          { 
            id: 'escalation_tick', 
            name: 'Doom Escalation', 
            triggerType: 'start_of_turn', 
            action: 'Increase bonus damage by 1d6 and deal 1d8 base force damage' 
          }
        ]
      },
      tags: ['damage', 'force', 'prophecy', 'endbringer', 'delayed', 'escalating', 'concentration']
    },
    {
      id: 'doomsayer_rain_of_doom',
      name: 'Rain of Doom',
      description: 'Create a 30ft zone where prophetic effects rain down each round based on the whims of fate.',
      spellType: 'ACTION',
      icon: 'Chaos/Comet Rain',
      school: 'evocation',
      level: 3,
      specialization: 'cataclysm',
      effectTypes: ['damage', 'area'],
      typeConfig: { school: 'evocation', castTime: '1 action', castTimeType: 'action' },
      targetingConfig: { targetingType: 'area', areaShape: 'circle', areaSize: 30, rangeDistance: 50 },
      resourceCost: { 
        actionPoints: 2, 
        mana: 16, 
        classResource: { type: 'havoc', cost: 3 } 
      },
      durationConfig: { durationValue: 3, durationUnit: 'rounds', concentrationRequired: true },
      resolution: 'PROPHECY',
      mechanicsConfig: [
        {
          enabled: true,
          system: 'PROPHECY',
          prophecy: {
            rangeDice: ['d6', 'd6'],
            resolutionDie: 'd6',
            prophesied: { effect: { name: 'Double Rain', description: 'Roll twice on the Rain Table and apply both results to all enemies in the 30ft zone.' }, description: 'Roll twice on the Rain Table. Each result applies to ALL enemies in the zone.' },
            base: { effect: { name: 'Single Rain', description: 'Roll once on the Rain Table and apply the result to all enemies in the 30ft zone.' }, description: 'Roll once on the Rain Table. Result applies to all enemies in the zone.' },
            outside: { backlash: { name: 'Self Rain', description: 'The rain falls on YOU instead. Roll once on the Rain Table and apply the result to yourself.' }, description: 'The rain falls on you instead. Roll on the Rain Table against yourself.' }
          }
        }
      ],
      tableConfig: {
        name: 'Rain Table',
        rolls: [
          { roll: '1', effect: '2d6 fire damage to all' },
          { roll: '2', effect: '2d6 necrotic damage to all' },
          { roll: '3', effect: '2d6 psychic damage to all' },
          { roll: '4', effect: '1d6 force damage + knocked prone' },
          { roll: '5', effect: 'Stunned for 1 round (CON DC 15 negates)' },
          { roll: '6', effect: 'Roll twice' }
        ]
      },
      tags: ['damage', 'prophecy', 'cataclysm', 'area', 'table', 'concentration']
    },
    {
      id: 'doomsayer_requiem_of_death',
      name: 'Requiem of Death',
      description: 'A focused death prophecy that deals devastating single-target damage through a narrow but absolute window of fate.',
      spellType: 'ACTION',
      icon: 'Necrotic/Necrotic Skull',
      school: 'necromancy',
      level: 4,
      specialization: 'requiem',
      effectTypes: ['damage'],
      typeConfig: { school: 'necromancy', castTime: '1 action', castTimeType: 'action' },
      targetingConfig: { targetingType: 'single', rangeDistance: 40, targetRestrictions: ['enemies'] },
      resourceCost: { actionPoints: 2, mana: 20, classResource: { type: 'havoc', cost: 4 } },
      resolution: 'PROPHECY',
      mechanicsConfig: [
        {
          enabled: true,
          system: 'PROPHECY',
          prophecy: {
            rangeDice: ['d6', 'd4'],
            resolutionDie: 'd4',
            prophesied: { 
              damage: '8d10', 
              effect: {
                name: 'Soul Wound',
                duration: 5,
                unit: 'rounds',
                damagePerRound: '1d6',
                damageType: 'necrotic',
                healingBlock: true,
                description: 'Spiritual wounds refuse to close. Target cannot be healed by any means and bleeds for 1d6 necrotic damage at the start of each turn for 5 rounds.'
              },
              havocGain: 6, 
              description: 'Deals 8d10 necrotic damage and inflicts Soul Wound: no healing + 1d6 necrotic/round for 5 rounds.' 
            },
            base: { 
              damage: '5d10', 
              havocGain: 3, 
              description: 'Deals 5d10 necrotic damage.' 
            },
            outside: { 
              backlash: '3d10 necrotic to self', 
              havocGain: 0, 
              description: 'Deals 3d10 necrotic damage to you.' 
            }
          }
        }
      ],
      damageConfig: { formula: '5d10', damageTypes: ['necrotic'], resolution: 'PROPHECY' },
      tags: ['damage', 'necrotic', 'prophecy', 'requiem']
    },
    {
      id: 'doomsayer_doom_aura',
      name: 'Doom Aura',
      description: 'Project an aura of escalating doom that weakens nearby enemies and generates Havoc passively as their resolve withers.',
      spellType: 'ACTION',
      icon: 'Necrotic/Necrotic Wither',
      school: 'enchantment',
      level: 4,
      specialization: 'endbringer',
      effectTypes: ['debuff', 'aura'],
      typeConfig: { school: 'enchantment', castTime: '1 action', castTimeType: 'immediate' },
      targetingConfig: { targetingType: 'self_centered', areaShape: 'circle', areaSize: 20 },
      resourceCost: { actionPoints: 2, mana: 18, classResource: { type: 'havoc', cost: 3 } },
      durationConfig: { durationValue: 5, durationUnit: 'rounds', concentrationRequired: true },
      statusEffectsConfig: [
        {
          name: 'Doom Aura',
          duration: 5,
          unit: 'rounds',
          statModifiers: [
            { stat: 'ALL ROLLS', value: -2 }
          ],
          description: 'Nearby enemies feel the crushing weight of their coming end. The penalty increases by -1 each round (max -5).'
        }
      ],
      resolution: 'AUTOMATIC',
      triggerConfig: {
        triggers: [
          { id: 'aura_debuff', name: 'Doom Presence', triggerType: 'passive_aura', action: 'Enemies take -2 to all rolls, increasing by -1 per round (max -5)' },
          { id: 'aura_havoc', name: 'Havoc Siphon', triggerType: 'end_of_turn', action: 'Gain 1 Havoc per enemy within the aura' }
        ]
      },
      tags: ['debuff', 'aura', 'endbringer', 'prophecy', 'concentration']
    },
    {
      id: 'doomsayer_cataclysm_blast',
      name: 'Cataclysm Blast',
      description: 'A massive area prophecy detonation that creates a chaotic rupture in space.',
      spellType: 'ACTION',
      icon: 'Fire/Volcanic Erupt',
      school: 'evocation',
      level: 4,
      specialization: 'cataclysm',
      effectTypes: ['damage', 'area'],
      typeConfig: { school: 'evocation', castTime: '1 action', castTimeType: 'action' },
      targetingConfig: { targetingType: 'area', areaShape: 'circle', areaSize: 25, rangeDistance: 50 },
      resourceCost: { actionPoints: 2, mana: 20, classResource: { type: 'havoc', cost: 4 } },
      resolution: 'PROPHECY',
      mechanicsConfig: [
        {
          enabled: true,
          system: 'PROPHECY',
          prophecy: {
        rangeDice: ['d10', 'd8'],
        resolutionDie: 'd8',
        prophesied: { 
          damage: '6d8 fire + 3d8 necrotic', 
          effect: { name: 'Difficult Terrain', duration: 5, unit: 'rounds', description: 'The area becomes difficult terrain.' }, 
          havocGain: 6, 
          description: 'Deals massive dual-type damage and turns the area into difficult terrain for 5 rounds.' 
        },
        base: { damage: '4d8 fire + 2d8 necrotic', havocGain: 3, description: 'Deals fire and necrotic damage to all in area.' },
        outside: { backlash: '2d8 to self', havocGain: 0, description: 'Deals 2d8 damage to you.' }
      }
        }
      ],
      damageConfig: { formula: '4d8+2d8', damageTypes: ['fire', 'necrotic'], resolution: 'PROPHECY' },
      tags: ['damage', 'fire', 'necrotic', 'prophecy', 'cataclysm', 'area']
    },
    // LEVEL 5
    {
      id: 'doomsayer_prophecy_of_ruin',
      name: 'Prophecy of Ruin',
      description: 'A devastating prophecy that shatters an area with concentrated RNG chaos, twisting reality itself.',
      spellType: 'ACTION',
      icon: 'Void/Red Energy Burst',
      school: 'evocation',
      level: 5,
      specialization: 'universal',
      effectTypes: ['damage', 'area'],
      typeConfig: { school: 'evocation', castTime: '1 action', castTimeType: 'action' },
      targetingConfig: { targetingType: 'area', areaShape: 'circle', areaSize: 20, rangeDistance: 60 },
      resourceCost: { actionPoints: 2, mana: 25, classResource: { type: 'havoc', cost: 5 } },
      resolution: 'PROPHECY',
      mechanicsConfig: [
        {
          enabled: true,
          system: 'PROPHECY',
          prophecy: {
        rangeDice: ['d12', 'd8'],
        resolutionDie: 'd8',
        prophesied: { 
          damage: '8d8', 
          effect: { name: 'Stunned', duration: 1, unit: 'round', saveDC: 16, saveType: 'Constitution' }, 
          havocGain: 8, 
          description: 'Deals 8d8 mixed damage and stuns all enemies in the area for 1 round.' 
        },
        base: { damage: '5d8', havocGain: 4, description: 'Deals 5d8 mixed damage to all in area.' },
        outside: { 
          backlash: '3d8 to self + Stunned (1 round)', 
          havocGain: 0, 
          description: 'Deals 3d8 damage to you and stuns you for 1 round.' 
        }
      }
        }
      ],
      damageConfig: { formula: '5d8', damageTypes: ['fire', 'necrotic', 'psychic', 'force'], resolution: 'PROPHECY' },
      tags: ['damage', 'prophecy', 'universal', 'area']
    },
    {
      id: 'doomsayer_stacked_doom',
      name: 'Stacked Doom',
      description: 'Forcefully detonate all active prophecies on a single target simultaneously, creating a cascade of inevitable ruin.',
      spellType: 'ACTION',
      icon: 'Necrotic/Skull Burst',
      school: 'necromancy',
      level: 5,
      specialization: 'requiem',
      effectTypes: ['damage', 'special'],
      typeConfig: { school: 'necromancy', castTime: '1 action', castTimeType: 'action' },
      targetingConfig: { targetingType: 'single', rangeDistance: 30, targetRestrictions: ['enemies'] },
      resourceCost: { actionPoints: 3, mana: 24, classResource: { type: 'havoc', cost: 6 } },
      resolution: 'AUTOMATIC',
      triggerConfig: {
        triggers: [
          { 
            id: 'mass_detonation', 
            name: 'Chain Detonation', 
            triggerType: 'on_cast', 
            action: 'All active prophecies on the target resolve as Prophesied. If 3+ prophecies are detonated, the target is paralyzed for 1 round.' 
          }
        ]
      },
      tags: ['damage', 'prophecy', 'requiem', 'detonate']
    },
    {
      id: 'doomsayer_doom_nova',
      name: 'Doom Nova',
      description: 'Create an expanding wave of prophetic doom that damages all enemies in a massive area.',
      spellType: 'ACTION',
      icon: 'Fire/Fire Storm',
      school: 'evocation',
      level: 5,
      specialization: 'cataclysm',
      effectTypes: ['damage', 'area'],
      typeConfig: { school: 'evocation', castTime: '1 action', castTimeType: 'action' },
      targetingConfig: { targetingType: 'area', areaShape: 'circle', areaSize: 40, rangeDistance: 60 },
      resourceCost: { actionPoints: 3, mana: 26, classResource: { type: 'havoc', cost: 6 } },
      resolution: 'PROPHECY',
      mechanicsConfig: [
        {
          enabled: true,
          system: 'PROPHECY',
          prophecy: {
        rangeDice: ['d12', 'd10'],
        resolutionDie: 'd10',
        prophesied: { 
          damage: '6d8 fire + 6d8 necrotic', 
          effect: { name: 'Ignited', duration: 3, unit: 'rounds', dotFormula: '2d6', dotDamageType: 'fire' }, 
          havocGain: 8, 
          description: 'Deals massive dual damage and ignites all enemies in range for 2d6 fire damage per round.' 
        },
        base: { damage: '4d8 fire + 4d8 necrotic', havocGain: 4, description: 'Deals moderate dual damage to all enemies.' },
        outside: { backlash: '2d8 fire + 2d8 necrotic to self', havocGain: 0, description: 'Deals dual damage to you.' }
      }
        }
      ],
      damageConfig: { formula: '4d8+4d8', damageTypes: ['fire', 'necrotic'], resolution: 'PROPHECY' },
      tags: ['damage', 'fire', 'necrotic', 'prophecy', 'cataclysm', 'area']
    },
    // LEVEL 6
    { 
      id: 'doomsayer_cascade_doom', 
      name: 'Cascade Doom', 
      description: 'When a prophecy Prophesied, all targets in the zone trigger a secondary, cascading prophecy.', 
      spellType: 'ACTION', 
      icon: 'Fire/Fiery Arc', 
      school: 'evocation', 
      level: 6, 
      specialization: 'cataclysm', 
      effectTypes: ['damage', 'area', 'special'],
      typeConfig: { school: 'evocation', castTime: '1 action', castTimeType: 'action' }, 
      targetingConfig: { targetingType: 'area', areaShape: 'circle', areaSize: 25, rangeDistance: 50 }, 
      resourceCost: { actionPoints: 2, mana: 30, classResource: { type: 'havoc', cost: 7 } }, 
      resolution: 'PROPHECY', 
      mechanicsConfig: [
        {
          enabled: true,
          system: 'PROPHECY',
          prophecy: {
        rangeDice: ['d10', 'd8'],
        resolutionDie: 'd8',
        prophesied: { damage: '8d8', effect: { name: 'Cascade', cascadeDamage: '4d8', cascadeRange: 15, description: 'Primary targets take 8d8 fire damage. Each primary target triggers a secondary prophecy dealing 4d8 fire damage to all enemies within 15ft of them.' }, havocGain: 8, description: 'Deals 8d8 fire damage. Each hit target cascades 4d8 fire damage to enemies within 15ft.' },
        base: { damage: '5d8', havocGain: 4, description: 'Deals 5d8 fire damage. No cascade.' },
        outside: { backlash: '3d8 to self', havocGain: 0, description: 'The cascade implodes, dealing 3d8 fire damage to you.' }
      }
        }
      ],
      damageConfig: { formula: '5d8', damageTypes: ['fire'], resolution: 'PROPHECY' }, 
      tags: ['damage', 'prophecy', 'cataclysm', 'area', 'cascade'] 
    },
    { 
      id: 'doomsayer_endbringer_finale', 
      name: 'Endbringer\'s Finale', 
      description: 'The final bell tolls. Detonate all active prophecies with maximized effects after the battle has ripened.', 
      spellType: 'ACTION', 
      icon: 'Void/Falling Meteors', 
      school: 'evocation', 
      level: 6, 
      specialization: 'endbringer', 
      effectTypes: ['damage', 'ultimate'],
      typeConfig: { school: 'evocation', castTime: '1 action', castTimeType: 'action' }, 
      targetingConfig: { targetingType: 'area', areaShape: 'circle', areaSize: 60, rangeDistance: 60 }, 
      resourceCost: { actionPoints: 3, mana: 32, classResource: { type: 'havoc', cost: 8 } }, 
      damageConfig: { formula: '10d10', damageTypes: ['necrotic', 'fire'], resolution: 'AUTOMATIC' },
      resolution: 'AUTOMATIC', 
      triggerConfig: {
        triggers: [
          { 
            id: 'ultimate_detonation', 
            name: 'The Finale', 
            triggerType: 'on_cast', 
            action: 'Can only be cast after 5 rounds. All active prophecies resolve as Prophesied automatically and generate double Havoc.' 
          }
        ]
      },
      cooldownConfig: { type: 'long_rest', value: 1 }, 
      tags: ['ultimate', 'prophecy', 'endbringer', 'detonate'] 
    },
    { 
      id: 'doomsayer_execution_prophecy', 
      name: 'Execution Prophecy', 
      description: 'Place a lethal prophecy on a target. If fate decrees it, their existence is simply erased.', 
      spellType: 'ACTION', 
      icon: 'Necrotic/Necrotic Skull', 
      school: 'necromancy', 
      level: 6, 
      specialization: 'requiem', 
      effectTypes: ['damage', 'death'],
      typeConfig: { school: 'necromancy', castTime: '1 action', castTimeType: 'action' }, 
      targetingConfig: { targetingType: 'single', rangeDistance: 30, targetRestrictions: ['enemies'] }, 
      resourceCost: { actionPoints: 3, mana: 30, classResource: { type: 'havoc', cost: 8 } }, 
      resolution: 'PROPHECY', 
      mechanicsConfig: [
        {
          enabled: true,
          system: 'PROPHECY',
          prophecy: {
        rangeDice: ['d4', 'd4'],
        resolutionDie: 'd4',
        prophesied: { effect: { name: 'Instant Death', instantKill: true, description: 'Target is reduced to 0 HP regardless of their current health. No save. No immunity.' }, description: 'Target is reduced to 0 HP. No save. No immunity.' },
        base: { damage: '8d10', effect: { name: 'Execution Save', saveDC: 18, saveType: 'Constitution', instantKillThreshold: 0.5, description: 'Target must make a Constitution save (DC 18). On failure, if the target is below 50% HP, they are reduced to 0 HP. On success or above 50% HP, they take 8d10 necrotic damage instead.' }, description: 'Target makes Constitution save (DC 18). Fail + below 50% HP = instant death. Otherwise 8d10 necrotic damage.' },
        outside: { backlash: '8d10 to self', description: 'The death sentence rebounds. You take 8d10 necrotic damage.' }
      }
        }
      ],
      savingThrow: { ability: 'spirit', difficultyClass: 'SPELL_DC', saveOutcome: '8d10_damage' },
      cooldownConfig: { type: 'long_rest', value: 1 }, 
      tags: ['ultimate', 'death', 'prophecy', 'requiem'] 
    },
    // LEVEL 7
    { 
      id: 'doomsayer_armageddon_herald', 
      name: 'Armageddon Herald', 
      description: 'Become a living conduit of the apocalypse, gaining powerful passive effects that twist fate in your presence.', 
      spellType: 'ACTION', 
      icon: 'Void/Demonic Possesion', 
      school: 'transmutation', 
      level: 7, 
      specialization: 'endbringer', 
      effectTypes: ['buff', 'ultimate'],
      typeConfig: { school: 'transmutation', castTime: '1 action', castTimeType: 'action' }, 
      targetingConfig: { targetingType: 'self' }, 
      resourceCost: { actionPoints: 3, mana: 35, classResource: { type: 'havoc', cost: 8 } }, 
      durationConfig: { durationValue: 1, durationUnit: 'minutes', concentrationRequired: true }, 
      resolution: 'AUTOMATIC', 
      buffConfig: {
        buffType: 'transformation',
        effects: [
          { id: 'doom_form', name: 'Herald Form', description: '+2 to all Prophecy Range resolution rolls, double Havoc generation, and 30ft Doom Aura (-3 penalty).' }
        ],
        statModifiers: [
          { stat: 'Prophecy Resolution', value: 2 }
        ],
        customEffects: [
          { id: 'doom_aura_passive', name: 'Doom Aura', description: 'Enemies within 30ft take -3 to all rolls. Gain double Havoc from fulfilled prophecies.' }
        ]
      },
      cooldownConfig: { type: 'long_rest', value: 1 }, 
      tags: ['ultimate', 'transformation', 'endbringer', 'prophecy'] 
    },
    { 
      id: 'doomsayer_apocalypse_zone', 
      name: 'Apocalypse Zone', 
      description: 'Create a 40ft zone where fate itself is subject to your prophecy range for 3 rounds.', 
      spellType: 'ACTION', 
      icon: 'Fire/Volcanic Erupt', 
      school: 'transmutation', 
      level: 7, 
      specialization: 'cataclysm', 
      effectTypes: ['damage', 'area', 'zone'],
      typeConfig: { school: 'transmutation', castTime: '1 action', castTimeType: 'action' }, 
      targetingConfig: { targetingType: 'area', areaShape: 'circle', areaSize: 40, rangeDistance: 60 }, 
      resourceCost: { actionPoints: 3, mana: 38, classResource: { type: 'havoc', cost: 10 } }, 
      durationConfig: { durationValue: 3, durationUnit: 'rounds', concentrationRequired: true }, 
      resolution: 'AUTOMATIC', 
      triggerConfig: {
        triggers: [
          { id: 'zone_fate', name: 'Fate Manipulation', triggerType: 'passive_aura', action: 'All d20 rolls in zone use your prophecy range. Even = bonus, Odd = penalty.' },
          { id: 'zone_damage', name: 'Armageddon Pulse', triggerType: 'start_of_turn', action: 'All enemies in zone take 3d8 fire + 3d8 necrotic damage.' }
        ]
      },
      cooldownConfig: { type: 'long_rest', value: 1 }, 
      tags: ['ultimate', 'prophecy', 'cataclysm', 'area', 'zone'] 
    },
    { 
      id: 'doomsayer_prophecy_of_annihilation', 
      name: 'Prophecy of Annihilation', 
      description: 'The ultimate single-target prophecy. If Prophesied, the target is annihilated across all timelines.', 
      spellType: 'ACTION', 
      icon: 'Necrotic/Grim Reaper Casting', 
      school: 'necromancy', 
      level: 7, 
      specialization: 'requiem', 
      effectTypes: ['damage', 'ultimate'],
      typeConfig: { school: 'necromancy', castTime: '1 action', castTimeType: 'action' }, 
      targetingConfig: { targetingType: 'single', rangeDistance: 30, targetRestrictions: ['enemies'] }, 
      resourceCost: { actionPoints: 3, mana: 38, classResource: { type: 'havoc', cost: 10 } }, 
      resolution: 'PROPHECY', 
      mechanicsConfig: [
        {
          enabled: true,
          system: 'PROPHECY',
          prophecy: {
        rangeDice: ['d4', 'd4'],
        resolutionDie: 'd4',
        prophesied: { damage: '12d12', effect: { name: 'Annihilation', instantKillThreshold: 0.25, description: 'Deals 12d12 necrotic damage. If the target is below 25% HP after damage, they are erased from existence — reduced to 0 HP and cannot be resurrected for 24 hours.' }, havocGain: 10, description: 'Deals 12d12 necrotic. If target drops below 25% HP, they are erased from existence.' },
        base: { damage: '8d12', havocGain: 5, description: 'Deals 8d12 necrotic damage.' },
        outside: { backlash: '6d12 to self', effect: { name: 'Stunned', duration: 1, unit: 'round', description: 'The annihilation energy rebounds into you. Stunned for 1 round.' }, description: 'Deals 6d12 necrotic damage to you and stuns you for 1 round.' }
      }
        }
      ],
      damageConfig: { formula: '8d12', damageTypes: ['necrotic'], resolution: 'PROPHECY' }, 
      cooldownConfig: { type: 'long_rest', value: 1 }, 
      tags: ['ultimate', 'damage', 'prophecy', 'requiem'] 
    },
    // LEVEL 8
    { 
      id: 'doomsayer_twist_of_doom', 
      name: 'Twist of Doom', 
      description: 'Reaction: Reroll a prophecy range resolution and force the new result through sheer force of will.', 
      spellType: 'REACTION', 
      icon: 'Arcane/Magical Staff', 
      school: 'divination', 
      level: 8, 
      specialization: 'universal', 
      effectTypes: ['special'],
      typeConfig: { school: 'divination', castTime: '1 reaction', castTimeType: 'reaction' }, 
      targetingConfig: { targetingType: 'single', rangeDistance: 60 }, 
      resourceCost: { actionPoints: 0, mana: 15, classResource: { type: 'havoc', cost: 5 } }, 
      resolution: 'AUTOMATIC', 
      triggerConfig: {
        triggers: [
          { 
            id: 'fate_twist', 
            name: 'Twist Fate', 
            triggerType: 'reaction', 
            action: 'Reroll any prophecy range resolution die. Must accept new result. If new result is Prophesied, gain +3 bonus Havoc.' 
          }
        ]
      },
      cooldownConfig: { type: 'long_rest', value: 1 }, 
      tags: ['reaction', 'prophecy', 'universal', 'reroll'] 
    },
    { 
      id: 'doomsayer_doom_legion', 
      name: 'Doom Legion', 
      description: 'Place a prophecy on every enemy you can see. All detonate simultaneously in a chorus of ruin.', 
      spellType: 'ACTION', 
      icon: 'Chaos/Chaotic Rupture', 
      school: 'necromancy', 
      level: 8, 
      specialization: 'cataclysm', 
      effectTypes: ['damage', 'area', 'multi'],
      typeConfig: { school: 'necromancy', castTime: '1 action', castTimeType: 'action' }, 
      targetingConfig: { targetingType: 'multi', rangeDistance: 60, targetRestrictions: ['enemies'] }, 
      resourceCost: { actionPoints: 3, mana: 40, classResource: { type: 'havoc', cost: 10 } }, 
      resolution: 'PROPHECY', 
      mechanicsConfig: [
        {
          enabled: true,
          system: 'PROPHECY',
          prophecy: {
        rangeDice: ['d8', 'd6'],
        resolutionDie: 'd6',
        prophesied: { damage: '8d8', effect: { name: 'Mass Ignition', duration: 3, unit: 'rounds', damagePerRound: '2d6', damageType: 'fire', description: 'Each enemy hit is engulfed in prophetic flames, burning for 2d6 fire damage per round for 3 rounds. Gain 4 Havoc per enemy ignited.' }, havocGain: 4, description: 'Deals 8d8 fire + necrotic damage to EACH enemy. Ignites all targets (2d6 fire/round for 3 rounds). +4 Havoc per enemy.' },
        base: { damage: '5d8', havocGain: 2, description: 'Deals 5d8 damage to each enemy.' },
        outside: { backlash: '2d8 to self per miss', description: 'Deals 2d8 damage to you for each target that is missed.' }
      }
        }
      ],
      damageConfig: { formula: '5d8', damageTypes: ['fire', 'necrotic'], resolution: 'PROPHECY' }, 
      cooldownConfig: { type: 'long_rest', value: 1 }, 
      tags: ['ultimate', 'prophecy', 'cataclysm', 'area', 'multi'] 
    },
    { 
      id: 'doomsayer_death_sentence', 
      name: 'Death Sentence', 
      description: 'Mark a target with an inescapable doom brand. All future prophecies against this target gain advantage and guaranteed Havoc.', 
      spellType: 'ACTION', 
      icon: 'Necrotic/Necrotic Skull', 
      school: 'necromancy', 
      level: 8, 
      specialization: 'requiem', 
      effectTypes: ['debuff', 'ultimate'],
      typeConfig: { school: 'necromancy', castTime: '1 action', castTimeType: 'action' }, 
      targetingConfig: { targetingType: 'single', rangeDistance: 30, targetRestrictions: ['enemies'] }, 
      resourceCost: { actionPoints: 3, mana: 40, classResource: { type: 'havoc', cost: 10 } }, 
      durationConfig: { durationValue: 1, durationUnit: 'minutes', concentrationRequired: true }, 
      resolution: 'AUTOMATIC', 
      debuffConfig: {
        debuffType: 'brand',
        effects: [
          { id: 'doom_brand', name: 'Death Sentence', description: 'Target cannot resolve as Outside (minimum Base). Prophesied generate +3 Havoc. Target cannot heal above 50% HP.' }
        ]
      },
      cooldownConfig: { type: 'long_rest', value: 1 }, 
      tags: ['ultimate', 'debuff', 'prophecy', 'requiem', 'concentration'] 
    },
    // LEVEL 9
    { 
      id: 'doomsayer_the_end', 
      name: 'The End', 
      description: 'Speak the Word of Ending. All creatures in range face a prophecy of total annihilation.', 
      spellType: 'ACTION', 
      icon: 'Void/Black Hole', 
      school: 'evocation', 
      level: 9, 
      specialization: 'universal', 
      effectTypes: ['damage', 'area', 'ultimate'],
      typeConfig: { school: 'evocation', castTime: '1 action', castTimeType: 'action' }, 
      targetingConfig: { targetingType: 'self_centered', areaShape: 'circle', areaSize: 60 }, 
      resourceCost: { actionPoints: 3, mana: 50, classResource: { type: 'havoc', cost: 12 } }, 
      resolution: 'PROPHECY', 
      mechanicsConfig: [
        {
          enabled: true,
          system: 'PROPHECY',
          prophecy: {
        rangeDice: ['d12', 'd10'],
        resolutionDie: 'd10',
        prophesied: { damage: '10d10', effect: { name: 'Erasure', instantKillThreshold: 0.3, description: 'Deals 10d10 mixed damage. All enemies below 30% HP after damage are instantly reduced to 0 HP.' }, havocGain: 12, description: 'Deals 10d10 mixed damage. Enemies below 30% HP are instantly erased.' },
        base: { damage: '6d10', havocGain: 6, description: 'Deals 6d10 mixed damage to all enemies.' },
        outside: { backlash: '4d10 to self', description: 'Deals 4d10 damage to you.' }
      }
        }
      ],
      damageConfig: { formula: '6d10', damageTypes: ['necrotic', 'fire', 'psychic', 'force'], resolution: 'PROPHECY' }, 
      cooldownConfig: { type: 'long_rest', value: 1 }, 
      tags: ['ultimate', 'damage', 'prophecy', 'universal', 'area'] 
    },
    { 
      id: 'doomsayer_cataclysm_incarnate', 
      name: 'Cataclysm Incarnate', 
      description: 'Become a walking cataclysm. Everything around you is subject to prophetic destruction as you step through the ruins of fate.', 
      spellType: 'ACTION', 
      icon: 'Fire/Fire Demon', 
      school: 'transmutation', 
      level: 9, 
      specialization: 'cataclysm', 
      effectTypes: ['buff', 'aura', 'ultimate'],
      typeConfig: { school: 'transmutation', castTime: '1 action', castTimeType: 'action' }, 
      targetingConfig: { targetingType: 'self' }, 
      resourceCost: { actionPoints: 3, mana: 50, classResource: { type: 'havoc', cost: 12 } }, 
      durationConfig: { durationValue: 1, durationUnit: 'minutes', concentrationRequired: true }, 
      resolution: 'AUTOMATIC', 
      triggerConfig: {
        triggers: [
          { 
            id: 'turn_cataclysm', 
            name: 'Walking Apocalypse', 
            triggerType: 'start_of_turn', 
            action: 'Roll on the Cataclysm Table for all enemies within 40ft. All hits are auto-Prophesied.' 
          }
        ]
      },
      tableConfig: {
        name: 'Cataclysm Table',
        rolls: [
          { roll: '1-2', effect: '4d6 fire damage' },
          { roll: '3-4', effect: '4d6 necrotic damage' },
          { roll: '5', effect: '4d6 psychic damage + Stunned for 1 round (CON DC 18 negates)' },
          { roll: '6', effect: '4d6 force damage + knockback 30ft' }
        ]
      },
      cooldownConfig: { type: 'long_rest', value: 1 }, 
      tags: ['ultimate', 'transformation', 'cataclysm', 'prophecy', 'area'] 
    },
    { 
      id: 'doomsayer_requiem_absolute', 
      name: 'Requiem Absolute', 
      description: 'The final requiem. Place a prophecy so absolute that fate itself cannot deny the target\'s end.', 
      spellType: 'ACTION', 
      icon: 'Necrotic/Necrotic Wither 2', 
      school: 'necromancy', 
      level: 9, 
      specialization: 'requiem', 
      effectTypes: ['damage', 'death', 'ultimate'],
      typeConfig: { school: 'necromancy', castTime: '1 action', castTimeType: 'action' }, 
      targetingConfig: { targetingType: 'single', rangeDistance: 30, targetRestrictions: ['enemies'] }, 
      resourceCost: { actionPoints: 3, mana: 50, classResource: { type: 'havoc', cost: 12 } }, 
      resolution: 'PROPHECY', 
      mechanicsConfig: [
        {
          enabled: true,
          system: 'PROPHECY',
          prophecy: {
        rangeDice: ['d4', 'd4'],
        resolutionDie: 'd4',
        prophesied: { effect: { name: 'Absolute Death', instantKill: true, bypassImmunity: true, description: 'Target is reduced to 0 HP. No save. No immunity. Affects undead, constructs, and all creature types. This is absolute — fate has spoken.' }, description: 'Target is reduced to 0 HP. No save. No immunity. Affects all creature types.' },
        base: { damage: '15d12', havocGain: 6, description: 'Deals 15d12 necrotic damage.' },
        outside: { backlash: '15d12 to self', description: 'Deals 15d12 necrotic damage to you.' }
      }
        }
      ],
      damageConfig: { formula: '15d12', damageTypes: ['necrotic'], resolution: 'PROPHECY' }, 
      cooldownConfig: { type: 'long_rest', value: 1 }, 
      tags: ['ultimate', 'death', 'prophecy', 'requiem'] 
    },
    // LEVEL 10
    { 
      id: 'doomsayer_herald_of_the_end', 
      name: 'Herald of the End', 
      description: 'Transform into the Herald of the End Times. For one minute, you ARE the apocalypse, and fate bows to your command.', 
      spellType: 'ACTION', 
      icon: 'Void/Falling Meteors', 
      school: 'transmutation', 
      level: 10, 
      specialization: 'universal', 
      effectTypes: ['buff', 'ultimate'],
      typeConfig: { school: 'transmutation', castTime: '1 action', castTimeType: 'action' }, 
      targetingConfig: { targetingType: 'self' }, 
      resourceCost: { actionPoints: 3, mana: 60, classResource: { type: 'havoc', cost: 15 } }, 
      durationConfig: { durationValue: 1, durationUnit: 'minutes', concentrationRequired: true }, 
      resolution: 'AUTOMATIC', 
      buffConfig: {
        buffType: 'ultimate_transformation',
        effects: [
          { id: 'end_herald', name: 'Herald of the End', description: 'All prophecies auto-resolve as Prophesied. Triple Havoc generation. Immune to fire, necrotic, psychic. Backlash deals double damage to enemies instead.' }
        ]
      },
      cooldownConfig: { type: 'long_rest', value: 1 }, 
      tags: ['ultimate', 'transformation', 'prophecy', 'universal'] 
    },
    { 
      id: 'doomsayer_end_of_all_things', 
      name: 'End of All Things', 
      description: 'Speak the prophecy that ends all prophecies. Every active prophecy on the battlefield detonates simultaneously at maximum power.', 
      spellType: 'ACTION', 
      icon: 'Void/Consumed by Void', 
      school: 'evocation', 
      level: 10, 
      specialization: 'cataclysm', 
      effectTypes: ['damage', 'area', 'ultimate'],
      typeConfig: { school: 'evocation', castTime: '1 action', castTimeType: 'action' }, 
      targetingConfig: { targetingType: 'self_centered', areaShape: 'circle', areaSize: 120 }, 
      resourceCost: { actionPoints: 3, mana: 60, classResource: { type: 'havoc', cost: 15 } }, 
      resolution: 'AUTOMATIC', 
      triggerConfig: {
        triggers: [
          { 
            id: 'final_detonation', 
            name: 'The End of All Things', 
            triggerType: 'on_cast', 
            action: 'Detonate ALL active prophecies within 120ft. Each resolves as Prophesied. Creates a Scorched Earth zone (3d8/round) for 5 rounds.' 
          }
        ]
      },
      cooldownConfig: { type: 'long_rest', value: 1 }, 
      tags: ['ultimate', 'prophecy', 'cataclysm', 'detonate', 'area'] 
    },
    { 
      id: 'doomsayer_final_requiem', 
      name: 'Final Requiem', 
      description: 'The last song of doom. Sing the prophecy that cannot be denied, cannot be survived, cannot be escaped, and cannot be forgiven.', 
      spellType: 'ACTION', 
      icon: 'Necrotic/Necrotic Wither 4', 
      school: 'necromancy', 
      level: 10, 
      specialization: 'requiem', 
      effectTypes: ['damage', 'death', 'ultimate'],
      typeConfig: { school: 'necromancy', castTime: '1 action', castTimeType: 'action' }, 
      targetingConfig: { targetingType: 'single', rangeDistance: 60, targetRestrictions: ['enemies'] }, 
      resourceCost: { actionPoints: 3, mana: 60, classResource: { type: 'havoc', cost: 15 } }, 
      resolution: 'AUTOMATIC', 
      triggerConfig: {
        triggers: [
          { 
            id: 'absolute_execution', 
            name: 'Final Requiem', 
            triggerType: 'on_cast', 
            action: 'Target takes 20d12 necrotic damage. No save. If they die, they cannot be resurrected. If they survive, all future prophecies against them auto-Prophesize.' 
          }
        ]
      },
      damageConfig: { formula: '20d12', damageTypes: ['necrotic'], resolution: 'AUTOMATIC' },
      cooldownConfig: { type: 'long_rest', value: 1 }, 
      tags: ['ultimate', 'death', 'prophecy', 'requiem', 'absolute']
    }
  ],

  spellPools: {
    1: ['doomsayer_doom_bolt', 'doomsayer_doom_whisper', 'doomsayer_omen_flame', 'doomsayer_omen_of_ash', 'doomsayer_havoc_blast'],
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
