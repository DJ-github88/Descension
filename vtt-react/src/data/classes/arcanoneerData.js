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
          'Can reroll up to 2 spheres per turn',
          'Pure element combos (Fire+Fire, Ice+Ice, etc.) deal +50% damage',
          'Gain resistance to your most-used element type',
          'More consistent and predictable than other specs',
          'Excellent against enemies weak to specific elements'
        ],

        weaknesses: [
          'Less versatile than other specs',
          'Struggles against enemies resistant to your favored elements',
          'Cannot leverage chaos and mixed-element synergies as well',
          'Rerolls cost 1 mana per sphere rerolled',
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
            description: 'You can reroll up to 2 spheres per turn (costs 1 mana per reroll). Pure element combinations (same element twice) deal 50% bonus damage. You gain resistance to the element type you\'ve used most this combat.',
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
      // Level 1 spells: Basic 2-sphere combinations (5 options, pick 3)
      'arc_steam_burst',
      'arc_celestial_ray',
      'arc_arcane_detonation',
      'arc_firestorm',
      'arc_pandemonium'
    ],
    2: [
      // Level 2-3 spells: More 2-sphere combinations
      'arc_steam_burst',
      'arc_celestial_ray',
      'arc_arcane_detonation',
      'arc_firestorm'
    ],
    4: [
      // Level 4-5 spells: Advanced 2-sphere and basic 3-sphere
      'arc_arcane_detonation',
      'arc_firestorm',
      'arc_steam_burst',
      'arc_celestial_ray',
      'arc_pandemonium',
      'arc_glacial_blessing',
      'arc_thermal_surge'
    ],
    6: [
      // Level 6-7 spells: 3-sphere combinations
      'arc_firestorm',
      'arc_pandemonium',
      'arc_glacial_blessing',
      'arc_thermal_surge',
      'arc_primal_arcane_tempest'
    ],
    8: [
      // Level 8-9 spells: Advanced 3-sphere combinations
      'arc_pandemonium',
      'arc_glacial_blessing',
      'arc_thermal_surge',
      'arc_primal_arcane_tempest'
    ],
    10: [
      // Level 10-11 spells: 4-sphere ultimates start appearing
      'arc_primal_arcane_tempest',
      'arc_elemental_fury',
      'arc_divine_cataclysm'
    ],
    12: [
      // Level 12-14 spells: More 4-sphere ultimates
      'arc_elemental_fury',
      'arc_divine_cataclysm',
      'arc_void_inferno'
    ],
    15: [
      // Level 15-17 spells: Powerful 4-sphere ultimates
      'arc_elemental_fury',
      'arc_divine_cataclysm',
      'arc_void_inferno'
    ],
    18: [
      // Level 18-19 spells: Master-level combinations
      'arc_divine_cataclysm',
      'arc_void_inferno'
    ],
    20: [
      // Level 20 spells: Ultimate power
      'arc_void_inferno'
    ]
  },

  // Example Spells - organized by combination tier
  exampleSpells: [
    // ========================================
    // 2-SPHERE COMBINATIONS
    // Representative examples from the 8x8 matrix
    // ========================================

    // Pure Element Combos
    {
      id: 'arc_arcane_detonation',
      name: 'Arcane Detonation',
      description: 'Arcane + Arcane: Pure arcane explosion dealing force damage and disorienting enemies.',
      spellType: 'ACTION',
      icon: 'spell_arcane_blast',
      school: 'Evocation',
      level: 2,
      sphereCost: ['Arcane', 'Arcane'],

      typeConfig: {
        castTime: 1,
        castTimeType: 'ACTION'
      },

      targetingConfig: {
        targetingType: 'ground',
        rangeType: 'ranged',
        rangeDistance: 60,
        aoeType: 'circle',
        aoeSize: 20
      },

      durationConfig: {
        durationType: 'instant',
        description: 'Instant explosion'
      },

      resourceCost: {
        mana: 5,
        spheres: ['Arcane', 'Arcane'],
        components: ['verbal', 'somatic'],
        verbalText: 'Arcanum Detonare!',
        somaticText: 'Clap hands together to release arcane energy'
      },

      resolution: 'SAVE',

      saveConfig: {
        saveType: 'dexterity',
        saveDC: 15,
        onSaveEffect: 'half'
      },

      damageConfig: {
        formula: '3d6',
        damageType: 'force',
        scalingType: 'none'
      },

      debuffConfig: {
        statusEffects: [
          {
            id: 'disoriented',
            name: 'Disoriented',
            description: 'Senses overwhelmed by arcane energy',
            durationType: 'rounds',
            durationValue: 2,
            saveType: 'constitution',
            saveDC: 15
          }
        ]
      },

      effectTypes: ['damage', 'debuff'],

      specialMechanics: {
        sphereCombo: {
          enabled: true,
          elements: ['Arcane', 'Arcane'],
          comboType: 'pure',
          prismMageBonus: '+50% damage (4d6+3 instead of 3d6)'
        }
      },

      tags: ['2-sphere', 'arcane', 'force', 'aoe', 'pure-element', 'prism-mage'],
      flavorText: 'Raw arcane energy explodes outward, overwhelming the senses of those caught in the blast.'
    },

    {
      id: 'arc_firestorm',
      name: 'Firestorm',
      description: 'Fire + Fire: Massive fire explosion that ignites everything in the area.',
      spellType: 'ACTION',
      icon: 'spell_fire_flameshock',
      school: 'Evocation',
      level: 3,
      sphereCost: ['Fire', 'Fire'],

      typeConfig: {
        castTime: 1,
        castTimeType: 'ACTION'
      },

      targetingConfig: {
        targetingType: 'ground',
        rangeType: 'ranged',
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
      id: 'arc_steam_burst',
      name: 'Steam Burst',
      description: 'Fire + Ice: Alternating fire and ice creates a disorienting steam explosion.',
      spellType: 'ACTION',
      icon: 'spell_frost_frostbolt',
      school: 'Evocation',
      level: 2,
      sphereCost: ['Fire', 'Ice'],

      typeConfig: {
        castTime: 1,
        castTimeType: 'ACTION'
      },

      targetingConfig: {
        targetingType: 'cone',
        rangeType: 'cone',
        rangeDistance: 20,
        aoeType: 'cone',
        aoeSize: 20
      },

      durationConfig: {
        durationType: 'instant',
        description: 'Instant burst'
      },

      resourceCost: {
        mana: 5,
        spheres: ['Fire', 'Ice'],
        components: ['verbal', 'somatic'],
        verbalText: 'Vapor Eruptio!',
        somaticText: 'Combine opposing hands of fire and ice'
      },

      resolution: 'SAVE',

      saveConfig: {
        saveType: 'constitution',
        saveDC: 15,
        onSaveEffect: 'half'
      },

      damageConfig: {
        formula: '1d6',
        damageType: 'cold',
        additionalDamage: [
          {
            formula: '1d6',
            damageType: 'fire'
          }
        ],
        scalingType: 'none'
      },

      debuffConfig: {
        statusEffects: [
          {
            id: 'disoriented',
            name: 'Disoriented',
            description: 'Blinded by scalding steam',
            durationType: 'rounds',
            durationValue: 2,
            saveType: 'constitution',
            saveDC: 15
          }
        ]
      },

      effectTypes: ['damage', 'debuff'],

      tags: ['2-sphere', 'fire', 'ice', 'mixed-element', 'control'],
      flavorText: 'Opposing elements collide in a scalding burst of steam that blinds and burns.'
    },

    {
      id: 'arc_celestial_ray',
      name: 'Celestial Ray',
      description: 'Arcane + Holy: A beam of pure magical light that damages enemies and heals allies.',
      spellType: 'ACTION',
      icon: 'spell_holy_holybolt',
      school: 'Evocation',
      level: 2,
      sphereCost: ['Arcane', 'Holy'],

      typeConfig: {
        castTime: 1,
        castTimeType: 'ACTION'
      },

      targetingConfig: {
        targetingType: 'line',
        rangeType: 'line',
        rangeDistance: 60,
        aoeType: 'line',
        aoeSize: 60
      },

      durationConfig: {
        durationType: 'instant',
        description: 'Instant beam'
      },

      resourceCost: {
        mana: 5,
        spheres: ['Arcane', 'Holy'],
        components: ['verbal', 'somatic'],
        verbalText: 'Lux Arcanum!',
        somaticText: 'Point finger to fire beam of light'
      },

      resolution: 'SAVE',

      saveConfig: {
        saveType: 'constitution',
        saveDC: 15,
        onSaveEffect: 'half'
      },

      damageConfig: {
        formula: '1d8',
        damageType: 'radiant',
        scalingType: 'none'
      },

      healingConfig: {
        formula: '1d8',
        healingType: 'instant',
        targetType: 'allies'
      },

      buffConfig: {
        statusEffects: [
          {
            id: 'temporary_hp',
            name: 'Celestial Protection',
            description: 'Blessed with temporary hit points',
            temporaryHitPoints: '1d8',
            durationType: 'rounds',
            durationValue: 3
          }
        ]
      },

      effectTypes: ['damage', 'healing', 'buff'],

      tags: ['2-sphere', 'arcane', 'holy', 'mixed-element', 'healing', 'support'],
      flavorText: 'Divine arcane energy flows in a brilliant ray, harming the wicked and healing the righteous.'
    },

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
          { roll: 1, name: 'Force Explosion', effect: '4d6 force damage to all in area' },
          { roll: 2, name: 'Holy Nova', effect: '3d8 holy damage to enemies, heals allies 3d8' },
          { roll: 3, name: 'Shadow Burst', effect: '3d8 shadow damage, enemies cursed' },
          { roll: 4, name: 'Inferno', effect: '4d6 fire damage, ignites for 1d6/round' },
          { roll: 5, name: 'Blizzard', effect: '4d6 ice damage, freezes targets' },
          { roll: 6, name: 'Nature\'s Wrath', effect: '4d6 nature damage, creates difficult terrain' },
          { roll: 7, name: 'Mass Healing', effect: 'Heals all allies 4d8 HP' },
          { roll: 8, name: 'Reality Tear', effect: 'Grants +4 AC and resistance to all damage for 1 minute to allies' }
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
      flavorText: 'Reality itself fractures as pure chaos is unleashed upon the world.'
    },

    // ========================================
    // 3-SPHERE SPECIAL RECIPES
    // Powerful combinations requiring specific elements
    // ========================================

    {
      id: 'arc_glacial_blessing',
      name: 'Glacial Blessing',
      description: 'Holy + Ice + Nature: A blessing that heals allies and freezes enemies in protective icy terrain.',
      spellType: 'ACTION',
      icon: 'spell_frost_frostarmor',
      school: 'Abjuration',
      level: 3,
      sphereCost: ['Holy', 'Ice', 'Nature'],

      typeConfig: {
        castTime: 1,
        castTimeType: 'ACTION'
      },

      targetingConfig: {
        targetingType: 'ground',
        rangeType: 'ranged',
        rangeDistance: 60,
        aoeType: 'circle',
        aoeSize: 30
      },

      durationConfig: {
        durationType: 'minutes',
        duration: 1,
        description: 'Terrain lasts 1 minute'
      },

      resourceCost: {
        mana: 10,
        spheres: ['Holy', 'Ice', 'Nature'],
        components: ['verbal', 'somatic'],
        verbalText: 'Benedictio Glacialis!',
        somaticText: 'Spread arms to create blessed frozen terrain'
      },

      resolution: 'SAVE',

      saveConfig: {
        saveType: 'constitution',
        saveDC: 15,
        onSaveEffect: 'half'
      },

      damageConfig: {
        formula: '3d6',
        damageType: 'cold',
        scalingType: 'none'
      },

      healingConfig: {
        formula: '4d8',
        healingType: 'instant',
        targetType: 'allies'
      },

      terrainConfig: {
        terrainType: 'difficult',
        duration: 60,
        description: 'Creates difficult icy terrain'
      },

      effectTypes: ['damage', 'healing', 'terrain'],

      specialMechanics: {
        sphereCombo: {
          enabled: true,
          elements: ['Holy', 'Ice', 'Nature'],
          comboType: '3-sphere-recipe',
          sphereArchitectBonus: 'Costs 7 mana instead of 10'
        }
      },

      tags: ['3-sphere', 'holy', 'ice', 'nature', 'healing', 'terrain', 'sphere-architect'],
      flavorText: 'Divine frost spreads across the ground, blessing allies while freezing foes in place.'
    },

    {
      id: 'arc_thermal_surge',
      name: 'Thermal Surge',
      description: 'Fire + Ice + Healing: Alternating fire and ice that heals allies while devastating enemies with thermal shock.',
      spellType: 'ACTION',
      icon: 'spell_fire_twilightflamebreath',
      school: 'Evocation',
      level: 3,
      sphereCost: ['Fire', 'Ice', 'Healing'],

      typeConfig: {
        castTime: 1,
        castTimeType: 'ACTION'
      },

      targetingConfig: {
        targetingType: 'cone',
        rangeType: 'cone',
        rangeDistance: 30,
        aoeType: 'cone',
        aoeSize: 30
      },

      durationConfig: {
        durationType: 'instant',
        description: 'Instant surge'
      },

      resourceCost: {
        mana: 10,
        spheres: ['Fire', 'Ice', 'Healing'],
        components: ['verbal', 'somatic'],
        verbalText: 'Thermalis Unda!',
        somaticText: 'Sweep arms in wave motion'
      },

      resolution: 'SAVE',

      saveConfig: {
        saveType: 'dexterity',
        saveDC: 15,
        onSaveEffect: 'half'
      },

      damageConfig: {
        formula: '4d6+4d6',
        damageType: 'fire',
        damageTypes: ['fire', 'cold'],
        scalingType: 'none'
      },

      healingConfig: {
        formula: '3d8',
        healingType: 'instant',
        targetType: 'allies'
      },

      effectTypes: ['damage', 'healing'],

      specialMechanics: {
        sphereCombo: {
          enabled: true,
          elements: ['Fire', 'Ice', 'Healing'],
          comboType: '3-sphere-recipe',
          sphereArchitectBonus: 'Costs 7 mana instead of 10'
        }
      },

      tags: ['3-sphere', 'fire', 'ice', 'healing', 'mixed-element', 'sphere-architect'],
      flavorText: 'A wave of alternating heat and cold washes over the battlefield, healing friends and burning foes.'
    },

    {
      id: 'arc_primal_arcane_tempest',
      name: 'Primal Arcane Tempest',
      description: 'Arcane + Chaos + Nature: A tempest of chaotic arcane and nature magic that devastates and rejuvenates.',
      spellType: 'ACTION',
      icon: 'spell_nature_cyclone',
      school: 'Evocation',
      level: 4,
      sphereCost: ['Arcane', 'Chaos', 'Nature'],

      typeConfig: {
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
        durationType: 'minutes',
        duration: 1,
        description: 'Terrain lasts 1 minute'
      },

      resourceCost: {
        mana: 10,
        spheres: ['Arcane', 'Chaos', 'Nature'],
        components: ['verbal', 'somatic'],
        verbalText: 'Tempestas Primordialis!',
        somaticText: 'Spin arms to create swirling tempest'
      },

      resolution: 'SAVE',

      saveConfig: {
        saveType: 'dexterity',
        saveDC: 15,
        onSaveEffect: 'half'
      },

      damageConfig: {
        formula: '5d6+5d6',
        damageType: 'force',
        damageTypes: ['force', 'nature'],
        scalingType: 'none'
      },

      healingConfig: {
        formula: '4d8',
        healingType: 'instant',
        targetType: 'allies'
      },

      terrainConfig: {
        terrainType: 'difficult',
        duration: 60,
        description: 'Creates chaotic difficult terrain'
      },

      effectTypes: ['damage', 'healing', 'terrain'],

      specialMechanics: {
        sphereCombo: {
          enabled: true,
          elements: ['Arcane', 'Chaos', 'Nature'],
          comboType: '3-sphere-recipe',
          sphereArchitectBonus: 'Costs 7 mana instead of 10',
          entropyWeaverBonus: 'Double damage on all effects'
        }
      },

      tags: ['3-sphere', 'arcane', 'chaos', 'nature', 'aoe', 'terrain', 'entropy-weaver'],
      flavorText: 'Primal chaos and arcane power merge into a devastating storm that reshapes the battlefield.'
    },

    // ========================================
    // 4-SPHERE ULTIMATE RECIPES
    // The most powerful combinations
    // ========================================

    {
      id: 'arc_elemental_fury',
      name: 'Elemental Fury',
      description: 'Arcane + Fire + Ice + Nature: Unleashes a devastating combination of all four elements that ravages enemies.',
      spellType: 'ACTION',
      icon: 'spell_nature_wispsplode',
      school: 'Evocation',
      level: 5,
      sphereCost: ['Arcane', 'Fire', 'Ice', 'Nature'],

      typeConfig: {
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
        durationType: 'minutes',
        duration: 1,
        description: 'Terrain lasts 1 minute'
      },

      resourceCost: {
        mana: 15,
        spheres: ['Arcane', 'Fire', 'Ice', 'Nature'],
        components: ['verbal', 'somatic'],
        verbalText: 'ELEMENTUM FURIA!',
        somaticText: 'Slam fists together releasing all elements'
      },

      resolution: 'SAVE',

      saveConfig: {
        saveType: 'dexterity',
        saveDC: 15,
        onSaveEffect: 'half'
      },

      damageConfig: {
        formula: '6d6+6d6+6d6+6d6',
        damageType: 'force',
        damageTypes: ['force', 'fire', 'cold', 'nature'],
        scalingType: 'none'
      },

      terrainConfig: {
        terrainType: 'difficult',
        duration: 60,
        description: 'Creates elemental difficult terrain'
      },

      effectTypes: ['damage', 'terrain'],

      specialMechanics: {
        sphereCombo: {
          enabled: true,
          elements: ['Arcane', 'Fire', 'Ice', 'Nature'],
          comboType: '4-sphere-ultimate',
          description: 'Ultimate 4-element combination'
        }
      },

      tags: ['4-sphere', 'arcane', 'fire', 'ice', 'nature', 'ultimate', 'aoe'],
      flavorText: 'The four fundamental elements converge in a cataclysmic explosion of raw power.'
    },

    {
      id: 'arc_divine_cataclysm',
      name: 'Divine Cataclysm',
      description: 'Holy + Shadow + Healing + Chaos: A cataclysmic event dealing holy and shadow damage while healing allies.',
      spellType: 'ACTION',
      icon: 'spell_holy_prayerofhealing',
      school: 'Evocation',
      level: 5,
      sphereCost: ['Holy', 'Shadow', 'Healing', 'Chaos'],

      typeConfig: {
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
        description: 'Instant cataclysm'
      },

      resourceCost: {
        mana: 15,
        spheres: ['Holy', 'Shadow', 'Healing', 'Chaos'],
        components: ['verbal', 'somatic'],
        verbalText: 'CATACLYSMUS DIVINUS!',
        somaticText: 'Raise hands to sky and bring down divine wrath'
      },

      resolution: 'SAVE',

      saveConfig: {
        saveType: 'wisdom',
        saveDC: 15,
        onSaveEffect: 'half'
      },

      damageConfig: {
        formula: '6d8+6d8',
        damageType: 'radiant',
        damageTypes: ['radiant', 'necrotic'],
        scalingType: 'none'
      },

      healingConfig: {
        formula: '5d8',
        healingType: 'instant',
        targetType: 'allies'
      },

      debuffConfig: {
        statusEffects: [
          {
            id: 'stunned',
            name: 'Stunned',
            description: 'Overwhelmed by divine judgment',
            durationType: 'rounds',
            durationValue: 1
          }
        ]
      },

      effectTypes: ['damage', 'healing', 'debuff'],

      specialMechanics: {
        sphereCombo: {
          enabled: true,
          elements: ['Holy', 'Shadow', 'Healing', 'Chaos'],
          comboType: '4-sphere-ultimate',
          entropyWeaverBonus: 'Double damage and healing',
          description: 'Ultimate divine/shadow combination'
        }
      },

      tags: ['4-sphere', 'holy', 'shadow', 'healing', 'chaos', 'ultimate', 'entropy-weaver'],
      flavorText: 'Light and darkness collide in a divine cataclysm that judges all within its reach.'
    },

    {
      id: 'arc_void_inferno',
      name: 'Void Inferno',
      description: 'Arcane + Shadow + Fire + Chaos: A chaotic inferno that consumes everything with void energy.',
      spellType: 'ACTION',
      icon: 'spell_shadow_shadowfiend',
      school: 'Evocation',
      level: 5,
      sphereCost: ['Arcane', 'Shadow', 'Fire', 'Chaos'],

      typeConfig: {
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
        description: 'Instant void explosion'
      },

      resourceCost: {
        mana: 15,
        spheres: ['Arcane', 'Shadow', 'Fire', 'Chaos'],
        components: ['verbal', 'somatic'],
        verbalText: 'INFERNO VACUI!',
        somaticText: 'Tear open reality to unleash void flames'
      },

      resolution: 'SAVE',

      saveConfig: {
        saveType: 'dexterity',
        saveDC: 15,
        onSaveEffect: 'half'
      },

      damageConfig: {
        formula: '6d6+6d6+6d6',
        damageType: 'force',
        damageTypes: ['force', 'necrotic', 'fire'],
        scalingType: 'none'
      },

      debuffConfig: {
        statusEffects: [
          {
            id: 'blinded',
            name: 'Blinded',
            description: 'Blinded by void flames',
            durationType: 'rounds',
            durationValue: 1
          },
          {
            id: 'stunned',
            name: 'Stunned',
            description: 'Stunned by chaotic void energy',
            durationType: 'rounds',
            durationValue: 1
          }
        ]
      },

      effectTypes: ['damage', 'debuff'],

      specialMechanics: {
        sphereCombo: {
          enabled: true,
          elements: ['Arcane', 'Shadow', 'Fire', 'Chaos'],
          comboType: '4-sphere-ultimate',
          entropyWeaverBonus: 'Double damage, enemies also take 2d6 void damage per round for 3 rounds',
          description: 'Ultimate destruction combination'
        }
      },

      tags: ['4-sphere', 'arcane', 'shadow', 'fire', 'chaos', 'ultimate', 'entropy-weaver'],
      flavorText: 'A tear in reality unleashes void flames that consume all matter and energy.'
    }
  ]
};


