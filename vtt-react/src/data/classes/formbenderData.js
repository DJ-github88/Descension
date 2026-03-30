/**
 * Formbender Class Data
 * 
 * Complete class information for the Formbender - a shapeshifter who harnesses
 * primal forms through the Wild Instinct resource system.
 */

export const FORMBENDER_DATA = {
  id: 'formbender',
  name: 'Formbender',
  icon: 'fas fa-paw',
  role: 'Hybrid (Tank/Damage/Support)',
  
  // Overview section
  overview: {
    title: 'The Formbender',
    subtitle: 'Master of Wild Instinct and Primal Transformation',
    
    description: `The Formbender is a versatile shapeshifter who channels primal energy through four distinct wild forms. By gathering Wild Instinct through form-specific actions, Formbenders can unleash devastating abilities, adapt to any combat situation, and embody the raw power of nature itself. Each form offers unique strengths and playstyles, from the stealthy Nightstalker to the resilient Ironhide, the aerial Skyhunter, and the pack-focused Frostfang.`,
    
    roleplayIdentity: {
      title: 'Roleplay Identity',
      content: `**Primal Connection**: Formbenders are deeply attuned to the wild, drawing power from the primal essence of nature's apex predators. They walk the line between civilization and savagery, channeling bestial instincts while maintaining their sense of self.

**Adaptive Warriors**: Unlike traditional spellcasters, Formbenders are physical combatants who shift their form to match the needs of battle. They are scouts, guardians, hunters, and pack leaders—all in one.

**Nature's Champions**: Formbenders often serve as protectors of the wild, defending natural places from corruption and civilization's encroachment. Their connection to primal forces makes them formidable allies and terrifying enemies.`
    },
    
    combatRole: {
      title: 'Combat Role',
      content: `**Adaptive Hybrid**: The Formbender's role changes based on their active form. Nightstalker excels at stealth and burst damage, Ironhide serves as a durable tank, Skyhunter provides mobility and aerial control, and Frostfang offers pack tactics and sustained damage.

**Resource Management**: Success as a Formbender requires careful Wild Instinct management—knowing when to gather, when to spend, and when to switch forms. Each form generates Wild Instinct differently, rewarding players who embrace each form's unique playstyle.

**Form Synergy**: Skilled Formbenders chain forms together, using one form to generate Wild Instinct and another to spend it. This creates dynamic combat patterns where no two fights play out the same way.`
    },
    
    playstyle: {
      title: 'Playstyle',
      content: `**Fluid Transformation**: Combat begins with choosing your opening form for free, then adapting as the battle evolves. Switching forms costs 1 Wild Instinct, so planning your transformations is crucial.

**Form-Specific Actions**: Each form has unique ways to generate Wild Instinct:
- **Nightstalker**: Stealth, ambushes, and precision strikes
- **Ironhide**: Taunting, tanking damage, and protecting allies
- **Skyhunter**: Scouting, aerial attacks, and enhanced perception
- **Frostfang**: Tracking, pack tactics, and coordinated strikes

**Escalating Power**: Wild Instinct abilities scale from 1-5 WI, allowing you to choose between frequent small boosts or saving for devastating ultimate abilities. This creates meaningful moment-to-moment decisions in combat.`
    },

    immersiveCombatExample: {
      title: 'Combat Example: The Shapeshifter\'s Dance',
      content: `**The Setup**: You're a Formbender (Metamorph specialization) ambushing a group of bandits (3 bandits + 1 bandit leader) in a forest. Your party is with you. Starting Wild Instinct: 6 (banked from previous encounter). Your goal: Use multiple forms strategically, generate Wild Instinct through form-specific actions, and adapt to the changing battle.

**Starting State**: Wild Instinct: 6/15 | HP: 75/75 | Form: Human (not transformed)

**Turn 1 - Opening Ambush (WI: 6 → 8, Form: Nightstalker)**

*You crouch in the shadows, watching the bandits make camp. Time to strike. You focus on the primal energy within, and your body SHIFTS.*

**Free (0 AP)**: Transform into Nightstalker form (FREE - first transformation of combat)
**Effect**: Your body shrinks, muscles coiling like a panther. Black fur ripples across your skin. Your eyes glow yellow. You're a predator now.

**Your Action**: Ambush from Stealth on Bandit #1 (form-specific ability)
**Attack Roll**: d20+6 (advantage from stealth) → [19] = Critical Hit!
**Damage**: 4d8 (crit) + 2d6 (sneak attack) → [7, 8, 6, 7] + [5, 6] = 39 damage!
**Wild Instinct Generated**: +2 WI (Ambush from Stealth - form-specific ability)
**Result**: Bandit #1 DEAD (overkill)

*You leap from the shadows, claws extended. The bandit doesn't even scream—your jaws close around his throat before he can react. The primal energy surges through you.*

**Wild Instinct**: 6 + 2 = **8 WI**
**Current Form**: Nightstalker (stealth, burst damage)

**Turn 2 - Form Switch (WI: 8 → 9, Form: Nightstalker → Ironhide)**

*The bandits shout in alarm. The leader draws his sword. Your party's mage is exposed—the bandits are charging her. Time to TANK.*

**Your Action**: Transform into Ironhide form (costs 1 WI)
**Wild Instinct**: 8 - 1 = **7 WI**

*Your body EXPLODES in size. Fur becomes thick hide. Claws become massive paws. You're a BEAR now—800 pounds of muscle and fury. You roar, positioning yourself between the bandits and your mage.*

**Your Action**: Taunt all 3 enemies (form-specific action)
**Effect**: All bandits must attack you instead of allies
**Wild Instinct Generated**: +1 WI per enemy taunted = +3 WI
**Wild Instinct**: 7 + 3 = **10 WI**

*"COME ON!" you roar in a voice that's half-human, half-beast. The bandits hesitate, then charge YOU instead of your mage. Perfect.*

**Bandit #2's Turn**: Attacks you → Hit! → 2d6+3 → [5, 4] + 3 = 12 damage
**Bandit #3's Turn**: Attacks you → Hit! → 2d6+3 → [6, 3] + 3 = 9 damage
**Bandit Leader's Turn**: Attacks you → Hit! → 3d6+4 → [5, 6, 4] + 4 = 19 damage

**Total Damage Taken**: 12 + 9 + 19 = 40 damage
**Your HP**: 75 - 40 = 35/75
**Ironhide Passive**: As a bear, you have +20 HP and damage resistance → Effective HP: 55/95, damage reduced to 20

*The bandits' weapons bounce off your thick hide. You barely feel it. This is what Ironhide form is FOR.*

**Current State**: WI: 10/15 | HP: 55/95 (Ironhide form) | Form: Ironhide

**Turn 3 - Spending Wild Instinct (WI: 10 → 5)**

*You're at 10 WI. Time to spend it. You have a Tier 5 ultimate ability: "Primal Fury" (costs 5 WI) - massive AoE damage.*

**Your Action**: Use "Primal Fury" (5 WI, Ironhide ultimate)
**Wild Instinct**: 10 - 5 = **5 WI**
**Effect**: You rear up on hind legs and SLAM the ground with both paws

*The earth SHAKES. A shockwave of primal energy explodes outward, hitting all enemies within 15 feet.*

**Damage Roll**: 5d10 (Tier 5 ability) → [8, 9, 7, 10, 6] = 40 damage to ALL bandits!
**Results**:
- Bandit #2: 40 damage → DEAD
- Bandit #3: 40 damage → DEAD
- Bandit Leader: 60 HP - 40 damage = 20 HP remaining, STUNNED for 1 round

*Two bandits are crushed by the shockwave. The leader staggers, stunned.*

**Current State**: WI: 5/15 | HP: 55/95 | Form: Ironhide

**Turn 4 - Aerial Assault (WI: 5 → 6, Form: Ironhide → Skyhunter)**

*The leader is stunned but will recover next turn. He's trying to flee. Time to CUT HIM OFF.*

**Your Action**: Transform into Skyhunter form (costs 1 WI)
**Wild Instinct**: 5 - 1 = **4 WI**

*Your massive bear form SHRINKS. Wings erupt from your back. Feathers replace fur. You're an EAGLE now—a massive raptor with razor talons. You take flight.*

**Your Action**: Dive Attack on Bandit Leader (form-specific ability, generates 2 WI)
**Attack Roll**: d20+6 (advantage from dive) → [18] = Hit!
**Damage**: 3d8 (dive attack) + 2d6 (momentum) → [7, 8, 6] + [5, 6] = 32 damage
**Wild Instinct Generated**: +2 WI (Dive Attack - form-specific ability)
**Wild Instinct**: 4 + 2 = **6 WI**

*You dive from 50 feet up, talons extended. The leader looks up just in time to see death descending. Your talons pierce his chest. He falls.*

**Bandit Leader**: 20 HP - 32 damage = DEAD

**Combat Over**

*You land gracefully, wings folding. Your party stares at you—you've been three different animals in four turns. You shift back to human form, breathing heavily.*

**Your Party's Tank**: "That was... incredible. You were a panther, then a bear, then an eagle."
**You**: "Formbender. I'm whatever the situation needs me to be."
**Your Party's Mage**: "Thanks for tanking those hits. I would've died."
**You**: "That's what Ironhide form is for. Nightstalker for ambush, Ironhide for tanking, Skyhunter for mobility. Each form has a purpose."

**Final State**: WI: 6/15 (banked for next fight) | HP: 55/95 (will heal when you drop Ironhide form)

**The Lesson**: Formbender gameplay is about:
1. **Free First Transform**: Started combat with free Nightstalker transformation (no WI cost)
2. **Form-Specific Generation**: Generated 2 WI from Ambush (Nightstalker), 3 WI from Taunt (Ironhide), 2 WI from Dive Attack (Skyhunter) = 7 WI total
3. **Form Switching**: Switched forms twice (Nightstalker → Ironhide → Skyhunter) at 1 WI each = 2 WI spent
4. **Ultimate Ability**: Spent 5 WI on Primal Fury (Tier 5 ability) for 40 AoE damage
5. **Form Synergy**: Nightstalker for burst → Ironhide for tanking → Skyhunter for mobility/finishing
6. **Resource Banking**: Started with 6 WI (banked from previous fight), ended with 6 WI (ready for next fight)
7. **Adaptation**: Changed forms to match the situation (stealth → tank → aerial pursuit)

You're not locked into one role. You're a SHAPESHIFTER. Panther when you need stealth. Bear when you need to tank. Eagle when you need to fly. Each form generates Wild Instinct differently, and each form spends it on unique abilities. The key is knowing when to switch, when to spend, and when to save. You're not just a damage dealer or a tank—you're EVERYTHING, one transformation at a time.`
    }
  },
  
  // Resource System
  resourceSystem: {
    title: 'Wild Instinct System',
    subtitle: 'Primal Energy Through Form Mastery',

    description: `Wild Instinct is the primal energy that fuels the Formbender's transformations and abilities. This resource is gathered through actions that align with each form's nature and spent to unleash powerful form-specific abilities or switch between forms mid-combat.`,

    resourceBarExplanation: {
      title: 'Understanding Your Wild Instinct Gauge',
      content: `**What You See**: Your Wild Instinct gauge displays as a horizontal bar with 15 segments, each representing 1 Wild Instinct point. The bar's appearance changes based on your current form, with each form having a unique visual theme and color scheme.

**Form-Specific Visual Themes**:

**Human Form (No Transformation)**:
- Bar: Gray/neutral color, no special effects
- Border: White (neutral)
- Status: "Not Transformed"
- WI Display: "6/15 Wild Instinct"

**Nightstalker Form (Panther/Stealth)**:
- Bar: Deep purple-black with shadowy wisps
- Border: Dark purple
- Form Icon: Panther silhouette with glowing yellow eyes
- Status: "Nightstalker - Stealth & Burst Damage"
- WI Display: "8/15 Wild Instinct" with shadow particle effects
- Special Effect: Bar pulses when in stealth

**Ironhide Form (Bear/Tank)**:
- Bar: Brown-gray with rocky texture
- Border: Dark brown
- Form Icon: Bear silhouette with thick hide
- Status: "Ironhide - Tank & Durability"
- WI Display: "10/15 Wild Instinct" with earth particle effects
- Special Effect: Bar glows when taunting enemies

**Skyhunter Form (Eagle/Mobility)**:
- Bar: Sky blue with feather patterns
- Border: Light blue
- Form Icon: Eagle silhouette with spread wings
- Status: "Skyhunter - Mobility & Aerial Control"
- WI Display: "6/15 Wild Instinct" with wind particle effects
- Special Effect: Bar shimmers when airborne

**Frostfang Form (Wolf/Pack Tactics)**:
- Bar: Icy blue-white with frost patterns
- Border: Frost blue
- Form Icon: Wolf silhouette with bared fangs
- Status: "Frostfang - Pack Tactics & Tracking"
- WI Display: "7/15 Wild Instinct" with snow particle effects
- Special Effect: Bar pulses when near allies (pack bonus)

**Wild Instinct Level Indicators** (applies to all forms):

**0-3 WI (Low Reserve)**:
- Bar: 0-3 segments filled, dim glow
- Border: Red (warning)
- Status: "Low Wild Instinct"
- Warning: "Cannot use Tier 3+ abilities"

**4-7 WI (Moderate Reserve)**:
- Bar: 4-7 segments filled, moderate glow
- Border: Yellow (caution)
- Status: "Moderate Wild Instinct"
- Available: "Tier 1-3 abilities available"

**8-11 WI (Good Reserve)**:
- Bar: 8-11 segments filled, bright glow
- Border: Green (good)
- Status: "Good Wild Instinct"
- Available: "Tier 1-4 abilities available"

**12-15 WI (Maximum Reserve)**:
- Bar: 12-15 segments filled, intense glow
- Border: Blue (excellent)
- Status: "Maximum Wild Instinct"
- Available: "ALL abilities available (including Tier 5 ultimates)"

**Wild Instinct Generation Animation**:
When you generate Wild Instinct:
- **+1 WI (Standard Action)**: Single primal energy orb flows from your character to the bar, fills 1 segment
- **+2 WI (Form-Specific Ability)**: Two primal energy orbs flow to bar, fills 2 segments with brighter animation
- **Audio**: Primal growl/roar sound effect (varies by form)
- **Text Popup**: "+2 Wild Instinct (Ambush from Stealth)" or "+1 WI (Taunt)"

**Wild Instinct Spending Animation**:
When you spend Wild Instinct:
- **Form Switch (1 WI)**: 1 segment drains, transformation animation plays (body morphs into new form)
- **Ability Use (1-5 WI)**: Segments drain with reverse animation, ability effect plays
- **Audio**: Ability-specific sound (roar for Primal Fury, screech for Dive Attack, etc.)
- **Text Popup**: "-5 Wild Instinct (Primal Fury)" or "-1 WI (Form Switch)"

**Form Transformation Visual**:
When you transform:
- **Current Form Icon**: Fades out with dissolve effect
- **Transformation Animation**: Your character model morphs (human → panther → bear → eagle → wolf)
- **New Form Icon**: Fades in with glow effect
- **Bar Color Change**: Smoothly transitions to new form's color scheme
- **Audio**: Transformation sound (bones cracking, fur growing, wings sprouting)
- **Duration**: 1-2 second animation

**Ability Tier Display**:
Below the Wild Instinct bar, ability buttons show:
- **Tier 1 (1 WI)**: Small icon, always available if you have 1+ WI
- **Tier 2 (2 WI)**: Medium icon, available if you have 2+ WI
- **Tier 3 (3 WI)**: Large icon, available if you have 3+ WI
- **Tier 4 (4 WI)**: Larger icon, available if you have 4+ WI
- **Tier 5 (5 WI)**: HUGE icon, glows when available (5+ WI), labeled "ULTIMATE"

**Form Switch Button**:
- **Button**: "Transform" with dropdown menu showing all 4 forms
- **Cost Display**: "1 Wild Instinct" (grayed out if you have 0 WI)
- **Current Form**: Highlighted in dropdown
- **Hover**: Shows form preview (stats, abilities, generation methods)

**Persistence Indicator**:
- **Between Combats**: Wild Instinct bar shows "Banked: 6/15 WI - Persists to next combat"
- **Visual**: Bar has a "locked" icon indicating WI won't decay
- **Strategic Info**: "Wild Instinct does not decay - save for crucial encounters"

**Why This Matters**: The Wild Instinct gauge isn't just a resource bar—it's a visual representation of your primal connection. When you transform into Nightstalker, the bar turns shadowy purple and pulses with stealth energy. When you switch to Ironhide, it becomes rocky brown and glows with earth power. Each form FEELS different visually. The form-specific colors, icons, and particle effects make it immediately obvious which form you're in and how much power you have. When you hit 15 WI and the bar glows blue with "ULTIMATE AVAILABLE," you KNOW you can unleash Primal Fury. The transformation animations make each form switch feel impactful—you're not just changing stats, you're becoming a different CREATURE. And the persistence indicator reminds you that Wild Instinct banks between fights, encouraging strategic resource management across multiple encounters.`
    },

    mechanics: {
      title: 'Core Mechanics',
      content: `**Wild Instinct Capacity**: Maximum Wild Instinct is 15 points. Wild Instinct does not decay between combats, allowing strategic resource banking.

**Free Initial Transformation**: At the start of combat, enter any form for free. This allows you to begin generating Wild Instinct immediately.

**Form Switching Cost**: Each subsequent form switch during combat costs 1 Wild Instinct. Plan your transformations carefully to maintain resource efficiency.

**Wild Instinct Generation**: Generate Wild Instinct through form-specific actions: Sneaking (Nightstalker), Taunting (Ironhide), Scouting (Skyhunter), Tracking (Frostfang). Form-specific abilities generate 2 Wild Instinct.`
    },
    
    wildInstinctGenerationTable: {
      title: 'Wild Instinct Generation Methods',
      headers: ['Action', 'Form', 'WI Generated', 'Notes'],
      rows: [
        ['Sneaking (per round)', 'Nightstalker', '1', 'Must be in stealth'],
        ['Ambush from Stealth', 'Nightstalker', '2', 'Form-specific ability'],
        ['Taunting Enemy', 'Ironhide', '1', 'Per enemy taunted'],
        ['Taking Damage for Ally', 'Ironhide', '2', 'Form-specific ability'],
        ['Scouting/Enhanced Vision', 'Skyhunter', '1', 'Spotting hidden threats'],
        ['Dive Attack', 'Skyhunter', '2', 'Form-specific ability'],
        ['Tracking Target', 'Frostfang', '1', 'Successful tracking check'],
        ['Pack Tactics', 'Frostfang', '2', 'Coordinated attack with ally']
      ]
    },
    
    formAbilitiesTable: {
      title: 'Wild Instinct Ability Costs',
      headers: ['Ability Tier', 'WI Cost', 'Power Level', 'Example Effects'],
      rows: [
        ['Tier 1', '1 WI', 'Minor', '+1d4 damage, advantage on checks'],
        ['Tier 2', '2 WI', 'Moderate', '+2d4 damage, status effects, invisibility'],
        ['Tier 3', '3 WI', 'Strong', '+3d4 damage, stuns, teleportation'],
        ['Tier 4', '4 WI', 'Major', '+4d4 damage, fear effects, illusions'],
        ['Tier 5', '5 WI', 'Ultimate', '+5d4 damage, paralysis, immunity']
      ]
    },

    playingInPerson: {
      title: 'Playing in Person',
      subtitle: 'Physical Tracking for Tabletop Play',
      content: `The Formbender's Wild Instinct system (0-15 points) and four distinct forms create a dynamic, transformative in-person experience. Here's how to track your shapeshifting power at the table:

**Required Materials**:
- **15 tokens or beads** (wild/primal color like green, brown, or amber)
- **Form reference cards** (one for each of the 4 forms)
- **Current form indicator** (token, card, or mini)
- **Optional: Form-specific miniatures** for each transformation

**Wild Instinct Tracking**:

**The Token Method** (Recommended):

Use physical tokens to represent Wild Instinct:
- **Starting State**: Begin with 0 tokens (or carry over from previous combat)
- **Maximum**: 15 tokens
- **Generating WI**: Add tokens when you perform form-specific actions
  - Nightstalker: Ambush from stealth → +2 WI (add 2 tokens)
  - Ironhide: Taunt enemies → +1 WI per enemy (add tokens)
  - Skyhunter: Scout from above → +1 WI (add 1 token)
  - Frostfang: Pack tactics with ally → +1 WI (add 1 token)
- **Spending WI**: Remove tokens when using abilities or transforming
  - Transform to new form → -1 WI (remove 1 token)
  - Use Tier 3 ability → -3 WI (remove 3 tokens)

**Alternative Tracking Methods**:
- **d20 Die**: Set it to your current WI count (0-15)
- **Tally Marks**: Write on paper with hash marks
- **Counter App**: Use a phone app to track WI

**Form Tracking**:

**The Form Card Method** (Recommended):

Create reference cards for each form showing:
- **Form Name & Icon**
- **Passive Bonuses** (stats, abilities)
- **WI Generation Method** (how this form generates WI)
- **Form-Specific Abilities** (Tier 1-5 abilities)

**Example Form Cards**:

\`\`\`
NIGHTSTALKER FORM (Panther)
━━━━━━━━━━━━━━━━━━━━━━━━━━
Passive Bonuses:
• +10 ft speed
• Advantage on Stealth checks
• Darkvision 60 ft
• +2d6 sneak attack damage

WI Generation:
• Ambush from Stealth: +2 WI
• Critical hit: +1 WI
• Kill from stealth: +2 WI

Abilities:
Tier 1 (1 WI): Shadow Leap (teleport 15 ft)
Tier 2 (2 WI): Vanish (invisibility 1 min)
Tier 3 (3 WI): Assassinate (auto-crit)
Tier 4 (4 WI): Shadow Clone (create copy)
Tier 5 (5 WI): Death from Above (massive damage)
━━━━━━━━━━━━━━━━━━━━━━━━━━

IRONHIDE FORM (Bear)
━━━━━━━━━━━━━━━━━━━━━━━━━━
Passive Bonuses:
• +20 max HP
• +2 AC
• Damage resistance (physical)
• +5 ft reach

WI Generation:
• Taunt enemy: +1 WI per enemy
• Take damage: +1 WI per 10 damage
• Protect ally: +1 WI

Abilities:
Tier 1 (1 WI): Roar (frighten enemies)
Tier 2 (2 WI): Thick Hide (+5 temp HP)
Tier 3 (3 WI): Charge (knock prone)
Tier 4 (4 WI): Unstoppable (immune to CC)
Tier 5 (5 WI): Primal Fury (berserk mode)
━━━━━━━━━━━━━━━━━━━━━━━━━━

SKYHUNTER FORM (Eagle)
━━━━━━━━━━━━━━━━━━━━━━━━━━
Passive Bonuses:
• Fly speed 60 ft
• +3 to Perception
• Advantage on sight-based checks
• Dive attack: +2d6 damage

WI Generation:
• Scout from above: +1 WI
• Dive attack: +1 WI
• Spot hidden enemy: +2 WI

Abilities:
Tier 1 (1 WI): Gust (push enemies)
Tier 2 (2 WI): Aerial Dodge (adv on saves)
Tier 3 (3 WI): Dive Bomb (massive damage)
Tier 4 (4 WI): Wind Wall (block projectiles)
Tier 5 (5 WI): Storm Call (lightning strikes)
━━━━━━━━━━━━━━━━━━━━━━━━━━

FROSTFANG FORM (Wolf)
━━━━━━━━━━━━━━━━━━━━━━━━━━
Passive Bonuses:
• +15 ft speed
• Pack tactics (adv with ally nearby)
• Keen smell (adv on tracking)
• Trip attack (knock prone on hit)

WI Generation:
• Attack with ally nearby: +1 WI
• Track enemy: +1 WI
• Howl (buff allies): +1 WI per ally

Abilities:
Tier 1 (1 WI): Howl (allies +2 attack)
Tier 2 (2 WI): Pack Rush (extra attack)
Tier 3 (3 WI): Frost Bite (slow enemy)
Tier 4 (4 WI): Alpha's Command (control pack)
Tier 5 (5 WI): Winter's Wrath (freeze area)
━━━━━━━━━━━━━━━━━━━━━━━━━━
\`\`\`

**Current Form Indicator**:
- **Card Method**: Place current form card face-up in front of you
- **Token Method**: Use a colored token to mark current form
- **Mini Method**: Use form-specific miniatures (panther, bear, eagle, wolf)

**Example In-Person Turn**:

*You have 6 Wild Instinct, currently in Human form*

**Turn 1 - First Transformation (FREE)**:
1. "I transform into Nightstalker form!" (FREE - first transformation of combat)
2. Place Nightstalker card face-up in front of you
3. Wild Instinct: Still at 6 WI (transformation was free)
4. Swap your mini to a panther mini (if using)

**Turn 2 - Generate WI**:
1. "I ambush the guard from stealth!"
2. Roll attack with advantage → Hit!
3. Roll damage: 2d8 + 2d6 (sneak attack) → [7, 6] + [5, 4] = 22 damage!
4. Generate WI: +2 WI (Ambush from Stealth)
5. Add 2 tokens: 6 + 2 = 8 WI

**Turn 3 - Transform Again**:
1. "The enemies are charging! I transform into Ironhide form!"
2. Remove 1 token: 8 - 1 = 7 WI (transformation costs 1 WI)
3. Swap Nightstalker card for Ironhide card
4. Swap panther mini for bear mini
5. Gain Ironhide bonuses: +20 HP, +2 AC, damage resistance

**Turn 4 - Generate WI in New Form**:
1. "I taunt all 3 enemies!"
2. All 3 enemies must attack me
3. Generate WI: +1 WI per enemy = +3 WI
4. Add 3 tokens: 7 + 3 = 10 WI

**Turn 5 - Spend WI on Ability**:
1. "I use Charge!" (Tier 3 ability, costs 3 WI)
2. Remove 3 tokens: 10 - 3 = 7 WI
3. Charge at enemy, knock prone, deal 3d8 damage
4. Roll: [7, 6, 5] = 18 damage!

**Quick Reference Card Template**:
\`\`\`
FORMBENDER QUICK REFERENCE

WILD INSTINCT:
• Maximum: 15 WI
• First transformation: FREE
• Subsequent transformations: 1 WI
• Abilities cost 1-5 WI (Tier 1-5)

FORMS:
🐆 Nightstalker (Panther): Stealth, burst damage
🐻 Ironhide (Bear): Tank, durability
🦅 Skyhunter (Eagle): Mobility, aerial control
🐺 Frostfang (Wolf): Pack tactics, tracking

WI GENERATION (Form-Specific):
• Nightstalker: Ambush (+2), Crit (+1)
• Ironhide: Taunt (+1/enemy), Tank (+1/10 dmg)
• Skyhunter: Scout (+1), Dive (+1)
• Frostfang: Pack attack (+1), Howl (+1/ally)

TRANSFORMATION STRATEGY:
• Start combat: Transform for FREE
• Generate WI in current form
• Switch forms when needed (1 WI)
• Spend WI on abilities (1-5 WI)
\`\`\`

**Thematic Enhancements**:

Many players enhance the shapeshifting experience with:
- **Form-Specific Minis**: Use different miniatures for each form
- **Transformation Announcements**: Describe your transformation dramatically
- **Wild Tokens**: Use nature-themed tokens (leaves, stones, bones)
- **Form Cards**: Laminated cards with form artwork and abilities
- **Physical Gestures**: Make animal sounds or gestures when transforming

**Example Full Combat Sequence**:

*Starting: 6 WI (carried over), Human form*

**Turn 1**: Transform to Nightstalker (FREE) → 6 WI, Nightstalker form
**Turn 2**: Ambush from stealth → +2 WI → 8 WI
**Turn 3**: Transform to Ironhide (1 WI) → 7 WI, Ironhide form
**Turn 4**: Taunt 3 enemies → +3 WI → 10 WI
**Turn 5**: Use Charge (3 WI) → 7 WI
**Turn 6**: Take 20 damage → +2 WI (Ironhide passive) → 9 WI
**Turn 7**: Transform to Skyhunter (1 WI) → 8 WI, Skyhunter form
**Turn 8**: Dive attack → +1 WI → 9 WI
**Turn 9**: Use Dive Bomb (3 WI) → 6 WI

**Visual Organization**:

**Your Play Area**:
\`\`\`
[Current Form Card]    [WI Tokens]
   IRONHIDE           ○○○○○○○○○○ (10 WI)

[Form Card Deck]
Nightstalker
Skyhunter
Frostfang
\`\`\`

**Specialization-Specific Tracking**:

**Metamorph (Hybrid Forms)**:
- Can combine two forms simultaneously
- Hybrid transformation costs 2 WI (not 1)
- Track which two forms are active (use both cards)
- Example: "Nightstalker + Skyhunter = Flying Panther!"

**Form Thief (Stolen Forms)**:
- Can steal enemy forms (costs 5 WI)
- Track up to 10 stolen forms (create custom cards)
- Transforming into stolen form costs 2 WI
- Example: "I steal the orc's form!" → Create "Orc Form" card

**Primordial (Elemental Forms)**:
- Replace base forms with elemental forms
- Elemental transformation costs 3 WI (not 1)
- Track elemental vulnerabilities (note on cards)
- Example: "Inferno Form" card shows fire immunity, cold vulnerability

**Why This System Works**: The physical act of placing form cards, swapping miniatures, and adding/removing Wild Instinct tokens creates a TRANSFORMATIVE experience. You're not just saying "I'm a bear now"—you're physically changing your play area to reflect your new form. The form cards show your current abilities at a glance, and the WI tokens show how much power you have to spend. The moment you transform—swapping cards and minis—is visceral and memorable.

**Pro Tips**:
- **Form Planning**: Decide which form you need BEFORE transforming
- **WI Banking**: Keep 3-5 WI banked for emergency transformations
- **Form Synergy**: Use one form to generate WI, another to spend it
- **Transformation Timing**: Transform at the start of your turn for maximum benefit
- **Ability Tiers**: Save Tier 4-5 abilities for critical moments

**Budget-Friendly Alternatives**:
- **No form cards?** Write form names on paper with abilities listed
- **No minis?** Use tokens or coins to represent different forms
- **No WI tokens?** Use a d20 die or paper tracking
- **Minimalist**: Just announce form changes and track WI on paper

**Why Formbender Is Perfect for In-Person Play**: The class is built around dramatic transformations between distinct forms, each with unique abilities and playstyles. The physical components (form cards, miniatures, WI tokens) make shapeshifting tangible and immediate. Swapping your panther mini for a bear mini, placing a new form card in front of you, and adjusting your WI tokens creates a visceral sense of transformation. Every form change is a dramatic moment, and the Wild Instinct system creates meaningful decisions about when to transform and when to spend power on abilities.`
    }
  },
  
  // Specializations
  specializations: {
    title: 'Formbender Specializations',
    subtitle: 'Three Paths of Transformation Mastery',

    description: `Formbenders can specialize in radically different transformation philosophies. Metamorphs create chimeric hybrid forms, Form Thieves steal and mimic the forms of their enemies, and Primordials channel ancient elemental transformations. Each path offers a completely unique approach to shapeshifting.`,

    passiveAbility: {
      name: 'Primal Attunement',
      description: 'All Formbenders can transform into their four base forms (Nightstalker, Ironhide, Skyhunter, Frostfang) and generate Wild Instinct through form-specific actions. The first transformation each combat is free.'
    },

    specs: [
      {
        id: 'metamorph',
        name: 'Metamorph',
        icon: 'ability_hunter_pet_chimera',
        color: '#9932CC',
        theme: 'Chimeric Hybrid Forms & Adaptive Evolution',

        description: `Metamorphs transcend the limitations of single forms, creating chimeric hybrids that combine traits from multiple creatures. They can merge forms together, creating unique combinations like a bear with eagle wings or a panther with serpent fangs. Their mastery lies in adaptation and versatility.`,

        playstyle: 'Hybrid form creation, multi-trait combinations, adaptive combat',

        strengths: [
          'Can combine two base forms simultaneously for hybrid abilities',
          'Access to unique chimeric transformations unavailable to other specs',
          'Hybrid forms inherit strengths from both parent forms',
          'Unmatched versatility in adapting to any situation'
        ],

        weaknesses: [
          'Hybrid forms cost more Wild Instinct to maintain',
          'Cannot access pure form ultimate abilities',
          'Transformation complexity requires careful planning',
          'Jack-of-all-trades means less specialization'
        ],

        specPassive: {
          name: 'Chimeric Fusion',
          description: 'You can merge two base forms together, creating hybrid forms with combined traits. Hybrid forms cost 2 WI to activate but grant abilities from both parent forms. You can also manifest partial transformations (wings, claws, gills) without fully shapeshifting.'
        },

        keyAbilities: [
          'Chimeric Merge: Combine two forms (e.g., Nightstalker + Skyhunter = Shadow Raptor with stealth and flight)',
          'Adaptive Evolution: Spend 3 WI to temporarily gain resistance to the last damage type you received',
          'Partial Shift: Manifest specific traits (claws, wings, gills, enhanced senses) without full transformation (1 WI each)'
        ],

        recommendedFor: 'Players who love creative problem-solving and want maximum transformation flexibility'
      },

      {
        id: 'form-thief',
        name: 'Form Thief',
        icon: 'spell_shadow_possession',
        color: '#8B0000',
        theme: 'Form Theft & Enemy Mimicry',

        description: `Form Thieves possess the dark art of stealing forms from defeated enemies, adding them to their repertoire. They can transform into humanoids, monsters, and even magical creatures they've slain, perfectly mimicking their abilities and appearance. This forbidden magic makes them master infiltrators and adaptable combatants.`,

        playstyle: 'Form collection, enemy mimicry, infiltration, stolen abilities',

        strengths: [
          'Can steal and permanently learn forms from defeated enemies',
          'Perfect mimicry allows infiltration and deception',
          'Access to enemy racial abilities and traits',
          'Form library grows stronger with each victory'
        ],

        weaknesses: [
          'Must defeat enemies to gain their forms',
          'Can only maintain 10 stolen forms at a time',
          'Stolen forms may have unfamiliar abilities',
          'Requires kills to expand transformation options'
        ],

        specPassive: {
          name: 'Harvest Form',
          description: 'When you reduce a creature to 0 HP, you can spend 5 WI to steal its form. You can transform into stolen forms, gaining their physical stats, racial abilities, and appearance. You can store up to 10 stolen forms. Transforming into a stolen form costs 2 WI.'
        },

        keyAbilities: [
          'Perfect Mimicry: While in a stolen form, you are indistinguishable from the original creature (even to magic)',
          'Stolen Power: Use one ability from your current stolen form (costs vary by ability power)',
          'Form Vault: Spend 10 minutes to swap out stored forms, replacing old ones with new acquisitions'
        ],

        recommendedFor: 'Players who enjoy collecting abilities and using enemy powers against them'
      },

      {
        id: 'primordial',
        name: 'Primordial',
        icon: 'spell_fire_elementaldevastation',
        color: '#FF4500',
        theme: 'Ancient Elemental Transformations',

        description: `Primordials channel the ancient power of the elemental planes, transforming into primal elemental beings of fire, water, earth, and air. These transformations are more powerful than standard forms but come with elemental vulnerabilities. They embody raw elemental fury and can reshape the battlefield itself.`,

        playstyle: 'Elemental transformations, environmental manipulation, high-risk high-reward',

        strengths: [
          'Elemental forms deal massive elemental damage',
          'Can manipulate terrain and environment while transformed',
          'Immunity to their element while in elemental form',
          'Elemental forms have devastating ultimate abilities'
        ],

        weaknesses: [
          'Vulnerable to opposing elements (Fire weak to Water, etc.)',
          'Elemental forms cost 3 WI to activate',
          'Cannot use base animal forms while specialized',
          'Environmental dependence (harder to use Fire form underwater)'
        ],

        specPassive: {
          name: 'Elemental Ascension',
          description: 'You replace your base forms with four elemental forms: Inferno (fire), Tsunami (water), Avalanche (earth), and Tempest (air). Each grants immunity to its element, vulnerability to its opposite, and the ability to manipulate that element within 30 feet.'
        },

        keyAbilities: [
          'Inferno Form: Become living fire, dealing 1d6 fire damage to adjacent enemies each round, immune to fire, vulnerable to cold',
          'Tsunami Form: Become living water, gain swim speed 60ft, breathe underwater, create water walls, vulnerable to lightning',
          'Avalanche Form: Become living stone, gain +5 AC, tremorsense 30ft, reshape earth, vulnerable to thunder',
          'Tempest Form: Become living wind, gain fly speed 60ft, create wind barriers, vulnerable to being grounded'
        ],

        recommendedFor: 'Players who want powerful elemental magic and don\'t mind tactical vulnerabilities'
      }
    ]
  },

  // Example Spells - organized by form and specialization
  exampleSpells: [
    // ===== NIGHTSTALKER FORM (CAT) =====
    {
      id: 'fb_ambush_strike',
      name: 'Ambush Strike',
      description: 'Strike from the shadows with devastating precision. Damage and effects scale with Wild Instinct spent (1-5 WI). Must be used from stealth for full effect.',
      spellType: 'ACTION',
      icon: 'ability_rogue_ambush',
      school: 'Physical',
      level: 3,
      specialization: 'nightstalker',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE',
        tags: ['physical', 'stealth', 'burst-damage', 'nightstalker']
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'melee',
        rangeDistance: 5,
        requiresLineOfSight: true,
        targetRestrictions: ['enemy']
      },

      resourceCost: {
        resourceTypes: ['wild_instinct'],
        resourceValues: { wild_instinct: 1 },
        actionPoints: 1,
        components: ['somatic'],
        somaticText: 'Strike from stealth with deadly precision'
      },

      resolution: 'DICE',
      effectTypes: ['damage', 'debuff', 'control'],

      damageConfig: {
        formula: '1d4 per Wild Instinct spent',
        elementType: 'slashing',
        damageType: 'direct',
        description: 'Tier 1: 1d4, Tier 2: 2d4 + Bleeding, Tier 3: 3d4 + Stun, Tier 4: 4d4 + Slow, Tier 5: 5d4 + Paralyze',
        hasDotEffect: true,
        dotConfig: {
          duration: 3,
          tickFrequency: 'round',
          dotFormula: '1d4',
          isProgressiveDot: false
        }
      },

      debuffConfig: {
        debuffType: 'statusEffect',
        effects: [{
          id: 'bleeding',
          name: 'Bleeding',
          description: '1d4 damage per round for 3 rounds (Tier 2+)'
        }],
        durationValue: 3,
        durationType: 'rounds',
        durationUnit: 'rounds'
      },

      controlConfig: {
        controlType: 'incapacitation',
        strength: 'moderate',
        duration: 1,
        durationUnit: 'rounds',
        effects: [{
          id: 'stun',
          name: 'Stun',
          description: 'Target is stunned for 1 round (Tier 3: Stun, Tier 5: Paralyze)',
          config: {
            durationType: 'temporary',
            recoveryMethod: 'automatic'
          }
        }]
      },

      wildInstinctScaling: {
        minCost: 1,
        maxCost: 5,
        tiers: [
          { cost: 1, damage: '1d4', effect: 'None' },
          { cost: 2, damage: '2d4', effect: 'Apply Bleeding (1d4 damage per round for 3 rounds)' },
          { cost: 3, damage: '3d4', effect: 'Stun target for 1 round' },
          { cost: 4, damage: '4d4', effect: 'Reduce target movement speed by 50% for 2 rounds' },
          { cost: 5, damage: '5d4', effect: 'Paralyze target for 1 round' }
        ]
      },

      specialMechanics: {
        stealthRequirement: {
          description: 'Must be used from stealth for full effect',
          bonus: 'Advantage on attack roll if attacking from stealth'
        }
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 0
      },

      tags: ['physical', 'stealth', 'burst-damage', 'nightstalker', 'feral-shifter'],
      flavorText: 'From the shadows, death strikes without warning.'
    },

    {
      id: 'fb_shadowmeld',
      name: 'Shadowmeld',
      description: 'Blend into the shadows, becoming invisible and creating illusionary duplicates at higher tiers. Broken by attacking or taking damage.',
      spellType: 'ACTION',
      icon: 'spell_shadow_charm',
      school: 'Illusion',
      level: 2,
      specialization: 'nightstalker',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE',
        tags: ['stealth', 'buff', 'illusion', 'nightstalker']
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      resourceCost: {
        resourceTypes: ['wild_instinct'],
        resourceValues: { wild_instinct: 1 },
        actionPoints: 1,
        components: ['somatic'],
        somaticText: 'Fade into the shadows'
      },

      resolution: 'NONE',
      effectTypes: ['buff', 'utility'],

      buffConfig: {
        buffType: 'statusEffect',
        effects: [{
          id: 'invisibility',
          name: 'Shadow Invisibility',
          description: 'Become invisible for 1 minute or until you attack or take damage'
        }],
        durationValue: 1,
        durationType: 'minutes',
        durationUnit: 'minutes',
        concentrationRequired: false,
        canBeDispelled: true
      },

      utilityConfig: {
        utilityType: 'illusion',
        selectedEffects: [{
          id: 'illusionary_duplicates',
          name: 'Illusionary Duplicates',
          description: 'At higher Wild Instinct tiers, create 1-2 illusionary duplicates that confuse enemies'
        }],
        duration: 1,
        durationUnit: 'minutes',
        concentration: false,
        power: 'moderate'
      },

      wildInstinctScaling: {
        minCost: 1,
        maxCost: 5,
        tiers: [
          { cost: 1, effect: 'Advantage on Stealth checks for 1 minute' },
          { cost: 2, effect: 'Become invisible for 1 minute or until you attack' },
          { cost: 3, effect: 'Teleport to darkness within 30 feet and become invisible' },
          { cost: 4, effect: 'Create 1 illusionary duplicate for 1 minute' },
          { cost: 5, effect: 'Become invisible and create 2 illusionary duplicates' }
        ]
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 0
      },

      durationConfig: {
        type: 'timed',
        value: 1,
        unit: 'minutes',
        concentration: false,
        breakCondition: 'Attacking or taking damage'
      },

      legacyResourceCost: {
        wildInstinct: {
          min: 1,
          max: 5,
          description: 'Spend 1-5 Wild Instinct for escalating stealth effects'
        }
      },

      resolution: 'AUTOMATIC',

      effects: {
        tier1: {
          wiCost: 1,
          effect: 'Advantage on Stealth checks for 1 minute'
        },
        tier2: {
          wiCost: 2,
          effect: 'Become invisible for 1 minute or until you attack'
        },
        tier3: {
          wiCost: 3,
          effect: 'Teleport to darkness within 30 feet and become invisible'
        },
        tier4: {
          wiCost: 4,
          effect: 'Create 1 illusionary duplicate for 1 minute'
        },
        tier5: {
          wiCost: 5,
          effect: 'Become invisible and create 2 illusionary duplicates'
        }
      },

      specialMechanics: {
        shadowTeleport: {
          description: 'At tier 3+, can teleport to any area of dim light or darkness',
          range: 30
        },
        illusions: {
          description: 'Duplicates mimic your movements and confuse enemies',
          duration: '1 minute'
        }
      },

      tags: ['stealth', 'invisibility', 'illusion', 'nightstalker', 'utility'],
      flavorText: 'The shadows embrace those who walk in darkness.'
    },

    // ===== IRONHIDE FORM (BEAR) =====
    {
      id: 'fb_roaring_assault',
      name: 'Roaring Assault',
      description: 'Unleash a devastating roar that damages and controls enemies. Effects scale with Wild Instinct.',
      spellType: 'ACTION',
      icon: 'ability_druid_demoralizingroar',
      school: 'Physical',
      level: 4,
      specialization: 'ironhide',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        type: 'AOE',
        range: 10,
        rangeUnit: 'feet',
        aoeType: 'RADIUS',
        aoeSize: 10,
        requiresLineOfSight: false
      },

      resourceCost: {
        wildInstinct: {
          min: 1,
          max: 5,
          description: 'Spend 1-5 Wild Instinct for escalating AoE effects'
        }
      },

      resolution: 'SAVING_THROW',
      savingThrow: {
        ability: 'constitution',
        dc: 14,
        onSuccess: 'Half damage',
        onFailure: 'Full damage and additional effects'
      },

      damageConfig: {
        baseDamage: {
          diceCount: 1,
          diceType: 6,
          damageType: 'thunder',
          scaling: 'per_wi_spent'
        }
      },

      effects: {
        tier1: {
          wiCost: 1,
          damage: '1d6',
          effect: 'None'
        },
        tier2: {
          wiCost: 2,
          damage: '2d6',
          effect: 'Cause fear in enemies within 10 feet for 1 round'
        },
        tier3: {
          wiCost: 3,
          damage: '3d6',
          effect: 'Knock back enemies 10 feet'
        },
        tier4: {
          wiCost: 4,
          damage: '4d6',
          effect: 'Stun enemies within 10 feet for 1 round'
        },
        tier5: {
          wiCost: 5,
          damage: '5d6',
          effect: 'Knock enemies prone within 10 feet'
        }
      },

      specialMechanics: {
        fearEffect: {
          description: 'Frightened enemies have disadvantage on attack rolls',
          duration: '1 round'
        },
        knockback: {
          description: 'Enemies are pushed away from you',
          distance: 10
        }
      },

      tags: ['aoe', 'thunder', 'crowd-control', 'ironhide', 'feral-shifter'],
      flavorText: 'The bear\'s roar shakes the very earth.'
    },

    {
      id: 'fb_fortress_of_fur',
      name: 'Fortress of Fur',
      description: 'Harden your hide to absorb damage and gain defensive bonuses. Ultimate tier grants temporary invulnerability.',
      spellType: 'ACTION',
      icon: 'spell_nature_stoneclawtotem',
      school: 'Abjuration',
      level: 3,
      specialization: 'ironhide',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        type: 'SELF',
        range: 0,
        rangeUnit: 'self'
      },

      durationConfig: {
        type: 'timed',
        value: 1,
        unit: 'minutes',
        concentration: false
      },

      resourceCost: {
        wildInstinct: {
          min: 1,
          max: 5,
          description: 'Spend 1-5 Wild Instinct for escalating defensive effects'
        }
      },

      resolution: 'AUTOMATIC',

      effects: {
        tier1: {
          wiCost: 1,
          effect: 'Gain 1d6 temporary HP'
        },
        tier2: {
          wiCost: 2,
          effect: 'Gain 2d6 temporary HP and resistance to physical damage'
        },
        tier3: {
          wiCost: 3,
          effect: 'Gain 3d6 temporary HP and immunity to physical damage'
        },
        tier4: {
          wiCost: 4,
          effect: 'Gain 4d6 temporary HP and reflect 50% of melee damage'
        },
        tier5: {
          wiCost: 5,
          effect: 'Gain 5d6 temporary HP and immunity to all damage types'
        }
      },

      specialMechanics: {
        damageReflection: {
          description: 'At tier 4+, reflect melee damage back to attackers',
          percentage: 50
        },
        temporaryInvulnerability: {
          description: 'Tier 5 grants brief immunity to all damage',
          duration: '1 minute'
        }
      },

      tags: ['defense', 'temporary-hp', 'resistance', 'ironhide', 'restoration-shifter'],
      flavorText: 'The bear\'s hide becomes as hard as stone.'
    },

    // ===== SKYHUNTER FORM (HAWK) =====
    {
      id: 'fb_talon_dive',
      name: 'Talon Dive',
      description: 'Dive from above with razor-sharp talons, grappling and stunning enemies.',
      spellType: 'ACTION',
      icon: 'ability_druid_flightform',
      school: 'Physical',
      level: 3,
      specialization: 'skyhunter',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        type: 'SINGLE',
        range: 30,
        rangeUnit: 'feet',
        requiresLineOfSight: true,
        allowFriendly: false
      },

      resourceCost: {
        wildInstinct: {
          min: 1,
          max: 5,
          description: 'Spend 1-5 Wild Instinct for escalating dive effects'
        }
      },

      resolution: 'ATTACK_ROLL',

      damageConfig: {
        baseDamage: {
          diceCount: 1,
          diceType: 6,
          damageType: 'slashing',
          scaling: 'per_wi_spent'
        }
      },

      effects: {
        tier1: {
          wiCost: 1,
          damage: '1d6',
          effect: 'None'
        },
        tier2: {
          wiCost: 2,
          damage: '2d6',
          effect: 'Apply Grappled condition'
        },
        tier3: {
          wiCost: 3,
          damage: '3d6',
          effect: 'Stun target for 1 round'
        },
        tier4: {
          wiCost: 4,
          damage: '4d6',
          effect: 'Reduce target attack rolls by 50% for 2 rounds'
        },
        tier5: {
          wiCost: 5,
          damage: '5d6',
          effect: 'Paralyze target for 1 round'
        }
      },

      specialMechanics: {
        aerialAdvantage: {
          description: 'Gain advantage on attack roll if you have flight active',
          bonus: 'Advantage on attack'
        },
        grapple: {
          description: 'Grappled targets cannot move and have disadvantage on attacks',
          duration: 'Until escape (Athletics/Acrobatics check)'
        }
      },

      tags: ['physical', 'aerial', 'grapple', 'skyhunter', 'feral-shifter'],
      flavorText: 'From the skies, the hunter descends.'
    },

    {
      id: 'fb_winds_grace',
      name: 'Wind\'s Grace',
      description: 'Harness the power of wind for enhanced perception, flight, and devastating wind attacks.',
      spellType: 'ACTION',
      icon: 'spell_nature_cyclone',
      school: 'Evocation',
      level: 4,
      specialization: 'skyhunter',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        type: 'VARIES',
        range: 30,
        rangeUnit: 'feet'
      },

      durationConfig: {
        type: 'varies',
        value: 1,
        unit: 'minutes'
      },

      resourceCost: {
        wildInstinct: {
          min: 1,
          max: 5,
          description: 'Spend 1-5 Wild Instinct for escalating wind effects'
        }
      },

      resolution: 'VARIES',

      effects: {
        tier1: {
          wiCost: 1,
          effect: 'Advantage on Perception checks for 1 hour'
        },
        tier2: {
          wiCost: 2,
          effect: 'Gain flight speed equal to walking speed for 1 minute'
        },
        tier3: {
          wiCost: 3,
          effect: 'Summon gust pushing enemies back 10 feet (Str save DC 14)'
        },
        tier4: {
          wiCost: 4,
          effect: 'Gain flight and wind barrier granting +2 AC for 1 minute'
        },
        tier5: {
          wiCost: 5,
          effect: 'Summon tornado dealing 3d6 damage and throwing enemies 20 feet'
        }
      },

      specialMechanics: {
        flightMobility: {
          description: 'Flight allows you to ignore difficult terrain and avoid ground hazards',
          speed: 'Equal to walking speed'
        },
        tornado: {
          description: 'Tier 5 creates a devastating tornado in a 15-foot radius',
          damage: '3d6',
          knockback: 20
        }
      },

      tags: ['utility', 'flight', 'wind', 'aoe', 'skyhunter', 'balance-shifter'],
      flavorText: 'The winds obey those who soar among them.'
    },

    // ===== FROSTFANG FORM (WOLF) =====
    {
      id: 'fb_frostbite_strike',
      name: 'Frostbite Strike',
      description: 'Bite with frost-infused fangs, dealing cold damage and applying slowing effects.',
      spellType: 'ACTION',
      icon: 'spell_frost_frostbolt',
      school: 'Evocation',
      level: 3,
      specialization: 'frostfang',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        type: 'SINGLE',
        range: 5,
        rangeUnit: 'feet',
        requiresLineOfSight: true,
        allowFriendly: false
      },

      resourceCost: {
        wildInstinct: {
          min: 1,
          max: 5,
          description: 'Spend 1-5 Wild Instinct for escalating frost effects'
        }
      },

      resolution: 'ATTACK_ROLL',

      damageConfig: {
        baseDamage: {
          diceCount: 1,
          diceType: 6,
          damageType: 'frost',
          scaling: 'per_wi_spent'
        }
      },

      effects: {
        tier1: {
          wiCost: 1,
          damage: '1d6 cold',
          effect: 'None'
        },
        tier2: {
          wiCost: 2,
          damage: '2d6 cold',
          effect: 'Apply Slowed (movement speed reduced by 50%)'
        },
        tier3: {
          wiCost: 3,
          damage: '3d6 cold',
          effect: 'Freeze target for 1 round (cannot move or act)'
        },
        tier4: {
          wiCost: 4,
          damage: '4d6 cold',
          effect: 'Reduce target attack rolls by 50% for 2 rounds'
        },
        tier5: {
          wiCost: 5,
          damage: '5d6 cold',
          effect: 'Paralyze target for 1 round'
        }
      },

      specialMechanics: {
        frostEffect: {
          description: 'Cold damage slows enemies and reduces their effectiveness',
          duration: 'Varies by tier'
        },
        freeze: {
          description: 'Frozen targets are incapacitated and vulnerable to shattering',
          vulnerability: 'Bludgeoning damage'
        }
      },

      tags: ['cold', 'physical', 'crowd-control', 'frostfang', 'feral-shifter'],
      flavorText: 'The wolf\'s bite carries the chill of winter.'
    },

    {
      id: 'fb_pack_leaders_call',
      name: 'Pack Leader\'s Call',
      description: 'Summon spectral wolves to fight alongside you and empower your allies.',
      spellType: 'ACTION',
      icon: 'spell_nature_spiritwolf',
      school: 'Conjuration',
      level: 4,
      specialization: 'frostfang',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        type: 'VARIES',
        range: 30,
        rangeUnit: 'feet'
      },

      durationConfig: {
        type: 'timed',
        value: 1,
        unit: 'minutes',
        concentration: false
      },

      resourceCost: {
        wildInstinct: {
          min: 1,
          max: 5,
          description: 'Spend 1-5 Wild Instinct for escalating pack effects'
        }
      },

      resolution: 'AUTOMATIC',

      effects: {
        tier1: {
          wiCost: 1,
          effect: 'Advantage on tracking checks for 1 hour'
        },
        tier2: {
          wiCost: 2,
          effect: 'Summon 1 spectral wolf (AC 13, HP 15, Attack +5 for 1d6+2 damage)'
        },
        tier3: {
          wiCost: 3,
          effect: 'Summon 2 spectral wolves'
        },
        tier4: {
          wiCost: 4,
          effect: 'Summon wolf pack granting allies advantage on attacks for 1 minute'
        },
        tier5: {
          wiCost: 5,
          effect: 'Summon alpha wolf (AC 15, HP 30, Attack +7 for 2d8+3, grants +2 AC to allies)'
        }
      },

      specialMechanics: {
        spectralWolves: {
          description: 'Summoned wolves act on your turn and follow your commands',
          duration: '1 minute'
        },
        packTactics: {
          description: 'Wolves and allies gain advantage when attacking the same target',
          bonus: 'Advantage on attack rolls'
        },
        alphaWolf: {
          description: 'Tier 5 alpha wolf is a powerful summon with enhanced stats',
          stats: 'AC 15, HP 30, +7 to hit, 2d8+3 damage'
        }
      },

      tags: ['summoning', 'pack-tactics', 'support', 'frostfang', 'restoration-shifter'],
      flavorText: 'The pack answers the call of their leader.'
    },

    // ===== UNIVERSAL SPELLS (ALL FORMS) =====
    {
      id: 'fb_natures_grasp',
      name: 'Nature\'s Grasp',
      description: 'Vines erupt from the ground to restrain a target.',
      spellType: 'ACTION',
      icon: 'spell_nature_stranglevines',
      school: 'Conjuration',
      level: 1,
      specialization: 'universal',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        type: 'SINGLE',
        range: 30,
        rangeUnit: 'feet',
        requiresLineOfSight: true,
        allowFriendly: false
      },

      durationConfig: {
        type: 'timed',
        value: 1,
        unit: 'minutes',
        concentration: true
      },

      resourceCost: {
        mana: 2
      },

      resolution: 'SAVING_THROW',
      savingThrow: {
        ability: 'strength',
        dc: 13,
        onSuccess: 'No effect',
        onFailure: 'Restrained'
      },

      specialMechanics: {
        restrainedCondition: {
          description: 'Restrained creatures have speed 0 and disadvantage on Dex saves',
          escape: 'Strength or Acrobatics check DC 13'
        }
      },

      tags: ['crowd-control', 'nature', 'universal', 'all-specs'],
      flavorText: 'Nature itself reaches out to bind your foes.'
    },

    {
      id: 'fb_healing_touch',
      name: 'Healing Touch',
      description: 'Channel nature\'s healing energy to restore an ally\'s health.',
      spellType: 'ACTION',
      icon: 'spell_nature_healingtouch',
      school: 'Evocation',
      level: 2,
      specialization: 'universal',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        type: 'SINGLE',
        range: 30,
        rangeUnit: 'feet',
        requiresLineOfSight: true,
        allowFriendly: true,
        allowSelf: true
      },

      resourceCost: {
        mana: 2
      },

      resolution: 'AUTOMATIC',

      healingConfig: {
        baseHealing: {
          diceCount: 1,
          diceType: 4,
          flatBonus: 0
        }
      },

      specialMechanics: {
        restorationShifterBonus: {
          description: 'Restoration Shifters can cast this while shapeshifted for 1 less mana',
          manaCost: 1
        }
      },

      tags: ['healing', 'support', 'universal', 'all-specs', 'restoration-shifter'],
      flavorText: 'Life flows through your touch, mending wounds.'
    },

    {
      id: 'fb_wild_shape_partial',
      name: 'Wild Shape (Partial)',
      description: 'Transform part of your body into an animal feature, gaining temporary abilities.',
      spellType: 'ACTION',
      icon: 'ability_druid_wildmark',
      school: 'Transmutation',
      level: 2,
      specialization: 'universal',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        type: 'SELF',
        range: 0,
        rangeUnit: 'self'
      },

      durationConfig: {
        type: 'timed',
        value: 1,
        unit: 'minutes',
        concentration: false
      },

      resourceCost: {
        mana: 2
      },

      resolution: 'AUTOMATIC',

      effects: {
        claws: {
          description: 'Grow claws for climbing',
          benefit: 'Climbing speed equal to walking speed'
        },
        wings: {
          description: 'Sprout wings for gliding',
          benefit: 'Glide up to 60 feet when falling'
        },
        gills: {
          description: 'Develop gills for breathing underwater',
          benefit: 'Breathe underwater for 1 minute'
        },
        enhancedSenses: {
          description: 'Enhance senses like a predator',
          benefit: 'Advantage on Perception checks for 1 minute'
        }
      },

      specialMechanics: {
        partialTransformation: {
          description: 'Unlike full forms, partial transformations don\'t prevent spellcasting',
          note: 'Can be used alongside other abilities'
        }
      },

      tags: ['transformation', 'utility', 'universal', 'all-specs', 'balance-shifter'],
      flavorText: 'The wild flows through you, reshaping your form.'
    }
  ],

  // Comprehensive Spell List (Levels 1-10, 3 spells each, following template)
  spells: [
    // ===== LEVEL 1 SPELLS (Already has 1, need 2 more) =====
    {
      id: 'formbender_primal_strike',
      name: 'Primal Strike',
      description: 'Channel primal energy into a devastating melee attack.',
      level: 1,
      spellType: 'ACTION',
      effectTypes: ['damage'],
      typeConfig: {
        school: 'nature',
        icon: 'ability_druid_ferociousbite',
        tags: ['attack', 'damage', 'physical', 'formbender'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },
      damageConfig: {
        formula: '2d8 + strength',
        elementType: 'bludgeoning',
        damageType: 'direct',
        criticalConfig: {
          enabled: true,
          critType: 'dice',
          critMultiplier: 2,
          critDiceOnly: false,
          extraDice: '1d8',
          critEffects: ['wild_instinct_gain'],
          wildInstinctGainConfig: {
            amount: 1
          }
        }
      },
      targetingConfig: {
        targetingType: 'single',
        rangeType: 'touch',
        targetRestrictions: ['enemy'],
        maxTargets: 1,
        targetSelectionMethod: 'manual',
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: ['wild_instinct'],
        resourceValues: { wild_instinct: 1 },
        useFormulas: {},
        actionPoints: 1
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 0
      },
      resolution: 'DICE',
      tags: ['attack', 'damage', 'physical', 'formbender']
    },

    {
      id: 'formbender_wild_regeneration',
      name: 'Wild Regeneration',
      description: 'Channel primal healing energy to restore your vitality.',
      level: 1,
      spellType: 'ACTION',
      effectTypes: ['healing'],
      typeConfig: {
        school: 'nature',
        icon: 'spell_nature_rejuvenation',
        tags: ['healing', 'support', 'nature', 'formbender'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },
      healingConfig: {
        formula: '2d6 + constitution',
        healingType: 'instant',
        hasHotEffect: true,
        hotFormula: '1d6',
        hotDuration: 2,
        hotTickType: 'round',
        isProgressiveHot: false
      },
      targetingConfig: {
        targetingType: 'self'
      },
      resourceCost: {
        resourceTypes: ['wild_instinct'],
        resourceValues: { wild_instinct: 1 },
        useFormulas: {},
        actionPoints: 1
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 2
      },
      resolution: 'DICE',
      tags: ['healing', 'support', 'nature', 'formbender']
    },

    // ===== LEVEL 2 SPELLS (Already has 3, complete) =====

    // ===== LEVEL 3 SPELLS (Already has 4, complete) =====

    // ===== LEVEL 4 SPELLS (Already has 3, complete) =====

    // ===== LEVEL 2 SPELLS =====
    {
      id: 'formbender_beast_claws',
      name: 'Beast Claws',
      description: 'Grow razor-sharp claws that enhance your natural attacks.',
      spellType: 'ACTION',
      icon: 'ability_druid_rake',
      school: 'Physical',
      level: 2,
      specialization: 'universal',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE',
        tags: ['physical', 'buff', 'damage', 'formbender']
      },

      targetingConfig: {
        targetingType: 'self'
      },

      resourceCost: {
        resourceTypes: ['wild_instinct'],
        resourceValues: { wild_instinct: 1 },
        useFormulas: {},
        actionPoints: 1,
        components: ['somatic'],
        somaticText: 'Grow razor-sharp claws'
      },

      resolution: 'DICE',
      effectTypes: ['buff'],

      buffConfig: {
        buffType: 'statEnhancement',
        effects: [{
          id: 'beast_claws',
          name: 'Beast Claws',
          description: 'Your unarmed attacks deal slashing damage and gain +2d6 damage for 1 minute',
          statModifier: {
            stat: 'damage',
            magnitude: '2d6',
            magnitudeType: 'dice'
          }
        }],
        durationValue: 1,
        durationType: 'minutes',
        durationUnit: 'minutes',
        concentrationRequired: false,
        canBeDispelled: true
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 0
      },

      tags: ['physical', 'buff', 'damage', 'formbender']
    },

    {
      id: 'formbender_primal_senses',
      name: 'Primal Senses',
      description: 'Heighten your senses to detect hidden threats and track prey.',
      spellType: 'ACTION',
      icon: 'ability_druid_supriseattack',
      school: 'Physical',
      level: 2,
      specialization: 'universal',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE',
        tags: ['buff', 'senses', 'utility', 'formbender']
      },

      targetingConfig: {
        targetingType: 'self'
      },

      resourceCost: {
        resourceTypes: ['wild_instinct'],
        resourceValues: { wild_instinct: 1 },
        useFormulas: {},
        actionPoints: 1,
        components: ['somatic'],
        somaticText: 'Heighten your senses'
      },

      resolution: 'DICE',
      effectTypes: ['buff'],

      buffConfig: {
        buffType: 'statEnhancement',
        effects: [{
          id: 'primal_senses',
          name: 'Primal Senses',
          description: 'Gain advantage on Perception checks and can detect invisible creatures for 1 hour',
          statModifier: {
            stat: 'perception',
            magnitude: 'advantage',
            magnitudeType: 'advantage'
          }
        }],
        durationValue: 1,
        durationType: 'hours',
        durationUnit: 'hours',
        concentrationRequired: false,
        canBeDispelled: true
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 0
      },

      tags: ['buff', 'senses', 'utility', 'formbender']
    },

    {
      id: 'formbender_wild_leap',
      name: 'Wild Leap',
      description: 'Leap incredible distances, using primal strength to cover ground quickly.',
      spellType: 'ACTION',
      icon: 'ability_druid_dash',
      school: 'Physical',
      level: 2,
      specialization: 'universal',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE',
        tags: ['utility', 'movement', 'mobility', 'formbender']
      },

      targetingConfig: {
        targetingType: 'ground',
        rangeType: 'ranged',
        rangeDistance: 60,
        targetRestrictions: [],
        maxTargets: 1,
        targetSelectionMethod: 'manual',
        requiresLineOfSight: false
      },

      resourceCost: {
        resourceTypes: ['wild_instinct'],
        resourceValues: { wild_instinct: 1 },
        useFormulas: {},
        actionPoints: 1,
        components: ['somatic'],
        somaticText: 'Leap incredible distances'
      },

      resolution: 'DICE',
      effectTypes: ['utility'],

      utilityConfig: {
        utilityType: 'movement',
        selectedEffects: [{
          id: 'wild_leap',
          name: 'Wild Leap',
          description: 'Leap up to 60 feet in any direction, ignoring difficult terrain'
        }],
        duration: 1,
        durationUnit: 'rounds',
        concentration: false,
        power: 'moderate'
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 2
      },

      tags: ['utility', 'movement', 'mobility', 'formbender']
    },

    // ===== LEVEL 3 SPELLS =====
    {
      id: 'formbender_feral_rage',
      name: 'Feral Rage',
      description: 'Tap into primal fury, gaining temporary strength and ferocity.',
      spellType: 'ACTION',
      icon: 'ability_druid_berserk',
      school: 'Physical',
      level: 3,
      specialization: 'universal',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE',
        tags: ['buff', 'damage', 'rage', 'formbender']
      },

      targetingConfig: {
        targetingType: 'self'
      },

      resourceCost: {
        resourceTypes: ['wild_instinct'],
        resourceValues: { wild_instinct: 2 },
        useFormulas: {},
        actionPoints: 1,
        components: ['somatic'],
        somaticText: 'Tap into primal fury'
      },

      resolution: 'DICE',
      effectTypes: ['buff'],

      buffConfig: {
        buffType: 'statEnhancement',
        effects: [{
          id: 'feral_rage',
          name: 'Feral Rage',
          description: 'Gain +2 Strength and advantage on attack rolls for 1 minute',
          statModifier: {
            stat: 'strength',
            magnitude: 2,
            magnitudeType: 'flat'
          }
        }],
        durationValue: 1,
        durationType: 'minutes',
        durationUnit: 'minutes',
        concentrationRequired: true,
        canBeDispelled: true
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 3
      },

      tags: ['buff', 'damage', 'rage', 'formbender']
    },

    {
      id: 'formbender_natures_armor',
      name: 'Nature\'s Armor',
      description: 'Grow thick natural armor that protects you from harm.',
      spellType: 'ACTION',
      icon: 'spell_nature_spiritarmor',
      school: 'Physical',
      level: 3,
      specialization: 'universal',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE',
        tags: ['buff', 'defense', 'armor', 'formbender']
      },

      targetingConfig: {
        targetingType: 'self'
      },

      resourceCost: {
        resourceTypes: ['wild_instinct'],
        resourceValues: { wild_instinct: 2 },
        useFormulas: {},
        actionPoints: 1,
        components: ['somatic'],
        somaticText: 'Grow thick natural armor'
      },

      resolution: 'DICE',
      effectTypes: ['buff'],

      buffConfig: {
        buffType: 'statEnhancement',
        effects: [{
          id: 'natures_armor',
          name: 'Nature\'s Armor',
          description: 'Gain +3 armor and resistance to physical damage for 10 minutes',
          statModifier: {
            stat: 'armor',
            magnitude: 3,
            magnitudeType: 'flat'
          }
        }],
        durationValue: 10,
        durationType: 'minutes',
        durationUnit: 'minutes',
        concentrationRequired: false,
        canBeDispelled: true
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 0
      },

      tags: ['buff', 'defense', 'armor', 'formbender']
    },

    {
      id: 'formbender_hunt_call',
      name: 'Hunt Call',
      description: 'Call forth spectral hunters to aid you in tracking and pursuing prey.',
      spellType: 'ACTION',
      icon: 'ability_hunter_beastcall',
      school: 'Physical',
      level: 3,
      specialization: 'universal',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE',
        tags: ['summoning', 'utility', 'tracking', 'formbender']
      },

      targetingConfig: {
        targetingType: 'ground',
        rangeType: 'ranged',
        rangeDistance: 30,
        targetRestrictions: [],
        maxTargets: 0,
        targetSelectionMethod: 'manual',
        requiresLineOfSight: true
      },

      resourceCost: {
        resourceTypes: ['wild_instinct'],
        resourceValues: { wild_instinct: 2 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal'],
        verbalText: 'Call forth spectral hunters'
      },

      resolution: 'DICE',
      effectTypes: ['summoning'],

      summonConfig: {
        creatures: [{
          id: 'spectral_hunter',
          name: 'Spectral Hunter',
          description: 'A ghostly wolf that aids in tracking and hunting',
          size: 'Medium',
          type: 'spirit',
          tokenIcon: 'ability_hunter_pet_wolf',
          stats: {
            maxHp: 20,
            armor: 12,
            maxMana: 0
          },
          config: {
            quantity: 2,
            duration: 1,
            durationUnit: 'hours',
            hasDuration: true,
            concentration: false,
            controlType: 'mental',
            controlRange: 30
          }
        }],
        duration: 1,
        durationUnit: 'hours',
        hasDuration: true,
        concentration: false,
        controlRange: 30,
        controlType: 'mental'
      },

      cooldownConfig: {
        type: 'short_rest',
        value: 1
      },

      tags: ['summoning', 'utility', 'tracking', 'formbender']
    },

    // ===== LEVEL 4 SPELLS =====
    {
      id: 'formbender_savage_charge',
      name: 'Savage Charge',
      description: 'Charge forward with primal fury, dealing massive damage and knocking down enemies for 1 round. Targets must save or be knocked prone.',
      spellType: 'ACTION',
      icon: 'ability_hunter_charge',
      school: 'Physical',
      level: 4,
      specialization: 'universal',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE',
        tags: ['attack', 'damage', 'control', 'charge', 'formbender']
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 40,
        aoeShape: 'line',
        aoeParameters: { length: 40, width: 5 },
        targetRestrictions: ['enemy'],
        maxTargets: 5,
        targetSelectionMethod: 'automatic',
        requiresLineOfSight: true
      },

      resourceCost: {
        resourceTypes: ['wild_instinct'],
        resourceValues: { wild_instinct: 3 },
        useFormulas: {},
        actionPoints: 2,
        components: ['somatic'],
        somaticText: 'Charge forward with primal fury'
      },

      resolution: 'SAVE',
      effectTypes: ['damage', 'control'],

      damageConfig: {
        formula: '3d8 + strength',
        elementType: 'bludgeoning',
        damageType: 'direct',
        description: 'Charge attack that knocks down enemies in your path'
      },

      controlConfig: {
        controlType: 'knockdown',
        strength: 'moderate',
        duration: 1,
        durationUnit: 'rounds',
        saveDC: 15,
        saveType: 'strength',
        savingThrow: true,
        effects: [{
          id: 'knockdown',
          name: 'Knocked Down',
          description: 'Target is knocked prone for 1 round',
          config: {}
        }]
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 3
      },

      tags: ['attack', 'damage', 'control', 'charge', 'formbender']
    },

    {
      id: 'formbender_primal_healing',
      name: 'Primal Healing',
      description: 'Channel the restorative power of nature to heal wounds and remove afflictions.',
      spellType: 'ACTION',
      icon: 'spell_nature_healingwavegreater',
      school: 'Physical',
      level: 4,
      specialization: 'universal',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE',
        tags: ['healing', 'support', 'restoration', 'formbender']
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 30,
        targetRestrictions: ['ally', 'self'],
        maxTargets: 1,
        targetSelectionMethod: 'manual',
        requiresLineOfSight: true
      },

      resourceCost: {
        resourceTypes: ['wild_instinct'],
        resourceValues: { wild_instinct: 3 },
        useFormulas: {},
        actionPoints: 1,
        components: ['somatic'],
        somaticText: 'Channel restorative nature energy'
      },

      resolution: 'DICE',
      effectTypes: ['healing'],

      healingConfig: {
        formula: '3d8 + spirit',
        healingType: 'instant',
        hasHotEffect: true,
        hotFormula: '1d8',
        hotDuration: 3,
        hotTickType: 'round',
        isProgressiveHot: false,
        description: 'Heal a target and remove one disease or poison effect'
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 2
      },

      tags: ['healing', 'support', 'restoration', 'formbender']
    },

    {
      id: 'formbender_beast_form_partial',
      name: 'Beast Form (Partial)',
      description: 'Take on aspects of one of your forms for 1 minute without fully transforming. Gain benefits of one form aspect: Nightstalker (stealth), Ironhide (armor), Skyhunter (flight), or Frostfang (pack tactics).',
      spellType: 'ACTION',
      icon: 'ability_druid_supriseattack',
      school: 'Physical',
      level: 4,
      specialization: 'universal',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE',
        tags: ['transformation', 'buff', 'partial', 'formbender']
      },

      targetingConfig: {
        targetingType: 'self'
      },

      resourceCost: {
        resourceTypes: ['wild_instinct'],
        resourceValues: { wild_instinct: 2 },
        useFormulas: {},
        actionPoints: 1,
        components: ['somatic'],
        somaticText: 'Take on beast aspects'
      },

      resolution: 'NONE',
      effectTypes: ['buff'],

      buffConfig: {
        buffType: 'statEnhancement',
        effects: [{
          id: 'beast_form_partial',
          name: 'Beast Form (Partial)',
          description: 'Gain benefits of one form aspect for 1 minute'
        }],
        durationValue: 1,
        durationType: 'minutes',
        durationUnit: 'minutes',
        concentrationRequired: false,
        canBeDispelled: true
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 3
      },

      tags: ['transformation', 'buff', 'partial', 'formbender']
    },

    // ===== LEVEL 5 SPELLS =====
    {
      id: 'formbender_pack_leader',
      name: 'Pack Leader',
      description: 'Summon 3 spectral wolves to fight alongside you for 5 rounds, empowering your pack tactics. You and the wolves gain +2 to attack rolls when adjacent to each other.',
      level: 5,
      spellType: 'ACTION',
      effectTypes: ['summoning', 'buff'],
      typeConfig: {
        school: 'nature',
        icon: 'ability_hunter_pet_wolf',
        tags: ['summoning', 'buff', 'pack', 'formbender'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },
      summonConfig: {
        creatures: [{
          id: 'spectral_wolf',
          name: 'Spectral Wolf',
          description: 'A ghostly wolf made of primal energy',
          size: 'Medium',
          type: 'spirit',
          tokenIcon: 'ability_hunter_pet_wolf',
          stats: {
            maxHp: 35,
            armor: 13,
            maxMana: 0
          },
          config: {
            quantity: 3,
            duration: 5,
            durationUnit: 'rounds',
            hasDuration: true,
            concentration: false,
            controlType: 'mental',
            controlRange: 60
          }
        }],
        duration: 5,
        durationUnit: 'rounds',
        hasDuration: true,
        concentration: false,
        controlRange: 60,
        controlType: 'mental'
      },
      buffConfig: {
        buffType: 'statEnhancement',
        effects: [{
          id: 'pack_tactics',
          name: 'Pack Tactics',
          description: 'You and summoned wolves gain +2 to attack rolls when adjacent to each other for 5 rounds',
          statModifier: {
            stat: 'attack_rolls',
            magnitude: 2,
            magnitudeType: 'flat'
          }
        }],
        durationValue: 5,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: false,
        canBeDispelled: true
      },
      targetingConfig: {
        targetingType: 'ground',
        rangeType: 'ranged',
        rangeDistance: 40,
        targetRestrictions: [],
        maxTargets: 0,
        targetSelectionMethod: 'manual',
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: ['wild_instinct'],
        resourceValues: { wild_instinct: 3 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'short_rest',
        value: 1
      },
      resolution: 'DICE',
      tags: ['summoning', 'buff', 'pack', 'formbender']
    },

    {
      id: 'formbender_primal_rage',
      name: 'Primal Rage',
      description: 'Channel wild fury into a devastating multi-attack.',
      level: 5,
      spellType: 'ACTION',
      effectTypes: ['damage'],
      typeConfig: {
        school: 'nature',
        icon: 'ability_druid_ravage',
        tags: ['attack', 'damage', 'physical', 'multi-hit', 'formbender'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },
      damageConfig: {
        formula: '4d6 + strength',
        elementType: 'slashing',
        damageType: 'direct',
        description: 'Make 3 rapid claw attacks at the target'
      },
      targetingConfig: {
        targetingType: 'single',
        rangeType: 'touch',
        targetRestrictions: ['enemy'],
        maxTargets: 1,
        targetSelectionMethod: 'manual',
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: ['wild_instinct'],
        resourceValues: { wild_instinct: 3 },
        useFormulas: {},
        actionPoints: 2,
        components: ['somatic']
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 3
      },
      resolution: 'DICE',
      tags: ['attack', 'damage', 'physical', 'multi-hit', 'formbender']
    },

    {
      id: 'formbender_adaptive_form',
      name: 'Adaptive Form',
      description: 'Shift between forms instantly without cost for 3 rounds. All form transformations are free (cost 0 Wild Instinct), allowing rapid adaptation to combat situations.',
      level: 5,
      spellType: 'ACTION',
      effectTypes: ['buff', 'utility'],
      typeConfig: {
        school: 'nature',
        icon: 'ability_druid_catform',
        tags: ['buff', 'utility', 'transformation', 'formbender'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },
      buffConfig: {
        buffType: 'custom',
        effects: [{
          id: 'adaptive_form',
          name: 'Adaptive Form',
          description: 'Form transformations are free (cost 0 Wild Instinct) for 3 rounds',
          customDescription: 'You can shift between all forms freely without paying the normal 1 Wild Instinct cost. This allows rapid adaptation to combat situations.'
        }],
        durationValue: 3,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: false,
        canBeDispelled: true
      },
      targetingConfig: {
        targetingType: 'self'
      },
      resourceCost: {
        resourceTypes: ['wild_instinct'],
        resourceValues: { wild_instinct: 2 },
        useFormulas: {},
        actionPoints: 1,
        components: ['somatic']
      },
      cooldownConfig: {
        type: 'short_rest',
        value: 1
      },
      resolution: 'DICE',
      tags: ['buff', 'utility', 'transformation', 'formbender']
    },

    // ===== LEVEL 6 SPELLS =====
    {
      id: 'formbender_titan_form',
      name: 'Titan Form',
      description: 'Transform into a massive titan, gaining incredible size and strength.',
      level: 6,
      spellType: 'ACTION',
      effectTypes: ['transformation'],
      typeConfig: {
        school: 'nature',
        icon: 'spell_nature_reincarnation',
        tags: ['transformation', 'size', 'formbender'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },
      transformationConfig: {
        transformationType: 'physical',
        targetType: 'self',
        duration: 4,
        durationUnit: 'rounds',
        power: 'major',
        newForm: 'Titan Form',
        description: 'Your body swells to massive proportions.',
        concentration: true,
        grantedAbilities: [
          { id: 'huge_size', name: 'Huge Size', description: 'Size becomes Huge, reach increases to 15 feet' },
          { id: 'titan_strength', name: '+4 Strength', description: 'Gain +4 to Strength attribute' },
          { id: 'titan_armor', name: '+3 Armor', description: 'Gain +3 armor from thickened hide' },
          { id: 'titan_hp', name: '+50 Temp HP', description: 'Gain 50 temporary hit points' }
        ]
      },
      targetingConfig: {
        targetingType: 'self'
      },
      resourceCost: {
        resourceTypes: ['wild_instinct'],
        resourceValues: { wild_instinct: 4 },
        useFormulas: {},
        actionPoints: 2,
        components: ['somatic']
      },
      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },
      resolution: 'DICE',
      tags: ['transformation', 'buff', 'size', 'formbender']
    },

    {
      id: 'formbender_primal_fury_leap',
      name: 'Primal Fury Leap',
      description: 'Leap high into the air and crash down, dealing massive AoE damage.',
      level: 6,
      spellType: 'ACTION',
      effectTypes: ['damage', 'control'],
      typeConfig: {
        school: 'nature',
        icon: 'ability_hunter_pet_cat',
        tags: ['attack', 'damage', 'control', 'aoe', 'formbender'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },
      damageConfig: {
        formula: '6d8 + strength * 1.5',
        elementType: 'bludgeoning',
        damageType: 'direct',
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'agility',
          difficultyClass: 16,
          saveOutcome: 'halves',
          partialEffect: true,
          partialEffectFormula: 'damage/2'
        }
      },
      controlConfig: {
        controlType: 'knockdown',
        strength: 'moderate',
        duration: 1,
        durationUnit: 'rounds',
        saveDC: 16,
        saveType: 'agility',
        savingThrow: true,
        effects: [{
          id: 'stagger',
          name: 'Staggered',
          description: 'Target is knocked prone and must use movement to stand',
          config: {}
        }]
      },
      targetingConfig: {
        targetingType: 'ground',
        rangeType: 'ranged',
        rangeDistance: 40,
        aoeShape: 'circle',
        aoeParameters: { radius: 20 },
        targetRestrictions: ['enemy'],
        maxTargets: 10,
        targetSelectionMethod: 'manual',
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: ['wild_instinct'],
        resourceValues: { wild_instinct: 4 },
        useFormulas: {},
        actionPoints: 2,
        components: ['somatic']
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 4
      },
      resolution: 'DICE',
      tags: ['attack', 'damage', 'control', 'aoe', 'formbender']
    },

    {
      id: 'formbender_natures_gift',
      name: "Nature's Gift",
      description: 'Heal yourself or an ally with the regenerative power of nature.',
      level: 6,
      spellType: 'ACTION',
      effectTypes: ['healing'],
      typeConfig: {
        school: 'nature',
        icon: 'spell_nature_healingtouch',
        tags: ['healing', 'support', 'nature', 'formbender'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },
      healingConfig: {
        formula: '5d8 + spirit',
        healingType: 'instant',
        hasHotEffect: true,
        hotFormula: '2d6',
        hotDuration: 3,
        hotTickType: 'round',
        isProgressiveHot: false
      },
      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 30,
        targetRestrictions: ['ally', 'self'],
        maxTargets: 1,
        targetSelectionMethod: 'manual',
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: ['wild_instinct'],
        resourceValues: { wild_instinct: 3 },
        useFormulas: {},
        actionPoints: 1,
        components: ['somatic']
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 3
      },
      resolution: 'DICE',
      tags: ['healing', 'support', 'nature', 'formbender']
    },

    // ===== LEVEL 7 SPELLS =====
    {
      id: 'formbender_primal_avatar',
      name: 'Primal Avatar',
      description: 'Transform into a primal avatar, embodying all forms simultaneously.',
      level: 7,
      spellType: 'STATE',
      effectTypes: ['transformation', 'buff'],
      typeConfig: {
        school: 'nature',
        icon: 'spell_nature_forceofnature',
        tags: ['transformation', 'buff', 'primal', 'formbender'],
        stateVisibility: 'visible',
        cooldownAfterTrigger: 0,
        cooldownUnit: 'seconds',
        maxTriggers: 1
      },
      transformationConfig: {
        transformationType: 'primal',
        targetType: 'self',
        duration: 5,
        durationUnit: 'rounds',
        power: 'major',
        newForm: 'Primal Avatar',
        description: 'Channel the essence of all primal forms simultaneously.',
        grantedAbilities: [
          { id: 'all_form_benefits', name: 'All Form Benefits', description: 'Gain the passive benefits of all four primal forms simultaneously: Feral Shifter (stealth bonuses and movement), Stormbringer (elemental damage and area effects), Earthwarden (defensive bonuses and terrain control), and Flamecaller (fire damage and burning effects). This ultimate form combines the strengths of every primal aspect.' },
          { id: 'free_switching', name: 'Free Switching', description: 'Form transitions cost 0 Wild Instinct' },
          { id: 'avatar_instinct', name: '+2 Wild Instinct/Round', description: 'Generate +2 Wild Instinct each round' },
          { id: 'avatar_stats', name: '+3 All Stats', description: 'Gain +3 to all attributes' }
        ]
      },
      buffConfig: {
        buffType: 'statEnhancement',
        effects: [{
          id: 'primal_avatar_power',
          name: 'Primal Avatar Stats',
          description: '+3 to all stats',
          statModifier: {
            stat: 'all_stats',
            magnitude: 3,
            magnitudeType: 'flat'
          }
        }],
        durationValue: 5,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: false,
        canBeDispelled: false
      },
      targetingConfig: {
        targetingType: 'self'
      },
      resourceCost: {
        resourceTypes: ['wild_instinct'],
        resourceValues: { wild_instinct: 5 },
        useFormulas: {},
        actionPoints: 3,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },
      resolution: 'DICE',
      tags: ['transformation', 'buff', 'primal', 'formbender']
    },

    {
      id: 'formbender_savage_roar',
      name: 'Savage Roar',
      description: 'Unleash a roar that terrifies all enemies and empowers allies.',
      level: 7,
      spellType: 'ACTION',
      effectTypes: ['control', 'buff'],
      typeConfig: {
        school: 'nature',
        icon: 'ability_druid_challangingroar',
        tags: ['control', 'buff', 'fear', 'aoe', 'formbender'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },
      controlConfig: {
        controlType: 'mind_control',
        strength: 'strong',
        duration: 3,
        durationUnit: 'rounds',
        saveDC: 17,
        saveType: 'spirit',
        savingThrow: true,
        effects: [{
          id: 'fear',
          name: 'Terrified',
          description: 'Enemies are frightened and must move away from you for 3 rounds',
          config: {
            fearStrength: 'strong'
          }
        }]
      },
      buffConfig: {
        buffType: 'statEnhancement',
        effects: [{
          id: 'roar_empowerment',
          name: 'Empowered by Roar',
          description: 'All allies gain +2 to damage rolls for 3 rounds',
          statModifier: {
            stat: 'damage_rolls',
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
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'circle',
        aoeParameters: { radius: 30 },
        targetRestrictions: [],
        maxTargets: 20,
        targetSelectionMethod: 'automatic',
        requiresLineOfSight: false
      },
      resourceCost: {
        resourceTypes: ['wild_instinct'],
        resourceValues: { wild_instinct: 4 },
        useFormulas: {},
        actionPoints: 2
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 4
      },
      resolution: 'DICE',
      tags: ['control', 'buff', 'fear', 'aoe', 'formbender']
    },

    {
      id: 'formbender_apex_predator',
      name: 'Apex Predator',
      description: 'Become the ultimate predator, gaining enhanced senses and lethal strikes.',
      level: 7,
      spellType: 'ACTION',
      effectTypes: ['buff', 'damage'],
      typeConfig: {
        school: 'nature',
        icon: 'ability_druid_primalprecision',
        tags: ['buff', 'damage', 'predator', 'formbender'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },
      buffConfig: {
        buffType: 'statEnhancement',
        effects: [{
          id: 'apex_predator',
          name: 'Apex Predator',
          description: 'Gain advantage on all attacks, +3d6 damage, and +10 movement speed for 4 rounds',
          statModifier: {
            stat: 'damage',
            magnitude: 3,
            magnitudeType: 'dice'
          }
        }],
        durationValue: 4,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: false,
        canBeDispelled: true
      },
      targetingConfig: {
        targetingType: 'self'
      },
      resourceCost: {
        resourceTypes: ['wild_instinct'],
        resourceValues: { wild_instinct: 4 },
        useFormulas: {},
        actionPoints: 2,
        components: ['somatic']
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 5
      },
      resolution: 'DICE',
      tags: ['buff', 'damage', 'predator', 'formbender']
    },

    // ===== LEVEL 8 SPELLS =====
    {
      id: 'formbender_savage_maelstrom',
      name: 'Savage Maelstrom',
      description: 'Transform into all forms rapidly, creating a whirlwind of savage attacks.',
      level: 8,
      spellType: 'ACTION',
      effectTypes: ['damage'],
      typeConfig: {
        school: 'nature',
        icon: 'spell_nature_cyclone',
        tags: ['attack', 'damage', 'aoe', 'transformation', 'epic', 'formbender'],
        castTime: 2,
        castTimeType: 'IMMEDIATE'
      },
      damageConfig: {
        formula: '12d8 + strength * 2 + agility * 2',
        elementType: 'slashing',
        secondaryElementType: 'bludgeoning',
        damageType: 'direct',
        description: 'Shift through all forms rapidly, attacking all nearby enemies'
      },
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'circle',
        aoeParameters: { radius: 25 },
        targetRestrictions: ['enemy'],
        maxTargets: 15,
        targetSelectionMethod: 'automatic',
        requiresLineOfSight: false
      },
      resourceCost: {
        resourceTypes: ['wild_instinct'],
        resourceValues: { wild_instinct: 5 },
        useFormulas: {},
        actionPoints: 3,
        components: ['somatic']
      },
      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },
      resolution: 'DICE',
      tags: ['attack', 'damage', 'aoe', 'transformation', 'epic', 'formbender']
    },

    {
      id: 'formbender_natures_champion',
      name: "Nature's Champion",
      description: 'Become an avatar of nature, gaining incredible resilience and power.',
      level: 8,
      spellType: 'ACTION',
      effectTypes: ['buff', 'transformation'],
      typeConfig: {
        school: 'nature',
        icon: 'spell_nature_natureguardian',
        tags: ['buff', 'transformation', 'defense', 'epic', 'formbender'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },
      transformationConfig: {
        transformationType: 'elemental',
        targetType: 'self',
        duration: 5,
        durationUnit: 'rounds',
        power: 'major',
        newForm: "Nature's Champion",
        description: 'Become one with primal nature, gaining its protection and power.',
        grantedAbilities: [
          { id: 'physical_resistance', name: 'Physical Resistance', description: 'Resistance to bludgeoning, slashing, and piercing damage' },
          { id: 'nature_regen', name: 'Primal Regeneration', description: 'Regenerate 3d10 HP at the start of each turn' },
          { id: 'reduced_costs', name: 'Primal Efficiency', description: 'All Wild Instinct costs reduced by 1' },
          { id: 'champion_stats', name: '+4 All Stats', description: 'Gain +4 to all attributes' }
        ]
      },
      buffConfig: {
        buffType: 'statEnhancement',
        effects: [
          {
            id: 'natures_champion_power',
            name: "Champion Stats",
            description: '+4 to all stats',
            statModifier: {
              stat: 'all_stats',
              magnitude: 4,
              magnitudeType: 'flat'
            }
          },
          {
            id: 'natures_champion_defense',
            name: 'Champion Defense',
            description: 'Gain 70% damage reduction for 5 rounds',
            statModifier: {
              stat: 'damage_reduction',
              magnitude: 70,
              magnitudeType: 'percentage'
            }
          }
        ],
        durationValue: 5,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: false,
        canBeDispelled: false
      },
      targetingConfig: {
        targetingType: 'self'
      },
      resourceCost: {
        resourceTypes: ['wild_instinct'],
        resourceValues: { wild_instinct: 5 },
        useFormulas: {},
        actionPoints: 3,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },
      resolution: 'DICE',
      tags: ['buff', 'transformation', 'defense', 'epic', 'formbender']
    },

    {
      id: 'formbender_wild_hunt',
      name: 'Wild Hunt',
      description: 'Summon the spirits of the wild hunt to chase down and destroy all enemies.',
      level: 8,
      spellType: 'ACTION',
      effectTypes: ['summoning', 'damage'],
      typeConfig: {
        school: 'nature',
        icon: 'ability_hunter_pet_dragonhawk',
        tags: ['summoning', 'damage', 'spirit', 'epic', 'formbender'],
        castTime: 2,
        castTimeType: 'IMMEDIATE'
      },
      summonConfig: {
        creatures: [{
          id: 'wild_hunt_spirit',
          name: 'Wild Hunt Spirit',
          description: 'Spectral hunters that chase and destroy enemies',
          size: 'Large',
          type: 'spirit',
          tokenIcon: 'ability_hunter_pet_dragonhawk',
          stats: {
            maxHp: 60,
            armor: 16,
            maxMana: 0
          },
          config: {
            quantity: 5,
            duration: 5,
            durationUnit: 'rounds',
            hasDuration: true,
            concentration: false,
            controlType: 'autonomous',
            controlRange: 0
          }
        }],
        duration: 5,
        durationUnit: 'rounds',
        hasDuration: true,
        concentration: false,
        controlRange: 0,
        controlType: 'autonomous'
      },
      damageConfig: {
        formula: '6d10 + spirit',
        elementType: 'force',
        damageType: 'direct',
        description: 'Wild Hunt spirits deal this damage to enemies they catch'
      },
      targetingConfig: {
        targetingType: 'ground',
        rangeType: 'ranged',
        rangeDistance: 60,
        aoeShape: 'circle',
        aoeParameters: { radius: 40 },
        targetRestrictions: [],
        maxTargets: 0,
        targetSelectionMethod: 'manual',
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: ['wild_instinct'],
        resourceValues: { wild_instinct: 5 },
        useFormulas: {},
        actionPoints: 3,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },
      resolution: 'DICE',
      tags: ['summoning', 'damage', 'spirit', 'epic', 'formbender']
    },

    // ===== LEVEL 9 SPELLS =====
    {
      id: 'formbender_primordial_form',
      name: 'Primordial Form',
      description: 'Transform into a primordial beast of legend, gaining godlike power.',
      level: 9,
      spellType: 'STATE',
      effectTypes: ['transformation', 'buff'],
      typeConfig: {
        school: 'nature',
        icon: 'spell_nature_wispsplode',
        tags: ['transformation', 'buff', 'primordial', 'legendary', 'formbender'],
        stateVisibility: 'visible',
        cooldownAfterTrigger: 0,
        cooldownUnit: 'seconds',
        maxTriggers: 1
      },
      transformationConfig: {
        transformationType: 'primal',
        targetType: 'self',
        duration: 4,
        durationUnit: 'rounds',
        power: 'major',
        newForm: 'Primordial Form',
        description: 'Take the form of an ancient primordial beast.',
        grantedAbilities: [
          { id: 'gargantuan_size', name: 'Gargantuan Size', description: 'Size becomes Gargantuan, reach 15 feet' },
          { id: 'primordial_resistance', name: 'Primordial Resistance', description: 'Resistance to all damage types' },
          { id: 'free_instinct', name: 'Primal Flow', description: 'All Wild Instinct abilities cost 1 less' },
          { id: 'instinct_gen', name: '+3 Wild Instinct/Round', description: 'Generate +3 Wild Instinct per round' },
          { id: 'primordial_stats', name: '+5 All Stats', description: 'Gain +5 to all attributes' }
        ]
      },
      buffConfig: {
        buffType: 'statEnhancement',
        effects: [{
          id: 'primordial_power',
          name: 'Primordial Stats',
          description: '+5 to all stats',
          statModifier: {
            stat: 'all_stats',
            magnitude: 5,
            magnitudeType: 'flat'
          }
        }],
        durationValue: 4,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: false,
        canBeDispelled: false
      },
      targetingConfig: {
        targetingType: 'self'
      },
      resourceCost: {
        resourceTypes: ['wild_instinct'],
        resourceValues: { wild_instinct: 8 },
        useFormulas: {},
        actionPoints: 4,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },
      resolution: 'DICE',
      tags: ['transformation', 'buff', 'primordial', 'legendary', 'formbender']
    },

    {
      id: 'formbender_natures_apocalypse',
      name: "Nature's Apocalypse",
      description: 'Unleash the fury of nature itself, devastating all enemies on the battlefield.',
      level: 9,
      spellType: 'ACTION',
      effectTypes: ['damage', 'control'],
      typeConfig: {
        school: 'nature',
        icon: 'spell_nature_earthquake',
        tags: ['attack', 'damage', 'control', 'aoe', 'legendary', 'formbender'],
        castTime: 4,
        castTimeType: 'IMMEDIATE'
      },
      damageConfig: {
        formula: '20d10 + strength * 2 + spirit * 2',
        elementType: 'force',
        damageType: 'direct',
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'constitution',
          difficultyClass: 19,
          saveOutcome: 'halves',
          partialEffect: true,
          partialEffectFormula: 'damage/2'
        }
      },
      controlConfig: {
        controlType: 'knockdown',
        strength: 'extreme',
        duration: 3,
        durationUnit: 'rounds',
        saveDC: 19,
        saveType: 'strength',
        savingThrow: true,
        effects: [{
          id: 'stagger',
          name: 'Devastated',
          description: 'Target is knocked prone and stunned for 3 rounds',
          config: {}
        }]
      },
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'sight',
        aoeShape: 'circle',
        aoeParameters: { radius: 100 },
        targetRestrictions: ['enemy'],
        maxTargets: 50,
        targetSelectionMethod: 'automatic',
        requiresLineOfSight: false
      },
      resourceCost: {
        resourceTypes: ['wild_instinct'],
        resourceValues: { wild_instinct: 10 },
        useFormulas: {},
        actionPoints: 5,
        components: ['verbal', 'somatic', 'material'],
        materialComponents: 'The fang of a primordial beast, worth 50,000 gold'
      },
      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },
      resolution: 'DICE',
      tags: ['attack', 'damage', 'control', 'aoe', 'legendary', 'formbender']
    },

    {
      id: 'formbender_eternal_wild',
      name: 'Eternal Wild',
      description: 'Merge permanently with the wild, gaining limitless transformations.',
      level: 9,
      spellType: 'PASSIVE',
      effectTypes: ['buff', 'transformation'],
      typeConfig: {
        school: 'nature',
        icon: 'spell_nature_tranquility',
        tags: ['buff', 'transformation', 'passive', 'legendary', 'formbender'],
        toggleable: true
      },
      buffConfig: {
        buffType: 'custom',
        effects: [{
          id: 'eternal_wild',
          name: 'Eternal Wild',
          description: 'Gain unlimited Wild Instinct, instant form transformations, and regenerate 3d10 HP per round in any form',
          customDescription: 'You have become one with the wild. You generate 5 Wild Instinct per round automatically. All form transformations are instant and free. You regenerate 3d10 HP per round in any form. Your Wild Instinct maximum is increased to 30.'
        }],
        durationValue: 0,
        durationType: 'permanent',
        durationUnit: 'permanent',
        concentrationRequired: false,
        canBeDispelled: false
      },
      targetingConfig: {
        targetingType: 'self'
      },
      resourceCost: {
        resourceTypes: [],
        resourceValues: {},
        useFormulas: {},
        actionPoints: 0,
        components: ['ritual'],
        materialComponents: 'The essence of the wild, 100,000 gold worth of natural artifacts'
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 0
      },
      resolution: 'DICE',
      tags: ['buff', 'transformation', 'passive', 'legendary', 'formbender', 'toggleable']
    },

    // ===== LEVEL 10 SPELLS =====
    {
      id: 'formbender_world_beast',
      name: 'World Beast',
      description: 'Transform into a legendary beast of immense power. The transformation is overwhelming and leaves you exhausted when it ends.',
      level: 10,
      spellType: 'ACTION',
      effectTypes: ['transformation'],
      typeConfig: {
        school: 'nature',
        icon: 'spell_nature_unyeildingstamina',
        tags: ['transformation', 'ultimate', 'formbender'],
        castTime: 2,
        castTimeType: 'IMMEDIATE'
      },
      transformationConfig: {
        transformationType: 'primal',
        targetType: 'self',
        duration: 3,
        durationUnit: 'rounds',
        power: 'major',
        newForm: 'World Beast',
        description: 'Become a colossal primal creature of legend.',
        grantedAbilities: [
          { id: 'colossal_size', name: 'Colossal Size', description: 'Size becomes Colossal, reach 20 feet' },
          { id: 'world_beast_stats', name: '+6 All Stats', description: 'Gain +6 to all attributes' },
          { id: 'damage_resistance', name: 'Damage Resistance', description: 'Resistance to all damage types (half damage)' },
          { id: 'world_beast_attacks', name: 'Devastating Attacks', description: 'All attacks deal +4d10 extra damage' },
          { id: 'world_beast_regen', name: 'Primal Regeneration', description: 'Regenerate 3d10 HP at start of each turn' },
          { id: 'world_beast_exhaustion', name: 'Exhaustion (On End)', description: 'Gain 3 levels of exhaustion when transformation ends' }
        ]
      },
      targetingConfig: {
        targetingType: 'self'
      },
      resourceCost: {
        resourceTypes: ['wild_instinct'],
        resourceValues: { wild_instinct: 15 },
        useFormulas: {},
        actionPoints: 5,
        components: ['verbal', 'somatic', 'material'],
        materialComponents: 'The heart of the World Beast, priceless artifact'
      },
      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },
      resolution: 'DICE',
      tags: ['transformation', 'buff', 'legendary', 'formbender']
    },

    {
      id: 'formbender_genesis_storm',
      name: 'Genesis Storm',
      description: 'Summon a storm of creation that births countless primal creatures.',
      level: 10,
      spellType: 'ACTION',
      effectTypes: ['summoning'],
      typeConfig: {
        school: 'nature',
        icon: 'spell_nature_starfall',
        tags: ['summoning', 'legendary', 'formbender'],
        castTime: 5,
        castTimeType: 'IMMEDIATE'
      },
      summonConfig: {
        creatures: [
          {
            id: 'primal_beast_pack',
            name: 'Primal Beast',
            description: 'Savage beasts of pure primal energy',
            size: 'Large',
            type: 'beast',
            tokenIcon: 'ability_druid_catform',
            stats: { maxHp: 80, armor: 15, maxMana: 0 },
            config: {
              quantity: 10,
              duration: 10,
              durationUnit: 'rounds',
              hasDuration: true,
              concentration: false,
              controlType: 'mental',
              controlRange: 100
            }
          },
          {
            id: 'elemental_guardians',
            name: 'Elemental Guardian',
            description: 'Powerful elemental protectors',
            size: 'Huge',
            type: 'elemental',
            tokenIcon: 'spell_nature_strengthofearth',
            stats: { maxHp: 120, armor: 18, maxMana: 0 },
            config: {
              quantity: 5,
              duration: 10,
              durationUnit: 'rounds',
              hasDuration: true,
              concentration: false,
              controlType: 'mental',
              controlRange: 100
            }
          }
        ],
        duration: 10,
        durationUnit: 'rounds',
        hasDuration: true,
        concentration: false,
        controlRange: 100,
        controlType: 'mental'
      },
      targetingConfig: {
        targetingType: 'ground',
        rangeType: 'ranged',
        rangeDistance: 80,
        aoeShape: 'circle',
        aoeParameters: { radius: 60 },
        targetRestrictions: [],
        maxTargets: 0,
        targetSelectionMethod: 'manual',
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: ['wild_instinct'],
        resourceValues: { wild_instinct: 12 },
        useFormulas: {},
        actionPoints: 5,
        components: ['verbal', 'somatic', 'material'],
        materialComponents: 'Seeds of creation, worth 80,000 gold'
      },
      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },
      resolution: 'DICE',
      tags: ['summoning', 'legendary', 'formbender']
    },

    {
      id: 'formbender_perfect_evolution',
      name: 'Perfect Evolution',
      description: 'Master the art of shapeshifting to seamlessly blend form benefits.',
      level: 10,
      spellType: 'PASSIVE',
      effectTypes: ['transformation'],
      typeConfig: {
        school: 'nature',
        icon: 'spell_nature_naturetouchgrow',
        tags: ['transformation', 'passive', 'mastery', 'formbender'],
        toggleable: true
      },
      transformationConfig: {
        transformationType: 'primal',
        targetType: 'self',
        duration: 0,
        durationUnit: 'permanent',
        power: 'major',
        newForm: 'Evolved Form',
        description: 'Master shapeshifter who has transcended normal limitations.',
        grantedAbilities: [
          { id: 'hybrid_forms', name: 'Hybrid Forms', description: 'Can maintain benefits of 2 forms simultaneously' },
          { id: 'instant_shift', name: 'Instant Shift', description: 'Form transitions cost 0 Wild Instinct' },
          { id: 'evolved_instinct', name: 'Evolved Instinct', description: 'Generate +2 Wild Instinct per round' },
          { id: 'ability_discount', name: 'Primal Efficiency', description: 'All Wild Instinct costs reduced by 1 (minimum 1)' }
        ]
      },
      targetingConfig: {
        targetingType: 'self'
      },
      resourceCost: {
        resourceTypes: [],
        resourceValues: {},
        useFormulas: {},
        actionPoints: 0,
        components: []
      },
      cooldownConfig: {
        type: 'none'
      },
      resolution: 'NONE',
      tags: ['transformation', 'passive', 'mastery', 'formbender', 'toggleable']
    }
  ],

  // Spell Pools by Level
  spellPools: {
    1: [
      'formbender_primal_strike',
      'formbender_wild_regeneration'
    ],
    2: [
      'formbender_beast_claws',
      'formbender_primal_senses',
      'formbender_wild_leap'
    ],
    3: [
      'formbender_feral_rage',
      'formbender_natures_armor',
      'formbender_hunt_call'
    ],
    4: [
      'formbender_savage_charge',
      'formbender_primal_healing',
      'formbender_beast_form_partial'
    ],
    5: [
      'formbender_pack_leader',
      'formbender_primal_rage',
      'formbender_adaptive_form'
    ],
    6: [
      'formbender_titan_form',
      'formbender_primal_fury_leap',
      'formbender_natures_gift'
    ],
    7: [
      'formbender_primal_avatar',
      'formbender_savage_roar',
      'formbender_apex_predator'
    ],
    8: [
      'formbender_savage_maelstrom',
      'formbender_natures_champion',
      'formbender_wild_hunt'
    ],
    9: [
      'formbender_primordial_form',
      'formbender_natures_apocalypse',
      'formbender_eternal_wild'
    ],
    10: [
      'formbender_world_beast',
      'formbender_genesis_storm',
      'formbender_perfect_evolution'
    ]
  }
};


