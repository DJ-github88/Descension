/**
 * Plaguebringer Class Data — v2 (Approved Blueprint)
 *
 * Core Philosophy: The Plague Gardener
 * Plant affliction seeds, cultivate them through 5 interchangeable categories,
 * and watch them bloom into devastating final plagues.
 *
 * Resource: Virulence (passive buff gauge) + Active Afflictions
 * Categories: Weaken, Torment, Fester, Decay, Amplify
 * Specs: Virulent Spreader (Field Farmer), Torment Weaver (Spider), Decay Harbinger (Eternal Tree)
 */

export const PLAGUEBRINGER_DATA = {
  id: 'plaguebringer',
  name: 'Plaguebringer',
  icon: 'fas fa-biohazard',
  role: 'Damage/Control',
  damageTypes: ['poison', 'necrotic'],

  overview: {
    title: 'The Plaguebringer',
    subtitle: 'Master of Pestilence and Decay',

    quickOverview: {
      title: 'Quick Overview',
      content: `**What You Need to Know**: Plaguebringers plant affliction seeds on enemies, then cultivate them through category spells. Pick any combination of 5 categories — Weaken, Torment, Fester, Decay, or Amplify — and the sequence you choose determines the final plague. Your power grows passively as your garden grows.

**Core Mechanic**: Apply Base Affliction → Cultivate with 3 Category Spells (any order) → Final Plague determined by your last category

**Resource**: Virulence (0-100) — passive buff gauge that grows as you cultivate. Never spent, only gained.

**Playstyle**: Methodical disease cultivation with intuitive ingredient-mixing

**Best For**: Players who enjoy patient setup, meaningful choices at every step, and watching their carefully nurtured plagues consume the battlefield`
    },

    description: `The Plaguebringer is a master of pestilence and decay, weaving intricate webs of curses, toxins, and afflictions to bring their enemies to a slow, agonizing end. Unlike brute force warriors, the Plaguebringer thrives on the delicate art of nurturing and evolving their sinister creations. Each affliction begins as a seed, carefully planted on the target, and through meticulous cultivation, grows into a devastating plague that cripples and consumes.`,

    roleplayIdentity: {
      title: 'Roleplay Identity',
      content: `Plaguebringers are individuals who have mastered the forbidden arts of disease cultivation and affliction manipulation. They understand that true power lies not in overwhelming force, but in patient, methodical corruption. Every enemy is a garden to be tended, every affliction a seed to be nurtured into something far more terrible.

**Philosophy**: Power through patience. The Plaguebringer believes that the most devastating victories come not from quick strikes, but from carefully cultivated suffering. They see disease as an art form, each affliction a brushstroke in a masterpiece of decay.

**Personality Archetypes**:
- **The Methodical Gardener**: Views afflictions as plants to be cultivated, takes pride in their "work"
- **The Plague Doctor**: Seeks to understand disease to control it, twisted healer archetype
- **The Vengeful Spreader**: Uses plague as retribution, spreading suffering to those who wronged them
- **The Curious Experimenter**: Fascinated by how afflictions evolve and combine, driven by dark curiosity

**Social Dynamics**: Plaguebringers are often feared and avoided. Their very presence suggests contagion and decay. They must decide whether to hide their nature or embrace the terror they inspire.`
    },

    combatRole: {
      title: 'Combat Role',
      content: `**Primary Role**: Damage over time specialist with strong crowd control through debuffs

**Damage Profile**:
- Sustained damage through multiple stacking afflictions
- Burst damage via affliction harvesting (Plague Burst and similar)
- Area denial through contagion spread

**Control Capabilities**:
- Debuffs that reduce enemy effectiveness
- Crowd control through fear, confusion, and paralysis
- Area control via plague zones and contagion

**Survivability**: Moderate — Virulence at high levels provides passive buffs, and some category spells grant self-sustain (Decay lifesteal, Dark Rejuvenation). Vulnerable to burst damage during early cultivation setup.`
    },

    playstyle: {
      title: 'Playstyle',
      content: `**Core Mechanic**: Affliction Cultivation with 5 Interchangeable Categories.

Apply a base affliction, then advance it through 3 stages using ANY combination of category spells. The LAST category you apply determines the final plague's effect type. The previous categories shape its journey.

**The 5 Categories**:
- **Weaken** (The Sap): Reduce defenses, stats, armor
- **Torment** (The Whisper): Psychic damage, confusion, fear
- **Fester** (The Creep): Spread to nearby enemies, contagion
- **Decay** (The Rot): Necrotic damage, anti-healing, max HP drain
- **Amplify** (The Surge): Multiply existing damage, intensify effects

**How Final Forms Work**:
Your LAST category determines the final plague's archetype:
- Ends with **Amplify** → Harvest (burst damage, affliction consumed)
- Ends with **Fester** → Pandemic (mass contagion spread)
- Ends with **Weaken** → Collapse (devastating permanent debuffs)
- Ends with **Torment** → Shatter (mind break, total confusion)
- Ends with **Decay** → Blight (permanent HP/stat drain)

**Virulence** grows passively as you cultivate. Higher Virulence = stronger afflictions. Never spent.

**Decision Points**:
- Which base affliction to plant on each target
- Which 3 categories to sequence for each affliction
- When to harvest vs. continue cultivating
- Which targets to focus vs. spread contagion

**Skill Expression**:
- Choosing optimal category sequences for the situation
- Managing multiple afflictions across multiple targets
- Timing harvests for maximum team impact
- Leveraging Virulence thresholds for power spikes`
    },

    immersiveCombatExample: {
      title: 'Combat Example: The Plague Garden',
      content: `**The Setup**: You're a Plaguebringer (Virulent Spreader) facing 4 knights and 1 knight captain. Starting Mana: 50/60. Starting Virulence: 0/100.

**Starting State**: Mana: 50/60 | HP: 50/50 | Virulence: 0/100 (Seedling) | Active Afflictions: 0

**Turn 1 — Planting Seeds** (2 AP available)

*Four knights and their captain stand before you, armor gleaming. They don't know it yet, but they're already dead. They just haven't finished dying.*

**Action (1 AP)**: Cast "Curse of Agony" on Knight Captain (3 mana, base affliction)
**Effect**: Apply base affliction — 1d6 + INT necrotic per turn for 4 rounds (+2 from Plague Mastery = 6 rounds total)
**Virulence**: 0 + 10 = 10/100 (Seedling)

*You gesture at the captain. Dark energy seeps into his armor, invisible to him. The seed is planted.*

**Action (1 AP)**: Cast "Venomous Touch" on Knight #1 (3 mana, base affliction)
**Effect**: Apply base affliction — 1d4 poison per turn for 4 rounds (+2 from Plague Mastery = 6 rounds total)
**Virulence**: 10 + 10 = 20/100 (Seedling)

*You touch Knight #1. Venom seeps into his bloodstream. Another seed planted.*

**Current Afflictions**:
- Knight Captain: Curse of Agony (Stage 0: Seed)
- Knight #1: Venomous Touch (Stage 0: Seed)

**Turn 2 — First Cultivation** (2 AP available)

*Afflictions tick at start of enemy turns. Captain takes 4 necrotic (1d6+1). Knight #1 takes 2 poison (1d4). They don't understand yet. But they will.*

**Action (1 AP)**: Cast "Enfeebling Fog" on Knight Captain (6 mana, WEAKEN category)
**Effect**: Advance Curse of Agony to Stage 1. Gain Weaken effect: -2 Armor
**Virulence**: 20 + 5 = 25/100 → **SPROUTING** (all afflictions +1 damage die)

*You channel a weakening fog around the captain. The curse EVOLVES. His armor feels heavier.*

**Affliction**: Knight Captain: Curse of Agony (Stage 1: Weaken applied)
**New Effect**: 2d6 + INT necrotic/turn + target has -2 Armor

*Your Virulence crosses the Sprouting threshold. ALL your afflictions just got stronger. The garden grows, and so do you.*

**Action (1 AP)**: Cast "Infectious Sores" on Knight #1 (6 mana, FESTER category)
**Effect**: Advance Venomous Touch to Stage 1. Gain Fester effect: spreads on movement
**Virulence**: 25 + 5 = 30/100 (Sprouting)

*The venom in Knight #1's blood begins to FESTER. If he moves, it spreads.*

**Affliction**: Knight #1: Venomous Touch (Stage 1: Fester applied)
**New Effect**: 2d4 poison/turn + spreads to adjacent enemies when target moves

**Knight #1 moves to attack** → **CONTAGION**: Knight #2 gains Venomous Touch (Stage 0: Seed)
**Virulence**: 30 + 10 (contagion spread) = 40/100 (Sprouting)

*He moved. The plague spreads. Knight #2 is infected and doesn't know it yet.*

**Current Afflictions** (3 total):
- Knight Captain: Curse of Agony (Stage 1: Weaken)
- Knight #1: Venomous Touch (Stage 1: Fester)
- Knight #2: Venomous Touch (Stage 0: Seed, contagion)

**Turn 3 — Second Cultivation** (2 AP available)

*Tick. Captain takes 8 necrotic (2d6+1 from Sprouting). Knight #1 takes 5 poison (2d4). Knight #2 takes 2 poison (1d4 — not yet cultivated, so no Sprouting bonus). The captain is looking pale.*

**Action (1 AP)**: Cast "Hallucinogenic Spores" on Knight Captain (6 mana, TORMENT category)
**Effect**: Advance Curse of Agony to Stage 2. Gain Torment effect: confusion on Spirit save fail
**Virulence**: 40 + 5 = 45/100 (Sprouting)

*Spores fill the captain's mind. The curse twists. He stumbles, confused.*

**Affliction**: Knight Captain: Curse of Agony (Stage 2: Weaken + Torment)
**New Effect**: 3d6 + INT necrotic/turn, -2 Armor, Spirit save or attack nearest ally

**Captain FAILS Spirit save** → Attacks Knight #3!

*The captain swings at his own knight. The torment works.*

**Action (1 AP)**: Cast "Plague of Flies" on Knight #1 (7 mana, FESTER category)
**Effect**: Advance Venomous Touch to Stage 2. Gain second Fester: vision reduced + doubled spread range
**Virulence**: 45 + 5 = 50/100 → **BLOOMING** (+1 duration, +5ft spread)

*Knight #1 is now a walking plague vector. Blind and festering.*

**Affliction**: Knight #1: Venomous Touch (Stage 2: Fester + Fester)
**New Effect**: 3d4 poison/turn, spreads on movement (10ft range), vision reduced

**Current Afflictions** (3 total): Virulence 50/100 (Blooming)

**Turn 4 — The Harvest** (2 AP available)

*Tick. Captain takes 11 necrotic (3d6+1). Knight #1 takes 8 poison (3d4) → DEAD. His body erupts as the affliction seeks new hosts.*
*Knight #2 takes 3 poison (1d4). Knights #3 and #4 are nearby.*

**Action (1 AP)**: Cast "Suffering's Echo" on Knight Captain (9 mana, AMPLIFY category)
**Effect**: Advance Curse of Agony to Stage 3 (FINAL). Last category is AMPLIFY → **HARVEST FINALE**
**Virulence**: 50 + 5 = 55/100 (Blooming)

*You clench your fist. The captain's affliction reaches its FINAL FORM — amplified to the breaking point.*

**FINAL AFFLICTION: Agony Harvest** (Weaken → Torment → Amplify)
**Effect**: 5d8+INT immediate necrotic + target stunned 2 rounds + all other afflictions on target deal double damage this turn
**Damage**: 5d8 → [6,7,5,8,4] + 3 = 33 necrotic → Captain at 15% HP, STUNNED

*The captain SCREAMS. The culmination of weakness, torment, and amplified agony tears through him.*

**Virulence**: 55 + 25 (final form bonus) = 80/100 → **PEAK HARVEST** (+2 damage dice, ignore first dispel)

*Your Virulence surges into Peak Harvest. All remaining afflictions are now UNSTOPPABLE.*

**Turn 5 — The Plague Spreads** (2 AP available)

*Knight #2 has Venomous Touch (Seed). With Blooming active, it now lasts 5 rounds instead of 4 and the contagion range is 10ft.*

**Action (2 AP)**: Cast "Mass Affliction" on grouped knights (20 mana)
**Effect**: Apply Curse of Agony (Seed) to ALL enemies in 20ft radius. 6d6 poison damage.
**Virulence**: 80 + 5 per knight hit × 3 = 95/100 (Peak Harvest)

*Your garden is a FIELD now. Every enemy is seeded. Your Virulence nears maximum.*

**PEAK HARVEST active**: All afflictions ignore first dispel, +2 damage dice. Your afflictions are now UNSTOPPABLE.

**Current Afflictions** (4+): Virulence 95/100 (Peak Harvest)

*You stand among the dying. Your party stares in awe.*

**Your Party's Tank**: "You killed them all with DISEASES."
**You**: "I cultivated them. Planted seeds, chose the right ingredients, and watched them grow. The captain got Weaken, then Torment, then Amplify — a perfect Harvest. The others? They just needed to stand close enough."

**Final State**: Mana: 2/60 | HP: 50/50 | Virulence: 95/100 (Peak Harvest)

**The Lesson**:
1. **Base Afflictions**: Seeds planted on targets (Curse of Agony, Venomous Touch)
2. **Categories**: 5 ingredients — Weaken, Torment, Fester, Decay, Amplify — mixed in any order
3. **Last Category = Final Form**: Amplify at the end = Harvest (burst damage finale)
4. **Virulence**: Passive power that grows with cultivation. Never spent. Checked at cast time. Rewards the gardener.
5. **Contagion**: Fester category spreads afflictions. One infected knight became three.
6. **Plague Mastery**: Adds +2 rounds to all affliction durations, making your garden last longer.
7. **Cultivation Scaling**: Higher stages = exponentially more powerful. Stage 0 (1d6) → Stage 3 Final (5d8+effects)`
    }
  },

  resourceSystem: {
    title: 'Affliction Cultivation',
    subtitle: 'Five Ingredients, Infinite Gardens',

    description: `Your power is that of a dark gardener. Plant seeds of affliction, cultivate them through five distinct categories of suffering, and watch them bloom into unstoppable plagues as your Virulence—a passive measure of your garden's growth—empowers every disease you weave.

**Key Definitions**:
- **Affliction**: A cultivatable disease on a specific target. Each affliction has a Base Spell, up to 3 Category stages, and optionally a Final Form. A single target can have up to 2 active afflictions simultaneously. The global affliction cap across all targets is 10.
- **Virulence Decay**: At the start of each of your turns, lose 2 Virulence (minimum 0).
- **Threshold Bonuses**: Virulence thresholds are checked when you cast a spell. Bonuses apply to that spell and any afflictions created or advanced by it, even if Virulence later drops below the threshold.
- **Consumed**: When an affliction is consumed (e.g., Harvest finale), it is removed from the target entirely, freeing one affliction slot.`,

    cards: [
      {
        title: 'Virulence',
        stats: '0-100 Gauge',
        details: 'A passive measure of your power. It never spends; it only grows as you cultivate, unlocking massive stat and duration buffs for all active afflictions.'
      },
      {
        title: 'Afflictions',
        stats: '3-Stage Evolution',
        details: 'Diseases start as Seeds. Use 3 Category spells to evolve them. The final category used determines the plague\'s ultimate form.'
      }
    ],

    generationTable: {
      headers: ['Trigger', 'Virulence Change', 'Notes'],
      rows: [
        ['Plant a Seed (Base Spell)', '+10', 'Base affliction applied'],
        ['Cultivate (Category Spell)', '+5', 'Advances affliction one stage'],
        ['Final Form reached', '+25', 'Affliction blooms into final archetype'],
        ['Passive Decay', '-2 per turn', 'At the start of your turn. The garden requires constant tending.'],
        ['Peak Harvest (75+)', 'Max Buffs', 'Afflictions ignore first dispel, +2 damage dice']
      ]
    },

    usage: {
      momentum: 'Category spells cost mana and advance an affliction\'s stage. The first two categories shape the path, while the third determines the final archetype.',
      flourish: 'Virulence Thresholds (checked at cast time): Sprouting (25) adds +1 damage die; Blooming (50) adds +1 duration and +5ft spread; Peak Harvest (75) adds +2 damage dice and dispel resistance.'
    },

    fiveCategoriesTable: {
      title: 'The Five Categories',
      headers: ['Category', 'Identity', 'Stage Effect', 'Best For'],
      rows: [
        ['Weaken', 'The Sap', 'Reduce Armor, stats, defenses', 'Softening targets, team synergy'],
        ['Torment', 'The Whisper', 'Psychic damage, confusion, fear', 'Crowd control, disrupting casters'],
        ['Fester', 'The Creep', 'Spread to nearby, contagion mechanics', 'Multi-target, grouped enemies'],
        ['Decay', 'The Rot', 'Necrotic damage, anti-healing, max HP drain', 'Bosses, healers, attrition'],
        ['Amplify', 'The Surge', 'Multiply existing effects, intensity', 'Burst damage windows, finales']
      ]
    },

    finalFormsTable: {
      title: 'Final Plague Archetypes (by Last Category)',
      headers: ['Last Category', 'Archetype Name', 'Core Effect', 'Consumed?'],
      rows: [
        ['Amplify', 'The Harvest', 'Massive burst damage', 'Yes — affliction consumed'],
        ['Fester', 'The Pandemic', 'Spreads to all nearby enemies', 'No — continues on original'],
        ['Weaken', 'The Collapse', 'Permanent debuffs, stat reduction', 'No — persists as curse'],
        ['Torment', 'The Shatter', 'Mind break, attacks allies, flees', 'No — persists as madness'],
        ['Decay', 'The Blight', 'Max HP drain, healing blocked', 'No — persists as rot']
      ]
    },

    strategicConsiderations: {
      title: 'Combat Phases & Decision-Making',
      content: `**Planting (Virulence 0–24)**: Focus on seeding multiple targets. Your goal is to hit Sprouting (25) as fast as possible to make your DoTs meaningful.

**Cultivation (Virulence 25–74)**: This is your sweet spot. Alternate categories to keep Virulence high. Ends with Fester for crowds or Decay for high-value targets.

**The Harvest (Virulence 75–100)**: Maximum effectiveness. Your afflictions are nearly impossible to dispel. This is when you finish with Amplify to trigger a massive burst finale.

**Advanced Play — Ingredient Mixing**: Don't just spam the same category. Mixing Weaken and Decay before a Harvest ensures the target is softened for the final burst.

**Worked Example (Stage 2 Affliction, Boss at 30% HP):**
- **Option A** — Amplify (Finale): Triggers Agony Harvest. Best if you can kill the boss now.
- **Option B** — Decay (Finale): Triggers Blight. Best if the boss has massive health or healing.
- **Option C** — Weaken (Finale): Triggers Collapse. Best if your team needs to land huge physical hits.

→ **Best default**: Option A. At 30%, a Stage 3 Harvest is often the killing blow.`
    },

    playingInPerson: {
      title: 'Playing in Person',
      subtitle: 'Physical Tracking for Tabletop Play',
      content: `Use colored glass beads or tokens on the enemy cards to represent the three categories of any active affliction.

**Required Materials**:
- **Colored Tokens** — (Grey: Weaken, Purple: Torment, Green: Fester, Black: Decay, Red: Amplify)
- **d100 or Dial** — To track your Virulence gauge

**Each Turn — Adjust the Garden**:
- Hit/Cast → add +10 Virulence for seeds, +5 for categories
- Advance Stage → Place the colored token representing the category cast
- End of Round → Subtract 2 Virulence

**Quick Reference**:
\`\`\`
VIRULENCE THRESHOLDS:
  25+ Sprouting: +1 Damage Die
  50+ Blooming: +1 Round Duration, +5ft Spread
  75+ Peak Harvest: Resist Dispel, +2 Damage Dice

FINAL ARCHETYPES (Last Token):
  Red (Amplify): Harvest (Burst, Consumed)
  Green (Fester): Pandemic (Mass Spread)
  Grey (Weaken): Collapse (-Stats)
  Purple (Torment): Shatter (Madness)
  Black (Decay): Blight (Max HP Drain)
\`\`\`

**The Physical Hack**:
- **Contagion Tracker**: When a plague spreads, move the tokens from the original enemy card to a new one to show the exact stage and ingredients that were passed on.
- **The Harvest Pop**: When you trigger a Harvest, physically sweep the tokens off the card into your hand—it’s a satisfying way to "cash in" the damage.

**Pro Tips**:
- Reaching 25 Virulence is your first priority; don't worry about perfect combos until you're Sprouting.
- At 75+ Virulence, your garden is unstoppable. Don't rush to Harvest; let the Peak Harvest DoTs tick as long as possible.`
    }
  },

  specializations: {
    title: 'Plaguebringer Specializations',
    subtitle: 'Three Ways to Garden',

    description: `Plaguebringers can specialize in three fundamentally different approaches to affliction cultivation. Each spec changes HOW you garden — not just which flowers you prefer.`,

    sharedPassive: {
      name: 'Plague Mastery',
      icon: 'Poison/Poison Plague',
      description: 'Your afflictions last 2 additional rounds and resist dispel attempts (roll 1d6, on 5-6 resist). Whenever an afflicted target dies, you gain 1d4 mana.'
    },

    specs: [
      {
        id: 'virulent-spreader',
        name: 'Virulent Spreader',
        icon: 'Poison/Poison Contagion',
        color: '#556B2F',
        description: 'The Field Farmer — Your garden is an entire battlefield. Apply afflictions to multiple targets simultaneously and watch contagion cascade through enemy ranks.',

        specPassive: {
          name: 'Epidemic Mastery',
          description: 'Base affliction spells can be applied to 2 adjacent targets simultaneously (same cast, same mana cost). When an affliction reaches Stage 2+, it auto-spreads to 1 adjacent enemy as a Stage 0 Seed. +1 spread target per 25 Virulence.'
        },

        playstyle: 'You play WIDE. Instead of cultivating one perfect affliction on one target, you blanket the field with seeds and let contagion do the work. Your strength is in grouped enemies where one affliction cascades into a full epidemic. You\'re the farmer who plants an entire field rather than tending a single prized plant.',

        strengths: [
          'Exceptional multi-target damage through contagion',
          'Efficient mana usage — one cast hits multiple targets',
          'Strong area denial through plague zones',
          'Scales dramatically with grouped enemies'
        ],

        weaknesses: [
          'Lower single-target burst than other specs',
          'Requires enemies to be relatively close together',
          'Less control over individual affliction paths',
          'Contagion can be unpredictable'
        ],

        playstyleTips: [
          'Open by seeding multiple adjacent targets',
          'Use Fester category to trigger auto-spread',
          'Let contagion do the work — don\'t over-cultivate',
          'Pandemic finale (Fester ending) is your signature move'
        ],

        keyAbilities: [
          {
            name: 'Field Seeding',
            cost: 'Passive',
            description: 'Base afflictions apply to 2 adjacent targets. At 50 Virulence, applies to 3 adjacent targets.'
          },
          {
            name: 'Auto-Contagion',
            cost: 'Passive',
            description: 'Stage 2+ afflictions auto-spread to 1 adjacent enemy as Seed. +1 target per 25 Virulence.'
          },
          {
            name: 'Plague Burst',
            cost: 'Requires 3+ Active Afflictions',
            description: 'Harvest all afflictions in 15ft radius (max 6). Each affliction deals its current DoT × 3 as immediate damage. Stage 3 afflictions explode in 10ft radius.'
          },
          {
            name: 'Epidemic Wave',
            cost: 'Requires 6+ Active Afflictions',
            description: 'All Stage 1+ afflictions spread to 2 additional targets each. Lasts 2 turns. Double contagion range.'
          }
        ]
      },

      {
        id: 'torment-weaver',
        name: 'Torment Weaver',
        icon: 'Psychic/Mind Roar',
        color: '#4B0082',
        description: 'The Spider — Your garden is a web of linked minds. Cultivate one affliction and all linked targets suffer with it.',

        specPassive: {
          name: 'Psychic Resonance',
          description: 'When you advance an affliction on one target, all targets with the SAME base affliction also advance 1 stage (Psychic Link). Max 3 linked targets. +1 link per 25 Virulence. Linked targets take +1d4 psychic damage when any link is activated.'
        },

        playstyle: 'You play CONNECTED. Apply the same base affliction to multiple targets, then cultivate ANY one of them — all linked targets advance simultaneously. You\'re the spider at the center of a web; pull one thread and the whole web vibrates. Your signature is planting the same seed in multiple minds and then cultivating them all at once.',

        strengths: [
          'Extremely efficient cultivation — advance multiple afflictions with one spell',
          'Strong crowd control through psychic effects',
          'Excellent against groups of similar enemies',
          'Linked finales trigger on all connected targets'
        ],

        weaknesses: [
          'Links break if base affliction type differs',
          'Lower raw damage per-target than other specs',
          'Psychic resistance can sever links',
          'Requires setup to establish the web'
        ],

        playstyleTips: [
          'Apply the SAME base affliction to multiple targets to form links',
          'Cultivate one target — all linked targets advance for free',
          'Shatter finale (Torment ending) chains through all links',
          'Target enemy casters first — psychic effects bypass physical defenses'
        ],

        keyAbilities: [
          {
            name: 'Psychic Link',
            cost: 'Passive',
            description: 'Same base affliction on multiple targets creates links. Cultivating one cultivates all. Max 3 links +1 per 25 Virulence.'
          },
          {
            name: 'Resonance Damage',
            cost: 'Passive',
            description: 'When any linked affliction activates, all linked targets take +1d4 psychic damage.'
          },
          {
            name: 'Mind Fracture',
            cost: 'Requires 3+ Linked Targets',
            description: 'All linked targets make Spirit save (DC 15) or are stunned 1 turn. On save, disoriented instead.'
          },
          {
            name: 'Psychic Cascade',
            cost: 'Requires 4+ Linked Targets',
            description: 'Your next finale triggers on ALL linked targets simultaneously at reduced potency (70% effect).'
          }
        ]
      },

      {
        id: 'decay-harbinger',
        name: 'Decay Harbinger',
        icon: 'Necrotic/Necrotic Death',
        color: '#2F4F2F',
        description: 'The Eternal Tree — Your garden never stops growing. Afflictions don\'t bloom into finales; they grow indefinitely, stacking permanent rot.',

        specPassive: {
          name: 'Accelerated Decay',
          description: 'Afflictions have NO final form. Instead, every category spell after Stage 3 adds a permanent stack: -1 to a stat (based on category), -1d4 max HP, or -10% healing (your choice per stack). Stacks persist until Greater Restoration. Max 15 stacks per target. Every 25 Virulence, your permanent stacks deal +1d6 necrotic/turn. Stacks above 10 require concentration — if you lose concentration, stacks above 10 are lost.'
        },

        playstyle: 'You play DEEP. While other specs harvest their afflictions, you let yours grow forever. There is no finale — the affliction IS the endstate. Each category spell after Stage 3 adds a permanent stack of deterioration. You\'re the ancient tree whose roots never stop spreading. Your power is patience made manifest: the longer the fight, the more unstoppable you become.',

        strengths: [
          'Permanent stacks that persist between encounters',
          'Dramatically stronger in prolonged fights',
          'Exceptional anti-healing and attrition',
          'Stacks up to 15 permanent debuffs per target — devastating in prolonged fights'
        ],

        weaknesses: [
          'No burst finale — cannot harvest for big damage',
          'Very slow ramp-up in short encounters',
          'Permanent effects can be resisted by high CON targets',
          'Stacks are cured by Greater Restoration',
          'Stacks above 10 require concentration — losing it forfeits excess stacks'
        ],

        playstyleTips: [
          'Focus on a single high-value target (boss, healer)',
          'Use Decay category for maximum permanent drain',
          'Stack anti-healing to shut down enemy healers',
          'Embrace the long game — you get stronger every turn'
        ],

        keyAbilities: [
          {
            name: 'Infinite Growth',
            cost: 'Passive',
            description: 'No final form. After Stage 3, each category spell adds permanent stacks. Max 15 stacks per target. Stacks above 10 require concentration.'
          },
          {
            name: 'Permanent Stacks',
            cost: 'Per Category Spell (post-Stage 3)',
            description: 'Choose per stack: -1 stat (Weaken=STR, Torment=INT, Fester=CON, Decay=max HP -1d4, Amplify=healing -10%). Until Greater Restoration.'
          },
          {
            name: 'Withering Aura',
            cost: 'Requires 5+ Permanent Stacks on Target',
            description: '20ft aura around target prevents all healing. Enemies within take 1d6 necrotic/turn. +1d6 per 5 stacks.'
          },
          {
            name: 'Necrotic Dominion',
            cost: 'Requires 10+ Permanent Stacks on Target',
            description: 'All enemies within 40ft have healing reduced by 50%. You gain 25% lifesteal on all damage dealt to stacked targets.'
          }
        ]
      }
    ]
  },

  exampleSpells: [
    {
      id: 'pb_curse_of_agony',
      name: 'Curse of Agony',
      description: 'Plant a seed of suffering in your target. Deals 1d6 + intelligence necrotic damage per turn for 4 rounds. Cultivate with any 3 category spells to reach final form.',
      spellType: 'ACTION',
      icon: 'Necrotic/Necrotic Skull',
      school: 'Necromancy',
      level: 1,
      typeConfig: { castTime: 1, castTimeType: 'IMMEDIATE' },
      targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 30 },
      durationConfig: { durationType: 'rounds', duration: 4, durationUnit: 'rounds' },
      resourceCost: { mana: 3, components: ['verbal', 'somatic'], verbalText: 'Dolor Aeternus!', somaticText: 'Point at target with cursing gesture' },
      savingThrow: { enabled: true, attribute: 'spirit', difficulty: 14, onSuccess: 'half_damage', onFailure: 'full_damage' },
      damageConfig: {
        formula: '1d6 + intelligence',
        elementType: 'necrotic',
        damageTypes: ['direct'],
        attackType: 'spell_save',
        hasDotEffect: true,
        dotConfig: { dotFormula: '1d6 + intelligence', duration: 4, tickFrequency: 'turn', isProgressiveDot: false },
        savingThrowConfig: { enabled: true, savingThrowType: 'spirit', difficultyClass: 14, saveOutcome: 'halves', partialEffect: true, partialEffectFormula: 'damage/2' },
          resolution: 'DICE',
      },
      specialMechanics: {
        afflictionCultivation: {
          enabled: true,
          baseAffliction: 'Curse of Agony',
          damageType: 'necrotic',
          categorySlots: 3,
          categoriesAvailable: ['Weaken', 'Torment', 'Fester', 'Decay', 'Amplify'],
          lastCategoryDeterminesFinal: true
        }
      },
      tags: ['affliction', 'base', 'necrotic', 'curse', 'plaguebringer'],
      flavorText: 'The seed of suffering takes root. Soon, it will bloom.'
    },
    {
      id: 'pb_venomous_touch',
      name: 'Venomous Touch',
      description: 'Infect your target with virulent poison. Deals initial poison damage and applies a poison affliction seed. Cultivate with any 3 category spells.',
      spellType: 'ACTION',
      icon: 'Poison/Deadly Poison',
      school: 'Necromancy',
      level: 1,
      typeConfig: { castTime: 1, castTimeType: 'IMMEDIATE' },
      targetingConfig: { targetingType: 'single', rangeType: 'melee', rangeDistance: 5 },
      durationConfig: { durationType: 'rounds', duration: 4, durationUnit: 'rounds' },
      resourceCost: { mana: 3, components: ['verbal', 'somatic'], verbalText: 'Venenum Tactus!', somaticText: 'Touch target with poisoned hand' },
      savingThrow: { enabled: true, attribute: 'constitution', difficulty: 14, onSuccess: 'half_damage', onFailure: 'full_damage' },
      damageConfig: {
        formula: '1d8 + intelligence',
        elementType: 'poison',
        damageTypes: ['direct'],
        attackType: 'spell_save',
        hasDotEffect: true,
        dotConfig: { dotFormula: '1d4 + poison', duration: 4, tickFrequency: 'turn', isProgressiveDot: false },
          resolution: 'DICE',
      },
      specialMechanics: {
        afflictionCultivation: {
          enabled: true,
          baseAffliction: 'Venomous Touch',
          damageType: 'poison',
          categorySlots: 3,
          categoriesAvailable: ['Weaken', 'Torment', 'Fester', 'Decay', 'Amplify'],
          lastCategoryDeterminesFinal: true
        }
      },
      tags: ['affliction', 'base', 'poison', 'melee', 'plaguebringer', 'virulent spreader'],
      flavorText: 'A single touch. A lifetime of suffering.'
    },
    {
      id: 'pb_whisper_of_decay',
      name: 'Whisper of Decay',
      description: 'A psychic whisper that plants doubt and madness. Deals 1d4 + intelligence psychic damage per turn for 4 rounds. Cultivate with any 3 category spells.',
      spellType: 'ACTION',
      icon: 'Psychic/Mind Strike',
      school: 'Enchantment',
      level: 1,
      typeConfig: { castTime: 1, castTimeType: 'IMMEDIATE' },
      targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 30 },
      durationConfig: { durationType: 'rounds', duration: 4, durationUnit: 'rounds' },
      resourceCost: { mana: 3, components: ['verbal'], verbalText: 'Sussurus Desidii!' },
      savingThrow: { enabled: true, attribute: 'spirit', difficulty: 13, onSuccess: 'half_damage', onFailure: 'full_damage' },
      damageConfig: {
        formula: '1d4 + intelligence',
        elementType: 'psychic',
        damageTypes: ['direct'],
        attackType: 'spell_save',
        hasDotEffect: true,
        dotConfig: { dotFormula: '1d4 + intelligence', duration: 4, tickFrequency: 'turn', isProgressiveDot: false },
          resolution: 'DICE',
      },
      specialMechanics: {
        afflictionCultivation: {
          enabled: true,
          baseAffliction: 'Whisper of Decay',
          damageType: 'psychic',
          categorySlots: 3,
          categoriesAvailable: ['Weaken', 'Torment', 'Fester', 'Decay', 'Amplify'],
          lastCategoryDeterminesFinal: true
        }
      },
      tags: ['affliction', 'base', 'psychic', 'plaguebringer', 'torment weaver'],
      flavorText: 'The whisper is quiet. The screams that follow are not.'
    },
    {
      id: 'pb_fever_dream',
      name: 'Fever Dream',
      description: 'Induce burning hallucinations. Deals 1d4 psychic and 1d4 poison damage per turn for 4 rounds. Dual-type affliction seed.',
      spellType: 'ACTION',
      icon: 'Nature/Single Leaf',
      school: 'Enchantment',
      level: 1,
      typeConfig: { castTime: 1, castTimeType: 'IMMEDIATE' },
      targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 25 },
      durationConfig: { durationType: 'rounds', duration: 4, durationUnit: 'rounds' },
      resourceCost: { mana: 4, components: ['verbal', 'somatic'], verbalText: 'Febris Somnium!', somaticText: 'Gesture at target\'s forehead' },
      savingThrow: { enabled: true, attribute: 'spirit', difficulty: 14, onSuccess: 'half_damage', onFailure: 'full_damage' },
      damageConfig: {
        formula: '1d4 + 1d4',
        elementType: 'psychic',
        secondaryElementType: 'poison',
        damageTypes: ['direct'],
        attackType: 'spell_save',
        hasDotEffect: true,
        dotConfig: { dotFormula: '1d4 psychic + 1d4 poison', duration: 4, tickFrequency: 'turn', isProgressiveDot: false },
          resolution: 'DICE',
      },
      specialMechanics: {
        afflictionCultivation: {
          enabled: true,
          baseAffliction: 'Fever Dream',
          damageType: 'psychic/poison',
          categorySlots: 3,
          categoriesAvailable: ['Weaken', 'Torment', 'Fester', 'Decay', 'Amplify'],
          lastCategoryDeterminesFinal: true
        }
      },
      tags: ['affliction', 'base', 'psychic', 'poison', 'plaguebringer'],
      flavorText: 'Sleep. Dream. Burn. Wake to nightmare.'
    },
    {
      id: 'pb_mark_of_the_pestilent',
      name: 'Mark of the Pestilent',
      description: 'Brand a target with a plague sigil. Deals 1d4 necrotic/turn and emits a 5ft aura of pestilence. Cultivate with any 3 category spells.',
      spellType: 'ACTION',
      icon: 'Poison/Poison Plague',
      school: 'Necromancy',
      level: 1,
      typeConfig: { castTime: 1, castTimeType: 'IMMEDIATE' },
      targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 30 },
      durationConfig: { durationType: 'rounds', duration: 4, durationUnit: 'rounds' },
      resourceCost: { mana: 4, components: ['verbal', 'somatic'], verbalText: 'Signum Pestis!', somaticText: 'Draw plague sigil in air' },
      savingThrow: { enabled: true, attribute: 'constitution', difficulty: 14, onSuccess: 'half_damage', onFailure: 'full_damage' },
      damageConfig: {
        formula: '1d4 + intelligence',
        elementType: 'necrotic',
        damageTypes: ['direct'],
        attackType: 'spell_save',
        hasDotEffect: true,
        dotConfig: { dotFormula: '1d4 + intelligence', duration: 4, tickFrequency: 'turn', isProgressiveDot: false },
          resolution: 'DICE',
      },
      specialMechanics: {
        afflictionCultivation: {
          enabled: true,
          baseAffliction: 'Mark of the Pestilent',
          damageType: 'necrotic',
          categorySlots: 3,
          categoriesAvailable: ['Weaken', 'Torment', 'Fester', 'Decay', 'Amplify'],
          lastCategoryDeterminesFinal: true
        },
        auraEffect: {
          radius: 5,
          damage: '1 necrotic',
          description: 'Enemies within 5ft of marked target take 1 necrotic damage per turn'
        }
      },
      tags: ['affliction', 'base', 'necrotic', 'aura', 'plaguebringer'],
      flavorText: 'The mark burns. The air rots. Pestilence claims its own.'
    },

    {
      id: 'pb_enfeebling_fog',
      name: 'Enfeebling Fog',
      description: 'Conjures a weakening fog over 20ft radius. Reduces armor by 5 (non-stacking with itself) and imposes disadvantage on ranged attacks. Advances any affliction with the WEAKEN category.',
      spellType: 'ACTION',
      icon: 'Necrotic/Corruption',
      school: 'Necromancy',
      level: 2,
      typeConfig: { castTime: 1, castTimeType: 'IMMEDIATE' },
      targetingConfig: { targetingType: 'area', rangeType: 'ranged', rangeDistance: 60, aoeType: 'sphere', aoeSize: 20 },
      durationConfig: { durationType: 'rounds', duration: 3, durationUnit: 'rounds' },
      resourceCost: { mana: 6, components: ['verbal', 'somatic'], verbalText: 'Nebula Debilis!', somaticText: 'Spread arms to create fog' },
      savingThrow: { enabled: true, attribute: 'spirit', difficulty: 14, onSuccess: 'no_effect', onFailure: 'full_effect' },
      resolution: 'AUTOMATIC',
      effects: {
        zone: { type: 'debuff_zone', radius: 20, duration: '3 rounds', description: 'Fog reduces armor by 5 and imposes disadvantage on ranged attacks' },
        debuff: { armorReduction: 5, disadvantage: 'ranged_attacks', duration: '3 rounds', description: 'Weakened defenses and accuracy' }
      },
      specialMechanics: {
        afflictionAdvancement: { enabled: true, category: 'Weaken', description: 'Advances any affliction on targets in the fog with the Weaken category' }
      },
      tags: ['weaken', 'category', 'debuff', 'area', 'plaguebringer'],
      flavorText: 'The fog saps strength and clarity. Defenses crumble.'
    },
    {
      id: 'pb_drain_vitality',
      name: 'Drain Vitality',
      description: 'Drains life from a target in melee range, reducing their max HP and granting you temporary HP. Advances any affliction with the WEAKEN category.',
      spellType: 'ACTION',
      icon: 'Necrotic/Drain Soul',
      school: 'Necromancy',
      level: 2,
      typeConfig: { castTime: 1, castTimeType: 'IMMEDIATE' },
      targetingConfig: { targetingType: 'single', rangeType: 'melee', rangeDistance: 5 },
      durationConfig: { durationType: 'rounds', duration: 1, durationUnit: 'minutes' },
      resourceCost: { mana: 7, components: ['verbal', 'somatic'], verbalText: 'Vita Exhaurio!', somaticText: 'Grasp target and drain essence' },
      savingThrow: { enabled: true, attribute: 'constitution', difficulty: 15, onSuccess: 'half_effect', onFailure: 'full_effect' },
      resolution: 'AUTOMATIC',
      debuffConfig: {
        debuffType: 'statReduction',
        effects: [{ id: 'drained_vitality', name: 'Drained Vitality', description: 'Maximum HP reduced and damage output reduced for 1 minute', statModifier: { stat: 'max_hp', magnitude: '1d10+2', magnitudeType: 'formula' } }],
        durationValue: 1, durationType: 'minutes', durationUnit: 'minutes', saveDC: 15, saveType: 'constitution', saveOutcome: 'halves', canBeDispelled: true
      },
      healingConfig: { formula: '1d10+2', healingType: 'temporaryHP', hasHotEffect: false },
      specialMechanics: {
        afflictionAdvancement: { enabled: true, category: 'Weaken', description: 'Advances any affliction on the target with the Weaken category' }
      },
      tags: ['weaken', 'category', 'drain', 'debuff', 'healing', 'plaguebringer'],
      flavorText: 'Your vitality becomes mine. Your strength fades.'
    },
    {
      id: 'pb_hallucinogenic_spores',
      name: 'Hallucinogenic Spores',
      description: 'Releases spores causing hallucinations. Target must attack an ally next turn on failed save. Advances any affliction with the TORMENT category.',
      spellType: 'ACTION',
      icon: 'Nature/Single Leaf',
      school: 'Enchantment',
      level: 2,
      typeConfig: { castTime: 1, castTimeType: 'IMMEDIATE' },
      targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 15 },
      durationConfig: { durationType: 'rounds', duration: 2, durationUnit: 'rounds' },
      resourceCost: { mana: 6, components: ['verbal', 'somatic', 'material'], verbalText: 'Sporas Dementiae!', somaticText: 'Release spores from hand', materialText: 'Fungal spores' },
      savingThrow: { enabled: true, attribute: 'spirit', difficulty: 12, onSuccess: 'disoriented_only', onFailure: 'full_effect' },
      resolution: 'AUTOMATIC',
      controlConfig: {
        controlType: 'mind_control', duration: 2, durationUnit: 'rounds', saveDC: 12, saveType: 'spirit', savingThrow: true,
        effects: [{ id: 'confused', name: 'Confused', description: 'Target attacks nearest ally on next turn', statusType: 'confused', level: 'moderate', saveType: 'constitution', saveDC: 14, duration: 1, durationUnit: 'rounds' }]
      },
      specialMechanics: {
        afflictionAdvancement: { enabled: true, category: 'Torment', description: 'Advances any affliction on the target with the Torment category' }
      },
      tags: ['torment', 'category', 'psychic', 'confusion', 'plaguebringer', 'torment weaver'],
      flavorText: 'Friend becomes foe. Reality fractures. Madness blooms.'
    },
    {
      id: 'pb_agonizing_wail',
      name: 'Agonizing Wail',
      description: 'An excruciating wail dealing psychic damage and paralyzing with fear. Advances any affliction with the TORMENT category.',
      spellType: 'ACTION',
      icon: 'Necrotic/Screaming Skull',
      school: 'Necromancy',
      level: 3,
      typeConfig: { castTime: 1, castTimeType: 'IMMEDIATE' },
      targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 25 },
      durationConfig: { durationType: 'instant' },
      resourceCost: { mana: 10, components: ['verbal'], verbalText: 'ULULATUS DOLORIS!' },
      savingThrow: { enabled: true, attribute: 'spirit', difficulty: 16, onSuccess: 'half_damage_no_paralyze', onFailure: 'full_damage_and_paralyze' },
      damageConfig: {
        formula: '3d6 + intelligence', elementType: 'psychic', damageType: 'direct', attackType: 'spell_save',
        savingThrowConfig: { enabled: true, savingThrowType: 'spirit', difficultyClass: 16, saveOutcome: 'halves', partialEffect: true, partialEffectFormula: 'damage/2' },
          resolution: 'DICE',
      },
      controlConfig: {
        controlType: 'incapacitation', duration: 1, durationUnit: 'rounds', saveDC: 16, saveType: 'spirit', savingThrow: true,
        effects: [{ id: 'paralyzed_fear', name: 'Paralyzed by Fear', description: 'Paralyzed with fear, loses next action', statusType: 'paralyzed', level: 'severe', saveType: 'charisma', saveDC: 15, duration: 1, durationUnit: 'rounds' }]
      },
      specialMechanics: {
        afflictionAdvancement: { enabled: true, category: 'Torment', description: 'Advances any affliction on the target with the Torment category' }
      },
      tags: ['torment', 'category', 'psychic', 'paralyze', 'plaguebringer', 'torment weaver'],
      flavorText: 'The wail of the damned. Terror incarnate.'
    },
    {
      id: 'pb_infectious_sores',
      name: 'Infectious Sores',
      description: 'Infects target with sores that burst if they move, spreading to anyone within 5ft. Advances any affliction with the FESTER category.',
      spellType: 'ACTION',
      icon: 'Poison/Poison Contagion',
      school: 'Necromancy',
      level: 2,
      typeConfig: { castTime: 1, castTimeType: 'IMMEDIATE' },
      targetingConfig: { targetingType: 'single', rangeType: 'melee', rangeDistance: 5 },
      durationConfig: { durationType: 'rounds', duration: 4, durationUnit: 'rounds' },
      resourceCost: { mana: 6, components: ['verbal', 'somatic'], verbalText: 'Ulcera Contagio!', somaticText: 'Touch target to inflict sores' },
      savingThrow: { enabled: true, attribute: 'constitution', difficulty: 14, onSuccess: 'no_spread', onFailure: 'full_effect' },
      damageConfig: {
        formula: '1d4 + intelligence', elementType: 'necrotic', damageType: 'direct', attackType: 'spell_save',
        hasDotEffect: true, dotConfig: { dotFormula: '1d4', duration: 4, tickFrequency: 'turn', isProgressiveDot: false },
        savingThrowConfig: { enabled: true, savingThrowType: 'constitution', difficultyClass: 14, saveOutcome: 'negates', partialEffect: false },
          resolution: 'DICE',
      },
      specialMechanics: {
        afflictionAdvancement: { enabled: true, category: 'Fester', description: 'Advances any affliction on the target with the Fester category' },
        spreadMechanic: {
          trigger: 'target_movement', range: 5, damage: '1d4 necrotic per turn for 4 turns',
          savingThrowEffect: { onSuccess: 'Sores cause 1d4 damage but do not spread', onFailure: 'Sores spread to all within 5 ft when target moves' }
        }
      },
      tags: ['fester', 'category', 'necrotic', 'contagion', 'plaguebringer', 'virulent spreader'],
      flavorText: 'The sores weep. The infection spreads.'
    },
    {
      id: 'pb_plague_of_flies',
      name: 'Plague of Flies',
      description: 'Summons a swarm of flies causing distraction, poison damage per turn, and reduced sight. Advances any affliction with the FESTER category.',
      spellType: 'ACTION',
      icon: 'Nature/Web',
      school: 'Conjuration',
      level: 2,
      typeConfig: { castTime: 1, castTimeType: 'IMMEDIATE' },
      targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 30 },
      durationConfig: { durationType: 'rounds', duration: 5, durationUnit: 'rounds' },
      resourceCost: { mana: 7, components: ['verbal', 'somatic'], verbalText: 'Musca Pestis!', somaticText: 'Summon flies with sweeping gesture' },
      resolution: 'AUTOMATIC',
      damageConfig: {
        formula: '1d4 + intelligence', elementType: 'poison', damageType: 'direct', attackType: 'automatic',
        hasDotEffect: true, dotConfig: { dotFormula: '1d4', duration: 5, tickFrequency: 'turn', isProgressiveDot: false },
          resolution: 'DICE',
      },
      debuffConfig: {
        debuffType: 'statReduction',
        effects: [{ id: 'swarm_vision_reduction', name: 'Swarm Vision Reduction', description: 'Sight range reduced by 1d20 feet', statModifier: { stat: 'sight_range', magnitude: '1d20', magnitudeType: 'formula' } }],
        durationValue: 5, durationType: 'rounds', durationUnit: 'rounds', canBeDispelled: true
      },
      specialMechanics: {
        afflictionAdvancement: { enabled: true, category: 'Fester', description: 'Advances any affliction on the target with the Fester category' }
      },
      tags: ['fester', 'category', 'poison', 'debuff', 'plaguebringer', 'virulent spreader'],
      flavorText: 'The swarm descends. Vision fails. Decay festers.'
    },
    {
      id: 'pb_necrotic_burst',
      name: 'Necrotic Burst',
      description: 'Burst of necrotic energy that permanently reduces max HP. Advances any affliction with the DECAY category.',
      spellType: 'ACTION',
      icon: 'Necrotic/Necrotic Death',
      school: 'Necromancy',
      level: 3,
      typeConfig: { castTime: 1, castTimeType: 'IMMEDIATE' },
      targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 10 },
      durationConfig: { durationType: 'instant' },
      resourceCost: { mana: 10, components: ['verbal', 'somatic'], verbalText: 'Necrosis Eruptio!', somaticText: 'Release burst of necrotic energy' },
      savingThrow: { enabled: true, attribute: 'constitution', difficulty: 17, onSuccess: 'reduced_effect', onFailure: 'full_effect' },
      damageConfig: {
        formula: '3d6 + intelligence', elementType: 'necrotic', damageType: 'direct', attackType: 'spell_save',
        savingThrowConfig: { enabled: true, savingThrowType: 'constitution', difficultyClass: 17, saveOutcome: 'halves', partialEffect: true, partialEffectFormula: 'damage/2' },
        criticalConfig: { critType: 'effect', critEffects: ['permanent_decay'] },
          resolution: 'DICE',
      },
      debuffConfig: {
        debuffType: 'statReduction',
        effects: [{ id: 'permanent_decay', name: 'Permanent Decay', description: 'Permanently reduces max HP by 2d10', statModifier: { stat: 'max_hp', magnitude: '2d10', magnitudeType: 'formula', permanent: true } }],
        durationValue: 0, durationType: 'permanent', durationUnit: 'permanent', canBeDispelled: false
      },
      specialMechanics: {
        afflictionAdvancement: { enabled: true, category: 'Decay', description: 'Advances any affliction on the target with the Decay category' }
      },
      tags: ['decay', 'category', 'necrotic', 'permanent', 'plaguebringer', 'decay harbinger'],
      flavorText: 'Flesh rots. Life force diminishes. Decay is permanent.'
    },
    {
      id: 'pb_wither_touch',
      name: 'Wither Touch',
      description: 'A touch that withers, dealing necrotic damage and reducing healing received. Advances any affliction with the DECAY category.',
      spellType: 'ACTION',
      icon: 'Necrotic/Drain Soul',
      school: 'Necromancy',
      level: 3,
      typeConfig: { castTime: 1, castTimeType: 'IMMEDIATE' },
      targetingConfig: { targetingType: 'single', rangeType: 'melee', rangeDistance: 5 },
      durationConfig: { durationType: 'instant' },
      resourceCost: { mana: 9, components: ['verbal', 'somatic'], verbalText: 'Tactus Marcescens!', somaticText: 'Touch target with withering hand' },
      savingThrow: { enabled: true, attribute: 'constitution', difficulty: 16, onSuccess: 'reduced_effect', onFailure: 'full_effect' },
      damageConfig: { formula: '4d4 + intelligence', elementType: 'necrotic', damageType: 'direct', attackType: 'spell_save' },
      effects: {
        damage: { instant: { amount: '4d4 + INT', type: 'necrotic', description: 'Immediate necrotic damage' } },
        debuff: { healingReduction: '1d8', duration: '5 rounds', description: 'Healing received is reduced by 1d8 per heal' },
          resolution: 'DICE',
      },
      specialMechanics: {
        afflictionAdvancement: { enabled: true, category: 'Decay', description: 'Advances any affliction on the target with the Decay category' }
      },
      tags: ['decay', 'category', 'necrotic', 'anti healing', 'plaguebringer', 'decay harbinger'],
      flavorText: 'The touch of death. Healing fails.'
    },
    {
      id: 'pb_dark_rejuvenation',
      name: 'Dark Rejuvenation',
      description: 'Converts healing on a target into necrotic damage. Advances any affliction with the DECAY category.',
      spellType: 'ACTION',
      icon: 'Necrotic/Ritual',
      school: 'Necromancy',
      level: 3,
      typeConfig: { castTime: 1, castTimeType: 'IMMEDIATE' },
      targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 20 },
      durationConfig: { durationType: 'rounds', duration: 3, durationUnit: 'rounds' },
      resourceCost: { mana: 10, components: ['verbal', 'somatic'], verbalText: 'Sanatio Inversa!', somaticText: 'Twist healing energy into harm' },
      savingThrow: { enabled: true, attribute: 'spirit', difficulty: 15, onSuccess: 'reduced_effect', onFailure: 'full_effect' },
      resolution: 'AUTOMATIC',
      effects: { curse: { type: 'healing_inversion', duration: '3 rounds', description: 'All healing the target receives from any source (spells, potions, abilities, regeneration) becomes necrotic damage instead' } },
      specialMechanics: {
        afflictionAdvancement: { enabled: true, category: 'Decay', description: 'Advances any affliction on the target with the Decay category' },
        healingInversion: { conversion: 'full', damageType: 'necrotic', description: 'All healing the target receives from any source — spells, potions, abilities, and regeneration — becomes necrotic damage instead. Self-healing, ally healing, and passive regeneration are all affected.' }
      },
      tags: ['decay', 'category', 'curse', 'anti healing', 'plaguebringer', 'decay harbinger'],
      flavorText: 'Healing becomes harm. Life becomes death.'
    },
    {
      id: 'pb_sufferings_echo',
      name: "Suffering's Echo",
      description: 'Doubles the damage of all existing afflictions on target. Disorients for 1 turn. Advances any affliction with the AMPLIFY category.',
      spellType: 'ACTION',
      icon: 'Psychic/Psionic Strike',
      school: 'Necromancy',
      level: 3,
      typeConfig: { castTime: 1, castTimeType: 'IMMEDIATE' },
      targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 30, requiresAffliction: true },
      durationConfig: { durationType: 'instant' },
      resourceCost: { mana: 9, components: ['verbal', 'somatic'], verbalText: 'Dolor Duplicatus!', somaticText: 'Clench fist to amplify pain' },
      savingThrow: { enabled: true, attribute: 'constitution', difficulty: 16, onSuccess: 'half_amplification', onFailure: 'full_amplification' },
      resolution: 'AUTOMATIC',
      debuffConfig: {
        debuffType: 'statReduction',
        effects: [{ id: 'amplified_pain', name: 'Amplified Pain', description: 'Doubles damage of all existing afflictions and causes disorientation', statModifier: { stat: 'attack_rolls', magnitude: 1, magnitudeType: 'disadvantage' } }],
        durationValue: 1, durationType: 'rounds', durationUnit: 'rounds', saveDC: 16, saveType: 'constitution', saveOutcome: 'halves', canBeDispelled: true
      },
      specialMechanics: {
        afflictionAdvancement: { enabled: true, category: 'Amplify', description: 'Advances any affliction on the target with the Amplify category' },
        requiresAffliction: { enabled: true, description: 'Target must have at least one active affliction' }
      },
      tags: ['amplify', 'category', 'amplification', 'plaguebringer'],
      flavorText: 'Pain echoes. Suffering multiplies.'
    },
    {
      id: 'pb_pain_magnification',
      name: 'Pain Magnification',
      description: 'Triples all affliction damage for 1 turn. Advances any affliction with the AMPLIFY category.',
      spellType: 'ACTION',
      icon: 'Psychic/Mind Strike',
      school: 'Necromancy',
      level: 4,
      typeConfig: { castTime: 1, castTimeType: 'IMMEDIATE' },
      targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 30, requiresAffliction: true },
      durationConfig: { durationType: 'rounds', duration: 1, durationUnit: 'rounds' },
      resourceCost: { mana: 14, components: ['verbal', 'somatic'], verbalText: 'Dolor Triplicatus!', somaticText: 'Focus energy on target' },
      savingThrow: { enabled: true, attribute: 'constitution', difficulty: 16, onSuccess: 'double_instead', onFailure: 'triple' },
      resolution: 'AUTOMATIC',
      debuffConfig: {
        debuffType: 'statReduction',
        effects: [{ id: 'triple_pain', name: 'Triple Pain', description: 'Triples damage of all affliction effects', statModifier: { stat: 'affliction_damage', magnitude: 3, magnitudeType: 'multiplier' } }],
        durationValue: 1, durationType: 'rounds', durationUnit: 'rounds', saveDC: 16, saveType: 'constitution', saveOutcome: 'halves', canBeDispelled: true
      },
      specialMechanics: {
        afflictionAdvancement: { enabled: true, category: 'Amplify', description: 'Advances any affliction on the target with the Amplify category' },
        requiresAffliction: { enabled: true, description: 'Target must have at least one active affliction' }
      },
      tags: ['amplify', 'category', 'amplification', 'plaguebringer'],
      flavorText: 'Pain magnified beyond endurance.'
    },
    {
      id: 'pb_essence_corruption',
      name: 'Essence Corruption',
      description: 'Corrupts target, causing them to emit a necrotic damage aura that harms their allies. Advances any affliction with the WEAKEN category.',
      spellType: 'ACTION',
      icon: 'Void/Consumed by Void',
      school: 'Necromancy',
      level: 3,
      typeConfig: { castTime: 1, castTimeType: 'IMMEDIATE' },
      targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 15 },
      durationConfig: { durationType: 'rounds', duration: 3, durationUnit: 'rounds' },
      resourceCost: { mana: 9, components: ['verbal', 'somatic'], verbalText: 'Essentia Corruptio!', somaticText: "Corrupt target's essence" },
      savingThrow: { enabled: true, attribute: 'spirit', difficulty: 15, onSuccess: 'reduced_aura', onFailure: 'full_aura' },
      damageConfig: { formula: '3d6 + intelligence', elementType: 'necrotic', damageType: 'direct', attackType: 'automatic' },
          resolution: 'DICE',
      effects: { aura: { damage: '1d10', damageType: 'necrotic', radius: 10, targets: 'allies_of_target', duration: '3 rounds', description: 'Target emits harmful aura to their allies' } },
      specialMechanics: {
        afflictionAdvancement: { enabled: true, category: 'Weaken', description: 'Advances any affliction on the target with the Weaken category' }
      },
      tags: ['weaken', 'category', 'aura', 'necrotic', 'plaguebringer'],
      flavorText: 'Ally becomes enemy. Corruption spreads.'
    },
    {
      id: 'pb_affliction_mark',
      name: 'Affliction Mark',
      description: 'Mark a target, making them vulnerable to plague effects and reducing Spirit by 2 for 3 rounds. Advances any affliction with the WEAKEN category.',
      spellType: 'ACTION',
      icon: 'Frost/Frost Touch',
      school: 'Necromancy',
      level: 1,
      typeConfig: { castTime: 1, castTimeType: 'IMMEDIATE' },
      targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 30 },
      durationConfig: { durationType: 'rounds', duration: 3, durationUnit: 'rounds' },
      resourceCost: { mana: 3, components: ['verbal', 'somatic'], verbalText: 'Signum Morbi!', somaticText: 'Press palm toward target' },
      savingThrow: { enabled: true, attribute: 'spirit', difficulty: 12, onSuccess: 'no_effect', onFailure: 'full_effect' },
      resolution: 'AUTOMATIC',
      debuffConfig: {
        debuffType: 'statReduction',
        effects: [{ id: 'affliction_mark', name: 'Affliction Mark', description: 'Marked target has -2 Spirit and is vulnerable to plague effects for 3 rounds', statModifier: { stat: 'spirit', magnitude: -2, magnitudeType: 'flat' } }],
        durationValue: 3, durationType: 'rounds', durationUnit: 'rounds', saveDC: 12, saveType: 'spirit', saveOutcome: 'negates', canBeDispelled: true
      },
      specialMechanics: {
        afflictionAdvancement: { enabled: true, category: 'Weaken', description: 'Advances any affliction on the target with the Weaken category' }
      },
      tags: ['weaken', 'category', 'debuff', 'mark', 'plaguebringer'],
      flavorText: 'The mark sears the flesh. The plague finds its way in.'
    },

    {
      id: 'pb_plague_burst',
      name: 'Plague Burst',
      description: 'Harvest an affliction from a target. Deals base 4d8 poison damage PLUS bonus damage equal to the affliction\'s stage × 2d8. Stage 3 afflictions explode in 10ft radius. Stage 1 afflictions deal base only. Consumes a maximum of 1 affliction per cast.',
      spellType: 'ACTION',
      icon: 'Poison/Poison Plague',
      school: 'Necromancy',
      level: 5,
      typeConfig: { castTime: 1, castTimeType: 'IMMEDIATE' },
      targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 40 },
      durationConfig: { durationType: 'instant' },
      resourceCost: { mana: 18, components: ['verbal', 'somatic'], verbalText: 'Pestis Eruptio!', somaticText: 'Thrust palm forward to detonate affliction' },
      savingThrow: { enabled: true, attribute: 'constitution', difficulty: 16, onSuccess: 'half_damage', onFailure: 'full_damage' },
      damageConfig: {
        formula: '4d8 + (stage × 2d8)',
        elementType: 'poison',
        damageTypes: ['direct'],
        attackType: 'spell_save',
        savingThrowConfig: { enabled: true, savingThrowType: 'constitution', difficultyClass: 16, saveOutcome: 'halves', partialEffect: true, partialEffectFormula: 'damage/2' },
        cultivationScaling: {
          stage1: '4d8 (base only)',
          stage2: '4d8 + 2d8 = 6d8',
          stage3: '4d8 + 4d8 = 8d8 + 10ft explosion'
        },
          resolution: 'DICE',
      },
      specialMechanics: {
        cultivationScaling: {
          enabled: true,
          description: 'Damage scales with affliction stage. Stage 3 afflictions explode in AoE.',
          stageMultiplier: '2d8 per stage above 0',
          stage3Bonus: '10ft radius explosion, spread Seed to all hit'
        },
        harvestMechanic: {
          enabled: true,
          description: 'Consumes the target affliction. Higher stage = dramatically more damage. Max 1 affliction consumed per cast.'
        }
      },
      tags: ['damage', 'poison', 'harvest', 'cultivation scaling', 'plaguebringer'],
      flavorText: 'The plague erupts. The harvest is reaped in rot.'
    },
    {
      id: 'pb_mass_affliction',
      name: 'Mass Affliction',
      description: 'Apply a base affliction to all enemies in 20ft radius, dealing 6d6 poison damage and starting affliction cultivation. Each afflicted enemy adds +5 Virulence.',
      spellType: 'ACTION',
      icon: 'Poison/Poison Contagion',
      school: 'Necromancy',
      level: 5,
      typeConfig: { castTime: 1, castTimeType: 'IMMEDIATE' },
      targetingConfig: { targetingType: 'area', rangeType: 'ranged', rangeDistance: 40, aoeType: 'sphere', aoeSize: 20 },
      durationConfig: { durationType: 'rounds', duration: 4, durationUnit: 'rounds' },
      resourceCost: { mana: 20, components: ['verbal', 'somatic'], verbalText: 'Pestis Multitudo!', somaticText: 'Sweep arms outward to spread plague' },
      savingThrow: { enabled: true, attribute: 'constitution', difficulty: 16, onSuccess: 'half_damage', onFailure: 'full_damage' },
      damageConfig: {
        formula: '6d6',
        elementType: 'poison',
        damageTypes: ['area'],
        attackType: 'spell_save',
        hasDotEffect: true,
        dotConfig: { dotFormula: '1d4 poison', duration: 4, tickFrequency: 'turn', isProgressiveDot: false },
        savingThrowConfig: { enabled: true, savingThrowType: 'constitution', difficultyClass: 16, saveOutcome: 'halves', partialEffect: true, partialEffectFormula: 'damage/2' },
          resolution: 'DICE',
      },
      specialMechanics: {
        afflictionCultivation: {
          enabled: true,
          baseAffliction: 'Mass Affliction',
          damageType: 'poison',
          categorySlots: 3,
          categoriesAvailable: ['Weaken', 'Torment', 'Fester', 'Decay', 'Amplify'],
          lastCategoryDeterminesFinal: true
        },
        virulenceScaling: { enabled: true, description: 'Each enemy afflicted adds +5 Virulence', perTargetBonus: 5 }
      },
      tags: ['damage', 'poison', 'aoe', 'affliction', 'cultivation scaling', 'plaguebringer'],
      flavorText: 'The field is seeded. The garden spreads.'
    },
    {
      id: 'pb_pandemic',
      name: 'Pandemic',
      description: 'All Stage 2+ afflictions spread to 1 additional target each within 15ft. Spread damage scales with Virulence. Stage 3 afflictions spread to 2 targets.',
      spellType: 'ACTION',
      icon: 'Poison/Poison Contagion',
      school: 'Necromancy',
      level: 6,
      typeConfig: { castTime: 1, castTimeType: 'IMMEDIATE' },
      targetingConfig: { targetingType: 'self', rangeType: 'self_centered' },
      durationConfig: { durationType: 'instant' },
      resourceCost: { mana: 22, components: ['verbal', 'somatic'], verbalText: 'Pandemium!', somaticText: 'Spread arms wide, releasing contagion' },
      damageConfig: {
        formula: '1d6 per spread',
        elementType: 'poison',
        damageTypes: ['area'],
        attackType: 'automatic',
          resolution: 'DICE',
      },
      specialMechanics: {
        cultivationScaling: {
          enabled: true,
          description: 'Stage 2 afflictions spread to 1 target. Stage 3 spread to 2 targets.',
          stage2Spread: 1, stage3Spread: 2, spreadRange: 15
        },
        virulenceScaling: { enabled: true, description: '+1d4 spread damage per Virulence threshold reached', sproutingBonus: '+1d4', bloomingBonus: '+2d4', peakBonus: '+3d4' }
      },
      tags: ['damage', 'spread', 'cultivation scaling', 'plaguebringer'],
      flavorText: 'One plague becomes many. Many become an epidemic.'
    },
    {
      id: 'pb_decay_field',
      name: 'Decay Field',
      description: 'Create a field of decay (20ft) for 4 rounds. Deals 3d8 necrotic/round. Enemies with active afflictions take +1d8 per affliction stage.',
      spellType: 'STATE',
      icon: 'Necrotic/Necrotic Death',
      school: 'Necromancy',
      level: 6,
      typeConfig: { castTime: 1, castTimeType: 'IMMEDIATE' },
      targetingConfig: { targetingType: 'area', rangeType: 'ranged', rangeDistance: 40, aoeType: 'sphere', aoeSize: 20 },
      durationConfig: { durationType: 'rounds', duration: 4, durationUnit: 'rounds' },
      resourceCost: { mana: 23, components: ['verbal', 'somatic'], verbalText: 'Campum Putredinis!', somaticText: 'Press palms to ground to create decay zone' },
      resolution: 'AUTOMATIC',
      damageConfig: {
        formula: '3d8 + (affliction stages × 1d8)',
        elementType: 'necrotic',
        damageTypes: ['area'],
        attackType: 'automatic',
        hasDotEffect: true,
        dotConfig: { dotFormula: '3d8 + (affliction stages × 1d8)', duration: 4, tickFrequency: 'turn', isProgressiveDot: false },
          resolution: 'DICE',
      },
      specialMechanics: {
        cultivationScaling: { enabled: true, description: '+1d8 damage per affliction stage on each enemy in the zone' }
      },
      tags: ['damage', 'necrotic', 'zone', 'cultivation scaling', 'plaguebringer'],
      flavorText: 'The earth rots beneath their feet. Nothing grows here anymore.'
    },
    {
      id: 'pb_gardens_wrath',
      name: "Garden's Wrath",
      description: 'Every active affliction across ALL targets deals its damage simultaneously in one devastating tick. Requires 3+ active afflictions.',
      spellType: 'ACTION',
      icon: 'Poison/Poison Plague',
      school: 'Necromancy',
      level: 7,
      typeConfig: { castTime: 1, castTimeType: 'IMMEDIATE' },
      targetingConfig: { targetingType: 'self', rangeType: 'self_centered', aoeType: 'sphere', aoeSize: 60 },
      durationConfig: { durationType: 'instant' },
      resourceCost: { mana: 26, components: ['verbal', 'somatic'], verbalText: 'Ira Horti!', somaticText: 'Raise both fists and clench to trigger all afflictions' },
      resolution: 'AUTOMATIC',
      damageConfig: {
        formula: 'All affliction damage × current multiplier',
        elementType: 'varies',
        damageTypes: ['area'],
        attackType: 'automatic',
        cultivationScaling: {
          description: 'Each active affliction deals its full DoT damage immediately',
          stage1Bonus: 'Stage 1 afflictions deal ×1.5 damage',
          stage2Bonus: 'Stage 2 afflictions deal ×2 damage',
          stage3Bonus: 'Stage 3 afflictions deal ×3 damage'
        },
          resolution: 'DICE',
      },
      specialMechanics: {
        requiresAfflictions: { enabled: true, minimumAfflictions: 3, description: 'Requires at least 3 active afflictions across all targets' },
        cultivationScaling: { enabled: true, description: 'Total damage = sum of all affliction DoTs × stage multipliers.' }
      },
      tags: ['damage', 'ultimate', 'cultivation scaling', 'plaguebringer'],
      flavorText: 'The garden blooms all at once. Every flower is death.'
    },
    {
      id: 'pb_mind_plague',
      name: 'Mind Plague',
      description: 'Infect minds of all enemies in 25ft, dealing 8d8 psychic damage. Enemies with active afflictions take +2d8 per affliction stage. Confused 2 rounds.',
      spellType: 'ACTION',
      icon: 'Psychic/Mind Control',
      school: 'Enchantment',
      level: 7,
      typeConfig: { castTime: 1, castTimeType: 'IMMEDIATE' },
      targetingConfig: { targetingType: 'area', rangeType: 'ranged', rangeDistance: 50, aoeType: 'sphere', aoeSize: 25 },
      durationConfig: { durationType: 'rounds', duration: 2, durationUnit: 'rounds' },
      resourceCost: { mana: 27, components: ['verbal', 'somatic'], verbalText: 'Mens Pestis!', somaticText: 'Touch temple and project psychic plague' },
      savingThrow: { enabled: true, attribute: 'spirit', difficulty: 18, onSuccess: 'half_damage_no_confusion', onFailure: 'full_damage_and_confusion' },
      damageConfig: {
        formula: '8d8 + (affliction stages × 2d8)',
        elementType: 'psychic',
        damageTypes: ['area'],
        attackType: 'spell_save',
        savingThrowConfig: { enabled: true, savingThrowType: 'spirit', difficultyClass: 18, saveOutcome: 'halves', partialEffect: true, partialEffectFormula: 'damage/2' },
          resolution: 'DICE',
      },
      controlConfig: {
        controlType: 'mind_control', duration: 2, durationUnit: 'rounds', saveDC: 18, saveType: 'spirit', savingThrow: true,
        effects: [{ id: 'confused', name: 'Confused', description: '50% chance to attack ally, 50% chance to do nothing for 2 rounds', statusType: 'confused', level: 'severe', saveType: 'constitution', saveDC: 17, duration: 2, durationUnit: 'rounds' }]
      },
      specialMechanics: {
        cultivationScaling: { enabled: true, description: '+2d8 psychic damage per affliction stage on each target' }
      },
      tags: ['damage', 'psychic', 'control', 'confusion', 'cultivation scaling', 'plaguebringer'],
      flavorText: 'The mind rots first. The body follows.'
    },
    {
      id: 'pb_plague_incarnate',
      name: 'Plague Incarnate',
      description: 'Transform into living plague for 5 rounds. Melee attacks apply base afflictions. Enemies within 15ft save or contract disease. Each new affliction adds +2 Virulence.',
      spellType: 'ACTION',
      icon: 'Poison/Poison Plague',
      school: 'Necromancy',
      level: 8,
      typeConfig: { castTime: 1, castTimeType: 'IMMEDIATE' },
      targetingConfig: { targetingType: 'self', rangeType: 'self' },
      durationConfig: { durationType: 'rounds', duration: 5, durationUnit: 'rounds' },
      resourceCost: { mana: 32, components: ['verbal', 'somatic'], verbalText: 'Incarnatio Pestis!', somaticText: 'Clasp hands to chest and transform' },
      transformationConfig: {
        transformationType: 'elemental', targetType: 'self', duration: 5, durationUnit: 'rounds', power: 'major', newForm: 'Plague Incarnate',
        description: 'Become a living vessel of disease and decay.',
        grantedAbilities: [
          { id: 'plague_stats', name: 'Plague Enhancement', description: '+5 Intelligence, +5 Constitution' },
          { id: 'plague_touch', name: 'Plague Touch', description: 'Melee attacks apply a random base affliction Seed to targets' },
          { id: 'contagion_aura', name: 'Contagion Aura', description: 'Enemies within 15ft save (DC 16) or contract random Seed affliction each turn' },
          { id: 'plague_resist', name: 'Disease Immunity', description: 'Immune to poison and disease effects' },
          { id: 'virulence_surge', name: 'Virulence Surge', description: 'Each new affliction applied during transformation adds +2 Virulence' }
        ]
      },
      specialMechanics: {},
      tags: ['transformation', 'buff', 'ultimate', 'cultivation scaling', 'plaguebringer'],
      flavorText: 'You are no longer merely a gardener. You ARE the garden.'
    },
    {
      id: 'pb_epidemic',
      name: 'Epidemic',
      description: 'Start an epidemic chain dealing increasing damage. Base: 8d6 poison. +2d6 per active affliction on the chain target. Chains to 8 enemies within 20ft.',
      spellType: 'ACTION',
      icon: 'Poison/Poison Contagion',
      school: 'Necromancy',
      level: 8,
      typeConfig: { castTime: 1, castTimeType: 'IMMEDIATE' },
      targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 50 },
      durationConfig: { durationType: 'instant' },
      resourceCost: { mana: 30, components: ['verbal', 'somatic'], verbalText: 'Epidemia!', somaticText: 'Point at primary target, then sweep to chain' },
      savingThrow: { enabled: true, attribute: 'constitution', difficulty: 17, onSuccess: 'half_damage', onFailure: 'full_damage' },
      damageConfig: {
        formula: '8d6 + (active afflictions on target × 2d6)',
        elementType: 'poison',
        damageTypes: ['direct'],
        attackType: 'spell_save',
        cultivationScaling: { description: '+2d6 per active affliction already on each chain target' },
        savingThrowConfig: { enabled: true, savingThrowType: 'constitution', difficultyClass: 17, saveOutcome: 'halves', partialEffect: true, partialEffectFormula: 'damage/2' },
          resolution: 'DICE',
      },
      specialMechanics: {
        chainMechanic: { enabled: true, maxTargets: 8, chainRange: 20, description: 'Chains to up to 8 enemies within 20ft of each previous target' },
        cultivationScaling: { enabled: true, description: '+2d6 per active affliction already on each chain target' }
      },
      tags: ['damage', 'poison', 'spreading', 'cultivation scaling', 'plaguebringer'],
      flavorText: 'One cough. Eight graves.'
    },
    {
      id: 'pb_black_death',
      name: 'Black Death',
      description: 'The ultimate plague. Targets below 30% HP WITH an active Stage 2+ affliction die instantly. Targets with Stage 0-1 afflictions or above 30% HP take 12d10 poison damage instead.',
      spellType: 'ACTION',
      icon: 'Necrotic/Necrotic Death',
      school: 'Necromancy',
      level: 9,
      typeConfig: { castTime: 1, castTimeType: 'IMMEDIATE' },
      targetingConfig: { targetingType: 'area', rangeType: 'ranged', rangeDistance: 60, aoeType: 'sphere', aoeSize: 50 },
      durationConfig: { durationType: 'instant' },
      resourceCost: { mana: 36, components: ['verbal', 'somatic'], verbalText: 'Mors Nigra!', somaticText: 'Raise both arms and speak the plague word' },
      savingThrow: { enabled: true, attribute: 'constitution', difficulty: 20, onSuccess: 'half_damage', onFailure: 'full_damage_or_execute' },
      damageConfig: {
        formula: '12d10 (or instant kill)',
        elementType: 'poison',
        damageTypes: ['area'],
        attackType: 'spell_save',
        cultivationScaling: {
          executeThreshold: '30% HP + Stage 2+ affliction = instant death',
          noAffliction: 'Full 12d10 damage',
          lowStageAffliction: 'Full 12d10 damage + applies random Seed'
        },
        savingThrowConfig: { enabled: true, savingThrowType: 'constitution', difficultyClass: 20, saveOutcome: 'halves', partialEffect: true, partialEffectFormula: 'damage/2' },
          resolution: 'DICE',
      },
      specialMechanics: {
        cultivationScaling: {
          enabled: true,
          description: 'Requires Stage 2+ affliction on target for execute. No affliction = raw damage only. The plague must be CULTIVATED before it can kill.'
        }
      },
      tags: ['damage', 'poison', 'execute', 'ultimate', 'cultivation scaling', 'plaguebringer'],
      flavorText: 'The Black Death does not negotiate. It does not hesitate. It simply is.'
    },
    {
      id: 'pb_necrotic_eruption',
      name: 'Necrotic Eruption',
      description: 'Consume ALL active afflictions across ALL targets (max 8). Each consumed affliction deals 4d8 necrotic in 30ft radius around its host. Total damage = affliction count × 4d8.',
      spellType: 'ACTION',
      icon: 'Necrotic/Necrotic Death',
      school: 'Necromancy',
      level: 9,
      typeConfig: { castTime: 1, castTimeType: 'IMMEDIATE' },
      targetingConfig: { targetingType: 'self', rangeType: 'self_centered', aoeType: 'sphere', aoeSize: 60 },
      durationConfig: { durationType: 'instant' },
      resourceCost: { mana: 34, components: ['verbal', 'somatic'], verbalText: 'Eruptio Necrotica!', somaticText: 'Thrust both palms upward to detonate all afflictions' },
      resolution: 'AUTOMATIC',
      damageConfig: {
        formula: 'Active Affliction Count × 4d8 (max 8)',
        elementType: 'necrotic',
        damageTypes: ['area'],
        attackType: 'automatic',
        cultivationScaling: {
          description: 'Each active affliction is consumed and detonates for 4d8 necrotic (max 8 afflictions consumed). Stage 3 afflictions deal 6d8 instead. The ultimate harvest — burn the entire garden.'
        },
          resolution: 'DICE',
      },
      specialMechanics: {
        cultivationScaling: { enabled: true, description: 'Stage 3 afflictions explode for 6d8 instead of 4d8. Consumes ALL afflictions up to 8 — the nuclear option.' },
        harvestMechanic: { enabled: true, description: 'Consumes all active afflictions (max 8). Each detonates around its host target in 30ft radius.' }
      },
      tags: ['damage', 'necrotic', 'consume', 'ultimate', 'cultivation scaling', 'plaguebringer'],
      flavorText: 'Every garden must end. This one ends in fire and rot.'
    },
    {
      id: 'pb_plague_god',
      name: 'Plague God',
      description: 'Ascend to become the Plague God for 4 rounds. All afflictions deal +50% damage. Melee attacks apply Seeds. Immune to poison/necrotic. When it ends: 3d10 necrotic + 2 exhaustion. Your garden collapses — but it was glorious.',
      spellType: 'ACTION',
      icon: 'Poison/Poison Contagion',
      school: 'Necromancy',
      level: 10,
      typeConfig: { castTime: 1, castTimeType: 'IMMEDIATE' },
      targetingConfig: { targetingType: 'self', rangeType: 'self' },
      durationConfig: { durationType: 'rounds', duration: 4, durationUnit: 'rounds' },
      resourceCost: { mana: 40, components: ['verbal', 'somatic'], verbalText: 'Deus Pestis!', somaticText: 'Spread arms wide and ascend' },
      transformationConfig: {
        transformationType: 'elemental', targetType: 'self', duration: 4, durationUnit: 'rounds', power: 'major', newForm: 'Plague Lord',
        description: 'Become a lord of pestilence and decay.',
        grantedAbilities: [
          { id: 'lord_stats', name: 'Pestilence Enhancement', description: '+8 Intelligence, +8 Constitution, +6 Spirit' },
          { id: 'divine_plague', name: 'Divine Plague', description: 'All afflictions deal +50% damage' },
          { id: 'death_touch', name: 'Death Touch', description: 'Melee attacks apply random Stage 2 afflictions' },
          { id: 'plague_immunity', name: 'Plague Immunity', description: 'Immune to poison, necrotic, and disease effects' },
          { id: 'virulence_lock', name: 'Virulence Lock', description: 'Virulence locked at 100 (Peak Harvest) for duration' },
          { id: 'plague_exhaustion', name: 'Decay (On End)', description: 'Take 3d10 necrotic damage and gain 2 levels of exhaustion when transformation ends' }
        ]
      },
      specialMechanics: {},
      tags: ['transformation', 'ultimate', 'god form', 'cultivation scaling', 'plaguebringer'],
      flavorText: 'Mortal gardeners tend their plots. You tend the world.'
    },
    {
      id: 'pb_ultimate_affliction',
      name: 'Ultimate Affliction',
      description: 'Apply the ultimate affliction combining all categories. Deals 15d10 immediate + 5d10/turn for 6 rounds. -50% healing, -4 all stats, spreading contagion. Requires 5+ active afflictions to cast.',
      spellType: 'ACTION',
      icon: 'Poison/Poison Plague',
      school: 'Necromancy',
      level: 10,
      typeConfig: { castTime: 1, castTimeType: 'IMMEDIATE' },
      targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 60 },
      durationConfig: { durationType: 'rounds', duration: 6, durationUnit: 'rounds' },
      resourceCost: { mana: 36, components: ['verbal', 'somatic'], verbalText: 'Summa Pestis!', somaticText: 'Draw all five category sigils in the air and unleash' },
      savingThrow: { enabled: true, attribute: 'constitution', difficulty: 22, onSuccess: 'half_damage', onFailure: 'full_damage' },
      damageConfig: {
        formula: '15d10',
        elementType: 'poison',
        damageTypes: ['direct'],
        attackType: 'spell_save',
        hasDotEffect: true,
        dotConfig: { dotFormula: '5d10', duration: 6, tickFrequency: 'turn', isProgressiveDot: false },
        savingThrowConfig: { enabled: true, savingThrowType: 'constitution', difficultyClass: 22, saveOutcome: 'halves', partialEffect: true, partialEffectFormula: 'damage/2' },
          resolution: 'DICE',
      },
      debuffConfig: {
        debuffType: 'statusEffect',
        effects: [{ id: 'ultimate_affliction', name: 'Ultimate Affliction', description: 'Target suffers all categories simultaneously — 5d10 damage/round, -50% healing, -4 all stats, spreading contagion for 6 rounds', statModifier: [{ stat: 'healing_received', value: -50, magnitudeType: 'percentage' }, { stat: 'all_stats', value: -4 }] }],
        durationValue: 6, durationType: 'rounds', durationUnit: 'rounds', saveDC: 22, saveType: 'constitution', saveOutcome: 'halves', canBeDispelled: true
      },
      specialMechanics: {
        requiresAfflictions: { enabled: true, minimumAfflictions: 5, description: 'Requires at least 5 active afflictions across all targets — you must cultivate before unleashing' }
      },
      tags: ['damage', 'debuff', 'ultimate', 'affliction', 'cultivation scaling', 'plaguebringer'],
      flavorText: 'All five categories. One affliction. Total ruin.'
    }
  ]
};

export default PLAGUEBRINGER_DATA;
