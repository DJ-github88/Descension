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
        icon: 'spell_fire_flamebolt',
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
        icon: 'spell_shadow_charm',
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
        icon: 'inv_misc_rune_01',
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
      // Level 6 spells
      'arc_glacial_blessing',
      'arc_thermal_surge',
      'arc_void_ray'
    ],
    7: [
      // Level 7 spells
      'arc_primal_arcane_tempest',
      'arc_elemental_fury',
      'arc_celestial_storm'
    ],
    8: [
      // Level 8 spells
      'arc_divine_cataclysm',
      'arc_void_inferno',
      'arc_chaos_storm'
    ],
    9: [
      // Level 9 spells
      'arc_primal_cataclysm',
      'arc_chaos_vortex',
      'arc_elemental_synthesis'
    ],
    10: [
      // Level 10 spells
      'arc_elemental_convergence',
      'arc_dimensional_rift',
      'arc_sphere_mastery'
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
      icon: 'spell_arcane_arcanepotency',
      
      typeConfig: {
        school: 'arcane',
        icon: 'spell_arcane_arcanepotency',
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

      resolution: 'DICE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '1d4 + intelligence/4',
        elementType: 'arcane',
        damageType: 'direct',
        description: 'The bolt strikes with precise arcane force, disrupting the target\'s magical essence and dealing direct damage to their life force. The impact leaves a brief shimmering mark where the energy was absorbed.'
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 0
      },

      tags: ['arcane', 'damage', 'starter']
    },

    {
      id: 'arc_frost_touch',
      name: 'Frost Touch',
      description: 'You channel the essence of winter through your palm, causing your hand to glow with an ethereal blue-white light as rime frost spreads across your skin. When you make contact with your target, the freezing energy transfers instantly, causing their flesh to flash-freeze at the point of contact. Ice crystals spread outward from the touch point, numbing muscles and slowing their movements. The cold seeps deep into their bones, making every motion feel sluggish and heavy. Steam rises from where your frozen hand meets their warm skin, and they can feel the chill spreading through their limbs like a creeping numbness.',
      level: 1,
      spellType: 'ACTION',
      icon: 'spell_frost_frostbolt',
      
      typeConfig: {
        school: 'frost',
        icon: 'spell_frost_frostbolt',
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

      resolution: 'DICE',
      effectTypes: ['damage', 'debuff'],

      damageConfig: {
        formula: '1d4 + intelligence/4',
        elementType: 'frost',
        damageType: 'direct',
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
        type: 'turn_based',
        value: 0
      },

      tags: ['ice', 'damage', 'debuff', 'touch', 'starter']
    },

    {
      id: 'arc_healing_light',
      name: 'Healing Light',
      description: 'You channel the restorative power of life itself, causing your hands to glow with a warm, golden-white radiance that pulses with gentle energy. A beam of pure healing light extends from your fingertips, finding its way to your target like a homing beacon of warmth and comfort. As the light touches them, wounds begin to close, bruises fade, and the target feels a wave of soothing energy wash through their body. The light seems to seek out injuries, mending torn flesh, knitting broken skin, and easing pain with its gentle touch. The healing is accompanied by a feeling of warmth and vitality, as if the target is being bathed in the first rays of morning sunlight.',
      level: 1,
      spellType: 'ACTION',
      icon: 'spell_holy_holybolt',
      
      typeConfig: {
        school: 'healing',
        icon: 'spell_holy_holybolt',
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

      resolution: 'DICE',
      effectTypes: ['healing'],

      healingConfig: {
        formula: '1d6 + spirit/3',
        healingType: 'direct',
        hasHotEffect: false,
        description: 'The healing light mends wounds, closes cuts, and restores vitality. The target feels their pain fade as torn flesh knits together, and a warm, revitalizing energy flows through their body, restoring lost health and easing their suffering.'
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 0
      },

      tags: ['healing', 'support', 'starter']
    },

    {
      id: 'arc_arcane_missile',
      name: 'Arcane Missile',
      description: 'With a quick incantation, you weave together arcane and holy energies to create a small but unerring bolt of pure magical force. The missile manifests as a glowing orb of violet-white energy that hovers briefly before your hand, then streaks toward your target with impossible accuracy. Unlike other projectiles, this missile cannot be dodged or blocked by conventional means—it bends around obstacles and adjusts its trajectory mid-flight, guided by your will. The missile strikes with a sharp crack of released energy, delivering its payload of pure force directly to the target. The combination of arcane precision and holy guidance makes this spell both reliable and devastating.',
      level: 1,
      spellType: 'ACTION',
      icon: 'spell_arcane_arcanetorrent',
      
      typeConfig: {
        school: 'arcane',
        icon: 'spell_arcane_arcanetorrent',
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

      resolution: 'DICE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '1d3 + intelligence/4',
        elementType: 'force',
        damageType: 'direct',
        description: 'The unerring missile strikes with pinpoint accuracy, delivering a concentrated burst of pure force energy. The impact feels like being struck by an invisible hammer, causing internal trauma as the force energy disrupts the target\'s body from within.'
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 0
      },

      tags: ['arcane', 'damage', 'starter']
    },

    {
      id: 'arc_nature_vine',
      name: 'Nature Vine',
      description: 'You channel the raw power of nature, causing the very earth beneath your target to come alive. The ground cracks and splits as thick, thorny vines erupt from the soil with explosive force, their green-brown tendrils reaching upward like grasping hands. The vines immediately wrap around your target\'s legs and torso, their thorns digging into flesh and clothing alike. As they constrict, the vines pulse with verdant energy, dealing nature damage while simultaneously binding the target in place. The thorns inject a mild toxin that causes the target\'s muscles to stiffen, making escape even more difficult. The vines continue to grow and tighten, their grip becoming more secure with each passing moment.',
      level: 1,
      spellType: 'ACTION',
      icon: 'spell_nature_stranglevines',
      
      typeConfig: {
        school: 'nature',
        icon: 'spell_nature_stranglevines',
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

      resolution: 'DICE',
      effectTypes: ['damage', 'control'],

      damageConfig: {
        formula: '1d4 + intelligence/4',
        elementType: 'nature',
        damageType: 'direct',
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
        type: 'turn_based',
        value: 0
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
      icon: 'spell_frost_frostbolt',
      
      typeConfig: {
        school: 'frost',
        secondaryElement: 'fire',
        icon: 'spell_frost_frostbolt',
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

      resolution: 'DICE',
      effectTypes: ['damage', 'debuff'],

      damageConfig: {
        formula: '1d6 + intelligence/3',
        elementType: 'frost',
        damageType: 'direct',
        secondaryElementType: 'fire',
        description: 'The scalding steam causes immediate burns as it contacts exposed skin. The rapid temperature change from the fire-ice reaction creates painful blisters and causes tissue damage. Targets feel both the burning heat and the numbing cold simultaneously, creating a uniquely painful experience.'
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
        type: 'turn_based',
        value: 0
      },

      tags: ['fire', 'ice', 'damage', 'debuff']
    },

    {
      id: 'arc_shadow_bolt',
      name: 'Shadow Bolt',
      description: 'You draw upon the void itself, pulling shadow and darkness into your palm where it coalesces into a writhing sphere of pure negative energy. The bolt appears to absorb light from its surroundings, creating a visible distortion in the air around it. When you hurl it forward, it leaves a trail of absolute darkness in its wake, as if it\'s tearing a hole through reality itself. Upon impact, the shadow energy doesn\'t just damage—it actively drains life force from the target, causing them to feel a deep, soul-chilling cold as their vitality is siphoned away. The bolt seems to feed on their life energy, growing darker and more potent as it consumes their essence.',
      level: 2,
      spellType: 'ACTION',
      icon: 'spell_shadow_shadowbolt',
      
      typeConfig: {
        school: 'necromancy',
        icon: 'spell_shadow_shadowbolt',
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

      resolution: 'DICE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '1d8 + intelligence/3',
        elementType: 'necrotic',
        damageType: 'direct',
        description: 'The shadow bolt strikes with necrotic force, actively draining life energy from the target. They feel their vitality being siphoned away, experiencing a deep cold that seems to come from within their very soul. The wound left behind appears blackened and necrotic, as if the flesh itself has died.'
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 0
      },

      tags: ['shadow', 'damage']
    },

    {
      id: 'arc_celestial_ray',
      name: 'Celestial Ray',
      description: 'You weave together arcane precision and holy power, creating a brilliant beam of pure celestial light that extends in a straight line before you. The ray is intelligent, somehow able to distinguish friend from foe—it burns enemies with searing radiant energy while simultaneously healing allies with its warm, restorative glow. The light is so bright it leaves afterimages in the eyes of those who witness it, and it seems to pulse with divine purpose. Enemies caught in the beam feel their flesh burn as if exposed to pure sunlight, while allies experience a wave of healing energy that mends wounds and restores vitality. The ray creates a visible path of light that lingers for a moment, marking the path of divine judgment and mercy.',
      level: 2,
      spellType: 'ACTION',
      icon: 'spell_holy_holybolt',
      
      typeConfig: {
        school: 'evocation',
        icon: 'spell_holy_holybolt',
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

      resolution: 'DICE',
      effectTypes: ['damage', 'healing'],

      damageConfig: {
        formula: '1d8 + intelligence/3',
        elementType: 'radiant',
        damageType: 'direct',
        description: 'The celestial ray burns enemies with searing radiant energy, as if they\'ve been exposed to concentrated sunlight. Their flesh smokes and chars where the light touches, and they feel an intense burning sensation that seems to come from within their very soul.'
      },

      healingConfig: {
        formula: '1d6 + spirit/3',
        healingType: 'direct',
        hasHotEffect: false,
        description: 'The same celestial light that burns enemies heals allies, its warm radiance mending wounds, closing cuts, and restoring vitality. Allies feel a wave of comfort and strength wash through them as the light touches their skin.'
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 0
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
      icon: 'spell_fire_flamebolt',
      
      typeConfig: {
        school: 'evocation',
        icon: 'spell_fire_flamebolt',
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

      resolution: 'DICE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '2d6 + intelligence/2',
        elementType: 'fire',
        damageType: 'direct'
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 0
      },

      tags: ['fire', 'damage']
    },

    {
      id: 'arc_ice_shard',
      name: 'Ice Shard',
      description: 'A sharp shard of ice that pierces your target, dealing cold damage and slowing them.',
      level: 3,
      spellType: 'ACTION',
      icon: 'spell_frost_frostbolt',
      
      typeConfig: {
        school: 'evocation',
        icon: 'spell_frost_frostbolt',
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

      resolution: 'DICE',
      effectTypes: ['damage', 'debuff'],

      damageConfig: {
        formula: '2d6 + intelligence/2',
        elementType: 'frost',
        damageType: 'direct'
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
        type: 'turn_based',
        value: 0
      },

      tags: ['ice', 'damage', 'debuff']
    },

    {
      id: 'arc_arcane_detonation',
      name: 'Arcane Detonation',
      description: 'You compress pure arcane energy between your palms, feeling it build and intensify until it becomes unstable. When you release it, the energy explodes outward in a massive burst of violet-white force that ripples through the air like a shockwave. The detonation creates a visible distortion in reality itself, as if space is being torn apart by the raw magical power. The force wave strikes everything in the area simultaneously, dealing devastating damage and leaving targets disoriented as their senses are overwhelmed by the chaotic arcane energy. The explosion leaves behind a lingering field of unstable magic that continues to disrupt concentration and balance.',
      level: 3,
      spellType: 'ACTION',
      icon: 'spell_arcane_blast',
      
      typeConfig: {
        school: 'evocation',
        icon: 'spell_arcane_blast',
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

      resolution: 'DICE',
      effectTypes: ['damage', 'debuff'],

      damageConfig: {
        formula: '2d6 + intelligence/2',
        elementType: 'force',
        damageType: 'direct',
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
        type: 'turn_based',
        value: 0
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
      icon: 'spell_fire_flameshock',
      
      typeConfig: {
        school: 'evocation',
        icon: 'spell_fire_flameshock',
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

      resolution: 'DICE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '3d6 + intelligence',
        elementType: 'fire',
        damageType: 'direct',
        hasDotEffect: true,
        dotConfig: {
          duration: 2,
          tickFrequency: 'round',
          dotFormula: '1d4',
          isProgressiveDot: false,
          description: 'The ground continues to burn with magical fire, and any remaining flames continue to lick at your skin, causing ongoing burn damage as the firestorm\'s effects persist.'
        },
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'agility',
          difficultyClass: 14,
          partialEffect: true,
          partialEffectFormula: 'damage/2',
          saveOutcome: 'halves'
        },
        description: 'The firestorm strikes with devastating force, creating an explosion of flame that engulfs everything in the area. The initial blast causes severe burns, and those who fail to dive for cover are caught in the full force of the inferno. The ground itself ignites, creating a dangerous burning zone.'
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 0
      },

      tags: ['fire', 'damage', 'aoe']
    },

    {
      id: 'arc_frost_nova',
      name: 'Frost Nova',
      description: 'You draw upon the deepest cold of the frozen wastes, causing your body to radiate an aura of absolute zero. As you spread your arms wide, a wave of freezing energy explodes outward in all directions, creating a visible shockwave of ice crystals and frozen air. The nova doesn\'t just damage—it flash-freezes everything in its path, causing water to instantly turn to ice, breath to crystallize, and movement to become sluggish as muscles stiffen from the cold. The ground becomes slick with ice, and a layer of frost coats every surface. Those caught in the blast feel their very blood begin to freeze, their movements becoming slow and laborious as their bodies struggle against the magical cold.',
      level: 4,
      spellType: 'ACTION',
      icon: 'spell_frost_frozenorb',
      
      typeConfig: {
        school: 'evocation',
        icon: 'spell_frost_frozenorb',
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

      resolution: 'DICE',
      effectTypes: ['damage', 'debuff'],

      damageConfig: {
        formula: '3d6 + intelligence',
        elementType: 'frost',
        damageType: 'direct',
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
        type: 'turn_based',
        value: 0
      },

      tags: ['ice', 'damage', 'debuff', 'aoe']
    },

    {
      id: 'arc_shadow_embrace',
      name: 'Shadow Embrace',
      description: 'Dark tendrils of shadow wrap around your target, dealing necrotic damage and weakening them.',
      level: 4,
      spellType: 'ACTION',
      icon: 'spell_shadow_shadowembrace',
      
      typeConfig: {
        school: 'necromancy',
        icon: 'spell_shadow_shadowembrace',
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

      resolution: 'DICE',
      effectTypes: ['damage', 'debuff'],

      damageConfig: {
        formula: '3d6 + intelligence',
        elementType: 'necrotic',
        damageType: 'direct',
        hasDotEffect: true,
        dotConfig: {
          duration: 2,
          tickFrequency: 'round',
          dotFormula: '1d4',
          isProgressiveDot: false
        }
      },

      debuffConfig: {
        debuffType: 'statReduction',
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
        type: 'turn_based',
        value: 0
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
      icon: 'spell_fire_fireball',
      
      typeConfig: {
        school: 'fire',
        secondaryElement: 'frost',
        icon: 'spell_fire_fireball',
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

      resolution: 'DICE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '2d8 + intelligence',
        elementType: 'fire',
        damageType: 'direct',
        secondaryElementType: 'frost',
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
        type: 'turn_based',
        value: 0
      },

      tags: ['fire', 'ice', 'damage', 'aoe']
    },

    {
      id: 'arc_divine_healing',
      name: 'Divine Healing',
      description: 'A powerful burst of divine energy that restores significant health to your target.',
      level: 5,
      spellType: 'ACTION',
      icon: 'spell_holy_greaterheal',
      
      typeConfig: {
        school: 'evocation',
        icon: 'spell_holy_greaterheal',
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

      resolution: 'DICE',
      effectTypes: ['healing'],

      healingConfig: {
        formula: '3d8 + spirit',
        healingType: 'direct',
        hasHotEffect: false
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 0
      },

      tags: ['holy', 'healing', 'support']
    },

    {
      id: 'arc_chaos_bolt',
      name: 'Chaos Bolt',
      description: 'A bolt of unpredictable chaos energy that deals random elemental damage.',
      level: 5,
      spellType: 'ACTION',
      icon: 'spell_shadow_charm',
      
      typeConfig: {
        school: 'chaos',
        icon: 'spell_shadow_charm',
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

      resolution: 'DICE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '2d10 + intelligence',
        elementType: 'chaos',
        damageType: 'direct'
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 0
      },

      tags: ['chaos', 'damage']
    },

    // ========================================
    // LEVEL 6 SPELLS (3-Sphere Combinations)
    // ========================================
    {
      id: 'arc_glacial_blessing',
      name: 'Glacial Blessing',
      description: 'Combine Ice, Healing, and Holy to create a protective blessing that heals and grants frost armor.',
      level: 6,
      spellType: 'ACTION',
      icon: 'spell_frost_frozenarmor',
      
      typeConfig: {
        school: 'abjuration',
        icon: 'spell_frost_frozenarmor',
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
        somaticText: 'Bestow glacial blessing',
        spheres: ['Ice', 'Healing', 'Holy']
      },

      resolution: 'DICE',
      effectTypes: ['healing', 'buff'],

      healingConfig: {
        formula: '2d8 + spirit',
        healingType: 'direct',
        hasHotEffect: false
      },

      buffConfig: {
        buffType: 'statEnhancement',
        effects: [{
          id: 'frost_armor',
          name: 'Frost Armor',
          description: 'Gain +2 armor class for the duration. A layer of protective ice forms around you, deflecting incoming attacks.',
          statModifier: {
            stat: 'armor',
            magnitude: 2,
            magnitudeType: 'flat'
          }
        }, {
          id: 'cold_resistance',
          name: 'Cold Resistance',
          description: 'Cold damage reduced by 50% for the duration. Your body adapts to freezing temperatures, making you highly resistant to ice and frost attacks.',
          statModifier: {
            stat: 'cold_resistance',
            magnitude: 50,
            magnitudeType: 'percentage'
          }
        }],
        durationValue: 3,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: false,
        canBeDispelled: true
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 0
      },

      tags: ['ice', 'healing', 'holy', 'buff']
    },

    {
      id: 'arc_thermal_surge',
      name: 'Thermal Surge',
      description: 'Combine Fire, Ice, and Nature to create a devastating surge of thermal energy.',
      level: 6,
      spellType: 'ACTION',
      icon: 'spell_fire_fireball02',
      
      typeConfig: {
        school: 'fire',
        secondaryElement: 'frost',
        icon: 'spell_fire_fireball02',
        tags: ['fire', 'ice', 'nature', 'damage', 'aoe'],
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
        resourceTypes: ['mana', 'fire_sphere', 'ice_sphere', 'nature_sphere'],
        resourceValues: { mana: 10, fire_sphere: 1, ice_sphere: 1, nature_sphere: 1 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Thermal Eruptio!',
        somaticText: 'Unleash thermal surge',
        spheres: ['Fire', 'Ice', 'Nature']
      },

      resolution: 'DICE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '4d8 + intelligence',
        elementType: 'fire',
        damageType: 'direct',
        secondaryElementType: 'frost',
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
        type: 'turn_based',
        value: 0
      },

      tags: ['fire', 'ice', 'nature', 'damage', 'aoe']
    },

    {
      id: 'arc_void_ray',
      name: 'Void Ray',
      description: 'Combine Arcane and Shadow to create a beam of void energy that tears through reality.',
      level: 6,
      spellType: 'ACTION',
      icon: 'spell_shadow_shadowbolt',
      
      typeConfig: {
        school: 'force',
        secondaryElement: 'necrotic',
        icon: 'spell_shadow_shadowbolt',
        tags: ['arcane', 'shadow', 'damage'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 90,
        aoeShape: 'line',
        aoeParameters: { length: 90 },
        targetRestrictions: []
      },

      resourceCost: {
        resourceTypes: ['mana', 'arcane_sphere', 'shadow_sphere', 'shadow_sphere'],
        resourceValues: { mana: 10, arcane_sphere: 1, shadow_sphere: 2 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Voidus Radius!',
        somaticText: 'Project void beam',
        spheres: ['Arcane', 'Shadow', 'Shadow']
      },

      resolution: 'DICE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '4d10 + intelligence',
        elementType: 'force',
        damageType: 'direct',
        secondaryElementType: 'necrotic',
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
        type: 'turn_based',
        value: 0
      },

      tags: ['arcane', 'shadow', 'damage']
    },

    // ========================================
    // LEVEL 7 SPELLS
    // ========================================
    {
      id: 'arc_primal_arcane_tempest',
      name: 'Primal Arcane Tempest',
      description: 'Combine Arcane, Nature, and Chaos to unleash a tempest of primal magical energy.',
      level: 7,
      spellType: 'ACTION',
      icon: 'spell_arcane_arcanetorrent',
      
      typeConfig: {
        school: 'force',
        secondaryElement: 'chaos',
        icon: 'spell_arcane_arcanetorrent',
        tags: ['arcane', 'nature', 'chaos', 'damage', 'aoe'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 60,
        aoeShape: 'circle',
        aoeParameters: { radius: 25 },
        targetRestrictions: []
      },

      resourceCost: {
        resourceTypes: ['mana', 'arcane_sphere', 'nature_sphere', 'chaos_sphere'],
        resourceValues: { mana: 10, arcane_sphere: 1, nature_sphere: 1, chaos_sphere: 1 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Tempestas Primalis!',
        somaticText: 'Unleash primal tempest',
        spheres: ['Arcane', 'Nature', 'Chaos']
      },

      resolution: 'DICE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '5d10 + intelligence',
        elementType: 'force',
        damageType: 'direct',
        secondaryElementType: 'nature',
        criticalConfig: {
          enabled: true,
          critType: 'dice',
          critMultiplier: 2,
          critDiceOnly: false,
          extraDice: '3d10',
          critEffects: ['stun'],
          stunConfig: {
            duration: 1,
            durationUnit: 'round',
            saveDC: 16,
            saveType: 'constitution'
          }
        },
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
        type: 'turn_based',
        value: 0
      },

      tags: ['arcane', 'nature', 'chaos', 'damage', 'aoe']
    },

    {
      id: 'arc_elemental_fury',
      name: 'Elemental Fury',
      description: 'Combine Fire, Ice, Nature, and Holy to unleash a devastating storm of all four primal elements.',
      level: 7,
      spellType: 'ACTION',
      icon: 'spell_fire_fireball02',
      
      typeConfig: {
        school: 'fire',
        secondaryElement: 'frost',
        icon: 'spell_fire_fireball02',
        tags: ['fire', 'ice', 'nature', 'holy', 'damage', 'aoe', 'ultimate'],
        castTime: 2,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 60,
        aoeShape: 'circle',
        aoeParameters: { radius: 30 },
        targetRestrictions: []
      },

      resourceCost: {
        resourceTypes: ['mana', 'fire_sphere', 'ice_sphere', 'nature_sphere', 'holy_sphere'],
        resourceValues: { mana: 15, fire_sphere: 1, ice_sphere: 1, nature_sphere: 1, holy_sphere: 1 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'ELEMENTUM FURIA!',
        somaticText: 'Unleash all four primal elements',
        spheres: ['Fire', 'Ice', 'Nature', 'Holy']
      },

      resolution: 'DICE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '6d10 + intelligence',
        elementType: 'fire',
        damageType: 'direct',
        secondaryElementType: 'frost',
        criticalConfig: {
          enabled: true,
          critType: 'dice',
          critMultiplier: 2.5,
          critDiceOnly: false,
          extraDice: '4d10',
          critEffects: ['burning', 'freeze'],
          burningConfig: {
            damagePerRound: '2d6',
            duration: 3,
            durationUnit: 'rounds',
            saveDC: 17,
            saveType: 'constitution'
          },
          freezeConfig: {
            speedReduction: 50,
            duration: 2,
            durationUnit: 'rounds',
            saveDC: 17,
            saveType: 'constitution'
          }
        },
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'agility',
          difficultyClass: 17,
          partialEffect: true,
          partialEffectFormula: 'damage/2',
          saveOutcome: 'halves'
        }
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 1
      },

      tags: ['fire', 'ice', 'nature', 'holy', 'damage', 'aoe', 'ultimate']
    },

    {
      id: 'arc_celestial_storm',
      name: 'Celestial Storm',
      description: 'Combine Holy, Healing, and Arcane to create a storm of celestial energy that heals allies and damages enemies.',
      level: 7,
      spellType: 'ACTION',
      icon: 'spell_holy_divineintervention',
      
      typeConfig: {
        school: 'evocation',
        icon: 'spell_holy_divineintervention',
        tags: ['holy', 'healing', 'arcane', 'damage', 'healing', 'aoe'],
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
        resourceTypes: ['mana', 'holy_sphere', 'healing_sphere', 'arcane_sphere'],
        resourceValues: { mana: 10, holy_sphere: 1, healing_sphere: 1, arcane_sphere: 1 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Tempestas Caelestis!',
        somaticText: 'Summon celestial storm',
        spheres: ['Holy', 'Healing', 'Arcane']
      },

      resolution: 'DICE',
      effectTypes: ['damage', 'healing'],

      damageConfig: {
        formula: '4d8 + intelligence',
        elementType: 'radiant',
        damageType: 'direct',
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
        formula: '3d8 + spirit',
        healingType: 'direct',
        hasHotEffect: false
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 0
      },

      tags: ['holy', 'healing', 'arcane', 'damage', 'healing', 'aoe']
    },

    // ========================================
    // LEVEL 8 SPELLS
    // ========================================
    {
      id: 'arc_divine_cataclysm',
      name: 'Divine Cataclysm',
      description: 'Combine Holy, Shadow, Healing, and Chaos to create a cataclysmic explosion of divine and chaotic energy.',
      level: 8,
      spellType: 'ACTION',
      icon: 'spell_holy_divineintervention',
      
      typeConfig: {
        school: 'radiant',
        secondaryElement: 'chaos',
        icon: 'spell_holy_divineintervention',
        tags: ['holy', 'shadow', 'healing', 'chaos', 'damage', 'aoe', 'ultimate'],
        castTime: 2,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 90,
        aoeShape: 'circle',
        aoeParameters: { radius: 40 },
        targetRestrictions: []
      },

      resourceCost: {
        resourceTypes: ['mana', 'holy_sphere', 'shadow_sphere', 'healing_sphere', 'chaos_sphere'],
        resourceValues: { mana: 15, holy_sphere: 1, shadow_sphere: 1, healing_sphere: 1, chaos_sphere: 1 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'CATACLYSMUS DIVINUS!',
        somaticText: 'Unleash divine cataclysm',
        spheres: ['Holy', 'Shadow', 'Healing', 'Chaos']
      },

      resolution: 'DICE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '8d12 + intelligence',
        elementType: 'radiant',
        damageType: 'direct',
        secondaryElementType: 'necrotic',
        criticalConfig: {
          enabled: true,
          critType: 'dice',
          critMultiplier: 3,
          critDiceOnly: false,
          extraDice: '6d12',
          critEffects: ['stun'],
          stunConfig: {
            duration: 2,
            durationUnit: 'rounds',
            saveDC: 18,
            saveType: 'constitution'
          }
        },
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'agility',
          difficultyClass: 18,
          partialEffect: true,
          partialEffectFormula: 'damage/2',
          saveOutcome: 'halves'
        }
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 1
      },

      tags: ['holy', 'shadow', 'healing', 'chaos', 'damage', 'aoe', 'ultimate']
    },

    {
      id: 'arc_void_inferno',
      name: 'Void Inferno',
      description: 'Combine Arcane, Shadow, Fire, and Chaos to tear open reality and unleash void flames that consume all matter.',
      level: 8,
      spellType: 'ACTION',
      icon: 'spell_shadow_shadowflame',
      
      typeConfig: {
        school: 'force',
        secondaryElement: 'chaos',
        icon: 'spell_shadow_shadowflame',
        tags: ['arcane', 'shadow', 'fire', 'chaos', 'damage', 'aoe', 'ultimate'],
        castTime: 2,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 60,
        aoeShape: 'circle',
        aoeParameters: { radius: 40 },
        targetRestrictions: []
      },

      resourceCost: {
        resourceTypes: ['mana', 'arcane_sphere', 'shadow_sphere', 'fire_sphere', 'chaos_sphere'],
        resourceValues: { mana: 15, arcane_sphere: 1, shadow_sphere: 1, fire_sphere: 1, chaos_sphere: 1 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'INFERNO VACUI!',
        somaticText: 'Tear open reality to unleash void flames',
        spheres: ['Arcane', 'Shadow', 'Fire', 'Chaos']
      },

      resolution: 'DICE',
      effectTypes: ['damage', 'control'],

      damageConfig: {
        formula: '8d12 + intelligence',
        elementType: 'force',
        damageType: 'direct',
        secondaryElementType: 'necrotic',
        hasDotEffect: true,
        dotConfig: {
          duration: 3,
          tickFrequency: 'round',
          dotFormula: '2d6',
          isProgressiveDot: false
        },
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
        strength: 'moderate',
        duration: 2,
        durationUnit: 'rounds',
        saveDC: 18,
        saveType: 'constitution',
        savingThrow: true,
        effects: [{
          id: 'blinded',
          name: 'Blinded',
          description: 'Blinded by void flames, cannot see and automatically fails sight-based checks',
          config: {
            durationType: 'temporary',
            recoveryMethod: 'automatic'
          }
        }]
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 1
      },

      tags: ['arcane', 'shadow', 'fire', 'chaos', 'damage', 'aoe', 'ultimate']
    },

    {
      id: 'arc_chaos_storm',
      name: 'Chaos Storm',
      description: 'Combine multiple Chaos spheres to create a storm of pure unpredictable energy.',
      level: 8,
      spellType: 'ACTION',
      icon: 'spell_shadow_charm',
      
      typeConfig: {
        school: 'chaos',
        icon: 'spell_shadow_charm',
        tags: ['chaos', 'damage', 'aoe'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 60,
        aoeShape: 'circle',
        aoeParameters: { radius: 25 },
        targetRestrictions: []
      },

      resourceCost: {
        resourceTypes: ['mana', 'chaos_sphere', 'chaos_sphere', 'chaos_sphere'],
        resourceValues: { mana: 10, chaos_sphere: 3 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Tempestas Chaos!',
        somaticText: 'Unleash chaos storm',
        spheres: ['Chaos', 'Chaos', 'Chaos']
      },

      resolution: 'DICE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '6d12 + intelligence',
        elementType: 'chaos',
        damageType: 'direct',
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'agility',
          difficultyClass: 17,
          partialEffect: true,
          partialEffectFormula: 'damage/2',
          saveOutcome: 'halves'
        }
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 1
      },

      tags: ['chaos', 'damage', 'aoe']
    },

    // ========================================
    // LEVEL 9 SPELLS
    // ========================================
    {
      id: 'arc_primal_cataclysm',
      name: 'Primal Cataclysm',
      description: 'Channel all eight elemental spheres into a volatile prismatic detonation. The unstable fusion of opposing elements causes significant backlash to the caster.',
      level: 9,
      spellType: 'ACTION',
      icon: 'spell_fire_fireball02',
      
      typeConfig: {
        school: 'chaos',
        icon: 'spell_fire_fireball02',
        tags: ['ultimate', 'damage', 'aoe', 'all-elements'],
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
        resourceTypes: ['mana', 'arcane_sphere', 'holy_sphere', 'shadow_sphere', 'fire_sphere', 'ice_sphere', 'nature_sphere', 'healing_sphere', 'chaos_sphere'],
        resourceValues: { mana: 30, arcane_sphere: 1, holy_sphere: 1, shadow_sphere: 1, fire_sphere: 1, ice_sphere: 1, nature_sphere: 1, healing_sphere: 1, chaos_sphere: 1 },
        useFormulas: {},
        actionPoints: 3,
        components: ['verbal', 'somatic'],
        verbalText: 'Elementum Cataclysmos!',
        somaticText: 'Force all eight spheres into unstable fusion',
        spheres: ['Arcane', 'Holy', 'Shadow', 'Fire', 'Ice', 'Nature', 'Healing', 'Chaos']
      },

      resolution: 'DICE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '5d10 + intelligence',
        elementType: 'chaos',
        damageType: 'direct',
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
        formula: '2d6',
        damageType: 'force',
        description: 'Elemental backlash from combining opposing elements'
      },

      cooldownConfig: {
        type: 'combat',
        value: 1,
        description: 'Once per combat'
      },

      tags: ['ultimate', 'damage', 'aoe', 'all-elements', 'self-damage']
    },

    {
      id: 'arc_chaos_vortex',
      name: 'Chaos Vortex',
      description: 'Concentrate pure chaotic energy into a swirling vortex of unpredictable destruction. The volatile nature of concentrated chaos may affect the caster as well.',
      level: 9,
      spellType: 'ACTION',
      icon: 'spell_shadow_charm',
      
      typeConfig: {
        school: 'chaos',
        icon: 'spell_shadow_charm',
        tags: ['chaos', 'damage', 'aoe', 'ultimate'],
        castTime: 2,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 60,
        aoeShape: 'circle',
        aoeParameters: { radius: 25 },
        targetRestrictions: []
      },

      resourceCost: {
        resourceTypes: ['mana', 'chaos_sphere', 'chaos_sphere', 'chaos_sphere', 'chaos_sphere'],
        resourceValues: { mana: 25, chaos_sphere: 4 },
        useFormulas: {},
        actionPoints: 3,
        components: ['verbal', 'somatic'],
        verbalText: 'Chaos Vorticem!',
        somaticText: 'Spiral hands to concentrate chaos energy',
        spheres: ['Chaos', 'Chaos', 'Chaos', 'Chaos']
      },

      resolution: 'DICE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '5d10 + intelligence',
        elementType: 'chaos',
        damageType: 'direct',
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
        description: 'Chaotic energy feedback'
      },

      cooldownConfig: {
        type: 'combat',
        value: 1,
        description: 'Once per combat'
      },

      tags: ['chaos', 'damage', 'aoe', 'ultimate', 'self-damage']
    },

    {
      id: 'arc_elemental_synthesis',
      name: 'Elemental Synthesis',
      description: 'Harmonize four opposing elements into a focused beam of synthesized energy. The careful balance required leaves the caster temporarily drained.',
      level: 9,
      spellType: 'ACTION',
      icon: 'spell_arcane_arcanepotency',
      
      typeConfig: {
        school: 'evocation',
        icon: 'spell_arcane_arcanepotency',
        tags: ['ultimate', 'damage', 'aoe', 'synthesis'],
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
        resourceTypes: ['mana', 'arcane_sphere', 'holy_sphere', 'shadow_sphere', 'fire_sphere'],
        resourceValues: { mana: 25, arcane_sphere: 1, holy_sphere: 1, shadow_sphere: 1, fire_sphere: 1 },
        useFormulas: {},
        actionPoints: 3,
        components: ['verbal', 'somatic'],
        verbalText: 'Synthesis Elementum!',
        somaticText: 'Weave opposing elements into harmony',
        spheres: ['Arcane', 'Holy', 'Shadow', 'Fire']
      },

      resolution: 'DICE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '5d8 + intelligence',
        elementType: 'force',
        damageType: 'direct',
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'agility',
          difficultyClass: 17,
          partialEffect: true,
          partialEffectFormula: 'damage/2',
          saveOutcome: 'halves'
        }
      },

      debuffConfig: {
        debuffType: 'self',
        effects: [{
          id: 'synthesis_drain',
          name: 'Synthesis Drain',
          description: 'The caster has -2 to spell attack rolls until end of next turn',
          isSelfDebuff: true
        }],
        durationValue: 1,
        durationType: 'rounds',
        durationUnit: 'rounds'
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 3
      },

      tags: ['ultimate', 'damage', 'aoe', 'synthesis']
    },

    // ========================================
    // LEVEL 10 SPELLS
    // ========================================
    {
      id: 'arc_elemental_convergence',
      name: 'Elemental Convergence',
      description: 'Force seven elemental spheres into a devastating convergence point. The immense strain of controlling this much raw elemental power causes severe backlash and leaves the caster exhausted.',
      level: 10,
      spellType: 'ACTION',
      icon: 'spell_arcane_arcanepotency',
      
      typeConfig: {
        school: 'evocation',
        icon: 'spell_arcane_arcanepotency',
        tags: ['ultimate', 'damage', 'aoe', 'mastery'],
        castTime: 3,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 90,
        aoeShape: 'circle',
        aoeParameters: { radius: 30 },
        targetRestrictions: []
      },

      resourceCost: {
        resourceTypes: ['mana', 'arcane_sphere', 'holy_sphere', 'shadow_sphere', 'fire_sphere', 'ice_sphere', 'nature_sphere', 'healing_sphere'],
        resourceValues: { mana: 40, arcane_sphere: 1, holy_sphere: 1, shadow_sphere: 1, fire_sphere: 1, ice_sphere: 1, nature_sphere: 1, healing_sphere: 1 },
        useFormulas: {},
        actionPoints: 3,
        components: ['verbal', 'somatic'],
        verbalText: 'Convergentia Elementum!',
        somaticText: 'Force all spheres into a single convergence point',
        spheres: ['Arcane', 'Holy', 'Shadow', 'Fire', 'Ice', 'Nature', 'Healing']
      },

      resolution: 'DICE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '6d10 + intelligence',
        elementType: 'force',
        damageType: 'direct',
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
          description: 'The caster cannot cast spells requiring 3+ spheres until end of next turn',
          isSelfDebuff: true
        }],
        durationValue: 1,
        durationType: 'rounds',
        durationUnit: 'rounds'
      },

      cooldownConfig: {
        type: 'combat',
        value: 1,
        description: 'Once per combat'
      },

      tags: ['ultimate', 'damage', 'aoe', 'mastery', 'self-damage', 'exhaustion']
    },

    {
      id: 'arc_dimensional_rift',
      name: 'Dimensional Rift',
      description: 'Tear open a temporary rift between dimensions, unleashing unstable void energy. The rift is difficult to control and may pull the caster partially into the void.',
      level: 10,
      spellType: 'ACTION',
      icon: 'spell_shadow_shadowflame',
      
      typeConfig: {
        school: 'force',
        secondaryElement: 'chaos',
        icon: 'spell_shadow_shadowflame',
        tags: ['ultimate', 'damage', 'aoe', 'void'],
        castTime: 3,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 60,
        aoeShape: 'circle',
        aoeParameters: { radius: 25 },
        targetRestrictions: []
      },

      resourceCost: {
        resourceTypes: ['mana', 'arcane_sphere', 'shadow_sphere', 'chaos_sphere', 'chaos_sphere'],
        resourceValues: { mana: 35, arcane_sphere: 1, shadow_sphere: 1, chaos_sphere: 2 },
        useFormulas: {},
        actionPoints: 3,
        components: ['verbal', 'somatic'],
        verbalText: 'Rima Dimensio!',
        somaticText: 'Tear open a rift between dimensions',
        spheres: ['Arcane', 'Shadow', 'Chaos', 'Chaos']
      },

      resolution: 'DICE',
      effectTypes: ['damage', 'control'],

      damageConfig: {
        formula: '7d10 + intelligence',
        elementType: 'force',
        damageType: 'direct',
        secondaryElementType: 'necrotic',
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
        strength: 'moderate',
        duration: 1,
        durationUnit: 'rounds',
        saveDC: 18,
        saveType: 'constitution',
        savingThrow: true,
        effects: [{
          id: 'void_disorientation',
          name: 'Void Disorientation',
          description: 'Targets are disoriented by void energy - disadvantage on attacks and cannot take reactions',
          config: {
            durationType: 'temporary',
            recoveryMethod: 'automatic'
          }
        }]
      },

      selfDamageConfig: {
        formula: '2d8',
        damageType: 'necrotic',
        description: 'Void energy feedback from unstable rift'
      },

      cooldownConfig: {
        type: 'combat',
        value: 1,
        description: 'Once per combat'
      },

      tags: ['ultimate', 'damage', 'aoe', 'void', 'self-damage']
    },

    {
      id: 'arc_sphere_mastery',
      name: 'Sphere Mastery',
      description: 'Demonstrate true mastery of elemental combination by weaving six different elements into a precise, focused detonation. Requires intense concentration that leaves the caster vulnerable afterward.',
      level: 10,
      spellType: 'ACTION',
      icon: 'spell_fire_fireball02',
      
      typeConfig: {
        school: 'fire',
        secondaryElement: 'frost',
        icon: 'spell_fire_fireball02',
        tags: ['ultimate', 'damage', 'aoe', 'mastery'],
        castTime: 3,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 90,
        aoeShape: 'circle',
        aoeParameters: { radius: 30 },
        targetRestrictions: []
      },

      resourceCost: {
        resourceTypes: ['mana', 'fire_sphere', 'ice_sphere', 'nature_sphere', 'holy_sphere', 'shadow_sphere', 'arcane_sphere'],
        resourceValues: { mana: 40, fire_sphere: 1, ice_sphere: 1, nature_sphere: 1, holy_sphere: 1, shadow_sphere: 1, arcane_sphere: 1 },
        useFormulas: {},
        actionPoints: 3,
        components: ['verbal', 'somatic'],
        verbalText: 'Dominatio Spherae!',
        somaticText: 'Weave six elements into perfect harmony',
        spheres: ['Fire', 'Ice', 'Nature', 'Holy', 'Shadow', 'Arcane']
      },

      resolution: 'DICE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '8d10 + intelligence',
        elementType: 'fire',
        damageType: 'direct',
        secondaryElementType: 'frost',
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
        formula: '2d6',
        damageType: 'force',
        description: 'Elemental strain from controlling six opposing elements'
      },

      debuffConfig: {
        debuffType: 'self',
        effects: [{
          id: 'mastery_strain',
          name: 'Mastery Strain',
          description: 'The caster has -2 to AC and saving throws until end of next turn',
          isSelfDebuff: true
        }],
        durationValue: 1,
        durationType: 'rounds',
        durationUnit: 'rounds'
      },

      cooldownConfig: {
        type: 'combat',
        value: 1,
        description: 'Once per combat'
      },

      tags: ['ultimate', 'damage', 'aoe', 'mastery', 'self-damage']
    },

    {
      targetingConfig: {
        rangeDistance: 60,
        aoeType: 'circle',
        aoeSize: 30
      },

      durationConfig: {
        durationType: 'instant',
        description: 'Instant explosion with lingering fire'
      },

      resourceCost: {
        mana: 5,
        spheres: ['Fire', 'Fire'],
        components: ['verbal', 'somatic'],
        verbalText: 'Ignis Tempestas!',
        somaticText: 'Raise both hands and unleash flames'
      },

      resolution: 'SAVE',

      saveConfig: {
        saveType: 'dexterity',
        saveDC: 15,
        onSaveEffect: 'half'
      },

      damageConfig: {
        formula: '3d8',
        damageType: 'fire',
        scalingType: 'none',
        hasDotEffect: true,
        dotConfig: {
          dotFormula: '1d6',
          duration: 10,
          tickFrequency: 'round'
        }
      },

      effectTypes: ['damage'],

      specialMechanics: {
        sphereCombo: {
          enabled: true,
          elements: ['Fire', 'Fire'],
          comboType: 'pure',
          prismMageBonus: '+50% damage (4d8+4 instead of 3d8)'
        }
      },

      tags: ['2-sphere', 'fire', 'aoe', 'damage-over-time', 'pure-element', 'prism-mage'],
      flavorText: 'A raging inferno engulfs the battlefield, leaving nothing but ash and embers.'
    },

    // Mixed Element Combos


    {
      id: 'arc_pandemonium',
      name: 'Pandemonium',
      description: 'Chaos + Chaos: Ultimate chaos spell with completely unpredictable devastating effects.',
      spellType: 'ACTION',
      icon: 'spell_shadow_shadowwordpain',
      school: 'Evocation',
      level: 4,
      sphereCost: ['Chaos', 'Chaos'],

      typeConfig: {
        school: 'chaos',
        castTime: 1,
        castTimeType: 'ACTION'
      },

      targetingConfig: {
        targetingType: 'ground',
        rangeType: 'ranged',
        rangeDistance: 60,
        aoeType: 'circle',
        aoeSize: 40
      },

      durationConfig: {
        durationType: 'instant',
        description: 'Instant chaos'
      },

      resourceCost: {
        mana: 5,
        spheres: ['Chaos', 'Chaos'],
        components: ['verbal', 'somatic'],
        verbalText: 'PANDEMONIUM!',
        somaticText: 'Wild gestures releasing chaotic energy'
      },

      resolution: 'SAVE',

      saveConfig: {
        saveType: 'dexterity',
        saveDC: 15,
        onSaveEffect: 'half'
      },

      rollableTable: {
        enabled: true,
        name: 'Pandemonium Effect',
        description: 'Roll 1d8 to determine the chaotic effect',
        resolutionType: 'DICE',
        resolutionConfig: {
          diceType: 'd8'
        },
        entries: [
          { roll: 1, name: 'Force Explosion', effect: '4d6 force damage to all targets in 40ft radius area.' },
          { roll: 2, name: 'Holy Nova', effect: '3d8 radiant damage to all enemies in area. All allies in area are healed for 3d8 HP. Enemies must make Dexterity save DC 15 for half damage.' },
          { roll: 3, name: 'Shadow Burst', effect: '3d8 necrotic damage to all enemies in area. Enemies must make Constitution save DC 15 or be cursed (disadvantage on attack rolls and ability checks) for 2 rounds.' },
          { roll: 4, name: 'Inferno', effect: '4d6 fire damage to all targets in area. Targets must make Dexterity save DC 15 for half damage. Targets that fail the save are ignited, taking 1d6 fire damage at the start of each of their turns for 3 rounds (Constitution save DC 15 ends early).' },
          { roll: 5, name: 'Blizzard', effect: '4d6 cold damage to all targets in area. Targets must make Constitution save DC 15 for half damage. Targets that fail the save are frozen (paralyzed) for 1 round - cannot move or take actions, attacks against them have advantage.' },
          { roll: 6, name: 'Nature\'s Wrath', effect: '4d6 poison damage to all enemies in area. Enemies must make Constitution save DC 15 for half damage. The area becomes difficult terrain for 3 rounds - movement costs double movement speed, creatures moving through it take 1d4 piercing damage from thorns.' },
          { roll: 7, name: 'Mass Healing', effect: 'All allies within 40ft radius are healed for 4d8 HP. This healing cannot exceed maximum HP. Allies also gain temporary HP equal to half the healing received (2d8 temp HP).' },
          { roll: 8, name: 'Reality Tear', effect: 'All allies within 40ft radius gain +4 armor and resistance to all damage types for 1 minute (10 rounds). Resistance means they take half damage from all sources. This effect cannot be dispelled.' }
        ]
      },

      specialMechanics: {
        sphereCombo: {
          enabled: true,
          elements: ['Chaos', 'Chaos'],
          comboType: 'chaos',
          entropyWeaverBonus: 'Double damage on all effects, roll twice on table and apply both'
        }
      },

      tags: ['2-sphere', 'chaos', 'random', 'unpredictable', 'entropy-weaver'],
      flavorText: 'Reality itself fractures as pure chaos is unleashed upon the world.',
      
      // Explicitly no utility - spell only uses rollable table
      effectTypes: []
    },

    // ========================================
    // 3-SPHERE SPECIAL RECIPES
    // Powerful combinations requiring specific elements
    // ========================================

    
    
    
    // ========================================
    // 4-SPHERE ULTIMATE RECIPES
    // The most powerful combinations
    // ========================================
  ]
};
