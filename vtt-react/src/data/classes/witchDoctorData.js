/**
 * WITCH DOCTOR CLASS DATA
 * 
 * Voodoo practitioner who invokes powerful loa (voodoo gods) through Voodoo Essence
 * Resource System: Voodoo Essence - generated through curses, rituals, totems, and poisons
 * Specializations: Death Caller, Spirit Healer, War Priest
 */

export const WITCH_DOCTOR_DATA = {
  id: 'witch-doctor',
  name: 'Witch Doctor',
  icon: 'fas fa-skull',
  role: 'Support/Damage',

  // Overview section
  overview: {
    title: 'The Witch Doctor',
    subtitle: 'Voodoo Invoker & Loa Channeler',
    
    description: `The Witch Doctor is a mystical practitioner of voodoo magic who channels the power of ancient loa (voodoo gods) through accumulated Voodoo Essence. By performing rituals, casting curses, placing totems, and applying poisons, the Witch Doctor gathers spiritual energy that can be spent to invoke powerful deities. Each loa requires specific precursors to be met before their divine power can be called upon, rewarding strategic planning and careful resource management.`,
    
    roleplayIdentity: {
      title: 'Roleplay Identity',
      content: `Witch Doctors are spiritual intermediaries between the mortal world and the realm of the loa. Whether through ancestral tradition, desperate bargaining, or scholarly pursuit of forbidden knowledge, they have learned to commune with powerful voodoo spirits and channel their divine power.

**The Witch Doctor's Philosophy**: The loa are neither good nor evil—they are forces of nature, ancient spirits with their own agendas. To invoke them is to make a pact, to offer respect and tribute in exchange for their devastating power. Every curse cast, every ritual performed, every totem placed is an offering to the spirits.

**Common Witch Doctor Archetypes**:
- **The Tribal Shaman**: Keeper of ancestral traditions, protector of their people through ancient rites
- **The Desperate Bargainer**: Made a pact with the loa in a moment of need, now bound to their service
- **The Dark Scholar**: Studied forbidden voodoo texts, seeking power through understanding the spirits
- **The Cursed Bloodline**: Born with the loa's mark, destined to serve as their mortal vessel`
    },
    
    combatRole: {
      title: 'Combat Role',
      content: `The Witch Doctor is a versatile support/control caster who excels at debuffing enemies, supporting allies, and unleashing devastating divine invocations. They build power gradually through curses and rituals, then spend it on game-changing loa invocations.

**Damage Output**: Moderate sustained damage through curses and poisons. High burst potential through loa invocations.

**Survivability**: Moderate. Relies on totems for protection and healing, with some defensive rituals available.

**Utility**: Exceptional. Provides curses, healing, resurrection, teleportation, and powerful buffs through loa invocations.

**Complexity**: High. Requires careful tracking of Voodoo Essence, curse management, and strategic timing of loa invocations based on precursor conditions.`
    },
    
    playstyle: {
      title: 'Playstyle & Strategy',
      content: `**Core Gameplay Loop**:
1. **Build Voodoo Essence** through curses, poisons, totems, and rituals
2. **Manage Precursors** by tracking cursed enemies, ally positions, and ritual completion
3. **Invoke Loa** when essence and precursors align for maximum impact
4. **Control the Battlefield** with strategic totem placement and curse application

**Voodoo Essence Management**:
- **Low Essence (0-5)**: Focus on building through curses and totems, conservative play
- **Medium Essence (6-9)**: Can invoke minor loa (Simbi, Papa Legba), maintain curse coverage
- **High Essence (10+)**: Ready for major invocations (Baron Samedi, Ogoun), game-changing moments

**Precursor Planning**:
- Track which enemies are cursed for Baron Samedi invocation
- Position near allies for Erzulie invocation
- Complete rituals proactively to enable Papa Legba
- Apply poisons early to enable Ogoun when needed

**Strategic Considerations**:
- Curse high-priority targets early to build toward Baron Samedi
- Place Totem of Healing before invoking Erzulie for maximum benefit
- Save Ritual of Death for critical moments when multiple enemies are grouped
- Coordinate with allies for optimal positioning before major invocations`
    },

    immersiveCombatExample: {
      title: 'Combat Example: The Loa\'s Chosen',
      content: `**The Setup**: You're a Witch Doctor (Spirit Healer specialization) facing a group of undead (6 zombies + 1 necromancer). Your party is with you. Starting Voodoo Essence: 0. Starting Mana: 50/60. Your goal: Build Voodoo Essence through curses, totems, and rituals, then invoke Baron Samedi (loa of death) to devastate the undead.

**Starting State**: Voodoo Essence: 0/15 | Mana: 50/60 | HP: 45/45 | Cursed Enemies: 0

**Turn 1 - Building Essence (Essence: 0 → 3)**

*Six zombies shamble toward you, led by a necromancer. You begin the ritual. The loa are watching.*

**Your Action**: Cast "Curse of Weakness" on Necromancer (6 mana)
**Effect**: Target has -2 AC, disadvantage on STR saves, takes 1d6 necrotic damage per turn

*You gesture at the necromancer. Dark voodoo energy WRAPS around him like chains.*

**Voodoo Essence Generated**: +1 (curse cast) = **1/15**
**Cursed Enemies**: 1 (Necromancer)

**Mana**: 50 - 6 = 44/60

**Your Action (Bonus Action)**: Place "Totem of Healing" (4 mana)
**Effect**: Totem heals allies for 1d6 HP per turn in 15 ft radius

*A wooden totem carved with healing symbols rises from the ground, pulsing with spiritual energy.*

**Voodoo Essence Generated**: +1 (totem placed) = **2/15**

**Mana**: 44 - 4 = 40/60

**Your Action (0 AP - Free)**: Apply poison to weapon (no cost, class feature)
**Effect**: Weapon deals +1d4 poison damage

**Voodoo Essence Generated**: +1 (poison applied) = **3/15**

**Your Party's Mage**: "What's that energy swirling around you?"
**You**: "Voodoo Essence. I generate it through curses, totems, and poisons. I have 3 Essence now. I need more to invoke the loa."

**Current State**: Essence: 3/15 | Mana: 40/60 | Cursed: 1

**Turn 2 - More Curses (Essence: 3 → 6)**

*The zombies attack. Your totem heals your party for 1d6 → [5] = 5 HP each.*

**Necromancer**: Takes 1d6 → [4] = 4 necrotic damage from Curse of Weakness

**Your Action**: Cast "Curse of Agony" on Zombie #1 (5 mana)
**Effect**: Target takes 2d6 necrotic damage per turn

*You point at the zombie. It CONVULSES as the curse takes hold.*

**Voodoo Essence Generated**: +1 (curse cast) = **4/15**
**Cursed Enemies**: 2 (Necromancer, Zombie #1)

**Mana**: 40 - 5 = 35/60

**Your Action (Bonus Action)**: Cast "Curse of Decay" on Zombie #2 (5 mana)
**Effect**: Target takes 1d8 necrotic damage per turn, healing reduced by 50%

**Voodoo Essence Generated**: +1 (curse cast) = **5/15**
**Cursed Enemies**: 3 (Necromancer, Zombies #1, #2)

**Mana**: 35 - 5 = 30/60

**Your Party's Tank**: Attacks Zombie #3 → 15 damage

**Your Party's Rogue**: Attacks Zombie #1 (cursed) → 18 damage → **DEAD**

**Cursed Enemy Defeated**: Zombie #1 was cursed and defeated
**Voodoo Essence Generated**: +3 (defeating cursed enemy) = **8/15**

**Your Party's Healer**: "The zombie you cursed just died, and you got a burst of energy!"
**You**: "When a cursed enemy is defeated, I gain 3 Voodoo Essence. I'm at 8 Essence now."

**Current State**: Essence: 8/15 | Mana: 30/60 | Cursed: 2

**Turn 3 - Ritual Preparation (Essence: 8 → 10)**

*You need more Essence to invoke Baron Samedi. Time for a ritual.*

**Zombie #2**: Takes 1d8 → [6] = 6 necrotic damage from Curse of Decay
**Necromancer**: Takes 1d6 → [5] = 5 necrotic damage from Curse of Weakness

**Your Action**: Begin "Ritual of Death" (8 mana, takes 1 full turn to complete)
**Effect**: When completed, all enemies in 20 ft take 4d8 necrotic damage, generates 2 Voodoo Essence

*You begin chanting in the old tongue. Dark symbols appear in the air around you. The loa are listening.*

**Mana**: 30 - 8 = 22/60

**Your Party's Mage**: "What are you doing?"
**You**: "Ritual of Death. It takes a full turn to complete, but when it finishes, all enemies in 20 feet take 4d8 necrotic damage, and I gain 2 Voodoo Essence."

**Your Party's Tank**: Attacks Zombie #2 (cursed) → 16 damage → **DEAD**

**Cursed Enemy Defeated**: Zombie #2 was cursed and defeated
**Voodoo Essence Generated**: +3 (defeating cursed enemy) = **11/15**

*But you're still completing the ritual, so you can't react yet.*

**Current State**: Essence: 11/15 | Mana: 22/60 | Ritual: In Progress

**Turn 4 - Ritual Completion (Essence: 11 → 13)**

*The ritual COMPLETES. Dark energy ERUPTS.*

**Ritual of Death Completes**:
**Damage**: 4d8 necrotic → [7, 8, 6, 7] = **28 necrotic damage to all enemies in 20 ft**

**Zombies #3, #4, #5, #6**: Each take 28 necrotic damage → Zombies #3, #4 **DEAD**, Zombies #5, #6 HEAVILY DAMAGED
**Necromancer**: Takes 28 necrotic damage → HEAVILY DAMAGED

**Voodoo Essence Generated**: +2 (ritual completed) = **13/15**

*The ritual's dark energy CONSUMES the zombies. Two of them COLLAPSE, destroyed.*

**Your Party's Rogue**: "You just killed two zombies with one ritual!"
**You**: "Ritual of Death. 4d8 necrotic damage to all enemies in 20 feet. And I gained 2 Voodoo Essence. I'm at 13 Essence now."

**Necromancer**: Takes 1d6 → [4] = 4 necrotic damage from Curse of Weakness (still active)

**Current State**: Essence: 13/15 | Mana: 22/60 | Cursed: 1 (Necromancer)

**Turn 5 - Invoking Baron Samedi (Essence: 13 → 0)**

*You have 13 Voodoo Essence. The necromancer is cursed. Time to invoke BARON SAMEDI, loa of death.*

**Baron Samedi Requirements**:
- **Essence Cost**: 10 Voodoo Essence
- **Precursor**: At least 1 enemy must be cursed ✓ (Necromancer is cursed)

**Your Action**: "INVOKE BARON SAMEDI" (10 Voodoo Essence)
**Effect**: Baron Samedi appears, deals 6d10 necrotic damage to all cursed enemies, kills any cursed enemy below 25% HP instantly, grants you +2d6 necrotic damage on all attacks for 3 rounds

*You raise your staff to the sky. You CHANT the invocation. The air grows COLD. A spectral figure appears—BARON SAMEDI, loa of death, wearing a top hat and skull face paint, smoking a cigar.*

**Voodoo Essence**: 13 - 10 = **3/15**

**Baron Samedi (spectral voice)**: "You called, child? Let me show you DEATH."

*Baron Samedi gestures. DEATH ENERGY erupts from his hand.*

**Damage to Cursed Enemies**: 6d10 necrotic → [9, 10, 8, 7, 9, 8] = **51 necrotic damage to Necromancer**

**Necromancer**: Takes 51 necrotic damage → **DEAD** (was already heavily damaged)

**Baron Samedi**: "The necromancer dared raise the dead? I AM DEATH. He is mine now."

*Baron Samedi LAUGHS. The necromancer's soul is DRAGGED into the spirit realm.*

**Buff Granted**: You gain +2d6 necrotic damage on all attacks for 3 rounds

**Your Party (in shock)**: "What... what WAS that?!"
**You**: "Baron Samedi. Loa of death. I invoked him with 10 Voodoo Essence. He deals 6d10 necrotic damage to all cursed enemies and kills any cursed enemy below 25% HP instantly. The necromancer was cursed and heavily damaged, so Baron Samedi obliterated him."

**Current State**: Essence: 3/15 | Mana: 22/60 | Baron Samedi Buff: 3 rounds

**Turn 6 - Cleanup**

*Only Zombies #5 and #6 remain, both heavily damaged from the Ritual of Death.*

**Your Action**: Melee attack Zombie #5 (with Baron Samedi buff)
**Attack Roll**: d20+4 → [15] = Hit!
**Base Damage**: 2d6+2 → [5, 4] + 2 = 11 damage
**Baron Samedi Buff**: +2d6 necrotic → [6, 5] = +11 necrotic damage
**Total Damage**: 11 + 11 = **22 damage**

**Zombie #5**: Takes 22 damage → **DEAD**

**Your Party's Tank**: Attacks Zombie #6 → **DEAD**

**Combat Over**

*Baron Samedi tips his hat to you, then fades into the spirit realm.*

**Baron Samedi**: "Well done, child. Call me again when you need DEATH."

**Your Party's Healer**: "You... you summoned a VOODOO GOD."
**You**: "Baron Samedi, loa of death. I built 13 Voodoo Essence through curses (1 Essence each), totems (1 Essence), poison (1 Essence), rituals (2 Essence), and defeating cursed enemies (3 Essence each). I spent 10 Essence to invoke Baron Samedi. He required at least 1 cursed enemy as a precursor—the necromancer was cursed, so the precursor was met."
**Your Party's Mage**: "And he dealt 51 damage to the necromancer?"
**You**: "6d10 necrotic damage to all cursed enemies. The necromancer was the only cursed enemy at that moment, so he took the full 51 damage. Plus, Baron Samedi grants me +2d6 necrotic damage on all attacks for 3 rounds. My melee attack dealt 22 damage total."
**Your Party's Rogue**: "What other loa can you invoke?"
**You**: "Erzulie (loa of love, heals allies), Papa Legba (loa of crossroads, teleports party), Ogoun (loa of war, massive damage buff), Simbi (loa of water, crowd control). Each loa has different Essence costs and precursor requirements."

**Final State**: Essence: 3/15 | Mana: 22/60 | HP: 45/45

**Essence Generation Breakdown**:
- Curse of Weakness (Necromancer): +1 Essence
- Totem of Healing: +1 Essence
- Poison application: +1 Essence
- Curse of Agony (Zombie #1): +1 Essence
- Curse of Decay (Zombie #2): +1 Essence
- Zombie #1 defeated (cursed): +3 Essence
- Zombie #2 defeated (cursed): +3 Essence
- Ritual of Death completed: +2 Essence
- **Total Generated**: 13 Essence
- **Spent on Baron Samedi**: -10 Essence
- **Remaining**: 3 Essence

**The Lesson**: Witch Doctor gameplay is about:
1. **Voodoo Essence Generation**: Built 13 Essence through curses (+1 each), totems (+1), poison (+1), rituals (+2), defeating cursed enemies (+3 each)
2. **Curse Management**: Cursed 3 enemies (Necromancer, Zombies #1, #2), gained +3 Essence when cursed enemies died
3. **Ritual of Death**: Dealt 28 necrotic damage to all enemies in 20 ft, killed 2 zombies, generated +2 Essence
4. **Loa Invocation**: Invoked Baron Samedi (10 Essence, required 1+ cursed enemy)
5. **Baron Samedi Power**: Dealt 51 necrotic damage to cursed necromancer, killed him instantly, granted +2d6 necrotic damage buff for 3 rounds
6. **Precursor Management**: Ensured necromancer was cursed before invoking Baron Samedi (precursor requirement)
7. **Strategic Timing**: Waited until 13 Essence before invoking, ensuring maximum impact

You're a VOODOO PRACTITIONER who channels the power of ancient loa. You build Voodoo Essence through curses, totems, poisons, and rituals. When you have enough Essence and meet the precursor conditions, you INVOKE THE LOA. Baron Samedi appeared as a spectral figure and dealt 51 necrotic damage to the cursed necromancer, killing him instantly. Erzulie could heal your entire party. Papa Legba could teleport you across the battlefield. Ogoun could grant massive damage buffs. Each loa is a DIVINE INTERVENTION that changes the course of battle. You don't just cast spells—you COMMUNE WITH GODS.`
    }
  },
  
  // Resource System
  resourceSystem: {
    title: 'Voodoo Essence & Loa Invocation',
    subtitle: 'Spiritual Energy & Divine Channeling',

    description: `The Witch Doctor's power stems from Voodoo Essence, a spiritual resource generated through voodoo practices. This essence is spent to invoke powerful loa (voodoo gods), each requiring specific precursor conditions to be met. Mastering the balance between essence generation, precursor management, and strategic invocation timing is the key to becoming a powerful Witch Doctor.`,
    
    mechanics: {
      title: 'How It Works',
      content: `**Voodoo Essence Generation**:
- **Casting Curses**: Each curse cast generates 1 Voodoo Essence
- **Applying Poisons**: Poisoning weapons or throwing poison grenades generates 1 Voodoo Essence
- **Performing Rituals**: Successfully completing a ritual generates 2 Voodoo Essence
- **Placing Totems**: Each totem placed generates 1 Voodoo Essence
- **Defeating Cursed Enemies**: Defeating an enemy you cursed generates 3 Voodoo Essence

**Maximum Capacity**: You can hold up to 15 Voodoo Essence at once

**Loa Invocation**:
Each loa requires both sufficient Voodoo Essence AND specific precursor conditions to be met. Invocations are powerful, game-changing abilities that consume all required essence when activated.

**Precursor Tracking**:
Carefully track battlefield conditions to know when you can invoke each loa. Some precursors require preparation (rituals, totem placement), while others emerge naturally through combat (cursed enemies, ally positioning).`
    },
    
    essenceGenerationTable: {
      title: 'Voodoo Essence Generation',
      headers: ['Action', 'Essence Gained', 'Notes'],
      rows: [
        ['Cast Curse', '1', 'Any curse spell applied to enemy'],
        ['Apply Poison', '1', 'Weapon poison or poison grenade'],
        ['Place Totem', '1', 'Any totem type'],
        ['Perform Ritual', '2', 'Ritual must complete successfully'],
        ['Defeat Cursed Enemy', '3', 'Enemy must have your curse active']
      ]
    },

    loaInvocationTable: {
      title: 'Loa Invocations',
      headers: ['Loa', 'Essence Cost', 'Precursors', 'Effect Summary'],
      rows: [
        ['Baron Samedi', '10', '3+ cursed enemies, Ritual of Death', 'Resurrect ally + curse all enemies (4d6 necrotic over 3 turns)'],
        ['Erzulie', '8', '2+ allies within 10ft, Totem of Healing placed', '+2 AC, fear immunity, heal 3d8 to all allies in 30ft'],
        ['Papa Legba', '7', '2+ essence from rituals, within 30ft of cursed enemy', 'Telepathy for 1hr + teleport 5 allies within 1 mile'],
        ['Simbi', '6', '1+ ally below 50% HP, Ritual of Cleansing', 'Healing rain: 4d6 HP, cure diseases/poisons in 30ft'],
        ['Ogoun', '9', 'Poison applied, 1+ ally in combat within 15ft', '+2 attack, physical resistance, +2d6 fire damage for 1min']
      ]
    },

    strategicConsiderations: {
      title: 'Strategic Considerations',
      content: `**Early Combat (Rounds 1-3)**:
Focus on building essence through curses and totems. Apply poisons to weapons. Identify which loa will be most valuable for the current encounter.

**Mid Combat (Rounds 4-6)**:
You should have 6-10 essence. Consider invoking Simbi for healing or Papa Legba for utility. Continue building toward major invocations if the fight will last longer.

**Late Combat (Rounds 7+)**:
Prime time for Baron Samedi or Ogoun invocations. These game-changing abilities can turn the tide of difficult battles.

**Precursor Preparation**:
- Always have Ritual of Death ready for Baron Samedi opportunities
- Place Totem of Healing proactively when allies are grouped
- Track your ritual-generated essence for Papa Legba
- Apply poisons early in combat to enable Ogoun later`
    },

    playingInPerson: {
      title: 'Playing in Person',
      subtitle: 'Physical Tracking for Tabletop Play',
      content: `The Witch Doctor's Voodoo Essence and Loa Invocation system combines resource accumulation with precursor tracking, creating a strategic in-person experience. Here's how to track your spiritual power at the table:

**Required Materials**:
- **15 tokens or beads** (purple/spiritual color recommended for Voodoo Essence)
- **Loa reference card** with invocation requirements
- **Precursor tracking sheet** (checkboxes for each loa's conditions)
- **Optional: Voodoo-themed tokens** (skulls, bones, spiritual symbols)

**Voodoo Essence Tracking**:

**The Token Method** (Recommended):

Use physical tokens to represent Voodoo Essence:
- **Starting State**: Begin with 0 tokens
- **Generating Essence**: When you perform essence-generating actions, add tokens
  - Cast curse → Add 1 token
  - Apply poison → Add 1 token
  - Place totem → Add 1 token
  - Complete ritual → Add 2 tokens
  - Defeat cursed enemy → Add 3 tokens
- **Spending Essence**: When you invoke a loa, remove the required tokens
  - Baron Samedi → Remove 10 tokens (8 for Shadow Priest)
  - Erzulie → Remove 8 tokens
  - Papa Legba → Remove 7 tokens
  - Simbi → Remove 6 tokens
  - Ogoun → Remove 9 tokens
- **Maximum**: 15 tokens maximum

**Setup**:
Create a simple tracking area:
- **Essence Pool** (your active tokens - the spiritual power you've accumulated)
- **Token Bank** (unused tokens, up to 15 total)

**Alternative Tracking Methods**:
- **d20 Die**: Set it to your current Essence count (0-15)
- **Tally Marks**: Write on paper with hash marks
- **Colored Beads**: Use purple/spiritual beads in a small bowl

**Loa Invocation Precursor Tracking**:

**The Checklist Method**:

Create a reference card with each loa's precursor requirements:
\`\`\`
LOA INVOCATION TRACKER

BARON SAMEDI (10 Essence)
☐ 3+ cursed enemies active
☐ Ritual of Death performed
READY: [YES / NO]

ERZULIE (8 Essence)
☐ 2+ allies within 10ft of you
☐ Totem of Healing placed
READY: [YES / NO]

PAPA LEGBA (7 Essence)
☐ 2+ essence from rituals
☐ Within 30ft of cursed enemy
READY: [YES / NO]

SIMBI (6 Essence)
☐ 1+ ally below 50% HP
☐ Ritual of Cleansing performed
READY: [YES / NO]

OGOUN (9 Essence)
☐ Poison applied (weapon/grenade)
☐ 1+ ally in combat within 15ft
READY: [YES / NO]
\`\`\`

**Tracking Precursors During Combat**:
- **Cursed Enemies**: Place a small marker on enemy tokens/minis when cursed
- **Ritual Tracking**: Check off when you complete rituals
- **Totem Placement**: Note on map where totems are placed
- **Ally Positioning**: Visually check distances on battle map
- **Poison Application**: Mark your weapon or note when poison is applied

**Example In-Person Turn**:

*You have 4 Voodoo Essence, 2 cursed enemies, no rituals performed*

**Turn 1 - Building Essence**:
1. "I cast Curse of Agony on the orc!"
2. Add 1 purple token to your pool → Now at 5 Essence
3. Place a curse marker on the orc mini
4. Check precursors: Baron Samedi needs 3 cursed enemies (only have 2)

**Turn 2 - More Essence**:
1. "I place a Totem of Healing near our fighter!"
2. Add 1 purple token → Now at 6 Essence
3. Place totem marker on battle map
4. Check precursors: Erzulie needs 2+ allies within 10ft + totem (totem ✓, check ally positions)

**Turn 3 - Curse Another Enemy**:
1. "I cast Curse of Agony on the goblin!"
2. Add 1 purple token → Now at 7 Essence
3. Place curse marker on goblin mini
4. Check precursors: Baron Samedi needs 3 cursed enemies (orc, goblin... need 1 more)

**Turn 4 - Third Curse**:
1. "I cast Curse of Agony on the troll!"
2. Add 1 purple token → Now at 8 Essence
3. Place curse marker on troll mini
4. Check precursors: Baron Samedi now has 3 cursed enemies! But need Ritual of Death...

**Turn 5 - Ritual**:
1. "I perform Ritual of Death!" (takes 1 action)
2. Add 2 purple tokens → Now at 10 Essence
3. Check precursors: Baron Samedi READY! (3 cursed enemies ✓, Ritual of Death ✓)

**Turn 6 - INVOKE LOA**:
1. "I invoke Baron Samedi, the loa of death!"
2. Remove 10 purple tokens from pool → Now at 0 Essence
3. Resurrect fallen ally + curse all enemies (4d6 necrotic over 3 turns)
4. Roll 4d6 → [5, 6, 4, 5] = 20 necrotic damage per turn for 3 turns!

**Quick Reference Card Template**:
\`\`\`
WITCH DOCTOR QUICK REFERENCE

VOODOO ESSENCE GENERATION:
• Cast Curse: +1 Essence
• Apply Poison: +1 Essence
• Place Totem: +1 Essence
• Complete Ritual: +2 Essence
• Defeat Cursed Enemy: +3 Essence
Maximum: 15 Essence

LOA INVOCATIONS (Essence Cost):
• Baron Samedi (10): Resurrect + curse all
• Ogoun (9): +2 attack, resistance, +2d6 fire
• Erzulie (8): +2 AC, fear immunity, heal 3d8
• Papa Legba (7): Telepathy + teleport allies
• Simbi (6): Healing rain, cure diseases

PRECURSOR TRACKING:
☐ Cursed enemies (count them)
☐ Rituals performed (check off)
☐ Totems placed (mark on map)
☐ Ally positions (measure distances)
☐ Poison applied (note on weapon)
\`\`\`

**Thematic Enhancements**:

Many players enhance the voodoo experience with:
- **Skull Tokens**: Use small skull beads for Voodoo Essence
- **Voodoo Doll Props**: Keep a small voodoo doll prop on the table
- **Ritual Candles**: Light a candle when performing rituals (if safe)
- **Loa Cards**: Print cards with loa artwork and effects
- **Curse Markers**: Use small skull/bone markers for cursed enemies
- **Totem Minis**: Use small totem miniatures for placed totems

**Precursor Management Tips**:

**Baron Samedi (Death Loa)**:
- **Precursors**: 3+ cursed enemies, Ritual of Death
- **Strategy**: Curse 3 enemies early, perform ritual when ready
- **Tracking**: Count cursed enemy markers, check off ritual

**Erzulie (Love Loa)**:
- **Precursors**: 2+ allies within 10ft, Totem of Healing
- **Strategy**: Group allies together, place totem proactively
- **Tracking**: Measure distances on map, note totem placement

**Papa Legba (Crossroads Loa)**:
- **Precursors**: 2+ essence from rituals, within 30ft of cursed enemy
- **Strategy**: Perform rituals early, stay near cursed enemies
- **Tracking**: Count ritual-generated essence separately, measure distance

**Simbi (Water Loa)**:
- **Precursors**: 1+ ally below 50% HP, Ritual of Cleansing
- **Strategy**: Wait for ally to take damage, perform ritual when needed
- **Tracking**: Monitor ally HP, check off ritual

**Ogoun (War Loa)**:
- **Precursors**: Poison applied, 1+ ally in combat within 15ft
- **Strategy**: Apply poison early, stay near melee allies
- **Tracking**: Mark weapon with poison, measure ally distances

**Example Full Combat Sequence**:

*Starting: 0 Essence, no precursors met*

**Turn 1**: Cast Curse of Agony (orc) → 1 Essence, 1 cursed enemy
**Turn 2**: Place Totem of Healing → 2 Essence, totem placed
**Turn 3**: Cast Curse of Agony (goblin) → 3 Essence, 2 cursed enemies
**Turn 4**: Apply poison to weapon → 4 Essence, poison applied
**Turn 5**: Cast Curse of Agony (troll) → 5 Essence, 3 cursed enemies
**Turn 6**: Perform Ritual of Death → 7 Essence, ritual complete
**Turn 7**: Invoke Baron Samedi! → 0 Essence (spent 10, but Shadow Priest = 8)
**Result**: Ally resurrected, all enemies cursed for 4d6 necrotic over 3 turns!

**Visual Organization**:

**Essence Pool Layout**:
\`\`\`
VOODOO ESSENCE: [○][○][○][○][○][○][○] (7/15)

LOA READY:
Baron Samedi: ✓ (3 cursed, ritual done)
Erzulie: ✗ (need allies grouped)
Papa Legba: ✗ (need ritual essence)
Simbi: ✗ (no injured allies)
Ogoun: ✓ (poison applied, ally nearby)
\`\`\`

**Battlefield Tracking**:
- **Cursed Enemies**: Place skull markers on cursed enemy minis
- **Totems**: Place totem markers on battle map
- **Ritual Zones**: Mark ritual areas with tokens/markers
- **Ally Positions**: Use measuring tape for distance checks

**Why This System Works**: The physical act of accumulating Voodoo Essence tokens while simultaneously tracking multiple precursor conditions creates a strategic puzzle. You're not just building a resource—you're orchestrating battlefield conditions to align with loa requirements. The checklist system makes it easy to see which invocations are available, and the token pool shows how close you are to affording them. The combination of resource management and precursor tracking mirrors the thematic concept of preparing spiritual rituals and invoking divine powers.

**Pro Tips**:
- **Precursor Planning**: Decide which loa you want to invoke BEFORE combat starts
- **Early Cursing**: Curse enemies early to enable Baron Samedi later
- **Totem Placement**: Place totems proactively when allies are grouped
- **Ritual Timing**: Perform rituals when you have time (not during emergencies)
- **Essence Banking**: Keep 6-10 essence banked for quick invocations
- **Specialization Synergy**: Shadow Priests should focus on Baron Samedi, Spirit Callers on Erzulie/Simbi, War Doctors on Ogoun

**Budget-Friendly Alternatives**:
- **No tokens?** Use coins, buttons, or paper clips for Voodoo Essence
- **No markers?** Write cursed enemy names on paper
- **No totem minis?** Use coins or tokens to mark totem locations
- **Minimalist**: Just track essence count and precursors on paper

**Specialization-Specific Tracking**:

**Shadow Priest**:
- Baron Samedi costs 8 essence (not 10) → Remove 8 tokens instead of 10
- Curses generate +1 essence → Add 2 tokens per curse (not 1)
- Only need 2 cursed enemies for Baron Samedi → Adjust checklist

**Spirit Caller**:
- Erzulie and Simbi cost -2 essence → Adjust token removal
- Totems generate +1 essence → Add 2 tokens per totem
- Enhanced healing effects → Note on loa cards

**War Doctor**:
- Ogoun costs -2 essence → Remove 7 tokens (not 9)
- Poison generates +1 essence → Add 2 tokens per poison
- Enhanced combat buffs → Note on loa cards

**Why Witch Doctor Is Perfect for In-Person Play**: The class is built around accumulating spiritual power (Voodoo Essence) while orchestrating complex battlefield conditions (precursors). The physical tokens make essence accumulation tangible, and the checklist system makes precursor tracking manageable. The dramatic moment of invoking a loa—removing a large pile of tokens and announcing the divine intervention—creates a memorable, thematic experience. The combination of resource management, precursor tracking, and powerful invocations makes every combat feel like a spiritual ritual, perfectly capturing the Witch Doctor's voodoo theme.`
    }
  },

  // Specializations
  specializations: {
    title: 'Voodoo Specializations',
    subtitle: 'Three Paths of the Loa',
    
    description: `Witch Doctors specialize in different aspects of voodoo practice, each focusing on specific loa and spiritual techniques. Choose your specialization to determine which divine powers you master.`,
    
    passiveAbility: {
      name: 'Loa\'s Favor',
      description: 'All Witch Doctors can invoke any of the five loa, but your specialization determines which invocations are enhanced and cost less essence.'
    },
    
    specs: [
      {
        id: 'shadow-priest',
        name: 'Shadow Priest',
        icon: 'spell_shadow_raisedead',
        color: '#8B008B',
        theme: 'Necromancy & Resurrection',

        description: `Shadow Priests specialize in the darker aspects of voodoo, focusing on Baron Samedi and the manipulation of life and death. They excel at cursing enemies, raising the dead, and wielding necrotic power.`,

        playstyle: 'Aggressive cursing, necrotic damage, resurrection focus',
        
        strengths: [
          'Baron Samedi invocation costs -2 essence (8 instead of 10)',
          'Curses generate +1 additional Voodoo Essence',
          'Enhanced necrotic damage on cursed targets',
          'Can invoke Baron Samedi with only 2 cursed enemies (instead of 3)'
        ],

        weaknesses: [
          'Limited healing compared to other specs',
          'Requires curse management',
          'Baron Samedi precursors still demanding',
          'Less effective against undead/constructs'
        ],

        specPassive: {
          name: 'Shadow\'s Embrace',
          description: 'Baron Samedi invocations cost 2 less essence and require only 2 cursed enemies. Curses generate +1 additional Voodoo Essence.'
        },
        
        keyAbilities: [
          'Curse of Agony: Your signature curse that deals 2d6 necrotic damage per turn',
          'Ritual of Death: Dark ritual that curses an area and frightens enemies',
          'Baron Samedi Invocation: Resurrect ally and devastate enemies with necrotic curse'
        ]
      },
      
      {
        id: 'spirit-healer',
        name: 'Spirit Healer',
        icon: 'spell_nature_healingtouch',
        color: '#20B2AA',
        theme: 'Healing & Protection',
        
        description: `Spirit Healers channel Erzulie and Simbi, focusing on protective magic, healing, and support. They excel at keeping allies alive through totems, healing rituals, and divine protection.`,
        
        playstyle: 'Support-focused, totem placement, healing optimization',
        
        strengths: [
          'Erzulie and Simbi invocations cost -2 essence each',
          'Totems generate +1 additional Voodoo Essence',
          'Enhanced healing on all spells (+50%)',
          'Totems have increased range and duration'
        ],
        
        weaknesses: [
          'Lower damage output',
          'Requires ally positioning awareness',
          'Totem placement can be disrupted',
          'Less effective when solo'
        ],
        
        specPassive: {
          name: 'Spirit\'s Grace',
          description: 'Erzulie and Simbi invocations cost 2 less essence. Totems generate +1 additional essence and have +50% healing power.'
        },
        
        keyAbilities: [
          'Totem of Healing: Healing totem that restores 2d4 HP per turn to nearby allies',
          'Ritual of Cleansing: Purifying ritual that removes curses and diseases',
          'Erzulie Invocation: Divine protection granting AC, fear immunity, and healing'
        ]
      },
      
      {
        id: 'war-priest',
        name: 'War Priest',
        icon: 'ability_warrior_innerrage',
        color: '#DC143C',
        theme: 'Combat Enhancement & Spirits',
        
        description: `War Priests follow Ogoun and Papa Legba, focusing on combat enhancement, poison warfare, and spiritual communication. They excel at empowering allies and devastating enemies with enhanced weapons.`,
        
        playstyle: 'Aggressive support, poison application, combat buffs',
        
        strengths: [
          'Ogoun and Papa Legba invocations cost -2 essence each',
          'Poisons generate +1 additional Voodoo Essence',
          'Enhanced weapon damage (+2d6 on poisoned weapons)',
          'Can apply poisons as bonus action'
        ],
        
        weaknesses: [
          'Limited direct healing',
          'Requires melee range for some abilities',
          'Poison-resistant enemies reduce effectiveness',
          'Ogoun precursors require ally coordination'
        ],
        
        specPassive: {
          name: 'Warrior\'s Spirit',
          description: 'Ogoun and Papa Legba invocations cost 2 less essence. Poisons generate +1 additional essence and deal +2d6 damage.'
        },
        
        keyAbilities: [
          'Venomous Weapon: Apply potent poison adding 2d4 poison damage for 1 hour',
          'Poison Cloud: Toxic explosion dealing 3d6 poison damage in 10ft radius',
          'Ogoun Invocation: Empower allies with combat prowess and fire damage'
        ]
      }
    ]
  },

  // Example Spells - organized by specialization
  exampleSpells: [
    // ===== SHADOW PRIEST SPECIALIZATION =====
    {
      id: 'wd_curse_of_agony',
      name: 'Curse of Agony',
      description: 'Inflict a painful curse on the target, causing them to writhe in pain and take necrotic damage each turn.',
      spellType: 'ACTION',
      icon: 'spell_shadow_curseofsargeras',
      school: 'Necromancy',
      level: 2,
      specialization: 'shadow-priest',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 60
      },

      durationConfig: {
        durationType: 'rounds',
        duration: 10
      },

      resourceCost: {
        mana: 3,
        components: ['verbal', 'somatic', 'material'],
        verbalText: 'Suffer eternal torment!',
        somaticText: 'Point at target with cursed fetish',
        materialText: 'Voodoo doll fragment'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '2d6',
        damageType: 'necrotic',
        scalingType: 'dot'
      },

      effects: {
        damage: {
          dot: {
            formula: '2d6',
            type: 'necrotic',
            duration: 10,
            interval: 'turn'
          }
        },
        debuff: {
          type: 'cursed',
          duration: 10,
          description: 'Target is cursed and takes necrotic damage each turn'
        }
      },

      specialMechanics: {
        voodooEssence: {
          generates: 1,
          description: 'Generates 1 Voodoo Essence when cast'
        },
        curse: {
          type: 'agony',
          stackable: false,
          description: 'Counts toward Baron Samedi precursor (3 cursed enemies)'
        }
      },

      tags: ['curse', 'necrotic', 'dot', 'shadow-priest', 'essence-generator'],
      flavorText: 'The loa of pain hear your plea. Let suffering be their answer.'
    },

    {
      id: 'wd_ritual_of_death',
      name: 'Ritual of Death',
      description: 'Perform a dark ritual that curses an area, dealing necrotic damage and frightening enemies within.',
      spellType: 'ACTION',
      icon: 'spell_shadow_darkritual',
      school: 'Necromancy',
      level: 3,
      specialization: 'shadow-priest',

      typeConfig: {
        castTime: 1,
        castTimeType: 'ACTION'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 30,
        aoeType: 'circle',
        aoeSize: 15
      },

      durationConfig: {
        durationType: 'rounds',
        duration: 3
      },

      resourceCost: {
        mana: 5,
        components: ['verbal', 'somatic', 'material'],
        verbalText: 'Baron Samedi, accept this offering!',
        somaticText: 'Draw ritual circle with staff',
        materialText: 'Graveyard dirt and bone dust'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '2d6',
        damageType: 'necrotic',
        scalingType: 'dot'
      },

      effects: {
        damage: {
          dot: {
            formula: '2d6',
            type: 'necrotic',
            duration: 3,
            interval: 'turn',
            aoe: true
          }
        },
        control: {
          type: 'frightened',
          duration: 3,
          savingThrow: 'Wisdom',
          dc: 15
        },
        zone: {
          type: 'cursed_ground',
          duration: 3,
          description: 'Area becomes cursed ground'
        }
      },

      specialMechanics: {
        voodooEssence: {
          generates: 2,
          description: 'Generates 2 Voodoo Essence (ritual completion)'
        },
        precursor: {
          enables: 'baron_samedi',
          description: 'Required precursor for Baron Samedi invocation'
        },
        ritual: {
          type: 'death',
          interruptible: true,
          description: 'Can be interrupted if caster takes damage'
        }
      },

      tags: ['ritual', 'necrotic', 'aoe', 'fear', 'shadow-priest', 'precursor'],
      flavorText: 'Death walks among the living. The Baron demands tribute.'
    },

    {
      id: 'wd_baron_samedi_invocation',
      name: 'Invoke Baron Samedi',
      description: 'Channel the power of Baron Samedi, the loa of death and resurrection. Resurrect one fallen ally with full HP and curse all enemies within 30 feet.',
      spellType: 'ACTION',
      icon: 'spell_shadow_raisedead',
      school: 'Necromancy',
      level: 7,
      specialization: 'shadow-priest',

      typeConfig: {
        castTime: 1,
        castTimeType: 'ACTION'
      },

      targetingConfig: {
        targetingType: 'special',
        rangeType: 'ranged',
        rangeDistance: 30,
        aoeType: 'circle',
        aoeSize: 30
      },

      durationConfig: {
        durationType: 'rounds',
        duration: 3
      },

      resourceCost: {
        mana: 15,
        voodooEssence: 10,
        components: ['verbal', 'somatic', 'material'],
        verbalText: 'Baron Samedi, master of the crossroads, I invoke thee!',
        somaticText: 'Raise staff to the sky',
        materialText: 'Top hat and cigar as offering'
      },

      resolution: 'AUTOMATIC',

      healingConfig: {
        formula: 'FULL_HP',
        healingType: 'resurrection',
        description: 'Resurrect one ally with full hit points'
      },

      damageConfig: {
        formula: '4d6',
        damageType: 'necrotic',
        scalingType: 'dot'
      },

      effects: {
        resurrection: {
          targets: 1,
          condition: 'dead_within_1_minute',
          healAmount: 'FULL_HP',
          description: 'Resurrect one fallen ally'
        },
        damage: {
          dot: {
            formula: '4d6',
            type: 'necrotic',
            duration: 3,
            interval: 'turn',
            aoe: true,
            targets: 'all_enemies_in_radius'
          }
        },
        debuff: {
          type: 'cursed',
          duration: 3,
          targets: 'all_enemies_in_radius'
        }
      },

      specialMechanics: {
        voodooEssence: {
          cost: 10,
          specialization_discount: 2,
          description: 'Shadow Priests pay only 8 essence'
        },
        precursors: {
          required: ['3_cursed_enemies', 'ritual_of_death'],
          specialization_reduction: '2_cursed_enemies_for_shadow_priest',
          description: 'Requires 3 cursed enemies and Ritual of Death completion'
        },
        invocation: {
          type: 'loa',
          deity: 'Baron Samedi',
          cooldown: 'once_per_long_rest'
        }
      },

      tags: ['invocation', 'loa', 'resurrection', 'necrotic', 'aoe', 'shadow-priest', 'ultimate'],
      flavorText: 'The Baron arrives in a cloud of cigar smoke, his laughter echoing as death itself bows before him.'
    },

    // ===== SPIRIT HEALER SPECIALIZATION =====
    {
      id: 'wd_totem_of_healing',
      name: 'Totem of Healing',
      description: 'Place a healing totem that restores hit points to all allies within 10 feet each turn.',
      spellType: 'ACTION',
      icon: 'spell_nature_healingtouch',
      school: 'Conjuration',
      level: 2,
      specialization: 'spirit-healer',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'ground',
        rangeType: 'ranged',
        rangeDistance: 30,
        aoeType: 'circle',
        aoeSize: 10
      },

      durationConfig: {
        durationType: 'rounds',
        duration: 10
      },

      resourceCost: {
        mana: 4,
        components: ['verbal', 'somatic', 'material'],
        verbalText: 'Spirits of healing, answer my call!',
        somaticText: 'Plant totem in ground',
        materialText: 'Carved wooden totem'
      },

      resolution: 'AUTOMATIC',

      healingConfig: {
        formula: '2d4',
        healingType: 'aoe_allies',
        description: 'Heal all allies within 10 feet each turn'
      },

      effects: {
        healing: {
          dot: {
            formula: '2d4',
            type: 'healing',
            duration: 10,
            interval: 'turn',
            aoe: true,
            targets: 'allies_in_radius'
          }
        },
        summon: {
          type: 'totem',
          hp: 10,
          ac: 10,
          duration: 10,
          description: 'Totem can be destroyed by enemies'
        }
      },

      specialMechanics: {
        voodooEssence: {
          generates: 1,
          specialization_bonus: 1,
          description: 'Generates 1 essence (2 for Spirit Healers)'
        },
        precursor: {
          enables: 'erzulie',
          description: 'Required precursor for Erzulie invocation'
        },
        totem: {
          type: 'healing',
          destructible: true,
          specialization_bonus: '+50% healing for Spirit Healers'
        }
      },

      tags: ['totem', 'healing', 'aoe', 'spirit-healer', 'essence-generator', 'precursor'],
      flavorText: 'The spirits gather around the totem, their gentle touch mending wounds.'
    },

    {
      id: 'wd_ritual_of_cleansing',
      name: 'Ritual of Cleansing',
      description: 'Perform a purifying ritual that removes all curses, diseases, and poisons from an ally.',
      spellType: 'ACTION',
      icon: 'spell_holy_purify',
      school: 'Abjuration',
      level: 3,
      specialization: 'spirit-healer',

      typeConfig: {
        castTime: 1,
        castTimeType: 'ACTION'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'touch',
        rangeDistance: 5
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 4,
        components: ['verbal', 'somatic', 'material'],
        verbalText: 'Simbi, cleanse this vessel!',
        somaticText: 'Wash target with blessed water',
        materialText: 'River water and purifying herbs'
      },

      resolution: 'AUTOMATIC',

      effects: {
        cleanse: {
          removes: ['curse', 'disease', 'poison'],
          targets: 'single_ally',
          description: 'Remove all negative conditions'
        }
      },

      specialMechanics: {
        voodooEssence: {
          generates: 2,
          description: 'Generates 2 Voodoo Essence (ritual completion)'
        },
        precursor: {
          enables: 'simbi',
          description: 'Required precursor for Simbi invocation'
        },
        ritual: {
          type: 'cleansing',
          interruptible: true
        }
      },

      tags: ['ritual', 'cleanse', 'healing', 'spirit-healer', 'precursor'],
      flavorText: 'The river spirit washes away all impurities, leaving only purity.'
    },

    {
      id: 'wd_erzulie_invocation',
      name: 'Invoke Erzulie',
      description: 'Channel the power of Erzulie, goddess of love and protection. Create a protective aura granting AC bonus, fear immunity, and healing to all allies within 30 feet.',
      spellType: 'ACTION',
      icon: 'spell_holy_prayerofhealing',
      school: 'Abjuration',
      level: 6,
      specialization: 'spirit-healer',

      typeConfig: {
        castTime: 1,
        castTimeType: 'ACTION'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self',
        aoeType: 'circle',
        aoeSize: 30
      },

      durationConfig: {
        durationType: 'rounds',
        duration: 10
      },

      resourceCost: {
        mana: 12,
        voodooEssence: 8,
        components: ['verbal', 'somatic', 'material'],
        verbalText: 'Erzulie, goddess of love, protect your children!',
        somaticText: 'Embrace allies with open arms',
        materialText: 'Jewels and fine perfume as offering'
      },

      resolution: 'AUTOMATIC',

      healingConfig: {
        formula: '3d8',
        healingType: 'aoe_allies',
        description: 'Heal all allies in 30ft radius over 1 minute'
      },

      effects: {
        healing: {
          dot: {
            formula: '3d8',
            type: 'healing',
            duration: 10,
            interval: 'turn',
            aoe: true,
            targets: 'allies_in_radius'
          }
        },
        buff: {
          ac_bonus: 2,
          duration: 10,
          targets: 'allies_in_radius'
        },
        immunity: {
          type: 'fear',
          duration: 10,
          targets: 'allies_in_radius'
        }
      },

      specialMechanics: {
        voodooEssence: {
          cost: 8,
          specialization_discount: 2,
          description: 'Spirit Healers pay only 6 essence'
        },
        precursors: {
          required: ['2_allies_within_10ft', 'totem_of_healing_placed'],
          description: 'Requires 2 allies within 10ft and Totem of Healing on battlefield'
        },
        invocation: {
          type: 'loa',
          deity: 'Erzulie',
          cooldown: 'once_per_long_rest'
        }
      },

      tags: ['invocation', 'loa', 'healing', 'buff', 'protection', 'spirit-healer', 'ultimate'],
      flavorText: 'Erzulie descends in radiant beauty, her love a shield against all harm.'
    },

    // ===== WAR PRIEST SPECIALIZATION =====
    {
      id: 'wd_venomous_weapon',
      name: 'Venomous Weapon',
      description: 'Apply a potent poison to your weapon, adding poison damage to your attacks for 1 hour.',
      spellType: 'ACTION',
      icon: 'ability_rogue_dualweild',
      school: 'Transmutation',
      level: 2,
      specialization: 'war-priest',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      durationConfig: {
        durationType: 'hours',
        duration: 1
      },

      resourceCost: {
        mana: 3,
        components: ['verbal', 'somatic', 'material'],
        verbalText: 'Venom of the serpent, coat my blade!',
        somaticText: 'Anoint weapon with poison vial',
        materialText: 'Poison extract'
      },

      resolution: 'AUTOMATIC',

      damageConfig: {
        formula: '2d4',
        damageType: 'poison',
        scalingType: 'weapon_enhancement'
      },

      effects: {
        buff: {
          type: 'weapon_enhancement',
          damage_bonus: '2d4',
          damage_type: 'poison',
          duration: 60,
          description: 'Weapon deals additional poison damage'
        }
      },

      specialMechanics: {
        voodooEssence: {
          generates: 1,
          specialization_bonus: 1,
          description: 'Generates 1 essence (2 for War Priests)'
        },
        precursor: {
          enables: 'ogoun',
          description: 'Counts toward Ogoun invocation precursor'
        },
        poison: {
          type: 'weapon_coating',
          specialization_bonus: '+2d6 damage for War Priests'
        }
      },

      tags: ['poison', 'buff', 'weapon', 'war-priest', 'essence-generator', 'precursor'],
      flavorText: 'The serpent loa bless your weapon with deadly venom.'
    },

    {
      id: 'wd_poison_cloud',
      name: 'Poison Cloud',
      description: 'Create a toxic cloud that explodes in a 10-foot radius, dealing poison damage and poisoning enemies.',
      spellType: 'ACTION',
      icon: 'spell_nature_nullifypoison_02',
      school: 'Evocation',
      level: 3,
      specialization: 'war-priest',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 60,
        aoeType: 'circle',
        aoeSize: 10
      },

      durationConfig: {
        durationType: 'rounds',
        duration: 3
      },

      resourceCost: {
        mana: 5,
        components: ['verbal', 'somatic', 'material'],
        verbalText: 'Breathe deep the poison air!',
        somaticText: 'Throw poison grenade',
        materialText: 'Poison grenade'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '3d6',
        damageType: 'poison',
        scalingType: 'aoe'
      },

      effects: {
        damage: {
          instant: {
            formula: '3d6',
            type: 'poison',
            aoe: true
          }
        },
        debuff: {
          type: 'poisoned',
          duration: 3,
          savingThrow: 'Constitution',
          dc: 15
        }
      },

      specialMechanics: {
        voodooEssence: {
          generates: 1,
          description: 'Generates 1 Voodoo Essence'
        },
        precursor: {
          enables: 'ogoun',
          description: 'Counts toward Ogoun invocation precursor'
        }
      },

      tags: ['poison', 'damage', 'aoe', 'war-priest', 'essence-generator'],
      flavorText: 'Toxic fumes choke your enemies, the spirits of disease rejoicing.'
    },

    {
      id: 'wd_ogoun_invocation',
      name: 'Invoke Ogoun',
      description: 'Channel the power of Ogoun, god of war and iron. Imbue yourself and allies within 30 feet with fierce combat prowess.',
      spellType: 'ACTION',
      icon: 'ability_warrior_innerrage',
      school: 'Transmutation',
      level: 7,
      specialization: 'war-priest',

      typeConfig: {
        castTime: 1,
        castTimeType: 'ACTION'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self',
        aoeType: 'circle',
        aoeSize: 30
      },

      durationConfig: {
        durationType: 'rounds',
        duration: 10
      },

      resourceCost: {
        mana: 15,
        voodooEssence: 9,
        components: ['verbal', 'somatic', 'material'],
        verbalText: 'Ogoun, god of war, grant us your strength!',
        somaticText: 'Raise weapon to the sky',
        materialText: 'Machete and rum as offering'
      },

      resolution: 'AUTOMATIC',

      damageConfig: {
        formula: '2d6',
        damageType: 'fire',
        scalingType: 'weapon_enhancement'
      },

      effects: {
        buff: {
          attack_bonus: 2,
          damage_bonus: '2d6',
          damage_type: 'fire',
          duration: 10,
          targets: 'allies_in_radius'
        },
        resistance: {
          type: 'physical',
          duration: 10,
          targets: 'allies_in_radius'
        }
      },

      specialMechanics: {
        voodooEssence: {
          cost: 9,
          specialization_discount: 2,
          description: 'War Priests pay only 7 essence'
        },
        precursors: {
          required: ['poison_applied', '1_ally_in_combat_within_15ft'],
          description: 'Requires poison application and 1 ally in combat within 15ft'
        },
        invocation: {
          type: 'loa',
          deity: 'Ogoun',
          cooldown: 'once_per_long_rest'
        }
      },

      tags: ['invocation', 'loa', 'buff', 'fire', 'war-priest', 'ultimate'],
      flavorText: 'Ogoun arrives with the clash of steel, his war cry igniting the blood of warriors.'
    },

    // ===== ADDITIONAL UTILITY SPELLS (ALL SPECIALIZATIONS) =====
    {
      id: 'wd_simbi_invocation',
      name: 'Invoke Simbi',
      description: 'Channel the power of Simbi, spirit of healing and rivers. Summon a healing rain that falls over a 30-foot radius.',
      spellType: 'ACTION',
      icon: 'spell_nature_tranquility',
      school: 'Conjuration',
      level: 5,
      specialization: 'spirit-healer',

      typeConfig: {
        castTime: 1,
        castTimeType: 'ACTION'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 60,
        aoeType: 'circle',
        aoeSize: 30
      },

      durationConfig: {
        durationType: 'rounds',
        duration: 10
      },

      resourceCost: {
        mana: 10,
        voodooEssence: 6,
        components: ['verbal', 'somatic', 'material'],
        verbalText: 'Simbi, river spirit, wash away our pain!',
        somaticText: 'Pour water from sacred vessel',
        materialText: 'River water in ceremonial bowl'
      },

      resolution: 'AUTOMATIC',

      healingConfig: {
        formula: '4d6',
        healingType: 'aoe_allies',
        description: 'Heal all allies in 30ft radius'
      },

      effects: {
        healing: {
          instant: {
            formula: '4d6',
            type: 'healing',
            aoe: true,
            targets: 'allies_in_radius'
          }
        },
        cleanse: {
          removes: ['disease', 'poison'],
          targets: 'allies_in_radius',
          description: 'Cure all diseases and poisons'
        }
      },

      specialMechanics: {
        voodooEssence: {
          cost: 6,
          specialization_discount: 2,
          description: 'Spirit Healers pay only 4 essence'
        },
        precursors: {
          required: ['1_ally_below_50_percent_hp', 'ritual_of_cleansing'],
          description: 'Requires 1 ally below 50% HP and Ritual of Cleansing completion'
        },
        invocation: {
          type: 'loa',
          deity: 'Simbi',
          cooldown: 'once_per_long_rest'
        }
      },

      tags: ['invocation', 'loa', 'healing', 'cleanse', 'spirit-healer', 'ultimate'],
      flavorText: 'Simbi rises from the waters, her healing rain washing away all suffering.'
    },

    {
      id: 'wd_papa_legba_invocation',
      name: 'Invoke Papa Legba',
      description: 'Channel the power of Papa Legba, guardian of the crossroads. Grant telepathy and teleport allies across great distances.',
      spellType: 'ACTION',
      icon: 'spell_arcane_portalironforge',
      school: 'Conjuration',
      level: 6,
      specialization: 'war-priest',

      typeConfig: {
        castTime: 1,
        castTimeType: 'ACTION'
      },

      targetingConfig: {
        targetingType: 'special',
        rangeType: 'special',
        rangeDistance: 5280
      },

      durationConfig: {
        durationType: 'hours',
        duration: 1
      },

      resourceCost: {
        mana: 12,
        voodooEssence: 7,
        components: ['verbal', 'somatic', 'material'],
        verbalText: 'Papa Legba, open the way!',
        somaticText: 'Draw crossroads symbol with staff',
        materialText: 'Walking stick and tobacco as offering'
      },

      resolution: 'AUTOMATIC',

      effects: {
        telepathy: {
          duration: 60,
          range: 'unlimited',
          targets: 'all_allies',
          description: 'All allies can communicate telepathically'
        },
        teleportation: {
          targets: 5,
          range: 5280,
          condition: 'previously_seen_location',
          description: 'Teleport up to 5 allies to any location within 1 mile'
        }
      },

      specialMechanics: {
        voodooEssence: {
          cost: 7,
          specialization_discount: 2,
          description: 'War Priests pay only 5 essence'
        },
        precursors: {
          required: ['2_essence_from_rituals', 'within_30ft_of_cursed_enemy'],
          description: 'Requires 2+ essence from rituals and be within 30ft of cursed enemy'
        },
        invocation: {
          type: 'loa',
          deity: 'Papa Legba',
          cooldown: 'once_per_long_rest'
        }
      },

      tags: ['invocation', 'loa', 'teleportation', 'utility', 'war-priest', 'ultimate'],
      flavorText: 'Papa Legba opens the crossroads, his ancient wisdom guiding you through the spirit realm.'
    },

    {
      id: 'wd_hex_of_weakness',
      name: 'Hex of Weakness',
      description: 'Reduce the target\'s Strength and Dexterity, making them vulnerable to physical attacks.',
      spellType: 'ACTION',
      icon: 'spell_shadow_curseofachimonde',
      school: 'Necromancy',
      level: 2,
      specialization: 'shadow-priest',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 60
      },

      durationConfig: {
        durationType: 'rounds',
        duration: 10
      },

      resourceCost: {
        mana: 4,
        components: ['verbal', 'somatic'],
        verbalText: 'Weakness consume you!',
        somaticText: 'Point at target with cursed gesture'
      },

      resolution: 'DICE',

      effects: {
        debuff: {
          strength_reduction: '1d6',
          dexterity_reduction: '1d6',
          duration: 10,
          savingThrow: 'Constitution',
          dc: 14
        },
        curse: {
          type: 'weakness',
          duration: 10
        }
      },

      specialMechanics: {
        voodooEssence: {
          generates: 1,
          description: 'Generates 1 Voodoo Essence'
        },
        curse: {
          type: 'weakness',
          stackable: false,
          description: 'Counts toward Baron Samedi precursor'
        }
      },

      tags: ['curse', 'debuff', 'shadow-priest', 'essence-generator'],
      flavorText: 'Your strength drains away, stolen by the spirits of weakness.'
    },

    {
      id: 'wd_spirit_communion',
      name: 'Spirit Communion',
      description: 'Speak with spirits to gain insight about a location, object, or person. The spirits provide cryptic but useful information.',
      spellType: 'RITUAL',
      icon: 'spell_shadow_soulleech_3',
      school: 'Divination',
      level: 3,
      specialization: 'all',

      typeConfig: {
        castTime: 10,
        castTimeType: 'MINUTES'
      },

      targetingConfig: {
        targetingType: 'special',
        rangeType: 'self'
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 3,
        components: ['verbal', 'somatic', 'material'],
        verbalText: 'Spirits of the past, speak to me!',
        somaticText: 'Burn incense and meditate',
        materialText: 'Incense and spirit offerings'
      },

      resolution: 'AUTOMATIC',

      effects: {
        divination: {
          type: 'spirit_knowledge',
          questions: 3,
          accuracy: 'cryptic_but_truthful',
          description: 'Ask spirits 3 questions about location, object, or person'
        }
      },

      specialMechanics: {
        voodooEssence: {
          generates: 2,
          description: 'Generates 2 Voodoo Essence (ritual completion)'
        },
        ritual: {
          type: 'communion',
          interruptible: true,
          duration: 10
        }
      },

      tags: ['ritual', 'divination', 'utility', 'all-specs', 'essence-generator'],
      flavorText: 'The spirits whisper secrets from beyond the veil, their words cryptic but true.'
    },

    {
      id: 'wd_totem_of_courage',
      name: 'Totem of Courage',
      description: 'Place a totem that grants allies immunity to fear effects and a bonus to attack rolls.',
      spellType: 'ACTION',
      icon: 'spell_nature_stoneskintotem',
      school: 'Conjuration',
      level: 3,
      specialization: 'war-priest',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'ground',
        rangeType: 'ranged',
        rangeDistance: 30,
        aoeType: 'circle',
        aoeSize: 10
      },

      durationConfig: {
        durationType: 'rounds',
        duration: 10
      },

      resourceCost: {
        mana: 4,
        components: ['verbal', 'somatic', 'material'],
        verbalText: 'Spirits of war, embolden us!',
        somaticText: 'Plant war totem in ground',
        materialText: 'Carved war totem'
      },

      resolution: 'AUTOMATIC',

      effects: {
        buff: {
          attack_bonus: 1,
          duration: 10,
          aoe: true,
          targets: 'allies_in_radius'
        },
        immunity: {
          type: 'fear',
          duration: 10,
          aoe: true,
          targets: 'allies_in_radius'
        },
        summon: {
          type: 'totem',
          hp: 10,
          ac: 10,
          duration: 10
        }
      },

      specialMechanics: {
        voodooEssence: {
          generates: 1,
          description: 'Generates 1 Voodoo Essence'
        },
        totem: {
          type: 'courage',
          destructible: true
        }
      },

      tags: ['totem', 'buff', 'immunity', 'war-priest', 'essence-generator'],
      flavorText: 'The war spirits rally around the totem, their courage infectious.'
    }
  ]
};

