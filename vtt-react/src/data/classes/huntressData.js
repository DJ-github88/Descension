/**
 * Huntress Class Data
 * 
 * Complete class information for the Huntress - an agile melee combatant
 * who wields the Shadow Glaive and commands a loyal companion.
 */

export const HUNTRESS_DATA = {
  id: 'huntress',
  name: 'Huntress',
  icon: 'fas fa-moon',
  role: 'Damage',

  // Overview section
  overview: {
    title: 'The Huntress',
    subtitle: 'Shadow Glaive Wielder and Beastmaster',
    
    description: `The Huntress is a master of close-range combat who wields the legendary Shadow Glaive, a weapon capable of chaining deadly strikes between multiple enemies. Accompanied by a loyal beast companion, the Huntress excels at hit-and-run tactics, weaving through enemy lines with deadly grace. Through the Quarry Marks system, she tracks her prey and unleashes devastating coordinated attacks with her companion. This dynamic class rewards tactical positioning, resource management, and the synergy between hunter and beast.`,

    roleplayIdentity: {
      title: 'Roleplay Identity',
      content: `Huntresses are elite warriors who have bonded with a beast companion through ancient rituals. They often serve as scouts, trackers, or guardians of wild places, using their agility and their companion's instincts to protect their territory.

**Common Huntress Archetypes**:
- **The Sentinel**: A guardian of sacred groves who patrols with her companion, defending nature from intruders
- **The Tracker**: A relentless pursuer who marks her quarry and never stops until the hunt is complete
- **The Shadowblade**: An assassin who strikes from darkness, her glaive a blur of deadly precision
- **The Beastmaster**: A warrior whose bond with her companion transcends normal understanding, fighting as one entity
- **The Moonlight Warrior**: A nocturnal hunter who channels lunar energy through her glaive and companion

**Personality Traits**:
Huntresses are typically independent, patient, and fiercely loyal to their companions. They value freedom, respect nature's balance, and trust their instincts. Many prefer the company of beasts to people, finding honesty in the wild that civilization lacks.`
    },

    combatRole: {
      title: 'Combat Role',
      content: `**Primary Role**: Agile melee damage dealer with companion support

**Combat Strengths**:
- Exceptional multi-target damage through glaive chaining
- High mobility with Shadowstep and evasion abilities
- Companion provides additional damage, defense, or utility
- Strong burst damage when spending Quarry Marks
- Excellent at controlling enemy positioning

**Combat Weaknesses**:
- Requires enemies to be grouped for maximum glaive effectiveness
- Moderate armor (leather wearer)
- Companion can be targeted and killed
- Less effective at long range
- Dependent on Quarry Mark generation for peak performance

**Optimal Positioning**:
Huntresses excel at close range (5-15 feet), positioning themselves to maximize glaive chains between grouped enemies. They should maintain mobility, using Shadowstep to reposition and avoid being surrounded while keeping their companion in effective range.`
    },

    playstyle: {
      title: 'Playstyle & Strategy',
      content: `**Quarry Mark Management**:
The key to mastering the Huntress is generating and spending Quarry Marks efficiently. Generate marks through successful attacks, then spend them strategically:

- **1 Mark**: Enhance companion's next attack (+1d6 damage)
- **2 Marks**: Extend glaive chain by +1 target
- **3 Marks**: Companion special ability
- **5 Marks**: Specialization ultimate ability

**Companion Commands**:
Your companion is a crucial part of your combat effectiveness. Use commands wisely:
- **Attack**: When you need additional damage on priority targets
- **Defend**: When you or an ally needs protection (+2 AC)
- **Support**: For tactical advantages (buffs/debuffs)

**Glaive Positioning**:
Position yourself to maximize chain attacks. The Shadow Glaive chains to enemies within 5 feet of each other, so:
- Target enemies in tight groups
- Use mobility to position for optimal chains
- Coordinate with allies to group enemies (tanks, crowd control)

**Hit-and-Run Tactics**:
Don't stand still. Use Shadowstep and Evasion to:
- Strike quickly and reposition
- Avoid being surrounded
- Escape when focused
- Set up advantageous attack angles

**Team Dynamics**:
- Work with tanks to group enemies for glaive chains
- Coordinate companion attacks with team burst windows
- Use mobility to assist allies in trouble
- Mark priority targets for focused fire`
    },

    immersiveCombatExample: {
      title: 'Combat Example: The Shadow Glaive Dance',
      content: `**The Setup**: You're a Huntress (Shadowblade specialization) with your wolf companion "Fang" facing a group of bandits (5 bandits in a tight formation). Your party is with you. Starting Quarry Marks: 2 (from previous encounter). Your goal: Use glaive chaining to hit multiple enemies, generate Quarry Marks through successful attacks, and coordinate with your companion for devastating combos.

**Starting State**: Quarry Marks: 2/10 | HP: 70/70 | Companion (Fang): 50/50 HP

**Turn 1 - The Opening Chain (QM: 2 → 5)**

*Five bandits stand in a tight group, weapons drawn. You grip your Shadow Glaive—a crescent-bladed polearm that hums with dark energy. Fang growls beside you, ready to strike.*

**Your Action**: Shadow Glaive Attack on Bandit #1 (melee attack, chains to nearby enemies)
**Attack Roll**: d20+7 → [16] = Hit!
**Primary Target Damage**: 2d8+4 → [7, 6] + 4 = **17 damage** to Bandit #1

*Your glaive strikes Bandit #1, and the blade GLOWS. Shadow energy arcs from the impact point, seeking nearby targets.*

**Chain Mechanic**: Glaive chains to all enemies within 5 feet of primary target
**Enemies in Range**: Bandits #2, #3, #4 (all within 5 feet of Bandit #1)
**Chain Damage**: 1d8+4 to each chained target

**Chain Attack #1 (Bandit #2)**: 1d8+4 → [6] + 4 = **10 damage**
**Chain Attack #2 (Bandit #3)**: 1d8+4 → [7] + 4 = **11 damage**
**Chain Attack #3 (Bandit #4)**: 1d8+4 → [5] + 4 = **9 damage**

*The shadow energy EXPLODES outward, striking four bandits in one swing. They stagger, wounded.*

**Total Damage**: 17 + 10 + 11 + 9 = **47 damage across 4 targets!**
**Quarry Marks Generated**: +1 QM per successful hit = +4 QM (hit 4 enemies)
**Quarry Marks**: 2 + 4 = **6 QM** (but max is 10, so capped at 6)

*Wait, let me recalculate. You hit 1 primary target + 3 chained targets = 4 hits total. But Quarry Marks generate +1 per successful attack on marked enemies. Let me check the rules... Actually, you generate +1 QM per successful glaive attack, regardless of chains. So +1 QM total.*

**Correction**: **Quarry Marks Generated**: +1 QM (successful glaive attack)
**Quarry Marks**: 2 + 1 = **3 QM**

**Companion's Turn (Fang)**: Attack Bandit #1 (commanded to attack)
**Attack Roll**: d20+5 → [14] = Hit!
**Damage**: 1d8+3 → [6] + 3 = **9 damage**
**Result**: Bandit #1 takes 17 + 9 = 26 total damage, DEAD

*Fang leaps forward, jaws clamping down on Bandit #1's throat. The bandit falls.*

**Current State**: QM: 3/10 | 4 bandits remaining (all wounded)

**Turn 2 - Spending Quarry Marks (QM: 3 → 1)**

*The bandits regroup. Bandit #5 (who wasn't in the chain range) charges you. Time to use Quarry Marks.*

**Bandit #5's Turn**: Attacks you → [17] → Hit! → 2d6+3 → [5, 4] + 3 = 12 damage
**Your HP**: 70 - 12 = 58/70

**Your Action**: Spend 2 Quarry Marks to extend glaive chain by +1 target
**Quarry Marks**: 3 - 2 = **1 QM**

*You focus your will. The Shadow Glaive pulses with darker energy. This next strike will chain further.*

**Your Action**: Shadow Glaive Attack on Bandit #2
**Attack Roll**: d20+7 → [18] = Hit!
**Primary Target Damage**: 2d8+4 → [8, 7] + 4 = **19 damage** to Bandit #2

**Chain Mechanic**: Normally chains to enemies within 5 feet, but you spent 2 QM for +1 target
**Enemies in Range**: Bandits #3, #4, #5 (3 enemies)
**Extended Chain**: Can hit 3 + 1 = **4 targets total** (but only 3 enemies in range, so hits all 3)

**Chain Attack #1 (Bandit #3)**: 1d8+4 → [6] + 4 = **10 damage** → Bandit #3 DEAD (was already wounded)
**Chain Attack #2 (Bandit #4)**: 1d8+4 → [8] + 4 = **12 damage** → Bandit #4 DEAD (was already wounded)
**Chain Attack #3 (Bandit #5)**: 1d8+4 → [5] + 4 = **9 damage**

*The glaive chains to THREE enemies this time, killing two of them. Only Bandits #2 and #5 remain.*

**Quarry Marks Generated**: +1 QM (successful attack)
**Quarry Marks**: 1 + 1 = **2 QM**

**Companion's Turn (Fang)**: You command Fang to Defend you (+2 AC for 1 round)
*Fang positions himself protectively in front of you, snarling at the remaining bandits.*

**Current State**: QM: 2/10 | 2 bandits remaining | Your AC: 16 → 18 (Fang defending)

**Turn 3 - Companion Empowerment (QM: 2 → 0 → 1)**

*Two bandits left. Bandit #2 is wounded (19 damage taken), Bandit #5 is wounded (9 damage taken). Time to finish this.*

**Your Action**: Spend 1 Quarry Mark to enhance Fang's next attack (+1d6 damage)
**Quarry Marks**: 2 - 1 = **1 QM**

**Your Action**: Command Fang to attack Bandit #2
**Fang's Attack Roll**: d20+5 → [16] = Hit!
**Damage**: 1d8+3 + 1d6 (QM bonus) → [7] + 3 + [5] = **15 damage**
**Result**: Bandit #2 DEAD

*Fang's jaws glow with shadow energy as he tears into Bandit #2. The bandit falls.*

**Your Action**: Shadow Glaive Attack on Bandit #5 (last enemy)
**Attack Roll**: d20+7 → [19] = Hit!
**Damage**: 2d8+4 → [8, 6] + 4 = **18 damage**
**Result**: Bandit #5 DEAD

*Your glaive sweeps through the last bandit. He falls. Combat over.*

**Quarry Marks Generated**: +1 QM (successful attack)
**Quarry Marks**: 1 + 1 = **2 QM** (banked for next fight)

**Combat Over**

*You stand among five corpses, your Shadow Glaive still humming with dark energy. Fang sits beside you, blood on his muzzle. Your party stares.*

**Your Party's Mage**: "You... you killed four of them in one swing."
**You**: "Shadow Glaive chains to nearby enemies. The closer they stand, the more they die together."
**Your Party's Tank**: "And your wolf just... knew when to defend you?"
**You**: "Fang and I are bonded. I command, he obeys. But we fight as one."
**Fang**: *Growls in agreement*

**Final State**: QM: 2/10 (banked) | HP: 58/70 | Fang: 50/50 HP

**The Lesson**: Huntress gameplay is about:
1. **Glaive Chaining**: Hit 1 primary target, chain to 3 nearby enemies = 4 hits in one attack (47 damage total in Turn 1)
2. **Quarry Mark Generation**: +1 QM per successful glaive attack (not per chained enemy)
3. **Quarry Mark Spending**: Spent 2 QM to extend chain by +1 target (Turn 2), spent 1 QM to enhance Fang's attack (Turn 3)
4. **Companion Commands**: Commanded Fang to Attack (Turn 1, 3) and Defend (Turn 2)
5. **Positioning**: Enemies grouped together = maximum chain effectiveness
6. **Burst Damage**: Turn 1 dealt 47 damage across 4 targets, Turn 2 dealt 50 damage across 4 targets (killed 2)
7. **Resource Banking**: Ended with 2 QM banked for next fight

You're not a single-target damage dealer. You're a CHAIN ATTACKER. When enemies group up, your Shadow Glaive becomes a weapon of mass destruction. One swing, four hits. And with Quarry Marks, you can extend chains even further, empower your companion, or unleash ultimate abilities. The key is positioning—get enemies close together, then watch the shadow energy arc between them. And Fang isn't just a pet—he's a tactical asset. Attack when you need damage, Defend when you need protection, Support when you need utility. Together, you're unstoppable.`
    }
  },
  
  // Resource System
  resourceSystem: {
    title: 'Quarry Marks',
    subtitle: 'Hunter\'s Tracking System',

    description: `The Huntress marks her prey through successful attacks, building up Quarry Marks that can be spent to enhance her abilities and empower her companion. This resource system rewards aggressive play and tactical decision-making, allowing the Huntress to choose between sustained damage or powerful burst abilities.`,

    resourceBarExplanation: {
      title: 'Understanding Your Quarry Marks Gauge',
      content: `**What You See**: Your Quarry Marks gauge displays as 10 glowing hunter's marks arranged horizontally, each representing 1 Quarry Mark. The marks appear as stylized crosshair symbols that glow with silver-blue moonlight energy. As you mark your prey through successful attacks, the symbols fill and pulse with power.

**Visual Representation by Quarry Mark Level**:

**0 Quarry Marks (No Marks)**:
- Marks: All 10 symbols empty, dim gray outlines
- Border: Gray (neutral)
- Status: "No Quarry Marks"
- Companion Icon: Normal (no enhancements available)
- Ability Buttons: All grayed out (need marks to activate)

**1-2 Quarry Marks (Low Reserve)**:
- Marks: 1-2 symbols filled with silver-blue glow
- Border: White (building)
- Status: "Building Marks"
- Companion Icon: Slight glow (Empowered Strike available at 1 mark)
- Ability Buttons: "Empowered Strike (1 QM)" glowing, others grayed out
- Visual Effect: Faint moonlight particles around filled marks

**3-4 Quarry Marks (Moderate Reserve)**:
- Marks: 3-4 symbols filled, brighter glow
- Border: Blue (moderate)
- Status: "Moderate Marks"
- Companion Icon: Glowing (Companion Special available at 3 marks)
- Ability Buttons: "Empowered Strike (1 QM)", "Extended Chain (2 QM)", "Companion Special (3 QM)" all glowing
- Visual Effect: Moonlight particles swirl around marks, connecting them with silver lines

**5-7 Quarry Marks (High Reserve)**:
- Marks: 5-7 symbols filled, intense silver-blue glow
- Border: Green (good)
- Status: "High Marks - Ultimate Available"
- Companion Icon: Brightly glowing with moonlight aura
- Ability Buttons: ALL abilities available including "Ultimate Ability (5 QM)"
- Visual Effect: Marks pulse in sequence, moonlight energy flows between them
- Special Indicator: "ULTIMATE READY" text appears

**8-10 Quarry Marks (Maximum Reserve)**:
- Marks: 8-10 symbols filled, maximum brightness
- Border: Gold (excellent)
- Status: "MAXIMUM MARKS"
- Companion Icon: Pulsing with maximum power
- Ability Buttons: All glowing, ultimate ability pulsing
- Visual Effect: All marks connected by glowing silver lines forming a hunter's constellation pattern
- Special Text: "APEX PREDATOR MODE"

**Quarry Mark Generation Animation**:
When you generate Quarry Marks:
- **+1 QM (Successful Hit)**: Silver crosshair appears on enemy, flies to your bar, fills 1 mark symbol with glow
- **+1 QM (Companion Hit)**: Companion's paw print appears on enemy, flies to bar, fills 1 mark
- **+2 QM (Critical Hit)**: Two crosshairs appear with golden flash, fly to bar, fill 2 marks with dramatic animation
- **Audio**: Bow string twang sound for +1 QM, louder twang + chime for +2 QM
- **Text Popup**: "+1 Quarry Mark (Glaive Hit)" or "+2 QM (CRITICAL!)"

**Quarry Mark Spending Animation**:
When you spend Quarry Marks:
- **1 QM (Empowered Strike)**: 1 mark drains, energy flows to companion icon, companion glows
- **2 QM (Extended Chain)**: 2 marks drain, energy flows to glaive weapon icon, glaive glows with extended range indicator
- **3 QM (Companion Special)**: 3 marks drain, energy BURSTS to companion, special ability animation plays
- **5 QM (Ultimate)**: 5 marks drain in sequence, massive energy burst, ultimate ability activates
- **Audio**: Spending sound (marks draining), ability-specific sound effect
- **Text Popup**: "-2 Quarry Marks (Extended Chain)" or "-5 QM (ULTIMATE ACTIVATED)"

**Companion Integration**:
Your companion's portrait appears next to the Quarry Marks bar:
- **Companion Portrait**: Shows your companion (wolf, owl, panther, etc.) with current HP bar
- **Companion Status**: "Fang (Wolf) - 50/50 HP - Ready"
- **Command Buttons**: "Attack", "Defend", "Support" buttons below portrait
- **Enhancement Indicator**: When you spend QM on companion, portrait glows with corresponding effect
  * 1 QM spent: "+1d6 damage" icon appears on portrait
  * 3 QM spent: Special ability icon appears (stun, heal, buff, etc.)

**Glaive Chain Indicator**:
When you have 2+ Quarry Marks (can extend chain):
- **Chain Preview**: Dotted lines appear connecting you to enemies within chain range
- **Extended Chain Preview**: If you spend 2 QM, preview shows +1 additional target highlighted
- **Example**: Normally chains to 3 enemies (shown with blue lines), spending 2 QM shows 4th enemy highlighted in gold

**Ability Cost Display**:
Below the Quarry Marks bar, ability buttons show:
- **Empowered Strike (1 QM)**: Small icon, glows when you have 1+ QM
- **Extended Chain (2 QM)**: Medium icon, glows when you have 2+ QM
- **Companion Special (3 QM)**: Large icon, glows when you have 3+ QM
- **Ultimate Ability (5 QM)**: HUGE icon, glows when you have 5+ QM, labeled "ULTIMATE"

**Persistence Indicator**:
- **Between Combats**: Quarry Marks bar shows "Banked: 4/10 QM - Persists to next combat"
- **Visual**: Marks have a "locked" icon indicating they won't decay
- **Strategic Info**: "Quarry Marks persist between combats - save for boss fights"

**Companion Command Interface**:
When you command your companion:
- **Attack Command**: Companion portrait flashes red, attack animation plays, target gets crosshair
- **Defend Command**: Companion portrait flashes blue, shield icon appears on you (+2 AC displayed)
- **Support Command**: Companion portrait flashes green, buff/debuff icons appear on targets

**Critical Hit Feedback**:
When you score a critical hit:
- **Screen Flash**: Brief silver flash
- **Mark Generation**: Two marks fill simultaneously with golden glow
- **Audio**: Dramatic critical hit sound + double chime
- **Text**: "CRITICAL HIT! +2 Quarry Marks!"
- **Companion Reaction**: Companion portrait shows excited animation (wolf howls, owl screeches, etc.)

**Why This Matters**: The Quarry Marks gauge isn't just a resource bar—it's a HUNT TRACKER. When you hit an enemy with your Shadow Glaive, you see a silver crosshair appear on them, fly to your bar, and fill a mark symbol. You're literally MARKING your quarry. When you have 5 marks and the "ULTIMATE READY" text appears, you KNOW you can unleash your specialization's ultimate ability. The companion integration makes Fang (or your chosen companion) feel like a true partner—when you spend 1 QM to empower his attack, you see the energy flow from your marks to his portrait, and his next attack glows with bonus damage. The chain preview shows you exactly which enemies will be hit, and spending 2 QM to extend the chain shows the additional target highlighted in gold. Every mark generated, every mark spent, every companion command—it all has visual feedback that makes you feel like a master hunter coordinating with your beast companion to take down your prey.`
    },

    mechanics: {
      title: 'How It Works',
      content: `**Generating Quarry Marks**:
- **Successful Hit**: Gain 1 mark when you hit an enemy with Shadow Glaive
- **Companion Hit**: Gain 1 mark when your companion hits an enemy
- **Critical Hit**: Gain 2 marks when you score a critical hit
- **Maximum Capacity**: You can hold up to 5 Quarry Marks at once
- **Persistence**: Marks persist between combats until spent

**Spending Quarry Marks**:
- **1 Mark - Empowered Strike**: Your companion's next attack deals +1d6 damage
- **2 Marks - Extended Chain**: Your next Shadow Glaive attack chains to +1 additional target
- **3 Marks - Companion Special**: Your companion performs a powerful special ability
- **5 Marks - Ultimate Ability**: Unleash your specialization's ultimate ability

**Mark Tracking**:
Your current Quarry Marks are displayed on your character sheet as glowing marks (0-5). Marks are consumed when you activate abilities that require them.

**Strategic Considerations**:
- Save marks for burst damage windows
- Spend marks to extend chains when enemies are grouped
- Use companion specials for crowd control or emergency defense
- Build to 5 marks for ultimate abilities in critical moments`
    },

    resourceTables: [
      {
        title: 'Quarry Mark Generation',
        headers: ['Action', 'Marks Gained', 'Notes'],
        rows: [
          ['Shadow Glaive Hit', '1 mark', 'Each successful hit generates 1 mark'],
          ['Companion Attack Hit', '1 mark', 'Companion attacks also generate marks'],
          ['Critical Hit (Glaive)', '2 marks', 'Critical hits generate double marks'],
          ['Critical Hit (Companion)', '2 marks', 'Companion crits also generate double'],
          ['Mark Quarry Ability', '1 mark', 'Special ability to generate mark without attacking']
        ]
      },
      {
        title: 'Quarry Mark Expenditure',
        headers: ['Cost', 'Effect', 'Use Case'],
        rows: [
          ['1 Mark', 'Companion +1d6 damage', 'Boost companion damage on priority target'],
          ['2 Marks', 'Glaive chains +1 target', 'Maximize multi-target damage'],
          ['3 Marks', 'Companion special ability', 'Crowd control, defense, or utility'],
          ['5 Marks', 'Specialization ultimate', 'Massive burst damage or game-changing effect']
        ]
      },
      {
        title: 'Companion Types & Base Stats',
        headers: ['Companion', 'HP', 'AC', 'Attack', 'Special Trait'],
        rows: [
          ['Shadow Wolf', '30 + (5 × level)', '14 + Dex mod', '1d8 + Str mod', 'Pack Tactics: Advantage when ally adjacent'],
          ['Moonlight Owl', '25 + (4 × level)', '15 + Dex mod', '1d6 + Dex mod', 'Flyby: No opportunity attacks when flying away'],
          ['Thornback Panther', '35 + (6 × level)', '13 + Dex mod', '1d8 + Str mod', 'Guardian: Can intercept attacks on Huntress']
        ]
      }
    ],

    keyAbilities: {
      title: 'Key Companion Commands',
      abilities: [
        {
          name: 'Attack Command',
          cost: '1 AP',
          type: 'Command',
          description: 'Command your companion to attack a target within 30 feet. Companion deals 1d8 + your proficiency bonus damage. Generates 1 Quarry Mark on hit.'
        },
        {
          name: 'Defend Command',
          cost: '1 AP',
          type: 'Command',
          description: 'Command your companion to defend you or an ally within 10 feet. Target gains +2 AC until the start of your next turn.'
        },
        {
          name: 'Support Command',
          cost: '1 AP',
          type: 'Command',
          description: 'Command your companion to provide tactical support. Choose one: Grant ally +1 to attack rolls, impose -1 to enemy attack rolls, or grant ally +10 feet movement speed. Lasts 1 round.'
        },
        {
          name: 'Recall Companion',
          cost: '1 AP',
          type: 'Utility',
          description: 'If your companion is more than 30 feet away or incapacitated, you can recall them to your side. Companion appears adjacent to you and is no longer incapacitated.'
        }
      ]
    },

    strategicTips: {
      title: 'Strategic Tips',
      content: `**Early Combat (Rounds 1-3)**:
Focus on generating Quarry Marks through aggressive attacks. Use companion Attack commands to build marks quickly. Position for glaive chains.

**Mid Combat (Rounds 4-6)**:
Start spending marks strategically. Use 2-mark Extended Chain when enemies are grouped. Save 3-mark Companion Specials for crowd control or emergency defense.

**Late Combat (Rounds 7+)**:
Build to 5 marks for ultimate abilities to finish off tough enemies or turn the tide of battle. Use companion Defend commands to protect low-health allies.

**Companion Management**:
- Keep companion within 30 feet for commands
- Use Defend when companion is low on HP
- Recall companion if they're in danger
- Position companion for Pack Tactics (Shadow Wolf) or intercepts (Thornback Panther)

**Mark Economy**:
- Don't hoard marks - spend them regularly
- 2-mark Extended Chains are very efficient for AoE damage
- Save 5-mark ultimates for boss fights or critical moments
- Use 1-mark Empowered Strikes to finish off low-health enemies`
    },

    playingInPerson: {
      title: 'Playing in Person',
      subtitle: 'Physical Tracking for Tabletop Play',
      content: `The Huntress's Quarry Marks system (0-10 marks) and companion tracking create a dynamic hunter-and-beast in-person experience. Here's how to track your marks and companion at the table:

**Required Materials**:
- **10 tokens or beads** (silver/blue for Quarry Marks)
- **Companion miniature or token**
- **Companion HP tracker** (die or paper)
- **Quarry Mark reference card** with spending options

**Quarry Mark Tracking**:

**The Token Method** (Recommended):

Use physical tokens to represent Quarry Marks (0-10):
- **Starting State**: Begin with 0 marks (or carry over from previous combat)
- **Generating Marks**: Add tokens when you hit enemies
  - Normal attack (hit) → +1 mark (add 1 token)
  - Glaive chain (hit multiple) → +1 mark per enemy hit
  - Companion attack (hit) → +1 mark
  - Critical hit → +2 marks (add 2 tokens)
- **Spending Marks**: Remove tokens when using abilities
  - Empowered Strike (1 mark) → Remove 1 token
  - Extended Chain (2 marks) → Remove 2 tokens
  - Companion Special (3 marks) → Remove 3 tokens
  - Ultimate Ability (5 marks) → Remove 5 tokens

**Companion Tracking**:

**The Miniature Method** (Recommended):

Use a companion miniature or token on the battle map:
- **Companion HP**: Track with a die or paper (starts at 50 HP)
- **Companion Position**: Place mini within 30 ft of you
- **Companion Commands**: Announce commands each turn
  - Attack: "Fang, attack the orc!"
  - Defend: "Fang, defend me!" (+2 AC)
  - Support: "Fang, grant me +1 attack!"

**Companion Reference Card**:
\`\`\`
COMPANION: [Name] (Wolf/Panther/Bear)
━━━━━━━━━━━━━━━━━━━━━━━━━━
HP: 50/50
AC: 14
Speed: 40 ft

COMMANDS (1 AP each):
• Attack: 1d8 + proficiency damage, +1 QM on hit
• Defend: Target gains +2 AC (1 round)
• Support: +1 attack OR -1 enemy attack OR +10 ft move
• Recall: Teleport companion to your side

PASSIVE:
• Must stay within 30 ft for commands
• Can be targeted by enemies
• Generates Quarry Marks on successful attacks
━━━━━━━━━━━━━━━━━━━━━━━━━━
\`\`\`

**Quarry Mark Spending Reference**:
\`\`\`
QUARRY MARK ABILITIES

1 MARK - Empowered Strike
Companion's next attack deals +1d6 damage

2 MARKS - Extended Chain
Glaive chains to +1 additional target

3 MARKS - Companion Special
Wolf: Knockdown (prone)
Panther: Bleed (1d6/turn)
Bear: Roar (frighten)

5 MARKS - Ultimate Ability
Spec-dependent massive ability
\`\`\`

**Example In-Person Turn**:

*You have 3 Quarry Marks, Companion (Fang) at 40/50 HP*

**Turn 1 - Generate Marks**:
1. "I attack the goblin with my glaive!"
2. Roll to hit → Hit!
3. Add 1 Quarry Mark token: 3 + 1 = 4 marks
4. "Fang, attack the goblin!"
5. Roll companion attack → Hit! (1d8 damage)
6. Add 1 Quarry Mark token: 4 + 1 = 5 marks

**Turn 2 - Spend Marks (Ultimate)**:
1. "I have 5 marks! I use my ultimate ability!"
2. Remove 5 tokens: 5 - 5 = 0 marks
3. Execute ultimate (spec-dependent)
4. "Fang, defend me!" (+2 AC for 1 round)

**Turn 3 - Rebuild Marks**:
1. "I attack the orc!"
2. Roll to hit → Hit!
3. Add 1 token: 0 + 1 = 1 mark
4. Glaive chains to adjacent goblin → Hit!
5. Add 1 token: 1 + 1 = 2 marks

**Glaive Chain Tracking**:

When your glaive chains between enemies:
1. Attack primary target → Roll to hit
2. If hit, glaive chains to enemies within 5 ft of primary
3. Roll separate attack for each chained target
4. Add +1 Quarry Mark per enemy hit

**Example**:
- Attack orc (3 goblins within 5 ft of orc)
- Orc: Hit! (+1 mark)
- Goblin 1: Hit! (+1 mark)
- Goblin 2: Miss (no mark)
- Goblin 3: Hit! (+1 mark)
- Total: +3 Quarry Marks from one attack!

**Quick Reference Card**:
\`\`\`
HUNTRESS QUICK REFERENCE

QUARRY MARKS:
• Maximum: 10 marks
• Generate: +1 per hit, +2 per crit
• Glaive chains: +1 per enemy hit
• Companion attacks: +1 per hit

SPENDING:
1 Mark: Empowered Strike (+1d6 companion dmg)
2 Marks: Extended Chain (+1 target)
3 Marks: Companion Special (knockdown/bleed/frighten)
5 Marks: Ultimate Ability (spec-dependent)

COMPANION:
• HP: 50 | AC: 14 | Speed: 40 ft
• Must stay within 30 ft
• Commands cost 1 AP each
• Generates marks on hit
\`\`\`

**Thematic Enhancements**:

Many players enhance the huntress experience with:
- **Companion Mini**: Use a wolf/panther/bear miniature
- **Silver Tokens**: Use silver/blue beads for Quarry Marks
- **Companion Card**: Laminated card with companion stats
- **Mark Tracker**: Use a d10 die or tokens
- **Glaive Prop**: Keep a small glaive prop on the table

**Example Full Combat Sequence**:

*Starting: 2 Quarry Marks, Companion at 50/50 HP*

**Round 1**: Attack (hit) → +1 mark = 3 marks | Companion attack (hit) → +1 mark = 4 marks
**Round 2**: Attack (chains to 2 enemies, both hit) → +2 marks = 6 marks
**Round 3**: Spend 2 marks (Extended Chain) → 4 marks | Attack chains to 3 enemies
**Round 4**: Spend 3 marks (Companion Special) → 1 mark | Fang knocks enemy prone
**Round 5**: Attack (crit!) → +2 marks = 3 marks
**Round 6**: Attack (hit) → +1 mark = 4 marks | Companion attack (hit) → +1 mark = 5 marks
**Round 7**: Spend 5 marks (Ultimate) → 0 marks | Massive damage!

**Visual Organization**:

**Your Play Area**:
\`\`\`
[Quarry Mark Tokens]    [Companion Card]
○○○○○○ (6 marks)        FANG (Wolf)
                        HP: 40/50

[Battle Map]
(Your mini + Fang mini within 30 ft)
\`\`\`

**Companion HP Tracking**:

Use a die or paper to track companion HP:
- **d20 Method**: Set die to current HP (if HP ≤ 20)
- **d10 Method**: Use 2d10 (tens + ones) for HP up to 100
- **Paper Method**: Write HP, update as needed

**Specialization-Specific Tracking**:

**Shadowblade**:
- Glaive chains deal +1d6 damage per chain
- Note on reference card: "Chain damage +1d6"

**Beastmaster**:
- Companion has +20 HP (70 HP instead of 50)
- Companion Special costs 2 marks (not 3)
- Update companion card accordingly

**Moonlight Warrior**:
- Attacks during night/darkness generate +1 mark
- Note: "Night attacks: +2 marks total"

**Why This System Works**: The physical act of adding Quarry Mark tokens after successful attacks creates MOMENTUM. You can SEE your marks building, FEEL the decision of when to spend them, and EXPERIENCE the satisfaction of unleashing a 5-mark ultimate. The companion miniature on the battle map makes your beast partner tangible, and commanding them each turn creates a sense of teamwork. The glaive chain mechanic—rolling multiple attacks and adding multiple marks—creates exciting multi-target moments.

**Pro Tips**:
- **Mark Banking**: Keep 3-5 marks banked for emergency abilities
- **Companion Positioning**: Keep companion within 30 ft for commands
- **Chain Setup**: Position for maximum glaive chains (grouped enemies)
- **Ultimate Timing**: Save 5-mark ultimates for bosses or critical moments
- **Companion Defense**: Use Defend command when companion is low HP

**Budget-Friendly Alternatives**:
- **No tokens?** Use a d10 die to track Quarry Marks
- **No companion mini?** Use a coin or token
- **No cards?** Write companion stats and mark abilities on paper
- **Minimalist**: Track marks and companion HP on paper

**Why Huntress Is Perfect for In-Person Play**: The class is built around building Quarry Marks through successful attacks and commanding a loyal companion. The physical components (mark tokens, companion miniature) make the hunter-and-beast partnership tangible. Adding tokens after each hit creates satisfying feedback, and the companion mini on the map makes your beast partner feel real. The glaive chain mechanic creates exciting moments when you hit multiple enemies and generate multiple marks at once. Every combat is a hunt—marking prey, coordinating with your companion, and unleashing devastating abilities when the moment is right.`
    }
  },
  
  // Specializations
  specializations: {
    title: 'Huntress Specializations',
    subtitle: 'Three Paths of the Hunt',
    
    description: `Every Huntress chooses one of three specializations that define their combat style. Each specialization emphasizes different aspects of glaive combat, companion synergy, or mobility, offering unique passive abilities and playstyles.`,
    
    sharedPassive: {
      name: 'Hunter\'s Instinct',
      icon: 'ability_hunter_mastermarksman',
      description: 'You have advantage on Perception and Survival checks. Additionally, you and your companion can communicate telepathically within 100 feet.'
    },

    specs: [
      {
        id: 'bladestorm',
        name: 'Bladestorm',
        icon: 'ability_rogue_fanofknives',
        color: '#DC143C',
        theme: 'Multi-Target Devastation',
        
        description: `The Bladestorm specialization focuses on maximizing the Shadow Glaive's chain attack potential. These Huntresses are masters of positioning and timing, able to strike multiple enemies in a single fluid motion. They excel in situations where enemies are grouped together, turning their glaive into a whirlwind of death.`,
        
        playstyle: 'Aggressive multi-target damage dealer, positioning for maximum chain attacks and area control',
        
        strengths: [
          'Highest multi-target damage among Huntress specs',
          'Can chain to 5 targets instead of 4 (with passive)',
          'Momentum-based damage scaling',
          'Excellent against grouped enemies'
        ],
        
        weaknesses: [
          'Less effective against spread-out enemies',
          'Lower single-target damage than Shadowdancer',
          'Requires careful positioning',
          'Companion plays secondary role'
        ],
        
        passiveAbilities: [
          {
            name: 'Whirling Blades',
            icon: 'ability_rogue_slicedice',
            description: 'Your Shadow Glaive can chain to +1 additional target (total of 5 targets: 1d8 → 1d6 → 1d4 → 1d2 → 1d2). This does not cost Quarry Marks.'
          },
          {
            name: 'Momentum',
            icon: 'ability_warrior_intensifyrage',
            description: 'Each successful chain attack grants you +1 to your next attack roll. This bonus stacks up to +3 and resets if you miss an attack.'
          }
        ],
        
        recommendedSpells: [
          'Glaive Toss - Your bread-and-butter chain attack',
          'Whirling Death - Spin attack for maximum AoE',
          'Blade Fury - Ultimate ability for massive multi-target burst',
          'Swift Assault - Rapid strikes to build Momentum'
        ]
      },
      {
        id: 'beastmaster',
        name: 'Beastmaster',
        icon: 'ability_hunter_beastcall',
        color: '#228B22',
        theme: 'Companion Synergy',
        
        description: `The Beastmaster specialization deepens the bond between Huntress and companion, creating a fighting duo that operates as a single deadly unit. These Huntresses coordinate their attacks perfectly with their beasts, overwhelming enemies through synchronized strikes and tactical positioning.`,
        
        playstyle: 'Coordinated attacks with companion, tactical positioning for Pack Tactics, balanced damage distribution',
        
        strengths: [
          'Strongest companion damage and utility',
          'Pack Tactics provides consistent advantage',
          'Companion has enhanced survivability',
          'Excellent single-target focus fire'
        ],
        
        weaknesses: [
          'Heavily reliant on companion staying alive',
          'Lower personal damage than other specs',
          'Requires positioning both Huntress and companion',
          'Vulnerable if companion is killed'
        ],
        
        passiveAbilities: [
          {
            name: 'Primal Bond',
            icon: 'ability_druid_primalprecision',
            description: 'Your companion deals +1d4 damage on all attacks. Additionally, your companion\'s maximum HP is increased by 50%.'
          },
          {
            name: 'Pack Tactics',
            icon: 'ability_hunter_aspectoftheviper',
            description: 'When you and your companion attack the same target, both of you gain advantage on attack rolls against that target until the end of your turn.'
          }
        ],
        
        recommendedSpells: [
          'Companion Strike - Enhanced companion attack',
          'Coordinated Assault - Simultaneous attacks with advantage',
          'Primal Rage - Companion ultimate ability',
          'Mark Quarry - Build marks for companion empowerment'
        ]
      },
      {
        id: 'shadowdancer',
        name: 'Shadowdancer',
        icon: 'ability_rogue_shadowdance',
        color: '#4B0082',
        theme: 'Stealth & Mobility',
        
        description: `The Shadowdancer specialization embraces the shadows, using stealth and mobility to strike from unexpected angles. These Huntresses are assassins who blend hit-and-run tactics with devastating burst damage, appearing from nowhere to eliminate priority targets before vanishing back into darkness.`,
        
        playstyle: 'High mobility assassin, stealth attacks, burst damage, hit-and-run tactics',
        
        strengths: [
          'Highest single-target burst damage',
          'Exceptional mobility with enhanced Shadowstep',
          'Stealth attacks deal massive damage',
          'Superior survivability through evasion'
        ],
        
        weaknesses: [
          'Lower sustained damage than Bladestorm',
          'Requires stealth setup for maximum damage',
          'Less effective in prolonged fights',
          'Companion plays support role'
        ],
        
        passiveAbilities: [
          {
            name: 'Shadow Veil',
            icon: 'ability_stealth',
            description: 'After using Shadowstep, you gain +2 AC and advantage on Stealth checks for 1 round. You can hide for 1 AP during this time.'
          },
          {
            name: 'Lethal Precision',
            icon: 'ability_rogue_deadlybrew',
            description: 'Attacks made from stealth or immediately after using Shadowstep deal an additional 2d6 damage. This bonus applies to both glaive and companion attacks.'
          }
        ],
        
        recommendedSpells: [
          'Shadowstep - Core mobility and damage amplifier',
          'Shadow Strike - Massive stealth attack',
          'Phantom Blades - Ultimate multi-attack ability',
          'Evasion - Defensive survival tool'
        ]
      }
    ]
  },
  
  // Example Abilities - showcasing Shadow Glaive and Companion mechanics
  exampleSpells: [
    // BLADESTORM - Multi-Target Glaive Attacks
    {
      id: 'huntress_glaive_toss',
      name: 'Glaive Toss',
      description: 'Throw your Shadow Glaive at a target, chaining to additional enemies within 5 feet of each other.',
      spellType: 'ACTION',
      icon: 'ability_rogue_fanofknives',
      school: 'Physical',
      level: 1,
      specialization: 'bladestorm',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'chain',
        rangeType: 'melee',
        rangeDistance: 15,
        chainDistance: 5,
        maxChains: 4
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        actionPoints: 1,
        components: ['somatic'],
        somaticText: 'Throw glaive in spinning arc'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '1d8',
        damageType: 'slashing',
        scalingType: 'chain_reduction'
      },

      effects: {
        damage: {
          chain: {
            primary: '1d8',
            second: '1d6',
            third: '1d4',
            fourth: '1d2',
            type: 'slashing',
            chainDistance: 5
          }
        }
      },

      specialMechanics: {
        quarryMarks: {
          generated: 1,
          perHit: true,
          description: 'Generate 1 Quarry Mark for each enemy hit'
        },
        chainMechanic: {
          description: 'Chains to enemies within 5 feet of previous target',
          maxTargets: 4,
          damageReduction: 'Each chain deals less damage (1d8 → 1d6 → 1d4 → 1d2)'
        },
        bladestormPassive: {
          description: 'Bladestorm spec can chain to 5 targets (adds 1d2 fifth target)'
        }
      },

      tags: ['physical', 'damage', 'chain', 'multi-target', 'bladestorm']
    },

    {
      id: 'huntress_whirling_death',
      name: 'Whirling Death',
      description: 'Spin your Shadow Glaive in a deadly circle, striking all enemies within 10 feet.',
      spellType: 'ACTION',
      icon: 'ability_rogue_slicedice',
      school: 'Physical',
      level: 3,
      specialization: 'bladestorm',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self',
        areaType: 'circle',
        areaSize: 10
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        actionPoints: 1,
        quarryMarks: 2,
        components: ['somatic'],
        somaticText: 'Spin in place with glaive extended'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '2d8',
        damageType: 'slashing',
        scalingType: 'none'
      },

      effects: {
        damage: {
          aoe: {
            formula: '2d8',
            type: 'slashing',
            shape: 'circle',
            radius: 10
          }
        }
      },

      specialMechanics: {
        quarryMarks: {
          cost: 2,
          generated: 1,
          perHit: true,
          description: 'Costs 2 marks to use, but generates 1 mark per enemy hit'
        },
        momentum: {
          description: 'Each enemy hit grants +1 Momentum (Bladestorm passive), stacking up to +3'
        }
      },

      tags: ['physical', 'damage', 'aoe', 'spin', 'bladestorm']
    },

    {
      id: 'huntress_blade_fury',
      name: 'Blade Fury',
      description: 'Unleash a devastating flurry of glaive strikes, hitting multiple targets in rapid succession.',
      spellType: 'ACTION',
      icon: 'ability_warrior_bladestorm',
      school: 'Physical',
      level: 5,
      specialization: 'bladestorm',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'multi',
        rangeType: 'melee',
        rangeDistance: 15,
        maxTargets: 5
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        actionPoints: 1,
        quarryMarks: 5,
        components: ['somatic'],
        somaticText: 'Rapid spinning strikes with glaive'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '3d8',
        damageType: 'slashing',
        scalingType: 'none'
      },

      effects: {
        damage: {
          multiTarget: {
            formula: '3d8',
            type: 'slashing',
            targets: 5,
            description: 'Each target takes full damage'
          }
        }
      },

      specialMechanics: {
        quarryMarks: {
          cost: 5,
          description: 'Ultimate ability - costs all 5 Quarry Marks'
        },
        momentum: {
          description: 'Grants maximum Momentum (+3) after use'
        },
        bladestormUltimate: {
          description: 'Bladestorm specialization ultimate ability',
          additionalEffect: 'Gain +2 AC until end of next turn'
        }
      },

      tags: ['physical', 'damage', 'multi-target', 'ultimate', 'bladestorm']
    },

    // BEASTMASTER - Companion Synergy
    {
      id: 'huntress_companion_strike',
      name: 'Companion Strike',
      description: 'Command your companion to attack a target with enhanced ferocity.',
      spellType: 'ACTION',
      icon: 'ability_hunter_beastcall',
      school: 'Physical',
      level: 1,
      specialization: 'beastmaster',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'companion',
        rangeDistance: 30
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        actionPoints: 1,
        components: ['verbal'],
        verbalText: 'Attack command to companion'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '1d8',
        damageType: 'physical',
        scalingType: 'proficiency'
      },

      effects: {
        damage: {
          companion: {
            formula: '1d8 + proficiency bonus',
            type: 'physical',
            source: 'companion'
          }
        }
      },

      specialMechanics: {
        quarryMarks: {
          generated: 1,
          description: 'Generate 1 Quarry Mark on hit'
        },
        companionCommand: {
          type: 'attack',
          description: 'Basic companion attack command'
        },
        beastmasterPassive: {
          description: 'Beastmaster spec adds +1d4 damage (Primal Bond passive)'
        }
      },

      tags: ['physical', 'damage', 'companion', 'command', 'beastmaster']
    },

    {
      id: 'huntress_coordinated_assault',
      name: 'Coordinated Assault',
      description: 'You and your companion attack the same target simultaneously, overwhelming them with coordinated strikes.',
      spellType: 'ACTION',
      icon: 'ability_druid_primalprecision',
      school: 'Physical',
      level: 3,
      specialization: 'beastmaster',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'melee',
        rangeDistance: 15
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        actionPoints: 1,
        quarryMarks: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Attack command',
        somaticText: 'Point at target'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '2d8',
        damageType: 'physical',
        scalingType: 'none'
      },

      effects: {
        damage: {
          huntress: {
            formula: '2d8',
            type: 'slashing',
            advantage: true
          },
          companion: {
            formula: '1d8 + proficiency',
            type: 'physical',
            advantage: true
          }
        }
      },

      specialMechanics: {
        quarryMarks: {
          cost: 2,
          generated: 2,
          description: 'Costs 2 marks, generates 2 marks (1 per hit)'
        },
        packTactics: {
          description: 'Both attacks have advantage (Pack Tactics passive)',
          requirement: 'Beastmaster specialization'
        }
      },

      tags: ['physical', 'damage', 'companion', 'coordinated', 'beastmaster']
    },

    {
      id: 'huntress_primal_rage',
      name: 'Primal Rage',
      description: 'Your companion enters a primal rage, gaining enhanced stats and attacking with savage fury.',
      spellType: 'ACTION',
      icon: 'ability_hunter_aspectoftheviper',
      school: 'Physical',
      level: 5,
      specialization: 'beastmaster',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'companion'
      },

      durationConfig: {
        durationType: 'rounds',
        duration: 3
      },

      resourceCost: {
        actionPoints: 1,
        quarryMarks: 5,
        components: ['verbal'],
        verbalText: 'Primal command to companion'
      },

      resolution: 'AUTOMATIC',

      buffConfig: {
        effects: [
          'Companion gains +2 to attack rolls',
          'Companion deals +2d6 damage on all attacks',
          'Companion gains +4 Armor',
          'Companion has advantage on all attacks',
          'Duration: 3 rounds'
        ]
      },

      effects: {
        buff: {
          target: 'companion',
          duration: 3,
          attackBonus: 2,
          damageBonus: '2d6',
          acBonus: 4,
          advantage: true
        }
      },

      specialMechanics: {
        quarryMarks: {
          cost: 5,
          description: 'Ultimate ability - costs all 5 Quarry Marks'
        },
        beastmasterUltimate: {
          description: 'Beastmaster specialization ultimate ability',
          companionRage: 'Companion becomes a devastating force for 3 rounds'
        }
      },

      tags: ['buff', 'companion', 'ultimate', 'beastmaster']
    },

    // SHADOWDANCER - Stealth & Mobility
    {
      id: 'huntress_shadowstep',
      name: 'Shadowstep',
      description: 'Teleport through shadows to a nearby location, gaining advantage on your next attack.',
      spellType: 'ACTION',
      icon: 'ability_rogue_shadowdance',
      school: 'Shadow',
      level: 1,
      specialization: 'shadowdancer',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'location',
        rangeType: 'teleport',
        rangeDistance: 30
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        actionPoints: 1,
        components: ['somatic'],
        somaticText: 'Step into shadows'
      },

      resolution: 'AUTOMATIC',

      effects: {
        utility: {
          teleport: {
            distance: 30,
            unit: 'feet'
          },
          buff: {
            nextAttack: 'advantage',
            duration: '1 attack'
          }
        }
      },

      specialMechanics: {
        shadowdancerPassive: {
          description: 'Shadowdancer spec gains +2 Armor and advantage on Stealth for 1 round (Shadow Veil passive)',
          additionalEffect: 'Can hide for 1 AP after Shadowstep'
        },
        lethalPrecision: {
          description: 'Next attack after Shadowstep deals +2d6 damage (Lethal Precision passive)'
        }
      },

      tags: ['utility', 'teleport', 'mobility', 'shadowdancer']
    },

    {
      id: 'huntress_shadow_strike',
      name: 'Shadow Strike',
      description: 'Strike from the shadows with devastating force, dealing massive damage to an unsuspecting target.',
      spellType: 'ACTION',
      icon: 'ability_rogue_deadlybrew',
      school: 'Shadow',
      level: 3,
      specialization: 'shadowdancer',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'melee',
        rangeDistance: 10
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        actionPoints: 1,
        quarryMarks: 3,
        components: ['somatic'],
        somaticText: 'Strike from stealth'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '4d8',
        damageType: 'slashing',
        scalingType: 'none'
      },

      effects: {
        damage: {
          base: {
            formula: '4d8',
            type: 'slashing',
            advantage: 'if_stealthed'
          },
          bonus: {
            formula: '2d6',
            type: 'shadow',
            condition: 'From stealth or after Shadowstep'
          }
        }
      },

      specialMechanics: {
        quarryMarks: {
          cost: 3,
          generated: 2,
          description: 'Costs 3 marks, generates 2 on hit (1 base + 1 for crit potential)'
        },
        stealthRequirement: {
          description: 'Deals maximum damage when used from stealth or after Shadowstep',
          bonusDamage: '+2d6 from Lethal Precision passive'
        }
      },

      tags: ['physical', 'shadow', 'damage', 'stealth', 'burst', 'shadowdancer']
    },

    {
      id: 'huntress_phantom_blades',
      name: 'Phantom Blades',
      description: 'Create shadow copies of your glaive that strike multiple targets simultaneously.',
      spellType: 'ACTION',
      icon: 'ability_rogue_shadowstrike',
      school: 'Shadow',
      level: 5,
      specialization: 'shadowdancer',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'multi',
        rangeType: 'ranged',
        rangeDistance: 30,
        maxTargets: 4
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        actionPoints: 1,
        quarryMarks: 5,
        components: ['verbal', 'somatic'],
        verbalText: 'Umbra multiplicare!',
        somaticText: 'Throw glaive while creating shadow copies'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '3d8',
        damageType: 'shadow',
        scalingType: 'none'
      },

      effects: {
        damage: {
          multiTarget: {
            formula: '3d8',
            type: 'shadow',
            targets: 4,
            description: 'Each phantom blade strikes a different target'
          }
        }
      },

      specialMechanics: {
        quarryMarks: {
          cost: 5,
          description: 'Ultimate ability - costs all 5 Quarry Marks'
        },
        shadowdancerUltimate: {
          description: 'Shadowdancer specialization ultimate ability',
          phantomBlades: 'Creates 4 shadow copies that strike independently'
        },
        afterEffect: {
          description: 'After using Phantom Blades, you can Shadowstep for 1 AP for free'
        }
      },

      tags: ['shadow', 'damage', 'multi-target', 'ultimate', 'shadowdancer']
    },

    // UNIVERSAL ABILITIES - All Huntresses
    {
      id: 'huntress_moonlit_strike',
      name: 'Moonlit Strike',
      description: 'Empower your Shadow Glaive with lunar energy, dealing enhanced damage and potentially blinding your target.',
      spellType: 'ACTION',
      icon: 'spell_nature_starfall',
      school: 'Arcane',
      level: 2,
      specialization: 'universal',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'melee',
        rangeDistance: 10
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        actionPoints: 1,
        mana: 5,
        components: ['verbal', 'somatic'],
        verbalText: 'Luna fortis!',
        somaticText: 'Glaive glows with moonlight'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '2d6',
        damageType: 'radiant',
        scalingType: 'none'
      },

      savingThrow: {
        ability: 'constitution',
        dc: 14,
        onSave: 'not_blinded'
      },

      debuffConfig: {
        effects: [
          'Target must make DC 14 Constitution save',
          'On failure: Blinded for 1 round',
          'Blinded creatures have disadvantage on attack rolls'
        ]
      },

      effects: {
        damage: {
          base: {
            formula: '2d6',
            type: 'radiant'
          }
        },
        debuff: {
          type: 'blinded',
          duration: 1,
          saveToNegate: true
        }
      },

      savingThrowEffect: {
        onSuccess: 'Takes full damage but not blinded',
        onFailure: 'Takes full damage and is blinded for 1 round'
      },

      specialMechanics: {
        quarryMarks: {
          generated: 1,
          description: 'Generate 1 Quarry Mark on hit'
        }
      },

      tags: ['radiant', 'damage', 'debuff', 'blind', 'universal']
    },

    {
      id: 'huntress_evasion',
      name: 'Evasion',
      description: 'Use your agility to avoid incoming attacks, increasing your defenses.',
      spellType: 'REACTION',
      icon: 'ability_rogue_feint',
      school: 'Physical',
      level: 2,
      specialization: 'universal',

      typeConfig: {
        castTime: 1,
        castTimeType: 'REACTION',
        trigger: 'When you are targeted by an attack'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      durationConfig: {
        durationType: 'rounds',
        duration: 1
      },

      resourceCost: {
        actionPoints: 0,
        components: ['somatic'],
        somaticText: 'Dodge and weave'
      },

      resolution: 'AUTOMATIC',

      buffConfig: {
        effects: [
          'Gain advantage on Dexterity saving throws',
          'Gain +2 AC',
          'Duration: Until start of your next turn'
        ]
      },

      effects: {
        buff: {
          acBonus: 2,
          savingThrowAdvantage: 'dexterity',
          duration: 1
        }
      },

      specialMechanics: {
        reaction: {
          trigger: 'When targeted by attack or required to make Dex save',
          timing: 'Before attack roll or saving throw'
        }
      },

      tags: ['buff', 'defense', 'reaction', 'universal']
    },

    {
      id: 'huntress_mark_quarry',
      name: 'Mark Quarry',
      description: 'Focus your hunter\'s instinct on a target, marking them as your quarry.',
      spellType: 'ACTION',
      icon: 'ability_hunter_markedfordeath',
      school: 'Physical',
      level: 1,
      specialization: 'universal',

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
        durationType: 'minutes',
        duration: 10
      },

      resourceCost: {
        actionPoints: 1,
        components: ['verbal'],
        verbalText: 'Mark target as quarry'
      },

      resolution: 'AUTOMATIC',

      effects: {
        utility: {
          mark: {
            description: 'Generate 1 Quarry Mark immediately',
            tracking: 'You know the direction to marked target within 1 mile',
            duration: '10 minutes or until target dies'
          }
        }
      },

      specialMechanics: {
        quarryMarks: {
          generated: 1,
          description: 'Immediately gain 1 Quarry Mark'
        },
        tracking: {
          description: 'You can sense the marked target\'s direction',
          range: '1 mile',
          duration: '10 minutes'
        }
      },

      tags: ['utility', 'mark', 'tracking', 'universal']
    },

    {
      id: 'huntress_swift_assault',
      name: 'Swift Assault',
      description: 'Perform a rapid series of glaive strikes against multiple nearby enemies.',
      spellType: 'ACTION',
      icon: 'ability_warrior_decisivestrike',
      school: 'Physical',
      level: 3,
      specialization: 'universal',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'multi',
        rangeType: 'melee',
        rangeDistance: 10,
        maxTargets: 3
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        actionPoints: 1,
        quarryMarks: 1,
        components: ['somatic'],
        somaticText: 'Rapid spinning strikes'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '1d6',
        damageType: 'slashing',
        scalingType: 'none'
      },

      effects: {
        damage: {
          multiTarget: {
            formula: '1d6',
            type: 'slashing',
            targets: 3
          }
        },
        conditionalBuff: {
          condition: 'If all 3 attacks hit',
          effect: '+1 Armor until start of next turn'
        }
      },

      specialMechanics: {
        quarryMarks: {
          cost: 1,
          generated: 3,
          description: 'Costs 1 mark, generates up to 3 marks (1 per hit)'
        },
        conditionalBonus: {
          description: 'If all attacks hit, gain +1 AC until start of next turn'
        }
      },

      tags: ['physical', 'damage', 'multi-target', 'universal']
    }
  ]
};

