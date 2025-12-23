/**
 * Plaguebringer Class Data
 *
 * Complete class information for the Plaguebringer - a master of pestilence
 * who cultivates afflictions through strategic spell combinations.
 */

export const PLAGUEBRINGER_DATA = {
  id: 'plaguebringer',
  name: 'Plaguebringer',
  icon: 'fas fa-biohazard',
  role: 'Damage/Control',

  // Overview section
  overview: {
    title: 'The Plaguebringer',
    subtitle: 'Master of Pestilence and Decay',

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
- Burst damage via affliction consumption and evolution
- Area denial through contagion spread

**Control Capabilities**:
- Debuffs that reduce enemy effectiveness
- Crowd control through fear, confusion, and paralysis
- Area control via plague zones and contagion

**Survivability**: Moderate - Plaguebringers can convert healing into damage on enemies and have some self-sustain through dark rejuvenation effects, but are vulnerable to burst damage.`
    },

    playstyle: {
      title: 'Playstyle',
      content: `**Core Mechanic**: Affliction Cultivation. Apply base afflictions, then use category spells (Weaken, Torment, Fester, etc.) to evolve them into devastating final forms.

**Decision Points**:
- Which base affliction to apply to each target
- Which development path to follow for each affliction
- When to evolve afflictions vs. applying new ones
- Which targets to focus cultivation on vs. spreading contagion

**Skill Expression**:
- Tracking multiple afflictions across multiple targets
- Optimal spell sequencing to reach desired final afflictions
- Managing mana while building affliction chains
- Timing affliction consumption for maximum impact

**Team Dynamics**:
- Excels in prolonged encounters where afflictions can fully develop
- Synergizes with classes that can protect them during setup
- Benefits from crowd control to safely cultivate afflictions
- Can spread afflictions to grouped enemies for massive AoE damage`
    },

    immersiveCombatExample: {
      title: 'Combat Example: The Plague Garden',
      content: `**The Setup**: You're a Plaguebringer (Pestilence specialization) facing a group of knights (4 knights + 1 knight captain). Your party is with you. Starting Mana: 50/60. Your goal: Apply base afflictions to enemies, then cultivate them through category spells to evolve them into devastating final afflictions.

**Starting State**: Mana: 50/60 | HP: 50/50 | Active Afflictions: None

**Turn 1 - Planting Seeds (Afflictions: 0 → 2)**

*Four knights and their captain stand before you, armor gleaming. They don't know it yet, but they're already dead. They just haven't finished dying.*

**Your Action**: Cast "Curse of Agony" on Knight Captain (6 mana, base affliction)
**Effect**: Apply base affliction "Curse of Agony" (deals 1d6 damage per turn)

*You gesture at the captain. Dark energy seeps into his armor, invisible to him. The seed is planted.*

**Affliction Applied**: Knight Captain has "Curse of Agony" (Stage 1: Base)
**Damage**: 1d6 → [4] = 4 damage per turn

**Mana**: 50 - 6 = 44/60

**Your Action (1 AP)**: Cast "Venomous Touch" on Knight #1 (4 mana, base affliction)
**Effect**: Apply base affliction "Venomous Touch" (deals 1d4 poison damage per turn)

*You point at Knight #1. Invisible venom seeps into his bloodstream. Another seed planted.*

**Affliction Applied**: Knight #1 has "Venomous Touch" (Stage 1: Base)
**Damage**: 1d4 → [3] = 3 poison damage per turn

**Mana**: 44 - 4 = 40/60

**Current Afflictions**:
- Knight Captain: Curse of Agony (Stage 1)
- Knight #1: Venomous Touch (Stage 1)

**Turn 2 - Cultivation Begins (Afflictions: Stage 1 → Stage 2)**

*The afflictions tick. The captain takes 4 damage. Knight #1 takes 3 poison damage. They don't understand yet. But they will.*

**Your Action**: Cast "Weaken" on Knight Captain (5 mana, category spell)
**Effect**: Evolve "Curse of Agony" → "Curse of Weakness" (Stage 2: Weaken path)

*You channel dark energy into the captain's curse. It EVOLVES. The curse spreads through his body, weakening him.*

**Affliction Evolution**: Knight Captain: Curse of Agony (Stage 1) → **Curse of Weakness (Stage 2)**
**New Effect**: 2d6 damage per turn + target has -2 AC

**Mana**: 40 - 5 = 35/60

**Knight Captain**: Takes 2d6 → [5, 4] = 9 damage, AC reduced by 2

**Your Action (1 AP)**: Cast "Fester" on Knight #1 (5 mana, category spell)
**Effect**: Evolve "Venomous Touch" → "Festering Venom" (Stage 2: Fester path)

*The venom in Knight #1's blood begins to FESTER. It spreads, corrupting his flesh.*

**Affliction Evolution**: Knight #1: Venomous Touch (Stage 1) → **Festering Venom (Stage 2)**
**New Effect**: 2d4 poison damage per turn + spreads to adjacent enemies

**Mana**: 35 - 5 = 30/60

**Knight #1**: Takes 2d4 → [3, 4] = 7 poison damage
**Contagion**: Knight #2 (adjacent) is infected with "Venomous Touch" (Stage 1)

*The venom SPREADS. Knight #2 doesn't notice yet, but he's infected.*

**Current Afflictions**:
- Knight Captain: Curse of Weakness (Stage 2: Weaken path)
- Knight #1: Festering Venom (Stage 2: Fester path)
- Knight #2: Venomous Touch (Stage 1: Contagion from Knight #1)

**Turn 3 - Further Evolution (Afflictions: Stage 2 → Stage 3)**

*The afflictions tick again. Captain takes 9 damage. Knight #1 takes 7 poison damage. Knight #2 takes 3 poison damage from the contagion. They're starting to panic.*

**Knight Captain**: "Something's wrong! I feel... weak!"
**You**: "You're dying. Slowly. Beautifully."

**Your Action**: Cast "Torment" on Knight Captain (6 mana, category spell)
**Effect**: Evolve "Curse of Weakness" → "Curse of Agonizing Weakness" (Stage 3: Weaken + Torment path)

*You twist the curse further. The captain's weakness becomes AGONY.*

**Affliction Evolution**: Knight Captain: Curse of Weakness (Stage 2) → **Curse of Agonizing Weakness (Stage 3)**
**New Effect**: 3d6 damage per turn + -3 AC + disadvantage on attack rolls

**Mana**: 30 - 6 = 24/60

**Knight Captain**: Takes 3d6 → [6, 5, 4] = 15 damage, AC -3, disadvantage on attacks

*The captain falls to one knee, gasping. His armor feels like lead. His sword is too heavy to lift.*

**Your Action (1 AP)**: Cast "Amplify Pain" on Knight #1 (5 mana, category spell)
**Effect**: Evolve "Festering Venom" → "Amplified Festering Venom" (Stage 3: Fester + Amplify path)

*The festering venom INTENSIFIES. Knight #1 screams.*

**Affliction Evolution**: Knight #1: Festering Venom (Stage 2) → **Amplified Festering Venom (Stage 3)**
**New Effect**: 3d6 poison damage per turn + spreads to adjacent enemies + -2 Constitution saves

**Mana**: 24 - 5 = 19/60

**Knight #1**: Takes 3d6 → [6, 5, 6] = 17 poison damage
**Contagion**: Knight #3 (adjacent) is infected with "Venomous Touch" (Stage 1)

*Knight #1 collapses, vomiting black bile. The venom spreads to Knight #3.*

**Current Afflictions**:
- Knight Captain: Curse of Agonizing Weakness (Stage 3: Weaken + Torment)
- Knight #1: Amplified Festering Venom (Stage 3: Fester + Amplify)
- Knight #2: Venomous Touch (Stage 1: Contagion)
- Knight #3: Venomous Touch (Stage 1: Contagion)

**Turn 4 - The Harvest (Afflictions: Stage 3 → FINAL)**

*The afflictions tick. Captain takes 15 damage. Knight #1 takes 17 poison damage. Knights #2 and #3 take 3 poison damage each. The captain is at 30% HP. Knight #1 is at 20% HP.*

**Your Action**: Cast "Decay" on Knight Captain (7 mana, category spell)
**Effect**: Evolve "Curse of Agonizing Weakness" → "CURSE OF TOTAL DECAY" (Stage 4: FINAL - Weaken + Torment + Decay)

*You raise your hand. The curse reaches its FINAL FORM. The captain's body begins to ROT.*

**Affliction Evolution**: Knight Captain: Curse of Agonizing Weakness (Stage 3) → **CURSE OF TOTAL DECAY (FINAL)**
**New Effect**: 5d8 damage per turn + -5 AC + disadvantage on all rolls + healing reduced by 50% + spreads to all enemies within 10 ft

**Mana**: 19 - 7 = 12/60

**Knight Captain**: Takes 5d8 → [7, 8, 6, 5, 7] = 33 damage → **DEAD** (HP reduced to 0)

*The captain's flesh ROTS off his bones. He falls, dead, his body a festering corpse. The curse SPREADS.*

**Contagion (Final Affliction)**: All knights within 10 ft are infected with "Curse of Agony" (Stage 1)

*Knights #2, #3, and #4 are all infected. They stare in horror at their captain's corpse.*

**Knight #2**: "What... what did you DO?!"
**You**: "I cultivated him. From seed to harvest. And now, you're all infected."

**Current Afflictions**:
- Knight Captain: DEAD
- Knight #1: Amplified Festering Venom (Stage 3)
- Knight #2: Venomous Touch (Stage 1) + Curse of Agony (Stage 1)
- Knight #3: Venomous Touch (Stage 1) + Curse of Agony (Stage 1)
- Knight #4: Curse of Agony (Stage 1)

**Turn 5 - The Plague Spreads**

*The afflictions tick. Knight #1 takes 17 poison damage → DEAD. Knights #2, #3, #4 take damage from multiple afflictions.*

**Your Party's Mage**: "They're... they're all dying. You didn't even touch them."
**You**: "I don't need to touch them. I planted the seeds. The afflictions do the rest."

**Your Action**: Cast "Nurture" on Knight #2 (6 mana, category spell)
**Effect**: Evolve both afflictions on Knight #2

*You gesture at Knight #2. Both his afflictions GROW.*

**Affliction Evolution**:
- Venomous Touch (Stage 1) → Nurtured Venom (Stage 2)
- Curse of Agony (Stage 1) → Nurtured Curse (Stage 2)

**Mana**: 12 - 6 = 6/60

**Knight #2**: Takes 2d4 + 2d6 = [3, 4] + [5, 6] = 18 total damage → DEAD

*Knight #2 falls, his body consumed by multiple afflictions.*

**Knights #3 and #4**: Flee in terror

**Combat Over**

*You stand among the corpses. Your party stares at you in a mixture of awe and horror.*

**Your Party's Tank**: "You... you killed them all with DISEASES. They rotted alive."
**You**: "I cultivated them. The captain started with Curse of Agony (Stage 1). I evolved it through Weaken (Stage 2), then Torment (Stage 3), then Decay (FINAL). Each stage made it stronger. The final form dealt 33 damage in one turn and killed him."
**Your Party's Rogue**: "And the venom spread to the others?"
**You**: "Festering Venom spreads to adjacent enemies. Knight #1 infected Knights #2 and #3. The captain's final curse infected everyone within 10 feet. That's the beauty of contagion."
**Your Party's Mage**: "How many afflictions can you track at once?"
**You**: "As many as there are targets. Each enemy is a garden. Each affliction is a seed. I cultivate them all."

**Final State**: Mana: 6/60 | HP: 50/50 | Enemies: All dead or fled

**The Lesson**: Plaguebringer gameplay is about:
1. **Base Afflictions**: Applied Curse of Agony and Venomous Touch (Stage 1 afflictions)
2. **Category Spells**: Used Weaken, Fester, Torment, Amplify Pain, Decay, Nurture to evolve afflictions
3. **Evolution Paths**: Captain: Curse → Weaken → Torment → Decay (4 stages to FINAL)
4. **Contagion**: Festering Venom spread to adjacent enemies, Final Curse spread to all within 10 ft
5. **Damage Scaling**: Stage 1 (1d6) → Stage 2 (2d6) → Stage 3 (3d6) → FINAL (5d8)
6. **Multi-Affliction**: Knight #2 had 2 afflictions simultaneously, took damage from both
7. **Strategic Cultivation**: Focused on captain for final affliction, spread contagion to others

You're not a burst damage dealer. You're a PLAGUE GARDENER. You plant seeds (base afflictions), cultivate them (category spells), and watch them GROW into devastating final forms. The captain went from 4 damage/turn to 33 damage/turn in 4 stages. The venom SPREAD through contagion. Each enemy is a garden to be tended. Each affliction is a masterpiece of decay. You don't kill quickly. You kill BEAUTIFULLY.`
    }
  },

  // Resource System
  resourceSystem: {
    title: 'Affliction Cultivation',
    subtitle: 'Eight Categories, Infinite Combinations',

    description: `The Affliction Cultivation system is the Plaguebringer's unique mechanic. Base afflictions are applied to targets, then evolved through specific spell categories. Each category spell advances the affliction along a development path, transforming it into increasingly powerful forms. The system rewards strategic planning and careful spell sequencing.`,

    mechanics: {
      title: 'How It Works',
      content: `**Step 1: Apply Base Affliction**
Cast a base affliction spell on a target (e.g., Curse of Agony, Blight of Despair, Venomous Touch).

**Step 2: Cultivate with Category Spells**
Use spells from specific categories to evolve the affliction:
- **Weaken**: Reduce defenses, make vulnerable
- **Torment**: Inflict psychic pain, cause confusion
- **Fester**: Spread decay, infect others
- **Amplify Pain**: Intensify existing suffering
- **Decay**: Accelerate decomposition, reduce healing
- **Nurture**: Strengthen afflictions, convert healing to harm
- **Corrupt**: Twist essence, turn strengths into weaknesses
- **Infect**: Spread contagion, increase vulnerability

**Step 3: Reach Final Affliction**
After following the correct development path (usually 3 category spells), the base affliction evolves into its final, devastating form.

**Example**:
1. Cast **Curse of Agony** (base affliction)
2. Cast **Mind Fracture** (Weaken category) → Affliction advances
3. Cast **Tormenting Visions** (Torment category) → Affliction advances
4. Cast **Amplify Pain** (Amplify Pain category) → Evolves into **Curse of True Agony**
   - Effect: 2d10 psychic damage per turn for 3 turns, stuns target for 2 turns

**Strategic Depth**:
- Different paths lead to different final afflictions
- Can maintain multiple afflictions on different targets
- Some final afflictions spread to nearby enemies
- Timing evolution is critical - evolve too early and waste potential, too late and target may die`
    },

    afflictionPathsTable: {
      title: 'Affliction Development Paths',
      headers: ['Base Affliction', 'Development Path', 'Final Affliction', 'Final Effect'],
      rows: [
        ['Curse of Agony', 'Weaken → Torment → Amplify Pain', 'Curse of True Agony', '2d10 psychic/turn for 3 turns, stun 2 turns'],
        ['Blight of Despair', 'Weaken → Fester → Decay', 'Blight of Despair Enhanced', '-7 STR/AGI for 1 min, disadvantage on attacks'],
        ['Whisper of Decay', 'Torment → Fester → Corrupt', 'Scream of the Plagued', '15ft aura: random attacks for 1 min'],
        ['Venomous Touch', 'Infect → Weaken → Amplify Pain', 'Deadly Caress', '5d6 poison, -5 armor for 1 min'],
        ['Fever Dream', 'Torment → Nurture → Infect', 'Epidemic Nightmare', '3d6 psychic, spreads fear (DC 15) in 5ft'],
        ['Chill of the Void', 'Decay → Weaken → Corrupt', 'Eternal Chill', '10ft freeze, 3d6 cold/turn for 2 turns'],
        ['Mark of the Pestilent', 'Nurture → Decay → Amplify Pain', 'Sigil of the Doomed', '20ft aura: no healing, 3d6 necrotic'],
        ['Retching Malediction', 'Fester → Torment → Nurture', 'Plague of Desolation', '15ft zone: 1d6 damage reduction, healing→poison']
      ]
    },

    categorySpellsTable: {
      title: 'Category Spell Examples',
      headers: ['Category', 'Example Spells', 'Primary Effect', 'Mana Cost Range'],
      rows: [
        ['Weaken', 'Enfeebling Fog, Drain Vitality, Crippling Miasma', 'Reduce defenses, stats, or actions', '4-6 mana'],
        ['Torment', 'Nightmare Pulse, Hallucinogenic Spores, Agonizing Wail', 'Psychic damage, confusion, fear', '6-8 mana'],
        ['Fester', 'Toxic Bloom, Infectious Sores, Plague of Flies', 'Spread damage, infect nearby targets', '5-7 mana'],
        ['Amplify Pain', "Suffering's Echo, Torment Amplifier, Pain Magnification", 'Double/triple existing damage', '8-10 mana'],
        ['Decay', 'Necrotic Burst, Decomposition, Wither Touch', 'Permanent HP loss, reduce healing', '8-10 mana'],
        ['Nurture', 'Dark Rejuvenation, Plague\'s Embrace, Corrupting Miasma', 'Convert healing to damage', '7-10 mana'],
        ['Corrupt', 'Essence Corruption, Perverse Infusion, Blight Seed', 'Turn strengths into weaknesses', '7-9 mana'],
        ['Infect', 'Pandemic Wave, Contagion Burst, Virulent Touch', 'Increase vulnerability, spread plague', '10-12 mana']
      ]
    },



    strategicConsiderations: {
      title: 'Strategic Affliction Management',
      content: `**Single Target Focus (Boss Fights)**:
- Apply base affliction immediately
- Follow optimal development path for maximum damage
- Use Amplify Pain category spells for burst windows
- Time final affliction evolution with team damage phases

**Multi-Target Spread (Trash Packs)**:
- Apply base afflictions to multiple targets
- Use Fester and Infect category spells to spread contagion
- Prioritize afflictions with AoE final forms (Scream of the Plagued, Plague of Desolation)
- Let afflictions spread naturally through contagion mechanics

**Affliction Tracking**:
- **1-2 Active Afflictions**: Easy to manage, focus on optimal paths
- **3-4 Active Afflictions**: Moderate complexity, prioritize high-value targets
- **5+ Active Afflictions**: High skill ceiling, requires careful tracking and sequencing

**Mana Management**:
- Base afflictions are cheap (3-5 mana)
- Category spells are moderate (4-12 mana)
- Plan spell sequences to avoid running out of mana mid-evolution
- Prioritize completing afflictions over starting new ones when low on mana

**Development Path Strategy**:
- **Weaken → Torment → Amplify Pain**: High single-target burst damage
- **Torment → Fester → Corrupt**: Crowd control and AoE spread
- **Nurture → Decay → Amplify Pain**: Anti-healing and sustained damage
- **Infect → Weaken → Amplify Pain**: Vulnerability stacking for team damage

**Team Coordination**:
- Communicate when final afflictions are about to trigger
- Coordinate burst windows with Amplify Pain evolutions
- Use plague zones to control enemy positioning
- Warn allies about contagion spread to avoid friendly fire`
    },

    playingInPerson: {
      title: 'Playing Plaguebringer In Person',
      content: `**Required Materials**:
- **Affliction Tokens** (different colors for different affliction types)
- **Affliction Tracker Cards** (one per enemy, showing current afflictions)
- **Evolution Path Chart** (showing how afflictions evolve)
- **Stage Markers** (to show Base → Stage 2 → Stage 3 → Final)
- **Contagion Markers** (to show which enemies can spread afflictions)
- **Damage Dice** (for tracking DoT damage each turn)

**Primary Tracking Method: Affliction Tracker Cards**

The Plaguebringer's affliction system is tracked using physical cards placed next to each enemy, showing which afflictions they have and what stage each affliction is at. As you cast category spells (Weaken, Torment, Fester, etc.), you advance afflictions through their evolution paths.

**Setup**:
\`\`\`
AFFLICTION TRACKER (per enemy):

ENEMY: Knight Captain
═══════════════════════════════════
AFFLICTIONS:
[Curse of Agony] Stage: Base → 2 → 3 → Final
  Current: Stage 2 (Torment applied)
  Damage: 2d6 per turn
  Next: Apply Fester → Stage 3

[Venomous Touch] Stage: Base → 2 → 3 → Final
  Current: Base
  Damage: 1d4 poison per turn
  Next: Apply Weaken → Stage 2
═══════════════════════════════════

EVOLUTION PATHS:
Base → Weaken → Torment → Final (Amplify Pain)
Base → Fester → Decay → Final (Necrotic Bloom)
Base → Corrupt → Wither → Final (Soul Rot)
\`\`\`

**How It Works**:

**Step 1: Apply Base Affliction**
1. Cast a base affliction spell (Curse of Agony, Venomous Touch, etc.)
2. Place an affliction token on the enemy's card
3. Mark it as "Stage: Base"
4. Roll damage each turn (1d4 or 1d6 depending on affliction)

**Step 2: Evolve Affliction (Category Spells)**
1. Cast a category spell (Weaken, Torment, Fester, Corrupt, Decay, Wither)
2. Advance the affliction to the next stage
3. Update the stage marker on the card
4. Increase damage dice (Base: 1d6 → Stage 2: 2d6 → Stage 3: 3d6)

**Step 3: Reach Final Affliction**
1. Apply the final category spell in the evolution path
2. Affliction reaches "Final" stage
3. Trigger powerful final effect (Amplify Pain, Necrotic Bloom, Soul Rot)
4. Remove affliction after final effect triggers

**Example Affliction Evolution**:

*You're fighting a Knight Captain*

**Turn 1 - Apply Base Affliction**:
1. "I cast Curse of Agony on the Knight Captain!"
2. Place purple token on Knight Captain's card
3. Mark: [Curse of Agony] Stage: Base
4. Damage: 1d6 per turn → Roll [4] = 4 damage

**Turn 2 - Evolve to Stage 2 (Weaken Path)**:
1. "I cast Weaken on the Knight Captain!"
2. Advance affliction: Base → Stage 2
3. Update card: [Curse of Agony] Stage: 2 (Weaken)
4. Damage: 2d6 per turn → Roll [4,5] = 9 damage
5. Effect: Target has -2 AC, disadvantage on STR saves

**Turn 3 - Evolve to Stage 3 (Torment Path)**:
1. "I cast Torment on the Knight Captain!"
2. Advance affliction: Stage 2 → Stage 3
3. Update card: [Curse of Agony] Stage: 3 (Torment)
4. Damage: 3d6 per turn → Roll [5,6,4] = 15 damage
5. Effect: Target has -2 AC, disadvantage on STR saves, -10 ft speed

**Turn 4 - Reach Final Affliction (Amplify Pain)**:
1. "I cast Amplify Pain on the Knight Captain!"
2. Advance affliction: Stage 3 → Final
3. **FINAL EFFECT**: Deal 6d6 immediate damage + consume affliction
4. Roll: 6d6 → [6,5,4,6,5,4] = 30 damage!
5. Remove affliction token (consumed)

**Affliction Evolution Paths**:

**Path 1: Amplify Pain (Burst Damage)**
\`\`\`
Base → Weaken → Torment → Amplify Pain (Final)

WEAKEN (Stage 2):
• Damage: 2d6 per turn
• Effect: -2 AC, disadvantage on STR saves

TORMENT (Stage 3):
• Damage: 3d6 per turn
• Effect: -2 AC, disadvantage on STR/AGI saves, -10 ft speed

AMPLIFY PAIN (Final):
• Immediate: 6d6 damage
• Effect: Consume affliction, target stunned 1 round
\`\`\`

**Path 2: Necrotic Bloom (AoE Spread)**
\`\`\`
Base → Fester → Decay → Necrotic Bloom (Final)

FESTER (Stage 2):
• Damage: 2d6 necrotic per turn
• Effect: Healing reduced by 50%

DECAY (Stage 3):
• Damage: 3d6 necrotic per turn
• Effect: Healing reduced by 75%, -2 CON saves

NECROTIC BLOOM (Final):
• Immediate: Affliction spreads to all enemies within 15 ft
• Effect: All nearby enemies gain Base affliction
• Original target: 4d6 necrotic damage
\`\`\`

**Path 3: Soul Rot (Permanent Debuff)**
\`\`\`
Base → Corrupt → Wither → Soul Rot (Final)

CORRUPT (Stage 2):
• Damage: 2d6 psychic per turn
• Effect: Disadvantage on Spirit saves

WITHER (Stage 3):
• Damage: 3d6 psychic per turn
• Effect: Disadvantage on all mental saves, -2 spell attack

SOUL ROT (Final):
• Immediate: 5d6 psychic damage
• Effect: Permanent -2 to all stats until Greater Restoration
• Affliction persists even after combat
\`\`\`

**Affliction Tracker Card Template**:
\`\`\`
═══════════════════════════════════
ENEMY: [Name]
HP: [Current/Max]
═══════════════════════════════════
AFFLICTIONS:

[1] Curse of Agony
    Stage: [Base] [2] [3] [Final]
    Path: Weaken → Torment → Amplify Pain
    Damage: 1d6 per turn
    Effects: None yet

[2] Venomous Touch
    Stage: [Base] [2] [3] [Final]
    Path: Fester → Decay → Necrotic Bloom
    Damage: 1d4 poison per turn
    Effects: None yet
═══════════════════════════════════
NEXT TURN DAMAGE: [Roll all affliction dice]
\`\`\`

**Example In-Person Turn**:

*You have 3 enemies with various afflictions*

**Turn 1 - Apply Base Afflictions**:
1. "I cast Curse of Agony on Knight #1!"
   - Place purple token on Knight #1 card
   - Mark: [Curse of Agony] Stage: Base

2. "I cast Venomous Touch on Knight #2!"
   - Place green token on Knight #2 card
   - Mark: [Venomous Touch] Stage: Base

**Turn 2 - Evolve Afflictions**:
1. "I cast Weaken on Knight #1!"
   - Advance: Base → Stage 2
   - Update card: [Curse of Agony] Stage: 2 (Weaken)
   - Knight #1 now has -2 AC

2. "I cast Fester on Knight #2!"
   - Advance: Base → Stage 2
   - Update card: [Venomous Touch] Stage: 2 (Fester)
   - Knight #2 healing reduced by 50%

**Turn 3 - Continue Evolution**:
1. "I cast Torment on Knight #1!"
   - Advance: Stage 2 → Stage 3
   - Update card: [Curse of Agony] Stage: 3 (Torment)
   - Knight #1: -2 AC, -10 ft speed, disadvantage on saves

2. "I cast Decay on Knight #2!"
   - Advance: Stage 2 → Stage 3
   - Update card: [Venomous Touch] Stage: 3 (Decay)
   - Knight #2: Healing reduced 75%, -2 CON saves

**Turn 4 - Trigger Final Afflictions**:
1. "I cast Amplify Pain on Knight #1!"
   - Final effect: 6d6 → [6,5,4,6,5,4] = 30 damage!
   - Knight #1 stunned for 1 round
   - Remove affliction token

2. "I cast Necrotic Bloom on Knight #2!"
   - Affliction spreads to Knight #3 (within 15 ft)
   - Knight #2 takes 4d6 → [5,4,6,3] = 18 damage
   - Knight #3 gains [Venomous Touch] Base affliction
   - Remove affliction from Knight #2

**Alternative Tracking Methods**:

**Method 1: Colored Tokens**
- Use different colored tokens for different affliction types
- Stack tokens to show stage (1 token = Base, 2 = Stage 2, etc.)
- Simple but requires many tokens

**Method 2: Affliction Dice**
- Use dice to show stage (d4 = Base, d6 = Stage 2, d8 = Stage 3, d10 = Final)
- Place die next to enemy showing current stage
- Visual and easy to adjust

**Method 3: Paper Tracking**
- Write afflictions on paper next to enemy names
- Cross out and rewrite as they evolve
- Minimalist but less visual

**Method 4: Affliction Board**
- Create a board with enemy names and affliction slots
- Use tokens or markers to show current afflictions
- Centralized tracking for all enemies

**Quick Reference Card Template**:
\`\`\`
PLAGUEBRINGER QUICK REFERENCE

BASE AFFLICTIONS:
• Curse of Agony: 1d6 damage/turn
• Venomous Touch: 1d4 poison/turn
• Plague Touch: 1d6 disease/turn
• Shadow Curse: 1d4 shadow/turn

CATEGORY SPELLS (Evolution):
• Weaken: Advance affliction, -2 armor
• Torment: Advance affliction, -10 ft speed
• Fester: Advance affliction, -50% healing
• Corrupt: Advance affliction, -Spirit saves
• Decay: Advance affliction, -75% healing
• Wither: Advance affliction, -spell attack

FINAL AFFLICTIONS:
• Amplify Pain: 6d6 burst, stun 1 round
• Necrotic Bloom: Spread to nearby enemies
• Soul Rot: 5d6 psychic, permanent -2 stats

EVOLUTION PATHS:
Path 1: Weaken → Torment → Amplify Pain
Path 2: Fester → Decay → Necrotic Bloom
Path 3: Corrupt → Wither → Soul Rot
\`\`\`

**Thematic Enhancements**:

Many players enhance the Plaguebringer experience with:
- **Disease Tokens**: Use biohazard symbols or skull tokens
- **Colored Markers**: Different colors for different affliction types
- **Affliction Cards**: Print cards with affliction artwork
- **Plague Dice**: Green/black dice for rolling affliction damage
- **Evolution Chart**: Visual chart showing all evolution paths
- **Contagion Markers**: Special markers for enemies that can spread afflictions

**Affliction Management Tips**:

**Building Strategy**:
- **Spread Base Afflictions**: Apply base afflictions to multiple enemies early
- **Choose Evolution Paths**: Decide which path to follow for each enemy
- **Track Stages**: Keep affliction cards updated with current stages
- **Plan Final Effects**: Know which final affliction you're building toward

**Evolution Strategy**:
- **Amplify Pain**: Best for single-target burst damage
- **Necrotic Bloom**: Best for grouped enemies (spreads afflictions)
- **Soul Rot**: Best for bosses (permanent debuff)
- **Multi-Target**: Evolve different afflictions on different enemies

**Combat Strategy**:
- **Early Game**: Apply base afflictions to all enemies
- **Mid Game**: Evolve afflictions to Stage 2-3
- **Late Game**: Trigger final afflictions for burst damage
- **Contagion**: Use Necrotic Bloom to spread afflictions to new targets

**Why This System Works**: The physical act of placing affliction tokens on enemy cards and advancing them through stages creates a satisfying sense of cultivation. You're literally watching your "plague garden" grow as afflictions evolve from weak DoTs into devastating final effects. The tracker cards make it easy to see which enemies have which afflictions and what stage they're at, preventing confusion. The evolution paths create strategic decisions about which category spells to cast, and the final afflictions provide dramatic payoff moments.

**Pro Tips**:
- **Color-Code Afflictions**: Use different colored tokens for different types
- **Track Damage**: Roll all affliction damage at start of enemy turn
- **Communicate**: Tell party which enemies have which afflictions
- **Plan Paths**: Decide evolution path before applying base affliction
- **Spread Smart**: Use Necrotic Bloom when enemies are grouped
- **Specialization Synergy**: Pestilence = contagion spread, Decay = necrotic focus, Corruption = debuff focus

**Budget-Friendly Alternatives**:
- **No tokens?** Use coins, buttons, or dice to mark afflictions
- **No cards?** Write afflictions on paper next to enemy names
- **No evolution chart?** Write paths on index card
- **Minimalist**: Track afflictions and stages on paper only

**Specialization-Specific Tracking**:

**Pestilence**:
- Afflictions spread to nearby enemies automatically
- Mark which enemies can spread (contagion markers)
- Track contagion radius (15 ft)

**Decay**:
- Necrotic afflictions deal +1d6 damage
- Mark necrotic afflictions with special tokens
- Track bonus damage separately

**Corruption**:
- Debuffs last longer and are more severe
- Mark enhanced debuffs on affliction cards
- Track debuff durations

**Why Plaguebringer Is Perfect for In-Person Play**: The class is built around tracking multiple afflictions across multiple enemies, which is easier to visualize with physical tokens and cards. The evolution system creates a satisfying progression as you watch afflictions grow from weak DoTs into devastating final effects. The physical act of placing tokens, advancing stages, and triggering final effects makes the "plague cultivation" theme tangible. The tracker cards prevent confusion and make it easy to see the battlefield state at a glance. Every affliction is a visible reminder of your growing power, making the Plaguebringer's patient, methodical playstyle incredibly satisfying.`
    }
  },

  // Specializations
  specializations: {
    title: 'Plaguebringer Specializations',
    subtitle: 'Three Paths of Pestilence',

    description: `Plaguebringers can specialize in three distinct approaches to affliction cultivation, each focusing on different aspects of disease manipulation and plague spreading.`,

    sharedPassive: {
      name: 'Plague Mastery',
      icon: 'spell_shadow_plaguecloud',
      description: 'Your afflictions last 1d4 additional rounds and resist dispel attempts (roll 1d6, on 5-6 resist). Additionally, whenever an afflicted target dies, you gain 1d4 mana.'
    },

    specs: [
      {
        id: 'virulent-spreader',
        name: 'Virulent Spreader',
        icon: 'ability_creature_disease_05',
        color: '#556B2F',
        description: 'Masters of contagion who excel at spreading afflictions across multiple targets.',

        specPassive: {
          name: 'Epidemic Mastery',
          description: 'Your Fester and Infect category spells have their spread range increased by 10 ft. When an affliction spreads to a new target, it retains 2 of its 3 development steps (loses 1 step).'
        },

        playstyle: 'Focus on applying base afflictions to multiple targets, then use Fester and Infect category spells to spread the plague. Position yourself centrally to maximize contagion chains. Your strength lies in grouped enemies where one affliction can cascade into a full epidemic.',

        strengths: [
          'Exceptional multi-target damage',
          'Rapid affliction spread in grouped enemies',
          'Strong area denial through plague zones',
          'Efficient mana usage through contagion'
        ],

        weaknesses: [
          'Lower single-target burst than other specs',
          'Requires enemies to be grouped',
          'Less effective against spread-out targets',
          'Contagion can be unpredictable'
        ],

        playstyleTips: [
          'Focus on afflictions with strong spread mechanics',
          'Use Fester category spells liberally',
          'Position yourself to maximize contagion chains',
          'Prioritize targets in the center of enemy groups'
        ],

        keyAbilities: [
          {
            name: 'Plague Burst',
            cost: '40 Corruption',
            description: 'Spread all active afflictions to enemies within 15 ft. Afflictions retain their current stage.'
          },
          {
            name: 'Epidemic Wave',
            cost: '60 Corruption',
            description: 'For 2 turns, all Fester and Infect category spells cost no mana and have doubled spread range.'
          },
          {
            name: 'Contagion Mastery',
            cost: 'Passive',
            description: 'When an affliction spreads, roll 1d6: on 5-6, it spreads to an additional random target within range.'
          },
          {
            name: 'Festering Ground',
            cost: '80 Corruption',
            description: 'Create a 20 ft plague zone for 4 turns. Enemies entering the zone gain a random Stage 1 affliction.'
          }
        ]
      },

      {
        id: 'torment-weaver',
        name: 'Torment Weaver',
        icon: 'spell_shadow_mindtwisting',
        color: '#4B0082',
        description: 'Specialists in psychic afflictions who break minds as easily as bodies.',

        specPassive: {
          name: 'Psychic Resonance',
          description: 'Your Torment category spells deal +1d6 damage. Additionally, targets affected by your psychic afflictions must roll 1d6 when taking an action - on a 5-6, they attack their nearest ally instead.'
        },

        playstyle: 'Specialize in psychic afflictions that break enemy minds. Target intelligent enemies and casters first, using Torment category spells to advance afflictions while causing confusion. Your afflictions turn enemies against each other, creating chaos in their ranks.',

        strengths: [
          'High crowd control potential',
          'Strong against intelligent enemies',
          'Causes chaos in enemy formations',
          'Bypasses physical defenses'
        ],

        weaknesses: [
          'Less effective against mindless enemies',
          'Lower sustained damage than other specs',
          'Requires careful positioning to avoid friendly fire',
          'Psychic resistance can negate effects'
        ],

        playstyleTips: [
          'Prioritize Torment development paths',
          'Target enemy casters and leaders first',
          'Use confusion effects to disrupt enemy strategies',
          'Combine with Corrupt category for maximum chaos'
        ],

        keyAbilities: [
          {
            name: 'Mind Fracture',
            cost: '50 Corruption',
            description: 'All afflicted enemies must make a Spirit save (DC 15) or be stunned for 1 turn.'
          },
          {
            name: 'Psychic Cascade',
            cost: '70 Corruption',
            description: 'Your next Torment category spell affects all enemies within 10 ft of the target.'
          },
          {
            name: 'Mental Domination',
            cost: 'Passive',
            description: 'Psychic afflictions have their confusion chance increased to 4-6 on 1d6 (instead of 5-6).'
          },
          {
            name: 'Nightmare Fuel',
            cost: '90 Corruption',
            description: 'All afflicted enemies take 2d8 psychic damage and become frightened for 2 turns.'
          }
        ]
      },

      {
        id: 'decay-harbinger',
        name: 'Decay Harbinger',
        icon: 'spell_shadow_deathanddecay',
        color: '#2F4F2F',
        description: 'Masters of necrotic decay who accelerate decomposition and prevent healing.',

        specPassive: {
          name: 'Accelerated Decay',
          description: 'Your Decay category spells reduce enemy maximum HP by an additional 1d6. Additionally, enemies affected by your afflictions have healing reduced by 1d8 per heal received.'
        },

        playstyle: 'Master of attrition warfare. Apply afflictions to high-HP targets and healers, then use Decay and Nurture category spells to stack permanent HP reduction. Your anti-healing capabilities make you invaluable against regenerating enemies and healer-heavy compositions.',

        strengths: [
          'Exceptional anti-healing capabilities',
          'Permanent HP reduction stacks over time',
          'Strong in prolonged encounters',
          'Counters regeneration and healing-heavy enemies'
        ],

        weaknesses: [
          'Slower damage ramp-up',
          'Less effective in short encounters',
          'Requires sustained pressure',
          'Permanent HP loss can be resisted'
        ],

        playstyleTips: [
          'Focus on Decay and Nurture development paths',
          'Target high-HP enemies and healers',
          'Stack permanent HP reduction effects',
          'Use Dark Rejuvenation to punish enemy healers'
        ],

        keyAbilities: [
          {
            name: 'Withering Aura',
            cost: '60 Corruption',
            description: 'Create a 20 ft aura for 3 turns. Prevents all healing and deals 1d6 necrotic damage per turn to enemies within.'
          },
          {
            name: 'Accelerated Rot',
            cost: '40 Corruption',
            description: 'All active afflictions on all targets advance one stage immediately.'
          },
          {
            name: 'Life Drain',
            cost: 'Passive',
            description: 'When an afflicted enemy takes damage from any source, you heal for 1d4 HP.'
          },
          {
            name: 'Necrotic Bloom',
            cost: '100 Corruption',
            description: 'All afflicted enemies lose 3d10 maximum HP permanently and cannot be healed for 1 minute.'
          }
        ]
      }
    ]
  },

  // Example Spells - Flat array for ClassDetailDisplay compatibility
  exampleSpells: [
          {
            id: 'pb_curse_of_agony',
            name: 'Curse of Agony',
            description: 'Plant a seed of suffering in your target. Deals 1d6 + intelligence psychic damage per turn for 4 rounds. Can be evolved through Weaken → Torment → Amplify Pain into Curse of True Agony.',
            spellType: 'ACTION',
            icon: 'spell_shadow_curseofsargeras',
            school: 'Necromancy',
            level: 1,

            typeConfig: {
              castTime: 1,
              castTimeType: 'IMMEDIATE'
            },

            targetingConfig: {
              targetingType: 'single',
              rangeType: 'ranged',
              rangeDistance: 30
            },

            durationConfig: {
              durationType: 'timed',
              duration: 4,
              durationUnit: 'rounds'
            },

            resourceCost: {
              mana: 3,
              components: ['verbal', 'somatic'],
              verbalText: 'Dolor Aeternus!',
              somaticText: 'Point at target with cursing gesture'
            },

            savingThrow: {
              enabled: true,
              attribute: 'spirit',
              difficulty: 14,
              onSuccess: 'half_damage',
              onFailure: 'full_damage'
            },

            damageConfig: {
              formula: '1d6 + intelligence',
              elementType: 'psychic',
              damageType: 'direct',
              attackType: 'spell_save',
              hasDotEffect: true,
              dotConfig: {
                dotFormula: '1d6 + intelligence',
                duration: 4,
                tickFrequency: 'turn',
                isProgressiveDot: false
              },
              savingThrowConfig: {
                enabled: true,
                savingThrowType: 'spirit',
                difficultyClass: 14,
                saveOutcome: 'halves',
                partialEffect: true,
                partialEffectFormula: 'damage/2'
              }
            },

            specialMechanics: {
              afflictionCultivation: {
                enabled: true,
                baseAffliction: 'Curse of Agony',
                developmentPath: ['Weaken', 'Torment', 'Amplify Pain'],
                finalAffliction: 'Curse of True Agony',
                finalEffect: '2d10 psychic damage per turn for 3 turns, stuns target for 2 turns'
              }
            },

            tags: ['affliction', 'base', 'psychic', 'curse', 'plaguebringer', 'torment-weaver'],
            flavorText: 'The seed of suffering takes root. Soon, it will bloom into true agony.'
          },

          {
            id: 'pb_venomous_touch',
            name: 'Venomous Touch',
            description: 'Infect your target with virulent poison. Deals poison damage initially. Can be evolved through Infect → Weaken → Amplify Pain into Deadly Caress.',
            spellType: 'ACTION',
            icon: 'ability_creature_poison_06',
            school: 'Necromancy',
            level: 1,

            typeConfig: {
              castTime: 1,
              castTimeType: 'IMMEDIATE'
            },

            targetingConfig: {
              targetingType: 'single',
              rangeType: 'melee',
              rangeDistance: 5
            },

            durationConfig: {
              durationType: 'instant'
            },

            resourceCost: {
              mana: 4,
              components: ['verbal', 'somatic'],
              verbalText: 'Venenum Tactus!',
              somaticText: 'Touch target with poisoned hand'
            },

            savingThrow: {
              enabled: true,
              attribute: 'constitution',
              difficulty: 14,
              onSuccess: 'half_damage',
              onFailure: 'full_damage'
            },

            damageConfig: {
              formula: '1d8 + intelligence',
              elementType: 'poison',
              damageType: 'direct',
              attackType: 'spell_save'
            },

            effects: {
              damage: {
                instant: {
                  amount: '1d8 + INT',
                  type: 'poison',
                  description: 'Immediate poison damage'
                }
              },
              affliction: {
                type: 'base_affliction',
                name: 'Venomous Touch',
                developmentPath: 'Infect → Weaken → Amplify Pain',
                finalForm: 'Deadly Caress',
                trackable: true
              }
            },

            specialMechanics: {
              afflictionCultivation: {
                enabled: true,
                baseAffliction: 'Venomous Touch',
                developmentPath: ['Infect', 'Weaken', 'Amplify Pain'],
                finalAffliction: 'Deadly Caress',
                finalEffect: '5d6 poison damage and -5 armor for 1 minute'
              }
            },

            tags: ['affliction', 'base', 'poison', 'melee', 'plaguebringer', 'virulent-spreader'],
            flavorText: 'A single touch. A lifetime of suffering.'
          },
          {
            id: 'pb_enfeebling_fog',
            name: 'Enfeebling Fog',
            description: 'Conjures a fog over a 20 ft radius. Characters within the fog have their armor reduced by 5 and have disadvantage on ranged attacks. Advances Weaken-path afflictions.',
            spellType: 'ACTION',
            icon: 'spell_shadow_blackplague',
            school: 'Necromancy',
            level: 2,

            typeConfig: {
              castTime: 1,
              castTimeType: 'IMMEDIATE'
            },

            targetingConfig: {
              targetingType: 'area',
              rangeType: 'ranged',
              rangeDistance: 60,
              aoeType: 'sphere',
              aoeSize: 20
            },

            durationConfig: {
              durationType: 'timed',
              duration: 1,
              durationUnit: 'minutes'
            },

            resourceCost: {
              mana: 4,
              components: ['verbal', 'somatic'],
              verbalText: 'Nebula Debilis!',
              somaticText: 'Spread arms to create fog'
            },

            savingThrow: {
              enabled: true,
              attribute: 'spirit',
              difficulty: 14,
              onSuccess: 'no_effect',
              onFailure: 'full_effect'
            },

            resolution: 'AUTOMATIC',

            effects: {
              zone: {
                type: 'debuff_zone',
                radius: 20,
                duration: '1 minute',
                description: 'Fog reduces armor and ranged accuracy'
              },
              debuff: {
                armorReduction: 5,
                disadvantage: 'ranged_attacks',
                duration: '1 minute',
                description: 'Weakened defenses and accuracy'
              }
            },

            specialMechanics: {
              afflictionAdvancement: {
                enabled: true,
                category: 'Weaken',
                description: 'Advances any afflictions on targets in the fog that require Weaken category'
              }
            },

            tags: ['weaken', 'category', 'debuff', 'area', 'plaguebringer'],
            flavorText: 'The fog saps strength and clarity. Defenses crumble.'
          },

          {
            id: 'pb_drain_vitality',
            name: 'Drain Vitality',
            description: 'Drains the life from a melee target, reducing their maximum HP and damage dealt. You gain the health drained as temporary HP. Advances Weaken-path afflictions.',
            spellType: 'ACTION',
            icon: 'spell_shadow_lifedrain02',
            school: 'Necromancy',
            level: 2,

            typeConfig: {
              castTime: 1,
              castTimeType: 'IMMEDIATE'
            },

            targetingConfig: {
              targetingType: 'single',
              rangeType: 'melee',
              rangeDistance: 5
            },

            durationConfig: {
              durationType: 'timed',
              duration: 1,
              durationUnit: 'minutes'
            },

            resourceCost: {
              mana: 5,
              components: ['verbal', 'somatic'],
              verbalText: 'Vita Exhaurio!',
              somaticText: 'Grasp target and drain essence'
            },

            savingThrow: {
              enabled: true,
              attribute: 'constitution',
              difficulty: 15,
              onSuccess: 'half_effect',
              onFailure: 'full_effect'
            },

            resolution: 'AUTOMATIC',

            debuffConfig: {
              debuffType: 'statReduction',
              effects: [{
                id: 'drained_vitality',
                name: 'Drained Vitality',
                description: 'Maximum HP reduced and damage output reduced for 1 minute',
                statModifier: {
                  stat: 'max_hp',
                  magnitude: '1d10+2',
                  magnitudeType: 'formula'
                }
              }],
              durationValue: 1,
              durationType: 'minutes',
              durationUnit: 'minutes',
              saveDC: 15,
              saveType: 'constitution',
              saveOutcome: 'halves',
              canBeDispelled: true
            },

            healingConfig: {
              formula: '1d10+2',
              healingType: 'temporaryHP',
              hasHotEffect: false
            },

            specialMechanics: {
              afflictionAdvancement: {
                enabled: true,
                category: 'Weaken',
                description: 'Advances any afflictions on the target that require Weaken category'
              },
              savingThrowEffect: {
                onSuccess: 'HP reduction is halved, no temporary HP gained',
                onFailure: 'Full HP reduction and temporary HP gained'
              }
            },

            tags: ['weaken', 'category', 'drain', 'debuff', 'healing', 'plaguebringer'],
            flavorText: 'Your vitality becomes mine. Your strength fades.'
          }
,          {
            id: 'pb_hallucinogenic_spores',
            name: 'Hallucinogenic Spores',
            description: 'Releases hallucinogenic spores targeting a single enemy in melee range. The affected target hallucinates, seeing allies as foes, and must make an attack against an ally on their next turn. Advances Torment-path afflictions.',
            spellType: 'ACTION',
            icon: 'inv_misc_herb_felblossom',
            school: 'Enchantment',
            level: 2,

            typeConfig: {
              castTime: 1,
              castTimeType: 'IMMEDIATE'
            },

            targetingConfig: {
              targetingType: 'single',
              rangeType: 'melee',
              rangeDistance: 5
            },

            durationConfig: {
              durationType: 'timed',
              duration: 2,
              durationUnit: 'rounds'
            },

            resourceCost: {
              mana: 6,
              components: ['verbal', 'somatic', 'material'],
              verbalText: 'Sporas Dementiae!',
              somaticText: 'Release spores from hand',
              materialText: 'Fungal spores'
            },

            savingThrow: {
              enabled: true,
              attribute: 'spirit',
              difficulty: 12,
              onSuccess: 'disoriented_only',
              onFailure: 'full_effect'
            },

            resolution: 'AUTOMATIC',

            controlConfig: {
              controlType: 'mind_control',
              duration: 2,
              durationUnit: 'rounds',
              saveDC: 12,
              saveType: 'spirit',
              savingThrow: true,
              effects: [{
                id: 'confused',
                name: 'Confused',
                description: 'Target attacks nearest ally on next turn',
                statusType: 'confused',
                level: 'moderate'
              }]
            },

            specialMechanics: {
              afflictionAdvancement: {
                enabled: true,
                category: 'Torment',
                description: 'Advances any afflictions on the target that require Torment category'
              },
              savingThrowEffect: {
                onSuccess: 'Target is disoriented but does not attack allies',
                onFailure: 'Target must attack nearest ally on next turn'
              }
            },

            tags: ['torment', 'category', 'psychic', 'confusion', 'plaguebringer', 'torment-weaver'],
            flavorText: 'Friend becomes foe. Reality fractures. Madness blooms.'
          },

          {
            id: 'pb_agonizing_wail',
            name: 'Agonizing Wail',
            description: 'An excruciating wail targets a single enemy within 25 ft, dealing psychic damage and paralyzing with fear, causing them to lose their next action. Advances Torment-path afflictions.',
            spellType: 'ACTION',
            icon: 'spell_shadow_deathscream',
            school: 'Necromancy',
            level: 3,

            typeConfig: {
              castTime: 1,
              castTimeType: 'IMMEDIATE'
            },

            targetingConfig: {
              targetingType: 'single',
              rangeType: 'ranged',
              rangeDistance: 25
            },

            durationConfig: {
              durationType: 'instant'
            },

            resourceCost: {
              mana: 8,
              components: ['verbal'],
              verbalText: 'ULULATUS DOLORIS!'
            },

            savingThrow: {
              enabled: true,
              attribute: 'spirit',
              difficulty: 16,
              onSuccess: 'half_damage_no_paralyze',
              onFailure: 'full_damage_and_paralyze'
            },

            damageConfig: {
              formula: '2d4 + intelligence',
              elementType: 'psychic',
              damageType: 'direct',
              attackType: 'spell_save',
              savingThrowConfig: {
                enabled: true,
                savingThrowType: 'spirit',
                difficultyClass: 16,
                saveOutcome: 'halves',
                partialEffect: true,
                partialEffectFormula: 'damage/2'
              }
            },

            controlConfig: {
              controlType: 'incapacitation',
              duration: 1,
              durationUnit: 'rounds',
              saveDC: 16,
              saveType: 'spirit',
              savingThrow: true,
              effects: [{
                id: 'paralyzed_fear',
                name: 'Paralyzed by Fear',
                description: 'Paralyzed with fear, loses next action',
                statusType: 'paralyzed',
                level: 'severe'
              }]
            },

            specialMechanics: {
              afflictionAdvancement: {
                enabled: true,
                category: 'Torment',
                description: 'Advances any afflictions on the target that require Torment category'
              },
              savingThrowEffect: {
                onSuccess: 'Half damage, not paralyzed',
                onFailure: 'Full damage and paralyzed for 1 round'
              }
            },

            tags: ['torment', 'category', 'psychic', 'paralyze', 'plaguebringer', 'torment-weaver'],
            flavorText: 'The wail of the damned. Terror incarnate. Movement ceases.'
          }
,          {
            id: 'pb_infectious_sores',
            name: 'Infectious Sores',
            description: 'Infects a single target in melee range with open sores that burst if they move, spreading the infection to anyone within 5 ft, dealing necrotic damage. Advances Fester-path afflictions.',
            spellType: 'ACTION',
            icon: 'spell_shadow_contagion',
            school: 'Necromancy',
            level: 2,

            typeConfig: {
              castTime: 1,
              castTimeType: 'IMMEDIATE'
            },

            targetingConfig: {
              targetingType: 'single',
              rangeType: 'melee',
              rangeDistance: 5
            },

            durationConfig: {
              durationType: 'until_cured'
            },

            resourceCost: {
              mana: 5,
              components: ['verbal', 'somatic'],
              verbalText: 'Ulcera Contagio!',
              somaticText: 'Touch target to inflict sores'
            },

            savingThrow: {
              enabled: true,
              attribute: 'constitution',
              difficulty: 14,
              onSuccess: 'no_spread',
              onFailure: 'full_effect'
            },

            damageConfig: {
              formula: '1d4 + intelligence',
              elementType: 'necrotic',
              damageType: 'direct',
              attackType: 'spell_save',
              hasDotEffect: true,
              dotConfig: {
                dotFormula: '1d4',
                duration: 4,
                tickFrequency: 'turn',
                isProgressiveDot: false
              },
              savingThrowConfig: {
                enabled: true,
                savingThrowType: 'constitution',
                difficultyClass: 14,
                saveOutcome: 'negates',
                partialEffect: false
              }
            },

            specialMechanics: {
              afflictionAdvancement: {
                enabled: true,
                category: 'Fester',
                description: 'Advances any afflictions on the target that require Fester category'
              },
              spreadMechanic: {
                trigger: 'target_movement',
                range: 5,
                damage: '1d4 necrotic per turn for 4 turns',
                savingThrowEffect: {
                  onSuccess: 'Sores cause 1d4 damage but do not spread',
                  onFailure: 'Sores spread to all within 5 ft when target moves'
                }
              }
            },

            tags: ['fester', 'category', 'necrotic', 'contagion', 'plaguebringer', 'virulent-spreader'],
            flavorText: 'The sores weep. The infection spreads. None are safe.'
          },

          {
            id: 'pb_plague_of_flies',
            name: 'Plague of Flies',
            description: 'Summons a swarm of flies around a single target, causing distraction and poison damage per turn, and reducing their sight range. Advances Fester-path afflictions.',
            spellType: 'ACTION',
            icon: 'inv_misc_monsterspidercarapace_01',
            school: 'Conjuration',
            level: 2,

            typeConfig: {
              castTime: 1,
              castTimeType: 'IMMEDIATE'
            },

            targetingConfig: {
              targetingType: 'single',
              rangeType: 'ranged',
              rangeDistance: 30
            },

            durationConfig: {
              durationType: 'timed',
              duration: 5,
              durationUnit: 'rounds'
            },

            resourceCost: {
              mana: 7,
              components: ['verbal', 'somatic'],
              verbalText: 'Musca Pestis!',
              somaticText: 'Summon flies with sweeping gesture'
            },

            resolution: 'AUTOMATIC',

            damageConfig: {
              formula: '1d4 + intelligence',
              elementType: 'poison',
              damageType: 'direct',
              attackType: 'automatic',
              hasDotEffect: true,
              dotConfig: {
                dotFormula: '1d4',
                duration: 5,
                tickFrequency: 'turn',
                isProgressiveDot: false
              }
            },

            debuffConfig: {
              debuffType: 'statReduction',
              effects: [{
                id: 'swarm_vision_reduction',
                name: 'Swarm Vision Reduction',
                description: 'Sight range reduced',
                statModifier: {
                  stat: 'sight_range',
                  magnitude: '1d20',
                  magnitudeType: 'formula'
                }
              }],
              durationValue: 5,
              durationType: 'rounds',
              durationUnit: 'rounds',
              canBeDispelled: true
            },

            specialMechanics: {
              afflictionAdvancement: {
                enabled: true,
                category: 'Fester',
                description: 'Advances any afflictions on the target that require Fester category'
              }
            },

            tags: ['fester', 'category', 'poison', 'debuff', 'plaguebringer', 'virulent-spreader'],
            flavorText: 'The swarm descends. Vision fails. Decay festers.'
          }
,          {
            id: 'pb_sufferings_echo',
            name: "Suffering's Echo",
            description: 'Intensifies the pain of a single afflicted target within 30 ft, doubling the damage of existing conditions and forcing a scream of agony that disorients them for 1 turn. Advances Amplify Pain-path afflictions.',
            spellType: 'ACTION',
            icon: 'spell_shadow_painspike',
            school: 'Necromancy',
            level: 3,

            typeConfig: {
              castTime: 1,
              castTimeType: 'IMMEDIATE'
            },

            targetingConfig: {
              targetingType: 'single',
              rangeType: 'ranged',
              rangeDistance: 30,
              requiresAffliction: true
            },

            durationConfig: {
              durationType: 'instant'
            },

            resourceCost: {
              mana: 9,
              components: ['verbal', 'somatic'],
              verbalText: 'Dolor Duplicatus!',
              somaticText: 'Clench fist to amplify pain'
            },

            savingThrow: {
              enabled: true,
              attribute: 'constitution',
              difficulty: 16,
              onSuccess: 'half_amplification',
              onFailure: 'full_amplification'
            },

            resolution: 'AUTOMATIC',

            debuffConfig: {
              debuffType: 'statReduction',
              effects: [{
                id: 'amplified_pain',
                name: 'Amplified Pain',
                description: 'Doubles damage of all existing afflictions and causes disorientation',
                statModifier: {
                  stat: 'attack_rolls',
                  magnitude: 1,
                  magnitudeType: 'disadvantage'
                }
              }],
              durationValue: 1,
              durationType: 'rounds',
              durationUnit: 'rounds',
              saveDC: 16,
              saveType: 'constitution',
              saveOutcome: 'halves',
              canBeDispelled: true
            },

            specialMechanics: {
              afflictionAdvancement: {
                enabled: true,
                category: 'Amplify Pain',
                description: 'Advances any afflictions on the target that require Amplify Pain category'
              },
              savingThrowEffect: {
                onSuccess: 'Damage increased by 1d6 instead of doubled',
                onFailure: 'Damage doubled and target disoriented'
              },
              requiresAffliction: {
                enabled: true,
                description: 'Target must have at least one active affliction'
              }
            },

            tags: ['amplify-pain', 'category', 'amplification', 'plaguebringer'],
            flavorText: 'Pain echoes. Suffering multiplies. Agony intensifies.'
          },

          {
            id: 'pb_pain_magnification',
            name: 'Pain Magnification',
            description: 'Focuses pain on a single enemy, tripling the damage of any pain-related effects for their next turn. Advances Amplify Pain-path afflictions.',
            spellType: 'ACTION',
            icon: 'spell_shadow_shadowwordpain',
            school: 'Necromancy',
            level: 4,

            typeConfig: {
              castTime: 1,
              castTimeType: 'IMMEDIATE'
            },

            targetingConfig: {
              targetingType: 'single',
              rangeType: 'ranged',
              rangeDistance: 30,
              requiresAffliction: true
            },

            durationConfig: {
              durationType: 'timed',
              duration: 1,
              durationUnit: 'rounds'
            },

            resourceCost: {
              mana: 10,
              components: ['verbal', 'somatic'],
              verbalText: 'Dolor Triplicatus!',
              somaticText: 'Focus energy on target'
            },

            savingThrow: {
              enabled: true,
              attribute: 'constitution',
              difficulty: 16,
              onSuccess: 'double_instead',
              onFailure: 'triple'
            },

            resolution: 'AUTOMATIC',

            debuffConfig: {
              debuffType: 'statReduction',
              effects: [{
                id: 'triple_pain',
                name: 'Triple Pain',
                description: 'Triples damage of all pain-related effects',
                statModifier: {
                  stat: 'affliction_damage',
                  magnitude: 3,
                  magnitudeType: 'multiplier'
                }
              }],
              durationValue: 1,
              durationType: 'rounds',
              durationUnit: 'rounds',
              saveDC: 16,
              saveType: 'constitution',
              saveOutcome: 'halves',
              canBeDispelled: true
            },

            specialMechanics: {
              afflictionAdvancement: {
                enabled: true,
                category: 'Amplify Pain',
                description: 'Advances any afflictions on the target that require Amplify Pain category'
              },
              savingThrowEffect: {
                onSuccess: 'Damage doubled instead of tripled',
                onFailure: 'Damage tripled for next turn'
              },
              requiresAffliction: {
                enabled: true,
                description: 'Target must have at least one active pain-related affliction'
              }
            },

            tags: ['amplify-pain', 'category', 'amplification', 'plaguebringer'],
            flavorText: 'Pain magnified beyond endurance. Suffering absolute.'
          }
,          {
            id: 'pb_necrotic_burst',
            name: 'Necrotic Burst',
            description: 'A burst of necrotic energy on a single target within 10 ft causes necrotic damage and permanently reduces their max HP. Advances Decay-path afflictions.',
            spellType: 'ACTION',
            icon: 'spell_shadow_deathanddecay',
            school: 'Necromancy',
            level: 3,

            typeConfig: {
              castTime: 1,
              castTimeType: 'IMMEDIATE'
            },

            targetingConfig: {
              targetingType: 'single',
              rangeType: 'ranged',
              rangeDistance: 10
            },

            durationConfig: {
              durationType: 'instant'
            },

            resourceCost: {
              mana: 10,
              components: ['verbal', 'somatic'],
              verbalText: 'Necrosis Eruptio!',
              somaticText: 'Release burst of necrotic energy'
            },

            savingThrow: {
              enabled: true,
              attribute: 'constitution',
              difficulty: 17,
              onSuccess: 'reduced_effect',
              onFailure: 'full_effect'
            },

            damageConfig: {
              formula: '3d6 + intelligence',
              elementType: 'necrotic',
              damageType: 'direct',
              attackType: 'spell_save',
              savingThrowConfig: {
                enabled: true,
                savingThrowType: 'constitution',
                difficultyClass: 17,
                saveOutcome: 'halves',
                partialEffect: true,
                partialEffectFormula: 'damage/2'
              },
              criticalConfig: {
                critType: 'effect',
                critEffects: ['permanent_decay']
              }
            },

            debuffConfig: {
              debuffType: 'statReduction',
              effects: [{
                id: 'permanent_decay',
                name: 'Permanent Decay',
                description: 'Permanently reduces max HP',
                statModifier: {
                  stat: 'max_hp',
                  magnitude: '2d10',
                  magnitudeType: 'formula',
                  permanent: true
                }
              }],
              durationValue: 0,
              durationType: 'permanent',
              durationUnit: 'permanent',
              canBeDispelled: false
            },

            specialMechanics: {
              afflictionAdvancement: {
                enabled: true,
                category: 'Decay',
                description: 'Advances any afflictions on the target that require Decay category'
              },
              savingThrowEffect: {
                onSuccess: 'Damage is 2d6 and max HP reduction is 1d10',
                onFailure: 'Full damage and 2d10 max HP reduction'
              }
            },

            tags: ['decay', 'category', 'necrotic', 'permanent', 'plaguebringer', 'decay-harbinger'],
            flavorText: 'Flesh rots. Life force diminishes. Decay is permanent.'
          },

          {
            id: 'pb_wither_touch',
            name: 'Wither Touch',
            description: 'A touch attack that withers a single enemy, dealing 4d4 necrotic damage and reducing their healing received by 1d8 per heal for 5 turns. Advances Decay-path afflictions.',
            spellType: 'ACTION',
            icon: 'spell_shadow_soulleech',
            school: 'Necromancy',
            level: 3,

            typeConfig: {
              castTime: 1,
              castTimeType: 'IMMEDIATE'
            },

            targetingConfig: {
              targetingType: 'single',
              rangeType: 'melee',
              rangeDistance: 5
            },

            durationConfig: {
              durationType: 'instant'
            },

            resourceCost: {
              mana: 9,
              components: ['verbal', 'somatic'],
              verbalText: 'Tactus Marcescens!',
              somaticText: 'Touch target with withering hand'
            },

            savingThrow: {
              enabled: true,
              attribute: 'constitution',
              difficulty: 16,
              onSuccess: 'reduced_effect',
              onFailure: 'full_effect'
            },

            damageConfig: {
              formula: '4d4 + intelligence',
              elementType: 'necrotic',
              damageType: 'direct',
              attackType: 'spell_save'
            },

            effects: {
              damage: {
                instant: {
                  amount: '4d4 + INT',
                  type: 'necrotic',
                  description: 'Immediate necrotic damage'
                }
              },
              debuff: {
                healingReduction: '1d8',
                duration: '5 rounds',
                description: 'Healing received is reduced by 1d8 per heal'
              }
            },

            specialMechanics: {
              afflictionAdvancement: {
                enabled: true,
                category: 'Decay',
                description: 'Advances any afflictions on the target that require Decay category'
              },
              savingThrowEffect: {
                onSuccess: 'Damage halved and healing reduction lasts 2 rounds',
                onFailure: 'Full damage and healing reduction lasts 5 rounds'
              }
            },

            tags: ['decay', 'category', 'necrotic', 'anti-healing', 'plaguebringer', 'decay-harbinger'],
            flavorText: 'The touch of death. Healing fails. Withering spreads.'
          }
,          {
            id: 'pb_dark_rejuvenation',
            name: 'Dark Rejuvenation',
            description: 'Converts any healing on a single target within 20 ft into necrotic damage equal to the amount healed. Advances Nurture-path afflictions.',
            spellType: 'ACTION',
            icon: 'spell_shadow_darkritual',
            school: 'Necromancy',
            level: 3,

            typeConfig: {
              castTime: 1,
              castTimeType: 'IMMEDIATE'
            },

            targetingConfig: {
              targetingType: 'single',
              rangeType: 'ranged',
              rangeDistance: 20
            },

            durationConfig: {
              durationType: 'timed',
              duration: 3,
              durationUnit: 'rounds'
            },

            resourceCost: {
              mana: 8,
              components: ['verbal', 'somatic'],
              verbalText: 'Sanatio Inversa!',
              somaticText: 'Twist healing energy into harm'
            },

            savingThrow: {
              enabled: true,
              attribute: 'spirit',
              difficulty: 15,
              onSuccess: 'reduced_effect',
              onFailure: 'full_effect'
            },

            resolution: 'AUTOMATIC',

            effects: {
              curse: {
                type: 'healing_inversion',
                duration: '3 rounds',
                description: 'All healing becomes necrotic damage'
              }
            },

            specialMechanics: {
              afflictionAdvancement: {
                enabled: true,
                category: 'Nurture',
                description: 'Advances any afflictions on the target that require Nurture category'
              },
              healingInversion: {
                conversion: 'full',
                damageType: 'necrotic',
                description: 'All healing received becomes necrotic damage instead'
              },
              savingThrowEffect: {
                onSuccess: 'Healing is reduced by 1d8 instead of converted',
                onFailure: 'All healing becomes necrotic damage for 3 rounds'
              }
            },

            tags: ['nurture', 'category', 'curse', 'anti-healing', 'plaguebringer', 'decay-harbinger'],
            flavorText: 'Healing becomes harm. Life becomes death. Nurture becomes nightmare.'
          },

          {
            id: 'pb_plagues_embrace',
            name: "Plague's Embrace",
            description: 'Grants a single ally within 10 ft an aura that reflects 1d10 necrotic damage back to attackers. Advances Nurture-path afflictions on enemies who attack the ally.',
            spellType: 'ACTION',
            icon: 'spell_shadow_plaguecloud',
            school: 'Necromancy',
            level: 2,

            typeConfig: {
              castTime: 1,
              castTimeType: 'IMMEDIATE'
            },

            targetingConfig: {
              targetingType: 'single',
              rangeType: 'ranged',
              rangeDistance: 10,
              validTargets: 'ally'
            },

            durationConfig: {
              durationType: 'timed',
              duration: 3,
              durationUnit: 'rounds'
            },

            resourceCost: {
              mana: 7,
              components: ['verbal', 'somatic'],
              verbalText: 'Amplexus Pestis!',
              somaticText: 'Wrap ally in plague aura'
            },

            resolution: 'AUTOMATIC',

            effects: {
              buff: {
                type: 'damage_reflection',
                amount: '1d10',
                damageType: 'necrotic',
                duration: '3 rounds',
                description: 'Reflects 1d10 necrotic damage to attackers'
              }
            },

            specialMechanics: {
              afflictionAdvancement: {
                enabled: true,
                category: 'Nurture',
                description: 'Advances any afflictions on enemies who attack the buffed ally'
              },
              damageReflection: {
                amount: '1d10',
                damageType: 'necrotic',
                description: 'Attackers take 1d10 necrotic damage when they attack the buffed ally'
              }
            },

            tags: ['nurture', 'category', 'buff', 'reflection', 'plaguebringer'],
            flavorText: 'The plague protects. Attackers suffer. Allies endure.'
          }
,          {
            id: 'pb_essence_corruption',
            name: 'Essence Corruption',
            description: 'Corrupts a single target within 15 ft, causing them to emit a 1d10 necrotic damage aura to their allies at the start of their turn. Advances Corrupt-path afflictions.',
            spellType: 'ACTION',
            icon: 'spell_shadow_shadesofdarkness',
            school: 'Necromancy',
            level: 3,

            typeConfig: {
              castTime: 1,
              castTimeType: 'IMMEDIATE'
            },

            targetingConfig: {
              targetingType: 'single',
              rangeType: 'ranged',
              rangeDistance: 15
            },

            durationConfig: {
              durationType: 'timed',
              duration: 3,
              durationUnit: 'rounds'
            },

            resourceCost: {
              mana: 8,
              components: ['verbal', 'somatic'],
              verbalText: 'Essentia Corruptio!',
              somaticText: 'Corrupt target\'s essence'
            },

            savingThrow: {
              enabled: true,
              attribute: 'spirit',
              difficulty: 15,
              onSuccess: 'reduced_aura',
              onFailure: 'full_aura'
            },

            damageConfig: {
              formula: '1d10 + intelligence',
              elementType: 'necrotic',
              damageType: 'direct',
              attackType: 'automatic'
            },

            effects: {
              aura: {
                damage: '1d10',
                damageType: 'necrotic',
                radius: 10,
                targets: 'allies_of_target',
                duration: '3 rounds',
                description: 'Target emits harmful aura to their allies'
              }
            },

            specialMechanics: {
              afflictionAdvancement: {
                enabled: true,
                category: 'Corrupt',
                description: 'Advances any afflictions on the target that require Corrupt category'
              },
              savingThrowEffect: {
                onSuccess: 'Aura deals 1d4 damage',
                onFailure: 'Aura deals 1d10 damage'
              }
            },

            tags: ['corrupt', 'category', 'aura', 'necrotic', 'plaguebringer'],
            flavorText: 'Ally becomes enemy. Friend becomes foe. Corruption spreads.'
          },

          {
            id: 'pb_perverse_infusion',
            name: 'Perverse Infusion',
            description: "Converts an enemy's highest ability score bonus into a penalty of the same value. Advances Corrupt-path afflictions.",
            spellType: 'ACTION',
            icon: 'spell_shadow_twistedfaith',
            school: 'Necromancy',
            level: 4,

            typeConfig: {
              castTime: 1,
              castTimeType: 'IMMEDIATE'
            },

            targetingConfig: {
              targetingType: 'single',
              rangeType: 'ranged',
              rangeDistance: 30
            },

            durationConfig: {
              durationType: 'timed',
              duration: 1,
              durationUnit: 'minutes'
            },

            resourceCost: {
              mana: 9,
              components: ['verbal', 'somatic'],
              verbalText: 'Virtus Inversa!',
              somaticText: 'Invert target\'s strengths'
            },

            savingThrow: {
              enabled: true,
              attribute: 'spirit',
              difficulty: 16,
              onSuccess: 'half_penalty',
              onFailure: 'full_penalty'
            },

            resolution: 'AUTOMATIC',

            effects: {
              debuff: {
                type: 'stat_inversion',
                duration: '1 minute',
                description: 'Highest ability score bonus becomes penalty'
              }
            },

            specialMechanics: {
              afflictionAdvancement: {
                enabled: true,
                category: 'Corrupt',
                description: 'Advances any afflictions on the target that require Corrupt category'
              },
              statInversion: {
                target: 'highest_ability_score',
                effect: 'bonus_becomes_penalty',
                example: '+5 STR becomes -5 STR'
              },
              savingThrowEffect: {
                onSuccess: 'Penalty is half the value of the bonus',
                onFailure: 'Full bonus becomes full penalty'
              }
            },

            tags: ['corrupt', 'category', 'debuff', 'stat-inversion', 'plaguebringer'],
            flavorText: 'Strength becomes weakness. Power becomes frailty. Corruption complete.'
          }
,          {
            id: 'pb_virulent_touch',
            name: 'Virulent Touch',
            description: 'Causes a virulent reaction in a single target in melee range. Your touch spreads a terrible plague that infects the target and those nearby. The disease spreads rapidly, causing ongoing suffering and advancing existing infections to more severe stages.',
            spellType: 'ACTION',
            icon: 'ability_creature_disease_01',
            school: 'Necromancy',
            level: 4,

            typeConfig: {
              castTime: 1,
              castTimeType: 'IMMEDIATE'
            },

            targetingConfig: {
              targetingType: 'single',
              rangeType: 'melee',
              rangeDistance: 5
            },

            durationConfig: {
              durationType: 'instant'
            },

            resourceCost: {
              mana: 11,
              components: ['verbal', 'somatic'],
              verbalText: 'Tactus Virulentus!',
              somaticText: 'Touch target to spread virulent plague'
            },

            savingThrow: {
              enabled: true,
              attribute: 'constitution',
              difficulty: 17,
              onSuccess: 'reduced_effect',
              onFailure: 'full_effect'
            },

            damageConfig: {
              formula: '4d6 + intelligence',
              elementType: 'poison',
              damageType: 'direct',
              attackType: 'spell_save'
            },

            effects: {
              damage: {
                instant: {
                  amount: '4d6 + INT',
                  type: 'poison',
                  description: 'Immediate poison damage to primary target'
                }
              },
              contagion: {
                spreadRange: 5,
                spreadDamage: '1d4',
                spreadDuration: '4 rounds',
                description: 'Infects all within 5 ft with plague'
              }
            },

            specialMechanics: {
              afflictionAdvancement: {
                enabled: true,
                category: 'Infect',
                description: 'Advances any afflictions on the target that require Infect category'
              },
              spreadMechanic: {
                range: 5,
                damage: '1d4 poison per turn for 4 turns',
                targets: 'all_within_range'
              },
              savingThrowEffect: {
                onSuccess: 'Damage is 2d6 and infection is minor',
                onFailure: 'Full damage and full infection spread'
              }
            },

            tags: ['infect', 'category', 'poison', 'contagion', 'plaguebringer', 'virulent-spreader'],
            flavorText: 'One touch. Many infected. The plague spreads.'
          },

          {
            id: 'pb_contagion_burst',
            name: 'Contagion Burst',
            description: 'Creates a burst on a single target in melee range, initially dealing 2d6 poison damage and increasing by 1d6 for each subsequent Contagion Burst. Advances Infect-path afflictions.',
            spellType: 'ACTION',
            icon: 'spell_nature_corrosivebreath',
            school: 'Necromancy',
            level: 3,

            typeConfig: {
              castTime: 1,
              castTimeType: 'IMMEDIATE'
            },

            targetingConfig: {
              targetingType: 'single',
              rangeType: 'melee',
              rangeDistance: 5
            },

            durationConfig: {
              durationType: 'instant'
            },

            resourceCost: {
              mana: 10,
              components: ['verbal', 'somatic'],
              verbalText: 'Contagio Eruptio!',
              somaticText: 'Release contagion burst'
            },

            savingThrow: {
              enabled: true,
              attribute: 'constitution',
              difficulty: 16,
              onSuccess: 'reduced_damage',
              onFailure: 'full_damage'
            },

            damageConfig: {
              formula: '2d6',
              elementType: 'poison',
              damageType: 'direct',
              damageType: 'poison',
              attackType: 'spell_save'
            },

            effects: {
              damage: {
                instant: {
                  amount: '2d6 + INT',
                  type: 'poison',
                  description: 'Initial poison damage'
                }
              },
              stacking: {
                increment: '1d6',
                description: 'Each subsequent cast increases damage by 1d6'
              }
            },

            specialMechanics: {
              afflictionAdvancement: {
                enabled: true,
                category: 'Infect',
                description: 'Advances any afflictions on the target that require Infect category'
              },
              stackingDamage: {
                initial: '2d6',
                increment: '1d6',
                description: 'Damage increases with each cast on same target',
                example: '1st cast: 2d6, 2nd cast: 3d6, 3rd cast: 4d6, etc.'
              },
              savingThrowEffect: {
                onSuccess: 'Initial damage is 1d6 and effect spread is reduced',
                onFailure: 'Full damage and stacking effect applies'
              }
            },

            tags: ['infect', 'category', 'poison', 'stacking', 'plaguebringer', 'virulent-spreader'],
            flavorText: 'The contagion builds. Each burst stronger. Infection inevitable.'
          },

          // ADDITIONAL LEVEL 1 SPELLS
          {
            id: 'pb_affliction_mark',
            name: 'Affliction Mark',
            description: 'Mark a target with a visible affliction symbol, making them vulnerable to plague effects and reducing their Spirit by 2 for 3 rounds.',
            level: 1,
            spellType: 'ACTION',
            effectTypes: ['debuff'],

            typeConfig: {
              school: 'necromancy',
              icon: 'spell_shadow_chilltouch',
              tags: ['debuff', 'mark', 'universal'],
              castTime: 1,
              castTimeType: 'IMMEDIATE'
            },

            targetingConfig: {
              targetingType: 'single',
              rangeType: 'ranged',
              rangeDistance: 30,
              targetRestrictions: ['enemy'],
              maxTargets: 1
            },

            debuffConfig: {
              debuffType: 'statReduction',
              effects: [{
                id: 'affliction_mark',
                name: 'Affliction Mark',
                description: 'Marked target has -2 Spirit and is vulnerable to plague effects for 3 rounds',
                statusType: 'marked',
                statModifier: {
                  stat: 'spirit',
                  magnitude: -2,
                  magnitudeType: 'flat'
                }
              }],
              durationValue: 3,
              durationType: 'rounds',
              durationUnit: 'rounds',
              saveDC: 12,
              saveType: 'spirit',
              saveOutcome: 'negates'
            },

            resourceCost: {
              resourceTypes: ['mana'],
              resourceValues: {
                mana: 10
              },
              actionPoints: 1,
              components: ['verbal', 'somatic']
            },

            cooldownConfig: {
              type: 'turn_based',
              value: 0
            },

            resolution: 'DICE',
            tags: ['debuff', 'mark', 'universal']
          },

          {
            id: 'pb_minor_plague',
            name: 'Minor Plague',
            description: 'Inflict a minor plague on a target, dealing 1d6 poison damage immediately and 1d4 each round for 2 rounds.',
            level: 1,
            spellType: 'ACTION',
            effectTypes: ['damage'],

            typeConfig: {
              school: 'necromancy',
              icon: 'spell_shadow_plaguecloud',
              tags: ['damage', 'poison', 'dot', 'universal'],
              castTime: 1,
              castTimeType: 'IMMEDIATE'
            },

            targetingConfig: {
              targetingType: 'single',
              rangeType: 'ranged',
              rangeDistance: 30,
              targetRestrictions: ['enemy'],
              maxTargets: 1
            },

            damageConfig: {
              formula: '1d6',
              elementType: 'poison',
              damageType: 'direct'
            },

            resourceCost: {
              resourceTypes: ['mana'],
              resourceValues: {
                mana: 10
              },
              actionPoints: 1,
              components: ['verbal', 'somatic']
            },

            cooldownConfig: {
              type: 'turn_based',
              value: 0
            },

            resolution: 'DICE',
            tags: ['damage', 'poison', 'dot', 'universal']
          },

          {
            id: 'pb_weakening_touch',
            name: 'Weakening Touch',
            description: 'A touch attack that weakens the target, reducing their Strength and Constitution by 1 for 3 rounds and dealing 1d4 necrotic damage.',
            level: 1,
            spellType: 'ACTION',
            effectTypes: ['debuff', 'damage'],

            typeConfig: {
              school: 'necromancy',
              icon: 'spell_shadow_curseofachimonde',
              tags: ['debuff', 'weaken', 'necrotic', 'universal'],
              castTime: 1,
              castTimeType: 'IMMEDIATE'
            },

            targetingConfig: {
              targetingType: 'single',
              rangeType: 'touch',
              rangeDistance: 5,
              targetRestrictions: ['enemy'],
              maxTargets: 1
            },

            damageConfig: {
              formula: '1d4',
              elementType: 'necrotic',
              damageType: 'direct'
            },

            debuffConfig: {
              debuffType: 'statReduction',
              effects: [{
                id: 'weakening_touch',
                name: 'Weakened',
                description: 'Target has -1 Strength and -1 Constitution for 3 rounds',
                statusType: 'weakened',
                statModifier: {
                  stat: 'strength',
                  magnitude: -1,
                  magnitudeType: 'flat'
                }
              }],
              durationValue: 3,
              durationType: 'rounds',
              durationUnit: 'rounds',
              saveDC: 12,
              saveType: 'constitution',
              saveOutcome: 'negates'
            },

            resourceCost: {
              resourceTypes: ['mana'],
              resourceValues: {
                mana: 10
              },
              actionPoints: 1,
              components: ['verbal', 'somatic']
            },

            cooldownConfig: {
              type: 'turn_based',
              value: 0
            },

            resolution: 'DICE',
            tags: ['debuff', 'weaken', 'necrotic', 'universal']
          },

          // LEVEL 5 SPELLS
          {
            id: 'pb_plague_burst',
            name: 'Plague Burst',
            description: 'Detonate all afflictions on a target, dealing 5d8 poison damage plus bonus damage based on affliction stacks.',
            level: 5,
            spellType: 'ACTION',
            effectTypes: ['damage'],

            typeConfig: {
              school: 'necromancy',
              icon: 'spell_shadow_plaguecloud',
              tags: ['damage', 'poison', 'burst', 'virulent-spreader'],
              castTime: 1,
              castTimeType: 'IMMEDIATE'
            },

            targetingConfig: {
              targetingType: 'single',
              rangeType: 'ranged',
              rangeDistance: 40,
              targetRestrictions: ['enemy'],
              maxTargets: 1
            },

            damageConfig: {
              formula: '5d8',
              elementType: 'poison',
              damageType: 'direct',
              savingThrowConfig: {
                enabled: true,
                savingThrowType: 'constitution',
                difficultyClass: 16,
                saveOutcome: 'halves',
                partialEffect: true,
                partialEffectFormula: 'damage/2'
              }
            },

            resourceCost: {
              resourceTypes: ['mana'],
              resourceValues: {
                mana: 25
              },
              actionPoints: 2,
              components: ['verbal', 'somatic']
            },

            cooldownConfig: {
              type: 'turn_based',
              value: 3
            },

            resolution: 'DICE',
            tags: ['damage', 'poison', 'burst', 'virulent-spreader']
          },

          {
            id: 'pb_mass_affliction',
            name: 'Mass Affliction',
            description: 'Apply a basic affliction to all enemies in a 20 foot radius, dealing 3d6 poison damage and starting affliction cultivation.',
            level: 5,
            spellType: 'ACTION',
            effectTypes: ['damage', 'debuff'],

            typeConfig: {
              school: 'necromancy',
              icon: 'spell_shadow_contagion',
              tags: ['damage', 'poison', 'aoe', 'affliction', 'universal'],
              castTime: 1,
              castTimeType: 'IMMEDIATE'
            },

            targetingConfig: {
              targetingType: 'area',
              rangeType: 'ranged',
              rangeDistance: 40,
              aoeShape: 'circle',
              aoeParameters: { radius: 20 },
              targetRestrictions: ['enemy']
            },

            damageConfig: {
              formula: '3d6',
              elementType: 'poison',
              damageType: 'area'
            },

            debuffConfig: {
              debuffType: 'statusEffect',
              effects: [{
                id: 'mass_affliction',
                name: 'Base Affliction',
                description: 'All targets afflicted with base plague for cultivation - takes 1d4 poison damage per round for 4 rounds',
                statusType: 'afflicted'
              }],
              durationValue: 4,
              durationType: 'rounds',
              durationUnit: 'rounds',
              saveDC: 16,
              saveType: 'constitution',
              saveOutcome: 'halves'
            },

            resourceCost: {
              resourceTypes: ['mana'],
              resourceValues: {
                mana: 30
              },
              actionPoints: 2,
              components: ['verbal', 'somatic']
            },

            cooldownConfig: {
              type: 'turn_based',
              value: 4
            },

            resolution: 'DICE',
            tags: ['damage', 'poison', 'aoe', 'affliction', 'universal']
          },

          {
            id: 'pb_torment_cascade',
            name: 'Torment Cascade',
            description: 'Create a cascading wave of psychic torment that chains between enemies, dealing 4d8 psychic damage to each.',
            level: 5,
            spellType: 'ACTION',
            effectTypes: ['damage'],

            typeConfig: {
              school: 'necromancy',
              icon: 'spell_shadow_painspike',
              tags: ['damage', 'psychic', 'chain', 'torment-weaver'],
              castTime: 1,
              castTimeType: 'IMMEDIATE'
            },

            targetingConfig: {
              targetingType: 'chain',
              rangeType: 'ranged',
              rangeDistance: 40,
              targetRestrictions: ['enemy'],
              maxTargets: 4,
              chainDistance: 15
            },

            damageConfig: {
              formula: '4d8',
              elementType: 'psychic',
              damageType: 'direct'
            },

            resourceCost: {
              resourceTypes: ['mana'],
              resourceValues: {
                mana: 28
              },
              actionPoints: 2,
              components: ['verbal', 'somatic']
            },

            cooldownConfig: {
              type: 'turn_based',
              value: 3
            },

            resolution: 'DICE',
            tags: ['damage', 'psychic', 'chain', 'torment-weaver']
          },

          // LEVEL 6 SPELLS
          {
            id: 'pb_plague_storm',
            name: 'Plague Storm',
            description: 'Summon a storm of plague that deals 6d6 poison damage to all enemies in a massive area.',
            level: 6,
            spellType: 'ACTION',
            effectTypes: ['damage'],

            typeConfig: {
              school: 'necromancy',
              icon: 'spell_shadow_plaguecloud',
              tags: ['damage', 'poison', 'aoe', 'storm', 'virulent-spreader'],
              castTime: 1,
              castTimeType: 'IMMEDIATE'
            },

            targetingConfig: {
              targetingType: 'area',
              rangeType: 'ranged',
              rangeDistance: 50,
              aoeShape: 'circle',
              aoeParameters: { radius: 30 },
              targetRestrictions: ['enemy']
            },

            damageConfig: {
              formula: '6d6',
              elementType: 'poison',
              damageType: 'area',
              savingThrowConfig: {
                enabled: true,
                savingThrowType: 'constitution',
                difficultyClass: 17,
                saveOutcome: 'halves',
                partialEffect: true,
                partialEffectFormula: 'damage/2'
              }
            },

            resourceCost: {
              resourceTypes: ['mana'],
              resourceValues: {
                mana: 35
              },
              actionPoints: 2,
              components: ['verbal', 'somatic']
            },

            cooldownConfig: {
              type: 'turn_based',
              value: 5
            },

            resolution: 'DICE',
            tags: ['damage', 'poison', 'aoe', 'storm', 'virulent-spreader']
          },

          {
            id: 'pb_mental_anguish',
            name: 'Mental Anguish',
            description: 'Inflict severe mental anguish on a target, dealing 7d8 psychic damage and stunning them for 1 round.',
            level: 6,
            spellType: 'ACTION',
            effectTypes: ['damage', 'control'],

            typeConfig: {
              school: 'necromancy',
              icon: 'spell_shadow_shadowwordpain',
              tags: ['damage', 'psychic', 'control', 'stun', 'torment-weaver'],
              castTime: 1,
              castTimeType: 'IMMEDIATE'
            },

            targetingConfig: {
              targetingType: 'single',
              rangeType: 'ranged',
              rangeDistance: 40,
              targetRestrictions: ['enemy'],
              maxTargets: 1
            },

            damageConfig: {
              formula: '7d8',
              elementType: 'psychic',
              damageType: 'direct'
            },

            controlConfig: {
              controlType: 'incapacitation',
              duration: 1,
              durationUnit: 'rounds',
              saveDC: 17,
              saveType: 'spirit',
              savingThrow: true,
              effects: [{
                id: 'stunned',
                name: 'Stunned',
                description: 'Target is stunned from mental anguish - cannot act for 1 round',
                config: {
                  stunType: 'mental'
                }
              }]
            },

            resourceCost: {
              resourceTypes: ['mana'],
              resourceValues: {
                mana: 35
              },
              actionPoints: 2,
              components: ['verbal', 'somatic']
            },

            cooldownConfig: {
              type: 'turn_based',
              value: 4
            },

            resolution: 'DICE',
            tags: ['damage', 'psychic', 'control', 'stun', 'torment-weaver']
          },

          {
            id: 'pb_decay_field',
            name: 'Decay Field',
            description: 'Create a field of decay that persists for 4 rounds, dealing 3d8 necrotic damage per round to all enemies within.',
            level: 6,
            spellType: 'ZONE',
            effectTypes: ['damage'],

            typeConfig: {
              school: 'necromancy',
              icon: 'spell_shadow_deathanddecay',
              tags: ['damage', 'necrotic', 'zone', 'decay-harbinger'],
              castTime: 1,
              castTimeType: 'IMMEDIATE'
            },

            targetingConfig: {
              targetingType: 'ground',
              rangeType: 'ranged',
              rangeDistance: 40,
              aoeShape: 'circle',
              aoeParameters: { radius: 20 }
            },

            damageConfig: {
              formula: '3d8',
              elementType: 'necrotic',
              damageType: 'area'
            },

            zoneConfig: {
              duration: 4,
              durationUnit: 'rounds',
              damagePerTurn: '3d8',
              triggerCondition: 'start_of_turn'
            },

            resourceCost: {
              resourceTypes: ['mana'],
              resourceValues: {
                mana: 35
              },
              actionPoints: 2,
              components: ['verbal', 'somatic']
            },

            cooldownConfig: {
              type: 'turn_based',
              value: 5
            },

            resolution: 'DICE',
            tags: ['damage', 'necrotic', 'zone', 'decay-harbinger']
          },

          // LEVEL 7 SPELLS
          {
            id: 'pb_apocalyptic_plague',
            name: 'Apocalyptic Plague',
            description: 'Unleash an apocalyptic plague that spreads rapidly, dealing 7d10 poison damage to all enemies in sight.',
            level: 7,
            spellType: 'ACTION',
            effectTypes: ['damage'],

            typeConfig: {
              school: 'necromancy',
              icon: 'spell_shadow_contagion',
              tags: ['damage', 'poison', 'ultimate', 'mass', 'virulent-spreader'],
              castTime: 1,
              castTimeType: 'IMMEDIATE'
            },

            targetingConfig: {
              targetingType: 'area',
              rangeType: 'sight',
              rangeDistance: 60,
              aoeShape: 'circle',
              aoeParameters: { radius: 40 },
              targetRestrictions: ['enemy']
            },

            damageConfig: {
              formula: '7d10',
              elementType: 'poison',
              damageType: 'area',
              savingThrowConfig: {
                enabled: true,
                savingThrowType: 'constitution',
                difficultyClass: 18,
                saveOutcome: 'halves',
                partialEffect: true,
                partialEffectFormula: 'damage/2'
              }
            },

            resourceCost: {
              resourceTypes: ['mana'],
              resourceValues: {
                mana: 45
              },
              actionPoints: 2,
              components: ['verbal', 'somatic']
            },

            cooldownConfig: {
              type: 'turn_based',
              value: 8
            },

            resolution: 'DICE',
            tags: ['damage', 'poison', 'ultimate', 'mass', 'virulent-spreader']
          },

          {
            id: 'pb_mind_plague',
            name: 'Mind Plague',
            description: 'Infect the minds of all enemies in an area, dealing 8d8 psychic damage and causing confusion for 2 rounds.',
            level: 7,
            spellType: 'ACTION',
            effectTypes: ['damage', 'control'],

            typeConfig: {
              school: 'necromancy',
              icon: 'spell_shadow_mindsteal',
              tags: ['damage', 'psychic', 'control', 'confusion', 'torment-weaver'],
              castTime: 1,
              castTimeType: 'IMMEDIATE'
            },

            targetingConfig: {
              targetingType: 'area',
              rangeType: 'ranged',
              rangeDistance: 50,
              aoeShape: 'circle',
              aoeParameters: { radius: 25 },
              targetRestrictions: ['enemy']
            },

            damageConfig: {
              formula: '8d8',
              elementType: 'psychic',
              damageType: 'area'
            },

            controlConfig: {
              controlType: 'mind_control',
              duration: 2,
              durationUnit: 'rounds',
              saveDC: 18,
              saveType: 'spirit',
              savingThrow: true,
              effects: [{
                id: 'confused',
                name: 'Confused',
                description: 'Targets are confused - 50% chance to attack ally, 50% chance to do nothing for 2 rounds',
                config: {
                  confusionType: 'random_actions'
                }
              }]
            },

            resourceCost: {
              resourceTypes: ['mana'],
              resourceValues: {
                mana: 45
              },
              actionPoints: 2,
              components: ['verbal', 'somatic']
            },

            cooldownConfig: {
              type: 'turn_based',
              value: 6
            },

            resolution: 'DICE',
            tags: ['damage', 'psychic', 'control', 'confusion', 'torment-weaver']
          },

          {
            id: 'pb_life_drain_aura',
            name: 'Life Drain Aura',
            description: 'Create an aura that drains life from all enemies within 30 feet, dealing 5d8 necrotic damage per round for 3 rounds.',
            level: 7,
            spellType: 'ACTION',
            effectTypes: ['damage', 'healing'],

            typeConfig: {
              school: 'necromancy',
              icon: 'spell_shadow_lifedrain',
              tags: ['damage', 'healing', 'necrotic', 'drain', 'decay-harbinger'],
              castTime: 1,
              castTimeType: 'IMMEDIATE'
            },

            targetingConfig: {
              targetingType: 'self',
              rangeType: 'self_centered',
              aoeShape: 'circle',
              aoeParameters: { radius: 30 }
            },

            damageConfig: {
              formula: '5d8',
              elementType: 'necrotic',
              damageType: 'area'
            },

            healingConfig: {
              formula: '2d8',
              healingType: 'instant'
            },

            resourceCost: {
              resourceTypes: ['mana'],
              resourceValues: {
                mana: 40
              },
              actionPoints: 2,
              components: ['verbal', 'somatic']
            },

            cooldownConfig: {
              type: 'turn_based',
              value: 6
            },

            resolution: 'DICE',
            tags: ['damage', 'healing', 'necrotic', 'drain', 'decay-harbinger']
          },

          // LEVEL 8 SPELLS
          {
            id: 'pb_plague_incarnate',
            name: 'Plague Incarnate',
            description: 'Transform into living plague for 5 rounds, gaining enhanced damage, poison immunity, and a damaging aura.',
            level: 8,
            spellType: 'ACTION',
            effectTypes: ['transformation'],

            typeConfig: {
              school: 'necromancy',
              icon: 'spell_shadow_plaguecloud',
              tags: ['transformation', 'buff', 'ultimate', 'universal'],
              castTime: 1,
              castTimeType: 'IMMEDIATE'
            },

            targetingConfig: {
              targetingType: 'self',
              rangeType: 'self'
            },

            transformationConfig: {
              transformationType: 'elemental',
              targetType: 'self',
              duration: 5,
              durationUnit: 'rounds',
              power: 'major',
              newForm: 'Plague Incarnate',
              description: 'Become a living vessel of disease and decay.',
              grantedAbilities: [
                { id: 'plague_stats', name: 'Plague Enhancement', description: '+5 Intelligence, +5 Constitution' },
                { id: 'plague_touch', name: 'Plague Touch', description: 'Melee attacks spread disease to targets' },
                { id: 'contagion_aura', name: 'Contagion Aura', description: 'Enemies within 15ft must save or contract disease' },
                { id: 'plague_resist', name: 'Disease Immunity', description: 'Immune to poison and disease effects' }
              ]
            },

            resourceCost: {
              resourceTypes: ['mana'],
              resourceValues: {
                mana: 50
              },
              actionPoints: 2,
              components: ['verbal', 'somatic']
            },

            cooldownConfig: {
              type: 'turn_based',
              value: 10
            },

            resolution: 'DICE',
            tags: ['transformation', 'buff', 'ultimate', 'universal']
          },

          {
            id: 'pb_epidemic',
            name: 'Epidemic',
            description: 'Start an epidemic that spreads through enemy ranks, dealing increasing damage to each successive target.',
            level: 8,
            spellType: 'ACTION',
            effectTypes: ['damage'],

            typeConfig: {
              school: 'necromancy',
              icon: 'spell_shadow_contagion',
              tags: ['damage', 'poison', 'spreading', 'virulent-spreader'],
              castTime: 1,
              castTimeType: 'IMMEDIATE'
            },

            targetingConfig: {
              targetingType: 'chain',
              rangeType: 'ranged',
              rangeDistance: 50,
              targetRestrictions: ['enemy'],
              maxTargets: 8,
              chainDistance: 20
            },

            damageConfig: {
              formula: '6d8',
              elementType: 'poison',
              damageType: 'direct'
            },

            resourceCost: {
              resourceTypes: ['mana'],
              resourceValues: {
                mana: 50
              },
              actionPoints: 2,
              components: ['verbal', 'somatic']
            },

            cooldownConfig: {
              type: 'turn_based',
              value: 8
            },

            resolution: 'DICE',
            tags: ['damage', 'poison', 'spreading', 'virulent-spreader']
          },

          {
            id: 'pb_torment_mastery',
            name: 'Torment Mastery',
            description: 'Master the art of torment, causing all enemies in sight to suffer maximum psychic damage and terror.',
            level: 8,
            spellType: 'ACTION',
            effectTypes: ['damage', 'control'],

            typeConfig: {
              school: 'necromancy',
              icon: 'spell_shadow_painspike',
              tags: ['damage', 'psychic', 'control', 'fear', 'torment-weaver'],
              castTime: 1,
              castTimeType: 'IMMEDIATE'
            },

            targetingConfig: {
              targetingType: 'area',
              rangeType: 'sight',
              rangeDistance: 60,
              aoeShape: 'circle',
              aoeParameters: { radius: 40 },
              targetRestrictions: ['enemy']
            },

            damageConfig: {
              formula: '10d8',
              elementType: 'psychic',
              damageType: 'area'
            },

            controlConfig: {
              controlType: 'mind_control',
              duration: 3,
              durationUnit: 'rounds',
              saveDC: 19,
              saveType: 'spirit',
              savingThrow: true,
              effects: [{
                id: 'terrorized',
                name: 'Terrorized',
                description: 'Targets are terrorized - must flee or cower in fear for 3 rounds',
                config: {
                  fearType: 'flee_or_cower'
                }
              }]
            },

            resourceCost: {
              resourceTypes: ['mana'],
              resourceValues: {
                mana: 50
              },
              actionPoints: 2,
              components: ['verbal', 'somatic']
            },

            cooldownConfig: {
              type: 'turn_based',
              value: 10
            },

            resolution: 'DICE',
            tags: ['damage', 'psychic', 'control', 'fear', 'torment-weaver']
          },

          // LEVEL 9 SPELLS
          {
            id: 'pb_black_death',
            name: 'Black Death',
            description: 'Unleash the ultimate plague - Black Death - that kills all enemies below 30% health instantly.',
            level: 9,
            spellType: 'ACTION',
            effectTypes: ['damage'],

            typeConfig: {
              school: 'necromancy',
              icon: 'spell_shadow_deathanddecay',
              tags: ['damage', 'poison', 'execute', 'ultimate', 'universal'],
              castTime: 1,
              castTimeType: 'IMMEDIATE'
            },

            targetingConfig: {
              targetingType: 'area',
              rangeType: 'sight',
              rangeDistance: 60,
              aoeShape: 'circle',
              aoeParameters: { radius: 50 },
              targetRestrictions: ['enemy']
            },

            damageConfig: {
              formula: '12d10',
              elementType: 'poison',
              damageType: 'area',
              savingThrowConfig: {
                enabled: true,
                savingThrowType: 'constitution',
                difficultyClass: 20,
                saveOutcome: 'halves',
                partialEffect: true,
                partialEffectFormula: 'damage/2'
              }
            },

            resourceCost: {
              resourceTypes: ['mana'],
              resourceValues: {
                mana: 60
              },
              actionPoints: 3,
              components: ['verbal', 'somatic']
            },

            cooldownConfig: {
              type: 'turn_based',
              value: 15
            },

            resolution: 'DICE',
            tags: ['damage', 'poison', 'execute', 'ultimate', 'universal']
          },

          {
            id: 'pb_mind_destroyer',
            name: 'Mind Destroyer',
            description: 'Destroy the minds of all enemies in a massive area, dealing devastating psychic damage and permanently reducing Intelligence.',
            level: 9,
            spellType: 'ACTION',
            effectTypes: ['damage', 'debuff'],

            typeConfig: {
              school: 'necromancy',
              icon: 'spell_shadow_mindsteal',
              tags: ['damage', 'psychic', 'permanent', 'ultimate', 'torment-weaver'],
              castTime: 1,
              castTimeType: 'IMMEDIATE'
            },

            targetingConfig: {
              targetingType: 'area',
              rangeType: 'sight',
              rangeDistance: 60,
              aoeShape: 'circle',
              aoeParameters: { radius: 40 },
              targetRestrictions: ['enemy']
            },

            damageConfig: {
              formula: '15d8',
              elementType: 'psychic',
              damageType: 'area'
            },

            debuffConfig: {
              debuffType: 'statReduction',
              effects: [{
                id: 'mind_destroyed',
                name: 'Mind Destroyed',
                description: 'Intelligence permanently reduced by 3d6 - cannot be healed by normal means',
                statusType: 'permanent_reduction',
                statModifier: {
                  stat: 'intelligence',
                  magnitude: -3,
                  magnitudeType: 'flat'
                }
              }],
              durationValue: 100,
              durationType: 'rounds',
              durationUnit: 'rounds',
              saveDC: 20,
              saveType: 'spirit',
              saveOutcome: 'halves'
            },

            resourceCost: {
              resourceTypes: ['mana'],
              resourceValues: {
                mana: 60
              },
              actionPoints: 3,
              components: ['verbal', 'somatic']
            },

            cooldownConfig: {
              type: 'turn_based',
              value: 12
            },

            resolution: 'DICE',
            tags: ['damage', 'psychic', 'permanent', 'ultimate', 'torment-weaver']
          },

          {
            id: 'pb_decay_apocalypse',
            name: 'Decay Apocalypse',
            description: 'Bring apocalyptic decay to the battlefield, causing all enemies to rot and take massive necrotic damage over time.',
            level: 9,
            spellType: 'ACTION',
            effectTypes: ['damage'],

            typeConfig: {
              school: 'necromancy',
              icon: 'spell_shadow_deathanddecay',
              tags: ['damage', 'necrotic', 'ultimate', 'mass', 'decay-harbinger'],
              castTime: 1,
              castTimeType: 'IMMEDIATE'
            },

            targetingConfig: {
              targetingType: 'area',
              rangeType: 'sight',
              rangeDistance: 60,
              aoeShape: 'circle',
              aoeParameters: { radius: 50 },
              targetRestrictions: ['enemy']
            },

            damageConfig: {
              formula: '10d12',
              elementType: 'necrotic',
              damageType: 'area'
            },

            resourceCost: {
              resourceTypes: ['mana'],
              resourceValues: {
                mana: 60
              },
              actionPoints: 3,
              components: ['verbal', 'somatic']
            },

            cooldownConfig: {
              type: 'turn_based',
              value: 15
            },

            resolution: 'DICE',
            tags: ['damage', 'necrotic', 'ultimate', 'mass', 'decay-harbinger']
          },

          // LEVEL 10 SPELLS
          {
            id: 'pb_plague_god',
            name: 'Plague God',
            description: 'Ascend to become the Plague God, gaining ultimate power over disease, poison, and decay.',
            level: 10,
            spellType: 'ACTION',
            effectTypes: ['transformation'],

            typeConfig: {
              school: 'necromancy',
              icon: 'spell_shadow_contagion',
              tags: ['transformation', 'ultimate', 'god-form', 'universal'],
              castTime: 1,
              castTimeType: 'IMMEDIATE'
            },

            targetingConfig: {
              targetingType: 'self',
              rangeType: 'self'
            },

            transformationConfig: {
              transformationType: 'elemental',
              targetType: 'self',
              duration: 4,
              durationUnit: 'rounds',
              power: 'major',
              newForm: 'Plague Lord',
              description: 'Become a lord of pestilence and decay.',
              grantedAbilities: [
                { id: 'lord_stats', name: 'Pestilence Enhancement', description: '+8 Intelligence, +8 Constitution, +6 Spirit' },
                { id: 'divine_plague', name: 'Divine Plague', description: 'All diseases you spread are enhanced (+50% damage)' },
                { id: 'death_touch', name: 'Death Touch', description: 'Melee attacks deal +3d10 necrotic damage' },
                { id: 'plague_immunity', name: 'Plague Immunity', description: 'Immune to poison, necrotic, and disease effects' },
                { id: 'plague_exhaustion', name: 'Decay (On End)', description: 'Take 3d10 necrotic damage and gain 2 levels of exhaustion when transformation ends' }
              ]
            },

            resourceCost: {
              resourceTypes: ['mana'],
              resourceValues: {
                mana: 100
              },
              actionPoints: 2,
              components: ['verbal', 'somatic']
            },

            cooldownConfig: {
              type: 'turn_based',
              value: 30
            },

            resolution: 'DICE',
            tags: ['transformation', 'ultimate', 'god-form', 'universal']
          },

          {
            id: 'pb_extinction',
            name: 'Extinction',
            description: 'Attempt to cause total extinction of all enemies in sight, dealing catastrophic damage and potentially instant death.',
            level: 10,
            spellType: 'ACTION',
            effectTypes: ['damage'],

            typeConfig: {
              school: 'necromancy',
              icon: 'spell_shadow_deathanddecay',
              tags: ['damage', 'ultimate', 'death', 'universal'],
              castTime: 1,
              castTimeType: 'IMMEDIATE'
            },

            targetingConfig: {
              targetingType: 'area',
              rangeType: 'sight',
              rangeDistance: 120,
              aoeShape: 'circle',
              aoeParameters: { radius: 60 },
              targetRestrictions: ['enemy']
            },

            damageConfig: {
              formula: '20d12',
              elementType: 'necrotic',
              damageType: 'area',
              savingThrowConfig: {
                enabled: true,
                savingThrowType: 'constitution',
                difficultyClass: 22,
                saveOutcome: 'halves',
                partialEffect: true,
                partialEffectFormula: 'damage/2'
              }
            },

            resourceCost: {
              resourceTypes: ['mana'],
              resourceValues: {
                mana: 100
              },
              actionPoints: 4,
              components: ['verbal', 'somatic']
            },

            cooldownConfig: {
              type: 'turn_based',
              value: 30
            },

            resolution: 'DICE',
            tags: ['damage', 'ultimate', 'death', 'universal']
          },

          {
            id: 'pb_ultimate_affliction',
            name: 'Ultimate Affliction',
            description: 'Apply the ultimate affliction that combines all affliction types, dealing massive multi-type damage over time.',
            level: 10,
            spellType: 'ACTION',
            effectTypes: ['damage', 'debuff'],

            typeConfig: {
              school: 'necromancy',
              icon: 'spell_shadow_plaguecloud',
              tags: ['damage', 'debuff', 'ultimate', 'affliction', 'universal'],
              castTime: 1,
              castTimeType: 'IMMEDIATE'
            },

            targetingConfig: {
              targetingType: 'single',
              rangeType: 'ranged',
              rangeDistance: 60,
              targetRestrictions: ['enemy'],
              maxTargets: 1
            },

            damageConfig: {
              formula: '15d10',
              elementType: 'poison',
              damageType: 'direct'
            },

            debuffConfig: {
              debuffType: 'statusEffect',
              effects: [{
                id: 'ultimate_affliction',
                name: 'Ultimate Affliction',
                description: 'Target suffers all affliction types simultaneously - takes 5d10 damage per round, reduced healing, stat penalties, and spreading contagion for 6 rounds',
                statusType: 'ultimate_affliction'
              }],
              durationValue: 6,
              durationType: 'rounds',
              durationUnit: 'rounds',
              saveDC: 22,
              saveType: 'constitution',
              saveOutcome: 'halves'
            },

            resourceCost: {
              resourceTypes: ['mana'],
              resourceValues: {
                mana: 80
              },
              actionPoints: 3,
              components: ['verbal', 'somatic']
            },

            cooldownConfig: {
              type: 'turn_based',
              value: 20
            },

            resolution: 'DICE',
            tags: ['damage', 'debuff', 'ultimate', 'affliction', 'universal']
          }
  ]
};

export default PLAGUEBRINGER_DATA;
