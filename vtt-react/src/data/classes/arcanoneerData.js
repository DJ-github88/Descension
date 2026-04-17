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
  role: 'Damage/Utility',
  damageTypes: ['arcane', 'fire', 'frost', 'lightning', 'force', 'chaos'],

  // Overview section
  overview: {
    title: 'The Arcanoneer',
    subtitle: 'Master of Elemental Sphere Combination',

    quickOverview: {
      title: 'Quick Overview',
      content: `**What You Need to Know**: The Arcanoneer is a versatile spellcaster who rolls 4d8 each turn to generate random elemental spheres (Arcane, Holy, Shadow, Fire, Ice, Nature, Healing, Chaos). You combine 2, 3, or 4 spheres to cast spells using a combination matrix—like mixing chemical elements to create reactions. You can save spheres between turns to build toward powerful combinations, but all spheres are lost when combat ends.

**Core Mechanic**: Roll 4d8 → Get random spheres → Combine them to cast spells → Adapt to any situation

**Resource**: Elemental Spheres (generated randomly each turn, can be banked during combat)

**Playstyle**: Highly adaptive, requires system mastery, RNG-dependent but strategically controllable

**Best For**: Players who enjoy improvisation, combo systems, and adapting to randomness`
    },

    description: `The Arcanoneer is a master of runes and arcane engineering, capable of combining different elemental spheres to create a vast array of magical effects. Unlike traditional spellcasters who memorize specific spells, Arcanoneers harness raw elemental energy that manifests randomly each turn, then combine these spheres in creative ways to craft spells, gadgets, and traps on the fly. This system provides immense versatility and strategic depth, allowing the Arcanoneer to adapt to any situation.`,
    
    roleplayIdentity: {
      title: 'Roleplay Identity',
      content: `Arcanoneers are arcane engineers and elemental theorists who view magic as a science of combination and reaction. They see the eight fundamental elements as building blocks that can be mixed like alchemical reagents to produce infinite variations. Their power comes not from memorization, but from understanding how elements interact and react with each other.

In roleplay, Arcanoneers often carry notebooks filled with combination formulas, experiment with new sphere mixtures, and approach magic with scientific curiosity. They may mutter element names while casting, trace combination patterns in the air, or become excited when discovering new synergies.

Common Arcanoneer archetypes include:
- **The Arcane Scientist**: Treats magic like chemistry, constantly experimenting
- **The Combat Engineer**: Builds magical gadgets and battlefield devices
- **The Chaos Theorist**: Embraces randomness and finds patterns in disorder
- **The Elemental Savant**: Seeks to master all eight fundamental elements`
    },
    
    combatRole: {
      title: 'Combat Role',
      content: `**Primary Role**: Versatile damage dealer and utility caster

**Combat Identity**: The Arcanoneer excels at adapting to any situation by combining randomly generated elemental spheres into the perfect spell for the moment. They can deal massive AoE damage, provide healing support, create battlefield control effects, or unleash devastating single-target attacks - all depending on which spheres they roll each turn.

**Tactical Approach**:
- **Turn-by-Turn Adaptation**: Each turn brings new spheres, requiring quick thinking
- **Combination Mastery**: Understanding which 2, 3, or 4-sphere combos to use
- **Sphere Banking**: Saving specific spheres for powerful future combinations
- **Risk Management**: Balancing immediate needs vs. saving for bigger combos

**Strengths**:
- Unmatched versatility (can cast any element type)
- Powerful AoE damage with multi-element combinations
- Can adapt to any enemy weakness
- Scales incredibly well with game knowledge

**Weaknesses**:
- Highly dependent on RNG (random sphere generation)
- Requires extensive system knowledge to optimize
- Cannot guarantee specific spells when needed
- Complex decision-making each turn`
    },
    
    playstyle: {
      title: 'Playstyle',
      content: `**Moment-to-Moment Gameplay**:

Each turn, you roll 4d8 to generate your elemental spheres. You then decide:
1. Do I spend these spheres immediately for a 2-sphere combo?
2. Do I save them to combine with next turn's spheres for a 3 or 4-sphere ultimate?
3. Which combination best fits the current tactical situation?

**Example Turn Sequence**:
- **Turn 1**: Roll 4d8 → Get Fire, Fire, Ice, Healing
  - Option A: Cast Fire+Fire for pure fire damage
  - Option B: Cast Fire+Ice for Steam Burst (mixed damage)
  - Option C: Save all 4 for next turn to build toward a 4-sphere ultimate
  
- **Turn 2**: Roll 4d8 → Get Arcane, Shadow, Nature, Chaos
  - If you saved Turn 1 spheres, you now have 8 spheres total
  - Can cast a 4-sphere ultimate like "Elemental Fury" (Arcane+Fire+Ice+Nature)
  - Or cast multiple 2-sphere combos

**Mastery Comes From**:
- Memorizing the 8x8 combination matrix
- Knowing when to save vs. spend spheres
- Recognizing powerful 3 and 4-sphere recipes
- Adapting combinations to enemy weaknesses`
    },

    immersiveCombatExample: {
      title: 'Combat Example: The Siege of Thornwall Keep',
      content: `**The Setup**: You and your party are defending Thornwall Keep against a wave of undead. Three skeletal warriors advance on your position while a necromancer channels dark energy from the rear. Your allies are engaged—you need to act fast.

**Turn 1 - Opening Salvo**

*You close your eyes and reach into the elemental currents, feeling the raw magic coalesce around you. Your fingers trace patterns in the air as you roll your fate dice...*

**Roll 4d8**: [4, 4, 5, 7] → Fire, Fire, Ice, Healing

*Two orbs of crackling flame materialize in your left hand, while frost crystals form in your right. A soft golden glow pulses at your chest—healing energy, waiting to be shaped.*

**Your Decision**: The skeletal warriors are clustered together—perfect for area damage. You decide to combine Fire + Fire for a pure flame blast.

*"Ignis multiplicare!"* you shout, slamming your palms together. The two fire spheres merge into a roiling ball of flame that you hurl at the skeletons. The explosion engulfs all three, their bones blackening and cracking from the intense heat.

**Result**: Cast "Flame Burst" (Fire + Fire) for 3d6 fire damage to all three skeletons. You still have Ice and Healing spheres banked for next turn.

**Turn 2 - Tactical Adaptation**

*The necromancer raises his staff, dark energy swirling. You need to disrupt his casting while keeping your defensive options open.*

**Roll 4d8**: [1, 3, 6, 8] → Arcane, Shadow, Nature, Chaos

*New spheres manifest: a sphere of pure arcane force, a writhing shadow orb, crackling nature energy, and a wildly fluctuating chaos sphere. Combined with your banked Ice and Healing from last turn, you now have 6 spheres total.*

**Your Decision**: You could save everything for a massive 4-sphere ultimate next turn, but the necromancer needs to be stopped NOW. You combine Arcane + Shadow for a disruptive force blast.

*You weave the arcane and shadow spheres together, creating a bolt of void energy that streaks toward the necromancer. It strikes his staff, disrupting his channeling and causing him to stumble backward.*

**Result**: Cast "Void Bolt" (Arcane + Shadow) for 2d8 force damage and interrupt his spell. You still have Ice, Healing, Nature, and Chaos banked (4 spheres total).

**Turn 3 - The Ultimate Combination**

*One skeleton remains, but it's badly damaged. The necromancer is preparing another spell. This is your moment.*

**Roll 4d8**: [2, 4, 5, 6] → Holy, Fire, Ice, Nature

*Divine light, flame, frost, and nature energy join your existing spheres. You now have 8 spheres total: Ice, Healing, Nature, Chaos, Holy, Fire, Ice, Nature.*

**Your Decision**: You have the components for "Elemental Cataclysm" (Fire + Ice + Nature + Holy)—a devastating 4-sphere ultimate that combines all four primal elements.

*You raise both hands to the sky, and all four spheres orbit around you in a complex pattern. Fire and ice spiral together, nature energy intertwines with holy light. The elements shouldn't mix—they should cancel each other out—but your mastery forces them into harmony.*

*"ELEMENTUM CATACLYSMOS!"*

*The four spheres collapse into a single point above your head, then explode outward in a prismatic wave of elemental fury. Fire burns, ice freezes, nature vines entangle, and holy light sears the undead flesh.*

**Result**: Cast "Elemental Cataclysm" (Fire + Ice + Nature + Holy) for 6d10 mixed elemental damage to all enemies in a 30-foot radius. The remaining skeleton is obliterated, and the necromancer is blasted off the battlements.

**The Lesson**: This is the Arcanoneer's power—adapting to each moment, banking resources for the perfect combination, and unleashing devastating elemental fury when the moment is right. Every turn is a puzzle, every roll is an opportunity, and mastery comes from knowing which pieces fit together.`
    }
  },
  
  // Resource System
  resourceSystem: {
    title: 'Sphere Generation & Elemental Combination',
    subtitle: 'Dynamic Spell Crafting System',

    description: `The Arcanoneer's power comes from generating random elemental spheres each turn and combining them to create spells. This system is inspired by Magicka's element combination mechanics, where different element pairings create unique magical effects. Unlike traditional mana-based casters, your limiting factor isn't just mana—it's which spheres you have available and how creatively you can combine them.`,

    resourceBarExplanation: {
      title: 'Understanding Your Resource Bar',
      content: `**What You See**: Your Arcanoneer resource bar displays your currently banked elemental spheres as colored orbs, each representing one of the eight elements. Unlike other classes with a single resource pool, you're managing multiple different "currencies" simultaneously.

**Visual Representation**:
- **Arcane Spheres**: Purple orbs with swirling energy
- **Holy Spheres**: Golden orbs radiating light
- **Shadow Spheres**: Dark orbs with wisps of darkness
- **Fire Spheres**: Red-orange orbs with flickering flames
- **Ice Spheres**: Pale blue orbs with frost crystals
- **Nature Spheres**: Green orbs with crackling lightning
- **Healing Spheres**: Soft yellow orbs with gentle glow
- **Chaos Spheres**: Multicolored orbs that shift unpredictably

**How It Changes**:
- **Each Turn Start**: 4 new spheres appear (based on your 4d8 roll)
- **When Casting**: Spheres you spend disappear from the bar
- **Banking Spheres**: Unused spheres remain visible, accumulating over turns
- **Combat End**: All spheres vanish (they don't persist between fights)

**Why This Matters**: Your resource bar is your spell palette. The more spheres you have banked, the more options you have—but you're also limited by which specific elements you've rolled. A bar full of Fire spheres gives you different options than a diverse mix of elements. Learning to read your resource bar at a glance and quickly identify powerful combinations is key to mastering the Arcanoneer.

**Strategic Depth**: Unlike a Pyrofiend who just watches their Inferno Veil level, or a Berserker tracking their Rage number, you're managing a dynamic inventory of magical components. Each sphere is a tool, and your job is to select the right tools for each situation.`
    },

    mechanics: {
      title: 'Detailed Mechanics',
      content: `**Sphere Generation (Start of Each Turn)**:
Roll 4d8. Each die result generates one elemental sphere that appears in your resource bar:
- **1 = Arcane** (Purple) - Raw magical force
- **2 = Holy** (Gold) - Divine radiance
- **3 = Shadow** (Black) - Necrotic darkness
- **4 = Fire** (Red) - Burning flames
- **5 = Ice** (Blue) - Freezing cold
- **6 = Nature** (Green) - Thunder and vines
- **7 = Healing** (Yellow) - Life energy
- **8 = Chaos** (Rainbow) - Unpredictable magic

**Example Generation**: You roll [3, 4, 4, 7] → You receive Shadow, Fire, Fire, Healing spheres

**Sphere Banking (Unlimited During Combat)**:
- Spheres persist in your resource bar until spent or until combat ends
- No maximum limit—you can accumulate dozens of spheres if you keep banking
- All spheres vanish when combat ends (you start fresh each fight)
- You can mix spheres from different turns freely

**Example Banking**:
- Turn 1: Roll Fire, Fire, Ice, Healing → Bank all 4 (don't cast)
- Turn 2: Roll Arcane, Shadow, Nature, Chaos → Now have 8 total spheres
- Turn 3: Roll Holy, Fire, Ice, Nature → Now have 12 total spheres
- You can now cast a 4-sphere ultimate and still have 8 spheres remaining

**Casting Spells (Spending Spheres)**:
Select 2, 3, or 4 spheres from your resource bar and combine them:
- **2-Sphere Spells**: Any combination from the 8x8 matrix (64 possible spells) - Cost: 5 mana
- **3-Sphere Spells**: Special recipe combinations (limited specific combos) - Cost: 10 mana
- **4-Sphere Spells**: Ultimate recipe combinations (limited specific combos) - Cost: 15 mana

**Example Casting**: You have Fire, Fire, Ice, Healing banked
- Option 1: Spend Fire + Fire → Cast "Flame Burst" (pure fire damage)
- Option 2: Spend Fire + Ice → Cast "Steam Blast" (mixed damage + slow)
- Option 3: Spend Fire + Healing → Cast "Cauterize" (damage + heal over time)
- Option 4: Save all 4 for next turn to build toward a 4-sphere ultimate

**Mana Costs** (You still need mana to cast):
- 2-Sphere Spells: 5 mana
- 3-Sphere Spells: 10 mana
- 4-Sphere Spells: 15 mana

**Important**: Having the spheres isn't enough—you also need the mana to cast. Manage both resources carefully.`
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
        ['6', 'Nature', 'Thunder/Vines', 'Nature damage, restraint, poison, terrain'],
        ['7', 'Healing', 'Life Energy', 'Healing, regeneration, buffs, cleansing'],
        ['8', 'Chaos', 'Unpredictability', 'Random effects, wild magic, variable damage']
      ]
    },
    
    strategicConsiderations: {
      title: 'Strategic Considerations',
      content: `**When to Save Spheres**:
- You rolled elements that don't synergize well
- You're building toward a specific 3 or 4-sphere recipe
- Combat is going well and you can afford to invest in future power
- You want specific elements for next turn's combinations

**When to Spend Immediately**:
- You rolled a powerful 2-sphere combination
- You need immediate damage or healing
- You're low on mana and can't afford bigger combos
- The tactical situation requires immediate action

**Combination Priority**:
- **Pure Element Combos** (Fire+Fire, Ice+Ice): High focused damage
- **Opposing Elements** (Fire+Ice, Holy+Shadow): Unique mixed effects
- **Healing Combos**: Essential for party support
- **Chaos Combos**: High risk, high reward, unpredictable

**Advanced Tactics**:
- Track which spheres you're banking for multi-turn setups
- Learn enemy resistances and adapt element choices
- Coordinate with party for combo opportunities
- Save Chaos spheres for desperate situations`
    },

    practicalExample: {
      title: 'Practical Decision-Making Example',
      content: `**Scenario**: You're fighting a fire elemental (resistant to fire, weak to ice) and two goblin archers.

**Turn 1 Roll**: [4, 4, 5, 7] → Fire, Fire, Ice, Healing

**Bad Decision**: "I'll cast Fire+Fire for maximum damage!"
- Result: Wasted spheres on a fire-resistant enemy, minimal damage

**Good Decision**: "I'll cast Ice+Healing for a frost heal combo on our tank, and bank the two Fire spheres for the goblins next turn."
- Result: Tank gets healed + frost armor buff, Fire spheres saved for fire-vulnerable goblins

**Turn 2 Roll**: [1, 3, 6, 8] → Arcane, Shadow, Nature, Chaos

**Your Banked Spheres**: Fire, Fire (from Turn 1)
**Total Available**: Fire, Fire, Arcane, Shadow, Nature, Chaos (6 spheres)

**Decision Point**:
- Option A: Fire+Fire on goblins (good damage, uses banked spheres effectively)
- Option B: Arcane+Shadow+Nature+Chaos for a 4-sphere ultimate (massive AoE, hits everything)
- Option C: Fire+Arcane on one goblin, save rest for Turn 3

**Best Choice**: Option A (Fire+Fire on goblins)
- Why: Fire elemental is nearly dead, goblins are the real threat, Fire+Fire deals heavy damage to fire-vulnerable targets, conserves mana (only 5 mana vs 15 for ultimate), leaves you with 4 spheres banked for flexibility

**The Lesson**: Don't just cast the biggest spell—cast the RIGHT spell for the situation. Your sphere bank is a toolbox, not a scoreboard.`
    },

    playingInPerson: {
      title: 'Playing in Person',
      subtitle: 'Physical Tracking for Tabletop Play',
      content: `The Arcanoneer's sphere system translates beautifully to physical tabletop play with simple materials. Here's how to track your elemental spheres without a digital interface:

**Required Materials**:
- **4d8 dice** (standard eight-sided dice for sphere generation)
- **Colored tokens, beads, or glass stones** representing the 8 elements (at least 20 of each color)
- **A sphere tracking mat or play area** (can be a simple piece of paper divided into sections)
- **Reference card** with the d8-to-element conversion chart

**Recommended Token Colors**:
- **Arcane (1)**: Purple beads or tokens
- **Holy (2)**: Gold/yellow beads or tokens
- **Shadow (3)**: Black beads or tokens
- **Fire (4)**: Red beads or tokens
- **Ice (5)**: Blue beads or tokens
- **Nature (6)**: Green beads or tokens
- **Healing (7)**: White or light yellow beads or tokens
- **Chaos (8)**: Rainbow/multicolored beads or clear iridescent tokens

**Turn-by-Turn Process**:

1. **Start of Your Turn**: Roll your 4d8 dice
2. **Generate Spheres**: For each die result, take a token of the corresponding color and place it in your "Sphere Bank" area
3. **Bank or Spend**: Decide whether to cast a spell (spend tokens) or save them for later
4. **Casting a Spell**: Remove the required tokens from your bank and announce the combination (e.g., "Fire + Fire for Flame Burst")
5. **End of Combat**: Clear all tokens from your Sphere Bank (they don't persist between fights)

**Tracking Setup Example**:

Create a simple play mat with three zones:
- **Generation Zone**: Where you place your 4d8 dice after rolling
- **Sphere Bank**: Where you organize your accumulated tokens by color
- **Spent Zone**: Where you place tokens after casting (to track what you've used)

**Organization Tips**:
- **Sort by Color**: Keep tokens organized in your Sphere Bank by element type for quick visual reference
- **Use a Dice Tray**: Roll your 4d8 in a tray to prevent them from scattering
- **Keep a Combination Matrix**: Have a printed reference sheet showing 2-sphere, 3-sphere, and 4-sphere combinations
- **Track Mana Separately**: Use a d20 or separate counter for your mana pool (you need mana to cast even if you have spheres)

**Budget-Friendly Alternatives**:
- **No tokens?** Use different colored dice as markers (d6s work great)
- **No colored items?** Use paper slips labeled with element names
- **Minimalist approach**: Simply write tally marks on paper under each element name
- **Digital hybrid**: Use a phone app to track spheres while playing in person

**Quick Reference Card Template**:
\`\`\`
ARCANONEER SPHERE GENERATION
Roll 4d8 each turn:
1 = Arcane (Purple)    5 = Ice (Blue)
2 = Holy (Gold)        6 = Nature (Green)
3 = Shadow (Black)     7 = Healing (White)
4 = Fire (Red)         8 = Chaos (Rainbow)

MANA COSTS:
2-Sphere Spell = 5 mana
3-Sphere Spell = 10 mana
4-Sphere Spell = 15 mana
\`\`\`

**Example In-Person Turn**:

*You roll 4d8 and get: [4, 4, 5, 7]*

1. Take 2 red tokens (Fire), 1 blue token (Ice), 1 white token (Healing)
2. Place them in your Sphere Bank alongside any tokens from previous turns
3. Decide: "I'll cast Fire + Ice for Steam Blast"
4. Remove 1 red and 1 blue token from your bank, place them in the Spent Zone
5. Pay 5 mana and resolve the spell
6. Your remaining tokens (1 Fire, 1 Healing) stay in your bank for next turn

**Why This Works**: The physical act of rolling dice and moving tokens creates a tactile, engaging experience that mirrors the digital resource bar. You can see your sphere collection grow, feel the weight of decision-making as you pick up tokens to spend them, and experience the randomness of sphere generation in a visceral way. Many players find the physical version even more satisfying than the digital one.`
    }
  },

  // Specializations
  specializations: {
    title: 'Arcanoneer Specializations',
    subtitle: 'Three Paths of Elemental Mastery',

    description: `Every Arcanoneer chooses one of three specializations that define their approach to sphere combination. Each specialization focuses on a dramatically different aspect of the sphere system, creating distinct playstyles.`,

    specs: [
      {
        id: 'prism_mage',
        name: 'Prism Mage',
        icon: 'Fire/Fiery Bolt',
        color: '#FF4500',
        theme: 'Pure Element Mastery',

        description: `Prism Mages focus on mastering specific elements and pure element combinations. Rather than mixing everything together, they perfect the art of elemental purity, gaining tremendous power when using the same element multiple times. They can reroll unwanted spheres to fish for their preferred elements.`,

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
            description: 'You can reroll spheres to get desired elements (costs 1 mana per reroll). Pure element combinations (same element twice) deal 50% bonus damage. You gain resistance to the element type you\'ve used most this combat.',
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

        description: `Entropy Weavers embrace the unpredictable nature of sphere generation, turning randomness into raw power. They roll extra spheres, make Chaos combinations devastatingly powerful, and can trigger wild magic surges that create unexpected battlefield effects. Where others see chaos, they see opportunity.`,

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
            description: 'Roll 5d8 for sphere generation (instead of 4d8). All Chaos element combinations deal double damage. When you use a Chaos sphere in any combination, roll on the Wild Magic Surge table for an additional random effect. Once per turn, you can convert any sphere to Chaos (costs 2 mana).',
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

        description: `Sphere Architects are masters of sphere manipulation and control. They can swap sphere types, store more spheres efficiently, and manipulate their combinations with surgical precision. Where Prism Mages focus on purity and Entropy Weavers embrace randomness, Sphere Architects control every aspect of their magic.`,

        playstyle: 'Sphere manipulation, precise control, efficient banking, tactical mastery',

        strengths: [
          'Can swap any 2 spheres for different elements (once per turn, costs 3 mana)',
          'Can store up to 12 spheres (instead of unlimited but inefficient)',
          'Reduce mana cost of 3-sphere spells by 3 (10→7 mana)',
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
            description: 'Once per turn, you can swap any 2 spheres for different element types (costs 3 mana total). You can store up to 12 spheres efficiently. 3-sphere spells cost 3 less mana (10→7). You can "lock" 1 sphere type at end of turn to guarantee that element appears in your next roll.',
            uniqueTo: 'Sphere Architect'
          }
        ],

        recommendedFor: 'Players who want precise control, tactical planning, and sphere manipulation mastery'
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
      description: 'You channel raw arcane energy through your fingertips, condensing it into a crackling bolt of pure magical force. The spell manifests as a brilliant purple-white spark that streaks through the air with a distinctive hum, leaving a brief trail of shimmering energy in its wake. Upon impact, the bolt releases its stored arcane power in a small but precise burst, disrupting the target\'s magical defenses and dealing direct force damage. This is the foundation of arcane combat—simple, reliable, and endlessly versatile.',
      level: 1,
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
        resourceValues: { mana: 5, arcane_sphere: 2 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal', 'somatic'],
        verbalText: 'Arcanum Ignis!',
        somaticText: 'Extend index finger, arcane energy crackling and coalescing at the tip before launching forward'
      },

      effectTypes: ['damage'],

      damageConfig: {
        formula: '1d4 + intelligence/4',
        damageTypes: ['arcane'],
        resolution: 'DICE',
        description: 'The bolt strikes with precise arcane force, disrupting the target\'s magical essence and dealing direct damage to their life force. The impact leaves a brief shimmering mark where the energy was absorbed.'
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
      description: 'You channel the essence of winter through your palm, causing your hand to glow with an ethereal blue-white light as rime frost spreads across your skin. When you make contact with your target, the freezing energy transfers instantly, causing their flesh to flash-freeze at the point of contact. Ice crystals spread outward from the touch point, numbing muscles and slowing their movements. The cold seeps deep into their bones, making every motion feel sluggish and heavy. Steam rises from where your frozen hand meets their warm skin, and they can feel the chill spreading through their limbs like a creeping numbness.',
      level: 1,
      spellType: 'ACTION',
      icon: 'Frost/Frost Touch',
      
      typeConfig: {
        school: 'frost',
        icon: 'Frost/Frost Touch',
        tags: ['cold', 'damage', 'debuff', 'touch', 'starter'],
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
        resourceValues: { mana: 5, ice_sphere: 2 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal', 'somatic'],
        verbalText: 'Glacies Contactus!',
        somaticText: 'Palm glows with blue-white frost energy, rime spreading across your hand as you reach out to touch the target'
      },

      effectTypes: ['damage', 'debuff'],

      damageConfig: {
        formula: '1d4 + intelligence/4',
        damageTypes: ['frost'],
        resolution: 'DICE',
        description: 'The freezing touch causes instant tissue damage as cells rupture from rapid temperature change. Ice crystals form beneath the skin, and the target feels a deep, penetrating cold that makes their muscles ache.'
      },

      debuffConfig: {
        debuffType: 'statusEffect',
        effects: [{
          id: 'slowed',
          name: 'Frozen Limbs',
          description: 'The freezing energy has numbed your muscles and stiffened your joints. Your movement speed is reduced by 10 feet as every step feels heavy and sluggish. Ice crystals continue to form in your extremities, making quick movements difficult. The cold seeps deeper with each passing moment, and you can feel your reflexes slowing as your body struggles against the magical frost.',
          statusType: 'slow',
          level: 'minor'
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
      description: 'You channel the restorative power of life itself, causing your hands to glow with a warm, golden-white radiance that pulses with gentle energy. A beam of pure healing light extends from your fingertips, finding its way to your target like a homing beacon of warmth and comfort. As the light touches them, wounds begin to close, bruises fade, and the target feels a wave of soothing energy wash through their body. The light seems to seek out injuries, mending torn flesh, knitting broken skin, and easing pain with its gentle touch. The healing is accompanied by a feeling of warmth and vitality, as if the target is being bathed in the first rays of morning sunlight.',
      level: 1,
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
        resourceValues: { mana: 5, healing_sphere: 2 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal', 'somatic'],
        verbalText: 'Lux Sanare!',
        somaticText: 'Hands glow with golden-white radiance, extending a beam of warm healing light toward the target'
      },

      effectTypes: ['healing'],

      healingConfig: {
        formula: '1d6 + spirit/3',
        healingType: 'direct',
        resolution: 'DICE',
        description: 'The healing light mends wounds, closes cuts, and restores vitality. The target feels their pain fade as torn flesh knits together, and a warm, revitalizing energy flows through their body, restoring lost health and easing their suffering.'
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
      description: 'With a quick incantation, you weave together arcane and holy energies to create a small but unerring bolt of pure magical force. The missile manifests as a glowing orb of violet-white energy that hovers briefly before your hand, then streaks toward your target with impossible accuracy. Unlike other projectiles, this missile cannot be dodged or blocked by conventional means—it bends around obstacles and adjusts its trajectory mid-flight, guided by your will. The missile strikes with a sharp crack of released energy, delivering its payload of pure force directly to the target. The combination of arcane precision and holy guidance makes this spell both reliable and devastating.',
      level: 1,
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
        resourceValues: { mana: 5, arcane_sphere: 1, holy_sphere: 1 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal'],
        verbalText: 'Missile Arcanum!'
      },

      effectTypes: ['damage'],

      damageConfig: {
        formula: '1d3 + intelligence/4',
        damageTypes: ['force'],
        resolution: 'DICE',
        description: 'The unerring missile strikes with pinpoint accuracy, delivering a concentrated burst of pure force energy. The impact feels like being struck by an invisible hammer, causing internal trauma as the force energy disrupts the target\'s body from within.'
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
      description: 'You channel the raw power of nature, causing the very earth beneath your target to come alive. The ground cracks and splits as thick, thorny vines erupt from the soil with explosive force, their green-brown tendrils reaching upward like grasping hands. The vines immediately wrap around your target\'s legs and torso, their thorns digging into flesh and clothing alike. As they constrict, the vines pulse with verdant energy, dealing nature damage while simultaneously binding the target in place. The thorns inject a mild toxin that causes the target\'s muscles to stiffen, making escape even more difficult. The vines continue to grow and tighten, their grip becoming more secure with each passing moment.',
      level: 1,
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
        resourceValues: { mana: 5, nature_sphere: 2 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal', 'somatic'],
        verbalText: 'Vinea Crescere!',
        somaticText: 'Point at the ground, causing the earth to crack as vines erupt upward',
        spheres: ['Nature', 'Nature']
      },

      effectTypes: ['damage', 'control'],

      damageConfig: {
        formula: '1d4 + intelligence/4',
        damageTypes: ['nature'],
        resolution: 'DICE',
        description: 'The thorny vines dig deep into the target\'s flesh, their barbs tearing at skin and muscle. Nature energy flows through the thorns, causing the wounds to burn with an unnatural green fire as the vines continue to constrict.'
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
          description: 'Thick, thorny vines have wrapped around your legs and torso, their grip tightening with each passing moment. You are completely immobilized, unable to move from your current position. The thorns dig deeper with every struggle, and you can feel the vines pulsing with unnatural life as they continue to grow and constrict. Breaking free requires tremendous strength, and even then, the thorns will leave deep scratches and puncture wounds.',
          config: {
            restraintType: 'physical'
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
      description: 'You masterfully combine the opposing forces of fire and ice, holding a sphere of flame in one hand and a shard of ice in the other. As you bring them together, the conflicting energies react violently, creating a massive cloud of superheated steam that erupts forward in a wide cone. The steam is scalding hot, causing immediate burns to exposed skin, while the rapid temperature change creates painful blisters. The thick, opaque cloud completely obscures vision, leaving targets blind and disoriented as they struggle to breathe in the suffocating mist. The steam continues to expand outward, carrying with it the dual nature of its creation—both the burning heat of fire and the numbing cold of ice.',
      level: 2,
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
        resourceValues: { mana: 5, fire_sphere: 1, ice_sphere: 1 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal', 'somatic'],
        verbalText: 'Vapor Eruptio!',
        somaticText: 'Hold fire sphere in one hand and ice shard in the other, then bring them together to create explosive steam',
        spheres: ['Fire', 'Ice']
      },

      effectTypes: ['damage', 'debuff'],

      damageConfig: {
        formula: '1d6 + intelligence/3',
        damageTypes: ['frost', 'fire'],
        resolution: 'DICE'
      },

      debuffConfig: {
        debuffType: 'statusEffect',
        effects: [{
          id: 'disoriented',
          name: 'Blinded by Steam',
          description: 'Thick, opaque steam clouds your vision completely. You cannot see anything beyond a few inches in front of your face, and your eyes burn and water from the scalding mist. You automatically fail all sight-based perception checks and cannot target enemies beyond melee range. When attacking, you must roll two d20s and take the lower result, as you struggle to aim through the blinding steam. The steam also makes breathing difficult, causing you to cough and gasp, further reducing your combat effectiveness.',
          statusType: 'blinded',
          level: 'minor'
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
      description: 'You draw upon the void itself, pulling shadow and darkness into your palm where it coalesces into a writhing sphere of pure negative energy. The bolt appears to absorb light from its surroundings, creating a visible distortion in the air around it. When you hurl it forward, it leaves a trail of absolute darkness in its wake, as if it\'s tearing a hole through reality itself. Upon impact, the shadow energy doesn\'t just damage—it actively drains life force from the target, causing them to feel a deep, soul-chilling cold as their vitality is siphoned away. The bolt seems to feed on their life energy, growing darker and more potent as it consumes their essence.',
      level: 2,
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
        resourceValues: { mana: 5, shadow_sphere: 2 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal', 'somatic'],
        verbalText: 'Umbra Vitae Draconis!',
        somaticText: 'Pull shadow energy from the void into your palm, forming a writhing sphere of darkness before hurling it forward',
        spheres: ['Shadow', 'Shadow']
      },

      effectTypes: ['damage'],

      damageConfig: {
        formula: '1d8 + intelligence/3',
        damageTypes: ['necrotic'],
        resolution: 'DICE',
        description: 'The shadow bolt strikes with necrotic force, actively draining life energy from the target. They feel their vitality being siphoned away, experiencing a deep cold that seems to come from within their very soul. The wound left behind appears blackened and necrotic, as if the flesh itself has died.'
      },

      cooldownConfig: {
        cooldownType: 'turn_based',
        cooldownValue: 0
      },

      tags: ['shadow', 'damage']
    },

    {
      id: 'arc_celestial_ray',
      name: 'Celestial Ray',
      description: 'You weave together arcane precision and holy power, creating a brilliant beam of pure celestial light that extends in a straight line before you. The ray is intelligent, somehow able to distinguish friend from foe—it burns enemies with searing radiant energy while simultaneously healing allies with its warm, restorative glow. The light is so bright it leaves afterimages in the eyes of those who witness it, and it seems to pulse with divine purpose. Enemies caught in the beam feel their flesh burn as if exposed to pure sunlight, while allies experience a wave of healing energy that mends wounds and restores vitality. The ray creates a visible path of light that lingers for a moment, marking the path of divine judgment and mercy.',
      level: 2,
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
        resourceValues: { mana: 5, arcane_sphere: 1, holy_sphere: 1 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal', 'somatic'],
        verbalText: 'Lux Arcanum Divinus!',
        somaticText: 'Extend arm forward, palm open, as a brilliant beam of celestial light erupts from your fingertips',
        spheres: ['Arcane', 'Holy']
      },

      effectTypes: ['damage', 'healing'],

      damageConfig: {
        formula: '1d8 + intelligence/3',
        damageTypes: ['radiant'],
        resolution: 'DICE',
        description: 'The celestial ray burns enemies with searing radiant energy, as if they\'ve been exposed to concentrated sunlight. Their flesh smokes and chars where the light touches, and they feel an intense burning sensation that seems to come from within their very soul.'
      },

      healingConfig: {
        formula: '1d6 + spirit/3',
        healingType: 'direct',
        resolution: 'DICE',
        description: 'The same celestial light that burns enemies heals allies, its warm radiance mending wounds, closing cuts, and restoring vitality. Allies feel a wave of comfort and strength wash through them as the light touches their skin.'
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
        resourceValues: { mana: 5, fire_sphere: 2 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal', 'somatic'],
        verbalText: 'Ignis Sagitta!',
        somaticText: 'Hurl fire bolt',
        spheres: ['Fire', 'Fire']
      },

      effectTypes: ['damage'],

      damageConfig: {
        formula: '2d6 + intelligence/2',
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
      description: 'A sharp shard of ice that pierces your target, dealing cold damage and slowing them.',
      level: 3,
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
        resourceValues: { mana: 5, ice_sphere: 2 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal', 'somatic'],
        verbalText: 'Glacies Fragmentum!',
        somaticText: 'Hurl ice shard',
        spheres: ['Ice', 'Ice']
      },

      effectTypes: ['damage', 'debuff'],

      damageConfig: {
        formula: '2d6 + intelligence/2',
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
          level: 'minor'
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
      description: 'You compress pure arcane energy between your palms, feeling it build and intensify until it becomes unstable. When you release it, the energy explodes outward in a massive burst of violet-white force that ripples through the air like a shockwave. The detonation creates a visible distortion in reality itself, as if space is being torn apart by the raw magical power. The force wave strikes everything in the area simultaneously, dealing devastating damage and leaving targets disoriented as their senses are overwhelmed by the chaotic arcane energy. The explosion leaves behind a lingering field of unstable magic that continues to disrupt concentration and balance.',
      level: 3,
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
        resourceValues: { mana: 5, arcane_sphere: 2 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal', 'somatic'],
        verbalText: 'Arcanum Detonare!',
        somaticText: 'Compress arcane energy between palms until it glows intensely, then clap hands together to release the explosive burst',
        spheres: ['Arcane', 'Arcane']
      },

      effectTypes: ['damage', 'debuff'],

      damageConfig: {
        formula: '2d6 + intelligence/2',
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
          description: 'The chaotic arcane energy has overwhelmed your senses and disrupted your mental focus. Your vision swims with afterimages of violet-white light, your ears ring with the echo of the detonation, and your balance feels off-kilter. You suffer -2 to all attack rolls and saving throws as you struggle to maintain concentration. There\'s a chance you may stumble in a random direction on your turn as your sense of direction is temporarily scrambled by the arcane disruption.',
          statusType: 'dazed',
          level: 'moderate'
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
      description: 'You channel immense fire energy, causing the air around you to shimmer with heat distortion. As you raise your hands, flames begin to spiral outward, building into a massive vortex of fire that descends upon the target area like a meteor strike. The firestorm doesn\'t just explode—it creates a sustained inferno that continues to burn for several seconds, igniting everything in its path. The ground itself catches fire, creating a dangerous zone of burning terrain that continues to damage anyone who remains within it. The heat is so intense that the air itself seems to catch fire, and targets feel their skin blister and char even as they try to escape the conflagration.',
      level: 4,
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
        resourceValues: { mana: 5, fire_sphere: 2 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal', 'somatic'],
        verbalText: 'Ignis Tempestas Infernalis!',
        somaticText: 'Raise both hands high as flames spiral outward, building into a massive fire vortex that descends upon the target area',
        spheres: ['Fire', 'Fire']
      },

      effectTypes: ['damage'],

      damageConfig: {
        formula: '3d6 + intelligence',
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
      description: 'You draw upon the deepest cold of the frozen wastes, causing your body to radiate an aura of absolute zero. As you spread your arms wide, a wave of freezing energy explodes outward in all directions, creating a visible shockwave of ice crystals and frozen air. The nova doesn\'t just damage—it flash-freezes everything in its path, causing water to instantly turn to ice, breath to crystallize, and movement to become sluggish as muscles stiffen from the cold. The ground becomes slick with ice, and a layer of frost coats every surface. Those caught in the blast feel their very blood begin to freeze, their movements becoming slow and laborious as their bodies struggle against the magical cold.',
      level: 4,
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
        resourceValues: { mana: 5, ice_sphere: 2 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal', 'somatic'],
        verbalText: 'Glacies Nova Absoluta!',
        somaticText: 'Spread arms wide as your body radiates freezing energy, unleashing a wave of ice crystals in all directions',
        spheres: ['Ice', 'Ice']
      },

      effectTypes: ['damage', 'debuff'],

      damageConfig: {
        formula: '3d6 + intelligence',
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
          description: 'The magical cold has penetrated deep into your muscles and joints, causing them to stiffen and freeze. Your movement speed is reduced by half as every step feels like wading through ice. Your fingers are numb, your joints ache, and your reflexes are slowed. The ground beneath you is slick with ice, making movement treacherous. Breaking free of this frozen state requires tremendous willpower and physical resilience.',
          statusType: 'slow',
          level: 'moderate'
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
        resourceValues: { mana: 5, shadow_sphere: 2 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal', 'somatic'],
        verbalText: 'Umbra Amplexus!',
        somaticText: 'Reach out with shadow tendrils',
        spheres: ['Shadow', 'Shadow']
      },

      effectTypes: ['damage', 'debuff'],

      damageConfig: {
        formula: '3d6 + intelligence',
        damageTypes: ['necrotic'],
        resolution: 'DICE',
        dotConfig: {
          enabled: true,
          damagePerTick: '1d4',
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
        resourceValues: { mana: 5, fire_sphere: 1, ice_sphere: 1 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Elementum Explosio!',
        somaticText: 'Combine fire and ice spheres',
        spheres: ['Fire', 'Ice']
      },

      effectTypes: ['damage'],

      damageConfig: {
        formula: '2d8 + intelligence',
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
        resourceValues: { mana: 5, holy_sphere: 1, healing_sphere: 1 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal', 'somatic'],
        verbalText: 'Sanctus Sanare!',
        somaticText: 'Channel divine healing energy',
        spheres: ['Holy', 'Healing']
      },

      effectTypes: ['healing'],

      healingConfig: {
        formula: '3d8 + spirit',
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
        resourceValues: { mana: 5, chaos_sphere: 2 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal', 'somatic'],
        verbalText: 'Chaos Sagitta!',
        somaticText: 'Hurl chaotic energy',
        spheres: ['Chaos', 'Chaos']
      },

      effectTypes: ['damage'],

      damageConfig: {
        formula: '2d10 + intelligence',
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
      description: 'You weave ice, healing, and holy spheres into a shimmering lattice of protective frost and divine light. The blessing settles over your target like a coat of crystalline armor, its facets refracting golden radiance. Wounds close beneath the icy shell as restorative energy pulses through their body, leaving them both healed and shielded by a layer of enchanted frost.',
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
        resourceValues: { mana: 10, ice_sphere: 1, healing_sphere: 1, holy_sphere: 1 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal', 'somatic'],
        verbalText: 'Glacies Benedicere!',
        somaticText: 'Weave the three spheres into a crystalline lattice and press it gently onto the target',
        spheres: ['Ice', 'Healing', 'Holy']
      },

      effectTypes: ['healing', 'buff'],

      healingConfig: {
        formula: '2d8 + spirit',
        healingType: 'direct',
        resolution: 'DICE'
      },

      buffConfig: {
        buffType: 'statEnhancement',
        effects: [{
          id: 'frost_armor',
          name: 'Frost Armor',
          description: 'Gain +2 armor and 50% cold resistance for 3 rounds. A layer of protective enchanted ice forms around you, deflecting blows and absorbing frost.',
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
      description: 'You fuse arcane force, holy radiance, and nature energy into a shimmering dome of multicolored protective energy. The ward expands outward from your position, washing over allies in a wave of cleansing light that strips away harmful effects and leaves behind a faint prismatic shimmer—a shield that absorbs incoming damage for a short time.',
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
        resourceValues: { mana: 10, arcane_sphere: 1, holy_sphere: 1, nature_sphere: 1 },
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
      description: 'You combine nature, healing, and holy spheres into a swirling orb of emerald and gold energy. When released, it blooms into a field of luminous wildflowers and soft golden light that settles over the area. Allies within the field feel their wounds slowly close as nature energy knits flesh and bone back together over several rounds.',
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
        resourceValues: { mana: 10, nature_sphere: 1, healing_sphere: 1, holy_sphere: 1 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Floreo Sanitas!',
        somaticText: 'Release the merged spheres into the ground, causing healing wildflowers to bloom across the area',
        spheres: ['Nature', 'Healing', 'Holy']
      },

      effectTypes: ['healing'],

      healingConfig: {
        formula: '1d8 + spirit/2',
        healingType: 'direct',
        resolution: 'DICE',
        hotConfig: {
          enabled: true,
          healPerTick: '1d6 + spirit/3',
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
      description: 'You weave arcane, shadow, and chaos spheres into a swirling vortex of dimensional energy around yourself. Reality shudders as you step sideways through the fabric of space, vanishing in a flash of violet-black light and reappearing up to 40 feet away. At your departure point, an afterimage of crackling void energy persists for a moment, discharging into any enemies caught nearby.',
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
        resourceValues: { mana: 10, arcane_sphere: 1, shadow_sphere: 1, chaos_sphere: 1 },
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
        formula: '2d6 + intelligence/2',
        damageTypes: ['force'],
        resolution: 'DICE',
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
      description: 'You hold fire, ice, nature, and holy spheres aloft, each orbiting your hand in a tight spiral. With a sharp command word, they launch simultaneously—a bolt of flame, a shard of ice, a crackling nature lance, and a beam of holy light—all converging on the target area in a devastating cross-pattern impact. Each element reinforces the others, creating a prismatic explosion that overwhelms elemental resistances.',
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
        resourceValues: { mana: 15, fire_sphere: 1, ice_sphere: 1, nature_sphere: 1, holy_sphere: 1 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Elementum Procella!',
        somaticText: 'Launch all four elemental spheres simultaneously at the target area',
        spheres: ['Fire', 'Ice', 'Nature', 'Holy']
      },

      effectTypes: ['damage'],

      damageConfig: {
        formula: '4d6 + intelligence',
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
      description: 'You combine holy, healing, and arcane spheres into a radiant tempest that splits into two distinct energies—searing golden light that scorches enemies, and gentle restorative warmth that mends allied wounds. The storm is intelligent, its tendrils of light curving around allies to strike at foes while leaving a healing glow in their wake.',
      level: 7,
      spellType: 'ACTION',
      icon: 'Radiant/Radiant Divinity',
      
      typeConfig: {
        school: 'evocation',
        icon: 'Radiant/Radiant Divinity',
        tags: ['holy', 'healing', 'arcane', 'damage', 'healing', 'aoe'],
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
        resourceValues: { mana: 10, holy_sphere: 1, healing_sphere: 1, arcane_sphere: 1 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Tempestas Caelestis!',
        somaticText: 'Raise all three spheres skyward, causing a radiant storm to descend upon the area',
        spheres: ['Holy', 'Healing', 'Arcane']
      },

      effectTypes: ['damage', 'healing'],

      damageConfig: {
        formula: '3d8 + intelligence/2',
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
        formula: '2d8 + spirit',
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
      description: 'You weave holy, shadow, healing, and chaos spheres into an impossible harmony—light and dark, order and entropy, all singing together in a single sustained chord of elemental resonance. The convergence radiates outward as a warm pulse of prismatic energy that fills allies with renewed vigor, mending deep wounds and temporarily attuning their bodies to resist incoming harm.',
      level: 8,
      spellType: 'ACTION',
      icon: 'Healing/Golden Heart',
      
      typeConfig: {
        school: 'restoration',
        icon: 'Healing/Golden Heart',
        tags: ['holy', 'shadow', 'healing', 'chaos', 'healing', 'buff', 'aoe'],
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
        resourceValues: { mana: 15, holy_sphere: 1, shadow_sphere: 1, healing_sphere: 1, chaos_sphere: 1 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Harmonia Convergentia!',
        somaticText: 'Hold all four spheres at arm\'s length, letting them orbit and merge into a single chord of resonant energy',
        spheres: ['Holy', 'Shadow', 'Healing', 'Chaos']
      },

      effectTypes: ['healing', 'buff'],

      healingConfig: {
        formula: '4d8 + spirit',
        healingType: 'direct',
        resolution: 'DICE'
      },

      buffConfig: {
        buffType: 'custom',
        effects: [{
          id: 'harmonic_attunement',
          name: 'Harmonic Attunement',
          description: 'All allies gain +2 to saving throws and resistance to all damage types (half damage) for 2 rounds. The harmonic resonance continues to vibrate through their bodies, deflecting harmful energy.',
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

      tags: ['holy', 'shadow', 'healing', 'chaos', 'healing', 'buff', 'aoe']
    },

    {
      id: 'arc_elemental_maelstrom',
      name: 'Elemental Maelstrom',
      description: 'You force arcane, fire, ice, and nature spheres into a volatile fusion, launching the unstable mass at a target area where it detonates into a raging maelstrom of conflicting elements. Fire and frost spiral together, lightning crackles through the flames, and arcane force binds it all into a localized storm that batters everything within. The rapid temperature shifts and elemental chaos leave survivors disoriented and sluggish.',
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
        resourceValues: { mana: 15, arcane_sphere: 1, fire_sphere: 1, ice_sphere: 1, nature_sphere: 1 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Maelstrom Elementum!',
        somaticText: 'Compress the four conflicting spheres into one unstable mass and hurl it at the target area',
        spheres: ['Arcane', 'Fire', 'Ice', 'Nature']
      },

      effectTypes: ['damage', 'control'],

      damageConfig: {
        formula: '4d8 + intelligence',
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
            recoveryMethod: 'automatic'
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
      description: 'You concentrate three chaos spheres into a single point of impossible instability. When released, the concentrated chaos tears reality apart in the target area, unleashing a whirlwind of random elemental forces. No two Chaos Storms are ever the same—the damage type shifts unpredictably between fire, frost, lightning, necrotic, and radiant with each heartbeat, making it impossible for enemies to prepare defenses.',
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
        resourceValues: { mana: 10, chaos_sphere: 3 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Tempestas Chaos!',
        somaticText: 'Compress three chaos spheres into a single unstable point and release it',
        spheres: ['Chaos', 'Chaos', 'Chaos']
      },

      effectTypes: ['damage'],

      damageConfig: {
        formula: '4d8 + intelligence',
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
      description: 'You channel all eight elemental spheres simultaneously—a feat of concentration that pushes the limits of mortal spellcasting. The spheres fight each other, opposing elements grinding together in a volatile chain reaction. When you release the fusion, it detonates in a prismatic shockwave that carries every element at once, tearing through defenses designed to resist any single type. The strain of controlling so many conflicting forces causes painful elemental backlash to the caster.',
      level: 9,
      spellType: 'ACTION',
      icon: 'Arcane/Ebon Blaze',
      
      typeConfig: {
        school: 'evocation',
        icon: 'Arcane/Ebon Blaze',
        tags: ['ultimate', 'damage', 'aoe', 'all-elements'],
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
        resourceValues: { mana: 25, arcane_sphere: 1, holy_sphere: 1, shadow_sphere: 1, fire_sphere: 1, ice_sphere: 1, nature_sphere: 1, healing_sphere: 1, chaos_sphere: 1 },
        useFormulas: {},
        actionPoints: 3,
        components: ['verbal', 'somatic'],
        verbalText: 'Elementum Cataclysmos!',
        somaticText: 'Force all eight spheres into a single volatile point of prismatic energy',
        spheres: ['Arcane', 'Holy', 'Shadow', 'Fire', 'Ice', 'Nature', 'Healing', 'Chaos']
      },

      effectTypes: ['damage'],

      damageConfig: {
        formula: '5d8 + intelligence',
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

      tags: ['ultimate', 'damage', 'aoe', 'all-elements', 'self-damage']
    },

    {
      id: 'arc_chaos_vortex',
      name: 'Chaos Vortex',
      description: 'You concentrate pure chaotic energy from four chaos spheres into a swirling vortex of unpredictable destruction. The vortex tears at the fabric of reality, pulling in light, sound, and matter as it spins. Its effects are impossible to predict—the damage shifts between elements, and the vortex occasionally spits out random bursts of wild magic. The chaotic feedback lashes back at you, but the sheer destructive power makes it worth the risk.',
      level: 9,
      spellType: 'ACTION',
      icon: 'Void/Corrupted Eye',
      
      typeConfig: {
        school: 'chaos',
        icon: 'Void/Corrupted Eye',
        tags: ['chaos', 'damage', 'aoe', 'ultimate'],
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
        resourceValues: { mana: 20, chaos_sphere: 4 },
        useFormulas: {},
        actionPoints: 3,
        components: ['verbal', 'somatic'],
        verbalText: 'Chaos Vorticem!',
        somaticText: 'Spiral hands to concentrate chaos energy into an unstable vortex',
        spheres: ['Chaos', 'Chaos', 'Chaos', 'Chaos']
      },

      effectTypes: ['damage'],

      damageConfig: {
        formula: '5d8 + intelligence',
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

      tags: ['chaos', 'damage', 'aoe', 'ultimate', 'self-damage']
    },

    {
      id: 'arc_arcane_synthesis',
      name: 'Arcane Synthesis',
      description: 'You carefully harmonize four opposing elements into a state of perfect equilibrium, creating a field of synthesized energy that enhances your allies\' combat capabilities. The balanced fusion empowers allied spellcasting and physical attacks while granting a regenerative aura. The precise control required leaves you briefly drained, but the tactical advantage for your party is substantial.',
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
        resourceValues: { mana: 20, arcane_sphere: 1, holy_sphere: 1, shadow_sphere: 1, fire_sphere: 1 },
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
        formula: '2d6 + spirit/2',
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
          isSelfDebuff: true
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
      description: 'The apex of elemental combination mastery. You force seven distinct elemental spheres into a single convergence point—a feat that visibly strains reality around you. The air cracks, light bends, and the ground trembles as the elements are compressed beyond their natural limits. When you release them, the convergence detonates in a cascading explosion of pure elemental destruction. The immense strain leaves you physically and magically exhausted.',
      level: 10,
      spellType: 'ACTION',
      icon: 'Arcane/Ebon Blaze',
      
      typeConfig: {
        school: 'evocation',
        icon: 'Arcane/Ebon Blaze',
        tags: ['ultimate', 'damage', 'aoe', 'mastery'],
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
        resourceValues: { mana: 35, arcane_sphere: 1, holy_sphere: 1, shadow_sphere: 1, fire_sphere: 1, ice_sphere: 1, nature_sphere: 1, healing_sphere: 1 },
        useFormulas: {},
        actionPoints: 3,
        components: ['verbal', 'somatic'],
        verbalText: 'Convergentia Elementum!',
        somaticText: 'Force all seven spheres into a single convergence point above your head, then release the cascading detonation',
        spheres: ['Arcane', 'Holy', 'Shadow', 'Fire', 'Ice', 'Nature', 'Healing']
      },

      effectTypes: ['damage'],

      damageConfig: {
        formula: '5d8 + intelligence * 1.5',
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
          mechanicsText: '',
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

      tags: ['ultimate', 'damage', 'aoe', 'mastery', 'self-damage', 'exhaustion']
    },

    {
      id: 'arc_dimensional_rift',
      name: 'Dimensional Rift',
      description: 'You tear open a temporary rift between dimensions using arcane precision, shadow manipulation, and concentrated chaos. The rift manifests as a swirling portal of violet-black energy that pulls at everything nearby. Enemies near the rift are bombarded by unstable void energy and experience dimensional disorientation—their sense of space warping as the rift distorts reality around them. The rift is difficult to control, and void energy lashes back at the caster.',
      level: 10,
      spellType: 'ACTION',
      icon: 'Void/Shadowy Blaze',
      
      typeConfig: {
        school: 'conjuration',
        icon: 'Void/Shadowy Blaze',
        tags: ['ultimate', 'damage', 'control', 'aoe', 'void'],
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
        resourceValues: { mana: 30, arcane_sphere: 1, shadow_sphere: 1, chaos_sphere: 2 },
        useFormulas: {},
        actionPoints: 3,
        components: ['verbal', 'somatic'],
        verbalText: 'Rima Dimensio!',
        somaticText: 'Tear reality apart with a sharp pulling motion, opening a swirling void portal',
        spheres: ['Arcane', 'Shadow', 'Chaos', 'Chaos']
      },

      effectTypes: ['damage', 'control'],

      damageConfig: {
        formula: '4d8 + intelligence',
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
            recoveryMethod: 'automatic'
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

      tags: ['ultimate', 'damage', 'control', 'aoe', 'void', 'self-damage']
    },

    {
      id: 'arc_elemental_apotheosis',
      name: 'Elemental Apotheosis',
      description: 'The ultimate expression of sphere mastery. You absorb six elemental spheres directly into your body, each one fusing with your flesh and spirit in a blinding prismatic transformation. Your eyes blaze with multicolored light, elemental energy crackles across your skin, and the air around you hums with barely contained power. For a brief time, you become a living conduit of pure elemental force—your spells hit harder, your body is armored in crystallized elements, and raw power radiates from your every movement.',
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
        resourceValues: { mana: 30, fire_sphere: 1, ice_sphere: 1, nature_sphere: 1, holy_sphere: 1, shadow_sphere: 1, arcane_sphere: 1 },
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
          description: 'For 4 rounds: +4 spell damage, +3 armor, resistance to fire/frost/lightning damage, and 2-sphere spells cost 0 mana. Your body radiates prismatic elemental energy, making you a living conduit of elemental force.',
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

