/**
 * Arcanoneer Class Data
 * 
 * Complete class information for the Arcanoneer - a master of elemental sphere combination
 * inspired by Magicka's dynamic spell crafting system.
 */

export const ARCANONEER_DATA = {
  id: 'arcanoneer',
  name: 'Arcanoneer',
  icon: 'fas fa-atom',
  imageIcon: '/assets/icons/classes/arcanoneer.png',
  role: 'Damage/Utility',
  damageTypes: ['arcane', 'holy', 'shadow', 'fire', 'frost', 'nature', 'healing', 'chaos', 'force', 'lightning', 'radiant', 'necrotic'],

  // Overview section
  overview: {
    title: 'The Arcanoneer',
    subtitle: 'Master of Elemental Sphere Combination',

    quickOverview: {
      title: 'Quick Overview',
      content: `**What You Need to Know**: You are an arcane chemist. Every turn, you roll 4d8 to generate random elemental spheres — tiny orbs of raw magic in 8 flavors (Arcane, Holy, Shadow, Fire, Ice, Nature, Healing, Chaos). You combine two spheres to cast spells from a **Combination Matrix** that you always know. Think of it like mixing chemicals: Fire + Ice always produces Steam. Fire + Fire always produces Flame Burst. **You never memorize spells — you combine ingredients.**

**But here's the twist**: As you level up, you learn **Recipes** — enhanced versions of matrix combinations that add powerful effects. Anyone can combine Fire + Ice for basic Steam damage. But a Recipe like *Steam Burst* adds a blinding cone effect. The matrix is your floor. Recipes are your ceiling.

**Core Loop**: Roll 4d8 → Get spheres → Bank or spend → Choose an **Action** (Attack, Defend, Buff, Area, or Trap) → Pick 2 spheres to combine → If you've learned a **Recipe** for that combo, cast it instead for its mana cost and enhanced effects

**How Actions and Recipes Work Together**: When you combine spheres, you use the base **Action** system (pick a shape — Attack, Defend, Buff, Area, or Trap — and your spheres fill in the damage type and minor effect). If you've learned a **Recipe** that matches your sphere combination, you may cast the Recipe instead — it overrides the base action with a pre-defined, more powerful effect at its own mana cost. You choose: base action for flexibility, or recipe for raw power.

**Resource**: Elemental Spheres (random each turn, bankable during combat, lost when combat ends) + Mana

**Three Power Tiers**:
- **2-Sphere Combos** (always available): Your bread and butter. 36 possible combinations, all defined in the matrix. 5 mana base (varies by Action type: 4-7 mana).
- **3-Sphere Recipes** (learned, Level 6+): First power spike. Scaling damage dice, persistent effects, unique mechanics. 20-25 mana.
- **4-Sphere Recipes** (learned, Level 8+): Devastating ultimates. Require banking spheres across turns. 25-36 mana.

**Best For**: Players who love improvisation, combo systems, and turning chaos into strategy`
    },

    description: `The Arcanoneer doesn't memorize spells. The Arcanoneer *mixes* them.

Every Arcanoneer carries an instinctive knowledge of the **Combination Matrix** — the 36 fundamental reactions that occur when two elemental spheres collide. Fire + Ice = Steam. Shadow + Healing = Drain Life. Holy + Holy = Radiance. These combinations are as natural as chemistry: predictable, repeatable, and always available.

But raw combination is only the beginning. Through study and practice, Arcanoneers learn **Recipes** — refined formulas that supercharge specific combinations. A novice combining Fire + Ice gets basic Steam: some damage, some mist. A master who has learned the *Steam Burst* recipe gets a pressurized cone of superheated vapor that blinds and scorches everything in its path. Same ingredients. Dramatically different results.

The Arcanoneer's true power emerges at higher levels, when they unlock **3-sphere and 4-sphere Recipes** — complex combinations that produce effects no two-sphere reaction can match. These require patience, banking spheres across multiple turns, and careful planning. But when the moment arrives and you unleash *Elemental Maelstrom* with four banked spheres of Arcane, Fire, Ice, and Nature... the battlefield reshapes itself around your will.`,
    
    roleplayIdentity: {
      title: 'Roleplay Identity',
      content: `Arcanoneers are arcane chemists — part scientist, part artist, part pyromaniac with a clipboard. They see the eight fundamental elements as reagents in an infinite laboratory, and the Combination Matrix as their periodic table. Every roll of the dice is a new experiment. Every combat is a chance to discover something the textbooks missed.

In roleplay, Arcanoneers carry worn notebooks filled with combination formulas, scribble corrections in the margins of their Recipe cards, and argue with other spellcasters about whether Fire + Shadow should be called "Hellfire" or "Umbral Ignition" (it's Hellfire, and they will die on this hill).

Common Arcanoneer archetypes:
- **The Arcane Chemist**: Treats magic like a lab experiment. Carries a notebook. Takes notes during combat.
- **The Field Engineer**: Builds magical devices on the fly. Pragmatic, tactical, always has a backup plan.
- **The Chaos Theorist**: Leans into the randomness. Treats bad rolls as "unexpected data." Terrifyingly cheerful.
- **The Elemental Gourmand**: Obsessed with trying every combination. Has opinions about which 2-sphere combo is the most "elegant."`
    },
    
    combatRole: {
      title: 'Combat Role',
      content: `**Primary Role**: Adaptive damage dealer and utility caster

**The Arcanoneer's Promise**: You will always have an answer. Not necessarily the *best* answer — that depends on what the dice give you — but always *an* answer. 36 matrix combinations cover every damage type, every targeting pattern, and both damage and healing. You are never caught completely helpless.

**How You Fight**:
1. **Roll your spheres** (4d8, or 5d8 for Entropy Weavers)
2. **Read your hand** — What combos are available? Do you have a Recipe for any of them?
3. **Decide**: Cast now with what you have, or bank spheres for a bigger play next turn?
4. **Execute** — Select your spheres, choose your combo (or Recipe), pay the mana, watch the fireworks

**Strengths**:
- Can produce ANY damage type (8 elements = massive enemy weakness coverage)
- Dual damage types on mixed combos (Fire+Ice hits both fire-weak AND ice-weak enemies)
- Built-in healing and support options (Healing+Healing, Healing+Holy, etc.)
- Chaos combos provide wild swing potential (high risk, high reward)
- Scales with game knowledge — the more combos and recipes you know, the deadlier you become

**Weaknesses**:
- RNG-dependent — bad rolls mean suboptimal turns
- 2-sphere base damage is modest (1d8 + INT/4) — you need Recipes or multi-sphere combos for big numbers. Recipes scale: 2d8 + INT/3 at level 3-4, 3d8 + INT/2 at level 5.
- Complex decision-making every turn (analysis paralysis is real)
- Sphere banking requires patience — turns spent saving are turns spent not casting`
    },
    
    playstyle: {
      title: 'Playstyle',
      content: `**The Moment-to-Moment**:

Every turn begins the same way: you roll 4d8 and watch your spheres appear. Then the puzzle begins.

**Turn 1 — The Hand You're Dealt**

You roll: Fire, Fire, Ice, Healing. Your mind races through the matrix:
- Fire + Fire = *Flame Burst* (single target fire damage)
- Fire + Ice = *Steam* (cone of mixed damage + blind)
- Fire + Healing = *Cauterize* (heal an ally with fire)
- Ice + Healing = *Frost Mend* (heal + frost armor buff)

Do you have Recipes for any of these? If you've learned *Steam Burst*, then Fire + Ice suddenly adds a blinding cone effect. If you've learned *Firestorm*, then Fire + Fire adds a massive AoE burning vortex.

**Turn 2 — Banking for Power**

You banked all 4 spheres from Turn 1. Now you roll Arcane, Shadow, Nature, Chaos. You have 8 spheres total. Suddenly you can:
- Cast a 2-sphere combo AND still have 6 spheres left
- Start building toward a 3-sphere Recipe (need 1 more turn of banking)
- Cast multiple 2-sphere combos if you have the action points

**The Core Tension**: Spend now for immediate impact, or bank for devastating multi-sphere Recipes later? There is no wrong answer — only the answer that wins this particular fight.

**Where Mastery Lives**:
- Knowing the 36 matrix combos by heart (or at least the ones relevant to your spec)
- Recognizing when your rolled spheres match a Recipe you've learned
- Managing your sphere bank like a hand of cards — planning two turns ahead
- Understanding which Chaos combos are worth the gamble`
    },

    immersiveCombatExample: {
      title: 'Combat Example: The Ambush at Grimhollow Bridge',
      content: `**The Setup**: Your party is crossing a stone bridge over a ravine when three bandits drop from the trees above. A fourth — their leader — stands at the far end, chanting. Your fighter charges forward. Your cleric holds the line. You stand at the center, fingers already twitching toward the elemental currents.

**You are a Level 4 Arcanoneer** with 34 mana (10 + INT×2). You regenerate 4 mana per turn. You've learned Shadow Embrace (your one Level 4 Recipe) and carry three Level 1-2 Recipes: Spark Bolt, Healing Light, and Steam Burst.

**Turn 1 — The Opening Reaction** *(2 AP available, 34 mana)*

*You reach into the aether and pull. The dice tumble...*

**Roll 4d8**: [4, 4, 5, 7] → Fire, Fire, Ice, Healing

*Two spheres of crackling flame materialize in your left hand, pale and hungry. A shard of enchanted ice forms in your right, humming with cold. A soft golden glow pulses at your sternum — healing energy, patient and warm.*

**Your Mind Races**: Three bandits, clustered together on the bridge. You don't have a Recipe for any of these sphere pairs — but the **Combination Matrix** has you covered.

Fire + Ice = **Steam**. A cone of superheated vapor. Perfect for clustered enemies in a narrow space. Using the **Area** action (7 mana), this becomes a 10ft radius AoE instead of single-target.

*You smash the fire and ice spheres together. They don't combine so much as *argue* — the fire screams, the ice hisses, and between them a roaring column of pressurized steam erupts, scouring the three bandits with alternating waves of heat and cold.*

**Result**: Cast **Steam** via Area action (Fire + Ice). 1d6 + INT/4 fire+frost damage to all three bandits (10ft radius). **Cost: 7 mana. Remaining: 27 mana. AP: 1 remaining.** You bank the Fire and Healing spheres.

**Turn 2 — Reading the Battlefield** *(2 AP available, 31 mana after regen)*

*The bandit leader finishes his chant. Dark energy swirls around his blade. The fighter is engaged — he can't reach the caster in time. It's down to you.*

**Roll 4d8**: [1, 3, 6, 8] → Arcane, Shadow, Nature, Chaos

*New spheres blink into existence: a sphere of pure violet force, a writhing mass of shadow, crackling nature energy alive with lightning and thorn, and a chaos sphere that flickers through every color of the spectrum.*

**Your Banked Spheres**: Fire, Healing (from Turn 1)
**Total Available**: Fire, Healing, Arcane, Shadow, Nature, Chaos — 6 spheres

**The Decision**: You could spend Arcane + Shadow for **Void Bolt** via Attack action (5 mana) — force + necrotic, barrier-piercing. But the bandit leader is *channeling something*, and you have Shadow Embrace ready...

Problem: you only have ONE Shadow sphere. You need another. And you don't want to waste AP on a weak base combo when you're one sphere away from a Recipe.

*You bank everything. Six spheres wait in your aura like loaded bullets. The bandit leader grins, dark energy building.*

**Result**: No cast. **Cost: 0 mana. Remaining: 31 mana. AP: 2 unused (wasted).**

**Turn 3 — The Recipe Unleashed** *(2 AP available, 35 mana after regen)*

*The dark energy crests. You feel it building — something nasty. No more waiting.*

**Roll 4d8**: [3, 3, 5, 2] → Shadow, Shadow, Ice, Holy

*Two shadow spheres materialize at once, dark and hungry. The dice have answered your prayer.*

**Your Total Spheres**: Fire, Healing, Arcane, Shadow, Nature, Chaos, Shadow, Shadow, Ice, Holy — 10 spheres.

*Your hand goes to the Shadow + Shadow combination. The matrix calls this **Dark Bolt**. But you don't stop at the matrix. You reach deeper — into the Recipe.*

*"Umbra Amplexus."*

*The two shadow spheres don't fly. They *unfold* — tendrils of living darkness that wrap around the bandit leader's arms, his blade, his throat. The necrotic energy drains the color from his skin. His dark chant chokes off into a gurgle. His muscles weaken as the shadow leeches his strength.*

**Result**: Cast **Shadow Embrace** (Recipe-enhanced Shadow + Shadow). 2d8 + INT/3 necrotic + 1d6 necrotic DoT for 2 rounds + STR reduced by 2 for 2 rounds. **Cost: 14 mana. Remaining: 21 mana. AP: 1 remaining.** His spell is interrupted.

*The bandit leader staggers. His dark blade clatters to the stones. Your fighter finishes him with a clean strike.*

With 1 AP remaining, you spend Arcane + Ice = **Crystal Shard** via Attack (5 mana) on a wounded bandit for extra damage.

**Result**: Cast **Crystal Shard** (1d8 + INT/4 force+frost, armor-piercing). **Cost: 5 mana. Remaining: 16 mana. AP: 0.**

**Turn 4 — When the Dice Don't Cooperate** *(2 AP available, 20 mana after regen)*

*Only one bandit remains, wounded and cornered. Time to finish this.*

**Roll 4d8**: [7, 7, 7, 7] → Healing, Healing, Healing, Healing

*Four soft golden spheres materialize. No fire. No shadow. No arcane. Just healing — four times over. The aether has a sense of humor.*

You have banked spheres (Fire, Healing, Arcane, Nature, Chaos, Shadow, Ice, Holy) from previous turns, so you're not helpless. But none of your banked spheres form a combo you haven't already used.

**Smart Play**: Cast Healing Light (Healing + Healing) via Buff action on the fighter, who took hits from the bandits. **Cost: 4 mana.** Then use Arcane + Chaos = **Wild Magic** via Attack action (5 mana) on the last bandit and roll on the chaos table — fortune favors the bold.

**Result**: Fighter healed. Wild Magic resolves (roll 1d4 — let's say result 2: Manaburst, 1d8+INT/4 chaos damage + recover 1d4 mana). **Cost: 9 mana. Remaining: 11 mana.**

**The Lesson**: The Arcanoneer isn't about having the perfect spell. It's about reading what the dice give you, knowing your matrix, recognizing when your banked spheres match a Recipe, and having the patience to wait for the right moment. Bad rolls happen — that's when you heal, buff, or bank for next turn. Every turn is a hand of cards. The master knows which ones to hold and which ones to play.`
    }
  },
  
  primaryStat: 'intelligence',
  secondaryStat: 'spirit',

  // Character Creation
  characterCreation: {
    title: 'Creating Your Arcanoneer',
    subtitle: 'The Elemental Chemist',
    description: `The Arcanoneer is a class that rewards preparation and pattern recognition. You don't memorize spell lists — you learn a matrix of elemental combinations and collect Recipes that enhance specific pairings. Your power comes from reading what the dice give you and making the most of it.`,
    steps: [
      {
        step: 1,
        title: 'Prioritize Intelligence',
        content: 'Intelligence drives your combo damage (1d8 + INT/4 at base). Spirit drives your healing combos. Decide: do you want to be a damage-focused combo caster, or a hybrid who can also heal? Most Arcanoneers prioritize INT and treat healing as a situational tool.'
      },
      {
        step: 2,
        title: 'Choose Your Specialization',
        content: 'Your specialization defines HOW you interact with spheres. **Prism Mage** for consistent, focused damage. **Entropy Weaver** for chaotic high-risk/high-reward swings. **Sphere Architect** for precise control and planning. This choice affects your entire playstyle.'
      },
      {
        step: 3,
        title: 'Pick Your First 3 Recipes',
        content: 'Choose from 5 Level 1 spells: Spark Bolt (arcane damage, pierces armor), Frost Touch (frost damage + slow + fragile), Healing Light (ally healing), Arcane Missile (force damage, cannot miss), Nature Vine (nature damage + restraint). Recommend: 1 damage, 1 healing, 1 utility.'
      },
      {
        step: 4,
        title: 'Learn the d8 Element Table',
        content: 'You will roll 4d8 every single turn. Memorize or screenshot the sphere generation table (1=Arcane, 2=Holy, 3=Shadow, 4=Fire, 5=Ice, 6=Nature, 7=Healing, 8=Chaos). Speed of recognition is your most important skill.'
      },
      {
        step: 5,
        title: 'Understand the 5 Actions',
        content: 'Every 2-sphere combo must be cast through one of 5 Actions: Attack (single target), Defend (barrier), Buff (weapon enchant), Area (AoE), or Trap (placed zone). Each has a different mana cost (4-7) and effect shape. The Action determines HOW your combo delivers its effect.'
      }
    ],
    startingEquipment: {
      weapon: 'Arcane Focus (dagger, orb, or staff — your choice)',
      armor: 'Light armor (no spell failure chance)',
      items: [
        'Spell notebook with Combination Matrix printed on the inside cover',
        'Set of 4d8 dice (one set in each of 4 colors for easy reading)',
        '8 colored glass tokens (one per element) for tracking banked spheres',
        'Pencil and eraser for noting learned Recipes',
        'Traveler\'s kit (bedroll, rations, rope, torches)'
      ],
      gold: 15
    }
  },

  // Resource System
  resourceSystem: {
    title: 'Sphere Generation & Elemental Combination',
    subtitle: 'Dynamic Spell Crafting System',

    description: `The Arcanoneer's power comes from generating random elemental spheres each turn and combining them to create spells. This system is inspired by Magicka's element combination mechanics, where different element pairings create unique magical effects. Unlike traditional mana-based casters, your limiting factor isn't just mana—it's which spheres you have available and how creatively you can combine them.`,

    resourceBarExplanation: {
      title: 'Understanding Your Resource Bar',
      content: `**What You See**: Your Arcanoneer resource bar displays your currently banked elemental spheres as colored orbs. Unlike other classes with a single resource pool, you're managing up to 8 different "currencies" simultaneously.

**Visual Representation**:
- **Arcane Spheres**: Purple orbs with swirling energy
- **Holy Spheres**: Golden orbs radiating light
- **Shadow Spheres**: Dark orbs with wisps of darkness
- **Fire Spheres**: Red-orange orbs with flickering flames
- **Ice Spheres**: Pale blue orbs with frost crystals
- **Nature Spheres**: Green orbs crackling with storm energy
- **Healing Spheres**: Soft yellow orbs with gentle glow
- **Chaos Spheres**: Multicolored orbs that shift unpredictably

**How It Changes Each Turn**:
- **Turn Start**: 4 new spheres appear (from your 4d8 roll)
- **When Casting**: Spent spheres disappear from the bar
- **When Banking**: Unused spheres remain visible, accumulating over turns (max **12 banked**)
- **Overflow**: If rolling would exceed 12, you choose which new spheres to keep. Excess are lost.
- **Combat End**: All spheres vanish — fresh start each fight

**Reading the Bar at a Glance**: The bar is your hand of cards. A bar full of Fire spheres means pure-element combos. A diverse mix means utility and versatility. The skill is in recognizing, at a glance, which matrix combos and Recipes your current bank supports. With 36 matrix combinations and your learned Recipes, this pattern recognition becomes second nature — and deeply satisfying when you spot a combo others would miss.`
    },

    mechanics: {
      title: 'How It Works',
      sections: [
        {
          type: 'step',
          stepNumber: 1,
          title: 'Roll Spheres',
          subtitle: 'Start of Turn',
          content: `Roll **4d8** (5d8 for Entropy Weavers). Each die produces one elemental sphere.`
        },
        {
          type: 'step',
          stepNumber: 2,
          title: 'Bank or Spend',
          subtitle: 'Your Choice',
          content: `Spheres persist until spent or combat ends (max **12 banked**). Bank for later or spend now.`
        },
        {
          type: 'step',
          stepNumber: 3,
          title: 'Pick Action + Elements',
          subtitle: 'Combine & Cast',
          content: `Choose an **action** (what shape) and your **spheres** (what element). Done.`
        }
      ],
      actionTable: {
        title: 'Your 5 Actions',
        subtitle: 'Pick one. Your spheres fill in the damage types and effects.',
        actions: [
          { name: 'Attack', icon: 'crosshairs', spheres: '2', mana: '5', range: '30ft', target: 'One enemy', damage: '1d8 + INT/4', note: 'Your default. Cantrip-level damage + combo\'s minor effect.' },
          { name: 'Defend', icon: 'shield-alt', spheres: '2', mana: '6', range: 'Self/Ally 30ft', target: 'One creature', damage: 'Absorbs level HP', note: 'Barrier + resistance to combo\'s damage types for 1 round.' },
          { name: 'Buff', icon: 'magic', spheres: '2', mana: '4', range: 'Touch', target: 'One weapon', damage: '+1d6 next hit', note: 'Weapon gains combo\'s element. Works on allies too.' },
          { name: 'Area', icon: 'burst', spheres: '2', mana: '7', range: '30ft center', target: '10ft radius', damage: '1d6 + INT/4 each', note: 'Spread thin — less damage but hits a group.' },
          { name: 'Trap', icon: 'draw-polygon', spheres: '2', mana: '6', range: '30ft surface', target: '5ft zone', damage: '1d8 + INT/4', note: 'Hidden trigger. Lasts 1 minute.' }
        ]
      },
      chaosEffectsTable: {
        title: 'Chaos Effects Table (Player Rolls d20)',
        subtitle: 'The default resolution for Chaos combos. When a specific Chaos combo has its own random effect table (marked with ★ in the Combination Matrix), use that table instead of rolling here. If a Chaos combo has no specific table, roll on this d20 table.',
        headers: ['d20', 'Effect'],
        rows: [
          ['1', 'Fizzle — spell fails. Spheres spent, nothing happens.'],
          ['2-3', 'Minor Backlash — you take 1d4 chaos damage. Spell still resolves.'],
          ['4-5', 'Redirect — hits a random target within range (ally or enemy).'],
          ['6-7', 'Elemental Surge — +1d4 damage of a random element (roll d8).'],
          ['8-9', 'Lingering — minor effect lasts 1 extra round.'],
          ['10-11', 'Normal — resolves as expected. No bonus, no penalty.'],
          ['12-13', 'Double Effect — minor effect triggers twice (two saves, two pushes, etc.)'],
          ['14-15', 'Mana Feedback — recover 1d4 mana after resolving.'],
          ['16-17', 'Bouncing — Attack bounces to 1 extra target for half. Area gains +5ft radius.'],
          ['18-19', 'Empowered — damage dice explode (reroll and add max-value dice).'],
          ['20', 'Chaos Perfection — choose ANY effect from this table.']
        ]
      },
      singleSphereFallbacks: {
        title: 'Single-Sphere Fallbacks',
        subtitle: 'Leftover sphere? Do something small with it.',
        abilities: [
          { name: 'Fling', cost: '1 Sphere + 2 Mana', type: 'Attack', description: '1d4 damage of that element. 30ft. A poke.' },
          { name: 'Ward', cost: '1 Sphere + 3 Mana', type: 'Reaction', description: 'Grant resistance to that element for 1 round.' },
          { name: 'Siphon', cost: '1 Sphere', type: 'Resource', description: 'Destroy sphere, recover 2 mana.' },
          { name: 'Purge', cost: '2 Any + 4 Mana', type: 'Utility', description: 'Remove 1 debuff from self/ally. Touch range.' }
        ]
      },
      baseVsRecipes: {
        title: 'Why Learn Recipes?',
        subtitle: 'Base combos are cantrips. Recipes are real spells.',
        baselineCan: [
          'Deal 1d8 + INT/4 per combo (only INT scales — die never grows)',
          'Apply minor 1-round effects (blind, slow, push)',
          'Choose any action type for any combo',
          'Cover every damage type'
        ],
        baselineCannot: [
          'DoT, stat reduction, persistent buffs, teleportation',
          'Scale beyond 1d8 + INT/4',
          'Anything lasting more than 1 round'
        ],
        recipeExamples: [
          { level: 'Lv 2', name: 'Steam Burst', upgrade: 'Fire+Ice → 20ft cone (base Attack is single-target)' },
          { level: 'Lv 3', name: 'Arcane Detonation', upgrade: 'Arcane+Arcane → 10ft AoE + disorient (2d8 + INT/3)' },
          { level: 'Lv 4', name: 'Firestorm', upgrade: 'Fire+Fire → 15ft AoE + 1d6 fire DoT 2 rounds (2d8 + INT/3)' },
          { level: 'Lv 5', name: 'Elemental Blast', upgrade: 'Fire+Ice → 10ft AoE (3d8 + INT/2)' },
          { level: 'Lv 6', name: 'Glacial Blessing', upgrade: 'Ice+Healing+Holy → 8d6 heal + armor + resist' },
          { level: 'Lv 9', name: 'Primal Cataclysm', upgrade: 'All 8 elements → 18d6 damage (base Attack is 1d8)' }
        ]
      },
      comboTiers: {
        title: 'Combination Tiers',
        tiers: [
          { name: '2-Sphere Matrix', sphereCost: '2', manaCost: '4-7', available: 'Always', description: 'Your cantrips. Pick an action, pick your elements, done. If you\'ve learned a Recipe for that combo, spend its mana cost instead for the upgraded version.', highlight: true },
          { name: '3-Sphere Recipe', sphereCost: '3', manaCost: '20-25', available: 'Level 6+', description: 'Recipe-only. Real spells — scaling dice, persistent effects, unique mechanics.' },
          { name: '4-Sphere Recipe', sphereCost: '4', manaCost: '25-36', available: 'Level 8+', description: 'The big guns. Bank across turns. Battlefield-shaping power.' }
        ]
      },
    manaWarning: 'Spheres + Mana. You need **both**. A full bank is useless without mana.',
    manaRegeneration: {
      title: 'Mana Regeneration',
      content: `You have a **Mana Pool** equal to 10 + (Intelligence × 2). At the start of each turn, you regenerate mana equal to 2 + (Intelligence / 4, rounded down). Mana does NOT regenerate outside combat. Between fights, you must rest (short rest = 50% mana restored, long rest = full mana). The Siphon fallback (destroy 1 sphere → recover 2 mana) exists specifically for mana-starved turns.`
    },
    actionPointsRule: {
        title: 'Action Points',
        content: `You gain **2 Action Points (AP)** per turn. Most 2-sphere combos cost 1 AP. 3-sphere Recipes cost 1-2 AP. 4-sphere Recipes cost 2-3 AP. If you have the AP and the spheres, you can cast multiple combos in one turn.`
      },
      fortuneRollRule: {
        title: 'Fortune Rolls',
        content: `Some talents reference a **Fortune Roll** — roll 1d6. Odd (1, 3, 5) = **Red** (beneficial trigger). Even (2, 4, 6) = **Black** (no effect). Fortune rolls are free and do not cost an action.`
      },
    },

    manaCostTable: {
      title: 'Quick Cost Reference',
      headers: ['Action', 'Spheres', 'Mana'],
      rows: [
        ['Attack', '2', '5'],
        ['Defend', '2', '6'],
        ['Buff', '2', '4'],
        ['Area', '2', '7'],
        ['Trap', '2', '6'],
        ['Fling (1 sphere)', '1', '2'],
        ['Ward (1 sphere)', '1', '3'],
        ['Purge', '2 any', '4'],
        ['Siphon', '1', '0 (gain 2)'],
        ['Recipe (2-sphere, Lv 1-2)', '2', '4-7'],
        ['Recipe (2-sphere, Lv 3-4)', '2', '10-14'],
        ['Recipe (2-sphere, Lv 5)', '2', '18'],
        ['Recipe (3-sphere)', '3', '20-25'],
        ['Recipe (4-sphere)', '4', '25-36']
      ],
      footnote: 'Max 12 banked spheres. All spheres lost when combat ends. You gain 2 Action Points per turn.'
    },
    
    sphereGenerationTable: {
      title: 'Sphere Generation (Roll 4d8)',
      headers: ['d8 Roll', 'Element', 'Theme', 'Primary Effects'],
      rows: [
        ['1', 'Arcane', 'Raw Magic', 'Force damage, disorientation, magical effects'],
        ['2', 'Holy', 'Divine Light', 'Holy damage, healing, stunning, protection'],
        ['3', 'Shadow', 'Darkness/Necrotic', 'Shadow damage, curses, life drain, debuffs'],
        ['4', 'Fire', 'Flames', 'Fire damage, burning, ignition, explosions'],
        ['5', 'Ice', 'Frost', 'Ice damage, freezing, slowing, disorientation'],
        ['6', 'Nature', 'Storm & Growth', 'Nature damage, lightning, vines, restraint, poison'],
        ['7', 'Healing', 'Life Energy', 'Healing, regeneration, buffs, cleansing'],
        ['8', 'Chaos', 'Unpredictability', 'Random effects, wild magic, variable damage']
      ]
    },
    
    strategicConsiderations: {
      title: 'Strategic Considerations',
      content: `**When to Bank Spheres**:
- You rolled elements that don't match any Recipe you've learned
- You're 1-2 turns away from a powerful 3-sphere or 4-sphere Recipe
- Combat is stable enough to invest in a future power spike
- You're fishing for specific elements to complete a combination

**When to Spend Immediately**:
- Your rolled spheres match a Recipe you've learned — use the upgrade!
- The tactical situation demands action NOW (enemy is casting, ally is dying)
- You're low on mana and can only afford cheap matrix combos
- You have more spheres than you need — spend the excess, bank the rest

**Reading Your Options**:
- **Pure combos** (Fire+Fire, Ice+Ice): Focused single-target damage. Reliable.
- **Opposing combos** (Fire+Ice, Holy+Shadow): Unique mixed effects. Steam, Twilight — these are the "chemistry" combos.
- **Healing combos** (Healing+Healing, Healing+X): Essential for party support. Never underestimate a well-timed Frost Mend or Bloom.
- **Chaos combos** (Chaos+X): Wild swings. Use them when you're desperate or when the Entropy Weaver in you wants to gamble.

**The Multi-Cast Trick**: If you have the action points, you can cast TWO 2-sphere combos in one turn. Fire+Ice for Steam on the front line, then Healing+Healing for Rejuvenation on your tank. One turn, two spells, total battlefield control. This costs 10 mana and 2 AP — expensive, but devastating when it works.

**Advanced: The Banking Mathematics**:
- You generate 4 spheres per turn (5 for Entropy Weavers)
- Your bank holds a maximum of **12 spheres** (15 for Sphere Architects)
- A 3-sphere Recipe needs 3 specific spheres — might take 2-3 turns of banking
- A 4-sphere Recipe needs 4 specific spheres — might take 3-4 turns
- **Critical insight**: While banking, you can still cast with your OTHER spheres. Bank what you need, spend what you don't.
- **Overflow rule**: If rolling would push you over your max, choose which new spheres to keep. Excess are lost.`
    },

    practicalExample: {
      title: 'Practical Decision-Making Example',
      content: `**Scenario**: You're fighting a fire elemental (resistant to fire, weak to ice) and two goblin archers.

**Turn 1 Roll**: [4, 4, 5, 7] → Fire, Fire, Ice, Healing

**Rookie Mistake**: "Fire + Fire = Flame Burst! Maximum fire damage!"
- Result: Wasted spheres on a fire-resistant enemy. Your base matrix damage (1d8 + INT/4) barely tickles it.

**Smart Play**: "Ice + Healing = **Frost Mend** on our tank. Give them a heal AND frost armor. Then bank the two Fire spheres — the goblins aren't fire-resistant."
- Result: Tank gets healed + armor buff. Fire spheres banked for next turn.

**Turn 2 Roll**: [1, 3, 6, 8] → Arcane, Shadow, Nature, Chaos

**Your Bank**: Fire, Fire (from Turn 1)
**Total Available**: Fire, Fire, Arcane, Shadow, Nature, Chaos (6 spheres)

**Decision Point**:
- **Option A**: Fire + Fire = **Flame Burst** on the goblins. Cheap (5 mana), decent damage, uses banked spheres effectively.
- **Option B**: Bank everything. Next turn, you might have the spheres for a 3-sphere Recipe.
- **Option C**: Arcane + Shadow = **Void Bolt** on the fire elemental. Force + necrotic bypasses fire resistance.

**The Right Call**: Option A on the goblins (they're the immediate threat), then Option C on the fire elemental if you have the AP and mana. You can multi-cast — spend 4 spheres, 2 spells, one turn.

**The Lesson**: Don't just cast the biggest spell. Cast the RIGHT spell for the situation. Use the matrix to exploit enemy weaknesses. Use your Recipes when they match. And never waste spheres on resistant enemies.`
    },

    playingInPerson: {
      title: 'Playing in Person',
      subtitle: 'Physical Tracking for Tabletop Play',
      content: `The Arcanoneer's sphere system translates beautifully to physical tabletop play. Here's everything you need.

**Required Materials**:
- **4d8 dice** (for sphere generation)
- **Colored tokens or glass beads** (8 colors, at least 4 of each)
- **A reference card** with the d8-to-element chart (see below)
- **A printed Combination Matrix** (see the 8×8 table below)

**Recommended Token Colors**:
- Arcane (1): Purple
- Holy (2): Gold/Yellow
- Shadow (3): Black
- Fire (4): Red
- Ice (5): Blue
- Nature (6): Green
- Healing (7): White
- Chaos (8): Rainbow/Iridescent

**Turn-by-Turn Process**:
1. Roll 4d8
2. Take colored tokens matching each die result, place in your "Sphere Bank"
3. Check: do your tokens match any matrix combo? Any learned Recipe?
4. Remove spent tokens, pay mana, resolve the spell
5. Unused tokens stay banked for next turn

---

**THE COMBINATION MATRIX (Print This)**

All 36 two-sphere base combos. Cost varies by Action type (4-7 mana; see Action Table). Fixed damage: 1d8 + INT/4.

| | Arcane | Holy | Shadow | Fire | Ice | Nature | Healing | Chaos |
|---|---|---|---|---|---|---|---|---|
| **Arcane** | Arcane Pulse | Divine Bolt | Void Bolt | Arcane Flame | Crystal Shard | Thunderstrike | Arcane Mend | Wild Magic ★ |
| **Holy** | → | Radiance | Twilight | Solar Flare | Aurora | Verdant Light | Holy Mend | Chaos Light ★ |
| **Shadow** | → | → | Dark Bolt | Hellfire | Frostbite | Blight | Drain Life | Entropy ★ |
| **Fire** | → | → | → | Flame Burst | Steam † | Wildfire | Cauterize | Chaos Flame ★ |
| **Ice** | → | → | → | → | Frost Spike | Hailstorm | Frost Mend | Glitch Ice ★ |
| **Nature** | → | → | → | → | → | Storm Surge | Bloom | Primal Chaos ★ |
| **Healing** | → | → | → | → | → | → | Rejuvenation | Fate's Gift ★ |
| **Chaos** | → | → | → | → | → | → | → | Chaos Bolt ★ |

★ = Chaos combo — each has its own specific random effect table. If no specific table applies, roll on the general Chaos Effects d20 table instead.
† = Steam is a 20ft cone (only non-single-target base combo)

**Matrix Reading Guide** (use the upper-right triangle):
- Same row + column = pure pair (e.g., Fire row + Fire column = Flame Burst)
- Mixed = cross-reference (e.g., Fire row + Ice column = Steam)
- Arrow (→) = see the mirror entry (Fire+Ice and Ice+Fire are both Steam)

**Quick Effect Reference**:

| Combo | Damage Types | Key Effect |
|---|---|---|
| Arcane Pulse | Force | Single target damage |
| Radiance | Radiant | Single target + blind |
| Dark Bolt | Necrotic | Single target damage |
| Flame Burst | Fire | Single target damage |
| Frost Spike | Frost | Single target + slow |
| Storm Surge | Nature | Single target damage |
| Rejuvenation | — | Heal single ally |
| Chaos Bolt | Chaos | ★ Random effect |
| Divine Bolt | Force, Radiant | Cannot miss |
| Void Bolt | Force, Necrotic | Barrier-piercing |
| Arcane Flame | Force, Fire | Barrier-piercing fire |
| Crystal Shard | Force, Frost | Armor-piercing |
| Thunderstrike | Force, Nature | Lightning bolt |
| Arcane Mend | Force | Heal ally |
| Wild Magic | Chaos | ★ Random effect |
| Twilight | Radiant, Necrotic | Dual damage |
| Solar Flare | Radiant, Fire | Heavy burn |
| Aurora | Radiant, Frost | Damage + slow |
| Verdant Light | Radiant, Nature | Burning vines |
| Holy Mend | — | Heal + cleanse debuff |
| Chaos Light | Chaos | ★ Random effect |
| Hellfire | Necrotic, Fire | Shadow flames |
| Frostbite | Necrotic, Frost | Rot + slow |
| Blight | Necrotic, Nature | Poison thorns |
| Drain Life | Necrotic | Damage + self-heal |
| Entropy | Chaos | ★ Random effect |
| Steam | Fire, Frost | 20ft cone + blind |
| Wildfire | Fire, Nature | Burning vines |
| Cauterize | Fire | Heal ally (fire) |
| Chaos Flame | Chaos | ★ Random effect |
| Hailstorm | Frost, Nature | 10ft AoE |
| Frost Mend | — | Heal + armor buff |
| Glitch Ice | Chaos | ★ Random effect |
| Bloom | — | Heal + regen |
| Primal Chaos | Chaos | ★ Random effect |
| Fate's Gift | Chaos | ★ Random effect |

---

**Quick Reference Card**:

\`\`\`
ARCANONEER — SPHERE GENERATION
Roll 4d8 each turn:
1 = Arcane (Purple)    5 = Ice (Blue)
2 = Holy (Gold)        6 = Nature (Green)
3 = Shadow (Black)     7 = Healing (White)
4 = Fire (Red)         8 = Chaos (Rainbow)

BASE COMBO COST: 5 mana
BASE COMBO DAMAGE: 1d8 + INT/4
RECIPE SCALING: Lv3-4 → 2d8+INT/3 | Lv5 → 3d8+INT/2
★ CHAOS COMBOS: Roll for random effect
MAX BANKED SPHERES: 12
\`\`\`

**Budget-Friendly Alternatives**:
- **No tokens?** Use different colored d6 dice as markers
- **No colored items?** Write tally marks on paper under each element name
- **Minimalist approach**: Just remember your banked spheres — the matrix becomes second nature after a few sessions

**Pro Tip for Physical Play**: Laminate the matrix table and use a dry-erase marker to circle your available combos each turn. This dramatically speeds up decision-making and helps new players learn the combinations faster.`
    }
  },

  // Specializations
  specializations: {
    title: 'Arcanoneer Specializations',
    subtitle: 'Three Paths of Elemental Mastery',

    description: `Every Arcanoneer chooses one of three specializations that define how they approach the Combination Matrix. Each spec changes how you interact with your spheres, your matrix combos, and your Recipes — creating three dramatically different playstyles from the same 36-combo foundation.`,

    specs: [
      {
        id: 'prism_mage',
        name: 'Prism Mage',
        icon: 'Fire/Fiery Bolt',
        color: '#FF4500',
        theme: 'Pure Element Mastery',

        description: `Prism Mages obsess over elemental purity. While other Arcanoneers mix and match, Prism Mages perfect the art of the pure combo — Fire+Fire, Ice+Ice, Arcane+Arcane. They can reroll unwanted spheres to fish for their preferred element, and their pure-element matrix combos hit significantly harder. If you want consistency and the satisfaction of a perfectly focused build, this is your path.`,

        playstyle: 'Pure element focus, rerolling spheres, elemental specialization, consistent damage',

        strengths: [
          'Can reroll spheres to get desired elements',
          'Pure element combos (Fire+Fire, Ice+Ice, etc.) deal +50% damage',
          'Gain resistance to your most-used element type',
          'More consistent and predictable than other specs',
          'Excellent against enemies weak to specific elements'
        ],

        weaknesses: [
          'Less versatile than other specs',
          'Struggles against enemies resistant to your favored elements',
          'Cannot leverage chaos and mixed-element synergies as well',
          'Rerolls cost 1 mana per sphere rerolled (unlimited uses)',
          'Limited by element availability'
        ],

        passiveAbilities: [
          {
            name: 'Sphere Resonance',
            tier: 'Path Passive',
            description: 'When you generate 3 or more spheres of the same element in one turn, gain 1d4 temporary mana.',
            sharedBy: 'All Arcanoneers'
          },
          {
            name: 'Elemental Purity',
            tier: 'Specialization Passive',
            description: 'You can reroll spheres to get desired elements (costs 1 mana per reroll). Pure element matrix combos (same element twice) deal 50% bonus damage. You gain resistance to the element type you\'ve used most this combat. Your focus is narrow but devastating.',
            uniqueTo: 'Prism Mage'
          }
        ],

        recommendedFor: 'Players who want consistency, elemental specialization, and predictable power'
      },

      {
        id: 'entropy_weaver',
        name: 'Entropy Weaver',
        icon: 'Void/Corrupted Eye',
        color: '#9400D3',
        theme: 'Embrace Randomness',

        description: `Entropy Weavers don't fight the chaos — they weaponize it. They roll 5d8 instead of 4d8 (one extra sphere per turn), and every Chaos combo hits twice as hard. Where other Arcanoneers see Chaos spheres as a liability, Entropy Weavers see opportunity. If you want to be the most unpredictable, volatile, and potentially devastating Arcanoneer on the field, this is your path. Just... don't stand too close to your allies.`,

        playstyle: 'High variance, chaos magic, wild magic surges, explosive unpredictability',

        strengths: [
          'Roll 5d8 for spheres instead of 4d8 (one extra sphere per turn)',
          'All Chaos combinations deal double damage',
          'Chaos sphere combos trigger Wild Magic Surge (roll on table)',
          'Can turn any sphere into Chaos (once per turn, costs 2 mana)',
          'Highest damage potential of all specs'
        ],

        weaknesses: [
          'Extremely unpredictable and unreliable',
          'Wild Magic Surges can backfire',
          'Cannot reroll or manipulate spheres',
          'Difficult to plan multi-turn strategies',
          'High risk, high reward playstyle'
        ],

        passiveAbilities: [
          {
            name: 'Sphere Resonance',
            tier: 'Path Passive',
            description: 'When you generate 3 or more spheres of the same element in one turn, gain 1d4 temporary mana.',
            sharedBy: 'All Arcanoneers'
          },
          {
            name: 'Chaos Mastery',
            tier: 'Specialization Passive',
            description: 'Roll 5d8 for sphere generation (instead of 4d8). All Chaos matrix combos deal double damage. When you use a Chaos sphere in any combination, roll on the Wild Magic Surge table for an additional random effect. Once per turn, you can convert any sphere to Chaos (costs 2 mana). Chaos is your weapon.',
            uniqueTo: 'Entropy Weaver'
          }
        ],

        recommendedFor: 'Players who enjoy high-risk gameplay, randomness, and explosive unpredictable power'
      },

      {
        id: 'sphere_architect',
        name: 'Sphere Architect',
        icon: 'Arcane/Angular Rune',
        color: '#4169E1',
        theme: 'Precise Control & Manipulation',

        description: `Sphere Architects treat the Combination Matrix like an engineering problem. They swap sphere types to guarantee the combos they want, lock spheres between turns for guaranteed elements, and reduce the cost of multi-sphere Recipes. Where Prism Mages chase purity and Entropy Weavers embrace randomness, Sphere Architects impose *control* over the chaos. If you want to always have the right combo for the right moment, this is your path.`,

        playstyle: 'Sphere manipulation, precise control, efficient banking, tactical mastery',

        strengths: [
          'Can swap any 2 spheres for different elements (once per turn, costs 3 mana)',
          'Can store up to 15 spheres (instead of the standard 12 cap)',
          'Reduce mana cost of 3-sphere Recipes by 3 (e.g., 20→17 mana)',
          'Can "lock" 1 sphere type to guarantee it next turn',
          'Most consistent and controllable spec'
        ],

        weaknesses: [
          'No damage bonuses (pure utility/control)',
          'Sphere manipulation is expensive (mana costs)',
          'Requires extensive planning and foresight',
          'Less explosive than other specs',
          'Complexity can be overwhelming'
        ],

        passiveAbilities: [
          {
            name: 'Sphere Resonance',
            tier: 'Path Passive',
            description: 'When you generate 3 or more spheres of the same element in one turn, gain 1d4 temporary mana.',
            sharedBy: 'All Arcanoneers'
          },
          {
            name: 'Runic Precision',
            tier: 'Specialization Passive',
            description: 'Once per turn, swap any 2 spheres for different element types (costs 3 mana total). 3-sphere Recipes cost 3 less mana (e.g., 20→17). You can "lock" 1 sphere type at end of turn to guarantee that element in your next roll — spend 1 banked sphere of that type; one of your next 4d8 results is automatically replaced with that element. Your sphere bank capacity is 15 instead of 12. Control the matrix, don\'t let it control you.',
            uniqueTo: 'Sphere Architect'
          }
        ],

        recommendedFor: 'Players who want precise control, tactical planning, and sphere manipulation mastery'
      }
    ]
  },

  // Elemental Combination Matrix
  // The 36 base two-sphere combinations available to ALL Arcanoneers
  combinationMatrix: {
    title: 'Elemental Combination Matrix',
    subtitle: 'The 36 Base Combinations',
    description: `Every Arcanoneer inherently knows all 36 two-sphere combinations. No memorization required — combine any two elemental spheres and you produce a predictable magical effect. This is your foundation, your fallback, your Swiss Army knife. Learned recipes enhance specific combinations with additional effects, but the base matrix ensures you are NEVER powerless.`,
    baseManaCost: 5,
    baseDamageFormula: '1d8 + intelligence/4',
    baseRange: 60,

    entries: [
      // ========================================
      // PURE PAIRS (Same Element ×2) — 8 combos
      // Focused, reliable, elementally pure
      // ========================================
      {
        id: 'arcane_arcane',
        name: 'Arcane Pulse',
        elements: ['arcane', 'arcane'],
        damageTypes: ['force'],
        targetType: 'single',
        range: 60,
        primaryEffect: 'damage',
        effectDescription: 'A concentrated bolt of pure arcane force strikes a single target.',
        flavorText: 'Raw magic condenses between your palms — a sphere of crackling violet energy that hums with barely contained power. You release it with a sharp gesture, and it streaks toward your target like a purple comet.'
      },
      {
        id: 'holy_holy',
        name: 'Radiance',
        elements: ['holy', 'holy'],
        damageTypes: ['radiant'],
        targetType: 'single',
        range: 60,
        primaryEffect: 'damage',
        secondaryEffect: 'blind',
        effectDescription: 'A beam of concentrated divine light burns a single target and briefly blinds them.',
        flavorText: 'Two golden spheres merge into a searing point of light. You direct the beam like a lance of pure sunlight, and it burns through the air with a sound like a choir hitting a single, piercing note.'
      },
      {
        id: 'shadow_shadow',
        name: 'Dark Bolt',
        elements: ['shadow', 'shadow'],
        damageTypes: ['necrotic'],
        targetType: 'single',
        range: 60,
        primaryEffect: 'damage',
        effectDescription: 'A sphere of concentrated darkness drains life force from a single target.',
        flavorText: 'The shadows around you thicken and writhe, drawn to your hands like moths to flame. You compress them into a writhing orb of pure darkness and hurl it — wherever it strikes, the light itself seems to die.'
      },
      {
        id: 'fire_fire',
        name: 'Flame Burst',
        elements: ['fire', 'fire'],
        damageTypes: ['fire'],
        targetType: 'single',
        range: 60,
        primaryEffect: 'damage',
        effectDescription: 'A concentrated ball of flame detonates against a single target.',
        flavorText: 'Fire answers fire. The two spheres spiral into each other like dueling serpents, then collapse into a single roaring sphere of flame. You hurl it with a shout, and it detonates on impact with a satisfying WHUMP.'
      },
      {
        id: 'ice_ice',
        name: 'Frost Spike',
        elements: ['ice', 'ice'],
        damageTypes: ['frost'],
        targetType: 'single',
        range: 60,
        primaryEffect: 'damage',
        secondaryEffect: 'slow',
        effectDescription: 'A jagged spike of enchanted ice pierces a single target, leaving behind numbing cold.',
        flavorText: 'Frost crystals bloom across your knuckles, growing and sharpening into a crystalline spike. The air cracks as you launch it — a shard of frozen fury that leaves frost trails in its wake.'
      },
      {
        id: 'nature_nature',
        name: 'Storm Surge',
        elements: ['nature', 'nature'],
        damageTypes: ['nature'],
        targetType: 'single',
        range: 60,
        primaryEffect: 'damage',
        effectDescription: 'A surge of nature energy — crackling lightning wrapped in grasping thorns — strikes a single target.',
        flavorText: 'The spheres crackle and spark, lightning arcing between them as thorny vines coil around your wrist. You release the surge with a thunderclap, and the target is wreathed in storm and thorn.'
      },
      {
        id: 'healing_healing',
        name: 'Rejuvenation',
        elements: ['healing', 'healing'],
        damageTypes: [],
        targetType: 'single_ally',
        range: 60,
        primaryEffect: 'healing',
        effectDescription: 'A warm pulse of restorative energy mends wounds on a single ally.',
        flavorText: 'The two healing spheres merge into a soft golden glow that pulses like a heartbeat. You guide it toward your ally with an open palm, and it sinks into their skin like sunlight through water, closing wounds and easing pain.'
      },
      {
        id: 'chaos_chaos',
        name: 'Chaos Bolt',
        elements: ['chaos', 'chaos'],
        damageTypes: ['chaos'],
        targetType: 'random',
        range: 60,
        primaryEffect: 'random',
        isChaosCombo: true,
        effectDescription: 'A wildly unstable bolt of chaos energy. Roll on this combo\'s specific effect table below (overrides the general Chaos d20 table).',
        flavorText: 'Reality hiccups. The two chaos spheres don\'t merge so much as they argue — a swirling mass of conflicting energies that can\'t decide what it wants to be. You shrug and throw it anyway.',
        randomEffects: [
          { name: 'Chaos Nova', description: 'The bolt detonates in a 15-foot radius, dealing chaos damage to all nearby enemies.', damageTypes: ['chaos'], targetType: 'aoe', aoeRadius: 15 },
          { name: 'Polymorphic Blast', description: 'The bolt transforms mid-flight, dealing a random damage type to a single target.', damageTypes: ['random'], targetType: 'single' },
          { name: 'Entropy Drain', description: 'The bolt siphons vitality from the target, dealing chaos damage and healing you for the same amount.', damageTypes: ['chaos'], targetType: 'single', selfHeal: true },
          { name: 'Wild Surge', description: 'The bolt fizzles harmlessly — then all your remaining banked spheres transform into random elements.', damageTypes: [], targetType: 'self', reshuffleSpheres: true }
        ]
      },

      // ========================================
      // ARCANE MIXED (7 combos)
      // Raw magic amplified by other elements
      // ========================================
      {
        id: 'arcane_holy',
        name: 'Divine Bolt',
        elements: ['arcane', 'holy'],
        damageTypes: ['force', 'radiant'],
        targetType: 'single',
        range: 60,
        primaryEffect: 'damage',
        effectDescription: 'A bolt of arcane-infused divine energy that cannot be dodged or blocked.',
        flavorText: 'Arcane force and holy light intertwine into a spiraling lance of white and violet. It seeks its target with unerring precision — no shield can deflect it, no armor can turn it aside.'
      },
      {
        id: 'arcane_shadow',
        name: 'Void Bolt',
        elements: ['arcane', 'shadow'],
        damageTypes: ['force', 'necrotic'],
        targetType: 'single',
        range: 60,
        primaryEffect: 'damage',
        effectDescription: 'A bolt of void energy that punches through magical barriers.',
        flavorText: 'Where arcane force meets shadow, the void is born. The spheres collapse into a point of absolute blackness ringed by purple static. It tears through the air, leaving a faint afterimage of nothing.'
      },
      {
        id: 'arcane_fire',
        name: 'Arcane Flame',
        elements: ['arcane', 'fire'],
        damageTypes: ['force', 'fire'],
        targetType: 'single',
        range: 60,
        primaryEffect: 'damage',
        effectDescription: 'A spiraling bolt of arcane fire that pierces through barriers.',
        flavorText: 'Arcane energy wraps around fire like a fist around a torch. The result burns hotter and strikes harder — a spiraling comet of force and flame that punches through obstacles.'
      },
      {
        id: 'arcane_ice',
        name: 'Crystal Shard',
        elements: ['arcane', 'ice'],
        damageTypes: ['force', 'frost'],
        targetType: 'single',
        range: 60,
        primaryEffect: 'damage',
        effectDescription: 'A razor-sharp shard of enchanted crystal that pierces armor.',
        flavorText: 'Arcane energy crystallizes the frost into a prism of unnatural sharpness — harder than steel, colder than death. It whistles through the air and shatters on impact into a spray of stinging fragments.'
      },
      {
        id: 'arcane_nature',
        name: 'Thunderstrike',
        elements: ['arcane', 'nature'],
        damageTypes: ['force', 'nature'],
        targetType: 'single',
        range: 60,
        primaryEffect: 'damage',
        effectDescription: 'A bolt of concentrated storm energy — arcane lightning that cracks with thunder.',
        flavorText: 'The arcane sphere becomes a lightning rod, drawing the nature sphere\'s storm energy into a single crackling bolt. You point, thunder peals, and a fork of white-hot lightning arcs toward your target.'
      },
      {
        id: 'arcane_healing',
        name: 'Arcane Mend',
        elements: ['arcane', 'healing'],
        damageTypes: ['force'],
        targetType: 'single_ally',
        range: 30,
        primaryEffect: 'healing',
        secondaryEffect: 'damage',
        effectDescription: 'Arcane energy accelerates the body\'s natural healing. Restores health to an ally.',
        flavorText: 'Healing energy wrapped in arcane precision — the violet glow knits flesh with surgical accuracy while the golden warmth soothes the pain. A strange warmth that tingles like static.'
      },
      {
        id: 'arcane_chaos',
        name: 'Wild Magic',
        elements: ['arcane', 'chaos'],
        damageTypes: ['chaos'],
        targetType: 'random',
        range: 60,
        primaryEffect: 'random',
        isChaosCombo: true,
        effectDescription: 'Arcane structure meets chaos unpredictability — the result is anyone\'s guess.',
        flavorText: 'You try to impose order on chaos. Chaos laughs at you. The result is... educational.',
        randomEffects: [
          { name: 'Spellmirror', description: 'A shimmering arcane shield reflects the next spell cast at you back at the caster.', damageTypes: [], targetType: 'self', reflectSpell: true },
          { name: 'Manaburst', description: 'A cascade of raw arcane energy deals chaos damage and restores 1d4 mana to you.', damageTypes: ['chaos'], targetType: 'single', manaRestore: '1d4' },
          { name: 'Dimensional Flicker', description: 'You teleport 15 feet in a random direction.', damageTypes: [], targetType: 'self', teleport: 15 },
          { name: 'Arcane Storm', description: 'Lightning arcs from you to 1d4 random targets within 30 feet, dealing force damage.', damageTypes: ['force'], targetType: 'random_aoe', maxTargets: '1d4' }
        ]
      },

      // ========================================
      // HOLY MIXED (6 combos)
      // Divine power fused with mortal elements
      // ========================================
      {
        id: 'holy_shadow',
        name: 'Twilight',
        elements: ['holy', 'shadow'],
        damageTypes: ['radiant', 'necrotic'],
        targetType: 'single',
        range: 60,
        primaryEffect: 'damage',
        effectDescription: 'Light and darkness collide, creating a bolt of twilight energy that burns with opposing forces.',
        flavorText: 'Holy gold meets shadow black, and where they clash, twilight is born — a strange, shimmering grey that burns and chills in equal measure. It should not exist. It does anyway.'
      },
      {
        id: 'holy_fire',
        name: 'Solar Flare',
        elements: ['holy', 'fire'],
        damageTypes: ['radiant', 'fire'],
        targetType: 'single',
        range: 60,
        primaryEffect: 'damage',
        effectDescription: 'A searing burst of divine fire that burns body and soul alike.',
        flavorText: 'The holy sphere ignites the fire sphere like sunlight through a magnifying glass. What emerges is not merely fire — it is judgment given form, a lance of white-hot righteousness.'
      },
      {
        id: 'holy_ice',
        name: 'Aurora',
        elements: ['holy', 'ice'],
        damageTypes: ['radiant', 'frost'],
        targetType: 'single',
        range: 60,
        primaryEffect: 'damage',
        secondaryEffect: 'slow',
        effectDescription: 'A shimmering curtain of aurora light that freezes and dazzles.',
        flavorText: 'The spheres dance together like the northern lights given physical form — ribbons of gold and blue that ripple through the air, beautiful and terrible. They wash over the target in a cascade of frozen light.'
      },
      {
        id: 'holy_nature',
        name: 'Verdant Light',
        elements: ['holy', 'nature'],
        damageTypes: ['radiant', 'nature'],
        targetType: 'single',
        range: 60,
        primaryEffect: 'damage',
        effectDescription: 'Divine light channels through nature, creating a beam of living radiance wrapped in thorny vines.',
        flavorText: 'Light becomes life becomes weapon. Golden vines erupt from the holy sphere, wrapped in crackling nature energy. They lash forward like a living whip, burning and binding.'
      },
      {
        id: 'holy_healing',
        name: 'Holy Mend',
        elements: ['holy', 'healing'],
        damageTypes: [],
        targetType: 'single_ally',
        range: 60,
        primaryEffect: 'healing',
        secondaryEffect: 'cleanse',
        effectDescription: 'A powerful surge of divine healing that also purifies one debuff or negative effect.',
        flavorText: 'Golden light and warm healing merge into a single brilliant pulse. It washes over your ally like a warm sunrise, closing wounds and burning away corruption with equal tenderness.'
      },
      {
        id: 'holy_chaos',
        name: 'Chaos Light',
        elements: ['holy', 'chaos'],
        damageTypes: ['chaos'],
        targetType: 'random',
        range: 60,
        primaryEffect: 'random',
        isChaosCombo: true,
        effectDescription: 'Divine light refracted through chaos — the result ranges from miraculous to catastrophic.',
        flavorText: 'You try to channel chaos through the lens of divinity. The result is... enlightening. Possibly literally.',
        randomEffects: [
          { name: 'Beacon of Chaos', description: 'A pillar of prismatic light erupts from the ground, dealing radiant damage to enemies and healing allies within 10 feet.', damageTypes: ['radiant'], targetType: 'aoe', aoeRadius: 10 },
          { name: 'Purify', description: 'All debuffs are removed from a random ally.', damageTypes: [], targetType: 'random_ally', cleanseAll: true },
          { name: 'Blinding Revelation', description: 'A flash of chaos light blinds all creatures within 20 feet for 1 round.', damageTypes: [], targetType: 'aoe', aoeRadius: 20, blind: true },
          { name: 'Divine Favor', description: 'A random ally gains +2 to their next attack roll or saving throw.', damageTypes: [], targetType: 'random_ally', buff: true }
        ]
      },

      // ========================================
      // SHADOW MIXED (5 combos)
      // Darkness that corrupts, drains, and decays
      // ========================================
      {
        id: 'shadow_fire',
        name: 'Hellfire',
        elements: ['shadow', 'fire'],
        damageTypes: ['necrotic', 'fire'],
        targetType: 'single',
        range: 60,
        primaryEffect: 'damage',
        effectDescription: 'Dark flames that burn the flesh and consume the soul.',
        flavorText: 'Shadow feeds fire, and fire gives shadow form. The result is something that should not burn but does — black flames that cast no light and leave frost-bitten char wherever they touch.'
      },
      {
        id: 'shadow_ice',
        name: 'Frostbite',
        elements: ['shadow', 'ice'],
        damageTypes: ['necrotic', 'frost'],
        targetType: 'single',
        range: 60,
        primaryEffect: 'damage',
        secondaryEffect: 'slow',
        effectDescription: 'A wave of unnatural cold that rots flesh while it freezes.',
        flavorText: 'Not the clean cold of winter, but the deep chill of the grave. The shadow infects the ice with something malevolent — frost that spreads like disease, blackening skin as it creeps.'
      },
      {
        id: 'shadow_nature',
        name: 'Blight',
        elements: ['shadow', 'nature'],
        damageTypes: ['necrotic', 'nature'],
        targetType: 'single',
        range: 60,
        primaryEffect: 'damage',
        secondaryEffect: 'poison',
        effectDescription: 'Thorny shadows inject necrotic poison into the target.',
        flavorText: 'Nature twisted by shadow — black thorns that grow from darkness itself, dripping with poison that rots from within. They wrap around the target and squeeze, each thorn injecting decay.'
      },
      {
        id: 'shadow_healing',
        name: 'Drain Life',
        elements: ['shadow', 'healing'],
        damageTypes: ['necrotic'],
        targetType: 'single',
        range: 60,
        primaryEffect: 'damage',
        secondaryEffect: 'self_heal',
        effectDescription: 'Siphons life force from an enemy, dealing necrotic damage and healing you for the same amount.',
        flavorText: 'The shadow sphere hungers, and the healing sphere provides the conduit. Dark tendrils reach for your enemy, and where they touch, vitality flows back through the link like water through a pipe — from them, to you.'
      },
      {
        id: 'shadow_chaos',
        name: 'Entropy',
        elements: ['shadow', 'chaos'],
        damageTypes: ['chaos'],
        targetType: 'random',
        range: 60,
        primaryEffect: 'random',
        isChaosCombo: true,
        effectDescription: 'Shadow and chaos combine into pure entropic force — decay made unpredictable.',
        flavorText: 'Entropy. The death of order. The spheres don\'t combine so much as unravel each other, producing a flickering mass of shadow and static that even you find unsettling.',
        randomEffects: [
          { name: 'Wither', description: 'A wave of decay reduces the target\'s armor by 2 for 2 rounds.', damageTypes: ['necrotic'], targetType: 'single', armorReduction: 2 },
          { name: 'Soul Rend', description: 'Deals necrotic damage and applies a random debuff to the target.', damageTypes: ['necrotic'], targetType: 'single', randomDebuff: true },
          { name: 'Shadow Step', description: 'You dissolve into shadow and reappear behind the target.', damageTypes: [], targetType: 'self', teleport: true },
          { name: 'Dark Nova', description: 'Shadow energy erupts from you in a 10-foot radius, dealing necrotic damage to all nearby creatures (including allies).', damageTypes: ['necrotic'], targetType: 'aoe', aoeRadius: 10, friendlyFire: true }
        ]
      },

      // ========================================
      // FIRE MIXED (4 combos)
      // Flame fused with other forces
      // ========================================
      {
        id: 'fire_ice',
        name: 'Steam',
        elements: ['fire', 'ice'],
        damageTypes: ['fire', 'frost'],
        targetType: 'cone',
        range: 30,
        aoeShape: 'cone',
        aoeParameters: { length: 20 },
        primaryEffect: 'damage',
        secondaryEffect: 'blind',
        effectDescription: 'A hissing cone of superheated steam that burns, freezes, and blinds.',
        flavorText: 'Fire and ice should cancel. They don\'t — they argue. The result is a screaming column of pressurized steam that hisses and spits, scouring everything in its path with alternating blasts of scalding heat and flash-freezing condensation.'
      },
      {
        id: 'fire_nature',
        name: 'Wildfire',
        elements: ['fire', 'nature'],
        damageTypes: ['fire', 'nature'],
        targetType: 'single',
        range: 60,
        primaryEffect: 'damage',
        effectDescription: 'Living flame wrapped in thorny vines — burns and constricts simultaneously.',
        flavorText: 'Fire and nature have an ancient pact: nature provides the fuel, fire provides the transformation. Vines of living flame lash outward, burning as they bind.'
      },
      {
        id: 'fire_healing',
        name: 'Cauterize',
        elements: ['fire', 'healing'],
        damageTypes: ['fire'],
        targetType: 'single_ally',
        range: 30,
        primaryEffect: 'healing',
        secondaryEffect: 'minor_damage',
        effectDescription: 'Burns a wound shut while healing energy accelerates recovery. The ally receives healing over time.',
        flavorText: 'Healing through harm — the oldest medical technique, given magical form. The fire sphere sterilizes as the healing sphere regenerates. It hurts. It also saves your life.'
      },
      {
        id: 'fire_chaos',
        name: 'Chaos Flame',
        elements: ['fire', 'chaos'],
        damageTypes: ['chaos'],
        targetType: 'random',
        range: 60,
        primaryEffect: 'random',
        isChaosCombo: true,
        effectDescription: 'Unstable fire infused with chaos — it might explode, spread, or backfire.',
        flavorText: 'Fire is already unpredictable. Adding chaos makes it... enthusiastic.',
        randomEffects: [
          { name: 'Infernal Burst', description: 'The chaos flame detonates in a 15-foot radius, dealing fire damage to all nearby enemies.', damageTypes: ['fire'], targetType: 'aoe', aoeRadius: 15 },
          { name: 'Chain Fire', description: 'The bolt bounces to 1d4 additional targets within 20 feet, dealing fire damage to each.', damageTypes: ['fire'], targetType: 'chain', maxTargets: '1d4' },
          { name: 'Fire Shield', description: 'Flames wrap around you, granting fire resistance and dealing 1d4 fire damage to melee attackers for 2 rounds.', damageTypes: ['fire'], targetType: 'self', selfBuff: true },
          { name: 'Backfire', description: 'The flame sputters and backfires, dealing fire damage to you instead.', damageTypes: ['fire'], targetType: 'self', selfDamage: true }
        ]
      },

      // ========================================
      // ICE MIXED (3 combos)
      // Frost tempered by other forces
      // ========================================
      {
        id: 'ice_nature',
        name: 'Hailstorm',
        elements: ['ice', 'nature'],
        damageTypes: ['frost', 'nature'],
        targetType: 'aoe',
        range: 60,
        aoeShape: 'circle',
        aoeParameters: { radius: 10 },
        primaryEffect: 'damage',
        effectDescription: 'A localized storm of ice, lightning, and thorny hailstones pummels a small area.',
        flavorText: 'Ice and nature conspire to create the worst weather imaginable — frozen thorns driven by howling wind, crackling with lightning. It\'s localized, at least. Small mercies.'
      },
      {
        id: 'ice_healing',
        name: 'Frost Mend',
        elements: ['ice', 'healing'],
        damageTypes: [],
        targetType: 'single_ally',
        range: 30,
        primaryEffect: 'healing',
        secondaryEffect: 'armor_buff',
        effectDescription: 'Healing energy crystallizes into a thin layer of frost armor, mending wounds and providing protection.',
        flavorText: 'The ice doesn\'t numb — it stabilizes. Healing energy flows through the frost, mending tissue while the ice hardens into a protective shell. Like a bandage made of winter.'
      },
      {
        id: 'ice_chaos',
        name: 'Glitch Ice',
        elements: ['ice', 'chaos'],
        damageTypes: ['chaos'],
        targetType: 'random',
        range: 60,
        primaryEffect: 'random',
        isChaosCombo: true,
        effectDescription: 'Ice that doesn\'t obey the rules — it might freeze, shatter, spread, or do something physics never intended.',
        flavorText: 'Frost + chaos = the temperature equivalent of a rounding error. Reality\'s thermostat breaks.',
        randomEffects: [
          { name: 'Flash Freeze', description: 'A 10-foot radius of ground becomes slippery ice. All creatures in the area must save or fall prone.', damageTypes: ['frost'], targetType: 'aoe', aoeRadius: 10, knockdown: true },
          { name: 'Ice Lance', description: 'A single-target ice attack that deals double base damage and ignores armor.', damageTypes: ['frost'], targetType: 'single', doubleDamage: true },
          { name: 'Frost Armor', description: 'You gain +2 armor and frost resistance for 2 rounds.', damageTypes: [], targetType: 'self', armorBuff: 2 },
          { name: 'Shatterstorm', description: 'Ice shards explode outward in a 15-foot radius, dealing frost damage to all creatures.', damageTypes: ['frost'], targetType: 'aoe', aoeRadius: 15 }
        ]
      },

      // ========================================
      // NATURE MIXED (2 combos)
      // Storm & growth fused with other forces
      // ========================================
      {
        id: 'nature_healing',
        name: 'Bloom',
        elements: ['nature', 'healing'],
        damageTypes: [],
        targetType: 'single_ally',
        range: 30,
        primaryEffect: 'healing',
        secondaryEffect: 'regen',
        effectDescription: 'Nature energy accelerates the body\'s natural healing, creating a bloom of restorative flowers that mend wounds over time.',
        flavorText: 'Where healing meets nature, life flourishes. Tiny luminescent flowers bloom across your ally\'s wounds, their petals knitting flesh together with gentle, unstoppable growth.'
      },
      {
        id: 'nature_chaos',
        name: 'Primal Chaos',
        elements: ['nature', 'chaos'],
        damageTypes: ['chaos'],
        targetType: 'random',
        range: 60,
        primaryEffect: 'random',
        isChaosCombo: true,
        effectDescription: 'Nature\'s order disrupted by chaos — the wild becomes unpredictable, dangerous, and wilder.',
        flavorText: 'Nature has rules. Chaos breaks them. The result is a feral, unpredictable surge of life energy that does whatever it wants.',
        randomEffects: [
          { name: 'Thornquake', description: 'Thorny vines erupt from the ground in a 15-foot radius, dealing nature damage and rooting enemies.', damageTypes: ['nature'], targetType: 'aoe', aoeRadius: 15, root: true },
          { name: 'Chain Lightning', description: 'A bolt of lightning arcs from you to 1d4 targets within 30 feet, dealing nature damage.', damageTypes: ['nature'], targetType: 'chain', maxTargets: '1d4' },
          { name: 'Poison Cloud', description: 'A cloud of noxious spores fills a 10-foot radius, dealing nature damage over 2 rounds.', damageTypes: ['nature'], targetType: 'aoe_dot', aoeRadius: 10 },
          { name: 'Overgrowth', description: 'Thick vines entangle a single target, restraining them for 1 round.', damageTypes: [], targetType: 'single', restraint: true }
        ]
      },

      // ========================================
      // HEALING MIXED (1 combo)
      // Life energy warped by chaos
      // ========================================
      {
        id: 'healing_chaos',
        name: "Fate's Gift",
        elements: ['healing', 'chaos'],
        damageTypes: ['chaos'],
        targetType: 'random',
        range: 60,
        primaryEffect: 'random',
        isChaosCombo: true,
        effectDescription: 'Healing energy warped by chaos — it might heal, harm, buff, or do all three at once.',
        flavorText: 'You offer healing to chaos. Chaos considers the offer. Then does whatever it wants.',
        randomEffects: [
          { name: "Fate's Blessing", description: 'A random ally is healed for double the base healing amount.', damageTypes: [], targetType: 'random_ally', doubleHeal: true },
          { name: 'Chaos Cure', description: 'Remove all debuffs from yourself or a random ally, but take 1d4 chaos damage.', damageTypes: ['chaos'], targetType: 'self_or_random_ally', cleanseAll: true },
          { name: 'Reversal', description: 'The healing inverts — deal necrotic damage to a random enemy equal to the base healing.', damageTypes: ['necrotic'], targetType: 'random_enemy' },
          { name: 'Wild Growth', description: 'A random ally gains regeneration (1d4 HP per round) for 3 rounds.', damageTypes: [], targetType: 'random_ally', regen: true }
        ]
      }
    ]
  },

  // Spell Pools - organized by character level
  // Maps character level to available spell IDs for learning
  spellPools: {
    1: [
      // Level 1 starting spells (pick 3)
      'arc_spark_bolt',
      'arc_frost_touch',
      'arc_healing_light',
      'arc_arcane_missile',
      'arc_nature_vine'
    ],
    2: [
      // Level 2 spells
      'arc_steam_burst',
      'arc_shadow_bolt',
      'arc_celestial_ray'
    ],
    3: [
      // Level 3 spells
      'arc_fire_bolt',
      'arc_ice_shard',
      'arc_arcane_detonation'
    ],
    4: [
      // Level 4 spells
      'arc_firestorm',
      'arc_frost_nova',
      'arc_shadow_embrace'
    ],
    5: [
      // Level 5 spells
      'arc_elemental_blast',
      'arc_divine_healing',
      'arc_chaos_bolt'
    ],
    6: [
      // Level 6 spells (3-sphere combinations)
      'arc_glacial_blessing',
      'arc_prismatic_ward',
      'arc_verdant_rejuvenation'
    ],
    7: [
      // Level 7 spells (3-4 sphere combinations)
      'arc_phase_shift',
      'arc_elemental_barrage',
      'arc_celestial_storm'
    ],
    8: [
      // Level 8 spells (4-sphere ultimates)
      'arc_harmonic_convergence',
      'arc_elemental_maelstrom',
      'arc_chaos_storm'
    ],
    9: [
      // Level 9 spells (powerful with tradeoffs)
      'arc_primal_cataclysm',
      'arc_chaos_vortex',
      'arc_arcane_synthesis'
    ],
    10: [
      // Level 10 spells (capstones)
      'arc_elemental_convergence',
      'arc_dimensional_rift',
      'arc_elemental_apotheosis'
    ]
  },

  // Spells - organized by level, properly formatted for wizard
  spells: [
    // ========================================
    // LEVEL 1 STARTING SPELLS (5 options, pick 3)
    // Basic 2-sphere combinations - weak starter spells
    // ========================================
    {
      id: 'arc_spark_bolt',
      name: 'Spark Bolt',
      description: 'Fires a bolt of pure arcane force that pierces through barriers and armor. Ignores 2 points of enemy armor.',
      level: 1,
      enhancesCombo: 'arcane_arcane',
      spellType: 'ACTION',
      icon: 'Arcane/Ebon Blaze',
      
      typeConfig: {
        school: 'arcane',
        icon: 'Arcane/Ebon Blaze',
        tags: ['arcane', 'damage', 'starter'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 60,
        targetRestrictions: []
      },

      resourceCost: {
        resourceTypes: ['mana', 'arcane_sphere'],
        resourceValues: { mana: 4, arcane_sphere: 2 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal', 'somatic'],
        verbalText: 'Arcanum Ignis!',
        somaticText: 'Extend index finger, arcane energy crackling and coalescing at the tip before launching forward'
      },

      effectTypes: ['damage'],

      damageConfig: {
        formula: '1d8 + intelligence/4',
        damageTypes: ['arcane'],
        resolution: 'DICE',
        description: 'The bolt strikes with precise arcane force, dealing direct force damage.'
      },

      cooldownConfig: {
        cooldownType: 'turn_based',
        cooldownValue: 0
      },

      tags: ['arcane', 'damage', 'starter']
    },

    {
      id: 'arc_frost_touch',
      name: 'Frost Touch',
      description: 'Channels freezing energy through your palm, dealing frost damage and slowing the target. Frozen targets take +1d4 bonus damage from the next physical attack against them.',
      level: 1,
      enhancesCombo: 'ice_ice',
      spellType: 'ACTION',
      icon: 'Frost/Frost Touch',
      
      typeConfig: {
        school: 'frost',
        icon: 'Frost/Frost Touch',
        tags: ['ice', 'damage', 'debuff', 'touch', 'starter'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'touch',
        targetRestrictions: []
      },

      resourceCost: {
        resourceTypes: ['mana', 'ice_sphere'],
        resourceValues: { mana: 4, ice_sphere: 2 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal', 'somatic'],
        verbalText: 'Glacies Contactus!',
        somaticText: 'Palm glows with blue-white frost energy, rime spreading across your hand as you reach out to touch the target'
      },

      effectTypes: ['damage', 'debuff'],

      damageConfig: {
        formula: '1d8 + intelligence/4',
        damageTypes: ['frost'],
        resolution: 'DICE',
        description: 'Flash-freezes tissue at the point of contact, causing frost damage.'
      },

      debuffConfig: {
        debuffType: 'statusEffect',
        effects: [{
          id: 'slowed',
          name: 'Frozen Limbs',
          description: 'Movement speed reduced by 10 feet for 1 round as muscles stiffen from the cold.',
          statusType: 'slow',
          level: 'minor',
          statPenalty: { stat: 'movement_speed', value: -10 },
          movementPenalty: -10
        }],
        durationValue: 1,
        durationType: 'rounds',
        durationUnit: 'rounds',
        saveDC: 12,
        saveType: 'constitution',
        saveOutcome: 'negates'
      },

      cooldownConfig: {
        cooldownType: 'turn_based',
        cooldownValue: 0
      },

      tags: ['ice', 'damage', 'debuff', 'touch', 'starter']
    },

    {
      id: 'arc_healing_light',
      name: 'Healing Light',
      description: 'Channels restorative energy into a warm beam of golden light that mends wounds on a single ally.',
      level: 1,
      enhancesCombo: 'healing_healing',
      spellType: 'ACTION',
      icon: 'Radiant/Radiant Bolt',
      
      typeConfig: {
        school: 'healing',
        icon: 'Radiant/Radiant Bolt',
        tags: ['healing', 'support', 'starter'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 60,
        targetRestrictions: ['ally', 'self']
      },

      resourceCost: {
        resourceTypes: ['mana', 'healing_sphere'],
        resourceValues: { mana: 4, healing_sphere: 2 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal', 'somatic'],
        verbalText: 'Lux Sanare!',
        somaticText: 'Hands glow with golden-white radiance, extending a beam of warm healing light toward the target'
      },

      effectTypes: ['healing'],

      healingConfig: {
        formula: '1d8 + spirit/4',
        healingType: 'direct',
        resolution: 'DICE',
        description: 'Golden light mends wounds and restores vitality to the target.'
      },

      cooldownConfig: {
        cooldownType: 'turn_based',
        cooldownValue: 0
      },

      tags: ['healing', 'support', 'starter']
    },

    {
      id: 'arc_arcane_missile',
      name: 'Arcane Missile',
      description: 'Combines arcane and holy energy into a small, unerring bolt of force that cannot be dodged or blocked.',
      level: 1,
      enhancesCombo: 'arcane_holy',
      spellType: 'ACTION',
      icon: 'Arcane/Missile',
      
      typeConfig: {
        school: 'arcane',
        icon: 'Arcane/Missile',
        tags: ['arcane', 'damage', 'starter'],
        castTime: 0,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 60,
        targetRestrictions: []
      },

      resourceCost: {
        resourceTypes: ['mana', 'arcane_sphere', 'holy_sphere'],
        resourceValues: { mana: 4, arcane_sphere: 1, holy_sphere: 1 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal'],
        verbalText: 'Missile Arcanum!'
      },

      effectTypes: ['damage'],

      damageConfig: {
        formula: '1d8 + intelligence/4',
        damageTypes: ['force'],
        resolution: 'DICE',
        description: 'An unerring missile strikes with pinpoint accuracy, delivering a concentrated burst of force.'
      },

      cooldownConfig: {
        cooldownType: 'turn_based',
        cooldownValue: 0
      },

      tags: ['arcane', 'damage', 'starter']
    },

    {
      id: 'arc_nature_vine',
      name: 'Nature Vine',
      description: 'Causes thorny vines to erupt from the ground, entangling a single target and dealing nature damage.',
      level: 1,
      enhancesCombo: 'nature_nature',
      spellType: 'ACTION',
      icon: 'Nature/Vines',
      
      typeConfig: {
        school: 'nature',
        icon: 'Nature/Vines',
        tags: ['nature', 'damage', 'control', 'starter'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 30,
        targetRestrictions: []
      },

      resourceCost: {
        resourceTypes: ['mana', 'nature_sphere', 'nature_sphere'],
        resourceValues: { mana: 4, nature_sphere: 2 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal', 'somatic'],
        verbalText: 'Vinea Crescere!',
        somaticText: 'Point at the ground, causing the earth to crack as vines erupt upward',
        spheres: ['Nature', 'Nature']
      },

      effectTypes: ['damage', 'control'],

      damageConfig: {
        formula: '1d8 + intelligence/4',
        damageTypes: ['nature'],
        resolution: 'DICE',
        description: 'Thorny vines dig into the target, dealing nature damage from thorns and constriction.'
      },

      controlConfig: {
        controlType: 'restraint',
        strength: 'weak',
        duration: 1,
        durationUnit: 'rounds',
        saveDC: 12,
        saveType: 'strength',
        savingThrow: true,
        effects: [{
          id: 'snare',
          name: 'Entangled by Vines',
          description: 'Thorny vines wrap around your legs, immobilizing you. A Strength save breaks free.',
          config: {
            restraintType: 'physical',
            saveType: 'strength',
            saveDC: 13,
            condition: 'restrained',
            breakOnDamage: true,
            duration: 1,
            durationUnit: 'rounds'
          }
        }]
      },

      cooldownConfig: {
        cooldownType: 'turn_based',
        cooldownValue: 0
      },

      tags: ['nature', 'damage', 'control', 'starter']
    },

    // ========================================
    // LEVEL 2 SPELLS
    // ========================================
    {
      id: 'arc_steam_burst',
      name: 'Steam Burst',
      description: 'Combines fire and ice spheres into a cone of superheated steam that burns and blinds enemies.',
      level: 2,
      enhancesCombo: 'fire_ice',
      spellType: 'ACTION',
      icon: 'Frost/Frost Touch',
      
      typeConfig: {
        school: 'frost',
        secondaryElement: 'fire',
        icon: 'Frost/Frost Touch',
        tags: ['fire', 'ice', 'damage', 'debuff'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 30,
        aoeShape: 'cone',
        aoeParameters: { length: 20 },
        targetRestrictions: []
      },

      resourceCost: {
        resourceTypes: ['mana', 'fire_sphere', 'ice_sphere'],
        resourceValues: { mana: 7, fire_sphere: 1, ice_sphere: 1 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal', 'somatic'],
        verbalText: 'Vapor Eruptio!',
        somaticText: 'Hold fire sphere in one hand and ice shard in the other, then bring them together to create explosive steam',
        spheres: ['Fire', 'Ice']
      },

      effectTypes: ['damage', 'debuff'],

      damageConfig: {
        formula: '1d8 + intelligence/4',
        damageTypes: ['frost', 'fire'],
        resolution: 'DICE'
      },

      debuffConfig: {
        debuffType: 'statusEffect',
        effects: [{
          id: 'disoriented',
          name: 'Blinded by Steam',
          description: 'Thick steam clouds your vision completely. You automatically fail sight-based checks and attack with disadvantage for 1 round.',
          statusType: 'blinded',
          level: 'minor',
          statPenalty: { stat: 'attack', value: -99, magnitudeType: 'disadvantage' },
          mechanicsText: 'Disadvantage on all attack rolls for 1 round'
        }],
        durationValue: 1,
        durationType: 'rounds',
        durationUnit: 'rounds',
        saveDC: 13,
        saveType: 'constitution',
        saveOutcome: 'negates'
      },

      cooldownConfig: {
        cooldownType: 'turn_based',
        cooldownValue: 0
      },

      tags: ['fire', 'ice', 'damage', 'debuff']
    },

    {
      id: 'arc_shadow_bolt',
      name: 'Shadow Bolt',
      description: 'Hurls a sphere of concentrated shadow energy that drains life force on impact. Heals you for 25% of the damage dealt.',
      level: 2,
      enhancesCombo: 'shadow_shadow',
      spellType: 'ACTION',
      icon: 'Void/Red Energy Burst',
      
      typeConfig: {
        school: 'necromancy',
        icon: 'Void/Red Energy Burst',
        tags: ['shadow', 'damage'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 60,
        targetRestrictions: []
      },

      resourceCost: {
        resourceTypes: ['mana', 'shadow_sphere', 'shadow_sphere'],
        resourceValues: { mana: 7, shadow_sphere: 2 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal', 'somatic'],
        verbalText: 'Umbra Vitae Draconis!',
        somaticText: 'Pull shadow energy from the void into your palm, forming a writhing sphere of darkness before hurling it forward',
        spheres: ['Shadow', 'Shadow']
      },

      effectTypes: ['damage', 'healing'],

      damageConfig: {
        formula: '1d8 + intelligence/4',
        damageTypes: ['necrotic'],
        resolution: 'DICE',
        description: 'The shadow bolt strikes with necrotic force, actively draining life energy from the target. They feel their vitality being siphoned away, experiencing a deep cold that seems to come from within their very soul. The wound left behind appears blackened and necrotic, as if the flesh itself has died.'
      },

      healingConfig: {
        formula: 'damage/4',
        healingType: 'leech',
        resolution: 'DICE',
        description: 'You absorb 25% of the damage dealt as healing energy, closing your own wounds with stolen vitality.'
      },

      cooldownConfig: {
        cooldownType: 'turn_based',
        cooldownValue: 0
      },

      tags: ['shadow', 'damage', 'healing']
    },

    {
      id: 'arc_celestial_ray',
      name: 'Celestial Ray',
      description: 'Weaves arcane and holy energy into a beam of celestial light that damages enemies and heals allies in its path.',
      level: 2,
      enhancesCombo: 'arcane_holy',
      spellType: 'ACTION',
      icon: 'Radiant/Radiant Bolt',
      
      typeConfig: {
        school: 'evocation',
        icon: 'Radiant/Radiant Bolt',
        tags: ['holy', 'arcane', 'damage', 'healing'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingMode: 'effect',
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 60,
        aoeShape: 'line',
        aoeParameters: { length: 60 },
        targetRestrictions: []
      },
      effectTargeting: {
        damage: {
          targetingType: 'area',
          rangeType: 'ranged',
          rangeDistance: 60,
          aoeShape: 'line',
          aoeParameters: { length: 60 },
          targetRestrictions: ['enemy']
        },
        healing: {
          targetingType: 'area',
          rangeType: 'ranged',
          rangeDistance: 60,
          aoeShape: 'line',
          aoeParameters: { length: 60 },
          targetRestrictions: ['ally']
        }
      },

      resourceCost: {
        resourceTypes: ['mana', 'arcane_sphere', 'holy_sphere'],
        resourceValues: { mana: 7, arcane_sphere: 1, holy_sphere: 1 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal', 'somatic'],
        verbalText: 'Lux Arcanum Divinus!',
        somaticText: 'Extend arm forward, palm open, as a brilliant beam of celestial light erupts from your fingertips',
        spheres: ['Arcane', 'Holy']
      },

      effectTypes: ['damage', 'healing'],

      damageConfig: {
        formula: '1d8 + intelligence/4',
        damageTypes: ['radiant'],
        resolution: 'DICE',
        description: 'The celestial ray burns enemies with searing radiant energy, as if they\'ve been exposed to concentrated sunlight. Their flesh smokes and chars where the light touches, and they feel an intense burning sensation that seems to come from within their very soul.'
      },

      healingConfig: {
        formula: '1d8 + spirit/4',
        healingType: 'direct',
        resolution: 'DICE'
      },

      cooldownConfig: {
        cooldownType: 'turn_based',
        cooldownValue: 0
      },

      tags: ['holy', 'arcane', 'damage', 'healing']
    },

    // ========================================
    // LEVEL 3 SPELLS
    // ========================================
    {
      id: 'arc_fire_bolt',
      name: 'Fire Bolt',
      description: 'A concentrated bolt of fire that explodes on impact, dealing fire damage.',
      level: 3,
      enhancesCombo: 'fire_fire',
      spellType: 'ACTION',
      icon: 'Fire/Fiery Bolt',
      
      typeConfig: {
        school: 'evocation',
        icon: 'Fire/Fiery Bolt',
        tags: ['fire', 'damage'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 90,
        targetRestrictions: []
      },

      propagation: {
        method: 'explosion',
        behavior: 'instant',
        parameters: {
          secondaryRadius: 10
        }
      },

      resourceCost: {
        resourceTypes: ['mana', 'fire_sphere', 'fire_sphere'],
        resourceValues: { mana: 10, fire_sphere: 2 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal', 'somatic'],
        verbalText: 'Ignis Sagitta!',
        somaticText: 'Hurl fire bolt',
        spheres: ['Fire', 'Fire']
      },

      effectTypes: ['damage'],

      damageConfig: {
        formula: '2d8 + intelligence/3',
        damageTypes: ['fire']
      },

      cooldownConfig: {
        cooldownType: 'turn_based',
        cooldownValue: 0
      },

      tags: ['fire', 'damage']
    },

    {
      id: 'arc_ice_shard',
      name: 'Ice Shard',
      description: 'A sharp shard of ice that pierces your target, dealing frost damage and slowing them.',
      level: 3,
      enhancesCombo: 'ice_ice',
      spellType: 'ACTION',
      icon: 'Frost/Frost Touch',
      
      typeConfig: {
        school: 'evocation',
        icon: 'Frost/Frost Touch',
        tags: ['ice', 'damage', 'debuff'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 90,
        targetRestrictions: []
      },

      resourceCost: {
        resourceTypes: ['mana', 'ice_sphere', 'ice_sphere'],
        resourceValues: { mana: 10, ice_sphere: 2 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal', 'somatic'],
        verbalText: 'Glacies Fragmentum!',
        somaticText: 'Hurl ice shard',
        spheres: ['Ice', 'Ice']
      },

      effectTypes: ['damage', 'debuff'],

      damageConfig: {
        formula: '2d8 + intelligence/3',
        damageTypes: ['frost']
      },

      debuffConfig: {
        debuffType: 'statusEffect',
        durationValue: 2,
        durationType: 'rounds',
        durationUnit: 'rounds',
        saveDC: 13,
        saveType: 'constitution',
        saveOutcome: 'negates',
        effects: [{
          id: 'slow',
          name: 'Slow',
          description: 'Movement speed reduced by 10 feet',
          statusType: 'slow',
          level: 'minor',
          statPenalty: { stat: 'movement_speed', value: -10 },
          movementPenalty: -10
        }]
      },

      cooldownConfig: {
        cooldownType: 'turn_based',
        cooldownValue: 0
      },

      tags: ['ice', 'damage', 'debuff']
    },

    {
      id: 'arc_arcane_detonation',
      name: 'Arcane Detonation',
      description: 'Compresses pure arcane energy into an explosive burst that damages and disorients all targets in the area.',
      level: 3,
      enhancesCombo: 'arcane_arcane',
      spellType: 'ACTION',
      icon: 'Arcane/Spiral Vortex',
      
      typeConfig: {
        school: 'evocation',
        icon: 'Arcane/Spiral Vortex',
        tags: ['arcane', 'damage', 'debuff', 'aoe'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 60,
        aoeShape: 'circle',
        aoeParameters: { radius: 10 },
        targetRestrictions: []
      },

      resourceCost: {
        resourceTypes: ['mana', 'arcane_sphere', 'arcane_sphere'],
        resourceValues: { mana: 10, arcane_sphere: 2 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal', 'somatic'],
        verbalText: 'Arcanum Detonare!',
        somaticText: 'Compress arcane energy between palms until it glows intensely, then clap hands together to release the explosive burst',
        spheres: ['Arcane', 'Arcane']
      },

      effectTypes: ['damage', 'debuff'],

      damageConfig: {
        formula: '2d8 + intelligence/3',
        damageTypes: ['force'],
        resolution: 'DICE',
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'agility',
          difficultyClass: 14,
          partialEffect: true,
          partialEffectFormula: 'damage/2',
          saveOutcome: 'halves'
        },
        description: 'The arcane detonation strikes with pure force energy, hitting targets like an invisible battering ram. The shockwave causes internal trauma as organs are compressed and bones are rattled by the concussive blast. Those who manage to dive for cover still feel the force ripple through their bodies, though with reduced intensity.'
      },

      debuffConfig: {
        debuffType: 'statusEffect',
        durationValue: 1,
        durationType: 'rounds',
        durationUnit: 'rounds',
        saveDC: 14,
        saveType: 'constitution',
        saveOutcome: 'negates',
        effects: [{
          id: 'disoriented',
          name: 'Arcane Disorientation',
          description: 'Arcane energy overwhelms the senses. Suffer -2 to attack rolls and saving throws for 1 round.',
          statusType: 'dazed',
          level: 'moderate',
          statPenalty: [{ stat: 'attack', value: -2 }, { stat: 'saving_throws', value: -2 }]
        }]
      },

      cooldownConfig: {
        cooldownType: 'turn_based',
        cooldownValue: 0
      },

      tags: ['arcane', 'damage', 'debuff', 'aoe']
    },

    // ========================================
    // LEVEL 4 SPELLS
    // ========================================
    {
      id: 'arc_firestorm',
      name: 'Firestorm',
      description: 'Summons a massive vortex of fire that engulfs a large area, dealing fire damage and leaving burning ground.',
      level: 4,
      enhancesCombo: 'fire_fire',
      spellType: 'ACTION',
      icon: 'Fire/Fire Storm',
      
      typeConfig: {
        school: 'evocation',
        icon: 'Fire/Fire Storm',
        tags: ['fire', 'damage', 'aoe'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 60,
        aoeShape: 'circle',
        aoeParameters: { radius: 15 },
        targetRestrictions: []
      },

      resourceCost: {
        resourceTypes: ['mana', 'fire_sphere'],
        resourceValues: { mana: 14, fire_sphere: 2 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal', 'somatic'],
        verbalText: 'Ignis Tempestas Infernalis!',
        somaticText: 'Raise both hands high as flames spiral outward, building into a massive fire vortex that descends upon the target area',
        spheres: ['Fire', 'Fire']
      },

      effectTypes: ['damage'],

      damageConfig: {
        formula: '2d8 + intelligence/3',
        damageTypes: ['fire'],
        resolution: 'DICE',
        dotConfig: {
          enabled: true,
          damagePerTick: '1d4',
          damageType: 'fire',
          tickFrequency: 'round',
          duration: 2,
          canStack: false,
          maxStacks: 1
        },
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'agility',
          difficultyClass: 14,
          partialEffect: true,
          partialEffectFormula: 'damage/2',
          saveOutcome: 'halves'
        }
      },

      cooldownConfig: {
        cooldownType: 'turn_based',
        cooldownValue: 0
      },

      tags: ['fire', 'damage', 'aoe']
    },

    {
      id: 'arc_frost_nova',
      name: 'Frost Nova',
      description: 'Releases a wave of freezing energy in all directions, dealing frost damage and slowing all nearby enemies.',
      level: 4,
      enhancesCombo: 'ice_ice',
      spellType: 'ACTION',
      icon: 'Frost/Ice Orb',
      
      typeConfig: {
        school: 'evocation',
        icon: 'Frost/Ice Orb',
        tags: ['ice', 'damage', 'debuff', 'aoe'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'circle',
        aoeParameters: { radius: 15 },
        targetRestrictions: []
      },

      resourceCost: {
        resourceTypes: ['mana', 'ice_sphere', 'ice_sphere'],
        resourceValues: { mana: 14, ice_sphere: 2 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal', 'somatic'],
        verbalText: 'Glacies Nova Absoluta!',
        somaticText: 'Spread arms wide as your body radiates freezing energy, unleashing a wave of ice crystals in all directions',
        spheres: ['Ice', 'Ice']
      },

      effectTypes: ['damage', 'debuff'],

      damageConfig: {
        formula: '2d8 + intelligence/3',
        damageTypes: ['frost'],
        resolution: 'DICE',
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'constitution',
          difficultyClass: 14,
          partialEffect: true,
          partialEffectFormula: 'damage/2',
          saveOutcome: 'halves'
        },
        description: 'The frost nova strikes with bone-chilling cold, causing immediate tissue damage as cells freeze and rupture. The cold penetrates deep, making targets feel as if their very blood is turning to ice. Those with strong constitutions can resist some of the damage, but even they feel the numbing effects of the magical cold.'
      },

      debuffConfig: {
        debuffType: 'statusEffect',
        durationValue: 2,
        durationType: 'rounds',
        durationUnit: 'rounds',
        saveDC: 14,
        saveType: 'constitution',
        saveOutcome: 'negates',
        effects: [{
          id: 'slow',
          name: 'Frozen Solid',
          description: 'Movement speed reduced by half for 2 rounds as deep cold stiffens muscles and joints.',
          statusType: 'slow',
          level: 'moderate',
          statPenalty: { stat: 'movement_speed', value: -50, magnitudeType: 'percentage' },
          movementPenalty: -50
        }]
      },

      cooldownConfig: {
        cooldownType: 'turn_based',
        cooldownValue: 0
      },

      tags: ['ice', 'damage', 'debuff', 'aoe']
    },

    {
      id: 'arc_shadow_embrace',
      name: 'Shadow Embrace',
      description: 'Dark tendrils of shadow wrap around your target, dealing necrotic damage and weakening them.',
      level: 4,
      enhancesCombo: 'shadow_shadow',
      spellType: 'ACTION',
      icon: 'Void/Maw Gripping Fear',
      
      typeConfig: {
        school: 'necromancy',
        icon: 'Void/Maw Gripping Fear',
        tags: ['shadow', 'damage', 'debuff'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 60,
        targetRestrictions: []
      },

      resourceCost: {
        resourceTypes: ['mana', 'shadow_sphere', 'shadow_sphere'],
        resourceValues: { mana: 14, shadow_sphere: 2 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal', 'somatic'],
        verbalText: 'Umbra Amplexus!',
        somaticText: 'Reach out with shadow tendrils',
        spheres: ['Shadow', 'Shadow']
      },

      effectTypes: ['damage', 'debuff'],

      damageConfig: {
        formula: '2d8 + intelligence/3',
        damageTypes: ['necrotic'],
        resolution: 'DICE',
        dotConfig: {
          enabled: true,
          damagePerTick: '1d6',
          damageType: 'necrotic',
          tickFrequency: 'round',
          duration: 2,
          canStack: false,
          maxStacks: 1
        }
      },

      debuffConfig: {
        debuffType: 'statPenalty',
        effects: [{
          id: 'weakened',
          name: 'Weakened',
          description: 'Strength reduced by 2 for 2 rounds. The target\'s physical power is diminished, making them weaker and less effective in combat.',
          statModifier: {
            stat: 'strength',
            magnitude: 2,
            magnitudeType: 'flat'
          }
        }],
        durationValue: 2,
        durationType: 'rounds',
        durationUnit: 'rounds',
        saveDC: 14,
        saveType: 'constitution'
      },

      cooldownConfig: {
        cooldownType: 'turn_based',
        cooldownValue: 0
      },

      tags: ['shadow', 'damage', 'debuff']
    },

    // ========================================
    // LEVEL 5 SPELLS
    // ========================================
    {
      id: 'arc_elemental_blast',
      name: 'Elemental Blast',
      description: 'Combine Fire and Ice to create a devastating blast of mixed elemental energy.',
      level: 5,
      enhancesCombo: 'fire_ice',
      spellType: 'ACTION',
      icon: 'Fire/Swirling Fireball',
      
      typeConfig: {
        school: 'fire',
        secondaryElement: 'frost',
        icon: 'Fire/Swirling Fireball',
        tags: ['fire', 'ice', 'damage', 'aoe'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 60,
        aoeShape: 'circle',
        aoeParameters: { radius: 10 },
        targetRestrictions: []
      },

      resourceCost: {
        resourceTypes: ['mana', 'fire_sphere', 'ice_sphere'],
        resourceValues: { mana: 18, fire_sphere: 1, ice_sphere: 1 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Elementum Explosio!',
        somaticText: 'Combine fire and ice spheres',
        spheres: ['Fire', 'Ice']
      },

      effectTypes: ['damage'],

      damageConfig: {
        formula: '3d8 + intelligence/2',
        damageTypes: ['fire', 'frost'],
        resolution: 'DICE',
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'agility',
          difficultyClass: 15,
          partialEffect: true,
          partialEffectFormula: 'damage/2',
          saveOutcome: 'halves'
        }
      },

      cooldownConfig: {
        cooldownType: 'turn_based',
        cooldownValue: 0
      },

      tags: ['fire', 'ice', 'damage', 'aoe']
    },

    {
      id: 'arc_divine_healing',
      name: 'Divine Healing',
      description: 'A powerful burst of divine energy that restores significant health to your target.',
      level: 5,
      enhancesCombo: 'holy_healing',
      spellType: 'ACTION',
      icon: 'Healing/Golden Heart',
      
      typeConfig: {
        school: 'evocation',
        icon: 'Healing/Golden Heart',
        tags: ['holy', 'healing', 'support'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 60,
        targetRestrictions: ['ally', 'self']
      },

      resourceCost: {
        resourceTypes: ['mana', 'holy_sphere', 'healing_sphere'],
        resourceValues: { mana: 18, holy_sphere: 1, healing_sphere: 1 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal', 'somatic'],
        verbalText: 'Sanctus Sanare!',
        somaticText: 'Channel divine healing energy',
        spheres: ['Holy', 'Healing']
      },

      effectTypes: ['healing'],

      healingConfig: {
        formula: '3d8 + spirit/2',
        healingType: 'direct',
        resolution: 'DICE'
      },

      cooldownConfig: {
        cooldownType: 'turn_based',
        cooldownValue: 0
      },

      tags: ['holy', 'healing', 'support']
    },

    {
      id: 'arc_chaos_bolt',
      name: 'Chaos Bolt',
      description: 'A bolt of unpredictable chaos energy that deals random elemental damage.',
      level: 5,
      enhancesCombo: 'chaos_chaos',
      spellType: 'ACTION',
      icon: 'Void/Corrupted Eye',
      
      typeConfig: {
        school: 'chaos',
        icon: 'Void/Corrupted Eye',
        tags: ['chaos', 'damage'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 90,
        targetRestrictions: []
      },

      resourceCost: {
        resourceTypes: ['mana', 'chaos_sphere', 'chaos_sphere'],
        resourceValues: { mana: 18, chaos_sphere: 2 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal', 'somatic'],
        verbalText: 'Chaos Sagitta!',
        somaticText: 'Hurl chaotic energy',
        spheres: ['Chaos', 'Chaos']
      },

      effectTypes: ['damage'],

      mechanicsConfig: {
        rollableTable: {
          enabled: true,
          tableName: 'Chaos Bolt',
          diceFormula: '1d4',
          entries: [
            { min: 1, max: 1, effect: 'Chaos Nova — 15ft radius, 3d8+INT/2 chaos damage to all enemies', weight: 1 },
            { min: 2, max: 2, effect: 'Entropy Drain — 3d8+INT/2 chaos damage, heal yourself for the same amount', weight: 1 },
            { min: 3, max: 3, effect: 'Polymorphic Blast — 4d8+INT/2 damage of a random element, target must save or be stunned 1 round', weight: 1 },
            { min: 4, max: 4, effect: 'Arcane Feedback — 3d8+INT/2 force damage chains to 1d4 random targets within 30ft', weight: 1 }
          ]
        }
      },

      damageConfig: {
        formula: '3d8 + intelligence/2',
        damageTypes: ['chaos']
      },

      cooldownConfig: {
        cooldownType: 'turn_based',
        cooldownValue: 0
      },

      tags: ['chaos', 'damage']
    },

    // ========================================
    // LEVEL 6 SPELLS (3-Sphere Combinations)
    // ========================================
    {
      id: 'arc_glacial_blessing',
      name: 'Glacial Blessing',
      description: 'Weave ice, healing, and holy spheres into crystalline armor of frost and divine light. Wounds close beneath the icy shell as restorative energy heals and shields your target.',
      level: 6,
      spellType: 'ACTION',
      icon: 'Frost/Frozen in Ice',
      
      typeConfig: {
        school: 'abjuration',
        icon: 'Frost/Frozen in Ice',
        tags: ['ice', 'healing', 'holy', 'buff'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 60,
        targetRestrictions: ['ally', 'self']
      },

      resourceCost: {
        resourceTypes: ['mana', 'ice_sphere', 'healing_sphere', 'holy_sphere'],
        resourceValues: { mana: 20, ice_sphere: 1, healing_sphere: 1, holy_sphere: 1 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal', 'somatic'],
        verbalText: 'Glacies Benedicere!',
        somaticText: 'Weave the three spheres into a crystalline lattice and press it gently onto the target',
        spheres: ['Ice', 'Healing', 'Holy']
      },

      effectTypes: ['healing', 'buff'],

      healingConfig: {
        formula: '8d6 + spirit',
        healingType: 'direct',
        resolution: 'DICE'
      },

      buffConfig: {
        buffType: 'statEnhancement',
        effects: [{
          id: 'frost_armor',
          name: 'Frost Armor',
          description: 'Gain +2 armor and 50% frost resistance for 3 rounds. A layer of protective enchanted ice forms around you, deflecting blows and absorbing frost.',
          mechanicsText: '',
          statModifier: {
            stat: 'armor',
            magnitude: 2,
            magnitudeType: 'flat'
          }
        }],
        durationValue: 3,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: false,
        canBeDispelled: true
      },

      cooldownConfig: {
        cooldownType: 'turn_based',
        cooldownValue: 0
      },

      tags: ['ice', 'healing', 'holy', 'buff']
    },

    {
      id: 'arc_prismatic_ward',
      name: 'Prismatic Ward',
      description: 'Fuse arcane, holy, and nature spheres into a prismatic dome. Cleansing light washes over allies, removing harmful effects and shielding them from incoming damage.',
      level: 6,
      spellType: 'ACTION',
      icon: 'Radiant/Radiant Divinity',
      
      typeConfig: {
        school: 'abjuration',
        icon: 'Radiant/Radiant Divinity',
        tags: ['arcane', 'holy', 'nature', 'buff', 'purification'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'circle',
        aoeParameters: { radius: 20 },
        targetRestrictions: ['ally', 'self']
      },

      resourceCost: {
        resourceTypes: ['mana', 'arcane_sphere', 'holy_sphere', 'nature_sphere'],
        resourceValues: { mana: 20, arcane_sphere: 1, holy_sphere: 1, nature_sphere: 1 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Prisma Custodia!',
        somaticText: 'Hold the three spheres above your head, letting them merge into a prismatic dome that expands outward',
        spheres: ['Arcane', 'Holy', 'Nature']
      },

      effectTypes: ['buff', 'purification'],

      buffConfig: {
        buffType: 'custom',
        effects: [{
          id: 'prismatic_shield',
          name: 'Prismatic Shield',
          description: 'Absorbs up to 15 damage over 3 rounds. The shimmering ward deflects incoming attacks with flashes of multicolored light.',
          mechanicsText: ''
        }],
        durationValue: 3,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: false,
        canBeDispelled: true
      },

      purificationConfig: {
        purificationType: 'cleanse',
        effects: [{
          id: 'prismatic_cleanse',
          name: 'Prismatic Cleanse',
          description: 'Removes one debuff or negative status effect from each ally in the area.',
          mechanicsText: ''
        }],
        strength: 'moderate',
        targetEffects: ['debuff', 'statusEffect']
      },

      cooldownConfig: {
        cooldownType: 'turn_based',
        cooldownValue: 3
      },

      tags: ['arcane', 'holy', 'nature', 'buff', 'purification']
    },

    {
      id: 'arc_verdant_rejuvenation',
      name: 'Verdant Rejuvenation',
      description: 'Nature, healing, and holy spheres bloom into luminous wildflowers and golden light. Wounds slowly close as nature energy knits flesh and bone together over several rounds.',
      level: 6,
      spellType: 'ACTION',
      icon: 'Nature/Growth',
      
      typeConfig: {
        school: 'restoration',
        icon: 'Nature/Growth',
        tags: ['nature', 'healing', 'holy', 'aoe', 'hot'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 60,
        aoeShape: 'circle',
        aoeParameters: { radius: 15 },
        targetRestrictions: ['ally', 'self']
      },

      resourceCost: {
        resourceTypes: ['mana', 'nature_sphere', 'healing_sphere', 'holy_sphere'],
        resourceValues: { mana: 20, nature_sphere: 1, healing_sphere: 1, holy_sphere: 1 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Floreo Sanitas!',
        somaticText: 'Release the merged spheres into the ground, causing healing wildflowers to bloom across the area',
        spheres: ['Nature', 'Healing', 'Holy']
      },

      effectTypes: ['healing'],

      healingConfig: {
        formula: '4d6 + spirit',
        healingType: 'direct',
        resolution: 'DICE',
        hotConfig: {
          enabled: true,
          healPerTick: '3d6 + spirit/2',
          tickFrequency: 'round',
          duration: 3,
          canStack: false,
          maxStacks: 1
        }
      },

      cooldownConfig: {
        cooldownType: 'turn_based',
        cooldownValue: 2
      },

      tags: ['nature', 'healing', 'holy', 'aoe', 'hot']
    },

    // ========================================
    // LEVEL 7 SPELLS (3-4 Sphere Combinations)
    // ========================================
    {
      id: 'arc_phase_shift',
      name: 'Phase Shift',
      description: 'Weaves arcane, shadow, and chaos into a dimensional step that teleports you up to 40 feet, leaving behind a damaging void afterimage.',
      level: 7,
      spellType: 'ACTION',
      icon: 'Arcane/Quick Step',
      
      typeConfig: {
        school: 'conjuration',
        icon: 'Arcane/Quick Step',
        tags: ['arcane', 'shadow', 'chaos', 'utility', 'teleport', 'damage'],
        castTime: 0,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self_centered'
      },

      resourceCost: {
        resourceTypes: ['mana', 'arcane_sphere', 'shadow_sphere', 'chaos_sphere'],
        resourceValues: { mana: 25, arcane_sphere: 1, shadow_sphere: 1, chaos_sphere: 1 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal', 'somatic'],
        verbalText: 'Transitum Umbrae!',
        somaticText: 'Press the three spheres together and step through the dimensional tear they create',
        spheres: ['Arcane', 'Shadow', 'Chaos']
      },

      effectTypes: ['utility', 'damage'],

      utilityConfig: {
        utilityType: 'movement',
        selectedEffects: [{
          id: 'phase_shift_teleport',
          name: 'Phase Shift',
          description: 'Teleport up to 40 feet to an unoccupied space you can see.',
          mechanicsText: '',
          distance: 40,
          needsLineOfSight: true
        }],
        duration: 0,
        durationUnit: 'instant',
        concentration: false,
        power: 'moderate'
      },

      damageConfig: {
        formula: '6d6 + intelligence',
        damageTypes: ['force'],
        triggerCondition: 'area_entry',
        triggerDescription: 'Enemies within 10 feet of your departure point take force damage from the void afterimage',
        areaShape: 'circle',
        areaParameters: { radius: 10 }
      },

      cooldownConfig: {
        cooldownType: 'turn_based',
        cooldownValue: 2
      },

      tags: ['arcane', 'shadow', 'chaos', 'utility', 'teleport', 'damage']
    },

    {
      id: 'arc_elemental_barrage',
      name: 'Elemental Barrage',
      description: 'Launches fire, ice, nature, and holy spheres simultaneously at a target area, creating a devastating prismatic explosion.',
      level: 7,
      spellType: 'ACTION',
      icon: 'Fire/Rapid Fire Projectiles',
      
      typeConfig: {
        school: 'evocation',
        icon: 'Fire/Rapid Fire Projectiles',
        tags: ['fire', 'ice', 'nature', 'holy', 'damage', 'aoe'],
        castTime: 2,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 60,
        aoeShape: 'circle',
        aoeParameters: { radius: 15 },
        targetRestrictions: []
      },

      resourceCost: {
        resourceTypes: ['mana', 'fire_sphere', 'ice_sphere', 'nature_sphere', 'holy_sphere'],
        resourceValues: { mana: 25, fire_sphere: 1, ice_sphere: 1, nature_sphere: 1, holy_sphere: 1 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Elementum Procella!',
        somaticText: 'Launch all four elemental spheres simultaneously at the target area',
        spheres: ['Fire', 'Ice', 'Nature', 'Holy']
      },

      effectTypes: ['damage'],

      damageConfig: {
        formula: '12d6 + intelligence',
        damageTypes: ['fire', 'frost', 'lightning', 'radiant'],
        resolution: 'DICE',
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'agility',
          difficultyClass: 16,
          partialEffect: true,
          partialEffectFormula: 'damage/2',
          saveOutcome: 'halves'
        }
      },

      cooldownConfig: {
        cooldownType: 'turn_based',
        cooldownValue: 1
      },

      tags: ['fire', 'ice', 'nature', 'holy', 'damage', 'aoe']
    },

    {
      id: 'arc_celestial_storm',
      name: 'Celestial Storm',
      description: 'Combines holy, healing, and arcane spheres into a radiant tempest that damages enemies and heals allies in the area.',
      level: 7,
      spellType: 'ACTION',
      icon: 'Radiant/Radiant Divinity',
      
      typeConfig: {
        school: 'evocation',
        icon: 'Radiant/Radiant Divinity',
        tags: ['holy', 'healing', 'arcane', 'damage', 'aoe'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingMode: 'effect',
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 60,
        aoeShape: 'circle',
        aoeParameters: { radius: 20 },
        targetRestrictions: []
      },
      effectTargeting: {
        damage: {
          targetingType: 'area',
          rangeType: 'ranged',
          rangeDistance: 60,
          aoeShape: 'circle',
          aoeParameters: { radius: 20 },
          targetRestrictions: ['enemy']
        },
        healing: {
          targetingType: 'area',
          rangeType: 'ranged',
          rangeDistance: 60,
          aoeShape: 'circle',
          aoeParameters: { radius: 20 },
          targetRestrictions: ['ally']
        }
      },

      resourceCost: {
        resourceTypes: ['mana', 'holy_sphere', 'healing_sphere', 'arcane_sphere'],
        resourceValues: { mana: 25, holy_sphere: 1, healing_sphere: 1, arcane_sphere: 1 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Tempestas Caelestis!',
        somaticText: 'Raise all three spheres skyward, causing a radiant storm to descend upon the area',
        spheres: ['Holy', 'Healing', 'Arcane']
      },

      effectTypes: ['damage', 'healing'],

      damageConfig: {
        formula: '10d6 + intelligence',
        damageTypes: ['radiant'],
        resolution: 'DICE',
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'constitution',
          difficultyClass: 16,
          partialEffect: true,
          partialEffectFormula: 'damage/2',
          saveOutcome: 'halves'
        }
      },

      healingConfig: {
        formula: '8d6 + spirit',
        healingType: 'direct',
        resolution: 'DICE'
      },

      cooldownConfig: {
        cooldownType: 'turn_based',
        cooldownValue: 1
      },

      tags: ['holy', 'healing', 'arcane', 'damage', 'aoe']
    },

    // ========================================
    // LEVEL 8 SPELLS (4-Sphere Ultimates)
    // ========================================
    {
      id: 'arc_harmonic_convergence',
      name: 'Harmonic Convergence',
      description: 'Weaves holy, shadow, healing, and chaos into a prismatic pulse that heals allies and grants temporary damage resistance.',
      level: 8,
      spellType: 'ACTION',
      icon: 'Healing/Golden Heart',
      
      typeConfig: {
        school: 'restoration',
        icon: 'Healing/Golden Heart',
        tags: ['holy', 'shadow', 'healing', 'chaos', 'buff', 'aoe'],
        castTime: 2,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 60,
        aoeShape: 'circle',
        aoeParameters: { radius: 20 },
        targetRestrictions: ['ally', 'self']
      },

      resourceCost: {
        resourceTypes: ['mana', 'holy_sphere', 'shadow_sphere', 'healing_sphere', 'chaos_sphere'],
        resourceValues: { mana: 28, holy_sphere: 1, shadow_sphere: 1, healing_sphere: 1, chaos_sphere: 1 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Harmonia Convergentia!',
        somaticText: 'Hold all four spheres at arm\'s length, letting them orbit and merge into a single chord of resonant energy',
        spheres: ['Holy', 'Shadow', 'Healing', 'Chaos']
      },

      effectTypes: ['healing', 'buff'],

      healingConfig: {
        formula: '12d6 + spirit',
        healingType: 'direct',
        resolution: 'DICE'
      },

      buffConfig: {
        buffType: 'custom',
        effects: [{
          id: 'harmonic_attunement',
          name: 'Harmonic Attunement',
          description: 'All allies gain +2 to saving throws and resistance to all damage types (half damage) for 2 rounds.',
          mechanicsText: ''
        }],
        durationValue: 2,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: false,
        canBeDispelled: true
      },

      cooldownConfig: {
        cooldownType: 'turn_based',
        cooldownValue: 4
      },

      tags: ['holy', 'shadow', 'healing', 'chaos', 'buff', 'aoe']
    },

    {
      id: 'arc_elemental_maelstrom',
      name: 'Elemental Maelstrom',
      description: 'Forces arcane, fire, ice, and nature into a volatile fusion that creates a raging elemental storm, damaging and disorienting all within.',
      level: 8,
      spellType: 'ACTION',
      icon: 'Fire/Rapid Fire Projectiles',
      
      typeConfig: {
        school: 'evocation',
        icon: 'Fire/Rapid Fire Projectiles',
        tags: ['arcane', 'fire', 'ice', 'nature', 'damage', 'control', 'aoe'],
        castTime: 2,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 60,
        aoeShape: 'circle',
        aoeParameters: { radius: 20 },
        targetRestrictions: []
      },

      resourceCost: {
        resourceTypes: ['mana', 'arcane_sphere', 'fire_sphere', 'ice_sphere', 'nature_sphere'],
        resourceValues: { mana: 28, arcane_sphere: 1, fire_sphere: 1, ice_sphere: 1, nature_sphere: 1 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Maelstrom Elementum!',
        somaticText: 'Compress the four conflicting spheres into one unstable mass and hurl it at the target area',
        spheres: ['Arcane', 'Fire', 'Ice', 'Nature']
      },

      effectTypes: ['damage', 'control'],

      damageConfig: {
        formula: '14d6 + intelligence',
        damageTypes: ['fire', 'frost', 'lightning', 'force'],
        resolution: 'DICE',
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'agility',
          difficultyClass: 16,
          partialEffect: true,
          partialEffectFormula: 'damage/2',
          saveOutcome: 'halves'
        }
      },

      controlConfig: {
        controlType: 'incapacitation',
        strength: 'moderate',
        duration: 1,
        durationUnit: 'rounds',
        saveDC: 16,
        saveType: 'constitution',
        savingThrow: true,
        effects: [{
          id: 'elemental_disorientation',
          name: 'Elemental Disorientation',
          description: 'The chaotic elemental barrage has overwhelmed your senses. Movement speed halved, -2 to attack rolls for 1 round.',
          config: {
            durationType: 'rounds',
            recoveryMethod: 'automatic',
            saveType: 'constitution',
            saveDC: 17,
            duration: 1,
            durationUnit: 'rounds',
            movementPenalty: -50,
            accuracyPenalty: -2
          }
        }]
      },

      cooldownConfig: {
        cooldownType: 'turn_based',
        cooldownValue: 2
      },

      tags: ['arcane', 'fire', 'ice', 'nature', 'damage', 'control', 'aoe']
    },

    {
      id: 'arc_chaos_storm',
      name: 'Chaos Storm',
      description: 'Concentrates chaos energy with two other elemental spheres into a whirlwind of random elemental forces that deals unpredictable damage over a wide area.',
      level: 8,
      spellType: 'ACTION',
      icon: 'Void/Corrupted Eye',
      
      typeConfig: {
        school: 'chaos',
        icon: 'Void/Corrupted Eye',
        tags: ['chaos', 'damage', 'aoe'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 60,
        aoeShape: 'circle',
        aoeParameters: { radius: 20 },
        targetRestrictions: []
      },

      resourceCost: {
        resourceTypes: ['mana', 'chaos_sphere'],
        resourceValues: { mana: 28, chaos_sphere: 3 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Tempestas Chaos!',
        somaticText: 'Compress two chaos spheres into a single unstable point and release it',
        spheres: ['Chaos', 'Chaos', 'Chaos']
      },

      effectTypes: ['damage'],

      mechanicsConfig: {
        rollableTable: {
          enabled: true,
          tableName: 'Chaos Storm',
          diceFormula: '1d4',
          entries: [
            { min: 1, max: 1, effect: 'Elemental Cascade — 15ft radius, 14d6+INT chaos damage, all enemies', weight: 1 },
            { min: 2, max: 2, effect: 'Gravity Well — 20ft radius, 10d6+INT chaos damage, all enemies pulled to center', weight: 1 },
            { min: 3, max: 3, effect: 'Bifurcation — Two 8d6+INT chaos bolts hitting separate targets', weight: 1 },
            { min: 4, max: 4, effect: 'Feedback Loop — 12d6+INT chaos damage to enemies, heal all allies 3d6 in 20ft radius', weight: 1 }
          ]
        }
      },

      damageConfig: {
        formula: '12d6 + intelligence',
        damageTypes: ['chaos'],
        resolution: 'DICE',
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'agility',
          difficultyClass: 16,
          partialEffect: true,
          partialEffectFormula: 'damage/2',
          saveOutcome: 'halves'
        }
      },

      cooldownConfig: {
        cooldownType: 'turn_based',
        cooldownValue: 2
      },

      tags: ['chaos', 'damage', 'aoe']
    },

    // ========================================
    // LEVEL 9 SPELLS (Powerful w/ real tradeoffs)
    // ========================================
    {
      id: 'arc_primal_cataclysm',
      name: 'Primal Cataclysm',
      description: 'Channels all eight elemental spheres into a prismatic shockwave that deals massive damage of every element type. Causes painful backlash to the caster.',
      level: 9,
      spellType: 'ACTION',
      icon: 'Arcane/Ebon Blaze',
      
      typeConfig: {
        school: 'evocation',
        icon: 'Arcane/Ebon Blaze',
        tags: ['ultimate', 'damage', 'aoe', 'all elements', 'self damage'],
        castTime: 3,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 80,
        aoeShape: 'circle',
        aoeParameters: { radius: 20 },
        targetRestrictions: []
      },

      resourceCost: {
        resourceTypes: ['mana', 'arcane_sphere', 'holy_sphere', 'shadow_sphere', 'fire_sphere', 'ice_sphere', 'nature_sphere', 'healing_sphere', 'chaos_sphere'],
        resourceValues: { mana: 32, arcane_sphere: 1, holy_sphere: 1, shadow_sphere: 1, fire_sphere: 1, ice_sphere: 1, nature_sphere: 1, healing_sphere: 1, chaos_sphere: 1 },
        useFormulas: {},
        actionPoints: 3,
        components: ['verbal', 'somatic'],
        verbalText: 'Elementum Cataclysmos!',
        somaticText: 'Force all eight spheres into a single volatile point of prismatic energy',
        spheres: ['Arcane', 'Holy', 'Shadow', 'Fire', 'Ice', 'Nature', 'Healing', 'Chaos']
      },

      effectTypes: ['damage'],

      damageConfig: {
        formula: '18d6 + intelligence',
        damageTypes: ['fire', 'frost', 'lightning', 'radiant', 'necrotic', 'force', 'chaos'],
        resolution: 'DICE',
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'agility',
          difficultyClass: 17,
          partialEffect: true,
          partialEffectFormula: 'damage/2',
          saveOutcome: 'halves'
        }
      },

      selfDamageConfig: {
        formula: '2d6',
        damageType: 'force',
        description: 'Elemental backlash from combining opposing elements'
      },

      cooldownConfig: {
        cooldownType: 'encounter',
        cooldownValue: 1,
        description: 'Once per combat'
      },

      tags: ['ultimate', 'damage', 'aoe', 'all elements', 'self damage']
    },

    {
      id: 'arc_chaos_vortex',
      name: 'Chaos Vortex',
      description: 'Concentrates four chaos spheres into a swirling vortex of unpredictable destruction that deals random elemental damage and causes chaotic feedback.',
      level: 9,
      spellType: 'ACTION',
      icon: 'Void/Corrupted Eye',
      
      typeConfig: {
        school: 'chaos',
        icon: 'Void/Corrupted Eye',
        tags: ['chaos', 'damage', 'aoe', 'ultimate', 'self damage'],
        castTime: 2,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 60,
        aoeShape: 'circle',
        aoeParameters: { radius: 20 },
        targetRestrictions: []
      },

      resourceCost: {
        resourceTypes: ['mana', 'chaos_sphere'],
        resourceValues: { mana: 32, chaos_sphere: 4 },
        useFormulas: {},
        actionPoints: 3,
        components: ['verbal', 'somatic'],
        verbalText: 'Chaos Vorticem!',
        somaticText: 'Spiral hands to concentrate chaos energy into an unstable vortex',
        spheres: ['Chaos', 'Chaos', 'Chaos', 'Chaos']
      },

      effectTypes: ['damage'],

      mechanicsConfig: {
        rollableTable: {
          enabled: true,
          tableName: 'Chaos Vortex',
          diceFormula: '1d6',
          entries: [
            { min: 1, max: 1, effect: 'Annihilation — 20d6+INT chaos damage in 25ft radius, all creatures (including allies)', weight: 1 },
            { min: 2, max: 2, effect: 'Siphon Storm — 14d6+INT chaos damage, heal all allies in radius for half the damage dealt', weight: 1 },
            { min: 3, max: 3, effect: 'Gravity Collapse — 12d6+INT chaos damage, all enemies pulled to center and restrained 1 round', weight: 1 },
            { min: 4, max: 4, effect: 'Elemental Barrage — 16d6+INT damage split evenly across 4 random elements (fire, frost, lightning, radiant)', weight: 1 },
            { min: 5, max: 5, effect: 'Time Warp — 10d6+INT chaos damage, all enemies in area lose their next turn', weight: 1 },
            { min: 6, max: 6, effect: 'Chaos Perfection — Choose any of the above effects', weight: 1 }
          ]
        }
      },

      damageConfig: {
        formula: '16d6 + intelligence',
        damageTypes: ['chaos'],
        resolution: 'DICE',
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'agility',
          difficultyClass: 17,
          partialEffect: true,
          partialEffectFormula: 'damage/2',
          saveOutcome: 'halves'
        }
      },

      selfDamageConfig: {
        formula: '1d8',
        damageType: 'chaos',
        description: 'Chaotic energy feedback from concentrated entropy'
      },

      cooldownConfig: {
        cooldownType: 'encounter',
        cooldownValue: 1,
        description: 'Once per combat'
      },

      tags: ['chaos', 'damage', 'aoe', 'ultimate', 'self damage']
    },

    {
      id: 'arc_arcane_synthesis',
      name: 'Arcane Synthesis',
      description: 'Harmonizes four opposing elements to enhance allies\' combat capabilities with boosted attacks, spell damage, and regeneration. Leaves the caster briefly drained.',
      level: 9,
      spellType: 'ACTION',
      icon: 'Arcane/Missile',
      
      typeConfig: {
        school: 'enchantment',
        icon: 'Arcane/Missile',
        tags: ['arcane', 'holy', 'shadow', 'fire', 'buff', 'healing', 'aoe'],
        castTime: 2,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'circle',
        aoeParameters: { radius: 20 },
        targetRestrictions: ['ally', 'self']
      },

      resourceCost: {
        resourceTypes: ['mana', 'arcane_sphere', 'holy_sphere', 'shadow_sphere', 'fire_sphere'],
        resourceValues: { mana: 32, arcane_sphere: 1, holy_sphere: 1, shadow_sphere: 1, fire_sphere: 1 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Synthesis Elementum!',
        somaticText: 'Weave four opposing elements into a state of perfect harmony, releasing the balanced energy outward',
        spheres: ['Arcane', 'Holy', 'Shadow', 'Fire']
      },

      effectTypes: ['buff', 'healing'],

      buffConfig: {
        buffType: 'custom',
        effects: [{
          id: 'elemental_synthesis',
          name: 'Elemental Synthesis',
          description: 'All allies gain +3 to attack rolls, +2 to spell damage, and regenerate 1d4 HP at the start of each turn for 3 rounds.',
          mechanicsText: ''
        }],
        durationValue: 3,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: true,
        canBeDispelled: true
      },

      healingConfig: {
        formula: '10d6 + spirit',
        healingType: 'direct',
        resolution: 'DICE'
      },

      debuffConfig: {
        debuffType: 'self',
        effects: [{
          id: 'synthesis_drain',
          name: 'Synthesis Drain',
          description: 'The caster has -2 to spell attack rolls for 1 round from the strain of balancing opposing elements.',
          mechanicsText: '',
          isSelfDebuff: true,
          statPenalty: { stat: 'spell_attack', value: -2 }
        }],
        durationValue: 1,
        durationType: 'rounds',
        durationUnit: 'rounds'
      },

      cooldownConfig: {
        cooldownType: 'turn_based',
        cooldownValue: 5
      },

      tags: ['arcane', 'holy', 'shadow', 'fire', 'buff', 'healing', 'aoe']
    },

    // ========================================
    // LEVEL 10 SPELLS (Capstones)
    // ========================================
    {
      id: 'arc_elemental_convergence',
      name: 'Elemental Convergence',
      description: 'Forces seven elemental spheres into a single convergence point that detonates in cascading elemental destruction. Leaves the caster exhausted and takes self damage.',
      level: 10,
      spellType: 'ACTION',
      icon: 'Arcane/Ebon Blaze',
      
      typeConfig: {
        school: 'evocation',
        icon: 'Arcane/Ebon Blaze',
        tags: ['ultimate', 'damage', 'aoe', 'mastery', 'self damage', 'exhaustion'],
        castTime: 3,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 90,
        aoeShape: 'circle',
        aoeParameters: { radius: 25 },
        targetRestrictions: []
      },

      resourceCost: {
        resourceTypes: ['mana', 'arcane_sphere', 'holy_sphere', 'shadow_sphere', 'fire_sphere', 'ice_sphere', 'nature_sphere', 'healing_sphere'],
        resourceValues: { mana: 36, arcane_sphere: 1, holy_sphere: 1, shadow_sphere: 1, fire_sphere: 1, ice_sphere: 1, nature_sphere: 1, healing_sphere: 1 },
        useFormulas: {},
        actionPoints: 3,
        components: ['verbal', 'somatic'],
        verbalText: 'Convergentia Elementum!',
        somaticText: 'Force all seven spheres into a single convergence point above your head, then release the cascading detonation',
        spheres: ['Arcane', 'Holy', 'Shadow', 'Fire', 'Ice', 'Nature', 'Healing']
      },

      effectTypes: ['damage'],

      damageConfig: {
        formula: '20d6 + intelligence',
        damageTypes: ['fire', 'frost', 'lightning', 'radiant', 'necrotic', 'force'],
        resolution: 'DICE',
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'agility',
          difficultyClass: 18,
          partialEffect: true,
          partialEffectFormula: 'damage/2',
          saveOutcome: 'halves'
        }
      },

      selfDamageConfig: {
        formula: '3d6',
        damageType: 'force',
        description: 'Severe elemental backlash from convergence strain'
      },

      debuffConfig: {
        debuffType: 'self',
        effects: [{
          id: 'convergence_exhaustion',
          name: 'Convergence Exhaustion',
          description: 'The caster cannot cast spells requiring 3+ spheres until end of next turn. The immense strain of convergence leaves your body trembling.',
          mechanicsText: 'Cannot cast spells requiring 3+ spheres until end of next turn',
          isSelfDebuff: true
        }],
        durationValue: 1,
        durationType: 'rounds',
        durationUnit: 'rounds'
      },

      cooldownConfig: {
        cooldownType: 'encounter',
        cooldownValue: 1,
        description: 'Once per combat'
      },

      tags: ['ultimate', 'damage', 'aoe', 'mastery', 'self damage', 'exhaustion']
    },

    {
      id: 'arc_dimensional_rift',
      name: 'Dimensional Rift',
      description: 'Tears open a rift between dimensions using arcane, shadow, and chaos spheres. Bombards nearby enemies with void energy and causes dimensional disorientation. Causes void feedback to the caster.',
      level: 10,
      spellType: 'ACTION',
      icon: 'Void/Shadowy Blaze',
      
      typeConfig: {
        school: 'conjuration',
        icon: 'Void/Shadowy Blaze',
        tags: ['ultimate', 'damage', 'control', 'aoe', 'void', 'self damage'],
        castTime: 2,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 60,
        aoeShape: 'circle',
        aoeParameters: { radius: 20 },
        targetRestrictions: []
      },

      resourceCost: {
        resourceTypes: ['mana', 'arcane_sphere', 'shadow_sphere', 'chaos_sphere'],
        resourceValues: { mana: 36, arcane_sphere: 1, shadow_sphere: 1, chaos_sphere: 2 },
        useFormulas: {},
        actionPoints: 3,
        components: ['verbal', 'somatic'],
        verbalText: 'Rima Dimensio!',
        somaticText: 'Tear reality apart with a sharp pulling motion, opening a swirling void portal',
        spheres: ['Arcane', 'Shadow', 'Chaos', 'Chaos']
      },

      effectTypes: ['damage', 'control'],

      damageConfig: {
        formula: '18d6 + intelligence',
        damageTypes: ['force', 'necrotic'],
        resolution: 'DICE',
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'agility',
          difficultyClass: 18,
          partialEffect: true,
          partialEffectFormula: 'damage/2',
          saveOutcome: 'halves'
        }
      },

      controlConfig: {
        controlType: 'incapacitation',
        strength: 'strong',
        duration: 1,
        durationUnit: 'rounds',
        saveDC: 18,
        saveType: 'constitution',
        savingThrow: true,
        effects: [{
          id: 'void_disorientation',
          name: 'Void Disorientation',
          description: 'Reality warps around you. Disadvantage on attacks, cannot take reactions, movement speed halved for 1 round.',
          config: {
            durationType: 'rounds',
            recoveryMethod: 'automatic',
            saveType: 'constitution',
            saveDC: 18,
            duration: 1,
            durationUnit: 'rounds',
            movementPenalty: -50,
            accuracyPenalty: -99,
            loseReactions: true
          }
        }]
      },

      selfDamageConfig: {
        formula: '2d6',
        damageType: 'necrotic',
        description: 'Void energy feedback from unstable rift'
      },

      cooldownConfig: {
        cooldownType: 'encounter',
        cooldownValue: 1,
        description: 'Once per combat'
      },

      tags: ['ultimate', 'damage', 'control', 'aoe', 'void', 'self damage']
    },

    {
      id: 'arc_elemental_apotheosis',
      name: 'Elemental Apotheosis',
      description: 'Absorbs six elemental spheres into your body, becoming a living conduit of elemental force with boosted damage, armor, and resistance for a brief time.',
      level: 10,
      spellType: 'ACTION',
      icon: 'Fire/Volcanic Erupt',
      
      typeConfig: {
        school: 'transmutation',
        icon: 'Fire/Volcanic Erupt',
        tags: ['ultimate', 'buff', 'transformation', 'mastery'],
        castTime: 2,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self_centered'
      },

      resourceCost: {
        resourceTypes: ['mana', 'fire_sphere', 'ice_sphere', 'nature_sphere', 'holy_sphere', 'shadow_sphere', 'arcane_sphere'],
        resourceValues: { mana: 36, fire_sphere: 1, ice_sphere: 1, nature_sphere: 1, holy_sphere: 1, shadow_sphere: 1, arcane_sphere: 1 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Apotheosis Elementum!',
        somaticText: 'Press all six spheres against your chest, absorbing them into your body in a prismatic flash',
        spheres: ['Fire', 'Ice', 'Nature', 'Holy', 'Shadow', 'Arcane']
      },

      effectTypes: ['buff'],

      buffConfig: {
        buffType: 'custom',
        effects: [{
          id: 'elemental_apotheosis',
          name: 'Elemental Apotheosis',
          description: '4 rounds: +4 spell damage, +3 armor, fire/frost/lightning resistance, 2-sphere spells cost half mana (rounded down). Your body radiates prismatic elemental energy as a living conduit of force.',
          mechanicsText: ''
        }],
        durationValue: 4,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: true,
        canBeDispelled: false
      },

      cooldownConfig: {
        cooldownType: 'encounter',
        cooldownValue: 1,
        description: 'Once per combat'
      },

      tags: ['ultimate', 'buff', 'transformation', 'mastery']
    }
  ]
};

